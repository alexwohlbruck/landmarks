/**
 * Fourth Presbyterian Church, Chicago (1914, Ralph Adams Cram) — original
 * procedural geometry, CC0-1.0.
 * bun generators/chi-fourth-presbyterian.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = centroid of the OSM outline way/129575948,
 * 41.898995,-87.624753. The outline's edges run at 88.7° / 178.7°, so the
 * catalog bearing is 358.7 and the church is square to this frame.
 *
 * Identity: the tall gabled east front facing Michigan Avenue, with
 * its great pointed window over the arched portal; the square tower at its
 * south-east corner, its belfry of paired lancets and the crocketed stone
 * spire with corner pinnacles; the long steep tiled nave roof over buttressed
 * walls.
 *
 * Evidence:
 *  - plan: OSM outline (church only; the parish house, cloister and Gratz
 *    Center are other OSM buildings and are not modelled). The front block
 *    (x 25.4-29.0, y -5.8-6.9), the tower (x 19.2-25.4, y -10.9 to -4.9),
 *    the aisle walls at y ±9.2 with buttresses at the OSM notches, and the
 *    wider western bays (x -18 to -1.5) are read off the outline.
 *  - heights: nothing is published, so all are measured from the frontal
 *    photos (Golbez 2008, hibino, GualdimG), scaled by the
 *    12.7 m width of the OSM front: front eaves ≈ 29.5 m, gable apex ≈ 35.5 m, tower shaft
 *    to ≈ 29 m, belfry to ≈ 36 m, spire tip ≈ 51 m (the ground-level
 *    photos foreshorten the top, so the spire is taken ~2 m over the raw
 *    48.7 m). Aisle and nave eaves are estimated from the north-side photo
 *    (Ken Lund). Expect ±2 m.
 *  - the western bays' heights are estimated from the 1910s postcard (PHS,
 *    public domain) and Smallbones' photo from the cloister.
 *  - left out: the gabled block seen south of the tower from Michigan
 *    Avenue stands outside this outline (it belongs to the parish house
 *    and cloister, other OSM buildings), as do the cloister arcades.
 *  - colour: warm tan-grey limestone (a finish near `stone`); the roofs are
 *    red-brown tile in Ken Lund's photo, drawn as a muted brown finish; the front and tower are covered in ivy in summer, which is left
 *    out (it changes with the season and would hide the forms).
 *
 * Photos (Wikimedia Commons): Fourth_Presbyterian_Church_June_8_08.jpg
 * (Golbez, CC BY-SA 3.0); A_Church_at_the_front_of_John_Hancock_Center
 * (hibino, CC BY 2.0); Fourth_Presbyterian_Church_of_Chicago_01.jpg
 * (GualdimG, CC BY-SA 4.0); Fourth_Presbyterian_Church,_Chicago,_Illinois
 * (41568846850) (Ken Lund, CC BY-SA 2.0); 4th_Presby_Chicago.JPG
 * (Smallbones, PD); Chicago_IL_4th_Presby_PHS945.jpg (postcard, PD).
 * USGS NAIP for the roof plan. No commercial imagery.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const stone = new Part(), roof = new Part(), win = new Part(), door = new Part(), belfry = new Part()

type XY = [number, number]
const ringAt = (pts: XY[], z: number): V3[] => pts.map(([x, y]) => [x, y, z])
function prism(p: Part, pts: XY[], z0: number, z1: number, top: Part | null = p) {
  p.loft([ringAt(pts, z0), ringAt(pts, z1)])
  if (top) top.cap(ringAt(pts, z1), true)
}
const rect = (x0: number, x1: number, y0: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
const box = (p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, top: Part | null = p) =>
  prism(p, rect(x0, x1, y0, y1), z0, z1, top)

/**
 * A gabled block running along x (or along y with `alongY`): walls to the
 * eave, gable end walls, and a slate roof with a small overhang.
 */
function gabled(x0: number, x1: number, y0: number, y1: number, eave: number, ridge: number, alongY = false, ends = [true, true]) {
  const P = (a: number, b: number, z: number): V3 => alongY ? [b, a, z] : [a, b, z]
  const [a0, a1, b0, b1] = alongY ? [y0, y1, x0, x1] : [x0, x1, y0, y1]
  const bm = (b0 + b1) / 2, o = .5
  // Long walls.
  const wall = (p: V3[]) => alongY ? stone.quad(p[1], p[0], p[3], p[2]) : stone.quad(p[0], p[1], p[2], p[3])
  wall([P(a0, b0, 0), P(a1, b0, 0), P(a1, b0, eave), P(a0, b0, eave)])
  wall([P(a1, b1, 0), P(a0, b1, 0), P(a0, b1, eave), P(a1, b1, eave)])
  // Gable ends.
  const end = (a: number, out: boolean) => {
    const q = [P(a, b1, 0), P(a, b0, 0), P(a, b0, eave), P(a, bm, ridge), P(a, b1, eave)]
    const v = (out !== alongY) ? q : [...q].reverse()
    stone.quad(v[0], v[1], v[2], v[4]); stone.tri(v[2], v[3], v[4])
  }
  if (ends[0]) end(a0, false)
  if (ends[1]) end(a1, true)
  // Roof planes, slightly overhanging.
  const s = (ridge - eave) / ((b1 - b0) / 2), dz = s * o
  const A0 = a0 - (ends[0] ? .3 : 0), A1 = a1 + (ends[1] ? .3 : 0)
  const r1 = [P(A0, b0 - o, eave - dz), P(A1, b0 - o, eave - dz), P(A1, bm, ridge), P(A0, bm, ridge)]
  const r2 = [P(A1, b1 + o, eave - dz), P(A0, b1 + o, eave - dz), P(A0, bm, ridge), P(A1, bm, ridge)]
  for (const r of [r1, r2]) alongY ? roof.quad(r[1], r[0], r[3], r[2]) : roof.quad(r[0], r[1], r[2], r[3])
}

