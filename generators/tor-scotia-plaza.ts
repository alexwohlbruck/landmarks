/**
 * Scotia Plaza, Toronto (1988, WZMH Architects) — the 68-storey tower in
 * red granite with its two glass-roofed atria. Original procedural
 * geometry, CC0-1.0.
 * bun generators/tor-scotia-plaza.ts
 *
 * Frame: x east-north-east +, y north-north-west +, z up, metres; origin at
 * the anchor on the ground. Bearing 343.3 (the Toronto street grid; the OSM
 * outline runs within about 1 degree of it). Anchor = area centroid of the
 * tower outline OSM way/366234303: -79.3795534, 43.6494821.
 *
 * Identity (from the photos):
 *  1. A tall dark-red granite shaft, its long east and west faces broad,
 *     its north-west and south-east corners stepped in a sawtooth, so the
 *     plan reads as a notched parallelogram (chevron).   (jkliu, cn, simonp)
 *  2. The stepped V notch cut into the top of each long face, about 48 m
 *     deep and stepping in 8 m stairs, lined with copper-tinted glass.
 *                                                       (jkliu, simonp, cn)
 *  3. The red Scotiabank "S" high on the narrow faces, lit at night.
 *                                                   (jkliu, simonp, lundnt)
 *  4. Punched windows in the granite: drawn as grouped panels, three
 *     storeys a band, with wide granite piers and spandrels.        (jkliu)
 *
 * Plan: OSM, turned into this frame and used as drawn:
 *  - way/141694075 (tower part, 274.9 m, 68 levels): the shaft;
 *  - way/951711673-951711694 (22 parts, 4 m deep, 2.9 m wide, 227-267 m in
 *    8 m steps): the V notch in the east and west faces; the tower part's
 *    inner wall behind them is the notch's glass;
 *  - way/951711671, way/951711672 (6 levels): the low granite infill in the
 *    stepped NW and SE corners of the outline, drawn 25 m (estimated, 6
 *    storeys);
 *  - way/366568729 (building=roof, glass, south, toward King Street: the
 *    banking-hall wedge) and way/366570218 (building=roof, glass, north):
 *    the glass-roofed halls against the tower's narrow faces, drawn as glass
 *    wedges falling from 26 m at the tower to 18 m at the street.
 * Heights (no lidar in Canada):
 *  - published: 275 m, 68 storeys (Wikipedia, "Scotia Plaza"; CTBUH).
 *  - OSM: tower 274.9; notch steps 227, 235, 243, 251, 259, 267.
 *  - City of Toronto 3D Massing 2025 (https://open.toronto.ca/dataset/3d-massing/):
 *    tower 276.6; notch tiers 225, 233, 241, 249, 257, 266 (same plan as
 *    OSM); the south hall 22.8 m, the north hall 20.5 m (flat tiers). Used:
 *    275 and OSM's steps.
 *  - estimated: the halls' slope (26 to 18 m, so the mean matches the
 *    massing; no licensed photo of them was found); the corner infill 25 m;
 *    the logo 6.6 m across, its centre 5 m under the roof (from jkliu).
 *  - ground: Mapterhorn z15 within about 1 m over the site; elevation 0.
 * Facade: punched windows about 2.2 m apart in jkliu; grouped here as
 * panels 2.6 m wide per 4.4 m bay, 8 m tall per 12 m band.
 *
 * Colours: the granite a deep red-brown in jkliu and simonp, pulled to the
 * palette's lightness; the punched windows dark bronze; the notch glass
 * darker and copper-tinted (it reads as a dark V in cn and simonp); the halls
 * grey-blue glass; the logo Scotiabank red.
 * Night: the offices glow (window, window-2), the S logo is neon (lundnt);
 * the granite is not floodlit (lundnt) and the halls stay dark (glass).
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  jkliu  "Scotia Plaza 2025-05-24 (cropped).jpg", JK Liu, CC BY-SA 4.0 — the
 *         long west face with the V notch and the narrow south face, from high up.
 *         https://commons.wikimedia.org/wiki/File:Scotia_Plaza_2025-05-24_(cropped).jpg
 *  simonp "Scotia Plaza 2009.JPG", SimonP, CC BY-SA 3.0 — from the street, the
 *         notch and the S logo.
 *         https://commons.wikimedia.org/wiki/File:Scotia_Plaza_2009.JPG
 *  cn     "Toronto-Dominion Centre and Scotia Plaza from CN Tower, Toronto,
 *         Ontario (21652084160).jpg", Ken Lund, CC BY-SA 2.0 — from the
 *         south-west and above: the V notch against the skyline.
 *         https://commons.wikimedia.org/wiki/File:Toronto-Dominion_Centre_and_Scotia_Plaza_from_CN_Tower,_Toronto,_Ontario_(21652084160).jpg
 *  tdc    "Scotia Bank Plaza as seen from Toronto Dominion Centre.jpg",
 *         Maksims Sokolov (maxergon.com), CC BY-SA 4.0 — the notch's steps (black and white).
 *         https://commons.wikimedia.org/wiki/File:Scotia_Bank_Plaza_as_seen_from_Toronto_Dominion_Centre.jpg
 *  lundnt "Scotia Plaza, Toronto, Ontario (21814386916).jpg", Ken Lund,
 *         CC BY-SA 2.0 — at night: lit offices and the red S.
 *         https://commons.wikimedia.org/wiki/File:Scotia_Plaza,_Toronto,_Ontario_(21814386916).jpg
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the two glass halls (their slope and walls are estimated; no
 * licensed photo shows them); the logo is drawn as a red disc, not the S;
 * the window grid is grouped, not punched.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { capPoly, ccw, edgePanels, prism, save, type XY } from './atl-flatiron-building'

const granite = new Part(), win = new Part(), notch = new Part(), roof = new Part(), hall = new Part(), logo = new Part()

const TOP = 275, CORNER = 25
const TOWER: XY[] = [[14.67, 28.04], [18.48, 28.11], [18.30, 35.67], [14.21, 35.57], [14.11, 39.59], [3.85, 39.35], [3.96, 35.29], [0.03, 35.20], [0.14, 31.43], [-4.26, 31.33], [-4.16, 27.43], [-7.91, 27.35], [-7.79, 22.80], [-12.01, 22.70], [-11.89, 18.18], [-15.93, 18.09], [-15.84, 14.63], [-20.04, 14.60], [-20.00, 8.15], [-15.83, 8.14], [-15.59, -26.20], [-19.73, -26.20], [-19.70, -32.45], [-15.44, -32.53], [-15.39, -36.46], [-4.74, -36.53], [-4.72, -32.38], [-0.81, -32.38], [-0.75, -28.95], [3.03, -29.01], [3.08, -24.70], [7.32, -24.77], [7.36, -20.65], [11.22, -20.70], [11.27, -16.65], [15.25, -16.67], [15.22, -12.97], [19.10, -12.99], [19.03, -6.28], [14.97, -6.25]]
const P71: XY[] = [[-20.04, 14.60], [-15.84, 14.63], [-15.93, 18.09], [-11.89, 18.18], [-12.01, 22.70], [-7.79, 22.80], [-7.91, 27.35], [-20.28, 27.19]]
const P72: XY[] = [[19.10, -12.99], [15.22, -12.97], [15.25, -16.67], [11.27, -16.65], [11.22, -20.70], [7.36, -20.65], [7.32, -24.77], [3.08, -24.70], [3.03, -29.01], [-0.75, -28.95], [-0.81, -31.00], [19.56, -31.23]]
const RS: XY[] = [[-19.31, -56.01], [15.05, -55.92], [15.17, -49.12], [19.35, -49.01], [19.56, -31.23], [-0.81, -31.00], [-0.81, -32.38], [-4.72, -32.38], [-4.74, -36.53], [-15.39, -36.46], [-15.44, -32.53], [-19.70, -32.45]]
const RN: XY[] = [[-19.82, 59.23], [-19.66, 27.20], [-4.16, 27.43], [-4.26, 31.33], [0.14, 31.43], [0.03, 35.20], [3.96, 35.29], [3.85, 39.35], [14.11, 39.59], [14.21, 35.57], [18.30, 35.67], [18.48, 28.11], [27.43, 28.21], [27.77, 59.72]]
// The notch parts: [ring, height]. East face (x > 0) and west face.
const STRIPS: [XY[], number][] = ([
  [[[18.83, 8.26], [18.77, 14.01], [14.78, 14.04], [14.79, 8.25]], 227],
  [[[18.77, 14.01], [18.79, 16.87], [14.80, 16.85], [14.78, 14.04]], 235],
  [[[18.79, 16.87], [18.72, 19.69], [14.79, 19.69], [14.80, 16.85]], 243],
  [[[18.72, 19.69], [18.65, 22.55], [14.75, 22.52], [14.79, 19.69]], 251],
  [[[18.65, 22.55], [18.58, 25.37], [14.69, 25.35], [14.75, 22.52]], 259],
  [[[18.58, 25.37], [18.48, 28.11], [14.67, 28.04], [14.69, 25.35]], 267],
  [[[18.82, 5.42], [18.83, 8.26], [14.79, 8.25], [14.82, 5.40]], 235],
  [[[18.83, 2.49], [18.82, 5.42], [14.82, 5.40], [14.84, 2.47]], 243],
  [[[18.92, -0.33], [18.83, 2.49], [14.84, 2.47], [14.93, -0.39]], 251],
  [[[19.00, -3.27], [18.92, -0.33], [14.93, -0.39], [14.94, -3.25]], 259],
  [[[19.03, -6.28], [19.00, -3.27], [14.94, -3.25], [14.97, -6.25]], 267],
  [[[-19.81, -11.69], [-15.75, -11.76], [-15.76, -5.96], [-19.83, -5.90]], 227],
  [[[-19.83, -5.90], [-15.76, -5.96], [-15.72, -3.12], [-19.85, -3.08]], 235],
  [[[-19.85, -3.08], [-15.72, -3.12], [-15.74, -0.25], [-19.87, -0.22]], 243],
  [[[-19.87, -0.22], [-15.74, -0.25], [-15.79, 2.60], [-19.91, 2.60]], 251],
  [[[-19.91, 2.60], [-15.79, 2.60], [-15.81, 5.39], [-19.98, 5.43]], 259],
  [[[-19.98, 5.43], [-15.81, 5.39], [-15.83, 8.14], [-20.00, 8.15]], 267],
  [[[-19.84, -14.52], [-15.73, -14.58], [-15.75, -11.76], [-19.81, -11.69]], 235],
  [[[-19.84, -17.46], [-15.72, -17.49], [-15.73, -14.58], [-19.84, -14.52]], 243],
  [[[-19.77, -20.30], [-15.69, -20.30], [-15.72, -17.49], [-19.84, -17.46]], 251],
  [[[-19.74, -23.22], [-15.62, -23.21], [-15.69, -20.30], [-19.77, -20.30]], 259],
  [[[-19.73, -26.20], [-15.59, -26.20], [-15.62, -23.21], [-19.74, -23.22]], 267],
] as [XY[], number][]).map(([r, h]) => [ccw(r), h])

// The glass halls: wedges falling from the tower to the street.
const HALL_HI = 26, HALL_LO = 18
const rsZ = (q: XY) => HALL_LO + (HALL_HI - HALL_LO) * Math.min(1, Math.max(0, (q[1] + 56) / 24))
const rnZ = (q: XY) => HALL_HI - (HALL_HI - HALL_LO) * Math.min(1, Math.max(0, (q[1] - 28) / 31))

// ── what stands in front of a wall: for hiding windows behind lower blocks
const pip = (p: XY, poly: XY[]) => {
  let c = false
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j]
    if ((yi > p[1]) !== (yj > p[1]) && p[0] < ((xj - xi) * (p[1] - yi)) / (yj - yi) + xi) c = !c
  }
  return c
}
const solids: [XY[], (q: XY) => number][] = [
  [TOWER, () => TOP], [P71, () => CORNER], [P72, () => CORNER], [RS, rsZ], [RN, rnZ],
  ...STRIPS.map(([r, h]) => [r, () => h] as [XY[], (q: XY) => number]),
]
const inFront = (q: XY) => Math.max(0, ...solids.filter(([r]) => pip(q, r)).map(([, f]) => f(q)))

// ── the granite
prism(granite, TOWER, 0, TOP, roof, 0.5)
for (const [r, h] of STRIPS) prism(granite, r, 0, h, granite, 0.3)
prism(granite, ccw(P71), 0, CORNER, roof, 0.4)
prism(granite, ccw(P72), 0, CORNER, roof, 0.4)

// ── the notch glass: the tower's wall behind each notch step
for (const [r, h] of STRIPS) {
  const inner = r.filter((q) => Math.abs(q[0]) < 17).sort((a, b) => a[1] - b[1])
  const [a, b] = r[0][0] > 0 ? [inner[0], inner[1]] : [inner[1], inner[0]]
  edgePanels(notch, a, b, h, TOP - 0.7, { group: 1000, gap: 0, bay: 100, pier: 0, margin: 0, out: 0.06 })
}

// ── windows: bays of 4.4 m, bands of three storeys on one grid for the whole tower
const Z0 = 9, G = 12, GAP = 4, LOBBY: [number, number] = [0.4, 6.4]
function facade(a: XY, b: XY, zlo: number, zhi: number, bay = 4.4, pier = 1.8, margin = 1.0) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  if (L < 2.5) return
  const n = Math.max(1, Math.round((L - 2 * margin) / bay))
  const nb = Math.min(n, Math.max(1, Math.floor((L - 2 * margin) / 2)))
  for (let k = 0; Z0 + (k + 1) * G <= zhi + GAP / 2; k++) {
    const za = Z0 + k * G + GAP / 2, zb = Z0 + (k + 1) * G - GAP / 2
    if (za < zlo) continue
    edgePanels(win, a, b, za, zb, { group: 100, gap: 0, bay: (L - 2 * margin) / nb, pier, margin, out: 0.06 })
  }
  if (zlo <= 0.01) edgePanels(win, a, b, LOBBY[0], LOBBY[1], { group: 100, gap: 0, bay: (L - 2 * margin) / nb, pier: pier * 0.6, margin, out: 0.06 })
}
function dress(ring: XY[], top: number) {
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), nx = (b[1] - a[1]) / L, ny = -(b[0] - a[0]) / L
    const m: XY = [(a[0] + b[0]) / 2 + nx * 0.4, (a[1] + b[1]) / 2 + ny * 0.4]
    const zlo = inFront(m)
    if (zlo >= top - 4) continue
    facade(a, b, zlo, top - 3)
  }
}
dress(TOWER, TOP)
for (const [r, h] of STRIPS) dress(r, h)
dress(ccw(P71), CORNER)
dress(ccw(P72), CORNER)

// ── the glass halls
const zShim = (p: Part, f: (q: XY) => number) => ({ tri: (a: V3, b: V3, c: V3) => p.tri([a[0], a[1], f([a[0], a[1]])], [b[0], b[1], f([b[0], b[1]])], [c[0], c[1], f([c[0], c[1]])]) }) as unknown as Part
for (const [ring0, f] of [[RS, rsZ], [RN, rnZ]] as [XY[], (q: XY) => number][]) {
  const ring = ccw(ring0)
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), nx = (b[1] - a[1]) / L, ny = -(b[0] - a[0]) / L
    if (pip([(a[0] + b[0]) / 2 + nx * 0.4, (a[1] + b[1]) / 2 + ny * 0.4], TOWER)) continue
    hall.quad([a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], f(b)], [a[0], a[1], f(a)])
  }
  capPoly(zShim(hall, f), ring, 0, true)
}

// ── the Scotiabank logo near the top of each narrow face
function disc(p: Part, c: XY, t: XY, nrm: XY, z: number, r: number) {
  const n = 16, out = 0.1
  const P = (k: number): V3 => {
    const a = (k / n) * Math.PI * 2
    return [c[0] + t[0] * r * Math.cos(a) + nrm[0] * out, c[1] + t[1] * r * Math.cos(a) + nrm[1] * out, z + r * Math.sin(a)]
  }
  const C: V3 = [c[0] + nrm[0] * out, c[1] + nrm[1] * out, z]
  for (let k = 0; k < n; k++) p.tri(C, P(k), P(k + 1))
}
for (const [a, b] of [[[-15.39, -36.46], [-4.74, -36.53]], [[14.11, 39.59], [3.85, 39.35]]] as [XY, XY][]) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], nrm: XY = [t[1], -t[0]]
  const s = L - 4.2
  disc(logo, [a[0] + t[0] * s, a[1] + t[1] * s], t, nrm, TOP - 5, 3.3)
}

if (import.meta.main) {
  await save('tor-scotia-plaza', 'Scotia Plaza', [
    { part: granite, material: finish('scotia-granite', 0x8f4a44) },
    { part: win, material: { ...PALETTE.window, color: 0x5e5052 } },
    { part: notch, material: windowVariant(2, 0x6f504c) },
    { part: roof, material: PALETTE.roof },
    { part: hall, material: { ...PALETTE.glass, color: 0x7e8f9c } },
    { part: logo, material: finish('neon-scotia-red', 0xd2333b) },
  ], { anchor: [43.6494821, -79.3795534], bearing: 343.3 }, 6500)
}
