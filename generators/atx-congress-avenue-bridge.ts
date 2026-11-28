/**
 * Ann W. Richards Congress Avenue Bridge, Austin (1910; deck rebuilt and
 * widened 1980) — procedural, CC0-1.0, no textures.
 * bun generators/atx-congress-avenue-bridge.ts
 *
 * The "bat bridge": eight open-spandrel concrete segmental arches carrying
 * Congress Avenue over Lady Bird Lake, abutment to abutment inside OSM's
 * man_made=bridge outline. The arch barrels with their rings on the faces,
 * the spandrel columns standing on them, the seven piers with their round
 * cutwaters and the pilasters above them, the 1980 deck with its fascia
 * cantilevered past the arches, the sidewalks (the model's own walkways),
 * the steel railings on the deck edges and the lamp standards, which stand
 * over the piers on alternate sides. Low model: railings as a top rail on
 * posts at half density, outer spandrel columns only. Detail model (z16):
 * railing posts at their spacing with three rails, the inner rows of
 * spandrel columns, brackets under the deck overhang, lamp arms.
 *
 * Frame: x across (+x to the ESE, the downstream side), y along the bridge
 * toward downtown (NNE), z up, metres. Bearing 17.88, the line of the
 * roadway (OSM way 15377301, straight); anchor -97.7452919, 30.2613930, the
 * outline's centroid. z = 0 is Lady Bird Lake, the map's Mapterhorn water
 * (130.50 m; the lidar's lake 130.53 m, NAVD88). Feet on land run down to
 * the map's terrain vertex by vertex (GROUND, Mapterhorn z15, 5 m in this
 * frame); river piers stand at z = 0.
 *
 * The map owns the roadway between the curbs (x = -8.9 to 8.9); nothing here
 * is a slab at road level there. The sidewalks outside the curbs are drawn.
 *
 * Roadway built to (lidar, tools/bridge_ele.py measure on way 15377301 and
 * the sidewalks 206110434 and 206110436, USGS_LPC_TX_Central_B1_2017_LAS_2019;
 * heights above 130.50 m): dead level, 13.35 m (143.85 m NAVD88, every
 * reading within 0.03 m) from end to end; sidewalks 13.47 m. `ele` for the
 * roadway's two end nodes, two new roadway nodes and two new nodes on the
 * west sidewalk is proposed in landmarks-scratch/osm-ele/
 * atx-congress-avenue-bridge.osc and .md (+1.00 m, GEOID18 to EGM96), not
 * uploaded.
 *
 * Ends. Both ends land on the street level of the banks (lidar bare earth
 * 0.3 m under the road at the south end, 1.2 m at the north). The arches
 * end at abutments at y = -144.65 and 142.25 (a half pier from the lamp
 * rhythm); the deck edges run on over walls footed on the terrain to the
 * outline's ends (y = +-146.2). The end spans' arches run into the map's
 * terrain where its banks rise over them, and are cut off there.
 *
 * Replaces: the man_made=bridge outline way/708605258 (OSM maps no piers or
 * buildings under it). The Butler Trail boardwalk (way/886321780, its own
 * bridge outline) passes under the north span and is left to the map.
 *
 * Sources
 * - OSM (© OpenStreetMap contributors): the outline way/708605258 (292 x
 *   24.6 m, bridge:structure=arch, Q4766731); the roadway 15377301; the
 *   sidewalk cycleways 206110434 and 206110436.
 * - Lidar (measured; USGS 3DEP USGS_LPC_TX_Central_B1_2017_LAS_2019, flown
 *   2017, 1 m grid): the level roadway; the deck 25.5 m wide, curbs 17.8 m
 *   apart, sidewalks 3.5 m and 0.12 m above the road; railings 1.1 m over the
 *   walk; lamp poles 14-15 m over the road at y = -144, -74, -2, 72 and 144
 *   on the east side and -110 and 108 on the west, 36.3 m apart along the
 *   bridge: they mark the piers, which the lidar cannot see under the deck;
 *   the lake at 130.53 m (Lady Bird Lake's normal pool, 428.25 ft = 130.53 m);
 *   the south floodplain 2-3 m over the lake, the north bank rising from
 *   y = 121. The lidar sits about 0.5 m east of OSM; the model follows OSM.
 * - Map terrain: Mapterhorn z15 (tools/terrain.ts grid, bearing 17.88, 5 m).
 * - Published (Wikipedia, "Ann W. Richards Congress Avenue Bridge"): built
 *   1910 as concrete arches, rebuilt in 1980 with the present deck, whose
 *   crevices house the bat colony; renamed 2006.
 * Photos (evidence):
 * - Stuart Seeger, "Congress Avenue Bridge.jpg", CC BY 2.0 (from the south
 *   bank: equal segmental arches, open spandrels, piers and pilasters):
 *   https://commons.wikimedia.org/wiki/File:Congress_Avenue_Bridge.jpg
 * - Bil (no machine-readable author), "Congress Ave. Bridge atop Lake Lady
 *   Bird, Austin, TX IMG 6286.JPG", CC BY-SA 3.0 (from the north-east, high:
 *   every span, pier cutwaters, the deck overhang, lamps):
 *   https://commons.wikimedia.org/wiki/File:Congress_Ave._Bridge_atop_Lake_Lady_Bird,_Austin,_TX_IMG_6286.JPG
 * - LoneStarMike, "CongressAveBridge-Apr2010.JPG", CC BY-SA 3.0 (from the
 *   west, high: piers under the overhanging deck, lamps on both sides):
 *   https://commons.wikimedia.org/wiki/File:CongressAveBridge-Apr2010.JPG
 * - Dtobias, "Congress-ave-bridge-austin.jpg" and "Bat-bridge-austin-3.jpg",
 *   CC BY-SA 3.0 (the railing, the fascia, the arch soffit from below):
 *   https://commons.wikimedia.org/wiki/File:Congress-ave-bridge-austin.jpg
 *   https://commons.wikimedia.org/wiki/File:Bat-bridge-austin-3.jpg
 * - Michael Barera, "Austin August 2019 26 (Ann W. Richards Congress Avenue
 *   Bridge).jpg", CC BY-SA 4.0 (the sidewalk and railing):
 *   https://commons.wikimedia.org/wiki/File:Austin_August_2019_26_(Ann_W._Richards_Congress_Avenue_Bridge).jpg
 * - LoneStarMike, "CongressAveBridge-Jan2009.JPG", CC BY-SA 3.0 (dusk: the
 *   lamps lit):
 *   https://commons.wikimedia.org/wiki/File:CongressAveBridge-Jan2009.JPG
 *
 * Numbers
 * - Piers every 36.3 m (lidar lamp rhythm), y = -1.2 + 36.3 k, k = -3..3;
 *   eight spans of 32.7 m clear between 3.6 m piers (photos: equal arches);
 *   abutment faces half a span outside the end piers.
 * - Arches: springing 3.0 m over the lake, intrados crown 11.1 m (rise 8.1 m,
 *   photo-scaled), ring 0.9 m deep at the crown and 1.5 m at the springing;
 *   barrels 20 m wide (the 1910 width, estimated from the deck overhang in
 *   the photos); spandrel columns 3.3 m apart (photo).
 * - Piers: 20 m across with semicircular cutwaters of 1.8 m radius to the
 *   springing; above it, pilasters on the faces and an open spandrel with a
 *   cross wall (photo).
 * - Deck: soffit 1.4 m under the road, fascia to the railing curb 0.3 m over
 *   the walk; railings 1.05 m (lidar 1.1); lamps 14 m over the road with a
 *   2.5 m arm (lidar, photos).
 * - Colours: pale weathered concrete from the daylight photos, #d6cfc2,
 *   undersides #b9b1a3; walks #cdc8bd; galvanised railings and poles #a3a9af.
 * - Night: the lamp heads (`lamp`); the arches are not floodlit.
 *
 * Doubts
 * - The pier positions come from the lamp rhythm, the span count (eight)
 *   from the photos; neither is published here.
 * - The arch barrels' width and the spandrel columns' arrangement inside
 *   are estimated; the bats' crevices under the deck are not modelled.
 */
