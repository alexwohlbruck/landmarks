/**
 * Old City Hall, Toronto (1899, E. J. Lennox) — original procedural
 * geometry, CC0-1.0.
 * bun generators/tor-old-city-hall.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground. Bearing 343.5: the building is square to Toronto's grid,
 * 16.5 degrees west of north, and is built in that turned frame (its -y
 * face is the Queen Street front). Anchor = centroid of the outer way of
 * OSM relation/3116 (way/12906398): -79.381764, 43.6526419. Elevation 0.
 *
 * Identity (from the photos below):
 *  1. The clock tower on the Queen Street front, west of centre on the Bay
 *     Street axis: a plain banded shaft, a belfry of three tall arches a
 *     side, the clock stage with four round faces and corner pinnacles,
 *     and a steep pyramid spire.                       (taxi, delso, vagen)
 *  2. A hollow square block in brown-pink and buff Credit Valley sandstone
 *     under steep grey-green metal roofs, its corners held by four taller
 *     pavilions with steep hipped roofs and wall gables. (sokolov, vagen)
 *  3. The round turret with its conical cap beside the three-arched
 *     entrance porch and the front steps.                       (taxi)
 *  4. The mid pavilions on the west and east sides with their cross
 *     gables and small pyramid-roofed towers, and the two belvederes over
 *     the courtyard.                                      (sokolov, vagen)
 *
 * Plan: OSM relation/3116 (outer way/12906398, the courtyard inner
 * way/12906420) and its building:part ways 969693598-969693660 and
 * way/178252639, turned into the frame; every block below is drawn on its
 * OSM part's rectangle.
 * Heights:
 *  - published: the tower, 103.6 m (Wikipedia, "Old City Hall (Toronto)";
 *    OSM way/969693598). City of Toronto 3D Massing 2025 gives the tower's
 *    clock-stage top (lidar) at 90.5 m, which the model meets (89.5).
 *  - the tower's stages, photo-scaled against that height (taxi, delso):
 *    shaft to 60, belfry to 79, clock stage to 89.5, spire to 103.6;
 *    clock faces 6 m across.
 *  - the rest is OSM's part heights scaled by 0.8: OSM puts the main eaves
 *    at 28 m and the ridges at 47.5, the pavilions' eaves at 37 and their
 *    tops at 55. In taxi the turret (6.8 m across, OSM) scales its own wall
 *    to about 28 m against OSM's 34 and the main eave to about 21; the
 *    city massing's average height (26.9 m over the footprint and
 *    courtyard) also needs eaves near 21. Drawn: main eaves 21, ridges 38;
 *    pavilions 28.5 / 45; mid pavilions 28.5 with cross gables to 38;
 *    side towers 31 / 40; belvederes 42.5 / 46.5; turret 28 / 37; the
 *    porch 10.5 with its floor 2.3 up (OSM steps parts, height 2).
 *  - windows: rows and bays from taxi, delso and sokolov, simplified to
 *    three rows on the wings and four on the pavilions.
 * Colour (revised after review): the sandstone is a warm rosy tan in sun
 * (taxi, vagen), drawn #cfa892; the rusticated base storey (to 5.4 m), the
 * string courses and cornices a darker red-brown, #a26c5b.
 * Estimated: the wall gables' size (one per wing span, two per pavilion), the band heights, the chimneys.
 * Left out: the gargoyles, the small dormers on the main roofs, the
 * courtyard facades' windows, carving.
 *
 * Ground: Mapterhorn rises about 1 m from the Queen Street steps to the
 * north side; the map puts y = 0 at the lowest ground (the front) and the
 * north walls sink about 1 m. Queen Street at the foot of the steps is about
 * 0.85 m over that lowest point (terrain check), so the three flights have
 * tops at 1.1, 1.7 and 2.3 m, the porch floor.
 *
 * Night: the stone is floodlit (`_FLOODLIGHT`, strongest on the tower and
 * the front); the clock faces and windows are `window`; the porch arches
 * are `entrance`.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  taxi     "Toronto - ON - Old City Hall.jpg", Taxiarchos228, CC BY 3.0
 *           (from Queen and Bay, south-east)
 *           https://commons.wikimedia.org/wiki/File:Toronto_-_ON_-_Old_City_Hall.jpg
 *  delso    "Old City Hall, Toronto, Canada2.jpg", Diego Delso, CC BY-SA 3.0
 *           (the south-west pavilion and the tower, from the west)
 *           https://commons.wikimedia.org/wiki/File:Old_City_Hall,_Toronto,_Canada2.jpg
 *  sokolov  "Old Toronto City Hall (view from the new City Hall).jpg",
 *           Maksim Sokolov, CC BY-SA 4.0 (from the north-west)
 *           https://commons.wikimedia.org/wiki/File:Old_Toronto_City_Hall_(view_from_the_new_City_Hall).jpg
 *  vagen    "Old Toronto City Hall August 2017 03.jpg", Arild Vågen,
 *           CC BY-SA 4.0 (from high in the north-east; the roofs)
 *           https://commons.wikimedia.org/wiki/File:Old_Toronto_City_Hall_August_2017_03.jpg
 * Massing: City of Toronto, 3D Massing 2025,
 * https://open.toronto.ca/dataset/3d-massing/ (Open Government Licence –
 * Toronto). No look-only sources. No commercial imagery.
 *
 * Doubts: the 0.8 scaling of OSM's heights rests on perspective readings of
 * taxi and on the massing average; the tower's stage heights are
 * photo-scaled; the courtyard (now partly built over, OSM way/969693615) is
 * drawn open but for that one-storey block.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { archShape, gableRoof, hipRoof, onWall, pyramid, rectShape, revolve } from './atl-tech-tower'
import { at, box, ccw, circle, cornice, offset, prism, save, smoothWall, wall, type XY } from './atl-flatiron-building'

const stone = new Part(), band = new Part(), roof = new Part(), win = new Part(), door = new Part(), trim = new Part()

// ── Heights ──
const E = 21, RIDGE = 38 // main wings
const PE = 28.5, PTOP = 45 // corner pavilions
const SHAFT = 60, BELFRY = 79, CLOCK = 89.5, TIP = 103.6 // the tower
const STEP = 2.3 // the porch floor over the lowest ground

// ── Plan (turned frame) ──
const O: XY[] = [[-40.3, -37.7], [40.4, -37.7], [40.4, 41.6], [-40.3, 41.6]] // outer wall line of the wings
const I: XY[] = [[-15.6, -13.3], [15.7, -13.3], [15.6, 24.9], [-15.8, 24.9]] // the courtyard
const RG: XY[] = [[-29.8, -27.6], [29.8, -27.6], [29.8, 33.3], [-29.8, 33.3]] // the ridge ring
type Rect = [number, number, number, number] // x0, x1, y0, y1
const PAVS: Rect[] = [[-43.9, -27.1, -41.3, -21.8], [27.8, 44.1, -41.5, -21.7], [-44.1, -27.7, 25.4, 44.4], [27.4, 44.2, 25.1, 44.2]]
const TOWER: Rect = [-15.1, -5.6, -43.3, -33.4]

/** The four faces of a rectangle as [a, b] pairs with the outside to the right, and their outward names. */
function faces([x0, x1, y0, y1]: Rect): { a: XY; b: XY; side: 'S' | 'E' | 'N' | 'W' }[] {
  return [
    { a: [x0, y0], b: [x1, y0], side: 'S' },
    { a: [x1, y0], b: [x1, y1], side: 'E' },
    { a: [x1, y1], b: [x0, y1], side: 'N' },
    { a: [x0, y1], b: [x0, y0], side: 'W' },
  ]
}
const rectRing = ([x0, x1, y0, y1]: Rect): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
const len2 = (a: XY, b: XY) => Math.hypot(b[0] - a[0], b[1] - a[1])

