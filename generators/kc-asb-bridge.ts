/**
 * ASB Bridge (Armour–Swift–Burlington Bridge), Kansas City, Missouri (1911;
 * Waddell & Harrington; stone piers of 1890) — procedural, CC0-1.0.
 * bun generators/kc-asb-bridge.ts
 *
 * The double-deck "telescoping" vertical-lift bridge over the Missouri, as
 * one placement over its OSM outline way/706022488: the 428 ft river span's
 * tall fixed upper truss, which carried the road deck (Route 9) at its
 * bottom chord, with the rail deck hung below it on long hangers, so the
 * rail span could rise into the truss without closing the road; its two
 * end towers, the south one with the machinery house on top and the
 * counterweights hanging off its south side; the two double-deck fixed
 * spans north of it, through trusses with X-braced panels carrying the rail
 * at their bottom chords and the old road deck on top; the four stone
 * piers; and the south abutment on the bank. The road deck's surface was
 * removed in 1988–89; its steel framing is still there, so the model draws it
 * as a grey slab. The single BNSF track is the model's (the map draws no
 * track inside the outline it replaces): a dark ballast-and-tie strip with
 * two rails.
 *
 * Frame: x across (+x right looking along +y), y along the bridge toward the
 * north (North Kansas City) end, z up, metres. Origin at the outline's
 * centroid (-94.5799099, 39.1168858), bearing 345.5 (the outline's long
 * sides and the track, way/18425050). z = 0 is the river: lidar water
 * 220.2 m, Mapterhorn 220.0-220.1; heights here = NAVD88 - 220.1.
 * elevation 0.
 *
 * Track built to (measured; tools/bridge_ele.py measure on the track ways
 * 1029494947, 1029494946, 18425050, USGS 3DEP MO_FEMANRCS_1_2020, flown
 * 2020): level at 232.1 m NAVD88 = 12.0 here from end to end (readings
 * 232.04-232.19 through gaps in the old road deck over 330 m; 232.13 clean
 * at the north end), as the HAER drawing's "Level Grade". OSM `ele` for the
 * map: ~/landmarks-scratch/osm-ele/kc-asb-bridge.md.
 *
 * Sources
 * - OSM (© OpenStreetMap contributors): outline way/706022488 (man_made=
 *   bridge, Q4654082), 11 m wide, y -197..+200 here, with notches at the
 *   piers (y -52, +73); track ways 1029494947 (south end), 1029494946
 *   (bridge:movable=lift, y -62..-178), 18425050 (to the north end, on to the
 *   trestle north of the outline, which the map keeps).
 * - Lidar (measured; MO_FEMANRCS_1_2020; NAVD88 - 220.1): the old road
 *   deck's framing 29.0 (edges 30.4) from end to end; the river span's top
 *   chord 50.9 from y = -54 to -186; tower tops 56.6 (north, y -54..-60)
 *   and 57.2 (south, y -180..-188); pier tops 9.0, 16 m across; the track
 *   12.0 (above).
 * - Published: Wikipedia "ASB Bridge": 1,282 ft long; main span 428 ft
 *   (130.5 m; 134 m between the pier centres here); double-deck truss with
 *   vertical lift; nine stone piers of 1890 shaved to 10 ft above high water;
 *   upper deck surface removed 1988–89. HAER MO-xx drawing (public domain,
 *   "Drawing ASB Bridge, Kansas City, Missouri.jpg"): the river span's
 *   towers at both ends, the fixed spans' X-braced panels, rail 57 ft under
 *   the road deck (17.4 m; lidar 17.0).
 * - Map terrain: Mapterhorn z15 (tools/terrain.ts grid, bearing 345.5): the
 *   river from y = -176 to +115; the south bank rising to 7-9 m at the
 *   abutment and 11.8 behind it; the north bank 3-6 m.
 *
 * Photos (evidence, Wikimedia Commons)
 * - Antony-22, "ASB Bridge 2025b.jpg", CC BY-SA 4.0 (from the south bank,
 *   south-west: the river span, its south tower, machinery house and rusty
 *   counterweights, the hangers, the fixed spans, the stone piers; the steel
 *   painted light grey, not black):
 *   https://commons.wikimedia.org/wiki/File:ASB_Bridge_2025b.jpg
 * - David Brossard, "ASB Bridge from southwest in 2022.jpg", CC BY-SA 2.0
 *   (the same side, wider):
 *   https://commons.wikimedia.org/wiki/File:ASB_Bridge_from_southwest_in_2022.jpg
 * - Nikky, "ASB Bridge with train crossing, 2013.jpg", CC BY 2.0 (from below
 *   on the east: the hangers, the rail deck's girders, the pier masonry):
 *   https://commons.wikimedia.org/wiki/File:ASB_Bridge_with_train_crossing,_2013.jpg
 * - Todd Wade, "ASB Bridge and Heart of America Bridge.jpg", CC BY 2.0 (from
 *   the north-east bank: the fixed spans' through trusses, the tower):
 *   https://commons.wikimedia.org/wiki/File:ASB_Bridge_and_Heart_of_America_Bridge.jpg
 *
 * Numbers
 * - Measured: every level above; the truss planes 11 m apart (lidar edges).
 * - Estimated (photos, HAER drawing): the river span's ten panels, each split
 *   by a sub-post, with Warren diagonals and inclined end posts; the fixed spans'
 *   eight X-braced panels; hangers every panel; the towers 6 m along the
 *   bridge; the machinery house 11 x 8 x 6 m; counterweights 1.8 x 11 x 8 m
 *   either side, 26-34 m up; the piers' cutwaters; the rail deck's girders 2.4 m deep.
 * - Colours (daylight photos): light grey steel; rust-brown counterweights;
 *   buff stone piers; dark ballast.
 *
 * Doubts
 * - The trusses' web pattern is simplified (the river span's real web is a
 *   subdivided Warren with sub-struts); no detail model is drawn.
 * - The north tower's top and the houses' sizes are photo-scaled.
 * - The south approach under the old road deck (y -186..-200) is drawn as
 *   girders on the abutment; its real framing is not well photographed.
 * - Night: unlit (no evidence of architectural lighting).
 */
