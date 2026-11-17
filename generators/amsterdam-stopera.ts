/**
 * Stopera (Stadhuis-Muziektheater), Amsterdam — procedural, CC0-1.0, no textures.
 * bun generators/amsterdam-stopera.ts
 *
 * The combined city hall and opera house on the Waterlooplein (Wilhelm
 * Holzbauer and Cees Dam, 1986), one model for the whole complex: the
 * Muziektheater's faceted front of white marble and big glass bays
 * curving along the Amstel, with the red-brick drum of the auditorium
 * ("NATIONALE OPERA & BALLET") rising behind it and the stage house's low
 * glazed crown above; behind and round it, the city hall's red-brick office
 * wings of six storeys with their punched windows and sloped top storeys,
 * low inner wings, and the glass-roofed passage between the two.
 *
 * Map frame: x = model east (bearing 127.7°), y = model north (bearing
 * 37.7°), z up, metres. The Amstel front faces −y (south-west). Placed at
 * bearing 37.7° (the outlines' long edges, 127.6° and 37.8°). Anchor: the
 * area centroid of the two outlines together (lng 4.900865, lat 52.367799).
 *
 * Evidence
 * - OSM: way/751591420 (Nationale Opera en Ballet, building=government,
 *   wikidata Q1325514) and way/268782345 (the city hall, building=office,
 *   alt_name Stopera), both ref:bag 0363100012186092, start_date 1985, and
 *   their 23 building:parts (751559653–751559665, 751567319–751567321,
 *   751573304–751573306, 751591418–751591419, 751612860–751612862), whose
 *   plans this model follows. OSM's part heights (22, 18, 13, 10, 9, 5 m)
 *   are rounded; the 3D BAG is used instead.
 * - 3D BAG (3dbag.nl, CC BY 4.0, TU Delft / 3DGI), NL.IMBAG.Pand.
 *   0363100012186092, LoD2.2 roofs from AHN lidar, sampled on a 4 m grid in
 *   this frame (ground NAP +0.87): city hall north and west wings 23.0, their
 *   stair towers 26.9; inner wings 12.5, 9.0 and 5.3; the south-west corner
 *   15.8 and 19.0; opera auditorium ring 22.2–22.3; foyer ring 15.2; the
 *   opera's rear blocks 19.6 and 23.7, the side block 12.6, the west link
 *   9.4, the passage 8.9. Over the stage the BAG has a plane rising from
 *   13.5 to 36.4 m across 60 m; no photo shows such a slope (the stage
 *   house reads level and low behind the drum in every view of the river
 *   front), so it is treated as a reconstruction error and the stage house
 *   is drawn level at 24.5 from the photos.
 * - Photos (Wikimedia Commons, all EVIDENCE):
 *   - Fred Romero, "Amsterdam - Stopera (30213475601).jpg", CC BY 2.0 —
 *     the opera front straight across the Amstel: white facets, glass
 *     bays, red drum, stage house crown.
 *     https://commons.wikimedia.org/wiki/File:Amsterdam_-_Stopera_(30213475601).jpg
 *   - Michielverbeek, "Amsterdam, de Stopera vanaf de Blauwbrug IMG 1096
 *     2026-04-06 14.38.jpg", CC BY 4.0 — the same front from the bridge.
 *     https://commons.wikimedia.org/wiki/File:Amsterdam,_de_Stopera_vanaf_de_Blauwbrug_IMG_1096_2026-04-06_14.38.jpg
 *   - Txllxt TxllxT, "Amsterdam - Amstel - View East on Stopera Theatre -
 *     City Hall.jpg", CC BY-SA 4.0 — from the west along the Amstel.
 *     https://commons.wikimedia.org/wiki/File:Amsterdam_-_Amstel_-_View_East_on_Stopera_Theatre_-_City_Hall.jpg
 *   - Txllxt TxllxT, "Amsterdam - Waterlooplein - View West along the
 *     Stopera - City Hall & Opera House 1986.jpg", CC BY-SA 4.0 — the
 *     opera's east corner from the Waterlooplein.
 *     https://commons.wikimedia.org/wiki/File:Amsterdam_-_Waterlooplein_-_View_West_along_the_Stopera_-_City_Hall_%26_Opera_House_1986.jpg
 *   - Chabe01, "Hôtel Ville - Amsterdam (NL32) - 2024-11-25 - 2.jpg",
 *     CC BY-SA 4.0 — a city hall wing: red brick, six storeys of windows,
 *     the sloped top storey, glazed ground floor.
 *     https://commons.wikimedia.org/wiki/File:H%C3%B4tel_Ville_-_Amsterdam_(NL32)_-_2024-11-25_-_2.jpg
 * - From the 3D BAG and Romero's photo (the setbacks allowed for): white
 *   front 15.2 m (the BAG's outer ring), the drum a circle of 31 m radius
 *   rising to 22.2, the fly tower 34 m with a glazed band under its top;
 *   glass bays 4.8–12.6 m; window rows counted on the photo.
 *
 * Colour: white marble (trim), red-brown brick for the city hall and the
 * drum, grey flat roofs, slate windows, pale glass for the passage roof and
 * the glass rotunda at the west corner.
 *
 * Night: the glass bays and windows glow; the white front is floodlit.
 *
 * Doubts: the faceting of the opera front follows OSM's outline, simplified;
 * the gold lettering on the drum is left out; the courtyard sides of the
 * city hall wings are drawn like the street sides; the inner wings' heights
 * are BAG only (no photo).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { finishModel, prism, capPoly, quadN, unit, type Facade, type XY } from './nyc-570-lexington'
import { rectPanel } from './nyc-city-hall'

const marble = new Part(), brick = new Part(), roof = new Part(), win = new Part(), glass = new Part()

const office: Facade = { bay: 3.6, ratio: 0.55, floor: 3.4, group: 2, spandrel: 1.3, sill: 1.0, head: 2.6, ground: 1.0, minLength: 4 }
const low: Facade = { bay: 3.0, ratio: 0.55, floor: 3.4, group: 1, spandrel: 1.0, sill: 0.9, head: 1.0, minLength: 4 }

/** A brick block with office windows and, for the tall wings, a sloped top storey. */
function wing(ring: XY[], h: number, f: Facade | null, slope = 0) {
  const pts = prism({ wall: brick, win, roof: slope ? null : roof, coping: brick, ring, z0: 0, z1: h - slope, facade: f, bevel: 0.4 })
  if (!slope) return
  // The top storey: brick sloping inward 1.6 m, flat roof.
  const inner = shrink(pts, 1.6)
  for (let i = 0; i < pts.length; i++) {
    const j = (i + 1) % pts.length
    const a: V3 = [pts[i][0], pts[i][1], h - slope], b: V3 = [pts[j][0], pts[j][1], h - slope]
    const c: V3 = [inner[j][0], inner[j][1], h], d: V3 = [inner[i][0], inner[i][1], h]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]); if (L < 1e-6) continue
    const n = unit([(b[1] - a[1]) / L, -(b[0] - a[0]) / L, 1.6 / slope])
    quadN(brick, a, b, c, d, [n, n, n, n])
    // Dormer-like window band in the slope.
    if (L > 6) {
      const m = (t: number, s: number): V3 => [a[0] + (b[0] - a[0]) * t + (inner[i][0] - pts[i][0]) * s + n[0] * 0.05, a[1] + (b[1] - a[1]) * t + (inner[i][1] - pts[i][1]) * s + n[1] * 0.05, h - slope + slope * s + n[2] * 0.05]
      const cnt = Math.round(L / 3)
      for (let k = 0; k < cnt; k++) {
        const t0 = (k + 0.25) / cnt, t1 = (k + 0.75) / cnt
        win.quad(m(t0, 0.2), m(t1, 0.2), m(t1, 0.75), m(t0, 0.75))
      }
    }
  }
  capPoly(roof, inner, h)
}
function shrink(ring: XY[], d: number): XY[] {
  const n = ring.length
  return ring.map((b, i) => {
    const a = ring[(i + n - 1) % n], c = ring[(i + 1) % n]
    const u = unit([b[1] - a[1], a[0] - b[0], 0]), v = unit([c[1] - b[1], b[0] - c[0], 0])
    const k = 1 + u[0] * v[0] + u[1] * v[1]
    return [b[0] - (u[0] + v[0]) * d / k, b[1] - (u[1] + v[1]) * d / k] as XY
  })
}

