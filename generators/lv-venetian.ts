/**
 * The Venetian, Las Vegas: the street-front Venice replica (St Mark's
 * Campanile, the Rialto Bridge, the Doge's Palace, the clock tower) and the
 * hotel towers behind it, the three-winged Venetian tower and the U-shaped
 * Venezia tower, on the casino podium. Procedural, CC0-1.0.
 * bun generators/lv-venetian.ts
 *
 * The kit at the top (`prism`, `panels`, `box`, ...) is shared with
 * lv-palazzo.ts and lv-treasure-island.ts; the model itself is built only
 * when this file is run, not when it is imported.
 *
 * Map frame: x east, y north, z up, metres. Bearing 0: everything is drawn
 * in OSM's own orientation. The origin is the area centroid of the resort
 * outline (relation/7770314, outer way/115774497).
 *
 * Published (Wikipedia, "The Venetian Las Vegas"; Stubbins Associates and
 * WATG, 1999): the street front is modelled on the Doge's Palace with a
 * recreation of the Rialto Bridge and a 315 ft (96 m) replica of St Mark's
 * Campanile topped by Gabriel; the hotel tower is 35 storeys and 480 ft
 * (146 m; OSM 145); the 12-storey Venezia tower (2003) stands on the
 * 10-storey parking garage (OSM: 24 levels, 99 m).
 *
 * Measured, from OSM: the resort outline with its courtyard hole; the
 * Venetian tower (way/30618090), a west wing and two wings to the north-east
 * and south-east, each about 32 m wide; the Venezia tower and garage
 * (way/111322067), a U open to the north; the campanile's base
 * (way/43875964), 16.4 m square, turned 8.8 degrees; the small building at
 * the bridge's south-west foot (way/543728945). USGS NAIP (public domain)
 * gives the Doge's Palace block (30 x 65 m, west face on the outline), the
 * Rialto's position and axis (56 m long, 16 m wide, bearing 60), the
 * lagoon with the clock tower at its north end, and the white roofs.
 *
 * Photos (Wikimedia Commons):
 * - "The Venetian Las Vegas (3).jpg", Patrick Pelster, CC BY-SA 3.0 de, and
 *   "Venetian Las Vegas, NV.jpg", Ricky Barnard, CC BY 2.0: the street front
 *   and towers from the north and north-west, campanile proportions, the
 *   salmon walls with blue glass, cream crown and wing-end pavilions;
 * - "Campanile Tower at The Venetian, Las Vegas.jpg", Supercarwaar,
 *   CC BY-SA 4.0, and "Las Vegas. Campanile di San Marco del The Venetian
 *   Hotel.jpg", André Corboz, CC BY-SA 4.0: shaft, white belfry, red attic,
 *   green spire, gold angel, the base with its balustrade;
 * - "Rialto Bridge at the Venetian.jpg", Andrek02, CC0: the bridge over the
 *   drive, its arch, arcades and central portico;
 * - "The Venetian Hotel on the Strip ... LCCN2010630614", Carol M.
 *   Highsmith, public domain: the clock tower behind the lagoon;
 * - "Side of the Venetian Las Vegas's Replica of the Doge's Palace",
 *   Julian Lupyan, CC0, and "Las Vegas (Nevada, USA), The Venetian -- 2012
 *   -- 6331.jpg", Dietmar Rabich, CC BY-SA 4.0: the palace's two arcades,
 *   the pink-and-white upper wall, the tower's glass and stone.
 *
 * Estimated: the podium at 16 m; the Doge's Palace at 24 m with its arcades
 * at 0-6 and 6-12 m; the campanile's stages (shaft to 51 m, belfry, attic,
 * spire from 72 m) from the photos against the published 96 m, the shaft
 * drawn 15% broader than life (14.5 m) so it reads at phone size; the Rialto's
 * heights (arch 8 m, deck 10 m, portico 18 m); the clock tower (13 x 10 m,
 * 30 m) and its position; the red-roofed palazzo south of the Doge's Palace;
 * the crowns (cream above 133 m on the main tower, 90 m on Venezia) and
 * pavilions (14 m deep, 5 m above the roof). Left out: the canal water, the
 * lagoon columns, gondola poles, statues, signs and lettering.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

// ------------------------------------------------------------------ kit

export type XY = [number, number]

export const signedArea = (p: XY[]) => p.reduce((s, a, i) => {
  const b = p[(i + 1) % p.length]
  return s + a[0] * b[1] - b[0] * a[1]
}, 0) / 2
export const ccw = (p: XY[]): XY[] => (signedArea(p) < 0 ? [...p].reverse() : p)

/** Ear-clipping triangulation of a simple counter-clockwise polygon. */
export function triangulate(poly: XY[]): [number, number, number][] {
  const idx = poly.map((_, i) => i)
  const out: [number, number, number][] = []
  const cr = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inTri = (p: XY, a: XY, b: XY, c: XY) => cr(a, b, p) > 1e-9 && cr(b, c, p) > 1e-9 && cr(c, a, p) > 1e-9
  let guard = 0
  while (idx.length > 3 && guard++ < 100000) {
    let clipped = false
    for (let k = 0; k < idx.length; k++) {
      const i0 = idx[(k + idx.length - 1) % idx.length], i1 = idx[k], i2 = idx[(k + 1) % idx.length]
      const a = poly[i0], b = poly[i1], c = poly[i2]
      if (cr(a, b, c) <= 1e-9) continue
      if (idx.some((j) => j !== i0 && j !== i1 && j !== i2 && inTri(poly[j], a, b, c))) continue
      out.push([i0, i1, i2]); idx.splice(k, 1); clipped = true; break
    }
    if (!clipped) throw new Error('triangulation stuck')
  }
  out.push([idx[0], idx[1], idx[2]])
  return out
}

