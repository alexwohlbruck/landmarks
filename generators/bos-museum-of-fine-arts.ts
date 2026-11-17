/**
 * Museum of Fine Arts, Boston (1909, Guy Lowell; Evans Wing 1915; Linde
 * Wing 1981, I. M. Pei; Art of the Americas Wing and Shapiro Courtyard
 * 2010, Foster + Partners) — original procedural geometry, CC0-1.0.
 * bun generators/bos-museum-of-fine-arts.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground. Bearing 332.7: the walls of OSM relation/63938 run at
 * 62.7°/332.7°, so x runs along Huntington Avenue (+x east-north-east) and
 * -y faces Huntington Avenue; +y is the Fenway. Anchor = the outline's
 * centroid, -71.0941866, 42.3394862.
 *
 * Identity (from the photos below):
 *  1. The long grey granite neoclassical Huntington Avenue front: a
 *     central temple front with four Ionic columns in antis under a
 *     pediment, three storeys of tall rectangular windows either side, and
 *     two wings coming forward to the street round the forecourt, each
 *     ending in a pavilion with two columns in antis.
 *  2. The rotunda's low dome behind the portico.
 *  3. The Fenway front (the Evans Wing): a long colonnade of giant columns.
 *  4. The Art of the Americas Wing on the east: pale stone blocks cut by
 *     tall glass slots, and between it and the old building the Shapiro
 *     Courtyard under a long flat glass roof.
 *  5. The plain Linde Wing on the west with its skylit galleria, and an
 *     open garden court in the middle.
 *
 * Plan: OSM relation/63938 (outer way/29617176, inner way/29622506) in the
 * turned frame, split into rectangular ranges along the roof breaks the
 * lidar shows; the outline's small notches are squared off. The glass
 * roof and the Americas Wing are placed from the USGS NAIP orthophoto.
 *
 * Heights: USGS 3DEP lidar MA_CentralEastern_1_2021 (2021), 1 m grid, read
 * with tools/lidar_frame.py; y = 0 is the lowest ground (3.0 above the
 * grid's ground_min; Huntington Avenue is 0.5–0.8 higher). Measured: the
 * Huntington range 18.5, the forward wings 17, the portico's pediment
 * about 21, the rotunda dome 26.4, the Evans Wing 22.5 (its back range
 * 17.5), the middle block and glass roof 21.2, the Americas Wing 21.5, the
 * Linde Wing 14 with its galleria ridge 18.
 *
 * Estimated from the photos (Beyond My Ken's 2018 series, scaled from the
 * 18.5 m cornice): the portico (22.6 m wide, four 2.1 m columns 13.5 m
 * tall on a 2.5 m podium before a dark recess, entablature to 20.8 and
 * pediment to 25.6, enlarged after lead review so it reads at phone size;
 * lidar shows about 23), the window rows (2.5–5.0 and 7.0–11.5), the wing-end
 * pavilions, the rotunda drum (10 m radius). The Fenway colonnade's height
 * and spacing are from the single Fenway photo (M2545) and so are rough.
 *
 * Ground: Mapterhorn and lidar ground are within 1 m across the site;
 * elevation 0. The forecourt, lawns and steps beyond the podium are the
 * map's.
 *
 * Night: windows and the doors glow; the glass roof and the Americas
 * Wing's glass slots (drawn in the light `glass` colour) stay dark.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - 2018 Museum of Fine Arts Boston Huntington Avenue facade from east.jpg,
 *    Beyond My Ken, CC BY-SA 4.0 (the whole front, square on)
 *    https://commons.wikimedia.org/wiki/File:2018_Museum_of_Fine_Arts_Boston_Huntington_Avenue_facade_from_east.jpg
 *  - … facade from southeast.jpg, … facade from south.jpg, … facade from
 *    northeast.jpg, … Facade from north.jpg, … entrance.jpg (same author,
 *    licence, series) https://commons.wikimedia.org/wiki/Category:Museum_of_Fine_Arts,_Boston
 *  - Mfa boston af.jpg, Alexf, CC BY 2.5 (portico)
 *    https://commons.wikimedia.org/wiki/File:Mfa_boston_af.jpg
 *  - 2010 MFA Boston Fenway.jpg, M2545, public domain (the Fenway columns
 *    and the Americas Wing) https://commons.wikimedia.org/wiki/File:2010_MFA_Boston_Fenway.jpg
 *  - USGS NAIP orthophoto (public domain), for the plan and roofs.
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the Fenway front and the Americas Wing are covered by a single
 * photo, so the colonnade's rhythm and the wing's glass slots are
 * schematic; the west (Linde) and east sides are unphotographed and drawn
 * plain. The interior courtyards' walls and the roof skylights are
 * simplified.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { box, onWall, rectShape, revolve, save, type XY } from './atl-tech-tower'
import { column } from './atl-flatiron-building'

const granite = new Part(), pale = new Part(), roof = new Part(), win = new Part(), glass = new Part(), door = new Part()
type F = [XY, XY]
/** Window panels along a face (a→b, outside on the right), one per bay, in rows. */
function rows(f: F, rws: [number, number][], bay: number, w: number, margin = 2, p = win) {
  const L = Math.hypot(f[1][0] - f[0][0], f[1][1] - f[0][1]), n = Math.max(1, Math.floor((L - 2 * margin) / bay)), b = (L - 2 * margin) / n
  for (let k = 0; k < n; k++) { const s = margin + (k + 0.5) * b; for (const [z0, z1] of rws) onWall(p, f[0], f[1], rectShape(s - w / 2, s + w / 2, z0, z1), 0.06) }
}
const S = (x0: number, x1: number, y: number): F => [[x0, y], [x1, y]] // a south face
const N = (x0: number, x1: number, y: number): F => [[x1, y], [x0, y]]
const E = (y0: number, y1: number, x: number): F => [[x, y0], [x, y1]]
const W = (y0: number, y1: number, x: number): F => [[x, y1], [x, y0]]
const ROWS: [number, number][] = [[2.3, 4.8], [6.8, 11.0], [12.6, 14.4]]

