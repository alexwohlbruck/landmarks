/**
 * Hartsfield-Jackson Atlanta International Airport (ATL): the Domestic
 * Terminal: North and South terminal halls, the central block with the
 * atrium and its round skylight, the west end block, and the two big
 * roadway canopies (2020-2022, ATLNext) over the curbs. Procedural,
 * CC0-1.0, no textures.
 *
 *   bun generators/atl-hartsfield-jackson-domestic-terminal.ts
 *
 * Writes models/atl-hartsfield-jackson-domestic-terminal.glb (low) and
 * .detail.glb (the canopies' diagonal lattice, the facade mullion groups,
 * the rooftop plant). Also the small kit the other ATL terminal models
 * import (`ATL` colours, boxes, vaults, facade panels, jet-bridge stubs,
 * the writer); importing this file builds nothing.
 *
 * Frame: x east, y north, z up, metres, bearing 0. Anchor (-84.4433762,
 * 33.6409658): the area centroid of the three OSM terminal ways.
 *
 * Evidence
 * - OSM: relation/10189710 (Domestic Terminal multipolygon; outer
 *   way/264678569, the central block, inner way/737690558, an open court),
 *   way/44488347 (North Terminal), way/44488346 (South Terminal),
 *   way/737702225 and way/737702226 (building=roof: the two canopies).
 *   Footprints used as mapped. OSM has no heights.
 * - Lidar: USGS 3DEP GA_Central_5_2018 (project year 2018), 1 m grid. The
 *   canopies are already in it (vault surface measured), so the flight
 *   postdates their steelwork. Measured above the lowest ground (307.3 m;
 *   the map's terrain here is flat within ~1 m, 307.3 m at its lowest):
 *   - halls: shed roofs rising towards the curbs, 13.8 m at the inner edge
 *     to 17.4 m at the curb facade (both halls);
 *   - canopies: a barrel vault springing at ~20.5 m on the curb facade,
 *     crest 29.8 m about 28 m out, eave ~20 m over the far curb; both
 *     canopies the same within 0.3 m;
 *   - central block 12.5-13 m; atrium 22 m with 25.5 m end bands; the
 *     skylight lantern to ~25 m; west end block 20 m; open court at ground.
 * - NAIP (USGS, public domain, 2023 flight): plan, roof colours: the
 *   canopies silver-white with dark rib lines; hall roofs pale membrane; the
 *   central block and atrium white with a round glazed skylight.
 * - Photos (Wikimedia Commons):
 *   - "Hartsfield-Jackson South Terminal Aerial (50923459703).jpg",
 *     formulanone, CC BY-SA 2.0: both canopies from the north: ribbed
 *     silver vaults, zig-zag legs along the outer curb, the white central
 *     block with the round skylight.
 *   - "Atlanta Concourse T and Transportation Area (50401170512).jpg",
 *     formulanone, CC BY-SA 2.0: the same from the south-east, with the
 *     east ends of the vaults (open arches) and Concourse T.
 *   - "Atlanta airport domestic terminal dropoff.jpg", LGH13, CC0: under
 *     the North canopy: white tubular arches with diagonal bracing and a
 *     translucent cover; the arches run down to the outer curb on raking
 *     legs; the terminal's curb front is charcoal metal panel and glass.
 *   - "KATL Terminal South departures area.jpg", Mccunicano, CC BY-SA
 *     4.0: the South canopy from the curb bridge, the same structure.
 *   - "ATL Terminal Superstructure (39120301770).jpg", formulanone, CC BY-SA
 *     2.0: the South canopy's steel from above, under construction: arches
 *     about 16 m apart, braced diagonally.
 * - Look-only: "Hartsfield-Jackson overview.jpg" (Commons, Daniel
 *   Piotrowski, GFDL 1.2): the terminal before the canopies, from the
 *   south-west. Looked at for the wall colour only; nothing rests on it.
 * - Published: canopies about 270 m long each, part of ATLNext, completed
 *   2022 (Hartsfield-Jackson ATLNext programme, Wikipedia
 *   "Hartsfield-Jackson Atlanta International Airport").
 *
 * The kit below (colours, vault, concourse zones, jet bridges, writer) is
 * imported by the three other ATL terminal generators, so this file merges
 * first.
 *
 * Estimated: the window bands and their heights (from the dropoff photos);
 * rib spacing 16.5 m (photo count, 16 bays); the rib depth; the legs'
 * pattern (one zig-zag per bay); the atrium's clerestory band; rooftop plant
 * boxes (NAIP, sizes approximate).
 * The cover is drawn as cushions, two per bay, bulging 1 m between the
 * arch lines, so the vaults read ribbed from above as in the aerials; the
 * arches themselves hang under the cover (they are inside it in the
 * photos), and only the end arches stand proud as the open ends' rims.
 * Night: the cover stays dark (glass); the white steel carries a
 * _FLOODLIGHT share, as it is lit from below after dark.
 *
 * Doubts: the terminal's west face and the central block's walls are
 * seen only from far off; their windows are plain bands. The cushion count
 * (32 per canopy) is read from the aerials, not a drawing.
 */
import { Part, writeGlb, type V3, type MaterialSpec } from './mesh'
import { PALETTE, finish, windowVariant, type Swatch } from './palette'
import { clean, inset, triangulate, clip, area, cap, walls, lathe, type XY } from './clt-terminal'

export type { XY }
export { clean, clip, area, cap, walls, lathe }

// ---------------------------------------------------------------------------
// Shared ATL colours, from daylight photos and NAIP, pulled to the palette.

