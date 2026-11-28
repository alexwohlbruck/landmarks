/**
 * Frost Tower, San Antonio: procedural, CC0-1.0.
 * bun generators/sat-frost-tower.ts
 *
 * Also the home of the small prism kit (`ring`, `walls`, `capPoly`,
 * `panels`, `bayPanels`, `bevelPrism`, `box`, `regular`) the other `sat-` downtown towers import; its own
 * build runs only when this file is run directly.
 *
 * Map frame: x east, y north, z up, metres; bearing 0, built in true
 * orientation on OSM's outline (way/581781219), whose centroid is the
 * origin. y = 0 is the lowest ground under it; the site falls about 0.8 m
 * from north-east to south-west (Mapterhorn), which the walls run into.
 *
 * Pelli Clarke Pelli with Kell Muñoz, opened 2019, the headquarters of
 * Frost Bank: 23 storeys of pale blue reflective glass on a pinwheel plan.
 * Each of the four sides is a long flat face, a short step out, a diagonal
 * face ending in a sharp blade corner and a notch back to the next side,
 * so the plan turns like a pinwheel. Above the roof the faces run on as
 * glass screens whose tops slope up, side by side, to the four sharp blade
 * corners: the faceted crown ("Queen Elsa's ice palace", Wikipedia).
 *
 * Published: 121.9 m (400 ft) to the top of the crown, 23 storeys
 * (Wikipedia, "List of tallest buildings in San Antonio"; the brief's
 * 124 m / 407 ft was not found in a citable source, so 121.9 m is used).
 * OSM: height 117.653, 24 levels (between the troughs and points of the crown);
 * the roof behind the screens is drawn at 103 m (estimated).
 * The 2017 USGS lidar predates the tower (built 2017-19), so no height is
 * measured; all heights are published or photo-scaled.
 *
 * From photos (scaled from the plan's 45 m across and the 121.9 m top;
 * revised after review):
 * - every facet leans: its top is turned clockwise (seen from above)
 *   against its base, about 5 m at the corners (12 degrees over the
 *   height), so the planes slope and the tower reads as twisted shards;
 * - each long face rises to a tall sharp point at its step (121.9 m), the
 *   step drops steeply to 106.5 m, the diagonal blade face rises again to
 *   a lower point (117.5 m) and the notch drops to the next face (104 m):
 *   four tall points and four blades, standing 17-22 m over the roof,
 *   which is drawn at 100 m (Blas J's and Shalev97's views of the crown);
 * - the screens are open behind (sky shows through the notches); drawn
 *   as single glass planes 0.4 m thick, both faces glass;
 * - the glass pale sky blue, a light reflective curtain wall with faint
 *   horizontal joints; pale trim lines at every third floor and at the
 *   folds, per STYLE.md; the lobby glass, not stone, to the ground;
 * - the white Frost sunburst near the top of two faces, as a pale disc.
 * Slenderness: OSM's floorplate is 1,574 m2 (about 40 m square, 49 m
 * corner to corner), so the tower is about 3 : 1 to its main faces, as
 * the photos read; the plan is kept as OSM has it.
 * Estimated: the twist's amount and direction, the point heights, the
 * floor-line spacing (4.9 m floors), which faces carry the logo.
 * Left out: mullions, the parking garage to the west (way/648910881, its
 * own building, left to the map).
 *
 * Night: the office floors are `window` and glow; the crown screens are
 * `glass` and stay dark, as the screens have no rooms behind them.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 * - "Frost Tower San Antonio.jpg", Medialecent, CC BY 4.0
 * - "Frost Tower, San Antonio, Texas (50288787141).jpg", Nicolas Henderson, CC BY 2.0
 * - "Frost Tower from the corner of Flores and Travis streets.jpg", Wynne-Candy, CC BY-SA 4.0
 * - "Frost Tower.jpg", Blas J, CC BY-SA 4.0 (the crown)
 * - "Frost Tower SA.jpg", Shalev97, CC BY-SA 4.0 (the crown from afar)
 * No look-only sources used.
 *
 * Doubts: the plan is OSM's (the tower is newer than the lidar and NAIP
 * was not reachable); which end of each face is high was read from two
 * photos and assumed the same on all four sides (the pinwheel turns the
 * same way all round in every view).
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { PALETTE } from './palette'

export type XY = [number, number]

/** A plan ring counter-clockwise from above, without the closing point. */
export function ring(pts: XY[]): XY[] {
  const r = pts.length > 1 && pts[0][0] === pts[pts.length - 1][0] && pts[0][1] === pts[pts.length - 1][1] ? pts.slice(0, -1) : pts.slice()
  let s = 0
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    s += a[0] * b[1] - b[0] * a[1]
  }
  return s > 0 ? r : r.reverse()
}
/** Outward unit normal of the edge a->b of a CCW ring. */
export const outN = (a: XY, b: XY): XY => {
  const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1
  return [dy / l, -dx / l]
}
/** Offset a CCW ring outward by d (negative shrinks), by mitred edges. */
export function offset(r: XY[], d: number): XY[] {
  const n = r.length
  return r.map((p, i) => {
    const a = r[(i - 1 + n) % n], b = r[(i + 1) % n]
    const n1 = outN(a, p), n2 = outN(p, b)
    const m: XY = [n1[0] + n2[0], n1[1] + n2[1]]
    const k = 1 + n1[0] * n2[0] + n1[1] * n2[1]
    return [p[0] + (d * m[0]) / Math.max(k, 0.2), p[1] + (d * m[1]) / Math.max(k, 0.2)]
  })
}
const quadN = (p: Part, P: V3[], n: V3) => {
  const f = cross(sub(P[1], P[0]), sub(P[2], P[0]))
  if (f[0] * n[0] + f[1] * n[1] + f[2] * n[2] >= 0) p.quad(P[0], P[1], P[2], P[3])
  else p.quad(P[0], P[3], P[2], P[1])
}
/**
 * Vertical walls of a CCW ring from z0 to a top height per vertex (a
 * number, or a function of the vertex index), each edge flat-shaded.
 */
