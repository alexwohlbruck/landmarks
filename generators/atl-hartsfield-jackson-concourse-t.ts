/**
 * Hartsfield-Jackson Atlanta International Airport (ATL): Concourses T, A
 * and B, the long parallel midfield piers west of the centre. Procedural,
 * CC0-1.0, no textures.
 *
 *   bun generators/atl-hartsfield-jackson-concourse-t.ts
 *
 * Writes three models, one per concourse: the three piers stand about 300 m
 * apart on the apron, joined only by the underground Plane Train, so each is
 * its own freestanding building. For each, models/<id>.glb (low: pier, hub,
 * gate glazing, jet-bridge boxes) and .detail.glb (mullion groups, jet-bridge
 * posts and cabs, more rooftop plant). Uses the kit in
 * atl-hartsfield-jackson-domestic-terminal.ts.
 * - atl-hartsfield-jackson-concourse-t: anchor (-84.4425234, 33.6409430),
 *   the area centroid of way/24445333.
 * - atl-hartsfield-jackson-concourse-a: anchor (-84.4391868, 33.6404394),
 *   the area centroid of way/24445165.
 * - atl-hartsfield-jackson-concourse-b: anchor (-84.4359123, 33.6407260),
 *   the area centroid of way/24445168.
 * Each concourse is built in the shared site frame below (origin -84.43931,
 * 33.640715, the centroid of the three outlines, where the three were once
 * one model) and moved so its own anchor is the origin. Each stands on its
 * own apron at y = 0: the lidar heights below are above the box's lowest
 * ground, so each concourse's are lowered by its apron's height above that
 * (T 3 m, A 2 m, B 1 m), and the jet bridges with them.
 *
 * Frame: x east, y north, z up, metres, bearing 0.
 *
 * Evidence
 * - OSM: way/24445333 (Concourse T), way/24445165 (Concourse A),
 *   way/24445168 (Concourse B); 82 aeroway=jet_bridge ways for the
 *   bridges, each drawn with the concourse it meets. Outlines as mapped;
 *   OSM has no heights.
 * - Lidar: USGS 3DEP GA_Central_5_2018, 1 m grid, heights above the lowest
 *   ground in the box (305.9 m; the apron is 1-3 m above it, the map's
 *   terrain flat within 2 m):
 *   - T: pier 13 m north of its connector, 19.5 m south of it; connector
 *     block 19.5 m; the plant yard between it and the Domestic Terminal 14 m
 *     with three cooling-tower drums to ~27 m; south end 13 m.
 *   - A: pier 12 m; mid-concourse block 17 m (y -52..0) with a 24 m core;
 *     the hub's west wing 17 m, east wing 22 m with a 35 m tower; south end
 *     block 8.5 m.
 *   - B: pier 11-12 m; hub 12 m with 17 m and 21 m cores; the block north
 *     of the hub 23 m with a 26 m crown; a 17 m block at y 96..124.
 * - NAIP (USGS, public domain): plan and roof colour: pale grey membrane
 *   roofs with rows of plant; the jet bridges.
 * - Photos (Wikimedia Commons):
 *   - "ATL Terminal T and A 2018.jpg", Matthew Groh, CC BY-SA 4.0: T and
 *     A from the north: white roofs, A's dark hub tower, T's red stripe
 *     along its top. (T, A)
 *   - "ATL FROM 777 N860DA FLIGHT ATL-JFK (7260474670).jpg", Eric Salard,
 *     CC BY-SA 2.0: T, A and B from the south at sunset: the long white
 *     slabs, the taller mid-concourse blocks, red bands at the ends. (T, A, B)
 *   - "Atlanta Concourse T and Transportation Area (50401170512).jpg",
 *     formulanone, CC BY-SA 2.0. (T)
 *   - "BetweenABgatesATLaerial-May2017 (33992092654).jpg", formulanone, CC
 *     BY-SA 2.0: the hub blocks' pale precast with red panels. (A, B)
 *   - "Atlanta Hartsfield-Jackson Airport Concourse A aerial
 *     (49054916886).jpg", formulanone, CC BY-SA 2.0: A's roof and plant,
 *     its grey gate-level glazing, jet bridges. (A)
 *   - "ATL Concourse B - June 2016 (29445195857).jpg", formulanone, CC
 *     BY-SA 2.0: B's south end: beige walls, the red band below the roof,
 *     grey glazing. (B)
 *
 * Review round 1: the hub blocks and towers are pale precast with
 *   two-storey window bands and a red accent panel (A from the NNW,
 *   formulanone), not dark boxes; rooftop plant is clusters of pale boxes of
 *   varied size; jet bridges are 3.5 x 4 m silver boxes on posts in both
 *   LODs (rotundas and cabs in the detail).
 * Estimated: the glazing band (one storey above the apron to 1.9 m under
 * the roof); the red bands' height; plant sizes; jet bridge floor 5 m
 * above the apron (6.5 m above the box's lowest ground).
 * Doubts: T's north extension (y > 316) postdates the lidar; it is built
 * on the OSM outline at T's 13 m, unphotographed. The hubs' tower and core
 * shapes are lidar boxes.
 */
