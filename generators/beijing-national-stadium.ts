/**
 * Beijing National Stadium (国家体育场, "Bird's Nest", 鸟巢), Olympic Green,
 * Chaoyang, Beijing (Herzog & de Meuron with Arup and CAG, opened 2008):
 * original procedural geometry, CC0-1.0.
 * bun generators/beijing-national-stadium.ts
 *
 * Writes two levels of detail in the same frame:
 * - models/beijing-national-stadium.glb, the low model (<= 6,500 tris): 24
 *   roof-to-ground girders, 32 steep facade columns and 16 stair diagonals,
 *   all broad flat box sections (4.3 m / 3.4 m wide, 1.6 m deep), the saddle,
 *   the membrane roof, the bowl;
 * - models/beijing-national-stadium.detail.glb (<= 40k tris, zoom 16): 24 +
 *   24 girders, 32 columns and 32 diagonals (3.3 / 3.1 / 2.7 m wide), closed
 *   box sections, finer curves, stepped tiers and five concourse slabs.
 *
 * Map frame: x east, y north, z up, metres. Anchor = area centroid of the
 * stadium outline, OSM way/152301551 (leisure=stadium, the outer of the
 * building=stadium multipolygon relation/563404): 116.390283, 39.991414.
 * Bearing 1.8: the outline's and the opening's long axis (area second
 * moments, 88.2 deg from east), so model +y runs north along the long axis.
 *
 * Identity, in order: the woven exterior of huge interlaced grey steel box
 * members, modelled as members, not a texture; the saddle-shaped top edge,
 * high on the long east and west sides and low at the north and south ends;
 * the red concrete bowl seen between the steel (glowing red at night); the
 * oval roof opening with the translucent membrane infill on the roof.
 *
 * Evidence
 *  - Plan (OSM, measured): outline way/152301551, 303.2 x 329.1 m, fitted as
 *    a superellipse half 152 x 164.5 m, exponent 2.3 (polar radii checked
 *    every 15 deg, within ~1 m). Published 296.4 x 332.3 m (zh.wikipedia,
 *    "长轴为332.3米，短轴为296.4米"); OSM is followed. Roof opening = the
 *    relation's inner way/261554590, 126.4 x 184.9 m, an ellipse (half 63.5
 *    x 92, checked within 1 m).
 *  - Heights: published roof highest 68.5 m, lowest 42.8 m, 69.21 m above
 *    ground overall (zh.wikipedia). OSM's 16 building:parts (ways
 *    1459376699-716, heights 40-68.5 m) are contour bands of the roof: 68.5
 *    at the outer edge mid-east and mid-west, falling towards the ends
 *    (40-48 m) and towards the opening (~56 m at the opening mid-side,
 *    ~40-44 m at its ends). Drawn: rim 42.8 + 25.3 cos^2(phi) (members on
 *    it top out at 69.2 m), inner edge 40.5 + 15.5 cos^2(phi), the roof
 *    sagging between (estimated from the part bands).
 *  - Structure: 24 trussed columns (published, en/zh.wikipedia). The real
 *    primary roof girders run straight in plan, tangent to the opening, and
 *    continue down the facade as the columns; drawn so: 24 girders tangent
 *    to the opening, carried over a rounded shoulder (~7.5 m, photos) and
 *    down the facade leaning as they met the rim (clamped to ~27 deg from
 *    vertical); secondary girders tangent to an ellipse 1.45 x / 1.3 x the
 *    opening, leaning up to ~40 deg; and shallow diagonals (56-65 deg, the
 *    stair members) climbing from the ground. The real weave is irregular
 *    and denser; this pattern and its spacing are ESTIMATED (photos), not
 *    traced member by member. Steep columns (5-18 deg from vertical) run
 *    from the ground over the shoulder between the girders' feet. Members
 *    drawn as broad flat bands, wider than the real ~1.2 m boxes, so the
 *    steel covers roughly the share of the facade it does in the photos.
 *  - Facade profile: leans out ~7% of the radius from the ground to the
 *    shoulder (photos am1, ce1: the ends overhang their base); estimated.
 *  - Roof: translucent membrane (ETFE above, PTFE ceiling below, zh.wikipedia)
 *    drawn as `glass` at 0.7 opacity over a pale soffit, with a 7 m skirt
 *    round the opening (interior photo, estimated).
 *  - Bowl (estimated, interior photo "WiNG" and facade photos): three red
 *    tiers rising from an elliptical field edge (half 58 x 95 m), east and
 *    west stands higher than the ends (published), under the roof's soffit;
 *    the bowl's outer wall a red band at the foot, then the dark grey of
 *    the concourses in shadow with red patches (stair towers) in every third
 *    bay of the middle levels, and dark grey concourse slabs.
 *  - Elevation 0: field taken at street level. zh.wikipedia gives one
 *    basement level but no field depth; doubt.
 *  - Colours (daylight photos, pulled to the palette): steel silver grey
 *    #d0d4d9; the bowl's red #c4544a (neon-nest-red, glows red at night as
 *    in the night photos p23 and am4); seats #b04b44; the interior in
 *    shadow nest-shadow #585e66; soffit, skirt and inner fascias cream
 *    #efe4d3 (neon-nest-glow: the roof's underside is lit warm at night);
 *    membrane grey-silver #9ba7b1 at 0.7 opacity. Steel carries a warm floodlight wash (night photos).
 *  - Photos (Wikimedia Commons, all EVIDENCE):
 *    - ce1 "Beijing China Beijing-National-Stadium-01.jpg", CEphoto, Uwe
 *      Aranas, CC BY-SA 3.0 (end view: saddle, shoulder, weave)
 *    - ce2 "...-02.jpg" and ce3 "...-03.jpg", same author and licence
 *      (three-quarter view; roof members and membrane close up)
 *    - am1 "Beijing national stadium 1.jpg", Arne Müseler, CC BY-SA 3.0 de
 *    - am4 "Beijing national stadium 4 cropped.jpg", Arne Müseler, CC BY-SA
 *      4.0 (night, corner: members, red bowl)
 *    - axis "Beijing National Stadium from the Central Axis
 *      (20220905140702).jpg", N509FZ, CC BY-SA 4.0 (from the south)
 *    - p23 "Beijing national stadium.jpg", Peter23, CC BY-SA 3.0 (night)
 *    - "Beijing National Stadium Interior.jpg", WiNG, CC BY-SA 3.0 (bowl,
 *      tiers, soffit, opening)
 *    - pd2 "National Stadium Beijing 2.jpg", Galaxyharrylion, public domain
 *  - Look-only references: none.
 *  - Not modelled: the field and track (the map's), the Olympic cauldron on
 *    the north-east roof, the entrance canopies and kiosks round the base,
 *    the raised plaza and its stone retaining wall.
 *
 * Doubts: no licensed aerial or tower view was found, so the roof's member
 * pattern is a reconstruction from ground photos and the published
 * tangent-to-the-opening scheme; the bowl and tier heights are estimated;
 * the field level. Map terrain here is Mapterhorn z12 only (z13+ 404), a
 * surface model that includes the stadium itself as a ~36 m mound; the map
 * fills only under the model's covered plan, and the open field has no
 * geometry, so `terrain.ts check` reports the lower tier buried under that
 * mound inside the bowl (see the builder report).
 */
