/**
 * Daikin Park, Houston (2000, HOK Sport with Molina & Associates; Minute
 * Maid Park until 2025, Enron Field before that), the Astros' ballpark —
 * procedural, CC0-1.0. bun generators/hou-daikin-park.ts
 *
 * Map frame: x along the downtown street grid's "east" (bearing 124.8°,
 * Texas Ave), y along its "north" (bearing 34.8°, Crawford St), z up,
 * metres. Placed at bearing 34.8, the grid axis the outline's edges follow
 * (OSM way/129025430, every long edge at 34.8° or 124.4°). The anchor is the
 * area centroid of that outline. y = 0 is the playing field.
 *
 * What makes it read as itself: the retractable roof, three white panels
 * that each arch across the whole bowl from the glass wall to the east rail,
 * stepping down towards the north, their faces trussed in pale steel
 * with a tall lattice tower at the west end and a steep trussed slope at the
 * east end; the glass wall above left field along Crawford St; the rails
 * carried north past the bowl on arcades of tall arched steel bents; the
 * curved white fixed roof over the home-plate stands; the Texas Ave front of
 * red brick pavilions with arched top windows under mint hipped roofs and
 * the brick clock tower on the Hamilton St corner.
 *
 * Pose: roof closed, the usual pose (2000-2019, 1,103 of 1,614 home games
 * were played closed, Wikipedia "Daikin Park") and the one in the NAIP
 * orthophoto. The 2018 lidar caught it open (panels stacked at the north
 * end), which gives the panels' arch profiles and heights.
 *
 * Union Station (the 1911 station, OSM way/44129794, building=yes, 30 m) is
 * the ballpark's entrance but a separate building in OSM: it abuts the
 * stadium outline on the south-west and none of it lies inside the outline
 * (0 of 8,713 half-metre cells). It is not modelled and not replaced; the
 * map draws it as its own extrusion beside the model.
 *
 * Sources:
 * - OSM way/129025430 (building=stadium, height 74): the outline, used as
 *   the podium plan, and the west and east arcade strips running north to
 *   y = 140. No building:parts inside it.
 * - USGS 3DEP lidar TX_Coastal_B1_2018 (flight 2018), 1 m grid, read in
 *   this frame (heights above the field, which is 2.0 m above the box's
 *   ground_min; the streets round the site are 9.1 m above it):
 *   - field 0; streets and sidewalks 7.1 (so the field is about 7 m below
 *     the street; see Elevation);
 *   - panel 1 (open pose, y 44..118): 57.5 at the west rail, 76.1 at
 *     x = -30, 61 at x = 70, dropping to the east rail at x = 86;
 *   - panel 2 (visible y 5..44): panel 1's profile less 13 m (peak 63.1);
 *   - fixed south roof y -128..-95: 39 at the ends, 47.5 at x = -40;
 *   - east fixed roof x 70..90: 39-41 flat; west concourse 17-19;
 *     glass-wall head and west rail 38-40 at x = -84; south facade 27-34,
 *     brick pavilions 31-34; clock tower 50-52; north block 13-18.
 * - USGS NAIP orthophoto (public domain), roof closed: the roof's extent,
 *   x -90..80, y -128..72, and the steps between the panels at y = 12 and
 *   y = 48 (shadow lines, lower to the north); the roof reads near white.
 * - Published: roof 242 ft high (several sources); "580 ft" roof span and
 *   a 115 ft moving-glass left-field wall (Walter P Moore project page,
 *   https://www.walterpmoore.com/projects/daikin-park); three independent
 *   panels (Uni-Systems, https://www.uni-systems.com/projects/retractable-roof-minute-maid-park).
 *
 * Photos (Wikimedia Commons unless noted), compared against the renders:
 * - p01 "Minute Maid Park - Houston, Texas - DSC01317.JPG", Daderot, CC0:
 *   the Texas Ave front from the south, high: brick pavilions, mint
 *   roofs, white wall and the curved fixed roof, the panel's arched,
 *   two-band truss face, the west lattice tower, the clock tower;
 * - p05 "Minute Maid Park outside nima.JPG", زرشک, CC BY-SA 3.0: from the
 *   north-east, roof open: the arcade of arched bents, the panels' trussed
 *   faces and mint east ends, the glass wall at the far end;
 * - p06 "Minute Maid Park - Crawford Street at Texas Avenue.JPG", Brian
 *   Reading, CC BY-SA 3.0: Union Station with the glass wall rising behind
 *   it and the brick, mint-roofed front beyond;
 * - p07 "Minute Maid Park exterior 2019-10-29.jpg", Thank You (21 Millions+)
 *   views, CC BY 2.0: from the US 59 side, the arcade and the roof;
 * - p10 "MinuteMaidParkExteriorHouston.JPG", WhisperToMe, public domain:
 *   a pavilion close up, four arched windows under a mint hip roof;
 * - p12 "Houston, Texas (2024) - 10.jpg", Another Believer, CC BY-SA 4.0,
 *   and p04 "Minute Maid Park 2016-04-23.jpg", J Dimas, CC BY 2.0: the
 *   glass wall's steel grid over left field;
 * - p17 "Minute Maid Park satellite view.png", NASA, public domain: plan,
 *   roof open, the panels stacked to the north-east;
 * - p19 Flickr 37716608186 "Minute Maid Park", SimplyDusty, public domain
 *   mark: aerial, the fixed south roof and the clock tower.
 * Colours: brick, mint and the white faces sampled from p01, p05, p06,
 * p07 and pulled to the palette's lightness.
 *
 * Estimated: the closed panel extents (panel 1 y -95..12, panel 2 12..48,
 * panel 3 48..72, from NAIP's step lines; the lidar has panel 1 only about
 * 74 m long, so either it is longer than its exposed top or a lower panel
 * covers the south part when closed; both read the same from the photos'
 * sides); panel 3's height (no lidar sees it: 44 m at the rails rising to
 * 53 m); truss depths (10 m bands, two on panel 1's south face as p01
 * shows); the arcade's bay (11 m) and arch heights; the glass wall's
 * mullion spacing; the pavilions' windows; the clock tower's stages.
 * Left out: the train, signs and lettering, the scoreboards and seats under
 * the roof, the entrance canopies, Union Station.
 *
 * Elevation: 0. No published depth for the field was found; the lidar puts
 * it 7.1 m below the surrounding streets. The map's own terrain (Mapterhorn,
 * from the same 3DEP lidar) already contains that pit (0.5 m in the bowl
 * against 7.5 m on the streets, `tools/terrain.ts grid`). The map's fill
 * inside a footprint never rises above the real ground, so the pit stays
 * (`tools/terrain.ts check`, map new, filled: rise 0.0-0.3 m over the field,
 * 8.4-8.9 m drawn at the outline), and the map puts y = 0 on the field by
 * itself; a negative elevation would sink it twice. The walls run down to
 * the field (y = 0) all round; at the outline the map lifts their feet to
 * the street, so the stone plinth reads as the street-level storey.
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'

type XY = [number, number]

const brick = new Part(), roof = new Part(), steel = new Part()
const mint = new Part(), win = new Part(), glassWall = new Part()
// The cream walls, fascias and cast stone read as pale as the roof panels
// in p01, so they share its material.
const stone = roof

const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]

/** A quad wound to face `hint`. */
function quad(p: Part, P: V3[], hint: V3) {
  const f = add(cross(sub(P[1], P[0]), sub(P[2], P[0])), cross(sub(P[2], P[0]), sub(P[3], P[0])))
  const o = dot(f, hint) >= 0 ? [0, 1, 2, 3] : [0, 3, 2, 1]
  const t = (a: number, b: number, c: number) => {
    const A = P[o[a]], B = P[o[b]], C = P[o[c]]
    if (Math.hypot(...cross(sub(B, A), sub(C, A))) > 1e-9) p.tri(A, B, C)
  }
  t(0, 1, 2)
  t(0, 2, 3)
}
function tri(p: Part, A: V3, B: V3, C: V3, hint: V3) {
  if (dot(cross(sub(B, A), sub(C, A)), hint) >= 0) p.tri(A, B, C)
  else p.tri(A, C, B)
}

