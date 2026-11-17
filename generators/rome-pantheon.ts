/**
 * Pantheon (Santa Maria ad Martyres), Piazza della Rotonda, Rome:
 * procedural, CC0-1.0, no textures.
 *   bun generators/rome-pantheon.ts
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 356.5 (the
 * portico faces a little west of north onto the piazza; the bearing is the
 * one that makes the OSM portico parts and the 16 OSM column circles
 * symmetric about the model's y axis). Origin: the centroid of the OSM
 * outline, relation/3374342, at 12.476829, 41.898602. The rotunda's centre
 * is 5.2 m south of it. Everything is symmetric about x = 0 except the
 * inscription.
 *
 * Modelled: the brick rotunda (drum) with its three cornice bands, a few of
 * its small windows, the flat terrace on top and the low brick ring above
 * it; the six lead-grey step rings of the lower dome and the smooth upper
 * dome with the open oculus (8.2 m) and its raised rim, open to a dark
 * interior; the intermediate block between rotunda and portico, marble in
 * the portico and brick above, with its band and top cornice and the
 * "second pediment" in relief on its front above the portico roof; the
 * pronaos: a two-step platform, 16 real round Corinthian columns (8 across
 * the front, then two rows of 4 behind columns 1, 3, 6 and 8, making the
 * three aisles), front shafts grey granite and the inner ones pink, white
 * marble bases, leafy capitals and abaci; the architraves over every column
 * row, the frieze with the bronze inscription M·AGRIPPA·L·F·COS·TERTIVM·FECIT
 * as real letters, the cornice, the pediment with recessed tympanum and
 * raking cornices, the tiled gable roof and the dark coffered ceiling; at
 * the back of the porch, the doorway with its marble frame and bronze
 * doors, and the two great semicircular apses at the ends of the side
 * aisles (real concave niches with half-domes); and the brick ruin wall
 * against the back of the rotunda (OSM part relation/3374343) with its top
 * sloping down to the drum.
 *
 * Sources
 * - OSM (ODbL), fetched 2026-11: the outline relation/3374342
 *   (building=temple, wikidata Q99309) and its parts: the drum way/23840631
 *   (28.3 m) and the drum cornice bands relation/3373283 (10.8-11 m),
 *   relation/3373286 (20.7-20.9 m), relation/3373281 (28.3-28.5 m); the
 *   six dome rings way/251373435, 429, 433, 430, 432, 431 (tops 31 to 36 m,
 *   radii 24.6 to 18.1 m); the dome relation/3373289 (to 44 m) and the
 *   oculus way/30967221 (43 m, 8.8 m across); the block way/245621144
 *   (15-28.5 m) and its second pediment relation/3373316 (gabled 20.9 to
 *   26.9 m) with the band relation/3373284 (20.7-20.9) and cornice
 *   relation/3373285 (28.3-28.5); the portico roof relation/3373280
 *   (gabled), entablature relation/3373088 (12.85-15) and
 *   relation/3373282, the pronao floor relation/3373279; the apse walls
 *   way/251373427 and way/251373434; the 16 columns relation/3373288
 *   (centres used as they are, symmetrised: front row x = ±2.38, ±7.25,
 *   ±12.12, ±16.93 at y = 42.77; rows behind at y = 38.1 and 33.5, x =
 *   ±7.25 and ±16.93); the plinths relation/3373287; the rear ruin
 *   relation/3374343 (18 m). Two 0.2 m pedestals (way/251373449, 451) are
 *   not drawn.
 * - Published (Wikipedia "Pantheon, Rome"; MacDonald, "The Pantheon",
 *   1976): interior diameter and height to the oculus 43.3 m; oculus
 *   8.2 m (rim ~8.8 m, matching OSM); granite column shafts 11.8 m tall
 *   and 1.5 m across; eight columns across the front and two rows of four
 *   behind; grey Egyptian granite in front, pink granite inside; the
 *   inscription text.
 * - Photos (Wikimedia Commons, EVIDENCE):
 *   1 Nicholas Hartmann, "Rome Pantheon facade.jpg", CC BY-SA 4.0 (front:
 *     entablature, frieze, pediment, inscription; scale from the capitals,
 *     ~42 px/m); https://commons.wikimedia.org/wiki/File:Rome_Pantheon_facade.jpg
 *   2 Krzysztof Golik, "Pantheon in Rome (1).jpg", CC BY-SA 4.0 (from the
 *     north-west: drum zones and cornices, block, portico side, colours);
 *     https://commons.wikimedia.org/wiki/File:Pantheon_in_Rome_(1).jpg
 *   3 John Samuel, "Pantheon (Rome) - Exterior 01/04/05/10.jpg", CC BY-SA
 *     4.0 (portico from below and the north-east: grey front and pink inner
 *     shafts, rear apses and doorway, block side in marble);
 *     https://commons.wikimedia.org/wiki/File:Pantheon_(Rome)_-_Exterior_04.jpg
 *     https://commons.wikimedia.org/wiki/File:Pantheon_(Rome)_-_Exterior_10.jpg
 *   4 Nhartmannphotos, "Pantheon roof 1, Rome.jpg", CC BY-SA 4.0 (elevated,
 *     from the east: drum terrace, the low ring, the step rings and the
 *     upper dome, the block's side and second pediment, the tiled portico
 *     roof); https://commons.wikimedia.org/wiki/File:Pantheon_roof_1,_Rome.jpg
 *   5 Bjørn Christian Tørrissen, "Pantheon-Roof-from-Gianicolo-2012.JPG",
 *     CC BY-SA 3.0 (from the Gianicolo: the dome's profile and the pale
 *     lead of rings and cap);
 *     https://commons.wikimedia.org/wiki/File:Pantheon-Roof-from-Gianicolo-2012.JPG
 *   6 Wknight94, "Pantheon (Rome) E.jpg" and "E 2.jpg", CC BY-SA 3.0 (the
 *     back: the ruin wall sloping down to the drum, brick colour);
 *     https://commons.wikimedia.org/wiki/File:Pantheon_(Rome)_E_2.jpg
 *   7 Jean-Pol Grandmont, "0 Pantheon - Rome (1a).JPG", CC BY 3.0 (the
 *     block rising to the drum's top cornice; the cornice bands);
 *     https://commons.wikimedia.org/wiki/File:0_Pantheon_-_Rome_(1a).JPG
 *   8 Falk2, "14 494 Pantheon, Vittoriano, San Agnese.jpg", CC BY-SA 4.0
 *     (from Castel Sant'Angelo: the low dome in the skyline).
 *     https://commons.wikimedia.org/wiki/File:14_494_Pantheon,_Vittoriano,_San_Agnese.jpg
 * - Terrain: Mapterhorn has only z13 here (~15 m pixels; z14-15 404). The
 *   ground under the site varies by about 1 m (rising to the south); y = 0
 *   is the piazza at the portico. Elevation 0. The ancient ground beside the
 *   drum is lower than the piazza (a railed trench); not modelled.
 *
 * Numbers
 * - Measured from OSM: plan of drum (r 28.8), block (36.2 x 13.3 m),
 *   portico, columns, step-ring radii; cornice heights 11, 20.9, 28.5;
 *   step tops 31-36 (moved down 0.2 m to sit on the brick ring).
 * - Published: column shafts 11.8 m, about 1.5 m across; oculus.
 * - Measured on photo 1 (frontal): column centres 195 px apart and the
 *   lower shaft 65 px across, so with OSM's 4.84 m spacing the shaft is
 *   1.62 m at the foot (drawn 1.62, tapering to 1.40) and the gap 2.0
 *   diameters; oblique views (photo 2) foreshorten it to ~1.4. Abaci
 *   2.36 m square, bases 2.16 m.
 * - Estimated from photo 1 at ~42 px/m (looking up, so these are lower
 *   bounds): bases 0.8 m, capitals 1.6 m, abaci 0.25 m (column 14.45 m
 *   from the 0.45 m platform); architrave 1.3, frieze 1.4, cornice 1.3;
 *   pediment rise 7.0 m, raking cornices 1.5 m deep standing 1.0 m out of
 *   the tympanum. Apex 25.9 m: within the facade plane the photo gives
 *   42.5 px/m (capital to cornice) and the apex 6.8 m over the cornice, a
 *   lower bound; the block's top cornice (28.5 m, 16 m further back)
 *   appears level with the apex, consistent with a telephoto from ~100 m.
 *   So the apex sits ~2.6 m under the drum's top cornice; the porch only
 *   looks taller in the street photos because it is nearer. The roof's
 *   ridge falls from the apex to 23 m at the block (OSM tags the porch
 *   roof 15-20 m; photo 4 shows brick and the second pediment above the
 *   roof against the block); the second pediment runs from the 20.4 m
 *   band to just under the block's top cornice, in travertine. Inscription cap height 0.75 m over ~23 m. From photo 4:
 *   the low brick ring above the terrace (r 27.2, 1.3 m), the cap's profile
 *   (a sphere through the top step and the oculus rim, r 25.3 m). Apses
 *   r 2.8 m, springing at 9 m; the doorway 5.2 x 8.15 m.
 * - Invented: the porch roof's falling ridge (see above); the rear ruin's top slope (18 m at the south falling to 14 m
 *   at the drum, from photo 6's line); which drum windows are drawn.
 * - Simplified: no flutes, dentils, modillions, coffers, relieving arches,
 *   rafters or column entasis; capitals are lobed bells, not acanthus.
 *
 * Lettering: the frieze inscription is the portico's most famous feature,
 *   so it is drawn as real letters (STYLE.md, "Famous signs"), bronze
 *   Roman capitals traced from photos 1 and 3.
 *
 * Night: the portico, the drum and the block are floodlit (the portico
 *   brightest, the dome dim), as in night photos of the piazza.
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { Pen, strokes } from './lettering'
import { earcut, extrude, prism, rect, save, smooth, type XY } from './dc-wwii-memorial'

const TAU = Math.PI * 2

const brick = new Part()
const marble = new Part()
const grey = new Part()
const pink = new Part()
const lead = new Part()
const bronze = new Part()

// ---------------------------------------------------------------- helpers

/**
 * A surface of revolution about a vertical axis: rows of [r, z] from the
 * bottom of the profile to its end, with an optional radial modulation
 * f(angle) for lobed rings. No caps. Faces point to the right of the
 * profile's direction of travel (outward for a rising wall, down for an
 * outward step, up for an inward one).
 */
