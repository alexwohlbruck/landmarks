/**
 * KLIA Terminal 1: the Main Terminal Building and the Contact Pier
 * (Kisho Kurokawa with Akitek Jururancang, opened 1998) — procedural,
 * CC0-1.0, no textures.
 * bun generators/kl-klia-terminal-1.ts
 *
 * Writes models/kl-klia-terminal-1.glb (low) and
 * models/kl-klia-terminal-1.detail.glb (detail: finer shells, the wood
 * soffits, every column of the hall, curtain-wall mullions).
 *
 * Also the shared kit for the other KLIA models of this batch
 * (kl-klia-satellite-a imports `KL`, `umbrellas`, `pierVault`, `glassWalls`
 * and friends from here). The model is only written when this file is run
 * directly.
 *
 * Map frame: x = east, y = north, z up, metres, turned to bearing 325.9 (the
 * airport grid: the contact pier runs along +x, which is bearing 55.9; +y is
 * landside, bearing 325.9). Anchor: area centroid of the OSM outline
 * relation/6848621 (101.7051762, 2.7533403).
 *
 * The identity is the roof of the Main Terminal Building (MTB): 39 square
 * shell units on a 38.4 m grid ("39 square roof units ... 38.4 m grid",
 * English Wikipedia; "steel hyperbolic paraboloid shells with spans of
 * 38.4 metres", Archnet), carried on tapered conical columns that also take
 * the rainwater down (Archis). The columns stand at the unit corners. Each
 * unit is a tent of four curved triangular shells: low at its four corner
 * columns, highest at the apex in its middle, with skylight strips on the
 * hips (the diagonals) running from every column head up to the apexes, and
 * each eave a pointed arch from column to column. So from above the roof is
 * a diamond lattice of glass lines over a grid of green-grey shells, from
 * the side every unit is a pointed gable with glazing on both slopes, and
 * along each facade the eave is a row of pointed arches over dark glass,
 * springing from the columns ("KLIA MTB.jpg", the 2026 aerial, the hall
 * photos with four skylights rising from each capital). Modelled per unit
 * with r = max(|u|, |v|), w = min/max: eave zE(w) = z0 + m(z1 − z0)(1 − w)^q,
 * height z = z1 + (zE − z1) r^p (see `shellZ`).
 *
 * Evidence
 * - OSM: relation/6848621 "KLIA Terminal 1 (Main Building)" (outer way
 *   502859342: the MTB, the airside link with its garden court
 *   (inner way 463735060), the contact pier with its gate stubs and its
 *   centre block; building=transportation, start_date 1998; no height),
 *   and way/1561097813 (building:part=roof): the landside row of roof units
 *   over the departure curb, its tips mapped as round bumps every 38.4 m.
 *   Rings read in this frame; the unit grid (x edges −178.6 + 38.45 k) is
 *   fitted to those bumps; the MTB spans six units by five, the curb row
 *   nine by one: 30 + 9 = 39 units, as published.
 * - Published: 39 units on a 38.4 m grid (Wikipedia, Archnet
 *   archnet.org/sites/4665, Divisare); conical columns carrying the HP
 *   shells (Archis, "Kisho Kurokawa in Maleisië"); the hall's ceiling
 *   runs from about 11 m at the column heads to 23 m at the shell tips
 *   (student presentation on Scribd, an informal source; consistent with
 *   the photos).
 * - Photos (Wikimedia Commons):
 *   • "KLIA MTB&pier.jpg", Pizzaboy1, public domain — the whole MTB and
 *     contact pier from the air, from the south-west: the 6 × 5 grid plus
 *     the curb row, the diagonal skylight lattice, the pointed eave arches,
 *     the smooth green-grey pier vault, the gardens between.
 *   • "KLIA MTB.jpg", Craig, public domain — the south-west eave from
 *     below: pointed arches between the columns, the dark glass hall wall
 *     behind the columns, the grey panelled podium under it.
 *   • "KLIA Main terminal.JPG", Descon7, CC BY-SA 3.0 — the shells sweeping
 *     out from the column capitals to the corner tips.
 *   • "Kuala Lumpur airport terminal.jpg", Maksym Kozlenko, CC BY-SA 4.0,
 *     and "KLIA, Malaysia.jpg", Tahir mq, CC BY-SA 3.0 — the hall: a
 *     column with its four diagonal skylights rising from the capital.
 *   • "KLIA MTB&Tower.jpg", "KLIA PTC+Tower.jpg", "KLIA C-Pier.jpg",
 *     Craig, public domain — the contact pier centre from the apron: two
 *     shell units over a glazed block, the row of MTB corner gables
 *     behind, the long low pier vault to both sides.
 *   • "KLIA Contact Pier.jpg", Craig, public domain — the pier inside:
 *     glass walls both sides, the vaulted ceiling.
 *   • "KLIA MTB+Pier buildings.jpg", "KLIA MTB+Pier.jpg", Craig, public
 *     domain; "KLIA pier&satellite.jpg", Pizzaboy1, public domain.
 *   • "Aerial photograph of Malaysia on 15 January 2026 - 02.jpg", Yu Chu
 *     Chin, CC BY-SA 4.0 — MTB and pier from the south-west: the row of
 *     tent units and pointed eave arches, the pier vault with its rolled
 *     ends and deep eaves.
 * - Terrain: Mapterhorn has only z12 here, a surface model that shows the
 *   MTB itself as a 28 m hump; the ground round it is flat at about 5–6 m.
 *
 * Numbers
 * - Plan: measured from OSM (above). Unit size 38.45 × 38.4 m.
 * - Hall floor 12 m (the departure level on the podium): estimated from
 *   "KLIA MTB.jpg" (podium wall against a minibus). Shell soffit 23 m at
 *   the columns (floor + 11), 35 m at the apex (floor + 23), from the
 *   published ceiling range; eave-arch peaks 33.2 m (estimated from the
 *   eave photos and the 2026 aerial); shell 1.2 m thick. Top 36.2 m.
 * - Hall glass walls 4.5 m inside the eave line, behind the columns, up
 *   into the arches ("KLIA MTB.jpg", 2026 aerial). Columns 2.4 m radius at
 *   the foot, 1.5 m under the capital (estimated, photos). The curb row's
 *   columns stand on the ground beside the departure road.
 * - Contact pier: 41 m wide (OSM); apron level 0–6 m in grey panels, glass
 *   walls to the eave at 17 m, vault crown 21.5 m: scaled from the pier
 *   centre's units in "KLIA C-Pier.jpg" (estimated); its free ends roll
 *   down over 22 m and the eaves overhang 4.5 m (2026 aerial). Pier centre:
 *   one smaller shell unit (27 × 29 m, soffit 21.5–31.5 m) between two
 *   wing-like rises of the roof to 31 m tips, over a glass block, estimated
 *   from "KLIA PTC+Tower.jpg" and "KLIA Tower.jpg".
 * - Airside link 15 m, flat (aerial; estimated). Gate stubs 6 m (estimated).
 * - Colours sampled from the daylight photos and pulled to the palette's
 *   lightness: roof green-grey (#777e78…#848981 in haze → #aab4ad), glass
 *   walls dark blue-grey (#50595e → a light window variant), podium panels
 *   light grey, columns pale granite, soffit warm timber.
 *
 * Look-only: none used.
 *
 * Doubts
 * - No licensed photo looks straight down on the roof, so the arch peak
 *   height and the shell curvature are fitted by eye to oblique views.
 * - The curb row's units are assumed to be the same height as the hall's.
 * - The pier centre is simplified (wings, one unit, a glass block).
 * - Mapterhorn here is z12 only, a surface model with the MTB, car parks and
 *   forest in it: terrain.ts check (--zoom 12) reports the podium's edge
 *   ring (12 m), the link roof (15 m) and some gate-stub tops (6 m) under
 *   that hump by up to 10 m. The terrain is wrong for the site; the model
 *   keeps the real heights. Two small separate buildings by the MTB's
 *   north-east side (way/1560224309, way/1560233963) sit 15–17 % under the
 *   curb row's end unit and are left to the map.
 * - The 2026 aerials show solar arrays on Satellite A's arms but none on
 *   the contact pier, so none are drawn here.
 * - Heights are estimates (no lidar outside the US); published facts give
 *   only the grid and the ceiling range.
 */
