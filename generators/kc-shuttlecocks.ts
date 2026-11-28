/**
 * Shuttlecocks (Claes Oldenburg and Coosje van Bruggen, 1994), the four
 * giant shuttlecocks on the lawns of the Nelson-Atkins Museum of Art,
 * Kansas City, Missouri — original procedural geometry, CC0-1.0.
 * bun generators/kc-shuttlecocks.ts            (upright, models/kc-shuttlecocks.glb)
 * bun generators/kc-shuttlecocks-tipped.ts     (on its side, models/kc-shuttlecocks-tipped.glb)
 *
 * The museum is the "net" and the lawns the court: three stand on the
 * south side, one on the north. Three stand upright on their noses; the
 * one farthest down the south lawn lies on its side, nose and feather tips
 * on the grass. A placement can only turn a model about the vertical, so
 * the two poses are two models from this one shuttlecock: this file holds
 * the shared geometry (`shuttlecock`, exported) and builds the upright one;
 * `kc-shuttlecocks-tipped.ts` tips the same mesh onto its side.
 *
 * Map frame: x east, y north, z up, metres. Upright: origin on the axis,
 * z = 0 at the bottom of the nose. Tipped: origin under the middle of the
 * shuttlecock, nose toward +y (the placement's bearing points the nose).
 *
 * Identity, from the photos:
 *  1. the round-bottomed orange nose cone (the "cork"), the only colour;
 *  2. the crown of broad white vanes, flaring to about the height of the
 *     whole piece, each vane narrow at its foot and cut off squarish at the
 *     top, overlapping its neighbour like shingles;
 *  3. the white shafts (quills) running up the leading edge of each vane
 *     from inside the nose, tied by a white band just above the nose.
 *
 * Evidence:
 *  - OSM tourism=artwork nodes, name "Shuttlecocks", artist Claes Oldenburg
 *    and Coosje van Bruggen, material aluminium: node/9866172007 (south
 *    terrace, west of the steps), node/9866172008 (north lawn, by the Bloch
 *    Building's reflecting pool), node/9866172009 (south lawn),
 *    node/9866172010 (far south lawn). No building is mapped under them.
 *  - Published: 17 ft 11 in (5.46 m) tall, crown 15 ft 11 in (4.85 m)
 *    across, 1994, aluminium and fibreglass-reinforced plastic, painted
 *    (Nelson-Atkins collection record; Wikipedia, "Shuttlecocks").
 *  - Measured from FeldBum's side photo (scaled by the published crown):
 *    nose 1.2 m across and 1.25 m tall; vanes start about 2.4 m up; the
 *    binding band at about 1.8–2.1 m. Height/width ratio of the photo
 *    (0.86) agrees with the published figures (0.89).
 *  - Estimated: 12 feathers (five to six vanes show across each side in
 *    FeldBum's and danxoneil's photos); shaft section 0.16 m; vane
 *    outline; the tipped pose resting on nose and rim, solved here.
 *  - Poses: upright for 007 (Hngrange's panorama from the south steps),
 *    008 (Commons panorama of the north facade) and 009 (behind the tipped
 *    one in Debbie_Long's photo); tipped for 010 (Debbie_Long; danxoneil),
 *    its nose to the south-south-west (NAIP 2022 shows the orange nose at
 *    the south end of the white blob; Debbie_Long's view north shows it to
 *    the camera's left).
 *
 * Night: no evidence of floodlighting in open photos; left unlit.
 *
 * Photos (evidence):
 *  - Shuttlecock at the Kansas City museum.jpg, FeldBum, CC BY-SA 4.0,
 *    https://commons.wikimedia.org/wiki/File:Shuttlecock_at_the_Kansas_City_museum.jpg
 *  - Shuttlecocks @ Nelson-Atkins Museum of Art, danxoneil, CC BY 2.0,
 *    https://www.flickr.com/photos/36521980095@N01/16153527880 (upright) and
 *    https://www.flickr.com/photos/36521980095@N01/15720977363 (upright)
 *  - Nelson-Atkins, Debbie_Long, CC BY 2.0,
 *    https://www.flickr.com/photos/98602044@N05/11957247344 (tipped + upright)
 *  - Nelson Atkins Panorama.jpg, Hngrange, CC BY-SA 3.0,
 *    https://commons.wikimedia.org/wiki/File:Nelson_Atkins_Panorama.jpg
 *  - Nelson-Atkins Museum of Art - panorama of facade.jpg, public domain,
 *    https://commons.wikimedia.org/wiki/File:Nelson-Atkins_Museum_of_Art_-_panorama_of_facade.jpg
 *  - USGS NAIP orthophoto (public domain) for positions and the tipped
 *    one's heading. No commercial imagery.
 */