import { Part, cross, sub, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const TAU = Math.PI * 2
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const unit = (a: V3): V3 => mul(a, 1 / (Math.hypot(a[0], a[1], a[2]) || 1))
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v))
type Mat = { part: Part; material: MaterialSpec }

/** A flat quad, wound to face `n`. */
function quadN(p: Part, a: V3, b: V3, c: V3, d: V3, n: V3) {
  const N = unit(n)
  p.tri(a, b, c, undefined, undefined, undefined, [N, N, N])
  p.tri(a, c, d, undefined, undefined, undefined, [N, N, N])
}
/** A smooth quad with per-corner normals (winding follows them). */
function quadS(p: Part, a: V3, b: V3, c: V3, d: V3, na: V3, nb: V3, nc: V3, nd: V3) {
  p.tri(a, b, c, undefined, undefined, undefined, [na, nb, nc])
  p.tri(a, c, d, undefined, undefined, undefined, [na, nc, nd])
}

// ---------------------------------------------------------------------------
// Plan and heights (model frame: +x east, +y north along the long axis)

/** Polar radius of a superellipse with half-axes a (x), b (y). */
const rSE = (phi: number, a: number, b: number, n: number) =>
  1 / Math.pow(Math.pow(Math.abs(Math.cos(phi)) / a, n) + Math.pow(Math.abs(Math.sin(phi)) / b, n), 1 / n)