import { Part, writeGlb, type V3 } from './mesh'
import { band, footedLoft, groundAt, rod, stations, strip, truss, type GroundGrid } from './bridge-kit'
import { box, countParts, loftSolid, one } from './sf-golden-gate-bridge'
import { finish } from './palette'

// ---- Measurements ---------------------------------------------------------------

const RAIL = 12.0, ROAD = 29.0, TOP = 50.9
const XT = 5.5                         // truss planes
const P_S = -186, P_1 = -52, P_2 = 73, P_N = 199.5, S_END = -200
const T_S = 57.2, T_N = 56.6           // tower tops

// Map ground above the river (Mapterhorn - 0.1), 5 m apart; the river between.
const S_GROUND: GroundGrid = { y0: -215, x0: -20, step: 5, z: [
  [11.0, 11.4, 11.6, 11.7, 11.9, 11.8, 11.6, 11.5, 11.7], [8.9, 10.1, 11.5, 11.8, 11.9, 11.5, 10.9, 10.8, 11.2], [8.4, 8.8, 11.0, 11.5, 11.8, 11.3, 10.5, 10.5, 10.7], [7.3, 8.3, 8.8, 8.8, 8.7, 8.8, 9.3, 10.0, 10.3],
  [6.1, 6.3, 6.7, 6.5, 6.6, 6.6, 7.1, 7.7, 8.3], [4.5, 5.1, 5.4, 5.3, 5.4, 5.4, 5.6, 6.0, 6.3], [0.3, 1.2, 1.8, 3.0, 3.1, 3.4, 3.8, 4.6, 5.0], [0, 0, 0, 0.1, 0.5, 1.0, 1.7, 2.4, 2.9],
  [0, 0, 0, 0, 0, 0.1, 0.3, 0.7, 1.3], [0, 0, 0, 0, 0, 0, 0, 0, 0],
] }
const N_GROUND: GroundGrid = { y0: 100, x0: -20, step: 5, z: [
  [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0.3, 0, 0, 0, 0, 0, 0, 0, 0], [1.2, 0, 0, 0, 0, 0, 0, 0, 0],
  [2.9, 0.8, 0, 0, 0, 0, 0, 0, 0], [3.3, 3.4, 2.6, 1.6, 0.7, 0.2, 0.3, 0.1, 0], [3.2, 3.2, 3.4, 3.3, 1.9, 1.5, 3.1, 3.1, 3.0], [4.0, 3.7, 3.5, 3.3, 1.5, 2.1, 3.7, 3.9, 4.4],
  [5.6, 5.0, 4.4, 3.7, 2.0, 2.6, 3.9, 4.2, 4.3], [6.1, 6.1, 5.5, 4.3, 2.7, 3.0, 4.6, 5.0, 5.0], [6.0, 6.0, 5.6, 4.5, 3.0, 3.3, 5.4, 6.4, 6.1], [5.5, 5.6, 5.5, 4.5, 3.0, 3.8, 5.8, 6.9, 6.2],
  [5.1, 5.1, 5.3, 4.6, 3.5, 4.4, 6.2, 7.3, 6.5], [4.9, 5.0, 5.1, 4.4, 3.8, 4.8, 6.2, 6.9, 6.0], [4.8, 4.9, 4.9, 3.5, 4.1, 5.2, 6.2, 6.6, 5.9], [4.7, 4.8, 4.9, 3.4, 4.6, 5.3, 6.0, 6.4, 6.1],
  [4.8, 4.9, 5.0, 4.4, 4.7, 5.3, 5.9, 6.3, 5.9], [5.1, 5.1, 5.1, 4.5, 4.5, 5.1, 5.7, 5.5, 5.4], [5.0, 5.0, 5.0, 4.6, 4.6, 5.1, 5.3, 5.2, 5.5], [4.9, 4.7, 4.8, 4.4, 4.4, 4.9, 5.0, 5.1, 5.3],
  [4.7, 4.7, 4.6, 4.2, 4.2, 4.2, 4.6, 4.7, 4.9], [4.5, 4.5, 4.3, 4.2, 4.3, 4.3, 4.2, 4.3, 4.5], [4.5, 4.5, 4.4, 4.4, 4.3, 4.3, 4.2, 4.2, 4.3], [4.7, 4.7, 4.7, 4.6, 4.5, 4.5, 4.4, 4.3, 4.3],
] }
const ground = (x: number, y: number) =>
  y <= -170 ? groundAt(S_GROUND, x, y) : y >= 100 ? groundAt(N_GROUND, x, y) : 0
