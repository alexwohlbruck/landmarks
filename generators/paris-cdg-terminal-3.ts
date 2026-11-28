/**
 * Paris-Charles de Gaulle Airport, Terminal 3 (formerly T9; the simple
 * terminal for charter and low-cost flights, beside Roissypôle): two long,
 * low glass sheds, departures and arrivals, under flat dark roofs, with a
 * long kerbside canopy whose edge is cut into a row of shallow arcs —
 * procedural, CC0-1.0, no textures.
 * bun generators/paris-cdg-terminal-3.ts
 *
 * Map frame: x = east, y = north, z up, metres. Bearing 0. Anchor: the
 * area-weighted centroid of the outlines replaced (2.5587447, 49.0129555).
 * y = 0 is the lowest ground under the footprint (terrain flat to ±0.6 m).
 *
 * Identifying features (photos): low, wide, dark-roofed sheds of glass and
 * steel; the long canopy over the kerb on the landside, its edge scalloped
 * in arcs; a narrow canopy along the airside; apron stands without jet
 * bridges (buses and stairs).
 *
 * Evidence
 * - OSM (API map call, November 2026): departures relation/8051748 ("Terminal
 *   3 (départs)", outers way/5739168, way/177843683 and the kerbside canopy
 *   way/563910587 (wall=no), inner way/401466099, a court, roofed over
 *   here); arrivals way/177843713; canopies way/177843714, way/563910586,
 *   way/563910591 (building=roof).
 * - Photos (Wikimedia Commons):
 *   https://commons.wikimedia.org/wiki/File:CDG_Terminal_3_(18575829911).jpg
 *     (Charles from Port Chester, CC BY 2.0) the landside from the west,
 *     over the road: the dark roofs, the scalloped kerbside canopy, glass
 *     walls and columns;
 *   https://commons.wikimedia.org/wiki/File:Vueling_Airbus_A_320_at_Paris_Charles_De_Gaulle_airport,_terminal_3.jpg
 *     (Guillaume de Syon, CC BY-SA 4.0) on the apron: low glazed walls.
 *
 * Numbers (estimated from the landside photo against cars and buses):
 * sheds 9 m to the roof, glass to 7 m; kerbside canopy level with the roof (8.2–9 m), its
 * arcs ~26 m long and 8 m deep; airside canopy 5 m.
 * Doubts: only two licensed photos, both at ground level; the roofs' plant
 * and skylights are unseen and left plain.
 */
import { type XY, capPoly } from './nyc-570-lexington'
import { prismRing, writeLod, newMats, ccw, simplify, type Mats } from './tokyo-haneda-terminal-1'
import { CDG, glassBlock } from './paris-cdg-terminal-1'

const ROOF = 9

/** A slab on round posts: `ring` at z0…z1, posts every `every` metres along its long side. */
function canopy(M: Mats, ring: XY[], z0: number, z1: number, posts: XY[]) {
  prismRing(M.white, ring, z0, z1, M.roof, M.white)
  for (const [x, y] of posts) prismRing(M.metal, Array.from({ length: 6 }, (_, k) => [x + 0.35 * Math.cos((k * Math.PI) / 3), y + 0.35 * Math.sin((k * Math.PI) / 3)] as XY), 0, z0, null)
}

function build(detail: boolean) {
  const M: Mats = newMats(['con', 'roof', 'win', 'white', 'metal'])
  const S = { wall: M.con, win: M.win, trim: M.white, roof: M.roof }
  for (const r of [DEP, DEP_B, ARR]) {
    glassBlock(S, simplify(ccw(r), 0.5), 0, ROOF, { fascia: 2, sill: 0.4, bay: detail ? 6 : 12 })
  }
  // the kerbside canopy: the inner edge on the building, the outer edge cut into arcs
  {
    const c = ccw(CANOPY.concat(ROOF14.slice(1)))
    // outer (west) edge from the canopy's south-west corner to its north-west corner
    const a: XY = [-57.4, -136.0], b: XY = [-74.2, 67.0], ia: XY = [-35.2, -134.2], ib: XY = [-52.0, 68.8]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], inw: XY = [u[1], -u[0]]
    const arcs = Math.round(L / 26), seg = detail ? 8 : 5
    const edge: XY[] = []
    for (let k = 0; k < arcs; k++) for (let j = 0; j < seg; j++) {
      const t = (k + j / seg) / arcs, d = 8 * Math.sin(Math.PI * (j / seg))
      edge.push([a[0] + u[0] * L * t + inw[0] * d, a[1] + u[1] * L * t + inw[1] * d])
    }
    edge.push(b)
    const ring: XY[] = [ia, ...edge.slice().reverse().map((p) => p), ib].reverse()
    const posts: XY[] = []
    for (let k = 0; k <= arcs; k++) { const t = k / arcs; posts.push([a[0] + u[0] * L * t + inw[0] * 1.2, a[1] + u[1] * L * t + inw[1] * 1.2]) }
    canopy(M, ccw([ib, ia, ...edge]), ROOF - 0.8, ROOF, posts)
    void c
  }
  canopy(M, ROOF14, ROOF - 0.8, ROOF, [])
  canopy(M, ROOF86, 5.2, 5.8, [])
  canopy(M, simplify(ccw(ROOF91), 0.4), 5.2, 5.8, [])
  return [
    { part: M.con, material: CDG.concrete },
    { part: M.roof, material: CDG.deck },
    { part: M.win, material: CDG.window },
    { part: M.white, material: CDG.white },
    { part: M.metal, material: CDG.metal },
  ]
}