import { Part, type V3, type MaterialSpec } from './mesh'
import { finish } from './palette'
import { type XY, quadN, unit, capPoly, area } from './nyc-570-lexington'
import { writeLod, newMats, type Mats } from './tokyo-haneda-terminal-1'
import { polyTris } from './berlin-oberbaum-bridge'

export type { XY, Mats }

// ===========================================================================
// Kit (shared with the other KLIA models)
// ===========================================================================

/** KLIA colours, from daylight photos, pulled to the palette's lightness. */
export const KL = {
  /** The green-grey (sage silver) metal of the shell roofs and pier vaults. */
  roof: finish('klia-roof', 0xaab4ad),
  /** Timber-slat soffits under the shells and vaults. */
  soffit: finish('klia-soffit', 0xc9a77c),
  /** Curtain walls: dark blue-grey glass, pulled light; lit at night. */
  window: { name: 'window', color: 0x8197a6, roughness: 0.35 } as MaterialSpec,
  /** Skylights: dark at night. */
  glass: { name: 'glass', color: 0x86a59f, roughness: 0.24 } as MaterialSpec,
  /** Light grey aluminium panels of the podium and the apron level. */
  panel: finish('klia-panel', 0xd5d8d6),
  /** Pale granite columns, trims and mullions. */
  stone: finish('klia-granite', 0xe7e2d9),
}

export const UP: V3 = [0, 0, 1]
export const MATS = ['roof', 'soffit', 'win', 'glass', 'panel', 'stone']

export function materials(M: Mats, low = false) {
  return [
    { part: M.roof, material: { ...KL.roof, doubleSided: low } as MaterialSpec },
    { part: M.soffit, material: KL.soffit },
    { part: M.win, material: KL.window },
    { part: M.glass, material: KL.glass },
    { part: M.panel, material: KL.panel },
    { part: M.stone, material: KL.stone },
  ]
}

/** One shell unit: centre, half sizes. */
export type Cell = { cx: number; cy: number; hx: number; hy: number }
export type Shell = {
  /** Soffit height at the corners, over the columns. */
  z0: number
  /** Soffit height at the apex, the unit's centre. */
  z1: number
  /** Eave-arch peak (edge midpoint) as a share of (z1 − z0). */
  m: number
  /** Pointed-arch exponent along the edge (< 1: rises steeply off the column). */
  q?: number
  /** Face power from the apex out to the edge (1: ruled). */
  p: number
  /** Shell thickness. */
  th: number
  /** Column foot height. */
  floor: number
}

/**
 * Soffit height of a unit at local (u, v) ∈ [−1, 1]². The unit is a tent of
 * four curved triangles: low at the four corner columns, highest at the
 * apex in the middle, the hips (diagonals) running straight from each
 * column up to the apex, and each eave a pointed arch from column to
 * column. With r = max(|u|, |v|) (0 at the apex, 1 on the eave) and
 * w = min/max (0 on the arch's centre line, 1 on a hip):
 * eave zE(w) = z0 + m(z1 − z0)(1 − w)^q, and z = z1 + (zE − z1) r^p.
 */
