/**
 * Amsterdam Airport Schiphol, piers E, F, G and H/M — procedural, CC0-1.0, no
 * textures. bun generators/amsterdam-schiphol-piers-e-h.ts
 *
 * Writes models/amsterdam-schiphol-piers-e-h.glb (low) and
 * models/amsterdam-schiphol-piers-e-h.detail.glb (detail: the same, with
 * glazed links, stair towers and mullions). Uses the Schiphol kit in
 * amsterdam-schiphol-terminal.ts.
 *
 * These are the northern piers: OSM puts E, F, G and H/M on the north side
 * of the terminal (the assignment's "southern piers" was a slip; B and C are
 * the southern ones). E runs north-east from the terminal's north-east
 * corner, F straight north to a Y-shaped head, G north from the west end of
 * Departures 3, and H (with M on its other face) south-west from the same
 * corner, with a sawtooth of gate rooms along its south side.
 *
 * Map frame: x = east, y = north, z up, metres; bearing 0. Anchor: the
 * area-weighted centroid of the four pier outlines, 4.761681, 52.312022.
 *
 * OSM (all replaced): E-pier way/268641332, F-pier way/268641334 (3 levels,
 * layer 2), G-pier way/268641335, H-pier way/268641337 (height 11.4), and
 * the two low connectors along the north side of Departures 3 between the
 * roots of G, H and F, way/268641362 and way/749201920. OSM maps no
 * new pier or lounge here as built, so none is drawn.
 *
 * Identifying features (photos): long, low, flat-roofed piers with broad
 * glass bands between light grey panels and darker grey roofs; on F a raised
 * dark block on the hub of the Y head and long white fixed links reaching out
 * to the stands on both sides; jet-bridge cabs on posts; H/M a single low
 * level with a sawtooth of gate rooms and no jet bridges (walk-out
 * boarding).
 *
 * Evidence
 * - OSM as above.
 * - Photos (Wikimedia Commons; author, licence):
 *   https://commons.wikimedia.org/wiki/File:EHAM_Terminal_E.jpg (Mark Brouwer,
 *     CC BY-SA 2.5) from the control tower looking north: this is the F pier
 *     (it lies straight north of the tower beyond the dark office block; the
 *     file name says E): the dark roofs, the raised dark block, the white
 *     links;
 *   https://commons.wikimedia.org/wiki/File:SCHIPHOL_PIER_E_-_panoramio.jpg
 *     (Kayhan ERTUGRUL, CC BY-SA 3.0) a pier's two-level glass front from the
 *     apron;
 *   https://commons.wikimedia.org/wiki/File:Aerial_photograph_of_Exit_2_Schiphol-08MAR2019-1.jpg
 *     (Milliped, CC BY-SA 4.0) H/M from the air: white roofs, the sawtooth,
 *     aircraft parked nose-in without bridges;
 *   https://commons.wikimedia.org/wiki/File:Cityhopper_apron_at_Schiphol.JPG
 *     (Robert EA Harvey, CC BY-SA 4.0) and
 *     https://commons.wikimedia.org/wiki/File:Amsterdam_Airport_Schiphol_apron_overview_(4532485694).jpg
 *     (Maarten Visser, CC BY-SA 2.0) the piers' low glass fronts and links;
 *   https://commons.wikimedia.org/wiki/File:Ams-above-2007.jpg (Fyodor
 *     Borisov, CC BY-SA 3.0) the whole complex.
 * - Terrain: Mapterhorn z14 flat to ±0.5 m.
 * - No lidar.
 *
 * Numbers: H 11.4 m (OSM). Estimated (OSM gives none): E 13 m (two glazed
 * levels over a service level, as D's two-level stem); F 14 m (3 levels in
 * OSM) with the raised block to 18 m; G 11 m; the connectors 10 m. Jet
 * bridges every 40 m along both sides of E and G and every 30 m along F, 18 m (E, G) or 24 m (F,
 * the long fixed links in Brouwer's photo) long, floor 4.2 m, roof 7.2 m;
 * three at each tip of F's Y head.
 * Doubts: these piers are the least photographed of the set: E's and G's
 * heights and facades are by analogy with D and F; gate positions are
 * spaced evenly, not mapped; the raised block on F is placed from one photo (2006).
 */
