/**
 * The Brooklyn Tower, 9 DeKalb Avenue (SHoP Architects, 2022) — procedural,
 * CC0-1.0, no textures.
 * bun generators/nyc-brooklyn-tower.ts
 *
 * Map frame: x = east, y = north, z up, metres; bearing 0. Anchor: area
 * centroid of the OSM tower part way/1039403183 (-73.9822394, 40.690548).
 * Only the tower: the Dime Savings Bank at its foot (way/248156228 and its
 * dome, way/700241894) keeps drawing from OSM.
 *
 * Evidence
 * - OSM: the tower part way/1039403183, a six-sided plan about 34 × 32 m
 *   (sides 24, 15, 15, 22, 15 and 13 m), 93 levels, height 324; inside the
 *   outline way/1229206093 with the bank and its dome.
 * - Published (Wikipedia, "Brooklyn Tower"): 1,035 ft (315 m), 74 storeys;
 *   hexagonal massing taken from the bank's rotunda; "at each of its six
 *   sides ... slight setbacks, which terminate in a crown"; clad in stone at
 *   the base, then glass with bronze and stainless steel, darkening as it
 *   rises; projecting vertical mullions.
 * - No lidar: the only flight over the site (USGS NY_NewYorkCity, 2017)
 *   predates the tower.
 * - Photos (Wikimedia Commons): Kidfly182, "The Brooklyn Tower" 010, 027,
 *   055–111 (CC BY 4.0 / CC BY-SA 4.0), street level from every side;
 *   FluffballsM&Ms, "Downtown Brooklyn Skyline 2023" (CC0), far view from
 *   the north-east. Credits in ~/landmarks-scratch/nyc/work/nyc-brooklyn-tower/photos/list.txt.
 *
 * Read from photos: the six corners are cut back in stages as the tower
 * rises, so the plan goes from a hexagon to a twelve-sided figure and the
 * silhouette steps in at the corners; near-black glass between bronze
 * vertical fins; two-storey mechanical bands of dark louvres just below
 * the main setbacks; a crown of short bronze fins on every corner.
 *
 * Estimated: the setback heights (from street-level photos, scaled against
 * the 315 m roof), the depth of each corner cut, the bay and fin spacing,
 * the louvre bands' heights and the crown fins' height (3–5 m, from the
 * street photos). The roof is the published 315 m; OSM's 324 m is not
 * borne out by the photos, whose crown fins are short.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { finishModel, capPoly, insetRing, type XY } from './nyc-570-lexington'

const glass = new Part(), dark = new Part(), bronze = new Part(), roof = new Part(), base = new Part()

// OSM way/1039403183, metres from the anchor, counter-clockwise from the west.
const PLAN: XY[] = [[-17.73, 6.16], [-7.04, -15.1], [8.03, -15.78], [15.99, -3.04], [5.46, 15.91], [-10.01, 16.68]]

const ROOF = 315, CROWN = 320, BASE_TOP = 16
const BAY = 2.8, FIN = 0.6, ROW = 13.2, BREAK = 0.7

/**
 * The tiers, bottom to top: each is the plan pulled in by `inset` with its
 * six corners cut back `cut` metres along both sides. `louvre` puts a
 * two-storey band of dark louvres just under the tier's top.
 */
const TIERS = [
  { z0: 0, z1: 96, inset: 0, cut: 0.8, louvre: false },
  { z0: 96, z1: 158, inset: 0.9, cut: 3.2, louvre: true },
  { z0: 158, z1: 228, inset: 1.8, cut: 5.2, louvre: false },
  { z0: 228, z1: 268, inset: 2.8, cut: 6.6, louvre: true },
  { z0: 268, z1: 298, inset: 3.6, cut: 7.6, louvre: false },
  { z0: 298, z1: ROOF, inset: 4.4, cut: 8.4, louvre: true },
]

/** Twelve-sided ring: even edges are the six faces, odd edges the cut corners. */
function tierRing(inset: number, cut: number): XY[] {
  const h = inset > 0 ? insetRing(PLAN, inset) : PLAN
  const out: XY[] = []
  for (let i = 0; i < h.length; i++) {
    const a = h[(i + h.length - 1) % h.length], b = h[i], c = h[(i + 1) % h.length]
    const la = Math.hypot(b[0] - a[0], b[1] - a[1]), lc = Math.hypot(c[0] - b[0], c[1] - b[1])
    out.push([b[0] + (a[0] - b[0]) * cut / la, b[1] + (a[1] - b[1]) * cut / la])
    out.push([b[0] + (c[0] - b[0]) * cut / lc, b[1] + (c[1] - b[1]) * cut / lc])
  }
  // Rotate so edge 0 is a face (corner i's second point to corner i+1's first).
  return [...out.slice(1), out[0]]
}

/** A vertical wall a→b, z0…z1, facing outward for a counter-clockwise ring. */
function wall(p: Part, a: XY, b: XY, z0: number, z1: number) {
  p.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
}

function frame(a: XY, b: XY) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
  const at = (s: number, z: number, d: number): V3 => [a[0] + u[0] * s + n[0] * d, a[1] + u[1] * s + n[1] * d, z]
  return { L, at }
}

/**
 * One face of a tier: dark backing, glass bays in rows of about four
 * storeys, bronze fins standing proud between the bays. Below BASE_TOP the
 * backing and fins are the pale stone base.
 */
