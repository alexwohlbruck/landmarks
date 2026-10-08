/**
 * AvidXchange Music Factory: the mill — procedural, CC0-1.0.
 * bun generators/music-factory-mill.ts
 *
 * The Music Factory is the John B. Ross and Company Mill (1904–c.1960), later
 * the Southern Asbestos Manufacturing Company plant, at Hamilton Street and NC
 * Music Factory Boulevard. It is two red-brick mills set in an inverted V
 * round a courtyard that opens south onto the boulevard, joined at the
 * courtyard's north end by a bridge section (Charlotte-Mecklenburg Historic
 * Landmarks Commission survey).
 *
 * - Mill #2, the west arm along Hamilton Street, holds The Fillmore Charlotte
 *   and The Underground: `fillmore-charlotte.ts`.
 * - This model is Mill #1, the east arm, with its east wing and the bridge.
 *   The 1904 mill along the courtyard is one tall storey there, with a long
 *   row of tall segmental-arched windows between brick piers, and two
 *   storeys on the east where the ground falls away; 1920s–1950s additions
 *   wrap it in flat-roofed brick, with the c.1955 dust-collector room and its
 *   brick tower on the east side. The bridge carries a taller block
 *   clad in pale metal and, on its courtyard face, the courtyard stage under
 *   a dark canopy.
 * - The amphitheatre north of the mill is `music-factory-amphitheatre.ts`.
 *
 * Evidence:
 *  - Lidar (USGS 3DEP NC Phase 4 Mecklenburg 2016, 1 m DSM and ground
 *    returns) for every roof height and the ground: the 1904 block's very low
 *    gable (eaves 221.5 m, ridge 222.3 m NAVD88), the 1920s south block and
 *    the east wing at ~222.9 m, the south projection at ~219.6 m, the east
 *    annex at ~218.6 m and the east wing's lower north strip at ~218.2 m; the
 *    dust tower at 227.4 m with its top at ~230.8 m; the bridge's metal-clad
 *    block at ~228 m, its west part at ~225 m and the box on it at ~230 m; the
 *    courtyard stage canopy at ~224.8 m. Ground: courtyard ~217 m, the
 *    boulevard side 216–217 m, the north end and east side ~214 m.
 *  - NAIP (USGS, public domain): the plan, dark membrane roofs on the 1904
 *    and south blocks, a white roof on the east wing, rows of rooftop plant.
 *  - Photos (Wikimedia Commons): Southern_Asbestos_Company_Mills.jpg (James
 *    Willamor, CC BY-SA 3.0, 2007 aerial from the north-east);
 *    Greenville,_Charlotte,_NC,_USA_-_panoramio.jpg (James Willamor, CC BY-SA
 *    3.0, 2009, from the seats: Mill #2's coped parapets and windows, the
 *    same brick and trim). The 2007 aerial shows Mill #1 from the east-north-
 *    east: the 1904 block's east face with two rows of square windows and a
 *    long metal canopy, the brick dust tower with plant on it, the east
 *    wing's pilasters and white roof, the bridge's metal-clad boxes. Mapillary street panoramas of 2022 on the boulevard (the
 *    south front behind trees, the courtyard stage and the bridge's metal
 *    block above it).
 *  - OSM: way/957549179 is Mill #1 (tagged there, wrongly, with The
 *    Fillmore's name: The Fillmore's door is on Mill #2's Hamilton Street
 *    side, in the Mapillary panoramas and HangingCurve's FillmoreCharlotte
 *    .jpg); way/414800516 is an older outline over both mills and the bridge,
 *    which `fillmore-charlotte` lists, so the two models are shown together;
 *    way/1202433658 is the courtyard stage canopy.
 *
 * Estimated: window counts and sizes (survey bay counts, the 2009 photo),
 * which openings are bricked up, the stage canopy's depth.
 *
 * This file also holds the small massing kit the three Music Factory
 * generators share (site frame, lidar ground, zoned prisms with coped brick
 * parapets, bays of arched or framed windows between brick piers). Its own
 * model is built only when it is run directly.
 *
 * Map frame: x east, y north, z up, metres; bearing 0. Everything is drawn in
 * a site frame round lng −80.8450, lat 35.2390 at absolute elevation, then
 * moved so each model's origin is its outline's centroid on its lowest ground.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, type Swatch } from './palette'

// ---------------------------------------------------------------------------
// Site frame and ground.

export type XY = [number, number]
export const ORIGIN = { lng: -80.845, lat: 35.239 }
const KX = 111320 * Math.cos((ORIGIN.lat * Math.PI) / 180), KY = 110574
export const toLngLat = (p: XY) => [+(ORIGIN.lng + p[0] / KX).toFixed(7), +(ORIGIN.lat + p[1] / KY).toFixed(7)]

/**
 * Bare ground from the 2016 lidar's ground returns, metres NAVD88, on a 5 m
 * grid: x −115…65, y 170 (first row) … −30. Under the buildings, where there
 * are no ground returns, it is filled smoothly from the ground round them.
 */
