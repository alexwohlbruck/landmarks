/**
 * Kaiyukan (海遊館, Osaka Aquarium), Tempozan, Minato, Osaka: procedural, CC0-1.0.
 * bun generators/osaka-kaiyukan.ts
 *
 * Map frame: x across the front (towards the plaza, north-east), y north-
 * west, z up, metres; origin on the ground at the centroid of OSM
 * way/143328734 (the main building, a square 62.4 m a side turned 41.4
 * degrees). Bearing 318.6, so the model's +x face is the north-east front
 * on the plaza, +y the north-west face where the entrance building's
 * links join.
 *
 * Peter Chermayeff's aquarium (1990): an eight-storey windowless block in
 * three bands, "earth, water and fire" (ja.wikipedia): a dark blue tiled
 * base painted with Ivan Chermayeff's fish mural, a red band, and glass
 * housings on top. The upper part is four corner blocks, each overhanging
 * the base, their tops sloping up to the outer corners, set round a
 * cross-shaped lower core whose arms show on each face as a dark slot; on
 * the front the slot carries the whale-shark mural and a yellow frame.
 *
 * OSM: way/143328734 (8 levels, the main building), way/151816196
 * エントランスビル (4 levels, the entrance building), the two links
 * way/1565558766 and way/1565558767 (levels 2-3 bridges between them).
 * OSM's height tags here come from PLATEAU and are not used.
 *
 * Published (ja.wikipedia "海遊館"): opened 20 July 1990; main building 8
 * storeys, entrance building 4; 27,200 m^2 floor area; designed by Peter
 * Chermayeff, the mural by Ivan Chermayeff.
 *
 * From photos (scaled on the 62.4 m width, near face-on from the plaza,
 * そらみみ's "20190201-2"; the plan from 臺灣象象's view from above):
 * - the base 0-20.8 m, navy tile, the full square;
 * - the corner blocks 20.8 m up, overhanging the base by about 2.5 m, the
 *   red band from 20.8 m up to a line that rises with the roof (28 m by the
 *   slot, 38 m at the corners), the glass above it about 11.8 m deep, the
 *   roof 39.6 m by the slot and 49.8 m at each outer corner (one plane per
 *   block, rising to the corner);
 * - the cross-shaped core about 10 m wide, its roof at 27.5 m (pale plant
 *   rooms on it), its slot faces dark charcoal;
 * - on the front slot the whale shark, light blue, about 17 m long, and the
 *   yellow portal frame over the slot up to about 37 m;
 * - the mural on the base: schools of small white fish, red coral and sun
 *   discs, yellow fish (drawn as a few bold flush shapes, not copied);
 * - the entrance building: white, a yellow fascia, a glazed ground floor.
 *
 * Colours (daylight photos, sunlit): base tiles #2f3a6e-#3a4580, drawn
 * #45528c (pulled lighter, but dark blue is its identity); red #c8322f-
 * #d23a35, drawn #c9433d; the glass a grey blue #6d8296-#8ea2b4, drawn
 * #6f8396; slot charcoal #4a4f57; whale shark #9ccbd8 (drawn in the pale
 * #cfe2ea that also serves the fish schools, the roof plant and the
 * entrance building); yellow #e3b23a.
 *
 * Estimated: all heights (from the photo, ±2 m; 49.8 m at the corners is
 * also what OSM carries), the overhang, the slot width, the roof planes,
 * the entrance building's 17.6 m (4 levels), the links' 8.9-13.3 m.
 * Doubts: the south-east and south-west faces are drawn like the others
 * (the aerials show red bands and glass on every side; their slots are
 * assumed).
 *
 * Night: the building is not lit inside its glass by night in the photos;
 * the glass stays `glass`; nothing glows.
 *
 * Photos (Wikimedia Commons):
 * - "Osaka Aquarium "Kaiyukan" 20190201-2.jpg", そらみみ, CC BY-SA 4.0 (front, face-on)
 * - "Osaka Aquarium "Kaiyukan" 20190201.jpg", そらみみ, CC BY-SA 4.0 (front, oblique)
 * - "Entrance of Osaka Aquarium "Kaiyukan".jpg", そらみみ, CC BY-SA 4.0 (entrance building)
 * - "大阪海遊館俯視圖.jpg", 臺灣象象, CC BY-SA 4.0 (from above: the corner blocks, the cross)
 * - "Osaka Aquarium Kaiyukan 2022-04-24.jpg", Dick Thomas Johnson, CC BY 2.0 (front, colours)
 * - "Osaka Kaiyukan01s3872.jpg", 663highland, CC BY 2.5 (front)
 * - "Osaka Aquarium Kaiyukan.jpg", Tokumeigakarinoaoshima, CC BY-SA 4.0 (front, whale shark)
 * - "Osaka Aquarium KAIYUKAN and Ferris wheel.jpg", KishujiRapid, CC BY 4.0 (from above, the far faces)
 * Look-only: none.
 */