/**
 * A flat pointed (equilateral) Gothic arch panel on a plane: centre c,
 * across-unit t, outward n. Each flank is an arc of radius w centred on the
 * opposite springing point, meeting at the point.
 */
function lancet(p: Part, c: V3, t: XY, n: XY, w: number, z0: number, z1: number, d = .06) {
  const rise = w * Math.sqrt(3) / 2, spring = Math.max(z0, z1 - rise)
  const pts: [number, number][] = [[-w / 2, z0], [w / 2, z0], [w / 2, spring]]
  for (const k of [1, 2, 3]) { const a = k * Math.PI / 12; pts.push([-w / 2 + w * Math.cos(a), spring + w * Math.sin(a)]) }
  pts.push([0, spring + rise])
  for (const k of [3, 2, 1]) { const a = k * Math.PI / 12; pts.push([w / 2 - w * Math.cos(a), spring + w * Math.sin(a)]) }
  pts.push([-w / 2, spring])
  const v = pts.map(([s, z]): V3 => [c[0] + t[0] * s + n[0] * d, c[1] + t[1] * s + n[1] * d, z])
  for (let i = 1; i < v.length - 1; i++) p.tri(v[0], v[i], v[i + 1])
}
const S: XY = [0, -1], N: XY = [0, 1], E: XY = [1, 0], Wd: XY = [-1, 0]
// Across-vectors, left to right seen from outside.
const tOf = (n: XY): XY => [-n[1], n[0]]

// Nave (ridge 33 m): one steep tiled roof over the full width, side walls to 16 m with
// tall lancets between buttresses (north-side photo: no separate aisles or
// clerestory show outside).
const NW = 9.2
gabled(-18.3, 25.4, -NW, NW, 16, 33, false, [false, false])
gabled(-27, -18.3, -7.4, 7.4, 16, 30.9, false, [true, false])
for (const side of [-1, 1]) {
  const y = side * NW, n = side < 0 ? S : N
  for (const x of [-1.5, 3.9, 9.0, 14.0]) box(stone, x - .55, x + .55, side < 0 ? y - 1 : y, side < 0 ? y : y + 1, 0, 13.5)
  for (const x of [1.2, 6.45, 11.5]) lancet(win, [x, y, 0], tOf(n), n, 2.3, 3.0, 13.0)
}
// The nave's end walls where the narrower west end and the front meet it.
for (const [x, out] of [[-18.3, -1], [25.4, 1]] as [number, number][]) {
  const yb = out < 0 ? 7.4 : 5.8
  for (const [y0, y1] of [[-NW, -yb], [yb, NW]]) {
    const q: V3[] = [[x, y0, 0], [x, y1, 0], [x, y1, 16], [x, y0, 16]]
    if (out > 0) stone.quad(q[0], q[1], q[2], q[3]); else stone.quad(q[1], q[0], q[3], q[2])
  }
}
// The wider western bays (x -18 to -1.5): lower wings with lean-to roofs.
box(stone, -18.3, -1.5, -11.2, -NW, 0, 12, null)
box(stone, -18.3, -1.5, NW, 10.4, 0, 12, null)
roof.quad([-18.3, -11.7, 11.7], [-1.5, -11.7, 11.7], [-1.5, -NW, 14], [-18.3, -NW, 14])
roof.quad([-1.5, 10.9, 11.7], [-18.3, 10.9, 11.7], [-18.3, NW, 14], [-1.5, NW, 14])
for (const x of [-14, -6]) {
  lancet(win, [x, -11.2, 0], tOf(S), S, 3.2, 3, 10.5)
  lancet(win, [x, 10.4, 0], tOf(N), N, 3.2, 3, 10.5)
}
// West end of the nave.
lancet(win, [-27, 0, 0], tOf(Wd), Wd, 4.2, 6, 19)

