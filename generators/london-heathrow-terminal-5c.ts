/**
 * London Heathrow Terminal 5C (satellite, opened 1 June 2011), the long pier
 * on the apron east of 5B, joined to it only by the underground transit —
 * procedural, CC0-1.0, no textures.
 * bun generators/london-heathrow-terminal-5c.ts
 *
 * Writes models/london-heathrow-terminal-5c.glb (low) and
 * models/london-heathrow-terminal-5c.detail.glb (detail: the whole landmark
 * again, with the V struts of the gate floor at every bay, finer mullions,
 * rooftop plant and glazed jet-bridge links).
 *
 * Drawn with 5B's satellite kit (london-heathrow-terminal-5b.ts; numbers and
 * their reasoning there): one design, 362 m apart.
 *
 * Map frame: x = model east, y = model north, z up, metres; bearing −0.35°,
 * as Terminal 5A and 5B. Anchor: area centroid of OSM way/23479729
 * (jet-bridge links included), −0.4760941, 51.4711164.
 *
 * Identifying features (photos): a very long, low, uniform pier; a fully
 * glazed gate floor on a plainer grey base with white branching struts seen
 * through the glass; the middle under a shallow curved roof (OSM
 * roof:shape=round) over flat-roofed ends; jet bridges down both sides.
 *
 * Evidence
 * - OSM: way/23479729 (Heathrow Terminal 5C) with building:part
 *   way/379842245 (roof:shape=round). No heights. The outline draws every
 *   fixed jet-bridge link; `despur` cuts them off and they are drawn as
 *   bridges. x −21.5…21.9 (43 m), y −186.8…158.3, its round part y −134.8…
 *   145.4.
 * - Published: opened 1 June 2011 (Wikipedia, "Heathrow Terminal 5"); 5B's
 *   19.5 m crown used for it too.
 * - Photos (Wikimedia Commons):
 *   https://commons.wikimedia.org/wiki/File:Gate_C62,_London_Heathrow_Terminal_5C_-_geograph.org.uk_-_7866579.jpg
 *     (Richard Cooke, CC BY-SA 2.0) the gate floor inside: the branching
 *     struts and the curved roof beams;
 *   https://commons.wikimedia.org/wiki/File:Heathrow_terminal_5_from_air.JPG
 *     (Clayton Tang, CC BY-SA 3.0) aerial from the south-east: the
 *     satellites beside 5A.
 * - No lidar.
 *
 * Doubts: 5C was photographed only inside and from far off; it is drawn as
 * 5B's twin (same heights, glazing, struts and overhang).
 */
import { type XY } from './nyc-570-lexington'
import { writeLod } from './tokyo-haneda-terminal-1'
import { CROWN, buildSatellite, type Sat } from './london-heathrow-terminal-5b'

// ===========================================================================
// OSM data, in this frame (bearing −0.35, anchor −0.4760941, 51.4711164)
// ===========================================================================