function lathe(p: Part, cx: number, cy: number, prof: Array<[number, number, ((a: number) => number)?]>, n: number, crease = 55) {
  smooth(p, m => {
    const rings = prof.map(([r, z, f]) => Array.from({ length: n }, (_, i) => {
      const a = ((i + 0.5) / n) * TAU
      const rr = r * (f ? f(a) : 1)
      return [cx + rr * Math.cos(a), cy + rr * Math.sin(a), z] as V3
    }))
    m.loft(rings)
  }, crease)
}

/** A flat polygon given in (u, v), emitted through `at`, wound so its normal points along `dir`. */
function face(p: Part, ring: XY[], at: (u: number, v: number) => V3, dir: V3) {
  for (const [i, j, k] of earcut(ring)) tri(p, at(...ring[i]), at(...ring[j]), at(...ring[k]), dir)
}
function tri(p: Part, a: V3, b: V3, c: V3, dir: V3) {
  const e1 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], e2 = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  const n = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]]
  if (n[0] * dir[0] + n[1] * dir[1] + n[2] * dir[2] < 0) p.tri(a, c, b)
  else p.tri(a, b, c)
}
function quad(p: Part, a: V3, b: V3, c: V3, d: V3, dir: V3) {
  tri(p, a, b, c, dir)
  tri(p, a, c, d, dir)
}
/** A box from corner ranges, all six faces. */
function box(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, bottom = true) {
  prism(p, rect((x0 + x1) / 2, (y0 + y1) / 2, (x1 - x0) / 2, (y1 - y0) / 2), z0, z1, 0, bottom)
}
/** Extrude an (x, z) profile along y from y0 to y1 (a facade piece). */
const alongY = (p: Part, ring: XY[], y0: number, y1: number) => extrude(p, ring, y0, y1, (u, v, w) => [u, w, v])

