/**
 * Flatiron Building (English-American Building), Atlanta (1897, Bradford
 * Gilbert) — original procedural geometry, CC0-1.0.
 * bun generators/atl-flatiron-building.ts
 *
 * This file also holds the small kit the other B4 Atlanta models import
 * (atl-candler-building, atl-hurt-building, atl-georgia-pacific-tower,
 * atl-equitable-building, atl-central-library): plan rings, prisms with a
 * bevelled top, projecting cornices, window panels grouped across storeys,
 * and the GLB writer wrapper with the budget checks. The Flatiron's own
 * build runs only when this file is run directly.
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Bearing 0: the plan is OSM's own outline. Anchor = centroid of
 * OSM way/270497379 (building=commercial, height 44, 11 levels, named
 * "FlatironCity"), 33.755874, -84.388916. The National Register lists it
 * as the English-American Building, 74 Peachtree Street, at the fork of
 * Peachtree and Broad Streets.
 *
 * Identity: Atlanta's oldest standing skyscraper, a white-painted
 * eleven-storey wedge. Three sides: the long Peachtree (east) and Broad
 * (west) fronts meet at a narrow flat tip at the north fork, one window
 * wide between pilasters; the south (Luckie Street) end is short, with a
 * round bowed corner on the south-east. Shallow bowed oriel bays run up
 * both long fronts from the third floor to a heavy projecting cornice
 * under the top two storeys, which carry a lighter cornice of their own.
 * The ground and mezzanine floors on Peachtree are a two-storey colonnade
 * of Ionic columns; the base is painted a light grey.
 *
 * Evidence:
 *  - plan: OSM way/270497379, used as drawn (the south-east round corner is
 *    in the outline). The lidar footprint agrees within about a metre.
 *  - heights: USGS 3DEP lidar GA_Statewide_B2_2018 (2018 flight), 0.5 m
 *    grid, above ground_min 320.19 m; the street round the building is
 *    0.4–0.9 m above that. Measured: roof 44.6–46 m (45.5 used, from the
 *    street), the main cornice ledge 36.3–36.4 m, a small bulkhead 50.5 m
 *    (left out: it is the stair/flag base and does not read). Published:
 *    11 storeys (NRHP; Wikipedia).
 *  - base and bays: storey heights scaled from the Merlin photos (ground +
 *    mezzanine colonnade to about 9 m; eight shaft storeys to the cornice;
 *    two attic storeys over it). Bay count per front from the photos:
 *    seven on Peachtree, seven on Broad, two on the south end.
 *  - ground: Mapterhorn is flat here (0.0–1.1 m across 50 m); elevation 0.
 *  - colour: white paint (all photos), pulled a little warm-grey so it is
 *    not the plain palette white; the base storey light grey.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Atlanta’s Flatiron Building viewed from Woodruff Park.jpg, Marc Merlin,
 *    CC BY-SA 4.0 (from the south-east: the round corner, the Peachtree
 *    colonnade, the bays and cornices)
 *    https://commons.wikimedia.org/wiki/File:Atlanta%E2%80%99s_Flatiron_Building_viewed_from_Woodruff_Park.jpg
 *  - Flatiron Building (Atlanta) edge-on from the corner of Peachtree and
 *    Luckie Streets.jpg, Marc Merlin, CC BY-SA 4.0 (the north tip end-on)
 *    https://commons.wikimedia.org/wiki/File:Flatiron_Building_(Atlanta)_edge-on_from_the_corner_of_Peachtree_and_Luckie_Streets.jpg
 *  - Flatiron Building, ATL.jpg, JJonahJackalope, CC BY-SA 4.0 (the tip and
 *    the west front from the north-west)
 *    https://commons.wikimedia.org/wiki/File:Flatiron_Building,_ATL.jpg
 *  - Flatiron Building (Atlanta) on a cloudy day.jpg, Marc Merlin, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:Flatiron_Building_(Atlanta)_on_a_cloudy_day.jpg
 *  - Flatiron Building Atlanta.jpg, dbking, CC BY 2.0
 *    https://commons.wikimedia.org/wiki/File:Flatiron_Building_Atlanta.jpg
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the bays are drawn as three-sided prisms (the real ones are
 * bowed); the fine window frames, the dentils and the flagpole are left
 * out; the columns are drawn on the Peachtree front only, as in the photos.
 */
