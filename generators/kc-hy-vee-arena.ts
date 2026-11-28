/**
 * Hy-Vee Arena (Kemper Arena), Kansas City, Missouri (1974; Helmut Jahn of
 * C.F. Murphy Associates; glass east lobby 1997) — procedural, CC0-1.0.
 * bun generators/kc-hy-vee-arena.ts
 *
 * The arena box hung from three white tubular steel space-frame trusses
 * that span it east–west outside the roof: two outer trusses at a constant
 * depth, and the centre one, longer, raised over both ends and dipping to
 * the outer ones' level over the middle. Each truss is triangular in
 * section, one top chord over two bottom chords 16 m apart, laced as a
 * Warren truss on all three faces, and stands at each end on a tripod: a
 * front leg under the top chord's end and two legs under the bottom
 * chords'. The box: a white rounded rectangle, its upper band of panels
 * overhanging a lower wall, on the grass berm; the 1997 glass lobby on the
 * east end, a curved glass wall leaning back from a wider base under a
 * taller curved band. No field, no berm (the map's terrain has it).
 *
 * Frame: x east, y north, z up, metres; origin at the OSM outline's
 * centroid (-94.6057874, 39.0917714), bearing 0 (the trusses run due east–
 * west in the lidar). z = 0 is 229.7 m NAVD88, the lowest ground under the
 * footprint (the east tower's foot; Mapterhorn 229.76); the berm under the
 * box stands at 4.4 (lidar 234.1). elevation 0.
 *
 * Sources
 * - OSM (© OpenStreetMap contributors): way/318617359 (building=yes,
 *   leisure=stadium, old_name Kemper Arena, Q1489399): the box, the curved
 *   east lobby (base reaching x = 62), and the tripods' footprints as
 *   points: the centre truss's at x = ±76 (front) and ±67.5 (side legs, y =
 *   ±8.7), the outer ones' at x = ±59 and ±50.
 * - Lidar (measured; USGS 3DEP MO_FEMANRCS_1_2020, flown 2020; heights
 *   here = lidar - 229.7): box roof 23.7 over x -50..42, y -65.5..65.5; the
 *   lobby's upper band roof 32.1 over x 40..54, y -34..34; outer trusses
 *   centred y = ±48, top chord 33.9, bottom chords 25.5 at y = ±40 and ±56;
 *   centre truss bottom chords 25.6 and top 34.0 over |x| < 20, rising to
 *   34.0 and 42.5 by |x| = 38 and level from there to the ends.
 * - Map terrain: Mapterhorn z15 (tools/terrain.ts grid): the berm at
 *   4.4-4.6 over x -60..55, y -70..70, falling to 0.5-1.5 at the streets
 *   around; the tripods' feet stand at its foot.
 *
 * Photos (evidence, Wikimedia Commons)
 * - Conman33, "Hy-Vee Arena 2022.jpg", CC BY-SA 4.0 (the north side from the
 *   north-east: the upper band 10.5 m over a 9 m lower wall, scaled to the
 *   lidar; the glass lobby; the trusses' Warren lacing):
 *   https://commons.wikimedia.org/wiki/File:Hy-Vee_Arena_2022.jpg
 * - GorianEmpathy, "Kemper Arena 11-22-14.jpg", CC BY-SA 4.0 (the east end
 *   head-on: the three tripods, the centre one highest, the glass wall
 *   narrowing upward, the lobby band 8 m deep over glass 20 m high):
 *   https://commons.wikimedia.org/wiki/File:Kemper_Arena_11-22-14.jpg
 * - Americasroof, "Kemper-arena1.jpg", CC BY-SA 2.5 (from Quality Hill,
 *   2006: the centre truss stepping up over the east end):
 *   https://commons.wikimedia.org/wiki/File:Kemper-arena1.jpg
 * - Garrett Fuller, "Kemper Arena.JPG", CC BY-SA 4.0 (close: the tubes'
 *   size, about 1.5 m for chords and legs; the glass's lean):
 *   https://commons.wikimedia.org/wiki/File:Kemper_Arena.JPG
 *
 * Numbers
 * - Measured (lidar, OSM): every height and extent above.
 * - Estimated (photos, scaled by the lidar): the upper band from 13.2 m,
 *   overhanging the lower wall by 3 m; chords 1.7 m, legs 2 m and webs 1 m across
 *   (drawn as 6- and 4-sided tubes); 8 m Warren panels; the tripods' ties at
 *   13 m; the glass leaning from x = 62 at the base to 54 at 24.2 m.
 * * - Colours (daylight photos): white steel and panels; teal-grey glass;
 *   the roof in the palette's roof grey (estimated: half the lidar cells on
 *   the roof have no return, the dropout of a dark membrane; no aerial was
 *   reachable).
 *
 * Night: the lobby glass is a window (it glows); the rest is unlit.
 *
 * Doubts
 * - The trusses' lacing is simplified: one Warren zig-zag per face at 8 m
 *   panels; the real webs differ face to face (some panels have posts).
 * - The tripods' bracing is reduced to one ring of ties and two braces; each
 *   leg stands on a 3 m footing 0.8 m out of the map's ground there (berm
 *   slope, Mapterhorn), not evidenced in detail.
 * - The roof's colour rests on the lidar dropouts only; roof-top plant is not drawn.
 * - The west end is drawn plain; no photo shows it closely.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { groundAt, piecewise, rod, stations, type GroundGrid } from './bridge-kit'
import { box, countParts, loftSolid, one } from './sf-golden-gate-bridge'
import { finish, PALETTE } from './palette'

type Kit = { steel: Part; wall: Part; roof: Part; glass: Part; door: Part }
const k: Kit = { steel: new Part(), wall: new Part(), roof: new Part(), glass: new Part(), door: new Part() }

// ---- Box ---------------------------------------------------------------------------

const BX0 = -50, BX1 = 42, BY = 65.5, R = 8
const ROOF = 23.7, BAND = 13.2, SET = 3

/** A rounded rectangle, CCW from above, inset by d, at height z. */
function rrect(d: number, z: number): V3[] {
  const out: V3[] = []
  const r = R - d * 0.5
  const cs: [number, number, number][] = [[BX1 - d - r, -BY + d + r, -90], [BX1 - d - r, BY - d - r, 0], [BX0 + d + r, BY - d - r, 90], [BX0 + d + r, -BY + d + r, 180]]
  for (const [cx, cy, a0] of cs)
    for (let i = 0; i <= 3; i++) {
      const a = ((a0 + i * 30) * Math.PI) / 180
      out.push([cx + r * Math.cos(a), cy + r * Math.sin(a), z])
    }
  return out
}

