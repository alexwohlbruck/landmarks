/**
 * The Mustangs of Las Colinas, Williams Square, Irving (Robert Glen, 1984)
 * — procedural, CC0-1.0, no textures.
 * bun generators/dal-mustangs-of-las-colinas.ts
 *
 * Nine bronze mustangs at one and a half times life size, galloping across
 * the granite stream in Williams Square: six in the water, one checking at
 * the stream's edge on the red granite landing with its head down, and two
 * still on the plaza behind it. Built in the map frame unturned (bearing 0):
 * x east, y north, z up, metres. Anchor: OSM node/5107955472
 * (tourism=artwork, "Mustangs at Las Colinas", Q4308520). No building, so
 * `replaces` is empty. The stream, its water, the red granite coping and
 * the plaza are the map's (OSM amenity=fountain way/1213059151), so the
 * model is the horses and the splashes round their legs only.
 *
 * Ground: every hoof on the ground stands at y = 0. The stream is sunk
 * below the plaza (lidar: water about 0.8 m under the paving next to it;
 * the map's terrain shows the dip 1.0 to 1.3 m deep), and the map lifts each
 * vertex by the ground under it, so the plaza horses end up on the paving
 * and the water horses down in the stream. The raised grey granite bank
 * north-east of the pool (lidar +0.8 m over the plaza, about 8 m wide and
 * 40 m long, running up the north-east channel) is landscape, not the
 * artwork, and isn't modelled; the terrain outside the footprint keeps its
 * bump.
 *
 * Evidence
 * - Published (Wikipedia "Mustangs at Las Colinas"; Las Colinas
 *   Association): nine bronze mustangs, 1.5 x life size, by Robert Glen,
 *   installed 1984, crossing a stream in Williams Square.
 * - Lidar: USGS 3DEP TX_Pecos_Dallas_B3_2018 (2018), 0.5 m grid, work/
 *   dal-mustangs-of-las-colinas/lidar.json. Sparse returns off the dark
 *   bronze, but blobs place the horses: a water line from (3.6, 5.6) to
 *   (-3.6, -7.6) m (lidar frame, anchor -96.93878 32.87059), the landing
 *   horse at (10.7, 2.2), the plaza horses at (15.0, 5.7) and (16.0, 10.0),
 *   the last 3.6 m long east-west and 2.96 m to the top of its head. The
 *   model's origin is the OSM node, 0.19 m east and 0.55 m south of the
 *   lidar frame's.
 * - Drone photo from the Central Tower looking south (Justplainfolks,
 *   CC BY 4.0, https://commons.wikimedia.org/wiki/File:The_Mustangs_of_Las_Colinas.jpg):
 *   the plan of all nine and their headings. Its frame was tied to the map
 *   by the lawns and the walkway west of the plaza in NAIP and by the
 *   lidar blobs: taken from the north-north-west, looking down at about
 *   70 degrees. The model rendered from 350 degrees at 72 degrees puts all
 *   nine within about 1 m of where the photo has them.
 * - Photos, all public domain unless noted, Carol M. Highsmith (Library of
 *   Congress; https://commons.wikimedia.org/wiki/File:View_of_the_%22Mustangs_of_Las_Colinas%22_sculpture_in_the_upscale_Las_Colinas_neighborhood_of_Irving,_Texas_LCCN2015630702.tif
 *   and its siblings ...0703 to ...0715; and LCCN2011633325): the poses,
 *   the bronze colour, the splashes.
 *   Av9, public domain, https://commons.wikimedia.org/wiki/File:Mustangs_Las_Colinas.jpg
 *   (the group side-on from the plaza); Wesley Fryer, CC BY-SA 2.0,
 *   https://commons.wikimedia.org/wiki/File:Mustangs_at_Las_Colinas.jpg;
 *   Honza.d, CC BY-SA 3.0, https://commons.wikimedia.org/wiki/File:Monument_in_Dallas.jpg.
 * - Mapterhorn terrain under the site (tools/terrain.ts grid): the stream a
 *   1.0 to 1.3 m dip through flat paving.
 *
 * Measured: the positions (lidar, checked against the drone photo), the
 * plaza horse's height. Published: the count and the scale. Estimated from
 * the photos: every pose (heads, legs, tails), drawn on one horse body
 * 1.5 x a 1.47 m (14.2 hands) mustang: 2.2 m at the withers, about 3.6 m
 * nose to tail. Invented: the splash plumes' exact sizes.
 *
 * Doubts: the drone photo is oblique, so the water horses' spacing along
 * the line is read with the lidar blobs, and which way each lowered head
 * turns is a guess. The plaza was relandscaped after the 2018 flight; the
 * horses weren't moved (the drone photo puts them where the lidar does).
 */
