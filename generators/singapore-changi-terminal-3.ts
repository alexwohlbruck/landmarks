/**
 * Singapore Changi Airport Terminal 3 (2008, CPG Consultants with SOM): the
 * big flat-roofed hall under its grid of skylights and louvres, the sheer
 * glass landside wall under a roof that cantilevers far out over the
 * departure kerb, the long south pier with its angled end, the angled pier
 * roots on the west and the covered link north to Terminal 1 — procedural,
 * CC0-1.0, no textures.
 *   bun generators/singapore-changi-terminal-3.ts
 *
 * Built with the Changi kit in singapore-changi-terminal-1.ts.
 * Map frame: x = model east, y = model north, z up, metres; bearing 23.1°.
 * Anchor: the area centroid of OSM way/173010413, 103.9859221, 1.3553184.
 * The landside (the departure kerb) is the hall's east face, model +x
 * (Cagccwiki's kerb photo looks north along it with the control tower
 * beyond); the apron is to the west and south.
 *
 * Identifying features (photos): a huge thin flat roof floating over
 * full-height glass walls, overhanging the kerb by a long cantilever with a
 * raked steel end truss; the roof's regular grid of skylights (with the
 * butterfly louvres under them inside); pale silver-grey metal.
 *
 * Evidence
 * - OSM (© OpenStreetMap contributors, ODbL): way/173010413 (Changi Airport
 *   Terminal 3, building=yes, height 30, aeroway=terminal); about 60 shop
 *   units inside it mapped as building:part (364429xxx), all covered here;
 *   Skytrain stations A (173018911) and B (173018913).
 * - Published: CPG/SOM, opened 9 January 2008; 380,000 m² floor area; the
 *   roof has 919 skylights (Wikipedia, "Changi Airport Terminal 3").
 * - Photos (evidence):
 *   https://commons.wikimedia.org/wiki/File:Changi_Airport_Terminal_3_Departure_Kerbside.jpg
 *     (Cagccwiki, CC BY-SA 3.0) the glass wall, the cantilevered roof and its raked end;
 *   https://commons.wikimedia.org/wiki/File:Singapore_T3_outside_at_night.jpg
 *     (Orderinchaos, CC BY-SA 4.0) the kerb under the roof at night;
 *   https://commons.wikimedia.org/wiki/File:Changi_Airport_Terminal_3_(3188085530).jpg
 *     (edwin.11, CC BY 2.0) the glass wall's mullion grid from inside;
 *   https://commons.wikimedia.org/wiki/File:Changi_airport_T3.jpg
 *     (ProjectManhattan, CC BY-SA 3.0) the skylit hall and its columns;
 *   https://commons.wikimedia.org/wiki/File:Airport_of_Singapore,_Crowne_Plaza.JPG
 *     (Lars Curfs, CC BY-SA 3.0 nl) the low silver terminal beyond the hotel.
 * - No lidar or open aerials.
 *
 * Numbers (estimated): hall roof 28 m (OSM 30 m read as the louvre tops),
 * glass wall to 25 m, the kerb cantilever 22 m deep, the skylight bands every
 * 20 m; the piers 16 m; the north link 15.5 m. Doubts: the skylight grid is
 * drawn as bands, not 919 lights; the pier ends and the airside have no
 * licensed photo; OSM's south "tail" is read as the south pier.
 */
import { type MaterialSpec } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, type Facade, type Zone, beam, prismRing, zoneMass, clean, clipRect, skylights, gateStubs, writeLod, newMats, CHANGI } from './singapore-changi-terminal-1'

const T3_OUTLINE: XY[] = [[-29.2,558.1],[-3.3,559.4],[-2.6,397.0],[-2.0,397.0],[-0.6,397.0],[2.1,397.0],[2.1,408.8],[11.4,408.9],[15.2,408.9],[15.2,397.0],[23.7,397.2],[26.1,397.2],[29.0,397.1],[29.2,361.1],[31.1,361.2],[33.7,361.3],[36.4,361.3],[48.5,361.6],[57.2,361.3],[57.5,324.7],[92.0,323.3],[92.7,274.1],[102.9,274.5],[102.9,266.5],[126.3,267.5],[125.5,121.6],[124.7,-40.5],[74.6,-40.5],[74.4,-68.5],[38.8,-68.5],[38.9,-92.6],[38.7,-125.0],[27.9,-124.8],[28.0,-135.1],[27.7,-144.2],[27.9,-180.5],[19.8,-180.6],[12.9,-180.7],[0.7,-180.8],[-1.4,-180.8],[-5.9,-180.9],[-5.7,-587.0],[-0.9,-587.0],[2.1,-586.9],[13.6,-586.7],[19.3,-586.7],[25.4,-586.6],[31.0,-586.5],[48.4,-586.6],[48.3,-600.6],[31.1,-600.1],[31.5,-634.7],[27.6,-634.8],[27.7,-646.7],[27.7,-657.1],[24.9,-662.3],[22.7,-672.2],[21.2,-673.9],[10.6,-694.9],[-13.3,-726.5],[-35.3,-748.5],[-54.7,-763.7],[-82.9,-776.9],[-108.9,-785.5],[-110.0,-782.4],[-124.1,-750.8],[-126.4,-746.7],[-118.7,-737.3],[-100.0,-717.2],[-70.0,-681.5],[-39.4,-645.3],[-26.1,-632.0],[-29.2,-628.9],[-28.9,-624.0],[-29.7,-538.3],[-28.3,-464.1],[-29.0,-392.3],[-29.8,-308.0],[-29.9,-225.5],[-29.2,-149.7],[-35.3,-150.1],[-96.8,-113.7],[-136.7,-91.8],[-136.7,-89.5],[-137.0,-58.9],[-136.6,-57.0],[-114.8,-54.8],[-88.9,-54.5],[-61.9,-54.9],[-62.1,-35.7],[-73.8,-34.5],[-78.2,114.6],[-76.9,274.2],[-105.7,273.6],[-136.6,275.1],[-136.7,280.0],[-137.0,307.7],[-137.2,309.2],[-99.0,330.7],[-35.7,367.7],[-29.3,368.3],[-29.5,372.8],[-30.3,507.3]]

