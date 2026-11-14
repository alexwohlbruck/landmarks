/**
 * Harrods, 87-135 Brompton Road, Knightsbridge, London (C. W. Stephens,
 * 1894-1905, terracotta by Doulton): original procedural geometry, CC0-1.0.
 * bun generators/london-harrods.ts
 *
 * Map frame, turned to BEARING 317.8: +y is model north = compass 317.8 deg,
 * the way the Brompton Road front faces; +x is model east = compass 47.8
 * deg, along Brompton Road towards Hans Crescent; z up, metres. Origin = the
 * area centroid of the OSM outline way/25739565 (-0.162907, 51.499186), on
 * the ground. y = 0 is the Brompton Road pavement (the block is near flat:
 * lidar ground 3.3-3.9 m above the box's ground_min all round).
 *
 * What makes it Harrods, and how each is drawn
 * - The Edwardian terracotta block filling its street block, salmon-pink
 *   terracotta pulled to the palette's lightness, a lighter trim for the
 *   cornice, string course and pilasters.
 * - The facades: a strong vertical bay rhythm. Pilasters in trim run from
 *   the shop fronts up through the storeys to the cornice at every bay line
 *   (~5.4 m) on every face longer than 10 m; between them the upper three
 *   storeys are one grouped glazed stack. Shop windows below, the arched
 *   mezzanine windows, the main cornice, the attic storey with pedimented
 *   dormers along Brompton Road and its parapet.
 * - The central dome on Brompton Road, the main skyline feature: a tall
 *   square drum (to 32.6 m) with big arched windows and pilasters, the
 *   eight-ribbed dome (r 6.6, 32.8-41.8) with oculi, its open cupola (real
 *   posts with real gaps) and finial (48.9).
 * - The roofs are dark slate/lead grey; the rooftop plant blocks the lidar
 *   shows are drawn as raised blocks.
 * - The corner pavilion at Hans Crescent (north-east end of the front): a
 *   large, steep green copper mansard (27.6-33 m, 21 x 17 m) with three
 *   pedimented dormers to each street and two turrets; the raised Hans Road
 *   corner (south-west end) with its open cupola turret.
 * - The other three faces carry the same storeys without the pilasters.
 * - The green awnings are signage and are left out.
 * - Night: the famous outline lighting, as `lamp` beads (STYLE.md, Night),
 *   about 580 of them: every Brompton Road pilaster (2.2 m apart), the
 *   cornice and parapet lines (2.2 m on Brompton Road, 5 m elsewhere), every
 *   fourth pilaster on the other faces, the dormers, the drum cornice, the
 *   dome's ribs, both cupolas, the mansard dormers and turrets. Only the shop
 *   windows and the mezzanine arches are `window` (lit, as in the night
 *   photo); the upper storeys' glazing shares the dark, unlit `harrods-slate`
 *   material with the roofs, so the bulb outlines carry the night look.
 *
 * Evidence
 * - OSM (ODbL): outline way/25739565 (building=retail, 7 levels, Harrods),
 *   and inside it the dome part way/1370140203 (a circle, r 6.4 m, centre
 *   (-5, 56) in this frame). wikidata Q332474.
 * - Environment Agency LIDAR Composite DSM/DTM 1 m, Open Government Licence
 *   v3.0 (composite of flights ~2000-2022). The lidar sits ~3 m south of the
 *   OSM outline (its Brompton Road face at y 60.5 against OSM 64.5); the OSM
 *   plan was followed. Measured above the pavement: roof 27.0 over most of
 *   the block (lidar 30.4); a raised inner block 31 (34.4) at x 10..60,
 *   y -38..-3; plant blocks 34.8 (x 2..20, y -46..-34), ~28.5 (x -52..-38,
 *   y 15..25; x -36..-28, y -62..-50; x -28..-12, y 26..34); the Hans Road side ~22.5; the Hans Road corner block
 *   ~30.5-31 with its cupola reading 34.8 (the 1 m grid misses the
 *   spirelet); the Hans Crescent corner ~27 with turret tips to ~29-31; the dome's ring ~38-40 at r ~4 m (the
 *   model's dome is 39 there) and lantern 45.3 (the 1 m grid smooths the
 *   lantern and finial; the model's cupola cap is 47.8, finial 48.9).
 * - Published: Grade II* (Historic England list entry 1226177); 1894-1905
 *   by C. W. Stephens, Doulton terracotta (Wikipedia "Harrods").
 * - Photos (Wikimedia Commons), opened and compared:
 *   "Harrods at Night, London - Nov 2012.jpg", Diliff, CC BY-SA 3.0,
 *     https://commons.wikimedia.org/wiki/File:Harrods_at_Night,_London_-_Nov_2012.jpg
 *     (the Brompton Road front from the Hans Crescent corner at night: the
 *     dome and cupola, the corner pavilion, the bulb lines);
 *   "London, Harrods -- 2016 -- 4605.jpg", Dietmar Rabich, CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:London,_Harrods_--_2016_--_4605.jpg
 *     (the Hans Crescent corner by day: terracotta colour, storeys, cornice,
 *     green copper mansard, turrets, the dome in the distance);
 *   "Harrods, London - June 2009 (cropped).jpg", Diliff, CC BY-SA 3.0,
 *     https://commons.wikimedia.org/wiki/File:Harrods,_London_-_June_2009_(cropped).jpg
 *     (the dome by day);
 *   "Harrods from Hans Road, Knightsbridge, September 2024.jpg", No Swan So
 *     Fine, CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Harrods_from_Hans_Road,_Knightsbridge,_September_2024.jpg
 *     (the Hans Road side);
 *   "Exterior of Harrods on Hans Crescent, London 2012-12-27.jpg", Daniel X.
 *     O'Neil, CC BY 2.0,
 *     https://commons.wikimedia.org/wiki/File:Exterior_of_Harrods_on_Hans_Crescent,_London_2012-12-27.jpg
 *     (the Hans Crescent side).
 * - Look-only: none.
 *
 * Estimated (from the photos against the lidar): the storey lines (shop
 * windows 0.8-4.8, mezzanine arches 5.6-9.4, upper groups 10.4-14.6 and
 * 15.6-20.4, cornice 21.4-22.6, attic to 27 set back 1.2 m), the bay width
 * (~5.4 m), the dome profile and the cupola, the Hans Road cupola's top
 * (40.6 m, from the night photo against the dome; lidar 34.8 at 1 m), the lamp spacing (2.5-4 m, half the real
 * density or less).
 *
 * Doubts
 * - The facades other than Brompton Road are drawn generically with the same
 *   storeys; their real bay rhythms and the rear service yards differ.
 * - The inner light wells are left out (the lidar shows a ~20 m deep well at
 *   x -27..2, y 8..17); the roof is otherwise flat at the lidar's level.
 * - The drum is drawn taller than the lidar strictly shows at its edge, so
 *   the dome reads as the skyline feature it is in the street photos.
 */
