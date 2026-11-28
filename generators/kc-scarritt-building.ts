/**
 * Scarritt Building (1907, Root & Siemens), 818 Grand Boulevard, Kansas
 * City, Missouri — original procedural geometry, CC0-1.0.
 * bun generators/kc-scarritt-building.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = centroid of OSM way/170990177, -94.5811095 39.1037159.
 * Its walls run at 2.4° / 92.4° (the downtown grid), so the bearing is 2.4
 * and the model is square to its own frame. Elevation 0.
 *
 * Identity, in order: a Chicago-school office block on the corner of 9th
 * and Grand, its upper storeys a U open to 9th Street (two wings either side
 * of a narrow light court) over a base that fills the lot; the pale grey
 * terracotta base of two tall storeys; the pale grey-white shaft with continuous
 * pale terracotta piers between bays of paired windows; the capitals and
 * the top storeys over them; the deep projecting cornice with its cresting.
 *
 * Evidence
 * - OSM way/170990177 (12 levels): the 36.2 × 28.4 m outline. No
 *   building:parts. The Scarritt Arcade (way/195033678) and the buildings
 *   to the west only share edges.
 * - USGS 3DEP lidar MO_FEMANRCS_1_2020 (2020 flight), 0.5 m, read in this
 *   frame (the cloud sits ~2.5 m east of OSM; shifted back). Heights above
 *   y = 0 (the south-west corner on 9th Street; Grand Boulevard on the east
 *   is ~4 m higher), measured: the roof 45.5-47.5, the cornice ~46.8; the
 *   light court open to the south, ~6 m wide and ~11 m deep, no returns from
 *   its floor; a roof house 53.3 (x -10.5..1.5, y 4..12).
 * - The map's terrain: the ground rises from 0.6 at the south-west corner to
 *   4.4 along Grand Boulevard and 3.4 at the north-west; the shopfronts sit
 *   at the Grand level and the lower ground on the west shows a basement.
 * - Photos: "Scarritt Building.jpg" (Mwkruse, CC BY-SA 3.0; from the south-
 *   east corner: the base, the piers and paired windows, the capitals, the
 *   cornice and cresting, the east wing's twin seen behind; the colours);
 *   Flickr 6157349740 "PHOSTINT" (jasonwoodhead23, CC BY 2.0; a c. 1910
 *   Detroit Publishing "Phostint" postcard of the building: the U plan with
 *   the court open to 9th Street, seven bays on Grand with the entrance at
 *   the north end, three on each wing's south face).
 * - Estimated: storey heights (base 2 × 5 m, shaft 3.6 m, from the photo);
 *   the bay pitch (4 m); the window groups (each bay's pair of punched
 *   windows, ~1 m each, grouped over two storeys with stone spandrels and
 *   ~1.4 m piers, so the stone dominates as in the photos); the cornice's projection (1.4 m).
 * - Look-only, not used: Flickr photos by Sean_Marshall and ryePhone
 *   (CC BY-NC).
 * - Neighbours: 814 Grand (way/181033440, "Patriot Business Center") is a
 *   separate building against the north wall; the cornice and base band stop
 *   flush there instead of projecting over it.
 * - Doubts: the north and west faces are not seen in any licensed photo
 *   (they face neighbours); they are drawn plainer. The roof house is not
 *   in either photo (set back from the street); it is drawn from lidar.
 *
 * Colours: the facing reads a pale cool grey-white in the photo and the
 * postcard (#c9c5ba overcast), pulled to the palette's stone lightness;
 * the piers, capitals, cornice and cresting a shade paler; windows the palette slate; the doors `entrance`;
 * roofs `roof`.
 */
import { Part } from './mesh'
import { PALETTE, finish } from './palette'
import { block, cap, inset, onWall, panel, rect, save, walls, type XY } from './chi-aon-center'

/** A round-headed window panel on wall a→b: s0..s1 wide, z0 to the springing zs, a semicircle above. */
function arched(p: Part, a: XY, b: XY, s0: number, s1: number, z0: number, zs: number, out = 0.06, seg = 8) {
  const { P } = onWall(a, b), c = (s0 + s1) / 2, r = (s1 - s0) / 2
  if (zs > z0) p.quad(P(s0, z0, out), P(s1, z0, out), P(s1, zs, out), P(s0, zs, out))
  for (let k = 0; k < seg; k++) {
    const t0 = Math.PI * k / seg, t1 = Math.PI * (k + 1) / seg
    p.tri(P(c, zs, out), P(c + r * Math.cos(t0), zs + r * Math.sin(t0), out), P(c + r * Math.cos(t1), zs + r * Math.sin(t1), out))
  }
}

