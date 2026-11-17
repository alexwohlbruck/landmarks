/**
 * San Diego Central Library (330 Park Blvd, East Village; Rob Wellington
 * Quigley with Tucker Sadler, opened 2013) — original procedural geometry,
 * CC0-1.0.  bun generators/sd-central-library.ts
 *
 * Identity, in order: the latticed steel dome over the ninth-floor reading
 * room — a dark-silver egg, taller than wide and coming to a blunt point,
 * made of meridian ribs and horizontal louvre bands, open between them so
 * the glass reading room shows inside, with three heavier arch trusses; the
 * cluster of grey board-formed concrete blocks it sits on, their windows
 * framed by dark louvre screens; the east block wrapped in louvres under a
 * white cantilevered roof; the rust-red louvred drum on that roof.
 *
 * Round 2 (lead review): the dome is rebuilt as a rib cage instead of solid
 * sails with gaps, a step darker, egg-shaped with a blunt point at the same
 * lidar crown; walls cooled from cream to the photos' concrete grey; louvre
 * screens added over the grouped window panels.
 *
 * Frame: x east, y north, z up (map frame), metres; origin at the anchor,
 * the centroid of the OSM outline way/377357193 (-117.15420, 32.70892);
 * bearing 0 (the outline's faces run at 89.4 / 179.4 degrees, 0.6 degrees
 * off, ignored). y = 0 is the lowest ground under the footprint (the south
 * edge, on K Street); the ground rises ~3 m to the north edge.
 *
 * Sources
 * - OSM: outline way/377357193 (building=yes, 9 levels), dome part
 *   way/498788614 (building:part=dome). © OpenStreetMap contributors.
 * - USGS 3DEP lidar CA_SanDiegoQL2_2014 (flown 2014, a year after the
 *   library opened), 0.5 m grid centred on the anchor. Heights below are
 *   above the lowest ground (ground_min + 1.6 m).
 * - USGS NAIP orthophoto (plan, roof colour).
 * Photos (evidence):
 * - "San Diego Central Library Exterior 2024.jpg", Mzedp, CC0
 *   https://commons.wikimedia.org/wiki/File:San_Diego_Central_Library_Exterior_2024.jpg
 *   (from the south-east: dome, sails and gaps, red drum, louvred east block).
 * - "East Village, San Diego, CA, USA - panoramio (10).jpg", (13), (14),
 *   (15), (18), Roman Eugeniusz, CC BY-SA 3.0, e.g.
 *   https://commons.wikimedia.org/wiki/File:East_Village,_San_Diego,_CA,_USA_-_panoramio_(10).jpg
 *   (10: south; 14: south-west; 15: east).
 * - "San Diego Central Library.jpg", Nserrano, CC BY-SA 3.0
 *   https://commons.wikimedia.org/wiki/File:San_Diego_Central_Library.jpg
 * - "San Diego Central Library, San Diego, CA - 01.jpg", Jarek Tuszyński,
 *   CC BY 4.0 (night: dome lit gold from inside, windows lit)
 *   https://commons.wikimedia.org/wiki/File:San_Diego_Central_Library,_San_Diego,_CA_-_01.jpg
 * - "San Diego central library 5385.jpg", Avery Jensen, CC BY-SA 4.0 and
 *   "Exterior of San Diego Central Library, San Diego, CA.jpg", Jonatan
 *   Svensson Glad, CC BY-SA 4.0 (the lattice arches close up).
 * - "San Diego central library dome.jpg", Holly Cheng, CC BY-SA 3.0.
 *
 * Numbers
 * - Dome: crown 69 m (lidar 69.2; published overall height ~224 ft = 68 m);
 *   centred at (0.3, -18) on the lidar crown and the OSM dome part
 *   (measured). Widest ring r 19.5 m at 45 m (the lidar's 52-56 m returns
 *   at r 18-19 fit it); above it r = 19.5 cos(p)^1.2, a blunt point; below
 *   it tucks in to r ~11 at its foot at 28 m (estimated from the photos:
 *   lidar cannot see under the widest ring).
 * - Lattice: 16 meridian ribs (1 m), three arch trusses (1.9 m) at about az
 *   35, 155 and 270 where the photos show the sails' edge arches, and seven
 *   louvre bands 6 m apart (1.3 m). The real louvres are far denser; this
 *   is the spacing that still reads as a cage at 200 px (estimated).
 * - Blocks (lidar, measured): north block 47 m; east louvred block 44.5 m;
 *   west block 41.5 m; west slab 48.5 m; podium/south-west wing 21-22 m;
 *   the stacked boxes in front of the dome 39.5 m (lidar 38-40 m).
 * - Red drum: r ~5 m, 6 m tall, on the east block's south end at
 *   (23, -3) (lidar bump 49 m against the 44 m roof; photos).
 * - Glass reading room: octagon r 11 m from the podium to 58 m (estimated
 *   from the photos, where it rises to about two-thirds of the dome).
 * - Colours from the daylight photos: board-formed concrete cool grey
 *   (#d4d4d0, pulled light), louvre screens dark grey/silver (#a2a7aa), the
 *   dome dark silver (#a7aeb3), the drum rust red; the glass reads light and
 *   reflective, so the window colour is a lighter slate.
 * - Window grouping and bay widths: estimated from the photos.
 *
 * Night: the dome glows gold from inside in every night photo, so the
 * lattice carries _FLOODLIGHT; windows glow.
 *
 * Doubts / left out
 * - No licensed photo from the north or north-west; those facades follow
 *   the south and west ones.
 * - The Neil Morgan Auditorium (way/377357199, the curved wing with the
 *   sloped louvre roof south of the building) is a separate OSM building
 *   and is left to the map. The tilted glass prow at the top of the west
 *   slab, the entrance canopies and the lettering are left out.
 * - Real louvres and lattice members are far too fine to model: the dome
 *   is a sparse cage of bold ribs and bands, so it reads more open than the
 *   real, densely louvred sails do from some angles.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, type Swatch } from './palette'
import { save, walls, cap, inset, panel, rect, type XY } from './chi-aon-center'

const CONC = finish('library-concrete', 0xd4d4d0) // grey board-formed concrete
const ALU = finish('library-aluminium', 0xa7aeb3, 0.45) // the dome's dark-silver lattice
const DRUM = finish('library-drum', 0xbf694e)
const LOUVRE = finish('library-louvre', 0xa2a7aa, 0.6) // dark grey/silver louvre screens and frames
const WIN = { name: 'window', color: 0x8ea4b4, roughness: 0.35 } // the library's glass reads light and reflective
const ROOF = finish('library-roof', 0xc4c5c2)

const conc = new Part(), louvre = new Part(), alu = new Part(), drum = new Part(), win = new Part(), roof = new Part()

// ---------------------------------------------------------------------------
// Blocks

/** A block from z0 to z1 with a 0.4 m bevel at the top and a flat roof. */
function box(wall: Part, r: XY[], z0: number, z1: number, top: Part = roof, b = 0.4) {
  const ins = inset(r, b)
  walls(wall, r, z0, z1 - b)
  walls(wall, r, z1 - b, z1, ins)
  cap(top, ins, z1)
}

