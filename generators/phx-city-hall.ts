/**
 * Phoenix City Hall (1994, Langdon Wilson with Barton Myers; 20 storeys) —
 * original procedural geometry, CC0-1.0.
 * bun generators/phx-city-hall.ts
 *
 * Map frame: x east, y north, z up, metres; origin on the ground at the
 * anchor. Bearing 0: the OSM walls run north–south and east–west. Anchor
 * -112.0772115, 33.4487571, the centroid of OSM way/109819775 ("Phoenix
 * City Hall", 200 W Washington Street, wikidata Q2088508). Its building
 * parts way/209097281, way/209097284, way/209097285, way/209097286,
 * way/209097290, way/209097294, way/209724711 and way/209724712 are all
 * drawn by this model. The Orpheum Theatre (way/109819768) stands against
 * its north-east side and is its own model.
 *
 * Identity (from the photos below):
 *  1. A tower of pinkish-tan precast stone in a deep square grid of
 *     punched windows, stepping down east and south in terraces, each
 *     step's corner notched with balconies.                     (v3)
 *  2. The top: an open square frame round the roof edge, and behind it a
 *     tall drum of white vertical fins (the "curved top").      (v3)
 *  3. A podium of red sandstone with pale stone piers and glass, round the
 *     forecourt and fountain on Washington Street.            (v1, gage)
 *
 * Plan: the OSM outline and parts as drawn, in model metres. Tiers (OSM
 * part → height): the outline 16.2; way/209097281 23.6; way/209724712
 * 44.6; way/209724711 52.2 along its north band and 64.6 east and south of
 * the tower (lidar shows the step); the tower way/209097290 85.2; the drum
 * way/209097284 (r 14) to 95.6 and its core way/209097285 to 98.5; the
 * mast way/209097286 to 103.5.
 *
 * Heights: USGS 3DEP lidar AZ_MaricopaPinal_1_2020 (2020 flight), 1 m grid;
 * the street 0.6 m above ground_min 330.62 is y = 0. Every tier height
 * above is measured; OSM's tagged heights (28, 56, 84, 112, 117.6, 123.2,
 * 128.8 m) run about 15–25 % high and are not used. Published: 20 storeys,
 * 1994, often given as 112 m (368 ft) tall; the lidar's highest return is
 * 105 m, on the mast.
 * Estimated from v3: the window grid (3.6 m bays, panels two storeys
 * tall), the frame (5 m tall), the fins.
 *
 * Photos (evidence, Wikimedia Commons):
 *  v3   "Phoenix City Hall-3.jpg", Visitor7, CC BY-SA 3.0: the tower from
 *       the south-west, the crown, the steps
 *       https://commons.wikimedia.org/wiki/File:Phoenix_City_Hall-3.jpg
 *  v1   "Phoenix City Hall-1.jpg", Visitor7, CC BY-SA 3.0: the podium on
 *       Washington Street, sandstone and piers
 *       https://commons.wikimedia.org/wiki/File:Phoenix_City_Hall-1.jpg
 *  gage "Phoenix City Hall (25325678478).jpg", Gage Skidmore, CC BY-SA 2.0:
 *       the podium's sun sculpture and fins
 *       https://commons.wikimedia.org/wiki/File:Phoenix_City_Hall_(25325678478).jpg
 * No look-only sources. No commercial imagery.
 *
 * Doubts: only the south and west faces are well photographed; the north
 * and east are drawn the same. The terraces' balconies, the podium's sun
 * sculpture and the fountain are left out. The drum's fins are drawn
 * evenly all round; the photo shows them only on its south side clearly.
 *
 * Night: the office windows glow; the fin drum is lightly floodlit.
 */
import { Part } from './mesh'
import { PALETTE, finish } from './palette'
import { box, ccw, edgePanels, prism, revolve, save, type XY } from './atl-tech-tower'
import { exposed, inside, type Block } from './phx-chase-tower'
import { edges, ngon, wallLen } from './phx-st-marys-basilica'

const pre = new Part(), sand = new Part(), win = new Part(), roof = new Part(), white = new Part()

