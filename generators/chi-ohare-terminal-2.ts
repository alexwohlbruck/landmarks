/**
 * Chicago O'Hare International Airport (ORD): Terminal 2 (Building #4),
 * C. F. Murphy Associates, 1962, with Concourses E and F and the E/F link
 * and hub, the corner block toward Terminal 1, the bridge to the ATS
 * station and the departures-curb canopy — procedural, CC0-1.0, no textures.
 *
 *   bun generators/chi-ohare-terminal-2.ts
 *
 * Writes models/chi-ohare-terminal-2.glb (low) and .detail.glb (every jet
 * bridge leg with its rotundas and cab, glazing mullion groups, canopy
 * posts at full count). Also the small ORD kit the other O'Hare terminal
 * models of this batch import (`ORD` colours, `ordConcourse`, `raised`,
 * `canopy`, `lidarBlocks`); importing this file builds nothing.
 *
 * Map frame: x east, y north, z up, metres; bearing 0. Anchor = area
 * centroid of the five T2 outlines (way/163500141, way/163500105,
 * way/163500104, way/163500106, way/163500130).
 *
 * Identity (photos): a long, low, dark Miesian landside block (black steel
 * and dark glass) with a taller central hall whose clerestory rises over
 * the departures canopy; the white canopy over the upper curb; from the
 * airside, flat-roofed pale concourses on the apron with a ribbon of gate
 * windows, dark mechanical boxes on the roof, and a row of jet bridges.
 *
 * Evidence
 * - OSM (footprints used as mapped; no heights): way/163500141 (Terminal 2,
 *   Building #4), way/163500105 (Concourse E/F and the E/F link and hub),
 *   way/163500104 (Concourse E), way/163500106 (Concourse F),
 *   way/163500130 (the corner block toward Terminal 1), way/674743946
 *   (building=bridge to the ATS station, level 2), way/1429454967
 *   (building=roof: the departures-curb canopy, which runs on along
 *   Terminal 1's curb), way/1027319923 (the Concourse E/F ramp control
 *   tower, 20.9 m by lidar), way/675246908 and the small jet-bridge
 *   rotundas and stands under the bridge stubs; 40 aeroway=jet_bridge ways
 *   (drawn, not replaced).
 * - Lidar: USGS 3DEP USGS_LPC_IL_4County_Cook_2017_LAS_2019 (2017 flight;
 *   nothing at T2 has changed since), 1 m grid, heights above the apron and
 *   street (197.9 m; the map's terrain is flat within 1 m):
 *   landside block 13.4 m, its central hall 18.2 m (a strip 16 m wide,
 *   offset toward the curb: cross-sections at three points); concourses
 *   9.2 m; the raised roof boxes 13.2 m and the hub's 17.2 m block, each
 *   traced from the lidar as rectangles on the building's own axis; the
 *   corner block 12.3 m; the ATS bridge 14.6 m; the canopy 12.0 m over the
 *   upper road (5.0 m). Jet bridges' roofs about 7.6 m.
 * - Photos (Wikimedia Commons, EVIDENCE):
 *   Terminals_2_and_3,_Chicago_O'Hare_..._(54600736995.jpg, Warren LeMay,
 *     CC BY-SA 4.0 (2025): the landside fronts, dark, with the white
 *     canopy;
 *   Parked_at_the_gate_at_O'Hare_(2452160728).jpg, Shawn from Airdrie,
 *     CC BY-SA 2.0: Concourse E's airside wall and dark roof boxes;
 *   Chicago_O'Hare_concourses.jpg, Sahmeditor, public domain (2009): the
 *     concourses and landside blocks of T2/T3 from the tower;
 *   American_Airlines_Terminal_3_at_O'Hare_International_Airport.jpg, S340,
 *     public domain: the same dark ribbed landside wall seen from the
 *     apron (T3, the twin of T2);
 *   At_Chicago_2024_106.jpg, Mike Peel, CC BY-SA 4.0: from the north.
 *   USGS NAIP for the plan and the roof colours.
 * - Colours: concourse walls pale warm grey, roofs grey (NAIP), the
 *   landside block's black steel pulled to charcoal (#5b6068), glass a
 *   mid grey-blue, the canopy and fascias white, jet bridges pale silver.
 *
 * Estimated: window band heights (photos); jet bridge floor 3.8 m.
 * Doubts: Terminal 2 is to be replaced by the O'Hare Global Terminal
 * (2030); this is T2 as it stands and as OSM maps it. The E/F hub's
 * stepped roof is drawn from lidar rectangles, not a drawing. No close
 * photo of Concourse F's south end.
 */
