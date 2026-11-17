/**
 * Fatih Sultan Mehmet Bridge (Second Bosphorus Bridge; 1988; Freeman Fox &
 * Partners and BOTEK) — procedural, CC0-1.0.
 * bun generators/istanbul-fsm-bridge.ts
 *
 * The whole suspension bridge as one placement: the two steel portal towers
 * on the hillsides of Rumelihisarı (Europe) and Kavacık (Asia), the main
 * cables and their back stays down to the anchorages on the hilltops, and
 * the aerodynamic box deck of the main span, tower to tower, plus the short
 * stretch of the OSM outline beyond each tower on an abutment. The side
 * spans are not suspended: the approaches beyond the outline are the map's.
 * Writes a low model (towers, cables, the deck as a solid box, anchorages,
 * cable and edge lights) and a detail model (the same with the vertical
 * suspenders as real members, finer cables, edge railings and denser
 * lights), drawn from detailZoom 16. Shared pieces (deck sweep, tower,
 * floodlight, columns) live in istanbul-bosphorus-bridge.ts.
 *
 * Frame: x across the bridge, y along it toward Asia (east), z up, metres;
 * origin midway between the towers, on the water. Placed at bearing 86.5°,
 * the outline's long edges (the towers' line agrees within 0.1°), anchored
 * at 29.0614008, 41.0912996, 37.3 m east of the outline's centroid. The map
 * owns the roadway; the box's top is drawn 0.35 m under it.
 *
 * Height. z = 0 is the water (Mapterhorn reads the Bosphorus as 0).
 * - Roadway: 64 m at midspan, the OSM outline's `height` (published
 *   clearance 64 m), a crest curve to 61 m at the towers (estimated from
 *   jose02, a near-level view: the deck is nearly flat), held at 61 m on
 *   the outline's ends beyond the towers.
 * - Towers: 105 m above the roadway (published), legs from 57.5 m (the
 *   pedestals' top, 3.5 m under the roadway) to 165 m, saddle hoods to
 *   167 m. Published: steel legs 5 × 4 m at the foot, 3 × 4 m at the top,
 *   102.1 m from the foundations, standing on concrete pedestals up to
 *   14 m high; two beams. Beams from jose02 and jose09: the top one
 *   155–165 m (deep, flush with the leg tops), the lower one centred about
 *   46 m above the roadway (103.5–110.5 m). OSM tags the legs 165 m and
 *   beams at 152–155 and 120–125 / 50–60 m; the photos are preferred.
 * - Ground (Mapterhorn z12, about 14 m a pixel; no z13–z15 tiles here):
 *   10 m grids in this frame at both ends (EUROPE_GROUND, ASIA_GROUND), 0
 *   over the water. Under the European tower it reads 60–61 m, under the
 *   Asian 53–55 m, so the pedestals show only on the Asian side; the
 *   anchorages' hilltops 66–68 m. Pedestals, abutments and anchorages stand
 *   on it vertex by vertex. z12 smooths the steep shore, ±3 m. Nothing
 *   stands in the water, so the model's lowest point is the Asian
 *   pedestal's foot, about 53 m above it. `bun tools/terrain.ts check`
 *   cannot run (no z15 tiles).
 *
 * Sources:
 * - OSM: the outline way/403376607 (man_made=bridge, suspension, height
 *   64 m, min_height 60 m, wikidata Q369967), 34–36 m wide, y = −599.3 to
 *   +560.3, notched round the tower legs. Tower parts: Europe
 *   way/403376602, way/403376606 (legs), way/403376605 (beam); Asia
 *   way/403379442, way/403379446 (legs), way/403379443, way/403379444
 *   (beams). Tower centres 1,084.6 m apart (published span 1,090 m); legs
 *   about 37 m apart, centre to centre.
 * - Wikidata Q369967 (Fatih Sultan Mehmet Bridge; 41.0911, 29.0614, checked
 *   against OSM).
 * - Published (Wikipedia en "Fatih Sultan Mehmet Bridge", tr "Fatih Sultan
 *   Mehmet Köprüsü"): 1,510 m between the anchor blocks, main span
 *   1,090 m, deck 39 m wide (a 33.8 m by 3 m box with 2.8 m cantilevered
 *   footways), clearance 64 m, towers 105 m over the road on the
 *   hillsides, vertical double suspenders, main cables 0.58 m (0.60 m in
 *   the back stays).
 * - Photos (Wikimedia Commons, evidence):
 *   - jose02: "Fatih Sultan Mehmet Bridge in 2026 02.jpg" (Joseolgon,
 *     CC BY 4.0): the Asian tower from the water; the portal, both beams,
 *     the back stays, suspender spacing (about 16 m).
 *   - jose09: "Fatih Sultan Mehmet Bridge in 2026 09.jpg" (Joseolgon,
 *     CC BY 4.0): from under the deck; the box soffit, the portal, the
 *     tower foot on the hillside.
 *   - jose01, jose06: "... in 2026 01/06.jpg" (Joseolgon, CC BY 4.0): the
 *     whole bridge from the water.
 *   - otagtepe: "Fatih Sultan Mehmet Bridge from Otagtepe.jpg"
 *     (Ibrahimferhadli, CC BY-SA 4.0): the Asian tower close up from the
 *     hill; the deep top beam, white paint.
 *   - night: "Fatih Sultan Mehmet Bridge Night.jpg" (Karaahmet, CC BY-SA
 *     4.0): cable lights on the main cables and back stays, a line of
 *     lights along the deck, the towers lit.
 * - Estimated: the legs' taper across (5 → 3.2 m; along 4.5 → 4 m, a
 *   little over the published 4 m), the beams' depth along (3.6 m), the
 *   saddle hoods, the box's section, the pedestals' plan, the abutments,
 *   and the anchorages (no photo: a block under each cable 755 m from the
 *   middle, the cable entering 4 m above the hilltop). The cables are
 *   drawn 1.2 m thick, the suspenders 0.4 m, one per pair every 16 m.
 * - Colour: white-grey steel from sunlit photos (near white in otagtepe),
 *   pulled to #e3e5e2; the soffit and the deck's top darker; cables mid
 *   grey.
 *
 * Night: the towers are floodlit (lit in colour; the map lights them warm
 * white), `lamp` beads string along the main cables and back stays and
 * along both deck edges, as in the night photo.
 *
 * Doubts: the anchorages; the road heights at the towers (no lidar); the
 * ground at the European tower (z12 puts it at the road); the lower beam's
 * height (photos give 45–47 m above the road from the water, more from
 * Otağtepe).
 */
