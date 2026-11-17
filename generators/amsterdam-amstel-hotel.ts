/**
 * InterContinental Amstel Hotel, Amsterdam — procedural, CC0-1.0, no textures.
 * bun generators/amsterdam-amstel-hotel.ts
 *
 * The Amstel Hotel of 1863–1867 (C. Outshoorn), on the east bank of the
 * Amstel: a long block of red-brown brick over a rusticated sandstone
 * ground storey with arched windows, sandstone pilasters, quoins and
 * cornices, under a slate mansard with a dormer in every bay; two corner
 * pavilions with taller crested mansards; a central pavilion with a still
 * higher mansard, an ornate central gable and two small domed turrets. On
 * the river side a terrace runs the length of the front, with the white
 * glass conservatory (the restaurant) in the middle.
 *
 * Note: the brief described the hotel as white/cream stucco. Every daylight
 * photo shows red-brown brick with cream sandstone dressings, so it is drawn
 * that way.
 *
 * Map frame: x = model east (bearing 163.2°, upstream along the Amstel),
 * y = model north (bearing 73.2°, toward the Professor Tulpplein), z up,
 * metres. The Amstel front faces −y. Placed at bearing 73.2° (the outline's
 * long edges). Anchor: the outline's area centroid, which lies on the axis
 * of symmetry (the outline runs x −43.5…43.1 with the pavilions and the
 * central projection mirrored about x = 0).
 *
 * Evidence
 * - OSM way/268998398 (building=hotel, start_date 1867, ref:bag
 *   0363100012165491), no building:parts: main block x ±39.7, y −6.3…12.9;
 *   pavilion projections x ±(28.4…39.7) and the central one x ±8.9 to
 *   y 14.2 on the Tulpplein side; low end porches to x ±43.3; the river
 *   terrace x ±29, y −6.3…−15.5.
 * - 3D BAG (3dbag.nl, CC BY 4.0, TU Delft / 3DGI), NL.IMBAG.Pand.
 *   0363100012165491, LoD2.2 roof surfaces from AHN lidar, sampled on a 3 m
 *   grid in this frame (ground NAP −0.04): ranges' mansard tops 25.8–26.9;
 *   corner pavilions 28.4 (west) and 27.8 (east); central pavilion 29.5
 *   (x −3…3); river terrace 3.5; conservatory 10.5–11.2 (x −10…13), its
 *   eaves about 8.5; end porches 2.5–5.5.
 * - Photos (Wikimedia Commons, all EVIDENCE):
 *   - Massimo Catarinella, "AmstelHotelAmsterdam.jpg", CC BY-SA 3.0 — the
 *     river front straight on: storeys, bays, pavilions, turrets.
 *     https://commons.wikimedia.org/wiki/File:AmstelHotelAmsterdam.jpg
 *   - C messier, "Amstel Hotel 2030.jpg", CC BY-SA 4.0 — from the
 *     south-west: the south end, pavilion cresting, conservatory.
 *     https://commons.wikimedia.org/wiki/File:Amstel_Hotel_2030.jpg
 *   - Janericloebe, "Amsterdam Amstel Hotel 001.JPG", public domain — the
 *     river front from the north-west, distant and level.
 *     https://commons.wikimedia.org/wiki/File:Amsterdam_Amstel_Hotel_001.JPG
 *   - Suicasmo, "Amstel Hotel 20150911.jpg", CC BY-SA 4.0 — close from the
 *     river: the central pavilion's gable and domes, dormers, cornices.
 *     https://commons.wikimedia.org/wiki/File:Amstel_Hotel_20150911.jpg
 * - Estimated from the photos, scaled to the 3D BAG: basement/terrace
 *   storey 3.5 m, sandstone ground storey to 7.6, brick to the main cornice
 *   15.6–16.3, a top brick storey to 20.8, mansard to 26; bays 3.3–3.6 m
 *   (counted); turret domes to 31.5 with finials.
 *
 * Colour: red-brown brick (#7e5a52: the photos' purplish brown, pulled light), cream
 * sandstone, blue-grey slate, the conservatory white with pale glass.
 *
 * Night: the brick and stone fronts are floodlit; windows glow.
 *
 * Doubts: no photo of the Tulpplein (east) front was used; it is drawn like
 * the river front without the terrace (the main entrance porch is left out).
 * The windows are grouped two storeys to a panel; the red awnings,
 * balconies, cresting ironwork and the gable's sculpture are left out. The
 * domed turrets are drawn on both long fronts of the central pavilion; only
 * the river side is photographed.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { finishModel, quadN, unit, type XY } from './nyc-570-lexington'
import { rectPanel, archPanel, block } from './nyc-city-hall'
import { dome } from './nyc-city-hall'

const brick = new Part(), stone = new Part(), slate = new Part(), win = new Part(), glass = new Part(), white = new Part()

const Y0 = -6.3, Y1 = 12.9 // river and Tulpplein faces of the main block
const STONE_TOP = 7.6, CORNICE = 15.6, TOPC = 20.8

/** A wall a→b (counter-clockwise, facing out) between z0 and z1. */
function wall(p: Part, a: XY, b: XY, z0: number, z1: number) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n: V3 = [(b[1] - a[1]) / L, -(b[0] - a[0]) / L, 0]
  quadN(p, [a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1], [n, n, n, n])
}
/** A mansard: from rectangle r at z0 up to r inset by `inset` at z1, flat top. */
function mansard(p: Part, r: [number, number, number, number], z0: number, z1: number, inset: number, top: Part = p) {
  const [x0, y0, x1, y1] = r
  const B: V3[] = [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]]
  const T: V3[] = [[x0 + inset, y0 + inset, z1], [x1 - inset, y0 + inset, z1], [x1 - inset, y1 - inset, z1], [x0 + inset, y1 - inset, z1]]
  const c: V3 = [(x0 + x1) / 2, (y0 + y1) / 2, 0]
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    const m = unit([(B[i][0] + B[j][0]) / 2 - c[0], (B[i][1] + B[j][1]) / 2 - c[1], 0])
    const n = unit([m[0], m[1], inset / (z1 - z0) * 1.0])
    quadN(p, B[i], B[j], T[j], T[i], [n, n, n, n])
  }
  top.cap(T, true)
}
/** A dormer on a mansard face: `e` the eave point below its centre, `t` along the eave, `o` the outward normal. */
function dormer(e: V3, t: XY, o: XY, w: number, z0: number, z1: number, depth: number) {
  const P = (u: number, d: number, z: number): V3 => [e[0] + t[0] * u + o[0] * d, e[1] + t[1] * u + o[1] * d, z]
  const h = w / 2, back = -depth
  // Front, sides, roof.
  const n: V3 = [o[0], o[1], 0], s0: V3 = [-t[0], -t[1], 0], s1: V3 = [t[0], t[1], 0]
  quadN(stone, P(-h, 0.15, z0), P(h, 0.15, z0), P(h, 0.15, z1), P(-h, 0.15, z1), [n, n, n, n])
  stone.tri(P(-h - 0.15, 0.2, z1), P(h + 0.15, 0.2, z1), P(0, 0.2, z1 + 0.8))
  quadN(stone, P(-h, back, z0), P(-h, 0.15, z0), P(-h, 0.15, z1), P(-h, back, z1), [s0, s0, s0, s0])
  quadN(stone, P(h, 0.15, z0), P(h, back, z0), P(h, back, z1), P(h, 0.15, z1), [s1, s1, s1, s1])
  for (const sg of [-1, 1]) {
    const r = unit([t[0] * sg, t[1] * sg, 1])
    quadN(slate, P(sg * (h + 0.15), 0.2, z1), P(sg * (h + 0.15), back, z1), P(0, back, z1 + 0.8), P(0, 0.2, z1 + 0.8), [r, r, r, r])
  }
  const f = P(0, 0.2, 0)
  rectPanel(win, [f[0] - t[0] * h, f[1] - t[1] * h], [f[0] + t[0] * h, f[1] + t[1] * h], h, w * 0.55, z0 + 0.3, z1 - 0.2, 0.02)
}