function arenaBox() {
  const W = one(k.wall)
  // lower wall, set back under the band
  loftSolid(W, [rrect(SET, 0), rrect(SET, BAND)], [false, false])
  // the band's soffit, then the band itself with a small bevel at the top
  loftSolid(W, [rrect(SET, BAND), rrect(0, BAND), rrect(0, ROOF - 0.4), rrect(0.4, ROOF)], [false, false])
  // the roof
  const top = rrect(0.4, ROOF)
  for (let i = 1; i < top.length - 1; i++) k.roof.tri(top[0], top[i], top[i + 1])
  // entrance doors on the long sides, on the berm, and the west end
  for (const x of [-30, -6, 18]) for (const s of [-1, 1]) {
    const y = s * (BY - SET + 0.05)
    k.door.quad(...(s > 0
      ? [[x + 4, y, 4.4], [x - 4, y, 4.4], [x - 4, y, 7.4], [x + 4, y, 7.4]]
      : [[x - 4, y, 4.4], [x + 4, y, 4.4], [x + 4, y, 7.4], [x - 4, y, 7.4]]) as [V3, V3, V3, V3])
  }
}

// ---- East lobby ----------------------------------------------------------------------

const LOBBY_GLASS_TOP = 24.2, LOBBY_TOP = 32.1
/** The lobby's curved face as an elliptical arc from the box (x0) out to xm at y = 0, ±Y wide. */
function arc(x0: number, xm: number, Y: number, z: number, n = 10): V3[] {
  return Array.from({ length: n + 1 }, (_, i) => {
    const t = -Math.PI / 2 + (Math.PI * i) / n
    return [x0 + (xm - x0) * Math.cos(t), Y * Math.sin(t), z] as V3
  })
}

