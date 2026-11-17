/**
 * Hotel del Coronado ("The Del"), 1500 Orange Avenue, Coronado.
 *
 * Reid Brothers, 1888, Queen Anne: white clapboard wings of four to six
 * storeys round an open court, under bright red shingle roofs, with the
 * great faceted cone of the old Ballroom (HABS's "ballroom tower") at the
 * ocean-side front corner, a lantern and balcony on its tip and two rows
 * of small dormers on it; witch's-hat turrets on the corners; cross
 * gables; the Crown Room (the 1888 dining room, 62 × 156 ft) running out
 * diagonally from the inland front corner under a steep roof with an
 * apsidal end; and a later octagonal hall on the north-east side.
 *
 * Note on names: the brief called the big cone "the turret over the Crown
 * Room". HABS CAL-1958 (sheet 3, the 1888 principal-storey plan, and sheets
 * 6/7) puts the Ballroom under the cone at the south (ocean) corner and the
 * dining room — today's Crown Room — in the diagonal wing at the east
 * corner. The model follows HABS.
 *
 * What the model covers: the whole OSM multipolygon relation/1785615
 * ("The Victorian", building=hotel, NRHP 71000181; outer way/30922507,
 * inner court way/132936526). That outline is the 1888 Victorian building
 * plus the octagonal hall on its north-east side; it has no building:part
 * children. The modern wings (The Views way/458938205, The Cabanas
 * way/132936525, Shore House, Ocean Towers further south) are separate OSM
 * buildings and are NOT modelled or replaced; nor are the gazebo in the
 * court (way/1520316796) or the entrance canopy (way/1460403844, building=roof).
 *
 * Frame: bearing 126°. Model +y (glTF -Z) points to compass 126° (south-
 * east, the 1888 entrance front, HABS's "southeast (entrance) elevation");
 * model +x points to compass 216° (south-west, the ocean). Metres, origin
 * at the outline's area centroid (-117.17824, 32.68094), y = 0 the lowest
 * ground under the footprint (the ocean side; the north-east ground is
 * ~1.6 m higher and the walls run down into it).
 *
 * Sources
 * - OSM relation/1785615 (outer way/30922507, inner way/132936526),
 *   © OpenStreetMap contributors. building:levels=7, no heights.
 * - USGS 3DEP lidar USGS_LPC_CA_WestCoastElNinoUTM11_2016_LAS_2017 (flown
 *   2016; CA_SanDiegoQL2_2014 has no points here), 1 m grid, read in this
 *   frame. Ground on the ocean side 4.5 m above the box's ground_min; all
 *   model heights are lidar minus that.
 * - USGS NAIP orthophoto (plan, red roofs, the octagon and its raised top).
 * - HABS CAL-1958 (Historic American Buildings Survey, 1971, public
 *   domain), https://commons.wikimedia.org/wiki/Category:Hotel_del_Coronado_-_HABS_drawings
 *   sheet 2 (plat), sheet 3 (1888 principal-storey plan: court 150 × 250 ft,
 *   ballroom 120 ft, dining room 62 × 156 ft), sheet 6 (section A: floors at
 *   12'6", 24'9", 36'2", 45'10", 55'10", top roof 67'3"), sheet 7 (ballroom
 *   section/elevation: drum, skirt roof, clerestory, cone, tower floor
 *   85'2", top of roof 115'1" above the ballroom floor, which is 14' above
 *   the lower floor), sheet 8 (lobby).
 * - HABS CAL,37-CORO,1- photos 1–11 (Marvin Rand, 1971, public domain):
 *   SE entrance elevation with ballroom tower, SW ocean front, NE and NW
 *   elevations. https://commons.wikimedia.org/wiki/Category:Hotel_del_Coronado_-_HABS_images
 * Photos (evidence, Wikimedia Commons):
 * - "Hotel Del Coronado 01–05.JPG", "…evening 01/02.JPG", Ctorbann,
 *   CC BY-SA 3.0, https://commons.wikimedia.org/wiki/File:Hotel_Del_Coronado_04.JPG
 *   (04: ocean front from the beach; 05: the cone; evening 02: night).
 * - "Hotel Del Coronado Drone Picture Turf Lawn.jpg", Armandoartist,
 *   CC BY-SA 4.0 (the aerial from the south-west: roofs, court, cone).
 * - "Hotel del Coronado (2008).jpg", Dirk DBQ, CC BY 2.0 (north-west
 *   front, corner turret and the slim tower).
 * - "Hotel Del Coronado at dusk in February - panoramio.jpg", nick hoke,
 *   CC BY 3.0 (north-west front from the car park).
 * - "View of hotel from the beach, Hotel del Coronado, Coronado, CA.jpg",
 *   KMPhotoLA1, CC BY-SA 4.0; "FullCoronadoHotel.jpg", Nehrams2020,
 *   CC BY-SA 3.0; "Hotel del Coronado at night.JPG", Herbert lewis,
 *   CC BY-SA 3.0 (night: lit lantern, lit dormers).
 * Look-only: none used.
 *
 * Numbers
 * - Plan: OSM outline (measured), wings' wall lines from the lidar.
 * - Wing heights (measured, lidar): ocean wing eaves 15.0, ridge 16.5; the
 *   north-west and north-east wings eaves 17.5, flat tops 21.3–21.5; front
 *   wing 18 / 22; entrance block ridge 27; Crown Room eaves 10, ridge 20;
 *   octagonal hall eaves 10, raised top 17.
 * - Ballroom cone (published, HABS sheet 7, scaled from the drawing):
 *   drum r 18.5 to 7.8 m, skirt roof from r 19.4 to the clerestory r 12.8
 *   at 11.5 m, clerestory to 14.0, cone eave r 13.7 at 14.0 to r 3.3 at
 *   27.9, balcony 29.2, lantern to 32.9, apex 39.0 (HABS 129 ft above the
 *   lower floor; the lidar's 46–48 m is the flag on the 155 ft pole).
 *   Centre (47, 42) measured from the lidar.
 * - Turrets (measured, lidar tops): front turret 34, north-west corner
 *   turret 31, north-east slim tower 40, square turret 27.5. Radii and
 *   belvedere heights estimated from the photos.
 * - Dormer counts and sizes on the cone, cross-gable positions: estimated
 *   from the photos and the HABS elevation.
 * Doubts
 * - Roofs are drawn as hips and gables at the lidar's heights; the many
 *   small dormers and chimneys are left out. The Crown Room / kitchen
 *   cluster at the east corner is simplified to two crossing gabled halls
 *   and a low fill.
 * - The north-east octagonal hall is post-HABS and is drawn from lidar and
 *   NAIP only (no ground photo of it was found).
 * - Night: Ctorbann's evening photo and Herbert lewis's night photo show
 *   the lanterns and cone dormers lit and the walls softly washed; the
 *   roofline string lights are a holiday decoration, so they are not drawn.
 *   The globe lamps on the cone's balcony are drawn as `lamp`. Guest-room
 *   windows above the ground floor are `del-sash` (same dark sash, unlit);
 *   ground floors, the Crown Room, lanterns, belvederes and the cone's
 *   dormers are `window` and glow.
 * - Terrain: Mapterhorn rises ~2.7 m from the ocean side to the inland
 *   side; ground-floor windows start above it (`groundAt`). Terrain check:
 *   ok, no visible top buried.
 */
