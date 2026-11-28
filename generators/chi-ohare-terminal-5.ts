/**
 * Chicago O'Hare International Airport (ORD): Terminal 5, the international
 * terminal (1993, Perkins & Will), with Concourse M's two arms and the 2022
 * expansion at its east end (O'Hare 21) — procedural, CC0-1.0, no textures.
 *
 *   bun generators/chi-ohare-terminal-5.ts
 *
 * Writes models/chi-ohare-terminal-5.glb (low) and .detail.glb (jet bridge
 * legs and cabs, mullion groups). Uses the ORD kit in chi-ohare-terminal-2.ts.
 *
 * Map frame: x east, y north, z up, metres; bearing 0. Anchor = area
 * centroid of relation/20178000 (the joined outer ways 4375988 and
 * 1474526116): -87.8886172, 41.9746444.
 *
 * Identity (photos): a long curved main hall facing the roadway, its tall
 * landside wall a sea-green glass curtain under a flat roof, lower pale
 * blocks stepping down to the apron; Concourse M's two flat pale arms (one
 * north-west, one east) with a raised spine; and, since 2022, the east
 * end's white roof sweeping up at the corner and turning north.
 *
 * Evidence
 * - OSM: relation/20178000 (Terminal 5, outer ways 4375988 + 1474526116,
 *   joined), relation/20178001 (building:part "Terminal 5 Expansion":
 *   1474526115 + 1474526116), way/1027671940 (building=roof: the forecourt
 *   canopy), way/1027319926 and way/1027694184 (Concourse M's west and east
 *   ramp control towers), the small jet-bridge rotundas and stands under
 *   the bridge stubs; 24 aeroway=jet_bridge ways drawn. No heights in OSM.
 * - Lidar: USGS 3DEP USGS_LPC_IL_4County_Cook_2017_LAS_2019 (2017: before
 *   the expansion, which it does not show), 1 m grid, heights above the
 *   apron (198.0 m), traced in this frame:
 *   arms 9.3 m (8.5 m on the far side) with a 12–13 m wide spine at 13.3 m;
 *   the hall's glass landside block 21.6 m (an 18 m band along the curve),
 *   an airside roof band 14.1 m (36 m), the rest 9.3 m; a 19.1 m block at
 *   the north-west arm's root; the canopy 9.2 m.
 * - The expansion (no lidar; built 2019–22): the arm's 9.3/13.3 m section
 *   carried on to the east end (photo-matched to the old arm); the east
 *   block's white roof, overhanging 3.5 m, rising from 13.3 m to an estimated 24 m at the
 *   south-east corner (At_Chicago_2024_108: the swept corner stands about
 *   as high as the main hall's glass wall), falling to about 13 m at the north
 *   end of the wing. Estimated, not measured.
 * - Ground: the map's terrain dips to a lower road along the hall's
 *   landside; the apron is about 6.9 m above the lowest terrain under the
 *   outline (terrain grid), so every height here stands on G0 = 6.9 m and
 *   the walls run down to y = 0 as STYLE.md asks. The model's base below
 *   the apron is hidden in the ground on the apron side.
 * - Photos: Chicago O'Hare Terminal 5 Aerial, formulanone, CC BY-SA 2.0
 *     https://www.flickr.com/photos/formulanone/49972571983 (from the
 *     south-west: hall, glass wall, arms, colours);
 *   At_Chicago_2024_107.jpg and At_Chicago_2024_108.jpg, Mike Peel,
 *     CC BY-SA 4.0 (2024: the expansion's white swept roof from the north);
 *   Terminal_5_Concourse..._(54599542592).jpg, Warren LeMay, CC BY-SA 4.0
 *     (inside the 2022 concourse: white ceiling, glass).
 *   USGS NAIP for the plan.
 * - Colours: pale grey walls, white roofs and the expansion's white roof,
 *   pale sea-green glass on the hall (lit), grey flat roofs.
 * Doubts: the expansion's roof shape and heights are estimated from two
 *   distant oblique photos; its north wing's use (likely the new
 *   arrivals/FIS block) is not documented here.
 */
