/**
 * Texas State Capitol, Austin (1888, Elijah E. Myers) — original procedural
 * geometry, CC0-1.0.
 * bun generators/atx-texas-state-capitol.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground. Bearing 17.7: the model's north is the building's north
 * front, turned with Austin's street grid (OSM way/25758443's long walls run
 * at 107.7°). Anchor = the centre of that outline's box in the turned frame,
 * -97.7403239, 30.2747408.
 *
 * Identity (from the photos below):
 *  1. The tall dome over the crossing: a plain drum, a ring of columns, an
 *     attic of round-headed windows, a ribbed dome, a lantern and the
 *     Goddess of Liberty on top, 92 m up (taller than the US Capitol's).
 *                                                     (front, oblique, day)
 *  2. Pink "sunset red" granite throughout; the dome is painted to match.
 *  3. A long cross plan: a deep central block running north–south and two
 *     long wings east and west, ending in mansard-roofed corner pavilions
 *     with small cupolas.                              (oblique, pano, aerial)
 *  4. The south front's central pavilion: a giant recessed arch under a
 *     pediment.                                        (front, oblique, day)
 *  5. Low grey slate hip roofs over the wings.          (aerial, pano)
 *
 * Plan: OSM way/25758443 and its parts (wings way/1364720759 and
 * way/1364720760, centre way/1364720762, pavilions way/734639133–136, north
 * porch way/952130555, dome way/516187625 and way/1364720761), turned to
 * bearing 17.7 and made symmetric about x = 0 from the west half (OSM's
 * halves differ by under a metre). Small 0.6–0.8 m wall breaks are dropped.
 *
 * Heights: USGS 3DEP lidar, USGS_LPC_TX_Central_B1_2017, read in the model
 * frame with tools/lidar_frame.py; ground about 7.2 m. Measured: wing eaves
 * 24 m and ridges 27 m; pavilion roofs to 31 m; central block eaves 29.6 m,
 * ridge drawn at 33.5 m (lidar 36 m includes the drum's base); south and north pediments 38 and 37 m; the dome's profile
 * (radius 13.4 at 53 m, 12.2 at 60 m, about 10 at 68 m, 4.5 at 73 m) and
 * lantern top 84 m; balustrade over the colonnade about 53 m; north porch 22.7 m. Published: 92.2 m (302.64 ft) to
 * the top of the statue (Texas State Preservation Board), OSM 92 m.
 *
 * Estimated: the drum's tiers (plain drum, colonnade, attic) and the
 * column count, read off the photos and fitted to the lidar profile; the
 * lantern and statue proportions; window rows and bays; the big arch's
 * size; cupolas on the pavilions. Storeys on the north and wing ends are
 * assumed like the south (no photo close to them).
 *
 * Photos (evidence, Wikimedia Commons):
 *  front   "Texas State Capitol - Front.jpg", Chmorich.
 *  oblique "Texas State Capitol building-front left front oblique view.JPG",
 *          Daniel Mayer, CC BY-SA 3.0.
 *  day     "Texas capitol day.jpg", Larry D. Moore.
 *  pano    "Texas State Capitol - panoramio.jpg", hakkun.
 *  aerial  "TexasStateCapitol-2010-01.JPG", LoneStarMike, CC BY 3.0.
 *  south   "2025 Texas State Capitol 02.jpg", Farragutful, CC BY-SA 4.0.
 * (Licences for front, day and pano as given on their Commons pages: all
 * listed as evidence by tools/photos.py.)
 */
import { Part } from './mesh'
import { PALETTE, finish } from './palette'
import { archShape, ccw, cornice, gableRoof, hipRoof, onWall, prism, rectShape, revolve, save, type XY } from './atl-tech-tower'

const granite = new Part(), dome = new Part(), roof = new Part(), win = new Part(), metal = new Part()

const WING = 24, WING_RIDGE = 27.2, PAV_RIDGE = 31, CENTRE = 29.6, CENTRE_RIDGE = 33.5
const DC: XY = [0, -8] // the dome's centre

