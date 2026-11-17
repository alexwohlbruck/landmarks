/**
 * Amorepacific Headquarters (아모레퍼시픽 본사), Yongsan, Seoul: procedural,
 * CC0-1.0.
 * bun generators/seoul-amorepacific.ts
 *
 * Map frame turned to the building: bearing 36.6, so the model's axes run
 * along the cube's faces (OSM way/363982568's edges run 36.6/126.6). The
 * origin is the outline's centroid; y = 0 is the ground. Elevation 0.
 * Terrain not checked (no z15 tiles over Seoul; the site is flat).
 *
 * Published: 110 m high, 22 storeys, highest occupied floor 95.1 m (CTBUH
 * Skyscraper Center, building 17754); a cube of about 100 x 100 m round a
 * central courtyard, its compact form broken by large openings in the
 * facade, each holding a garden and leading to the courtyard (BD+C, 2017);
 * David Chipperfield Architects, completed 2017.
 *
 * OSM: the outline (94.9 x 93.4 m, height 110, 21 levels) and its parts:
 * the full square to 18 m, then a ring round a 33 m square courtyard to
 * 84 m, with a top band to 90 m. Used as tagged for the plan and the
 * courtyard; the 110 m published height is used for the top (OSM's 90 m
 * parts are taken as the roof terrace level inside the parapet frame).
 *
 * Form (evidence): the vertical white aluminium fin screen over light
 * glazing, continuing down to the street, with white floor-slab edges
 * every storey ("Seoul-metro-429-Sinyongsan-station-entrance-3", LERK,
 * and "Sinyongsan Station 20230408 001" at night, Mobius6). From any
 * distance the screen reads as an almost white cube. The fins are real 3D
 * blades, drawn bolder and sparser than real (1.7 m wide, 1.6 m deep,
 * every 2.5 m, so face-on they cover two thirds of the wall), over pale
 * glazing, with a white slab band every two storeys.
 *
 * The openings (published, Amorepacific press release 2017-11-13,
 * apgroup.com/int/en/news/2017-11-13.html; Korea JoongAng Daily, "AmorePacific's
 * new HQ is open for business"): three large openings in the facade hold
 * elevated gardens on the 5th, 11th and 17th floors, each about five to
 * six storeys' worth of space. Levels here: 20-40 m, 47-67 m, 74-94 m
 * (4.5 m storeys above a taller ground floor), each 33 m wide (the
 * courtyard's width) and cut through the ring to the courtyard.
 * ESTIMATED: which face each opening is on (not published; one per face
 * on three faces: 5th floor south-east, 11th south-west, 17th
 * north-east), their widths, and that they run through to the courtyard.
 * The look-only photos below were looked at only; nothing was taken from
 * them. A licensed photo of the whole cube was on Commons (Narubaru7,
 * "용산구 한강대로100 아모레퍼시픽 본사.jpg") but was deleted in 2025.
 * Estimated: the opening faces and widths, the fin spacing, the parapet.
 * Left out: the ground-floor entrances, the courtyard's glass roof at 18 m
 * (drawn as a garden-green deck, the roof gardens' colour).
 *
 * Night: the glazing is `window-2` (the office floors glow behind the
 * fins, as in the night photos).
 *
 * Photos:
 * EVIDENCE
 * - "Seoul-metro-429-Sinyongsan-station-entrance-3-20191022-153642.jpg", LERK, CC BY-SA 4.0 (base and fins)
 *   https://commons.wikimedia.org/wiki/File:Seoul-metro-429-Sinyongsan-station-entrance-3-20191022-153642.jpg
 * - "Sinyongsan Station 20230408 001.jpg", Mobius6, CC BY-SA 4.0 (base at night)
 *   https://commons.wikimedia.org/wiki/File:Sinyongsan_Station_20230408_001.jpg
 * - "Amore Pacific World HQ.jpg", kallerna, CC BY-SA 4.0 (atrium, interior only)
 *   https://commons.wikimedia.org/wiki/File:Amore_Pacific_World_HQ.jpg
 * LOOK-ONLY (CC BY-NC-ND 2.0; looked at, not used for any shape):
 * - TFurban, "한강로 신용산역, 아모레퍼시픽 사옥", Flickr 24536347438, 37692940324, 38407330721
 *   https://www.flickr.com/photos/28021450@N05/24536347438
 * Doubts: no licensed photo of the whole cube or of any opening; the
 * openings' faces are estimated and should be confirmed by a licensed
 * photo. Model kept plain.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { flat, prism } from './seoul-n-seoul-tower'

type P2 = [number, number]
const glass = new Part(), fins = new Part(), roof = new Part(), garden = new Part(), frame = new Part()

const S = 47.4, I = 16.6, H = 110, BASE = 18

function box(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, top: Part | null = p) {
  prism(p, top, [[x0, y0], [x1, y0], [x1, y1], [x0, y1]], z0, z1)
}

/** Openings: [face, z0, z1]; face 0 = south (-y), 1 = east (+x), 2 = north (+y), 3 = west (-x). */
const OPENINGS: [number, number, number][] = [[1, 20, 40], [0, 47, 67], [2, 74, 94]]

