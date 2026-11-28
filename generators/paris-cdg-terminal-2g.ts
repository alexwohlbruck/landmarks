/**
 * Paris-Charles de Gaulle Airport, Terminal 2G (2008, for regional flights
 * on small aircraft), east of 2F: the white main building on the landside,
 * the long glazed gallery forking across the apron to two boarding
 * pavilions — procedural, CC0-1.0, no textures.
 * bun generators/paris-cdg-terminal-2g.ts
 *
 * Map frame: x = east, y = north, z up, metres. Bearing 0. Anchor: the
 * area centroid of OSM relation/20020818's outer ring (2.6021643, 49.005175).
 * y = 0 is the lowest ground under the footprint, the road on the
 * building's north-west side; the apron is G = 1.3 m higher (terrain check).
 *
 * Identifying features (Salard's aerial): a long, low, white main block in
 * two parts with ribbon windows and a flat roof; a narrow glazed gallery on
 * the apron, branching left and right to two long boarding pavilions with
 * flat white roofs.
 *
 * Evidence
 * - OSM (API map call, November 2026): relation/20020818 "Terminal 2G"
 *   (building=transportation; outer way/112217479, with an inner ring),
 *   its building:parts way/1462599191 (2 levels), way/1462599192 (the
 *   gallery and pavilions), way/1462599193, way/1462607322 (1 level),
 *   way/1462610467 (1 level), way/112212116 (2 levels), way/170356490,
 *   way/343876822 (roof); the canopies way/1382399418–420. OSM puts 2G at
 *   2.602, 49.005, beside the "Terminal 2G" bus stops (node/2314436073), not
 *   at the coordinates first given.
 * - Published: opened 2008, for regional (HOP!) flights (fr.wikipedia,
 *   "Aéroport Paris-Charles-de-Gaulle").
 * - Photos: https://commons.wikimedia.org/wiki/File:CDG_TERMINAL_G_FROM_F-GSQM_FLIGHT_CDG-JFK_(7507469822)_(2).jpg
 *   (Eric Salard, CC BY-SA 2.0) from the south, airborne.
 *
 * Numbers: levels from OSM at 4.5 m each over the apron (2 levels: 11 m,
 * 1 level: 6 m); pavilions 9 m (white, ribbon windows, as the aerial shows), gallery 6 m (estimated from the aerial:
 * the gallery is about half the pavilions' height).
 * Doubts: only one licensed exterior photo, from one side and far off; the
 * north (landside) face is unseen; heights are from levels.
 */
import { type XY, capPoly } from './nyc-570-lexington'
import { prismRing, writeLod, newMats, ccw, simplify, clipRect, type Mats } from './tokyo-haneda-terminal-1'
import { CDG, glassBlock } from './paris-cdg-terminal-1'

const G = 1.3

/** A white block with a band of ribbon windows per storey. */
function whiteBlock(M: Mats, ring: XY[], top: number, levels: number, detail: boolean) {
  const r = ccw(ring)
  prismRing(M.white, r, 0, top, M.roof)
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length], L = Math.hypot(b[0] - a[0], b[1] - a[1]); if (L < 4) continue
    const n: XY = [((b[1] - a[1]) / L) * 0.05, ((a[0] - b[0]) / L) * 0.05], u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
    for (let k = 0; k < levels; k++) {
      const z0 = G + 1.2 + k * 4.5, z1 = z0 + (detail ? 2.4 : 2.6)
      if (z1 > top - 0.8) break
      const A: XY = [a[0] + u[0] * 1 + n[0], a[1] + u[1] * 1 + n[1]], B: XY = [b[0] - u[0] * 1 + n[0], b[1] - u[1] * 1 + n[1]]
      M.win.quad([A[0], A[1], z0], [B[0], B[1], z0], [B[0], B[1], z1], [A[0], A[1], z1])
    }
  }
}

function build(detail: boolean) {
  const M: Mats = newMats(['con', 'roof', 'win', 'white', 'metal'])
  const S = { wall: M.con, win: M.win, trim: M.white, roof: M.roof }
  const sm = (r: XY[]) => (detail ? ccw(r) : simplify(ccw(r), 0.5))
  whiteBlock(M, sm(MAIN2), G + 11, 2, detail)
  whiteBlock(M, sm(EAST2), G + 11, 2, detail)
  whiteBlock(M, sm(MAIN2B), G + 11, 2, detail)
  whiteBlock(M, sm(WING1), G + 6.5, 1, detail)
  whiteBlock(M, sm(WING1W), G + 6.5, 1, detail)
  prismRing(M.white, SMALL, 0, G + 8, M.roof)
  prismRing(M.white, sm(CANOPY), G + 4.5, G + 5.3, M.roof, M.white)
  for (const r of [R1, R2, R3]) prismRing(M.white, r, G + 3.4, G + 4, M.roof, M.white)
  // the gallery: the whole part to 6 m, glazed; the two pavilions over it to 9 m
  glassBlock(S, sm(GALLERY), 0, G + 6, { fascia: 1.0, sill: G + 0.4 })
  for (const box of [[-140, -120, -100, -8], [60, -110, 100, -25]] as [number, number, number, number][]) {
    const piece = clipRect(ccw(GALLERY), box[0], box[1], box[2], box[3])
    if (piece.length > 2) whiteBlock(M, sm(piece), G + 9, 2, detail)
  }
  return [
    { part: M.con, material: CDG.concrete },
    { part: M.roof, material: CDG.roof },
    { part: M.win, material: CDG.window },
    { part: M.white, material: CDG.white },
  ]
}