export const ATL = {
  /** Walls: the concourses' pale warm-grey precast and render. */
  wall: PALETTE.stone,
  /** Facade glass: light grey-blue by day, lit at night. */
  window: windowVariant(2, 0xa9bcca),
  /** Pale membrane roofs of the concourses and the central block. */
  roofPale: finish('atl-roof-pale', 0xd4d6d4),
  /** Grey metal roofs (the terminal halls). */
  roof: PALETTE.roof,
  /** White steel: the canopy arches, fascias, jet bridges. */
  trim: PALETTE.trim,
  /** The canopies' translucent cover; stays dark at night. */
  cover: { name: 'glass', color: 0xdfe5ea, roughness: 0.2 } as Swatch,
  /** Charcoal metal panel of the newer curb fronts, pulled light. */
  panel: finish('atl-charcoal-panel', 0x7d838b),
  /** Jet bridges and rooftop plant: pale silver metal, a touch darker than the roofs. */
  metal: finish('atl-silver', 0xc8cdd1, 0.6),
  /** Delta's red band round the concourse ends. */
  red: finish('atl-delta-red', 0xb8463f),
}

// ---------------------------------------------------------------------------
// Kit

export const unit = (v: V3): V3 => { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l] }

/** A quad with explicit (smooth) normals, wound to agree with them. */
export function quadN(p: Part, a: V3, b: V3, c: V3, d: V3, n: [V3, V3, V3, V3]) {
  p.tri(a, b, c, undefined, undefined, undefined, [n[0], n[1], n[2]])
  p.tri(a, c, d, undefined, undefined, undefined, [n[0], n[2], n[3]])
}

export const rect = (x0: number, y0: number, x1: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]

/** A box with an optional chamfered top edge; walls to `wall`, top to `top`. */
export function box(wall: Part, top: Part | null, ring: XY[], z0: number, z1: number, bevel = 0.4) {
  const r = clean(ring, 0.05)
  if (bevel > 0 && z1 - z0 > bevel * 2) {
    walls(wall, r, z0, z1 - bevel)
    const ins = inset(r, bevel)
    walls(wall, r, z1 - bevel, z1, ins)
    if (top) cap(top, ins, z1)
  } else {
    walls(wall, r, z0, z1)
    if (top) cap(top, r, z1)
  }
  return r
}

/** A flat cap with polygonal holes (each joined to the outline by a slit). */
export function capWithHoles(p: Part, outer: XY[], holes: XY[][], z: number) {
  let ring = outer.slice()
  for (const h0 of holes) {
    const h = area(h0) > 0 ? h0.slice().reverse() : h0.slice()
    let best = [0, 0], d = Infinity
    for (let i = 0; i < ring.length; i++) for (let k = 0; k < h.length; k++) {
      const e = Math.hypot(ring[i][0] - h[k][0], ring[i][1] - h[k][1])
      if (e < d) { d = e; best = [i, k] }
    }
    const [i, k] = best, hk = [...h.slice(k), ...h.slice(0, k), h[k]]
    ring = [...ring.slice(0, i + 1), ...hk, ...ring.slice(i)]
  }
  for (const [a, b, c] of triangulate(ring)) p.tri([ring[a][0], ring[a][1], z], [ring[b][0], ring[b][1], z], [ring[c][0], ring[c][1], z])
}

/**
 * Window panels along a→b (the wall's outside is to the right of a→b, as on
 * a counter-clockwise ring), set `out` proud: `n` bays of glass with `gap`
 * piers between, from z0 to z1, `end` clear at each end.
 */
export function panelRow(p: Part, a: XY, b: XY, z0: number, z1: number, o: { bay?: number; gap?: number; end?: number; out?: number } = {}) {
  const bay = o.bay ?? 9, gap = o.gap ?? 1.4, end = o.end ?? 1.5, out = o.out ?? 0.05
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  if (L < 2 * end + 2) return
  const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], nn: XY = [u[1], -u[0]]
  const usable = L - 2 * end
  const k = Math.max(1, Math.round((usable + gap) / (bay + gap)))
  const w = (usable - (k - 1) * gap) / k
  for (let q = 0; q < k; q++) {
    const s0 = end + q * (w + gap), s1 = s0 + w
    const P = (s: number, z: number): V3 => [a[0] + u[0] * s + nn[0] * out, a[1] + u[1] * s + nn[1] * out, z]
    p.quad(P(s0, z0), P(s1, z0), P(s1, z1), P(s0, z1))
  }
}

/** Thin vertical mullion bars (detail model) along a→b every `step`, from z0 to z1. */
export function mullions(p: Part, a: XY, b: XY, z0: number, z1: number, step = 3, w = 0.18, out = 0.12) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], nn: XY = [u[1], -u[0]]
  const n = Math.max(1, Math.round(L / step))
  for (let i = 1; i < n; i++) {
    const s = (L * i) / n
    const P = (ds: number, z: number): V3 => [a[0] + u[0] * (s + ds) + nn[0] * out, a[1] + u[1] * (s + ds) + nn[1] * out, z]
    p.quad(P(-w / 2, z0), P(w / 2, z0), P(w / 2, z1), P(-w / 2, z1))
  }
}

/** A horizontal band (sill, fascia, coloured stripe) along a→b, `out` proud. */
export function bandRow(p: Part, a: XY, b: XY, z0: number, z1: number, out = 0.08) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]); if (L < 1e-6) return
  const nn: XY = [(b[1] - a[1]) / L, -(b[0] - a[0]) / L]
  const A: XY = [a[0] + nn[0] * out, a[1] + nn[1] * out], B: XY = [b[0] + nn[0] * out, b[1] + nn[1] * out]
  p.quad([A[0], A[1], z0], [B[0], B[1], z0], [B[0], B[1], z1], [A[0], A[1], z1])
  if (out > 0.05) p.quad([A[0], A[1], z1], [B[0], B[1], z1], [b[0], b[1], z1], [a[0], a[1], z1])
}

