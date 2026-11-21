/**
 * Navajo Bridge (1929; Arizona Highway Department, now a footbridge) over
 * Marble Canyon on the Colorado River — procedural, CC0-1.0, no textures.
 * bun generators/grand-canyon-navajo-bridge.ts
 *
 * A steel spandrel-braced deck arch: two arch ribs in vertical planes,
 * a straight top chord under the deck, a vertical at every panel point and
 * an X of diagonals in every panel between them, tall end posts standing on
 * concrete skewbacks at the top of the canyon's vertical walls, and short
 * girder approach spans on steel bents. Closed to cars since the parallel
 * road bridge opened in 1995, it carries only people, so its deck — the
 * walking surface, the lattice railings — is the model's (docs/reference.md,
 * Bridges).
 *
 * This file also exports `deckArch`, the arch kit the 1995 bridge beside it
 * (grand-canyon-navajo-bridge-new.ts) uses; merge this file first.
 *
 * Frame: x across (towards 209.9°, the side the new bridge is on), y along
 * the deck towards the south-east bank (bearing 119.9°, OSM way/172583850),
 * z up, metres. Origin at the catalog anchor (-111.63205, 36.81802), on the
 * footway's axis 82 m from its north-west end. z = 0 is the river, the
 * lowest ground under the footprint: the map terrain's water reading (grid
 * below, less 0.1 m).
 *
 * Sources:
 * - OSM (API, 2026-11-20): way/172583850 (highway=footway, bridge=yes,
 *   layer 1, name "Old Navajo Bridge", width 5.5, NRHP 81000134,
 *   Q6981625), 262 m long, from y = −82 to +180. No man_made=bridge outline
 *   and no building under the deck, so `replaces` is empty.
 * - Map terrain (tools/terrain.ts grid, Mapterhorn z15, 5 m, `GROUND`):
 *   the canyon's walls and the skewback ledges. The arch's feet are put
 *   where the walls stand at the springing height: y = −16.5 and +174.5.
 * - USGS NAIP (public domain): the deck's line and both ends agree with OSM
 *   within a couple of metres; the arch's feet show as bright steel at the
 *   top of the walls.
 * - Published (Wikipedia "Navajo Bridge"; NRHP nomination; HAER AZ-26):
 *   open-spandrel steel arch built 1927–29; 834 ft (254 m) long; arch span
 *   616 ft (188 m), rise 90 ft (27 m); 467 ft (142 m) above the river;
 *   18 ft (5.5 m) roadway.
 * - Photos (Wikimedia Commons, all EVIDENCE):
 *   - "Navajo Bridge, Coconino County, AZ, US.jpg", Jud McCranie,
 *     CC BY-SA 4.0 (along the downstream face from the east end: X-braced
 *     panels, the lattice railing, the arch springing from the wall top);
 *   - "Navajo bridge old span.jpg", Nicholas Hartmann, CC BY-SA 4.0 (the
 *     west end: approach bents, the end post on its skewback at the wall
 *     top, the arch's curve);
 *   - "Navajo Bridge from East.jpg", Sebastian Kasten, CC BY-SA 4.0 (both
 *     bridges side by side, end on).
 * - Measured from the map terrain: deck heights (the plateau at both ends,
 *   135.6 m at the west end falling to 134.6 m at the east, above the
 *   water); the springing height (103 m, where the walls are 190 m apart).
 * - Estimated from photos: rib spacing (6 m), rib depth (1.6 m), top chord
 *   depth (1.5 m), 16 panels, the bents' places, railing height (1.1 m).
 *
 * Doubts: the map's terrain puts the deck about 135 m over its water, a
 * little under the published 142 m (the published figure is probably to
 * low water or the bed); the rise from the terrain fit (29 m) is a little
 * over the published 27 m, and the span (191 m) a little over 188 m; the
 * approach on the east end is shorter than the published total implies,
 * since OSM and NAIP end the deck at the wall top there.
 *
 * Night: unlit.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { finish } from './palette'
import { band, face, footedLoft, chamferedRect, groundAt, stations, strip, type GroundGrid } from './bridge-kit'

/** An axis-aligned box, all six faces. */
export function box(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number) {
  const c = (x: number, y: number, z: number): V3 => [x, y, z]
  face(p, c(x0, y0, z0), c(x1, y0, z0), c(x1, y0, z1), c(x0, y0, z1), [0, -1, 0])
  face(p, c(x0, y1, z0), c(x1, y1, z0), c(x1, y1, z1), c(x0, y1, z1), [0, 1, 0])
  face(p, c(x0, y0, z0), c(x0, y1, z0), c(x0, y1, z1), c(x0, y0, z1), [-1, 0, 0])
  face(p, c(x1, y0, z0), c(x1, y1, z0), c(x1, y1, z1), c(x1, y0, z1), [1, 0, 0])
  face(p, c(x0, y0, z1), c(x1, y0, z1), c(x1, y1, z1), c(x0, y1, z1), [0, 0, 1])
  face(p, c(x0, y0, z0), c(x1, y0, z0), c(x1, y1, z0), c(x0, y1, z0), [0, 0, -1])
}

