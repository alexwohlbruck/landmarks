/**
 * Merdeka 118 (Menara Merdeka Maybank, PNB 118; 2016-2023, Fender
 * Katsalidis with RSP KL), Kuala Lumpur: procedural, CC0-1.0.
 * bun generators/kl-merdeka-118.ts
 *
 * Writes two levels of detail in the same frame:
 * - models/kl-merdeka-118.glb, the low model (~2,900 triangles): the
 *   folded shaft, raised fold ridges and a 9 m diamond grid of raised
 *   mullions on every facet, solid louvre bands, the crown box, blade and
 *   sign, a 6-sided spire;
 * - models/kl-merdeka-118.detail.glb, drawn from zoom 16 (~10,500
 *   triangles): the same with a 4 m mullion grid, the louvre bands as rows
 *   of vents, an 8-sided spire with its lights, and the edge-walk box.
 *
 * Map frame: x east, y north, z up, metres. Origin: the area centroid of
 * the OSM outline way/645604854 (3.1416115 N, 101.7006802 E); bearing 0, so
 * the geometry is drawn in its real orientation. y = 0 is the tower's own
 * foot; elevation 0.
 *
 * Identity, in order: the 679 m silhouette, a faceted glass shaft tapering
 * hard above its middle tier, and a long, thin faceted spire rising beside
 * a blade at one corner of the crown box; the folding planes: three tiers
 * between band rings, each face folding out to its bands and in at
 * mid-tier, where a ring of vertices over the middle of each face pulls the
 * corners in. So every face carries an hourglass of two big triangles whose
 * folds cross in an X (the songket pattern), every corner a diamond folded
 * in along its waist, and the outline kinks at every band and every waist;
 * the hourglasses in deep blue and the corner diamonds in light blue, as
 * the facets alternate in the photos; the pale lines on every fold and
 * band (LED strips at night) and the dark louvre bands; the gold Maybank
 * sign on the crown.
 *
 * Sources:
 *  - OSM (ODbL), fetched 2026-11-27 with tools/osm.py: the outline
 *    way/645604854 (building=office, Menara Merdeka Maybank, height 678.9,
 *    118 levels, wikidata Q7969454): a pentagon, SW tip (-21.2,-34.3), SE
 *    (21.2,-12.6), NE (22.0,23.6), the short chamfer NE-N (11.7,30.5)
 *    carrying the spire, NW (-20.0,14.8) here. Its building:parts
 *    way/471963796 (0-125), 629114913 (125-250), 629114914 (250-375),
 *    629126589 and 630111262 (375-500), 629126767 (500-525), 629746150
 *    (525-550, roof:shape saltbox, the north-east half), 629116776 and
 *    629116778 (the spire's foot at (16.9, 27.1), height 635). The parts
 *    show the SW tip cut back as the tower rises and the top sloping up to
 *    the spire's NE corner; their round 125 m steps look schematic and the
 *    band heights below come from the photos instead.
 *    The tower stands inside the separate, unnamed building way/863227721
 *    (the tower's podium and forecourt, 11,561 m²) and next to 118 Mall
 *    (way/1415585083); neither is part of the tower outline, so neither is
 *    drawn or replaced (tools/overlap.ts reports way/863227721 under the
 *    model; it is left out on purpose).
 *  - Wikipedia "Merdeka 118" (read 2026-11): architectural height 678.9 m,
 *    roof 518.2 m, top floor 502.8 m, spire 160.7 m, 118 floors; facade of
 *    triangular/diamond glass panels from the songket pattern; ~8.4 km of
 *    LED strips; topped out 2021, opened 2024. CTBUH Skyscraper Center:
 *    678.9 m, top occupied floor 502.8 m.
 *  - Photos (Wikimedia Commons), with the side each was taken from:
 *    * Merdeka_Tower_20241022_-_full_2.jpg, Ahmad Ali Karim, CC0: from the
 *      SSE (~155°, elevated, ~1 km; Stadium Merdeka in front, Menara Maybank
 *      behind to the right): measured on the 3586 px original against the
 *      tip (678.9 m) and the foot: band rings at ~181, ~356 and ~515 m, the
 *      crown's top at ~545-556 m, widths ~77 m at the foot, ~71 m at 181 m,
 *      ~70 m at 356 m, ~64 m at 515 m and ~61 m at the crown (corner to
 *      corner); the glass colour; the spire's form.
 *      https://commons.wikimedia.org/wiki/File:Merdeka_Tower_20241022_-_full_2.jpg
 *    * Merdeka_Tower_20241022_-_full_3.jpg, Ahmad Ali Karim, CC0, the same
 *      side, wider. https://commons.wikimedia.org/wiki/File:Merdeka_Tower_20241022_-_full_3.jpg
 *    * Merdeka_Tower_20241022_-_top_1.jpg, Ahmad Ali Karim, CC0: the crown
 *      and spire close up: the spire ~12 m wide at its foot, ~7-8 m a third
 *      of the way up, ~3 m near the top, faceted; the crown's sloped top.
 *      https://commons.wikimedia.org/wiki/File:Merdeka_Tower_20241022_-_top_1.jpg
 *    * Merdeka_Tower_20241022_-_with_other_towers_1.jpg, Ahmad Ali Karim,
 *      CC0: the tower against the skyline, KL Tower and Petronas behind.
 *      https://commons.wikimedia.org/wiki/File:Merdeka_Tower_20241022_-_with_other_towers_1.jpg
 *    * Merdeka_118_on_a_clear_day.jpg, Juniper Jia-En, CC BY-SA 4.0: the
 *      crown's sloped top edge rising to the peak by the spire; the facet
 *      lines. https://commons.wikimedia.org/wiki/File:Merdeka_118_on_a_clear_day.jpg
 *    * Merdeka_118_Pasar_Seni.jpg, ThopazProductions, CC0: from the west
 *      (~280°, Pasar Seni): the zigzag folds and the bands.
 *      https://commons.wikimedia.org/wiki/File:Merdeka_118_Pasar_Seni.jpg
 *    * Merdeka_PNB_118,_Kuala_Lumpur.jpg, Sean Doan, CC BY-SA 4.0: the core
 *      under construction, showing the slight bulge of the shaft.
 *      https://commons.wikimedia.org/wiki/File:Merdeka_PNB_118,_Kuala_Lumpur.jpg
 *    * Merdeka_118_illuminated_at_night.jpg, Wlsrudals, CC0: night: the LED
 *      lines on every fold and band, lit windows, the spire's lights.
 *      https://commons.wikimedia.org/wiki/File:Merdeka_118_illuminated_at_night.jpg
 *  - No lidar (outside the US). No Google, Apple, Bing or Mapbox imagery,
 *    Street View or 3D tiles were used. No look-only references.
 *
 * Numbers in the model:
 *  - OSM: the foot's pentagon's shape and turn, the spire's corner (the
 *    NE-N chamfer).
 *  - Published: tip 678.9 m; roof 518.2 m (the spire rises from the crown
 *    box's roof at 546 m, so ~133 m of it shows above the roof); 118 floors.
 *  - From the photos (above): the band rings 181 / 356 / 515 m; the
 *    pentagon drawn 12% larger than OSM's (OSM reads ~64 m across from the
 *    SSE, the far photo ~71-77 m over the lower tiers); the taper (band
 *    scale 1.0 / 0.95 / 0.9 / 0.7: the crown ~70% of the middle tier, as
 *    in the west photo), with the SW tip drawn in an extra 10-18% above the
 *    foot as OSM's parts show; the crown box 515-546 m with a flat roof;
 *    the blade, the east wall carried up past the roof, its top edge
 *    climbing ~24 m over the wall's length (about 40°, read on the clear-
 *    day photo) to a peak at 570 m at the NE corner; the gold sign near the
 *    south end of the west face, just under the roof; the spire's widths.
 *  - Estimated: the waist rings (area 0.78 of the band rings', exaggerated
 *    a little so the kinks read at 200 px); louvre bands 3.6-4.2 m tall;
 *    fold lines 1.3 m wide (0.9 in detail), bolder than real; the mullion
 *    grid's spacing (9 m low, 4 m detail; the real panels are smaller).
 *
 * Night: the fold and band lines are `neon-merdeka-led` and glow (white;
 *    the real LEDs run through colour sequences); the sign is
 *    `neon-merdeka-sign` and glows gold; the facets and spire are `glass`
 *    and stay dark, as the night photo shows a dark tower drawn in lines
 *    (as `window` the whole shaft glowed and the lines were lost); the
 *    spire's lights are `lamp` beads in the detail model; louvres and roof
 *    stay dark.
 *
 * Doubts:
 *  - The plan is OSM's simplified pentagon; the real floor plate's corners
 *    and the exact fold geometry (which corner sits over which face) are
 *    read from photos, not drawings. The north and east sides were seen only
 *    obliquely.
 *  - Band heights were measured on one far photo; perspective may shift
 *    them by ~10 m.
 *  - Which crown wall carries the blade (drawn on the east wall, to the NE
 *    corner by the spire) is read from oblique photos; its angle is from
 *    one photo whose side is unknown.
 *  - The sign is a plain lit gold panel; the Maybank lettering is not
 *    traced (STYLE: plain box for a sign that is not the landmark).
 *  - The pentagon is enlarged 12% past OSM's outline on photo evidence.
 */
