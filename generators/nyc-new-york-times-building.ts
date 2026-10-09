/**
 * The New York Times Building (620 Eighth Avenue) — procedural, CC0-1.0, no textures.
 * bun generators/nyc-new-york-times-building.ts
 *
 * Map frame: x = model east, y = model north (West 41st Street), z up,
 * metres; Eighth Avenue is the west edge (x ≈ −63). Placed at bearing 29°,
 * the Manhattan grid. Anchor: area centroid of the OSM multipolygon
 * relation/1860567 (outer way 138152330, inner courtyards 138152331 and
 * 1309062318), which covers the tower on Eighth Avenue and the low-rise
 * running east to the middle of the block.
 *
 * Evidence
 * - OSM relation/1860567 and its parts: tower 138152327 (227 m, 52 levels,
 *   plan 47 m square with the middle of the 41st and 40th Street faces
 *   standing 5 m proud, so the corners read as notches); the concrete core
 *   260282082 (232 m); the ceramic-rod screens 260282084/085 (on the north
 *   and south middles, 6–244 m) and 260282086/088 (on the Eighth Avenue and
 *   east faces, 12–244 m); 260282089 (a strip on Eighth Avenue from 25 m);
 *   the mast 260282087 (319 m); the low-rise 260282083 (25 m).
 * - Lidar: USGS 3DEP NY_NewYorkCity (2017), resampled into the model frame
 *   (/tmp/city/nyc/work/nyc-new-york-times-building/rot.png). Street
 *   ≈ 14.1 m NAVD88. Measured above it: tower roof 226 m; core top 238 m;
 *   screens to 243–248 m standing off every face, on Eighth Avenue and the
 *   east face along nearly the whole width, on the street faces only across
 *   the middle bays; mast tip 318 m; low-rise 21–26 m with a 30 m east
 *   block and an open courtyard (the birch garden).
 * - Published: 319 m with mast, 228 m roof, 52 floors, Renzo Piano with
 *   FXFOWLE, 2007; glass curtain wall behind a screen of 186,000 pale
 *   ceramic rods that stops short of the notched corners and runs on past
 *   the roof. The street faces' outer bays (OSM maps no screen there) are
 *   screened as the photos show, leaving 2 m slots of bare glass at the
 *   corners (Wikipedia; NYT; CTBUH).
 * - Photos (Wikimedia Commons, daylight): see
 *   /tmp/city/nyc/work/nyc-new-york-times-building/photos/credits.txt.
 *
 * Drawn: the glass body in slate `window` (the notched corners read dark,
 * as in every photo); the screen as pale panels 0.8 m proud, one per three
 * storeys and per bay, with narrow gaps showing the glass; the screen above
 * the roof as an open lattice of slats. Estimated: the screen's bay
 * width (≈ 6 m), the mast's thickness (drawn 2 m at its foot so it shows),
 * the low-rise's east block plan.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { finishModel, prism, massing, type Facade, type XY } from './nyc-570-lexington'

const body = new Part(), screen = new Part(), roof = new Part(), mast = new Part(), low = new Part(), win = new Part()

const ROOF = 226, CORE = 238, SCREEN_TOP = 244, MAST = 319

// --- Tower body: the square with its 41st/40th Street middles standing proud.
const plan: XY[] = [
  [-60, -24.6], [-51.4, -24.6], [-51.4, -29.7], [-25.8, -29.7], [-25.8, -24.5], [-13, -24.5],
  [-13, 22.9], [-25.6, 22.9], [-25.6, 28.1], [-51.2, 28.1], [-51.2, 22.9], [-60, 22.9],
]
prism({ wall: body, win: null, roof, ring: plan, z0: 0, z1: ROOF, facade: null, bevel: 0.35 })
// The concrete core above the roof (a cross, OSM 260282082).
const core: XY[] = [[-41.2, -23.7], [-34.3, -23.7], [-34.3, -15.6], [-27.1, -15.6], [-27.1, 14.2], [-34.3, 14.2], [-34.3, 22.0], [-41.2, 22.0], [-41.2, 14.1], [-47.8, 14.1], [-47.8, -15.7], [-41.2, -15.7]]
prism({ wall: low, win: null, roof, ring: core, z0: ROOF - 1, z1: CORE, facade: null, bevel: 0.3 })

// --- The ceramic-rod screens -------------------------------------------------
/**
 * One screen on a plane parallel to a wall: from a to b (counter-clockwise
 * ring order, so it faces out), `off` metres proud of the wall, z0…z1.
 * Panels per three storeys and per bay, 0.3 m thick, with gaps between.
 */
