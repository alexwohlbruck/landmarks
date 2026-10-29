/**
 * Battery Maritime Building, 10 South Street, Manhattan — procedural, CC0-1.0, no textures.
 * bun generators/nyc-battery-maritime-building.ts
 *
 * The 1909 Beaux-Arts ferry terminal (Walker & Morris) for the Brooklyn and
 * Governors Island ferries: a painted cast-iron and pressed-steel frame on
 * the East River with three great arched ferry slips, a two-storey head
 * house on South Street with an open columned loggia under a deep bracketed
 * cornice, and since 2021 the Casa Cipriani hotel with a glass-and-steel
 * storey on the slip block's roof.
 *
 * Map frame: x = along the building (compass 73.3°, east-north-east),
 * y = towards South Street (compass 343.3°), z up, metres. Placed at bearing
 * 343.3. Anchor: area centroid of the OSM outline way/169362470.
 * y = 0 is the water and the lowest ground under the footprint (lidar water
 * surface -0.4 m NAVD88); South Street is 2.7 m above it, so on the street
 * side the bottom 2.7 m of the plinth sits under the pavement.
 * Water, the fender piers, the ferry boats and the slip ramps are not modelled.
 * The model includes the slip block (the piers and arches of the three slips,
 * as far as the building's outline goes), not the open pier sheds beyond it.
 *
 * Evidence
 * - OSM: outline way/169362470 (height 29) and parts way/213867489,
 *   213867490 (the perimeter roof over the street and east fronts,
 *   gabled, 15-18), 213867491 (the central gabled skylight, 15-20),
 *   213867492 (the slip block, 15-21), 213871106 (a 6 m block in the west
 *   notch, 27); all members of building relation/2848176. Outline in this
 *   frame: head house x -41…41, y -12.5…31.3; slip block x -49.1…48.1,
 *   y -29…-12.5, with four pier ends standing ~1 m proud on the river face.
 * - Lidar: USGS 3DEP NY_NewYorkCity (flown 2017), 0.5 m grid in this frame,
 *   heights above the water (-0.4 m NAVD88): South Street 2.7; head house
 *   flat roof 17.3; the perimeter roof's eave 18.0 at the street edge rising
 *   to a ridge of 21.4 about 5 m in (north and east fronts only, the west
 *   wall is plain); the central skylight ridge 22.9 (x -23…24, y -3…17,
 *   empty returns = glass); the slip block's flat roof 21.7. The 2017
 *   flight predates the hotel addition (finished 2021).
 * - Published: 1909, Walker & Morris; steel frame clad in cast iron and
 *   pressed metal painted green; three slips (Wikipedia "Battery Maritime
 *   Building"; NYC LPC designation 1967; NRHP 76001235). Casa Cipriani
 *   (2021) added a glass rooftop storey over the slips.
 * - Photos (Wikimedia Commons, all EVIDENCE):
 *   river front, frontal: "Battery-Maritime-Building Water-View 2021-06-16 15-06.jpg",
 *     Axel Tschentscher, CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Battery-Maritime-Building_Water-View_2021-06-16_15-06.jpg
 *   river front, oblique: "Battery Maritime Building slips.jpg", Beyond My Ken, CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Battery_Maritime_Building_slips.jpg
 *   river front at sunset, east end (pre-2021): "Battery Maritime Building desde el río del este…
 *     (10074792254).jpg", Andres Alvarado, CC BY-SA 2.0,
 *     https://commons.wikimedia.org/wiki/File:Battery_Maritime_Building_desde_el_r%C3%ADo_del_este-Battery_Maritime_Building_from_the_East_River_(10074792254).jpg
 *   street front: "Battery Maritime Building, New York 1.jpg", Mike Peel, CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Battery_Maritime_Building,_New_York_1.jpg
 *   street front from the east: "Battery Maritime Building.jpg", Beyond My Ken, CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Battery_Maritime_Building.jpg
 *   street front from the east, 2019: "South Ferry td (2019-07-07) 30 - Battery Maritime Building.jpg",
 *     Tdorante10, CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:South_Ferry_td_(2019-07-07)_30_-_Battery_Maritime_Building.jpg
 *   west end with the rooftop addition: "Battery Maritime Building (52302776365).jpg", Ajay Suresh, CC BY 2.0,
 *     https://commons.wikimedia.org/wiki/File:Battery_Maritime_Building_(52302776365).jpg
 *   loggia close-ups (colours): "Battery Maritime Building April 2022.jpg" and
 *     "Battery Maritime Building January 2023.jpg", Kidfly182, CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Battery_Maritime_Building_April_2022.jpg
 *     https://commons.wikimedia.org/wiki/File:Battery_Maritime_Building_January_2023.jpg
 *   river front from above, south-west (c. 2019, roof under construction): "Manhattan Island Ferry
 *     Terminals photo Don Ramey Logan.jpg", Don Ramey Logan, CC BY 4.0,
 *     https://commons.wikimedia.org/wiki/File:Manhattan_Island_Ferry_Terminals_photo_Don_Ramey_Logan.jpg
 *   Aerial plan: USGS NAIP (public domain).
 *
 * Numbers
 * - Measured (lidar, OSM): the footprint, the street level, every roof
 *   height listed above, the skylight's extent.
 * - Estimated from the frontal river photo, scaled to the OSM face length
 *   (97 m) and the lidar roof (21.7): three arch bays of 27 m between piers
 *   of 3.9 m (ends) and 4.2 m; the arch rings are wide elliptical arches
 *   (springing 8.1, crown 15.8, ring 1.6 m), the slip openings half-ellipses
 *   14.9 m wide springing at 6.75 (crown 13.0, width:rise 2.4:1), with a
 *   pale moulding; blue tile spandrels 12…16.3; the frieze of
 *   small windows 17…19.5; the cornice 20…21.7; the open loggia 21.7…24.6;
 *   the domed turrets over the four piers to 28.3; the glass addition
 *   21.7…29.5, set back 1.5 m behind the loggia (OSM height 29).
 * - Estimated from the street photos, scaled to the lidar eave (18.0):
 *   five bays of 16.4 m on South Street (three on the east end), the
 *   ground-floor segmental arches to 7.6, the balcony at 9.3, paired
 *   0.9 m columns with plinths, capitals and brackets 9.3…16.6 standing
 *   1.6 m in front of the upper wall, two tall window panels per bay
 *   (10…16), the green eave 16.6…18 overhanging the street by 1.5 m
 *   (about 1 m beyond the lidar's roof edge, so the eave reads from below).
 * - Colours from the daylight photos, pulled to the palette's lightness:
 *   the painted metal frame sage green, the arch fields rose pink, the
 *   upper wall of the head house ochre, the roof grey metal.
 *
 * Simplified: the frieze's mauve ground and the piers' purple lattice
 * panels are drawn in the window slate (no seventh material); the slips'
 * oval medallions, the ground-floor X panels, the brackets, balustrade
 * rails and lamp clusters are left out. The rooftop pergola at the west end
 * and the hotel's mechanical penthouse are left out.
 *
 * Doubts: the rooftop addition's exact height and setback (no lidar; from
 * one frontal photo and OSM's 29 m). The west end of the head house is
 * mostly hidden in photos by a newer clad block (not in OSM, not modelled)
 * and is drawn plain. The 6 m block in the west notch is drawn to its 2017
 * lidar height (11 m), not OSM's 27 m.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { type XY, prism, finishModel, capPoly } from './nyc-570-lexington'
import { block, band, dome } from './nyc-city-hall'

const green = new Part(), ochre = new Part(), pink = new Part(), roof = new Part(), win = new Part(), glass = new Part()
/** The pale grey-green of the arch rings, cornices and loggia: the roof's grey (no seventh material). */
const pale = roof

