/**
 * Paris-Charles de Gaulle Airport, Terminal 2E Hall M (Satellite S4, 2012),
 * the 750 m pier east of Hall L, joined to it only by the people mover and
 * tunnels — procedural, CC0-1.0, no textures.
 * bun generators/paris-cdg-terminal-2e-hall-m.ts
 *
 * Writes models/paris-cdg-terminal-2e-hall-m.glb (low) and
 * models/paris-cdg-terminal-2e-hall-m.detail.glb (detail: the whole
 * landmark again, with mullions, more skylights and glazed jet bridges).
 * Uses Hall L's kit (paris-cdg-terminal-2e-hall-l.ts).
 *
 * Map frame: x = east, y = north, z up, metres. Bearing 0. Anchor: the
 * area centroid of OSM way/170931654 (jet bridges included), 2.5906635,
 * 49.0046829. y = 0 is the lowest ground under the footprint, the road and
 * people-mover cutting that crosses the hall near its middle; the apron
 * slopes from about 8 m (north) to 4 m (south) over it, and the roof is
 * level.
 *
 * Identifying features (photos): a long glass pier under a dark grey roof
 * pitched gently either side of a ridge, its eaves stepping out in a
 * saw-tooth, one tooth per gate, with a cross-shaped central block under a
 * flat roof and a curved glass front; white jet-bridge pods along both
 * sides.
 *
 * Evidence
 * - OSM (API map call, November 2026): way/170931654 ("Terminal 2E -
 *   Portes M"; its outline draws the jet bridges, cut off by `despur` and
 *   drawn as bridges).
 * - Published: date (fr.wikipedia, "Aéroport Paris-Charles-de-Gaulle":
 *   S4 2012).
 * - Terrain: Mapterhorn z15 (see above).
 * - Photos (Wikimedia Commons):
 *   https://commons.wikimedia.org/wiki/File:Overview_of_Terminals_2E,_gates_L_and_M,_at_the_Paris_Charles_de_Gaulle_Airport_(CDG),_Roissy,_France_(21475287384).jpg
 *     (Charles from Port Chester, CC BY 2.0) both halls from the south-west,
 *     airborne: the roof, saw-tooth eaves, the central block, pods;
 *   https://commons.wikimedia.org/wiki/File:Paris_Charles_de_Gaulle_Airport_(CDG)_-_Overview_of_Terminals_2E_and_2F_(43790637690).jpg
 *     (Charles from Port Chester, CC BY 2.0) the halls from farther off;
 *
 * Numbers (estimated from the photos against the OSM widths): walls to 22 m
 * over y = 0, ridge 3 m higher, eaves 3–7 m out in the saw-tooth; central
 * block 24 m; jet bridges at 9.6–12.4 m (the apron's mean 6 m + 3.6…6.4).
 * Doubts: the north end is seen only from far off; the roof is drawn level
 * over a sloping apron, as it looks.
 */
import { type V3 } from './mesh'
import { type XY, quadN, unit, capPoly } from './nyc-570-lexington'
import { prismRing, writeLod, ccw, simplify, despur, jetBridges, type Mats } from './tokyo-haneda-terminal-1'
import { glassBlock } from './paris-cdg-terminal-1'
import { bandCuts } from './paris-cdg-terminal-2a-2c'
import { AP, walls, parts } from './paris-cdg-terminal-2e-hall-l'

const M_EAVE = 22, M_RIDGE = 25, M_BLOCK = 24

