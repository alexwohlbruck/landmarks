/**
 * International Place, Boston (Fort Hill Square): original procedural
 * geometry, CC0-1.0.
 * bun generators/bos-international-place.ts
 *
 * Johnson/Burgee Architects (Philip Johnson and John Burgee) for the
 * Chiofaro Company: One International Place (1987, 46 floors) and Two
 * International Place (1992, 36 floors), with a 27- and a 19-storey block,
 * a 13-storey annex and a central domed court linking all five. Everything
 * is clad in unpolished rose granite with punched windows: the towers are
 * cylinders with a square grid of windows, the rectangular blocks carry
 * round-headed "Palladian" windows, and Two International Place ends in a
 * ring with vertical slits round an octagonal pyramid, lit at night.
 *
 * Frame: map frame, bearing 0 (x east, y north, z up), metres. Origin = the
 * anchor at the middle of the complex (-71.05205, 42.356), between the two
 * towers over the court.
 *
 * Evidence
 * - OSM: way/241176918 (One International Place, 46 levels, 183, #EEEEBB);
 *   way/241176915 (27 levels) and way/241176919 (19 levels), its two blocks;
 *   way/29742432 (Two International Place, 35 levels, 164) with parts
 *   way/240487676 (the drum, 140) and way/240431628 (the crown, 164,
 *   pyramidal); way/29608963 (the 13-level annex); way/484949460 (the court)
 *   and way/484949459 (its dome). Plans below follow these.
 * - USGS 3DEP lidar MA_CentralEastern_1_2021 (2021 flight), 1 m grid; median
 *   roof heights inside each OSM polygon, above the street on the east side
 *   (Atlantic Avenue, ground_min + 7.0; Oliver Street on the west is 1-2 m
 *   higher):
 *   - One International Place 183.5 (parapet to 186.3);
 *   - 27-storey block 110-113; 19-storey block 79-82; annex 53-58;
 *   - Two International Place drum 141, crown ring ~158, pyramid apex 165.6;
 *   - the court 14-17, its dome to ~20.
 *   Published (Wikipedia): One 600 ft (183 m), Two 538 ft (164 m); both match.
 * - Commons photos, all EVIDENCE:
 *   - "One International Place & Two International Place (54960644391).jpg",
 *     ajay_suresh, CC BY 4.0: from the south-east; both cylinders, the
 *     27-storey block between them with its round-headed windows, the window
 *     grid, the crown ring and pyramid, the granite colour;
 *     https://commons.wikimedia.org/wiki/File:One_International_Place_%26_Two_International_Place_(54960644391).jpg
 *   - "2017 International Place and Custom House Tower from Boston
 *     Harbor.jpg", Beyond My Ken, CC BY-SA 4.0: from the harbour (east);
 *     Two International Place's crown and its lower block, One behind;
 *     https://commons.wikimedia.org/wiki/File:2017_International_Place_and_Custom_House_Tower_from_Boston_Harbor.jpg
 *   - "One International Place, Boston MA.jpg", Orthochrome, CC BY-SA 4.0:
 *     from a tower to the north-west; both towers, the glass faces where
 *     each cylinder is cut flat, the curved 13-storey annex with its roof
 *     garden, the 27-storey block's round-headed windows, the ribbed pyramid.
 *     https://commons.wikimedia.org/wiki/File:One_International_Place,_Boston_MA.jpg
 *
 * Estimated: the window grouping (one panel per bay per two storeys, as the
 * style asks, where the real building has one window per floor); the
 * cornice bands; the crown ring's slits (one per two of 24 bays) and the ring's
 * radius (18.5: the lidar's 143-168 m disc reaches ~17.5 and the photo from
 * the north-west shows it nearly as wide as the drum) and the pyramid base
 * (radius 15 from 151 m); the dome's profile. Night: the crown ring
 * and pyramid carry floodlight ("this crown is illuminated at night",
 * Wikipedia); the windows glow.
 * The towers' plans are the OSM outlines (One) and drum part (Two). One's
 * cylinder is cut flat where the 27-storey block meets it, and above the
 * block those faces are the reflective curtain wall Wikipedia describes
 * ("a portion of both towers"), seen in the harbour photo; they are drawn
 * as glass; so is Two's notch facing the court, above the annex (the glass
 * column in Orthochrome's photo).
 * Doubts: the annex and the 19-storey block are seen only in the distance.
 * No look-only sources were used.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'

const ANCHOR = { lng: -71.05205, lat: 42.356 }

type P2 = [number, number]
const granite = new Part(), win = new Part(), trim = new Part(), roof = new Part(), glass = new Part(), curtain = new Part()

const area2 = (a: P2, b: P2, c: P2) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
function earcut(poly: P2[]): [number, number, number][] {
  const idx = poly.map((_, i) => i), out: [number, number, number][] = []
  let guard = 0
  while (idx.length > 3 && guard++ < 4000) {
    for (let k = 0; k < idx.length; k++) {
      const a = idx[(k + idx.length - 1) % idx.length], b = idx[k], c = idx[(k + 1) % idx.length]
      if (area2(poly[a], poly[b], poly[c]) <= 1e-9) continue
      if (idx.some((j) => j !== a && j !== b && j !== c &&
        area2(poly[a], poly[b], poly[j]) >= 0 && area2(poly[b], poly[c], poly[j]) >= 0 && area2(poly[c], poly[a], poly[j]) >= 0)) continue
      out.push([a, b, c]); idx.splice(k, 1); break
    }
  }
  if (idx.length === 3) out.push([idx[0], idx[1], idx[2]])
  return out
}
function ccw(poly: P2[]): P2[] {
  let A = 0
  for (let i = 0; i < poly.length; i++) { const a = poly[i], b = poly[(i + 1) % poly.length]; A += a[0] * b[1] - b[0] * a[1] }
  return A < 0 ? [...poly].reverse() : poly
}
function cap(p: Part, poly: P2[], z: number, up = true) {
  for (const [a, b, c] of earcut(poly)) {
    const A: V3 = [...poly[a], z], B: V3 = [...poly[b], z], C: V3 = [...poly[c], z]
    if (up) p.tri(A, B, C); else p.tri(A, C, B)
  }
}
function inside(p: P2, poly: P2[]) {
  let c = false
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j]
    if ((yi > p[1]) !== (yj > p[1]) && p[0] < ((xj - xi) * (p[1] - yi)) / (yj - yi) + xi) c = !c
  }
  return c
}
const circle = (cx: number, cy: number, r: number, n: number, a0 = 0): P2[] =>
  Array.from({ length: n }, (_, i) => [cx + r * Math.cos(a0 + (2 * Math.PI * i) / n), cy + r * Math.sin(a0 + (2 * Math.PI * i) / n)] as P2)
/** Simplify a dense OSM ring: drop points closer than d to the previous kept one. */
function thin(poly: P2[], d: number): P2[] {
  const out: P2[] = [poly[0]]
  for (const p of poly.slice(1)) { const q = out[out.length - 1]; if (Math.hypot(p[0] - q[0], p[1] - q[1]) >= d) out.push(p) }
  return out
}

