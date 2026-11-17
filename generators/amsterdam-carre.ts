/**
 * Koninklijk Theater Carré, Amsterdam — procedural, CC0-1.0, no textures.
 * bun generators/amsterdam-carre.ts
 *
 * The 1887 circus theatre on the Amstel (J.P.F. van Rossem and W.J. Vuyk):
 * a 37 m stuccoed front of three storeys over a dark rusticated ground
 * floor, a projecting central bay with a columned loggia and a pediment
 * rising into the roof, and behind it the great curved zinc roof over the
 * circus hall, rounded down to the front cornice, with a glazed band behind
 * the pediment and the box carrying the red CARRÉ sign on top. Behind the
 * hall, along the Onbekendegracht, the grey-brick stage house of the 1990s
 * renovation, with a glazed top storey.
 *
 * Map frame: x = model east (bearing 163.2°, upstream), y = model north
 * (bearing 73.2°, away from the Amstel), z up, metres. The Amstel front
 * faces −y. Placed at bearing 73.2° (the outline's long edges). Anchor: the
 * outline's area centroid moved 2.45 m along x onto the axis of symmetry
 * (the centre of the front and of its central bay), so the front mirrors
 * about x = 0.
 *
 * Evidence
 * - OSM way/269000174 (building=yes, Amstel 115–125, start_date 1887,
 *   architect J.P.F. van Rossem; W.J. Vuyk; ref:bag 0363100012165489), no
 *   building:parts. Front 37 m (x −18.55…18.45), central bay projecting
 *   1.9 m, 8.1 m wide; north annex, stage house and rear range from its
 *   steps.
 * - 3D BAG (3dbag.nl, CC BY 4.0, TU Delft / 3DGI), NL.IMBAG.Pand.
 *   0363100012165489, LoD2.2 roof surfaces from AHN lidar, sampled on a
 *   1–3 m grid in this frame (ground NAP +0.26): front cornice 20.2; the
 *   hall roof rising to 28.5 at x ≈ 0, a barrel across x (22.1 at x 16.5,
 *   24.6 at x −13.5) rounded down to the front (22.8 at y −27, 24.8 at
 *   y −24, 26.2 at −21, 27.3 at −18); sign box 31.9 (x −4.5…5, y −6…−3);
 *   stage house flat at 28.5 (y 3…21); rear range 22.5; north annex 21.5
 *   with a lower front part (8.9–10.4); south-east corner 6.1. A 32–39 m
 *   ramp in one column at x −16.5 is a reconstruction artefact and is
 *   ignored (no photo shows anything there).
 * - Photos (Wikimedia Commons, all EVIDENCE):
 *   - C messier, "Carre Theatre 2038.jpg", CC BY-SA 4.0 — the front
 *     straight on across the Amstel: storeys, bays, roof, sign box.
 *     https://commons.wikimedia.org/wiki/File:Carre_Theatre_2038.jpg
 *   - Andreas Praefcke, "Amsterdam Carré Amstelsluizen.jpg", CC BY 3.0 —
 *     from the south-west: the roof's rounded front, glazed band.
 *     https://commons.wikimedia.org/wiki/File:Amsterdam_Carr%C3%A9_Amstelsluizen.jpg
 *   - Andreas Praefcke, "Amsterdam Carré entrance at night.jpg", CC BY 3.0
 *     — the loggia columns, floodlit front, lit entrance.
 *     https://commons.wikimedia.org/wiki/File:Amsterdam_Carr%C3%A9_entrance_at_night.jpg
 *   - Jvhertum, "Onbekendegracht carre.jpg", CC BY-SA 3.0 — the stage house
 *     from the Onbekendegracht: grey brick, dark recesses, glazed top.
 *     https://commons.wikimedia.org/wiki/File:Onbekendegracht_carre.jpg
 *   - Txllxt TxllxT, "Amsterdam - Amstel - Hoge Sluis - View North towards
 *     Carré Theatre.jpg", CC BY-SA 4.0 — from the south, distant.
 *     https://commons.wikimedia.org/wiki/File:Amsterdam_-_Amstel_-_Hoge_Sluis_-_View_North_towards_Carr%C3%A9_Theatre.jpg
 * - Estimated from C messier's front view scaled to the 3D BAG cornice
 *   (21.5 px/m): ground storey 4.4 m, frieze 12.6–13.8, upper windows
 *   14.8–17.0, piano nobile windows 6.0–9.6, four bays of 3.1 m each side,
 *   pediment apex 23.6, the glazed roof band 17 m wide.
 *
 * Colour: cream stucco (the palette's stone), the ground floor dark
 * grey-brown, the roof pale green-grey zinc, the stage house grey brick.
 *
 * Night: the front is floodlit from the canopy (Praefcke's night photo);
 * windows and the entrance glow; the sign is red neon.
 *
 * Doubts: the north annex (on the Nieuwe Prinsengracht) has no photo; its
 * window panels are generic. The side walls of the hall are hidden by neighbours in every
 * photo and are drawn plain; the stage house's north side (white stepped
 * piers in Jvhertum's photo) is simplified to a plain grey block; the
 * clown heads, statues, the frieze lettering and the balconies' railings
 * are left out; the sign's letters are a plain red panel.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { finishModel, prism, quadN, unit, type XY } from './nyc-570-lexington'
import { rectPanel, archPanel, block, column } from './nyc-city-hall'

const stucco = new Part(), dark = new Part(), zinc = new Part(), win = new Part(), glass = new Part(), neon = new Part()

const FX = 18.5, FY = -30.3 // front half width and line
const BACK = 3 // the hall ends here; the stage house runs on
const ridge = 28.5, k = 0.0235
/** The hall roof: a barrel across x rounded down to the front. */
const roofZ = (x: number, y: number) => ridge - k * (x * x + Math.max(0, -(y + 12)) ** 2 * 1.056)
const roofN = (x: number, y: number): V3 => unit([2 * k * x, 2 * k * Math.max(0, -(y + 12)) * -1.056 * -1, 1])