import { Part, type V3 } from './mesh'
import { finishModel } from './nyc-570-lexington'
import { smooth, tube, ellipsoid, add, mul, unit, dot } from './nyc-columbus-monument'
import { cross, sub, len } from './mesh'

const S = 1.5 // 1.5 x life size

/** Copy a part's triangles into `dst`, mapping each corner (map frame) through `f`. */
function moveInto(dst: Part, src: Part, f: (p: V3) => V3) {
  const p = src.pos
  for (let i = 0; i < p.length; i += 9) {
    const c = [0, 3, 6].map(k => f([p[i + k], -p[i + k + 2], p[i + k + 1]]))
    dst.tri(c[0], c[1], c[2])
  }
}

/** An elliptical ring in the plane y = const. */
const ring = (y: number, z: number, w: number, h: number, n = 8): V3[] =>
  Array.from({ length: n }, (_, i): V3 => {
    const t = (i * 2 * Math.PI) / n
    return [w * Math.cos(t), y, z + h * Math.sin(t)]
  })

/** Two-bone leg: from root to hoof, the joint pushed toward `hint`. */
function joint(root: V3, hoof: V3, a: number, b: number, hint: V3): V3 {
  const D = sub(hoof, root), d = Math.min(len(D), a + b - 0.01), u = unit(D)
  const x = (a * a - b * b + d * d) / (2 * d), h = Math.sqrt(Math.max(0, a * a - x * x))
  const p = unit(sub(hint, mul(u, dot(hint, u))))
  return add(add(root, mul(u, x)), mul(p, h))
}

type Leg = [number, number] // hoof [y, z] in the horse frame (life size); x is fixed per leg
type Pose = {
  at: [number, number] // lidar-frame position of the barrel's centre, metres
  heading: number // compass degrees the horse runs toward
  pitch?: number // degrees, nose up
  lift?: number // body raised, life-size metres
  neck: number // degrees above horizontal
  head: number // degrees the face points below horizontal
  turn?: number // head and neck turned, degrees to the horse's right
  tail: number // degrees the tail rises above horizontal, streaming back
  legs: { lf: Leg; rf: Leg; lh: Leg; rh: Leg }
  water?: boolean
}

