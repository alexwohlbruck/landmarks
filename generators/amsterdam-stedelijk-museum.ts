/**
 * Stedelijk Museum, Amsterdam — procedural, CC0-1.0, no textures.
 * bun generators/amsterdam-stedelijk-museum.ts
 *
 * Two buildings that read as one: A.W. Weissman's 1895 museum, a red-brick
 * Dutch neo-Renaissance block with white stone bands, slate mansards, four
 * corner pavilions under steep pyramid roofs and a central front with a
 * stepped gable and a clock tower with an open lantern, on Paulus
 * Potterstraat; and Benthem Crouwel's 2012 extension on Museumplein, the
 * "bathtub": a smooth white volume lifted over a glass ground floor, its
 * Museumplein face leaning out into a thin, wide, flat roof plate that
 * overhangs the entrance plaza by some 14 m. A dark box for services and the
 * lettering stands apart at the Van Baerlestraat end.
 *
 * Map frame: x = model east, y = model north, z up, metres. Placed at
 * bearing 66.5°, the long walls of the outline (and of Museumplein): model
 * north (+y) is north-east, towards the Van Gogh Museum; +x (156.5°) faces
 * Museumplein; the 1895 front faces −x (Paulus Potterstraat). Anchor: the
 * area centroid of the OSM outline. The old building is drawn symmetric
 * about y = 0, as the outline is.
 *
 * Evidence
 * - OSM way/44508819 (building outline, ref:bag 0363100012077791, which in
 *   OSM also takes in the extension and its roof plate) and its parts:
 *   754299888/893/898 (central block), 754299889 (central front, h28
 *   pyramidal), 754299894–897 (corner pavilions, h24 pyramidal), 754299890
 *   (extension, h17) and 754299892 (the roof plate, building:part=roof,
 *   x −2.2…38.6 in this frame); way/754299891 is the dark box (h17), a
 *   separate building outside the outline.
 * - 3D BAG (3dbag.nl, CC BY 4.0, 3D geoinformation group TU Delft / 3DBAG),
 *   LoD2.2 roofs from AHN lidar, panden NL.IMBAG.Pand.0363100012077791
 *   (1895 building), 0363100012251804 (extension) and 0363100012251805 (the
 *   dark box), fetched from api.3dbag.nl, turned into this frame (RD New →
 *   WGS84 by the standard approximation; the BAG footprints land within
 *   0.3 m of the OSM outline) and sampled on 1 m and 3 m grids. Ground NAP
 *   +0.41 (flat). Measured: extension roof 17.7 m, flat; its BAG footprint
 *   (the glass ground floor) x −4.8…23.8, y −43.3…43.6; the plate beyond
 *   it is not in the BAG footprint (OSM gives it). Dark box 17.5 m. Old
 *   building: range eaves 14.3–16, ridges 17.6–18.2, skylit middle ranges
 *   14.5–17.6; corner pavilions eave 16, pyramid 25.8; central front
 *   mansard eave 16, flat top 22.4 (x −38…−34); stepped gable top 25.8
 *   on the axis; the tower's lantern cap 33.4 at x −36, y 0.
 * - Photos (Wikimedia Commons, all EVIDENCE):
 *   - Alf van Beem, "Stedelijk museum, badkuip, foto 1/2/4/5/6", public
 *     domain (2018) — the extension from Museumplein: plate, the leaning
 *     face, the low SW block, glass ground floor.
 *     https://commons.wikimedia.org/wiki/File:Stedelijk_museum,_badkuip,_foto_1.JPG (and _2, _4, _5, _6)
 *   - Ceescamel, "Van Baerlestraat, badkuip.jpg", CC BY-SA 4.0 — the SW end
 *     straight on: tapered tub, rounded bottom, plate overhang, skylights.
 *     https://commons.wikimedia.org/wiki/File:Van_Baerlestraat,_badkuip.jpg
 *   - Steven Lek, "Stedelijk Museum Amsterdam 2017 (2, 3, 4).jpg", CC BY-SA
 *     4.0 — the SW end and the dark box, day and dusk.
 *     https://commons.wikimedia.org/wiki/File:Stedelijk_Museum_Amsterdam_2017_2.jpg
 *   - Txllxt TxllxT, "Amsterdam - Museumplein - View on Stedelijk Museum
 *     from Van Gogh Museum.jpg", CC BY-SA 4.0 — from the NE: plate tip,
 *     old pavilions behind.
 *     https://commons.wikimedia.org/wiki/File:Amsterdam_-_Museumplein_-_View_on_Stedelijk_Museum_from_Van_Gogh_Museum.jpg
 *   - Editør, "Stedelijk Museum 1.jpg" and "3.jpg", CC BY-SA 3.0 — the
 *     Museumplein face along its length.
 *     https://commons.wikimedia.org/wiki/File:Stedelijk_Museum_1.jpg
 *   - Sergé Technau (RCE), "Overzicht museum, middenpartij met risaliet en
 *     trapgevel - Amsterdam - 20409360 - RCE.jpg", CC BY-SA 4.0 — the 1895
 *     central front: gable, tower, dormers, bands.
 *     https://commons.wikimedia.org/wiki/File:Overzicht_museum,_middenpartij_met_risaliet_en_trapgevel_-_Amsterdam_-_20409360_-_RCE.jpg
 *   - A. Bakker, "Amsterdam - Paulus Potterstraat 13 Stedelijk.JPG", CC BY-SA
 *     3.0 nl — the 1895 front and NE pavilion.
 *     https://commons.wikimedia.org/wiki/File:Amsterdam_-_Paulus_Potterstraat_13_Stedelijk.JPG
 *   - Calips, "Stedelijk Museum in Amsterdam 03.jpg", CC BY-SA 3.0 — the old
 *     front from the SW. https://commons.wikimedia.org/wiki/File:Stedelijk_Museum_in_Amsterdam_03.jpg
 *   - C messier, "Stedelijk Museum Amsterdam 7173 HDR.jpg", CC BY-SA 4.0 —
 *     the night look across Museumplein.
 *     https://commons.wikimedia.org/wiki/File:Stedelijk_Museum_Amsterdam_7173_HDR.jpg
 * - Published: old building A.W. Weissman, opened 1895; extension Benthem
 *   Crouwel, opened 2012 (nl/en.wikipedia "Stedelijk Museum Amsterdam").
 *
 * Estimated from the photos, scaled to the 3D BAG heights: the tub's
 * bottom 4.2 m at the SW block and 6.0 m over the entrance; its face
 * leaning out from x 21.5 to a crease at x 27, z 14.8; the plate's soffit
 * from there to the 0.5 m edge; the tub's ends set back 6–8 m under the
 * plate; the two roof skylights (size and place from the SW and NE
 * photos); the tower's stages (clock stage 23–27, open lantern 27.4–30.6,
 * dome, small lantern and onion to 33.8, needle and vane to 37.6); the
 * gable's steps; window rows and bay counts (counted on the photos).
 *
 * Doubts: the plate's outline beyond the BAG footprint is OSM's (a plain
 * rectangle); the skylights' places are read from two oblique photos; the
 * back of the 1895 building is hidden by the extension and drawn plainly;
 * the roofs of its middle ranges are drawn as two glazed gables, a
 * simplification of the skylit roofscape the lidar shows. The lettering on
 * the dark box and the Museumplein sculpture are left out.
 *
 * Night: the glass ground floor and the windows glow; the tub's white faces
 * catch the light from below (a floodlight wash on its soffits).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { finishModel, prism, capPoly, unit, type XY } from './nyc-570-lexington'
import { rectPanel, archPanel, band, discPanel } from './nyc-city-hall'

const brick = new Part(), white = new Part(), slate = new Part(), win = new Part(), glass = new Part(), dark = new Part()

// ---------------------------------------------------------------- helpers
const cr = (a: V3, b: V3, c: V3): V3 => {
  const u: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v: V3 = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  return [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
}
/** A convex polygon as a fan, turned to face `out`. */
function poly(p: Part, pts: V3[], out: V3) {
  const n = cr(pts[0], pts[1], pts[2])
  const q = n[0] * out[0] + n[1] * out[1] + n[2] * out[2] >= 0 ? pts : [...pts].reverse()
  for (let i = 1; i < q.length - 1; i++) p.tri(q[0], q[i], q[i + 1])
}
const rect = (x0: number, y0: number, x1: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
/** Walls of a rectangle with softened corners and a flat top (or none). */
function walls(p: Part, top: Part | null, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, bevel = 0.35) {
  prism({ wall: p, win: null, roof: top, ring: rect(x0, y0, x1, y1), z0, z1, facade: null, bevel })
}
/** Faces of a rectangle in counter-clockwise order: [a, b] per side (south, east, north, west). */
const sides = (x0: number, y0: number, x1: number, y1: number): [XY, XY][] => [
  [[x0, y0], [x1, y0]], [[x1, y0], [x1, y1]], [[x1, y1], [x0, y1]], [[x0, y1], [x0, y0]],
]
const L = (a: XY, b: XY) => Math.hypot(b[0] - a[0], b[1] - a[1])

/**
 * A gabled roof with its ridge along `axis`, eaves at `lo`/`hi` on the
 * cross axis (height zE), ridge at zR, running a0…a1. Gable triangles
 * at the ends in `end` (or none), slopes in `p`.
 */
function gable(p: Part, axis: 'x' | 'y', a0: number, a1: number, lo: number, hi: number, zE: number, zR: number, end: Part | null = brick, ov = 0.3) {
  const P = (a: number, c: number, z: number): V3 => (axis === 'x' ? [a, c, z] : [c, a, z])
  const mid = (lo + hi) / 2, s = (zR - zE) / ((hi - lo) / 2)
  const eL = lo - ov, eH = hi + ov, zO = zE - ov * s
  const crossOut = (sg: number): V3 => (axis === 'x' ? [0, sg, 1] : [sg, 0, 1])
  poly(p, [P(a0, eL, zO), P(a1, eL, zO), P(a1, mid, zR), P(a0, mid, zR)], crossOut(-1))
  poly(p, [P(a1, eH, zO), P(a0, eH, zO), P(a0, mid, zR), P(a1, mid, zR)], crossOut(1))
  if (end) {
    poly(end, [P(a0, lo, zE), P(a0, hi, zE), P(a0, mid, zR)], axis === 'x' ? [-1, 0, 0] : [0, -1, 0])
    poly(end, [P(a1, lo, zE), P(a1, hi, zE), P(a1, mid, zR)], axis === 'x' ? [1, 0, 0] : [0, 1, 0])
  }
}
/** A mansard / truncated pyramid from rectangle b at z0 to rectangle t at z1; flat top in `top`. */
function trunc(p: Part, b: number[], z0: number, t: number[], z1: number, top: Part | null = p) {
  const B: V3[] = [[b[0], b[1], z0], [b[2], b[1], z0], [b[2], b[3], z0], [b[0], b[3], z0]]
  const T: V3[] = [[t[0], t[1], z1], [t[2], t[1], z1], [t[2], t[3], z1], [t[0], t[3], z1]]
  const cx = (b[0] + b[2]) / 2, cy = (b[1] + b[3]) / 2
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    poly(p, [B[i], B[j], T[j], T[i]], [(B[i][0] + B[j][0]) / 2 - cx, (B[i][1] + B[j][1]) / 2 - cy, 0.5])
  }
  if (top) poly(top, T, [0, 0, 1])
}
/** A square pyramid from half-width r at z0 to an apex. */
function spike(p: Part, x: number, y: number, r: number, z0: number, z1: number, n = 4) {
  const A: V3 = [x, y, z1]
  for (let i = 0; i < n; i++) {
    const t0 = (i / n) * 2 * Math.PI + Math.PI / n, t1 = ((i + 1) / n) * 2 * Math.PI + Math.PI / n
    const a: V3 = [x + r * Math.cos(t0), y + r * Math.sin(t0), z0], b: V3 = [x + r * Math.cos(t1), y + r * Math.sin(t1), z0]
    poly(p, [a, b, A], [(a[0] + b[0]) / 2 - x, (a[1] + b[1]) / 2 - y, 0.3])
  }
}
/** A regular prism (n sides) of radius r, z0…z1, with a top. */
function drum(p: Part, x: number, y: number, r: number, z0: number, z1: number, n = 8, top = true, r1 = r) {
  const ring = (rr: number, z: number): V3[] => Array.from({ length: n }, (_, i) => {
    const t = (i / n) * 2 * Math.PI + Math.PI / n
    return [x + rr * Math.cos(t), y + rr * Math.sin(t), z] as V3
  })
  const a = ring(r, z0), b = ring(r1, z1)
  p.loft([a, b])
  if (top) p.cap(b, true)
}
/** A gabled dormer on a slope facing direction d (unit, outward), its front at (x, y). */
function dormer(x: number, y: number, d: XY, zb: number, w: number, h: number, depth: number) {
  const t: XY = [-d[1], d[0]]
  const at = (u: number, f: number, z: number): V3 => [x + t[0] * u - d[0] * f, y + t[1] * u - d[1] * f, z]
  const zt = zb + h, za = zt + w * 0.45
  const out: V3 = [d[0], d[1], 0]
  poly(white, [at(-w / 2, 0, zb), at(w / 2, 0, zb), at(w / 2, 0, zt), at(0, 0, za), at(-w / 2, 0, zt)], out)
  for (const k of [-1, 1]) {
    poly(slate, [at((k * w) / 2, 0, zt), at(0, 0, za), at(0, depth, za), at((k * w) / 2, depth, zt)], [t[0] * k, t[1] * k, 1])
    poly(slate, [at((k * w) / 2, 0, zb), at((k * w) / 2, 0, zt), at((k * w) / 2, depth, zt), at((k * w) / 2, depth, zb)], [t[0] * k, t[1] * k, 0])
  }
  poly(win, [at(-w * 0.28, -0.04, zb + 0.25), at(w * 0.28, -0.04, zb + 0.25), at(w * 0.28, -0.04, zt - 0.15), at(-w * 0.28, -0.04, zt - 0.15)], out)
}

