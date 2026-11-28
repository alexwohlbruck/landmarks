/**
 * Djamaa el Djazaïr, the Great Mosque of Algiers (KSP Jürgen Engel
 * Architekten with Krebs und Kiefer, 2012-2019, opened 2024), Mohammadia,
 * on the Bay of Algiers: original procedural geometry, CC0-1.0, no
 * textures.
 *   bun generators/algiers-djamaa-el-djazair.ts
 * Writes models/algiers-djamaa-el-djazair.glb (low) and
 * models/algiers-djamaa-el-djazair.detail.glb (detail: the minaret's
 * lattice panels in relief, the dome's lattice ribs, more arcade
 * segments).
 *
 * Map frame: x east, y north, z up, metres. Anchor = the lead's point
 * (lng 3.14033, lat 36.73475), in the courtyard. Bearing 16.2: the
 * complex's axis (minaret, forecourt building, courtyard, prayer hall)
 * runs at 106.2 deg, so it lies along model x, the prayer hall at +x.
 *
 * Identity, in order: the 265 m square minaret, the world's tallest, pale
 * with a lattice panel up the middle of each face and a glazed lantern at
 * the top; the prayer hall's broad white block, its roof rising in sloped
 * planes to the 50 m dome with its gold lattice; the courtyard ringed by
 * tall white arcades; the forecourt building round the minaret.
 *
 * Evidence
 *  - Plan: OSM way/459813182 (the minaret, building, height 265, 37
 *    levels: 27.3 x 27.5 m, at x -246.7..-219.2, y 39.6..67.2 here);
 *    relation/17805398 (building=mosque): way/363760170 the prayer hall
 *    (149 x 152 m), way/1299117081 the courtyard ring (148 x 150 m) less
 *    way/1254691658 (the open courtyard, 96 x 96 m), way/1254691656 the
 *    U-shaped forecourt building; way/1254691661 (building:part, the
 *    raised centre of the hall, 106 x 109 m) and way/1463523069
 *    (building:part=dome, radius 28 m in OSM; published 50 m across).
 *  - Heights: published (Wikipedia): minaret 265 m and 37 floors; dome
 *    50 m across and 70 m high. ESTIMATED from d4, d6, d7, d8, d9: the
 *    hall's walls 22 m, its raised centre rising in sloped planes to the
 *    dome's springing at 40 m; the courtyard arcades 16 m with arches to
 *    12.5 m; the forecourt building 18 m; the minaret's glazed lantern from
 *    226 m, its crown at 257 m, the finial to 265 m (d3, d5, d7).
 *  - Photos (Wikimedia Commons, all EVIDENCE):
 *    d1 Abdellah zou, "Djamaa El Djazaïr 2.jpg", CC BY-SA 4.0 (the minaret's face from below)
 *      https://commons.wikimedia.org/wiki/File:Djamaa_El_Djazaïr_2.jpg
 *    d3 Abdellah zou, "Djamae El Djazayer- جامع الجزائر.jpg", CC BY-SA 4.0 (night)
 *      https://commons.wikimedia.org/wiki/File:Djamae_El_Djazayer-_جامع_الجزائر.jpg
 *    d4 Idir Amokrane, "Djamaa el Djazaïr جامع الجزائر.jpg", CC BY-SA 4.0 (from across the bay)
 *      https://commons.wikimedia.org/wiki/File:Djamaa_el_Djazaïr_جامع_الجزائر.jpg
 *    d5 Riad Salih, "La cour et le minaret de Djamaâ El Djazaïr.jpg", CC BY 4.0 (minaret over the courtyard)
 *      https://commons.wikimedia.org/wiki/File:La_cour_et_le_minaret_de_Djamaâ_El_Djazaïr.jpg
 *    d6 Abdellah zou, "Mosque of Algiers dome 2.jpg", CC BY-SA 4.0 (dome, roof planes, hall arcade)
 *      https://commons.wikimedia.org/wiki/File:Mosque_of_Algiers_dome_2.jpg
 *    d7 Rachid Hamatou, "Djamaâ El Djazaïr – The Great Mosque of Algiers 5.jpg", CC BY-SA 4.0 (courtyard arcades, minaret)
 *      https://commons.wikimedia.org/wiki/File:Djamaâ_El_Djazaïr_–_The_Great_Mosque_of_Algiers_5.jpg
 *    d8 Rachid Hamatou, "Djamaa el Djazaïr 1.jpg", CC BY-SA 4.0 (the whole complex from the south)
 *      https://commons.wikimedia.org/wiki/File:Djamaa_el_Djazaïr_1.jpg
 *    d9 Rachid Hamatou, "Djamaa el Djazaïr night.jpg", CC BY-SA 4.0 (dusk, hall and dome against the minaret)
 *      https://commons.wikimedia.org/wiki/File:Djamaa_el_Djazaïr_night.jpg
 *    d10 Riad Salih, "Djamaâ El-Djazaïr - 20240405 201122293.jpg", CC BY 4.0 (courtyard at night)
 *      https://commons.wikimedia.org/wiki/File:Djamaâ_El-Djazaïr_-_20240405_201122293.jpg
 *  - Colours: white stone and render #ece7dd (d6, d7), drawn #eee9df;
 *    the lattice of the minaret panels and the dome gold-beige #cdae7c
 *    (d1, d6), drawn #d2b88a; the lantern's glass dark blue-grey (d5).
 *    Night: the minaret's edges and lantern lit (d3), the courtyard
 *    arcades lit (d10): floodlit white, lit lantern windows.
 *  No look-only sources. No commercial imagery. No lidar exists here.
 *
 * Invented or simplified: the hall's outer arcade and the forecourt
 * building's facades are plain grouped panels; the courtyard arches are
 * drawn on its four inner faces only; the canopies in the forecourt are
 * left out. Doubts: every height but the minaret's and the dome's is
 * estimated from photos.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { walls, cap, type XY } from './chi-aon-center'
import { face } from './phl-independence-hall'
import { polyTris, pointedArch, beam } from './berlin-oberbaum-bridge'
import { box, cyl, writeModel, type Slot } from './pretoria-union-buildings'
import { lathe } from './chi-aon-center'

const ID = 'algiers-djamaa-el-djazair'
const NAME = 'Djamaa el Djazaïr'
const ANCHOR: [number, number] = [3.14033, 36.73475]
const BEARING = 16.2

const MINARET: XY[] = [[-246.1, 39.6], [-219.2, 40.2], [-219.6, 67.2], [-246.7, 66.6]]
const HALL: XY[] = [[60.6, -51.8], [210.5, -51.8], [210.1, 58.4], [210.1, 76.3], [209.9, 100.3], [189.1, 100.1], [84.6, 99.3], [61.4, 99.2], [61.6, 49.9], [61.5, 15.1]]
const HALL_CORE: XY[] = [[83.9, -31.2], [190.1, -31.2], [187.9, 78.5], [83.4, 77.7]]
const DOME: XY = [135.9, 25.6]
const RING: XY[] = [[-91.8, -51.5], [55.9, -51.7], [56.3, 99.5], [-93.0, 98.0]]
const COURT: XY[] = [[-67.2, -24.6], [29.0, -24.8], [28.2, 71.5], [-66.3, 72.0]]
const FORE: XY[] = [[-247.6, 97.8], [-247.5, 95.6], [-246.9, 75.9], [-124.1, 78.1], [-123.2, -20.1], [-221.4, -20.6], [-220.5, -51.3], [-97.1, -51.1], [-98.5, 105.3], [-247.6, 103.0]]

const HALL_Z = 22, CORE_Z = 34, DOME_Z = 41, RING_Z = 16, FORE_Z = 18

function build(detail: boolean): Slot[] {
  const white = new Part(), gold = new Part(), roof = new Part(), win = new Part(), shade = new Part(), glass = new Part()

  // --- the prayer hall: walls, roof, the raised centre in sloped planes, the dome
  wallsAbove(white, HALL, HALL_Z, 20)
  parapet(white, roof, HALL, HALL_Z)
  // panels of glazing in tall bays round the hall (d6, d9)
  for (let i = 0; i < HALL.length; i++) { const a = HALL[i], b = HALL[(i + 1) % HALL.length]; if (Math.hypot(b[0] - a[0], b[1] - a[1]) > 20) arcade(white, shade, a, b, 14, detail, 3) }
  // the raised centre: sloped planes from the hall roof up to a square under the dome
  {
    const lo = HALL_CORE, c = DOME, k = 0.5
    const hi = lo.map(([x, y]) => [c[0] + (x - c[0]) * k, c[1] + (y - c[1]) * k] as XY)
    for (let i = 0; i < 4; i++) {
      const j = (i + 1) % 4
      // the raised centre's walls, straight up from the hall roof (d8, d9)
      { const L = Math.hypot(lo[j][0] - lo[i][0], lo[j][1] - lo[i][1]), nn: V3 = [(lo[j][1] - lo[i][1]) / L, -(lo[j][0] - lo[i][0]) / L, 0]; face(white, [[...lo[i], HALL_Z - 0.8], [...lo[j], HALL_Z - 0.8], [...lo[j], CORE_Z], [...lo[i], CORE_Z]] as V3[], nn) }
      face(roof, [[...lo[i], CORE_Z], [...lo[j], CORE_Z], [...hi[j], DOME_Z - 1], [...hi[i], DOME_Z - 1]] as V3[], [0, 0, 1])
    }
    cap(roof, hi, DOME_Z - 1)
    // the folded ribs that run up the planes (d6): a few bold ridges
    for (let i = 0; i < 4; i++) {
      const j = (i + 1) % 4
      for (const t of [0.25, 0.5, 0.75]) {
        const a: V3 = [lo[i][0] + (lo[j][0] - lo[i][0]) * t, lo[i][1] + (lo[j][1] - lo[i][1]) * t, CORE_Z + 0.2]
        const b: V3 = [hi[i][0] + (hi[j][0] - hi[i][0]) * t, hi[i][1] + (hi[j][1] - hi[i][1]) * t, DOME_Z - 0.8]
        beam(white, a, b, 1.6, [0, 0, 1], true, 1.0)
      }
    }
  }
  // the dome: a drum, then a slightly pointed shell to 70 m, a lantern and finial
  {
    const R = 25, seg = detail ? 32 : 20
    cyl(white, DOME[0], DOME[1], R + 0.8, DOME_Z - 1, DOME_Z + 1.2, seg, true)
    const prof: XY[] = []
    const n = detail ? 12 : 7
    for (let i = 0; i <= n; i++) {
      // a two-centred profile: radius R at the springing, apex at 70 m
      const t = i / n, a = (t * Math.PI) / 2
      const r = R * Math.cos(a), z = DOME_Z + 1.2 + (70 - DOME_Z - 1.2) * Math.pow(Math.sin(a), 0.85)
      prof.push([Math.max(r, 0), z])
    }
    prof[prof.length - 1] = [0, 70]
    lathe(gold, DOME[0], DOME[1], prof.slice(0, -1).concat([[1.6, 69.6], [0, 70]]), seg)
    // the dome's white lattice: meridian ribs and rings standing 0.4 m proud
    const ribs = detail ? 16 : 8
    for (let k = 0; k < ribs; k++) {
      const ang = (k / ribs) * 2 * Math.PI
      for (let i = 0; i < prof.length - 2; i++) {
        const [r0, z0] = prof[i], [r1, z1] = prof[i + 1]
        const A: V3 = [DOME[0] + (r0 + 0.25) * Math.cos(ang), DOME[1] + (r0 + 0.25) * Math.sin(ang), z0]
        const B: V3 = [DOME[0] + (r1 + 0.25) * Math.cos(ang), DOME[1] + (r1 + 0.25) * Math.sin(ang), z1]
        beam(white, A, B, detail ? 0.9 : 1.2, [Math.cos(ang), Math.sin(ang), 0], false, 0.6)
      }
    }
    for (const fi of detail ? [2, 4, 6, 8] : [2, 4]) {
      const [r, z] = prof[Math.min(fi, prof.length - 2)]
      cyl(white, DOME[0], DOME[1], r + 0.3, z - 0.45, z + 0.45, seg, false)
    }
    cyl(white, DOME[0], DOME[1], 1.8, 69.4, 71.5, 8, true)
    cyl(gold, DOME[0], DOME[1], 0.5, 71.5, 77, 6, true, false, 0.12)
  }

  // --- the courtyard ring with its arcades facing the court
  wallsAbove(white, RING, RING_Z, 0)
  for (const [a, b, c] of polyTris(RING, [COURT])) face(roof, [[...a, RING_Z], [...b, RING_Z], [...c, RING_Z]] as V3[], [0, 0, 1])
  {
    const court = [...COURT].reverse()
    for (let i = 0; i < 4; i++) arcade(white, shade, court[i], court[(i + 1) % 4], RING_Z, detail)
  }
  for (let i = 0; i < 4; i++) arcade(white, shade, RING[i], RING[(i + 1) % 4], 14, detail, 3)

  // --- the forecourt building, round the minaret's foot
  wallsAbove(white, FORE, FORE_Z, 20)
  parapet(white, roof, FORE, FORE_Z)
  for (let i = 0; i < FORE.length; i++) { const a = FORE[i], b = FORE[(i + 1) % FORE.length]; if (Math.hypot(b[0] - a[0], b[1] - a[1]) > 20) arcade(white, shade, a, b, 14, detail, 3) }
  // windows in the upper storey of the forecourt building, in broad groups
  bandsOn(win, FORE, 14.6, 16.8, 14, 9)

  // --- the minaret
  minaret(white, gold, win, glass, detail)

  const flood = (_p: V3, n: V3) => (n[2] > 0.7 ? 0.2 : 0.8)
  return [
    { part: white, material: { ...finish('djazair-white', 0xeee9df), floodlight: flood } },
    { part: gold, material: { ...finish('djazair-gold', 0xd2b88a), floodlight: flood } },
    { part: roof, material: finish('djazair-roof', 0xd9d4ca) },
    { part: win, material: PALETTE.window },
    { part: shade, material: finish('djazair-shade', 0xa9a397) },
    { part: glass, material: { name: 'window-2', color: 0x587487, roughness: 0.3 } },
  ]
}

/** Walls of a ring to z; edges longer than `arc` (all, if 0) carry an arcade below 14 m, so their wall starts there. */
function wallsAbove(p: Part, ring: XY[], z: number, arc: number) {
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const z0 = arc === 0 || L > arc ? 14 : 0
    p.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z], [a[0], a[1], z])
  }
}