import { Part, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { finish } from './palette'
import { bead, face, footedLoft, groundAt, rod, stations, type GroundGrid } from './bridge-kit'

// ---- The map's terrain, metres above the lake (Mapterhorn z15, 130.50 m) ----
// rows along y from -160 every 5 m, columns across x from -25 every 5 m
const GROUND: GroundGrid = { y0: -160, x0: -25, step: 5, z: [
  [5.2, 5.5, 11.9, 13.2, 13.1, 13.2, 13.2, 13.1, 12.4, 6.9, 5.8],
  [4.9, 5.4, 11.9, 13.3, 13.2, 13.3, 13.2, 13.2, 12.5, 6.2, 5.5],
  [4.7, 5.1, 12.2, 13.4, 13.3, 13.3, 13.3, 13.3, 12.7, 6.3, 5.2],
  [4.5, 4.4, 5.7, 8.8, 11.5, 12.0, 11.8, 10.8, 7.5, 4.7, 4.8],
  [4.4, 3.8, 3.6, 5.4, 7.9, 7.7, 7.2, 6.4, 3.7, 3.9, 4.4],
  [4.4, 3.6, 3.4, 4.0, 4.0, 3.7, 3.6, 3.4, 3.3, 3.6, 4.1],
  [4.1, 3.4, 3.3, 3.2, 3.2, 3.1, 3.1, 3.1, 3.2, 3.5, 3.8],
  [4.2, 3.3, 3.2, 3.1, 3.1, 3.1, 3.1, 3.0, 3.0, 3.3, 3.6],
  [4.1, 3.2, 3.1, 3.1, 3.0, 3.0, 3.0, 3.0, 2.9, 3.1, 3.4],
  [4.0, 3.1, 3.0, 2.9, 2.9, 2.9, 2.9, 2.8, 2.8, 2.9, 3.2],
  [4.0, 3.0, 2.8, 2.8, 2.8, 2.8, 2.8, 2.8, 2.7, 2.8, 3.1],
  [3.8, 2.8, 2.7, 2.7, 2.6, 2.6, 2.6, 2.6, 2.6, 2.6, 3.0],
  [3.7, 2.6, 2.6, 2.6, 2.6, 2.6, 2.6, 2.5, 2.5, 2.5, 2.9],
  [3.4, 2.5, 2.5, 2.4, 2.4, 2.4, 2.4, 2.3, 2.3, 2.4, 2.8],
  [3.1, 2.4, 2.3, 2.3, 2.3, 2.2, 2.3, 2.2, 2.3, 2.3, 2.7],
  [3.3, 2.3, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.5],
  [3.2, 2.1, 2.0, 1.9, 1.7, 1.8, 1.9, 2.0, 2.2, 2.1, 2.4],
  [2.0, 1.8, 1.5, 1.5, 1.0, 0.9, 1.0, 1.3, 2.0, 2.1, 2.4],
  [0.9, 0.4, 0.3, 0.3, 0.2, 0.1, 0.2, 0.1, 0.6, 1.5, 2.0],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1],
  ...Array.from({ length: 37 }, () => Array(11).fill(0)), // y = -60 .. 120: the lake
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.3],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.6, 2.3, 3.1],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.1, 0.3, 1.1, 3.2, 3.5, 4.2],
  [0.7, 0.4, 0.9, 1.9, 3.5, 4.9, 5.9, 5.8, 4.8, 5.8, 6.5],
  [3.3, 6.2, 10.1, 11.5, 12.0, 12.1, 12.2, 12.1, 10.6, 10.1, 9.8],
  [7.9, 12.0, 13.2, 13.4, 13.3, 13.4, 13.3, 13.3, 13.4, 12.2, 11.2],
  [9.8, 12.2, 13.1, 13.3, 13.2, 13.4, 13.3, 13.2, 13.3, 12.4, 11.3],
  [10.3, 12.0, 12.8, 13.1, 13.2, 13.3, 13.3, 13.1, 13.2, 12.6, 11.6],
] }
if (GROUND.z.length !== 65) throw new Error(`GROUND has ${GROUND.z.length} rows`)
// Feet on land go 0.5 m into the terrain: the 5 m grid misses up to that much on the banks' slopes.
const ground = (x: number, y: number) => { const g = groundAt(GROUND, x, y); return g > 0.6 ? g - 0.5 : Math.max(0, g) }

