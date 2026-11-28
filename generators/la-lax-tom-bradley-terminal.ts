/**
 * Los Angeles International Airport (LAX): the Tom Bradley International
 * Terminal — the 1984 landside block and the 2013 Great Hall and north and
 * south concourses by Fentress Architects, with their wave roofs —
 * procedural, CC0-1.0, no textures.
 *
 *   bun generators/la-lax-tom-bradley-terminal.ts
 *
 * Writes models/la-lax-tom-bradley-terminal.glb (low) and .detail.glb
 * (finer roof curves, mullion groups, roof seams, every jet-bridge leg with
 * its rotunda and cab). Also the LAX kit (colours, smooth roof surfaces,
 * stepped end faces, pods, jet bridges, writer) that the other LAX
 * terminal generators import; importing this file builds nothing.
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 353 (the
 * airport grid: the concourse runs 353/173). Anchor = centroid of the OSM
 * outline way/413226032 (-118.4099031, 33.9430998).
 *
 * y = 0 is the lowest ground under the footprint: the lower (arrivals)
 * road along the landside block, 29.6 m NAVD88; the apron the concourses
 * stand on is 7.8 m higher (lidar ground and Mapterhorn agree), so their
 * walls run down to y = 0 and sink into the apron, as STYLE.md says.
 * Every height below is lidar above that datum.
 *
 * Identity (photos): two long concourses and the Great Hall between them
 * under a run of curved metal "waves" — each roof bay rises in a convex
 * curve from a low eave on the airside (west) to a crest near the east
 * side, and each bay climbs from its south end to its north end, where it
 * stands up over the next bay in a glazed step; the hall's three bays are
 * the same form much bigger. Glazed airside walls with gate pods and jet
 * bridges; the pale 1984 landside block behind with its grid of roof
 * lanterns, and the departures canopy along the curb.
 *
 * Evidence
 * - OSM: way/413226032 (Tom Bradley International Terminal, height 38.1,
 *   4 levels: one outline for hall, concourses, pods, west wing, the
 *   landside block, the north pier and the curb canopy); 36
 *   aeroway=jet_bridge ways along it (drawn, not replaced).
 * - Lidar: USGS 3DEP CA_LosAngeles_1_B23 (2023 work unit; the 2013 roofs
 *   are in it), 1 m grid, read in this frame: concourse bays every 38-40 m
 *   (the southernmost 61 m, the last before the hall 20 m), seams at y =
 *   -339, -301, -263, -225, -185, -147, -108, -70 and 140, 179, 218, 256;
 *   each bay's crest (x = -40) 28.1 m at its south end, 33.5-34.0 at its
 *   north end; the airside eave (x = -72) 19.0 throughout; the east band
 *   (x -39..-26) 6.5-7.6 m under the crest; the hall's bays y -50..18,
 *   18..68, 68..118, crest (x = -24) 38.1-40.8 rising to 48.3-48.8, west
 *   eave 22; the west wing a shallow vault (eaves 18 and 24, crest 29.6);
 *   the landside block's roof 28.5 with nine 33.5 m lanterns; the north
 *   pier 18.3; the gate pods 25; the curb canopy 13-14.
 * - Photos (Wikimedia Commons, EVIDENCE):
 *   Tom_Bradley_International_Terminal_taken_from_departing_flight_March_2016.jpg,
 *     Agarre16, CC BY-SA 4.0 (from the south-west, above: the south
 *     concourse's waves, the hall, the pods, the landside block);
 *   Tom_Bradley_International_Terminal_(TBIT),_Los_Angeles_International_Airport_(LAX),_El_Segundo,_California_(USA)_(51719901131).jpg,
 *     (51720782040) and Tom_Bradley_International_Terminal_(TBIT),_..._(KLAX),_El_Segundo,_California_(USA)_(38983600244).jpg,
 *     Charles from Port Chester, New York, CC BY 2.0 (from the south, low:
 *     the hall's humps over the glazed airside wall);
 *   LAX_Tom_Bradley_Aerial.jpg, Junkyard kahrs, CC BY-SA 3.0 (from the
 *     north-west, above);
 *   Tom_Bradley_International_Terminal_photo_Don_Ramey_Logan.jpg, Don Ramey
 *     Logan, CC BY 4.0 (the west side from the airfield);
 *   LAX_Tom_Bradley_International_Terminal_(10940503103).jpg, Prayitno,
 *     CC BY 2.0 (the landside front at night, lit).
 *   USGS NAIP for the plan and the roof colours.
 * - Colours: roof warm pale sand metal (#d5bc97 in low sun, #e0d8d3 at
 *   noon; NAIP grey), the 1984 block's flat roof pale grey-beige, glass light grey-blue with white mullions, walls and
 *   landside block warm pale stone, jet bridges silver.
 *
 * Estimated: each bay's climb along the pier is drawn as a rounded hump
 *   (fast rise from the seam, crest at 80%, a 10% roll-over before the
 *   riser) between the lidar's seam and crest heights, which in the lidar
 *   climb almost linearly: drawn bolder so each shell reads at map size,
 *   as in the photos; the airside overhang, 6 m (7.2 m on the hall), from the
 *   photo from the west (the lidar's first return at the eave is the
 *   overhang's edge, so the wall is drawn on the OSM line); the curve of each roof section (a sine quarter fitted to the
 *   lidar section within 0.5 m); window band heights (photos); the
 *   lantern and canopy outlines (lidar rectangles, not drawings); jet
 *   bridge floor 12 m (apron + 4.2).
 * Left out: the roof's fine seams and the drainage gutters (detail model
 *   has the bay seams), the gate signage, the canopy's pylons.
 * Doubts: the north pier (to Terminal 3) and the landside block's east
 *   side are seen only from above; drawn plain. The west wing's walls are
 *   seen only far off. The West Gates (Midfield Satellite Concourse) stand
 *   600 m west across the taxiways and do not read as part of this
 *   complex; they are their own model, la-lax-west-gates.
 */
import { Part, writeGlb, type V3, type MaterialSpec } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { clean, clip, cap, walls, area, lathe, type XY } from './clt-terminal'

export type { XY }

// ---------------------------------------------------------------------------
// The LAX kit

export const LAX = {
  /** The wave roofs' warm pale greige metal. */
  roof: finish('lax-roof-metal', 0xd9cfbe),
  /** Walls, pods and the landside blocks: warm pale stone and panel. */
  wall: finish('lax-wall', 0xe8dfcf),
  /** Facade glass, light grey-blue by day, lit at night. */
  window: windowVariant(2, 0xa9bfd1),
  /** Flat roofs: pale grey membrane (NAIP #b3-#bf, pulled). */
  flat: finish('lax-roof-flat', 0xc3c7c9),
  /** White steel: mullions, fascias, canopies, lanterns. */
  trim: PALETTE.trim,
  /** Jet bridges: silver. */
  metal: finish('lax-jet-bridge', 0xc6cbcf, 0.6),
}

