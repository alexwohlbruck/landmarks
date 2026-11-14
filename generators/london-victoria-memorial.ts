/**
 * The Victoria Memorial, in front of Buckingham Palace, London (Sir Thomas
 * Brock, sculptor; Sir Aston Webb, architectural setting; unveiled 1911,
 * completed 1924): original procedural geometry, CC0-1.0.
 * bun generators/london-victoria-memorial.ts
 * Writes models/london-victoria-memorial.glb (low) and
 * models/london-victoria-memorial.detail.glb (detail, detailZoom 16).
 *
 * Map frame, turned to BEARING 55: +y (model north) is compass 55 deg, the
 * axis of the Mall, so the front (Queen Victoria) faces +y down the Mall and
 * the back (Motherhood) faces -y, the palace; +x is compass 145 (Spur Road
 * side), -x compass 325 (Constitution Hill side). z up, metres; z = 0 is the
 * road round the memorial. Origin = the area centroid of OSM way/374945234.
 *
 * What makes it the Victoria Memorial, and how each is drawn
 * - The white marble pylon, stepped base and lower stage with a ship's prow
 *   at each corner; the four faces of the upper stage: Queen Victoria seated
 *   on her throne before a shell-headed niche (front), Motherhood seated with
 *   a child (back), and the standing winged figures of Justice and Truth with
 *   a child at their feet (the sides). Figures are real figure forms - head,
 *   torso, arms, legs, robes and wings - bold and simplified.
 * - On top, gilded: Victory standing on a globe, wings spread up and out,
 *   right arm raised, the palm in her left hand, drapery streaming; below
 *   her the seated figures of Constancy (left of her, with the compass) and
 *   Courage (right, helmeted, with the club). Above the pylon's cornice the
 *   sloped cap with a spread-winged marble eagle on each face. The gilt is
 *   one bright material, drawn bold so it reads at 80 px.
 * - The circular platform raised ~1.8 m with its curved retaining wall over
 *   the two crescent fountain basins (left and right) and steps front and
 *   back; the basins' outer rims (the water is the map's); the bronze groups
 *   on the wall's two semicircular bays (Art and Science, Naval and Military
 *   Power) and on the four piers at the corners of the steps (Peace,
 *   Progress, Agriculture, Manufacture: each a figure with a lion); the dark
 *   bronze fountain groups on the two sides of the lower stage.
 * - Second pass (lead review): the central monument rebuilt as a broad
 *   pyramidal mass - lower stage 10.6 m across (cornice 11.6), a wide upper
 *   pedestal (7 m square to 11.4 m) the figure groups are massed against,
 *   projecting plinths under the four main figures, the shaft above it
 *   tapering 4.8 -> 4.1 m to the cornice; Victoria and Motherhood drawn 1.3-
 *   1.35x larger (Victoria's head ~14.4 m, before the niche), Justice and
 *   Truth 5.75 m, and four attendant figures closing the corners. Budget came
 *   from the platform (16-sided in the low model), the outer rim returns and
 *   simpler low-model bronzes (one arm, couchant lions without legs).
 * - Night: marble and gilt carry _FLOODLIGHT (the memorial is floodlit).
 *
 * Evidence
 * - OSM (ODbL): way/374945234 (building=yes, historic=monument, height 26,
 *   wikidata Q1333411) is the central base with its four prows; way/554703202
 *   ("Art and Science"), way/554703203, way/554703204, way/554703205 ("Naval
 *   and Military Power") are the two side bronze groups and their pedestals;
 *   nodes 5353083725..28 (Progress, Peace, Agriculture, Manufacture).
 * - Environment Agency LIDAR Composite DSM/DTM 1 m, Open Government Licence
 *   v3.0 (0.5 m resample; composite of flights ~2000-2022): road 0.6-0.8 m
 *   over the box's ground_min, basin water 0.3, platform top 2.5 (1.8 m
 *   above the road), the platform's edge over the basins a circle of radius
 *   ~17.5 m, the steps front and back from y = +-16 to +-25 over x = +-10,
 *   the basins' outer rims at radius ~25.5, the side groups' bays at x =
 *   +-17..19, the corner piers at (+-10, +-22); the pylon reads 17.7 m above
 *   the road (the thin gilt group is lost in the 1 m composite).
 * - Published: 25 m (82 ft) high; marble pylon by Brock, gilded bronze
 *   Victory with Courage and Constancy (Wikipedia "Victoria Memorial,
 *   London"; Historic England list entry 1239086). The model is 25.9 m to
 *   Victory's raised hand (her head 24.6), drawn a little over to keep her bold.
 * - Photos (Wikimedia Commons), opened and compared:
 *   "Victoria Memorial London 2020 Morning 01.jpg", Julian Herzog, CC BY 4.0,
 *     https://commons.wikimedia.org/wiki/File:Victoria_Memorial_London_2020_Morning_01.jpg
 *     (side, level and distant: the stage heights, used to scale);
 *   "Victoria Memorial London 2020 Morning 02.jpg", Julian Herzog, CC BY 4.0,
 *     https://commons.wikimedia.org/wiki/File:Victoria_Memorial_London_2020_Morning_02.jpg
 *     (front from the Mall: Victoria, prows, steps, corner groups);
 *   "Victoria Memorial London 2020 Morning Nike Statue 01.jpg" and "...02.jpg",
 *     Julian Herzog, CC BY 4.0,
 *     https://commons.wikimedia.org/wiki/File:Victoria_Memorial_London_2020_Morning_Nike_Statue_01.jpg
 *     https://commons.wikimedia.org/wiki/File:Victoria_Memorial_London_2020_Morning_Nike_Statue_02.jpg
 *     (Victory's pose, the eagles and cap, Courage and Constancy);
 *   "Winged Victory, Victoria Memorial, London.jpg", FiatLUX, CC BY-SA 3.0,
 *     https://commons.wikimedia.org/wiki/File:Winged_Victory,_Victoria_Memorial,_London.jpg
 *     (Victory close: globe, palm, drapery, the seated pair);
 *   "London - Spur Road - Victoria Memorial 1911-14 by Sir Thomas Brock
 *     01/02/03.jpg", Txllxt TxllxT, CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:London_-_Spur_Road_-_Victoria_Memorial_1911-14_by_Sir_Thomas_Brock_01.jpg
 *     https://commons.wikimedia.org/wiki/File:London_-_Spur_Road_-_Victoria_Memorial_1911-14_by_Sir_Thomas_Brock_02.jpg
 *     https://commons.wikimedia.org/wiki/File:London_-_Spur_Road_-_Victoria_Memorial_1911-14_by_Sir_Thomas_Brock_03.jpg
 *     (Motherhood, the side winged figures, the prows, the platform wall and
 *     a side bronze group);
 *   "Queen Victoria Memorial, London, July 2014 01.jpg", Edwardx, CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Queen_Victoria_Memorial,_London,_July_2014_01.jpg
 *     (the basin and the relief-carved platform wall).
 * - Look-only: none.
 *
 * Estimated from the photos (scaled to the published 25 m and the lidar
 * platform): every stage height (base 2.7-4.0, lower stage to 7.0, cornice
 * 7.6, figure plinth 8.2, pedestal to 11.4, shaft to 16.2, cornice 17.0, cap
 * 18.0, gilt group 18.0-25.9), the pedestal (7 m) and shaft (4.8-4.1 m), the prows' size, every figure's size
 * and pose, the steps' count (six in the detail model, four in the low). Invented in detail: the drapery and the
 * children's poses, the bronze groups' exact poses (each is drawn as its
 * subject: two seated figures on the side bays; a figure and a lion on each
 * corner pier). The relief panels on the platform wall and the inscriptions
 * are left out.
 *
 * Doubts
 * - Which side figure is Justice and which Truth is not distinguished.
 * - The corner bronze groups' poses are generic; only their massing (a
 *   figure beside a lion on a pedestal) follows the photos.
 */