/** A planar polygon, wound so its normal points along `n`. */
function face(p: Part, pts: V3[], n: V3) {
  const a = pts[0], b = pts[1], c = pts[2]
  const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  const cr = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
  const q = cr[0] * n[0] + cr[1] * n[1] + cr[2] * n[2] < 0 ? [...pts].reverse() : pts
  for (let i = 1; i < q.length - 1; i++) p.tri(q[0], q[i], q[i + 1])
}

// ===========================================================================
// The slip block and its river front (y = -29, facing -y)
// ===========================================================================
const SX0 = -49.1, SX1 = 48.1, SF = -29.0, SB = -25.5, SN = -12.5, SROOF = 21.7
const S_ = (s: number) => SX0 + s // along-face position → x
const FACE_Y = (d: number) => SF - d // proud distance → y
const P = (s: number, z: number, d = 0): V3 => [S_(s), FACE_Y(d), z]
const DEP = SF - SB // the tunnels run 3.5 m in (negative = into the building)
const SOUTH: V3 = [0, -1, 0]

// Bays: end piers 3.9 m, inner piers 4.2 m, three arch bays of 27 m.
const LEN = SX1 - SX0 // 97.2
const ARCH = [17.4, 48.6, 79.8] // arch centres, s
const PIERS: [number, number][] = [[0, 3.9], [30.9, 35.1], [62.1, 66.3], [93.3, LEN]]
const HALF = 13.5 // half the clear span between piers
const RING_SPRING = 8.1, RING_RISE = 7.7, RING_W = 1.6
// The slip opening: a half-ellipse on jambs, 14.9 m wide springing at 6.75 m, crown 13.0 m
// (measured on the frontal river photo, width:rise 2.4:1; the outer ring is 27.6 x 7.7 m above its springing, 3.6:1).
const OPEN_R = 7.45, OPEN_SPRING = 6.75, OPEN_RISE = 6.25
const BASE = 3.0 // the green base course under the pink fields
const N_ARC = 12

