/**
 * DFW Airport Terminal E and its satellite — procedural, CC0-1.0, no textures.
 *
 *   bun generators/dal-dfw-terminal-e.ts
 *
 * DFW Airport Terminal E (1974; TRIP renewal 2012–2021) and its satellite,
 * east side, south. The satellite stands apart on the apron, reached only
 * underground, so this writes two models:
 * - dal-dfw-terminal-e, the half loop (way/25550170) with its Skylink
 *   stations, curb canopies and jet bridges. Anchor -97.0369809 32.8902939:
 *   area centroid of way/25550170.
 * - dal-dfw-terminal-e-satellite, the E satellite (way/25552175) with its
 *   rotunda and jet bridges. Anchor -97.0343782 32.8878184: area centroid
 *   of way/25552175.
 * Both outlines are the outers of relation/6322535 "Terminal E". They are
 * built in one frame from the old joint anchor (-97.0367518 32.8900723)
 * and moved to their own anchor (ORIGIN_E, ORIGIN_SAT) as they are written.
 *
 * Built with the kit in dal-dfw-terminal-a.ts (that file merges first): the
 * OSM outline extruded in wedge zones to the side-strip height, raised roof
 * bands read off the lidar across the band (depths from the airside face),
 * the two Skylink stations (2005) as raised white halls on columns over the
 * track with arched roofs, glass tiers, a canopy band and end cores, and the
 * OSM jet bridges. The Skylink track and the roads are not modelled.
 * Writes a low model and a .detail.glb of each (cabs and posts, mullion groups,
 * pale plant clusters, spine skylights, stepped curb piers and canopy,
 * station roof ribs). Glass is the palette's slate `window` (dark-tinted in
 * every photo); the stations have shallow barrel roofs with deep eaves.
 *
 * Frame: x east, y north, z up, metres, bearing 0. Lidar: USGS 3DEP
 * TX_Pecos_Dallas_B3_2018 (flown 2018), 1 m grid, read every 3 degrees
 * round the loop (work/dfw/sp-*.png against this spec). Colours from NAIP
 * (roof median #beb6aa inside the outline, pulled light) and the photos;
 * shared with A, B, C and E.
 *
 * Measured (lidar, above the apron at 174.7 m): side strips 10–11 m; the
 * spine 14 m at 15–30 m in, behind the south station too; a 16 m landside
 * block mid-arc; the stations 20–25 m. The satellite (lidar Esat.json):
 * roof 7.4 m above its apron (172.8 m), the rotunda on its south-east face
 * 12 m. Ground, each above the lowest ground under its own footprint (on
 * the map, Mapterhorn from the same lidar): the main apron 2.9 m above
 * 171.8 m, the satellite's 0.5 m above 172.3 m.
 * Canopies: OSM building=roof way/1124287172, 1124287173, 1124287174,
 * 1123813738 (7–9 m, white curb canopies) and the covered walkways
 * way/132813779, 132813781, 132813815 (5–6 m over the lower curb).
 * Photos (both models: the Kiser aerial; the loop: Baseball Watcher and
 * formulanone's DFW_Terminals_ACD_View_from_Takeoff_(52831109800).jpg,
 * CC BY-SA 2.0; the satellite: Charles from Port Chester):
 *   https://commons.wikimedia.org/wiki/File:Terminal_E_at_Dallas_Fort_Worth_International_Airport,_aerial_view_from_cabin_window_during_takeoff,_2023-02-18.jpg
 *   (Tim Kiser, CC BY-SA 4.0) E and the satellite from the east-south-east:
 *   the whole loop, the south station, the satellite's brown walls and
 *   dark rotunda; https://commons.wikimedia.org/wiki/File:Skylink_at_Terminal_E.jpg
 *   (Baseball Watcher, CC BY-SA 4.0, 2017) the south station at E31–E32;
 *   https://commons.wikimedia.org/wiki/File:DFW_E_Gates_-_remote_(29271885391).jpg
 *   (Charles from Port Chester, CC BY 2.0) the satellite from the apron.
 * Estimated: glazing bays, station tiers, the rotunda's radius (lidar
 *   extent), the satellite's brown (photo, pulled light), plant.
 * Doubts: the satellite's walls are seen only from afar.
 */