/** A frame: origin, then the u, v (plan) and w (extrusion) axes. */
export type Frame = { o: V3; u: V3; v: V3; w: V3 }
export const PLAN: Frame = { o: [0, 0, 0], u: [1, 0, 0], v: [0, 1, 0], w: [0, 0, 1] }
const at = (f: Frame, a: number, b: number, c: number): V3 => [
  f.o[0] + f.u[0] * a + f.v[0] * b + f.w[0] * c,
  f.o[1] + f.u[1] * a + f.v[1] * b + f.w[1] * c,
  f.o[2] + f.u[2] * a + f.v[2] * b + f.w[2] * c,
]
const handed = (f: Frame) => {
  const { u, v, w } = f
  return u[0] * (v[1] * w[2] - v[2] * w[1]) - u[1] * (v[0] * w[2] - v[2] * w[0]) + u[2] * (v[0] * w[1] - v[1] * w[0]) > 0
}
/** A plan frame turned `deg` counter-clockwise about (cx, cy). */
export function turned(cx: number, cy: number, deg: number, z = 0): Frame {
  const a = (deg * Math.PI) / 180
  return { o: [cx, cy, z], u: [Math.cos(a), Math.sin(a), 0], v: [-Math.sin(a), Math.cos(a), 0], w: [0, 0, 1] }
}
/** A vertical frame whose plan runs along `axis` (u) and up (v), extruded across (w). */
export function elevation(cx: number, cy: number, bearing: number): Frame {
  const a = (bearing * Math.PI) / 180
  const u: V3 = [Math.sin(a), Math.cos(a), 0]
  return { o: [cx, cy, 0], u, v: [0, 0, 1], w: [u[1], -u[0], 0] }
}

/**
 * A polygon in a frame's (u, v) plane extruded along w from w0 to w1:
 * sides in `wall`, ends in `top` (and `bottom`, if given).
 */
export function prism(wall: Part, top: Part | null, poly: XY[], w0: number, w1: number, f: Frame = PLAN, bottom: Part | null = null) {
  const ring = ccw(poly)
  const flip = !handed(f)
  const tri = (p: Part, a: V3, b: V3, c: V3) => (flip ? p.tri(c, b, a) : p.tri(a, b, c))
  const n = ring.length
  for (let i = 0; i < n; i++) {
    const a = ring[i], b = ring[(i + 1) % n]
    const a0 = at(f, a[0], a[1], w0), b0 = at(f, b[0], b[1], w0), a1 = at(f, a[0], a[1], w1), b1 = at(f, b[0], b[1], w1)
    tri(wall, a0, b0, b1); tri(wall, a0, b1, a1)
  }
  const tris = triangulate(ring)
  if (top) for (const [i, j, k] of tris) tri(top, at(f, ...ring[i], w1), at(f, ...ring[j], w1), at(f, ...ring[k], w1))
  if (bottom) for (const [i, j, k] of tris) tri(bottom, at(f, ...ring[k], w0), at(f, ...ring[j], w0), at(f, ...ring[i], w0))
}

/** A flat polygon in a frame's (u, v) plane at w, facing +w: flush openings and dials. */
export function flat(p: Part, poly: XY[], w: number, f: Frame) {
  prism(new Part(), p, poly, w - 0.01, w, f)
}