import { Part, cross, sub, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { finish } from './palette'
import { triangulate, area, type XY } from './chi-aon-center'

const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const unit = (a: V3): V3 => mul(a, 1 / (Math.hypot(...a) || 1))

/** A polygon (convex or fan-able) wound to face n. */
function poly(p: Part, Q: V3[], n: V3) {
  for (let i = 1; i < Q.length - 1; i++) {
    const g = cross(sub(Q[i], Q[0]), sub(Q[i + 1], Q[0]))
    if (dot(g, n) >= 0) p.tri(Q[0], Q[i], Q[i + 1])
    else p.tri(Q[0], Q[i + 1], Q[i])
  }
}

// ---------------------------------------------------------------- plan ---
const A = 31.2       // half-side of the base
const OV = 2.5       // the upper blocks' overhang
const S = 5          // half-width of the cross / slot
const Z_BASE = 20.8, Z_CORE = 27.5
const K = 0.355      // roof slope per metre from the inner corner
const ROOF0 = 29.4   // roof at a block's inner corner
const GLASS = 11.8   // glass depth under the roof
const roofZ = (a: number, b: number) => ROOF0 + K * (a + b)
const redTop = (a: number, b: number) => roofZ(a, b) - GLASS

/** World (east, north, metres from the anchor) → model frame. */
const BEARING = 318.6
const XH: XY = [Math.sin(((BEARING + 90) * Math.PI) / 180), Math.cos(((BEARING + 90) * Math.PI) / 180)]
const YH: XY = [Math.sin((BEARING * Math.PI) / 180), Math.cos((BEARING * Math.PI) / 180)]
const CX = -7.2, CY = -5.7 // the main building's centroid from (135.4290, 34.6546)
const toModel = ([x, y]: XY): XY => {
  const dx = x - CX, dy = y - CY
  return [dx * XH[0] + dy * XH[1], dx * YH[0] + dy * YH[1]]
}
const ENTRANCE: XY[] = ([[-53.9, 40.5], [-37.4, 55.0], [-35.9, 56.3], [1.7, 89.5], [16.8, 72.6], [15.1, 71.1], [17.9, 67.9], [18.3, 68.2], [20.9, 65.2], [20.6, 64.9], [18.0, 62.7], [15.7, 60.6], [13.0, 63.6], [13.4, 63.9], [10.6, 67.1], [6.9, 63.8], [-17.8, 42.1], [-21.3, 39.0], [-24.8, 35.9], [-32.7, 28.9], [-35.3, 26.6], [-38.7, 23.6], [-46.8, 32.6]] as XY[]).map(toModel)
const LINK1: XY[] = ([[-10.0, 33.4], [-17.8, 42.1], [-21.3, 39.0], [-24.8, 35.9], [-17.0, 27.2]] as XY[]).map(toModel)
const LINK2: XY[] = ([[-24.9, 20.3], [-32.7, 28.9], [-35.3, 26.6], [-27.6, 18.0]] as XY[]).map(toModel)
const ccw = (r: XY[]) => (area(r) < 0 ? [...r].reverse() : r)

function build() {
  const navy = new Part()
  const red = new Part()
  const glass = new Part()
  const slot = new Part()   // charcoal
  const white = new Part()  // core roof plant, whale shark, fish schools, entrance building
  const yellow = new Part()

  /** A vertical rectangle on a face: along `t` from u0 to u1 at plane offset, z0..z1. */
  const rect = (p: Part, origin: V3, t: V3, n: V3, u0: number, u1: number, z0: number, z1: number) => {
    const P = (u: number, z: number): V3 => [origin[0] + t[0] * u, origin[1] + t[1] * u, z]
    poly(p, [P(u0, z0), P(u1, z0), P(u1, z1), P(u0, z1)], n)
  }
  const FACES: Array<{ n: V3; t: V3; o: (d: number) => V3 }> = [
    { n: [1, 0, 0], t: [0, 1, 0], o: (d) => [A + d, 0, 0] },   // north-east front
    { n: [0, 1, 0], t: [-1, 0, 0], o: (d) => [0, A + d, 0] },  // north-west
    { n: [-1, 0, 0], t: [0, -1, 0], o: (d) => [-A - d, 0, 0] }, // south-west
    { n: [0, -1, 0], t: [1, 0, 0], o: (d) => [0, -A - d, 0] }, // south-east
  ]

  // --- The base: navy, with the slot panel on each face.
  for (const f of FACES) {
    rect(navy, f.o(0), f.t, f.n, -A, -S, 0, Z_BASE)
    rect(navy, f.o(0), f.t, f.n, S, A, 0, Z_BASE)
    rect(slot, f.o(0), f.t, f.n, -S, S, 0, Z_CORE)
  }

  // --- The cross-shaped core above the base: slot faces and a pale roof.
  for (const f of FACES) {
    // the arm's two side walls between the blocks, from the face back to the centre
    for (const side of [-1, 1]) {
      const n = mul(f.t, side)
      const o0 = add(f.o(0), mul(f.t, side * S))
      const P = (back: number, z: number): V3 => [o0[0] - f.n[0] * back, o0[1] - f.n[1] * back, z]
      poly(slot, [P(0, Z_BASE), P(A - S, Z_BASE), P(A - S, Z_CORE), P(0, Z_CORE)], n)
    }
  }
  poly(white, [[-A, -S, Z_CORE], [A, -S, Z_CORE], [A, S, Z_CORE], [-A, S, Z_CORE]], [0, 0, 1])
  poly(white, [[-S, -A, Z_CORE], [S, -A, Z_CORE], [S, A, Z_CORE], [-S, A, Z_CORE]], [0, 0, 1])
  // plant rooms on the core roof
  for (const [x0, y0, x1, y1, h] of [[-4, -4, 4, 4, 4.5], [10, -3.5, 22, 3.5, 3], [-22, -3.5, -12, 3.5, 3.5], [-3.5, 12, 3.5, 22, 3], [-3.5, -22, 3.5, -14, 3.2]]) {
    const z0 = Z_CORE, z1 = Z_CORE + h
    poly(white, [[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]], [0, 0, 1])
    poly(white, [[x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1]], [1, 0, 0])
    poly(white, [[x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0]], [-1, 0, 0])
    poly(white, [[x0, y1, z0], [x0, y1, z1], [x1, y1, z1], [x1, y1, z0]], [0, 1, 0])
    poly(white, [[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1]], [0, -1, 0])
  }

  // --- The four corner blocks: red band, glass, sloping glass roof.
  const SEG = 4
  for (const sx of [-1, 1])
    for (const sy of [-1, 1]) {
      const X = (a: number) => sx * (S + a), Y = (b: number) => sy * (S + b)
      const W = A + OV - S // block width from the inner edge to the outer face
      // faces: outer x face (a = W), outer y face (b = W), inner x face (a = 0), inner y face (b = 0)
      const sides: Array<{ at: (s: number) => [number, number]; n: V3; outer: boolean }> = [
        { at: (s) => [W, s], n: [sx, 0, 0], outer: true },
        { at: (s) => [s, W], n: [0, sy, 0], outer: true },
        { at: (s) => [0, s], n: [-sx, 0, 0], outer: false },
        { at: (s) => [s, 0], n: [0, -sy, 0], outer: false },
      ]
      for (const sd of sides) {
        for (let k = 0; k < SEG; k++) {
          const s0 = (k / SEG) * W, s1 = ((k + 1) / SEG) * W
          const [a0, b0] = sd.at(s0), [a1, b1] = sd.at(s1)
          const p0: XY = [X(a0), Y(b0)], p1: XY = [X(a1), Y(b1)]
          const r0 = Math.max(Z_BASE, redTop(a0, b0)), r1 = Math.max(Z_BASE, redTop(a1, b1))
          const t0 = roofZ(a0, b0), t1 = roofZ(a1, b1)
          const lowPart = sd.outer ? red : slot
          // inner faces stand over the core's roof: start them there
          const zb = sd.outer ? Z_BASE : Z_CORE
          const rr0 = Math.max(zb, r0), rr1 = Math.max(zb, r1)
          if (rr0 > zb + 0.01 || rr1 > zb + 0.01) poly(lowPart, [[p0[0], p0[1], zb], [p1[0], p1[1], zb], [p1[0], p1[1], rr1], [p0[0], p0[1], rr0]], sd.n)
          poly(glass, [[p0[0], p0[1], rr0], [p1[0], p1[1], rr1], [p1[0], p1[1], t1], [p0[0], p0[1], t0]], sd.n)
        }
      }
      // roof: the sloping glass plane
      const c = (a: number, b: number): V3 => [X(a), Y(b), roofZ(a, b)]
      const nr = unit([-sx * K, -sy * K, 1])
      poly(glass, [c(0, 0), c(W, 0), c(W, W), c(0, W)], nr)
      // soffit under the overhang (red), and the floor seen from below
      poly(red, [[X(0), Y(0), Z_BASE], [X(W), Y(0), Z_BASE], [X(W), Y(W), Z_BASE], [X(0), Y(W), Z_BASE]], [0, 0, -1])
    }

  // --- Mural: bold flush shapes on the navy base (not a copy of the painting).
  const flush = (f: (typeof FACES)[number], d = 0.06) => (u: number, z: number): V3 => {
    const o = f.o(d)
    return [o[0] + f.t[0] * u, o[1] + f.t[1] * u, z]
  }
  const disc = (p: Part, f: (typeof FACES)[number], u: number, z: number, r: number, n = 10) => {
    const P = flush(f)
    poly(p, Array.from({ length: n }, (_, i) => P(u + r * Math.cos((i / n) * 2 * Math.PI), z + r * Math.sin((i / n) * 2 * Math.PI))), f.n)
  }
  const fish = (p: Part, f: (typeof FACES)[number], u: number, z: number, L: number, dir: number) => {
    const P = flush(f)
    poly(p, [P(u - dir * L * 0.5, z), P(u, z - L * 0.28), P(u + dir * L * 0.5, z), P(u, z + L * 0.28)], f.n)
    poly(p, [P(u - dir * L * 0.45, z), P(u - dir * L * 0.8, z - L * 0.22), P(u - dir * L * 0.8, z + L * 0.22)], f.n)
  }
  const school = (f: (typeof FACES)[number], u0: number, z0: number, rows: number, cols: number) => {
    const P = flush(f)
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++) {
        const u = u0 + c * 1.6 + (r % 2) * 0.8, z = z0 + r * 1.3
        poly(white, [P(u, z), P(u + 0.9, z), P(u + 0.9, z + 0.4), P(u, z + 0.4)], f.n)
      }
  }
  FACES.forEach((f, i) => {
    const m = i % 2 ? -1 : 1
    disc(red, f, m * -12, 5.5, 2.6)
    disc(red, f, m * 20, 4.2, 1.8)
    fish(yellow, f, m * -21, 14.5, 5.5, 1)
    fish(yellow, f, m * 14, 12, 4, -1)
    school(f, m * 9 - 4, 6.5, 4, 5)
    school(f, m * -26, 9, 3, 5)
    school(f, m * 18, 15.5, 3, 6)
    school(f, m * -16, 1.5, 2, 7)
    school(f, m * -11, 17, 2, 4)
  })
  // the whale shark on the front slot, light blue, head up
  {
    const f = FACES[0], P = flush(f, 0.25)
    const body: V3[] = []
    for (let i = 0; i < 14; i++) {
      const t = (i / 14) * 2 * Math.PI
      body.push(P(3.2 * Math.cos(t), 15 + 7.5 * Math.sin(t)))
    }
    poly(white, body, f.n)
    poly(white, [P(0, 8.2), P(-2.6, 3.2), P(0, 5.2), P(2.4, 3.6)], f.n) // the tail
    poly(white, [P(-3, 17), P(-6.2, 13), P(-2.8, 14.5)], f.n) // pectoral fins
    poly(white, [P(3, 17), P(6.2, 13), P(2.8, 14.5)], f.n)
  }
  // the yellow portal frame over the front slot
  {
    const bar = (a: V3, b: V3, w: number) => {
      // a square bar between two points (axis-aligned enough for a frame)
      const lo: V3 = [Math.min(a[0], b[0]) - w, Math.min(a[1], b[1]) - w, Math.min(a[2], b[2]) - w]
      const hi: V3 = [Math.max(a[0], b[0]) + w, Math.max(a[1], b[1]) + w, Math.max(a[2], b[2]) + w]
      const Q = (i: number, j: number, k: number): V3 => [i ? hi[0] : lo[0], j ? hi[1] : lo[1], k ? hi[2] : lo[2]]
      poly(yellow, [Q(1, 0, 0), Q(1, 1, 0), Q(1, 1, 1), Q(1, 0, 1)], [1, 0, 0])
      poly(yellow, [Q(0, 0, 0), Q(0, 0, 1), Q(0, 1, 1), Q(0, 1, 0)], [-1, 0, 0])
      poly(yellow, [Q(0, 1, 0), Q(0, 1, 1), Q(1, 1, 1), Q(1, 1, 0)], [0, 1, 0])
      poly(yellow, [Q(0, 0, 0), Q(1, 0, 0), Q(1, 0, 1), Q(0, 0, 1)], [0, -1, 0])
      poly(yellow, [Q(0, 0, 1), Q(1, 0, 1), Q(1, 1, 1), Q(0, 1, 1)], [0, 0, 1])
      poly(yellow, [Q(0, 0, 0), Q(0, 1, 0), Q(1, 1, 0), Q(1, 0, 0)], [0, 0, -1])
    }
    const x = A + 0.6
    for (const y of [-S + 0.5, S - 0.5]) {
      bar([x, y, Z_CORE], [x, y, 37], 0.5)
      bar([x - 7, y, 37], [x, y, 37], 0.5)
    }
    bar([x, -S + 0.5, 37], [x, S - 0.5, 37], 0.6)
    bar([x - 7, -S + 0.5, 37], [x - 7, S - 0.5, 37], 0.5)
  }

  // --- The entrance building and its two links (OSM outlines).
  const extrude = (ring: XY[], z0: number, z1: number, wall: Part, topPart: Part, bottom = false) => {
    const r = ccw(ring)
    for (let i = 0; i < r.length; i++) {
      const a = r[i], b = r[(i + 1) % r.length]
      const n: V3 = unit([b[1] - a[1], a[0] - b[0], 0])
      poly(wall, [[a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1]], n)
    }
    for (const [i, j, k] of triangulate(r)) {
      const P = (q: XY, z: number): V3 => [q[0], q[1], z]
      poly(topPart, [P(r[i], z1), P(r[j], z1), P(r[k], z1)], [0, 0, 1])
      if (bottom) poly(topPart, [P(r[i], z0), P(r[j], z0), P(r[k], z0)], [0, 0, -1])
    }
    return r
  }
  const ent = extrude(ENTRANCE, 0, 17.6, white, white)
  for (let i = 0; i < ent.length; i++) {
    const a = ent[i], b = ent[(i + 1) % ent.length]
    const len = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (len < 6) continue
    const n: V3 = unit([b[1] - a[1], a[0] - b[0], 0])
    const P = (u: number, z: number): V3 => [a[0] + (b[0] - a[0]) * u + n[0] * 0.06, a[1] + (b[1] - a[1]) * u + n[1] * 0.06, z]
    poly(yellow, [P(0, 13.6), P(1, 13.6), P(1, 16.4), P(0, 16.4)], n) // the yellow fascia
    poly(glass, [P(0.04, 0.6), P(0.96, 0.6), P(0.96, 4.6), P(0.04, 4.6)], n) // the glazed ground floor
    poly(glass, [P(0.04, 8.2), P(0.96, 8.2), P(0.96, 11.6), P(0.04, 11.6)], n)
  }
  extrude(LINK1, 8.9, 13.3, white, white, true)
  extrude(LINK2, 8.9, 13.3, white, white, true)

  const parts: Array<{ part: Part; material: MaterialSpec }> = [
    { part: navy, material: finish('kaiyukan-navy-tile', 0x45528c) },
    { part: red, material: finish('kaiyukan-red', 0xc9433d) },
    { part: glass, material: { name: 'glass', color: 0x6f8396, roughness: 0.24 } },
    { part: slot, material: finish('kaiyukan-slot', 0x4a4f57) },
    { part: white, material: finish('kaiyukan-pale', 0xcfe2ea) },
    { part: yellow, material: finish('kaiyukan-yellow', 0xe3b23a) },
  ]
  return parts
}

if (import.meta.main) {
  const parts = build()
  const triangles = parts.reduce((t, { part }) => t + part.triangles, 0)
  if (triangles > 5000) throw new Error(`triangle budget exceeded: ${triangles}`)
  const glb = writeGlb('Kaiyukan', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor', bearing: BEARING, height: 49.8,
  })
  await Bun.write(new URL('../models/osaka-kaiyukan.glb', import.meta.url), glb)
  console.log(`osaka-kaiyukan.glb: ${triangles} triangles, ${glb.length} bytes`)
}
