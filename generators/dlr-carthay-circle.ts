/**
 * The Carthay Circle Theatre (Carthay Circle Restaurant), Disney California
 * Adventure — procedural, CC0-1.0, no textures.
 * bun generators/dlr-carthay-circle.ts
 *
 * Map frame: x east, y north, z up, metres, bearing 0, origin at the centroid
 * of the OSM outline way/338063157 (-117.9189217, 33.8073827). The building
 * is square to the compass; only the tower is turned, an octagon with a corner
 * (not a face) pointing north-west at Carthay Circle, the V marquee wrapped
 * round that corner.
 *
 * A Spanish Colonial Revival recreation of the 1926 Los Angeles theatre:
 * white stucco, the octagonal tower in the north-west re-entrant corner, a
 * flat-roofed main block with a stepped parapet and finials, and two lower
 * wings with red tile pent roofs — the lounge wing with its terrace to the
 * north and the arcade wing to the west.
 *
 * Evidence
 * - OSM (measured): outline way/338063157 (height=14, roof flat); the main
 *   block way/338063109 and the tower way/338063116, both building:part
 *   with no height. The tower ring is ~7.0 m across, centred (-8.7, 9.95).
 *   The arcades in front of the two wings are separate building=roof ways,
 *   way/336940997 (north, untagged height) and way/336948504 (west,
 *   height=5.2); the model draws both at 5.2 m and replaces them.
 * - USGS NAIP orthophoto (public domain): flat pale main roof; red tile strips
 *   along the north wing (south half) and the west wing (west half); blue
 *   awnings beyond them; the tower at the north-west corner of the main roof.
 * - Published: none found for the Disney tower's height. Wikipedia says only
 *   that it is slightly smaller than the 1926 original.
 * - Photos (Wikimedia Commons), heights scaled off the 7.0 m tower:
 *     "Buena Vista Street Carthay Circle.JPG", Crd637, CC BY-SA 3.0 — from the
 *       north-west, square to the tower's corner; the main scale photo
 *     "Carthay circle theatre disney.jpg", HarshLight, CC BY 2.0 — from the west
 *     "Carthay Circle Restaurant.jpg", Freddo, CC BY-SA 4.0 — north wing and terrace
 *     "Carthay Circle Restaurant, Disney California Adventure.jpg", Contributor19, CC BY 4.0
 *     "Carthay Circle Restaurant (Disney California Adventure Park) July 2023.JPG", Benoît Prieur, CC0
 *     "Carthay Circle Theatre (28099405680).jpg", HarshLight, CC BY 2.0 — belfry detail
 *       (2015 Diamond Celebration banners, not modelled)
 *
 * Estimated: the tower's stages, scaled from the Crd637 photo against its
 * ~7 m width with the horizon at eye height — shaft to 20 m, belfry cornice
 * 25.2 m, lantern 27.8 m, dome 29 m, finial 30.4 m (so ~30 m overall, ±2 m;
 * HarshLight's photo from the west gives ~28 m). The shaft is drawn 6.7 m
 * across the flats plus its pilasters, a little inside the OSM ring. The
 * wings (loggias with 7.4 m eaves rising to 9.8–10 m against the main block,
 * arcades 5.2 m with terrace parapets) and the parapet finials (16 m) are
 * scaled from the same photos. The blue terrace awnings follow the 2023
 * photos and the orthophoto; older photos show umbrellas instead. The
 * rooftop plant boxes are read off NAIP, their heights guessed. Invented: the window rhythm on the south and east walls,
 * which no licensed photo shows; the belfry's checker tilework drawn as one
 * blue panel with a gold diamond per face; the marquee's ironwork crest as a
 * half-disc. Balconies, railings, lettering and the scroll consoles at the
 * shaft top are left out (the bell-shaped transition stands in for them).
 */
import { Part, cross, len, sub, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const stone = new Part(), roof = new Part(), tile = new Part()
const win = new Part(), blue = new Part(), gold = new Part()

type XY = [number, number]
const unit = (v: V3): V3 => { const l = len(v) || 1; return [v[0] / l, v[1] / l, v[2] / l] }
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]

/** A triangle wound to face `n` (flat) or its corner normals. */
function tri(p: Part, a: V3, b: V3, c: V3, n?: V3 | V3[]) {
  const f = cross(sub(b, a), sub(c, a))
  if (len(f) < 1e-9) return
  const N = n === undefined ? undefined : Array.isArray(n[0]) ? (n as V3[]) : [n as V3, n as V3, n as V3]
  const ref = N ? unit([N[0][0] + N[1][0] + N[2][0], N[0][1] + N[1][1] + N[2][1], N[0][2] + N[1][2] + N[2][2]]) : f
  if (dot(f, ref) >= 0) p.tri(a, b, c, undefined, undefined, undefined, N)
  else p.tri(a, c, b, undefined, undefined, undefined, N && [N[0], N[2], N[1]])
}
function quad(p: Part, a: V3, b: V3, c: V3, d: V3, n?: V3 | V3[]) {
  const N = n === undefined ? undefined : Array.isArray(n[0]) ? (n as V3[]) : [n as V3, n as V3, n as V3, n as V3]
  tri(p, a, b, c, N && [N[0], N[1], N[2]])
  tri(p, a, c, d, N && [N[0], N[2], N[3]])
}

