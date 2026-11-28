/**
 * Royal Bank Plaza, Toronto (1976-79, WZMH Architects) — the South and
 * North Towers and the glass banking hall between them. Original
 * procedural geometry, CC0-1.0.
 * bun generators/tor-royal-bank-plaza.ts
 *
 * Frame: x along Front Street (east-north-east +), y north-north-west +,
 * z up, metres; origin at the anchor on the ground. Bearing 343.3 (the
 * Toronto street grid; the towers' straight legs run true in it). Anchor =
 * area centroid of the three OSM outlines together: -79.3800414, 43.6465369.
 *
 * One model: the banking hall (OSM way/151519194) fills the space between
 * the towers' stepped inner faces and meets both of them above ground
 * (lund, ne), so towers and hall are drawn together.
 *
 * Identity (from the photos):
 *  1. Two triangular towers in gold-coated mirror glass, set corner to
 *     corner: each a right triangle whose two outer legs are serrated
 *     into tall vertical folds, the inner faces stepping back toward the
 *     hall.                                            (lund, rbp1, ne)
 *  2. The 41-storey South Tower and the 26-storey North Tower, their tops
 *     stepped in a sawtooth: highest at the stone pier of each acute end,
 *     each serration ending lower toward the right-angle corner, about a
 *     third of the height in all.                         (jkliu, ne)
 *  3. Pale stone piers standing full height at the acute ends of each
 *     triangle.                                                (ne, lund)
 *  4. The dark glass banking hall between them, about a third of the
 *     North Tower's height, its glass roof stepping up toward the towers.
 *                                                       (lund, ne, jkliu)
 *
 * Plan: OSM way/27767625 (South Tower), way/27767624 (North Tower) and
 * way/151519194 (banking hall) used as drawn, serrations included (the
 * folds are about 3 m deep on a 4.3 m pitch; rbp1 shows the same rhythm),
 * turned into this frame. The hall's outline is drawn 0.4 m inside its
 * shared walls with the towers.
 * Heights (no lidar in Canada):
 *  - published: South Tower 180 m, 41 storeys; North Tower 112 m, 26
 *    storeys (Wikipedia "Royal Bank Plaza"; OSM height 180 and 114).
 *  - City of Toronto 3D Massing 2025 (https://open.toronto.ca/dataset/3d-massing/):
 *    South Tower 175.3, North Tower 113.0. Used: 178 and 113 (the roof
 *    slabs; the parapet makes up the rest of the published 180).
 *  - the banking hall: estimated 40 m from lund (about a third of the
 *    North Tower's height above the street) and ne; the massing's 53 m
 *    block covers the hall with the tower bases and is not used. OSM's
 *    22 m (5 levels) is the hall's floor count, not its height.
 *  - the corner piers' size from the OSM plan's end facets; their 2 m rise
 *    over the roof from ne.
 *  - ground: Mapterhorn z15 is near flat here; elevation 0.
 *
 * Colours: the gold glass from lund and ne (deep gold in shade, near
 * white where it catches the sun), pulled to the palette's lightness; the
 * piers pale grey stone; the hall dark glass.
 *
 * Night: the office floors glow behind the gold glass (window); the hall
 * stays dark (glass); the piers carry a faint floodlight.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  lund  "Royal Bank Plaza, Toronto, Ontario (29889523112).jpg", Ken Lund,
 *        CC BY-SA 2.0 — from the CN Tower (south-west): the plan, the piers, the hall.
 *        https://commons.wikimedia.org/wiki/File:Royal_Bank_Plaza,_Toronto,_Ontario_(29889523112).jpg
 *  ne    "Royal Bank Plaza from north-east.jpg", Ajsdecepida, CC BY-SA 3.0 —
 *        both towers and the hall from the street.
 *        https://commons.wikimedia.org/wiki/File:Royal_Bank_Plaza_from_north-east.jpg
 *  rbp1  "Royal Bank Plaza Toronto.jpg", Danielle Scott, CC BY-SA 2.0 — the
 *        serrated face and its top edge, close.
 *        https://commons.wikimedia.org/wiki/File:Royal_Bank_Plaza_Toronto.jpg
 *  jkliu "Royal Bank Plaza 2025-05-24.jpg", JK Liu, CC BY-SA 4.0 — both
 *        towers' stepped crowns and the hall from Wellington Street.
 *        https://commons.wikimedia.org/wiki/File:Royal_Bank_Plaza_2025-05-24.jpg
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the hall's height and its glass roof steps (three tiers, 34 to
 * 43 m, estimated);
 * the mullion grid (left out: it reads as the gold at map distance).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { ccw, offset, prism, save, type XY } from './atl-flatiron-building'

const gold = new Part(), pier = new Part(), roof = new Part(), hall = new Part()

const NORTH: XY[] = [[-37.29, 48.51], [-35.84, 46.89], [-37.16, 45.63], [-35.84, 44.12], [-38.84, 40.99], [-35.87, 37.92], [-37.26, 36.44], [-35.61, 34.60], [-37.13, 33.15], [-35.68, 31.64], [-38.88, 28.57], [-35.62, 25.46], [-37.16, 23.82], [-35.71, 22.27], [-37.16, 20.65], [-35.77, 19.20], [-38.74, 16.18], [-35.38, 12.90], [-37.07, 11.40], [-35.70, 10.01], [-37.07, 8.60], [-35.70, 7.08], [-38.88, 3.83], [-37.56, 2.31], [-34.44, 5.80], [-32.53, 3.73], [-33.37, 2.59], [-33.33, -2.81], [-32.11, -2.94], [-31.30, -2.14], [-28.46, 0.71], [-24.05, 5.14], [-23.95, 6.94], [-22.46, 7.06], [-22.24, 8.39], [-21.10, 8.52], [-20.80, 9.97], [-18.82, 9.97], [-18.56, 12.17], [-17.09, 12.25], [-17.04, 13.58], [-15.77, 13.73], [-15.44, 14.98], [-11.83, 15.60], [-11.88, 18.93], [-10.38, 19.39], [-10.05, 20.78], [-8.85, 20.54], [-8.54, 22.16], [-6.52, 22.15], [-6.30, 24.36], [-4.95, 24.17], [-4.77, 25.94], [-3.58, 25.98], [-3.65, 27.32], [-0.12, 27.70], [0.37, 31.24], [2.02, 31.02], [2.07, 32.66], [3.25, 32.65], [3.67, 34.45], [5.54, 34.10], [5.79, 36.43], [7.06, 36.39], [7.29, 37.89], [8.62, 37.79], [8.88, 39.55], [10.07, 39.24], [14.37, 43.88], [16.42, 46.10], [18.03, 47.62], [18.11, 49.52], [12.82, 49.40], [11.91, 48.59], [10.25, 50.46], [13.14, 53.37], [11.95, 54.66], [8.65, 51.54], [7.10, 53.28], [5.59, 51.56], [4.31, 53.10], [2.59, 51.50], [-0.48, 54.70], [-3.53, 51.28], [-5.30, 52.88], [-6.73, 51.26], [-8.26, 53.07], [-9.74, 51.46], [-12.90, 54.59], [-15.98, 51.39], [-16.70, 52.04], [-17.52, 52.76], [-19.22, 51.21], [-20.61, 52.96], [-22.23, 51.42], [-23.75, 53.00], [-25.42, 54.72], [-28.44, 51.43], [-29.96, 53.12], [-31.32, 51.39], [-32.93, 53.06], [-34.46, 51.42], [-37.67, 54.54], [-39.01, 53.13], [-35.77, 50.03]]
const SOUTH: XY[] = [[26.50, 7.70], [22.72, 3.94], [22.06, 4.20], [21.97, 1.82], [20.54, 1.82], [20.34, 0.34], [18.97, 0.51], [18.94, -1.22], [16.67, -1.33], [16.65, -3.67], [15.25, -3.38], [15.03, -5.16], [13.67, -4.93], [13.46, -6.66], [9.91, -6.70], [9.86, -10.58], [8.45, -10.34], [8.37, -12.04], [6.88, -11.84], [6.77, -13.41], [4.73, -13.41], [4.63, -15.79], [3.06, -15.69], [3.09, -17.23], [1.65, -17.05], [1.35, -18.87], [-1.86, -18.83], [-2.21, -22.49], [-3.50, -22.41], [-3.88, -24.09], [-5.12, -24.09], [-5.44, -25.78], [-7.34, -25.70], [-7.46, -27.76], [-9.00, -27.92], [-9.42, -29.51], [-10.45, -29.46], [-10.83, -31.12], [-12.78, -30.79], [-13.02, -31.85], [-16.35, -35.58], [-19.04, -38.58], [-19.19, -40.06], [-13.81, -39.85], [-13.20, -39.14], [-11.19, -40.94], [-14.24, -44.00], [-11.23, -46.98], [-12.58, -48.56], [-11.11, -50.08], [-12.75, -51.65], [-11.40, -52.98], [-14.28, -55.80], [-12.97, -57.15], [-10.05, -54.23], [-8.68, -55.60], [-7.09, -54.16], [-5.60, -55.76], [-3.95, -54.22], [-1.30, -56.97], [2.09, -54.04], [3.46, -55.79], [5.09, -54.21], [6.43, -55.65], [7.96, -54.15], [11.04, -57.15], [13.91, -54.27], [15.45, -55.58], [17.01, -54.28], [18.35, -55.68], [20.13, -54.29], [21.86, -55.84], [23.41, -57.21], [26.25, -54.32], [27.53, -55.61], [29.05, -54.38], [30.37, -55.74], [32.24, -54.27], [35.19, -57.14], [36.19, -56.03], [33.41, -53.25], [35.01, -51.61], [33.20, -50.07], [34.68, -48.45], [33.43, -46.96], [36.12, -44.17], [33.31, -41.21], [34.77, -39.55], [33.32, -37.96], [34.82, -36.53], [33.32, -34.86], [34.91, -33.43], [36.19, -31.97], [33.25, -28.94], [34.62, -27.58], [33.30, -25.95], [34.85, -24.63], [33.23, -22.95], [36.18, -19.93], [33.23, -17.04], [34.68, -15.53], [33.21, -13.98], [34.62, -12.41], [33.28, -11.08], [36.23, -8.05], [33.14, -4.98], [34.65, -3.53], [33.23, -1.83], [34.76, -0.34], [33.37, 1.08], [36.14, 4.01], [34.84, 5.37], [31.99, 2.52], [30.40, 4.05], [31.08, 4.61], [31.20, 10.22], [29.61, 10.79]]
const ATRIUM: XY[] = [[10.07, 39.24], [8.88, 39.55], [8.62, 37.79], [7.29, 37.89], [7.06, 36.39], [5.79, 36.43], [5.54, 34.10], [3.67, 34.45], [3.25, 32.65], [2.07, 32.66], [2.02, 31.02], [0.37, 31.24], [-0.12, 27.70], [-3.65, 27.32], [-3.58, 25.98], [-4.77, 25.94], [-4.95, 24.17], [-6.30, 24.36], [-6.52, 22.15], [-8.54, 22.16], [-8.85, 20.54], [-10.05, 20.78], [-10.38, 19.39], [-11.88, 18.93], [-11.83, 15.60], [-15.44, 14.98], [-15.77, 13.73], [-17.04, 13.58], [-17.09, 12.25], [-18.56, 12.17], [-18.82, 9.97], [-20.80, 9.97], [-21.10, 8.52], [-22.24, 8.39], [-22.46, 7.06], [-23.95, 6.94], [-24.05, 5.14], [-28.46, 0.71], [-25.17, -2.36], [-28.12, -5.33], [-25.08, -8.35], [-27.86, -11.15], [-24.79, -14.17], [-28.12, -17.52], [-25.08, -20.52], [-28.36, -23.82], [-19.37, -32.62], [-16.35, -35.58], [-13.02, -31.85], [-12.78, -30.79], [-10.83, -31.12], [-10.45, -29.46], [-9.42, -29.51], [-9.00, -27.92], [-7.46, -27.76], [-7.34, -25.70], [-5.44, -25.78], [-5.12, -24.09], [-3.88, -24.09], [-3.50, -22.41], [-2.21, -22.49], [-1.86, -18.83], [1.35, -18.87], [1.65, -17.05], [3.09, -17.23], [3.06, -15.69], [4.63, -15.79], [4.73, -13.41], [6.77, -13.41], [6.88, -11.84], [8.37, -12.04], [8.45, -10.34], [9.86, -10.58], [9.91, -6.70], [13.46, -6.66], [13.67, -4.93], [15.03, -5.16], [15.25, -3.38], [16.65, -3.67], [16.67, -1.33], [18.94, -1.22], [18.97, 0.51], [20.34, 0.34], [20.54, 1.82], [21.97, 1.82], [22.06, 4.20], [22.72, 3.94], [26.50, 7.70], [24.29, 9.91], [27.36, 12.99], [25.95, 14.38], [24.38, 15.93], [27.43, 18.98], [24.35, 22.01], [27.48, 25.17], [23.99, 28.60], [26.98, 31.60], [14.37, 43.88]]

const SOUTH_H = 178, NORTH_H = 113

/** Sutherland-Hodgman clip of a ring to the half-plane f(p) >= 0 (f linear). */
function clip(ring: XY[], f: (p: XY) => number): XY[] {
  const out: XY[] = []
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length], fa = f(a), fb = f(b)
    if (fa >= 0) out.push(a)
    if ((fa >= 0) !== (fb >= 0)) {
      const t = fa / (fa - fb)
      out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t])
    }
  }
  return out
}
const area = (r: XY[]) => r.reduce((s, p, i) => { const q = r[(i + 1) % r.length]; return s + p[0] * q[1] - q[0] * p[1] }, 0) / 2