export const shellZ = (s: Shell, u: number, v: number) => {
  const au = Math.abs(u), av = Math.abs(v), r = Math.max(au, av)
  if (r < 1e-9) return s.z1
  const w = Math.min(au, av) / r
  const zE = s.z0 + s.m * (s.z1 - s.z0) * Math.max(0, 1 - w) ** (s.q ?? 0.6)
  return s.z1 + (zE - s.z1) * r ** s.p
}
/** Upward normal of the shell at local (u, v), seen from inside the face whose outward axis is `side`. */
function shellN(s: Shell, c: Cell, u: number, v: number, side: XY = [0, 0]): V3 {
  const e = 1e-4, f = 2e-3
  u += side[0] * f; v += side[1] * f
  const dzu = (shellZ(s, u + e, v) - shellZ(s, u - e, v)) / (2 * e) / c.hx
  const dzv = (shellZ(s, u, v + e) - shellZ(s, u, v - e)) / (2 * e) / c.hy
  return unit([-dzu, -dzv, 1])
}

/**
 * A field of shell units: top skin (roof), soffit, the rim along every edge
 * no neighbour shares, glass strips along the hips, and the conical
 * columns with their flared capitals at the unit corners.
 * `n` subdivides each of a unit's four triangles (rows); `ns` the soffit.
 * `columns` picks which corner nodes get a column (all, by default).
 */
export function umbrellas(M: Mats, cells: Cell[], s: Shell, o: { n: number; ns: number; sky: number; colSeg: number; columns?: (q: XY) => boolean; colFloor?: (q: XY) => number }) {
  const key = (x: number, y: number) => `${Math.round(x * 2)},${Math.round(y * 2)}`
  const centres = new Set(cells.map((c) => key(c.cx, c.cy)))
  const has = (x: number, y: number) => centres.has(key(x, y))
  const nodes = new Map<string, XY>()
  for (const c of cells) {
    const P = (u: number, v: number, top: boolean): V3 => [c.cx + u * c.hx, c.cy + v * c.hy, shellZ(s, u, v) + (top ? s.th : 0)]
    const corners: XY[] = [[1, -1], [1, 1], [-1, 1], [-1, -1]]
    for (const [u, v] of corners) nodes.set(key(c.cx + u * c.hx, c.cy + v * c.hy), [c.cx + u * c.hx, c.cy + v * c.hy])
    // four triangles (apex, corner k, corner k+1), each subdivided in rows
    for (const [layer, N] of [['top', o.n], ['bot', o.ns]] as [string, number][]) {
      if (N <= 0) continue
      const top = layer === 'top'
      const part = top ? M.roof : M.soffit
      for (let k = 0; k < 4; k++) {
        const A = corners[k], B = corners[(k + 1) % 4]
        const at = (r: number, q: number): [number, number] => {
          if (r === 0) return [0, 0]
          const t = r / N, w = q / r
          return [t * (A[0] + (B[0] - A[0]) * w), t * (A[1] + (B[1] - A[1]) * w)]
        }
        const V = (uv: [number, number]) => P(uv[0], uv[1], top)
        const sd: XY = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2]
        const Nn = (uv: [number, number]): V3 => { const n = shellN(s, c, uv[0], uv[1], sd); return top ? n : [-n[0], -n[1], -n[2]] }
        for (let r = 0; r < N; r++) {
          for (let q = 0; q <= r; q++) {
            const a = at(r, q), b = at(r + 1, q), d = at(r + 1, q + 1)
            part.tri(V(a), V(b), V(d), undefined, undefined, undefined, [Nn(a), Nn(b), Nn(d)])
            if (q < r) {
              const e = at(r, q + 1)
              part.tri(V(a), V(d), V(e), undefined, undefined, undefined, [Nn(a), Nn(d), Nn(e)])
            }
          }
        }
      }
    }
    // rim: along each eave no neighbour shares, a strip from soffit to top
    const sides: { nb: [number, number]; pts: (t: number) => [number, number]; out: XY }[] = [
      { nb: [c.cx + 2 * c.hx, c.cy], pts: (t) => [1, -1 + 2 * t], out: [1, 0] },
      { nb: [c.cx, c.cy + 2 * c.hy], pts: (t) => [1 - 2 * t, 1], out: [0, 1] },
      { nb: [c.cx - 2 * c.hx, c.cy], pts: (t) => [-1, 1 - 2 * t], out: [-1, 0] },
      { nb: [c.cx, c.cy - 2 * c.hy], pts: (t) => [-1 + 2 * t, -1], out: [0, -1] },
    ]
    for (const sd of sides) {
      if (has(sd.nb[0], sd.nb[1])) continue
      const segs = Math.max(4, o.n * 2)
      const nn: V3 = [sd.out[0], sd.out[1], 0]
      for (let i = 0; i < segs; i++) {
        // finer near the columns, where the arch rises steeply
        const f = (j: number) => 0.5 - 0.5 * Math.cos((Math.PI * j) / segs)
        const a = sd.pts(f(i)), b = sd.pts(f(i + 1))
        quadN(M.roof, P(a[0], a[1], false), P(b[0], b[1], false), P(b[0], b[1], true), P(a[0], a[1], true), [nn, nn, nn, nn])
      }
    }
    // skylight strips along the hips, from the apex down to the columns
    if (o.sky > 0) {
      const w = 1.4 // half width (m)
      for (const [du, dv] of corners) {
        const segs = o.sky
        const dir = unit([du * c.hx, dv * c.hy, 0]), side: XY = [-dir[1], dir[0]]
        const pt = (t: number, k: number): V3 => {
          const u = du * t, v = dv * t
          const q = P(u, v, true)
          const ox = side[0] * w * k, oy = side[1] * w * k
          const z = shellZ(s, u + ox / c.hx, v + oy / c.hy) + s.th
          return [q[0] + ox, q[1] + oy, Math.max(z, q[2]) + 0.3]
        }
        for (let i = 0; i < segs; i++) {
          const t0 = 0.08 + ((0.9 - 0.08) * i) / segs, t1 = 0.08 + ((0.9 - 0.08) * (i + 1)) / segs
          const n0 = shellN(s, c, du * t0, dv * t0), n1 = shellN(s, c, du * t1, dv * t1)
          quadN(M.glass, pt(t0, -1), pt(t1, -1), pt(t1, 1), pt(t0, 1), [n0, n1, n1, n0])
        }
      }
    }
  }
  // the columns, at the unit corners
  for (const q of nodes.values()) if (!o.columns || o.columns(q)) column(M.stone, q[0], q[1], o.colFloor ? o.colFloor(q) : s.floor, s.z0, o.colSeg)
}

