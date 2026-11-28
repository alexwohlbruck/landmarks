/**
 * Jewel Changi Airport (Safdie Architects with RSP, 2019): the toroidal
 * glass-and-steel dome in front of Changi Terminal 1, with its oculus and the
 * Rain Vortex falling through it, the terraced Forest Valley and the ring of
 * shop floors inside — procedural, CC0-1.0, no textures.
 *   bun generators/singapore-changi-jewel.ts
 * Writes models/singapore-changi-jewel.glb (low) and
 * models/singapore-changi-jewel.detail.glb (detail: the whole landmark again,
 * with the triangular steel grid as thin grey bars, trees in the valley and the
 * Canopy Bridge).
 *
 * Map frame: x = model east, y = model north, z up, metres. Placed at bearing
 * 23.1°, the airport grid (the Jewel basement rectangle way/547383951 and the
 * terminals run 23.1° / 113.1°), so model +y points at Terminal 1 and the
 * dome's long axis is model x. Anchor: the centre of the ellipse fitted (least
 * squares, 68 of the outline's 80 nodes) to the dome outline way/744520551:
 * 103.9897491, 1.3602219.
 *
 * Identifying features (photos): a squashed glass doughnut wider than tall,
 * its flanks rolling down to near-vertical glass at the ground; the oculus,
 * a funnel in the roof south of the middle with a bright collar, and the
 * Rain Vortex falling from it; a triangulated diagonal steel grid all over;
 * arched portals where the link bridges and the Skytrain go in; the green
 * terraces and lit shop floors seen through the glass, glowing at night.
 *
 * Evidence
 * - OSM (© OpenStreetMap contributors, ODbL): way/744520551 (Jewel Changi
 *   Airport, building=commercial, height 37, building:levels 5, roof:shape
 *   dome); way/720156415 (HSBC Rain Vortex pool, centroid 103.989708,
 *   1.360121, i.e. model (0.2, −12.1)); ways 1391092317 / 173016139 (the
 *   Skytrain's building passage through Jewel, model y 2.3 … 6.4, x −101 …
 *   +102, level 2); way/744342469 (Canopy Bridge, level 4, model y ≈ 20);
 *   way/1391092327 and the outline's bumps at (±100, −40) (link-bridge
 *   entrances); the shops mapped as buildings inside (744528858 FairPrice,
 *   743758480 Coffee Bean, 743758495 Samsonite) and Jewel's basement outline
 *   547383951.
 * - Published (Wikipedia, "Jewel Changi Airport"): the roof spans 200 × 150 m
 *   with more than 9,000 glass panels on a steel lattice (the fitted ellipse is
 *   204 × 153 m); five storeys above ground; Rain Vortex 40 m high, falling to
 *   the basement (so the oculus is about 30 m above the ground); Canopy Park on
 *   the top level; Canopy Bridge 23 m above the ground; Forest Valley over five
 *   storeys. Safdie's project page read for the dimensions only.
 * - Photos (evidence):
 *   https://commons.wikimedia.org/wiki/File:Jewel_Changi_Airport_exterior_with_control_tower.png
 *     (RectorRocks, CC BY-SA 4.0) the dome from the south-west, with a portal arch;
 *   https://commons.wikimedia.org/wiki/File:Singapore_Changi_Airport_with_Jewel_in_the_background.jpg
 *     (George Tan, CC BY 2.0) the long low profile from the south;
 *   https://commons.wikimedia.org/wiki/File:Jewel_Changi_Airport_sunset.jpg
 *     (Gerald Waldo Luis, CC BY-SA 4.0) the flank from a link bridge, oblique from above;
 *   https://commons.wikimedia.org/wiki/File:Jewel_Mall_-_Near.Singapore.Terminal_1.jpg
 *     (Samyamlpradhan, CC BY-SA 4.0) the near-vertical diagrid glass at the base;
 *   https://commons.wikimedia.org/wiki/File:Project_Jewel_Photo_1.jpg
 *     (Changi Airport Group, CC BY 3.0) the design rendering: overall shape at dusk;
 *   https://commons.wikimedia.org/wiki/File:Jewel-Changi_Airport.jpg
 *     (LanBo0428, CC BY-SA 4.0) the oculus, the funnel and the diagrid from inside;
 *   https://commons.wikimedia.org/wiki/File:Jewel_Mall_within_Changi_Airport_area_in_Singapore_-_Ypphotography.jpg
 *     (Phuan Yan Penh, CC BY-SA 4.0) the oculus collar and the vortex;
 *   https://commons.wikimedia.org/wiki/File:Singapore_Airport,_Jewel_Changi,_20230722_(2)_(53337065472).jpg
 *     (Takeshi Aida, CC BY-SA 2.0) night: the lit vortex, the Skytrain deck;
 *   https://commons.wikimedia.org/wiki/File:Night_Light_Jewel_Changi_Singapore_Feb23_R16_06864.jpg
 *     (Timothy A. Gonsalves, CC BY-SA 4.0) night: lit forest and shop floors.
 * - No lidar (none open for Singapore). Terrain: Mapterhorn only at z12 here;
 *   the ground under the dome is flat within about 3 m.
 *
 * Numbers
 * - Plan: the fitted ellipse, semi-axes 102.0 (x) × 76.3 (y) m (measured, OSM).
 * - Oculus at the Rain Vortex pool's centre (0.2, −12.1) (measured, OSM).
 * - Crown 38 m, between OSM's height tag (37 m) and the published "about
 *   40 m"; oculus rim at 30 m
 *   (estimated from the 40 m vortex falling to the B2 pool); oculus radius 7 m
 *   (estimated from the photos against people at the pool rail).
 * - The crown ring at 30 % of the way from the oculus to the edge and the
 *   flank a superellipse of exponent 1.85 (rounder than an ellipse, a squashed
 *   sphere): estimated from the side photos (Tan, RectorRocks), review round 1.
 * - Glass grey-blue #7f9db3 at 58 % opacity, steel a fine mid-grey grid
 *   (#aab3ba), the sill ring and oculus collar pale: from the same photos,
 *   review round 1 (was pale cyan with bold white meridians and hoops).
 * - The shop floors (0–24 m) as one glazed skin 1.5 m inside the glass, the
 *   ring's inner face at 58 %: estimated; the
 *   terraces' heights: estimated from the interior photos.
 * - Skytrain deck at 12–14 m (estimated; OSM level 2, photos).
 * Doubts: the exact crown height and the funnel's steepness; the portal arches'
 * size (from one photo); the T1 side was not photographed from outside; the
 * interior is simplified to rings and terraces; the drop-off canopies are left
 * out. Glass is translucent (STYLE.md "Translucent glass"): seeing the garden
 * through the dome is the building's identity.
 */