const ell = (cx: number, a: number, zs: number, b: number, i: number, n = N_ARC): [number, number] => {
  const t = Math.PI - (Math.PI * i) / n
  return [cx + a * Math.cos(t), zs + b * Math.sin(t)]
}
/** Height of the ring's outer edge at offset o from an arch centre. */
const ringTop = (o: number) => RING_SPRING + RING_RISE * Math.sqrt(Math.max(0, 1 - (o / HALF) ** 2))

// The body behind the screen (its south wall is hidden by the screen).
prism({ wall: green, win: null, roof, ring: [[SX0, SB], [SX1, SB], [SX1, SN], [SX0, SN]], z0: 0, z1: SROOF, facade: null, bevel: 0.3 })

// The screen: the river wall from y = -29 to the body, with the three slip openings cut through it.
{
  const top = SROOF
  // Solid strips between the openings (and at the ends).
  const edges = [0, ...ARCH.flatMap((c) => [c - OPEN_R, c + OPEN_R]), LEN]
  for (let k = 0; k < edges.length; k += 2) {
    const s0 = edges[k], s1 = edges[k + 1]
    face(green, [P(s0, 0), P(s1, 0), P(s1, top), P(s0, top)], SOUTH)
  }
  for (const c of ARCH) {
    // Over each opening: strips from the semicircle up to the top.
    for (let i = 0; i < N_ARC; i++) {
      const [s0, z0] = ell(c, OPEN_R, OPEN_SPRING, OPEN_RISE, i), [s1, z1] = ell(c, OPEN_R, OPEN_SPRING, OPEN_RISE, i + 1)
      face(green, [P(s0, z0), P(s1, z1), P(s1, top), P(s0, top)], SOUTH)
    }
    // The tunnel through the screen, and the dark slip beyond.
    const outline: [number, number][] = [[c - OPEN_R, 0], [c - OPEN_R, OPEN_SPRING]]
    for (let i = 1; i < N_ARC; i++) outline.push(ell(c, OPEN_R, OPEN_SPRING, OPEN_RISE, i))
    outline.push([c + OPEN_R, OPEN_SPRING], [c + OPEN_R, 0])
    for (let i = 0; i < outline.length - 1; i++) {
      const [s0, z0] = outline[i], [s1, z1] = outline[i + 1]
      const mid: [number, number] = [(s0 + s1) / 2 - c, (z0 + z1) / 2 - OPEN_SPRING]
      const inward: V3 = mid[1] > 0.01 ? [-mid[0], 0, -mid[1]] : [s0 < c ? 1 : -1, 0, 0]
      face(green, [P(s0, z0, 0), P(s1, z1, 0), P(s1, z1, DEP), P(s0, z0, DEP)], inward)
    }
    face(win, outline.map(([s, z]) => P(s, z, DEP + 0.05)), SOUTH)
  }
  // Top and ends of the screen.
  face(roof, [P(0, top), P(LEN, top), P(LEN, top, DEP), P(0, top, DEP)], [0, 0, 1])
  face(green, [P(0, 0), P(0, top), P(0, top, DEP), P(0, 0, DEP)], [-1, 0, 0])
  face(green, [P(LEN, 0), P(LEN, top), P(LEN, top, DEP), P(LEN, 0, DEP)], [1, 0, 0])
}