// ===========================================================================
// OSM data, in this frame (bearing 0, anchor 2.5587447, 49.0129555)
// ===========================================================================
/** way/5739168 */
const DEP: XY[] = [[-33.6,-103.7],[8.7,-100.4],[8.9,-102.4],[12.3,-144.9],[70.9,-140.2],[67.3,-95.5],[63.5,-48.6],[61.8,-28.1],[59.3,3.0],[56.5,38.5],[-2.6,33.8],[-3.3,43.1],[-15.1,42.2],[-16.0,52.5],[-46.0,50.1]]
/** way/177843683 */
const DEP_B: XY[] = [[-31.2,-139.4],[-33.7,-109.1],[-2.8,-106.6],[-0.4,-136.9]]
/** way/563910587 */
const CANOPY: XY[] = [[-57.4,-136.0],[-35.2,-134.2],[-52.0,68.8],[-74.2,67.0]]
/** way/401466099 */
const HOLE: XY[] = [[-27.2,10.0],[-27.7,15.9],[-13.1,17.0],[-14.5,35.8],[-10.0,36.2],[-8.6,17.5],[-7.7,17.6],[-7.2,11.4]]
/** way/177843713 */
const ARR: XY[] = [[-30.6,115.5],[-28.6,90.5],[-10.9,91.9],[23.0,94.7],[36.1,95.7],[51.7,96.9],[51.4,100.1],[48.1,140.5],[47.7,144.6],[47.4,148.6],[46.8,156.6],[46.5,160.4],[46.1,164.4],[45.0,178.4],[17.0,176.1],[-17.2,173.4],[-35.2,171.8],[-35.3,174.0],[-48.9,173.1],[-45.9,137.2],[-44.2,114.7]]
/** way/177843714 */
const ROOF14: XY[] = [[-74.2,67.0],[-81.7,66.4],[-88.8,65.8],[-88.3,59.9],[-86.6,38.2],[-83.9,38.2],[-79.4,36.9],[-78.5,36.0],[-75.5,33.1],[-73.6,29.5],[-73.1,24.9],[-74.0,21.6],[-76.6,17.4],[-79.4,15.0],[-84.6,13.5],[-83.0,-3.2],[-80.9,-3.3],[-76.4,-4.4],[-72.6,-7.2],[-70.8,-10.7],[-69.8,-16.6],[-70.5,-20.3],[-72.8,-23.7],[-75.3,-25.7],[-81.1,-27.9],[-79.9,-43.8],[-76.0,-43.7],[-71.8,-45.6],[-69.1,-48.0],[-66.9,-52.0],[-66.5,-56.9],[-67.7,-60.9],[-70.2,-64.1],[-74.9,-67.1],[-77.8,-67.5],[-76.4,-84.4],[-73.0,-84.6],[-69.4,-85.8],[-66.0,-88.7],[-63.6,-92.9],[-63.1,-98.1],[-64.2,-101.3],[-66.0,-104.5],[-68.5,-107.0],[-70.2,-107.9],[-74.3,-109.0],[-73.2,-123.5],[-72.2,-137.3],[-57.4,-136.0]]
/** way/563910586 */
const ROOF86: XY[] = [[-10.9,91.9],[-10.5,86.6],[23.5,89.6],[23.0,94.7]]
/** way/563910591 */
const ROOF91: XY[] = [[73.9,-142.8],[66.4,-48.4],[64.7,-28.0],[51.2,140.8],[50.6,148.8],[49.9,156.8],[49.3,164.6],[48.1,179.4],[53.7,179.8],[58.0,126.4],[55.5,126.2],[67.4,-22.4],[70.0,-22.2],[72.5,-53.6],[70.1,-53.8],[77.2,-142.5],[76.1,-142.6]]

if (import.meta.main) {
  const extras = { bearing: 0, osm: 'relation/8051748', height: ROOF }
  writeLod('Paris-CDG Terminal 3', 'paris-cdg-terminal-3.glb', build(false), extras, 5000, 250_000)
}
