/**
 * HEP Five (HEP FIVE) and its Ferris wheel, Umeda, Osaka: procedural, CC0-1.0.
 * bun generators/osaka-hep-five.ts
 *
 * Writes two levels of detail in the same frame:
 * - models/osaka-hep-five.glb, the low model;
 * - models/osaka-hep-five.detail.glb, drawn from zoom 16: the wheel's rims,
 *   spokes and lattice at full density and rounded gondolas.
 *
 * Map frame: x east, y north, z up, metres. Built square to the wheel, whose
 * plane runs along x; the placement's bearing (355.5) turns it to OSM's
 * wheel way (way/332292139, drawn along the wheel's plane at 85.5 degrees)
 * and the building's long south front, which runs the same way. The origin
 * is the area centroid of the building's outline (way/161451126); y = 0 is
 * the street (flat).
 *
 * A ten-storey shopping and entertainment building (1998, Hankyu) clad in
 * silver ribbed aluminium, with a red Ferris wheel on its roof whose lower
 * rim runs down into the building through a glazed atrium on the west front.
 *
 * Published (ja.wikipedia "HEP FIVE"): opened 28 November 1998; 10 storeys
 * above ground, 3 below; the wheel 75 m across, its top about 106 m above
 * the street, 52 gondolas, bright red; part of the wheel runs through the
 * inside of the building. Boarding is on 7F (operator).
 *
 * OSM: the outline way/161451126 (building=retail, 10 levels, no height);
 * the wheel way/332292139 (attraction=big_wheel), a thin polygon in the
 * wheel's plane from x -60.8 to 18.6 at y -4.6: the hub at x -21.1, the
 * gondolas reaching the west front. All in this frame, measured.
 * The north front is drawn as a smooth curve through OSM's six vertices
 * there (within ~0.5 m of OSM's straight edges), as the photos show it bowed.
 *
 * From photos (scaled to the 106 m top):
 * - the hub at 68.5 m (106 - 75 / 2; "HEP FIVE 01" puts it at ~66 m);
 * - the roof at ~48 m and the glazed atrium slot round the wheel's plane
 *   ~10 m wide and ~38 m high ("HEP FIVE 01", W236, from the west);
 * - the wheel's depth: the rim ~3.2 m deep, the hub's flanges ~10 m apart;
 *   four splayed legs from the roof to the axle, ~11 m apart along the wheel
 *   and ~20 m across it ("HEP FIVE 01" and Mc681's 201409 001);
 * - an inner ring at ~25 m radius, radial spokes from the hub to it and a
 *   V lattice from it to the rim (Mc681, face on): estimated counts (24 /
 *   48 a face in the detail model; 16 / 32 in the low one; the real wheel's
 *   spokes are finer still);
 * - the gondolas hung outside the rim, ~2.4 x 2.2 x 2.6 m;
 * - the west front: the glass atrium, two glass lift cylinders with red
 *   caps (38-50 m) south of it, and a red pointed fin at the end of the
 *   north-west wing ("HEP FIVE.jpg" and "HEP FIVE on 26th March 2025",
 *   Tokumeigakarinoaoshima); the red street-level band on the south and west
 *   fronts only (none is photographed on the east) (Mc681, "HEP in 201409");
 * - the north front: two dark window ribbons at ~30-37 m and a staircase of
 *   red-framed windows running down westward (Mc681 201409 001, 201411);
 * - the drum on the roof at the east end (the "HEP FIVE" sign drum, ~28 m
 *   across, 8 m high, Mc681); its lettering is left out.
 * - colours: the cladding a silver white (#dcdfe3-#eceef0 in sun), drawn
 *   #e2e4e7; the wheel and the accents a strong red (#c8202c-#d9343c),
 *   drawn #c93a40 (the red is the landmark's identity).
 * Invented: the east and the south-east fronts' window pattern (no clear
 *   photo), kept to plain cladding with one window ribbon.
 * Left out: the red whale in the atrium (not visible outside), the ribbing
 *   of the cladding, signs and lettering.
 *
 * It turns (experimental; see "Animation" in STYLE.md): the wheel is a node
 * at the hub and each gondola a child turned back by as much, so it hangs
 * plumb. One turn in 120 s (the real wheel takes about 15 minutes).
 *
 * Night: the wheel is lit red all over (Mc681, "HEP at Night in 201408"), so
 * it and the red accents are `neon-hep-red`; the window ribbons are `window`;
 * the atrium and lift glazing are `glass`.
 *
 * Photos (Wikimedia Commons, evidence):
 * - "HEP FIVE 01.jpg", W236, CC BY-SA 3.0 (from the west, wheel edge on)
 * - "HEP FIVE 02.jpg", W236, CC BY-SA 3.0 (wheel from below)
 * - "HEP-FIVE in 201409 001.JPG", Mc681, CC BY-SA 4.0 (north front, wheel face on)
 * - "HEP-FIVE in 201409 002.JPG", Mc681, CC BY-SA 4.0 (north front)
 * - "HEP Five in 201411.JPG", Mc681, CC BY-SA 4.0 (north front)
 * - "HEP in 201409.JPG", Mc681, CC BY-SA 4.0 (south front from above)
 * - "HEP at Night in 201408.JPG", Mc681, CC BY-SA 4.0 (night)
 * - "HEP FIVE.jpg", Tokumeigakarinoaoshima, CC BY-SA 4.0 (west front)
 * - "HEP FIVE on 26th March 2025.jpg", Tokumeigakarinoaoshima, CC0 (west front)
 * - "HEP-FIVE,Osaka-Japan.JPG", CC BY-SA 3.0 (north-west)
 * Look-only: none.
 */