import { type TerminalSpec, type XY, type Parts, buildTerminal, materials, writeModel, newParts, jetBridge, prism, panelRow, mullions, bandRow, ccw, quadN, unit } from './dal-dfw-terminal-a'
import { clean, area, cap, walls, lathe } from './clt-terminal'
import { finish } from './palette'
export { buildTerminal, materials, airsideRef, at, ccw } from './dal-dfw-terminal-a'
import type { Part } from './mesh'

// --- generated from OSM (see header): anchor -97.0367518 32.8900723
// way/25550170
const RING_25550170 = [[-213.7,316.8],[-196.0,316.7],[-180.5,316.5],[-180.5,309.4],[-152.3,308.7],[-143.8,307.5],[-143.0,315.3],[-132.4,313.6],[-122.4,311.7],[-121.2,316.9],[-109.6,316.2],[-98.4,315.8],[-73.2,307.4],[-67.6,305.6],[-69.8,299.5],[-46.9,288.7],[-43.2,287.1],[-34.1,282.3],[-31.8,281.1],[-23.9,293.8],[-18.4,300.0],[-8.6,293.5],[0.1,285.4],[9.3,277.0],[11.8,279.7],[55.0,240.5],[52.8,237.7],[73.9,218.1],[78.0,212.9],[79.3,211.5],[73.8,205.3],[60.9,196.8],[64.9,191.2],[78.5,168.3],[88.6,146.7],[92.6,138.3],[101.8,110.1],[103.9,101.1],[104.8,97.4],[97.3,95.8],[101.8,68.0],[109.3,69.0],[110.7,57.0],[111.1,45.1],[111.0,33.1],[110.4,21.2],[109.5,6.6],[107.0,-7.0],[104.7,-20.4],[103.3,-27.6],[102.1,-33.5],[99.4,-43.5],[96.2,-53.5],[91.5,-66.9],[86.8,-76.7],[85.0,-80.9],[82.4,-86.9],[78.4,-94.9],[70.6,-108.1],[64.1,-118.5],[79.5,-130.1],[76.2,-134.4],[71.0,-141.3],[56.1,-130.2],[49.6,-138.3],[46.5,-141.9],[54.3,-149.1],[60.2,-144.1],[67.1,-151.2],[44.7,-171.3],[37.1,-178.2],[39.6,-180.8],[19.7,-198.8],[-3.7,-219.5],[-6.4,-216.7],[-14.6,-224.9],[-21.1,-230.3],[-33.7,-239.5],[-37.6,-242.3],[-42.6,-235.7],[-50.7,-215.5],[-63.6,-221.4],[-68.2,-223.5],[-85.2,-229.0],[-90.8,-230.7],[-95.6,-232.0],[-99.3,-233.0],[-124.4,-238.7],[-137.1,-257.7],[-154.3,-257.4],[-160.4,-257.4],[-174.2,-257.3],[-184.7,-257.4],[-214.2,-256.7],[-218.3,-256.7],[-217.9,-230.8],[-215.7,-230.8],[-215.4,-198.5],[-186.8,-198.8],[-157.7,-199.1],[-150.3,-198.2],[-150.6,-193.3],[-147.2,-192.9],[-143.8,-192.5],[-143.3,-197.6],[-133.5,-196.3],[-109.6,-191.6],[-107.3,-191.2],[-109.0,-186.4],[-107.1,-185.6],[-105.0,-184.8],[-107.6,-176.8],[-100.9,-174.9],[-95.6,-173.2],[-93.2,-181.5],[-88.2,-180.0],[-86.8,-184.7],[-83.0,-183.1],[-70.1,-177.1],[-58.7,-171.6],[-61.0,-167.1],[-58.1,-165.5],[-61.5,-158.5],[-54.7,-154.9],[-50.9,-161.4],[-48.1,-159.8],[-45.4,-164.3],[-36.9,-158.6],[-25.4,-150.1],[-20.9,-146.7],[-24.0,-143.1],[-20.8,-140.3],[-18.2,-138.1],[-23.4,-132.3],[-20.1,-129.4],[-17.2,-126.8],[-12.3,-132.2],[-9.6,-130.0],[-5.9,-134.2],[3.3,-124.0],[14.0,-112.4],[26.2,-95.8],[29.6,-90.8],[25.2,-88.5],[26.7,-85.8],[27.6,-84.7],[21.1,-80.7],[25.4,-74.8],[27.6,-71.0],[33.6,-74.5],[34.2,-73.6],[38.4,-75.7],[46.2,-61.3],[51.3,-49.2],[53.1,-44.1],[48.6,-42.4],[49.8,-39.3],[42.3,-36.6],[43.6,-31.9],[44.5,-29.1],[51.7,-31.6],[52.8,-28.4],[57.4,-29.9],[59.6,-21.7],[64.4,-1.3],[65.0,3.6],[60.2,4.0],[60.4,5.6],[60.7,8.0],[52.8,8.6],[53.6,13.7],[54.0,16.7],[61.6,15.8],[61.8,17.5],[62.1,19.2],[62.2,21.9],[66.9,21.6],[66.9,26.2],[67.2,47.8],[66.9,53.0],[61.8,52.5],[61.7,54.5],[61.6,56.0],[54.0,55.4],[53.4,59.5],[53.0,63.1],[60.5,63.9],[60.3,66.9],[65.0,67.6],[64.1,74.6],[60.1,94.7],[58.9,98.9],[54.2,97.1],[53.3,100.8],[52.7,103.1],[44.4,100.5],[43.2,104.1],[41.7,108.5],[49.1,111.0],[48.3,114.1],[53.8,115.8],[52.0,120.9],[43.3,141.2],[33.4,161.2],[25.0,173.0],[20.6,178.7],[8.5,194.0],[-7.3,208.6],[-19.4,219.3],[-23.3,222.7],[-26.3,218.7],[-29.0,220.7],[-33.8,214.8],[-36.3,216.8],[-40.4,219.9],[-36.1,225.3],[-38.6,227.3],[-35.6,230.9],[-40.5,234.3],[-60.7,246.6],[-65.3,248.7],[-67.4,244.0],[-69.0,244.7],[-70.9,245.6],[-73.7,239.2],[-78.0,241.0],[-80.3,242.0],[-81.2,242.5],[-78.2,248.9],[-80.0,249.8],[-84.0,251.6],[-81.7,256.3],[-84.5,257.1],[-106.4,264.3],[-109.0,265.1],[-110.2,260.0],[-115.0,261.2],[-116.2,261.5],[-117.7,254.5],[-123.0,255.8],[-125.8,256.5],[-124.1,263.3],[-127.6,263.8],[-126.6,268.9],[-133.3,270.3],[-157.0,272.8],[-161.0,272.8],[-161.0,267.5],[-164.3,267.4],[-164.3,260.4],[-170.0,260.4],[-172.4,260.4],[-172.5,267.6],[-175.8,267.6],[-175.9,272.8],[-180.6,272.8],[-180.7,269.6],[-194.2,269.4],[-194.2,282.8],[-203.4,288.5],[-202.1,291.3],[-202.3,293.6],[-202.5,295.5],[-209.5,295.5],[-209.2,308.4],[-214.2,308.4]] as XY[]
// way/25552175
const RING_25552175 = [[225.7,-269.7],[210.9,-286.9],[209.1,-289.4],[214.4,-294.4],[215.0,-295.3],[215.1,-296.4],[214.9,-297.4],[214.3,-298.3],[213.4,-299.0],[212.5,-299.3],[211.5,-299.3],[210.5,-299.0],[204.9,-294.0],[194.6,-307.0],[189.3,-311.9],[187.6,-313.7],[183.0,-309.9],[180.0,-306.6],[176.2,-310.9],[175.0,-311.6],[173.8,-312.1],[172.7,-312.2],[171.4,-311.9],[170.6,-310.9],[170.4,-309.7],[170.7,-308.6],[171.2,-307.8],[175.9,-302.7],[172.0,-298.8],[168.1,-295.4],[169.5,-293.8],[175.4,-287.6],[187.7,-273.5],[180.9,-268.3],[193.5,-253.0],[200.5,-244.4],[207.3,-250.0],[212.2,-243.4],[218.1,-235.3],[210.6,-230.5],[222.3,-214.4],[228.4,-204.9],[235.3,-209.2],[240.1,-201.6],[248.7,-187.3],[250.6,-183.7],[256.4,-187.1],[259.6,-189.1],[262.7,-183.7],[263.7,-182.7],[264.8,-182.4],[266.0,-182.7],[267.1,-183.3],[267.8,-184.4],[268.1,-185.5],[267.8,-186.9],[264.9,-192.2],[269.4,-195.1],[273.9,-197.7],[259.9,-219.9],[264.7,-222.9],[265.8,-223.9],[266.2,-224.9],[266.3,-225.9],[266.0,-226.9],[265.6,-227.7],[265.0,-228.2],[264.4,-228.6],[263.6,-228.6],[262.3,-228.4],[256.8,-224.9],[243.2,-245.6],[245.2,-247.5],[246.3,-249.1],[246.9,-250.9],[247.4,-252.8],[247.5,-254.6],[247.4,-256.4],[246.9,-258.2],[246.0,-260.0],[244.2,-262.7],[242.2,-265.5],[240.8,-267.2],[239.3,-269.0],[237.7,-270.3],[235.5,-271.5],[233.7,-271.9],[231.6,-272.0],[229.9,-271.8],[228.4,-271.4],[226.9,-270.6]] as XY[]
const JET: XY[][] = [[[-184.6,-257.4],[-184.2,-278.7],[-203.1,-278.2],[-196.2,-294.8]],[[-174.2,-257.3],[-173.7,-264.4],[-164.7,-289.9]],[[-124.3,-238.7],[-110.5,-264.0],[-97.3,-287.1]],[[-95.6,-232.0],[-85.3,-269.9],[-59.6,-278.2]],[[-63.6,-221.5],[-48.3,-236.1],[-43.6,-247.2],[-28.0,-259.4]],[[-14.6,-224.9],[-8.8,-228.6],[7.7,-233.3]],[[193.5,-253.0],[188.5,-253.7],[170.2,-257.9]],[[269.4,-195.1],[273.5,-188.1],[270.8,-158.3]],[[256.4,-187.1],[256.9,-186.0],[246.5,-181.2],[228.7,-157.9]],[[248.7,-187.3],[247.3,-185.7],[221.4,-176.2]],[[222.3,-214.4],[219.5,-212.4],[217.3,-212.8],[195.9,-233.0]],[[169.5,-293.8],[144.7,-304.0]],[[172.0,-298.8],[159.3,-315.1],[151.7,-324.9]],[[210.9,-286.9],[241.3,-298.0],[243.6,-297.8]],[[19.7,-198.8],[24.9,-201.3],[40.9,-208.5]],[[44.7,-171.3],[51.8,-174.6],[72.4,-173.7]],[[-131.2,-292.0],[-159.1,-266.2],[-160.4,-257.4]],[[175.4,-287.6],[171.3,-284.9],[142.2,-287.4]],[[184.5,-270.6],[175.7,-274.2],[155.0,-269.1]],[[240.1,-201.6],[237.0,-200.1],[210.0,-195.2]],[[256.9,-186.0],[257.4,-184.7],[248.2,-161.8],[240.6,-141.6]],[[70.6,-108.1],[82.9,-128.6],[77.9,-145.5],[102.5,-138.1]],[[82.4,-86.9],[89.2,-100.7],[103.3,-104.4]],[[86.8,-76.7],[92.8,-76.2],[112.4,-72.2]],[[103.3,-27.6],[110.4,-29.4],[128.1,-21.0]],[[109.5,6.6],[123.5,8.5],[136.9,26.3]],[[110.7,57.0],[126.8,61.1],[138.0,75.1]],[[103.9,101.1],[123.1,105.2],[134.9,122.3]],[[88.6,146.7],[109.2,154.3],[122.2,165.2]],[[64.9,191.2],[91.0,186.2],[97.0,205.8]],[[78.0,212.9],[94.7,234.5]],[[52.8,237.7],[60.7,242.1],[64.7,268.1]],[[28.6,259.4],[33.5,266.0],[35.7,291.0]],[[0.1,285.4],[6.2,291.7],[-3.3,310.2]],[[-46.9,288.7],[-34.5,321.1]],[[-73.2,307.4],[-72.4,336.3]],[[-109.6,316.2],[-108.4,328.0],[-113.6,342.6]],[[-132.4,313.6],[-130.3,324.4],[-146.1,339.6]],[[-196.0,316.7],[-196.7,332.1],[-205.4,350.9]],[[-81.0,-229.6],[-56.5,-262.3],[-44.5,-275.5]],[[-214.2,-256.7],[-214.9,-278.7],[-220.8,-279.1],[-221.7,-299.1]],[[189.3,-311.9],[191.2,-314.0],[191.4,-325.2],[192.9,-326.2]],[[194.6,-307.0],[210.3,-312.8],[219.5,-315.8]],[[183.0,-309.9],[176.3,-322.5],[172.3,-329.7]]]

