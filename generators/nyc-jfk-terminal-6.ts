/**
 * JFK Airport New Terminal 6 (2026–), Queens — procedural, CC0-1.0, no textures.
 * bun generators/nyc-jfk-terminal-6.ts
 *
 * Map frame: x = model east, y = model north, z up, metres. Placed at
 * bearing 39°: the long concourse (OSM's 239 m south wall, bearing 129°)
 * runs along x. Anchor: area centroid of OSM way/1556624971.
 *
 * Status: built 2023–26 between Terminal 5 and the old Terminal 7 (Corgan;
 * ten gates; first phase to open in 2026, the whole terminal by 2028 —
 * Wikipedia, "John F. Kennedy International Airport", New Terminal 6).
 * OSM maps it as building=construction, traced in September 2026.
 *
 * EVIDENCE IS THIN, SO THE MODEL IS PLAIN.
 * - OSM way/1556624971 (construction=terminal, no height) is the plan.
 *   way/1556624970 (building=yes, layer=1) is the 8 m wide, 62 m long
 *   footbridge from the terminal's east end south to the AirTrain station;
 *   it is drawn too, raised off the ground.
 * - No lidar: USGS 3DEP NY_NewYorkCity was flown in 2017, before
 *   construction. No orthophoto: the newest USGS NAIP over the site still
 *   shows apron and parking.
 * - No open photo of the new building was found on Wikimedia Commons or
 *   Openverse (Commons' "Terminal 6" photos are the old I. M. Pei Sundrome,
 *   demolished 2011). The Port Authority's construction photos on Flickr are
 *   CC BY-NC-ND: look-only, not used.
 *
 * Estimated (no source): every height. The concourse and its north block
 * 18 m (two passenger levels and a high roof, like Terminal 5's 13.6–20 m
 * halls); the west hub 15 m; the narrow west spur 10 m; the bridge 7–11.5 m
 * (the AirTrain's platform level). Facades are generic glazed bands, roofs
 * flat and pale, with JFK's white coping. Invented: nothing else. Redo the
 * massing and roof from lidar or open photos once they exist.
 */
import { Part } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, ccw, clip, rect, zones } from './nyc-jfk-terminal-5'
import { finishModel, prism, type Facade } from './nyc-570-lexington'

// OSM way/1556624971 in the frame (bearing 39, about the anchor).
const OUTER: XY[] = ccw([[129.5, 46.2], [110.8, 41.5], [110.3, 53.8], [37.5, 53.7], [37.3, 20.5], [-20.8, 20.4], [-20.7, 22.7], [-42.7, 12.0], [-38.7, 3.8], [-46.3, 0.1], [-55.0, 18.0], [-63.5, 13.8], [-69.8, 26.6], [-92.3, 15.6], [-105.9, 43.5], [-127.8, 32.8], [-140.3, 58.4], [-147.4, 54.9], [-134.9, 29.3], [-166.8, 13.6], [-144.7, -31.8], [-136.3, -27.7], [-133.9, -32.7], [-109.1, -20.5], [-100.6, -38.1], [138.1, -37.8], [138.2, -18.3], [130.0, -18.3], [129.9, -0.3]])
// OSM way/1556624970, the footbridge to the AirTrain.
const BRIDGE: XY[] = ccw([[137.8, -80.5], [137.8, -78.5], [138.2, -18.3], [146.0, -18.2], [145.7, -80.3]])

function build() {
  const panel = new Part(), win = new Part(), roof = new Part(), white = new Part()
  const glazed: Facade = { bay: 7, ratio: 0.85, floor: 5, group: 1, spandrel: 0, sill: 2.5, head: 2.2, ground: 2.5, minLength: 6 }
  const part = (r: XY[]) => clip('intersection', [OUTER], [r])
  const list = [
    { rings: part(rect(-100.6, -60, 160, 60)), z: 18, facade: glazed }, // concourse and its north block
    { rings: part(rect(-200, -60, -100.6, 40)), z: 15, facade: glazed }, // west hub
    { rings: part(rect(-200, 40, -100.6, 70)), z: 10, facade: glazed }, // narrow west spur
  ]
  zones({ wall: panel, win, roof, coping: white, exterior: [OUTER], list })
  prism({ wall: panel, win, roof, coping: white, ring: BRIDGE, z0: 7, z1: 11.5, facade: { ...glazed, floor: 4.5, sill: 0.6, head: 0.6 }, bevel: 0.3 })

  finishModel('JFK Airport Terminal 6', 'nyc-jfk-terminal-6', [
    { part: panel, material: finish('t6-panel', 0xcfd3d6) },
    { part: win, material: PALETTE.window },
    { part: roof, material: finish('t6-roof', 0xdadbd9) },
    { part: white, material: finish('t6-coping', 0xf1f1ee) },
  ], { bearing: 39, osm: 'way/1556624971', height: 18 }, 6500)
}

if (import.meta.main) build()