// The pink fields inside each ring, around the opening.
for (const c of ARCH) {
  const a = HALF - RING_W, b = RING_RISE - RING_W, d = 0.05
  for (const side of [-1, 1]) {
    face(pink, [P(c + side * a, BASE, d), P(c + side * OPEN_R, BASE, d), P(c + side * OPEN_R, OPEN_SPRING, d), P(c + side * a, RING_SPRING, d)], SOUTH)
  }
  for (let i = 0; i < N_ARC; i++) {
    const [o0s, o0z] = ell(c, a, RING_SPRING, b, i), [o1s, o1z] = ell(c, a, RING_SPRING, b, i + 1)
    const [i0s, i0z] = ell(c, OPEN_R, OPEN_SPRING, OPEN_RISE, i), [i1s, i1z] = ell(c, OPEN_R, OPEN_SPRING, OPEN_RISE, i + 1)
    face(pink, [P(o0s, o0z, d), P(o1s, o1z, d), P(i1s, i1z, d), P(i0s, i0z, d)], SOUTH)
  }
}

// A pale moulding round each slip opening.
for (const c of ARCH) {
  const d = 0.2, w = 0.7
  for (let i = 0; i < N_ARC; i++) {
    const [a0, az0] = ell(c, OPEN_R + w, OPEN_SPRING, OPEN_RISE + w, i), [a1, az1] = ell(c, OPEN_R + w, OPEN_SPRING, OPEN_RISE + w, i + 1)
    const [b0, bz0] = ell(c, OPEN_R, OPEN_SPRING, OPEN_RISE, i), [b1, bz1] = ell(c, OPEN_R, OPEN_SPRING, OPEN_RISE, i + 1)
    face(pale, [P(a0, az0, d), P(a1, az1, d), P(b1, bz1, d), P(b0, bz0, d)], SOUTH)
  }
  for (const side of [-1, 1]) face(pale, [P(c + side * (OPEN_R + w), BASE, d), P(c + side * OPEN_R, BASE, d), P(c + side * OPEN_R, OPEN_SPRING, d), P(c + side * (OPEN_R + w), OPEN_SPRING, d)], SOUTH)
}

// The oval medallions either side of each slip opening.
for (const c of ARCH) {
  for (const side of [-1, 1]) {
    const s = c + side * 9.75, z = 6.6, n = 12
    for (let i = 0; i < n; i++) {
      const t0 = (i / n) * 2 * Math.PI, t1 = ((i + 1) / n) * 2 * Math.PI
      face(win, [P(s, z, 0.1), P(s + 0.75 * Math.cos(t0), z + 1.05 * Math.sin(t0), 0.1), P(s + 0.75 * Math.cos(t1), z + 1.05 * Math.sin(t1), 0.1)], SOUTH)
    }
  }
}

// The arch rings: a broad pale grey-green band standing 0.35 m proud, down to the base on jambs.
for (const c of ARCH) {
  const d = 0.35
  const outer = (i: number) => ell(c, HALF, RING_SPRING, RING_RISE, i)
  const inner = (i: number) => ell(c, HALF - RING_W, RING_SPRING, RING_RISE - RING_W, i)
  for (let i = 0; i < N_ARC; i++) {
    const [a0, az0] = outer(i), [a1, az1] = outer(i + 1), [b0, bz0] = inner(i), [b1, bz1] = inner(i + 1)
    face(pale, [P(a0, az0, d), P(a1, az1, d), P(b1, bz1, d), P(b0, bz0, d)], SOUTH)
    // Soffit of the ring (facing down into the arch) and its outer edge.
    face(pale, [P(b0, bz0, 0), P(b1, bz1, 0), P(b1, bz1, d), P(b0, bz0, d)], [c - (b0 + b1) / 2, 0, -1])
    face(pale, [P(a0, az0, 0), P(a1, az1, 0), P(a1, az1, d), P(a0, az0, d)], [(a0 + a1) / 2 - c, 0, 1])
  }
  for (const side of [-1, 1]) {
    const s0 = c + side * HALF, s1 = c + side * (HALF - RING_W)
    face(pale, [P(s0, BASE, d), P(s1, BASE, d), P(s1, RING_SPRING, d), P(s0, RING_SPRING, d)], SOUTH)
    face(pale, [P(s1, BASE, 0), P(s1, RING_SPRING, 0), P(s1, RING_SPRING, d), P(s1, BASE, d)], [-side, 0, 0])
  }
  // The keystone panel at the crown.
  block(pale, S_(c) - 1.3, FACE_Y(0.55), S_(c) + 1.3, FACE_Y(0), RING_SPRING + RING_RISE - RING_W - 0.6, RING_SPRING + RING_RISE + 0.2)
}

