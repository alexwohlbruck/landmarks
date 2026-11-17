/**
 * Westin Peachtree Plaza, Atlanta (1976, John Portman & Associates) —
 * original procedural geometry, CC0-1.0.
 * bun generators/atl-westin-peachtree-plaza.ts
 *
 * This file also holds the small kit the other B2 Atlanta towers import
 * (atl-truist-plaza, atl-191-peachtree-tower, atl-marriott-marquis,
 * atl-hyatt-regency): round and polygon walls, caps, window panels grouped
 * across storeys (`panels`, `edgePanels`, `roundPanels`), boxes and prisms
 * with bevelled tops, and the GLB writer wrapper with the budget checks. The Westin's own build runs
 * only when this file is run directly.
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = centroid of the hotel outline OSM way/42904130 (the
 * podium and tower), 33.759437, -84.388375. Bearing 0: the podium's long
 * sides run east-west and the tower is round. The tower's centre is the
 * centroid of the round part way/192939493, 18.1 m west and 0.4 m south of
 * the anchor.
 *
 * Identity: a plain 220 m cylinder of mirror blue-grey glass, the tallest
 * hotel in the hemisphere when it opened. At the top a darker glass band
 * (the revolving Sun Dial restaurant and bar, floors 71–73) under a flat
 * roof with a tall mast; a single glass-and-aluminium lift shaft runs up the
 * east-north-east side (OSM's bump in the round outline) to the roof; at the
 * foot, a drum of pale concrete rings where the cylinder meets the pale
 * concrete podium that fills the block between Spring Street and Peachtree
 * Street.
 *
 * Evidence:
 *  - plan: OSM way/192939493, a 19.0–20.0 m radius circle with the lift
 *    shaft bump at bearing ≈ 56°, 21 m out, 3.3 m in radius; podium outline
 *    way/42904130 as drawn (the west side follows Spring Street's slant).
 *  - heights: USGS 3DEP lidar GA_Statewide_B2_2018 (2018 flight), 1 m grid,
 *    measured above the street on the north side (International Blvd,
 *    about 320 m): roof rim 215–217 m, roof centre 221 m; the lift shaft
 *    reaches 221 m; the concrete drum round the base 44 m; the podium roofs
 *    35 m (west end), 28–31 m (middle), 32–37 m (east). Published height
 *    220 m, 73 floors (Wikipedia; OSM height 220.37). Mast ≈ 33 m (to
 *    254 m), scaled from Robert Neff's photo (estimate; it is too thin for
 *    the lidar).
 *  - restaurant band 205–216 m: scaled from the Neff and LeMay photos
 *    (≈ one third of the tower's width tall), estimate.
 *  - colour: mirror glass that reads sky blue-grey in every daylight photo
 *    (a light windowVariant, as STYLE.md asks for reflective glass), a
 *    darker grey-blue band at the top, pale buff concrete podium and drum,
 *    silver lift shaft and mast.
 *  - y = 0 is the lowest ground under the podium (its west end on Spring
 *    Street, Mapterhorn ≈ 318.7 m); the ground rises about 4 m to the
 *    east, where the podium walls sink into it. Elevation 0.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Westin Peachtree Plaza Atlanta.jpg, Robert Neff, CC BY 2.0 (from the
 *    west, Centennial Olympic Park; the top band and mast)
 *    https://commons.wikimedia.org/wiki/File:Westin_Peachtree_Plaza_Atlanta.jpg
 *  - Westin Peachtree Plaza Hotel viewed from Freedom Parkway in
 *    Atlanta.jpg, Marc Merlin, CC BY-SA 4.0 (from the east; the lift shaft)
 *    https://commons.wikimedia.org/wiki/File:Westin_Peachtree_Plaza_Hotel_viewed_from_Freedom_Parkway_in_Atlanta.jpg
 *  - Westin Peachtree Plaza Hotel, 191 Peachtree Tower.jpg, AAK, public
 *    domain (from the south-west; the lift shaft on the east side)
 *    https://commons.wikimedia.org/wiki/File:Westin_Peachtree_Plaza_Hotel,_191_Peachtree_Tower.jpg
 *  - Westin Peachtree Plaza Hotel, Atlanta, GA (47421274332).jpg, Warren
 *    LeMay, CC0 (from Peachtree Street; podium, drum and lift strip)
 *    https://commons.wikimedia.org/wiki/File:Westin_Peachtree_Plaza_Hotel,_Atlanta,_GA_(47421274332).jpg
 *  - Westin Peachtree Plaza Hotel, Atlanta, GA (32532484457).jpg, Warren
 *    LeMay, CC0 (the top band)
 *    https://commons.wikimedia.org/wiki/File:Westin_Peachtree_Plaza_Hotel,_Atlanta,_GA_(32532484457).jpg
 *  - Westin Peachtree Plaza 2.jpg, Doc Searls, CC BY-SA 2.0 (the concrete
 *    rings at the foot of the cylinder)
 *    https://commons.wikimedia.org/wiki/File:Westin_Peachtree_Plaza_2.jpg
 *  - Westin Peachtree Plaza Hotel.jpg, Ncsr111, CC BY-SA 4.0 (dusk, from
 *    the south-west, for the night look)
 *    https://commons.wikimedia.org/wiki/File:Westin_Peachtree_Plaza_Hotel.jpg
 *  - Westin Peachtree Plaza Hotel 12313.JPG, Michael Rivera, CC BY-SA 3.0
 *    https://commons.wikimedia.org/wiki/File:Westin_Peachtree_Plaza_Hotel_12313.JPG
 * USGS NAIP for the podium roof colour. No look-only sources. No
 * commercial imagery.
 *
 * Glass: the cylinder is an even drum of `window-2` in a clear sky blue
 * (#7c9dbf, Neff's mid-blue pulled light), with no floor rings: Neff and
 * Merlin show no bands. The only pale line is the ring under the top band. At night the
 * cylinder glows as lit hotel rooms; the dusk photo shows it so.
 *
 * Doubts: the podium is simplified to three roof heights; its courtyard
 * and the hotel's glass atrium roof round the drum are left out. The
 * restaurant band's height is photo-scaled. The "WESTIN" letters are left
 * off (not part of the building's identity at map scale).
 */