/** The ground under (x, y), from the map's terrain: SW 0.6, SE 4.4, NW 3.4, NE 4.4. */
const ground = (x: number, y: number) => {
  const u = (x + 18.1) / 36.2, v = (y + 14.2) / 28.4
  return 0.6 * (1 - u) * (1 - v) + 4.4 * u * (1 - v) + 3.4 * (1 - u) * v + 4.4 * u * v
}

/** A round window (a disc) on wall a→b centred at s, z. */
function oculus(p: Part, a: XY, b: XY, s: number, z: number, r: number, out = 0.06, seg = 12) {
  const { P } = onWall(a, b)
  for (let k = 0; k < seg; k++) {
    const t0 = 2 * Math.PI * k / seg, t1 = 2 * Math.PI * (k + 1) / seg
    p.tri(P(s, z, out), P(s + r * Math.cos(t0), z + r * Math.sin(t0), out), P(s + r * Math.cos(t1), z + r * Math.sin(t1), out))
  }
}

function build() {
  const brick = new Part(), trim = new Part(), terra = brick, win = new Part(), roof = new Part(), door = new Part()
  const X = 18.1, Y = 14.2, C = 3.0, CB = -3.2 // half width, half depth, court half-width, court's back wall
  const BASE = 14.5, CAPS = 39.5, BAND = 44.5, TOP = 47.0, GRAND = 4.4

  // nothing projects north of the north wall: 814 Grand (way/181033440, a
  // separate building) abuts it there
  const north = (r: XY[]) => r.map(([x, y]) => [x, Math.min(y, Y)] as XY)

  // --- the base over the whole lot, then the U of the upper storeys
  const lot = rect(-X, -Y, X, Y)
  walls(terra, lot, 0, BASE)
  cap(roof, lot, BASE) // the court's floor; the rest is under the U
  block(trim, null, north(inset(lot, -0.25)), BASE - 0.9, BASE, 0.2) // the base's top band
  const U: XY[] = [[-X, -Y], [-C, -Y], [-C, CB], [C, CB], [C, -Y], [X, -Y], [X, Y], [-X, Y]]
  walls(brick, U, BASE, BAND)
  // the cornice: a band, a 1.4 m flare, the fascia, the flat roof
  const o1 = north(inset(U, -0.2)), o2 = north(inset(U, -1.4))
  walls(trim, o1, BAND, BAND + 0.8)
  walls(trim, o1, BAND + 0.8, BAND + 1.8, o2)
  walls(trim, o2, BAND + 1.8, TOP)
  cap(roof, o2, TOP)
  block(roof, roof, rect(-10.5, 4, 1.5, 12), TOP, 53.3, 0.3) // roof house (lidar), set back out of the street views

  // --- the faces of the U: wide piers, a pair of punched windows in each
  // bay grouped over two storeys, stone spandrels between the groups, the
  // capitals' band and the top storeys over it
  const G: [number, number][] = [[15.3, 19.7], [21.5, 25.9], [27.7, 32.1], [33.9, 38.3]]
  const pair = (a: XY, b: XY, s: number, z0: number, z1: number) => {
    panel(win, a, b, s - 1.2, s - 0.15, z0, z1, 0.06)
    panel(win, a, b, s + 0.15, s + 1.2, z0, z1, 0.06)
  }
  const shaft = (a: XY, b: XY, n: number, piers: boolean, crest: boolean) => {
    const { L, P } = onWall(a, b), pitch = L / n
    for (let i = 0; i < n; i++) {
      const s = pitch * (i + 0.5)
      for (const [z0, z1] of G) pair(a, b, s, z0, z1)
      pair(a, b, s, 41.0, 43.6) // the top storeys over the capitals
    }
    if (!piers) return
    for (let k = 0; k <= n; k++) {
      const s = Math.min(L - 0.7, Math.max(0.7, pitch * k))
      panel(trim, a, b, s - 0.7, s + 0.7, BASE, CAPS, 0.1)
    }
    panel(trim, a, b, 0, L, CAPS, CAPS + 0.9, 0.12) // the capitals' band
    if (crest) for (let k = 0; k <= n * 2; k++) {
      const s = Math.min(L - 0.6, Math.max(0.6, pitch * k / 2)), c = P(s, 0, 1.0)
      block(trim, trim, rect(c[0] - 0.4, c[1] - 0.4, c[0] + 0.4, c[1] + 0.4), TOP, TOP + 1.1, 0)
    }
  }
  shaft([-X, -Y], [-C, -Y], 3, true, true) // the wings' fronts on 9th Street
  shaft([C, -Y], [X, -Y], 3, true, true)
  shaft([X, -Y], [X, Y], 7, true, true) // Grand Boulevard
  shaft([-C, -Y], [-C, CB], 2, false, false) // the court
  shaft([C, CB], [C, -Y], 2, false, false)
  shaft([-C, CB], [C, CB], 1, false, false)
  shaft([X, Y], [-X, Y], 8, false, false) // north and west, against neighbours
  shaft([-X, Y], [-X, -Y], 6, false, false)

  // --- the base: two tall storeys of big plate-glass openings under the
  // bays above (shopfronts to the street, one large window over each), the
  // piers carried down between them; the round-arched entrance on Grand
  const base = (a: XY, b: XY, spans: [number, number][], shops = true) => {
    const { P } = onWall(a, b)
    for (const [s0, s1] of spans) {
      const q = P((s0 + s1) / 2, 0, 0), g = ground(q[0], q[1])
      if (shops) panel(win, a, b, s0, s1, g, 9.0, 0.06)
      panel(win, a, b, s0, s1, 10.0, 13.4, 0.06)
    }
  }
  const bays = (s0: number, s1: number, n: number, m = 0.7) => Array.from({ length: n }, (_, i) => [s0 + (s1 - s0) * i / n + m, s0 + (s1 - s0) * (i + 1) / n - m] as [number, number])
  const W = X - C // a wing's front
  base([-X, -Y], [X, -Y], [...bays(0, W, 3), ...bays(W, W + 2 * C, 1, 0.9), ...bays(W + 2 * C, 2 * X, 3)])
  base([X, -Y], [X, Y], bays(0, 2 * Y, 7).slice(0, 6))
  base([X, Y], [-X, Y], bays(0, 2 * X, 8, 0.9), false)
  base([-X, Y], [-X, -Y], bays(0, 2 * Y, 6, 0.9), false)
  // the entrance on Grand, in the north bay: a round-arched doorway between two oculi
  {
    const a: XY = [X, -Y], b: XY = [X, Y], L = 2 * Y, p = L / 7, s = L - p / 2
    panel(trim, a, b, s - p / 2 + 0.1, s + p / 2 - 0.1, GRAND, 13.8, 0.1)
    arched(door, a, b, s - 1.3, s + 1.3, GRAND, 8.6, 0.14)
    oculus(win, a, b, s - 1.75, 11.4, 0.5, 0.14)
    oculus(win, a, b, s + 1.75, 11.4, 0.5, 0.14)
  }
  // piers down the base, under the shaft's piers on the photographed faces
  for (const [a, b, n] of [[[-X, -Y], [-C, -Y], 3], [[C, -Y], [X, -Y], 3], [[X, -Y], [X, Y], 7]] as [XY, XY, number][]) {
    const { L } = onWall(a, b), pitch = L / n
    for (let k = 0; k <= n; k++) {
      const s = Math.min(L - 0.7, Math.max(0.7, pitch * k))
      panel(trim, a, b, s - 0.7, s + 0.7, 0, BASE - 0.9, 0.1)
    }
  }

  return [
    { part: brick, material: finish('scarritt-stone', 0xdcd8ce) },
    { part: trim, material: finish('scarritt-stone-pale', 0xeeece5) },
    { part: win, material: PALETTE.window },
    { part: roof, material: PALETTE.roof },
    { part: door, material: PALETTE.entrance },
  ]
}

if (import.meta.main) await save('kc-scarritt-building', 'Scarritt Building', [39.1037159, -94.5811095], 2.4, build())