import type { Part } from './mesh'
import {
  type XY, type Zone, rect, box, concourse, newConcourseParts, concourseMaterials, plantClusters, hubTower, jetBridges, writeModel, lathe, clip, clean,
} from './atl-hartsfield-jackson-domestic-terminal'

// way/24445333
const T: XY[] = [[-278.5,120.2],[-277.4,119.3],[-277.2,90.9],[-277.0,66.9],[-276.9,41.7],[-276.8,31.1],[-276.7,28.8],[-276.7,24.5],[-252.3,24.7],[-252.2,23.6],[-252.2,15.3],[-231.3,15.3],[-231.4,2.5],[-244.5,2.2],[-250.2,0.8],[-254.6,-0.5],[-260.4,-7.1],[-269.0,-16.8],[-277.3,-16.7],[-277.2,-58.2],[-277.2,-104.0],[-277.2,-135.0],[-277.1,-162.7],[-277.1,-212.0],[-277.0,-281.1],[-277.0,-343.4],[-276.9,-377.5],[-278.4,-377.5],[-289.8,-377.5],[-289.8,-380.3],[-298.8,-380.3],[-298.8,-99.6],[-337.9,-68.2],[-338.0,-40.2],[-338.1,-30.0],[-351.8,-30.1],[-351.8,-15.3],[-317.1,-15.1],[-317.1,-10.3],[-317.2,-5.2],[-348.9,-5.4],[-348.9,4.0],[-349.0,21.8],[-349.0,23.8],[-356.0,23.7],[-356.0,27.0],[-356.0,33.3],[-362.0,33.2],[-362.1,41.2],[-352.5,41.3],[-352.5,47.8],[-337.5,47.9],[-337.6,70.6],[-337.7,87.1],[-296.2,119.9],[-296.3,269.5],[-296.4,314.8],[-304.5,314.8],[-304.5,339.5],[-313.5,339.5],[-313.5,356.8],[-323.2,356.8],[-323.2,378.0],[-326.1,378.0],[-326.1,399.2],[-326.1,400.7],[-326.1,403.2],[-308.5,403.2],[-291.4,403.2],[-278.5,403.2],[-278.5,388.8],[-278.5,361.5],[-278.5,308.9],[-278.5,284.1],[-278.5,246.3],[-278.5,181.0],[-278.5,144.4]]
// way/24445165
const A: XY[] = [[44.5,-385.4],[44.3,-375.5],[44.1,-359.3],[44.0,-352.9],[36.1,-352.9],[26.2,-353.0],[26.2,-348.6],[25.8,-306.0],[25.6,-274.4],[25.3,-237.8],[25.0,-193.9],[24.7,-149.1],[25.8,-149.1],[25.8,-154.8],[34.0,-154.8],[34.0,-146.9],[24.7,-146.8],[24.6,-137.1],[24.1,-65.7],[23.9,-34.4],[23.6,4.2],[59.7,4.3],[68.1,12.2],[67.8,21.5],[67.7,29.1],[59.8,36.2],[48.1,36.2],[48.2,33.1],[46.7,33.1],[46.7,34.4],[25.5,34.8],[25.6,91.2],[25.7,150.0],[25.8,199.7],[25.8,241.6],[25.9,282.3],[25.9,316.0],[25.9,320.4],[16.8,320.5],[16.7,342.2],[16.0,342.2],[8.3,342.3],[-2.2,342.3],[-2.2,340.6],[-2.2,302.0],[-2.2,263.6],[-2.2,234.1],[-2.2,203.7],[-9.6,203.6],[-9.6,189.8],[-2.3,189.8],[-2.3,171.6],[-2.3,140.7],[-2.1,68.0],[-2.1,52.8],[-5.0,52.7],[-5.0,50.5],[-17.1,50.5],[-16.9,35.9],[-25.3,35.9],[-25.3,32.5],[-36.1,32.5],[-40.0,28.8],[-44.1,24.9],[-44.2,21.4],[-44.2,6.3],[-36.3,-1.0],[-17.0,-1.1],[-17.0,-2.0],[-5.1,-2.3],[-5.1,-3.7],[-5.2,-17.0],[-2.2,-17.4],[-2.2,-44.4],[-2.1,-111.0],[-2.1,-161.8],[-2.1,-230.2],[-2.0,-271.5],[-2.0,-328.4],[-2.0,-352.8],[-11.1,-352.8],[-11.2,-371.8],[-11.2,-379.3],[-11.2,-385.0]]
// way/24445168
const B: XY[] = [[267.9,-19.5],[300.7,-19.3],[300.7,-22.0],[300.7,-57.6],[300.7,-100.0],[300.7,-139.7],[300.7,-160.2],[291.8,-160.1],[291.8,-168.2],[300.8,-168.2],[301.0,-199.5],[293.6,-199.5],[293.7,-214.5],[300.8,-214.6],[300.9,-249.0],[301.0,-299.3],[301.1,-328.5],[301.1,-331.5],[310.1,-331.5],[310.3,-352.8],[300.9,-352.7],[300.0,-353.8],[300.1,-360.3],[318.1,-360.2],[334.2,-360.1],[334.0,-352.9],[329.3,-352.9],[329.3,-348.4],[329.3,-319.9],[329.2,-278.2],[329.1,-239.9],[329.1,-203.4],[329.0,-149.6],[328.9,-115.5],[328.8,-42.8],[328.8,-39.6],[330.7,-39.5],[330.9,-27.1],[330.4,-27.1],[330.6,-24.5],[328.8,-24.4],[328.8,-22.0],[359.8,-21.9],[365.8,-15.5],[370.9,-9.2],[370.9,-3.1],[370.8,7.9],[368.8,10.2],[365.0,14.8],[329.0,14.5],[328.9,17.9],[328.9,25.8],[334.9,25.7],[333.1,28.5],[344.9,28.4],[344.9,44.7],[344.9,56.4],[332.6,56.4],[328.8,54.2],[328.8,63.2],[328.9,73.3],[336.3,73.3],[336.0,87.1],[328.9,87.0],[329.0,122.4],[329.1,131.1],[335.6,131.3],[335.9,169.9],[329.1,170.1],[329.1,170.7],[328.9,224.0],[328.9,226.5],[336.1,226.6],[336.0,240.5],[328.9,240.7],[328.8,266.5],[328.7,312.6],[328.7,342.8],[316.0,342.9],[304.6,343.0],[300.7,343.0],[300.7,325.9],[300.7,277.2],[300.7,223.5],[300.7,221.0],[293.7,220.7],[293.6,171.6],[300.7,171.5],[300.7,165.0],[300.7,130.3],[300.7,111.7],[293.5,111.6],[293.6,83.7],[300.7,83.6],[300.6,70.8],[300.6,58.3],[300.6,56.4],[287.6,56.3],[287.6,28.4],[291.6,28.4],[287.8,25.9],[300.6,26.0],[300.6,21.9],[286.3,21.6],[286.3,16.7],[268.0,17.0],[263.1,10.5],[259.4,5.3],[259.3,-2.5],[259.3,-7.4]]
// aeroway=jet_bridge ways near these concourses (OSM)
const JETS: XY[][] = [[[26.2,-348.6],[51.4,-349.1]],[[-21.7,-341.3],[-2.0,-328.4]],[[25.8,-306.0],[31.3,-306.1],[32.9,-317.3],[53.0,-308.7]],[[-30.2,-296.7],[-10.0,-278.4],[-5.1,-271.6],[-2.0,-271.5]],[[25.6,-274.4],[36.5,-274.3],[51.8,-263.6]],[[-28.1,-245.3],[-4.4,-230.4],[-2.1,-230.2]],[[25.3,-237.8],[50.6,-212.7]],[[25.0,-193.9],[37.5,-191.3],[54.9,-168.6]],[[-27.6,-189.2],[-5.1,-161.9],[-2.1,-161.8]],[[24.6,-137.1],[27.5,-137.0],[43.8,-117.8]],[[-27.3,-132.0],[-4.9,-110.9],[-2.1,-111.0]],[[-288.2,-375.0],[-278.5,-375.1],[-278.4,-377.5],[-278.4,-385.2],[-272.0,-385.2],[-271.9,-391.9],[-269.6,-392.2],[-258.5,-375.7]],[[-261.3,-327.5],[-272.4,-343.4],[-277.0,-343.4],[-288.4,-343.5]],[[-255.3,-260.7],[-271.8,-281.0],[-277.0,-281.1],[-288.4,-281.0]],[[-247.0,-214.8],[-265.3,-230.3],[-267.9,-230.3],[-267.8,-218.7],[-272.4,-218.8],[-272.6,-212.0],[-277.1,-212.0],[-288.3,-212.2]],[[-251.7,-173.2],[-264.7,-182.7],[-272.3,-163.0],[-277.1,-162.7],[-288.3,-163.0]],[[-255.3,-124.1],[-270.4,-144.5],[-272.4,-144.6],[-272.5,-135.5],[-277.2,-135.0],[-288.3,-135.0]],[[-258.4,-82.4],[-272.9,-103.9],[-277.2,-104.0],[-288.3,-104.0]],[[-27.9,-74.5],[-4.9,-44.4],[-2.2,-44.4]],[[24.1,-65.7],[27.5,-65.7],[27.5,-72.0],[47.8,-72.0]],[[23.9,-34.4],[47.1,-27.1]],[[-24.6,-14.4],[-5.1,-3.7]],[[25.5,34.8],[51.8,51.4]],[[-34.2,57.9],[-2.1,68.0]],[[25.6,91.2],[48.9,102.4]],[[-23.9,112.3],[-9.4,128.5],[-4.8,140.5],[-2.3,140.7]],[[25.7,150.0],[51.4,162.4]],[[-30.6,157.6],[-2.3,171.6]],[[25.8,199.7],[49.6,205.2]],[[-29.5,207.8],[-13.7,222.4],[-5.0,234.1],[-2.2,234.1]],[[25.8,241.6],[47.9,247.1]],[[-24.0,253.4],[-4.6,263.5],[-2.2,263.6]],[[25.9,282.3],[47.7,294.3]],[[-25.8,294.5],[-2.2,302.0]],[[-27.3,335.3],[-6.2,341.7],[-2.2,340.6]],[[25.9,316.0],[47.2,332.4]],[[-258.0,-36.7],[-267.1,-58.2],[-277.2,-58.2],[-288.3,-58.3]],[[-250.1,42.5],[-264.5,38.6],[-267.0,38.6],[-267.1,46.7],[-270.3,46.8],[-270.0,41.9],[-276.9,41.7],[-287.9,41.8]],[[-244.7,71.7],[-269.5,67.5],[-277.0,66.9],[-287.8,66.9]],[[-248.6,120.2],[-270.0,91.3],[-277.2,90.9],[-287.6,90.9]],[[-287.6,144.2],[-280.8,144.3],[-278.5,144.4],[-268.5,144.5],[-250.6,161.2]],[[-287.8,181.0],[-281.1,181.1],[-278.5,181.0],[-275.8,181.1],[-258.2,206.2]],[[-248.3,247.0],[-278.5,246.3],[-281.6,246.4],[-288.3,246.4]],[[-246.8,283.9],[-273.4,274.0],[-276.2,273.6],[-276.4,284.1],[-278.5,284.1],[-281.6,284.2]],[[-282.0,308.9],[-278.5,308.9],[-276.5,309.0],[-258.0,327.1]],[[-254.3,368.4],[-278.5,361.5],[-281.8,361.2]],[[-281.8,388.7],[-278.5,388.8],[-258.6,407.1]],[[-291.4,400.8],[-291.4,403.2],[-288.5,423.7]],[[-366.8,415.5],[-342.8,404.2],[-326.1,400.7],[-308.5,400.7]],[[-308.5,400.7],[-308.5,403.2],[-324.3,426.3]],[[282.8,-344.3],[301.1,-328.5]],[[329.3,-348.4],[353.3,-346.6]],[[329.3,-319.9],[352.0,-313.5]],[[276.8,-302.7],[301.0,-299.3]],[[329.2,-278.2],[352.3,-267.1]],[[276.8,-256.6],[295.7,-249.0],[300.9,-249.0]],[[329.1,-239.9],[331.4,-239.8],[350.6,-225.2]],[[329.1,-203.4],[331.6,-203.2],[349.0,-179.7]],[[275.5,-210.9],[292.8,-190.8],[300.8,-168.2]],[[352.2,-130.1],[331.7,-149.4],[329.0,-149.6]],[[279.6,-164.2],[286.9,-148.6],[300.7,-139.7]],[[283.5,-116.7],[300.7,-100.0]],[[328.9,-115.5],[331.7,-115.4],[336.9,-106.4],[349.9,-90.7]],[[278.7,-74.2],[300.7,-57.6]],[[328.8,-42.8],[344.8,-48.6],[358.3,-42.7]],[[276.0,-30.4],[296.2,-22.0],[300.7,-22.0]],[[328.8,63.2],[339.3,63.0],[339.9,87.6],[358.9,107.6]],[[274.4,84.7],[291.8,82.7],[292.1,74.6],[300.6,70.8]],[[273.8,129.7],[300.7,130.3]],[[329.0,122.4],[339.0,122.7],[340.2,132.9],[355.7,148.2]],[[274.5,170.8],[282.5,186.8],[285.3,187.0],[288.8,165.2],[300.7,165.0]],[[329.1,170.7],[336.0,170.6],[353.2,194.3]],[[274.0,220.7],[300.7,223.5]],[[328.9,224.0],[338.9,224.2],[358.0,240.4]],[[328.8,266.5],[337.8,266.5],[353.4,287.1]],[[274.0,262.0],[292.8,275.6],[292.9,277.1],[300.7,277.2]],[[274.4,305.7],[294.1,325.8],[300.7,325.9]],[[275.5,346.8],[304.4,358.3],[304.6,343.0]],[[356.1,337.4],[337.3,312.9],[328.7,312.6]],[[328.9,17.9],[342.6,17.5],[360.8,22.8]],[[344.9,44.7],[358.3,57.5]],[[300.6,58.3],[286.7,58.2],[270.6,37.2]]]