// ---------------------------------------------------------------- layout

const CY = -5.2 // rotunda centre (x 0)
const R = 28.8 // drum
const FLOOR = 0.45 // portico platform
const BLOCK = { x: 18.1, y0: 14.0, y1: 27.3, top: 28.5 }
const FRONT_Y = 42.77
const FRONT_X = [2.38, 7.25, 12.12, 16.93]
const INNER_X = [7.25, 16.93], INNER_Y = [38.1, 33.5]
// Column heights.
const BASE_TOP = FLOOR + 0.8, SHAFT_TOP = BASE_TOP + 11.8, CAP_TOP = SHAFT_TOP + 1.6, COL_TOP = CAP_TOP + 0.25
// Entablature.
const ARCH_TOP = COL_TOP + 1.3, FRIEZE_TOP = ARCH_TOP + 1.4, CORN_TOP = FRIEZE_TOP + 1.3
const ENT_X = FRONT_X[3] + 0.68, ENT_Y = FRONT_Y + 0.85, CORN_X = 18.6, CORN_Y = ENT_Y + 0.7
const RISE = 7.0, APEX = CORN_TOP + RISE, SLOPE = RISE / CORN_X, RIDGE_BACK = 23.0

// ---------------------------------------------------------------- rotunda

// The brick drum: three cornice bands, the top terrace and the low ring.
lathe(brick, 0, CY, [
  [R, 0], [R, 10.55], [R + 0.45, 10.7], [R + 0.45, 11.15], [R, 11.3],
  [R, 20.3], [R + 0.5, 20.45], [R + 0.6, 20.95], [R, 21.1],
  [R, 27.5], [R + 0.7, 27.7], [R + 0.95, 28.25], [R + 0.95, 28.5],
  [27.2, 28.5], [27.2, 29.8],
], 32)

