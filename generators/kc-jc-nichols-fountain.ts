/**
 * The J.C. Nichols Memorial Fountain, Mill Creek Park, Kansas City,
 * Missouri. Four bronze horsemen by Henri Gréber (1910, made for a Long
 * Island estate), set in 1960 round a two-tier stone basin in a 23 m round
 * pool at 47th Street and J.C. Nichols Parkway.
 *
 * Frame: bearing 0, +x east, +y north, z up, metres. Origin at the pool's
 * centre, -94.587542 39.042623 (the OSM ring's centroid); z = 0 is the pool
 * floor / the park ground round it (lidar 0.2-0.5 outside the rim).
 *
 * What it covers: OSM way/113102940 (amenity=fountain, natural=water,
 * old_name "JC Nichols Memorial Fountain") is a water polygon, not a
 * building, so `replaces` is empty. The map draws the water; the model draws
 * the rim, the central basins and the sculpture, and no water surface or jet.
 *
 * Sources
 * - OSM (c) OpenStreetMap contributors: way/113102940, a ring 23 m across.
 * - USGS 3DEP lidar MO_FEMANRCS_1_2020 (flown 2020), 0.5 m grid
 *   (work/kc-jc-nichols-fountain/lidar.json): the rim at r 11.5 m, 0.4-0.5 m
 *   above the ground; the central basin 1.0-1.5 m, r ~2.5 m; sparse returns
 *   from the horsemen to the north, west and east at r 6-7 m (the water
 *   gives none).
 * - Published: kcparks.org "J.C. Nichols Memorial Fountain"; Wikipedia
 *   "J.C. Nichols Memorial Fountain": four equestrian figures by Henri-Léon
 *   Gréber, 1910, dedicated 1960, said to stand for four rivers.
 * Photos (evidence, Wikimedia Commons, public domain):
 * - "Jesse Clyde Nichols Memorial, KC MO - general view 1.JPG", "... 2.JPG",
 *   "... 3.JPG" (uploader's own work), from the south and south-west:
 *   https://commons.wikimedia.org/wiki/File:Jesse_Clyde_Nichols_Memorial,_KC_MO_-_general_view_1.JPG
 *   https://commons.wikimedia.org/wiki/File:Jesse_Clyde_Nichols_Memorial,_KC_MO_-_general_view_2.JPG
 *   https://commons.wikimedia.org/wiki/File:Jesse_Clyde_Nichols_Memorial,_KC_MO_-_general_view_3.JPG
 * - "JC Nichols Fountain by Henri-Léon Gréber Kansas City.jpg", Charvex,
 *   public domain (from the north-east, the Giralda behind):
 *   https://commons.wikimedia.org/wiki/File:JC_Nichols_Fountain_by_Henri-L%C3%A9on_Gr%C3%A9ber_Kansas_City.jpg
 *
 * Numbers
 * - Pool rim r 11.0-11.6, top 0.6 (OSM ring, lidar 0.4-0.5 plus the water
 *   line), measured.
 * - Central basin: lower drum r 2.6 to 0.95, upper bowl r 1.45 at 1.3-1.75,
 *   bronze group to 2.7 (lidar 1.0-1.5 on the drum; the rest photo-scaled
 *   against the drum, estimated).
 * - Horsemen at r 6.5 on the four cardinal points (lidar returns N, W, E),
 *   3.8 m to the rider's head (photo-scaled, estimated); each faces out from
 *   the centre. The four small groups (children on dolphins) on the
 *   diagonals at r 9.5, ~1.2 m, are estimated from the photos.
 * Colours: the coping a warm tan limestone; the bronze a dark green-brown,
 * kept dark (it is the identity) but not black.
 *
 * Simplified / doubts
 * - Each horseman is a bold, stylised mass: a rock-and-sea-creature base, a
 *   horse rearing out of the water, a rider leaning back; the real groups
 *   differ from one another (horses, a dolphin, a whale's tail) and the
 *   riders' poses are not copied one by one.
 * - The real rearing direction of each group is only roughly known from the
 *   photos (they turn slightly round the circle); drawn facing straight out.
 * - No water, jets or spray. Night: the fountain is lit from the water;
 *   the stone takes a little floodlight, the bronze is unlit.
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { lathe } from './dc-nga-west'
import { saveModel } from './sd-california-tower'

const STONE = finish('nichols-limestone', 0xdcc8a0)
const BRONZE = finish('nichols-bronze', 0x5b5e52)

/** A tapered hexagonal limb from a (radius ra) to b (radius rb), with caps. */
function limb(p: Part, a: V3, b: V3, ra: number, rb = ra, n = 6) {
  const d: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]]
  const L = Math.hypot(...d)
  const w: V3 = [d[0] / L, d[1] / L, d[2] / L]
  const ref: V3 = Math.abs(w[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0]
  let u: V3 = [w[1] * ref[2] - w[2] * ref[1], w[2] * ref[0] - w[0] * ref[2], w[0] * ref[1] - w[1] * ref[0]]
  const ul = Math.hypot(...u)
  u = [u[0] / ul, u[1] / ul, u[2] / ul]
  const v: V3 = [w[1] * u[2] - w[2] * u[1], w[2] * u[0] - w[0] * u[2], w[0] * u[1] - w[1] * u[0]]
  const ring = (c: V3, r: number) => Array.from({ length: n }, (_, k) => {
    const t = (2 * Math.PI * k) / n
    return [c[0] + r * (Math.cos(t) * u[0] + Math.sin(t) * v[0]), c[1] + r * (Math.cos(t) * u[1] + Math.sin(t) * v[1]), c[2] + r * (Math.cos(t) * u[2] + Math.sin(t) * v[2])] as V3
  })
  const A = ring(a, ra), B = ring(b, rb)
  for (let k = 0; k < n; k++) {
    const j = (k + 1) % n
    p.quad(A[k], A[j], B[j], B[k])
  }
  for (let k = 1; k < n - 1; k++) { p.tri(B[0], B[k], B[k + 1]); p.tri(A[0], A[k + 1], A[k]) }
}

