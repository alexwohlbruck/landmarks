/**
 * Dubai International Airport (DXB), Concourse A: procedural, CC0-1.0,
 * no textures.
 *
 *   bun generators/dubai-dxb-concourse-a.ts
 *
 * Writes models/dubai-dxb-concourse-a.glb (low) and
 * models/dubai-dxb-concourse-a.detail.glb (detail: a smoother vault with
 * finer scallops, and the jet bridges OSM maps). Built with the vault kit in
 * dubai-dxb-terminal-3.ts.
 *
 * What is modelled
 * - Concourse A (way/231888210; Emirates' A380 concourse, opened 2013), a
 *   free-standing satellite reached from Terminal 3 by people mover: one
 *   long vault "following the characteristic shape of Concourse B"
 *   (Wikipedia), silver metal with a teal glass fin in every ~23 m bay on
 *   both sides, over a pale podium with teal glass gate modules, domed at
 *   both ends.
 *
 * Frame: x along the concourse (to bearing 121.8 deg, south-east), y to the
 * north-east, z up, metres; placed at bearing 31.8. Anchor: the area
 * centroid of way/231888210, lng 55.3723558, lat 25.2431435. The apron is
 * flat (Mapterhorn z12).
 *
 * Numbers
 * - Footprint: OSM way/231888210 (ODbL), 655 m by 100 m. Wikipedia gives
 *   924 m by 91 m; the ISS-65 photo (NASA, 2021) shows A about 0.74 times
 *   as long as B (920 m on OSM), about 680 m, so OSM's outline is used.
 * - Crest 40 m above the apron: published (Wikipedia: "40 m high in the
 *   centre from the apron level").
 * - Podium 10 m, scallops to three quarters of the arc, bays of ~23 m
 *   (about 28 a side on the ISS photo, four to a stand; an A380's wingspan
 *   covers four in mikecogh's photo): estimated from the photos.
 * - Gate modules at the paired vertices of OSM's outline, 13 x 8 m, 15 m
 *   tall: estimated (mikecogh's photo, gates A6 and A7).
 *
 * Sources (evidence)
 * - OSM way/231888210 and its aeroway=jet_bridge ways.
 * - Wikipedia, "Dubai International Airport", Concourse A.
 * - "Dubai Terminal", mikecogh, CC BY-SA 2.0 (A from the apron, gates A6
 *   and A7): https://www.flickr.com/photos/89165847@N00/27342276785
 * - "Dubai Airport Concourse A", nabeelhashmi39, CC BY-SA 2.0:
 *   https://www.flickr.com/photos/90739672@N07/14240660311
 * - "ISS-65 Dubai International Airport and Dubai Creek (cropped).jpg",
 *   NASA, public domain (plan, roof):
 *   https://commons.wikimedia.org/wiki/File:ISS-65_Dubai_International_Airport_and_Dubai_Creek_(cropped).jpg
 * - "Dubai Airport overview.jpg", Umair Shaikh, CC BY-SA 2.0 (aerial):
 *   https://commons.wikimedia.org/wiki/File:Dubai_Airport_overview.jpg
 * - "Flights at Dawn.jpg", 2muchnate, CC BY-SA 4.0, 2024 (from the road):
 *   https://commons.wikimedia.org/wiki/File:Flights_at_Dawn.jpg
 *
 * Doubts
 * - The length: OSM and the ISS photo against Wikipedia's 924 m.
 * - Which way the fins lean on each side (see dubai-dxb-terminal-3.ts);
 *   drawn as B.
 * - OSM marks 14 gate pairs on the outline against 20 contact gates.
 */
import { Part } from './mesh'
import { type XY } from './clt-terminal'
import { DXB, gateModules, jetBridges, vaultConcourse, writeModel } from './dubai-dxb-terminal-3'

const ID = 'dubai-dxb-concourse-a'
const BEARING = 31.8

