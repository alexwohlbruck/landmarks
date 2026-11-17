/**
 * BNY Mellon Center (former Mellon Bank Center), 1735 Market Street,
 * Philadelphia (Kohn Pedersen Fox, 1990) — original procedural geometry,
 * CC0-1.0.
 * bun generators/phl-bny-mellon-center.ts
 * (uses the shared kit exported by generators/phl-comcast-center.ts)
 *
 * Map frame, turned to the building: +x east (toward 17th St), +y north
 * (toward JFK Boulevard), z up, metres. BEARING 9.0, the Center City grid.
 * Origin = area centroid of the OSM outline way/42785094 (-75.169520,
 * 39.953647), on the ground. Not to be confused with Three Logan Square
 * (1717 Arch St), a different tower.
 *
 * Form (Vinocur telephotos, Wobbanight series): a square tower clad in pale
 * grey granite and metal, every corner notched by a 7 m re-entrant slot that
 * runs from the top of the base to the cornice, glazed in horizontal bands.
 * Each face has a broad central field of blue glass in tall vertical strips,
 * flanked by granite with paired columns of windows. At the top the piers
 * curve outward into a flared cornice of corbels, over which a lower attic
 * with small windows carries a pyramid of white steel lattice and glass, lit
 * at night. The base is a darker granite block with punched windows, stepped,
 * with lower wings north (JFK) and south (Market) and a recessed entrance in
 * the middle of each.
 *
 * Evidence
 * - OSM way/42785094 (outline, BNY Mellon Center, wikidata Q2743527) and its
 *   parts way/332801483 (shaft), way/332801485 (attic, 220 m), way/332801484
 *   (pyramid, 240 m, roof height 16), way/336875905 (base, 35 m),
 *   way/336875903 and way/336875904 (north-south wings, 25 m), way/336855444
 *   and way/336855454 (entrance recesses, 23 m). All are replaced.
 * - USGS 3DEP lidar USGS_LPC_DE_DelawareValley_HD_2015_LAS_2017 (flown 2015),
 *   0.5 m grid in this frame, heights above the JFK Boulevard ground (the
 *   lowest under the footprint): pyramid apex 241.1 m (published 241 m /
 *   792 ft), pyramid faces at 221.5 m 12 m out from the centre, attic 219.7 m on +/-17 m,
 *   cornice top 210.7 m over the full 49.4 m cross plan, corner notches
 *   7 m square (shaft faces at +/-24.7 m, notch inner corners at +/-18 m)
 *   with floors at 39-43 m, base wings 27.1 m, entrance recesses 21.1 m.
 * - Mapterhorn terrain: about 1.3 m of fall from Market St to JFK Blvd;
 *   ordinary sloped site, elevation 0.
 * - Published: 792 ft (241 m), 54 storeys, completed 1990, KPF (Wikipedia,
 *   "BNY Mellon Center (Philadelphia)").
 *
 * Photos (Wikimedia Commons, EVIDENCE):
 * - "Mellon Bank Center (Philadelphia)-wide.JPG" and "-zoom.JPG", Jeffrey M.
 *   Vinocur, CC BY 2.5 (from the north-west; crown, cornice, faces, colours)
 *   https://commons.wikimedia.org/wiki/File:Mellon_Bank_Center_(Philadelphia)-zoom.JPG
 *   https://commons.wikimedia.org/wiki/File:Mellon_Bank_Center_(Philadelphia)-wide.JPG
 * - "BNY Mellon Bank Center a.jpg" and "h.jpg", Wobbanight, CC0 (a: the base
 *   granite and notch from below; h: a full face, looking up)
 *   https://commons.wikimedia.org/wiki/File:BNY_Mellon_Bank_Center_a.jpg
 *   https://commons.wikimedia.org/wiki/File:BNY_Mellon_Bank_Center_h.jpg
 *
 * Estimated: the face layout (central glass field 18 m wide in four bays,
 * flanks with two window columns each; from Wobbanight h and the Vinocur
 * zoom), panels grouped three storeys (about 11.7 m) with granite spandrels;
 * the flare (from 198 m, 2 m out at the cornice); the attic (+/-16 m) and
 * the pyramid's base (+/-14.5 m at 220.6 m, nearly the attic's width, as in
 * the Vinocur photos; consistent with the lidar slope); the attic's window
 * band; the base's punched windows (from Wobbanight a); the pyramid's
 * lattice drawn as a few pale ribs.
 *
 * Colours (daylight photos, pulled to the palette's lightness): the tower's
 * granite and metal a pale cool grey (#d9d8d4); the base a warmer mid-grey
 * granite (#b9b2a9), darker in every photo; the glass a clear blue (window
 * #6f8aa8); the pyramid a pale grey-white lattice (#d3d9de).
 *
 * Night: the office glass glows (window); the pyramid is lit at night
 * (window-3, glowing); the granite is unlit.
 *
 * Doubts: the attic's exact shape (its corner blocks are simplified into one
 * square stage); the corbel cornice is a smooth flare, not separate brackets.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { box, band, facePanel, loft, rect, saveTower, type P2 } from './phl-comcast-center'

const BEARING = 9.0
const ANCHOR = { lng: -75.16952, lat: 39.953647 }

const granite = new Part() // tower granite and metal
const base = new Part()    // the darker base granite
const glass = new Part()   // office glass (window)
const pyr = new Part()     // the lit pyramid (window-3)
const roof = new Part()
const rib = new Part()     // pale ribs on the pyramid

// ---------- heights (lidar) ----------
const APEX = 241.1, PYR = 220.6, ATTIC = 219.7, CORNICE = 210.7, FLARE = 198.0
const SHAFT0 = 40.0, WING = 27.1, ENTR = 21.1
// ---------- plan ----------
const A = 24.7 // face half-width
const K = 18.0 // notch inner corner
const AT = 16.0, PB = 14.5
const FL = 2.0 // flare projection

// ---------- base: full square to 40 m, wings north and south ----------
box(base, -A, A, -A, A, 0, SHAFT0, roof)
band(base, -A, A, -A, A, SHAFT0 - 0.5, 1.0, 0.25)
for (const s of [-1, 1]) {
  const y0 = s < 0 ? -36.2 : A - 0.3, y1 = s < 0 ? -A + 0.3 : 36.0
  box(base, -A, -9.5, y0, y1, 0, WING, roof)
  box(base, 9.4, A, y0, y1, 0, WING, roof)
  const yi0 = s < 0 ? -32.2 : A - 0.3, yi1 = s < 0 ? -A + 0.3 : 32.7
  box(base, -9.6, 9.5, yi0, yi1, 0, ENTR, roof)
  // entrance glazing on the recess front
  const yf = s < 0 ? yi0 : yi1
  const a: P2 = s < 0 ? [-9.6, yf] : [9.5, yf], b: P2 = s < 0 ? [9.5, yf] : [-9.6, yf]
  facePanel(glass, a, b, 0.12, 0.88, 1.0, 12.0, 0.05)
}

/** Punched windows on a base face: columns of panels, two storeys each. */
function punched(part: Part, a: P2, b: P2, z0: number, z1: number, cols: number, rowH = 7.5) {
  const l = Math.hypot(b[0] - a[0], b[1] - a[1]), w = l / cols
  for (let i = 0; i < cols; i++) {
    const s0 = (i * w + w * 0.22) / l, s1 = ((i + 1) * w - w * 0.22) / l
    for (let z = z0; z + rowH * 0.7 <= z1; z += rowH) facePanel(part, a, b, s0, s1, z, z + rowH * 0.62, 0.05)
  }
}
// The wings' outer faces (JFK and Market) and their ends.
for (const s of [-1, 1]) {
  const yo = s < 0 ? -36.2 : 36.0
  for (const [x0, x1] of [[-A, -9.5], [9.4, A]]) {
    const a: P2 = s < 0 ? [x0, yo] : [x1, yo], b: P2 = s < 0 ? [x1, yo] : [x0, yo]
    punched(glass, a, b, 4.5, WING - 2, 3)
  }
  const yi = s < 0 ? -A : A
  // wing end faces (east and west)
  punched(glass, [A, s < 0 ? yo : yi], [A, s < 0 ? yi : yo], 4.5, WING - 2, 2)
  punched(glass, [-A, s < 0 ? yi : yo], [-A, s < 0 ? yo : yi], 4.5, WING - 2, 2)
}
// Base block faces east and west, and the parts above the wings.
punched(glass, [A, -A], [A, A], 4.5, SHAFT0 - 3, 8)
punched(glass, [-A, A], [-A, -A], 4.5, SHAFT0 - 3, 8)
punched(glass, [-A, -A], [A, -A], WING + 2, SHAFT0 - 3, 8)
punched(glass, [A, A], [-A, A], WING + 2, SHAFT0 - 3, 8)