/** One horse in its own frame: +y forward, x to its right, z up, life size. */
function horse(q: Part, splash: Part, o: Pose) {
  const body = new Part()
  // Barrel: [y, centre z, half-width, half-height], rump to breast.
  const secs: [number, number, number, number][] = [
    [-0.97, 1.22, 0.12, 0.18],
    [-0.86, 1.2, 0.27, 0.32],
    [-0.5, 1.12, 0.32, 0.39],
    [-0.05, 1.07, 0.33, 0.41],
    [0.35, 1.1, 0.31, 0.41],
    [0.62, 1.11, 0.25, 0.36],
    [0.82, 1.07, 0.14, 0.22],
  ]
  const rings = secs.map(([y, z, w, h]) => ring(y, z, w, h).reverse())
  body.loft(rings)
  body.cap(rings[0].slice().reverse(), true)
  body.cap(rings[rings.length - 1], true)
  // Haunches and shoulders.
  for (const sx of [-1, 1]) ellipsoid(body, [sx * 0.15, -0.62, 1.08], [0.19, 0.38, 0.4], 7, 4)
  // Neck and head, turned about the withers.
  const neck = (o.neck * Math.PI) / 180, hd = (o.head * Math.PI) / 180, tn = ((o.turn ?? 0) * Math.PI) / 180
  const yawN = (v: V3): V3 => [v[0] * Math.cos(tn) + v[1] * Math.sin(tn), -v[0] * Math.sin(tn) + v[1] * Math.cos(tn), v[2]]
  const nb: V3 = [0, 0.5, 1.25]
  const nt = add(nb, yawN([0, 0.72 * Math.cos(neck), 0.72 * Math.sin(neck)]))
  tube(body, [nb, add(nb, mul(sub(nt, nb), 0.5)), nt], [0.3, 0.23, 0.16], 7)
  // The mane: a crest along the top of the neck, flying.
  const up = unit(cross(cross(unit(sub(nt, nb)), [0, 0, 1]), unit(sub(nt, nb))))
  tube(body, [add(nb, [0, -0.12, 0.2]), add(add(nb, mul(sub(nt, nb), 0.5)), mul(up, 0.2)), add(nt, add(mul(up, 0.14), [0, -0.06, 0]))], [0.11, 0.13, 0.07], 5)
  const muzzle = add(nt, yawN([0, 0.6 * Math.cos(hd), -0.6 * Math.sin(hd)]))
  tube(body, [nt, add(nt, mul(sub(muzzle, nt), 0.4)), muzzle], [0.16, 0.14, 0.1], 6)
  // Ears.
  for (const sx of [-1, 1]) tube(body, [add(nt, [sx * 0.05, 0, 0.04]), add(nt, add(mul(up, 0.16), [sx * 0.07, -0.03, 0]))], [0.04, 0.012], 4)
  // Tail, streaming back from the dock.
  const tl = (o.tail * Math.PI) / 180
  const dock: V3 = [0, -0.92, 1.36]
  const t1 = add(dock, [0, -0.3 * Math.cos(tl), 0.3 * Math.sin(tl)])
  const t2 = add(t1, [0.03, -0.38 * Math.cos(tl - 0.7), 0.38 * Math.sin(tl - 0.7)])
  const t3 = add(t2, [0.05, -0.34 * Math.cos(tl - 1.3), 0.34 * Math.sin(tl - 1.3)])
  tube(body, [dock, t1, t2, t3], [0.09, 0.15, 0.14, 0.06], 5)

  // Pitch and lift the body about the barrel's centre; legs then reach the hoofs.
  const pc = ((o.pitch ?? 0) * Math.PI) / 180, lift = o.lift ?? 0
  const P = (p: V3): V3 => {
    const y = p[1], z = p[2] - 1.1
    return [p[0], y * Math.cos(pc) - z * Math.sin(pc), 1.1 + lift + y * Math.sin(pc) + z * Math.cos(pc)]
  }
  const local = new Part()
  moveInto(local, body, P)
  const legs: [V3, Leg, number, number, V3, number][] = [
    [[-0.15, 0.48, 0.88], o.legs.lf, 0.4, 0.5, [0, 1, 0], -0.15],
    [[0.15, 0.48, 0.88], o.legs.rf, 0.4, 0.5, [0, 1, 0], 0.15],
    [[-0.17, -0.62, 0.95], o.legs.lh, 0.5, 0.58, [0, -1, 0], -0.17],
    [[0.17, -0.62, 0.95], o.legs.rh, 0.5, 0.58, [0, -1, 0], 0.17],
  ]
  for (const [root, [hy, hz], a, b, hint, x] of legs) {
    const r = P(root), hoof: V3 = [x, hy, hz]
    const j = joint(r, hoof, a, b, hint)
    tube(local, [r, j, hoof], [b > 0.55 ? 0.15 : 0.13, 0.08, 0.075], 6)
    if (o.water && hz < 0.12) {
      // A splash plume round the leg where it strikes the water.
      // A low foam dome round the leg; its lower half is cut off at the water.
      const s = new Part()
      ellipsoid(s, [x, hy + 0.05, 0], [0.34, 0.4, 0.42], 7, 4)
      place(splash, s, o)
    }
  }
  place(q, local, o)
}