/** Zones with their roofs lowered by the apron's height `g`, so the apron is y = 0. */
const on = (zones: Zone[], g: number): Zone[] => zones.map((z) => ({ ...z, h: z.h - g }))

/** Distance from a point to an outline's edges. */
function dist(r: XY[], q: XY) {
  let d = Infinity
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length], dx = b[0] - a[0], dy = b[1] - a[1], l = dx * dx + dy * dy || 1
    const t = Math.max(0, Math.min(1, ((q[0] - a[0]) * dx + (q[1] - a[1]) * dy) / l))
    d = Math.min(d, Math.hypot(q[0] - a[0] - t * dx, q[1] - a[1] - t * dy))
  }
  return d
}
/** The jet bridges that meet an outline: those whose nearer end is nearest it of all the outlines. */
export function jetsOf(jets: XY[][], outlines: XY[][], k: number) {
  const near = (l: XY[], r: XY[]) => Math.min(dist(r, l[0]), dist(r, l.at(-1)!))
  return jets.filter((l) => {
    const d = outlines.map((r) => near(l, r))
    return d.indexOf(Math.min(...d)) === k
  })
}

/** Move every part so (ox, oy) in the site frame is the origin. Part.pos is in the glTF frame (x, z, -y). */
export function moveTo<T extends { part: Part }>(parts: T[], ox: number, oy: number): T[] {
  for (const { part } of parts) for (let i = 0; i < part.pos.length; i += 3) { part.pos[i] -= ox; part.pos[i + 2] += oy }
  return parts
}
/** The highest point of the parts, to 0.1 m. */
export const topOf = (parts: Array<{ part: Part }>) => Math.ceil(10 * Math.max(...parts.map(({ part }) => { let m = 0; for (let i = 1; i < part.pos.length; i += 3) m = Math.max(m, part.pos[i]); return m }))) / 10