import { Part, writeGlb, type V3, type MaterialSpec } from './mesh'
import { smooth, solid, tube, ellipsoid, slab, lathe, TAU } from './nyc-columbus-monument'
import { writeModel } from './london-buckingham-palace'

export const BEARING = 55

// ---------------------------------------------------------------------------
// Quality: the low model and the detail model share every builder.
// ---------------------------------------------------------------------------
type Q = { tube: number; ell: number; rows: number; ring: number; detail: boolean }
const LOW: Q = { tube: 5, ell: 6, rows: 3, ring: 6, detail: false }
const HIGH: Q = { tube: 10, ell: 14, rows: 7, ring: 16, detail: true }

/** An ellipse ring (counter-clockwise from above) at height z. */
const ell = (cx: number, cy: number, z: number, rx: number, ry: number, n: number): V3[] =>
  Array.from({ length: n }, (_, i): V3 => [cx + rx * Math.cos(i * TAU / n), cy + ry * Math.sin(i * TAU / n), z])

/** Place what `build` makes in a local frame (x = the figure's right, y = forward, z up) into `dst`, smooth-shaded. */
function place(dst: Part, at: V3, yaw: number, k: number, build: (q: Part) => void, crease = 80) {
  smooth(dst, (q) => {
    build(q)
    const c = Math.cos(yaw), s = Math.sin(yaw)
    for (let i = 0; i < q.pos.length; i += 3) {
      // Part stores glTF (x, z, -y): map x = X, y = -Z, z = Y.
      const x = q.pos[i] * k, y = -q.pos[i + 2] * k, z = q.pos[i + 1] * k
      const X = at[0] + x * c - y * s, Y = at[1] + x * s + y * c, Z = at[2] + z
      q.pos[i] = X; q.pos[i + 1] = Z; q.pos[i + 2] = -Y
    }
  }, crease)
}

/** A yaw that turns the local +y (forward) to face the direction (dx, dy). */
const facing = (dx: number, dy: number) => Math.atan2(dy, dx) - Math.PI / 2

// ---------------------------------------------------------------------------
// Figure kit (local frame, unit = metres for a figure of height h).
// ---------------------------------------------------------------------------

/** A wing: a broad rounded covert blade and long primaries fanned out to the tip. */
function wing(q: Part, Q: Q, root: V3, side: 1 | -1, span: number, lift: number, back: number) {
  // The wing's plane: out to the side and up (by `lift` rad), swept back (by `back` rad).
  const U: V3 = [side * Math.cos(lift) * Math.cos(back), -Math.sin(back) * Math.cos(lift), Math.sin(lift)]
  // In-plane perpendicular, towards the wing's leading (upper) edge.
  const up: V3 = [-side * Math.sin(lift), -0.25, Math.cos(lift)]
  const t = Math.max(0.05, span * 0.04)
  // Coverts: a broad blade from the root, the leading edge arching up.
  slab(q, root, U, up, [[0, -0.22 * span], [0.55 * span, -0.12 * span], [0.75 * span, 0.08 * span], [0.45 * span, 0.24 * span], [0.08 * span, 0.18 * span]], t * 1.5)
  // Primaries: long blades out to the tip, fanned below the leading edge.
  const blades = Q.detail ? 4 : 2
  for (let b = 0; b < blades; b++) {
    const f = b / Math.max(1, blades - 1)
    const tip = span * (1 - 0.25 * f), dz = -0.2 * span * f
    slab(q, root, U, up, [[0.35 * span, dz - 0.1 * span], [tip, dz + 0.02 * span], [tip * 0.98, dz + 0.13 * span], [0.4 * span, dz + 0.12 * span]], t)
  }
}

