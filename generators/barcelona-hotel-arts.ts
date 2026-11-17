/**
 * Hotel Arts, Barcelona — original procedural geometry, CC0-1.0.
 * bun generators/barcelona-hotel-arts.ts
 *
 * Map frame turned to the building: BEARING 45, so local +x is the
 * south-east face's outward normal and local +y the north-east face's;
 * z up, metres. Origin = area centroid of the OSM outline way/35816740
 * (lng 2.196221, lat 41.386892), which is the centre of the square plan.
 *
 * Evidence
 * - OSM way/35816740: a square turned 45° (faces to NE, SE, SW, NW) with
 *   cut corners, 49.1 m corner to corner, so 34.6 m across the faces and
 *   corner cuts about 2.4 m long; height 154, 44 levels, wikidata Q1425790
 *   (checked: "Hotel Arts", skyscraper hotel in Barcelona, 41.3867 2.1961).
 *   No building:part ways. The outline is the outer frame.
 * - Published (Wikipedia ca/en): 154 m, 44 storeys, Skidmore, Owings &
 *   Merrill (Bruce Graham), 1992; the white steel frame of columns, beams
 *   and cross braces stands outside the glass.
 * - Commons photos (all EVIDENCE):
 *   "Hotel Arts i Torre Mapfre des del mar.jpg" (Jordiferrer, CC BY-SA 4.0,
 *   level from the sea to the south-east: the frame layout and heights);
 *   "Barcelona - Hotel Arts y Torre Mapre 01.jpg" (Zarateman, CC0, from the
 *   south-west across the beach);
 *   "Hotel Arts.jpg" (Borkur Sigurbjornsson, CC BY 2.0, from the north-west
 *   at street level: the frame runs down to the street);
 *   "Barcelona - Hotel Arts 09.jpg" (Zarateman, CC0: the top corner, the
 *   ladder corner columns and the top ring);
 *   "242 Port Olímpic de Barcelona, Hotel Arts i Torre Mapfre, des del moll
 *   de Xaloc.jpg" (Enric, CC BY-SA 4.0, night: lit rooms, unlit frame).
 *
 * Frame (from the sea photo, scaled to the 34.6 m face): each face has a
 * ladder column on each cut corner and two columns at ±7.6 m, so outer bays
 * of about 8.4 m and a 15.2 m middle bay; ten tiers of 14.4 m (about four
 * storeys) between the main beams; one X per tier in the outer bays (the real frame also has a lighter beam
 * at every second storey, left out as it read as a grid) and one
 * X over two tiers in the middle bay. The frame top is at 144 m (estimated:
 * the sea photo puts it 10 m under Torre Mapfre's crown top at the same
 * distance), and the rooftop plant box with its open frame and white radome
 * dishes rises to 154 (OSM height). Members are drawn 0.75–1.1 m (the corner
 * ladders 2.6 m), a little bolder than the real ones, so they read at phone size.
 *
 * Estimated: the glass tower set back 1.7 m inside the frame, the plant
 * box size (half 7.5 m), the dishes. The glass is a slate-blue `window` wall;
 * the frame's own beams give the floor lines, so no extra trim lines.
 *
 * Night: the rooms glow (`window`); the frame is not floodlit in the night
 * photo, so it stays unlit.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const BEARING = 45
const ANCHOR = { lng: 2.196221, lat: 41.386892 }
const S = 17.3 // frame plane, half across the faces
const C = 1.7 // corner cut, each way
const TIER = 14.4
const TIERS = 10
const TOP = TIER * TIERS // 144
const COL = 7.6

const frame = new Part(), glass = new Part(), roof = new Part()

const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const crs = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const nrm = (a: V3): V3 => { const l = Math.hypot(...a) || 1; return [a[0] / l, a[1] / l, a[2] / l] }

/** A flat face with a known outward normal; the winding follows it. */
function face(p: Part, pts: V3[], n: V3) {
  for (let i = 1; i < pts.length - 1; i++) p.tri(pts[0], pts[i], pts[i + 1], undefined, undefined, undefined, [n, n, n])
}
/** A square-section member from a to b; `out` says which way its depth faces. */
function member(p: Part, a: V3, b: V3, w: number, d: number, out: V3) {
  const t = nrm([b[0] - a[0], b[1] - a[1], b[2] - a[2]])
  const s = nrm(crs(t, out)), n = nrm(crs(s, t))
  const corner = (o: V3, i: number, j: number) => add(add(o, mul(s, (i * w) / 2)), mul(n, (j * d) / 2))
  const ring = (o: V3) => [corner(o, -1, -1), corner(o, 1, -1), corner(o, 1, 1), corner(o, -1, 1)]
  const A = ring(a), B = ring(b)
  // side k spans corners k and k+1 of each ring
  const sideNormal = (k: number) => {
    const c0 = A[k], c1 = A[(k + 1) % 4]
    const m = mul(add(c0, c1), 0.5)
    return nrm([m[0] - a[0], m[1] - a[1], m[2] - a[2]])
  }
  for (let k = 0; k < 4; k++) {
    const l = (k + 1) % 4
    face(p, [A[k], A[l], B[l], B[k]], sideNormal(k))
  }
  face(p, A, mul(t, -1))
  face(p, B, t)
}

