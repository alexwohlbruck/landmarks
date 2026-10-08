/**
 * 432 Park Avenue (Rafael Viñoly, 2015) — original procedural geometry, CC0-1.0.
 * bun generators/nyc-432-park.ts
 *
 * x = across the Manhattan grid (118.75°), y = up the avenues (28.75°),
 * z = metres up. Anchor is the centroid of OSM way/261499924
 * (40.7617056, -73.9718683); bearing 28.75°, elevation 0.
 *
 * This file also holds the small kit the other Billionaires' Row generators
 * (nyc-central-park-tower, nyc-steinway-tower, nyc-one57) import.
 *
 * Evidence
 * - OSM: tower part way/463593207 is a 28.6 × 28.2 m square in the outline's
 *   south-east; base part way/463386820 (tagged 30 m, glass) wraps it on the
 *   west and north.
 * - Published (Wikipedia): roof 425.5 m; 93 ft (28.3 m) square floor plates;
 *   floor-to-floor 15 ft 6 in (4.72 m); white concrete lattice of 10 ft
 *   square openings, six per face per floor; five open two-storey windbreaks
 *   spaced every 12 floors from the top, each with two tiers of six
 *   unglazed openings per face; base clad in limestone.
 * - Measured (USGS 3DEP 2017 lidar, NY_NewYorkCity): the plot north of the
 *   tower is open plaza 2–3 m above street; the west strip of the base is low
 *   (about 10 m, few returns, glazed roof). OSM's 30 m base is too tall, so
 *   the base is drawn as that 10 m limestone strip only. The tower roof is
 *   missing from the lidar (no returns above ~310 m), so its height is the
 *   published one.
 * - Photos (Wikimedia Commons): Epistola8 "432 Park Avenue, NY (cropped)"
 *   (CC BY-SA 4.0, from Top of the Rock, south-west); Jim.henderson
 *   "432 Pk Av 2020-07 jeh" (CC BY-SA 4.0, from Central Park, north-west);
 *   Sebastiandoe5 "432 Park Avenue from Top of the Rock" (CC BY-SA 4.0);
 *   Chris O "Billionaire's Row, NYC" (CC BY-SA 4.0, from the west); Brian W.
 *   Schaller "A615, 432 Park Avenue" (FAL, street level).
 *
 * Drawing: the lattice is drawn at twice its real pitch, one square window
 * panel per two by two real openings (9.44 m pitch, 6.1 m panels: the real
 * opening-to-frame ratio, doubled), so it
 * keeps the square grid without becoming a dot grid. The windbreaks are the
 * real thing: open bays between square columns, two tiers, with the dark
 * mechanical core inside, so the sky shows through them at the corners as in
 * the photos.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, type Swatch } from './palette'

// ---- Kit ---------------------------------------------------------------------
export type XY = [number, number]
export type Rim = { points: XY[]; normals: V3[] }

const unit = (v: V3): V3 => { const l = Math.hypot(...v) || 1; return v.map((n) => n / l) as V3 }

/** An axis-aligned rectangle, counter-clockwise from above. */
export const rect = (x0: number, x1: number, y0: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]

/** Round every convex corner with two points and smooth normals. */
export function soften(ring: XY[], radius: number): Rim {
  const points: XY[] = [], normals: V3[] = []
  for (let i = 0; i < ring.length; i++) {
    const a = ring[(i + ring.length - 1) % ring.length], b = ring[i], c = ring[(i + 1) % ring.length]
    const l0 = Math.hypot(b[0] - a[0], b[1] - a[1]), l1 = Math.hypot(c[0] - b[0], c[1] - b[1])
    const u: XY = [(b[0] - a[0]) / l0, (b[1] - a[1]) / l0], v: XY = [(c[0] - b[0]) / l1, (c[1] - b[1]) / l1]
    const turn = u[0] * v[1] - u[1] * v[0]
    if (turn < -1e-5) { points.push(b); normals.push(unit([u[1] + v[1], -u[0] - v[0], 0])); continue }
    // No bevel: a sharp corner, each face keeping its own flat normal.
    if (radius <= 0) { points.push(b, b); normals.push([u[1], -u[0], 0], [v[1], -v[0], 0]); continue }
    const r = Math.min(radius, l0 * 0.3, l1 * 0.3)
    points.push([b[0] - u[0] * r, b[1] - u[1] * r], [b[0] + v[0] * r, b[1] + v[1] * r])
    normals.push([u[1], -u[0], 0], [v[1], -v[0], 0])
  }
  return { points, normals }
}

