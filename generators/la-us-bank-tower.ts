/**
 * U.S. Bank Tower (1989, Henry N. Cobb / Pei Cobb Freed), Los Angeles —
 * original procedural geometry, CC0-1.0.
 * bun generators/la-us-bank-tower.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres; origin at the tower's centre on
 * the lowest ground under it (Fifth Street, south side). Placed at bearing
 * 38.2°, so the square the plan is cut by sits square to this frame.
 *
 * Plan (OSM building:parts, way/23973401 and its ten parts): a cylinder
 * (r 16.6) with four lobes. Two lobes (±x here) are arcs of r 24.2, 24 m
 * wide, and run up to 280 m. The other two (±y) are arcs of r 24.2 to 250 m
 * and, below 195 m, swell out to r 29.3, cut off by the square's sides
 * (±20.7). The square's four corners fill in up to 225 m. Going up, the plan
 * goes square-and-circle, then a plus, then two lobes, then the cylinder.
 * Each curved lobe ends in a one-storey ribbon of glass under its terrace,
 * and the cylinder in the glazed observation ring (OUE Skyspace, floors
 * 69–70), above which the crown stands: a ring of sixteen prisms, granite and
 * glass in turn, glass ones taller.
 *
 * Sources:
 * - Heights. Top: LA County LARIAC 2020 lidar footprint 484605841062, 309.9 m
 *   (roof elevation 403.6 m; 3DEP bare earth at Fifth St ≈ 92–93 m, so
 *   ≈ 311 m over the lowest ground). Published 310.3 m (Wikipedia, CTBUH).
 *   Lidar has one footprint for the whole tower, so the setback heights 195,
 *   225, 250 and 280 m are OSM's building:part heights (48, 56, 60, 68
 *   levels), which agree with photo p4 to a few metres.
 * - Ground: USGS 3DEP bare earth rises from ≈ 92 m on Fifth St to ≈ 108 m on
 *   the north side (Bunker Hill), ≈ 0.27 m per m northward. Facade panels
 *   start above the local ground; walls run down to y = 0.
 * - Plan radii and widths: OSM part outlines (above), centred.
 * - Glass ring (≈ 295–299.5 m) and crown (300–310 m): estimated from photos
 *   p4 and p5, scaled by the cylinder's 33 m diameter.
 * - Facade: light grey granite with punched, slightly bayed windows on a
 *   faceted plan (photo p3); drawn as one panel per facet, two floors tall,
 *   so that granite is about two thirds of the wall as in the photos.
 *
 * Photos (Wikimedia Commons): p1 "U.S. Bank Tower (Los Angeles) July 2022"
 * (Benoît Prieur, CC0, from the west); p4 "Los Angeles Library Tower (small)
 * crop" (CC BY-SA 3.0, from the east); p5 "Library Tower Closeup" (Basil D
 * Soufi, CC BY-SA 3.0, crown); p3 "Top of the US Bank Tower from the OUE
 * Skyspace observation deck" (5599fan, CC BY-SA 4.0); p6 "US Bank Tower over
 * Central Library in Downtown LA" (Selvingarcia, CC BY-SA 3.0, from the
 * south-west).
 *
 * Left out: the U.S. Bank sign on the crown (signage), the Bunker Hill Steps.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'

type XY = [number, number]

const granite = new Part(), win = new Part(), ribbon = new Part(), crownGlass = new Part(), terrace = new Part()

const D = Math.PI / 180
const BEARING = 38.2
const R_CORE = 16.6, R_LOBE = 24.2, R_BIG = 29.3, SQ = 20.7, HALF_LOBE = 12
const Z_BIG = 195, Z_CORNER = 225, Z_YLOBE = 250, Z_XLOBE = 280
const RING0 = 295, RING1 = 299.5, Z_CYL = 300.5
const FLOOR = 4.0, GROUP = 2 * FLOOR, SPANDREL = 2.6, PIER = 2.5, PROUD = 0.05
const BEVEL = 0.8

/**
 * Ground over the lowest point, from 3DEP: rises ≈ 0.27 m per metre north
 * (world). The model is turned by BEARING, so world north is a mix of x, y.
 */
function groundAt(p: XY) {
  const north = -p[0] * Math.sin(BEARING * D) + p[1] * Math.cos(BEARING * D)
  return Math.min(16, Math.max(0, 8 + 0.27 * north))
}

