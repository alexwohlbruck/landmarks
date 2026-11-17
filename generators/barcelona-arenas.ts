/**
 * Arenas de Barcelona (the former Plaza de toros de las Arenas), Plaça
 * d'Espanya — original procedural geometry, CC0-1.0.
 * bun generators/barcelona-arenas.ts
 * (uses the shared kit in barcelona-venetian-towers.ts)
 *
 * Map frame: +x east, +y north, z up, metres. BEARING 0 (a round building).
 * Origin = area centroid of OSM way/1105997329, lng 2.149312, lat 41.376307.
 *
 * Evidence
 * - OSM way/1105997329: building=retail, building:shape=cylinder, 5 levels,
 *   architect August Font i Carreras, 1900, mall since 2011, wikidata
 *   Q548566 (checked: "Plaza de toros de las Arenas", bullring in
 *   Barcelona, 41.3763 2.1493). A circle of radius 49.5 m (measured).
 *   Parts inside it: the dome way/305821928 (height 25, radius 38), the
 *   central dome way/618800604 (radius 12), four roof spokes
 *   way/618800605–608, four inner cores way/1105997319–322 and two rings
 *   relation/14719693 (height 18) and relation/14719692 (19–20 m, the
 *   rooftop walkway ring). The lift: two highway=elevator nodes
 *   (node/2185364240, node/10120556938) 66 m south of the centre, outside
 *   the outline, where the photos show the lift tower.
 * - Commons photos (daylight, EVIDENCE):
 *   "Arenas de Barcelona 2013.jpg" (Felix König, CC BY 3.0, from the south
 *   on the plaza: facade, red roof rim, dome, lift tower);
 *   "Plaza de toros de las Arenas from Palau Nacional - Barcelona
 *   2014.JPG" (José Luiz, CC BY-SA 3.0, from above to the south: the
 *   dome, its glazed wedge, the walkway ring, the entrance pavilion);
 *   "Barcelona - Arenas de Barcelona 002.jpg" (Mummelgrummel, CC BY-SA 3.0).
 *
 * Heights, estimated from the König photo (pixel ratios against the 99 m
 * diameter): the brick facade 0–17.5 m with its white scalloped cresting to
 * 18.3 m, the set-back glazed band of the new building 18.3–21 m, the
 * red-edged roof deck 21–23.5 m overhanging the facade by 3 m, the dome to
 * 27.6 m at radius 12 and the central cap to 29.6 m. That is about 2 m above
 * OSM's tags (ring 18, walkway 19–20, dome 25); a first build on the OSM
 * heights came out visibly squatter than the photo, so the photo wins and
 * this is a doubt. The entrance pavilion (crenellated, "ARENAS DE
 * BARCELONA") stands at about compass 125°, 23 m tall, 14 m wide. The lift
 * tower: a red column and a grey shaft to 34 m, the round sign drum at
 * 30–36 m, a needle to 44 m, a bridge to the roof deck at about 22 m.
 *
 * Facade: Neo-Mudéjar red brick, two tiers of arches round the drum, one
 * pair per bay: large horseshoe-headed arches below, smaller arched windows
 * above, a pale ceramic band between them, drawn as `window` panels and a
 * `trim` band. Colours from the König photo pulled to the palette: brick
 * 0xbd6e58, roof rim red 0xc0443c (painted steel), dome beige `stone`.
 *
 * Doubts: the entrance pavilion’s bearing (from photos, ±10°); the number
 * of bays (52 drawn, counted roughly from the König photo); the dome's
 * glazed wedge and the rooftop railings and plant are left out.
 */
import { Part, type V3, type MaterialSpec } from './mesh'
import { PALETTE, finish } from './palette'
import { lathe, block, emit, tube, archPanel, circle, smoothLoft, capAny, type P2 } from './barcelona-venetian-towers'

const ANCHOR = { lng: 2.149312, lat: 41.376307 }
const brickM: MaterialSpec = { ...finish('arenas-brick', 0xbd6e58), floodlight: (q, n) => (n[2] > 0.7 ? 0.2 : q[2] < 17 ? 0.8 : 0.4) }
const redM = finish('arenas-red', 0xc0443c)
const brick = new Part(), trim = new Part(), win = new Part(), red = new Part(), dome = new Part(), metal = new Part()

const R = 49.5, BAYS = 52
const ringAt = (r: number, z: number, n = BAYS): V3[] => circle(0, 0, r, n).map(([x, y]) => [x, y, z])

// Brick drum, with a plinth course.
smoothLoft(brick, [ringAt(R + 0.3, 0), ringAt(R + 0.3, 1.0), ringAt(R, 1.2), ringAt(R, 17.5)])
// Ceramic band and the scalloped cresting (a crenellated white crown).
smoothLoft(trim, [ringAt(R + 0.08, 9.0), ringAt(R + 0.08, 9.8)])
smoothLoft(trim, [ringAt(R + 0.15, 17.1), ringAt(R + 0.15, 17.6)])
for (let i = 0; i < BAYS; i++) {
  const a = ((i + 0.5) / BAYS) * Math.PI * 2
  const n: P2 = [Math.cos(a), Math.sin(a)], t: P2 = [-Math.sin(a), Math.cos(a)]
  const c: P2 = [n[0] * R * Math.cos(Math.PI / BAYS), n[1] * R * Math.cos(Math.PI / BAYS)]
  // white scallop on the cresting: a low round-topped merlon per bay
  archPanel(trim, c, t, n, 3.6, 17.5, 17.5, 0.12, 6)
  // skip the bays behind the entrance pavilion
  const deg = ((90 - (a * 180) / Math.PI) % 360 + 360) % 360
  if (Math.abs(deg - 125) < 9) continue
  archPanel(win, c, t, n, 3.5, 1.5, 6.0, 0.06, 8)
  for (const s of [-1, 1]) archPanel(win, [c[0] + t[0] * s * 0.9, c[1] + t[1] * s * 0.9], t, n, 1.2, 11.2, 14.2, 0.06, 6)
}
// Sloping cap of the cresting zone back to the glazed band.
smoothLoft(brick, [ringAt(R, 17.5), ringAt(R - 1.6, 18.3)])