import { Part, type V3, type MaterialSpec } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { box, panelRow, bandRow, mullions, jetBridges, writeModel, clean, clip, cap, walls, area, type XY } from './atl-hartsfield-jackson-domestic-terminal'

// ---------------------------------------------------------------------------
// The ORD kit, shared by chi-ohare-terminal-1, -3 and -5.

export const ORD = {
  /** Concourse walls: pale warm-grey panel and render. */
  wall: finish('ord-wall', 0xdcd8d0),
  /** Black steel of the 1962 terminals, pulled to charcoal. */
  dark: finish('ord-dark-panel', 0x5b6068),
  /** Facade glass, mid grey-blue by day, lit at night. */
  window: windowVariant(2, 0x8a9caa),
  roof: PALETTE.roof,
  /** White steel: canopies, fascias, vault ribs. */
  trim: PALETTE.trim,
  /** Glass vaults and skylights: stay dark at night. */
  glass: { ...PALETTE.glass, color: 0xb3cad8 },
}

/** `bridge` draws into the wall material: the jet bridges' pale silver is the walls' pale grey. */
export type Parts = { wall: Part; dark: Part; win: Part; roof: Part; trim: Part; glass: Part; bridge: Part }
export const newParts = (): Parts => { const wall = new Part(); return { wall, dark: new Part(), win: new Part(), roof: new Part(), trim: new Part(), glass: new Part(), bridge: wall } }

/** Lidar-traced raised roof: a rectangle (4 corners) and its height. */
export type Block = { h: number; rect: XY[] }

/** The part of `ring` inside the convex rectangle `rect` (any winding). */
export function clipToRect(ring: XY[], rect: XY[]): XY[] {
  const r = area(rect) < 0 ? rect.slice().reverse() : rect
  let out = ring
  for (let i = 0; i < 4 && out.length >= 3; i++) {
    const a = r[i], b = r[(i + 1) % 4]
    // keep the left of a->b (inside a counter-clockwise rect): n·p <= n·a with n = right normal
    const nx = b[1] - a[1], ny = -(b[0] - a[0])
    out = clip(out, nx, ny, nx * a[0] + ny * a[1])
  }
  return out
}

const len2 = (a: XY, b: XY) => Math.hypot(b[0] - a[0], b[1] - a[1])

/**
 * A flat-roofed body from its OSM outline, with a gate-level window band on
 * every long edge (pale piers between the panels) and a pale fascia.
 */
export function body(P: Parts, outline: XY[], h: number, o: { wall?: Part; band?: [number, number]; bay?: number; detail?: boolean; minEdge?: number; fascia?: boolean } = {}) {
  const r = clean(outline, o.detail ? 0.4 : 1.6)
  const wall = o.wall ?? P.wall
  box(wall, P.roof, r, 0, h, o.detail ? 0.45 : 0) // a 0.45 m bevel is below a pixel at the low model's zooms
  const [z0, z1] = o.band ?? [4.2, Math.min(h - 1.6, 7.6)]
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    const L = len2(a, b)
    if (L < (o.minEdge ?? (o.detail ? 7 : 12))) continue
    // low model: broader panels (fewer, still grouped bays); detail: the real rhythm
    panelRow(P.win, a, b, z0, z1, { bay: (o.bay ?? 10) * (o.detail ? 1 : 2.0), gap: 1.3, end: 1.0 })
    if (o.detail) mullions(P.trim, a, b, z0, z1, 2.5, 0.14, 0.1)
    if ((o.fascia ?? true) && (o.detail || L > 25)) bandRow(P.trim, a, b, h - 1.0, h - 0.45, 0.06)
  }
  return r
}

/**
 * A raised block (roof box, clerestory hall) where the outline lies inside
 * the lidar rectangle, from z0 to its height; dark panel walls, optional
 * clerestory glazing band `glaze` [z0, z1] on edges longer than 10 m.
 */
export function raised(P: Parts, outline: XY[], b: Block, z0: number, o: { glaze?: [number, number]; wall?: Part; detail?: boolean } = {}) {
  const r0 = clipToRect(clean(outline, o.detail ? 0.4 : 1.6), b.rect)
  if (r0.length < 3 || Math.abs(area(r0)) < 12) return
  const r = clean(r0, 0.3)
  box(o.wall ?? P.dark, P.roof, r, z0 - 0.2, b.h, o.detail ? 0.3 : 0)
  if (o.glaze) for (let i = 0; i < r.length; i++) {
    const a = r[i], c = r[(i + 1) % r.length]
    if (len2(a, c) < 10) continue
    panelRow(P.win, a, c, o.glaze[0], o.glaze[1], { bay: 8, gap: 1.0, end: 0.8 })
    if (o.detail) mullions(P.trim, a, c, o.glaze[0], o.glaze[1], 2.0, 0.12, 0.09)
  }
}