// Blue tile panels in the spandrels, two each side of every ring.
for (const c of ARCH) {
  for (const side of [-1, 1]) {
    for (const [o0, o1] of [[7.2, 9.6], [10.4, 12.9]]) {
      const z0 = ringTop(o0) + 0.5, z1 = 16.3
      const s0 = c + side * o0, s1 = c + side * o1
      face(win, [P(Math.min(s0, s1), z0, 0.05), P(Math.max(s0, s1), z0, 0.05), P(Math.max(s0, s1), z1, 0.05), P(Math.min(s0, s1), z1, 0.05)], SOUTH)
    }
  }
}

// The piers: green, a metre proud, with the tall lattice panel and a capital under the frieze.
for (const [s0, s1] of PIERS) {
  const end = s0 === 0 || s1 === LEN
  const y0 = FACE_Y(1.0), y1 = FACE_Y(0)
  prism({ wall: green, win: null, roof: green, ring: [[S_(s0), y0], [S_(s1), y0], [S_(s1), y1], [S_(s0), y1]], z0: 0, z1: SROOF - 1.0, facade: null, bevel: 0.25 })
  const m = (s0 + s1) / 2, w = (s1 - s0) * 0.5
  face(win, [P(m - w / 2, 4.2, 1.05), P(m + w / 2, 4.2, 1.05), P(m + w / 2, 15.6, 1.05), P(m - w / 2, 15.6, 1.05)], SOUTH)
  // Capital block over the frieze line.
  block(green, S_(s0) - 0.2, FACE_Y(1.35), S_(s1) + 0.2, FACE_Y(0), 16.6, 17.2)
  if (end) {
    // The end piers return round the corner: a lattice panel on the end face too.
    const x = s0 === 0 ? S_(0) - 0.05 : S_(LEN) + 0.05
    const n: V3 = [s0 === 0 ? -1 : 1, 0, 0]
    face(win, [[x, -29.6, 4.2], [x, -27.6, 4.2], [x, -27.6, 15.6], [x, -29.6, 15.6]], n)
  }
}

// The frieze of small windows, grouped four to an arch bay and one over each pier.
for (const c of ARCH) {
  for (const o of [-10.2, -3.4, 3.4, 10.2]) {
    face(win, [P(c + o - 2.6, 17.4, 0.05), P(c + o + 2.6, 17.4, 0.05), P(c + o + 2.6, 19.3, 0.05), P(c + o - 2.6, 19.3, 0.05)], SOUTH)
  }
}
// String course under the frieze and the cornice over it, along the river face and round the ends.
{
  const ring: XY[] = [[SX0, SF], [SX1, SF], [SX1, SN], [SX0, SN]]
  band(pale, ring, 16.6, 17.0, 0.3)
  band(pale, ring, 19.9, 20.7, 0.75)
  band(pale, ring, 20.7, 21.3, 0.45)
}

// End faces of the slip block: ochre panels in the green frame, with tall narrow windows.
for (const [x, n] of [[SX0 - 0.05, -1], [SX1 + 0.05, 1]] as [number, number][]) {
  const N: V3 = [n, 0, 0]
  face(ochre, [[x, -26.6, 3.0], [x, -14.2, 3.0], [x, -14.2, 16.2], [x, -26.6, 16.2]], N)
  for (const y of [-23.6, -20.4, -17.2]) {
    const xx = x + n * 0.05
    face(win, [[xx, y - 0.55, 6.0], [xx, y + 0.55, 6.0], [xx, y + 0.55, 14.2], [xx, y - 0.55, 14.2]], N)
    face(win, [[xx, y - 0.8, 17.4], [xx, y + 0.8, 17.4], [xx, y + 0.8, 19.3], [xx, y - 0.8, 19.3]], N)
  }
}