/** Horse frame → map frame: scale, turn to the heading, move to the anchor. */
function place(dst: Part, src: Part, o: Pose) {
  const h = (o.heading * Math.PI) / 180, c = Math.cos(h), s = Math.sin(h)
  const X = o.at[0] - 0.19, Y = o.at[1] + 0.55 // lidar frame → the OSM node
  moveInto(dst, src, p => {
    const x = p[0] * S, y = p[1] * S, z = p[2] * S
    return [X + x * c + y * s, Y - x * s + y * c, Math.max(0, z)]
  })
}

// The nine, from the plaza across the stream (see header for the plan).
const gallopLegs = (lead: 1 | -1) => {
  // Extended gallop: one foreleg reaching, the other folding back; one
  // hind leg pushing off behind, the other swinging under the belly.
  const reach: Leg = [1.05, 0.22], fold: Leg = [0.2, 0.62], push: Leg = [-1.2, 0.0], under: Leg = [-0.25, 0.12]
  return lead > 0 ? { lf: fold, rf: reach, lh: push, rh: under } : { lf: reach, rf: fold, lh: under, rh: push }
}
const POSES: Pose[] = [
  // A: plaza, far east; head up, galloping west for the stream.
  { at: [16.0, 10.0], heading: 258, neck: 48, head: 62, tail: 8, legs: gallopLegs(1), lift: 0.05 },
  // B: plaza, leaping: forelegs tucked, body raised.
  { at: [15.0, 5.7], heading: 232, pitch: 22, lift: 0.15, neck: 40, head: 50, turn: -12, tail: 5,
    legs: { lf: [0.95, 0.75], rf: [0.85, 0.6], lh: [-0.55, 0.0], rh: [-0.75, 0.0] } },
  // C: on the red granite landing, checking at the edge, head down to the water.
  { at: [10.7, 2.2], heading: 242, pitch: -9, neck: -8, head: 80, tail: 15,
    legs: { lf: [0.95, 0.0], rf: [1.05, 0.05], lh: [-0.35, 0.0], rh: [-0.15, 0.0] } },
  // D: dropping into the water off the bank, forelegs striking.
  { at: [3.4, 5.0], heading: 222, pitch: -6, neck: 45, head: 58, turn: 10, tail: 8, water: true,
    legs: { lf: [0.95, 0.0], rf: [0.75, 0.35], lh: [-1.1, 0.25], rh: [-0.85, 0.05] } },
  // E–I: the herd in the stream.
  { at: [2.0, 2.2], heading: 228, neck: 30, head: 70, tail: 8, water: true, legs: gallopLegs(-1) },
  { at: [1.4, -1.2], heading: 226, neck: 50, head: 55, turn: -15, tail: 8, water: true, legs: gallopLegs(1) },
  { at: [-0.1, -3.1], heading: 232, neck: 8, head: 82, tail: 8, water: true, legs: gallopLegs(-1) },
  { at: [-0.4, -5.6], heading: 224, neck: 52, head: 55, turn: 12, tail: 8, water: true, legs: gallopLegs(1) },
  { at: [-2.6, -6.8], heading: 228, neck: 46, head: 60, tail: 8, water: true, legs: gallopLegs(-1) },
]

const bronze = new Part(), splash = new Part()
smooth(bronze, q => {
  const spl = new Part()
  for (const o of POSES) horse(q, spl, o)
  smooth(splash, w => moveInto(w, spl, p => p), 70)
}, 60)

finishModel('Mustangs of Las Colinas', 'dal-mustangs-of-las-colinas', [
  { part: bronze, material: { name: 'bronze', color: 0x5f5a4f, roughness: 0.5, floodlight: (_p, n) => (n[2] < 0.6 ? 0.6 : 0.25) } },
  { part: splash, material: { name: 'splash', color: 0xe9eef0, roughness: 0.6 } },
], { bearing: 0, osm: 'node/5107955472', height: 3.0 }, 6500)