/** An axis-aligned box; no bottom unless asked. */
function box(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, bottom = false) {
  quad(p, [[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1]], [0, -1, 0])
  quad(p, [[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]], [0, 1, 0])
  quad(p, [[x0, y0, z0], [x0, y1, z0], [x0, y1, z1], [x0, y0, z1]], [-1, 0, 0])
  quad(p, [[x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1]], [1, 0, 0])
  quad(p, [[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]], [0, 0, 1])
  if (bottom) quad(p, [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]], [0, 0, -1])
}

/** A truncated hip roof over a rectangle, eaves at z0, ridge inset by `inset`. */
function hip(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, inset: number) {
  const e: V3[] = [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]]
  const r: V3[] = [[x0 + inset, y0 + inset, z1], [x1 - inset, y0 + inset, z1], [x1 - inset, y1 - inset, z1], [x0 + inset, y1 - inset, z1]]
  const out: V3[] = [[0, -1, 1], [1, 0, 1], [0, 1, 1], [-1, 0, 1]]
  for (let i = 0; i < 4; i++) quad(p, [e[i], e[(i + 1) % 4], r[(i + 1) % 4], r[i]], out[i])
  quad(p, r, [0, 0, 1])
}

/** Ear clipping for a simple counter-clockwise polygon. */
function earclip(poly: XY[]): [number, number, number][] {
  const idx = poly.map((_, i) => i)
  const out: [number, number, number][] = []
  const crossz = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inTri = (p: XY, a: XY, b: XY, c: XY) => crossz(a, b, p) > 1e-9 && crossz(b, c, p) > 1e-9 && crossz(c, a, p) > 1e-9
  let guard = 0
  while (idx.length > 3 && guard++ < 10000) {
    let clipped = false
    for (let k = 0; k < idx.length; k++) {
      const i0 = idx[(k + idx.length - 1) % idx.length], i1 = idx[k], i2 = idx[(k + 1) % idx.length]
      const a = poly[i0], b = poly[i1], c = poly[i2]
      if (crossz(a, b, c) <= 1e-9) continue
      if (idx.some((j) => j !== i0 && j !== i1 && j !== i2 && inTri(poly[j], a, b, c))) continue
      out.push([i0, i1, i2])
      idx.splice(k, 1)
      clipped = true
      break
    }
    if (!clipped) throw new Error('earclip stuck')
  }
  out.push([idx[0], idx[1], idx[2]])
  return out
}