// ---------- plan rings ----------
// A ring is a closed list of vertices, counter-clockwise; `curved[i]` says
// whether the edge from vertex i is a curved lobe that ends at the band's
// top, and so carries the glass ribbon that finishes each lobe.
type Ring = { pts: XY[]; curved: boolean[] }

const polar = (r: number, a: number): XY => [r * Math.cos(a), r * Math.sin(a)]

class RingBuilder {
  pts: XY[] = []
  curved: boolean[] = []
  /**
   * Arc of radius r from angle a0 to a1 in n facets, a1 itself left to the
   * next call. `ends`: the lobe stops at the top of this band, so it takes
   * a glass ribbon.
   */
  arc(r: number, a0: number, a1: number, n: number, ends = false) {
    for (let i = 0; i < n; i++) {
      this.pts.push(polar(r, a0 + ((a1 - a0) * i) / n))
      this.curved.push(ends)
    }
  }
  point(p: XY) {
    this.pts.push(p)
    this.curved.push(false)
  }
  ring(): Ring {
    return { pts: this.pts, curved: this.curved }
  }
}

const asin = Math.asin, atan2 = Math.atan2, sqrt = Math.sqrt

/** The plan has two-fold symmetry: build half and turn it 180°. */
function twoFold(half: (b: RingBuilder) => void): Ring {
  const b = new RingBuilder()
  half(b)
  const n = b.pts.length
  for (let i = 0; i < n; i++) {
    b.pts.push([-b.pts[i][0], -b.pts[i][1]])
    b.curved.push(b.curved[i])
  }
  return b.ring()
}

// Where the lobe arc (r 24.2) meets the square's side, and where the big arc
// (r 29.3) meets the square's corner.
const aLobeSq = atan2(sqrt(R_LOBE ** 2 - SQ ** 2), SQ)          // ≈ 31.2°
const aBig = atan2(sqrt(R_BIG ** 2 - SQ ** 2), SQ)              // ≈ 45.0°
const aLobe = asin(HALF_LOBE / R_LOBE)                          // ≈ 29.7°, a 24 m wide lobe
const aCore = atan2(HALF_LOBE, sqrt(R_CORE ** 2 - HALF_LOBE ** 2)) // where a lobe's side wall meets the core

/** Drop repeated vertices. */
function clean(r: Ring): Ring {
  const pts: XY[] = [], curved: boolean[] = []
  r.pts.forEach((p, i) => {
    const prev = pts[pts.length - 1]
    if (prev && Math.hypot(p[0] - prev[0], p[1] - prev[1]) < 1e-6) return
    pts.push(p)
    curved.push(r.curved[i])
  })
  const f = pts[0], l = pts[pts.length - 1]
  if (Math.hypot(f[0] - l[0], f[1] - l[1]) < 1e-6) { pts.pop(); curved.pop() }
  return { pts, curved }
}

function makeRing(build: (b: RingBuilder) => void): Ring {
  return clean(twoFold(build))
}

// 0–195: the square with the x lobes bulging past it and the big y lobes.
const PLAN_A = makeRing((b) => {
  b.arc(R_LOBE, -aLobeSq, aLobeSq, 5)
  b.point([SQ, sqrt(R_LOBE ** 2 - SQ ** 2)])
  b.arc(R_BIG, aBig, Math.PI - aBig, 8, true)
  b.point([-SQ, sqrt(R_BIG ** 2 - SQ ** 2)])
  b.point([-SQ, sqrt(R_LOBE ** 2 - SQ ** 2)])
})

// 195–225: the square with lobes of r 24.2 bulging past each side.
const aYLobeSq = atan2(SQ, sqrt(R_LOBE ** 2 - SQ ** 2))          // ≈ 58.8°
const PLAN_B = makeRing((b) => {
  b.arc(R_LOBE, -aLobeSq, aLobeSq, 5)
  b.point([SQ, sqrt(R_LOBE ** 2 - SQ ** 2)])
  b.point([SQ, SQ])
  b.point([sqrt(R_LOBE ** 2 - SQ ** 2), SQ])
  b.arc(R_LOBE, aYLobeSq, Math.PI - aYLobeSq, 5)
  b.point([-sqrt(R_LOBE ** 2 - SQ ** 2), SQ])
  b.point([-SQ, SQ])
  b.point([-SQ, sqrt(R_LOBE ** 2 - SQ ** 2)])
})