export type Parts = { roof: Part; wall: Part; win: Part; flat: Part; trim: Part; metal: Part }
export const newParts = (): Parts => ({ roof: new Part(), wall: new Part(), win: new Part(), flat: new Part(), trim: new Part(), metal: new Part() })
export const materials = (P: Parts, m: Partial<Record<keyof Parts, MaterialSpec>> = {}): Array<{ part: Part; material: MaterialSpec }> => [
  { part: P.roof, material: m.roof ?? LAX.roof },
  { part: P.wall, material: m.wall ?? LAX.wall },
  { part: P.win, material: m.win ?? LAX.window },
  { part: P.flat, material: m.flat ?? LAX.flat },
  { part: P.trim, material: m.trim ?? LAX.trim },
  { part: P.metal, material: m.metal ?? LAX.metal },
]

const nz = (v: V3): V3 => { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l] }
export const len2 = (a: XY, b: XY) => Math.hypot(b[0] - a[0], b[1] - a[1])

/**
 * A smooth surface F(u, v), u and v in [0, 1], on an nu x nv grid, with
 * normals from the grid's own differences, facing up (or `up` = false:
 * down). Vertical-ish strips keep the side the caller's winding gives.
 */
export function surface(p: Part, F: (u: number, v: number) => V3, nu: number, nv: number, up = true) {
  const G: V3[][] = []
  for (let j = 0; j <= nv; j++) { G.push([]); for (let i = 0; i <= nu; i++) G[j].push(F(i / nu, j / nv)) }
  const N = (i: number, j: number): V3 => {
    const a = G[j][Math.min(nu, i + 1)], b = G[j][Math.max(0, i - 1)], c = G[Math.min(nv, j + 1)][i], d = G[Math.max(0, j - 1)][i]
    const du: V3 = [a[0] - b[0], a[1] - b[1], a[2] - b[2]], dv: V3 = [c[0] - d[0], c[1] - d[1], c[2] - d[2]]
    let n = nz([du[1] * dv[2] - du[2] * dv[1], du[2] * dv[0] - du[0] * dv[2], du[0] * dv[1] - du[1] * dv[0]])
    if ((n[2] < 0) === up) n = [-n[0], -n[1], -n[2]]
    return n
  }
  for (let j = 0; j < nv; j++) for (let i = 0; i < nu; i++) {
    const a = G[j][i], b = G[j][i + 1], c = G[j + 1][i + 1], d = G[j + 1][i]
    p.tri(a, b, c, undefined, undefined, undefined, [N(i, j), N(i + 1, j), N(i + 1, j + 1)])
    p.tri(a, c, d, undefined, undefined, undefined, [N(i, j), N(i + 1, j + 1), N(i, j + 1)])
  }
}

/**
 * A vertical face along the line y = y0 (normal +y if `north`, else -y),
 * between bottom(x) and top(x) sampled at xs; skips where top <= bottom.
 */
export function endFace(p: Part, y0: number, xs: number[], top: (x: number) => number, bottom: (x: number) => number, north: boolean) {
  for (let i = 0; i < xs.length - 1; i++) {
    const xa = xs[i], xb = xs[i + 1]
    const ta = top(xa), tb = top(xb), ba = bottom(xa), bb = bottom(xb)
    if (ta - ba < 0.05 && tb - bb < 0.05) continue
    const A: V3 = [xa, y0, ba], B: V3 = [xb, y0, bb], C: V3 = [xb, y0, Math.max(tb, bb)], D: V3 = [xa, y0, Math.max(ta, ba)]
    if (north) p.quad(B, A, D, C); else p.quad(A, B, C, D)
  }
}

/** A box with flat top: walls to `wall`, top to `top`. */
export function box(wall: Part, top: Part | null, ring0: XY[], z0: number, z1: number) {
  const r = clean(ring0, 0.2)
  if (r.length < 3) return r
  walls(wall, r, z0, z1)
  if (top) cap(top, r, z1)
  return r
}

/**
 * Window panels along a->b (outside to the right, as on a counter-clockwise
 * ring), set `out` proud: bays of glass `bay` wide with `gap` piers.
 */
export function panelRow(p: Part, a: XY, b: XY, z0: number, z1: number, o: { bay?: number; gap?: number; end?: number; out?: number } = {}) {
  const bay = o.bay ?? 10, gap = o.gap ?? 1.4, end = o.end ?? 1.2, out = o.out ?? 0.06
  const L = len2(a, b)
  if (L < 2 * end + 2 || z1 <= z0) return
  const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], nn: XY = [u[1], -u[0]]
  const usable = L - 2 * end, k = Math.max(1, Math.round((usable + gap) / (bay + gap))), w = (usable - (k - 1) * gap) / k
  for (let q = 0; q < k; q++) {
    const s0 = end + q * (w + gap), s1 = s0 + w
    const P = (s: number, z: number): V3 => [a[0] + u[0] * s + nn[0] * out, a[1] + u[1] * s + nn[1] * out, z]
    p.quad(P(s0, z0), P(s1, z0), P(s1, z1), P(s0, z1))
  }
}

/** Thin vertical bars along a->b every `step` (detail model's mullions). */
export function mullions(p: Part, a: XY, b: XY, z0: number, z1: number, step = 3, w = 0.16, out = 0.12) {
  const L = len2(a, b); if (L < step) return
  const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], nn: XY = [u[1], -u[0]]
  const n = Math.max(1, Math.round(L / step))
  for (let i = 1; i < n; i++) {
    const s = (L * i) / n
    const P = (ds: number, z: number): V3 => [a[0] + u[0] * (s + ds) + nn[0] * out, a[1] + u[1] * (s + ds) + nn[1] * out, z]
    p.quad(P(-w / 2, z0), P(w / 2, z0), P(w / 2, z1), P(-w / 2, z1))
  }
}

/** A horizontal band along a->b, `out` proud. */
export function bandRow(p: Part, a: XY, b: XY, z0: number, z1: number, out = 0.08) {
  const L = len2(a, b); if (L < 1e-6) return
  const nn: XY = [(b[1] - a[1]) / L, -(b[0] - a[0]) / L]
  const A: XY = [a[0] + nn[0] * out, a[1] + nn[1] * out], B: XY = [b[0] + nn[0] * out, b[1] + nn[1] * out]
  p.quad([A[0], A[1], z0], [B[0], B[1], z0], [B[0], B[1], z1], [A[0], A[1], z1])
}

/**
 * The parts of a counter-clockwise ring on one side of a line (`keep`
 * true), each closed along the line: e.g. the gate pods west of a
 * concourse wall. Pieces smaller than `minArea` are dropped.
 */
