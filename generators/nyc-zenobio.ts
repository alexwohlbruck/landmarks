/**
 * Zenobio, Luna Park's two-armed booster ride, Scream Zone, Coney Island:
 * procedural, CC0-1.0.
 * bun generators/nyc-zenobio.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0. The origin is the OSM
 * node node/8816101425 (attraction=amusement_ride, name=Zenobio), taken as
 * the foot of the tower, on the ground. Luna Park is level here, so
 * elevation 0.
 *
 * The ride: a single tall column carrying, at its head, a long arm that
 * turns end over end in a vertical plane, a gondola of seats at each end
 * that spins about its own axle. Luna Park's ride page
 * (lunaparknyc.com/rides/zenobio/) calls it "the towering, two-armed
 * Zenobio" and gives "130 feet in the air" (40 m) at the top of the swing;
 * Wikipedia ("Luna Park (Coney Island, 2010)") lists it as "a booster-type
 * ride".
 *
 * Evidence and what rests on it:
 *   the reach, 40 m at the top of the swing: published (above); the pivot at
 *     21 m and the arm at 2 x 18.5 m: estimated from that and from the
 *     proportions in "Sep 2019 02", where the arm's half-length is a little
 *     under the column's height;
 *   the slender lavender column with a box head, the long red truss arm
 *     with a round hub at the pivot, the yellow gondola cages at the ends:
 *     "Coney Island Brooklyn Sep 2019 02" (close crop, from the north-west)
 *     and "Sep 2019 17" (from the beach, due south, the arm broadside);
 *   the plane of the swing, east-west: both photos show the arm broadside
 *     from the south and from the north-west; estimated;
 *   the pose, the arm tilted 20 degrees (east end up): as in Sep 2019 02,
 *     chosen because it reads as a moving arm; the ride also parks level.
 *
 * Photos (Wikimedia Commons, EVIDENCE):
 *   "Coney Island Brooklyn Sep 2019 02", "Sep 2019 17", Epicgenius,
 *     CC BY-SA 4.0
 * Look-only: none.
 *
 * Style: the truss arm is a solid tapered beam (a lattice would shimmer);
 * each gondola is a plain drum. The arm and its gondolas are their own node,
 * pivoted on the axle, so the ride can be animated later; it ships static.
 * Night: the arm carries running lights in the photos, but no open night
 * photo shows how it is lit, so nothing glows.
 *
 * Doubts: the pivot height and arm length (from the published reach and
 * photo proportions); the swing plane; the loading deck at the foot, which
 * no open photo shows (left out).
 */