/** A straight strut of square section `w` from P to Q (both windings off: outward faces only). */
export function strut(p: Part, P: V3, Q: V3, w: number) {
  const d = unit([Q[0] - P[0], Q[1] - P[1], Q[2] - P[2]])
  const ref: V3 = Math.abs(d[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0]
  const s = unit([d[1] * ref[2] - d[2] * ref[1], d[2] * ref[0] - d[0] * ref[2], d[0] * ref[1] - d[1] * ref[0]])
  const t = unit([d[1] * s[2] - d[2] * s[1], d[2] * s[0] - d[0] * s[2], d[0] * s[1] - d[1] * s[0]])
  const h = w / 2
  const off = [[h, h], [-h, h], [-h, -h], [h, -h]].map(([a, b]) => [s[0] * a + t[0] * b, s[1] * a + t[1] * b, s[2] * a + t[2] * b] as V3)
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4, A = off[i], B = off[j]
    const n = unit([A[0] + B[0], A[1] + B[1], A[2] + B[2]])
    const v = (o: V3, X: V3): V3 => [X[0] + o[0], X[1] + o[1], X[2] + o[2]]
    quadN(p, v(A, P), v(B, P), v(B, Q), v(A, Q), [n, n, n, n])
  }
}

/** A circular-segment arch in the (s, z) plane: chord from (s0, zs) to (s1, zs) rising to zc. */
export function arch(s0: number, s1: number, zs: number, zc: number) {
  const c = (s1 - s0) / 2, sag = zc - zs, R = (c * c + sag * sag) / (2 * sag), mid = (s0 + s1) / 2, zO = zc - R
  const th = Math.asin(Math.min(1, c / R))
  /** Point and outward normal at t in [0, 1]. */
  return (t: number): { s: number; z: number; ns: number; nz: number } => {
    const a = -th + 2 * th * t
    return { s: mid + R * Math.sin(a), z: zO + R * Math.cos(a), ns: Math.sin(a), nz: Math.cos(a) }
  }
}

/**
 * A barrel vault along x from x0 to x1, its section an arch across y from
 * yA to yB (any order) springing at zs and rising to zc: a cover surface
 * (top to `cover`, soffit to `soffit`), arches every `bay` metres standing
 * proud of it (`rib`), and the end arches. Returns the arch function and
 * the rib positions, so callers can add legs and lattice.
 */
export function vault(o: {
  x0: number; x1: number; yA: number; yB: number; zs: number; zc: number
  cover: Part; soffit: Part; rib: Part; bays: number; seg?: number; ribW?: number; ribD?: number; cushions?: number; bulge?: number
}) {
  const seg = o.seg ?? 12, ribW = o.ribW ?? 1.1, ribD = o.ribD ?? 0.7
  const A = arch(o.yA, o.yB, o.zs, o.zc)
  const pts = Array.from({ length: seg + 1 }, (_, i) => A(i / seg))
  // The cover: one cushion per half bay, bulging `bulge` between the arches,
  // so the vault reads ribbed in plan and in raking light, as the real one.
  const cushions = o.bays * (o.cushions ?? 2), bulge = o.bulge ?? 1.0
  const dx = (o.x1 - o.x0) / cushions
  for (let i = 0; i < seg; i++) {
    const p = pts[i], q = pts[i + 1]
    const np: V3 = [0, p.ns, p.nz], nq: V3 = [0, q.ns, q.nz]
    for (let k = 0; k < cushions; k++) {
      const xa = o.x0 + k * dx, xm = xa + dx / 2, xb = xa + dx
      const tilt = (2 * bulge) / dx
      const at = (pt: typeof p, x: number, b: number): V3 => [x, pt.s + pt.ns * b, pt.z + pt.nz * b]
      const nl = (n: V3): V3 => unit([-tilt, n[1], n[2]]), nr = (n: V3): V3 => unit([tilt, n[1], n[2]])
      quadN(o.cover, at(p, xa, 0), at(p, xm, bulge), at(q, xm, bulge), at(q, xa, 0), [nl(np), nl(np), nl(nq), nl(nq)])
      quadN(o.cover, at(p, xm, bulge), at(p, xb, 0), at(q, xb, 0), at(q, xm, bulge), [nr(np), nr(np), nr(nq), nr(nq)])
    }
    const dn = (n: V3): V3 => [0, -n[1], -n[2]]
    const e = 0.2 // the soffit just under the cover
    quadN(o.soffit, [o.x0, p.s - p.ns * e, p.z - p.nz * e], [o.x1, p.s - p.ns * e, p.z - p.nz * e], [o.x1, q.s - q.ns * e, q.z - q.nz * e], [o.x0, q.s - q.ns * e, q.z - q.nz * e], [dn(np), dn(np), dn(nq), dn(nq)])
  }
  const ribs: number[] = []
  for (let k = 0; k <= o.bays; k++) ribs.push(o.x0 + ((o.x1 - o.x0) * k) / o.bays)
  // The arches: the end ones stand proud as the white rims of the open ends;
  // the others hang under the cover, seen from below and through the ends.
  for (const [k, x] of ribs.entries()) {
    const end = k === 0 || k === o.bays
    const w = end ? ribW * 1.6 : ribW
    const top = end ? ribD * 1.6 : -0.25, bot = end ? -0.6 : -0.25 - ribD * 1.4
    const xa = k === 0 ? x : k === o.bays ? x - w : x - w / 2, xb = xa + w
    for (let i = 0; i < seg; i++) {
      const p = pts[i], q = pts[i + 1]
      const np: V3 = [0, p.ns, p.nz], nq: V3 = [0, q.ns, q.nz]
      const dn = (n: V3): V3 => [0, -n[1], -n[2]]
      const P = (pt: typeof p, n: V3, xx: number, dd: number): V3 => [xx, pt.s + n[1] * dd, pt.z + n[2] * dd]
      if (end) quadN(o.rib, P(p, np, xa, top), P(p, np, xb, top), P(q, nq, xb, top), P(q, nq, xa, top), [np, np, nq, nq])
      quadN(o.rib, P(p, np, xb, bot), P(p, np, xa, bot), P(q, nq, xa, bot), P(q, nq, xb, bot), [dn(np), dn(np), dn(nq), dn(nq)])
      const sx0: V3 = [-1, 0, 0], sx1: V3 = [1, 0, 0]
      o.rib.tri(P(p, np, xa, bot), P(q, nq, xa, bot), P(q, nq, xa, top), undefined, undefined, undefined, [sx0, sx0, sx0])
      o.rib.tri(P(p, np, xa, bot), P(q, nq, xa, top), P(p, np, xa, top), undefined, undefined, undefined, [sx0, sx0, sx0])
      o.rib.tri(P(p, np, xb, bot), P(q, nq, xb, top), P(q, nq, xb, bot), undefined, undefined, undefined, [sx1, sx1, sx1])
      o.rib.tri(P(p, np, xb, bot), P(p, np, xb, top), P(q, nq, xb, top), undefined, undefined, undefined, [sx1, sx1, sx1])
    }
  }
  return { A, ribs }
}