import { Part, writeGlb, type V3, type MaterialSpec } from './mesh'
import { PALETTE, finish } from './palette'

// ---------------------------------------------------------------------------
// The plan: ellipse and oculus
// ---------------------------------------------------------------------------
const A = 102.0, B = 76.3 // semi-axes, x and y
const O: [number, number] = [0.2, -12.1] // oculus / Rain Vortex
const H_CROWN = 38, Z_OC = 30, R_OC = 7
const S_CROWN = 0.3
const P_FLANK = 1.85 // the flank's superellipse exponent: below 2 the shoulders round off like a squashed sphere

/** Distance from the oculus to the ellipse edge along compass-free angle θ (CCW from +x). */
function edge(th: number) {
  const c = Math.cos(th), s = Math.sin(th)
  // ((ox + t c)/A)^2 + ((oy + t s)/B)^2 = 1
  const a = (c * c) / (A * A) + (s * s) / (B * B)
  const b = 2 * ((O[0] * c) / (A * A) + (O[1] * s) / (B * B))
  const k = (O[0] * O[0]) / (A * A) + (O[1] * O[1]) / (B * B) - 1
  return (-b + Math.sqrt(b * b - 4 * a * k)) / (2 * a)
}
/** Plan point at angle θ and fraction s of the way from the oculus to the edge. */
const plan = (th: number, s: number): [number, number] => {
  const R = edge(th)
  return [O[0] + Math.cos(th) * R * s, O[1] + Math.sin(th) * R * s]
}

