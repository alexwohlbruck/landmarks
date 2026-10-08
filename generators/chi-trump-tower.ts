/**
 * Trump International Hotel & Tower (2009, Adrian Smith / SOM), Chicago —
 * original procedural geometry, CC0-1.0.
 * bun generators/chi-trump-tower.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. The anchor is the area centroid of the OSM outline (way/64594680),
 * 41.888875, -87.626459. Bearing 0: the tiers are drawn straight from their
 * OSM outlines, which already sit at the tower's real angle to the river.
 *
 * Form: a riverfront podium and three stacked tiers whose setbacks line up
 * with the Wrigley Building cornice, River Plaza / Marina City and 330 N
 * Wabash (Wikipedia). Every tier has rounded ends and chamfered corners; a
 * rounded drum rises a storey above the main roof at the north-east end and
 * carries the spire. The curtain wall is clear low-e glass behind polished
 * stainless wing mullions, so it reads pale silver-blue in daylight, with a
 * band of brushed stainless spandrel at each setback (photos).
 *
 * Sources:
 *  - Plans: OSM building:parts, exact as mapped (2 dp of a metre lost in
 *    rounding): outline/podium way/64594680; tiers way/188338549 (120 m),
 *    way/188338550 (200 m), way/188338548 (345 m); crown drum way/188338859
 *    (357 m); spire way/188356529, way/284773992, way/284773991 (380, 400,
 *    423 m).
 *  - Heights: OSM tags, which agree with Wikipedia (roof 356 m, spire tip
 *    423.2 m). Podium 60 m is OSM; photos put the stainless band at the
 *    podium top level with the first setback's Wrigley line.
 *  - Body raised 9 m over the Wabash entrance on round columns (Wikipedia,
 *    photos): drawn as a recessed dark storey under the glass, 0–8 m.
 *  - Estimated: steel band depths (about two floors, from photos), mullion
 *    spacing (drawn every ~5 m, real is ~1.5 m), spire radii (OSM rings
 *    are 1.5, 1.1 and 0.7 m; kept slightly fatter so it survives at 200 px).
 *  - y = 0 is taken at the riverwalk side; the body heights are OSM's,
 *    measured from the street. That 6–9 m of ambiguity is within the
 *    podium's recessed base.
 *
 * Photos (Wikimedia Commons, all daylight): Trump_International_Hotel_and_
 * Tower,_Chicago,_September_2016-2.jpg (Alvesgaspar, CC BY-SA 4.0, from the
 * east); Chicago_in_2022_Trump_International_Hotel_&_Tower_(52051289679).jpg
 * (Chris Rycroft, CC BY 2.0); Trump_International_Chicago_2023.jpg
 * (Antony-22, CC BY-SA 4.0, from the river to the south-east);
 * 02_Trump_Hotel_&_Tower_Chicago_April_2015.JPG (Potro, CC BY-SA 4.0, from
 * Wabash to the west). USGS NAIP orthophoto for the plan. No commercial
 * imagery or 3D tiles were used.
 *
 * Left out: the TRUMP letters (signage, not architecture), the Terrace 16
 * planting, the riverwalk steps.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'

type XY = [number, number]

// ---------- plans (OSM, metres from the anchor) ----------

const PODIUM: XY[] = [[-37.9, -22.4], [-38.3, -10.3], [-38.4, -7.0], [-26.8, 4.4], [-17.8, 12.9], [-10.9, 19.4], [-8.3, 21.9], [-3.5, 26.2], [2.2, 31.8], [16.5, 44.7], [18.8, 46.2], [21.2, 47.1], [24.1, 47.4], [26.8, 47.0], [29.4, 46.2], [31.5, 44.9], [33.6, 43.0], [35.1, 41.0], [36.0, 38.9], [36.3, 36.3], [36.8, 22.4], [38.6, 21.1], [38.7, 6.8], [14.8, -15.4], [-18.5, -46.4], [-20.5, -47.4], [-23.1, -47.9], [-26.2, -47.6], [-28.9, -46.8], [-31.6, -45.4], [-33.4, -43.5], [-35.0, -41.4], [-35.9, -39.4], [-36.4, -36.8], [-36.6, -30.2], [-36.8, -23.5]]
const T120: XY[] = [[-18.5, -46.4], [-20.5, -47.4], [-23.1, -47.9], [-26.2, -47.6], [-28.9, -46.8], [-31.6, -45.4], [-33.4, -43.5], [-35.0, -41.4], [-35.9, -39.4], [-36.4, -36.8], [-36.6, -30.2], [-36.8, -23.5], [-37.9, -22.4], [-38.3, -10.3], [-38.4, -7.0], [-26.8, 4.4], [-17.8, 12.9], [-10.9, 19.4], [-8.3, 21.9], [-5.7, 22.6], [4.4, 30.9], [7.2, 32.5], [10.3, 33.4], [13.2, 33.5], [15.8, 33.0], [18.2, 31.9], [20.0, 30.6], [21.4, 29.3], [22.6, 27.2], [23.2, 24.3], [22.7, 10.8], [24.7, 9.6], [25.0, -4.2], [15.0, -13.7], [14.8, -15.4]]
const T200: XY[] = [[-6.7, -32.1], [8.9, -16.8], [12.1, -16.3], [15.0, -13.7], [25.0, -4.2], [24.7, 9.6], [22.7, 10.8], [23.2, 24.3], [22.6, 27.2], [21.4, 29.3], [20.0, 30.6], [18.2, 31.9], [15.8, 33.0], [13.2, 33.5], [10.3, 33.4], [7.2, 32.5], [4.4, 30.9], [-5.7, 22.6], [-10.0, 18.6], [-11.7, 13.6], [-24.5, 1.1], [-24.3, -10.6], [-23.5, -12.0], [-23.2, -23.3], [-22.6, -26.7], [-21.2, -29.2], [-19.5, -31.2], [-17.3, -32.1], [-14.2, -33.2], [-10.3, -33.2]]
const T345: XY[] = [[-11.7, 13.6], [-6.7, 18.4], [-3.3, 19.6], [0.0, 19.7], [3.2, 18.9], [6.0, 17.2], [7.9, 15.2], [9.4, 12.0], [10.0, 9.1], [9.8, -1.3], [11.9, -3.6], [11.8, -14.3], [8.9, -16.8], [-6.7, -32.1], [-10.3, -33.2], [-14.2, -33.2], [-17.3, -32.1], [-19.5, -31.2], [-21.2, -29.2], [-22.6, -26.7], [-23.2, -23.3], [-23.5, -12.0], [-24.3, -10.6], [-24.5, 1.1]]
const DRUM: XY[] = [[8.6, 8.6], [8.2, 11.3], [7.1, 14.0], [5.5, 15.7], [3.1, 17.1], [0.7, 18.0], [-2.0, 18.1], [-4.7, 17.5], [-6.9, 16.6], [-9.0, 14.9], [-10.4, 12.6], [-10.8, 10.1], [-10.7, -4.4], [-9.9, -6.3], [-8.7, -7.7], [-7.2, -8.2], [-5.4, -8.1], [-3.9, -7.3], [6.2, 2.1], [7.3, 3.7], [8.4, 5.9]]
const SPIRE_AT: XY = [2.05, 11.3]

// ---------- materials ----------

const glass = new Part()   // pale silver-blue curtain wall
const steel = new Part()   // polished stainless: mullions, soffit, spire
const band = new Part()    // brushed stainless spandrel bands at the setbacks, a darker grey
const roof = new Part()
const base = new Part()    // the dark recessed storey under the podium

// ---------- 2D helpers ----------

const area = (r: XY[]) => r.reduce((s, p, i) => { const q = r[(i + 1) % r.length]; return s + p[0] * q[1] - q[0] * p[1] }, 0) / 2
const ccw = (r: XY[]) => (area(r) < 0 ? [...r].reverse() : r)
const sub2 = (a: XY, b: XY): XY => [a[0] - b[0], a[1] - b[1]]
const nrm2 = (v: XY): XY => { const l = Math.hypot(v[0], v[1]) || 1; return [v[0] / l, v[1] / l] }
const outward = (a: XY, b: XY): XY => nrm2([b[1] - a[1], -(b[0] - a[0])])

/** Cut each sharp corner (turn over 35°) back by `c` metres: the bevel STYLE.md asks for. */
function bevel(r: XY[], c = 0.6): XY[] {
  const out: XY[] = []
  r.forEach((p, i) => {
    const a = r[(i - 1 + r.length) % r.length], b = r[(i + 1) % r.length]
    const u = nrm2(sub2(p, a)), v = nrm2(sub2(b, p))
    const turn = Math.acos(Math.max(-1, Math.min(1, u[0] * v[0] + u[1] * v[1])))
    const la = Math.hypot(p[0] - a[0], p[1] - a[1]), lb = Math.hypot(b[0] - p[0], b[1] - p[1])
    if (turn > 0.6 && la > 3 * c && lb > 3 * c) out.push([p[0] - u[0] * c, p[1] - u[1] * c], [p[0] + v[0] * c, p[1] + v[1] * c])
    else out.push(p)
  })
  return out
}

