/**
 * Kaibab Suspension Bridge ("Black Bridge", 1928; National Park Service)
 * over the Colorado River at the foot of the South Kaibab Trail, Grand
 * Canyon — procedural, CC0-1.0, no textures.
 * bun generators/grand-canyon-kaibab-suspension-bridge.ts
 *
 * A footbridge, so the whole thing is the model's, walking surface included:
 * the narrow timber deck between two black Warren-with-verticals side
 * trusses (about 1.8 m tall), the floor beams that carry it, the main cables
 * slung beside it, the tunnel portal in the schist cliff at the south end
 * where the trail comes through the rock, the cable anchorage on the knob
 * above it, and the small abutment and cable anchors at the north end. There
 * are no towers: the cables run from the anchorage high on the south cliff,
 * sag to the deck's top chord near the north end and go into the rock there
 * at deck level. Writes a low model (deck, trusses opened at half density,
 * one cable a side, portal, anchorages) and a detail model (trusses at their
 * real panel spacing, two cables a side, suspenders), detailZoom 16.
 *
 * Frame: x across (towards 53.9°), y along the deck towards the north bank
 * (bearing 323.9°, the OSM footway way/211919546), z up, metres. Origin on
 * the footway's axis at its midpoint, moved 2.8 m to −x onto the deck that
 * lidar shows (the OSM line runs 2.8 m off it). z = 0 is the river as the
 * map stands the model on it: 741.12 m, the lowest ground under the footprint
 * (tools/terrain.ts check), which is also the lidar's water.
 *
 * Sources:
 * - OSM (API, 2026-11-20): way/211919546 (highway=footway, bridge=yes,
 *   layer 1, alt_name Black Bridge, Q17300121), 136 m long. No man_made=
 *   bridge outline and no building inside the footprint, so `replaces` is
 *   empty.
 * - Lidar, USGS 3DEP AZ_GrandCanyonNP_1_2019 (flown 2019), 1 m grid,
 *   read along the deck (tools/lidar_frame.py): the top of the deck
 *   structure 22.5 m above the water at midspan, 21.8 m at the south end
 *   (y = −62) and 22.0 m at the north end, so the top chord is drawn level
 *   at 22.5 m; the south cliff rising past 40 m by y = −70 and to
 *   about 51 m at y = −76 (the knob with the anchorage); the north bank
 *   at about 24 m by y = +70.
 * - Map terrain (tools/terrain.ts grid, 5 m, `GROUND`): footings run down
 *   to it vertex by vertex.
 * - Published (NPS, "Kaibab Suspension Bridge"; HAER AZ-29; Wikipedia
 *   "Kaibab Trail Suspension Bridge"): built 1928, 440 ft (134 m) long,
 *   5 ft (1.5 m) wide deck; eight 1⅝-inch cables, each about 550 ft long,
 *   carried down the trail by 42 Havasupai men; the trail reaches it
 *   through a tunnel blasted in the schist on the south side.
 * - Photos (Wikimedia Commons, all EVIDENCE):
 *   - "Black Bridge Grand Canyon.JPG", Fredlyfish4, CC BY-SA 3.0 (from the
 *     South Kaibab Trail above the south end: the deck running into the
 *     cliff, the cables climbing to the south);
 *   - "Grand Canyon National Park - Kaibab Suspension Bridge 8578",
 *     Grand Canyon National Park, CC BY 2.0 (from the south bank: the
 *     trusses, the cables dipping to the top chord at the north end);
 *   - "D 1247 South Kaibab Trail Kaibab Suspension Bridge.", Grand Canyon
 *     National Park, CC BY 2.0 (from high on the south side: the whole
 *     span, the anchorage hut on the south knob);
 *   - "02244 Grand Canyon Historic Kaibab Trail Suspension Bridge", Grand
 *     Canyon National Park, CC BY 2.0 (the cable entering the rock at deck
 *     level at the far end, the steep cables at the near end);
 *   - "04259 Grand Canyon Historic Kaibab Trail Suspension Bridge Aerial",
 *     Grand Canyon National Park, CC BY 2.0 (the truss lattice from above).
 * - Estimated from photos: the truss height (1.8 m) and panel length
 *   (about 2.2 m); the cables' path (through the south anchorage at
 *   50 m, a low point at the top chord around y = +50, into the north bank
 *   at about 23.5 m); the portal and anchorage blocks' size.
 * - Drawn bolder than real (STYLE.md, Bridges): cables 0.28 m (low, one per
 *   side for the bundle) and 0.2 m (detail) against the real 41 mm;
 *   suspenders 0.12 m at every second panel point.
 * - Left out: the storm (wind) cables guyed from under the deck to the
 *   banks, the mesh on the railings, the anchorage hut's small sheds.
 *
 * Doubts: the cable anchorages' exact positions (no photo shows them
 * close); whether the cables reach the north rock at deck level or a little
 * above it; the deck surface is drawn 1.8 m under the lidar top.
 *
 * The model touches nothing below its footings on the cliffs (the lowest
 * vertex is 12.7 m up, on the north bank), as the real bridge: no pier
 * stands in the river.
 *
 * Night: unlit.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { finish } from './palette'
import { band, chamferedRect, footedLoft, groundAt, parabola, stations, truss, tube, type GroundGrid } from './bridge-kit'

const GROUND: GroundGrid = {"y0":-85.0,"x0":-15.0,"step":5.0,"z":[[21.7,26.4,30.2,33.1,40.2,43.5,48.4],[19.6,27.7,36.0,38.0,47.7,49.5,52.6],[15.1,25.4,40.3,43.0,50.0,51.0,47.5],[8.9,12.1,25.2,37.3,44.3,45.1,38.5],[5.6,6.4,18.7,28.4,28.9,14.2,10.3],[3.4,3.8,15.0,10.6,1.5,0.5,0.4],[1.9,0.8,0.8,0.4,0.4,0.4,0.4],[0.7,0.4,0.4,0.4,0.4,0.4,0.4],[0.4,0.4,0.4,0.4,0.4,0.4,0.4],[0.4,0.4,0.4,0.4,0.4,0.4,0.4],[0.4,0.4,0.4,0.4,0.4,0.4,0.4],[0.4,0.4,0.4,0.4,0.4,0.4,0.4],[0.4,0.4,0.4,0.4,0.4,0.4,0.4],[0.4,0.4,0.4,0.4,0.4,0.4,0.4],[0.4,0.4,0.4,0.4,0.4,0.4,0.4],[0.4,0.4,0.4,0.4,0.4,0.4,0.4],[0.3,0.4,0.4,0.4,0.4,0.4,0.4],[0.3,0.4,0.4,0.4,0.4,0.4,0.4],[0.3,0.4,0.4,0.4,0.4,0.4,0.4],[0.3,0.4,0.4,0.4,0.4,0.4,0.4],[0.3,0.3,0.4,0.4,0.4,0.4,0.4],[0.3,0.3,0.4,0.4,0.4,0.4,0.4],[0.3,0.3,0.4,0.4,0.4,0.4,0.4],[0.3,0.3,0.4,0.4,0.4,0.4,0.4],[0.3,0.3,0.3,0.4,0.4,0.4,0.4],[0.3,0.3,0.3,0.4,0.4,0.4,1.1],[0.3,0.3,0.3,0.4,0.4,1.2,3.1],[0.3,0.3,0.3,1.0,2.8,3.9,5.9],[0.4,0.4,2.3,4.0,5.6,7.5,7.9],[2.3,2.7,3.9,5.0,7.5,19.0,14.2],[3.8,4.9,6.7,14.8,17.8,20.5,19.8],[6.1,13.3,24.2,20.7,19.9,27.1,21.4],[16.2,28.8,34.9,34.3,29.2,31.3,26.8],[25.4,33.3,37.0,39.5,40.4,42.0,42.5],[30.5,35.4,38.3,40.8,45.5,47.0,46.7]]}
// The grid is above 740.81 m; the map's y = 0 is the lowest ground under the
// footprint, 741.12 m (tools/terrain.ts check), the lidar's water too.
const ground = (x: number, y: number) => Math.max(0, groundAt(GROUND, x, y) - 0.31)

// Heights above the map's river (see the header).
const TOP = 22.5 // top chord, level (lidar)
const TRUSS = 1.8 // truss depth, top of top chord to bottom of bottom chord
const WALK = TOP - TRUSS + 0.2 // walking surface
const S_END = -64, N_END = 68 // where the deck meets the rock (lidar, map terrain)
const TX = 0.95 // truss centre lines
const CX = 1.4 // cable planes, just outside the trusses
// Main cables: south anchorage high on the knob, low point at the top
// chord near the north end, into the north bank at about deck level.
const S_ANCHOR: [number, number] = [-76, 50]
const LOW: [number, number] = [50, TOP + 0.15]
const cableZ = (y: number) => LOW[1] + ((S_ANCHOR[1] - LOW[1]) / (S_ANCHOR[0] - LOW[0]) ** 2) * (y - LOW[0]) ** 2
const N_ANCHOR: [number, number] = [72, cableZ(72)]

const box = (p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number) => {
  const r: V3[] = [[x0, y0, 0], [x1, y0, 0], [x1, y1, 0], [x0, y1, 0]]
  const lo = r.map(([x, y]) => [x, y, z0] as V3), hi = r.map(([x, y]) => [x, y, z1] as V3)
  p.loft([lo, hi])
  p.cap(hi, true)
  p.cap(lo, false)
}

function build(detail: boolean) {
  const steel = new Part(), web = new Part(), deck = new Part(), rock = new Part(), dark = new Part()

  // Deck: the timber walking surface between the trusses, over the bottom chords.
  const ys = stations(S_END, N_END, 8)
  band(deck, -TX + 0.1, TX - 0.1, ys, () => WALK, () => WALK - 0.15)

  // Side trusses: Warren with verticals, panel points about 2.2 m apart
  // (half that density in the low model).
  const panels = stations(S_END, N_END, detail ? 2.2 : 4.4)
  for (const s of [-1, 1])
    truss(steel, web, s * TX, panels, () => TOP, () => TOP - TRUSS, {
      chordW: 0.22, topD: 0.2, botD: 0.3, member: detail ? 0.12 : 0.2, post: detail ? 0.14 : 0.22, flip: s > 0, curve: ys,
    })

  // Floor beams under the deck, reaching out to the suspender planes.
  for (const y of stations(S_END + 2, N_END - 2, detail ? 4.4 : 8.8))
    box(steel, -CX - 0.1, CX + 0.1, y - 0.12, y + 0.12, TOP - TRUSS - 0.3, TOP - TRUSS)

  // Main cables: one bundle a side in the low model, two in the detail.
  const path = (x: number) => stations(S_ANCHOR[0], N_ANCHOR[0], 4).map((y) => [x, y, cableZ(y)] as V3)
  for (const s of [-1, 1]) {
    if (detail) for (const dx of [-0.18, 0.18]) tube(steel, path(s * CX + dx), 0.1, 5)
    else tube(steel, path(s * CX), 0.14, 5)
  }

  // Suspenders, detail only, at every second panel point where the cable
  // stands clear of the floor beam.
  if (detail)
    for (const y of stations(S_END + 2, N_END - 2, 4.4)) {
      const top = cableZ(y)
      if (top - (TOP - TRUSS) < 0.6) continue
      for (const s of [-1, 1]) tube(web, [[s * CX, y, TOP - TRUSS - 0.3], [s * CX, y, top]], 0.06, 3)
    }

  // South end: the tunnel portal cut in the cliff, a squared rock-coloured
  // frame round a dark opening the deck runs into, footed on the terrain.
  const PY = S_END
  footedLoft(rock, ground, [
    { plan: chamferedRect(-3.2, -1.05, PY - 3, PY, 0), z: 'ground' },
    { plan: chamferedRect(-3.2, -1.05, PY - 3, PY, 0), z: WALK + 3.6 },
  ])
  footedLoft(rock, ground, [
    { plan: chamferedRect(1.05, 3.2, PY - 3, PY, 0), z: 'ground' },
    { plan: chamferedRect(1.05, 3.2, PY - 3, PY, 0), z: WALK + 3.6 },
  ])
  box(rock, -3.2, 3.2, PY - 3, PY, WALK + 2.8, WALK + 3.6)
  footedLoft(rock, ground, [
    { plan: chamferedRect(-1.05, 1.05, PY - 3, PY, 0), z: 'ground' },
    { plan: chamferedRect(-1.05, 1.05, PY - 3, PY, 0), z: WALK - 0.4 },
  ])
  // The tunnel's mouth: a dark face set just inside the frame.
  box(dark, -1.05, 1.05, PY - 3, PY - 0.4, WALK - 0.4, WALK + 2.8)

  // South anchorage on the knob above the tunnel: a squat masonry block
  // the cables run into.
  footedLoft(rock, ground, [
    { plan: chamferedRect(-3, 3, S_ANCHOR[0] - 4, S_ANCHOR[0] + 1, 0.4), z: 'ground' },
    { plan: chamferedRect(-3, 3, S_ANCHOR[0] - 4, S_ANCHOR[0] + 1, 0.4), z: S_ANCHOR[1] + 1.2 },
  ])

  // North end: the abutment under the deck's end and the cable anchors.
  footedLoft(rock, ground, [
    { plan: chamferedRect(-1.6, 1.6, N_END - 3, N_END + 1, 0.3), z: 'ground' },
    { plan: chamferedRect(-1.6, 1.6, N_END - 3, N_END + 1, 0.3), z: WALK - 0.2 },
  ])
  for (const s of [-1, 1])
    footedLoft(rock, ground, [
      { plan: chamferedRect(s * CX - 0.9, s * CX + 0.9, N_ANCHOR[0] - 1, N_ANCHOR[0] + 1.5, 0.2), z: 'ground' },
      { plan: chamferedRect(s * CX - 0.9, s * CX + 0.9, N_ANCHOR[0] - 1, N_ANCHOR[0] + 1.5, 0.2), z: N_ANCHOR[1] + 0.6 },
    ])

  return { steel, web, deck, rock, dark }
}

const STEEL = finish('bridge-black', 0x4a4f57, 0.6)
const WEB = { ...finish('bridge-black-web', 0x4a4f57, 0.6), doubleSided: true }
const DECK = finish('deck-timber', 0x8d8172)
const ROCK = finish('schist-masonry', 0x8e6a5a)
const DARK = finish('tunnel', 0x3b3532)

const extras = {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin on the deck axis at midspan, on the river',
  bearing: 323.9, elevation: 0, walkway: WALK, topChord: TOP, ends: [S_END, N_END],
}

if (import.meta.main) {
  for (const [file, detail, maxTris, maxBytes] of [
    ['grand-canyon-kaibab-suspension-bridge.glb', false, 5000, 250 * 1024],
    ['grand-canyon-kaibab-suspension-bridge.detail.glb', true, 40000, 1536 * 1024],
  ] as const) {
    const m = build(detail)
    const list = [
      { part: m.steel, material: STEEL },
      { part: m.web, material: WEB },
      { part: m.deck, material: DECK },
      { part: m.rock, material: ROCK },
      { part: m.dark, material: DARK },
    ].filter(({ part }) => part.triangles > 0)
    const tris = list.reduce((s, { part }) => s + part.triangles, 0)
    if (tris > maxTris) throw new Error(`${file}: ${tris} triangles, over ${maxTris}`)
    const glb = writeGlb('Kaibab Suspension Bridge', list, extras)
    if (glb.length > maxBytes) throw new Error(`${file}: ${glb.length} bytes, over ${maxBytes}`)
    await Bun.write(new URL(`../models/${file}`, import.meta.url), glb)
    console.log(`${file}: ${tris} triangles, ${glb.length} bytes`)
  }
}