const DEM = `214.0 213.9 214.0 214.0 213.6 211.9 211.4 211.2 211.2 211.1 211.1 210.5 210.0 209.6 209.3 209.2 209.2 209.2 209.3 209.4 209.4 209.4 209.4 209.5 209.6 209.5 209.7 209.9 210.3 211.0 212.3 211.8 210.7 210.7 210.5 210.3 210.2
214.0 214.0 214.0 213.5 212.5 211.9 211.5 211.4 211.3 211.3 211.2 210.4 210.0 209.6 209.3 209.2 209.1 209.2 209.4 209.5 209.5 209.4 209.4 209.4 209.5 209.6 209.8 210.1 210.9 211.5 212.4 211.4 210.9 210.9 210.8 210.6 210.5
213.8 213.4 213.0 212.8 212.3 211.8 211.6 211.5 211.5 211.5 211.4 211.2 210.2 209.8 209.3 209.1 209.1 209.4 209.6 209.6 209.8 209.7 209.6 209.5 209.5 209.7 209.9 210.2 211.2 212.1 212.3 211.2 211.1 211.0 210.9 210.8 210.7
212.9 213.1 213.1 212.7 212.2 211.8 211.8 211.7 211.6 211.6 211.5 211.4 211.3 210.2 210.2 210.1 209.0 209.5 209.7 209.8 209.9 209.9 209.8 209.7 209.7 209.8 210.0 210.6 211.3 211.8 211.7 211.3 211.2 211.2 211.2 211.0 210.9
212.6 212.4 212.3 212.2 212.1 211.9 211.9 211.9 211.9 211.7 211.6 211.4 211.2 210.1 210.2 210.2 209.8 209.8 209.9 209.9 209.9 210.0 210.0 210.0 210.0 210.1 210.2 210.5 211.4 211.7 211.6 211.5 211.4 211.4 211.3 211.2 211.1
212.6 212.4 212.2 212.1 212.2 212.1 212.1 212.1 212.1 211.9 211.7 211.5 210.2 210.1 210.1 210.2 210.1 210.1 210.1 210.1 210.1 210.1 210.0 210.0 210.1 210.2 210.2 210.3 215.4 215.6 215.8 216.0 216.0 211.5 211.5 211.4 211.3
212.9 212.5 212.4 212.4 212.4 212.3 212.3 212.3 212.2 212.1 211.9 211.8 210.2 210.2 210.2 210.4 210.4 210.4 210.3 210.3 210.2 210.2 210.1 210.2 210.2 210.2 210.2 214.8 215.1 215.3 215.6 215.8 216.0 216.1 211.7 211.6 211.6
213.8 213.0 212.6 212.6 212.6 212.5 212.5 212.4 212.4 212.2 212.1 212.1 211.3 211.0 210.9 210.9 210.8 210.7 210.6 210.4 210.3 210.3 210.2 210.2 210.2 210.1 213.1 214.6 214.8 215.1 215.3 215.6 215.8 216.0 216.2 211.9 211.8
214.2 214.0 213.1 212.8 212.8 212.7 212.7 212.5 212.4 212.4 212.4 212.6 212.0 211.7 211.5 211.3 211.2 211.0 210.8 210.6 210.4 210.3 210.2 210.2 210.2 210.1 214.2 214.3 214.5 214.8 215.1 215.3 215.6 215.9 216.2 212.4 212.2
213.9 214.1 213.4 213.1 213.0 212.9 212.9 212.7 212.6 212.6 212.6 212.6 212.5 212.3 212.1 211.8 211.5 211.2 211.0 210.7 210.5 210.3 210.2 210.2 210.1 213.1 213.7 214.2 214.3 214.5 214.8 215.1 215.4 215.7 216.0 216.2 212.5
214.8 214.3 213.6 213.2 213.2 213.1 213.2 213.0 212.8 212.6 212.6 212.8 213.1 212.9 212.8 212.4 211.9 211.5 211.2 210.8 210.5 210.3 210.1 210.1 210.1 212.9 213.1 213.7 214.2 214.3 214.5 214.9 215.2 215.6 215.9 216.2 212.9
214.8 214.3 213.7 213.5 213.4 213.4 213.4 213.2 212.9 212.8 212.8 212.9 213.2 213.5 213.8 212.9 212.2 211.7 211.3 210.9 210.5 210.2 210.1 210.2 210.1 212.4 212.6 213.0 213.7 214.2 214.3 214.7 215.1 215.4 215.8 216.1 213.3
214.8 214.1 213.8 213.6 213.5 213.6 213.6 213.2 213.1 212.9 212.9 212.9 213.3 213.7 213.9 213.0 212.4 211.9 211.4 210.9 210.5 210.2 210.2 211.9 212.0 212.1 212.2 212.4 213.1 213.7 214.2 214.5 214.9 215.3 215.7 216.0 213.7
214.9 214.1 213.9 213.8 213.7 213.8 213.6 213.3 213.1 213.0 212.9 213.0 213.3 213.9 213.5 213.0 212.5 212.0 211.5 211.0 210.5 210.4 210.4 211.8 211.8 211.8 211.9 212.2 213.0 213.1 213.2 214.3 214.8 215.2 215.6 215.8 214.1
214.8 214.3 214.1 214.0 214.0 213.9 213.7 213.4 213.2 213.1 213.0 213.0 213.1 213.3 213.2 212.9 212.5 212.1 211.6 211.1 210.5 210.5 211.6 211.7 211.7 211.7 211.8 212.1 212.4 213.0 213.7 214.2 214.6 215.1 215.5 215.7 214.4
214.7 214.4 214.3 214.2 214.2 214.1 213.8 213.5 213.2 213.1 213.0 212.9 212.9 213.1 213.1 212.9 212.6 212.3 211.8 211.2 211.0 210.8 211.6 211.6 211.6 211.7 211.8 211.9 212.2 212.7 213.6 214.2 214.4 214.9 215.3 215.5 214.7
214.7 214.6 214.5 214.5 214.3 214.0 213.8 213.5 213.2 213.0 212.9 212.9 212.9 213.0 213.1 213.0 212.8 212.6 212.2 211.7 211.4 211.2 211.6 211.6 211.6 211.7 211.7 211.8 212.1 212.5 213.1 214.2 214.4 214.9 215.2 215.3 214.8
214.8 214.8 214.7 214.7 214.3 214.3 213.9 213.4 213.2 213.0 212.8 212.8 213.0 213.1 213.2 213.2 213.1 213.0 212.8 212.3 212.1 212.1 212.1 211.9 211.6 211.6 211.7 211.8 212.1 212.5 213.1 214.1 214.3 214.8 215.1 215.2 214.8
215.0 214.9 214.9 215.0 215.0 214.6 214.2 213.7 213.4 212.9 212.8 213.0 213.2 213.3 213.3 213.4 213.4 213.5 213.6 213.2 213.5 212.9 212.7 212.4 211.7 211.7 211.8 211.9 212.2 212.6 213.1 214.2 214.3 214.6 215.0 215.0 214.9
215.1 215.1 215.1 215.2 215.2 214.8 214.4 214.0 213.7 213.4 213.3 213.3 213.4 213.5 213.6 213.6 213.7 213.8 213.8 213.6 213.5 213.5 213.4 213.4 213.2 213.1 211.8 212.0 212.3 213.0 213.6 213.9 214.2 214.6 214.8 214.9 214.9
215.3 215.3 215.3 215.4 215.2 214.9 214.6 214.3 214.0 213.8 213.6 213.6 213.7 213.7 213.8 213.8 213.9 213.9 213.9 213.8 213.6 213.6 213.5 213.5 213.3 213.2 213.1 213.0 212.7 213.1 213.6 213.8 214.1 214.4 214.6 214.7 214.8
215.5 215.5 215.5 215.4 215.3 215.2 214.8 214.5 214.2 214.0 213.9 213.9 213.9 213.9 214.0 214.0 214.1 214.1 214.1 213.9 213.8 213.7 213.7 213.7 213.6 213.4 213.3 213.2 213.2 213.4 213.6 213.9 214.1 214.4 214.6 214.7 214.7
215.7 215.7 215.6 215.4 215.2 215.1 215.1 214.8 214.2 214.1 214.1 214.1 214.1 214.2 214.2 214.2 214.3 214.2 214.2 214.2 214.0 213.9 213.8 213.8 213.7 213.5 213.4 213.4 213.4 213.6 213.8 214.0 214.2 214.3 214.7 214.9 214.8
216.0 215.9 215.6 215.3 215.2 215.1 214.8 214.8 213.9 214.0 214.2 214.3 214.4 214.4 214.4 214.4 214.3 214.3 214.3 214.3 214.1 214.0 213.9 213.8 213.7 213.6 213.5 213.5 213.6 213.8 213.9 214.1 214.2 214.4 214.6 215.1 215.1
216.2 216.1 215.6 215.4 215.2 215.1 214.8 214.5 214.2 214.3 214.4 214.5 214.6 214.6 214.6 214.6 214.6 214.5 214.4 214.4 214.3 214.1 214.0 213.8 213.7 213.6 213.6 213.6 213.8 213.9 214.0 214.1 214.3 214.4 214.6 215.2 215.3
216.4 215.9 215.6 215.4 215.2 215.1 214.7 214.5 214.4 214.6 214.7 214.8 214.9 214.9 214.8 214.8 214.8 214.7 214.4 214.4 214.4 214.2 214.0 213.7 213.7 213.6 213.6 213.7 213.8 214.0 214.0 214.1 214.2 214.4 214.6 214.9 215.3
216.5 216.0 215.7 215.5 215.3 215.1 214.8 214.6 214.6 214.8 215.0 215.2 215.3 215.2 215.0 215.1 215.1 215.0 214.8 214.6 214.7 214.5 214.1 213.7 213.7 213.7 213.7 213.8 213.9 214.0 214.1 214.2 214.3 214.5 214.7 214.7 215.2
216.5 216.1 215.8 215.6 215.4 215.2 214.9 214.7 214.7 215.1 215.4 215.6 215.8 215.8 214.8 215.4 215.6 215.5 215.0 215.0 215.1 214.8 214.3 213.7 213.7 213.6 213.7 213.8 213.9 214.0 214.1 214.3 214.4 214.6 214.8 214.8 215.3
216.6 216.3 216.0 215.8 215.5 215.4 215.5 214.9 215.0 215.5 215.8 216.1 216.5 217.3 216.1 216.1 216.3 216.4 216.9 216.9 216.1 215.3 214.5 213.7 213.7 213.6 213.7 213.8 213.9 214.1 214.2 214.3 214.4 214.6 214.8 214.8 215.2
216.8 216.5 216.2 215.9 215.7 215.7 215.9 215.9 215.8 216.0 216.2 216.5 216.9 217.2 217.1 217.1 217.1 216.9 216.9 216.8 217.0 215.7 214.7 213.8 213.7 213.7 213.7 213.9 214.0 214.1 214.2 214.3 214.4 214.6 214.8 214.7 215.1
217.3 217.2 216.4 216.2 215.9 216.1 216.1 216.2 216.2 216.4 216.6 216.9 217.3 217.2 217.0 216.9 216.9 216.9 216.8 216.9 217.0 216.0 215.0 213.7 213.7 213.8 213.8 213.9 214.0 214.1 214.2 214.3 214.4 214.5 214.8 214.7 215.1
217.4 217.3 217.2 217.2 216.6 216.1 216.3 216.5 216.6 216.7 216.9 217.1 217.2 217.2 217.0 216.9 216.8 216.8 216.8 216.9 217.0 216.2 215.4 214.6 213.9 213.8 213.8 214.1 214.1 214.2 214.2 214.3 214.3 214.2 214.2 214.7 215.2
217.3 217.5 217.5 217.6 217.2 217.0 216.9 216.9 217.0 217.1 217.2 217.3 217.3 217.1 217.0 216.9 216.8 216.7 216.7 216.9 217.0 216.4 215.8 215.2 214.8 214.5 214.4 214.3 214.3 214.2 214.1 214.1 214.2 214.1 214.2 214.8 215.7
217.4 217.4 217.5 217.6 217.6 217.6 217.4 217.3 217.3 217.3 217.4 217.4 217.3 217.1 217.0 216.9 216.9 216.8 216.8 216.9 217.1 216.6 216.2 215.8 215.5 215.2 214.9 214.6 214.4 214.2 214.0 214.1 214.0 214.0 214.7 215.2 216.0
217.4 217.4 217.5 217.4 217.5 217.6 217.6 217.7 217.7 217.6 217.7 217.5 217.3 217.2 217.1 217.1 216.9 216.9 216.9 217.1 217.1 216.9 216.6 216.3 216.1 215.8 215.3 214.8 214.5 214.3 214.2 214.1 214.1 214.4 214.9 215.8 216.0
217.4 217.5 217.5 217.5 217.5 217.5 217.5 217.6 217.7 217.7 217.7 217.6 217.6 217.3 217.2 217.2 217.1 217.0 217.0 217.1 217.2 217.1 217.0 216.9 216.7 216.5 215.9 214.9 214.5 214.3 214.2 214.2 214.2 214.5 215.4 215.9 216.0
216.3 216.4 217.4 217.6 217.6 217.5 217.5 217.6 217.6 217.6 217.6 217.7 217.6 217.6 217.6 217.4 217.3 217.3 217.2 217.2 217.3 217.3 217.5 217.5 217.5 217.5 216.9 214.3 214.3 214.2 214.2 214.2 214.3 215.1 215.8 216.0 216.0
216.2 216.3 216.4 216.5 216.6 217.4 217.5 217.6 217.6 217.6 217.6 217.6 217.6 217.6 217.7 217.7 217.7 217.7 217.6 217.4 217.3 217.3 217.3 217.4 217.4 217.4 215.5 214.9 214.4 214.5 214.5 214.5 214.7 215.7 216.0 216.0 216.0
217.4 216.5 216.3 216.5 216.5 216.5 216.7 216.8 217.2 217.6 217.6 217.6 217.6 217.7 217.7 217.7 217.7 217.7 217.8 217.7 217.7 217.5 217.4 217.4 217.5 217.3 216.4 215.8 215.4 215.2 215.1 215.0 215.5 215.9 216.0 216.0 215.9
219.0 219.0 219.0 217.1 216.8 216.5 216.7 216.7 216.7 216.8 216.9 217.4 217.7 217.7 217.7 217.7 217.7 217.7 217.7 217.7 217.8 217.8 217.8 217.7 217.7 217.4 217.1 216.6 216.1 215.9 215.8 215.9 216.0 216.1 216.0 215.9 215.9
219.0 219.2 219.1 219.1 219.1 218.4 217.2 216.6 216.6 216.8 216.8 216.9 217.0 217.1 217.6 217.8 217.8 217.8 217.8 217.7 217.7 217.7 217.6 217.7 217.7 217.6 217.6 217.4 217.0 216.6 216.4 216.3 216.4 216.2 216.0 215.9 215.9`
  .split('\n').map((r) => r.trim().split(/\s+/).map(Number))
