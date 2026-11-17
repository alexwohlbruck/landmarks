/**
 * Casa Batlló (Passeig de Gràcia 43, Barcelona; Antoni Gaudí's 1904–1906
 * remodelling) — original procedural geometry, CC0-1.0.
 * bun generators/barcelona-casa-batllo.ts
 *
 * This file also exports the small kit the other barcelona- Modernisme
 * models of this builder use (Casa Amatller, Casa Milà, Casa de les Punxes,
 * Palau de la Música): smooth lofted grids, lathes, an opening "screen" and
 * a tube. The Batlló model is only written when it runs itself.
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = area centroid of the OSM multipolygon relation/9427554,
 * 41.391538, 2.164755. The plot runs back from Passeig de Gràcia at right
 * angles; the street facade faces compass 46.8° (north-east). The catalog
 * bearing is 226.8, so the model's -y is the street (the facade is the
 * model's south face) and +x points north-west, towards Carrer d'Aragó.
 * Casa Amatller is the neighbour at -x.
 *
 * Identity, in order: the dragon's-back roof over the facade, a scaled hump
 * in blue-green with a row of mauve knobs along its eaves and a pink-tiled
 * lower roof at its left; the round turret at its left carrying an onion
 * bulb and a four-armed cross; the pale blue-green trencadís wall; the
 * white mask balconies; the grey sandstone base whose bone-like piers frame
 * the noble floor's big window and the two ovals beside it, over five
 * arches at the street.
 *
 * Evidence:
 *  - plan: the OSM outline (relation/9427554) and its parts:
 *    way/940163405 (7 levels, the front 8.7 m), way/679019170 (6 levels,
 *    the body, with two light wells), way/679019193 (1 level, the rear
 *    wing under the first-floor terrace), way/679019107, way/679019197 (the
 *    party-wall light courts, 1 level), way/679019117 and way/679019137
 *    (the light wells' roofs). The facade is 14.6 m on OSM; 14.5 m and a
 *    height of 32 m are published (ca.wikipedia, "Casa Batlló").
 *  - heights: measured on C messier's frontal photo across the boulevard
 *    (45 px/m on a 2.95x crop, scaled by the 14.6 m facade; the facade is
 *    near-parallel to the image plane): ground-floor arch tops 2.9–3.2 m,
 *    noble-floor openings 3.9–7.6 m, stone base top 8.8 m, window rows at
 *    9.0, 12.8, 16.6 and 19.3 m, eaves 23.0–25.2 m, dome crest 28.8 m,
 *    turret bulb 25.9–27.6 m, top of the cross 31.2 m (published 32 m).
 *    Turret 1.9 m across (slim, on the roof just behind the facade line),
 *    its axis 3.5 m from the facade's south-east end. Window sizes and
 *    positions, and the masks' sizes, are taken one by one off the photo.
 *  - the dome's depth (crest 2.5 m behind the facade) and the roof terrace
 *    behind it (24 m) are estimates from the side views (Txllxt TxllxT,
 *    Bernard Gagnon); the body's flat roof at 21 m (6 levels) and the rear
 *    wing at 4.8 m (first-floor terrace) are estimates from the rear
 *    photo (José Luiz) and OSM levels.
 *  - colour: the trencadís read mottled blue-green (#c2d0cc here) with
 *    warmer ochre-pink zones under the eaves and at the left between the
 *    second and third floors (the rose finish, #d0ae9d, shared with the pink roof); windows are the
 *    shutters' green-slate; the base is grey Montjuïc sandstone; the masks, the
 *    turret and the cross cream; the dome's scales blue-green (pulled to
 *    #7aa2a3); the left roof and the eave knobs a dusty rose.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Casa_Amatller_&_Batlló_2955.jpg (C messier, CC BY-SA 4.0), frontal;
 *  - Casa_Batlló_01.jpg (Bernard Gagnon, CC BY-SA 3.0), the roof and turret;
 *  - Barcelona_-_Passeig_de_Gràcia_-_View_NW_on_Casa_Amatller_1900_&_Casa_
 *    Batlló_1907.jpg (Txllxt TxllxT, CC BY-SA 4.0), oblique from the SE;
 *  - Casa_Amatller_Casa_Batlló,_Barcelona.jpg (МаратД, CC BY-SA 4.0);
 *  - Rear_facade_of_Casa_Batlló_-_Barcelona_2014.JPG (José Luiz, CC BY-SA
 *    3.0), the rear facade over the terrace;
 *  - Main_facade_of_Casa_Batlló.JPG (Steven Lek, CC BY-SA 4.0).
 * No look-only sources. No commercial imagery. No lidar (Spain; the repo's
 * tools read USGS only); the map's Mapterhorn terrain slopes about 2 m
 * across the plot, so the back sinks into it (y = 0 is the low corner).
 *
 * Ground: the map's terrain (Mapterhorn) puts the block's interior behind
 * the house about 1.2 m below Passeig de Gràcia, and the map stands the
 * model on that lowest ground; so every height above stands on a plain
 * 1.2 m plinth that the pavement covers at the front (terrain.ts check ok).
 *
 * Left out: the trencadís discs, the window shutters and frames' carving,
 * the iron railings, the bones' knuckles, the eyes of the masks, the dome's
 * opening, the chimneys on the roof terrace, the light wells.
 *
 * Doubts: the back of the dome and the roof terrace are not photographed
 * from the street; the party walls are plain (neighbours hide them up to
 * about 20 m on the Amatller side).
 */
