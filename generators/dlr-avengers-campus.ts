/**
 * Avengers Headquarters, Avengers Campus, Disney California Adventure
 * (Anaheim): procedural, CC0-1.0.
 * bun generators/dlr-avengers-campus.ts
 *
 * Map frame: x east, y north, z up, metres, but turned so the model's north
 * (+y) points along bearing 315°, out of the building's front onto the campus
 * plaza: the catalog places it with bearing 315. The origin is the area
 * centroid of the OSM outline (way/980770821), on the ground (the park is
 * flat).
 *
 * What it is. A low, layered modern block (two tall storeys and a roof deck,
 * not a tower) on the east side of the plaza:
 *   - a pale grey ground storey, with glass doors on the plaza front;
 *   - a dark grey balcony slab that cantilevers out over the front and the
 *     south-west side, its fascia leaning outward;
 *   - a recessed band of blue glazing on the upper storey, with the
 *     Avengers "A" logo on a navy panel on the south-west face and a raking
 *     strut beside it;
 *   - a deep light-grey roof slab, cantilevered further still and drawn to a
 *     prow at the plaza corner, the "angled" look of the building;
 *   - the Quinjet perched nose-up on a pad on the roof, nose to the plaza;
 *   - a long, lower hangar wing running north-east towards Mission: Breakout,
 *     with its own overhanging roof.
 * The Quinjet and the logo are what make it the Avengers HQ; the layered
 * cantilevered slabs are what make it read as this building.
 *
 * Evidence.
 *   Measured: the plan, from the OSM outlines (HQ way/980770821, wing
 *     way/797193567, Quinjet way/983358329), checked against USGS NAIP
 *     (public domain) and the CC BY-SA aerial "Avengers Campus Progress at
 *     Disneyland Park California", which agree; the Quinjet's position,
 *     heading (nose to bearing ~326°, to the plaza) and plan size (about
 *     11.5 m long and 11.6 m across the wings) from the same.
 *   Published: nothing dimensional. OSM tags the HQ height 9 m and the
 *     wing 7 m, untagged as to source; the Quinjet part's 9–10.6 m is plainly
 *     a placeholder and is not used.
 *   Estimated (from people and doors in the photos): ground storey 5 m,
 *     balcony slab 5–6 m, upper storey to 9 m, roof slab to 10.6 m, so the
 *     roof sits a little above OSM's 9 m; the Quinjet's pad 1.3 m, its hull
 *     about 13 m long and its top about 16 m; the overhangs (balcony 1.5–1.7 m, roof 1.6 m on the logo side and 2.7 m over the plaza); the wing at
 *     8.5 m rather than OSM's 7, because the wing-side photo shows hangar
 *     doors with a glazed level and a roof slab above them.
 *   Invented: the rear (south-east) side, which no photo shows, is drawn
 *     plain; the penthouse behind the Quinjet is sized from the aerial only.
 *
 * Photos: Wikimedia Commons, Jeremy Thompson, CC BY 2.0: "Disney California
 * Adventure (51242016469)" (from the south-west, logo face, Mission:
 * Breakout behind), "(51241448038)" (logo panel), "(51241249771)",
 * "(51241250136)" (Quinjet), "(51241250021)" (the wing's hangar doors);
 * "Avengers Campus (Disney California Adventure) 1 2023-06-03" (FASTILY,
 * CC BY-SA 4.0, the plaza front); "Avengers Campus Progress at Disneyland
 * Park California" (Michaelestigoy, CC BY-SA 4.0, aerial). Plan: OSM and
 * USGS NAIP. Disney's own media was not used.
 *
 * Style: the building's cool pale grey is a finish near the palette's
 * lightness; the dark fascia stays dark because the dark bands are the
 * building's pattern, at the charcoal floor; the logo panel's navy is kept
 * as identity, pulled lighter. The logo is drawn as flat block shapes on
 * its panel, the STYLE.md exception for a sign that is the landmark.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

type XY = [number, number]

// ------------------------------------------------------------------ plan ----
const REF = { lon: -117.91755, lat: 33.80643 }
const MX = 111320 * Math.cos((REF.lat * Math.PI) / 180), MY = 110946
const BEARING = 315
const TH = (BEARING * Math.PI) / 180, SN = Math.sin(TH), CS = Math.cos(TH)
/** lon/lat → the model's turned frame (before the anchor shift). */
const M = ([lon, lat]: XY): XY => {
  const e = (lon - REF.lon) * MX, n = (lat - REF.lat) * MY
  return [e * CS - n * SN, e * SN + n * CS]
}

