/**
 * National World War II Memorial, Washington, DC — procedural, CC0-1.0.
 *
 *   bun generators/dc-wwii-memorial.ts
 *
 * Map frame: x east, y north, z up, metres. The origin is the middle of the
 * oval plaza (lng -77.0405074, lat 38.8893982), on the sunken plaza floor,
 * which is the lowest ground under the memorial. Bearing 0: the memorial's
 * long axis runs due east-west along the Mall, as OSM draws it.
 *
 * Also exports the small geometry kit the other dc memorial generators by the
 * same builder use (bevelled prisms, concave extrusions, smooth bodies), so
 * the main build below only runs when this file is executed directly.
 *
 * Evidence
 *  - OSM (measured): the 56 pillar footprints (way/894587414…894587476, one
 *    way per state or territory, each about 1.3 × 0.5–0.8 m), the Atlantic
 *    and Pacific pavilions (way/574904167, way/894589603, 7.1 × 6.8 m), the
 *    Freedom Wall (way/894587413, height=3) and the four L-shaped walls that
 *    end the pillar arcs (way/894587428, 445, 461, 477, height=3). Pillar
 *    positions and orientations are taken straight from OSM.
 *  - Published (Wikipedia, NPS): 56 granite pillars 17 ft (5.2 m) tall,
 *    two 43 ft (13 m) triumphal arches, the baldacchino of four bronze eagles
 *    holding a laurel wreath under each arch (Kaskey), bronze oak and wheat
 *    wreaths on each pillar, 4,048 gold stars on the Freedom Wall.
 *  - Photos (Wikimedia Commons): Carol M. Highsmith's aerial (public
 *    domain) for the plan and the oculus in each arch roof; Don McCullough
 *    2013 (CC BY 2.0) and Highsmith 04308v / 05001v (public domain) for the
 *    pillar rhythm, the slot through each pillar, the wreaths, the terrace
 *    wall the pillars stand on and the arch proportions; US Navy 050308-N-
 *    0295M-005 (public domain) and Victoria Mejia-Gewe (CC BY-SA 4.0) for the
 *    pillar section.
 *
 * Estimated: the terrace wall (1.3 m above the plaza, from the photos with
 * people for scale); pillar section 1.4 × 1.0 m (OSM's 0.5–0.8 m depth looks
 * traced from the shafts alone); the arch opening (3.3 m wide, springing at
 * 6.8 m, read off Highsmith 04308v); the baldacchino's sizes; the Freedom
 * Wall's 3.2 m height above the plaza.
 *
 * Left out on purpose (STYLE.md: no ground or water): the Rainbow Pool and
 * its fountains, the plaza paving, the entrance ramps and lawns, the fountain
 * basins in front of each arch, the bronze rope linking the pillars and the
 * east entrance flagpoles (way/894589599, way/894589600 stay as OSM draws them).
 */
import { Part, addGltfTriangles, cross, sub, len, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

// ======================================================================= kit

export type XY = [number, number]
export const TAU = Math.PI * 2
export const unit = (v: V3): V3 => v.map(n => n / (len(v) || 1)) as V3
export const plus = (a: V3, b: V3): V3 => a.map((n, i) => n + b[i]) as V3
export const scale = (a: V3, s: number): V3 => a.map(n => n * s) as V3
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]

/** Signed area of a 2D ring (positive = counter-clockwise). */
export function area2(r: XY[]) {
  let a = 0
  for (let i = 0; i < r.length; i++) {
    const [x0, y0] = r[i], [x1, y1] = r[(i + 1) % r.length]
    a += x0 * y1 - x1 * y0
  }
  return a / 2
}