function lobby() {
  const base = arc(BX1 - 2, 62, 36, 0), head = arc(BX1 - 2, 54, 34, LOBBY_GLASS_TOP)
  // the glass, leaning back from its granite base to the band
  const foot = base.map((b, i) => b.map((v, j) => v + (head[i][j] - v) * (4.6 / LOBBY_GLASS_TOP)) as V3)
  for (let i = 0; i + 1 < base.length; i++) k.glass.quad(foot[i], foot[i + 1], head[i + 1], head[i])
  // the band over it, its roof, and a white mullion every other bay
  const hi = arc(BX1 - 2, 54, 34, LOBBY_TOP)
  for (let i = 0; i + 1 < head.length; i++) k.wall.quad(head[i], head[i + 1], hi[i + 1], hi[i])
  for (let i = 1; i < hi.length - 1; i++) k.roof.tri(hi[0], hi[i], hi[i + 1])
  // its back, above the box roof
  k.wall.quad(hi[0], hi[hi.length - 1], [hi[hi.length - 1][0], hi[hi.length - 1][1], ROOF], [hi[0][0], hi[0][1], ROOF])
  for (let i = 2; i < base.length - 1; i += 2) rod(k.steel, foot[i], head[i], 0.25, 3)
  // the granite base under the glass's foot
  for (let i = 0; i + 1 < base.length; i++) k.wall.quad(base[i], base[i + 1], foot[i + 1], foot[i])
}

// ---- Trusses ---------------------------------------------------------------------------

