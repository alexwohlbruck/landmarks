/**
 * Moody Center (2022, Gensler), the University of Texas arena, 2001 Robert
 * Dedman Drive, Austin — procedural, CC0-1.0, no textures.
 *   bun generators/atx-moody-center.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0. Anchor = area
 * centroid of OSM way/953200132 ("Moody Center", building=stadium),
 * -97.730639, 30.280974. z = 0 is the lowest ground under the footprint,
 * at the west tip; the main plaza on the north-west, where the corner entry
 * is, stands about 2 m higher, and the ground rises about 10 m to Red River
 * Street on the east (Mapterhorn), so the east walls sink into the slope.
 *
 * Identity: one huge rounded roof, a thin dark rim over a warm wood soffit
 * that sweeps up and out far past the walls, deepest over the corner entry
 * plaza; under it a glass hall wrapped by a band of dark vertical fins, and
 * a clerestory of glass between the fins and the soffit.
 *
 * Plan (OSM): the roof is way/968961472 (building=roof, layer 2, 162 x 173
 * m), its corners rounded; the lower overhang that carries the fin band is
 * way/1052351566 (building=roof, layer 1), set in 10 m; the glass walls are
 * that outline set in 12 m (estimated from the photo's overhang); the
 * fin band stands 2 m proud of the glass. The roof's
 * inner raised field (white membrane) and its grey outer ring are from
 * NAIP (USGS, after 2022).
 *
 * Heights: the building is newer than the only lidar (USGS 3DEP
 * USGS_LPC_TX_Central_B1_2017_LAS_2019, flown 2017, when the site was a car
 * park), and no height is published, so every height is estimated from
 * "ajay" (scaled from the entry doors, about 2.7 m, 0.06 m/px at the
 * facade) above the plaza (z 2): ground-floor glass to 10, fin band
 * 10-14.5, clerestory 14.5-18. The wood soffit rises from the clerestory's
 * head in a concave sweep to the edge at a constant rate (0.3 m per metre
 * of overhang), so the edge stands at 23.5 where the roof oversails least
 * (about 18 m, the east) and 28.5 at the north-west corner, where OSM puts
 * the roof edge about 30 m past the glass: the photo's upswept corner,
 * which is also exaggerated there by the wide lens. The edge is a 0.9 m
 * dark band; the roof's top rises gently to 31.5.
 *
 * Roof colours from NAIP: a light grey outer band and a white membrane
 * field (an irregular octagon, with the arena's logo, left out).
 *
 * Photos:
 *  ajay   "Moody Center - UT Austin (54984998424).jpg", ajay_suresh,
 *         CC BY 4.0 (EVIDENCE; the north-west plaza and corner entry)
 *         https://commons.wikimedia.org/wiki/File:Moody_Center_-_UT_Austin_(54984998424).jpg
 * Look-only: "Moody Center Sign UT Austin.jpg", Larry D. Moore, CC BY 4.0,
 *   a photo of the construction sign, whose architect's rendering is not
 *   the photographer's work: looked at for the roof's overall shape only.
 * No commercial imagery.
 *
 * Doubts: one licensed photo, from the north-west; the other sides, the
 * east facade on the high ground, and all heights are estimates (±3 m).
 * The roof drawn level; the photo's upswept corner may be partly lens
 * distortion. Left out: the roof's logo, the video board, the box office
 * block, signs, the entry doors (glass, inside the glass wall), the
 * columns under the fin band's overhang.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { at, capPoly, ccw, offset, toFrame, wall, type XY } from './atl-flatiron-building'

const ANCHOR = { lng: -97.730639, lat: 30.280974 }
const ROOF_LL: XY[] = [[-97.730473, 30.2816195], [-97.730454, 30.2816139], [-97.730438, 30.2816046], [-97.729829, 30.2811227], [-97.729779, 30.2810596], [-97.729762, 30.2810068], [-97.729781, 30.2809321], [-97.729928, 30.2806162], [-97.730127, 30.2802266], [-97.73018, 30.2801884], [-97.730252, 30.2801655], [-97.730342, 30.2801724], [-97.730798, 30.2803274], [-97.731349, 30.2808106], [-97.731443, 30.2808904], [-97.731443, 30.2809396], [-97.731423, 30.2810005], [-97.731191, 30.2816946], [-97.731163, 30.281724], [-97.731123, 30.2817343], [-97.731081, 30.2817305], [-97.730473, 30.2816195]]
// way/1052351566, the lower overhang (layer 1)
const LOW_M: XY[] = [[-25.8, 77.9], [-76.1, 22.0], [-76.9, 20.9], [-77.8, 15.1], [-71.7, -8.8], [-63.7, -21.3], [-14.9, -70.9], [-0.4, -76.2], [13.3, -78.9], [24.0, -76.3], [38.8, -68.4], [49.7, -59.5], [63.0, -46.9], [68.4, -38.1], [77.5, -14.0], [77.4, -0.5], [75.3, 8.6], [73.1, 15.0], [19.3, 67.3], [16.9, 68.9], [14.6, 69.7], [-23.1, 78.3], [-24.7, 78.5]]

/** Corner-cutting (Chaikin) to round a polygon, `n` times. */
function chaikin(r: XY[], n: number): XY[] {
  let p = r
  for (let k = 0; k < n; k++) {
    const q: XY[] = []
    for (let i = 0; i < p.length; i++) {
      const a = p[i], b = p[(i + 1) % p.length]
      q.push([a[0] * 0.75 + b[0] * 0.25, a[1] * 0.75 + b[1] * 0.25], [a[0] * 0.25 + b[0] * 0.75, a[1] * 0.25 + b[1] * 0.75])
    }
    p = q
  }
  return p
}
/** Resample a closed ring to about `step` metres between points. */
function resample(r: XY[], step: number): XY[] {
  const L: number[] = [0]
  for (let i = 0; i < r.length; i++) { const a = r[i], b = r[(i + 1) % r.length]; L.push(L[i] + Math.hypot(b[0] - a[0], b[1] - a[1])) }
  const total = L[L.length - 1], n = Math.round(total / step), out: XY[] = []
  let j = 0
  for (let k = 0; k < n; k++) {
    const s = (k / n) * total
    while (L[j + 1] < s) j++
    const a = r[j], b = r[(j + 1) % r.length], t = (s - L[j]) / (L[j + 1] - L[j] || 1)
    out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t])
  }
  return out
}
// drop near-duplicate points before rounding
const clean = (r: XY[]) => r.filter((p, i) => Math.hypot(p[0] - r[(i + 1) % r.length][0], p[1] - r[(i + 1) % r.length][1]) > 2.5)

