/**
 * The Barnes Foundation, Philadelphia — procedural, CC0-1.0, no textures.
 * bun generators/phl-barnes-foundation.ts
 *
 * What it is: Tod Williams Billie Tsien's 2012 building on the Parkway. Two
 * long low blocks clad in pale Ramon limestone panels with thin dark slots
 * (the gallery block to the north-east, the offices and classrooms to the
 * south-west), the Light Court between them roofed by the "light box": a
 * long box of frosted glass that rises over both blocks and cantilevers
 * west over the entrance, lit from inside at night.
 *
 * Map frame: x along bearing 133.5 (the long axis, towards Callowhill and
 * 20th Street; the light box cantilevers to -x), y along bearing 43.5, z up,
 * metres; placed at bearing 43.5, the walls (OSM edges 43.5-44°). Anchor:
 * area centroid of the outline way/183620616, -75.172735 39.960620. z = 0
 * is the garden ground along the south-west side (lidar 3.3 m over
 * ground_min), the lowest ground the building touches; the entrance court
 * on the north-east is 1.7 m higher.
 *
 * Covers and replaces: way/183620616 (outline) and its building:parts
 * way/349397315 (gallery block), way/349397318 (the light box),
 * way/952222496 (south block), way/952222505 (the Light Court).
 *
 * Evidence
 * - OSM (2026-11), in this frame: gallery block x -41.3..46.6, y 6.7..20.5,
 *   with its east end x 33.3..46.6 down to y -11.4; light box x -52.3..
 *   33.3, y -7.5..6.8; south block x -34.4..31.9, y -22.8..-7.4. OSM's
 *   heights (6 m, 5.5-9.8 m) are far below the lidar's and are not used.
 * - USGS 3DEP lidar USGS_LPC_DE_DelawareValley_HD_2015_LAS_2017 (flown 2015,
 *   after the 2012 opening), 1 m grid in this frame (measured, above z = 0):
 *   both blocks' parapets 13.5, roofs 12.8; south block's rooftop plant to
 *   15.3; light box top edge 20.8, its roof (solar panels) 20.1.
 * - Photos (Wikimedia Commons): "The Barnes Foundation in Philadelphia (by
 *   MyWikiBiz).jpg" (Thekohser, CC BY-SA 4.0, 2015), the north side: the
 *   cantilevered light box's glass from about 8 m up (photo-scaled) over the
 *   recessed entrance, the panelled limestone, the big bronze-framed window;
 *   "Barnes Foundation - Philadelphia.jpg" (Farragutful, CC BY-SA 4.0) and
 *   "Barnes Philly 1.JPG" (Smallbones, CC0, 2012): the stone blocks and the
 *   frosted glass box over them, the slots and windows; "Barnes Foundation
 *   (53574516274).jpg" (ajay_suresh, CC BY 2.0, 2024): the north wall and
 *   its tall entrance slot.
 * - USGS NAIP (public domain): the green roof on the gallery block, the pale
 *   roof of the south block, the solar panels on the light box.
 * - Estimated: the slots' and windows' positions (from the photos, not
 *   measured), the recessed entrance under the cantilever.
 * - Simplified: the stone's panel joints are not drawn; garden walls,
 *   reflecting pool and terraces are the map's or left out.
 *
 * Night: the light box glows in its own frosted white (`neon-barnes-light-
 * box`: a lit volume whose colour is its identity, so `neon` rather than a
 * warm `window`); the slots and windows are dark recesses. The roof grey
 * here is the solar panels' blue-grey (NAIP); the plant boxes share it.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cbox, rect, panel, qf, type Rect, type Side } from './dc-white-house'
import { saveModel } from './dc-nga-west'

const stone = new Part(), box = new Part(), slot = new Part(), roof = new Part(), green = new Part(), frame = new Part()

const PAR = 13.5, ROOFZ = 12.8, BOX_TOP = 20.8, BOX_ROOF = 20.1

/** A stone block with a parapet round a sunken roof. */
function block(r: Rect, top: Part) {
  cbox(stone, r, 0, PAR, { top: false, b: 0 })
  const t = 0.5
  for (const q of [rect(r.x0, r.x1, r.y0, r.y0 + t), rect(r.x0, r.x1, r.y1 - t, r.y1), rect(r.x0, r.x0 + t, r.y0, r.y1), rect(r.x1 - t, r.x1, r.y0, r.y1)])
    qf(stone, [q.x0, q.y0, PAR], [q.x1, q.y0, PAR], [q.x1, q.y1, PAR], [q.x0, q.y1, PAR], [0, 0, 1])
  const i = rect(r.x0 + t, r.x1 - t, r.y0 + t, r.y1 - t)
  for (const [a, b] of [[[i.x0, i.y0], [i.x1, i.y0]], [[i.x1, i.y0], [i.x1, i.y1]], [[i.x1, i.y1], [i.x0, i.y1]], [[i.x0, i.y1], [i.x0, i.y0]]] as [number, number][][]) {
    const n: V3 = [-(b[1] - a[1]), b[0] - a[0], 0] // inward-facing parapet sides
    qf(stone, [a[0], a[1], ROOFZ], [b[0], b[1], ROOFZ], [b[0], b[1], PAR], [a[0], a[1], PAR], n)
  }
  qf(top, [i.x0, i.y0, ROOFZ], [i.x1, i.y0, ROOFZ], [i.x1, i.y1, ROOFZ], [i.x0, i.y1, ROOFZ], [0, 0, 1])
}

