/**
 * DFW Airport Terminal A — procedural, CC0-1.0, no textures.
 *
 *   bun generators/dal-dfw-terminal-a.ts
 *
 * Writes models/dal-dfw-terminal-a.glb (low) and .detail.glb: jet-bridge
 * cabs and posts, mullion groups, pale rooftop plant in clusters, the
 * skylight strips along the raised spine (`glass`), the stepped precast
 * piers and the white departures canopy along the curb face, the stations'
 * standing-seam ribs.
 * Also holds the small kit the other three 1974 half-loop terminals import
 * (dal-dfw-terminal-b, -c, -e): `DFW` colours, the airside reference curve,
 * wedge zones, roof bands, Skylink stations, jet bridges, canopies and the
 * writer. Importing this file builds nothing.
 *
 * Frame: x east, y north, z up, metres, bearing 0 (as Terminal D next door).
 * Anchor -97.036787 32.9045271: area centroid of the OSM outline
 * way/25475188 (outer of relation/6321033 "Terminal A").
 *
 * Terminal A (HOK / Brodsky, Hopf & Adler, opened 1974) is one of DFW's four
 * original "half-loop" terminals: a long, low, two-level building bent in a
 * half ellipse round its parking, its airside face to the apron and its
 * landside face on the two-level curb road inside the loop. Identifying
 * features, from the photos, NAIP and lidar:
 * - the long curved band itself, flat-roofed in tan-grey, with a raised
 *   spine (about 3.5 m higher) running down its middle;
 * - the two Skylink stations (2005) standing on the airside at the two
 *   diagonal ends: long white boxes with a gently arched roof, big glazing
 *   and a white canopy over the track, much taller than the terminal;
 * - the headhouse: the higher block at the middle of the landside;
 * - the gate fronts: glazed holdrooms over the ramp level, the jet bridges
 *   fanning out to the stands;
 * - the north and south wings running back towards the spine road.
 * The Skylink track along the airside and the roads are not modelled.
 *
 * Evidence
 * - OSM: relation/6321033, outer way/25475188 (243 nodes), used as mapped;
 *   its building:part ways (9 to 15 m tags, not used for heights); the
 *   jet bridges (aeroway=jet_bridge), drawn where mapped.
 * - Lidar: USGS 3DEP TX_Pecos_Dallas_B3_2018 (flown 2018), 1 m grid,
 *   work/dfw/lidar/A.json, read across the band at every 3 degrees round
 *   the loop (work/dfw/pol-A.png). Above the apron (176.0 m): side strips
 *   10.5–11 m; the raised spine 14–15 m (16 m in the middle third); the
 *   headhouse 18–19 m; the Skylink stations 20 m at their edges and ends,
 *   24–25 m along their crown; the station end cores 25–26 m.
 * - NAIP (USGS orthophoto via tools/usgs.py): the plan, the tan-grey roofs
 *   (#beb6aa median inside the outline), the jet bridges.
 * - Map terrain (Mapterhorn): the apron (176.3 m, lidar ground just off the
 *   airside face) 1.6 m above the lowest ground under the footprint
 *   (174.7 m, the lower curb road); every wall runs down to y = 0.
 * - Published: opened 13 January 1974; Skylink opened 2005 with two
 *   stations per terminal; the Terminal Renewal and Improvement Program
 *   (TRIP, 2012–2021) rebuilt A, B, C and E inside their 1974 shells
 *   (Wikipedia, "Dallas Fort Worth International Airport", "Skylink (DFW
 *   Airport)").
 * - Photos (Wikimedia Commons / Flickr):
 *   https://commons.wikimedia.org/wiki/File:DFW_Terminals_ACD_View_from_Takeoff_(52831109800).jpg
 *     (formulanone, CC BY-SA 2.0, 2021) the terminals from the north-east
 *     air: tan-grey roofs and raised spine, the white spine face, a station
 *     box beside the track, tan concrete walls;
 *   https://commons.wikimedia.org/wiki/File:Dallas-Fort_Worth_Terminal_A.jpg
 *     (Sahmeditor, CC BY-SA 3.0, 2009) A and the loop from the south-west;
 *   https://commons.wikimedia.org/wiki/File:Terminal_E_at_Dallas_Fort_Worth_International_Airport,_aerial_view_from_cabin_window_during_takeoff,_2023-02-18.jpg
 *     (Tim Kiser, CC BY-SA 4.0) a sister terminal whole, from the east;
 *   https://commons.wikimedia.org/wiki/File:Skylink_at_Terminal_E.jpg
 *     (Baseball Watcher, CC BY-SA 4.0, 2017) a station's airside face:
 *     the arched white roof edge, two glass tiers, the canopy over the track;
 *   https://commons.wikimedia.org/wiki/File:American_Airlines_Boeing_737_at_Terminal_C.jpg
 *     (MackenzieKram, CC BY-SA 4.0, 2019) the same station type, silver;
 *   https://commons.wikimedia.org/wiki/File:AA_at_terminal_a.png
 *     (DatraxMada, CC BY-SA 4.0, 2018) gate A19, the jet bridges.
 *
 * Compared: the station type against the Terminal E and B photos
 * (work/dal-dfw-terminal-e/cmp-station.png, work/dal-dfw-terminal-b/cmp-larkins.png),
 * the plan against NAIP (work/dal-dfw-terminal-a/cmp-top.png).
 * Estimated: the holdroom glazing (bays, heights) and the ramp-level
 * openings from the sister terminals' photos; station glazing tiers from the
 * Terminal E photo; jet-bridge section 2.8 × 3 m at 4.6 m; plant boxes.
 * Review round 1 (lead): glass is the palette's slate `window` (#64798a),
 * not a light variant: every photo shows the terminal and station glazing
 * dark-tinted. The stations have a real shallow barrel roof (2.4 m camber
 * across, arched along) with 1.8 m eaves on every side, a 1.3 m white
 * fascia and soffit, and dark glass bands between white bands (Larkins and
 * Baseball Watcher photos), in both LODs. Jet bridges and plant share the
 * silver-white finish, which keeps E within six materials.
 * Doubts: no licensed close photo of A's own airside or landside faces;
 * they are drawn as the sister terminals'. The lidar predates the last TRIP
 * work, which changed interiors and curbs, not the roofs.
 */
import { Part, writeGlb, type V3, type MaterialSpec } from './mesh'
import { PALETTE, finish, type Swatch } from './palette'
import { clean, clip, area, cap, walls, inset, lathe, type XY } from './clt-terminal'

export type { XY }

// ---------------------------------------------------------------------------
// Shared colours, from the daylight photos and NAIP, pulled to the palette.