/**
 * A canopy: a white slab `t` thick with its top at z over the outline, on
 * round posts set 1.8 m in from its long edges every `step` metres.
 */
export function canopy(P: Parts, outline: XY[], z: number, o: { t?: number; step?: number; post?: number } = {}) {
  const r = clean(outline, 0.4), t = o.t ?? 1.0, step = o.step ?? 24, pr = o.post ?? 0.45
  walls(P.trim, r, z - t, z)
  cap(P.trim, r, z)
  cap(P.trim, r, z - t, false)
  const inside = (p: XY) => { let c = false; for (let i = 0, j = r.length - 1; i < r.length; j = i++) { const [xi, yi] = r[i], [xj, yj] = r[j]; if ((yi > p[1]) !== (yj > p[1]) && p[0] < (xj - xi) * (p[1] - yi) / (yj - yi) + xi) c = !c } return c }
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length], L = len2(a, b)
    if (L < 12) continue
    const n = Math.max(1, Math.round(L / step))
    const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], inn: XY = [-u[1], u[0]] // left = inside (ccw)
    for (let k = 0; k < n; k++) {
      const s = (L * (k + 0.5)) / n, c: XY = [a[0] + u[0] * s + inn[0] * 1.8, a[1] + u[1] * s + inn[1] * 1.8]
      if (!inside(c)) continue
      const ring: XY[] = Array.from({ length: 4 }, (_, q) => [c[0] + pr * Math.cos(((q + 0.5) / 4) * 2 * Math.PI), c[1] + pr * Math.sin(((q + 0.5) / 4) * 2 * Math.PI)] as XY)
      walls(P.trim, ring, 0, z - t)
    }
  }
}

/**
 * Jet bridges along OSM aeroway=jet_bridge lines, floor at z. Low model:
 * one pale box per bridge, building to aircraft (walls and roof only, its
 * post left out: it reads from the map as the box). Detail: the kit's legs,
 * rotundas, posts and cab.
 */
export function bridges(P: Parts, lines0: XY[][], z: number, detail: boolean) {
  // OSM traces a few apron walkways and bus-gate links as jet bridges; a real one is under ~45 m
  const lines = lines0.filter((l) => l.slice(1).reduce((s, p, i) => s + len2(l[i], p), 0) < 45)
  if (detail) return jetBridges(P.bridge, P.bridge, lines, z, true)
  for (const l of lines) {
    const a = l[0], b = l.at(-1)!, L = len2(a, b); if (L < 4) continue
    const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [-u[1] * 1.75, u[0] * 1.75]
    let r: XY[] = [[a[0] - n[0], a[1] - n[1]], [b[0] - n[0], b[1] - n[1]], [b[0] + n[0], b[1] + n[1]], [a[0] + n[0], a[1] + n[1]]]
    if (area(r) < 0) r = r.reverse()
    walls(P.bridge, r, z, z + 4); cap(P.bridge, r, z + 4)
  }
}

/**
 * A 1962 landside block: pale gate/curb level with broad glazing, under a
 * deep band of dark steel and dark glass up to the roof (photos from the
 * apron and the curb), roof at h.
 */
export function landside(P: Parts, outline: XY[], h: number, detail: boolean) {
  const r = clean(outline, detail ? 0.4 : 1.6)
  box(P.wall, P.roof, r, 0, h, detail ? 0.45 : 0)
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    if (len2(a, b) < 9) continue
    bandRow(P.dark, a, b, 8.0, h - 0.2, 0.08)
    panelRow(P.win, a, b, 9.0, h - 1.4, { bay: detail ? 8 : 16, gap: 1.0, end: 0.8, out: 0.14 })
    panelRow(P.win, a, b, 1.0, 6.6, { bay: detail ? 7 : 14, gap: 1.6, end: 1.2 })
    if (detail) { mullions(P.trim, a, b, 1.0, 6.6, 2.6, 0.14, 0.1); mullions(P.dark, a, b, 9.0, h - 1.4, 1.6, 0.12, 0.18) }
  }
  return r
}

/**
 * A ramp control tower standing on a concourse roof: a shaft to its cab,
 * a band of cab glass all round (lit at night), a flat roof slab overhanging
 * 0.6 m. `shaft` is the shaft's part (dark on the 1962 terminals, pale on T5).
 */