// --- The roof: the open loggia, the four domed turrets, and the hotel's glass storey ---
{
  const z0 = SROOF, rail = 22.7, postTop = 24.2, beam = 24.7
  const ly = SF + 0.35 // the loggia's line
  // Balustrade: a low wall along the river and round both ends.
  const runs: [V3, V3][] = [
    [[SX0 + 0.35, ly, 0], [SX1 - 0.35, ly, 0]],
    [[SX0 + 0.35, ly, 0], [SX0 + 0.35, SN - 1.0, 0]],
    [[SX1 - 0.35, ly, 0], [SX1 - 0.35, SN - 1.0, 0]],
  ]
  for (const [a, b] of runs) {
    const t = 0.35, along = a[0] === b[0]
    const x0 = Math.min(a[0], b[0]) - (along ? t / 2 : 0), x1 = Math.max(a[0], b[0]) + (along ? t / 2 : 0)
    const y0 = Math.min(a[1], b[1]) - (along ? 0 : t / 2), y1 = Math.max(a[1], b[1]) + (along ? 0 : t / 2)
    block(pale, x0, y0, x1, y1, z0, rail)
    // Pergola beam on posts over it.
    block(pale, x0 - 0.05, y0 - 0.05, x1 + 0.05, y1 + 0.05, postTop, beam)
    const L = Math.max(x1 - x0, y1 - y0), n = Math.round(L / 3.4)
    for (let k = 0; k <= n; k++) {
      const t2 = k / n, x = along ? a[0] : x0 + (x1 - x0) * t2, y = along ? y0 + (y1 - y0) * t2 : a[1]
      block(pale, x - 0.25, y - 0.25, x + 0.25, y + 0.25, rail, postTop)
    }
  }
  // Turrets over the four piers: a square kiosk, a cornice and a dome.
  for (const [s0, s1] of PIERS) {
    const m = S_((s0 + s1) / 2), cy = SF + 0.4, h = 1.75
    const ring: XY[] = [[m - h, cy - h], [m + h, cy - h], [m + h, cy + h], [m - h, cy + h]]
    prism({ wall: pale, win: null, roof: pale, ring, z0, z1: 25.6, facade: null, bevel: 0.2 })
    face(win, [[m - 0.8, cy - h - 0.05, 22.6], [m + 0.8, cy - h - 0.05, 22.6], [m + 0.8, cy - h - 0.05, 24.9], [m - 0.8, cy - h - 0.05, 24.9]], SOUTH)
    band(pale, ring, 25.2, 25.8, 0.25)
    dome(green, m, cy, 1.45, 25.8, 1.9, 10, 3)
    block(green, m - 0.15, cy - 0.15, m + 0.15, cy + 0.15, 27.6, 28.3)
  }
  // The hotel's glass storey, set back behind the loggia.
  const gx0 = SX0 + 4.4, gx1 = SX1 - 4.4, gy0 = SF + 1.9, gy1 = SN - 0.5
  prism({ wall: glass, win: null, roof, ring: [[gx0, gy0], [gx1, gy0], [gx1, gy1], [gx0, gy1]], z0, z1: 29.5, facade: null, bevel: 0.3 })
  band(roof, [[gx0, gy0], [gx1, gy0], [gx1, gy1], [gx0, gy1]], 28.9, 29.6, 0.2)
  // Floor line of the glass storey's upper level and a few mullions, in the frame's green.
  for (const x of [-24, 0, 24]) block(green, x - 0.2, gy0 - 0.12, x + 0.2, gy0, z0, 29.0)
}

// ===========================================================================
// The head house on South Street
// ===========================================================================
const HN = 31.3, HE = 41.1, HW = -41.0, HWS = -39.0, HS = SN
const LOW: XY[] = [[HWS, HS], [HE, HS], [HE, HN], [HW, HN], [HW, 22.2], [HWS, 22.2]]
const SET = 1.6 // the upper wall stands behind the loggia columns on the north and east fronts
const UP: XY[] = [[HWS, HS], [HE - SET, HS], [HE - SET, HN - SET], [HW, HN - SET], [HW, 22.2], [HWS, 22.2]]
const GROUND_TOP = 9.3, LOGGIA = 9.3, COL_TOP = 16.6, EAVE = 18.0, RIDGE = 21.4, STREET = 2.7

// Ground storey: the green iron arcade, with the street arches dark.
prism({ wall: green, win: null, roof: null, ring: LOW, z0: 0, z1: GROUND_TOP, facade: null, bevel: 0.3 })
capPoly(green, LOW, GROUND_TOP, true)
band(green, LOW, 7.6, 8.9, 0.3) // entablature over the arches
band(green, LOW, 8.9, GROUND_TOP + 0.3, 0.7) // the balcony slab