/** A tapered conical column from z0 with a flared capital meeting the soffit at z1. */
export function column(p: Part, cx: number, cy: number, z0: number, z1: number, n: number, r0 = 2.4, r1 = 1.5, rc = 4.2) {
  const zc = z1 - 2.8
  const ring = (r: number, z: number): V3[] => Array.from({ length: n }, (_, i) => [cx + r * Math.cos((2 * Math.PI * (i + 0.5)) / n), cy + r * Math.sin((2 * Math.PI * (i + 0.5)) / n), z])
  const loft = (lo: V3[], hi: V3[], rA: number, rB: number, h: number) => {
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n
      const nn = (k: number): V3 => unit([Math.cos((2 * Math.PI * (k + 0.5)) / n), Math.sin((2 * Math.PI * (k + 0.5)) / n), (rA - rB) / h])
      quadN(p, lo[i], lo[j], hi[j], hi[i], [nn(i), nn(j), nn(j), nn(i)])
    }
  }
  loft(ring(r0, z0), ring(r1, zc), r0, r1, zc - z0)
  loft(ring(r1, zc), ring(rc, z1 - 0.1), r1, rc, z1 - 0.1 - zc)
}

/** Points along a polyline, `step` apart at most. */
export function densify(a: XY, b: XY, step: number): XY[] {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.ceil(L / step))
  return Array.from({ length: n + 1 }, (_, k) => [a[0] + ((b[0] - a[0]) * k) / n, a[1] + ((b[1] - a[1]) * k) / n] as XY)
}

/**
 * Curtain walls round a counter-clockwise ring from z0 up to top(x, y),
 * sampled every `step` m; pale mullions every `mull` m when given.
 */
export function glassWalls(M: Mats, ring0: XY[], z0: number, top: (q: XY) => number, step: number, mull = 0) {
  const ring = area(ring0) < 0 ? ring0.slice().reverse() : ring0.slice()
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]); if (L < 0.05) continue
    const out: XY = [(b[1] - a[1]) / L, (a[0] - b[0]) / L], nn: V3 = [out[0], out[1], 0]
    const pts = densify(a, b, step)
    for (let k = 0; k < pts.length - 1; k++) {
      const p = pts[k], q = pts[k + 1]
      quadN(M.win, [p[0], p[1], z0], [q[0], q[1], z0], [q[0], q[1], top(q)], [p[0], p[1], top(p)], [nn, nn, nn, nn])
    }
    if (mull > 0) {
      const mp = densify(a, b, mull)
      for (let k = 1; k < mp.length - 1; k++) {
        const q = mp[k], d = 0.08, w = 0.25
        const t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
        const A: XY = [q[0] - t[0] * w + out[0] * d, q[1] - t[1] * w + out[1] * d], B: XY = [q[0] + t[0] * w + out[0] * d, q[1] + t[1] * w + out[1] * d]
        quadN(M.stone, [A[0], A[1], z0], [B[0], B[1], z0], [B[0], B[1], top(B) - 0.1], [A[0], A[1], top(A) - 0.1], [nn, nn, nn, nn])
      }
      // transoms every 7 m up to the lowest point of the edge
      const zt = Math.min(...pts.map(top))
      for (let z = z0 + 7; z < zt - 2; z += 7) {
        const A: XY = [a[0] + out[0] * 0.08, a[1] + out[1] * 0.08], B: XY = [b[0] + out[0] * 0.08, b[1] + out[1] * 0.08]
        quadN(M.stone, [A[0], A[1], z - 0.2], [B[0], B[1], z - 0.2], [B[0], B[1], z + 0.2], [A[0], A[1], z + 0.2], [nn, nn, nn, nn])
      }
    }
  }
}

/** Vertical walls of a ring (any winding), outward, z0…z1. */
export function ringWalls(p: Part, ring0: XY[], z0: number, z1: number) {
  const ring = area(ring0) < 0 ? ring0.slice().reverse() : ring0.slice()
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]); if (L < 0.05) continue
    const nn: V3 = [(b[1] - a[1]) / L, (a[0] - b[0]) / L, 0]
    quadN(p, [a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1], [nn, nn, nn, nn])
  }
}
/** The same for a hole: walls face into the hole. */
export function holeWalls(p: Part, ring0: XY[], z0: number, z1: number) {
  const ring = area(ring0) > 0 ? ring0.slice().reverse() : ring0.slice()
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]); if (L < 0.05) continue
    const nn: V3 = [(b[1] - a[1]) / L, (a[0] - b[0]) / L, 0]
    quadN(p, [a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1], [nn, nn, nn, nn])
  }
}
/** A flat cap over an outline with holes. */
export function capHoles(p: Part, ring: XY[], holes: XY[][], z: number, up = true) {
  for (const [a, b, c] of polyTris(ring, holes)) {
    const A: V3 = [a[0], a[1], z], B: V3 = [b[0], b[1], z], C: V3 = [c[0], c[1], z]
    const cr = (B[0] - A[0]) * (C[1] - A[1]) - (B[1] - A[1]) * (C[0] - A[0])
    if ((cr > 0) === up) p.tri(A, B, C); else p.tri(A, C, B)
  }
}

