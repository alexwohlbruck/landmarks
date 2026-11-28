/**
 * London Heathrow Terminal 5B (satellite, opened 2008), the long pier on the
 * apron east of the main building 5A, joined to it and to 5C only by the
 * underground transit — procedural, CC0-1.0, no textures.
 * bun generators/london-heathrow-terminal-5b.ts
 *
 * Writes models/london-heathrow-terminal-5b.glb (low) and
 * models/london-heathrow-terminal-5b.detail.glb (detail: the whole landmark
 * again, with the V struts of the gate floor at every bay, finer mullions,
 * rooftop plant and glazed jet-bridge links).
 *
 * Also the satellite kit (`satellite`, `buildSatellite`) that
 * london-heathrow-terminal-5c.ts imports: 5C is drawn as 5B's twin, 362 m
 * east. The model itself is only written when this file is run directly.
 *
 * Map frame: x = model east, y = model north, z up, metres; bearing −0.35°,
 * as Terminal 5A (london-heathrow-terminal-5.ts, whose kit this imports).
 * Anchor: area centroid of OSM way/23479613 (jet-bridge links included),
 * −0.4812899, 51.4709356.
 *
 * Identifying features (photos): a very long, low, uniform pier; a fully
 * glazed gate floor on top of a plainer grey apron-level base, with white
 * branching V struts seen through the glass at every bay; a thin flat roof
 * edge overhanging the glass; the middle of the pier under a shallow curved
 * roof (OSM roof:shape=round), whose arch-topped glass ends rise a little
 * over the flat-roofed ends; jet bridges down both sides.
 *
 * Evidence
 * - OSM: way/23479613 (Heathrow Terminal 5B) with building:part
 *   way/379842246 (roof:shape=round, its middle). No heights. The outline
 *   draws every fixed jet-bridge link; `despur` cuts them off and they are
 *   drawn as bridges. Middle x −28.1…28.0, y −154.2…149.0 (56 m wide); ends
 *   45 m wide to y −222.1 and 210.6 (433 m in all).
 * - Published: 442 m long, 52 m wide, 19.5 m high (Wikipedia, "Heathrow
 *   Terminal 5").
 * - Photos (Wikimedia Commons):
 *   https://commons.wikimedia.org/wiki/File:North-East_Corner_of_London_Heathrow_Terminal_5B_-_geograph.org.uk_-_8391446.jpg
 *     (Richard Cooke, CC BY-SA 2.0) the east side from the apron: the
 *     glazed gate floor, the V struts, the roof edge, the grey base;
 *   https://commons.wikimedia.org/wiki/File:North_End_of_Heathrow_Terminal_5B_-_geograph.org.uk_-_8126753.jpg
 *     (Richard Cooke, CC BY-SA 2.0) from the north: the arch-topped glass
 *     end of the curved middle over the lower ends;
 *   https://commons.wikimedia.org/wiki/File:Satellite_building_5b,_Heathrow_Airport_Terminal_5_-_geograph.org.uk_-_8247209.jpg
 *     and https://commons.wikimedia.org/wiki/File:Satellite_building_5b,_Heathrow_Airport_Terminal_5_-_geograph.org.uk_-_8247283.jpg
 *     (Derek Harper, CC BY-SA 2.0) the gate floor close up: the overhang on
 *     brackets, the base, the jet-bridge cores;
 *   https://commons.wikimedia.org/wiki/File:Heathrow_terminal_5_from_air.JPG
 *     (Clayton Tang, CC BY-SA 3.0) aerial from the south-east: the plan and
 *     pale roof beside 5A.
 * - No lidar.
 *
 * Numbers: crown 19.5 m (published); eaves 14.5 m (estimated: the curved
 * middle's arch rises about a quarter of its height over the eave in
 * Cooke's north-end photo); the gate floor glazed from 7.5 m to the eave
 * (estimated from Cooke's and Harper's photos against the jet bridges, which
 * meet it at about 5–8 m); a 2.5 m roof overhang (estimated); V struts every
 * 18 m (estimated from Cooke's photo). Jet bridges at 4.6–8 m (estimated).
 * Doubts: the rooftop solar arrays seen at the edge in Harper's photo are
 * left out. The apron-level base is drawn plain (its recessed doors and
 * service bays are too fine).
 */
import { type V3 } from './mesh'
import { PALETTE } from './palette'
import { type XY, quadN } from './nyc-570-lexington'
import { despur, jetBridges, prismRing, newMats, writeLod, type Mats } from './tokyo-haneda-terminal-1'
import { LHR, arcRoof, band, type WallPlane } from './london-heathrow-terminal-5'