const GX = -115, GY = 170, GS = 5
/** Ground elevation at a site point, bilinear on the grid. */
export function ground(p: XY): number {
  const nx = DEM[0].length - 1, ny = DEM.length - 1
  const fx = Math.min(nx - 0.001, Math.max(0, (p[0] - GX) / GS)), fy = Math.min(ny - 0.001, Math.max(0, (GY - p[1]) / GS))
  const i = Math.floor(fx), j = Math.floor(fy), u = fx - i, v = fy - j
  return (DEM[j][i] * (1 - u) + DEM[j][i + 1] * u) * (1 - v) + (DEM[j + 1][i] * (1 - u) + DEM[j + 1][i + 1] * u) * v
}

// ---------------------------------------------------------------------------
// Polygons.

const area2 = (P: XY[]) => P.reduce((s, p, i) => { const q = P[(i + 1) % P.length]; return s + p[0] * q[1] - q[0] * p[1] }, 0)
/** Counter-clockwise, without repeated or collinear corners. */
export function clean(P: XY[]): XY[] {
  let Q = P.filter((p, i) => { const q = P[(i + 1) % P.length]; return Math.hypot(p[0] - q[0], p[1] - q[1]) > 0.05 })
  if (area2(Q) < 0) Q = Q.reverse()
  for (let again = true; again && Q.length > 3;) {
    again = false
    for (let i = 0; i < Q.length; i++) {
      const a = Q[(i + Q.length - 1) % Q.length], b = Q[i], c = Q[(i + 1) % Q.length]
      const cr = (b[0] - a[0]) * (c[1] - b[1]) - (b[1] - a[1]) * (c[0] - b[0])
      const L = Math.hypot(c[0] - a[0], c[1] - a[1])
      if (Math.abs(cr) / Math.max(L, 1e-6) < 0.02) { Q.splice(i, 1); again = true; break }
    }
  }
  return Q
}
/** Keep the side of the line through `a` along `d` that lies to its left. */
export function clip(P: XY[], a: XY, d: XY): XY[] {
  const side = (p: XY) => d[0] * (p[1] - a[1]) - d[1] * (p[0] - a[0])
  const out: XY[] = []
  for (let i = 0; i < P.length; i++) {
    const p = P[i], q = P[(i + 1) % P.length], sp = side(p), sq = side(q)
    if (sp >= 0) out.push(p)
    if ((sp >= 0) !== (sq >= 0)) { const t = sp / (sp - sq); out.push([p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t]) }
  }
  return out
}
/** An axis frame: s along bearing `deg`, t to its right (east of north-up). */
export function axes(deg: number) {
  const b = (deg * Math.PI) / 180, u: XY = [Math.sin(b), Math.cos(b)], r: XY = [Math.cos(b), -Math.sin(b)]
  return {
    u, r,
    s: (p: XY) => p[0] * u[0] + p[1] * u[1],
    t: (p: XY) => p[0] * r[0] + p[1] * r[1],
    at: (s: number, t: number): XY => [u[0] * s + r[0] * t, u[1] * s + r[1] * t],
    /** The part of P with s0 ≤ s ≤ s1 and t0 ≤ t ≤ t1. */
    band(P: XY[], s0 = -1e4, s1 = 1e4, t0 = -1e4, t1 = 1e4): XY[] {
      let Q = P
      const L: XY = [-r[0], -r[1]]
      Q = clip(Q, this.at(s0, 0), r)      // keep s ≥ s0: moving along +r, left is +u
      Q = clip(Q, this.at(s1, 0), L)
      Q = clip(Q, this.at(0, t0), [-u[0], -u[1]])
      Q = clip(Q, this.at(0, t1), u)
      return Q.length >= 3 ? clean(Q) : []
    },
  }
}
export function inside(P: XY[], p: XY) {
  let c = false
  for (let i = 0, j = P.length - 1; i < P.length; j = i++) {
    const [xi, yi] = P[i], [xj, yj] = P[j]
    if ((yi > p[1]) !== (yj > p[1]) && p[0] < ((xj - xi) * (p[1] - yi)) / (yj - yi) + xi) c = !c
  }
  return c
}
export const centroid = (P: XY[]): XY => {
  const Q = clean(P); let a = 0, x = 0, y = 0
  for (let i = 0; i < Q.length; i++) {
    const p = Q[i], q = Q[(i + 1) % Q.length], c = p[0] * q[1] - q[0] * p[1]
    a += c; x += (p[0] + q[0]) * c; y += (p[1] + q[1]) * c
  }
  return [x / (3 * a), y / (3 * a)]
}
/** Lowest ground under a footprint: its corners and a 4 m grid inside. */
export function lowest(P: XY[]): number {
  let m = Math.min(...P.map(ground))
  const xs = P.map((p) => p[0]), ys = P.map((p) => p[1])
  for (let x = Math.min(...xs); x <= Math.max(...xs); x += 4)
    for (let y = Math.min(...ys); y <= Math.max(...ys); y += 4) if (inside(P, [x, y])) m = Math.min(m, ground([x, y]))
  return m
}

