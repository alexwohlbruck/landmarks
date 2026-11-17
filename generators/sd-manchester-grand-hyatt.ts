/**
 * Manchester Grand Hyatt San Diego (One Market Place) — the Harbor Tower
 * (1992, 34 floors) and the Seaport Tower (2003, 40 floors) on their shared
 * podium at the foot of Market Street. Original procedural geometry, CC0-1.0.
 *   bun generators/sd-manchester-grand-hyatt.ts
 *
 * Identity, in order: two pale beige stone slabs side by side on the
 * bayfront, each under a steep pale sea-green pitched crown with stone fins
 * standing on its slopes; the Seaport Tower taller, its crown gabled with
 * stone gable walls (a sharp spire seen end-on), the Harbor Tower's hipped;
 * the regular punched-window grid of the hotel rooms; the low beige podium.
 *
 * Frame: x, y in the model's plan frame, turned to bearing 33.4 (the towers'
 * long axis; OSM edges run at 33.3 / 123.3 degrees), z up, metres. Origin at
 * the centroid of the podium outline way/30929700 (-117.16795, 32.70982).
 * y = 0 is the ground; the site is flat bayfront fill.
 *
 * Sources
 * - OSM (© OpenStreetMap contributors): podium way/30929700 (building=hotel,
 *   3 levels); Seaport Tower way/611726997 (height 151.5, 40 levels,
 *   roof:shape gabled, roof:height 20); Harbor Tower way/611726918 (height
 *   135.9, 34 levels, hipped, roof:colour #D0ECE7).
 * - Published: Seaport Tower 497 ft (151.5 m), Harbor Tower 452 ft
 *   (137.8 m) (Wikipedia, "Manchester Grand Hyatt San Diego"; Emporis/CTBUH
 *   figures quoted there). The published Harbor height is used over OSM's
 *   135.9.
 * - Lidar: none. CA_SanDiegoQL2_2014 returns no points west of about
 *   -117.165 here (a hole in the 2014 flight along the bay), so every height
 *   is published or photo-scaled.
 * - USGS NAIP orthophoto (plan, podium roofs).
 * Photos (evidence):
 * - "Manchester Grand Hyatt Hotel, San Diego.jpg", Bernard Gagnon,
 *   CC BY-SA 3.0, https://commons.wikimedia.org/wiki/File:Manchester_Grand_Hyatt_Hotel,_San_Diego.jpg
 *   (from the bay, west: both crowns, roof colour, proportions).
 * - "San Diego, 2016 - 282.jpg", "- 281", "- 274", "- 287", "- 296",
 *   Another Believer, CC BY-SA 4.0, e.g.
 *   https://commons.wikimedia.org/wiki/File:San_Diego,_2016_-_282.jpg
 *   (282: the Seaport crown's fins and gable walls close up; 287: both
 *   towers end-on from the south-east, the Seaport crown as a spire).
 * - "High-rises in San Diego, California 13 2014-03-06.jpg", FASTILY,
 *   CC BY-SA 3.0 (Harbor Tower's hipped crown from below).
 * - "ManchesterGrandHyattTowerSanDiegoApr09.jpg", Nehrams2020, CC BY-SA 3.0.
 * - "Hyatt (3360714571).jpg", jimmyweee, CC BY 2.0 (both towers from the
 *   south across the marina).
 * - "Hyatt lit up with Christmas Colors - panoramio.jpg", Mountain Mike
 *   Johansen, CC BY 3.0 (night).
 *
 * Numbers
 * - Plans: OSM (measured). The Seaport Tower is two staggered slabs
 *   (17.4 x 45.8 m and 18.0 x 41.0 m); the Harbor Tower a 23.3 x 72 m slab
 *   with one clipped corner.
 * - Eaves: Seaport 112 m, Harbor 110 m (photo-scaled from Gagnon's
 *   distant view, where the crowns are ~39 m and ~28 m of the published
 *   heights; estimated). Ridges at the published heights.
 * - Fins: five a long face on each Seaport slab, eight on each Harbor long
 *   face, reaching about two-thirds up the slope (counted on 282 and Gagnon).
 * - Podium: 18 m (photo-scaled; OSM says 3 levels, the photos show four
 *   tall storeys and a terrace) (estimated).
 * - Window grid: one panel per room bay (~3.6 m), three storeys a panel
 *   (estimated from the photos).
 * - Colours from the daylight photos: stone warm pale beige, crowns pale
 *   sea-green (OSM roof:colour #D0ECE7 agrees), pulled to the palette.
 *
 * Night: the crowns are floodlit (the Christmas photo shows them lit green;
 * on ordinary nights they read lit pale) — `_FLOODLIGHT` on the crowns and
 * fins; the room windows glow.
 *
 * Doubts
 * - No lidar: eave and podium heights are photo estimates.
 * - The podium's terraces, pool deck and courts are drawn as one flat roof.
 * - The Seaport crown's small loggia openings and the HYATT sign are left out.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, type Swatch } from './palette'
import { save, walls, cap, inset, panel, rect, type XY } from './chi-aon-center'

const STONE = finish('hyatt-stone', 0xebdccb)
const CROWN = finish('hyatt-crown', 0xadc8bb, 0.5)
const WIN = PALETTE.window
const ROOF = finish('hyatt-deck', 0xc9c1b3)
const POD = finish('hyatt-podium', 0xe6d8c4)

const stone = new Part(), crown = new Part(), win = new Part(), roof = new Part(), pod = new Part()

function box(wall: Part, top: Part | null, r: XY[], z0: number, z1: number, b = 0.45) {
  const ins = inset(r, b)
  walls(wall, r, z0, z1 - b)
  walls(wall, r, z1 - b, z1, ins)
  if (top) cap(top, ins, z1)
}
function windows(p: Part, a: XY, b: XY, rows: [number, number][], bay = 3.6, gap = 1.2, end = 1.5) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  const use = L - 2 * end
  if (use < bay) return
  const k = Math.max(1, Math.round((use + gap) / (bay + gap))), w = (use - (k - 1) * gap) / k
  for (let q = 0; q < k; q++) for (const [z0, z1] of rows) panel(p, a, b, end + q * (w + gap), end + q * (w + gap) + w, z0, z1, 0.05)
}
const groups = (z0: number, z1: number, n: number, sp: number): [number, number][] =>
  Array.from({ length: n }, (_, i) => [z0 + i * (z1 - z0) / n + sp / 2, z0 + (i + 1) * (z1 - z0) / n - sp / 2] as [number, number])

// ---------------------------------------------------------------------------
// Podium (OSM way/30929700, simplified, counter-clockwise)
const PODIUM: XY[] = [
  [-113.0, 52.6], [-114.5, 49.4], [-114.2, 13.0], [-113.3, -22.9], [-93.3, -55.9], [-84.1, -56.2], [-84.2, -58.0],
  [-77.3, -58.3], [-69.0, -62.8], [-51.6, -67.2], [-39.0, -63.9], [-24.0, -64.3], [-23.9, -61.9], [-2.2, -62.9],
  [-1.9, -52.0], [9.2, -52.0], [9.1, -59.2], [16.8, -59.3], [16.9, -52.0], [27.3, -52.0], [27.4, -58.3],
  [59.3, -58.4], [59.3, -51.1], [69.4, -50.5], [80.5, -46.6], [92.0, -40.0], [92.3, 59.5], [92.6, 76.9],
  [-0.4, 76.8], [-0.7, 16.7], [-80.8, 15.7], [-83.6, 17.5], [-83.7, 23.1], [-87.0, 26.0], [-90.1, 25.9],
  [-90.5, 49.6], [-93.9, 52.7],
]
const PZ = 18
box(pod, roof, PODIUM, 0, PZ)
PODIUM.forEach((a, i) => windows(win, a, PODIUM[(i + 1) % PODIUM.length], [[1.0, 6.5], [8.0, 12.2], [13.2, PZ - 1.4]], 3.2, 1.6, 1.2))

// ---------------------------------------------------------------------------
// Crowns

/**
 * A pitched crown over the slab rect x0..x1 (short side) × y0..y1 (long side),
 * from the eave e to the ridge h. `hipIn` > 0 hips the ends in by that much;
 * 0 gives stone gable walls. `fins` stone fins on each long face.
 */
