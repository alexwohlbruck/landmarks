/**
 * The Chicago Picasso (Pablo Picasso, 1967), Daley Plaza, Chicago —
 * original procedural geometry, CC0-1.0.
 *
 *   bun generators/chi-picasso.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the centroid of the
 * OSM area way/124865476 (tourism=artwork, 41.883623, -87.629979), on the
 * plaza. The area's edges run at 89.6° / 179.5°, so the catalog bearing is
 * 359.5. The face looks south, towards Washington Street, with the Daley
 * Center behind it: the front photos have the Daley Center's Cor-ten frame
 * behind the sculpture, and the Mapillary frames from Washington Street
 * west of the plaza (looking east) show the face on the right, the south.
 *
 * Identity: a 15 m Cor-ten "head" of flat steel plates. From the front, a
 * pale long face plate with a narrow neck over a bell-shaped chest, framed
 * by two tall rounded lobes (the hair or ears) that meet at the top; between
 * the lobes and the neck a web of steel rods. From the side and back, the
 * lobes are one curved plate with a heart-shaped hole, bowed back like a
 * crescent, rising from a broad sloping base that people slide down.
 *
 * Form, all flat plates, each a closed slab with thickness:
 *  - plinth: the dark low block under the base, set back from its edges;
 *  - base: a solid whose top slopes from the low front edge up to the back,
 *    where its edge rises into the two shoulder humps the front views show;
 *  - chest, neck and face: one front-facing plate, its outline taken off
 *    the front photo (bell, diamond at the throat, snout widening to the
 *    forehead), with a narrow profile plate (the spine) behind it;
 *  - hair: two lobes joined at the top, outer and inner outlines off the
 *    front and back photos, bent back as they fall (the crescent the side
 *    views show);
 *  - web: per the brief, the rods are drawn as one thin flat plate per side,
 *    from the hair's inner edge to the spine, in a paler steel so the
 *    hole still reads as open.
 *
 * Evidence:
 *  - Published (Wikipedia, "Chicago Picasso"): 50 ft (15.2 m) tall,
 *    Cor-ten steel, 162 short tons.
 *  - OSM way/124865476: the artwork area, 10.3 m east-west x 6.3 m
 *    north-south. USGS NAIP shows a dark block of about 10 x 6 m there.
 *  - Photos (Wikimedia Commons): 20071027_Chicago_Picasso_with_kids.JPG
 *    (TonyTheTiger, public domain, front); Chicago_Picasso,_Loop,_Chicago,_IL
 *    .jpg (Bait30, public domain, front at night — the outline measurements);
 *    2004-09-07_1800x2400_chicago_picasso.jpg (J. Crocker, public domain,
 *    front-left three-quarter); Chicago_Picasso_at_Daley_Plaza,_July_2011
 *    _(6176191387).jpg (EightySixFilms, CC BY 2.0); Chicago_Picasso
 *    _(September_2024)_2 and _4 (Nairn McWilliams, CC BY-SA 2.0, back and
 *    back three-quarter: the heart-shaped hole and the base's back wall);
 *    1998-D027003 (Joe+Jeanette Archie, CC BY 2.0, profile from the west).
 *    Mapillary street frames on Washington Street for the orientation.
 *  - Colour: the weathered Cor-ten reads a dark brown with a grey cast;
 *    pulled lighter towards the palette.
 *
 * Measured off photos (±0.5 m): the outlines of the face, neck, chest,
 * lobes and shoulders, scaled to the published 15.2 m. Estimated: the
 * lobes' backward bend (from the side views), the base's slope, the
 * plinth's 0.9 m. The lobes are drawn symmetric; the real ones differ a
 * little. Invented: nothing.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { finish } from './palette'

// ── Shared plate helpers (also used by chi-flamingo) ─────────────────────
export type UV = [number, number]

const sub3 = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const crs = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const dot3 = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]

/** A triangle, wound so that it faces `want`. */
export function triFacing(p: Part, a: V3, b: V3, c: V3, want: V3) {
  if (dot3(crs(sub3(b, a), sub3(c, a)), want) >= 0) p.tri(a, b, c)
  else p.tri(a, c, b)
}

const area2 = (pts: UV[]) => pts.reduce((s, a, i) => { const b = pts[(i + 1) % pts.length]; return s + a[0] * b[1] - b[0] * a[1] }, 0)