// The lead-grey step rings and the upper dome up to the oculus rim.
{
  const steps: [number, number][] = [[27.2, 29.8]]
  const radii = [25.9, 24.6, 23.3, 22.0, 20.7, 19.4]
  radii.forEach((r, k) => { steps.push([r, 29.8 + k], [r, 30.8 + k]) })
  // The cap: a sphere through (18.4, 35.8) and the rim (4.7, 43.3).
  const r0 = 18.4, z0 = 35.8, r1 = 4.7, z1 = 43.3
  const zc = (r0 * r0 + z0 * z0 - r1 * r1 - z1 * z1) / (2 * (z0 - z1))
  const Rs = Math.hypot(r0, z0 - zc)
  const a0 = Math.asin(r0 / Rs), a1 = Math.asin(r1 / Rs)
  const cap: [number, number][] = []
  for (let k = 0; k <= 4; k++) {
    const a = a0 + ((a1 - a0) * k) / 4
    cap.push([Rs * Math.sin(a), zc + Rs * Math.cos(a)])
  }
  lathe(lead, 0, CY, [...steps, [r0, z0 + 0.0001], ...cap.slice(1), [4.7, 43.65], [4.1, 43.65], [4.1, 42.6]], 32)
  // Inside the oculus: the dark interior of the dome.
  lathe(bronze, 0, CY, [[4.1, 42.6], [4.1, 41.0], [0.01, 38.5]], 16)
}

// Small windows in the drum's middle and upper zones, flush on the brick.
for (const [deg, z] of [[150, 22.6], [180, 22.6], [210, 22.6], [118, 22.6], [242, 22.6], [270, 22.6], [90, 22.6],
  [165, 13.0], [195, 13.0], [130, 13.0], [230, 13.0], [255, 13.0], [105, 13.0], [0, 22.6]] as [number, number][]) {
  // deg is measured from the front (+y), counter-clockwise.
  const a = ((deg + 90) * Math.PI) / 180
  const nx = Math.cos(a), ny = Math.sin(a), tx = -ny, ty = nx
  const r = R + 0.04, cx = r * nx, cy = CY + r * ny, w = 0.65, h = 1.5
  if (cy > BLOCK.y0 - 0.5) continue
  quad(bronze, [cx - tx * w, cy - ty * w, z], [cx + tx * w, cy + ty * w, z], [cx + tx * w, cy + ty * w, z + h], [cx - tx * w, cy - ty * w, z + h], [nx, ny, 0])
}

// ---------------------------------------------------------------- block

{
  const { x, y0, y1, top } = BLOCK
  // Side walls: marble to the portico cornice, brick above; the top lead-grey.
  for (const s of [-1, 1]) {
    quad(marble, [s * x, y0, 0], [s * x, y1, 0], [s * x, y1, CORN_TOP], [s * x, y0, CORN_TOP], [s, 0, 0])
    quad(brick, [s * x, y0, CORN_TOP], [s * x, y1, CORN_TOP], [s * x, y1, top], [s * x, y0, top], [s, 0, 0])
  }
  quad(brick, [-x, y1, CORN_TOP], [x, y1, CORN_TOP], [x, y1, top], [-x, y1, top], [0, 1, 0])
  // Top cornice and the band at the second pediment's base, on front and sides.
  const band = (z0: number, z1: number, out: number) => {
    prism(brick, [[-x - out, y0], [x + out, y0], [x + out, y1 + out], [-x - out, y1 + out]], z0, z1, 0.12, true)
  }
  band(top - 0.85, top + 0.06, 0.75)
  band(20.4, 21.0, 0.5)
  // The second pediment: raking cornices from the band's ends to an apex
  // under the top cornice, standing out of the block's front.
  const ap = top - 0.85, s2 = (ap - 20.4) / x
  for (const s of [-1, 1]) {
    const ring: XY[] = [[s * x, 20.4], [0, ap], [0, ap - 1.25], [s * (x - 1.25 / s2), 20.4]]
    alongY(marble, ring, y1, y1 + 1.1)
  }
  // The porch cornice carried round the block's sides, in marble.
  for (const s of [-1, 1]) box(marble, s > 0 ? x : -x - 0.5, s > 0 ? x + 0.5 : -x, y0 + 0.4, y1, FRIEZE_TOP, CORN_TOP, true)
}