// The street front: a block standing forward of the nave, to a 34 m gable.
{
  const x0 = 25.4, x1 = 29.0, y0 = -5.8, y1 = 6.9, ym = (y0 + y1) / 2
  box(stone, x0, x1, y0, y1, 0, 29.5, null)
  stone.tri([x1, y0, 29.5], [x1, y1, 29.5], [x1, ym, 35.5])
  stone.tri([x0, y1, 29.5], [x0, y0, 29.5], [x0, ym, 35.5])
  roof.quad([x0 - .4, y0 - .3, 29.2], [x1 + .2, y0 - .3, 29.2], [x1 + .2, ym, 35.7], [x0 - .4, ym, 35.7])
  roof.quad([x1 + .2, y1 + .3, 29.2], [x0 - .4, y1 + .3, 29.2], [x0 - .4, ym, 35.7], [x1 + .2, ym, 35.7])
  // Corner buttresses with gabled tops, inside the front's width.
  for (const y of [y0 + .7, y1 - .7]) box(stone, x1 - .2, x1 + .9, y - .7, y + .7, 0, 30.5)
  // The deep arch: a stone frame, the great window, the portal below.
  const c: V3 = [x1, ym, 0]
  lancet(stone, c, tOf(E), E, 9.0, 3, 28.5, .12)
  lancet(win, c, tOf(E), E, 6.8, 12, 27, .2)
  lancet(door, c, tOf(E), E, 4.0, 0, 7.6, .2)
  // A small rose in the gable.
  const r = 1.0, cz = 31.8
  const ring = Array.from({ length: 10 }, (_, i): V3 => [x1 + .07, ym + r * Math.cos(i * Math.PI / 5), cz + r * Math.sin(i * Math.PI / 5)])
  for (let i = 0; i < 10; i++) win.tri([x1 + .07, ym, cz], ring[i], ring[(i + 1) % 10])
}

// The tower: square shaft, belfry with chamfered corners and paired
// lancets, a pierced parapet and pinnacles, then the octagonal spire.
{
  const cx = 22.3, cy = -7.9, h = 3.05, top = 29, bt = 36
  box(stone, cx - h, cx + h, cy - h, cy + h, 0, top, roof)
  const ch = .7, b = h - .2
  const bel: XY[] = [[cx - b + ch, cy - b], [cx + b - ch, cy - b], [cx + b, cy - b + ch], [cx + b, cy + b - ch],
    [cx + b - ch, cy + b], [cx - b + ch, cy + b], [cx - b, cy + b - ch], [cx - b, cy - b + ch]]
  prism(stone, bel, top, bt, null)
  for (const n of [S, E, N, Wd]) for (const s of [-1.05, 1.05]) {
    const t = tOf(n), c: V3 = [cx + n[0] * b + t[0] * s, cy + n[1] * b + t[1] * s, 0]
    lancet(belfry, c, t, n, 1.25, 29.8, 35.4)
  }
  prism(stone, bel.map(([x, y]): XY => [cx + (x - cx) * 1.06, cy + (y - cy) * 1.06]), bt, bt + 1.3, roof)
  // Corner pinnacles on the chamfers.
  for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
    const px = cx + sx * (b - .35), py = cy + sy * (b - .35)
    box(stone, px - .45, px + .45, py - .45, py + .45, bt - 1, bt + 2.2, null)
    const tp: V3[] = [[px - .45, py - .45, bt + 2.2], [px + .45, py - .45, bt + 2.2], [px + .45, py + .45, bt + 2.2], [px - .45, py + .45, bt + 2.2]]
    for (let i = 0; i < 4; i++) stone.tri(tp[i], tp[(i + 1) % 4], [px, py, bt + 4.2])
  }
  // Octagonal spire.
  const R = 1.85 / Math.cos(Math.PI / 8)
  const base = Array.from({ length: 8 }, (_, i): V3 => [cx + R * Math.cos(Math.PI / 8 + i * Math.PI / 4), cy + R * Math.sin(Math.PI / 8 + i * Math.PI / 4), bt + 1.3])
  for (let i = 0; i < 8; i++) stone.tri(base[i], base[(i + 1) % 8], [cx, cy, 51])
}

const parts = [
  { part: stone, material: finish('tan-limestone', 0xe2d5bd) },
  { part: roof, material: finish('brown-tile', 0xa27a68) },
  { part: win, material: PALETTE.window },
  { part: door, material: PALETTE.entrance },
  { part: belfry, material: finish('belfry-shadow', 0x5d6670) },
]
const triangles = parts.reduce((s, p) => s + p.part.triangles, 0)
const glb = writeGlb('Fourth Presbyterian Church', parts, {
  frame: 'Y up, -Z north, +X east; metres; ground anchor', anchor: [41.898995, -87.624753], bearing: 358.7,
})
if (triangles > 5000 || glb.length > 250000) throw new Error(`Budget exceeded: ${triangles} triangles / ${glb.length} bytes`)
const out = process.argv[2] ?? new URL('../models/chi-fourth-presbyterian.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
