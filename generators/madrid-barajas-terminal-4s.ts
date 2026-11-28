/**
 * Madrid-Barajas Terminal 4S, the satellite (Richard Rogers Partnership with
 * Estudio Lamela, 2006): the 950 m pier with the central block on its east
 * side — procedural, CC0-1.0, no textures.
 * bun generators/madrid-barajas-terminal-4s.ts
 *
 * Writes models/madrid-barajas-terminal-4s.glb (low) and .detail.glb.
 *
 * Writes the low model (bands paired into 18 m modules) and the detail
 * (every 9 m band, oculi, rooflight slots, mullions). Colours: roof, window
 * and four tree colours along the pier: light blue (the U gates, north) →
 * green (the S gates) → yellow → vermilion (orange to red, the R gates,
 * south); see generators/madrid-barajas-terminal-4.ts for why the colours
 * are zones and the building is one placement.
 *
 * Built with the kit in generators/madrid-barajas-terminal-4.ts (same
 * architecture as T4: see its header for the band, profile and tree
 * geometry and the shared evidence).
 *
 * Frame: origin at -3.5672, 40.4945, bearing −0.29° (the pier's long walls
 * in OSM run 0.29° west of north). Anchor: the outline's area centroid,
 * (−23.9, −0.6) in this frame.
 *
 * Evidence
 * - OSM: way/27836635 (Terminal 4S, building=transportation, aeroway=
 *   terminal, layer 1; no height). In this frame: pier x −67.9…2.9,
 *   y −470.5…473.2; the central block x 2.9…72.4, y −71.1…64.9. Gate nodes:
 *   R at y < −290, S −190…180, U > 240; their x gives the stands on both
 *   sides (the fixed links are drawn at them; OSM maps no jet bridges here).
 * - PNOA orthophoto (IGN, CC BY 4.0): the pier's roof from x ≈ −73.5 to
 *   +5 at the cusps, the canyon of fan rooflights at x ≈ 3–5 along the
 *   central block, the block's roof to x ≈ 76, 9 m bands, the oculi.
 * - Published: 290,000 m², three levels above ground; gates M (level 1),
 *   R, S, U (level 2) (es.wikipedia); colours: R orange, S light green,
 *   U light blue (El Español, "¿Sabías que puedes orientarte por los
 *   colores de la T4?").
 * - https://commons.wikimedia.org/wiki/File:Madrid_Barajas_Airport_ATC_T4_2.jpg
 *   (Slashme, CC BY-SA 3.0): T4S's west wall behind the north tower (which
 *   stands at y ≈ −294 in this frame): yellow trees to the north of the
 *   tower, orange beside it, red-orange beyond to the south; this places
 *   the yellow/orange change at y ≈ −286.
 * - Photos (EVIDENCE):
 *   https://commons.wikimedia.org/wiki/File:Madrid_Barajas_Airport-Terminal_4S_(7146509957).jpg
 *     (Charles from Port Chester, New York, CC BY 2.0): the south end from
 *     the south-west, low: the end band's wave (tips 14 m, crests 21 m,
 *     valley 19 m above the apron, scaled from the A340-300's 16.9 m fin),
 *     red-orange edge beam and trees, the central Y in front of the recessed
 *     end wall;
 *   https://commons.wikimedia.org/wiki/File:Madrid_Barajas_Airport-Terminal_4S_(7161901698).jpg
 *     and (7173540886) (same author, CC BY 2.0): the long west wall and the
 *     north tower beyond;
 *   https://commons.wikimedia.org/wiki/File:Barajas_t4s_1.jpg and
 *     Barajas_t4s_2.jpg (MdeVicente, CC0): the east side with the T4S apron
 *     tower, green trees, the fixed links;
 *   https://commons.wikimedia.org/wiki/File:Barajas-T4S-271210-1.jpg and -2
 *     (FDV, CC BY-SA 3.0): the airside wall, green-yellow trees by the apron
 *     tower;
 *   https://commons.wikimedia.org/wiki/File:ES-Madrid-Barajas-T4S-2012.JPG
 *     (Bbb-wiki, CC BY-SA 3.0): the gate lounge inside, green trees;
 *   https://commons.wikimedia.org/wiki/File:Terminal_4S,_Aeropuerto_de_Barajas,_Madrid,_Espa%C3%B1a,_2013-10-17,_DD_01.JPG
 *     … DD 07 (Diego Delso, CC BY-SA 3.0): the pier inside, the blue and
 *     violet trees and the wave of the bands.
 * - Terrain: Mapterhorn flat within 1 m under the pier (the roof shows as a
 *   bump of a surface model, filled by the map).
 *
 * Numbers: as T4 (kit): 9 m bands (here 951.7 m / 106 = 8.98 m), tips 14,
 * crests 21, valley 19 (measured on the T4S photo above), crown 2.0, edge
 * 1.5 deep; long glass walls 9.5 m in from the cusps; the central block's
 * east wall at x 68 (estimated, under its eave); fixed links 16 m long at
 * the gate nodes (estimated).
 * Doubts: the green/yellow and light-blue/green boundaries are placed from
 * the gate letters, not seen; the apron tower on the east side (OSM way/205800925) is not part
 * of this model; the central block's height is taken as the pier's.
 */