export function rampTower(P: Parts, outline: XY[], h: number, shaft: Part) {
  const r = clean(outline, 0.3)
  walls(shaft, r, 0, h - 3.6)
  walls(P.win, r, h - 3.6, h - 0.7)
  const o = r.map((p) => p) // the overhanging roof slab
  const c = r.reduce((a, p) => [a[0] + p[0] / r.length, a[1] + p[1] / r.length], [0, 0])
  const big = o.map((p) => { const dx = p[0] - c[0], dy = p[1] - c[1], l = Math.hypot(dx, dy) || 1; return [p[0] + dx / l * 0.6, p[1] + dy / l * 0.6] as XY })
  walls(P.dark, big, h - 0.7, h)
  cap(P.dark, big, h)
  cap(P.dark, big, h - 0.7, false)
}

export const materials = (P: Parts, glowWalls = false): Array<{ part: Part; material: MaterialSpec }> => [
  { part: P.wall, material: ORD.wall },
  { part: P.dark, material: ORD.dark },
  { part: P.win, material: ORD.window },
  { part: P.roof, material: ORD.roof },
  { part: P.trim, material: { ...ORD.trim, floodlight: glowWalls ? (q: V3, n: V3) => (n[2] < -0.5 ? 0.6 : 0) : undefined } },
  { part: P.glass, material: ORD.glass },
]

/**
 * A glazed barrel vault along a->b, `w` wide, springing at z0 from a short
 * upstand `up` and rising `rise` above it (an ellipse when rise != w/2),
 * glass skin, white end arches and gable glass; ribs every `rib` m in the
 * detail model.
 */
export function glassVault(P: Parts, a: XY, b: XY, w: number, z0: number, rise: number, o: { up?: number; seg?: number; rib?: number; detail?: boolean } = {}) {
  const L = len2(a, b), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]] // n = right of a->b
  const up = o.up ?? 0.6, seg = o.seg ?? (o.detail ? 14 : 8)
  const sec = Array.from({ length: seg + 1 }, (_, i) => { const t = Math.PI * (i / seg); return { v: (w / 2) * Math.cos(t), z: z0 + up + rise * Math.sin(t) } }) // v from +w/2 (right) to -w/2
  const at = (s: number, v: number, z: number): V3 => [a[0] + u[0] * s + n[0] * v, a[1] + u[1] * s + n[1] * v, z]
  // upstands (white), skin (glass)
  P.trim.quad(at(0, w / 2, z0), at(L, w / 2, z0), at(L, w / 2, z0 + up), at(0, w / 2, z0 + up))
  P.trim.quad(at(L, -w / 2, z0), at(0, -w / 2, z0), at(0, -w / 2, z0 + up), at(L, -w / 2, z0 + up))
  for (let i = 0; i < seg; i++) { const p = sec[i], q = sec[i + 1]; P.glass.quad(at(0, p.v, p.z), at(L, p.v, p.z), at(L, q.v, q.z), at(0, q.v, q.z)) }
  // gable ends: glass fans, white rims
  for (const [s, sgn] of [[0, -1], [L, 1]] as [number, number][]) {
    const c = at(s, 0, z0 + up)
    for (let i = 0; i < seg; i++) {
      const p = sec[i], q = sec[i + 1]
      if (sgn > 0) P.glass.tri(c, at(s, p.v, p.z), at(s, q.v, q.z)); else P.glass.tri(c, at(s, q.v, q.z), at(s, p.v, p.z))
    }
    const ws = sgn > 0 ? L - 0.5 : 0, we = ws + 0.5
    for (let i = 0; i < seg; i++) {
      const p = sec[i], q = sec[i + 1], k = 0.35
      P.trim.quad(at(ws, p.v, p.z + k), at(ws, q.v, q.z + k), at(we, q.v, q.z + k), at(we, p.v, p.z + k))
    }
    P.trim.quad(at(s, w / 2, z0), at(s, -w / 2, z0), at(s, -w / 2, z0 + up), at(s, w / 2, z0 + up))
  }
  if (o.detail) {
    const nr = Math.max(1, Math.round(L / (o.rib ?? 4)))
    for (let k = 1; k < nr; k++) {
      const s0 = (L * k) / nr - 0.12, s1 = s0 + 0.24
      for (let i = 0; i < seg; i++) { const p = sec[i], q = sec[i + 1], e = 0.12; P.trim.quad(at(s0, p.v, p.z + e), at(s0, q.v, q.z + e), at(s1, q.v, q.z + e), at(s1, p.v, p.z + e)) }
    }
  }
}

// ---------------------------------------------------------------------------
// Terminal 2