const OUTLINE = ccw([[5.11, 49.65], [5.15, 38.97], [5.17, 33.14], [5.21, 23.98], [5.25, 14.80], [5.27, 7.28], [20.75, 7.35], [49.02, 7.45], [49.01, 4.57], [50.75, 4.58], [50.82, 1.08], [50.88, -2.14], [49.31, -2.15], [49.33, -2.89], [49.34, -3.51], [53.32, -5.81], [50.15, -10.52], [47.15, -14.16], [43.86, -17.88], [40.50, -21.46], [36.81, -24.69], [33.17, -27.55], [28.53, -30.64], [24.65, -32.99], [19.82, -35.31], [15.80, -37.06], [11.04, -38.66], [6.42, -40.18], [1.30, -41.14], [-3.09, -41.80], [-3.36, -37.28], [-7.77, -37.81], [-12.36, -38.28], [-21.79, -38.32], [-21.72, -32.30], [-31.31, -32.26], [-31.58, 1.61], [-31.93, 14.80], [-32.07, 23.95], [-31.88, 32.87], [-32.25, 49.23], [-19.25, 49.31], [-11.04, 49.36], [-1.91, 49.47]])
const P281 = ccw([[-32.07, 23.95], [-31.88, 32.87], [5.17, 33.14], [5.21, 23.98], [5.25, 14.80], [5.27, 7.28], [5.70, -3.25], [13.28, -3.21], [21.65, -3.15], [30.48, -3.09], [30.46, -23.25], [30.10, -23.99], [22.02, -28.90], [17.85, -30.97], [13.69, -32.73], [9.97, -34.14], [6.27, -35.42], [1.11, -36.54], [-3.36, -37.28], [-7.77, -37.81], [-12.36, -38.28], [-21.79, -38.32], [-21.72, -32.30], [-31.31, -32.26], [-31.58, 1.61], [-31.93, 14.80]])
const P712 = ccw([[-32.07, 23.95], [5.21, 23.98], [5.25, 14.80], [5.27, 7.28], [5.70, -3.25], [13.28, -3.21], [21.65, -3.15], [22.02, -28.90], [17.85, -30.97], [13.69, -32.73], [9.97, -34.14], [6.27, -35.42], [1.11, -36.54], [-3.36, -37.28], [-7.77, -37.81], [-12.36, -38.28], [-21.79, -38.32], [-21.72, -32.30], [-31.31, -32.26], [-31.58, 1.61], [-31.93, 14.80]])
const P711 = ccw([[-32.07, 23.95], [5.21, 23.98], [5.25, 14.80], [5.27, 7.28], [5.70, -3.25], [13.28, -3.21], [13.69, -32.73], [9.97, -34.14], [6.27, -35.42], [1.11, -36.54], [-3.36, -37.28], [-7.77, -37.81], [-12.36, -38.28], [-21.79, -38.32], [-21.72, -32.30], [-31.31, -32.26], [-31.58, 1.61], [-31.93, 14.80]])
// the 711 tier's higher east and south step (lidar 65 m) round the tower
const P711S = ccw([[5.70, -3.25], [13.28, -3.21], [13.69, -32.73], [9.97, -34.14], [6.27, -35.42], [1.11, -36.54], [-3.36, -37.28], [-7.77, -37.81], [-12.36, -38.28], [-21.79, -38.32], [-21.72, -32.30], [5.98, -31.83]])
const TOWER = ccw([[-31.93, 14.80], [5.25, 14.80], [5.27, 7.28], [5.70, -3.25], [5.98, -31.83], [-21.72, -32.30], [-31.31, -32.26], [-31.58, 1.61]])
// the Orpheum against the north-east side, only to hide the party wall's windows
const ORPHEUM: Block = { ring: ccw([[5.2, 7.3], [60, 7.3], [60, 52], [5.2, 52]]), z0: 0, z1: 25.6 }

const TIERS: Array<{ b: Block; mat: Part }> = [
  { b: { ring: OUTLINE, z0: 0, z1: 16.2 }, mat: sand },
  { b: { ring: P281, z0: 0, z1: 23.6 }, mat: sand },
  { b: { ring: P712, z0: 0, z1: 44.6 }, mat: pre },
  { b: { ring: P711, z0: 0, z1: 52.2 }, mat: pre },
  { b: { ring: P711S, z0: 0, z1: 64.6 }, mat: pre },
  { b: { ring: TOWER, z0: 0, z1: 85.2 }, mat: pre },
]
const all = [...TIERS.map((t) => t.b), ORPHEUM]

/** Distance from a point to a ring's boundary. */
const toRing = (p: XY, ring: XY[]) => Math.min(...ring.map((a, i) => {
  const b = ring[(i + 1) % ring.length], dx = b[0] - a[0], dy = b[1] - a[1], L2 = dx * dx + dy * dy || 1
  const t = Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / L2))
  return Math.hypot(p[0] - a[0] - t * dx, p[1] - a[1] - t * dy)
}))