// Small windows in the block's sides, two storeys of two (photo 4).
for (const s of [-1, 1]) for (const yy of [17.6, 22.6]) for (const z of [22.6, 25.0]) {
  const X = s * (BLOCK.x + 0.04)
  quad(bronze, [X, yy - 0.45, z], [X, yy + 0.45, z], [X, yy + 0.45, z + 1.3], [X, yy - 0.45, z + 1.3], [s, 0, 0])
}

// The back wall of the porch (the block's front below the portico
// cornice): brick, with the doorway and the two apses cut through it.
{
  const Y = BLOCK.y1, x = BLOCK.x
  const NX = 12.09, NR = 2.8, SPRING = 9.0, DOOR = 2.6, DOOR_TOP = FLOOR + 8.15
  const arch = (cx: number): XY[] => {
    const pts: XY[] = [[cx - NR, FLOOR]]
    for (let k = 0; k <= 8; k++) {
      const a = Math.PI - (Math.PI * k) / 8
      pts.push([cx + NR * Math.cos(a), SPRING + NR * Math.sin(a)])
    }
    pts.push([cx + NR, FLOOR])
    return pts
  }
  const ring: XY[] = [
    [-x, FLOOR], ...arch(-NX), [-DOOR, FLOOR], [-DOOR, DOOR_TOP], [DOOR, DOOR_TOP], [DOOR, FLOOR],
    ...arch(NX), [x, FLOOR], [x, ARCH_TOP], [-x, ARCH_TOP],
  ]
  face(brick, ring, (u, v) => [u, Y, v], [0, 1, 0])
  // The apses: half-cylinders with half-domes, concave, in brick.
  for (const cx of [-NX, NX]) {
    const N = 8
    const P = (k: number, z: number): V3 => {
      const a = (Math.PI * k) / N
      return [cx + NR * Math.cos(a), Y - NR * Math.sin(a), z]
    }
    for (let k = 0; k < N; k++) {
      const a = (Math.PI * (k + 0.5)) / N
      const inward: V3 = [-Math.cos(a), Math.sin(a), 0]
      quad(brick, P(k, FLOOR), P(k + 1, FLOOR), P(k + 1, SPRING), P(k, SPRING), inward)
      for (let j = 0; j < 3; j++) {
        const e0 = (Math.PI / 2) * (j / 3), e1 = (Math.PI / 2) * ((j + 1) / 3)
        const Q = (kk: number, e: number): V3 => {
          const aa = (Math.PI * kk) / N
          return [cx + NR * Math.cos(e) * Math.cos(aa), Y - NR * Math.cos(e) * Math.sin(aa), SPRING + NR * Math.sin(e)]
        }
        const c: V3 = [cx, Y, SPRING]
        const m = Q(k + 0.5, (e0 + e1) / 2)
        const dir: V3 = [c[0] - m[0], c[1] - m[1], c[2] - m[2]]
        if (j < 2) quad(brick, Q(k, e0), Q(k + 1, e0), Q(k + 1, e1), Q(k, e1), dir)
        else tri(brick, Q(k, e0), Q(k + 1, e0), Q(k, e1), dir)
      }
    }
    // The apse floor stays the platform's.
  }
  // The doorway: deep reveals, the bronze doors, and a marble frame and lintel.
  const D = Y - 1.6
  for (const s of [-1, 1]) quad(marble, [s * DOOR, Y, FLOOR], [s * DOOR, D, FLOOR], [s * DOOR, D, DOOR_TOP], [s * DOOR, Y, DOOR_TOP], [-s, 0, 0])
  quad(marble, [-DOOR, Y, DOOR_TOP], [DOOR, Y, DOOR_TOP], [DOOR, D, DOOR_TOP], [-DOOR, D, DOOR_TOP], [0, 0, -1])
  quad(bronze, [-DOOR, D, FLOOR], [DOOR, D, FLOOR], [DOOR, D, DOOR_TOP], [-DOOR, D, DOOR_TOP], [0, 1, 0])
  for (const s of [-1, 1]) box(marble, s > 0 ? DOOR : -DOOR - 0.55, s > 0 ? DOOR + 0.55 : -DOOR, Y, Y + 0.2, FLOOR, DOOR_TOP + 0.55, false)
  box(marble, -DOOR - 0.9, DOOR + 0.9, Y, Y + 0.45, DOOR_TOP + 0.55, DOOR_TOP + 1.15, true)
  // Fluted pilasters at the porch's back corners, in marble.
  for (const s of [-1, 1]) box(marble, s > 0 ? x - 1.5 : -x, s > 0 ? x : -x + 1.5, Y, Y + 0.3, FLOOR, COL_TOP, false)
}