// ── Masses ──
box(granite, -76.1, 49.5, -49.4, -25.9, 0, 16.5, roof, 0.4) // Huntington range
box(roof, -73, 46.5, -46.4, -28.9, 16.5, 18.5, roof, 0.8) // its low roof
box(granite, -49.1, -11, -25.9, -7, 0, 18.5, roof, 0.3)
box(granite, -76.1, -36.2, -79.5, -49.2, 0, 15.5, roof, 0.4) // west wing
box(roof, -73.1, -39.2, -76.5, -49.4, 15.5, 17, roof, 0.6)
box(granite, 33.7, 75.2, -78.5, -49.2, 0, 15.5, roof, 0.4) // east wing
box(roof, 36.7, 72.2, -75.5, -49.4, 15.5, 17, roof, 0.6)
box(granite, -92, -49.1, -19.2, 50.3, 0, 14, roof, 0.3) // Linde Wing
box(granite, -78, -62, -15, 46, 14, 16, roof, 0.3) // its galleria ridge
box(glass, -76, -64, -14, 45, 16, 18, glass, 0.6)
box(granite, -49.1, 44.6, 38.7, 47.2, 0, 17.5, roof, 0.3) // Evans Wing, back range
box(granite, -49.1, 44.6, 47, 61.8, 0, 22.5, roof, 0.4) // Evans Wing
box(granite, -11, 4, -25.9, 38.7, 0, 21.2, roof, 0.3) // middle block
box(granite, 4, 49.5, -25.9, 4, 0, 21.2, roof, 0.3)
box(granite, 4, 49.5, 30, 38.7, 0, 21.2, roof, 0.3)
box(pale, 4, 49.5, 4, 30, 0, 20.4, null, 0) // Shapiro Courtyard walls
box(glass, 3.6, 49.9, 3.6, 30.4, 20.4, 21.2, glass, 0.2) // its glass roof
box(pale, 49.5, 94.5, -26.6, 50.7, 0, 21.5, roof, 0.4) // Art of the Americas Wing
box(pale, 73.4, 94.5, 50.7, 62.9, 0, 21.5, roof, 0.4)

