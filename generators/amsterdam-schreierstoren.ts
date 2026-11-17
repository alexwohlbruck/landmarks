/**
 * Schreierstoren, Prins Hendrikkade 94-95, Amsterdam: original procedural
 * geometry, CC0-1.0.
 * bun generators/amsterdam-schreierstoren.ts
 *
 * The one surviving defence tower of the medieval city wall (about 1487),
 * where the wall turned at the harbour. A squat brick tower, round to the
 * water and flat on the land side, with a frieze of little corbelled arches
 * two thirds up, a ring of small windows above it, and a steep slate cone
 * with lead ribs, a dormer and a gilt ship vane; a lower brick wing behind
 * it along the Geldersekade.
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = area centroid of the OSM outline way/57859248,
 * 52.376358, 4.902242. Bearing 21: the outline's straight west wall runs
 * at 21 degrees, so it lies along y here.
 *
 * Identity, in order: the steep ribbed cone set back on the drum; the
 * D-shaped faceted brick drum with its corbelled arch frieze and the
 * light band over it; the lower wing with the tower rising past it.
 *
 * Evidence:
 *  - plan: OSM outline way/57859248 read in the turned frame: the drum is
 *    a circle of radius 6.8 m about (-2.5, 4.6), cut by the straight west
 *    wall at x = -4.9 (a flat face 12.7 m long, which Txllxt TxllxT's
 *    photo from the north-west shows); the wing is the rest of the
 *    outline, x -5.0..5.5, y -11.0..4.9.
 *  - height: OSM height 20 m on the outline (no source tag; taken as the
 *    top of the cone, which the photos agree with). Drum wall 13.5 m,
 *    frieze at 9.2-9.8 m, cone 3.4 m in radius (about half the drum) from 13.5 to
 *    20.5 m, standing on a flat dark lead roof inside a 0.6 m brick
 *    parapet, as the photos show; spike
 *    and vane to 22.6 m: estimated from C messier's level photo from the
 *    east (the cone is about half the drum wall's height and half its width;
 *    Massimo Catarinella's photo from the north agrees).
 *  - wing eave 8.2 m (about 60% of the drum wall, from the same photos),
 *    a low hipped roof to 9.5 m in pale lead grey so it doesn't compete
 *    with the cone.
 *  - colours from the daylight photos: brown-red brick pulled light,
 *    white window frames and the light band over the frieze, dark slate
 *    cone with pale lead ribs, gilt vane.
 *  - night: the drum is floodlit (Catarinella's dusk photo, APK's night
 *    photo).
 *  - elevation 0 (quay, about 1 m NAP). No lidar.
 *
 * Photos (Wikimedia Commons, all evidence):
 *  - SchreierstorenAmsterdam.jpg (Massimo Catarinella, CC BY 3.0): from
 *    the north at dusk, floodlit.
 *  - Schreierstoren_7332.jpg (C messier, CC BY-SA 4.0): from the east
 *    across the Geldersekade, level, sunlit.
 *  - Amsterdam_-_Oudezijds_Kolk_-_Geldersekade_-_View_SE_on_Schreierstoren_1487.jpg
 *    (Txllxt TxllxT, CC BY-SA 4.0): the flat west face and the wing.
 *  - 2014_-_Schreierstoren_Tower,_Prins_Hendrikkade,_Amsterdam,_Holland_(Ank_Kumar_)_02.jpg
 *    (Ank Kumar, CC BY-SA 4.0): from the canal, dusk.
 *  - Schreierstoren_at_night.jpg (APK, CC BY-SA 4.0): night.
 * No commercial imagery. No look-only sources.
 *
 * Left out: the individual corbel arches (a projecting band with a row of
 * shallow arches), the gable stones and plaques, the ground-floor terrace
 * of the café on the wing, the drainpipes.
 *
 * Doubts: the wing's south end and roof are seen only obliquely; the
 * outline's height tag carries no source.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { archOn, ball, band, cap, ccw, face, floodAll, grow, lathe, prism, rectOn, save, segs, walls, type XY } from './amsterdam-munttoren'

const CX = -2.5, CY = 4.6, R = 6.8, XW = -4.9

/** The D-shaped drum: the circle about (CX, CY) of radius r cut at x = xw, in n facets. */
function dRing(r: number, xw: number, n = 12): XY[] {
  const t = Math.acos((xw - CX) / r)
  const pts: XY[] = []
  for (let k = 0; k <= n; k++) {
    const a = -t + (2 * t * k) / n
    pts.push([CX + r * Math.cos(a), CY + r * Math.sin(a)])
  }
  return pts
}