/** Ear-clipping triangulation of a simple counter-clockwise polygon. */
export function earcut(pts: XY[]): [number, number, number][] {
  const idx = pts.map((_, i) => i), out: [number, number, number][] = []
  const cz = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const tin = (p: XY, a: XY, b: XY, c: XY) => cz(a, b, p) > 1e-9 && cz(b, c, p) > 1e-9 && cz(c, a, p) > 1e-9
  for (let guard = 0; idx.length > 3 && guard < 10000; guard++) {
    let cut = false
    for (let k = 0; k < idx.length; k++) {
      const i0 = idx[(k + idx.length - 1) % idx.length], i1 = idx[k], i2 = idx[(k + 1) % idx.length]
      if (cz(pts[i0], pts[i1], pts[i2]) <= 1e-9) continue
      if (idx.some((j) => j !== i0 && j !== i1 && j !== i2 && tin(pts[j], pts[i0], pts[i1], pts[i2]))) continue
      out.push([i0, i1, i2]); idx.splice(k, 1); cut = true; break
    }
    if (!cut) break
  }
  if (idx.length === 3) out.push([idx[0], idx[1], idx[2]])
  return out
}

// ---------------------------------------------------------------------------
// Faces with explicit normals, winding fixed to agree.

const unit = (v: V3): V3 => { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l] }
export function tri(p: Part, a: V3, b: V3, c: V3, n?: V3) {
  const e1: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], e2: V3 = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  const f: V3 = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]]
  if (Math.hypot(...f) < 1e-9) return
  const N = unit(n ?? f)
  if (f[0] * N[0] + f[1] * N[1] + f[2] * N[2] >= 0) p.tri(a, b, c, undefined, undefined, undefined, [N, N, N])
  else p.tri(a, c, b, undefined, undefined, undefined, [N, N, N])
}
export function quad(p: Part, a: V3, b: V3, c: V3, d: V3, n?: V3) { tri(p, a, b, c, n); tri(p, a, c, d, n) }
/** A closed box between two heights over a convex counter-clockwise ring. */
export function solid(p: Part, ring: XY[], z0: number, z1: number | ((q: XY) => number), top: Part = p) {
  const Z = typeof z1 === 'number' ? () => z1 : z1
  for (let i = 0; i < ring.length; i++) {
    const A = ring[i], B = ring[(i + 1) % ring.length]
    quad(p, [A[0], A[1], z0], [B[0], B[1], z0], [B[0], B[1], Z(B)], [A[0], A[1], Z(A)], [B[1] - A[1], A[0] - B[0], 0])
  }
  for (let i = 1; i < ring.length - 1; i++) {
    const P = (q: XY): V3 => [q[0], q[1], Z(q)]
    tri(top, P(ring[0]), P(ring[i]), P(ring[i + 1]), [0, 0, 1])
  }
}
/**
 * A box with its upright edges chamfered by `b` and a chamfered lip of `b`
 * round its top, for towers and clad blocks: the soft edges catch the light.
 * `ring` is a convex counter-clockwise rectangle (four corners).
 */
export function softBox(p: Part, ring: XY[], z0: number, z1: number, b: number, top: Part = p) {
  const c: XY = [ring.reduce((s, q) => s + q[0], 0) / ring.length, ring.reduce((s, q) => s + q[1], 0) / ring.length]
  const cut: XY[] = []
  ring.forEach((q, i) => {
    const a = ring[(i + ring.length - 1) % ring.length], d = ring[(i + 1) % ring.length]
    const to = (r: XY): XY => { const L = Math.hypot(r[0] - q[0], r[1] - q[1]); return [q[0] + (r[0] - q[0]) / L * b, q[1] + (r[1] - q[1]) / L * b] }
    cut.push(to(a), to(d))
  })
  const shrink = (r: XY[], k: number): XY[] => r.map((q) => { const dx = q[0] - c[0], dy = q[1] - c[1], L = Math.hypot(dx, dy); return [q[0] - dx / L * k, q[1] - dy / L * k] as XY })
  const lid = shrink(cut, b * 1.2)
  const n = cut.length
  for (let i = 0; i < n; i++) {
    const A = cut[i], B = cut[(i + 1) % n], a = lid[i], d = lid[(i + 1) % n]
    const o: V3 = [B[1] - A[1], A[0] - B[0], 0]
    quad(p, [A[0], A[1], z0], [B[0], B[1], z0], [B[0], B[1], z1 - b], [A[0], A[1], z1 - b], o)
    quad(p, [A[0], A[1], z1 - b], [B[0], B[1], z1 - b], [d[0], d[1], z1], [a[0], a[1], z1], [o[0], o[1], 1])
  }
  for (let i = 1; i < n - 1; i++) tri(top, [lid[0][0], lid[0][1], z1], [lid[i][0], lid[i][1], z1], [lid[i + 1][0], lid[i + 1][1], z1], [0, 0, 1])
}