import { Part, type MaterialSpec, type V3 } from './mesh'
import { finish } from './palette'
import { qf, tf } from './dc-white-house'
import { lathe } from './chi-aon-center'
import { saveModel } from './dc-nga-west'

type XY = [number, number]

// ---------------------------------------------------------------------------
// A frame: origin plus a u axis; v is u turned 90° anticlockwise.
type F = { ox: number; oy: number; ux: number; uy: number }
const ID: F = { ox: 0, oy: 0, ux: 1, uy: 0 }
const frame = (ox: number, oy: number, deg: number): F => ({ ox, oy, ux: Math.cos((deg * Math.PI) / 180), uy: Math.sin((deg * Math.PI) / 180) })
const P = (f: F, u: number, v: number, z: number): V3 => [f.ox + u * f.ux - v * f.uy, f.oy + u * f.uy + v * f.ux, z]
const N = (f: F, nu: number, nv: number, nz: number): V3 => [nu * f.ux - nv * f.uy, nu * f.uy + nv * f.ux, nz]
type L3 = [number, number, number]
const q = (p: Part, f: F, a: L3, b: L3, c: L3, d: L3, n: L3) => qf(p, P(f, ...a), P(f, ...b), P(f, ...c), P(f, ...d), N(f, ...n))
const t3 = (p: Part, f: F, a: L3, b: L3, c: L3, n: L3) => tf(p, P(f, ...a), P(f, ...b), P(f, ...c), N(f, ...n))

/** The frame of one face of a rectangle: origin at the face's centre, v outward. */
function face(f: F, u0: number, u1: number, v0: number, v1: number, side: 'u0' | 'u1' | 'v0' | 'v1'): { f: F; half: number } {
  const c = side === 'v1' ? [(u0 + u1) / 2, v1] : side === 'v0' ? [(u0 + u1) / 2, v0] : side === 'u1' ? [u1, (v0 + v1) / 2] : [u0, (v0 + v1) / 2]
  const out = side === 'v1' ? [0, 1] : side === 'v0' ? [0, -1] : side === 'u1' ? [1, 0] : [-1, 0]
  const o = N(f, out[0], out[1], 0), p = P(f, c[0], c[1], 0)
  // v axis = outward  =>  u axis = (o.y, -o.x)
  return { f: { ox: p[0], oy: p[1], ux: o[1], uy: -o[0] }, half: side[0] === 'v' ? (u1 - u0) / 2 : (v1 - v0) / 2 }
}