// ================================================================ 1895 building
// Plan from the OSM outline (= the BAG footprint), averaged to be
// symmetric about y = 0.
const FRONT = -35.8 // front wall of the ranges (Paulus Potterstraat)
const BACK = -2.3 // where the extension takes over (BAG)
const ENDY = 47.7 // end walls of the ranges
const EAVE = 14.8 // range cornice
const PAV_F = [-40.1, 38.9, -28.9, 50.2] as const // NW-side pavilion, +y (mirrored)
const PAV_B = [-13.1, 38.9, -2.2, 50.2] as const // SE-side pavilion, +y
const PAV_E = 16.0, PAV_T = 25.8

// Body.
walls(brick, slate, FRONT, -ENDY, BACK, ENDY, 0, EAVE)
// Pavilions.
const pavs: number[][] = []
for (const s of [1, -1]) for (const P of [PAV_F, PAV_B]) {
  const y0 = s > 0 ? P[1] : -P[3], y1 = s > 0 ? P[3] : -P[1]
  pavs.push([P[0], y0, P[2], y1])
}
for (const [x0, y0, x1, y1] of pavs) {
  walls(brick, null, x0, y0, x1, y1, 0, PAV_E)
  // Steep slate pyramid (mansard-like: steep to 24, then flatter to the top).
  const i1 = 3.4
  trunc(slate, [x0 - 0.3, y0 - 0.3, x1 + 0.3, y1 + 0.3], PAV_E - 0.2, [x0 + i1, y0 + i1, x1 - i1, y1 - i1], 23.9, null)
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, h = (x1 - x0) / 2 - i1
  trunc(slate, [cx - h, cy - h, cx + h, cy + h], 23.9, [cx - 0.9, cy - 0.9, cx + 0.9, cy + 0.9], PAV_T, null)
  // Small lantern and spike.
  walls(slate, slate, cx - 0.75, cy - 0.75, cx + 0.75, cy + 0.75, PAV_T - 0.2, PAV_T + 1.3, 0.15)
  spike(slate, cx, cy, 0.95, PAV_T + 1.3, PAV_T + 2.1)
  spike(dark, cx, cy, 0.18, PAV_T + 2.1, PAV_T + 4.2)
  // One dormer on each slope.
  for (const [d, px, py] of [[[0, -1], cx, y0 - 0.3], [[0, 1], cx, y1 + 0.3], [[-1, 0], x0 - 0.3, cy], [[1, 0], x1 + 0.3, cy]] as [XY, number, number][]) {
    const f = 1.7 // in from the eave along the slope's plan
    dormer(px - d[0] * f, py - d[1] * f, d, PAV_E + 3.4, 1.5, 1.6, 1.4)
  }
  // Cornice and bands.
  band(white, rect(x0, y0, x1, y1), PAV_E - 0.7, PAV_E - 0.15, 0.22)
}