/** The dome's height at (θ, s): a trumpet funnel to the crown ring, then a quarter-ellipse flank to the ground. */
function domeZ(th: number, s: number) {
  const R = edge(th), so = R_OC / R
  if (s <= S_CROWN) {
    const u = Math.max(0, (s - so) / (S_CROWN - so))
    return Z_OC + (H_CROWN - Z_OC) * (1 - Math.pow(1 - u, 2.6))
  }
  const v = Math.min(1, (s - S_CROWN) / (1 - S_CROWN))
  return H_CROWN * Math.pow(Math.max(0, 1 - Math.pow(v, P_FLANK)), 1 / P_FLANK)
}
/** Inverse on the flank: the fraction s where the dome is at height z (z < crown). */
function flankS(z: number) {
  const v = Math.pow(1 - Math.pow(Math.min(1, z / H_CROWN), P_FLANK), 1 / P_FLANK)
  return S_CROWN + v * (1 - S_CROWN)
}
const dome = (th: number, s: number): V3 => { const [x, y] = plan(th, s); return [x, y, domeZ(th, s)] }

const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const unit = (v: V3): V3 => { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l] }
const add = (a: V3, b: V3, k = 1): V3 => [a[0] + b[0] * k, a[1] + b[1] * k, a[2] + b[2] * k]

/** Outward normal of the dome at (θ, s), from finite differences. */
function domeN(th: number, s: number): V3 {
  const e = 1e-3, sA = Math.max(R_OC / edge(th), s - e), sB = Math.min(1, s + e)
  const Ps = sub(dome(th, sB), dome(th, sA)), Pt = sub(dome(th + e, s), dome(th - e, s))
  return unit(cross(Ps, Pt))
}

function quadN(p: Part, a: V3, b: V3, c: V3, d: V3, n: [V3, V3, V3, V3]) {
  p.tri(a, b, c, undefined, undefined, undefined, [n[0], n[1], n[2]])
  p.tri(a, c, d, undefined, undefined, undefined, [n[0], n[2], n[3]])
}

/** Horizontal outward normal of the ring s = const at θ (pointing away from the oculus). */
function ringN(th: number, s: number): V3 {
  const e = 1e-3, a = plan(th - e, s), b = plan(th + e, s)
  return unit([b[1] - a[1], -(b[0] - a[0]), 0])
}

/** A vertical wall along the ring at fraction s, z0…z1, facing out (or in). */
function ringWall(p: Part, s: number | ((th: number) => number), z0: number, z1: number, out: boolean, n: number) {
  const S = typeof s === 'number' ? () => s : s
  for (let i = 0; i < n; i++) {
    const t0 = (2 * Math.PI * i) / n, t1 = (2 * Math.PI * (i + 1)) / n
    const a = plan(t0, S(t0)), b = plan(t1, S(t1))
    let na = ringN(t0, S(t0)), nb = ringN(t1, S(t1))
    if (!out) { na = [-na[0], -na[1], 0]; nb = [-nb[0], -nb[1], 0] }
    quadN(p, [a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1], [na, nb, nb, na])
  }
}
/** A flat annulus between fractions s0 and s1 at height z, facing up (or down). */
function ringCap(p: Part, s0: number | ((th: number) => number), s1: number | ((th: number) => number), z: number, up: boolean, n: number) {
  const S0 = typeof s0 === 'number' ? () => s0 : s0, S1 = typeof s1 === 'number' ? () => s1 : s1
  const N: V3 = up ? [0, 0, 1] : [0, 0, -1]
  for (let i = 0; i < n; i++) {
    const t0 = (2 * Math.PI * i) / n, t1 = (2 * Math.PI * (i + 1)) / n
    const a = plan(t0, S0(t0)), b = plan(t1, S0(t1)), c = plan(t1, S1(t1)), d = plan(t0, S1(t0))
    quadN(p, [a[0], a[1], z], [b[0], b[1], z], [c[0], c[1], z], [d[0], d[1], z], [N, N, N, N])
  }
}

/**
 * A bold bar of rectangular section along a polyline of surface points,
 * standing `h` out of the surface along its normals, `w` wide: the top and
 * both sides (the underside lies on the glass).
 */
function surfBar(p: Part, pts: V3[], nrm: V3[], w: number, h: number, sink = 0.05) {
  const L = pts.length
  const side: V3[] = pts.map((q, i) => {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(L - 1, i + 1)]
    return unit(cross(sub(b, a), nrm[i]))
  })
  const P = (i: number, sx: number, sh: number): V3 => add(add(pts[i], side[i], (sx * w) / 2), nrm[i], sh)
  for (let i = 0; i < L - 1; i++) {
    const j = i + 1
    const nl: V3 = [-side[i][0], -side[i][1], -side[i][2]], nlj: V3 = [-side[j][0], -side[j][1], -side[j][2]]
    quadN(p, P(i, -1, h), P(i, 1, h), P(j, 1, h), P(j, -1, h), [nrm[i], nrm[i], nrm[j], nrm[j]]) // top
    quadN(p, P(i, 1, -sink), P(j, 1, -sink), P(j, 1, h), P(i, 1, h), [side[i], side[j], side[j], side[i]])
    quadN(p, P(j, -1, -sink), P(i, -1, -sink), P(i, -1, h), P(j, -1, h), [nlj, nl, nl, nlj])
  }
}