import { type XY, type Mats, type Zone, amsMats, amsParts, zoneMass, writeLod, gateRow, jetBridge, F_PIER, F_PIER_LOW, F_DARK, mullions, prismRing } from './amsterdam-schiphol-terminal'
import { finish } from './palette'

const RINGS: Record<string, XY[]> = {
    'way/268641332': [[234.1, -189.4], [229.4, -197.1], [215.5, -188.0], [213.7, -190.7], [211.5, -189.3], [250.0, -129.6], [329.2, -10.0], [323.3, 3.6], [415.1, 142.9], [424.9, 143.0], [489.8, 241.5], [520.6, 221.4], [442.2, 102.3], [446.1, 93.3], [358.8, -39.2], [344.1, -39.4], [241.9, -194.5]],
    'way/268641334': [[37.0, -101.8], [12.6, -103.0], [10.0, -63.4], [5.8, -63.6], [0.8, 24.5], [1.2, 26.6], [0.5, 40.2], [-24.4, 101.2], [-49.7, 123.7], [-30.2, 145.3], [-2.6, 120.7], [9.9, 125.7], [14.0, 123.8], [22.3, 121.1], [47.6, 149.7], [69.4, 129.6], [46.9, 105.2], [29.6, 41.8], [36.1, -75.5]],
    'way/268641335': [[-281.4, -71.7], [-290.3, -72.1], [-289.7, -82.8], [-285.2, -82.6], [-283.1, -123.6], [-288.8, -123.9], [-288.6, -129.2], [-323.4, -131.0], [-323.7, -125.5], [-331.2, -125.8], [-333.3, -84.9], [-328.6, -84.6], [-335.0, 55.4], [-343.6, 205.4], [-304.7, 207.4], [-290.9, -61.2], [-282.1, -60.7]],
    'way/268641337': [[-273.8, -129.0], [-158.1, -122.8], [-157.2, -134.7], [-325.6, -144.4], [-602.3, -317.9], [-613.3, -300.4], [-601.2, -287.0], [-595.1, -296.6], [-573.2, -282.8], [-576.6, -277.4], [-564.5, -263.9], [-558.4, -273.6], [-536.4, -259.8], [-539.9, -254.4], [-527.8, -240.9], [-521.6, -250.6], [-499.7, -236.8], [-503.2, -231.3], [-491.0, -217.9], [-484.9, -227.5], [-463.0, -213.8], [-466.4, -208.3], [-454.3, -194.8], [-448.2, -204.5], [-426.2, -190.8], [-429.7, -185.3], [-417.6, -171.8], [-411.5, -181.5], [-389.5, -167.7], [-393.0, -162.3], [-380.9, -148.8], [-377.7, -153.9], [-376.5, -153.1], [-380.0, -147.5], [-368.0, -133.9], [-358.2, -148.5], [-329.9, -130.4], [-323.4, -131.0], [-288.6, -129.2]],
    'way/268641362': [[-281.3, -73.4], [-282.1, -59.6], [-102.8, -49.6], [-102.8, -50.5], [-93.6, -50.0], [-93.4, -52.9], [-54.6, -50.8], [-54.2, -58.3], [-93.0, -60.4], [-92.5, -69.3], [-98.6, -69.6], [-99.0, -61.4], [-102.0, -61.6], [-101.9, -63.4], [-176.0, -68.1]],
    'way/749201920': [[-228.7, -71.0], [-176.0, -68.1], [-173.0, -121.5], [-225.7, -124.4], [-226.3, -114.0], [-283.4, -117.2], [-284.0, -107.6], [-226.8, -104.4]],
}
const ring = (id: string) => RINGS['way/' + id]