// Central front: a 30 m block projecting 6.3 m, its middle bay 0.8 m more.
const CF = [-42.1, -15.2, -29.5, 15.2] as const
const CB = [-42.9, -6.8, -42.1, 6.8] as const
const CE = 16.0
walls(brick, null, CF[0], CF[1], CF[2], CF[3], 0, CE)
walls(brick, null, CB[0], CB[1], CB[2] + 0.4, CB[3], 0, CE)
// Mansard to a flat top (BAG 22.4).
trunc(slate, [CF[0] - 0.3, CF[1] - 0.3, CF[2] + 0.3, CF[3] + 0.3], CE - 0.2, [-38.4, -11.4, -33.2, 11.4], 22.6, slate)
for (const s of [1, -1]) for (const y of [9.6, 12.9]) dormer(-41.2, s * y, [-1, 0], CE + 1.6, 1.3, 1.5, 1.5)
// The middle bay's roof runs back from the gable into the mansard.
gable(slate, 'x', -42.1, -36.8, CB[1], CB[3], CE, 22.9, null, 0.2)
// Stepped gable on the middle bay (front plane x = −42.9, 0.8 thick).
{
  const xf = CB[0] - 0.05, xb = CB[0] + 0.8
  // Steps (z0, z1, half-width), then a triangular crown.
  const steps: [number, number, number][] = [[CE - 0.2, 18.0, 6.8], [18.0, 20.3, 5.2], [20.3, 22.6, 3.7], [22.6, 24.6, 2.0]]
  for (const [z0, z1, hw] of steps) {
    for (const [x, o] of [[xf, -1], [xb, 1]] as [number, number][]) poly(brick, [[x, -hw, z0], [x, hw, z0], [x, hw, z1], [x, -hw, z1]], [o, 0, 0])
    for (const s of [1, -1]) poly(brick, [[xf, s * hw, z0], [xb, s * hw, z0], [xb, s * hw, z1], [xf, s * hw, z1]], [0, s, 0])
  }
  // White copings on the treads.
  for (let k = 0; k < steps.length; k++) {
    const [, z1, hw] = steps[k], inner = k < steps.length - 1 ? steps[k + 1][2] : 0
    for (const s of k < steps.length - 1 ? [1, -1] : [1]) {
      const ya = k < steps.length - 1 ? s * inner : -hw, yb = s * (hw + 0.15)
      poly(white, [[xf - 0.15, ya, z1], [xb, ya, z1], [xb, yb, z1], [xf - 0.15, yb, z1]], [0, 0, 1])
      poly(white, [[xf - 0.15, ya, z1 - 0.3], [xf - 0.15, yb, z1 - 0.3], [xf - 0.15, yb, z1], [xf - 0.15, ya, z1]], [-1, 0, 0])
    }
  }
  const crown: V3[][] = [[[xf, -2.0, 24.6], [xf, 2.0, 24.6], [xf, 0, 26.0]], [[xb, -2.0, 24.6], [xb, 2.0, 24.6], [xb, 0, 26.0]]]
  poly(brick, crown[0], [-1, 0, 0]); poly(brick, crown[1], [1, 0, 0])
  for (const s of [1, -1]) poly(white, [[xf - 0.1, s * 2.15, 24.5], [xb, s * 2.15, 24.5], [xb, 0, 26.15], [xf - 0.1, 0, 26.15]], [0, s, 1])
  // Pinnacles at the steps and on the crown.
  for (const s of [1, -1]) {
    spike(white, xf + 0.4, s * 6.5, 0.32, 18.0, 20.0)
    spike(white, xf + 0.4, s * 4.9, 0.28, 20.3, 22.0)
    spike(white, xf + 0.4, s * 3.4, 0.26, 22.6, 24.0)
  }
  spike(white, xf + 0.4, 0, 0.3, 26.0, 27.3)
  // Stone bands across the gable and its windows.
  for (const [z0, z1, hw] of [[19.0, 19.4, 5.2], [21.4, 21.8, 3.7]] as [number, number, number][]) rectPanel(white, [xf, hw], [xf, -hw], hw, 2 * hw, z0, z1, 0.05)
  archPanel(win, [xf, 3.7], [xf, -3.7], 3.7, 1.6, 22.8, 24.4, 0.05, 6)
  rectPanel(win, [xf, 5.2], [xf, -5.2], 5.2, 2.0, 19.8, 21.0, 0.05)
}