import { Part, writeGlb, type V3, type MaterialSpec } from './mesh'
import { PALETTE, finish } from './palette'
import { capPoly, insetRing, type XY } from './nyc-570-lexington'

export const BEARING = 317.8
const ID = 'london-harrods'
const TAU = Math.PI * 2

// OSM outline way/25739565 in the model frame (counter-clockwise).
const OUTLINE: XY[] = ([
  [65.6, -50.5], [37.3, -62.8], [29.5, -65.8], [-9.1, -80.4], [-10.1, -82.0], [-12.0, -82.8], [-13.5, -82.4], [-14.4, -79.8],
  [-16.2, -78.5], [-30.2, -68.2], [-41.1, -60.3], [-44.4, -56.9], [-50.8, -47.6], [-56.5, -35.1], [-60.3, -18.2], [-66.5, 19.5],
  [-69.2, 30.3], [-74.0, 55.5], [-74.7, 61.5], [-72.3, 63.8], [-9.6, 64.8], [14.3, 65.0], [55.6, 63.9], [57.7, 62.8],
  [59.1, 53.2], [65.8, -4.9], [68.6, -29.8], [69.8, -42.1], [69.4, -45.9], [67.7, -48.5],
] as XY[]).reverse()

// ---------------------------------------------------------------------------
type Frame = { o: V3; u: V3; n: V3 }
const F = (f: Frame, s: number, z: number, d: number): V3 => [f.o[0] + f.u[0] * s + f.n[0] * d, f.o[1] + f.u[1] * s + f.n[1] * d, f.o[2] + z]
const edgeFrame = (a: XY, b: XY): [Frame, number] => {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L
  return [{ o: [a[0], a[1], 0], u: [ux, uy, 0], n: [uy, -ux, 0] }, L]
}
function panel(p: Part, f: Frame, s0: number, s1: number, z0: number, z1: number, d = 0.06) {
  p.quad(F(f, s0, z0, d), F(f, s1, z0, d), F(f, s1, z1, d), F(f, s0, z1, d))
}
function archPanel(p: Part, f: Frame, sc: number, w: number, z0: number, zs: number, d = 0.06, n = 6) {
  const r = w / 2
  panel(p, f, sc - r, sc + r, z0, zs, d)
  const c = F(f, sc, zs, d)
  for (let i = 0; i < n; i++) {
    const a0 = (Math.PI * i) / n, a1 = (Math.PI * (i + 1)) / n
    p.tri(c, F(f, sc + r * Math.cos(a0), zs + r * Math.sin(a0), d), F(f, sc + r * Math.cos(a1), zs + r * Math.sin(a1), d))
  }
}
function proud(p: Part, f: Frame, s0: number, s1: number, z0: number, z1: number, d0: number, d1: number, o: { bottom?: boolean; top?: boolean; ends?: boolean } = {}) {
  const P = (s: number, z: number, d: number) => F(f, s, z, d)
  p.quad(P(s0, z0, d1), P(s1, z0, d1), P(s1, z1, d1), P(s0, z1, d1))
  if (o.top !== false) p.quad(P(s0, z1, d1), P(s1, z1, d1), P(s1, z1, d0), P(s0, z1, d0))
  if (o.ends !== false) {
    p.quad(P(s0, z0, d0), P(s0, z0, d1), P(s0, z1, d1), P(s0, z1, d0))
    p.quad(P(s1, z0, d1), P(s1, z0, d0), P(s1, z1, d0), P(s1, z1, d1))
  }
  if (o.bottom) p.quad(P(s0, z0, d0), P(s1, z0, d0), P(s1, z0, d1), P(s0, z0, d1))
}
/** Vertical walls round a ring (counter-clockwise), z0..z1. */
function walls(p: Part, ring: XY[], z0: number, z1: number) {
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    p.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
  }
}
/** A ledge round a ring: from the ring out by d, at z, facing up or down. */
function ringLedge(p: Part, ring: XY[], d: number, z: number, up: boolean) {
  const o = insetRing(ring, -d)
  for (let i = 0; i < ring.length; i++) {
    const j = (i + 1) % ring.length
    const a: V3 = [ring[i][0], ring[i][1], z], b: V3 = [ring[j][0], ring[j][1], z], c: V3 = [o[j][0], o[j][1], z], e: V3 = [o[i][0], o[i][1], z]
    if (up) p.quad(a, e, c, b); else p.quad(a, b, c, e)
  }
}
const ring3 = (r: XY[], z: number): V3[] => r.map(([x, y]) => [x, y, z])
const circ = (cx: number, cy: number, r: number, n: number, z: number, ph = 0): V3[] => Array.from({ length: n }, (_, i) => [cx + r * Math.cos(ph + (i / n) * TAU), cy + r * Math.sin(ph + (i / n) * TAU), z])