/** A string course in the band stone round a rectangle. */
function course(r: Rect, z: number, h = 0.6, out = 0.15) {
  const [x0, x1, y0, y1] = r
  prism(band, rectRing([x0 - out, x1 + out, y0 - out, y1 + out]), z, z + h, null, 0)
}

/** The darker rusticated base storey: a red-brown skin 3 cm proud of the wall, under the windows' panels. */
const BASE_TOP = 5.4
const baseSkin = (r: XY[]) => prism(band, offset(ccw(r), 0.03), 0, BASE_TOP, null, 0)

type Row = { z0: number; z1: number; arch?: boolean; w: number; bay: number }
/** Window rows along a wall span from a to b (outside to the right), `margin` clear at each end. */
function windows(a: XY, b: XY, rows: Row[], margin = 1.5) {
  const L = len2(a, b)
  for (const r of rows) {
    const n = Math.max(1, Math.round((L - 2 * margin) / r.bay))
    if (L - 2 * margin < r.w) continue
    const step = (L - 2 * margin) / n
    for (let k = 0; k < n; k++) {
      const s = margin + step * (k + 0.5)
      const shape = r.arch ? archShape(s, r.w, r.z0, r.z1 - r.w / 2, 6) : rectShape(s - r.w / 2, s + r.w / 2, r.z0, r.z1)
      onWall(win, a, b, shape, 0.06)
    }
  }
}