// Clock tower behind the gable, on the axis (BAG: lantern cap 33.4 at x −36).
{
  const tx = -36.0, ty = 0, h = 1.8
  walls(slate, null, tx - h, ty - h, tx + h, ty + h, 19.5, 26.6, 0.25)
  band(white, rect(tx - h, ty - h, tx + h, ty + h), 26.6, 27.2, 0.25)
  poly(slate, [[tx - h - 0.25, ty - h - 0.25, 27.2], [tx + h + 0.25, ty - h - 0.25, 27.2], [tx + h + 0.25, ty + h + 0.25, 27.2], [tx - h - 0.25, ty + h + 0.25, 27.2]], [0, 0, 1])
  // Clock faces (white discs) on all four sides.
  for (const [a, b] of sides(tx - h, ty - h, tx + h, ty + h)) discPanel(white, a, b, L(a, b) / 2, 25.0, 1.15, 0.06, 12)
  // Open lantern: eight posts, an entablature ring, a dome, a small lantern, onion, needle and vane.
  const R = 1.45, n = 8
  for (let i = 0; i < n; i++) {
    const t = (i / n) * 2 * Math.PI + Math.PI / n
    const px = tx + R * Math.cos(t), py = ty + R * Math.sin(t)
    walls(slate, null, px - 0.22, py - 0.22, px + 0.22, py + 0.22, 27.2, 30.4, 0.05)
  }
  drum(white, tx, ty, R + 0.2, 30.4, 30.9, 8)
  drum(slate, tx, ty, R + 0.1, 30.9, 32.0, 8, false, 0.7)
  drum(slate, tx, ty, 0.5, 32.0, 32.8, 8)
  drum(slate, tx, ty, 0.55, 32.8, 33.3, 8, false, 0.75)
  drum(slate, tx, ty, 0.75, 33.3, 33.8, 8, false, 0.12)
  drum(dark, tx, ty, 0.14, 33.8, 37.6, 6, true, 0.08)
  poly(dark, [[tx, ty - 0.05, 36.2], [tx, ty + 0.9, 36.2], [tx, ty + 0.9, 36.9], [tx, ty - 0.05, 36.9]], [1, 0, 0])
  poly(dark, [[tx, ty - 0.05, 36.2], [tx, ty + 0.9, 36.2], [tx, ty + 0.9, 36.9], [tx, ty - 0.05, 36.9]], [-1, 0, 0])
}