export function runs(ring: XY[], keep: (p: XY) => boolean, cut: (a: XY, b: XY) => XY, minArea = 8): XY[][] {
  const n = ring.length, out: XY[][] = []
  let start = ring.findIndex((p) => !keep(p))
  if (start < 0) return [ring.slice()]
  let cur: XY[] | null = null
  for (let k = 0; k < n; k++) {
    const i = (start + k) % n, j = (i + 1) % n, a = ring[i], b = ring[j]
    if (keep(a) && cur) cur.push(a)
    if (keep(a) !== keep(b)) {
      const c = cut(a, b)
      if (!keep(a)) cur = [c]
      else if (cur) { cur.push(c); if (Math.abs(area(cur)) >= minArea) out.push(cur); cur = null }
    }
  }
  return out
}
/** Where a->b crosses x = x0 (or y = y0 with `onY`). */
export const cross = (x0: number, onY = false) => (a: XY, b: XY): XY => {
  const k = onY ? 1 : 0, t = (x0 - a[k]) / (b[k] - a[k])
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
}

/** The part of `ring` inside the axis-aligned box. */
export function clipBox(ring: XY[], x0: number, y0: number, x1: number, y1: number): XY[] {
  let r = clip(ring, -1, 0, -x0); r = clip(r, 1, 0, x1); r = clip(r, 0, -1, -y0); r = clip(r, 0, 1, y1)
  return r
}

/**
 * Jet bridges along OSM aeroway=jet_bridge lines (building end first),
 * floor at z. Low: one box per bridge, building to aircraft. Detail: each
 * leg, round rotundas at the bends on posts, the cab at the end.
 */
export function jetBridges(p: Part, lines: XY[][], z: number, detail: boolean, W = 3.4, H = 3.6) {
  const leg = (a: XY, b: XY, w: number, h: number, zz: number) => {
    const L = len2(a, b); if (L < 0.8) return
    const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [-u[1] * w / 2, u[0] * w / 2]
    let r: XY[] = [[a[0] - n[0], a[1] - n[1]], [b[0] - n[0], b[1] - n[1]], [b[0] + n[0], b[1] + n[1]], [a[0] + n[0], a[1] + n[1]]]
    if (area(r) < 0) r = r.reverse()
    walls(p, r, zz, zz + h); cap(p, r, zz + h); if (detail) cap(p, r, zz, false)
  }
  for (const l of lines) {
    const L = l.slice(1).reduce((s, q, i) => s + len2(l[i], q), 0)
    if (L > 50 || L < 4) continue
    if (!detail) { leg(l[0], l.at(-1)!, W, H, z); continue }
    for (let i = 0; i < l.length - 1; i++) leg(l[i], l[i + 1], W, H, z)
    for (let i = 1; i < l.length - 1; i++) lathe(p, l[i][0], l[i][1], [[0.01, z - 0.2], [2.6, z - 0.2], [2.6, z + H + 0.2], [0.01, z + H + 0.2]], 10)
    const a = l.at(-2)!, b = l.at(-1)!, Lb = len2(a, b), u: XY = [(b[0] - a[0]) / Lb, (b[1] - a[1]) / Lb]
    leg([b[0] - u[0] * 2.5, b[1] - u[1] * 2.5], [b[0] + u[0] * 0.4, b[1] + u[1] * 0.4], 4.4, H + 0.4, z - 0.2)
    const c: XY = [b[0] - u[0] * 4, b[1] - u[1] * 4]
    walls(p, [[c[0] - 0.5, c[1] - 0.5], [c[0] + 0.5, c[1] - 0.5], [c[0] + 0.5, c[1] + 0.5], [c[0] - 0.5, c[1] + 0.5]], 7.8, z)
  }
}

/** Jet-bridge lines turned to start at the building: the end nearer any of the rings' edges first. */
export function orient(lines: XY[][], rings: XY[][]): XY[][] {
  const dist = (p: XY) => {
    let d = Infinity
    for (const r of rings) for (let i = 0; i < r.length; i++) {
      const a = r[i], b = r[(i + 1) % r.length], L2 = (b[0] - a[0]) ** 2 + (b[1] - a[1]) ** 2 || 1
      const t = Math.max(0, Math.min(1, ((p[0] - a[0]) * (b[0] - a[0]) + (p[1] - a[1]) * (b[1] - a[1])) / L2))
      d = Math.min(d, Math.hypot(p[0] - a[0] - t * (b[0] - a[0]), p[1] - a[1] - t * (b[1] - a[1])))
    }
    return d
  }
  return lines.map((l) => (dist(l.at(-1)!) < dist(l[0]) ? l.slice().reverse() : l))
}

