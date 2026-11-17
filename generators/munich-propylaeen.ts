/**
 * Propyläen, Königsplatz, Munich: Leo von Klenze, 1846-62, for Ludwig I, in
 * memory of the Greek War of Independence and of Otto of Greece; sculpture
 * by Ludwig Schwanthaler. Original procedural geometry, CC0-1.0.
 * bun generators/munich-propylaeen.ts
 *
 * Map frame: x east, y north, z up, metres, origin at the anchor on the
 * ground. Anchor = area centroid of the OSM outline way/244969498,
 * 48.1460680, 11.5642624. The gate's long side runs at 21.7 degrees, so the
 * catalog bearing is 21.7 and the model is built square to it: +x is the
 * town side (Stadtseite) facing Königsplatz (ESE), -x the field side
 * (Feldseite) on Brienner Straße; +y the north tower, -y the south tower.
 * The gate is symmetric about x = 0 and about y = 0.
 *
 * Identity, in order: the two tall plain marble pylon towers, each with a
 * deep open loggia of square pillars under a heavy cornice and attic with
 * corner blocks, a relief frieze under the loggia on the fronts, a laurel-
 * wreath band on the sides and a framed gate portal with a palmette
 * acroterion; between them the Doric portico, six fluted columns on each
 * front with a wider middle bay over the street, a triglyph frieze and a
 * pediment full of sculpture; behind the columns the hall of Ionic columns
 * the road passes through.
 *
 * Evidence:
 *  - plan (OSM, measured in the turned frame): outline way/244969498, towers
 *    x ±7.5, y ±12.8..27.7 (15 m squares; their 8.5 m corner parts leave a
 *    5 m passage through each tower); Doric column parts way/222895883..900
 *    at x ±10.2 (1.7 m across in OSM); Ionic column parts way/222672554..566
 *    and 222902405..410 at x ±1.9, ±5.7, y ±2.8, ±6.7; the two raised
 *    platforms way/222672553 and 222895882 at y ±1.9..12.8 either side of
 *    the street; the central roof way/10160913 x ±13.2. Published (München
 *    Wiki): the middle building is about 25 m wide.
 *  - heights: not published (de.wikipedia gives none; OSM part heights are
 *    tagged but disagree with the photos by 10-25 % and were not used).
 *    Measured from the two near-orthographic frontal photos below, scaled by
 *    the 15.0 m OSM tower width (Mücke 0.0625 m/px, Delso 0.0577 m/px) and
 *    averaged: tower corner blocks 28.0, attic 27.1, cornice top 26.0,
 *    loggia 18.35-22.2, relief frieze 15.5-18.1, portal opening 8.6 high and
 *    4.7 wide; portico stylobate 1.1, columns to 11.3 (OSM column height
 *    1-11 agrees), entablature to 15.3, pediment apex 18.6, acroterion 19.9;
 *    the hall behind the pediment to 18.6. Column centres along y ±3.1,
 *    ±7.2, ±10.8 and 2.0 m base diameter from the same photos (OSM's
 *    ±3.0/±6.7/±10.1 and 1.7 m put the outer column 2 m in from the
 *    entablature's corner, which the photos don't show).
 *  - estimated: loggia pillar 0.88 m and opening 1.54 m (Andreas Praefcke's
 *    and High Contrast's detail photos), recess depth 1.2 m, the side
 *    windows (Praefcke), step count and depth, the hall's flat top, the
 *    tower roofs' low copper pyramids (OSM roof:shape=pyramidal,
 *    roof:colour=green, not seen in any photo).
 *  - sculpture: pediments west "Liberation of Greece" (Hellas standing in
 *    the middle) and east "Homage to King Otto" (Otto enthroned), tower
 *    friezes west oath / land battle and east sea battle / civil war, five
 *    laurel wreaths on each short side (de.wikipedia). Drawn as bold
 *    simplified figures in the real arrangement: in the round in the
 *    pediments, as raised silhouettes in the friezes. The individual poses
 *    are invented.
 *  - colours: Untersberg marble, a warm cream (photos); the sculpture a
 *    touch paler; loggia recesses and side windows dark.
 *  - night: the gate is floodlit; marble carries _FLOODLIGHT.
 *  - elevation 0 (flat Königsplatz). No lidar (none in Germany); no Bavarian
 *    3D city model used.
 *
 * Photos (Wikimedia Commons, all evidence):
 *  - Propyläen_München.jpg (Burkhard Mücke, CC BY-SA 4.0): frontal, the
 *    main height reference.
 *  - Propyläen,_Königsplatz,_Múnich,_Alemania,_2023-12-03,_DD_02.jpg (Diego
 *    Delso, CC BY-SA 4.0): frontal, second height reference.
 *  - Propyläen_(München)_-_Ansicht_von_Westen.JPG (Guido Radig, CC BY-SA
 *    4.0): from the west, the towers' side loggias.
 *  - München_Propyläen_Seite.jpg (Andreas Praefcke, CC BY 3.0): north
 *    tower from the north-east: side windows, wreath band, portal, portico
 *    projection.
 *  - 2019-11-16,_Seitenansicht,_Propyläen,_München,_IMG_7535 (Christoph
 *    Braun, CC0): the portico from the side: columns, triglyphs, pediment
 *    figures, steps, anta.
 *  - Propyläen_München_-_detail_-_2013.jpg (High Contrast, CC BY 3.0 de):
 *    a tower frieze and the loggia pillars.
 * No commercial imagery, no 3D city models, no look-only sources.
 *
 * Left out: the inscriptions, the coffered ceilings, guttae and mutules, the
 * fine mouldings, egg-and-dart and anthemion carving (the anthemion band is
 * a pale strip), the antefixes, the grilles in the loggias and passages.
 *
 * Doubts: the tower heights rest on two frontal photos (they agree within
 * 4 %); the hall's roof and the tower roofs are not seen in any photo; the
 * tower passages running north-south are drawn closed, as the north face
 * shows only windows.
 *
 * This file also holds the classical kit (fluted Doric and Ionic columns,
 * pediment figures, relief silhouettes, wreaths, palmettes) that
 * munich-glyptothek.ts imports; merge it first.
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, type Swatch } from './palette'
import { cap, inset, lathe, rect, triangulate, walls, area, type XY } from './chi-aon-center'
import { tube } from './munich-olympiaturm'

// ---------------------------------------------------------------------------
// Classical kit, shared with munich-glyptothek.

const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]

/** One triangle wound to face n. */
export function triF(p: Part, a: V3, b: V3, c: V3, n: V3) {
  if (dot(cross(sub(b, a), sub(c, a)), n) < 0) p.tri(a, c, b)
  else p.tri(a, b, c)
}
/** A convex polygon wound to face n. */
export function faceN(p: Part, pts: V3[], n: V3) {
  for (let i = 1; i < pts.length - 1; i++) triF(p, pts[0], pts[i], pts[i + 1], n)
}