import { Part, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

type XY = [number, number]

/** The foot's pentagon (OSM way/645604854, centroid at the origin), ccw. */
const FOOT: XY[] = [
  [-21.2, -34.3], // SW tip
  [21.2, -12.6], // SE
  [22.0, 23.6], // NE
  [11.7, 30.5], // N (the NE-N chamfer carries the spire)
  [-20.0, 14.8], // NW
]
/**
 * The band rings (the mechanical floors, lit lines at night): height, scale
 * about the centroid, the SW tip's extra pull-in. The tower tapers hard
 * above the middle tier: the crown is clearly narrower than the middle.
 */
const BANDS: { z: number; s: number; sw: number }[] = [
  { z: 0, s: 1.0, sw: 1.0 },
  { z: 181, s: 0.95, sw: 0.9 },
  { z: 356, s: 0.9, sw: 0.85 },
  { z: 515, s: 0.7, sw: 0.82 },
]
/**
 * Halfway up each tier the corners fold in: the mid ring has a vertex over
 * the middle of each face, sized to this share of the band ring's area, so
 * each face folds out to its bands and in at mid-tier (the kinks in the
 * outline, and the X on every face where the folds cross).
 */
const PINCH = 0.78
/**
 * OSM's outline is drawn 12% larger: it reads ~64 m across from the SSE,
 * where the far photo measures ~71-77 m over the lower tiers, and the model
 * at OSM size read too slender beside both photos.
 */
const GROW = 1.12
const TIP = 678.9
/** The crown: a flat-roofed box over the top band, and a blade rising to the spire's corner. */
const ROOF = 546, BLADE_PEAK = 570, BLADE_T = 2.6

type LOD = { detail: boolean; line: number; grid: number; strip: number; spireRings: number; spireSides: number }
const LOW: LOD = { detail: false, line: 1.3, grid: 9, strip: 0.6, spireRings: 13, spireSides: 6 }
const DETAIL: LOD = { detail: true, line: 0.9, grid: 4.0, strip: 0.35, spireRings: 25, spireSides: 8 }

const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const subv = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const crs = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const unit = (a: V3): V3 => { const l = Math.hypot(...a) || 1; return [a[0] / l, a[1] / l, a[2] / l] }
const lerp3 = (a: V3, b: V3, t: number): V3 => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]
const area = (p: XY[]) => p.reduce((s, a, i) => { const b = p[(i + 1) % p.length]; return s + a[0] * b[1] - b[0] * a[1] }, 0) / 2

