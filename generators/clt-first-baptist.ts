/**
 * First Baptist Church Charlotte, 301 S Davidson St, Charlotte (1970s).
 *
 * Not Neo-Byzantine: the domed First Baptist on N College St (1909) is the
 * old church, now the McGlohon Theatre at Spirit Square. This is the
 * congregation's modernist campus of buff brick: a sanctuary under a broad
 * hipped roof with a glazed gable to the north-west, a flat-roofed narthex
 * fronted by a portico of tall square piers, a curved colonnade of the same
 * piers sweeping south-west round a courtyard, a tall open campanile of four
 * slender piers standing in the colonnade, and two- and three-storey wings
 * for offices and classrooms to the south.
 *
 * Frame: bearing 0, +y north.
 *
 * Sources
 * - OSM relation/16014018 (outer way/732004961, inner way/322277877 = the
 *   courtyard), height 27.
 * - USGS lidar USGS_LPC_NC_Phase4_Mecklenburg_2016 (flown 2016-17), 1 m grid:
 *   campanile top 57.5 above the box's lowest ground; sanctuary ridge 23.1,
 *   eaves 14.3; narthex and portico 14.3; south wing 15.5-15.7, its western
 *   block to 18; ground 7.2 on the west, 2.5-3.5 on the east and south.
 * - USGS NAIP: the plan, the sanctuary's hipped roof, the courtyard.
 * - Photos, Dclemens1971, 19 Oct 2025, CC BY 4.0 (EVIDENCE):
 *   https://commons.wikimedia.org/wiki/File:First_Baptist_Church_Charlotte_01.jpg (campanile, curved colonnade)
 *   https://commons.wikimedia.org/wiki/File:First_Baptist_Church_Charlotte_03.jpg (campanile head-on)
 *   https://commons.wikimedia.org/wiki/File:First_Baptist_Church_Charlotte_05.jpg (narthex portico, sanctuary gable)
 *   https://commons.wikimedia.org/wiki/File:First_Baptist_Church_Charlotte_07.jpg (the front from the street)
 *   https://commons.wikimedia.org/wiki/File:First_Baptist_Church_Charlotte_09.jpg (front and campanile from the NW)
 *
 * Numbers (y = 0 is the ground on the east side, lidar 2.5)
 * - Campanile shaft to 52.0, cap to 54.0, cross to 59.0: shaft and cap
 *   measured (lidar 57.5 includes the cap's top), cross photo-scaled.
 * - Sanctuary eaves 11.8, ridge 20.6; narthex and portico 11.8; south
 *   wings 13.0: measured (lidar).
 * - Plans: OSM outline and NAIP; the split into sanctuary, narthex and
 *   wings estimated from NAIP roof colours and lidar steps.
 * - Piers: 1.2 m square, about 4.5 m apart: photo-estimated.
 *
 * Compared with photo 09 (render from 300). Still differs: from the street
 * the real front reads as a tall flat brick wall with the glazed gable
 * rising from it, while the model shows more of the hipped roof behind;
 * the campanile's piers are drawn straight, the real ones taper slightly;
 * the sanctuary's side windows are not drawn (no photo shows them).
 *
 * Doubts
 * - The south wings and the courtyard faces are not photographed; plain
 *   brick with window bands, estimated.
 * - The campanile is one lidar cell wide; its 4.8 m plan is photo-scaled
 *   (width to height about 1:11 in photo 03).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cap, panel, save, walls, onWall, type XY } from './chi-aon-center'

const BEARING = 0
const ANCHOR: [number, number] = [35.2204335, -80.8404994]
// OSM frame origin -80.84029, 35.22042; the outline's centroid is (-19.05, 1.49) in it
const OX = 19.05, OY = -1.49
const S = (r: XY[]): XY[] => r.map(([x, y]) => [x + OX, y + OY] as XY)
const P3 = (x: number, y: number, z: number): V3 => [x + OX, y + OY, z]

const brick = new Part(), trim = new Part(), win = new Part(), roof = new Part(), glass = new Part(), metal = new Part()

const EAVES = 11.8, RIDGE = 20.6, FLAT = 11.8, WING = 13.0

/** A box from a counter-clockwise ring, flat roofed, with a pale coping. */
function flatBlock(r: XY[], z1: number) {
  walls(brick, r, 0, z1 - 0.6)
  walls(trim, r, z1 - 0.6, z1)
  cap(roof, r, z1)
}
function bands(r: XY[], rows: [number, number][], bay = 5, minLen = 8) {
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length], { L } = onWall(a, b)
    if (L < minLen) continue
    const n = Math.round(L / bay), w = L / n
    for (let k = 0; k < n; k++) for (const [z0, z1] of rows) panel(win, a, b, k * w + 0.8, (k + 1) * w - 0.8, z0, z1, 0.05)
  }
}
/** A square pier, w wide, from z0 to z1. */
function pier(p: Part, x: number, y: number, w: number, z0: number, z1: number) {
  const h = w / 2
  const r: XY[] = [[x - h, y - h], [x + h, y - h], [x + h, y + h], [x - h, y + h]]
  walls(p, r, z0, z1)
  cap(p, r, z1)
}

