/**
 * Portuguese Synagogue (Esnoga), Amsterdam — procedural, CC0-1.0, no textures.
 * bun generators/amsterdam-portuguese-synagogue.ts
 *
 * Elias Bouman's synagogue of 1671–1675 on the Mr. Visserplein: a great
 * brick block, 38 × 28 m and 20 m to its cornice, divided by buttress-like
 * brick pilasters, with two tiers of windows (tall round-arched below,
 * rectangular above), a cream stone frieze and cornice, and a balustrade
 * with urns that hides the roof: three parallel slate roofs over the three
 * wooden barrel vaults of the nave and aisles, hipped at the ends. Raised
 * attics with an oculus crown the short fronts. Round its courtyard stand
 * the low brick annexes (the houses, offices, the Ets Haim library and the
 * winter synagogue) under dark tiled roofs, with the stone entrance gate.
 *
 * Map frame: x = model east (bearing 118.7°, the long axis), y = model
 * north (bearing 28.7°), z up, metres. Placed at bearing 28.7° (the
 * outline's short edges, 28.7°/118.5°). Anchor: the synagogue outline's
 * area centroid, which lies on its axes (the outline is symmetric about
 * y = 0 and, but for the east corner blocks, about x ≈ −0.7).
 * y = 0 is the lowest ground (NAP +0.82, by the annexes); the synagogue's
 * own forecourt is about 0.9 m higher (3D BAG), which the walls simply run
 * down through.
 *
 * Evidence
 * - OSM way/57861363 (Portugese Synagoge, building=synagogue, ref:bag
 *   0363100012170255, wikidata Q1853707): the block x −20…18.6, y ±14.2,
 *   the 1.1 m pilaster notches at x −19.1, −8.0, 4.85, 16.0 and y ±7.1,
 *   ±13.4, the east corner blocks x 18.6…22.5, y ±(6.9…13.1).
 *   Annexes: way/268783384 (the C-shaped range round the west courtyard,
 *   1997 BAG date for its rebuilt part, 7.3 m), way/268783311 (north
 *   range, 5.8 m), way/268783350 (north-east, 8.1 m), way/268783415 (south
 *   range, 7.3 m); all share the complex's ground level in the 3D BAG.
 * - 3D BAG (3dbag.nl, CC BY 4.0, TU Delft / 3DGI), NL.IMBAG.Pand.
 *   0363100012170255, 0363100012170253, 0363100012170258, 0363100012170254,
 *   0363100012181882, LoD2.2 roofs from AHN lidar, sampled on a 2 m grid in
 *   this frame: the synagogue's parapet line 20.3; behind it three
 *   parallel ridges along x at y ≈ 10, 1 and −10 (24.2, 23.5, 24.0) with
 *   valleys at y ±6 (20.3), and a cross ridge at the west end; east
 *   blocks 17.7–20; annex ridges 6.3–6.8 (north), 8.5 (south-west range),
 *   6.5 (south-east), 7.0 (west wing), 8.2 (north-east block).
 * - Photos (Wikimedia Commons, all EVIDENCE):
 *   - Massimo Catarinella, "EsnogaAmsterdam.jpg", CC BY-SA 3.0 — the south
 *     side and the west end over the annex: pilasters, both window tiers,
 *     the cornice, balustrade and urns, the oculus attic.
 *     https://commons.wikimedia.org/wiki/File:EsnogaAmsterdam.jpg
 *   - A. Bakker, "Amsterdam - Portuguese Synagoge.jpg", CC BY 3.0 — the
 *     front over the annexes, the entrance gate, the attic with its oculus,
 *     the cream cornice and balustrade.
 *     https://commons.wikimedia.org/wiki/File:Amsterdam_-_Portuguese_Synagoge.jpg
 *   - Romeyn de Hooghe, "Exterieur van de nieuwe Portugese Synagoge te
 *     Amsterdam" (1675), public domain — the original elevations and plan.
 *     https://commons.wikimedia.org/wiki/File:Exterieur_van_de_nieuwe_Portugese_Synagoge_te_Amsterdam._NL-HlmNHA_53008850.JPG
 * - Estimated from the photos, scaled to the 3D BAG: brick to 18.2, frieze
 *   and cornice to 19.6, balustrade to 20.6 with urns to 21.6; arched
 *   windows 4.5–12.5, upper windows 13.5–17.2; three windows to each long
 *   bay, five across the short fronts; attics 3 m over the cornice.
 *
 * Colour: dark brown-red brick (#7a5650), cream stone dressings, dark slate
 * and black-glazed tiles.
 *
 * Night: the brick is floodlit; the windows glow (the synagogue is lit by
 * candles inside, and the windows show it).
 *
 * Doubts: the window count per bay is read from oblique photos; the oculus
 * attic is drawn on both short fronts (photographed on the west front);
 * the urns are simple blocks; the annexes' dormers and chimneys are left
 * out, and the west wing's roof is simplified to a hipped cap.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { finishModel, prism, quadN, unit, capPoly, type XY } from './nyc-570-lexington'
import { rectPanel, archPanel, discPanel, block, hipRoof } from './nyc-city-hall'

const brick = new Part(), stone = new Part(), slate = new Part(), win = new Part(), tile = new Part()

const X0 = -20, X1 = 18.6, Y0 = -14.2, Y1 = 14.2
const BRICK = 18.2, CORN = 19.6, BAL = 20.6

// ---------------------------------------------------------------- the block
prism({ wall: brick, win: null, roof: null, ring: [[X0, Y0], [X1, Y0], [X1, Y1], [X0, Y1]], z0: 0, z1: BRICK, facade: null, bevel: 0.3 })
// East corner blocks.
for (const s of [-1, 1]) {
  const ya = s > 0 ? 6.9 : -13.1, yb = s > 0 ? 13.1 : -6.9
  prism({ wall: brick, win: null, roof: slate, coping: stone, ring: [[X1 - 0.2, ya], [22.5, ya], [22.5, yb], [X1 - 0.2, yb]], z0: 0, z1: 17.7, facade: null, bevel: 0.3 })
  rectPanel(win, [22.5, ya], [22.5, yb], 3.1, 1.6, 13.5, 16.4, 0.05)
  rectPanel(win, [22.5, ya], [22.5, yb], 3.1, 1.6, 6.0, 11.0, 0.05)
}
// Pilasters: brick strips 1.2 wide, 0.6 proud, full height.
const longP = [-19.1, -8.0, 4.85, 16.0], shortP = [-13.4, -7.1, 7.1, 13.4]
for (const x of longP) for (const s of [-1, 1]) {
  const y = s > 0 ? Y1 : Y0
  block(brick, x - 0.65, s > 0 ? y - 0.01 : y - 0.7, x + 0.65, s > 0 ? y + 0.7 : y + 0.01, 0, BRICK)
}
for (const y of shortP) block(brick, X0 - 0.7, y - 0.65, X0 + 0.01, y + 0.65, 0, BRICK)
for (const y of [-7.1, 7.1]) block(brick, X1 - 0.01, y - 0.65, X1 + 0.7, y + 0.65, 0, BRICK)

// Windows: arched below, rectangular above; three to each long bay.
const longBays: [number, number][] = [[-19.1, -8.0], [-8.0, 4.85], [4.85, 16.0]]
for (const [a, b] of longBays) for (let k = 0; k < 3; k++) {
  const x = a + 0.65 + ((b - a - 1.3) * (k + 0.5)) / 3
  // South face runs +x (a → b), north face runs −x.
  archPanel(win, [X0, Y0], [X1, Y0], x - X0, 2.2, 4.5, 12.5, 0.05, 10)
  rectPanel(win, [X0, Y0], [X1, Y0], x - X0, 2.0, 13.5, 17.2, 0.05)
  archPanel(win, [X1, Y1], [X0, Y1], X1 - x, 2.2, 4.5, 12.5, 0.05, 10)
  rectPanel(win, [X1, Y1], [X0, Y1], X1 - x, 2.0, 13.5, 17.2, 0.05)
}
// West front: five bays (one in each outer bay, three in the middle).
for (const y of [-10.25, -3.6, 0, 3.6, 10.25]) {
  const s = Y1 - y // along the west face, which runs from (X0, Y1) to (X0, Y0)
  archPanel(win, [X0, Y1], [X0, Y0], s, 2.2, 4.5, 12.5, 0.05, 10)
  rectPanel(win, [X0, Y1], [X0, Y0], s, 2.0, 13.5, 17.2, 0.05)
}
// East end: the middle bay between the corner blocks.
for (const y of [-3.6, 0, 3.6]) {
  archPanel(win, [X1, Y0], [X1, Y1], y - Y0, 2.2, 4.5, 12.5, 0.05, 10)
  rectPanel(win, [X1, Y0], [X1, Y1], y - Y0, 2.0, 13.5, 17.2, 0.05)
}

// Frieze and cornice, round the block and over the pilasters.
function ringBand(r: XY[], z0: number, z1: number, d: number, p = stone) {
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L, nx = uy, ny = -ux
    const A: XY = [a[0] + (nx - ux) * d, a[1] + (ny - uy) * d], B: XY = [b[0] + (nx + ux) * d, b[1] + (ny + uy) * d]
    const n: V3 = [nx, ny, 0], up: V3 = [0, 0, 1], dn: V3 = [0, 0, -1]
    quadN(p, [A[0], A[1], z0], [B[0], B[1], z0], [B[0], B[1], z1], [A[0], A[1], z1], [n, n, n, n])
    quadN(p, [a[0], a[1], z1], [b[0], b[1], z1], [B[0], B[1], z1], [A[0], A[1], z1], [up, up, up, up])
    quadN(p, [A[0], A[1], z0], [B[0], B[1], z0], [b[0], b[1], z0], [a[0], a[1], z0], [dn, dn, dn, dn])
  }
}
const core: XY[] = [[X0, Y0], [X1, Y0], [X1, Y1], [X0, Y1]]
ringBand(core, BRICK, BRICK + 0.6, 0.75)
ringBand(core, BRICK + 0.6, CORN, 1.05)
// Balustrade: a solid rail set back on the cornice, pedestals with urns over the pilasters.
const bal: XY[] = [[X0 - 0.5, Y0 - 0.5], [X1 + 0.5, Y0 - 0.5], [X1 + 0.5, Y1 + 0.5], [X0 - 0.5, Y1 + 0.5]]
{
  const t = 0.35
  for (let i = 0; i < 4; i++) {
    const a = bal[i], b = bal[(i + 1) % 4]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L
    const nx = uy, ny = -ux
    const n: V3 = [nx, ny, 0], m: V3 = [-nx, -ny, 0], up: V3 = [0, 0, 1]
    const a2: XY = [a[0] - nx * t + ux * t, a[1] - ny * t + uy * t], b2: XY = [b[0] - nx * t - ux * t, b[1] - ny * t - uy * t]
    quadN(stone, [a[0], a[1], CORN], [b[0], b[1], CORN], [b[0], b[1], BAL], [a[0], a[1], BAL], [n, n, n, n])
    quadN(stone, [b2[0], b2[1], CORN], [a2[0], a2[1], CORN], [a2[0], a2[1], BAL], [b2[0], b2[1], BAL], [m, m, m, m])
    quadN(stone, [a[0], a[1], BAL], [b[0], b[1], BAL], [b2[0], b2[1], BAL], [a2[0], a2[1], BAL], [up, up, up, up])
  }
}
const pedestals: XY[] = [
  ...longP.flatMap((x) => [[x, Y0 - 0.5], [x, Y1 + 0.5]] as XY[]),
  ...[-7.1, 7.1].flatMap((y) => [[X0 - 0.5, y], [X1 + 0.5, y]] as XY[]),
  [X0 - 0.5, Y0 - 0.5], [X0 - 0.5, Y1 + 0.5], [X1 + 0.5, Y0 - 0.5], [X1 + 0.5, Y1 + 0.5],
]
for (const [x, y] of pedestals) {
  block(stone, x - 0.45, y - 0.45, x + 0.45, y + 0.45, CORN, BAL + 0.3)
  // Urn: a squat block on a neck.
  block(stone, x - 0.2, y - 0.2, x + 0.2, y + 0.2, BAL + 0.3, BAL + 0.55)
  block(stone, x - 0.38, y - 0.38, x + 0.38, y + 0.38, BAL + 0.55, BAL + 1.15)
}
// Oculus attics over the middle of both short fronts.
for (const [x, s] of [[X0, -1], [X1, 1]] as [number, number][]) {
  const xf = x + s * 0.45, xb = x - s * 2.0
  const a: XY = s < 0 ? [xf, 5.0] : [xf, -5.0], b: XY = s < 0 ? [xf, -5.0] : [xf, 5.0]
  const xa = Math.min(xf, xb), xc = Math.max(xf, xb)
  const r: XY[] = [[xa, -5], [xc, -5], [xc, 5], [xa, 5]]
  prism({ wall: brick, win: null, roof: slate, coping: stone, ring: r, z0: CORN - 0.2, z1: CORN + 3.0, facade: null, bevel: 0.25 })
  discPanel(stone, a, b, 5.0, CORN + 1.45, 1.05, 0.04, 14)
  discPanel(win, a, b, 5.0, CORN + 1.45, 0.75, 0.08, 14)
  ringBand(r, CORN + 2.7, CORN + 3.0, 0.2)
}

// ---------------------------------------------------------------- roofs behind the balustrade
// Three parallel slate roofs along x, hipped at the ends.
for (const [y0, y1, zr] of [[-13.2, -5.6, 24.0], [-5.6, 5.6, 23.5], [5.6, 13.2, 24.2]] as [number, number, number][]) {
  hipRoof(slate, X0 + 1.0, y0, X1 - 1.0, y1, BAL - 0.4, zr - BAL + 0.4)
}
capPoly(slate, core.map(([x, y]) => [x, y] as XY), CORN - 0.02)

// ---------------------------------------------------------------- annexes
/** A gabled brick range on a rectangle, ridge along its long side. */
function range(x0: number, y0: number, x1: number, y1: number, eave: number, ridge: number, hips = true) {
  prism({ wall: brick, win: null, roof: null, ring: [[x0, y0], [x1, y0], [x1, y1], [x0, y1]], z0: 0, z1: eave, facade: null, bevel: 0.2 })
  const o = 0.35
  if (hips) hipRoof(tile, x0 - o, y0 - o, x1 + o, y1 + o, eave - 0.15, ridge - eave + 0.15)
  // Cream eaves board.
  ringBand([[x0, y0], [x1, y0], [x1, y1], [x0, y1]], eave - 0.35, eave - 0.05, 0.2)
  // Windows: one per ~3.2 m on the long faces.
  const L = x1 - x0, n = Math.max(1, Math.round(L / 3.4))
  for (let k = 0; k < n; k++) {
    const s = (L * (k + 0.5)) / n
    rectPanel(win, [x0, y0], [x1, y0], s, 1.3, 1.0, eave - 0.9, 0.05)
    rectPanel(win, [x1, y1], [x0, y1], L - s, 1.3, 1.0, eave - 0.9, 0.05)
  }
}
range(-36.7, 17.0, 9.7, 21.1, 4.2, 6.8)
range(9.7, 16.3, 16.0, 20.8, 5.6, 8.2)
range(-36.9, -21.6, -3.4, -17.8, 5.0, 8.5)
range(-3.4, -21.8, 14.7, -17.7, 4.6, 6.6)
// West wing: a wedge along the diagonal street, hipped cap.
{
  const ring: XY[] = [[-57.5, -21.4], [-36.9, -21.4], [-36.9, 17.0], [-36.7, 21.6]]
  prism({ wall: brick, win: null, roof: null, ring, z0: 0, z1: 4.6, facade: null, bevel: 0.2 })
  ringBand(ring, 4.25, 4.55, 0.2)
  // Roof: lofted from the eave ring to a ridge ring inset 3 m.
  const inner: XY[] = [[-47.6, -18.6], [-39.6, -18.6], [-39.6, 12.0], [-39.5, 13.5]]
  const R0: V3[] = ring.map(([x, y]) => [x, y, 4.45]), R1: V3[] = inner.map(([x, y]) => [x, y, 7.0])
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    const m: XY = [(ring[i][0] + ring[j][0]) / 2 - (inner[i][0] + inner[j][0]) / 2, (ring[i][1] + ring[j][1]) / 2 - (inner[i][1] + inner[j][1]) / 2]
    const n = unit([m[0], m[1], 2.0])
    quadN(tile, R0[i], R0[j], R1[j], R1[i], [n, n, n, n])
  }
  tile.cap(R1, true)
  for (const s of [6, 14, 22, 30]) rectPanel(win, [-36.7, 21.6], [-57.5, -21.4], s, 1.3, 1.0, 3.6, 0.05)
}
// The stone entrance gate in the south range (Bakker's photo).
block(stone, -12.6, -22.4, -8.4, -21.5, 0, 6.6)
archPanel(tile, [-12.6, -22.4], [-8.4, -22.4], 2.1, 2.3, 0, 4.4, 0.05, 8)

// ---------------------------------------------------------------- write
const flood = (p: V3, n: V3) => (Math.abs(n[2]) < 0.6 && p[2] > 2 && p[2] < CORN + 0.1 && Math.abs(p[0]) < 24 && Math.abs(p[1]) < 16 ? 0.55 : 0)
finishModel('Portuguese Synagogue', 'amsterdam-portuguese-synagogue', [
  { part: brick, material: { ...finish('esnoga-brick', 0x7a5650), floodlight: flood } },
  { part: stone, material: { ...finish('esnoga-stone', 0xece2c4), floodlight: flood } },
  { part: slate, material: finish('esnoga-slate', 0x6f7780) },
  { part: win, material: PALETTE.window },
  { part: tile, material: finish('esnoga-tile', 0x5b5f66) },
], { bearing: 28.7, osm: 'way/57861363', height: 24.2 }, 6500)