// ---------------------------------------------------------------- facades
/** One front stretch from a to b with `n` bays (counter-clockwise, facing out). */
function front(a: XY, b: XY, n: number, o: { zTop: number; pavilion?: boolean; basement?: boolean }) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  wall(stone, a, b, 0, STONE_TOP)
  wall(brick, a, b, STONE_TOP, o.zTop)
  for (let k = 0; k < n; k++) {
    const s = (L * (k + 0.5)) / n
    if (o.basement) rectPanel(win, a, b, s, 1.6, 0.9, 2.8, 0.05)
    archPanel(win, a, b, s, 1.7, 3.9, 7.0, 0.05, 8)
    rectPanel(win, a, b, s, 1.55, 8.6, 14.8, 0.05)
    rectPanel(win, a, b, s, 1.55, 16.9, 19.6, 0.05)
  }
}
/** Bands round a ring: proud stone courses. */
function courses(ring: XY[], list: [number, number, number][]) {
  for (const [z0, z1, d] of list) {
    const n = ring.length
    for (let i = 0; i < n; i++) {
      const a = ring[i], b = ring[(i + 1) % n]
      const L = Math.hypot(b[0] - a[0], b[1] - a[1]), nx = (b[1] - a[1]) / L, ny = -(b[0] - a[0]) / L
      const A: XY = [a[0] + nx * d - (b[0] - a[0]) / L * d, a[1] + ny * d - (b[1] - a[1]) / L * d]
      const B: XY = [b[0] + nx * d + (b[0] - a[0]) / L * d, b[1] + ny * d + (b[1] - a[1]) / L * d]
      wall(stone, A, B, z0, z1)
      const up: V3 = [0, 0, 1]
      quadN(stone, [a[0], a[1], z1], [b[0], b[1], z1], [B[0], B[1], z1], [A[0], A[1], z1], [up, up, up, up])
      const dn: V3 = [0, 0, -1]
      quadN(stone, [A[0], A[1], z0], [B[0], B[1], z0], [b[0], b[1], z0], [a[0], a[1], z0], [dn, dn, dn, dn])
    }
  }
}
const COURSES: [number, number, number][] = [[STONE_TOP - 0.1, STONE_TOP + 0.5, 0.25], [CORNICE, CORNICE + 0.7, 0.4], [TOPC - 0.6, TOPC, 0.55]]