// ---------------------------------------------------------------- hall walls
const hall: XY[] = [[-FX, FY], [FX, FY], [FX, BACK], [-FX, BACK]]
prism({ wall: stucco, win: null, roof: null, ring: hall, z0: 0, z1: 20.2, facade: null, bevel: 0.4 })
// Dark rusticated ground storey, a skin 0.08 m proud on the front and sides.
for (const [a, b] of [[[-FX - 0.08, FY - 0.08], [FX + 0.08, FY - 0.08]], [[FX + 0.08, FY - 0.08], [FX + 0.08, BACK]], [[-FX - 0.08, BACK], [-FX - 0.08, FY - 0.08]]] as [XY, XY][]) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n: V3 = [(b[1] - a[1]) / L, -(b[0] - a[0]) / L, 0]
  quadN(dark, [a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], 4.4], [a[0], a[1], 4.4], [n, n, n, n])
}
// Bands: balcony course over the ground storey, frieze, main cornice.
function bandY(p: Part, x0: number, x1: number, y: number, z0: number, z1: number, d: number) {
  block(p, x0, y - d, x1, y + 0.01, z0, z1)
}
bandY(stucco, -FX - 0.3, FX + 0.3, FY, 4.4, 4.95, 0.5)
bandY(stucco, -FX - 0.15, FX + 0.15, FY, 12.6, 13.8, 0.25)
for (const s of [-1, 1]) block(stucco, s > 0 ? FX - 0.01 : -FX - 0.15, FY - 0.25, s > 0 ? FX + 0.15 : -FX + 0.01, BACK, 12.6, 13.8)
bandY(stucco, -FX - 0.55, FX + 0.55, FY, 19.6, 20.45, 0.6)
for (const s of [-1, 1]) {
  block(stucco, s > 0 ? FX - 0.01 : -FX - 0.55, FY - 0.6, s > 0 ? FX + 0.55 : -FX + 0.01, BACK, 19.6, 20.45)
  block(stucco, s > 0 ? FX - 0.01 : -FX - 0.3, FY - 0.5, s > 0 ? FX + 0.3 : -FX + 0.01, BACK, 4.4, 4.95)
}

// ---------------------------------------------------------------- front bays
const front: [XY, XY] = [[-FX, FY], [FX, FY]]
const bayX = [6.45, 9.55, 12.65, 15.75]
for (const s of [-1, 1]) {
  // Pilasters: corner and inner, plus between bays above the ground storey.
  for (const [c, w] of [[s * 17.9, 1.2], [s * 4.5, 0.9], ...[8.0, 11.1, 14.2].map((x) => [s * x, 0.45])] as [number, number][])
    block(stucco, c - w / 2, FY - 0.25, c + w / 2, FY + 0.01, 4.95, 19.6)
  for (const x of bayX) {
    const c = s * x + FX // along-wall position from a = (−FX, FY)
    archPanel(win, front[0], front[1], c, 1.8, 0.4, 3.6, 0.13, 8)
    rectPanel(win, front[0], front[1], c, 1.45, 6.0, 9.6, 0.05)
    rectPanel(win, front[0], front[1], c, 1.45, 14.8, 17.0, 0.05)
    // Window heads: a small pediment-like cap over the piano nobile.
    block(stucco, s * x - 1.0, FY - 0.2, s * x + 1.0, FY + 0.01, 9.8, 10.3)
  }
}