import { Part, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

// ─────────────────────────────────── kit ───────────────────────────────────

export type XY = [number, number]
export const TAU = Math.PI * 2

export const circle = (c: XY, r: number, n: number, phase = 0): XY[] =>
  Array.from({ length: n }, (_, i) => {
    const a = phase + (i / n) * TAU
    return [c[0] + r * Math.cos(a), c[1] + r * Math.sin(a)] as XY
  })
export const at = (ring: XY[], z: number): V3[] => ring.map(([x, y]) => [x, y, z])

/** Signed area; positive for a counter-clockwise ring. */
export const area = (ring: XY[]) => ring.reduce((s, p, i) => {
  const q = ring[(i + 1) % ring.length]
  return s + p[0] * q[1] - q[0] * p[1]
}, 0) / 2
export const ccw = (ring: XY[]) => (area(ring) < 0 ? [...ring].reverse() : ring)

/** Lon/lat (OSM order) to the model's plan frame about an anchor, turned to a bearing. */
export function toFrame(coords: XY[], anchor: { lng: number; lat: number }, bearing = 0): XY[] {
  const kx = 111320 * Math.cos((anchor.lat * Math.PI) / 180), ky = 110540, b = (bearing * Math.PI) / 180
  const pts = coords.map(([lng, lat]) => {
    const e = (lng - anchor.lng) * kx, n = (lat - anchor.lat) * ky
    return [e * Math.cos(b) - n * Math.sin(b), e * Math.sin(b) + n * Math.cos(b)] as XY
  })
  const last = pts[pts.length - 1], first = pts[0]
  if (Math.hypot(last[0] - first[0], last[1] - first[1]) < 0.01) pts.pop()
  return ccw(pts)
}

/** Split long edges into pieces of at most `step` metres (for terrain fitting). */
export const split = (ring: XY[], step = 5): XY[] => ring.flatMap((a, i) => {
  const b = ring[(i + 1) % ring.length], L = Math.hypot(b[0] - a[0], b[1] - a[1]), k = Math.max(1, Math.ceil(L / step))
  return Array.from({ length: k }, (_, j) => [a[0] + ((b[0] - a[0]) * j) / k, a[1] + ((b[1] - a[1]) * j) / k] as XY)
})

/** A vertical flat-shaded wall round a counter-clockwise ring. */
export function wall(p: Part, ring: XY[], z0: number, z1: number) {
  p.loft([at(ring, z0), at(ring, z1)])
}

/** A vertical wall with smooth horizontal normals, for round drums. */
export function smoothWall(p: Part, ring: XY[], z0: number, z1: number, closed = true) {
  const n = ring.length
  const nrm = ring.map((q, i) => {
    const a = ring[closed ? (i - 1 + n) % n : Math.max(0, i - 1)], b = ring[closed ? (i + 1) % n : Math.min(n - 1, i + 1)]
    const ex = b[0] - a[0], ey = b[1] - a[1], l = Math.hypot(ex, ey) || 1
    return [ey / l, -ex / l, 0] as V3
  })
  for (let i = 0; i < (closed ? n : n - 1); i++) {
    const j = (i + 1) % n
    const a: V3 = [ring[i][0], ring[i][1], z0], b: V3 = [ring[j][0], ring[j][1], z0]
    const c: V3 = [ring[j][0], ring[j][1], z1], d: V3 = [ring[i][0], ring[i][1], z1]
    p.tri(a, b, c, undefined, undefined, undefined, [nrm[i], nrm[j], nrm[j]])
    p.tri(a, c, d, undefined, undefined, undefined, [nrm[i], nrm[j], nrm[i]])
  }
}

/** A flat cap over any simple counter-clockwise polygon (ear clipping). */
export function capPoly(p: Part, ring: XY[], z: number, up: boolean) {
  const idx = ring.map((_, i) => i)
  const cr = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inside = (q: XY, a: XY, b: XY, c: XY) => cr(a, b, q) > 1e-9 && cr(b, c, q) > 1e-9 && cr(c, a, q) > 1e-9
  const emit = (a: XY, b: XY, c: XY) => {
    const A: V3 = [a[0], a[1], z], B: V3 = [b[0], b[1], z], C: V3 = [c[0], c[1], z]
    if (up) p.tri(A, B, C)
    else p.tri(A, C, B)
  }
  let guard = 0
  while (idx.length > 3 && guard++ < 10000) {
    let cut = false
    for (let k = 0; k < idx.length; k++) {
      const ia = idx[(k - 1 + idx.length) % idx.length], ib = idx[k], ic = idx[(k + 1) % idx.length]
      const a = ring[ia], b = ring[ib], c = ring[ic]
      if (cr(a, b, c) <= 1e-9) continue
      if (idx.some((j) => j !== ia && j !== ib && j !== ic && inside(ring[j], a, b, c))) continue
      emit(a, b, c)
      idx.splice(k, 1)
      cut = true
      break
    }
    if (!cut) {
      // Only collinear points left: drop one and go on.
      idx.splice(0, 1)
    }
  }
  if (idx.length === 3) emit(ring[idx[0]], ring[idx[1]], ring[idx[2]])
}

/** The flat ring between two rings of the same count, facing up or down. */
export function ledge(p: Part, outer: XY[], inner: XY[], z: number, up = true) {
  const n = outer.length
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    const a: V3 = [inner[i][0], inner[i][1], z], b: V3 = [outer[i][0], outer[i][1], z]
    const c: V3 = [outer[j][0], outer[j][1], z], d: V3 = [inner[j][0], inner[j][1], z]
    if (up) p.quad(a, b, c, d)
    else p.quad(a, d, c, b)
  }
}