/** An axis box; `skip` names faces left out: 'b' bottom, 't' top, 'x0','x1','y0','y1'. */
export function abox(p: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, skip = '') {
  const s = (k: string) => skip.split(',').includes(k)
  if (!s('y0')) faceN(p, [[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1]], [0, -1, 0])
  if (!s('y1')) faceN(p, [[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]], [0, 1, 0])
  if (!s('x0')) faceN(p, [[x0, y0, z0], [x0, y1, z0], [x0, y1, z1], [x0, y0, z1]], [-1, 0, 0])
  if (!s('x1')) faceN(p, [[x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1]], [1, 0, 0])
  if (!s('t')) faceN(p, [[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]], [0, 0, 1])
  if (!s('b')) faceN(p, [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]], [0, 0, -1])
}

/** A cornice slab about a rectangle: chamfered underside and top edge. */
export function corniceBox(p: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, out: number, wallTop = true) {
  const r = rect(x0 - out, y0 - out, x1 + out, y1 + out), i = rect(x0, y0, x1, y1)
  const zb = z0 + Math.min(out * 0.8, (z1 - z0) * 0.5)
  walls(p, i, z0, zb, r)
  walls(p, r, zb, z1 - 0.12)
  walls(p, r, z1 - 0.12, z1, inset(r, 0.12))
  if (wallTop) cap(p, inset(r, 0.12), z1)
}

/** A wall frame: s along u, z up, d out along n from the wall point o. */
export type WallF = (s: number, z: number, d?: number) => V3
export const wallAt = (o: XY, u: XY, n: XY): { P: WallF; u: XY; n: XY } => ({
  P: (s, z, d = 0) => [o[0] + u[0] * s + n[0] * d, o[1] + u[1] * s + n[1] * d, z],
  u,
  n,
})

/** A polygon (s, z) in a wall frame, extruded from d0 to d1 out of the wall. */
export function extrudeOn(p: Part, w: { P: WallF; u: XY; n: XY }, poly: XY[], d0: number, d1: number, back = false) {
  const r = area(poly) < 0 ? [...poly].reverse() : poly
  const N: V3 = [w.n[0], w.n[1], 0]
  for (const [a, b, c] of triangulate(r)) {
    triF(p, w.P(r[a][0], r[a][1], d1), w.P(r[b][0], r[b][1], d1), w.P(r[c][0], r[c][1], d1), N)
    if (back) triF(p, w.P(r[a][0], r[a][1], d0), w.P(r[b][0], r[b][1], d0), w.P(r[c][0], r[c][1], d0), [-N[0], -N[1], 0])
  }
  for (let i = 0; i < r.length; i++) {
    const A = r[i], B = r[(i + 1) % r.length]
    const ds = B[0] - A[0], dz = B[1] - A[1], L = Math.hypot(ds, dz) || 1
    // outward in the wall plane for a counter-clockwise (s, z) ring: (dz, -ds)
    const os = dz / L, oz = -ds / L
    const n: V3 = [w.u[0] * os, w.u[1] * os, oz]
    faceN(p, [w.P(A[0], A[1], d0), w.P(B[0], B[1], d0), w.P(B[0], B[1], d1), w.P(A[0], A[1], d1)], n)
  }
}

/** A box standing out of a wall: s0..s1, z0..z1, from the face to depth d. */
export function wallBox(p: Part, w: { P: WallF; u: XY; n: XY }, s0: number, s1: number, z0: number, z1: number, d: number, bottom = true) {
  extrudeOn(p, w, [[s0, z0], [s1, z0], [s1, z1], [s0, z1]], 0, d)
  void bottom
}

/** A Doric column: fluted, tapering shaft, a flared echinus and a square abacus. */
export function doric(p: Part, cx: number, cy: number, z0: number, z1: number, r0: number, r1: number, flutes = 16, smooth = false) {
  const zc = z1 - 0.35 - 0.45 * (r1 / 0.8)
  const ring = (r: number, z: number): V3[] => Array.from({ length: flutes * 2 }, (_, i) => {
    const a = (i / (flutes * 2)) * 2 * Math.PI, k = i % 2 ? 0.9 : 1
    return [cx + r * k * Math.cos(a), cy + r * k * Math.sin(a), z]
  })
  const A = ring(r0, z0), B = ring(r1, zc)
  for (let i = 0; i < A.length; i++) {
    const j = (i + 1) % A.length
    const m: V3 = [(A[i][0] + A[j][0]) / 2 - cx, (A[i][1] + A[j][1]) / 2 - cy, 0]
    if (smooth) {
      // radial normals: the ring's corners are shared, half the vertices
      const nr = (q: V3): V3 => { const l = Math.hypot(q[0] - cx, q[1] - cy); return [(q[0] - cx) / l, (q[1] - cy) / l, 0.05] }
      p.tri(A[i], A[j], B[j], undefined, undefined, undefined, [nr(A[i]), nr(A[j]), nr(B[j])])
      p.tri(A[i], B[j], B[i], undefined, undefined, undefined, [nr(A[i]), nr(B[j]), nr(B[i])])
    } else faceN(p, [A[i], A[j], B[j], B[i]], m)
  }
  const za = z1 - 0.3 * (r1 / 0.8)
  lathe(p, cx, cy, [[r1 * 0.95, zc], [r1 * 1.32, za]], 8)
  const h = r1 * 1.42
  abox(p, cx - h, cy - h, cx + h, cy + h, za, z1, 'b,t')
}