export function walls(p: Part, r: XY[], z0: number | ((i: number) => number), top: number | ((i: number) => number)) {
  const T = typeof top === 'number' ? () => top : top
  const B = typeof z0 === 'number' ? () => z0 : z0
  for (let i = 0; i < r.length; i++) {
    const j = (i + 1) % r.length, a = r[i], b = r[j], n = outN(a, b)
    quadN(p, [[a[0], a[1], B(i)], [b[0], b[1], B(j)], [b[0], b[1], T(j)], [a[0], a[1], T(i)]], [n[0], n[1], 0])
  }
}
/** Triangulate a simple CCW polygon (ear clipping) at height z, facing up or down. */
export function capPoly(p: Part, r: XY[], z: number | ((x: number, y: number) => number), up = true) {
  const Z = typeof z === 'number' ? () => z : z
  const idx = r.map((_, i) => i)
  const crossz = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inTri = (q: XY, a: XY, b: XY, c: XY) => crossz(a, b, q) > 1e-9 && crossz(b, c, q) > 1e-9 && crossz(c, a, q) > 1e-9
  let guard = 0
  while (idx.length > 3 && guard++ < 10000) {
    let cut = false
    for (let k = 0; k < idx.length; k++) {
      const ia = idx[(k - 1 + idx.length) % idx.length], ib = idx[k], ic = idx[(k + 1) % idx.length]
      const a = r[ia], b = r[ib], c = r[ic]
      if (crossz(a, b, c) <= 1e-9) continue
      if (idx.some((m) => m !== ia && m !== ib && m !== ic && inTri(r[m], a, b, c))) continue
      emit(a, b, c)
      idx.splice(k, 1)
      cut = true
      break
    }
    if (!cut) break
  }
  if (idx.length === 3) emit(r[idx[0]], r[idx[1]], r[idx[2]])
  function emit(a: XY, b: XY, c: XY) {
    const A: V3 = [a[0], a[1], Z(a[0], a[1])], Bv: V3 = [b[0], b[1], Z(b[0], b[1])], C: V3 = [c[0], c[1], Z(c[0], c[1])]
    if (up) p.tri(A, Bv, C)
    else p.tri(A, C, Bv)
  }
}
/**
 * Window panels set 0.05 m proud of each wall of a CCW ring: on every edge
 * at least `minLen` long, inset `inset` from the corners, one panel per
 * band in `bands` ([z0, z1] pairs). `skip(i)` leaves an edge plain.
 */