export const DFW = {
  /** Tan precast concrete of the 1974 shells. */
  wall: finish('dfw-precast', 0xd9d1c3),
  /** Holdroom and station glass: dark-tinted in every photo, so the palette's slate; lit at night. */
  window: PALETTE.window,
  /** Tan-grey flat roofs (NAIP median #beb6aa, pulled light). */
  roof: finish('dfw-roof', 0xcdc5b6),
  /** Silver-white metal: the stations and their roofs, the spine's clerestory face, canopies, fascias, jet bridges, plant. */
  white: finish('dfw-white', 0xeceeee),
  /** The skylight strips along the raised spine (detail); stays dark at night. */
  glass: PALETTE.glass,
}

/** `x` takes a sixth, terminal-specific finish (`TerminalSpec.xMaterial`). */
/** `metal` is drawn in the white finish (jet bridges, plant, posts); kept apart only for clarity. */
export type Parts = { wall: Part; win: Part; roof: Part; white: Part; metal: Part; glass: Part; x: Part }
export const newParts = (): Parts => ({ wall: new Part(), win: new Part(), roof: new Part(), white: new Part(), metal: new Part(), glass: new Part(), x: new Part() })
function merged(a: Part, b: Part) { const m = new Part(); m.pos = [...a.pos, ...b.pos]; m.nrm = [...a.nrm, ...b.nrm]; m.uv = [...a.uv, ...b.uv]; return m }
export const materials = (p: Parts, x?: Swatch) => [
  ...(x ? [{ part: p.x, material: x as MaterialSpec }] : []),
  { part: p.wall, material: DFW.wall as MaterialSpec },
  { part: p.win, material: DFW.window as MaterialSpec },
  { part: p.roof, material: DFW.roof as MaterialSpec },
  { part: merged(p.white, p.metal), material: DFW.white as MaterialSpec },
  { part: p.glass, material: DFW.glass as MaterialSpec },
]

// ---------------------------------------------------------------------------
// Geometry helpers

const rad = (d: number) => (d * Math.PI) / 180
export const unit = (v: V3): V3 => { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l] }
export const ccw = (r: XY[]) => (area(r) < 0 ? r.slice().reverse() : r.slice())

/** A quad with explicit (smooth) normals, wound to agree with them. */
export function quadN(p: Part, a: V3, b: V3, c: V3, d: V3, n: [V3, V3, V3, V3]) {
  p.tri(a, b, c, undefined, undefined, undefined, [n[0], n[1], n[2]])
  p.tri(a, c, d, undefined, undefined, undefined, [n[0], n[2], n[3]])
}

/** Distances along the ray from c at angle th (degrees) to every crossing of the ring. */
export function rayHits(ring: XY[], c: XY, th: number): number[] {
  const dx = Math.cos(rad(th)), dy = Math.sin(rad(th)), ts: number[] = []
  for (let i = 0; i < ring.length; i++) {
    const p = ring[i], q = ring[(i + 1) % ring.length], ex = q[0] - p[0], ey = q[1] - p[1]
    const den = dx * ey - dy * ex; if (Math.abs(den) < 1e-9) continue
    const t = ((p[0] - c[0]) * ey - (p[1] - c[1]) * ex) / den, u = ((p[0] - c[0]) * dy - (p[1] - c[1]) * dx) / den
    if (t > 0 && u >= 0 && u < 1) ts.push(t)
  }
  return ts.sort((a, b) => a - b)
}

/**
 * The airside reference: the distance R(θ) from the loop centre to the
 * terminal's regular airside face, read off the outline by rays every half
 * degree, with the stations' bulges (`holes`) bridged and the gate notches
 * smoothed out. Depths `d` into the band are measured inwards from it.
 */
export function airsideRef(ring: XY[], c: XY, th0: number, th1: number, holes: [number, number][] = [], med = 5, mean = 2) {
  const step = 0.5, n = Math.round((th1 - th0) / step) + 1
  const R: number[] = []
  for (let i = 0; i < n; i++) {
    const th = th0 + i * step
    const h = rayHits(ring, c, th)
    R.push(holes.some(([a, b]) => th >= a && th <= b) || !h.length ? NaN : h[h.length - 1])
  }
  // bridge the gaps
  for (let i = 0; i < n; i++) if (Number.isNaN(R[i])) {
    let a = i - 1; while (a >= 0 && Number.isNaN(R[a])) a--
    let b = i + 1; while (b < n && Number.isNaN(R[b])) b++
    R[i] = a < 0 ? R[b] : b >= n ? R[a] : R[a] + ((R[b] - R[a]) * (i - a)) / (b - a)
    if (a < 0 && b >= n) R[i] = 100
  }
  const win = (src: number[], k: number, f: (v: number[]) => number) => src.map((_, i) => f(src.slice(Math.max(0, i - k), Math.min(n, i + k + 1))))
  const m1 = win(R, Math.round(med / step), (v) => v.slice().sort((x, y) => x - y)[v.length >> 1])
  const m2 = win(m1, Math.round(mean / step), (v) => v.reduce((s, x) => s + x, 0) / v.length)
  return (th: number) => {
    const f = Math.min(Math.max((th - th0) / step, 0), n - 1), i = Math.floor(f), t = f - i
    return i + 1 < n ? m2[i] * (1 - t) + m2[i + 1] * t : m2[i]
  }
}
export type Ref = (th: number) => number

/** The point at angle th, depth d inside the airside reference. */
export const at = (ref: Ref, c: XY, th: number, d: number): XY => { const r = ref(th) - d; return [c[0] + r * Math.cos(rad(th)), c[1] + r * Math.sin(rad(th))] }

/** A curved band between angles th0..th1 and depths d0..d1, as a CCW ring. */
export function bandRing(ref: Ref, c: XY, th0: number, th1: number, d0: number, d1: number, step = 1.5): XY[] {
  const k = Math.max(1, Math.ceil(Math.abs(th1 - th0) / step))
  const out: XY[] = [], inn: XY[] = []
  for (let i = 0; i <= k; i++) { const th = th0 + ((th1 - th0) * i) / k; out.push(at(ref, c, th, d0)); inn.push(at(ref, c, th, d1)) }
  return ccw([...out, ...inn.reverse()])
}

/** The part of a ring between the rays from c at th0 and th1 (degrees, th0 < th1). */
export function wedge(ring: XY[], c: XY, th0: number, th1: number): XY[] {
  if (th1 - th0 > 179.5) throw new Error(`wedge wider than 180 degrees: ${th0}..${th1}`)
  const s0 = Math.sin(rad(th0)), c0 = Math.cos(rad(th0)), s1 = Math.sin(rad(th1)), c1 = Math.cos(rad(th1))
  let r = clip(ring, s0, -c0, s0 * c[0] - c0 * c[1])
  r = clip(r, -s1, c1, -s1 * c[0] + c1 * c[1])
  return r
}

/** Classify an edge a→b of a CCW ring as facing the apron (1), the curb (-1) or along the band (0). */
export function facing(c: XY, a: XY, b: XY) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1
  const n: XY = [(b[1] - a[1]) / L, -(b[0] - a[0]) / L], m: XY = [(a[0] + b[0]) / 2 - c[0], (a[1] + b[1]) / 2 - c[1]]
  const ml = Math.hypot(m[0], m[1]) || 1, dot = (n[0] * m[0] + n[1] * m[1]) / ml
  return dot > 0.45 ? 1 : dot < -0.45 ? -1 : 0
}