// ---------------------------------------------------------------------------
// The podium: the OSM outline (way/129025430) in this frame, cast stone up
// to the street-level storey, brick above, a window band in bays, and a flat
// roof at 16 m (the north block's height; the rest of its top is under the
// stadium's roofs).

let OUTLINE: XY[] = [[-97.2, -62.5], [-97.0, -127.4], [-90.2, -127.4], [-90.2, -133.3], [-77.7, -133.2], [-77.7, -128.5], [-63.8, -128.5], [-63.8, -133.2], [-33.2, -133.2], [-33.2, -128.1], [-11.7, -128.1], [-11.7, -132.6], [17.9, -132.5], [17.9, -139.7], [40.7, -139.7], [40.7, -131.4], [91.8, -131.3], [91.7, -116.9], [89.7, -116.9], [89.5, -72.7], [101.3, -72.7], [101.2, -51.0], [96.9, -51.0], [96.8, -1.2], [101.2, -1.2], [101.1, 21.4], [89.1, 21.4], [89.0, 47.5], [105.8, 47.6], [105.8, 65.8], [95.6, 65.6], [88.5, 65.7], [88.2, 140.9], [77.6, 140.9], [77.7, 122.0], [71.3, 122.0], [71.2, 144.4], [-32.0, 144.1], [-32.3, 140.0], [-39.9, 139.7], [-39.7, 109.2], [-49.0, 109.1], [-49.1, 101.9], [-52.0, 102.0], [-76.5, 101.8], [-77.8, 101.6], [-77.9, 100.6], [-81.4, 100.7], [-82.0, 139.6], [-90.8, 139.9], [-90.6, 67.0], [-98.7, 67.0], [-125.3, 66.9], [-125.2, 46.9], [-90.8, 47.0], [-90.5, -35.4], [-124.6, -35.5], [-124.5, -53.9], [-90.4, -53.8], [-90.4, -62.4]]
{
  let a = 0
  for (let i = 0; i < OUTLINE.length; i++) {
    const [x1, y1] = OUTLINE[i], [x2, y2] = OUTLINE[(i + 1) % OUTLINE.length]
    a += x1 * y2 - x2 * y1
  }
  if (a < 0) OUTLINE = OUTLINE.reverse()
}
const POD = 16, PLINTH = 7
for (let i = 0; i < OUTLINE.length; i++) {
  const [x1, y1] = OUTLINE[i], [x2, y2] = OUTLINE[(i + 1) % OUTLINE.length]
  const L = Math.hypot(x2 - x1, y2 - y1)
  const n: V3 = [(y2 - y1) / L, -(x2 - x1) / L, 0]
  quad(stone, [[x1, y1, 0], [x2, y2, 0], [x2, y2, PLINTH], [x1, y1, PLINTH]], n)
  quad(brick, [[x1, y1, PLINTH], [x2, y2, PLINTH], [x2, y2, POD], [x1, y1, POD]], n)
  // A window band in bays of about 10 m, with brick piers between.
  if (L >= 14) {
    const bays = Math.round(L / 10), pier = 1.4, o = mul(n, 0.05)
    for (let k = 0; k < bays; k++) {
      const s0 = (k * L) / bays + pier / 2, s1 = ((k + 1) * L) / bays - pier / 2
      const P = (s: number, z: number): V3 => add([x1 + ((x2 - x1) * s) / L, y1 + ((y2 - y1) * s) / L, z], o)
      quad(win, [P(s0, 12), P(s1, 12), P(s1, 15), P(s0, 15)], n)
    }
  }
}
for (const [a, b, c] of earclip(OUTLINE)) {
  const A = OUTLINE[a], B = OUTLINE[b], C = OUTLINE[c]
  tri(roof, [A[0], A[1], POD], [B[0], B[1], POD], [C[0], C[1], POD], [0, 0, 1])
}

