/**
 * The Royal Courts of Justice, Strand, London — procedural, CC0-1.0, no
 * textures. bun generators/london-royal-courts-of-justice.ts
 *
 * Writes models/london-royal-courts-of-justice.glb (low) and
 * models/london-royal-courts-of-justice.detail.glb (detail, every
 * pinnacle and spirelet). Uses the kit in london-british-museum.ts.
 *
 * Map frame: x east, y north, z up, metres, turned to BEARING 342: +y (model
 * north) is compass 342°, so the Strand front faces model south (compass
 * 162°). Anchor: the area centroid of the outer ring of the OSM multipolygon
 * relation/2335557 (lng -0.113129, lat 51.514214). z = 0 is the Strand
 * pavement, the lowest ground the outline touches; the ground rises about
 * 5 m to Carey Street at the back, where the walls sink into the slope.
 *
 * What makes it the Royal Courts of Justice, and how each is drawn
 * - G. E. Street's Victorian Gothic Strand front (1873–82), pale Portland
 *   stone: the deep pointed entrance arch in its porch, between the two
 *   tall round turrets (41 m) with their conical spirelets, the Great Hall's
 *   south gable rising behind; the octagonal pavilions with steep slate
 *   pyramids either side; the slender lead flèche on the Great Hall's ridge
 *   (65 m).
 * - The clock tower at the east end (Bell Yard corner), its steep hipped
 *   slate roof (49 m) with the iron cresting, the corner turret, and the
 *   famous bracket clock over the Strand (detail model).
 * - The many steep slate roofs, gables, corbelled turrets with spirelets and
 *   pinnacles along the skyline, all real 3D: every OSM building:part is
 *   built as its own walls and roof (gabled, hipped, pyramidal or skillion,
 *   as tagged), turret parts as octagonal shafts with cones.
 * - The Great Hall's long steep roof (28 m walls, 40 m ridge) down the
 *   middle, its buttresses, and the red-brick ranges with stone bands at the
 *   back and round the quadrangles.
 * - Pointed (lancet) windows grouped two storeys to a panel on the street
 *   fronts.
 *
 * Evidence
 * - OSM (ODbL): relation/2335557 (amenity=courthouse, Grade I, NHLE 1264258,
 *   wikidata Q609835) and its 156 building:parts (heights, roof shapes and
 *   heights, orientations, materials): the model is built from them, so
 *   every height is OSM's unless noted. All are in `replaces`.
 * - Environment Agency LIDAR Composite DSM/DTM 1 m, Open Government Licence
 *   v3.0: Strand pavement 3.0 m above the box's ground_min (10.3 m AOD);
 *   checks against OSM where the DSM has returns: clock tower 48.9 (OSM 49),
 *   front gables 27-29 (OSM 28-29), Strand pavilions 22-24 to the visible
 *   roof (OSM 30 with thin tips), entrance flankers 21.4 (OSM 22). The DSM
 *   has no returns over the Great Hall and the flèche (it reads the floor
 *   there), so those come from OSM only: hall walls 28, ridge 40, flèche
 *   base 48 and tip 65 m.
 * - Photos (Wikimedia Commons), evidence:
 *   "Royal Courts of Justice FotoThalerTamas.jpg", Thaler Tamas, CC BY-SA 4.0
 *   (the Strand front from the south-east: entrance, turrets, pavilions,
 *   flèche, gables);
 *   "Westminster - Royal Courts of Justice - geograph.org.uk - 7482736.jpg",
 *   Colin Smith, CC BY-SA 2.0 (the entrance arch, the arcade over it, the
 *   hall gable);
 *   "View of the Royal Courts of Justice from Fleet Street -
 *   geograph.org.uk - 5117408.jpg", Robert Lamb, CC BY-SA 2.0 (the Strand
 *   front from the east, the Bell Yard arch, the turrets and spirelets in a
 *   row);
 *   "The Clocktower of the Royal Courts of Justice - 8705733950.jpg", Ronnie
 *   Macdonald, CC BY 2.0 (clock tower top, roof, bracket clock);
 *   "1264258 I Royal Courts of Justice, The Strand WC2A 2LL London 20250615
 *   0001.jpg", Tilman2007, CC BY-SA 4.0 (a banded tower and its slate roof,
 *   corner turret and cresting, from the north).
 * - Estimated from the photos: entrance arch 8 m wide and 11 m high, 2.5 m
 *   deep; turret shaft proportions; window sizes; the stone and slate
 *   colours; the brick colour pulled to the palette's lightness.
 * - Simplified: tracery, crockets, carved arcades and the rose window are
 *   left out or drawn as flat panels; the quadrangle and inner faces are
 *   plain.
 * - Look-only references: none.
 *
 * Night: the Strand front is floodlit; windows and the entrance glow.
 */
import { Part, type V3, type MaterialSpec } from './mesh'
import { PALETTE, finish } from './palette'
import { writeModel } from './london-buckingham-palace'
import { cbox, rect, qf, tf, gable, hip, cylinder } from './dc-white-house'
import { capPoly, earcut, ccw, type XY } from './dc-national-cathedral'
import { lathe, smooth, TAU } from './nyc-columbus-monument'
import { faceOf, fpanel, fblock, fpt, type Face } from './london-british-museum'

const ID = 'london-royal-courts-of-justice'
type P = { id: number; h: number; mh: number; rs: string; rh: number; ro: string; rd: number | null; m: string; r: number[][] }

