/**
 * Hassan Tower, Rabat (Almohad, begun 1191, left unfinished at Yaqub
 * al-Mansur's death in 1199), with the column stumps of its mosque:
 * procedural, CC0-1.0.
 * bun generators/rabat-hassan-tower.ts   (writes the low and the detail GLB)
 *
 * Uses the Moroccan kit exported from casablanca-hassan-ii-mosque.ts and the
 * tower helpers in marrakesh-koutoubia.ts.
 *
 * Frame: x along the tower's north and south faces (bearing 65.6), y along
 * its east and west faces (bearing 335.6), z up, metres. Placed at bearing
 * 335.6: OSM way/253426261's edges run 65.7 / 155.5 degrees, and the column
 * rows of the prayer hall follow the same grid. Anchor: the tower's centre,
 * -6.822788, 34.024135.
 *
 * Evidence
 * - OSM (ODbL), fetched 2026-11: the tower way/253426261 (height 44,
 *   15.4 m square), and 261 column stumps mapped as tourism=artwork
 *   sculptures (ways, 0.75-1.15 m across, 185 with heights 1.5-6 m); they
 *   are the prayer hall's columns south of the tower, x -61..65,
 *   y -156..-43 in this frame. Each is drawn where OSM puts it, at OSM's
 *   width and height; the 76 without a height are drawn 3 m (the commonest
 *   height in the photos). They are not buildings, so `replaces` lists the
 *   tower only.
 * - Published (Wikipedia, "Hassan Tower"): 44 m high, about 16 m square,
 *   meant to reach some 80 m; built of sandstone; the mosque's hall of
 *   some 200 columns was left unfinished and wrecked in the 1755
 *   earthquake.
 * - Photos (Wikimedia Commons):
 *   face: File:Hassan_Tower,_Rabat_-_face.jpg, Aemazy, CC BY-SA 4.0 (one face square on: every panel)
 *   corner: File:Hassan_Tower,_Rabat_-_corner_view.jpg, Aemazy, CC BY-SA 4.0
 *   columns: File:Hassan_Tower,_Rabat_-_facade_along_columns.jpg, Aemazy, CC BY-SA 4.0 (far off: stage proportions)
 *   terrace: File:Hassan_Tower,_Rabat_-_view_from_garden_terrace.jpg, Aemazy, CC BY-SA 4.0
 *   evening: File:Hassan_Tower,_Rabat_-_evening.jpg, Aemazy, CC BY-SA 4.0
 *   s09: File:"Unvollendet_geblieben_sind_Turm_und_Moschee"._09.jpg, Holger Uwe Schmitt, CC BY-SA 4.0 (the column field)
 *   wilprz: File:14042012-Tour_Hassan_-_Morocco_(7089700255).jpg, WiLPrZ, CC BY-SA 2.0
 *   jk4: File:HassanTower4.jpg, Jklamo, CC BY-SA 4.0
 * - Map terrain (Mapterhorn z12): the ground under the tower is about
 *   27 m, the column field 28-30 m; it falls to the river north.
 *
 * Numbers
 * - Tower 16 m square (published; OSM 15.4) and 44 m high (published and
 *   OSM). Its stages, as fractions of the height read off the far photo
 *   (columns) and placed with the face photo: the sebka panel 30.9-43.6 m
 *   over three lobed arches and a window (26.8-30.9), string courses at
 *   26.4 and 13.4 m, the framed horseshoe-arch panel 13.7-23.6 m (9.9 m
 *   wide), the door at the foot; the far photo gives 43.9 m for the whole
 *   at 0.051 m a pixel, the published 44. All four faces carry these stages (the real faces vary in
 *   their panels).
 * - Columns: each stands on the map's ground where it is (read from the
 *   Mapterhorn grid, 1.3-3.5 m above the model's base) and runs down to
 *   the base, so none is buried or floats on the map (a render without
 *   terrain shows them that much taller); starting them at their own
 *   ground instead makes the map treat the model as built over the
 *   terrain; the real esplanade is flat, the coarse
 *   terrain is not. Drawn 1.4-1.8 m across (photos; OSM's ways are
 *   0.8-1.1 m), off-white with the pink band the photos show (detail).
 * - Low model: the columns are square in plan and the sebka a recessed
 *   panel with flush lozenges; the detail model draws round columns and
 *   the lattice in relief.
 * - Look-only references: none.
 * - Doubts: the tower's unfinished top is drawn flat with a low ragged
 *   parapet; the ruined enclosure walls of the mosque are left out (OSM
 *   maps them as barriers, not buildings).
 *
 * Night: the tower and the columns are floodlit (`_FLOODLIGHT`).
 */