// ---------------------------------------------------------------- city hall
// North wing (along the Waterlooplein/Jodenbreestraat side) and west wing, an L, 23 m.
wing([[-89.9, 60.4], [-88.7, 41.3], [-68.8, 41.9], [87.7, 52.6], [87.1, 61.1], [73.9, 60.3], [64.1, 70.8], [14.5, 67.3], [-43.6, 63.5]], 23.0, office, 3.4)
wing([[-82.8, -49.1], [-63.4, -47.9], [-68.3, 35.5], [-68.8, 41.9], [-88.7, 41.3], [-88.3, 34.3]], 23.0, office, 3.4)
// Stair towers to 26.9.
for (const [x, y] of [[-44, 52], [10, 56], [62, 60], [-80, 30], [-78, -22]] as XY[])
  prism({ wall: brick, win: null, roof, ring: [[x - 3, y - 3], [x + 3, y - 3], [x + 3, y + 3], [x - 3, y + 3]], z0: 20, z1: 26.9, facade: null, bevel: 0.4 })
// Inner wings, stepping down toward the opera.
wing([[-63.4, -47.9], [-48.6, -46.9], [-53.5, 36.4], [-68.3, 35.5]], 12.5, low)
wing([[-53.5, 36.4], [-48.6, -46.9], [-32.5, -45.8], [-39.2, 37.3]], 9.0, low)
wing([[-32.5, -74.1], [-25.3, -73.6], [-27.0, -45.3], [-3.5, -43.5], [-5.2, -19.2], [-17.1, -21.9], [-28.6, -22.7], [-32.0, 31.5], [-29.3, 38.0], [-39.2, 37.3]], 5.3, low)
// South-west corner along the Amstel: 9 m with a 15.8/19.0 block.
wing([[-69.9, -77.7], [-32.5, -75.2], [-32.5, -45.8], [-48.6, -46.9], [-71.7, -48.5]], 9.0, low)
wing([[-68.7, -77.3], [-44.8, -75.6], [-46.1, -53.7], [-70.0, -55.5]], 15.8, office)
wing([[-66.4, -77.1], [-52.0, -76.1], [-52.8, -62.9], [-67.2, -63.9]], 19.0, office)

