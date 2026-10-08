/**
 * Transamerica Pyramid, San Francisco — original procedural geometry, CC0-1.0.
 * bun generators/sf-transamerica-pyramid.ts
 *
 * Map frame, rotated to the building: +x is the east face's outward normal,
 * +y the north face's, z up, metres. BEARING 351 (the faces run 9° anticlockwise
 * of the compass). Origin = centroid of the OSM outline way/24222973, which is
 * also the centre of the square plan.
 *
 * Evidence
 * - OSM way/24222973: a 54.4 x 54.3 m square outline (measured from its nodes),
 *   48 levels, height 260. Parts 451336893/95/98/901 (four 30 m base skillions),
 *   451336902 (pyramid 30-260) and 136615987 (the wing ridge, 215 m, 27 x 6.5 m).
 * - USGS 3DEP lidar (CA_SanFrancisco_1_B23, 2023), sampled in the building frame
 *   with /tmp/city/sf/lidar.py at 1 m: spire tip 262 m above the lowest ground;
 *   faces taper at 11.5 m of height per metre inward, half-width 25.8 - z/11.5
 *   (fitted on rows z = 50-200); top of the tapered body ~202 m; both wings
 *   flat-topped at 206-208 m, ~8 m deep (north-south), outer faces 15 m either
 *   side of the centre, so they leave the faces at ~118 m (floor 29). Ground under the footprint varies by 3.1 m.
 * - Published (Wikipedia, CTBUH): 260 m, 48 floors, spire 212 ft (65 m),
 *   elevator wing on the east and stair/smoke tower on the west starting at
 *   floor 29, base 175 ft square, A-frame truss at the foot.
 * - Commons photos (daylight): "SF Transamerica full CA.jpg" (Daniel Schwen,
 *   CC BY-SA 2.5, from the north), "SF Transamerica top CA.jpg" (Daniel Schwen,
 *   CC BY-SA 2.5, crown and wing), "South face of the Transamerica Pyramid,
 *   2017.jpg" (Dllu, CC BY-SA 4.0, punched windows), "Transamerica Pyramid from
 *   Coit Tower - panoramio.jpg" (Yoshio Kohara, CC BY 3.0, from the north-east),
 *   "Transamerica Pyramid - San Francisco, CA - DSC06476.jpg" (Daderot, CC0,
 *   from the north up Hotaling Place), "Transamerica Pyramid base.jpg"
 *   (tian2992, CC BY-SA 2.0, the sloped struts at night).
 *
 * Estimated: the base truss proportions (five A-frames a face, apexes 13 m up,
 * from the north photo), the 4 m podium band above it, the lobby glass line
 * (21 m from the centre), the window grouping (two floors a panel, ~7 m bays).
 * Windows are drawn as broad two-storey panels that taper with each face, not
 * per window.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const BEARING = 351
const ANCHOR = { lng: -122.4027858, lat: 37.7951663 }

const quartz = new Part(), windows = new Part(), spire = new Part(), lobby = new Part()

const up: V3 = [0, 0, 1]
const unit = (v: V3): V3 => { const l = Math.hypot(...v) || 1; return v.map((n) => n / l) as V3 }
function quad(p: Part, a: V3, b: V3, c: V3, d: V3, n?: V3) {
  if (!n) return p.quad(a, b, c, d)
  p.tri(a, b, c, undefined, undefined, undefined, [n, n, n])
  p.tri(a, c, d, undefined, undefined, undefined, [n, n, n])
}

// --- Dimensions ---
const SLOPE = 11.5 // metres of height per metre the faces step in
const W0 = 25.8 // face half-width extrapolated to z = 0
const half = (z: number) => W0 - z / SLOPE
const FOOT = 27.2 // the truss feet: OSM outline half-width
const APEX = 13 // the truss apexes meet the body here
const PODIUM = 17 // top of the podium band; office floors above
const TOP = 202 // top of the tapered body, base of the spire
const TIP = 262 // spire tip (lidar)
const WING_TOP = 208
const WING_OUT = 15 // outer face of each wing from the centre (lidar: -14.7 and +15.3)
const WING_HALF = 4 // half the wing's north-south depth (lidar ~8 m)
const CH = 0.9 // corner chamfer on the body: the white corner piers

// Faces, anticlockwise from above: east, north, west, south.
const FACES = [0, 1, 2, 3].map((k) => {
  const a = (k * Math.PI) / 2
  const n: V3 = [Math.cos(a), Math.sin(a), 0]
  const t: V3 = [-Math.sin(a), Math.cos(a), 0]
  return { n, t, wing: k === 0 || k === 2 }
})
/** A point on face f at lateral offset s, height z, pushed out by `out` along the true face normal. */
function onFace(f: (typeof FACES)[number], s: number, z: number, h = half(z), out = 0): V3 {
  const tn = trueNormal(f)
  return [f.n[0] * h + f.t[0] * s + tn[0] * out, f.n[1] * h + f.t[1] * s + tn[1] * out, z + tn[2] * out]
}
const trueNormal = (f: (typeof FACES)[number]): V3 => unit([f.n[0], f.n[1], 1 / SLOPE])