/** Offset a ccw ring outward by d (simple miter, fine for gentle shapes). */
function offset(r: XY[], d: number): XY[] {
  return r.map((p, i) => {
    const a = r[(i - 1 + r.length) % r.length], b = r[(i + 1) % r.length]
    const n1 = outward(a, p), n2 = outward(p, b), m = nrm2([n1[0] + n2[0], n1[1] + n2[1]])
    const k = d / Math.max(0.5, m[0] * n1[0] + m[1] * n1[1])
    return [p[0] + m[0] * k, p[1] + m[1] * k]
  })
}

/** Ear-clipping triangulation of a simple ccw ring. */
function earcut(r: XY[]): [number, number, number][] {
  const idx = r.map((_, i) => i), tris: [number, number, number][] = []
  const cr = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inside = (p: XY, a: XY, b: XY, c: XY) => cr(a, b, p) > 1e-9 && cr(b, c, p) > 1e-9 && cr(c, a, p) > 1e-9
  let guard = 0
  while (idx.length > 3 && guard++ < 10000) {
    let cut = false
    for (let k = 0; k < idx.length; k++) {
      const i0 = idx[(k - 1 + idx.length) % idx.length], i1 = idx[k], i2 = idx[(k + 1) % idx.length]
      const a = r[i0], b = r[i1], c = r[i2]
      if (cr(a, b, c) <= 1e-9) continue
      if (idx.some((j) => j !== i0 && j !== i1 && j !== i2 && inside(r[j], a, b, c))) continue
      tris.push([i0, i1, i2]); idx.splice(k, 1); cut = true; break
    }
    if (!cut) idx.splice(0, 1) // degenerate sliver: drop a vertex
  }
  if (idx.length === 3) tris.push([idx[0], idx[1], idx[2]])
  return tris
}

