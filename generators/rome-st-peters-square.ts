/**
 * St. Peter's Square (Piazza San Pietro): Bernini's colonnade, the Vatican
 * obelisk and the two fountains. Procedural, CC0-1.0, no textures.
 *   bun generators/rome-st-peters-square.ts
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 359.5 (the
 * basilica's axis; see rome-st-peters-basilica.ts). Origin: the centre of
 * the obelisk (OSM way/799694267), 12.457261, 41.902240.
 *
 * Modelled: the two curved arms of the colonnade, four rows of Tuscan
 * columns (every column at its OSM position), the entablature, the gabled
 * tile roof with the balustrade on the piazza side, the statues on top (at
 * their OSM positions; 99 of the ~140 are mapped and all are drawn as bold
 * standing masses), the pedimented temple fronts at the arms' east ends;
 * the obelisk on its pedestal with the four bronze lions, the bronze mounts
 * and cross; the two fountains (Maderno's north, Bernini's south, the same
 * design): basin, pedestal, lower bowl, stem and upper bowl.
 *
 * Not modelled: the paving, the porphyry discs and the meridian (the
 * map's); the straight corridors to the basilica (Braccio di Costantino,
 * Braccio di Carlo Magno): they are separate OSM buildings outside the two
 * colonnade outlines; the basilica (rome-st-peters-basilica, ~185 m west of
 * the obelisk, no overlap); the water.
 *
 * Sources
 * - OSM (ODbL), fetched 2026-11-28: the north arm relation/12043628 and
 *   the south arm way/149958437 (building=civic, min_height 15, height
 *   17-17.3: the entablature); 305 column parts (height 15) and their 0.2 m
 *   bases; the gabled roof parts (17 to 21 m) over both arms; 99 statue
 *   nodes (tourism=artwork / historic=memorial, height 22 = top); the
 *   obelisk way/799694267 (height 27.5) and its base way/23952126 (1 m,
 *   11 x 11 m); the fountains way/244928138 (Maderno) and way/244928574
 *   (Bernini).
 * - Published (Wikipedia en/it "St. Peter's Square", "Vatican obelisk"):
 *   284 Tuscan columns in four rows and 140 statues of saints (3.1 m);
 *   the obelisk's shaft 25.31 m, about 40 m with its base and cross; the
 *   two fountains of the same design (Maderno 1613, Bernini's copy 1677).
 * - Photos (Wikimedia Commons, EVIDENCE):
 *   1 Diliff, "St Peter's Square, Vatican City - April 2007.jpg",
 *     CC BY-SA 3.0 (from the dome: the arms, the roofs, the statues on the
 *     piazza side, the obelisk and fountains in plan);
 *     https://commons.wikimedia.org/wiki/File:St_Peter%27s_Square,_Vatican_City_-_April_2007.jpg
 *   2 NateBergin, "01 Bernini St Peter's Colonnade.jpg", CC BY 4.0 (the
 *     south arm's east temple front, the columns, entablature, balustrade
 *     and statues); https://commons.wikimedia.org/wiki/File:01_Bernini_St_Peter%27s_Colonnade.jpg
 *   3 Jean-Pol Grandmont, "0 Fontana "Antica" (C. Maderno) - Piazza S.
 *     Pietro - Vatican (1).jpg", CC BY-SA 3.0 (the fountain's profile, the
 *     obelisk and its pedestal);
 *     https://commons.wikimedia.org/wiki/File:0_Fontana_%E2%80%9CAntica%E2%80%9D_(C._Maderno)_-_Piazza_S._Pietro_-_Vatican_(1).jpg
 *   4 Alberto Luccaroni, "View of saint Peter basilica from a roof.jpg",
 *     CC BY-SA 3.0 (the south arm's tiled roof and inner balustrade).
 *     https://commons.wikimedia.org/wiki/File:View_of_saint_Peter_basilica_from_a_roof.jpg
 *
 * Numbers
 * - From OSM: every column and statue position, both outlines, the
 *   entablature's top 17.3, statue tops 22. OSM tags the columns 15 m and
 *   the roof 17-21 m; the photos show a Tuscan entablature about a quarter
 *   of the column's height and a low roof hidden behind the balustrade, so
 *   the columns stop at 13.5, the entablature runs 13.5-17.3 (cornice 0.6 m
 *   out) and the ridge is 18.6, under the balustrade's top (review).
 * - Estimated: column diameter 1.6 m (OSM traces them at ~1.1 m; the
 *   photos show stouter shafts); the piazza-side and outer rows are round,
 *   the two middle rows (seen only through them) every third column; balustrade 17.3-18.9; the temple
 *   fronts' pediments 4.4 m high (photo 2); the obelisk's pedestal tiers,
 *   lions and crown (photo 3, scaled from the 25.31 m shaft); the fountain
 *   (photo 3: total 7.1 m over a basin of r 5.0, lower bowl r 2.85 at
 *   4.0-4.3, upper bowl r 2.1 at 6.5-6.9).
 * - Terrain: Mapterhorn has only z13 here. It rises ~4 m from the north-east
 *   to the south-west across the piazza (a plane fit is used below). The
 *   model is one rigid body, so each arm is built level at its mean ground
 *   with its columns run down to its lowest ground, and the obelisk and the
 *   fountains stand at their own ground height above the model's lowest
 *   point (the north arm's north-east). Elevation 0.
 * - Doubts: the z13 slope is coarse; the real arms may stand on steps the
 *   photos don't show. ~40 statues are missing from OSM and are not
 *   invented. The arms' west ends, where the corridors meet them, are
 *   closed with plain gable ends.
 *
 * Night: the colonnade and the obelisk are floodlit.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { earcut, prism, rect, smooth, type XY } from './dc-wwii-memorial'

const TAU = Math.PI * 2
// Generated from OSM (ODbL), fetched 2026-11-28; model frame (bearing 359.5, origin at the obelisk).
const COLUMNS: XY[] = [[85.5,-54.0],[80.4,57.3],[76.1,-62.0],[67.9,54.1],[74.9,55.0],[77.9,68.0],[81.4,59.9],[74.1,56.8],[64.5,62.2],[69.8,-59.6],[86.6,-56.6],[62.3,-56.9],[70.6,64.8],[79.9,-52.0],[60.6,51.1],[73.5,-49.6],[68.7,52.4],[67.9,-47.5],[57.1,59.1],[65.4,-48.7],[72.9,-51.4],[63.0,50.0],[79.1,-53.7],[83.6,-64.8],[36.8,-90.0],[-16.1,113.4],[15.6,100.6],[-57.8,91.6],[22.7,-102.8],[19.5,-110.6],[51.4,81.3],[-71.2,51.2],[20.7,-116.2],[25.1,-96.0],[-34.7,93.6],[69.4,-84.1],[40.8,90.2],[-53.3,95.5],[-17.7,100.2],[44.4,87.3],[-32.9,101.6],[-19.3,106.6],[48.7,92.4],[28.4,96.4],[38.1,-103.6],[-64.7,61.0],[40.6,-108.9],[-70.7,63.8],[32.7,94.7],[11.0,101.6],[-52.1,79.8],[54.7,68.4],[53.8,-83.6],[36.0,100.4],[12.5,108.1],[5.6,96.5],[45.2,-106.1],[71.1,76.4],[-25.3,111.0],[56.6,-80.2],[-27.8,90.4],[24.6,-109.2],[73.8,71.6],[52.3,-76.4],[40.6,82.9],[21.6,106.0],[59.1,59.9],[76.0,-74.2],[54.6,78.1],[-59.5,58.6],[-35.4,86.4],[-30.2,109.2],[9.3,-118.3],[60.1,81.9],[29.9,89.7],[9.7,96.0],[-13.7,101.3],[-62.3,65.2],[47.9,84.0],[-49.0,82.8],[-68.3,68.3],[62.6,-72.5],[18.1,94.1],[56.6,85.4],[-53.3,69.6],[49.9,74.7],[58.5,-88.3],[7.1,108.8],[68.4,80.8],[-57.2,62.6],[61.7,-84.5],[-8.7,102.2],[66.0,-88.3],[43.1,-92.8],[-42.5,88.5],[-9.3,108.8],[46.8,77.7],[50.4,-87.3],[-9.0,-112.0],[43.7,-85.3],[-41.9,96.7],[31.2,-99.7],[49.8,-79.4],[37.4,85.6],[-21.7,99.2],[-16.4,94.6],[-20.5,112.2],[-8.2,96.5],[62.4,66.7],[-60.1,69.7],[68.1,-76.2],[-3.5,-105.8],[52.5,96.7],[-3.0,-100.0],[-63.3,77.0],[-6.7,-99.8],[-75.9,66.3],[-25.8,97.6],[13.8,113.7],[59.6,-76.4],[17.2,107.1],[21.1,-97.3],[75.9,67.1],[46.7,-98.4],[57.8,-69.3],[-76.9,54.5],[36.6,92.5],[54.2,-100.1],[64.8,85.3],[-38.0,99.4],[33.9,-105.8],[44.8,95.5],[39.4,-95.2],[14.1,95.1],[-45.5,85.9],[57.7,74.5],[23.9,98.4],[-49.7,91.0],[-73.4,71.0],[26.2,104.6],[-4.0,-112.4],[-66.0,48.2],[40.1,-87.9],[-46.4,94.0],[-4.5,-118.1],[-55.1,76.4],[31.0,102.5],[-60.3,80.5],[-10.1,-117.6],[65.1,-68.2],[-31.8,88.7],[-57.2,84.1],[8.9,-105.9],[-40.9,104.3],[7.8,114.5],[-41.9,81.5],[-35.2,106.9],[-23.6,105.5],[47.0,-90.0],[26.2,-114.7],[-39.2,83.9],[-9.8,114.5],[-65.7,73.3],[26.1,91.3],[-49.7,98.7],[-50.5,72.9],[-44.9,101.6],[-47.7,76.1],[38.9,105.4],[-61.6,87.8],[-15.0,107.8],[52.8,88.6],[-20.0,93.7],[-53.7,87.5],[-55.2,66.7],[23.2,111.5],[-70.6,76.4],[54.7,-92.4],[40.4,98.0],[-67.9,80.5],[71.0,-71.4],[9.1,-112.5],[62.5,-92.4],[-12.5,95.7],[67.3,-64.6],[43.9,80.3],[18.7,112.6],[-44.9,78.8],[62.1,-62.2],[13.7,-105.0],[63.4,77.9],[57.1,92.4],[50.8,-95.4],[12.8,-99.4],[61.2,88.9],[-81.9,57.5],[27.0,-101.4],[46.8,-82.8],[33.5,87.9],[43.7,102.7],[60.1,-65.5],[28.9,-94.4],[9.0,-100.0],[59.9,70.9],[64.8,-80.6],[48.3,100.1],[6.3,102.2],[65.9,73.8],[52.6,71.6],[21.9,93.0],[-30.2,95.6],[28.3,110.0],[68.5,69.4],[73.0,-79.4],[18.2,-104.1],[33.4,107.8],[17.0,-98.5],[-64.9,84.0],[-38.4,91.1],[-28.2,103.8],[42.5,-101.0],[73.5,-67.3],[55.1,-72.8],[78.7,-69.6],[14.8,-111.6],[15.8,-117.2],[57.1,64.4],[49.7,-103.3],[19.7,99.6],[29.3,-107.7],[58.3,-96.9],[31.3,-113.1],[35.3,-97.6],[32.9,-92.5],[-23.8,92.2],[-57.9,73.1],[-7.8,-105.4],[36.2,-111.1],[-55.6,-68.4],[-15.1,-98.3],[-45.2,-88.9],[-60.6,-82.7],[-53.0,-71.9],[-48.8,-101.7],[-28.7,-106.8],[-32.6,-105.0],[-70.7,-65.6],[-57.1,-95.2],[-37.2,-102.8],[-47.9,-78.7],[-60.6,-60.9],[-60.4,-71.1],[-16.7,-103.8],[-76.5,-55.8],[-68.4,-81.7],[-31.0,-92.1],[-34.6,-89.7],[-53.2,-98.4],[-65.1,-50.9],[-52.3,-82.4],[-64.6,-62.8],[-13.3,-111.3],[-49.5,-94.0],[-33.9,-97.0],[-45.4,-97.1],[-27.2,-94.0],[-37.8,-94.6],[-53.1,-91.1],[-70.4,-53.1],[-38.1,-87.1],[-58.1,-64.9],[-19.1,-97.1],[-44.5,-82.2],[-29.7,-99.0],[-35.1,-110.2],[-11.9,-104.8],[-50.8,-75.0],[-41.5,-91.7],[-23.5,-95.6],[-62.5,-67.2],[-21.1,-102.5],[-73.5,-73.0],[-25.3,-114.1],[-10.7,-99.2],[-71.2,-77.3],[-20.1,-115.7],[-41.5,-84.5],[-48.5,-86.3],[-66.2,-74.4],[-55.4,-78.5],[-18.5,-110.2],[-65.1,-86.2],[-63.5,-78.6],[-61.8,-90.4],[-25.9,-100.8],[-31.2,-112.0],[-75.9,-68.1],[-14.5,-116.9],[-40.0,-107.8],[-57.4,-86.7],[-44.4,-105.1],[-68.4,-70.3],[-23.3,-108.7],[-41.4,-100.2],[-57.9,-75.0]]
const STATUES: XY[] = [[65.4,-48.7],[9.0,-100.0],[-3.0,-100.0],[-6.8,-99.8],[-10.7,-99.2],[12.8,-99.4],[-15.1,-98.3],[17.0,-98.5],[-19.2,-97.1],[21.1,-97.4],[25.1,-96.1],[-23.5,-95.6],[28.9,-94.5],[-27.2,-94.1],[-31.0,-92.1],[32.8,-92.4],[-34.6,-89.7],[36.7,-90.0],[40.1,-87.9],[-38.1,-87.1],[43.7,-85.3],[-41.5,-84.6],[-44.5,-82.2],[46.8,-82.8],[49.8,-79.4],[52.3,-76.4],[-50.9,-75.0],[-53.0,-71.9],[55.1,-72.8],[57.8,-69.3],[-55.6,-68.4],[-58.1,-65.0],[60.0,-65.4],[62.1,-62.2],[-60.7,-61.0],[62.3,-56.8],[-65.2,-51.1],[-66.0,48.2],[60.5,51.1],[-63.9,49.5],[57.1,59.1],[-60.3,55.7],[57.1,64.5],[-62.0,56.6],[54.8,68.4],[-59.5,58.6],[52.6,71.6],[-57.1,62.6],[50.0,74.8],[-55.2,66.6],[46.8,77.8],[-44.9,78.8],[43.9,80.2],[-53.2,69.6],[40.6,83.0],[-50.4,72.9],[-42.0,81.5],[37.3,85.6],[33.5,87.9],[-47.6,76.1],[29.9,89.6],[-27.9,90.4],[26.2,91.3],[-23.8,92.2],[21.9,93.0],[-20.1,93.7],[18.1,94.2],[-16.3,94.6],[14.1,95.1],[-12.6,95.6],[9.6,96.0],[5.6,96.5],[63.0,50.1],[59.2,60.0],[80.4,57.4],[4.1,94.4],[1.5,94.4],[-5.1,94.5],[-7.2,94.5],[-94.1,48.7],[-86.8,48.4],[-84.4,48.3],[-79.1,47.9],[-72.3,47.4],[-39.1,83.8],[-35.5,86.4],[-31.8,88.7],[-94.1,-54.5],[-91.9,-54.2],[-82.2,-52.7],[-77.4,-52.3],[-70.3,-51.4],[-3.8,-97.8],[-1.6,-97.8],[4.3,-97.9],[6.5,-97.8],[67.8,-47.5],[85.5,-54.0],[-12.7,-87.1]]
const NORTH: XY[] = [[21.6,92.4],[25.9,90.7],[29.5,89.1],[33.1,87.4],[36.9,85.1],[40.1,82.5],[43.4,79.9],[46.4,77.2],[49.4,74.2],[52.1,71.2],[54.2,68.0],[56.5,64.2],[58.3,60.3],[56.3,59.4],[58.2,54.9],[60.2,50.3],[62.0,51.0],[62.8,49.2],[72.4,53.3],[79.5,56.3],[81.2,57.0],[80.4,58.8],[82.2,59.6],[78.2,68.7],[76.2,67.9],[74.5,72.0],[71.8,76.8],[69.1,81.2],[65.0,86.1],[61.4,89.8],[57.3,93.3],[52.8,97.3],[48.8,100.7],[44.2,103.3],[38.8,106.2],[30.7,109.5],[25.6,111.5],[23.5,112.1],[19.0,113.3],[13.9,114.3],[7.8,115.2],[-0.8,115.6],[-9.9,115.2],[-16.2,114.2],[-20.7,113.1],[-25.6,111.7],[-30.5,109.8],[-35.8,107.4],[-41.4,104.9],[-45.7,102.0],[-50.3,99.1],[-54.2,95.7],[-58.3,92.1],[-62.3,88.1],[-65.7,84.3],[-68.5,80.8],[-71.3,76.7],[-73.9,71.4],[-76.6,66.6],[-78.6,60.9],[-80.4,61.5],[-82.5,61.2],[-83.8,59.9],[-84.1,57.4],[-82.7,57.3],[-81.7,56.7],[-81.4,57.1],[-77.0,56.7],[-77.1,55.4],[-76.1,54.7],[-76.7,53.7],[-76.7,51.5],[-76.8,47.1],[-75.0,47.0],[-68.8,46.7],[-67.2,46.7],[-66.1,46.5],[-65.0,48.4],[-63.0,47.6],[-60.5,52.6],[-58.2,57.3],[-59.3,57.8],[-56.6,62.3],[-54.7,66.2],[-52.9,69.1],[-50.1,72.3],[-47.2,75.7],[-46.1,76.7],[-44.4,78.3],[-41.6,81.0],[-39.0,83.2],[-35.0,85.8],[-31.4,88.1],[-27.6,89.8],[-23.6,91.6],[-19.8,93.1],[-16.3,94.1],[-12.4,95.1],[-8.9,95.7],[-8.9,93.3],[4.7,93.5],[4.7,95.9],[9.4,95.4],[14.0,94.4],[17.8,93.6]]
const SOUTH: XY[] = [[-81.4,-65.9],[-79.8,-68.6],[-77.6,-68.8],[-76.3,-69.9],[-74.2,-73.4],[-73.4,-75.0],[-71.6,-78.2],[-68.7,-82.5],[-65.6,-87.0],[-62.1,-91.2],[-57.5,-96.0],[-51.3,-100.4],[-50.2,-101.3],[-47.6,-103.0],[-45.8,-104.2],[-43.0,-106.0],[-38.9,-108.5],[-33.9,-110.9],[-30.1,-112.6],[-24.2,-114.9],[-18.6,-116.3],[-13.2,-117.5],[-8.7,-118.2],[-3.1,-118.6],[7.4,-118.3],[19.3,-116.8],[23.6,-115.7],[28.9,-114.1],[34.0,-112.3],[38.7,-110.1],[43.0,-107.8],[47.6,-105.1],[52.2,-101.6],[56.6,-98.4],[60.2,-95.0],[64.3,-90.8],[64.8,-90.2],[68.0,-86.5],[71.9,-81.6],[74.9,-77.0],[78.0,-71.9],[81.7,-64.5],[83.9,-65.5],[84.3,-64.0],[87.4,-56.2],[85.5,-55.6],[86.3,-53.7],[82.9,-52.5],[80.6,-51.6],[79.5,-51.2],[77.0,-50.3],[74.3,-49.3],[73.2,-48.8],[71.0,-48.0],[67.5,-46.7],[66.8,-48.5],[65.0,-47.9],[62.9,-53.6],[61.5,-57.2],[63.2,-57.9],[61.3,-62.1],[59.4,-65.1],[57.2,-69.0],[54.6,-72.4],[51.7,-76.0],[49.2,-79.0],[46.5,-82.2],[43.3,-84.6],[39.5,-87.4],[36.1,-89.6],[32.4,-91.9],[28.8,-93.8],[24.8,-95.4],[20.9,-96.7],[17.1,-97.7],[12.4,-98.5],[7.4,-99.0],[7.4,-96.9],[0.6,-96.9],[-5.3,-97.0],[-5.3,-99.1],[-8.4,-98.9],[-12.8,-98.1],[-16.9,-97.1],[-21.1,-95.8],[-24.8,-94.3],[-29.1,-92.4],[-32.5,-90.4],[-36.1,-87.8],[-36.6,-87.4],[-39.4,-85.3],[-41.1,-83.9],[-42.8,-82.7],[-45.9,-80.0],[-48.8,-76.5],[-51.4,-73.2],[-53.8,-69.7],[-56.5,-66.0],[-59.2,-61.3],[-57.7,-60.4],[-60.0,-56.0],[-62.8,-50.7],[-64.0,-51.3],[-65.4,-48.8],[-66.9,-49.3],[-73.6,-50.3],[-79.8,-51.1],[-84.8,-51.8],[-82.9,-62.3]]

const stone = new Part() // travertine: columns, entablature, pediments, the obelisk's platform
const trim = new Part() // statues and balustrades
const tile = new Part() // the arms' tiled roofs
const granite = new Part() // the obelisk and the fountains
const bronze = new Part() // the lions, the obelisk's crown and cross

// ---------------------------------------------------------------- helpers

/** Surface of revolution: rows of [r, z], n segments from `phase`; faces to the right of travel. */
function lathe(p: Part, cx: number, cy: number, prof: Array<[number, number]>, n: number, phase = 0, crease = 55) {
  smooth(p, m => {
    m.loft(prof.map(([r, z]) => Array.from({ length: n }, (_, i) => {
      const a = phase + (TAU * i) / n
      return [cx + r * Math.cos(a), cy + r * Math.sin(a), z] as V3
    })))
  }, crease)
}
function tri(p: Part, a: V3, b: V3, c: V3, dir: V3) {
  const e1 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], e2 = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  const n = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]]
  if (n[0] * dir[0] + n[1] * dir[1] + n[2] * dir[2] < 0) p.tri(a, c, b)
  else p.tri(a, b, c)
}
function quad(p: Part, a: V3, b: V3, c: V3, d: V3, dir: V3) {
  tri(p, a, b, c, dir)
  tri(p, a, c, d, dir)
}
const box = (p: Part, cx: number, cy: number, hw: number, z0: number, z1: number, b = 0) => prism(p, rect(cx, cy, hw, hw), z0, z1, b)