/**
 * The stepped crown: the roof steps down from the two acute ends (the stone
 * piers) toward the right-angle corner, a serration or two per step (jkliu,
 * ne). In the tower's own corner coordinates u and v (metres from the
 * corner along each leg, Lu and Lv long), the region max(u/Lu, v/Lv) >= tau
 * rises highest; it is drawn as two half-plane pieces per tier.
 */
function stepped(p: Part, ring: XY[], H: number, drop: number, uv: (q: XY) => [number, number], Lu: number, Lv: number, K = 8) {
  const z = (k: number) => H - drop * (1 - k / K)
  prism(p, ring, 0, z(0), roof, 0)
  for (let k = 1; k <= K; k++) {
    const tau = k / (K + 1)
    const A = clip(ring, (q) => uv(q)[0] - tau * Lu) // u >= tau Lu
    const Bv = clip(clip(ring, (q) => uv(q)[1] - tau * Lv), (q) => tau * Lu - uv(q)[0]) // v >= tau Lv, u < tau Lu
    for (const r of [A, Bv]) if (r.length >= 3 && Math.abs(area(r)) > 1) prism(p, r, z(k - 1) - 0.05, z(k), roof, 0)
  }
}
// South Tower: right angle at the south-east corner; legs run west and north.
const SC: XY = [36.17, -57.11]
stepped(gold, SOUTH, SOUTH_H, 0.32 * SOUTH_H, (q) => [SC[0] - q[0], q[1] - SC[1]], 55.4, 67.9)
// North Tower: right angle at the north-west corner; legs run east and south.
const NC: XY = [-39.03, 54.69]
stepped(gold, NORTH, NORTH_H, 0.3 * NORTH_H, (q) => [q[0] - NC[0], NC[1] - q[1]], 57.2, 57.6)

