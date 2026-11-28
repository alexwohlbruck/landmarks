/**
 * Bete Giyorgis (Church of Saint George), Lalibela (rock-hewn, early 13th
 * century): procedural, CC0-1.0.
 * bun generators/lalibela-bete-giyorgis.ts
 *
 * A monolith: the church was cut down into the volcanic tuff, so it stands
 * in a square trench and its roof, with its three nested Greek crosses in
 * relief, lies at about the level of the rock around it.
 *
 * How the trench is handled. The map's terrain is the rock surface, with no
 * pit in it, and the map hides whatever of a model ends up below the
 * ground. So the model is the church alone, whole and solid from its plinth
 * at the trench floor (y = 0) to its roof, and it is sunk by `elevation`
 * so its roof lies at the terrain's surface. The trench is left implied:
 * its walls would be drawn wholly under the terrain, and the rock around
 * the pit is ground the map already draws. On the map the church reads as
 * it does from the rim (p1, p7, p8): a cross of rock in the ground, with a
 * little of its walls showing on the downhill side where the drawn slope
 * falls away. In a model viewer it reads as the monolith it is.
 *
 * Elevation: the trench floor is about 12 m below the surrounding rock
 * (OSM height 12, the church's own height, and the roof flush with the rim
 * in p1, p2, p7). The map's terrain here is Mapterhorn at z12 only (z13-z15
 * return 404), 38 m a pixel, and slopes about 2 m across the church
 * (rising to the north-east). Set at -12 the uphill arms of the roof would
 * be drawn under the ground. The elevation is the least sink that keeps the
 * whole roof above the drawn ground (the terrain check passes), so the
 * cross reads whole; on the downhill side the top of the walls shows as
 * the trench does in reality.
 *
 * Elevation -9 (the depth is 12 m). Checked with `tools/terrain.ts check`
 * at z12 on a copy of the model without the trench-floor tops (the plinth
 * steps, the string courses and the door and window frames, which really
 * are below the rim and are meant to be under the drawn ground): at -12 the
 * whole roof lies under the drawn ground, by up to 2.9 m; at -10 43 m² of
 * it, by up to 0.9 m; at -9.5 10 m², by 0.4 m; at -9 none. So the roof is
 * drawn whole and flush on its uphill (north-east) side and up to about
 * 3 m proud on its downhill side. The full model's check lists those
 * trench-floor tops as buried, as intended.
 *
 * Frame: origin at the area centroid of OSM way/266054164 (39.041142,
 * 12.031626), bearing 9.5 (the cross's sides run at 9.5 / 99.5 degrees),
 * so the arms point to model north, east, south and west.
 *
 * Dimensions. OSM: the cross 11.9 m across both ways, arms 5.2 m wide, so
 * 3.35 m from the central square to each arm's end; height 12 m (OSM).
 * Measured from the near-level photo p4 (the wall above the plinth is 10.5
 * m tall in it, 900 px): the plinth of three steps, 1.5 m in all and 1.5 m
 * wide (p3, p4, p10); string courses at 41, 62 and 81 percent of the wall
 * (5.8, 8.0, 10.0 m) and a last moulding at 11.0 m, each about 0.4 m deep
 * and 0.2 m proud (drawn 0.3 m); the upper windows, pointed (ogee, carved with a flower
 * over them) in the zone between the second and third courses, 0.7 m wide,
 * two on each arm's end and one on each arm's side; the lower zone's framed
 * doors on the west, north and south arms' ends (three entrances; p4, p10)
 * and framed blind windows on the arms' sides (p4). Roof: three nested
 * crosses in relief (p1, p2, p7, p8), read on p2: the outer border 0.6 m
 * wide, the second cross 9.2 m across with arms 3.5 m wide, the inner
 * 5.8 m across with arms 1.9 m wide, raised about 0.3 m (drawn 0.4 m, their
 * tops in the walls' tuff so they read from above without shadows).
 *
 * Colours, from daylight photos: the walls are a reddish-brown tuff (#8c6d60
 * to #a0705f in sun, #69554d in shade in p4, p10; yellow-green lichen
 * patches not drawn), pulled to #a87565; the roof's weathered top a
 * greyer pinkish brown (#7b7671 in p2), #a08a80; the window openings dark
 * (#54453e, the floor allowed); the door leaves dark wood.
 *
 * Night: the church is not lit; nothing glows. The openings are not named
 * `window` so they stay dark.
 *
 * Simplified or left out: the trench and its passages (see above), the
 * baptismal pool, the carved flowers over the windows, the lichen, the
 * small Latin cross on the roof's centre.
 *
 * Photos (Wikimedia Commons; all EVIDENCE):
 * - p1 "Bete Giyorgis 01.jpg", Bernard Gagnon, CC BY-SA 3.0 (from the rim)
 *   https://commons.wikimedia.org/wiki/File:Bete_Giyorgis_01.jpg
 * - p2 "Bete Giyorgis 02.jpg", Bernard Gagnon, CC BY-SA 3.0 (the roof)
 *   https://commons.wikimedia.org/wiki/File:Bete_Giyorgis_02.jpg
 * - p3 "Bete Giyorgis 03.jpg", Bernard Gagnon, CC BY-SA 3.0
 *   https://commons.wikimedia.org/wiki/File:Bete_Giyorgis_03.jpg
 * - p4 "Bete Giyorgis 04.jpg", Bernard Gagnon, CC BY-SA 3.0 (walls, courses, doors; main ruler)
 *   https://commons.wikimedia.org/wiki/File:Bete_Giyorgis_04.jpg
 * - p6 "Bete Giyorgis 06.jpg", Bernard Gagnon, public domain
 *   https://commons.wikimedia.org/wiki/File:Bete_Giyorgis_06.jpg
 * - p7 "Bete Giyorgis-Lalibela (1).jpg", Ji-Elle, CC BY-SA 3.0 (from the rim)
 *   https://commons.wikimedia.org/wiki/File:Bete_Giyorgis-Lalibela_(1).jpg
 * - p10 "Bete Giyorgis Lalibela.jpg", Hulivili, CC BY 2.0 (an arm's end from the trench floor)
 *   https://commons.wikimedia.org/wiki/File:Bete_Giyorgis_Lalibela.jpg
 * - p12 "Lalibela, san giorgio, esterno 24.jpg", Sailko, CC BY 3.0 (the trench)
 *   https://commons.wikimedia.org/wiki/File:Lalibela,_san_giorgio,_esterno_24.jpg
 * Look-only: none.
 *
 * Doubts: which arms carry doors (three, W, N and S, as usually described
 * and as two photos show; the east arm's lower zone is drawn with a blind
 * window); the window count per face is simplified to two on each end and
 * one on each side; the roof crosses' proportions are read from oblique
 * photos.
 */