// way/980770821, the HQ outline.
const HQ: XY[] = ([
  [-117.9176283, 33.806383], [-117.9176205, 33.806388], [-117.9174543, 33.806244], [-117.9174278, 33.8062635],
  [-117.9174904, 33.806323], [-117.9174477, 33.8063546], [-117.9174406, 33.8063482], [-117.917417, 33.8063647],
  [-117.9174246, 33.8063718], [-117.9174191, 33.8063758], [-117.9174217, 33.8064209], [-117.9174047, 33.8064352],
  [-117.917449, 33.8064764], [-117.9174584, 33.8064699], [-117.9174699, 33.8064815], [-117.9175129, 33.8065236],
  [-117.9175176, 33.806528], [-117.9175398, 33.8065488], [-117.9175664, 33.8065287], [-117.9175955, 33.8065068],
  [-117.9176166, 33.8064909], [-117.9176858, 33.8064404],
] as XY[]).map(M)
// way/797193567, the hangar wing.
const WING: XY[] = ([
  [-117.9173803, 33.8066633], [-117.9173769, 33.8066653], [-117.917341, 33.8066904], [-117.9173286, 33.8066785],
  [-117.9172672, 33.8066191], [-117.9172788, 33.8066108], [-117.9173932, 33.806537], [-117.9174699, 33.8064815],
  [-117.9175129, 33.8065236], [-117.9174139, 33.8065965], [-117.9173938, 33.806611], [-117.9173853, 33.8066171],
  [-117.9173939, 33.806626], [-117.9174088, 33.8066413], [-117.9173934, 33.8066535],
] as XY[]).map(M)

const signedArea = (p: XY[]) => p.reduce((s, a, i) => s + a[0] * p[(i + 1) % p.length][1] - p[(i + 1) % p.length][0] * a[1], 0) / 2
const ccw = (p: XY[]) => (signedArea(p) < 0 ? [...p].reverse() : p)
// The anchor: the HQ outline's area centroid.
const ANCHOR = (() => {
  let a = 0, cx = 0, cy = 0
  for (let i = 0; i < HQ.length; i++) {
    const [x0, y0] = HQ[i], [x1, y1] = HQ[(i + 1) % HQ.length], k = x0 * y1 - x1 * y0
    a += k; cx += (x0 + x1) * k; cy += (y0 + y1) * k
  }
  return [cx / (3 * a), cy / (3 * a)] as XY
})()

// ------------------------------------------------------------- helpers ----
/** Ear-clipping triangulation of a simple polygon (counter-clockwise). */
function earClip(poly: XY[]): [XY, XY, XY][] {
  const p = ccw(poly), idx = p.map((_, i) => i), out: [XY, XY, XY][] = []
  const cr = (o: XY, a: XY, b: XY) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])
  let guard = 0
  while (idx.length > 3 && guard++ < 10000) {
    let cut = false
    for (let i = 0; i < idx.length; i++) {
      const ia = idx[(i - 1 + idx.length) % idx.length], ib = idx[i], ic = idx[(i + 1) % idx.length]
      const A = p[ia], B = p[ib], C = p[ic]
      if (cr(A, B, C) <= 1e-9) continue
      if (idx.some((j) => j !== ia && j !== ib && j !== ic && cr(A, B, p[j]) >= -1e-9 && cr(B, C, p[j]) >= -1e-9 && cr(C, A, p[j]) >= -1e-9)) continue
      out.push([A, B, C]); idx.splice(i, 1); cut = true
      break
    }
    if (!cut) idx.splice(0, 1)
  }
  if (idx.length === 3) out.push([p[idx[0]], p[idx[1]], p[idx[2]]])
  return out
}

