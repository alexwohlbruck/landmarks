/**
 * Hôtel des Invalides, Paris (Libéral Bruant, 1671–76) — the ranges round
 * the Cour d'honneur and the side courts. Procedural, CC0-1.0, no textures.
 * bun generators/paris-invalides.ts
 *
 * The Dôme and the Cathédrale Saint-Louis joined to it are their own model
 * (paris-invalides-dome): the whole hôtel with the Dôme does not fit one
 * budget, and the lead allowed the split.
 *
 * Map frame: x east, y north in the hôtel's frame (compass 4.2° is +y), z up,
 * metres. Placement bearing 4.2. Anchor: the area centroid of the OSM
 * multipolygon relation/1463538 (lng 2.3126275, lat 48.8559477).
 *
 * Evidence
 * - OSM (measured): the relation's outer ring and 15 courts, read in this
 *   frame and drawn as 37 ranges (rectangles, overlapping at the corners):
 *   the north front x −99…102, y 111…124 with its corner pavilions to
 *   y 128 and the central pavilion (x −15…11) to 129; the Cour d'honneur
 *   x −31…34, y 8…111; the four north side courts; the south-west and
 *   south-east wings (x −137…−31 and 33…136, y −125…0) with their courts;
 *   the notch x −31…33, y −60…−13 where Saint-Louis and the Dôme stand.
 *   OSM has no heights or parts for the hôtel.
 * - Photo (Wikimedia Commons, evidence): "Hôtel des Invalides, North View,
 *   Paris 7e 140402 1.jpg" (DXR, CC BY-SA 3.0; the north front, level, at
 *   dusk), scaled on the 201 m front (6.0 px/m): cornice 17 m, the mansard's
 *   break 23 m and ridge 25.8 m, four storeys of windows, a row of dormers;
 *   corner pavilions to 18 m with roofs to 28 m; the central pavilion with
 *   its great round arch to 25 m and its top to ~29 m.
 *   "South facade of Dôme des Invalides.jpg" (Maksim Sokolov (maxergon.com),
 *   CC BY-SA 4.0; the south wings' slate mansards with dormers beside the
 *   Dôme).
 * - Estimated: the same section for every range (the photos show the north
 *   front and the south wings only); the Cour d'honneur's two storeys of
 *   arcades (from general knowledge of the building, not from a photo here:
 *   a doubt); window bays at 4.2 m.
 * - Simplified: chimneys, the trophies on the dormers, the statues and the
 *   equestrian relief in the central arch, the moat and its bastions (ground,
 *   the map's); dormers only on the north front and the Cour d'honneur;
 *   windows only on the street fronts and the Cour d'honneur (the side
 *   courts' walls are plain, and the fourth storey's small windows are
 *   drawn on the north front only, to fit the budget).
 * - Look-only references: none.
 * - Doubts: no photo of the side courts or the east and west fronts.
 *
 * Night: the north front and the Cour d'honneur floodlit; windows glow.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cbox, grow, hip, qf, rect, save, tf, type Rect } from './dc-white-house'
import { face, holePanel } from './london-westminster-abbey'

const stone = new Part(), trim = new Part(), roof = new Part(), win = new Part(), door = new Part()
const EAVE = 17, BREAK = 23, RIDGE = 25.8

// Ranges [x0, x1, y0, y1].
const R: Array<[number, number, number, number]> = [
  // North block round the Cour d'honneur and the four side courts.
  [-99, 102, 111, 124], [-95, -82, 0, 111], [-99, -95, 0, 9], [-82, -44, 53, 66], [-44, -31, 0, 111],
  [-31, 34, 1, 8], [-31, -21, -13, 1], [23, 34, -13, 1], [34, 47, 0, 111], [47, 85, 53, 66], [85, 98, 9, 110],
  [85, 102, 0, 9], [-99, -31, 0, 8], [34, 102, 0, 8],
  // South-west wing.
  [-137, -126, -125, 0], [-137, -39, -125, -114], [-97, -86, -114, -9], [-126, -49, -71, -59], [-49, -39, -125, -59],
  [-44, -31, -59, -5], [-137, -31, -9, 0], [-39, -31, -60, -13],
  // South-east wing.
  [127, 136, -125, 0], [41, 136, -125, -115], [41, 54, -125, -60], [33, 46, -60, -5], [86, 95, -116, -9],
  [54, 127, -89, -79], [46, 127, -55, -43], [33, 136, -9, 0], [33, 41, -60, -13],
]
const rects: Rect[] = R.map(([a, b, c, d]) => rect(a, b, c, d))
const inside = (x: number, y: number) => rects.some((r) => x > r.x0 && x < r.x1 && y > r.y0 && y < r.y1)

for (const r of rects) {
  cbox(stone, r, 0, EAVE - 0.9, { top: false })
  cbox(trim, grow(r, 0.4), EAVE - 0.9, EAVE, { bottom: true, top: false })
  // Mansard: a steep slate slope to the break, then a low hip to the ridge.
  const d = Math.min(r.x1 - r.x0, r.y1 - r.y0)
  hip(roof, grow(r, 0.3), EAVE, BREAK, 2.4, false)
  hip(roof, grow(r, -2.1), BREAK, RIDGE, Math.max(0.2, d / 2 - 2.6))
}

// Windows on every free face, by 4.2 m bays: ground floor, storeys two and
// three grouped, the fourth storey under the cornice. Arcades on the
// Cour d'honneur, two storeys of round arches.
const honneur = (x: number, y: number) => x > -31 && x < 34 && y > 8 && y < 111
// The relation's outer ring (simplified, this frame): a bay outside it faces the street.
const OUTER: Array<[number, number]> = [[-39, -59], [-31, -59], [-31, -13], [-21, -13], [-21, -5], [-11, -5], [-11, 1], [14, 1], [14, -4], [23, -5], [23, -12], [33, -13], [33, -60], [41, -60], [41, -125], [136, -125], [136, 0], [102, 0], [101, 9], [98, 9], [98, 110], [102, 110], [102, 128], [85, 128], [85, 124], [11, 127], [11, 129], [-8, 129], [-15, 124], [-82, 124], [-82, 128], [-99, 128], [-99, 111], [-95, 111], [-95, 9], [-99, 9], [-99, 0], [-125, 0], [-137, -5], [-137, -125], [-39, -125]]
const outside = (x: number, y: number) => {
  let c = false
  for (let i = 0, j = OUTER.length - 1; i < OUTER.length; j = i++) {
    const [xi, yi] = OUTER[i], [xj, yj] = OUTER[j]
    if ((yi > y) !== (yj > y) && x < xi + ((y - yi) * (xj - xi)) / (yj - yi)) c = !c
  }
  return !c
}
let bays = 0
for (const r of rects) {
  const sides: Array<['n' | 's' | 'e' | 'w', number, number, number]> = [['s', r.y0, r.x0, r.x1], ['n', r.y1, r.x0, r.x1], ['w', r.x0, r.y0, r.y1], ['e', r.x1, r.y0, r.y1]]
  for (const [side, at, a0, a1] of sides) {
    const F = face(side, at)
    const n = Math.floor((a1 - a0) / 4.2)
    const pad = (a1 - a0 - n * 4.2) / 2
    for (let k = 0; k < n; k++) {
      const c = a0 + pad + 4.2 * (k + 0.5)
      const px = side === 'e' ? at + 1 : side === 'w' ? at - 1 : c, py = side === 'n' ? at + 1 : side === 's' ? at - 1 : c
      if (inside(px, py)) continue
      // The side courts are seen only from above: their walls stay plain.
      const qx = side === 'e' ? at + 4.5 : side === 'w' ? at - 4.5 : c, qy = side === 'n' ? at + 4.5 : side === 's' ? at - 4.5 : c
      if (!honneur(px, py) && !outside(qx, qy)) continue
      bays++
      if (honneur(px, py)) {
        holePanel(win, F, { a0: c - 1.5, a1: c + 1.5, zb: 0.3, zs: 4.6, head: 'round', seg: 4 }, 0.05)
        holePanel(win, F, { a0: c - 1.4, a1: c + 1.4, zb: 7.0, zs: 11.0, head: 'round', seg: 4 }, 0.05)
        holePanel(win, F, { a0: c - 0.8, a1: c + 0.8, zb: 13.2, zs: 15.6, head: 'flat' }, 0.05)
        // A dormer above every third bay.
        if (k % 3 === 1) dormer(side, at, c)
      } else {
        holePanel(win, F, { a0: c - 0.85, a1: c + 0.85, zb: 1.4, zs: 4.2, head: 'flat' }, 0.05)
        holePanel(win, F, { a0: c - 0.85, a1: c + 0.85, zb: 5.8, zs: 11.6, head: 'flat' }, 0.05)
        // The attic storey's small windows on the north front only (budget).
        if (side === 'n' && at > 120) holePanel(win, F, { a0: c - 0.75, a1: c + 0.75, zb: 13.2, zs: 15.4, head: 'flat' }, 0.05)
        if (side === 'n' && at > 120 && k % 2 === 0) dormer(side, at, c)
      }
    }
  }
}
/** A stone dormer with a pediment, standing on the mansard's lower slope. */
function dormer(side: 'n' | 's' | 'e' | 'w', at: number, c: number) {
  const s = side === 'n' || side === 'e' ? 1 : -1, ns = side === 'n' || side === 's'
  const o0 = at - s * 1.0, o1 = at - s * 2.4
  const r = ns ? rect(c - 0.9, c + 0.9, Math.min(o0, o1), Math.max(o0, o1)) : rect(Math.min(o0, o1), Math.max(o0, o1), c - 0.9, c + 0.9)
  cbox(stone, r, EAVE, EAVE + 2.6, { top: false })
  const P = (a: number, d: number, z: number): V3 => (ns ? [c + a, at - s * d, z] : [at - s * d, c + a, z])
  const nrm: V3 = ns ? [0, s, 0] : [s, 0, 0]
  tf(stone, P(-0.9, 1.0, EAVE + 2.6), P(0.9, 1.0, EAVE + 2.6), P(0, 1.0, EAVE + 3.4), nrm)
  qf(roof, P(-0.9, 1.0, EAVE + 2.6), P(0, 1.0, EAVE + 3.4), P(0, 2.4, EAVE + 3.4), P(-0.9, 2.4, EAVE + 2.6), ns ? [-1, 0, 1] : [0, -1, 1])
  qf(roof, P(0.9, 1.0, EAVE + 2.6), P(0, 1.0, EAVE + 3.4), P(0, 2.4, EAVE + 3.4), P(0.9, 2.4, EAVE + 2.6), ns ? [1, 0, 1] : [0, 1, 1])
  holePanel(win, face(side, at - s * 1.0), { a0: c - 0.5, a1: c + 0.5, zb: EAVE + 0.4, zs: EAVE + 2.2, head: 'flat' }, 0.04)
}