import { Part, writeGlb, cross, sub, type MaterialSpec, type V3 } from './mesh'
export type { V3 }
import { finish } from './palette'

const TAU = Math.PI * 2
export const HEIGHT = 5.46        // published
const NOSE_R = 0.6, NOSE_H = 1.25 // photo-scaled
const FEATHERS = 12
const SHAFT0: [number, number] = [0.4, 1.05]   // (radius, z) where a quill leaves the nose
const SHAFT1: [number, number] = [1.95, HEIGHT - 0.02]

const norm = (a: V3): V3 => { const l = Math.hypot(...a) || 1; return [a[0] / l, a[1] / l, a[2] / l] }
const add = (a: V3, b: V3, s = 1): V3 => [a[0] + b[0] * s, a[1] + b[1] * s, a[2] + b[2] * s]

/** A solid of revolution about z, smooth-shaded; prof is (r, z) bottom to top. */
function lathe(part: Part, prof: [number, number][], n: number, top: boolean) {
  const ring = (r: number, z: number) => Array.from({ length: n }, (_, i): V3 => [r * Math.cos((i / n) * TAU), r * Math.sin((i / n) * TAU), z])
  const rings = prof.map(([r, z]) => ring(r, z))
  const nrm = (k: number, i: number): V3 => {
    const a = prof[Math.max(0, k - 1)], b = prof[Math.min(prof.length - 1, k + 1)]
    const dr = b[0] - a[0], dz = b[1] - a[1], l = Math.hypot(dr, dz) || 1
    const t = (i / n) * TAU
    return [(dz / l) * Math.cos(t), (dz / l) * Math.sin(t), -dr / l]
  }
  for (let k = 0; k < rings.length - 1; k++)
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n
      part.tri(rings[k][i], rings[k][j], rings[k + 1][j], undefined, undefined, undefined, [nrm(k, i), nrm(k, j), nrm(k + 1, j)])
      part.tri(rings[k][i], rings[k + 1][j], rings[k + 1][i], undefined, undefined, undefined, [nrm(k, i), nrm(k + 1, j), nrm(k + 1, i)])
    }
  if (top) part.cap(rings[rings.length - 1], true)
}

/** A convex solid's face: a planar convex polygon, wound to face away from `centre`. */
function face(part: Part, poly: V3[], centre: V3) {
  for (let i = 1; i < poly.length - 1; i++) {
    const a = poly[0], b = poly[i], c = poly[i + 1]
    const n = cross(sub(b, a), sub(c, a)), o = sub(a, centre)
    if (n[0] * o[0] + n[1] * o[1] + n[2] * o[2] >= 0) part.tri(a, b, c)
    else part.tri(a, c, b)
  }
}

/** A closed prism: a planar convex polygon `poly` pushed along `dir` by `t`. */
function prism(part: Part, poly: V3[], dir: V3, t: number) {
  const top = poly.map((p) => add(p, dir, t))
  const centre = add(poly.reduce((s, p) => add(s, p, 1 / poly.length), [0, 0, 0] as V3), dir, t / 2)
  face(part, poly, centre)
  face(part, top, centre)
  for (let i = 0; i < poly.length; i++) {
    const j = (i + 1) % poly.length
    face(part, [poly[i], poly[j], top[j], top[i]], centre)
  }
}