/** Walls of a rectangle (no bottom), optional top. */
function box(w: Part, f: F, u0: number, u1: number, v0: number, v1: number, z0: number, z1: number, top: Part | false = w) {
  q(w, f, [u0, v0, z0], [u1, v0, z0], [u1, v0, z1], [u0, v0, z1], [0, -1, 0])
  q(w, f, [u0, v1, z0], [u1, v1, z0], [u1, v1, z1], [u0, v1, z1], [0, 1, 0])
  q(w, f, [u0, v0, z0], [u0, v1, z0], [u0, v1, z1], [u0, v0, z1], [-1, 0, 0])
  q(w, f, [u1, v0, z0], [u1, v1, z0], [u1, v1, z1], [u1, v0, z1], [1, 0, 0])
  if (top) q(top, f, [u0, v0, z1], [u1, v0, z1], [u1, v1, z1], [u0, v1, z1], [0, 0, 1])
}

/**
 * A hip roof over a rectangle with an eave overhang `o`: from z0 at the
 * eave to a flat top (or ridge) at z1, inset iu, iv from the walls.
 */
function hip(r: Part, f: F, u0: number, u1: number, v0: number, v1: number, z0: number, z1: number, iu: number, iv: number, o = 0.7) {
  const a0 = u0 - o, a1 = u1 + o, b0 = v0 - o, b1 = v1 + o
  iu = Math.min(iu + o, (a1 - a0) / 2), iv = Math.min(iv + o, (b1 - b0) / 2)
  const c0 = a0 + iu, c1 = a1 - iu, d0 = b0 + iv, d1 = b1 - iv
  // soffit
  q(r, f, [a0, b0, z0], [a1, b0, z0], [u1, v0, z0], [u0, v0, z0], [0, 0, -1])
  q(r, f, [a1, b0, z0], [a1, b1, z0], [u1, v1, z0], [u1, v0, z0], [0, 0, -1])
  q(r, f, [a1, b1, z0], [a0, b1, z0], [u0, v1, z0], [u1, v1, z0], [0, 0, -1])
  q(r, f, [a0, b1, z0], [a0, b0, z0], [u0, v0, z0], [u0, v1, z0], [0, 0, -1])
  const h = z1 - z0
  q(r, f, [a0, b0, z0], [a1, b0, z0], [c1, d0, z1], [c0, d0, z1], [0, -h, iv])
  q(r, f, [a0, b1, z0], [a1, b1, z0], [c1, d1, z1], [c0, d1, z1], [0, h, iv])
  q(r, f, [a0, b0, z0], [a0, b1, z0], [c0, d1, z1], [c0, d0, z1], [-h, 0, iu])
  q(r, f, [a1, b0, z0], [a1, b1, z0], [c1, d1, z1], [c1, d0, z1], [h, 0, iu])
  if (c1 - c0 > 0.01 && d1 - d0 > 0.01) q(r, f, [c0, d0, z1], [c1, d0, z1], [c1, d1, z1], [c0, d1, z1], [0, 0, 1])
}

/** A gable roof, ridge along u, gable triangles (walls part) at both u ends. */
function gable(r: Part, w: Part, f: F, u0: number, u1: number, v0: number, v1: number, z0: number, z1: number, o = 0.6, ends: [boolean, boolean] = [true, true]) {
  const vm = (v0 + v1) / 2, b0 = v0 - o, b1 = v1 + o, h = z1 - z0
  const zl = z0 - (o * h) / (vm - v0) // eave dropped by the overhang
  q(r, f, [u0 - o * 0.5, b0, zl], [u1 + o * 0.5, b0, zl], [u1 + o * 0.5, vm, z1], [u0 - o * 0.5, vm, z1], [0, -h, vm - v0])
  q(r, f, [u0 - o * 0.5, b1, zl], [u1 + o * 0.5, b1, zl], [u1 + o * 0.5, vm, z1], [u0 - o * 0.5, vm, z1], [0, h, v1 - vm])
  // undersides of the overhangs
  q(r, f, [u0 - o * 0.5, b0, zl], [u1 + o * 0.5, b0, zl], [u1 + o * 0.5, v0, z0], [u0 - o * 0.5, v0, z0], [0, 0, -1])
  q(r, f, [u0 - o * 0.5, b1, zl], [u1 + o * 0.5, b1, zl], [u1 + o * 0.5, v1, z0], [u0 - o * 0.5, v1, z0], [0, 0, -1])
  if (ends[0]) t3(w, f, [u0, v0, z0], [u0, v1, z0], [u0, vm, z1], [-1, 0, 0])
  if (ends[1]) t3(w, f, [u1, v0, z0], [u1, v1, z0], [u1, vm, z1], [1, 0, 0])
}