const H_HALL = 28, H_PIER = 16, H_LINK = 15.5

function build() {
  const M = newMats(['wall', 'win', 'roof', 'trim', 'glass', 'pier'])
  const body = clean(T3_OUTLINE, 0.6)
  // full-height glass on the hall: tall panels with thin transoms
  const HALL: Facade = { bay: 9, ratio: 0.95, floor: 11.5, group: 1, spandrel: 1.0, sill: 0.6, head: 3.0, ground: 0.6, minLength: 6 }
  const PIER: Facade = { bay: 9, ratio: 0.93, floor: 5.0, group: 1, spandrel: 0, sill: 1.0, head: 2.4, ground: 6.5, minLength: 6 }
  const LINK: Facade = { bay: 9, ratio: 0.9, floor: 3.2, group: 1, spandrel: 0, sill: 1.2, head: 1.6, ground: 9.5, minLength: 6 }
  const zones: Zone[] = [ // disjoint
    { rect: [-80, -45, 130, 362], z: H_HALL, facade: HALL, wall: 'trim' },
    { rect: [-200, -900, 200, -45], z: H_PIER, facade: PIER, wall: 'pier' },
    { rect: [-200, -45, -80, 362], z: H_PIER, facade: PIER, wall: 'pier' },
    { rect: [-80, 362, 200, 600], z: H_LINK, facade: LINK, wall: 'pier' },
  ]
  zoneMass(M, body, zones, { lip: 1.2 })

  // the roof's grid of skylights, as bands running along the hall
  const hall = clipRect(body, -80, -45, 130, 362)
  skylights(M.glass, hall, [-80, -45, 130, 362], H_HALL, { axis: 'y', pitch: 20, w: 7, h: 1.0, margin: 7 })

  // the kerb cantilever: the roof plane runs on 22 m past the east glass wall, with a raked steel end
  {
    const xw = 125.5, xe = xw + 22, y0 = -40, y1 = 267
    prismRing(M.roof, [[xw - 1, y0], [xe, y0], [xe, y1], [xw - 1, y1]], H_HALL - 1.4, H_HALL, M.roof, M.trim)
    // its edge beam and the raked end trusses, falling to the kerb at each end
    beam(M.trim, [xe, y0], [xe, y1], 0.9, H_HALL - 2.4, H_HALL - 1.4, true)
    for (const y of [y0, y1]) for (let k = 0; k < 5; k++) {
      const x = xw + 2 + k * 5, zTop = H_HALL - 1.4, zBot = 6 + (zTop - 6) * (k / 5)
      beam(M.trim, [x, y - 0.4], [x, y + 0.4], 0.7, zBot, zTop, false)
    }
    // the steel ribs under the cantilever, every 9 m
    for (let y = y0 + 4.5; y < y1; y += 9) beam(M.trim, [xw, y], [xe, y], 0.6, H_HALL - 2.6, H_HALL - 1.4, true)
  }

  // jet-bridge stubs along the south pier's two faces, and the west pier roots
  gateStubs(M.pier, [-5.7, -200], [1, 0], [0, -1], [0, 55, 110, 165, 220, 275, 330], 13)
  gateStubs(M.pier, [-29.6, -200], [-1, 0], [0, -1], [0, 55, 110, 165, 220, 275, 330], 13)

  return [
    { part: M.trim, material: finish('changi-t3-silver', 0xd9dde0) as MaterialSpec },
    { part: M.win, material: { name: 'window', color: 0x9fb6c6, roughness: 0.35 } as MaterialSpec },
    { part: M.roof, material: finish('changi-t3-roof', 0xb3b9be) as MaterialSpec },
    { part: M.glass, material: { name: 'glass', color: 0xa4c4d9, roughness: 0.24 } as MaterialSpec },
    { part: M.pier, material: finish('changi-t3-pier', 0xccd1d5) as MaterialSpec },
    { part: M.wall, material: PALETTE.stone as MaterialSpec },
  ]
}

if (import.meta.main) {
  writeLod('Changi Airport Terminal 3', 'singapore-changi-terminal-3.glb', build(), { bearing: CHANGI.bearing, osm: 'way/173010413', height: H_HALL + 1 }, 8000, 250_000)
}