// Glazed band of the new building, set back.
smoothLoft(win, [ringAt(R - 1.6, 18.3), ringAt(R - 1.6, 21)])

// Roof deck: red rim overhanging the facade, deck top, dome and cap.
const RO = R + 3
smoothLoft(red, [ringAt(R - 1.6, 21, 48), ringAt(RO - 0.4, 21, 48), ringAt(RO, 21.5, 48), ringAt(RO, 23.2, 48), ringAt(RO - 0.6, 23.5, 48)])
smoothLoft(dome, [ringAt(RO - 0.6, 23.5, 48), ringAt(40, 23.5, 48)])
lathe(dome, [[40, 23.5], [34, 25.0], [26, 26.4], [18, 27.3], [12.2, 27.6], [12, 27.9], [9, 28.8], [5, 29.4], [0, 29.6]], 32)
// Two plant boxes on the dome (the photos' chimneys).
block(metal, -6, 14, 1.4, 1.4, 26.5, 29.2, 0.2)
block(metal, 6, 14, 1.4, 1.4, 26.5, 29.2, 0.2)

// Entrance pavilion at compass 125°.
{
  const a = ((90 - 125) * Math.PI) / 180
  const cx = Math.cos(a) * (R + 1.5), cy = Math.sin(a) * (R + 1.5)
  block(brick, cx, cy, 3.6, 7.2, 0, 21, 0.35, a)
  for (const s of [-1, 1]) block(brick, cx + Math.cos(a + Math.PI / 2) * s * 7.6, cy + Math.sin(a + Math.PI / 2) * s * 7.6, 1.6, 1.6, 0, 23.5, 0.25, a)
  // crenellations
  for (let k = -2; k <= 2; k++) {
    const u = k * 2.6
    block(brick, cx + Math.cos(a + Math.PI / 2) * u + Math.cos(a) * 2.6, cy + Math.sin(a + Math.PI / 2) * u + Math.sin(a) * 2.6, 0.7, 0.6, 21, 22.6, 0.15, a)
  }
  const n: P2 = [Math.cos(a), Math.sin(a)], t: P2 = [-Math.sin(a), Math.cos(a)]
  const face: P2 = [cx + n[0] * 3.6, cy + n[1] * 3.6]
  archPanel(win, face, t, n, 5.2, 0.4, 6.2, 0.06, 10)
  smoothLoft(trim, [[[face[0] + t[0] * 6.4 + n[0] * 0.05, face[1] + t[1] * 6.4 + n[1] * 0.05, 17.1], [face[0] - t[0] * 6.4 + n[0] * 0.05, face[1] - t[1] * 6.4 + n[1] * 0.05, 17.1]],
    [[face[0] + t[0] * 6.4 + n[0] * 0.05, face[1] + t[1] * 6.4 + n[1] * 0.05, 18.3], [face[0] - t[0] * 6.4 + n[0] * 0.05, face[1] - t[1] * 6.4 + n[1] * 0.05, 18.3]]], true)
  for (const s of [-2.2, 0, 2.2]) archPanel(win, [face[0] + t[0] * s, face[1] + t[1] * s], t, n, 1.4, 11.2, 14.4, 0.06, 6)
}

// Lift tower on the plaza side.
{
  const lx = -4.2, ly = -63.5
  tube(red, [[lx + 1.9, ly, 0], [lx + 1.9, ly, 34]], 0.8, 10)
  block(metal, lx - 0.4, ly, 1.5, 1.5, 0, 32.5, 0.2)
  lathe(metal, [[2.4, 30.2], [3.1, 30.8], [3.1, 35.2], [2.6, 35.8], [0, 35.8]], 14, lx + 0.6, ly)
  lathe(red, [[3.15, 32.0], [3.15, 34.4]], 14, lx + 0.6, ly)
  tube(red, [[lx + 0.6, ly, 35.8], [lx + 0.6, ly, 44]], [0.35, 0.05], 6)
  // bridge to the roof deck
  block(metal, lx - 0.4, (ly + -R) / 2 - 1.2, 1.1, (-R - ly) / 2 - 0.6, 21.4, 22.6, 0.15)
}

await emit('barcelona-arenas', 'Arenas de Barcelona', [
  { part: brick, material: brickM },
  { part: trim, material: PALETTE.trim },
  { part: win, material: PALETTE.window },
  { part: red, material: redM },
  { part: dome, material: PALETTE.stone },
  { part: metal, material: PALETTE.roof },
], { bearing: 0, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: 44, replaces: [
  'way/1105997329', 'way/305821928', 'way/618800604', 'way/618800605', 'way/618800606', 'way/618800607', 'way/618800608',
  'way/1105997319', 'way/1105997320', 'way/1105997321', 'way/1105997322', 'relation/14719692', 'relation/14719693',
] })
void capAny