/**
 * Window panels on wall a→b of a counter-clockwise ring: bays `bay` wide with
 * `gap` piers, over storey groups `rows`, skipping `end` at each corner.
 */
function windows(p: Part, a: XY, b: XY, rows: [number, number][], bay = 3.2, gap = 1.1, end = 1.2, s0 = 0, s1?: number, out = 0.05) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  const lo = s0 + end, hi = (s1 ?? L) - end, use = hi - lo
  if (use < bay) return
  const k = Math.max(1, Math.round((use + gap) / (bay + gap))), w = (use - (k - 1) * gap) / k
  for (let q = 0; q < k; q++) for (const [z0, z1] of rows) panel(p, a, b, lo + q * (w + gap), lo + q * (w + gap) + w, z0, z1, out)
}
/**
 * Framed windows: each grouped panel gets a dark louvre screen over its upper
 * part, standing a little proud, as on the library's concrete blocks.
 */
function framed(a: XY, b: XY, rows: [number, number][], bay = 3.2, gap = 1.1, end = 1.2, share = 0.45) {
  windows(win, a, b, rows, bay, gap, end)
  windows(louvre, a, b, rows.map(([z0, z1]) => [z1 - (z1 - z0) * share, z1 + 0.3] as [number, number]), bay + 0.6, gap - 0.6, end - 0.3, 0, undefined, 0.16)
}
const groups = (z0: number, z1: number, n: number, sp = 1.0): [number, number][] =>
  Array.from({ length: n }, (_, i) => [z0 + i * (z1 - z0) / n + sp / 2, z0 + (i + 1) * (z1 - z0) / n - sp / 2] as [number, number])