// ---- The roadway (lidar, tools/bridge_ele.py; metres above 130.50 m) ---------
const ROAD = 13.35, WALK = 13.47

// ---- Plan -----------------------------------------------------------------------
const Y_S = -146.2, Y_N = 146.2 // the outline's ends
const PIERS = [-3, -2, -1, 0, 1, 2, 3].map((k) => -1.2 + 36.3 * k)
const PIER_T = 3.6
const Y_SABUT = -1.2 - 36.3 * 4 + PIER_T / 2, Y_NABUT = -1.2 + 36.3 * 4 - PIER_T / 2 // -144.65, 142.25
const EDGE = 12.4, CURB = 8.9, RAIL = 12.15 // deck edge, curbs, railing line (lidar)
const SOFFIT = ROAD - 1.4
const BARREL = 10.0 // arch barrels' half-width
const SPRING = 3.0, CROWN = 11.1 // springing and intrados crown, over the lake
// lamp standards over the piers, alternate sides (lidar); the ends' lamps on the east
const LAMPS: [number, number][] = [
  [1, -146.4 + 1.5], [-1, PIERS[0]], [1, PIERS[1]], [-1, PIERS[2]], [1, PIERS[3]], [-1, PIERS[4]], [1, PIERS[5]], [-1, PIERS[6]], [1, 144.0 - 1.5],
]