/** A jet-bridge stub: a pale box on a round post, from (x0, y0) to (x1, y1), floor at z. */
export function jetBridge(body: Part, post: Part, a: XY, b: XY, z: number, w = 2.8, h = 3.2, withPost = true, under = true) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]); if (L < 1) return
  const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [-u[1], u[0]]
  const r: XY[] = [[a[0] - n[0] * w / 2, a[1] - n[1] * w / 2], [b[0] - n[0] * w / 2, b[1] - n[1] * w / 2], [b[0] + n[0] * w / 2, b[1] + n[1] * w / 2], [a[0] + n[0] * w / 2, a[1] + n[1] * w / 2]]
  const ring = area(r) < 0 ? r.slice().reverse() : r
  walls(body, ring, z, z + h)
  cap(body, ring, z + h)
  if (under) cap(body, ring, z, false)
  if (withPost) lathe(post, b[0] - u[0] * 1.5, b[1] - u[1] * 1.5, [[0.45, 0], [0.45, z]], 6)
}

// ---------------------------------------------------------------------------
// Concourses: long flat-roofed piers in height zones, glazed gate-level bands,
// Delta-red bands round the ends, rooftop plant and jet-bridge stubs.

export type ConcourseParts = { wall: Part; win: Part; pale: Part; trim: Part; red: Part; metal: Part }
export const newConcourseParts = (): ConcourseParts => ({ wall: new Part(), win: new Part(), pale: new Part(), trim: new Part(), red: new Part(), metal: new Part() })
export const concourseMaterials = (p: ConcourseParts) => [
  { part: p.wall, material: ATL.wall },
  { part: p.win, material: ATL.window },
  { part: p.pale, material: ATL.roofPale },
  { part: p.trim, material: ATL.trim },
  { part: p.red, material: ATL.red },
  { part: p.metal, material: ATL.metal },
]

/** A zone of a concourse outline: the part with y0 <= y <= y1 (and x0 <= x <= x1), roof at h. */
export type Zone = { y0: number; y1: number; x0?: number; x1?: number; h: number }

const onRing = (ring: XY[], a: XY, b: XY, tol = 0.6) => {
  const m: XY = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
  for (let i = 0; i < ring.length; i++) {
    const p = ring[i], q = ring[(i + 1) % ring.length], dx = q[0] - p[0], dy = q[1] - p[1], l = dx * dx + dy * dy || 1
    const t = Math.max(0, Math.min(1, ((m[0] - p[0]) * dx + (m[1] - p[1]) * dy) / l))
    if (Math.hypot(m[0] - p[0] - t * dx, m[1] - p[1] - t * dy) < tol) return true
  }
  return false
}

/**
 * A concourse from its OSM outline cut into zones. `ground` is the apron's
 * height above the model's y = 0 (the glazing starts a storey above it).
 * Window bands go on the outline's own edges only, never on cuts; the ends
 * (edges facing along the pier's axis, `axis` 'y' or 'x') get the red band.
 */
export function concourse(p: ConcourseParts, outline: XY[], zones: Zone[], o: { ground: number; axis?: 'x' | 'y'; detail?: boolean; redEnds?: boolean; redSides?: boolean; bay?: number }) {
  const ring = clean(outline, 0.3)
  const axisY = (o.axis ?? 'y') === 'y'
  for (const z of zones) {
    let r = clip(clip(ring, 0, -1, -z.y0), 0, 1, z.y1)
    if (z.x0 !== undefined) r = clip(r, -1, 0, -z.x0)
    if (z.x1 !== undefined) r = clip(r, 1, 0, z.x1)
    if (r.length < 3 || Math.abs(area(r)) < 4) continue
    r = clean(r, 0.2)
    box(p.wall, p.pale, r, 0, z.h, 0.45)
    const g = o.ground
    for (let i = 0; i < r.length; i++) {
      const a = r[i], b = r[(i + 1) % r.length]
      if (!onRing(ring, a, b)) continue
      const L = Math.hypot(b[0] - a[0], b[1] - a[1])
      const along = Math.abs(axisY ? b[1] - a[1] : b[0] - a[0]) / (L || 1)
      if (z.h - g > 8.5 && L > 6) {
        const z0 = g + 4.6, z1 = z.h - 2.1
        panelRow(p.win, a, b, z0, z1, { bay: o.bay ?? 11, gap: 1.5, end: 1.2 })
        if (o.detail) mullions(p.trim, a, b, z0, z1, 2.4, 0.14, 0.1)
      } else if (L > 6) {
        panelRow(p.win, a, b, g + 1.2, z.h - 1.6, { bay: 6, gap: 1.4, end: 1.2 })
      }
      if ((o.redEnds ?? true) && along < 0.3 && L > 12 && z.h - g > 8.5) bandRow(p.red, a, b, z.h - 4.2, z.h - 2.6, 0.1)
      // Delta's red stripe under the parapet along the gate fronts
      if ((o.redSides ?? true) && along > 0.7 && L > 20 && z.h - g > 8.5) bandRow(p.red, a, b, z.h - 1.75, z.h - 0.95, 0.12)
    }
  }
  return ring
}