/** Walls of ring r, each edge given a window treatment by a callback. */
function facade(r: XY[], f: (a: XY, b: XY, i: number) => void) {
  r.forEach((a, i) => f(a, r[(i + 1) % r.length], i))
}

// Podium: the OSM outline (way/377357193), counter-clockwise, to 21.5 m.
const OUTLINE: XY[] = ([
  [-19.59, 42.03], [19.22, 42.41], [19.30, 33.96], [25.43, 34.00], [29.21, 34.06], [29.95, 32.21], [33.24, 32.24],
  [33.52, 3.17], [30.75, 3.15], [30.97, -17.76], [25.10, -17.80], [21.36, -17.86], [21.50, -31.61], [21.54, -35.85],
  [14.41, -35.80], [8.61, -35.76], [8.51, -37.60], [-3.84, -39.11], [-10.50, -40.05], [-10.55, -50.16],
  [-24.98, -50.43], [-27.48, -50.33], [-27.73, -26.96], [-34.95, -27.02], [-35.15, -6.52], [-19.72, -6.37],
  [-19.91, 12.53], [-28.28, 12.45], [-28.47, 32.60], [-19.49, 32.69],
] as XY[]).reverse() // OSM runs clockwise
// Merge the near-collinear points the import carries.
const POD = OUTLINE.filter((p, i, r) => {
  const a = r[(i - 1 + r.length) % r.length], b = r[(i + 1) % r.length]
  const c = (p[0] - a[0]) * (b[1] - p[1]) - (p[1] - a[1]) * (b[0] - p[0])
  return Math.abs(c) > 2.0
})
const PZ = 21.5
const ZB = 28 // the dome's foot, inside the blocks
box(conc, POD, 0, PZ)
// Podium windows: a tall glazed ground floor and two two-storey bands.
facade(POD, (a, b) => {
  windows(win, a, b, [[0.6, 6.0], ...groups(7.0, PZ - 0.6, 2, 1.6)], 3.0, 2.2, 1.5)
})

// Upper blocks (lidar heights).
const NORTH = rect(-20.0, 30.0, 19.3, 42.2)
const NW = rect(-20.0, 3.0, 5.0, 30.0)
const EAST = rect(5.0, -8.0, 33.0, 30.0)
const WEST = rect(-28.3, -6.4, -20.0, 32.6)
const SLAB = rect(-35.0, -27.0, -20.0, -6.4)
const CORE = rect(-19.0, -28.0, 19.0, 3.0)
const FRONT = rect(-19.0, -36.0, 10.0, -28.0) // the stacked glass-and-louvre boxes in front of the dome

box(conc, NORTH, PZ, 47.0)
box(conc, NW, PZ, 47.0)
box(conc, WEST, PZ, 41.5)
box(conc, SLAB, PZ, 48.5)
box(conc, CORE, PZ, ZB)
box(conc, FRONT, PZ, 39.5)
// The east block: louvres wrap it above the podium.
box(louvre, EAST, PZ, 44.5)

