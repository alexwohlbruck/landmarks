/**
 * Casa de les Punxes, Casa Terrades (Avinguda Diagonal 416–420, Barcelona;
 * Josep Puig i Cadafalch, 1903–1905) — original procedural geometry,
 * CC0-1.0.
 * bun generators/barcelona-casa-de-les-punxes.ts
 *
 * Uses the kit in barcelona-casa-batllo.ts (merge that first).
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = area centroid of the OSM outline way/1288798874,
 * 41.398028, 2.164014; bearing 0. The house fills a whole triangular
 * block: Avinguda Diagonal along its south face (41 m), Carrer del
 * Rosselló along its north-west face (33 m), Carrer del Bruc along its
 * short north-east face, with Cerdà's chamfers at the three corners. A
 * round tower stands at each end of each chamfer: six towers.
 *
 * Identity, in order: the six round brick towers with tall conical spires
 * of red glazed tiles, green at the tip; the biggest at the Diagonal end of
 * the Diagonal–Rosselló chamfer, whose cone carries an open white lantern
 * and a second spire; the steep white-edged gables standing over every
 * face, with red-brown tiled roofs behind them; the warm red brick walls
 * with white stone window surrounds; the rough stone ground floor.
 *
 * Evidence:
 *  - plan: the OSM outline (way/1288798874) and its 52 parts (all listed in
 *    the placement): the six towers are the circular parts tagged
 *    roof:shape=onion (way/646115372 r 3.3 m, the big one; way/646115379,
 *    way/646115388, way/646115390, way/646115391, way/646115392, r 2.6–2.8
 *    m). The big tower's corner is published (es.wikipedia, "Casa de les
 *    Punxes": the largest tower at Diagonal × Rosselló, three levels).
 *  - heights: no open lidar here. Estimates from storeys and photo
 *    proportions: stone ground floor 5 m, four brick floors to the eaves at
 *    20 m (OSM: 5–7 levels across the parts); the towers' arcaded galleries
 *    21.2–24 m; each cone about 1.9 times its tower's diameter tall
 *    (CasaPunxes' long view along the Diagonal face, measured cone 1.76 D
 *    plus the green tip), so the cones' tips at 34–35 m; the big tower's
 *    gallery 23–26.5 m, its lantern 29.2–32.4 m and spire tip 41 m
 *    (Nicholas Gemini's view from the Diagonal, proportioned to the
 *    tower's 6.5 m diameter). Gables about as tall as they are wide.
 *  - colour: brick read warm red-brown in daylight (#c98a6c, pulled
 *    light); stone ground floor and roof terrace warm grey; window
 *    surrounds and gable copings white; the cones' glazed tiles red
 *    (#b4583f) with green tips (copper).
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Casa_de_les_Punxes_.jpg (CasaPunxes, CC BY-SA 4.0), the Diagonal face;
 *  - Casa_de_les_Punxes_actual.JPG (Casadelespunxes2016, CC BY-SA 4.0),
 *    from above, the Bruc end;
 *  - Casa_de_les_Punxes_by_Josep_Puig_i_Cadafalch.jpg (Yair Haklai, CC BY-SA
 *    4.0), a tower and the chamfer;
 *  - Casa_de_les_Punxes_(Barcelona)_02.jpg and _10.jpg (Nicholas Gemini,
 *    CC BY-SA 4.0), the big tower;
 *  - Casa_de_les_Punxes,_Barcelona_-_panoramio_(1).jpg (Carlos Cunha, CC
 *    BY-SA 3.0), the stone ground floor and the oriels.
 * No look-only sources. No commercial imagery. No lidar.
 *
 * Left out: the oriels' carving, the iron balconies, the tile panels in the
 * gables, the finials' ironwork, the brick patterns, the roof's chimneys.
 *
 * Doubts: every height is an estimate; the gables' count and spacing per
 * face is from the photos but not surveyed; the roof behind the gables is
 * drawn as one terrace (published: a 600 m² roof terrace).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, type Swatch } from './palette'
import { cap, save, walls, type XY } from './chi-aon-center'
import { box, lathe } from './barcelona-casa-batllo'

const RING: XY[] = [[-19.59,2.27],[-22.28,-0.41],[-28.65,-6.74],[-28.12,-7.32],[-28.78,-7.25],[-29.61,-7.44],[-30.23,-7.77],[-30.72,-8.25],[-31.08,-8.86],[-31.26,-9.54],[-31.19,-10.5],[-30.8,-11.33],[-30.23,-11.91],[-29.49,-12.29],[-28.78,-12.42],[-28.43,-12.42],[-28.6,-12.86],[-23.41,-18.28],[-23.03,-17.88],[-23.05,-18.39],[-22.86,-19.25],[-22.4,-20.08],[-21.75,-20.69],[-20.81,-21.13],[-19.89,-21.22],[-19.1,-21.06],[-18.39,-20.72],[-17.86,-20.29],[-17.48,-19.79],[-17.21,-19.24],[-16.99,-19.96],[-15.46,-19.46],[-11.61,-18.23],[-9.69,-18.55],[-8.36,-17.15],[-3.69,-15.63],[-3.07,-15.44],[-2.86,-15.95],[-1.54,-15.52],[3.12,-14.01],[6.48,-12.94],[7.96,-12.45],[7.79,-11.84],[8.64,-11.55],[12.48,-10.28],[12.72,-10.21],[15.13,-10.68],[16.5,-8.94],[17.19,-8.72],[21.52,-7.34],[21.49,-7.0],[22.07,-7.29],[22.97,-7.45],[24.12,-7.2],[24.84,-6.69],[25.39,-5.9],[25.58,-5.32],[25.61,-4.44],[25.44,-3.81],[25.27,-3.47],[24.87,-2.96],[25.66,-3.22],[27.25,4.77],[26.43,4.95],[26.87,5.16],[27.47,5.63],[27.87,6.22],[28.12,6.93],[28.15,7.5],[28.07,8.07],[27.74,8.78],[27.21,9.37],[26.63,9.72],[25.98,9.91],[25.6,9.94],[24.99,9.88],[25.58,10.52],[22.12,13.96],[19.33,16.76],[18.59,16.14],[18.61,16.6],[18.46,17.34],[18.13,17.96],[17.54,18.56],[16.9,18.89],[15.98,19.04],[15.13,18.88],[14.53,18.56],[14.27,18.35],[14.2,19.16],[4.08,19.2],[3.21,19.2],[2.81,19.2],[0.21,19.21],[0.23,18.32],[-0.2,18.74],[-0.77,19.09],[-1.58,19.3],[-2.27,19.27],[-3.04,19.01],[-3.58,18.61],[-4.07,18.0],[-4.35,17.27],[-4.39,16.6],[-4.88,16.9],[-5.36,16.42],[-11.47,10.34],[-11.76,10.05],[-13.71,8.12]]

const EAVE = 20.0, BASE = 5.0
type Tower = { x: number; y: number; r: number; big?: boolean }
const TOWERS: Tower[] = [
  { x: -19.99, y: -17.95, r: 3.27, big: true }, // Diagonal × Rosselló, the big one
  { x: -28.8, y: -9.65, r: 2.57 },
  { x: -1.63, y: 16.76, r: 2.76 },
  { x: 16.11, y: 16.32, r: 2.59 },
  { x: 25.47, y: 7.63, r: 2.68 },
  { x: 22.62, y: -4.38, r: 2.79 },
]
// Faces carrying gables: [from, to] in counter-clockwise order (outward on
// the right), and the gables' centres (metres along) and widths, counted
// on CasaPunxes' photo for the Diagonal face and on the others for the rest.
const GABLES: { a: XY; b: XY; at: [number, number][] }[] = [
  // Diagonal: three narrow gables, the big one with the tile panel, three more
  { a: [-15.46, -19.46], b: [21.52, -7.34], at: [[3.5, 3.6], [7.7, 3.6], [11.9, 3.6], [19.2, 7.4], [26.5, 3.6], [30.7, 3.6], [34.9, 3.6]] },
  { a: [25.66, -3.22], b: [27.25, 4.77], at: [[4.05, 4.6]] }, // Diagonal × Bruc chamfer
  { a: [25.58, 10.52], b: [19.33, 16.76], at: [[4.4, 4.4]] }, // Bruc
  { a: [14.2, 19.16], b: [0.21, 19.21], at: [[3.9, 3.8], [10.1, 3.8]] }, // Bruc × Rosselló chamfer
  { a: [-5.36, 16.42], b: [-28.65, -6.74], at: [[3.6, 3.6], [7.8, 3.6], [15.6, 7.0], [23.4, 3.6], [27.6, 3.6]] }, // Rosselló
  { a: [-28.6, -12.86], b: [-23.41, -18.28], at: [[3.75, 4.4]] }, // Diagonal × Rosselló chamfer
]

function build() {
  const brick = new Part(), stone = new Part(), white = new Part(), win = new Part(), tiles = new Part(), green = new Part()

  // --- Body ----------------------------------------------------------------
  walls(stone, RING, 0, BASE)
  walls(brick, RING, BASE, EAVE)
  // a white cornice at the eaves and a string course over the stone
  walls(white, RING, EAVE - 0.35, EAVE)
  cap(stone, RING, EAVE)

  // windows on every straight wall long enough, four floors, white surrounds
  for (let i = 0; i < RING.length; i++) {
    const a = RING[i], b = RING[(i + 1) % RING.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]); if (L < 2.6) continue
    const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
    const P = (s: number, z: number, o: number): V3 => [a[0] + u[0] * s + n[0] * o, a[1] + u[1] * s + n[1] * o, z]
    const k = Math.max(1, Math.round(L / 3.4)), w = 1.15
    for (let j = 0; j < k; j++) {
      const s = L * (j + 0.5) / k
      for (const [z0, z1] of [[6.0, 8.3], [9.8, 11.9], [13.4, 15.5], [16.9, 18.9]]) {
        white.quad(P(s - w / 2 - 0.22, z0 - 0.25, 0.03), P(s + w / 2 + 0.22, z0 - 0.25, 0.03), P(s + w / 2 + 0.22, z1 + 0.3, 0.03), P(s - w / 2 - 0.22, z1 + 0.3, 0.03))
        win.quad(P(s - w / 2, z0, 0.07), P(s + w / 2, z0, 0.07), P(s + w / 2, z1, 0.07), P(s - w / 2, z1, 0.07))
      }
      // the ground floor's arches
      const r = Math.min(1.25, L / k / 2 - 0.5)
      if (r > 0.5) {
        const ring: V3[] = [P(s - r, 0.3, 0.05), P(s + r, 0.3, 0.05)]
        for (let q = 0; q <= 6; q++) { const t = (q / 6) * Math.PI; ring.push(P(s + r * Math.cos(t), 2.9 + r * Math.sin(t), 0.05)) }
        for (let q = 1; q < ring.length - 1; q++) win.tri(ring[0], ring[q], ring[q + 1])
      }
    }
  }

  // --- Gables, with steep tiled roofs behind ------------------------------
  for (const f of GABLES) {
    const L = Math.hypot(f.b[0] - f.a[0], f.b[1] - f.a[1])
    const u: XY = [(f.b[0] - f.a[0]) / L, (f.b[1] - f.a[1]) / L], n: XY = [u[1], -u[0]]
    const P = (s: number, z: number, o: number): V3 => [f.a[0] + u[0] * s + n[0] * o, f.a[1] + u[1] * s + n[1] * o, z]
    for (const [s, w] of f.at) {
      const h = w * (w > 6 ? 1.15 : 1.35), top = EAVE + h, D = w > 6 ? 7.5 : 4.8, T = 0.5
      // the gable wall: front, back, and its white coping edges
      brick.tri(P(s - w / 2, EAVE, 0), P(s + w / 2, EAVE, 0), P(s, top, 0))
      brick.tri(P(s + w / 2, EAVE, -T), P(s - w / 2, EAVE, -T), P(s, top, -T))
      for (const sg of [-1, 1]) {
        const e0 = P(s + sg * (w / 2 + 0.25), EAVE - 0.1, 0.2), e1 = P(s, top + 0.35, 0.2)
        const f0 = P(s + sg * (w / 2 + 0.15), EAVE - 0.1, -T - 0.05), f1 = P(s, top + 0.25, -T - 0.05)
        const lift = (p: V3, d: number): V3 => [p[0], p[1], p[2] + d]
        // the coping: a band 0.35 deep over the slope
        if (sg < 0) { white.quad(e0, e1, f1, f0); white.quad(lift(e0, -0.6), e0, f0, lift(f0, -0.6)); white.quad(lift(e1, -0.6), lift(e0, -0.6), e0, e1) }
        else { white.quad(e1, e0, f0, f1); white.quad(e0, lift(e0, -0.6), lift(f0, -0.6), f0); white.quad(lift(e0, -0.6), lift(e1, -0.6), e1, e0) }
      }
      // a small white finial on the apex
      lathe(white, ...(P(s, 0, -T / 2).slice(0, 2) as [number, number]), [[0.32, top - 0.2], [0.32, top + 0.6], [0, top + 1.5]], 6)
      // the window in the gable
      const ww = Math.min(0.9, w * 0.22)
      win.quad(P(s - ww, EAVE + 0.8, 0.06), P(s + ww, EAVE + 0.8, 0.06), P(s + ww, EAVE + 2.4, 0.06), P(s - ww, EAVE + 2.4, 0.06))
      // the roof behind: two steep slopes back to a hipped end
      const l0 = P(s - w / 2, EAVE, -T), r0 = P(s + w / 2, EAVE, -T), a0 = P(s, top, -T)
      const l1 = P(s - w / 2, EAVE, -D), r1 = P(s + w / 2, EAVE, -D), a1 = P(s, top, -D + h * 0.6)
      tiles.quad(l0, a0, a1, l1)
      tiles.quad(a0, r0, r1, a1)
      tiles.tri(l1, a1, r1)
    }
  }

  // --- Towers ---------------------------------------------------------------
  for (const t of TOWERS) {
    const { x, y, r } = t
    if (!t.big) {
      const g0 = EAVE + 1.0, g1 = 24.0, cone = g1 + 0.5, tip = cone + 1.9 * 2 * r
      lathe(brick, x, y, [[r, EAVE - 0.5], [r, g0]], 14)
      lathe(white, x, y, [[r, g0], [r + 0.22, g0 + 0.15], [r + 0.22, g0 + 0.55], [r, g0 + 0.7]], 14)
      lathe(brick, x, y, [[r, g0 + 0.7], [r, g1]], 14)
      lathe(white, x, y, [[r, g1], [r + 0.45, g1 + 0.1], [r + 0.55, cone]], 14, { capTop: false })
      // the gallery's arched windows all round
      for (let k = 0; k < 8; k++) {
        const a0 = (k + 0.2) / 8 * 2 * Math.PI, a1 = (k + 0.8) / 8 * 2 * Math.PI, rr = r + 0.05
        win.quad([x + rr * Math.cos(a0), y + rr * Math.sin(a0), g0 + 0.95], [x + rr * Math.cos(a1), y + rr * Math.sin(a1), g0 + 0.95], [x + rr * Math.cos(a1), y + rr * Math.sin(a1), g1 - 0.3], [x + rr * Math.cos(a0), y + rr * Math.sin(a0), g1 - 0.3])
      }
      // the cone: red glazed tiles, green at the tip, a thin iron finial
      const rc = r + 0.55, zg = tip - 2.2
      lathe(tiles, x, y, [[rc, cone], [rc * 0.68, cone + (zg - cone) * 0.22], [rc * 0.4, cone + (zg - cone) * 0.58], [rc * 0.18, zg]], 14)
      lathe(green, x, y, [[rc * 0.2, zg], [rc * 0.1, zg + 1.6], [0, tip]], 8)
      lathe(green, x, y, [[0.09, tip - 0.2], [0.09, tip + 1.6], [0.2, tip + 1.7], [0, tip + 2.0]], 5)
    } else {
      // the big tower: a wider arcaded gallery, a squat cone, a white
      // open lantern and a second spire
      const g0 = 23.0, g1 = 26.5, rg = r + 0.35
      lathe(brick, x, y, [[r, EAVE - 0.5], [r, g0 - 0.6], [rg, g0]], 16)
      lathe(white, x, y, [[rg, g0], [rg + 0.15, g0 + 0.2], [rg, g0 + 0.5]], 16)
      lathe(brick, x, y, [[rg, g0 + 0.5], [rg, g1]], 16)
      for (let k = 0; k < 10; k++) {
        const a0 = (k + 0.18) / 10 * 2 * Math.PI, a1 = (k + 0.82) / 10 * 2 * Math.PI, rr = rg + 0.05
        win.quad([x + rr * Math.cos(a0), y + rr * Math.sin(a0), g0 + 0.9], [x + rr * Math.cos(a1), y + rr * Math.sin(a1), g0 + 0.9], [x + rr * Math.cos(a1), y + rr * Math.sin(a1), g1 - 0.4], [x + rr * Math.cos(a0), y + rr * Math.sin(a0), g1 - 0.4])
      }
      lathe(white, x, y, [[rg, g1], [rg + 0.35, g1 + 0.15], [rg + 0.4, g1 + 0.5]], 16)
      lathe(tiles, x, y, [[rg + 0.4, g1 + 0.5], [2.4, 28.2], [1.5, 29.2]], 16)
      // the lantern: white posts round an open core, pinnacles on top
      const zl0 = 29.2, zl1 = 32.4, rl = 1.45
      lathe(white, x, y, [[rl + 0.1, zl0], [rl + 0.1, zl0 + 0.35]], 12, { capTop: true })
      lathe(win, x, y, [[0.85, zl0 + 0.35], [0.85, zl1 - 0.2]], 10)
      for (let k = 0; k < 8; k++) {
        const a = (k / 8) * 2 * Math.PI, px = x + rl * Math.cos(a), py = y + rl * Math.sin(a)
        box(white, px - 0.17, py - 0.17, px + 0.17, py + 0.17, zl0 + 0.35, zl1, 0.05, false)
        lathe(white, px, py, [[0.22, zl1 + 0.3], [0, zl1 + 1.2]], 5)
      }
      lathe(white, x, y, [[rl + 0.2, zl1], [rl + 0.25, zl1 + 0.3], [rl * 0.75, zl1 + 0.5]], 12, { capTop: true })
      const tip = 41.0
      lathe(tiles, x, y, [[1.0, zl1 + 0.4], [0.7, zl1 + 2.3], [0.35, tip - 2.2]], 10)
      lathe(green, x, y, [[0.35, tip - 2.2], [0.15, tip - 0.6], [0, tip]], 8)
      lathe(green, x, y, [[0.09, tip - 0.2], [0.09, tip + 1.6], [0.2, tip + 1.7], [0, tip + 2.0]], 5)
    }
  }

  // Floodlit at night from the streets: the walls and the towers.
  const lit = (p: V3, n: V3) => (n[2] > 0.8 ? 0.2 : 0.45 + 0.4 * Math.min(1, p[2] / 34))
  return [
    { part: brick, material: { ...finish('punxes-brick', 0xc4835f), floodlight: lit } },
    { part: stone, material: { ...finish('punxes-stone', 0xcdbfa8), floodlight: lit } },
    { part: white, material: { ...PALETTE.trim, floodlight: lit } },
    { part: win, material: PALETTE.window },
    { part: tiles, material: { ...finish('punxes-tiles', 0xaa553d), floodlight: lit } },
    { part: green, material: PALETTE.copper },
  ] as { part: Part; material: Swatch }[]
}

if (import.meta.main) await save('barcelona-casa-de-les-punxes', 'Casa de les Punxes', [41.398028, 2.164014], 0, build(), 6500)