/** Ear-clipping triangulation of a simple polygon; returns index triples. */
export function earcut(poly: UV[]): [number, number, number][] {
  const idx = poly.map((_, i) => i)
  if (area2(poly) < 0) idx.reverse()
  const out: [number, number, number][] = []
  const inside = (p: UV, a: UV, b: UV, c: UV) => {
    const s = (u: UV, v: UV, w: UV) => (v[0] - u[0]) * (w[1] - u[1]) - (v[1] - u[1]) * (w[0] - u[0])
    return s(a, b, p) >= -1e-12 && s(b, c, p) >= -1e-12 && s(c, a, p) >= -1e-12
  }
  let guard = 0
  while (idx.length > 3 && guard++ < 10000) {
    let cut = false
    for (let k = 0; k < idx.length; k++) {
      const i0 = idx[(k + idx.length - 1) % idx.length], i1 = idx[k], i2 = idx[(k + 1) % idx.length]
      const a = poly[i0], b = poly[i1], c = poly[i2]
      if ((b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]) <= 1e-12) continue
      if (idx.some((j) => j !== i0 && j !== i1 && j !== i2 && inside(poly[j], a, b, c))) continue
      out.push([i0, i1, i2])
      idx.splice(k, 1)
      cut = true
      break
    }
    if (!cut) break
  }
  if (idx.length === 3) out.push([idx[0], idx[1], idx[2]])
  return out
}

/**
 * A plate: a 2D outline extruded `t` thick through `map(u, v, w)`, w in
 * [-t/2, t/2]. `map` may bend the plate; faces are wound outward.
 */
export function plate(p: Part, poly: UV[], map: (u: number, v: number, w: number) => V3, t: number) {
  const ccw = area2(poly) > 0 ? poly : [...poly].reverse()
  const tris = earcut(ccw)
  const F = (q: UV) => map(q[0], q[1], t / 2), B = (q: UV) => map(q[0], q[1], -t / 2)
  for (const [i, j, k] of tris) {
    const n = sub3(F(ccw[i]), B(ccw[i]))
    triFacing(p, F(ccw[i]), F(ccw[j]), F(ccw[k]), n)
    triFacing(p, B(ccw[i]), B(ccw[k]), B(ccw[j]), [-n[0], -n[1], -n[2]])
  }
  for (let i = 0; i < ccw.length; i++) {
    const a = ccw[i], b = ccw[(i + 1) % ccw.length]
    const m: UV = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1
    const o: UV = [m[0] + ((b[1] - a[1]) / L) * 0.01, m[1] - ((b[0] - a[0]) / L) * 0.01]
    const out = sub3(map(o[0], o[1], 0), map(m[0], m[1], 0))
    triFacing(p, F(a), B(a), B(b), out)
    triFacing(p, F(a), B(b), F(b), out)
  }
}

/** Smooth a 2D outline through control points (Catmull-Rom), open or closed. */
export function spline(ctrl: UV[], per: number, closed = false): UV[] {
  const n = ctrl.length, out: UV[] = []
  const P = (i: number) => closed ? ctrl[(i + n) % n] : ctrl[Math.max(0, Math.min(n - 1, i))]
  const segs = closed ? n : n - 1
  for (let i = 0; i < segs; i++) for (let k = 0; k < per; k++) {
    const t = k / per, p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2)
    const f = (j: 0 | 1) => 0.5 * (2 * p1[j] + (-p0[j] + p2[j]) * t + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * t * t + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * t * t * t)
    out.push([f(0), f(1)])
  }
  if (!closed) out.push(ctrl[n - 1])
  return out
}