/** The map's ground under the model (Mapterhorn z13, a plane fit), above the model's lowest point. */
const ground = (x: number, y: number) => Math.max(0, 2.2 - 0.008 * x - 0.0168 * y)

// The OSM data is in the frame of the obelisk's node; shift it to the shaft's centre.
const SH = ([x, y]: XY): XY => [x - 0.33, y + 0.32]

// ---------------------------------------------------------------- the colonnade

/** Distances along a ray from c at angle a to where it crosses the ring. */
function crossings(ring: XY[], c: XY, a: number) {
  const dx = Math.cos(a), dy = Math.sin(a), out: number[] = []
  for (let i = 0; i < ring.length; i++) {
    const [x0, y0] = ring[i], [x1, y1] = ring[(i + 1) % ring.length]
    const ex = x1 - x0, ey = y1 - y0, den = dx * ey - dy * ex
    if (Math.abs(den) < 1e-9) continue
    const t = ((x0 - c[0]) * ey - (y0 - c[1]) * ex) / den, s = ((x0 - c[0]) * dy - (y0 - c[1]) * dx) / den
    if (t > 0 && s >= 0 && s <= 1) out.push(t)
  }
  return out.sort((p, q) => p - q)
}

/** Douglas-Peucker on a closed ring: drop vertices within tol of the simplified outline. */
function simplify(ring: XY[], tol: number): XY[] {
  const keep = new Array(ring.length).fill(false)
  const dp = (i: number, j: number) => {
    const [x0, y0] = ring[i], [x1, y1] = ring[j % ring.length], L = Math.hypot(x1 - x0, y1 - y0) || 1
    let best = -1, far = 0
    for (let k = i + 1; k < j; k++) {
      const d = Math.abs((x1 - x0) * (y0 - ring[k][1]) - (x0 - ring[k][0]) * (y1 - y0)) / L
      if (d > far) { far = d; best = k }
    }
    if (far > tol) { keep[best] = true; dp(i, best); dp(best, j) }
  }
  const half = Math.floor(ring.length / 2)
  keep[0] = keep[half] = true
  dp(0, half); dp(half, ring.length)
  return ring.filter((_, i) => keep[i])
}