/**
 * Flat tops for the pieces of a ring that stick out of the main volumes
 * (gate stubs): each run of vertices outside `body`, closed along the body's
 * edge, capped at z. The rest of the ring's area is covered by the volumes
 * above, so it gets no hidden floor.
 */
export function capStubs(p: Part, ring: XY[], z: number, body: (q: XY) => boolean) {
  const n = ring.length
  const start = ring.findIndex((q) => body(q))
  if (start < 0) { capPoly(p, ring, z); return }
  let run: XY[] = []
  for (let k = 1; k <= n; k++) {
    const q = ring[(start + k) % n]
    if (!body(q)) { if (!run.length) run.push(ring[(start + k - 1) % n]); run.push(q) }
    else if (run.length) { run.push(q); if (run.length >= 4) capPoly(p, run, z); run = [] }
  }
}

/** Window bands on a box's walls: broad panels between piers, `bay` m wide, z0…z1, d proud. */
export function bands(p: Part, ring0: XY[], z0: number, z1: number, bay: number, pier: number, d = 0.06, skip?: (a: XY, b: XY) => boolean) {
  const ring = area(ring0) < 0 ? ring0.slice().reverse() : ring0.slice()
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]); if (L < bay * 0.6) continue
    if (skip?.(a, b)) continue
    const out: XY = [(b[1] - a[1]) / L, (a[0] - b[0]) / L], nn: V3 = [out[0], out[1], 0], t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
    const n = Math.max(1, Math.round(L / bay)), w = L / n
    for (let k = 0; k < n; k++) {
      const s0 = k * w + pier / 2, s1 = (k + 1) * w - pier / 2
      const A: XY = [a[0] + t[0] * s0 + out[0] * d, a[1] + t[1] * s0 + out[1] * d], B: XY = [a[0] + t[0] * s1 + out[0] * d, a[1] + t[1] * s1 + out[1] * d]
      quadN(p, [A[0], A[1], z0], [B[0], B[1], z0], [B[0], B[1], z1], [A[0], A[1], z1], [nn, nn, nn, nn])
    }
  }
}

/**
 * A straight pier vault between x0…x1 (along x), y0…y1 across, eave at ze,
 * crown at zc, overhanging `oh`; `seg` segments across. Top skin roof,
 * underside soffit (eave overhang only), fascia and gable ends roof.
 * `frame` (optional) maps (x, y, z) to the model, for piers that run any way.
 */
export function pierVault(M: Mats, x0: number, x1: number, y0: number, y1: number, ze: number, zc: number, oh: number, seg: number, frame: (q: V3) => V3 = (q) => q, ends: [boolean, boolean] = [true, true], hip = 0) {
  const Y0 = y0 - oh, Y1 = y1 + oh, X0 = x0 - (ends[0] ? oh : 0), X1 = x1 + (ends[1] ? oh : 0)
  const w = (Y1 - Y0) / 2, ym = (Y0 + Y1) / 2
  // a circular arc through the eaves and the crown
  const rise = zc - ze, R = (w * w + rise * rise) / (2 * rise)
  const Zc = (y: number) => zc - R + Math.sqrt(Math.max(0, R * R - (y - ym) ** 2))
  // the free ends roll down towards the eave ("hipped" in a curve)
  const sx = (x: number) => {
    if (hip <= 0) return 1
    const d = Math.min(ends[0] ? x - X0 : 1e9, ends[1] ? X1 - x : 1e9)
    const t = Math.min(1, Math.max(0, d / hip))
    return 0.15 + 0.85 * (1 - (1 - t) ** 2)
  }
  const Z = (y: number, x = (X0 + X1) / 2) => ze + (Zc(y) - ze) * sx(x)
  const Nn = (x: number, y: number): V3 => { const e = 0.05; return unit([-(Z(y, x + e) - Z(y, x - e)) / (2 * e), -(Z(y + e, x) - Z(y - e, x)) / (2 * e), 1]) }
  const ys = Array.from({ length: seg + 1 }, (_, i) => Y0 + ((Y1 - Y0) * i) / seg)
  const xs: number[] = [X0]
  const hs = hip > 0 ? 4 : 0
  if (ends[0]) for (let k = 1; k <= hs; k++) xs.push(X0 + (hip * k) / hs)
  if (ends[1]) for (let k = hs; k >= 1; k--) xs.push(X1 - (hip * k) / hs)
  xs.push(X1)
  const F = (x: number, y: number, z: number) => frame([x, y, z])
  const fn = (n: V3): V3 => { const a = frame([0, 0, 0]), b = frame(n); return unit([b[0] - a[0], b[1] - a[1], b[2] - a[2]]) }
  for (let j = 0; j < xs.length - 1; j++) {
    const xa = xs[j], xb = xs[j + 1]
    if (xb - xa < 0.01) continue
    for (let i = 0; i < seg; i++) {
      const ya = ys[i], yb = ys[i + 1]
      quadN(M.roof, F(xa, ya, Z(ya, xa)), F(xb, ya, Z(ya, xb)), F(xb, yb, Z(yb, xb)), F(xa, yb, Z(yb, xa)), [fn(Nn(xa, ya)), fn(Nn(xb, ya)), fn(Nn(xb, yb)), fn(Nn(xa, yb))])
    }
  }
  // fascia: a 0.9 m deep lip along both eaves and the ends
  const lip = 0.9
  for (const [y, s] of [[Y0, -1], [Y1, 1]] as [number, number][]) {
    const n = fn([0, s, 0])
    for (let j = 0; j < xs.length - 1; j++) {
      const xa = xs[j], xb = xs[j + 1]
      if (xb - xa < 0.01) continue
      quadN(M.roof, F(xa, y, Z(y, xa) - lip), F(xb, y, Z(y, xb) - lip), F(xb, y, Z(y, xb)), F(xa, y, Z(y, xa)), [n, n, n, n])
    }
    // eave soffit, from the lip back to the wall line
    const yw = s < 0 ? y0 : y1
    const d = fn([0, 0, -1])
    quadN(M.soffit, F(X0, y, ze - lip), F(X0, yw, ze - lip), F(X1, yw, ze - lip), F(X1, y, ze - lip), [d, d, d, d])
  }
  for (const [x, s, on] of [[X0, -1, ends[0]], [X1, 1, ends[1]]] as [number, number, boolean][]) {
    const n = fn([s, 0, 0])
    for (let i = 0; i < seg; i++) {
      const ya = ys[i], yb = ys[i + 1]
      const za = Z(ya, x), zb = Z(yb, x), zl = ze - lip
      quadN(M.roof, F(x, ya, zl), F(x, yb, zl), F(x, yb, zb), F(x, ya, za), [n, n, n, n])
    }
    if (on) {
      const d = fn([0, 0, -1])
      const xw = s < 0 ? x0 : x1
      quadN(M.soffit, F(x, Y0, ze - lip), F(x, Y1, ze - lip), F(xw, Y1, ze - lip), F(xw, Y0, ze - lip), [d, d, d, d])
    }
  }
  return Z
}