/** A plain parapet round a counter-clockwise ring: coping in `w`, roof sunk 0.8 m in `r`. */
function parapet(w: Part, r: Part, ring: XY[], z: number) {
  cap(r, ring, z - 0.8)
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length], L = Math.hypot(b[0] - a[0], b[1] - a[1]); if (L < 0.5) continue
    const n: XY = [(b[1] - a[1]) / L, -(b[0] - a[0]) / L]
    const I = (q: XY, h: number): V3 => [q[0] - n[0] * 0.6, q[1] - n[1] * 0.6, h]
    face(w, [[...a, z] as V3, I(a, z), I(b, z), [...b, z] as V3], [0, 0, 1])
    face(w, [I(b, z - 0.8), I(a, z - 0.8), I(a, z), I(b, z)], [-n[0], -n[1], 0])
  }
}

/** Tall grouped window panels on every wall of a ring long enough: bays `bay` wide, `w` of glass each. */
function bandsOn(p: Part, ring: XY[], z0: number, z1: number, bay: number, w: number) {
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < bay * 2) continue
    const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
    const k = Math.floor(L / bay), s0 = (L - k * bay) / 2
    for (let q = 0; q < k; q++) {
      const c = s0 + (q + 0.5) * bay
      const P = (s: number, z: number): V3 => [a[0] + u[0] * s + n[0] * 0.05, a[1] + u[1] * s + n[1] * 0.05, z]
      face(p, [P(c - w / 2, z0), P(c + w / 2, z0), P(c + w / 2, z1), P(c - w / 2, z1)], [n[0], n[1], 0])
    }
  }
}