function veil(a: XY, b: XY, off: number, z0: number, z1: number) {
  panels(a, b, off, z0, ROOF, 6.2, 0.5)
  panels(a, b, off, ROOF, z1, 2.4, 1.1) // above the roof the screen is an open lattice of slats
}

function panels(a: XY, b: XY, off: number, z0: number, z1: number, bayW: number, gap: number) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L, nx = uy, ny = -ux
  const P = (s: number, z: number, d: number): V3 => [a[0] + ux * s + nx * d, a[1] + uy * s + ny * d, z]
  const bays = Math.max(1, Math.round(L / bayW)), pitch = L / bays
  const rowH = 4.2 * 3, rows = Math.max(1, Math.round((z1 - z0) / rowH)), rh = (z1 - z0) / rows, rgap = 1.0
  for (let r = 0; r < rows; r++) {
    const lo = z0 + r * rh + (r ? rgap / 2 : 0), hi = z0 + (r + 1) * rh - (r < rows - 1 ? rgap / 2 : 0)
    for (let k = 0; k < bays; k++) {
      const s0 = k * pitch + (k ? gap / 2 : 0), s1 = (k + 1) * pitch - (k < bays - 1 ? gap / 2 : 0)
      const o = off, i = off - 0.3
      screen.quad(P(s0, lo, o), P(s1, lo, o), P(s1, hi, o), P(s0, hi, o)) // front
      screen.quad(P(s0, hi, o), P(s1, hi, o), P(s1, hi, i), P(s0, hi, i)) // top
      if (lo >= ROOF) { // free-standing above the roof: back, ends and underside show
        screen.quad(P(s1, lo, i), P(s0, lo, i), P(s0, hi, i), P(s1, hi, i))
        screen.quad(P(s0, lo, i), P(s1, lo, i), P(s1, lo, o), P(s0, lo, o))
        screen.quad(P(s0, lo, i), P(s0, lo, o), P(s0, hi, o), P(s0, hi, i))
        screen.quad(P(s1, lo, o), P(s1, lo, i), P(s1, hi, i), P(s1, hi, o))
      }
    }
  }
}
veil([-60, 20.9], [-60, -22.6], 2.8, 12, SCREEN_TOP) // Eighth Avenue
veil([-13, -22.6], [-13, 20.8], 0.8, 12, SCREEN_TOP) // east face, over the low-rise
veil([-51.4, -29.7], [-25.8, -29.7], 0.6, 6, SCREEN_TOP) // 40th Street
veil([-25.6, 28.1], [-51.2, 28.1], 0.6, 6, SCREEN_TOP) // 41st Street
// The street faces' outer bays, set back behind the middles: screened too,
// leaving only a 2 m slot of bare glass at each corner — the notches.
veil([-58, -24.6], [-51.4, -24.6], 0.6, 6, SCREEN_TOP)
veil([-25.8, -24.5], [-15, -24.5], 0.6, 6, SCREEN_TOP)
veil([-15, 22.9], [-25.6, 22.9], 0.6, 6, SCREEN_TOP)
veil([-51.2, 22.9], [-58, 22.9], 0.6, 6, SCREEN_TOP)

// --- Mast ---------------------------------------------------------------------
{
  const mx = -37.6, my = -0.8, n = 8
  const ring = (r: number, z: number): V3[] => Array.from({ length: n }, (_, i) => [mx + r * Math.cos((i / n) * 2 * Math.PI), my + r * Math.sin((i / n) * 2 * Math.PI), z] as V3)
  mast.loft([ring(1.0, CORE), ring(0.55, 290), ring(0.2, MAST)])
  mast.cap(ring(0.2, MAST), true)
}

// --- The low-rise and its courtyard --------------------------------------------
const lowF: Facade = { bay: 6.2, ratio: 0.85, floor: 4.2, group: 2, spandrel: 1.6, sill: 1.0, head: 1.2, ground: 5, minLength: 4 }
massing({
  wall: low, win, roof, facade: lowF, bevel: 0.4,
  boxes: [
    [-13, -28.8, 60.5, -9.6, 24],
    [-13, 12.6, 60.5, 29.8, 24],
    [9.4, -9.6, 60.5, 12.6, 24],
    [37.5, -15, 57, 12.6, 31],
  ],
})

finishModel('The New York Times Building', 'nyc-new-york-times-building', [
  { part: body, material: PALETTE.window },
  { part: screen, material: finish('nyt-screen', 0xebe8e1) },
  { part: roof, material: PALETTE.roof },
  { part: mast, material: finish('nyt-mast', 0xd4d6d8) },
  { part: low, material: finish('nyt-base', 0xdcdad4) },
  { part: win, material: windowVariant(2, 0x8ea3b4) },
], { bearing: 29, osm: 'relation/1860567', height: MAST })

