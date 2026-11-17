/**
 * N Seoul Tower (남산서울타워), Namsan, Seoul: procedural, CC0-1.0.
 * bun generators/seoul-n-seoul-tower.ts
 *
 * This file also exports the small geometry kit (lathe, prisms, polygon
 * extrusion with ear clipping, boxes) used by the other seoul-* models of
 * builder group B4; its own build runs only under `import.meta.main`.
 *
 * Map frame: x east, y north, z up, metres; bearing 0 (round tower, no
 * axis). The origin is the area centroid of the Tower Plaza outline
 * (OSM relation/16474080, outer way/1214950317), as the batch places every
 * model at its outline's centroid; the tower's axis (the centre of OSM
 * way/370286010 and the pod part way/1214950323) lies 1.1 m east and 5.1 m
 * south of it. y = 0 is the ground at the tower's foot on Namsan's summit;
 * elevation 0. The map's terrain could not be checked (Mapterhorn has no z15
 * tiles over Seoul): the plaza steps down the hill to the south and east, so
 * the map, which puts y = 0 on the lowest ground under the outline, may sink
 * the foot a few metres into the summit.
 *
 * Published:
 * - height 236.7 m from its base, top 479.7 m above sea level, on the 243 m
 *   summit (Seoul Metropolitan Government, mediahub.seoul.go.kr/archives/1210540;
 *   ko.wikipedia "N서울타워"); observatory at 135.6-135.9 m (CTBUH Skyscraper
 *   Center, building 9617; Structurae: 136 m).
 * - built 1969-1975 (architect Jang Jong-ryul), concrete shaft with a steel
 *   antenna mast; plaza rebuilt 2015.
 *
 * Measured from photos, scaled to the published 236.7 m (the level telephoto
 * from the Han River, "Namsan and Han River 2022.jpg", 4000 px original:
 * base at the plaza roof y 1060 px, tip y 313 px, 0.317 m/px; its pod top
 * comes out at 129-142 m, matching the published observatory height):
 * - shaft about 31-33 px wide: 9.8 m at the foot, drawn 9.8 -> 9.1 m;
 * - two open steel platforms round the shaft at 24.7 and 36.5 m, about
 *   19 m across, with a wider equipment drum between them;
 * - pod: underside from 98 m, rim 13 m radius at 102 m, body of stacked
 *   glazed levels to 129 m tapering to r 11, a roof shoulder, then the cap
 *   drum (r 7.5) to 142 m; pod width/shaft width 2.7 in both the river shot
 *   and the close photo from the plaza;
 * - antenna bands, also checked on "Seoul Tower (4394893276).jpg": red
 *   lattice 142-158 m, white 158-170 m with a platform at 165-169 m, red
 *   170-185, white 185-196, red 196-209, white/grey slender top to 236.7.
 * OSM: the glass drum at the foot (relation/5501624, r 13, 7 m) and the
 * plaza (relation/16474081, 4 m) are used as tagged; OSM's pod parts
 * (88-112 m) sit 10-20 m lower than the photos and the published observatory
 * height, so the photos are used. OSM's 2.8 m shaft radius is a marker, not
 * the shaft (photos give 9-10 m).
 *
 * Estimated: platform thickness and spokes; the cap's glass "petals" (the
 * green-tinted crown fins round the mast foot in the close photo, 12 drawn);
 * lattice member sizes; plaza wall treatment (one glazed band; the 2015
 * plaza is glass and white panels in the close photo).
 * Drawn bolder than real: the antenna mast (r 2.6 -> 1.1 m against roughly
 * 1.5 -> 0.5 m real) and its lattice legs, so it still reads at 80 px.
 * Left out: dishes, railings, lights, the love-lock fences.
 *
 * Night: the shaft is floodlit (coloured LED wash in reality; `_FLOODLIGHT`
 * here), pod and drum glazing are `window`, the petals `glass`.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 * - "Namsan and Han River 2022.jpg", Ox1997cow, CC BY-SA 3.0 (south, telephoto, level)
 *   https://commons.wikimedia.org/wiki/File:Namsan_and_Han_River_2022.jpg
 * - "Seoul Tower (4394893276).jpg", Christopher from Shanghai, CC BY 2.0 (north-west, antenna bands)
 *   https://commons.wikimedia.org/wiki/File:Seoul_Tower_(4394893276).jpg
 * - "Namsan Seoul Tower (49174492933).jpg", Matt Kieffer, CC BY-SA 2.0 (from the plaza: drum, platforms, pod)
 *   https://commons.wikimedia.org/wiki/File:Namsan_Seoul_Tower_(49174492933).jpg
 * - "N Seoul Tower from far.jpg", Devianagloria, CC BY-SA 4.0
 *   https://commons.wikimedia.org/wiki/File:N_Seoul_Tower_from_far.jpg
 * - "N Seoul Tower (13952097192).jpg", Eugene Lim, CC BY 2.0 (night, lit shaft)
 *   https://commons.wikimedia.org/wiki/File:N_Seoul_Tower_(13952097192).jpg
 * - "Seoul tower - panoramio - yamarhythm.jpg", yamarhythm, CC BY 3.0 (old plaza and drum, before 2015)
 *   https://commons.wikimedia.org/wiki/File:Seoul_tower_-_panoramio_-_yamarhythm.jpg
 * No look-only references used. No lidar, NAIP or terrain in Korea.
 * Doubts: the plaza's real massing (several storeys stepping down the slope)
 * is only the 4 m OSM block here; no photo of the plaza from above.
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

export const TAU = Math.PI * 2
export const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
export const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
export const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
export const unit = (a: V3): V3 => mul(a, 1 / (Math.hypot(...a) || 1))

/** A quad whose winding is chosen so it faces the average of `N`, with per-corner normals. */
export function face(p: Part, P: V3[], N: V3[]) {
  const f = cross(sub(P[1], P[0]), sub(P[2], P[0]))
  const avg = N.reduce(add, [0, 0, 0] as V3)
  const [a, b, c, d] = dot(f, avg) >= 0 ? [0, 1, 2, 3] : [0, 3, 2, 1]
  p.tri(P[a], P[b], P[c], undefined, undefined, undefined, [N[a], N[b], N[c]])
  p.tri(P[a], P[c], P[d], undefined, undefined, undefined, [N[a], N[c], N[d]])
}
/** A flat quad facing `n`. */
export const flat = (p: Part, P: V3[], n: V3) => face(p, P, [n, n, n, n])
/** A flat triangle facing `n`. */
export function flatTri(p: Part, a: V3, b: V3, c: V3, n: V3) {
  const f = cross(sub(b, a), sub(c, a))
  if (dot(f, n) >= 0) p.tri(a, b, c)
  else p.tri(a, c, b)
}