// ---------------------------------------------------------------- the sanctuary: hipped to the SE, gabled to the NW
{
  // corners (OSM frame, from NAIP): NW end (-19,31)-(-5.2,56.3), SE end (26,1.9)-(40.9,24.5)
  const A: XY = [-19, 31], B: XY = [26, 1.9], C: XY = [40.9, 24.5], D: XY = [-5.2, 56.3]
  const Q = S([A, B, C, D])
  walls(brick, Q, 0, EAVES)
  // ridge along the long axis, from the NW gable to a hip 10 m short of the SE end
  const mid = (p: XY, q: XY): XY => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2]
  const r0 = mid(A, D), r1e = mid(B, C)
  const t = 10 / Math.hypot(r1e[0] - r0[0], r1e[1] - r0[1])
  const r1: XY = [r1e[0] + (r0[0] - r1e[0]) * t, r1e[1] + (r0[1] - r1e[1]) * t]
  const [a, b, c, d] = Q.map(([x, y]) => [x, y, EAVES] as V3)
  const R0 = P3(r0[0], r0[1], RIDGE), R1 = P3(r1[0], r1[1], RIDGE)
  roof.quad(a, b, R1, R0)          // SW slope
  roof.quad(c, d, R0, R1)          // NE slope
  roof.tri(b, c, R1)               // SE hip
  // the NW gable wall, glazed in two big angled lights (photos 05, 09)
  brick.tri(d, a, R0)
  const A0 = P3(A[0], A[1], EAVES), D0 = P3(D[0], D[1], EAVES)
  const lerp3 = (p: V3, q: V3, s: number): V3 => [p[0] + (q[0] - p[0]) * s, p[1] + (q[1] - p[1]) * s, p[2] + (q[2] - p[2]) * s]
  const out = (p: V3): V3 => { const nx = -(A[1] - D[1]), ny = A[0] - D[0], l = Math.hypot(nx, ny); return [p[0] - nx / l * 0.06, p[1] - ny / l * 0.06, p[2]] }
  for (const [s0, s1] of [[0.18, 0.46], [0.54, 0.82]]) {
    const p0 = lerp3(D0, A0, s0), p1 = lerp3(D0, A0, s1)
    const top = (s: number) => lerp3(s < 0.5 ? lerp3(D0, R0, s / 0.5) : lerp3(R0, A0, (s - 0.5) / 0.5), [0, 0, 0], 0)
    const q0 = top(s0), q1 = top(s1)
    const lo = 1.2, hi = 1.0
    win.quad(out([p0[0], p0[1], p0[2] + lo]), out([p1[0], p1[1], p1[2] + lo]), out([q1[0], q1[1], q1[2] - hi]), out([q0[0], q0[1], q0[2] - hi]))
  }
  // tall windows down the long sides
  bands([Q[0], Q[1], Q[2], Q[3]], [[2.0, EAVES - 1.5]], 7, 30)
}

// ---------------------------------------------------------------- the narthex, between the sanctuary and the courtyard
const NARTHEX: XY[] = S([[-35.6, 18.6], [-32.1, 16.9], [-8.3, 2.2], [10.0, -2.0], [26, 1.9], [-19, 31], [-29.7, 28.2]])
flatBlock(NARTHEX, FLAT)
// its front: glass between the portico piers (photo 05)
{
  const a = NARTHEX[6], b = NARTHEX[0], c = NARTHEX[5]
  panel(win, c, a, 0.8, Math.hypot(a[0] - c[0], a[1] - c[1]) - 0.8, 0.4, FLAT - 2.0, 0.05)
  panel(win, a, b, 0.5, Math.hypot(b[0] - a[0], b[1] - a[1]) - 0.5, 0.4, FLAT - 2.0, 0.05)
}