/** Rooftop plant: boxes every `step` metres along a segment, on a roof at z. */
export function plantRow(part: Part, a: XY, b: XY, z: number, step = 42, size: XY = [6, 4], h = 2.2) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
  const n = Math.max(1, Math.floor(L / step))
  for (let i = 0; i < n; i++) {
    const s = (L * (i + 0.5)) / n, c: XY = [a[0] + u[0] * s, a[1] + u[1] * s]
    const hx = Math.abs(u[0]) > 0.7 ? size[0] / 2 : size[1] / 2, hy = Math.abs(u[0]) > 0.7 ? size[1] / 2 : size[0] / 2
    box(part, part, rect(c[0] - hx, c[1] - hy, c[0] + hx, c[1] + hy), z, z + h, 0.15)
  }
}

/** A small deterministic random stream, so the plant is the same on every build. */
export function rng(seed: number) {
  let t = seed >>> 0
  return () => { t = (t + 0x6d2b79f5) >>> 0; let r = Math.imul(t ^ (t >>> 15), 1 | t); r ^= r + Math.imul(r ^ (r >>> 7), 61 | r); return ((r ^ (r >>> 14)) >>> 0) / 4294967296 }
}

/**
 * Rooftop plant as the photos show it: clusters of two to four pale boxes
 * of varied size, irregularly spaced along a roof's spine (a→b), about one
 * cluster every `every` metres, kept `half` metres either side of the line.
 */
export function plantClusters(part: Part, a: XY, b: XY, z: number, seed: number, o: { every?: number; half?: number; detail?: boolean } = {}) {
  const r = rng(seed), every = o.every ?? 80, half = o.half ?? 7
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [-u[1], u[0]]
  const count = Math.max(1, Math.round(L / every))
  for (let c = 0; c < count; c++) {
    const s0 = (L * (c + 0.2 + 0.6 * r())) / count
    const k = (o.detail ? 3 : 2) + Math.floor(r() * 2)
    let s = s0
    for (let i = 0; i < k; i++) {
      const len = 3 + r() * 8, wid = 2.5 + r() * 4, h = 1.2 + r() * 2.2, off = (r() - 0.5) * 2 * Math.max(0, half - wid / 2)
      const c0: XY = [a[0] + u[0] * s + n[0] * off, a[1] + u[1] * s + n[1] * off]
      const hx = (Math.abs(u[0]) * len + Math.abs(n[0]) * wid) / 2, hy = (Math.abs(u[1]) * len + Math.abs(n[1]) * wid) / 2
      box(part, part, rect(c0[0] - hx, c0[1] - hy, c0[0] + hx, c0[1] + hy), z, z + h, o.detail ? 0.15 : 0)
      s += len / 2 + 1.5 + r() * 4
    }
  }
}

/**
 * A hub tower as the photos show them: a pale multi-storey block with broad
 * window bands two storeys high, white spandrels between, and a square red
 * accent panel high on the face that `red` names (0..3 from the south face,
 * anticlockwise), as on A's and C's hub towers.
 */
export function hubTower(p: ConcourseParts, r: XY[], z0: number, z1: number, o: { red?: number | XY; detail?: boolean; wallFrom?: number } = {}) {
  const ring = box(p.wall, p.pale, r, o.wallFrom ?? z0, z1, 0.4)
  const story = 3.8, band = 2 * story
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    for (let z = z0 + 1.2; z + band - 1.2 <= z1 - 1.4; z += band) {
      panelRow(p.win, a, b, z + 0.6, z + band - 1.0, { bay: 6, gap: 1.1, end: 1.0 })
      if (o.detail) mullions(p.trim, a, b, z + 0.6, z + band - 1.0, 1.5, 0.12, 0.09)
    }
    const L0 = Math.hypot(b[0] - a[0], b[1] - a[1]), out: XY = [(b[1] - a[1]) / (L0 || 1), -(b[0] - a[0]) / (L0 || 1)]
    const isRed = typeof o.red === 'number' ? o.red === i : !!o.red && L0 > 8 && out[0] * o.red[0] + out[1] * o.red[1] > 0.7
    if (isRed) {
      const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], w = Math.min(6, L * 0.35)
      const m = L * 0.72
      bandRow(p.red, [a[0] + u[0] * (m - w / 2), a[1] + u[1] * (m - w / 2)], [a[0] + u[0] * (m + w / 2), a[1] + u[1] * (m + w / 2)], z1 - 1.6 - w, z1 - 1.6, 0.12)
    }
  }
}

/**
 * Jet bridges along OSM `aeroway=jet_bridge` lines, floor at z: pale metal
 * tunnels 3.5 m wide and 4 m tall. The low model draws each as one straight
 * box, building to aircraft, on a square post near the aircraft end; the
 * detail model follows every leg, with round rotundas at the bends, round
 * posts and the cab.
 */