function capRing(part: Part, r: XY[], z: number, up = true) {
  for (const [a, b, c] of earcut(r)) {
    const A: V3 = [r[a][0], r[a][1], z], B: V3 = [r[b][0], r[b][1], z], C: V3 = [r[c][0], r[c][1], z]
    up ? part.tri(A, B, C) : part.tri(A, C, B)
  }
}

/**
 * Vertical walls round a ccw ring, smooth-shaded across gentle bends (the
 * rounded ends) and creased at real corners. `pick` chooses the part per
 * height band, so one call draws glass with a steel band on top.
 */
function walls(r: XY[], bands: [number, number, Part][], smooth = 0.45) {
  const n = r.length
  const en = r.map((p, i) => outward(p, r[(i + 1) % n]))
  const vn = (i: number, e: number): V3 => {
    const a = en[(i - 1 + n) % n], b = en[i]
    const turn = Math.acos(Math.max(-1, Math.min(1, a[0] * b[0] + a[1] * b[1])))
    const m = turn < smooth ? nrm2([a[0] + b[0], a[1] + b[1]]) : en[e]
    return [m[0], m[1], 0]
  }
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n, a = r[i], b = r[j]
    const na = vn(i, i), nb = vn(j, i)
    for (const [z0, z1, part] of bands) {
      if (z1 <= z0) continue
      part.tri([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], undefined, undefined, undefined, [na, nb, nb])
      part.tri([a[0], a[1], z0], [b[0], b[1], z1], [a[0], a[1], z1], undefined, undefined, undefined, [na, nb, na])
    }
  }
}

/** Pale vertical mullion strips every `step` metres round a ring, standing just proud. */
function mullions(part: Part, r: XY[], z0: number, z1: number, step = 5, w = 0.45, proud = 0.05) {
  const n = r.length
  let carry = step / 2
  for (let i = 0; i < n; i++) {
    const a = r[i], b = r[(i + 1) % n], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], o = outward(a, b)
    let s = carry
    for (; s < L; s += step) {
      if (s < w || s > L - w) continue
      const c: XY = [a[0] + t[0] * s + o[0] * proud, a[1] + t[1] * s + o[1] * proud]
      const p: XY = [c[0] - t[0] * w / 2, c[1] - t[1] * w / 2], q: XY = [c[0] + t[0] * w / 2, c[1] + t[1] * w / 2]
      part.quad([p[0], p[1], z0], [q[0], q[1], z0], [q[0], q[1], z1], [p[0], p[1], z1])
    }
    carry = s - L
  }
}