// Windows on the concrete blocks, grouped two storeys (~8.4 m).
const up = (z0: number, z1: number) => groups(z0, z1, Math.max(1, Math.round((z1 - z0) / 8.4)), 1.3)
const [n0, n1, n2, n3] = NORTH
framed(n2, n3, up(PZ, 47), 2.6, 2.6) // north face
framed(n3, n0, up(PZ, 47), 2.6, 2.6) // west face above the west block
framed(n1, n2, up(44.5, 47), 2.6, 2.6)
const [w0, w1, w2, w3] = WEST
framed(w3, w0, up(PZ, 41.5), 2.2, 2.6) // west face, punched
framed(w2, w3, up(PZ, 41.5), 2.2, 2.6)
const [s0, s1, s2, s3] = SLAB
framed(s3, s0, up(PZ, 48.5), 2.2, 2.6)
framed(s0, s1, up(PZ, 48.5), 2.2, 2.6) // south face of the west slab
framed(s2, s3, up(41.5, 48.5), 2.2, 2.6)
const [f0, f1, f2] = FRONT
// The stack's south and east faces: broad glass between concrete frames.
framed(f0, f1, up(PZ, 39.5), 4.5, 1.6, 1.5)
framed(f1, f2, up(PZ, 39.5), 3.0, 1.6, 1.0)
const [, e1, e2, e3] = EAST
windows(win, e2, e3, [[PZ + 0.5, 44.0]], 2.4, 2.0, 2.0, 0, 3) // a glazed slot at the north-east corner
// The east block's louvre skin: broad window openings grouped two storeys,
// half screened (lit at night through the louvres).
const [e0] = EAST
framed(e0, e1, up(PZ, 44.5), 6.0, 2.4, 2.0, 0.5)
framed(e1, e2, up(PZ, 44.5), 6.0, 2.4, 2.0, 0.5)

// The white cantilevered roof over the east block, overhanging east and south.
{
  const r = rect(5.0, -10.0, 35.0, 30.0)
  walls(conc, r, 44.5, 45.3)
  cap(conc, r, 45.3)
  cap(conc, r, 44.5, false)
}

// The red louvred drum on the east block's south end, with its white posts.
{
  const cx = 23, cy = -3, R = 5.0, z0 = 45.3, z1 = 51.0, n = 16
  const ring = (r: number): XY[] => Array.from({ length: n }, (_, i) => [cx + r * Math.cos((i / n) * 2 * Math.PI), cy + r * Math.sin((i / n) * 2 * Math.PI)] as XY)
  walls(drum, ring(R), z0, z1)
  cap(drum, ring(R), z1)
  for (let i = 0; i < n; i += 2) {
    const a = (i / n) * 2 * Math.PI, x = cx + (R - 0.35) * Math.cos(a), y = cy + (R - 0.35) * Math.sin(a)
    box(conc, rect(x - 0.4, y - 0.4, x + 0.4, y + 0.4), z1, z1 + 1.6, conc, 0.15)
  }
}

// ---------------------------------------------------------------------------
// The dome

const DC: XY = [0.3, -18], A = 19.5, ZW = 45, CU = 24, CL = 17, TOP = ZW + CU // 69 m
// The profile is an egg, taller than wide: widest (r 19.5) at 45 m, rising to
// a blunt point at the lidar crown (69 m) — r = A cos(p)^1.2 above the
// widest ring — and tucking in below to r ~11 at its foot at 28 m.
// p is the profile angle.
const K = 1.2
const prof = (p: number): [number, number] => (p >= 0 ? [A * Math.cos(p) ** K, ZW + CU * Math.sin(p)] : [A * Math.cos(p), ZW + CL * Math.sin(p)])
const pOf = (z: number) => Math.asin(Math.max(-1, Math.min(1, (z - ZW) / (z < ZW ? CL : CU))))
/** Point on the dome at compass azimuth az (deg) and profile angle p, `off` m outward. */
function domeP(az: number, p: number, off = 0): V3 {
  const t = (az * Math.PI) / 180, [r, z] = prof(p)
  const n = domeN(az, p)
  return [DC[0] + r * Math.sin(t) + off * n[0], DC[1] + r * Math.cos(t) + off * n[1], z + off * n[2]]
}
function domeN(az: number, p: number): V3 {
  const t = (az * Math.PI) / 180
  const [nr, nz] = p >= 0 ? [CU * Math.cos(p), K * A * Math.cos(p) ** (K - 1) * Math.sin(p)] : [CL * Math.cos(p), A * Math.sin(p)]
  const l = Math.hypot(nr, nz) || 1
  return [(nr / l) * Math.sin(t), (nr / l) * Math.cos(t), nz / l]
}
/** Profile angles from height z0 to the crown, spread evenly along the arc. */
const zRing = (z0: number) => {
  const p0 = pOf(z0), k = Math.max(3, Math.round((Math.PI / 2 - p0) / 0.2))
  return Array.from({ length: k + 1 }, (_, i) => p0 + (Math.PI / 2 - p0) * (i / k))
}