function build() {
  const brick = new Part(), slate = new Part(), trim = new Part(), win = new Part(), gold = new Part(), lead = new Part()

  // ------------------------------------------------------------ the wing
  const WE = 8.2
  const wing = ccw([[-5.0, -4.0], [-3.4, -10.4], [4.8, -11.0], [4.9, -4.4], [5.5, -4.4], [5.4, 3.8], [3.7, 4.9], [-4.9, 4.9], [-4.9, -4.0]])
  walls(brick, wing, 0, WE)
  band(trim, wing, WE - 0.35, WE + 0.1, 0.22, 0.1)
  // a low hipped roof
  {
    const x0 = -4.6, x1 = 5.0, y0 = -10.4, y1 = 3.5, z0 = WE + 0.1, z1 = WE + 1.3
    const xm0 = x0 + 2.5, xm1 = x1 - 2.5
    face(lead, [[x0, y0, z0], [x1, y0, z0], [xm1, y0 + 2.5, z1], [xm0, y0 + 2.5, z1]], [0, -1, 1])
    face(lead, [[x1, y0, z0], [x1, y1, z0], [xm1, y1 - 2.5, z1], [xm1, y0 + 2.5, z1]], [1, 0, 1])
    face(lead, [[x1, y1, z0], [x0, y1, z0], [xm0, y1 - 2.5, z1], [xm1, y1 - 2.5, z1]], [0, 1, 1])
    face(lead, [[x0, y1, z0], [x0, y0, z0], [xm0, y0 + 2.5, z1], [xm0, y1 - 2.5, z1]], [-1, 0, 1])
    face(lead, [[xm0, y0 + 2.5, z1], [xm1, y0 + 2.5, z1], [xm1, y1 - 2.5, z1], [xm0, y1 - 2.5, z1]], [0, 0, 1])
  }
  // the wing's windows: tall white-framed sashes, two storeys
  const ws = segs(wing)
  for (const [a, b] of ws) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 5) continue
    const n = Math.max(1, Math.round(L / 3.4))
    for (let i = 0; i < n; i++) {
      const c = (L * (i + 0.5)) / n
      const mx = a[0] + ((b[0] - a[0]) * c) / L, my = a[1] + ((b[1] - a[1]) * c) / L
      if (Math.hypot(mx - CX, my - CY) < R + 1.0) continue // behind the drum
      for (const [z0, z1] of [[3.2, 4.9], [5.6, 7.2]]) {
        rectOn(trim, a, b, c, 0.7, z0 - 0.12, z1 + 0.12, 0.04)
        rectOn(win, a, b, c, 0.55, z0, z1, 0.08)
      }
      rectOn(win, a, b, c, 0.55, 0.9, 2.5, 0.06)
    }
  }

  // ------------------------------------------------------------ the drum
  const lo = ccw(dRing(R, XW)), hi = ccw(dRing(R + 0.3, XW - 0.3))
  const F0 = 9.2, F1 = 9.8, TOP = 13.5
  walls(brick, lo, 0, F0)
  walls(brick, lo, F0, F1, hi)
  walls(brick, hi, F1, TOP)
  band(trim, hi, F1 - 0.05, F1 + 0.25, 0.06, 0.04, false, false)
  // the corbel frieze: a row of shallow arches just under the band
  for (const [a, b] of segs(lo)) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const n = Math.max(1, Math.round(L / 0.95))
    for (let i = 0; i < n; i++) archOn(slate, a, b, (L * (i + 0.5)) / n, (L / n) * 0.34, F0 - 0.5, F0 - 0.45, 0.04, 4)
  }
  // drum windows: tall sashes below the frieze, small square ones above
  const ds = segs(lo)
  ds.forEach(([a, b], k) => {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 1.5 || L > 6) return
    if (k % 3 === 1) {
      rectOn(trim, a, b, L / 2, 0.72, 6.0, 8.0, 0.04); rectOn(win, a, b, L / 2, 0.58, 6.12, 7.88, 0.08)
    }
    if (k % 4 === 3) {
      rectOn(trim, a, b, L / 2, 0.72, 2.6, 4.9, 0.04); rectOn(win, a, b, L / 2, 0.58, 2.72, 4.78, 0.08)
    }
  })
  segs(hi).forEach(([a, b], k) => {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 1.5 || L > 6) return
    if (k % 2 === 0) { rectOn(trim, a, b, L / 2, 0.42, 11.1, 12.2, 0.04); rectOn(win, a, b, L / 2, 0.3, 11.2, 12.1, 0.08) }
    else rectOn(brick, a, b, L / 2, 0.42, 11.1, 12.2, 0.12)
  })
  // the flat west face: two tall windows and the small upper row
  {
    const a: XY = [XW, CY + Math.sqrt(R * R - (XW - CX) ** 2)], b: XY = [XW, CY - Math.sqrt(R * R - (XW - CX) ** 2)]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    for (const c of [L * 0.3, L * 0.62]) {
      for (const [z0, z1] of [[2.6, 4.9], [6.0, 8.0]]) { rectOn(trim, a, b, c, 0.72, z0 - 0.12, z1 + 0.12, 0.04); rectOn(win, a, b, c, 0.58, z0, z1, 0.08) }
    }
    const a2: XY = [XW - 0.3, a[1] + 0.1], b2: XY = [XW - 0.3, b[1] - 0.1]
    const L2 = Math.hypot(b2[0] - a2[0], b2[1] - a2[1])
    for (let i = 0; i < 6; i++) { const c = L2 * (0.12 + i * 0.152); rectOn(trim, a2, b2, c, 0.42, 11.1, 12.2, 0.04); rectOn(win, a2, b2, c, 0.3, 11.2, 12.1, 0.08) }
  }
  // the flat lead roof round the cone's foot, inside a low brick parapet
  // (the drum wall rising 0.6 m past the roof)
  {
    const inner = grow(hi, -0.3)
    walls(brick, hi, TOP, TOP + 0.6)
    walls(brick, [...inner].reverse(), TOP, TOP + 0.6)
    for (let k = 0; k < hi.length; k++) {
      const l = (k + 1) % hi.length
      brick.quad([hi[k][0], hi[k][1], TOP + 0.6], [hi[l][0], hi[l][1], TOP + 0.6], [inner[l][0], inner[l][1], TOP + 0.6], [inner[k][0], inner[k][1], TOP + 0.6])
    }
    cap(slate, inner, TOP + 0.05)
  }

  // ------------------------------------------------------------ the cone
  const CR = 3.4, CZ = TOP + 0.05, AP = 20.5, N = 16
  const ring: XY[] = Array.from({ length: N }, (_, k) => [CX + CR * Math.cos((2 * Math.PI * k) / N), CY + CR * Math.sin((2 * Math.PI * k) / N)])
  for (let k = 0; k < N; k++) {
    const p = ring[k], q = ring[(k + 1) % N]
    slate.tri([p[0], p[1], CZ], [q[0], q[1], CZ], [CX, CY, AP])
  }
  // lead ribs on every other facet edge
  for (let k = 0; k < N; k += 2) {
    const a = (2 * Math.PI * k) / N, ca = Math.cos(a), sa = Math.sin(a)
    const w = 0.13, base: V3 = [CX + (CR + 0.05) * ca, CY + (CR + 0.05) * sa, CZ - 0.05], top: V3 = [CX, CY, AP + 0.02]
    const side: V3 = [-sa * w, ca * w, 0]
    const up: V3 = [ca * 0.12, sa * 0.12, 0.1]
    const A: V3 = [base[0] - side[0], base[1] - side[1], base[2]], B: V3 = [base[0] + side[0], base[1] + side[1], base[2]]
    const T: V3 = [top[0] + up[0], top[1] + up[1], top[2]]
    const Bu: V3 = [B[0] + up[0], B[1] + up[1], B[2] + up[2]], Au: V3 = [A[0] + up[0], A[1] + up[1], A[2] + up[2]]
    const out: V3 = [ca * (AP - CZ), sa * (AP - CZ), CR]
    face(lead, [Au, Bu, T], out)
    face(lead, [A, Au, T], [-sa + ca * 0.3, ca + sa * 0.3, 0.3])
    face(lead, [Bu, B, T], [sa + ca * 0.3, -ca + sa * 0.3, 0.3])
  }
  // a dormer on the cone, facing the harbour (north-west)
  {
    const a = (130 * Math.PI) / 180, ca = Math.cos(a), sa = Math.sin(a)
    const P = (s: number, o: number, z: number): V3 => [CX + ca * o - sa * s, CY + sa * o + ca * s, z]
    const o0 = 1.6, o1 = CR + 0.1, z0 = CZ + 0.4, z1 = CZ + 1.6, hw = 0.55
    face(slate, [P(-hw, o1, z0), P(hw, o1, z0), P(hw, o1, z1), P(-hw, o1, z1)], [ca, sa, 0])
    rectOn(win, [P(-hw, o1, 0)[0], P(-hw, o1, 0)[1]], [P(hw, o1, 0)[0], P(hw, o1, 0)[1]], hw, 0.4, z0 + 0.15, z1 - 0.2, 0.05)
    face(slate, [P(-hw, o1, z1), P(hw, o1, z1), P(hw, o0, z1 + 0.5), P(-hw, o0, z1 + 0.5)], [ca * 0.5, sa * 0.5, 1])
    face(slate, [P(-hw, o1, z0), P(-hw, o1, z1), P(-hw, o0, z1 + 0.5), P(-hw, o0, z0)], [sa, -ca, 0])
    face(slate, [P(hw, o1, z1), P(hw, o1, z0), P(hw, o0, z0), P(hw, o0, z1 + 0.5)], [-sa, ca, 0])
  }
  // spike, ball and the gilt ship vane
  lathe(lead, CX, CY, [[0.12, AP - 0.2], [0.07, 21.4], [0, 21.45]], 4)
  ball(gold, CX, CY, AP + 0.25, 0.2, 6)
  {
    const z = 21.4
    const v: V3[] = [[CX - 0.42, CY, z], [CX + 0.42, CY, z], [CX + 0.55, CY, z + 0.28], [CX + 0.1, CY, z + 0.28], [CX + 0.1, CY, z + 1.0], [CX - 0.1, CY, z + 1.0], [CX - 0.1, CY, z + 0.28], [CX - 0.55, CY, z + 0.28]]
    for (const s of [-1, 1]) {
      face(gold, [v[0], v[1], v[2], v[7]], [0, s, 0])
      face(gold, [v[3], v[4], v[5], v[6]], [0, s, 0])
      // sails
      face(gold, [[CX - 0.12, CY, z + 0.45], [CX - 0.6, CY, z + 0.55], [CX - 0.12, CY, z + 1.1]], [0, s, 0])
      face(gold, [[CX + 0.12, CY, z + 0.45], [CX + 0.6, CY, z + 0.55], [CX + 0.12, CY, z + 1.1]], [0, s, 0])
    }
  }

  const drum = (p: V3, n: V3) => (Math.hypot(p[0] - CX, p[1] - CY) < R + 0.6 && p[1] > -2.5 ? floodAll(p, n) : 0)
  return [
    { part: brick, material: { ...finish('schreierstoren-brick', 0x9a5948), floodlight: drum } },
    { part: slate, material: { ...finish('schreierstoren-slate', 0x5b6168), floodlight: drum } },
    { part: trim, material: { ...PALETTE.trim, floodlight: drum } },
    { part: lead, material: { ...finish('schreierstoren-lead', 0xb4bbc0), floodlight: drum } },
    { part: win, material: { ...PALETTE.window } },
    { part: gold, material: finish('schreierstoren-gilt', 0xc9a24a, 0.45) },
  ]
}

if (import.meta.main) await save('amsterdam-schreierstoren', 'Schreierstoren', [52.376358, 4.902242], 21, build(), 5000)
