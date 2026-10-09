/**
 * Lincoln Memorial — procedural, CC0-1.0, no textures.
 * bun generators/dc-lincoln-memorial.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the centroid of the OSM
 * outline (way/398769543), whose long axis runs due north, so the model is
 * placed at bearing 0. The temple faces east, down the Reflecting Pool.
 *
 * What is modelled, from the ground up: the granite retaining wall of the
 * terrace with its lawn on top; the three great steps of the base; the
 * marble stylobate and the peristyle of 36 Doric columns (12 on the long
 * east and west fronts, 8 on the ends), plus the two columns standing in
 * the east doorway; the entablature with its projecting cornice; the
 * peristyle roof; the recessed attic, and the three hipped skylights inside
 * its parapet; the open east portal; and the two flights of the east stairs,
 * the lower one between granite cheek walls ending in pedestals.
 *
 * Evidence:
 * - OSM, way/398769543 and its building:parts: the outline (37.2 × 57.4 m);
 *   the terrace 443679934 (57 × 78 m, 4.3 m, grass roof); the base steps
 *   443679932 (5.3 m) and 443679931 (6.3 m); the stylobate 443679943
 *   (7.3 m); 38 columns (2.3 m across); the entablature 443679944
 *   (20–24 m); the attic / cella walls 443679933 and 443679939 (to 30 m, a
 *   27.1 × 43.4 m ring open to the east between y −6.2 and 7.4); the
 *   interior ceiling 443679941; three glass skylights 443679935–937
 *   (gabled, 26–30 m); the upper flight 443679965 (7.3 → 4.3 m), the landing
 *   and cheek walls 443679930 (4.3 m) and the lower flight 443679938
 *   (4.3 → 0 m).
 * - Published (NPS; Wikipedia "Lincoln Memorial"; NRHP 66000030): the
 *   building is 189.7 × 118.5 ft (57.8 × 36.1 m) and 99 ft (30 m) tall; the
 *   36 columns are 44 ft (13.4 m) tall and 7.5 ft (2.3 m) across at the
 *   base; the granite retaining wall is 187 × 257 ft (57 × 78 m) and 14 ft
 *   (4.3 m) high.
 * - Photos (Wikimedia Commons): "Lincoln Memorial east side.JPG" (Martin
 *   Falbisoner, CC BY-SA 3.0); "Exterior of the Lincoln Memorial (north
 *   side) 20240601.jpg" (颐园居, CC BY-SA 4.0); "Aerial view of Lincoln
 *   Memorial - east side EDIT.jpeg" (Carol M. Highsmith, public domain);
 *   "Aerial view of Lincoln Memorial - west side.jpg" (Carol M. Highsmith,
 *   public domain); "Lincoln Memorial Aerial - March 2013" (formulanone,
 *   CC BY-SA 2.0).
 *
 * Estimated: the split of the 22.7 m above the stylobate into columns
 * (13.4 m with capital), entablature (4.4 m) and attic (4.9 m), read off the
 * level north-side photo against the published column height (from the
 * east front the cornice hides the foot of the attic); the skylight pitch;
 * the pedestal height (photo); the step counts (drawn coarser than the real
 * risers so they read). The peristyle roof is the library roof grey pulled
 * a step darker toward the dark membrane in the aerials. OSM's parts sit
 * up to 0.6 m off-centre; the model is exactly symmetric about y = 0.
 * Not modelled: the frieze garlands, the eagle cresting and the state names
 * (too fine), the tripod braziers on the pedestals, the statue (inside), the
 * plaza and stairs below the lower flight (way/1551348210, a separate
 * building), and any water.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

export type XY = [number, number]

// ---------------------------------------------------------------------------
// Small solid-building kit, shared with dc-jefferson-memorial.

const unit = (v: V3): V3 => { const l = Math.hypot(...v) || 1; return [v[0] / l, v[1] / l, v[2] / l] }

/** A rectangle with 45° chamfered corners, counter-clockwise from above. */
export function rect(x0: number, x1: number, y0: number, y1: number, c = 0.3): XY[] {
  if (c <= 0) return [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
  return [[x0 + c, y0], [x1 - c, y0], [x1, y0 + c], [x1, y1 - c], [x1 - c, y1], [x0 + c, y1], [x0, y1 - c], [x0, y0 + c]]
}

/** A regular polygon ring, counter-clockwise from above. */
export function circle(cx: number, cy: number, r: number, n: number, a0 = 0): XY[] {
  return Array.from({ length: n }, (_, k) => {
    const a = a0 + (k * 2 * Math.PI) / n
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as XY
  })
}

/** Vertical walls round a convex (or star-shaped about its first point) ring, with optional caps. */
export function prism(p: Part, ring: XY[], z0: number, z1: number, top = true, bottom = false) {
  const lo = ring.map(([x, y]) => [x, y, z0] as V3), hi = ring.map(([x, y]) => [x, y, z1] as V3)
  p.loft([lo, hi])
  if (top) p.cap(hi, true)
  if (bottom) p.cap(lo, false)
}

/** A flat convex polygon at height z, facing up. */
export function floor(p: Part, ring: XY[], z: number) {
  p.cap(ring.map(([x, y]) => [x, y, z] as V3), true)
}

/** A smooth-shaded tapering cylinder, top capped. */
export function column(p: Part, cx: number, cy: number, z0: number, z1: number, r0: number, r1: number, n = 12, top = false) {
  const slope = (r0 - r1) / (z1 - z0)
  for (let k = 0; k < n; k++) {
    const a = (k * 2 * Math.PI) / n, b = ((k + 1) * 2 * Math.PI) / n
    const P = (ang: number, r: number, z: number): V3 => [cx + r * Math.cos(ang), cy + r * Math.sin(ang), z]
    const N = (ang: number): V3 => unit([Math.cos(ang), Math.sin(ang), slope])
    const na = N(a), nb = N(b)
    p.tri(P(a, r0, z0), P(b, r0, z0), P(b, r1, z1), undefined, undefined, undefined, [na, nb, nb])
    p.tri(P(a, r0, z0), P(b, r1, z1), P(a, r1, z1), undefined, undefined, undefined, [na, nb, na])
  }
  if (top) p.cap(circle(cx, cy, r1, n).map(([x, y]) => [x, y, z1] as V3), true)
}

/**
 * A straight flight of `n` steps, solid down to `zBase`, between `w0` and
 * `w1` across it. It climbs from `zLow` at `t0` to `zHigh` at `t1` along the
 * axis `axis` (0 = +x, 1 = +y, 2 = −x, 3 = −y), so the treads face that way
 * round. Closed at the sides; the back is left open against the landing.
 */
export function flight(p: Part, axis: number, t0: number, t1: number, w0: number, w1: number, zLow: number, zHigh: number, n: number, zBase = 0) {
  // Local (t, w) → map (x, y): t along the climb, w across it.
  const a = (axis * Math.PI) / 2, c = Math.round(Math.cos(a)), s = Math.round(Math.sin(a))
  const P = (t: number, w: number, z: number): V3 => [t * c - w * s, t * s + w * c, z]
  const run = (t1 - t0) / n, rise = (zHigh - zLow) / n
  for (let k = 0; k < n; k++) {
    const ta = t0 + k * run, tb = ta + run, z = zLow + (k + 1) * rise
    const lo = Math.min(ta, tb), hi = Math.max(ta, tb)
    // Riser at t = ta, from z − rise to z, facing down the flight.
    quadFacing(p, [P(ta, w0, z - rise), P(ta, w1, z - rise), P(ta, w1, z), P(ta, w0, z)], run > 0 ? -1 : 1, c, s, 't')
    // tread
    quadUp(p, [P(lo, w0, z), P(hi, w0, z), P(hi, w1, z), P(lo, w1, z)])
    // sides, down to the base
    for (const w of [w0, w1]) {
      quadFacing(p, [P(lo, w, zBase), P(hi, w, zBase), P(hi, w, z), P(lo, w, z)], w === Math.min(w0, w1) ? -1 : 1, c, s, 'w')
    }
  }
}

/** Emit a quad with its winding fixed so it faces `sign` along local t or w. */
function quadFacing(p: Part, q: V3[], sign: number, c: number, s: number, along: 't' | 'w') {
  const dir: V3 = along === 't' ? [c * sign, s * sign, 0] : [-s * sign, c * sign, 0]
  orient(p, q, dir)
}
function quadUp(p: Part, q: V3[]) { orient(p, q, [0, 0, 1]) }

/** A quad wound so its normal points along `dir`. */
export function orient(p: Part, q: V3[], dir: V3) {
  const [a, b, c, d] = q
  const u: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v: V3 = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  const n: V3 = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
  if (n[0] * dir[0] + n[1] * dir[1] + n[2] * dir[2] >= 0) p.quad(a, b, c, d)
  else p.quad(a, d, c, b)
}

/** A hipped roof over a rectangle: ridge along y, inset by `end` of the length at each end, from eave z0 to ridge z1. */
export function hipRoof(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, end = 0.25) {
  const xm = (x0 + x1) / 2
  const ya = y0 + (y1 - y0) * end, yb = y1 - (y1 - y0) * end
  const A: V3 = [x0, y0, z0], B: V3 = [x1, y0, z0], C: V3 = [x1, y1, z0], D: V3 = [x0, y1, z0]
  const R0: V3 = [xm, ya, z1], R1: V3 = [xm, yb, z1]
  p.tri(A, B, R0); p.tri(C, D, R1)
  p.quad(B, C, R1, R0); p.quad(D, A, R0, R1)
}

// ---------------------------------------------------------------------------

if (import.meta.main) {
  const marble = new Part(), granite = new Part(), roof = new Part()
  const glass = new Part(), lawn = new Part(), portal = new Part()

  // Heights (m above the drive round the terrace).
  const TERRACE = 4.3, STEP1 = 5.3, STEP2 = 6.3, STYLO = 7.3
  const COL_TOP = 20.7, ARCH_TOP = 22.3, CORNICE0 = 24.3, ENT_TOP = 25.1
  const ATTIC_ROOF = 27.9, ATTIC_TOP = 30.0

  // Plan (half sizes).
  const TX0 = -28.3, TX1 = 28.7, TY = 39.2         // terrace retaining wall
  const S1 = [20.8, 30.7], S2 = [19.7, 29.8], SB = [18.6, 28.7] // base steps, stylobate
  const CX = 17.0, CY = 27.1                         // column centre lines
  const AX = 13.5, AY = 21.7, AW = 1.2              // attic / cella, parapet thickness
  const STAIR_W = 13.85, LOWER_W = 12.15            // half widths of the flights
  const UP_X1 = 23.4, LOW_X0 = 28.7, LOW_X1 = 36.0  // flights along x
  const PORTAL_W = 6.8, PORTAL_D = 2.2

  // Terrace: granite wall, lawn on top, marble landing in front of the stairs.
  prism(granite, rect(TX0, TX1, -TY, TY, 0), 0, TERRACE, false)
  const L = TERRACE
  for (const r of [
    [TX0, -S1[0], -TY, TY], [-S1[0], TX1, S1[1], TY], [-S1[0], TX1, -TY, -S1[1]],
    [S1[0], TX1, STAIR_W, S1[1]], [S1[0], TX1, -S1[1], -STAIR_W],
  ] as [number, number, number, number][]) floor(lawn, rect(r[0], r[1], r[2], r[3], 0), L)
  floor(marble, rect(UP_X1, TX1, -STAIR_W, STAIR_W, 0), L)

  // The three great steps of the base and the stylobate.
  prism(marble, rect(-S1[0], S1[0], -S1[1], S1[1], 0.2), TERRACE, STEP1)
  prism(marble, rect(-S2[0], S2[0], -S2[1], S2[1], 0.2), STEP1, STEP2)
  prism(marble, rect(-SB[0], SB[0], -SB[1], SB[1], 0.2), STEP2, STYLO)

  // East stairs: the upper flight from the stylobate to the landing, then the
  // lower flight between cheek walls down to the plaza.
  flight(marble, 2, -UP_X1, -SB[0], -STAIR_W, STAIR_W, TERRACE, STYLO, 8, TERRACE)
  flight(marble, 2, -LOW_X1, -LOW_X0, -LOWER_W, LOWER_W, 0, TERRACE, 11, 0)
  for (const sgn of [-1, 1]) {
    const w0 = sgn * LOWER_W, w1 = sgn * STAIR_W
    prism(granite, rect(LOW_X0, LOW_X1 - 2.6, Math.min(w0, w1), Math.max(w0, w1), 0.15), 0, TERRACE + 0.25)
    // Pedestal at the foot of the flight (the tripods on top are left out).
    prism(granite, rect(LOW_X1 - 2.6, LOW_X1, Math.min(w0, w1) - 0.15, Math.max(w0, w1) + 0.15, 0.2), 0, 6.1)
    prism(granite, rect(LOW_X1 - 2.75, LOW_X1 + 0.15, Math.min(w0, w1) - 0.3, Math.max(w0, w1) + 0.3, 0.2), 5.7, 6.1)
  }

  // Peristyle: 12 columns on the long fronts, 8 on the ends, corners shared,
  // and two in the east doorway.
  const cols: XY[] = []
  for (let k = 0; k < 12; k++) for (const sx of [-1, 1]) cols.push([sx * CX, -CY + (k * 2 * CY) / 11])
  for (let k = 1; k < 7; k++) for (const sy of [-1, 1]) cols.push([-CX + (k * 2 * CX) / 7, sy * CY])
  cols.push([AX - 0.9, -2.7], [AX - 0.9, 2.7])
  const ECH = COL_TOP - 1.0, ABA = COL_TOP - 0.5
  for (const [x, y] of cols) {
    column(marble, x, y, STYLO, ECH, 1.15, 0.92, 12)
    column(marble, x, y, ECH, ABA, 0.92, 1.28, 12)            // echinus
    prism(marble, rect(x - 1.32, x + 1.32, y - 1.32, y + 1.32, 0.1), ABA, COL_TOP, false) // abacus
  }

  // Cella below the peristyle ceiling, with the open east portal.
  const cella = (z0: number, z1: number) => {
    // West, north and south walls and the two east piers, as one ring with the portal cut back.
    const ring: XY[] = [[-AX, -AY], [AX, -AY], [AX, -PORTAL_W], [AX - PORTAL_D, -PORTAL_W],
      [AX - PORTAL_D, PORTAL_W], [AX, PORTAL_W], [AX, AY], [-AX, AY]]
    const lo = ring.map(([x, y]) => [x, y, z0] as V3), hi = ring.map(([x, y]) => [x, y, z1] as V3)
    for (let i = 0; i < ring.length; i++) {
      const j = (i + 1) % ring.length
      // The back wall of the portal is the dark, lit-at-night interior.
      const back = i === 3
      ;(back ? portal : marble).quad(lo[i], lo[j], hi[j], hi[i])
    }
  }
  cella(STYLO, COL_TOP)

  // Entablature: architrave and frieze flush with the abacus line, the
  // cornice projecting to the stylobate edge.
  const EX = CX + 1.25, EY = CY + 1.25
  prism(marble, rect(-EX, EX, -EY, EY, 0.25), COL_TOP, CORNICE0, false)
  // A shallow shadow line between architrave and frieze.
  prism(marble, rect(-EX - 0.12, EX + 0.12, -EY - 0.12, EY + 0.12, 0.3), COL_TOP, ARCH_TOP, false)
  orient(marble, [[-EX - 0.12, -EY - 0.12, ARCH_TOP], [EX + 0.12, -EY - 0.12, ARCH_TOP], [EX + 0.12, EY + 0.12, ARCH_TOP], [-EX - 0.12, EY + 0.12, ARCH_TOP]], [0, 0, 1])
  prism(marble, rect(-SB[0], SB[0], -SB[1], SB[1], 0.35), CORNICE0, ENT_TOP, false)
  // Undersides of the projections, visible from below.
  orient(marble, [[-SB[0], -SB[1], CORNICE0], [SB[0], -SB[1], CORNICE0], [SB[0], SB[1], CORNICE0], [-SB[0], SB[1], CORNICE0]], [0, 0, -1])
  orient(marble, [[-EX, -EY, COL_TOP], [EX, -EY, COL_TOP], [EX, EY, COL_TOP], [-EX, EY, COL_TOP]], [0, 0, -1])
  // Peristyle roof between the cornice and the attic.
  floor(roof, rect(-SB[0] + 0.2, SB[0] - 0.2, -SB[1] + 0.2, SB[1] - 0.2, 0.2), ENT_TOP)

  // Attic: plain marble walls with a capping lip, a parapet round the roof,
  // and three hipped skylights.
  prism(marble, rect(-AX, AX, -AY, AY, 0.3), ENT_TOP, ATTIC_TOP - 0.4, false)
  prism(marble, rect(-AX - 0.25, AX + 0.25, -AY - 0.25, AY + 0.25, 0.4), ATTIC_TOP - 0.4, ATTIC_TOP, false)
  orient(marble, [[-AX - 0.25, -AY - 0.25, ATTIC_TOP - 0.4], [AX + 0.25, -AY - 0.25, ATTIC_TOP - 0.4], [AX + 0.25, AY + 0.25, ATTIC_TOP - 0.4], [-AX - 0.25, AY + 0.25, ATTIC_TOP - 0.4]], [0, 0, -1])
  {
    const o = rect(-AX - 0.25, AX + 0.25, -AY - 0.25, AY + 0.25, 0.4), i = rect(-AX + AW, AX - AW, -AY + AW, AY - AW, 0)
    // Parapet top: the band between the outer lip and the inner face.
    const oz = o.map(([x, y]) => [x, y, ATTIC_TOP] as V3)
    // inner rectangle corners matched to the chamfered ring's 8 points
    const im: XY[] = [i[0], i[1], i[1], i[2], i[2], i[3], i[3], i[0]]
    const iz = im.map(([x, y]) => [x, y, ATTIC_TOP] as V3)
    for (let k = 0; k < 8; k++) {
      const l = (k + 1) % 8
      if (Math.hypot(iz[k][0] - iz[l][0], iz[k][1] - iz[l][1]) < 1e-6) marble.tri(oz[k], oz[l], iz[l])
      else marble.quad(oz[k], oz[l], iz[l], iz[k])
    }
    // Inner parapet faces, looking into the roof.
    const ir = [...i].reverse()
    prism(marble, ir, ATTIC_ROOF, ATTIC_TOP, false)
    floor(roof, i, ATTIC_ROOF)
  }
  for (const [y0, y1] of [[-19.3, -8.8], [-6.5, 6.5], [8.8, 19.3]] as XY[]) {
    hipRoof(glass, -10.1, 10.1, y0, y1, ATTIC_ROOF, ATTIC_ROOF + 1.6)
  }

  const parts = [
    // Colours read off the daylight photos: the white Colorado Yule marble,
    // a touch warm in sun; the greyer granite of the terrace wall; the lawn
    // on the terrace, muted; the peristyle's dark roof membrane, as the
    // library roof pulled a step darker; the blue-grey skylights; the
    // shadowed chamber behind the portal, which is lit at night.
    { part: marble, material: finish('yule-marble', 0xede8de) },
    { part: granite, material: finish('granite', 0xcfc8ba) },
    { part: lawn, material: finish('terrace-lawn', 0xa8b48f) },
    { part: roof, material: { ...PALETTE.roof, color: 0x868c91 } },
    { part: glass, material: { ...PALETTE.glass, color: 0x8fa3ad } },
    { part: portal, material: { name: 'entrance', color: 0x6f6b64, roughness: 0.85 } },
  ]
  const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
  if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
  const glb = writeGlb('Lincoln Memorial', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
    bearing: 0, osm: 'way/398769543', footprint: [64.3, 78.4], height: ATTIC_TOP,
  })
  if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
  const out = new URL('../models/dc-lincoln-memorial.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
}