// Map ground (Mapterhorn z15 - 229.7), 5 m apart, for the tripods' feet on the berm's slopes.
const GROUND: GroundGrid = { y0: -90, x0: -90, step: 5, z: [
  [0.9, 0.8, 0.8, 0.7, 0.7, 0.7, 0.6, 0.6, 0.5, 0.5, 0.4, 0.3, 0.3, 0.2, 0.2, 0.1, 0.2, 0.3, 0.2, 0.2, 0.2, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.2, 0.2, 0.2, 0.1, -0.0, -0.1, -0.2, -0.4, -0.4, -0.4], [1.1, 0.9, 0.8, 0.7, 0.7, 0.7, 0.8, 0.9, 0.7, 0.6, 1.1, 0.7, 0.9, 0.9, 0.8, 0.8, 0.8, 1.0, 1.0, 0.9, 1.1, 1.1, 1.1, 1.2, 1.2, 1.3, 1.2, 0.9, 0.6, 0.3, 0.2, 0.1, -0.0, -0.1, -0.2, -0.2, -0.2], [1.1, 1.0, 0.8, 0.7, 0.7, 0.8, 1.6, 2.2, 1.7, 1.1, 1.6, 1.9, 2.7, 2.7, 2.7, 2.8, 2.9, 3.0, 2.9, 2.6, 2.7, 2.3, 2.3, 3.1, 3.3, 3.3, 3.1, 2.7, 1.9, 0.7, 0.3, 0.1, 0.1, -0.0, -0.1, -0.1, -0.2],
  [1.2, 1.0, 0.8, 0.7, 0.8, 1.4, 2.8, 3.9, 3.6, 2.9, 2.9, 3.7, 4.3, 4.4, 4.3, 4.4, 4.5, 4.5, 4.5, 4.5, 4.5, 4.4, 4.5, 4.4, 4.3, 4.3, 4.3, 4.3, 3.5, 2.3, 1.0, 0.4, 0.2, -0.0, -0.1, -0.0, -0.1], [1.1, 0.8, 0.7, 0.9, 1.6, 2.8, 4.0, 4.4, 4.4, 4.4, 4.4, 4.5, 4.5, 4.5, 4.4, 4.4, 4.5, 4.5, 4.5, 4.4, 4.4, 4.5, 4.5, 4.5, 4.4, 4.4, 4.4, 4.3, 4.3, 3.8, 2.1, 0.8, 0.2, 0.1, -0.0, -0.0, -0.0], [1.0, 0.7, 0.7, 1.5, 2.8, 4.0, 4.4, 4.4, 4.4, 4.4, 4.5, 4.5, 4.5, 4.6, 4.5, 4.6, 4.6, 4.7, 4.6, 4.6, 4.6, 4.6, 4.6, 4.5, 4.4, 4.5, 4.4, 4.4, 4.3, 4.3, 3.2, 1.4, 0.4, 0.1, -0.0, -0.0, -0.1],
  [0.8, 0.7, 0.8, 2.0, 3.5, 4.3, 4.4, 4.4, 4.5, 4.5, 4.5, 4.6, 4.6, 4.7, 4.7, 4.7, 4.7, 4.7, 4.7, 4.7, 4.7, 4.7, 4.6, 4.6, 4.6, 4.5, 4.5, 4.4, 4.3, 4.3, 3.9, 1.9, 0.6, 0.2, -0.0, -0.0, -0.1], [0.7, 0.6, 1.0, 2.3, 3.7, 4.1, 4.3, 4.5, 4.5, 4.6, 4.5, 4.6, 4.7, 4.7, 4.7, 4.8, 4.7, 4.7, 4.7, 4.7, 4.7, 4.7, 4.7, 4.6, 4.6, 4.5, 4.5, 4.5, 4.3, 4.2, 3.8, 2.3, 0.8, 0.2, 0.1, -0.0, -0.0], [0.7, 0.6, 1.1, 2.3, 3.5, 3.8, 4.4, 4.5, 4.5, 4.6, 4.6, 4.7, 4.7, 4.7, 4.8, 4.7, 4.7, 4.7, 4.7, 4.7, 4.7, 4.7, 4.7, 4.7, 4.6, 4.5, 4.5, 4.5, 4.4, 4.3, 3.7, 2.3, 0.8, 0.2, 0.1, 0.1, -0.0],
  [0.6, 0.6, 1.1, 2.4, 3.2, 3.5, 4.5, 4.5, 4.5, 4.6, 4.7, 4.8, 4.7, 4.8, 4.7, 4.7, 4.7, 4.7, 4.7, 4.7, 4.7, 4.7, 4.7, 4.7, 4.7, 4.6, 4.6, 4.5, 4.5, 4.4, 3.7, 2.4, 0.8, 0.2, 0.1, 0.1, -0.0], [0.6, 0.6, 1.1, 2.2, 2.9, 3.5, 4.5, 4.5, 4.5, 4.7, 4.8, 4.8, 4.8, 4.7, 4.7, 4.7, 4.7, 4.7, 4.7, 4.7, 4.7, 4.7, 4.7, 4.7, 4.7, 4.7, 4.7, 4.5, 4.5, 4.4, 3.7, 2.4, 0.9, 0.2, 0.1, 0.1, -0.0], [0.7, 0.6, 1.0, 2.1, 2.5, 3.3, 4.4, 4.5, 4.5, 4.8, 4.8, 4.8, 4.7, 4.7, 4.7, 4.7, 4.7, 4.7, 4.7, 4.7, 4.7, 4.7, 4.7, 4.7, 4.7, 4.7, 4.6, 4.6, 4.6, 4.5, 3.7, 2.4, 0.9, 0.3, 0.1, 0.1, -0.0],
  [0.8, 0.6, 1.0, 1.9, 2.2, 3.2, 4.3, 4.4, 4.6, 4.8, 4.8, 4.7, 4.7, 4.7, 4.7, 4.7, 4.7, 4.7, 4.7, 4.7, 4.7, 4.7, 4.7, 4.7, 4.7, 4.6, 4.6, 4.5, 4.2, 4.3, 3.8, 2.4, 1.0, 0.2, 0.1, 0.1, -0.0], [0.8, 0.6, 0.9, 1.6, 1.8, 3.0, 4.3, 4.4, 4.7, 4.8, 4.7, 4.7, 4.7, 4.7, 4.7, 4.7, 4.7, 4.7, 4.7, 4.7, 4.7, 4.7, 4.7, 4.7, 4.6, 4.6, 4.6, 4.5, 4.0, 3.8, 3.7, 2.4, 0.9, 0.3, 0.1, 0.1, -0.0], [0.8, 0.6, 0.9, 1.3, 1.7, 3.0, 4.3, 4.4, 4.6, 4.7, 4.7, 4.8, 4.8, 4.8, 4.8, 4.8, 4.8, 4.7, 4.7, 4.7, 4.7, 4.7, 4.7, 4.7, 4.6, 4.6, 4.6, 4.5, 4.1, 3.5, 3.4, 2.2, 0.8, 0.2, 0.1, 0.1, -0.0],
  [0.8, 0.6, 0.8, 1.0, 1.5, 2.9, 4.3, 4.4, 4.7, 4.8, 4.8, 4.8, 4.8, 4.8, 4.8, 4.8, 4.8, 4.7, 4.7, 4.7, 4.7, 4.7, 4.7, 4.7, 4.6, 4.6, 4.6, 4.6, 4.1, 3.6, 3.0, 1.8, 0.6, 0.2, 0.1, 0.1, -0.0], [0.8, 0.6, 0.7, 0.8, 1.4, 2.8, 4.3, 4.4, 4.7, 4.8, 4.8, 4.8, 4.8, 4.8, 4.8, 4.8, 4.8, 4.7, 4.7, 4.7, 4.7, 4.7, 4.7, 4.7, 4.6, 4.6, 4.6, 4.6, 4.1, 3.6, 3.1, 1.9, 0.6, 0.2, 0.1, 0.2, 0.1], [0.9, 0.7, 0.7, 0.9, 1.4, 2.8, 4.3, 4.5, 4.7, 4.9, 4.8, 4.8, 4.8, 4.8, 4.8, 4.8, 4.7, 4.7, 4.7, 4.7, 4.7, 4.7, 4.7, 4.6, 4.6, 4.6, 4.6, 4.6, 4.2, 3.6, 3.2, 1.9, 0.7, 0.2, 0.1, 0.2, 0.1],
  [0.9, 0.7, 0.7, 1.3, 1.4, 2.7, 4.4, 4.5, 4.7, 4.9, 4.8, 4.8, 4.8, 4.8, 4.8, 4.8, 4.7, 4.7, 4.7, 4.7, 4.7, 4.7, 4.7, 4.6, 4.6, 4.6, 4.6, 4.6, 4.2, 3.7, 3.3, 2.0, 0.7, 0.2, 0.1, 0.2, 0.1], [0.9, 0.7, 0.7, 1.1, 1.3, 2.6, 4.4, 4.5, 4.7, 4.8, 4.8, 4.8, 4.8, 4.8, 4.8, 4.8, 4.7, 4.7, 4.7, 4.7, 4.7, 4.7, 4.6, 4.6, 4.6, 4.6, 4.6, 4.6, 4.2, 3.7, 3.5, 2.0, 0.7, 0.2, 0.1, 0.1, -0.0], [0.9, 0.7, 0.7, 0.9, 1.3, 2.5, 4.3, 4.5, 4.6, 4.8, 4.8, 4.8, 4.8, 4.8, 4.8, 4.7, 4.7, 4.7, 4.7, 4.7, 4.7, 4.7, 4.6, 4.6, 4.6, 4.6, 4.6, 4.6, 4.2, 3.8, 3.6, 2.0, 0.6, 0.2, 0.1, 0.1, -0.0],
  [0.9, 0.7, 0.7, 0.8, 1.3, 2.7, 4.2, 4.4, 4.6, 4.8, 4.8, 4.8, 4.8, 4.8, 4.8, 4.8, 4.7, 4.7, 4.7, 4.7, 4.7, 4.7, 4.6, 4.6, 4.6, 4.6, 4.6, 4.5, 4.3, 4.0, 3.8, 2.4, 1.0, 0.3, 0.1, 0.1, -0.0], [0.8, 0.7, 0.7, 1.1, 1.4, 2.7, 4.2, 4.4, 4.6, 4.7, 4.7, 4.7, 4.7, 4.7, 4.7, 4.7, 4.7, 4.7, 4.7, 4.7, 4.7, 4.6, 4.6, 4.6, 4.6, 4.6, 4.6, 4.5, 4.3, 4.1, 3.9, 2.7, 1.3, 0.4, 0.1, 0.1, -0.0], [0.8, 0.6, 0.7, 1.3, 1.6, 2.5, 4.1, 4.4, 4.6, 4.6, 4.6, 4.6, 4.6, 4.7, 4.7, 4.7, 4.7, 4.7, 4.7, 4.7, 4.7, 4.7, 4.6, 4.6, 4.6, 4.6, 4.5, 4.5, 4.4, 4.3, 4.0, 2.8, 1.4, 0.4, 0.1, 0.1, -0.0],
  [0.8, 0.6, 0.7, 1.4, 1.8, 2.6, 4.2, 4.4, 4.5, 4.6, 4.5, 4.5, 4.6, 4.6, 4.6, 4.6, 4.6, 4.6, 4.6, 4.7, 4.7, 4.7, 4.7, 4.7, 4.6, 4.6, 4.5, 4.5, 4.5, 4.5, 4.1, 2.9, 1.5, 0.4, 0.1, 0.1, -0.0], [0.7, 0.6, 0.7, 1.5, 2.2, 2.6, 4.2, 4.5, 4.5, 4.8, 4.6, 4.5, 4.5, 4.6, 4.6, 4.6, 4.6, 4.6, 4.6, 4.6, 4.6, 4.6, 4.6, 4.7, 4.7, 4.6, 4.6, 4.6, 4.5, 4.5, 4.2, 3.0, 1.5, 0.4, 0.1, 0.1, -0.0], [0.7, 0.5, 0.7, 1.5, 2.5, 2.7, 4.2, 4.5, 4.5, 4.7, 4.8, 4.6, 4.6, 4.6, 4.6, 4.6, 4.6, 4.6, 4.6, 4.6, 4.6, 4.6, 4.6, 4.6, 4.6, 4.6, 4.6, 4.5, 4.5, 4.4, 4.2, 3.1, 1.6, 0.4, 0.1, 0.1, -0.0],
  [0.7, 0.5, 0.7, 1.5, 2.7, 3.1, 4.2, 4.5, 4.5, 4.7, 4.7, 4.8, 4.7, 4.6, 4.6, 4.6, 4.6, 4.6, 4.6, 4.6, 4.6, 4.6, 4.6, 4.6, 4.6, 4.7, 4.6, 4.5, 4.5, 4.4, 4.2, 3.3, 1.7, 0.4, 0.1, 0.1, -0.0], [0.7, 0.5, 0.7, 1.5, 2.8, 3.4, 4.1, 4.4, 4.5, 4.5, 4.6, 4.7, 4.7, 4.7, 4.6, 4.6, 4.6, 4.6, 4.6, 4.6, 4.6, 4.6, 4.6, 4.6, 4.7, 4.6, 4.6, 4.5, 4.5, 4.4, 4.2, 3.4, 1.6, 0.4, -0.0, -0.0, -0.0], [0.7, 0.5, 0.6, 1.5, 2.8, 3.8, 4.1, 4.4, 4.5, 4.5, 4.6, 4.6, 4.7, 4.7, 4.7, 4.6, 4.6, 4.6, 4.6, 4.6, 4.6, 4.6, 4.7, 4.7, 4.6, 4.6, 4.5, 4.5, 4.4, 4.3, 4.2, 3.2, 1.3, 0.3, -0.0, -0.0, -0.0],
  [0.7, 0.6, 0.6, 1.3, 2.5, 3.9, 4.2, 4.3, 4.5, 4.5, 4.5, 4.6, 4.6, 4.6, 4.7, 4.6, 4.6, 4.6, 4.6, 4.6, 4.6, 4.7, 4.7, 4.6, 4.5, 4.5, 4.5, 4.4, 4.4, 4.3, 4.2, 2.7, 0.8, 0.1, -0.0, -0.0, -0.0], [0.7, 0.6, 0.5, 1.0, 2.0, 3.3, 4.3, 4.3, 4.4, 4.4, 4.5, 4.5, 4.5, 4.6, 4.6, 4.6, 4.6, 4.6, 4.6, 4.6, 4.6, 4.6, 4.5, 4.5, 4.5, 4.5, 4.5, 4.4, 4.4, 4.3, 3.7, 1.9, 0.4, -0.0, -0.0, -0.0, -0.0], [0.7, 0.6, 0.5, 0.7, 1.4, 2.4, 3.7, 4.2, 4.3, 4.4, 4.4, 4.4, 4.5, 4.5, 4.5, 4.5, 4.5, 4.5, 4.5, 4.5, 4.5, 4.5, 4.5, 4.5, 4.4, 4.4, 4.4, 4.4, 4.3, 3.4, 2.2, 0.8, 0.2, -0.0, -0.0, -0.0, -0.0],
  [0.6, 0.7, 0.6, 0.6, 0.8, 1.4, 1.9, 3.3, 4.0, 4.2, 4.3, 4.3, 4.3, 4.4, 4.4, 4.3, 4.0, 3.6, 1.9, 3.5, 3.7, 4.0, 4.1, 4.0, 3.9, 3.9, 3.8, 3.7, 3.2, 2.2, 0.7, 0.2, -0.0, -0.0, -0.0, -0.0, -0.0], [0.7, 0.7, 0.7, 0.5, 0.6, 0.8, 1.0, 1.7, 2.2, 2.8, 2.9, 2.7, 2.5, 2.6, 1.9, -0.0, -0.3, -0.3, -0.5, -0.2, -0.3, -0.2, 0.7, 1.6, 1.9, 1.9, 1.8, 1.7, 1.2, 0.6, 0.2, 0.1, -0.0, 0.1, -0.0, -0.0, -0.0], [0.6, 0.7, 0.8, 0.7, 0.6, 0.6, 0.7, 0.7, 0.8, 1.0, 1.0, 0.8, 0.6, 0.1, 0.1, 0.2, 0.2, 0.2, -0.1, 0.3, 0.2, 0.2, 0.2, 0.2, 0.2, 0.3, 0.4, 0.3, 0.2, 0.1, -0.0, -0.0, 0.1, 0.2, -0.0, -0.0, -0.0],
  [0.3, 0.5, 0.6, 0.6, 0.4, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.4, 0.2, 0.2, 0.2, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, 0.1, -0.0, -0.0, -0.0],
] }
const ground = (x: number, y: number) => groundAt(GROUND, x, y)