const PARTS: P[] = [
  {id:1380992059,h:14.0,mh:0.0,rs:'fla',rh:0.0,ro:'',rd:null,m:'s',r:[[-30.9,-62.4],[-16.1,-62.5],[-16.1,-48.8],[-15.0,-48.8],[-16.3,-47.5],[-30.2,-47.6],[-31.5,-48.9],[-30.9,-48.9]]},
  {id:1380992062,h:38.0,mh:0.0,rs:'hip',rh:6.0,ro:'',rd:null,m:'s',r:[[76.7,-71.1],[76.6,-62.9],[71.8,-62.9],[71.9,-71.1]]},
  {id:1380992063,h:34.0,mh:0.0,rs:'pyr',rh:4.0,ro:'',rd:null,m:'s',r:[[-33.4,26.6],[-33.4,25.5],[-32.6,24.7],[-31.5,24.7],[-30.7,25.5],[-30.7,26.6],[-31.5,27.4],[-32.6,27.4]]},
  {id:1380992064,h:34.0,mh:0.0,rs:'pyr',rh:4.0,ro:'',rd:null,m:'s',r:[[-17.3,26.7],[-17.2,25.7],[-16.4,24.9],[-15.3,24.9],[-14.4,25.7],[-14.4,26.8],[-15.3,27.6],[-16.4,27.6]]},
  {id:1380992065,h:28.0,mh:0.0,rs:'ski',rh:3.0,ro:'',rd:359.65,m:'b',r:[[-15.0,28.9],[-16.6,28.9],[-16.6,27.0],[-15.0,27.0]]},
  {id:1380992066,h:28.0,mh:0.0,rs:'ski',rh:3.0,ro:'',rd:359.65,m:'b',r:[[-31.3,28.8],[-32.9,28.8],[-32.9,26.8],[-31.3,26.8]]},
  {id:1380992067,h:28.0,mh:0.0,rs:'ski',rh:3.0,ro:'',rd:269.65,m:'b',r:[[-34.7,-36.6],[-34.7,-38.2],[-32.8,-38.2],[-32.8,-36.6]]},
  {id:1380992068,h:28.0,mh:0.0,rs:'ski',rh:3.0,ro:'',rd:269.65,m:'b',r:[[-34.8,-28.8],[-34.7,-30.4],[-32.8,-30.4],[-32.8,-28.8]]},
  {id:1380992069,h:28.0,mh:0.0,rs:'ski',rh:3.0,ro:'',rd:269.65,m:'b',r:[[-34.8,-20.9],[-34.8,-22.5],[-32.9,-22.5],[-32.9,-20.9]]},
  {id:1380992070,h:28.0,mh:0.0,rs:'ski',rh:3.0,ro:'',rd:269.65,m:'b',r:[[-34.9,-13.2],[-34.9,-14.8],[-32.9,-14.7],[-32.9,-13.2]]},
  {id:1380992071,h:28.0,mh:0.0,rs:'ski',rh:3.0,ro:'',rd:269.65,m:'b',r:[[-34.9,-5.4],[-34.9,-6.9],[-33.0,-6.9],[-33.0,-5.3]]},
  {id:1380992072,h:28.0,mh:0.0,rs:'ski',rh:3.0,ro:'',rd:269.65,m:'b',r:[[-35.0,2.4],[-35.0,0.9],[-33.0,0.9],[-33.0,2.5]]},
  {id:1380992073,h:28.0,mh:0.0,rs:'ski',rh:3.0,ro:'',rd:269.65,m:'b',r:[[-35.0,10.3],[-35.0,8.7],[-33.1,8.7],[-33.1,10.3]]},
  {id:1380992074,h:28.0,mh:0.0,rs:'ski',rh:3.0,ro:'',rd:269.65,m:'b',r:[[-35.1,18.1],[-35.1,16.5],[-33.1,16.5],[-33.2,18.1]]},
  {id:1380992075,h:28.0,mh:0.0,rs:'ski',rh:3.0,ro:'',rd:269.65,m:'b',r:[[-35.2,26.8],[-35.1,25.2],[-33.2,25.2],[-33.2,26.8]]},
  {id:1380992076,h:28.0,mh:0.0,rs:'ski',rh:3.0,ro:'',rd:89.64999999999998,m:'b',r:[[-14.7,26.9],[-14.7,25.4],[-12.7,25.4],[-12.7,26.9]]},
  {id:1380992077,h:28.0,mh:0.0,rs:'ski',rh:3.0,ro:'',rd:89.64999999999998,m:'b',r:[[-14.6,18.2],[-14.6,16.7],[-12.6,16.7],[-12.6,18.2]]},
  {id:1380992078,h:28.0,mh:0.0,rs:'ski',rh:3.0,ro:'',rd:89.64999999999998,m:'b',r:[[-14.5,10.5],[-14.5,8.9],[-12.6,8.9],[-12.6,10.5]]},
  {id:1380992079,h:28.0,mh:0.0,rs:'ski',rh:3.0,ro:'',rd:89.64999999999998,m:'b',r:[[-14.5,2.6],[-14.5,1.1],[-12.5,1.1],[-12.5,2.6]]},
  {id:1380992080,h:28.0,mh:0.0,rs:'ski',rh:3.0,ro:'',rd:89.64999999999998,m:'b',r:[[-14.4,-5.2],[-14.4,-6.8],[-12.5,-6.8],[-12.5,-5.2]]},
  {id:1380992081,h:28.0,mh:0.0,rs:'ski',rh:3.0,ro:'',rd:89.64999999999998,m:'b',r:[[-14.4,-13.0],[-14.4,-14.5],[-12.4,-14.5],[-12.4,-13.0]]},
  {id:1380992082,h:28.0,mh:0.0,rs:'ski',rh:3.0,ro:'',rd:89.64999999999998,m:'b',r:[[-14.3,-20.8],[-14.3,-22.4],[-12.4,-22.4],[-12.4,-20.8]]},
  {id:1380992083,h:28.0,mh:0.0,rs:'ski',rh:3.0,ro:'',rd:89.64999999999998,m:'b',r:[[-14.3,-28.6],[-14.3,-30.2],[-12.3,-30.2],[-12.3,-28.6]]},
  {id:1380992084,h:28.0,mh:0.0,rs:'ski',rh:3.0,ro:'',rd:89.64999999999998,m:'b',r:[[-14.2,-36.5],[-14.2,-38.1],[-12.3,-38.1],[-12.3,-36.5]]},
  {id:1380992085,h:41.0,mh:0.0,rs:'pyr',rh:12.0,ro:'',rd:null,m:'s',r:[[-16.3,-45.7],[-16.3,-47.5],[-15.0,-48.8],[-13.2,-48.8],[-12.0,-47.5],[-12.0,-45.7],[-13.2,-44.4],[-15.1,-44.4]]},
  {id:1380992086,h:41.0,mh:0.0,rs:'pyr',rh:12.0,ro:'',rd:null,m:'s',r:[[-34.6,-45.8],[-34.6,-47.6],[-33.3,-48.9],[-31.5,-48.9],[-30.2,-47.6],[-30.2,-45.8],[-31.5,-44.5],[-33.3,-44.5]]},
  {id:1380992087,h:20.0,mh:0.0,rs:'hip',rh:3.0,ro:'',rd:null,m:'b',r:[[42.6,-58.3],[49.2,-58.4],[49.1,-46.8],[42.6,-46.8]]},
  {id:1380992088,h:49.0,mh:0.0,rs:'hip',rh:12.0,ro:'',rd:null,m:'s',r:[[63.9,-71.2],[73.8,-71.1],[73.6,-60.2],[63.8,-60.3]]},
  {id:1380992089,h:18.0,mh:0.0,rs:'fla',rh:0.0,ro:'',rd:null,m:'b',r:[[67.9,-18.3],[68.9,-18.3],[69.7,-17.6],[69.6,-14.5],[67.9,-14.5]]},
  {id:1380992090,h:30.0,mh:0.0,rs:'pyr',rh:9.0,ro:'',rd:null,m:'s',r:[[-7.4,-72.2],[-4.3,-72.0],[-1.9,-69.9],[-1.9,-66.3],[-4.3,-64.2],[-7.6,-64.2],[-10.1,-66.6],[-10.1,-69.5]]},
  {id:1380992091,h:30.0,mh:0.0,rs:'pyr',rh:9.0,ro:'',rd:null,m:'s',r:[[-43.0,-72.6],[-39.5,-72.5],[-37.4,-70.3],[-37.3,-66.6],[-39.5,-64.4],[-43.2,-64.5],[-45.5,-66.7],[-45.5,-69.4]]},
  {id:1380992092,h:22.0,mh:0.0,rs:'gab',rh:6.0,ro:'al',rd:null,m:'s',r:[[-41.8,-65.4],[-30.9,-65.5],[-30.9,-48.9],[-41.8,-48.9]]},
  {id:1380992093,h:22.0,mh:0.0,rs:'gab',rh:6.0,ro:'al',rd:null,m:'s',r:[[-16.1,-65.3],[-5.7,-65.4],[-5.7,-48.8],[-16.1,-48.8]]},
  {id:1380992094,h:13.5,mh:0.0,rs:'gab',rh:2.0,ro:'al',rd:null,m:'b',r:[[-6.6,-48.0],[-2.3,-48.1],[-2.5,50.7],[-6.7,50.6]]},
  {id:1380992095,h:13.5,mh:0.0,rs:'gab',rh:2.0,ro:'al',rd:null,m:'b',r:[[-40.2,-48.3],[-40.3,50.7],[-45.2,50.7],[-45.1,-48.4]]},
  {id:1380992096,h:16.0,mh:0.0,rs:'hip',rh:2.0,ro:'',rd:null,m:'b',r:[[0.8,34.9],[0.8,26.8],[6.9,26.8],[6.9,34.9]]},
  {id:1380992097,h:13.0,mh:0.0,rs:'fla',rh:0.0,ro:'',rd:null,m:'b',r:[[10.2,22.6],[10.2,39.5],[-7.4,39.5],[-7.4,22.6]]},
  {id:1380992098,h:15.0,mh:0.0,rs:'pyr',rh:3.0,ro:'',rd:null,m:'b',r:[[-37.9,53.4],[-37.9,40.9],[-26.9,40.8],[-26.8,53.3]]},
  {id:1380992099,h:15.0,mh:0.0,rs:'gab',rh:3.0,ro:'al',rd:null,m:'b',r:[[-21.4,53.2],[-21.4,41.0],[-10.6,40.9],[-10.6,53.1]]},
  {id:1380992100,h:15.0,mh:0.0,rs:'hip',rh:3.0,ro:'',rd:null,m:'b',r:[[10.3,56.9],[-6.7,56.9],[-6.7,45.1],[10.2,45.0]]},
  {id:1380992101,h:15.0,mh:0.0,rs:'hip',rh:3.0,ro:'',rd:null,m:'b',r:[[10.2,20.5],[-6.8,20.6],[-6.8,8.7],[10.1,8.6]]},
  {id:1380992102,h:15.0,mh:0.0,rs:'hip',rh:3.0,ro:'',rd:null,m:'b',r:[[10.3,3.0],[-6.6,3.1],[-6.7,-8.8],[10.3,-8.9]]},
  {id:1380992103,h:15.0,mh:0.0,rs:'hip',rh:3.0,ro:'',rd:null,m:'b',r:[[10.3,-10.7],[-6.6,-10.6],[-6.6,-22.5],[10.3,-22.6]]},
  {id:1380992104,h:15.0,mh:0.0,rs:'hip',rh:3.0,ro:'',rd:null,m:'b',r:[[10.4,-28.3],[-6.5,-28.2],[-6.6,-40.1],[10.4,-40.1]]},
  {id:1380992105,h:15.0,mh:0.0,rs:'hip',rh:3.0,ro:'',rd:null,m:'b',r:[[10.4,-42.1],[-6.5,-42.0],[-6.6,-53.9],[10.4,-53.9]]},
  {id:1380992106,h:15.0,mh:0.0,rs:'hip',rh:3.0,ro:'',rd:null,m:'b',r:[[-40.3,56.6],[-57.2,56.6],[-57.2,44.7],[-40.3,44.7]]},
  {id:1380992107,h:15.0,mh:0.0,rs:'hip',rh:3.0,ro:'',rd:null,m:'b',r:[[-40.2,33.3],[-57.1,33.3],[-57.2,21.4],[-40.2,21.4]]},
  {id:1380992108,h:15.0,mh:0.0,rs:'hip',rh:3.0,ro:'',rd:null,m:'b',r:[[-40.2,20.3],[-57.1,20.3],[-57.2,8.4],[-40.2,8.4]]},
  {id:1380992109,h:15.0,mh:0.0,rs:'hip',rh:3.0,ro:'',rd:null,m:'b',r:[[-40.1,2.8],[-57.0,2.8],[-57.1,-9.1],[-40.1,-9.1]]},
  {id:1380992110,h:15.0,mh:0.0,rs:'hip',rh:3.0,ro:'',rd:null,m:'b',r:[[-40.1,-11.0],[-57.1,-11.0],[-57.1,-22.9],[-40.1,-22.9]]},
  {id:1380992111,h:15.0,mh:0.0,rs:'hip',rh:3.0,ro:'',rd:null,m:'b',r:[[-40.2,-42.4],[-57.1,-42.3],[-57.1,-54.2],[-40.2,-54.2]]},
  {id:1380992112,h:15.0,mh:0.0,rs:'hip',rh:3.0,ro:'',rd:null,m:'b',r:[[-40.1,-28.5],[-57.1,-28.4],[-57.1,-40.3],[-40.2,-40.4]]},
  {id:1380992113,h:35.0,mh:0.0,rs:'hip',rh:9.0,ro:'',rd:null,m:'s',r:[[-69.6,37.6],[-60.1,37.6],[-60.1,44.9],[-69.7,44.9]]},
  {id:1380992114,h:36.0,mh:0.0,rs:'hip',rh:11.0,ro:'',rd:null,m:'s',r:[[-70.8,-1.1],[-62.5,-1.1],[-62.6,11.7],[-70.9,11.6]]},
  {id:1380992115,h:35.0,mh:0.0,rs:'hip',rh:9.0,ro:'',rd:null,m:'s',r:[[-68.1,-37.5],[-59.9,-37.4],[-60.0,-26.8],[-68.3,-26.9]]},
  {id:1380992116,h:21.0,mh:0.0,rs:'fla',rh:0.0,ro:'',rd:null,m:'b',r:[[22.3,51.2],[20.4,51.2],[20.4,45.5],[22.3,45.4]]},
  {id:1380992117,h:39.0,mh:0.0,rs:'hip',rh:12.0,ro:'',rd:null,m:'s',r:[[48.9,63.4],[48.9,62.6],[57.6,62.7],[57.5,72.2],[48.8,72.2]]},
  {id:1380992118,h:34.0,mh:0.0,rs:'hip',rh:6.0,ro:'',rd:null,m:'b',r:[[72.4,-3.7],[62.8,-3.7],[62.8,-11.8],[72.4,-11.7]]},
  {id:1380992119,h:29.0,mh:0.0,rs:'gab',rh:8.0,ro:'al',rd:null,m:'b',r:[[67.4,72.3],[56.7,72.2],[57.7,-44.1],[68.0,-44.0],[67.9,-14.5]]},
  {id:1380992120,h:28.0,mh:0.0,rs:'gab',rh:6.0,ro:'al',rd:null,m:'b',r:[[57.0,45.5],[49.6,45.5],[49.9,-39.9],[49.1,-40.0],[49.2,-63.2],[58.5,-63.1],[58.5,-53.6],[59.7,-52.5],[59.5,-47.1],[58.5,-46.1],[58.4,-44.1],[57.7,-44.1]]},
  {id:1380992121,h:28.0,mh:0.0,rs:'ski',rh:7.0,ro:'',rd:89.89999999999998,m:'b',r:[[-62.4,21.5],[-57.2,21.4],[-57.1,33.3],[-57.2,59.7],[-62.5,64.9]]},
  {id:1380992123,h:40.0,mh:0.0,rs:'gab',rh:12.0,ro:'al',rd:null,m:'b',r:[[-14.1,-45.8],[-14.7,26.7],[-33.2,26.6],[-32.7,-45.9]]},
  {id:1381530875,h:19.0,mh:0.0,rs:'pyr',rh:4.0,ro:'',rd:null,m:'s',r:[[-12.7,-67.2],[-11.4,-68.3],[-10.1,-68.2],[-8.7,-67.2],[-8.7,-65.0],[-9.9,-63.8],[-11.8,-63.8],[-12.8,-65.3]]},
  {id:1381530876,h:19.0,mh:0.0,rs:'pyr',rh:4.0,ro:'',rd:null,m:'s',r:[[-37.3,-68.4],[-35.7,-68.3],[-34.3,-67.0],[-34.4,-65.4],[-35.4,-64.1],[-37.5,-64.1],[-38.5,-65.1],[-38.5,-67.1]]},
  {id:1381530899,h:21.0,mh:9.0,rs:'ski',rh:1.0,ro:'',rd:180.0,m:'s',r:[[24.3,44.2],[29.2,44.2],[29.4,45.4],[24.0,45.4]]},
  {id:1381530900,h:29.0,mh:13.0,rs:'pyr',rh:6.0,ro:'',rd:null,m:'s',r:[[42.2,-50.1],[43.3,-50.3],[44.0,-49.6],[44.2,-48.5],[43.5,-47.7],[42.6,-47.6],[41.7,-48.1],[41.6,-49.1]]},
  {id:1381530901,h:29.0,mh:13.0,rs:'pyr',rh:6.0,ro:'',rd:null,m:'s',r:[[32.7,-48.7],[32.9,-50.0],[34.3,-50.6],[35.2,-50.0],[35.4,-48.4],[34.6,-47.6],[33.4,-47.8]]},
  {id:1381530902,h:29.0,mh:13.0,rs:'pyr',rh:6.0,ro:'',rd:null,m:'s',r:[[80.9,-59.3],[81.6,-58.4],[81.5,-57.5],[80.8,-56.8],[79.9,-56.8],[79.2,-57.4],[79.3,-58.5],[80.0,-59.3]]},
  {id:1381530903,h:29.0,mh:13.0,rs:'pyr',rh:6.0,ro:'',rd:null,m:'s',r:[[79.1,-68.9],[79.9,-69.6],[81.0,-69.5],[81.5,-68.9],[81.4,-67.7],[80.8,-67.1],[79.7,-67.2],[79.0,-67.7]]},
  {id:1381530904,h:29.0,mh:13.0,rs:'pyr',rh:6.0,ro:'',rd:null,m:'s',r:[[42.2,-69.9],[43.6,-69.9],[44.3,-69.1],[44.2,-67.8],[43.4,-67.1],[42.3,-67.1],[41.5,-67.8],[41.5,-69.0]]},
  {id:1381530905,h:24.0,mh:0.0,rs:'gab',rh:2.0,ro:'',rd:null,m:'b',r:[[60.3,-58.3],[80.4,-58.1],[80.3,-55.5],[60.3,-55.7]]},
  {id:1381530906,h:29.0,mh:13.0,rs:'pyr',rh:6.0,ro:'',rd:null,m:'s',r:[[35.5,-68.7],[35.3,-67.6],[34.5,-67.1],[33.4,-67.1],[32.6,-68.0],[32.6,-69.1],[33.5,-69.8],[34.6,-69.8]]},
  {id:1381530907,h:29.0,mh:13.0,rs:'pyr',rh:6.0,ro:'',rd:null,m:'s',r:[[20.4,-69.9],[21.9,-69.8],[22.5,-69.0],[22.5,-68.0],[21.7,-67.1],[20.4,-67.1],[19.6,-68.0],[19.6,-68.9]]},
  {id:1381530908,h:29.0,mh:13.0,rs:'pyr',rh:6.0,ro:'',rd:null,m:'s',r:[[10.4,-69.8],[11.6,-69.8],[12.3,-68.9],[12.2,-68.1],[11.6,-67.2],[10.5,-67.2],[9.7,-67.9],[9.7,-69.0]]},
  {id:1381530909,h:29.0,mh:13.0,rs:'pyr',rh:6.0,ro:'',rd:null,m:'s',r:[[-58.5,-69.4],[-57.7,-70.3],[-56.4,-70.3],[-55.9,-68.6],[-56.4,-67.8],[-57.7,-67.8],[-58.4,-68.5]]},
  {id:1381530910,h:29.0,mh:13.0,rs:'pyr',rh:6.0,ro:'',rd:null,m:'s',r:[[-67.7,-70.3],[-66.5,-70.3],[-65.8,-69.6],[-65.9,-68.4],[-66.5,-67.7],[-67.7,-67.8],[-68.4,-68.4],[-68.4,-69.5]]},
  {id:1381530919,h:28.0,mh:0.0,rs:'gab',rh:6.0,ro:'al',rd:null,m:'s',r:[[42.6,-58.3],[38.5,-58.4],[38.6,-68.6],[80.4,-68.3],[80.4,-58.1]]},
  {id:1381530920,h:36.0,mh:0.0,rs:'pyr',rh:6.0,ro:'',rd:null,m:'s',r:[[48.9,63.4],[50.0,63.4],[51.0,65.3],[49.9,67.1],[47.8,67.1],[46.7,65.2],[47.8,63.3]]},
  {id:1381530921,h:22.0,mh:0.0,rs:'gab',rh:6.0,ro:'al',rd:null,m:'s',r:[[23.8,-54.7],[23.9,-63.3],[31.5,-63.3],[31.5,-54.6]]},
  {id:1381530927,h:40.5,mh:0.0,rs:'gab',rh:12.0,ro:'ac',rd:null,m:'s',r:[[-14.1,-45.8],[-32.7,-45.9],[-32.7,-47.6],[-14.1,-47.5]]},
  {id:1381530928,h:26.0,mh:0.0,rs:'hip',rh:4.0,ro:'',rd:null,m:'b',r:[[67.9,-14.5],[72.4,-14.6],[72.4,-10.6],[66.8,-10.6],[66.8,-14.5]]},
  {id:1381530929,h:24.0,mh:0.0,rs:'gab',rh:7.0,ro:'al',rd:null,m:'s',r:[[10.3,-59.5],[-5.7,-59.5],[-5.7,-69.0],[14.0,-68.9],[13.9,-59.5]]},
  {id:1381530930,h:24.0,mh:0.0,rs:'gab',rh:7.0,ro:'al',rd:null,m:'s',r:[[-57.1,-59.7],[-59.9,-59.7],[-59.7,-69.4],[-41.3,-69.4],[-41.5,-59.7]]},
  {id:1381530931,h:16.0,mh:0.0,rs:'fla',rh:0.0,ro:'',rd:null,m:'s',r:[[20.8,-51.5],[21.0,-66.7],[34.0,-66.6],[33.9,-51.5]]},
  {id:1382276084,h:28.0,mh:0.0,rs:'gab',rh:6.0,ro:'ac',rd:null,m:'s',r:[[56.9,57.0],[56.8,62.7],[49.5,62.6],[49.5,57.0]]},
  {id:1382276085,h:25.0,mh:0.0,rs:'gab',rh:3.0,ro:'al',rd:null,m:'b',r:[[56.9,57.0],[49.5,57.0],[49.6,45.5],[57.0,45.5]]},
  {id:1382276086,h:27.0,mh:0.0,rs:'ski',rh:8.0,ro:'',rd:179.8,m:'b',r:[[49.5,51.3],[27.7,51.2],[27.6,49.9],[31.3,45.4],[49.6,45.5]]},
  {id:1382276087,h:28.0,mh:0.0,rs:'gab',rh:6.0,ro:'al',rd:null,m:'s',r:[[34.0,-58.4],[34.0,-68.7],[42.7,-68.6],[42.6,-58.3]]},
  {id:1382276088,h:29.0,mh:0.0,rs:'gab',rh:7.0,ro:'al',rd:null,m:'b',r:[[56.1,8.9],[48.3,8.9],[48.3,1.5],[56.1,1.5]]},
  {id:1382276089,h:28.0,mh:0.0,rs:'gab',rh:6.0,ro:'al',rd:null,m:'b',r:[[56.1,1.5],[48.3,1.5],[48.3,-5.0],[56.1,-4.9]]},
  {id:1382276090,h:28.0,mh:0.0,rs:'gab',rh:6.0,ro:'al',rd:null,m:'b',r:[[56.1,8.9],[56.1,14.9],[48.3,14.8],[48.3,8.9]]},
  {id:1382276091,h:29.0,mh:0.0,rs:'gab',rh:7.0,ro:'ac',rd:null,m:'s',r:[[-28.7,65.7],[-19.7,65.7],[-19.8,71.6],[-28.7,71.6]]},
  {id:1382276092,h:29.0,mh:0.0,rs:'ski',rh:7.0,ro:'',rd:179.7,m:'b',r:[[-42.2,65.6],[-42.2,59.7],[-6.2,59.8],[-6.3,65.8]]},
  {id:1382276093,h:28.0,mh:0.0,rs:'ski',rh:7.0,ro:'',rd:179.6,m:'b',r:[[-6.3,65.2],[-6.2,59.8],[10.3,59.9],[15.2,64.4],[15.2,65.3]]},
  {id:1382276107,h:23.0,mh:0.0,rs:'fla',rh:0.0,ro:'',rd:null,m:'b',r:[[-59.9,-57.9],[-57.1,-57.9],[-57.1,-59.7],[-54.8,-59.7],[-54.8,-55.6],[-59.9,-55.6]]},
  {id:1382276119,h:26.0,mh:0.0,rs:'gab',rh:5.0,ro:'ac',rd:null,m:'b',r:[[63.4,53.5],[63.4,45.6],[70.6,45.6],[70.6,53.5]]},
  {id:1382276120,h:26.0,mh:0.0,rs:'gab',rh:5.0,ro:'ac',rd:null,m:'b',r:[[63.4,61.3],[63.4,53.5],[70.6,53.5],[70.6,61.3]]},
  {id:1382276121,h:26.0,mh:0.0,rs:'gab',rh:5.0,ro:'ac',rd:null,m:'b',r:[[63.8,8.8],[63.8,1.9],[69.8,1.9],[69.8,8.8],[67.7,8.8]]},
  {id:1382276122,h:26.0,mh:0.0,rs:'gab',rh:5.0,ro:'ac',rd:null,m:'b',r:[[69.8,-4.6],[69.8,1.9],[63.8,1.9],[63.8,-4.6]]},
  {id:1382276123,h:29.0,mh:0.0,rs:'gab',rh:8.0,ro:'ac',rd:null,m:'s',r:[[31.2,51.2],[31.2,56.9],[22.3,56.9],[22.3,51.2]]},
  {id:1382276124,h:21.0,mh:0.0,rs:'fla',rh:0.0,ro:'',rd:null,m:'s',r:[[22.3,51.2],[22.3,56.9],[20.3,57.0],[20.4,51.2]]},
  {id:1382276125,h:27.0,mh:0.0,rs:'ski',rh:8.0,ro:'',rd:359.8,m:'s',r:[[31.2,56.9],[27.7,52.7],[27.7,51.2],[49.5,51.3],[49.5,57.0]]},
  {id:1382276126,h:24.0,mh:0.0,rs:'gab',rh:8.0,ro:'ac',rd:null,m:'s',r:[[30.8,56.9],[30.8,52.8],[41.3,52.8],[41.2,61.3],[30.8,61.3]]},
  {id:1382276127,h:29.0,mh:0.0,rs:'gab',rh:8.0,ro:'ac',rd:null,m:'b',r:[[22.3,51.2],[22.3,45.4],[31.3,45.4],[31.2,51.2]]},
  {id:1382276128,h:28.0,mh:0.0,rs:'gab',rh:7.0,ro:'al',rd:null,m:'b',r:[[20.3,57.0],[10.3,56.9],[10.2,21.9],[20.3,21.9]]},
  {id:1382276129,h:28.0,mh:0.0,rs:'gab',rh:7.0,ro:'al',rd:null,m:'b',r:[[20.8,-51.5],[20.6,-10.3],[10.3,-10.4],[10.3,-59.5],[20.9,-59.4]]},
  {id:1382276130,h:26.0,mh:0.0,rs:'gab',rh:5.0,ro:'ac',rd:null,m:'b',r:[[21.6,17.1],[17.4,17.1],[17.4,11.3],[22.6,11.3],[22.6,17.1]]},
  {id:1382276131,h:26.0,mh:0.0,rs:'gab',rh:5.0,ro:'ac',rd:null,m:'b',r:[[21.9,-5.5],[22.9,-5.5],[22.9,0.5],[17.7,0.5],[17.7,-5.5]]},
  {id:1382276132,h:31.0,mh:0.0,rs:'gab',rh:10.0,ro:'ac',rd:null,m:'b',r:[[13.1,12.1],[13.1,-0.7],[24.0,-0.7],[24.0,12.1]]},
  {id:1382276133,h:28.0,mh:0.0,rs:'gab',rh:7.0,ro:'ac',rd:null,m:'s',r:[[10.3,-59.5],[10.5,-68.9],[21.1,-68.8],[20.9,-59.4]]},
  {id:1382276134,h:29.0,mh:0.0,rs:'hip',rh:8.0,ro:'',rd:null,m:'b',r:[[21.6,17.1],[21.6,21.9],[10.2,21.9],[10.1,8.2],[13.1,8.2],[13.1,3.5],[10.3,3.5],[10.3,-10.4],[21.9,-10.3]]},
  {id:1382276135,h:21.0,mh:0.0,rs:'fla',rh:0.0,ro:'',rd:null,m:'b',r:[[7.3,59.9],[7.2,55.4],[10.3,55.4],[10.3,59.9]]},
  {id:1382276136,h:21.0,mh:0.0,rs:'fla',rh:0.0,ro:'',rd:null,m:'b',r:[[-57.2,55.0],[-54.8,55.0],[-54.9,59.7],[-57.2,59.7]]},
  {id:1382276137,h:10.0,mh:0.0,rs:'fla',rh:0.0,ro:'',rd:null,m:'s',r:[[-57.1,-40.3],[-57.1,-42.3],[-45.1,-42.3],[-45.1,-40.3]]},
  {id:1382276138,h:10.0,mh:0.0,rs:'fla',rh:0.0,ro:'',rd:null,m:'s',r:[[-57.1,-9.1],[-57.1,-11.0],[-45.1,-11.0],[-45.1,-9.1]]},
  {id:1382276139,h:10.0,mh:0.0,rs:'fla',rh:0.0,ro:'',rd:null,m:'s',r:[[-57.2,21.4],[-57.1,20.3],[-45.1,20.3],[-45.1,21.4]]},
  {id:1382276140,h:10.0,mh:0.0,rs:'fla',rh:0.0,ro:'',rd:null,m:'s',r:[[-2.4,20.6],[10.2,20.5],[10.2,22.6],[-2.4,22.6]]},
  {id:1382276141,h:10.0,mh:0.0,rs:'fla',rh:0.0,ro:'',rd:null,m:'s',r:[[-2.4,-10.6],[10.3,-10.7],[10.3,-8.9],[-2.4,-8.8]]},
  {id:1382276142,h:10.0,mh:0.0,rs:'fla',rh:0.0,ro:'',rd:null,m:'s',r:[[-2.3,-42.0],[10.4,-42.1],[10.4,-40.1],[-2.3,-40.1]]},
  {id:1385968952,h:28.0,mh:0.0,rs:'ski',rh:7.0,ro:'',rd:179.6,m:'b',r:[[-62.5,64.9],[-57.2,59.7],[-42.2,59.7],[-42.2,65.0]]},
  {id:1385968954,h:28.0,mh:0.0,rs:'gab',rh:7.0,ro:'ac',rd:null,m:'s',r:[[20.3,70.5],[20.4,71.2],[7.4,71.2],[7.5,65.2],[20.4,65.3]]},
  {id:1385968955,h:28.0,mh:0.0,rs:'gab',rh:7.0,ro:'ac',rd:null,m:'s',r:[[-68.1,70.9],[-68.0,64.8],[-54.9,64.9],[-54.9,71.1]]},
  {id:1385968956,h:28.0,mh:0.0,rs:'ski',rh:7.0,ro:'',rd:90.0,m:'b',r:[[-62.9,21.5],[-62.9,-11.0],[-57.1,-11.0],[-57.0,3.2],[-59.7,3.2],[-59.8,8.2],[-57.2,8.1],[-57.2,21.4]]},
  {id:1385968957,h:28.0,mh:0.0,rs:'ski',rh:7.0,ro:'',rd:89.89999999999998,m:'b',r:[[-62.2,-59.8],[-57.1,-59.7],[-57.1,-11.0],[-62.3,-11.0]]},
  {id:1385968958,h:28.0,mh:0.0,rs:'gab',rh:6.0,ro:'al',rd:null,m:'b',r:[[42.6,-58.3],[42.6,-49.1],[33.9,-49.1],[34.0,-58.4]]},
  {id:1385968959,h:10.0,mh:0.0,rs:'fla',rh:0.0,ro:'',rd:null,m:'s',r:[[-10.6,53.1],[-10.6,44.5],[-6.7,44.4],[-6.7,53.0]]},
  {id:1385968960,h:10.0,mh:0.0,rs:'fla',rh:0.0,ro:'',rd:null,m:'s',r:[[-40.3,44.7],[-37.9,44.7],[-37.9,53.4],[-40.3,53.4]]},
  {id:1385980712,h:28.0,mh:0.0,rs:'ski',rh:7.0,ro:'',rd:269.9,m:'s',r:[[-62.3,-11.0],[-67.6,-11.0],[-67.3,-59.8],[-62.2,-59.8]]},
  {id:1385980713,h:28.0,mh:0.0,rs:'gab',rh:7.0,ro:'ac',rd:null,m:'s',r:[[-67.3,-59.8],[-67.3,-69.6],[-57.0,-69.4],[-57.1,-59.7]]},
  {id:1385980714,h:28.0,mh:0.0,rs:'ski',rh:7.0,ro:'',rd:270.0,m:'s',r:[[-62.9,21.5],[-69.2,21.6],[-69.3,-11.1],[-62.9,-11.0]]},
  {id:1385980715,h:28.0,mh:0.0,rs:'ski',rh:7.0,ro:'',rd:269.9,m:'s',r:[[-62.5,64.9],[-68.0,64.8],[-67.7,21.6],[-62.4,21.5]]},
  {id:1385980716,h:29.0,mh:0.0,rs:'ski',rh:7.0,ro:'',rd:359.7,m:'s',r:[[-42.2,65.6],[-6.3,65.8],[-6.3,71.7],[-42.3,71.5]]},
  {id:1385980717,h:28.0,mh:0.0,rs:'ski',rh:7.0,ro:'',rd:359.6,m:'s',r:[[-61.4,64.9],[-42.2,65.0],[-42.3,70.3],[-54.9,70.3]]},
  {id:1385980718,h:28.0,mh:0.0,rs:'ski',rh:7.0,ro:'',rd:359.6,m:'s',r:[[15.2,65.3],[15.2,66.2],[7.4,70.5],[-6.3,70.5],[-6.3,65.2]]},
  {id:1385980719,h:28.0,mh:0.0,rs:'gab',rh:7.0,ro:'ac',rd:null,m:'s',r:[[10.3,56.9],[20.3,57.0],[20.4,65.3],[10.3,65.3]]},
]