// ===========================================================================
// One satellite
// ===========================================================================

export const EAVE = 14.5, CROWN = 19.5, GLAZE0 = 7.5, OVER = 2.5

export type Sat = {
  /** the curved middle: x0, x1, y0, y1 */
  mid: [number, number, number, number]
  /** the flat-roofed ends: x0, x1, y0, y1 each */
  ends: [number, number, number, number][]
}

/**
 * The four walls of a box x0…x1, y0…y1 up to `z1`: the grey base, the
 * glazed gate floor from GLAZE0 to the eave with V struts and mullions.
 * `skip` leaves out the wall on a side ('s' or 'n') that abuts another block.
 */
function walls(M: Mats, x0: number, x1: number, y0: number, y1: number, z1: number, detail: boolean, skip: string[] = []) {
  const sides: { a: XY; b: XY; n: V3; key: string }[] = [
    { a: [x0, y0], b: [x1, y0], n: [0, -1, 0], key: 's' },
    { a: [x1, y0], b: [x1, y1], n: [1, 0, 0], key: 'e' },
    { a: [x1, y1], b: [x0, y1], n: [0, 1, 0], key: 'n' },
    { a: [x0, y1], b: [x0, y0], n: [-1, 0, 0], key: 'w' },
  ]
  for (const { a, b, n, key } of sides) {
    if (skip.includes(key)) continue
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: V3 = [(b[0] - a[0]) / L, (b[1] - a[1]) / L, 0]
    const W: WallPlane = { o: [a[0], a[1], 0], u, v: [0, 0, 1], n }
    const P = (s: number, t: number, d = 0): V3 => [a[0] + u[0] * s + n[0] * d, a[1] + u[1] * s + n[1] * d, t]
    quadN(M.wall, P(0, 0), P(L, 0), P(L, GLAZE0), P(0, GLAZE0), [n, n, n, n])
    quadN(M.win, P(0, GLAZE0), P(L, GLAZE0), P(L, z1), P(0, z1), [n, n, n, n])
    // a pale sill band at the gate floor, mullions, the V struts behind the glass
    band(M.trim, W, [0, GLAZE0 + 0.3], [L, GLAZE0 + 0.3], 0.6)
    const step = detail ? 4.5 : 9
    for (let s = step; s < L - 1; s += step) band(M.trim, W, [s, GLAZE0 + 0.6], [s, z1 - 0.2], detail ? 0.25 : 0.4)
    if (L > 30) {
      const bay = 18, nb = Math.max(1, Math.round(L / bay)), pitch = L / nb
      for (let k = 0; k < nb; k++) {
        const s = pitch * (k + 0.5)
        band(M.trim, W, [s, GLAZE0 + 0.8], [s - 3.2, z1 - 0.4], detail ? 0.5 : 0.7, 0.09)
        band(M.trim, W, [s, GLAZE0 + 0.8], [s + 3.2, z1 - 0.4], detail ? 0.5 : 0.7, 0.09)
        band(M.trim, W, [s, GLAZE0 + 0.6], [s, GLAZE0 + 2.6], detail ? 0.5 : 0.7, 0.09)
      }
    }
    // the base: a dark-ish recessed ground storey reads as a window band at the doors (detail only)
    if (detail) band(M.win, W, [2, 2.2], [L - 2, 2.2], 2.6, 0.04)
  }
}

/** A flat roof slab overhanging x0…x1, y0…y1 by `over` on the open sides. */
function flatRoof(M: Mats, x0: number, x1: number, y0: number, y1: number, z: number, over: number, overS: number, overN: number) {
  const X0 = x0 - over, X1 = x1 + over, Y0 = y0 - overS, Y1 = y1 + overN
  prismRing(M.trim, [[X0, Y0], [X1, Y0], [X1, Y1], [X0, Y1]], z - 0.9, z, null, M.trim)
  prismRing(M.roof, [[X0 + 0.6, Y0 + 0.6], [X1 - 0.6, Y0 + 0.6], [X1 - 0.6, Y1 - 0.6], [X0 + 0.6, Y1 - 0.6]], z - 0.2, z + 0.15, M.roof)
}