export function wall(p: Part, rim: Rim, z0: number, z1: number) {
  const n = rim.points.length
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    const a = rim.points[i], b = rim.points[j], na = rim.normals[i], nb = rim.normals[j]
    if (Math.hypot(b[0] - a[0], b[1] - a[1]) < 1e-6) continue
    p.tri([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], undefined, undefined, undefined, [na, nb, nb])
    p.tri([a[0], a[1], z0], [b[0], b[1], z1], [a[0], a[1], z1], undefined, undefined, undefined, [na, nb, na])
  }
}

/** A flat cap fanned from the first point; rings here are convex. */
export function cap(p: Part, ring: XY[], z: number, up = true) {
  const dedup = ring.filter((q, i) => { const r = ring[(i + ring.length - 1) % ring.length]; return Math.hypot(q[0] - r[0], q[1] - r[1]) > 1e-6 })
  const pts = up ? dedup : [...dedup].reverse()
  for (let i = 1; i < pts.length - 1; i++) p.tri([...pts[0], z], [...pts[i], z], [...pts[i + 1], z])
}

/** A vertical prism over a convex ring with soft corners. */
export function prism(p: Part, ring: XY[], z0: number, z1: number, o: { bevel?: number; top?: Part | null; bottom?: boolean } = {}) {
  const rim = soften(ring, o.bevel ?? 0.45)
  wall(p, rim, z0, z1)
  if (o.top !== null) cap(o.top ?? p, rim.points, z1, true)
  if (o.bottom) cap(p, rim.points, z0, false)
}

/**
 * A flat panel on the outside of the wall running a → b (a counter-clockwise
 * ring's edge), from s0 to s1 along it and z0 to z1 up it, `off` proud.
 */
export function facePanel(p: Part, a: XY, b: XY, s0: number, s1: number, z0: number, z1: number, off = 0.04) {
  const l = Math.hypot(b[0] - a[0], b[1] - a[1]), ux = (b[0] - a[0]) / l, uy = (b[1] - a[1]) / l
  const v = (s: number, z: number): V3 => [a[0] + ux * s + uy * off, a[1] + uy * s - ux * off, z]
  p.quad(v(s0, z0), v(s1, z0), v(s1, z1), v(s0, z1))
}

/** The four edges of a counter-clockwise rectangle, as [a, b] pairs. */
export const edges = (r: XY[]): [XY, XY][] => r.map((p, i) => [p, r[(i + 1) % r.length]] as [XY, XY])