/** Panels along a→b (outside to the right), `bay` wide with `gap` piers, `end` clear, set `out` proud. */
export function panelRow(p: Part, a: XY, b: XY, z0: number, z1: number, o: { bay?: number; gap?: number; end?: number; out?: number } = {}) {
  const bay = o.bay ?? 9, gap = o.gap ?? 1.4, end = o.end ?? 0.9, out = o.out ?? 0.05
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  if (L < 2 * end + 2.2 || z1 - z0 < 0.6) return
  const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], nn: XY = [u[1], -u[0]]
  const usable = L - 2 * end, k = Math.max(1, Math.round((usable + gap) / (bay + gap))), w = (usable - (k - 1) * gap) / k
  for (let q = 0; q < k; q++) {
    const s0 = end + q * (w + gap), s1 = s0 + w
    const P = (s: number, z: number): V3 => [a[0] + u[0] * s + nn[0] * out, a[1] + u[1] * s + nn[1] * out, z]
    p.quad(P(s0, z0), P(s1, z0), P(s1, z1), P(s0, z1))
  }
}

/** Thin vertical mullion bars (detail) along a→b every `step`. */
export function mullions(p: Part, a: XY, b: XY, z0: number, z1: number, step = 3, w = 0.16, out = 0.11) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]); if (L < step) return
  const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], nn: XY = [u[1], -u[0]]
  const n = Math.max(1, Math.round(L / step))
  for (let i = 1; i < n; i++) {
    const s = (L * i) / n, P = (ds: number, z: number): V3 => [a[0] + u[0] * (s + ds) + nn[0] * out, a[1] + u[1] * (s + ds) + nn[1] * out, z]
    p.quad(P(-w / 2, z0), P(w / 2, z0), P(w / 2, z1), P(-w / 2, z1))
  }
}

/** A horizontal band along a→b, `out` proud, with a top ledge when deep. */
export function bandRow(p: Part, a: XY, b: XY, z0: number, z1: number, out = 0.08) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]); if (L < 1e-6) return
  const nn: XY = [(b[1] - a[1]) / L, -(b[0] - a[0]) / L]
  const A: XY = [a[0] + nn[0] * out, a[1] + nn[1] * out], B: XY = [b[0] + nn[0] * out, b[1] + nn[1] * out]
  p.quad([A[0], A[1], z0], [B[0], B[1], z0], [B[0], B[1], z1], [A[0], A[1], z1])
  if (out > 0.05) { p.quad([A[0], A[1], z1], [B[0], B[1], z1], [b[0], b[1], z1], [a[0], a[1], z1]); p.quad([a[0], a[1], z0], [b[0], b[1], z0], [B[0], B[1], z0], [A[0], A[1], z0]) }
}

/** A flat-topped prism with a small chamfer at the top edge. */
export function prism(wall: Part, top: Part | null, ring: XY[], z0: number, z1: number, bevel = 0.35) {
  const r = clean(ring, 0.15)
  if (r.length < 3) return r
  if (bevel > 0 && z1 - z0 > 2 * bevel) {
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

export const rect = (x0: number, y0: number, x1: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]

/** A box along a→b, `w` wide, from z0 to z1, with an underside. */
export function beamBox(p: Part, a: XY, b: XY, w: number, z0: number, z1: number, under = true) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]); if (L < 0.5) return
  const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [-u[1], u[0]]
  const r = ccw([[a[0] - n[0] * w / 2, a[1] - n[1] * w / 2], [b[0] - n[0] * w / 2, b[1] - n[1] * w / 2], [b[0] + n[0] * w / 2, b[1] + n[1] * w / 2], [a[0] + n[0] * w / 2, a[1] + n[1] * w / 2]])
  walls(p, r, z0, z1); cap(p, r, z1); if (under) cap(p, r, z0, false)
}

/** A small deterministic random stream. */
export function rng(seed: number) {
  let t = seed >>> 0
  return () => { t = (t + 0x6d2b79f5) >>> 0; let r = Math.imul(t ^ (t >>> 15), 1 | t); r ^= r + Math.imul(r ^ (r >>> 7), 61 | r); return ((r ^ (r >>> 14)) >>> 0) / 4294967296 }
}

// ---------------------------------------------------------------------------
// The terminal

/** A wedge of the base (between rays th0..th1) with its own side-strip height above the apron. */
export type Zone = { th: [number, number]; h: number }
/** A raised roof band: angles th, depths d (from the airside reference), height h above the apron. */
export type Band = { th: [number, number]; d: [number, number]; h: number; face?: 'white' | 'wall'; glaze?: boolean }
/** A Skylink station: angles, depths (negative = beyond the airside face), roof heights; cores at end 0, 1 or both (2). */
export type Station = { th: [number, number]; d: [number, number]; hEdge: number; hCrown: number; core?: 0 | 1 | 2 }
export type Canopy = { ring: XY[]; z0: number; z1: number }

export type TerminalSpec = {
  id: string; name: string; bearing?: number
  ring: XY[]; centre: XY
  /** The apron's height above y = 0 (the lowest ground under the footprint). */
  ground: number
  /** The angular range of the band, and the stations' bulges to bridge in the reference. */
  thRange: [number, number]; holes: [number, number][]
  zones: Zone[]; bands: Band[]; stations: Station[]
  jets: XY[][]; canopies?: Canopy[]
  extra?: (p: Parts, detail: boolean) => void
  /** Rooftop plant (detail): bands of the roof it stands on. */
  plant?: { th: [number, number]; d: [number, number]; h: number }[]
  height: number
  xMaterial?: Swatch
}