import { Part, type V3, type MaterialSpec } from './mesh'
import { type XY, quadN } from './nyc-570-lexington'
import { writeLod } from './tokyo-haneda-terminal-1'
import { MAD, T4_PROF, strip, canyon, oculi, wallLines, wallLinesY, wallMullions, link, rainbow, collect, type Parts, type Side } from './madrid-barajas-terminal-4'

export const T4S_ANCHOR = { lng: -3.5672, lat: 40.4945 }
export const T4S_BEARING = -0.29
export const T4S = {
  yA: -474.5, p: 951.7 / 106, k1: 106,
  pier: { x0: -73.5, x1: 5, wallL: -64, wallR: -4.5 },
  block: { x0: 5, x1: 76, wallR: 68, k0: 44, k1: 62 },
}
/** Gate stands (y in the T4S frame) on each side, from the OSM gate nodes. */
const GATES_W = [404, 352, 274, 179, 117, 53, -9, -72, -151, -411]
const GATES_E = [399, 325, 242, 165, 102, -125, -189, -292, -368, -410]

export const T4S_ORDER = ['lightBlue', 'green', 'yellow', 'vermilion'] as const
export function t4sKey(y: number) { return y > 210 ? 'lightBlue' : y > -150 ? 'green' : y > -286 ? 'yellow' : 'vermilion' }

/** lng/lat of a point in the T4S frame. */
export function t4sLngLat(x: number, y: number) {
  const b = (T4S_BEARING * Math.PI) / 180
  const E = x * Math.cos(b) + y * Math.sin(b), N = -x * Math.sin(b) + y * Math.cos(b)
  const kx = 111320 * Math.cos((T4S_ANCHOR.lat * Math.PI) / 180), ky = 110540
  return { lng: +(T4S_ANCHOR.lng + E / kx).toFixed(7), lat: +(T4S_ANCHOR.lat + N / ky).toFixed(7) }
}