// ---------------------------------------------------------------------------
// Polygons.

const area2 = (pts: XY[]) => pts.reduce((s, a, i) => { const b = pts[(i + 1) % pts.length]; return s + a[0] * b[1] - b[0] * a[1] }, 0)
const ccw = (pts: XY[]) => (area2(pts) < 0 ? [...pts].reverse() : pts)

/** Ear-clipping triangulation of a simple counter-clockwise polygon. */
function earcut(pts: XY[]): [number, number, number][] {
  const idx = pts.map((_, i) => i), out: [number, number, number][] = []
  const ar = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inside = (p: XY, a: XY, b: XY, c: XY) => ar(a, b, p) > 1e-9 && ar(b, c, p) > 1e-9 && ar(c, a, p) > 1e-9
  let guard = 0
  while (idx.length > 3 && guard++ < 10000) {
    let clipped = false
    for (let i = 0; i < idx.length; i++) {
      const ia = idx[(i + idx.length - 1) % idx.length], ib = idx[i], ic = idx[(i + 1) % idx.length]
      const a = pts[ia], b = pts[ib], c = pts[ic]
      if (ar(a, b, c) <= 1e-9) continue
      if (idx.some((j) => j !== ia && j !== ib && j !== ic && inside(pts[j], a, b, c))) continue
      out.push([ia, ib, ic]); idx.splice(i, 1); clipped = true; break
    }
    if (!clipped) break
  }
  if (idx.length === 3) out.push([idx[0], idx[1], idx[2]])
  return out
}

/** Grow a counter-clockwise polygon outward by d (negative shrinks), mitred. */
function offset(pts: XY[], d: number): XY[] {
  const n = pts.length
  return pts.map((p, i) => {
    const a = pts[(i + n - 1) % n], b = pts[(i + 1) % n]
    const e1 = unit([p[0] - a[0], p[1] - a[1], 0]), e2 = unit([b[0] - p[0], b[1] - p[1], 0])
    const n1: XY = [e1[1], -e1[0]], n2: XY = [e2[1], -e2[0]]
    const k = 1 + n1[0] * n2[0] + n1[1] * n2[1]
    return [p[0] + (d * (n1[0] + n2[0])) / k, p[1] + (d * (n1[1] + n2[1])) / k]
  })
}

/**
 * A prism over a polygon: flat walls, a rounded bevel rolling over the top
 * edge, and a lid (in `lidPart`) over the inset ring.
 */
function prism(p: Part, poly: XY[], z0: number, z1: number, o: { bt?: number; lid?: Part; bottom?: boolean } = {}) {
  const pts = ccw(poly), bt = o.bt ?? 0.35, n = pts.length
  const zt = z1 - bt
  const inner = bt > 0 ? offset(pts, -bt) : pts
  for (let i = 0; i < n; i++) {
    const a = pts[i], b = pts[(i + 1) % n]
    const nn = unit([b[1] - a[1], a[0] - b[0], 0])
    quad(p, [a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], zt], [a[0], a[1], zt], nn)
    if (bt > 0) {
      const ia = inner[i], ib = inner[(i + 1) % n]
      quad(p, [a[0], a[1], zt], [b[0], b[1], zt], [ib[0], ib[1], z1], [ia[0], ia[1], z1], [nn, nn, [0, 0, 1], [0, 0, 1]])
    }
  }
  const lid = o.lid ?? p
  for (const [i, j, k] of earcut(inner)) tri(lid, [inner[i][0], inner[i][1], z1], [inner[j][0], inner[j][1], z1], [inner[k][0], inner[k][1], z1], [0, 0, 1])
  if (o.bottom) for (const [i, j, k] of earcut(pts)) tri(p, [pts[i][0], pts[i][1], z0], [pts[k][0], pts[k][1], z0], [pts[j][0], pts[j][1], z0], [0, 0, -1])
}