/** A standing robed figure facing +y, feet at the origin, h tall. arms: shoulder→hand paths in units of h. */
function standing(q: Part, Q: Q, h: number, o: { arms: V3[][]; wings?: { span: number; lift: number; back: number }; helmet?: boolean; stride?: number; drape?: boolean }) {
  const H = (x: number, y: number, z: number): V3 => [x * h, y * h, z * h]
  const G = 1.3 // girth: drawn bolder than life so the figure reads at map distance
  const r = (z: number, rx: number, ry: number, dy = 0) => ell(0, dy * h, z * h, rx * h * G, ry * h * G, Q.ring)
  // Robe from the hem to the waist, the front foot showing.
  solid(q, [r(0.0, 0.17, 0.13, 0.01), r(0.25, 0.14, 0.1), r(0.5, 0.12, 0.085), r(0.56, 0.11, 0.075)])
  if (o.stride) ellipsoid(q, H(0.05, 0.12, 0.02), [0.04 * h, 0.08 * h, 0.03 * h], 6, 3)
  // Torso and bust to the shoulders, then the neck.
  solid(q, [r(0.56, 0.11, 0.075), r(0.66, 0.115, 0.08, 0.005), r(0.75, 0.14, 0.08), r(0.8, 0.13, 0.07), r(0.84, 0.05, 0.05)])
  // Head (and a helmet's crest).
  ellipsoid(q, H(0, 0.01, 0.9), [0.065 * h, 0.07 * h, 0.078 * h], Q.ell, Q.rows)
  if (o.helmet) ellipsoid(q, H(0, -0.005, 0.94), [0.075 * h, 0.08 * h, 0.05 * h], Q.ell, Q.rows)
  // Arms (shoulders pushed out to the broader torso).
  for (const a of o.arms) tube(q, a.map(([x, y, z], i) => H(i === 0 ? x * G : x * 1.1, y, z)), a.map((_, i) => (0.055 - i * 0.007) * h), Q.tube)
  // Wings from the shoulder blades.
  if (o.wings) for (const s of [1, -1] as const) wing(q, Q, H(s * 0.07, -0.09, 0.78), s, o.wings.span * h, o.wings.lift, o.wings.back)
  // A loose drape hanging from the shoulders down the back.
  if (o.drape) solid(q, [r(0.15, 0.15, 0.05, -0.1), r(0.5, 0.15, 0.05, -0.09), r(0.78, 0.13, 0.045, -0.075)])
}

/**
 * A seated robed figure facing +y: the seat at the origin's height, h the
 * height from the seat's foot level to the top of the head (so the seat is
 * at ~0.33 h). `throne` adds a high-backed chair.
 */
function seated(q: Part, Q: Q, h: number, o: { arms: V3[][]; throne?: boolean; crown?: boolean; helmet?: boolean; lean?: number; child?: boolean }) {
  const H = (x: number, y: number, z: number): V3 => [x * h, y * h, z * h]
  const lean = o.lean ?? 0, G = 1.25
  const r = (z: number, rx: number, ry: number, dy = 0) => ell(0, dy * h, z * h, rx * h * G, ry * h * G, Q.ring)
  if (o.throne) {
    // Seat block and high back with a rounded top.
    solid(q, [ell(0, -0.02 * h, 0, 0.24 * h, 0.2 * h, 4).map(([x, y, z]) => [x * 1.2, y * 1.2, z] as V3), ell(0, -0.02 * h, 0.33 * h, 0.24 * h, 0.2 * h, 4).map(([x, y, z]) => [x * 1.2, y * 1.2, z] as V3)])
    solid(q, [ell(0, -0.2 * h, 0.3 * h, 0.27 * h, 0.07 * h, 8), ell(0, -0.21 * h, 0.8 * h, 0.25 * h, 0.06 * h, 8), ell(0, -0.21 * h, 0.9 * h, 0.13 * h, 0.05 * h, 8)])
    // Arm rests either side of her lap.
    for (const s of [-1, 1]) solid(q, [ell(s * 0.27 * h, 0.02 * h, 0.3 * h, 0.05 * h, 0.17 * h, 6), ell(s * 0.27 * h, 0.04 * h, 0.5 * h, 0.05 * h, 0.16 * h, 6)])
  }
  // The lap and knees: thighs forward from the hips, the robe falling to the feet.
  for (const s of [-1, 1]) {
    tube(q, [H(s * 0.09, -0.04, 0.36), H(s * 0.1, 0.2, 0.37), H(s * 0.105, 0.28, 0.35)], [0.09 * h, 0.085 * h, 0.08 * h], Q.tube)
    tube(q, [H(s * 0.105, 0.28, 0.33), H(s * 0.11, 0.32, 0.12), H(s * 0.11, 0.34, 0.02)], [0.075 * h, 0.065 * h, 0.06 * h], Q.tube)
  }
  // The robe's fall between and in front of the shins.
  solid(q, [ell(0, 0.22 * h, 0, 0.3 * h, 0.2 * h, Q.ring), ell(0, 0.22 * h, 0.2 * h, 0.25 * h, 0.13 * h, Q.ring), ell(0, 0.15 * h, 0.4 * h, 0.23 * h, 0.18 * h, Q.ring)])
  // Torso from the hips to the shoulders, leaning by `lean`.
  solid(q, [r(0.34, 0.15, 0.11), r(0.5, 0.12, 0.085, lean * 0.15), r(0.66, 0.135, 0.085, lean * 0.3), r(0.72, 0.13, 0.075, lean * 0.35), r(0.77, 0.05, 0.05, lean * 0.4)])
  // Head, and a crown or helmet.
  ellipsoid(q, H(0, 0.01 + lean * 0.45, 0.85), [0.07 * h, 0.075 * h, 0.085 * h], Q.ell, Q.rows)
  if (o.crown) solid(q, [r(0.9, 0.05, 0.05, lean * 0.45 + 0.005), r(0.95, 0.06, 0.06, lean * 0.45 + 0.005)])
  if (o.helmet) ellipsoid(q, H(0, lean * 0.45, 0.89), [0.07 * h, 0.075 * h, 0.05 * h], Q.ell, Q.rows)
  for (const a of o.arms) tube(q, a.map(([x, y, z], i) => H(i === 0 ? x * G : x * 1.1, y, z)), a.map((_, i) => (0.055 - i * 0.007) * h), Q.tube)
  // A child standing at her knee.
  if (o.child) {
    solid(q, [ell(0.28 * h, 0.22 * h, 0, 0.05 * h, 0.04 * h, 8), ell(0.28 * h, 0.22 * h, 0.3 * h, 0.06 * h, 0.045 * h, 8), ell(0.28 * h, 0.22 * h, 0.38 * h, 0.03 * h, 0.03 * h, 8)])
    ellipsoid(q, H(0.28, 0.22, 0.43), [0.045 * h, 0.045 * h, 0.05 * h], 8, 4)
  }
}