/**
 * A surface of revolution about the vertical axis through `c`, from a
 * profile of [r, z] points whose left-hand side is the outside (walls go
 * up, roofs go inward, undersides go outward). Bands meeting at under
 * `smooth` degrees shade smooth. `pick(band)` chooses each band's part.
 */
export function lathe(c: [number, number], profile: [number, number][], pick: (band: number) => Part | null, k: number, smooth = 40, a0 = 0) {
  const P = (r: number, a: number, z: number): V3 => [c[0] + r * Math.cos(a), c[1] + r * Math.sin(a), z]
  const bandN = profile.slice(0, -1).map(([r0, z0], b) => {
    const [r1, z1] = profile[b + 1]
    const er = r1 - r0, ez = z1 - z0, l = Math.hypot(er, ez) || 1
    return [ez / l, -er / l] as [number, number]
  })
  const cosLim = Math.cos((smooth * Math.PI) / 180)
  const vn = (b: number, end: 0 | 1): [number, number] => {
    const own = bandN[b], other = bandN[b + (end ? 1 : -1)]
    if (!other || own[0] * other[0] + own[1] * other[1] < cosLim) return own
    const s = [own[0] + other[0], own[1] + other[1]], l = Math.hypot(s[0], s[1])
    return [s[0] / l, s[1] / l]
  }
  for (let b = 0; b < profile.length - 1; b++) {
    const part = pick(b)
    if (!part) continue
    const [r0, z0] = profile[b], [r1, z1] = profile[b + 1]
    if (r0 === 0 && r1 === 0) continue
    const n0 = vn(b, 0), n1 = vn(b, 1)
    const N = (n: [number, number], a: number): V3 => unit([n[0] * Math.cos(a), n[0] * Math.sin(a), n[1]])
    for (let s = 0; s < k; s++) {
      const aa = a0 + (s / k) * TAU, ab = a0 + ((s + 1) / k) * TAU
      const q = [P(r0, aa, z0), P(r0, ab, z0), P(r1, ab, z1), P(r1, aa, z1)]
      const nn = [N(n0, aa), N(n0, ab), N(n1, ab), N(n1, aa)]
      if (r0 === 0) part.tri(q[0], q[2], q[3], undefined, undefined, undefined, [nn[0], nn[2], nn[3]])
      else if (r1 === 0) part.tri(q[0], q[1], q[2], undefined, undefined, undefined, [nn[0], nn[1], nn[2]])
      else face(part, q, nn)
    }
  }
}