/** A flat cap over any simple polygon at height z. */
function cap(part: Part, poly: XY[], z: number, up = true) {
  for (const [a, b, c] of earClip(poly)) {
    if (up) part.tri([a[0], a[1], z], [b[0], b[1], z], [c[0], c[1], z])
    else part.tri([a[0], a[1], z], [c[0], c[1], z], [b[0], b[1], z])
  }
}

/** Walls of a polygon from z0 to z1, outward-facing. */
function walls(part: Part, poly: XY[], z0: number, z1: number) {
  const p = ccw(poly)
  for (let i = 0; i < p.length; i++) {
    const a = p[i], b = p[(i + 1) % p.length]
    part.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
  }
}

type Sides = { w?: number; e?: number; s?: number; n?: number }
/** A rectangle grown by per-side offsets, with an optional prow pulled out of its north-west corner. */
function rect(x0: number, x1: number, y0: number, y1: number, o: Sides = {}, prow = 0): XY[] {
  const X0 = x0 - (o.w ?? 0), X1 = x1 + (o.e ?? 0), Y0 = y0 - (o.s ?? 0), Y1 = y1 + (o.n ?? 0)
  if (!prow) return [[X0, Y0], [X1, Y0], [X1, Y1], [X0, Y1]]
  return [[X0, Y0], [X1, Y0], [X1, Y1], [X0 + prow * 2.5, Y1], [X0 - prow * 0.6, Y1 + prow * 0.6], [X0, Y1 - prow * 2.5]]
}

/**
 * A slab whose fascia leans: the ring at z0 and the ring at z1 differ (same
 * vertex count), walls lofted between, a top and a soffit.
 */
function flared(fascia: Part, top: Part | null, soffit: Part | null, bottom: XY[], upper: XY[], z0: number, z1: number) {
  const b = ccw(bottom), u = ccw(upper)
  for (let i = 0; i < b.length; i++) {
    const j = (i + 1) % b.length
    fascia.quad([b[i][0], b[i][1], z0], [b[j][0], b[j][1], z0], [u[j][0], u[j][1], z1], [u[i][0], u[i][1], z1])
  }
  if (top) cap(top, u, z1, true)
  if (soffit) cap(soffit, b, z0, false)
}

/** A quad turned to face `n`, whatever order its corners come in. */
function face(part: Part, q: V3[], n: V3) {
  const a = q[0], b = q[1], c = q[2]
  const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  const cx = u[1] * v[2] - u[2] * v[1], cy = u[2] * v[0] - u[0] * v[2], cz = u[0] * v[1] - u[1] * v[0]
  const pts = cx * n[0] + cy * n[1] + cz * n[2] < 0 ? [...q].reverse() : q
  for (let i = 1; i < pts.length - 1; i++) part.tri(pts[0], pts[i], pts[i + 1])
}

/** An oriented box: centre, unit axis u in plan, half-lengths, z0..z1. */
function box(part: Part, c: XY, hu: number, hv: number, z0: number, z1: number, u: XY = [1, 0], topPart: Part | null = part) {
  const v: XY = [-u[1], u[0]]
  const P = (su: number, sv: number): XY => [c[0] + u[0] * hu * su + v[0] * hv * sv, c[1] + u[1] * hu * su + v[1] * hv * sv]
  const ring = [P(-1, -1), P(1, -1), P(1, 1), P(-1, 1)]
  walls(part, ring, z0, z1)
  if (topPart) cap(topPart, ring, z1, true)
}