// ---------------------------------------------------------------- the south wings
const SWING: XY[] = S(([[-21.5, -18.7], [-8.3, 2.2], [-32.1, 16.9], [-36.1, -28.3], [-29.6, -25.5]] as XY[]).reverse())
// (the courtyard's east side is open; the wing runs along the outline's SE edge)
const OFFICE: XY[] = S([[-43.6, -31.3], [-23.6, -37.5], [-18.4, -34.9], [-6.1, -19.2], [5.3, -1.1], [10.0, -2.0], [-8.3, 2.2], [-21.5, -18.7], [-29.6, -25.5], [-36.1, -28.3]])
flatBlock(OFFICE, WING)
bands(OFFICE, [[1.4, 5.0], [6.6, 10.8]], 5, 9)
const EDU: XY[] = S([[-83.0, -12.6], [-65.9, -54.2], [-63.0, -56.9], [-47.6, -50.7], [-48.9, -47.7], [-23.6, -37.5], [-43.6, -31.3], [-51.9, -10.5], [-60.8, -14.2], [-63.1, -8.6], [-64.9, -5.6]])
flatBlock(EDU, WING)
bands(EDU, [[1.4, 5.0], [6.6, 10.8]], 5, 9)
void SWING

// ---------------------------------------------------------------- the colonnade: tall piers under a flat beam, curving round the courtyard
{
  const curve: XY[] = [[-5.7, 56.9], [-11.4, 53.5], [-16.2, 48.9], [-20.1, 43.5], [-29.7, 28.2], [-35.6, 18.6], [-41.6, 10.8], [-48.9, 3.6], [-59.5, -3.1], [-64.9, -5.6], [-83.0, -12.6]]
  const H = 9.4, DEPTH = 4.2
  // outward normal: away from the courtyard (to the north-west)
  for (let i = 0; i < curve.length - 1; i++) {
    const p = curve[i], q = curve[i + 1]
    const L = Math.hypot(q[0] - p[0], q[1] - p[1]), ux = (q[0] - p[0]) / L, uy = (q[1] - p[1]) / L
    const nx = uy, ny = -ux // right of travel = outside (north-west)
    const o = (x: number, y: number, d: number): XY => [x + nx * d, y + ny * d]
    // beam: a slab from the wall line out to DEPTH
    const b0 = o(p[0], p[1], 0), b1 = o(q[0], q[1], 0), b2 = o(q[0], q[1], DEPTH), b3 = o(p[0], p[1], DEPTH)
    const slab = S([b0, b3, b2, b1])
    walls(trim, slab, H, H + 1.2)
    cap(trim, slab, H + 1.2)
    cap(trim, slab, H, false)
    // piers on the outer line
    const n = Math.max(1, Math.round(L / 4.5))
    for (let k = 0; k < n; k++) {
      const s = (k + 0.5) * L / n, c = o(p[0] + ux * s, p[1] + uy * s, DEPTH - 0.7)
      pier(trim, c[0] + OX, c[1] + OY, 1.2, 0, H)
    }
  }
}

// ---------------------------------------------------------------- the campanile: four slender piers, cross-ties, a belfry and a cross
{
  const cx = -47.0, cy = 4.5, half = 2.4, SHAFT = 52.0
  for (const [dx, dy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) pier(trim, cx + OX + dx * (half - 0.7), cy + OY + dy * (half - 0.7), 1.4, 0, SHAFT)
  // a solid lower stage, then cross-ties every ~6 m, then a solid belfry band
  const ring: XY[] = S([[cx - half + 0.3, cy - half + 0.3], [cx + half - 0.3, cy - half + 0.3], [cx + half - 0.3, cy + half - 0.3], [cx - half + 0.3, cy + half - 0.3]])
  walls(brick, ring, 0, 10.4)
  for (let z = 15; z < SHAFT - 6; z += 6.2) walls(trim, ring, z, z + 0.7)
  walls(brick, ring, SHAFT - 5.5, SHAFT - 4.5)
  // the cap and the finial block
  const capR: XY[] = S([[cx - half, cy - half], [cx + half, cy - half], [cx + half, cy + half], [cx - half, cy + half]])
  walls(trim, capR, SHAFT, SHAFT + 0.8)
  cap(trim, capR, SHAFT + 0.8)
  pier(trim, cx + OX, cy + OY, 1.1, SHAFT + 0.8, SHAFT + 2.0)
  // the cross
  pier(metal, cx + OX, cy + OY, 0.3, SHAFT + 2.0, SHAFT + 7.0)
  const bar: XY[] = S([[cx - 1.1, cy - 0.15], [cx + 1.1, cy - 0.15], [cx + 1.1, cy + 0.15], [cx - 1.1, cy + 0.15]])
  walls(metal, bar, SHAFT + 5.2, SHAFT + 5.5)
  cap(metal, bar, SHAFT + 5.5)
  cap(metal, bar, SHAFT + 5.2, false)
}
void glass

if (import.meta.main) {
  await save('clt-first-baptist', 'First Baptist Church Charlotte', ANCHOR, BEARING, [
    { part: brick, material: finish('fbc-brick', 0xe7d9c0) },
    { part: trim, material: PALETTE.trim },
    { part: win, material: PALETTE.window },
    { part: roof, material: PALETTE.roof },
    { part: metal, material: finish('fbc-cross', 0xb9bcbf) },
  ])
}
