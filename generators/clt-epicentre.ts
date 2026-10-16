/**
 * EpiCentre, now Queen City Quarter (210 E Trade St, opened 2008, The Ghazi
 * Company), with the Aloft hotel over its College St corner and the AC
 * Hotel / Residence Inn tower (2018) built on the foundations of its
 * stalled 52-storey residential tower, 210 Trade — original procedural
 * geometry, CC0-1.0.
 * bun generators/clt-epicentre.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. OSM has no single outline: the site relation/9389659 groups the
 * Trade St building (relation/20499229, outer way/676164657), the Aloft
 * (relation/20454106, outer way/676164662) and the College St building
 * way/676164658. The south retail block way/1499786347 (Bowlero) and the
 * tower way/1499786346 (OSM "Residence Inn Charlotte City Center") stand on
 * the same podium and are part of Queen City Quarter (Wikipedia), so the
 * model covers all five. Anchor = area centroid of those five outlines,
 * 35.2253475, -80.8420033. Walls run at 48° / 138° (the Uptown grid), so the
 * bearing is 48: +y is toward Trade St (NE), +x toward Brevard St and the
 * LYNX tracks, -x College St, -y 4th St. The tower is skewed ~15° off the
 * grid, as OSM draws it.
 *
 * Identity, in order: the pale white hotel tower (98 m published) stepping
 * down in wings to its podium beside the light rail; the round sign drum on
 * the roof at the Trade/College corner over the curved, rounded-ended Trade
 * St building; the tan Aloft slab on College and 4th; the low tan podium
 * blocks round an open courtyard crossed by skybridges, with the skybridge
 * over College St to Overstreet Mall.
 *
 * Evidence:
 *  - plan: every polygon is OSM (the five outlines and their
 *    building:parts, way/1499786340-387, way/1500646950-974, way/985619872,
 *    way/1188214516, way/1500955903-904); checked against USGS NAIP
 *    (tools/usgs.py naip; the service 504'd twice before answering).
 *  - heights: lidar USGS_LPC_NC_Phase4_Mecklenburg_2016 (flown 2016-17),
 *    0.5 m grid; base = ground_min + 0.5 m, at Brevard St, the lowest ground
 *    under the footprint. Ground rises ~8 m to College St (lidar gnd, linear
 *    fit, used to start facade detail above grade). Measured above base:
 *    Trade St building 21.2 with upper masses 26.0 / 30.1 / 32.3 / 32.6 and
 *    the drum to 33.2; College St building 23.5-24.9; Aloft podium 35.5 and
 *    slab 66.6-67.2; south retail 30.3-32.4. (OSM's heights for these are
 *    ~6 m lower: measured from the College St side.)
 *  - tower: absent from the 2016 lidar (only its podium, ~41 m, and a crane).
 *    Heights are OSM's +1 m (the mapper's base for this block sits at the
 *    Brevard side, where OSM 30 matches lidar 30.3): podium 34-44, wings 59,
 *    south slab 83, main slab 88, crown 90-93. Published: 22 storeys, 320 ft
 *    (98 m), completed 2018 (Wikipedia, "AC Hotel/Residence Inn Charlotte
 *    City Center"); the model's 93 m roof plus the masts left out make up
 *    the difference.
 *  - published: EpiCentre opened March 2008, $220M, three acres, Aloft 175
 *    rooms, skybridge to Overstreet Mall (Wikipedia, "Queen City Quarter").
 *  - colour: podium tan precast with dark glass storefronts (Mapillary
 *    1757257301274312, 2022); Aloft pale golden tan banding (same photo);
 *    tower white (Jt12081988's photo, Mapillary 815391562973227); the drum a
 *    dark LED screen ring (Mapillary 808276140107855, 2015) drawn charcoal.
 *
 * Photos (evidence):
 *  - "AC Hotel Charlotte.jpg", Jt12081988, CC BY-SA 4.0,
 *    https://commons.wikimedia.org/wiki/File:AC_Hotel_Charlotte.jpg
 *  - "Charlotte EpiCentre during the 2012 Democratic National Convention.JPG",
 *    Loderbrab, CC BY-SA 3.0, https://commons.wikimedia.org/wiki/File:Charlotte_EpiCentre_during_the_2012_Democratic_National_Convention.JPG
 *    (the courtyard and its balconies)
 *  - "Charlotte Transportation Center 01.jpg", Mark Clifton, CC BY-SA 2.0,
 *    https://commons.wikimedia.org/wiki/File:Charlotte_Transportation_Center_01.jpg
 *  - Mapillary (CC BY-SA 4.0) images 808276140107855 (drum, from College &
 *    Trade, 2015), 1757257301274312 (College St face and Aloft, 2022),
 *    815391562973227 and 476305614402806 (tower from the south-east over the
 *    CTC, 2022), 1063407284313452 (College St skybridge, 2022).
 * Look-only: none. No commercial imagery.
 *
 * Estimated: window bays and storey groups (photos, no dimensions), the
 * drum's radius (7.3 m, from OSM's half-ring way/1500646960, closed into a
 * full cylinder as the 2015 photo shows) and its base (25.5 m), the
 * courtyard bridges' deck (OSM min_height 6 / height 12 over the 8.8 m
 * courtyard level), the College St skybridge (13.5-18.5 m).
 *
 * Doubts: no licensed photo shows the Aloft clearly or the 4th St and
 * Brevard faces of the podium; the Aloft's colour rests on one street photo.
 * The tower's top (masts, the frame round its crown) is simplified to the
 * OSM steps. The tower has its own Wikidata item (Q4630857) and may be
 * wanted as a separate landmark later; it is part of this model because it
 * stands on the EpiCentre podium. Wikidata for the complex: Q114608472.
 *
 * Left out: the courtyard's escalators and canopies, signs and screens'
 * content, the masts, mullions.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { block, cap, lathe, panel, save, walls, type XY } from './chi-aon-center'

const EPI = finish('epi-precast', 0xdccbb0)
const AC = finish('ac-white', 0xe9e9e4)
const ALOFT = finish('aloft-tan', 0xdcc596)
const SCREEN = finish('epi-screen', 0x4a4f57)
const ROOF = finish('epi-roof', 0xb9bec2)

type Kind = 'epi' | 'aloft' | 'ac' | 'bridge'
/** OSM outline or part, model frame (bearing 48), z0..z1 above the base. */
const PARTS: [string, number, number, Kind, XY[]][] = [
  ['way/676164657', 0, 21.2, 'epi', [[-4.0,20.9],[-1.8,20.8],[0.3,21.1],[2.3,21.6],[3.8,22.1],[5.6,23.0],[7.1,23.8],[8.6,25.1],[10.2,26.7],[11.4,28.3],[12.7,30.6],[13.4,32.6],[13.8,33.9],[14.2,35.9],[14.2,37.5],[14.1,39.7],[13.5,42.6],[10.3,41.6],[9.9,42.9],[9.3,44.1],[8.3,45.7],[7.1,47.0],[5.7,48.2],[4.1,49.3],[1.5,50.6],[-9.6,53.8],[-15.4,53.8],[-46.7,53.5],[-46.8,57.6],[-47.8,57.6],[-47.7,53.5],[-47.7,51.8],[-49.7,51.7],[-51.5,51.3],[-53.1,50.8],[-54.7,50.0],[-56.6,50.0],[-58.0,49.8],[-59.0,49.3],[-60.1,48.6],[-60.8,47.3],[-61.1,46.0],[-61.1,38.5],[-65.5,38.5],[-65.5,37.2],[-61.1,37.3],[-61.2,23.1],[-37.6,23.6],[-35.7,23.6],[-34.4,23.6],[-30.5,23.7],[-11.4,18.7],[-9.6,18.3],[-8.4,18.0],[-7.2,17.7],[-5.9,21.3]]],
  ['way/985619872', 20, 26.0, 'epi', [[-47.7,27.6],[-35.5,27.6],[-6.8,27.8],[-1.6,28.1],[-0.1,28.4],[1.3,28.8],[3.5,30.1],[5.3,32.0],[6.7,34.4],[7.3,37.1],[7.3,38.0],[7.2,39.2],[6.8,41.0],[6.1,42.6],[5.1,43.9],[4.2,44.9],[2.5,46.1],[1.2,46.8],[0.2,47.2],[0.8,48.8],[1.5,50.6],[-9.6,53.8],[-15.4,53.8],[-46.7,53.5],[-47.7,53.5],[-47.7,51.8],[-47.7,48.9],[-47.7,45.8],[-49.2,45.7],[-50.8,45.2],[-52.0,44.5],[-53.1,43.6],[-54.2,42.3],[-54.8,40.9],[-55.2,39.4],[-55.2,38.1],[-55.1,37.0],[-54.7,35.7],[-54.2,34.7],[-53.4,33.6],[-52.0,32.4],[-50.6,31.7],[-49.1,31.3],[-47.6,31.2]]],
  ['way/1500646970', 25, 32.6, 'epi', [[-38.8,38.1],[-38.7,28.7],[-20.4,29.1],[-20.5,38.5]]],
  ['way/1500646969', 25, 30.1, 'epi', [[-16.0,39.7],[-15.9,30.3],[-2.1,30.6],[-2.2,39.9]]],
  ['way/1500646968', 25, 32.3, 'epi', [[7.2,39.2],[6.8,41.0],[6.1,42.6],[5.1,43.9],[4.2,44.9],[2.5,46.1],[1.2,46.8],[0.2,47.2],[-0.1,46.6],[0.8,46.2],[2.2,45.4],[3.8,44.4],[5.0,42.8],[5.9,41.1],[6.3,39.5],[6.5,38.0],[7.3,38.0]]],
  ['way/1500646971', 0, 18.2, 'epi', [[-58.4,38.5],[-58.2,40.2],[-57.6,42.2],[-56.7,44.0],[-55.5,45.5],[-54.1,46.8],[-52.7,47.7],[-51.1,48.4],[-49.5,48.7],[-47.7,48.9],[-47.7,51.8],[-49.7,51.7],[-51.5,51.3],[-53.1,50.8],[-54.7,50.0],[-56.2,48.8],[-57.6,47.3],[-58.9,45.6],[-59.9,43.8],[-60.6,42.3],[-61.0,40.5],[-61.1,38.5]]],
  ['way/676164658', 0, 23.5, 'epi', [[-60.7,5.3],[-59.8,-0.4],[-57.1,-17.6],[-56.5,-17.5],[-56.4,-23.2],[-55.5,-23.2],[-53.8,-23.2],[-51.0,-23.2],[-51.0,-17.0],[-12.1,-10.7],[-11.9,-11.2],[-5.9,-9.9],[-4.9,-15.4],[-2.7,-15.1],[-0.9,-14.8],[-2.0,-9.1],[-4.9,9.5],[-10.1,12.2],[-11.3,12.7],[-12.9,13.3],[-16.8,14.7],[-21.2,15.8],[-25.3,16.5],[-30.3,17.0],[-34.4,17.1],[-35.7,17.0],[-37.7,16.9],[-42.8,16.2],[-47.1,15.3],[-51.9,14.0],[-56.7,12.1],[-61.4,9.7]]],
  ['way/1500646951', 23, 24.2, 'epi', [[-47.9,-4.4],[-32.4,-4.2],[-32.4,-0.4],[-43.4,-0.5],[-43.5,12.0],[-48.0,11.9]]],
  ['way/1500646952', 23, 24.9, 'epi', [[-43.4,-0.5],[-32.4,-0.4],[-12.7,-0.2],[-12.7,11.9],[-15.8,12.4],[-18.5,12.8],[-21.7,13.2],[-21.6,15.0],[-29.8,14.8],[-29.9,12.3],[-43.5,12.0]]],
  ['way/1188214516', 13.5, 18.5, 'bridge', [[-59.8,-0.4],[-60.3,2.4],[-60.7,5.3],[-84.4,4.9],[-84.4,2.1],[-84.4,-0.8]]],
  ['way/1500646954', 14.3, 20.3, 'bridge', [[-34.4,17.1],[-34.4,23.6],[-37.6,23.6],[-37.7,16.9]]],
  ['way/1500646957', 14.3, 20.3, 'bridge', [[-11.3,12.7],[-10.1,12.2],[-8.4,18.0],[-9.6,18.3],[-11.4,18.7],[-12.9,13.3]]],
  ['way/676164662', 0, 35.5, 'epi', [[-21.2,-18.4],[-23.1,-17.9],[-27.2,-18.7],[-28.7,-19.8],[-46.9,-23.2],[-49.2,-23.2],[-51.0,-23.2],[-53.8,-23.2],[-55.5,-23.2],[-56.4,-23.2],[-64.4,-23.2],[-64.4,-24.4],[-64.4,-48.3],[-63.9,-48.3],[-61.6,-48.3],[-11.5,-48.1],[-11.5,-35.0],[-11.4,-20.9],[-11.4,-16.6]]],
  ['way/1499786340', 35, 67.2, 'aloft', [[-64.4,-48.3],[-63.9,-48.3],[-61.6,-48.3],[-61.6,-27.1],[-55.8,-27.1],[-55.8,-28.5],[-52.9,-28.5],[-52.9,-24.3],[-55.6,-24.3],[-64.4,-24.4]]],
  ['way/1499786342', 35, 67.2, 'aloft', [[-54.8,-36.3],[-54.9,-41.4],[-44.0,-41.4],[-43.9,-32.9],[-49.3,-32.9],[-52.8,-32.9],[-52.8,-36.3]]],
  ['way/1499786343', 35, 66.6, 'aloft', [[-52.9,-24.3],[-52.9,-28.5],[-55.8,-28.5],[-55.8,-27.1],[-61.6,-27.1],[-61.6,-48.3],[-11.5,-48.1],[-11.5,-35.0],[-14.0,-35.0],[-14.0,-32.8],[-43.9,-32.9],[-44.0,-41.4],[-54.9,-41.4],[-54.8,-36.3],[-52.8,-36.3],[-52.8,-32.9],[-49.3,-32.9],[-49.2,-23.2],[-51.0,-23.2],[-53.8,-23.2],[-55.5,-23.2],[-55.6,-24.3]]],
  ['way/1499786347', 0, 30.3, 'epi', [[19.2,15.0],[18.9,10.4],[18.1,5.5],[17.0,0.8],[15.2,0.8],[15.2,3.4],[8.2,3.4],[8.2,0.8],[8.0,-7.7],[12.1,-7.7],[8.9,-14.6],[-0.9,-14.8],[-2.7,-15.1],[-4.9,-15.4],[-11.4,-16.6],[-11.4,-20.9],[-11.5,-35.0],[-11.5,-48.1],[-6.2,-48.0],[6.4,-47.9],[11.3,-47.9],[53.7,-47.5],[64.0,-47.3],[64.0,-42.4],[63.2,-13.4],[58.1,-13.5],[39.2,-13.7],[38.8,-15.2],[37.6,-14.9],[33.6,-13.8],[33.2,-15.1],[28.6,-13.9],[24.1,-14.1],[23.9,-11.2],[18.7,-9.8],[20.1,-4.6],[19.4,-4.4],[19.2,19.9]]],
  ['way/1499786350', 30, 32.4, 'epi', [[6.3,-36.7],[6.4,-47.9],[11.3,-47.9],[11.3,-36.7]]],
  ['way/1499786351', 30, 32.4, 'epi', [[53.6,-42.6],[53.7,-47.5],[64.0,-47.3],[64.0,-42.4]]],
  ['way/1499786346', 0, 34.0, 'ac', [[19.2,19.9],[19.4,-4.4],[20.1,-4.6],[18.7,-9.8],[23.9,-11.2],[24.1,-14.1],[28.6,-13.9],[33.2,-15.1],[33.6,-13.8],[37.6,-14.9],[38.8,-15.2],[39.2,-13.7],[58.1,-13.5],[63.2,-13.4],[62.9,-4.1],[59.8,-3.2],[59.7,40.0],[48.8,42.8],[47.8,46.1],[47.5,47.0],[50.4,56.6],[44.8,55.1],[44.9,58.9],[43.6,58.8],[43.5,54.7],[18.6,47.9],[19.3,45.8],[21.4,46.4],[21.4,44.7],[13.5,42.6],[14.1,39.7],[14.2,37.5],[17.5,38.4],[18.1,33.4],[18.9,27.0],[19.1,22.2]]],
  ['way/1499786365', 33, 44.0, 'ac', [[49.1,42.1],[48.8,42.8],[47.0,43.8],[47.8,46.1],[47.5,47.0],[46.9,48.6],[46.4,50.3],[45.8,52.4],[22.6,45.9],[22.6,45.0],[22.6,39.8],[22.6,31.7],[26.1,44.7],[26.3,45.3],[27.8,44.9],[35.8,42.8],[38.6,43.1],[41.7,43.2],[45.3,42.9]]],
  ['way/1499786366', 33, 44.0, 'ac', [[22.5,27.8],[22.5,23.5],[24.0,23.1],[29.3,21.8],[30.3,25.8],[23.2,27.7]]],
  ['way/1499786383', 33, 43.0, 'ac', [[43.3,1.3],[39.2,-13.7],[41.1,-12.7],[44.8,1.0]]],
  ['way/1499786386', 33, 43.0, 'ac', [[49.8,25.5],[51.3,25.1],[54.9,38.4],[53.4,38.8]]],
  ['way/1499786387', 33, 39.0, 'ac', [[22.6,39.8],[21.4,39.5],[17.5,38.4],[18.1,33.4],[18.9,27.0],[19.1,22.2],[22.5,23.5],[22.5,27.8],[21.6,28.1],[22.6,31.7]]],
  ['way/1499786361', 33, 36.0, 'ac', [[40.6,-8.6],[42.1,-9.0],[54.1,-12.0],[53.8,-1.3],[50.9,-0.6],[55.2,15.8],[50.9,16.9],[56.2,36.6],[57.1,39.9],[54.0,40.7],[53.4,38.8],[49.8,25.5],[48.0,18.6],[47.6,17.2],[45.5,9.7],[45.2,8.4],[43.3,1.3]]],
  ['way/1499786369', 33, 35.0, 'ac', [[19.1,22.2],[19.2,19.9],[21.1,19.8],[20.9,-4.8],[22.1,-5.1],[24.6,4.1],[24.9,5.5],[26.9,13.0],[27.4,14.6],[29.3,21.8],[24.0,23.1],[22.5,23.5]]],
  ['way/1499786357', 33, 59.0, 'ac', [[30.3,25.8],[29.3,21.8],[27.4,14.6],[26.9,13.0],[24.9,5.5],[24.6,4.1],[22.1,-5.1],[23.4,-5.5],[30.0,19.4],[31.6,25.4]]],
  ['way/1499786356', 33, 59.0, 'ac', [[27.8,44.9],[26.3,45.3],[26.1,44.7],[22.6,31.7],[21.6,28.1],[22.5,27.8],[23.2,27.7]]],
  ['way/1499786360', 33, 59.0, 'ac', [[39.2,-13.7],[40.6,-8.6],[43.3,1.3],[45.2,8.4],[45.5,9.7],[47.6,17.2],[48.0,18.6],[49.8,25.5],[53.4,38.8],[54.0,40.7],[52.8,41.0],[52.1,38.5],[51.9,37.9],[41.2,-1.6],[37.6,-14.9],[38.8,-15.2]]],
  ['way/1499786358', 33, 83.0, 'ac', [[30.0,19.4],[23.4,-5.5],[22.1,-5.1],[20.9,-4.8],[20.1,-4.6],[18.7,-9.8],[23.9,-11.2],[27.9,-10.7],[29.3,-11.1],[28.6,-13.9],[33.2,-15.1],[33.6,-13.8],[37.6,-14.9],[41.2,-1.6],[31.9,0.9],[32.5,3.1],[33.2,6.0],[34.4,10.2],[35.1,13.2],[36.3,17.7]]],
  ['way/1499786355', 33, 88.0, 'ac', [[27.8,44.9],[23.2,27.7],[30.3,25.8],[31.6,25.4],[30.0,19.4],[36.3,17.7],[35.1,13.2],[34.4,10.2],[33.2,6.0],[32.5,3.1],[31.9,0.9],[41.2,-1.6],[51.9,37.9],[52.1,38.5],[52.8,41.0],[49.1,42.1],[45.3,42.9],[41.7,43.2],[38.6,43.1],[35.8,42.8]]],
  ['way/1499786380', 87, 91.5, 'ac', [[33.6,30.3],[39.8,28.7],[42.9,40.3],[36.8,41.9]]],
  ['way/1499786374', 87, 90.0, 'ac', [[26.3,45.3],[26.1,44.7],[26.6,44.6],[36.8,41.9],[42.9,40.3],[51.4,38.0],[51.9,37.9],[52.1,38.5],[35.8,42.8],[27.8,44.9]]],
  ['way/1499786354', 87, 93.0, 'ac', [[24.7,42.1],[53.0,34.6],[53.2,35.4],[24.9,42.9]]],]