const WING_ROWS: Row[] = [
  { z0: 1.8, z1: 4.4, w: 1.5, bay: 3.6 },
  { z0: 6.4, z1: 11.6, arch: true, w: 1.7, bay: 3.6 },
  { z0: 13.4, z1: 17.6, w: 1.5, bay: 3.6 },
]
const PAV_ROWS: Row[] = [
  { z0: 1.8, z1: 4.4, w: 1.6, bay: 3.8 },
  { z0: 6.3, z1: 10.6, w: 1.6, bay: 3.8 },
  { z0: 12.6, z1: 20.4, arch: true, w: 3.4, bay: 7.5 },
  { z0: 22.4, z1: 26.0, arch: true, w: 1.1, bay: 2.1 },
]

/**
 * A wall gable on the face a→b (axis-aligned, outside to the right): a
 * stone box half-width W and depth D at the face's middle, from just under
 * the eave z to z + up, under a gable roof rising `peak` over z, with a
 * window in it.
 */
function wallGable(a: XY, b: XY, z: number, W: number, D: number, up: number, peak: number, at = 0.5) {
  const t: XY = [(b[0] - a[0]) / len2(a, b), (b[1] - a[1]) / len2(a, b)], n: XY = [t[1], -t[0]]
  const s = len2(a, b) * at, c: XY = [a[0] + t[0] * s, a[1] + t[1] * s]
  const p1: XY = [c[0] - t[0] * W, c[1] - t[1] * W], p2: XY = [c[0] + t[0] * W - n[0] * D, c[1] + t[1] * W - n[1] * D]
  const x0 = Math.min(p1[0], p2[0]), x1 = Math.max(p1[0], p2[0]), y0 = Math.min(p1[1], p2[1]), y1 = Math.max(p1[1], p2[1])
  box(stone, x0, x1, y0, y1, z - 1, z + up, null, 0)
  gableRoof(roof, stone, x0, x1, y0, y1, z + up, z + peak, Math.abs(t[0]) > 0.5 ? 'y' : 'x', 0.3, 0.2)
  onWall(win, a, b, rectShape(s - W * 0.45, s + W * 0.45, z + 0.2, z + up + 0.1), 0.06)
}

