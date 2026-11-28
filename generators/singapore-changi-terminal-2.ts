/**
 * Singapore Changi Airport Terminal 2 (1990; refurbished and extended 2019–
 * 2023): the main terminal block, its two long gate piers splaying north-east
 * (E gates) and south-east (F gates) on narrow connectors, and the covered
 * links running north to Terminal 1 and south along the apron — procedural,
 * CC0-1.0, no textures.
 *   bun generators/singapore-changi-terminal-2.ts
 *
 * Built with the Changi kit in singapore-changi-terminal-1.ts.
 * Map frame: x = model east, y = model north, z up, metres; bearing 23.1°
 * (the airport grid). Anchor: the area centroid of OSM way/173010412,
 * 103.9897101, 1.3546323. The landside (departure and arrival drives) is the
 * block's west face, model −x; the piers reach east (+x) onto the apron.
 *
 * Identifying features (photos): a long plain block with a glass front over
 * the departure drive under a deep steel-and-glass canopy, grey panelled
 * upper walls and a flat roof; long, low glazed gate piers with jet bridges.
 *
 * Evidence
 * - OSM (© OpenStreetMap contributors, ODbL): way/173010412 (Changi Airport
 *   Terminal 2, building=yes, height 30, aeroway=terminal), with no parts;
 *   Skytrain stations E (173018917) and F (173018918) inside it.
 * - Photos (evidence):
 *   https://commons.wikimedia.org/wiki/File:Changi_Airport,_Terminal_2,_Departure_Driveway_2.JPG
 *     (Terence Ong, CC BY 2.5) the glass front and the departure canopy;
 *   https://commons.wikimedia.org/wiki/File:Changi_Airport,_Terminal_2,_Arrival_Driveway.JPG
 *     (Terence Ong, CC BY 2.5) the arrival drive under the block;
 *   https://commons.wikimedia.org/wiki/File:3_Skytrains_between_T1_and_T2.JPG
 *     (CC BY-SA 3.0) the Skytrain link and the pale walls between T1 and T2;
 *   https://commons.wikimedia.org/wiki/File:Singapore_Changi_Airport_T2_-_viewing_gallery_silhouette_-_Flickr_-_GeorgeTan%5E5.jpg
 *     (GeorgeTan#5, CC0) the glazed apron wall of the viewing gallery;
 *   https://commons.wikimedia.org/wiki/File:Changi_Airport_Control_Tower_(3187275465).jpg
 *     (edwin.11, CC BY 2.0) T2's grey roof edge with its big "2".
 * - No lidar or open aerials; no licensed photo of the piers or of the 2023
 *   refurbished front.
 *
 * Numbers (estimated): block 24 m (OSM's 30 m read as its plant), piers and
 * connectors 13 m, the covered links 15.5 m (they ride over the roads and the car-park ramps beside Car Park 2B), departure canopy 12 m deep at 12 m; gate
 * stubs every ~55 m on both pier faces. Doubts: everything airside is from
 * the outline alone; the 2023 refurbishment's new landside facade is not
 * photographed under an open licence and is drawn as plain glass; the south
 * link's use (OSM gives the outline only).
 */
import { type MaterialSpec } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, type Facade, type Zone, beam, zoneMass, clean, clipRect, skylights, canopy, gateStubs, screen, capPoly, insetRing, writeLod, newMats, CHANGI } from './singapore-changi-terminal-1'

const T2_OUTLINE: XY[] = [[-41.5,-665.1],[-42.6,-696.3],[-42.7,-699.8],[-42.9,-706.7],[-26.4,-706.2],[-26.1,-700.3],[-26.1,-698.5],[-18.3,-698.9],[-18.6,-680.4],[-18.7,-654.4],[-18.6,-643.6],[-19.2,-593.8],[-19.1,-553.8],[-19.1,-517.4],[-19.1,-479.1],[-19.2,-441.5],[-19.4,-398.8],[-19.5,-366.0],[-19.8,-325.5],[-20.1,-289.7],[-19.7,-255.0],[-19.1,-214.3],[-20.5,-146.2],[-6.6,-146.1],[-6.7,-125.8],[-2.8,-125.5],[162.5,-124.3],[232.7,-247.7],[269.8,-312.9],[303.9,-373.2],[307.6,-379.3],[319.1,-382.6],[333.3,-375.9],[336.5,-373.0],[340.7,-358.7],[316.6,-315.4],[292.0,-271.8],[251.9,-198.4],[224.4,-148.3],[196.1,-97.4],[190.0,-97.5],[126.4,-97.0],[59.1,-96.6],[10.7,-96.2],[10.7,-88.2],[7.8,-88.2],[4.7,-88.2],[4.6,-76.7],[3.6,21.5],[4.4,55.1],[3.2,62.1],[3.0,82.5],[1.7,153.3],[11.5,153.1],[11.5,167.4],[59.8,168.8],[75.6,169.3],[141.3,169.3],[191.5,168.6],[196.3,176.9],[201.4,185.1],[224.5,223.4],[270.3,300.4],[297.5,346.7],[324.5,392.5],[344.7,428.5],[335.6,439.9],[330.9,443.7],[328.1,445.1],[323.9,447.1],[314.6,449.8],[308.9,449.9],[271.8,385.7],[234.2,322.5],[184.6,232.3],[181.4,234.0],[161.8,192.5],[5.7,195.3],[2.7,195.5],[2.4,211.6],[2.3,224.5],[-10.6,224.9],[-20.6,225.4],[-20.7,242.1],[-20.9,317.7],[-20.9,358.5],[-20.8,395.6],[-20.9,469.6],[-25.1,469.5],[-50.0,469.5],[-56.6,469.4],[-56.4,400.2],[-56.4,392.0],[-57.2,319.5],[-53.9,279.9],[-61.4,279.9],[-66.0,280.0],[-71.6,280.0],[-74.0,280.0],[-84.4,280.1],[-83.6,319.1],[-135.2,319.4],[-135.2,314.3],[-135.5,269.8],[-135.8,233.9],[-134.9,215.7],[-135.9,215.5],[-136.3,229.5],[-147.6,229.0],[-155.7,228.8],[-156.3,178.7],[-169.8,178.9],[-170.9,17.0],[-168.4,-135.3],[-164.1,-135.5],[-155.1,-135.3],[-154.9,-156.1],[-134.9,-155.7],[-134.5,-165.6],[-134.8,-172.9],[-132.5,-173.5],[-103.4,-173.4],[-104.3,-166.6],[-103.7,-147.4],[-77.3,-147.5],[-62.1,-147.9],[-62.4,-158.9],[-64.6,-158.9],[-64.6,-196.9],[-62.1,-196.8],[-57.2,-196.8],[-55.6,-196.8],[-51.8,-564.6],[-64.6,-564.7],[-64.3,-621.6],[-74.8,-621.7],[-74.7,-642.5],[-48.3,-642.2],[-48.3,-629.8],[-35.4,-629.7],[-35.2,-644.3],[-35.1,-654.4],[-34.9,-659.1],[-42.3,-659.4]]