const A: XY[] = [[-327.37, 47.65], [-306.72, 47.82], [-305.03, 47.79], [-240.84, 48.44], [-240.05, 48.38], [-185.83, 48.83], [-162.67, 49.02], [-132.81, 49.28], [-130.41, 49.32], [-129.3, 49.31], [-117.93, 49.41], [-90.56, 49.63], [-41.9, 50.01], [-40.69, 50.05], [47.47, 50.79], [48.54, 50.82], [81.83, 51.09], [112.06, 51.34], [127.34, 51.47], [135.53, 51.5], [136.37, 51.55], [156.37, 51.72], [178.88, 51.9], [224.85, 51.13], [226.3, 51.02], [313.44, 49.66], [314.7, 49.58], [324.51, 49.47], [326.62, 18.97], [326.6, 16.9], [327.24, -1.43], [327.5, -17.84], [327.47, -19.2], [326.21, -51.42], [315.15, -51.15], [313.84, -51.18], [226.74, -49.05], [225.23, -49.04], [177.57, -47.88], [155.4, -48.07], [137.33, -48.23], [135.75, -48.23], [125.77, -48.32], [111.48, -48.44], [79.68, -48.7], [50.03, -48.95], [47.97, -48.94], [-39.58, -49.71], [-41.16, -49.74], [-97.19, -50.19], [-120.27, -50.39], [-127.3, -50.5], [-128.46, -50.46], [-135.2, -50.51], [-164.91, -50.76], [-186.83, -50.95], [-239.72, -51.4], [-241.39, -51.37], [-305.72, -51.95], [-307.21, -52.01], [-327.12, -52.13], [-327.18, -25.68], [-327.22, -24.13], [-327.29, 14.01], [-327.32, 15.68]]
/** OSM's jet bridges on Concourse A (aeroway=jet_bridge), building end first. */
const BRIDGES: XY[][] = [[[-327.2, -24.1], [-344.5, -24.5], [-376.4, -38.6], [-381.8, -45.7]], [[-307.2, -52.0], [-307.7, -64.3], [-328.2, -68.8], [-328.3, -72.7]], [[-241.4, -51.4], [-242.0, -75.1]], [[-128.5, -50.5], [-127.9, -73.7]], [[-41.2, -49.7], [-40.8, -74.9]], [[48.0, -48.9], [47.7, -74.1]], [[225.2, -49.0], [225.6, -72.0]], [[313.8, -51.2], [309.1, -92.1], [311.0, -95.2]], [[327.5, -19.2], [349.3, -19.7], [357.9, -32.2]], [[-327.3, 14.0], [-344.2, 14.2], [-349.8, 28.8], [-355.9, 29.1]], [[-306.7, 47.8], [-306.7, 55.2], [-318.4, 81.9], [-324.9, 88.2], [-327.6, 90.8]], [[-240.8, 48.4], [-240.9, 64.6]], [[-130.4, 49.3], [-130.0, 65.5]], [[-41.9, 50.0], [-41.8, 66.5]], [[314.7, 49.6], [314.8, 72.3]], [[326.6, 16.9], [351.1, 16.8], [376.2, 38.1]]]

function build(detail: boolean) {
  const metal = new Part(), teal = new Part(), stone = new Part(), win = new Part(), trim = new Part(), roof = new Part()
  vaultConcourse({ metal, glass: teal, podium: stone, podiumWin: win, roof: metal, trim }, A, {
    z0: 10, H: 40, bay: 23, rows: detail ? 14 : 8, tipRow: detail ? 11 : 6, endLen: 32, n: 3, foot: 0.4,
    endCols: detail ? 6 : 4, endGlassRows: detail ? 5 : 3,
  })
  gateModules({ glass: teal, trim }, A, { endClear: 28, along: 13, out: 8, h: 15 })
  if (detail) jetBridges({ body: trim, glass: win }, BRIDGES)
  return [
    { part: metal, material: DXB.silver },
    { part: teal, material: DXB.teal },
    { part: stone, material: DXB.stone },
    { part: win, material: DXB.window },
    { part: trim, material: DXB.trim },
    { part: roof, material: DXB.roof },
  ]
}

if (import.meta.main) {
  const extras = { bearing: BEARING, elevation: 0 }
  await writeModel(`${ID}.glb`, 'Dubai International Airport Concourse A', build(false), extras, 8000, 250_000)
  await writeModel(`${ID}.detail.glb`, 'Dubai International Airport Concourse A', build(true), extras, 40_000, 1_500_000)
}