// ---------------------------------------------------------------- portico

// Platform: two low steps.
prism(marble, rect(0, (BLOCK.y1 + 44.0) / 2 - 0.2, 18.2, (44.0 - BLOCK.y1) / 2 + 0.2), 0, 0.22, 0.05)
prism(marble, rect(0, (BLOCK.y1 + 43.6) / 2 - 0.2, 17.8, (43.6 - BLOCK.y1) / 2 + 0.2), 0.22, FLOOR, 0.05)

/** One Corinthian column: marble base and capital, granite shaft. */
function column(shaft: Part, x: number, y: number) {
  prism(marble, rect(x, y, 1.08, 1.08), FLOOR, FLOOR + 0.32, 0.05)
  lathe(marble, x, y, [[1.02, FLOOR + 0.32], [0.84, BASE_TOP]], 12)
  lathe(shaft, x, y, [[0.81, BASE_TOP], [0.7, SHAFT_TOP]], 12)
  // The capital: a bell with two rows of leaves (8 lobes, staggered),
  // flaring at the top to the abacus' corners.
  const leaves = (k: number, phase: number) => (a: number) => 1 + k * Math.max(0, Math.cos(8 * a + phase))
  const corners = (a: number) => 1 + 0.26 * Math.pow(Math.abs(Math.cos(2 * a)), 3)
  lathe(marble, x, y, [
    [0.74, SHAFT_TOP], [0.98, SHAFT_TOP + 0.8, leaves(0.22, 0)], [1.1, CAP_TOP, corners],
  ], 16, 40)
  prism(marble, rect(x, y, 1.18, 1.18), CAP_TOP, COL_TOP, 0.06)
}
for (const xx of FRONT_X) for (const s of [-1, 1]) column(grey, s * xx, FRONT_Y)
for (const xx of INNER_X) for (const yy of INNER_Y) for (const s of [-1, 1]) column(pink, s * xx, yy)

// Architraves over every column row: across the front, and front to back
// over the side rows and the two rows that divide the aisles.
const Y1 = BLOCK.y1
box(marble, -ENT_X, ENT_X, FRONT_Y - 0.85, ENT_Y, COL_TOP, ARCH_TOP)
for (const s of [-1, 1]) {
  for (const xx of [INNER_X[0], INNER_X[1]]) {
    const outer = xx === INNER_X[1]
    const a = s * (xx - 0.65), b = s * (outer ? ENT_X : xx + 0.65)
    box(marble, Math.min(a, b), Math.max(a, b), Y1, FRONT_Y - 0.85, COL_TOP, ARCH_TOP)
  }
}
// The dark ceiling between the architraves.
quad(bronze, [-ENT_X, Y1, ARCH_TOP - 0.01], [ENT_X, Y1, ARCH_TOP - 0.01], [ENT_X, ENT_Y, ARCH_TOP - 0.01], [-ENT_X, ENT_Y, ARCH_TOP - 0.01], [0, 0, -1])
// The architrave's upper fascia and the moulding between architrave and
// frieze, standing a little proud, so the bands read.
box(marble, -ENT_X - 0.1, ENT_X + 0.1, FRONT_Y - 0.95, ENT_Y + 0.12, COL_TOP + 0.65, ARCH_TOP - 0.2, false)
box(marble, -ENT_X - 0.18, ENT_X + 0.18, Y1, ENT_Y + 0.2, ARCH_TOP - 0.2, ARCH_TOP + 0.05, true)
// Frieze and cornice.
box(marble, -ENT_X, ENT_X, Y1, ENT_Y, ARCH_TOP, FRIEZE_TOP, false)
prism(marble, [[-ENT_X - 0.35, Y1], [ENT_X + 0.35, Y1], [ENT_X + 0.35, ENT_Y + 0.35], [-ENT_X - 0.35, ENT_Y + 0.35]], FRIEZE_TOP, FRIEZE_TOP + 0.45, 0, true)
prism(marble, [[-CORN_X, Y1], [CORN_X, Y1], [CORN_X, CORN_Y], [-CORN_X, CORN_Y]], FRIEZE_TOP + 0.45, CORN_TOP, 0.15, true)

