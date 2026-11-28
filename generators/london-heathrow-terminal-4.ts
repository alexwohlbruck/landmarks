/**
 * London Heathrow Terminal 4 (opened 1986; landside rebuilt 2009), on the
 * south side of the airport, with its piers and the long airside link to
 * the eastern pier — procedural, CC0-1.0, no textures.
 * bun generators/london-heathrow-terminal-4.ts
 *
 * Writes models/london-heathrow-terminal-4.glb (low) and
 * models/london-heathrow-terminal-4.detail.glb (detail: the whole landmark
 * again, with finer window bands, more roof monitors and canopy beams).
 *
 * Map frame: x = model east, y = model north, z up, metres. Bearing 42°: the
 * main building's long walls run 42° east of north. Anchor: area centroid
 * of OSM way/151625568. Landside (the forecourt and the Terminal 4
 * roundabout) is +x; the stands are −x; the eastern pier is the long finger
 * at x ≈ 200…300 reached by the link at y ≈ 100…200.
 *
 * Identifying features (photos): a long, low terminal; the main building a
 * little taller, its dark grey roof lined with long monitors; light grey
 * ribbed cladding on the airside and the piers with pale eaves; the 2009
 * landside facade of dark glass under a deep glass canopy on steel beams;
 * long narrow piers and a long airside link.
 *
 * Evidence
 * - OSM: way/151625568 (Terminal 4, building=airport_terminal). No heights,
 *   no building:parts.
 * - Published: opened 1 April 1986; landside refurbished 2009 (Wikipedia,
 *   "Heathrow Terminal 4").
 * - Photos (Wikimedia Commons):
 *   https://commons.wikimedia.org/wiki/File:Heathrow_LON_04_07_77.JPG
 *     (Mario Roberto Duran Ortiz, CC BY 3.0) aerial along the main building:
 *     its dark roof and monitors, the piers' pale eaves, the stands;
 *   https://commons.wikimedia.org/wiki/File:Heathrow,_Terminal_4_-_geograph.org.uk_-_3013166.jpg
 *     (M J Richardson, CC BY-SA 2.0) from the south runway: the light grey
 *     airside blocks and their height against the jet bridges;
 *   https://commons.wikimedia.org/wiki/File:Heathrow_Terminal_4_Apron_-_geograph.org.uk_-_3512571.jpg
 *     (Anthony Parkes, CC BY-SA 2.0) the pier's ribbed cladding and fascia;
 *   https://commons.wikimedia.org/wiki/File:Heathrow_Terminal_4_building_-_geograph.org.uk_-_2202507.jpg
 *     (Roger Davies, CC BY-SA 2.0) the landside corner: the glass canopy;
 *   https://commons.wikimedia.org/wiki/File:London_Heathrow_,_Terminal_4_-_geograph.org.uk_-_5058867.jpg
 *     (Lewis Clarke, CC BY-SA 2.0) the departures facade: dark glass under
 *     the canopy's glass panels and beams.
 * - No lidar.
 * Note: Duran Ortiz's aerial (described on Commons as Terminal 4) was used
 * for the roof's look only: its viewpoint could not be matched to the plan.
 *
 * Terrain: Mapterhorn puts the landside forecourt road about 2.5 m below the
 * apron and the main floor; y = 0 is that road, so every height below is
 * from the photos plus 2.5 m.
 * Review round 1: roofs lightened to the pale grey of the aerials, with the
 * main building's long monitors kept mid grey; jet bridges added (positions
 * read from Duran Ortiz's aerial and Richardson's photo, spacing about
 * 40–45 m, estimated; bridges are the same pale grey as the cladding);
 * pale rooftop plant; the piers' gate floors drawn as one glazing band.
 * Numbers (estimated from the photos against jet bridges at 5–8 m): piers,
 * link and low wings 12 m over the apron; the main building 19 m; roof monitors 2.5 m;
 * the landside canopy 11 m up, 15 m deep (Davies's photo), along the main
 * building's landside wall; the landside glass from 0 to 16 m.
 * Doubts: the main building's extent (taken as the wide part of the outline);
 * the red fascia stripe seen on some piers is left out; the jet bridges'
 * positions and count are estimated; the link is drawn at the piers' height
 * though it may be lower.
 */
import { type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, type Facade, quadN } from './nyc-570-lexington'
import { zoneMass, simplify, prismRing, newMats, writeLod, drum, beam, inside, type Zone, type Mats } from './tokyo-haneda-terminal-1'
import { LHR } from './london-heathrow-terminal-5'