// ---------------------------------------------------------------------------
// Materials
// ---------------------------------------------------------------------------
const M = {
  terra: finish('harrods-terracotta', 0xcf8f72) as MaterialSpec,
  trim: finish('harrods-trim', 0xe2b293) as MaterialSpec,
  copper: PALETTE.copper as MaterialSpec,
  slate: finish('harrods-slate', 0x6f7880) as MaterialSpec,
  window: PALETTE.window as MaterialSpec,
  lamp: finish('lamp', 0xe9d9b8, 0.5) as MaterialSpec,
}
const terra = new Part(), trim = new Part(), copper = new Part(), slate = new Part(), win = new Part(), lamp = new Part()
// slate grey-lead roofs and the upper floors' glazing share one dark, unlit material: by night only the
// shop windows, the mezzanine arches and the bulbs light up, as in the night photo
const roof = slate, dark = slate

/** A lamp bead: a small tetrahedron, smooth-normalled so it welds to four vertices. */
function bead(c: V3, r = 0.38) {
  const v: V3[] = [[0, 0, r], [r * 0.943, 0, -r / 3], [-r * 0.471, r * 0.816, -r / 3], [-r * 0.471, -r * 0.816, -r / 3]]
  const P = (k: number): V3 => [c[0] + v[k][0], c[1] + v[k][1], c[2] + v[k][2]]
  const N = (k: number): V3 => [v[k][0] / r, v[k][1] / r, v[k][2] / r]
  for (const [i, j, k] of [[0, 1, 2], [0, 2, 3], [0, 3, 1], [1, 3, 2]]) lamp.tri(P(i), P(j), P(k), undefined, undefined, undefined, [N(i), N(j), N(k)])
}
/** Beads along a face line at height z, d out, every `step` metres. */
function beadLine(f: Frame, s0: number, s1: number, z: number, d: number, step: number) {
  const n = Math.max(1, Math.round((s1 - s0) / step))
  for (let k = 0; k <= n; k++) bead(F(f, s0 + ((s1 - s0) * k) / n, z, d))
}

