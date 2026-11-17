/**
 * Palau Nacional (Museu Nacional d'Art de Catalunya), Montjuïc, Barcelona —
 * original procedural geometry, CC0-1.0.
 * bun generators/barcelona-mnac.ts
 * (uses the shared kit in barcelona-venetian-towers.ts)
 *
 * Map frame: +x east, +y north, z up, metres. BEARING 333: the model's +y
 * is the palace's front, facing compass 333° down Av. Reina Maria
 * Cristina to Plaça d'Espanya (fitted so the OSM front and back edges run
 * level in the frame). Origin = area centroid of OSM relation/21195792,
 * lng 2.153616, lat 41.368364.
 *
 * Evidence
 * - OSM relation/21195792 (building=palace, "Palau Nacional", 1926–29,
 *   wikidata Q2341107). Wikidata checked: Q2341107 is "Palau Nacional,
 *   palace in Barcelona, home to the National Art Museum of Catalonia"
 *   (41.3683 2.1533); Q861252 is the museum institution (MNAC), so the
 *   building item Q2341107 is used, as OSM has it. The outline (164 × 146 m)
 *   and its parts, measured in the model frame: the main dome
 *   way/214445445 (21.6 m across, centre (0.5, 29.3)); the elliptical Sala
 *   Oval way/214445448 (88 × 60 m, centre (0.4, -20.6)) with its ridge
 *   lantern way/666599310 (43.5 × 15.5 m); four towers 12.7 m square: front
 *   way/214445446 and way/214445447 at (±43, 12), back way/666599320 and
 *   way/666599321 at (±44, -57); the corner domes way/214445439 and
 *   way/214445442 (12 m, at (±72, 29)); raised roofs way/666599336 and
 *   way/666599338; the rear tower parts way/666599313 and way/666599314
 *   and the small domes way/666599312 and way/666599319.
 * - Published (Wikipedia en "Palau Nacional"): 32,000 m² ground surface,
 *   a rectangular plan with side and rear square sections and an
 *   elliptical dome in the centre; no heights.
 * - Mapterhorn terrain (terrain.ts grid, bearing 333): the front terrace
 *   (the Mirador) about 7 m in the table, the ground round the sides and
 *   back rising to 13.5 m. y = 0 is the front terrace; the side and back
 *   walls run down to it and sink up to 6.5 m into the hill.
 * - Commons photos (daylight, EVIDENCE):
 *   "Palau Nacional, Barcelona.jpg" (Juanedc, CC BY 2.0, 2013, the front
 *   from Plaça d'Espanya: the main source of heights);
 *   "(Barcelona) Palau Nacional - National Museum of Art of Catalunya.jpg"
 *   (Didier Descouens, CC BY-SA 4.0, 2020s: the front towers' teal tops);
 *   "093 El Palau Nacional des del Castell de Montjuïc (Barcelona).jpg"
 *   (Enric, CC BY-SA 4.0, 2016, from the east: the Sala Oval's arcaded drum
 *   and low vault, all four towers, the corner domes);
 *   "Barcelona - Montjuïc - Mirador del Palau Nacional - View East on Palau
 *   Nacional 1929 ...jpg" (Txllxt TxllxT, CC BY-SA 4.0: the west end, its
 *   pediment and pilasters, the stone colour).
 *
 * Heights, from the Juanedc photo scaled by the facade's OSM width (168 m
 * between the corner pavilions, 6.2 px/m), with the parts set back from
 * the facade corrected for distance and the low camera (about +5%, +3 m):
 * facade cornice 20 m; the central front pavilion 23.5 m with a pediment to
 * 28.5 m; corner pavilions 22.5 m; main dome on a square base to 31 m, drum
 * 31–44 m, dome to 57 m, lantern to 69 m; corner domes: drum 21–28.5,
 * dome to 34, lantern to 41 m; towers: square shaft to 33 m, belfry stage to
 * 41, octagonal stage to 47.5, lantern to 52, spire to 60 m; the Sala
 * Oval's drum to 24 m, its vault to 32 m and the ridge lantern to 34.5 m
 * (castle photo, against the towers). All estimated, about ±2 m.
 *
 * Facade: the long symmetrical front in warm sandstone (0xdcc39d from the
 * daylight photos, pulled to the palette), grouped window panels per bay in
 * two tiers, three tall arched windows and a lunette in the central
 * pavilion; arched windows round the drums; grey roofs; the main dome and
 * the corner domes in a darker pinkish stone (0xc4ab98); the front towers'
 * upper stages teal-green patina (2020s photo), the back towers' in stone.
 * Night: the palace is floodlit, so stone and domes carry _FLOODLIGHT.
 *
 * Doubts: the rear towers' tops (no recent licensed photo of them; drawn
 * in stone); the inner light wells either side of the main dome are roofed
 * over in the model; the rear "tower" parts way/666599313–314 are drawn as
 * low stair blocks (no photo shows them as tall towers); the small cupola
 * way/666599319 is left out.
 */