import { Part, writeGlb, type V3 } from './mesh'
import { band, bead, chamferedRect, footedLoft, groundAt, rod, stations, tube, along, type GroundGrid } from './bridge-kit'
import { box, one } from './sf-golden-gate-bridge'
import { column, deck, tower, towerLight, type Section, type TowerSpec } from './istanbul-bosphorus-bridge'
import { finish, type Swatch } from './palette'

const TY = 542.3                      // towers at y = ±TY (OSM legs and the outline's notches)
const END_EU = -599.3, END_AS = 560.3 // the outline's ends
const ANCH = 755                      // anchorages at y = ±ANCH (1,510 m between them, published)
const ROAD_MID = 64, ROAD_TOWER = 61
const road = (y: number) => {
  const a = Math.min(Math.abs(y), TY)
  return ROAD_MID - (ROAD_MID - ROAD_TOWER) * (a / TY) ** 2
}
const CX = 17.5                       // cable and suspender plane
const SADDLE = 166, LOW = road(0) + 2.5
const DECK_BOTTOM = 3.0
const SECTION: Section = [[19.7, -0.35], [19.7, -1.0], [16.9, -1.2], [13.6, -DECK_BOTTOM], [0, -DECK_BOTTOM]]

// Mapterhorn z12 heights (the water reads 0), 10 m apart in this frame:
// rows along y from y0, columns across from x = -40.
const EUROPE_GROUND: GroundGrid = { y0: -800, x0: -40, step: 10, z: [
  [70.6, 67.6, 65.2, 63.8, 63.5, 63.9, 64.9, 66.5, 68.1],
  [70.9, 67.8, 65.3, 64.1, 63.8, 64.2, 65.2, 66.4, 67.6],
  [71.1, 68.1, 65.5, 64.5, 64.2, 64.4, 65.5, 66.6, 67.6],
  [71.6, 68.6, 65.9, 64.9, 64.6, 64.8, 65.8, 66.8, 67.8],
  [71.9, 68.9, 66.4, 65.6, 65.3, 65.4, 66.2, 67.1, 68.0],
  [72.3, 69.3, 66.9, 65.9, 65.6, 65.8, 66.5, 67.4, 68.4],
  [72.7, 69.8, 67.3, 66.1, 65.6, 66.0, 66.8, 67.6, 68.5],
  [72.7, 69.6, 67.1, 66.0, 65.6, 66.0, 66.9, 67.8, 68.5],
  [72.7, 69.6, 67.3, 66.2, 65.9, 66.2, 67.0, 67.9, 68.8],
  [72.7, 69.7, 67.7, 66.6, 66.2, 66.6, 67.3, 68.2, 69.1],
  [72.7, 69.9, 67.8, 66.8, 66.5, 66.9, 67.8, 68.7, 69.4],
  [72.7, 69.8, 67.8, 66.8, 66.6, 67.1, 67.9, 68.7, 69.7],
  [72.8, 69.7, 67.9, 66.8, 66.4, 67.1, 67.8, 68.7, 69.7],
  [73.0, 69.9, 68.0, 66.7, 66.0, 66.7, 67.5, 68.6, 69.6],
  [73.0, 70.0, 67.9, 66.5, 66.0, 66.4, 67.1, 68.1, 69.5],
  [73.0, 70.2, 67.9, 66.4, 65.9, 66.2, 66.9, 68.0, 69.2],
  [73.1, 70.4, 68.1, 66.3, 65.6, 66.0, 66.8, 67.9, 69.0],
  [73.0, 70.2, 68.0, 66.4, 65.7, 65.8, 66.5, 67.8, 68.9],
  [72.7, 70.1, 68.0, 66.4, 65.9, 66.0, 66.6, 67.8, 68.8],
  [72.1, 70.0, 68.1, 66.5, 66.2, 66.3, 66.8, 67.9, 68.8],
  [71.2, 69.5, 68.1, 66.9, 66.6, 66.6, 67.1, 68.2, 69.0],
  [69.7, 68.7, 67.8, 67.0, 66.8, 66.9, 67.1, 68.1, 68.9],
  [67.7, 67.4, 67.1, 66.8, 66.8, 66.9, 66.8, 67.7, 68.4],
  [64.7, 65.3, 65.9, 66.1, 66.3, 66.5, 66.5, 67.0, 67.4],
  [61.7, 62.9, 64.0, 64.7, 65.0, 65.2, 65.1, 65.2, 65.3],
  [58.4, 60.3, 61.9, 62.9, 63.3, 63.4, 63.1, 62.8, 62.6],
  [54.8, 57.3, 59.4, 60.6, 61.2, 61.2, 60.7, 60.2, 59.7],
  [50.5, 53.5, 56.3, 57.7, 58.4, 58.5, 58.0, 57.3, 56.6],
  [45.8, 49.1, 52.2, 53.7, 54.4, 54.4, 53.8, 53.2, 52.6],
  [41.0, 44.3, 47.2, 48.7, 49.4, 49.3, 48.6, 48.1, 47.9],
  [36.3, 39.1, 41.2, 42.3, 42.8, 42.7, 42.3, 42.0, 42.0],
  [31.9, 34.1, 35.5, 36.2, 36.4, 36.3, 36.3, 36.5, 36.7],
  [27.8, 29.4, 30.1, 30.4, 30.5, 30.7, 31.2, 31.7, 32.1],
] }
const ASIA_GROUND: GroundGrid = { y0: 480, x0: -40, step: 10, z: [
  [45.2, 44.4, 43.8, 43.1, 42.4, 42.2, 42.0, 41.9, 42.1],
  [47.2, 46.5, 45.9, 45.2, 44.4, 44.2, 44.0, 43.8, 44.1],
  [48.9, 48.0, 47.3, 46.7, 46.1, 45.8, 45.6, 45.6, 46.0],
  [50.1, 49.4, 48.6, 47.8, 47.2, 46.9, 46.9, 47.3, 47.7],
  [51.4, 50.8, 49.9, 49.1, 48.5, 48.2, 48.3, 48.7, 49.6],
  [52.9, 52.3, 51.5, 50.8, 50.2, 49.9, 50.0, 50.4, 51.4],
  [54.7, 54.6, 54.2, 53.5, 52.7, 52.4, 52.3, 52.4, 53.2],
  [56.3, 56.8, 56.8, 56.4, 55.7, 55.1, 54.7, 54.9, 55.4],
  [57.5, 58.7, 59.1, 59.0, 58.5, 57.9, 57.5, 57.7, 58.2],
  [57.7, 59.4, 60.5, 61.2, 60.9, 60.7, 60.6, 60.8, 61.6],
  [57.1, 59.3, 61.0, 62.1, 62.4, 62.7, 63.1, 64.0, 65.3],
  [56.2, 58.9, 61.0, 62.5, 63.5, 64.4, 65.3, 66.8, 68.6],
  [55.2, 58.2, 60.7, 62.7, 64.2, 65.7, 67.2, 69.2, 71.5],
  [54.5, 57.8, 60.6, 62.9, 64.9, 66.8, 68.8, 71.2, 74.1],
  [54.1, 57.6, 60.7, 63.2, 65.5, 67.7, 70.2, 72.8, 75.8],
  [54.2, 57.8, 60.9, 63.7, 66.0, 68.3, 71.0, 73.8, 76.8],
  [54.9, 58.5, 61.4, 64.0, 66.2, 68.4, 70.9, 73.8, 77.1],
  [55.6, 59.1, 61.9, 63.9, 66.0, 68.1, 70.5, 73.5, 77.0],
  [56.2, 59.7, 62.4, 63.8, 65.5, 67.6, 70.0, 73.0, 76.6],
  [57.2, 60.3, 62.3, 63.7, 65.3, 67.1, 69.5, 72.5, 76.1],
  [58.3, 61.0, 62.5, 63.8, 65.1, 66.6, 69.0, 72.0, 75.8],
  [59.5, 61.8, 62.9, 63.9, 65.0, 66.3, 68.7, 71.7, 75.5],
  [60.6, 62.5, 63.6, 64.2, 64.9, 66.3, 68.5, 71.5, 75.3],
  [61.2, 62.8, 63.5, 64.1, 64.8, 66.2, 68.5, 71.6, 75.4],
  [61.3, 62.8, 63.2, 63.8, 64.6, 66.0, 68.5, 71.7, 75.6],
  [61.0, 62.1, 62.7, 63.4, 64.2, 65.9, 68.5, 71.8, 75.6],
  [60.4, 61.6, 62.5, 63.4, 64.4, 66.2, 68.6, 71.5, 75.3],
  [59.7, 61.1, 62.2, 63.2, 64.3, 66.1, 68.4, 71.3, 75.1],
  [59.0, 60.6, 61.8, 62.8, 63.9, 65.9, 68.3, 71.2, 75.0],
  [58.2, 59.9, 61.2, 62.5, 63.8, 65.7, 68.2, 71.3, 75.1],
  [57.4, 59.2, 60.8, 62.3, 63.7, 65.8, 68.3, 71.5, 75.2],
  [56.6, 58.6, 60.5, 62.2, 63.7, 65.9, 68.5, 71.6, 75.3],
  [55.8, 58.1, 60.0, 61.8, 63.8, 66.1, 68.6, 71.8, 75.4],
] }
const ground = (x: number, y: number) =>
  y <= -480 ? groundAt(EUROPE_GROUND, x, y) : y >= 480 ? groundAt(ASIA_GROUND, x, y) : 0