/**
 * An Ionic column: an Attic base, a smooth tapering shaft and a capital
 * whose two volutes face along `axis` (the direction the column is seen
 * from: 'x' or 'y'). `volutes` false draws a plain block capital.
 */
export function ionic(p: Part, cx: number, cy: number, z0: number, z1: number, r0: number, r1: number, axis: 'x' | 'y', volutes = true, seg = 10) {
  const zb = z0 + r0 * 0.7, zc = z1 - r1 * 1.05
  if (!volutes) {
    lathe(p, cx, cy, [[r0, z0], [r1, zc]], seg)
    const hb = r1 * 1.3
    abox(p, cx - hb, cy - hb, cx + hb, cy + hb, zc, z1, 'b,t')
    return
  }
  lathe(p, cx, cy, [[r0 * 1.4, z0], [r0 * 1.4, z0 + r0 * 0.3], [r0 * 1.15, zb - r0 * 0.1], [r0, zb], [r1, zc], [r1 * 1.2, zc + r1 * 0.35]], seg)
  // the volute pad and abacus
  const w = r1 * 1.45, d = r1 * 0.9, zt = z1 - r1 * 0.25
  const bx = axis === 'x' ? [d, w] : [w, d]
  abox(p, cx - bx[0], cy - bx[1], cx + bx[0], cy + bx[1], zc + r1 * 0.2, zt, 'b')
  const hw = r1 * 1.25
  abox(p, cx - hw, cy - hw, cx + hw, cy + hw, zt, z1, 'b')
  if (!volutes) return
  const vr = r1 * 0.5, vz = zc + r1 * 0.3
  for (const s of [-1, 1]) {
    // a volute: a short drum at each end of the pad, its axis along the view
    const off = w - vr * 0.6
    const c: V3 = axis === 'x' ? [cx, cy + s * off, vz] : [cx + s * off, cy, vz]
    const a: V3 = axis === 'x' ? [c[0] - d - 0.05, c[1], c[2]] : [c[0], c[1] - d - 0.05, c[2]]
    const b: V3 = axis === 'x' ? [c[0] + d + 0.05, c[1], c[2]] : [c[0], c[1] + d + 0.05, c[2]]
    tube(p, a, b, vr, vr, seg >= 10 ? 8 : 6, true)
  }
}

/**
 * A figure in the round, about h tall standing, for pediments and attics.
 * Stands at `at`, facing horizontal `fwd`, with `side` the horizontal
 * direction along the pediment. Bold and simple: a draped body, a torso, a
 * head and arms, in one of a few poses.
 */
export type Pose = 'stand' | 'raise' | 'stride' | 'seated' | 'kneel' | 'recline' | 'recline-l' | 'bow'
export function figure(p: Part, at: V3, fwd: XY, h: number, pose: Pose, k = 5) {
  const side: XY = [-fwd[1], fwd[0]]
  const P = (a: number, f: number, z: number): V3 => [at[0] + side[0] * a * h + fwd[0] * f * h, at[1] + side[1] * a * h + fwd[1] * f * h, at[2] + z * h]
  const head = (c: V3, r: number) => lathe(p, c[0], c[1], [[0, c[2] - r], [r, c[2] + r * 0.1], [0, c[2] + r * 1.2]], 5)
  const arm = (a: V3, b: V3) => tube(p, a, b, 0.045 * h, 0.035 * h, 4, false)
  if (pose === 'recline' || pose === 'recline-l') {
    // lying along the pediment, head inward (toward -a for 'recline', +a for 'recline-l')
    const s = pose === 'recline' ? -1 : 1
    tube(p, P(s * 0.75, 0, 0.09), P(s * 0.1, 0, 0.12), 0.08 * h, 0.13 * h, k, true)
    tube(p, P(s * 0.1, 0, 0.12), P(-s * 0.18, 0.02, 0.22), 0.13 * h, 0.12 * h, k, true)
    head(P(-s * 0.3, 0.03, 0.3), 0.07 * h)
    arm(P(-s * 0.15, 0, 0.26), P(-s * 0.28, 0.02, 0.05))
    arm(P(-s * 0.12, 0.05, 0.26), P(s * 0.15, 0.1, 0.2))
    return
  }
  if (pose === 'seated') {
    // a throne block, the figure seated on it, knees forward
    const bx = (A: V3, B: V3, z0: number, z1: number) => abox(p, Math.min(A[0], B[0]), Math.min(A[1], B[1]), Math.max(A[0], B[0]), Math.max(A[1], B[1]), at[2] + z0 * h, at[2] + z1 * h, 'b')
    bx(P(-0.2, -0.24, 0), P(0.2, 0.04, 0), 0, 0.38)
    bx(P(-0.2, -0.3, 0), P(0.2, -0.22, 0), 0.38, 0.86)
    for (const s of [-1, 1]) {
      tube(p, P(s * 0.08, -0.1, 0.42), P(s * 0.09, 0.22, 0.42), 0.075 * h, 0.065 * h, k, false)
      tube(p, P(s * 0.09, 0.22, 0.44), P(s * 0.09, 0.25, 0), 0.06 * h, 0.05 * h, k, false)
    }
    tube(p, P(0, -0.1, 0.38), P(0, -0.08, 0.72), 0.14 * h, 0.12 * h, k, true)
    head(P(0, -0.07, 0.8), 0.07 * h)
    arm(P(0.13, -0.08, 0.68), P(0.16, 0.12, 0.45))
    arm(P(-0.13, -0.08, 0.68), P(-0.2, 0.0, 0.95)) // the sceptre arm, raised
    tube(p, P(-0.2, 0.0, 0.35), P(-0.2, 0.0, 1.05), 0.02 * h, 0.02 * h, 4, false)
    return
  }
  const kneel = pose === 'kneel', bow = pose === 'bow'
  const hip = kneel ? 0.32 : 0.5
  if (pose === 'stride') {
    tube(p, P(-0.06, 0, hip), P(-0.17, -0.06, 0), 0.06 * h, 0.045 * h, k, false)
    tube(p, P(0.06, 0, hip), P(0.2, 0.05, 0), 0.06 * h, 0.045 * h, k, false)
  } else if (kneel) {
    tube(p, P(-0.07, 0, hip), P(-0.08, 0.22, 0.04), 0.065 * h, 0.05 * h, k, false)
    tube(p, P(-0.08, 0.22, 0.04), P(-0.08, -0.05, 0.02), 0.05 * h, 0.04 * h, k, false)
    tube(p, P(0.07, 0, hip), P(0.08, 0.2, hip - 0.04), 0.065 * h, 0.055 * h, k, false)
    tube(p, P(0.08, 0.2, hip - 0.04), P(0.08, 0.22, 0), 0.055 * h, 0.045 * h, k, false)
  } else {
    // a long robe, flaring to the ground
    tube(p, P(0, 0, 0), P(0, 0, hip + 0.08), 0.15 * h, 0.1 * h, k, false)
  }
  const lean = bow ? 0.12 : 0
  const sh = P(0, lean, 0.8 - lean * 0.5)
  tube(p, P(0, 0, hip - 0.04), sh, 0.1 * h, 0.12 * h, k, false)
  lathe(p, sh[0], sh[1], [[0.12 * h, sh[2]], [0, sh[2] + 0.03 * h]], k)
  head(P(0, lean * 1.3, 0.87 - lean * 0.5), 0.065 * h)
  const L = P(-0.13, lean, 0.77 - lean * 0.5), R = P(0.13, lean, 0.77 - lean * 0.5)
  if (pose === 'raise') {
    arm(R, P(0.22, 0.04, 1.08))
    arm(L, P(-0.18, 0.1, 0.5))
  } else if (pose === 'stride') {
    arm(R, P(0.3, 0.12, 0.95))
    arm(L, P(-0.25, 0.15, 0.6))
    // a spear or sword along the raised arm
    tube(p, P(0.35, 0.14, 1.05), P(0.15, 0.06, 0.35), 0.018 * h, 0.018 * h, 4, false)
  } else if (bow || kneel) {
    arm(R, P(0.1, 0.3, 0.55))
    arm(L, P(-0.1, 0.3, 0.6))
  } else {
    arm(R, P(0.16, 0.08, 0.48))
    arm(L, P(-0.16, 0.05, 0.5))
  }
}