/** Wall spans of one face as [u0, u1, z0, z1] rectangles avoiding its opening (u along the face, -S..S). */
function spans(face: number): [number, number, number, number][] {
  const op = OPENINGS.find(([f]) => f === face)
  if (!op) return [[-S, S, 0, H]]
  const [, z0, z1] = op
  const out: [number, number, number, number][] = [[-S, S, 0, z0], [-S, -I, z0, Math.min(z1, H)], [I, S, z0, Math.min(z1, H)]]
  if (z1 < H) out.push([-S, S, z1, H])
  return out
}
/** Map a face's (u, depth-from-outer-face) to model xy; depth > 0 goes outward. */
function at(face: number, u: number, d: number): P2 {
  switch (face) {
    case 0: return [u, -S - d]
    case 1: return [S + d, u]
    case 2: return [-u, S + d]
    default: return [-S - d, -u]
  }
}
const normalOf = (face: number): V3 => [[0, -1, 0], [1, 0, 0], [0, 1, 0], [-1, 0, 0]][face] as V3

function build() {
  // ---- The ring: outer glass walls (with gaps at the openings), the
  //      courtyard walls, the full base below 18 m.
  for (let f = 0; f < 4; f++) {
    for (const [u0, u1, z0, z1] of spans(f)) {
      const a = at(f, u0, 0), b = at(f, u1, 0)
      flat(glass, [[a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1]], normalOf(f))
      // white slab edges every two storeys, just proud of the glass
      const pa = at(f, u0, 0.08), pb = at(f, u1, 0.08)
      for (let z = 9; z < H - 3; z += 9) {
        if (z < z0 + 0.5 || z + 0.8 > z1 - 0.5) continue
        flat(fins, [[pa[0], pa[1], z], [pb[0], pb[1], z], [pb[0], pb[1], z + 0.8], [pa[0], pa[1], z + 0.8]], normalOf(f))
      }
    }
  }
  // Floors and walls of the openings: a cut from the face to the courtyard.
  for (const [f, z0, z1] of OPENINGS) {
    const top = Math.min(z1, H)
    // garden floor
    const g0 = at(f, -I, 0), g1 = at(f, I, 0), g2 = at(f, I, -(S - I)), g3 = at(f, -I, -(S - I))
    flat(garden, [[g0[0], g0[1], z0], [g1[0], g1[1], z0], [g2[0], g2[1], z0], [g3[0], g3[1], z0]], [0, 0, 1])
    // side walls of the cut (glazed), facing into the cut
    for (const [u, s] of [[-I, 1], [I, -1]] as [number, number][]) {
      const p0 = at(f, u, 0), p1 = at(f, u, -(S - I))
      const n = normalOf((f + (s > 0 ? 1 : 3)) % 4)
      flat(glass, [[p0[0], p0[1], z0], [p1[0], p1[1], z0], [p1[0], p1[1], top], [p0[0], p0[1], top]], n)
    }
    // soffit, if the cut is closed above
    if (z1 < H) flat(frame, [[g0[0], g0[1], z1], [g3[0], g3[1], z1], [g2[0], g2[1], z1], [g1[0], g1[1], z1]], [0, 0, -1])
  }
  // Courtyard walls (facing in), from the base roof to the top.
  const inner: P2[] = [[I, -I], [I, I], [-I, I], [-I, -I]] // clockwise from above, so walls face inward
  for (let i = 0; i < 4; i++) {
    const a = inner[i], b = inner[(i + 1) % 4]
    const n: V3 = [-(a[0] + b[0]) / (2 * I), -(a[1] + b[1]) / (2 * I), 0]
    // skip the parts where an opening runs through
    const face = [1, 2, 3, 0][i]
    const op = OPENINGS.find(([f]) => f === face)
    const zs: [number, number][] = op ? [[BASE, op[1]], ...(op[2] < H ? [[op[2], H] as [number, number]] : [])] : [[BASE, H]]
    for (const [z0, z1] of zs) flat(glass, [[a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1]], n)
  }
  // The courtyard floor (the glazed atrium roof with its garden), green.
  flat(garden, [[-I, -I, BASE], [I, -I, BASE], [I, I, BASE], [-I, I, BASE]], [0, 0, 1])
  // ---- Roof: the ring's top, with a white parapet frame.
  const roofZ = H - 1.2
  for (let f = 0; f < 4; f++) {
    const notch = OPENINGS.find(([ff, , z1]) => ff === f && z1 >= H)
    const segs: [number, number][] = notch ? [[-S, -I], [I, S]] : [[-S, S]]
    for (const [u0, u1] of segs) {
      // the ring quadrant under this face: from the face in to the courtyard line
      const a = at(f, u0, 0), b = at(f, u1, 0)
      // trapezoid from the outer edge to the courtyard edge (corners to the corners)
      const ca = at(f, u0 < -I ? -S + (S - I) : u0, -(S - I)), cb = at(f, u1 > I ? S - (S - I) : u1, -(S - I))
      flat(roof, [[a[0], a[1], roofZ], [b[0], b[1], roofZ], [cb[0], cb[1], roofZ], [ca[0], ca[1], roofZ]], [0, 0, 1])
      // parapet: a white band on the face's top edge, 1.6 m deep inward
      const pa = at(f, u0, -1.6), pb = at(f, u1, -1.6)
      flat(frame, [[a[0], a[1], H], [b[0], b[1], H], [pb[0], pb[1], H], [pa[0], pa[1], H]], [0, 0, 1])
      flat(frame, [[pb[0], pb[1], roofZ], [pa[0], pa[1], roofZ], [pa[0], pa[1], H], [pb[0], pb[1], H]], normalOf((f + 2) % 4))
    }
  }
  // The base block's top round the courtyard is inside; the ring's top at
  // the notch is the garden floor already.

  // ---- Fins: vertical white blades on every outer face, broken at the
  //      openings, from the ground to the parapet.
  const W = 0.85, D = 1.6, STEP = 2.5
  for (let f = 0; f < 4; f++) {
    const n = normalOf(f)
    const op = OPENINGS.find(([ff]) => ff === f)
    for (let u = -S + 1.5; u <= S - 1.5 + 1e-6; u += STEP) {
      const runs: [number, number][] = op && Math.abs(u) < I ? [[0, op[1]], ...(op[2] < H ? [[op[2], H] as [number, number]] : [])] : [[0, H]]
      for (const [z0, z1] of runs) {
        const p0 = at(f, u - W, 0), p1 = at(f, u + W, 0), q0 = at(f, u - W, D), q1 = at(f, u + W, D)
        // outer face
        flat(fins, [[q0[0], q0[1], z0], [q1[0], q1[1], z0], [q1[0], q1[1], z1], [q0[0], q0[1], z1]], n)
        // two sides
        const t = normalOf((f + 1) % 4)
        flat(fins, [[p1[0], p1[1], z0], [p1[0], p1[1], z1], [q1[0], q1[1], z1], [q1[0], q1[1], z0]], t)
        flat(fins, [[p0[0], p0[1], z0], [q0[0], q0[1], z0], [q0[0], q0[1], z1], [p0[0], p0[1], z1]], [-t[0], -t[1], 0])
        // top cap
        flat(fins, [[p0[0], p0[1], z1], [q0[0], q0[1], z1], [q1[0], q1[1], z1], [p1[0], p1[1], z1]], [0, 0, 1])
        if (z0 > 0) flat(fins, [[p0[0], p0[1], z0], [p1[0], p1[1], z0], [q1[0], q1[1], z0], [q0[0], q0[1], z0]], [0, 0, -1])
      }
    }
    // white frame lines framing each opening, so the cut reads from afar
    if (op) {
      const [, z0, z1] = op
      const top = Math.min(z1, H)
      for (const u of [-I, I]) {
        const a = at(f, u - 0.9, 0), b = at(f, u + 0.9, 0), c = at(f, u + 0.9, D + 0.1), d = at(f, u - 0.9, D + 0.1)
        box(frame, Math.min(a[0], b[0], c[0], d[0]), Math.max(a[0], b[0], c[0], d[0]), Math.min(a[1], b[1], c[1], d[1]), Math.max(a[1], b[1], c[1], d[1]), z0, top)
      }
    }
  }

  const parts = [
    { part: glass, material: windowVariant(2, 0xc6d0d7) },
    { part: fins, material: { ...PALETTE.trim, color: 0xf3efe8 } },
    { part: frame, material: { ...PALETTE.trim, name: 'trim-2', color: 0xe6e2da } },
    { part: roof, material: PALETTE.roof },
    { part: garden, material: finish('roof-garden', 0x9cab88) },
  ]
  const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
  if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
  const glb = writeGlb('Amorepacific Headquarters', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
    bearing: 36.6, elevation: 0, height: H,
  })
  if (glb.length > 250_000) throw new Error(`Size budget exceeded: ${glb.length} bytes`)
  const out = new URL('../models/seoul-amorepacific.glb', import.meta.url).pathname
  Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}

if (import.meta.main) build()
