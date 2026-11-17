/**
 * Dallas City Hall (Dallas Municipal Building), 1500 Marilla Street, 1978,
 * I. M. Pei & Partners — original procedural geometry, CC0-1.0.
 * bun generators/dal-dallas-city-hall.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = centroid of the OSM outline way/27129838
 * (building=civic, amenity=townhall, "Dallas City Hall"), 32.7762606,
 * -96.7969359. Its long walls run at 75° / 255°, so the catalog bearing is
 * 345: +y faces the plaza (north-north-west), +x runs along the building
 * toward Ervay Street (east-north-east).
 *
 * Identity, in order: the inverted wedge, its plaza face leaning out 34°
 * from vertical over the full height; the raking concrete fins that divide
 * that face into bays, with deep horizontal window bands and ledges between
 * them; the three big free-standing cylinders under the overhang (one near
 * the east end, two toward the west); the blank trapezoidal end walls with
 * the raised roof core; the vertical, banded back (Marilla Street) face; all
 * of it in one buff concrete.
 *
 * Evidence:
 *  - plan: OSM outline, squared to the frame: 173.6 x 58.5 m at the roof
 *    (published 560 ft long; roof 61 m, ground floor 38 m deep, Wikipedia).
 *    The 3.5 m recess in the back face (x -52.8 to -26.4) is OSM's.
 *  - the lean: published 34° (Wikipedia, "the facade slopes at 34°";
 *    each floor 9½ ft wider than the one below). Drawn exactly: the
 *    window plane rises tan(34°) = 0.6745 m outward per metre, from y = 7.1
 *    at the ground to y = 26.0 at 28 m; the fin fronts and the fascia face
 *    meet the OSM roof edge (y = 28.9). Ground depth to the glass line
 *    -29.6..7.1 = 36.7 m (fin feet at 10.0) against the published 38 m
 *    (126 ft), a check that the lean and the OSM edge agree.
 *  - heights: USGS 3DEP lidar TX_Pecos_Dallas_B3_2018 (2018 flight), 1 m
 *    grid, above the plaza and street round the building (ground_min +
 *    1.8): raised roof core 34.9, north roof band 30.2, north parapet 31.3,
 *    end-wing notches 30.2 (y -25..-8, outer ~20 m at each end), pylon tops
 *    35.3. Measured.
 *  - the three pylons: their tops show in the lidar as round penthouses at
 *    x = +58, -22, -54.5, y ~18 (measured); ~9 m diameter, estimated from
 *    people beside them in Kent Wang's photo; they stand free under the
 *    overhang and rise into it.
 *  - fins and bays: positions from the HABS aerial of the north face
 *    (HABS TEX,57-DAL,1-1): a fin each side of every pylon and ~23 m bays
 *    between; 7 window bands per bay (Highsmith, Kent Wang). Fin depth
 *    2.4 m, thickness 1.8 m: estimated from the same photos, a little bold
 *    so the bays read at phone size. The concrete sill ledges between the
 *    bands are left out: their lit tops turned the face to noise at 80 px.
 *  - the bay between the two western pylons: the roof core juts to y = 18
 *    over it (lidar), and a concrete balcony box crosses it at mid-height
 *    (Kent Wang).
 *  - back face: banded windows in two stacks and in the recess, solid stair
 *    towers between (HABS aerial of the south elevation, 1-7); stepped
 *    window bands on the end walls in the notches (Daquella manera; HABS
 *    1-5, 1-8). The stepping of those end bands is simplified to flat.
 *  - colour: buff concrete (#dccdb2, the photos' tan pulled to palette
 *    lightness); glass `window` darkened to #4f5f6d, the recessed bands
 *    reading deep dark in every photo; roofs buff #cdbea3 (USGS NAIP and
 *    Barera's aerial), a touch darker than the walls; the Great Court
 *    skylight, pale panels in NAIP, a low buff block.
 *  - window bands: one continuous strip per floor per bay, full width
 *    between the fins, 3.2 of every 4 m (HABS 1-1, Highsmith).
 *  - ground: the plaza is over a garage, but the map's terrain is flat
 *    under the footprint (Mapterhorn 1.1-1.9 m above its minimum), so the
 *    base is ordinary grade. elevation 0. The plaza, pool, flagpoles and
 *    Henry Moore sculpture are ground or separate and are not modelled.
 *
 * Photos (all EVIDENCE):
 *  - DallasCityHallB.jpg, Kent Wang, CC BY-SA 2.0 (plaza face from the west)
 *  - DallasCityHallA.jpg, Daquella manera, CC BY 2.0 (west end, Akard St)
 *  - Dallas City Hall, Dallas, Texas LCCN2015630778, Carol M. Highsmith,
 *    public domain (from the north-east, Ervay St)
 *  - View of Dallas City Hall from Reunion Tower August 2015 14.jpg,
 *    Michael Barera, CC BY-SA 4.0 (from the west-south-west, above)
 *  - HABS TEX,57-DAL,1-1, 1-5, 1-7, 1-8 (Historic American Buildings
 *    Survey, Library of Congress), public domain: aerials of the north,
 *    west, south and south-east sides.
 * Published: Wikipedia "Dallas City Hall" (7 floors, 34° slope, widths).
 * No look-only sources. No commercial imagery or 3D tiles.
 *
 * Terrain: `bun tools/terrain.ts check` prints ok (relief 0.43 m).
 *
 * Doubts: fin positions read off one oblique aerial (±2 m); the lidar
 * building sits ~1.5 m south-east of the OSM outline, OSM kept; the end
 * walls' stepped window bands are drawn flat; the special bay's glazing is
 * simplified to the common bands plus the balcony box.
 *
 * Left out: rooftop plant, the ground-floor entrance glazing details,
 * lettering, the plaza and everything on it.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { block, cap, lathe, panel, rect, save, triangulate, type XY } from './chi-merchandise-mart'

const ANCHOR: [number, number] = [32.7762606, -96.7969359]
const BEARING = 345

// Plan (OSM, in frame).
const XW = -87, XE = 86.6 // end walls
const YS = -29.6, YN = 28.9 // back face, roof edge over the plaza
// Heights (lidar).
const CORE = 34.9, LOW = 30.2, PARAPET = 31.3, PYLON = 35.3
// The lean: 34° from vertical, exact.
const LEAN = (34 * Math.PI) / 180
const T = Math.tan(LEAN), C = Math.cos(LEAN), S = Math.sin(LEAN)
const SLOPE_TOP = 28 // where the fascia starts
const FIN = 2.4 // fin depth, normal to the face
const YB = YN - FIN / C - SLOPE_TOP * T // window plane at the ground: 7.1
const W = (z: number) => YB + z * T // window plane
const O = (z: number) => YB + FIN / C + z * T // fin fronts (vertical clip of the offset line)

/** A prism along x from x0 to x1 over a counter-clockwise (y, z) ring; upward faces go to `top`. */
function prismX(p: Part, ring: XY[], x0: number, x1: number, top: Part = p) {
  for (const [a, b, c] of triangulate(ring)) {
    const A = ring[a], B = ring[b], Cc = ring[c]
    p.tri([x1, A[0], A[1]], [x1, B[0], B[1]], [x1, Cc[0], Cc[1]])
    p.tri([x0, A[0], A[1]], [x0, Cc[0], Cc[1]], [x0, B[0], B[1]])
  }
  for (let i = 0; i < ring.length; i++) {
    const [y0, z0] = ring[i], [y1, z1] = ring[(i + 1) % ring.length]
    const up = Math.abs(y1 - y0) > 1e-6 && Math.abs(z1 - z0) < 1e-6 && y1 < y0
    ;(up ? top : p).quad([x0, y0, z0], [x0, y1, z1], [x1, y1, z1], [x1, y0, z0])
  }
}