/** A vertical round band (a ring wall with both faces and a top), radius r0…r1, around (cx, cy). */
function collar(p: Part, cx: number, cy: number, r0: number, r1: number, z0: number, z1: number, n: number) {
  for (let i = 0; i < n; i++) {
    const a0 = (2 * Math.PI * i) / n, a1 = (2 * Math.PI * (i + 1)) / n
    const c0 = Math.cos(a0), s0 = Math.sin(a0), c1 = Math.cos(a1), s1 = Math.sin(a1)
    const o0: V3 = [c0, s0, 0], o1: V3 = [c1, s1, 0], i0: V3 = [-c0, -s0, 0], i1: V3 = [-c1, -s1, 0], up: V3 = [0, 0, 1], dn: V3 = [0, 0, -1]
    const P = (r: number, c: number, s: number, z: number): V3 => [cx + r * c, cy + r * s, z]
    quadN(p, P(r1, c0, s0, z0), P(r1, c1, s1, z0), P(r1, c1, s1, z1), P(r1, c0, s0, z1), [o0, o1, o1, o0])
    quadN(p, P(r0, c1, s1, z0), P(r0, c0, s0, z0), P(r0, c0, s0, z1), P(r0, c1, s1, z1), [i1, i0, i0, i1])
    quadN(p, P(r0, c0, s0, z1), P(r1, c0, s0, z1), P(r1, c1, s1, z1), P(r0, c1, s1, z1), [up, up, up, up])
    quadN(p, P(r0, c1, s1, z0), P(r1, c1, s1, z0), P(r1, c0, s0, z0), P(r0, c0, s0, z0), [dn, dn, dn, dn])
  }
}