/** The lowest of the ground within 3 m, for feet on a steep bank (the grid is coarser than the map's). */
const groundLow = (x: number, y: number) => Math.min(...[-3, 0, 3].flatMap((dx) => [-3, 0, 3].map((dy) => ground(x + dx, y + dy))))

// ---- Parts ----------------------------------------------------------------------

type Kit = { steel: Part; web: Part; deck: Part; stone: Part; weight: Part; track: Part }
const k: Kit = { steel: new Part(), web: new Part(), deck: new Part(), stone: new Part(), weight: new Part(), track: new Part() }
const S = one(k.steel)

// ---- Piers and abutment ------------------------------------------------------------

/** A stone pier: long across the river with pointed cutwaters, battered, with a coping. */
function pier(y: number) {
  const plan = (d: number): [number, number][] => [[-10 + d, y], [-8 + d * 0.5, y - 3 + d], [8 - d * 0.5, y - 3 + d], [10 - d, y], [8 - d * 0.5, y + 3 - d], [-8 + d * 0.5, y + 3 - d]]
  footedLoft(k.stone, groundLow, [{ plan: plan(0), z: 'ground' }, { plan: plan(0.5), z: 8.3 }, { plan: plan(0.2), z: 8.4 }, { plan: plan(0.2), z: 9.0 }], 1.5)
  // the bearings under the girders
  for (const sx of [-1, 1]) box(S, sx * XT - 0.9, sx * XT + 0.3, y - 1.3, y + 1.3, 9.0, RAIL - 1.4, { r: 0.1, bottom: false })
}

function abutment() {
  const plan: [number, number][] = [[-8, S_END - 2.5], [8, S_END - 2.5], [8, S_END + 1.5], [-8, S_END + 1.5]]
  footedLoft(k.stone, ground, [{ plan, z: 'ground' }, { plan, z: RAIL - 0.3 }], 1.5)
}

// ---- Rail deck and track -------------------------------------------------------------

