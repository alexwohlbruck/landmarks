/**
 * Bright Angel Suspension Bridge ("Silver Bridge", 1966–70; National Park
 * Service, built to carry the Transcanyon Pipeline) over the Colorado River
 * below Phantom Ranch, Grand Canyon — procedural, CC0-1.0, no textures.
 * bun generators/grand-canyon-bright-angel-suspension-bridge.ts
 *
 * A footbridge, so the whole thing is the model's, walking surface included:
 * the narrow deck between two galvanised Warren-with-verticals side trusses
 * (about 1.4 m tall) with a slight camber, the black water pipe slung under
 * one side of it, the two slender lattice towers at the ends (two square
 * legs braced by struts and crossed diagonals), the main cables from tower
 * top to tower top sagging to the deck at midspan, the backstays to anchor
 * blocks behind the towers. Writes a low model (deck, trusses at half
 * density, towers with their struts and crosses, one cable a side, pipe,
 * anchors) and a detail model (trusses at full density, suspenders),
 * detailZoom 16.
 *
 * Frame: x across (towards 100.9°), y along the deck towards the north bank
 * (bearing 10.9°, the OSM footway way/39703740), z up, metres; origin on the
 * footway at its midpoint. z = 0 is where the map stands the model, the
 * lowest ground under the footprint: the river, 738.5 m on Mapterhorn
 * (the lidar water reads 738.1 m, so z = lidar − 738.5).
 *
 * Sources:
 * - OSM (API, 2026-11-20): way/39703740 (highway=footway, bridge=yes,
 *   layer 1, alt_name Silver Bridge, Q75610697), 153 m long. No man_made=
 *   bridge outline and no building in the footprint: `replaces` is empty.
 * - Lidar, USGS 3DEP AZ_GrandCanyonNP_1_2019 (flown 2019), 1 m grid, read
 *   along the deck (tools/lidar_frame.py): truss top 14.3 m above the
 *   lidar water at midspan, 13.1 m at both ends (y = ±78), so a camber of
 *   about 1.2 m; the south tower at y = −81, legs about 5 m apart, top
 *   29.0 m. The north tower's top is missing from the point cloud (only a
 *   strut at 16.7 m shows), so it is drawn as the south one's twin, as the
 *   photos show.
 * - Map terrain (tools/terrain.ts grid, 5 m, `GROUND`): tower feet and
 *   anchors run down to it vertex by vertex.
 * - Published (NPS; Wikipedia "Silver Bridge (Arizona)"): built 1966,
 *   opened 1970, carries the Transcanyon Pipeline under its deck; open
 *   steel-grating deck, hikers only.
 * - Photos (Wikimedia Commons, all EVIDENCE):
 *   - "Silver Bridge Grand Canyon.JPG", Fredlyfish4, CC BY-SA 3.0 (the
 *     whole elevation, a tower close up: two legs, struts, crossed
 *     diagonals, the backstays);
 *   - "Silver Bridge - Grand Canyon National Park - 4706", Grand Canyon
 *     National Park, CC BY 2.0 (on the bank by the deck: the truss, the
 *     pipe hung under the deck, the far tower);
 *   - "Grand Canyon National Park - Silver Bridge 1277", Grand Canyon
 *     National Park, CC BY 2.0 (from upstream: the camber, the cables).
 * - Estimated from photos: the truss depth (1.4 m) and panel length
 *   (2.4 m); the towers' strut levels and leg size; the cable's low point
 *   (just over the top chord at midspan); the backstay anchors' place.
 * - Drawn bolder than real (STYLE.md, Bridges): cables 0.24 m, suspenders
 *   0.12 m at half density, tower lattice legs as solid 0.7 m posts.
 * - Left out: the storm cables under the deck, the chain-link mesh on the
 *   railings, the splayed feet of the tower legs.
 *
 * Doubts: the north tower's height (assumed equal to the south one's); the
 * backstay anchor positions.
 *
 * Night: unlit.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { finish } from './palette'
import { band, chamferedRect, footedLoft, groundAt, stations, truss, tube, type GroundGrid } from './bridge-kit'

const GROUND: GroundGrid = {"y0":-90.0,"x0":-15.0,"step":5.0,"z":[[10.3,15.2,27.7,31.9,27.4,17.1,12.3],[6.0,8.5,15.3,22.8,19.9,12.1,9.8],[5.3,6.7,9.1,11.5,12.3,8.0,6.1],[4.8,5.2,6.0,6.9,5.1,4.0,3.8],[4.6,4.4,4.1,3.6,3.0,3.1,2.8],[4.8,4.3,3.7,2.9,2.1,2.1,2.0],[4.3,3.9,3.1,2.3,1.7,1.4,1.4],[3.5,3.1,2.0,1.2,1.0,1.0,1.0],[2.8,2.0,1.0,1.0,1.0,1.0,1.0],[2.1,1.0,1.0,1.0,1.0,1.0,1.0],[1.2,1.0,1.0,1.0,1.0,1.0,1.0],[1.0,1.0,1.0,1.0,1.0,1.0,1.0],[1.0,1.0,1.0,1.0,1.0,1.0,1.0],[1.0,1.0,1.0,1.0,1.0,1.0,1.0],[1.0,1.0,1.0,1.0,1.0,1.0,1.0],[1.0,1.0,1.0,1.0,1.0,1.0,1.0],[1.0,1.0,1.0,1.0,1.0,1.0,1.0],[1.0,1.0,1.0,1.0,1.0,1.0,1.0],[1.0,1.0,1.0,1.0,1.0,1.0,1.0],[1.0,1.0,1.0,1.0,1.0,1.0,1.0],[1.0,1.0,1.0,1.0,1.0,1.0,1.0],[1.0,1.0,1.0,1.0,1.0,1.0,1.0],[1.0,1.0,1.0,1.0,1.0,1.0,1.0],[1.0,1.0,1.0,1.0,1.0,1.0,1.0],[0.9,1.0,1.0,1.0,1.0,1.0,1.0],[0.9,1.0,1.0,1.0,1.0,1.0,1.0],[0.9,0.9,1.0,1.0,1.0,1.0,1.0],[0.9,1.0,1.1,1.1,1.0,1.0,1.0],[1.7,1.8,1.8,1.8,1.8,1.9,1.8],[2.1,2.1,2.2,2.3,2.4,2.4,2.5],[2.6,2.8,3.0,3.1,3.0,3.1,3.1],[3.7,3.3,3.1,3.4,3.3,3.4,3.4],[6.3,5.6,6.5,6.3,5.5,4.8,4.1],[10.4,8.5,9.5,10.1,9.2,7.9,6.8],[13.6,11.3,11.3,11.6,10.8,9.7,9.6],[15.7,14.4,13.8,12.7,12.0,11.2,10.3],[17.8,16.8,16.1,15.4,14.1,13.1,11.9]]}
// The grid is above 737.5 m; the model's z = 0 is 738.5 m.
const ground = (x: number, y: number) => Math.max(0, groundAt(GROUND, x, y) - 1.0)

const LIDAR = -0.4 // lidar heights (above 738.1 m) to the model's
const T = 81 // towers at y = ±T
const END = 79 // deck ends
const TOP_MID = 14.3 + LIDAR, TOP_END = 13.1 + LIDAR
const top = (y: number) => TOP_MID - (TOP_MID - TOP_END) * (y / END) ** 2 // top chord, cambered
const TRUSS = 1.4
const walk = (y: number) => top(y) - TRUSS + 0.15
const TX = 0.85 // truss planes
const CX = 1.3 // cable planes
const TOWER_TOP = 29.0 + LIDAR
const LEG = 2.4 // tower legs at x = ±LEG
const cableZ = (y: number) => top(0) + 0.3 + (TOWER_TOP - 0.4 - top(0) - 0.3) * (y / T) ** 2
const ANCHOR = 96 // backstay anchors at y = ±ANCHOR

const box = (p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number) => {
  const r: [number, number][] = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
  const lo = r.map(([x, y]) => [x, y, z0] as V3), hi = r.map(([x, y]) => [x, y, z1] as V3)
  p.loft([lo, hi])
  p.cap(hi, true)
  p.cap(lo, false)
}

function build(detail: boolean) {
  const steel = new Part(), web = new Part(), deck = new Part(), pipe = new Part(), conc = new Part()

  // Walking surface (open grating, drawn solid) and the side trusses.
  const ys = stations(-END, END, 6)
  band(deck, -TX + 0.08, TX - 0.08, ys, walk, (y) => walk(y) - 0.12)
  const panels = stations(-END, END, detail ? 2.4 : 4.8)
  for (const s of [-1, 1])
    truss(steel, web, s * TX, panels, top, (y) => top(y) - TRUSS, {
      chordW: 0.2, topD: 0.18, botD: 0.25, member: detail ? 0.1 : 0.18, post: detail ? 0.12 : 0.2, flip: s > 0, curve: ys,
    })
  // Floor beams out to the suspender planes.
  for (const y of stations(-END + 2, END - 2, detail ? 4.8 : 9.6))
    box(steel, -CX - 0.1, CX + 0.1, y - 0.1, y + 0.1, top(y) - TRUSS - 0.25, top(y) - TRUSS)

  // The pipeline, hung under the deck on its west (−x) side.
  tube(pipe, stations(-END - 1, END + 1, 6).map((y) => [-0.45, y, top(y) - TRUSS - 0.55] as V3), 0.22, 6)

  // Towers: two legs, struts at three levels and the top, crossed
  // diagonals between, on concrete pedestals footed on the bank.
  for (const ty of [-T, T]) {
    const g = Math.min(ground(-LEG, ty), ground(LEG, ty))
    for (const s of [-1, 1]) {
      const x = s * LEG
      footedLoft(conc, ground, [
        { plan: chamferedRect(x - 0.7, x + 0.7, ty - 0.7, ty + 0.7, 0.15), z: 'ground' },
        { plan: chamferedRect(x - 0.7, x + 0.7, ty - 0.7, ty + 0.7, 0.15), z: ground(x, ty) + 0.8 },
      ])
      box(steel, x - 0.35, x + 0.35, ty - 0.35, ty + 0.35, ground(x, ty) + 0.8, TOWER_TOP)
    }
    const levels = [top(END) - TRUSS - 0.3, top(END) + 3.5, top(END) + 8.5, TOWER_TOP - 0.5]
    for (const z of levels) box(steel, -LEG, LEG, ty - 0.18, ty + 0.18, z - 0.25, z + 0.25)
    for (let i = 1; i < levels.length; i++) {
      const z0 = levels[i - 1] + 0.25, z1 = levels[i] - 0.25
      tube(web, [[-LEG, ty, z0], [LEG, ty, z1]], detail ? 0.09 : 0.14, 4)
      tube(web, [[LEG, ty, z0], [-LEG, ty, z1]], detail ? 0.09 : 0.14, 4)
    }
    // Below the deck, a cross down to the pedestals.
    const zb = g + 0.8
    if (levels[0] - zb > 2) {
      tube(web, [[-LEG, ty, zb], [LEG, ty, levels[0] - 0.25]], detail ? 0.09 : 0.14, 4)
      tube(web, [[LEG, ty, zb], [-LEG, ty, levels[0] - 0.25]], detail ? 0.09 : 0.14, 4)
    }
  }

  // Main cables, saddled on the tower tops, and the backstays.
  for (const s of [-1, 1]) {
    const x = s * CX
    const main = stations(-T, T, 4).map((y) => [x + (s * (LEG - CX) * (y / T) ** 8), y, cableZ(y)] as V3)
    tube(steel, main, detail ? 0.1 : 0.12, 5)
    for (const e of [-1, 1]) {
      const ay = e * ANCHOR, az = ground(s * LEG, ay) + 1.2
      tube(steel, [[s * LEG, e * T, TOWER_TOP - 0.4], [s * LEG, ay, az]], detail ? 0.1 : 0.12, 5)
      footedLoft(conc, ground, [
        { plan: chamferedRect(s * LEG - 1, s * LEG + 1, ay - 1.2, ay + 1.2, 0.2), z: 'ground' },
        { plan: chamferedRect(s * LEG - 1, s * LEG + 1, ay - 1.2, ay + 1.2, 0.2), z: az + 0.3 },
      ])
    }
  }

  // Suspenders, detail only, at every second panel point.
  if (detail)
    for (const y of stations(-END + 2, END - 2, 4.8)) {
      const z0 = top(y) - TRUSS - 0.25, z1 = cableZ(y)
      if (z1 - z0 < 0.8) continue
      for (const s of [-1, 1]) tube(web, [[s * CX, y, z0], [s * CX, y, z1]], 0.06, 3)
    }

  return { steel, web, deck, pipe, conc }
}

const STEEL = finish('galvanised-steel', 0x9ea4a6, 0.55)
const WEB = { ...finish('galvanised-steel-web', 0x9ea4a6, 0.55), doubleSided: true }
const DECK = finish('steel-grating', 0x8b9092)
const PIPE = finish('pipeline', 0x4a4f57, 0.6)
const CONC = finish('concrete', 0xc9bfb0)

const extras = {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin on the deck axis at midspan, on the river',
  bearing: 10.9, elevation: 0, walkwayMidspan: walk(0), walkwayEnds: walk(END), towers: [-T, T], towerTop: TOWER_TOP,
}

if (import.meta.main) {
  for (const [file, detail, maxTris, maxBytes] of [
    ['grand-canyon-bright-angel-suspension-bridge.glb', false, 5000, 250 * 1024],
    ['grand-canyon-bright-angel-suspension-bridge.detail.glb', true, 40000, 1536 * 1024],
  ] as const) {
    const m = build(detail)
    const list = [
      { part: m.steel, material: STEEL },
      { part: m.web, material: WEB },
      { part: m.deck, material: DECK },
      { part: m.pipe, material: PIPE },
      { part: m.conc, material: CONC },
    ].filter(({ part }) => part.triangles > 0)
    const tris = list.reduce((s, { part }) => s + part.triangles, 0)
    if (tris > maxTris) throw new Error(`${file}: ${tris} triangles, over ${maxTris}`)
    const glb = writeGlb('Bright Angel Suspension Bridge', list, extras)
    if (glb.length > maxBytes) throw new Error(`${file}: ${glb.length} bytes, over ${maxBytes}`)
    await Bun.write(new URL(`../models/${file}`, import.meta.url), glb)
    console.log(`${file}: ${tris} triangles, ${glb.length} bytes`)
  }
}