// The glass-roofed passage between city hall and opera: low walls and a
// gabled glass roof, 5 → 7 m.
{
  const y0 = 37.0, y1 = 44.5, x0 = -68, x1 = 72.9, zr = 7.0, ze = 5.0
  const yr = (y0 + y1) / 2
  const A: V3 = [x0, y0, ze], B: V3 = [x1, y0, ze], C: V3 = [x1, y1 + 3.2, ze], D: V3 = [x0, y1 - 3.2, ze]
  // The north wing's south face is skewed; the roof follows it loosely.
  glass.quad(A, B, [x1, yr + 1.6, zr], [x0, yr - 1.6, zr])
  glass.quad(D, [x0, yr - 1.6, zr], [x1, yr + 1.6, zr], C)
}

// ---------------------------------------------------------------- opera: rear blocks
wing([[-9.0, 30.2], [82.6, 34.2], [82.6, 39.3], [-9.0, 39.2]], 8.9, low)
wing([[-23.9, -0.7], [-1.4, -0.8], [-1.3, 30.1], [-23.7, 30.1]], 9.4, low)
wing([[-1.5, -22.0], [7.0, -28.4], [7.0, 33.3], [-1.3, 33.2]], 12.6, low)
wing([[7.0, -28.4], [82.4, -28.2], [82.6, 34.2], [7.0, 33.3]], 19.6, office)
wing([[7.5, 9.5], [33.0, 9.5], [33.0, 30.0], [7.5, 30.0]], 23.7, null)
wing([[55.5, 9.5], [79.0, 9.5], [79.0, 30.0], [55.5, 30.0]], 23.7, null)
// Glass rotunda at the west corner, between the opera front and the city hall.
{
  const ring: XY[] = [[-20.9, -0.8], [-1.4, -0.8], [-1.5, -22.0], [-5.2, -19.2], [-8.2, -19.1], [-11.2, -18.6], [-14.1, -17.6], [-16.6, -16.0], [-18.7, -13.9], [-20.4, -11.5], [-21.7, -8.8], [-22.3, -5.9], [-22.5, -2.6]]
  prism({ wall: glass, win: null, roof, coping: marble, ring, z0: 0, z1: 10, facade: null, bevel: 0.3 })
}