/** A simple box with walls in `wall`, top in `top`. */
export function box(wall: Part, top: Part | null, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number) {
  const r: XY[] = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
  ringWalls(wall, r, z0, z1)
  if (top) capPoly(top, r, z1)
}

// ===========================================================================
// The model
// ===========================================================================

export const ANCHOR: [number, number] = [101.7051762, 2.7533403]
export const BEARING = 325.9

/** OSM relation/6848621 outer ring (way 502859342), this frame, simplified to 0.25 m. */
export const T1_OUTLINE: XY[] = [[133.6, 189.5], [133.8, 147.2], [128.6, 143.7], [129.5, 4.9], [110.3, -16.0], [110.2, -53.5], [235.7, -53.4], [235.7, -41.2], [229.3, -41.1], [229.4, -30.8], [249.2, -30.9], [249.2, -41.3], [241.1, -41.3], [241.1, -53.4], [278.8, -53.4], [278.8, -40.8], [272.4, -40.8], [272.5, -30.5], [292.3, -30.6], [292.3, -40.9], [284.2, -40.9], [284.3, -53.4], [322.8, -53.3], [322.8, -41.2], [316.5, -41.2], [316.5, -30.9], [336.4, -31.0], [336.3, -41.4], [328.3, -41.3], [328.2, -53.3], [366.6, -53.3], [366.8, -40.6], [360.4, -40.6], [360.4, -30.3], [380.3, -30.4], [380.3, -40.8], [372.2, -40.7], [372.3, -53.3], [409.5, -53.3], [409.6, -40.8], [403.2, -40.8], [403.3, -30.5], [423.1, -30.5], [423.1, -40.9], [415.0, -40.9], [415.1, -53.3], [442.2, -53.1], [442.1, -93.7], [386.3, -93.6], [386.2, -108.7], [388.7, -108.7], [388.6, -119.2], [368.7, -119.1], [368.7, -108.7], [376.9, -108.8], [377.0, -93.5], [308.1, -93.9], [308.0, -109.0], [310.6, -109.0], [310.5, -119.6], [290.5, -119.4], [290.6, -109.1], [298.7, -109.1], [298.9, -93.8], [231.2, -93.3], [231.0, -108.4], [233.6, -108.4], [233.5, -119.0], [213.5, -118.8], [213.6, -108.5], [221.7, -108.6], [221.9, -93.2], [153.7, -94.5], [153.6, -109.6], [156.2, -109.6], [156.0, -120.2], [136.1, -120.0], [136.2, -109.7], [144.3, -109.8], [144.4, -94.4], [66.0, -94.5], [65.8, -109.6], [68.4, -109.6], [68.3, -120.2], [48.4, -120.0], [48.4, -109.7], [56.5, -109.7], [56.7, -94.4], [51.6, -95.1], [44.1, -97.5], [37.9, -102.3], [33.1, -107.9], [28.8, -114.8], [26.9, -122.4], [25.5, -152.6], [13.6, -152.3], [13.0, -161.6], [-51.9, -161.7], [-51.8, -153.7], [-64.0, -153.9], [-64.1, -132.0], [-64.7, -121.5], [-67.0, -113.9], [-72.0, -106.2], [-77.8, -101.0], [-84.9, -97.2], [-91.4, -95.0], [-138.3, -95.5], [-138.5, -110.6], [-135.9, -110.6], [-136.0, -121.1], [-156.0, -121.0], [-155.9, -110.6], [-147.8, -110.7], [-147.7, -95.4], [-224.1, -94.5], [-224.2, -109.6], [-221.7, -109.6], [-221.8, -120.2], [-241.3, -120.0], [-241.6, -109.7], [-233.5, -109.8], [-233.4, -94.4], [-300.7, -94.5], [-300.8, -109.6], [-298.3, -109.6], [-298.4, -120.2], [-318.3, -120.0], [-318.2, -109.7], [-310.1, -109.7], [-310.0, -94.4], [-377.2, -94.6], [-377.3, -109.7], [-374.8, -109.7], [-374.9, -120.3], [-394.8, -120.1], [-394.8, -109.8], [-386.6, -109.8], [-386.5, -94.5], [-453.6, -94.5], [-453.7, -109.6], [-451.2, -109.6], [-451.3, -120.2], [-471.2, -120.0], [-471.1, -109.7], [-463.0, -109.7], [-462.9, -94.4], [-466.4, -94.2], [-466.2, -53.8], [-421.9, -53.8], [-421.8, -41.8], [-428.1, -41.8], [-428.1, -31.5], [-418.6, -31.2], [-408.2, -31.5], [-408.3, -41.9], [-416.3, -41.9], [-416.4, -53.8], [-378.9, -53.8], [-378.9, -41.8], [-385.2, -41.8], [-385.2, -31.5], [-365.4, -31.6], [-365.4, -41.9], [-373.4, -41.9], [-373.3, -53.8], [-335.6, -53.8], [-335.5, -41.6], [-341.9, -41.6], [-341.8, -31.3], [-322.0, -31.3], [-322.0, -41.7], [-330.1, -41.7], [-329.9, -53.8], [-292.8, -53.7], [-292.8, -41.8], [-299.1, -41.8], [-299.1, -31.5], [-279.2, -31.6], [-279.2, -42.0], [-287.3, -42.0], [-287.4, -53.7], [-247.5, -53.7], [-247.4, -41.7], [-253.8, -41.6], [-253.8, -31.4], [-233.9, -31.4], [-233.9, -41.8], [-242.0, -41.8], [-242.0, -53.7], [-56.9, -53.6], [-49.8, -52.4], [-45.4, -48.5], [-42.7, -43.1], [-42.6, -10.5], [-107.8, -12.2], [-106.7, 99.3], [-105.8, 148.0], [-104.4, 188.8]]
/** The garden court between the MTB and the pier (inner way 463735060). */
export const T1_COURT: XY[] = [[84.4, -11.4], [8.7, -11.7], [9.8, -40.5], [11.9, -46.0], [16.3, -49.5], [20.8, -52.3], [27.8, -53.5], [84.4, -53.2]]