import { Part, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'

// ─────────────────────────────── shared kit ───────────────────────────────

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

/** A cap over a star-shaped ring, fanned from `c`. */
export function fan(p: Part, ring: XY[], z: number, up: boolean, c?: XY) {
  const m = c ?? ring.reduce<XY>((s, q) => [s[0] + q[0] / ring.length, s[1] + q[1] / ring.length], [0, 0])
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    const A: V3 = [a[0], a[1], z], B: V3 = [b[0], b[1], z], C: V3 = [m[0], m[1], z]
    if (up) p.tri(C, A, B)
    else p.tri(C, B, A)
  }
}

/** A flat cap over any simple counter-clockwise polygon (ear clipping). */
export function capPoly(p: Part, ring: XY[], z: number, up: boolean) {
  const idx = ring.map((_, i) => i)
  const cross = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inside = (q: XY, a: XY, b: XY, c: XY) => cross(a, b, q) > 1e-9 && cross(b, c, q) > 1e-9 && cross(c, a, q) > 1e-9
  let guard = 0
  while (idx.length > 3 && guard++ < 10000) {
    let cut = false
    for (let k = 0; k < idx.length; k++) {
      const ia = idx[(k - 1 + idx.length) % idx.length], ib = idx[k], ic = idx[(k + 1) % idx.length]
      const a = ring[ia], b = ring[ib], c = ring[ic]
      if (cross(a, b, c) <= 1e-9) continue
      if (idx.some((j) => j !== ia && j !== ib && j !== ic && inside(ring[j], a, b, c))) continue
      emit(a, b, c)
      idx.splice(k, 1)
      cut = true
      break
    }
    if (!cut) break
  }
  if (idx.length === 3) emit(ring[idx[0]], ring[idx[1]], ring[idx[2]])
  function emit(a: XY, b: XY, c: XY) {
    const A: V3 = [a[0], a[1], z], B: V3 = [b[0], b[1], z], C: V3 = [c[0], c[1], z]
    if (up) p.tri(A, B, C)
    else p.tri(A, C, B)
  }
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

/** A mitred offset of a counter-clockwise ring; d > 0 grows it. */
export function offset(ring: XY[], d: number): XY[] {
  const n = ring.length
  return ring.map((q, i) => {
    const a = ring[(i - 1 + n) % n], b = ring[(i + 1) % n]
    const e1 = norm([q[0] - a[0], q[1] - a[1]]), e2 = norm([b[0] - q[0], b[1] - q[1]])
    const n1: XY = [e1[1], -e1[0]], n2: XY = [e2[1], -e2[0]]
    const m = norm([n1[0] + n2[0], n1[1] + n2[1]])
    const k = d / Math.max(0.3, m[0] * n1[0] + m[1] * n1[1])
    return [q[0] + m[0] * k, q[1] + m[1] * k] as XY
  })
}
const norm = (v: XY): XY => {
  const l = Math.hypot(v[0], v[1]) || 1
  return [v[0] / l, v[1] / l]
}

/**
 * A solid prism over a counter-clockwise ring with a small chamfer at the
 * top edge (STYLE.md's bevel), its roof in `top`.
 */
export function prism(p: Part, ring: XY[], z0: number, z1: number, top: Part = p, bev = 0.45) {
  const inner = offset(ring, -bev)
  wall(p, ring, z0, z1 - bev)
  p.loft([at(ring, z1 - bev), at(inner, z1)])
  capPoly(top, inner, z1, true)
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
 * Window panels on the faces of a counter-clockwise ring: per face, bays
 * of about `bay` metres with piers between, in bands of `group` metres with
 * a `gap` spandrel between bands — the grouped panels STYLE.md asks for.
 */
export function panels(p: Part, ring: XY[], z0: number, z1: number, o: PanelOpts) {
  for (let i = 0; i < ring.length; i++) edgePanels(p, ring[i], ring[(i + 1) % ring.length], z0, z1, o)
}

/**
 * Window panels on one wall, from plan point a to b, the wall's outside to
 * the right of a→b (as for a counter-clockwise ring's edge).
 */
export function edgePanels(p: Part, a: XY, b: XY, z0: number, z1: number, o: PanelOpts) {
  const out = o.out ?? 0.05
  const bands = Math.max(1, Math.round((z1 - z0) / o.group))
  const gh = (z1 - z0) / bands
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  const use = L - 2 * o.margin
  if (L < (o.min ?? 2) || use < 1) return
  const t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], nn: XY = [t[1], -t[0]]
  const bays = Math.max(1, Math.round(use / o.bay)), w = use / bays
  for (let k = 0; k < bays; k++) {
    const s0 = o.margin + k * w + (k ? o.pier / 2 : 0), s1 = o.margin + (k + 1) * w - (k < bays - 1 ? o.pier / 2 : 0)
    if (s1 - s0 < 0.6) continue
    const P = (s: number, z: number): V3 => [a[0] + t[0] * s + nn[0] * out, a[1] + t[1] * s + nn[1] * out, z]
    for (let g = 0; g < bands; g++) {
      const za = z0 + g * gh + o.gap / 2, zb = z0 + (g + 1) * gh - o.gap / 2
      p.quad(P(s0, za), P(s1, za), P(s1, zb), P(s0, zb))
    }
  }
}

/** Panels on a round drum: one panel per segment, bands as above. */
export function roundPanels(p: Part, c: XY, r: number, n: number, z0: number, z1: number, o: { group: number; gap: number; pier: number; phase?: number; skip?: (a: number) => boolean }) {
  const bands = Math.max(1, Math.round((z1 - z0) / o.group))
  const gh = (z1 - z0) / bands
  const seg = (TAU * r) / n, f = o.pier / 2 / seg
  for (let i = 0; i < n; i++) {
    const a0 = (o.phase ?? 0) + ((i + f) / n) * TAU, a1 = (o.phase ?? 0) + ((i + 1 - f) / n) * TAU
    if (o.skip?.((a0 + a1) / 2)) continue
    const P = (a: number, z: number): V3 => [c[0] + r * Math.cos(a), c[1] + r * Math.sin(a), z]
    const nrm = (a: number): V3 => [Math.cos(a), Math.sin(a), 0]
    for (let g = 0; g < bands; g++) {
      const za = z0 + g * gh + o.gap / 2, zb = z0 + (g + 1) * gh - o.gap / 2
      p.tri(P(a0, za), P(a1, za), P(a1, zb), undefined, undefined, undefined, [nrm(a0), nrm(a1), nrm(a1)])
      p.tri(P(a0, za), P(a1, zb), P(a0, zb), undefined, undefined, undefined, [nrm(a0), nrm(a1), nrm(a0)])
    }
  }
}

/** A box between two plan corners with a chamfered top edge. */
export function box(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, top: Part = p, bev = 0.4) {
  prism(p, [[x0, y0], [x1, y0], [x1, y1], [x0, y1]], z0, z1, top, bev)
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

// ──────────────────────────────── the Westin ───────────────────────────────

if (import.meta.main) {
  const glass = new Part(), band = new Part(), concrete = new Part(), roof = new Part(), silver = new Part()

  const C: XY = [-18.1, -0.4] // tower centre
  const R = 19.3 // glass face radius (OSM 19.0–20.0, lidar ≈ 19)
  const N = 32
  const DRUM_TOP = 44, BAND0 = 205, BAND1 = 215.5, RIM = 217, ROOF_C = 221, MAST = 254
  const SHAFT_A = ((90 - 56) * Math.PI) / 180 // bearing 56° as a plan angle from +x

  // ── Podium: OSM way/42904130, split into three roof heights (lidar). ──
  // West end on Spring Street, the middle round the tower, the east end on
  // Peachtree Street.
  const W0: XY = [-55.8, 21.9], W1: XY = [-64.7, -20.9]
  const xAt = (y: number) => W1[0] + ((y - W1[1]) / (W0[1] - W1[1])) * (W0[0] - W1[0])
  const SOUTH = -21.2, NORTH = 21.8, EAST = 60.1
  const blocks: [XY[], number][] = [
    [[[xAt(SOUTH), SOUTH], [-48, SOUTH], [-48, NORTH], [xAt(NORTH), NORTH]], 35],
    [[[-48, SOUTH], [10, SOUTH], [10, NORTH], [-48, NORTH]], 30],
    [[[10, SOUTH], [EAST, SOUTH], [EAST, NORTH], [10, NORTH]], 34],
  ]
  // Long low faces split into ≤ 5 m pieces so they follow the terrain.
  const split = (ring: XY[], step = 5): XY[] => ring.flatMap((a, i) => {
    const b = ring[(i + 1) % ring.length], L = Math.hypot(b[0] - a[0], b[1] - a[1]), k = Math.max(1, Math.ceil(L / step))
    return Array.from({ length: k }, (_, j) => [a[0] + ((b[0] - a[0]) * j) / k, a[1] + ((b[1] - a[1]) * j) / k] as XY)
  })
  for (const [ring, h] of blocks) {
    prism(concrete, split(ring), 0, h, roof, 0.5)
    // A band of dark hotel windows near the top of each podium face, and a
    // second one lower down: the podium's ribbon windows.
    panels(band, ring, h - 7.5, h - 3, { group: 4.5, gap: 0, bay: 9, pier: 1.6, margin: 2.5, min: 8 })
    panels(band, ring, h - 16, h - 11.5, { group: 4.5, gap: 0, bay: 9, pier: 1.6, margin: 2.5, min: 8 })
  }

  // ── The concrete drum at the cylinder's foot: pale rings with dark glass
  // between them, to 44 m. ──
  const drum = circle(C, 21.6, 28)
  smoothWall(concrete, drum, 26, 33.5)
  smoothWall(band, circle(C, 21.0, 28), 33.5, 35.5)
  smoothWall(concrete, drum, 35.5, 39.5)
  smoothWall(band, circle(C, 21.0, 28), 39.5, 41)
  smoothWall(concrete, drum, 41, DRUM_TOP)
  ledge(roof, drum, circle(C, R, 28), DRUM_TOP)

  // ── The glass cylinder, with a few pale floor rings. ──
  const face = circle(C, R, N)
  const rings = [DRUM_TOP, BAND0 - 1.2]
  for (let k = 0; k < rings.length - 1; k++) {
    smoothWall(glass, face, rings[k] + (k ? 0.6 : 0), rings[k + 1] - 0.6)
    smoothWall(silver, circle(C, R + 0.08, N), rings[k + 1] - 0.6, rings[k + 1] + 0.6)
  }
  // The restaurant band: darker glass, a pale ring under it and a rim over it.
  smoothWall(band, face, BAND0 - 0.6, BAND1)
  smoothWall(silver, circle(C, R + 0.12, N), BAND1, RIM)
  ledge(roof, circle(C, R + 0.12, N), circle(C, R - 0.9, N), RIM)
  wall(silver, circle(C, R - 0.9, N).reverse(), RIM - 1.0, RIM)
  fan(roof, circle(C, R - 0.9, N), RIM - 1.0, true, C)
  // Rooftop plant drum (lidar 221 m in the middle).
  const plant = circle(C, 9, 16)
  smoothWall(concrete, plant, RIM - 1.0, ROOF_C)
  fan(roof, plant, ROOF_C, true, C)

  // ── The lift shaft: a silver half-round column on the east-north-east
  // side, from the drum to the roof rim. ──
  {
    const cx = C[0] + 20.6 * Math.cos(SHAFT_A), cy = C[1] + 20.6 * Math.sin(SHAFT_A)
    const r = 2.6
    const arc: XY[] = Array.from({ length: 9 }, (_, i) => {
      const a = SHAFT_A - Math.PI / 2 - 0.35 + ((Math.PI + 0.7) * i) / 8
      return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as XY
    })
    // Close it back against the tower face.
    const ring: XY[] = [...arc]
    smoothWall(silver, ring, DRUM_TOP, RIM + 0.4, false)
    // Glass cab strip down the middle of the shaft, slightly proud.
    const mid = arc.slice(3, 6).map(([x, y]) => [x + 0.12 * Math.cos(SHAFT_A), y + 0.12 * Math.sin(SHAFT_A)] as XY)
    smoothWall(glass, mid, DRUM_TOP + 2, RIM - 2, false)
    const lid = [...arc, [C[0] + (R - 1) * Math.cos(SHAFT_A), C[1] + (R - 1) * Math.sin(SHAFT_A)] as XY]
    fan(roof, lid, RIM + 0.4, true)
  }

  // ── The mast (estimate ≈ 30 m), a slim tapered silver needle. ──
  {
    const lo = circle(C, 0.9, 6), hi = circle(C, 0.25, 6)
    silver.loft([at(lo, ROOF_C), at(hi, MAST)])
    const base = circle(C, 2.2, 8)
    smoothWall(silver, base, ROOF_C, ROOF_C + 3)
    fan(silver, base, ROOF_C + 3, true, C)
  }

  await save('atl-westin-peachtree-plaza', 'Westin Peachtree Plaza', [
    { part: glass, material: windowVariant(2, 0x7c9dbf) },
    { part: band, material: PALETTE.window },
    { part: concrete, material: finish('portman-concrete', 0xe4d9c6) },
    { part: roof, material: PALETTE.roof },
    { part: silver, material: finish('aluminium', 0xd3d8dc, 0.5) },
  ], { height: MAST, anchor: [33.759437, -84.388375], bearing: 0 })
}