/** A frame on a wall: u runs along the wall from `a` to `b`, the face looks out along `n`. */
type Wall = { a: XY; t: XY; n: XY; at: (u: number, z: number, out?: number) => V3 }
function wall(a: XY, b: XY): Wall {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  const t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [t[1], -t[0]]
  return { a, t, n, at: (u, z, out = 0) => [a[0] + t[0] * u + n[0] * out, a[1] + t[1] * u + n[1] * out, z] }
}
const nrm = (w: Wall): V3 => [w.n[0], w.n[1], 0]
/** A flat panel on a wall, `out` proud of it. */
function panel(p: Part, w: Wall, u0: number, u1: number, z0: number, z1: number, out = 0.04) {
  quad(p, w.at(u0, z0, out), w.at(u1, z0, out), w.at(u1, z1, out), w.at(u0, z1, out), nrm(w))
}
/** A round-headed opening: a panel up to the springing, then a semicircle. */
function arch(p: Part, w: Wall, u0: number, u1: number, z0: number, spring: number, out = 0.04, seg = 8) {
  panel(p, w, u0, u1, z0, spring, out)
  const r = (u1 - u0) / 2, c = u0 + r
  for (let k = 0; k < seg; k++) {
    const A = Math.PI - (k / seg) * Math.PI, B = Math.PI - ((k + 1) / seg) * Math.PI
    tri(p, w.at(c, spring, out), w.at(c + r * Math.cos(A), spring + r * Math.sin(A), out), w.at(c + r * Math.cos(B), spring + r * Math.sin(B), out), nrm(w))
  }
}
/** A diamond on a wall. */
function diamond(p: Part, w: Wall, u: number, z: number, h: number, out = 0.05) {
  quad(p, w.at(u, z - h, out), w.at(u + h, z, out), w.at(u, z + h, out), w.at(u - h, z, out), nrm(w))
}
/** A square post with a pyramid cap: a finial or pinnacle. */
function finial(p: Part, cx: number, cy: number, h: number, z0: number, z1: number, tip: number, cap: Part = p) {
  const q = (s: number, z: number): V3[] => [[cx - s, cy - s, z], [cx + s, cy - s, z], [cx + s, cy + s, z], [cx - s, cy + s, z]]
  const a = q(h, z0), b = q(h, z1), c = q(h * 1.25, z1), d = q(h * 1.25, z1 + h * 0.5)
  const ns: V3[] = [[0, -1, 0], [1, 0, 0], [0, 1, 0], [-1, 0, 0]]
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    quad(p, a[i], a[j], b[j], b[i], ns[i])
    quad(p, c[i], c[j], d[j], d[i], ns[i])
    quad(p, b[i], b[j], c[j], c[i], [0, 0, -1])
    const top: V3 = [cx, cy, tip]
    tri(cap, d[i], d[j], top, unit(cross(sub(d[j], d[i]), sub(top, d[i]))))
  }
}

// ---------------------------------------------------------------------------
// Rings about a vertical axis: n corners, the first at `phase` (radians,
// counter-clockwise from east), `r` measured across the flats.

const TC: XY = [-8.7, 9.95]   // the tower's centre (OSM way/338063116)
const OCT_PHASE = 0            // corners at 0°, 45°, … so one points north-west

function corner(n: number, k: number, r: number, phase: number, c: XY = TC): XY {
  const R = r / Math.cos(Math.PI / n), a = phase + (2 * Math.PI * k) / n
  return [c[0] + R * Math.cos(a), c[1] + R * Math.sin(a)]
}
/**
 * Loft a polygonal ring through a profile of (r, z) stations. Each face is
 * flat across, but shaded smoothly up the profile, so a bell or dome rolls.
 */
function revolve(p: Part, n: number, phase: number, prof: [number, number][], o: { smooth?: boolean; c?: XY; capTop?: Part | null } = {}) {
  const c = o.c ?? TC
  const slope = (k: number): [number, number] => {
    const a = prof[Math.max(0, k - 1)], b = prof[Math.min(prof.length - 1, k + 1)]
    const dr = b[0] - a[0], dz = b[1] - a[1]
    const l = Math.hypot(dr, dz) || 1
    return [dz / l, -dr / l] // (out, up)
  }
  for (let k = 0; k < prof.length - 1; k++) {
    const [r0, z0] = prof[k], [r1, z1] = prof[k + 1]
    const s0 = slope(k), s1 = slope(k + 1)
    for (let i = 0; i < n; i++) {
      const j = i + 1
      const a0 = corner(n, i, r0, phase, c), b0 = corner(n, j, r0, phase, c)
      const a1 = corner(n, i, r1, phase, c), b1 = corner(n, j, r1, phase, c)
      const fa = phase + (2 * Math.PI * (i + 0.5)) / n
      const at = (ang: number, s: [number, number]): V3 => unit([Math.cos(ang) * s[0], Math.sin(ang) * s[0], s[1]])
      const ai = phase + (2 * Math.PI * i) / n, aj = phase + (2 * Math.PI * j) / n
      const N: V3[] = o.smooth
        ? [at(ai, s0), at(aj, s0), at(aj, s1), at(ai, s1)]
        : [at(fa, s0), at(fa, s0), at(fa, s1), at(fa, s1)]
      if (r1 < 1e-6) tri(p, [a0[0], a0[1], z0], [b0[0], b0[1], z0], [c[0], c[1], z1], [N[0], N[1], N[2]])
      else quad(p, [a0[0], a0[1], z0], [b0[0], b0[1], z0], [b1[0], b1[1], z1], [a1[0], a1[1], z1], N)
    }
  }
  const [rt, zt] = prof[prof.length - 1]
  if (o.capTop !== null && rt > 1e-6) {
    const cap = o.capTop ?? p
    for (let i = 1; i < n - 1; i++) {
      const A = corner(n, 0, rt, phase, c), B = corner(n, i, rt, phase, c), C = corner(n, i + 1, rt, phase, c)
      tri(cap, [A[0], A[1], zt], [B[0], B[1], zt], [C[0], C[1], zt], [0, 0, 1])
    }
  }
}
/** A wall frame on face f of an octagon of flats radius r (face between corners f and f+1). */
function octFace(f: number, r: number, c: XY = TC): Wall {
  return wall(corner(8, f, r, OCT_PHASE, c), corner(8, f + 1, r, OCT_PHASE, c))
}
/**
 * An octagonal shaft whose corners carry pilaster strips standing `proud`
 * of the faces, `w` wide on each side of the corner, as on the real tower.
 */
