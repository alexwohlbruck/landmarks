/**
 * New York Life Building (1890, McKim, Mead & White), 20 West 9th Street,
 * Kansas City, Missouri — original procedural geometry, CC0-1.0.
 * bun generators/kc-new-york-life-building.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = centroid of OSM way/132571955, -94.5840621 39.1039134.
 * Its walls run at 2.4° / 92.4° (the downtown grid), so the bearing is 2.4
 * and the model is square to its own frame. Elevation 0.
 *
 * The front is the SOUTH face, on 9th Street (the building stands north of
 * it: 800-block addresses), so the two wings, the court and the tower are
 * on the south side.
 *
 * Identity, in order: the red brick block, ten storeys under a deep cornice;
 * on 9th Street two wings flanking a narrow court, with the square clock
 * tower rising behind it two stages above the roof to its open loggia and
 * broad hipped tile roof, ball and mast; the brownstone lower storeys with
 * round-arched openings; the tiers of round-arched arcades up the brick
 * faces; the entrance in the court under the bronze eagle.
 *
 * Evidence
 * - OSM way/132571955 (13 levels, Q7013709): the 35.6 × 48.4 m outline. No
 *   building:parts.
 * - USGS 3DEP lidar MO_FEMANRCS_1_2020 (2020 flight), 0.5 m, read in this
 *   frame. Heights above y = 0 (the north-east corner; the ground is within
 *   ~1.5 m all round), measured: roof 41.7, cornice and parapet 42.9-43.2,
 *   chimneys to ~46; the court on the south side (~7.6 m wide at the walls,
 *   12 m deep, no returns from its floor); the tower behind it, ~10 m
 *   square over its eaves (x -5.6..5.6, y -12.6..-1.4), eaves 55.2, hip
 *   57.8, ball 60.4; its walls ~9.4 m square (front photo: the
 *   walls are 0.81 of the eaves' width), set behind a ~7.6 m court opening.
 * - Photos: "NY Life Bldg Kansas City MO.jpg" (User:Charvex, public domain;
 *   the front up 9th Street, ~12.7 px/m: brownstone to ~15 m, the arcade
 *   tiers, the attic, the cornice at 43 m, the tower's arched windows, loggia
 *   and roof, the mast to ~66 m; the entrance block in the court to ~15.5 m
 *   with the eagle on it at ~19 m, ~3.5 m across); "New York Life Building,
 *   2025.jpg" (Isoindolinone, CC BY-SA 4.0; the tower and wing tops close:
 *   the loggia's columns, the tile roof and its copper edge, the brick's
 *   colour in sun, the cresting); "NY Life Bldg-back-Kansas City MO.jpg"
 *   (User:Charvex, public domain; from the north-west: the west face's
 *   twelve arcaded bays, the plain brick north face with its stair shaft);
 *   "NYLBNima 01.JPG" (Nightryder84, CC BY-SA 3.0; the brownstone base).
 * - Estimated: the storey heights and the tiers (front photo): brownstone
 *   storeys 1-3 with the broad storey-3 arcade (one arch per two bays),
 *   plain storeys 4-7, the two-storey arcade of storeys 8-9, the attic; the
 *   bay pitch (4 m on the long faces, four bays per wing front); the eagle
 *   (a bold simple form, a little larger than the real 3.5 m).
 * - Left out: the clock faces' detail, the cresting's antefixes, the fire
 *   escape on the west face.
 * - Doubts: the east face is not photographed; it repeats the west.
 *
 * Colours: the brick a deep red-brown in sun (#9a4a38, 2025 photo), pulled
 * to the palette's lightness, not orange; the brownstone a darker, browner red;
 * the roof tile (and the flat roofs) a grey brown; windows the palette
 * slate; the ball, mast and the roof's edge bronze-green `patina`; the
 * eagle dark bronze.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { block, cap, inset, onWall, panel, rect, save, spire, walls, type XY } from './chi-aon-center'

/** A round-headed window panel on wall a→b: s0..s1 wide, z0 to the springing zs, a real semicircle above. */
function arched(p: Part, a: XY, b: XY, s0: number, s1: number, z0: number, zs: number, out = 0.06, seg = 8) {
  const { P } = onWall(a, b), c = (s0 + s1) / 2, r = (s1 - s0) / 2
  if (zs > z0) p.quad(P(s0, z0, out), P(s1, z0, out), P(s1, zs, out), P(s0, zs, out))
  for (let k = 0; k < seg; k++) {
    const t0 = Math.PI * k / seg, t1 = Math.PI * (k + 1) / seg
    p.tri(P(c, zs, out), P(c + r * Math.cos(t0), zs + r * Math.sin(t0), out), P(c + r * Math.cos(t1), zs + r * Math.sin(t1), out))
  }
}