// OSM data for T2, local frame (turned to the bearing 0): x model east, y model north, metres from the anchor -87.9059232, 41.9756535
export const ANCHOR = { lng: -87.9059232, lat: 41.9756535 }
export const OSM: Record<string, XY[]> = {
  'way/163500141': [[76.9,123.4],[79.6,121.6],[82.3,119.8],[82.6,119.6],[84.4,118.4],[86.5,116.9],[86.9,116.6],[87.6,116.1],[88.7,115.4],[89.3,115.0],[92.2,113.1],[97.6,109.3],[103.5,105.2],[106.8,103.0],[111.1,99.9],[112.0,99.4],[112.7,98.8],[113.6,98.3],[114.4,97.7],[115.3,97.1],[120.0,93.8],[125.0,90.2],[126.0,89.6],[126.8,89.0],[127.7,88.4],[128.4,87.8],[129.2,87.3],[143.3,77.8],[145.5,76.3],[146.7,75.4],[150.0,73.1],[151.9,71.8],[154.2,70.2],[156.1,68.9],[176.8,54.7],[182.1,51.7],[171.7,35.9],[170.6,34.4],[169.7,33.0],[167.9,30.3],[164.8,25.9],[164.9,25.3],[163.3,23.1],[154.3,10.2],[152.6,11.5],[151.8,12.1],[133.6,24.8],[132.9,25.4],[132.0,26.0],[95.4,51.2],[76.5,64.3],[73.7,60.5],[71.2,56.9],[70.6,57.0],[67.1,56.4],[64.6,56.2],[53.3,63.4],[49.2,66.2],[45.7,68.6],[35.0,75.3],[34.6,78.8],[34.0,82.9],[36.1,86.2],[38.8,90.4],[20.4,102.8],[-36.7,142.4],[-37.6,143.0],[-38.4,143.5],[-39.0,143.9],[-30.2,156.0],[-28.6,158.5],[-26.4,161.6],[-24.0,164.9],[-10.2,184.4],[-2.7,179.0],[1.0,176.4],[6.0,172.9],[10.9,169.4],[15.9,165.9],[15.9,165.8],[20.4,162.6],[22.2,161.4],[26.2,158.6],[29.5,156.2],[45.4,145.3],[45.7,145.1],[46.4,144.6],[47.2,144.0],[48.1,143.3],[50.0,142.0],[53.8,139.3],[58.2,136.3],[59.3,135.5],[60.4,134.8],[61.1,134.3],[61.6,134.0],[62.0,133.7],[64.9,131.7]],
  'way/163500105': [[-108.3,-64.5],[-106.2,-59.2],[-104.8,-55.8],[-107.0,-50.2],[-95.7,-46.1],[-94.6,-45.7],[-93.1,-45.2],[-57.2,-31.6],[-56.0,-31.1],[-54.6,-30.7],[-21.6,-18.6],[-20.4,-16.7],[6.1,21.7],[29.2,55.3],[33.1,60.9],[38.1,57.0],[45.7,68.6],[49.2,66.2],[53.3,63.4],[45.9,52.2],[50.8,48.9],[43.1,37.8],[42.6,37.0],[42.0,36.1],[36.1,27.6],[33.6,29.1],[32.8,27.5],[30.0,29.5],[28.2,26.8],[36.0,21.7],[31.9,14.7],[34.1,12.9],[32.2,10.1],[30.8,10.8],[29.7,9.2],[26.5,10.8],[21.1,3.4],[13.8,-7.3],[10.7,-11.7],[10.0,-12.6],[9.4,-13.5],[4.9,-20.1],[4.4,-21.0],[3.7,-22.1],[-2.5,-32.0],[-2.6,-48.2],[-2.6,-49.1],[-2.6,-50.3],[-3.0,-112.0],[-3.0,-113.6],[-3.0,-114.9],[-3.1,-124.3],[-3.1,-127.3],[-11.9,-127.4],[-16.6,-127.4],[-21.4,-124.3],[-47.2,-106.8],[-68.7,-91.9],[-103.9,-67.6]],
  'way/163500104': [[-263.3,-111.0],[-261.6,-110.4],[-259.9,-109.8],[-261.1,-107.4],[-243.6,-100.8],[-242.9,-100.6],[-242.1,-100.3],[-221.5,-92.6],[-220.5,-92.2],[-219.1,-91.8],[-183.1,-78.7],[-181.8,-78.1],[-180.5,-77.5],[-133.1,-59.7],[-130.6,-58.9],[-130.1,-58.7],[-129.1,-61.3],[-126.0,-60.1],[-124.7,-63.3],[-107.4,-56.8],[-104.8,-55.8],[-106.2,-59.2],[-108.3,-64.5],[-122.2,-69.8],[-121.1,-72.8],[-124.2,-73.9],[-123.3,-76.7],[-144.3,-83.5],[-176.8,-95.5],[-178.4,-96.2],[-180.3,-96.9],[-204.6,-105.9],[-205.5,-106.2],[-206.5,-106.5],[-219.8,-111.5],[-221.2,-112.0],[-221.8,-112.2],[-237.6,-118.1],[-238.5,-118.4],[-239.6,-118.8],[-254.3,-124.4],[-255.2,-121.6],[-257.2,-122.2],[-257.8,-122.4],[-258.3,-122.6]],
  'way/163500106': [[-22.2,-281.9],[-22.2,-280.6],[-22.1,-279.4],[-22.1,-278.8],[-21.9,-260.9],[-21.9,-260.1],[-21.9,-258.8],[-22.0,-249.1],[-22.0,-247.8],[-22.2,-206.8],[-22.4,-181.4],[-22.6,-155.5],[-22.6,-154.3],[-22.6,-153.1],[-22.7,-145.9],[-19.7,-145.9],[-19.7,-144.5],[-19.7,-143.2],[-19.7,-142.3],[-16.7,-142.3],[-16.6,-127.4],[-11.9,-127.4],[-3.1,-127.3],[-3.2,-128.6],[-3.2,-129.8],[-2.5,-193.7],[-2.5,-194.6],[-2.5,-195.8],[-2.4,-206.1],[-2.4,-207.3],[-2.4,-208.5],[-2.2,-222.6],[-2.2,-223.9],[-2.2,-225.6],[-2.0,-245.6],[-2.0,-246.8],[-2.0,-247.8],[-1.9,-253.0],[-1.9,-254.1],[-1.9,-255.1],[-1.7,-281.5],[-3.7,-281.6],[-4.3,-281.6],[-4.6,-281.6],[-5.4,-281.6],[-12.9,-281.8],[-14.0,-281.8],[-15.0,-281.8],[-17.3,-281.9],[-18.2,-281.9],[-19.4,-281.9]],
  'way/163500130': [[-61.7,247.5],[-57.6,246.8],[-54.1,246.2],[-55.3,238.6],[-56.6,226.8],[-56.6,223.9],[-56.4,218.0],[-55.4,212.7],[-54.1,207.0],[-52.8,201.5],[-50.5,196.2],[-49.0,192.8],[-47.4,189.1],[-43.2,183.2],[-42.9,182.8],[-40.1,178.8],[-35.7,174.5],[-31.6,170.5],[-27.1,167.0],[-24.0,164.9],[-26.4,161.6],[-28.6,158.5],[-33.0,161.8],[-35.2,163.4],[-38.5,166.5],[-43.9,171.7],[-46.7,175.3],[-50.6,180.3],[-53.5,185.3],[-56.5,190.5],[-58.9,196.3],[-60.3,199.9],[-61.4,204.1],[-63.2,211.1],[-63.9,215.8],[-64.3,227.7],[-64.0,231.3],[-63.7,235.1],[-62.6,241.6]],
  'way/674743946': [[82.6,119.6],[111.1,160.2],[108.4,162.0],[106.0,163.7],[107.0,165.0],[107.8,166.0],[108.5,167.1],[108.9,167.7],[109.5,168.5],[111.9,166.8],[112.6,166.3],[120.3,161.1],[119.7,160.1],[117.0,156.3],[88.7,115.4],[87.6,116.1],[86.9,116.6],[86.5,116.9],[84.4,118.4]],
  'way/1429454967': [[89.2,130.8],[81.7,120.1],[79.6,121.6],[76.9,123.4],[73.5,119.5],[-13.6,179.7],[-17.7,182.5],[-24.4,189.0],[-29.2,194.2],[-34.1,200.8],[-38.0,206.9],[-41.9,214.6],[-44.8,222.8],[-47.0,232.3],[-48.0,241.9],[-47.6,250.4],[-47.2,257.5],[-29.3,362.0],[-10.6,359.1],[-28.4,254.2],[-29.2,246.1],[-28.7,237.0],[-26.9,228.4],[-24.2,221.6],[-21.9,216.1],[-15.4,207.1],[-9.4,200.0],[-0.9,193.0],[4.1,189.4]],
  'way/1027319923': [[-34.8,-48.2],[-38.8,-53.6],[-31.9,-58.7],[-27.9,-53.1]],
}
/** aeroway=jet_bridge ways touching the outlines, building end first */
export const JET_BRIDGES: XY[][] = [[[-181.8,-78.1],[-193.2,-61.2]],[[-220.5,-92.2],[-229.0,-63.7]],[[-242.9,-100.6],[-259.3,-81.7]],[[-261.6,-110.4],[-276.1,-96.3]],[[-257.8,-122.4],[-257.3,-124.3],[-271.9,-129.4],[-271.6,-130.3],[-260.9,-151.0]],[[-238.5,-118.4],[-237.8,-119.7],[-220.8,-131.4]],[[-205.5,-106.2],[-205.1,-107.7],[-208.7,-109.0],[-208.3,-109.9],[-188.5,-118.0]],[[-178.4,-96.2],[-177.9,-97.2],[-148.4,-100.2]],[[-22.1,-279.4],[-23.6,-279.6],[-36.8,-289.3],[-52.2,-306.3]],[[-18.2,-281.9],[-18.2,-290.1],[-25.9,-290.2],[-29.8,-310.3]],[[-14.0,-281.8],[-13.8,-287.6],[-0.6,-313.1]],[[-4.6,-281.6],[-4.4,-287.9],[33.1,-320.7],[36.2,-319.0]],[[-4.3,-281.6],[-4.1,-284.3],[19.7,-303.5],[27.4,-296.2]],[[-37.6,143.0],[-46.5,130.4],[-41.8,127.1],[-27.7,115.0]],[[29.2,55.3],[13.1,68.1]],[[6.1,21.7],[-10.9,32.0]],[[-20.4,-16.7],[-47.3,-3.6]],[[-56.0,-31.1],[-66.5,-12.1]],[[-94.6,-45.7],[-115.3,-23.1]],[[-130.6,-58.9],[-148.5,-48.3]],[[-144.3,-83.5],[-143.7,-85.2],[-116.8,-84.9]],[[-19.7,-143.2],[-22.1,-143.3],[-31.7,-135.7],[-33.0,-134.8],[-54.0,-129.3]],[[-22.6,-154.3],[-25.9,-154.6],[-25.8,-146.9],[-27.0,-146.8],[-46.0,-147.8]],[[-22.4,-181.4],[-41.0,-179.1]],[[-22.2,-206.8],[-23.8,-206.8],[-43.3,-216.6]],[[-22.0,-247.8],[-28.0,-248.0],[-50.6,-255.0]],[[-21.9,-260.1],[-26.3,-260.2],[-26.1,-274.4],[-53.8,-274.5]],[[-1.9,-254.1],[1.4,-254.1],[1.3,-277.7],[2.4,-277.8],[22.2,-273.0]],[[-2.0,-246.8],[6.7,-246.7],[28.7,-247.0]],[[-2.2,-223.9],[2.4,-224.0],[29.4,-218.7]],[[-2.4,-207.3],[2.4,-207.3],[4.0,-207.1],[28.4,-196.9]],[[-2.5,-194.6],[5.9,-194.8],[5.7,-173.1],[28.7,-168.6]],[[-3.2,-128.6],[4.3,-128.6],[5.8,-128.7],[27.4,-130.3]],[[-3.0,-113.6],[6.6,-113.6],[8.1,-113.5],[27.5,-99.6]],[[-2.6,-49.1],[0.1,-49.2],[2.1,-67.6],[3.4,-67.4],[25.1,-66.4]],[[4.4,-21.0],[11.5,-28.5],[29.7,-29.4]],[[10.0,-12.6],[16.2,-16.8],[26.9,-1.8],[41.8,8.0]],[[42.6,37.0],[43.9,36.0],[38.1,27.7],[39.0,27.0],[58.5,34.9]],[[132.9,25.4],[125.0,14.6],[135.4,7.4],[134.9,6.7],[120.3,-2.8],[122.3,-5.6]],[[152.6,11.5],[134.4,-14.9],[131.3,-12.5],[130.2,-11.9],[117.5,-27.8]]]
/** Lidar-traced raised roofs per outline: body height and blocks (rectangle in this frame, height). */
export const REGIONS: Record<string, { body: number; regions: Block[] }> = {
  'way/163500141': { body: 13.4, regions: [{ h: 18.2, rect: [[153.7,26.9],[-23.1,148.4],[-13.0,163.1],[163.8,41.6]] }] },
  'way/163500105': { body: 9.2, regions: [{ h: 13.2, rect: [[52.2,57.7],[35.2,32.5],[24.3,40.0],[41.3,65.2]] }, { h: 13.2, rect: [[21.2,10.4],[12.3,-2.8],[-0.2,5.6],[8.7,18.9]] }, { h: 13.1, rect: [[9.5,-4.7],[0.9,-17.5],[-10.5,-9.8],[-1.9,3.0]] }, { h: 13.2, rect: [[-48.8,-40.2],[-61.2,-58.5],[-76.9,-47.9],[-64.6,-29.6]] }, { h: 13.2, rect: [[13.5,-78.1],[-19.1,-126.4],[-101.1,-71.0],[-68.5,-22.7]] }, { h: 13.1, rect: [[-1.7,-73.6],[-11.0,-87.3],[-23.3,-78.9],[-14.1,-65.2]] }, { h: 17.2, rect: [[-18.7,-56.4],[-26.3,-67.8],[-48.1,-53.1],[-40.4,-41.7]] }] },
  'way/163500104': { body: 9.2, regions: [{ h: 13.3, rect: [[-125.5,-73.5],[-144.7,-80.1],[-148.2,-70.1],[-129.0,-63.4]] }, { h: 13.2, rect: [[-157.0,-84.8],[-171.7,-89.9],[-175.1,-80.0],[-160.5,-74.9]] }, { h: 13.3, rect: [[-182.8,-94.4],[-197.3,-99.4],[-200.6,-89.8],[-186.2,-84.8]] }, { h: 13.2, rect: [[-209.8,-105.4],[-226.9,-111.3],[-230.7,-100.5],[-213.6,-94.6]] }, { h: 13.2, rect: [[-235.3,-114.1],[-254.4,-120.8],[-257.8,-111.2],[-238.6,-104.6]] }] },
  'way/163500106': { body: 9.2, regions: [{ h: 13.2, rect: [[-3.1,-127.4],[-3.1,-137.4],[-12.1,-137.4],[-12.1,-127.4]] }, { h: 13.2, rect: [[-8.1,-148.4],[-8.1,-167.4],[-17.1,-167.4],[-17.1,-148.4]] }, { h: 13.2, rect: [[-2.1,-176.4],[-2.1,-196.4],[-18.1,-196.4],[-18.1,-176.4]] }, { h: 13.2, rect: [[-13.1,-208.4],[-13.1,-218.4],[-21.1,-218.4],[-21.1,-208.4]] }, { h: 13.2, rect: [[-3.1,-218.4],[-3.1,-248.4],[-20.8,-248.4],[-20.8,-218.4]] }] },
  'way/163500130': { body: 12.3, regions: [] },
}