const norm2 = (v: XY): XY => {
  const l = Math.hypot(v[0], v[1]) || 1
  return [v[0] / l, v[1] / l]
}

/** A mitred offset of a counter-clockwise ring; d > 0 grows it. */
export function offset(ring: XY[], d: number): XY[] {
  const n = ring.length
  return ring.map((q, i) => {
    const a = ring[(i - 1 + n) % n], b = ring[(i + 1) % n]
    const e1 = norm2([q[0] - a[0], q[1] - a[1]]), e2 = norm2([b[0] - q[0], b[1] - q[1]])
    const n1: XY = [e1[1], -e1[0]], n2: XY = [e2[1], -e2[0]]
    const m = norm2([n1[0] + n2[0], n1[1] + n2[1]])
    const k = d / Math.max(0.3, m[0] * n1[0] + m[1] * n1[1])
    return [q[0] + m[0] * k, q[1] + m[1] * k] as XY
  })
}

/**
 * A solid prism over a counter-clockwise ring with a small chamfer at the
 * top edge (STYLE.md's bevel), its roof in `top`. `bottom` closes the
 * underside too (for anything that overhangs).
 */
export function prism(p: Part, ring: XY[], z0: number, z1: number, top: Part | null = p, bev = 0.45, bottom = false) {
  const b = Math.min(bev, (z1 - z0) / 2)
  const inner = offset(ring, -b)
  wall(p, ring, z0, z1 - b)
  if (b > 0) p.loft([at(ring, z1 - b), at(inner, z1)])
  if (top) capPoly(top, b > 0 ? inner : ring, z1, true)
  if (bottom) capPoly(p, ring, z0, false)
}