/** A window panel on a face frame (wall at v = 0). */
const pane = (p: Part, f: F, a0: number, a1: number, z0: number, z1: number, d = 0.05) =>
  q(p, f, [a0, d, z0], [a1, d, z0], [a1, d, z1], [a0, d, z1], [0, 1, 0])

/**
 * Upper-floor guest-room windows: the same dark sash colour, but unlit at
 * night (the evening photos show most rooms dark and the walls washed);
 * ground floors, lanterns, dormers and the public rooms use `window`.
 */
let SASH: Part | null = null

/**
 * The ground under the walls, above y = 0: the site rises about 2.7 m from
 * the ocean side to the inland side (Mapterhorn; the lidar ground rises
 * 1.6 m to the north-east and 4 m into the court). Ground-floor windows
 * start above it.
 */
const groundAt = (x: number) => Math.min(2.7, Math.max(0, (2.7 * (60 - x)) / 55))

/** Rows of grouped window panels along a face, centred, at the given bay pitch. */
function facade(win: Part, fc: { f: F; half: number }, rows: [number, number][], pitch = 4.2, w = 2.4, margin = 1.6) {
  const n = Math.floor((2 * (fc.half - margin) - w) / pitch) + 1
  if (n < 1) return
  const span = (n - 1) * pitch
  for (let i = 0; i < n; i++) {
    const a = -span / 2 + i * pitch
    const g = groundAt(P(fc.f, a, 0, 0)[0])
    for (const [z0, z1] of rows) pane(z0 < 5 || !SASH ? win : SASH, fc.f, a - w / 2, a + w / 2, Math.max(z0, g + 0.6), z1)
  }
}

/** A wing: walls, hip roof, grouped windows on the listed faces. */
function wing(w: Part, r: Part, win: Part, f: F, u0: number, u1: number, v0: number, v1: number, eave: number, top: number, iu: number, iv: number,
  rows: [number, number][], faces: Array<'u0' | 'u1' | 'v0' | 'v1'>, pitch = 4.2) {
  box(w, f, u0, u1, v0, v1, 0, eave, false)
  hip(r, f, u0, u1, v0, v1, eave, top, iu, iv)
  for (const s of faces) facade(win, face(f, u0, u1, v0, v1, s), rows, pitch)
}

/**
 * A cross gable on a wall: a bay standing `d` proud of the wall (face frame
 * fc, wall at v = 0) from a0 to a1, up to the eave, under a gable whose
 * ridge runs back into the main roof by `back`.
 */
function crossGable(w: Part, r: Part, win: Part, fc: F, a0: number, a1: number, d: number, eave: number, peak: number, back: number, rows: [number, number][]) {
  // turn so the ridge runs along u (outward)
  const g: F = { ox: fc.ox, oy: fc.oy, ux: -fc.uy, uy: fc.ux } // u = outward, v = -along
  box(w, g, -1, d, -a1, -a0, 0, eave, false)
  gable(r, w, g, -back, d, -a1, -a0, eave, peak, 0.5, [false, true])
  const wd = a1 - a0
  const gnd = groundAt(P(fc, (a0 + a1) / 2, 0, 0)[0])
  for (const [z0, z1] of rows) pane(z0 < 5 || !SASH ? win : SASH, fc, a0 + wd * 0.2, a1 - wd * 0.2, Math.max(z0, gnd + 0.6), z1, d + 0.05)
  // a window in the gable itself
  const am = (a0 + a1) / 2, gz = eave + 0.8
  pane(win, fc, am - wd * 0.14, am + wd * 0.14, gz, gz + (peak - eave) * 0.42, d + 0.05)
}

/** A flat-faceted surface of revolution segment (two profile points) — crisp edges. */
const ring = (p: Part, cx: number, cy: number, a: XY, b: XY, seg: number, a0 = 0) => lathe(p, cx, cy, [a, b], seg, a0)

/** A flat panel on facet k of a seg-gon of apothem `ap` (a0 = the lathe's start angle). */
function facetPane(p: Part, cx: number, cy: number, ap: number, seg: number, k: number, w: number, z0: number, z1: number, a0 = 0, d = 0.05) {
  const t = a0 + ((k + 0.5) / seg) * 2 * Math.PI
  const o: XY = [Math.cos(t), Math.sin(t)]
  const f: F = { ox: cx + o[0] * ap, oy: cy + o[1] * ap, ux: o[1], uy: -o[0] }
  pane(p, f, -w / 2, w / 2, z0, z1, d)
}