/** Facade on one outline edge of the base: holdroom glass on the airside, departures-hall glass on the curb side. */
function baseFacade(p: Parts, s: TerminalSpec, a: XY, b: XY, top: number, detail: boolean) {
  const f = facing(s.centre, a, b), g = s.ground, L = Math.hypot(b[0] - a[0], b[1] - a[1])
  if (L < 3.2) return
  if (f === 1) {
    // ramp level: service openings (detail); holdrooms above in broad glazed bays
    if (detail) panelRow(p.win, a, b, g + 0.6, g + 3.6, { bay: 7, gap: 2.2, end: 1.2 })
    panelRow(p.win, a, b, g + 5.0, top - 1.5, { bay: 11, gap: 1.6, end: 0.8 })
    bandRow(p.white, a, b, top - 1.2, top - 0.4, 0.05)
    if (detail) mullions(p.white, a, b, g + 5.0, top - 1.5, 2.6, 0.14, 0.1)
  } else if (f === -1) {
    // the curb side: the departures hall glazed above the upper road deck
    panelRow(p.win, a, b, g + 6.0, top - 1.4, { bay: 8, gap: 1.5, end: 0.9 })
    if (detail) {
      mullions(p.white, a, b, g + 6.0, top - 1.4, 2.0, 0.14, 0.1)
      // the stepped precast face: projecting piers every ~9 m, alternately
      // stopping at the parapet and rising past it
      const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], nn: XY = [u[1], -u[0]]
      const k = Math.max(1, Math.round(L / 9))
      for (let q = 0; q <= k; q++) {
        const sAt = Math.min(Math.max((L * q) / k, 1.3), L - 1.3), m: XY = [a[0] + u[0] * sAt, a[1] + u[1] * sAt]
        const r = ccw([[m[0] - u[0] * 1.2, m[1] - u[1] * 1.2], [m[0] + u[0] * 1.2, m[1] + u[1] * 1.2], [m[0] + u[0] * 1.2 + nn[0] * 1.1, m[1] + u[1] * 1.2 + nn[1] * 1.1], [m[0] - u[0] * 1.2 + nn[0] * 1.1, m[1] - u[1] * 1.2 + nn[1] * 1.1]])
        prism(p.wall, p.roof, r, 0, top + (q % 2 ? 1.6 : 0), 0.15)
      }
      // the departures canopy over the upper curb: a white slab 4.5 m deep
      const o0: XY = [a[0] + nn[0] * 4.5, a[1] + nn[1] * 4.5], o1: XY = [b[0] + nn[0] * 4.5, b[1] + nn[1] * 4.5]
      const cr = ccw([a, b, o1, o0])
      walls(p.white, cr, g + 9.0, g + 9.7); cap(p.white, cr, g + 9.7); cap(p.white, cr, g + 9.0, false)
    }
  } else if (L > 8) {
    panelRow(p.win, a, b, g + 5.4, top - 1.8, { bay: 6, gap: 2, end: 1.5 })
  }
}

/** Is the edge a→b (part of a clipped ring) on the original outline? */
function onOutline(ring: XY[], a: XY, b: XY, tol = 0.4) {
  const m: XY = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
  for (let i = 0; i < ring.length; i++) {
    const p = ring[i], q = ring[(i + 1) % ring.length], dx = q[0] - p[0], dy = q[1] - p[1], l = dx * dx + dy * dy || 1
    const t = Math.max(0, Math.min(1, ((m[0] - p[0]) * dx + (m[1] - p[1]) * dy) / l))
    if (Math.hypot(m[0] - p[0] - t * dx, m[1] - p[1] - t * dy) < tol) return true
  }
  return false
}

/**
 * A Skylink station: a long glazed hall bent along the band, carried over
 * the track and the apron service road on columns from the guideway level
 * (9 m) up, under a shallow silver-white barrel roof (arched along its
 * length too) with deep white eaves on every side; on its airside face and
 * ends dark glass bands between white horizontal bands (the platform tier,
 * the lit canopy band over the track, the tall upper hall, the fascia), and
 * white stair-and-lift cores at its ends.
 */