function railDeck() {
  const ys = stations(S_END, P_N, 20)
  for (const s of [-1, 1]) {
    // the outer girders the whole way: deeper lattice girders on the lift span (photo 2013)
    band(k.steel, s * (XT - 0.6), s * XT, stations(P_S, P_1, 20), () => RAIL + 0.6, () => RAIL - 2.6, { out: true, in: true, top: true, bottom: true, ends: true })
    band(k.steel, s * (XT - 0.6), s * XT, stations(P_1, P_N, 25), () => RAIL + 0.4, () => RAIL - 1.4, { out: true, in: true, top: true, bottom: true, ends: true })
    band(k.steel, s * (XT - 0.6), s * XT, stations(S_END, P_S, 14), () => RAIL + 0.2, () => RAIL - 2.6, { out: true, in: true, top: true, bottom: true, ends: true })
    // the two rails
    band(k.steel, s * 0.79, s * 0.65, ys, () => RAIL + 0.18, () => RAIL, { out: true, in: true, top: true })
  }
  // ballast and ties, and the floor under them
  band(k.track, -1.6, 1.6, ys, () => RAIL, () => RAIL - 0.3, { top: true, out: true, in: true })
  band(k.deck, -XT + 0.6, XT - 0.6, ys, () => RAIL - 0.3, () => RAIL - 1.2, { top: true, bottom: true })
}

// ---- The old road deck on top ----------------------------------------------------------

function roadDeck() {
  const ys = stations(S_END - 2, P_N, 25)
  band(k.deck, -XT - 0.3, XT + 0.3, ys, () => ROAD, () => ROAD - 0.6, { top: true, bottom: true, out: true, in: true, ends: true })
  for (const s of [-1, 1]) band(k.deck, s * (XT - 0.3), s * (XT + 0.3), ys, () => ROAD + 1.3, () => ROAD, { top: true, out: true, in: true, ends: true })
}

// ---- Fixed spans: double-deck through trusses with X-braced panels ----------------------

function fixedSpan(y0: number, y1: number) {
  const ys = stations(y0, y1, (y1 - y0) / 8)
  const zb = RAIL + 0.4, zt = ROAD - 0.6
  for (const s of [-1, 1]) {
    const x = s * XT
    // chords: the bottom one is the rail deck's girder; the top under the road deck
    band(k.steel, x - 0.4, x + 0.4, ys, () => zt, () => zt - 1.0, { out: true, in: true, bottom: true })
    // posts, and an X in every panel
    for (const y of ys) box(S, x - 0.35, x + 0.35, y - 0.45, y + 0.45, zb, zt - 1.0, { r: 0, bottom: false })
    for (let i = 0; i + 1 < ys.length; i++) {
      strip(k.web, [x, ys[i], zb], [x, ys[i + 1], zt - 1.0], 0.55, [1, 0, 0])
      strip(k.web, [x, ys[i + 1], zb], [x, ys[i], zt - 1.0], 0.55, [1, 0, 0])
    }
  }
  // sway struts across under the road deck at every panel point
  for (const y of ys) box(S, -XT, XT, y - 0.3, y + 0.3, zt - 2.2, zt - 1.0, { r: 0, bottom: true })
}

// ---- River span: the upper truss, its hangers and the towers -----------------------------

const PANEL = (P_1 - P_S) / 10
const topLine = (y: number) => {
  if (y < P_S + PANEL) return ROAD + ((TOP - ROAD) * (y - P_S)) / PANEL
  if (y > P_1 - PANEL) return ROAD + ((TOP - ROAD) * (P_1 - y)) / PANEL
  return TOP
}

function riverSpan() {
  // ten main panels, each split by a sub-post (the photos' subdivided web)
  const ys = stations(P_S, P_1, PANEL / 2)
  const curve = [P_S, P_S + PANEL, P_1 - PANEL, P_1]
  for (const s of [-1, 1]) {
    truss(k.steel, k.web, s * XT, ys, (y) => Math.max(topLine(y), ROAD + 1.2), () => ROAD - 1.2,
      { chordW: 0.9, topD: 1.1, botD: 1.2, member: 0.8, post: 0.7, curve })
    // the hangers that carry the rail span, one at every inner panel point
    for (const y of ys.slice(1, -1)) box(S, s * XT - 0.35, s * XT + 0.35, y - 0.4, y + 0.4, RAIL + 0.6, ROAD - 1.2, { r: 0, bottom: false })
  }
  // top struts and portal beams across, at every main top panel point
  const main = stations(P_S + PANEL, P_1 - PANEL, PANEL)
  for (const y of main) box(S, -XT, XT, y - 0.35, y + 0.35, TOP - 1.1, TOP - 0.2, { r: 0, bottom: true })
  // the top lateral X bracing, panel by panel
  for (let i = 0; i + 1 < main.length; i++) {
    strip(k.web, [-XT, main[i], TOP - 0.6], [XT, main[i + 1], TOP - 0.6], 0.5, [0, 0, 1])
    strip(k.web, [XT, main[i], TOP - 0.6], [-XT, main[i + 1], TOP - 0.6], 0.5, [0, 0, 1])
  }
}