// Face k: outward normal at angle k·90°, tangent u running counter-clockwise.
const faceN = (k: number): V3 => [Math.cos((k * Math.PI) / 2), Math.sin((k * Math.PI) / 2), 0]
const faceT = (k: number): V3 => [-Math.sin((k * Math.PI) / 2), Math.cos((k * Math.PI) / 2), 0]
const P = (k: number, u: number, z: number, off = 0): V3 => add(add(mul(faceN(k), S + off), mul(faceT(k), u)), [0, 0, z])

// --- Glass tower inside the frame: an octagon (square with cut corners). ---
{
  const h = S - 1.7, c = C + 1.7
  const oct = (z: number): V3[] => {
    const out: V3[] = []
    for (let k = 0; k < 4; k++) {
      const n = faceN(k), t = faceT(k)
      out.push(add(add(mul(n, h), mul(t, -(h - c))), [0, 0, z]))
      out.push(add(add(mul(n, h), mul(t, h - c)), [0, 0, z]))
    }
    return out
  }
  glass.loft([oct(0), oct(TOP - 1)])
  roof.cap(oct(TOP - 1), true)
}

// --- The frame. ---
const E = S - C // where the face meets the corner cut
for (let k = 0; k < 4; k++) {
  const n = faceN(k)
  // main beams at each tier
  for (let i = 1; i <= TIERS; i++) {
    const z = i * TIER - 0.6
    member(frame, P(k, -E, z), P(k, E, z), 1.1, 1.0, n)
  }
  // the two face columns
  for (const u of [-COL, COL]) member(frame, P(k, u, 0), P(k, u, TOP), 1.1, 1.1, n)
  // braces: an X per tier in each outer bay
  for (let i = 0; i < TIERS; i++) {
    const z0 = i * TIER, z1 = z0 + TIER
    for (const sg of [-1, 1]) {
      const ua = sg * (E - 0.4), ub = sg * (COL + 0.4)
      member(frame, P(k, ua, z0, 0.1), P(k, ub, z1, 0.1), 0.75, 0.6, n)
      member(frame, P(k, ub, z0, 0.1), P(k, ua, z1, 0.1), 0.75, 0.6, n)
    }
  }
  // and an X over two tiers in the middle bay
  for (let i = 0; i < TIERS; i += 2) {
    const z0 = i * TIER, z1 = z0 + 2 * TIER
    member(frame, P(k, -COL + 0.4, z0, 0.1), P(k, COL - 0.4, z1, 0.1), 0.75, 0.6, n)
    member(frame, P(k, COL - 0.4, z0, 0.1), P(k, -COL + 0.4, z1, 0.1), 0.75, 0.6, n)
  }
  // ladder column on the cut corner between face k and face k+1
  {
    const a = P(k, E, 0), b = P((k + 1) % 4, -E, 0)
    const m: V3 = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, 0]
    const dn = nrm([n[0] + faceN((k + 1) % 4)[0], n[1] + faceN((k + 1) % 4)[1], 0])
    member(frame, m, [m[0], m[1], TOP + 0.4], 2.6, 1.3, dn)
    // the corner's top beam joining the faces' top beams
    member(frame, [a[0], a[1], TOP - 0.6], [b[0], b[1], TOP - 0.6], 1.3, 1.1, dn)
  }
}

// --- Roof: plant box with an open frame and the radome dishes. ---
{
  const h = 7.5, z0 = TOP - 1, z1 = TOP + 4.5
  const sq = (half: number, z: number): V3[] => [[half, -half, z], [half, half, z], [-half, half, z], [-half, -half, z]]
  roof.loft([sq(h, z0), sq(h, z1)])
  roof.cap(sq(h, z1), true)
  // open frame on top of the box
  const fz = TOP + 8.6
  const pts: [number, number][] = [[h, -h], [h, h], [-h, h], [-h, -h]]
  for (let i = 0; i < 4; i++) {
    const [x, y] = pts[i], [x2, y2] = pts[(i + 1) % 4]
    const out = nrm([(x + x2) / 2, (y + y2) / 2, 0])
    member(frame, [x, y, z1], [x, y, fz], 0.8, 0.8, nrm([x, y, 0]))
    member(frame, [x, y, fz], [x2, y2, fz], 0.8, 0.8, out)
  }
  // dishes: small white domes on the frame
  const dome = (cx: number, cy: number, r: number, z: number) => {
    const N = 10, rings: V3[][] = []
    for (let j = 0; j <= 3; j++) {
      const a = (j / 3) * (Math.PI / 2) * 0.92
      const rr = r * Math.cos(a), zz = z + r * Math.sin(a)
      const ring: V3[] = []
      for (let i = 0; i < N; i++) ring.push([cx + rr * Math.cos((i / N) * 2 * Math.PI), cy + rr * Math.sin((i / N) * 2 * Math.PI), zz])
      rings.push(ring)
    }
    frame.loft(rings)
    frame.cap(rings[3], true)
  }
  for (const [x, y] of [[-4, -4], [4, -4], [4, 4], [-4, 4], [0, 0]]) dome(x, y, 1.4, fz + 0.4)
}

const parts = [
  { part: frame, material: finish('arts-steel', 0xf2f0ea) },
  { part: glass, material: { ...PALETTE.window, color: 0x7590a8 } },
  { part: roof, material: PALETTE.roof },
]
// Member ends at the ground reach half a section below it: flatten them onto y = 0.
for (const { part } of parts) for (let i = 1; i < part.pos.length; i += 3) part.pos[i] = Math.max(0, part.pos[i])
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Hotel Arts', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: 154,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['way/35816740'],
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/barcelona-hotel-arts.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