/** A round shaft from z0 to z1, radius r0 → r1. */
function shaft(part: Part, c: XY, z0: number, z1: number, r0: number, r1: number, seg = 10, top = true) {
  const ring = (r: number, z: number): V3[] => Array.from({ length: seg }, (_, k) => {
    const a = (k / seg) * 2 * Math.PI
    return [c[0] + r * Math.cos(a), c[1] + r * Math.sin(a), z]
  })
  const lo = ring(r0, z0), hi = ring(r1, z1)
  for (let k = 0; k < seg; k++) {
    const l = (k + 1) % seg
    const na: V3 = [Math.cos((k / seg) * 2 * Math.PI), Math.sin((k / seg) * 2 * Math.PI), 0]
    const nb: V3 = [Math.cos((l / seg) * 2 * Math.PI), Math.sin((l / seg) * 2 * Math.PI), 0]
    part.tri(lo[k], lo[l], hi[l], undefined, undefined, undefined, [na, nb, nb])
    part.tri(lo[k], hi[l], hi[k], undefined, undefined, undefined, [na, nb, na])
  }
  if (top) part.cap(hi, true)
}

// ---------- the tower ----------

const BASE = 8        // the recessed storey under the raised body
const BAND = 6.5      // stainless spandrel band under each setback, about two floors
const tiers: { ring: XY[]; z0: number; z1: number }[] = [
  { ring: PODIUM, z0: 0, z1: 60 },
  { ring: T120, z0: 60, z1: 120 },
  { ring: T200, z0: 120, z1: 200 },
  { ring: T345, z0: 200, z1: 345 },
  { ring: DRUM, z0: 345, z1: 357 },
]

for (const t of tiers) {
  const ring = bevel(ccw(t.ring))
  const z0 = t.z0 === 0 ? BASE : t.z0
  walls(ring, [[z0, t.z1 - BAND, glass], [t.z1 - BAND, t.z1, band]])
  mullions(steel, ring, z0, t.z1 - BAND, t.z1 - t.z0 > 30 ? 5 : 4)
  capRing(roof, ring, t.z1)
}

// the recessed base storey: the podium ring pulled in 1.8 m, dark glass
{
  const ring = bevel(ccw(PODIUM))
  const inner = offset(ring, -1.8)
  walls(inner, [[0, BASE, base]])
  capRing(steel, ring, BASE, false) // the soffit of the raised body
  // close the gap between soffit edge and the inset wall
  for (let i = 0; i < ring.length; i++) {
    const j = (i + 1) % ring.length
    steel.quad([ring[i][0], ring[i][1], BASE], [ring[j][0], ring[j][1], BASE], [inner[j][0], inner[j][1], BASE], [inner[i][0], inner[i][1], BASE])
  }
}

// the spire: a stepped stainless mast on the drum
shaft(steel, SPIRE_AT, 357, 380, 1.8, 1.5, 10, false)
shaft(steel, SPIRE_AT, 380, 400, 1.5, 1.2, 10, false)
shaft(steel, SPIRE_AT, 400, 423, 1.2, 0.5, 8)

// ---------- write ----------

const parts = [
  { part: glass, material: windowVariant(2, 0xb1c5d3) },
  { part: steel, material: finish('trump-steel', 0xd6dadd, 0.5) },
  { part: band, material: finish('trump-spandrel', 0x9ea3a7, 0.6) },
  { part: roof, material: PALETTE.roof },
  { part: base, material: PALETTE.window },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Trump International Hotel & Tower', parts, {
  license: 'CC0-1.0', bearing: 0, elevation: 0, height: 423,
  frame: 'Y up, -Z north, +X east, metres; origin at the anchor on the ground',
  replaces: ['way/64594680', 'way/188338549', 'way/188338550', 'way/188338548', 'way/188338859', 'way/188356529', 'way/284773992', 'way/284773991'],
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = process.argv[2] ?? new URL('../models/chi-trump-tower.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