// The volumes: [x0, x1, y0, y1, mansard top, inset, bays along x, kind]
type Vol = { x0: number; x1: number; y0: number; y1: number; top: number; inset: number; bays: number; kind: 'range' | 'pav' | 'centre' }
const vols: Vol[] = []
for (const s of [-1, 1]) {
  vols.push({ x0: s > 0 ? 9 : -29, x1: s > 0 ? 29 : -9, y0: Y0, y1: Y1, top: 26.0, inset: 2.6, bays: 6, kind: 'range' })
  vols.push({ x0: s > 0 ? 29 : -39.7, x1: s > 0 ? 39.7 : -29, y0: Y0 - 0.3, y1: Y1 + 1.3, top: 28.2, inset: 1.6, bays: 3, kind: 'pav' })
}
vols.push({ x0: -9, x1: 9, y0: Y0 - 0.2, y1: Y1 + 1.2, top: 29.0, inset: 1.8, bays: 5, kind: 'centre' })

for (const v of vols) {
  const { x0, x1, y0, y1 } = v
  const ring: XY[] = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
  // River face (south in the frame, −y), east face (+y), ends only where exposed.
  front([x0, y0], [x1, y0], v.bays, { zTop: TOPC, basement: true })
  front([x1, y1], [x0, y1], v.bays, { zTop: TOPC })
  if (v.kind === 'pav') {
    const outer = x0 < 0 ? x0 : x1
    if (outer === x1) front([x1, y0], [x1, y1], 5, { zTop: TOPC })
    else front([x0, y1], [x0, y0], 5, { zTop: TOPC })
    // Pavilion side walls facing the ranges' fronts (the projections).
    const inner = x0 < 0 ? x1 : x0, sg = x0 < 0 ? 1 : -1
    for (const [ya, yb] of [[y0, Y0], [Y1, y1]]) {
      const a: XY = sg > 0 ? [inner, ya] : [inner, yb], b: XY = sg > 0 ? [inner, yb] : [inner, ya]
      wall(stone, a, b, 0, STONE_TOP); wall(brick, a, b, STONE_TOP, TOPC)
    }
    // Sandstone quoin strips on the pavilion corners.
    for (const cx of [x0, x1]) for (const cy of [y0, y1]) block(stone, cx - 0.55, cy - 0.55, cx + 0.55, cy + 0.55, STONE_TOP, TOPC)
  }
  if (v.kind === 'centre') {
    for (const [ya, yb] of [[y0, Y0], [Y1, y1]]) {
      wall(brick, [x0, yb], [x0, ya], STONE_TOP, TOPC); wall(stone, [x0, yb], [x0, ya], 0, STONE_TOP)
      wall(brick, [x1, ya], [x1, yb], STONE_TOP, TOPC); wall(stone, [x1, ya], [x1, yb], 0, STONE_TOP)
    }
    // Sandstone pilasters framing the central bays.
    for (const px of [-9, -5.4, 5.4, 9]) for (const py of [y0, y1]) block(stone, px - 0.5, py - 0.35, px + 0.5, py + 0.35, STONE_TOP, TOPC)
  }
  courses(ring, COURSES)
  // Mansard roof and its dormers.
  mansard(slate, [x0 + 0.2, y0 + 0.2, x1 - 0.2, y1 - 0.2], TOPC, v.top, v.inset)
  if (v.kind !== 'range') {
    // Cresting: a stone rim round the flat top.
    const i = v.inset + 0.2
    courses([[x0 + i, y0 + i], [x1 - i, y0 + i], [x1 - i, y1 - i], [x0 + i, y1 - i]], [[v.top, v.top + 0.5, 0.1]])
  }
  const L = x1 - x0, slope = v.inset / (v.top - TOPC)
  for (let k = 0; k < v.bays; k++) {
    const x = x0 + (L * (k + 0.5)) / v.bays
    if (v.kind === 'centre' && Math.abs(x) < 1) continue
    const z0 = TOPC + 0.3, z1 = v.kind === 'range' ? 23.4 : 24.2, d = slope * (z1 - TOPC) + 0.3
    dormer([x, y0 + 0.2 + slope * 0.3, 0], [1, 0], [0, -1], 1.5, z0, z1, d)
    dormer([x, y1 - 0.2 - slope * 0.3, 0], [-1, 0], [0, 1], 1.5, z0, z1, d)
  }
}