export type ArchSpec = {
  ground: (x: number, y: number) => number
  /** Arch centre along y, half span, springing and crown heights of the rib's centre line. */
  yc: number
  half: number
  spring: number
  crown: number
  /** Rib planes at ±rx. */
  rx: number
  ribD: number
  ribW: number
  /** Top of the steel (top chord) along y, and the chord's depth. */
  top: (y: number) => number
  topD: number
  panels: number
  /** 'x': an X of diagonals in every panel; 'n': one diagonal, falling towards midspan. */
  web: 'x' | 'n'
  /** Deck ends (abutments) and approach bents along y. */
  ends: [number, number]
  bents: number[]
  /** Half width of the abutments and skewbacks' outer faces. */
  outer: number
  endPostW: number
}

/** The steel and concrete of a spandrel-braced deck arch. */
export function deckArch(s: ArchSpec) {
  const steel = new Part(), web = new Part(), conc = new Part()
  const rib = (y: number) => {
    const t = (y - s.yc) / s.half
    return s.spring + (s.crown - s.spring) * (1 - t * t)
  }
  const y0 = s.yc - s.half, y1 = s.yc + s.half
  const curve = stations(y0, y1, 4)
  const chordBot = (y: number) => s.top(y) - s.topD
  const posts = stations(y0, y1, (y1 - y0) / s.panels)
  for (const side of [-1, 1]) {
    const x = side * s.rx, xa = x - s.ribW / 2, xb = x + s.ribW / 2
    // Arch rib.
    band(steel, xa, xb, curve, (y) => rib(y) + s.ribD / 2, (y) => rib(y) - s.ribD / 2)
    // Top chord / approach girder, end to end.
    band(steel, xa + 0.05, xb - 0.05, stations(s.ends[0], s.ends[1], 8), s.top, chordBot)
    // End posts on the skewbacks, and the panel verticals.
    for (let i = 0; i < posts.length; i++) {
      const y = posts[i]
      const end = i === 0 || i === posts.length - 1
      const w = end ? s.endPostW : 0.85
      const yy = end ? y + (i === 0 ? w / 2 - 0.3 : -w / 2 + 0.3) : y
      const zb = end ? s.spring - 0.4 : rib(y) + s.ribD / 2 - 0.1
      if (chordBot(y) - zb > 0.4) box(steel, xa + 0.05, xb - 0.05, yy - w / 2, yy + w / 2, zb, chordBot(y) + 0.05)
    }
    // Panel diagonals, flat strips in the rib plane.
    const n: V3 = [1, 0, 0]
    for (let i = 0; i < posts.length - 1; i++) {
      const ya = posts[i], yb = posts[i + 1]
      const lo = (y: number) => rib(y) + s.ribD / 2, hi = chordBot
      if (hi(ya) - lo(ya) < 1.2 && hi(yb) - lo(yb) < 1.2) continue
      const pairs: [V3, V3][] = []
      if (s.web === 'x') {
        pairs.push([[x, ya, lo(ya)], [x, yb, hi(yb)]], [[x, ya, hi(ya)], [x, yb, lo(yb)]])
      } else if ((ya + yb) / 2 < s.yc) pairs.push([[x, ya, hi(ya)], [x, yb, lo(yb)]])
      else pairs.push([[x, ya, lo(ya)], [x, yb, hi(yb)]])
      for (const [a, b] of pairs) strip(web, a, b, 0.7, n)
    }
  }
  // Lateral struts between the ribs at each panel point, at the arch.
  for (const y of posts.slice(1, -1)) box(steel, -s.rx, s.rx, y - 0.25, y + 0.25, rib(y) - 0.35, rib(y) + 0.35)
  // Lateral X bracing between the ribs, in the plane of the arch.
  for (let i = 0; i < posts.length - 1; i++) {
    const ya = posts[i], yb = posts[i + 1]
    for (const [a, b] of [[[-s.rx, ya], [s.rx, yb]], [[s.rx, ya], [-s.rx, yb]]] as [number, number][][]) {
      const za = rib(ya), zb = rib(yb)
      const pa: V3 = [a[0], a[1], za], pb: V3 = [b[0], b[1], zb]
      const up: V3 = [0, -(zb - za), yb - ya]
      strip(web, pa, pb, 0.35, up)
    }
  }
  // Skewbacks: concrete blocks on the wall tops under the feet.
  for (const [y, out] of [[y0, -1], [y1, 1]] as [number, number][]) {
    const ya = out < 0 ? y - 3.5 : y - 1, yb = out < 0 ? y + 1 : y + 3.5
    footedLoft(conc, s.ground, [
      { plan: chamferedRect(-s.outer, s.outer, ya, yb, 0.4), z: 'ground' },
      { plan: chamferedRect(-s.outer, s.outer, ya, yb, 0.4), z: s.spring - 0.4 },
    ])
  }
  // Approach bents: two columns under the girders, braced across.
  for (const y of s.bents) {
    const zt = chordBot(y)
    for (const side of [-1, 1]) {
      const x = side * s.rx
      footedLoft(steel, s.ground, [
        { plan: chamferedRect(x - 0.45, x + 0.45, y - 0.7, y + 0.7, 0), z: 'ground' },
        { plan: chamferedRect(x - 0.45, x + 0.45, y - 0.7, y + 0.7, 0), z: zt },
      ], 4)
    }
    const gz = Math.max(s.ground(-s.rx, y), s.ground(s.rx, y))
    if (zt - gz < 3) continue
    const levels = stations(gz + 1, zt - 0.6, 7)
    for (const z of levels.slice(1)) box(steel, -s.rx, s.rx, y - 0.25, y + 0.25, z - 0.3, z + 0.3)
    for (let i = 0; i < levels.length - 1; i++) {
      const za = levels[i], zb = levels[i + 1]
      strip(web, [-s.rx, y, za], [s.rx, y, zb], 0.35, [0, 1, 0])
      strip(web, [s.rx, y, za], [-s.rx, y, zb], 0.35, [0, 1, 0])
    }
  }
  // Abutments under the deck's ends.
  for (const [y, out] of [[s.ends[0], -1], [s.ends[1], 1]] as [number, number][]) {
    const ya = out < 0 ? y - 2 : y - 2.5, yb = out < 0 ? y + 2.5 : y + 2
    footedLoft(conc, s.ground, [
      { plan: chamferedRect(-s.outer, s.outer, ya, yb, 0.3), z: 'ground' },
      { plan: chamferedRect(-s.outer, s.outer, ya, yb, 0.3), z: chordBot(y) },
    ])
  }
  return { steel, web, conc, rib }
}