/** The chamfered square at half-width h, z: eight points anticlockwise. */
function ring(h: number, z: number, ch = CH): V3[] {
  const out: V3[] = []
  for (const f of FACES) {
    out.push([f.n[0] * h - f.t[0] * (h - ch), f.n[1] * h - f.t[1] * (h - ch), z])
    out.push([f.n[0] * h + f.t[0] * (h - ch), f.n[1] * h + f.t[1] * (h - ch), z])
  }
  return out
}

// --- Body: one tapering chamfered loft from the truss apexes to the spire. ---
{
  const r0 = ring(half(APEX), APEX), r1 = ring(half(TOP), TOP)
  quartz.loft([r0, r1])
  quartz.cap(r0, false) // soffit over the lobby, seen between the struts
}

// --- Spire: hollow aluminium pyramid; the white corner piers run on to the tip. ---
{
  const h = half(TOP), r0 = ring(h, TOP, CH * 1.1)
  const tip: V3 = [0, 0, TIP]
  // Shrink the chamfer ring towards the tip as a tiny ring, so corner strips taper.
  const s = 0.03, r1 = ring(h * s, TOP + (TIP - TOP) * (1 - s), CH * 1.1 * s)
  for (let i = 0; i < 8; i++) {
    const j = (i + 1) % 8
    // Even edges are face panels; odd edges are the corner chamfers.
    quad(i % 2 === 0 ? spire : quartz, r0[i], r0[j], r1[j], r1[i])
    ;(i % 2 === 0 ? spire : quartz).tri(r1[i], r1[j], tip)
  }
}

// --- Wings: flat-topped boxes with vertical outer faces, east (lifts) and west (stairs). ---
function box(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, bev = 0.45) {
  // Plan ring with chamfered vertical edges, then a bevelled top lip.
  const plan = (z: number, i = 0): V3[] => {
    const a0 = x0 + i, a1 = x1 - i, b0 = y0 + i, b1 = y1 - i
    return ([[a0 + bev, b0], [a1 - bev, b0], [a1, b0 + bev], [a1, b1 - bev], [a1 - bev, b1], [a0 + bev, b1], [a0, b1 - bev], [a0, b0 + bev]] as [number, number][])
      .map(([x, y]) => [x, y, z] as V3)
  }
  const c = plan(z1, bev)
  p.loft([plan(z0), plan(z1 - bev), c])
  p.cap(c, true)
}
for (const sx of [1, -1]) {
  const x0 = sx > 0 ? 5.5 : -WING_OUT, x1 = sx > 0 ? WING_OUT : -5.5
  box(quartz, x0, x1, -WING_HALF, WING_HALF, 112, WING_TOP)
}