import { Part, axisAngle, cross, sub, type ChannelSpec, type NodeSpec, type Quat, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { triangulate } from './chi-aon-center'
import { TAU, add, beam, box, fquad, ftri, mul, rod, unit, writeLods, type Mat, type XY } from './osaka-umeda-sky-building'

// The outline in this frame, counter-clockwise (OSM way/161451126).
// The north front runs through OSM's vertices as a smooth curve (Catmull-Rom),
// as the photos show it gently bowed; every other edge is OSM's as drawn.
const NORTH_OSM: XY[] = [[-54.0, -1.6], [-32.4, 9.5], [-2.3, 21.3], [33.4, 35.2], [48.9, 40.2], [54.2, 40.4]]
function catmull(p: XY[], k: number): XY[] {
  const out: XY[] = []
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[Math.max(0, i - 1)], p1 = p[i], p2 = p[i + 1], p3 = p[Math.min(p.length - 1, i + 2)]
    for (let j = 0; j < k; j++) {
      const t = j / k, t2 = t * t, t3 = t2 * t
      const f = (a: number, b: number, c: number, d: number) => 0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3)
      out.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])])
    }
  }
  out.push(p[p.length - 1])
  return out
}
const NORTH = catmull(NORTH_OSM, 4)
// (clockwise as OSM draws it, then reversed to counter-clockwise)
const OUTLINE: XY[] = ([[53.7, -10.1], [-7.8, -9.8], [-8.1, -34.5], [-45.2, -35.2], [-59.8, -35.5], [-59.1, -32.2], [-57.0, -22.0], [-55.9, -17.6], [-58.3, -17.4], [-58.0, -15.5], [-56.9, -14.3], [-56.9, -12.8], [-56.2, -11.4], [-54.9, -10.5], [-54.9, -10.1], [-54.7, -8.5], [-54.5, -6.0], ...NORTH, [54.0, 26.5], [49.9, 26.6], [49.9, 24.6], [54.0, 24.5], [53.5, 10.4], [54.7, 9.7]] as XY[]).reverse()

/** Panels on the north front between arc lengths s0..s1 (measured from its east end), z0..z1. */
function onNorth(p: Part, s0: number, s1: number, z0: number, z1: number, out = 0.06) {
  const pts = [...NORTH].reverse() // east to west: walking this way the outside is on the right
  let at = 0
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i], b = pts[i + 1], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const u0 = Math.max(s0, at), u1 = Math.min(s1, at + L)
    if (u1 - u0 > 0.05) onWall(p, a, b, u0 - at, u1 - at, z0, z1, out)
    at += L
  }
  return at
}

const ROOF = 48
const HUB: V3 = [-21.1, -4.6, 68.5]
const R = 37.5 // rim (gondola pivots)
const SLOT0 = -10.6, SLOT1 = 0, SLOT_E = 12, SLOT_TOP = 38 // the glazed atrium round the wheel's plane

