/**
 * Palau de la Música Catalana (Carrer del Palau de la Música 4–6,
 * Barcelona; Lluís Domènech i Montaner, 1905–1908; extension by Òscar
 * Tusquets, 1982–2004) — original procedural geometry, CC0-1.0.
 * bun generators/barcelona-palau-musica.ts
 *
 * Uses the kit in barcelona-casa-batllo.ts (merge that first).
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = area centroid of the theatre's OSM outline
 * way/377216661, 41.387586, 2.175226; bearing 0. The 1908 hall's main
 * front faces south-east onto Carrer de Sant Pere Més Alt (the 15 m face
 * from the corner), its long side north-east along Carrer
 * d'Amadeu Vives (56 m); the corner between them carries the sculpture
 * group and the tower. Tusquets' brick extension closes the plot's west
 * end, round the plaza on its south-west side.
 *
 * Identity, in order: the red-brick corner with its tower, lantern and the
 * stone sculpture group leaning out over the corner pier; the main front's
 * first-floor balcony and its rows of mosaic-clad columns, under three
 * great arches and a band of mosaic; the street arches of the ground
 * floor; the long Amadeu Vives side with its arcade, bays of arched
 * windows and a row of pinnacles; Tusquets' round brick tower and glazed
 * block at the back.
 *
 * Evidence:
 *  - plan: OSM. The 1908 hall is way/671830491 (building, 5 levels); the
 *    extension is way/671830503 (building, 8 levels) with its parts
 *    way/671830481 (the round tower, 7 levels), way/671830501 and
 *    way/951336755 (8 levels), way/671830496 (4), way/671830502 (1). The
 *    theatre outline way/377216661 is not a building and also holds the
 *    plaza and way/671830480 ("Petit Palau", a separate building at the
 *    south end, not modelled and not replaced). OSM bends the main front
 *    0.7 m outward at (28.44, -14.44); no photo shows a bend, so the front
 *    is drawn straight between its ends.
 *  - heights: no lidar; OSM levels and photo proportions. Main cornice
 *    22 m (5 tall levels); the street arches 6.8 m, the balcony at 7.6 m,
 *    the lower columns 8–12.8 m, the great arches 13–18.5 m, the mosaic
 *    band to 22 m and its central panel to 23.5 m: proportioned on Javi
 *    Guerra Hernando's and Jordiferrer's photos of the front against the
 *    arches' 5.5 m span. The corner tower to 29.8 m, its lantern to 35 m:
 *    from Doomuu's and Fred Romero's views up the corner (estimate); the
 *    corner itself rising as the tower (the chamfer plus 2.6 m of each
 *    front, flush with both) from the balcony at 8 m to 29 m, lantern to
 *    35.7 m; the warm stone sculpture group 5–15.6 m
 *    over a 3 m thick pier clad in mosaic. The corner is drawn chamfered
 *    (3.7 m) as photographed; OSM rounds it. The extension's block 23 m (8
 *    levels) and its round tower (way/671830481, r 2.95 m from OSM, 7
 *    levels) only 2 m above it, 25 m: estimates from the plaza photos
 *    (Enfo; Yearofthedragon), kept low so it does not loom over the hall.
 *  - colour: red brick (#c27762, pulled light); the stone, the sculpture
 *    and the mosaic columns pale (trim); the mosaics and the ceramic
 *    balustrade read green-blue (#8fb3a6); the extension's brick the same
 *    red; its glazing translucent-free glass.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Palau_música_catalana_exterior.jpg (Doomuu, CC BY-SA 4.0), the corner;
 *  - Barcelona-Palau_de_la_Música_Catalana_(I).jpg (Javi Guerra Hernando,
 *    CC BY-SA 4.0), the main front's arches and balcony;
 *  - Palau_de_la_Musica_Catalana_-_façana_modernista.JPG (Jordiferrer, CC
 *    BY-SA 3.0), the columns, great arches and mosaic;
 *  - Barcelona_-_Palau_de_la_Música_Catalana_(32).jpg (Fred Romero, CC BY
 *    2.0), the corner tower and lantern;
 *  - Barcelona,_Palau_de_la_Música_Catalana_(side_view)_-_panoramio.jpg
 *    (Patroc, CC BY 3.0), the Amadeu Vives bays;
 *  - 004_Palau_de_la_Música,_ampliació_d'Òscar_Tusquets.jpg (Enfo, CC BY-SA
 *    3.0) and Domènech.i.Montaner.Palau.Musica.Catalana.2.Barcelona.JPG
 *    (Yearofthedragon, assumed by Commons, CC BY 2.5), the extension;
 *  - Palau_de_la_Música_Catalana_(_Vidrera).jpg (Pili Redondo Rodríguez,
 *    CC BY-SA 3.0 es), the glazed front to the plaza.
 * No look-only sources. No commercial imagery. No lidar.
 *
 * Left out: the sculpture's figures and the knight's flag (drawn as one
 * stone mass), the busts,
 * the mosaic pictures, the ceramic balusters, the lantern's iron crown,
 * the hall's skylight (inside), the plaza and its steps (the map's).
 *
 * Doubts: every height is an estimate; the Amadeu Vives side is drawn from
 * one oblique photo; the roof is flat (not photographed).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, type Swatch } from './palette'
import { cap, save, walls, type XY } from './chi-aon-center'
import { ccw, lathe } from './barcelona-casa-batllo'

const HALL: XY[] = ccw([[-12.98, 6.05], [-15.19, 8.94], [-15.86, 9.81], [-12.28, 12.52], [-17.87, 18.49], [-17.62, 18.69], [-19.2, 20.92], [-13.87, 25.93], [-11.32, 28.31], [-9.68, 29.85], [-5.4, 33.89], [13.01, 14.81], [32.37, -5.75], [32.31, -9.49], [21.69, -20.12], [15.78, -12.92], [7.07, -19.81], [2.97, -14.56], [5.52, -12.58], [-10.45, 7.99]])
const EXT: XY[] = ccw([[-32.68, 14.61], [-31.39, 15.55], [-30.6, 16.12], [-25.15, 19.24], [-21.63, 21.23], [-20.24, 22.03], [-19.2, 20.92], [-17.62, 18.69], [-17.87, 18.49], [-12.28, 12.52], [-15.86, 9.81], [-15.19, 8.94], [-16.51, 7.93], [-17.22, 8.77], [-23.12, 4.3], [-22.55, 3.4], [-22.34, 2.34], [-22.55, 1.21], [-23.13, 0.29], [-24.01, -0.35], [-25.05, -0.64], [-26.13, -0.54], [-27.1, -0.05], [-27.83, 0.74], [-28.22, 1.76], [-28.23, 2.83], [-27.84, 3.85], [-27.12, 4.66], [-29.53, 7.52], [-30.56, 6.66], [-35.23, 12.21], [-33.52, 13.99]])

const CORNICE = 22.0

/** A frame on the wall a→b (outward on the right): P(s, z, out). */
function face(a: XY, b: XY) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
  const P = (s: number, z: number, o = 0): V3 => [a[0] + u[0] * s + n[0] * o, a[1] + u[1] * s + n[1] * o, z]
  return { L, u, n, P }
}
/** An arched panel on a wall frame: s0..s1, from z0, springing at zs, semicircular top. */
function archPanel(p: Part, P: (s: number, z: number, o?: number) => V3, s0: number, s1: number, z0: number, zs: number, o: number) {
  const c = (s0 + s1) / 2, r = (s1 - s0) / 2, ring: V3[] = [P(s0, z0, o), P(s1, z0, o)]
  for (let i = 0; i <= 8; i++) { const t = (i / 8) * Math.PI; ring.push(P(c + r * Math.cos(t), zs + r * Math.sin(t), o)) }
  for (let i = 1; i < ring.length - 1; i++) p.tri(ring[0], ring[i], ring[i + 1])
}