function build(detail: boolean) {
  const M: Mats = amsMats()
  const big: XY[] = [[-700, -700], [700, -700], [700, 700], [-700, 700]]
  const FP = detail ? F_PIER : F_PIER_LOW
  const zones: Zone[] = [
    { ring: ring('268641332'), z: 13, facade: FP },
    { ring: ring('268641334'), z: 14, facade: FP },
    { ring: ring('268641335'), z: 11, facade: FP },
    { ring: ring('268641337'), z: 11.4, facade: FP, roof: 'wall' },
    { ring: ring('268641362'), z: 10, facade: FP },
    { ring: ring('749201920'), z: 10, facade: FP },
    // F's raised dark block on the hub of its Y head
    { ring: [[0.5, 86], [27, 86], [27, 116], [0.5, 116]], z: 18, facade: F_DARK, wall: 'dark', roof: 'dark' },
  ]
  zoneMass(M, big, zones, { lip: 0.5 })

  const Z0 = 4.2, Z1 = 7.2
  const E = ring('268641332'), F = ring('268641334'), G = ring('268641335')
  // E: both sides, three runs each
  for (const [a, b] of [[[250.0, -129.6], [329.2, -10.0]], [[323.3, 3.6], [415.1, 142.9]], [[424.9, 143.0], [489.8, 241.5]], [[520.6, 221.4], [442.2, 102.3]], [[446.1, 93.3], [358.8, -39.2]], [[344.1, -39.4], [262, -164]]] as [XY, XY][])
    gateRow(M, E, a, b, 40, 18, Z0, Z1, detail, 14)
  // F: both sides of the stem, long links; three at each tip of the Y head
  gateRow(M, F, [5.8, -63.6], [0.8, 24.5], 30, 24, Z0, Z1, detail, 14)
  gateRow(M, F, [29.6, 41.8], [36.1, -75.5], 30, 24, Z0, Z1, detail, 14)
  const tip = (a: XY, b: XY) => {
    const m: XY = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], d = Math.hypot(b[0] - a[0], b[1] - a[1]), out: XY = [(b[1] - a[1]) / d, (a[0] - b[0]) / d]
    jetBridge(M, m, out, 18, Z0, Z1, detail)
  }
  tip([-49.7, 123.7], [-30.2, 145.3]); tip([47.6, 149.7], [69.4, 129.6])
  tip([-24.4, 101.2], [-49.7, 123.7]); tip([69.4, 129.6], [46.9, 105.2])
  // G: both long sides
  gateRow(M, G, [-335.0, 55.4], [-343.6, 205.4], 40, 18, Z0, Z1, detail, 12)
  gateRow(M, G, [-304.7, 207.4], [-290.9, -61.2], 40, 18, Z0, Z1, detail, 30)
  if (detail) {
    for (const r of [E, F, G]) for (let i = 0; i < r.length; i++) {
      const a = r[i], b = r[(i + 1) % r.length]
      if (Math.hypot(b[0] - a[0], b[1] - a[1]) > 40) mullions(M.steel, a, b, 4.4, 8.4, 3)
    }
    // rooftop plant on E and G
    for (const [x, y] of [[300, -60], [380, 60], [470, 200], [-318, 0], [-322, 120]] as XY[]) prismRing(M.wall, [[x - 5, y - 4], [x + 5, y - 4], [x + 5, y + 4], [x - 5, y + 4]], 10.9, 13.6, M.roof)
  }
  return amsParts(M, finish('ams-pier-roof', 0xa3aaaf))
}

if (import.meta.main) {
  const extras = { bearing: 0, osm: 'way/268641334', height: 18 }
  writeLod('Amsterdam Airport Schiphol piers E, F, G and H', 'amsterdam-schiphol-piers-e-h.glb', build(false), extras, 8000, 250_000)
  writeLod('Amsterdam Airport Schiphol piers E, F, G and H', 'amsterdam-schiphol-piers-e-h.detail.glb', build(true), extras, 40_000, 1_500_000)
}