function hallM(M: Mats, detail: boolean) {
  const { body: b0, spurs } = despur(SAT_M, 9.5, 40)
  const body = detail ? ccw(b0) : simplify(ccw(b0), 0.8)
  walls(M, body, M_EAVE, 1.6, detail)
  capPoly(M.roof, body, M_EAVE - 0.05)
  // the pitched roof with saw-tooth eaves, bay by bay along the pier
  const { cuts: raw } = bandCuts(body, 22, 1)
  const cuts = raw.filter(Boolean) as [XY, XY][]
  const w = (c: [XY, XY]) => Math.hypot(c[1][0] - c[0][0], c[1][1] - c[0][1])
  for (let i = 0; i < cuts.length - 1; i++) {
    const A = cuts[i], B = cuts[i + 1]
    if (w(A) > 60 || w(B) > 60) continue // the central block has its own flat roof
    for (const side of [0, 1]) {
      const mA: XY = [(A[0][0] + A[1][0]) / 2, (A[0][1] + A[1][1]) / 2], mB: XY = [(B[0][0] + B[1][0]) / 2, (B[0][1] + B[1][1]) / 2]
      const out = (c: [XY, XY], m: XY, d: number): XY => { const e = c[side], L = Math.hypot(e[0] - m[0], e[1] - m[1]); return [e[0] + ((e[0] - m[0]) / L) * d, e[1] + ((e[1] - m[1]) / L) * d] }
      // a tooth: the eave runs out from 3 m at one end of the bay to 7 m at the other
      const eA = out(A, mA, 3), eB = out(B, mB, 7)
      const p: V3[] = [[mA[0], mA[1], M_RIDGE], [mB[0], mB[1], M_RIDGE], [eB[0], eB[1], M_EAVE + 0.2], [eA[0], eA[1], M_EAVE + 0.2]]
      const e1: V3 = [p[1][0] - p[0][0], p[1][1] - p[0][1], p[1][2] - p[0][2]], e2: V3 = [p[3][0] - p[0][0], p[3][1] - p[0][1], p[3][2] - p[0][2]]
      let n = unit([e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]]); if (n[2] < 0) n = [-n[0], -n[1], -n[2]]
      quadN(M.roof, p[0], p[1], p[2], p[3], [n, n, n, n])
      // the soffit and the tooth's end face
      quadN(M.roof, [eA[0], eA[1], M_EAVE - 0.4], [eB[0], eB[1], M_EAVE - 0.4], [eB[0], eB[1], M_EAVE + 0.2], [eA[0], eA[1], M_EAVE + 0.2])
      const sB = B[side]
      M.white.quad([sB[0], sB[1], M_EAVE - 0.4], [eB[0], eB[1], M_EAVE - 0.4], [eB[0], eB[1], M_EAVE + 0.2], [sB[0], sB[1], M_EAVE + 0.2])
      M.white.quad([sB[0], sB[1], M_EAVE + 0.2], [eB[0], eB[1], M_EAVE + 0.2], [eB[0], eB[1], M_EAVE - 0.4], [sB[0], sB[1], M_EAVE - 0.4])
      if (detail) for (let k = 1; k < 4; k++) { // skylight dots along the ridge
        const t = k / 4, c: XY = [mA[0] + (mB[0] - mA[0]) * t, mA[1] + (mB[1] - mA[1]) * t], e: XY = [eA[0] + (eB[0] - eA[0]) * t, eA[1] + (eB[1] - eA[1]) * t]
        const q: XY = [c[0] + (e[0] - c[0]) * 0.25, c[1] + (e[1] - c[1]) * 0.25]
        prismRing(M.white, [[q[0] - 0.6, q[1] - 0.6], [q[0] + 0.6, q[1] - 0.6], [q[0] + 0.6, q[1] + 0.6], [q[0] - 0.6, q[1] + 0.6]], M_RIDGE - 1.2, M_RIDGE - 0.4, M.white)
      }
    }
  }
  // the central block: higher, flat-roofed
  const wide = cuts.filter((c) => w(c) > 60).flat()
  if (wide.length > 2) {
    const xs = wide.map((p) => p[0]), ys = wide.map((p) => p[1])
    const r: XY[] = [[Math.min(...xs), Math.min(...ys) - 6], [Math.max(...xs), Math.min(...ys) - 6], [Math.max(...xs), Math.max(...ys) + 6], [Math.min(...xs), Math.max(...ys) + 6]]
    glassBlock({ wall: M.con, win: M.win, trim: M.white, roof: M.roof }, r, M_EAVE - 1, M_BLOCK, { fascia: 1.6 })
    for (let k = 0; k < 3; k++) { const x = (r[0][0] + r[1][0]) / 2 - 16 + k * 16, y = (r[0][1] + r[2][1]) / 2; prismRing(M.white, [[x - 5, y - 3.5], [x + 5, y - 3.5], [x + 5, y + 3.5], [x - 5, y + 3.5]], M_BLOCK, M_BLOCK + 0.6, M.white) }
  }
  jetBridges({ ...M, bridge: M.metal, roof: M.metal }, spurs, { z0: AP + 3.6, z1: AP + 6.4, detail })
}