/** A slab in the x–z plane from y0 to y1: a counter-clockwise (x, z) outline, extruded. */
function slabXZ(p: Part, pts: XY[], y0: number, y1: number) {
  const P = (x: number, z: number, y: number): V3 => [x, y, z]
  for (let i = 1; i < pts.length - 1; i++) {
    p.tri(P(pts[0][0], pts[0][1], y0), P(pts[i][0], pts[i][1], y0), P(pts[i + 1][0], pts[i + 1][1], y0)) // faces -y
    p.tri(P(pts[0][0], pts[0][1], y1), P(pts[i + 1][0], pts[i + 1][1], y1), P(pts[i][0], pts[i][1], y1)) // faces +y
  }
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i], b = pts[(i + 1) % pts.length]
    p.quad(P(a[0], a[1], y0), P(a[0], a[1], y1), P(b[0], b[1], y1), P(b[0], b[1], y0))
  }
}

function build() {
  const brick = new Part(), brown = new Part(), win = new Part(), tile = new Part(), bronze = new Part(), eagle = new Part()
  const roof = tile // the flat roofs share the tile's grey brown (one material fewer)
  const X = 17.8, Y = 24.2, CW = 3.8, CB = -12.4 // half width, half depth, court half-width, court's back wall
  const BROWN = 14.5, EAVE = 41.2, TOP = 42.9

  // --- the block: an outline with the court cut into the south front
  const plan: XY[] = [[-X, -Y], [-CW, -Y], [-CW, CB], [CW, CB], [CW, -Y], [X, -Y], [X, Y], [-X, Y]]
  walls(brown, plan, 0, BROWN)
  walls(brick, plan, BROWN, EAVE)
  // the deep cornice: flaring out ~1 m, then its fascia; the flat roof inside
  const out = inset(plan, -1.0)
  walls(brick, plan, EAVE, EAVE + 0.8, out)
  walls(brick, out, EAVE + 0.8, TOP)
  cap(roof, out, TOP)
  // string courses: the top of the brownstone and between the arcade tiers
  for (const [z0, z1] of [[BROWN - 0.5, BROWN + 0.1], [30.6, 31.2], [38.7, 39.1]] as [number, number][]) {
    const ring = inset(plan, -0.12)
    walls(brown, ring, z0, z1)
    cap(brown, ring, z1)
  }

  // --- the entrance block in the court, its portal and the eagle
  block(brown, roof, rect(-CW, -Y, CW, CB), 0, 15.5, 0.25)
  panel(brown, [-CW, -Y], [CW, -Y], 1.6, 7.4, 0, 10.4, 0.05) // the portal's pale surround
  arched(win, [-CW, -Y], [CW, -Y], 2.3, 6.7, 0, 6.6, 0.1)
  block(brown, brown, rect(-0.8, -Y + 0.4, 0.8, -Y + 1.8), 15.5, 16.6, 0.1) // the eagle's plinth
  slabXZ(eagle, [[-0.5, 16.6], [0.5, 16.6], [0.6, 18.4], [0, 19.4], [-0.6, 18.4]], -Y + 0.7, -Y + 1.5) // body
  for (const sx of [1, -1]) {
    const w: XY[] = [[0.3, 17.4], [2.3, 18.4], [2.2, 20.3], [1.2, 19.6], [0.3, 18.6]].map(([x, z]) => [sx * x, z] as XY)
    slabXZ(eagle, sx > 0 ? w : w.reverse(), -Y + 0.9, -Y + 1.3)
  }

  // --- the clock tower behind the court
  const TX = 4.7, T0 = CB, T1 = -3.0, TE = 55.2
  const tower = rect(-TX, T0, TX, T1)
  walls(brick, tower, TOP - 1, 49.4)
  block(brick, brick, rect(-TX - 0.3, T0 - 0.3, TX + 0.3, T1 + 0.3), 49.4, 50.1, 0.15) // string course
  walls(brick, tower, 50.1, TE)
  // the eaves: a broad copper-edged slab, then the low hipped tile roof
  const eave = rect(-TX - 1.05, T0 - 1.05, TX + 1.05, T1 + 1.05)
  block(bronze, null, eave, TE, TE + 0.45, 0)
  cap(bronze, eave, TE, false)
  spire(tile, eave, TE + 0.45, [0, (T0 + T1) / 2, 57.8])
  const ball: XY[] = Array.from({ length: 7 }, (_, i) => { const t = -Math.PI / 2 + i * Math.PI / 6; return [0.6 * Math.cos(t), 59.2 + 0.6 * Math.sin(t)] as XY })
  for (let k = 0; k < 8; k++) {
    const a0 = (k / 8) * 2 * Math.PI, a1 = ((k + 1) / 8) * 2 * Math.PI
    for (let i = 0; i < ball.length - 1; i++) {
      const Q = ([r, z]: XY, a: number): V3 => [r * Math.cos(a), (T0 + T1) / 2 + r * Math.sin(a), z]
      bronze.quad(Q(ball[i], a0), Q(ball[i], a1), Q(ball[i + 1], a1), Q(ball[i + 1], a0))
    }
  }
  walls(bronze, rect(-0.15, (T0 + T1) / 2 - 0.15, 0.15, (T0 + T1) / 2 + 0.15), 57.6, 66.0) // the mast
  // tower openings: three arched windows over the roof, the loggia's three
  // openings on every face, and the column of windows down the court
  for (let i = 0; i < tower.length; i++) {
    const a = tower[i], b = tower[(i + 1) % tower.length], { L } = onWall(a, b)
    for (const s of [L / 2 - 2.8, L / 2, L / 2 + 2.8]) {
      arched(win, a, b, s - 0.65, s + 0.65, 44.4, 47.6, 0.06)
      panel(win, a, b, s - 0.9, s + 0.9, 50.9, 54.0, 0.06)
    }
  }
  for (const [z0, zs] of [[16.4, 21.4], [23.6, 27.0], [29.4, 35.2]] as [number, number][]) arched(win, [-TX, T0], [TX, T0], TX - 0.75, TX + 0.75, z0, zs, 0.06)

  // --- the faces, tier by tier (front photo): storeys 1-2 in brownstone;
  // storey 3 the brownstone arcade of broad round arches, one per two bays;
  // storeys 4-7 plain windows, one per bay a storey, with
  // brick spandrels (the real ones are pairs; four bold rows, no slots); storeys 8-9 the
  // two-storey brick arcade (a window under a round-arched one in every bay);
  // the attic's small windows under the cornice
  const face = (a: XY, b: XY, n: number, w: number, from = 0, arcades = true) => {
    const { L } = onWall(a, b), pitch = L / n
    if (from <= 0) {
      const nb = Math.max(1, Math.round(n / 2)), p2 = L / nb
      for (let i = 0; i < nb; i++) {
        const s = p2 * (i + 0.5), r = Math.min(2.4, p2 / 2 - 1.0)
        if (arcades) arched(win, a, b, s - r, s + r, 9.4, 13.4 - r, 0.06) // storey 3 arcade
        else panel(win, a, b, s - w / 2, s + w / 2, 9.6, 12.8, 0.06)
      }
    }
    for (let i = 0; i < n; i++) {
      const s = pitch * (i + 0.5)
      if (from <= 0) for (const [z0, z1] of [[1.0, 4.2], [5.2, 7.8]]) panel(win, a, b, s - w / 2, s + w / 2, z0, z1, 0.06) // storeys 1-2
      for (const [z0, z1] of [[15.6, 18.2], [19.6, 22.2], [23.6, 26.2], [27.6, 30.0]]) if (z0 >= from) panel(win, a, b, s - w / 2, s + w / 2, z0, z1, 0.06)
      if (arcades) {
        panel(win, a, b, s - w / 2, s + w / 2, 31.9, 34.6, 0.06) // arcade, lower storey
        arched(win, a, b, s - w / 2, s + w / 2, 35.6, 37.6 - w / 2, 0.06) // arcade, arched upper storey
      } else panel(win, a, b, s - w / 2, s + w / 2, 31.9, 37.6, 0.06)
      panel(win, a, b, s - w * 0.35, s + w * 0.35, 39.6, 40.8, 0.06) // attic
    }
  }
  face([-X, -Y], [-CW, -Y], 4, 1.9) // south front, west wing
  face([CW, -Y], [X, -Y], 4, 1.9) // south front, east wing
  face([X, -Y], [X, Y], 12, 2.1) // east
  face([-X, Y], [-X, -Y], 12, 2.1) // west
  face([X, Y], [-X, Y], 9, 1.5, 0, false) // north (back): plain punched windows
  face([-CW, -Y], [-CW, CB], 2, 1.8, 16.0) // the court's sides, over the entrance block
  face([CW, CB], [CW, -Y], 2, 1.8, 16.0)

  return [
    { part: brick, material: finish('nyl-brick', 0xa55b48) },
    { part: brown, material: finish('nyl-brownstone', 0x8c5747) },
    { part: win, material: PALETTE.window },
    { part: tile, material: finish('nyl-roof-tile', 0x7e6e68) },
    { part: bronze, material: PALETTE.patina },
    { part: eagle, material: finish('nyl-eagle-bronze', 0x6e5c48, 0.6) },
  ]
}

if (import.meta.main) await save('kc-new-york-life-building', 'New York Life Building', [39.1039134, -94.5840621], 2.4, build())
