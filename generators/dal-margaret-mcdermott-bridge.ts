/**
 * Margaret McDermott Bridge (arches 2017, footbridges opened 2022; Santiago
 * Calatrava) — procedural, CC0-1.0.
 * bun generators/dal-margaret-mcdermott-bridge.ts
 * Needs the helpers exported by dal-margaret-hunt-hill-bridge.ts (merge that
 * generator first).
 *
 * What the model is: the two white steel arches that stand over the outer
 * edges of the I-30 crossing of the Trinity River, the hangers they carry,
 * and the two walking and cycling decks hung beneath them, surfaces
 * included, with the piers under the arches' feet. Writes a low model
 * (arches, decks, hangers at half density and drawn bold) and a detail model
 * (every hanger, railings with posts), which a map draws from detailZoom up.
 *
 * What it is not: the I-30 freeway itself. Its concrete girders, piers and
 * parapets (2013) are a plain viaduct that the map already draws from OSM,
 * under roadways it draws too. So `replaces` is empty: OSM's man_made=bridge
 * outline (way/1275449056) covers the whole freeway structure, every
 * mainline, frontage road and ramp over 1 km (x -72..+112, y -530..+472 in
 * this frame), and listing it would make the map drop its own piers and
 * parapets for all of that. The south arch even stands a few metres outside
 * the outline's south edge. No building or building:part lies inside it.
 *
 * Frame: x across the bridge (+x toward the south side), y along it toward
 * the east, z up, metres; origin at the outline's centroid. Placed at
 * bearing 76.5°, the arches' own line in the lidar.
 *
 * Height. z = 0 is the river, the DEM's water reading (Mapterhorn 118.5 m;
 * the 2018 lidar's lowest ground return here is a channel point 2.9 m lower,
 * 115.59 m, so lidar heights below are that minus 2.9). The floodway's
 * ground is 3.1–4.7 m; the walkways 19.1 m.
 *
 * Standing on the terrain: the piers under the arches' feet run down to the
 * ground under them vertex by vertex, at 3DEP bare-earth heights above the
 * water (GROUND_ROWS), per the bridge rule in docs/reference.md, so the
 * model's lowest point is 2.9 m, not 0; nothing stands in the river.
 *
 * Sources:
 * - OSM: the outline above; the footway way/483237626 at x = -67 under the
 *   north arch and the cycleway way/483826660 (width 5) at x = +53 under the
 *   south arch; I-30 mainlines at x ≈ -35 and +20, frontage roads (tagged
 *   "Margaret McDermott Bridge") at -55 and +40.
 * - Lidar, USGS 3DEP TX_Pecos_Dallas_B3_2018 (flown 2018, after the arches
 *   were finished in 2017), 1 m grid: each arch a vertical plane, the north
 *   one at x = -67 and the south one at +55, symmetric about y = 0; the top
 *   of the tube 110.3 m over the grid's floor at y = ±112 and 33.5 at ±160,
 *   a parabola z = 107.4 − 0.00298·y² (above the water) that meets the
 *   walkway at y = ±170.5; below about 53 m each arch splits across into two
 *   legs, 8 m apart at 30–45 m and straddling the walkway; the walkways' decks
 *   at 19.1 m. The cloud stops at about 72 m (110 m on the arch is
 *   extrapolated from the parabola, which fits every lower point to 1 m).
 * - Published (Wikipedia "Margaret McDermott Bridge"): main span 1,125 ft
 *   (343 m; the parabola meets the decks 341 m apart); overall height 340 ft
 *   (103.6 m; the fitted crown is 103.6 m above the floodway's 3.8 m);
 *   arches 1,200 ft long; walkway and bikeway housed within the arches.
 * - Photos (Wikimedia Commons): "Margaret McDermott Bridge" (Fkbowen, CC
 *   BY-SA 4.0; both arches from the floodway, the vertical hangers); "MMB
 *   Dallas Nima1" and "MMB Dallas Nima2" (Nightryder84, CC BY-SA 4.0; from
 *   Reunion Tower: the arches over the outer decks, the split feet);
 *   "Dallas bridge 2020 agsvsacsv xc (1) 01/02/03" (Gerardolagunes, CC BY-SA
 *   4.0; from the roadway: the teardrop opening between a foot's two legs);
 *   "Margaret Hunt Bridge behind the Margaret McDermott Bridge" (Shiva
 *   Shenoy, CC BY 2.0; broadside silhouette); "20160730-DSC 9933" (Ryanussery,
 *   CC BY-SA 4.0; during erection, from above); "Margaret McDermott Bridge in
 *   Dallas Texas May of 2024" (IcedCowboyCoffee, CC0; aerial).
 * - Estimated: the tube's diameter (3.4 m, 2.6 m in each leg, from photos
 *   against lane widths); where the legs part (y = ±128) and how far (4.5 m
 *   either side at the walkway); the hangers' spacing (6.1 m, about 55 a
 *   side as counted in the broadside photo), drawn from the arch to both
 *   edges of the walkway; the walkways 6 m wide, 1.2 m deep, with 1.1 m
 *   railings; the piers under the feet (10 x 5 m); the walkways drawn only
 *   over the arches' span (±182 m), where they hang, the map drawing them on
 *   beyond.
 * - Look-only: "Margaret McDermott Bridge, South arch" (Bella M Broome,
 *   unlicensed attribution-only tag) was not opened.
 *
 * Colours: the arches and hangers white paint (daylight photos), the walking
 * decks pale concrete grey, the piers concrete.
 *
 * Night: the arches are lit white from the decks (photos at dusk), so the
 * arch steel carries a `floodlight` wash; hangers and decks stay unlit.
 *
 * Doubts: the walkways' real depth and railing; whether the hangers fan
 * slightly along the span (photos show them near vertical); the map draws
 * the freeway at its own solved height, which may sit a metre or two off
 * the real 19 m beside these walkways.
 */
