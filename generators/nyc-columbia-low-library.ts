/**
 * Low Memorial Library, Columbia University, Morningside Heights, New York
 * (1895–97, McKim, Mead & White) — original procedural geometry, CC0-1.0.
 * bun generators/nyc-columbia-low-library.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * plaza round the building. Bearing 29.8: the model's north is the campus
 * grid's (the building's arms run with Manhattan's street grid). Anchor =
 * the Nominatim centre of OSM way/274995757, -73.9618351, 40.8082225, which
 * lands within 0.3 m of the outline's centre.
 *
 * Identity (from the photos below):
 *  1. A shallow saucer dome on a tall chamfered-square drum with a big
 *     semicircular lunette on each face.                  (above, front)
 *  2. A pale limestone Greek cross with chamfered inner corners. (above, OSM)
 *  3. The south portico: ten Ionic columns in front of a recessed porch,
 *     a deep entablature, and the tall inscribed attic above. (ajay, front)
 *  4. The steps up to it: a narrow flight between two pedestals, a landing
 *     and a wide flight to Low Plaza.                     (front, ajay, lidar)
 *
 * Plan: OSM way/274995757 (building) and its parts way/901695416 (the
 * cross), way/901695414 (the drum), way/901695415 (the dome), turned to
 * bearing 29.8 and made symmetric: arms 34.4 m wide, reaching x ±29.8 and
 * y ±30.5; inner corners chamfered 4.3 m; drum ±17 m with 6 m chamfers;
 * dome radius 15 m.
 *
 * Heights: USGS 3DEP lidar, NY_NewYorkCity, read in the model frame with
 * tools/lidar_frame.py; plaza at 3.0 m. Measured: arms and attic 21.5 m,
 * portico entablature 17.2 m, drum 31.5 m, dome springing about 33.6 m and
 * crown 41.9 m (a spherical cap, radius 17.7 m, fits the profile within
 * 1 m), portico floor 2.9 m above the plaza, the steps falling from it to
 * the plaza about 11 m south of the columns. OSM's 20, 25 and 32 m are low.
 *
 * Estimated: column size and spacing and the porch depth (from ajay and
 * front), the window rows and bays (from ajay; the north and side fronts
 * are assumed to follow the same rhythm), the landing and the wide
 * flight's width (drawn as wide as the building, ±29.8 m; the real flight runs further, to the urns at about ±40 m), the pedestals. The
 * cresting, urns, lamp standards, inscriptions, dome ribs and the Alma
 * Mater statue are left out.
 *
 * Photos (evidence), all on Wikimedia Commons:
 *  front  "Low Memorial Library.jpg", Marco Almbauer, public domain — the
 *         south front square on from Low Plaza.
 *  ajay   "Columbia University - Low Memorial Library (48170370506).jpg",
 *         Ajay Suresh, CC BY 2.0 — the portico and steps close up.
 *  above  "Low Memorial Library from above 04 14 17.jpg", Daniel Case,
 *         CC BY-SA 2.5 — the drum, lunette and dome from high to the south.
 *  rear   "Rear View of Low Memorial Library.tif", Indira Abiskaroon,
 *         public domain.
 *  cc0    "Low Memorial Library - Columbia University.jpg", Spaghet-Ti, CC0.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { archShape, box, ccw, cornice, onWall, prism, rectShape, revolve, save, wall, type XY } from './atl-tech-tower'

const stone = new Part(), trim = new Part(), dome = new Part(), win = new Part(), door = new Part()

const A = 17.2, EX = 29.8, NY = 30.5, C = 4.3 // arm half-width, arm ends, inner chamfer
const PODIUM = 2.9, CORNICE = 17.2, ATTIC = 21.5, DRUM = 31.5, SPRING = 33.6, CROWN = 41.9
const PORCH = 14, PORCH_WALL = -28.5 // the porch: x ±14, its back wall

const cross = ccw([
  [A, -NY], [A, -A - C], [A + C, -A], [EX, -A], [EX, A], [A + C, A], [A, A + C], [A, NY],
  [-A, NY], [-A, A + C], [-A - C, A], [-EX, A], [-EX, -A], [-A - C, -A], [-A, -A - C], [-A, -NY],
] as XY[])
// The same, with the porch cut out of the south arm below the entablature.
const notched = ccw([
  [A, -NY], [A, -A - C], [A + C, -A], [EX, -A], [EX, A], [A + C, A], [A, A + C], [A, NY],
  [-A, NY], [-A, A + C], [-A - C, A], [-EX, A], [-EX, -A], [-A - C, -A], [-A, -A - C], [-A, -NY],
  [-PORCH, -NY], [-PORCH, PORCH_WALL], [PORCH, PORCH_WALL], [PORCH, -NY],
] as XY[])

// ── Massing ──
// The podium, a little proud of the walls, and the porch floor.
prism(trim, cross.map(([x, y]) => [x * 1.012, y * 1.012] as XY), 0, PODIUM, trim, 0.15)
box(trim, -15.5, 15.5, -34, PORCH_WALL, 0, PODIUM, trim, 0.1)
// The walls: the notched lower storeys, then the full cross above the porch.
wall(stone, notched, PODIUM, 14)
prism(stone, cross, 14, ATTIC, stone, 0.35, true)
cornice(trim, cross, CORNICE - 0.7, 0.7, 0.5, null) // main cornice
cornice(trim, cross, ATTIC - 0.6, 0.6, 0.3, null) // attic coping

// ── The portico ──
// Ten Ionic columns, square antae at the ends, the entablature over them.
const COLS = 10, SPAN = 27, CY = -32.2, CR = 0.72
for (let i = 0; i < COLS; i++) {
  const x = -SPAN / 2 + (i * SPAN) / (COLS - 1)
  revolve(trim, [x, CY], [[CR + 0.25, PODIUM], [CR, PODIUM + 0.5], [CR * 0.86, 13.0], [0, 13.0]], 10, 0, false, false)
  box(trim, x - 0.95, x + 0.95, CY - 0.95, CY + 0.95, 13.0, 13.7, null, 0.12) // capital
}
for (const s of [-1, 1]) box(stone, s * PORCH - 0.9, s * PORCH + 0.9, -NY - 0.4, PORCH_WALL, PODIUM, 13.7, null, 0)
box(trim, -15.5, 15.5, -33.4, PORCH_WALL, 13.7, CORNICE, trim, 0.3, true)

// ── Drum and dome ──
const D = 17, DC = 6
const drum = ccw([[D - DC, -D], [D, -D + DC], [D, D - DC], [D - DC, D], [-D + DC, D], [-D, D - DC], [-D, -D + DC], [-D + DC, -D]] as XY[])
prism(stone, drum, ATTIC - 0.5, DRUM, stone, 0.3)
cornice(trim, drum, DRUM - 1.1, 1.1, 0.5, null)
// The dome: a low ring, then a spherical cap.
const R = (15 ** 2 + (CROWN - SPRING) ** 2) / (2 * (CROWN - SPRING))
const cap: [number, number][] = [15, 12.5, 10, 7.5, 5, 2.5, 0].map((r) => [r, CROWN - (R - Math.sqrt(R * R - r * r))])
revolve(dome, [0, 0], [[15.6, DRUM], [15.6, SPRING - 0.6], [15.2, SPRING], ...cap], 24)

// ── Windows ──
const ROWS: [number, number][] = [[4.2, 7.6], [9.6, 13.4]]
for (let i = 0; i < cross.length; i++) {
  const a = cross[i], b = cross[(i + 1) % cross.length]
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  if (L < 8) continue // the chamfers
  const south = a[1] < -NY + 0.1 && b[1] < -NY + 0.1
  const k = Math.round(L / 4.6)
  for (let j = 0; j < k; j++) {
    const s = ((j + 0.5) * L) / k
    if (south && Math.abs(a[0] + ((b[0] - a[0]) * s) / L) < PORCH + 1.2) continue // the porch
    for (const [z0, z1] of ROWS) onWall(win, a, b, rectShape(s - 0.8, s + 0.8, z0, z1))
  }
}
// The porch wall: windows between the columns and the bronze door in the middle.
const pw: [XY, XY] = [[-PORCH, PORCH_WALL], [PORCH, PORCH_WALL]]
for (let i = 0; i < COLS - 1; i++) {
  const s = PORCH - SPAN / 2 + ((i + 0.5) * SPAN) / (COLS - 1)
  if (i === 4) continue
  for (const [z0, z1] of [[4.0, 7.4], [9.0, 11.6]] as [number, number][]) onWall(win, ...pw, rectShape(s - 0.7, s + 0.7, z0, z1))
}
onWall(door, ...pw, rectShape(PORCH - 1.2, PORCH + 1.2, PODIUM, 8.6))
onWall(win, ...pw, rectShape(PORCH - 1.0, PORCH + 1.0, 9.4, 11.6))
// A lunette on each face of the drum.
for (let i = 0; i < drum.length; i += 1) {
  const a = drum[i], b = drum[(i + 1) % drum.length]
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  if (L > 15) onWall(win, a, b, archShape(L / 2, 12, ATTIC + 0.3, ATTIC + 0.3, 10))
}

// ── Steps ──
// A narrow flight from the porch between two pedestals, a landing, then a
// wide flight down to Low Plaza.
const steps = (x: number, yTop: number, yBot: number, zTop: number, zBot: number, n: number) => {
  for (let k = 0; k < n; k++) {
    const t = k / n, z = zTop - (zTop - zBot) * t, y = yTop - (yTop - yBot) * t
    box(trim, -x, x, y - (yTop - yBot) / n, -34, 0, z, trim, 0)
  }
}
steps(13, -34, -38, PODIUM, 1.5, 8)
box(trim, -13, 13, -39.6, -38, 0, 1.5, trim, 0) // landing
steps(EX, -39.6, -44, 1.5, 0, 6)
for (const s of [-1, 1]) box(stone, s * 14.3 - 1.3, s * 14.3 + 1.3, -38.5, -33.4, 0, PODIUM + 1.3, trim, 0.15) // pedestals

// Night: the windows and lunettes glow; the stone and the dome are floodlit.
const flood = (_p: V3, n: V3) => (n[2] < 0.5 ? 0.75 : 0.25)
await save('nyc-columbia-low-library', 'Low Memorial Library', [
  { part: stone, material: { ...finish('low-limestone', 0xe6e0d3), floodlight: flood } },
  { part: trim, material: { ...finish('low-trim', 0xf2ece0), floodlight: flood } },
  { part: dome, material: { ...finish('low-dome', 0xcdc8bd), floodlight: () => 0.5 } },
  { part: win, material: PALETTE.window },
  { part: door, material: PALETTE.entrance },
], { height: CROWN, anchor: [40.8082225, -73.9618351], bearing: 29.8 }, 6500)