/** Relief silhouettes (s, z) about 1 tall, feet at z = 0, facing +s. */
export const RELIEF: Record<string, XY[]> = {
  robe: [[-0.14, 0], [0.14, 0], [0.11, 0.5], [0.13, 0.78], [0.06, 0.84], [0.06, 0.87], [0.09, 0.9], [0.07, 0.98], [0, 1.0], [-0.07, 0.98], [-0.09, 0.9], [-0.06, 0.87], [-0.06, 0.84], [-0.13, 0.78], [-0.11, 0.5]],
  stride: [[-0.24, 0], [-0.15, 0], [0, 0.36], [0.13, 0], [0.22, 0], [0.08, 0.47], [0.1, 0.72], [0.3, 0.98], [0.34, 0.94], [0.15, 0.76], [0.07, 0.84], [0.07, 0.88], [0.04, 0.98], [-0.04, 0.98], [-0.07, 0.88], [-0.07, 0.84], [-0.12, 0.78], [-0.3, 0.55], [-0.27, 0.51], [-0.1, 0.67], [-0.08, 0.47]],
  raise: [[-0.13, 0], [0.13, 0], [0.1, 0.5], [0.12, 0.76], [0.17, 1.08], [0.22, 1.08], [0.17, 0.72], [0.07, 0.84], [0.06, 0.88], [0.03, 0.98], [-0.04, 0.98], [-0.07, 0.88], [-0.06, 0.84], [-0.12, 0.78], [-0.1, 0.5]],
  kneel: [[-0.18, 0], [0.28, 0], [0.28, 0.1], [0.08, 0.12], [0.1, 0.42], [0.27, 0.53], [0.25, 0.58], [0.08, 0.52], [0.05, 0.6], [0.06, 0.66], [0, 0.7], [-0.06, 0.66], [-0.05, 0.6], [-0.1, 0.54], [-0.1, 0.25], [-0.18, 0.2]],
  rider: [[-0.55, 0], [-0.46, 0], [-0.4, 0.3], [0.22, 0.3], [0.28, 0], [0.37, 0], [0.36, 0.38], [0.52, 0.6], [0.47, 0.67], [0.3, 0.55], [0.08, 0.52], [0.1, 0.75], [0.3, 0.95], [0.32, 0.91], [0.13, 0.7], [0.07, 0.8], [0.05, 0.9], [-0.03, 0.9], [-0.06, 0.8], [-0.07, 0.52], [-0.4, 0.52], [-0.58, 0.35]],
  seated: [[-0.16, 0], [-0.08, 0], [-0.06, 0.32], [0.18, 0.34], [0.2, 0], [0.27, 0], [0.26, 0.44], [0.08, 0.46], [0.09, 0.66], [0.22, 0.6], [0.23, 0.64], [0.06, 0.74], [0.05, 0.8], [0, 0.84], [-0.06, 0.8], [-0.06, 0.74], [-0.12, 0.68], [-0.14, 0.4], [-0.2, 0.38]],
}
// Coarse versions for the low model: about half the outline points.
Object.assign(RELIEF, {
  'robe-': [[-0.14, 0], [0.14, 0], [0.12, 0.78], [0.07, 0.86], [0.06, 0.99], [-0.06, 0.99], [-0.07, 0.86], [-0.12, 0.78]],
  'raise-': [[-0.13, 0], [0.13, 0], [0.12, 0.76], [0.2, 1.08], [0.07, 0.86], [0.05, 0.99], [-0.06, 0.99], [-0.07, 0.86], [-0.12, 0.78]],
  'stride-': [[-0.24, 0], [-0.12, 0], [0, 0.35], [0.12, 0], [0.24, 0], [0.1, 0.74], [0.32, 0.97], [0.05, 0.99], [-0.06, 0.99], [-0.12, 0.76]],
  'kneel-': [[-0.18, 0], [0.28, 0], [0.28, 0.1], [0.09, 0.14], [0.26, 0.56], [0.06, 0.7], [-0.06, 0.7], [-0.1, 0.25], [-0.18, 0.2]],
  'seated-': [[-0.16, 0], [0.27, 0], [0.26, 0.44], [0.09, 0.46], [0.06, 0.84], [-0.06, 0.84], [-0.14, 0.4], [-0.2, 0.38]],
  'rider-': [[-0.55, 0], [-0.45, 0], [-0.4, 0.3], [0.22, 0.3], [0.28, 0], [0.37, 0], [0.52, 0.64], [0.08, 0.52], [0.06, 0.9], [-0.06, 0.9], [-0.07, 0.52], [-0.58, 0.35]],
})