// --- Office windows: two-storey panels per bay, tapering with the face. ---
{
  const z0 = PODIUM + 0.6, storey = (TOP - 2 - z0) / 48
  const groups = 24
  for (const f of FACES) {
    const tn = trueNormal(f)
    for (let g = 0; g < groups; g++) {
      const za = z0 + g * 2 * storey + 2.1, zb = z0 + (g + 1) * 2 * storey - 2.0
      const hm = half((za + zb) / 2)
      const margin = CH + 0.9 // keep the corner piers white
      // Panel corners are fractions of the face width at their own height, so they taper.
      const span = (z: number) => half(z) - margin
      const wingGap = f.wing && zb > 110 ? WING_HALF + 0.9 : 0
      const segs: [number, number][] = wingGap ? [[-1, -wingGap], [wingGap, 1]] : [[-1, 1]]
      for (const [lo, hi] of segs) {
        // lo/hi: -1 and 1 mean the face edges; anything else is an absolute offset.
        const sAt = (v: number, z: number) => (Math.abs(v) === 1 ? v * span(z) : v)
        const width = sAt(hi, (za + zb) / 2) - sAt(lo, (za + zb) / 2)
        if (width < 2.5) continue
        const bays = Math.max(1, Math.round(width / 7))
        const pier = 1.4
        for (let b = 0; b < bays; b++) {
          const pt = (frac: number, z: number) => {
            const s0 = sAt(lo, z), s1 = sAt(hi, z)
            return s0 + (s1 - s0) * frac
          }
          const fa = b / bays, fb = (b + 1) / bays
          const pa = (z: number) => pt(fa, z) + (b === 0 ? 0 : pier / 2)
          const pb = (z: number) => pt(fb, z) - (b === bays - 1 ? 0 : pier / 2)
          if (pb((za + zb) / 2) - pa((za + zb) / 2) < 1.2) continue
          quad(windows, onFace(f, pa(za), za, half(za), 0.05), onFace(f, pb(za), za, half(za), 0.05),
            onFace(f, pb(zb), zb, half(zb), 0.05), onFace(f, pa(zb), zb, half(zb), 0.05), tn)
        }
      }
      void hm
    }
  }
}

// --- Podium band: a single row of long windows between the truss and the offices. ---
for (const f of FACES) {
  const tn = trueNormal(f)
  const za = APEX + 1.3, zb = PODIUM - 1.0, n = 5
  for (let b = 0; b < n; b++) {
    const s = (z: number, fr: number) => -(half(z) - CH - 0.9) + (2 * (half(z) - CH - 0.9)) * fr
    const a = (z: number) => s(z, b / n) + 0.6, c = (z: number) => s(z, (b + 1) / n) - 0.6
    quad(windows, onFace(f, a(za), za, half(za), 0.05), onFace(f, c(za), za, half(za), 0.05),
      onFace(f, c(zb), zb, half(zb), 0.05), onFace(f, a(zb), zb, half(zb), 0.05), tn)
  }
}

