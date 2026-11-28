/**
 * Amsterdam Airport Schiphol, piers B, C and D with the buildings at their
 * roots — procedural, CC0-1.0, no textures.
 * bun generators/amsterdam-schiphol-piers-b-c-d.ts
 *
 * Writes models/amsterdam-schiphol-piers-b-c-d.glb (low) and
 * models/amsterdam-schiphol-piers-b-c-d.detail.glb (detail: the same, with
 * glazed jet-bridge links, stair towers and mullions). Uses the Schiphol kit
 * in amsterdam-schiphol-terminal.ts.
 *
 * Map frame: x = east, y = north, z up, metres; bearing 0. Anchor: the
 * area-weighted centroid of the B, C and D pier outlines and Terminal 1A,
 * 4.767736, 52.307487 (it falls on the apron between C and D).
 *
 * What it is (OSM, all replaced):
 * - B-pier way/268641325 (height 9, 2 levels): a straight 260 m bar to the
 *   south-west; the Temporary BC-link way/923134614 (layer 1, no height)
 *   from its root to the C-pier's root.
 * - Terminal 1A way/268641346 and way/1468985448 (height 9): the low root
 *   building of B and C along the south of the old terminal.
 * - C-pier way/268641326 (height 9) running south-east to a Y-shaped head,
 *   whose upper level way/516883757 is 9–13 m.
 * - D-pier way/268641330 (height 13): a 200 m stem east from the terminal,
 *   splitting into a north and a south finger that run on east; its parts
 *   way/516883761 (0–9 m, the whole pier) and way/516883762 (9–13 m: the
 *   upper, non-Schengen level over the stem and the north finger, with the
 *   gate stair towers OSM draws as stubs); the small apron-control post on
 *   the stem way/516883758–760 (13–20, 20–25 and 25–26 m).
 * - The C/D root way/268641409 (height 13) with way/268641405 (13) and its
 *   raised roof way/521074364 (13–16).
 * Left out: the AB-link way/923134613 and the A-pier way/688456458 (OSM
 * maps the A-pier as aeroway=construction; the link only serves it), the
 * baggage building BRR way/268641408, the old 1967 terminal way/268641352.
 *
 * Identifying features (photos): long, low, flat-roofed piers, two levels
 * of broad glass bands between light grey panels; on D the upper glazed
 * level over the lower; concrete stair towers at the gates; white jet-bridge
 * links on posts, one or two a gate; the little apron-control cab on the D
 * stem; grey roofs.
 *
 * Evidence
 * - OSM as above; roof:colour grey on D.
 * - Photos (Wikimedia Commons / Flickr; author, licence):
 *   https://commons.wikimedia.org/wiki/File:Schiphol_Airport_Pier_D_(7325964516).jpg
 *     and .../File:Schiphol_Airport_Pier_D_(7325966610).jpg (-JvL-, CC BY 2.0)
 *     D's stem from the observation deck: the two glazed levels, the stair
 *     towers, the white links, the apron-control cab;
 *   https://commons.wikimedia.org/wiki/File:AMS_pirs_D.jpg (Andrzej Otrębski,
 *     CC BY-SA 4.0) D's fingers from the apron;
 *   https://commons.wikimedia.org/wiki/File:Overview_D-gates_(2391143559).jpg
 *     (Pieter van Marion, CC BY-SA 2.0) D's gates;
 *   https://commons.wikimedia.org/wiki/File:Amsterdam_Airport_Schiphol_apron_overview_(4532485694).jpg
 *     (Maarten Visser, CC BY-SA 2.0) the B/C apron;
 *   https://commons.wikimedia.org/wiki/File:SCHIPHOL_CONTROL_TOWER_,_PIER_D_-_panoramio.jpg
 *     (Kayhan ERTUGRUL, CC BY-SA 3.0) a pier's long glass front from the apron;
 *   https://commons.wikimedia.org/wiki/File:Schiphol_Tower.jpg (Ikreis, CC BY-SA
 *     4.0) the B pier's root and links from high up;
 *   https://commons.wikimedia.org/wiki/File:Ams-above-2007.jpg (Fyodor
 *     Borisov, CC BY-SA 3.0) B, C and D from the south-east.
 * - Terrain: Mapterhorn z14 flat to ±0.5 m.
 * - No lidar.
 *
 * Numbers: heights from OSM (9, 13, 16, 20–26); Terminal 1A has no height in
 * OSM and is drawn at 9 m like 1468985448 beside it (estimated); the
 * BC-link at 7 m (estimated). Glass bands: two a level, 6 m bays (estimated
 * from -JvL-'s photos). Jet bridges: one at the tip of every stair-tower
 * stub OSM draws on D, 18 m long; on B and C, where OSM draws no stubs, one
 * every 42 m along both long sides and two at each head tip (estimated from
 * the aerials); link floor 4.2 m, roof 7.2 m, a cab and a post at the end.
 * The hall in D's fork (between the fingers, x 148–200) is drawn 13 m high
 * with a white roof, as the 2007 aerial shows it; OSM gives the whole fork
 * 9 m (estimated).
 * Doubts: the B and C gate positions are spaced evenly rather than mapped;
 * the BC-link's height; the roofs' plant is not drawn; the jet bridges'
 * movable ends are drawn straight, as if retracted.
 */