/** OSM way/151625568 in this frame (bearing 42, anchor −0.4469366, 51.4598266). */
const T4: XY[] = [[-64.5,-338.6],[-47.4,-337.9],[-47.8,-326.1],[-21.6,-246.9],[-31.4,-243.8],[-33.8,-243.4],[-33.9,-234.8],[-30.3,-234.7],[-31.0,-214.7],[-34.1,-214.6],[-34.1,-213.7],[-34.5,-201.9],[-34.7,-194.9],[-22.9,-194.8],[-22.8,-195.7],[-19.7,-196.6],[-18.5,-199.4],[-23.8,-214.1],[-2.0,-223.6],[15.1,-171.0],[-13.7,-170.8],[-18.5,-186.1],[-20.6,-187.2],[-23.5,-186.0],[-24.2,-187.5],[-36.4,-187.3],[-35.0,-170.2],[-35.0,-168.4],[-29.6,-167.8],[-29.0,-171.7],[-22.1,-171.1],[-20.8,-140.3],[-23.4,-139.9],[-22.9,-124.6],[-13.2,-124.1],[-11.5,-125.9],[-12.0,-136.2],[-9.2,-137.0],[-8.7,-152.8],[-0.8,-153.1],[-0.4,-154.7],[34.4,-154.8],[34.5,-153.0],[52.9,-151.7],[52.6,-150.2],[43.5,-144.4],[37.1,-133.4],[37.3,-125.7],[41.9,-125.4],[57.7,-124.3],[58.3,-85.5],[58.7,-50.0],[59.5,-15.4],[60.1,12.3],[60.3,37.0],[60.5,62.6],[48.2,62.4],[36.2,62.2],[37.7,78.9],[21.0,78.5],[20.2,72.7],[16.6,72.5],[14.2,80.3],[6.7,104.2],[-10.9,104.3],[-11.9,71.8],[-12.2,61.2],[-25.2,60.9],[-25.2,62.4],[-25.1,71.5],[-36.2,72.1],[-35.9,76.7],[-33.3,76.7],[-25.3,85.4],[-12.9,86.2],[-12.5,106.1],[7.2,105.8],[17.0,95.8],[126.9,96.5],[171.9,113.0],[238.6,169.9],[256.4,193.0],[253.5,201.4],[257.8,202.7],[255.9,209.0],[265.2,212.1],[261.2,222.4],[251.6,218.9],[211.5,336.3],[210.1,335.9],[201.9,359.1],[203.7,360.1],[177.6,436.4],[160.6,440.6],[200.7,326.8],[193.6,324.2],[198.7,308.9],[206.2,311.3],[224.5,252.9],[217.4,250.5],[221.1,239.7],[228.1,241.9],[242.5,198.8],[245.4,199.6],[247.0,195.1],[232.8,175.0],[209.3,154.3],[168.7,119.2],[125.4,103.0],[19.8,102.5],[9.5,112.8],[-16.5,112.4],[-17.1,89.6],[-26.8,89.6],[-35.1,81.0],[-36.3,81.0],[-36.5,91.4],[-36.8,106.7],[-37.2,124.0],[-37.2,127.9],[-32.8,127.9],[-30.1,127.9],[-29.8,121.1],[-27.8,120.8],[-27.5,113.4],[3.5,114.2],[-11.7,158.9],[-16.9,158.9],[-19.6,166.5],[-24.7,164.8],[-22.6,158.9],[-27.5,158.8],[-27.6,151.0],[-30.5,150.7],[-30.5,140.7],[-36.8,140.8],[-37.5,163.6],[-38.2,188.6],[-23.8,189.2],[-36.5,226.7],[-34.4,226.8],[-32.2,220.4],[-23.5,223.9],[-35.9,258.1],[-46.4,255.1],[-61.3,299.2],[-65.4,299.1],[-80.5,299.1],[-65.7,254.6],[-65.1,208.0],[-64.9,196.0],[-64.9,185.1],[-64.8,183.7],[-64.3,149.8],[-64.2,137.0],[-64.1,129.8],[-64.0,123.5],[-63.9,114.0],[-63.8,106.9],[-63.7,98.4],[-63.6,91.0],[-63.5,83.9],[-63.4,75.9],[-63.3,68.4],[-63.2,60.9],[-71.6,61.1],[-73.8,61.1],[-74.1,18.0],[-87.5,18.0],[-95.2,10.1],[-97.4,9.8],[-97.5,-13.6],[-95.4,-13.2],[-95.2,-21.1],[-94.9,-40.3],[-94.8,-45.3],[-86.7,-53.0],[-86.6,-60.5],[-95.1,-68.4],[-95.1,-90.5],[-86.5,-99.2],[-73.0,-99.1],[-73.1,-125.2],[-62.2,-125.3],[-61.9,-134.4],[-78.8,-135.4],[-79.0,-140.1],[-94.7,-155.3],[-79.1,-170.8],[-79.2,-176.4],[-61.8,-177.1],[-61.9,-181.2],[-62.7,-226.7],[-62.9,-234.4],[-63.0,-238.1],[-65.5,-238.1]]