const area = (r: XY[]) => Math.abs(r.reduce((s, a, i) => { const b = r[(i + 1) % r.length]; return s + a[0] * b[1] - b[0] * a[1] }, 0)) / 2
const centroid = (r: XY[]): XY => [r.reduce((s, p) => s + p[0], 0) / r.length, r.reduce((s, p) => s + p[1], 0) / r.length]

/** A pointed-arch outline on a face: springing at zs, apex at za, from s0 to s1. */
function pointedPts(s0: number, s1: number, zs: number, seg: number): XY[] {
  const w = s1 - s0, out: XY[] = []
  // equilateral arch: two arcs of radius w centred on the opposite springers
  for (let k = 0; k <= seg; k++) { const t = (Math.PI / 3) * (k / seg); out.push([s1 - w * Math.cos(t), zs + w * Math.sin(t)]) }
  for (let k = seg - 1; k >= 0; k--) { const t = (Math.PI / 3) * (k / seg); out.push([s0 + w * Math.cos(t), zs + w * Math.sin(t)]) }
  return out // from (s0, zs) over the apex to (s1, zs)
}
/** A lancet window panel: rectangle to the springing, pointed head. */
function lancet(p: Part, f: Face, c: number, w: number, z0: number, z1: number, seg: number, d = 0.06) {
  const zs = z1 - w * 0.87
  fpanel(p, f, c - w / 2, c + w / 2, z0, zs, d)
  const pts = pointedPts(c - w / 2, c + w / 2, zs, seg)
  const n: V3 = [f.n[0], f.n[1], 0]
  for (let i = 1; i < pts.length - 1; i++) tf(p, fpt(f, pts[0][0], pts[0][1], d), fpt(f, pts[i][0], pts[i][1], d), fpt(f, pts[i + 1][0], pts[i + 1][1], d), n)
}
/** An octagonal (n-gon) prism ring at (cx, cy). */
const ngon = (cx: number, cy: number, r: number, n: number, z: number, ph = Math.PI / n): V3[] => Array.from({ length: n }, (_, i) => [cx + r * Math.cos(ph + (TAU * i) / n), cy + r * Math.sin(ph + (TAU * i) / n), z])
/** A turret: n-gon shaft z0..z1, a corbel band, a spirelet cone to tip, a finial. */
function turret(L: { hi: boolean }, shaft: Part, band: Part, cone: Part, cx: number, cy: number, r: number, z0: number, z1: number, tip: number) {
  const n = L.hi ? 10 : 8
  shaft.loft([ngon(cx, cy, r, n, z0), ngon(cx, cy, r, n, z1)])
  band.loft([ngon(cx, cy, r, n, z1), ngon(cx, cy, r * 1.18, n, z1 + 0.35), ngon(cx, cy, r * 1.18, n, z1 + 0.8)])
  band.cap(ngon(cx, cy, r * 1.18, n, z1 + 0.8), true)
  const ring = ngon(cx, cy, r * 1.1, n, z1 + 0.8)
  for (let i = 0; i < n; i++) qf(cone, ring[i], ring[(i + 1) % n], [cx, cy, tip], [cx, cy, tip], [ring[i][0] - cx, ring[i][1] - cy, 0.2])
  if (L.hi) cylinder(band, cx, cy, 0.09, tip - 0.2, tip + 1.4, 5)
}