/** Clip a counter-clockwise ring to the half-plane a*x + b*y <= c. */
function clip(r: XY[], a: number, b: number, c: number): XY[] {
  const out: XY[] = []
  for (let i = 0; i < r.length; i++) {
    const p = r[i], q = r[(i + 1) % r.length]
    const fp = a * p[0] + b * p[1] - c, fq = a * q[0] + b * q[1] - c
    if (fp <= 0) out.push(p)
    if (fp * fq < 0) {
      const t = fp / (fp - fq)
      out.push([p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t])
    }
  }
  return out
}

/** A prism over a simple counter-clockwise ring: walls, and a cap (roof part) on top. */
function prism(wall: Part, top: Part | null, r: XY[], z0: number, z1: number) {
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    if (Math.hypot(b[0] - a[0], b[1] - a[1]) < 1e-3) continue
    fquad(wall, [a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1], [b[1] - a[1], a[0] - b[0], 0])
  }
  if (top) for (const [i, j, k] of triangulate(r)) ftri(top, [r[i][0], r[i][1], z1], [r[j][0], r[j][1], z1], [r[k][0], r[k][1], z1], [0, 0, 1])
}

/** A flat panel on the wall a→b of a counter-clockwise ring, s0..s1 along it, z0..z1, `out` proud. */
function onWall(p: Part, a: XY, b: XY, s0: number, s1: number, z0: number, z1: number, out = 0.06) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
  const P = (s: number, z: number): V3 => [a[0] + u[0] * s + n[0] * out, a[1] + u[1] * s + n[1] * out, z]
  fquad(p, P(s0, z0), P(s1, z0), P(s1, z1), P(s0, z1), [n[0], n[1], 0])
}