/** Heights from y = 0, the forecourt road east of the main building, which the map's terrain puts about 2.5 m below the apron and the main floor: 12 m piers and a 19 m main building over the apron, plus 2.5 m. */
const H_PIER = 14.5, H_MAIN = 21.5
const MAIN_RECT: [number, number, number, number] = [-100, -160, 66, 70]

/**
 * Fixed jet bridges along a pier: for each start point (outside the
 * building), march along `inward` until inside the outline; that is the
 * bridge's root on the wall. The bridge runs back out `len` metres to a round
 * cab on a post. Positions come from the aerials (OSM maps none).
 */
function pierBridges(part: import('./mesh').Part, outline: XY[], starts: XY[], inward: XY, o: { len: number; z0: number; z1: number; detail: boolean }) {
  for (const s of starts) {
    let p: XY = [s[0], s[1]], k = 0
    while (!inside(p, outline) && k++ < 400) p = [p[0] + inward[0] * 0.5, p[1] + inward[1] * 0.5]
    if (k >= 400) continue
    const root: XY = [p[0] - inward[0] * 0.3, p[1] - inward[1] * 0.3]
    const end: XY = [root[0] - inward[0] * o.len, root[1] - inward[1] * o.len]
    beam(part, root, end, 3.6, o.z0, o.z1, true)
    drum(part, end[0], end[1], 2.3, 2.3, o.z0 - 0.4, o.z1 + 0.5, o.detail ? 12 : 8, part)
    drum(part, end[0], end[1], 0.6, 0.6, 0, o.z0 - 0.4, 6, null)
    if (o.detail) { const mid: XY = [(root[0] + end[0]) / 2, (root[1] + end[1]) / 2]; drum(part, mid[0], mid[1], 0.4, 0.4, 0, o.z0, 6, null) }
  }
}