// ── Plan: the west halves from OSM, mirrored ──
const westWing: XY[] = [[-23.2, -24.2], [-55.5, -24.2], [-55.5, -34.5], [-79.3, -34.5], [-79.3, -20.9], [-83.6, -20.9], [-83.6, 5.2], [-79.3, 5.2], [-79.3, 19.6], [-55.4, 19.6], [-55.4, 8.8], [-23.2, 8.8]]
const mirror = (r: XY[]) => r.map(([x, y]) => [-x, y] as XY)
const wings = [ccw(westWing), ccw(mirror(westWing))]
const halfCentre: XY[] = [[0, -44.7], [-18.5, -44.7], [-18.5, -24.2], [-23.2, -24.2], [-23.2, 8.8], [-21.5, 8.8], [-21.5, 39.5], [0, 39.5]]
const centre = ccw([...halfCentre.slice(1, -1), ...mirror(halfCentre.slice(1, -1)).reverse()])
const porch = ccw([[-9.1, 39.5], [9.1, 39.5], [9.1, 44.7], [-9.1, 44.7]])

// ── Massing ──
for (const w of wings) {
  prism(granite, w, 0, WING, null, 0)
  cornice(dome, w, WING - 0.9, 0.9, 0.5, null)
}
prism(granite, centre, 0, CENTRE, null, 0)
cornice(dome, centre, CENTRE - 1, 1, 0.55, null)
prism(granite, porch, 0, 22.7, roof, 0.3)

// Roofs: the wings, their end bays, the corner pavilions, the centre.
for (const s of [-1, 1]) {
  const X = (a: number, b: number): [number, number] => (s < 0 ? [a, b] : [-b, -a])
  hipRoof(roof, ...X(-79.3, -23.2), -24.2, 8.8, WING, WING_RIDGE, 0.5)
  hipRoof(roof, ...X(-83.6, -79.3), -20.9, 5.2, WING, 26, 0.5)
  for (const [y0, y1] of [[4.2, 19.6], [-34.5, -19.1]]) {
    hipRoof(roof, ...X(-79.3, -55.5), y0, y1, WING, PAV_RIDGE, 0.5)
    // a small cupola and finial on the ridge
    const c: XY = [s * 67.4, (y0 + y1) / 2]
    revolve(dome, c, [[1.6, PAV_RIDGE - 1.5], [1.6, PAV_RIDGE + 1.2], [1.9, PAV_RIDGE + 1.5], [1.2, PAV_RIDGE + 2.6], [0.15, PAV_RIDGE + 3.6], [0, PAV_RIDGE + 4.6]], 8, Math.PI / 8, true)
  }
}
hipRoof(roof, -23.2, 23.2, -24.2, 8.8, CENTRE, CENTRE_RIDGE, 0.5)
hipRoof(roof, -21.5, 21.5, 8.8, 39.5, CENTRE, CENTRE_RIDGE, 0.5)
hipRoof(roof, -18.5, 18.5, -44.7, -24.2, CENTRE, 33, 0.5)
// The pediments, south and north.
gableRoof(roof, granite, -10.5, 10.5, -44.9, -34, CENTRE, 38, 'y', 0.4, 0.3)
gableRoof(roof, granite, -9, 9, 29, 39.7, CENTRE, 37, 'y', 0.4, 0.3)