// ---------------------------------------------------------------------------
// The block
// ---------------------------------------------------------------------------
const Z = { shop: 4.8, mez0: 5.6, mezS: 8.4, string: 9.9, up0: 10.4, up1: 14.6, up2: 15.6, up3: 20.4, corn0: 21.4, corn: 22.6, attic: 27.0 }
const ATTIC_IN = 1.2
const atticRing = insetRing(OUTLINE, ATTIC_IN)

walls(terra, OUTLINE, 0, Z.corn)
walls(terra, atticRing, Z.corn, Z.attic)
ringLedge(roof, atticRing, ATTIC_IN, Z.corn, true) // the gutter behind the parapet
capPoly(roof, atticRing, Z.attic, true)
// cornice (a projecting band with soffit), string course, parapet on the cornice
walls(trim, insetRing(OUTLINE, -0.8), Z.corn0, Z.corn)
ringLedge(trim, OUTLINE, 0.8, Z.corn0, false)
ringLedge(trim, OUTLINE, 0.8, Z.corn, true)
walls(trim, insetRing(OUTLINE, -0.15), Z.corn, Z.corn + 0.9)
ringLedge(trim, insetRing(OUTLINE, 0.15), 0.3, Z.corn + 0.9, true)

// facades, edge by edge
const BROMPTON = (a: XY, b: XY) => a[1] > 62 && b[1] > 62
for (let i = 0; i < OUTLINE.length; i++) {
  const a = OUTLINE[i], b = OUTLINE[(i + 1) % OUTLINE.length]
  const [f, L] = edgeFrame(a, b)
  if (L < 3.5) continue
  const front = BROMPTON(a, b)
  const nb = Math.max(1, Math.round(L / 5.4)), bw = L / nb
  const pil = L > 10
  for (let k = 0; k < nb; k++) {
    const sc = bw * (k + 0.5), hw = Math.min(1.75, bw / 2 - 0.85)
    // shop window (lit), mezzanine arch (lit), then the upper storeys grouped in one tall
    // unlit glazed stack between the pilasters
    panel(win, f, sc - hw - 0.3, sc + hw + 0.3, 0.8, Z.shop)
    archPanel(win, f, sc, Math.min(3.2, 2 * hw), Z.mez0, Z.mezS, 0.06, front ? 6 : 4)
    panel(dark, f, sc - hw, sc + hw, Z.up0, 15.0)
    panel(dark, f, sc - hw, sc + hw, 15.5, Z.up3)
    // attic: a window on the set-back wall
    const fa: Frame = { ...f, o: F(f, 0, 0, -ATTIC_IN) }
    if (front || k % 2 === 0) panel(dark, fa, sc - hw * 0.6, sc + hw * 0.6, 23.9, 26.2)
    // pilasters at every bay line, running from the shop fronts up through the storeys to the cornice
    if (pil && k > 0) proud(trim, f, bw * k - 0.45, bw * k + 0.45, Z.shop, Z.corn0, 0, 0.45, { top: false })
    // Brompton Road attic: a pedimented dormer every other bay, standing on the parapet line
    if (front && k % 2 === 1 && Math.abs(F(f, sc, 0, 0)[0] + 5) > 10 && F(f, sc, 0, 0)[0] < 34 && F(f, sc, 0, 0)[0] > -56) {
      const P = (s: number, z: number, d: number) => F(f, s, z, d)
      proud(trim, f, sc - 1.5, sc + 1.5, Z.corn, 26.4, -ATTIC_IN, 0.0, { top: false })
      trim.tri(P(sc - 1.7, 26.4, 0.05), P(sc + 1.7, 26.4, 0.05), P(sc, 28.2, 0.05))
      roof.quad(P(sc - 1.7, 26.4, 0.05), P(sc, 28.2, 0.05), P(sc, 28.2, -ATTIC_IN - 1.5), P(sc - 1.7, 26.4, -ATTIC_IN - 1.5))
      roof.quad(P(sc, 28.2, 0.05), P(sc + 1.7, 26.4, 0.05), P(sc + 1.7, 26.4, -ATTIC_IN - 1.5), P(sc, 28.2, -ATTIC_IN - 1.5))
      archPanel(dark, f, sc, 1.4, 23.6, 25.4, 0.06, 4)
      bead(P(sc, 28.5, 0.1)); bead(P(sc - 1.7, 26.6, 0.1)); bead(P(sc + 1.7, 26.6, 0.1))
    }
  }
  // the outline lighting: the cornice and parapet lines, and the pilasters, bulb by bulb
  beadLine(f, 0, L, Z.corn + 0.15, 0.95, front ? 2.2 : 5.0)
  if (front) {
    beadLine(f, 0, L, Z.corn + 1.15, 0.2, 2.2)
  }
  if (pil) for (let k = front ? 1 : 2; k < nb; k += front ? 1 : 4) for (let z = 5.6; z < Z.corn0 - 0.5; z += front ? 2.2 : 3.6) bead(F(f, bw * k, z, 0.6))
}