/** Write a GLB under a triangle and byte budget. */
export async function writeModel(file: string, name: string, parts: Array<{ part: Part; material: MaterialSpec }>, o: { bearing: number; height: number; maxTris: number; maxBytes: number }) {
  const used = parts.filter(({ part }) => part.triangles > 0)
  const triangles = used.reduce((t, { part }) => t + part.triangles, 0)
  const glb = writeGlb(name, used, { license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor', bearing: o.bearing, elevation: 0, height: o.height })
  console.log(`${file}: ${triangles} triangles, ${glb.length} bytes, ${used.length} materials`)
  if (triangles > o.maxTris) throw new Error(`${file}: triangle budget exceeded: ${triangles}`)
  if (glb.length > o.maxBytes) throw new Error(`${file}: size budget exceeded: ${glb.length} bytes`)
  await Bun.write(new URL(`../models/${file}`, import.meta.url).pathname, glb)
}

/** A lidar-traced raised block: a rectangle [x0, y0, x1, y1] in the model frame from z0 to z1. */
export type Block = { z0: number; z1: number; r: [number, number, number, number] }

/**
 * A flat-roofed terminal or pier from its OSM outline: the outline to its
 * base height, then the lidar's raised blocks stacked on it (each clipped
 * to the outline), glazed bands on every long wall: the gate level over
 * the apron and clerestories on the raised blocks. `glazeFrom` is the
 * floor the glazing starts at (the apron).
 */
export function terraces(P: Parts, outline: XY[], base: number, blocks: Block[], o: { detail: boolean; glazeFrom: number; bay?: number; tall?: (a: XY, b: XY) => boolean; minBlock?: number }) {
  const r = box(P.wall, P.flat, outline, 0, base)
  const bay = (o.bay ?? 10) * (o.detail ? 0.6 : 1.4)
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    if (len2(a, b) < (o.detail ? 7 : 12)) continue
    const top = o.tall?.(a, b) ? base - 1.2 : Math.min(base - 1.2, o.glazeFrom + 6.5)
    panelRow(P.win, a, b, o.glazeFrom + 1.0, top, { bay, gap: 1.2, end: 0.8 })
    if (o.detail) { mullions(P.trim, a, b, o.glazeFrom + 1.0, top, 2.4, 0.14, 0.1); bandRow(P.trim, a, b, base - 0.7, base, 0.08) }
  }
  for (const k of blocks) {
    const q = clean(clipBox(r, k.r[0], k.r[1], k.r[2], k.r[3]), 0.2)
    if (q.length < 3 || Math.abs(area(q)) < (o.minBlock ?? (o.detail ? 60 : 250))) continue
    const qq = box(P.wall, P.flat, q, k.z0, k.z1)
    if (k.z1 - k.z0 < 3) continue
    for (let i = 0; i < qq.length; i++) {
      const a = qq[i], b = qq[(i + 1) % qq.length]
      if (len2(a, b) < (o.detail ? 9 : 16)) continue
      panelRow(P.win, a, b, k.z0 + 0.9, k.z1 - 0.9, { bay: bay * 1.2, gap: 1.4, end: 1.0 })
    }
  }
  return r
}

/** A wave-roof bay: a profile across x (null outside), climbing from t = 0 (south end) to 1 (north end). */
export type Bay = { y0: number; y1: number; xs: (y: number) => number[]; z: (x: number, t: number, y: number) => number | null }

/**
 * The stepped faces between consecutive bays (and the free ends), glazed:
 * at each seam the higher roof stands over the lower one.
 */
export function seams(p: Part, bays: Bay[], ends = true) {
  for (let k = 0; k <= bays.length; k++) {
    const A = bays[k - 1], B = bays[k]
    const y = A ? A.y1 : B.y0
    const zA = (x: number) => (A ? A.z(x, 1, y) : null), zB = (x: number) => (B ? B.z(x, 0, y) : null)
    const xs = [...new Set([...(A ? A.xs(y) : []), ...(B ? B.xs(y) : [])])].sort((a, b) => a - b)
    if (!ends && (!A || !B)) continue
    // A over B faces north; B over A faces south
    endFace(p, y, xs, (x) => zA(x) ?? 0, (x) => zB(x) ?? 0, true)
    endFace(p, y, xs, (x) => zB(x) ?? 0, (x) => zA(x) ?? 0, false)
  }
}

// ---------------------------------------------------------------------------
// Tom Bradley International Terminal

export const ANCHOR = { lng: -118.4099031, lat: 33.9430998 }
export const BEARING = 353

/** OSM way/413226032 in this frame. */
export const TBIT_RING: XY[] = [[168.7, 153.5], [170.5, 152.1], [166.9, 146.4], [163.6, 140.8], [161.1, 136.1], [159.6, 131.3], [158.3, 125.9], [157.5, 115.9], [157.4, 82.3], [157.6, 35.2], [157.6, 26.2], [159.6, -49.6], [159.7, -56.2], [160.7, -63.3], [161.8, -68.1], [163.6, -73.4], [166.5, -79.6], [169.2, -84.3], [172.0, -87.9], [177.4, -93.7], [180.8, -96.6], [186.3, -100.0], [190.9, -102.2], [194.9, -103.5], [200.5, -111.7], [193.6, -110.7], [188.7, -109.7], [184.8, -108.3], [180.1, -105.8], [175.7, -102.5], [175.2, -101.2], [173.8, -99.0], [171.5, -96.5], [168.2, -93.0], [165.1, -89.7], [162.8, -87.2], [160.8, -85.0], [158.6, -80.8], [156.3, -75.7], [154.5, -71.0], [152.3, -60.1], [151.5, -52.7], [151.3, -48.7], [130.3, -48.5], [119.1, -48.8], [107.1, -48.5], [103.2, -49.1], [68.2, -49.2], [39.4, -49.3], [39.1, -64.8], [43.5, -64.9], [43.5, -61.9], [65.3, -62.3], [65.5, -70.9], [62.2, -70.9], [29.4, -70.9], [29.4, -74.0], [23.3, -74.0], [23.4, -71.5], [26.2, -71.5], [26.2, -70.6], [19.8, -70.6], [19.8, -59.8], [15.8, -59.6], [-6.0, -59.7], [-6.0, -67.3], [-34.6, -67.0], [-34.6, -70.9], [-25.9, -70.9], [-27.7, -82.8], [-31.7, -109.0], [-25.9, -109.0], [-27.5, -119.3], [-30.7, -119.2], [-30.9, -121.2], [-7.9, -126.8], [-7.9, -130.4], [-7.9, -136.8], [-10.6, -136.2], [-10.5, -139.6], [-29.8, -134.7], [-31.7, -146.9], [-25.9, -146.9], [-31.5, -184.8], [-25.8, -184.8], [-27.4, -195.3], [-30.5, -195.1], [-30.8, -197.0], [-7.8, -202.8], [-7.6, -210.1], [-7.9, -212.7], [-10.6, -211.9], [-10.5, -215.6], [-29.7, -210.9], [-31.7, -224.1], [-25.9, -224.0], [-31.6, -262.1], [-25.8, -262.1], [-26.0, -264.0], [-26.6, -267.7], [-7.8, -272.4], [-7.8, -276.5], [-7.8, -282.4], [-10.3, -281.7], [-10.4, -285.3], [-28.7, -280.8], [-31.5, -300.0], [-25.8, -300.0], [-31.5, -338.1], [-25.9, -338.0], [-26.7, -343.7], [-7.9, -348.4], [-7.7, -352.2], [-7.8, -358.2], [-10.3, -357.6], [-10.5, -361.2], [-28.6, -356.7], [-31.6, -376.1], [-25.9, -375.9], [-33.4, -398.9], [-35.8, -399.7], [-35.9, -399.2], [-37.0, -399.3], [-36.9, -399.8], [-36.3, -399.7], [-36.3, -402.3], [-36.3, -410.0], [-36.3, -419.0], [-36.3, -426.7], [-46.0, -424.3], [-45.9, -422.1], [-49.5, -421.3], [-49.6, -399.7], [-70.3, -399.6], [-71.8, -359.8], [-69.2, -359.8], [-69.3, -357.7], [-70.5, -357.4], [-70.8, -358.1], [-72.9, -357.9], [-83.0, -355.0], [-94.4, -352.2], [-94.2, -342.3], [-91.7, -342.9], [-91.8, -339.4], [-72.3, -344.1], [-72.4, -338.0], [-71.2, -338.0], [-72.5, -300.0], [-71.2, -300.1], [-71.0, -274.8], [-74.8, -273.8], [-83.3, -271.6], [-94.4, -268.8], [-94.4, -258.9], [-91.7, -259.4], [-91.8, -255.9], [-71.2, -261.0], [-72.4, -224.1], [-71.1, -224.1], [-72.5, -184.8], [-68.2, -184.8], [-68.1, -182.8], [-75.2, -181.1], [-83.2, -179.1], [-94.4, -176.4], [-94.5, -166.3], [-91.7, -167.0], [-91.9, -163.4], [-71.7, -168.4], [-72.5, -146.8], [-71.2, -146.8], [-72.6, -109.0], [-68.4, -109.1], [-68.3, -107.2], [-74.5, -105.5], [-83.2, -103.3], [-94.5, -100.4], [-94.6, -90.4], [-92.0, -91.0], [-92.0, -87.5], [-72.1, -92.5], [-72.5, -71.0], [-71.3, -70.9], [-71.9, -53.9], [-77.1, -54.3], [-85.5, -14.6], [-81.9, -14.1], [-82.2, -12.2], [-90.2, -13.8], [-94.2, -14.5], [-95.1, -9.4], [-93.2, -9.3], [-94.3, -3.1], [-87.7, -1.7], [-89.0, 6.4], [-81.2, 9.5], [-84.6, 30.4], [-120.8, 24.5], [-152.9, 18.2], [-156.8, 29.8], [-165.0, 53.9], [-157.2, 55.2], [-89.0, 67.4], [-86.8, 56.4], [-77.2, 58.2], [-79.6, 71.8], [-85.1, 106.8], [-71.6, 109.1], [-72.7, 138.0], [-71.4, 138.0], [-71.2, 149.1], [-84.9, 152.8], [-94.5, 155.4], [-94.6, 165.3], [-92.1, 164.7], [-92.0, 168.2], [-72.3, 163.3], [-72.6, 177.3], [-71.3, 177.3], [-71.8, 202.6], [-75.0, 203.4], [-90.3, 207.4], [-94.7, 208.5], [-94.7, 218.6], [-91.8, 217.8], [-91.9, 221.4], [-71.4, 216.4], [-72.7, 253.2], [-71.5, 253.3], [-71.9, 278.4], [-75.2, 279.2], [-84.5, 281.6], [-93.8, 284.2], [-97.8, 285.3], [-98.3, 293.3], [-96.2, 297.6], [-92.0, 297.5], [-66.3, 291.1], [-34.1, 291.3], [-33.9, 301.6], [-32.4, 301.6], [-20.6, 301.7], [-8.5, 301.7], [-8.7, 344.9], [-8.7, 349.6], [-8.8, 370.2], [-6.4, 370.1], [5.9, 370.0], [10.2, 370.0], [10.2, 363.3], [11.2, 363.1], [18.3, 363.3], [18.4, 361.0], [18.4, 345.0], [16.4, 344.9], [16.4, 341.4], [16.4, 337.9], [18.1, 337.9], [18.5, 307.5], [2.2, 307.5], [2.3, 293.8], [-6.4, 293.8], [-7.5, 295.5], [-12.5, 295.5], [-12.5, 287.5], [-20.0, 287.5], [-20.0, 273.1], [-28.7, 273.1], [-31.8, 253.3], [-26.0, 253.3], [-27.5, 243.4], [-27.6, 242.8], [-30.8, 242.8], [-31.2, 240.9], [-8.0, 235.2], [-8.0, 231.7], [-8.1, 225.3], [-10.6, 226.0], [-10.7, 222.6], [-29.9, 227.3], [-31.7, 215.3], [-26.0, 215.3], [-31.7, 177.3], [-26.0, 177.3], [-27.5, 166.8], [-30.8, 166.9], [-31.1, 164.9], [-8.1, 159.2], [-7.8, 153.5], [-8.0, 149.3], [-10.6, 150.0], [-10.7, 146.4], [-29.9, 151.2], [-32.5, 134.0], [-34.9, 134.1], [-34.8, 133.5], [-23.8, 133.7], [-23.7, 122.2], [-16.8, 122.3], [-16.7, 118.7], [-12.9, 119.5], [-12.6, 118.6], [20.5, 118.7], [20.4, 110.7], [46.3, 110.7], [66.7, 110.7], [69.0, 110.7], [74.1, 110.6], [74.4, 132.8], [75.7, 132.8], [76.6, 146.5], [106.6, 148.9], [107.1, 134.5], [107.1, 125.2], [106.1, 111.2], [150.5, 110.5], [150.7, 121.3], [151.5, 127.2], [152.2, 131.0], [156.6, 140.8], [160.6, 149.0], [166.0, 155.5], [167.7, 154.2]]

const APRON = 7.8, Z_JB = 12.0
const XW = -72, XC = -39.5, XE = -26, EAVE = 19.0
/** South (t = 0) and north (t = 1) crest heights per concourse bay, from the lidar. */
const SOUTH: [number, number, number, number][] = [[-400, -339, 25.6, 33.6], [-339, -301, 28.1, 33.5], [-301, -263, 28.1, 34.0], [-263, -225, 28.1, 33.9], [-225, -185, 28.1, 33.6], [-185, -147, 28.1, 33.8], [-147, -108, 28.1, 33.7], [-108, -70, 28.2, 33.7], [-70, -50, 27.9, 31.1]]
const NORTH: [number, number, number, number][] = [[118, 140, 30.7, 33.9], [140, 179, 28.0, 33.9], [179, 218, 28.0, 33.4], [218, 256, 28.1, 33.7], [256, 294, 28.2, 33.6]]
const HALL: [number, number, number, number][] = [[-50, 18, 38.1, 48.3], [18, 68, 40.8, 48.7], [68, 118, 40.7, 48.8]]
const HALL_E = -6, HALL_C = -24, HALL_EAVE = 22
const hallW = (y: number) => (y < -14 ? -77 - ((y + 52) * 8) / 38 : -84)

/**
 * How a bay's crest climbs along the pier, south (t = 0) to north (1): a
 * rounded hump that rises fast from the seam, crests at 80% and rolls over
 * a little before the glazed riser, so each bay reads as its own shell.
 * The lidar crests (t = 0 and the maximum) are kept.
 */
export const hump = (t: number) => (t <= 0.8 ? Math.pow(Math.sin((Math.PI / 2) * (t / 0.8)), 0.75) : 1 - 0.1 * ((t - 0.8) / 0.2) ** 2)
const shell = (s: number) => Math.pow(Math.sin((Math.PI / 2) * Math.min(1, Math.max(0, s))), 0.9)
function concBay([y0, y1, lo, hi]: [number, number, number, number], nu: number): Bay {
  const xs = [...Array.from({ length: nu + 1 }, (_, i) => XW + ((XC - XW) * i) / nu), XC + 0.01, XE]
  return {
    y0, y1, xs: () => xs,
    z: (x, t) => {
      if (x < XW - 0.01 || x > XE + 0.01) return null
      const zc = lo + (hi - lo) * hump(t)
      return x <= XC ? EAVE + (zc - EAVE) * shell((x - XW) / (XC - XW)) : zc - 6.5 - (1.1 * (x - XC)) / (XE - XC)
    },
  }
}
function hallBay([y0, y1, lo, hi]: [number, number, number, number], nu: number): Bay {
  const prof = (x: number, t: number, y: number) => {
    const xw = hallW(y); if (x < xw - 0.01 || x > HALL_E + 0.01) return null
    const zc = lo + (hi - lo) * hump(t)
    return x <= HALL_C ? HALL_EAVE + (zc - HALL_EAVE) * Math.sin((Math.PI / 2) * (x - xw) / (HALL_C - xw)) : zc - 3.0 * ((x - HALL_C) / (HALL_E - HALL_C)) ** 2
  }
  return {
    y0, y1, z: prof,
    xs: (y) => { const xw = hallW(y); return [...Array.from({ length: nu + 1 }, (_, i) => xw + ((HALL_C - xw) * i) / nu), HALL_C + (HALL_E - HALL_C) / 2, HALL_E] },
  }
}

/** Airside overhang depth (photo from the west: about a sixth of the shell's span). */
const OH = 6.0
/**
 * A roof overhang west of the wall line x = xw(y), from y0 to y1: the top
 * dips 0.3 m per metre out from the eave z(t), a 0.5 m fascia, and the
 * soffit underneath in the flat-roof grey, facing down.
 */
function overhang(P: Parts, y0: number, y1: number, xw: (y: number) => number, ze: (t: number) => number, d: number, nv: number) {
  const at = (u: number, v: number): V3 => { const y = y0 + (y1 - y0) * v, x0 = xw(y); return [x0 - d * u, y, ze(v) - 0.3 * d * u] }
  surface(P.roof, (u, v) => at(1 - u, v), 1, nv)
  surface(P.flat, (u, v) => { const p = at(u, v); return [p[0], p[1], p[2] - 0.5] }, 1, nv, false)
  for (let j = 0; j < nv; j++) {
    const a = at(1, j / nv), b = at(1, (j + 1) / nv)
    P.roof.quad([a[0], a[1], a[2] - 0.5], [b[0], b[1], b[2] - 0.5], b, a)
  }
  for (const [v, north] of [[0, false], [1, true]] as [number, boolean][]) {
    const e = at(0, v), o = at(1, v)
    const q: V3[] = [[e[0], e[1], e[2] - 0.5], [o[0], o[1], o[2] - 0.5], o, e]
    if (north) P.roof.quad(q[0], q[3], q[2], q[1]); else P.roof.quad(q[0], q[1], q[2], q[3])
  }
}

/** Roof surface, airside and landside walls of one concourse bay, with the crest's east-facing clerestory. */
function concourseBay(P: Parts, b: Bay, lo: number, hi: number, detail: boolean) {
  const nu = detail ? 12 : 7, nv = detail ? 10 : 6
  const zc = (t: number) => lo + (hi - lo) * hump(t)
  surface(P.roof, (u, v) => { const x = XW + (XC - XW) * u, y = b.y0 + (b.y1 - b.y0) * v; return [x, y, b.z(x, v, y)!] }, nu, nv)
  // the airside overhang: the roof runs on past the glass wall, dipping, with a
  // shaded soffit under it (the deep sawtooth eaves seen from the airfield)
  overhang(P, b.y0, b.y1, () => XW, (t) => b.z(XW, t, 0)!, OH, nv)
  surface(P.roof, (u, v) => { const x = XC + 0.01 + (XE - XC - 0.01) * u, y = b.y0 + (b.y1 - b.y0) * v; return [x, y, b.z(x, v, y)!] }, 2, 1)
  // the clerestory between the crest and the lower east band, facing east
  const zt = (t: number) => zc(t), zb = (t: number) => zc(t) - 6.5
  const Y = (t: number) => b.y0 + (b.y1 - b.y0) * t
  for (let j = 0; j < nv; j++) { const t0 = j / nv, t1 = (j + 1) / nv; P.win.quad([XC, Y(t0), zb(t0)], [XC, Y(t1), zb(t1)], [XC, Y(t1), zt(t1)], [XC, Y(t0), zt(t0)]) }
  // airside (west) wall to the eave: glass over a pale base, the base below the apron hidden
  P.wall.quad([XW, b.y1, 0], [XW, b.y0, 0], [XW, b.y0, EAVE], [XW, b.y1, EAVE])
  panelRow(P.win, [XW, b.y1], [XW, b.y0], APRON + 1.2, EAVE - 0.9, { bay: detail ? 6 : 11, gap: 1.0, end: 0.8 })
  if (detail) mullions(P.trim, [XW, b.y1], [XW, b.y0], APRON + 1.2, EAVE - 0.9, 2.2, 0.14, 0.12)
  // landside (east) wall, its top following the east band
  const ze = (t: number) => zc(t) - 7.6
  for (let j = 0; j < nv; j++) { const t0 = j / nv, t1 = (j + 1) / nv; P.wall.quad([XE, Y(t0), 0], [XE, Y(t1), 0], [XE, Y(t1), ze(t1)], [XE, Y(t0), ze(t0)]) }
  panelRow(P.win, [XE, b.y0], [XE, b.y1], APRON + 1.2, Math.min(ze(0), ze(1)) - 1.0, { bay: detail ? 6 : 11, gap: 1.0, end: 0.8 })
  if (detail) mullions(P.trim, [XE, b.y0], [XE, b.y1], APRON + 1.2, Math.min(ze(0), ze(1)) - 1.0, 2.2, 0.14, 0.12)
  // the seam: a pale lip along the bay's high north edge (detail)
  // the seam: a pale lip along the bay's high north edge, where the roof
  // stands over the next bay (reads as the bright rim in the photos)
  const nl = detail ? 12 : 6, lip = detail ? 0.7 : 1.1
  for (let i = 0; i < nl; i++) {
    const xa = XW + ((XC - XW) * i) / nl, xb = XW + ((XC - XW) * (i + 1)) / nl
    const za = b.z(xa, 1, b.y1)!, zb2 = b.z(xb, 1, b.y1)!
    P.trim.quad([xa, b.y1 - lip, za + 0.06], [xb, b.y1 - lip, zb2 + 0.06], [xb, b.y1, zb2 + 0.06], [xa, b.y1, za + 0.06])
  }
}

function hallBayGeom(P: Parts, b: Bay, detail: boolean) {
  const nu = detail ? 16 : 9, nv = detail ? 12 : 7
  surface(P.roof, (u, v) => { const y = b.y0 + (b.y1 - b.y0) * v, xw = hallW(y), x = xw + (HALL_C - xw) * u; return [x, y, b.z(x, v, y)!] }, nu, nv)
  overhang(P, b.y0, b.y1, hallW, (t) => HALL_EAVE, OH * 1.2, nv)
  // the pale rim along each hall shell's high north edge, over the glazed riser
  for (let i = 0; i < nu + 2; i++) {
    const xw = hallW(b.y1), xa = xw + ((HALL_E - xw) * i) / (nu + 2), xb = xw + ((HALL_E - xw) * (i + 1)) / (nu + 2), w = detail ? 0.9 : 1.6
    const za = b.z(xa, 1, b.y1)! + 0.08, zb = b.z(xb, 1, b.y1)! + 0.08
    P.trim.quad([xa, b.y1 - w, za], [xb, b.y1 - w, zb], [xb, b.y1, zb], [xa, b.y1, za])
  }
  surface(P.roof, (u, v) => { const y = b.y0 + (b.y1 - b.y0) * v, x = HALL_C + (HALL_E - HALL_C) * u; return [x, y, b.z(x, v, y)!] }, detail ? 4 : 2, nv)
  // the airside wall under the west eave: tall glass
  const a: XY = [hallW(b.y1), b.y1], c: XY = [hallW(b.y0), b.y0]
  const ys = b.y0 < -14 && b.y1 > -14 ? [b.y1, -14, b.y0] : [b.y1, b.y0]
  for (let i = 0; i < ys.length - 1; i++) {
    const p: XY = [hallW(ys[i]), ys[i]], q: XY = [hallW(ys[i + 1]), ys[i + 1]]
    P.wall.quad([p[0], p[1], 0], [q[0], q[1], 0], [q[0], q[1], HALL_EAVE], [p[0], p[1], HALL_EAVE])
    panelRow(P.win, p, q, APRON + 1.2, HALL_EAVE - 1.0, { bay: detail ? 6 : 12, gap: 1.0, end: 0.8 })
    if (detail) mullions(P.trim, p, q, APRON + 1.2, HALL_EAVE - 1.0, 2.4, 0.16, 0.12)
  }
  void a; void c
  // the east wall, behind the landside block's roof
  const zE = (t: number) => b.z(HALL_E, t, b.y0)!
  for (let j = 0; j < nv; j++) { const t0 = j / nv, t1 = (j + 1) / nv, ya = b.y0 + (b.y1 - b.y0) * t0, yb = b.y0 + (b.y1 - b.y0) * t1; P.wall.quad([HALL_E, ya, 0], [HALL_E, yb, 0], [HALL_E, yb, zE(t1)], [HALL_E, ya, zE(t0)]) }
}

/** The west wing: a shallow vault over its wedge outline (lidar), glazed walls. */
function westWing(P: Parts, detail: boolean) {
  // corners: east-south, west-south, west-north, east-north (OSM)
  const ES: XY = [-84.6, 30.4], WS: XY = [-154.5, 18.2], WN: XY = [-163.5, 54.2], EN: XY = [-89.0, 67.4]
  const at = (u: number, v: number): XY => {
    const s: XY = [ES[0] + (WS[0] - ES[0]) * u, ES[1] + (WS[1] - ES[1]) * u], n: XY = [EN[0] + (WN[0] - EN[0]) * u, EN[1] + (WN[1] - EN[1]) * u]
    return [s[0] + (n[0] - s[0]) * v, s[1] + (n[1] - s[1]) * v]
  }
  // u = 0 east (eave 24), crest 29.6 at u 0.42, west eave 18; +1.6 m to the north
  const zf = (u: number, v: number) => (u < 0.42 ? 24 + 5.6 * Math.sin((Math.PI / 2) * (u / 0.42)) : 18 + 11.6 * Math.sin((Math.PI / 2) * ((1 - u) / 0.58))) - 1.6 + 1.6 * v
  const nu = detail ? 12 : 6
  surface(P.roof, (u, v) => { const p = at(u, v); return [p[0], p[1], zf(u, v)] }, nu, 1)
  // walls: south, west, north edges (east edge is inside the hall)
  const edge = (f: (s: number) => [number, number], n: number, glaze: boolean) => {
    for (let i = 0; i < n; i++) {
      const [ua, va] = f(i / n), [ub, vb] = f((i + 1) / n), A = at(ua, va), B = at(ub, vb)
      const za = zf(ua, va), zb = zf(ub, vb)
      P.wall.quad([A[0], A[1], 0], [B[0], B[1], 0], [B[0], B[1], zb], [A[0], A[1], za])
      if (glaze) panelRow(P.win, A, B, APRON + 1.2, Math.min(za, zb) - 1.2, { bay: 9, gap: 1.0, end: 0.6 })
    }
  }
  edge((s) => [1 - s, 0], nu, true) // south: west -> east
  edge((s) => [1, 1 - s], 1, true) // west: north -> south
  edge((s) => [s, 1], nu, true) // north: east -> west
}

export function build(detail: boolean) {
  const P = newParts()
  const nu = detail ? 12 : 6
  // --- concourses
  const sBays = SOUTH.map((b) => concBay(b, nu)), nBays = NORTH.map((b) => concBay(b, nu)), hBays = HALL.map((b) => hallBay(b, detail ? 16 : 8))
  SOUTH.forEach((b, i) => concourseBay(P, sBays[i], b[2], b[3], detail))
  NORTH.forEach((b, i) => concourseBay(P, nBays[i], b[2], b[3], detail))
  HALL.forEach((_, i) => hallBayGeom(P, hBays[i], detail))
  // the seams and ends, south to north: concourse, hall, concourse
  seams(P.win, [...sBays, ...hBays, ...nBays])
  // --- the south tip and the north pier (flat roofs, lidar 24 and 18.3)
  box(P.wall, P.flat, [[-49.6, -399.7], [-49.5, -421.3], [-46.0, -422.1], [-46.0, -424.3], [-36.3, -426.7], [-36.3, -399.0]], 0, 24)
  const NPIER: XY[] = [[-26, 273.1], [-20, 273.1], [-20, 287.5], [-12.5, 287.5], [-12.5, 293.8], [2.3, 293.8], [2.2, 307.5], [18.5, 307.5], [18.4, 370.1], [-8.7, 370.2], [-8.6, 301.7], [-34, 301.6], [-34, 294], [-26, 294]]
  const np = box(P.wall, P.flat, NPIER, 0, 18.3)
  for (let i = 0; i < np.length; i++) { const a = np[i], b = np[(i + 1) % np.length]; if (len2(a, b) > 12) panelRow(P.win, a, b, APRON + 1.2, 16.8, { bay: detail ? 6 : 10, gap: 1.2, end: 1 }) }
  // --- gate pods west and east of the concourses (OSM), glass boxes
  const pods: XY[][] = []
  for (const [y0, y1] of [[-400, -55], [121, 272]] as [number, number][]) {
    const band = clipBox(TBIT_RING, -100, y0, -5, y1)
    pods.push(...runs(band, (p) => p[0] < XW - 1.5, cross(XW)), ...runs(band, (p) => p[0] > XE + 1.5, cross(XE)))
  }
  for (const pod of pods) {
    const r = box(P.wall, P.flat, pod, 0, 25)
    for (let i = 0; i < r.length; i++) {
      const a = r[i], b = r[(i + 1) % r.length]
      if (len2(a, b) < 4 || Math.abs(a[0] - XW) < 0.6 && Math.abs(b[0] - XW) < 0.6 || Math.abs(a[0] - XE) < 0.6 && Math.abs(b[0] - XE) < 0.6) continue
      panelRow(P.win, a, b, APRON + 1.2, 23.6, { bay: 8, gap: 1.0, end: 0.7 })
    }
  }
  westWing(P, detail)
  // --- the 1984 landside block: flat roof 28.5, nine lanterns, glazed curb front
  const main = clean(clipBox(TBIT_RING, HALL_E, -50, 151.5, 118.8), 0.3)
  const mr = box(P.wall, P.flat, main, 0, 28.5)
  for (let i = 0; i < mr.length; i++) {
    const a = mr[i], b = mr[(i + 1) % mr.length]
    if (len2(a, b) < 20 || Math.abs(a[0] - HALL_E) < 0.5 && Math.abs(b[0] - HALL_E) < 0.5) continue
    panelRow(P.win, a, b, 15.5, 26.5, { bay: detail ? 7 : 14, gap: 1.6, end: 2 })
    panelRow(P.win, a, b, 2.5, 10.5, { bay: detail ? 7 : 14, gap: 1.6, end: 2 })
    bandRow(P.trim, a, b, 27.6, 28.5, 0.1)
  }
  const LX = [[42, 62], [80, 96], [115, 131]], LY = [[-28, -10], [20, 40], [70, 90]]
  for (const [x0, x1] of LX) for (const [y0, y1] of LY) box(P.wall, P.trim, [[x0, y0], [x1, y0], [x1, y1], [x0, y1]], 28.5, 33.3)
  for (const [x0, x1] of [[65, 75], [100, 110]]) for (const [y0, y1] of [[0, 13], [50, 61]]) box(P.wall, P.trim, [[x0, y0], [x1, y0], [x1, y1], [x0, y1]], 28.5, 35)
  // the north extension toward Terminal 3 (24) and the south annex (14)
  box(P.wall, P.flat, [[74.2, 118.8], [107.1, 118.8], [107.1, 134.5], [106.6, 148.9], [76.6, 146.5], [75.7, 132.8], [74.4, 132.8]], 0, 24)
  const annex = clean(clipBox(TBIT_RING, -26, -76, 70, -50), 0.3)
  box(P.wall, P.flat, annex, 0, 14)
  box(P.wall, P.flat, [[-26, -71], [-6, -71], [-6, -50], [-26, -50]], 0, 14)
  // the curb canopy along the departures road: a slab on posts
  const front = clean(clipBox(TBIT_RING, 151.5, -120, 210, 160), 0.3)
  if (front.length >= 3) {
    walls(P.trim, front, 12.6, 13.8); cap(P.trim, front, 13.8); cap(P.trim, front, 12.6, false)
    for (let y = -40; y <= 110; y += detail ? 12 : 24) walls(P.trim, [[154.2, y - 0.4], [155, y - 0.4], [155, y + 0.4], [154.2, y + 0.4]], 0, 12.6)
  }
  // --- jet bridges
  jetBridges(P.metal, JET_BRIDGES, Z_JB, detail)
  // sand shells, pale grey-beige flat roofs (review: the photos' warm pale roofs)
  return materials(P, { roof: finish('lax-tbit-roof-sand', 0xdecbaa), flat: finish('lax-tbit-roof-flat', 0xded6c6) })
}

/** aeroway=jet_bridge ways along the terminal, building end first. */
export const JET_BRIDGES: XY[][] = [[[-97.1, -204.4], [-96.6, -201.5], [-85.6, -185.9], [-83.2, -179.1], [-82.6, -177.1]], [[-7.6, -210.1], [4.8, -199.9], [5.0, -199.7], [7.6, -197.6], [7.9, -194.8]], [[-96.6, -295.8], [-96.0, -292.5], [-86.5, -278.1], [-83.3, -271.6], [-83.1, -270.2]], [[-7.8, -276.5], [5.3, -267.7], [5.7, -264.9]], [[-7.7, -352.2], [5.9, -342.4], [6.6, -339.1]], [[-94.1, -380.1], [-93.0, -376.1], [-86.3, -362.2], [-83.0, -355.0], [-82.5, -353.6]], [[-11.0, -392.3], [-31.9, -409.6], [-36.3, -410.0]], [[-5.2, -185.7], [-6.2, -189.3], [-27.4, -195.3], [-38.7, -199.3]], [[-26.0, -264.0], [-7.1, -258.9], [-6.5, -255.6]], [[-9.3, -405.5], [-28.5, -419.1], [-36.3, -419.0]], [[-15.9, -384.0], [-36.3, -402.3]], [[-70.7, -354.4], [-72.9, -357.9], [-84.6, -384.8], [-85.6, -388.1]], [[-89.9, -352.7], [-100.9, -370.4], [-102.6, -373.2]], [[-73.6, -271.5], [-74.8, -273.8], [-87.6, -297.4], [-87.6, -299.5]], [[-94.4, -268.8], [-106.8, -286.2]], [[-73.7, -177.6], [-75.2, -181.1], [-88.8, -209.2], [-89.4, -212.9]], [[-94.4, -176.4], [-105.4, -194.7], [-106.3, -198.3]], [[-8.3, -329.8], [-9.3, -332.6], [-26.5, -340.3]], [[-98.6, 260.5], [-97.2, 264.7], [-86.9, 275.9], [-84.5, 281.6]], [[-8.0, 231.7], [4.4, 239.4], [5.8, 243.1]], [[-90.3, 207.4], [-105.9, 200.3], [-107.6, 197.4]], [[-7.8, 153.5], [9.4, 164.1], [10.5, 166.5]], [[-99.1, 129.1], [-98.1, 133.6], [-86.8, 146.4], [-84.9, 152.8]], [[-90.2, -13.8], [-98.3, -24.0], [-98.8, -28.3]], [[-98.1, -121.8], [-95.8, -116.9], [-84.9, -108.4], [-83.2, -103.3], [-82.8, -101.1]], [[-7.9, -130.4], [18.3, -123.7], [18.8, -120.9]], [[-70.0, -101.9], [-74.5, -105.5], [-90.1, -121.7], [-90.5, -126.1]], [[-94.5, -100.4], [-107.7, -111.7], [-109.3, -114.3]], [[-94.3, -3.1], [-104.6, -17.4], [-104.8, -20.4]], [[-93.7, 191.2], [-93.4, 194.0], [-75.0, 203.4], [-70.2, 205.6]], [[-70.4, 282.9], [-75.2, 279.2], [-88.2, 260.4]], [[-9.1, 253.0], [-12.4, 249.4], [-27.5, 243.4], [-41.8, 238.3]], [[-73.9, 153.7], [-87.3, 129.6], [-87.9, 126.0]], [[-88.4, -32.3], [-88.4, -28.0], [-80.6, -3.8]], [[-94.5, 155.4], [-105.9, 137.6]], [[-93.8, 284.2], [-107.0, 271.4], [-108.5, 268.2]]]

if (import.meta.main) {
  const o = { bearing: BEARING, height: 48.8 }
  await writeModel('la-lax-tom-bradley-terminal.glb', 'Tom Bradley International Terminal', build(false), { ...o, maxTris: 8000, maxBytes: 250_000 })
  await writeModel('la-lax-tom-bradley-terminal.detail.glb', 'Tom Bradley International Terminal', build(true), { ...o, maxTris: 40_000, maxBytes: 1536 * 1024 })
}