function build() {
  const brick = new Part(), stone = new Part(), win = new Part(), mosaic = new Part(), glass = new Part(), roof = new Part()

  // --- The 1908 hall --------------------------------------------------------
  walls(brick, HALL, 0, CORNICE)
  cap(roof, HALL, CORNICE)
  // a stone cornice band round the street fronts
  // Main front (Sant Pere Més Alt), s from its south-west end to the corner.
  const F = face([21.69, -20.12], [32.31, -9.49])
  const C = face([32.31, -9.49], [32.37, -5.75]) // the chamfered corner
  // ground floor: two great street arches between stone piers
  for (const [s0, s1] of [[2.6, 8.2], [9.2, 14.8]] as [number, number][]) {
    archPanel(stone, F.P, s0 - 0.45, s1 + 0.45, 0, 4.6, 0.04)
    archPanel(win, F.P, s0, s1, 0, 4.6, 0.08)
  }
  // the balcony on the first floor, wrapping round the corner, and its balustrade
  const N = face([32.37, -5.75], [13.01, 14.81])
  const balc = (P: typeof F.P, s0: number, s1: number) => {
    const q = [P(s0, 7.6, 0), P(s1, 7.6, 0), P(s1, 7.6, 1.6), P(s0, 7.6, 1.6)]
    const up = (v: V3, h: number): V3 => [v[0], v[1], v[2] + h]
    stone.quad(q[0], q[1], q[2], q[3]) // underside
    stone.quad(up(q[3], 0.45), up(q[2], 0.45), up(q[1], 0.45), up(q[0], 0.45))
    stone.quad(q[3], q[2], up(q[2], 0.45), up(q[3], 0.45))
    stone.quad(q[0], q[3], up(q[3], 0.45), up(q[0], 0.45))
    stone.quad(q[2], q[1], up(q[1], 0.45), up(q[2], 0.45))
    // the ceramic balustrade along its edge (green)
    const b0 = P(s0, 8.05, 1.45), b1 = P(s1, 8.05, 1.45)
    mosaic.quad(b0, b1, up(b1, 0.95), up(b0, 0.95))
    mosaic.quad(P(s1, 8.05, 1.3), P(s0, 8.05, 1.3), P(s0, 9.0, 1.3), P(s1, 9.0, 1.3))
    mosaic.quad(up(b0, 0.95), up(b1, 0.95), P(s1, 9.0, 1.3), P(s0, 9.0, 1.3))
  }
  balc(F.P, 0.4, F.L + 0.4)
  balc(N.P, 0.2, 9.0)
  balc(C.P, -0.3, C.L + 0.3)
  // glazing behind the columns, and the columns: a tall lower row and a short upper one
  win.quad(F.P(0.8, 8.1, 0.05), F.P(F.L - 0.6, 8.1, 0.05), F.P(F.L - 0.6, 12.6, 0.05), F.P(0.8, 12.6, 0.05))
  for (let k = 0; k <= 10; k++) {
    const s = 1.1 + k * (F.L - 2.0) / 10, [x, y] = F.P(s, 0, 0.75)
    lathe(stone, x, y, [[0.34, 8.05], [0.34, 12.2], [0.55, 12.6], [0.55, 12.9]], 8)
    if (k % 2 === 0) lathe(stone, x, y, [[0.28, 12.9], [0.28, 15.2], [0.45, 15.5]], 6)
  }
  // the three great arches over the columns, and the mosaic band above them
  for (let k = 0; k < 3; k++) {
    const s0 = 1.0 + k * (F.L - 2.0) / 3 + 0.35, s1 = 1.0 + (k + 1) * (F.L - 2.0) / 3 - 0.35
    archPanel(stone, F.P, s0 - 0.35, s1 + 0.35, 12.9, 16.3, 0.03)
    archPanel(mosaic, F.P, s0, s1, 12.9, 16.3, 0.06)
    archPanel(win, F.P, s0 + 0.7, s1 - 0.7, 12.9, 16.3, 0.09)
  }
  mosaic.quad(F.P(0.8, 18.8, 0.04), F.P(F.L - 0.8, 18.8, 0.04), F.P(F.L - 0.8, 21.5, 0.04), F.P(0.8, 21.5, 0.04))
  // the central panel rising over the cornice
  {
    const c = F.L / 2, ring: V3[] = [F.P(c - 3.2, CORNICE, 0.0), F.P(c + 3.2, CORNICE, 0.0)]
    for (let i = 0; i <= 8; i++) { const t = (i / 8) * Math.PI; ring.push(F.P(c + 3.2 * Math.cos(t), CORNICE + 0.3 + 1.4 * Math.sin(t), 0.0)) }
    for (let i = 1; i < ring.length - 1; i++) brick.tri(ring[0], ring[i], ring[i + 1])
    const back = ring.map(v => [v[0] - F.n[0] * 0.5, v[1] - F.n[1] * 0.5, v[2]] as V3)
    for (let i = 1; i < back.length - 1; i++) brick.tri(back[0], back[i + 1], back[i])
    for (let i = 2; i < ring.length - 1; i++) stone.quad(ring[i], back[i], back[i + 1], ring[i + 1])
  }
  // the stone cornice over both fronts
  for (const W of [F, N, C]) {
    const L = W.L
    const q = [W.P(0, CORNICE - 0.5, 0), W.P(L, CORNICE - 0.5, 0), W.P(L, CORNICE - 0.5, 0.45), W.P(0, CORNICE - 0.5, 0.45)]
    const up = (v: V3): V3 => [v[0], v[1], v[2] + 0.5]
    stone.quad(q[3], q[2], up(q[2]), up(q[3])); stone.quad(up(q[3]), up(q[2]), up(q[1]), up(q[0])); stone.quad(q[0], q[1], q[2], q[3])
  }

  // Amadeu Vives: a street arcade, bays of arched windows, pinnacles.
  {
    const W = face([33.54, -6.48], [-5.4, 33.89]), bay = 6.2, n = Math.floor((W.L - 3) / bay)
    for (let k = 0; k < n; k++) {
      const s = 3.0 + k * bay + bay / 2
      archPanel(stone, W.P, s - 2.55, s + 2.55, 0, 3.9, 0.03)
      archPanel(win, W.P, s - 2.1, s + 2.1, 0, 3.9, 0.07)
      for (const ds of [-1.45, 1.45]) {
        archPanel(win, W.P, s + ds - 1.0, s + ds + 1.0, 9.2, 11.6, 0.06)
        archPanel(win, W.P, s + ds - 1.0, s + ds + 1.0, 13.6, 17.4, 0.06)
      }
      // a mosaic-clad pilaster between the bays, up to a pinnacle
      const [x, y] = W.P(3.0 + k * bay, 0, 0.35)
      lathe(brick, x, y, [[0.45, 7.6], [0.45, CORNICE]], 6)
      lathe(stone, x, y, [[0.5, CORNICE], [0.5, CORNICE + 0.3], [0.3, CORNICE + 1.2], [0, CORNICE + 2.2]], 6)
      mosaic.quad(W.P(s - 2.6, 19.0, 0.04), W.P(s + 2.6, 19.0, 0.04), W.P(s + 2.6, 20.6, 0.04), W.P(s - 2.6, 20.6, 0.04))
    }
  }
  // The plaza side: the hall's flank with its great stained-glass windows
  // (behind Tusquets' glazed foyer at street level).
  {
    const V = face([-10.45, 7.99], [5.52, -12.58])
    for (let k = 0; k < 5; k++) { const s = 2.6 + k * 5.0; archPanel(stone, V.P, s - 1.9, s + 1.9, 8.6, 15.8, 0.03); archPanel(win, V.P, s - 1.5, s + 1.5, 9.0, 16.0, 0.06) }
    glass.quad(V.P(0.4, 0, 0.08), V.P(V.L - 0.4, 0, 0.08), V.P(V.L - 0.4, 7.4, 0.08), V.P(0.4, 7.4, 0.08))
    for (let k = 0; k < 5; k++) mosaic.quad(V.P(0.6 + k * 5.0 + 0.4, 18.4, 0.04), V.P(0.6 + k * 5.0 + 4.6, 18.4, 0.04), V.P(0.6 + k * 5.0 + 4.6, 20.0, 0.04), V.P(0.6 + k * 5.0 + 0.4, 20.0, 0.04))
  }

  // --- The corner: chamfered; a thick mosaic-clad pier at the street, the
  // sculpture group leaning out over it at first- and second-floor level,
  // and the corner rising as a brick tower clear of the roof to its lantern.
  const MX = 32.34, MY = -7.62 // the chamfer's middle; it faces east
  lathe(stone, MX + 0.4, MY, [[1.55, 0], [1.55, 1.2], [1.45, 1.35]], 12, { capTop: true })
  lathe(mosaic, MX + 0.4, MY, [[1.45, 1.35], [1.45, 3.5]], 12)
  lathe(brick, MX + 0.4, MY, [[1.45, 3.5], [1.45, 4.6], [1.85, 5.3]], 12)
  {
    // the sculpture group: one warm stone mass growing out of the pier and
    // widening upward into the balcony, its top tapering against the tower
    const x = MX + 0.75, y = MY
    lathe(stone, x, y, [[1.35, 5.0], [1.7, 6.0], [2.3, 7.2], [2.75, 8.2], [2.75, 11.8], [2.55, 12.3]], 10, { sy: 1.25, capTop: true })
    // the figures standing on it against the tower, flat-topped
    lathe(stone, x - 0.4, y, [[1.6, 12.2], [1.45, 14.6], [1.1, 15.6]], 8, { sy: 1.2, capTop: true })
  }
  // The tower is the corner itself: the chamfer and the first 2.6 m of
  // each front, flush with both, in brick from the balcony to over the
  // roof, the lantern on top.
  {
    const A: XY = [32.31, -9.49], B: XY = [32.37, -5.75]
    const E: XY = [A[0] - F.u[0] * 2.6, A[1] - F.u[1] * 2.6], Cn: XY = [B[0] + N.u[0] * 2.6, B[1] + N.u[1] * 2.6]
    const mid: XY = [(E[0] + Cn[0]) / 2, (E[1] + Cn[1]) / 2], inn: XY = [mid[0] - 1.6, mid[1]]
    const ring = ccw([A, B, Cn, inn, E])
    walls(brick, ring, 8.0, 29.0)
    cap(brick, ring, 29.0)
    walls(mosaic, ring.map(([x, y]) => [x + (x - mid[0]) * 0.04, y + (y - mid[1]) * 0.04] as XY), 24.8, 26.0)
    walls(stone, ring.map(([x, y]) => [x + (x - mid[0]) * 0.06, y + (y - mid[1]) * 0.06] as XY), 28.6, 29.2)
    // window slots up the chamfer
    for (const [z0, z1] of [[16.4, 20.0], [21.0, 24.0]]) win.quad(C.P(0.9, z0, 0.05), C.P(C.L - 0.9, z0, 0.05), C.P(C.L - 0.9, z1, 0.05), C.P(0.9, z1, 0.05))
    const TX = (A[0] + B[0] + Cn[0] + E[0]) / 4 - 0.3, TY = (A[1] + B[1] + Cn[1] + E[1]) / 4
    lathe(brick, TX, TY, [[1.9, 29.0], [1.9, 30.3], [2.1, 30.6]], 14, { capTop: true })
    lathe(mosaic, TX, TY, [[1.3, 30.6], [1.3, 31.9], [1.5, 32.2]], 12)
    lathe(glass, TX, TY, [[0.95, 32.2], [0.95, 33.6]], 10)
    lathe(stone, TX, TY, [[1.25, 33.5], [1.15, 33.9], [0.7, 34.4], [0.12, 35.1], [0, 35.7]], 10)
  }

  // --- Tusquets' extension -----------------------------------------------
  walls(brick, EXT, 0, 23.0)
  cap(roof, EXT, 23.0)
  // the round brick tower
  lathe(brick, -25.28, 2.3, [[2.95, 22.5], [2.95, 25.0]], 16, { capTop: true })
  // glazing towards the plaza: the curtain wall on its south-east faces
  for (let i = 0; i < EXT.length; i++) {
    const a = EXT[i], b = EXT[(i + 1) % EXT.length], W = face(a, b)
    if (W.L < 3 || W.n[1] > -0.2 || W.n[0] < -0.2) continue
    glass.quad(W.P(0.6, 5.0, 0.06), W.P(W.L - 0.6, 5.0, 0.06), W.P(W.L - 0.6, 20.8, 0.06), W.P(0.6, 20.8, 0.06))
  }

  const lit = (p: V3, n: V3) => (p[0] > 12 && n[2] < 0.7 ? 0.5 + 0.5 * Math.min(1, p[2] / 30) : 0)
  return [
    { part: brick, material: { ...finish('palau-brick', 0xc27762), floodlight: lit } },
    { part: stone, material: { ...PALETTE.trim, floodlight: lit } },
    { part: win, material: PALETTE.window },
    { part: mosaic, material: { ...finish('palau-mosaic', 0x8fb3a6), floodlight: lit } },
    { part: glass, material: PALETTE.glass },
    { part: roof, material: PALETTE.roof },
  ] as { part: Part; material: Swatch }[]
}

if (import.meta.main) await save('barcelona-palau-musica', 'Palau de la Música Catalana', [41.387586, 2.175226], 0, build(), 6500)
