/**
 * Marina City, Chicago (1964–68, Bertrand Goldberg) — original procedural
 * geometry, CC0-1.0.
 * bun generators/chi-marina-city.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = midpoint of the two tower centroids (OSM way/1177923716,
 * Marina City 1, and way/284822929, Marina City 2), 41.888083,-87.6288135.
 * Bearing 0: the towers are round and the theatre is drawn from its OSM
 * outline as it lies.
 *
 * Identity: twin round concrete "corncob" towers. Sixteen semicircular
 * balconies ring every apartment floor, stacked into petals from the 21st
 * floor to the top; below them, a smooth round spiral parking garage whose
 * open floors show as pale slab edges over dark openings; between the two,
 * a recessed service floor. Second: the low theatre (now House of Blues)
 * between the towers, with its humped slate roof and pale rim.
 *
 * The towers are abstracted: one scalloped balcony drum stands for about
 * three to four apartment floors (12 drums for floors 21–60), with a narrow dark gap
 * between drums so the stack reads as a dense cob; the garage keeps one
 * white slab edge per two parking levels. The 16 semicircular petals and the
 * plan are real. A slab per apartment floor would cost ~25k triangles.
 *
 * Evidence:
 *  - plan: OSM. Tower outlines 39.5 m across the balcony tips with 16 lobes,
 *    tips at multiples of 22.5° (read off the outline's nodes; NAIP shows
 *    the same 16 scallops). Body/glass part way/1177923718 (≈ 33 m).
 *    Theatre outline way/1177923721, used as drawn.
 *  - heights: balconies to 167.5 m (OSM); 65 floors, garage on floors
 *    1–19, apartments 21–60 (Wikipedia). Garage top ≈ 52 m and the service floor 52–55.5 m follow
 *    from those floor counts and Rycroft's photos of the parking levels.
 *    Theatre height measured against the garage floors in the Chicago
 *    Architecture Today photo (estimate, ±2 m). Its roof is drawn as a gentle saddle, ≈ 16 m at the
 *    ends and ≈ 12 m mid-length; the real shell is more complex.
 *  - the roof: flat, with a low penthouse 3 m over the top balcony ring, as
 *    the photos show it. OSM's lift-core part way/1177923719 says 179.2 m
 *    and Wikipedia gives 179 m (587 ft) overall; nothing that tall shows
 *    over the top ring in any photo, so the published figure presumably
 *    counts rooftop plant or a mast and is not modelled.
 *  - y = 0 is the plaza / street level; the river-level marina and
 *    restaurants under the plaza are separate OSM buildings and are left
 *    alone.
 *  - colour: pale cream concrete (OSM building:colour #FEF0C9 agrees), dark
 *    glazing behind the balconies, dark garage interiors, grey slate
 *    theatre.
 *
 * Photos (Wikimedia Commons): Chicago_in_2022_Marina_City_tower_(52051544860)
 * and Chicago_in_2022_Top_of_the_Marina_City_tower_(52049999707) (Chris
 * Rycroft, CC BY 2.0); Corn_Cobs_copy.jpg (Victor Grigas, CC BY-SA 4.0);
 * Chicago_-_"Corn_Cob_Towers"_(302029774).jpg (Tony Webster, CC BY 2.0);
 * Chicago_Jetsons_(3536341617).jpg (Mobilus In Mobili, CC BY 2.0);
 * House_of_Blues_-_Exterior_3_(8400395917).jpg (Chicago Architecture
 * Today, CC BY 2.0); House_of_Blues_(24253613608).jpg (Olivier Bruchez,
 * CC BY-SA 2.0). USGS NAIP for the plan. No commercial imagery.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const concrete = new Part(), glass = new Part(), dark = new Part(), slate = new Part(), roof = new Part()

type XY = [number, number]
const TAU = Math.PI * 2

const R_FACE = 16.9, R_GLASS = 15.6, R_GARAGE = 19.0, R_GARAGE_IN = 16.2, R_PENT = 6.5
const LOBES = 16, ARC = 6

/**
 * The balcony outline: sixteen semicircular lobes standing on a circle of
 * radius R_FACE, each spanning the chord between two valleys and drawn with
 * ARC segments, so the tips reach ≈ 19.6 m (OSM's outline radius).
 * Counter-clockwise from above.
 */
function scallop(c: XY): XY[] {
  const pts: XY[] = []
  const step = (Math.PI * 2) / LOBES
  for (let k = 0; k < LOBES; k++) {
    const a0 = k * step, a1 = a0 + step
    const v0: XY = [R_FACE * Math.cos(a0), R_FACE * Math.sin(a0)], v1: XY = [R_FACE * Math.cos(a1), R_FACE * Math.sin(a1)]
    const m: XY = [(v0[0] + v1[0]) / 2, (v0[1] + v1[1]) / 2]
    const r = Math.hypot(v1[0] - v0[0], v1[1] - v0[1]) / 2
    const out = Math.atan2(m[1], m[0])
    // From the first valley round the outside of the lobe to the next one.
    for (let i = 0; i < ARC; i++) {
      const t = out - Math.PI / 2 + (i / ARC) * Math.PI
      pts.push([c[0] + m[0] + r * Math.cos(t), c[1] + m[1] + r * Math.sin(t)])
    }
  }
  return pts
}
const circle = (c: XY, r: number, n: number, phase = 0): XY[] =>
  Array.from({ length: n }, (_, i) => {
    const a = phase + (i / n) * TAU
    return [c[0] + r * Math.cos(a), c[1] + r * Math.sin(a)] as XY
  })