/** A square tube along a list of points, `w` wide, its faces turned to the dome normal. */
function tube(p: Part, pts: V3[], nrm: V3[], w: number) {
  const secs = pts.map((c, i) => {
    const d = sub3(pts[Math.min(i + 1, pts.length - 1)], pts[Math.max(i - 1, 0)])
    const n = nrm[i]
    const s = norm3(cross3(d, n)) // sideways
    const h = w / 2
    return [add3(c, add3(scale3(s, -h), scale3(n, -h))), add3(c, add3(scale3(s, h), scale3(n, -h))), add3(c, add3(scale3(s, h), scale3(n, h))), add3(c, add3(scale3(s, -h), scale3(n, h)))]
  })
  // each side carries its own smooth normal along the tube, so consecutive
  // segments share vertices (and the file stays small)
  const sideN = (k: number, i: number): V3 => {
    const j = (i + 1) % 4, m = scale3(add3(secs[k][i], secs[k][j]), 0.5)
    return norm3(sub3(m, pts[k]))
  }
  for (let k = 0; k < secs.length - 1; k++) {
    const r0 = secs[k], r1 = secs[k + 1]
    for (let i = 0; i < 4; i++) {
      const j = (i + 1) % 4, n0 = sideN(k, i), n1 = sideN(k + 1, i)
      p.tri(r0[i], r0[j], r1[j], undefined, undefined, undefined, [n0, n0, n1])
      p.tri(r0[i], r1[j], r1[i], undefined, undefined, undefined, [n0, n1, n1])
    }
  }
}
const sub3 = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const add3 = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const scale3 = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const dot3 = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const cross3 = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const norm3 = (a: V3): V3 => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l] }

/** A lattice arch along a meridian, from the foot to near the crown. */
function rib(az: number, z0: number, w = 1.0, off = 0.6) {
  const zs = zRing(z0).slice(0, -1)
  zs.push(Math.PI / 2 - 0.04)
  tube(alu, zs.map((z) => domeP(az, z, off)), zs.map((z) => domeN(az, z)), w)
}
/** A lattice ring across a gap at height z. */
function hoop(a0: number, a1: number, z: number, w = 0.6) {
  const p = pOf(z), n = Math.max(6, Math.round((a1 - a0) / (z > 60 ? 30 : 20)))
  const az = Array.from({ length: n + 1 }, (_, i) => a0 + ((a1 - a0) * i) / n)
  tube(alu, az.map((a) => domeP(a, p, 0.3)), az.map((a) => domeN(a, p)), w)
}

// The lattice: a cage of meridian ribs and horizontal louvre bands, open
// between them so the glass reading room shows through; three heavier arch
// trusses (the sails' edges in the photos) at about az 35, 155 and 270.
for (let az = 0; az < 360; az += 22.5) rib(az, ZB, 1.0, 0.2)
for (const az of [35, 155, 270]) rib(az, ZB, 1.9, 0.7)
for (const z of [32, 38, 44, 50, 56, 61.5, 66]) hoop(0, 360, z, 1.3)

// The glass reading room inside the lattice: an octagon to 58 m, roofed.
{
  const n = 8, R = 11
  const oct: XY[] = Array.from({ length: n }, (_, i) => [DC[0] + R * Math.cos(((i + 0.5) / n) * 2 * Math.PI), DC[1] + R * Math.sin(((i + 0.5) / n) * 2 * Math.PI)] as XY)
  walls(conc, oct, PZ, 58)
  cap(roof, oct, 58)
  facade(oct, (a, b) => windows(win, a, b, groups(PZ, 57.5, 4, 0.8), 3.0, 0.5, 0.4))
}

// The dome is lit gold from inside at night: flood the dome, not the louvred block.
const DOME_LIGHT = (p: V3) => (p[2] > ZB - 1 && Math.hypot(p[0] - DC[0], p[1] - DC[1]) < A + 3 ? 0.9 : 0)

if (import.meta.main) {
  await save('sd-central-library', 'San Diego Central Library', [-117.1542, 32.70892], 0, [
    { part: conc, material: CONC },
    { part: win, material: WIN },
    { part: alu, material: { ...ALU, floodlight: DOME_LIGHT } as Swatch },
    { part: drum, material: DRUM },
    { part: louvre, material: LOUVRE },
    { part: roof, material: ROOF },
  ], 5000)
}