/** The whole of T4S in its frame shifted by (dx, dy); the low model pairs the bands into 18 m modules. */
export function buildT4S(detail: boolean, colours: MaterialSpec[], dx: number, dy: number) {
  const P: Parts = { roof: new Part(), soffit: new Part(), win: new Part(), glass: new Part(), stem: new Part() }
  const cParts: Record<string, Part> = {}
  for (const c of colours) cParts[c.name] = new Part()
  const byName: Record<string, Part> = {}
  for (const [k, sw] of Object.entries(MAD)) if (cParts[(sw as MaterialSpec).name]) byName[k] = cParts[(sw as MaterialSpec).name]
  const colour = rainbow(byName, t4sKey, T4S_ORDER)
  const f = detail ? 1 : 2
  const prof = T4_PROF
  const { yA, p } = T4S
  const common = { yA, p: p * f, prof, scallop: 6.5, crown: 2.0, depth: 1.5, colour, detail }
  const free: Side = { canyon: false, wall: true }, canyonS: Side = { canyon: true, wall: false }
  const bl = T4S.block, pr = T4S.pier
  const yB0 = yA + bl.k0 * p, yB1 = yA + bl.k1 * p
  const yEndS = yA + 4.0, yEndN = yA + T4S.k1 * p - 4.0
  const pier = strip(P, {
    ...common, x0: pr.x0, x1: pr.x1, k0: 0, k1: T4S.k1 / f,
    left: () => free, right: (y) => (y > yB0 && y < yB1 ? canyonS : free),
    wallL: pr.wallL, wallR: pr.wallR, endS: yEndS, endN: yEndN,
    facadeEvery: 2, centralEvery: 0, endTrees: true, coarse: !detail,
  })
  const sB = strip(P, {
    ...common, x0: bl.x0, x1: bl.x1, k0: bl.k0 / f, k1: bl.k1 / f,
    left: () => canyonS, right: () => free, wallL: bl.x0, wallR: bl.wallR,
    endS: yB0 + 4.5, endN: yB1 - 4.5, facadeEvery: 2, centralEvery: 0, coarse: !detail,
  })
  if (detail) {
    for (let k = 0; k < T4S.k1; k++) oculi(P.glass, pier, k, prof.uc, 2.6)
    for (let k = bl.k0; k < bl.k1; k++) oculi(P.glass, sB, k, prof.uc, 2.6)
  }
  canyon(P.glass, bl.x0, yB0, yB1, 13.6, prof.zTip - 0.25)
  // close the block's end walls across to the pier's east wall line
  for (const [ye, sg] of [[yB0 + 4.5, -1], [yB1 - 4.5, 1]] as [number, number][]) {
    const n: V3 = [0, sg, 0], xa = pr.wallR, xb = bl.x0, z = prof.zTip - 1.6
    if (sg < 0) quadN(P.win, [xa, ye, 0], [xb, ye, 0], [xb, ye, z], [xa, ye, z], [n, n, n, n])
    else quadN(P.win, [xb, ye, 0], [xa, ye, 0], [xa, ye, z], [xb, ye, z], [n, n, n, n])
    wallLinesY(P.stem, ye, sg as -1 | 1, xa, bl.wallR, [6.5])
  }
  const zs = detail ? [5.2, 10.2] : [6.5]
  wallLines(P.stem, bl.wallR, 1, yB0 + 4.5, yB1 - 4.5, zs)
  wallLines(P.stem, pr.wallL, -1, yEndS, yEndN, zs)
  wallLines(P.stem, pr.wallR, 1, yEndS, yB0, zs); wallLines(P.stem, pr.wallR, 1, yB1, yEndN, zs)
  if (detail) wallMullions(P.stem, pr.wallL, -1, yEndS, yEndN, 4.5, (y) => pier.under(pr.wallL, y))
  // fixed links at the gates
  for (const y of GATES_W) link(P.stem, P.win, [pr.wallL, y], [pr.wallL - 16, y], detail)
  for (const y of GATES_E) if (!(y > yB0 - 5 && y < yB1 + 5)) link(P.stem, P.win, [pr.wallR, y], [pr.wallR + 16, y], detail)
  return collect(P, colours, cParts, dx, dy)
}

/** The anchor in the T4S frame: the area centroid of OSM way/27836635. */
export const ORIGIN: XY = [-23.9, -0.6]

if (import.meta.main) {
  const [dx, dy] = ORIGIN
  const ll = t4sLngLat(dx, dy)
  const extras = { bearing: T4S_BEARING, anchor: ll, osm: 'way/27836635', height: T4_PROF.zCrest + 2.0 }
  const cols = [MAD.lightBlue, MAD.green, MAD.yellow, MAD.vermilion]
  writeLod('Madrid-Barajas Terminal 4S', 'madrid-barajas-terminal-4s.glb', buildT4S(false, cols, dx, dy), extras, 8000, 250_000)
  writeLod('Madrid-Barajas Terminal 4S', 'madrid-barajas-terminal-4s.detail.glb', buildT4S(true, cols, dx, dy), extras, 40_000, 1_500_000)
  console.log('anchor', ll)
}