import { Part, type V3, type MaterialSpec } from './mesh'
import { PALETTE, finish } from './palette'
import { emit, block, lathe, walls, capAny, archPanel, panel, pyramid, rect, offset, type P2 } from './barcelona-venetian-towers'

const BEARING = 333
const ANCHOR = { lng: 2.153616, lat: 41.368364 }
const OUTLINE: P2[] = [[-78.5, 59.0], [-64.1, 59.1], [-64.0, 52.8], [-21.3, 52.9], [-21.3, 61.3], [-10.5, 61.2], [-10.7, 57.8], [-7.5, 57.7], [8.3, 57.8], [11.4, 57.8], [11.4, 61.0], [21.9, 60.9], [21.8, 52.9], [65.3, 52.7], [65.2, 59.3], [79.3, 59.1], [79.2, 54.4], [78.2, 54.4], [78.1, 38.3], [84.5, 38.2], [84.5, 32.5], [84.4, 24.8], [84.4, 20.0], [78.4, 20.1], [78.2, 1.1], [79.4, 1.1], [79.4, -0.8], [64.7, -0.6], [64.7, 1.2], [65.8, 1.3], [65.9, 6.4], [50.1, 6.5], [49.1, 6.4], [49.0, -14.8], [52.7, -14.6], [53.1, -30.7], [48.8, -30.7], [49.3, -50.2], [50.7, -50.2], [51.0, -62.3], [38.5, -62.5], [38.5, -61.4], [15.5, -60.9], [15.8, -72.5], [17.6, -72.6], [17.4, -84.5], [16.8, -85.3], [6.2, -85.3], [5.4, -84.4], [-4.3, -84.3], [-5.2, -85.2], [-16.3, -85.1], [-17.0, -84.4], [-17.0, -72.6], [-15.4, -72.6], [-15.3, -63.0], [-36.4, -63.1], [-36.6, -63.4], [-49.1, -63.4], [-49.2, -51.3], [-48.9, -51.1], [-49.1, -31.3], [-53.3, -31.3], [-53.3, -26.1], [-52.5, -26.1], [-52.4, -18.6], [-53.4, -18.5], [-53.2, -13.7], [-49.1, -13.8], [-49.0, 5.8], [-64.3, 5.8], [-64.3, 5.1], [-63.9, 5.0], [-64.1, -0.5], [-78.6, -0.4], [-78.7, 4.9], [-78.1, 5.0], [-78.2, 19.8], [-83.6, 19.8], [-83.6, 24.4], [-83.4, 24.4], [-83.3, 34.1], [-83.6, 34.1], [-83.6, 38.8], [-77.8, 38.7], [-78.0, 53.8], [-78.5, 53.9]]

const flood = (q: V3, n: V3) => (n[2] > 0.7 ? 0.3 : q[2] < 30 ? 0.9 : 0.7)
const stoneM: MaterialSpec = { ...finish('mnac-stone', 0xdcc39d), floodlight: flood }
const domeM: MaterialSpec = { ...finish('mnac-dome', 0xc4ab98), floodlight: flood }
const stone = new Part(), roof = new Part(), win = new Part(), patina = new Part(), dome = new Part(), glass = new Part()

const CORNICE = 20
// Main body: the outline to the cornice (long walls split so the drape can bend them), a projecting cornice band, a grey roof.
walls(stone, OUTLINE, 0, CORNICE - 1.2, 6)
{
  const o = offset(OUTLINE, 0.45)
  const ring = (r: P2[], z: number): V3[] => r.map(([x, y]) => [x, y, z])
  const base = OUTLINE.slice().reverse() // OSM ring is clockwise; make it counter-clockwise
  void base
  const ccw = OUTLINE.slice()
  // determine winding
  let a2 = 0
  for (let i = 0; i < ccw.length; i++) { const p = ccw[i], q = ccw[(i + 1) % ccw.length]; a2 += p[0] * q[1] - q[0] * p[1] }
  const R0 = a2 > 0 ? OUTLINE : [...OUTLINE].reverse()
  const R1 = a2 > 0 ? o : [...o].reverse()
  stone.loft([ring(R0, CORNICE - 1.2), ring(R1, CORNICE - 0.8), ring(R1, CORNICE), ring(R0, CORNICE + 0.6)])
  capAny(roof, OUTLINE, CORNICE + 0.6)
}