// ---------- volumes (plans from OSM, heights from lidar above the east street) ----------
const TWO_C: P2 = [9.3, 35.6]
type Vol = { name: string; poly: P2[]; top: number; kind: 'round' | 'block' | 'low' }
const vols: Vol[] = ([
  { name: 'one', poly: [[0.4, -8.3], [-2.5, -18.4], [16.1, -23.8], [17.5, -29.6], [17.5, -35.4], [16.2, -40.8], [13.7, -46.0], [9.5, -51.1], [5.5, -54.2], [0.4, -56.6], [-5.3, -57.9], [-10.9, -57.9], [-17.7, -56.2], [-34.0, -42.9], [-33.3, -38.1], [-33.7, -32.5], [-32.4, -23.9], [-30.0, -19.0], [-26.3, -14.4], [-21.9, -10.9], [-16.6, -8.3], [-11.1, -7.1], [-5.3, -7.0]], top: 183.5, kind: 'round' },
  { name: 'b27', poly: [[4.6, 6.0], [-2.5, -18.4], [22.9, -25.7], [30.0, -1.3]], top: 111.5, kind: 'block' },
  { name: 'b19', poly: [[-26.3, -14.4], [-47.2, 6.8], [-62.6, -8.1], [-33.3, -38.1]], top: 80, kind: 'block' },
  { name: 'two', poly: [[31.0, 46.5], [16.6, 60.7], [12.2, 59.4], [7.9, 59.5], [3.8, 58.9], [-0.2, 57.6], [-4.0, 55.6], [-7.3, 53.0], [-10.3, 49.6], [-6.6, 36.3], [-14.7, 32.2], [-13.8, 28.1], [-12.2, 24.2], [-9.9, 20.6], [-7.0, 17.5], [-3.6, 15.0], [0.1, 13.0], [4.2, 11.8], [8.4, 11.2], [12.5, 11.4], [16.6, 12.3], [20.5, 13.9], [24.1, 16.1], [27.3, 19.0], [29.9, 22.3], [31.8, 26.1], [33.1, 30.1], [33.7, 34.3], [33.5, 38.5], [32.6, 42.6]], top: 141, kind: 'round' },
  { name: 'annex', poly: thin([[-12.1, 46.7], [-6.6, 36.3], [-14.7, 32.2], [-48.6, 16.4], [-63.9, 19.0], [-66.9, 31.4], [-59.7, 35.8], [-52.3, 39.8], [-44.6, 43.5], [-36.8, 46.7], [-28.8, 49.5], [-20.7, 51.9], [-17.9, 52.6], [-8.7, 51.6]], 0.5), top: 55, kind: 'block' },
  { name: 'court', poly: thin([[-2.6, -7.6], [-11.1, -7.1], [-16.6, -8.3], [-21.9, -10.9], [-26.3, -14.4], [-47.2, 6.8], [-45.9, 10.2], [-48.6, 16.4], [-14.7, 32.2], [-13.8, 28.1], [-12.2, 24.2], [-9.9, 20.6], [-7.0, 17.5], [-3.6, 15.0], [0.1, 13.0], [4.2, 11.8], [5.8, 11.5], [4.6, 6.0], [0.4, -8.3]], 0.5), top: 15, kind: 'low' },
] as Vol[]).map((v) => ({ ...v, poly: ccw(v.poly) as P2[] }))