function station(p: Parts, s: TerminalSpec, ref: Ref, st: Station, detail: boolean) {
  const c = s.centre, g = s.ground, NA = detail ? 28 : 12, NW = detail ? 6 : 3
  const [t0, t1] = st.th, [d0, d1] = st.d, zb = g + 9.0, eave = 1.8, fas = 1.3, camber = 2.4
  const len = (Math.abs(t1 - t0) * Math.PI / 180) * (ref((t0 + t1) / 2) - (d0 + d1) / 2)
  const eT = eave / len, eW = eave / (d1 - d0)
  const P = (t: number, w: number): XY => at(ref, c, t0 + (t1 - t0) * t, d0 + (d1 - d0) * w)
  /** Roof height: arched along the hall, a barrel across it, the eaves carrying the curve on. */
  const Zr = (t: number, w: number) => {
    const tt = Math.min(Math.max(t, 0), 1), ww = 2 * w - 1
    return g + st.hEdge + (st.hCrown - camber - st.hEdge) * Math.pow(Math.sin(Math.PI * tt), 0.75) + camber * (1 - ww * ww)
  }
  const tAt = (i: number) => -eT + ((1 + 2 * eT) * i) / NA, wAt = (j: number) => -eW + ((1 + 2 * eW) * j) / NW
  const V: V3[][] = [], N: V3[][] = []
  for (let i = 0; i <= NA; i++) { V.push([]); for (let j = 0; j <= NW; j++) { const q = P(tAt(i), wAt(j)); V[i].push([q[0], q[1], Zr(tAt(i), wAt(j))]) } }
  for (let i = 0; i <= NA; i++) { N.push([]); for (let j = 0; j <= NW; j++) {
    const a = V[Math.min(i + 1, NA)][j], b = V[Math.max(i - 1, 0)][j], e = V[i][Math.min(j + 1, NW)], f = V[i][Math.max(j - 1, 0)]
    const du: V3 = [a[0] - b[0], a[1] - b[1], a[2] - b[2]], dv: V3 = [e[0] - f[0], e[1] - f[1], e[2] - f[2]]
    let n = unit([du[1] * dv[2] - du[2] * dv[1], du[2] * dv[0] - du[0] * dv[2], du[0] * dv[1] - du[1] * dv[0]])
    if (n[2] < 0) n = [-n[0], -n[1], -n[2]]
    N[i].push(n)
  } }
  const down = (v: V3): V3 => [v[0], v[1], v[2] - fas], flipN = (n: V3): V3 => [-n[0], -n[1], -n[2]]
  for (let i = 0; i < NA; i++) for (let j = 0; j < NW; j++) {
    quadN(p.white, V[i][j], V[i + 1][j], V[i + 1][j + 1], V[i][j + 1], [N[i][j], N[i + 1][j], N[i + 1][j + 1], N[i][j + 1]])
    // the soffit under the roof and its eaves
    quadN(p.white, down(V[i][j]), down(V[i][j + 1]), down(V[i + 1][j + 1]), down(V[i + 1][j]), [flipN(N[i][j]), flipN(N[i][j + 1]), flipN(N[i + 1][j + 1]), flipN(N[i + 1][j])])
  }
  // the deep fascia round the eaves
  const edge: V3[] = []
  for (let i = 0; i < NA; i++) edge.push(V[i][0])
  for (let j = 0; j < NW; j++) edge.push(V[NA][j])
  for (let i = NA; i > 0; i--) edge.push(V[i][NW])
  for (let j = NW; j > 0; j--) edge.push(V[0][j])
  const eFlip = area(edge.map((v) => [v[0], v[1]] as XY)) < 0
  for (let k = 0; k < edge.length; k++) {
    let A = edge[k], B = edge[(k + 1) % edge.length]
    if (eFlip) [A, B] = [B, A]
    p.white.quad(down(A), down(B), B, A)
  }
  // the hall's walls, under the soffit, from the underside up
  const MA = NA, MW = Math.max(2, NW - 1)
  const W = (t: number, w: number): V3 => { const q = P(t, w); return [q[0], q[1], Zr(t, w) - fas] }
  const ring: { v: V3; side: 'air' | 'end' | 'land'; k: number }[] = []
  for (let i = 0; i < MA; i++) ring.push({ v: W(i / MA, 0), side: 'air', k: i })
  for (let j = 0; j < MW; j++) ring.push({ v: W(1, j / MW), side: 'end', k: j })
  for (let i = MA; i > 0; i--) ring.push({ v: W(i / MA, 1), side: 'land', k: i })
  for (let j = MW; j > 0; j--) ring.push({ v: W(0, j / MW), side: 'end', k: j })
  const plan: XY[] = ring.map((r) => [r.v[0], r.v[1]])
  const flip = area(plan) < 0, quarter = MA / 4
  for (let k = 0; k < ring.length; k++) {
    let A = ring[k].v, B = ring[(k + 1) % ring.length].v
    if (flip) [A, B] = [B, A]
    const side = ring[k].side
    p.white.quad([A[0], A[1], zb], [B[0], B[1], zb], B, A)
    if (side === 'land') continue
    const a2: XY = [A[0], A[1]], b2: XY = [B[0], B[1]], zt = Math.min(A[2], B[2]) - 0.9
    const end = side === 'end' ? 1.2 : 0.2
    // the platform tier
    panelRow(p.win, a2, b2, g + 9.7, g + 12.9, { bay: 30, gap: 0.8, end, out: 0.06 })
    // the upper hall: four long glass sections with white bays between (photos)
    const pier = side === 'air' && ring[k].k > 0 && ring[k].k % quarter === 0
    if (zt > g + 15.8 && !pier) {
      panelRow(p.win, a2, b2, g + 15.3, zt, { bay: 30, gap: 0.8, end, out: 0.06 })
      if (detail) mullions(p.white, a2, b2, g + 15.3, zt, 3.4, 0.14, 0.1)
    }
    if (detail) mullions(p.white, a2, b2, g + 9.7, g + 12.9, 3.2, 0.12, 0.1)
  }
  cap(p.white, ccw(plan), zb, false)
  // the white canopy band over the platform: 1.6 m out at 13.4–14.6 m
  for (let i = 0; i < MA; i++) {
    const a = P(i / MA, 0), b = P((i + 1) / MA, 0), o0 = P(i / MA, -1.6 / (d1 - d0)), o1 = P((i + 1) / MA, -1.6 / (d1 - d0))
    const r = ccw([a, b, o1, o0])
    walls(p.white, r, g + 13.4, g + 14.6); cap(p.white, r, g + 14.6); cap(p.white, r, g + 13.4, false)
  }
  // columns under the hall, in pairs (the guideway's piers carry it)
  const nc = detail ? 6 : 3
  for (let k = 0; k <= nc; k++) for (const dd of [d0 + 2.5, d1 - 2.5]) {
    const th = t0 + 1.5 + ((t1 - t0 - 3) * k) / nc, q = at(ref, c, th, dd)
    const u: XY = [Math.cos(rad(th)), Math.sin(rad(th))]
    beamBox(p.white, [q[0] - u[0] * 0.8, q[1] - u[1] * 0.8], [q[0] + u[0] * 0.8, q[1] + u[1] * 0.8], 1.6, 0, zb, false)
  }
  // the end cores: white stair-and-lift towers rising past the roof
  for (const end of st.core === undefined ? [] : st.core === 2 ? [0, 1] : [st.core]) {
    const th = end === 0 ? t0 : t1, sgn = end === 0 ? -1 : 1, span = 7 / (ref(th) - d0) * (180 / Math.PI)
    const ta = th + sgn * 1.0 * (180 / Math.PI) * (eave + 0.5) / (ref(th) - d0)
    const r = bandRing(ref, c, Math.min(ta, ta + sgn * span), Math.max(ta, ta + sgn * span), d0 + 1, d0 + 11, 10)
    const top = g + st.hCrown + 1.5
    prism(p.white, p.white, r, 0, top, 0.3)
    for (let k = 0; k < r.length; k++) panelRow(p.win, r[k], r[(k + 1) % r.length], top - 4.0, top - 1.4, { bay: 8, gap: 1, end: 0.8 })
  }
  if (detail) {
    // standing-seam ribs across the barrel
    for (let i = 1; i < NA; i += 2) for (let j = 0; j < NW; j++) {
      const a = V[i][j], b = V[i][j + 1], u = unit([b[0] - a[0], b[1] - a[1], 0]), w: V3 = [-u[1] * 0.15, u[0] * 0.15, 0]
      p.white.quad([a[0] - w[0], a[1] - w[1], a[2] + 0.02], [b[0] - w[0], b[1] - w[1], b[2] + 0.02], [b[0] + w[0], b[1] + w[1], b[2] + 0.18], [a[0] + w[0], a[1] + w[1], a[2] + 0.18])
    }
  }
}

/**
 * A white tensile sail canopy: a twisted membrane over a curb, `L` long
 * along `dir` and `W` wide, its corners alternately pulled up to masts and
 * down to ground anchors (two saddles), drawn both sides, on masts.
 */
export function sail(p: Parts, c0: XY, dir: XY, L: number, W: number, zMid: number, A: number, zFoot: number, detail: boolean) {
  const u = unit([dir[0], dir[1], 0]), n: XY = [-u[1], u[0]], NL = detail ? 24 : 10, NW = detail ? 8 : 4
  const P = (s: number, w: number): V3 => {
    const ss = s * L - L / 2, ww = (w - 0.5) * W
    const z = zMid + A * Math.cos(2 * Math.PI * s) * (2 * w - 1) - 0.9 * Math.sin(Math.PI * w) * (1 - Math.abs(Math.cos(2 * Math.PI * s)))
    return [c0[0] + u[0] * ss + n[0] * ww, c0[1] + u[1] * ss + n[1] * ww, z]
  }
  const V: V3[][] = []
  for (let i = 0; i <= NL; i++) { V.push([]); for (let j = 0; j <= NW; j++) V[i].push(P(i / NL, j / NW)) }
  const nrm = (i: number, j: number): V3 => {
    const a = V[Math.min(i + 1, NL)][j], b = V[Math.max(i - 1, 0)][j], e = V[i][Math.min(j + 1, NW)], f = V[i][Math.max(j - 1, 0)]
    const du: V3 = [a[0] - b[0], a[1] - b[1], a[2] - b[2]], dv: V3 = [e[0] - f[0], e[1] - f[1], e[2] - f[2]]
    let m = unit([du[1] * dv[2] - du[2] * dv[1], du[2] * dv[0] - du[0] * dv[2], du[0] * dv[1] - du[1] * dv[0]])
    return m[2] < 0 ? [-m[0], -m[1], -m[2]] : m
  }
  const off = (v: V3, m: V3, k: number): V3 => [v[0] - m[0] * k, v[1] - m[1] * k, v[2] - m[2] * k]
  for (let i = 0; i < NL; i++) for (let j = 0; j < NW; j++) {
    const ns = [nrm(i, j), nrm(i + 1, j), nrm(i + 1, j + 1), nrm(i, j + 1)] as [V3, V3, V3, V3]
    quadN(p.white, V[i][j], V[i + 1][j], V[i + 1][j + 1], V[i][j + 1], ns)
    const dn = ns.map((m) => [-m[0], -m[1], -m[2]] as V3) as [V3, V3, V3, V3]
    quadN(p.white, off(V[i][j], ns[0], 0.15), off(V[i][j + 1], ns[3], 0.15), off(V[i + 1][j + 1], ns[2], 0.15), off(V[i + 1][j], ns[1], 0.15), [dn[0], dn[3], dn[2], dn[1]])
  }
  // masts at the high corners, 1.5 m past the membrane
  for (const [s, w] of [[0, 1], [0.5, 0], [1, 1]] as [number, number][]) {
    const q = P(s, w), out: XY = [n[0] * (w - 0.5) * 2 * 0.8, n[1] * (w - 0.5) * 2 * 0.8]
    lathe(p.white, q[0] + out[0], q[1] + out[1], [[0.32, zFoot], [0.32, q[2] + 1.5], [0.12, q[2] + 2.0]], detail ? 8 : 6)
  }
  // low struts to the ground anchors at the low corners (detail)
  if (detail) for (const [s, w] of [[0, 0], [0.5, 1], [1, 0]] as [number, number][]) {
    const q = P(s, w)
    lathe(p.white, q[0], q[1], [[0.18, zFoot], [0.18, q[2]]], 6)
  }
}