function build(detail: boolean) {
  const M: Mats = newMats(['wall', 'win', 'roof', 'trim', 'glass', 'dark'])
  // the piers' gate floors over the apron (2.5 m above y = 0): one near-continuous glazing band
  const PIER: Facade = { bay: detail ? 6 : 9, ratio: 0.95, floor: 3.0, group: 1, spandrel: 0, sill: 1.0, head: 1.6, ground: 7.6, minLength: 8 }
  const MAIN: Facade = { bay: detail ? 9 : 12, ratio: 0.85, floor: 3.8, group: 2, spandrel: 1.4, sill: 1.0, head: 1.8, ground: 4.8, minLength: 8 }
  const LAND: Facade = { bay: 15, ratio: 0.97, floor: 15, group: 1, spandrel: 0, sill: 0.3, head: 2.2, ground: 0.6, minLength: 8 }
  const zones: Zone[] = [
    { rect: [-1000, -1000, 1000, 1000], z: H_PIER, facade: PIER },
    { rect: MAIN_RECT, z: H_MAIN, facade: MAIN, facadeFor: (n: XY) => (n[0] > 0.7 ? LAND : MAIN) },
  ]
  zoneMass(M, simplify(T4, 0.8), zones, { lip: 0.9 })

  // --- roof monitors along the main building (aerial) ---
  const xs = detail ? [-80, -62, -44, -26, -8, 10, 28, 46] : [-75, -48, -21, 6, 33]
  for (const x of xs) {
    const w = detail ? 5 : 7, y0 = -140, y1 = 50
    prismRing(M.dark, [[x - w / 2, y0], [x + w / 2, y0], [x + w / 2, y1], [x - w / 2, y1]], H_MAIN - 0.3, H_MAIN + 2.5, M.roof)
    const n: V3 = [-1, 0, 0]
    quadN(M.glass, [x - w / 2 - 0.05, y1 - 1, H_MAIN + 0.4], [x - w / 2 - 0.05, y0 + 1, H_MAIN + 0.4], [x - w / 2 - 0.05, y0 + 1, H_MAIN + 2.1], [x - w / 2 - 0.05, y1 - 1, H_MAIN + 2.1], [n, n, n, n])
  }
  // rooftop plant: pale clusters on the main building and the piers' wider parts
  const plant: [number, number, number, number, number][] = [[-60, 60, 12, 8, H_MAIN], [20, -150, 14, 8, H_MAIN], [-40, -150, 10, 8, H_MAIN], [-50, 160, 10, 8, H_PIER], [-45, -260, 8, 8, H_PIER], [225, 260, 8, 6, H_PIER]]
  for (const [x, y, w, d, z] of detail ? plant : plant.slice(0, 4)) prismRing(M.wall, [[x - w / 2, y - d / 2], [x + w / 2, y - d / 2], [x + w / 2, y + d / 2], [x - w / 2, y + d / 2]], z, z + 3, M.trim)

  // --- jet bridges (positions from Duran Ortiz's and Richardson's photos: stands down the
  // piers' airside walls and both sides of the east pier; none are in OSM) ---
  const body = simplify(T4, 0.8)
  const jb = { len: 22, z0: 7.1, z1: 10.3, detail }
  const at = (x: number, ys: number[]): XY[] => ys.map((y) => [x, y])
  pierBridges(M.wall, body, at(-140, [110, 150, 190, 230]), [1, 0], jb) // north pier, airside (west)
  pierBridges(M.wall, body, at(-140, [-195, -235, -275, -315]), [1, 0], jb) // south pier, airside
  pierBridges(M.wall, body, at(-160, [-120, -70, -20, 30]), [1, 0], jb) // main building, airside
  // the east pier runs from (247, 195) towards (177, 436): stands both sides
  const u: XY = [-0.279, 0.960], nE: XY = [0.960, 0.279]
  const along = [20, 65, 110, 155, 200].map((t) => [247 + u[0] * t, 195 + u[1] * t] as XY)
  pierBridges(M.wall, body, along.map(([x, y]) => [x + nE[0] * 40, y + nE[1] * 40] as XY), [-nE[0], -nE[1]], jb)
  pierBridges(M.wall, body, along.map(([x, y]) => [x - nE[0] * 40, y - nE[1] * 40] as XY), nE, jb)

  // --- the landside canopy: glass panels on white steel beams and posts, over the departures curb ---
  {
    const X0 = 61, X1 = 76, Y0 = -150, Y1 = 58, Z = 11, up: V3 = [0, 0, 1], dn: V3 = [0, 0, -1]
    quadN(M.glass, [X0, Y0, Z], [X1, Y0, Z], [X1, Y1, Z], [X0, Y1, Z], [up, up, up, up])
    quadN(M.glass, [X0, Y0, Z - 0.05], [X0, Y1, Z - 0.05], [X1, Y1, Z - 0.05], [X1, Y0, Z - 0.05], [dn, dn, dn, dn])
    const nb = detail ? 26 : 13
    for (let k = 0; k <= nb; k++) {
      const y = Y0 + ((Y1 - Y0) * k) / nb
      prismRing(M.trim, [[X0, y - 0.35], [X1 + 0.5, y - 0.35], [X1 + 0.5, y + 0.35], [X0, y + 0.35]], Z - 0.9, Z + 0.25, M.trim, M.trim)
    }
    prismRing(M.trim, [[X1 - 0.3, Y0], [X1 + 0.5, Y0], [X1 + 0.5, Y1], [X1 - 0.3, Y1]], Z - 1.2, Z + 0.3, M.trim, M.trim)
    for (let k = 1; k < nb; k += 3) drum(M.trim, X1 - 3, Y0 + ((Y1 - Y0) * k) / nb, 0.3, 0.3, 0, Z - 0.9, 6, null)
  }

  return [
    { part: M.wall, material: finish('lhr-t4-cladding', 0xdcdcd8) },
    { part: M.win, material: LHR.window },
    { part: M.roof, material: finish('lhr-t4-roof', 0xc6c9cb) },
    { part: M.trim, material: LHR.white },
    { part: M.glass, material: PALETTE.glass },
    { part: M.dark, material: finish('lhr-t4-monitor', 0x8a9197) },
  ]
}

if (import.meta.main) {
  const extras = { bearing: 42, osm: 'way/151625568', height: H_MAIN + 2.5 }
  writeLod('Heathrow Terminal 4', 'london-heathrow-terminal-4.glb', build(false), extras, 8000, 250_000)
  writeLod('Heathrow Terminal 4', 'london-heathrow-terminal-4.detail.glb', build(true), extras, 40_000, 1_500_000)
}
