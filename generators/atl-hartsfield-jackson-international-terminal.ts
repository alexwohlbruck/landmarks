/**
 * Hartsfield-Jackson Atlanta International Airport (ATL): the Maynard H.
 * Jackson Jr. International Terminal (2012) and Concourse F. Procedural,
 * CC0-1.0, no textures.
 *
 *   bun generators/atl-hartsfield-jackson-international-terminal.ts
 *
 * Writes models/atl-hartsfield-jackson-international-terminal.glb (low) and
 * .detail.glb (mullion groups, the curb roof's columns and fins, jet-bridge
 * posts and cabs). Uses the kit in atl-hartsfield-jackson-domestic-terminal.ts.
 *
 * Frame: x east, y north, z up, metres, bearing 0. Anchor (-84.4193825,
 * 33.6396942): the area centroid of the two OSM outlines.
 *
 * Evidence
 * - OSM: way/169784353 (Concourse F), way/328278997 (Maynard H. Jackson
 *   Junior International Terminal), way/575713368 (the footbridge from its
 *   front to the parking deck, levels 2-4); 12 aeroway=jet_bridge ways
 *   (F1-F14).
 *   OSM has no heights. The control tower (way/169785102) is a separate
 *   model and is not drawn here.
 * - Lidar: USGS 3DEP GA_Central_5_2018, 1 m grid. The terminal's landside
 *   arrivals road (288.6 m) is the lowest ground under the footprint and is
 *   the model's y = 0; the apron is 13 m higher (lidar and the map's
 *   terrain agree), so F's walls run down into the bank. Above the apron:
 *   - the terminal hall 20.5 m; its curb roof 13 m, reaching 14 m out over
 *     the departures roadway;
 *   - Concourse F: the hub and north block 21 m; the pier 12 m with a
 *     raised clerestory spine to 17 m; the north stub 13 m; the low east
 *     wing 6 m; the south tip 10 m.
 * - NAIP (USGS, public domain): plan, the white roofs, the solar arrays on
 *   F's hub roof, the curb roof's grey glazing.
 * - Photos:
 *   - "Atlanta International Terminal (23606017723)", formulanone, CC BY-SA
 *     2.0 (Flickr/Commons): F from the south-west: white walls, light
 *     grey-blue glazing bands, the raised spine, the taller hub, the
 *     terminal behind.
 *   - "ATL Concourse F During Takeoff - February 2016", formulanone, CC
 *     BY-SA 2.0 (Flickr): F and the terminal from the south-east.
 *   - "ATL Terminal F (22183473160).jpg", formulanone, CC BY-SA 2.0: F's hub and
 *     pier from the south-east at low sun, solar panels on the hub.
 *   - "Atlanta Airport International Terminal Dec 2021 2.jpg", Thomson200,
 *     CC0: the arrivals curb under the departures deck and the terminal's
 *     roof overhang on square columns.
 *   - "Atlanta Airport International Terminal Dec 2021 1.jpg", Thomson200,
 *     CC0: the check-in hall's tall glass front under the wave ceiling.
 *
 * Estimated: the glazing bands' heights (photos); the curb roof's column
 * spacing (12 m); jet-bridge floors 5 m above the apron.
 * Doubts: the curb roof over the departures roadway is not in OSM; it is
 * drawn from lidar and NAIP. F's low east wing is partly apron in NAIP; it
 * is kept at one storey as OSM maps it.
 */
import { Part } from './mesh'
import { finish } from './palette'
import {
  type XY, ATL, rect, box, concourse, newConcourseParts, plantClusters, jetBridges, writeModel, panelRow, mullions, bandRow, lathe,
} from './atl-hartsfield-jackson-domestic-terminal'