import { Part, type MaterialSpec, type V3 } from './mesh'
import { finish } from './palette'
import { save, obox, panel, type Mat } from './cairo-cairo-tower'
import { ccw, offsetRing, type XY } from './casablanca-hassan-ii-mosque'
import { polyTris } from './berlin-oberbaum-bridge'

const ARM = 2.6, EXT = 5.95 // half-width of an arm, half the cross's span
const cross = (w: number, e: number): XY[] => ccw([
  [w, -e], [w, -w], [e, -w], [e, w], [w, w], [w, e], [-w, e], [-w, w], [-e, w], [-e, -w], [-w, -w], [-w, -e],
])
const OUT = cross(ARM, EXT)
const H = 12, PLINTH = 1.5
const COURSES: [number, number][] = [[5.6, 6.0], [7.8, 8.2], [9.8, 10.2], [10.85, 11.15]]

const M = {
  tuff: finish('bete-giyorgis-tuff', 0xa87565) as MaterialSpec,
  top: finish('bete-giyorgis-roof', 0xa08a80) as MaterialSpec,
  opening: finish('bete-giyorgis-opening', 0x54453e) as MaterialSpec,
  door: finish('bete-giyorgis-door', 0x6e5242) as MaterialSpec,
}

function walls(p: Part, ring: XY[], z0: number, z1: number) {
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    p.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
  }
}
/** The flat top between an outer ring and an inner one (or the whole ring). */
function top(p: Part, ring: XY[], z: number, hole?: XY[]) {
  for (const [a, b, c] of polyTris(ring, hole ? [hole] : [])) p.tri([a[0], a[1], z], [b[0], b[1], z], [c[0], c[1], z])
}
/** A raised band between a cross and its inward offset, from z0 to z1. */
function band(p: Part, cap: Part, ring: XY[], w: number, z0: number, z1: number) {
  const inner = offsetRing(ring, -w)
  walls(p, ring, z0, z1)
  walls(p, [...inner].reverse(), z0, z1)
  top(cap, ring, z1, inner)
}