// Range roofs (BAG: ridges 17.6–18.2 over eaves 14.3–15): slate front and
// back ranges, glazed gables over the skylit middle ranges.
gable(slate, 'y', -ENDY, ENDY, FRONT, -29.5, EAVE, 18.2, brick)
gable(slate, 'y', -ENDY, ENDY, -11.5, BACK, EAVE, 18.0, brick)
gable(slate, 'y', -ENDY, ENDY, -29.5, -20.5, EAVE, 17.6, brick, 0)
gable(slate, 'y', -ENDY, ENDY, -20.5, -11.5, EAVE, 17.6, brick, 0)
// Their skylights: glazed bands either side of the ridges.
for (const [lo, hi] of [[-29.5, -20.5], [-20.5, -11.5]]) {
  const mid = (lo + hi) / 2, hw = (hi - lo) / 2, sl = (17.6 - EAVE) / hw
  for (const sg of [-1, 1]) {
    const xa = mid + sg * hw * 0.42, xb = mid + sg * 0.25
    const za = 17.6 - sl * hw * 0.42 + 0.05, zb2 = 17.6 - sl * 0.25 + 0.05
    poly(glass, [[xa, -45.5, za], [xa, 45.5, za], [xb, 45.5, zb2], [xb, -45.5, zb2]], [sg, 0, 2])
  }
}
// A glazed strip on the inner slope of the front range.
{
  const zA = EAVE + 0.9, zB = 17.5, xA = -29.5 - ((zA - EAVE) / (18.2 - EAVE)) * 3.15, xB = -29.5 - ((zB - EAVE) / (18.2 - EAVE)) * 3.15
  for (const [y0, y1] of [[15.6, 38.6], [-38.6, -15.6]]) poly(glass, [[xA, y0, zA + 0.05], [xA, y1, zA + 0.05], [xB, y1, zB + 0.05], [xB, y0, zB + 0.05]], [1, 0, 1])
}