import { Part, cross, sub, type V3 } from './mesh'
import { PALETTE, finish, type Swatch } from './palette'
import { cap, save, walls, type XY } from './chi-aon-center'

// ---------------------------------------------------------------------------
// Kit, shared by this builder's barcelona- Modernisme models.

const nrm = (a: V3): V3 => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l] }
const area2 = (a: V3, b: V3, c: V3) => { const g = cross(sub(b, a), sub(c, a)); return Math.hypot(g[0], g[1], g[2]) }

/**
 * A smooth surface over a grid P[v][u]. The outside is the side of
 * (P[v][u+1] − P[v][u]) × (P[v+1][u] − P[v][u]); normals are averaged per
 * grid point, so curves shade smooth. `closeU` joins the last column to the
 * first (a ring). Degenerate corners (an apex) are skipped.
 */
export function grid(p: Part, P: V3[][], closeU = false) {
  const nv = P.length, nu = P[0].length, cu = closeU ? nu : nu - 1
  const N: V3[][] = P.map(r => r.map(() => [0, 0, 0] as V3))
  const add = (v: number, u: number, n: V3) => { const t = N[v][u % nu]; t[0] += n[0]; t[1] += n[1]; t[2] += n[2] }
  for (let v = 0; v < nv - 1; v++) for (let u = 0; u < cu; u++) {
    const a = P[v][u], b = P[v][(u + 1) % nu], c = P[v + 1][(u + 1) % nu], d = P[v + 1][u]
    const n = cross(sub(c, a), sub(d, b))
    for (const [vv, uu] of [[v, u], [v, u + 1], [v + 1, u + 1], [v + 1, u]]) add(vv, uu, n)
  }
  const n = (v: number, u: number) => nrm(N[v][u % nu])
  for (let v = 0; v < nv - 1; v++) for (let u = 0; u < cu; u++) {
    const u1 = (u + 1) % nu
    const a = P[v][u], b = P[v][u1], c = P[v + 1][u1], d = P[v + 1][u]
    if (area2(a, b, c) > 1e-6) p.tri(a, b, c, [0, 0], [0, 0], [0, 0], [n(v, u), n(v, u1), n(v + 1, u1)])
    if (area2(a, c, d) > 1e-6) p.tri(a, c, d, [0, 0], [0, 0], [0, 0], [n(v, u), n(v + 1, u1), n(v + 1, u)])
  }
}

/**
 * A surface of revolution about the vertical through (cx, cy): `prof` is
 * [radius, z] from the bottom up. A last radius of 0 closes it at an apex;
 * `capTop` / `capBottom` close flat ends. `sx` / `sy` squash it into an
 * ellipse; `a0` turns the first meridian.
 */
export function lathe(p: Part, cx: number, cy: number, prof: [number, number][], seg = 16, o: { capTop?: boolean; capBottom?: boolean; sx?: number; sy?: number; a0?: number } = {}) {
  const sx = o.sx ?? 1, sy = o.sy ?? 1, a0 = o.a0 ?? 0
  const ring = (r: number, z: number): V3[] => Array.from({ length: seg }, (_, i) => {
    const a = a0 + (i / seg) * 2 * Math.PI
    return [cx + r * sx * Math.cos(a), cy + r * sy * Math.sin(a), z] as V3
  })
  const rings = prof.map(([r, z]) => ring(r, z))
  grid(p, rings, true)
  const [rt, zt] = prof[prof.length - 1], [rb, zb] = prof[0]
  if (o.capTop && rt > 0) p.cap(ring(rt, zt), true)
  if (o.capBottom && rb > 0) p.cap(ring(rb, zb), false)
}

/** A tube of radius r (n sides) along a path, smooth, ends open. */
export function tube(p: Part, path: V3[], r: number, n = 6, ry = r) {
  const rows: V3[][] = path.map((c, i) => {
    const a = path[Math.max(0, i - 1)], b = path[Math.min(path.length - 1, i + 1)]
    const t = nrm(sub(b, a))
    let s = cross(t, [0, 0, 1]); if (Math.hypot(...s) < 1e-6) s = cross(t, [1, 0, 0])
    s = nrm(s); const up = nrm(cross(s, t))
    return Array.from({ length: n }, (_, k) => {
      const q = -(k / n) * 2 * Math.PI, cs = Math.cos(q) * r, sn = Math.sin(q) * ry
      return [c[0] + s[0] * cs + up[0] * sn, c[1] + s[1] * cs + up[1] * sn, c[2] + s[2] * cs + up[2] * sn] as V3
    })
  })
  // rows run along the path (v); each row's points run round it (u).
  grid(p, rows, true)
}