/** A lion standing (or couchant, `lying`) facing +y, s = shoulder height. */
function lion(q: Part, Q: Q, s: number, lying = false) {
  const L = (x: number, y: number, z: number): V3 => [x * s, y * s, z * s]
  const zb = lying ? 0.35 : 0.65
  tube(q, [L(0, -0.75, zb), L(0, -0.2, zb + 0.08), L(0, 0.45, zb + 0.15)], [0.28 * s, 0.32 * s, 0.36 * s], Q.detail ? Q.tube + 2 : Q.tube)
  // Mane and head.
  ellipsoid(q, L(0, 0.55, zb + 0.35), [0.33 * s, 0.3 * s, 0.38 * s], Q.ell, Q.rows)
  ellipsoid(q, L(0, 0.8, zb + 0.35), [0.17 * s, 0.22 * s, 0.17 * s], Q.ell, Q.rows)
  // Legs.
  for (const sx of [-1, 1]) for (const [y0, y1] of [[0.45, 0.6], [-0.62, -0.55]]) {
    if (lying) { if (Q.detail) tube(q, [L(sx * 0.2, y0, 0.2), L(sx * 0.22, y1 + 0.35, 0.08)], [0.1 * s, 0.08 * s], Q.tube) }
    else tube(q, [L(sx * 0.18, y0, zb), L(sx * 0.2, y1, 0.3), L(sx * 0.2, y1 + 0.04, 0.0)], [0.12 * s, 0.09 * s, 0.08 * s], Q.tube)
  }
  // Tail.
  if (Q.detail) tube(q, [L(0, -0.75, zb + 0.05), L(0.1, -1.0, zb - 0.25), L(0.15, -1.05, 0.1)], [0.05 * s, 0.04 * s, 0.05 * s], 5)
}

/** A ship's prow facing +y, base at the origin: the hull's bow rising and curling into a scroll. */
function prow(q: Part, Q: Q, k: number) {
  const P = (x: number, y: number, z: number): V3 => [x * k, y * k, z * k]
  // Hull sections from the stern (against the drum) to the stem: [y, half-beam top, half-beam keel, keel z, top z].
  const secs: [number, number, number, number, number][] = [[-1.2, 1.1, 0.6, 0.0, 2.4], [0.0, 1.0, 0.5, 0.1, 2.5], [0.9, 0.75, 0.3, 0.35, 2.7], [1.6, 0.4, 0.12, 0.8, 2.95], [2.0, 0.1, 0.05, 1.3, 3.1]]
  const rings = secs.map(([y, b, kb, zk, zt]) => [P(-kb, y, zk), P(kb, y, zk), P(b, y, zt - 0.4), P(b, y, zt), P(-b, y, zt), P(-b, y, zt - 0.4)])
  q.loft(rings.map((r) => [...r].reverse()))
  q.cap(rings[0], true)
  q.cap([...rings[rings.length - 1]].reverse(), true)
  // The stem's scroll curling up and back.
  tube(q, [P(0, 1.95, 2.9), P(0, 2.2, 3.5), P(0, 1.95, 3.95), P(0, 1.65, 3.75)], [0.18 * k, 0.16 * k, 0.14 * k, 0.12 * k], Q.tube)
  // A figurehead/sea-creature on the bow's flank.
  if (Q.detail) for (const s of [-1, 1]) ellipsoid(q, P(s * 0.75, 0.6, 1.9), [0.18 * k, 0.4 * k, 0.5 * k], 8, 4)
}

/** An eagle with spread wings, facing +y, perched at the origin. */
function eagle(q: Part, Q: Q, k: number) {
  const P = (x: number, y: number, z: number): V3 => [x * k, y * k, z * k]
  ellipsoid(q, P(0, 0, 0.45), [0.28 * k, 0.25 * k, 0.45 * k], Q.ell, Q.rows)
  ellipsoid(q, P(0, 0.12, 0.98), [0.15 * k, 0.17 * k, 0.16 * k], Q.detail ? 8 : 5, Q.detail ? 4 : 3)
  for (const s of [-1, 1]) slab(q, P(s * 0.2, -0.05, 0.6), [s, -0.15, 0.25], [0, -0.2, 1], [[0, -0.3 * k], [1.1 * k, -0.15 * k], [1.25 * k, 0.15 * k], [0.9 * k, 0.45 * k], [0.1 * k, 0.4 * k]], 0.08 * k)
}

// ---------------------------------------------------------------------------
// The memorial
// ---------------------------------------------------------------------------