import { Part, type V3 } from './mesh'
import { writeModel } from './london-buckingham-palace'
import { arch, inlay, lathe, materials, mats, prism, rectST, sebka, wall, type Mats, type Niche } from './casablanca-hassan-ii-mosque'
import { squareFaces, towerBand } from './marrakesh-koutoubia'

export const ID = 'rabat-hassan-tower'
export const BEARING = 335.6
const H = 44, W = 16

/** [x, y, radius, height, base] for each OSM column stump; base on the map's ground. */
const COLUMNS: [number, number, number, number, number][] = [[12.0,-117.0,0.45,3,2.49],[-2.7,-149.2,0.39,4.0,2.33],[12.0,-149.2,0.42,2.0,2.15],[-28.2,-155.7,0.43,3.0,3.04],[-21.8,-142.8,0.41,3.0,2.66],[-2.7,-104.0,0.43,4.0,2.6],[12.1,-136.2,0.42,4.0,2.38],[-2.6,-136.2,0.39,4.0,2.48],[31.3,-142.9,0.41,1.5,2.59],[25.1,-142.5,0.41,1.5,2.43],[-28.5,-104.4,0.44,3.0,2.18],[-22.1,-91.7,0.5,3,2.17],[31.2,-123.2,0.43,4.0,2.35],[12.0,-104.0,0.45,4.0,2.43],[11.7,-91.4,0.39,3,2.2],[-21.8,-155.7,0.45,3.0,2.94],[-15.7,-104.2,0.42,5.0,2.5],[-9.1,-129.8,0.44,3,2.64],[-15.8,-111.2,0.45,5.0,2.53],[-9.0,-104.2,0.45,4.0,2.64],[18.3,-104.0,0.42,3,2.25],[18.6,-136.3,0.4,4.0,2.44],[18.4,-123.2,0.41,4.0,2.46],[31.0,-91.3,0.42,3,2.44],[-22.0,-104.2,0.43,4.0,2.34],[5.5,-123.3,0.46,4.0,2.57],[-15.4,-142.8,0.42,3,2.65],[18.2,-117.0,0.46,3,2.33],[18.1,-91.4,0.44,3,2.23],[-28.3,-123.5,0.44,3.0,2.36],[-28.5,-91.5,0.45,3,2.15],[-2.7,-142.6,0.39,4.0,2.4],[-9.0,-123.5,0.46,3.0,2.64],[12.1,-142.7,0.45,3.0,2.23],[31.2,-129.7,0.41,2.0,2.54],[-9.0,-142.6,0.42,3,2.59],[31.0,-97.8,0.42,3,2.32],[11.8,-97.8,0.44,4.0,2.35],[25.1,-155.4,0.44,3.0,2.53],[-28.5,-98.0,0.43,3.0,2.17],[-15.7,-123.5,0.44,4.0,2.61],[5.8,-155.6,0.42,3.0,2.21],[-15.4,-155.4,0.48,3,2.76],[-8.9,-155.3,0.47,3.0,2.56],[-2.7,-97.7,0.43,5.0,2.5],[24.7,-110.4,0.44,4.0,2.2],[24.6,-97.9,0.4,2.5,2.26],[5.5,-104.1,0.4,3,2.53],[24.7,-104.1,0.42,3.0,2.22],[-2.8,-91.3,0.43,5.0,2.31],[18.4,-97.7,0.41,3,2.26],[31.1,-117.0,0.44,3,2.26],[12.3,-155.5,0.38,2.0,2.17],[5.5,-117.0,0.43,4.0,2.59],[31.4,-136.1,0.44,2.0,2.55],[-15.5,-149.2,0.44,3.0,2.65],[-2.6,-116.8,0.47,4.0,2.64],[12.0,-123.2,0.45,3,2.52],[5.5,-136.1,0.41,3.0,2.39],[18.5,-129.7,0.37,3.0,2.62],[-28.6,-110.7,0.44,3,2.19],[31.1,-104.1,0.41,3,2.27],[-15.6,-136.4,0.4,3,2.64],[-9.3,-91.7,0.45,3,2.39],[25.1,-149.1,0.4,4.0,2.4],[-28.2,-149.0,0.44,3,2.8],[-9.2,-98.0,0.45,3,2.58],[24.6,-91.5,0.44,2.5,2.32],[-28.4,-136.1,0.44,3.0,2.53],[-28.4,-129.9,0.46,3.0,2.47],[-15.5,-117.0,0.39,3.0,2.57],[18.6,-148.9,0.44,3.0,2.16],[-9.1,-149.0,0.4,3.0,2.53],[31.0,-110.5,0.43,3,2.26],[-22.1,-97.9,0.43,4.0,2.27],[-21.8,-149.3,0.46,3.0,2.75],[18.4,-110.0,0.46,4.0,2.21],[11.8,-110.1,0.47,4.0,2.47],[12.0,-129.9,0.4,4.0,2.56],[-9.0,-136.2,0.42,3,2.62],[18.6,-155.7,0.37,3.5,2.24],[-15.3,-97.9,0.41,5.0,2.43],[24.7,-123.3,0.43,1.5,2.4],[-9.1,-117.1,0.47,4.0,2.64],[31.5,-155.5,0.39,4.0,2.85],[-2.5,-155.4,0.39,3.0,2.37],[-21.9,-110.8,0.42,3.0,2.39],[-2.8,-123.5,0.45,4.0,2.62],[-28.4,-117.1,0.39,3.0,2.26],[5.8,-149.1,0.42,3.0,2.19],[-2.7,-129.7,0.46,4.0,2.57],[-15.8,-91.8,0.42,3,2.27],[5.6,-110.3,0.4,4.0,2.59],[-21.9,-123.3,0.42,4.0,2.53],[5.6,-129.8,0.45,4.0,2.54],[5.7,-142.6,0.41,2.0,2.26],[24.7,-117.1,0.44,4.0,2.27],[5.4,-91.5,0.44,5.0,2.23],[-15.6,-129.8,0.43,3,2.64],[18.5,-142.7,0.39,3.0,2.28],[31.5,-149.1,0.42,3.0,2.68],[-21.9,-117.1,0.41,3.0,2.46],[-21.9,-129.8,0.47,3,2.6],[24.9,-136.2,0.41,1.5,2.5],[-2.8,-110.6,0.43,3,2.64],[5.5,-97.8,0.45,5.0,2.42],[-9.2,-110.7,0.47,4.0,2.64],[-21.8,-136.2,0.44,3,2.62],[-28.4,-142.7,0.43,3,2.63],[25.0,-129.7,0.39,3.5,2.58],[11.8,-59.5,0.44,6.0,1.76],[44.0,-53.3,0.57,4.0,2.0],[11.7,-53.4,0.44,6.0,1.51],[-53.9,-78.5,0.5,3,2.18],[-60.8,-53.8,0.5,3.0,1.8],[62.6,-66.6,0.47,6.0,2.17],[30.6,-59.3,0.48,3,2.02],[49.5,-46.5,0.57,4.0,2.09],[64.4,-92.1,0.44,6.0,2.66],[64.5,-104.9,0.42,6.0,2.81],[5.6,-72.5,0.47,5.0,2.07],[-41.2,-65.8,0.44,2.0,2.07],[64.9,-143.0,0.44,6.0,3.1],[-28.4,-59.6,0.46,3,1.72],[62.4,-59.7,0.47,6.0,2.04],[24.6,-66.2,0.43,3,2.11],[-9.4,-65.8,0.47,1.5,1.73],[-35.2,-53.2,0.47,4.0,1.68],[44.1,-85.2,0.44,4.0,2.6],[-60.6,-91.7,0.49,6.0,2.57],[-60.5,-123.0,0.44,6.0,2.33],[64.5,-110.5,0.44,6.0,2.88],[-54.3,-65.9,0.5,3,2.12],[-22.2,-65.9,0.47,3,1.84],[-60.8,-59.6,0.49,6.0,2.08],[-2.8,-85.1,0.45,5.0,2.21],[50.0,-78.9,0.46,2.0,2.52],[-54.2,-59.6,0.48,3,2.07],[-15.6,-78.5,0.46,3.0,2.11],[-41.6,-47.0,0.48,3,1.57],[18.0,-53.4,0.39,6.0,1.64],[64.9,-149.1,0.44,6.0,3.31],[-28.7,-53.2,0.49,3,1.59],[64.8,-130.3,0.45,4.0,2.79],[-34.7,-59.2,0.48,3,1.82],[-28.5,-78.7,0.49,3,2.13],[37.3,-72.6,0.43,2.0,2.26],[-21.8,-59.4,0.47,3,1.65],[24.6,-78.6,0.43,3,2.32],[-41.1,-78.6,0.45,2.0,2.14],[37.1,-53.1,0.54,3,1.87],[56.4,-79.0,0.47,3,2.58],[30.9,-72.5,0.42,3,2.29],[-41.3,-85.2,0.46,3,2.16],[-60.2,-148.9,0.53,6.0,2.63],[-60.1,-155.2,0.52,6.0,2.8],[24.4,-53.1,0.49,3,1.71],[-47.5,-78.8,0.46,4.0,2.14],[49.7,-53.4,0.58,4.0,2.14],[24.5,-59.4,0.49,3,1.96],[-47.6,-65.8,0.44,2.0,2.09],[56.6,-72.8,0.48,3,2.42],[62.4,-53.3,0.48,6.0,1.91],[64.6,-124.0,0.44,6.0,2.87],[11.9,-66.1,0.45,6.0,1.95],[12.0,-78.6,0.46,6.0,2.15],[49.8,-59.8,0.46,4.0,2.14],[-47.7,-85.2,0.46,2.0,2.22],[-47.9,-47.0,0.48,2.0,1.63],[37.2,-66.1,0.47,2.0,2.12],[-28.4,-72.5,0.48,1.5,2.06],[64.8,-136.3,0.43,4.0,2.92],[24.7,-85.1,0.44,3,2.34],[-60.5,-66.0,0.5,3.0,2.13],[62.5,-72.6,0.46,6.0,2.33],[-21.9,-72.5,0.48,3,2.01],[37.0,-59.3,0.49,3,2.03],[37.4,-78.8,0.43,2.0,2.48],[-34.9,-65.8,0.48,1.5,1.99],[18.2,-72.4,0.45,6.0,2.15],[18.3,-66.2,0.44,6.0,2.04],[-60.4,-85.0,0.5,6.0,2.4],[64.4,-85.4,0.44,6.0,2.6],[-60.5,-129.8,0.53,6.0,2.26],[65.0,-155.9,0.45,6.0,3.46],[-21.9,-78.6,0.47,3.0,2.12],[56.7,-53.4,0.5,3,2.06],[18.5,-85.1,0.45,6.0,2.23],[-22.4,-53.2,0.5,3,1.48],[49.6,-72.7,0.45,1.5,2.39],[64.6,-116.9,0.44,6.0,2.91],[49.8,-66.4,0.47,2.0,2.27],[30.9,-66.2,0.48,3,2.16],[-60.7,-46.9,0.48,6.0,1.53],[43.9,-78.9,0.44,2.0,2.51],[-34.7,-85.2,0.45,2.0,2.14],[30.8,-53.2,0.52,3,1.78],[18.3,-78.5,0.46,6.0,2.21],[5.1,-53.2,0.45,5.0,1.42],[-60.5,-104.3,0.51,6.0,2.6],[-2.8,-78.6,0.45,5.0,2.12],[-15.6,-85.3,0.46,3.0,2.19],[-41.3,-59.6,0.47,2.0,1.94],[-60.6,-117.3,0.54,6.0,2.41],[-54.1,-72.5,0.49,3,2.15],[56.7,-85.2,0.46,3,2.63],[43.9,-59.7,0.47,2.0,2.08],[-54.2,-85.0,0.49,4.0,2.31],[-47.7,-59.7,0.47,4.0,2.01],[56.6,-46.5,0.49,3,1.98],[5.6,-66.0,0.46,5.0,1.91],[43.9,-46.4,0.57,3.5,1.92],[-21.7,-85.5,0.47,3.0,2.14],[-15.6,-72.7,0.48,3,1.97],[18.2,-59.5,0.46,6.0,1.89],[11.9,-72.4,0.44,6.0,2.09],[43.9,-66.5,0.46,2.0,2.17],[-9.2,-85.3,0.45,1.5,2.25],[-60.6,-97.6,0.51,6.0,2.62],[40.8,-42.6,0.56,3,1.79],[24.7,-72.4,0.41,3,2.23],[-9.1,-72.7,0.47,3,1.94],[-15.7,-59.4,0.49,3,1.58],[-9.6,-53.2,0.48,3,1.34],[64.4,-98.4,0.43,6.0,2.72],[-41.6,-53.3,0.45,2.0,1.76],[-60.5,-110.5,0.52,6.0,2.54],[-3.0,-53.3,0.48,5.0,1.37],[5.4,-59.7,0.49,5.0,1.69],[-9.1,-59.6,0.48,3,1.54],[31.1,-85.1,0.45,3,2.46],[-60.7,-72.5,0.49,3.0,2.16],[-54.4,-53.4,0.49,4.0,1.83],[-41.1,-72.5,0.43,2.0,2.14],[-54.2,-47.0,0.47,4.0,1.61],[-2.8,-65.8,0.45,5.0,1.83],[31.0,-78.7,0.44,3,2.43],[-34.7,-78.6,0.56,2.0,2.14],[56.3,-59.8,0.47,3,2.14],[12.0,-85.1,0.46,6.0,2.16],[-28.6,-65.8,0.48,3,1.9],[5.7,-85.2,0.45,5.0,2.17],[-60.3,-142.6,0.53,6.0,2.57],[56.5,-66.5,0.46,3,2.27],[-2.9,-72.4,0.45,5.0,2.02],[-48.1,-53.4,0.47,2.0,1.83],[-34.6,-72.6,0.52,1.5,2.1],[-60.3,-136.3,0.49,6.0,2.44],[-16.1,-53.4,0.48,3,1.41],[43.9,-72.3,0.46,2.0,2.3],[5.7,-78.5,0.45,5.0,2.13],[-28.1,-85.4,0.46,3.0,2.14],[62.4,-46.6,0.48,6.0,1.83],[-9.1,-78.6,0.49,1.5,2.1],[-16.0,-65.9,0.47,3,1.78],[50.1,-85.1,0.47,3,2.6],[37.4,-85.2,0.46,2.0,2.56],[-3.1,-59.6,0.47,5.0,1.6],[-60.4,-78.4,0.52,6.0,2.23],[62.8,-78.9,0.48,6.0,2.55],[-47.6,-72.5,0.44,2.0,2.14]]