import { Part, type V3 } from './mesh'
import { merged, rod } from './bridge-kit'
import { finish, type Swatch } from './palette'
import { footedBox, lerpTable, resample, smoothTube, steps, sweepY, capY, writeBoth } from './dal-margaret-hunt-hill-bridge'

const ARCHES = [-67, 55]          // the arches' planes (lidar)
const DECK = 19.1                 // walkway surface above the water (lidar)
const CROWN = 105.7               // the tube's centreline at y = 0
const K = 0.00298                 // parabola: z = CROWN − K·y²
const R = 1.7, R_LEG = 1.3
const SPLIT = 128                 // |y| where each foot parts into two legs
const SPREAD = 4.5                // each leg's offset across at the walkway
const FOOT = Math.sqrt((CROWN - DECK) / K)   // 170.5: where the arch meets the walkway
const WALK = 3.0                  // walkway half-width
const WALK_END = 182

const arch = (y: number) => CROWN - K * y * y

/** 3DEP bare earth above the water (lidar − 2.9), along y, outside each walkway: [north, south]. */
const GROUND_ROWS: [number, number, number][] = [
  [-200, 3.5, 3.3], [-170, 3.8, 3.4], [-140, 4.1, 3.5], [-100, 4.1, 3.8], [-50, 4.7, 4.1], [-20, 1.1, 4.7],
  [0, 0.5, 3.8], [20, 0.5, 0.5], [40, 4.0, 0.5], [60, 4.5, 2.6], [100, 3.9, 3.7], [140, 3.4, 3.8],
  [170, 3.0, 3.4], [200, 2.4, 3.2],
]
const groundN = lerpTable(GROUND_ROWS.map(([y, n]) => [y, n]))
const groundS = lerpTable(GROUND_ROWS.map(([y, , s]) => [y, s]))
const ground = (x: number, y: number) => (x < 0 ? groundN(y) : groundS(y))

/** One arch's centreline from foot to foot, as a single tube's path, at `xc`. */
function crownPath(xc: number, n: number): V3[] {
  return resample(steps(-SPLIT - 2, SPLIT + 2, 1).map((y) => [xc, y, arch(y)] as V3), n)
}
/** A leg: from inside the crown tube out to the walkway, parting across by `side`·SPREAD. */
function legPath(xc: number, end: 1 | -1, side: 1 | -1, n: number): V3[] {
  return resample(steps(SPLIT - 6, FOOT, 1).map((a) => {
    const s = Math.min(1, Math.max(0, (a - SPLIT) / (FOOT - SPLIT)))
    const off = SPREAD * (1 - (1 - s) ** 2)
    return [xc + side * off, end * a, Math.max(arch(a), DECK)] as V3
  }), n)
}