/** Signed area of a 2D ring (positive counter-clockwise). */
export function area2(ring: [number, number][]) {
  let s = 0
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    s += a[0] * b[1] - b[0] * a[1]
  }
  return s / 2
}
export const ccw2 = (ring: [number, number][]) => (area2(ring) > 0 ? ring : [...ring].reverse())

/** Ear-clip a simple polygon (any winding) into index triples, counter-clockwise. */
export function earcut(ring: [number, number][]): [number, number, number][] {
  const pts = ccw2(ring)
  const flip = pts !== ring
  const idx = pts.map((_, i) => i)
  const out: [number, number, number][] = []
  const crossz = (a: number[], b: number[], c: number[]) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inside = (p: number[], a: number[], b: number[], c: number[]) =>
    crossz(a, b, p) >= -1e-9 && crossz(b, c, p) >= -1e-9 && crossz(c, a, p) >= -1e-9
  let guard = 0
  while (idx.length > 3 && guard++ < 10000) {
    let cut = false
    for (let i = 0; i < idx.length; i++) {
      const ia = idx[(i + idx.length - 1) % idx.length], ib = idx[i], ic = idx[(i + 1) % idx.length]
      const a = pts[ia], b = pts[ib], c = pts[ic]
      if (crossz(a, b, c) <= 1e-9) continue
      let ok = true
      for (const j of idx) {
        if (j === ia || j === ib || j === ic) continue
        if (inside(pts[j], a, b, c)) { ok = false; break }
      }
      if (!ok) continue
      out.push([ia, ib, ic])
      idx.splice(i, 1)
      cut = true
      break
    }
    if (!cut) break
  }
  if (idx.length === 3) out.push([idx[0], idx[1], idx[2]])
  // Map back to the caller's indices.
  const n = ring.length
  return flip ? out.map(([a, b, c]) => [n - 1 - a, n - 1 - b, n - 1 - c] as [number, number, number]) : out
}