const OA = 152, OB = 164.5, ON = 2.3 // the roof's outer edge (OSM way/152301551)
const IA = 63.5, IB = 92 // the roof opening (OSM inner way/261554590)
const rOut = (phi: number) => rSE(phi, OA, OB, ON)
const rIn = (phi: number) => rSE(phi, IA, IB, 2)
const c2 = (phi: number) => Math.cos(phi) ** 2
/** Height of the roof's outer edge: the saddle, 68.1 m mid-side (members to 69.2), 42.8 m at the ends. */
const H = (phi: number) => 42.8 + 25.3 * c2(phi)
/** Height of the roof's inner edge round the opening. */
const HIN = (phi: number) => 40.5 + 15.5 * c2(phi)
const RIM = 0.955 // the roof's flat top meets the shoulder, as a share of rOut
const SKIRT = 7 // the opening's inner skirt hangs this far below the inner edge

/** Roof top at polar angle phi, u = 0 at the rim to 1 at the opening. */
const roofZU = (phi: number, u: number) => {
  u = clamp(u, 0, 1)
  return H(phi) + (HIN(phi) - H(phi)) * (0.5 * u + 0.5 * u * u)
}
const roofU = (phi: number, r: number) => (RIM * rOut(phi) - r) / (RIM * rOut(phi) - rIn(phi))
const roofZ = (x: number, y: number) => {
  const phi = Math.atan2(y, x)
  return roofZU(phi, roofU(phi, Math.hypot(x, y)))
}
const roofN = (x: number, y: number): V3 => {
  const e = 0.5
  return unit([-(roofZ(x + e, y) - roofZ(x - e, y)) / (2 * e), -(roofZ(x, y + e) - roofZ(x, y - e)) / (2 * e), 1])
}

/**
 * The shoulder and facade, from the rim (k = 0) over the rounded edge and
 * down to the ground (k = 6): [share of rOut, height from the rim height h].
 * The facade leans out as it rises, ~7% of the radius (photos).
 */
const PROF: Array<[number, (h: number) => number]> = [
  [RIM, (h) => h],
  [0.979, (h) => h - 1.4],
  [0.994, (h) => h - 3.8],
  [1.0, (h) => h - 7.5],
  [0.992, (h) => 0.7 * h],
  [0.967, (h) => 0.36 * h],
  [0.935, () => 0],
]
const KMAX = PROF.length - 1
function skin(phi: number, k: number): V3 {
  k = clamp(k, 0, KMAX)
  const i = Math.min(KMAX - 1, Math.floor(k)), f = k - i
  const h = H(phi), r0 = rOut(phi)
  // Catmull-Rom through the profile nodes keeps the shoulder round.
  const node = (j: number) => {
    const q = PROF[clamp(j, 0, KMAX)]
    return [q[0] * r0, q[1](h)] as [number, number]
  }
  const p0 = node(i - 1), p1 = node(i), p2 = node(i + 1), p3 = node(i + 2)
  const cr = (a: number, b: number, c: number, d: number) =>
    0.5 * (2 * b + (-a + c) * f + (2 * a - 5 * b + 4 * c - d) * f * f + (-a + 3 * b - 3 * c + d) * f * f * f)
  const r = cr(p0[0], p1[0], p2[0], p3[0]), z = cr(p0[1], p1[1], p2[1], p3[1])
  return [r * Math.cos(phi), r * Math.sin(phi), Math.max(0, z)]
}
function skinN(phi: number, k: number): V3 {
  const e = 0.002, ek = 0.02
  const dphi = sub(skin(phi + e, k), skin(phi - e, k))
  const dk = sub(skin(phi, Math.min(KMAX, k + ek)), skin(phi, Math.max(0, k - ek)))
  return unit(cross(dk, dphi))
}