if (import.meta.main) {
  const steel = new Part(), steelD = new Part(), hangLow = new Part(), hangD = new Part()
  const walk = new Part(), walkD = new Part(), rail = new Part(), concrete = new Part()

  for (const xc of ARCHES) {
    smoothTube(steel, crownPath(xc, 30), R * 1.2, 10)
    smoothTube(steelD, crownPath(xc, 70), R, 16)
    for (const end of [-1, 1] as const) for (const side of [-1, 1] as const) {
      smoothTube(steel, legPath(xc, end, side, 6), R_LEG * 1.2, 8)
      smoothTube(steelD, legPath(xc, end, side, 14), R_LEG, 12)
    }

    // The walkway: its surface (the model's own), fascias and underside, swept along.
    const top = () => DECK
    const section: [number, number][] = [
      [xc - WALK, 0], [xc - WALK, -1.2], [xc + WALK, -1.2], [xc + WALK, 0],
    ]
    const ys = steps(-WALK_END, WALK_END, 5), ysLow = steps(-WALK_END, WALK_END, 26)
    for (const [p, ys] of [[walk, ysLow], [walkD, steps(-WALK_END, WALK_END, 5)]] as [Part, number[]][]) {
      sweepY(p, section, ys, top)
      sweepY(p, [[xc + WALK, 0], [xc - WALK, 0]], ys, top)   // the walking surface, facing up
      for (const [y, dir] of [[-WALK_END, -1], [WALK_END, 1]] as [number, 1 | -1][]) capY(p, section, y, DECK, dir)
    }
    // Railings: low, a solid 1.1 m band each side; detail, a top rail on posts.
    for (const s of [-1, 1]) {
      const x0 = xc + s * (WALK - 0.15)
      sweepY(walk, [[x0 + 0.15, 0], [x0 + 0.15, 1.1], [x0 - 0.15, 1.1], [x0 - 0.15, 0]], ysLow, top)
      sweepY(rail, [[x0 + 0.06, 0.95], [x0 + 0.06, 1.1], [x0 - 0.06, 1.1], [x0 - 0.06, 0.95]], ys, top)
      for (const y of steps(-WALK_END, WALK_END, 2.5)) rod(rail, [x0, y, DECK], [x0, y, DECK + 1.0], 0.05, 3)
    }

    // Hangers, from the arch to both edges of the walkway.
    const stations = steps(-FOOT + 9, FOOT - 9, 6.1)
    stations.forEach((y, i) => {
      for (const s of [-1, 1]) {
        const a: V3 = [xc, y, arch(y) - R * 0.8], b: V3 = [xc + s * (WALK - 0.4), y, DECK + 1.1]
        if (a[2] - b[2] < 2) continue
        rod(hangD, a, b, 0.14, 4)
        if (i % 2 === 0) rod(hangLow, a, b, 0.28, 3)
      }
    })

    // Piers under each foot, down to the floodway.
    for (const end of [-1, 1]) {
      const y = end * FOOT
      footedBox(concrete, xc - 5, xc + 5, y - 2.5, y + 2.5, DECK - 1.2, ground)
    }
  }

  const lit = (p: V3, n: V3) => (p[2] > DECK + 1.5 ? (n[2] > 0.7 ? 0.5 : 0.9) : 0)
  const WHITE = { ...finish('white-steel', 0xeeeeea), floodlight: lit }
  const HANGERS = { ...finish('white-steel-hangers', 0xe6e6e2), doubleSided: true }
  const WALKWAY: Swatch = finish('walkway', 0xd8d6d0)
  const CONCRETE: Swatch = finish('concrete', 0xd9d4ca)

  await writeBoth('dal-margaret-mcdermott-bridge', 'Margaret McDermott Bridge', [
    { part: steel, material: WHITE },
    { part: hangLow, material: HANGERS },
    { part: walk, material: WALKWAY },
    { part: concrete, material: CONCRETE },
  ], [
    { part: steelD, material: WHITE },
    { part: hangD, material: HANGERS },
    { part: merged(walkD, rail), material: WALKWAY },
    { part: concrete, material: CONCRETE },
  ], {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the outline centroid, on the river',
    bearing: 76.5, elevation: 0, walkways: DECK, arches: ARCHES,
  })
}
