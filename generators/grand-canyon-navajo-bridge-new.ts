/**
 * Navajo Bridge (1995; Arizona Department of Transportation), US 89A over
 * Marble Canyon on the Colorado River, 55 m downstream of the 1929 bridge
 * it replaced — procedural, CC0-1.0, no textures.
 * bun generators/grand-canyon-navajo-bridge-new.ts
 *
 * A near-twin of the old bridge, built to look like it: a steel
 * spandrel-braced deck arch, but wider, longer and flatter, with solid
 * box arch ribs and one diagonal in each spandrel panel, falling towards
 * midspan, where the old bridge has an X. A road bridge, so the map draws the
 * roadway and its markings: the model draws nothing at road level across
 * it. The top chords stand under the roadway's edges 0.35 m down, the deck's
 * underside hangs below it, and the railings stand on its edges
 * (docs/reference.md, Bridges). Built with `deckArch` from
 * grand-canyon-navajo-bridge.ts (merge that first).
 *
 * Frame: x across (towards 210.2°, downstream), y along the road towards the
 * south-east bank (bearing 120.2°, OSM way/91534555), z up, metres. Origin on
 * the way's axis at (-111.631644, 36.817248), over the river opposite the old
 * bridge's arch centre. z = 0 is the river, the lowest ground under the
 * footprint: the map terrain's water reading (grid below, less 0.1 m).
 *
 * Roadway heights the model is built to (above the map's river): 134.9 m at
 * the north-west abutment (y = −147) falling evenly to 132.1 m at the
 * south-east one (y = +130), the map terrain at both ends plus 0.2 m. OSM
 * has no `ele` on the road nodes nor a height on the way; if the map's deck
 * lands elsewhere, tag the nodes (docs/bridge-heights.md) rather than move
 * the model.
 *
 * Sources:
 * - OSM (API, 2026-11-20): way/91534555 (highway=primary, US 89A, bridge=yes,
 *   layer 1, 2 lanes), straight from y = −74 to +130, curving to the west
 *   beyond. No man_made=bridge outline and no building under the deck, so
 *   `replaces` is empty.
 * - Map terrain (tools/terrain.ts grid, Mapterhorn z15, 5 m, `GROUND`).
 *   The canyon's walls stand 210 m apart at 117 m, where the arch's feet are
 *   put (y = −102.8 and +107.2).
 * - Published (Wikipedia "Navajo Bridge"; ADOT): built 1993–95; 909 ft
 *   (277 m) long, arch 726 ft (221 m); 470 ft (143 m) above the river;
 *   44 ft (13.4 m) roadway.
 * - Photos (Wikimedia Commons, all EVIDENCE):
 *   - "Navajo Bridge Wide View 2019-10-29.jpg", Eric Kilby, CC BY-SA 2.0
 *     (the whole downstream face, square on: solid arch ribs, a rise about
 *     a fifteenth of the span, one diagonal per panel, lattice end towers);
 *   - "Navajo Steel Arch Highway Bridge 1.jpg", T meltzer, CC BY-SA 4.0
 *     (both bridges end on from the east);
 *   - "Navajo Bridge from East.jpg", Sebastian Kasten, CC BY-SA 4.0.
 * - Measured from the map terrain: the roadway ends, the springing height
 *   and the feet; the rise (12.5 m) follows from them, and matches the
 *   Kilby photo. Wikipedia gives 90 ft (27 m), the old bridge's figure,
 *   which the terrain and the photo both rule out.
 * - Estimated from photos: rib spacing (11.2 m), rib depth (2.5 m), top chord
 *   depth (2.0 m), 14 panels, the north-west bent, railing height.
 *
 * Doubts: the arch's span from the terrain (210 m) is 11 m under the
 * published 221 m; the feet may sit in notches in the walls that the
 * terrain doesn't resolve. The road heights are the terrain's, not lidar's.
 *
 * Night: unlit.
 */