// ----------------------------------------------------------- materials ----
const panel = new Part()   // pale grey cladding
const dark = new Part()    // dark grey fascias, Quinjet underside
const glazing = new Part() // blue glass bands
const roof = new Part()
const light = new Part()   // white: the logo, the Quinjet's upper hull
const navy = new Part()    // the logo panel

// ------------------------------------------------------------ the HQ ----
// The main block, in the turned frame: the plaza front at y = 9.2, the
// south-west (logo) face at x = -8.8.
const X0 = -8.8, X1 = 10.0, Y0 = -9.1, Y1 = 9.2
const GROUND = 5.0, BAL = 6.0, UP = 9.0, TOP = 10.6

// Ground storey over the whole OSM outline, so the model covers what it replaces.
walls(panel, HQ, 0, GROUND)
cap(roof, HQ, GROUND)
// Glass doors on the plaza front, and a glazed bay on the south-west face.
// (The front's line runs a degree off the frame, so the panels sit at its real face.)
const frontY = (x: number) => 9.7 - (x + 8.1) * (1.0 / 18.1) + 0.06
face(glazing, [[-4.0, frontY(-4.0), 0.2], [2.6, frontY(2.6), 0.2], [2.6, frontY(2.6), 3.8], [-4.0, frontY(-4.0), 3.8]], [0, 1, 0])
// A light louvre bay beside the doors.
face(light, [[3.2, frontY(3.2), 0.4], [7.6, frontY(7.6), 0.4], [7.6, frontY(7.6), 4.4], [3.2, frontY(3.2), 4.4]], [0, 1, 0])
// The raking parallelogram window on the logo face, under the balcony.
// (South of the jog at y = 1.3 the OSM wall runs at x ≈ -8.1, not -8.8.)
const westX = (y: number) => -8.3 + (y + 20.9) * (0.4 / 22.2) - 0.06
face(glazing, [[westX(-4.4), -4.4, 0.8], [westX(1.0), 1.0, 0.8], [westX(-1.2), -1.2, 3.9], [westX(-6.6), -6.6, 3.9]], [-1, 0, 0])

// The balcony slab: dark, leaning out over the front and the south-west side.
flared(dark, roof, dark,
  rect(X0, X1, Y0, Y1, { w: 0.8, n: 1.0 }),
  rect(X0, X1, Y0, Y1, { w: 1.5, n: 1.7 }),
  GROUND, BAL)

// The upper storey: a recessed glass band.
const UX0 = X0 + 0.7, UY1 = Y1 - 0.8
walls(glazing, rect(UX0, X1, Y0, UY1), BAL, UP)

// The logo panel on the south-west face: navy, its north edge raked like the
// strut beside it, carrying the Avengers "A" in its ring.
{
  const xf = UX0 - 0.05
  face(navy, [[xf, -7.6, BAL], [xf, 1.4, BAL], [xf, -0.8, UP], [xf, -7.6, UP]], [-1, 0, 0])
  const yc = -3.9, zc = (BAL + UP) / 2, R = 1.42
  const P = (h: number, v: number): V3 => [xf - 0.05, yc - h * R, zc + v * R] // h to the viewer's right (−y)
  const N: V3 = [-1, 0, 0]
  // The ring, open where the crossbar's arrow breaks out on the right.
  const seg = 20
  for (let k = 0; k < seg; k++) {
    const a0 = (k / seg) * Math.PI * 2, a1 = ((k + 1) / seg) * Math.PI * 2
    const mid = (a0 + a1) / 2
    if (mid > -0.05 && mid < 0.45) continue
    const c0 = Math.cos(a0), s0 = Math.sin(a0), c1 = Math.cos(a1), s1 = Math.sin(a1)
    face(light, [P(c0 * 0.78, s0 * 0.78), P(c1 * 0.78, s1 * 0.78), P(c1, s1), P(c0, s0)], N)
  }
  // The A: a raking left leg, an upright right leg, and the crossbar ending in an arrow.
  face(light, [P(-0.72, -0.78), P(-0.42, -0.78), P(0.2, 0.9), P(-0.08, 0.9)], N)
  face(light, [P(0.1, 0.9), P(0.36, 0.9), P(0.36, -0.78), P(0.1, -0.78)], N)
  face(light, [P(-0.48, -0.3), P(0.9, -0.3), P(0.9, -0.06), P(-0.48, -0.06)], N)
  face(light, [P(0.9, -0.42), P(1.22, -0.18), P(0.9, 0.06)], N)
}