// ── The wings round the courtyard ──
wall(stone, O, 0, E)
baseSkin(O)
wall(stone, [...I].reverse(), 0, E) // the courtyard walls face inward
cornice(band, O, E - 0.9, 0.9, 0.5, null)
roof.loft([at(O, E), at(RG, RIDGE)])
roof.loft([at(RG, RIDGE), at(I, E)])
for (const z of [5.4, 12.6]) prism(band, O.map(([x, y]): XY => [x + Math.sign(x) * 0.15, y + Math.sign(y - 2) * 0.15]), z, z + 0.6, null, 0)
// Wing facades between the pavilions and projections.
windows([-27.1, -37.7], [-15.1, -37.7], WING_ROWS)
windows([15.9, -37.7], [27.8, -37.7], WING_ROWS)
windows([27.5, 41.6], [8.7, 41.6], WING_ROWS)
windows([-9.0, 41.6], [-27.7, 41.6], WING_ROWS)
windows([-40.3, 25.4], [-40.3, 13.8], WING_ROWS)
windows([-40.3, -10.5], [-40.3, -21.8], WING_ROWS)
windows([40.4, -21.7], [40.4, -9.8], WING_ROWS)
windows([40.4, 14.3], [40.4, 25.1], WING_ROWS)
// One wall gable over each wing span (taxi, sokolov, vagen).
for (const [a, b] of [[[-27.1, -37.7], [-15.1, -37.7]], [[15.9, -37.7], [27.8, -37.7]], [[27.5, 41.6], [8.7, 41.6]], [[-9.0, 41.6], [-27.7, 41.6]],
  [[-40.3, 25.4], [-40.3, 13.8]], [[-40.3, -10.5], [-40.3, -21.8]], [[40.4, -21.7], [40.4, -9.8]], [[40.4, 14.3], [40.4, 25.1]]] as [XY, XY][]) wallGable(a, b, E, 2.6, 4, 3.5, 8)

// The north entrance block, the stair turret and the one-storey block in the courtyard.
prism(stone, rectRing([-9.0, 8.7, 41.0, 44.9]), 0, E, roof, 0.3)
windows([8.7, 44.9], [-9.0, 44.9], WING_ROWS)
wallGable([8.7, 44.9], [-9.0, 44.9], E, 4.5, 6, 4, 10)
box(stone, -9.3, -1.3, 21.5, 25.3, 0, E, roof, 0.3)
box(stone, 4.8, 15.5, 14.1, 25.3, 0, 5.5, roof, 0.3)

// ── Corner pavilions ──
for (const r of PAVS) {
  const [x0, x1, y0, y1] = r
  prism(stone, rectRing(r), 0, PE, null, 0)
  baseSkin(rectRing(r))
  cornice(band, rectRing(r), PE - 1.0, 1.0, 0.5, null)
  course(r, 5.4); course(r, 11.8)
  hipRoof(roof, x0, x1, y0, y1, PE, PTOP, 0.5)
  for (const f of faces(r)) {
    const outward = (f.side === 'S' && y0 < 0) || (f.side === 'N' && y0 > 0) || (f.side === 'W' && x0 < 0) || (f.side === 'E' && x0 > 0)
    if (!outward) continue
    windows(f.a, f.b, PAV_ROWS, 1.6)
    // A wall gable rising through the eave at the middle of each outer face.
    wallGable(f.a, f.b, PE, 3.6, 4.5, 4.5, 9.5)
  }
}