// ---------------------------------------------------------------------------
// Zoned massing. A building is a set of zones that tile its footprint; each
// has a planar roof. Walls on the outline run from below ground to the roof;
// steps between zones get a wall where one roof stands above the next. Flat
// zones get a brick parapet with a pale chamfered coping, the roof deck sunk
// behind it; gabled zones a deep eave.

export type Mats = {
  wall: Part; roof: Part; eave: Part; win: Part
  /** Bricked-up openings, a shade darker than the wall. Omitted: plain wall. */
  infill?: Part
  /** Painted window frames, for zones that ask for them. */
  frame?: Part
  /** Flat decks behind parapets, if not `roof`. */
  deck?: Part
}
export type Zone = {
  poly: XY[]
  /** Roof elevation at a point (planar within the zone); a parapet's top. */
  z: (p: XY) => number
  /** Overhanging eave instead of a parapet. */
  eave?: boolean
  /** Window rows, absolute elevations [sill, head], and their pitch. */
  rows?: [number, number][]
  pitch?: number
  winW?: number
  /** Square-headed (mid-century steel) windows rather than segmental arches. */
  square?: boolean
  /** Brick piers between the bays, as on the early mills. */
  piers?: boolean
  /** Which openings are bricked up: by the wall's outward normal, row and bay. */
  infill?: (o: XY, row: number, k: number) => boolean
  /** Which walls (by outward normal) get painted frames round their windows. */
  frame?: (o: XY) => boolean
  wall?: Part
  roof?: Part
}
export const flatZ = (z: number) => () => z
/** A gable half: ridge at t = tc, falling `k` per metre away from it. */
export const gableZ = (ax: ReturnType<typeof axes>, tc: number, ridge: number, k: number) => (p: XY) => ridge - k * Math.abs(ax.t(p) - tc)
/** A stable pseudo-random fraction for a point, so infill patterns don't shimmer between builds. */
export const hash = (p: XY, k = 0) => { const x = Math.sin(p[0] * 127.1 + p[1] * 311.7 + k * 74.7) * 43758.5453; return x - Math.floor(x) }

/** Parapet height above the roof deck, coping width, its chamfer, eave overhang, wall depth below ground. */
const PARA = 0.6, CAP = 0.45, CHAMFER = 0.18, EAVE = 0.8, BURY = 3
/** The roof deck: a flat zone's sits behind its parapet. */
const deck = (zn: Zone, q: XY) => zn.z(q) - (zn.eave ? 0 : PARA)
/**
 * Build zones. `party` lists outline segments shared with a neighbouring
 * model, which get no windows.
 */
export function build(zones: Zone[], m: Mats, party: [XY, XY][] = []) {
  for (const zn of zones) zn.poly = clean(zn.poly)
  const zoneAt = (q: XY) => zones.find((zn) => inside(zn.poly, q))
  const onParty = (A: XY, B: XY) => party.some(([p, q]) => {
    const d = (r: XY) => { const L = Math.hypot(q[0] - p[0], q[1] - p[1]); return Math.abs((q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0])) / L }
    return d(A) < 0.6 && d(B) < 0.6
  })
  for (const zn of zones) {
    const P = zn.poly, n = P.length, wall = zn.wall ?? m.wall, roof = zn.roof ?? (zn.eave ? m.roof : m.deck ?? m.roof)
    // Classify each edge: outline (no zone beyond it) or a step to a neighbour.
    const edges = P.map((A, i) => {
      const B = P[(i + 1) % n], L = Math.hypot(B[0] - A[0], B[1] - A[1])
      const o: XY = [(B[1] - A[1]) / L, (A[0] - B[0]) / L]
      const probe = (f: number): XY => [A[0] + (B[0] - A[0]) * f + o[0] * 0.15, A[1] + (B[1] - A[1]) * f + o[1] * 0.15]
      const nb = zoneAt(probe(0.5)) ?? zoneAt(probe(0.25)) ?? zoneAt(probe(0.75))
      return { A, B, L, o, nb }
    })
    const outer = edges.map((e) => !e.nb)
    const para = !zn.eave
    /** The outline moved inward by `w` along outline edges only. */
    const inset = (w: number): XY[] => {
      const d = edges.map((_, i) => (para && outer[i] ? w : 0))
      return P.map((p, i) => {
        const j = (i + n - 1) % n, e0 = edges[j], e1 = edges[i]
        const a0: XY = [p[0] - e0.o[0] * d[j], p[1] - e0.o[1] * d[j]], a1: XY = [p[0] - e1.o[0] * d[i], p[1] - e1.o[1] * d[i]]
        const t0: XY = [e0.B[0] - e0.A[0], e0.B[1] - e0.A[1]], t1: XY = [e1.B[0] - e1.A[0], e1.B[1] - e1.A[1]]
        const den = t0[0] * t1[1] - t0[1] * t1[0]
        if (Math.abs(den) < 1e-6) return a1
        const k = ((a1[0] - a0[0]) * t1[1] - (a1[1] - a0[1]) * t1[0]) / den
        return [a0[0] + t0[0] * k, a0[1] + t0[1] * k] as XY
      })
    }
    const lid = inset(CAP), lip = inset(CHAMFER)
    for (const [i, j, k] of earcut(lid)) {
      const V = (q: XY): V3 => [q[0], q[1], deck(zn, q)]
      tri(roof, V(lid[i]), V(lid[j]), V(lid[k]), [0, 0, 1])
    }
    edges.forEach((e, i) => {
      const { A, B, o } = e, i1 = (i + 1) % n
      if (outer[i]) {
        const base = Math.min(ground(A), ground(B)) - BURY
        // A parapet's brick stops under its coping; an eave's at the roof.
        const top = (q: XY) => zn.z(q) - (para ? CHAMFER : 0)
        quad(wall, [A[0], A[1], base], [B[0], B[1], base], [B[0], B[1], top(B)], [A[0], A[1], top(A)], [o[0], o[1], 0])
        if (para) {
          // The coping: a chamfered pale cap on the parapet, the line that
          // finishes every flat-roofed section in the photos.
          const a1 = lip[i], b1 = lip[i1], a2 = lid[i], b2 = lid[i1], Z = (q: XY) => zn.z(q)
          quad(m.eave, [A[0], A[1], top(A)], [B[0], B[1], top(B)], [b1[0], b1[1], Z(b1)], [a1[0], a1[1], Z(a1)], [o[0], o[1], 1])
          quad(m.eave, [a1[0], a1[1], Z(a1)], [b1[0], b1[1], Z(b1)], [b2[0], b2[1], Z(b2)], [a2[0], a2[1], Z(a2)], [0, 0, 1])
          // The parapet's inner face, down to the deck.
          quad(wall, [a2[0], a2[1], Z(a2)], [b2[0], b2[1], Z(b2)], [b2[0], b2[1], deck(zn, b2)], [a2[0], a2[1], deck(zn, a2)], [-o[0], -o[1], 0])
          // Close the parapet's ends where the outline meets a neighbour.
          const cap = (p: XY, q: XY, f: { o: XY }) =>
            quad(wall, [p[0], p[1], deck(zn, p)], [q[0], q[1], deck(zn, q)], [q[0], q[1], Z(q)], [p[0], p[1], Z(p)], [f.o[0], f.o[1], 0])
          if (!outer[(i + n - 1) % n]) cap(A, a2, edges[(i + n - 1) % n])
          if (!outer[i1]) cap(B, b2, edges[i1])
        }
        if (zn.eave) {
          // The eave: roof carried out past the wall, a fascia and a soffit.
          const ext = (q: XY, s: number): XY => [q[0] + o[0] * EAVE + (B[0] - A[0]) / e.L * s, q[1] + o[1] * EAVE + (B[1] - A[1]) / e.L * s]
          const convex = (k: number) => { const f = edges[k], g = edges[(k + 1) % n]; return f.o[0] * g.o[1] - f.o[1] * g.o[0] > 0 }
          const sa = outer[(i + n - 1) % n] && convex((i + n - 1) % n) ? -EAVE : 0, sb = outer[i1] && convex(i) ? EAVE : 0
          const a3 = ext(A, sa), b3 = ext(B, sb)
          const za = zn.z(A) - 0.15, zb = zn.z(B) - 0.15
          quad(roof, [A[0], A[1], zn.z(A) + 0.02], [B[0], B[1], zn.z(B) + 0.02], [b3[0], b3[1], zb], [a3[0], a3[1], za], [o[0] * 0.3, o[1] * 0.3, 1])
          quad(m.eave, [a3[0], a3[1], za], [b3[0], b3[1], zb], [b3[0], b3[1], zb - 0.35], [a3[0], a3[1], za - 0.35], [o[0], o[1], 0])
          quad(m.eave, [A[0], A[1], zn.z(A) - 0.6], [B[0], B[1], zn.z(B) - 0.6], [b3[0], b3[1], zb - 0.35], [a3[0], a3[1], za - 0.35], [0, 0, -1])
        }
        // Piers and windows stop under the soffit or the coping.
        const under = (q: XY) => zn.z(q) - (para ? 0.3 : 0.6)
        if (zn.rows && e.L > 4 && !onParty(A, B)) windows(m, e, zn, under, base)
      } else {
        // A step: wall only where this deck stands above the neighbour's.
        const nb = e.nb!, hi = (q: XY) => deck(zn, q), lo = (q: XY) => Math.min(deck(nb, q), hi(q))
        if (hi(A) - deck(nb, A) > 0.05 || hi(B) - deck(nb, B) > 0.05)
          quad(wall, [A[0], A[1], lo(A)], [B[0], B[1], lo(B)], [B[0], B[1], hi(B)], [A[0], A[1], hi(A)], [o[0], o[1], 0])
      }
    })
  }
}