// ── The dome ──
// Plain drum, colonnade (core, columns, entablature), attic, ribbed dome,
// lantern, lantern dome. Profile fitted to the lidar.
const N = 16, PH = Math.PI / N
revolve(dome, DC, [[14.8, CENTRE], [14.8, 39.4], [15.3, 39.6], [15.3, 40.2], [12.8, 40.2]], N, PH, true, false)
revolve(granite, DC, [[12.8, 40.2], [12.8, 51]], N, PH, true, false) // the colonnade's shaded core
revolve(dome, DC, [[12.8, 51], [15.2, 51], [15.2, 53.4], [13.2, 53.6], [13.2, 61.4], [13.6, 61.6], [13.6, 62], [12.2, 62]], N, PH, true, false)
const domeProf: [number, number][] = Array.from({ length: 7 }, (_, i) => {
  const r = 12.2 - (i / 6) * (12.2 - 3.2)
  return [r, 62 + 12.5 * Math.sqrt(1 - (r / 12.2) ** 2)]
})
revolve(dome, DC, [...domeProf, [3.2, 81], [3.6, 81.3], [3.6, 81.8], [2.4, 83.2], [0.5, 84.4], [0, 84.6]], N, PH, false, true)
// Columns round the drum.
for (let i = 0; i < 24; i++) {
  const a = (i / 24) * Math.PI * 2
  revolve(dome, [DC[0] + 14.1 * Math.cos(a), DC[1] + 14.1 * Math.sin(a)], [[0.55, 40.2], [0.48, 51]], 6, 0, true, false)
}
// Windows on the drum's faces: the colonnade's, the attic's arches, the lantern's.
const face = (r: number, i: number): [XY, XY] => {
  const a0 = PH + (i / N) * Math.PI * 2, a1 = PH + ((i + 1) / N) * Math.PI * 2
  return [[DC[0] + r * Math.cos(a0), DC[1] + r * Math.sin(a0)], [DC[0] + r * Math.cos(a1), DC[1] + r * Math.sin(a1)]]
}
for (let i = 0; i < N; i++) {
  const w = 2 * 12.8 * Math.sin(PH)
  onWall(win, ...face(12.8, i), archShape(w / 2, 1.9, 42.5, 48.4, 6))
  const wa = 2 * 13.2 * Math.sin(PH)
  onWall(win, ...face(13.2, i), archShape(wa / 2, 1.7, 55, 59.2, 6))
  if (i % 2 === 0) { const wl = 2 * 3.2 * Math.sin(PH); onWall(win, ...face(3.2, i), rectShape(0.15, wl - 0.15, 76, 79.5), 0.04) }
}
// The Goddess of Liberty: plinth, figure, raised star.
revolve(metal, DC, [[0.9, 84.4], [0.9, 85.4], [0.6, 85.6], [0.5, 87.5], [0.7, 89.5], [0.4, 90.6], [0.15, 91.2], [0.15, 92.2], [0, 92.2]], 6, 0, true, true)

// ── Windows ──
type Rows = [number, number][]
const LOW: Rows = [[2.4, 5.4], [7.6, 11.4], [13.4, 17.2], [19.2, 22.2]]
const HIGH: Rows = [...LOW, [24.6, 27.6]]
function windows(ring: XY[], rows: Rows, skipEdge: (a: XY, b: XY) => boolean, skip?: (a: XY, s: number, L: number, r: number) => boolean) {
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    if (skipEdge(a, b)) continue
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), k = Math.round(L / 3.6)
    if (k < 1) continue
    for (let j = 0; j < k; j++) {
      const s = ((j + 0.5) * L) / k
      rows.forEach(([z0, z1], r) => { if (!skip?.(a, s, L, r)) onWall(win, a, b, rectShape(s - 0.75, s + 0.75, z0, z1)) })
    }
  }
}
// Edges hidden inside the other blocks.
const inner = (a: XY, b: XY) => Math.abs(Math.abs(a[0]) - 23.2) < 0.05 && Math.abs(Math.abs(b[0]) - 23.2) < 0.05
for (const w of wings) windows(w, LOW, inner)
const south = (a: XY, s: number, L: number, r: number) => Math.abs(a[1] + 44.7) < 0.05 && L > 30 && Math.abs(s - L / 2) < 6.5 && r >= 1 && r <= 3
windows(centre, HIGH, inner, south)
windows(porch, LOW.slice(0, 3), (a, b) => a[1] < 40 && b[1] < 40)
// The south front's giant arch.
onWall(win, [-18.5, -44.7], [18.5, -44.7], archShape(18.5, 10, 7, 17, 10), 0.06)

// Night: the dome and the centre's fronts are floodlit.
await save('atx-texas-state-capitol', 'Texas State Capitol', [
  { part: granite, material: { ...finish('capitol-granite', 0xd6a28c), floodlight: (p, n) => (n[2] < 0.5 && Math.abs(p[0]) < 24 ? 0.6 : 0) } },
  { part: dome, material: { ...finish('capitol-dome', 0xe8cbb6), floodlight: (p, n) => (p[2] > CENTRE && n[2] < 0.9 ? 0.9 : 0) } },
  { part: roof, material: finish('capitol-slate', 0x939c99) },
  { part: win, material: PALETTE.window },
  { part: metal, material: { ...finish('capitol-statue', 0x7d7f80), floodlight: () => 0.7 } },
], { height: 92.2, anchor: [30.2747408, -97.7403239], bearing: 17.7 }, 6500)