// ── Mid pavilions on the west and east sides, with their small towers ──
for (const s of [-1, 1]) {
  const xo = s < 0 ? -43.2 : 43.0, xi = s * 29.6, y0 = s < 0 ? -4.9 : -4.4, y1 = s < 0 ? 8.1 : 8.6
  const x0 = Math.min(xo, xi), x1 = Math.max(xo, xi)
  prism(stone, rectRing([x0, x1, y0, y1]), 0, PE, null, 0)
  baseSkin(rectRing([x0, x1, y0, y1]))
  cornice(band, rectRing([x0, x1, y0, y1]), PE - 1.0, 1.0, 0.5, null)
  course([x0, x1, y0, y1], 5.4); course([x0, x1, y0, y1], 11.8)
  gableRoof(roof, stone, x0, x1, y0, y1, PE, RIDGE, 'x', 0.5, 0.3)
  const a: XY = s < 0 ? [xo, y1] : [xo, y0], b: XY = s < 0 ? [xo, y0] : [xo, y1]
  windows(a, b, PAV_ROWS, 1.4)
  for (const [ty0, ty1] of s < 0 ? [[-10.5, -4.8], [8.1, 13.8]] : [[-9.8, -4.4], [8.5, 14.3]]) {
    const tx0 = s < 0 ? -44.0 : 38.0, tx1 = s < 0 ? -38.3 : 43.3
    prism(stone, rectRing([tx0, tx1, ty0, ty1]), 0, 31, null, 0)
    baseSkin(rectRing([tx0, tx1, ty0, ty1]))
    cornice(band, rectRing([tx0, tx1, ty0, ty1]), 30.2, 0.8, 0.35, null)
    pyramid(roof, [(tx0 + tx1) / 2, (ty0 + ty1) / 2], (tx1 - tx0) / 2 + 0.3, 31, 40)
    const fa: XY = s < 0 ? [tx0, ty1] : [tx1, ty0], fb: XY = s < 0 ? [tx0, ty0] : [tx1, ty1]
    windows(fa, fb, [{ z0: 24, z1: 28.8, arch: true, w: 1.0, bay: 1.8 }], 0.9)
  }
}

// ── The belvederes over the courtyard's north corners ──
for (const [bx0, bx1, by0, by1] of [[15.5, 21.7, 21.9, 28.8], [-21.9, -15.8, 21.6, 28.3]] as Rect[]) {
  prism(stone, rectRing([bx0, bx1, by0, by1]), 0, 42.5, null, 0)
  pyramid(roof, [(bx0 + bx1) / 2, (by0 + by1) / 2], (bx1 - bx0) / 2 + 0.3, 42.5, 46.5)
  for (const f of faces([bx0, bx1, by0, by1])) windows(f.a, f.b, [{ z0: 38.5, z1: 41.6, arch: true, w: 1.0, bay: 1.8 }], 0.9)
}

// ── Chimneys on the ridges ──
for (const [x, y] of [[-29.8, -12], [-29.8, 18], [29.8, -12], [29.8, 18], [-12, -27.6], [12, 33.3]] as XY[]) box(band, x - 0.8, x + 0.8, y - 1.1, y + 1.1, RIDGE - 4, RIDGE + 2.5, band, 0.15)