// ---------------------------------------------------------------------------
// The retractable roof, closed: three panels arching across x from the glass
// wall's rail (x = -84) to the east rail (x = 86), stepping down northward.

const X = [-84, -80, -70, -60, -50, -40, -30, -20, -10, 0, 10, 20, 30, 40, 50, 60, 70, 78, 86]
const P1 = [60, 63, 68, 71.6, 74.2, 75.6, 76.1, 75.8, 74.7, 73.1, 71.5, 69.8, 68.1, 66.5, 64.9, 63.2, 61, 52, 42]
const P2 = P1.map((z, i) => (i < 16 ? z - 13 : [48, 45, 42][i - 16]))
const P3 = P1.map((z, i) => (i < 16 ? 44 + (z - 60) * 0.55 : [44.6, 43, 42][i - 16]))
const RAIL = 40
const zAt = (Z: number[], x: number) => {
  for (let i = 0; i < X.length - 1; i++)
    if (x <= X[i + 1]) return Z[i] + ((Z[i + 1] - Z[i]) * (x - X[i])) / (X[i + 1] - X[i])
  return Z[Z.length - 1]
}

/** The trussed face of a panel at y = yf, facing `dir` (±1): chords and zigzag diagonals. */
function truss(Z: number[], yf: number, dir: number, bands: number[]) {
  const y = yf + dir * 0.12, h: V3 = [0, dir, 0]
  const strip = (xa: number, za: number, xb: number, zb: number, w: number) =>
    quad(steel, [[xa - w / 2, y, za], [xa + w / 2, y, za], [xb + w / 2, y, zb], [xb - w / 2, y, zb]], h)
  // Chords: the top chord along the arch and one below each band.
  for (const d of [0, ...bands]) {
    const t = d === 0 ? 1.8 : 1.3
    for (let i = 0; i < X.length - 3; i++) {
      const a = X[i], b = X[i + 1]
      quad(steel, [[a, y, zAt(Z, a) - d - t], [b, y, zAt(Z, b) - d - t], [b, y, zAt(Z, b) - d], [a, y, zAt(Z, a) - d]], h)
    }
  }
  // Diagonals, a W in each band, about 8 m a pair.
  let top = 0
  for (const d of bands) {
    const S = 8
    for (let xa = -80; xa + S / 2 <= 70; xa += S) {
      const xm = xa + S / 2, xb = Math.min(xa + S, 70)
      strip(xa, zAt(Z, xa) - d, xm, zAt(Z, xm) - top - 1, 1.1)
      strip(xm, zAt(Z, xm) - top - 1, xb, zAt(Z, xb) - d, 1.1)
    }
    top = d
  }
  // The steep east end: a sloping member down to the rail.
  quad(steel, [[70, y, Z[16]], [72.5, y, Z[16]], [86, y, RAIL + 2], [83.5, y, RAIL]], h)
}

