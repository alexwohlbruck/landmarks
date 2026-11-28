/**
 * Paris-Charles de Gaulle Airport, Terminal 2E Hall L (Satellite S3, "La
 * Galerie Parisienne", 2007), the 750 m pier east of 2E's Hall K, joined to
 * it and to Hall M only by the people mover and tunnels — procedural,
 * CC0-1.0, no textures.
 * bun generators/paris-cdg-terminal-2e-hall-l.ts
 *
 * Writes models/paris-cdg-terminal-2e-hall-l.glb (low) and
 * models/paris-cdg-terminal-2e-hall-l.detail.glb (detail: the whole
 * landmark again, with mullions, more skylights and glazed jet bridges).
 *
 * Also the kit (`walls`, `parts`, heights) that paris-cdg-terminal-2e-hall-m.ts
 * imports; the model itself is only written when this file is run directly.
 *
 * Map frame: x = east, y = north, z up, metres. Bearing 0. Anchor: the
 * area centroid of relation/7410183 (outer less inners), 2.5848451,
 * 49.0043844. y = 0 is the lowest ground under the footprint, the road and
 * people-mover cutting that crosses the hall near its middle; the apron
 * slopes from about 8 m (north) to 4 m (south) over it, and the roof is
 * level.
 *
 * Identifying features (photos): a long glass pier under a flat dark roof
 * crossed by rows of linear skylights, gate pods along its sides, a lower
 * central block.
 *
 * Evidence
 * - OSM (API map call, November 2026): relation/7410183 ("Terminal 2E -
 *   Portes L"; outer way/112194527; its 34 inner rings are small gaps
 *   between gate pods and are roofed over here).
 * - Published: date (fr.wikipedia, "Aéroport Paris-Charles-de-Gaulle":
 *   S3 2007).
 * - Terrain: Mapterhorn z15 (see above).
 * - Photos (Wikimedia Commons):
 *   https://commons.wikimedia.org/wiki/File:Overview_of_Terminals_2E,_gates_L_and_M,_at_the_Paris_Charles_de_Gaulle_Airport_(CDG),_Roissy,_France_(21475287384).jpg
 *     (Charles from Port Chester, CC BY 2.0) both halls from the south-west,
 *     airborne: the roof, skylights, the central block, pods;
 *   https://commons.wikimedia.org/wiki/File:Paris_Charles_de_Gaulle_Airport_(CDG)_-_Overview_of_Terminals_2E_and_2F_(43790637690).jpg
 *     (Charles from Port Chester, CC BY 2.0) the halls from farther off;
 *
 * Numbers (estimated from the photos against the OSM widths): roof 20 m
 * with skylight rows every 12 m; gate pods 12 m; jet bridges at 9.6–12.4 m
 * (the apron's mean 6 m + 3.6…6.4).
 * Doubts: the west side and the north end are seen only from far off; the
 * roof is drawn level over a sloping apron, as it looks.
 */
import { type XY, capPoly } from './nyc-570-lexington'
import { prismRing, writeLod, newMats, ccw, simplify, despur, jetBridges, type Mats } from './tokyo-haneda-terminal-1'
import { CDG } from './paris-cdg-terminal-1'

export const AP = 6, L_ROOF = 20

export function walls(M: Mats, r: XY[], top: number, fascia: number, detail: boolean) {
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length], L = Math.hypot(b[0] - a[0], b[1] - a[1]); if (L < 0.05) continue
    M.con.quad([a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], AP + 0.5], [a[0], a[1], AP + 0.5])
    M.win.quad([a[0], a[1], AP + 0.5], [b[0], b[1], AP + 0.5], [b[0], b[1], top - fascia], [a[0], a[1], top - fascia])
    M.white.quad([a[0], a[1], top - fascia], [b[0], b[1], top - fascia], [b[0], b[1], top], [a[0], a[1], top])
    if (detail && L > 8) { const k = Math.round(L / 8), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1] * 0.1, -u[0] * 0.1]
      for (let j = 1; j < k; j++) { const c: XY = [a[0] + (b[0] - a[0]) * j / k + n[0], a[1] + (b[1] - a[1]) * j / k + n[1]]; M.white.quad([c[0] - u[0] * 0.25, c[1] - u[1] * 0.25, AP + 0.5], [c[0] + u[0] * 0.25, c[1] + u[1] * 0.25, AP + 0.5], [c[0] + u[0] * 0.25, c[1] + u[1] * 0.25, top - fascia], [c[0] - u[0] * 0.25, c[1] - u[1] * 0.25, top - fascia]) } }
  }
}