// Front: window bays on the wings (two tiers), corner pavilions, central pavilion.
const FRONT = 52.9
for (const side of [-1, 1]) {
  for (let k = 0; k < 6; k++) {
    const x = side * (25.5 + k * 6.6)
    panel(win, [x + 1.3, FRONT], [x - 1.3, FRONT], 5.5, 9.5, [0, 1])
    panel(win, [x + 1.3, FRONT], [x - 1.3, FRONT], 12, 16.5, [0, 1])
    void side
  }
  // corner pavilion: raised with a small pediment
  const cx = side * 71.75
  block(stone, cx, 56, 7.4, 3.4, 0, 22.5, 0.35)
  const pts: V3[] = [[cx - 7.2, 59.4, 22.5], [cx + 7.2, 59.4, 22.5], [cx, 59.4, 25.3]]
  stone.tri(pts[1], pts[0], pts[2])
  stone.tri([cx - 7.2, 52.8, 22.5], [cx + 7.2, 52.8, 22.5], [cx, 52.8, 25.3])
  stone.quad([cx, 59.4, 25.3], [cx, 52.8, 25.3], [cx + 7.2, 52.8, 22.5], [cx + 7.2, 59.4, 22.5])
  stone.quad([cx, 52.8, 25.3], [cx, 59.4, 25.3], [cx - 7.2, 59.4, 22.5], [cx - 7.2, 52.8, 22.5])
  archPanel(win, [cx, 59.45], [-1, 0], [0, 1], 3.2, 11, 15, 0.04, 8)
  panel(win, [cx + 1.6, 59.45], [cx - 1.6, 59.45], 5.5, 9, [0, 1], 0.04)
}
// Central pavilion with three arched windows, a lunette pediment.
{
  block(stone, 0.3, 50, 21.6, 11.3, 0, 23.5, 0.4)
  const yF = 61.3
  stone.tri([21.9, yF, 23.5], [-21.3, yF, 23.5], [0.3, yF, 28.5])
  stone.quad([0.3, yF, 28.5], [0.3, 40, 28.5], [21.9, 40, 23.5], [21.9, yF, 23.5])
  stone.quad([0.3, 40, 28.5], [0.3, yF, 28.5], [-21.3, yF, 23.5], [-21.3, 40, 23.5])
  stone.tri([-21.3, 40, 23.5], [21.9, 40, 23.5], [0.3, 40, 28.5])
  for (const x of [-7, 0.3, 7.6]) archPanel(win, [x, yF + 0.01], [-1, 0], [0, 1], 4.2, 7.5, 15.5, 0.04, 8)
  archPanel(win, [0.3, yF + 0.01], [-1, 0], [0, 1], 9, 23.6, 23.6, 0.04, 10)
  for (const x of [-16, 16.5]) panel(win, [x + 1.4, yF + 0.01], [x - 1.4, yF + 0.01], 6, 15.5, [0, 1], 0.04)
}

// Main dome: square base, colonnaded drum, ribbed dome, lantern.
{
  const cx = 0.5, cy = 29.3
  block(stone, cx, cy, 12.2, 12.2, CORNICE, 31, 0.4)
  lathe(stone, [[10.8, 31], [10.8, 43.5], [11.4, 44], [11.4, 45.2], [10.5, 45.6]], 20, cx, cy)
  for (let i = 0; i < 20; i++) {
    const a = ((i + 0.5) / 20) * Math.PI * 2, n: P2 = [Math.cos(a), Math.sin(a)], t: P2 = [-Math.sin(a), Math.cos(a)]
    archPanel(win, [cx + n[0] * 10.75, cy + n[1] * 10.75], t, n, 1.7, 34, 40.5, 0.05, 6)
  }
  lathe(dome, [[10.5, 45.6], [10.2, 48], [9.2, 51], [7.4, 53.6], [4.9, 55.6], [2.6, 56.8], [2.3, 57]], 20, cx, cy)
  lathe(stone, [[2.4, 57], [2.4, 63], [2.9, 63.4], [2.6, 64], [1.4, 66.5], [0.5, 67.8], [0.25, 69], [0, 69.2]], 12, cx, cy)
}

// Corner domes over the side pavilions.
for (const side of [-1, 1]) {
  const cx = side * 71.7, cy = 28.9
  lathe(stone, [[6, CORNICE], [6, 28], [6.5, 28.4], [5.8, 28.8]], 14, cx, cy)
  for (let i = 0; i < 8; i++) {
    const a = ((i + 0.5) / 8) * Math.PI * 2, n: P2 = [Math.cos(a), Math.sin(a)], t: P2 = [-Math.sin(a), Math.cos(a)]
    archPanel(win, [cx + n[0] * 5.95, cy + n[1] * 5.95], t, n, 1.6, 22.5, 25.8, 0.05, 6)
  }
  lathe(dome, [[5.8, 28.8], [5.4, 30.6], [4.3, 32.4], [2.4, 33.7], [1.3, 34]], 14, cx, cy)
  lathe(stone, [[1.4, 34], [1.4, 37.5], [1.7, 37.8], [0.6, 39.5], [0, 41]], 10, cx, cy)
  // raised roof range between tower and corner dome
  const rx = side * 44.5
  block(roof, rx, 31, 15, 4.5, CORNICE, 22.5, 0.4)
}