/** A jet bridge: a silver box on its polyline, floor at the holdroom level; the cab and post in detail. */
export function jetBridge(p: Parts, s: TerminalSpec, pts: XY[], detail: boolean, floor = s.ground + 4.4) {
  const z0 = floor, z1 = z0 + 3.0
  if (detail) for (let i = 0; i + 1 < pts.length; i++) beamBox(p.metal, pts[i], pts[i + 1], 2.8, z0, z1, true)
  else beamBox(p.metal, pts[0], pts[pts.length - 1], 2.8, z0, z1, false)
  if (!detail) return
  const a = pts[pts.length - 2], b = pts[pts.length - 1], L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1
  const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
  // the cab: a wider box at the aircraft end
  beamBox(p.white, [b[0] - u[0] * 3.2, b[1] - u[1] * 3.2], b, 3.8, z0 - 0.2, z1 + 0.3, true)
  // the wheeled post under it
  const q: XY = [b[0] - u[0] * 5, b[1] - u[1] * 5]
  lathe(p.metal, q[0], q[1], [[0.35, 0], [0.35, z0]], 6)
  beamBox(p.metal, [q[0] - u[1] * 1.4, q[1] + u[0] * 1.4], [q[0] + u[1] * 1.4, q[1] - u[0] * 1.4], 0.8, 0, 1.0, false)
}

export function buildTerminal(s: TerminalSpec, detail: boolean) {
  const p = newParts(), c = s.centre, g = s.ground
  const ring = ccw(clean(s.ring, 0.2))
  const ref = airsideRef(ring, c, s.thRange[0], s.thRange[1], s.holes)
  // 1. the base: each wedge zone extruded to its side-strip height
  for (const z of s.zones) {
    const r = wedge(ring, c, z.th[0], z.th[1])
    if (r.length < 3 || Math.abs(area(r)) < 5) continue
    const rr = ccw(clean(r, 0.15)), top = g + z.h
    prism(p.wall, p.roof, rr, 0, top, 0.35)
    for (let i = 0; i < rr.length; i++) {
      const a = rr[i], b = rr[(i + 1) % rr.length]
      if (onOutline(ring, a, b)) baseFacade(p, s, a, b, top, detail)
    }
  }
  // 2. raised roof bands: the spine with its white clerestory face, headhouses
  for (const bd of s.bands) {
    const r = bandRing(ref, c, bd.th[0], bd.th[1], bd.d[0], bd.d[1], detail ? 1.5 : 3)
    const top = g + bd.h
    prism(bd.face === 'wall' ? p.wall : p.white, p.roof, r, g + 6, top, detail ? 0.3 : 0)
    if (bd.glaze) for (let i = 0; i < r.length; i++) {
      const a = r[i], b = r[(i + 1) % r.length]
      if (facing(c, a, b) !== 0) panelRow(p.win, a, b, top - 3.4, top - 1.0, { bay: 10, gap: 1.2, end: 0.6 })
    }
  }
  // 2b. detail: skylight strips along the spine, plant clusters on the roofs
  if (detail) {
    const R = rng(s.id.length * 104729)
    for (const bd of s.bands) {
      const top = g + bd.h, mid = (bd.d[0] + bd.d[1]) / 2, half = (bd.d[1] - bd.d[0]) / 2
      if (bd.face !== 'wall' && half > 5) {
        // two glass strips 2 m wide, in 10 m lengths with 2.5 m breaks
        const r0 = ref((bd.th[0] + bd.th[1]) / 2) - mid, stepDeg = (12.5 / r0) * (180 / Math.PI), lenDeg = (10 / r0) * (180 / Math.PI)
        for (let th = bd.th[0] + stepDeg * 0.4; th + lenDeg < bd.th[1] - stepDeg * 0.2; th += stepDeg)
          for (const dd of [mid - half * 0.45, mid + half * 0.45]) cap(p.glass, bandRing(ref, c, th, th + lenDeg, dd - 1, dd + 1, 1.5), top + 0.06)
      }
      // plant on the band's roof
      const n = Math.max(1, Math.round(Math.abs(bd.th[1] - bd.th[0]) / 9))
      for (let k = 0; k < n; k++) plantCluster(p, ref, c, bd.th[0] + ((bd.th[1] - bd.th[0]) * (k + 0.2 + 0.6 * R())) / n, mid + (R() - 0.5) * half, top, R, ring)
    }
    // plant on the side strips: clusters along the airside strip and the landside edge
    for (const z of s.zones) {
      const n = Math.round(Math.abs(z.th[1] - z.th[0]) / 5)
      for (let k = 0; k < n; k++) {
        const th = z.th[0] + ((z.th[1] - z.th[0]) * (k + 0.2 + 0.6 * R())) / n
        if (th < s.thRange[0] || th > s.thRange[1] || s.holes.some(([a, b]) => th > a - 2 && th < b + 2)) continue
        plantCluster(p, ref, c, th, 2.5 + R() * 3, g + z.h, R, ring)
      }
    }
  }
  // 3. the Skylink stations
  for (const st of s.stations) station(p, s, ref, st, detail)
  // 4. jet bridges
  for (const j of s.jets) jetBridge(p, s, j, detail)
  // 5. curb canopies: white slabs on posts
  for (const cn of s.canopies ?? []) {
    const r = ccw(clean(cn.ring, 0.2))
    walls(p.white, r, cn.z0, cn.z1); cap(p.white, r, cn.z1); cap(p.white, r, cn.z0, false)
    if (detail) for (let i = 0; i < r.length; i += 2) {
      const m = inset(r, 1.2)[i]
      lathe(p.metal, m[0], m[1], [[0.25, 0], [0.25, cn.z0]], 6)
    }
  }
  // 6. rooftop plant (detail)
  if (detail) {
    const R = rng(s.id.length * 7919)
    for (const pl of s.plant ?? []) {
      const n = Math.round(Math.abs(pl.th[1] - pl.th[0]) / 2.2)
      for (let k = 0; k < n; k++) {
        const th = pl.th[0] + ((pl.th[1] - pl.th[0]) * (k + 0.3 + 0.4 * R())) / n, d = pl.d[0] + (pl.d[1] - pl.d[0]) * R()
        const q = at(ref, c, th, d), len = 3 + R() * 6, wid = 2.5 + R() * 3, h = 1.2 + R() * 1.6
        const tu: XY = [-Math.sin(rad(th)), Math.cos(rad(th))]
        beamBox(p.metal, [q[0] - tu[0] * len / 2, q[1] - tu[1] * len / 2], [q[0] + tu[0] * len / 2, q[1] + tu[1] * len / 2], wid, g + pl.h, g + pl.h + h, false)
      }
    }
  }
  s.extra?.(p, detail)
  return { p, ref }
}