function pilasterShaft(p: Part, r: number, z0: number, z1: number, w: number, proud: number, taper = 0) {
  const ringAt = (rr: number, z: number): V3[] => {
    const pts: V3[] = []
    for (let k = 0; k < 8; k++) {
      const V = corner(8, k, rr, OCT_PHASE), P = corner(8, k - 1, rr, OCT_PHASE), N = corner(8, k + 1, rr, OCT_PHASE)
      const tp = unit([V[0] - P[0], V[1] - P[1], 0]), tn = unit([N[0] - V[0], N[1] - V[1], 0])
      const np: XY = [tp[1], -tp[0]], nn: XY = [tn[1], -tn[0]]
      const k2 = 1 + np[0] * nn[0] + np[1] * nn[1]
      const A: XY = [V[0] - tp[0] * w, V[1] - tp[1] * w]
      const B: XY = [V[0] + tn[0] * w, V[1] + tn[1] * w]
      pts.push([A[0], A[1], z], [A[0] + np[0] * proud, A[1] + np[1] * proud, z],
        [V[0] + (proud * (np[0] + nn[0])) / k2, V[1] + (proud * (np[1] + nn[1])) / k2, z],
        [B[0] + nn[0] * proud, B[1] + nn[1] * proud, z], [B[0], B[1], z])
    }
    return pts
  }
  p.loft([ringAt(r, z0), ringAt(r - taper, z1)])
}

// ---------------------------------------------------------------------------
// The main block (way/338063109, cut on the diagonals either side of the
// tower), flat-roofed at the outline's 14 m.

const MAIN_H = 14
const MAIN: XY[] = [[-14.9, 4.4], [-14.9, -7.7], [-11.8, -12.4], [0.0, -12.5], [1.2, -13.6], [1.2, -15.3], [7.3, -15.2],
  [8.6, -16.7], [18.7, -7.5], [18.1, -3.6], [18.3, 3.4], [17.4, 3.6], [17.4, 11.2], [14.9, 13.6], [-4.2, 13.4],
  [-8.7, 9.95], [-12.1, 4.4]]
prism(stone, MAIN, 0, MAIN_H, { bt: 0.4, lid: roof })

// The stepped parapet: finial posts along the faces the circle sees (north
// and west), with a raised step of parapet midway between each pair.
{
  const runs: Array<{ a: XY; b: XY; posts: number[] }> = [
    { a: [14.9, 13.6], b: [-4.2, 13.4], posts: [0.4, 4.9, 9.6, 14.2, 18.7] },
    { a: [-14.9, 4.4], b: [-14.9, -7.7], posts: [0.4, 6.0, 11.7] },
  ]
  for (const r of runs) {
    const w = wall(r.a, r.b)
    for (const u of r.posts) {
      const [x, y] = w.at(u, 0, -0.4)
      finial(stone, x, y, 0.38, MAIN_H - 0.4, MAIN_H + 1.0, MAIN_H + 2.1)
    }
    for (let i = 0; i < r.posts.length - 1; i++) {
      const m = (r.posts[i] + r.posts[i + 1]) / 2, half = (r.posts[i + 1] - r.posts[i]) * 0.22
      const A = w.at(m - half, 0, -0.75), B = w.at(m + half, 0, -0.75), C = w.at(m + half, 0, 0), D = w.at(m - half, 0, 0)
      prism(stone, [[A[0], A[1]], [B[0], B[1]], [C[0], C[1]], [D[0], D[1]]], MAIN_H - 0.4, MAIN_H + 0.75, { bt: 0.25 })
    }
  }
}

// Rooftop plant: the pale boxes the orthophoto shows on the flat roof
// (positions read off NAIP, shifted ~2 m to undo its offset against OSM).
for (const [x0, x1, y0, y1, h] of [[-8.5, -5.5, -3.5, 3.5, 0.9], [-1.5, 1.5, -5.5, -2.5, 0.8], [3.5, 7.5, 2.5, 9, 1.0], [10.5, 13.5, 4.5, 11.5, 0.9]] as [number, number, number, number, number][])
  prism(stone, [[x0, y0], [x1, y0], [x1, y1], [x0, y1]], MAIN_H - 0.1, MAIN_H + h, { bt: 0.2 })
{
  // The square unit set diagonally on the roof.
  const c: XY = [-1.0, 4.5], r = 2.6
  prism(stone, [[c[0], c[1] - r], [c[0] + r, c[1]], [c[0], c[1] + r], [c[0] - r, c[1]]], MAIN_H - 0.1, MAIN_H + 0.8, { bt: 0.2 })
}