// the unit grid, fitted to the curb row's mapped tips
const UX = 38.45, UY = 38.4, GX0 = -178.6
const MTB_Y0 = 189.5 - 5 * UY // −2.5
export const T1_SHELL: Shell = { z0: 23, z1: 35, m: 0.85, q: 0.6, p: 1.15, th: 1.2, floor: 12 }
const PIER = { x0: -466.2, x1: 442.2, y0: -94.4, y1: -53.6, base: 6, eave: 17, crown: 21.5 }

function buildT1(detail: boolean) {
  const M = newMats(MATS)
  // --- the 39 roof units: 6 × 5 over the hall, 9 × 1 over the curb
  const cells: Cell[] = []
  for (let i = 2; i < 8; i++) for (let j = 0; j < 5; j++) cells.push({ cx: GX0 + UX * (i + 0.5), cy: MTB_Y0 + UY * (j + 0.5), hx: UX / 2, hy: UY / 2 })
  const curbY0 = 189.5, curbH = 229.3 - 189.5
  for (let i = 0; i < 9; i++) cells.push({ cx: GX0 + UX * (i + 0.5), cy: curbY0 + curbH / 2, hx: UX / 2, hy: curbH / 2 })
  const hallX0 = GX0 + 2 * UX, hallX1 = GX0 + 8 * UX
  // glass walls just inside the eave, behind the columns, rising into the arches
  const inset = 4.5
  const wall: XY[] = [[hallX0 + inset, MTB_Y0 + inset], [hallX1 - inset, MTB_Y0 + inset], [hallX1 - inset, curbY0 - inset], [hallX0 + inset, curbY0 - inset]]
  // columns: every corner on the hall's eaves and under the curb row (the
  // ones inside the hall are hidden by its glass, so only the detail model has them)
  const onEave = (q: XY) => q[1] > curbY0 - 1 || Math.abs(q[0] - hallX0) < 1 || Math.abs(q[0] - hallX1) < 1 || Math.abs(q[1] - MTB_Y0) < 1
  umbrellas(M, cells, T1_SHELL, { n: detail ? 8 : 4, ns: detail ? 8 : 0, sky: detail ? 4 : 1, colSeg: detail ? 14 : 6, columns: detail ? undefined : onEave, colFloor: (q) => (q[1] > curbY0 - 1 ? 0 : T1_SHELL.floor) })

  // soffit height under the hall roof at a plan point
  const soffitAt = (q: XY) => {
    const c = cells.find((k) => Math.abs(q[0] - k.cx) <= k.hx + 1e-6 && Math.abs(q[1] - k.cy) <= k.hy + 1e-6)
    if (!c) return T1_SHELL.z0
    return shellZ(T1_SHELL, (q[0] - c.cx) / c.hx, (q[1] - c.cy) / c.hy) - 0.15
  }
  glassWalls(M, wall, T1_SHELL.floor, soffitAt, detail ? 4.8 : 9.6, detail ? 9.6 : 0)

  // --- the podium under the hall: grey panels with broad window groups
  const pod: XY[] = [[hallX0 + 3, -12.2], [hallX1 - 3, -12.2], [hallX1 - 3, curbY0 - 3], [hallX0 + 3, curbY0 - 3]]
  ringWalls(M.panel, pod, 0, T1_SHELL.floor)
  // the podium's top shows only between its edge and the glass: a ring, not a floor
  capHoles(M.panel, pod, [wall], T1_SHELL.floor)
  bands(M.win, pod, 6.4, 10.4, 19.2, 3.2)
  bands(M.win, pod, 1.2, 4.2, 19.2, 3.2, 0.06, (a, b) => Math.abs(a[1] - b[1]) < 1 && a[1] > 100) // ground floor glazing except the landside

  // --- the apron level of the whole outline (pier, gate stubs, link, centre)
  ringWalls(M.panel, T1_OUTLINE, 0, PIER.base)
  holeWalls(M.panel, T1_COURT, 0, 15)
  const inPier = (q: XY) => q[0] > PIER.x0 - 0.5 && q[0] < PIER.x1 + 0.5 && q[1] > PIER.y0 - 0.6 && q[1] < PIER.y1 + 0.6
  capStubs(M.roof, T1_OUTLINE, PIER.base, (q) => inPier(q) || (q[0] > -110 && q[0] < 136 && q[1] > -55) || (q[0] > -66 && q[0] < 29 && q[1] < -94))

  // --- the airside link between the MTB and the pier: flat, 15 m
  const link: XY[] = [[-42.6, -12.2], [-42.7, -43.1], [-45.4, -48.5], [-49.8, -52.4], [-56.9, -53.6], [110.2, -53.6], [110.3, -16.0], [106.8, -12.2]]
  ringWalls(M.win, link, PIER.base, 14)
  ringWalls(M.panel, link, 14, 15)
  holeWalls(M.win, T1_COURT, PIER.base, 14)
  capHoles(M.roof, link, [T1_COURT], 15)

  // --- the contact pier: glass walls under a low vault
  const pw: XY[] = [[PIER.x0, PIER.y0], [PIER.x1, PIER.y0], [PIER.x1, PIER.y1], [PIER.x0, PIER.y1]]
  glassWalls(M, pw, PIER.base, () => PIER.eave - 0.9, detail ? 6 : 60, detail ? 6.4 : 0)
  pierVault(M, PIER.x0, PIER.x1, PIER.y0, PIER.y1, PIER.eave, PIER.crown, 4.5, detail ? 12 : 6, undefined, [true, true], 22)
  // gate holdroom windows on the apron level
  bands(M.win, pw, 1.4, 4.6, 12, 4)

  // --- the pier centre ("KLIA PTC+Tower.jpg"): a glazed block whose roof
  // sweeps up from both sides into two pointed tips beside a central
  // pointed gable with skylights on its slopes
  const xc = -18.5
  const wingZ = (x: number) => {
    const d = Math.abs(x - xc)
    if (d < 12) return 22
    return 21.6 + 9.4 * Math.max(0, (44 - d) / 32) ** 2.2
  }
  const wy0 = -164, wy1 = -92
  const xs = Array.from({ length: (detail ? 28 : 14) + 1 }, (_, i) => xc - 46 + (92 * i) / (detail ? 28 : 14))
  // the tips sit at |x − xc| = 9.5: make sure a sample lands there
  for (const t of [xc - 12, xc + 12, xc - 11.99, xc + 11.99]) xs.push(t)
  xs.sort((p, q) => p - q)
  const wN = (x: number): V3 => { const e = 0.05; return unit([-(wingZ(x + e) - wingZ(x - e)) / (2 * e), 0, 1]) }
  for (let i = 0; i < xs.length - 1; i++) {
    const x0 = xs[i], x1 = xs[i + 1]
    if (x1 - x0 < 0.02) continue
    const th = 0.9
    quadN(M.roof, [x0, wy0, wingZ(x0)], [x1, wy0, wingZ(x1)], [x1, wy1, wingZ(x1)], [x0, wy1, wingZ(x0)], [wN(x0), wN(x1), wN(x1), wN(x0)])
    if (detail) quadN(M.soffit, [x0, wy0, wingZ(x0) - th], [x0, wy1, wingZ(x0) - th], [x1, wy1, wingZ(x1) - th], [x1, wy0, wingZ(x1) - th])
    for (const [y, sg] of [[wy0, -1], [wy1, 1]] as [number, number][]) {
      const n: V3 = [0, sg, 0]
      quadN(M.roof, [x0, y, wingZ(x0) - th], [x1, y, wingZ(x1) - th], [x1, y, wingZ(x1)], [x0, y, wingZ(x0)], [n, n, n, n])
    }
  }
  // the centre unit between the tips: one smaller shell unit, its pointed
  // eave arch facing the apron
  const cS: Shell = { z0: 21.5, z1: 31.5, m: 0.68, q: 0.6, p: 1.15, th: 1.0, floor: PIER.base }
  const cu: Cell = { cx: xc, cy: -149.5, hx: 13.5, hy: 14.5 }
  umbrellas(M, [cu], cS, { n: detail ? 8 : 4, ns: detail ? 8 : 0, sky: detail ? 4 : 1, colSeg: detail ? 14 : 6, columns: () => false })
  const inCU = (q: XY) => Math.abs(q[0] - cu.cx) <= cu.hx && Math.abs(q[1] - cu.cy) <= cu.hy
  const cb: XY[] = [[-62, -160.5], [25, -160.5], [25, -95], [-62, -95]]
  glassWalls(M, cb, PIER.base, (q) => (inCU(q) ? shellZ(cS, (q[0] - cu.cx) / cu.hx, (q[1] - cu.cy) / cu.hy) - 0.2 : wingZ(q[0]) - 1.8), detail ? 3 : 6, detail ? 6.4 : 0)
  capPoly(M.panel, cb, 21.2)

  return materials(M, !detail)
}

if (import.meta.main) {
  const extras = { bearing: BEARING, osm: 'relation/6848621', height: T1_SHELL.z1 + T1_SHELL.th }
  writeLod('KLIA Terminal 1 (Main Terminal Building and Contact Pier)', 'kl-klia-terminal-1.glb', buildT1(false), extras, 8000, Number(process.env.KLMAX ?? 250_000))
  writeLod('KLIA Terminal 1 (Main Terminal Building and Contact Pier)', 'kl-klia-terminal-1.detail.glb', buildT1(true), extras, 40_000, 1_500_000)
}