// ===========================================================================
// OSM data, in this frame (bearing 0, anchor 2.5906635, 49.0046829)
// ===========================================================================
/** way/170931654 */
const SAT_M: XY[] = [[42.2,-132.7],[48.6,-213.2],[85.3,-210.6],[86.1,-217.8],[49.2,-219.8],[55.8,-301.5],[92.8,-298.5],[93.5,-305.0],[56.3,-307.7],[60.9,-367.7],[26.1,-371.8],[27.6,-386.3],[93.6,-381.1],[93.9,-384.8],[23.8,-390.9],[21.8,-372.3],[20.1,-372.7],[16.9,-334.5],[-18.3,-337.8],[-18.9,-331.2],[16.4,-328.9],[10.9,-262.9],[-24.6,-265.9],[-25.2,-259.6],[10.4,-257.3],[4.3,-192.3],[-30.1,-195.4],[-30.6,-188.6],[3.7,-186.3],[-2.0,-120.4],[-35.3,-123.2],[-36.3,-117.0],[-2.6,-114.8],[-8.3,-46.9],[-43.2,-49.4],[-43.4,-43.3],[-9.1,-41.1],[-9.7,-33.3],[-100.3,-39.6],[-101.2,-28.9],[-101.7,-21.6],[-103.3,-1.0],[-103.6,3.8],[-103.9,8.6],[-104.4,17.5],[-106.6,45.5],[-107.5,55.1],[-107.9,59.5],[-108.7,69.0],[-15.3,78.2],[-21.3,151.4],[-60.1,149.0],[-60.4,155.3],[-22.0,158.1],[-27.4,221.5],[-63.8,218.4],[-64.3,224.8],[-28.0,227.7],[-33.9,292.9],[-68.8,290.4],[-69.2,296.4],[-34.4,299.1],[-38.9,352.4],[-36.7,352.5],[-37.7,364.7],[-72.1,362.6],[-72.3,366.2],[-34.1,369.0],[-33.3,365.1],[-4.2,367.0],[-2.3,355.5],[2.2,355.6],[6.6,302.6],[43.5,305.2],[44.2,298.9],[7.1,296.8],[13.8,215.5],[50.6,218.0],[51.2,212.7],[14.3,209.2],[21.2,127.1],[58.5,130.3],[58.8,124.4],[21.5,122.5],[24.9,81.6],[28.9,81.9],[64.5,84.4],[65.5,73.7],[66.8,59.6],[69.3,32.5],[70.2,22.0],[70.6,18.1],[70.9,14.7],[71.3,11.2],[72.6,-3.2],[74.9,-28.3],[54.0,-29.1],[39.0,-31.0],[33.9,-31.4],[41.6,-126.9],[77.7,-123.6],[78.2,-129.4]]

if (import.meta.main) {
  const extras = { bearing: 0, osm: 'way/170931654', height: M_RIDGE }
  writeLod('Paris-CDG Terminal 2E Hall M', 'paris-cdg-terminal-2e-hall-m.glb', parts((M) => hallM(M, false)), extras, 8000, 250_000)
  writeLod('Paris-CDG Terminal 2E Hall M', 'paris-cdg-terminal-2e-hall-m.detail.glb', parts((M) => hallM(M, true)), extras, 40_000, 1_500_000)
}