const at = (pts: XY[], z: number): V3[] => pts.map(([x, y]) => [x, y, z])

/** A cylinder wall (outward faces) between two heights. */
function wall(p: Part, ring: XY[], z0: number, z1: number) {
  p.loft([at(ring, z0), at(ring, z1)])
}
/**
 * A vertical wall with smooth horizontal normals, so round and scalloped
 * drums shade softly (and their corners weld, which keeps the file small).
 */
function smoothWall(p: Part, ring: XY[], z0: number, z1: number) {
  const n = ring.length
  const nrm = ring.map((q, i) => {
    const a = ring[(i - 1 + n) % n], b = ring[(i + 1) % n]
    // Outward normal of a counter-clockwise ring: the edge direction turned right.
    const e1 = [q[0] - a[0], q[1] - a[1]], e2 = [b[0] - q[0], b[1] - q[1]]
    const l1 = Math.hypot(e1[0], e1[1]), l2 = Math.hypot(e2[0], e2[1])
    const x = e1[1] / l1 + e2[1] / l2, y = -e1[0] / l1 - e2[0] / l2, l = Math.hypot(x, y) || 1
    return [x / l, y / l, 0] as V3
  })
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    const a: V3 = [ring[i][0], ring[i][1], z0], b: V3 = [ring[j][0], ring[j][1], z0]
    const c: V3 = [ring[j][0], ring[j][1], z1], d: V3 = [ring[i][0], ring[i][1], z1]
    p.tri(a, b, c, undefined, undefined, undefined, [nrm[i], nrm[j], nrm[j]])
    p.tri(a, c, d, undefined, undefined, undefined, [nrm[i], nrm[j], nrm[i]])
  }
}
/**
 * The flat ring between an outer outline and an inner circle, facing up or
 * down. Each outer point joins the inner vertex nearest in angle.
 */
function washer(p: Part, c: XY, outer: XY[], inner: XY[], z: number, up = true) {
  const ang = (q: XY) => Math.atan2(q[1] - c[1], q[0] - c[0])
  const nearest = (q: XY) => {
    let best = 0, bd = Infinity
    inner.forEach((r, i) => { let d = Math.abs(ang(r) - ang(q)); d = Math.min(d, TAU - d); if (d < bd) { bd = d; best = i } })
    return best
  }
  const n = outer.length
  for (let i = 0; i < n; i++) {
    const a = outer[i], b = outer[(i + 1) % n]
    const ia = nearest(a), ib = nearest(b)
    const A: V3 = [a[0], a[1], z], B: V3 = [b[0], b[1], z], I: V3 = [inner[ia][0], inner[ia][1], z]
    if (up) p.tri(A, B, I); else p.tri(B, A, I)
    if (ia !== ib) {
      const J: V3 = [inner[ib][0], inner[ib][1], z]
      if (up) p.tri(I, B, J); else p.tri(B, I, J)
    }
  }
}

function tower(c: XY) {
  const sc = scallop(c)
  const glassRing = circle(c, R_GLASS, 16, Math.PI / 16)
  const garage = circle(c, R_GARAGE, 16)
  const garageIn = circle(c, R_GARAGE_IN, 12)

  // Ground floor: the lift core and a glazed lobby ring under the garage.
  wall(glass, circle(c, 9.5, 12), 0, 4)

  // Garage: white slab edges over a dark core seen through narrower open
  // gaps, one slab for about two parking levels. The slabs are the tower's
  // full width.
  wall(dark, garageIn, 4, 52)
  const SLABS = 10, gp = 48 / SLABS
  for (let k = 0; k <= SLABS; k++) {
    const z = 4 + k * gp
    smoothWall(concrete, garage, k === 0 ? 3.2 : z - 1.65, k === SLABS ? z + 0.75 : z + 1.65)
  }
  washer(concrete, c, garage, garageIn, 4.75, false)

  // Service floor: recessed and dark.
  wall(dark, circle(c, 14.2, 12), 52.75, 55.5)

  // Apartments: a dense stack of scalloped balcony drums over dark glass.
  // Each drum stands for three floors; the dark gap between drums is kept
  // much narrower than the drum, so the stack reads as a cob. Drums have no
  // ledge caps: from above the roof covers the plan, and through a gap the
  // eye meets the dark glass core, which is what the real gaps look like.
  const Z0 = 55.5, Z1 = 167.5, DRUMS = 12
  const pitch = (Z1 - Z0) / DRUMS
  wall(glass, glassRing, Z0, Z1)
  washer(concrete, c, sc, glassRing, Z0, false)
  for (let k = 0; k < DRUMS; k++) {
    const z0 = Z0 + k * pitch, z1 = k === DRUMS - 1 ? Z1 : z0 + pitch * 0.74
    smoothWall(concrete, sc, z0, z1)
  }
  // Flat roof, and a low penthouse barely over the top balcony ring.
  washer(roof, c, sc, glassRing, Z1, true)
  roof.cap(at(glassRing, Z1), true)
  const pent = circle(c, R_PENT, 12)
  wall(concrete, pent, Z1, Z1 + 3)
  roof.cap(at(pent, Z1 + 3), true)
}