// ── The sculpture ────────────────────────────────────────────────────────
function build() {
  const steel = new Part(), web = new Part(), plinth = new Part(), face = new Part()
  const Z0 = 0.9 // plinth top: everything else is measured from here
  const H = 15.2 // published overall height

  // Plinth: the dark block under the base, inset from the base's edges.
  plate(plinth, [[-4.5, -2.3], [4.5, -2.3], [4.5, 2.3], [-4.5, 2.3]], (u, v, w) => [u, v, Z0 / 2 + w], Z0)

  // Base: top slopes from the front edge (y = -3) up to the back (y = +3),
  // whose height across the width makes the shoulder humps.
  {
    const xs = [-5.2, -4.8, -4.2, -3.6, -3.0, -2.2, -1.2, 0, 1.2, 2.2, 3.0, 3.6, 4.2, 4.8, 5.2]
    const back = (x: number) => {
      const a = Math.abs(x)
      const pts: UV[] = [[0, 2.2], [1.2, 2.3], [2.0, 2.9], [2.6, 4.1], [3.2, 4.65], [3.8, 4.7], [4.4, 4.0], [4.9, 2.6], [5.2, 1.3]]
      for (let i = 0; i < pts.length - 1; i++) if (a <= pts[i + 1][0]) {
        const t = (a - pts[i][0]) / (pts[i + 1][0] - pts[i][0])
        return pts[i][1] + t * (pts[i + 1][1] - pts[i][1])
      }
      return 1.4
    }
    const front = (x: number) => Math.min(1.0, back(x))
    const ys = [-3.0, -1.5, 0, 1.5, 3.0]
    // Slightly concave ramp: shallow at the front, steeper towards the back.
    const top = (x: number, y: number) => { const t = (y + 3) / 6; return Z0 + front(x) + (back(x) - front(x)) * Math.pow(t, 1.5) }
    for (let i = 0; i < xs.length - 1; i++) for (let j = 0; j < ys.length - 1; j++) {
      const a: V3 = [xs[i], ys[j], top(xs[i], ys[j])], b: V3 = [xs[i + 1], ys[j], top(xs[i + 1], ys[j])]
      const c: V3 = [xs[i + 1], ys[j + 1], top(xs[i + 1], ys[j + 1])], d: V3 = [xs[i], ys[j + 1], top(xs[i], ys[j + 1])]
      triFacing(steel, a, b, c, [0, 0, 1]); triFacing(steel, a, c, d, [0, 0, 1])
    }
    // Walls down to the plinth top (the base overhangs the plinth).
    const zb = Z0
    for (let i = 0; i < xs.length - 1; i++) for (const [y, s] of [[-3, -1], [3, 1]] as [number, number][]) {
      const a: V3 = [xs[i], y, zb], b: V3 = [xs[i + 1], y, zb]
      const c: V3 = [xs[i + 1], y, top(xs[i + 1], y)], d: V3 = [xs[i], y, top(xs[i], y)]
      triFacing(steel, a, b, c, [0, s, 0]); triFacing(steel, a, c, d, [0, s, 0])
    }
    for (let j = 0; j < ys.length - 1; j++) for (const [x, s] of [[-5.2, -1], [5.2, 1]] as [number, number][]) {
      const a: V3 = [x, ys[j], zb], b: V3 = [x, ys[j + 1], zb]
      const c: V3 = [x, ys[j + 1], top(x, ys[j + 1])], d: V3 = [x, ys[j], top(x, ys[j])]
      triFacing(steel, a, b, c, [s, 0, 0]); triFacing(steel, a, c, d, [s, 0, 0])
    }
    const u: V3[] = [[-5.2, -3, zb], [5.2, -3, zb], [5.2, 3, zb], [-5.2, 3, zb]]
    triFacing(steel, u[0], u[1], u[2], [0, 0, -1]); triFacing(steel, u[0], u[2], u[3], [0, 0, -1])
  }

  // Chest, neck and face: one plate facing south at y = FY. Right half
  // outline (x, height above the plinth), bottom to top, then mirrored.
  const FY = -1.9
  {
    const half: UV[] = [
      [2.1, 1.0], [2.05, 2.6], [1.85, 3.6], [1.45, 4.5], [0.9, 5.3], [0.38, 5.9],
      [0.32, 7.3], [0.85, 7.95], [0.32, 8.6], [0.36, 9.5],
      [0.62, 9.8], [0.55, 10.4], [0.6, 11.4], [0.85, 12.3], [1.35, 12.95], [1.85, 13.45], [1.7, 13.65], [0.9, 13.45],
    ]
    const top: UV = [0, 13.3]
    const outline: UV[] = [...half, top, ...half.slice().reverse().map(([x, z]): UV => [-x, z])]
    plate(steel, outline.filter(([, z]) => z <= 9.5).concat([[-0.36, 9.5]]).filter((q, i, a) => i === a.findIndex((r) => r[0] === q[0] && r[1] === q[1])), (u, v, w) => [u, FY - w, Z0 + v], 0.35)
    // The face itself, snout to forehead: the same steel, but it is the flat
    // plate square to the light in every front photo and reads paler than
    // the curved hair behind it, so it gets a lighter tone.
    const faceOutline = outline.filter(([, z]) => z >= 9.5)
    plate(face, faceOutline, (u, v, w) => [u, FY - 0.02 - w, Z0 + v], 0.35)
    // The spine behind it: a narrow profile plate, front to back.
    plate(steel, [[0, 4.5], [1.0, 5.5], [1.0, 12.4], [0.4, 13.2], [0, 13.2]], (u, v, w) => [w, FY + 0.15 + u, Z0 + v], 0.3)
  }

  // Hair: two lobes joined at the top. Front-view outlines (x, height above
  // the plinth), each bent back by `bend(z)`: low parts stand at the back,
  // the tops lean forward over the head, as in the side views.
  const bend = (z: number) => -1.3 + 2.4 * Math.cos((Math.PI / 2) * Math.max(0, Math.min(1, (z - 3.6) / (H - Z0 - 3.6))))
  // The lobes also sweep back towards their outer edges (a V in plan,
  // open to the front), which is why they read broad from the side too.
  const SWEEP = 0.75
  const outer = spline([[2.3, 3.6], [3.0, 6.0], [3.15, 9.0], [2.85, 11.6], [2.2, 13.4], [1.2, 14.25], [0.45, 14.2], [0.0, 13.75]], 3)
  const inner = spline([[0.0, 6.2], [1.0, 7.0], [1.75, 8.6], [1.95, 10.4], [1.7, 11.9], [1.05, 12.55], [0.45, 12.4], [0.0, 12.0]], 3)
  // Scale so the lobes' tops reach the published height.
  const topZ = Math.max(...outer.map((p) => p[1]))
  const k = (H - Z0) / topZ
  const outerS = outer.map(([x, z]): UV => [x, 3.6 + (z - 3.6) * k])
  const innerS = inner.map(([x, z]): UV => [x, 3.6 + (z - 3.6) * k])
  const hairMap = (s: number) => (u: number, v: number, w: number): V3 => [s * u, bend(v) + SWEEP * u + w, Z0 + v]
  for (const s of [1, -1]) {
    const lobe: UV[] = [...outerS, ...innerS.slice().reverse()]
    plate(steel, lobe, hairMap(s), 0.32)
  }

  // Web: the rods drawn as a thin plate per side, from the hair's inner
  // edge forward to the spine (x = 0, just behind the face plate).
  for (const s of [1, -1]) {
    const pts = innerS.filter(([, z]) => z < 12.4 * k)
    for (let i = 0; i < pts.length - 1; i++) {
      const [x0, z0] = pts[i], [x1, z1] = pts[i + 1]
      const a: V3 = [s * x0, bend(z0) + SWEEP * x0, Z0 + z0], b: V3 = [s * x1, bend(z1) + SWEEP * x1, Z0 + z1]
      const sa: V3 = [0, FY + 0.6, Z0 + z0], sb: V3 = [0, FY + 0.6, Z0 + z1]
      // Both sides, so it reads from the front and from behind.
      const n = crs(sub3(b, a), sub3(sa, a))
      triFacing(web, a, b, sb, n); triFacing(web, a, sb, sa, n)
      const m: V3 = [-n[0], -n[1], -n[2]]
      triFacing(web, a, b, sb, m); triFacing(web, a, sb, sa, m)
    }
  }

  return [
    { part: steel, material: finish('corten', 0x8b6d5a) },
    { part: face, material: finish('corten-face', 0xa58b7a) },
    { part: web, material: finish('corten-web', 0xb59e8e) },
    { part: plinth, material: finish('picasso-plinth', 0x5e5853) },
  ]
}

if (import.meta.main) {
  const parts = build()
  const triangles = parts.reduce((s, p) => s + p.part.triangles, 0)
  const glb = writeGlb('Chicago Picasso', parts, {
    frame: 'Y up, -Z north, +X east; metres; ground anchor', anchor: [41.883623, -87.629979], bearing: 359.5,
  })
  if (triangles > 5000 || glb.length > 250000) throw new Error(`Budget exceeded: ${triangles} triangles / ${glb.length} bytes`)
  const out = process.argv[2] ?? new URL('../models/chi-picasso.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}