function arm(outline: XY[], centre: XY, a0: number, a1: number, east: 'a0' | 'a1', side: number) {
  const ring = simplify(outline.map(SH), 0.35)
  const c = SH(centre)
  // The arm stands level at its mean ground; columns run down to its lowest ground.
  const gs = ring.map(([x, y]) => ground(x, y))
  const F = gs.reduce((s, g) => s + g, 0) / gs.length, LOW = Math.max(0, Math.min(...gs) - 0.2)
  // Columns 13.5 m, a Tuscan entablature of a quarter of that (architrave,
  // frieze, cornice) to OSM's 17.3, the balustrade to 18.9; the roof's ridge
  // stays under the balustrade's top, so it barely shows from the piazza.
  const ENT0 = F + 13.5, CORN = F + 16.5, ENT1 = F + 17.3, BAL = F + 18.9, RIDGE = F + 18.6

  // The entablature: a white band round the outline, the cornice standing
  // out 0.6 m, and the soffit over the columns.
  const ringAt = (r: XY[], z: number) => r.map(([x, y]) => [x, y, z] as V3)
  const offset = (o: number): XY[] => ring.map((p, i) => {
    const a = ring[(i + ring.length - 1) % ring.length], b = ring[(i + 1) % ring.length]
    const l0 = Math.hypot(p[0] - a[0], p[1] - a[1]), l1 = Math.hypot(b[0] - p[0], b[1] - p[1])
    const n0 = [(p[1] - a[1]) / l0, -(p[0] - a[0]) / l0], n1 = [(b[1] - p[1]) / l1, -(b[0] - p[0]) / l1]
    const m = [n0[0] + n1[0], n0[1] + n1[1]], ml = Math.hypot(m[0], m[1]) || 1
    const k = o / Math.max(0.5, (m[0] * n0[0] + m[1] * n0[1]) / ml)
    return [p[0] + (m[0] / ml) * k, p[1] + (m[1] / ml) * k] as XY
  })
  const cornice = offset(0.6)
  smooth(trim, m => m.loft([ringAt(ring, ENT0), ringAt(ring, CORN)]), 35)
  smooth(trim, m => m.loft([ringAt(ring, CORN), ringAt(cornice, CORN + 0.3), ringAt(cornice, ENT1)]), 35)
  for (const [i, j, k] of earcut(ring)) tri(stone, [...ring[i], ENT0] as V3, [...ring[j], ENT0] as V3, [...ring[k], ENT0] as V3, [0, 0, -1])

  // The gabled roof, sampled along the arm: eaves at the inner and outer
  // edges, ridge over the middle; the balustrade along the piazza side.
  const N = Math.round(Math.abs(a1 - a0) / (4 * Math.PI / 180))
  type Row = { pi: V3; po: V3; pm: V3; a: number }
  let rows: Row[] = []
  for (let k = 0; k <= N; k++) {
    const a = a0 + ((a1 - a0) * k) / N
    const t = crossings(ring, c, a)
    if (t.length < 2) continue
    const ri = t[0], ro = t[t.length - 1], ca = Math.cos(a), sa = Math.sin(a)
    rows.push({
      a,
      pi: [c[0] + ri * ca, c[1] + ri * sa, ENT1], po: [c[0] + ro * ca, c[1] + ro * sa, ENT1],
      pm: [c[0] + ((ri + ro) / 2) * ca, c[1] + ((ri + ro) / 2) * sa, RIDGE],
    })
  }
  // Where the rays graze the arm's ends, the section is cut short: keep the
  // full-width rows, then carry the end rows out to the outline's end faces.
  const width = (r: Row) => Math.hypot(r.po[0] - r.pi[0], r.po[1] - r.pi[1])
  const full = [...rows].map(width).sort((p, q) => p - q)[Math.floor(rows.length / 2)]
  rows = rows.filter(r => width(r) > 0.8 * full)
  const inside = (x: number, y: number) => {
    let k = false
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const [xi, yi] = ring[i], [xj, yj] = ring[j]
      if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) k = !k
    }
    return k
  }
  const extend = (r: Row, sgn: number): Row => {
    const t: V3 = [-Math.sin(r.a) * sgn, Math.cos(r.a) * sgn, 0]
    let d = 0
    while (d < 25 && inside(r.pm[0] + t[0] * (d + 0.5), r.pm[1] + t[1] * (d + 0.5))) d += 0.5
    const m = (p: V3): V3 => [p[0] + t[0] * d, p[1] + t[1] * d, p[2]]
    return { a: r.a, pi: m(r.pi), po: m(r.po), pm: m(r.pm) }
  }
  const dir = Math.sign(a1 - a0)
  rows = [extend(rows[0], -dir), ...rows, extend(rows[rows.length - 1], dir)]
  // The roof covers the top between the two balustrades, low and set back.
  const at = (p: V3, d: number, z: number): V3 => {
    const dx = p[0] - c[0], dy = p[1] - c[1], l = Math.hypot(dx, dy)
    return [p[0] + (dx / l) * d, p[1] + (dy / l) * d, z]
  }
  for (let k = 0; k < rows.length - 1; k++) {
    const A = rows[k], B = rows[k + 1]
    const ai = at(A.pi, 1.6, ENT1), bi = at(B.pi, 1.6, ENT1), ao = at(A.po, -1.0, ENT1), bo = at(B.po, -1.0, ENT1)
    quad(tile, ai, bi, B.pm, A.pm, [0, 0, 1])
    quad(tile, A.pm, B.pm, bo, ao, [0, 0, 1])
    // the balustrades: on the piazza side, face and top; outside, face and top
    const toward: V3 = [c[0] - (A.pi[0] + B.pi[0]) / 2, c[1] - (A.pi[1] + B.pi[1]) / 2, 0]
    const i0 = at(A.pi, 0, 0), i1 = at(B.pi, 0, 0), j0 = at(A.pi, 1.6, 0), j1 = at(B.pi, 1.6, 0)
    quad(trim, [i0[0], i0[1], ENT1], [i1[0], i1[1], ENT1], [i1[0], i1[1], BAL], [i0[0], i0[1], BAL], toward)
    quad(trim, [i0[0], i0[1], BAL], [i1[0], i1[1], BAL], [j1[0], j1[1], BAL], [j0[0], j0[1], BAL], [0, 0, 1])
    const o0 = at(A.po, 0, 0), o1 = at(B.po, 0, 0)
    quad(trim, [o0[0], o0[1], ENT1], [o1[0], o1[1], ENT1], [o1[0], o1[1], F + 18.2], [o0[0], o0[1], F + 18.2], [-toward[0], -toward[1], 0])
  }
  // Gable ends: the east end carries the temple front's pediment, standing
  // out of the roof; the west end, where the corridor meets it, is plain.
  const ends: Array<[typeof rows[number], boolean, number]> = [[rows[0], east === 'a0', -1], [rows[rows.length - 1], east === 'a1', 1]]
  for (const [r, isEast, s] of ends) {
    const ta: V3 = [-Math.sin(r.a) * Math.sign(a1 - a0) * s, Math.cos(r.a) * Math.sign(a1 - a0) * s, 0]
    if (!isEast) { tri(tile, r.pi, r.po, r.pm, ta); continue }
    // The temple front: a solid attic over the entablature, then the
    // pediment rising 5 m over the balustrade's top (photo 2).
    const rise = 5.0, out = 0.9
    const P = (p: V3, z: number, d: number): V3 => [p[0] + ta[0] * d, p[1] + ta[1] * d, z]
    const apex: V3 = [r.pm[0], r.pm[1], BAL + rise]
    quad(trim, P(r.pi, ENT1, out), P(r.po, ENT1, out), P(r.po, BAL, out), P(r.pi, BAL, out), ta)
    for (const d of [-1.2, out]) tri(stone, P(r.pi, BAL, d), P(r.po, BAL, d), P(apex, apex[2], d), d > 0 ? ta : [-ta[0], -ta[1], 0])
    for (const [p, q] of [[r.pi, apex], [apex, r.po]] as [V3, V3][]) {
      const zp = p === apex ? apex[2] : BAL, zq = q === apex ? apex[2] : BAL
      quad(trim, P(p, zp + 0.05, -1.2), P(q, zq + 0.05, -1.2), P(q, zq + 0.6, out + 0.3), P(p, zp + 0.6, out + 0.3), [0, 0, 1])
    }
    // the statue group on the apex and the statues on the pediment's ends
    const g = P(apex, apex[2], 0)
    lathe(trim, g[0], g[1], [[1.5, apex[2] - 0.6], [1.2, apex[2] + 2.6], [0.01, apex[2] + 4.2]], 4, Math.PI / 4, 100)
    for (const e of [r.pi, r.po]) {
      const q = P(e, BAL, 0)
      const dx = r.pm[0] - q[0], dy = r.pm[1] - q[1], l = Math.hypot(dx, dy)
      const x = q[0] + (dx / l) * 1.2, y = q[1] + (dy / l) * 1.2
      lathe(trim, x, y, [[0.95, BAL + 0.4], [0.7, BAL + 2.9], [0.01, BAL + 3.8]], 4, Math.PI / 4, 100)
    }
  }

  // The columns at their OSM positions, 1.6 m Tuscan shafts. The piazza-side
  // and outer rows are round (six sides, smoothed); the two middle rows,
  // seen only through them, are drawn every third column, square-cut.
  let mid = 0
  for (const p of COLUMNS.map(SH)) {
    if (Math.sign(p[1]) !== side) continue
    const a = Math.atan2(p[1] - c[1], p[0] - c[0]), t = crossings(ring, c, a)
    const r = Math.hypot(p[0] - c[0], p[1] - c[1])
    const f = t.length >= 2 ? (r - t[0]) / (t[t.length - 1] - t[0]) : 0
    if (f < 0.2 || f > 0.8) {
      lathe(stone, p[0], p[1], [[0.85, LOW], [0.72, ENT0]], 6, 0, 70)
    } else if (mid++ % 3 === 0) {
      lathe(stone, p[0], p[1], [[1.0, LOW], [0.88, ENT0]], 4, Math.PI / 4, 100)
    }
  }

  // The statues, at their OSM positions: on the balustrade or, at the
  // temple fronts and outer edge, on their own pedestals.
  for (const p of STATUES.map(SH)) {
    if (Math.sign(p[1]) !== side) continue
    const a = Math.atan2(p[1] - c[1], p[0] - c[0]), t = crossings(ring, c, a)
    const rr = Math.hypot(p[0] - c[0], p[1] - c[1])
    const onBal = t.length >= 2 && (rr - t[0] < 3 || t[t.length - 1] - rr < 3)
    const z = onBal ? BAL : ENT1
    const prof: Array<[number, number]> = onBal
      ? [[0.85, z - 0.1], [0.78, z + 2.6], [0.01, z + 3.3]]
      : [[0.75, z], [0.75, BAL], [0.5, BAL + 2.3], [0.01, BAL + 3.1]]
    lathe(trim, p[0], p[1], prof, 4, Math.PI / 4, 100)
  }
}