/** A panel's solid between y0 and y1, flat underneath at the rail. */
function panel(Z: number[], y0: number, y1: number) {
  for (let i = 0; i < X.length - 1; i++) {
    const a = X[i], b = X[i + 1], part = a >= 70 ? steel : roof
    quad(part, [[a, y0, Z[i]], [b, y0, Z[i + 1]], [b, y1, Z[i + 1]], [a, y1, Z[i]]], [0, 0, 1])
    for (const [y, d] of [[y0, -1], [y1, 1]] as const)
      quad(roof, [[a, y, RAIL], [b, y, RAIL], [b, y, Z[i + 1]], [a, y, Z[i]]], [0, d, 0])
  }
  // The west end: clad like the faces; its lattice tower is drawn on it below.
  quad(roof, [[X[0], y0, RAIL], [X[0], y1, RAIL], [X[0], y1, Z[0]], [X[0], y0, Z[0]]], [-1, 0, 0])
  quad(steel, [[86, y0, RAIL], [86, y1, RAIL], [86, y1, 42], [86, y0, 42]], [1, 0, 0])
}

panel(P1, -95, 12)
panel(P2, 12, 48)
panel(P3, 48, 72)
truss(P1, -95, -1, [10, 20]) // p01: two bands on the south face
truss(P1, 12, 1, [10])
truss(P2, 48, 1, [9])
truss(P3, 72, 1, [10])
// The west tower's lattice: two posts and a brace on each panel's west end.
for (const [y0, y1, Z] of [[-95, 12, P1], [12, 48, P2], [48, 72, P3]] as const) {
  const x = X[0] - 0.12
  const n = Math.max(1, Math.round((y1 - y0) / 18))
  for (let k = 0; k <= n; k++) {
    const yy = Math.min(Math.max(y0 + ((y1 - y0) * k) / n, y0 + 0.9), y1 - 0.9)
    quad(steel, [[x, yy - 0.9, RAIL], [x, yy + 0.9, RAIL], [x, yy + 0.9, Z[0]], [x, yy - 0.9, Z[0]]], [-1, 0, 0])
  }
  for (let k = 0; k < n; k++) {
    const ya = y0 + ((y1 - y0) * k) / n + 0.9, yb = y0 + ((y1 - y0) * (k + 1)) / n - 0.9
    for (const [p, q] of [[ya, yb], [yb, ya]]) quad(steel, [[x, p - 0.6, RAIL], [x, p + 0.6, RAIL], [x, q + 0.6, Z[0]], [x, q - 0.6, Z[0]]], [-1, 0, 0])
  }
  quad(steel, [[x, y0, Z[0] - 1.6], [x, y1, Z[0] - 1.6], [x, y1, Z[0]], [x, y0, Z[0]]], [-1, 0, 0])
}