// Gallery block (green roof), its east end, the south block (pale roof).
block(rect(-41.3, 46.6, 6.7, 20.5), green)
block(rect(33.3, 46.6, -11.4, 6.7), green)
block(rect(-34.4, 31.9, -22.8, -7.4), frame)
// the Light Court's walls between the blocks, under the box
cbox(stone, rect(-34.4, 33.3, -7.4, 6.7), 0, PAR, { top: false })
// rooftop plant on the south block
cbox(roof, rect(-22, -6, -20, -11), ROOFZ, 15.3, { b: 0.2 })
cbox(roof, rect(4, 18, -20, -11), ROOFZ, 14.6, { b: 0.2 })

// ---------------------------------------------------------------------------
// The light box: frosted glass walls, a thin pale frame, the solar roof.
{
  const X0 = -52.3, X1 = 33.3, Y0 = -7.5, Y1 = 6.8, LOW = 8.2, XC = -41.3
  // walls: from the stone roofs up over the blocks, down to LOW over the cantilever
  const wall = (side: Side, at: number, a0: number, a1: number, z0: number) => panel(box, side, at, a0, a1, z0, BOX_TOP - 0.3, 0)
  for (const [side, at] of [['s', Y0], ['n', Y1]] as [Side, number][]) {
    wall(side, at, X0, XC, LOW)
    wall(side, at, XC, X1, PAR)
  }
  wall('w', X0, Y0, Y1, LOW)
  wall('e', X1, Y0, Y1, PAR)
  // vertical joints of the glass panels: thin frame lines every 3 m
  for (let x = X0; x <= X1 + 0.01; x += (X1 - X0) / 28) {
    for (const [side, at] of [['s', Y0], ['n', Y1]] as [Side, number][]) panel(frame, side, at, x - 0.06, x + 0.06, x < XC ? LOW : PAR, BOX_TOP - 0.3, 0.03)
  }
  for (let y = Y0; y <= Y1 + 0.01; y += (Y1 - Y0) / 5) panel(frame, 'w', X0, y - 0.06, y + 0.06, LOW, BOX_TOP - 0.3, 0.03)
  // the top band
  cbox(frame, rect(X0 - 0.05, X1 + 0.05, Y0 - 0.05, Y1 + 0.05), BOX_TOP - 0.3, BOX_TOP, { top: false })
  qf(frame, [X0, Y0, BOX_ROOF], [X1, Y0, BOX_ROOF], [X1, Y1, BOX_ROOF], [X0, Y1, BOX_ROOF], [0, 0, 1])
  for (const [a, b] of [[[X0, Y0], [X1, Y0]], [[X1, Y0], [X1, Y1]], [[X1, Y1], [X0, Y1]], [[X0, Y1], [X0, Y0]]] as [number, number][][]) {
    const n: V3 = [-(b[1] - a[1]), b[0] - a[0], 0]
    qf(frame, [a[0], a[1], BOX_ROOF], [b[0], b[1], BOX_ROOF], [b[0], b[1], BOX_TOP], [a[0], a[1], BOX_TOP], n)
  }
  // the cantilever's soffit
  qf(frame, [X0, Y0, LOW], [XC, Y0, LOW], [XC, Y1, LOW], [X0, Y1, LOW], [0, 0, -1])
  // solar panel rows on the roof
  for (let k = 0; k < 14; k++) {
    const x = X0 + 1.5 + k * 6.0
    cbox(roof, rect(x, x + 5.2, Y0 + 1.0, Y1 - 1.0), BOX_ROOF, BOX_ROOF + 0.25)
  }
  // the recessed entrance under the cantilever: a low stone wall with a glazed door
  cbox(stone, rect(-50.0, XC, -5.5, 5.0), 0, LOW, { top: false })
  qf(stone, [-50.0, -5.5, LOW - 0.01], [XC, -5.5, LOW - 0.01], [XC, 5.0, LOW - 0.01], [-50.0, 5.0, LOW - 0.01], [0, 0, -1])
  panel(slot, 'w', -50.0, -3.0, 2.0, 1.7, 5.5, 0.05)
}