// ---- Materials ------------------------------------------------------------------
const CONCRETE: MaterialSpec = finish('bridge-concrete', 0xd6cfc2)
const SHADE: MaterialSpec = finish('bridge-concrete-shade', 0xb9b1a3)
const WALKMAT: MaterialSpec = finish('concrete-walk', 0xcdc8bd)
const STEEL: MaterialSpec = finish('galvanised-steel', 0xa3a9af)
const LAMP: MaterialSpec = finish('lamp', 0x8d9298)
type Set = { stone: Part; shade: Part; walk: Part; steel: Part; lamp: Part }

const nrm = (v: V3): V3 => { const l = Math.hypot(...v) || 1; return [v[0] / l, v[1] / l, v[2] / l] }
/** An upright box x0..x1, y0..y1, from z0 (or the ground) to z1. */
function block(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number | 'ground', z1: number, seg = 4) {
  footedLoft(p, ground, [
    { plan: [[x0, y0], [x1, y0], [x1, y1], [x0, y1]], z: z0 },
    { plan: [[x0, y0], [x1, y0], [x1, y1], [x0, y1]], z: z1 },
  ], seg)
}
/** A wall along y at x, facing `side` (+1 east), between bot(y) and top(y). */
function wallY(p: Part, x: number, ys: number[], top: (y: number) => number, bot: (y: number) => number, side: number) {
  for (let i = 0; i + 1 < ys.length; i++) {
    const [a, b] = [ys[i], ys[i + 1]]
    if (Math.max(top(a) - bot(a), top(b) - bot(b)) <= 0.01) continue
    face(p, [x, a, bot(a)], [x, b, bot(b)], [x, b, Math.max(top(b), bot(b))], [x, a, Math.max(top(a), bot(a))], [side, 0, 0])
  }
}
/** A sheet x0..x1 along ys at z(y), facing up or down. */
function sheet(p: Part, x0: number, x1: number, ys: number[], z: (y: number) => number, up: boolean) {
  for (let i = 0; i + 1 < ys.length; i++) {
    const [a, b] = [ys[i], ys[i + 1]]
    const t = nrm([0, b - a, z(b) - z(a)]), n: V3 = up ? [0, -t[2], t[1]] : [0, t[2], -t[1]]
    face(p, [x0, a, z(a)], [x1, a, z(a)], [x1, b, z(b)], [x0, b, z(b)], n)
  }
}
const sortedYs = (y0: number, y1: number, step: number, br: number[] = []) =>
  [...new Set([...stations(y0, y1, step), ...br.filter((b) => b > y0 && b < y1)])].sort((a, b) => a - b)