// ---------------------------------------------------------------------------
// Members

type Path = { p: V3[]; n: V3[] }

/** Walk the facade from k0 to k1 starting at phi0, drifting sideways by `lean` (tan of the angle from the fall line). */
function facadePath(phi0: number, k0: number, k1: number, lean: number, steps: number): Path {
  const p: V3[] = [], n: V3[] = []
  let phi = phi0
  let prev = skin(phi, k0)
  for (let s = 0; s <= steps; s++) {
    const k = k0 + ((k1 - k0) * s) / steps
    const q0 = skin(phi, k)
    const ds = s ? Math.hypot(q0[0] - prev[0], q0[1] - prev[1], q0[2] - prev[2]) : 0
    phi += (lean * ds) / Math.hypot(q0[0], q0[1])
    const q = skin(phi, k)
    p.push(q)
    n.push(skinN(phi, k))
    prev = q
  }
  return { p, n }
}

/** Where the plan ray from `a` along `d` crosses the rim. */
function rimHit(a: [number, number], d: [number, number]): number {
  const g = (l: number) => {
    const x = a[0] + d[0] * l, y = a[1] + d[1] * l
    return Math.hypot(x, y) - RIM * rOut(Math.atan2(y, x))
  }
  let lo = 0, hi = 500
  for (let i = 0; i < 50; i++) {
    const m = (lo + hi) / 2
    if (g(m) < 0) lo = m
    else hi = m
  }
  return lo
}

/**
 * One primary member: a straight roof girder tangent to an ellipse round the
 * opening (as the real 24 are tangent to the opening), turning down over the
 * shoulder at both ends and running down the facade to the ground, leaning
 * as the girder met the rim.
 */
function girder(ta: number, tb: number, tau: number, o: { roofSteps: number; facadeSteps: number; leanK: number; maxLean: number }): Path {
  const T: [number, number] = [ta * Math.cos(tau), tb * Math.sin(tau)]
  const D0: [number, number] = [-ta * Math.sin(tau), tb * Math.cos(tau)]
  const dl = Math.hypot(D0[0], D0[1])
  const D: [number, number] = [D0[0] / dl, D0[1] / dl]
  const l2 = rimHit(T, D), l1 = rimHit(T, [-D[0], -D[1]])
  const P1: [number, number] = [T[0] - D[0] * l1, T[1] - D[1] * l1]
  const P2: [number, number] = [T[0] + D[0] * l2, T[1] + D[1] * l2]
  const leanAt = (P: [number, number], d: [number, number]) => {
    const phi = Math.atan2(P[1], P[0])
    const rr: [number, number] = [Math.cos(phi), Math.sin(phi)], tt: [number, number] = [-Math.sin(phi), Math.cos(phi)]
    const beta = Math.atan2(d[0] * tt[0] + d[1] * tt[1], d[0] * rr[0] + d[1] * rr[1])
    return Math.tan(clamp(beta * o.leanK, -o.maxLean, o.maxLean))
  }
  const f1 = facadePath(Math.atan2(P1[1], P1[0]), 0, KMAX, leanAt(P1, [-D[0], -D[1]]), o.facadeSteps)
  const f2 = facadePath(Math.atan2(P2[1], P2[0]), 0, KMAX, leanAt(P2, D), o.facadeSteps)
  const p: V3[] = [], n: V3[] = []
  for (let i = f1.p.length - 1; i > 0; i--) { p.push(f1.p[i]); n.push(f1.n[i]) }
  for (let i = 0; i <= o.roofSteps; i++) {
    const t = i / o.roofSteps
    const x = lerp(P1[0], P2[0], t), y = lerp(P1[1], P2[1], t)
    p.push([x, y, roofZ(x, y)])
    n.push(roofN(x, y))
  }
  for (let i = 1; i < f2.p.length; i++) { p.push(f2.p[i]); n.push(f2.n[i]) }
  return { p, n }
}