// ===========================================================================
// OSM data, in this frame (bearing 0, anchor 2.6021643, 49.005175)
// ===========================================================================
/** way/1462599191 */
const MAIN2: XY[] = [[-36.8,12.1],[-36.0,2.7],[-27.9,3.3],[-22.0,3.8],[80.7,11.8],[80.5,14.3],[80.0,19.8],[79.1,30.3],[78.5,38.0],[78.2,41.3],[60.2,39.9],[-38.2,32.7],[-37.4,21.2]]
/** way/1462599192 */
const GALLERY: XY[] = [[-27.9,3.3],[-27.2,-5.0],[-26.9,-9.4],[-27.8,-10.7],[-59.2,-18.9],[-81.8,-24.8],[-83.2,-19.9],[-99.6,-20.9],[-99.9,-17.2],[-112.6,-18.0],[-112.5,-22.3],[-136.9,-23.8],[-135.2,-51.9],[-124.4,-51.2],[-124.2,-52.7],[-131.1,-53.4],[-129.1,-80.2],[-128.0,-80.2],[-127.8,-82.0],[-128.9,-82.2],[-127.1,-104.1],[-126.1,-103.9],[-125.9,-105.9],[-126.9,-106.0],[-126.3,-115.7],[-106.6,-114.0],[-107.4,-104.5],[-108.5,-104.5],[-108.8,-102.5],[-107.5,-102.4],[-109.3,-80.7],[-110.4,-80.7],[-110.7,-78.7],[-109.5,-78.6],[-111.4,-56.9],[-112.4,-56.9],[-112.6,-54.8],[-111.5,-54.8],[-111.6,-53.0],[-108.8,-52.7],[-110.1,-37.4],[-58.6,-23.8],[-26.2,-15.3],[-24.1,-16.6],[-22.3,-16.6],[-19.5,-14.2],[13.5,-17.7],[75.7,-24.2],[76.7,-36.6],[69.6,-37.0],[69.9,-40.1],[71.0,-40.0],[71.2,-42.1],[70.1,-42.2],[71.8,-64.0],[72.9,-63.9],[73.1,-65.9],[72.0,-66.0],[73.7,-87.8],[74.9,-87.7],[75.0,-89.8],[74.0,-89.9],[74.8,-99.4],[94.3,-97.9],[93.4,-88.2],[92.4,-88.3],[92.2,-86.4],[93.4,-86.1],[91.6,-64.4],[90.5,-64.6],[90.2,-62.4],[91.4,-62.3],[89.7,-40.8],[89.1,-40.9],[88.8,-38.4],[89.2,-38.4],[89.0,-35.7],[82.1,-36.2],[80.7,-19.5],[13.6,-13.3],[-19.1,-10.3],[-20.9,-9.0],[-21.3,-4.5],[-22.0,3.8]]
/** way/1462599193 */
const MAIN2B: XY[] = [[80.0,19.8],[89.8,20.6],[90.3,15.1],[80.5,14.3]]
/** way/1462607322 */
const WING1: XY[] = [[60.2,39.9],[58.5,46.0],[57.5,49.8],[53.3,64.8],[-25.1,42.7],[-50.3,36.1],[-42.7,10.4],[-36.8,12.1],[-37.4,21.2],[-38.2,32.7]]
/** way/1462610467 */
const WING1W: XY[] = [[-42.7,10.4],[-52.1,0.9],[-54.9,3.6],[-75.9,24.0],[-41.7,58.9],[-25.1,42.7],[-50.3,36.1]]
/** way/112212116 */
const EAST2: XY[] = [[88.0,42.3],[88.3,39.0],[89.8,20.6],[90.3,15.1],[90.5,12.7],[137.6,16.6],[135.2,46.2],[111.1,44.3]]
/** way/170356490 */
const SMALL: XY[] = [[78.2,41.3],[88.0,42.3],[88.3,39.0],[78.5,38.0]]
/** way/343876822 */
const CANOPY: XY[] = [[-98.7,0.7],[-75.9,24.0],[-54.9,3.6],[-60.7,-2.4],[-63.8,-2.3],[-74.5,8.0],[-78.9,8.0],[-92.2,-5.7]]
/** way/1382399418 */
const R1: XY[] = [[80.2,81.0],[91.1,82.1],[91.5,78.4],[80.6,77.3]]
/** way/1382399419 */
const R2: XY[] = [[92.0,79.3],[92.6,70.3],[90.0,70.1],[90.6,62.4],[96.4,63.0],[95.4,79.5]]
/** way/1382399420 */
const R3: XY[] = [[67.4,78.3],[68.2,74.8],[78.6,77.2],[77.8,80.7]]

if (import.meta.main) {
  const extras = { bearing: 0, osm: 'relation/20020818', height: G + 11 }
  writeLod('Paris-CDG Terminal 2G', 'paris-cdg-terminal-2g.glb', build(false), extras, 5000, 250_000)
}