const MC1: XY = [-27.06, -13.82], MC2: XY = [27.06, 13.82]
tower(MC1)
tower(MC2)

// ── The theatre (House of Blues) ─────────────────────────────────────────
// OSM way/1177923721, simplified: a box x -49.5..-5.5 with a rounded east
// end out to x 0.6, y 5..33.6. The roof is a gentle saddle: it sags along
// the building's length and crowns slightly across it.
{
  const X0 = -49.6, X1 = 0.6, Y0 = 5.0, Y1 = 33.6, R = (Y1 - Y0) / 2, XC = X1 - 6.2
  const half = (x: number) => {
    // Half-width of the plan at x: full width west of XC, an ellipse beyond.
    if (x <= XC) return R
    const t = (x - XC) / (X1 - XC)
    return R * Math.sqrt(Math.max(0, 1 - t * t))
  }
  const ym = (Y0 + Y1) / 2
  const crown = (x: number) => { const t = (2 * (x - X0)) / (X1 - X0) - 1; return 12 + 4 * t * t }
  const N = 14
  const xs = Array.from({ length: N + 1 }, (_, i) => X0 + ((X1 - X0) * i) / N)
  xs[N] = X1 - 0.01
  // South and north walls, the roof, and the pale rim along the roof edge.
  const RIM = 1.1
  for (let i = 0; i < N; i++) {
    const xa = xs[i], xb = xs[i + 1]
    const ha = half(xa), hb = half(xb), za = crown(xa), zb = crown(xb)
    // South wall (faces -y).
    slate.quad([xa, ym - ha, 0], [xb, ym - hb, 0], [xb, ym - hb, zb - RIM], [xa, ym - ha, za - RIM])
    concrete.quad([xa, ym - ha - 0.15, za - RIM], [xb, ym - hb - 0.15, zb - RIM], [xb, ym - hb - 0.15, zb + 0.2], [xa, ym - ha - 0.15, za + 0.2])
    // North wall (faces +y).
    slate.quad([xb, ym + hb, 0], [xa, ym + ha, 0], [xa, ym + ha, za - RIM], [xb, ym + hb, zb - RIM])
    concrete.quad([xb, ym + hb + 0.15, zb - RIM], [xa, ym + ha + 0.15, za - RIM], [xa, ym + ha + 0.15, za + 0.2], [xb, ym + hb + 0.15, zb + 0.2])
    // Roof strip, gently crowned across its width.
    const ridge = 0.8
    slate.quad([xa, ym - ha, za], [xb, ym - hb, zb], [xb, ym, zb + ridge], [xa, ym, za + ridge])
    slate.quad([xa, ym, za + ridge], [xb, ym, zb + ridge], [xb, ym + hb, zb], [xa, ym + ha, za])
  }
  // West end wall.
  const zw = crown(X0)
  slate.quad([X0, ym + R, 0], [X0, ym - R, 0], [X0, ym - R, zw - RIM], [X0, ym + R, zw - RIM])
  slate.tri([X0, ym + R, zw - RIM], [X0, ym - R, zw - RIM], [X0, ym, zw + 0.8])
  concrete.quad([X0 - 0.15, ym + R, zw - RIM], [X0 - 0.15, ym - R, zw - RIM], [X0 - 0.15, ym - R, zw + 0.2], [X0 - 0.15, ym + R, zw + 0.2])
}

const parts = [
  { part: concrete, material: finish('marina-concrete', 0xf1e7d4) },
  { part: glass, material: PALETTE.window },
  { part: dark, material: finish('garage-shadow', 0x5b6168) },
  { part: slate, material: finish('theatre-slate', 0x8b9096) },
  { part: roof, material: PALETTE.roof },
]
const triangles = parts.reduce((s, p) => s + p.part.triangles, 0)
const glb = writeGlb('Marina City', parts, {
  frame: 'Y up, -Z north, +X east; metres; ground anchor', anchor: [41.888083, -87.6288135], bearing: 0,
})
if (triangles > 6500 || glb.length > 250000) throw new Error(`Budget exceeded: ${triangles} triangles / ${glb.length} bytes`)
const out = process.argv[2] ?? new URL('../models/chi-marina-city.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