import { Part, cross, sub, writeGlb, type NodeSpec, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const unit = (a: V3): V3 => mul(a, 1 / (Math.hypot(...a) || 1))

/** A square ring centred on (cx, cy) at height z, half-width h, chamfered by c, CCW from above. */
function ring(cx: number, cy: number, z: number, h: number, c = 0): V3[] {
  if (c <= 0) return [[cx - h, cy - h, z], [cx + h, cy - h, z], [cx + h, cy + h, z], [cx - h, cy + h, z]]
  const k = h - c
  return [[cx - k, cy - h, z], [cx + k, cy - h, z], [cx + h, cy - k, z], [cx + h, cy + k, z], [cx + k, cy + h, z], [cx - k, cy + h, z], [cx - h, cy + k, z], [cx - h, cy - k, z]]
}
function prism(p: Part, rings: V3[][]) {
  p.loft(rings)
  p.cap(rings[rings.length - 1], true)
  p.cap(rings[0], false)
}
/**
 * A closed solid from a list of cross-sections along an axis: each section
 * is a ring of points in the same order; the ends are capped. The winding is
 * set by the face normals pointing away from the section's centre.
 */
function tube(p: Part, secs: V3[][]) {
  const n = secs[0].length
  const centre = (s: V3[]) => mul(s.reduce((a, b) => add(a, b), [0, 0, 0] as V3), 1 / s.length)
  for (let k = 0; k < secs.length - 1; k++) {
    const c = centre([...secs[k], ...secs[k + 1]])
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n, a = secs[k][i], b = secs[k][j], d = secs[k + 1][i], e = secs[k + 1][j]
      const f = cross(sub(b, a), sub(d, a)), out = sub(a, c)
      if (f[0] * out[0] + f[1] * out[1] + f[2] * out[2] >= 0) { p.tri(a, b, d); p.tri(b, e, d) }
      else { p.tri(a, d, b); p.tri(b, d, e) }
    }
  }
  for (const [s, other] of [[secs[0], secs[1]], [secs[secs.length - 1], secs[secs.length - 2]]]) {
    const c = centre(s), away = sub(c, centre(other))
    for (let i = 0; i < n; i++) {
      const a = s[i], b = s[(i + 1) % n], f = cross(sub(a, c), sub(b, c))
      if (f[0] * away[0] + f[1] * away[1] + f[2] * away[2] >= 0) p.tri(c, a, b)
      else p.tri(c, b, a)
    }
  }
}
/** A drum (short cylinder) centred on c with its axle along unit `ax`. */
function drum(p: Part, c: V3, ax: V3, r: number, w: number, seg = 14) {
  const ref: V3 = Math.abs(ax[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0]
  const u = unit(cross(ax, ref)), v = cross(ax, u)
  const circle = (o: number) => Array.from({ length: seg }, (_, i) => {
    const t = (i / seg) * 2 * Math.PI
    return add(add(c, mul(ax, o)), add(mul(u, r * Math.cos(t)), mul(v, r * Math.sin(t))))
  })
  tube(p, [circle(-w / 2), circle(w / 2)])
}

// ------------------------------------------------------------- the tower ---
const PIVOT = 21
const base = new Part(), column = new Part()
prism(base, [ring(0, 0, 0, 2.2, 0.3), ring(0, 0, 0.8, 2.2, 0.3)])
prism(column, [ring(0, 0, 0.8, 1.1, 0.25), ring(0, 0, PIVOT - 1.6, 0.8, 0.2)])
// The head: the drive housing the arm turns on, its axle to the south.
prism(column, [ring(0, -0.2, PIVOT - 1.6, 1.25, 0.25), ring(0, -0.2, PIVOT + 1.4, 1.25, 0.25)])

// --------------------------------------------------------------- the arm ---
// Authored about the pivot (the node's origin), on the south face of the head.
// The arm's plane stands 2.9 m south of the column's axis, so the 3 m
// gondolas clear the 2.2 m column as the arm turns through vertical.
const ARM = 18.5, TILT = (20 * Math.PI) / 180, Y0 = -2.9
const arm = new Part(), gondola = new Part()
const along: V3 = [Math.cos(TILT), 0, Math.sin(TILT)], across: V3 = [-Math.sin(TILT), 0, Math.cos(TILT)]
const pt = (s: number, y: number, h: number): V3 => add(add(mul(along, s), mul(across, h)), [0, Y0 + y, 0])
// A box beam, 1.3 m deep at the hub tapering to 0.7 m at the ends, 0.8 m wide.
const sec = (s: number) => {
  const h = 0.65 - (0.3 * Math.abs(s)) / ARM
  return [pt(s, -0.4, -h), pt(s, 0.4, -h), pt(s, 0.4, h), pt(s, -0.4, h)]
}
tube(arm, [sec(-ARM), sec(-ARM / 2), sec(0), sec(ARM / 2), sec(ARM)])
// The round hub on the pivot.
drum(arm, [0, Y0 + 0.1, 0], [0, 1, 0], 2.1, 1.0, 16)
// The gondolas: a drum of seats across each end, spinning on an axle along y.
for (const s of [-ARM, ARM]) drum(gondola, pt(s, 0, 0), [0, 1, 0], 1.7, 3.0, 14)
// The axle from the head through the hub.
drum(column, [0, -1.9, PIVOT], [0, 1, 0], 0.45, 1.6, 8)

// ---------------------------------------------------------------- output ---
const parts = [
  { part: column, material: finish('zenobio-lavender', 0x9a88c4) },
  { part: base, material: PALETTE.roof },
]
const nodes: NodeSpec[] = [{
  name: 'arm',
  translation: [0, 0, PIVOT],
  parts: [
    { part: arm, material: finish('zenobio-red', 0xbf4546) },
    { part: gondola, material: finish('zenobio-yellow', 0xe2b13f) },
  ],
}]
const triangles = [...parts, ...nodes.flatMap((n) => n.parts)].reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Zenobio', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 0, elevation: 0, height: Math.round((PIVOT + ARM * Math.sin(TILT) + 1.7) * 10) / 10, reach: 40, osm: 'node/8816101425',
}, { nodes })
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/nyc-zenobio.glb', import.meta.url).pathname
await Bun.write(out, glb)
const top = PIVOT + ARM * Math.sin(TILT) + 1.7
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes; top of the posed arm ${top.toFixed(1)} m, full reach ${(PIVOT + ARM + 1.7).toFixed(1)} m`)