export async function save(id: string, name: string, parts: Array<{ part: Part; material: Swatch }>, extras: Record<string, unknown>, budget = 5000) {
  const used = parts.filter(({ part }) => part.triangles)
  const triangles = used.reduce((n, { part }) => n + part.triangles, 0)
  if (triangles > budget) throw new Error(`${id}: triangle budget exceeded: ${triangles}`)
  if (used.length > 6) throw new Error(`${id}: ${used.length} materials`)
  const glb = writeGlb(name, used, { license: 'CC0-1.0', elevation: 0, frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor', ...extras })
  if (glb.length > 250 * 1024) throw new Error(`${id}: file budget exceeded: ${glb.length}`)
  const out = new URL(`../models/${id}.glb`, import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}

// ---- 432 Park Avenue -------------------------------------------------------------
function build() {
  const concrete = new Part(), win = new Part(), core = new Part(), base = new Part(), roof = new Part()

  const CX = 6.6, CY = -7.8, HALF = 14.15 // 28.3 m square, on OSM's tower part
  const H = 425.5, FLOOR = 4.72, PITCH = 2 * FLOOR, PIER = 2 * 1.67 // the real 3.05 m openings and 1.67 m frame, doubled
  const tower = rect(CX - HALF, CX + HALF, CY - HALF, CY + HALF)
  const BASE_H = 10

  // Windbreaks: two storeys each, every 12 floors from the roof down.
  const breaks: [number, number][] = []
  for (let k = 0; k < 5; k++) {
    const top = H - 12 * FLOOR - k * 14 * FLOOR
    breaks.push([top - 2 * FLOOR, top])
  }
  // Solid lattice blocks between them.
  const blocks: [number, number][] = []
  let z = H
  for (const [b0, b1] of breaks) { blocks.push([b1, z]); z = b0 }
  blocks.push([0, z])

  for (const [z0, z1] of blocks) {
    prism(concrete, tower, z0, z1, { bevel: 0.4, top: z1 === H ? null : concrete, bottom: z0 > 0 })
    // Window panels: three per face per two storeys, rows counted down from
    // the block top so every block ends on a full spandrel.
    edges(tower).forEach(([a, b], face) => {
      const west = face === 3
      for (let top = z1; top - PITCH > z0 - 1; top -= PITCH) {
        const lo = Math.max(top - PITCH + PIER / 2, z0 === 0 ? 1.2 : z0 + PIER / 2), hi = top - PIER / 2
        if (west && hi <= BASE_H) continue
        const bottom = west ? Math.max(lo, BASE_H + 0.6) : lo
        if (hi - bottom < 2) continue
        for (let c = 0; c < 3; c++) {
          facePanel(win, a, b, c * PITCH + PIER / 2, (c + 1) * PITCH - PIER / 2, bottom, hi)
        }
      }
    })
  }

  // Windbreaks: the columns at the real 4.72 m pitch, a mid-height beam for
  // the floor between the two tiers, and the dark core behind.
  const COL = 1.4
  for (const [z0, z1] of breaks) {
    const mid = (z0 + z1) / 2
    for (let i = 0; i <= 6; i++) for (let j = 0; j <= 6; j++) {
      if (i !== 0 && i !== 6 && j !== 0 && j !== 6) continue
      const x = CX - HALF + i * FLOOR, y = CY - HALF + j * FLOOR
      const hx = i === 0 ? [x, x + COL] : i === 6 ? [x - COL, x] : [x - COL / 2, x + COL / 2]
      const hy = j === 0 ? [y, y + COL] : j === 6 ? [y - COL, y] : [y - COL / 2, y + COL / 2]
      prism(concrete, rect(hx[0], hx[1], hy[0], hy[1]), z0, z1, { bevel: 0, top: null })
    }
    // Ring beam, as four bars.
    const B = 1.1
    for (const r of [
      rect(CX - HALF, CX + HALF, CY - HALF, CY - HALF + B), rect(CX - HALF, CX + HALF, CY + HALF - B, CY + HALF),
      rect(CX - HALF, CX - HALF + B, CY - HALF + B, CY + HALF - B), rect(CX + HALF - B, CX + HALF, CY - HALF + B, CY + HALF - B),
    ]) prism(concrete, r, mid - 0.7, mid + 0.7, { bevel: 0, bottom: true })
    prism(core, rect(CX - 9.5, CX + 9.5, CY - 9.5, CY + 9.5), z0, z1, { bevel: 0, top: null })
  }

  // Roof: a concrete rim around the dark roof deck.
  {
    const rim = 1.6
    const inner = rect(CX - HALF + rim, CX + HALF - rim, CY - HALF + rim, CY + HALF - rim)
    const outer = soften(tower, 0.4).points
    // Rim as a band of quads between the softened outline and the inner square.
    const n = outer.length
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n
      // Match each outline point to the nearest inner corner.
      const near = (p: XY) => inner.reduce((best, q) => (Math.hypot(q[0] - p[0], q[1] - p[1]) < Math.hypot(best[0] - p[0], best[1] - p[1]) ? q : best))
      const a = outer[i], b = outer[j], ia = near(a), ib = near(b)
      concrete.tri([...a, H], [...b, H], [...ib, H])
      if (ia !== ib) concrete.tri([...a, H], [...ib, H], [...ia, H])
    }
    cap(roof, inner, H)
  }

  // Base: the low limestone strip west of the tower, glazed shopfronts.
  const strip = rect(-17.2, CX - HALF, -22, 21.3)
  prism(base, strip, 0, BASE_H, { bevel: 0.4, top: roof })
  edges(strip).forEach(([a, b], face) => {
    if (face === 1) return // against the tower
    const l = Math.hypot(b[0] - a[0], b[1] - a[1]), bays = Math.max(1, Math.round(l / 7))
    const w = l / bays
    for (let k = 0; k < bays; k++) facePanel(win, a, b, k * w + 0.9, (k + 1) * w - 0.9, 0.6, BASE_H - 1.6)
  })

  return [
    { part: concrete, material: finish('white-concrete', 0xf3efe7) },
    { part: win, material: { ...PALETTE.window, color: 0x8ea3b2 } }, // pale reflective glass, as in daylight photos
    { part: core, material: finish('windbreak-core', 0x4a4f57) },
    { part: base, material: PALETTE.stone },
    { part: roof, material: PALETTE.roof },
  ]
}

if (import.meta.main) {
  await save('nyc-432-park', '432 Park Avenue', build(), {
    bearing: 28.75, anchor: [40.7617056, -73.9718683], height: 425.5,
    note: 'Square white concrete lattice, five open two-storey windbreaks; low limestone base',
  })
}