// ── Rotunda and dome behind the portico ──
revolve(granite, [-0.7, -18], [[10, 18.4], [10, 21.4], [10.6, 21.4], [10.6, 22.0], [9.6, 22.0]], 16, 0, true, false)
revolve(roof, [-0.7, -18], [[9.6, 22.0], [8.8, 23.6], [6.8, 25.1], [3.8, 26.0], [1.5, 26.3], [0, 26.4]], 16, 0, false, false)

// ── Portico: podium, square antae, four giant Ionic columns before a dark
// recess, a deep entablature and a bold pediment, standing well above the
// range's cornice (16.5) as in the photos (apex about 1.5× the eave) ──
{
  const X0 = -12, X1 = 10.6, Y0 = -60, YB = -53.5, BK = -46
  box(granite, X0 - 1.5, X1 + 1.5, Y0 - 1.8, -49.4, 0, 2.5, granite, 0.15)
  box(granite, X0, X1, YB, BK, 2.5, 20.8, null, 0) // the pavilion behind the porch
  for (const [a, b] of [[X0, X0 + 3.0], [X1 - 3.0, X1]]) box(granite, a, b, Y0, YB, 2.5, 20.8, null, 0.1) // square antae
  box(granite, X0 - 0.4, X1 + 0.4, Y0 - 0.4, BK, 16.6, 20.8, granite, 0.3) // entablature
  const cx = (X0 + X1) / 2
  for (const k of [-1.5, -0.5, 0.5, 1.5]) {
    column(granite, [cx + k * 3.7, Y0 + 1.2], 1.05, 2.5, 16.0, 12)
    box(granite, cx + k * 3.7 - 1.35, cx + k * 3.7 + 1.35, Y0 - 0.15, Y0 + 2.55, 15.9, 16.6, granite, 0.1) // capital
  }
  // the dark recess behind the columns
  const P: F = [[X0 + 3.0, YB], [X1 - 3.0, YB]], PW = X1 - X0 - 6
  onWall(win, P[0], P[1], rectShape(0, PW, 2.5, 16.6), 0.04)
  for (const s of [PW / 2 - 4.2, PW / 2, PW / 2 + 4.2]) onWall(door, P[0], P[1], rectShape(s - 1.15, s + 1.15, 2.5, 7.0), 0.08)
  // pediment, raking from the entablature's ends
  const y0 = Y0 - 0.4, z0 = 20.8, z1 = 25.6, a: V3 = [X0 - 0.4, y0, z0], b: V3 = [X1 + 0.4, y0, z0], c: V3 = [cx, y0, z1]
  granite.tri(a, b, c)
  const a2: V3 = [X0 - 0.4, BK, z0], b2: V3 = [X1 + 0.4, BK, z0], c2: V3 = [cx, BK, z1]
  granite.tri(b2, a2, c2)
  roof.quad(a, c, c2, a2); roof.quad(c, b, b2, c2)
  // its raking cornices, bold so the pediment reads at phone size
  for (const [p, q] of [[a, c], [c, b]] as [V3, V3][]) {
    const sec = (v: V3): V3[] => [[v[0], v[1] - 0.5, v[2] + 0.45], [v[0], v[1] + 0.6, v[2] + 0.45], [v[0], v[1] + 0.6, v[2] - 0.2], [v[0], v[1] - 0.5, v[2] - 0.2]]
    granite.sweep([sec(p), sec(q)])
  }
}