/** A flat horizontal polygon at height z, facing up or down. */
export function polyCap(p: Part, ring: [number, number][], z: number, up: boolean) {
  for (const [a, b, c] of earcut(ring)) {
    const A: V3 = [ring[a][0], ring[a][1], z], B: V3 = [ring[b][0], ring[b][1], z], C: V3 = [ring[c][0], ring[c][1], z]
    flatTri(p, A, B, C, [0, 0, up ? 1 : -1])
  }
}
/** Vertical walls round a ring from z0 to z1, facing out. */
export function polyWalls(p: Part, ring: [number, number][], z0: number, z1: number) {
  const r = ccw2(ring)
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    const n: V3 = unit([b[1] - a[1], -(b[0] - a[0]), 0])
    flat(p, [[a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1]], n)
  }
}
/** A vertical prism over a polygon. */
export function prism(walls: Part, top: Part | null, ring: [number, number][], z0: number, z1: number, bottom = false) {
  polyWalls(walls, ring, z0, z1)
  if (top) polyCap(top, ring, z1, true)
  if (bottom) polyCap(walls, ring, z0, false)
}
/** Inset (positive) or outset a ring by d, by offsetting each edge (assumes no tiny edges). */
export function offsetRing(ring: [number, number][], d: number): [number, number][] {
  const r = ccw2(ring), n = r.length
  return r.map((p, i) => {
    const a = r[(i + n - 1) % n], b = r[(i + 1) % n]
    const e1 = unit([p[0] - a[0], p[1] - a[1], 0]), e2 = unit([b[0] - p[0], b[1] - p[1], 0])
    const n1 = [-e1[1], e1[0]], n2 = [-e2[1], e2[0]] // inward normals for ccw
    const bis = unit([n1[0] + n2[0], n1[1] + n2[1], 0])
    const cosh = bis[0] * n1[0] + bis[1] * n1[1]
    const k = d / Math.max(0.3, cosh)
    return [p[0] + bis[0] * k, p[1] + bis[1] * k] as [number, number]
  })
}
/** A box from centre c, unit axes d (length) and e (width), half-sizes, z0..z1. */
export function box(p: Part, c: V3, d: V3, e: V3, hd: number, he: number, z0: number, z1: number, bottom = true) {
  const at = (u: number, v: number): [number, number] => [c[0] + d[0] * u + e[0] * v, c[1] + d[1] * u + e[1] * v]
  prism(p, p, [at(-hd, -he), at(hd, -he), at(hd, he), at(-hd, he)], c[2] + z0, c[2] + z1, bottom)
}
/** A straight beam of square section `w` between two points, all faces flat. */
export function beam(p: Part, a: V3, b: V3, w: number) {
  const t = unit(sub(b, a))
  const ref: V3 = Math.abs(t[2]) > 0.9 ? [1, 0, 0] : [0, 0, 1]
  const u = mul(unit(cross(t, ref)), w / 2), v = mul(unit(cross(t, u)), w / 2)
  const corner = (o: V3, su: number, sv: number) => add(add(o, mul(u, su)), mul(v, sv))
  const sec = (o: V3) => [corner(o, -1, -1), corner(o, 1, -1), corner(o, 1, 1), corner(o, -1, 1)]
  const A = sec(a), B = sec(b)
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    const mid4 = mul(add(add(A[i], A[j]), add(B[i], B[j])), 0.25)
    const axisMid = mul(add(a, b), 0.5)
    // outward from the beam axis
    const n = unit(sub(mid4, axisMid))
    flat(p, [A[i], A[j], B[j], B[i]], n)
  }
  flat(p, A, mul(t, -1))
  flat(p, B, t)
}

/**
 * A square-section tube along a polyline, w across, its sections mitred at
 * the joints and capped only at the ends; `up` orients the section.
 */
export function tube(p: Part, pts: V3[], w: number, up: V3 = [0, 0, 1]) {
  const n = pts.length
  // The section's frame is carried along the path (parallel transport), so
  // it never twists where the path turns through the vertical.
  let prev: V3 | null = null
  const secs = pts.map((q, i) => {
    const t = unit(sub(pts[Math.min(n - 1, i + 1)], pts[Math.max(0, i - 1)]))
    let u: V3
    if (prev) u = sub(prev, mul(t, dot(prev, t)))
    else {
      u = cross(t, up)
      if (Math.hypot(...u) < 1e-3) u = cross(t, [1, 0, 0])
    }
    u = unit(u)
    prev = u
    u = mul(u, w / 2)
    const v = mul(unit(cross(u, t)), w / 2)
    return { q, s: [add(add(q, u), v), add(sub(q, u), v), sub(sub(q, u), v), sub(add(q, u), v)] as V3[] }
  })
  for (let i = 0; i < n - 1; i++) {
    const A = secs[i].s, B = secs[i + 1].s, axis = mul(add(pts[i], pts[i + 1]), 0.5)
    for (let k = 0; k < 4; k++) {
      const j = (k + 1) % 4
      const m = mul(add(add(A[k], A[j]), add(B[k], B[j])), 0.25)
      flat(p, [A[k], A[j], B[j], B[k]], unit(sub(m, axis)))
    }
  }
  flat(p, secs[0].s, unit(sub(pts[0], pts[1])))
  flat(p, secs[n - 1].s, unit(sub(pts[n - 1], pts[n - 2])))
}