// the curtain-wall faces, by their corners: One's cut where the 27-storey block meets it, Two's notch over the annex
const FLATS: P2[][] = [[[0.4, -8.3], [-2.5, -18.4], [16.1, -23.8]], [[-10.3, 49.6], [-6.6, 36.3]]]
const near = (p: P2, q: P2) => Math.hypot(p[0] - q[0], p[1] - q[1]) < 0.05
function neighbourTop(self: Vol, p: P2): number {
  let top = 0
  for (const v of vols) if (v !== self && inside(p, v.poly)) top = Math.max(top, v.top)
  return top
}

/** Window panels on a wall strip A→B (outside to the right), rows of two storeys from z0 to z1. */
function windows(A: P2, B: P2, z0: number, z1: number, floor: number, arched: boolean, bays: number, storeys = 2) {
  const L = Math.hypot(B[0] - A[0], B[1] - A[1]), t: P2 = [(B[0] - A[0]) / L, (B[1] - A[1]) / L], n: P2 = [t[1], -t[0]]
  const row = storeys * floor
  const q = (s: number, z: number): V3 => [A[0] + t[0] * s + n[0] * 0.07, A[1] + t[1] * s + n[1] * 0.07, z]
  for (let b = 0; b < bays; b++) {
    const bw = L / bays, w = arched ? Math.min(2.6, bw * 0.5) : bw * 0.62
    const s0 = b * bw + (bw - w) / 2, s1 = s0 + w
    for (let z = Math.ceil((z0 + 0.5) / row) * row; z + row <= z1 + 0.1; z += row) {
      const zb = z + 1.3
      if (!arched) { win.quad(q(s0, zb), q(s1, zb), q(s1, z + row - 0.2), q(s0, z + row - 0.2)); continue }
      const r = w / 2, zs = z + row - 0.4 - r, sc = (s0 + s1) / 2
      win.quad(q(s0, zb), q(s1, zb), q(s1, zs), q(s0, zs))
      const N = 4
      for (let i = 0; i < N; i++) {
        const a0 = (Math.PI * i) / N, a1 = (Math.PI * (i + 1)) / N
        win.tri(q(sc, zs), q(sc + r * Math.cos(a0), zs + r * Math.sin(a0)), q(sc + r * Math.cos(a1), zs + r * Math.sin(a1)))
      }
    }
  }
}