function build(): Mat[] {
  const tuff = new Part(), roof = new Part(), hole = new Part(), door = new Part()

  // ── The plinth: three steps round the cross.
  const steps: [number, number, number][] = [[1.5, 0, 0.5], [1.0, 0.5, 1.0], [0.5, 1.0, PLINTH]]
  for (const [o, z0, z1] of steps) {
    const r = offsetRing(OUT, o)
    walls(tuff, r, z0, z1)
    const next = o > 0.5 ? offsetRing(OUT, o - 0.5) : OUT
    top(tuff, r, z1, next)
  }

  // ── Walls and string courses.
  walls(tuff, OUT, PLINTH, H)
  for (const [z0, z1] of COURSES) {
    const r = offsetRing(OUT, 0.3)
    walls(tuff, r, z0, z1)
    top(tuff, r, z1, OUT)
    for (const [a, b, c] of polyTris(r, [OUT])) tuff.tri([a[0], a[1], z0], [c[0], c[1], z0], [b[0], b[1], z0])
  }

  // ── Roof: the flat top and the three nested crosses in relief.
  top(roof, OUT, H)
  // the crosses' raised tops in the walls' warmer tuff: on the real roof
  // they read by their shadows, which the map's flat light doesn't give
  band(roof, tuff, OUT, 0.6, H, H + 0.4)
  band(roof, tuff, cross(1.75, 4.6), 0.5, H, H + 0.4)
  band(roof, tuff, cross(0.95, 2.9), 0.45, H, H + 0.4)
  top(tuff, cross(0.25, 1.2), H + 0.4)
  walls(roof, cross(0.25, 1.2), H, H + 0.4)

  // ── Openings, face by face.
  for (let i = 0; i < OUT.length; i++) {
    const a = OUT[i], b = OUT[(i + 1) % OUT.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: V3 = [u[1], -u[0], 0]
    const at = (s: number, z: number): V3 => [a[0] + u[0] * (L / 2 + s), a[1] + u[1] * (L / 2 + s), z]
    const isEnd = L > 4
    // upper zone: pointed windows
    for (const s of isEnd ? [-1.25, 1.25] : [0]) panel(hole, at(s, 8.55), n, 0.7, 1.15, 'pointed', 6, 0.04)
    // lower zone
    const facing = isEnd ? (Math.abs(n[0]) > Math.abs(n[1]) ? (n[0] > 0 ? 'E' : 'W') : n[1] > 0 ? 'N' : 'S') : ''
    const c = at(0, 0)
    if (isEnd && facing !== 'E') {
      // a framed door: the surround proud of the wall, the leaves on it
      obox(tuff, tuff, c[0] + n[0] * 0.12, c[1] + n[1] * 0.12, [u[0], u[1]], 1.15, 0.12, PLINTH, PLINTH + 3.9)
      panel(door, at(0, PLINTH), [n[0], n[1], 0], 1.4, 3.3, false, 6, 0.27)
    } else {
      // a framed blind window
      obox(tuff, tuff, c[0] + n[0] * 0.1, c[1] + n[1] * 0.1, [u[0], u[1]], 0.75, 0.1, 2.6, 4.6)
      panel(hole, at(0, 2.85), [n[0], n[1], 0], 0.9, 1.5, false, 6, 0.23)
    }
  }

  return [
    { part: tuff, material: M.tuff },
    { part: roof, material: M.top },
    { part: hole, material: M.opening },
    { part: door, material: M.door },
  ]
}

if (import.meta.main) {
  await save('lalibela-bete-giyorgis.glb', 'lalibela-bete-giyorgis', build(), 5000, 250_000,
    { landmark: 'Bete Giyorgis, Lalibela', source: 'generators/lalibela-bete-giyorgis.ts' })
}