arm(NORTH, [0.46, 39.2], 10 * Math.PI / 180, 173 * Math.PI / 180, 'a0', 1)
arm(SOUTH, [2.2, -41.2], -6 * Math.PI / 180, -172 * Math.PI / 180, 'a0', -1)

// ---------------------------------------------------------------- the obelisk

{
  const g = ground(0, 0)
  // the platform (OSM way/23952126, 11 x 11 m, 1 m)
  prism(stone, rect(0, -0.17, 5.5, 5.4), g - 0.4, g + 1.0, 0.2)
  // the pedestal: plinth, die, cornice and the block the lions carry
  box(granite, 0, 0, 3.0, g + 1.0, g + 2.0, 0.15)
  box(granite, 0, 0, 2.4, g + 2.0, g + 6.6)
  box(granite, 0, 0, 2.8, g + 6.6, g + 7.4, 0.2)
  box(granite, 0, 0, 1.5, g + 7.4, g + 8.6)
  // the four bronze lions at the corners
  for (const [x, y] of [[1.75, 1.75], [-1.75, 1.75], [-1.75, -1.75], [1.75, -1.75]]) {
    lathe(bronze, x, y, [[0.8, g + 7.4], [0.7, g + 8.3], [0.01, g + 9.0]], 4, Math.PI / 4, 100)
  }
  // the shaft: 25.31 m, square, tapering, with a low pyramidion
  const S0 = 1.32 * Math.SQRT2, S1 = 0.92 * Math.SQRT2, Z0 = g + 8.6, Z1 = Z0 + 25.31
  lathe(granite, 0, 0, [[S0, Z0], [S1, Z1], [0.01, Z1 + 1.0]], 4, Math.PI / 4, 30)
  // the bronze crown (the Chigi mounts and star) and the cross, to ~40 m
  lathe(bronze, 0, 0, [[0.85, Z1 + 0.7], [0.85, Z1 + 1.6], [0.45, Z1 + 2.4], [0.01, Z1 + 2.7]], 6, 0, 70)
  box(bronze, 0, 0, 0.12, Z1 + 2.5, g + 40.0)
  prism(bronze, rect(0, 0, 0.12, 0.8), g + 38.6, g + 38.9)
}