// way/169784353
const F: XY[] = [[-62.7,-236.0],[-62.7,-214.9],[-62.6,-159.9],[-62.6,-89.9],[-62.5,-21.3],[-62.5,30.5],[-62.5,42.3],[-68.3,45.4],[-78.7,50.9],[-78.5,88.8],[-63.0,91.6],[-63.1,106.6],[-63.4,147.6],[-63.5,158.8],[-63.0,167.6],[-46.7,152.0],[-38.7,144.1],[-35.0,137.2],[-32.2,128.9],[-30.5,119.4],[-29.8,111.6],[-24.8,102.2],[-17.7,96.8],[-6.2,92.0],[-6.1,68.6],[-6.0,65.1],[-5.9,51.3],[59.6,52.0],[59.5,45.8],[59.3,37.5],[37.8,37.3],[37.3,29.0],[36.5,26.2],[33.6,26.2],[33.9,19.0],[26.3,-2.6],[22.0,-2.6],[22.2,-8.7],[16.9,-8.7],[16.9,-15.3],[10.3,-15.5],[10.2,-29.5],[10.2,-46.8],[-0.9,-47.0],[-1.0,-50.7],[-1.1,-53.7],[-13.0,-54.0],[-13.2,-67.9],[-12.2,-67.9],[-12.6,-83.4],[-15.5,-83.4],[-15.3,-115.0],[-26.2,-114.9],[-26.5,-129.9],[-24.7,-129.9],[-24.8,-131.3],[-25.2,-192.6],[-25.2,-195.4],[-26.2,-195.4],[-26.7,-214.9],[-26.7,-216.9],[-26.6,-235.9],[-34.2,-235.9],[-34.3,-245.7],[-38.8,-245.7],[-41.9,-245.7],[-49.8,-245.8],[-49.8,-241.9],[-49.8,-239.7],[-52.9,-239.7],[-52.8,-236.1]]
// way/328278997
const TERM: XY[] = [[193.7,91.4],[189.0,86.1],[189.1,82.3],[192.9,78.0],[170.6,55.6],[170.7,52.0],[170.7,50.2],[167.8,50.2],[167.8,45.8],[147.4,46.2],[127.6,46.2],[127.6,52.3],[59.6,52.0],[-5.9,51.3],[-6.0,65.1],[-6.1,68.6],[-6.2,92.0],[7.3,92.0],[31.9,92.0],[36.4,92.1],[42.6,92.1],[61.6,92.0],[63.2,92.0],[110.5,91.8],[112.0,91.8],[113.5,91.8],[157.9,91.6],[160.2,91.7]]
// aeroway=jet_bridge ways near these concourses (OSM)
const JETS: XY[][] = [[[-74.6,-251.3],[-49.8,-241.9]],[[-91.5,-181.3],[-74.0,-163.0],[-62.6,-159.9]],[[-92.9,-110.8],[-68.2,-90.5],[-62.6,-89.9]],[[-94.8,-43.2],[-74.2,-21.4],[-62.5,-21.3]],[[-95.7,25.8],[-78.4,30.4],[-62.5,30.5]],[[-95.5,144.4],[-63.4,147.6]],[[-100.9,82.1],[-73.7,104.7],[-63.1,106.6]],[[-14.1,-263.4],[-39.6,-262.8],[-38.8,-245.7]],[[-25.2,-192.6],[-2.1,-192.7]],[[-24.8,-131.3],[-10.9,-120.5],[16.2,-104.7]],[[-1.0,-50.7],[17.1,-50.1],[19.6,-42.5],[46.4,-34.5]],[[10.2,-29.5],[53.2,4.0],[91.8,12.0]]]

/** The 2012 buildings are whiter than the older concourses. */
const WHITE = finish('atl-intl-white', 0xeeece6)

/** The apron's height above the model's base: the landside roadway in front
 * of the terminal is 13 m lower than the apron behind it (lidar, terrain). */
const G = 13