/** A rounded-square ring: half-size a, corner radius rc, `n` points per corner. */
function rsq(a: number, rc: number, z: number, n = 3): V3[] {
  const out: V3[] = []
  for (const [cx, cy, a0] of [[a - rc, -(a - rc), -Math.PI / 2], [a - rc, a - rc, 0], [-(a - rc), a - rc, Math.PI / 2], [-(a - rc), -(a - rc), Math.PI]] as [number, number, number][])
    for (let i = 0; i <= n; i++) {
      const t = a0 + (Math.PI / 2) * i / n
      out.push([cx + rc * Math.cos(t), cy + rc * Math.sin(t), z])
    }
  return out
}
/** A prism on a ring (counter-clockwise), with a top cap. */
const prismR = (p: Part, ring: (z: number) => V3[], z0: number, z1: number, top = true) => {
  p.loft([ring(z0), ring(z1)])
  if (top) p.cap(ring(z1), true)
}
/** An axis-aligned box (walls and top). */
function box(p: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number) {
  const r = (z: number): V3[] => [[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]]
  p.loft([r(z0), r(z1)]); p.cap(r(z1), true)
}

function build(Q: Q) {
  const marble = new Part(), stone = new Part(), gilt = new Part(), bronze = new Part()
  const PL = 1.8 // platform top above the road

  // ===== Platform, steps, basin rims =====================================
  {
    // The platform: a circle of radius 17.5 with its curved retaining wall,
    // squared off front and back where the steps come down.
    const R = 17.5, n = Q.detail ? 48 : 16
    const ring = (z: number, r = R): V3[] => {
      const pts: V3[] = []
      for (let i = 0; i < n; i++) {
        const a = i * TAU / n
        let x = r * Math.cos(a), y = r * Math.sin(a)
        // Clip front and back to the steps' line.
        if (Math.abs(y) > 15.8) { y = Math.sign(y) * 15.8 }
        pts.push([x, y, z])
      }
      return pts
    }
    stone.loft([ring(0), ring(PL - 0.35)])
    // Coping: a rounded lip proud of the wall.
    stone.loft([ring(PL - 0.35, R + 0.25), ring(PL + 0.45, R + 0.25)])
    stone.loft([ring(PL - 0.45, R), ring(PL - 0.35, R + 0.25)])
    stone.cap(ring(PL + 0.45, R + 0.25), true)
    // A plinth course where the wall meets the basin.
    if (Q.detail) stone.loft([ring(0, R + 0.3), ring(0.4, R + 0.3)])
    // Steps front and back: six treads down to the road.
    for (const sy of [-1, 1]) {
      const nSteps = Q.detail ? 6 : 4, tread = 9 / nSteps
      for (let k = 0; k < nSteps; k++) {
        const y0 = 15.8 + k * tread, z = PL - k * (PL / nSteps)
        const a: [number, number] = sy > 0 ? [y0 - 0.5, y0 + tread] : [-(y0 + tread), -(y0 - 0.5)]
        box(stone, -10, a[0], 10, a[1], 0, z)
      }
      // Corner piers with the bronze groups (Peace, Progress, Agriculture, Manufacture).
      for (const sx of [-1, 1]) {
        if (Q.detail) box(stone, sx * 10.3 - 1.3, sy * 22.5 - 1.6, sx * 10.3 + 1.3, sy * 22.5 + 1.6, 0, 2.4)
        if (Q.detail) box(stone, sx * 10.3 - 1.5, sy * 22.5 - 1.8, sx * 10.3 + 1.5, sy * 22.5 + 1.8, 2.4, 2.75)
        else box(stone, sx * 10.3 - 1.4, sy * 22.5 - 1.7, sx * 10.3 + 1.4, sy * 22.5 + 1.7, 0, 2.75)
        // Low walls from the piers back along the steps' sides to the platform.
        box(stone, sx * 10.0 - 0.35, sy > 0 ? 15.5 : -21.0, sx * 10.0 + 0.35, sy > 0 ? 21.0 : -15.5, 0, 1.2)
      }
    }
    // The two semicircular bays on the wall carrying the side bronze groups.
    for (const sx of [-1, 1]) {
      lathe(stone, [[3.2, 0], [3.2, PL + 0.2], [3.4, PL + 0.2], [3.4, PL + 0.5]], Q.ring, sx * 17.6, 0, true)
      box(stone, sx * 17.6 - 1.5, -2.3, sx * 17.6 + 1.5, 2.3, PL + 0.45, PL + 1.3)
    }
    // Basin rims: a low kerb on an arc of radius 25.5 round each side, turning in to the corner piers.
    for (const sx of [-1, 1]) {
      const segs = Q.detail ? 24 : 6, a0 = -0.98, a1 = 0.98
      const P = (a: number, r: number, z: number): V3 => [sx * r * Math.cos(a), r * Math.sin(a), z]
      for (let i = 0; i < segs; i++) {
        const u = a0 + (a1 - a0) * i / segs, v = a0 + (a1 - a0) * (i + 1) / segs
        const ri = 25.0, ro = 25.8, zt = 0.45
        const quad = (a: V3, b: V3, c: V3, d: V3) => stone.quad(a, b, c, d)
        if (sx > 0) {
          quad(P(u, ro, 0), P(v, ro, 0), P(v, ro, zt), P(u, ro, zt))
          quad(P(v, ri, 0), P(u, ri, 0), P(u, ri, zt), P(v, ri, zt))
          quad(P(u, ri, zt), P(u, ro, zt), P(v, ro, zt), P(v, ri, zt))
        } else {
          quad(P(v, ro, 0), P(u, ro, 0), P(u, ro, zt), P(v, ro, zt))
          quad(P(u, ri, 0), P(v, ri, 0), P(v, ri, zt), P(u, ri, zt))
          quad(P(v, ri, zt), P(v, ro, zt), P(u, ro, zt), P(u, ri, zt))
        }
      }
      // The rim's returns from the arc's ends to the corner piers.
      for (const sy of [-1, 1]) {
        const ex = sx * 25.4 * Math.cos(0.98), ey = sy * 25.4 * Math.sin(0.98)
        const x0 = Math.min(ex, sx * 11.6), x1 = Math.max(ex, sx * 11.6)
        if (Q.detail) box(stone, x0, ey - 0.4, x1, ey + 0.4, 0, 0.45)
      }
    }
  }

  // ===== The central monument ===========================================
  // Steps up to the base: three, on a rounded square.
  prismR(marble, (z) => rsq(8.4, 3.6, z, Q.detail ? 3 : 2), PL - 0.01, PL + 0.3)
  if (Q.detail) prismR(marble, (z) => rsq(8.0, 3.4, z, 3), PL + 0.3, PL + 0.6)
  prismR(marble, (z) => rsq(7.6, 3.2, z, Q.detail ? 3 : 2), PL + 0.6, PL + 0.9)
  // Base: lobed (the OSM outline): a rounded square with deep concave corners.
  prismR(marble, (z) => rsq(6.6, 2.8, z, Q.detail ? 4 : 2), 2.7, 4.0)
  prismR(marble, (z) => rsq(6.85, 2.9, z, Q.detail ? 4 : 2), 3.75, 4.05)
  // Lower stage: the broad drum with flat faces and the prows at the corners.
  prismR(marble, (z) => rsq(5.3, 2.2, z, Q.detail ? 4 : 2), 4.0, 7.0)
  prismR(marble, (z) => rsq(5.8, 2.4, z, Q.detail ? 4 : 2), 7.0, 7.6)
  prismR(marble, (z) => rsq(5.2, 1.8, z, Q.detail ? 3 : 2), 7.6, 8.2)
  // Inscription panels front and back (slightly proud plates).
  if (Q.detail) for (const s of [-1, 1]) box(marble, -2.4, s > 0 ? 5.3 : -5.42, 2.4, s > 0 ? 5.42 : -5.3, 4.9, 6.4)
  // Prows at the four diagonals.
  for (const [sx, sy] of [[1, 1], [-1, 1], [1, -1], [-1, -1]]) {
    place(marble, [sx * 4.3, sy * 4.3, 4.0], facing(sx, sy), 1.0, (q) => prow(q, Q, 1.15), 50)
  }
  // The upper pedestal the figure groups are massed against, and its cornice.
  const PA = 3.5
  prismR(marble, (z) => rsq(PA, 0.5, z, 1), 8.2, 11.0)
  prismR(marble, (z) => rsq(PA + 0.3, 0.5, z, 1), 11.0, 11.4)
  // Projecting plinths under the four main figures.
  box(marble, -2.7, PA - 0.2, 2.7, 6.7, 7.6, 8.4)
  box(marble, -2.6, -6.4, 2.6, -PA + 0.2, 7.6, 8.4)
  for (const sx of [-1, 1]) box(marble, sx > 0 ? PA - 0.2 : -6.0, -2.2, sx > 0 ? 6.0 : -PA + 0.2, 2.2, 7.6, 8.4)
  // The shaft above, tapering to its cornice; the shell-headed niche behind Victoria.
  const SA = 2.2
  marble.loft([rsq(2.4, 0.2, 11.4, 1), rsq(2.05, 0.2, 16.2, 1)])
  if (Q.detail) prismR(marble, (z) => rsq(2.25, 0.2, z, 1), 15.0, 15.6, false)
  // The niche: a round-headed recess outline (frame proud of the shaft) and its shell.
  for (const sy of [1, -1]) {
    const yf = sy * (SA + 0.12)
    const nf = Q.detail ? 12 : 6
    for (let i = 0; i < nf; i++) {
      const a0 = Math.PI * i / nf, a1 = Math.PI * (i + 1) / nf
      const P = (r: number, a: number, d: number): V3 => [r * Math.cos(a) * sy, yf + sy * d - sy * 0.12, 13.4 + r * Math.sin(a)]
      marble.tri(P(0, 0, 0.02), P(1.3, a0, i % 2 ? 0.02 : 0.1), P(1.3, a1, i % 2 ? 0.1 : 0.02))
      marble.quad(P(1.3, a1, 0.18), P(1.3, a0, 0.18), P(1.6, a0, 0.18), P(1.6, a1, 0.18))
    }
  }
  // Cartouches on the side faces, above the standing figures.
  if (Q.detail) for (const sx of [-1, 1]) {
    place(marble, [sx * (SA + 0.05), 0, 14.2], facing(sx, 0), 1, (q) => {
      ellipsoid(q, [0, 0, 0], [0.6, 0.18, 0.75], Q.ell, Q.rows)
      ellipsoid(q, [0, 0.15, 0.9], [0.4, 0.12, 0.26], 8, 3)
    })
  }
  // Cornice and the sloped cap.
  prismR(marble, (z) => rsq(SA + 0.4, 0.25, z, 1), 16.2, 16.6)
  prismR(marble, (z) => rsq(SA + 0.7, 0.25, z, 1), 16.6, 17.0)
  marble.loft([rsq(SA + 0.4, 0.2, 17.0, 1), rsq(1.3, 0.2, 18.0, 1)])
  marble.cap(rsq(1.3, 0.2, 18.0, 1), true)
  // The die with its rose roundels and the gilt group's bed.
  box(marble, -1.0, -1.0, 1.0, 1.0, 17.6, 18.7)
  // Eagles on the cap, one on each face.
  for (const [dx, dy] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) place(marble, [dx * 1.95, dy * 1.95, 16.95], facing(dx, dy), 1, (q) => eagle(q, Q, 0.85), 55)

  // ===== Upper-stage figures (marble), massed against the pedestal =========
  // Queen Victoria, seated on her throne, facing the Mall: orb in her left hand, sceptre in her right.
  place(marble, [0, PA + 0.55, 8.4], 0, 1.35, (q) => {
    seated(q, Q, 4.9, {
      throne: true, crown: true, arms: [
        [[0.15, 0.0, 0.7], [0.21, 0.12, 0.52], [0.16, 0.3, 0.45]],
        [[-0.15, 0.0, 0.7], [-0.22, 0.1, 0.52], [-0.17, 0.3, 0.46]],
      ],
    })
    tube(q, [[0.72, 1.3, 1.7], [0.75, 1.5, 3.3]], [0.07, 0.06], 5)
    ellipsoid(q, [-0.74, 1.35, 2.15], [0.22, 0.22, 0.22], 8, 4)
    // Her robes spreading out over the plinth's front.
    solid(q, [ell(0, 0.95, 0, 1.15, 0.75, Q.ring), ell(0, 0.85, 0.5, 0.95, 0.6, Q.ring), ell(0, 0.6, 1.4, 0.7, 0.45, Q.ring)])
  })
  // Motherhood, seated, facing the palace, a child at her knee and a baby in her lap.
  place(marble, [0, -(PA + 0.5), 8.4], Math.PI, 1.3, (q) => {
    seated(q, Q, 4.7, {
      lean: 0.05, child: true, arms: [
        [[0.15, 0.0, 0.68], [0.18, 0.18, 0.52], [0.0, 0.26, 0.5]],
        [[-0.15, 0.0, 0.68], [-0.18, 0.18, 0.52], [0.0, 0.25, 0.53]],
      ],
    })
    ellipsoid(q, [0, 1.0, 2.35], [0.35, 0.25, 0.3], 8, 4) // the baby
    solid(q, [ell(0, 0.9, 0, 1.1, 0.7, Q.ring), ell(0, 0.8, 0.5, 0.9, 0.55, Q.ring), ell(0, 0.55, 1.35, 0.65, 0.42, Q.ring)])
  })
  // Justice and Truth: standing winged figures on the side faces, a child at their feet.
  for (const sx of [-1, 1]) {
    place(marble, [sx * (PA + 0.9), 0, 8.4], facing(sx, 0), 1.25, (q) => {
      standing(q, Q, 4.6, {
        stride: 1, drape: true,
        wings: { span: 0.75, lift: 1.0, back: 0.55 },
        arms: [
          [[0.14, 0, 0.79], [0.22, 0.08, 0.62], [0.2, 0.16, 0.5]],
          [[-0.14, 0, 0.79], [-0.2, 0.1, 0.92], [-0.18, 0.18, 1.04]],
        ],
      })
      // The child at her feet.
      tube(q, [[0.6, 0.45, 0.0], [0.6, 0.45, 0.9]], [0.26, 0.22], 6)
      ellipsoid(q, [0.6, 0.47, 1.18], [0.24, 0.24, 0.27], Q.ell, Q.rows)
    })
  }
  // Attendant figures at the four corners of the upper stage, closing the pyramid.
  for (const [sx, sy] of [[1, 1], [-1, 1], [1, -1], [-1, -1]]) {
    place(marble, [sx * 3.85, sy * 3.85, 8.2], facing(sx, sy), 1.15, (q) => standing(q, Q, 3.2, { arms: Q.detail ? [[[0.14, 0, 0.79], [0.2, 0.1, 0.6], [0.15, 0.2, 0.5]], [[-0.14, 0, 0.79], [-0.2, 0.06, 0.6], [-0.18, 0.1, 0.45]]] : [[[0.14, 0, 0.79], [0.2, 0.1, 0.6], [0.15, 0.2, 0.5]]] }))
  }

  // ===== The gilded group =================================================
  {
    const zt = 18.0
    // Acanthus bed and globe.
    lathe(gilt, [[1.15, 18.7], [0.95, 18.95], [0.55, 19.1]], Q.ring, 0, 0, true)
    ellipsoid(gilt, [0, 0.1, 19.75], [0.72, 0.72, 0.72], Q.ell + 2, Q.rows + 1)
    // Constancy (her left, -x: the figure's left as she faces +y) and Courage (+x), seated on the cap's corners.
    place(gilt, [-1.55, 0.55, zt - 0.05], facing(-0.5, 1), 1, (q) => {
      seated(q, Q, 2.7, { lean: 0.15, arms: [[[0.15, 0.0, 0.7], [0.25, 0.25, 0.55], [0.1, 0.4, 0.55]], [[-0.15, 0.0, 0.7], [-0.25, 0.15, 0.5], [-0.2, 0.32, 0.42]]] })
      // The compass wheel she holds.
      slab(q, [0.0, 0.92, 1.25], [1, 0, 0], [0, 0.25, 1], Array.from({ length: 8 }, (_, i): [number, number] => [0.38 * Math.cos(i * TAU / 8), 0.38 * Math.sin(i * TAU / 8)]), 0.1)
    })
    place(gilt, [1.55, 0.55, zt - 0.05], facing(0.5, 1), 1, (q) => {
      seated(q, Q, 2.7, { lean: 0.12, helmet: true, arms: [[[0.15, 0.0, 0.7], [0.32, 0.2, 0.85], [0.3, 0.3, 1.05]], [[-0.15, 0.0, 0.7], [-0.25, 0.15, 0.5], [-0.2, 0.3, 0.42]]] })
      // His club, held upright.
      tube(q, [[0.7, 0.75, 1.0], [0.74, 0.8, 2.75]], [0.07, 0.12], 6)
    })
    // Victory on the globe, facing the Mall.
    place(gilt, [0, 0.15, 20.4], 0, 1, (q) => {
      const h = 3.7
      standing(q, Q, h, {
        stride: 1,
        wings: { span: 0.95, lift: 0.7, back: 0.35 },
        arms: [
          // Her right arm (+x) raised high, the hand open.
          [[0.14, 0, 0.8], [0.27, 0.0, 0.97], [0.32, 0.05, 1.22]],
          // Her left arm bent, the hand by her shoulder holding the palm.
          [[-0.14, 0, 0.8], [-0.24, 0.08, 0.66], [-0.2, 0.12, 0.85]],
        ],
      })
      // The palm frond rising from her left hand past her head.
      tube(q, [[-0.81, 0.44, 3.1], [-0.66, 0.36, 3.7], [-0.36, 0.3, 4.15]], [0.09, 0.07, 0.04], 5)
      slab(q, [-0.6, 0.34, 3.75], [0.6, -0.1, 0.8], [0.2, 0.95, 0], [[-0.35, -0.14], [0.4, -0.1], [0.45, 0.07], [-0.35, 0.14]], 0.06)
      // Drapery streaming out to her right at the hips.
      tube(q, [[0.25, -0.05, 1.9], [0.75, -0.15, 1.75], [1.15, -0.3, 1.45], [1.35, -0.4, 1.1]], [0.3, 0.32, 0.22, 0.08], Q.tube)
      // Laurel crown.
      solid(q, [ell(0, 0.04, 3.5, 0.25, 0.27, 8), ell(0, 0.04, 3.64, 0.29, 0.31, 8)])
    }, 80)
  }

  // ===== Outer bronze groups ==============================================
  // On the two bays: Art and Science (-x), Naval and Military Power (+x):
  // two figures reclining side by side on the pedestal, propped on an arm,
  // legs stretched out along the wall, looking out over the basin.
  for (const sx of [-1, 1]) {
    place(bronze, [sx * 17.9, 0, PL + 1.3], facing(sx, 0), 1, (q) => {
      for (const s of [-1, 1]) {
        // Hips on the pedestal near the middle, legs out to the side.
        tube(q, [[s * 0.25, -0.1, 0.35], [s * 1.1, 0.05, 0.4], [s * 1.95, 0.35, 0.18]], [0.42, 0.34, 0.22], Q.tube)
        // Torso propped up, leaning back a little, head turned out.
        tube(q, [[s * 0.15, -0.2, 0.3], [s * 0.2, -0.1, 1.15], [s * 0.25, -0.05, 1.55]], [0.42, 0.38, 0.22], Q.tube)
        ellipsoid(q, [s * 0.28, 0.05, 1.85], [0.24, 0.26, 0.29], Q.ell, Q.rows)
        // The outer arm resting on the knee, the inner arm propping behind.
        if (Q.detail) tube(q, [[s * 0.55, -0.1, 1.4], [s * 0.95, 0.25, 1.0], [s * 1.15, 0.45, 0.75]], [0.15, 0.13, 0.11], Q.tube)
        if (Q.detail) tube(q, [[-s * 0.05, -0.15, 1.35], [-s * 0.15, -0.45, 0.8], [-s * 0.1, -0.55, 0.35]], [0.14, 0.12, 0.1], Q.tube)
      }
      if (Q.detail) ellipsoid(q, [0, 0.35, 0.5], [0.45, 0.35, 0.35], 10, 5) // the shield/emblem between them
    })
  }
  // On the four corner piers: a seated figure beside a couchant lion, looking out along the axis.
  for (const sy of [-1, 1]) for (const sx of [-1, 1]) {
    place(bronze, [sx * 10.3, sy * 22.5, 2.75], facing(0, sy), 1, (q) => {
      const off = -sx * sy // the lion on the side away from the steps
      seated(q, Q, 2.5, { lean: 0.08, arms: Q.detail ? [[[0.15, 0, 0.7], [0.25, 0.15, 0.55], [0.22, 0.3, 0.45]], [[-0.15, 0, 0.7], [-0.25, 0.12, 0.55], [-0.2, 0.3, 0.45]]] : [[[0.15, 0, 0.7], [0.3, 0.25, 0.5]]] })
      const lq = new Part()
      lion(lq, Q, 1.25, true)
      for (let i = 0; i < lq.pos.length; i += 3) { lq.pos[i] += off * 1.0; lq.pos[i + 2] -= 0.2 }
      q.pos.push(...lq.pos); q.nrm.push(...lq.nrm); q.uv.push(...lq.uv)
    })
  }

  return { marble, stone, gilt, bronze }
}

function write(Q: Q, file: string, maxTris: number) {
  const { marble, stone, gilt, bronze } = build(Q)
  const lit = (p: V3, n: V3) => Math.min(1, 0.35 + p[2] / 30) * (n[2] > 0.95 ? 0.4 : 1)
  writeModel('Victoria Memorial', 'london-victoria-memorial', [
    { part: marble, material: { ...finish('memorial-marble', 0xf2efe9, 0.7), floodlight: lit } },
    { part: stone, material: finish('memorial-granite', 0xdcd8d0) },
    { part: gilt, material: { ...finish('memorial-gilt', 0xe2b445, 0.4), floodlight: (p) => (p[2] > 17 ? 1 : 0) } },
    { part: bronze, material: finish('memorial-bronze', 0x5b5853, 0.6) },
  ], { bearing: BEARING, osm: 'way/374945234', height: 25.9 }, maxTris, file)
}

function finish(name: string, color: number, roughness = 0.85): MaterialSpec {
  return { name, color, roughness }
}
void writeGlb

if (import.meta.main) {
  write(LOW, 'london-victoria-memorial', 6500)
  write(HIGH, 'london-victoria-memorial.detail', 40000)
}