// The raking strut along the logo panel's edge, rising towards the south-east
// from the balcony to the roof slab, as in the photos.
{
  const x = UX0 - 0.35, w = 0.3
  const sec = (y: number, z: number): V3[] => [[x - w, y - w, z], [x + w, y - w, z], [x + w, y + w, z], [x - w, y + w, z]]
  panel.loft([sec(1.9, BAL), sec(-0.3, UP)])
}

// The roof slab: light grey, deeper still over the front and south-west,
// pulled to a prow at the plaza corner; a dark soffit underneath.
flared(panel, roof, dark,
  rect(X0, X1, Y0, Y1, { w: 1.0, n: 1.9, e: 0.2, s: 0.2 }, 1.2),
  rect(X0, X1, Y0, Y1, { w: 1.6, n: 2.7, e: 0.3, s: 0.3 }, 1.6),
  UP, TOP)

// The rear strip along the south-west side, beyond the main block.
box(panel, [-6.7, -15.1], 1.7, 6.0, GROUND, 8.0, [1, 0], roof)

// The penthouse behind the Quinjet, and the Quinjet's pad.
box(panel, [-1.0, -6.6], 6.0, 2.0, TOP, 12.4, [1, 0], roof)
box(dark, [-0.6, 1.6], 1.9, 2.8, TOP, TOP + 1.3, [1, 0], roof)

// --------------------------------------------------------- the wing ----
// Hangar doors and a glazed level under a slab that overhangs the plaza side.
{
  const WH = 8.5
  walls(panel, WING, 0, 5.4)
  cap(roof, WING, 5.4)
  // Glass band along the wing's whole run, set back from the footprint.
  const band: XY[] = [[9.5, -3.2], [33.0, -3.4], [33.4, 6.4], [26.2, 6.6], [26.0, 3.6], [9.9, 4.2]]
  walls(glazing, band, 5.4, 7.6)
  // Its roof slab, overhanging the north-west side by about 1.3 m.
  const lip: XY[] = [[9.3, -3.7], [33.4, -3.8], [34.2, 7.0], [25.5, 7.6], [25.3, 5.3], [9.6, 5.9]]
  flared(dark, roof, dark, lip, lip.map(([x, y]) => [x, y + (y > 0 ? 0.35 : 0)] as XY), 7.6, WH)
}