import { box, panelRow, writeModel, clean, clip, type XY } from './atl-hartsfield-jackson-domestic-terminal'
import { triangulate, inset } from './clt-terminal'
import { newParts, body, raised, canopy, bridges, rampTower, materials, clipToRect, type Parts, type Block } from './chi-ohare-terminal-2'
import { windowVariant, finish } from './palette'
import { Part } from './mesh'

// OSM data for T5, local frame (turned to the bearing 0): x model east, y model north, metres from the anchor -87.8886172, 41.9746444
export const ANCHOR = { lng: -87.8886172, lat: 41.9746444 }
export const OSM: Record<string, XY[]> = {
  'relation/20178000': [[293.0,-54.9],[290.0,-54.8],[233.6,-61.8],[196.1,-61.9],[-30.3,-62.3],[-32.0,-60.1],[-34.3,-58.4],[-37.1,-57.6],[-40.0,-57.6],[-42.4,-58.4],[-48.8,-51.9],[-54.7,-45.8],[-69.8,-31.0],[-72.4,-28.4],[-75.3,-25.6],[-84.5,-16.7],[-96.0,-5.4],[-98.7,-2.8],[-101.7,0.1],[-121.8,20.0],[-124.4,22.5],[-127.6,25.7],[-147.7,45.7],[-150.7,48.5],[-153.4,51.4],[-173.4,71.2],[-176.3,74.1],[-179.1,76.9],[-190.5,88.6],[-199.2,97.4],[-201.9,100.1],[-204.5,102.8],[-214.3,112.5],[-234.3,131.8],[-233.4,134.2],[-233.3,136.8],[-233.7,138.9],[-234.6,140.8],[-236.0,142.5],[-237.7,143.7],[-239.6,144.6],[-241.7,144.9],[-287.0,248.2],[-295.4,266.8],[-294.2,267.4],[-317.7,318.3],[-318.6,320.1],[-326.4,316.5],[-330.0,324.1],[-330.8,323.7],[-334.2,331.2],[-337.5,338.4],[-341.9,347.9],[-341.6,348.8],[-341.4,349.7],[-341.5,350.9],[-341.7,352.0],[-342.1,352.7],[-342.4,353.2],[-343.4,354.2],[-344.4,354.8],[-345.8,355.2],[-347.6,355.1],[-348.2,354.9],[-348.8,354.7],[-350.1,353.6],[-350.8,352.2],[-351.1,350.5],[-350.9,349.0],[-350.2,347.8],[-348.9,346.6],[-347.5,346.0],[-343.7,338.0],[-336.5,321.1],[-337.7,320.6],[-335.5,316.1],[-335.0,314.9],[-334.3,313.5],[-333.7,312.4],[-333.0,310.9],[-334.1,310.4],[-335.0,310.1],[-335.5,311.1],[-339.3,309.4],[-330.6,289.2],[-331.2,288.9],[-330.8,288.1],[-330.4,287.0],[-330.1,286.3],[-330.0,286.0],[-329.6,285.3],[-329.0,285.5],[-328.3,284.2],[-324.2,286.0],[-317.7,272.1],[-317.3,271.1],[-316.8,270.1],[-316.0,268.2],[-315.5,267.2],[-315.0,266.0],[-312.9,261.3],[-317.3,259.4],[-308.2,239.3],[-308.8,239.0],[-308.5,238.4],[-308.1,237.3],[-307.7,236.3],[-307.3,235.4],[-306.6,235.7],[-305.9,234.3],[-301.6,236.2],[-290.7,211.4],[-294.8,209.4],[-285.9,189.5],[-286.4,189.2],[-285.6,187.3],[-284.8,185.6],[-284.2,185.9],[-283.5,184.3],[-279.3,186.2],[-278.8,185.1],[-278.4,184.2],[-277.9,183.1],[-263.7,151.2],[-256.0,134.0],[-256.8,126.7],[-257.5,122.7],[-258.6,112.4],[-259.0,100.6],[-258.8,91.7],[-258.6,89.3],[-258.4,86.1],[-257.5,78.8],[-257.2,76.3],[-257.0,74.6],[-256.8,73.7],[-256.7,72.7],[-256.5,71.6],[-256.3,70.7],[-256.1,69.5],[-254.2,59.7],[-252.6,56.2],[-274.2,34.4],[-271.8,27.3],[-270.6,24.4],[-269.3,21.2],[-266.3,14.0],[-261.3,4.0],[-255.7,-6.3],[-251.6,-13.3],[-249.4,-16.6],[-253.0,-19.8],[-246.0,-29.2],[-249.1,-32.1],[-249.8,-33.1],[-250.6,-34.3],[-260.5,-46.6],[-259.2,-48.0],[-261.6,-51.0],[-259.4,-52.9],[-260.4,-54.0],[-258.9,-55.5],[-258.1,-56.1],[-257.1,-57.0],[-256.0,-58.0],[-255.0,-57.0],[-254.1,-57.8],[-246.0,-66.1],[-242.8,-69.3],[-239.5,-72.8],[-230.5,-81.7],[-231.4,-82.7],[-230.0,-84.0],[-229.1,-84.8],[-228.4,-85.5],[-226.9,-86.9],[-225.9,-85.7],[-223.8,-87.7],[-221.5,-85.7],[-219.7,-86.9],[-207.4,-77.0],[-206.8,-76.4],[-205.9,-75.8],[-205.0,-75.2],[-204.4,-74.5],[-203.6,-73.9],[-201.8,-73.1],[-192.5,-79.7],[-189.8,-75.9],[-171.7,-86.6],[-154.1,-94.6],[-137.6,-100.8],[-121.4,-85.0],[-120.6,-84.2],[-119.8,-83.5],[-118.6,-82.5],[-101.8,-85.5],[-100.5,-87.9],[-89.6,-89.9],[-83.4,-91.0],[-73.3,-92.6],[-75.3,-89.7],[-74.3,-88.9],[-77.1,-85.0],[-66.5,-85.4],[-57.6,-84.5],[-56.3,-84.4],[-55.3,-84.3],[-47.4,-83.3],[-35.2,-81.2],[-26.1,-79.7],[6.6,-79.4],[6.7,-84.1],[28.8,-84.1],[28.8,-84.7],[29.8,-84.7],[30.9,-84.7],[31.9,-84.7],[32.8,-84.7],[32.8,-84.0],[34.4,-84.0],[34.4,-79.4],[70.7,-79.2],[70.7,-83.8],[92.8,-83.9],[92.8,-84.6],[93.5,-84.6],[94.8,-84.6],[95.9,-84.6],[96.7,-84.6],[96.7,-83.9],[98.3,-83.9],[98.3,-79.2],[134.5,-79.1],[134.6,-83.8],[156.7,-83.8],[156.7,-84.4],[157.5,-84.4],[158.7,-84.5],[159.7,-84.5],[160.7,-84.5],[160.6,-83.8],[162.2,-83.8],[162.2,-79.1],[198.4,-78.9],[198.4,-83.7],[220.6,-83.6],[220.7,-84.4],[221.5,-84.4],[222.5,-84.4],[223.4,-84.4],[224.5,-84.4],[224.5,-83.6],[226.1,-83.6],[226.2,-82.7],[226.2,-80.7],[226.1,-78.9],[228.5,-78.9],[229.4,-78.9],[230.2,-78.9],[252.3,-78.9],[254.2,-78.9],[262.3,-78.8],[262.3,-83.6],[288.4,-83.6],[289.7,-86.3],[292.2,-87.5],[295.9,-88.0],[296.9,-87.7],[297.9,-87.5],[300.1,-86.8],[302.1,-85.9],[304.6,-84.0],[304.5,-78.2],[369.4,-77.8],[373.7,-84.7],[374.8,-84.6],[376.1,-84.6],[377.1,-84.6],[393.7,-84.4],[395.6,-84.4],[395.5,-77.3],[450.2,-76.9],[455.2,-84.3],[462.8,-84.3],[464.1,-84.2],[465.1,-84.2],[478.2,-84.1],[478.2,-77.1],[515.1,-77.1],[516.0,-77.1],[517.0,-77.1],[521.8,-77.0],[522.9,-77.0],[523.9,-77.0],[526.7,-76.9],[533.9,-68.4],[533.4,-65.8],[533.2,-64.8],[533.0,-64.0],[532.1,-59.2],[531.9,-58.2],[531.7,-57.2],[523.2,-21.4],[529.5,-19.7],[529.2,-18.5],[529.0,-17.6],[528.9,-17.0],[528.7,-15.8],[528.4,-14.8],[528.2,-13.9],[524.7,2.0],[518.7,4.2],[505.3,58.4],[510.2,65.3],[509.9,67.1],[509.8,67.9],[509.5,68.8],[508.6,72.9],[508.3,73.7],[508.1,74.7],[505.3,86.1],[498.9,84.7],[498.4,86.3],[498.1,87.4],[497.9,88.2],[497.0,92.2],[483.5,75.4],[478.4,69.0],[487.6,30.1],[478.8,27.9],[482.7,11.5],[491.4,13.9],[491.7,8.0],[490.3,4.2],[485.2,-2.3],[480.7,-7.9],[476.6,-13.0],[472.4,-9.6],[464.0,-20.1],[461.2,-23.6],[458.3,-27.2],[455.4,-30.9],[459.4,-34.1],[454.7,-40.3],[448.0,-49.1],[443.8,-52.3],[440.1,-53.8],[436.8,-54.1],[436.9,-46.0],[419.5,-46.1],[419.8,-54.4],[327.4,-54.8],[327.4,-46.2],[310.1,-46.4],[310.1,-54.8]],
  'relation/20178001': [[293.0,-54.9],[293.0,-78.3],[288.3,-78.3],[288.4,-83.6],[289.7,-86.3],[292.2,-87.5],[295.9,-88.0],[296.9,-87.7],[297.9,-87.5],[300.1,-86.8],[302.1,-85.9],[304.6,-84.0],[304.5,-78.2],[369.4,-77.8],[373.7,-84.7],[374.8,-84.6],[376.1,-84.6],[377.1,-84.6],[393.7,-84.4],[395.6,-84.4],[395.5,-77.3],[450.2,-76.9],[455.2,-84.3],[462.8,-84.3],[464.1,-84.2],[465.1,-84.2],[478.2,-84.1],[478.2,-77.1],[515.1,-77.1],[516.0,-77.1],[517.0,-77.1],[521.8,-77.0],[522.9,-77.0],[523.9,-77.0],[526.7,-76.9],[533.9,-68.4],[533.4,-65.8],[533.2,-64.8],[533.0,-64.0],[532.1,-59.2],[531.9,-58.2],[531.7,-57.2],[523.2,-21.4],[529.5,-19.7],[529.2,-18.5],[529.0,-17.6],[528.9,-17.0],[528.7,-15.8],[528.4,-14.8],[528.2,-13.9],[524.7,2.0],[518.7,4.2],[505.3,58.4],[510.2,65.3],[509.9,67.1],[509.8,67.9],[509.5,68.8],[508.6,72.9],[508.3,73.7],[508.1,74.7],[505.3,86.1],[498.9,84.7],[498.4,86.3],[498.1,87.4],[497.9,88.2],[497.0,92.2],[483.5,75.4],[478.4,69.0],[487.6,30.1],[478.8,27.9],[482.7,11.5],[491.4,13.9],[491.7,8.0],[490.3,4.2],[485.2,-2.3],[480.7,-7.9],[476.6,-13.0],[472.4,-9.6],[464.0,-20.1],[461.2,-23.6],[458.3,-27.2],[455.4,-30.9],[459.4,-34.1],[454.7,-40.3],[448.0,-49.1],[443.8,-52.3],[440.1,-53.8],[436.8,-54.1],[436.9,-46.0],[419.5,-46.1],[419.8,-54.4],[327.4,-54.8],[327.4,-46.2],[310.1,-46.4],[310.1,-54.8]],
  'way/1027671940': [[-149.1,55.4],[-142.9,61.2],[-163.1,81.4],[-169.2,75.2],[-173.4,71.2],[-176.3,74.1],[-179.1,76.9],[-176.2,79.8],[-168.7,87.3],[-189.1,107.7],[-189.7,107.1],[-199.2,97.4],[-201.9,100.1],[-204.5,102.8],[-194.8,112.7],[-193.5,114.1],[-192.1,115.5],[-126.5,50.0],[-124.8,48.3],[-122.8,46.4],[-57.4,-18.2],[-59.1,-20.0],[-69.8,-31.0],[-72.4,-28.4],[-75.3,-25.6],[-65.2,-15.4],[-85.6,4.5],[-93.0,-2.6],[-96.0,-5.4],[-98.7,-2.8],[-101.7,0.1],[-97.5,4.2],[-91.5,10.5],[-111.4,30.0],[-117.5,24.0],[-123.3,29.9],[-117.4,35.7],[-118.2,36.5],[-127.4,45.7],[-136.7,54.9],[-137.6,55.8],[-143.5,49.8]],
  'way/1027319926': [[-198.9,-23.6],[-196.7,-25.7],[-201.1,-30.1],[-203.3,-28.0]],
  'way/1027694184': [[288.3,-78.3],[288.4,-83.6],[289.7,-86.3],[292.2,-87.5],[295.9,-88.0],[296.9,-87.7],[297.9,-87.5],[300.1,-86.8],[301.2,-85.3],[301.9,-83.7],[301.8,-78.4],[293.0,-78.3]],
}
/** aeroway=jet_bridge ways touching the outlines, building end first */
export const JET_BRIDGES: XY[][] = [[[-348.2,354.9],[-352.1,363.8],[-372.6,391.0],[-382.4,383.7],[-381.7,365.5]],[[-330.4,287.0],[-331.4,286.7],[-344.3,316.5],[-347.8,315.0],[-347.6,297.8]],[[-317.3,271.1],[-327.3,267.5],[-334.0,283.8],[-336.6,282.9],[-351.8,273.4]],[[-335.0,314.9],[-336.3,314.3],[-356.5,358.7],[-361.8,356.6],[-361.9,340.7]],[[30.9,-84.7],[35.9,-113.9]],[[-56.3,-84.4],[-41.3,-101.7]],[[-206.8,-76.4],[-205.6,-77.4],[-208.1,-88.5],[-220.9,-101.3],[-220.4,-102.4],[-223.0,-119.7]],[[-229.1,-84.8],[-231.9,-87.1],[-246.3,-84.2],[-246.4,-84.8],[-256.8,-101.4]],[[-258.1,-56.1],[-281.3,-81.8]],[[-249.8,-33.1],[-273.4,-24.1]],[[-256.8,73.7],[-273.2,80.9],[-298.2,76.4]],[[-256.3,70.7],[-266.7,75.4],[-282.6,59.9]],[[-278.4,184.2],[-284.0,181.8],[-287.8,189.9],[-291.3,188.6],[-293.1,170.5]],[[-308.1,237.3],[-308.9,204.9]],[[-315.5,267.2],[-322.0,263.9],[-328.2,240.0]],[[-120.6,-84.2],[-119.4,-87.6],[-114.1,-109.9]],[[-204.4,-74.5],[-202.1,-77.0],[-203.9,-84.4],[-191.5,-114.4]],[[-263.7,151.2],[-283.2,122.0]],[[302.1,-85.9],[307.0,-107.7]],[[222.5,-84.4],[222.6,-85.4],[229.5,-85.5],[229.5,-86.2],[229.6,-87.3],[230.0,-108.6]],[[158.7,-84.5],[173.3,-97.3]],[[94.8,-84.6],[102.4,-106.1]],[[376.1,-84.6],[374.4,-95.3],[374.2,-119.5]],[[296.9,-87.7],[298.7,-97.8],[289.2,-114.7]]]
/** Lidar-traced raised roofs per outline: body height and blocks (rectangle in this frame, height). */
export const REGIONS: Record<string, { body: number; regions: Block[] }> = {
}