/** Sweep a box-section member along a path, its base on the skin, `w` wide and `h` proud. */
function sweepMember(part: Part, path: Path, w: number, h: number, bottom: boolean, capEnds: boolean) {
  const { p, n } = path
  const secs: V3[][] = []
  const frames: Array<{ S: V3; U: V3 }> = []
  for (let i = 0; i < p.length; i++) {
    const T = unit(sub(p[Math.min(p.length - 1, i + 1)], p[Math.max(0, i - 1)]))
    const S = unit(cross(T, n[i]))
    const U = unit(cross(S, T))
    const C = add(p[i], mul(U, -0.25))
    secs.push([add(C, mul(S, -w / 2)), add(C, mul(S, w / 2)), add(add(C, mul(S, w / 2)), mul(U, h)), add(add(C, mul(S, -w / 2)), mul(U, h))])
    frames.push({ S, U })
  }
  for (let i = 0; i < p.length - 1; i++) {
    // Per-section normals, so consecutive segments share their corners.
    const a = secs[i], b = secs[i + 1]
    const { S: Sa, U: Ua } = frames[i], { S: Sb, U: Ub } = frames[i + 1]
    const nS = (v: V3) => mul(v, -1)
    quadS(part, a[3], a[2], b[2], b[3], Ua, Ua, Ub, Ub) // outer face
    quadS(part, a[1], b[1], b[2], a[2], Sa, Sb, Sb, Sa)
    quadS(part, a[0], a[3], b[3], b[0], nS(Sa), nS(Sa), nS(Sb), nS(Sb))
    if (bottom) quadS(part, a[0], b[0], b[1], a[1], nS(Ua), nS(Ub), nS(Ub), nS(Ua))
  }
  if (capEnds) {
    const a = secs[0], b = secs[secs.length - 1]
    const T0 = unit(sub(p[0], p[1])), T1 = unit(sub(p[p.length - 1], p[p.length - 2]))
    quadN(part, a[0], a[1], a[2], a[3], T0)
    quadN(part, b[0], b[1], b[2], b[3], T1)
  }
}

// ---------------------------------------------------------------------------
// The concrete bowl inside the steel

/** The stands' plan: an ellipse growing from the field's edge (t = 0) to the bowl's back wall (t = 1). */
const SA = (t: number) => 58 + 70 * t
const SB = (t: number) => 95 + 50 * t
const standPt = (th: number, t: number, z: number): V3 => [SA(t) * Math.cos(th), SB(t) * Math.sin(th), z]
/** Sides higher than the ends (published: east and west stands higher); scaled to fit under the roof. */
const standScale = (th: number) => 0.7 + 0.3 * c2(th)
/** Tiers as [t, z at mid-side]: lower, middle and upper, with the box and fascia walls between. */
const TIERS: Array<{ seat: [number, number][]; } > = [
  { seat: [[0.0, 1.6], [0.3, 13.5]] },
  { seat: [[0.34, 18.5], [0.53, 26.5]] },
  { seat: [[0.57, 30.5], [0.97, 46]] },
]
const BOWL_TOP = 50 // the back wall's top at mid-side, under the roof's soffit