/** A box with every vertical edge chamfered by b. Faces flat. */
export function box(p: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, b = 0, top = true) {
  const k = Math.min(b, (x1 - x0) / 3, (y1 - y0) / 3)
  const r: XY[] = k > 0
    ? [[x0 + k, y0], [x1 - k, y0], [x1, y0 + k], [x1, y1 - k], [x1 - k, y1], [x0 + k, y1], [x0, y1 - k], [x0, y0 + k]]
    : [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
  walls(p, r, z0, z1)
  if (top) cap(p, r, z1)
}

/** A flat quad in the plane y = y0 facing -y (towards the viewer at -y). */
export function front(p: Part, y: number, x0: number, x1: number, z0: number, z1: number) {
  p.quad([x0, y, z0], [x1, y, z0], [x1, y, z1], [x0, y, z1])
}

/** A flat shape in the plane y = y0 facing -y, from an outline (x, z) counter-clockwise seen from -y. */
export function frontShape(p: Part, y: number, ring: XY[]) {
  // seen from -y, x runs right and z up: the ring is counter-clockwise in (x, z).
  for (let i = 1; i < ring.length - 1; i++) {
    const a = ring[0], b = ring[i], c = ring[i + 1]
    p.tri([a[0], y, a[1]], [b[0], y, b[1]], [c[0], y, c[1]])
  }
}

/** An arched opening's outline in (x, z): sides up to zs, a half-ellipse to zt. */
export function archRing(x0: number, x1: number, zb: number, zs: number, zt: number, seg = 8, ovalBottom = 0): XY[] {
  const cx = (x0 + x1) / 2, rx = (x1 - x0) / 2
  const out: XY[] = []
  if (ovalBottom > 0) for (let i = 0; i <= seg; i++) { const a = Math.PI + (i / seg) * Math.PI; out.push([cx + rx * Math.cos(a), zb + ovalBottom + ovalBottom * Math.sin(a)]) }
  else { out.push([x0, zb], [x1, zb]) }
  for (let i = 0; i <= seg; i++) { const a = (i / seg) * Math.PI; out.push([cx + rx * Math.cos(a), zs + (zt - zs) * Math.sin(a)]) }
  return out
}

/**
 * A stone screen standing proud of the wall plane y = yw by `d`, from z0
 * to z1, across x0..x1, pierced by openings (each a function giving the
 * bottom and top of the hole at x, or null outside it). Slices in x so
 * every face stays planar; reveals are drawn at the openings' edges.
 */
export function screen(p: Part, yw: number, d: number, x0: number, x1: number, z0: number, z1: number,
  holes: { x0: number; x1: number; bot: (x: number) => number; top: (x: number) => number; seg?: number }[]) {
  const yf = yw - d
  const xs = new Set<number>([x0, x1])
  for (const h of holes) { const s = h.seg ?? 8; for (let i = 0; i <= s; i++) xs.add(h.x0 + (h.x1 - h.x0) * i / s) }
  const X = [...xs].filter(x => x >= x0 - 1e-9 && x <= x1 + 1e-9).sort((a, b) => a - b)
  const hole = (x: number) => holes.find(h => x > h.x0 + 1e-6 && x < h.x1 - 1e-6)
  for (let i = 0; i < X.length - 1; i++) {
    const xa = X[i], xb = X[i + 1], h = hole((xa + xb) / 2)
    if (!h) { front(p, yf, xa, xb, z0, z1); continue }
    const ba = Math.max(z0, h.bot(xa)), bb = Math.max(z0, h.bot(xb)), ta = Math.min(z1, h.top(xa)), tb = Math.min(z1, h.top(xb))
    // the screen below and above the hole
    if (ba > z0 + 1e-6 || bb > z0 + 1e-6) p.quad([xa, yf, z0], [xb, yf, z0], [xb, yf, bb], [xa, yf, ba])
    p.quad([xa, yf, ta], [xb, yf, tb], [xb, yf, z1], [xa, yf, z1])
    // reveals: the hole's soffit (faces down) and sill (faces up)
    p.quad([xa, yf, ta], [xa, yw, ta], [xb, yw, tb], [xb, yf, tb])
    if (ba > z0 + 1e-6 || bb > z0 + 1e-6) p.quad([xa, yf, ba], [xb, yf, bb], [xb, yw, bb], [xa, yw, ba])
  }
  // the hole's side reveals
  for (const h of holes) {
    const zb0 = Math.max(z0, h.bot(h.x0 + 1e-4)), zt0 = Math.min(z1, h.top(h.x0 + 1e-4))
    const zb1 = Math.max(z0, h.bot(h.x1 - 1e-4)), zt1 = Math.min(z1, h.top(h.x1 - 1e-4))
    if (zt0 - zb0 > 0.05) p.quad([h.x0, yf, zb0], [h.x0, yw, zb0], [h.x0, yw, zt0], [h.x0, yf, zt0])
    if (zt1 - zb1 > 0.05) p.quad([h.x1, yw, zb1], [h.x1, yf, zb1], [h.x1, yf, zt1], [h.x1, yw, zt1])
  }
  // ends and top of the screen
  p.quad([x0, yw, z0], [x0, yf, z0], [x0, yf, z1], [x0, yw, z1])
  p.quad([x1, yf, z0], [x1, yw, z0], [x1, yw, z1], [x1, yf, z1])
  p.quad([x0, yf, z1], [x1, yf, z1], [x1, yw, z1], [x0, yw, z1])
}

/** Elliptic arch top: z at x for an arch over x0..x1 springing at zs and peaking at zt. */
export const archTop = (x0: number, x1: number, zs: number, zt: number) => (x: number) => {
  const t = Math.max(-1, Math.min(1, (x - (x0 + x1) / 2) / ((x1 - x0) / 2)))
  return zs + (zt - zs) * Math.sqrt(Math.max(0, 1 - t * t))
}
/** An oval's bottom: z at x for an oval over x0..x1 between zb and zb + dz. */
export const ovalBot = (x0: number, x1: number, zb: number, dz: number) => (x: number) => {
  const t = Math.max(-1, Math.min(1, (x - (x0 + x1) / 2) / ((x1 - x0) / 2)))
  return zb + dz - dz * Math.sqrt(Math.max(0, 1 - t * t))
}

/** Signed area of a ring (positive = counter-clockwise). */
export const ringArea = (r: XY[]) => r.reduce((s, a, i) => { const b = r[(i + 1) % r.length]; return s + a[0] * b[1] - b[0] * a[1] }, 0) / 2
export const ccw = (r: XY[]): XY[] => ringArea(r) < 0 ? [...r].reverse() : r

/** Clip a ring to the half-plane y >= c (keep = 'above') or y <= c ('below'). */
export function clipY(r: XY[], c: number, keep: 'above' | 'below'): XY[] {
  const inside = (p: XY) => keep === 'above' ? p[1] >= c : p[1] <= c
  const out: XY[] = []
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    if (inside(a)) out.push(a)
    if (inside(a) !== inside(b)) { const t = (c - a[1]) / (b[1] - a[1]); out.push([a[0] + (b[0] - a[0]) * t, c]) }
  }
  return out
}