/** Ground above the base (lidar): falls ~7.5 m from College (-x) to Brevard (+x). */
const ground = (x: number) => Math.max(0, Math.min(8.8, 4.2 - 0.063 * x))

function build() {
  const epi = new Part(), ac = new Part(), aloft = new Part(), win = new Part(), roof = new Part(), screen = new Part()
  const wallOf = (k: Kind) => (k === 'ac' ? ac : k === 'aloft' ? aloft : epi)

  for (const [, z0, z1, kind, P] of PARTS) {
    const w = wallOf(kind)
    if (kind === 'bridge') {
      walls(epi, P, z0, z0 + 1.2)
      walls(win, P, z0 + 1.2, z1 - 0.8)
      walls(epi, P, z1 - 0.8, z1)
      cap(roof, P, z1); cap(epi, P, z0, false)
      continue
    }
    block(w, roof, P, z0, z1, z1 - z0 > 3 ? 0.35 : 0)
    // Window panels on every face long enough to carry them.
    for (let i = 0; i < P.length; i++) {
      const a = P[i], b = P[(i + 1) % P.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
      if (L < (kind === 'ac' ? 3.2 : 4.5)) continue
      const g = Math.max(z0, ground((a[0] + b[0]) / 2))
      const rows: [number, number][] = []
      if (kind === 'epi') {
        if (z0 < 1) rows.push([g + 0.6, g + 5.2])
        const top = z1 - 2.6
        if (top - (z0 < 1 ? g + 6.6 : z0 + 1.2) > 3) rows.push([z0 < 1 ? g + 6.6 : z0 + 1.2, top])
      } else {
        // hotel floors grouped three to a panel (3.1 m storeys)
        const s0 = z0 < 1 ? g + 6 : z0 + 1.0
        for (let z = s0; z + 6.5 < z1 - 1.2; z += 9.3) rows.push([z, z + 8.1])
      }
      const bay = kind === 'epi' ? 4.2 : kind === 'ac' ? 2.8 : 3.2, gap = kind === 'epi' ? 1.8 : kind === 'ac' ? 0.9 : 1.3
      const use = L - 2.4, k = Math.max(1, Math.round((use + gap) / (bay + gap))), ww = (use - (k - 1) * gap) / k
      if (ww < 1.2) continue
      for (let q = 0; q < k; q++) for (const [r0, r1] of rows) panel(win, a, b, 1.2 + q * (ww + gap), 1.2 + q * (ww + gap) + ww, r0, r1, 0.05)
    }
  }

  // The drum sign at the Trade/College corner: a dark screen cylinder on the roof.
  lathe(screen, -47.6, 38.5, [[7.3, 25.5], [7.3, 33.2]] as XY[], 16)
  lathe(roof, -47.6, 38.5, [[7.3, 33.2], [0, 33.2]] as XY[], 16)
  lathe(epi, -47.6, 38.5, [[5.0, 25.0], [5.0, 25.6], [7.3, 25.6]] as XY[], 16)

  return [
    { part: epi, material: EPI },
    { part: ac, material: AC },
    { part: aloft, material: ALOFT },
    { part: win, material: PALETTE.window },
    { part: roof, material: ROOF },
    { part: screen, material: SCREEN },
  ]
}

if (import.meta.main) await save('clt-epicentre', 'EpiCentre', [35.2253475, -80.8420033], 48, build(), 6500)