// Upper windows on the main block where it rises clear of the wings, and on
// the back walls (south and east), which no licensed photo shows.
{
  const ring = ccw(MAIN)
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 5) continue
    const w = wall(a, b)
    const facing = w.n
    // Skip the tower diagonals and the wall the west wing hides.
    if (Math.abs(facing[0]) > 0.3 && Math.abs(facing[1]) > 0.3 && facing[0] < 0 && facing[1] > 0) continue
    const north = facing[1] > 0.9, west = facing[0] < -0.9
    const z0 = north || west ? 10.6 : 9.4, z1 = 12.4
    const n = Math.max(1, Math.floor((L - 2) / 4.6))
    const step = L / n
    for (let k = 0; k < n; k++) {
      const u = step * (k + 0.5)
      if (north || west) panel(win, w, u - 0.55, u + 0.55, z0, z1)
      else arch(win, w, u - 0.7, u + 0.7, z0, z1 - 0.7)
    }
    // Ground-floor doors and windows on the back walls.
    if (!(north || west)) for (let k = 0; k < n; k++) panel(win, w, step * (k + 0.5) - 0.6, step * (k + 0.5) + 0.6, 1.0, 3.2)
  }
}

// ---------------------------------------------------------------------------
// The two wings in the outline: two-storey loggias under red tile pent roofs
// that fall from the main block's wall towards the circle. In front of each,
// outside the outline, the arcade (OSM building=roof ways/336940997 and
// 336948504, 5.2 m) whose flat roof is the lounge terrace, shaded by blue
// awnings (2023 photos; the blue strips in the orthophoto).

/** A pent roof over the rectangle [x0,x1]×[y0,y1], high along `hi` side, low along the opposite. */
function pent(x0: number, x1: number, y0: number, y1: number, zHi: number, zLo: number, hi: 'n' | 's' | 'e' | 'w', ov = 0.35, p: Part = tile, thick = 0.25) {
  // Corners counter-clockwise from south-west, each with its height.
  const h = (x: number, y: number) => {
    const t = hi === 'e' ? (x1 - x) / (x1 - x0) : hi === 'w' ? (x - x0) / (x1 - x0) : hi === 's' ? (y - y0) / (y1 - y0) : (y1 - y) / (y1 - y0)
    return zHi + (zLo - zHi) * t
  }
  const X0 = x0 - (hi === 'w' ? 0 : ov), X1 = x1 + (hi === 'e' ? 0 : ov), Y0 = y0 - (hi === 's' ? 0 : ov), Y1 = y1 + (hi === 'n' ? 0 : ov)
  const c: V3[] = [[X0, Y0, h(X0, Y0)], [X1, Y0, h(X1, Y0)], [X1, Y1, h(X1, Y1)], [X0, Y1, h(X0, Y1)]]
  const up = unit(cross(sub(c[1], c[0]), sub(c[3], c[0])))
  quad(p, c[0], c[1], c[2], c[3], up[2] > 0 ? up : [-up[0], -up[1], -up[2]] as V3)
  const lo = c.map(([x, y, z]) => [x, y, z - thick] as V3)
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    const n = unit([c[j][1] - c[i][1], c[i][0] - c[j][0], 0])
    quad(p, lo[i], lo[j], c[j], c[i], n)
  }
  quad(p, lo[0], lo[3], lo[2], lo[1], [0, 0, -1])
}
/** A Mission gable: a parapet panel on a wall rising in a curve to a crest, with a small finial. */
function gable(w: Wall, u0: number, u1: number, z0: number, rise: number, thick = 0.4) {
  const pts: XY[] = []
  const seg = 8
  for (let k = 0; k <= seg; k++) {
    const t = k / seg
    // Shoulders curving up into a short level crest.
    const s = Math.sin(Math.min(1, Math.abs(t - 0.5) < 0.12 ? 1 : (t < 0.5 ? t / 0.38 : (1 - t) / 0.38)) * Math.PI / 2)
    pts.push([u0 + (u1 - u0) * t, z0 + rise * s])
  }
  for (let k = 0; k < seg; k++) {
    const [ua, ha] = pts[k], [ub, hb] = pts[k + 1]
    quad(stone, w.at(ua, z0, 0), w.at(ub, z0, 0), w.at(ub, hb, 0), w.at(ua, ha, 0), nrm(w))
    quad(stone, w.at(ua, z0, -thick), w.at(ua, ha, -thick), w.at(ub, hb, -thick), w.at(ub, z0, -thick), [-w.n[0], -w.n[1], 0])
    const e = unit([w.t[0] * (ub - ua), w.t[1] * (ub - ua), hb - ha])
    const top = unit(cross([e[0], e[1], e[2]], [-w.n[0], -w.n[1], 0]))
    quad(stone, w.at(ua, ha, 0), w.at(ub, hb, 0), w.at(ub, hb, -thick), w.at(ua, ha, -thick), top[2] > 0 ? top : [-top[0], -top[1], -top[2]] as V3)
  }
  const [x, y] = w.at((u0 + u1) / 2, 0, -thick / 2)
  finial(stone, x, y, 0.22, z0 + rise - 0.05, z0 + rise + 0.45, z0 + rise + 1.1)
}