function face(a: XY, b: XY, z0: number, z1: number, louvre: boolean) {
  const { L, at } = frame(a, b)
  const zb = Math.min(Math.max(BASE_TOP, z0), z1)
  if (zb > z0) wall(base, a, b, z0, zb)
  if (z1 > zb) wall(dark, a, b, zb, z1)
  const bays = Math.max(1, Math.round(L / BAY)), pitch = L / bays
  // Glass, leaving the base's ground storeys and the louvre band dark.
  const top = louvre ? z1 - 9 : z1 - 0.6, bot = z0 < 1 ? 7 : z0 + 0.4
  const rows = Math.max(1, Math.round((top - bot) / ROW)), rh = (top - bot) / rows
  for (let r = 0; r < rows; r++) {
    const lo = bot + r * rh + BREAK / 2, hi = bot + (r + 1) * rh - BREAK / 2
    for (let k = 0; k < bays; k++) {
      const s0 = k * pitch + FIN / 2 + 0.15, s1 = (k + 1) * pitch - FIN / 2 - 0.15
      glass.quad(at(s0, lo, 0.05), at(s1, lo, 0.05), at(s1, hi, 0.05), at(s0, hi, 0.05))
    }
  }
  // Louvres: glass rows above and below a dark band, with glass in every
  // other bay of it, as the punched grilles read from the street.
  if (louvre) {
    for (let k = 1; k < bays - 1; k += 2) {
      const s0 = k * pitch + FIN / 2 + 0.6, s1 = (k + 1) * pitch - FIN / 2 - 0.6
      glass.quad(at(s0, z1 - 2.8, 0.05), at(s1, z1 - 2.8, 0.05), at(s1, z1 - 0.6, 0.05), at(s0, z1 - 0.6, 0.05))
    }
  }
  // Fins between bays, and at both ends of the face.
  for (let k = 0; k <= bays; k++) {
    const s = k * pitch, s0 = Math.max(0, s - FIN / 2), s1 = Math.min(L, s + FIN / 2), d = 0.35
    const zf = Math.max(z0, BASE_TOP)
    if (z1 <= zf) continue
    const p = bronze
    p.quad(at(s0, zf, d), at(s1, zf, d), at(s1, z1, d), at(s0, z1, d))
    p.quad(at(s0, zf, 0), at(s0, zf, d), at(s0, z1, d), at(s0, z1, 0))
    p.quad(at(s1, zf, d), at(s1, zf, 0), at(s1, z1, 0), at(s1, z1, d))
  }
}

/** A cut corner: dark glass from top to bottom, no bays. */
function corner(a: XY, b: XY, z0: number, z1: number) {
  const zb = Math.min(Math.max(BASE_TOP, z0), z1)
  if (zb > z0) wall(base, a, b, z0, zb)
  if (z1 > zb) wall(dark, a, b, zb, z1)
  const { L, at } = frame(a, b)
  if (L < 1.6) return
  const lo = Math.max(z0, BASE_TOP) + 0.4, hi = z1 - 0.6
  if (hi > lo) glass.quad(at(0.5, lo, 0.05), at(L - 0.5, lo, 0.05), at(L - 0.5, hi, 0.05), at(0.5, hi, 0.05))
}

for (const t of TIERS) {
  const ring = tierRing(t.inset, t.cut)
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    if (i % 2 === 0) face(a, b, t.z0, t.z1, t.louvre)
    else corner(a, b, t.z0, t.z1)
  }
  // Setback ledges are narrow and dark in the photos; only the top is roof.
  capPoly(t.z1 >= ROOF ? roof : dark, ring, t.z1)
}

// Crown: a bronze fin at both ends of every face, rising past the roof,
// and a taller one at mid-face.
const top = tierRing(TIERS[TIERS.length - 1].inset, TIERS[TIERS.length - 1].cut)
function fin(p: XY, toward: XY, h: number) {
  const L = Math.hypot(toward[0] - p[0], toward[1] - p[1]), u: XY = [(toward[0] - p[0]) / L, (toward[1] - p[1]) / L]
  const n: XY = [u[1], -u[0]], w = 0.5, d = 1.1
  const q = (s: number, o: number): XY => [p[0] + u[0] * s + n[0] * o, p[1] + u[1] * s + n[1] * o]
  const ring: XY[] = [q(-w, -0.2), q(w, -0.2), q(w, d), q(-w, d)]
  for (let i = 0; i < 4; i++) wall(bronze, ring[i], ring[(i + 1) % 4], ROOF - 4, ROOF + h)
  capPoly(bronze, ring, ROOF + h)
}
for (let i = 0; i < top.length; i += 2) {
  const a = top[i], b = top[(i + 1) % top.length]
  const { L } = frame(a, b), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
  fin([a[0] + u[0] * 0.6, a[1] + u[1] * 0.6], b, 3)
  fin([b[0] - u[0] * 0.6, b[1] - u[1] * 0.6], a, 3)
  fin([(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], b, CROWN - ROOF)
}

finishModel('The Brooklyn Tower', 'nyc-brooklyn-tower', [
  { part: glass, material: { ...PALETTE.window, color: 0x535c67 } },
  { part: dark, material: finish('brooklyn-tower-dark', 0x4a4f57) },
  { part: bronze, material: finish('brooklyn-tower-bronze', 0xa8896b) },
  { part: base, material: finish('brooklyn-tower-stone', 0xd8d0c4) },
  { part: roof, material: PALETTE.roof },
], { bearing: 0, osm: 'way/1039403183', height: CROWN })