const HALF_W = 8, PANEL = 8
const CHORD = 0.85, WEB = 0.5, LEG = 1.0

type Truss = { yc: number; xEnd: number; xBot: number; bot: (x: number) => number; top: (x: number) => number; legY: number }
const OUTER = (yc: number): Truss => ({ yc, xEnd: 59, xBot: 50, bot: () => 25.5, top: () => 33.9, legY: 9 })
const CENTRE: Truss = {
  yc: 0, xEnd: 76, xBot: 67.5, legY: 8.7,
  bot: (x) => piecewise([[20, 25.6], [38, 34.0]])(Math.abs(x)),
  top: (x) => piecewise([[20, 34.0], [38, 42.5]])(Math.abs(x)),
}

function truss(t: Truss) {
  const { yc, xEnd, xBot } = t
  // panel points along the bottom chords, and the top chord's points half a panel off
  const xs = stations(-xBot, xBot, PANEL)
  const B = (s: number, x: number): V3 => [x, yc + s * HALF_W, t.bot(x)]
  const T = (x: number): V3 => [x, yc, t.top(x)]
  // chords, as tubes with a joint at every panel point so the centre truss can bend
  const topXs = [-xEnd, ...xs.slice(0, -1).map((x, i) => (x + xs[i + 1]) / 2), xEnd]
  for (let i = 0; i + 1 < topXs.length; i++) rod(k.steel, T(topXs[i]), T(topXs[i + 1]), CHORD, 6)
  for (const s of [-1, 1]) for (let i = 0; i + 1 < xs.length; i++) rod(k.steel, B(s, xs[i]), B(s, xs[i + 1]), CHORD, 6)
  // Warren webs on both sloping faces: bottom panel point -> top point -> next bottom point
  for (const s of [-1, 1]) for (let i = 0; i + 1 < xs.length; i++) {
    const m = (xs[i] + xs[i + 1]) / 2
    rod(k.steel, B(s, xs[i]), T(m), WEB, 4)
    rod(k.steel, T(m), B(s, xs[i + 1]), WEB, 4)
  }
  // and across the bottom face, zig-zag between the bottom chords
  for (let i = 0; i + 1 < xs.length; i++) rod(k.steel, B(i % 2 ? 1 : -1, xs[i]), B(i % 2 ? -1 : 1, xs[i + 1]), WEB, 4)
  // the end frames: from the last bottom panel points up to the top chord's ends
  for (const e of [-1, 1]) for (const s of [-1, 1]) rod(k.steel, B(s, e * xBot), T(e * xEnd), WEB + 0.1, 4)
  // the tripods: a front leg under the top chord's end, two legs under the bottom chords'
  for (const e of [-1, 1]) {
    // each leg on a concrete footing standing 0.8 m out of the ground there, so the tubes' tilted ends stay above it
    const front: V3 = [e * xEnd, yc, ground(e * xEnd, yc) + 0.8], fTop = T(e * xEnd)
    rod(k.steel, front, fTop, LEG, 6)
    const feet: V3[] = [-1, 1].map((s) => [e * xBot, yc + s * t.legY, ground(e * xBot, yc + s * t.legY) + 0.8] as V3)
    for (const f of [front, ...feet]) box(one(k.wall), f[0] - 1.5, f[0] + 1.5, f[1] - 1.5, f[1] + 1.5, 0, f[2] + 0.4, { r: 0.3, bottom: false })
    for (const [i, s] of [-1, 1].entries()) rod(k.steel, feet[i], B(s, e * xBot), LEG, 6)
    // a ring of ties at 13 m and a brace from each side leg's foot to the front leg
    const at = (a: V3, b: V3, z: number): V3 => { const f = (z - a[2]) / (b[2] - a[2]); return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, z] }
    const ring = [at(front, fTop, 13), ...[-1, 1].map((s, i) => at(feet[i], B(s, e * xBot), 13))]
    rod(k.steel, ring[0], ring[1], WEB, 4); rod(k.steel, ring[0], ring[2], WEB, 4); rod(k.steel, ring[1], ring[2], WEB, 4)
    for (const f of feet) rod(k.steel, f, at(front, fTop, 24), WEB, 4)
  }
}

// ---- Build -----------------------------------------------------------------------------

arenaBox()
lobby()
for (const t of [OUTER(48), OUTER(-48), CENTRE]) truss(t)

const list = [
  { part: k.steel, material: finish('truss-white', 0xf3f3f0) },
  { part: k.wall, material: finish('panel-white', 0xe9e8e3) },
  { part: k.roof, material: PALETTE.roof },
  { part: k.glass, material: { ...PALETTE.window, color: 0x7aa7ad } },
  { part: k.door, material: PALETTE.entrance },
]
const tris = countParts(list)
const glb = writeGlb('Hy-Vee Arena', list, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the outline centroid, on the lowest ground',
  bearing: 0, elevation: 0,
})
console.log(`kc-hy-vee-arena.glb: ${tris} triangles, ${glb.length} bytes; ` + list.map((p) => `${p.material.name} ${p.part.triangles}`).join(', '))
if (tris > 6500 || glb.length > 250 * 1024) throw new Error('over budget')
await Bun.write(new URL('../models/kc-hy-vee-arena.glb', import.meta.url), glb)