const H_BLOCK = 24, H_PIER = 13, H_LINK = 15.5

/** Unit vector from a to b. */
const dirOf = (a: XY, b: XY): XY => { const L = Math.hypot(b[0] - a[0], b[1] - a[1]); return [(b[0] - a[0]) / L, (b[1] - a[1]) / L] }

function build() {
  const M = newMats(['wall', 'win', 'roof', 'trim', 'glass', 'pier'])
  const body = clean(T2_OUTLINE, 0.6)
  const BLOCK: Facade = { bay: 10, ratio: 0.94, floor: 5.5, group: 2, spandrel: 1.6, sill: 1.0, head: 3.2, ground: 1.0, minLength: 8 }
  const PIER: Facade = { bay: 9, ratio: 0.9, floor: 4.2, group: 1, spandrel: 0, sill: 1.0, head: 1.8, ground: 6.2, minLength: 6 }
  const LINK: Facade = { bay: 9, ratio: 0.9, floor: 3.2, group: 1, spandrel: 0, sill: 1.2, head: 1.6, ground: 6.2, minLength: 6 }
  const zones: Zone[] = [ // disjoint, so no roof hides inside another mass
    { rect: [12, -400, 400, 470], z: H_PIER, facade: PIER, wall: 'pier' },
    { rect: [-175, -197, 12, 225], z: H_BLOCK, facade: BLOCK },
    { rect: [-175, 225, 12, 480], z: H_LINK, facade: LINK, wall: 'pier' },
    { rect: [-175, -720, 12, -197], z: H_LINK, facade: LINK, wall: 'pier' },
  ]
  zoneMass(M, body, zones)

  // the block's roof: plant behind a low screen, and a lantern of roof lights
  const plant: XY[] = [[-150, -150], [-20, -150], [-20, 200], [-150, 200]]
  screen(M.trim, plant, 0, H_BLOCK - 0.3, H_BLOCK + 3, 0.5)
  capPoly(M.roof, insetRing(plant, 0.5), H_BLOCK + 1.2)
  const block = clipRect(body, -175, -200, 12, 230)
  skylights(M.glass, block, [-160, -160, 5, 215], H_BLOCK, { axis: 'y', pitch: 40, w: 6, margin: 10 })

  // the departure canopy along the landside (west) face, x ≈ −170
  {
    const x0 = -170.9, x1 = x0 - 12
    const posts: XY[] = []
    for (let y = -125; y <= 170; y += 14) posts.push([x1 + 1, y])
    canopy(M.glass, M.trim, [[x1, -130], [x0, -130], [x0, 175], [x1, 175]], 12, 0.6, posts)
    // its steel ribs, across the drive every 7 m
    for (let y = -127; y <= 172; y += 7) beam(M.trim, [x1, y], [x0, y], 0.5, 11.2, 12.25, true)
  }

  // jet-bridge stubs on both faces of each pier
  for (const [a, b] of [[[176, -110], [330, -372]], [[176, 182], [330, 440]]] as [XY, XY][]) {
    const u = dirOf(a, b), n: XY = [u[1], -u[0]]
    const at = [40, 95, 150, 205, 260]
    gateStubs(M.pier, [a[0] + n[0] * 14, a[1] + n[1] * 14], n, u, at, 13)
    gateStubs(M.pier, [a[0] - n[0] * 14, a[1] - n[1] * 14], [-n[0], -n[1]], u, at, 13)
  }

  return [
    { part: M.wall, material: finish('changi-t2-panel', 0xc4cacf) as MaterialSpec },
    { part: M.win, material: { name: 'window', color: 0x93abbd, roughness: 0.35 } as MaterialSpec },
    { part: M.roof, material: PALETTE.roof as MaterialSpec },
    { part: M.trim, material: finish('changi-t2-steel', 0xe6e8e9) as MaterialSpec },
    { part: M.glass, material: { name: 'glass', color: 0xa4c4d9, roughness: 0.24 } as MaterialSpec },
    { part: M.pier, material: finish('changi-t2-pier', 0xd3d7da) as MaterialSpec },
  ]
}

if (import.meta.main) {
  writeLod('Changi Airport Terminal 2', 'singapore-changi-terminal-2.glb', build(), { bearing: CHANGI.bearing, osm: 'way/173010412', height: H_BLOCK + 3 }, 8000, 250_000)
}