const anchorZ = (y: number) => Math.max(ground(-CX, y), ground(CX, y)) + 4
const mainCable = (y: number) => LOW + (SADDLE - LOW) * (y / TY) ** 2
const backStay = (y: number) => {
  const end = Math.sign(y) * ANCH, t = (Math.abs(y) - TY) / (ANCH - TY)
  return SADDLE + (anchorZ(end) - SADDLE) * t - 4 * t * (1 - t)
}
const cable = (y: number) => (Math.abs(y) <= TY ? mainCable(y) : backStay(y))
const CABLE_R = 0.6

const LEG: Omit<TowerSpec, 'y' | 'plinth'> = {
  legX: 18.5, z0: ROAD_TOWER - 3.5, z1: 165, w: [5.0, 3.2], d: [4.5, 4.0], r: 0.5,
  beams: [[155, 165, 3.6], [103.5, 110.5, 3.6]],
  hood: 167.2, cableX: CX,
}

if (import.meta.main) {
  const make = (detail: boolean) => {
    const steel = new Part(), shade = new Part(), cables = new Part(), concrete = new Part(), lamps = new Part()
    const face0 = LEG.d[0] / 2 + 0.15
    for (const y of [-TY, TY]) {
      tower(steel, concrete, ground, { ...LEG, y, plinth: { top: LEG.z0, pad: 1.5 } })
      // The deck's seat between the legs, where the box ends at the tower.
      const xi = LEG.legX - LEG.w[0] / 2 + 0.3
      box(one(shade), -xi, xi, y - face0, y + face0, road(y) - DECK_BOTTOM - 1.5, road(y) - 0.35, { r: 0, bottom: true })
    }
    // The box deck: the main span, tower to tower, and the short ends of the outline beyond the towers on abutments.
    const step = detail ? 12 : 30
    const spans: [number, number][] = [[END_EU, -TY - face0], [-TY + face0, TY - face0], [TY + face0, END_AS]]
    for (const [a, b] of spans) deck(steel, shade, shade, stations(a, b, step), road, SECTION)
    for (const [a, b] of [spans[0], spans[2]]) {
      const pl = chamferedRect(-15, 15, Math.min(a, b) + 1, Math.max(a, b) - 1, 0.5)
      footedLoft(concrete, ground, [{ plan: pl, z: 'ground' }, { plan: pl, z: ROAD_TOWER - DECK_BOTTOM }], 4)
    }
    // Anchorages: a block under each cable's end, on the hilltops behind the towers.
    for (const sy of [-1, 1]) for (const sx of [-1, 1]) {
      const y = sy * ANCH, top = anchorZ(y) + 1.0
      const [x0, x1] = sx > 0 ? [CX - 2, CX + 7] : [-CX - 7, -CX + 2]
      const pl = chamferedRect(x0, x1, y - 9 + sy * 6, y + 9 + sy * 6, 1.0)
      footedLoft(concrete, ground, [{ plan: pl, z: 'ground' }, { plan: pl, z: top }], 3)
    }
    // Main cables and back stays.
    const cstep = detail ? 10 : 40
    const ys = [...stations(-ANCH, -TY, cstep), ...stations(-TY, TY, cstep).slice(1), ...stations(TY, ANCH, cstep).slice(1)]
    for (const s of [-1, 1]) {
      const path = ys.map((y) => [s * CX, y, cable(y)] as V3)
      tube(cables, path, CABLE_R, detail ? 8 : 5)
      // Cable lights: a string of lamps along each cable, main span and back stays.
      for (const p of along(path, detail ? 96 : 40)) bead(lamps, [p[0], p[1], p[2] + 0.9], detail ? 0.6 : 1.0, !detail)
    }
    // Edge lights along the deck.
    for (const y of stations(-TY + 12, TY - 12, detail ? 24 : 48)) for (const s of [-1, 1]) bead(lamps, [s * 19.4, y, road(y) + 1.4], detail ? 0.5 : 0.8, !detail)
    if (detail) {
      // Suspenders: vertical, one per pair, every 16 m.
      for (let y = 8; y < TY - 6; y += 16) for (const yy of [y, -y]) for (const s of [-1, 1]) {
        const z0 = road(yy) - 0.4, z1 = cable(yy) - CABLE_R * 0.7
        if (z1 - z0 > 0.6) rod(steel, [s * CX, yy, z0], [s * CX, yy, z1], 0.2, 4)
      }
      // Railings on the footway edges.
      for (const [a, b] of spans) {
        const ys = stations(a, b, 12)
        for (const s of [-1, 1]) {
          band(steel, s * 19.55, s * 19.7, ys, (y) => road(y) + 1.15, (y) => road(y) + 1.0, { out: true, in: true, top: true, bottom: true })
          for (const y of stations(a, b, 6)) rod(steel, [s * 19.62, y, road(y) - 0.35], [s * 19.62, y, road(y) + 1.05], 0.06, 3)
        }
      }
    }
    return { steel, shade, cables, concrete, lamps }
  }

  const lit = towerLight([-TY, TY], LEG.d[0] / 2 + 1, ROAD_TOWER, 167)
  const STEEL = { ...finish('bridge-white', 0xe3e5e2), floodlight: lit }
  const SHADE: Swatch = finish('bridge-white-shade', 0xaab2b7)
  const CABLE: Swatch = finish('cable-grey', 0x8f989d)
  const CONCRETE: Swatch = finish('concrete', 0xd9d3c7)
  const LAMP: Swatch = finish('lamp', 0xc9cdcf)

  const extras = {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin midway between the towers, on the water',
    bearing: 86.5, elevation: 0, towers: [-TY, TY], ends: [END_EU, END_AS],
    roadwayMidspan: road(0), roadwayAtTowers: road(TY),
  }
  for (const [file, detail, maxTris, maxBytes] of [
    ['istanbul-fsm-bridge.glb', false, 6500, 250 * 1024],
    ['istanbul-fsm-bridge.detail.glb', true, 40000, 1536 * 1024],
  ] as const) {
    const m = make(detail)
    const list = [
      { part: m.steel, material: STEEL }, { part: m.shade, material: SHADE }, { part: m.cables, material: CABLE },
      { part: m.concrete, material: CONCRETE }, { part: m.lamps, material: LAMP },
    ].filter((p) => p.part.triangles > 0)
    const tris = list.reduce((s, p) => s + p.part.triangles, 0)
    if (tris > maxTris) throw new Error(`${file}: ${tris} triangles, over ${maxTris}`)
    const glb = writeGlb('Fatih Sultan Mehmet Bridge', list, extras)
    if (glb.length > maxBytes) throw new Error(`${file}: ${glb.length} bytes, over ${maxBytes}`)
    await Bun.write(new URL(`../models/${file}`, import.meta.url), glb)
    console.log(`${file}: ${tris} triangles, ${glb.length} bytes`)
  }
  for (const y of [-TY, TY]) console.log('ground at tower', y, [-21, -18.5, -16, 16, 18.5, 21].map((x) => ground(x, y).toFixed(1)).join(' '))
  for (const y of [-ANCH, ANCH]) console.log('anchor z', y, anchorZ(y).toFixed(1))
}