// Map terrain under the bridge (tools/terrain.ts grid -111.63205 36.81802 210 5
// --bearing 119.9), x −20..20, metres above 939.69 m; the water reads 0.1.
const GROUND: GroundGrid = {"y0":-210,"x0":-20,"step":5,"z":[[134.3,133.9,133.3,132.9,132.7,132.5,132.3,132.2,132.3],[134,133.4,132.9,132.5,132.3,132.1,132,132,132.1],[133.4,132.8,132.3,132,131.8,131.8,131.7,131.8,131.9],[132.5,131.9,131.6,131.4,131.4,131.4,131.5,131.6,131.8],[131.1,130.8,130.6,130.7,130.8,131,131.2,131.4,131.6],[129.3,129.2,129.4,129.8,130.2,130.6,130.9,131.3,131.6],[127.1,127.4,128.1,128.9,129.7,130.3,130.8,131.3,131.7],[125.3,126,127.1,128.3,129.4,130.2,130.9,131.5,132.1],[124.4,125.4,126.8,128.2,129.4,130.5,131.4,132.1,132.7],[124.3,125.7,127.2,128.8,130,131.2,132.1,132.8,133.3],[125,126.5,128.2,129.8,131.1,132.2,133,133.6,134],[126,127.7,129.5,131.1,132.2,133.2,133.9,134.3,134.7],[127.2,129.2,131,132.4,133.4,134.1,134.7,135,135.3],[128.6,130.8,132.5,133.6,134.3,134.8,135.2,135.6,135.9],[129.8,132,133.6,134.4,134.9,135.3,135.7,136,136.4],[130.6,132.8,134.2,134.9,135.3,135.7,136,136.4,136.7],[130.9,133,134.3,135,135.4,135.8,136.2,136.6,137],[130.6,132.6,134,134.9,135.4,135.9,136.4,136.8,137.2],[130,132.1,133.6,134.7,135.4,135.9,136.5,136.9,137.4],[129.6,131.6,133.3,134.5,135.4,136,136.6,137,137.4],[129.3,131.4,133.3,134.6,135.5,136.1,136.6,137.1,137.4],[129,131.4,133.3,134.6,135.5,136.1,136.6,137,137.4],[128.9,131.4,133.3,134.6,135.5,136.1,136.6,136.9,137.3],[128.7,131.3,133.3,134.6,135.5,136.1,136.5,136.8,137.1],[128.7,131.2,133.2,134.6,135.5,136,136.4,136.6,136.8],[128.7,131.2,133.3,134.6,135.5,135.9,136.2,136.4,136.4],[128.7,131.2,133.2,134.6,135.4,135.8,136,136,135.9],[128.6,131,133,134.4,135.1,135.5,135.6,135.5,135.3],[128.3,130.6,132.6,134,134.7,135,135,134.8,134.5],[128,130.2,132.1,133.3,133.9,134.1,134.1,133.8,133.5],[127.7,129.6,131.3,132.4,132.8,133,132.9,132.6,132.2],[127.3,129,130.3,131.2,131.6,131.6,131.5,131.2,130.9],[126.8,128.1,129.2,129.9,130.1,130.1,130,129.7,129.3],[126.1,127,127.7,128.3,128.5,128.5,128.3,128.1,127.7],[125.1,125.7,126.2,126.6,126.8,126.8,126.6,126.3,125.9],[123.8,124.2,124.6,124.9,125,125.1,124.9,124.5,124.1],[122,122.3,122.6,122.9,123,123,123,122.7,122.2],[119.1,119.4,119.6,119.8,119.6,119.3,119.5,119.4,118.9],[114.2,114.5,114.5,114.1,112.7,111.1,110.9,111.4,111.1],[106.8,106.7,106,104,99.5,94.8,94,95.6,95.5],[96.7,95.9,93.9,89.4,81.2,73.2,70.9,72.9,73.2],[84.7,83,79.6,73,63.6,55,51.4,52,52.3],[72.2,69.8,65.8,59.1,50.7,44.2,40.9,39.8,39.6],[60.1,57.7,54,48.6,42.6,37.9,35.1,33.6,32.8],[49,47,44.2,40.4,36.2,32.6,30.2,28.5,27.5],[39,37.6,35.5,32.9,29.9,27.2,25.1,23.6,22.6],[30,29.1,27.7,25.9,23.8,21.8,20.2,18.9,18.1],[22.2,21.7,20.7,19.5,18.1,16.7,15.5,14.4,13.6],[15.3,15.1,14.6,13.8,12.8,11.7,10.6,9.5,8.8],[9.2,9.3,9.1,8.6,7.7,6.8,6,5.1,4.4],[4.3,4.6,4.7,4.2,3.6,3,2.4,1.9,1.5],[1.4,1.7,1.8,1.5,1.2,0.9,0.7,0.4,0.3],[0.4,0.4,0.5,0.4,0.2,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.3,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.9,0.6,0.4,0.3,0.3,0.2,0.2,0.1,0.1],[2.4,1.7,1.3,1.1,1,1,0.7,0.4,0.3],[4.6,3.7,3,2.7,2.7,2.5,2,1.4,1],[7,6.3,5.7,5.3,5.2,4.8,4.2,3.3,2.6],[9.8,9.4,9,8.7,8.5,8.3,7.7,6.8,6],[15.3,14.8,14.4,14.4,14.3,14.1,13.6,13,12.2],[26.1,25.3,24.7,24.7,25.1,25,24.3,23.7,23],[44.3,43.1,41.3,40.6,41.1,41.4,40.7,39.7,39.4],[69.4,68.1,64.8,61.7,61.1,61.6,61,59.5,58.8],[96.5,95.3,90.8,85.9,83.8,83.9,83.6,81.7,79.9],[118.6,117.6,113.1,108.1,105.6,105.5,105.4,103.9,101.9],[130.1,130.1,127.5,123.9,122,121.9,122.1,121.2,119.7],[132.9,133.4,133,131.8,130.6,130.5,131,130.8,129.5],[133.2,133.4,133.6,133.6,133.4,133.2,133.5,133.6,132.9],[133.5,133.6,133.7,133.8,133.8,133.8,133.8,133.8,133.5],[134.1,134.1,134.2,134.3,134.3,134.3,134.2,134.1,133.8],[135,135,135.1,135.1,135.1,135.1,135,134.8,134.5],[136.2,136.1,136.1,136.1,136.1,136,135.8,135.6,135.2]]}
const ground = (x: number, y: number) => Math.max(0, groundAt(GROUND, x, y) - 0.1)