// The four towers (Giralda-like): shaft, belfry, octagonal stage, lantern, spire.
const TOWERS: [number, number, boolean][] = [[-42.7, 12.1, true], [43.8, 12.4, true], [-42.8, -57.1, false], [44.8, -56.4, false]]
for (const [cx, cy, front] of TOWERS) {
  block(stone, cx, cy, 6.4, 6.4, 0, 33, 0.4)
  block(stone, cx, cy, 6.8, 6.8, 33, 34, 0.3)
  block(stone, cx, cy, 5.2, 5.2, 34, 41, 0.35)
  block(stone, cx, cy, 5.6, 5.6, 41, 41.8, 0.25)
  for (let f = 0; f < 4; f++) {
    const a = (f * Math.PI) / 2, n: P2 = [Math.cos(a), Math.sin(a)], t: P2 = [-Math.sin(a), Math.cos(a)]
    for (const s of [-1.8, 1.8]) archPanel(win, [cx + n[0] * 5.2 + t[0] * s, cy + n[1] * 5.2 + t[1] * s], t, n, 2.2, 35, 38.6, 0.05, 6)
    for (const s of [-2.6, 2.6]) panel(win, [cx + n[0] * 6.4 + t[0] * (s - 0.9), cy + n[1] * 6.4 + t[1] * (s - 0.9)], [cx + n[0] * 6.4 + t[0] * (s + 0.9), cy + n[1] * 6.4 + t[1] * (s + 0.9)], 24, 30, n)
  }
  const top = front ? patina : stone
  lathe(top, [[4.6, 41.8], [4.6, 46.8], [4.9, 47.2], [3.2, 47.6], [2.7, 48], [2.7, 51.5], [3.0, 51.9], [2.0, 52.4], [1.1, 55.5], [0.4, 58.6], [0, 60]], 8, cx, cy, 1, 1, Math.PI / 8)
}

// Rear stair blocks and the small rear dome.
for (const cx of [-10.7, 11.5]) block(stone, cx, -78.7, 6.3, 6.4, 0, 23.5, 0.35)
lathe(stone, [[5.3, CORNICE], [5.3, 24]], 12, 0.8, -58)
lathe(dome, [[5.3, 24], [4.6, 26], [2.8, 27.6], [0, 28.2]], 12, 0.8, -58)

// Sala Oval: drum with arched clerestory, low vault, ridge lantern.
{
  const cx = 0.4, cy = -20.6, A = 44.1, sy = 30 / 44.1
  lathe(stone, [[A, CORNICE], [A, 23.6], [A + 0.5, 24], [A + 0.5, 24.6], [A - 0.4, 24.8]], 40, cx, cy, 1, sy)
  for (let i = 0; i < 40; i++) {
    const a = ((i + 0.5) / 40) * Math.PI * 2
    const p: P2 = [cx + A * Math.cos(a), cy + A * sy * Math.sin(a)]
    let n: P2 = [Math.cos(a) * sy, Math.sin(a)]; const l = Math.hypot(...n); n = [n[0] / l, n[1] / l]
    const t: P2 = [-n[1], n[0]]
    archPanel(win, p, t, n, 3.6, 20.5, 22.2, 0.06, 6)
  }
  lathe(roof, [[A - 0.4, 24.8], [38, 27.4], [30, 29.8], [21, 31.3], [12, 32]], 40, cx, cy, 1, sy)
  // the vault's top between the lantern's ends
  block(roof, cx, cy, 11, 6.5, 31.4, 32.2, 0.5)
  block(glass, cx, cy, 21.7, 7.7, 31.8, 34.5, 2.5)
}

await emit('barcelona-mnac', 'Palau Nacional (MNAC)', [
  { part: stone, material: stoneM },
  { part: roof, material: PALETTE.roof },
  { part: win, material: PALETTE.window },
  { part: patina, material: PALETTE.patina },
  { part: dome, material: domeM },
  { part: glass, material: PALETTE.glass },
], { bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: 69.2, replaces: [
  'relation/21195792', 'way/214445439', 'way/214445442', 'way/214445445', 'way/214445446', 'way/214445447', 'way/214445448',
  'way/666599310', 'way/666599312', 'way/666599313', 'way/666599314', 'way/666599319', 'way/666599320', 'way/666599321', 'way/666599336', 'way/666599338',
] }, 6500)
void pyramid; void rect