function build(detail: boolean): Mats {
  const M = mats()
  const c = 0.15, Wf = W - 2 * c, cs = Wf / 2
  const faces = squareFaces(W, c)
  for (const f of faces) {
    const n: Niche[] = []
    // the door
    n.push({ poly: rectST(cs - 1.6, cs + 1.6, 0.9, 5.2), depth: 0.2, back: M.stone, reveal: M.stone,
      kids: [{ poly: arch(cs - 0.9, cs + 0.9, 1.0, 3.6, 'horseshoe', detail ? 8 : 4), depth: 0.8, back: M.shade }] })
    // the framed horseshoe arch, its lobed outline and the panel inside
    const inner: Niche[] = [{ poly: arch(cs - 2.7, cs + 2.7, 13.9, 17.6, 'horseshoe', detail ? 10 : 5), depth: 0.4, back: M.stone, reveal: M.stone,
      kids: [
        ...[-1.1, 1.1].map((d) => ({ poly: arch(cs + d - 0.55, cs + d + 0.55, 14.0, 17.6, 'pointed', 4), depth: 0.35, back: M.shade })),
        { poly: rectST(cs - 0.25, cs + 0.25, 19.6, 20.6), depth: 0.4, back: M.win },
      ] }]
    n.push({ poly: rectST(cs - 5.0, cs + 5.0, 13.7, 23.6), depth: 0.3, back: M.stone, reveal: M.stone,
      kids: [{ poly: arch(cs - 3.6, cs + 3.6, 13.8, 18.25, 'horseshoe', detail ? 12 : 6), depth: 0.3, back: M.shade, reveal: M.stone, kids: inner },
        ...(detail ? sebka(M.shade, cs - 4.85, cs + 4.85, 22.4, 23.45, 1.2, 1.05, 0, [], 0.42).map((d) => inlay(d.poly, M.shade)) : [])] })
    // the sebka panel and the three lobed arches at its foot
    const sx0 = cs - 6.0, sx1 = cs + 6.0
    const arches: Niche[] = [-1, 0, 1].map((k) => ({ poly: arch(cs + k * 3.9 - 1.7, cs + k * 3.9 + 1.7, 26.85, 28.6, 'pointed', detail ? 6 : 4), depth: 0.45, back: M.shade, reveal: M.stone,
      kids: k === 0 ? [{ poly: arch(cs - 0.4, cs + 0.4, 27.0, 29.5, 'round', 4), depth: 0.6, back: M.win }] : [] }))
    const lattice = detail
      ? sebka(M.shade, sx0 + 0.2, sx1 - 0.2, 31.2, 43.3, 1.6, 1.3, 0.35, arches.map((a) => a.poly), 0.42)
      : sebka(M.shade, sx0 + 0.2, sx1 - 0.2, 31.2, 43.3, 1.9, 1.5, 0, arches.map((a) => a.poly), 0.44).map((d) => inlay(d.poly, M.shade))
    n.push({ poly: rectST(sx0, sx1, 26.75, 43.6), depth: 0.35, back: M.stone, reveal: M.stone, kids: [...arches, ...lattice] })
    wall(M.stone, f, rectST(0, Wf, 0, H), n)
  }
  for (let k = 0; k < 4; k++) {
    const f = faces[k], g = faces[(k + 1) % 4]
    const a = (s: Face, u: number, t: number): V3 => [s.o[0] + s.u[0] * u, s.o[1] + s.u[1] * u, t]
    M.stone.quad(a(f, Wf, 0), a(g, 0, 0), a(g, 0, H), a(f, Wf, H))
  }
  towerBand(M.stone, faces, Wf, 26.2, 26.65, 0.18)
  towerBand(M.stone, faces, Wf, 13.15, 13.6, 0.18)
  // the unfinished top: a flat roof inside a low, broken parapet
  prism(M.stone, [[-W / 2 + 0.01, -W / 2 + 0.01], [W / 2 - 0.01, -W / 2 + 0.01], [W / 2 - 0.01, W / 2 - 0.01], [-W / 2 + 0.01, W / 2 - 0.01]], H - 0.6, H - 0.6, true)
  for (const f of faces) for (let i = 0; i < 4; i++) {
    const s0 = (Wf / 4) * i + 0.06, s1 = (Wf / 4) * (i + 1) - 0.06, h = 0.3 + ((i * 7) % 3) * 0.12
    // a parapet stone: front flush with the face, 0.7 deep
    const fn: V3 = [f.u[1], -f.u[0], 0]
    const q = (s: number, t: number, d: number): V3 => [f.o[0] + f.u[0] * s + fn[0] * d, f.o[1] + f.u[1] * s + fn[1] * d, t]
    M.stone.quad(q(s0, H, 0), q(s1, H, 0), q(s1, H + h, 0), q(s0, H + h, 0))
    M.stone.quad(q(s0, H + h, 0), q(s1, H + h, 0), q(s1, H + h, -0.7), q(s0, H + h, -0.7))
    M.stone.quad(q(s1, H, 0), q(s1, H, -0.7), q(s1, H + h, -0.7), q(s1, H + h, 0))
    M.stone.quad(q(s0, H, -0.7), q(s0, H, 0), q(s0, H + h, 0), q(s0, H + h, -0.7))
    M.stone.quad(q(s1, H, -0.7), q(s0, H, -0.7), q(s0, H + h, -0.7), q(s1, H + h, -0.7))
  }

  // The column stumps, white stone drums on the map's ground.
  for (const [x, y, r0, h, b] of COLUMNS) {
    // OSM draws them 0.8-1.1 m across; the photos show stout drums about 1.5 m across
    // each drum runs down to the model's base, under the map's ground where it stands
    const r = Math.max(0.7, r0 * 1.6), top = b + h, foot = 0
    if (detail) {
      const band = b + h * 0.55
      lathe(M.brass, x, y, [[0, foot], [r, foot], [r, band - 0.2]], 10)
      lathe(M.zel, x, y, [[r, band - 0.2], [r, band + 0.25]], 10)
      lathe(M.brass, x, y, [[r, band + 0.25], [r, top], [0, top]], 10)
    } else lathe(M.brass, x, y, [[r, foot], [r, top], [0, top]], 5)
  }
  return M
}
type Face = { o: V3; u: V3; v: V3 }
/** The kit names its slots for a mosque; here the 'brass' slot is the columns' pale stone and 'zellige' their pink band. */
const rename = (parts: ReturnType<typeof materials>) => parts.map((p) => ({ ...p, material: { ...p.material,
  name: p.material.name.replace('hassan-tower-brass', 'hassan-tower-column').replace('hassan-tower-zellige', 'hassan-tower-column-band') } }))

// stone, shade (the shadowed relief), window, and the columns' pale stone in the 'brass' slot
const COLORS = { stone: 0xcfa77f, shade: 0x9f7b58, zel: 0xdcb4a3, roof: 0x999999, brass: 0xece3d8 }

if (import.meta.main) {
  const extras = { bearing: BEARING, elevation: 0, height: H + 1 }
  writeModel('Hassan Tower', ID, rename(materials(build(false), 'hassan-tower', COLORS)), extras, 6500)
  writeModel('Hassan Tower', ID, rename(materials(build(true), 'hassan-tower', COLORS)), extras, 40000, `${ID}.detail`)
}