// ── The clock tower ──
{
  const [x0, x1, y0, y1] = TOWER, cx = (x0 + x1) / 2, cy = (y0 + y1) / 2
  prism(stone, rectRing(TOWER), 0, SHAFT, null, 0)
  baseSkin(rectRing(TOWER))
  for (const z of [5.4, 11.8, 20.4, 32, 44, 52]) course(TOWER, z, 0.6, 0.12)
  // the corbelled ledge under the belfry
  prism(band, rectRing([x0 - 0.5, x1 + 0.5, y0 - 0.5, y1 + 0.5]), SHAFT - 0.4, SHAFT + 0.9, stone, 0.25, true)
  prism(stone, rectRing(TOWER), SHAFT + 0.9, BELFRY, null, 0)
  for (const f of faces(TOWER)) {
    const L = len2(f.a, f.b)
    for (let k = 0; k < 3; k++) onWall(win, f.a, f.b, archShape(L * (k + 0.5) / 3, 1.9, SHAFT + 3, BELFRY - 3.5, 6), 0.06)
    for (let k = 0; k < 5; k++) onWall(win, f.a, f.b, archShape(L * (k + 0.5) / 5, 0.9, BELFRY - 2.3, BELFRY - 1.2, 4), 0.06)
  }
  // the gargoyle cornice and the clock stage
  prism(band, rectRing([x0 - 0.7, x1 + 0.7, y0 - 0.7, y1 + 0.7]), BELFRY, BELFRY + 1.0, stone, 0.3, true)
  const ci: Rect = [x0 + 0.3, x1 - 0.3, y0 + 0.3, y1 - 0.3]
  prism(stone, rectRing(ci), BELFRY + 1.0, CLOCK, null, 0)
  prism(band, rectRing([ci[0] - 0.4, ci[1] + 0.4, ci[2] - 0.4, ci[3] + 0.4]), CLOCK - 0.8, CLOCK, stone, 0.2, true)
  for (const f of faces(ci)) {
    const L = len2(f.a, f.b), zc = BELFRY + 5.4
    onWall(trim, f.a, f.b, circle([L / 2, zc], 3.4, 16).map(([s, z]) => [s, z] as [number, number]), 0.05)
    onWall(win, f.a, f.b, circle([L / 2, zc], 2.9, 16).map(([s, z]) => [s, z] as [number, number]), 0.1)
  }
  // corner pinnacles
  for (const [px, py] of [[ci[0], ci[2]], [ci[1], ci[2]], [ci[0], ci[3]], [ci[1], ci[3]]] as XY[]) {
    smoothWall(stone, circle([px, py], 0.75, 8), BELFRY + 1.0, CLOCK - 1.5)
    revolve(roof, [px, py], [[0.9, CLOCK - 1.5], [0.85, CLOCK - 0.6], [0, CLOCK + 1.3]], 8)
  }
  // the spire
  pyramid(roof, [cx, cy], (x1 - x0) / 2 - 0.1, CLOCK, TIP)
}

// ── The round turret east of the porch ──
{
  const c: XY = [12.5, -40.15]
  smoothWall(stone, circle(c, 3.4, 14), 0, 28)
  smoothWall(band, circle(c, 3.43, 14), 0, BASE_TOP)
  revolve(band, c, [[3.75, 27.2], [3.75, 28.2]], 14)
  revolve(roof, c, [[3.9, 28.2], [3.0, 29.6], [0, 37]], 14, 0, false, false)
  for (const z of [5.4, 11.8, 20.4]) revolve(band, c, [[3.55, z], [3.55, z + 0.5]], 14, 0, false, false)
}

// ── The entrance porch and the front steps ──
{
  prism(stone, rectRing([-5.6, 12.8, -43.5, -37.7]), STEP, 10.5, roof, 0.3)
  prism(stone, rectRing([-5.6, 12.8, -43.5, -37.7]), 0, STEP, null, 0)
  const a: XY = [-5.6, -43.5], b: XY = [12.8, -43.5]
  for (let k = 0; k < 3; k++) onWall(door, a, b, archShape(3.1 + k * 6.1, 3.8, STEP, STEP + 4.6, 8), 0.06)
  // three flights down to the street
  for (let k = 0; k < 3; k++) box(stone, -10.5, 14.0, -50.2 + k * 2.3, -43.3, 0, 1.1 + 0.6 * k, stone, 0.1)
}

// Night: floodlit stone, brightest on the tower and the Queen Street front.
const lit = (p: V3, n: V3) => (n[2] > 0.7 ? 0.1 : p[2] > SHAFT ? 0.85 : n[1] < -0.5 ? 0.65 : 0.4)
await save('tor-old-city-hall', 'Old City Hall', [
  { part: stone, material: { ...finish('och-sandstone', 0xcfa892), floodlight: lit } },
  { part: band, material: { ...finish('och-redstone', 0xa26c5b), floodlight: lit } },
  { part: roof, material: finish('och-roof', 0x8c928b) },
  { part: win, material: PALETTE.window },
  { part: door, material: PALETTE.entrance },
  { part: trim, material: PALETTE.trim },
], { height: TIP, anchor: [43.6526419, -79.381764], bearing: 343.5 }, 6500)