import { Part, writeGlb } from './mesh'
import { finish } from './palette'
import { band, groundAt, merged, stations, type GroundGrid } from './bridge-kit'
import { deckArch } from './grand-canyon-navajo-bridge'

// Map terrain under the bridge (tools/terrain.ts grid -111.631644 36.817248 160 5
// --bearing 120.2), x −20..20, metres above 939.69 m; the water reads 0.1.
const GROUND: GroundGrid = {"y0":-160,"x0":-20,"step":5,"z":[[136.8,137,137.2,137.5,137.9,138.4,138.9,139.5,140.3],[136,136.2,136.4,136.7,137,137.4,137.8,138.3,139],[135.1,135.2,135.4,135.7,136,136.3,136.6,137.1,137.7],[134.1,134.1,134.3,134.5,134.8,135.1,135.4,135.9,136.4],[132.9,133,133.1,133.3,133.5,133.8,134.1,134.6,135],[131.6,131.6,131.6,131.8,131.9,132.1,132.5,133,133.4],[130.1,130,129.9,129.9,129.9,130.1,130.4,130.8,131.2],[128.5,128.2,128,127.8,127.6,127.6,127.8,128.1,128.6],[126.7,126.3,125.9,125.5,125.2,125,124.9,125.2,125.6],[124.8,124.2,123.7,123.2,122.7,122.4,122.2,122.3,122.7],[122.8,122.2,121.6,120.9,120.3,119.9,119.7,119.7,119.9],[120.6,119.8,119,118.2,117.5,117.1,116.7,116.5,116.6],[117,115.6,114.4,113.4,112.1,111.4,111.2,110.6,110.4],[108.3,106,103.7,102.2,100.6,99.4,99,99,98.5],[90.8,87.9,85,83,81.5,80.4,79.8,80.3,80.6],[67.5,65,62.6,61,60.1,59.6,59.5,60.6,61.8],[46.9,45.7,44.2,43.3,43.3,43.6,44.2,45.7,47.2],[34.9,34.5,33.8,33.2,33.7,34.4,34.9,35.9,36.9],[29.3,28.8,28.5,28.1,28.3,28.7,28.8,29,29.3],[25.1,24.7,24.4,24.1,23.9,23.9,23.8,23.6,23.7],[21.2,20.8,20.5,20.1,19.8,19.6,19.3,19.1,19.1],[17.5,17.1,16.8,16.3,15.9,15.4,14.9,14.5,14.5],[13.5,13.3,12.8,12.3,11.6,10.8,10.1,9.5,9.4],[9.1,9,8.6,7.8,7.1,6.2,5.4,4.8,4.6],[4.9,5,4.5,3.9,3.3,2.7,2.1,1.7,1.5],[2,2.1,1.8,1.4,1.1,0.8,0.5,0.4,0.3],[0.6,0.6,0.5,0.3,0.2,0.2,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.6,0.4,0.4,0.4,0.3,0.2,0.2,0.2,0.2],[1.9,1.6,1.4,1.4,1.3,1.1,0.9,0.9,0.8],[4.4,4.1,3.6,3.5,3.5,3.2,2.9,2.8,2.6],[9.3,8.9,8.5,8.1,7.9,7.6,7.1,6.6,6.3],[18.3,17.9,17.6,17,16.4,15.9,15.3,14.3,13.4],[32.7,32.5,32.2,31.3,30.2,29.3,28.4,27.2,25.7],[51.7,51.3,51.4,50.3,48.5,47.1,46.1,44.7,42.7],[73,71.9,72,71.3,69.3,67.5,66.2,64.6,62.3],[95,93,92.6,92.4,90.6,88.2,86.4,84.7,82.4],[114.3,112.4,111.5,111.3,109.9,107.3,104.7,102.9,101.1],[126.4,125.2,124.2,123.8,123.1,121.3,119.1,117.2,116.1],[131.3,130.6,129.9,129.5,129.1,128.3,127.1,125.8,125.3],[132.4,131.9,131.4,131.1,131,130.6,130.1,129.6,129.4],[132.4,132.1,131.6,131.4,131.3,131.2,131,130.9,131.1],[132.8,132.3,131.9,131.6,131.5,131.4,131.4,131.5,131.8],[133.3,132.8,132.3,132,131.8,131.7,131.9,132,132.4],[133.8,133.2,132.7,132.3,132.1,132.1,132.2,132.5,132.8],[134.3,133.6,133,132.6,132.4,132.4,132.5,132.8,133.1],[134.7,134,133.3,132.8,132.7,132.6,132.7,132.9,133.2],[135.1,134.4,133.6,133.1,132.8,132.8,132.8,133,133.3],[135.5,134.7,133.9,133.3,133,132.9,133,133.1,133.4]]}
const ground = (x: number, y: number) => Math.max(0, groundAt(GROUND, x, y) - 0.1)