function slabCrown(x0: number, x1: number, y0: number, y1: number, e: number, h: number, hipIn: number, fins: number, xm = (x0 + x1) / 2) {
  const ya = y0 + hipIn, yb = y1 - hipIn
  const P = (x: number, y: number, z: number): V3 => [x, y, z]
  // long slopes
  crown.quad(P(x0, y0, e), P(xm, ya, h), P(xm, yb, h), P(x0, y1, e)) // west, wound outward below
  crown.quad(P(x1, y0, e), P(x1, y1, e), P(xm, yb, h), P(xm, ya, h))
  if (hipIn > 0) {
    crown.tri(P(x0, y0, e), P(x1, y0, e), P(xm, ya, h))
    crown.tri(P(x1, y1, e), P(x0, y1, e), P(xm, yb, h))
  } else {
    // stone gable walls, a little proud of the roof, with a flat cap at the peak
    stone.tri(P(x0, y0, e), P(x1, y0, e), P(xm, y0, h))
    stone.tri(P(x1, y1, e), P(x0, y1, e), P(xm, y1, h))
  }
  // fins: stone wedges standing on each slope, flush with the facade below
  const rise = h - e, t = 0.7
  for (let i = 0; i < fins; i++) {
    const y = ya + ((yb - ya) * (i + 0.5)) / fins
    for (const side of [-1, 1]) {
      const xw = side < 0 ? x0 : x1, top = e + rise * 0.68, xin = xw + (xm - xw) * 0.68
      // triangle in the plane y: (xw, e), (xw, top), (xin, top) — the fin's face
      const A = (yy: number): V3[] => [P(xw, yy, e), P(xw, yy, top), P(xin, yy, top)]
      const f0 = A(y - t), f1 = A(y + t)
      const F = (pts: V3[], n: V3) => {
        for (let k = 1; k < pts.length - 1; k++) stone.tri(pts[0], pts[k], pts[k + 1], undefined, undefined, undefined, [n, n, n])
      }
      F(f0, [0, -1, 0])
      F(f1, [0, 1, 0])
      F([f0[0], f1[0], f1[1], f0[1]], [side, 0, 0]) // the outer, vertical edge
      F([f0[1], f1[1], f1[2], f0[2]], [0, 0, 1]) // top
    }
  }
}