/** Cut every corner by `c` (a chamfer), skipping corners on short edges. */
export function chamfer(poly: XY[], c = 0.5): XY[] {
  const out: XY[] = []
  const n = poly.length
  for (let i = 0; i < n; i++) {
    const p = poly[(i + n - 1) % n], a = poly[i], q = poly[(i + 1) % n]
    const l0 = Math.hypot(a[0] - p[0], a[1] - p[1]), l1 = Math.hypot(q[0] - a[0], q[1] - a[1])
    const k = Math.min(c, l0 / 3, l1 / 3)
    out.push([a[0] + ((p[0] - a[0]) / l0) * k, a[1] + ((p[1] - a[1]) / l0) * k])
    out.push([a[0] + ((q[0] - a[0]) / l1) * k, a[1] + ((q[1] - a[1]) / l1) * k])
  }
  return out
}

/** Offset a polygon outward by d (inward if negative), mitred. */
export function offset(poly: XY[], d: number): XY[] {
  const r = ccw(poly), n = r.length
  return r.map((a, i) => {
    const p = r[(i + n - 1) % n], q = r[(i + 1) % n]
    const e0 = norm([a[0] - p[0], a[1] - p[1]]), e1 = norm([q[0] - a[0], q[1] - a[1]])
    const n0: XY = [e0[1], -e0[0]], n1: XY = [e1[1], -e1[0]]
    const m = norm([n0[0] + n1[0], n0[1] + n1[1]])
    const s = d / Math.max(0.3, m[0] * n0[0] + m[1] * n0[1])
    return [a[0] + m[0] * s, a[1] + m[1] * s] as XY
  })
}
const norm = (v: XY): XY => {
  const l = Math.hypot(v[0], v[1]) || 1
  return [v[0] / l, v[1] / l]
}

/** A plan rectangle centred on (cx, cy), w along u and d along v, turned `deg`. */
export function rect(cx: number, cy: number, w: number, d: number, deg = 0): XY[] {
  const a = (deg * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a)
  return ([[-w / 2, -d / 2], [w / 2, -d / 2], [w / 2, d / 2], [-w / 2, d / 2]] as XY[]).map(([x, y]) => [cx + x * c - y * s, cy + x * s + y * c])
}

/**
 * Window panels on the outward faces of a ring: one per bay, `group` metres
 * tall with `gap` of wall between groups, `out` proud of the wall. Edges
 * shorter than `minLen` (or rejected by `keep`) get none.
 */
export function panels(p: Part, ring: XY[], z0: number, z1: number, o: {
  bay?: number; pier?: number; group?: number; gap?: number; out?: number; minLen?: number; end?: number
  keep?: (a: XY, b: XY) => boolean; shape?: 'rect' | 'arch' | 'pointed'
} = {}) {
  const { bay = 7, pier = 2.4, group = z1 - z0, gap = 0, out = 0.05, minLen = 6, end = 1.5, keep, shape = 'rect' } = o
  const r = ccw(ring), n = r.length
  const rows = Math.max(1, Math.round((z1 - z0) / group)), gh = (z1 - z0) / rows
  for (let i = 0; i < n; i++) {
    const a = r[i], b = r[(i + 1) % n]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < minLen || (keep && !keep(a, b))) continue
    const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], nn: XY = [u[1], -u[0]]
    const count = Math.max(1, Math.floor((L - 2 * end) / bay))
    const step = (L - 2 * end) / count, w = Math.max(0.6, step - pier)
    for (let k = 0; k < count; k++) {
      const s = end + step * (k + 0.5)
      const P = (t: number, z: number): V3 => [a[0] + u[0] * (s + t) + nn[0] * out, a[1] + u[1] * (s + t) + nn[1] * out, z]
      for (let g = 0; g < rows; g++) {
        const zb = z0 + g * gh + gap / 2, zt = z0 + (g + 1) * gh - gap / 2
        if (shape === 'rect') { p.quad(P(-w / 2, zb), P(w / 2, zb), P(w / 2, zt), P(-w / 2, zt)); continue }
        // Arched or pointed top inside the same height: a semicircle, or two
        // arcs of radius 0.75 w meeting at a point (rise 0.71 w).
        const rise = shape === 'arch' ? w / 2 : w * 0.707
        const zs = zt - rise
        p.quad(P(-w / 2, zb), P(w / 2, zb), P(w / 2, zs), P(-w / 2, zs))
        const pts: V3[] = []
        if (shape === 'arch') {
          for (let j = 0; j <= 4; j++) {
            const t = Math.PI * (1 - j / 4)
            pts.push(P((Math.cos(t) * w) / 2, zs + Math.sin(t) * rise))
          }
        } else {
          const c = w / 4, R = 0.75 * w, phi = Math.acos(-c / R)
          for (let j = 0; j <= 2; j++) {
            const t = Math.PI + ((phi - Math.PI) * j) / 2
            pts.push(P(c + R * Math.cos(t), zs + R * Math.sin(t)))
          }
          for (let j = 1; j >= 0; j--) {
            const t = Math.PI + ((phi - Math.PI) * j) / 2
            pts.push(P(-(c + R * Math.cos(t)), zs + R * Math.sin(t)))
          }
        }
        // Left to right over the top runs clockwise seen from outside.
        for (let j = 1; j < pts.length - 1; j++) p.tri(pts[0], pts[j + 1], pts[j])
      }
    }
  }
}