/** A box between two plan corners with a chamfered top edge. */
export function box(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, top: Part | null = p, bev = 0.4, bottom = false) {
  prism(p, [[x0, y0], [x1, y0], [x1, y1], [x0, y1]], z0, z1, top, bev, bottom)
}

/**
 * A cornice band round a ring: it projects `out` metres, `h` tall, with a
 * chamfered underside (so it reads as a moulding, not a slab) and a
 * chamfered top. The top is capped in `top`.
 */
export function cornice(p: Part, ring: XY[], z: number, h: number, out: number, top: Part | null = p) {
  const o = offset(ring, out), c = Math.min(out, h * 0.45)
  const mid = offset(ring, out - c)
  // underside: from the wall out to the full projection, sloping up
  p.loft([at(ring, z), at(o, z + c)])
  wall(p, o, z + c, z + h - 0.25)
  p.loft([at(o, z + h - 0.25), at(offset(ring, out - 0.25), z + h)])
  if (top) capPoly(top, offset(ring, out - 0.25), z + h, true)
  void mid
}

export type PanelOpts = {
  /** Height of a panel group (two or three storeys) and the spandrel between groups. */
  group: number
  gap: number
  /** Target bay width and the pier between bays. */
  bay: number
  pier: number
  /** Plain wall kept at each end of a face. */
  margin: number
  /** How far the panel stands off the wall. */
  out?: number
  /** Skip faces shorter than this. */
  min?: number
}

/**
 * Window panels on one wall, from plan point a to b, the wall's outside to
 * the right of a→b (as for a counter-clockwise ring's edge): bays of about
 * `bay` metres with piers between, in bands of `group` metres with a `gap`
 * spandrel between bands — the grouped panels STYLE.md asks for.
 */
export function edgePanels(p: Part, a: XY, b: XY, z0: number, z1: number, o: PanelOpts) {
  const out = o.out ?? 0.05
  const bands = Math.max(1, Math.round((z1 - z0) / o.group))
  const gh = (z1 - z0) / bands
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  const use = L - 2 * o.margin
  if (L < (o.min ?? 2) || use < 0.8) return
  const t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], nn: XY = [t[1], -t[0]]
  const bays = Math.max(1, Math.round(use / o.bay)), w = use / bays
  for (let k = 0; k < bays; k++) {
    const s0 = o.margin + k * w + (k ? o.pier / 2 : 0), s1 = o.margin + (k + 1) * w - (k < bays - 1 ? o.pier / 2 : 0)
    if (s1 - s0 < 0.5) continue
    const P = (s: number, z: number): V3 => [a[0] + t[0] * s + nn[0] * out, a[1] + t[1] * s + nn[1] * out, z]
    for (let g = 0; g < bands; g++) {
      const za = z0 + g * gh + o.gap / 2, zb = z0 + (g + 1) * gh - o.gap / 2
      p.quad(P(s0, za), P(s1, za), P(s1, zb), P(s0, zb))
    }
  }
}

/** Window panels on every face of a counter-clockwise ring. */
export function panels(p: Part, ring: XY[], z0: number, z1: number, o: PanelOpts) {
  for (let i = 0; i < ring.length; i++) edgePanels(p, ring[i], ring[(i + 1) % ring.length], z0, z1, o)
}

/** A point `s` metres along a→b and `d` metres out to its right. */
export function along(a: XY, b: XY, s: number, d = 0): XY {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
  return [a[0] + t[0] * s + t[1] * d, a[1] + t[1] * s - t[0] * d]
}

/** A vertical round column (or engaged half column with `half`) of radius r. */
export function column(p: Part, c: XY, r: number, z0: number, z1: number, n = 10) {
  smoothWall(p, circle(c, r, n), z0, z1)
}