// 225–250: a plus of four 24 m lobes.
const lobeEnd = sqrt(R_LOBE ** 2 - HALF_LOBE ** 2)
const PLAN_C = makeRing((b) => {
  b.arc(R_LOBE, -aLobe, aLobe, 5)
  b.point([lobeEnd, HALF_LOBE])
  b.point([HALF_LOBE, HALF_LOBE])
  b.point([HALF_LOBE, lobeEnd])
  b.arc(R_LOBE, Math.PI / 2 - aLobe, Math.PI / 2 + aLobe, 5, true)
  b.point([-HALF_LOBE, lobeEnd])
  b.point([-HALF_LOBE, HALF_LOBE])
  b.point([-lobeEnd, HALF_LOBE])
})

// 250–280: the cylinder with the two x lobes.
const PLAN_D = makeRing((b) => {
  b.arc(R_LOBE, -aLobe, aLobe, 5, true)
  b.point([lobeEnd, HALF_LOBE])
  b.point([sqrt(R_CORE ** 2 - HALF_LOBE ** 2), HALF_LOBE])
  b.arc(R_CORE, aCore, Math.PI - aCore, 6)
  b.point([-sqrt(R_CORE ** 2 - HALF_LOBE ** 2), HALF_LOBE])
  b.point([-lobeEnd, HALF_LOBE])
})

// 280–300.5: the cylinder.
const PLAN_E = clean((() => {
  const b = new RingBuilder()
  b.arc(R_CORE, 0, 2 * Math.PI, 20)
  return b.ring()
})())

// ---------- walls, panels, caps ----------

const at = (p: XY, z: number): V3 => [p[0], p[1], z]
const outward = (a: XY, b: XY): XY => {
  const l = Math.hypot(b[0] - a[0], b[1] - a[1])
  return [(b[1] - a[1]) / l, -(b[0] - a[0]) / l]
}

/** Inset a counter-clockwise ring by d, mitred at each vertex. */
function inset(pts: XY[], d: number): XY[] {
  const n = pts.length
  return pts.map((p, i) => {
    const a = pts[(i + n - 1) % n], b = pts[(i + 1) % n]
    const n1 = outward(a, p), n2 = outward(p, b)
    const m: XY = [n1[0] + n2[0], n1[1] + n2[1]]
    const k = 1 + n1[0] * n2[0] + n1[1] * n2[1]
    return [p[0] - (m[0] * d) / k, p[1] - (m[1] * d) / k]
  })
}

/** Fan cap from the origin; every plan here is star-shaped about it. */
function cap(part: Part, pts: XY[], z: number) {
  pts.forEach((a, i) => part.tri([0, 0, z], at(a, z), at(pts[(i + 1) % pts.length], z)))
}

/**
 * One band of the tower: walls of `ring` from z0 to z1, window panels one per
 * facet in three-floor groups, a glass ribbon along the curved edges just
 * under the top when `ribbonTop`, and a bevelled lip and terrace on top.
 */
function band(ring: Ring, z0: number, z1: number, opts: { ribbonTop?: boolean; terraceTop?: boolean } = {}) {
  const { pts, curved } = ring
  const n = pts.length
  const top = z1 - BEVEL
  for (let i = 0; i < n; i++) {
    const a = pts[i], b = pts[(i + 1) % n]
    granite.quad(at(a, z0), at(b, z0), at(b, top), at(a, top))
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < PIER + 1.5) continue
    const o = outward(a, b), t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
    const p = (s: number): XY => [a[0] + t[0] * s + o[0] * PROUD, a[1] + t[1] * s + o[1] * PROUD]
    const pa = p(PIER / 2), pb = p(L - PIER / 2)
    const ribbonLo = opts.ribbonTop && curved[i] ? z1 - 4.8 : Infinity
    if (ribbonLo < Infinity) {
      const ra = p(0.0), rb = p(L)
      ribbon.quad(at(ra, ribbonLo), at(rb, ribbonLo), at(rb, z1 - 0.9), at(ra, z1 - 0.9))
    }
    const ground = Math.max(groundAt(a), groundAt(b))
    for (let g = 0; g * GROUP < z1; g++) {
      const lo = Math.max(g * GROUP + SPANDREL / 2, z0 + 1)
      const hi = Math.min((g + 1) * GROUP - SPANDREL / 2, top - 1, ribbonLo - 1.6)
      if (lo < ground + 5) continue
      if (hi - lo < 4) continue
      win.quad(at(pa, lo), at(pb, lo), at(pb, hi), at(pa, hi))
    }
  }
  // bevelled lip
  const inner = inset(pts, BEVEL)
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    granite.quad(at(pts[i], top), at(pts[j], top), at(inner[j], z1), at(inner[i], z1))
  }
  cap(opts.terraceTop === false ? granite : terrace, inner, z1)
}