// Bands: cornice, sill course and plinth on every 1895 block.
for (const [r, top] of [[rect(FRONT, -ENDY, BACK, ENDY), EAVE], [rect(CF[0], CF[1], CF[2], CF[3]), CE], [rect(CB[0], CB[1], CB[2], CB[3]), CE]] as [XY[], number][]) {
  band(white, r, top - 0.75, top - 0.15, 0.22)
  band(white, r, 5.2, 5.6, 0.1)
  band(white, r, 9.4, 9.7, 0.06)
  band(white, r, 0.8, 1.15, 0.12)
}
for (const [x0, y0, x1, y1] of pavs) { band(white, rect(x0, y0, x1, y1), 5.2, 5.6, 0.1); band(white, rect(x0, y0, x1, y1), 9.4, 9.7, 0.06); band(white, rect(x0, y0, x1, y1), 0.8, 1.15, 0.12) }

// Windows: a rectangle below the sill course, a round-headed window above.
function bays(a: XY, b: XY, n: number, margin = 1.2, w = 1.8, lo = 6.3, hi = 11.6) {
  const len = L(a, b), pitch = (len - 2 * margin) / n
  for (let k = 0; k < n; k++) {
    const s = margin + pitch * (k + 0.5)
    rectPanel(win, a, b, s, w * 0.85, 1.7, 4.6)
    archPanel(win, a, b, s, w, lo, hi, 0.05, 6)
  }
}
for (const s of [1, -1]) {
  // Front ranges, between the central front and the pavilions.
  const ya = s > 0 ? 38.9 : -15.2, yb = s > 0 ? 15.2 : -38.9
  bays([FRONT, ya], [FRONT, yb], 4)
  // Central front, beside the middle bay.
  const yc = s > 0 ? 15.2 : -6.8, yd = s > 0 ? 6.8 : -15.2
  bays([CF[0], yc], [CF[0], yd], 2, 1.0, 2.0, 6.3, 12.2)
  // End walls of the ranges.
  const ea: XY = s > 0 ? [-13.1, ENDY] : [-28.9, -ENDY], eb: XY = s > 0 ? [-28.9, ENDY] : [-13.1, -ENDY]
  bays(ea, eb, 3)
}
// The middle bay: three tall windows with oculi.
bays([CB[0], 6.8], [CB[0], -6.8], 3, 1.1, 2.4, 6.3, 12.6)
for (const y of [-4.0, 0, 4.0]) discPanel(win, [CB[0], 6.8], [CB[0], -6.8], 6.8 - y, 13.8, 0.6, 0.05, 10)
// Pavilions: two bays on every face that shows.
for (const [x0, y0, x1, y1] of pavs) {
  for (const [a, b] of sides(x0, y0, x1, y1)) {
    // Skip faces against the body or the extension.
    const cx = (a[0] + b[0]) / 2, cy = (a[1] + b[1]) / 2
    if (Math.abs(cy) < 40 && Math.abs(a[1] - b[1]) < 1e-6) continue // inner end faces
    if (Math.abs(a[0] - b[0]) < 1e-6 && cx > FRONT + 0.1 && cx < BACK - 0.1) continue // against the body
    bays(a, b, 2, 1.4, 2.0)
  }
}