/** Two to four pale plant boxes of varied size, clustered round (th, d) on a roof at z. */
function plantCluster(p: Parts, ref: Ref, c: XY, th: number, d: number, z: number, R: () => number, ring: XY[]) {
  const k = 2 + Math.floor(R() * 3)
  const tu: XY = [-Math.sin(rad(th)), Math.cos(rad(th))], nu: XY = [Math.cos(rad(th)), Math.sin(rad(th))]
  let s = 0
  for (let i = 0; i < k; i++) {
    const q = at(ref, c, th, d), len = 2.5 + R() * 6, wid = 2 + R() * 3, h = 1.0 + R() * 1.8, o = (R() - 0.5) * 3
    const m: XY = [q[0] + tu[0] * s + nu[0] * o, q[1] + tu[1] * s + nu[1] * o]
    s += len / 2 + 1.2 + R() * 3
    // only on the roof: every corner of the box inside the outline, clear of its edge
    const corners: XY[] = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([a, b]) => [m[0] + tu[0] * a * (len / 2 + 1.5) + nu[0] * b * (wid / 2 + 1.5), m[1] + tu[1] * a * (len / 2 + 1.5) + nu[1] * b * (wid / 2 + 1.5)])
    if (!corners.every((q) => insideRing(q, ring))) continue
    beamBox(p.metal, [m[0] - tu[0] * len / 2, m[1] - tu[1] * len / 2], [m[0] + tu[0] * len / 2, m[1] + tu[1] * len / 2], wid, z, z + h, false)
  }
}
function insideRing(pt: XY, r: XY[]) {
  let c = false
  for (let i = 0, j = r.length - 1; i < r.length; j = i++) if ((r[i][1] > pt[1]) !== (r[j][1] > pt[1]) && pt[0] < ((r[j][0] - r[i][0]) * (pt[1] - r[i][1])) / (r[j][1] - r[i][1]) + r[i][0]) c = !c
  return c
}

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

export async function writeTerminal(s: TerminalSpec) {
  for (const detail of [false, true]) {
    const { p } = buildTerminal(s, detail)
    await writeModel(detail ? `${s.id}.detail.glb` : `${s.id}.glb`, s.name, materials(p, s.xMaterial), {
      bearing: s.bearing ?? 0, height: s.height, maxTris: detail ? 40000 : 8000, maxBytes: detail ? 1_500_000 : 250_000,
    })
  }
}

// ---------------------------------------------------------------------------
// Terminal A