// ---------------------------------------------------------------- central gable and turrets
for (const [y, s] of [[Y0 - 0.2, -1], [Y1 + 1.2, 1]] as [number, number][]) {
  const yf = y + s * 0.05
  // A tall stone gable over the middle bay, rising through the mansard.
  const g: V3[] = [[-2.6, yf, TOPC], [2.6, yf, TOPC], [2.6, yf, 26.4], [0, yf, 30.2], [-2.6, yf, 26.4]]
  const n: V3 = [0, s, 0]
  for (let i = 1; i < g.length - 1; i++) stone.tri(g[0], g[i], g[i + 1], undefined, undefined, undefined, [n, n, n])
  for (const sg of [-1, 1]) {
    const m: V3 = [sg, 0, 0]
    quadN(stone, [sg * 2.6, yf, TOPC], [sg * 2.6, yf - s * 2.4, TOPC], [sg * 2.6, yf - s * 2.4, 26.4], [sg * 2.6, yf, 26.4], [m, m, m, m])
    const r = unit([sg * 3.8, 0, 2.6])
    quadN(slate, [sg * 2.7, yf + s * 0.1, 26.3], [sg * 2.7, yf - s * 2.4, 26.3], [0, yf - s * 2.4, 30.1], [0, yf + s * 0.1, 30.1], [r, r, r, r])
  }
  archPanel(win, s < 0 ? [-2.6, yf] : [2.6, yf], s < 0 ? [2.6, yf] : [-2.6, yf], 2.6, 1.8, 22.0, 25.4, 0.05, 8)
  // Domed turrets at the central pavilion's front corners.
  for (const sx of [-1, 1]) {
    const cx = sx * 6.6, cy = y - s * 0.9
    const ring = (r: number, z: number): V3[] => Array.from({ length: 12 }, (_, i) => [cx + r * Math.cos((i * Math.PI) / 6), cy + r * Math.sin((i * Math.PI) / 6), z] as V3)
    const r0 = ring(1.25, TOPC), r1 = ring(1.25, 26.6)
    stone.loft([r0, r1])
    courses(r1.map(([x, yy]) => [x, yy] as XY), [[26.6, 27.0, 0.15]])
    dome(slate, cx, cy, 1.3, 27.0, 1.9, 12, 4)
    // Finial.
    const f: V3[] = [[cx - 0.18, cy - 0.18, 28.8], [cx + 0.18, cy - 0.18, 28.8], [cx + 0.18, cy + 0.18, 28.8], [cx - 0.18, cy + 0.18, 28.8]]
    for (let i = 0; i < 4; i++) stone.tri(f[i], f[(i + 1) % 4], [cx, cy, 30.8])
  }
}