/** Walls of a ring, skipping the edges for which `skip(a, b)` is true. */
export function wallsExcept(p: Part, r: XY[], z0: number, z1: number, skip: (a: XY, b: XY) => boolean) {
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    if (skip(a, b)) continue
    p.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
  }
}

/** Smooth interpolation through (x, value) knots (Catmull-Rom, clamped ends). */
export function spline(knots: [number, number][]) {
  return (x: number) => {
    const k = knots
    if (x <= k[0][0]) return k[0][1]
    if (x >= k[k.length - 1][0]) return k[k.length - 1][1]
    let i = 0; while (x > k[i + 1][0]) i++
    const p0 = k[Math.max(0, i - 1)], p1 = k[i], p2 = k[i + 1], p3 = k[Math.min(k.length - 1, i + 2)]
    const t = (x - p1[0]) / (p2[0] - p1[0])
    const m1 = (p2[1] - p0[1]) / (p2[0] - p0[0]) * (p2[0] - p1[0]), m2 = (p3[1] - p1[1]) / (p3[0] - p1[0]) * (p2[0] - p1[0])
    const t2 = t * t, t3 = t2 * t
    return (2 * t3 - 3 * t2 + 1) * p1[1] + (t3 - 2 * t2 + t) * m1 + (-2 * t3 + 3 * t2) * p2[1] + (t3 - t2) * m2
  }
}

/**
 * A balcony "shell" bulging out of the wall plane y = yw (towards -y): a
 * half-ring of half-width w and depth d at its widest, from zb to zt, with
 * a flat top. Smooth. The shape `bulge(t)` (t 0..1 bottom to top) scales
 * width and depth; Batlló's masks and Milà's balconies both use it.
 */
export function shell(p: Part, x: number, yw: number, zb: number, zt: number, w: number, d: number, bulge = (t: number) => Math.sin(Math.PI * (0.25 + 0.75 * t)) ** 0.7, nu = 8, nv = 5, topCap = true) {
  const rows: V3[][] = []
  for (let v = 0; v <= nv; v++) {
    const t = v / nv, z = zb + (zt - zb) * t, s = bulge(t)
    const row: V3[] = []
    for (let u = 0; u <= nu; u++) {
      const a = Math.PI - (u / nu) * Math.PI // from the -x side round the front to +x
      row.push([x + w * Math.max(0.35, s) * Math.cos(a), yw - d * s * Math.sin(a), z])
    }
    rows.push(row)
  }
  grid(p, rows)
  if (topCap) { const top = rows[nv]; for (let u = 1; u < nu; u++) p.tri(top[0], top[u], top[u + 1]) }
}