// Rails: steel girders along both sides, from the south roof to the end of
// the arcades at y = 140.
box(steel, -86, -82, -118, 140, RAIL, RAIL + 4, true)
box(steel, 82, 88, -118, 140, RAIL, RAIL + 4, true)

// ---------------------------------------------------------------------------
// The glass wall above left field (x = -84, facing Crawford St and
// downtown), from the west concourse's roof to the rail, with mint mullions
// and a transom.

const GW0 = -118, GW1 = 100, GZ0 = 16, GZ1 = RAIL
box(glassWall, -85, -83.6, GW0, GW1, GZ0, GZ1)
{
  const bays = Math.round((GW1 - GW0) / 14)
  for (let k = 0; k <= bays; k++) {
    const y = GW0 + ((GW1 - GW0) * k) / bays
    quad(steel, [[-85.3, y - 1, GZ0], [-85.3, y + 1, GZ0], [-85.3, y + 1, GZ1], [-85.3, y - 1, GZ1]], [-1, 0, 0])
  }
  for (const z of [27.5, GZ1 - 1.6])
    quad(steel, [[-85.25, GW0, z], [-85.25, GW1, z], [-85.25, GW1, z + 1.6], [-85.25, GW0, z + 1.6]], [-1, 0, 0])
}
// The west concourse along Crawford St, brick, in front of the glass.
box(brick, -90.5, -85, -62, 100, POD, 21)
quad(win, [[-90.55, -58, 17], [-90.55, 96, 17], [-90.55, 96, 20], [-90.55, -58, 20]], [-1, 0, 0])

// ---------------------------------------------------------------------------
// The arcades carrying the rails north past the bowl (p05, p07): tall mint
// bents with semicircular arches between them, under each girder.

function arcade(xc: number, ya: number, yb: number) {
  const n = Math.round((yb - ya) / 11), w = 1.2, top = RAIL
  for (let k = 0; k <= n; k++) {
    const y = ya + ((yb - ya) * k) / n
    box(steel, xc - w, xc + w, y - 1.1, y + 1.1, 0, top)
  }
  for (let k = 0; k < n; k++) {
    const y0 = ya + ((yb - ya) * k) / n + 1.1, y1 = ya + ((yb - ya) * (k + 1)) / n - 1.1
    const r = (y1 - y0) / 2, yc = (y0 + y1) / 2, zs = top - r - 0.6, seg = 10
    for (let s = 0; s < seg; s++) {
      const t0 = Math.PI - (Math.PI * s) / seg, t1 = Math.PI - (Math.PI * (s + 1)) / seg
      const P = (t: number, rr: number, x: number): V3 => [x, yc + Math.cos(t) * rr, zs + Math.sin(t) * rr]
      for (const [x, d] of [[xc - w, -1], [xc + w, 1]] as const) {
        quad(steel, [P(t0, r - 1.2, x), P(t1, r - 1.2, x), P(t1, r, x), P(t0, r, x)], [d, 0, 0])
      }
      const tm = (t0 + t1) / 2
      quad(steel, [P(t0, r - 1.2, xc - w), P(t1, r - 1.2, xc - w), P(t1, r - 1.2, xc + w), P(t0, r - 1.2, xc + w)], [0, -Math.cos(tm), -Math.sin(tm)])
      // The spandrel above the arch up to the girder, flat in the bent's plane.
      for (const [x, d] of [[xc - w, -1], [xc + w, 1]] as const) {
        const a = P(t0, r, x), b = P(t1, r, x)
        quad(steel, [a, b, [x, b[1], top], [x, a[1], top]], [d, 0, 0])
      }
    }
  }
}
arcade(84.5, 72, 140)
arcade(-86.2, 100, 140)

// ---------------------------------------------------------------------------
// The enclosure between the podium and the roofs: the east wall under the
// east fixed roof, the north end wall under panel 3, both cream with mint
// pilasters.