/** A small bead lamp (octahedron). */
function bead(p: Part, c: V3, s: number) {
  const [x, y, z] = c
  const pts: V3[] = [[x + s, y, z], [x, y + s, z], [x - s, y, z], [x, y - s, z]]
  for (let i = 0; i < 4; i++) {
    const a = pts[i], b = pts[(i + 1) % 4]
    p.tri(a, b, [x, y, z + s]); p.tri(b, a, [x, y, z - s])
  }
}

/** A turret: body (round, seg-gon), a belvedere of windows, balcony, witch's hat. */
function turret(w: Part, r: Part, win: Part, cx: number, cy: number, rad: number, zBody: number, zBelv: number, apex: number, seg = 10, rows: [number, number][] = []) {
  const ap = rad * Math.cos(Math.PI / seg), a0 = 0
  ring(w, cx, cy, [rad, 0], [rad, zBody], seg, a0)
  for (let k = 0; k < seg; k += 1) for (const [z0, z1] of rows) if (k % 2 === 0) facetPane(win, cx, cy, ap, seg, k, rad * 0.45, z0, z1, a0)
  // balcony ring
  ring(w, cx, cy, [rad, zBody], [rad * 1.18, zBody], seg, a0)
  ring(w, cx, cy, [rad * 1.18, zBody], [rad * 1.18, zBody + 0.9], seg, a0)
  ring(w, cx, cy, [rad * 1.18, zBody + 0.9], [rad * 0.8, zBody + 0.9], seg, a0)
  // belvedere: lit lantern windows behind white posts
  ring(win, cx, cy, [rad * 0.8, zBody + 0.9], [rad * 0.8, zBelv], seg, a0)
  // witch's hat with an eave
  ring(r, cx, cy, [rad * 0.8, zBelv], [rad * 1.12, zBelv], seg, a0)
  ring(r, cx, cy, [rad * 1.12, zBelv], [0, apex], seg, a0)
}

/** A square tower body under an octagonal belvedere and a tall hat. */
function squareTower(w: Part, r: Part, win: Part, cx: number, cy: number, half: number, zBody: number, zBelv: number, apex: number) {
  const f = ID
  box(w, f, cx - half, cx + half, cy - half, cy + half, 0, zBody, w)
  for (const s of ['u0', 'u1', 'v0', 'v1'] as const) {
    const fc = face(f, cx - half, cx + half, cy - half, cy + half, s)
    pane(win, fc.f, -half * 0.45, half * 0.45, zBody - 7.5, zBody - 1.5)
  }
  const rad = half * 0.95, seg = 8, a0 = Math.PI / 8
  ring(w, cx, cy, [half * 1.25, zBody], [half * 1.25, zBody + 0.8], seg, a0)
  ring(w, cx, cy, [half * 1.25, zBody + 0.8], [rad * 0.8, zBody + 0.8], seg, a0)
  ring(win, cx, cy, [rad * 0.8, zBody + 0.8], [rad * 0.8, zBelv], seg, a0)
  ring(r, cx, cy, [rad * 0.8, zBelv], [rad * 1.15, zBelv], seg, a0)
  ring(r, cx, cy, [rad * 1.15, zBelv], [0, apex], seg, a0)
}

// ---------------------------------------------------------------------------

const WHITE = finish('del-white', 0xf2ece2)
const RED = finish('del-roof', 0xb5503d)
const WINDOW: MaterialSpec = { name: 'window', color: 0x5d6670, roughness: 0.4 }
const SASH_MAT = finish('del-sash', 0x5d6670, 0.4)
const LAMP: MaterialSpec = { name: 'lamp', color: 0xe9e4d6, roughness: 0.5 }

// Ballroom cone centre and profile (HABS sheet 7, scaled; centre from lidar).
const CONE: XY = [47, 42]
const CONE_PROF: XY[] = [[13.7, 14.0], [11.7, 16.4], [5.4, 25.0], [3.3, 27.9]]
const coneR = (z: number) => {
  for (let i = 0; i < CONE_PROF.length - 1; i++) {
    const [r0, z0] = CONE_PROF[i], [r1, z1] = CONE_PROF[i + 1]
    if (z >= z0 && z <= z1) return r0 + ((z - z0) / (z1 - z0)) * (r1 - r0)
  }
  return 3.3
}
const TOWER_TOPS: Array<[number, number, number]> = [[CONE[0], CONE[1], 4.5], [18.5, 43.5, 4.0], [-23.5, -63.5, 4.4], [-26.5, -14, 4.2]]