const OUTLINES = [T, A, B]

/** Concourse T, apron 3 m above the box's lowest ground. */
function buildT(detail: boolean) {
  const p = newConcourseParts(), g = 3
  concourse(p, T, on([
    { y0: -390, y1: -342, h: 13 },
    { y0: -342, y1: -20, h: 19.5 },
    { y0: -20, y1: 36, h: 14 },
    { y0: 36, y1: 120, h: 19.5 },
    { y0: 120, y1: 410, h: 13 },
  ], g), { ground: 0, detail })
  // the plant yard's three cooling-tower drums
  for (const x of [-334, -322, -310]) {
    lathe(p.trim, x, 8, [[5, 14 - g], [5, 25.5 - g], [4.6, 26.5 - g]], detail ? 16 : 10)
    lathe(p.metal, x, 8, [[4.6, 26.5 - g], [0.01, 26.6 - g]], detail ? 16 : 10)
  }
  plantClusters(p.metal, [-288, -330], [-288, -40], 19.5 - g, 11, { detail })
  plantClusters(p.metal, [-288, 130], [-288, 390], 13 - g, 12, { detail })
  jetBridges(p.metal, p.metal, jetsOf(JETS, OUTLINES, 0), 6.5 - g, detail)
  return p
}

/** Concourse A, apron 2 m above the box's lowest ground. */
function buildA(detail: boolean) {
  const p = newConcourseParts(), g = 2
  concourse(p, A, on([
    { y0: -390, y1: -353, h: 8.5 },
    { y0: -353, y1: -52, h: 12 },
    { y0: -52, y1: -1, h: 17 },
    { y0: -1, y1: 37, x1: -2.1, h: 17 },
    { y0: -1, y1: 37, x0: -2.1, x1: 25.6, h: 12 },
    { y0: 37, y1: 345, h: 12 },
  ], g), { ground: 0, detail })
  box(p.wall, p.pale, rect(6, -42, 22, -30), 17 - g, 24 - g, 0.3)
  // the hub's east wing: a pale five-storey block with window bands and red
  // accent panels (photo from the north-north-west), and its tower
  hubTower(p, clean(clip(clip(clip(A, -1, 0, -25.6), 0, -1, 1), 0, 1, 37), 0.2), 0, 22 - g, { red: [0, 1], detail, wallFrom: 0 })
  hubTower(p, rect(26, 20, 48, 34), 22 - g, 35 - g, { red: [-1, 0], detail })
  box(p.wall, p.pale, rect(-38, 22, -26, 30), 17 - g, 21 - g, 0.3)
  plantClusters(p.metal, [12, -340], [12, -60], 12 - g, 21, { detail })
  plantClusters(p.metal, [12, 45], [12, 335], 12 - g, 22, { detail })
  jetBridges(p.metal, p.metal, jetsOf(JETS, OUTLINES, 1), 6.5 - g, detail)
  return p
}