box(stone, 87, 89, -118, 72, POD, RAIL)
for (let y = -112; y <= 66; y += 12) quad(steel, [[89.15, y - 0.6, POD], [89.15, y + 0.6, POD], [89.15, y + 0.6, RAIL], [89.15, y - 0.6, RAIL]], [1, 0, 0])
box(roof, 70, 90.5, -118, 45, RAIL - 2.5, RAIL + 1, true)
box(stone, -84, 87, 71, 72, POD, RAIL)
for (let x = -78; x <= 82; x += 12) quad(steel, [[x - 0.6, 72.15, POD], [x + 0.6, 72.15, POD], [x + 0.6, 72.15, RAIL], [x - 0.6, 72.15, RAIL]], [0, 1, 0])

// ---------------------------------------------------------------------------
// The Texas Ave front: a brick storey over the podium, a mint shed roof
// rising to a cream wall, the curved white fixed roof over the home-plate
// stands, three brick pavilions and the clock tower.

box(brick, -97, 89.5, -127.5, -118, POD, 25)
for (let x = -92; x < 86; x += 10) quad(win, [[x, -127.55, 18], [x + 7.6, -127.55, 18], [x + 7.6, -127.55, 22.5], [x, -127.55, 22.5]], [0, -1, 0])
quad(mint, [[-97, -127.8, 25], [89.5, -127.8, 25], [89.5, -118, 31], [-97, -118, 31]], [0, -1, 1])
for (const [x, d] of [[-97, -1], [89.5, 1]] as const) tri(mint, [x, -127.8, 25], [x, -118, 25], [x, -118, 31], [d, 0, 0])
box(stone, -97, 89.5, -118, -116, 25, 40)

const FX = [-86, -60, -40, -20, 0, 20, 40, 60, 89]
const FZ = [39, 45, 47.5, 47, 46, 44.5, 43, 41.5, 39.5]
const FY0 = -128.5, FY1 = -95, FB = 37
for (let i = 0; i < FX.length - 1; i++) {
  const a = FX[i], b = FX[i + 1]
  quad(roof, [[a, FY0, FZ[i] - 2.5], [b, FY0, FZ[i + 1] - 2.5], [b, FY1, FZ[i + 1] + 0.5], [a, FY1, FZ[i] + 0.5]], [0, 0, 1])
  quad(stone, [[a, FY0, FB], [b, FY0, FB], [b, FY0, FZ[i + 1] - 2.5], [a, FY0, FZ[i] - 2.5]], [0, -1, 0])
  quad(stone, [[a, FY0, FB], [b, FY0, FB], [b, FY1, FB], [a, FY1, FB]], [0, 0, -1])
}
for (const [i, d] of [[0, -1], [FX.length - 1, 1]] as const)
  quad(stone, [[FX[i], FY0, FB], [FX[i], FY1, FB], [FX[i], FY1, FZ[i] + 0.5], [FX[i], FY0, FZ[i] - 2.5]], [d, 0, 0])

// Pavilions (lidar 31-34 m at x -64..-33, -12..18, 41..68): brick, four
// arched windows on the top floor, a window band below, a mint hip roof.
for (const [x0, x1] of [[-63.8, -33.2], [-11.7, 17.9], [40.7, 68]] as const) {
  const y0 = -133.5, y1 = -120
  box(brick, x0, x1, y0, y1, 0, 30)
  quad(stone, [[x0 - 0.05, y0 - 0.05, 0], [x1 + 0.05, y0 - 0.05, 0], [x1 + 0.05, y0 - 0.05, PLINTH], [x0 - 0.05, y0 - 0.05, PLINTH]], [0, -1, 0])
  hip(mint, x0 - 0.8, x1 + 0.8, y0 - 0.8, y1 + 0.8, 30, 33.5, 3)
  // The big arched windows fill the top two storeys (p01, p10); a window
  // band in two groups below them.
  const w = (x1 - x0) / 4, r = w * 0.38, y = y0 - 0.06, zs = 24.5
  for (let k = 0; k < 4; k++) {
    const xc = x0 + w * (k + 0.5)
    quad(win, [[xc - r, y, 17.5], [xc + r, y, 17.5], [xc + r, y, zs], [xc - r, y, zs]], [0, -1, 0])
    for (let s = 0; s < 8; s++) {
      const t0 = (Math.PI * s) / 8, t1 = (Math.PI * (s + 1)) / 8
      tri(win, [xc, y, zs], [xc + Math.cos(t0) * r, y, zs + Math.sin(t0) * r], [xc + Math.cos(t1) * r, y, zs + Math.sin(t1) * r], [0, -1, 0])
    }
  }
  for (const [a, b] of [[0.06, 0.47], [0.53, 0.94]]) {
    const xa = x0 + (x1 - x0) * a, xb = x0 + (x1 - x0) * b
    quad(win, [[xa, y, 9.5], [xb, y, 9.5], [xb, y, 15], [xa, y, 15]], [0, -1, 0])
  }
}