const LOG_E = 7.4   // loggia eaves
// North loggia (outline strip north of the main block).
prism(stone, [[-4.2, 13.4], [14.9, 13.6], [14.9, 14.7], [11.6, 14.7], [11.5, 18.2], [-4.1, 17.9]], 0, LOG_E, { bt: 0, lid: roof })
pent(-4.2, 11.5, 13.4, 17.95, 9.8, LOG_E - 0.2, 's')
// West loggia (outline strip west of the main block, with its south-east corner).
prism(stone, [[-19.6, -12.2], [-15.9, -12.2], [-13.9, -13.2], [-11.8, -12.4], [-14.9, -7.7], [-14.9, 4.4], [-19.6, 4.4]], 0, LOG_E + 0.2, { bt: 0.3, lid: roof })
pent(-19.6, -14.9, -12.2, 4.4, 10.0, LOG_E, 'e')
// Gable-end infill under the pent roofs.
tri(stone, [-4.2, 13.4, LOG_E], [-4.15, 17.9, LOG_E], [-4.2, 13.4, 9.8], [-1, 0, 0])
tri(stone, [11.5, 13.5, LOG_E], [11.5, 18.2, LOG_E], [11.5, 13.5, 9.8], [1, 0, 0])
for (const y of [-12.2, 4.4]) tri(stone, [-19.6, y, LOG_E], [-14.9, y, LOG_E], [-14.9, y, 10.0], [0, y < 0 ? -1 : 1, 0])
// Loggia openings over the terraces.
{
  const nf = wall([11.5, 18.2], [-4.1, 17.9])
  for (let k = 0; k < 5; k++) { const u = 1.6 + k * 3.1; arch(win, nf, u - 0.75, u + 0.75, 5.5, 6.4) }
  const wf = wall([-19.6, 4.4], [-19.6, -12.2])
  for (let k = 0; k < 5; k++) { const u = 1.9 + k * 3.2; arch(win, wf, u - 0.75, u + 0.75, 5.5, 6.4) }
  // The west loggia's north end, beside the tower: a door and a window.
  const ne = wall([-14.9, 4.4], [-19.6, 4.4])
  arch(win, ne, 1.6, 3.2, 0, 2.4)
  panel(win, ne, 1.9, 2.9, 4.4, 6.0)
}

// The arcades.
const ARC_H = 5.2
const ARC_N: XY[] = [[17.4, 21.7], [-4.0, 21.4], [-4.1, 17.9], [11.5, 18.2], [11.6, 14.7], [14.9, 14.7], [14.9, 13.6], [17.4, 11.2]]
const ARC_W: XY[] = [[-19.6, -12.2], [-23.3, -12.2], [-22.7, 2.5], [-22.6, 4.3], [-19.6, 4.4]]
for (const ring of [ARC_N, ARC_W]) {
  prism(stone, ring, 0, ARC_H, { bt: 0.25, lid: roof })
  // A low solid parapet round the terrace, inset from the outer faces.
  const r = ccw(ring), inner = offset(r, -0.35)
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length], ia = inner[i], ib = inner[(i + 1) % r.length]
    // Only along faces that front the street, not against the loggia.
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const n: XY = [(b[1] - a[1]) / L, (a[0] - b[0]) / L]
    const front = ring === ARC_N ? n[1] > 0.7 || n[0] > 0.7 || (n[0] < -0.7 && a[1] > 17.8 && b[1] > 17.8) : n[0] < -0.7 || n[1] < -0.7 || (n[1] > 0.7 && a[0] < -19.7)
    if (!front || L < 0.5) continue
    prism(stone, [a, b, ib, ia], ARC_H - 0.05, ARC_H + 0.8, { bt: 0.12 })
  }
}
{
  // Arches along the street faces.
  const nf = wall([17.4, 21.7], [-4.0, 21.4])
  for (let k = 0; k < 6; k++) { const u = 1.9 + k * 3.55; arch(win, nf, u - 1.1, u + 1.1, 0, 2.7) }
  const ef = wall([17.4, 11.2], [17.4, 21.7])
  for (let k = 0; k < 3; k++) { const u = 1.9 + k * 3.4; arch(win, ef, u - 1.0, u + 1.0, 0, 2.7) }
  const wf = wall([-22.6, 4.3], [-23.3, -12.2])
  for (let k = 0; k < 5; k++) { const u = 1.9 + k * 3.2; arch(win, wf, u - 1.1, u + 1.1, 0, 2.7) }
  // The ends facing the circle carry Mission gables over an arch.
  const gn = wall([-4.0, 21.4], [-4.1, 17.9])
  arch(win, gn, 0.8, 2.7, 0, 2.6)
  gable(gn, 0.0, 3.5, ARC_H - 0.05, 2.0)
  const gw = wall([-19.6, 4.4], [-22.6, 4.3])
  arch(win, gw, 0.6, 2.4, 0, 2.6)
  gable(gw, 0.0, 3.0, ARC_H - 0.05, 1.8)
}
// Blue awnings over the terraces, from under the loggia eaves out to the parapet.
pent(-3.6, 16.9, 18.3, 21.0, 7.0, 6.1, 's', 0, blue, 0.08)
pent(-22.6, -19.7, -11.7, 3.8, 7.0, 6.1, 'e', 0, blue, 0.08)

// ---------------------------------------------------------------------------
// The tower: an octagon 7.0 m across the flats with pilasters on its corners,
// a bell-shaped shoulder into the belfry, the tiled belfry with its pinnacles,
// the lantern, the dome and the finial.