/** Ear-clipping triangulation of a simple polygon (no holes); CCW output. */
export function earcut(ring: XY[]): [number, number, number][] {
  const idx = ring.map((_, i) => i)
  if (area2(ring) < 0) idx.reverse()
  const tris: [number, number, number][] = []
  const crossz = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inside = (p: XY, a: XY, b: XY, c: XY) =>
    crossz(a, b, p) >= -1e-9 && crossz(b, c, p) >= -1e-9 && crossz(c, a, p) >= -1e-9
  let guard = 0
  while (idx.length > 3 && guard++ < 10000) {
    let cut = false
    for (let k = 0; k < idx.length; k++) {
      const i0 = idx[(k + idx.length - 1) % idx.length], i1 = idx[k], i2 = idx[(k + 1) % idx.length]
      const a = ring[i0], b = ring[i1], c = ring[i2]
      if (crossz(a, b, c) <= 1e-9) continue
      let ok = true
      for (const j of idx) {
        if (j === i0 || j === i1 || j === i2) continue
        if (inside(ring[j], a, b, c)) { ok = false; break }
      }
      if (!ok) continue
      tris.push([i0, i1, i2])
      idx.splice(k, 1)
      cut = true
      break
    }
    if (!cut) break
  }
  if (idx.length === 3) tris.push([idx[0], idx[1], idx[2]])
  return tris
}

/**
 * Extrude a simple (possibly concave) polygon between two heights, in a frame:
 * `at(u, v, w)` maps polygon coords (u, v) and extrusion w ∈ [w0, w1] to the
 * map frame. Defaults to plan (x, y) extruded up z.
 */
export function extrude(p: Part, ring: XY[], w0: number, w1: number,
  at: (u: number, v: number, w: number) => V3 = (u, v, w) => [u, v, w], { caps = [true, true] } = {}) {
  const r = area2(ring) < 0 ? [...ring].reverse() : ring
  // Handedness of the frame decides which way is "out".
  const o = at(0, 0, 0), eu = sub(at(1, 0, 0), o), ev = sub(at(0, 1, 0), o), ew = sub(at(0, 0, 1), o)
  const flip = dot(cross(eu, ev), ew) < 0
  const T = (a: V3, b: V3, c: V3) => (flip ? p.tri(a, c, b) : p.tri(a, b, c))
  for (let i = 0; i < r.length; i++) {
    const [u0, v0] = r[i], [u1, v1] = r[(i + 1) % r.length]
    const a = at(u0, v0, w0), b = at(u1, v1, w0), c = at(u1, v1, w1), d = at(u0, v0, w1)
    T(a, b, c); T(a, c, d)
  }
  const tris = earcut(r)
  for (const [i, j, k] of tris) {
    if (caps[1]) T(at(...r[i], w1), at(...r[j], w1), at(...r[k], w1))
    if (caps[0]) T(at(...r[i], w0), at(...r[k], w0), at(...r[j], w0))
  }
}

/** A rectangle's outline, corners chamfered by b, centred, turned by `rot`. */
export function rect(cx: number, cy: number, hx: number, hy: number, rot = 0, b = 0): XY[] {
  const base: XY[] = b > 0
    ? [[-hx + b, -hy], [hx - b, -hy], [hx, -hy + b], [hx, hy - b], [hx - b, hy], [-hx + b, hy], [-hx, hy - b], [-hx, -hy + b]]
    : [[-hx, -hy], [hx, -hy], [hx, hy], [-hx, hy]]
  const c = Math.cos(rot), s = Math.sin(rot)
  return base.map(([x, y]) => [cx + x * c - y * s, cy + x * s + y * c])
}

/**
 * A convex prism with its top edge chamfered by `b`: sides up to z1 - b, a
 * sloped band, and the inset lid. The soft edge that catches light.
 */