// The clock tower on the Texas Ave / Hamilton St corner (lidar 52 m).
{
  const x0 = 78, x1 = 89, y0 = -131.5, y1 = -120.5, c = 0.4
  box(brick, x0, x1, y0, y1, 0, 44)
  box(stone, x0 - c, x1 + c, y0 - c, y1 + c, 44, 46)
  box(brick, x0, x1, y0, y1, 46, 50)
  box(stone, x0 - c, x1 + c, y0 - c, y1 + c, 50, 51)
  hip(mint, x0 - c, x1 + c, y0 - c, y1 + c, 51, 53, 4.5)
  // Clock faces: a round stone disc on each side, 16 sides.
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, R = 2.6, zc = 48
  for (const [nx, ny] of [[0, -1], [0, 1], [-1, 0], [1, 0]] as const) {
    const d = (nx ? (x1 - x0) / 2 : (y1 - y0) / 2) + 0.06
    const ctr: V3 = [cx + nx * d, cy + ny * d, zc]
    const u: V3 = [ny !== 0 ? 1 : 0, nx !== 0 ? 1 : 0, 0]
    for (let s = 0; s < 16; s++) {
      const t0 = (2 * Math.PI * s) / 16, t1 = (2 * Math.PI * (s + 1)) / 16
      tri(stone, ctr, add(ctr, add(mul(u, Math.cos(t0) * R), [0, 0, Math.sin(t0) * R])), add(ctr, add(mul(u, Math.cos(t1) * R), [0, 0, Math.sin(t1) * R])), [nx, ny, 0])
    }
  }
  for (const [nx, ny] of [[0, -1], [-1, 0], [1, 0], [0, 1]] as const) {
    const d = (nx ? (x1 - x0) / 2 : (y1 - y0) / 2) + 0.05
    const P = (s: number, z: number): V3 => [cx + nx * d + (ny ? s : 0), cy + ny * d + (nx ? s : 0), z]
    for (const s0 of [-3.4, 0.9]) quad(win, [P(s0, 30), P(s0 + 2.5, 30), P(s0 + 2.5, 41), P(s0, 41)], [nx, ny, 0])
  }
}

// ---------------------------------------------------------------------------
// Palette, from the photos: red brick; the panels' white faces and roofs,
// near white in NAIP and p01, shared by the cream walls, fascias and cast
// stone; the pale silver-white steel of the trusses, towers, rails and
// arcades, a shade darker than the panels (p01); the mint standing-seam
// roofs of the Texas Ave front; windows; and the
// glass wall, a light sea-green grey that glows at night with the field
// lights behind it.
const parts = [
  { part: brick, material: finish('daikin-brick', 0xb8735a) },
  { part: roof, material: finish('daikin-roof', 0xeceeec) },
  { part: steel, material: finish('daikin-steel', 0xcfd6d7) },
  { part: mint, material: finish('daikin-mint', 0x86bdb2) },
  { part: win, material: PALETTE.window },
  { part: glassWall, material: windowVariant(2, 0x93b4c9) },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
for (const { part, material } of parts) console.log(material.name.padEnd(16), part.triangles)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Daikin Park', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the field, at the outline centroid',
  bearing: 34.8, osm: 'way/129025430',
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/hou-daikin-park.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