/** The courtyard's arcade on wall a→b (normal pointing into the court): pointed arches on slender piers, a shaded gallery behind. */
function arcade(w: Part, sh: Part, a: XY, b: XY, zTop: number, detail: boolean, back = 5) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
  const O = (s: number, z: number, d = 0.08): V3 => [a[0] + u[0] * s + n[0] * d, a[1] + u[1] * s + n[1] * d, z]
  const bay = 7.4, k = Math.floor((L - 4) / bay), s0 = (L - k * bay) / 2
  const hw = 2.9, zs = 9.0, SEG = detail ? 6 : 3
  // the shaded gallery wall behind, 5 m back
  face(sh, [O(0, 0, -back), O(L, 0, -back), O(L, 12.6, -back), O(0, 12.6, -back)], [n[0], n[1], 0])
  face(sh, [O(0, 12.6, -back), O(L, 12.6, -back), O(L, 12.6, 0), O(0, 12.6, 0)], [0, 0, -1])
  // the arcade face: one plate per bay with its pointed opening
  const plate = (s0: number, s1: number, ring: XY[]) => {
    for (const [p, q, c] of polyTris(ring)) face(w, [O(...p), O(...q), O(...c)], [n[0], n[1], 0])
  }
  // end pieces
  plate(0, s0, [[0, 0], [s0, 0], [s0, zTop], [0, zTop]])
  plate(L - s0, L, [[L - s0, 0], [L, 0], [L, zTop], [L - s0, zTop]])
  for (let q = 0; q < k; q++) {
    const c = s0 + (q + 0.5) * bay, b0 = c - bay / 2, b1 = c + bay / 2
    const arch = pointedArch(c - hw, c + hw, 0, zs, SEG, 0.62)
    const head = arch.slice(3, -1).reverse()
    const ring: XY[] = [[b0, 0], [c - hw, 0], [c - hw, zs], ...head, [c + hw, zs], [c + hw, 0], [b1, 0], [b1, zTop], [b0, zTop]]
    plate(b0, b1, ring)
    if (detail) {
      // the arch's soffit, back into the gallery
      const pts: XY[] = [[c - hw, zs], ...head, [c + hw, zs]]
      for (let e = 0; e < pts.length - 1; e++) {
        const p = pts[e], r = pts[e + 1]
        face(w, [O(...p), O(...r), O(r[0], r[1], -0.9), O(p[0], p[1], -0.9)], [0, 0, -1])
      }
    }
  }
}