/** A band ring `depth` proud of a polygon, between two heights (cornices, string courses). */
export function band(wall: Part, top: Part | null, ring: XY[], z0: number, z1: number, depth: number) {
  prism(wall, top, offset(ring, depth), z0, z1)
}

/** A pyramid over a rectangle in frame f, from w0 up to the apex at w1. */
export function pyramid(p: Part, poly: XY[], w0: number, w1: number, f: Frame = PLAN, apex?: XY) {
  const r = ccw(poly)
  const c: XY = apex ?? [r.reduce((s, q) => s + q[0], 0) / r.length, r.reduce((s, q) => s + q[1], 0) / r.length]
  const flip = !handed(f)
  for (let i = 0; i < r.length; i++) {
    const a = at(f, ...r[i], w0), b = at(f, ...r[(i + 1) % r.length], w0), t = at(f, ...c, w1)
    if (flip) p.tri(t, b, a)
    else p.tri(a, b, t)
  }
}

/** A circle as a polygon. */
export function circle(cx: number, cy: number, r: number, seg = 16, a0 = 0): XY[] {
  return Array.from({ length: seg }, (_, i) => {
    const a = a0 + (i / seg) * Math.PI * 2
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r] as XY
  })
}

/** A dome (quarter-circle profile) of radius r on a circle at height z. */
export function dome(p: Part, cx: number, cy: number, r: number, z: number, h = r, seg = 16, rings = 4) {
  let prev: V3[] | null = null
  for (let k = 0; k <= rings; k++) {
    const t = (k / rings) * (Math.PI / 2)
    const rr = Math.cos(t) * r, zz = z + Math.sin(t) * h
    const ring = circle(cx, cy, Math.max(rr, 1e-3), seg).map(([x, y]): V3 => [x, y, zz])
    if (prev) {
      for (let i = 0; i < seg; i++) {
        const j = (i + 1) % seg
        if (k === rings) p.tri(prev[i], prev[j], ring[i])
        else p.quad(prev[i], prev[j], ring[j], ring[i])
      }
    }
    prev = ring
  }
}