const G0 = 6.9 // the apron above the model's y = 0 (terrain check: apron cells 6.5–7.5 m over the lowest point, the lower road)
const Z = (h: number) => G0 + h
const C0: XY = [-150, 0], U: XY = [0.7314, -0.682], V: XY = [-0.682, -0.7314]
const hallRect = (s0: number, s1: number, v0: number, v1: number): XY[] => [[s0, v0], [s1, v0], [s1, v1], [s0, v1]].map(([s, v]) => [C0[0] + U[0] * s + V[0] * v, C0[1] + U[1] * s + V[1] * v] as XY)
const strip = (a: XY, b: XY, w: number): XY[] => { const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n: XY = [(b[1] - a[1]) / L * w / 2, -(b[0] - a[0]) / L * w / 2]; return [[a[0] - n[0], a[1] - n[1]], [b[0] - n[0], b[1] - n[1]], [b[0] + n[0], b[1] + n[1]], [a[0] + n[0], a[1] + n[1]]] }

/** A block over `ring` whose roof follows h(x, y): walls to it, the roof triangulated on it. */
function sloped(P: Parts, ring0: XY[], h: (p: XY) => number, wall: typeof P.wall, roof: typeof P.roof) {
  const r = clean(ring0, 0.8)
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    wall.quad([a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], h(b)], [a[0], a[1], h(a)])
  }
  // the roof: a 0.9 m slab following h, overhanging the walls by 3.5 m all round
  const o = inset(r, -3.5), t = 0.9
  for (const [i, j, k] of triangulate(o)) {
    roof.tri([o[i][0], o[i][1], h(r[i])], [o[j][0], o[j][1], h(r[j])], [o[k][0], o[k][1], h(r[k])])
    roof.tri([o[i][0], o[i][1], h(r[i]) - t], [o[k][0], o[k][1], h(r[k]) - t], [o[j][0], o[j][1], h(r[j]) - t])
  }
  for (let i = 0; i < o.length; i++) { const j = (i + 1) % o.length; roof.quad([o[i][0], o[i][1], h(r[i]) - t], [o[j][0], o[j][1], h(r[j]) - t], [o[j][0], o[j][1], h(r[j])], [o[i][0], o[i][1], h(r[i])]) }
  return r
}