export function panels(p: Part, r: XY[], bands: [number, number][], inset = 0.8, minLen = 2.5, skip?: (i: number) => boolean, proud = 0.05) {
  for (let i = 0; i < r.length; i++) {
    if (skip?.(i)) continue
    const a = r[i], b = r[(i + 1) % r.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < minLen) continue
    const t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = outN(a, b)
    const A: XY = [a[0] + t[0] * inset + n[0] * proud, a[1] + t[1] * inset + n[1] * proud]
    const Bp: XY = [b[0] - t[0] * inset + n[0] * proud, b[1] - t[1] * inset + n[1] * proud]
    for (const [z0, z1] of bands) quadN(p, [[A[0], A[1], z0], [Bp[0], Bp[1], z0], [Bp[0], Bp[1], z1], [A[0], A[1], z1]], [n[0], n[1], 0])
  }
}
/**
 * A prism from z0 to z1 with a bevelled top edge: walls to z1 - bev, a
 * chamfer in by `bev`, and a flat top (in `topPart`, or none).
 */
export function bevelPrism(p: Part, r: XY[], z0: number, z1: number, bev = 0.4, topPart: Part | null = p, bottom = false) {
  walls(p, r, z0, z1 - bev)
  const inner = offset(r, -bev)
  for (let i = 0; i < r.length; i++) {
    const j = (i + 1) % r.length, a = r[i], b = r[j], ai = inner[i], bi = inner[j], n = outN(a, b)
    const nn: V3 = [n[0] * 0.7, n[1] * 0.7, 0.7]
    quadN(p, [[a[0], a[1], z1 - bev], [b[0], b[1], z1 - bev], [bi[0], bi[1], z1], [ai[0], ai[1], z1]], nn)
  }
  if (topPart) capPoly(topPart, inner, z1, true)
  if (bottom) capPoly(p, r, z0, false)
}

/**
 * Window panels in bays: on every edge of a CCW ring at least `minLen`
 * long, as many bays of about `bayW` as fit with `pier` of wall between
 * and at the ends, one panel per bay per band, 0.05 m proud.
 */
export function bayPanels(p: Part, r: XY[], bands: [number, number][], bayW = 3, pier = 1, minLen = 3, skip?: (i: number) => boolean, proud = 0.05) {
  for (let i = 0; i < r.length; i++) {
    if (skip?.(i)) continue
    const a = r[i], b = r[(i + 1) % r.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < minLen) continue
    const n = Math.max(1, Math.floor((L - pier) / (bayW + pier)))
    const w = (L - pier * (n + 1)) / n
    const t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], o = outN(a, b)
    for (let k = 0; k < n; k++) {
      const s0 = pier + k * (w + pier), s1 = s0 + w
      const A: XY = [a[0] + t[0] * s0 + o[0] * proud, a[1] + t[1] * s0 + o[1] * proud]
      const B: XY = [a[0] + t[0] * s1 + o[0] * proud, a[1] + t[1] * s1 + o[1] * proud]
      for (const [z0, z1] of bands) quadN(p, [[A[0], A[1], z0], [B[0], B[1], z0], [B[0], B[1], z1], [A[0], A[1], z1]], [o[0], o[1], 0])
    }
  }
}
/** A box from z0 to z1 with plan half-sizes hx, hy about (cx, cy), all six faces. */
export function box(p: Part, cx: number, cy: number, hx: number, hy: number, z0: number, z1: number, rot = 0) {
  const c = Math.cos(rot), s = Math.sin(rot)
  const pt = (u: number, v: number): XY => [cx + u * c - v * s, cy + u * s + v * c]
  const r = ring([pt(-hx, -hy), pt(hx, -hy), pt(hx, hy), pt(-hx, hy)])
  walls(p, r, z0, z1)
  capPoly(p, r, z1, true)
  capPoly(p, r, z0, false)
}
/** A regular polygon ring: n sides, apothem `ap`, a flat facing bearing `face` (degrees). */
export function regular(n: number, ap: number, face = 0, cx = 0, cy = 0): XY[] {
  const R = ap / Math.cos(Math.PI / n)
  const pts: XY[] = []
  for (let k = 0; k < n; k++) {
    const az = ((face + (360 / n) * (k + 0.5)) * Math.PI) / 180
    pts.push([cx + R * Math.sin(az), cy + R * Math.cos(az)])
  }
  return ring(pts)
}