/** A blob: an ellipsoid of half-sizes (rx, ry, rz) at c, turned `yaw` about z. */
function blob(p: Part, c: V3, rx: number, ry: number, rz: number, yaw = 0, seg = 8, rings = 4) {
  const cy = Math.cos(yaw), sy = Math.sin(yaw)
  const P = (th: number, ph: number): V3 => {
    const x = rx * Math.cos(ph) * Math.cos(th), y = ry * Math.cos(ph) * Math.sin(th), z = rz * Math.sin(ph)
    return [c[0] + x * cy - y * sy, c[1] + x * sy + y * cy, Math.max(0, c[2] + z)]
  }
  for (let i = 0; i < rings; i++) {
    const p0 = -Math.PI / 2 + (Math.PI * i) / rings, p1 = -Math.PI / 2 + (Math.PI * (i + 1)) / rings
    for (let k = 0; k < seg; k++) {
      const t0 = (2 * Math.PI * k) / seg, t1 = (2 * Math.PI * (k + 1)) / seg
      if (i > 0) p.tri(P(t0, p0), P(t1, p0), P(t1, p1))
      if (i < rings - 1) p.tri(P(t0, p0), P(t1, p1), P(t0, p1))
    }
  }
}

/**
 * One horseman group at angle `a` (radians from +x), facing out: a rocky
 * base with a sea creature's coil, the horse rearing out of the water with
 * its forelegs up, and the rider leaning back.
 */
function horseman(p: Part, a: number, r: number, flip: number) {
  const ca = Math.cos(a), sa = Math.sin(a)
  // local (f forward/out, s sideways, z) to world
  const W = (f: number, s: number, z: number): V3 => [(r + f) * ca - s * sa * flip, (r + f) * sa + s * ca * flip, z]
  // the rock and the sea creature's coil at the base
  blob(p, W(-0.2, 0, 0.2), 1.3, 1.0, 0.55, a, 8, 3)
  limb(p, W(-0.9, 0.6, 0.3), W(-1.5, 0.9, 1.1), 0.32, 0.12)
  // horse: hindquarters low at the back, chest high at the front (rearing ~40 deg)
  const hip = W(-0.55, 0, 1.05), chest = W(0.55, 0, 2.0)
  limb(p, hip, chest, 0.5, 0.55, 8)
  blob(p, hip, 0.55, 0.5, 0.5, a, 8, 3)
  // hind legs down into the rock
  for (const s of [-0.28, 0.28]) limb(p, W(-0.6, s, 0.9), W(-0.35, s, 0.25), 0.15, 0.11)
  // forelegs up and pawing forward
  for (const [s, k] of [[-0.25, 0.25], [0.25, -0.1]]) {
    limb(p, W(0.6, s, 1.75), W(1.0, s, 1.55 + k), 0.13, 0.11)
    limb(p, W(1.0, s, 1.55 + k), W(1.25, s, 1.15 + k), 0.11, 0.09)
  }
  // neck and head thrown up
  limb(p, W(0.6, 0, 2.15), W(0.85, 0, 2.95), 0.3, 0.2)
  limb(p, W(0.85, 0, 2.95), W(1.3, 0, 2.85), 0.2, 0.13)
  // tail streaming behind
  limb(p, W(-1.0, 0, 1.15), W(-1.5, 0.1, 0.7), 0.16, 0.06)
  // the rider on the back, leaning back, one arm raised
  const seat = W(-0.05, 0, 1.75)
  limb(p, seat, W(-0.25, 0, 2.75), 0.27, 0.22)
  blob(p, W(-0.3, 0, 3.0), 0.19, 0.19, 0.22, a, 6, 3)
  limb(p, W(-0.2, 0.25, 2.55), W(0.2, 0.55, 3.45), 0.09, 0.07)
  limb(p, W(-0.2, -0.25, 2.55), W(0.25, -0.3, 2.2), 0.09, 0.07)
  for (const s of [-0.32, 0.32]) limb(p, W(-0.05, s, 1.85), W(0.15, s * 1.1, 1.3), 0.11, 0.09)
}