export function jetBridges(body: Part, post: Part, lines: XY[][], z: number, detail: boolean) {
  const W = 3.5, H = 4
  for (const l0 of lines) {
    if (!detail) {
      const a = l0[0], b = l0.at(-1)!
      jetBridge(body, post, a, b, z, W, H, false, false)
      const L = Math.hypot(b[0] - a[0], b[1] - a[1]); if (L < 4) continue
      // the post nearer whichever end is outboard (the far end from the building is not known; use 70% along)
      const t = 0.7, c: XY = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
      walls(post, [[c[0] + 0.8, c[1]], [c[0] - 0.4, c[1] + 0.7], [c[0] - 0.4, c[1] - 0.7]], 0, z) // a three-sided post
      continue
    }
    const l = l0
    for (let i = 0; i < l.length - 1; i++) jetBridge(body, post, l[i], l[i + 1], z, W, H, i === l.length - 2)
    for (let i = 1; i < l.length - 1; i++) { // rotundas at the bends
      lathe(body, l[i][0], l[i][1], [[0.01, z - 0.3], [2.8, z - 0.3], [2.8, z + H + 0.3], [0.01, z + H + 0.3]], 12)
      lathe(post, l[i][0], l[i][1], [[0.9, 0], [0.9, z - 0.3]], 8)
    }
    const a = l.at(-2)!, b = l.at(-1)!, L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
    jetBridge(body, post, [b[0] - u[0] * 3, b[1] - u[1] * 3], [b[0] + u[0] * 0.5, b[1] + u[1] * 0.5], z - 0.2, 4.6, H + 0.4, false)
  }
}

/** Write a GLB under a triangle and byte budget. */
export async function writeModel(file: string, name: string, parts: Array<{ part: Part; material: MaterialSpec }>, o: { bearing: number; height: number; maxTris: number; maxBytes: number }) {
  const used = parts.filter(({ part }) => part.triangles > 0)
  const triangles = used.reduce((t, { part }) => t + part.triangles, 0)
  const glb = writeGlb(name, used, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
    bearing: o.bearing, elevation: 0, height: o.height,
  })
  console.log(`${file}: ${triangles} triangles, ${glb.length} bytes, ${used.length} materials`)
  if (triangles > o.maxTris) throw new Error(`${file}: triangle budget exceeded: ${triangles}`)
  if (glb.length > o.maxBytes) throw new Error(`${file}: size budget exceeded: ${glb.length} bytes`)
  await Bun.write(new URL(`../models/${file}`, import.meta.url).pathname, glb)
}

// ---------------------------------------------------------------------------
// The Domestic Terminal

// OSM outlines in this frame.
const CENTRAL: XY[] = [[24.3, 20.1], [-128.0, 19.2], [-201.7, 19.0], [-273.4, 18.8], [-273.2, -56.9], [-201.7, -57.1], [-127.6, -57.4], [25.1, -57.8], [25.0, -43.0], [2.0, -43.5], [2.0, -36.6], [1.9, -23.7], [27.9, -23.7], [27.8, -6.0], [1.8, -5.8], [1.9, -0.8], [1.8, 6.7], [14.8, 5.5], [14.8, 13.5], [24.3, 13.5]]
const COURT: XY[] = [[-210.4, 0.5], [-210.5, 12.8], [-225.4, 12.8], [-225.3, 6.0], [-243.9, 6.0], [-243.5, -50.0], [-210.5, -49.8], [-210.6, -37.6]]

// Heights (lidar, above the lowest ground)
const H_CENTRAL = 13, H_WEST = 20, H_ATRIUM = 22, H_ATRIUM_END = 25.5
const HALL_IN = 13.8, HALL_OUT = 17.4, SPRING = 20.5, CREST = 29.8
const XW = -252, XE = 39 // the halls' ends
const CX0 = -238, CX1 = 25.3 // the canopies' ends (OSM)