/** Fresh parts for one hall, and the model's parts from them. */
export function parts(draw: (M: Mats) => void) {
  const M: Mats = newMats(['con', 'roof', 'win', 'white', 'metal', 'glass'])
  draw(M)
  return [
    { part: M.con, material: CDG.concrete },
    { part: M.roof, material: CDG.deck },
    { part: M.win, material: CDG.window },
    { part: M.white, material: CDG.white },
    { part: M.metal, material: CDG.metal },
    { part: M.glass, material: CDG.glass },
  ]
}

function hallL(M: Mats, detail: boolean) {
  const outer = SAT_L.find((r) => r.role === 'outer')!.ring
  const { body: b0, spurs } = despur(outer, 9.5, 40)
  const body = detail ? ccw(b0) : simplify(ccw(b0), 0.8)
  walls(M, body, L_ROOF, 1.8, detail)
  capPoly(M.roof, body, L_ROOF)
  // the skylight rows: white-framed slots straight across the roof, on the pier's axis
  const n0 = body.length, mx = body.reduce((t, p) => t + p[0], 0) / n0, my = body.reduce((t, p) => t + p[1], 0) / n0
  let sxx = 0, syy = 0, sxy = 0
  for (const [x, y] of body) { sxx += (x - mx) ** 2; syy += (y - my) ** 2; sxy += (x - mx) * (y - my) }
  const th = 0.5 * Math.atan2(2 * sxy, sxx - syy), ax: XY = [Math.cos(th), Math.sin(th)], ay: XY = [-ax[1], ax[0]]
  const pr = body.map(([x, y]) => (x - mx) * ax[0] + (y - my) * ax[1]), s0 = Math.min(...pr) + 10, s1 = Math.max(...pr) - 10
  const step = detail ? 12 : 18
  for (let q = s0; q <= s1; q += step) {
    const c: XY = [mx + ax[0] * q - ay[0] * 4, my + ax[1] * q - ay[1] * 4], h = 13, w = 1.6
    const r: XY[] = [[c[0] - ay[0] * h - ax[0] * w, c[1] - ay[1] * h - ax[1] * w], [c[0] - ay[0] * h + ax[0] * w, c[1] - ay[1] * h + ax[1] * w], [c[0] + ay[0] * h + ax[0] * w, c[1] + ay[1] * h + ax[1] * w], [c[0] + ay[0] * h - ax[0] * w, c[1] + ay[1] * h - ax[1] * w]]
    prismRing(M.white, r, L_ROOF - 0.1, L_ROOF + 1.2, M.white)
  }
  jetBridges({ ...M, bridge: M.metal, roof: M.metal }, spurs, { z0: AP + 3.6, z1: AP + 6.4, detail })
}