band(PLAN_A, 0, Z_BIG, { ribbonTop: true })
band(PLAN_B, Z_BIG, Z_CORNER)
band(PLAN_C, Z_CORNER, Z_YLOBE, { ribbonTop: true })
band(PLAN_D, Z_YLOBE, Z_XLOBE, { ribbonTop: true })

// The cylinder: panels up to the observation ring, the ring, a granite lip.
{
  const { pts } = PLAN_E
  const n = pts.length
  band({ pts, curved: pts.map(() => false) }, Z_XLOBE, RING0, { terraceTop: false })
  for (let i = 0; i < n; i++) {
    const a = pts[i], b = pts[(i + 1) % n]
    ribbon.quad(at(a, RING0), at(b, RING0), at(b, RING1), at(a, RING1))
    granite.quad(at(a, RING1), at(b, RING1), at(b, Z_CYL), at(a, Z_CYL))
  }
  cap(terrace, pts, Z_CYL)
}

// ---------- the crown ----------
// Sixteen pieces round a drum, alternately a flat-fronted granite pier and a
// glass prism pointing outward (photos p3, p5), standing on the cylinder's
// rim. The glass prisms stand a little taller.
{
  const N = 16, R_IN = 12.2, R_FACE = 15.6, R_TIP = 16.2, DRUM_TOP = 306
  const ang = (k: number) => (k / N) * 2 * Math.PI
  const drum: XY[] = []
  for (let i = 0; i < N; i++) drum.push(polar(R_IN, ang(i + 0.5)))
  for (let i = 0; i < N; i++) {
    const a = drum[i], b = drum[(i + 1) % N]
    granite.quad(at(a, Z_CYL), at(b, Z_CYL), at(b, DRUM_TOP), at(a, DRUM_TOP))
  }
  cap(terrace, drum, DRUM_TOP)
  for (let i = 0; i < N; i++) {
    const glass = i % 2 === 0
    const part = glass ? crownGlass : granite
    const zt = glass ? 310.3 : 309
    const a = polar(R_IN, ang(i - 0.5)), c = polar(R_IN, ang(i + 0.5))
    // a granite pier's face is tangential; a glass prism comes to a point
    const front: XY[] = glass
      ? [polar(R_TIP, ang(i))]
      : [polar(R_FACE, ang(i - 0.4)), polar(R_FACE, ang(i + 0.4))]
    const ring = [a, ...front, c]
    for (let k = 0; k < ring.length - 1; k++)
      part.quad(at(ring[k], Z_CYL), at(ring[k + 1], Z_CYL), at(ring[k + 1], zt), at(ring[k], zt))
    part.quad(at(c, DRUM_TOP), at(a, DRUM_TOP), at(a, zt), at(c, zt))
    for (let k = 1; k < ring.length - 1; k++) part.tri(at(ring[0], zt), at(ring[k], zt), at(ring[k + 1], zt))
  }
}

// ---------- write ----------
const parts = [
  { part: granite, material: finish('usb-granite', 0xe7e3dc) },
  { part: win, material: PALETTE.window },
  { part: ribbon, material: windowVariant(2, 0x6f949c) },
  { part: crownGlass, material: PALETTE.glass },
  { part: terrace, material: PALETTE.roof },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('U.S. Bank Tower', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, height: 310.3,
  frame: 'Y up, -Z north, +X east, metres; origin at the anchor on the ground',
  replaces: ['way/23973401', 'way/495115500', 'way/901405051', 'way/901405052', 'way/901405053', 'way/901405054',
    'way/901405055', 'way/901405056', 'way/901405057', 'way/901405058', 'way/901405059', 'way/901405060'],
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = process.argv[2] ?? new URL('../models/la-us-bank-tower.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