const R_SHAFT = 3.35, SHAFT_TOP = 20.0
pilasterShaft(stone, R_SHAFT - 0.1, 0, SHAFT_TOP, 0.45, 0.14, 0.08)
// Cornice at the shaft top, then the bell: a concave sweep into the belfry.
revolve(stone, 8, OCT_PHASE, [[R_SHAFT, SHAFT_TOP], [R_SHAFT + 0.12, SHAFT_TOP + 0.15], [R_SHAFT + 0.12, SHAFT_TOP + 0.35]], { capTop: null })
revolve(stone, 8, OCT_PHASE, [[R_SHAFT + 0.12, SHAFT_TOP + 0.35], [R_SHAFT - 0.05, SHAFT_TOP + 0.5], [2.95, SHAFT_TOP + 0.8], [2.62, SHAFT_TOP + 1.15], [2.45, SHAFT_TOP + 1.5], [2.4, SHAFT_TOP + 1.75]], { capTop: null })
const BEL_R = 2.33, BEL0 = SHAFT_TOP + 1.75, BEL1 = 24.8
pilasterShaft(stone, BEL_R, BEL0, BEL1, 0.32, 0.12)
// Belfry cornice, bevelled.
revolve(stone, 8, OCT_PHASE, [[BEL_R + 0.05, BEL1], [BEL_R + 0.3, BEL1 + 0.1], [BEL_R + 0.3, BEL1 + 0.3], [BEL_R + 0.12, BEL1 + 0.42]], { capTop: roof })
const BEL_TOP = BEL1 + 0.42
for (let f = 0; f < 8; f++) {
  // Each belfry face: an arched opening, and the tile panel over it — blue
  // ground, gold diamond (the real panels are a blue, gold and white checker).
  const w = octFace(f, BEL_R), fw = 2 * BEL_R * Math.tan(Math.PI / 8), m = fw / 2
  arch(win, w, m - 0.48, m + 0.48, BEL0 + 0.3, 23.1)
  panel(blue, w, m - 0.62, m + 0.62, 23.75, BEL1 - 0.1, 0.03)
  diamond(gold, w, m, (23.75 + BEL1 - 0.1) / 2, 0.36, 0.05)
  // Pinnacles over the corners.
  const [px, py] = corner(8, f, BEL_R - 0.05, OCT_PHASE)
  finial(stone, px, py, 0.24, BEL_TOP - 0.05, BEL_TOP + 0.5, BEL_TOP + 1.45)
}
// The lantern: a smaller octagon with an arch on each face, tiled inside.
const LAN_R = 1.25, LAN0 = BEL_TOP, LAN1 = 27.45
pilasterShaft(stone, LAN_R, LAN0, LAN1, 0.18, 0.08)
for (let f = 0; f < 8; f++) {
  const w = octFace(f, LAN_R), m = LAN_R * Math.tan(Math.PI / 8)
  arch(blue, w, m - 0.3, m + 0.3, LAN0 + 0.3, LAN1 - 0.6, 0.03, 6)
}
revolve(stone, 8, OCT_PHASE, [[LAN_R + 0.05, LAN1], [LAN_R + 0.22, LAN1 + 0.1], [LAN_R + 0.22, LAN1 + 0.25], [LAN_R, LAN1 + 0.33]], { capTop: null })
// Drum and dome, then the gold finial.
const DOME_R = 0.95, D0 = LAN1 + 0.33
const domeProf: [number, number][] = [[LAN_R, D0], [DOME_R, D0], [DOME_R, D0 + 0.3]]
for (let k = 1; k <= 5; k++) { const a = (k / 5) * (Math.PI / 2); domeProf.push([DOME_R * Math.cos(a) + 0.001, D0 + 0.3 + 0.95 * Math.sin(a)]) }
revolve(stone, 12, 0, domeProf.slice(0, 3), { capTop: null })
revolve(stone, 12, 0, domeProf.slice(2), { smooth: true, capTop: stone })
{
  const zt = D0 + 1.25
  revolve(gold, 8, 0, [[0.09, zt - 0.05], [0.22, zt + 0.12], [0.22, zt + 0.25], [0.09, zt + 0.42], [0.05, zt + 0.5], [0.0, zt + 1.35]], { smooth: true, capTop: null })
}

// The tower's two faces either side of the north-west corner: the tall
// window over the entrance on each, and the diamond windows high on every face.
for (let f = 0; f < 8; f++) {
  const w = octFace(f, R_SHAFT - 0.1), fw = 2 * (R_SHAFT - 0.1) * Math.tan(Math.PI / 8), m = fw / 2
  diamond(win, w, m, 17.6, 0.45, 0.04)
}
// Faces 2 and 3 run from the north corner to the north-west corner and on to
// the west corner (corners at 90°, 135°, 180°).
for (const f of [2, 3]) {
  const w = octFace(f, R_SHAFT - 0.1), fw = 2 * (R_SHAFT - 0.1) * Math.tan(Math.PI / 8), m = fw / 2
  panel(win, w, m - 0.55, m + 0.55, 7.2, 10.6)
  arch(win, w, m - 0.9, m + 0.9, 0, 2.6)
}