// The pediment: the tympanum set back, the raking cornices standing out.
{
  // The raking cornices 1.5 m deep, standing 1.0 m out of the tympanum,
  // with a soffit band under them.
  const lower = 1.5, inner = CORN_X - lower / SLOPE
  face(marble, [[-inner, CORN_TOP], [inner, CORN_TOP], [0, APEX - lower]], (u, v) => [u, CORN_Y - 1.0, v], [0, 1, 0])
  for (const s of [-1, 1]) {
    alongY(marble, [[s * CORN_X, CORN_TOP], [0, APEX], [0, APEX - lower], [s * inner, CORN_TOP]], CORN_Y - 1.0, CORN_Y)
    const i2 = CORN_X - (lower + 0.35) / SLOPE
    alongY(marble, [[s * inner, CORN_TOP], [0, APEX - lower], [0, APEX - lower - 0.35], [s * i2, CORN_TOP]], CORN_Y - 1.0, CORN_Y - 0.55)
    // The tiled roof slope, back to the block.
    // The roof's ridge falls from the pediment's apex to 23 m at the block
    // (OSM tags the porch roof lower than the pediment; photo 4 shows a brick
    // triangle and the second pediment above the roof against the block).
    quad(lead, [s * CORN_X, CORN_Y, CORN_TOP], [0, CORN_Y, APEX], [0, Y1, RIDGE_BACK], [s * CORN_X, Y1, CORN_TOP], [s * SLOPE, 0, 1])
  }
}

// The inscription in the frieze, M·AGRIPPA·L·F·COS·TERTIVM·FECIT, in bronze
// Roman capitals (cap height 1 here), traced from photos 1 and 3.
{
  const G: Record<string, { w: number; draw: (p: Pen) => void }> = {
    M: { w: 1.1, draw: p => p.moveTo([0, 0]).lineTo([0.1, 1]).lineTo([0.55, 0.05]).lineTo([1.0, 1]).lineTo([1.1, 0]) },
    A: { w: 0.92, draw: p => { p.moveTo([0, 0]).lineTo([0.46, 1]).lineTo([0.92, 0]); p.moveTo([0.2, 0.36]).lineTo([0.72, 0.36]) } },
    G: { w: 0.92, draw: p => { p.moveTo([0.86, 0.8]).arc([0.48, 0.5], 5.15, 6).lineTo([0.91, 0.48]); p.moveTo([0.62, 0.48]).lineTo([0.91, 0.48]) } },
    R: { w: 0.8, draw: p => { p.moveTo([0, 0]).lineTo([0, 1]).lineTo([0.42, 1]).arc([0.42, 0.74], -Math.PI, 4).lineTo([0, 0.48]); p.moveTo([0.36, 0.48]).lineTo([0.8, 0]) } },
    P: { w: 0.72, draw: p => p.moveTo([0, 0]).lineTo([0, 1]).lineTo([0.44, 1]).arc([0.44, 0.73], -Math.PI, 4).lineTo([0, 0.46]) },
    I: { w: 0, draw: p => p.moveTo([0, 0]).lineTo([0, 1]) },
    L: { w: 0.62, draw: p => p.moveTo([0, 1]).lineTo([0, 0]).lineTo([0.62, 0]) },
    F: { w: 0.6, draw: p => { p.moveTo([0.6, 1]).lineTo([0, 1]).lineTo([0, 0]); p.moveTo([0, 0.52]).lineTo([0.46, 0.52]) } },
    E: { w: 0.62, draw: p => { p.moveTo([0.6, 1]).lineTo([0, 1]).lineTo([0, 0]).lineTo([0.62, 0]); p.moveTo([0, 0.52]).lineTo([0.48, 0.52]) } },
    C: { w: 0.86, draw: p => p.moveTo([0.86, 0.79]).arc([0.48, 0.5], 5.0, 6) },
    O: { w: 0.96, draw: p => p.circle([0.48, 0.5], 0.48, 0.5, 10) },
    S: { w: 0.64, draw: p => p.moveTo([0.6, 0.88]).cubicTo([0.45, 1.04], [0.04, 1.0], [0.06, 0.74], 3).cubicTo([0.1, 0.5], [0.6, 0.55], [0.62, 0.27], 3).cubicTo([0.64, -0.02], [0.18, -0.04], [0.02, 0.12], 3) },
    T: { w: 0.8, draw: p => { p.moveTo([0, 1]).lineTo([0.8, 1]); p.moveTo([0.4, 1]).lineTo([0.4, 0]) } },
    V: { w: 0.86, draw: p => p.moveTo([0, 1]).lineTo([0.43, 0]).lineTo([0.86, 1]) },
    '·': { w: 0.1, draw: p => p.moveTo([0, 0.5]).lineTo([0.1, 0.5]) },
  }
  const text = 'M·AGRIPPA·L·F·COS·TERTIVM·FECIT'
  const GAP = 0.42
  const pen = new Pen()
  let u = 0
  for (const ch of text) {
    const g = G[ch]
    const one = new Pen()
    g.draw(one)
    pen.add(one, u)
    u += g.w + GAP
  }
  u -= GAP
  // Seen from the north, east is on the reader's left: u runs to -x.
  const H = 0.75, x0 = (u * H) / 2, z0 = ARCH_TOP + (FRIEZE_TOP - ARCH_TOP - H) / 2, y = ENT_Y
  strokes(bronze, pen.paths, { width: 0.15, depth: 0.08, place: (uu, v, w) => [x0 - uu * H, y + w, z0 + v * H] })
}