/** A relief figure: silhouette `kind`, scaled to h, centred at s, feet at z, mirrored if `flip`. */
export function relief(p: Part, w: { P: WallF; u: XY; n: XY }, kind: string, s: number, z: number, h: number, d: number, flip = false) {
  const poly = RELIEF[kind].map(([a, b]) => [s + (flip ? -a : a) * h, z + b * h] as XY)
  extrudeOn(p, w, poly, 0, d)
}

/** A laurel wreath on a wall: a flat ring standing out of it. */
export function wreath(p: Part, w: { P: WallF; u: XY; n: XY }, s: number, z: number, r: number, d: number, seg = 10) {
  const ri = r * 0.62
  const N: V3 = [w.n[0], w.n[1], 0]
  for (let i = 0; i < seg; i++) {
    const a0 = (i / seg) * 2 * Math.PI, a1 = ((i + 1) / seg) * 2 * Math.PI
    const o0: XY = [s + r * Math.cos(a0), z + r * Math.sin(a0)], o1: XY = [s + r * Math.cos(a1), z + r * Math.sin(a1)]
    const i0: XY = [s + ri * Math.cos(a0), z + ri * Math.sin(a0)], i1: XY = [s + ri * Math.cos(a1), z + ri * Math.sin(a1)]
    faceN(p, [w.P(o0[0], o0[1], d), w.P(o1[0], o1[1], d), w.P(i1[0], i1[1], d), w.P(i0[0], i0[1], d)], N)
    const am = (a0 + a1) / 2
    const out: V3 = [w.u[0] * Math.cos(am), w.u[1] * Math.cos(am), Math.sin(am)]
    faceN(p, [w.P(o0[0], o0[1], 0), w.P(o1[0], o1[1], 0), w.P(o1[0], o1[1], d), w.P(o0[0], o0[1], d)], out)
  }
}

/** A palmette (anthemion) outline, base centred at (s, z), w wide, h tall. */
export function palmette(s: number, z: number, w: number, h: number, lobes = 7): XY[] {
  const pts: XY[] = [[s + w * 0.18, z]]
  const cz = z + h * 0.32, R = h * 0.68
  for (let i = 0; i <= lobes * 2; i++) {
    const t = i / (lobes * 2), a = -0.15 + t * (Math.PI + 0.3)
    const rr = i % 2 ? R * 0.78 : R
    pts.push([s + Math.cos(a) * rr * (w / (2 * R)) * 1.0, cz + Math.sin(a) * rr])
  }
  pts.push([s - w * 0.18, z])
  return pts
}

/** A flight of `n` steps rising toward -sx at x = xs.. (front edge x1), y0..y1. */
export function steps(p: Part, sx: number, x0: number, x1: number, y0: number, y1: number, zTop: number, n: number) {
  const dz = zTop / n, dx = (x1 - x0) / n
  for (let i = 0; i < n; i++) {
    const xa = sx * x0, xb = sx * (x1 - i * dx)
    abox(p, Math.min(xa, xb), y0, Math.max(xa, xb), y1, i * dz, (i + 1) * dz, 'b')
  }
}

type Parts = { part: Part; material: Swatch }[]
/**
 * Write the low model (models/<id>.glb, 6,500 triangles and 250 KB) and the
 * detail model (models/<id>.detail.glb, 40,000 triangles and 1.5 MB), the
 * same building in the same frame; the catalog carries "detail" with
 * "detailZoom": 17.
 */
export async function saveLods(id: string, name: string, anchor: [number, number], bearing: number, low: Parts, detail: Parts) {
  for (const [parts, file, maxTri, maxBytes] of [[low, `${id}.glb`, 6500, 250_000], [detail, `${id}.detail.glb`, 40_000, 1_536_000]] as [Parts, string, number, number][]) {
    const used = parts.filter((x) => x.part.triangles > 0)
    const triangles = used.reduce((s, x) => s + x.part.triangles, 0)
    if (used.length > 6) throw new Error(`${file}: ${used.length} materials`)
    const glb = writeGlb(name, used, { frame: 'Y up, -Z north, +X east; metres; ground anchor', anchor, bearing })
    const out = new URL(`../models/${file}`, import.meta.url).pathname
    if (triangles > maxTri || glb.length > maxBytes) throw new Error(`${file}: budget exceeded: ${triangles} triangles / ${glb.length} bytes`)
    await Bun.write(out, glb)
    console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
  }
}

// ---------------------------------------------------------------------------
// Propyläen

const TX = 7.5 // tower half-depth (x), = the hall
const TY0 = 12.8, TY1 = 27.7 // tower y range
const STY = 1.1 // stylobate top
const COL = 11.3 // column top
const ENT = 15.3 // entablature top
const APEX = 18.6 // pediment apex, hall top
const XF = 11.3 // entablature front (architrave face)