export function prism(p: Part, ring: XY[], z0: number, z1: number, b = 0.15, bottom = false) {
  const r = area2(ring) < 0 ? [...ring].reverse() : ring
  const n = r.length
  // Inset ring by moving each vertex along its bisector.
  const inset = r.map((v, i) => {
    const a = r[(i + n - 1) % n], c = r[(i + 1) % n]
    const e0 = unit([v[0] - a[0], v[1] - a[1], 0]), e1 = unit([c[0] - v[0], c[1] - v[1], 0])
    const n0: XY = [e0[1], -e0[0]], n1: XY = [e1[1], -e1[0]]
    const m = unit([n0[0] + n1[0], n0[1] + n1[1], 0])
    const k = b / Math.max(0.3, m[0] * n0[0] + m[1] * n0[1])
    return [v[0] - m[0] * k, v[1] - m[1] * k] as XY
  })
  const bb = Math.min(b, (z1 - z0) * 0.45)
  const lo = r.map(([x, y]) => [x, y, z0] as V3)
  const mid = r.map(([x, y]) => [x, y, z1 - bb] as V3)
  const hi = inset.map(([x, y]) => [x, y, z1] as V3)
  p.loft(bb > 0.001 ? [lo, mid, hi] : [lo, hi.map((v, i) => [r[i][0], r[i][1], z1] as V3)])
  const top = bb > 0.001 ? hi : r.map(([x, y]) => [x, y, z1] as V3)
  p.cap(top, true)
  if (bottom) p.cap(lo, false)
}

/** Smooth a sculpted piece on its own, keeping creases sharper than `crease`. */
export function smooth(target: Part, build: (p: Part) => void, crease = 70) {
  const p = new Part()
  build(p)
  addGltfTriangles(target, new Float32Array(p.pos),
    Uint32Array.from({ length: p.pos.length / 3 }, (_, i) => i), { creaseDegrees: crease })
}

export function oval(c: V3, rx: number, ry: number, n = 12, rot = 0): V3[] {
  return Array.from({ length: n }, (_, i) => {
    const a = (i + 0.5) / n * TAU
    const x = rx * Math.cos(a), y = ry * Math.sin(a)
    return [c[0] + x * Math.cos(rot) - y * Math.sin(rot), c[1] + x * Math.sin(rot) + y * Math.cos(rot), c[2]]
  })
}

/** A closed loft of horizontal rings: rows of [z, rx, ry, cx, cy, rot]. */
export function body(p: Part, rows: number[][], n = 12, crease = 70) {
  smooth(p, mesh => {
    const rings = rows.map(([z, rx, ry, cx = 0, cy = 0, rot = 0]) => oval([cx, cy, z], rx, ry, n, rot))
    mesh.loft(rings)
    mesh.cap(rings[0], false)
    mesh.cap(rings[rings.length - 1], true)
  }, crease)
}

export function ellipsoid(p: Part, c: V3, r: V3, n = 10, rows = 6) {
  smooth(p, mesh => {
    const rings = Array.from({ length: rows + 1 }, (_, j) => {
      const a = -Math.PI / 2 + j / rows * Math.PI
      const k = j === 0 || j === rows ? 0.0001 : Math.cos(a)
      return oval([c[0], c[1], c[2] + r[2] * Math.sin(a)], r[0] * k, r[1] * k, n)
    })
    mesh.loft(rings)
  }, 80)
}

/**
 * A tapered tube along a path, each ring square to the path (parallel
 * transport, so bends don't twist). `ref` seeds the ring's "width" axis.
 */
export function tube(p: Part, path: V3[], widths: number[], depths = widths, sides = 8,
  { ref, crease = 70, capEnds = true }: { ref?: V3; crease?: number; capEnds?: boolean } = {}) {
  smooth(p, mesh => {
    let u: V3 | undefined
    const rings = path.map((c, i) => {
      const axis = unit(sub(path[Math.min(i + 1, path.length - 1)], path[Math.max(0, i - 1)]))
      const r0: V3 = u ?? ref ?? (Math.abs(axis[2]) > 0.9 ? [1, 0, 0] : [0, 0, 1])
      u = unit(sub(r0, scale(axis, dot(r0, axis))))
      const v = cross(axis, u)
      return Array.from({ length: sides }, (_, j) => {
        const a = (j + 0.5) / sides * TAU
        return plus(c, plus(scale(u!, widths[i] * Math.cos(a)), scale(v, depths[i] * Math.sin(a))))
      })
    })
    mesh.loft(rings)
    if (capEnds) {
      mesh.cap(rings[0], false)
      mesh.cap(rings[rings.length - 1], true)
    }
  }, crease)
}