import { type XY, type Mats, type Zone, AMS, amsMats, amsParts, zoneMass, writeLod, gateRow, stubBridges, jetBridge, F_PIER, F_PIER_LOW, F_CLERE, mullions } from './amsterdam-schiphol-terminal'
import { finish } from './palette'

const RINGS: Record<string, XY[]> = {
    'way/268641325': [[-423.1, -239.9], [-418.5, -247.2], [-410.3, -262.1], [-333.9, -381.2], [-268.6, -484.6], [-293.1, -499.6], [-407.8, -317.7], [-414.4, -306.6], [-447.3, -255.0]],
    'way/923134614': [[-418.5, -247.2], [-184.8, -107.5], [-176.4, -121.8], [-410.3, -262.1]],
    'way/268641346': [[-373.4, -139.4], [-366.6, -149.9], [-404.2, -174.0], [-430.6, -131.9], [-300.9, -52.5], [-284.9, -78.0], [-247.6, -54.8], [-245.6, -57.6], [-241.2, -54.7], [-241.6, -54.0], [-219.8, -40.0], [-220.5, -51.6], [-217.2, -56.8], [-329.0, -126.5], [-336.1, -115.5]],
    'way/1468985448': [[-399.3, -184.5], [-405.7, -174.9], [-366.6, -149.9], [-373.4, -139.4], [-336.1, -115.5], [-329.0, -126.5], [-217.2, -56.8], [-205.3, -75.7], [-237.7, -83.7]],
    'way/268641326': [[-206.9, -32.8], [-207.2, -38.5], [-102.8, -204.1], [-50.0, -241.7], [-22.9, -247.7], [-26.2, -265.0], [-59.9, -258.2], [-70.3, -272.8], [-88.3, -275.8], [-95.9, -308.2], [-113.8, -304.2], [-107.7, -278.0], [-118.6, -213.6], [-176.4, -121.8], [-184.8, -107.5], [-220.5, -51.6], [-219.4, -32.0]],
    'way/516883757': [[-101.6, -232.5], [-92.7, -226.9], [-70.5, -242.7], [-80.2, -256.7], [-97.5, -259.1]],
    'way/268641330': [[-134.6, 153.1], [-116.5, 152.1], [-113.7, 159.9], [-107.2, 158.0], [-107.7, 151.6], [-68.0, 149.4], [-66.4, 153.8], [-64.6, 157.1], [-58.4, 155.4], [-58.8, 148.9], [-18.3, 146.6], [-15.1, 154.3], [-9.0, 152.7], [-9.4, 146.1], [39.2, 143.3], [42.6, 150.8], [48.2, 149.2], [47.8, 142.8], [73.4, 141.3], [86.8, 158.2], [83.1, 164.1], [87.7, 168.0], [92.0, 164.8], [117.6, 197.0], [113.6, 202.8], [118.4, 207.0], [122.7, 203.5], [151.0, 239.3], [146.8, 245.0], [153.1, 250.3], [166.2, 240.4], [168.7, 243.6], [426.0, 229.1], [424.2, 197.4], [169.3, 211.8], [149.7, 186.9], [160.8, 177.5], [161.4, 189.1], [200.5, 186.8], [191.7, 34.3], [152.7, 36.7], [153.5, 49.1], [140.7, 41.3], [153.5, 20.7], [407.0, 6.3], [405.7, -17.5], [147.3, -2.9], [135.6, -10.1], [125.7, 5.7], [119.3, 4.2], [117.2, 10.2], [121.4, 12.7], [104.1, 40.5], [97.4, 39.0], [95.2, 45.0], [99.6, 47.8], [82.4, 75.5], [75.7, 73.9], [73.5, 80.1], [77.9, 82.8], [70.8, 94.1], [28.6, 96.5], [26.9, 89.9], [19.9, 91.7], [20.2, 97.0], [-20.8, 99.3], [-22.7, 93.3], [-29.6, 95.1], [-29.4, 99.8], [-70.4, 102.1], [-72.4, 95.9], [-78.6, 97.6], [-78.3, 102.6], [-116.1, 104.7], [-118.5, 98.9], [-124.7, 100.7], [-124.4, 105.2], [-136.7, 106.0], [-133.8, 136.0]],
    'way/516883761': [[-136.7, 106.1], [-124.4, 105.2], [-124.7, 100.7], [-118.5, 98.9], [-116.1, 104.7], [-78.3, 102.6], [-78.6, 97.6], [-72.4, 95.9], [-70.4, 102.1], [-29.4, 99.8], [-29.6, 95.1], [-22.7, 93.3], [-20.8, 99.3], [20.2, 97.0], [19.9, 91.7], [26.9, 89.9], [28.6, 96.5], [70.8, 94.1], [77.9, 82.8], [73.5, 80.1], [75.7, 73.9], [82.4, 75.5], [99.6, 47.8], [95.2, 45.0], [97.4, 39.0], [104.1, 40.5], [121.4, 12.7], [117.2, 10.2], [119.3, 4.2], [125.7, 5.7], [135.6, -10.1], [147.3, -2.9], [405.7, -17.5], [407.0, 6.3], [153.5, 20.7], [140.7, 41.3], [153.5, 49.1], [160.8, 177.5], [149.7, 186.9], [169.3, 211.8], [424.2, 197.4], [426.0, 229.1], [168.7, 243.6], [166.2, 240.4], [153.1, 250.3], [146.8, 245.0], [151.0, 239.3], [122.7, 203.5], [118.4, 207.0], [113.6, 202.8], [117.6, 197.0], [92.0, 164.8], [87.7, 168.0], [83.1, 164.1], [86.8, 158.2], [73.4, 141.3], [47.8, 142.8], [48.2, 149.2], [42.6, 150.8], [39.2, 143.3], [-9.4, 146.1], [-9.0, 152.7], [-15.1, 154.3], [-18.3, 146.6], [-58.8, 148.9], [-58.4, 155.4], [-64.6, 157.1], [-68.0, 149.4], [-107.7, 151.6], [-107.2, 158.0], [-113.7, 159.9], [-116.5, 152.1], [-134.6, 153.1], [-133.5, 138.7]],
    'way/516883762': [[396.9, 224.3], [399.8, 222.9], [402.1, 220.6], [403.6, 217.7], [404.0, 214.5], [403.0, 210.6], [400.5, 207.4], [397.0, 205.5], [386.3, 205.4], [386.1, 203.4], [177.6, 215.7], [177.8, 217.5], [169.6, 218.0], [141.0, 181.4], [133.5, 181.6], [122.0, 166.7], [132.3, 159.0], [127.0, 71.8], [116.7, 66.7], [148.7, 15.6], [139.6, 9.4], [137.6, 12.6], [130.6, 8.1], [125.7, 5.7], [119.3, 4.2], [117.2, 10.2], [133.0, 20.0], [116.2, 47.0], [108.8, 42.3], [97.4, 39.0], [95.2, 45.0], [111.2, 55.1], [94.4, 82.0], [89.9, 78.7], [82.4, 75.5], [75.7, 73.9], [73.5, 80.1], [89.4, 90.1], [82.5, 101.2], [74.3, 101.4], [75.1, 114.0], [66.4, 114.2], [66.3, 111.8], [30.2, 113.9], [30.6, 109.6], [29.5, 100.0], [26.9, 89.9], [19.9, 91.7], [21.0, 114.4], [-19.8, 116.8], [-19.4, 105.2], [-22.7, 93.3], [-29.6, 95.1], [-28.4, 117.2], [-69.0, 119.6], [-68.9, 107.6], [-72.4, 95.9], [-78.6, 97.6], [-77.0, 120.0], [-115.3, 122.2], [-114.6, 116.4], [-114.9, 110.7], [-118.5, 98.9], [-124.7, 100.7], [-123.4, 122.7], [-128.6, 123.0], [-128.4, 125.4], [-134.8, 125.3], [-133.8, 136.0], [-127.9, 135.9], [-127.8, 138.2], [-116.9, 137.6], [-117.3, 148.1], [-115.0, 157.0], [-113.7, 159.9], [-107.2, 158.0], [-108.9, 137.1], [-68.1, 134.9], [-68.4, 147.0], [-66.4, 153.8], [-64.6, 157.1], [-58.4, 155.4], [-59.7, 134.4], [-18.3, 132.2], [-18.8, 142.5], [-18.3, 146.6], [-15.1, 154.3], [-9.0, 152.7], [-10.0, 131.7], [38.9, 129.0], [38.7, 139.5], [39.2, 143.3], [42.6, 150.8], [48.2, 149.2], [47.1, 128.5], [66.9, 127.4], [66.8, 125.3], [75.8, 125.0], [76.6, 136.8], [84.7, 136.5], [96.1, 150.8], [89.0, 155.4], [83.1, 164.1], [87.7, 168.0], [101.6, 157.7], [127.3, 189.9], [123.4, 191.7], [117.6, 197.0], [113.6, 202.8], [118.4, 207.0], [132.2, 196.1], [160.6, 231.9], [157.0, 234.0], [151.0, 239.3], [146.8, 245.0], [153.1, 250.3], [166.2, 240.4], [169.5, 237.1], [178.9, 236.8], [179.1, 239.0], [229.5, 236.3], [229.8, 240.1], [277.4, 237.4], [277.2, 233.4], [314.1, 231.5], [314.2, 235.3], [362.5, 232.6], [362.2, 228.8], [387.4, 227.3], [387.4, 224.8]],
    'way/268641409': [[-189.7, 22.4], [-192.6, -30.2], [-162.5, -32.0], [-167.2, -55.1], [-188.3, -68.4], [-207.2, -38.5], [-201.2, 66.1], [-196.7, 65.9], [-196.8, 63.6], [-174.7, 62.1], [-173.9, 78.2], [-176.2, 78.4], [-174.4, 106.3], [-142.1, 105.2], [-137.0, 104.5], [-152.1, 20.3]],
    'way/268641405': [[-151.7, 20.3], [-153.3, 3.8], [-154.4, -27.9], [-155.3, -32.3], [-192.6, -30.2], [-189.7, 22.4]],
    'way/516883758': [[83.8, 122.6], [88.2, 122.4], [88.0, 118.0], [83.6, 118.2]],
    'way/516883759': [[81.5, 125.0], [90.2, 124.7], [89.9, 115.9], [81.2, 116.2]],
    'way/516883760': [[78.7, 127.9], [93.4, 127.1], [92.6, 112.7], [77.9, 113.6]],
    'way/521074364': [[-171.9, 42.4], [-192.8, 43.5], [-191.7, 63.9], [-170.8, 62.8]],
}
const ring = (id: string) => RINGS['way/' + id]