// ---------- the shaft: a cross of two bevelled boxes (notched corners) ----------
box(granite, -A, A, -K, K, SHAFT0, FLARE, null)
box(granite, -K, K, -A, A, SHAFT0, FLARE, null)
// the notches' inner faces are glazed bands
// the flared cornice: each arm lofts outward to the cornice
for (const [x0, x1, y0, y1] of [[-A, A, -K, K], [-K, K, -A, A]]) {
  const lo = rect(x0, x1, y0, y1, 0.5).p, hi = rect(x0 - FL, x1 + FL, y0 - FL, y1 + FL, 0.8).p
  loft(granite, lo, FLARE, hi, CORNICE - 1.2)
  box(granite, x0 - FL, x1 + FL, y0 - FL, y1 + FL, CORNICE - 1.2, CORNICE, roof, 0.5)
}

// ---------- facade: central glass field and window columns on each face ----------
const FLOOR = 3.9, GROUP = 3 * FLOOR
const faces: Array<[P2, P2]> = [
  [[-A, -A], [A, -A]], [[A, -A], [A, A]], [[A, A], [-A, A]], [[-A, A], [-A, -A]],
]
for (const [p, q] of faces) {
  // the face proper runs between the notches: K..K along a 2A edge
  const L = 2 * A, s = (d: number) => (A + d) / L // position d (from the face centre) → fraction
  for (let z = SHAFT0 + 1.5; z + GROUP <= FLARE - 2; z += GROUP) {
    // central field: four bays across 16 m, tall glass with thin piers
    for (let i = 0; i < 4; i++) {
      const d0 = -9 + i * 4.5 + 0.3, d1 = -9 + (i + 1) * 4.5 - 0.3
      facePanel(glass, p, q, s(d0), s(d1), z, z + GROUP - 0.8, 0.05)
    }
    // flanks: two window columns each side
    for (const d of [-15.2, -12.0, 12.0, 15.2]) facePanel(glass, p, q, s(d - 1.15), s(d + 1.15), z + 0.6, z + GROUP - 1.4, 0.05)
  }
  // the band under the cornice, between the corbels
  for (let i = 0; i < 9; i++) {
    const d0 = -K + 1 + i * 4, d1 = d0 + 2.6
    facePanel(glass, p, q, s(d0), s(d1), FLARE - 9, FLARE - 0.3, 0.05)
  }
}
// notch faces: each notch has two inner faces, 6.7 m wide, glazed in bands
for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
  // The notch's face at x = sx*K looks toward +sx; its face at y = sy*K toward +sy.
  // facePanel's outward normal is (dy, -dx): order the ends to match.
  const yLo = Math.min(sy * K, sy * A), yHi = Math.max(sy * K, sy * A)
  const xLo = Math.min(sx * K, sx * A), xHi = Math.max(sx * K, sx * A)
  const fx: [P2, P2] = sx > 0 ? [[sx * K, yLo], [sx * K, yHi]] : [[sx * K, yHi], [sx * K, yLo]]
  const fy: [P2, P2] = sy > 0 ? [[xHi, sy * K], [xLo, sy * K]] : [[xLo, sy * K], [xHi, sy * K]]
  for (const [pa, pb] of [fx, fy])
    for (let z = SHAFT0 + 1.5; z + GROUP <= FLARE - 2; z += GROUP) facePanel(glass, pa, pb, 0.12, 0.88, z, z + GROUP - 1.2, 0.05)
}