/**
 * Door positions on the outline; windows keep clear of them. `r` is the
 * door's half-width plus its margin. On a wall with a door, the bays are
 * laid out from the door outwards, so the door sits in the run of windows
 * rather than knocking holes in a grid.
 */
export const DOORS: { p: XY; r: number }[] = []

/** Rooftop plant: small pale boxes standing on the deck, `[x, y, roof z, bearing]` each. */
export function plant(p: Part, units: [number, number, number, number][]) {
  for (const [x, y, z, deg] of units) {
    const a = axes(deg), c: XY = [x, y]
    const ring = clean([[-1.6, -1.1], [1.6, -1.1], [1.6, 1.1], [-1.6, 1.1]].map(([s, t]) => { const q = a.at(s, t); return [q[0] + c[0], q[1] + c[1]] as XY }))
    solid(p, ring, z - PARA - 0.2, z + 0.9)
  }
}

/**
 * The bay rhythm of one outline wall: brick piers standing proud between the
 * bays, and in each bay a window per row, its panel set on the wall between
 * the piers. Early openings have segmental arched heads; steel ones are
 * square, optionally in a painted frame.
 */
function windows(m: Mats, e: { A: XY; B: XY; L: number; o: XY }, zn: Zone, under: (q: XY) => number, base: number) {
  const pitch = zn.pitch ?? 4, w = zn.winW ?? 1.7, count = Math.floor((e.L - 1.2) / pitch)
  if (count < 1) return
  const u: XY = [(e.B[0] - e.A[0]) / e.L, (e.B[1] - e.A[1]) / e.L], start = (e.L - count * pitch) / 2
  const N: V3 = [e.o[0], e.o[1], 0]
  const P = (s: number, z: number, d = 0.05): V3 => [e.A[0] + u[0] * s + e.o[0] * d, e.A[1] + u[1] * s + e.o[1] * d, z]
  const at = (s: number): XY => [e.A[0] + u[0] * s, e.A[1] + u[1] * s]
  const near = (q: XY, r = 0) => DOORS.some((d) => Math.hypot(q[0] - d.p[0], q[1] - d.p[1]) < d.r + r)
  if (zn.piers) {
    const pw = Math.max(0.6, pitch - w - 0.6), D = 0.3, b = 0.12
    for (let k = 0; k <= count; k++) {
      const c = start + pitch * k, s0 = c - pw / 2, s1 = c + pw / 2
      // A pier never runs past the wall's ends, or across a door.
      if (s0 < 0.2 || s1 > e.L - 0.2 || near(at(c), pw / 2)) continue
      const z0 = under(at(s0)), z1 = under(at(s1))
      // Face, chamfered sides, and a sloped top under the coping.
      quad(m.wall, P(s0 + b, base, D), P(s1 - b, base, D), P(s1 - b, z1, D), P(s0 + b, z0, D), N)
      quad(m.wall, P(s0, base, 0), P(s0 + b, base, D), P(s0 + b, z0, D), P(s0, z0, 0), [N[0] - u[0], N[1] - u[1], 0])
      quad(m.wall, P(s1 - b, base, D), P(s1, base, 0), P(s1, z1, 0), P(s1 - b, z1, D), [N[0] + u[0], N[1] + u[1], 0])
      quad(m.wall, P(s0, z0, 0), P(s0 + b, z0, D), P(s1 - b, z1, D), P(s1, z1, 0), [0, 0, 1])
    }
  }
  const framed = !!(m.frame && zn.frame?.(e.o)), F = 0.22
  // Bay centres: a grid centred on the wall, or one run out from a door on it.
  let centres = Array.from({ length: count }, (_, k) => start + pitch * (k + 0.5))
  const door = DOORS.find((d) => {
    const s = (d.p[0] - e.A[0]) * u[0] + (d.p[1] - e.A[1]) * u[1], off = Math.abs((d.p[0] - e.A[0]) * u[1] - (d.p[1] - e.A[1]) * u[0])
    return off < 1 && s > 0 && s < e.L
  })
  if (door) {
    const sd = (door.p[0] - e.A[0]) * u[0] + (door.p[1] - e.A[1]) * u[1], first = door.r + w / 2 + 0.01
    centres = []
    for (let c = sd - first; c - w / 2 >= 0.3; c -= pitch) centres.push(c)
    for (let c = sd + first; c + w / 2 <= e.L - 0.3; c += pitch) centres.push(c)
  }
  for (const [k, c] of centres.entries()) {
    const mid = at(c), s0 = c - w / 2, s1 = c + w / 2
    if (near(mid, w / 2)) continue
    zn.rows!.forEach(([z0, z1], row) => {
      if (ground(mid) > z0 - 0.4 || z1 + 0.25 > under(mid)) return
      const bricked = zn.infill?.(e.o, row, k) ?? false
      if (bricked && !m.infill) return
      const p = bricked ? m.infill! : m.win
      if (zn.square) {
        if (framed && !bricked) {
          // Painted frame round a slate panel; four strips, no overlap.
          quad(m.frame!, P(s0, z0), P(s1, z0), P(s1, z0 + F), P(s0, z0 + F), N)
          quad(m.frame!, P(s0, z1 - F), P(s1, z1 - F), P(s1, z1), P(s0, z1), N)
          quad(m.frame!, P(s0, z0 + F), P(s0 + F, z0 + F), P(s0 + F, z1 - F), P(s0, z1 - F), N)
          quad(m.frame!, P(s1 - F, z0 + F), P(s1, z0 + F), P(s1, z1 - F), P(s1 - F, z1 - F), N)
          quad(p, P(s0 + F, z0 + F), P(s1 - F, z0 + F), P(s1 - F, z1 - F), P(s0 + F, z1 - F), N)
        } else quad(p, P(s0, z0), P(s1, z0), P(s1, z1), P(s0, z1), N)
        return
      }
      // A segmental arch: a shallow circular segment, rise a quarter of the span.
      const rise = 0.25 * w, h = z1 - rise, R = (w * w / 4 + rise * rise) / (2 * rise)
      quad(p, P(s0, z0), P(s1, z0), P(s1, h), P(s0, h), N)
      const arc = [0, 0.25, 0.5, 0.75, 1].map((f) => { const x = (f - 0.5) * w; return P(c + x, h + Math.sqrt(R * R - x * x) - (R - rise)) })
      for (let a = 0; a < 4; a++) tri(p, P(c, h), arc[a], arc[a + 1], N)
      // A pale stone sill under each arched opening.
      if (m.eave) quad(m.eave, P(s0 - 0.1, z0 - 0.22, 0.09), P(s1 + 0.1, z0 - 0.22, 0.09), P(s1 + 0.1, z0, 0.09), P(s0 - 0.1, z0, 0.09), N)
    })
  }
}