function build(hi: boolean) {
  const L = { hi }
  const stone = new Part(), brick = new Part(), slate = new Part(), win = new Part(), trim = new Part(), door = new Part()
  const parts = PARTS.map((p) => ({ ...p, ring: ccw(p.r as XY[]) as XY[], eave: p.h - p.rh }))
  // Edges shared with an equal or taller neighbour are hidden; skip their walls.
  const segs = parts.map((p) => p.ring.map((a, i) => [a, p.ring[(i + 1) % p.ring.length]] as [XY, XY]))
  const hidden = (pi: number, a: XY, b: XY, top: number) => {
    const m: XY = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], L2 = Math.hypot(b[0] - a[0], b[1] - a[1])
    for (let j = 0; j < parts.length; j++) {
      if (j === pi || parts[j].eave < top - 0.3 || parts[j].mh > 0.5) continue
      for (const [c, d] of segs[j]) {
        const dx = d[0] - c[0], dy = d[1] - c[1], l = Math.hypot(dx, dy)
        if (l < L2 * 0.5) continue
        const t = ((m[0] - c[0]) * dx + (m[1] - c[1]) * dy) / (l * l)
        if (t < 0 || t > 1) continue
        const dist = Math.abs((m[0] - c[0]) * dy - (m[1] - c[1]) * dx) / l
        if (dist < 0.45 && Math.abs((dx * (b[0] - a[0]) + dy * (b[1] - a[1])) / (l * L2)) > 0.95) return true
      }
    }
    return false
  }

  const isStreet = (f: Face, mid: XY) => (mid[1] < -55 && f.n[1] < -0.7) || (mid[0] > 75 && f.n[0] > 0.7) || (mid[0] < -60 && f.n[0] < -0.7) || (mid[1] > 62 && f.n[1] > 0.7)

  parts.forEach((p, pi) => {
    const wall = p.m === 'b' ? brick : stone
    const small = area(p.ring) < 30
    const z0 = p.mh
    // Turrets: small pyramidal parts become octagonal shafts with spirelets.
    if (p.rs === 'pyr' && small) {
      const [cx, cy] = centroid(p.ring)
      const r = Math.sqrt(area(p.ring) / Math.PI)
      if (z0 > 0.5) {
        // corbelled turret: a tapering corbel under it
        const n = hi ? 10 : 8
        stone.loft([ngon(cx, cy, r * 0.35, n, z0 - 2.0), ngon(cx, cy, r, n, z0)])
      }
      turret(L, stone, trim, slate, cx, cy, r, z0, p.eave, p.h)
      return
    }
    // Walls.
    for (let i = 0; i < p.ring.length; i++) {
      const a = p.ring[i], b = p.ring[(i + 1) % p.ring.length]
      if (Math.hypot(b[0] - a[0], b[1] - a[1]) < 0.05) continue
      if (hidden(pi, a, b, p.eave)) continue
      if (p.id === 1380992059 && Math.abs(a[1] + 62.45) < 0.2 && Math.abs(b[1] + 62.45) < 0.2) continue // drawn with the arch
      let za = p.eave, zb = p.eave
      if (p.rs === 'ski' && p.rd !== null) {
        const dir = (p.rd * Math.PI) / 180, dx = Math.sin(dir), dy = Math.cos(dir)
        const proj = p.ring.map((q) => q[0] * dx + q[1] * dy), lo = Math.min(...proj), hiP = Math.max(...proj)
        const zf = (q: XY) => p.h - p.rh * ((q[0] * dx + q[1] * dy - lo) / (hiP - lo || 1))
        za = zf(a); zb = zf(b)
      }
      wall.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], zb], [a[0], a[1], za])
      // Windows on the street fronts: lancets grouped two storeys to a panel.
      const f = faceOf(a, b), mid: XY = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
      if (z0 < 0.5 && f.len > 4.5 && Math.min(za, zb) > 12 && isStreet(f, mid)) {
        const bay = hi ? 3.3 : 4.2, n = Math.max(1, Math.floor((f.len - 1.6) / bay)), step = (f.len - 1.6) / n
        const top = Math.min(za, zb) - 2.6
        for (let k = 0; k < n; k++) {
          const c = 0.8 + step * (k + 0.5), w = hi ? 1.4 : 1.8
          lancet(win, f, c, w, 4.0, 9.6, hi ? 3 : 2)
          if (top - 12.0 > 3) lancet(win, f, c, w, 12.0, top, hi ? 3 : 2)
        }
        // stone string courses on brick, kept 8 m apart
        if (p.m === 'b' && hi) for (const zc of [10.6, 18.6]) if (zc < Math.min(za, zb) - 1) fblock(trim, f, 0, f.len, zc, zc + 0.45, 0, 0.12)
      } else if (hi && p.m === 'b' && f.len > 6 && z0 < 0.5) {
        for (const zc of [10.6, 18.6]) if (zc < Math.min(za, zb) - 1) fblock(trim, f, 0, f.len, zc, zc + 0.45, 0, 0.12)
      }
    }
    if (z0 > 0.5) capPoly(wall, p.ring, z0, false)
    // Roofs.
    const xs = p.ring.map((q) => q[0]), ys = p.ring.map((q) => q[1])
    const R = rect(Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys))
    const w = R.x1 - R.x0, d = R.y1 - R.y0
    if (p.rs === 'fla' || p.rh <= 0) { capPoly(slate, p.ring, p.eave, true); return }
    capPoly(wall, p.ring, p.eave, true)
    if (p.rs === 'gab') {
      let ns = d >= w
      if (p.ro === 'ac') ns = !ns
      if (p.id === 1381530927) ns = true // the Great Hall's south gable wall faces the Strand
      gable(slate, wall, R, p.eave, p.h, ns)
      // a finial at each gable apex on the street
      if (hi) {
        const ends: V3[] = ns ? [[(R.x0 + R.x1) / 2, R.y0, p.h], [(R.x0 + R.x1) / 2, R.y1, p.h]] : [[R.x0, (R.y0 + R.y1) / 2, p.h], [R.x1, (R.y0 + R.y1) / 2, p.h]]
        for (const e of ends) lathe(trim, [[0.35, e[2] - 0.2], [0.3, e[2] + 0.6], [0.02, e[2] + 1.8]], 6, e[0], e[1], true)
      }
    } else if (p.rs === 'hip') {
      hip(slate, R, p.eave, p.h, Math.min(w, d) / 2 - 0.1)
    } else if (p.rs === 'pyr') {
      const [cx, cy] = centroid(p.ring)
      for (let i = 0; i < p.ring.length; i++) {
        const a = p.ring[i], b = p.ring[(i + 1) % p.ring.length]
        tf(slate, [a[0], a[1], p.eave], [b[0], b[1], p.eave], [cx, cy, p.h], [(a[0] + b[0]) / 2 - cx, (a[1] + b[1]) / 2 - cy, 1])
      }
      cylinder(trim, cx, cy, 0.12, p.h - 0.3, p.h + (hi ? 2.2 : 1.6), 5)
    } else if (p.rs === 'ski' && p.rd !== null) {
      const dir = (p.rd * Math.PI) / 180, dx = Math.sin(dir), dy = Math.cos(dir)
      const proj = p.ring.map((q) => q[0] * dx + q[1] * dy), lo = Math.min(...proj), hiP = Math.max(...proj)
      const pts: V3[] = p.ring.map((q, i) => [q[0], q[1], p.h - p.rh * ((proj[i] - lo) / (hiP - lo || 1))])
      for (const [i, j, k] of earcut(p.ring)) tf(slate, pts[i], pts[j], pts[k], [dx * 0.3, dy * 0.3, 1])
    }
  })

  // ===== The entrance: a deep pointed arch in the porch front ===============
  {
    const f = faceOf([-30.9, -62.5], [-16.1, -62.5]) // porch front, facing south
    const s0 = f.len / 2 - 4.0, s1 = f.len / 2 + 4.0, zs = 11.0 - 8.0 * 0.87, depth = 2.6
    const arch = pointedPts(s0, s1, zs, hi ? 6 : 4)
    const n: V3 = [0, -1, 0]
    // recess sides and soffit (the tunnel), facing inward
    const all: XY[] = [[s0, 0], ...arch, [s1, 0]]
    for (let i = 0; i < all.length - 1; i++) {
      const A = all[i], B = all[i + 1]
      const c: XY = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2]
      const tgt: XY = [f.len / 2, Math.min(c[1], zs)]
      const ds = tgt[0] - c[0], dz = tgt[1] - c[1]
      qf(stone, fpt(f, A[0], A[1], 0), fpt(f, B[0], B[1], 0), fpt(f, B[0], B[1], -depth), fpt(f, A[0], A[1], -depth), [f.u[0] * ds, f.u[1] * ds, dz])
    }
    // the porch's front wall round the opening: piers and strips over the arch
    const H = 14.0
    qf(stone, fpt(f, 0, 0), fpt(f, s0, 0), fpt(f, s0, H), fpt(f, 0, H), n)
    qf(stone, fpt(f, s1, 0), fpt(f, f.len, 0), fpt(f, f.len, H), fpt(f, s1, H), n)
    for (let i = 0; i < arch.length - 1; i++) {
      const A = arch[i], B = arch[i + 1]
      qf(stone, fpt(f, A[0], A[1]), fpt(f, B[0], B[1]), fpt(f, B[0], H), fpt(f, A[0], H), n)
    }
    // the doors at the back of the recess
    for (let i = 1; i < all.length - 1; i++) tf(door, fpt(f, all[0][0], all[0][1], -depth + 0.01), fpt(f, all[i][0], all[i][1], -depth + 0.01), fpt(f, all[i + 1][0], all[i + 1][1], -depth + 0.01), n)
    // the moulded surround standing proud of the porch, and the gablet over it
    for (let i = 0; i < arch.length - 1; i++) {
      const A = arch[i], B = arch[i + 1]
      const o = (q: XY, k: number): XY => [f.len / 2 + (q[0] - f.len / 2) * k, zs + (q[1] - zs) * k]
      qf(trim, fpt(f, ...o(A, 1.0), 0.05), fpt(f, ...o(B, 1.0), 0.05), fpt(f, ...o(B, 1.16), 0.45), fpt(f, ...o(A, 1.16), 0.45), n)
    }
    fblock(trim, f, s0 - 1.0, s0 - 0.2, 0, zs, 0, 0.45)
    fblock(trim, f, s1 + 0.2, s1 + 1.0, 0, zs, 0, 0.45)
    const apex = 11.0
    qf(trim, fpt(f, s0 - 1.6, zs + 1.5, 0.5), fpt(f, f.len / 2, apex + 3.4, 0.5), fpt(f, f.len / 2, apex + 3.4, 0.0), fpt(f, s0 - 1.6, zs + 1.5, 0.0), [0, 0, 1])
    qf(trim, fpt(f, f.len / 2, apex + 3.4, 0.5), fpt(f, s1 + 1.6, zs + 1.5, 0.5), fpt(f, s1 + 1.6, zs + 1.5, 0.0), fpt(f, f.len / 2, apex + 3.4, 0.0), [0, 0, 1])
    // the arcaded gallery over the porch roof, on the hall's gable front
    const ga = faceOf([-32.7, -47.7], [-14.1, -47.7]), na = hi ? 9 : 6
    for (let k = 0; k < na; k++) {
      const c = 1.4 + (ga.len - 2.8) * (k + 0.5) / na
      lancet(win, ga, c, (ga.len - 2.8) / na * 0.62, 15.0, 19.6, hi ? 3 : 2, 0.07)
    }
    fblock(trim, ga, 0.6, ga.len - 0.6, 14.2, 14.9, 0, 0.6)
    // the Great Hall's south gable: a rose window
    const g = faceOf([-32.7, -47.6], [-14.1, -47.6])
    const rc: V3 = fpt(g, g.len / 2, 33.0, 0.08), nr = hi ? 16 : 10, rr = 3.2
    for (let k = 0; k < nr; k++) {
      const a0 = (TAU * k) / nr, a1 = (TAU * (k + 1)) / nr
      tf(win, rc, fpt(g, g.len / 2 + rr * Math.cos(a0), 33.0 + rr * Math.sin(a0), 0.08), fpt(g, g.len / 2 + rr * Math.cos(a1), 33.0 + rr * Math.sin(a1), 0.08), [0, -1, 0])
    }
    lancet(win, g, g.len / 2 - 3.0, 2.2, 20.5, 28.0, 3)
    lancet(win, g, g.len / 2 + 3.0, 2.2, 20.5, 28.0, 3)
  }

  // ===== The flèche on the Great Hall's ridge ================================
  {
    const cx = -23.6, cy = -37.3, r = 2.9, n = 8
    stone.loft([ngon(cx, cy, r, n, 37.0), ngon(cx, cy, r, n, 41.0)])
    trim.loft([ngon(cx, cy, r, n, 41.0), ngon(cx, cy, r + 0.3, n, 41.4)])
    trim.cap(ngon(cx, cy, r + 0.3, n, 41.4), true)
    // open lantern: eight posts with real gaps, a core behind
    const ring = ngon(cx, cy, r - 0.2, n, 41.4)
    for (const q of ring) cbox(slate, rect(q[0] - 0.22, q[0] + 0.22, q[1] - 0.22, q[1] + 0.22), 41.4, 47.6, { top: false })
    slate.loft([ngon(cx, cy, r * 0.45, n, 41.4), ngon(cx, cy, r * 0.45, n, 47.6)])
    slate.loft([ngon(cx, cy, r + 0.1, n, 47.6), ngon(cx, cy, r + 0.1, n, 48.2)])
    const top = ngon(cx, cy, r + 0.1, n, 48.2)
    for (let i = 0; i < n; i++) qf(slate, top[i], top[(i + 1) % n], [cx, cy, 63.6], [cx, cy, 63.6], [top[i][0] - cx, top[i][1] - cy, 0.15])
    cylinder(trim, cx, cy, 0.12, 63.4, 65.0, 5)
  }

  // ===== Clock tower top: cresting, corner turret; the bracket clock ========
  {
    cbox(trim, rect(68.0, 69.6, -66.4, -64.9), 49.0, 49.4)
    cylinder(trim, 68.8, -65.65, 0.18, 49.0, 52.0, 6)
    turret(L, stone, trim, slate, 73.2, -70.6, 1.5, 30.0, 40.5, 46.5)
    if (hi) {
      // bracket clock over the Strand, on the tower's corner
      const f = faceOf([63.9, -71.2], [73.8, -71.2])
      fblock(trim, f, 7.2, 8.8, 13.5, 17.0, 0, 1.3, true)
      fpanel(win, faceOf([63.9, -72.5], [73.8, -72.5]), 7.45, 8.55, 14.6, 15.9, 0.02)
    }
  }

  const flood = (p: V3, n: V3) => (p[1] < -55 && n[1] < -0.4 && p[2] < 45 ? 0.85 : 0)
  const parts2: Array<{ part: Part; material: MaterialSpec }> = [
    { part: stone, material: { ...finish('portland-stone', 0xede6d8), floodlight: flood } },
    { part: brick, material: finish('red-brick', 0xc59a87) },
    { part: slate, material: finish('slate', 0x7e8790) },
    { part: win, material: PALETTE.window },
    { part: trim, material: { ...PALETTE.trim, floodlight: flood } },
    { part: door, material: PALETTE.entrance },
  ]
  return parts2
}


if (import.meta.main) {
  const extras = { landmark: 'Royal Courts of Justice', wikidata: 'Q609835' }
  writeModel('Royal Courts of Justice', ID, build(false), extras, 6500)
  writeModel('Royal Courts of Justice', ID, build(true), extras, 40000, `${ID}.detail`)
}