/** A band ring: the foot's pentagon scaled, its SW tip drawn in further. */
function cornerRing(s: number, sw: number): XY[] {
  return FOOT.map((p, i) => { const k = GROW * s * (i === 0 ? sw : 1); return [p[0] * k, p[1] * k] as XY })
}

/**
 * A mid ring: one vertex over the middle of each face of `ring`, pushed out
 * by k x the face's length, k chosen so the ring's area is `target`.
 */
function faceRing(ring: XY[], target: number): XY[] {
  const make = (k: number) => ring.map((a, i) => {
    const b = ring[(i + 1) % ring.length], m: XY = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
    const e: XY = [b[0] - a[0], b[1] - a[1]], l = Math.hypot(...e)
    return [m[0] + (e[1] / l) * k * l, m[1] - (e[0] / l) * k * l] as XY
  })
  let lo = -0.5, hi = 1
  for (let it = 0; it < 60; it++) { const k = (lo + hi) / 2; if (area(make(k)) < target) lo = k; else hi = k }
  return make((lo + hi) / 2)
}

type Tri = [V3, V3, V3]

function build(lod: LOD) {
  const glass = new Part()   // the faces' hourglass facets (deeper blue)
  const glass2 = new Part()  // the corner diamonds (lighter)
  const led = new Part()     // the lit fold and band lines
  const louvre = new Part()  // louvre bands, the crown's roof, the edge-walk box
  const sign = new Part()    // the gold crown sign
  const lamps = new Part()
  const spire = glass        // the spire is clad in the same deep blue glass

  /** A triangle wound so its normal points away from the tower's axis (or up). */
  const outward = (part: Part, t0: Tri, up = false) => {
    const t = t0.map((p) => [p[0], p[1], Math.max(0, p[2])] as V3) as Tri
    const n = crs(subv(t[1], t[0]), subv(t[2], t[0]))
    const c = mul(add(add(t[0], t[1]), t[2]), 1 / 3)
    const ref: V3 = up ? [0, 0, 1] : [c[0], c[1], 0]
    if (dot(n, ref) >= 0) part.tri(t[0], t[1], t[2]); else part.tri(t[0], t[2], t[1])
  }
  /** A triangle wound to face `dir`. */
  const facing = (part: Part, t0: Tri, dir: V3) => {
    const t = t0.map((p) => [p[0], p[1], Math.max(0, p[2])] as V3) as Tri
    const n = crs(subv(t[1], t[0]), subv(t[2], t[0]))
    if (dot(n, dir) >= 0) part.tri(t[0], t[1], t[2]); else part.tri(t[0], t[2], t[1])
  }
  const triNormal = (f: Tri): V3 => {
    let nn = unit(crs(subv(f[1], f[0]), subv(f[2], f[0])))
    const c = mul(add(add(f[0], f[1]), f[2]), 1 / 3)
    if (Math.abs(nn[2]) > 0.7 ? nn[2] < 0 : dot(nn, [c[0], c[1], 0]) < 0) nn = mul(nn, -1)
    return nn
  }

  // ---- The shaft: three tiers, each folding out to its bands and in at mid-height.
  const bands = BANDS.map((b) => ({ z: b.z, p: cornerRing(b.s, b.sw) }))
  const faces: { f: Tri; corner: boolean; base: [V3, V3]; apex: V3 }[] = []
  const folds: [V3, V3][] = []
  for (let k = 0; k < bands.length - 1; k++) {
    const B = bands[k], T = bands[k + 1], zm = (B.z + T.z) / 2
    const b0 = BANDS[k], b1 = BANDS[k + 1]
    const mid = cornerRing((b0.s + b1.s) / 2, (b0.sw + b1.sw) / 2)
    const M = faceRing(mid, area(mid) * PINCH)
    const n = B.p.length
    const b = (i: number): V3 => [B.p[i % n][0], B.p[i % n][1], B.z]
    const t = (i: number): V3 => [T.p[i % n][0], T.p[i % n][1], T.z]
    const m = (i: number): V3 => [M[i % n][0], M[i % n][1], zm]
    for (let i = 0; i < n; i++) {
      // the face's hourglass: up from its bottom band to the waist, down from its top band
      faces.push({ f: [b(i), b(i + 1), m(i)], corner: false, base: [b(i), b(i + 1)], apex: m(i) })
      faces.push({ f: [m(i), t(i + 1), t(i)], corner: false, base: [t(i), t(i + 1)], apex: m(i) })
      // the corner diamond round corner i+1, folded in along the waist
      faces.push({ f: [b(i + 1), m(i + 1), m(i)], corner: true, base: [m(i), m(i + 1)], apex: b(i + 1) })
      faces.push({ f: [m(i), m(i + 1), t(i + 1)], corner: true, base: [m(i), m(i + 1)], apex: t(i + 1) })
      folds.push([b(i), m(i)], [b(i + 1), m(i)], [m(i), t(i)], [m(i), t(i + 1)])
    }
  }
  for (const F of faces) outward(F.corner ? glass2 : glass, F.f)

  // ---- The crown: the top band carried straight up to a flat roof.
  const top = bands[bands.length - 1]
  const tp = top.p, n = tp.length
  const crownFaces: Tri[] = []
  for (let i = 0; i < n; i++) {
    const a = tp[i], c = tp[(i + 1) % n]
    const A0: V3 = [a[0], a[1], top.z], C0: V3 = [c[0], c[1], top.z], A1: V3 = [a[0], a[1], ROOF], C1: V3 = [c[0], c[1], ROOF]
    crownFaces.push([A0, C0, C1], [A0, C1, A1])
    outward(i % 2 ? glass2 : glass, [A0, C0, C1]); outward(i % 2 ? glass2 : glass, [A0, C1, A1])
    folds.push([A1, C1])
  }
  const rc: XY = tp.reduce((s, p) => [s[0] + p[0] / n, s[1] + p[1] / n], [0, 0] as XY)
  const roofFaces: Tri[] = []
  for (let i = 0; i < n; i++) {
    const a = tp[i], c = tp[(i + 1) % n]
    const f: Tri = [[rc[0], rc[1], ROOF], [a[0], a[1], ROOF], [c[0], c[1], ROOF]]
    roofFaces.push(f); outward(louvre, f, true)
  }
  for (let i = 0; i < n; i++) { const a = tp[i]; folds.push([[a[0], a[1], top.z], [a[0], a[1], ROOF]]) }

  // The blade: the crown's east wall (SE to NE corner) carried up past the
  // roof as a thin plate whose top edge climbs to a peak at the NE corner,
  // beside the spire.
  {
    const a = tp[1], c = tp[2] // SE, NE
    const e = unit([c[0] - a[0], c[1] - a[1], 0]), inw: V3 = [-e[1], e[0], 0] // left of a→c is inside (ccw)
    const o = (p: XY, z: number, d: number): V3 => [p[0] + inw[0] * d, p[1] + inw[1] * d, z]
    const A0 = o(a, ROOF, 0), C0 = o(c, ROOF, 0), Cp = o(c, BLADE_PEAK, 0)
    const A0i = o(a, ROOF, BLADE_T), C0i = o(c, ROOF, BLADE_T), Cpi = o(c, BLADE_PEAK - BLADE_T * 0.6, BLADE_T)
    const out: V3 = mul(inw, -1)
    facing(glass, [A0, C0, Cp], out) // the outer face, flush with the wall below
    facing(glass2, [A0i, Cpi, C0i], inw) // the inner face
    const slope = unit(crs(subv(Cp, A0), out)) // up-ish normal of the sloped top
    facing(louvre, [A0, Cp, Cpi], mul(slope, dot(slope, [0, 0, 1]) >= 0 ? 1 : -1))
    facing(louvre, [A0, Cpi, A0i], mul(slope, dot(slope, [0, 0, 1]) >= 0 ? 1 : -1))
    facing(glass2, [C0, C0i, Cpi], e); facing(glass2, [C0, Cpi, Cp], e) // the peak's end
    folds.push([A0, Cp])
    crownFaces.push([A0, C0, Cp])
  }

  // ---- The fold lines: a raised ridge along each fold, lying on both faces.
  const allFaces: Tri[] = [...faces.map((F) => F.f), ...crownFaces, ...roofFaces]
  const same = (p: V3, q: V3) => Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]) < 1e-6
  const hasEdge = (f: Tri, a: V3, b: V3) => f.some((v) => same(v, a)) && f.some((v) => same(v, b))
  const ridge = (a: V3, b: V3, w: number, lift: number, part: Part) => {
    const adj = allFaces.filter((f) => hasEdge(f, a, b))
    if (!adj.length) return
    const e = unit(subv(b, a))
    const sides = adj.slice(0, 2).map((f) => {
      const c = f.find((v) => !same(v, a) && !same(v, b))!
      let t = subv(c, a); t = unit(subv(t, mul(e, dot(t, e))))
      return { t, nrm: triNormal(f) }
    })
    if (sides.length === 1) sides.push({ t: mul(sides[0].t, -1), nrm: sides[0].nrm })
    const nAvg = unit(add(sides[0].nrm, sides[1].nrm))
    const mk = (p: V3) => ({
      crest: add(p, mul(nAvg, lift + (lod.detail ? 0.14 : 0.1))),
      s0: add(add(p, mul(sides[0].t, w / 2)), mul(sides[0].nrm, lift)),
      s1: add(add(p, mul(sides[1].t, w / 2)), mul(sides[1].nrm, lift)),
    })
    const A = mk(a), B = mk(b)
    for (const [p0, p1, q0, q1] of [[A.s0, A.crest, B.s0, B.crest], [A.crest, A.s1, B.crest, B.s1]] as V3[][]) {
      facing(part, [p0, q0, q1], nAvg); facing(part, [p0, q1, p1], nAvg)
    }
  }
  for (let k = 1; k < bands.length; k++) {
    const r = bands[k]
    for (let i = 0; i < n; i++) {
      const a = r.p[i], c = r.p[(i + 1) % n]
      folds.push([[a[0], a[1], r.z], [c[0], c[1], r.z]])
    }
  }
  for (const [a, b] of folds) ridge(a, b, lod.line, 0.12, led)

  // ---- The mullions: raised strips in a diamond grid on every facet,
  // parallel to its two sloping edges (the songket glazing), in the same
  // glass as the facet, so they read by their relief and stay dark at night.
  const strip = (part: Part, p: V3, q: V3, nrm: V3, w: number, h: number) => {
    const e = unit(subv(q, p)), side = unit(crs(nrm, e))
    const p1 = add(p, mul(e, w)), q1 = add(q, mul(e, -w))
    if (dot(subv(q1, p1), e) < 1) return
    const L0 = add(p1, mul(side, w / 2)), R0 = add(p1, mul(side, -w / 2)), L1 = add(q1, mul(side, w / 2)), R1 = add(q1, mul(side, -w / 2))
    const up = (v: V3) => add(v, mul(nrm, h))
    facing(part, [up(L0), up(R0), up(R1)], nrm); facing(part, [up(L0), up(R1), up(L1)], nrm)
    facing(part, [L0, up(L0), up(L1)], side); facing(part, [L0, up(L1), L1], side)
    facing(part, [R0, R1, up(R1)], mul(side, -1)); facing(part, [R0, up(R1), up(R0)], mul(side, -1))
    if (lod.detail) { facing(part, [L0, R0, up(R0)], mul(e, -1)); facing(part, [L0, up(R0), up(L0)], mul(e, -1)) }
  }
  for (const F of faces) {
    const [A, B] = F.base, X = F.apex, nrm = triNormal(F.f)
    const L = Math.hypot(...subv(B, A)), k = Math.max(1, Math.floor(L / lod.grid))
    const part = F.corner ? glass2 : glass // raised in the facet's own glass: relief, not paint
    for (let j = 1; j <= k; j++) {
      const t = j / (k + 1), P = lerp3(A, B, t)
      strip(part, P, add(mul(B, t), mul(X, 1 - t)), nrm, lod.strip, 0.12) // parallel to A→apex
      strip(part, P, lerp3(A, X, t), nrm, lod.strip, 0.12) // parallel to B→apex
    }
  }

  // ---- The louvre bands under each band line: solid in the low model, a
  // row of vents with gaps in the detail model.
  const grow = (ring: XY[], off: number) => ring.map((p, i) => {
    const m = ring.length, pa = ring[(i - 1 + m) % m], pb = ring[(i + 1) % m]
    const n1 = unit([p[1] - pa[1], -(p[0] - pa[0]), 0]), n2 = unit([pb[1] - p[1], -(pb[0] - p[0]), 0])
    const bis = unit(add(n1, n2)), k = off / Math.max(0.3, dot(bis, n1))
    return [p[0] + bis[0] * k, p[1] + bis[1] * k] as XY
  })
  const vent = (a: XY, c: XY, z0: number, z1: number, off: number, ia: XY, ic: XY) => {
    const A0: V3 = [a[0], a[1], z0], C0: V3 = [c[0], c[1], z0], A1: V3 = [a[0], a[1], z1], C1: V3 = [c[0], c[1], z1]
    outward(louvre, [A0, C0, C1]); outward(louvre, [A0, C1, A1])
    outward(louvre, [[ia[0], ia[1], z1], A1, C1], true); outward(louvre, [[ia[0], ia[1], z1], C1, [ic[0], ic[1], z1]], true)
    if (lod.detail) {
      const e = unit([c[0] - a[0], c[1] - a[1], 0])
      facing(louvre, [[ia[0], ia[1], z0], A0, A1], mul(e, -1)); facing(louvre, [[ia[0], ia[1], z0], A1, [ia[0], ia[1], z1]], mul(e, -1))
      facing(louvre, [[ic[0], ic[1], z0], C1, C0], e); facing(louvre, [[ic[0], ic[1], z0], [ic[0], ic[1], z1], C1], e)
    }
  }
  const bandH = lod.detail ? 4.2 : 3.6
  for (let k = 1; k < bands.length; k++) {
    const r = bands[k], z1 = r.z - 0.6, z0 = z1 - bandH
    // the band sits just under the line, on the faces below (inset by the fold's slope)
    const shrink = (zz: number) => r.p.map((p) => [p[0], p[1]] as XY)
    void shrink
    const inner = r.p, outer = grow(r.p, lod.detail ? 0.5 : 0.4)
    for (let i = 0; i < n; i++) {
      const a = outer[i], c = outer[(i + 1) % n], ia = inner[i], ic = inner[(i + 1) % n]
      if (!lod.detail) { vent(a, c, z0, z1, 0, ia, ic); continue }
      const L = Math.hypot(c[0] - a[0], c[1] - a[1]), cnt = Math.floor(L / 2.6)
      for (let j = 0; j < cnt; j++) {
        const t0 = (j + 0.15) / cnt, t1 = (j + 0.85) / cnt
        const P = (t: number, u: XY, v: XY): XY => [u[0] + (v[0] - u[0]) * t, u[1] + (v[1] - u[1]) * t]
        vent(P(t0, a, c), P(t1, a, c), z0, z1, 0, P(t0, ia, ic), P(t1, ia, ic))
      }
      // the dark strip behind the vents
      outward(louvre, [[ia[0], ia[1], z0], [ic[0], ic[1], z0], [ic[0], ic[1], z1]]); outward(louvre, [[ia[0], ia[1], z0], [ic[0], ic[1], z1], [ia[0], ia[1], z1]])
    }
  }

  // ---- The gold crown sign high on the west face, near its south end
  // (a plain lit panel: the lettering is not traced).
  {
    const a = tp[4], c = tp[0] // NW → SW: the west face
    const e = unit([c[0] - a[0], c[1] - a[1], 0]), out: V3 = [e[1], -e[0], 0]
    const L = Math.hypot(c[0] - a[0], c[1] - a[1])
    const s0 = L * 0.52, s1 = L * 0.9, z0 = ROOF - 6.5, z1 = ROOF - 2.0, d = 0.5
    const P = (s: number, z: number, o: number): V3 => [a[0] + e[0] * s + out[0] * o, a[1] + e[1] * s + out[1] * o, z]
    facing(sign, [P(s0, z0, d), P(s1, z0, d), P(s1, z1, d)], out); facing(sign, [P(s0, z0, d), P(s1, z1, d), P(s0, z1, d)], out)
    facing(sign, [P(s0, z1, 0), P(s0, z1, d), P(s1, z1, d)], [0, 0, 1]); facing(sign, [P(s0, z1, 0), P(s1, z1, d), P(s1, z1, 0)], [0, 0, 1])
    facing(sign, [P(s0, z0, 0), P(s1, z0, d), P(s0, z0, d)], [0, 0, -1]); facing(sign, [P(s0, z0, 0), P(s1, z0, 0), P(s1, z0, d)], [0, 0, -1])
    facing(sign, [P(s0, z0, 0), P(s0, z0, d), P(s0, z1, d)], mul(e, -1)); facing(sign, [P(s0, z0, 0), P(s0, z1, d), P(s0, z1, 0)], mul(e, -1))
    facing(sign, [P(s1, z0, 0), P(s1, z1, d), P(s1, z0, d)], e); facing(sign, [P(s1, z0, 0), P(s1, z1, 0), P(s1, z1, d)], e)
  }

  // ---- The spire: a faceted shaft rising from the roof behind the blade's
  // peak, by the NE-N chamfer (OSM's spire part), each ring turned half a
  // facet so the facets fold, swelling a third of the way up, to a fine tip.
  const ch: XY = [(tp[2][0] + tp[3][0]) / 2, (tp[2][1] + tp[3][1]) / 2]
  const toC = unit([rc[0] - ch[0], rc[1] - ch[1], 0])
  const sc: XY = [ch[0] + toC[0] * 7.5, ch[1] + toC[1] * 7.5]
  const z0 = ROOF - 2
  const prof: [number, number][] = [[z0, 6.0], [z0 + 15, 4.7], [z0 + 38, 3.7], [z0 + 58, 4.1], [z0 + 88, 3.3], [z0 + 112, 2.5], [z0 + 128, 1.6], [TIP - 6, 0.8], [TIP, 0.08]]
  const sprof: [number, number][] = []
  for (let i = 0; i < lod.spireRings; i++) {
    const u = (i / (lod.spireRings - 1)) * (prof.length - 1), j = Math.min(prof.length - 2, Math.floor(u)), f = u - j
    sprof.push([prof[j][0] + (prof[j + 1][0] - prof[j][0]) * f, prof[j][1] + (prof[j + 1][1] - prof[j][1]) * f])
  }
  const S = lod.spireSides
  const sring = (k: number): V3[] => {
    const [z, r] = sprof[k], rot = (k % 2) * Math.PI / S + Math.PI / 4
    return Array.from({ length: S }, (_, i) => {
      const a = rot + (2 * Math.PI * i) / S
      return [sc[0] + r * Math.cos(a), sc[1] + r * 0.8 * Math.sin(a), z] as V3
    })
  }
  for (let k = 0; k < sprof.length - 1; k++) {
    const A = sring(k), B = sring(k + 1)
    for (let i = 0; i < S; i++) {
      const j = (i + 1) % S
      const sp = (f: Tri) => {
        const nn = crs(subv(f[1], f[0]), subv(f[2], f[0])), c = mul(add(add(f[0], f[1]), f[2]), 1 / 3)
        if (dot(nn, [c[0] - sc[0], c[1] - sc[1], 0]) >= 0) spire.tri(f[0], f[1], f[2]); else spire.tri(f[0], f[2], f[1])
      }
      if (k % 2 === 0) { sp([A[i], A[j], B[i]]); sp([A[j], B[j], B[i]]) } else { sp([A[i], A[j], B[j]]); sp([A[i], B[j], B[i]]) }
    }
  }

  if (lod.detail) {
    // The spire's lights: beads up its edges.
    for (let k = 0; k < sprof.length - 1; k += 1) {
      const A = sring(k)
      for (let i = 0; i < S; i += 2) {
        const p = A[i], r = 0.35, d = unit([p[0] - sc[0], p[1] - sc[1], 0]), c: V3 = add(p, mul(d, 0.2))
        const ax: V3[] = [[r, 0, 0], [-r, 0, 0], [0, r, 0], [0, -r, 0], [0, 0, r], [0, 0, -r]]
        for (const [x, y] of [[0, 2], [2, 1], [1, 3], [3, 0]]) for (const zz of [4, 5]) {
          const f: Tri = [add(c, ax[x]), add(c, ax[y]), add(c, ax[zz])]
          facing(lamps, f, add(add(ax[x], ax[y]), ax[zz]))
        }
      }
    }
    // The glass edge-walk box cantilevered from the crown's SE corner.
    const se = tp[1]
    const dirOut = unit([se[0], se[1], 0])
    const c0: V3 = [se[0] + dirOut[0] * 1.2, se[1] + dirOut[1] * 1.2, top.z + 8]
    const u: V3 = dirOut, v: V3 = [-dirOut[1], dirOut[0], 0]
    const P = (a: number, b: number, z: number): V3 => [c0[0] + u[0] * a + v[0] * b, c0[1] + u[1] * a + v[1] * b, z]
    const L = 3, W = 3, z1 = c0[2] + 4
    const ring = [P(-2, -W, c0[2]), P(L, -W, c0[2]), P(L, W, c0[2]), P(-2, W, c0[2])]
    const ctr: V3 = P(0.5, 0, 0)
    for (let i = 0; i < 4; i++) {
      const a = ring[i], b = ring[(i + 1) % 4]
      const A1: V3 = [a[0], a[1], z1], B1: V3 = [b[0], b[1], z1]
      for (const f of [[a, b, B1], [a, B1, A1]] as Tri[]) {
        const m = mul(add(add(f[0], f[1]), f[2]), 1 / 3)
        facing(louvre, f, [m[0] - ctr[0], m[1] - ctr[1], 0])
      }
    }
    const t4 = ring.map((p) => [p[0], p[1], z1] as V3), b4 = ring
    facing(louvre, [t4[0], t4[1], t4[2]], [0, 0, 1]); facing(louvre, [t4[0], t4[2], t4[3]], [0, 0, 1])
    facing(louvre, [b4[0], b4[1], b4[2]], [0, 0, -1]); facing(louvre, [b4[0], b4[2], b4[3]], [0, 0, -1])
  }

  const parts: Array<{ part: Part; material: MaterialSpec }> = [
    { part: glass, material: { ...PALETTE.glass, color: 0x3d6698, roughness: 0.3 } },
    { part: glass2, material: { ...PALETTE.glass, name: 'glass-2', color: 0x7a9fcc, roughness: 0.3 } },
    { part: led, material: finish('neon-merdeka-led', 0xc3d0de, 0.5) },
    { part: louvre, material: finish('merdeka-louvre', 0x535d6b, 0.6) },
    { part: sign, material: finish('neon-merdeka-sign', 0xd6ae4a, 0.5) },
  ]
  if (lamps.triangles) parts.push({ part: lamps, material: finish('lamp-merdeka-spire', 0x3d6698, 0.4) })
  return parts
}

async function write(file: string, parts: Array<{ part: Part; material: MaterialSpec }>, maxTris: number, maxBytes: number) {
  const triangles = parts.reduce((t, { part }) => t + part.triangles, 0)
  const summary = parts.map((p) => `${p.material.name} ${p.part.triangles}`).join(', ')
  if (triangles > maxTris) throw new Error(`${file}: triangle budget exceeded: ${triangles} (${summary})`)
  const glb = writeGlb('Merdeka 118', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
    bearing: 0, elevation: 0, height: TIP,
  })
  if (glb.length > maxBytes) throw new Error(`${file}: size budget exceeded: ${glb.length} bytes`)
  const out = new URL(`../models/${file}`, import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles (${summary}), ${glb.length} bytes`)
}

if (import.meta.main) {
  await write('kl-merdeka-118.glb', build(LOW), 6500, 250_000)
  await write('kl-merdeka-118.detail.glb', build(DETAIL), 40_000, 1536 * 1024)
}