/** The minaret: shaft with a lattice panel up each face, the glazed lantern, crown and finial. */
function minaret(w: Part, g: Part, win: Part, gl: Part, detail: boolean) {
  const cx = MINARET.reduce((s, p) => s + p[0], 0) / 4, cy = MINARET.reduce((s, p) => s + p[1], 0) / 4
  const H = 13.6, SHAFT = 226, LANT = 254, CROWN = 257.5
  box(w, cx - H, cy - H, cx + H, cy + H, 0, SHAFT, false)
  // each face: the central lattice panel (gold) between two glazed slits, in relief; plain corner piers
  for (let f = 0; f < 4; f++) {
    const ang = (f * Math.PI) / 2, n: XY = [Math.cos(ang), Math.sin(ang)], u: XY = [-n[1], n[0]]
    const P = (s: number, z: number, d: number): V3 => [cx + n[0] * (H + d) + u[0] * s, cy + n[1] * (H + d) + u[1] * s, z]
    const nn: V3 = [n[0], n[1], 0]
    // the panel, recessed in a frame: gold, 9 m wide, from 18 m to the lantern
    face(g, [P(-4.5, 18, 0.06), P(4.5, 18, 0.06), P(4.5, SHAFT - 4, 0.06), P(-4.5, SHAFT - 4, 0.06)], nn)
    // the glazed slits either side
    for (const s of [-6.2, 6.2]) face(win, [P(s - 0.7, 22, 0.06), P(s + 0.7, 22, 0.06), P(s + 0.7, SHAFT - 8, 0.06), P(s - 0.7, SHAFT - 8, 0.06)], nn)
    // the lattice in relief over the panel: a bold diamond net (detail), or its frame (low)
    if (detail) {
      const step = 9
      for (let z = 18; z < SHAFT - 4 - step + 0.01; z += step) {
        beam(w, P(-4.5, z, 0.35), P(4.5, z + step, 0.35), 0.55, nn, false, 0.5)
        beam(w, P(4.5, z, 0.35), P(-4.5, z + step, 0.35), 0.55, nn, false, 0.5)
      }
    }
    for (const s of [-4.8, 4.8]) beam(w, P(s, 18, 0.3), P(s, SHAFT - 4, 0.3), 0.7, nn, true, 0.6)
    beam(w, P(-4.8, 18, 0.3), P(4.8, 18, 0.3), 0.7, nn, true, 0.6)
  }
  // a cornice band, the glazed lantern, its cap, the crown and the finial
  box(w, cx - H - 0.5, cy - H - 0.5, cx + H + 0.5, cy + H + 0.5, SHAFT, SHAFT + 1.5)
  box(gl, cx - H + 0.6, cy - H + 0.6, cx + H - 0.6, cy + H - 0.6, SHAFT + 1.5, LANT, false)
  for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) box(w, cx + sx * (H - 0.6) - 1, cy + sy * (H - 0.6) - 1, cx + sx * (H - 0.6) + 1, cy + sy * (H - 0.6) + 1, SHAFT + 1.5, LANT, false)
  box(w, cx - H - 0.4, cy - H - 0.4, cx + H + 0.4, cy + H + 0.4, LANT, CROWN)
  box(w, cx - 6, cy - 6, cx + 6, cy + 6, CROWN, CROWN + 2.5)
  cyl(g, cx, cy, 3.2, CROWN + 2.5, CROWN + 5.5, 12, true, false, 1.0)
  cyl(g, cx, cy, 0.5, CROWN + 5.5, 265, 6, true, false, 0.1)
}

if (import.meta.main) {
  const extras = { anchor: ANCHOR, bearing: BEARING }
  await writeModel(`${ID}.glb`, NAME, build(false), extras, 6500, 250_000)
  await writeModel(`${ID}.detail.glb`, NAME, build(true), extras, 40_000, 1_536_000)
}