export function satellite(M: Mats, s: Sat, outline: XY[], detail: boolean) {
  const [mx0, mx1, my0, my1] = s.mid
  // the curved middle
  walls(M, mx0, mx1, my0, my1, EAVE, detail)
  const { zBot, xs } = arcRoof(M.roof, M.trim, { x0: mx0 - OVER, x1: mx1 + OVER, y0: my0 - 1.2, y1: my1 + 1.2, zEdge: EAVE + 0.2, rise: CROWN - EAVE - 0.2, pow: 1, depth: 1.0, n: detail ? 16 : 10 })
  // its arch-topped glass ends, over the flat ends' roofs
  for (const [y, sgn] of [[my0, -1], [my1, 1]] as [number, number][]) {
    const nE: V3 = [0, sgn, 0]
    const pts = [mx0, ...xs.filter((x) => x > mx0 + 0.3 && x < mx1 - 0.3), mx1]
    for (let i = 0; i < pts.length - 1; i++) {
      const p = pts[i], q = pts[i + 1]
      quadN(M.win, [p, y, EAVE], [q, y, EAVE], [q, y, zBot(q)], [p, y, zBot(p)], [nE, nE, nE, nE])
    }
    if (detail) for (let k = 1; k < 6; k++) { const x = mx0 + ((mx1 - mx0) * k) / 6; quadN(M.trim, [x - 0.2, y + sgn * 0.06, EAVE], [x + 0.2, y + sgn * 0.06, EAVE], [x + 0.2, y + sgn * 0.06, zBot(x) - 0.1], [x - 0.2, y + sgn * 0.06, zBot(x) - 0.1], [nE, nE, nE, nE]) }
  }
  // a pale eave band round the middle under the curved roof
  // the flat ends
  for (const [x0, x1, y0, y1] of s.ends) {
    const south = y1 <= my0 + 0.01
    walls(M, x0, x1, y0, y1, EAVE - 0.9, detail, [south ? 'n' : 's'])
    flatRoof(M, x0, x1, y0, y1, EAVE, OVER, south ? OVER : 0, south ? 0 : OVER)
    if (detail) { // rooftop plant
      const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2
      prismRing(M.wall, [[cx - 8, cy - 10], [cx + 8, cy - 10], [cx + 8, cy + 10], [cx - 8, cy + 10]], EAVE, EAVE + 2.4, M.roof)
    }
  }
  // jet bridges from the outline's spurs
  const { spurs } = despur(outline, 9.5, 20)
  jetBridges({ ...M, roof: M.wall }, spurs.filter((p) => p.length >= 4), { z0: 4.6, z1: 8.0, detail })
}

/** One satellite as a model's parts. */
export function buildSatellite(s: Sat, outline: XY[], detail: boolean) {
  const M = newMats(['roof', 'win', 'trim', 'wall', 'bridge', 'glass'])
  satellite(M, s, outline, detail)
  return [
    { part: M.roof, material: LHR.roof },
    { part: M.win, material: LHR.window },
    { part: M.trim, material: LHR.white },
    { part: M.wall, material: LHR.panel },
    { part: M.bridge, material: LHR.bridge },
    { part: M.glass, material: PALETTE.glass },
  ]
}

// ===========================================================================
// OSM data, in this frame (bearing −0.35, anchor −0.4812899, 51.4709356)
// ===========================================================================