// ================================================================ 2012 extension
// The tub: rings from its bottom to the plate edge, lofted with smooth
// normals inside each band and a crease between bands.
const X0 = BACK // against the 1895 building
const YSTEP0 = -22, YSTEP1 = -14 // the low SW block (bottom 4.2) gives way to the entrance (6.0)
const zb = (y: number) => (y < YSTEP0 ? 4.2 : y > YSTEP1 ? 6.0 : 4.2 + ((y - YSTEP0) / (YSTEP1 - YSTEP0)) * 1.8)
// Stations along the long sides (the same y on every ring), two of them on the step.
const YS = [-33, -26, YSTEP0, YSTEP1, -2, 14, 28]
const ARC = 4
type Ring = V3[]
/** A rounded (on the +x side) rectangle ring, counter-clockwise from above. */
function tubRing(x0: number, x1: number, y0: number, y1: number, r: number, z: (y: number) => number, rw = r): Ring {
  const E: XY[] = []
  for (let i = 0; i <= ARC; i++) { const t = -Math.PI / 2 + (i / ARC) * (Math.PI / 2); E.push([x1 - r + r * Math.cos(t), y0 + r + r * Math.sin(t)]) }
  for (const y of YS) E.push([x1, y])
  for (let i = 0; i <= ARC; i++) { const t = (i / ARC) * (Math.PI / 2); E.push([x1 - r + r * Math.cos(t), y1 - r + r * Math.sin(t)]) }
  // The west side mirrors the east (same y at every point), with its own corner radius.
  const W: XY[] = E.map(([x, y]) => [x0 + ((x1 - x) * rw) / r, y] as XY).reverse()
  return [...E, ...W].map(([x, y]) => [x, y, z(y)] as V3)
}
// The tub stands free of the 1895 building under the plate, a glazed link
// between them (Van Baerlestraat photo); its west side is near vertical.
const ring0 = tubRing(2.6, 21.5, -43.0, 42.5, 3.0, zb)
const ring1 = tubRing(2.0, 22.3, -43.5, 43.0, 3.5, (y) => zb(y) + 1.0)
const ring2 = tubRing(1.2, 27.0, -44.3, 44.1, 4.5, () => 14.8)
const ring3 = tubRing(X0, 38.6, -49.9, 50.2, 0.8, () => 17.2, 0.3)
const ring4 = ring3.map(([x, y]) => [x, y, 17.7] as V3)

