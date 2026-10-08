/**
 * Wynn Las Vegas: the curved bronze-glass hotel tower (2005, DeRuyter
 * Butler with Jon Jerde). Procedural, CC0-1.0.
 * bun generators/lv-wynn.ts
 *
 * Also the kit shared by this batch's curved towers (Encore,
 * Fontainebleau, Resorts World, Trump): arc slabs, bevelled prisms, floor
 * stripes and window bands. Importing this file builds nothing; running it
 * writes models/lv-wynn.glb.
 *
 * The Wynn's own header is below the kit.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, windowVariant } from './palette'

// ================================================================ the kit

export type XY = [number, number]

export const area = (poly: XY[]) =>
  poly.reduce((s, p, i) => {
    const q = poly[(i + 1) % poly.length]
    return s + p[0] * q[1] - q[0] * p[1]
  }, 0) / 2
export const ccw = (poly: XY[]): XY[] => (area(poly) < 0 ? [...poly].reverse() : poly)
const rad = (d: number) => (d * Math.PI) / 180
export const polar = (c: XY, r: number, deg: number): XY => [c[0] + r * Math.cos(rad(deg)), c[1] + r * Math.sin(rad(deg))]

/** Ear-clipping triangulation of a simple counter-clockwise ring. */
export function triangulate(poly: XY[]): [number, number, number][] {
  const idx = poly.map((_, i) => i)
  const out: [number, number, number][] = []
  const cr = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inside = (p: XY, a: XY, b: XY, c: XY) => cr(a, b, p) > 1e-9 && cr(b, c, p) > 1e-9 && cr(c, a, p) > 1e-9
  let guard = 0
  while (idx.length > 3 && guard++ < 100000) {
    let clipped = false
    for (let k = 0; k < idx.length; k++) {
      const i0 = idx[(k + idx.length - 1) % idx.length], i1 = idx[k], i2 = idx[(k + 1) % idx.length]
      const a = poly[i0], b = poly[i1], c = poly[i2]
      if (cr(a, b, c) <= 1e-9) continue
      if (idx.some((j) => j !== i0 && j !== i1 && j !== i2 && inside(poly[j], a, b, c))) continue
      out.push([i0, i1, i2])
      idx.splice(k, 1)
      clipped = true
      break
    }
    if (!clipped) idx.splice(1, 1) // only collinear leftovers remain
  }
  if (idx.length === 3) out.push([idx[0], idx[1], idx[2]])
  return out
}

/** A flat cap over a simple ring at height z. */
export function cap(part: Part, poly: XY[], z: number, up = true) {
  const ring = ccw(poly)
  for (const [a, b, c] of triangulate(ring)) {
    const A: V3 = [...ring[a], z], B: V3 = [...ring[b], z], C: V3 = [...ring[c], z]
    if (up) part.tri(A, B, C)
    else part.tri(C, B, A)
  }
}

/**
 * Mitred inward offset of a counter-clockwise ring by d: the ring a
 * bevel's top edge runs round. Fine for the gentle corners used here.
 */
export function inset(poly: XY[], d: number): XY[] {
  const n = poly.length
  return poly.map((p, i) => {
    const a = poly[(i + n - 1) % n], b = poly[(i + 1) % n]
    const e1 = norm([p[0] - a[0], p[1] - a[1]]), e2 = norm([b[0] - p[0], b[1] - p[1]])
    const n1: XY = [-e1[1], e1[0]], n2: XY = [-e2[1], e2[0]] // left = inward for ccw
    const m = norm([n1[0] + n2[0], n1[1] + n2[1]])
    const k = d / Math.max(0.35, m[0] * n1[0] + m[1] * n1[1])
    return [p[0] + m[0] * k, p[1] + m[1] * k]
  })
}
export const norm = (v: XY): XY => {
  const l = Math.hypot(v[0], v[1]) || 1
  return [v[0] / l, v[1] / l]
}

/** Cut every convex corner of a ccw ring by c (the soft vertical edges). */
export function chamfer(poly: XY[], c: number): XY[] {
  const n = poly.length, out: XY[] = []
  for (let i = 0; i < n; i++) {
    const a = poly[(i + n - 1) % n], p = poly[i], b = poly[(i + 1) % n]
    const la = Math.hypot(p[0] - a[0], p[1] - a[1]), lb = Math.hypot(b[0] - p[0], b[1] - p[1])
    const turn = (p[0] - a[0]) * (b[1] - p[1]) - (p[1] - a[1]) * (b[0] - p[0])
    const sharp = turn / (la * lb) > 0.2 // turning more than ~12°
    if (!sharp || la < 3 * c || lb < 3 * c) { out.push(p); continue }
    out.push([p[0] + (a[0] - p[0]) * c / la, p[1] + (a[1] - p[1]) * c / la])
    out.push([p[0] + (b[0] - p[0]) * c / lb, p[1] + (b[1] - p[1]) * c / lb])
  }
  return out
}

/**
 * A ring extruded from z0 to z1, its walls in `wall` and its top in `top`,
 * with a bevel of `b` round the top edge (and the convex vertical corners
 * cut by `c`). No bottom: everything stands on the ground or on a podium.
 */