// the raised inner block (lidar 31 m) and the rooftop plant blocks the lidar shows
for (const [x0, y0, x1, y1, h] of [[8, -38, 62, -3, 31], [2, -46, 20, -34, 34.8], [-52, 15, -38, 25, 28.5], [-36, -62, -28, -50, 28.8], [-28, 26, -12, 34, 28.4]]) {
  const r: XY[] = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
  walls(terra, r, Z.attic - 0.5, h - 0.6)
  walls(trim, r, h - 0.6, h)
  capPoly(roof, r, h, true)
}

// ---------------------------------------------------------------------------
// The Hans Crescent corner (north-east end of the Brompton Road front):
// copper mansard with dormers and two turrets
// ---------------------------------------------------------------------------
{
  const r: XY[] = [[37, 46], [58.2, 46], [57.0, 62.0], [55.3, 62.9], [37, 63.4]]
  const ri = insetRing(r, 1.3)
  walls(terra, r, Z.attic, Z.attic + 0.6)
  copper.loft([ring3(r, Z.attic + 0.6), ring3(ri, 33.0)])
  capPoly(roof, ri, 33.0, true)
  walls(trim, ri, 33.0, 33.5)
  capPoly(roof, ri, 33.5, true)
  // dormers in the mansard on the two street faces
  for (const [f0, n] of [[edgeFrame([55.3, 62.9], [37, 63.4])[0], 3], [edgeFrame([58.2, 46], [57.0, 62.0])[0], 3]] as [Frame, number][]) {
    for (let k = 0; k < n; k++) {
      const s = 3.4 + k * 5.6, P = (q: number, z: number, d: number) => F(f0, q, z, d)
      proud(trim, f0, s - 1.3, s + 1.3, Z.attic + 0.6, 31.0, -2.2, 0.2)
      trim.tri(P(s - 1.45, 31.0, 0.25), P(s + 1.45, 31.0, 0.25), P(s, 32.6, 0.25))
      copper.quad(P(s - 1.45, 31.0, 0.25), P(s, 32.6, 0.25), P(s, 32.6, -2.4), P(s - 1.45, 31.0, -2.4))
      copper.quad(P(s, 32.6, 0.25), P(s + 1.45, 31.0, 0.25), P(s + 1.45, 31.0, -2.4), P(s, 32.6, -2.4))
      panel(dark, f0, s - 0.7, s + 0.7, Z.attic + 1.0, 30.4, 0.26)
      bead(P(s, 32.8, 0.3)); bead(P(s - 1.45, 31.2, 0.3)); bead(P(s + 1.45, 31.2, 0.3))
    }
  }
  for (const [cx, cy] of [[56.0, 61.6], [37.8, 62.6]]) {
    terra.loft([circ(cx, cy, 1.2, 8, Z.corn), circ(cx, cy, 1.2, 8, 33.2)])
    trim.loft([circ(cx, cy, 1.4, 8, 33.2), circ(cx, cy, 1.4, 8, 33.7)])
    const top = circ(cx, cy, 1.4, 8, 33.7)
    for (let i = 0; i < 8; i++) copper.tri(top[i], top[(i + 1) % 8], [cx, cy, 36.4])
    bead([cx, cy, 36.6])
    for (const z of [24.5, 26.5, 28.5, 30.5]) bead([cx + 0.95, cy + 0.95, z])
  }
}