/** A segmental arch panel on a wall a→b at centre s, half-width w, from z0, springing zs, crown zs + rise. */
function segArch(p: Part, a: XY, b: XY, s: number, w: number, z0: number, zs: number, rise: number, d = 0.05, n = 8) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L
  const at = (ss: number, z: number): V3 => [a[0] + ux * ss + uy * d, a[1] + uy * ss - ux * d, z]
  const R = (w * w + rise * rise) / (2 * rise), cz = zs + rise - R, th = Math.asin(w / R)
  const pts: V3[] = [at(s - w, z0), at(s + w, z0)]
  for (let i = 0; i <= n; i++) { const t = th - (2 * th * i) / n; pts.push(at(s + R * Math.sin(t), cz + R * Math.cos(t))) }
  for (let i = 1; i < pts.length - 1; i++) p.tri(pts[0], pts[i], pts[i + 1])
}

// North front: five bays of 16.4 m; a pier under each column pair, a segmental arch in each bay.
const NB = [-41, -24.6, -8.2, 8.2, 24.6, 41] // bay lines
const EB = [-12.5, 2.1, 16.7, 31.3]
{
  const a: XY = [HE, HN], b: XY = [HW, HN] // north face runs east→west (counter-clockwise ring)
  for (let k = 0; k < 5; k++) {
    const x0 = NB[k], x1 = NB[k + 1], cx = (x0 + x1) / 2
    segArch(win, a, b, HE - cx, 6.2, STREET, 5.8, 1.9, 0.05)
    // Piers: proud green blocks between the arches.
    block(green, x0 - 1.3, HN, x0 + 1.3, HN + 0.4, 0, 7.6)
  }
  block(green, HE - 2.6, HN, HE, HN + 0.4, 0, 7.6)
  // East front: three bays.
  const ea: XY = [HE, HS], eb: XY = [HE, HN]
  for (let k = 0; k < 3; k++) {
    const y0 = EB[k], y1 = EB[k + 1], cy = (y0 + y1) / 2
    segArch(win, ea, eb, cy - HS, 5.2, STREET, 5.8, 1.7, 0.05)
    if (k > 0) block(green, HE, y0 - 1.3, HE + 0.4, y0 + 1.3, 0, 7.6)
  }
  // West end: two plain arched doorways.
  const wa: XY = [HWS, 22.2], wb: XY = [HWS, HS]
  for (const s of [10, 24]) segArch(win, wa, wb, s, 3.0, STREET, 5.8, 1.2, 0.05)
}

// Upper storey: ochre wall set back behind the loggia, big wood-framed window groups.
prism({ wall: ochre, win: null, roof: null, ring: UP, z0: GROUND_TOP, z1: EAVE, facade: null, bevel: 0.3 })
{
  const zn = HN - SET + 0.05
  // Two tall window panels per bay, each spanning both window tiers (10.0…16.0).
  for (let k = 0; k < 5; k++) {
    const cx = (NB[k] + NB[k + 1]) / 2
    for (const o of [-3.2, 3.2]) face(win, [[cx + o + 2.6, zn, 10.0], [cx + o - 2.6, zn, 10.0], [cx + o - 2.6, zn, 16.0], [cx + o + 2.6, zn, 16.0]], [0, 1, 0])
  }
  const xe = HE - SET + 0.05
  for (let k = 0; k < 3; k++) {
    const cy = (EB[k] + EB[k + 1]) / 2
    for (const o of [-2.9, 2.9]) face(win, [[xe, cy + o - 2.3, 10.0], [xe, cy + o + 2.3, 10.0], [xe, cy + o + 2.3, 16.0], [xe, cy + o - 2.3, 16.0]], [1, 0, 0])
  }
  const xw = HWS - 0.05
  for (const y of [-2, 11]) face(win, [[xw, y - 3.5, 10.0], [xw, y + 3.5, 10.0], [xw, y + 3.5, 16.0], [xw, y - 3.5, 16.0]], [-1, 0, 0])
}