const ROOF = ccw(resample(chaikin(clean(toFrame(ROOF_LL, ANCHOR, 0)), 3), 5.5))
const LOW = ccw(resample(chaikin(clean(LOW_M), 3), 5.5))
const N = ROOF.length

const rim = new Part(), wood = new Part(), roof = new Part(), white = new Part(), glass = new Part()

const PLAZA = 2
const Z_GLASS = PLAZA + 8, Z_FIN = PLAZA + 12.5, Z_CLR = PLAZA + 16

// ── the roof ──────────────────────────────────────────────────────────────

// the soffit: wood, rising from the clerestory's head at the glass out to
// the rim in a concave sweep (steepening toward the edge, as in "ajay").
// It rises at the same rate everywhere, so where the roof oversails
// furthest (the north-west corner, about 30 m past the glass) the edge
// stands highest: the corner upsweep in the photo.
const GLASS = ccw(offset(LOW, -12))
// the soffit runs between ROOF and a ring matched to it point by point
const nearestOn = (p: XY, ring: XY[]) => ring.reduce((b, q) => (Math.hypot(q[0] - p[0], q[1] - p[1]) < Math.hypot(b[0] - p[0], b[1] - p[1]) ? q : b))
const ROOF_IN = ROOF.map((p) => nearestOn(p, GLASS))
const depth = ROOF.map((p, i) => Math.hypot(p[0] - ROOF_IN[i][0], p[1] - ROOF_IN[i][1]))
const rawZ = depth.map((d) => PLAZA + Math.min(26.5, Math.max(21.5, 16 + 0.3 * d)))
// smoothed along the edge (about 30 m either way), so the rim is a calm curve
const rimZ = rawZ.map((_, i) => { let s = 0, w = 0; for (let k = -6; k <= 6; k++) { const c = 7 - Math.abs(k); s += rawZ[(i + k + rawZ.length) % rawZ.length] * c; w += c } return s / w })
const RIM_H = 0.9
const soffit: V3[][] = []
for (const t of [1, 0.8, 0.6, 0.4, 0.2, 0]) {
  soffit.push(ROOF.map((p, i) => {
    const q = ROOF_IN[i], u = 1 - t // u: 0 at the rim, 1 at the glass
    return [p[0] + (q[0] - p[0]) * u, p[1] + (q[1] - p[1]) * u, Z_CLR + (rimZ[i] - Z_CLR) * t ** 1.7] as V3
  }))
}