// ---- Arches ---------------------------------------------------------------------
type Span = { a: number; b: number }
const SPANS: Span[] = [Y_SABUT, ...PIERS.map((y) => y + PIER_T / 2)].map((a, i) => ({ a, b: i < PIERS.length ? PIERS[i] - PIER_T / 2 : Y_NABUT }))
/** The intrados of a span: a segmental arc from the springings up to the crown. */
function intrados(sp: Span) {
  const c = sp.b - sp.a, r = CROWN - SPRING, R = (c * c / 4 + r * r) / (2 * r), m = (sp.a + sp.b) / 2
  return (y: number) => CROWN - R + Math.sqrt(Math.max(0, R * R - (y - m) ** 2))
}
const ringDepth = (sp: Span) => (y: number) => 0.9 + 0.6 * ((y - (sp.a + sp.b) / 2) / ((sp.b - sp.a) / 2)) ** 2

/** The highest terrain across the arch barrels at y. */
const bankAt = (y: number) => Math.max(...[-BARREL, -5, 0, 5, BARREL].map((x) => ground(x, y)))
function arches(s: Set, detail: boolean) {
  for (const sp of SPANS) {
    const intr = intrados(sp), dep = ringDepth(sp)
    const extr = (y: number) => Math.min(intr(y) + dep(y), SOFFIT)
    // stations where the arch stands clear of the map's terrain (the end spans run into the banks)
    const clear = (y: number) => extr(y) > bankAt(y) + 0.1
    const ys = stations(sp.a, sp.b, (sp.b - sp.a) / (detail ? 16 : 10)).filter(clear)
    if (ys.length < 2) continue
    // the soffit, the ring faces and the extrados
    sheet(s.shade, -BARREL, BARREL, ys, intr, false)
    for (const sd of [-1, 1]) wallY(s.stone, sd * BARREL, sd > 0 ? ys : [...ys].reverse(), extr, intr, sd)
    sheet(s.stone, -BARREL, BARREL, ys, extr, true)
    // spandrel columns from the ring up to the deck
    const rows = detail ? [-BARREL + 0.4, -3.4, 3.4, BARREL - 0.4] : [-BARREL + 0.4, BARREL - 0.4]
    for (const y of stations(sp.a + 1.6, sp.b - 1.6, 3.3)) {
      const z0 = extr(y) - 0.1
      if (SOFFIT - z0 < 0.7 || !clear(y) || y < ys[0] || y > ys[ys.length - 1]) continue
      for (const x of rows) block(s.shade, x - 0.25, x + 0.25, y - 0.25, y + 0.25, z0, SOFFIT, 30)
    }
  }
}