// --- generated from OSM (see header): anchor -97.036787 32.9045271
// way/25475188
const RING_25475188 = [[-132.1,289.7],[-116.1,288.1],[-87.3,281.6],[-85.4,281.2],[-56.5,271.0],[-36.6,263.0],[-35.7,266.8],[-25.6,261.4],[-28.8,259.0],[-24.5,256.2],[-15.8,270.8],[-14.6,277.7],[-8.0,285.8],[3.2,277.0],[7.6,273.5],[22.2,259.7],[24.4,262.3],[33.1,254.4],[58.5,231.6],[68.0,223.0],[65.8,220.2],[88.6,197.5],[91.7,194.1],[85.2,187.1],[79.9,183.2],[71.2,176.8],[78.8,167.5],[91.0,145.5],[104.7,115.1],[111.9,91.4],[118.7,60.6],[122.5,29.7],[122.3,4.0],[122.0,1.0],[118.8,-27.2],[118.2,-29.8],[113.1,-53.7],[106.8,-73.2],[100.0,-91.4],[92.5,-107.9],[90.9,-110.8],[76.4,-134.9],[65.0,-149.9],[70.1,-153.5],[64.8,-160.8],[59.5,-157.1],[52.6,-165.2],[65.9,-179.4],[71.1,-184.9],[76.8,-193.2],[62.2,-204.8],[55.5,-209.8],[48.0,-215.4],[49.2,-217.5],[39.7,-224.7],[39.0,-225.2],[2.4,-252.8],[-0.1,-249.8],[-8.3,-256.0],[-15.0,-260.6],[-17.1,-261.9],[-24.5,-266.6],[-31.7,-269.8],[-36.0,-264.0],[-40.8,-257.6],[-49.1,-261.5],[-55.6,-247.6],[-65.5,-251.2],[-79.7,-254.7],[-79.1,-258.1],[-78.2,-262.9],[-86.0,-263.9],[-89.8,-255.7],[-111.9,-258.9],[-124.6,-260.3],[-137.7,-261.9],[-137.7,-271.4],[-147.7,-271.3],[-147.6,-261.6],[-154.4,-261.5],[-197.8,-261.6],[-197.8,-273.4],[-207.0,-273.2],[-210.2,-273.2],[-210.0,-261.4],[-211.3,-261.4],[-211.2,-254.6],[-211.0,-254.6],[-203.9,-254.6],[-203.9,-249.5],[-203.9,-241.7],[-204.0,-234.4],[-203.9,-230.8],[-203.9,-230.4],[-147.7,-230.5],[-137.9,-229.7],[-139.2,-217.0],[-121.2,-215.0],[-117.3,-214.2],[-118.4,-209.4],[-114.2,-208.6],[-115.8,-201.5],[-113.8,-201.0],[-111.5,-200.5],[-108.2,-199.7],[-106.5,-207.0],[-102.9,-206.3],[-101.7,-211.2],[-97.2,-210.1],[-96.9,-211.2],[-71.9,-203.2],[-72.4,-201.8],[-69.7,-200.7],[-71.7,-196.3],[-68.3,-194.9],[-71.4,-188.0],[-68.5,-186.7],[-64.1,-184.7],[-60.7,-191.5],[-57.4,-190.1],[-55.1,-194.6],[-50.8,-192.6],[-29.6,-180.0],[-26.4,-177.8],[-29.4,-173.6],[-26.3,-171.4],[-30.6,-165.8],[-28.8,-164.4],[-26.9,-163.1],[-23.9,-160.8],[-19.3,-166.7],[-16.1,-164.5],[-13.2,-168.3],[-10.0,-165.8],[8.6,-149.3],[25.4,-130.8],[32.4,-121.3],[40.2,-111.0],[52.1,-90.8],[62.8,-67.8],[64.2,-63.7],[58.8,-61.8],[60.0,-58.5],[53.7,-55.8],[54.6,-53.0],[55.1,-51.2],[56.1,-48.0],[63.5,-50.5],[64.2,-48.0],[57.6,-45.7],[65.9,-13.2],[70.3,-13.6],[70.6,-11.5],[64.0,-10.5],[64.3,-6.8],[64.6,-4.4],[64.8,-2.1],[72.8,-3.0],[73.1,0.4],[78.4,-0.1],[78.8,5.7],[78.5,21.5],[78.0,29.3],[77.8,33.9],[72.3,33.5],[72.0,36.6],[65.0,36.0],[64.8,37.8],[64.6,41.8],[64.4,44.7],[71.6,45.4],[71.4,48.8],[71.1,52.7],[68.9,52.3],[64.8,73.4],[62.6,83.9],[56.1,82.2],[55.3,84.8],[54.6,87.0],[53.7,90.1],[59.9,92.1],[51.5,112.2],[44.3,128.3],[42.9,127.7],[40.5,132.2],[46.1,135.2],[39.8,146.2],[32.4,156.4],[25.8,165.6],[15.6,177.2],[6.3,187.2],[2.5,183.6],[-0.2,185.9],[-4.7,181.0],[-7.0,183.2],[-9.0,185.1],[-10.6,186.6],[-6.0,191.6],[-8.4,194.0],[-4.9,197.8],[-28.7,215.5],[-40.9,222.4],[-54.0,229.7],[-56.2,224.8],[-59.2,226.3],[-62.1,220.3],[-66.7,222.5],[-69.8,224.0],[-67.2,230.2],[-69.9,231.5],[-68.0,236.2],[-73.4,238.6],[-94.9,245.8],[-100.3,247.3],[-101.7,241.9],[-104.8,242.6],[-106.4,236.1],[-109.8,236.9],[-110.8,237.2],[-114.8,238.2],[-114.3,240.3],[-113.3,244.6],[-117.0,245.2],[-116.3,250.2],[-121.3,250.8],[-119.7,261.0],[-122.2,263.9],[-143.6,266.1],[-203.4,266.8],[-203.4,276.8],[-205.8,277.5],[-208.1,278.9],[-209.7,281.0],[-210.4,283.9],[-209.8,286.7],[-208.1,289.1],[-205.9,290.6],[-203.3,291.1],[-203.2,294.1],[-191.4,294.0],[-141.2,293.6],[-131.8,292.3]] as XY[]
const JET: XY[][] = [[[-207.0,-273.2],[-199.3,-304.9]],[[-154.4,-261.5],[-151.3,-303.6]],[[-124.6,-260.3],[-118.0,-295.4]],[[-86.0,-263.9],[-83.1,-276.7],[-65.6,-292.6]],[[-36.0,-264.0],[-37.5,-266.1],[-40.5,-270.4],[-40.5,-270.5]],[[-15.0,-260.6],[15.4,-276.2]],[[39.0,-225.2],[63.8,-245.0]],[[55.5,-209.8],[59.7,-215.5],[77.4,-210.8]],[[59.5,-157.1],[67.0,-173.0],[97.7,-195.2]],[[76.4,-134.9],[85.2,-141.0],[112.8,-160.3]],[[90.9,-110.8],[115.8,-130.0]],[[113.1,-53.7],[146.2,-78.1]],[[118.8,-27.2],[157.6,-34.2]],[[122.0,1.0],[155.2,2.1]],[[122.5,29.7],[139.4,39.4],[148.4,44.5]],[[111.9,91.4],[149.8,94.7]],[[104.7,115.1],[138.2,133.6]],[[91.0,145.5],[109.5,155.5],[121.2,170.7],[120.8,172.7]],[[78.8,167.6],[80.1,168.3],[78.5,171.2],[97.9,183.9],[110.7,199.6],[108.9,201.1]],[[88.6,197.5],[92.4,202.5],[88.0,206.4],[89.7,208.2],[85.7,233.6],[84.4,234.6]],[[58.5,231.6],[59.8,233.3],[50.6,264.7],[49.2,266.0]],[[33.1,254.4],[35.4,257.2],[22.3,268.9],[25.8,272.2],[24.1,292.1],[22.2,293.6]],[[7.6,273.5],[10.8,277.6],[-2.2,289.2],[-18.6,305.5]],[[-56.5,271.0],[-54.3,279.2],[-57.6,280.6],[-68.5,304.4],[-70.8,305.3]],[[-87.3,281.6],[-86.5,293.3],[-102.7,308.7],[-104.9,308.5]],[[-141.2,293.6],[-134.9,299.9],[-157.5,318.7]],[[-191.4,294.0],[-194.9,344.8],[-197.3,346.7]]]

export const ANCHOR: [number, number] = [-97.036787, 32.9045271]
export const SPEC: TerminalSpec = {
  id: 'dal-dfw-terminal-a', name: 'DFW Airport Terminal A', height: 26,
  ring: RING_25475188, centre: [-41, -3], ground: 1.6,
  thRange: [-128, 128], holes: [[56, 86], [-89, -58]],
  zones: [{ th: [-130, -58], h: 10.3 }, { th: [-58, 30], h: 11 }, { th: [30, 130], h: 11 }],
  bands: [
    { th: [88, 106], d: [9, 27], h: 15 },
    { th: [24, 55], d: [18, 50], h: 15 },
    { th: [-57, 55], d: [6, 11.5], h: 14 },
    { th: [-57, 24], d: [18, 30], h: 14.5 },
    { th: [-45, 12], d: [30, 45], h: 16, face: 'wall' },
    { th: [-22, -5], d: [32, 46], h: 18.5, face: 'wall', glaze: true },
    { th: [-88, -58], d: [20, 45], h: 14 },
    { th: [-104, -90], d: [15, 42], h: 14 },
  ],
  stations: [
    { th: [58, 85], d: [-21, -1], hEdge: 17, hCrown: 24.5, core: 2 },
    { th: [-87, -60], d: [-21, -1], hEdge: 17, hCrown: 24.5, core: 2 },
  ],
  jets: JET,
  plant: [{ th: [-100, 100], d: [30, 40], h: 11 }],
}


if (import.meta.main) {
  await writeTerminal(SPEC)
}