/** A tower over a pier: four posts from the pier to `top`, braced, with a house on top. */
function tower(y: number, top: number, house: [number, number]) {
  const hy = 3
  for (const sx of [-1, 1]) for (const sy of [-1, 1])
    box(S, sx * XT - 0.5, sx * XT + 0.5, y + sy * hy - 0.5, y + sy * hy + 0.5, 9.0, top - house[1], { r: 0.15, bottom: false })
  // bracing on the outer faces between rail and road and above the road
  for (const sx of [-1, 1]) for (const [z0, z1] of [[RAIL + 0.6, ROAD - 1.2], [ROAD + 1, (ROAD + TOP) / 2], [(ROAD + TOP) / 2, top - house[1]]]) {
    strip(k.web, [sx * XT, y - hy, z0], [sx * XT, y + hy, z1], 0.5, [1, 0, 0])
    strip(k.web, [sx * XT, y + hy, z0], [sx * XT, y - hy, z1], 0.5, [1, 0, 0])
  }
  // the house
  box(S, -XT - 0.2, XT + 0.2, y - house[0] / 2, y + house[0] / 2, top - house[1], top - 0.4, { r: 0.2 })
  box(one(k.deck), -XT - 0.5, XT + 0.5, y - house[0] / 2 - 0.3, y + house[0] / 2 + 0.3, top - 0.4, top, { r: 0.1 })
}

/** The counterweights off the south tower's south side, on both faces, and their ropes. */
function counterweights() {
  for (const s of [-1, 1]) {
    box(one(k.weight), s * (XT + 0.4) - (s > 0 ? 0 : 1.8), s * (XT + 0.4) + (s > 0 ? 1.8 : 0), P_S - 14, P_S - 3, 26, 34, { r: 0.2 })
    for (const yy of [P_S - 5, P_S - 9, P_S - 13])
      rod(k.steel, [s * (XT + 0.2), P_S - 3.5, T_S - 1.5], [s * (XT + 1.3), yy, 34], 0.12, 3)
  }
}

/** The south approach under the road deck: posts on the abutment. */
function southApproach() {
  for (const s of [-1, 1]) box(S, s * XT - 0.4, s * XT + 0.4, S_END - 0.4, S_END + 0.4, RAIL - 2.6, ROAD - 0.6, { r: 0, bottom: false })
  box(S, -XT, XT, S_END - 0.3, S_END + 0.3, ROAD - 1.6, ROAD - 0.6, { r: 0, bottom: true })
}

// ---- Build -------------------------------------------------------------------------------

for (const y of [P_S, P_1, P_2, P_N]) pier(y)
abutment()
railDeck()
roadDeck()
fixedSpan(P_1, P_2)
fixedSpan(P_2, P_N)
riverSpan()
tower(P_S, T_S, [8, 6])
tower(P_1, T_N, [6, 3])
counterweights()
southApproach()

const list = [
  { part: k.steel, material: finish('steel-grey', 0xc2c6c8) },
  { part: k.web, material: { ...finish('steel-web', 0xc2c6c8), doubleSided: true } },
  { part: k.deck, material: finish('deck-steel', 0x8b9095) },
  { part: k.stone, material: finish('pier-stone', 0xcbbfa8) },
  { part: k.weight, material: finish('counterweight-rust', 0xa06e55) },
  { part: k.track, material: finish('ballast', 0x6b655d) },
]
const tris = countParts(list)
const glb = writeGlb('ASB Bridge', list, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the outline centroid, on the river',
  bearing: 345.5, elevation: 0, track: RAIL, roadDeck: ROAD, piers: [P_S, P_1, P_2, P_N],
})
console.log(`kc-asb-bridge.glb: ${tris} triangles, ${glb.length} bytes; ` + list.map((p) => `${p.material.name} ${p.part.triangles}`).join(', '))
if (tris > 6500 || glb.length > 250 * 1024) throw new Error('over budget')
await Bun.write(new URL('../models/kc-asb-bridge.glb', import.meta.url), glb)