function build() {
  const w = new Part(), r = new Part(), win = new Part(), lamp = new Part(), sash = new Part()
  SASH = sash

  // Storey groups (2–3 storeys per panel; HABS section A floors).
  const R18: [number, number][] = [[1.8, 4.6], [5.8, 10.6], [11.8, 16.4]]
  const R15: [number, number][] = [[1.4, 3.8], [5.0, 9.2], [10.2, 14.0]]

  // ---- The ring of wings round the court (lidar wall lines and heights).
  // North-west wing (back), y -66..-49.5.
  wing(w, r, win, ID, -30, 40, -66, -49.5, 17.5, 21.3, 4.5, 4.5, R18, ['v0', 'v1'])
  // North-west/ocean corner block, gable to the ocean (HABS ph. 6, Ctorbann 04).
  box(w, ID, 38, 55, -72, -49.5, 0, 17.5, false)
  gable(r, w, ID, 38, 55, -72, -49.5, 17.5, 23.7, 0.7)
  facade(win, face(ID, 38, 55, -72, -49.5, 'u1'), R18, 4.0)
  facade(win, face(ID, 38, 55, -72, -49.5, 'v0'), R18, 4.0)
  { // a gable window in the ocean gable
    const fc = face(ID, 38, 55, -72, -49.5, 'u1')
    pane(win, fc.f, -2.2, 2.2, 18.4, 20.6)
  }
  // North-east wing, x -29..-9.
  wing(w, r, win, ID, -29, -9, -49.5, 19, 17.5, 21.5, 5, 5, R18, ['u0', 'u1'])
  // its cross block with the slim tower
  box(w, ID, -31, -9, -12, -4, 0, 18, false)
  hip(r, ID, -31, -9, -12, -4, 18, 24, 3, 4)
  // Ocean wing, x 31..53 (low-pitched roof, verandas on every floor).
  // the ocean face reads as tiers of deep verandas: wide panels, thin posts
  wing(w, r, win, ID, 31, 53, -49.5, 22, 15, 16.5, 6, 6, R15, ['u0'], 4.0)
  facade(win, face(ID, 31, 53, -49.5, 22, 'u1'), R15, 4.0, 3.3, 1.2)
  // Front (entrance) wing, y 21..48.5.
  wing(w, r, win, ID, -12, 31, 21, 48.5, 18, 22, 6, 6, R18, ['v0', 'v1'])
  // the entrance block: tall hip, ridge along y
  wing(w, r, win, ID, -7, 5, 19, 50.5, 21, 27, 6, 5, [[1.8, 4.6], [5.8, 10.6], [11.8, 16.4], [17.2, 20.2]], ['v1'], 4.0)
  // block at x 20..28 next to the front turret
  box(w, ID, 20, 28, 22, 47, 0, 18, false)
  hip(r, ID, 20, 28, 22, 47, 18, 23.4, 3.6, 3.6)

  // ---- Cross gables (photos: north-west front, entrance front, NE side).
  // along-face coordinate of a model point, in a face frame
  const along = (fc: F, x: number, y: number) => (x - fc.ox) * fc.ux + (y - fc.oy) * fc.uy
  const bay = (fc: F, p0: XY, p1: XY, d: number, eave: number, peak: number, back: number) => {
    const a = along(fc, ...p0), b = along(fc, ...p1)
    crossGable(w, r, win, fc, Math.min(a, b), Math.max(a, b), d, eave, peak, back, R18)
  }
  const nwFace = face(ID, -30, 40, -66, -49.5, 'v0').f
  for (const x of [-11, 5, 22]) bay(nwFace, [x - 4, -66], [x + 4, -66], 1.2, 17.5, 24.0, 6)
  const neFace = face(ID, -29, -9, -49.5, 19, 'u0').f
  for (const y of [-36, 6]) bay(neFace, [-29, y - 3.5], [-29, y + 3.5], 1.0, 17.5, 23.5, 5)
  const frFace = face(ID, -12, 31, 21, 48.5, 'v1').f
  bay(frFace, [4, 48.5], [12, 48.5], 1.0, 18, 24.5, 6)

  // ---- Porches and terraces (lidar 3.4–11 m).
  box(w, ID, -30, 38, -70, -66, 0, 7.6, r)        // north-west veranda
  box(w, ID, -11, 27, 48.5, 54, 0, 10.7, r)        // entrance-front veranda
  box(w, ID, 53, 58.5, -45, 14, 0, 3.4, w)         // ocean terrace
  box(w, ID, -33, -29, -46, -12, 0, 11, r)         // north-east verandas
  box(w, ID, -38, -33, -46, -12, 0, 7.7, r)
  for (const [z0, z1] of [[1.6, 4.4], [5.4, 9.6]] as [number, number][]) {
    facade(win, face(ID, -11, 27, 48.5, 54, 'v1'), [[z0, z1]], 4.2)
    facade(win, face(ID, -30, 38, -70, -66, 'v0'), [[z0, Math.min(z1, 6.6)]], 4.2)
  }

  // ---- Low fill at the east corner, kitchen link and the octagon link.
  box(w, ID, -40, -29, -12, 20, 0, 12, r)
  box(w, ID, -52, -38, -14, 4, 0, 8, r)

  // ---- Crown Room (1888 dining room): gabled hall with an apsidal end.
  {
    const ang = Math.atan2(0.784, -0.6207) * 180 / Math.PI
    const fc = frame(-21.4, 29.2, ang)
    box(w, fc, 0, 26, -9, 9, 0, 10, false)
    gable(r, w, fc, 0, 26, -9, 9, 10, 20, 0.7, [false, false])
    // apse: half-round wall and half cone round (26, 0)
    const c = P(fc, 26, 0, 0), a0 = ((ang - 90) * Math.PI) / 180, seg = 12
    for (let k = 0; k < seg / 2; k++) {
      const t0 = a0 + (k / seg) * 2 * Math.PI, t1 = a0 + ((k + 1) / seg) * 2 * Math.PI
      const A = (rr: number, t: number, z: number): V3 => [c[0] + rr * Math.cos(t), c[1] + rr * Math.sin(t), z]
      const nn = (t: number): V3 => [Math.cos(t), Math.sin(t), 0]
      w.tri(A(9, t0, 0), A(9, t1, 0), A(9, t1, 10), undefined, undefined, undefined, [nn(t0), nn(t1), nn(t1)])
      w.tri(A(9, t0, 0), A(9, t1, 10), A(9, t0, 10), undefined, undefined, undefined, [nn(t0), nn(t1), nn(t0)])
      tf(r, A(9.7, t0, 9.3), A(9.7, t1, 9.3), [c[0], c[1], 20], [Math.cos((t0 + t1) / 2), Math.sin((t0 + t1) / 2), 1])
      tf(r, A(9.7, t0, 9.3), A(9.7, t1, 9.3), A(9, t1, 10), [0, 0, -1])
      tf(r, A(9.7, t0, 9.3), A(9, t1, 10), A(9, t0, 10), [0, 0, -1])
      const tm = (t0 + t1) / 2, o: XY = [Math.cos(tm), Math.sin(tm)], ap = 9 * Math.cos(Math.PI / seg)
      pane(win, { ox: c[0] + o[0] * ap, oy: c[1] + o[1] * ap, ux: o[1], uy: -o[0] }, -1.4, 1.4, 3.3, 8.6)
    }
    for (const s of ['v0', 'v1'] as const) facade(win, face(fc, 0, 26, -9, 9, s), [[2.2, 8.2]], 4.0, 2.6, 2.5)
  }
  // Kitchen / service hall across it (lidar ridge 22).
  {
    const ang = Math.atan2(-0.653, -0.757) * 180 / Math.PI
    const fk = frame(-30, 31, ang)
    box(w, fk, 0, 28, -7, 7, 0, 13, false)
    gable(r, w, fk, 0, 28, -7, 7, 13, 22, 0.6, [false, true])
    for (const s of ['v0', 'v1'] as const) facade(win, face(fk, 0, 28, -7, 7, s), [[2.0, 6.0], [7.2, 11.6]], 4.2)
  }

  // ---- North-east octagonal hall (lidar, NAIP).
  {
    const cx = -71, cy = -16, seg = 8, a0 = Math.PI / 8
    ring(w, cx, cy, [20, 0], [20, 10], seg, a0)
    ring(r, cx, cy, [20, 10], [21, 10], seg, a0)
    ring(r, cx, cy, [21, 10], [9.5, 16], seg, a0)
    ring(w, cx, cy, [9.5, 16], [9.5, 17], seg, a0)
    ring(r, cx, cy, [9.5, 17], [10.1, 17], seg, a0)
    ring(r, cx, cy, [10.1, 17], [0, 18.5], seg, a0)
    for (let k = 0; k < seg; k++) facetPane(win, cx, cy, 20 * Math.cos(Math.PI / seg), seg, k, 9, 3.3, 8.4, a0)
  }

  // ---- The Ballroom tower: drum, skirt roof, clerestory, cone, lantern.
  {
    const [cx, cy] = CONE, seg = 16, a0 = 0
    ring(w, cx, cy, [18.5, 0], [18.5, 7.6], seg, a0)
    ring(r, cx, cy, [18.5, 7.6], [19.4, 7.6], seg, a0)
    ring(r, cx, cy, [19.4, 7.6], [19.4, 7.9], seg, a0)
    ring(r, cx, cy, [19.4, 7.9], [12.8, 11.5], seg, a0)
    ring(w, cx, cy, [12.8, 11.5], [12.8, 14.0], seg, a0)
    ring(r, cx, cy, [12.8, 14.0], [13.7, 14.0], seg, a0)
    for (let i = 0; i < CONE_PROF.length - 1; i++) ring(r, cx, cy, CONE_PROF[i], CONE_PROF[i + 1], seg, a0)
    ring(w, cx, cy, [3.3, 27.9], [4.6, 28.9], seg, a0)          // brackets under the balcony
    ring(w, cx, cy, [4.6, 28.9], [4.6, 29.9], seg, a0)          // balcony rail
    ring(w, cx, cy, [4.6, 29.9], [3.2, 29.9], seg, a0)
    ring(win, cx, cy, [3.2, 29.9], [3.2, 32.9], seg / 2, a0)     // lantern, lit at night
    ring(r, cx, cy, [3.2, 32.9], [4.5, 32.9], seg / 2, a0)
    ring(r, cx, cy, [4.5, 32.9], [0, 39.0], seg / 2, a0)
    const apD = 18.5 * Math.cos(Math.PI / seg), apC = 12.8 * Math.cos(Math.PI / seg)
    for (let k = 0; k < seg; k++) {
      facetPane(win, cx, cy, apD, seg, k, 4.8, 1.0, 3.4, a0)
      facetPane(win, cx, cy, apD, seg, k, 4.8, 4.4, 7.0, a0)
      facetPane(win, cx, cy, apC, seg, k, 3.6, 12.0, 13.5, a0)
    }
    // two rows of dormers on the cone
    const dormer = (t: number, z: number, s: number) => {
      const rc = coneR(z + s * 0.5)
      const o: XY = [Math.cos(t), Math.sin(t)]
      const fd: F = { ox: cx + o[0] * rc, oy: cy + o[1] * rc, ux: o[0], uy: o[1] } // u outward
      box(w, fd, -1.6 * s, 0.5 * s, -0.6 * s, 0.6 * s, z, z + 1.0 * s, false)
      gable(r, w, fd, -1.6 * s, 0.5 * s, -0.6 * s, 0.6 * s, z + 1.0 * s, z + 1.75 * s, 0.25 * s, [false, true])
      const fw: F = { ox: cx + o[0] * (rc + 0.5 * s), oy: cy + o[1] * (rc + 0.5 * s), ux: o[1], uy: -o[0] }
      pane(win, fw, -0.38 * s, 0.38 * s, z + 0.18 * s, z + 0.85 * s)
    }
    for (let k = 0; k < 8; k++) dormer(((k + 0.5) / 8) * 2 * Math.PI, 18.0, 1.5)
    for (let k = 0; k < 8; k++) dormer((k / 8) * 2 * Math.PI, 22.6, 1.2)
    // globe lamps on the balcony posts (Ctorbann 05)
    for (let k = 0; k < 8; k++) {
      const t = ((k + 0.5) / 8) * 2 * Math.PI
      bead(lamp, [cx + 4.6 * Math.cos(t), cy + 4.6 * Math.sin(t), 30.35], 0.35)
    }
  }

  // ---- Turrets.
  turret(w, r, win, 18.5, 43.5, 3.2, 25.0, 27.2, 34.0, 10, [[19.0, 23.6]])      // front turret by the cone
  turret(w, r, win, -23.5, -63.5, 3.6, 24.0, 26.2, 31.2, 10, [[18.6, 22.8]])    // north-west corner turret (Dirk DBQ 2008)
  squareTower(w, r, win, -26.5, -14, 3.0, 29.0, 31.4, 40.0)                     // the slim north-east tower
  box(w, ID, -24.5, -18.5, 7.5, 13.5, 0, 22, false)                              // square turret
  hip(r, ID, -24.5, -18.5, 7.5, 13.5, 22, 27.5, 3, 3, 0.5)

  return { w, r, win, lamp, sash }
}

if (import.meta.main) {
  const { w, r, win, lamp, sash } = build()
  const near = (p: V3) => TOWER_TOPS.some(([x, y, rad]) => Math.hypot(p[0] - x, p[1] - y) < rad + 0.5)
  await saveModel('sd-hotel-del-coronado', 'Hotel del Coronado', [
    // a soft warm wash on the white walls; the lanterns' surroundings brighter
    { part: w, material: { ...WHITE, floodlight: (p: V3, n: V3) => (near(p) && p[2] > 24 ? 0.9 : n[2] > 0.7 ? 0 : 0.3) } as MaterialSpec },
    // the lit lantern caps glow from below (evening photos)
    { part: r, material: { ...RED, floodlight: (p: V3) => (near(p) && p[2] > 26 ? 0.75 : 0) } as MaterialSpec },
    { part: win, material: WINDOW },
    { part: sash, material: SASH_MAT },
    { part: lamp, material: LAMP },
  ], { anchor: [-117.17824, 32.68094], bearing: 126 }, 6500)
}