/** Concourse B, apron 1 m above the box's lowest ground. */
function buildB(detail: boolean) {
  const p = newConcourseParts(), g = 1
  concourse(p, B, on([
    { y0: -365, y1: -56, h: 11 },
    { y0: -56, y1: -22, h: 12 },
    { y0: -22, y1: 17, h: 12 },
    { y0: 60, y1: 96, h: 12 },
    { y0: 96, y1: 124, h: 17 },
    { y0: 124, y1: 345, h: 12 },
  ], g), { ground: 0, detail })
  hubTower(p, clean(clip(clip(B, 0, -1, -17), 0, 1, 60), 0.2), 0, 23 - g, { red: [0, -1], detail, wallFrom: 0 })
  box(p.wall, p.pale, rect(300, 24, 336, 44), 23 - g, 26 - g, 0.3)
  box(p.wall, p.pale, rect(284, -20, 300, -12), 12 - g, 17 - g, 0.3)
  box(p.wall, p.pale, rect(340, -24, 348, -12), 12 - g, 17 - g, 0.3)
  hubTower(p, rect(302, -20, 312, 8), 12 - g, 21.5 - g, { red: 1, detail })
  plantClusters(p.metal, [315, -350], [315, -60], 11 - g, 31, { detail })
  plantClusters(p.metal, [315, 130], [315, 335], 12 - g, 32, { detail })
  jetBridges(p.metal, p.metal, jetsOf(JETS, OUTLINES, 2), 6.5 - g, detail)
  return p
}