for (const v of vols) {
  const P = v.poly
  for (let k = 0; k < P.length; k++) {
    const a = P[k], b = P[(k + 1) % P.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const t: P2 = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: P2 = [t[1], -t[0]]
    const segs = v.kind === 'round' ? 1 : Math.max(1, Math.round(L / 5))
    for (let i = 0; i < segs; i++) {
      const A: P2 = [a[0] + t[0] * (L * i) / segs, a[1] + t[1] * (L * i) / segs]
      const B: P2 = [a[0] + t[0] * (L * (i + 1)) / segs, a[1] + t[1] * (L * (i + 1)) / segs]
      const m: P2 = [(A[0] + B[0]) / 2 + n[0] * 0.4, (A[1] + B[1]) / 2 + n[1] * 0.4]
      const z0 = neighbourTop(v, m)
      if (z0 >= v.top) continue
      // the curtain walls: One's two flat faces where the 27-storey block cuts into it, Two's notch over the annex
      const flat = FLATS.some((f) => f.some((q) => near(q, a)) && f.some((q) => near(q, b)))
      ;(flat ? curtain : granite).quad([A[0], A[1], z0], [B[0], B[1], z0], [B[0], B[1], v.top], [A[0], A[1], v.top])
      // cornice band at the top
      const o = (p: P2, d: number): P2 => [p[0] + n[0] * d, p[1] + n[1] * d]
      const A2 = o(A, 0.25), B2 = o(B, 0.25)
      trim.quad([A2[0], A2[1], v.top - 1.6], [B2[0], B2[1], v.top - 1.6], [B2[0], B2[1], v.top], [A2[0], A2[1], v.top])
      trim.quad([A[0], A[1], v.top], [B[0], B[1], v.top], [B2[0], B2[1], v.top], [A2[0], A2[1], v.top])
      trim.quad([A[0], A[1], v.top - 1.6], [A2[0], A2[1], v.top - 1.6], [B2[0], B2[1], v.top - 1.6], [B[0], B[1], v.top - 1.6])
      if (v.kind === 'low') { win.quad([A[0] + n[0] * 0.07, A[1] + n[1] * 0.07, Math.max(z0, 0.5)], [B[0] + n[0] * 0.07, B[1] + n[1] * 0.07, Math.max(z0, 0.5)], [B[0] + n[0] * 0.07, B[1] + n[1] * 0.07, 9], [A[0] + n[0] * 0.07, A[1] + n[1] * 0.07, 9]); continue }
      const floor = v.name === 'one' ? 183.5 / 46 : v.name === 'two' ? 141 / 34 : 4.1
      if (flat) {
        // the reflective curtain wall where the cylinder is cut flat: pale frame lines every three storeys
        for (let z = Math.ceil((z0 + 1) / (3 * floor)) * 3 * floor; z < v.top - 3; z += 3 * floor) {
          const A3 = o(A, 0.1), B3 = o(B, 0.1)
          trim.quad([A3[0], A3[1], z - 0.25], [B3[0], B3[1], z - 0.25], [B3[0], B3[1], z + 0.25], [A3[0], A3[1], z + 0.25])
        }
        continue
      }
      // ground floor: a base course, windows start over it
      windows(A, B, Math.max(z0, 6), v.top - 3.5, floor, v.kind === 'block' && v.name !== 'annex', 1, v.kind === 'round' ? 2 : 3)
    }
  }
  if (v.name !== 'two') cap(roof, P, v.top)
}

// ---------- Two International Place's crown: a slotted ring round an octagonal pyramid ----------
const RING_R = 18.5, RING_TOP = 158, PYR_BASE = 151, PYR_R = 15, APEX = 165.6
{
  const P = vols.find((v) => v.name === 'two')!.poly
  // the drum's roof: an annulus between the drum and the ring
  const ring = circle(TWO_C[0], TWO_C[1], RING_R, 24, Math.PI / 24)
  for (let k = 0; k < 24; k++) {
    const a = P[k], b = P[(k + 1) % 24], c = ring[(k + 1) % 24], d = ring[k]
    roof.quad([a[0], a[1], 141], [b[0], b[1], 141], [c[0], c[1], 141], [d[0], d[1], 141])
  }
  for (let k = 0; k < 24; k++) {
    const a = ring[k], b = ring[(k + 1) % 24]
    granite.quad([a[0], a[1], 141], [b[0], b[1], 141], [b[0], b[1], RING_TOP], [a[0], a[1], RING_TOP])
    // a tall dark slit in every other bay
    if (k % 2 === 0) {
      const t: P2 = [b[0] - a[0], b[1] - a[1]], L = Math.hypot(t[0], t[1]), n: P2 = [t[1] / L, -t[0] / L]
      const s0 = 0.3, s1 = 0.7
      const p = (s: number, z: number): V3 => [a[0] + t[0] * s + n[0] * 0.07, a[1] + t[1] * s + n[1] * 0.07, z]
      win.quad(p(s0, 143.5), p(s1, 143.5), p(s1, RING_TOP - 2), p(s0, RING_TOP - 2))
    }
  }
  // the ring's inner face and its top
  const inner = circle(TWO_C[0], TWO_C[1], RING_R - 1.2, 24, Math.PI / 24)
  for (let k = 0; k < 24; k++) {
    const a = ring[k], b = ring[(k + 1) % 24], c = inner[(k + 1) % 24], d = inner[k]
    trim.quad([a[0], a[1], RING_TOP], [b[0], b[1], RING_TOP], [c[0], c[1], RING_TOP], [d[0], d[1], RING_TOP])
    granite.quad([c[0], c[1], PYR_BASE], [d[0], d[1], PYR_BASE], [d[0], d[1], RING_TOP], [c[0], c[1], RING_TOP])
  }
  // floor inside the ring, then the octagonal pyramid rising out of it
  const oct = circle(TWO_C[0], TWO_C[1], PYR_R, 8, Math.PI / 8)
  cap(roof, inner, PYR_BASE)
  for (let j = 0; j < 8; j++) {
    const a = oct[j], b = oct[(j + 1) % 8]
    roof.tri([a[0], a[1], PYR_BASE], [b[0], b[1], PYR_BASE], [TWO_C[0], TWO_C[1], APEX])
  }
}

// ---------- the court's glass dome ----------
{
  const C: P2 = [-23, 8], R = 15.5, H = 6, base = 15
  const N = 16, M = 4
  const pt = (i: number, j: number): V3 => {
    const a = (2 * Math.PI * i) / N, e = (Math.PI / 2) * (j / M)
    return [C[0] + R * Math.cos(e) * Math.cos(a), C[1] + R * Math.cos(e) * Math.sin(a), base + H * Math.sin(e)]
  }
  for (let i = 0; i < N; i++) for (let j = 0; j < M; j++) {
    const a = pt(i, j), b = pt(i + 1, j), c = pt(i + 1, j + 1), d = pt(i, j + 1)
    if (j === M - 1) glass.tri(a, b, c); else glass.quad(a, b, c, d)
  }
}

const TWO_CROWN = (p: V3) => Math.hypot(p[0] - TWO_C[0], p[1] - TWO_C[1]) < RING_R + 0.5 && p[2] > 140.5
const parts = [
  { part: granite, material: { ...finish('rose-granite', 0xc6aca3), floodlight: (p: V3, n: V3) => (TWO_CROWN(p) && n[2] < 0.5 ? 1 : 0) } },
  { part: win, material: windowVariant(2, 0x7a8d9c) },
  { part: trim, material: finish('granite-trim', 0xdcc4b8) },
  { part: roof, material: { ...PALETTE.roof, floodlight: (p: V3) => (TWO_CROWN(p) && p[2] > 151 ? 0.8 : 0) } },
  { part: glass, material: PALETTE.glass },
  { part: curtain, material: windowVariant(3, 0x8ea5b7) },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
console.log(parts.map((p) => p.material.name + ":" + p.part.triangles).join(" "))
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('International Place', parts, {
  license: 'CC0-1.0', bearing: 0, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: 186,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['way/241176918', 'way/241176915', 'way/241176919', 'way/29742432', 'way/240487676', 'way/240431628', 'way/29608963', 'way/484949460', 'way/484949459'],
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/bos-international-place.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