// ---------------------------------------------------------------- the fountains

/** Maderno's design (1613), copied by Bernini (1677): basin, pedestal, two bowls. */
function fountain(x: number, y: number) {
  const g = ground(x, y)
  lathe(granite, x, y, [[5.0, g - 0.3], [5.0, g + 0.8], [4.6, g + 0.8], [4.6, g + 0.4], [0.01, g + 0.4]], 10, 0, 40)
  prism(granite, rect(x, y, 1.2, 1.2), g + 0.4, g + 2.8, 0.1)
  lathe(granite, x, y, [[0.9, g + 2.8], [2.85, g + 4.0], [2.85, g + 4.3], [0.8, g + 4.6], [0.5, g + 5.3],
    [2.1, g + 6.5], [2.1, g + 6.9], [0.01, g + 7.1]], 8, 0, 50)
}
fountain(-1.14 - 0.33, 59.06 + 0.32)
fountain(1.14 - 0.33, -59.84 + 0.32)

// ---------------------------------------------------------------- write

const up = (n: V3) => (n[2] > 0.7 ? 0.4 : 1)
const PARTS = [
  // Colours from photos 1-3, pulled to the palette's lightness: travertine,
  // whiter statues, the roofs' brown tile, the obelisk's grey-beige granite,
  // dark bronze.
  { part: stone, material: { ...finish('travertine', 0xebe1cd), floodlight: (_p: V3, n: V3) => 0.85 * up(n) } },
  { part: trim, material: { ...PALETTE.trim, floodlight: (_p: V3, n: V3) => 0.8 * up(n) } },
  { part: tile, material: finish('roof-tile', 0xb8977f, 0.9) },
  { part: granite, material: { ...finish('granite', 0xc9bba6), floodlight: (_p: V3, n: V3) => up(n) } },
  { part: bronze, material: finish('bronze', 0x6b5a4a) },
]
const triangles = PARTS.reduce((s, { part }) => s + part.triangles, 0)
const glb = writeGlb("St. Peter's Square", PARTS, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor', bearing: 359.5, osm: 'relation/12043628',
})
console.log(PARTS.map(({ part, material }) => `${material.name}: ${part.triangles}`).join(', '))
console.log(`${triangles} triangles, ${glb.length} bytes`)
if (triangles > 6500 && !process.env.PEEK) throw new Error(`triangle budget exceeded: ${triangles}`)
if (glb.length > 250 * 1024 && !process.env.PEEK) throw new Error(`file budget exceeded: ${glb.length}`)
await Bun.write(new URL('../models/rome-st-peters-square.glb', import.meta.url).pathname, glb)