/** Each model: id, name, builder, its anchor in the site frame. */
const MODELS: Array<[string, string, (detail: boolean) => ReturnType<typeof newConcourseParts>, XY]> = [
  ['atl-hartsfield-jackson-concourse-t', 'Hartsfield-Jackson Concourse T', buildT, [-297.81, 25.21]],
  ['atl-hartsfield-jackson-concourse-a', 'Hartsfield-Jackson Concourse A', buildA, [11.42, -30.47]],
  ['atl-hartsfield-jackson-concourse-b', 'Hartsfield-Jackson Concourse B', buildB, [314.88, 1.21]],
]

if (import.meta.main) {
  for (const [id, name, build, [ox, oy]] of MODELS) {
    for (const detail of [false, true]) {
      const p = build(detail)
      if (process.env.STATS) console.log(id, detail, Object.entries(p).map(([k, v]) => `${k}=${v.triangles}`).join(' '))
      const parts = moveTo(concourseMaterials(p), ox, oy)
      const o = { bearing: 0, height: topOf(parts) }
      if (detail) await writeModel(`${id}.detail.glb`, name, parts, { ...o, maxTris: 40_000, maxBytes: 1536 * 1024 })
      else await writeModel(`${id}.glb`, name, parts, { ...o, maxTris: 8000, maxBytes: 250_000 })
    }
  }
}