/** A flat ring (annulus) of `n` sides, thickness t, in the plane spanned by e1, e2 around c. */
export function ring(p: Part, c: V3, e1: V3, e2: V3, r0: number, r1: number, t: number, n = 6, back = true, rim = true) {
  const nrm = unit(cross(e1, e2))
  const pt = (r: number, a: number, w: number): V3 =>
    plus(plus(c, scale(nrm, w)), plus(scale(e1, r * Math.cos(a)), scale(e2, r * Math.sin(a))))
  for (let i = 0; i < n; i++) {
    const a0 = (i / n) * TAU + Math.PI / 2, a1 = ((i + 1) / n) * TAU + Math.PI / 2
    // front (+nrm)
    p.quad(pt(r0, a0, t / 2), pt(r1, a0, t / 2), pt(r1, a1, t / 2), pt(r0, a1, t / 2))
    if (back) p.quad(pt(r0, a1, -t / 2), pt(r1, a1, -t / 2), pt(r1, a0, -t / 2), pt(r0, a0, -t / 2))
    // outer rim
    if (rim) p.quad(pt(r1, a0, -t / 2), pt(r1, a1, -t / 2), pt(r1, a1, t / 2), pt(r1, a0, t / 2))
  }
}

/** Write the GLB with the batch's budget checks. */
export async function save(id: string, name: string, parts: Array<{ part: Part; material: any }>, extras: Record<string, unknown>, maxTris = 5000) {
  const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
  if (triangles > maxTris) throw new Error(`${id}: triangle budget exceeded: ${triangles}`)
  const glb = writeGlb(name, parts, { license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor', ...extras })
  if (glb.length > 256000) throw new Error(`${id}: file budget exceeded: ${glb.length}`)
  const out = new URL(`../models/${id}.glb`, import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
}

// ================================================================== memorial

if (import.meta.main) {
  const granite = new Part()
  const cap = new Part()
  const bronze = new Part()
  const stars = new Part()

  const TERRACE = 1.3 // top of the terrace wall the pillars stand on
  const PILLAR = 5.2 // 17 ft, from the terrace

  // [x, y, tangent angle] per pillar, from OSM (anchor-relative).
  const PILLARS: [number, number, number][] = [
    [-33.21, -29.99, 1.95], [-32.04, -32.85, 1.993], [-30.75, -35.59, 2.024], [-29.37, -38.34, 2.104], [-27.75, -41.05, 2.136], [-26.07, -43.56, 2.225], [-24.17, -45.9, 2.311], [-22.04, -48.08, 2.425], [-19.7, -50.07, 2.475], [-17.04, -51.97, 2.604], [-14.38, -53.42, 2.708], [-11.43, -54.68, 2.827], [-8.53, -55.58, 2.875], [-5.44, -56.36, 2.919],
    [5.87, -56.23, 0.26], [8.93, -55.35, 0.301], [11.8, -54.36, 0.342], [14.72, -53.01, 0.46], [17.33, -51.48, 0.577], [19.92, -49.51, 0.7], [22.21, -47.44, 0.74], [24.27, -45.21, 0.858], [26.09, -42.8, 0.949], [27.71, -40.25, 1.037], [29.23, -37.49, 1.069], [30.53, -34.69, 1.153], [31.74, -31.92, 1.174], [32.82, -29.02, 1.221],
    [-7.26, 56.98, 0.258], [-10.33, 56.1, 0.299], [-13.19, 55.11, 0.35], [-16.11, 53.76, 0.46], [-18.72, 52.24, 0.571], [-21.31, 50.26, 0.7], [-23.6, 48.19, 0.74], [-25.66, 45.96, 0.858], [-27.48, 43.56, 0.944], [-29.09, 41.0, 1.037], [-30.62, 38.24, 1.063], [-31.93, 35.45, 1.147], [-33.13, 32.67, 1.174], [-34.2, 29.78, 1.221],
    [4.05, 57.12, 2.919], [7.14, 56.33, 2.875], [10.04, 55.43, 2.827], [13.0, 54.17, 2.708], [15.65, 52.72, 2.598], [18.3, 50.83, 2.475], [20.65, 48.83, 2.43], [22.78, 46.66, 2.316], [24.67, 44.31, 2.23], [26.36, 41.8, 2.136], [27.97, 39.09, 2.109], [29.36, 36.34, 2.024], [30.65, 33.6, 1.999], [31.81, 30.75, 1.95],
  ]
  // Orient every pillar with its local +y pointing into the plaza.
  const frames = PILLARS.map(([x, y, a]) => {
    let t: XY = [Math.cos(a), Math.sin(a)]
    let nrm: XY = [-t[1], t[0]]
    if (nrm[0] * -x + nrm[1] * -y < 0) { nrm = [-nrm[0], -nrm[1]]; t = [-t[0], -t[1]] }
    return { x, y, t, n: nrm }
  })

  // ---- the terrace wall under each arc of 14 pillars ----------------------
  // A band 2.2 m wide following the pillar line, from the arc's end wall to
  // the pavilion's flank.
  const band = (pts: XY[], hw: number, z1: number) => {
    const N = pts.length
    const L: V3[] = [], R: V3[] = []
    for (let i = 0; i < N; i++) {
      const a = pts[Math.max(0, i - 1)], c = pts[Math.min(N - 1, i + 1)]
      const d = unit([c[0] - a[0], c[1] - a[1], 0])
      L.push([pts[i][0] - d[1] * hw, pts[i][1] + d[0] * hw, 0])
      R.push([pts[i][0] + d[1] * hw, pts[i][1] - d[0] * hw, 0])
    }
    const up = (v: V3, dz = 0, inset = 0, o?: V3): V3 => [v[0], v[1], z1 + dz]
    for (let i = 0; i < N - 1; i++) {
      // top
      granite.quad(up(L[i]), up(R[i]), up(R[i + 1]), up(L[i + 1]))
      // sides
      granite.quad(R[i], R[i + 1], up(R[i + 1]), up(R[i]))
      granite.quad(L[i + 1], L[i], up(L[i]), up(L[i + 1]))
    }
    granite.quad(R[0], up(R[0]), up(L[0]), L[0])
    granite.quad(L[N - 1], up(L[N - 1]), up(R[N - 1]), R[N - 1])
  }
  const arcs = [0, 14, 28, 42].map(k => frames.slice(k, k + 14).map(f => [f.x, f.y] as XY))
  // Extend each arc a pillar-gap at the end wall side, and up to the pavilion.
  const PAV = { atlantic: [-1.85, 54.95] as XY, pacific: [0.39, -54.08] as XY }
  // Each arc ordered from its end wall to its pavilion.
  const extend = (a: XY[], toward: XY) => {
    const d = unit([a[0][0] - a[1][0], a[0][1] - a[1][1], 0])
    const start: XY = [a[0][0] + d[0] * 2.4, a[0][1] + d[1] * 2.4]
    const last = a[a.length - 1]
    const e = unit([toward[0] - last[0], toward[1] - last[1], 0])
    const dist = Math.hypot(toward[0] - last[0], toward[1] - last[1]) - 3.7
    return [start, ...a, [last[0] + e[0] * dist, last[1] + e[1] * dist] as XY]
  }
  band(extend(arcs[0], PAV.pacific), 1.1, TERRACE)
  band(extend([...arcs[1]].reverse(), PAV.pacific), 1.1, TERRACE)
  band(extend([...arcs[2]].reverse(), PAV.atlantic), 1.1, TERRACE)
  band(extend([...arcs[3]].reverse(), PAV.atlantic), 1.1, TERRACE)

  // ---- the 56 pillars --------------------------------------------------------
  // In the pillar's frame: u along the arc, v toward the plaza, z up.
  const HU = 0.7, HV = 0.5, SLOT = 0.16
  const Z0 = TERRACE, ZB = Z0 + 1.55, ZS = Z0 + 4.55, ZT = Z0 + PILLAR
  for (const f of frames) {
    const P = (u: number, v: number): XY => [f.x + f.t[0] * u + f.n[0] * v, f.y + f.t[1] * u + f.n[1] * v]
    const R = (u0: number, u1: number, v0: number, v1: number): XY[] => [P(u0, v0), P(u1, v0), P(u1, v1), P(u0, v1)]
    // Base with the state's name: a little wider than the shafts.
    prism(granite, R(-HU - 0.08, HU + 0.08, -HV - 0.08, HV + 0.08), Z0, ZB, 0)
    // Two shafts either side of the open slot…
    for (const s of [-1, 1]) {
      const u0 = s < 0 ? -HU : SLOT, u1 = s < 0 ? -SLOT : HU
      extrude(granite, R(u0, u1, -HV, HV), ZB, ZS, undefined, { caps: [false, false] })
    }
    // …joined by the solid head, its top chamfered.
    prism(granite, R(-HU, HU, -HV, HV), ZS, ZT, 0)
    // The bronze wreath over the slot, on the plaza face and the outer face.
    const zW = Z0 + 3.95
    const e1: V3 = [f.t[0], f.t[1], 0], e2: V3 = [0, 0, 1]
    for (const s of [1, -1]) {
      const c = P(0, s * (HV + 0.07))
      ring(bronze, [c[0], c[1], zW], s > 0 ? scale(e1, -1) : e1, e2, 0.3, 0.58, 0.14, 8, false, false)
    }
  }

  // ---- the arcs' end walls (OSM height=3) -----------------------------------
  const ENDS: XY[][] = [
    [[-38.84, -22.68], [-38.09, -22.63], [-35.71, -22.55], [-33.11, -29.14], [-33.87, -29.43], [-35.51, -25.42], [-36.66, -25.42], [-36.92, -25.42], [-35.29, -29.85], [-36.01, -30.06], [-36.85, -27.87], [-38.47, -23.65]],
    [[37.9, -21.58], [34.74, -21.66], [32.69, -28.17], [33.46, -28.45], [35.04, -24.05], [37.16, -24.05], [37.67, -22.35]],
    [[-39.65, 22.15], [-38.71, 22.15], [-36.37, 22.15], [-34.08, 28.94], [-34.84, 29.2], [-36.44, 24.61], [-37.53, 24.63], [-38.08, 24.63], [-36.27, 29.58], [-37.0, 29.77], [-39.32, 23.02]],
    [[37.21, 23.5], [33.92, 23.46], [31.72, 29.89], [32.47, 30.19], [34.09, 26.03], [36.29, 26.1], [36.89, 24.4]],
  ]
  for (const e of ENDS) extrude(granite, e, 0, 2.2, undefined, { caps: [false, true] })
  // The terrace wall carries on past each west end wall to the Freedom
  // Wall's ends (aerials).
  for (const s of [-1, 1]) band([[-37.6, s * 22.4], [-39.6, s * 17.5], [-40.2, s * 13.2]], 0.6, TERRACE)
  // The entrance balustrades running east from the arcs' end walls to the
  // flagpole bases on 17th Street (aerials; not in OSM).
  for (const y of [-22.4, 23.0]) prism(granite, rect(53.3, y, 15.4, 0.4), 0, 1.2, 0.1)

  // ---- the Freedom Wall ------------------------------------------------------
  const FW: XY[] = [[-37.56, 12.71], [-38.61, 12.66], [-40.68, 12.66], [-41.65, 12.68], [-42.18, 9.13], [-43.86, 6.47], [-44.91, 3.65], [-45.31, 1.32], [-45.37, -1.19], [-44.96, -3.33], [-44.17, -5.63], [-42.96, -7.96], [-41.78, -9.59], [-41.18, -13.05], [-40.47, -13.1], [-38.13, -13.06], [-37.31, -13.11], [-37.42, -12.54], [-37.66, -10.51], [-39.44, -8.98], [-40.87, -6.99], [-41.91, -5.01], [-42.56, -2.79], [-42.84, -0.62], [-42.77, 1.49], [-42.18, 3.75], [-41.27, 5.77], [-39.85, 7.79], [-38.02, 9.58], [-37.69, 11.97]]
  const FW_H = 3.2
  extrude(granite, FW, 0, FW_H - 0.25, undefined, { caps: [false, false] })
  // A coping, slightly proud, as the trim colour.
  {
    const r = area2(FW) < 0 ? [...FW].reverse() : FW
    extrude(cap, r, FW_H - 0.25, FW_H, undefined, { caps: [false, true] })
  }
  // The field of gold stars on the concave face toward the plaza: indices
  // 18…29 are that face, running north. Panels sit 4 cm proud of it.
  {
    const face = FW.slice(18, 30)
    for (let i = 0; i < face.length - 1; i++) {
      const a = face[i], b = face[i + 1]
      const d = unit([b[0] - a[0], b[1] - a[1], 0])
      const o: XY = [d[1] * 0.04, -d[0] * 0.04] // to the right of travel = east, out of the wall
      const A: V3 = [a[0] + o[0], a[1] + o[1], 0.7], B: V3 = [b[0] + o[0], b[1] + o[1], 0.7]
      stars.quad(A, B, [B[0], B[1], 2.6], [A[0], A[1], 2.6])
    }
  }

  // ---- the two pavilions -----------------------------------------------------
  // Square triumphal arches open on all four sides, 13 m tall, an oculus in
  // the roof, and under each the baldacchino: four bronze columns with eagles
  // holding up a laurel wreath.
  const HX = 3.55, HY = 3.4, OPEN = 1.65, SPRING = 6.8, PLINTH = 0.6, WALL_TOP = 12.2, TOP = 13
  const pavilion = ([cx, cy]: XY) => {
    const at = (x: number, y: number, z: number): V3 => [cx + x, cy + y, z]
    prism(granite, rect(cx, cy, HX + 0.35, HY + 0.35), 0, PLINTH, 0.12)
    // Corner piers.
    for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
      const x0 = sx * OPEN, x1 = sx * HX, y0 = sy * OPEN, y1 = sy * HY
      const r: XY[] = [[cx + Math.min(x0, x1), cy + Math.min(y0, y1)], [cx + Math.max(x0, x1), cy + Math.min(y0, y1)],
        [cx + Math.max(x0, x1), cy + Math.max(y0, y1)], [cx + Math.min(x0, x1), cy + Math.max(y0, y1)]]
      extrude(granite, r, PLINTH, WALL_TOP, undefined, { caps: [false, false] })
    }
    // Spandrels over each opening, with the semicircular arch cut from below.
    const prof: XY[] = [[-OPEN, WALL_TOP], [-OPEN, SPRING]]
    for (let i = 1; i < 10; i++) {
      const a = Math.PI - (i / 10) * Math.PI
      prof.push([OPEN * Math.cos(a), SPRING + OPEN * Math.sin(a)])
    }
    prof.push([OPEN, SPRING], [OPEN, WALL_TOP])
    // North and south faces: through-thickness along y.
    for (const s of [-1, 1]) {
      extrude(granite, prof, OPEN, HY, (u, v, w) => at(u, s * w, v), { caps: [true, true] })
      extrude(granite, prof, OPEN, HX, (u, v, w) => at(s * w, u, v), { caps: [true, true] })
    }
    // Attic and cornice: a frame round the oculus, with a projecting string
    // course at the attic's foot.
    prism(cap, rect(cx, cy, HX + 0.12, HY + 0.12), 10.0, 10.3, 0.05, true)
    {
      const outer: V3[] = rect(cx, cy, HX + 0.08, HY + 0.08).map(([x, y]) => [x, y, WALL_TOP])
      const outerTop: V3[] = rect(cx, cy, HX, HY).map(([x, y]) => [x, y, TOP])
      granite.loft([outer.map(([x, y]) => [x, y, WALL_TOP] as V3), outer.map(([x, y]) => [x, y, TOP - 0.15] as V3), outerTop])
      // Roof with an oculus: the roof ring triangulated against a 16-gon.
      const n = 16, ro = 1.25
      const circ = (z: number): V3[] => Array.from({ length: n }, (_, i) => {
        const a = (i / n) * TAU - Math.PI / 4 - TAU / 32
        return [cx + ro * Math.cos(a), cy + ro * Math.sin(a), z]
      })
      const top = circ(TOP), sq = outerTop
      for (let i = 0; i < n; i++) {
        const j = (i + 1) % n
        const k = Math.floor(((i + 0.5) / n) * 4) // nearest square corner sector
        cap.tri(top[i], sq[(k + 0) % 4], top[j])
      }
      for (let k = 0; k < 4; k++) {
        const i = Math.round(((k + 1) / 4) * n) % n
        cap.tri(top[i], sq[k], sq[(k + 1) % 4])
      }
      // The oculus' drum down to the ceiling, and the ceiling under the roof.
      const low = circ(WALL_TOP - 0.2)
      granite.loft([top.slice().reverse(), low.slice().reverse()].map(r => r))
      const in4: V3[] = rect(cx, cy, OPEN, OPEN).map(([x, y]) => [x, y, WALL_TOP - 0.2])
      for (let i = 0; i < n; i++) {
        const j = (i + 1) % n
        const k = Math.floor(((i + 0.5) / n) * 4)
        granite.tri(low[i], low[j], in4[k % 4])
      }
      for (let k = 0; k < 4; k++) {
        const i = Math.round(((k + 1) / 4) * n) % n
        granite.tri(low[i], in4[(k + 1) % 4], in4[k])
      }
    }
    // Baldacchino.
    for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
      const px = sx * (OPEN - 0.35), py = sy * (OPEN - 0.35)
      tube(bronze, [at(px, py, PLINTH), at(px, py, 6.9)], [0.17, 0.15], [0.17, 0.15], 6, { crease: 60 })
      // The eagle: a body leaning in, wings raised toward the wreath.
      ellipsoid(bronze, at(px * 0.92, py * 0.92, 7.3), [0.3, 0.3, 0.45], 5, 3)
      const w0 = at(px * 0.85, py * 0.85, 7.5)
      const tip = at(px * 0.55, py * 0.55, 8.6)
      const side: V3 = unit([-py, px, 0])
      bronze.tri(plus(w0, scale(side, 0.55)), plus(w0, scale(side, -0.55)), tip)
      bronze.tri(plus(w0, scale(side, -0.55)), plus(w0, scale(side, 0.55)), tip)
    }
    // The wreath the eagles hold up, hanging in the middle of the vault.
    tube(bronze, Array.from({ length: 13 }, (_, i) => {
      const a = (i / 12) * TAU
      return at(1.0 * Math.cos(a), 1.0 * Math.sin(a), 8.7)
    }), Array(13).fill(0.16), Array(13).fill(0.16), 5, { capEnds: false })
  }
  pavilion(PAV.atlantic)
  pavilion(PAV.pacific)

  console.log({ granite: granite.triangles, cap: cap.triangles, bronze: bronze.triangles, stars: stars.triangles })
  await save('dc-wwii-memorial', 'National World War II Memorial', [
    // Kershaw granite reads a light warm grey in the daylight photos.
    { part: granite, material: finish('wwii-granite', 0xe0dbd2) },
    { part: cap, material: PALETTE.trim },
    // Dark bronze wreaths and eagles, a muted green-brown.
    { part: bronze, material: finish('wwii-bronze', 0x5f6e63) },
    // The gold stars of the Freedom Wall, seen together as a gold field.
    { part: stars, material: finish('wwii-gold-stars', 0xc7a865) },
  ], { bearing: 0, osm: 'way/574904167' }, 6500)
}