// ---------------------------------------------------------------- central bay
const CB = 4.05, CY = -32.2
prism({ wall: stucco, win: null, roof: null, ring: [[-CB, CY], [CB, CY], [CB, FY + 0.1], [-CB, FY + 0.1]], z0: 0, z1: 20.45, facade: null, bevel: 0.3 })
{
  const cf: [XY, XY] = [[-CB, CY], [CB, CY]]
  // Ground storey: dark, with the lit entrance.
  quadN(dark, [-CB - 0.06, CY - 0.06, 0], [CB + 0.06, CY - 0.06, 0], [CB + 0.06, CY - 0.06, 4.4], [-CB - 0.06, CY - 0.06, 4.4])
  rectPanel(win, cf[0], cf[1], CB, 4.2, 0, 3.4, 0.12)
  block(stucco, -CB - 0.5, CY - 1.4, CB + 0.5, CY + 0.01, 4.4, 5.0) // balcony
  // The loggia: a recess 1.2 m deep, two columns in front of it.
  block(win, -2.6, CY - 0.03, 2.6, CY + 0.2, 5.0, 12.6)
  for (const s of [-1, 1]) column(stucco, s * 2.55, CY - 0.55, 0.42, 5.0, 12.6, { n: 10 })
  bandY(stucco, -CB - 0.25, CB + 0.25, CY, 12.6, 13.8, 0.4)
  rectPanel(win, cf[0], cf[1], CB, 3.6, 14.8, 17.0, 0.05)
  bandY(stucco, -CB - 0.65, CB + 0.65, CY, 19.6, 20.45, 0.7)
  // Pediment, set against the roof; its roof slopes run back into the hall roof.
  const yP = CY - 0.4, apex = 23.8
  stucco.tri([-CB - 0.5, yP, 20.45], [CB + 0.5, yP, 20.45], [0, yP, apex])
  const yR = -25.5
  for (const s of [-1, 1]) {
    const a: V3 = [s * (CB + 0.6), yP - 0.1, 20.35], b: V3 = [0, yP - 0.1, apex + 0.15], c: V3 = [0, yR, roofZ(0, yR) - 0.1], d: V3 = [s * (CB + 0.6), yR, 20.35]
    const n = unit([s * 0.8, 0, 1])
    if (s > 0) quadN(zinc, a, d, c, b, [n, n, n, n]); else quadN(zinc, a, b, c, d, [n, n, n, n])
  }
  // A tympanum disc (the coat of arms) reads as a darker oval.
}

// ---------------------------------------------------------------- hall roof
{
  const nx = 14, ny = 12, y0 = FY - 0.5, y1 = BACK, x0 = -FX - 0.5, x1 = FX + 0.5
  const P = (i: number, j: number): V3 => { const x = x0 + ((x1 - x0) * i) / nx, y = y0 + ((y1 - y0) * j) / ny; return [x, y, Math.max(20.3, roofZ(x, y))] }
  const N = (p: V3) => unit([2 * k * p[0], -2 * k * 1.056 * Math.max(0, -(p[1] + 12)), 1])
  for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) {
    const a = P(i, j), b = P(i + 1, j), c = P(i + 1, j + 1), d = P(i, j + 1)
    zinc.tri(a, b, c, undefined, undefined, undefined, [N(a), N(b), N(c)])
    zinc.tri(a, c, d, undefined, undefined, undefined, [N(a), N(c), N(d)])
  }
  // Close the barrel's back end (mostly inside the stage house).
  for (let i = 0; i < nx; i++) {
    const a = P(i, ny), b = P(i + 1, ny)
    stucco.tri([a[0], BACK, 20.2], [b[0], BACK, 20.2], b)
    stucco.tri([a[0], BACK, 20.2], b, a)
  }
  // Glazed band behind the pediment: a panel lying on the roof.
  const gx = 8.5, gy0 = -29.3, gy1 = -21.0, m = 6, my = 4
  const q = (x: number, y: number): V3 => { const n = N([x, y, 0]); const z = roofZ(x, y); return [x + n[0] * 0.1, y + n[1] * 0.1, z + n[2] * 0.1] }
  for (let i = 0; i < m; i++) for (let j = 0; j < my; j++) {
    const xa = -gx + (2 * gx * i) / m, xb = -gx + (2 * gx * (i + 1)) / m
    const ya = gy0 + ((gy1 - gy0) * j) / my, yb = gy0 + ((gy1 - gy0) * (j + 1)) / my
    glass.quad(q(xa, ya), q(xb, ya), q(xb, yb), q(xa, yb))
  }
  void roofN
}
// The sign box on the crown, with the red CARRÉ panel on its front and back.
block(stucco, -4.75, -7.2, 4.75, -2.6, 26.0, 31.9)
block(stucco, -4.95, -7.4, 4.95, -2.4, 31.9, 32.3)
for (const [y, s] of [[-7.25, -1], [-2.55, 1]] as [number, number][]) {
  const a: V3 = [-3.6 * -s, y + s * 0.04, 29.9], b: V3 = [3.6 * -s, y + s * 0.04, 29.9]
  neon.quad(a, b, [b[0], b[1], 31.2], [a[0], a[1], 31.2])
}