/** A flat panel on the leaning face, x0..x1, between heights z0 and z1. */
function slopePanel(p: Part, x0: number, x1: number, z0: number, z1: number, out = 0.06) {
  const P = (x: number, z: number): V3 => [x, W(z) + out * C, z - out * S]
  p.quad(P(x1, z0), P(x0, z0), P(x0, z1), P(x1, z1))
}

function build() {
  const conc = new Part(), roof = new Part(), win = new Part()

  // --- Masses -------------------------------------------------------------
  // The wedge: back at the core, the leaning face to the plaza.
  prismX(conc, [[-8, 0], [YB, 0], [W(SLOPE_TOP), SLOPE_TOP], [W(SLOPE_TOP), LOW], [-8, LOW]], XW, XE, roof)
  // The fascia over the leaning face, with the parapet lip.
  prismX(conc, [[W(SLOPE_TOP) - 0.1, SLOPE_TOP], [YN, SLOPE_TOP], [YN, PARAPET], [YN - 1, PARAPET], [YN - 1, LOW], [W(SLOPE_TOP) - 0.1, LOW]], XW, XE)
  // The raised core and back block, with the end notches and back recess.
  const raised: XY[] = [
    [XW, 13], [XW, -8], [-63, -8], [-63, -25], [XW, -25], [XW, YS], [-52.8, YS], [-52.8, -26.1], [-26.4, -26.1],
    [-26.4, YS], [XE, YS], [XE, -25], [67, -25], [67, -8], [XE, -8], [XE, 13],
  ]
  block(conc, roof, raised, 0, CORE, 0.4)
  // The end-wing notches, lower.
  block(conc, roof, rect(XW, -25, -63, -8), 0, LOW, 0.3)
  block(conc, roof, rect(67, -25, XE, -8), 0, LOW, 0.3)
  // Over the bay between the two western pylons the core juts to y = 18.
  block(conc, roof, rect(-49, 12.5, -27.5, 18), SLOPE_TOP, CORE, 0.3)
  // The Great Court skylight.
  // (pale panels in NAIP, drawn as a low block in the roof's buff)
  block(conc, roof, rect(-12, -20, 32, -4), CORE - 0.2, CORE + 0.5, 0.25)

  // --- The leaning face ---------------------------------------------------
  // Fins: one at each end, one each side of every pylon, ~23 m bays between.
  const PYLONS: [number, number][] = [[58, 18], [-22, 18.5], [-54.5, 18]]
  const fins = [XE - 0.7, 63.5, 52.5, 29.5, 6.5, -16.5, -27.5, -49, -60, XW + 0.7]
  const finRing: XY[] = [[W(0) - 0.2, 0], [O(0), 0], [O(SLOPE_TOP), SLOPE_TOP], [W(SLOPE_TOP) - 0.2, SLOPE_TOP]]
  for (const x of fins) prismX(conc, finRing, x - 0.9, x + 0.9)
  // Window bands, seven floors, in every bay (the sill ledges are left out:
  // their lit tops turned the face to noise at phone size).
  for (let i = 0; i < fins.length - 1; i++) {
    const xa = fins[i + 1] + 0.9, xb = fins[i] - 0.9
    for (let f = 0; f < 7; f++) slopePanel(win, xa, xb, 4 * f + 0.4, 4 * f + 3.6)
  }
  // The balcony box across the special bay.
  block(conc, conc, rect(-49 + 0.7, W(13) - 0.5, -27.5 - 0.7, O(16.5) - 0.2), 13, 16.5, 0.25)

  // The three pylons, free under the overhang and rising into it.
  for (const [x, y] of PYLONS) {
    lathe(conc, x, y, [[4.8, 0], [4.8, PYLON]], 16)
    const ring: XY[] = Array.from({ length: 16 }, (_, k) => [x + 4.8 * Math.cos((k / 16) * 2 * Math.PI), y + 4.8 * Math.sin((k / 16) * 2 * Math.PI)])
    cap(roof, ring, PYLON)
  }

  // --- The back and the ends ---------------------------------------------
  const bands = (z1max: number) => Array.from({ length: 7 }, (_, f) => [4.3 * f + 0.9, 4.3 * f + 3.8] as [number, number]).filter(([, b]) => b < z1max)
  // Back face: two stacks and the recess, solid stair towers between.
  const south = (y: number, x0: number, x1: number): [XY, XY] => [[x0, y], [x1, y]]
  for (const [x0, x1] of [[-24, 9], [13, 45]]) {
    const [a, b] = south(YS, x0, x1)
    for (const [z0, z1] of bands(CORE - 2)) panel(win, a, b, 0, x1 - x0, z0, z1, 0.06)
  }
  {
    const [a, b] = south(-26.1, -51, -28.2)
    for (const [z0, z1] of bands(CORE - 2)) panel(win, a, b, 0, 22.8, z0, z1, 0.06)
  }
  // End walls: bands in the notches.
  for (const [z0, z1] of bands(LOW - 0.5)) {
    panel(win, [XW, -8.8], [XW, -24.2], 0, 15.4, z0, z1, 0.06)
    panel(win, [XE, -24.2], [XE, -8.8], 0, 15.4, z0, z1, 0.06)
  }
  // ...and on the notch walls facing the ends.
  for (const [z0, z1] of bands(LOW - 0.5)) {
    panel(win, [-63, -24.2], [-63, -8.8], 0, 15.4, z0, z1, 0.06)
    panel(win, [67, -8.8], [67, -24.2], 0, 15.4, z0, z1, 0.06)
  }

  return [
    { part: conc, material: finish('dch-concrete', 0xdccdb2) },
    // the recessed bands read deep dark in every photo: `window`, darkened
    { part: win, material: { ...PALETTE.window, color: 0x4f5f6d } },
    // NAIP and Barera's aerial: the roofs are buff, a touch darker than the walls
    { part: roof, material: finish('dch-roof', 0xcdbea3) },
  ]
}

if (import.meta.main) await save('dal-dallas-city-hall', 'Dallas City Hall', ANCHOR, BEARING, build())