/** A small group by the rim: a child astride a dolphin arching out of the water. */
function smallGroup(p: Part, a: number, r: number) {
  const ca = Math.cos(a), sa = Math.sin(a)
  const W = (f: number, s: number, z: number): V3 => [(r + f) * ca - s * sa, (r + f) * sa + s * ca, z]
  blob(p, W(0, 0, 0.15), 0.6, 0.45, 0.3, a, 6, 3)
  limb(p, W(-0.6, 0, 0.25), W(0.1, 0, 0.7), 0.24, 0.3)
  limb(p, W(0.1, 0, 0.7), W(0.6, 0, 0.45), 0.3, 0.12)
  limb(p, W(-0.6, 0, 0.25), W(-0.85, 0, 0.6), 0.1, 0.16)
  limb(p, W(-0.05, 0, 0.85), W(-0.05, 0, 1.25), 0.15, 0.12)
  blob(p, W(-0.05, 0, 1.35), 0.12, 0.12, 0.13, a, 6, 3)
}

function build() {
  const stone = new Part(), bronze = new Part()
  // ---- the pool's rim: a coping ring, rounded top, at the OSM ring
  const R0 = 11.0, R1 = 11.6
  lathe(stone, 0, 0, [[R1, 0], [R1, 0.42], [R1 - 0.08, 0.56], [R1 - 0.3, 0.6], [R0 + 0.08, 0.56], [R0, 0.45], [R0, 0]], 48, false)
  // ---- the central basins
  lathe(stone, 0, 0, [[2.6, 0], [2.6, 0.75], [2.75, 0.85], [2.72, 0.97], [2.35, 0.97], [2.3, 0.85], [0.75, 0.85]], 24, false)
  lathe(stone, 0, 0, [[0.75, 0.85], [0.55, 1.05], [0.6, 1.3], [1.45, 1.55], [1.5, 1.72], [1.25, 1.72], [1.2, 1.62], [0.5, 1.62]], 20, false)
  // the bronze group on top: sea creatures round a rock, to 2.7
  blob(bronze, [0, 0, 1.75], 0.75, 0.75, 0.35, 0, 8, 3)
  for (let k = 0; k < 3; k++) {
    const t = (2 * Math.PI * k) / 3 + 0.3
    limb(bronze, [0.55 * Math.cos(t), 0.55 * Math.sin(t), 1.75], [0.25 * Math.cos(t + 0.6), 0.25 * Math.sin(t + 0.6), 2.55], 0.22, 0.12)
  }
  limb(bronze, [0, 0, 1.8], [0, 0, 2.7], 0.2, 0.08)
  // ---- the four horsemen, on the cardinal points, facing out
  ;[0, 1, 2, 3].forEach((k) => horseman(bronze, (k * Math.PI) / 2, 6.5, k % 2 ? 1 : -1))
  // ---- the four small groups on the diagonals
  ;[0, 1, 2, 3].forEach((k) => smallGroup(bronze, Math.PI / 4 + (k * Math.PI) / 2, 9.5))

  const lit = (q: V3, n: V3) => (n[2] > 0.7 ? 0.2 : Math.hypot(q[0], q[1]) < 3 ? 0.7 : 0.4)
  return [
    { part: stone, material: { ...STONE, floodlight: lit } },
    { part: bronze, material: BRONZE },
  ]
}

if (import.meta.main) await saveModel('kc-jc-nichols-fountain', 'J.C. Nichols Memorial Fountain', build())