/** OSM way/23479613 (5B) */
const T5B: XY[] = [[28.0,-80.9],[28.1,-146.6],[42.8,-152.0],[45.0,-151.9],[45.0,-150.8],[53.2,-150.8],[53.2,-154.5],[56.0,-154.5],[56.0,-158.1],[44.9,-158.1],[44.9,-154.5],[42.2,-154.6],[28.1,-149.2],[28.1,-154.2],[22.3,-154.2],[22.4,-222.1],[21.7,-222.1],[22.1,-224.0],[42.3,-227.2],[44.9,-227.3],[44.9,-225.9],[53.0,-225.9],[53.0,-230.0],[55.9,-230.0],[55.9,-232.7],[44.9,-232.7],[44.9,-230.6],[42.5,-230.6],[19.3,-226.0],[18.8,-222.1],[-18.9,-222.1],[-18.9,-225.4],[-36.0,-246.0],[-38.5,-246.2],[-47.0,-246.2],[-47.0,-242.9],[-49.8,-243.0],[-49.8,-239.8],[-38.4,-239.8],[-38.5,-243.8],[-37.4,-243.7],[-21.7,-224.4],[-21.7,-222.1],[-22.8,-222.1],[-22.8,-154.2],[-28.0,-154.2],[-40.9,-171.9],[-43.6,-171.9],[-51.7,-171.9],[-51.7,-168.0],[-54.8,-168.0],[-54.8,-165.0],[-43.6,-165.0],[-43.6,-170.1],[-42.4,-169.7],[-30.7,-153.0],[-28.0,-152.5],[-28.0,-98.3],[-43.5,-98.2],[-51.6,-98.2],[-51.6,-94.4],[-54.7,-94.4],[-54.7,-91.5],[-43.5,-91.5],[-43.5,-96.1],[-28.0,-95.8],[-28.1,-38.3],[-42.1,-25.6],[-43.5,-25.5],[-51.5,-25.5],[-51.5,-21.6],[-54.6,-21.6],[-54.6,-18.4],[-43.4,-18.4],[-43.5,-23.0],[-41.4,-23.2],[-28.1,-35.8],[-28.1,45.7],[-41.5,50.5],[-43.4,50.6],[-51.4,50.6],[-51.4,54.0],[-54.6,54.0],[-54.6,57.3],[-43.4,57.3],[-43.4,52.6],[-42.3,52.5],[-28.1,48.0],[-28.2,105.9],[-42.1,123.3],[-43.3,123.4],[-51.4,123.4],[-51.4,127.3],[-54.5,127.4],[-54.5,130.4],[-43.3,130.3],[-43.3,126.0],[-41.2,125.7],[-28.2,109.9],[-28.2,149.0],[-21.9,149.0],[-21.9,176.8],[-24.7,176.7],[-41.7,197.8],[-43.2,197.8],[-51.3,197.8],[-51.3,201.9],[-54.4,201.9],[-54.4,204.6],[-43.2,204.6],[-43.2,200.5],[-41.1,200.6],[-23.7,179.7],[-21.9,179.6],[-21.9,210.6],[-16.5,210.6],[-16.6,215.6],[-21.1,248.5],[-43.1,272.8],[-51.2,272.8],[-51.2,276.9],[-54.3,276.9],[-54.3,279.8],[-43.1,279.8],[-43.1,275.4],[-41.0,275.2],[-18.8,249.5],[-13.9,215.1],[-13.8,210.6],[14.5,210.6],[14.6,215.4],[19.2,243.0],[19.3,299.6],[48.6,306.0],[50.9,306.0],[50.9,307.0],[59.0,307.0],[59.0,303.2],[61.7,303.2],[61.7,300.5],[50.9,300.6],[50.9,303.4],[48.3,303.2],[21.6,297.7],[21.7,242.6],[17.1,215.2],[17.2,210.7],[22.8,210.7],[22.8,179.6],[24.6,179.7],[42.8,207.5],[45.3,207.5],[45.3,208.5],[53.5,208.5],[53.4,204.6],[56.4,204.6],[56.4,201.7],[45.3,201.7],[45.3,204.7],[43.6,204.6],[25.7,177.2],[22.8,177.2],[22.8,149.0],[27.9,149.0],[27.9,91.2],[42.8,100.7],[45.2,100.6],[45.2,101.7],[53.3,101.7],[53.3,98.1],[56.3,98.1],[56.3,94.5],[45.2,94.5],[45.2,98.1],[43.4,98.0],[27.9,88.5],[28.0,16.4],[42.7,10.3],[45.1,10.2],[45.1,11.7],[53.1,11.7],[53.1,8.0],[56.2,8.0],[56.2,5.1],[45.1,5.1],[45.1,7.8],[42.0,7.8],[28.0,13.0],[28.0,-78.5],[42.4,-77.9],[45.0,-78.0],[45.0,-76.9],[53.1,-77.0],[53.1,-80.6],[56.1,-80.6],[56.1,-84.0],[45.0,-84.0],[45.0,-80.3],[42.8,-80.6]]

const T5B_SAT: Sat = { mid: [-28.1, 28.0, -154.2, 149.0], ends: [[-22.8, 22.3, -222.1, -154.2], [-21.9, 22.8, 149.0, 210.6]] }

if (import.meta.main) {
  const extras = { bearing: -0.35, osm: 'way/23479613', height: CROWN }
  writeLod('Heathrow Terminal 5B', 'london-heathrow-terminal-5b.glb', buildSatellite(T5B_SAT, T5B, false), extras, 8000, 250_000)
  writeLod('Heathrow Terminal 5B', 'london-heathrow-terminal-5b.detail.glb', buildSatellite(T5B_SAT, T5B, true), extras, 40_000, 1_500_000)
}