function build(detail: boolean) {
  const silver = new Part(), red = new Part(), win = new Part(), glass = new Part(), roof = new Part()

  // --- The building: the outline less the atrium slot west of x = 12. -------
  const south = clip(OUTLINE, 0, 1, SLOT0) // y <= -10
  const north = clip(OUTLINE, 0, -1, -SLOT1) // y >= 0
  const band = clip(clip(OUTLINE, 0, -1, -SLOT0), 0, 1, SLOT1)
  const bandEast = clip(band, -1, 0, -SLOT_E), slot = clip(band, 1, 0, SLOT_E)
  for (const r of [south, north, bandEast]) {
    prism(silver, null, r, 0, ROOF)
    // parapet: a lip 0.8 m in, the roof 1 m down
    for (const [i, j, k] of triangulate(r)) ftri(roof, [r[i][0], r[i][1], ROOF - 1], [r[j][0], r[j][1], ROOF - 1], [r[k][0], r[k][1], ROOF - 1], [0, 0, 1])
    for (let i = 0; i < r.length; i++) {
      const a = r[i], b = r[(i + 1) % r.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
      if (L < 0.5) continue
      const n: XY = [(b[1] - a[1]) / L, (a[0] - b[0]) / L]
      const ai: XY = [a[0] - n[0] * 0.7, a[1] - n[1] * 0.7], bi: XY = [b[0] - n[0] * 0.7, b[1] - n[1] * 0.7]
      fquad(silver, [a[0], a[1], ROOF], [b[0], b[1], ROOF], [bi[0], bi[1], ROOF], [ai[0], ai[1], ROOF], [0, 0, 1])
      fquad(silver, [bi[0], bi[1], ROOF], [ai[0], ai[1], ROOF], [ai[0], ai[1], ROOF - 1], [bi[0], bi[1], ROOF - 1], [-n[0], -n[1], 0])
    }
  }
  // The atrium: glass walls and a glass roof at 38 m round the wheel's plane.
  prism(glass, glass, slot, 0, SLOT_TOP)

  // Red street-level band on the south and west fronts (to 6.5 m).
  for (let i = 0; i < OUTLINE.length; i++) {
    const a = OUTLINE[i], b = OUTLINE[(i + 1) % OUTLINE.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const n: XY = [(b[1] - a[1]) / L, (a[0] - b[0]) / L]
    if (L < 1 || n[1] > 0.3 || n[0] > 0.3) continue // fronts facing south and west only (Mc681, Tokumeigakarinoaoshima)
    if (Math.max(a[1], b[1]) > SLOT0 && Math.min(a[1], b[1]) < SLOT1 && Math.min(a[0], b[0]) < SLOT_E) continue
    onWall(red, a, b, 0, L, 0, 6.5, 0.08)
  }

  // North front: two window ribbons and the staircase of red-framed windows
  // (Mc681 201409 001: down westward from under the ribbons, and a few small
  // red squares near the west end).
  const LN = onNorth(win, 0, 0, 0, 0)
  for (const [z0, z1] of [[34.5, 37.5], [29.5, 31.5]]) onNorth(win, 6, LN - 3, z0, z1)
  for (let k = 0; k < 5; k++) {
    const s0 = 40 + k * 6.2, z1 = 27 - k * 4.6, z0 = z1 - 3.4
    onNorth(red, s0 - 0.6, s0 + 4.0, z0 - 0.6, z1 + 0.6, 0.06)
    onNorth(win, s0, s0 + 3.4, z0, z1, 0.12)
  }
  for (let k = 0; k < 3; k++) {
    const s0 = LN - 22 + k * 7, z0 = 10 + k * 5.5
    onNorth(red, s0, s0 + 2.2, z0, z0 + 2.4, 0.08)
  }
  // East and south fronts: one ribbon each (plain cladding otherwise).
  onWall(win, [53.7, -10.1], [54.7, 9.7], 1.5, 18, 34.5, 37.5)
  onWall(win, [-7.8, -9.8], [53.7, -10.1], 2, 58, 34.5, 37.5)
  onWall(win, [-45.2, -35.2], [-8.1, -34.5], 2, 35, 34.5, 37.5)
  // Red end strips at the north-east corner.
  onWall(red, [54.2, 40.4], [48.9, 40.2], 0, 5.3, 6.5, ROOF, 0.08)

  // West front: the red pointed fin on the north-west wing's end, and the
  // two glass lift cylinders with red caps south of the atrium.
  {
    const a: XY = NORTH[0], b: XY = NORTH[2]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [-u[1], u[0]]
    const P = (s: number, z: number, o: number): V3 => [a[0] + u[0] * s + n[0] * o, a[1] + u[1] * s + n[1] * o, z]
    const prof: Array<[number, number]> = [[0, 0], [16, 0], [16, 14], [0, 53]] // (s, z): the tip at the atrium
    for (const o of [0.15, 1.5]) {
      const N: V3 = o > 1 ? [n[0], n[1], 0] : [-n[0], -n[1], 0]
      ftri(red, P(prof[0][0], prof[0][1], o), P(prof[1][0], prof[1][1], o), P(prof[2][0], prof[2][1], o), N)
      ftri(red, P(prof[0][0], prof[0][1], o), P(prof[2][0], prof[2][1], o), P(prof[3][0], prof[3][1], o), N)
    }
    for (let i = 0; i < 4; i++) {
      const [s0, z0] = prof[i], [s1, z1] = prof[(i + 1) % 4]
      const e = unit([u[0] * (s1 - s0), u[1] * (s1 - s0), z1 - z0]), N = cross(e, [n[0], n[1], 0])
      fquad(red, P(s0, z0, 0.15), P(s1, z1, 0.15), P(s1, z1, 1.5), P(s0, z0, 1.5), N)
    }
    // a glazed west face of the fin's wing behind it
    for (const y of [-12.6, -17.2]) {
      const c: V3 = [-59.2, y, 0], k = detail ? 16 : 10
      for (let i = 0; i < k; i++) {
        const a0 = (i / k) * TAU, a1 = ((i + 1) / k) * TAU, r = 2.3
        const Q = (aa: number, z: number): V3 => [c[0] + r * Math.cos(aa), c[1] + r * Math.sin(aa), z]
        const nn = (aa: number): V3 => [Math.cos(aa), Math.sin(aa), 0]
        glass.tri(Q(a0, 0), Q(a1, 0), Q(a1, 38), undefined, undefined, undefined, [nn(a0), nn(a1), nn(a1)])
        glass.tri(Q(a0, 0), Q(a1, 38), Q(a0, 38), undefined, undefined, undefined, [nn(a0), nn(a1), nn(a0)])
        red.tri(Q(a0, 38), Q(a1, 38), Q(a1, 50), undefined, undefined, undefined, [nn(a0), nn(a1), nn(a1)])
        red.tri(Q(a0, 38), Q(a1, 50), Q(a0, 50), undefined, undefined, undefined, [nn(a0), nn(a1), nn(a0)])
        ftri(red, [c[0], c[1], 50], Q(a0, 50), Q(a1, 50), [0, 0, 1])
      }
    }
  }

  // The drum on the roof at the east end.
  {
    const c: XY = [38, 22], r = 13.5, k = detail ? 32 : 20
    for (let i = 0; i < k; i++) {
      const a0 = (i / k) * TAU, a1 = ((i + 1) / k) * TAU
      const Q = (aa: number, z: number): V3 => [c[0] + r * Math.cos(aa), c[1] + r * Math.sin(aa), z]
      const nn = (aa: number): V3 => [Math.cos(aa), Math.sin(aa), 0]
      silver.tri(Q(a0, ROOF - 1), Q(a1, ROOF - 1), Q(a1, ROOF + 8), undefined, undefined, undefined, [nn(a0), nn(a1), nn(a1)])
      silver.tri(Q(a0, ROOF - 1), Q(a1, ROOF + 8), Q(a0, ROOF + 8), undefined, undefined, undefined, [nn(a0), nn(a1), nn(a0)])
      ftri(silver, [c[0], c[1], ROOF + 8], Q(a0, ROOF + 8), Q(a1, ROOF + 8), [0, 0, 1])
    }
  }

  // --- The wheel's legs: four, splayed, from the roof to the axle ends. ----
  for (const sy of [-1, 1]) {
    const top: V3 = [HUB[0], HUB[1] + sy * 5.6, HUB[2] - 1.2]
    for (const sx of [-1, 1]) {
      const foot: V3 = [HUB[0] + sx * 5.8, HUB[1] + sy * 10.5, ROOF - 1]
      beam(red, foot, top, detail ? 1.3 : 1.5, detail ? 1.3 : 1.5, [0, 0, 1])
      if (detail) {
        // the legs are lattice columns: a lighter inner member and ties
        for (let t = 0.2; t < 0.95; t += 0.2) {
          const p = add(foot, mul(sub(top, foot), t)), q = add([HUB[0] - sx * 5.8, HUB[1] + sy * 10.5, ROOF - 1], mul(sub(top, [HUB[0] - sx * 5.8, HUB[1] + sy * 10.5, ROOF - 1]), t))
          if (sx > 0) beam(red, p, q, 0.45)
        }
      }
    }
    // bearing block
    box(red, HUB[0] - 1.4, HUB[1] + sy * 5 - 1, HUB[0] + 1.4, HUB[1] + sy * 5 + 1, HUB[2] - 2.6, HUB[2] + 1.4, { bottom: true })
    // a stay from the roof up to the axle, across the wheel (W236)
    beam(red, [HUB[0], HUB[1] + sy * 14, ROOF - 1], top, detail ? 0.6 : 0.8)
  }

  // --- The wheel itself, a node at the hub (x along the plane, z up). ------
  const wheelRed = new Part()
  const W = (r: number, t: number, y: number): V3 => [r * Math.cos(t), y, r * Math.sin(t)]
  const nSpoke = detail ? 26 : 16, nRim = detail ? 52 : 26
  const RIN = 25, YR = 1.6, YH = 5
  // axle and hub
  rod(wheelRed, [0, -YH - 0.4, 0], [0, YH + 0.4, 0], 1.3, detail ? 12 : 8)
  for (const y of [-YH, YH]) rod(wheelRed, [0, y - 0.5, 0], [0, y + 0.5, 0], 2.8, detail ? 12 : 8)
  for (const sy of [-1, 1]) {
    // rim and inner ring
    for (let i = 0; i < nRim; i++) {
      const t0 = (i / nRim) * TAU, t1 = ((i + 1) / nRim) * TAU
      beam(wheelRed, W(R, t0, sy * YR), W(R, t1, sy * YR), detail ? 0.75 : 0.95, detail ? 0.75 : 0.95, [0, 1, 0])
    }
    const nIn = detail ? 26 : 16
    for (let i = 0; i < nIn; i++) {
      const t0 = (i / nIn) * TAU, t1 = ((i + 1) / nIn) * TAU
      beam(wheelRed, W(RIN, t0, sy * 2.6), W(RIN, t1, sy * 2.6), detail ? 1.0 : 1.2, detail ? 1.0 : 1.2, [0, 1, 0])
    }
    // radial spokes from the hub flange to the inner ring
    for (let i = 0; i < nSpoke; i++) {
      const t = (i / nSpoke) * TAU + (sy > 0 ? Math.PI / nSpoke : 0)
      beam(wheelRed, W(2.6, t, sy * YH), W(RIN, t, sy * 2.6), detail ? 0.32 : 0.5)
    }
    // V lattice from the inner ring out to the rim
    for (let i = 0; i < nIn; i++) {
      const t = (i / nIn) * TAU, dt = TAU / nIn / 2
      beam(wheelRed, W(RIN, t, sy * 2.6), W(R, t - dt, sy * YR), detail ? 0.32 : 0.48)
      beam(wheelRed, W(RIN, t, sy * 2.6), W(R, t + dt, sy * YR), detail ? 0.32 : 0.48)
    }
  }
  // ties across the rim at every gondola
  for (let i = 0; i < (detail ? 52 : 26); i++) {
    const t = (i / (detail ? 52 : 26)) * TAU
    beam(wheelRed, W(R, t, -YR), W(R, t, YR), detail ? 0.35 : 0.5)
  }

  // Gondolas: pivots on the rim, each body hung below its pivot.
  const gondola = new Part(), gwin = new Part()
  if (detail) {
    // a rounded capsule: an octagon in plan, lathed top and bottom
    const prof: Array<[number, number]> = [[0.01, -3.1], [0.9, -3.0], [1.25, -2.6], [1.3, -1.6], [1.25, -0.9], [0.8, -0.55], [0.3, -0.4], [0.01, -0.4]]
    const k = 8
    for (let i = 0; i < k; i++) {
      const a0 = (i / k) * TAU + TAU / 16, a1 = ((i + 1) / k) * TAU + TAU / 16
      for (let j = 0; j < prof.length - 1; j++) {
        const [r0, z0] = prof[j], [r1, z1] = prof[j + 1]
        const P = (r: number, a: number, z: number): V3 => [r * Math.cos(a) * 1.05, r * Math.sin(a) * 1.12, z * 1.08]
        const am = (a0 + a1) / 2, e = Math.atan2(r1 - r0, z1 - z0)
        const N: V3 = [Math.cos(am) * Math.cos(e), Math.sin(am) * Math.cos(e), -Math.sin(e)]
        const part = j === 3 ? gwin : gondola
        fquad(part, P(r0, a0, z0), P(r0, a1, z0), P(r1, a1, z1), P(r1, a0, z1), N)
      }
    }
    beam(gondola, [0, 0, 0], [0, 0, -0.5], 0.3)
  } else {
    box(gondola, -1.3, -1.35, 1.3, 1.35, -3.3, -0.5, { bottom: true, bevel: 0.3 })
  }

  const LOOP = 120, KEYS = 24
  const times = Array.from({ length: KEYS + 1 }, (_, i) => (i / KEYS) * LOOP)
  const turned = times.map((_, i) => (i / KEYS) * TAU)
  const AXLE: V3 = [0, 1, 0]
  const turn: Quat[] = turned.map((a) => axisAngle(AXLE, a))
  const plumb: Quat[] = turned.map((a) => axisAngle(AXLE, -a))
  const RED = finish('neon-hep-red', 0xc93a40)
  const nodes: NodeSpec[] = [{ name: 'wheel', translation: HUB, parts: [{ part: wheelRed, material: RED }] }]
  const channels: ChannelSpec[] = [{ node: 0, path: 'rotation', values: turn }]
  const gParts = [{ part: gondola, material: RED }, ...(detail ? [{ part: gwin, material: PALETTE.glass }] : [])]
  for (let i = 0; i < 52; i++) {
    const t = (i / 52) * TAU
    nodes.push({ name: `gondola-${i + 1}`, parent: 0, translation: W(R, t, 0), parts: gParts })
    channels.push({ node: nodes.length - 1, path: 'rotation', values: plumb })
  }

  const parts: Mat[] = [
    { part: silver, material: finish('hep-silver', 0xe2e4e7) },
    { part: red, material: RED },
    { part: win, material: PALETTE.window },
    { part: glass, material: PALETTE.glass },
    { part: roof, material: PALETTE.roof },
  ]
  return { parts, options: { nodes, animation: { name: 'turn', times, channels } } }
}

if (import.meta.main) {
  const low = build(false), hi = build(true)
  await writeLods('osaka-hep-five', 'HEP Five', { bearing: 355.5, elevation: 0, height: 106 }, [
    { file: 'osaka-hep-five.glb', parts: low.parts, options: low.options, maxTris: 6500, maxBytes: 250_000 },
    { file: 'osaka-hep-five.detail.glb', parts: hi.parts, options: hi.options, maxTris: 40_000, maxBytes: 1536 * 1024 },
  ])
}