// ------------------------------------------------------------ Quinjet ----
// Nose to the plaza (+y), raised 8°; about 12 m long and 11.6 m across.
{
  const cx = -0.6, cy = 1.4, z0 = TOP + 1.3 + 1.1, pitch = Math.tan((9 * Math.PI) / 180), K = 1.1
  // Stations along the hull: [u along the axis (+ = nose), half-width, half-height].
  const st: [number, number, number][] = [
    [6.4, 0.12, 0.12], [5.6, 0.62, 0.55], [4.2, 1.05, 0.95], [2.0, 1.3, 1.0], [-1.0, 1.25, 0.85], [-3.6, 1.0, 0.65], [-5.6, 0.6, 0.4],
  ]
  const at = (u: number, x: number, h: number): V3 => [cx + x * K, cy + u * K, z0 + u * K * pitch + h * K]
  const ring = ([u, w, h]: [number, number, number]): V3[] => [
    at(u, w, 0), at(u, w * 0.45, h), at(u, -w * 0.45, h), at(u, -w, 0), at(u, -w * 0.45, -h * 0.9), at(u, w * 0.45, -h * 0.9),
  ]
  const rings = st.map(ring)
  for (let k = 0; k + 1 < rings.length; k++) {
    // From the side, rings run nose → tail; each face is coloured by whether it
    // looks up (the white hull) or down (the dark belly). The cockpit is dark.
    for (let i = 0; i < 6; i++) {
      const j = (i + 1) % 6
      const a = rings[k][i], b = rings[k][j], c = rings[k + 1][j], d = rings[k + 1][i]
      const up = i <= 2
      const cockpit = i === 1 && k <= 1
      const part = cockpit ? dark : up ? light : dark
      // Outward: from the hull's axis to the face's middle.
      const m = [(a[0] + b[0] + c[0] + d[0]) / 4, (a[1] + b[1] + c[1] + d[1]) / 4, (a[2] + b[2] + c[2] + d[2]) / 4]
      const uMid = (st[k][0] + st[k + 1][0]) / 2, axis = at(uMid, 0, 0)
      face(part, [a, b, c, d], [m[0] - axis[0], m[1] - axis[1], m[2] - axis[2]])
    }
  }
  // Tail cap.
  const t = rings[rings.length - 1]
  face(dark, t, [0, -1, 0])
  // Delta wings, swept back and drooping, white above and dark below.
  for (const sgn of [1, -1]) {
    const root0 = at(1.6, sgn * 1.2, -0.2), root1 = at(-4.8, sgn * 0.9, -0.2), tip = at(-3.8, sgn * 5.9, -1.0)
    const T: V3 = [0, 0, 0.22]
    const up = (p: V3): V3 => [p[0] + T[0], p[1] + T[1], p[2] + T[2]]
    face(light, [up(root0), up(root1), up(tip)], [0, 0, 1])
    face(dark, [root0, root1, tip], [0, 0, -1])
    face(dark, [root0, tip, up(tip), up(root0)], [sgn, 1, 0])
    face(dark, [root1, tip, up(tip), up(root1)], [sgn * 0.2, -1, 0])
    // Twin fins at the tail, canted outward.
    const f0 = at(-3.4, sgn * 0.55, 0.5), f1 = at(-5.6, sgn * 0.4, 0.3)
    const f2 = [f1[0] + sgn * 0.8, f1[1] - 0.3, f1[2] + 2.1] as V3, f3 = [f0[0] + sgn * 0.8, f0[1] - 1.5, f0[2] + 2.1] as V3
    face(light, [f0, f1, f2, f3], [sgn, 0, 0.3])
    face(light, [f0, f3, f2, f1], [-sgn, 0, -0.3])
  }
  // Two struts down to the pad.
  for (const u of [3.2, -2.4]) box(dark, [cx, cy + u * K], 0.35, 0.35, TOP + 1.3, z0 + u * K * pitch - 0.8)
}

// --------------------------------------------------------------- write ----
const parts = [
  { part: panel, material: finish('hq-grey', 0xd9dcdf) },
  { part: dark, material: finish('hq-charcoal', 0x5d636b) },
  { part: glazing, material: { ...PALETTE.window, color: 0x6b85a3 } },
  { part: roof, material: PALETTE.roof },
  { part: light, material: { ...PALETTE.trim, color: 0xf2f3f4 } },
  { part: navy, material: finish('avengers-navy', 0x4f6390) },
]
// Shift everything so the anchor is the origin (Part stores glTF x, z, -y).
for (const { part } of parts)
  for (let i = 0; i < part.pos.length; i += 3) { part.pos[i] -= ANCHOR[0]; part.pos[i + 2] += ANCHOR[1] }

const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Avengers Headquarters', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: BEARING, elevation: 0,
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/dlr-avengers-campus.glb', import.meta.url).pathname
await Bun.write(out, glb)
// The anchor back in lon/lat: undo the turn.
const e = ANCHOR[0] * CS + ANCHOR[1] * SN, n = -ANCHOR[0] * SN + ANCHOR[1] * CS
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
console.log(`anchor ${(REF.lon + e / MX).toFixed(7)}, ${(REF.lat + n / MY).toFixed(7)}`)