export function prism(wall: Part, top: Part | null, poly: XY[], z0: number, z1: number, b = 0.5, c = 0.5) {
  const r = c > 0 ? chamfer(ccw(poly), c) : ccw(poly)
  const lift = (ring: XY[], z: number) => ring.map(([x, y]): V3 => [x, y, z])
  if (b > 0 && z1 - z0 > 2 * b) {
    const ri = inset(r, b)
    wall.loft([lift(r, z0), lift(r, z1 - b)])
    ;(top ?? wall).loft([lift(r, z1 - b), lift(ri, z1)])
    if (top) cap(top, ri, z1)
  } else {
    wall.loft([lift(r, z0), lift(r, z1)])
    if (top) cap(top, r, z1)
  }
}

/** An axis-aligned or rotated box as a ring: centre, half-sizes, angle (deg, ccw from +x). */
export function boxRing(c: XY, hu: number, hv: number, deg = 0): XY[] {
  const u: XY = [Math.cos(rad(deg)), Math.sin(rad(deg))], v: XY = [-u[1], u[0]]
  return ([[-1, -1], [1, -1], [1, 1], [-1, 1]] as XY[]).map(([a, b]) => [c[0] + u[0] * hu * a + v[0] * hv * b, c[1] + u[1] * hu * a + v[1] * hv * b])
}

/**
 * A strip standing `off` proud of the wall over the polyline `pts` (wall on
 * the strip's left as you walk the line, i.e. a ccw ring's own edges),
 * from z0 to z1: a floor stripe, or a window panel when z1 − z0 is large.
 */
export function strip(part: Part, pts: XY[], z0: number, z1: number, off = 0.05) {
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i], b = pts[i + 1]
    const t = norm([b[0] - a[0], b[1] - a[1]]), n: XY = [t[1], -t[0]]
    const p: XY = [a[0] + n[0] * off, a[1] + n[1] * off], q: XY = [b[0] + n[0] * off, b[1] + n[1] * off]
    part.quad([p[0], p[1], z0], [q[0], q[1], z0], [q[0], q[1], z1], [p[0], p[1], z1])
  }
}

/** Points along an arc from a0 to a1 degrees (either direction), n segments. */
export function arc(c: XY, r: number, a0: number, a1: number, n: number): XY[] {
  return Array.from({ length: n + 1 }, (_, i) => polar(c, r, a0 + (a1 - a0) * i / n))
}

/**
 * The plan of a curved slab: the band between radii r0 (concave face) and
 * r1 (convex face) about c, from a0 to a1 degrees (a0 < a1), as a ccw
 * ring: the convex face first, then the concave face back.
 */
export function crescent(c: XY, r0: number, r1: number, a0: number, a1: number, n: number): XY[] {
  return [...arc(c, r1, a0, a1, n), ...arc(c, r0, a1, a0, n)]
}

/**
 * Floor stripes on both curved faces of a crescent, every `step` metres
 * from z0 to z1, each `h` tall, stopping `trim` metres short of each end so
 * they stay inside the face (STYLE.md: nothing past a corner).
 */
export function faceStripes(part: Part, c: XY, r0: number, r1: number, a0: number, a1: number, n: number,
  z0: number, z1: number, step: number, h: number, trim = 1.5) {
  for (let z = z0; z + h <= z1 + 1e-6; z += step) {
    strip(part, arc(c, r1, a0 + trim / r1 * 180 / Math.PI, a1 - trim / r1 * 180 / Math.PI, n), z, z + h)
    strip(part, arc(c, r0, a1 - trim / r0 * 180 / Math.PI, a0 + trim / r0 * 180 / Math.PI, n), z, z + h)
  }
}

export const triangleCount = (parts: Array<{ part: Part }>) => parts.reduce((s, { part }) => s + part.triangles, 0)