// Heights above the river (see the header).
const ENDS: [number, number] = [-147, 130]
const road = (y: number) => 134.9 + ((132.1 - 134.9) * (y - ENDS[0])) / (ENDS[1] - ENDS[0])
const EDGE = 7.0 // outer edge of the deck
const RX = 5.6 // rib planes
const TOP_D = 2.0, RIB_D = 2.5

function build() {
  const yc = 2.2
  const arch = deckArch({
    ground, yc, half: 105, spring: 117, crown: road(yc) - 0.35 - TOP_D - 0.3 - RIB_D / 2,
    rx: RX, ribD: RIB_D, ribW: 1.0, top: (y) => road(y) - 0.35, topD: TOP_D, panels: 14, web: 'n',
    ends: ENDS, bents: [-125], outer: EDGE, endPostW: 3.2,
  })
  const under = new Part(), rail = new Part()
  const ys = stations(ENDS[0], ENDS[1], 8)
  // The deck's underside and outer fascias, below the map's roadway.
  for (const [x0, x1] of [[-EDGE, 0], [0, EDGE]])
    band(under, x0, x1, ys, (y) => road(y) - 0.35, (y) => road(y) - 0.9, { out: true, bottom: true })
  // Railings on the deck's edges: a parapet with a steel rail, one band.
  for (const s of [-1, 1]) band(rail, s * (EDGE - 0.3), s * EDGE, ys, (y) => road(y) + 1.05, (y) => road(y) - 0.3, { out: true, in: true, top: true, ends: true })
  return { ...arch, under, rail }
}

const STEEL = finish('steel-grey', 0xbfc4c6, 0.6)
const WEB = { ...finish('steel-grey-web', 0xbfc4c6, 0.6), doubleSided: true }
const CONC = finish('concrete', 0xd8cdbd)
const RAIL = finish('railing', 0xd9dbd7, 0.6)

if (import.meta.main) {
  const m = build()
  const list = [
    { part: m.steel, material: STEEL },
    { part: m.web, material: WEB },
    { part: merged(m.conc, m.under), material: CONC },
    { part: m.rail, material: RAIL },
  ].filter(({ part }) => part.triangles > 0)
  const tris = list.reduce((s, { part }) => s + part.triangles, 0)
  if (tris > 5000) throw new Error(`${tris} triangles, over 5000`)
  const glb = writeGlb('Navajo Bridge (1995)', list, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin on the road axis over the river, on the river',
    bearing: 120.2, elevation: 0, roadway: [road(ENDS[0]), road(ENDS[1])], ends: ENDS,
  })
  if (glb.length > 250 * 1024) throw new Error(`${glb.length} bytes, over 250 KB`)
  await Bun.write(new URL('../models/grand-canyon-navajo-bridge-new.glb', import.meta.url), glb)
  console.log(`grand-canyon-navajo-bridge-new.glb: ${tris} triangles, ${glb.length} bytes`)
}
