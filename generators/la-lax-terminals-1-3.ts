/**
 * Los Angeles International Airport (LAX): Terminals 1, 2 and 3 on the north
 * side of the horseshoe — Terminal 1 (Southwest, rebuilt 2018), Terminal
 * 1.5 (the 2021 connector), Terminal 2 and Terminal 3 (Delta, rebuilt to
 * 2023 with its new ticketing hall), with the T3-TBIT connector —
 * procedural, CC0-1.0, no textures.
 *
 *   bun generators/la-lax-terminals-1-3.ts
 *
 * Writes models/la-lax-terminals-1-3.glb (low) and .detail.glb (mullion
 * groups, fascias, every jet-bridge leg with rotunda and cab). Built with
 * the LAX kit in la-lax-tom-bradley-terminal.ts.
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 353 (the
 * airport grid). Anchor -118.4042, 33.9459: the centre of the lidar grid,
 * 4 m from the area centroid of the five outlines.
 *
 * y = 0 is the lowest ground under the footprint, the lower road of the
 * Central Terminal Area along the landside fronts (28.8 m NAVD88, lidar
 * ground_min); the apron the piers stand on is 8.6 m higher, so the pier
 * walls run down to y = 0 and sink into it.
 *
 * Identity (photos and aerials): three long, flat-roofed, pale piers
 * reaching north from a continuous landside frontage along the upper
 * road; Terminal 3's new pier and head stand a storey taller than the
 * others; Terminal 1's long pier with its west-side gates; the glazed
 * gate rooms and jet bridges along every pier.
 *
 * Evidence
 * - OSM: way/413226242 (Terminal 1), way/857253634 (Terminal 1.5),
 *   way/413226245 (Terminal 2; its height tag 7.5 is wrong: lidar 13-27),
 *   way/983655042 (Terminal 3; height 11.7 is wrong: lidar 21-29),
 *   way/1279233925 (the T3-TBIT connector); aeroway=jet_bridge ways
 *   (drawn, not replaced).
 * - Lidar: USGS 3DEP CA_LosAngeles_1_B23 (2023 work unit: T1's 2018 and
 *   T1.5's 2021 rebuilds are in it, and Terminal 3's new pier and
 *   ticketing hall stand to their full height), 1 m grid. Each outline's
 *   roof levels are the peaks of its height histogram, and the raised
 *   blocks the rectangles (3 m cells, 80 m² and up) standing at the higher
 *   levels: T1 18.5 with a 21.5 spine; T1.5 21.5 and 27.5; T2 13.5,
 *   18.5, 23.5 and 27; T3 21.5 and 27.5; the connector 22.5.
 * - Photos (Wikimedia Commons, EVIDENCE):
 *   Delta_Sky_Club_Sky_Deck_View_Los_Angeles_Delta_Air_Lines_Boeing_737-900ER_N907DN.jpg,
 *     David Aughinbaugh II, CC BY-SA 4.0 (Terminal 3's new pier: pale
 *     grey panel, dark window bands, the gate rooms and jet bridges);
 *   LAX_Commercial_Terminal_buildings_photo_Don_Ramey_Logan.jpg, Don
 *     Ramey Logan, CC BY-SA 4.0 (the terminals' low pale line from the
 *     airfield, the tower and Theme Building behind);
 *   LAX_Terminal_1,_Southwest_737-800_fleet_(5315024425).jpg, Moto
 *     "Club4AG" Miwa, CC BY 2.0 (Terminal 1 from the north at night: the
 *     long lit pier);
 *   Tom_Bradley_International_Terminal_taken_from_departing_flight_March_2016.jpg,
 *     Agarre16, CC BY-SA 4.0 (the north terminals far off, from the
 *     south-west).
 *   USGS NAIP for the plan and the roof colours (pale grey and white).
 * - Colours: walls cool pale grey panel (Sky Deck photo), roofs pale grey
 *   (NAIP), glass light grey-
 *   blue, jet bridges silver.
 *
 * Estimated: window band heights; jet-bridge floor 12.8 m (apron + 4.2).
 * Doubts: few licensed exterior photos of these terminals exist; T1's and
 *   T2's facades and Terminal 3's new glazed ticketing hall are drawn as
 *   plain glazed bands from the aerials, not from close photos. The
 *   people-mover station and the elevated roads are left out, as asked.
 */