// ---- Piers and abutments ---------------------------------------------------------
function piers(s: Set, detail: boolean) {
  const nose = detail ? 8 : 5
  for (const y of PIERS) {
    // the base with its round cutwaters, from the lake bed (or the ground) to the springing
    const plan: [number, number][] = []
    for (let i = 0; i <= nose; i++) { const a = -Math.PI / 2 + (Math.PI * i) / nose; plan.push([BARREL + 1.8 * Math.cos(a), y + 1.8 * Math.sin(a)]) }
    for (let i = 0; i <= nose; i++) { const a = Math.PI / 2 + (Math.PI * i) / nose; plan.push([-BARREL + 1.8 * Math.cos(a), y + 1.8 * Math.sin(a)]) }
    footedLoft(s.stone, ground, [{ plan, z: 'ground' }, { plan, z: SPRING + 0.4 }], 4)
    // pilasters on the faces from the springing to the deck; between them the spandrel is open
    for (const sd of [-1, 1]) block(s.stone, sd > 0 ? BARREL - 0.9 : -BARREL - 0.3, sd > 0 ? BARREL + 0.3 : -BARREL + 0.9, y - PIER_T / 2, y + PIER_T / 2, SPRING + 0.4, SOFFIT, 30)
    // a cross wall over the pier's middle, set back in the shade
    block(s.shade, -BARREL + 0.9, BARREL - 0.9, y - 0.4, y + 0.4, SPRING + 0.4, SOFFIT, 30)
  }
  // abutments: faces from the terrain to the deck, the ends' wing walls
  for (const [y, d] of [[Y_SABUT, -1], [Y_NABUT, 1]] as [number, number][]) {
    // from the abutment face to the outline's end, uncapped (the deck covers it)
    const y0 = d < 0 ? Y_S : y, y1 = d < 0 ? y : Y_N
    footedLoft(s.stone, ground, [
      { plan: [[-BARREL - 0.3, y0], [BARREL + 0.3, y0], [BARREL + 0.3, y1], [-BARREL - 0.3, y1]], z: 'ground' },
      { plan: [[-BARREL - 0.3, y0], [BARREL + 0.3, y0], [BARREL + 0.3, y1], [-BARREL - 0.3, y1]], z: SOFFIT },
    ], 2, false)
  }
}