/** Write the GLB with the budget checks every model here shares. */
export async function save(id: string, name: string, parts: Array<{ part: Part; material: MaterialSpec }>, extras: Record<string, unknown>, maxTriangles = 5000) {
  const used = parts.filter((p) => p.part.triangles > 0)
  const triangles = used.reduce((s, p) => s + p.part.triangles, 0)
  if (used.length > 6) throw new Error(`${id}: ${used.length} materials`)
  if (triangles > maxTriangles) throw new Error(`${id}: ${triangles} triangles`)
  const glb = writeGlb(name, used, { license: 'CC0-1.0', frame: 'Y up, -Z north, +X east; metres; origin at the ground anchor', ...extras })
  if (glb.length > 250000) throw new Error(`${id}: ${glb.length} bytes`)
  const out = new URL(`../models/${id}.glb`, import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(used.map((p) => `${p.material.name}: ${p.part.triangles}`).join(', '))
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}

// ─────────────────────────────── the Flatiron ──────────────────────────────

if (import.meta.main) {
  const ANCHOR = { lng: -84.388916, lat: 33.755874 }
  const body = new Part(), base = new Part(), win = new Part(), roof = new Part()

  // OSM way/270497379 in the frame (bearing 0, about the anchor).
  const R = ccw([[13.64, 20.64], [17.08, 17.94], [0.20, -16.15], [-0.28, -16.81], [-0.90, -17.37], [-1.61, -17.80], [-2.39, -18.08], [-3.22, -18.18], [-4.04, -18.11], [-4.85, -17.90], [-5.59, -17.51], [-17.35, -3.91]])
  // The faces, each from left to right as seen from outside.
  const SW: [XY, XY] = [[-17.35, -3.91], [-5.59, -17.51]] // Luckie Street end
  const ARC: XY[] = [[-5.59, -17.51], [-4.85, -17.90], [-4.04, -18.11], [-3.22, -18.18], [-2.39, -18.08], [-1.61, -17.80], [-0.90, -17.37], [-0.28, -16.81], [0.20, -16.15]]
  const E: [XY, XY] = [[0.20, -16.15], [17.08, 17.94]] // Peachtree Street
  const TIP: [XY, XY] = [[17.08, 17.94], [13.64, 20.64]] // the north fork
  const NW: [XY, XY] = [[13.64, 20.64], [-17.35, -3.91]] // Broad Street

  const BASE = 9.2, CORN = 36.3, TOP = 45.5

  // ── Massing: the base storeys in grey, the white shaft and attic. ──
  const bring = split(R, 5)
  wall(base, bring, 0, BASE)
  prism(body, R, BASE, TOP, roof, 0.4)
  // A belt course over the base, the heavy main cornice and the attic cornice.
  cornice(body, R, BASE, 0.8, 0.35, body)
  cornice(body, R, CORN, 1.4, 1.1, body)
  cornice(body, offset(R, -0.4), TOP - 0.9, 0.9, 0.85, roof)
  // A low parapet on the roof, so the roof edge reads as the cornice top.

  // ── The oriel bays on the long fronts and the south end. ──
  const D = 0.6 // how far a bay stands out
  function bays(a: XY, b: XY, ss: number[], w: number) {
    for (const s of ss) {
      const p0 = along(a, b, s - w / 2), p1 = along(a, b, s - w / 2 + D, D), p2 = along(a, b, s + w / 2 - D, D), p3 = along(a, b, s + w / 2)
      // The bay as a prism: its back edge lies on the wall.
      const ring = ccw([p0, p1, p2, p3])
      prism(body, ring, BASE + 0.8, CORN, null, 0)
      // Its windows: three bands on the front, across the shaft's eight storeys.
      edgePanels(win, p1, p2, BASE + 1.2, CORN - 0.4, { group: 9, gap: 1.3, bay: 9, pier: 0, margin: 0.25, min: 0.5 })
      // The attic above it: flat panels in line with the bay.
      edgePanels(win, along(a, b, s - w / 2 + 0.4), along(a, b, s + w / 2 - 0.4), CORN + 1.8, TOP - 1.4, { group: 7, gap: 0.8, bay: 9, pier: 0, margin: 0 })
    }
  }
  const Le = Math.hypot(E[1][0] - E[0][0], E[1][1] - E[0][1]), Ln = Math.hypot(NW[1][0] - NW[0][0], NW[1][1] - NW[0][1])
  const spread = (L: number, n: number, m0: number, m1: number) => Array.from({ length: n }, (_, i) => m0 + ((L - m0 - m1) * (i + 0.5)) / n)
  bays(E[0], E[1], spread(Le, 7, 1.0, 3.2), 3.7)
  bays(NW[0], NW[1], spread(Ln, 7, 3.2, 2.0), 3.7)
  bays(SW[0], SW[1], spread(18, 2, 2.0, 1.0), 3.7)

  // The round corner: one bowed window band per group, following the curve.
  function curvePanels(pts: XY[], z0: number, z1: number, group: number, gap: number, out = 0.05) {
    const bands = Math.max(1, Math.round((z1 - z0) / group)), gh = (z1 - z0) / bands
    const n = pts.map((q, i) => {
      const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)]
      const t = norm2([b[0] - a[0], b[1] - a[1]])
      return [t[1], -t[0]] as XY
    })
    const P = (i: number, z: number): V3 => [pts[i][0] + n[i][0] * out, pts[i][1] + n[i][1] * out, z]
    const N = (i: number): V3 => [n[i][0], n[i][1], 0]
    for (let g = 0; g < bands; g++) {
      const za = z0 + g * gh + gap / 2, zb = z0 + (g + 1) * gh - gap / 2
      for (let i = 1; i < pts.length - 2; i++) {
        win.tri(P(i, za), P(i + 1, za), P(i + 1, zb), undefined, undefined, undefined, [N(i), N(i + 1), N(i + 1)])
        win.tri(P(i, za), P(i + 1, zb), P(i, zb), undefined, undefined, undefined, [N(i), N(i + 1), N(i)])
      }
    }
  }
  curvePanels(ARC, BASE + 1.2, CORN - 0.4, 9, 1.3)
  curvePanels(ARC, CORN + 1.8, TOP - 1.4, 7, 0.8)

  // The north tip: one window column between its corner pilasters.
  edgePanels(win, TIP[0], TIP[1], BASE + 1.2, CORN - 0.4, { group: 9, gap: 1.3, bay: 9, pier: 0, margin: 1.3 })
  edgePanels(win, TIP[0], TIP[1], CORN + 1.8, TOP - 1.4, { group: 7, gap: 0.8, bay: 9, pier: 0, margin: 1.3 })

  // ── The base: shop windows, and the Peachtree colonnade. ──
  const shop: PanelOpts = { group: 9, gap: 1.6, bay: 3.2, pier: 1.0, margin: 1.0 }
  edgePanels(win, SW[0], SW[1], 0.6, BASE, shop)
  edgePanels(win, NW[0], NW[1], 0.6, BASE, shop)
  edgePanels(win, E[0], E[1], 0.6, BASE, { ...shop, bay: 3.1, pier: 0.4 })
  curvePanels(ARC, 0.6, BASE - 0.8, 9, 0)
  // Ten two-storey columns along Peachtree, standing half out of the wall.
  for (let k = 0; k < 10; k++) {
    const s = 7.0 + k * ((Le - 9.0) / 9)
    column(body, along(E[0], E[1], s, 0.15), 0.45, 0, BASE, 10)
  }

  // Floodlight: none; the windows glow.
  await save('atl-flatiron-building', 'Flatiron Building', [
    { part: body, material: finish('flatiron-atl-paint', 0xece8e0) },
    { part: base, material: finish('flatiron-atl-base', 0xc6c7c3) },
    { part: win, material: PALETTE.window },
    { part: roof, material: PALETTE.roof },
  ], { height: TOP, anchor: [ANCHOR.lat, ANCHOR.lng], bearing: 0 })
}