// ---------------------------------------------------------------------------
// Harbor Tower (1992): one slab, a hipped crown.
{
  const x0 = -114.4, x1 = -89.7, y0 = -22.2, y1 = 52.6, E = 107, H = 137.8
  const r = rect(x0, y0, x1, y1)
  box(stone, null, r, PZ - 2, E, 0)
  // a slightly proud stone band at the eave
  box(stone, null, inset(r, -0.4), E - 2.2, E, 0.3)
  slabCrown(x0, x1, y0, y1, E, H, (x1 - x0) / 2, 8)
  r.forEach((a, i) => windows(win, a, r[(i + 1) % 4], groups(PZ, E - 2.6, 10, 2.8), 2.4, 2.0, 2.0))
}

// Seaport Tower (2003): two staggered slabs, gabled crowns with stone gable walls.
{
  const E = 108, H = 151.5
  const RIDGE = 12.4 // one ridge over both slabs, in their overlap: end-on it reads as a single spire
  const slabs: [number, number, number, number][] = [
    [8.9, 26.3, -28.6, 17.2],
    [-2.1, 15.9, -51.1, -10.1],
  ]
  for (const [x0, x1, y0, y1] of slabs) {
    const r = rect(x0, y0, x1, y1)
    box(stone, null, r, PZ - 2, E, 0)
    box(stone, null, inset(r, -0.4), E - 2.2, E, 0.3)
    slabCrown(x0, x1, y0, y1, E, H, 0, 5, RIDGE)
  }
  // windows on the exposed faces of the stagger
  const faces: [XY, XY][] = [
    [[8.9, -10.1], [8.9, 17.2]].reverse() as [XY, XY], // west face of the north slab, above the south slab's end
    [[26.3, -28.6], [26.3, 17.2]],
    [[26.3, 17.2], [8.9, 17.2]],
    [[15.9, -28.6], [26.3, -28.6]],
    [[15.9, -51.1], [15.9, -28.6]],
    [[-2.1, -51.1], [15.9, -51.1]],
    [[-2.1, -10.1], [-2.1, -51.1]],
    [[8.9, -10.1], [-2.1, -10.1]],
  ]
  for (const [a, b] of faces) {
    if (Math.abs(a[1] - b[1]) < 0.1) {
      // the end walls are blank stone with one slot of windows (Another Believer 287)
      const L = Math.abs(b[0] - a[0])
      for (const [z0, z1] of groups(PZ, E - 2.6, 10, 2.8)) panel(win, a, b, L / 2 - 1.4, L / 2 + 1.4, z0, z1, 0.05)
    } else windows(win, a, b, groups(PZ, E - 2.6, 10, 2.8), 2.4, 2.0, 2.0)
  }
}

const LIT = (p: V3) => (p[2] > 108 ? 0.7 : 0)

if (import.meta.main) {
  await save('sd-manchester-grand-hyatt', 'Manchester Grand Hyatt San Diego', [-117.16795, 32.70982], 33.4, [
    { part: stone, material: { ...STONE, floodlight: LIT } as Swatch },
    { part: crown, material: { ...CROWN, floodlight: LIT } as Swatch },
    { part: win, material: WIN },
    { part: roof, material: ROOF },
    { part: pod, material: POD },
  ], 5000)
}