/** An axis-aligned box. */
function box(p: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, bottom = false) {
  const F = (a: V3, b: V3, c: V3, d: V3, n: V3) => quadN(p, a, b, c, d, [n, n, n, n])
  F([x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1], [0, -1, 0])
  F([x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1], [1, 0, 0])
  F([x1, y1, z0], [x0, y1, z0], [x0, y1, z1], [x1, y1, z1], [0, 1, 0])
  F([x0, y1, z0], [x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [-1, 0, 0])
  F([x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1], [0, 0, 1])
  if (bottom) F([x0, y1, z0], [x1, y1, z0], [x1, y0, z0], [x0, y0, z0], [0, 0, -1])
}

/** The plan angle θ (about the oculus) that points at plan point (x, y). */
const thetaOf = (x: number, y: number) => Math.atan2(y - O[1], x - O[0])

// ---------------------------------------------------------------------------
// Build
// ---------------------------------------------------------------------------
function build(detail: boolean) {
  const glass = new Part(), steel = new Part(), stone = new Part(), win = new Part(), forest = new Part(), vortex = new Part()
  const NT = detail ? 96 : 48 // segments round the dome
  const NI = detail ? 72 : 40 // segments round the interior rings

  // --- The glass dome: lofted over (θ, s), funnel from the oculus, flank to the ground ---
  const so = (th: number) => R_OC / edge(th)
  const sRows: number[] = []
  const nF = detail ? 8 : 5, nO = detail ? 16 : 10
  for (let k = 0; k <= nF; k++) sRows.push(k / nF) // funnel share, mapped per θ below
  const rowS = (th: number, k: number) => {
    if (k <= nF) return so(th) + (S_CROWN - so(th)) * (k / nF)
    const v = (k - nF) / nO
    // denser near the ground, where the flank turns vertical
    return S_CROWN + (1 - S_CROWN) * Math.sin((v * Math.PI) / 2)
  }
  const rows = nF + nO
  for (let i = 0; i < NT; i++) {
    const t0 = (2 * Math.PI * i) / NT, t1 = (2 * Math.PI * (i + 1)) / NT
    for (let k = 0; k < rows; k++) {
      const a = rowS(t0, k), b = rowS(t1, k), c = rowS(t1, k + 1), d = rowS(t0, k + 1)
      quadN(glass, dome(t0, a), dome(t0, d), dome(t1, c), dome(t1, b), [domeN(t0, a), domeN(t0, d), domeN(t1, c), domeN(t1, b)])
    }
  }

  // --- The frame that carries the outline: the steel sill at the ground, the oculus collar ---
  ringWall(stone, 1.002, 0, 1.4, true, NT)
  // The oculus collar: a broad bright band round the funnel's mouth, hanging below it.
  collar(stone, O[0], O[1], R_OC - 0.6, R_OC + 1.4, Z_OC - 3.2, Z_OC + 0.4, detail ? 32 : 16)

  // --- Steel: hoops and the diagrid ---
  const hoop = (s: number | ((th: number) => number), w: number, h: number, n: number) => {
    const S = typeof s === 'number' ? () => s : s
    const pts: V3[] = [], nr: V3[] = []
    for (let i = 0; i <= n; i++) { const t = (2 * Math.PI * i) / n; pts.push(dome(t, S(t))); nr.push(domeN(t, S(t))) }
    surfBar(steel, pts, nr, w, h)
  }
  // The steel grid: two families of spirals crossing at the diagonals, and in
  // the detail level thin hoops through the crossings, so the glass is cut into
  // the real triangles. Thin and mid grey: it reads as texture, not as a cage.
  if (detail) {
    for (const z of [6, 11, 16.5, 22, 27.5, 32, 35.5]) hoop(flankS(z), 0.3, 0.25, NT)
    for (const f of [0.35, 0.7]) hoop((th) => so(th) + (S_CROWN - so(th)) * f, 0.3, 0.25, NT)
  }
  const rib = (k: number, n: number, twist: number, w: number) => {
    const segs = detail ? 24 : 12
    const pts: V3[] = [], nr: V3[] = []
    for (let j = 0; j <= segs; j++) {
      const u = j / segs
      const th = (2 * Math.PI * k) / n + twist * u
      const sc = so(th)
      const s = Math.min(flankS(3.5), u < 0.35 ? sc + (S_CROWN - sc) * (u / 0.35) : S_CROWN + (1 - S_CROWN) * Math.sin(((u - 0.35) / 0.65) * Math.PI / 2))
      pts.push(dome(th, s)); nr.push(domeN(th, s))
    }
    surfBar(steel, pts, nr, w, 0.25)
  }
  const NM = detail ? 44 : 14
  for (const dir of [1, -1]) for (let k = 0; k < NM; k++) rib(k + (dir > 0 ? 0 : 0.5), NM, (dir * 2 * Math.PI * (detail ? 6 : 2)) / NM, detail ? 0.32 : 0.5)

  // --- Portal arches where the Skytrain and the link bridges go in ---
  const portal = (x: number, y: number, half: number, top: number) => {
    const th0 = thetaOf(x, y), R = edge(th0)
    const pts: V3[] = [], nr: V3[] = []
    const n = detail ? 14 : 8
    for (let j = 0; j <= n; j++) {
      const ph = (Math.PI * j) / n
      const z = Math.max(4, top * Math.sin(ph))
      const s = Math.min(0.999, flankS(z))
      const th = th0 + (half * Math.cos(ph)) / (R * s)
      pts.push(dome(th, s)); nr.push(domeN(th, s))
    }
    surfBar(steel, pts, nr, 1.2, 0.5)
  }
  portal(-101, 4.3, 11, 22) // Skytrain, west
  portal(102, 4.3, 11, 22) // Skytrain, east
  portal(-99, -42, 13, 21) // link bridge to Terminal 3
  portal(93, -47, 13, 21) // link bridge to Terminal 2

  // --- Inside: the ring of shop floors, stepped to fit under the dome ---
  const S_IN = 0.58
  // The shop floors, 0–24 m: their glazed outer face follows the dome 1.5 m
  // inside the glass, so it reads through it as a darker, lit lower flank rather
  // than as a drum or as stripes.
  const skin = (th: number, z: number): V3 => {
    const s = flankS(z), R = edge(th), k = Math.max(0.5, s - 1.5 / R)
    const [x, y] = plan(th, k); return [x, y, z]
  }
  const ZS = [0, 5, 10, 15, 20, 24]
  for (let i = 0; i < NI; i++) {
    const t0 = (2 * Math.PI * i) / NI, t1 = (2 * Math.PI * (i + 1)) / NI
    for (let k = 0; k < ZS.length - 1; k++) {
      const a = skin(t0, ZS[k]), b = skin(t1, ZS[k]), c = skin(t1, ZS[k + 1]), d = skin(t0, ZS[k + 1])
      const na = domeN(t0, flankS((ZS[k] + ZS[k + 1]) / 2)), nb = domeN(t1, flankS((ZS[k] + ZS[k + 1]) / 2))
      quadN(win, a, b, c, d, [na, nb, nb, na])
    }
  }
  const sTop = (th: number) => flankS(24) - 1.5 / edge(th)
  ringCap(stone, S_IN, sTop, 24, true, NI)
  const levels: [number, number, number][] = [[0, 24, flankS(25.5) - 0.012]]
  // the valley face: two glazed bands, two storeys each, between slab edges
  ringWall(stone, S_IN, 0, 24, false, NI)
  for (const [z0, z1] of [[1.0, 9.0], [11.0, 19.0]] as [number, number][]) {
    for (let i = 0; i < NI; i++) {
      const t0 = (2 * Math.PI * (i + 0.08)) / NI, t1 = (2 * Math.PI * (i + 0.92)) / NI
      const a = plan(t0, S_IN - 0.006), b = plan(t1, S_IN - 0.006)
      const na = ringN(t0, S_IN), nb = ringN(t1, S_IN)
      const ia: V3 = [-na[0], -na[1], 0], ib: V3 = [-nb[0], -nb[1], 0]
      quadN(win, [a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1], [ia, ib, ib, ia])
    }
  }
  // Canopy Park on the top level: planted
  ringCap(forest, S_IN + 0.02, levels[0][2] - 0.02, 24.15, true, NI)

  // --- The Forest Valley: terraces stepping down to the vortex pool, higher on the west ---
  const westLift = (th: number) => 2.5 * Math.pow(Math.max(0, -Math.cos(th)), 1.5)
  const tiers: [number, number, number][] = [[0.16, 0.3, 2.2], [0.3, 0.43, 5.5], [0.43, 0.555, 9.0]]
  for (const [s0, s1, z] of tiers) {
    // a tier's top follows the west lift, so draw it segment by segment
    for (let i = 0; i < NI; i++) {
      const t0 = (2 * Math.PI * i) / NI, t1 = (2 * Math.PI * (i + 1)) / NI
      const z0 = z + westLift(t0), z1 = z + westLift(t1)
      const a = plan(t0, s0), b = plan(t1, s0), c = plan(t1, s1), d = plan(t0, s1)
      const up: V3 = [0, 0, 1]
      quadN(forest, [a[0], a[1], z0], [b[0], b[1], z1], [c[0], c[1], z1], [d[0], d[1], z0], [up, up, up, up])
      const na = ringN(t0, s0), nb = ringN(t1, s0)
      const ia: V3 = [-na[0], -na[1], 0], ib: V3 = [-nb[0], -nb[1], 0]
      quadN(forest, [a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], z1], [a[0], a[1], z0], [ia, ib, ib, ia])
    }
  }
  // the pool's rim round the vortex
  collar(stone, O[0], O[1], 10.2, 11.0, 0, 2.6, detail ? 32 : 16)

  // --- The Rain Vortex: a column of water from the oculus, narrowing as it falls ---
  {
    const n = detail ? 24 : 14, rT = R_OC - 0.9, rB = 4.2, zT = Z_OC - 2.6, zB = 0
    for (let i = 0; i < n; i++) {
      const a0 = (2 * Math.PI * i) / n, a1 = (2 * Math.PI * (i + 1)) / n
      const P = (r: number, a: number, z: number): V3 => [O[0] + r * Math.cos(a), O[1] + r * Math.sin(a), z]
      const k = (rT - rB) / (zT - zB)
      const N = (a: number): V3 => unit([Math.cos(a), Math.sin(a), -k])
      quadN(vortex, P(rB, a0, zB), P(rB, a1, zB), P(rT, a1, zT), P(rT, a0, zT), [N(a0), N(a1), N(a1), N(a0)])
    }
  }

  // --- The Skytrain's deck through the garden, on two pairs of columns ---
  {
    const thW = thetaOf(-100, 4.3), thE = thetaOf(100, 4.3)
    const xW = plan(thW, flankS(14))[0] - 0.5, xE = plan(thE, flankS(14))[0] + 0.5
    box(stone, xW, 1.2, xE, 7.6, 12.0, 14.2, true)
    for (const x of [-30, 30]) for (const y of [2.6, 6.2]) box(stone, x - 0.7, y - 0.7, x + 0.7, y + 0.7, 0, 12.0)
  }

  if (detail) {
    // The Canopy Bridge, level 4: a shallow white arch across the valley north of the vortex.
    const pts: V3[] = [], nr: V3[] = []
    for (let j = 0; j <= 16; j++) {
      const x = -24 + (48 * j) / 16, y = 19 + 4 * Math.pow(x / 24, 2)
      pts.push([x, y, 21.5 + 1.5 * (1 - Math.pow(x / 24, 2))]); nr.push([0, 0, 1])
    }
    surfBar(steel, pts, nr, 2.4, 1.0, 0.3)
    // Trees: bold round crowns on the terraces and Canopy Park
    let seed = 7
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
    const tree = (x: number, y: number, z: number, r: number) => {
      const n = 6
      const top: V3 = [x, y, z + r * 1.6]
      for (let i = 0; i < n; i++) {
        const a0 = (2 * Math.PI * i) / n, a1 = (2 * Math.PI * (i + 1)) / n
        const p0: V3 = [x + r * Math.cos(a0), y + r * Math.sin(a0), z + r * 0.5], p1: V3 = [x + r * Math.cos(a1), y + r * Math.sin(a1), z + r * 0.5]
        const n0 = unit([Math.cos(a0), Math.sin(a0), 0.7]), n1 = unit([Math.cos(a1), Math.sin(a1), 0.7])
        forest.tri(p0, p1, top, undefined, undefined, undefined, [n0, n1, [0, 0, 1]])
        const b0: V3 = [x, y, z]
        const d0 = unit([Math.cos(a0), Math.sin(a0), -0.6]), d1 = unit([Math.cos(a1), Math.sin(a1), -0.6])
        forest.tri(p1, p0, b0, undefined, undefined, undefined, [d1, d0, [0, 0, -1]])
      }
    }
    for (const [s0, s1, z] of tiers) for (let i = 0; i < 46; i++) {
      const th = rnd() * 2 * Math.PI, s = s0 + 0.02 + rnd() * (s1 - s0 - 0.04)
      const [x, y] = plan(th, s)
      if (Math.abs(y - 4.4) < 5) continue // keep the Skytrain's path clear
      tree(x, y, z + westLift(th), 2.2 + rnd() * 1.8)
    }
    for (let i = 0; i < 70; i++) {
      const th = rnd() * 2 * Math.PI, s = S_IN + 0.03 + rnd() * 0.09
      const [x, y] = plan(th, s)
      tree(x, y, 24.1, 1.8 + rnd() * 1.2)
    }
  }

  return [
    { part: glass, material: { name: 'glass', color: 0x7f9db3, roughness: 0.2, opacity: 0.58, doubleSided: true } as MaterialSpec },
    { part: steel, material: finish('jewel-steel', 0xaab3ba) as MaterialSpec },
    { part: stone, material: PALETTE.stone as MaterialSpec },
    { part: win, material: { name: 'window', color: 0x8fa6b6, roughness: 0.35 } as MaterialSpec },
    { part: forest, material: { ...finish('jewel-forest', 0x7f9e6c), floodlight: (_p: V3, n: V3) => (n[2] > 0.3 ? 0.55 : 0.35) } as MaterialSpec },
    { part: vortex, material: finish('neon-jewel-vortex', 0xd4eaf2) as MaterialSpec },
  ]
}

function write(file: string, parts: { part: Part; material: MaterialSpec }[], maxTris: number, maxBytes: number) {
  const used = parts.filter(({ part }) => part.triangles > 0)
  const tris = used.reduce((t, { part }) => t + part.triangles, 0)
  const glb = writeGlb('Jewel Changi Airport', used, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
    bearing: 23.1, osm: 'way/744520551', height: H_CROWN,
  })
  console.log(`${file}: ${tris} triangles, ${glb.length} bytes, ${used.length} materials`)
  if (tris > maxTris) throw new Error(`${file}: triangle budget exceeded`)
  if (glb.length > maxBytes) throw new Error(`${file}: size budget exceeded`)
  Bun.write(new URL(`../models/${file}`, import.meta.url).pathname, glb)
}

if (import.meta.main) {
  write('singapore-changi-jewel.glb', build(false), 6500, 250_000)
  write('singapore-changi-jewel.detail.glb', build(true), 40_000, 1_500_000)
}