function build(D: boolean) {
  const marble = new Part(), sculpt = new Part(), roof = new Part(), shade = new Part(), flat = new Part()

  // ------------------------------------------------------------- towers
  for (const sy of [-1, 1]) {
    const y0 = sy > 0 ? TY0 : -TY1, y1 = sy > 0 ? TY1 : -TY0, yc = (y0 + y1) / 2
    const yIn = sy > 0 ? y0 : y1, yOut = sy > 0 ? y1 : y0 // inner (hall) and outer faces
    const PW = 2.35, PH = 8.6 // passage half-width, height
    // plinth course and the two legs either side of the passage
    for (const [a, b] of [[y0, yc - PW], [yc + PW, y1]]) {
      abox(marble, -TX - 0.12, a - (a === y0 ? 0.12 : 0), TX + 0.12, b + (b === y1 ? 0.12 : 0), 0, 0.55, 'b')
      abox(marble, -TX, a, TX, b, 0.55, PH, 'b,t')
    }
    // the passage ceiling and the solid tower above it
    faceN(marble, [[-TX, yc - PW, PH], [TX, yc - PW, PH], [TX, yc + PW, PH], [-TX, yc + PW, PH]], [0, 0, -1])
    abox(marble, -TX, y0, TX, y1, PH, 18.35, 'b')
    // string course at 15.3 and the loggia sill at 18.1
    corniceBox(marble, -TX, y0, TX, y1, 15.25, 15.5, 0.1)
    corniceBox(marble, -TX, y0, TX, y1, 18.05, 18.35, 0.18)

    // the loggia: corner piers, four pillars a side, a dark recess behind
    const LZ0 = 18.35, LZ1 = 22.2, CP = 1.875, PILW = 0.88, OPEN = 1.54, DEEP = 1.2
    abox(shade, -TX + DEEP, y0 + DEEP, TX - DEEP, y1 - DEEP, LZ0, LZ1, 'b,t')
    for (const cx of [-1, 1]) for (const cy of [-1, 1]) {
      const xa = cx * TX, ya = cy > 0 ? y1 : y0
      abox(marble, Math.min(xa, xa - cx * CP), Math.min(ya, ya - cy * CP), Math.max(xa, xa - cx * CP), Math.max(ya, ya - cy * CP), LZ0, LZ1, 'b,t')
    }
    for (let i = 0; i < 4; i++) {
      const c = -7.5 + CP + OPEN + PILW / 2 + i * (OPEN + PILW) // pillar centre along a 15 m face
      // on the x faces (along y) and on the y faces (along x)
      for (const sx of [-1, 1]) abox(marble, sx > 0 ? TX - DEEP : -TX, yc + c - PILW / 2, sx > 0 ? TX : -TX + DEEP, yc + c + PILW / 2, LZ0, LZ1, 'b,t')
      for (const yy of [y0, y1]) abox(marble, c - PILW / 2, yy === y0 ? y0 : y1 - DEEP, c + PILW / 2, yy === y0 ? y0 + DEEP : y1, LZ0, LZ1, 'b,t')
    }
    // pillar capitals: a thin pale band across the loggia head
    // entablature band, its pale anthemion strip, the cornice, the attic
    abox(marble, -TX, y0, TX, y1, LZ1, 24.6, 't')
    for (const [o, u, n, L] of [
      [[TX, yc], [0, 1], [1, 0], 15], [[-TX, yc], [0, -1], [-1, 0], 15],
      [[0, yOut], [sy, 0], [0, sy], 15], [[0, yIn], [-sy, 0], [0, -sy], 15],
    ] as [XY, XY, XY, number][]) {
      const w = wallAt(o, u, n)
      wallBox(sculpt, w, -L / 2 + 0.3, L / 2 - 0.3, 23.15, 24.35, 0.06)
      if (D) wallBox(marble, w, -L / 2, L / 2, 22.2, 22.45, 0.08)
    }
    corniceBox(marble, -TX, y0, TX, y1, 24.6, 26.0, 0.7)
    const AI = 0.15
    abox(marble, -TX + AI, y0 + AI, TX - AI, y1 - AI, 26.0, 27.1, 'b,t')
    // the attic top: a low copper pyramid behind a coping
    if (D) corniceBox(marble, -TX + AI, y0 + AI, TX - AI, y1 - AI, 26.95, 27.1, 0.06, false)
    {
      const r = rect(-TX + AI, y0 + AI, TX - AI, y1 - AI)
      for (let i = 0; i < 4; i++) {
        const a = r[i], b = r[(i + 1) % 4]
        const A: V3 = [a[0], a[1], 27.1], B: V3 = [b[0], b[1], 27.1], T: V3 = [0, yc, 27.15]
        triF(flat, A, B, T, [((a[0] + b[0]) / 2) * 0.1, ((a[1] + b[1]) / 2 - yc) * 0.1, 1])
      }
    }
    for (const cx of [-1, 1]) for (const cy of [-1, 1]) {
      const xa = cx * (TX - AI), ya = cy > 0 ? y1 - AI : y0 + AI, B = 2.4
      const bx0 = Math.min(xa, xa - cx * B), bx1 = Math.max(xa, xa - cx * B), by0 = Math.min(ya, ya - cy * B), by1 = Math.max(ya, ya - cy * B)
      abox(marble, bx0, by0, bx1, by1, 27.1, D ? 27.85 : 28.0, 'b')
      if (D) corniceBox(marble, bx0, by0, bx1, by1, 27.85, 28.0, 0.06)
    }

    // the gate portals on the x faces, the relief friezes above them
    for (const sx of [-1, 1]) {
      const w = wallAt([sx * TX, yc], [0, sx], [sx, 0])
      // architrave surround
      extrudeOn(marble, w, [[-2.95, 0.55], [-PW, 0.55], [-PW, PH], [PW, PH], [PW, 0.55], [2.95, 0.55], [2.95, 9.25], [-2.95, 9.25]], 0, 0.16)
      // frieze, consoles and cornice over the door
      wallBox(marble, w, -2.95, 2.95, 9.25, 10.15, 0.08)
      for (const s of [-1, 1]) wallBox(marble, w, s * 3.05 - 0.22, s * 3.05 + 0.22, 9.0, 10.15, 0.42)
      extrudeOn(marble, w, [[-3.45, 10.15], [3.45, 10.15], [3.6, 10.55], [3.6, 10.8], [-3.6, 10.8], [-3.6, 10.55]], 0, 0.55)
      // palmette acroterion with scrolls
      extrudeOn(sculpt, w, palmette(0, 10.8, 1.5, 1.35, D ? 7 : 4), 0.15, 0.4)
      for (const s of [-1, 1]) extrudeOn(sculpt, w, [[s * 0.75, 10.8], [s * 1.65, 10.8], [s * 1.6, 11.1], [s * 1.1, 11.25], [s * 0.8, 11.05]], 0.15, 0.35)
      // the frieze: west oath / land battle, east sea battle / civil war
      // seen from the east (sx > 0) the south tower is on the left: sea battle left, civil war right;
      // from the west the north tower is on the left: oath left, land battle right
      const seq = sx > 0
        ? (sy > 0 ? ['robe', 'stride', 'kneel', 'stride', 'stride', 'robe', 'seated'] : ['stride', 'stride', 'kneel', 'stride', 'raise', 'stride', 'kneel'])
        : (sy > 0 ? ['raise', 'robe', 'robe', 'seated', 'robe', 'raise', 'robe'] : ['rider', 'stride', 'kneel', 'stride', 'rider', 'stride'])
      if (!D) seq.splice(1, seq.length - 5)
      const span = 11.2, n = seq.length
      seq.forEach((kind, i) => {
        const s = -span / 2 + (span * (i + 0.5)) / n
        relief(sculpt, w, D ? kind : kind + '-', s, 15.6, kind === 'rider' ? 2.0 : 2.25, 0.2, i >= n / 2)
      })
    }

    // the outer face: three framed windows and the five laurel wreaths
    {
      const w = wallAt([0, yOut], [sy, 0], [0, sy])
      for (const [s, hw, z0, z1] of [[-4.6, 0.6, 3.7, 6.3], [0, 0.85, 3.6, 7.3], [4.6, 0.6, 3.7, 6.3]]) {
        extrudeOn(marble, w, [[s - hw - 0.3, z0 - 0.3], [s + hw + 0.3, z0 - 0.3], [s + hw + 0.3, z1 + 0.3], [s - hw - 0.3, z1 + 0.3]], 0, 0.1)
        wallBox(shade, w, s - hw, s + hw, z0, z1, 0.13)
        if (D) wallBox(marble, w, s - hw - 0.4, s + hw + 0.4, z1 + 0.3, z1 + 0.55, 0.25)
      }
      for (let i = 0; i < 5; i++) {
        const s = -4.5 + i * 2.25
        if (D) wallBox(marble, w, s - 0.85, s + 0.85, 15.75, 17.85, 0.05)
        wreath(sculpt, w, s, 16.8, 0.62, 0.2, D ? 12 : 6)
      }
    }
  }

  // ------------------------------------------------------- the middle
  // platforms either side of the street (OSM way/222672553, 222895882)
  for (const sy of [-1, 1]) {
    const ya = sy * 1.9, yb = sy * TY0, ylo = Math.min(ya, yb), yhi = Math.max(ya, yb)
    abox(marble, -XF, ylo, XF, yhi, 0, STY, 'b')
    for (const sx of [-1, 1]) steps(marble, sx, XF, XF + 1.5, ylo, yhi, STY, D ? 3 : 2)
  }
  // the hall over the street: Ionic columns, ceiling, upper walls
  for (const x of [-5.7, -1.9, 1.9, 5.7]) for (const y of [-6.7, -2.8, 2.8, 6.7]) if (D || (Math.abs(x) < 2 && Math.abs(y) < 3))
    ionic(marble, x, y, STY, COL, 0.5, 0.42, 'x', D, D ? 10 : 6)
  abox(marble, -TX, -TY0, TX, TY0, COL, APEX - 0.5, 'y0,y1,t')
  corniceBox(marble, -TX, -TY0, TX, TY0, APEX - 0.5, APEX, 0.3, false)
  cap(flat, inset(rect(-TX - 0.3, -TY0 - 0.3, TX + 0.3, TY0 + 0.3), 0.12), APEX)
  // The gate walls behind each portico, as in Athens: five doorways, the
  // middle one the street's, the others closed by dark grilles. Estimated:
  // the photos show the side bays dark behind the columns.
  const doors: [number, number, number][] = [[-9.2, 0.9, 6.0], [-5.3, 1.1, 7.5], [0, 2.3, 9.5], [5.3, 1.1, 7.5], [9.2, 0.9, 6.0]]
  for (const sx of [-1, 1]) {
    const xa = Math.min(sx * 6.3, sx * 7.3), xb = Math.max(sx * 6.3, sx * 7.3)
    let y = -TY0
    if (!D) {
      // low model: a solid wall with the street's opening, the grilles flat on it
      for (const sy of [-1, 1]) abox(marble, xa, Math.min(sy * 2.3, sy * TY0), xb, Math.max(sy * 2.3, sy * TY0), STY, COL, 'b,t')
      abox(marble, xa, -2.3, xb, 2.3, 9.5, COL, 't')
      for (const [c, hw, h] of doors) if (c !== 0) faceN(shade, [[sx * 7.33, c - hw, STY], [sx * 7.33, c + hw, STY], [sx * 7.33, c + hw, h], [sx * 7.33, c - hw, h]], [sx, 0, 0])
      continue
    }
    for (const [c, hw, h] of doors) {
      const z0 = c === 0 ? 0 : STY
      abox(marble, xa, y, xb, c - hw, STY, COL, 'b,t')
      abox(marble, xa, c - hw, xb, c + hw, h + z0 * 0, COL, 't')
      if (c !== 0) faceN(shade, [[sx * 6.95, c - hw, STY], [sx * 6.95, c + hw, STY], [sx * 6.95, c + hw, h], [sx * 6.95, c - hw, h]], [sx, 0, 0])
      y = c + hw
    }
    abox(marble, xa, y, xb, TY0, STY, COL, 'b,t')
  }

  // the porticoes
  for (const sx of [-1, 1]) {
    const X = (x: number) => sx * x
    const lo = (a: number, b: number) => Math.min(X(a), X(b)), hi = (a: number, b: number) => Math.max(X(a), X(b))
    for (const y of [-10.8, -7.2, -3.1, 3.1, 7.2, 10.8]) doric(marble, X(10.2), y, STY, COL, 0.98, 0.78, D ? 20 : 12, !D)
    // antae against the towers
    for (const sy of [-1, 1]) abox(marble, lo(9.55, 10.85), Math.min(sy * 11.95, sy * TY0), hi(9.55, 10.85), Math.max(sy * 11.95, sy * TY0), STY, COL, 'b')
    // architrave, frieze with triglyphs, cornice
    abox(marble, lo(TX, XF), -TY0, hi(TX, XF), TY0, COL, 12.9, 't')
    abox(marble, lo(TX, XF - 0.12), -TY0, hi(TX, XF - 0.12), TY0, 12.9, 14.5, 'b,t')
    const ts = [12.45, 10.8, 9.0, 7.2, 5.15, 3.1, 1.03]
    for (const t of [...ts, ...ts.map((v) => -v)]) abox(sculpt, lo(XF - 0.12, XF + 0.02), t - 0.36, hi(XF - 0.12, XF + 0.02), t + 0.36, 12.95, 14.45, 'b,t')
    for (const sy of [-1, 1]) for (const x of [8.2, 9.9]) abox(sculpt, lo(x - 0.36, x + 0.36), Math.min(sy * TY0, sy * (TY0 + 0.14)), hi(x - 0.36, x + 0.36), Math.max(sy * TY0, sy * (TY0 + 0.14)), 12.95, 14.45, 'b,t')
    // horizontal cornice: overhangs front and sides, its top is the pediment floor
    {
      const x0 = lo(TX, XF + 0.55), x1 = hi(TX, XF + 0.55)
      const yo = TY0 + 0.0
      faceN(marble, [[X(XF + 0.55), -yo, 14.5], [X(XF + 0.55), yo, 14.5], [X(XF + 0.55), yo, ENT], [X(XF + 0.55), -yo, ENT]], [sx, 0, 0])
      faceN(marble, [[X(XF - 0.12), -yo, 14.5], [X(XF + 0.55), -yo, 14.5], [X(XF + 0.55), yo, 14.5], [X(XF - 0.12), yo, 14.5]], [0, 0, -1])
      faceN(marble, [[x0, -yo, ENT], [x1, -yo, ENT], [x1, yo, ENT], [x0, yo, ENT]], [0, 0, 1])
      for (const sy of [-1, 1]) faceN(marble, [[x0, sy * yo, 14.5], [x1, sy * yo, 14.5], [x1, sy * yo, ENT], [x0, sy * yo, ENT]], [0, sy, 0])
    }
    // pediment: tympanum set back, raking cornices, copper roof behind
    const RH = APEX - ENT, HW = TY0, RC = 0.7, XT = XF - 0.75, XR = XF + 0.55
    const top = (y: number) => ENT + RH * (1 - Math.abs(y) / HW)
    const yMeet = HW * (1 - RC / RH)
    faceN(marble, [[X(XT), -yMeet, ENT], [X(XT), yMeet, ENT], [X(XT), 0, APEX - RC]], [sx, 0, 0])
    for (const sy of [-1, 1]) {
      const yE = sy * HW, y0 = 0
      // the raking cornice: front face, soffit, top (roof) and end
      faceN(marble, [[X(XR), yE, ENT], [X(XR), sy * yMeet, ENT], [X(XR), y0, APEX - RC], [X(XR), y0, APEX]], [sx, 0, 0])
      faceN(marble, [[X(XT), sy * yMeet, ENT], [X(XR), sy * yMeet, ENT], [X(XR), y0, APEX - RC], [X(XT), y0, APEX - RC]], [0, -sy * RH, -HW])
      // roof slope from the cornice's front edge back to the hall
      faceN(marble, [[X(XR), y0, APEX], [X(XR), yE, top(yE)], [X(XT), yE, top(yE)], [X(XT), y0, APEX]], [0, sy * RH, HW])
      faceN(roof, [[X(XT), y0, APEX], [X(XT), yE, top(yE)], [X(TX), yE, top(yE)], [X(TX), y0, APEX]], [0, sy * RH, HW])
    }
    // the pediment's sculpture, standing on the cornice
    const fwd: XY = [sx, 0], fx = X(XT + 0.55)
    const east = sx > 0
    const cast: [number, number, Pose][] = east
      ? [[0, 3.5, 'seated'], [1.9, 2.5, 'bow'], [-1.9, 2.5, 'bow'], [3.6, 2.15, 'stand'], [-3.6, 2.15, 'stand'], [5.4, 2.25, 'kneel'], [-5.4, 2.25, 'kneel'], [7.1, 1.75, 'kneel'], [-7.1, 1.75, 'kneel'], [9.2, 1.5, 'recline'], [-9.2, 1.5, 'recline-l']]
      : [[0, 2.95, 'raise'], [1.8, 2.55, 'stand'], [-1.8, 2.55, 'stand'], [3.6, 2.15, 'stride'], [-3.6, 2.15, 'stride'], [5.4, 2.25, 'kneel'], [-5.4, 2.25, 'kneel'], [7.1, 1.75, 'kneel'], [-7.1, 1.75, 'kneel'], [9.2, 1.5, 'recline'], [-9.2, 1.5, 'recline-l']]
    for (const [a, h, pose] of cast) {
      // along the pediment: side = (-fwd.y, fwd.x) = (0, sx); a is along +y
      const y = a
      // reclining figures face their head to the middle
      const flip = (pose === 'recline' && a * sx < 0) || (pose === 'recline-l' && a * sx > 0)
      if (!D && Math.abs(a) > 6) continue
      figure(sculpt, [fx, y, ENT], fwd, h, flip ? (pose === 'recline' ? 'recline-l' : 'recline') : pose, D ? 6 : 4)
    }
    // acroteria: a palmette on the apex, smaller ones at the corners
    const wa = wallAt([X(XT + 0.3), 0], [0, sx], [sx, 0])
    extrudeOn(sculpt, wa, palmette(0, APEX - 0.05, 1.5, 1.35), -0.2, 0.2, true)
    for (const sy of [-1, 1]) extrudeOn(sculpt, wallAt([X(XT + 0.3), sy * (HW - 0.55)], [0, sx], [sx, 0]), palmette(0, ENT + 0.05, 0.9, 0.9, 5), -0.2, 0.2, true)
  }

  const flood = (p: V3, n: V3) => (n[2] > 0.7 ? 0.25 : p[2] < 0.5 ? 0.5 : 0.9)
  return [
    { part: marble, material: { ...finish('propylaeen-marble', 0xebdfca), floodlight: flood } },
    { part: sculpt, material: { ...finish('propylaeen-sculpture', 0xf7efe2), floodlight: flood } },
    { part: roof, material: { ...PALETTE.copper } },
    { part: shade, material: finish('propylaeen-shade', 0x55595f) },
    { part: flat, material: { ...PALETTE.roof } },
  ]
}

if (import.meta.main) {
  await saveLods('munich-propylaeen', 'Propyläen', [48.146068, 11.5642624], 21.7, build(false), build(true))
}