// Heights above the river (see the header).
const ENDS: [number, number] = [-82, 182]
const walk = (y: number) => 135.6 + ((134.6 - 135.6) * (y - ENDS[0])) / (ENDS[1] - ENDS[0])
const SLAB = 0.35
const HALF_W = 3.6 // deck half width, railing to railing
const RX = 3.0 // rib planes

function build() {
  const yc = 79, half = 95.5
  const arch = deckArch({
    ground, yc, half, spring: 103, crown: walk(yc) - SLAB - 1.5 - 0.3 - 0.8,
    rx: RX, ribD: 1.6, ribW: 0.8, top: (y) => walk(y) - SLAB, topD: 1.5, panels: 16, web: 'x',
    ends: ENDS, bents: [-38, -60], outer: HALF_W, endPostW: 1.4,
  })
  const deck = new Part(), rail = new Part()
  const ys = stations(ENDS[0], ENDS[1], 8)
  // The walkway: the old roadway's concrete slab, the model's own.
  band(deck, -HALF_W, HALF_W, ys, walk, (y) => walk(y) - SLAB)
  // Lattice railings, drawn as a light solid band on each edge.
  for (const s of [-1, 1]) band(rail, s * (HALF_W - 0.12), s * HALF_W, ys, (y) => walk(y) + 1.1, walk, { out: true, in: true, top: true, ends: true })
  return { ...arch, deck, rail }
}