/** Write the GLB, checking the budgets. */
export async function save(id: string, name: string, parts: Array<{ part: Part; material: any }>, height: number, frame: string, maxTris = 5000) {
  const triangles = triangleCount(parts)
  console.log(parts.map((p) => `${p.material.name} ${p.part.triangles}`).join(', '))
  if (triangles > maxTris) throw new Error(`Triangle budget exceeded: ${triangles}`)
  const glb = writeGlb(name, parts, { license: 'CC0-1.0', height, frame })
  if (glb.length > 250000) throw new Error(`File budget exceeded: ${glb.length}`)
  const out = new URL(`../models/${id}.glb`, import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}

// ================================================================ the Wynn and Encore family

/**
 * The bronze glass shared by Wynn and Encore. The real glass reads dark
 * copper-brown, flaring gold in low sun; pulled up to the palette's
 * lightness per STYLE.md so it reads as "the bronze one" without being a
 * dark hole among the pale extrusions.
 */
export const BRONZE = windowVariant(2, 0x97765f)
/** The pale gold floor lines. */
export const LINE = { ...PALETTE.trim, name: 'trim' }

export type WynnTower = {
  c: XY; r0: number; r1: number; a0: number; a1: number; n: number
  H: number
  /** the projecting bay centred on each end face: width, depth, extra height */
  bay: { w: number; d: number; dh: number }
  stripes: { z0: number; step: number; h: number; top: number }
}

/**
 * A Wynn-family tower: a crescent slab of bronze glass striped with pale
 * floor lines every two storeys on both curved faces, its ends cut square
 * and each carrying a narrower projecting bay that rises a little above the
 * roof. From the oblique views the set-back strips beside the bay read as
 * the dark vertical slots that make the ends look like separate slabs.
 */
export function wynnTower(t: WynnTower, glass: Part, line: Part, roof: Part) {
  prism(glass, roof, crescent(t.c, t.r0, t.r1, t.a0, t.a1, t.n), 0, t.H, 0.5, 0.5)
  faceStripes(line, t.c, t.r0, t.r1, t.a0, t.a1, t.n, t.stripes.z0, t.H - t.stripes.top, t.stripes.step, t.stripes.h)
  const rm = (t.r0 + t.r1) / 2
  for (const [a, sgn] of [[t.a0, -1], [t.a1, 1]] as const) {
    // the bay: a box on the end face, tangent-aligned, half embedded
    const p = polar(t.c, rm, a)
    const tang: XY = [-Math.sin(rad(a)) * sgn, Math.cos(rad(a)) * sgn]
    const ctr: XY = [p[0] + tang[0] * (t.bay.d - 2) / 2, p[1] + tang[1] * (t.bay.d - 2) / 2]
    prism(glass, roof, boxRing(ctr, t.bay.w / 2, (t.bay.d + 2) / 2, a), 0, t.H + t.bay.dh, 0.4, 0.4)
  }
}

// ================================================================ Wynn Las Vegas

/*
 * Map frame: x east, y north, z up, metres. Bearing 0: the plan is drawn in
 * OSM's own orientation. The origin is the area centroid of the tower's
 * outline, way/205501268 (36.126665, -115.165516).
 *
 * Published (Wikipedia, "Wynn Las Vegas"): opened 2005; the hotel tower is
 * 45 storeys (numbered to 60, skipping the 40s), 614 ft (187 m); a curved
 * slab of bronze glass. OSM tags height=187, building:colour=brown,
 * building:material=mirror.
 *
 * Measured, from OSM way/205501268: both curved faces fit circles about one
 * centre (−224, −38) within 0.7 m, radius 225 m (the concave west face,
 * towards the Strip) and 248.5 m (the convex east face, towards the golf
 * course), so the slab is 23.5 m deep and runs from −18.05° to 37.3° about
 * that centre, 229 m along its middle. Both ends are square to the curve,
 * and each carries a bay about 10 m wide standing about 3 m proud of the
 * end face (the outline's steps at its two ends). The USGS NAIP orthophoto
 * (public domain) confirms the crescent and the bays on the roof.
 *
 * Photos (Wikimedia Commons):
 * - "Encore-wynn-towers.JPG", HoppingRabbit34, CC BY-SA 3.0: from the golf
 *   course to the east, the convex face: dark bronze, pale floor lines
 *   about every two storeys (22 of them), a plain band at the top;
 * - "Wynn Casino, Las Vegas, 2005.jpg", Gabriel Millos, CC BY-SA 2.0: from
 *   the south-west, the concave face and the south end, whose set-back
 *   sides read as a dark slot beside a narrower end slab;
 * - "Las Vegas, view from the Encore towards the Wynn - panoramio.jpg",
 *   Scorewith German, CC BY 3.0: from the north, the convex face in sunrise
 *   light and the north end bay;
 * - "Wynn and Encore from Las vegas Monorail.jpg", Mikerussell,
 *   CC BY-SA 3.0: from the east, the end slots;
 * - "Encore in Las Vegas (4096504781).jpg", John Fowler, CC BY 2.0: the
 *   concave face from the Strip, gold in low sun, lines on it;
 * - "The Wynn (2337297024).jpg", Wolfgang Staudt, CC BY 2.0: close up, the
 *   lines are thin gold bands on the bronze.
 *
 * Estimated: the bays' width, depth and their 3 m rise above the roof (from
 * the outline and the photos, not published); the line spacing, drawn
 * every 12 m (three storeys) so the lines stay clean at phone size where
 * the real ones are every two storeys, and their start and stop heights;
 * the bevel sizes. The signature
 * sign on the faces is lettering and left out, as are the podium, the
 * Lake of Dreams and its "mountain", which are separate in OSM.
 */
if (import.meta.main) {
  const glass = new Part(), line = new Part(), roof = new Part()
  wynnTower({
    c: [-224, -38], r0: 225, r1: 248.5, a0: -18.05, a1: 37.3, n: 22,
    H: 187, bay: { w: 11, d: 3.5, dh: 3 },
    stripes: { z0: 14, step: 12, h: 1.3, top: 9 },
  }, glass, line, roof)
  await save('lv-wynn', 'Wynn Las Vegas', [
    { part: glass, material: BRONZE },
    { part: line, material: LINE },
    { part: roof, material: PALETTE.roof },
  ], 190, 'Y up, -Z north, +X east, metres; origin at the way/205501268 centroid; bearing 0')
}