// ---------------------------------------------------------------------------
// Casa Batlló

const FRONT = -25.1 // the facade plane
const XL = -6.91, XR = 7.69 // facade ends: Casa Amatller's side (-x), Aragó side (+x)

function build() {
  const tren = new Part(), sand = new Part(), cream = new Part(), scales = new Part(), rose = new Part(), win = new Part()

  // --- Plan (OSM, turned to the frame) ---------------------------------
  const main: XY[] = ccw([[-6.91, -25.11], [7.69, -25.1], [7.59, -20.2], [7.32, -13.11], [7.07, -6.0], [6.96, -0.74], [6.93, -0.01], [5.59, -0.16], [5.56, 1.61], [6.9, 1.66], [6.87, 3.65], [6.76, 9.71], [-7.94, 9.41], [-7.73, 1.44], [-5.69, 1.35], [-5.64, -0.33], [-7.68, -0.42], [-7.62, -2.11], [-7.48, -6.37], [-7.26, -13.17], [-7.24, -13.89], [-7.05, -20.16]])
  const rear: XY[] = ccw([[6.76, 9.71], [6.63, 17.22], [6.59, 20.34], [6.55, 23.01], [5.27, 23.13], [4.43, 23.59], [3.72, 24.25], [3.26, 25.46], [3.1, 27.26], [-5.03, 27.04], [-5.11, 24.93], [-5.31, 24.23], [-5.79, 23.72], [-6.49, 23.5], [-8.28, 23.29], [-8.1, 16.03], [-7.94, 9.41]])
  const ATTIC = -16.4 // back of the 7-level front part
  const frontPart = clipY(main, ATTIC, 'below'), body = clipY(main, ATTIC, 'above')
  const isFront = (a: XY, b: XY) => a[1] < FRONT + 0.05 && b[1] < FRONT + 0.05
  const isAt = (c: number) => (a: XY, b: XY) => Math.abs(a[1] - c) < 0.02 && Math.abs(b[1] - c) < 0.02

  // Party walls and the attic, sandstone-plain; the front part up to the roof terrace.
  const TERRACE = 24.0, BODY = 21.0, REAR = 4.8
  wallsExcept(sand, frontPart, 0, TERRACE, (a, b) => isFront(a, b) || isAt(ATTIC)(a, b))
  cap(sand, frontPart, TERRACE)
  // the attic's back wall above the body roof
  const ab = frontPart.filter(p => Math.abs(p[1] - ATTIC) < 0.02).sort((a, b) => b[0] - a[0])
  if (ab.length === 2) sand.quad([ab[0][0], ATTIC, BODY], [ab[1][0], ATTIC, BODY], [ab[1][0], ATTIC, TERRACE], [ab[0][0], ATTIC, TERRACE])
  wallsExcept(sand, body, 0, BODY, (a, b) => isAt(ATTIC)(a, b) || (a[1] > 9.3 && b[1] > 9.3))
  cap(sand, body, BODY)
  wallsExcept(sand, rear, 0, REAR, (a, b) => a[1] < 9.8 && b[1] < 9.8)
  cap(sand, rear, REAR)

  // --- Rear facade (cream render, wavy balconies, trencadís crown) -----
  const RA: XY = [6.76, 9.71], RB: XY = [-7.94, 9.41]
  const ry = (x: number) => RB[1] + (RA[1] - RB[1]) * (x - RB[0]) / (RA[0] - RB[0])
  const rx0 = RB[0], rx1 = RA[0]
  // the wall faces +y: draw it from +x to -x
  const rearWall = (p: Part, z0: number, z1: number) => p.quad([rx1, ry(rx1), z0], [rx0, ry(rx0), z0], [rx0, ry(rx0), z1], [rx1, ry(rx1), z1])
  rearWall(sand, 0, REAR)
  rearWall(cream, REAR, 19.4)
  for (const z of [7.9, 11.3, 14.7, 18.1]) {
    // window band behind each balcony
    for (const [a, b] of [[-6.6, -3.2], [-2.6, 1.9], [2.5, 5.6]] as [number, number][])
      win.quad([b, ry(b) + 0.04, z - 3.0], [a, ry(a) + 0.04, z - 3.0], [a, ry(a) + 0.04, z - 0.9], [b, ry(b) + 0.04, z - 0.9])
    // the wavy balcony slab
    const N = 14, ring: V3[] = []
    for (let i = 0; i <= N; i++) { const x = rx1 - 0.2 - (rx1 - rx0 - 0.4) * i / N; ring.push([x, ry(x) + 0.55 + 0.4 * Math.sin(i / N * Math.PI * 3) ** 2, z - 3.2]) }
    for (let i = 0; i < N; i++) {
      const a = ring[i], b = ring[i + 1], a0: V3 = [a[0], ry(a[0]), a[2]], b0: V3 = [b[0], ry(b[0]), b[2]]
      const up = (q: V3, h: number): V3 => [q[0], q[1], q[2] + h]
      cream.quad(a, b, up(b, 0.35), up(a, 0.35)) // front edge
      cream.quad(up(a0, 0.35), up(a, 0.35), up(b, 0.35), up(b0, 0.35)) // top
      cream.quad(a0, b0, b, a) // underside
    }
  }
  // crown: a wavy parapet of trencadís
  {
    const N = 16, top = (i: number) => 21.6 + 0.7 * Math.abs(Math.sin(i / N * Math.PI * 4))
    for (let i = 0; i < N; i++) {
      const xa = rx1 - (rx1 - rx0) * i / N, xb = rx1 - (rx1 - rx0) * (i + 1) / N
      const ya = ry(xa) + 0.25, yb = ry(xb) + 0.25
      tren.quad([xa, ya, 19.4], [xb, yb, 19.4], [xb, yb, top(i + 1)], [xa, ya, top(i)])
      tren.quad([xa, ya, top(i)], [xb, yb, top(i + 1)], [xb, yb - 0.5, top(i + 1)], [xa, ya - 0.5, top(i)])
      tren.quad([xb, yb - 0.5, BODY], [xa, ya - 0.5, BODY], [xa, ya - 0.5, top(i)], [xb, yb - 0.5, top(i + 1)])
    }
    tren.quad([rx1, ry(rx1), 19.4], [rx1, ry(rx1) + 0.25, 19.4], [rx1, ry(rx1) + 0.25, top(0)], [rx1, ry(rx1), top(0)])
    tren.quad([rx0, ry(rx0) + 0.25, 19.4], [rx0, ry(rx0), 19.4], [rx0, ry(rx0), top(N)], [rx0, ry(rx0) + 0.25, top(N)])
  }

  // --- Street facade ----------------------------------------------------
  // Eaves line (top of the trencadís wall), measured on the frontal photo.
  const eave = spline([[XL, 21.9], [-4.1, 23.0], [-2.9, 24.2], [0.1, 24.7], [3.2, 25.2], [5.2, 24.5], [7.0, 23.4], [XR, 23.0]])
  const STONE = 8.8
  // The trencadís wall in three broad soft areas: blue-green overall, a
  // warmer ochre-pink zone under the eaves and a second one at the left
  // between the second and third floors (C messier's frontal photo).
  const XS = Array.from({ length: 25 }, (_, i) => XL + (XR - XL) * i / 24)
  const topH = (x: number) => x < -3.6 || x > 6.9 ? 0 : 3.0 * Math.sin(Math.PI * (x + 3.6) / 10.5) ** 0.7 + 0.35 * Math.sin(x * 1.7)
  const blob = (x: number) => x < -6.91 || x > -0.6 ? 0 : 1.5 * Math.sin(Math.PI * (x + 6.91) / 6.31) ** 0.5
  for (let i = 0; i < XS.length - 1; i++) {
    const xa = XS[i], xb = XS[i + 1]
    const band = (p: Part, za: number, zb: number, ta: number, tb: number) => { if (ta - za > 1e-3 || tb - zb > 1e-3) p.quad([xa, FRONT, za], [xb, FRONT, zb], [xb, FRONT, tb], [xa, FRONT, ta]) }
    const b0a = 15.1 - blob(xa) * 1.1, b0b = 15.1 - blob(xb) * 1.1, b1a = 15.1 + blob(xa), b1b = 15.1 + blob(xb)
    const ta = eave(xa) - Math.max(0, topH(xa)), tb = eave(xb) - Math.max(0, topH(xb))
    band(tren, STONE, STONE, b0a, b0b)
    band(rose, b0a, b0b, b1a, b1b)
    band(tren, b1a, b1b, ta, tb)
    band(rose, ta, tb, eave(xa), eave(xb))
  }
  // the wall's ends where it stands above the neighbours
  // (the party walls carry on behind; nothing to add)

  // Sandstone base: five arches at the street, the noble floor's openings
  // above, pierced in a screen 0.4 m proud of the wall.
  const D = 0.4
  const arch = (x0: number, x1: number) => ({ x0, x1, bot: () => -1, top: archTop(x0, x1, 2.1, 3.15), seg: 8 })
  const oval = (x0: number, x1: number) => ({ x0, x1, bot: ovalBot(x0, x1, 4.0, 0.7), top: archTop(x0, x1, 6.7, 7.6), seg: 8 })
  const big = { x0: -2.98, x1: 4.3, bot: ovalBot(-2.98, 4.3, 4.0, 0.35), top: archTop(-2.98, 4.3, 7.0, 7.8), seg: 12 }
  screen(sand, FRONT, D, XL, XR, 0, 3.75, [arch(-6.5, -3.9), arch(-2.65, -1.0), arch(-0.55, 1.2), arch(1.65, 3.3), arch(4.5, 6.95)])
  screen(sand, FRONT, D, XL, XR, 3.75, STONE, [oval(-6.07, -3.97), big, oval(4.92, 6.95)])
  // glazing and gates behind the openings
  for (const [a, b] of [[-6.5, -3.9], [-2.65, -1.0], [-0.55, 1.2], [1.65, 3.3], [4.5, 6.95]] as [number, number][]) front(win, FRONT - 0.04, a, b, 0, 3.2)
  front(win, FRONT - 0.04, -6.1, -3.95, 3.9, 7.7)
  front(win, FRONT - 0.04, -3.0, 4.32, 3.9, 7.9)
  front(win, FRONT - 0.04, 4.9, 6.97, 3.9, 7.7)
  // bone piers standing in the noble floor's openings
  for (const x of [-5.02, -1.77, 0.11, 1.45, 2.76, 5.93]) {
    lathe(sand, x, FRONT - D * 0.55, [[0.2, 3.9], [0.26, 4.4], [0.17, 5.4], [0.2, 6.6], [0.27, 7.3], [0.32, 8.0]], 8)
  }
  // the bone balustrade over the noble floor, bulging out at the middle
  {
    const N = 12, rows: V3[][] = []
    const out = (x: number) => 0.45 + 0.35 * Math.cos(Math.PI * (x - 0.66) / 6.4)
    const xs = Array.from({ length: N + 1 }, (_, i) => -2.6 + 6.5 * i / N)
    for (const [z, k] of [[8.55, 0.2], [8.75, 1], [9.35, 1], [9.55, 0.2]] as [number, number][]) rows.push(xs.map(x => [x, FRONT - D - out(x) * k, z] as V3))
    grid(sand, rows)
  }

  // Windows in stone frames, as photographed: fewer and irregular, wide
  // ones low and over the middle, narrow ones higher; the outer bays'
  // windows mostly hidden behind their masks. Green shutters: the window
  // colour is the shutters' green-slate.
  const frame = (x: number, w: number, z0: number, z1: number) => {
    front(cream, FRONT - 0.03, x - w / 2 - 0.18, x + w / 2 + 0.18, z0 - 0.18, z1 + 0.22)
    front(win, FRONT - 0.07, x - w / 2, x + w / 2, z0, z1)
  }
  for (const [x, w, z0, z1] of [
    [-1.7, 2.0, 9.0, 10.9], [-1.6, 1.25, 12.85, 14.5], [-1.75, 1.2, 16.6, 18.2], [-1.6, 1.7, 19.3, 21.6],
    [2.65, 1.9, 9.0, 10.9], [2.55, 1.3, 12.8, 14.4], [2.7, 1.15, 16.65, 18.25], [2.6, 1.75, 19.3, 21.5],
    [-5.1, 1.3, 9.3, 10.5], [-5.0, 1.0, 13.4, 14.6], [-4.8, 1.1, 17.0, 18.3],
    [5.95, 1.2, 9.2, 10.4], [5.8, 1.0, 13.3, 14.4], [6.0, 1.9, 20.4, 21.8], [0.45, 0.8, 23.1, 24.0],
  ] as [number, number, number, number][]) frame(x, w, z0, z1)
  // The mask balconies: bold white bowls, biggest and deepest low down,
  // smaller towards the top.
  const bowl = (t: number) => 0.42 + 0.58 * Math.sin(t * Math.PI / 2) ** 0.8
  for (const [x, zb, zt, w, d] of [
    [-1.65, 11.2, 12.95, 2.7, 1.15], [2.6, 11.2, 12.95, 2.7, 1.15], [-5.0, 11.5, 13.0, 2.3, 1.05], [5.9, 11.6, 13.0, 2.1, 1.0],
    [-1.6, 15.0, 16.65, 2.3, 0.95], [2.65, 15.0, 16.7, 2.2, 0.95], [-4.95, 15.4, 16.8, 1.9, 0.85], [5.9, 15.5, 16.8, 1.8, 0.85],
    [-4.9, 18.9, 20.4, 2.2, 0.8], [5.9, 18.9, 20.35, 1.9, 0.75], [0.45, 21.6, 22.9, 1.2, 0.6],
  ] as [number, number, number, number, number][]) shell(cream, x, FRONT, zb, zt, w / 2, d, bowl)

  // --- Roof: the pink lower roof, the dragon's back, the turret --------
  // Pink roof over the facade's south-east end, behind the turret.
  {
    const xs = Array.from({ length: 6 }, (_, i) => XL + (-2.6 - XL) * i / 5)
    const rows: V3[][] = []
    for (const [dy, dz] of [[-0.25, 0], [1.0, 1.3], [2.2, 2.1], [3.4, 1.6], [5.3, 0.6]] as [number, number][])
      rows.push(xs.map(x => [x, FRONT + dy, eave(x) + dz * (eave(x) > 23 ? 0.85 : 1)] as V3))
    // close the far end down to the terrace
    rows.push(xs.map(x => [x, FRONT + 5.6, TERRACE] as V3))
    grid(rose, rows)
    // the gable end where it meets the neighbour
    const g = rows.map(r => r[0])
    for (let i = 1; i < g.length - 1; i++) rose.tri(g[0], g[i], g[i + 1])
  }
  // The dragon's back: a scaled hump from the turret to the +x end.
  const crest = spline([[-3.2, 27.2], [-2.4, 29.3], [-0.1, 30.0], [1.7, 29.6], [2.5, 28.4], [3.4, 27.4], [4.3, 27.2], [5.6, 26.2], [7.0, 24.8], [XR, 23.8]])
  const DX = Array.from({ length: 17 }, (_, i) => -3.2 + (XR - -3.2) * i / 16)
  const CY = 2.1 // the crest's distance behind the facade
  {
    const rows: V3[][] = []
    const N = 6
    for (let k = 0; k <= N; k++) { // front quarter-ellipse, eave → crest
      const th = (k / N) * Math.PI / 2
      rows.push(DX.map(x => { const e = eave(x), c = Math.max(crest(x), e + 0.6); return [x, FRONT - 0.45 + (CY + 0.45) * (1 - Math.cos(th)) ** 1.3, e + (c - e) * Math.sin(th)] as V3 }))
    }
    for (let k = 1; k <= 3; k++) { // back, down to the terrace
      const th = (k / 3) * Math.PI / 2
      rows.push(DX.map(x => { const c = Math.max(crest(x), eave(x) + 0.6); return [x, FRONT + CY + 3.0 * Math.sin(th), c - (c - TERRACE) * (1 - Math.cos(th))] as V3 }))
    }
    // rows run front→back (v) with x along u: outside is up/forward
    grid(scales, rows)
    const end = rows.map(r => r[r.length - 1]), start = rows.map(r => r[0])
    for (let i = 1; i < end.length - 1; i++) { scales.tri(end[0], end[i + 1], end[i]); scales.tri(start[0], start[i], start[i + 1]) }
  }
  // the row of mauve knobs along the eaves, and the crest's beads
  tube(rose, DX.map(x => [x, FRONT - 0.32, eave(x) + 0.12] as V3), 0.3, 6, 0.24)
  // the turret, its onion bulb and the cross
  // on the roof at the facade's left end, just behind the facade line,
  // beside the dragon's back: a slim cylinder (1.9 m), then the bulb
  const TX = -3.4, TY = FRONT + 0.9
  lathe(cream, TX, TY, [[0.95, 21.4], [0.95, 25.0], [0.92, 25.8], [1.1, 26.2], [1.17, 26.7], [1.0, 27.2], [0.5, 27.6], [0.3, 28.1], [0.22, 28.9], [0, 29.25]], 14)
  // a bold four-armed cross (a cube cluster, as on the roof)
  box(cream, TX - 0.24, TY - 0.24, TX + 0.24, TY + 0.24, 28.8, 31.2, 0.08)
  box(cream, TX - 0.72, TY - 0.24, TX + 0.72, TY + 0.24, 30.0, 30.5, 0.08)
  box(cream, TX - 0.24, TY - 0.72, TX + 0.24, TY + 0.72, 30.0, 30.5, 0.08)

  // The map stands the model on the lowest ground of its plan's extent, in
  // the block's interior about 1.2 m below the boulevard (Mapterhorn): the
  // design stands on a plain plinth DZ tall that the pavement covers.
  const DZ = 1.2
  for (const part of [tren, sand, cream, scales, rose, win]) for (let i = 1; i < part.pos.length; i += 3) part.pos[i] += DZ
  walls(sand, main, 0, DZ)
  wallsExcept(sand, rear, 0, DZ, (a, b) => a[1] < 9.8 && b[1] < 9.8)

  // At night the facade, the dome and the turret are floodlit from the boulevard.
  const lit = (p: V3, n: V3) => (p[1] < FRONT + 6 && n[1] < 0.3 ? 0.55 + 0.45 * Math.min(1, p[2] / 26) : 0) * (n[2] > 0.8 ? 0.4 : 1)
  return [
    { part: tren, material: { ...finish('batllo-trencadis', 0xc2d0cc), floodlight: lit } },
    { part: sand, material: { ...finish('batllo-sandstone', 0xd3c9b8), floodlight: lit } },
    { part: cream, material: { ...PALETTE.trim, floodlight: lit } },
    { part: scales, material: { ...finish('batllo-scales', 0x7aa2a3), floodlight: lit } },
    { part: rose, material: { ...finish('batllo-rose', 0xd0ae9d), floodlight: lit } },
    { part: win, material: { ...PALETTE.window, color: 0x5e786c } }, // green-slate shutters and glazing
  ] as { part: Part; material: Swatch }[]
}

if (import.meta.main) await save('barcelona-casa-batllo', 'Casa Batlló', [41.391538, 2.164755], 226.8, build(), 5000)