// ---------------------------------------------------------------------------
// Slots and windows: tall thin dark slots in the stone, a few deep windows.
const slots: [Side, number, number, number, number][] = [
  // side, wall, position along it, z0, z1
  ['n', 20.5, -30, 6, 12.5], ['n', 20.5, -14, 6, 12.5], ['n', 20.5, 6, 6, 12.5], ['n', 20.5, 24, 6, 12.5], ['n', 20.5, 38, 6, 12.5],
  ['n', 20.5, -6, 1.7, 9.0], // the tall entrance slot
  ['s', -22.8, -26, 6, 12.5], ['s', -22.8, -10, 6, 12.5], ['s', -22.8, 8, 6, 12.5], ['s', -22.8, 22, 6, 12.5],
  ['e', 46.6, -6, 5, 12.5], ['e', 46.6, 12, 5, 12.5],
  ['w', -41.3, 14, 5, 12.5], ['w', -34.4, -15, 5, 12.5],
]
for (const [side, at, a, z0, z1] of slots) panel(slot, side, at, a - 0.18, a + 0.18, z0, z1, 0.05)
// rows of small deep windows on the south block (offices, classrooms)
for (let k = 0; k < 10; k++) {
  const x = -30 + k * 6.2
  panel(slot, 's', -22.8, x - 0.6, x + 0.6, 2.0, 4.2, 0.05)
  panel(slot, 's', -22.8, x - 0.6, x + 0.6, 7.2, 9.4, 0.05)
}
// the large bronze-framed window on the north side
panel(slot, 'n', 20.5, -24, -18, 6.5, 10.5, 0.05)
// the restaurant's windows on the west end of the gallery block
panel(slot, 'w', -41.3, 8.5, 12.0, 1.0, 4.5, 0.05)

const lit = (_p: V3, n: V3) => (n[2] > 0.7 ? 0.1 : 0.45)
/** A material with its night floodlighting (written as `_FLOODLIGHT`). */
function withFlood<T extends object>(m: T, floodlight: (p: V3, n: V3) => number) {
  return { ...m, floodlight }
}
if (import.meta.main) {
  await saveModel('phl-barnes-foundation', 'Barnes Foundation', [
    { part: stone, material: withFlood(finish('barnes-limestone', 0xddd3c1), lit) },
    { part: box, material: finish('neon-barnes-light-box', 0xd3e2e5, 0.3) },
    { part: frame, material: { ...PALETTE.trim, color: 0xe9eef0 } },
    { part: slot, material: finish('barnes-slot', 0x4b4844, 0.5) },
    { part: roof, material: { ...PALETTE.roof, color: 0x8796a6 } },
    { part: green, material: finish('barnes-green-roof', 0x93a37c) },
  ], { source: 'generators/phl-barnes-foundation.ts', bearing: 43.5, osm: 'way/183620616', height: BOX_TOP })
}