// ------------------------------------------------------------------ build ---
if (import.meta.main) {
  // OSM way/581781219 in metres about its centroid (-98.494921, 29.426919).
  const PLAN = ring([
    [-2.2, -21.4], [14.1, -20.7], [14.2, -15.8], [24.3, -5.1], [21.3, -1.8], [20.5, 14.0], [16.7, 13.6], [4.7, 24.8],
    [1.8, 21.1], [-14.4, 21.1], [-14.3, 15.7], [-24.6, 4.7], [-20.8, 1.9], [-20.8, -14.3], [-16.1, -14.4], [-5.1, -24.5],
  ])
  const glassW = new Part()   // office curtain wall (lit)
  const screen = new Part()   // crown screens (dark at night)
  const trim = new Part()     // floor lines, fold lines, screen caps, logos
  const roof = new Part()
  const lobby = new Part()    // the ground-floor lobby glazing

  // Each arm is 4 vertices in the ring: face start, step, step end
  // (diagonal start), blade corner; the ring starts at the south face's
  // start. Each long face rises to a tall sharp point at its step, the
  // step drops steeply, the diagonal face rises again to a lower blade
  // point and the notch drops to the next face.
  const ROOF = 100.0, TIP = 121.9, BLADE = 117.5
  const tipZ = (i: number) => [104.0, TIP, 106.5, BLADE][i % 4]
  // The twist: every facet leans, its top turned clockwise (from above)
  // against its base, 12 degrees at the top (about 5 m at the corners).
  const TW = (-12 * Math.PI) / 180
  const rot = (p: XY, z: number): V3 => {
    const t = (TW * z) / TIP, c = Math.cos(t), s = Math.sin(t)
    return [p[0] * c - p[1] * s, p[0] * s + p[1] * c, z]
  }
  const N = PLAN.length
  const inner = offset(PLAN, -0.4)
  const facet = (p: Part, A: XY[], i: number, z0: number, z1i: number, z1j: number, out: boolean) => {
    const j = (i + 1) % N, n = outN(PLAN[i], PLAN[j])
    const Q: V3[] = [rot(A[i], z0), rot(A[j], z0), rot(A[j], z1j), rot(A[i], z1i)]
    quadN(p, Q, out ? [n[0], n[1], 0] : [-n[0], -n[1], 0])
  }
  for (let i = 0; i < N; i++) {
    const j = (i + 1) % N
    facet(lobby, PLAN, i, 0, 4.8, 4.8, true)
    // in slices of three floors, so the facets follow the twist and the
    // floor lines sit on them
    const SL = [4.8, ...Array.from({ length: 6 }, (_, k) => 4.8 + 3 * 4.9 * (k + 1)), ROOF]
    for (let k = 0; k < SL.length - 1; k++) facet(glassW, PLAN, i, SL[k], SL[k + 1], SL[k + 1], true)
    // the screens: the facet carried on past the roof to its sharp top,
    // 0.4 m thick, glass both sides, a pale cap on the top edge
    facet(screen, PLAN, i, ROOF, tipZ(i), tipZ(j), true)
    facet(screen, inner, i, ROOF - 0.3, tipZ(i), tipZ(j), false)
    quadN(trim, [rot(PLAN[i], tipZ(i)), rot(PLAN[j], tipZ(j)), rot(inner[j], tipZ(j)), rot(inner[i], tipZ(i))], [0, 0, 1])
  }
  {
    const R = offset(PLAN, -0.4).map((p) => rot(p, ROOF - 0.3))
    const r2 = R.map((p): XY => [p[0], p[1]])
    capPoly(roof, r2, ROOF - 0.3, true)
  }
  // Pale floor lines every third floor (4.9 m floors), turning with the facets.
  for (let k = 0; k <= 6; k++) {
    const z = 4.8 + 3 * 4.9 * k
    const O = offset(PLAN, 0.06)
    for (let i = 0; i < N; i++) {
      const j = (i + 1) % N, n = outN(PLAN[i], PLAN[j])
      quadN(trim, [rot(O[i], z - 0.17), rot(O[j], z - 0.17), rot(O[j], z + 0.17), rot(O[i], z + 0.17)], [n[0], n[1], 0])
    }
  }
  // Fold lines: a thin pale strip up every corner, leaning with the facets.
  for (let i = 0; i < N; i++) {
    const c = PLAN[i], b = PLAN[(i + 1) % N]
    const L = Math.hypot(b[0] - c[0], b[1] - c[1]), t: XY = [(b[0] - c[0]) / L, (b[1] - c[1]) / L]
    const n = outN(c, b)
    const p0: XY = [c[0] + n[0] * 0.07, c[1] + n[1] * 0.07], p1: XY = [p0[0] + t[0] * 0.4, p0[1] + t[1] * 0.4]
    quadN(trim, [rot(p0, 4.8), rot(p1, 4.8), rot(p1, tipZ(i) - 0.3), rot(p0, tipZ(i) - 0.3)], [n[0], n[1], 0])
  }
  // The Frost logo: a pale disc near the top of the south and north faces.
  for (const i of [0, 8]) {
    const j = i + 1, n = outN(PLAN[i], PLAN[j]), zc = 111.5, r = 2.0
    const at = (u: number, v: number): V3 => {
      const tt = 0.78 + u / Math.hypot(PLAN[j][0] - PLAN[i][0], PLAN[j][1] - PLAN[i][1])
      const p: XY = [PLAN[i][0] + (PLAN[j][0] - PLAN[i][0]) * tt + n[0] * 0.12, PLAN[i][1] + (PLAN[j][1] - PLAN[i][1]) * tt + n[1] * 0.12]
      return rot(p, zc + v)
    }
    for (let k = 0; k < 12; k++) {
      const a0 = (k / 12) * Math.PI * 2, a1 = ((k + 1) / 12) * Math.PI * 2
      const A = at(0, 0), B = at(r * Math.cos(a0), r * Math.sin(a0)), C = at(r * Math.cos(a1), r * Math.sin(a1))
      const f = cross(sub(B, A), sub(C, A))
      if (f[0] * n[0] + f[1] * n[1] >= 0) trim.tri(A, B, C)
      else trim.tri(A, C, B)
    }
  }

  const sky = 0x7f9fc4
  const parts = [
    { part: glassW, material: { name: 'window', color: sky, roughness: 0.3 } },
    { part: screen, material: { name: 'glass', color: sky, roughness: 0.3 } },
    { part: trim, material: PALETTE.trim },
    { part: roof, material: PALETTE.roof },
    { part: lobby, material: { name: 'entrance', color: 0x8fadcc, roughness: 0.3 } },
  ]
  const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
  if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
  const glb = writeGlb('Frost Tower', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
    bearing: 0, elevation: 0, height: TIP, anchor: [29.426919, -98.494921], replaces: ['way/581781219'],
  })
  if (glb.length > 250_000) throw new Error(`Size budget exceeded: ${glb.length} bytes`)
  const out = new URL('../models/sat-frost-tower.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}