/** Loft rings (same count, closed); normals are smoothed across edges that bend less than 50°. */
function smoothLoft(p: Part, rings: Ring[]) {
  const n = rings[0].length, K = rings.length
  const fn: V3[][] = []
  for (let k = 0; k < K - 1; k++) {
    fn.push([])
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n
      fn[k].push(unit(cr(rings[k][i], rings[k][j], rings[k + 1][j])))
    }
  }
  const cos = Math.cos((50 * Math.PI) / 180)
  /** Normal at ring vertex (k, i) as seen from face (fk, fi). */
  const vn = (k: number, i: number, fk: number, fi: number): V3 => {
    const f0 = fn[fk][fi]
    let s: V3 = [0, 0, 0]
    for (const kk of [k - 1, k]) {
      if (kk < 0 || kk >= K - 1) continue
      for (const ii of [(i - 1 + n) % n, i]) {
        const f = fn[kk][ii]
        if (f[0] * f0[0] + f[1] * f0[1] + f[2] * f0[2] < cos) continue
        s = [s[0] + f[0], s[1] + f[1], s[2] + f[2]]
      }
    }
    return unit(s)
  }
  for (let k = 0; k < K - 1; k++) for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    const a = rings[k][i], b = rings[k][j], c = rings[k + 1][j], d = rings[k + 1][i]
    const na = vn(k, i, k, i), nb = vn(k, j, k, i), nc = vn(k + 1, j, k, i), nd = vn(k + 1, i, k, i)
    p.tri(a, b, c, undefined, undefined, undefined, [na, nb, nc])
    p.tri(a, c, d, undefined, undefined, undefined, [na, nc, nd])
  }
}
smoothLoft(white, [ring0, ring1, ring2])
smoothLoft(white, [ring2, ring3])
white.loft([ring3, ring4])
capPoly(white, ring4.map(([x, y]) => [x, y] as XY), 17.7)
// The tub's bottom: a ladder between the east and west points (they share y).
{
  const m = ring0.length / 2
  for (let i = 0; i < m - 1; i++) {
    const e0 = ring0[i], e1 = ring0[i + 1], w0 = ring0[ring0.length - 1 - i], w1 = ring0[ring0.length - 2 - i]
    poly(white, [w0, e0, e1, w1], [0, 0, -1])
  }
}
// Glass ground floor under the tub, up into its bottom.
{
  const g0 = tubRing(X0, 20.6, -42.2, 41.7, 2.4, () => 0, 0.2)
  // Under the tub the glass stops at its bottom; west of it, the link rises to the plate.
  const g1 = g0.map(([x, y]) => [x, y, x < 3.5 ? 16.6 : zb(y) + 0.1] as V3)
  win.loft([g0, g1])
  // A few white posts along the Museumplein glass.
  for (const y of [-30, -18, -6, 6, 18, 30]) walls(white, null, 20.0, y - 0.35, 20.7, y + 0.35, 0, zb(y), 0.1)
}
// Roof skylights: two glazed boxes (SW and NE photos).
for (const [x0, x1] of [[2.5, 9.0], [14.0, 20.5]]) {
  const y0 = -11, y1 = -1
  walls(white, null, x0, y0, x1, y1, 17.6, 18.0, 0.1)
  const r: V3[] = [[x0 + 0.2, y0 + 0.2, 18.0], [x1 - 0.2, y0 + 0.2, 18.0], [x1 - 0.2, y1 - 0.2, 18.0], [x0 + 0.2, y1 - 0.2, 18.0]]
  const t: V3[] = r.map(([x, y]) => [x, y, 19.4] as V3)
  glass.loft([r, t]); glass.cap(t, true)
}
// The dark box at the Van Baerlestraat end (OSM way/754299891, BAG 17.5 m).
walls(dark, dark, 43.7, -41.9, 51.0, -24.6, 0, 17.5, 0.3)

// ---------------------------------------------------------------- write
const lit = (p: V3, n: V3) => (p[2] > 4 && p[2] < 17.3 && n[2] < 0.3 && p[0] > 20 ? 0.45 : 0)
finishModel('Stedelijk Museum', 'amsterdam-stedelijk-museum', [
  { part: brick, material: finish('stedelijk-brick', 0x8e5042) },
  { part: white, material: { ...finish('stedelijk-white', 0xf0ede6), floodlight: lit } },
  { part: slate, material: finish('stedelijk-slate', 0x6c7580) },
  { part: win, material: PALETTE.window },
  { part: glass, material: { ...PALETTE.glass, color: 0x9fb8c4 } },
  { part: dark, material: finish('stedelijk-dark', 0x4a4f57) },
], { bearing: 66.5, osm: 'way/44508819', height: 37.6 }, 6500)