// ── Wing-end pavilions on Huntington Avenue: two columns in antis ──
for (const [x0, x1, y] of [[-76.1, -36.2, -79.5], [33.7, 75.2, -78.5]] as [number, number, number][]) {
  const cx = (x0 + x1) / 2
  box(granite, cx - 7, cx + 7, y - 2.4, y + 0.1, 0, 16.6, roof, 0.25)
  // the recess between the antae, drawn as a dark porch panel with the columns before it
  onWall(win, [cx - 4.2, y - 2.4], [cx + 4.2, y - 2.4], rectShape(1.2, 7.2, 4.0, 12.5), 0.04)
  for (const k of [-1, 1]) column(granite, [cx + k * 1.8, y - 3.0], 0.6, 1.5, 13.5, 10)
  box(granite, cx - 4.4, cx + 4.4, y - 3.8, y - 2.3, 13.5, 15.0, granite, 0.15)
  rows(S(x0, cx - 7, y), ROWS, 4.2, 1.7, 1.5)
  rows(S(cx + 7, x1, y), ROWS, 4.2, 1.7, 1.5)
}

// ── Windows ──
rows(S(-36.2, -11.7, -49.4), ROWS, 4.4, 1.8, 1.5)
rows(S(10.3, 33.7, -49.4), ROWS, 4.4, 1.8, 1.5)
rows(E(-79.5, -49.4, -36.2), ROWS, 4.4, 1.8, 1.5) // wing inner faces
rows(W(-78.5, -49.4, 33.7), ROWS, 4.4, 1.8, 1.5)
rows(W(-79.5, -49.4, -76.1), ROWS, 4.4, 1.8, 1.5) // wing outer faces
rows(E(-78.5, -49.2, 75.2), ROWS, 4.4, 1.8, 1.5)
rows(S(49.5, 75.2, -49.4), ROWS, 4.4, 1.8, 1.5)
rows(W(-19.2, 50.3, -92), [[2.5, 4.8]], 6, 3.2, 3) // Linde Wing, ground floor
rows(S(-92, -76.1, -19.2), [[2.5, 4.8]], 6, 3.2, 2)

// ── The Fenway colonnade on the Evans Wing ──
{
  const y = 61.8
  rows(N(-49.1, 44.6, y), [[3.0, 6.0], [9.0, 15.5]], 5.2, 2.2, 6)
  for (let k = 0; k < 16; k++) column(granite, [-40 + k * 5.4, y + 1.6], 0.75, 1.0, 18.0, 10)
  box(granite, -42.5, 43.5, y, y + 2.7, 18.0, 20.5, roof, 0.25)
  box(granite, -42.5, 43.5, y, y + 2.7, 0, 1.0, granite, 0.1) // stylobate
}

// ── The Americas Wing: tall glass slots in pale stone, a glass pavilion ──
for (const f of [E(-26.6, 50.7, 94.5), E(50.7, 62.9, 94.5), N(73.4, 94.5, 62.9), N(49.5, 73.4, 50.7), S(75.2, 94.5, -26.6)] as F[]) {
  const L = Math.hypot(f[1][0] - f[0][0], f[1][1] - f[0][1]), n = Math.max(1, Math.round(L / 9))
  for (let k = 0; k < n; k++) { const s = (k + 0.5) * (L / n); onWall(glass, f[0], f[1], rectShape(s - 1.4, s + 1.4, 1.0, 20.0), 0.06) }
}
// the courtyard's glass ends between the wings
for (const f of [N(44.6, 49.5, 47.2)] as F[]) onWall(glass, f[0], f[1], rectShape(0.3, 4.6, 0, 16), 0.06)

await save('bos-museum-of-fine-arts', 'Museum of Fine Arts', [
  { part: granite, material: finish('mfa-granite', 0xd9d2c6) },
  { part: pale, material: finish('mfa-americas-stone', 0xece8e0) },
  { part: roof, material: PALETTE.roof },
  { part: win, material: PALETTE.window },
  { part: glass, material: PALETTE.glass },
  { part: door, material: PALETTE.entrance },
], { height: 26.4, anchor: [42.3394862, -71.0941866], bearing: 332.7 }, 6500)