// The stone piers at the acute ends.
const PIERS: [XY[], number][] = [
  [[[26.47, 7.69], [30.37, 3.99], [31.17, 4.59], [31.22, 10.19], [29.67, 10.79]], SOUTH_H],
  [[[-19.18, -40.07], [-13.8, -39.86], [-13.18, -39.16], [-16.33, -35.59], [-19.03, -38.6]], SOUTH_H],
  [[[14.39, 43.87], [18.05, 47.61], [18.13, 49.51], [12.84, 49.39]], NORTH_H],
  [[[-33.31, -2.83], [-32.09, -2.95], [-28.44, 0.7], [-33.35, 2.57]], NORTH_H],
]
for (const [ring, h] of PIERS) prism(pier, offset(ccw(ring), 0.25), 0, h + 2, pier, 0.3)

// The banking hall: dark glass, its roof in glass steps rising from the
// middle toward each tower (jkliu, ne). Bands run along the hall, parallel
// to the towers' stepped inner faces (45 degrees in this frame).
const hallRing = offset(ATRIUM, -0.4)
{
  const w = (q: XY) => (q[0] - q[1]) / Math.SQRT2
  const ws = hallRing.map(w), wc = (Math.min(...ws) + Math.max(...ws)) / 2
  const bands: [number, number, number][] = [[-5.5, 5.5, 34], [5.5, 11, 38.5], [-11, -5.5, 38.5], [11, 99, 43], [-99, -11, 43]]
  for (const [a, b, h] of bands) {
    const r = clip(clip(hallRing, (q) => w(q) - (wc + a)), (q) => wc + b - w(q))
    if (r.length >= 3 && Math.abs(area(r)) > 1) prism(hall, r, 0, h, hall, 0.3)
  }
}

const lit = (_p: V3, n: V3) => (n[2] > 0.8 ? 0.1 : 0.45)
await save('tor-royal-bank-plaza', 'Royal Bank Plaza', [
  { part: gold, material: { ...PALETTE.window, color: 0xd4b57c } },
  { part: pier, material: { ...finish('rbp-stone', 0xe6e2da), floodlight: lit } },
  { part: roof, material: PALETTE.roof },
  { part: hall, material: { ...PALETTE.glass, color: 0x74889a } },
], { anchor: [43.6465369, -79.3800414], bearing: 343.3 }, 6500)