// ---------------------------------------------------------------------------
// The Hans Road corner (south-west end): a raised corner block and its
// open cupola turret
// ---------------------------------------------------------------------------
{
  const r: XY[] = [[-72.0, 50], [-58, 50], [-58, 63.0], [-72.2, 62.6]]
  walls(terra, r, Z.attic, 30.8)
  capPoly(roof, r, 30.8, true)
  for (let i = 0; i < 4; i++) {
    const [f, L] = edgeFrame(r[i], r[(i + 1) % 4])
    proud(trim, f, 0, L, 30.2, 30.8, 0, 0.35, { ends: false, bottom: true })
    if (i >= 2) beadLine(f, 0, L, 31.0, 0.2, 2.6)
  }
  const cx = -69.6, cy = 60.2
  terra.loft([circ(cx, cy, 2.5, 8, 30.8), circ(cx, cy, 2.5, 8, 33.4)])
  trim.loft([circ(cx, cy, 2.8, 8, 33.4), circ(cx, cy, 2.8, 8, 34.0)])
  trim.cap(circ(cx, cy, 2.8, 8, 34.0), true)
  // open cupola: eight posts with real gaps, then a cap and spirelet
  for (let i = 0; i < 8; i++) {
    const a = ((i + 0.5) / 8) * TAU, px = cx + 2.0 * Math.cos(a), py = cy + 2.0 * Math.sin(a)
    terra.loft([circ(px, py, 0.3, 4, 34.0, Math.PI / 4), circ(px, py, 0.3, 4, 36.8, Math.PI / 4)])
  }
  trim.loft([circ(cx, cy, 2.6, 8, 36.8), circ(cx, cy, 2.6, 8, 37.4)])
  trim.cap(circ(cx, cy, 2.6, 8, 36.8), false)
  terra.loft([circ(cx, cy, 2.6, 8, 37.4), circ(cx, cy, 1.6, 8, 38.6), circ(cx, cy, 0.5, 8, 39.6)])
  trim.loft([circ(cx, cy, 0.18, 6, 39.6), circ(cx, cy, 0.18, 6, 40.6)])
  bead([cx, cy, 40.8])
  for (let i = 0; i < 8; i += 2) { const a = (i / 8) * TAU; bead([cx + 2.9 * Math.cos(a), cy + 2.9 * Math.sin(a), 37.1]); bead([cx + 3.0 * Math.cos(a), cy + 3.0 * Math.sin(a), 33.7]) }
}