for (const { b, mat } of TIERS) {
  // a tier's walls start on the highest lower tier that holds its whole plan
  let from = 0
  for (const o of TIERS) if (o.b.z1 < b.z1 && b.ring.every((q) => inside(q, o.b.ring) || toRing(q, o.b.ring) < 0.4)) from = Math.max(from, o.b.z1)
  prism(mat, b.ring, from, b.z1, roof, 0.35)
  for (const [a, c, zf] of exposed(b, all)) {
    if (zf > b.z1 - 1) continue
    // where a lower tier's wall runs in the same plane, it owns the wall up to its top
    const m: XY = [(a[0] + c[0]) / 2, (a[1] + c[1]) / 2]
    let z0 = zf
    for (const o of TIERS) if (o.b.z1 < b.z1 && toRing(m, o.b.ring) < 0.4) z0 = Math.max(z0, o.b.z1)
    if (mat === sand) {
      // the podium: tall glazed bays between sandstone piers
      edgePanels(win, a, c, Math.max(z0, 0) + 1.0, b.z1 - 1.6, { group: b.z1 - 1.6 - Math.max(z0, 0) - 1.0, gap: 0, bay: 4.2, pier: 1.4, margin: 1.0, min: 3 })
    } else {
      // the precast grid: a panel per bay, two storeys tall, spandrels between
      const lo = Math.max(z0, 0)
      const bands = Math.max(1, Math.round((b.z1 - 1.2 - lo) / 8.4))
      edgePanels(win, a, c, lo + 0.6, b.z1 - 1.2, { group: (b.z1 - 1.8 - lo) / bands, gap: 1.3, bay: 3.6, pier: 1.0, margin: 0.9, min: 2.5 })
    }
  }
}

// ── The crown: the open frame round the tower roof, the fin drum, the mast ──
{
  const z0 = 85.2, z1 = 90.4
  const FR = [[-31.6, -32.0], [5.6, -32.0], [5.6, 14.5], [-31.6, 14.5]] as XY[]
  edges(FR, (a, b) => {
    const L = wallLen(a, b), n = Math.round(L / 7.5)
    const t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
    for (let k = 0; k <= n; k++) {
      const p: XY = [a[0] + t[0] * (k * L) / n, a[1] + t[1] * (k * L) / n]
      box(white, p[0] - 0.45, p[0] + 0.45, p[1] - 0.45, p[1] + 0.45, z0, z1, white, 0.1)
    }
    // the beam along the top
    const x0 = Math.min(a[0], b[0]) - 0.45, x1 = Math.max(a[0], b[0]) + 0.45, y0 = Math.min(a[1], b[1]) - 0.45, y1 = Math.max(a[1], b[1]) + 0.45
    box(white, x0, x1, y0, y1, z1 - 0.9, z1, white, 0.1)
  })
  const DC: XY = [-13.4, -13.1]
  revolve(win, DC, [[12.6, z0], [12.6, 94.6]], 16, 0, true, false)
  revolve(roof, DC, [[12.7, 94.6], [0, 94.6]], 16, 0, true, false)
  const fins = 24
  for (let i = 0; i < fins; i++) {
    const a = (i / fins) * Math.PI * 2, c = Math.cos(a), s = Math.sin(a), tx = -s, ty = c
    const P = (r: number, w: number): XY => [DC[0] + c * r + tx * w, DC[1] + s * r + ty * w]
    prism(white, ccw([P(12.5, -0.25), P(14.0, -0.25), P(14.0, 0.25), P(12.5, 0.25)]), z0, 95.6, white, 0)
  }
  revolve(white, DC, [[14.1, 95.1], [14.1, 95.6], [12.4, 95.6]], 32, 0, true, false) // the ring tying the fins' tops
  revolve(roof, [-13.3, -20.0], [[6.7, 94.6], [6.7, 98.5], [0, 98.5]], 16, 0, true, false)
  revolve(white, [-12.9, -30.3], [[0.45, 85.2], [0.3, 103.5], [0, 103.6]], 8, 0, false, false)
}

void ngon
await save('phx-city-hall', 'Phoenix City Hall', [
  { part: pre, material: finish('city-hall-precast', 0xe6d0bd) },
  { part: sand, material: finish('city-hall-sandstone', 0xbf8574) },
  { part: win, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
  { part: white, material: { ...finish('city-hall-fins', 0xf3eee6), floodlight: (p, n) => (p[2] > 85 && n[2] < 0.5 ? 0.5 : 0) } },
], { height: 103.6, anchor: [33.4487571, -112.0772115], bearing: 0 })