// ---------------------------------------------------------------------------
// Output.

/** Move a site-frame part into a model frame: anchor at origin, base at 0. */
export function place(part: Part, anchor: XY, base: number): Part {
  const out = new Part()
  out.pos = part.pos.map((v, i) => (i % 3 === 0 ? v - anchor[0] : i % 3 === 1 ? v - base : v + anchor[1]))
  out.nrm = part.nrm.slice(); out.uv = part.uv.slice()
  return out
}
export type Built = { id: string; name: string; anchor: XY; base: number; height: number; parts: { part: Part; material: Swatch }[] }
export async function write(b: Built, budget = 5000) {
  const parts = b.parts.filter((p) => p.part.triangles > 0).map(({ part, material }) => ({ part: place(part, b.anchor, b.base), material }))
  const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
  if (triangles > budget) throw new Error(`${b.id}: triangle budget exceeded: ${triangles}`)
  const glb = writeGlb(b.name, parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
    bearing: 0, elevation: 0, height: b.height,
  })
  if (glb.length > 256000) throw new Error(`${b.id}: file budget exceeded: ${glb.length}`)
  const out = new URL(`../models/${b.id}.glb`, import.meta.url).pathname
  await Bun.write(out, glb)
  const [lng, lat] = toLngLat(b.anchor)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes; anchor ${lng}, ${lat}; base ${b.base.toFixed(1)} m`)
}

// The palette shared by the mill models: red brick near the palette's
// lightness but red rather than salmon (it is the complex's identity), roof
// grey for the dark membrane roofs, slate windows, pale trim for copings and
// sills, and the silver of the metal towers, cladding and white roofs.
export const BRICK = finish('mill-brick', 0xb96d58)
export const SILVER = finish('mill-silver', 0xd3d6d9)

// ---------------------------------------------------------------------------
// OSM outlines (site frame, metres).

/** way/414800516: both mills and the bridge, as one outline. */
export const OUTLINE: XY[] = [[-21.4, 66.8], [-2.9, 68.0], [-0.3, 23.7], [11.8, 24.1], [12.2, 14.8], [15.1, 14.9], [14.0, 38.4], [55.1, 40.4], [56.4, 15.2], [46.3, 14.7], [42.8, 14.6], [43.1, 8.3], [39.4, 8.2], [36.2, 8.0], [37.4, -8.0], [16.6, -9.6], [11.3, -9.9], [11.7, -13.5], [6.3, -24.9], [-5.7, -21.0], [-5.1, -18.7], [-5.4, -18.0], [-9.3, -18.1], [-11.8, -10.4], [-13.6, -10.4], [-17.7, 3.8], [-18.0, 7.0], [-21.8, 39.0], [-30.0, 27.3], [-30.6, 27.6], [-41.0, 32.3], [-46.3, 34.7], [-54.7, 17.5], [-65.5, -5.0], [-90.5, 5.1], [-104.8, 11.0], [-99.4, 23.1], [-87.6, 17.2], [-75.7, 42.4], [-79.2, 43.9], [-73.9, 55.6], [-103.2, 68.9], [-91.3, 94.6], [-65.4, 81.9], [-58.8, 96.2], [-63.6, 98.1], [-57.2, 111.1], [-48.4, 106.7], [-46.1, 111.2], [-65.1, 120.5], [-60.6, 129.5], [-63.2, 130.8], [-58.1, 140.9], [-50.3, 157.1], [-41.9, 153.1], [-44.0, 149.0], [-41.0, 147.5], [-33.0, 163.4], [4.2, 144.9], [-3.1, 130.5], [-2.1, 125.4], [-33.9, 57.2], [-21.1, 51.9]]
/** Where Mill #2 meets the bridge; its courtyard wall south of here has windows. */
export const MILL2_EAST: [XY, XY] = [[-46.3, 34.7], [-33.9, 57.2]]
/** Mill #1 (east arm) with its east wing: the outline east of x ≈ −21.5. */
export const MILL1: XY[] = OUTLINE.slice(0, 28).concat([[-21.1, 51.9]] as XY[])
/** The bridge section between the mills, north of the courtyard. */
export const BRIDGE: XY[] = [[-46.3, 34.7], [-41.0, 32.3], [-30.6, 27.6], [-30.0, 27.3], [-21.8, 39.0], [-21.1, 51.9], [-33.9, 57.2]]
/** Mill #2: the rest of the outline. */
export const MILL2: XY[] = OUTLINE.slice(31, 62)
/** way/1202433658: the courtyard stage canopy. */
const STAGE_CANOPY: XY[] = [[-41.0, 32.3], [-42.2, 29.7], [-43.4, 27.0], [-32.9, 22.0], [-30.6, 27.6]]
/** The east wing's lower north strip (lidar and NAIP; not in OSM). */
const EAST_STRIP: XY[] = [[14.0, 38.4], [54.0, 40.35], [53.6, 45.5], [14.6, 45.5]]

// ---------------------------------------------------------------------------
// Mill #1 and the bridge.

export function buildMill(): Built {
  const wall = new Part(), roof = new Part(), win = new Part(), silver = new Part(), stage = new Part(), trim = new Part()
  const m: Mats = { wall, roof, eave: trim, win }
  const ax = axes(-2.5)               // Mill #1 runs a little west of north
  const P = MILL1
  const zones: Zone[] = []
  // The 1904 mill along the courtyard: a very low gable (lidar), parapets,
  // tall segmental-arched windows between brick piers on the courtyard, and
  // a second row under them on the east where the ground falls away.
  // Thirteen bays on the courtyard side (survey).
  const GX0 = -24, GX1 = 1.0, tc = -8, ridge = 222.3, k = (222.3 - 221.5) / 12
  const mill1904 = { rows: [[218.2, 220.9], [214.6, 216.9]] as [number, number][], pitch: 4.1, winW: 2.2, piers: true }
  zones.push({ poly: ax.band(P, -10.5, 70, GX0, tc), z: gableZ(ax, tc, ridge, k), ...mill1904 })
  // Its east face: two rows of square-headed windows, no piers (2007 aerial).
  zones.push({ poly: ax.band(P, -10.5, 70, tc, GX1), z: gableZ(ax, tc, ridge, k), rows: mill1904.rows, pitch: 3.6, winW: 1.8, square: true })
  // The 1920s block on the boulevard: flat, parapeted, arched openings
  // between piers; the south projection in front of it one storey lower.
  zones.push({
    poly: ax.band(P, -10.5, 12.6, GX1, 37.3), z: flatZ(222.9), rows: [[218.0, 221.2]], pitch: 4.0, winW: 1.9, piers: true,
  })
  zones.push({ poly: ax.band(P, -40, -10.5), z: flatZ(219.6), rows: [[216.9, 218.9]], pitch: 3.6, winW: 1.8, square: true })
  // The c.1955 dust-collector room north of it, east of the 1904 mill.
  zones.push({ poly: ax.band(P, 12.6, 30, GX1, 14), z: flatZ(222.9), rows: [[218.4, 221.0], [214.8, 217.0]], pitch: 4.2, square: true, infill: (o, row, i) => row === 1 || i % 2 === 1 })
  // The east annex and the east wing: two storeys, flat, steel windows.
  zones.push({ poly: ax.band(P, -10.5, 12.6, 37.3, 60), z: flatZ(218.6), rows: [[215.2, 217.4]], pitch: 4.0, square: true })
  // The east wing: brick pilasters, few openings (2007 aerial), a white roof.
  zones.push({ poly: ax.band(P, 12.6, 60, 14, 60), z: flatZ(222.9), rows: [[218.6, 221.2]], pitch: 5.0, winW: 1.6, square: true, piers: true, roof: silver, infill: (o, row, i) => i % 2 === 1 })
  zones.push({ poly: EAST_STRIP, z: flatZ(218.2), rows: [[214.8, 217.0]], pitch: 4.4, square: true })
  // The bridge: its west part brick, its east part a taller block clad in
  // pale metal (the courtyard panorama), one row of windows.
  zones.push({ poly: ax.band(BRIDGE, -1e4, 1e4, -1e4, -35), z: flatZ(225.2), rows: [[218.6, 221.2]], pitch: 4.2, square: true })
  zones.push({ poly: ax.band(BRIDGE, -1e4, 1e4, -35, 1e4), z: flatZ(228.0), wall: silver })
  build(zones, m, [MILL2_EAST])
  // Rooftop plant (NAIP): on the 1904 mill, the 1920s block and in a row
  // down the middle of the east wing.
  plant(roof, [[-12, 50, 222.0, -2.5], [-8, 58, 222.0, -2.5], [-11, 30, 222.1, -2.5], [6, 0, 222.9, 0], [22, 2, 222.9, 0], [28, -4, 222.9, 0],
    [29, 22, 222.9, 0], [29, 27, 222.9, 0], [29, 32, 222.9, 0], [34, 22, 222.9, 0], [34, 27, 222.9, 0], [34, 32, 222.9, 0]])

  // The dust tower: a brick tower rising five metres over the roof beside
  // the 1904 mill, a pale coping, and on it a silver metal plant housing a
  // further three (lidar; the 2007 aerial).
  {
    const ring = clean([[0.2, 12.6], [8.6, 12.6], [8.6, 22.6], [0.2, 22.6]])
    softBox(wall, ring, 221.5, 227.1, 0.3, roof)
    softBox(trim, clean([[0.05, 12.45], [8.75, 12.45], [8.75, 22.75], [0.05, 22.75]]), 226.9, 227.4, 0.15, roof)
    softBox(silver, clean([[2.1, 15.0], [6.5, 15.0], [6.5, 20.6], [2.1, 20.6]]), 227.2, 230.8, 0.3, roof)
  }
  // The long metal canopy down the 1904 mill's east face (2007 aerial; lidar
  // 218 m), on slim posts.
  {
    const a = ax.at(26, 0.9), b = ax.at(66, -0.6)
    const ring = clean([[a[0] - 0.2, a[1]], [a[0] + 2.6, a[1]], [b[0] + 2.6, b[1]], [b[0] - 0.2, b[1]]])
    solid(silver, ring, 217.6, 218.0)
    for (let s = 28; s < 66; s += 6) {
      const r = 0.12
      const px = a[0] + (b[0] - a[0]) * (s - 26) / 40 + 2.2, py = a[1] + (b[1] - a[1]) * (s - 26) / 40
      solid(stage, [[px - r, py - r], [px + r, py - r], [px + r, py + r], [px - r, py + r]], 213, 217.6)
    }
  }
  // The box on the bridge's west part (the white box over the courtyard
  // stage in the panorama).
  softBox(silver, clean([[-42.6, 35.2], [-38.0, 35.2], [-38.0, 41.0], [-42.6, 41.0]]), 224.4, 230.0, 0.3, roof)

  // The courtyard stage on the bridge's south face: a dark stage box under a
  // flat canopy with a deep dark fascia, its signboard (lidar top 224.8 m).
  {
    const canopy = clean(STAGE_CANOPY), cx = axes(25.5), g = 217.0, TOPZ = 224.8, FAS = 1.2
    solid(stage, cx.band(canopy, 8.6), g - 1, TOPZ - FAS, roof)
    for (let i = 1; i < canopy.length - 1; i++) {
      tri(roof, [canopy[0][0], canopy[0][1], TOPZ], [canopy[i][0], canopy[i][1], TOPZ], [canopy[i + 1][0], canopy[i + 1][1], TOPZ], [0, 0, 1])
      tri(stage, [canopy[0][0], canopy[0][1], TOPZ - FAS], [canopy[i + 1][0], canopy[i + 1][1], TOPZ - FAS], [canopy[i][0], canopy[i][1], TOPZ - FAS], [0, 0, -1])
    }
    for (let i = 0; i < canopy.length; i++) {
      const A = canopy[i], B = canopy[(i + 1) % canopy.length]
      quad(stage, [A[0], A[1], TOPZ - FAS], [B[0], B[1], TOPZ - FAS], [B[0], B[1], TOPZ], [A[0], A[1], TOPZ], [B[1] - A[1], A[0] - B[0], 0])
    }
    // The stage deck, a step up from the courtyard, and two slim front posts.
    solid(trim, cx.band(canopy, 5.75, 8.6), g - 1, g + 1.1, stage)
    for (const p of [cx.at(6.1, cx.t(canopy[2]) + 0.7), cx.at(6.1, cx.t(canopy[3]) - 0.7)]) {
      const r = 0.2, ring: XY[] = [[p[0] - r, p[1] - r], [p[0] + r, p[1] - r], [p[0] + r, p[1] + r], [p[0] - r, p[1] + r]]
      solid(stage, ring, g - 1, TOPZ - FAS)
    }
  }

  const anchor = centroid(MILL1)
  const base = lowest(clean(MILL1.concat()))
  return {
    id: 'music-factory-mill', name: 'AvidXchange Music Factory mill', anchor, base, height: 230.8 - base,
    parts: [
      { part: wall, material: BRICK },
      { part: roof, material: PALETTE.roof },
      { part: win, material: PALETTE.window },
      { part: trim, material: PALETTE.trim },
      { part: silver, material: SILVER },
      { part: stage, material: finish('stage-charcoal', 0x4a4f57) },
    ],
  }
}

if (import.meta.main) await write(buildMill())