// ---------------------------------------------------------------- the rear ruin

{
  const x = 24.5, yS = -38.4, yN = -20.2, hS = 18, hN = 14
  const at = (yy: number) => hS + ((hN - hS) * (yy - yS)) / (yN - yS)
  quad(brick, [-x, yS, 0], [x, yS, 0], [x, yS, hS], [-x, yS, hS], [0, -1, 0])
  for (const s of [-1, 1]) face(brick, [[yS, 0], [yN, 0], [yN, hN], [yS, hS]], (u, v) => [s * x, u, v], [s, 0, 0])
  quad(brick, [-x, yS, hS], [x, yS, hS], [x, yN, at(yN)], [-x, yN, at(yN)], [0, 0.2, 1])
  // Tall round-headed windows under their relieving arches (photo 6):
  // two in each end wall, four in the back.
  const win = (at3: (u: number, v: number) => V3, dir: V3, u0: number) => {
    const pts: XY[] = [[u0 - 0.75, 6.5]]
    for (let k = 0; k <= 4; k++) pts.push([u0 - 0.75 * Math.cos((Math.PI * k) / 4), 10.0 + 0.75 * Math.sin((Math.PI * k) / 4)])
    pts.push([u0 + 0.75, 6.5])
    face(bronze, pts, at3, dir)
  }
  for (const s of [-1, 1]) for (const yy of [-33.5, -27.5]) win((u, v) => [s * (x + 0.04), u, v], [s, 0, 0], yy)
  for (const xx of [-15, -5, 5, 15]) win((u, v) => [u, yS - 0.04, v], [0, -1, 0], xx)
}

// ---------------------------------------------------------------- write

// Floodlight: the portico brightest, the drum and block washed, the dome dim.
const up = (n: V3) => (n[2] > 0.7 ? 0.45 : 1)
const lit = (k: number) => (_p: V3, n: V3) => k * up(n)
// The rear ruin (south of the drum's centre line) stays dim.
const brickLit = (p: V3, n: V3) => (p[1] < -20.5 && Math.hypot(p[0], p[1] - CY) > R - 0.5 ? 0.25 : p[2] < 28.6 ? 0.75 : 0.4) * up(n)

console.log({brick:brick.triangles,marble:marble.triangles,grey:grey.triangles,pink:pink.triangles,lead:lead.triangles,bronze:bronze.triangles})
await save('rome-pantheon', 'Pantheon', [
  // Colours from photos 2, 4 and 6, pulled to the palette's lightness:
  // brownish-orange Roman brick; weathered white marble; grey and pink
  // granite; pale lead on the dome and the portico's grey-brown tiles.
  { part: brick, material: { ...finish('pantheon-brick', 0xa39385), floodlight: brickLit } },
  { part: marble, material: { ...finish('pantheon-marble', 0xd9d1c2), floodlight: lit(1) } },
  { part: grey, material: { ...finish('grey-granite', 0x989b9b), floodlight: lit(0.9) } },
  { part: pink, material: { ...finish('pink-granite', 0xae8d84), floodlight: lit(0.8) } },
  { part: lead, material: { ...finish('pantheon-lead', 0xb7b5af), floodlight: lit(0.25) } },
  { part: bronze, material: finish('pantheon-bronze', 0x5d554c) },
], { bearing: 356.5, osm: 'relation/3374342' }, 6500)