export function build(detail: boolean) {
  const wall = new Part(), win = new Part(), roof = new Part(), pale = new Part(), trim = new Part(), cover = new Part()
  const panel = roof // the curb fronts' grey metal panel reads as the hall roofs' grey: one material

  // --- The halls: long shed roofs rising to the curb fronts, which stand
  // under the canopies' springing. North: y 19..43.6, south: y -57.6..-80.
  const halls: { y0: number; y1: number; front: number }[] = [
    { y0: 19.6, y1: 43.6, front: 1 },
    { y0: -80.0, y1: -57.6, front: -1 },
  ]
  for (const h of halls) {
    const yIn = h.front > 0 ? h.y0 : h.y1, yOut = h.front > 0 ? h.y1 : h.y0
    const zAt = (y: number) => HALL_IN + (HALL_OUT - HALL_IN) * (y - yIn) / (yOut - yIn)
    // roof (faces up)
    const r = rect(XW, h.y0, XE, h.y1)
    pale.quad([r[0][0], r[0][1], zAt(r[0][1])], [r[1][0], r[1][1], zAt(r[1][1])], [r[2][0], r[2][1], zAt(r[2][1])], [r[3][0], r[3][1], zAt(r[3][1])])
    // curb front: charcoal panel up to the spring beam, glazed below
    const fa: XY = h.front > 0 ? [XE, yOut] : [XW, yOut], fb: XY = h.front > 0 ? [XW, yOut] : [XE, yOut]
    panel.quad([fa[0], fa[1], 0], [fb[0], fb[1], 0], [fb[0], fb[1], SPRING - 1.2], [fa[0], fa[1], SPRING - 1.2])
    panelRow(win, fa, fb, 1.0, 5.6, { bay: 12, gap: 2.5, end: 4 })
    panelRow(win, fa, fb, 8.4, 15.6, { bay: 9, gap: 3.5, end: 6 })
    if (detail) { mullions(trim, fa, fb, 1.0, 5.6, 2.6, 0.16, 0.1); mullions(trim, fa, fb, 8.4, 15.6, 3, 0.16, 0.1) }
    // the spring beam the vault sits on (white steel)
    bandRow(trim, fa, fb, SPRING - 1.6, SPRING + 0.2, 0.6)
    // roof edge above the panel at the front (fills to the shed roof)
    // east end wall (towards Concourse T) and the back wall above the central block
    const ea: XY = [XE, h.y0], eb: XY = [XE, h.y1]
    const e0 = h.front > 0 ? ea : eb, e1 = h.front > 0 ? eb : ea
    for (let k = 0; k < 4; k++) {
      const t0 = k / 4, t1 = (k + 1) / 4
      const P = (t: number): XY => [e0[0], e0[1] + (e1[1] - e0[1]) * t]
      const A = P(t0), B = P(t1)
      wall.quad([A[0], A[1], 0], [B[0], B[1], 0], [B[0], B[1], zAt(B[1])], [A[0], A[1], zAt(A[1])])
    }
    // back wall: the strip above the central block's roof
    const ba: XY = h.front > 0 ? [XW, yIn] : [XE, yIn], bb: XY = h.front > 0 ? [XE, yIn] : [XW, yIn]
    wall.quad([ba[0], ba[1], H_CENTRAL - 0.5], [bb[0], bb[1], H_CENTRAL - 0.5], [bb[0], bb[1], HALL_IN], [ba[0], ba[1], HALL_IN])
    // the curb-front wall from the shed roof's edge up to the beam
    const fz = HALL_OUT
    panel.quad([fa[0], fa[1], fz - 0.2], [fb[0], fb[1], fz - 0.2], [fb[0], fb[1], SPRING - 1.2], [fa[0], fa[1], SPRING - 1.2])
    // a skylight ridge along each hall (NAIP shows a pale strip)
    if (detail) {
      for (let x = XW + 10; x < XE - 10; x += 12) {
        const ym = (h.y0 + h.y1) / 2
        box(trim, trim, rect(x, ym - 1.2, x + 6, ym + 1.2), zAt(ym) - 0.3, zAt(ym) + 0.6, 0)
      }
    }
  }

  // --- The west end block, 20 m, and the central block, 13 m, with its court.
  {
    const west = clean([[-273.4, -90.0], [-252.1, -90.0], [-252.1, 53.4], [-273.4, 53.4]])
    box(wall, pale, west, 0, H_WEST, 0.5)
    for (let i = 0; i < west.length; i++) {
      const a = west[i], b = west[(i + 1) % west.length]
      if (Math.abs(a[0] - b[0]) < 0.1 && a[0] > -260) continue // the side against the halls
      panelRow(win, a, b, 3.0, 7.2, { bay: 8, gap: 1.6 })
      panelRow(win, a, b, 10.4, 17.2, { bay: 8, gap: 1.6 })
      if (detail) mullions(trim, a, b, 10.4, 17.2, 2.4)
    }
    // the hall ends against the west block's side above the block? (the block is taller: no gap)
    const central = clean(clip(CENTRAL, -1, 0, 252.1), 0.05) // x >= -252.1
    const court = clean(COURT, 0.05)
    walls(wall, central, 0, H_CENTRAL)
    capWithHoles(pale, central, [court], H_CENTRAL)
    // the court's walls face inwards
    const cr = court.slice().reverse()
    walls(wall, cr, 0, H_CENTRAL)
    for (let i = 0; i < cr.length; i++) panelRow(win, cr[i], cr[(i + 1) % cr.length], 3, 10.4, { bay: 7, gap: 1.6 })
    // windows on the central block's east face (towards Concourse T)
    for (let i = 0; i < central.length; i++) {
      const a = central[i], b = central[(i + 1) % central.length]
      if (Math.min(a[0], b[0]) > 0) panelRow(win, a, b, 3, 10.4, { bay: 7, gap: 1.6 })
    }
    // parapet lips
    const lip = inset(central, 0.6)
    walls(trim, central, H_CENTRAL, H_CENTRAL + 0.6, central)
  }

  // --- The atrium: a 22 m hall over the central block, end bands at 25.5 m,
  // and the round glazed skylight on a raised square near its middle.
  {
    const at = rect(-176, -52, -80, 14)
    box(wall, pale, at, H_CENTRAL, H_ATRIUM, 0.4)
    for (let i = 0; i < 4; i++) {
      const a = at[i], b = at[(i + 1) % 4]
      panelRow(win, a, b, 15.2, 20.6, { bay: 8, gap: 1.2, end: 2 })
      if (detail) mullions(trim, a, b, 15.2, 20.6, 2)
    }
    for (const x of [-176, -82]) box(wall, pale, rect(x, -52, x + 2, 14), H_ATRIUM, H_ATRIUM_END, 0.3)
    // the raised square under the dome, with sloped glazing around it
    const cx = -128, cy = -20
    box(wall, pale, rect(cx - 17, cy - 17, cx + 17, cy + 17), H_ATRIUM, H_ATRIUM + 1.2, 0.3)
    // the dome: glass, ribs in the detail model
    const R = 12, rise = 3.4, z0 = H_ATRIUM + 1.2
    const prof: XY[] = Array.from({ length: 6 }, (_, i) => { const a = (i / 5) * (Math.PI / 2); return [R * Math.cos(a), z0 + rise * Math.sin(a)] as XY })
    lathe(cover, cx, cy, prof, 16)
    // the dome's ring beam
    lathe(trim, cx, cy, [[R + 0.6, z0 - 0.2], [R + 0.6, z0 + 0.5], [R, z0 + 0.5]], 16)
    if (detail) {
      for (let k = 0; k < 16; k++) {
        const a = (k / 16) * 2 * Math.PI
        for (let i = 0; i < 5; i++) {
          const p = prof[i], q = prof[i + 1]
          strut(trim, [cx + (p[0] + 0.05) * Math.cos(a), cy + (p[0] + 0.05) * Math.sin(a), p[1] + 0.1], [cx + (q[0] + 0.05) * Math.cos(a), cy + (q[0] + 0.05) * Math.sin(a), q[1] + 0.1], 0.3)
        }
      }
    }
    // skylight strips either side of the square (NAIP)
    for (const [x0, x1] of [[-170, -150], [-106, -86]]) {
      const g = rect(x0, -40, x1, 0)
      cover.quad([g[0][0], g[0][1], H_ATRIUM + 0.25], [g[1][0], g[1][1], H_ATRIUM + 0.25], [g[2][0], g[2][1], H_ATRIUM + 0.25], [g[3][0], g[3][1], H_ATRIUM + 0.25])
    }
  }

  // --- Rooftop plant on the central block (NAIP: rows of grey boxes).
  {
    const plant: [number, number, number, number, number][] = [
      [-60, -20, -44, -8, 3.5], [-38, -30, -24, -18, 3], [-38, -8, -22, 4, 3], [-14, -36, -2, -26, 2.5],
      [-246, 8, -232, 16, 3], [-200, -54, -186, -44, 3], [-74, 4, -62, 14, 3],
    ]
    for (const [x0, y0, x1, y1, h] of plant) box(roof, roof, rect(x0, y0, x1, y1), H_CENTRAL, H_CENTRAL + h, 0.2)
    if (detail) {
      for (let x = -230; x < -190; x += 7) box(roof, roof, rect(x, -36, x + 5, -30), H_CENTRAL, H_CENTRAL + 1.8, 0.1)
      for (let x = -66; x < -10; x += 8) box(roof, roof, rect(x, -50, x + 5, -45), H_CENTRAL, H_CENTRAL + 1.6, 0.1)
    }
  }

  // --- The canopies: barrel vaults over the curbs, the cover translucent,
  // white arches every bay standing proud, zig-zag legs along the far curb.
  for (const c of [{ yA: 43.6, yB: 98.0 }, { yA: -80.0, yB: -136.0 }]) {
    const BAYS = 16
    const { A, ribs } = vault({ x0: CX0, x1: CX1, yA: c.yA, yB: c.yB, zs: SPRING, zc: CREST, cover, soffit: trim, rib: trim, bays: BAYS, seg: detail ? 20 : 9, ribW: 1.1, ribD: 0.75 })
    const out = A(1) // the eave over the far curb
    const sgn = Math.sign(c.yB - c.yA)
    // eave beam along the far side
    const eaveY = out.s
    {
      const a: XY = sgn > 0 ? [CX0, eaveY] : [CX1, eaveY], b: XY = sgn > 0 ? [CX1, eaveY] : [CX0, eaveY]
      // outward faces: for the north canopy the outside is +y
      const A2: XY = sgn > 0 ? [CX1, eaveY] : [CX0, eaveY], B2: XY = sgn > 0 ? [CX0, eaveY] : [CX1, eaveY]
      bandRow(trim, A2, B2, out.z - 1.4, out.z + 0.1, 0.5)
      void a; void b
    }
    // legs: from each arch foot down to the curb at the bay mid-points, and back
    const footY = eaveY - sgn * 1.0
    for (let k = 0; k < ribs.length - 1; k++) {
      const xa = ribs[k], xb = ribs[k + 1], xm = (xa + xb) / 2
      const top = (x: number): V3 => [x, eaveY - sgn * 0.3, out.z - 1.2]
      const foot: V3 = [xm, footY, 0.5]
      strut(trim, top(xa + (k === 0 ? 0.9 : 0)), foot, 0.9)
      strut(trim, top(xb - (k === ribs.length - 2 ? 0.9 : 0)), foot, 0.9)
      if (detail) {
        // the lattice: two diagonals per bay across each third of the arch
        const n = 6
        for (let i = 0; i < n; i++) {
          const p = A(i / n), q = A((i + 1) / n)
          const P = (pt: typeof p, x: number): V3 => [x, pt.s - pt.ns * 0.6, pt.z - pt.nz * 0.6]
          strut(trim, P(p, xa), P(q, xb), 0.35)
          strut(trim, P(p, xb), P(q, xa), 0.35)
        }
        // purlins along the vault
        for (let i = 1; i < n; i++) {
          const p = A(i / n)
          strut(trim, [xa, p.s - p.ns * 0.6, p.z - p.nz * 0.6], [xb, p.s - p.ns * 0.6, p.z - p.nz * 0.6], 0.3)
        }
      }
    }
  }

  return [
    { part: wall, material: ATL.wall },
    { part: win, material: ATL.window },
    { part: roof, material: ATL.roof },
    { part: pale, material: ATL.roofPale },
    // The canopies' white steel is floodlit from below at night (dusk photos).
    { part: trim, material: { ...ATL.trim, floodlight: (q: V3, n: V3) => (q[2] > 6 ? 0.7 - 0.4 * Math.max(0, n[2]) : 0) } },
    { part: cover, material: ATL.cover },
  ]
}

if (import.meta.main) {
  const o = { bearing: 0, height: CREST + 0.8 }
  await writeModel('atl-hartsfield-jackson-domestic-terminal.glb', 'Hartsfield-Jackson Domestic Terminal', build(false), { ...o, maxTris: 8000, maxBytes: 250_000 })
  await writeModel('atl-hartsfield-jackson-domestic-terminal.detail.glb', 'Hartsfield-Jackson Domestic Terminal', build(true), { ...o, maxTris: 40_000, maxBytes: 1536 * 1024 })
}