// ---- Pavilions on the north front: the corners and the great central arch.
for (const [x0, x1] of [[-99, -82], [85, 102]]) {
  const r = rect(x0, x1, 111, 128)
  cbox(stone, r, 0, 17.1, { top: false })
  cbox(trim, grow(r, 0.4), 17.1, 18.0, { b: 0.25, bottom: true, top: false })
  hip(roof, grow(r, 0.3), 18.0, 24.0, 2.0, false)
  hip(roof, grow(r, -1.7), 24.0, 28.0, 4.5)
  for (const c of [x0 + 4.2, (x0 + x1) / 2, x1 - 4.2]) {
    const F = face('n', 128)
    holePanel(win, F, { a0: c - 0.85, a1: c + 0.85, zb: 1.4, zs: 4.2, head: 'flat' }, 0.05)
    holePanel(win, F, { a0: c - 0.85, a1: c + 0.85, zb: 5.8, zs: 11.6, head: 'flat' }, 0.05)
    holePanel(win, F, { a0: c - 0.75, a1: c + 0.75, zb: 13.2, zs: 15.4, head: 'flat' }, 0.05)
  }
}
{
  const r = rect(-15, 11, 111, 129), F = face('n', 129), xm = -2
  cbox(stone, r, 0, 19.0, { top: false })
  cbox(trim, grow(r, 0.4), 19.0, 20.0, { b: 0.25, bottom: true, top: false })
  hip(roof, grow(r, 0.3), 20.0, 25.5, 2.2, false)
  hip(roof, grow(r, -1.9), 25.5, 28.5, 4.0)
  // The great arch rising through the cornice, under a curved pediment.
  cbox(stone, rect(xm - 7.0, xm + 7.0, 128.2, 129.4), 19.0, 23.0, { top: false })
  const arch = 10, R0 = 6.4
  for (let k = 0; k < arch; k++) {
    const t0 = (Math.PI * k) / arch, t1 = (Math.PI * (k + 1)) / arch
    const P = (r: number, t: number, y: number): V3 => [xm + r * Math.cos(t), y, 18.6 + r * Math.sin(t)]
    qf(trim, P(R0, t0, 129.45), P(R0 + 1.0, t0, 129.45), P(R0 + 1.0, t1, 129.45), P(R0, t1, 129.45), [0, 1, 0])
    qf(stone, P(R0 + 1.0, t0, 128.2), P(R0 + 1.0, t1, 128.2), P(R0 + 1.0, t1, 129.45), P(R0 + 1.0, t0, 129.45), [Math.cos((t0 + t1) / 2), 0, Math.sin((t0 + t1) / 2)])
    tf(stone, [xm, 129.42, 18.6], P(R0, t0, 129.42), P(R0, t1, 129.42), [0, 1, 0])
  }
  cbox(roof, rect(xm - 7.6, xm + 7.6, 127.4, 129.6), 18.6, 18.6 + 0.01, { top: false })
  holePanel(trim, F, { a0: xm - 4.2, a1: xm + 4.2, zb: 0, zs: 12.0, head: 'flat' }, 0.06)
  holePanel(door, F, { a0: xm - 2.4, a1: xm + 2.4, zb: 0, zs: 6.5, head: 'round', seg: 6 }, 0.1)
  for (const c of [xm - 9.5, xm + 9.5]) {
    holePanel(win, F, { a0: c - 0.85, a1: c + 0.85, zb: 1.4, zs: 4.2, head: 'flat' }, 0.05)
    holePanel(win, F, { a0: c - 0.85, a1: c + 0.85, zb: 5.8, zs: 11.6, head: 'flat' }, 0.05)
    holePanel(win, F, { a0: c - 0.75, a1: c + 0.75, zb: 13.2, zs: 15.4, head: 'flat' }, 0.05)
  }
}

// Floodlit: the north front and the court's arcades; the rest softly.
const lit = (q: V3, n: V3) => (n[2] > 0.8 ? 0.1 : q[1] > 110 && n[1] > 0.5 ? 1 : 0.45)
await save('paris-invalides', 'Hôtel des Invalides', [
  { part: stone, material: { ...finish('invalides-stone', 0xe9dcc4), floodlight: lit } },
  { part: trim, material: { ...PALETTE.trim, floodlight: lit } },
  { part: roof, material: finish('invalides-slate', 0x8c959e) },
  { part: win, material: PALETTE.window },
  { part: door, material: finish('invalides-door', 0x7d6c58) },
], { source: 'generators/paris-invalides.ts' }, 6500)