const H_LAND = 13.4, H_CORNER = 12.3, H_CONC = 9.2, H_BRIDGE = 14.6, Z_CANOPY = 12.0, Z_JB = 3.8

export function build(detail: boolean) {
  const P = newParts()
  // the landside block: dark curb wall, glazed arrivals and departures levels
  landside(P, OSM['way/163500141'], H_LAND, detail)
  for (const b of REGIONS['way/163500141'].regions) raised(P, OSM['way/163500141'], b, H_LAND, { glaze: [H_LAND + 0.9, b.h - 0.9], detail })
  landside(P, OSM['way/163500130'], H_CORNER, detail)
  // concourses and the E/F hub
  for (const id of ['way/163500105', 'way/163500104', 'way/163500106']) {
    body(P, OSM[id], H_CONC, { detail })
    for (const b of REGIONS[id].regions) raised(P, OSM[id], b, b.h > 15 ? 13.2 : H_CONC, b.h > 15 ? { glaze: [13.8, b.h - 0.8], detail } : {})
  }
  // the bridge to the ATS station: a glazed tube on the second level
  {
    const r = clean(OSM['way/674743946'], 0.4)
    box(P.dark, P.roof, r, 8.6, H_BRIDGE, 0.2)
    cap(P.dark, r, 8.6, false)
    for (let i = 0; i < r.length; i++) { const a = r[i], b = r[(i + 1) % r.length]; if (len2(a, b) > 10) panelRow(P.win, a, b, 9.4, 13.6, { bay: 6, gap: 0.8, end: 0.6 }) }
  }
  // the E/F ramp control tower on the hub (lidar 20.9 m)
  rampTower(P, OSM['way/1027319923'], 20.9, P.dark)
  canopy(P, OSM['way/1429454967'], Z_CANOPY, { step: detail ? 14 : 26 })
  bridges(P, JET_BRIDGES, Z_JB, detail)
  return materials(P)
}

if (import.meta.main) {
  const o = { bearing: 0, height: 18.2 }
  await writeModel('chi-ohare-terminal-2.glb', "O'Hare Terminal 2", build(false), { ...o, maxTris: 8000, maxBytes: 250_000 })
  await writeModel('chi-ohare-terminal-2.detail.glb', "O'Hare Terminal 2", build(true), { ...o, maxTris: 40_000, maxBytes: 1536 * 1024 })
}