import { finish } from './palette'
import { newParts, materials, terraces, jetBridges, orient, writeModel, len2, type Block, type XY } from './la-lax-tom-bradley-terminal'

export const ANCHOR = { lng: -118.4042, lat: 33.9459 }
export const BEARING = 353
const APRON = 8.6, Z_JB = 12.8

export const OSM: Record<string, XY[]> = {
  'way/413226242': [[208.6, -67.7], [208.4, -49.1], [208.3, -32.3], [234.5, -32.3], [234.4, -27.5], [244.9, -27.5], [263.7, -9.1], [268.8, -9.1], [268.7, 0.2], [268.3, 44.0], [267.9, 66.6], [260.1, 66.7], [260.1, 71.2], [260.1, 92.9], [260.1, 131.3], [260.1, 152.1], [264.0, 152.1], [279.3, 152.1], [283.0, 152.1], [283.0, 156.9], [291.4, 156.9], [291.3, 152.8], [290.3, 152.8], [290.3, 152.1], [291.3, 152.0], [295.2, 152.0], [311.9, 152.1], [314.1, 152.1], [314.2, 129.5], [314.3, 92.4], [314.3, 66.2], [306.0, 66.3], [306.2, 43.4], [306.4, 15.8], [306.5, -0.7], [334.3, -0.9], [358.0, -24.4], [369.0, -24.7], [376.4, -32.3], [376.4, -37.5], [379.1, -37.5], [379.0, -57.2], [388.7, -57.2], [391.3, -55.8], [393.1, -53.3], [394.0, -45.7], [394.5, -43.4], [395.6, -42.4], [396.7, -42.3], [397.4, -42.3], [398.9, -42.8], [399.5, -44.8], [398.7, -54.1], [397.3, -57.7], [395.2, -60.2], [392.2, -62.0], [388.7, -63.1], [382.9, -63.4], [377.1, -63.5], [376.9, -68.0], [329.9, -67.6], [327.8, -67.6], [325.2, -67.6], [295.5, -67.7], [292.6, -67.7], [264.6, -67.7]], // Terminal 1
  'way/857253634': [[87.7, -67.6], [96.4, -67.6], [98.1, -67.6], [149.2, -67.6], [208.6, -67.7], [208.4, -49.1], [208.3, -32.3], [203.4, -32.4], [178.6, -13.7], [176.4, -15.3], [151.0, -34.2], [90.8, -34.5], [90.8, -44.2], [90.8, -51.8], [87.6, -51.8]], // Terminal 1.5
  'way/413226245': [[-79.5, -69.4], [-79.5, -68.6], [-80.7, -30.3], [-34.5, -30.2], [-19.2, -15.1], [-8.8, -15.4], [-7.9, 3.2], [-7.8, 10.3], [-7.5, 26.6], [-11.7, 26.6], [-11.7, 30.3], [-9.1, 30.3], [-9.1, 29.7], [-7.7, 29.7], [-7.7, 47.6], [-7.6, 74.2], [-11.7, 74.2], [-11.7, 77.7], [-9.1, 77.7], [-9.1, 77.2], [-7.6, 77.2], [-7.6, 89.2], [-7.6, 106.4], [-9.1, 106.4], [-9.1, 102.2], [-11.7, 102.2], [-11.7, 109.5], [-7.6, 109.5], [-7.6, 113.2], [-6.7, 113.2], [4.4, 113.2], [16.6, 113.1], [33.6, 113.1], [42.6, 113.1], [44.5, 113.1], [44.5, 109.7], [48.3, 109.6], [48.3, 106.3], [44.5, 106.3], [44.5, 103.9], [44.5, 89.8], [44.5, 77.5], [48.4, 77.5], [48.4, 73.9], [44.5, 73.9], [44.5, 56.4], [44.5, 44.5], [48.2, 44.5], [48.2, 41.2], [44.2, 41.2], [44.3, 15.1], [48.3, 15.1], [48.3, 11.7], [44.1, 11.7], [44.2, 0.6], [48.0, 0.6], [48.0, -3.2], [44.4, -3.2], [44.4, -5.5], [44.5, -17.1], [47.2, -17.1], [47.2, -19.8], [50.4, -19.8], [50.5, -22.7], [53.1, -22.7], [53.2, -29.7], [53.2, -32.3], [50.3, -32.3], [50.3, -42.8], [87.3, -42.8], [87.3, -44.2], [90.8, -44.2], [90.8, -51.8], [87.6, -51.8], [87.7, -67.6], [68.8, -67.8], [58.1, -67.9], [32.7, -68.3], [31.8, -68.3], [29.6, -68.3], [-8.6, -68.7], [-12.3, -68.7], [-56.7, -69.2], [-60.1, -69.2]], // Terminal 2
  'way/983655042': [[-233.9, 123.1], [-234.0, 119.7], [-234.1, 93.5], [-234.2, 78.7], [-252.0, 78.6], [-251.7, 65.7], [-251.8, 8.7], [-251.8, 5.6], [-247.8, 1.5], [-226.0, -19.7], [-218.3, -19.7], [-210.0, -27.9], [-80.7, -27.6], [-80.7, -30.3], [-79.5, -68.6], [-83.0, -68.5], [-87.4, -68.5], [-92.1, -68.5], [-102.8, -68.5], [-119.0, -68.5], [-206.9, -68.5], [-217.1, -68.5], [-224.1, -68.6], [-238.4, -68.6], [-248.5, -68.7], [-306.1, -69.4], [-305.6, -60.3], [-305.5, -53.3], [-305.4, -41.3], [-305.5, 7.6], [-305.5, 30.5], [-304.9, 80.1], [-321.1, 80.2], [-332.8, 80.2], [-332.8, 92.8], [-332.5, 119.5], [-332.4, 122.9], [-318.6, 122.9], [-298.2, 123.1], [-269.8, 123.0], [-248.1, 122.9]], // Terminal 3
  'way/1279233925': [[-453.3, -118.0], [-429.6, -117.8], [-385.9, -70.7], [-315.0, -52.3], [-315.1, -60.2], [-305.6, -60.3], [-305.5, -53.3], [-305.4, -41.3], [-379.7, -58.9], [-380.6, -55.3], [-393.0, -58.2], [-391.7, -63.3], [-433.3, -108.4], [-435.7, -108.4], [-435.8, -102.6], [-446.9, -102.7], [-446.9, -102.8], [-446.8, -108.6], [-453.4, -108.7]], // T3-TBIT Connector
}
export const BLOCKS: Record<string, { base: number; blocks: Block[] }> = {"way/413226242": {"base": 18.5, "blocks": [{"z0": 18.5, "z1": 21.5, "r": [208.3, -68.0, 376.3, -59.0]}, {"z0": 18.5, "z1": 21.5, "r": [208.3, -59.0, 235.3, -56.0]}, {"z0": 18.5, "z1": 21.5, "r": [349.3, -59.0, 376.3, -56.0]}, {"z0": 18.5, "z1": 21.5, "r": [208.3, -53.0, 223.3, -32.0]}, {"z0": 18.5, "z1": 21.5, "r": [361.3, -53.0, 376.3, -35.0]}, {"z0": 18.5, "z1": 21.5, "r": [274.3, 34.0, 289.3, 43.0]}, {"z0": 18.5, "z1": 21.5, "r": [289.3, 61.0, 298.3, 76.0]}]}, "way/857253634": {"base": 21.5, "blocks": [{"z0": 21.5, "z1": 27.5, "r": [87.5, -67.7, 207.6, -52.7]}, {"z0": 21.5, "z1": 27.5, "r": [90.5, -52.7, 207.6, -34.7]}, {"z0": 21.5, "z1": 27.5, "r": [153.6, -34.7, 207.6, -31.7]}]}, "way/413226245": {"base": 13.5, "blocks": [{"z0": 13.5, "z1": 18.5, "r": [-80.7, -69.4, -77.7, -33.4]}, {"z0": 13.5, "z1": 18.5, "r": [-14.7, -69.4, 24.3, -66.4]}, {"z0": 13.5, "z1": 18.5, "r": [-11.7, -66.4, 27.3, -63.4]}, {"z0": 13.5, "z1": 18.5, "r": [0.3, -63.4, 30.3, -60.4]}, {"z0": 13.5, "z1": 18.5, "r": [3.3, -60.4, 33.3, 113.6]}, {"z0": 13.5, "z1": 18.5, "r": [-77.7, -54.4, 3.3, -33.4]}, {"z0": 13.5, "z1": 18.5, "r": [33.3, -54.4, 87.3, -42.4]}, {"z0": 13.5, "z1": 18.5, "r": [33.3, -42.4, 51.3, -21.4]}, {"z0": 13.5, "z1": 18.5, "r": [-32.7, -33.4, 3.3, -30.4]}, {"z0": 13.5, "z1": 18.5, "r": [-29.7, -30.4, 3.3, -27.4]}, {"z0": 13.5, "z1": 18.5, "r": [-26.7, -27.4, 3.3, -24.4]}, {"z0": 13.5, "z1": 18.5, "r": [-23.7, -24.4, 3.3, -21.4]}, {"z0": 13.5, "z1": 18.5, "r": [33.3, -18.4, 45.3, 113.6]}, {"z0": 13.5, "z1": 18.5, "r": [-5.7, -15.4, 3.3, 113.6]}, {"z0": 18.5, "z1": 23.5, "r": [-80.7, -69.4, -77.7, -33.4]}, {"z0": 18.5, "z1": 23.5, "r": [15.3, -69.4, 21.3, 89.6]}, {"z0": 18.5, "z1": 23.5, "r": [12.3, -66.4, 15.3, 89.6]}, {"z0": 18.5, "z1": 23.5, "r": [21.3, -66.4, 27.3, 86.6]}, {"z0": 18.5, "z1": 23.5, "r": [9.3, -63.4, 12.3, 86.6]}, {"z0": 18.5, "z1": 23.5, "r": [27.3, -63.4, 30.3, 62.6]}, {"z0": 18.5, "z1": 23.5, "r": [6.3, -60.4, 9.3, 83.6]}, {"z0": 18.5, "z1": 23.5, "r": [3.3, -57.4, 6.3, 80.6]}, {"z0": 18.5, "z1": 23.5, "r": [30.3, -57.4, 33.3, 59.6]}, {"z0": 18.5, "z1": 23.5, "r": [0.3, -54.4, 3.3, 80.6]}, {"z0": 18.5, "z1": 23.5, "r": [33.3, -54.4, 36.3, 59.6]}, {"z0": 18.5, "z1": 23.5, "r": [-2.7, -51.4, 0.3, 80.6]}, {"z0": 18.5, "z1": 23.5, "r": [36.3, -51.4, 39.3, 59.6]}, {"z0": 18.5, "z1": 23.5, "r": [-5.7, -48.4, -2.7, 80.6]}, {"z0": 18.5, "z1": 23.5, "r": [39.3, -48.4, 42.3, 56.6]}, {"z0": 18.5, "z1": 23.5, "r": [-77.7, -42.4, -8.7, -33.4]}, {"z0": 23.5, "z1": 27.0, "r": [15.3, -69.4, 21.3, -45.4]}, {"z0": 23.5, "z1": 27.0, "r": [21.3, -66.4, 27.3, -45.4]}]}, "way/983655042": {"base": 21.5, "blocks": [{"z0": 21.5, "z1": 27.5, "r": [-302.8, -69.5, -80.8, -33.5]}, {"z0": 21.5, "z1": 27.5, "r": [-302.8, -33.5, -200.8, -30.5]}, {"z0": 21.5, "z1": 27.5, "r": [-155.8, -33.5, -80.8, -30.5]}, {"z0": 21.5, "z1": 27.5, "r": [-302.8, -30.5, -209.8, -27.5]}, {"z0": 21.5, "z1": 27.5, "r": [-302.8, -27.5, -212.8, -24.5]}, {"z0": 21.5, "z1": 27.5, "r": [-302.8, -24.5, -224.8, -21.5]}, {"z0": 21.5, "z1": 27.5, "r": [-302.8, -21.5, -227.8, -18.5]}, {"z0": 21.5, "z1": 27.5, "r": [-302.8, -18.5, -230.8, -15.5]}, {"z0": 21.5, "z1": 27.5, "r": [-302.8, -15.5, -233.8, -12.5]}, {"z0": 21.5, "z1": 27.5, "r": [-302.8, -12.5, -236.8, -9.5]}, {"z0": 21.5, "z1": 27.5, "r": [-302.8, -9.5, -239.8, -6.5]}, {"z0": 21.5, "z1": 27.5, "r": [-302.8, -6.5, -242.8, -3.5]}, {"z0": 21.5, "z1": 27.5, "r": [-302.8, -3.5, -245.8, -0.5]}, {"z0": 21.5, "z1": 27.5, "r": [-302.8, -0.5, -248.8, 5.5]}, {"z0": 21.5, "z1": 27.5, "r": [-302.8, 5.5, -251.8, 56.5]}, {"z0": 21.5, "z1": 27.5, "r": [-302.8, 56.5, -254.8, 62.5]}, {"z0": 21.5, "z1": 27.5, "r": [-302.8, 62.5, -272.8, 65.5]}, {"z0": 21.5, "z1": 27.5, "r": [-305.8, 65.5, -275.8, 68.5]}, {"z0": 21.5, "z1": 27.5, "r": [-305.8, 68.5, -278.8, 71.5]}]}, "way/1279233925": {"base": 22.5, "blocks": []}}
export const JET_BRIDGES: XY[][] = []