export function save(id: string, name: string, parts: { part: Part; material: { name: string; color: number; roughness?: number } }[], height: number, frame: string, maxTris = 5000) {
  const used = parts.filter((p) => p.part.triangles > 0)
  const triangles = used.reduce((n, { part }) => n + part.triangles, 0)
  if (triangles > maxTris) throw new Error(`Triangle budget exceeded: ${triangles}`)
  if (used.length > 6) throw new Error(`Too many materials: ${used.length}`)
  const glb = writeGlb(name, used, { license: 'CC0-1.0', height, frame })
  if (glb.length > 250000) throw new Error(`File budget exceeded: ${glb.length}`)
  const out = new URL(`../models/${id}.glb`, import.meta.url).pathname
  return Bun.write(out, glb).then(() => console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`))
}

// ---------------------------------------------------------------- model

if (import.meta.main) {
  const trim = new Part() // cream stone: podium, crowns, arcades, bridge, roofs
  const rose = new Part() // the salmon render of the towers and the palace's pink wall
  const win = new Part() // blue glass and openings
  const brick = new Part() // campanile brick, red tile roofs
  const cap = new Part() // the campanile's green spire
  const gold = new Part() // Gabriel

  // Resort outline, way/115774497 (outer of relation/7770314).
  const OUTLINE: XY[] = [
    [-102.7, 167.8], [-45.7, 164.7], [-33.3, 164.1], [106.6, 161.0], [102.3, 24.5], [101.7, 9.2], [100.0, -78.4], [99.7, -94.3],
    [99.6, -100.2], [89.0, -100.2], [77.8, -100.2], [47.0, -68.6], [46.8, -87.9], [51.7, -88.0], [51.5, -93.5], [55.0, -93.7],
    [54.8, -99.2], [57.4, -99.3], [57.2, -108.9], [95.9, -109.6], [95.4, -164.7], [95.3, -170.0], [95.2, -177.8], [95.1, -181.8],
    [47.3, -181.3], [-86.7, -180.0], [-86.6, -175.3], [-86.5, -168.8], [-86.3, -161.2], [-85.2, -99.0], [-85.0, -88.0],
    [-84.5, -66.1], [-84.0, -45.5], [-83.1, -11.1], [-110.9, -10.5], [-110.8, -8.2], [-110.7, -4.3], [-110.6, -1.2],
    [-110.1, 9.4], [-91.9, 8.9], [-91.8, 15.6], [-109.8, 16.1], [-109.1, 49.2], [-108.5, 81.4], [-88.3, 81.0], [-88.1, 86.0],
    [-99.4, 85.3], [-105.7, 116.0], [-108.5, 115.3], [-111.6, 110.0], [-133.6, 121.4], [-129.1, 130.2], [-126.7, 134.9], [-122.4, 134.6],
  ]
  const TOWER: XY[] = [
    [-80.1, -8.6], [15.2, -10.3], [24.6, -6.7], [80.8, 46.2], [102.3, 24.5], [54.6, -21.1], [54.3, -31.7], [100.0, -78.4],
    [77.8, -100.2], [47.0, -68.6], [24.7, -46.7], [15.9, -42.9], [-80.9, -40.7],
  ]
  const VENEZIA: XY[] = [
    [17.6, -89.8], [30.2, -89.8], [30.4, -86.8], [40.9, -87.0], [40.8, -89.9], [49.1, -89.9], [47.7, -163.7], [47.4, -176.5],
    [47.3, -181.3], [-86.7, -180.0], [-86.3, -161.2], [-85.2, -99.0], [-85.0, -88.0], [-80.8, -88.1], [-80.5, -83.0], [-60.5, -83.2],
    [-60.3, -88.4], [-56.5, -88.5], [-57.1, -137.0], [17.4, -138.1],
  ]

  // ---- podium: the casino and shops, white-roofed, 16 m, a hair inside the outline.
  const PODIUM = 16
  prism(trim, trim, offset(OUTLINE, -0.3), 0, PODIUM)

  // ---- the hotel towers: salmon render, blue glass in four-floor groups,
  // a cream crown with a row of tall windows and a cornice.
  function hotel(poly: XY[], base: number, crown: number, top: number, pav: XY[][], pavTop: number) {
    const body = chamfer(poly, 0.6)
    // Faces whose middle lies inside a pavilion are hidden: no panels there.
    const inside = (p: XY, r: XY[]) => {
      let c = false
      for (let i = 0, j = r.length - 1; i < r.length; j = i++)
        if ((r[i][1] > p[1]) !== (r[j][1] > p[1]) && p[0] < ((r[j][0] - r[i][0]) * (p[1] - r[i][1])) / (r[j][1] - r[i][1]) + r[i][0]) c = !c
      return c
    }
    const notInside = (a: XY, b: XY) => !pav.some((r) => inside([(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], offset(r, 0.3)))
    prism(rose, null, body, base, crown)
    prism(trim, trim, body, crown, top)
    band(trim, trim, body, top - 0.8, top + 0.4, 0.5)
    band(trim, null, body, crown - 0.6, crown + 0.6, 0.3)
    panels(win, body, base + 4, crown - 1, { bay: 7, pier: 3.8, group: 28, gap: 1.6, minLen: 8, keep: notInside })
    panels(win, body, crown + 2, top - 2.5, { bay: 9, pier: 4, minLen: 8, keep: notInside })
    // Wing-end pavilions: a little proud and taller, cream piers at the
    // corners and a cream pilaster (the name strip) up the middle of the end.
    for (const p0 of pav) {
      const p = chamfer(offset(p0, 0.35), 0.5)
      prism(rose, null, p, base, crown + 4)
      prism(trim, trim, p, crown + 4, pavTop)
      band(trim, trim, p, pavTop - 0.8, pavTop + 0.4, 0.5)
      panels(win, p, base + 4, crown + 3, { bay: 6, pier: 3.2, group: 28, gap: 1.6, minLen: 5, end: 3.2, keep: notInside })
      panels(win, p, crown + 6, pavTop - 2.5, { bay: 6, pier: 3, minLen: 5, end: 3.2, keep: notInside })
      const r = ccw(p)
      for (let i = 0; i < r.length; i++) {
        const a = r[i], b = r[(i + 1) % r.length]
        const L = Math.hypot(b[0] - a[0], b[1] - a[1])
        if (L < 5 || !notInside(a, b)) continue
        const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
        // Corner piers at both ends of every long face.
        for (const s of [1.4, L - 1.4]) {
          const c: XY = [a[0] + u[0] * s + n[0] * 0.25, a[1] + u[1] * s + n[1] * 0.25]
          prism(trim, trim, rect(c[0], c[1], 2.8, 0.5, (Math.atan2(u[1], u[0]) * 180) / Math.PI), base, crown + 4)
        }
      }
    }
  }
  // Pavilions at the three wing ends of the main tower, 14 m deep.
  const TP: XY[][] = [
    [[-80.9, -40.7], [-66.9, -41.0], [-66.1, -8.9], [-80.1, -8.6]],
    [[80.8, 46.2], [70.9, 36.3], [92.4, 14.6], [102.3, 24.5]],
    [[100.0, -78.4], [90.1, -68.5], [67.9, -90.3], [77.8, -100.2]],
  ].map((p) => ccw(p as XY[]))
  hotel(TOWER, PODIUM, 133, 146, TP, 151)
  // Venezia: the garage up to 36 m (salmon, cream string course), the tower above.
  const VP = [rect(-70.8, -95.5, 28.6, 15), rect(33.4, -96.9, 31.5, 14)]
  prism(rose, null, chamfer(VENEZIA, 0.6), PODIUM, 36)
  band(trim, null, chamfer(VENEZIA, 0.6), 34.5, 36.5, 0.35)
  hotel(VENEZIA, 36, 90, 99, VP, 104)
  // The Venezia courtyard deck on the garage roof.
  prism(trim, trim, [[-57.1, -137], [17.4, -138.1], [17.6, -89.8], [-56.5, -88.5]], PODIUM, 36)

  // ---- the Doge's Palace: two cream arcades under a pink wall with tall
  // pointed windows, a cornice, on the outline's west edge.
  const DOGE: XY[] = [[-109.9, 16.2], [-80, 16.2], [-80, 81.2], [-108.6, 81.2]]
  const dg = chamfer(DOGE, 0.4)
  prism(trim, null, dg, 0, 12)
  prism(rose, null, dg, 12, 24)
  band(trim, trim, dg, 23.2, 24.4, 0.35)
  band(trim, null, dg, 11.6, 12.4, 0.35)
  band(trim, null, dg, 5.6, 6.2, 0.25)
  const faces = (a: XY, b: XY) => !(a[0] === -80 && b[0] === -80) // not the east side, which faces the podium
  panels(win, dg, 0.4, 5.4, { bay: 3.9, pier: 1.1, minLen: 8, end: 0.8, keep: faces, shape: 'pointed' })
  panels(win, dg, 6.8, 10.8, { bay: 3.9, pier: 1.5, minLen: 8, end: 0.8, keep: faces })
  panels(win, dg, 14, 21, { bay: 9.5, pier: 6.3, minLen: 8, end: 3, keep: faces, shape: 'pointed' })

  // A red-roofed palazzo (Ca' d'Oro-like) between the palace and the bridge.
  const CA: XY[] = [[-110.6, -10.4], [-92, -10.4], [-92, 9.2], [-110.2, 9.2]]
  prism(rose, null, CA, 0, 18)
  band(trim, null, CA, 17.4, 18.2, 0.3)
  panels(win, CA, 3, 15, { bay: 4.2, pier: 1.8, group: 6, gap: 1.6, minLen: 8, keep: (a, b) => !(a[0] === -92 && b[0] === -92), shape: 'arch' })
  pyramid(brick, offset(CA, 0.4), 18.2, 22.5, PLAN, [-101.2, -0.6])
  prism(brick, null, offset(CA, 0.4), 18, 18.2)

  // ---- the clock tower (Torre dell'Orologio) at the lagoon's north end,
  // facing south: cream, a blue clock dial and blue upper panel, the bell
  // terrace on top.
  const CLK = turned(-118, 111.5, 0)
  prism(trim, trim, chamfer(rect(0, 0, 13, 10), 0.4), 0, 24, CLK)
  band(trim, trim, rect(-118, 111.5, 13, 10), 23.4, 24.6, 0.4)
  {
    const dial = circle(0, 14.5, 3.4, 12)
    // Flush on the south face (y = 106.5): a vertical frame looking south.
    const S: Frame = { o: [-118, 106.44, 0], u: [1, 0, 0], v: [0, 0, 1], w: [0, -1, 0] }
    flat(win, dial, 0.05, S)
    flat(win, rect(0, 20, 6.5, 4.6), 0.05, S)
    flat(win, [[-1.6, 0.2], [1.6, 0.2], [1.6, 4.6], [0, 6], [-1.6, 4.6]], 0.05, S) // the gate arch
    // The bell terrace: two piers carrying an arch with the bell.
    for (const x of [-4.2, 4.2]) prism(trim, trim, rect(-118 + x, 111.5, 2, 4), 24.6, 29, PLAN)
    prism(trim, trim, rect(-118, 111.5, 10.4, 4), 29, 30.4, PLAN)
    dome(gold, -118, 111.5, 1.5, 26.5, 2.2, 10, 3)
  }

  // ---- the Rialto Bridge over the drive: a single arch, two arcaded halves
  // under shallow gabled roofs, a central portico.
  {
    const cx = -138, cy = -15, brg = 60, half = 28, W = 16
    const deck = (s: number) => 10 - 4.2 * Math.pow(Math.abs(s) / half, 1.4)
    const E = elevation(cx, cy, brg) // u along the bridge, v up, w across
    const prof: XY[] = []
    const span = 20, rise = 8
    for (let i = 0; i <= 12; i++) {
      const s = -span + (2 * span * i) / 12
      prof.push([s, rise * Math.sqrt(Math.max(0, 1 - (s / span) ** 2))])
    }
    const body: XY[] = [[-half, 0], [-span, 0], ...prof.slice(1, -1).map(([s, z]) => [s, z] as XY), [span, 0], [half, 0]]
    for (let i = 8; i >= -8; i--) body.push([(i / 8) * half, deck((i / 8) * half)])
    prism(trim, trim, body.reverse(), -W / 2, W / 2, E, trim)
    // The arcades: one sloping block per half, full width, 5.5 m tall.
    for (const sgn of [-1, 1]) {
      const s0 = 3.6 * sgn, s1 = 25 * sgn
      const blk: XY[] = [[s0, deck(s0) - 0.2], [s1, deck(s1) - 0.2], [s1, deck(s1) + 5.5], [s0, deck(s0) + 5.5]]
      prism(trim, null, blk, -W / 2 + 0.3, W / 2 - 0.3, E)
      // Six arched openings on each side face.
      for (let k = 0; k < 6; k++) {
        const s = s0 + ((s1 - s0) * (k + 0.5)) / 6, z = deck(s) + 0.6
        for (const side of [-1, 1]) {
          const Fs: Frame = { o: at(E, s, 0, side * (W / 2 - 0.25)), u: side > 0 ? E.u : [-E.u[0], -E.u[1], 0], v: [0, 0, 1], w: side > 0 ? E.w : [-E.w[0], -E.w[1], 0] }
          flat(win, [[-1.2, z], [1.2, z], [1.2, z + 2.6], [0.85, z + 3.4], [0, z + 3.75], [-0.85, z + 3.4], [-1.2, z + 2.6]], 0.06, Fs)
        }
      }
      // Gabled roof along the slope, ridge on the centre line.
      const e = (s: number, side: number): V3 => at(E, s, deck(s) + 5.5, side * (W / 2 - 0.3 + 0.4))
      const rdg = (s: number): V3 => at(E, s, deck(s) + 7.4, 0)
      const [A, B] = sgn > 0 ? [s0, s1] : [s1, s0]
      const q = (p1: V3, p2: V3, p3: V3, p4: V3) => { trim.quad(p1, p2, p3, p4); trim.quad(p4, p3, p2, p1) }
      q(e(A, 1), e(B, 1), rdg(B), rdg(A))
      q(e(A, -1), e(B, -1), rdg(B), rdg(A))
      for (const s of [A, B]) { trim.tri(e(s, -1), e(s, 1), rdg(s)); trim.tri(rdg(s), e(s, 1), e(s, -1)) }
    }
    // Central portico, its pediments facing across the bridge.
    const P = turned(cx, cy, 90 - brg)
    prism(trim, trim, chamfer(rect(0, 0, 7.4, W + 0.6), 0.3), deck(0), 17.4, P)
    for (const side of [-1, 1]) {
      const Fp: Frame = { o: at(P, 0, side * (W / 2 + 0.3), 0), u: side > 0 ? P.u : [-P.u[0], -P.u[1], 0], v: [0, 0, 1], w: side > 0 ? P.v : [-P.v[0], -P.v[1], 0] }
      flat(win, [[-1.8, deck(0) + 0.4], [1.8, deck(0) + 0.4], [1.8, 13.4], [1.27, 14.7], [0, 15.2], [-1.27, 14.7], [-1.8, 13.4]], 0.06, Fp)
    }
    const ped: XY[] = [[-4, 17.4], [4, 17.4], [0, 19.6]]
    prism(trim, trim, ped, -W / 2 - 0.3, W / 2 + 0.3, { o: [cx, cy, 0], u: P.u, v: [0, 0, 1], w: P.v }, trim)
  }

  // ---- St Mark's Campanile: base with balustrade, brick shaft with
  // pilaster strips, white belfry with arches, red attic, green spire, Gabriel.
  {
    // Drawn 15% broader than life above the base, so the tower still reads
    // as a tower, not a line, at phone size.
    const K = 1.15
    const big = (f: Frame): Frame => ({ ...f, u: f.u.map((x) => x * K) as V3, v: f.v.map((x) => x * K) as V3 })
    const B = turned(-185.1, -27.7, 8.8), C = big(B)
    const sq = (s: number, c = 0.3) => chamfer(rect(0, 0, s, s), c)
    prism(trim, trim, sq(16.4, 0.4), 0, 7, B)
    prism(trim, null, sq(16.4, 0.4), 7, 8.2, B)
    prism(brick, brick, sq(12.6), 8.2, 51, C)
    // Shallow pilaster strips: four per face, as on the real tower.
    for (let side = 0; side < 4; side++) {
      const R = big(turned(-185.1, -27.7, 8.8 + side * 90))
      for (const x of [-4.6, -1.55, 1.55, 4.6]) prism(brick, null, rect(x, -6.3 - 0.12, 0.9, 0.3), 8.2, 50, R)
    }
    prism(trim, trim, sq(13.8, 0.4), 51, 53, C)
    prism(trim, null, sq(12.2), 53, 61.5, C)
    for (let side = 0; side < 4; side++) {
      const R = big(turned(-185.1, -27.7, 8.8 + side * 90))
      for (const x of [-4.2, -1.4, 1.4, 4.2]) {
        const Fb: Frame = { o: at(R, x, -6.1 - 0.06, 0), u: R.u, v: [0, 0, 1], w: [-R.v[0], -R.v[1], 0] }
        flat(win, [[-1, 54], [1, 54], [1, 59], [0.7, 59.7], [0, 60], [-0.7, 59.7], [-1, 59]], 0.06, Fb)
      }
    }
    prism(trim, trim, sq(13.8, 0.4), 61.5, 63.4, C)
    prism(brick, null, sq(12.2), 63.4, 70.8, C)
    for (let side = 0; side < 4; side++) {
      const R = big(turned(-185.1, -27.7, 8.8 + side * 90))
      for (const x of [-5.5, 5.5]) prism(trim, null, rect(x, -6.1 - 0.15, 1.2, 0.4), 63.4, 70.8, R)
    }
    prism(trim, trim, sq(13.4, 0.4), 70.8, 72.2, C)
    pyramid(cap, sq(12.4, 0.2), 72.2, 92.6, C, [0, 0])
    // Gabriel on a small gilded ball: a stylised figure with spread wings.
    dome(gold, -185.1, -27.7, 0.7, 92.3, 0.7, 8, 2)
    prism(gold, gold, rect(-185.1, -27.7, 0.7, 0.7), 92.9, 95.2, PLAN)
    prism(gold, gold, rect(-185.1, -27.7, 2.6, 0.35, 8.8), 94.2, 95.9, PLAN)
  }

  // The small building at the bridge's south-west foot, way/543728945.
  prism(trim, trim, [[-170.7, -34.1], [-168.2, -37.0], [-158.3, -37.4], [-156.2, -34.5], [-163.3, -23.6], [-168.1, -25.2]], 0, 6.5)

  await save('lv-venetian', 'The Venetian', [
    { part: trim, material: PALETTE.trim },
    { part: rose, material: finish('venetian-rose', 0xe2b39c) },
    { part: win, material: PALETTE.window },
    { part: brick, material: PALETTE.terracotta },
    { part: cap, material: PALETTE.copper },
    { part: gold, material: finish('venetian-gold', 0xd6b46c) },
  ], 151, 'Y up, -Z north, +X east, metres; origin at the relation/7770314 outline centroid; bearing 0', 6500)
}