// --- The Terminal E satellite (way/25552175, second outer of relation/6322535) ---
const SAT = RING_25552175
const SAT_C: XY = [SAT.reduce((s, p) => s + p[0], 0) / SAT.length, SAT.reduce((s, p) => s + p[1], 0) / SAT.length]
function nearSat(p: XY) { return Math.hypot(p[0] - SAT_C[0], p[1] - SAT_C[1]) < 110 }
/** Satellite apron above its own y = 0 (Esat lidar: apron 172.8 m; the map's lowest ground under the satellite alone 172.3 m), roof 7.4 m above it. */
const SG = 0.5, SROOF = 7.4
/** The rotunda: a dark glazed half-drum on the south-east face (lidar 12 m, x 208..228, y -282..-257). */
const ROT_C: XY = [214, -266], ROT_R = 11
function satellite(p: Parts, detail: boolean) {
  const ring = ccw(clean(SAT, 0.2)), top = SG + SROOF
  prism(p.x, p.x, ring, 0, top, 0.3)
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    if (Math.hypot((a[0] + b[0]) / 2 - ROT_C[0], (a[1] + b[1]) / 2 - ROT_C[1]) < ROT_R + 1) continue
    panelRow(p.win, a, b, SG + 3.6, top - 1.2, { bay: 9, gap: 1.6, end: 0.8 })
    if (detail) mullions(p.white, a, b, SG + 3.6, top - 1.2, 2.4, 0.14, 0.1)
  }
  // the rotunda: facing out from the satellite's long axis
  const out = unit([ROT_C[0] - SAT_C[0], ROT_C[1] - SAT_C[1], 0]), a0 = Math.atan2(out[1], out[0])
  const n = detail ? 16 : 8, zt = SG + 12
  const arc: XY[] = []
  for (let k = 0; k <= n; k++) { const a = a0 - Math.PI / 2 + (Math.PI * k) / n; arc.push([ROT_C[0] + ROT_R * Math.cos(a), ROT_C[1] + ROT_R * Math.sin(a)]) }
  const drum = ccw(arc)
  walls(p.x, drum, 0, SG + 3.4)
  for (let k = 0; k < n; k++) {
    const a = arc[k], b = arc[k + 1], na = unit([a[0] - ROT_C[0], a[1] - ROT_C[1], 0]), nb = unit([b[0] - ROT_C[0], b[1] - ROT_C[1], 0])
    quadN(p.win, [a[0], a[1], SG + 3.4], [b[0], b[1], SG + 3.4], [b[0], b[1], zt - 1.2], [a[0], a[1], zt - 1.2], [na, nb, nb, na])
    quadN(p.metal, [a[0], a[1], zt - 1.2], [b[0], b[1], zt - 1.2], [b[0], b[1], zt], [a[0], a[1], zt], [na, nb, nb, na])
  }
  cap(p.metal, drum, zt)
  for (const j of JET) if (nearSat(j[0])) jetBridge(p, SPEC, j, detail, SG + 3.4)
}