function bowl(seat: Part, wall: Part, red: Part, grey: Part, n: number, detail: boolean) {
  const ring = (t: number, z: (th: number) => number) =>
    Array.from({ length: n + 1 }, (_, i) => { const th = (i / n) * TAU; return standPt(th, t, z(th)) })
  const sc = (z: number) => (th: number) => z * standScale(th)
  const outN = (th: number): V3 => unit([Math.cos(th) / SA(0.5), Math.sin(th) / SB(0.5), 0])
  // Seating surfaces, each tier cut into rakes.
  for (const tier of TIERS) {
    const [[t0, z0], [t1, z1]] = tier.seat
    const steps = detail ? 4 : 1
    for (let s = 0; s < steps; s++) {
      const ta = lerp(t0, t1, s / steps), tb = lerp(t0, t1, (s + 1) / steps)
      const za = lerp(z0, z1, s / steps), zb = lerp(z0, z1, (s + 1) / steps)
      const A = ring(ta, sc(za)), B = ring(tb, sc(zb))
      for (let i = 0; i < n; i++) {
        const th = ((i + 0.5) / n) * TAU
        const o = outN(th)
        quadN(seat, A[i], A[i + 1], B[i + 1], B[i], unit(add([0, 0, 1], mul(o, -0.7))))
      }
    }
  }
  // Walls between the tiers (box fronts and fascias), facing the field.
  const fronts: Array<[number, number, number]> = [[0, 0, 1.6], [0.3, 13.5, 13.5], [0.34, 13.5, 18.5], [0.53, 26.5, 26.5], [0.57, 26.5, 30.5]]
  // pairs: horizontal ledges (t from previous to next) are drawn as quads below
  const vert = (t: number, za: number, zb: number) => {
    const A = ring(t, sc(za)), B = ring(t, sc(zb))
    for (let i = 0; i < n; i++) {
      const th = ((i + 0.5) / n) * TAU
      quadN(wall, A[i], A[i + 1], B[i + 1], B[i], mul(outN(th), -1))
    }
  }
  const ledge = (ta: number, tb: number, z: number) => {
    const A = ring(ta, sc(z)), B = ring(tb, sc(z))
    for (let i = 0; i < n; i++) quadN(wall, A[i], A[i + 1], B[i + 1], B[i], [0, 0, 1])
  }
  vert(0, 0, 1.6)
  ledge(0.3, 0.34, 13.5); vert(0.34, 13.5, 18.5)
  ledge(0.53, 0.57, 26.5); vert(0.57, 26.5, 30.5)
  void fronts
  // The back of the upper tier up to the soffit.
  const top = (th: number) => BOWL_TOP * standScale(th)
  {
    const A = ring(0.97, sc(46)), B = ring(0.97, top)
    for (let i = 0; i < n; i++) quadN(wall, A[i], A[i + 1], B[i + 1], B[i], mul(outN(((i + 0.5) / n) * TAU), -1))
  }
  // The bowl's red outer wall (lit red at night), seen through the steel.
  {
    // A red band at the foot (the stair cores and the bowl's underside),
    // then the dark grey of the concourses in shadow, with red patches
    // (stair towers) in every third bay up the middle levels (photos).
    const A = ring(1, () => 0), M = ring(1, (th) => top(th) * 0.2), M1 = ring(1, (th) => top(th) * 0.42), M2 = ring(1, (th) => top(th) * 0.66), B = ring(1, top)
    for (let i = 0; i < n; i++) {
      const o = outN(((i + 0.5) / n) * TAU)
      quadN(red, A[i], M[i], M[i + 1], A[i + 1], o)
      quadN(grey, M[i], M1[i], M1[i + 1], M[i + 1], o)
      quadN(i % 3 === 1 ? red : grey, M1[i], M2[i], M2[i + 1], M1[i + 1], o)
      quadN(grey, M2[i], B[i], B[i + 1], M2[i + 1], o)
    }
  }
  // Concourse slabs round the bowl: pale bands between the red walls.
  const slabs = detail ? [0.17, 0.34, 0.5, 0.66, 0.82] : [0.24, 0.5, 0.76]
  const reach = detail ? 7 : 6
  for (const f of slabs) {
    const zf = (th: number) => top(th) * f
    const inner = ring(1, zf)
    const outer = inner.map((q, i) => {
      const th = (i / n) * TAU
      return add(q, mul(outN(th), reach)) as V3
    })
    const lower = outer.map((q) => [q[0], q[1], q[2] - 2.2] as V3)
    for (let i = 0; i < n; i++) {
      const o = outN(((i + 0.5) / n) * TAU)
      quadN(grey, inner[i], outer[i], outer[i + 1], inner[i + 1], [0, 0, 1])
      quadN(grey, lower[i], lower[i + 1], outer[i + 1], outer[i], o)
      if (detail) {
        const il = inner.map((q) => [q[0], q[1], q[2] - 2.2] as V3)
        quadN(red, il[i], il[i + 1], lower[i + 1], lower[i], [0, 0, -1])
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Roof skin: the translucent membrane on top, the pale soffit and skirt

function roofSkin(glass: Part, soffit: Part, n: number, radial: number, under: boolean) {
  // Membrane: from the shoulder (k = 3) over the rim and across to the opening.
  const rows: Array<(phi: number) => { p: V3; n: V3 }> = []
  for (const k of [3, 2, 1]) rows.push((phi) => ({ p: add(skin(phi, k), mul(skinN(phi, k), -0.1)), n: skinN(phi, k) }))
  for (let j = 0; j <= radial; j++) {
    const u = j / radial
    rows.push((phi) => {
      const r = lerp(RIM * rOut(phi), rIn(phi), u)
      const x = r * Math.cos(phi), y = r * Math.sin(phi)
      return { p: [x, y, roofZU(phi, u) - 0.1], n: roofN(x, y) }
    })
  }
  const grid = rows.map((f) => Array.from({ length: n + 1 }, (_, i) => f((i / n) * TAU)))
  for (let j = 0; j < grid.length - 1; j++)
    for (let i = 0; i < n; i++) {
      const a = grid[j][i], b = grid[j][i + 1], c = grid[j + 1][i + 1], d = grid[j + 1][i]
      quadS(glass, a.p, b.p, c.p, d.p, a.n, b.n, c.n, d.n)
    }
  // Skirt round the opening and the soffit under the roof (white PTFE ceiling).
  const sk = (phi: number, drop: number, s = 1): V3 => {
    const r = rIn(phi) * s
    return [r * Math.cos(phi), r * Math.sin(phi), HIN(phi) - drop]
  }
  for (let i = 0; i < n; i++) {
    const p0 = (i / n) * TAU, p1 = ((i + 1) / n) * TAU
    const m = (p0 + p1) / 2
    const inward: V3 = [-Math.cos(m), -Math.sin(m), 0]
    quadN(soffit, sk(p0, 0), sk(p1, 0), sk(p1, SKIRT, 0.99), sk(p0, SKIRT, 0.99), inward)
    quadN(soffit, sk(p0, 0), sk(p0, SKIRT, 0.99), sk(p1, SKIRT, 0.99), sk(p1, 0), mul(inward, -1))
  }
  // Soffit: from the skirt's foot rising out to under the shoulder.
  const soffitPt = (phi: number, u: number): V3 => {
    const r = lerp(rIn(phi) * 0.99, 0.975 * rOut(phi), u)
    const z = lerp(HIN(phi) - SKIRT, H(phi) - 11, Math.pow(u, 0.8))
    return [r * Math.cos(phi), r * Math.sin(phi), z]
  }
  const sr = 3
  for (let j = 0; j < sr; j++)
    for (let i = 0; i < n; i++) {
      const p0 = (i / n) * TAU, p1 = ((i + 1) / n) * TAU
      const a = soffitPt(p0, j / sr), b = soffitPt(p1, j / sr), c = soffitPt(p1, (j + 1) / sr), d = soffitPt(p0, (j + 1) / sr)
      if (under) quadN(soffit, a, d, c, b, [0, 0, -1])
      quadN(soffit, a, b, c, d, [0, 0, 1])
    }
}

// ---------------------------------------------------------------------------

type Lod = {
  primary: number; secondary: number; stairs: number; columns: number; wc: number
  roofSteps: number; facadeSteps: number
  w: number; h: number; w2: number; h2: number; bottom: boolean
  ring: number; radial: number; bowlN: number; detail: boolean
}
const LOW: Lod = { primary: 24, secondary: 0, stairs: 16, columns: 32, wc: 4.3, roofSteps: 5, facadeSteps: 5, w: 4.3, h: 1.6, w2: 3.4, h2: 1.4, bottom: false, ring: 48, radial: 3, bowlN: 32, detail: false }
const DETAIL: Lod = { primary: 24, secondary: 24, stairs: 32, columns: 32, wc: 3.1, roofSteps: 14, facadeSteps: 16, w: 3.3, h: 1.6, w2: 2.7, h2: 1.3, bottom: true, ring: 96, radial: 6, bowlN: 96, detail: true }

function build(L: Lod): Mat[] {
  const steel = new Part(), glass = new Part(), stone = new Part(), red = new Part(), seats = new Part(), grey = new Part()

  // Primary girders tangent to the opening, all turning the same way, like
  // the real roof's pinwheel of 24.
  for (let i = 0; i < L.primary; i++) {
    const tau = ((i + 0.5) / L.primary) * TAU
    sweepMember(steel, girder(IA + 1, IB + 1, tau, { roofSteps: L.roofSteps, facadeSteps: L.facadeSteps, leanK: 0.7, maxLean: 0.5 }), L.w, L.h, L.bottom, false)
  }
  // Secondary girders, tangent to a wider ellipse and turning the other way.
  for (let i = 0; i < L.secondary; i++) {
    const tau = -((i + 0.25) / L.secondary) * TAU
    sweepMember(steel, girder(IA * 1.45, IB * 1.3, tau, { roofSteps: L.roofSteps, facadeSteps: L.facadeSteps, leanK: 0.9, maxLean: 0.95 }), L.w2, L.h2, L.bottom, false)
  }
  // The stairs and secondary facade members: long shallow diagonals
  // climbing the facade from the ground to under the shoulder.
  for (let i = 0; i < L.stairs; i++) {
    const phi = ((i + 0.3) / L.stairs) * TAU
    const dir = i % 2 ? 1 : -1
    const path = facadePath(phi, KMAX, 2.2, dir * (i % 4 < 2 ? 1.5 : 2.1), L.facadeSteps)
    sweepMember(steel, path, L.w2, L.h2, L.bottom, true)
  }

  // The steep primaries: broad columns running from the ground up over
  // the shoulder, leaning a little either way, between the girders' feet.
  for (let i = 0; i < L.columns; i++) {
    const phi = ((i + 0.75) / L.columns) * TAU
    const lean = (i % 2 ? 1 : -1) * (i % 4 < 2 ? 0.18 : 0.32)
    sweepMember(steel, facadePath(phi, KMAX, 0.5, lean, L.facadeSteps + 1), L.wc, L.h, L.bottom, true)
  }

  roofSkin(glass, stone, L.ring, L.radial, L.detail)
  // Members end at the ground: nothing below y = 0 (glTF y is index 1).
  for (let i = 1; i < steel.pos.length; i += 3) if (steel.pos[i] < 0) steel.pos[i] = 0
  bowl(seats, stone, red, grey, L.bowlN, L.detail)

  const lit = (_p: V3, n: V3) => (n[2] > 0.8 ? 0.35 : 0.85)
  return [
    { part: steel, material: { ...finish('nest-steel', 0xd0d4d9), floodlight: lit } },
    { part: red, material: finish('neon-nest-red', 0xc4544a) },
    { part: seats, material: finish('nest-seats', 0xb04b44) },
    { part: stone, material: finish('neon-nest-glow', 0xefe4d3) },
    { part: grey, material: finish('nest-shadow', 0x585e66) },
    { part: glass, material: { ...PALETTE.glass, color: 0x9ba7b1, opacity: 0.7, doubleSided: true } },
  ]
}

async function write(file: string, parts: Mat[], maxTris: number, maxBytes: number) {
  const used = parts.filter((x) => x.part.triangles > 0)
  const triangles = used.reduce((t, { part }) => t + part.triangles, 0)
  console.log(file, used.map((x) => `${x.material.name}:${x.part.triangles}`).join(' '))
  if (triangles > maxTris) throw new Error(`${file}: triangle budget exceeded: ${triangles}`)
  const glb = writeGlb("Beijing National Stadium (Bird's Nest)", used, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
    bearing: 1.8, elevation: 0, height: 68.5,
  })
  if (glb.length > maxBytes) throw new Error(`${file}: size budget exceeded: ${glb.length} bytes`)
  const out = new URL(`../models/${file}`, import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}

await write('beijing-national-stadium.glb', build(LOW), 6500, 250_000)
await write('beijing-national-stadium.detail.glb', build(DETAIL), 40_000, 1536 * 1024)