// ---------------------------------------------------------------- stage house and annexes
const greyFacade = { bay: 4.2, ratio: 0.18, floor: 3.4, group: 6, spandrel: 0, sill: 1.0, head: 4.6 }
prism({ wall: dark, win: null, roof: zinc, ring: [[-16, BACK - 0.5], [16.5, BACK - 0.5], [16.5, 21], [-16, 21]], z0: 0, z1: 28.5, facade: null, bevel: 0.4 })
// Glazed top storey of the stage house, on its three outer faces.
for (const [a, b] of [[[16.5, BACK + 3], [16.5, 21]], [[16.5, 21], [-16, 21]], [[-16, 21], [-16, BACK + 3]]] as [XY, XY][]) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  rectPanel(win, a, b, L / 2, L - 1.6, 24.4, 27.6, 0.06)
}
prism({ wall: dark, win: null, roof: zinc, ring: [[-20.45, 21], [18.65, 21], [18.65, 28], [-20.45, 28]], z0: 0, z1: 22.5, facade: null, bevel: 0.4 })
// Rear: the dark recesses between the brick piers, grouped as tall panels.
for (let i = 0; i < 7; i++) {
  const c = 3.0 + i * 5.6
  rectPanel(win, [18.65, 28], [-20.45, 28], c, 1.4, 3.0, 19.5, 0.06)
}
prism({ wall: dark, win: null, roof: zinc, ring: [[-27.25, -6.6], [-18.6, -6.6], [-18.6, 24.9], [-27.25, 24.9]], z0: 0, z1: 21.5, facade: null, bevel: 0.4 })
prism({ wall: dark, win: null, roof: zinc, ring: [[-21.95, -15.5], [-18.6, -15.5], [-18.6, -6.6], [-21.95, -6.6]], z0: 0, z1: 10.4, facade: null, bevel: 0.3 })
prism({ wall: dark, win: null, roof: zinc, ring: [[18.55, 17.5], [23.0, 17.5], [24.4, 21.6], [23.0, 25.8], [18.55, 25.8]], z0: 0, z1: 6.1, facade: null, bevel: 0.3 })
for (const [a, b] of [[[-27.25, -6.6], [-18.6, -6.6]], [[-27.25, 24.9], [-27.25, -6.6]]] as [XY, XY][]) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.round(L / 4.2))
  for (let i = 0; i < n; i++) { rectPanel(win, a, b, (L * (i + 0.5)) / n, 1.5, 3.0, 9.5, 0.06); rectPanel(win, a, b, (L * (i + 0.5)) / n, 1.5, 11.5, 18.5, 0.06) }
}
void greyFacade

// ---------------------------------------------------------------- write
const flood = (p: V3, n: V3) => (n[1] < -0.5 && p[1] < -29 && p[2] < 21 ? 0.7 : 0)
finishModel('Koninklijk Theater Carré', 'amsterdam-carre', [
  { part: stucco, material: { ...PALETTE.stone, floodlight: flood } },
  { part: dark, material: finish('carre-grey', 0x847d77) },
  { part: zinc, material: finish('carre-zinc', 0xa4aca3) },
  { part: win, material: PALETTE.window },
  { part: glass, material: { ...PALETTE.glass, color: 0x7f98ad } },
  { part: neon, material: finish('neon-carre-red', 0xc23a33) },
], { bearing: 73.2, osm: 'way/269000174', height: 32.3 })
