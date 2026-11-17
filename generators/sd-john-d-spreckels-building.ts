/**
 * John D. Spreckels Building, San Diego — 625 Broadway, at the south-east
 * corner of Broadway and 6th Avenue (1927, Parkinson & Parkinson; Gladding,
 * McBean terra cotta; ≈ 61 m, 13 storeys). Not the Spreckels Theatre
 * Building at 121–123 Broadway, which is a different building.
 *
 * Identity: a pale grey-white terra-cotta block on a U plan, its light
 * court open to the south; a two-storey arcade of round arches along
 * Broadway and 6th Avenue; plain punched-window shaft; a deep band of small
 * arcaded corbels under a projecting cornice capped in red tile, and red
 * tile hipped roofs over the arms; a lower rear block in the court with a
 * plain penthouse rising behind it.
 *
 * Frame: bearing 0. Map frame x east, y north, z up, metres; origin at the
 * anchor (−117.1588086, 32.7154908), the centroid of OSM way/350398726;
 * z = 0 the lowest street under the footprint (its south-west, 0.5 m above
 * the lidar box's ground_min; the street rises ≈ 1.5 m to the north-east).
 *
 * Sources
 * - OSM way/350398726 (building=office, "John D. Spreckels Building", 13
 *   levels, hipped, wikidata Q12060884): the U plan, 59.4 m along Broadway,
 *   29.6 m deep. way/31845938 (building=office, untagged name): the block
 *   filling the bottom of the court, 15.5 × 11 m; it carries the same
 *   frieze in Another Believer's photo, so it is drawn here as the
 *   building's rear block. © OSM contributors.
 * - USGS 3DEP lidar CA_SanDiegoQL2_2014 (flown 2014), 0.5 m grid: parapet
 *   59.9 m, roof ridges ≈ 63 m, rear block ≈ 45.5 m, the penthouse over the
 *   court face ≈ 67 m (a mast to 75 m is left out). Published 61 m
 *   (Wikipedia, from Emporis) agrees.
 * - USGS NAIP orthophoto: red tile hipped roofs over the U's three arms.
 * Photos (evidence):
 * - "San Diego, 2016 - 165.jpg", Another Believer, CC BY-SA 4.0,
 *   https://commons.wikimedia.org/wiki/File:San_Diego,_2016_-_165.jpg
 *   (from the south-west on 6th Avenue: colour, the U's arms, the corbel
 *   frieze, the cornice, the rear block and penthouse, the arcade).
 * - "Broadway & 6th Avenue.JPG" and "Sixth Avenue & Broadway.JPG", Vrysxy,
 *   CC BY-SA 3.0,
 *   https://commons.wikimedia.org/wiki/File:Broadway_%26_6th_Avenue.JPG
 *   https://commons.wikimedia.org/wiki/File:Sixth_Avenue_%26_Broadway.JPG
 *   (the Broadway and 6th Avenue fronts: the arcade, window rhythm, belt
 *   courses; at dusk).
 * - "Core-Columbia, San Diego, CA, USA - panoramio (23).jpg", Roman
 *   Eugeniusz, CC BY-SA 3.0 (the base's stonework and arch at the corner).
 * - "View of downtown San Diego (Broadway looking west), in 1961.jpg", U.S.
 *   Navy, public domain (massing in its street).
 *
 * Numbers
 * - Plan: OSM, measured. Heights: lidar, measured (above).
 * - Arcade 0–9.5 m, arch pitch ≈ 5 m (about 12 along Broadway, 6 along
 *   6th) — counted on Vrysxy's photos (estimated). Shaft 9.5–51.5 m,
 *   windows one panel per ≈ 2.9 m bay over two storeys; corbel
 *   frieze 51.5–58.3 m; cornice 58.3–59.9 m projecting ≈ 1 m — estimated
 *   from Another Believer's photo against the lidar height.
 * - Colours from the sunny photo: pale grey-white terra cotta, red tile.
 *
 * Doubts
 * - Few photos; the court (south) faces and the east face are drawn plain
 *   from the one view that shows them in part.
 * - The low fill inside the court (≈ 14 m in the lidar) is not in OSM and
 *   is not drawn.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { qf, tf, cbox, rect, hip, save, type Rect } from './dc-white-house'

const tc = new Part(), win = new Part(), tile = new Part(), shade = new Part()

const N = 12.2, S = -17.5 // Broadway front, south ends of the arms
const W0 = -29.6, W1 = -15.9, E0 = 16.8, E1 = 30.0 // the arms
const CY = -2.4 // the court's north wall
const ARC = 9.5, SHAFT = 51.5, FRIEZE = 58.3, PAR = 59.9, RIDGE = 62.4
const REAR: Rect = rect(-7.7, 7.8, -17.4, -6.4), REAR_Z = 45.5
const PENT: Rect = rect(-7.7, 7.8, -6.4, -1.0), PENT_Z = 67.0

type Wall = { a: [number, number]; b: [number, number]; arcade: boolean }
// The outer walls, counter-clockwise from above (outward normal on the right).
const WALLS: Wall[] = [
  { a: [W0, S], b: [W1, S], arcade: false },
  { a: [W1, S], b: [W1, CY], arcade: false },
  { a: [W1, CY], b: [E0, CY], arcade: false },
  { a: [E0, CY], b: [E0, S], arcade: false },
  { a: [E0, S], b: [E1, S], arcade: false },
  { a: [E1, S], b: [E1, N], arcade: false },
  { a: [E1, N], b: [W0, N], arcade: true }, // Broadway
  { a: [W0, N], b: [W0, S], arcade: true }, // 6th Avenue
]

function wallFrame(w: Wall) {
  const L = Math.hypot(w.b[0] - w.a[0], w.b[1] - w.a[1])
  const t = [(w.b[0] - w.a[0]) / L, (w.b[1] - w.a[1]) / L], n: V3 = [t[1], -t[0], 0]
  const P = (s: number, z: number, d = 0): V3 => [w.a[0] + t[0] * s + n[0] * d, w.a[1] + t[1] * s + n[1] * d, z]
  return { L, n, P }
}

// Body: walls, the cornice with its tile cap, then the hipped roofs.
for (const w of WALLS) {
  const { L, n, P } = wallFrame(w)
  qf(tc, P(0, 0), P(L, 0), P(L, SHAFT), P(0, SHAFT), n)
  qf(tc, P(0, SHAFT), P(L, SHAFT), P(L, FRIEZE), P(0, FRIEZE), n)
  // Belt course over the arcade, slightly proud.
  const o = 0.35
  qf(tc, P(-o, ARC, o), P(L + o, ARC, o), P(L + o, ARC + 0.9, o), P(-o, ARC + 0.9, o), n)
  qf(tc, P(-o, ARC + 0.9, o), P(L + o, ARC + 0.9, o), P(L, ARC + 0.9, 0), P(0, ARC + 0.9, 0), [0, 0, 1])
  qf(tc, P(-o, ARC, o), P(L + o, ARC, o), P(L, ARC, 0), P(0, ARC, 0), [0, 0, -1])
  // Cornice: a projecting band from the frieze's top to the parapet, its
  // underside, and the red tile pent sloping back onto the roof.
  const c = 1.0
  qf(tc, P(-c, FRIEZE, 0), P(L + c, FRIEZE, 0), P(L + c, FRIEZE, c), P(-c, FRIEZE, c), [0, 0, -1])
  qf(tc, P(-c, FRIEZE, c), P(L + c, FRIEZE, c), P(L + c, PAR, c), P(-c, PAR, c), n)
  qf(tile, P(-c, PAR, c), P(L + c, PAR, c), P(L + c - 1.6, PAR + 0.9, -1.6 + c), P(-c + 1.6, PAR + 0.9, -1.6 + c), [n[0] * 0.5, n[1] * 0.5, 1])
  // Corbel frieze: a row of small round-headed recesses.
  const fp = 2.6, k = Math.max(1, Math.round((L - 1) / fp)), pitch = (L - 1) / k
  for (let q = 0; q < k; q++) {
    const s = 0.5 + q * pitch + pitch / 2, hw = pitch * 0.3, z0 = SHAFT + 1.2, zs = FRIEZE - 0.8 - hw
    qf(shade, P(s - hw, z0, 0.04), P(s + hw, z0, 0.04), P(s + hw, zs, 0.04), P(s - hw, zs, 0.04), n)
    for (let i = 0; i < 4; i++) {
      const a0 = Math.PI * (i / 4), a1 = Math.PI * ((i + 1) / 4)
      tf(shade, P(s, zs, 0.04), P(s + hw * Math.cos(a0), zs + hw * Math.sin(a0), 0.04), P(s + hw * Math.cos(a1), zs + hw * Math.sin(a1), 0.04), n)
    }
  }
  // Shaft windows: one panel per bay over two storeys, with piers and
  // spandrels between, as the punched windows read from a distance.
  const bay = 2.9, kb = Math.max(1, Math.round((L - 2) / bay)), bp = (L - 2) / kb
  const groups = 6, gh = (SHAFT - 1.0 - (ARC + 1.6)) / groups
  for (let q = 0; q < kb; q++) {
    const s0 = 1 + q * bp + (bp - 1.5) / 2, s1 = s0 + 1.5
    for (let g = 0; g < groups; g++) {
      const z0 = ARC + 1.6 + g * gh + 1.0, z1 = ARC + 1.6 + (g + 1) * gh - 1.0
      qf(win, P(s0, z0, 0.04), P(s1, z0, 0.04), P(s1, z1, 0.04), P(s0, z1, 0.04), n)
    }
  }
  // Ground storeys: round arches on the street fronts, plain openings on
  // the court and the east face.
  const ap = 5.0, ka = Math.max(1, Math.round((L - 1) / ap)), app = (L - 1) / ka
  for (let q = 0; q < ka; q++) {
    const s = 0.5 + q * app + app / 2, hw = app * 0.36
    if (w.arcade) {
      const zs = ARC - 1.0 - hw
      qf(shade, P(s - hw, 0, 0.04), P(s + hw, 0, 0.04), P(s + hw, zs, 0.04), P(s - hw, zs, 0.04), n)
      for (let i = 0; i < 8; i++) {
        const a0 = Math.PI * (i / 8), a1 = Math.PI * ((i + 1) / 8)
        tf(shade, P(s, zs, 0.04), P(s + hw * Math.cos(a0), zs + hw * Math.sin(a0), 0.04), P(s + hw * Math.cos(a1), zs + hw * Math.sin(a1), 0.04), n)
      }
    } else if (L > 8) {
      qf(win, P(s - hw * 0.7, 1.2, 0.04), P(s + hw * 0.7, 1.2, 0.04), P(s + hw * 0.7, ARC - 1.2, 0.04), P(s - hw * 0.7, ARC - 1.2, 0.04), n)
    }
  }
}
// Flat roof under the hips, and the three hipped roofs.
const arms: Rect[] = [rect(W0, W1, S, N), rect(E0, E1, S, N), rect(W1, E0, CY, N)]
for (const r of arms) hip(tile, rect(r.x0 + 0.05, r.x1 - 0.05, r.y0 + 0.05, r.y1 - 0.05), PAR + 0.9, RIDGE, Math.min(r.x1 - r.x0, r.y1 - r.y0) / 2 - 0.1, false)
// The parapet's top beneath the hips (covers the gap at the eaves).
for (const r of arms) qf(tc, [r.x0, r.y0, PAR], [r.x1, r.y0, PAR], [r.x1, r.y1, PAR], [r.x0, r.y1, PAR], [0, 0, 1])

// Rear block in the court, with its own frieze line and flat roof, and the
// plain penthouse rising against the court face.
cbox(tc, REAR, 0, REAR_Z, { b: 0.4 })
for (const [side, at, a0, a1] of [['s', REAR.y0, REAR.x0, REAR.x1], ['e', REAR.x1, REAR.y0, REAR.y1], ['w', REAR.x0, REAR.y0, REAR.y1]] as const) {
  const n: V3 = side === 's' ? [0, -1, 0] : side === 'e' ? [1, 0, 0] : [-1, 0, 0]
  const P = (u: number, z: number): V3 => (side === 's' ? [u, at - 0.04, z] : [at + n[0] * 0.04, u, z])
  const L = a1 - a0, kb = Math.max(1, Math.round(L / 5.2)), bp = L / kb
  for (let q = 0; q < kb; q++) for (let g = 0; g < 3; g++) {
    const z0 = 16 + g * 8.5 + 1.0, z1 = 16 + (g + 1) * 8.5 - 1.0
    qf(win, P(a0 + q * bp + 1.0, z0), P(a0 + (q + 1) * bp - 1.0, z0), P(a0 + (q + 1) * bp - 1.0, z1), P(a0 + q * bp + 1.0, z1), n)
  }
  qf(shade, P(a0 + 0.6, REAR_Z - 3.2), P(a1 - 0.6, REAR_Z - 3.2), P(a1 - 0.6, REAR_Z - 1.4), P(a0 + 0.6, REAR_Z - 1.4), n)
}
cbox(tc, PENT, REAR_Z - 1, PENT_Z, { b: 0.4, top: tile })

if (import.meta.main) {
  await save('sd-john-d-spreckels-building', 'John D. Spreckels Building', [
    { part: tc, material: finish('spreckels-terracotta', 0xe8e4db) },
    { part: win, material: finish('window', 0x5e646b, 0.35) },
    { part: tile, material: PALETTE.terracotta },
    { part: shade, material: finish('spreckels-shade', 0x8a867e) },
  ], { anchor: [-117.1588086, 32.7154908], bearing: 0 })
}