// --- Base truss: a zigzag of sloped struts, feet on the outline, apexes under the body. ---
{
  const T = 2.0 // strut width in the face plane
  const D = 1.6 // strut depth through the face
  const N = 5
  const beam = (a: V3, b: V3, side: V3, depth: V3) => {
    // Four long faces of a rectangular strut; ends are buried in ground and soffit.
    const hs = (p: V3, i: number, j: number): V3 => [p[0] + side[0] * i * T / 2 + depth[0] * j * D / 2, p[1] + side[1] * i * T / 2 + depth[1] * j * D / 2, Math.max(0, p[2] + side[2] * i * T / 2 + depth[2] * j * D / 2)]
    const cs = [[-1, 1], [1, 1], [1, -1], [-1, -1]] // around the section, anticlockwise seen from a→b
    for (let k = 0; k < 4; k++) {
      const [i0, j0] = cs[k], [i1, j1] = cs[(k + 1) % 4]
      quad(quartz, hs(a, i0, j0), hs(a, i1, j1), hs(b, i1, j1), hs(b, i0, j0))
    }
  }
  for (const f of FACES) {
    const ha = half(APEX)
    // Apexes at both corners and evenly between; feet midway, on the outline.
    const foot = (i: number): V3 => {
      const s = -(FOOT - 1.5) + (2 * (FOOT - 1.5) * (i + 0.5)) / N
      return [f.n[0] * FOOT + f.t[0] * s, f.n[1] * FOOT + f.t[1] * s, 0]
    }
    const apex = (i: number): V3 => {
      const s = -(ha - CH - 0.4) + (2 * (ha - CH - 0.4) * i) / N
      return [f.n[0] * (ha - D / 2) + f.t[0] * s, f.n[1] * (ha - D / 2) + f.t[1] * s, APEX + 0.3]
    }
    for (let i = 0; i < N; i++) {
      for (const [p, q] of [[foot(i), apex(i)], [foot(i), apex(i + 1)]] as [V3, V3][]) {
        const dir = unit([q[0] - p[0], q[1] - p[1], q[2] - p[2]])
        // depth axis: the face normal, flattened perpendicular to the strut
        const nn = f.n
        const d0 = nn[0] * dir[0] + nn[1] * dir[1] + nn[2] * dir[2]
        const depth = unit([nn[0] - dir[0] * d0, nn[1] - dir[1] * d0, nn[2] - dir[2] * d0])
        const side: V3 = unit([
          dir[1] * depth[2] - dir[2] * depth[1],
          dir[2] * depth[0] - dir[0] * depth[2],
          dir[0] * depth[1] - dir[1] * depth[0],
        ])
        // push the strut outward so its outer face sits on the foot-apex line
        const o = (v: V3): V3 => [v[0] - depth[0] * D / 2 + f.n[0] * D / 2, v[1] - depth[1] * D / 2 + f.n[1] * D / 2, v[2]]
        beam(o(p), o(q), side, depth)
      }
    }
    // The corner pier: a heavier sloped column from the body's corner down to the outline's.
    {
      const c0 = FOOT - 1.4, c1 = ha - 1.1, P = 1.4
      const sq = (c: number, z: number): V3[] => {
        const cx = (f.n[0] + f.t[0]) * c, cy = (f.n[1] + f.t[1]) * c
        const g = [f.n, f.t]
        // a square section around the corner line, axis-aligned to the faces
        return [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([a, b]) => [cx + (g[0][0] * a + g[1][0] * b) * P, cy + (g[0][1] * a + g[1][1] * b) * P, z] as V3)
      }
      const lo = sq(c0, 0), hi = sq(c1, APEX + 0.3)
      // order anticlockwise from above for an outward loft
      const ccw = (r: V3[]) => {
        const cx = r.reduce((s, p) => s + p[0], 0) / 4, cy = r.reduce((s, p) => s + p[1], 0) / 4
        return [...r].sort((p, q) => Math.atan2(p[1] - cy, p[0] - cx) - Math.atan2(q[1] - cy, q[0] - cx))
      }
      quartz.loft([ccw(lo), ccw(hi)])
    }
  }
  // Recessed lobby glass behind the struts.
  const r0 = ring(21, 0, 3), r1 = ring(21, APEX, 3)
  lobby.loft([r0, r1])
}

const parts = [
  { part: quartz, material: finish('quartz-precast', 0xece8df) },
  { part: windows, material: PALETTE.window },
  { part: spire, material: finish('aluminium', 0xcfd4d8, 0.5) },
  { part: lobby, material: { ...PALETTE.entrance, color: 0x6f7e89 } },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Transamerica Pyramid', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: TIP,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['way/24222973', 'way/451336893', 'way/451336895', 'way/451336898', 'way/451336901', 'way/451336902', 'way/136615987'],
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/sf-transamerica-pyramid.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