// The loggia's paired columns, dark green, at every bay line on the north and east fronts.
{
  // Each column: a 0.9 m shaft, a plinth block and a wider capital, a bracket out to the eave.
  const col = (x: number, y: number, bx = 0, by = 0) => {
    block(green, x - 0.65, y - 0.65, x + 0.65, y + 0.65, LOGGIA, LOGGIA + 0.8)
    block(green, x - 0.45, y - 0.45, x + 0.45, y + 0.45, LOGGIA + 0.8, COL_TOP - 0.7)
    block(green, x - 0.7, y - 0.7, x + 0.7, y + 0.7, COL_TOP - 0.7, COL_TOP)
    if (bx || by) block(green, x - (by ? 0.3 : 0), y - (bx ? 0.3 : 0), x + (by ? 0.3 : bx * 1.5), y + (bx ? 0.3 : by * 1.5), COL_TOP - 1.1, COL_TOP)
  }
  const yc = HN - 0.5, xc = HE - 0.5
  for (const x of NB) {
    if (x === 41) continue
    for (const dx of [-1.0, 1.0]) col(Math.max(HW + 0.7, x + dx), yc, 0, 1)
  }
  for (const y of EB) {
    if (y === -12.5) { col(xc, y + 1.4, 1, 0); continue }
    for (const dy of [-1.0, 1.0]) col(xc, Math.min(HN - 0.6, y + dy), 1, 0)
  }
  col(xc - 1.6, yc) // the corner cluster
  col(xc, yc - 1.6)
}

// The deep eave: a green fascia over the columns, overhanging the street by 1.5 m on brackets.
const OV = 1.5
const CORN: XY[] = [[HWS - 0.6, HS], [HE + OV, HS], [HE + OV, HN + OV], [HW - 0.6, HN + OV], [HW - 0.6, 22.2], [HWS - 0.6, 22.2]]
prism({ wall: green, win: null, roof: null, ring: CORN, z0: COL_TOP, z1: EAVE, facade: null, bevel: 0.25 })
capPoly(green, CORN, COL_TOP, false)
capPoly(roof, CORN, EAVE, true)

// The perimeter roof: grey metal slopes on the north and east fronts, hipped at the west end.
{
  const ox = HE + OV, oy = HN + OV, wx = HW - 0.6
  const rx = ox - 5.8, ry = oy - 5.8, ix = ox - 9.3, iy = oy - 9.3
  const up: V3 = [0, 0, 1]
  face(roof, [[wx, oy, EAVE], [ox, oy, EAVE], [rx, ry, RIDGE], [wx + 5.8, ry, RIDGE]], [0, 1, 1])
  face(roof, [[wx + 5.8, ry, RIDGE], [rx, ry, RIDGE], [ix, iy, EAVE], [wx, iy, EAVE]], [0, -1, 1])
  face(roof, [[wx, iy, EAVE], [wx, oy, EAVE], [wx + 5.8, ry, RIDGE]], [-1, 0, 1])
  face(roof, [[ox, oy, EAVE], [ox, HS, EAVE], [rx, HS, RIDGE], [rx, ry, RIDGE]], [1, 0, 1])
  face(roof, [[rx, ry, RIDGE], [rx, HS, RIDGE], [ix, HS, EAVE], [ix, iy, EAVE]], [-1, 0, 1])
  void up
}

// The central skylight: a long glass gable over the waiting room.
{
  const x0 = -23.3, x1 = 24.4, y0 = -3.0, y1 = 17.0, ym = 7.0, zr = 22.9
  face(glass, [[x0, y0, EAVE], [x1, y0, EAVE], [x1, ym, zr], [x0, ym, zr]], [0, -1, 1])
  face(glass, [[x0, ym, zr], [x1, ym, zr], [x1, y1, EAVE], [x0, y1, EAVE]], [0, 1, 1])
  face(green, [[x0, y0, EAVE], [x0, ym, zr], [x0, y1, EAVE]], [-1, 0, 0])
  face(green, [[x1, y0, EAVE], [x1, ym, zr], [x1, y1, EAVE]], [1, 0, 0])
  block(green, x0, ym - 0.25, x1, ym + 0.25, zr - 0.1, zr + 0.35)
}

// The small block in the west notch (2017 lidar height).
prism({ wall: green, win: null, roof, ring: [[-46.7, -10.6], [HWS, -10.6], [HWS, -4.2], [-46.7, -4.2]], z0: 0, z1: 11.0, facade: null, bevel: 0.25 })

finishModel('Battery Maritime Building', 'nyc-battery-maritime-building', [
  { part: green, material: finish('bmb-green', 0x6c8a70) },
  { part: ochre, material: finish('bmb-ochre', 0xdcc48e) },
  { part: pink, material: finish('bmb-rose', 0xdba0a0) },
  { part: roof, material: PALETTE.roof },
  { part: win, material: PALETTE.window },
  { part: glass, material: windowVariant(2, 0xa9c3d6) },
], { bearing: 343.3, osm: 'way/169362470', height: 29.5 }, 6500)