export function build(detail: boolean) {
  const p = newConcourseParts()
  const solar = new Part() // the hub's solar arrays: dark panels

  // --- Concourse F, on the apron
  concourse(p, F, [
    { y0: -250, y1: -236, h: G + 10 },
    { y0: -236, y1: -64, x1: -26, h: G + 12 },
    { y0: -236, y1: -64, x0: -26, h: G + 6 },
    { y0: -64, y1: 52, x1: -4, h: G + 21 },
    { y0: -64, y1: 52, x0: -4, h: G + 6 },
    { y0: 52, y1: 92, h: G + 21 },
    { y0: 92, y1: 170, h: G + 13 },
  ], { ground: G, detail, redEnds: false, redSides: false })
  // the pier's raised clerestory spine
  box(p.wall, p.pale, rect(-50, -232, -36, -68), G + 12, G + 17, 0.35)
  for (const x of [-50, -36]) {
    const a: XY = x < -40 ? [x, -68] : [x, -232], b: XY = x < -40 ? [x, -232] : [x, -68]
    panelRow(p.win, a, b, G + 13, G + 16, { bay: 10, gap: 1.2, end: 1.5 })
  }
  // solar arrays on the hub roof (NAIP)
  for (const y of [-40, -22, -4]) box(solar, solar, rect(-56, y, -30, y + 12), G + 21, G + 21.6, 0)
  plantClusters(p.metal, [-44, 60], [-44, 160], G + 21, 71, { detail, every: 50 })

  // --- The terminal hall: its landside front stands on the arrivals road,
  // 13 m below the apron, glazed full height above the departures deck.
  const H = G + 20.5
  concourse(p, TERM, [{ y0: 40, y1: 100, h: H }], { ground: G, detail, axis: 'x', redEnds: false, redSides: false, bay: 9 })
  {
    const a: XY = [160, 92.05], b: XY = [-6, 92.05]
    // the arrivals level under the departures deck
    panelRow(p.win, a, b, 1.5, G - 2.5, { bay: 9, gap: 1.5, end: 1.2, out: 0.06 })
    if (detail) mullions(p.trim, a, b, G + 4.6, H - 2.1, 1.8, 0.14, 0.12)
    // the curb roof: a thin slab 14 m out over the departures roadway, on columns
    const y0 = 92, y1 = 106, z0 = G + 12.4, z1 = G + 13.4
    box(p.trim, p.pale, rect(-6, y0, 162, y1), z0, z1, 0.25)
    for (let x = 0; x <= 156; x += 12) {
      // square concrete columns, about 1.8 m (curb photo)
      box(p.trim, null, rect(x - 0.9, y1 - 2.4, x + 0.9, y1 - 0.6), 0, z0, detail ? 0.1 : 0)
    }
    bandRow(p.trim, [162, y1], [-6, y1], z0 - 0.6, z1, 0.05)
  }
  plantClusters(p.metal, [20, 70], [150, 70], H, 72, { detail, every: 45, half: 12 })

  // --- The glazed footbridge to the parking deck (way/575713368, levels 2-4),
  // leaving the front over the roadways; lidar: roof 18 m, deck about 10 m.
  {
    const r = rect(31.7, 92.1, 42.6, 133.7)
    box(p.trim, p.pale, r, 9.6, 18, 0.25)
    for (const [a, b] of [[[42.6, 92.1], [42.6, 133.7]], [[31.7, 133.7], [31.7, 92.1]]] as [XY, XY][]) panelRow(p.win, a, b, 10.8, 16.8, { bay: 6, gap: 0.8, end: 0.6 })
    for (const y of [112, 128]) box(p.trim, null, rect(35.4, y - 0.6, 38.9, y + 0.6), 0, 9.6, 0)
  }

  // --- Jet bridges
  jetBridges(p.metal, p.metal, JETS, G + 5, detail)
  if (process.env.STATS) console.log(Object.entries(p).map(([k, v]) => `${k}=${v.triangles}`).join(' '))
  return [
    { part: p.wall, material: WHITE },
    { part: p.win, material: ATL.window },
    { part: p.pale, material: ATL.roofPale },
    { part: p.trim, material: ATL.trim },
    { part: p.metal, material: ATL.metal },
    { part: solar, material: ATL.panel },
  ]
}

if (import.meta.main) {
  const o = { bearing: 0, height: G + 21.6 }
  await writeModel('atl-hartsfield-jackson-international-terminal.glb', 'Maynard H. Jackson International Terminal and Concourse F', build(false), { ...o, maxTris: 8000, maxBytes: 250_000 })
  await writeModel('atl-hartsfield-jackson-international-terminal.detail.glb', 'Maynard H. Jackson International Terminal and Concourse F', build(true), { ...o, maxTris: 40_000, maxBytes: 1536 * 1024 })
}