// ---------------------------------------------------------------------------
// The central dome on Brompton Road
// ---------------------------------------------------------------------------
{
  const cx = -5.0, cy = 56.0, h = 7.0
  const sq: XY[] = [[cx - h, cy - h], [cx + h, cy - h], [cx + h, cy + h], [cx - h, cy + h]]
  // a tall square drum with big arched windows, pilasters and a cornice
  walls(terra, sq, Z.corn, 32.6)
  for (let i = 0; i < 4; i++) {
    const [f] = edgeFrame(sq[i], sq[(i + 1) % 4])
    for (const s of [3.7, 7.0, 10.3]) archPanel(win, f, s, 2.1, 27.8, 30.6, 0.06, 6)
    for (const s of [2.05, 5.35, 8.65, 11.95]) proud(trim, f, s - 0.3, s + 0.3, 27.0, 32.0, 0, 0.3, { top: false })
    proud(trim, f, -0.4, 2 * h + 0.4, 32.0, 32.8, -0.2, 0.55, { bottom: true, ends: false })
    for (const s of [0.3, 2 * h - 0.3]) proud(trim, f, s - 0.35, s + 0.35, 32.8, 34.4, -0.35, 0.35) // corner pedestals
    beadLine(f, 0, 2 * h, 32.9, 0.65, 2.33)
  }
  // eight-ribbed dome: an ogee-ish profile from r 6.6 at 32.8 to the lantern ring
  const prof: [number, number][] = [[6.6, 32.8], [6.5, 34.6], [6.0, 36.8], [5.0, 38.9], [3.6, 40.6], [2.2, 41.8]]
  const N = 16
  const rings = prof.map(([r, z]) => circ(cx, cy, r, N, z, Math.PI / N))
  terra.loft(rings)
  for (let i = 0; i < N; i += 2) {
    // ribs: raised fins on every other meridian, with lamp beads
    const a = Math.PI / N + (i / N) * TAU
    for (let k = 0; k < prof.length - 1; k++) {
      const [r0, z0] = prof[k], [r1, z1] = prof[k + 1]
      const P = (r: number, z: number, da: number, lift: number): V3 => [cx + (r + lift) * Math.cos(a + da / r), cy + (r + lift) * Math.sin(a + da / r), z]
      trim.quad(P(r0, z0, -0.28, 0), P(r0, z0, 0, 0.4), P(r1, z1, 0, 0.4), P(r1, z1, -0.28, 0))
      trim.quad(P(r0, z0, 0, 0.4), P(r0, z0, 0.28, 0), P(r1, z1, 0.28, 0), P(r1, z1, 0, 0.4))
      bead(P(r0, z0, 0, 0.6))
    }
  }
  // oculi on the cardinal faces
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * TAU, r = 6.2, z = 36.4
    const f: Frame = { o: [cx + r * Math.cos(a), cy + r * Math.sin(a), 0], u: [-Math.sin(a), Math.cos(a), 0], n: [Math.cos(a), Math.sin(a), 0] }
    archPanel(win, f, 0, 1.2, z - 0.5, z, 0.3, 6)
  }
  // the open cupola (lantern): ring, eight posts with real gaps, cap, finial
  trim.loft([circ(cx, cy, 2.3, 8, 41.8), circ(cx, cy, 2.3, 8, 42.4)])
  trim.cap(circ(cx, cy, 2.3, 8, 42.4), true)
  for (let i = 0; i < 8; i++) {
    const a = ((i + 0.5) / 8) * TAU, px = cx + 1.8 * Math.cos(a), py = cy + 1.8 * Math.sin(a)
    terra.loft([circ(px, py, 0.3, 4, 42.4, Math.PI / 4), circ(px, py, 0.3, 4, 45.2, Math.PI / 4)])
  }
  trim.loft([circ(cx, cy, 2.2, 8, 45.2), circ(cx, cy, 2.2, 8, 45.8)])
  trim.cap(circ(cx, cy, 2.2, 8, 45.2), false)
  terra.loft([circ(cx, cy, 2.2, 8, 45.8), circ(cx, cy, 1.5, 8, 47.0), circ(cx, cy, 0.5, 8, 47.8)])
  trim.loft([circ(cx, cy, 0.22, 6, 47.8), circ(cx, cy, 0.22, 6, 48.9)])
  bead([cx, cy, 49.1], 0.45)
  for (let i = 0; i < 8; i++) { const a = (i / 8) * TAU; bead([cx + 2.5 * Math.cos(a), cy + 2.5 * Math.sin(a), 45.5]); bead([cx + 2.6 * Math.cos(a), cy + 2.6 * Math.sin(a), 42.1]) }
}

// ---------------------------------------------------------------------------
const parts = [
  { part: terra, material: M.terra },
  { part: trim, material: M.trim },
  { part: copper, material: M.copper },
  { part: slate, material: M.slate },
  { part: win, material: M.window },
  { part: lamp, material: M.lamp },
]
const tris = parts.reduce((s, { part }) => s + part.triangles, 0)
const glb = writeGlb('Harrods', parts, { license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor' })
console.log(`${ID}: ${tris} triangles, ${glb.length} bytes; ` + parts.map(({ part, material }) => `${material.name} ${part.triangles}`).join(', '))
if (!process.env.LOOSE) {
  if (tris > 6500) throw new Error('triangle budget exceeded')
  if (glb.length > 250 * 1024) throw new Error('file budget exceeded')
}
await Bun.write(new URL(`../models/${ID}.glb`, import.meta.url).pathname, glb)