// ---- Deck, sidewalks, railings, lamps ----------------------------------------------
function deck(s: Set, detail: boolean) {
  const br = [Y_SABUT, Y_NABUT, ...PIERS]
  const all = sortedYs(Y_S, Y_N, detail ? 6 : 12, br)
  const onLand = (y: number) => y < Y_SABUT - 1e-6 || y > Y_NABUT + 1e-6
  for (const sd of [-1, 1]) {
    const o = (l: number[]) => (sd > 0 ? l : [...l].reverse())
    // fascia: from the soffit (or the terrain past the abutments) to the railing curb
    wallY(s.stone, sd * EDGE, o(all), () => WALK + 0.3, (y) => (onLand(y) ? Math.min(SOFFIT, ground(sd * EDGE, y)) : SOFFIT), sd)
    // the overhang's underside, outside the arch barrels
    sheet(s.shade, sd > 0 ? BARREL : -EDGE, sd > 0 ? EDGE : -BARREL, all.filter((y) => !onLand(y)), () => SOFFIT, false)
    // the railing curb
    const ci = sd * (RAIL - 0.2)
    wallY(s.stone, ci, o(all).reverse(), () => WALK + 0.3, () => WALK - 0.02, -sd)
    sheet(s.stone, sd > 0 ? ci : -EDGE, sd > 0 ? EDGE : ci, all, () => WALK + 0.3, true)
    // the sidewalk (the model's walkway) and its curb face down to the road
    sheet(s.walk, sd > 0 ? CURB : ci, sd > 0 ? ci : -CURB, all, () => WALK, true)
    wallY(s.walk, sd * CURB, o(all).reverse(), () => WALK, () => ROAD - 0.05, -sd)
    // railing: posts and rails (a top rail on posts at half density in the low model)
    const x = sd * RAIL, top = WALK + 0.3 + 0.75
    for (const y of stations(Y_S + 0.3, Y_N - 0.3, detail ? 2.4 : 9.6)) {
      const w = detail ? 0.09 : 0.12
      block(s.steel, x - w, x + w, y - w, y + w, WALK + 0.3, top, 30)
    }
    for (const z of detail ? [top - 0.06, top - 0.32, top - 0.58] : [top - 0.06]) {
      const h = detail ? 0.06 : 0.1
      for (const [xx, n] of [[x - h, -1], [x + h, 1]] as [number, number][]) wallY(s.steel, xx, n > 0 ? all : [...all].reverse(), () => z + h, () => z - h, n)
      sheet(s.steel, x - h, x + h, all, () => z + h, true)
      sheet(s.steel, x - h, x + h, all, () => z - h, false)
    }
    // brackets under the overhang (detail)
    if (detail) for (const y of stations(Y_SABUT + 1.6, Y_NABUT - 1.6, 3.3)) {
      if (PIERS.some((p) => Math.abs(p - y) < PIER_T / 2 + 0.4)) continue
      block(s.shade, sd > 0 ? BARREL : -EDGE + 0.4, sd > 0 ? EDGE - 0.4 : -BARREL, y - 0.3, y + 0.3, SOFFIT - 0.7, SOFFIT, 30)
    }
  }
  // the deck's ends
  for (const [y, d] of [[Y_S, -1], [Y_N, 1]] as [number, number][]) for (const sd of [-1, 1]) {
    const xa = sd * CURB, xb = sd * EDGE
    face(s.stone, [xa, y, Math.min(ground(xb, y), WALK - 0.3)], [xb, y, Math.min(ground(xb, y), WALK - 0.3)], [xb, y, WALK + 0.3], [xa, y, WALK + 0.3], [0, d, 0])
  }
  // lamp standards: a pole on the curb, an arm over the road, the head
  for (const [sd, y] of LAMPS) {
    const x = sd * (RAIL - 0.5), zt = ROAD + 14.0
    block(s.steel, x - 0.18, x + 0.18, y - 0.18, y + 0.18, WALK + 0.3, zt, 30)
    const hx = x - sd * 2.6
    if (detail) rod(s.steel, [x, y, zt - 0.1], [hx, y, zt + 0.25], 0.08, 4)
    else block(s.steel, Math.min(x, hx), Math.max(x, hx), y - 0.1, y + 0.1, zt - 0.2, zt, 30)
    bead(s.lamp, [hx, y, zt - 0.05], detail ? 0.45 : 0.55, !detail)
  }
}

function build(detail: boolean): Set {
  const s: Set = { stone: new Part(), shade: new Part(), walk: new Part(), steel: new Part(), lamp: new Part() }
  arches(s, detail)
  piers(s, detail)
  deck(s, detail)
  return s
}

if (import.meta.main) {
  const extras = {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin on the deck centre line at the outline centroid, at the lake',
    bearing: 17.88, elevation: 0, roadway: { level: ROAD, walks: WALK },
  }
  for (const [file, detail, maxTris, maxBytes] of [
    ['atx-congress-avenue-bridge.glb', false, 6500, 250 * 1024],
    ['atx-congress-avenue-bridge.detail.glb', true, 40000, 1536 * 1024],
  ] as const) {
    const s = build(detail)
    const list = [
      { part: s.stone, material: CONCRETE }, { part: s.shade, material: SHADE }, { part: s.walk, material: WALKMAT },
      { part: s.steel, material: STEEL }, { part: s.lamp, material: LAMP },
    ]
    const tris = list.reduce((n, p) => n + p.part.triangles, 0)
    const glb = writeGlb('Ann W. Richards Congress Avenue Bridge', list, extras)
    console.log(`${file}: ${tris} triangles, ${glb.length} bytes; ` + list.map((p) => `${p.material.name} ${p.part.triangles}`).join(', '))
    if (tris > maxTris || glb.length > maxBytes) throw new Error(`${file} over budget`)
    await Bun.write(new URL(`../models/${file}`, import.meta.url), glb)
  }
  console.log(SPANS.map((s) => `${s.a.toFixed(2)}..${s.b.toFixed(2)}`).join('; '))
}