// The V marquee wrapped round the north-west corner: a navy box along each
// of the two faces, its white sign boards, gold lamp fascia beneath and an
// ironwork crest (a half-disc) above each sign.
{
  const r = R_SHAFT - 0.1, D = 1.9, Z0 = 3.6, Z1 = 5.5
  const apex = corner(8, 3, r, OCT_PHASE)           // the north-west corner
  const aN = corner(8, 2, r, OCT_PHASE), aW = corner(8, 4, r, OCT_PHASE)
  const out: XY = [Math.cos((3 * Math.PI) / 4), Math.sin((3 * Math.PI) / 4)]
  const k = D / Math.cos(Math.PI / 8)
  const tip: XY = [apex[0] + out[0] * k, apex[1] + out[1] * k]
  // Each arm runs from the apex past its face's far corner by 0.6 m.
  const arm = (far: XY) => {
    const t = unit([far[0] - apex[0], far[1] - apex[1], 0]), L = Math.hypot(far[0] - apex[0], far[1] - apex[1]) + 1.5
    const n: XY = [-(far[1] - apex[1]), far[0] - apex[0]]
    const nl = Math.hypot(n[0], n[1]); const nn: XY = [n[0] / nl, n[1] / nl]
    // Make n point outward (away from the tower centre).
    const mid: XY = [(apex[0] + far[0]) / 2, (apex[1] + far[1]) / 2]
    const s = (mid[0] - TC[0]) * nn[0] + (mid[1] - TC[1]) * nn[1] > 0 ? 1 : -1
    return { t, L, n: [nn[0] * s, nn[1] * s] as XY }
  }
  for (const far of [aN, aW]) {
    const { t, L, n } = arm(far)
    const oEnd: XY = [tip[0] + t[0] * L, tip[1] + t[1] * L]
    const iEnd: XY = [oEnd[0] - n[0] * D, oEnd[1] - n[1] * D]
    prism(blue, [tip, oEnd, iEnd, apex], Z0, Z1, { bt: 0.12, bottom: true })
    // The sign board and the lamp fascia on the outer face.
    const sw = wall(oEnd, tip)
    const sgn = (sw.n[0] * n[0] + sw.n[1] * n[1]) > 0 ? 1 : -1
    const face = sgn > 0 ? sw : wall(tip, oEnd)
    const Lf = Math.hypot(oEnd[0] - tip[0], oEnd[1] - tip[1])
    panel(stone, face, 0.35, Lf - 0.35, Z0 + 0.45, Z1 - 0.3, 0.03)
    panel(gold, face, 0.1, Lf - 0.1, Z0 + 0.05, Z0 + 0.3, 0.03)
    // Crest: a half-disc standing on the box, set back from the face.
    const cu = Lf / 2, cr = 1.0
    for (let s = 0; s < 8; s++) {
      const A = (s / 8) * Math.PI, B = ((s + 1) / 8) * Math.PI
      const P0 = face.at(cu, Z1, -0.6), P1 = face.at(cu + cr * Math.cos(A), Z1 + cr * Math.sin(A), -0.6), P2 = face.at(cu + cr * Math.cos(B), Z1 + cr * Math.sin(B), -0.6)
      tri(blue, P0, P1, P2, nrm(face))
      tri(blue, P0, P2, P1, [-face.n[0], -face.n[1], 0])
    }
    // A post under the far end of each arm.
    const pe: XY = [oEnd[0] - n[0] * 0.35 - t[0] * 0.35, oEnd[1] - n[1] * 0.35 - t[1] * 0.35]
    prism(stone, [[pe[0] - 0.2, pe[1] - 0.2], [pe[0] + 0.2, pe[1] - 0.2], [pe[0] + 0.2, pe[1] + 0.2], [pe[0] - 0.2, pe[1] + 0.2]], 0, Z0, { bt: 0 })
  }
  // The post under the apex.
  const pa: XY = [tip[0] - out[0] * 0.4, tip[1] - out[1] * 0.4]
  prism(stone, [[pa[0] - 0.22, pa[1] - 0.22], [pa[0] + 0.22, pa[1] - 0.22], [pa[0] + 0.22, pa[1] + 0.22], [pa[0] - 0.22, pa[1] + 0.22]], 0, Z0, { bt: 0 })
}

// ---------------------------------------------------------------------------

// White stucco as the palette's stone; the flat roofs `roof`; the red tile
// pent roofs `terracotta`; the belfry's blue-and-gold tile and the navy
// marquee as two identity finishes, muted.
const parts = [
  { part: stone, material: PALETTE.stone },
  { part: roof, material: PALETTE.roof },
  { part: tile, material: PALETTE.terracotta },
  { part: win, material: PALETTE.window },
  { part: blue, material: finish('carthay-tile-blue', 0x55709f) },
  { part: gold, material: finish('carthay-tile-gold', 0xd6b064) },
]
const triangles = parts.reduce((sum, { part }) => sum + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Carthay Circle Theatre', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 0, elevation: 0, height: 30,
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/dlr-carthay-circle.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