export function build(detail: boolean) {
  const P = newParts()
  const rings: XY[][] = []
  for (const [id, ring] of Object.entries(OSM)) {
    const b = BLOCKS[id] ?? { base: 18, blocks: [] }
    // the landside fronts (long edges facing south, toward the road) glaze to the roof
    const tall = (a: XY, c: XY) => len2(a, c) > 25 && c[0] < a[0] && Math.abs(c[1] - a[1]) < 0.3 * len2(a, c) && a[1] < -20
    rings.push(terraces(P, ring, b.base, b.blocks, { detail, glazeFrom: APRON, tall }))
  }
  jetBridges(P.metal, orient(JET_BRIDGES, rings), Z_JB, detail)
  // the piers' walls: cool pale grey panel (Terminal 3's new pier, Sky Deck photo)
  return materials(P, { wall: finish('lax-t13-panel', 0xd2d5d7) })
}

if (import.meta.main) {
  const o = { bearing: BEARING, height: 27.5 }
  await writeModel('la-lax-terminals-1-3.glb', 'LAX Terminals 1-3', build(false), { ...o, maxTris: 8000, maxBytes: 250_000 })
  await writeModel('la-lax-terminals-1-3.detail.glb', 'LAX Terminals 1-3', build(true), { ...o, maxTris: 40_000, maxBytes: 1536 * 1024 })
}