function build(detail: boolean) {
  const M: Mats = amsMats()
  const big: XY[] = [[-600, -600], [600, -600], [600, 600], [-600, 600]]
  const FP = detail ? F_PIER : F_PIER_LOW
  const zones: Zone[] = [
    { ring: ring('268641325'), z: 9, facade: FP },
    { ring: ring('923134614'), z: 7, facade: FP },
    { ring: ring('268641346'), z: 9, facade: FP },
    { ring: ring('1468985448'), z: 9, facade: FP },
    { ring: ring('268641326'), z: 9, facade: FP },
    { ring: ring('516883757'), z: 13, facade: FP },
    { ring: ring('268641409'), z: 13, facade: FP },
    { ring: ring('268641405'), z: 13, facade: FP },
    { ring: ring('521074364'), z: 16, facade: F_CLERE, roof: 'wall' },
    { ring: ring('268641330'), z: 9, facade: FP },
    { ring: ring('516883761'), z: 9, facade: FP },
    { ring: ring('516883762'), z: 13, facade: FP },
    // the hall in D's fork, between the fingers: white-roofed and standing a level above them (Borisov's aerial)
    { ring: [[148, 40], [191.5, 37.5], [199.8, 185], [157, 187.5]], z: 13, facade: FP, roof: 'wall' },
    { ring: ring('516883758'), z: 20, facade: null, roof: 'wall' },
    { ring: ring('516883759'), z: 25, facade: null, wall: 'win', roof: 'wall' },
    { ring: ring('516883760'), z: 26, facade: null, roof: 'roof' },
  ]
  zoneMass(M, big, zones, { lip: 0.5 })

  const Z0 = 4.2, Z1 = 7.2, LEN = 18
  // B: both long sides
  const B = ring('268641325')
  gateRow(M, B, [-410.3, -262.1], [-268.6, -484.6], 42, LEN, Z0, Z1, detail, 20)
  gateRow(M, B, [-293.1, -499.6], [-414.4, -306.6], 42, LEN, Z0, Z1, detail, 20)
  // C: both sides of the arm, and the head's tips
  const C = ring('268641326')
  gateRow(M, C, [-207.2, -38.5], [-102.8, -204.1], 42, LEN, Z0, Z1, detail, 60)
  gateRow(M, C, [-118.6, -213.6], [-176.4, -121.8], 42, LEN, Z0, Z1, detail, 20)
  const tip = (a: XY, b: XY, out: XY) => { const m: XY = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]; jetBridge(M, m, out, LEN, Z0, Z1, detail) }
  tip([-22.9, -247.7], [-26.2, -265.0], [0.98, -0.2])
  tip([-95.9, -308.2], [-113.8, -304.2], [-0.22, -0.98])
  tip([-70.3, -272.8], [-88.3, -275.8], [0.4, -0.92])
  // D: one at each stair-tower stub, upper part first, then the outline's own stubs
  const taken = stubBridges(M, ring('516883762'), LEN, Z0, Z1, detail)
  stubBridges(M, ring('268641330'), LEN, Z0, Z1, detail, 12, taken)
  if (detail) {
    // mullion lines on the long glazed sides of D's stem and fingers
    for (const r of [ring('516883762')]) for (let i = 0; i < r.length; i++) {
      const a = r[i], b = r[(i + 1) % r.length]
      if (Math.hypot(b[0] - a[0], b[1] - a[1]) > 25) mullions(M.steel, a, b, 9.4, 12.2, 3)
    }
  }
  return amsParts(M, finish('ams-pier-roof', 0xa3aaaf))
}

if (import.meta.main) {
  const extras = { bearing: 0, osm: 'way/268641330', height: 26 }
  writeLod('Amsterdam Airport Schiphol piers B, C and D', 'amsterdam-schiphol-piers-b-c-d.glb', build(false), extras, 8000, 250_000)
  writeLod('Amsterdam Airport Schiphol piers B, C and D', 'amsterdam-schiphol-piers-b-c-d.detail.glb', build(true), extras, 40_000, 1_500_000)
}