// The curb canopies (OSM building=roof, 7–9 m): white sails over the upper curb
const CANOPY_RINGS: XY[][] = [[[-80.0,249.8],[-78.2,248.9],[-81.2,242.5],[-80.3,242.0],[-78.0,241.0],[-73.7,239.2],[-70.9,245.6],[-69.0,244.7],[-77.6,224.8],[-88.9,230.1]],[[38.8,20.2],[61.8,17.5],[61.6,15.8],[54.0,16.7],[53.6,13.7],[52.8,8.6],[60.7,8.0],[60.4,5.6],[37.3,8.0]],[[-107.6,-176.8],[-111.4,-164.7],[-99.5,-160.8],[-95.6,-173.2],[-100.9,-174.9]]]  // way/1124287172, way/1124287173, way/1124287174

// The covered walkways along the lower curb (OSM building=roof, 5–6 m) and the small canopy way/1123813738 (7–9 m)
const WALKWAYS: XY[][] = [[[-190.5,263.8],[-190.5,259.9],[-156.7,259.5],[-133.0,256.8],[-108.1,251.4],[-86.4,243.9],[-65.2,234.2],[-44.6,221.8],[-24.3,206.5],[-8.2,191.6],[-2.0,185.2],[2.0,179.9],[6.4,182.8],[1.9,188.9],[-4.8,195.7],[-23.0,212.2],[-42.0,226.2],[-63.0,238.5],[-84.5,248.2],[-107.5,255.8],[-132.1,261.3],[-156.6,263.8]],[[7.5,-111.1],[-1.0,-120.4],[-7.3,-126.3],[-24.9,-142.3],[-33.8,-149.2],[-43.6,-155.8],[-54.2,-162.4],[-66.8,-169.0],[-85.9,-177.4],[-110.8,-184.8],[-120.8,-187.2],[-132.2,-189.4],[-144.3,-190.9],[-155.7,-191.8],[-166.5,-192.2],[-166.9,-187.3],[-157.6,-187.1],[-144.9,-186.3],[-133.0,-184.7],[-112.4,-180.4],[-88.6,-173.2],[-67.5,-163.7],[-55.7,-157.3],[-45.8,-151.4],[-28.4,-139.0],[-11.4,-123.6],[-3.3,-115.6],[3.4,-108.0]],[[21.5,153.4],[25.4,156.3],[36.9,137.9],[42.0,127.0],[46.8,115.3],[51.4,101.7],[54.4,91.1],[56.9,79.8],[59.0,67.7],[60.5,55.0],[61.0,45.0],[61.1,23.8],[58.6,1.3],[52.4,-23.5],[43.3,-50.3],[39.9,-58.6],[36.6,-65.3],[32.5,-72.9],[27.6,-70.3],[32.6,-62.4],[37.9,-51.4],[42.7,-40.2],[48.6,-22.9],[53.7,2.5],[56.1,24.1],[56.3,43.1],[55.5,54.1],[54.5,63.9],[53.1,73.6],[49.7,89.3],[46.0,102.4],[41.6,115.3],[37.3,125.5],[32.7,135.6]]]  // way/132813779, way/132813781, way/132813815
const SMALL_CANOPY: XY[] = [[7.7,-73.6],[14.1,-63.1],[27.6,-71.0],[25.4,-74.8],[21.1,-80.7]]  // way/1123813738
const G = 2.9
/** The shared frame's origin (the old joint anchor) and each model's own anchor in it (see header). */
export const ANCHOR: [number, number] = [-97.0367518, 32.8900723]
export const ANCHOR_E: [number, number] = [-97.0369809, 32.8902939], ORIGIN_E: XY = [-21.41, 24.50]
export const ANCHOR_SAT: [number, number] = [-97.0343782, 32.8878184], ORIGIN_SAT: XY = [221.88, -249.22]
export const SPEC: TerminalSpec = {
  id: 'dal-dfw-terminal-e', name: 'DFW Airport Terminal E', height: 26,
  ring: RING_25550170, centre: [-63, 25], ground: G,
  thRange: [-130, 130], holes: [[52, 82], [-86, -54]],
  zones: [{ th: [-130, -55], h: 10.5 }, { th: [-55, 52], h: 10.5 }, { th: [52, 130], h: 11 }],
  bands: [
    { th: [84, 110], d: [12, 30], h: 14.5 },
    { th: [-45, 40], d: [15, 30], h: 14 },
    { th: [-3, 17], d: [30, 45], h: 16, face: 'wall' },
    { th: [-82, -56], d: [15, 28], h: 14 },
    { th: [-100, -86], d: [15, 40], h: 15 },
  ],
  stations: [
    { th: [54, 81], d: [-21, -1], hEdge: 17, hCrown: 24.5, core: 2 },
    { th: [-85, -56], d: [-21, -1], hEdge: 17, hCrown: 24.5, core: 2 },
  ],
  canopies: [
    ...[...CANOPY_RINGS, SMALL_CANOPY].map((ring) => ({ ring, z0: G + 6.2, z1: G + 7.0 })),
    // the curb sits about 1.5 m under the apron; the walkway roofs 5–6 m over it (OSM)
    ...WALKWAYS.map((ring) => ({ ring, z0: G + 3.5, z1: G + 4.3 })),
  ],
  jets: JET.filter((j) => !nearSat(j[0])),
  plant: [{ th: [-40, 40], d: [32, 40], h: 10.5 }],
}
const SAT_MATERIAL = finish('dfw-e-satellite', 0x9f907c)

/** Move a model's parts by -o in the map frame (Part stores glTF x, z = -y), so its own anchor is the origin. */
function shift<T extends { part: Part }>(parts: T[], o: XY) {
  for (const part of new Set(parts.map((q) => q.part))) for (let i = 0; i < part.pos.length; i += 3) { part.pos[i] -= o[0]; part.pos[i + 2] += o[1] }
  return parts
}
export function buildMain(detail: boolean) { return shift(materials(buildTerminal(SPEC, detail).p), ORIGIN_E) }
export function buildSatellite(detail: boolean) { const p = newParts(); satellite(p, detail); return shift(materials(p, SAT_MATERIAL), ORIGIN_SAT) }

if (import.meta.main) for (const detail of [false, true]) {
  const budget = { maxTris: detail ? 40000 : 8000, maxBytes: detail ? 1_500_000 : 250_000 }, d = detail ? '.detail' : ''
  await writeModel(`dal-dfw-terminal-e${d}.glb`, SPEC.name, buildMain(detail), { bearing: 0, height: SPEC.height, ...budget })
  await writeModel(`dal-dfw-terminal-e-satellite${d}.glb`, 'DFW Airport Terminal E Satellite', buildSatellite(detail), { bearing: 0, height: SG + 12, ...budget })
}