/** OSM way/23479729 (5C) */
const T5C: XY[] = [[-21.4,-24.0],[-21.3,68.0],[-22.5,68.0],[-40.1,46.0],[-42.2,46.0],[-42.2,45.2],[-57.0,45.2],[-57.0,54.0],[-44.2,54.0],[-44.2,50.3],[-42.2,50.3],[-42.2,48.8],[-40.8,49.3],[-22.6,71.4],[-21.3,71.6],[-21.2,104.0],[-22.1,104.0],[-41.6,155.0],[-42.1,155.1],[-42.1,154.4],[-56.8,154.4],[-56.8,162.3],[-44.1,162.3],[-44.1,158.5],[-42.1,158.5],[-42.1,157.6],[-39.8,157.5],[-21.2,107.8],[-21.2,140.1],[-22.6,140.2],[-35.5,179.0],[-26.3,217.3],[-26.6,245.9],[-41.0,260.5],[-42.0,260.6],[-42.0,259.4],[-56.7,259.4],[-56.7,268.1],[-44.0,268.1],[-44.0,264.7],[-41.9,264.7],[-41.9,262.7],[-39.6,262.8],[-23.8,247.2],[-23.5,217.7],[-32.4,179.1],[-22.0,144.7],[-21.2,144.5],[-21.2,145.4],[-21.2,158.3],[22.0,158.3],[22.1,154.1],[30.9,180.7],[20.9,213.7],[20.9,246.8],[37.8,284.7],[40.4,284.5],[40.4,285.4],[55.1,285.4],[55.1,277.1],[42.6,277.1],[42.6,281.0],[40.4,281.0],[40.4,281.7],[39.0,281.6],[23.4,246.6],[23.2,213.8],[34.1,181.8],[22.1,147.2],[22.0,145.4],[22.0,114.3],[35.0,137.8],[37.1,195.7],[40.3,195.6],[40.3,196.8],[55.0,196.8],[55.0,188.7],[42.5,188.7],[42.5,192.2],[40.3,192.2],[40.3,193.1],[39.5,193.2],[37.9,138.1],[22.0,109.7],[21.9,67.5],[38.3,91.6],[40.1,91.5],[40.2,93.5],[54.9,93.5],[54.8,85.0],[42.3,85.0],[42.3,88.7],[40.1,88.7],[40.1,89.3],[39.1,89.2],[21.9,63.8],[21.8,-12.0],[38.0,2.1],[40.0,2.0],[40.0,3.1],[54.7,3.1],[54.7,-4.8],[42.2,-4.8],[42.2,-1.2],[40.0,-1.2],[40.0,-0.5],[38.8,-0.5],[21.8,-14.9],[21.7,-88.6],[38.2,-96.9],[39.9,-97.1],[39.9,-95.9],[54.6,-95.9],[54.6,-104.6],[42.1,-104.6],[42.1,-100.5],[39.9,-100.5],[37.8,-100.3],[21.7,-91.5],[21.7,-134.8],[21.7,-138.0],[30.8,-162.0],[45.2,-170.4],[46.8,-170.2],[46.8,-169.3],[59.2,-169.3],[59.2,-176.6],[46.8,-176.6],[46.8,-172.5],[44.3,-172.4],[29.3,-164.1],[21.6,-143.5],[21.6,-186.8],[-21.6,-186.8],[-21.5,-134.8],[-22.2,-134.7],[-42.8,-166.5],[-46.3,-192.2],[-48.9,-191.8],[-61.7,-191.7],[-61.7,-184.7],[-48.9,-184.7],[-48.9,-188.5],[-48.4,-188.4],[-45.1,-165.7],[-23.1,-132.3],[-21.5,-132.3],[-21.5,-99.9],[-22.7,-99.9],[-46.8,-118.4],[-48.8,-118.2],[-61.6,-118.2],[-61.6,-110.8],[-48.8,-110.8],[-48.8,-115.4],[-47.5,-115.3],[-23.1,-96.9],[-21.5,-96.9],[-21.4,-27.3],[-22.5,-27.1],[-47.0,-44.4],[-48.7,-43.9],[-61.5,-43.9],[-61.5,-36.8],[-48.7,-36.8],[-48.7,-41.8],[-47.4,-41.7],[-22.7,-24.3]]

const T5C_SAT: Sat = { mid: [-21.5, 21.9, -134.8, 145.4], ends: [[-21.5, 21.9, -186.8, -134.8], [-21.5, 21.9, 145.4, 158.3]] }

if (import.meta.main) {
  const extras = { bearing: -0.35, osm: 'way/23479729', height: CROWN }
  writeLod('Heathrow Terminal 5C', 'london-heathrow-terminal-5c.glb', buildSatellite(T5C_SAT, T5C, false), extras, 8000, 250_000)
  writeLod('Heathrow Terminal 5C', 'london-heathrow-terminal-5c.detail.glb', buildSatellite(T5C_SAT, T5C, true), extras, 40_000, 1_500_000)
}