/** The upright shuttlecock in its own frame: axis +z, nose bottom at z = 0. */
export function shuttlecock(): { white: Part; orange: Part } {
  const white = new Part(), orange = new Part()
  // The nose: a round-bottomed cup, smooth, flat on top under the quills.
  const prof: [number, number][] = []
  for (let k = 0; k <= 6; k++) {
    const a = (k / 6) * (Math.PI / 2)
    prof.push([Math.max(0.02, NOSE_R * Math.sin(a)), NOSE_R * (1 - Math.cos(a))])
  }
  prof.push([NOSE_R * 1.03, NOSE_H - 0.08], [NOSE_R * 0.98, NOSE_H])
  lathe(orange, prof, 16, true)

  const [r0, z0] = SHAFT0, [r1, z1] = SHAFT1
  for (let i = 0; i < FEATHERS; i++) {
    const a = (i / FEATHERS) * TAU
    const R: V3 = [Math.cos(a), Math.sin(a), 0], T: V3 = [-Math.sin(a), Math.cos(a), 0]
    const P0: V3 = [r0 * R[0], r0 * R[1], z0], P1: V3 = [r1 * R[0], r1 * R[1], z1]
    const D = norm(sub(P1, P0)), L = Math.hypot(...sub(P1, P0))
    // The quill: a square rod, 0.16 m, its section across the shaft.
    const out = norm(cross(D, T)), w = 0.08
    const sec: V3[] = [add(add(P0, T, -w), out, -w), add(add(P0, T, w), out, -w), add(add(P0, T, w), out, w), add(add(P0, T, -w), out, w)]
    prism(white, sec, D, L)
    // The vane: a flat panel along the quill, swung a little outward so
    // each one laps outside its neighbour's quill.
    const beta = 0.18
    const Tv = norm(add([T[0] * Math.cos(beta), T[1] * Math.cos(beta), 0], R, Math.sin(beta)))
    const S = (u: number): V3 => add(P0, sub(P1, P0), u)
    const outline: [number, number][] = [[0.38, 0], [0.5, 0.4], [0.7, 0.92], [0.9, 1.18], [0.985, 1.12], [1, 0.6], [1, 0]]
    const poly = outline.map(([u, v]) => add(S(u), Tv, v))
    const nv = norm(cross(D, Tv))
    // Give it its thickness outward, so the quill shows on the inside.
    const nOut: V3 = nv[0] * R[0] + nv[1] * R[1] < 0 ? [-nv[0], -nv[1], -nv[2]] : nv
    prism(white, poly.map((p) => add(p, nOut, -0.03)), nOut, 0.1)
  }
  // The binding band just above the nose, round the quills.
  const zb0 = 1.8, zb1 = 2.1
  const rAt = (z: number) => r0 + ((z - z0) / (z1 - z0)) * (r1 - r0) + 0.1
  for (let i = 0; i < FEATHERS; i++) {
    const a0 = (i / FEATHERS) * TAU, a1 = ((i + 1) / FEATHERS) * TAU
    const P = (a: number, r: number, z: number): V3 => [r * Math.cos(a), r * Math.sin(a), z]
    const ra = rAt(zb0), rb = rAt(zb1), t = 0.07
    const quad = [P(a0, ra, zb0), P(a1, ra, zb0), P(a1, rb, zb1), P(a0, rb, zb1)]
    const n = norm([Math.cos((a0 + a1) / 2), Math.sin((a0 + a1) / 2), 0])
    prism(white, quad, n, t)
  }
  return { white, orange }
}

/** Map-frame (x, y, z) of each vertex, rewritten in place by `f` (a rigid motion). */
export function transform(part: Part, f: (p: V3) => V3, rot: (v: V3) => V3) {
  for (let i = 0; i < part.pos.length; i += 3) {
    const p = f([part.pos[i], -part.pos[i + 2], part.pos[i + 1]])
    const n = rot([part.nrm[i], -part.nrm[i + 2], part.nrm[i + 1]])
    part.pos[i] = p[0]; part.pos[i + 1] = p[2]; part.pos[i + 2] = -p[1]
    part.nrm[i] = n[0]; part.nrm[i + 1] = n[2]; part.nrm[i + 2] = -n[1]
  }
}
export const minZ = (part: Part) => { let m = Infinity; for (let i = 1; i < part.pos.length; i += 3) m = Math.min(m, part.pos[i]); return m }
export const maxZ = (part: Part) => { let m = -Infinity; for (let i = 1; i < part.pos.length; i += 3) m = Math.max(m, part.pos[i]); return m }

export const WHITE: MaterialSpec = finish('shuttlecock-white', 0xf2f0ea, 0.8)
export const ORANGE: MaterialSpec = finish('shuttlecock-orange', 0xdc7038, 0.6)

export async function build(id: string, name: string, white: Part, orange: Part, extras: Record<string, unknown>) {
  const parts = [{ part: white, material: WHITE }, { part: orange, material: ORANGE }]
  const triangles = parts.reduce((t, { part }) => t + part.triangles, 0)
  const glb = writeGlb(name, parts, { license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres, origin at ground', ...extras })
  if (triangles > 5000 || glb.length > 250_000) throw new Error(`over budget: ${triangles} triangles, ${glb.length} bytes`)
  await Bun.write(new URL(`../models/${id}.glb`, import.meta.url), glb)
  console.log(`${id}.glb: ${triangles} triangles, ${glb.length} bytes, height ${maxZ(white).toFixed(2)} m`)
}

if (import.meta.main) {
  const { white, orange } = shuttlecock()
  await build('kc-shuttlecocks', 'Shuttlecocks', white, orange, { height: HEIGHT })
}