export function build(detail: boolean) {
  const P = newParts(), G2 = new Part() // the hall's and the expansion's sea-green glass walls (lit at night)
  const T5 = OSM['relation/20178000'], EXP = OSM['relation/20178001']
  // the 1993 terminal: everything west of the expansion
  const old = clean(clip(T5, 1, 0, 293.0), 0.4)
  body(P, old, Z(9.3), { detail, band: [Z(4.2), Z(7.6)] })
  // Concourse M spines
  raised(P, old, { h: Z(13.3), rect: strip([-336, 326], [-252, 148], 12.5) }, Z(9.3), { wall: P.wall, glaze: [Z(10.0), Z(12.4)], detail })
  raised(P, old, { h: Z(13.3), rect: [[-2.4, -68.3], [294.6, -68.3], [294.6, -81.3], [-2.4, -81.3]] }, Z(9.3), { wall: P.wall, glaze: [Z(10.0), Z(12.4)], detail })
  // the main hall: airside roof band, the block by the north-west arm, the glass hall
  raised(P, old, { h: Z(14.1), rect: hallRect(-125, 95, 6, 45) }, Z(9.3), { wall: P.wall, glaze: [Z(10.0), Z(13.2)], detail })
  raised(P, old, { h: Z(19.1), rect: [[-179.3, 3.8], [-167.2, -7.5], [-197.3, -39.7], [-209.4, -28.5]] }, Z(9.3), { wall: P.wall, detail })
  {
    const rect: XY[] = [[-190.9, 84.6], [-83.5, -15.6], [-100.7, -34.0], [-208.1, 66.1]]
    const r0 = clipToRect(old, rect)
    const r = clean(r0, detail ? 0.4 : 1.2)
    box(P.wall, P.roof, r, Z(9.0), Z(21.6), detail ? 0.4 : 0)
    // the tall glass curtain: broad sea-green panels between thin piers, the whole height
    for (let i = 0; i < r.length; i++) {
      const a = r[i], b = r[(i + 1) % r.length]
      if (Math.hypot(b[0] - a[0], b[1] - a[1]) < 6) continue
      panelRow(G2, a, b, Z(9.6), Z(20.6), { bay: detail ? 4 : 9, gap: 0.5, end: 0.5 })
    }
  }
  // --- the 2022 expansion: the arm carried on east, the swept east block
  {
    const arm = clean(clip(EXP, 1, 0, 440), 0.4)
    body(P, arm, Z(9.3), { detail, band: [Z(4.2), Z(7.6)] })
    raised(P, arm, { h: Z(13.3), rect: [[290, -68.3], [441, -68.3], [441, -81.3], [290, -81.3]] }, Z(9.3), { wall: P.wall, glaze: [Z(10.0), Z(12.4)], detail })
    const east = clean(clip(EXP, -1, 0, -440), 0.4)
    const h = (p: XY) => {
      const t = Math.max(0, Math.min(1, (p[0] - 440) / 94)), n = Math.max(0, Math.min(1, (p[1] + 80) / 172))
      return Z(13.3 + 11 * Math.pow(t, 1.5) * (1 - 0.75 * n) - 1.5 * n)
    }
    const r = sloped(P, east, h, P.wall, P.trim)
    for (let i = 0; i < r.length; i++) {
      const a = r[i], b = r[(i + 1) % r.length]
      if (Math.hypot(b[0] - a[0], b[1] - a[1]) < 8) continue
      panelRow(G2, a, b, Z(1.0), Math.min(h(a), h(b)) - 1.6, { bay: detail ? 4 : 9, gap: 0.6, end: 0.8 })
    }
  }
  // Concourse M's ramp control towers: the west one (lidar 26.9 m), the
  // east one built with the expansion (no lidar; 24 m estimated from the
  // 2024 photo, where it stands about twice the concourse's height)
  rampTower(P, OSM['way/1027319926'], Z(26.9), P.wall)
  rampTower(P, OSM['way/1027694184'], Z(24), P.wall)
  canopy(P, OSM['way/1027671940'], Z(9.2), { step: detail ? 12 : 22 })
  bridges(P, JET_BRIDGES, Z(3.8), detail)
  // T5's roofs read white in the 2024 photos, not the 1962 terminals' grey
  return [...materials(P).map((m) => (m.part === P.roof ? { part: m.part, material: finish('ord-t5-roof', 0xdfe1df) } : m)), { part: G2, material: windowVariant(3, 0x9fc4c0) }]
}

if (import.meta.main) {
  const o = { bearing: 0, height: Z(22) }
  await writeModel('chi-ohare-terminal-5.glb', "O'Hare Terminal 5", build(false), { ...o, maxTris: 8000, maxBytes: 250_000 })
  await writeModel('chi-ohare-terminal-5.detail.glb', "O'Hare Terminal 5", build(true), { ...o, maxTris: 40_000, maxBytes: 1536 * 1024 })
}