// ===========================================================================
// OSM data, in this frame (bearing 0, anchor 2.5848451, 49.0043844)
// ===========================================================================
/** relation/7410183 */
const SAT_L: { role: string; ring: XY[] }[] = [{role:"outer",ring:[[59.4,-209.4],[40.4,-211.0],[41.1,-218.9],[45.7,-275.6],[63.7,-274.2],[63.5,-272.2],[70.6,-271.7],[72.9,-298.9],[65.6,-299.4],[65.3,-296.3],[47.8,-297.7],[53.2,-363.1],[71.4,-361.6],[70.0,-344.5],[77.1,-344.0],[78.9,-367.0],[71.9,-367.6],[71.8,-366.2],[54.2,-367.6],[55.1,-378.8],[53.2,-379.0],[53.7,-385.9],[20.8,-388.5],[20.3,-381.9],[18.3,-382.0],[16.8,-363.7],[8.4,-364.4],[5.4,-364.6],[5.9,-370.6],[0.9,-371.0],[0.4,-365.3],[-7.5,-366.0],[-7.8,-362.6],[-3.0,-362.2],[-4.2,-348.0],[-9.2,-348.4],[-18.3,-236.1],[-33.1,-54.6],[-33.5,-50.0],[-34.3,-40.6],[-35.3,-27.6],[-36.2,-17.5],[-36.3,-15.3],[-37.1,-5.9],[-37.5,-1.7],[-37.7,0.8],[-38.0,5.4],[-38.2,8.0],[-39.1,18.0],[-41.8,51.4],[-42.6,61.7],[-43.0,71.8],[-44.5,89.9],[-45.9,101.7],[-66.7,356.3],[-57.3,357.1],[-58.2,368.0],[-66.4,367.3],[-66.7,371.1],[-58.6,371.7],[-59.1,376.9],[-55.0,377.2],[-53.4,357.3],[-47.4,357.8],[-39.1,358.4],[-39.7,365.5],[-5.5,368.3],[-3.8,347.3],[-2.3,347.4],[0.0,320.2],[15.1,321.4],[15.0,323.6],[21.8,324.2],[23.9,298.3],[16.8,297.8],[16.8,298.7],[1.8,297.5],[5.6,250.7],[20.8,251.9],[20.5,254.7],[27.7,255.3],[30.0,227.6],[22.7,227.0],[22.6,228.2],[7.5,227.0],[11.2,181.5],[26.3,182.7],[26.1,185.0],[33.1,185.6],[35.3,158.7],[28.6,158.1],[28.4,160.0],[13.1,158.7],[16.0,122.8],[31.5,124.1],[31.3,126.1],[38.5,126.6],[40.6,100.2],[33.9,99.7],[33.8,100.2],[17.9,98.9],[20.0,72.7],[40.9,74.3],[41.3,69.2],[45.0,24.1],[45.5,17.7],[46.3,8.5],[47.6,-7.7],[48.3,-15.7],[49.0,-24.4],[25.4,-26.3],[26.3,-36.8],[31.2,-97.3],[49.4,-95.8],[49.2,-93.6],[56.3,-93.0],[58.3,-117.6],[58.5,-120.1],[51.6,-120.7],[51.4,-117.6],[32.9,-119.0],[38.4,-186.1],[57.0,-184.3],[56.9,-182.8],[63.4,-182.2],[65.9,-209.5],[59.4,-210.1]]},{role:"inner",ring:[[59.0,-205.0],[57.4,-188.3],[38.7,-190.2],[40.1,-206.7]]},{role:"inner",ring:[[0.4,315.2],[1.5,301.6],[16.5,302.5],[15.5,316.2]]},{role:"inner",ring:[[33.4,104.7],[32.1,118.4],[16.4,117.1],[16.8,112.6],[17.6,103.3]]},{role:"inner",ring:[[28.1,163.5],[26.8,177.8],[11.6,176.7],[12.8,162.1]]},{role:"inner",ring:[[7.2,231.2],[22.3,232.6],[21.1,247.5],[5.9,246.3]]},{role:"inner",ring:[[31.5,-100.7],[32.6,-114.2],[51.0,-112.9],[49.6,-99.5]]},{role:"inner",ring:[[64.0,-277.7],[65.1,-292.0],[47.5,-293.0],[46.1,-279.1]]},{role:"inner",ring:[[0.4,-302.8],[11.7,-302.1],[13.0,-318.0],[1.7,-318.8]]},{role:"inner",ring:[[3.9,-345.7],[15.3,-345.0],[16.6,-361.1],[5.2,-361.9]]},{role:"inner",ring:[[1.9,-321.2],[13.2,-320.6],[15.0,-341.7],[3.6,-342.2]]},{role:"inner",ring:[[-13.4,-134.6],[-2.2,-133.9],[-0.8,-150.0],[-12.1,-150.6]]},{role:"inner",ring:[[-10.2,-173.2],[-11.8,-153.8],[-0.6,-152.9],[1.0,-172.4]]},{role:"inner",ring:[[-13.7,-131.0],[-15.3,-111.2],[-4.1,-110.3],[-2.5,-130.1]]},{role:"inner",ring:[[-33.7,114.6],[-23.1,115.4],[-21.6,95.4],[-37.5,94.2],[-38.5,108.7],[-33.3,109.1]]},{role:"inner",ring:[[-46.0,264.3],[-44.7,248.4],[-33.6,249.2],[-34.9,265.1]]},{role:"inner",ring:[[-49.7,309.8],[-51.2,328.7],[-39.9,329.6],[-38.4,310.7]]},{role:"inner",ring:[[-39.1,180.4],[-37.8,164.7],[-27.1,165.6],[-28.3,181.3]]},{role:"inner",ring:[[-44.4,245.1],[-33.3,245.7],[-31.8,226.2],[-42.8,225.7]]},{role:"inner",ring:[[-37.6,161.7],[-26.8,162.2],[-25.2,142.3],[-36.0,141.8]]},{role:"inner",ring:[[-49.4,306.5],[-38.2,307.4],[-36.9,291.7],[-48.2,290.8]]},{role:"inner",ring:[[-42.6,222.6],[-31.6,223.6],[-30.3,207.4],[-41.3,206.5]]},{role:"inner",ring:[[-35.7,138.6],[-25.0,139.0],[-23.7,122.9],[-34.4,122.5]]},{role:"inner",ring:[[-47.9,288.0],[-36.7,288.5],[-35.2,269.1],[-46.3,268.6]]},{role:"inner",ring:[[-52.8,347.8],[-41.4,348.8],[-40.2,332.6],[-51.5,331.6]]},{role:"inner",ring:[[-41.0,203.6],[-30.1,204.3],[-28.6,184.9],[-39.4,184.2]]},{role:"inner",ring:[[-6.5,-218.4],[4.7,-217.6],[6.1,-233.6],[-5.2,-234.5]]},{role:"inner",ring:[[-5.0,-237.3],[6.3,-236.6],[8.0,-256.9],[-3.3,-257.6]]},{role:"inner",ring:[[-1.5,-279.8],[9.8,-279.2],[11.5,-299.2],[0.1,-299.7]]},{role:"inner",ring:[[-3.0,-260.7],[8.2,-259.9],[9.5,-275.6],[-1.8,-276.5]]},{role:"inner",ring:[[-9.9,-176.3],[1.2,-175.2],[2.6,-191.4],[-8.6,-192.6]]},{role:"inner",ring:[[-8.5,-194.7],[2.8,-194.0],[4.5,-214.2],[-6.8,-214.8]]},{role:"inner",ring:[[-16.8,-92.4],[-5.6,-91.7],[-4.3,-107.6],[-15.5,-108.3]]},{role:"inner",ring:[[-18.6,-70.1],[-7.5,-69.5],[-5.9,-88.9],[-17.1,-89.5]]},{role:"inner",ring:[[-18.9,-66.5],[-7.8,-65.6],[-9.1,-49.5],[-20.2,-50.4]]}]

if (import.meta.main) {
  const extras = { bearing: 0, osm: 'relation/7410183', height: L_ROOF + 1.2 }
  writeLod('Paris-CDG Terminal 2E Hall L', 'paris-cdg-terminal-2e-hall-l.glb', parts((M) => hallL(M, false)), extras, 8000, 250_000)
  writeLod('Paris-CDG Terminal 2E Hall L', 'paris-cdg-terminal-2e-hall-l.detail.glb', parts((M) => hallL(M, true)), extras, 40_000, 1_500_000)
}