const STEEL = finish('steel-grey', 0xc3c7c1, 0.6)
const WEB = { ...finish('steel-grey-web', 0xc3c7c1, 0.6), doubleSided: true }
const DECK = finish('deck-concrete', 0xcfc7ba)
const CONC = finish('concrete', 0xd8cdbd)
const RAIL = { ...finish('railing', 0xdadcd6, 0.6), doubleSided: true }

if (import.meta.main) {
  const m = build()
  const list = [
    { part: m.steel, material: STEEL },
    { part: m.web, material: WEB },
    { part: m.deck, material: DECK },
    { part: m.conc, material: CONC },
    { part: m.rail, material: RAIL },
  ].filter(({ part }) => part.triangles > 0)
  const tris = list.reduce((s, { part }) => s + part.triangles, 0)
  if (tris > 5000) throw new Error(`${tris} triangles, over 5000`)
  const glb = writeGlb('Navajo Bridge (1929)', list, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the anchor on the deck axis, on the river',
    bearing: 119.9, elevation: 0, walkway: [walk(ENDS[0]), walk(ENDS[1])], ends: ENDS,
  })
  if (glb.length > 250 * 1024) throw new Error(`${glb.length} bytes, over 250 KB`)
  await Bun.write(new URL('../models/grand-canyon-navajo-bridge.glb', import.meta.url), glb)
  console.log(`grand-canyon-navajo-bridge.glb: ${tris} triangles, ${glb.length} bytes`)
}