// ---------------------------------------------------------------- end porches
for (const s of [-1, 1]) {
  const xa = s > 0 ? 39.7 : -43.3, xb = s > 0 ? 43.3 : -39.7
  block(stone, xa, -5.0, xb, 12.6, 0, 3.4)
}

// ---------------------------------------------------------------- river terrace and conservatory
// The terrace storey: a stone front with the restaurant windows, its flat top the terrace.
{
  const t0 = -15.4, zT = 3.5
  const ring: XY[] = [[-29, t0], [29, t0], [29, Y0 - 0.3], [-29, Y0 - 0.3]]
  for (let i = 0; i < 4; i++) wall(brick, ring[i], ring[(i + 1) % 4], 0, zT)
  stone.cap(ring.map(([x, y]) => [x, y, zT] as V3), true)
  for (let k = 0; k < 16; k++) rectPanel(win, [-29, t0], [29, t0], 58 * (k + 0.5) / 16, 2.3, 0.6, 2.8, 0.05)
  courses(ring, [[zT, zT + 0.5, 0.15]])
}
{
  const cx0 = -10.5, cx1 = 13.5, cy0 = -14.4, cy1 = Y0 - 0.3, z0 = 4.0, ze = 8.6, zr = 11.0
  const ring: XY[] = [[cx0, cy0], [cx1, cy0], [cx1, cy1], [cx0, cy1]]
  for (let i = 0; i < 3; i++) {
    const a = ring[i], b = ring[i + 1]
    wall(white, a, b, z0, ze)
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.round(L / 2.4))
    rectPanel(win, a, b, L / 2, L - 0.8, z0 + 0.6, ze - 0.7, 0.05)
    for (let k = 1; k < n; k++) rectPanel(white, a, b, (L * k) / n, 0.3, z0 + 0.5, ze - 0.6, 0.08)
  }
  // Cornice and the hipped glass roof.
  courses(ring, [[ze - 0.4, ze, 0.25]])
  const h = (cy1 - cy0) / 2, cym = (cy0 + cy1) / 2
  const A: V3 = [cx0, cy0, ze], B: V3 = [cx1, cy0, ze], C: V3 = [cx1, cy1, ze], D: V3 = [cx0, cy1, ze]
  const r0: V3 = [cx0 + h, cym, zr], r1: V3 = [cx1 - h, cym, zr]
  glass.quad(A, B, r1, r0); glass.quad(C, D, r0, r1); glass.tri(B, C, r1); glass.tri(D, A, r0)
  block(white, cx0 + h, cym - 0.15, cx1 - h, cym + 0.15, zr - 0.05, zr + 0.3)
}

// ---------------------------------------------------------------- write
const flood = (p: V3, n: V3) => (Math.abs(n[2]) < 0.5 && p[2] < TOPC + 0.1 ? 0.55 : 0)
finishModel('Amstel Hotel', 'amsterdam-amstel-hotel', [
  { part: brick, material: { ...finish('amstel-brick', 0x7e5a52), floodlight: flood } },
  { part: stone, material: { ...finish('amstel-sandstone', 0xe6d8b8), floodlight: flood } },
  { part: slate, material: finish('amstel-slate', 0x8a949e) },
  { part: win, material: PALETTE.window },
  { part: glass, material: { ...PALETTE.glass, color: 0xb4c8d4 } },
  { part: white, material: PALETTE.trim },
], { bearing: 73.2, osm: 'way/268998398', height: 30.8 }, 6500)