// ===================================================================== build
function build() {
  const LON0 = 126.98818, LAT0 = 37.55117
  const KX = 111320 * Math.cos((LAT0 * Math.PI) / 180), KY = 110574
  const loc = ([lon, lat]: number[]): [number, number] => [(lon - LON0) * KX, (lat - LAT0) * KY]
  // Tower Plaza outline, OSM way/1214950317 (outer of relation/16474080).
  const PLAZA_LL = [[126.9879634, 37.551377], [126.9880019, 37.5512585], [126.9879201, 37.5512396], [126.9879281, 37.5512169], [126.9878132, 37.5511942], [126.9879165, 37.5509203], [126.9885776, 37.5510652], [126.9885695, 37.5511055], [126.9886267, 37.5511166], [126.9885867, 37.5512991], [126.9884853, 37.5512798], [126.9884619, 37.5513566], [126.988483, 37.5513613], [126.9884433, 37.5514825], [126.9883977, 37.5514743], [126.9883541, 37.5516006], [126.9882852, 37.551586], [126.9879571, 37.5515167], [126.987914, 37.5515076]]
  const raw = PLAZA_LL.map(loc)
  // Area centroid = the anchor.
  let A = 0, cx = 0, cy = 0
  for (let i = 0; i < raw.length; i++) {
    const [x0, y0] = raw[i], [x1, y1] = raw[(i + 1) % raw.length], k = x0 * y1 - x1 * y0
    A += k; cx += (x0 + x1) * k; cy += (y0 + y1) * k
  }
  A /= 2; cx /= 6 * A; cy /= 6 * A
  const plaza = raw.map(([x, y]) => [x - cx, y - cy] as [number, number])
  const towerLL = loc([126.98822197, 37.55119841])
  const T: [number, number] = [towerLL[0] - cx, towerLL[1] - cy]

  const white = new Part()  // shaft, rings, plaza walls
  const win = new Part()    // pod and drum glazing
  const red = new Part()    // antenna's red bands and lattice
  const dark = new Part()   // platforms, pod underside, lattice
  const glass = new Part()  // crown petals
  const roof = new Part()   // plaza roof, pod roofs

  // ---- Tower Plaza: the OSM block, 4 m, with a glazed band and a roof terrace.
  const PH = 4
  prism(white, null, plaza, 0, PH)
  polyCap(roof, offsetRing(plaza, 0.6), PH - 0.25, true)
  // parapet top and inner face
  {
    const inner = offsetRing(plaza, 0.6), outer = ccw2(plaza)
    for (let i = 0; i < outer.length; i++) {
      const j = (i + 1) % outer.length
      flat(white, [[outer[i][0], outer[i][1], PH], [outer[j][0], outer[j][1], PH], [inner[j][0], inner[j][1], PH], [inner[i][0], inner[i][1], PH]], [0, 0, 1])
      const a = inner[i], b = inner[j], n: V3 = unit([-(b[1] - a[1]), b[0] - a[0], 0])
      flat(white, [[a[0], a[1], PH - 0.25], [b[0], b[1], PH - 0.25], [b[0], b[1], PH], [a[0], a[1], PH]], n)
    }
    // glazed band on every wall longer than 4 m
    for (let i = 0; i < outer.length; i++) {
      const a = outer[i], b = outer[(i + 1) % outer.length]
      const L = Math.hypot(b[0] - a[0], b[1] - a[1])
      if (L < 4) continue
      const t = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: V3 = [t[1], -t[0], 0]
      const p0 = [a[0] + t[0] * 0.8 + n[0] * 0.05, a[1] + t[1] * 0.8 + n[1] * 0.05]
      const p1 = [b[0] - t[0] * 0.8 + n[0] * 0.05, b[1] - t[1] * 0.8 + n[1] * 0.05]
      flat(win, [[p0[0], p0[1], 0.4], [p1[0], p1[1], 0.4], [p1[0], p1[1], 3.2], [p0[0], p0[1], 3.2]], n)
    }
  }

  // ---- The glass drum at the foot (OSM relation/5501624: r 13, 7 m).
  lathe(T, [[13, PH], [13, 6.2]], () => win, 32)
  lathe(T, [[13, 6.2], [13.3, 6.3], [13.3, 7.0], [13.0, 7.2], [5.2, 7.2]], (b) => (b === 3 ? roof : white), 32)

  // ---- The shaft, white concrete, slight taper.
  const shaftR = (z: number) => 4.9 - (0.35 * (z - 7)) / 91
  lathe(T, [[5.2, 7.2], [shaftR(7.5), 7.6], [shaftR(98), 98]], () => white, 24, 50)

  // ---- The two open platforms and the equipment drum between them.
  lathe(T, [[5.75, 25.6], [5.75, 35.6]], () => white, 24)
  for (const z of [24.7, 36.5]) {
    lathe(T, [[shaftR(z), z - 0.5], [9.3, z - 0.5], [9.3, z + 0.45], [9.05, z + 0.55], [shaftR(z), z + 0.55]], (b) => (b === 3 ? roof : dark), 24)
    // radial steel ribs under the grating
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * TAU + TAU / 24, d: V3 = [Math.cos(a), Math.sin(a), 0]
      beam(dark, [T[0] + d[0] * shaftR(z), T[1] + d[1] * shaftR(z), z - 2.2], [T[0] + d[0] * 9.1, T[1] + d[1] * 9.1, z - 0.5], 0.45)
    }
  }

  // ---- The pod: underside dish, stacked glazed levels with white rings,
  //      roof shoulder, cap drum.
  const K = 36
  // Radii from the river telephoto: 28.5 m across at the rim, the upper
  // glazed level drawn in to 24 m.
  lathe(T, [[shaftR(98), 97.6], [9.0, 99.6], [13.6, 101.4], [14.2, 101.9]], () => dark, K, 30)
  const pod: [number, number, Part][] = [
    // [r, z top, part of the band below]
    [14.2, 103.6, white],
    [13.95, 103.6, white], [13.95, 107.0, win], [14.25, 107.0, white], [14.25, 108.3, white], [13.8, 108.3, white],
    [13.8, 112.0, win], [14.0, 112.0, white], [14.0, 113.3, white], [13.4, 113.3, white],
    [13.4, 118.5, win], [13.55, 118.5, white], [13.55, 119.9, white], [13.0, 119.9, white],
    [12.0, 127.0, win], [12.2, 127.0, white], [12.2, 128.4, white], [8.4, 129.5, roof],
  ]
  {
    const prof: [number, number][] = [[14.2, 101.9]]
    const parts: Part[] = []
    for (const [r, z, p] of pod) { prof.push([r, z]); parts.push(p) }
    lathe(T, prof, (b) => parts[b], K, 20)
  }
  // Cap drum: the top restaurant level, glazed, under a white roof.
  lathe(T, [[8.4, 129.5], [7.6, 129.7], [7.6, 135.6], [7.9, 135.8], [7.9, 136.6], [6.0, 138.6], [4.6, 141.6], [4.6, 142.2], [0, 142.2]],
    (b) => [white, win, white, white, roof, white, white, roof][b], 32, 20)
  // The crown of glass petals round the mast foot, leaning out.
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * TAU, d: V3 = [Math.cos(a), Math.sin(a), 0], e: V3 = [-Math.sin(a), Math.cos(a), 0]
    const at = (r: number, s: number, z: number): V3 => [T[0] + d[0] * r + e[0] * s, T[1] + d[1] * r + e[1] * s, z]
    const n = unit(add(d, [0, 0, -0.35]))
    const q = [at(6.9, -1.5, 136.6), at(6.9, 1.5, 136.6), at(8.4, 1.9, 141.0), at(8.4, -1.9, 141.0)]
    flat(glass, q, n)
    flat(glass, [q[0], q[3], q[2], q[1]], mul(n, -1))
  }

  // ---- Antenna. Lower part a steel lattice: four legs, ring girders and
  //      X-braces round a solid core, red to 154 m and white to 170 m (river
  //      telephoto); then the banded mast, about 4.5 m across at 185 m.
  const LZ0 = 142.2, LZ1 = 170
  const legR = (z: number) => 4.4 - ((z - LZ0) / (LZ1 - LZ0)) * 1.6
  const corner = (k: number, z: number): V3 => {
    const a = (k / 4) * TAU + TAU / 8, r = legR(z)
    return [T[0] + r * Math.cos(a), T[1] + r * Math.sin(a), z]
  }
  const RED_TOP = 154.2
  for (let k = 0; k < 4; k++) {
    beam(red, corner(k, LZ0), corner(k, RED_TOP), 0.95)
    beam(white, corner(k, RED_TOP), corner(k, LZ1), 0.9)
  }
  const ringZ = [142.7, 148.4, 154.2, 159.6, 164.9, 169.6]
  for (const z of ringZ) for (let k = 0; k < 4; k++) beam(z <= RED_TOP ? red : white, corner(k, z), corner((k + 1) % 4, z), 0.55)
  for (let g = 0; g < ringZ.length - 1; g++)
    for (let k = 0; k < 4; k++) {
      const p = ringZ[g] < RED_TOP ? red : white
      beam(p, corner(k, ringZ[g]), corner((k + 1) % 4, ringZ[g + 1]), 0.42)
      beam(p, corner((k + 1) % 4, ringZ[g]), corner(k, ringZ[g + 1]), 0.42)
    }
  lathe(T, [[1.8, LZ0], [1.7, RED_TOP]], () => red, 8)
  lathe(T, [[1.7, RED_TOP], [1.6, LZ1]], () => white, 8)
  // Mast bands: [z top, radius at top, part of the band below].
  const bands: [number, number, Part][] = [
    [169.4, 4.2, dark], [170.6, 4.2, dark], [170.6, 2.5, dark],   // platform
    [182.0, 2.45, red], [194.5, 2.35, white],
    [194.5, 3.4, dark], [195.5, 3.4, dark], [195.5, 2.15, dark],   // platform
    [208.0, 2.05, red], [214.0, 1.9, white], [230.0, 1.35, red],
    [236.7, 0.35, white], [236.7, 0, white],
  ]
  {
    const prof: [number, number][] = [[2.5, 169.4]]
    const parts: Part[] = []
    for (const [z, r, p] of bands) { prof.push([r, z]); parts.push(p) }
    lathe(T, prof, (b) => parts[b], 12, 20)
  }

  // ------------------------------------------------------------- output ---
  const shaftLit = (p: V3, n: V3) => (p[2] > 7 && p[2] < 98 && n[2] < 0.7 ? 1 - 0.25 * (p[2] / 98) : p[2] > 98 && p[2] < 145 ? 0.4 : 0)
  const parts = [
    { part: white, material: { ...PALETTE.trim, floodlight: shaftLit } },
    { part: win, material: { ...PALETTE.window, color: 0x7f93a3 } },
    { part: red, material: finish('mast-red', 0xc85a4f) },
    { part: dark, material: finish('tower-steel', 0x5c636b) },
    { part: glass, material: { ...PALETTE.glass, color: 0x9cc7bd } },
    { part: roof, material: PALETTE.roof },
  ]
  const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
  if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
  const glb = writeGlb('N Seoul Tower', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
    bearing: 0, elevation: 0, height: 236.7,
  })
  if (glb.length > 250_000) throw new Error(`Size budget exceeded: ${glb.length} bytes`)
  const out = new URL('../models/seoul-n-seoul-tower.glb', import.meta.url).pathname
  Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes; anchor ${(LON0 + cx / KX).toFixed(7)} ${(LAT0 + cy / KY).toFixed(7)}; tower at ${T[0].toFixed(2)},${T[1].toFixed(2)}`)
}

if (import.meta.main) build()