// the soffit faces down, so each ring runs clockwise
wood.loft(soffit.map((r) => [...r].reverse()))
// the rim: a thin dark band round the edge, bevelled on top
const R1 = offset(ROOF, -0.35)
rim.loft([ROOF.map((p, i) => [p[0], p[1], rimZ[i]] as V3), ROOF.map((p, i) => [p[0], p[1], rimZ[i] + RIM_H - 0.3] as V3), R1.map((p, i) => [p[0], p[1], rimZ[i] + RIM_H] as V3)])
// the roof's top (NAIP: a light grey outer band and a white membrane
// field, an irregular octagon): a shallow rise from the rim to the field
const R2 = offset(ROOF, -16), R3 = offset(ROOF, -30)
const FIELD = PLAZA + 29.5
roof.loft([R1.map((p, i) => [p[0], p[1], rimZ[i] + RIM_H] as V3), at(R2, FIELD - 0.8)])
white.loft([at(R2, FIELD - 0.8), at(R3, FIELD)])
capPoly(white, R3, FIELD, true)

// ── the hall ──────────────────────────────────────────────────────────────

// the glass hall, down to z 0 so it sinks into the high east ground
wall(glass, GLASS, 0, Z_GLASS)
wall(glass, GLASS, Z_FIN, Z_CLR)
// the fin band, set out on the lower overhang's line, a dark band with
// deep vertical fins every 3.6 m
const FINR = ccw(offset(LOW, -10))
wall(rim, offset(GLASS, 0.1), Z_GLASS, Z_FIN)
{
  // the overhang's soffit and top, where the fin line stands proud of the glass
  const G1 = offset(GLASS, 0.1)
  const facing = (a: V3, b: V3, c: V3, d: V3, up: boolean) => {
    const nz = (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
    if (nz > 0 === up) roof.quad(a, b, c, d)
    else roof.quad(a, d, c, b)
  }
  for (let i = 0; i < FINR.length; i++) {
    const j = (i + 1) % FINR.length
    const bi = nearestOn(FINR[i], G1), bj = nearestOn(FINR[j], G1)
    for (const [z, up] of [[Z_GLASS, false], [Z_FIN, true]] as [number, boolean][])
      facing([bi[0], bi[1], z], [bj[0], bj[1], z], [FINR[j][0], FINR[j][1], z], [FINR[i][0], FINR[i][1], z], up)
  }
}
{
  const ring = resample(FINR, 3.6)
  for (let i = 0; i < ring.length; i++) {
    const p = ring[i], q = ring[(i + 1) % ring.length]
    const L = Math.hypot(q[0] - p[0], q[1] - p[1]), t: XY = [(q[0] - p[0]) / L, (q[1] - p[1]) / L], n: XY = [t[1], -t[0]]
    // a fin 0.5 m wide, 1.4 m deep (inward of the line), the full band
    const w = 0.25, d = 1.4
    const c: XY[] = [[p[0] - t[0] * w, p[1] - t[1] * w], [p[0] + t[0] * w, p[1] + t[1] * w], [p[0] + t[0] * w - n[0] * d, p[1] + t[1] * w - n[1] * d], [p[0] - t[0] * w - n[0] * d, p[1] - t[1] * w - n[1] * d]]
    rim.loft([at(c, Z_GLASS), at(c, Z_FIN)])
  }
}
if (import.meta.main) {
  const { save } = await import('./atl-flatiron-building')
  await save('atx-moody-center', 'Moody Center', [
    { part: glass, material: { ...PALETTE.window, color: 0x6f8597 } },
    { part: rim, material: finish('moody-dark-metal', 0x4f545b) },
    { part: wood, material: finish('moody-wood-soffit', 0xb8865a) },
    { part: roof, material: finish('moody-roof-grey', 0xc3c8cb) },
    { part: white, material: finish('moody-roof-membrane', 0xe9e9e6) },
  ], { bearing: 0, height: PLAZA + 29.5, replaces: ['way/953200132', 'way/968961472', 'way/1052351566'] })
  void N
}