// ---------- attic and pyramid ----------
box(granite, -AT, AT, -AT, AT, CORNICE, ATTIC, roof)
for (const [p, q] of [[[-AT, -AT], [AT, -AT]], [[AT, -AT], [AT, AT]], [[AT, AT], [-AT, AT]], [[-AT, AT], [-AT, -AT]]] as [P2, P2][]) {
  for (let i = 0; i < 6; i++) {
    const s0 = 0.16 + i * 0.115, s1 = s0 + 0.07
    facePanel(glass, p, q, s0, s1, CORNICE + 2.2, ATTIC - 2.0, 0.05)
  }
}
box(granite, -PB - 0.6, PB + 0.6, -PB - 0.6, PB + 0.6, ATTIC, PYR, roof, 0.3)
{
  const b = [[-PB, -PB], [PB, -PB], [PB, PB], [-PB, PB]] as P2[]
  const apex: V3 = [0, 0, APEX]
  for (let i = 0; i < 4; i++) {
    const p = b[i], q = b[(i + 1) % 4]
    pyr.tri([p[0], p[1], PYR], [q[0], q[1], PYR], apex)
  }
  // pale steel ribs: the hips and two horizontal rings, a little proud
  const hip = (p: P2, w = 0.5) => {
    const d = Math.hypot(p[0], p[1]), ux = -p[1] / d * w, uy = p[0] / d * w, o = 0.15
    const nx = p[0] / d, ny = p[1] / d
    const a: V3 = [p[0] - ux + nx * o, p[1] - uy + ny * o, PYR], b2: V3 = [p[0] + ux + nx * o, p[1] + uy + ny * o, PYR]
    const top: V3 = [0, 0, APEX + 0.3]
    rib.tri(a, b2, top)
  }
  for (const p of b) hip(p)
  for (const t of [0.3, 0.6]) {
    const h = PB * (1 - t), z = PYR + (APEX - PYR) * t
    for (let i = 0; i < 4; i++) {
      const p = b[i], q = b[(i + 1) % 4]
      const P = (r: P2, k: number): V3 => [r[0] * (1 - t) * k, r[1] * (1 - t) * k, z]
      const k0 = 1.0, k1 = 1.0
      const lo1 = P(p, k0), lo2 = P(q, k0)
      const hi1: V3 = [p[0] * (1 - t - 0.03), p[1] * (1 - t - 0.03), z + (APEX - PYR) * 0.03]
      const hi2: V3 = [q[0] * (1 - t - 0.03), q[1] * (1 - t - 0.03), z + (APEX - PYR) * 0.03]
      // lift a hair off the face along its normal
      const e: V3 = [q[0] - p[0], q[1] - p[1], 0], n0 = [e[1], -e[0], 0]
      const nl = Math.hypot(n0[0], n0[1]), off = 0.12
      const sh = (v: V3): V3 => [v[0] + (n0[0] / nl) * off, v[1] + (n0[1] / nl) * off, v[2] + off * 0.6]
      rib.quad(sh(lo1), sh(lo2), sh(hi2), sh(hi1))
      void h; void k1
    }
  }
}

await saveTower('phl-bny-mellon-center', 'BNY Mellon Center', [
  { part: granite, material: finish('bny-granite', 0xd9d8d4) },
  { part: base, material: finish('bny-base-granite', 0xb9b2a9) },
  { part: glass, material: { name: 'window', color: 0x6f8aa8, roughness: 0.35 } },
  { part: pyr, material: windowVariant(3, 0xc9d1d8) },
  { part: roof, material: PALETTE.roof },
  { part: rib, material: finish('bny-steel', 0xeef0f1) },
], {
  bearing: BEARING, anchor: ANCHOR, height: APEX,
  replaces: ['way/42785094', 'way/332801483', 'way/332801484', 'way/332801485', 'way/336875905', 'way/336875903', 'way/336875904', 'way/336855444', 'way/336855454'],
})