// ---------------------------------------------------------------- opera: white front
const FRONT: XY[] = [[-5.2, -19.2], [-3.5, -43.5], [-3.0, -49.0], [11.0, -64.8], [30.2, -72.9], [50.6, -72.9], [69.6, -64.8], [84.0, -49.8], [90.9, -31.3], [82.4, -28.2], [7.0, -28.4]]
const WH = 15.2
const frontPts = prism({
  wall: marble, win: null, roof, coping: marble, ring: FRONT, z0: 0, z1: WH, facade: null, bevel: 0.35,
})
// Facades on the river facets: big glass bays alternating with punched windows.
for (let i = 0; i < FRONT.length; i++) {
  const a = FRONT[i], b = FRONT[(i + 1) % FRONT.length]
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  // Facets facing the river, the Amstel quay and the Waterlooplein.
  const nx = (b[1] - a[1]) / L, ny = -(b[0] - a[0]) / L
  if (ny > 0.3) continue // the back edge
  if (L < 8) continue
  const big = i % 2 === 0
  if (big) {
    // Two glass bays 3 storeys tall over a glazed ground storey.
    for (const s of [0.28, 0.72]) rectPanel(win, a, b, L * s, L * 0.32, 4.8, 12.6, 0.06)
    rectPanel(win, a, b, L / 2, L - 3, 0.4, 3.6, 0.06)
  } else {
    const n = Math.max(2, Math.round(L / 3.4))
    for (let k = 0; k < n; k++) {
      const s = (L * (k + 0.5)) / n
      rectPanel(win, a, b, s, 2.0, 0.4, 3.6, 0.06)
      rectPanel(win, a, b, s, 1.9, 4.6, 7.6, 0.06)
      rectPanel(win, a, b, s, 1.9, 8.8, 11.8, 0.06)
    }
  }
  // The row of small brick "crenels" under the top edge.
  const m = Math.max(3, Math.round(L / 1.6))
  for (let k = 0; k < m; k++) rectPanel(brick, a, b, (L * (k + 0.5)) / m, 0.7, 13.0, 14.2, 0.04)
  void nx
}
void frontPts

// ---------------------------------------------------------------- opera: drum and stage house
{
  const cx = 40.0, cy = -29.5, r = 31.0, n = 20
  const arc: XY[] = Array.from({ length: n + 1 }, (_, i) => { const t = Math.PI + (Math.PI * i) / n; return [cx + r * Math.cos(t), cy + r * Math.sin(t)] as XY })
  prism({ wall: brick, win: null, roof, coping: brick, ring: arc, z0: WH - 0.5, z1: 22.2, facade: null, bevel: 0.3 })
  // The fly tower behind the drum: level top at 34 m, a glazed band under it.
  const sh: XY[] = [[30, -27.5], [62, -27.5], [62, -6], [30, -6]]
  prism({ wall: brick, win: null, roof, coping: brick, ring: sh, z0: 19.6, z1: 34.0, facade: null, bevel: 0.3 })
  rectPanel(glass, [30, -27.5], [62, -27.5], 16, 30, 32.3, 33.4, 0.06)
  rectPanel(glass, [62, -6], [30, -6], 16, 30, 32.3, 33.4, 0.06)
}

// ---------------------------------------------------------------- write
const flood = (p: V3, n: V3) => (n[1] < -0.2 && p[2] < WH + 0.1 && p[1] < -18 ? 0.6 : 0)
finishModel('Stopera', 'amsterdam-stopera', [
  { part: marble, material: { ...finish('stopera-marble', 0xf1eee7), floodlight: flood } },
  { part: brick, material: finish('stopera-brick', 0x93604f) },
  { part: roof, material: PALETTE.roof },
  { part: win, material: PALETTE.window },
  { part: glass, material: { ...PALETTE.glass, color: 0x9fbdd0 } },
], { bearing: 37.7, osm: 'way/751591420', height: 34.0 }, 6500)
