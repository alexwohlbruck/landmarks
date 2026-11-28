/**
 * Court Philippe-Chatrier, Stade Roland-Garros, Paris: original procedural
 * geometry, CC0-1.0, no textures.  bun generators/paris-court-philippe-chatrier.ts
 *
 * Writes models/paris-court-philippe-chatrier.glb (<= 6,500 triangles) and
 * models/paris-court-philippe-chatrier.detail.glb (drawn from zoom 16): the
 * tiers stepped, the roof wings' steel ribs and the two long girders.
 * Uses the kit exported by melbourne-mcg.ts (merge that first).
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 21.3: model
 * +y runs along the court (north-north-east), +x across it. Anchor = the
 * area centroid of the court, OSM way/1188780871 (leisure=pitch, 41 x
 * 20.7 m, long edges at 21.3 deg), lng 2.2492151, lat 48.8471529. The
 * stadium outline (way/792571281, the outer of building=stadium
 * relation/11004030) is 108.2 x 109.5 m, x -53.7..54.5, y -50.1..59.4 in
 * this frame.
 *
 * Identity, in order: the rectangular stadium of grey concrete stands in
 * two tiers round the court, a dark green court wall and box bands; the
 * 2020 retractable roof drawn open: its eleven white fabric-clad wings
 * stacked in a ribbed band over the north stand, on two long girders over
 * the long sides; the fixed ring roof, a broad white slab cantilevered over
 * the facades all round; the dark glazed block of boxes and press seats at
 * the south end; grey seats.
 *
 * Evidence
 *  - OSM (measured in this frame): 307 building:part ways inside the
 *    outline (the seat rows, platforms, stairs, the ring roof and the
 *    wings) and relations 11004030 (building=stadium), 15897597 (the
 *    3.1 m podium round the court) and 15897598 (the ring roof), all in
 *    replaces. Tier heights read along eight radial
 *    lines (prof.py in the work folder): lower tier from the court wall
 *    (x +-21, y +-29) to x +-34 / y -42 / y +39 at 8.4-9.7 m; upper tier
 *    from 14.1 m to 23.2-23.7 m at x +-48 / y +54; a 15.7 m concourse roof
 *    to the facade; a 23 m block at the south end (r 44-50 on the axis);
 *    ring roof relation/15897598 23-25.89 m; the wings: a 25.89-29.09 m
 *    band over y 27.3-59.4 with eleven 1.7 m crests to 31.45 m, the full
 *    width of the outline.
 *  - Published (fr.wikipedia "Court Philippe-Chatrier", FFT press kit,
 *    2019-20 works): 15,000 seats; retractable roof 2020, eleven wings on
 *    two 110 m steel girders, fabric-clad, folding over the north end when
 *    open; roof about 30 m high.
 *  - Photos (Wikimedia Commons, all EVIDENCE):
 *    - q79, q80, q81, q82, q83, q84, q85: Chabe01, "Court Philippe Chatrier
 *      - Paris XVI (FR75) - 2024-02-18 - 1/2/4/5/6/7/8.jpg", CC BY-SA 4.0:
 *      inside, every side: grey stands, green walls and boxes, the south
 *      glazed block, the wings stacked over the north end.
 *    - p68: MFonzatti, "Court Philippe Chatrier 2024 vue extérieure.jpg",
 *      CC BY-SA 4.0: the ring roof's edge and the wing crests from outside.
 *    - p74, p75, p76: Like tears in rain, "Court Philippe-Chatrier at the
 *      2024 Summer Olympics (1/2/3).jpg", CC BY-SA 4.0: the facade, stairs,
 *      the cantilevered ring roof.
 *    - p69: MFonzatti, "Court Philippe Chatrier 2024.jpg", CC BY-SA 4.0.
 *    - p105, p107, p109: Remi Mathis, "Roland Garros 2023 - court central -
 *      Zverev-Molcan 01/03/05.jpg", CC BY-SA 4.0: seats, the open roof.
 *    - p64: Hombrey, "Court Chatrier Paris Major 2024 toit fermé.jpg", CC0:
 *      the wings closed (not modelled).
 *    - q75, q77: Hombrey, "Court Chatrier Paris Major 2024 nuit.jpg" and
 *      "Court Chatrier Paris Major 2024.jpg", CC0: night lighting.
 *  No lidar or aerial photo; no commercial imagery.
 *
 * Elevation 0, y = 0 at the court, taken as level with the allées round
 * the stadium: OSM's part heights (roof 31.45 m) and the exterior photos
 * (p68, p75) show the full height standing on the allées. Doubt: no
 * published court level. Mapterhorn (z15) shows a tilted pit under the
 * stadium, 0 m at the west of the court rising to 11 m at its east, the
 * ground outside at 11.5-16 m all round: an artifact of the missing ground under
 * the stands, not a real dig, so the terrain check reports buried tops.
 *
 * Invented or simplified, and doubts:
 *  - The stands are one cross-section swept round rounded rectangles fitted
 *    to the OSM rows; aisles, vomitories and the boxes' red-brown backs are
 *    left out. Seats drawn one grey (the real ones are grey with tan patches).
 *  - The facade is two broad pale bands (the perforated white cladding,
 *    drawn plain) over dark recessed levels; the four corner blocks clad in
 *    the same panels; four external stair towers (white frames, landings
 *    with glass balustrades, switchback flights) on the long sides, placed
 *    from p74-p76 (their exact number and spacing are estimated).
 *  - Detail-model wing ribs and girders follow the photos, spacing evenly.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { face, rayHit, vadd, vmul } from './seoul-world-cup-stadium'
import { bar, loftSections, obox, tier, writeLods, type Sec } from './melbourne-mcg'

type XY = [number, number]
const BEARING = 21.3

/** A rounded rectangle, counter-clockwise: x from -xw to xe, y from -ys to yn, corner radius R. */
function rrect(xw: number, xe: number, ys: number, yn: number, R: number, seg = 6): XY[] {
  const out: XY[] = []
  const corners: [number, number, number][] = [[xe - R, -ys + R, -90], [xe - R, yn - R, 0], [-xw + R, yn - R, 90], [-xw + R, -ys + R, 180]]
  for (const [cx, cy, a0] of corners)
    for (let k = 0; k <= seg; k++) {
      const a = ((a0 + (90 * k) / seg) * Math.PI) / 180
      out.push([cx + R * Math.cos(a), cy + R * Math.sin(a)])
    }
  return out
}

// Rings (OSM rows, this frame)
const R_WALL = rrect(21, 21, 29, 29, 5)
const R_LOW = rrect(34, 34, 42, 39, 13)
const R_UPF = rrect(35.6, 35.6, 43.6, 40.6, 14)
const R_UPB = rrect(48, 48, 46, 54, 20)
const R_FAC = rrect(52.6, 53.4, 49, 57.5, 22)
const R_ROOFIN = rrect(42, 42, 46, 48, 16)
const OUTLINE: XY[] = [[-53.7, -50.1], [54.5, -49.6], [54.5, 59.4], [-53.7, 58.9]]

/** Is angle phi on the south end, where the glazed block replaces the upper tier? */
const southBlock = (f: number) => {
  const x = Math.cos(f), y = Math.sin(f)
  return y < 0 && Math.abs(x / y) < 0.62
}

function build(detail: boolean) {
  const concrete = new Part(), seats = new Part(), green = new Part(), white = new Part(), win = new Part(), steel = new Part()
  const N = detail ? 160 : 72
  const steps = detail ? 5 : 0
  // uniform angles plus the corners of the south block so its edges are clean
  const fS = Math.atan2(-1, 0.62)
  const base = Array.from({ length: N }, (_, k) => -Math.PI + (k / N) * 2 * Math.PI)
  const phis = [...base, fS, -Math.PI - fS].map((f) => Math.atan2(Math.sin(f), Math.cos(f))).sort((a, b) => a - b)
  const frames = phis.map((f) => ({ o: [0, 0] as [number, number], d: [Math.cos(f), Math.sin(f)] as [number, number] }))
  const r = (poly: XY[], f: number) => rayHit(poly, f)

  // --- The stands.
  const secs = phis.map((f, i) => {
    const rw = r(R_WALL, f), rl = r(R_LOW, f), ruf = r(R_UPF, f), rub = r(R_UPB, f), rfac = r(R_FAC, f)
    // the south block: decide by the segment that starts here, so its two sides are clean
    const fm = i < phis.length - 1 ? (f + phis[i + 1]) / 2 : f
    const block = southBlock(fm)
    const out: Sec[] = [
      { r: rw - 0.6, z: 0, part: green }, // the court wall
      { r: rw - 0.6, z: 1.6, part: green },
      { r: rw + 0.6, z: 1.6, part: null },
      ...tier(seats, rw + 0.6, 1.6, rl, 9.4, steps),
      { r: rl, z: 9.4, part: green }, // the box band: dark green fronts
      { r: rl, z: 10.6, part: win },
      { r: rl, z: 13.4, part: concrete },
      { r: ruf, z: 13.4, part: block ? win : seats },
    ]
    if (block) {
      // a glazed face up to the ring roof, then its top back to the facade
      out.push({ r: ruf, z: 23.2, part: concrete })
      // pad to the tier's point count with points on the block's top
      for (let k = 0; k < Math.max(0, 2 * steps - 2); k++) out.push({ r: ruf + ((rub - ruf) * (k + 1)) / (2 * steps), z: 23.2, part: concrete })
      out.push({ r: rub, z: 23.2, part: concrete })
    } else {
      const t = tier(seats, ruf, 13.4, rub, 23.2, steps).slice(1)
      if (!steps) out.push({ r: rub, z: 23.2, part: concrete }, { r: rub, z: 23.2, part: concrete })
      else out.push(...t, { r: rub, z: 23.2, part: concrete })
    }
    out.push(
      { r: rub, z: 15.7, part: concrete }, // the concourse roof behind the upper tier
      // the facade: two broad pale bands of perforated cladding, each over a
      // dark recessed level (glazing and open concourse behind)
      { r: rfac, z: 15.7, part: white },
      { r: rfac, z: 12.4, part: concrete },
      { r: rfac - 1.6, z: 12.4, part: win },
      { r: rfac - 1.6, z: 9.2, part: concrete },
      { r: rfac, z: 9.2, part: white },
      { r: rfac, z: 5.6, part: concrete },
      { r: rfac - 1.6, z: 5.6, part: win },
      { r: rfac - 1.6, z: 0, part: null },
    )
    return out
  })
  if (new Set(secs.map((s) => s.length)).size > 1) throw new Error('sections differ in length')
  loftSections(frames, secs, true)

  // the glazed level under the ring roof (a continuous band)
  for (let i = 0; i < phis.length; i++) {
    const j = (i + 1) % phis.length
    const f0 = phis[i], f1 = phis[j]
    const r0 = r(R_FAC, f0), r1 = r(R_FAC, f1)
    const A: V3 = [r0 * Math.cos(f0), r0 * Math.sin(f0), 0], B: V3 = [r1 * Math.cos(f1), r1 * Math.sin(f1), 0]
    const L = Math.hypot(B[0] - A[0], B[1] - A[1])
    if (L < 0.5) continue
    const n: V3 = [(B[1] - A[1]) / L, (A[0] - B[0]) / L, 0]
    const P = (t: number, z: number): V3 => [A[0] + (B[0] - A[0]) * t + n[0] * 0.06, A[1] + (B[1] - A[1]) * t + n[1] * 0.06, z]
    void P
    const t0 = 0, t1 = 1
    // the upper level under the ring roof: the back of the upper tier, glazed
    const q0 = r(R_UPB, f0), q1 = r(R_UPB, f1)
    const C: V3 = [q0 * Math.cos(f0), q0 * Math.sin(f0), 0], D: V3 = [q1 * Math.cos(f1), q1 * Math.sin(f1), 0]
    const M = Math.hypot(D[0] - C[0], D[1] - C[1])
    if (M > 0.5) {
      const m: V3 = [(D[1] - C[1]) / M, (C[0] - D[0]) / M, 0]
      const Q = (t: number, z: number): V3 => [C[0] + (D[0] - C[0]) * t + m[0] * 0.06, C[1] + (D[1] - C[1]) * t + m[1] * 0.06, z]
      face(win, [Q(t0, 17), Q(t1, 17), Q(t1, 22), Q(t0, 22)], m)
    }
  }

  // --- The four corner blocks clad in white perforated panels (p75, p68),
  // and the external stair towers with glass balustrades on the long sides.
  for (const [cx, cy] of [[47, 51.1], [-46.2, 51.1], [47, -42.6], [-46.2, -42.6]] as XY[]) {
    const l = Math.hypot(cx, cy), d: V3 = [cx / l, cy / l, 0], sd: V3 = [-d[1], d[0], 0]
    obox(white, [cx, cy, 0], d, sd, -6, 3.2, -7, 7, 0, 22)
    // the lace panels' dark joints: one slot down each block's face
    face(win, [vadd([cx, cy, 2], vadd(vmul(d, 3.26), vmul(sd, -0.8))), vadd([cx, cy, 2], vadd(vmul(d, 3.26), vmul(sd, 0.8))), vadd([cx, cy, 20], vadd(vmul(d, 3.26), vmul(sd, 0.8))), vadd([cx, cy, 20], vadd(vmul(d, 3.26), vmul(sd, -0.8)))], d)
  }
  for (const [x0, y0, sx] of [[53.4, -20, 1], [53.4, 22, 1], [-52.6, -20, -1], [-52.6, 22, -1]] as [number, number, number][]) {
    const X = (u: number) => x0 + sx * u // u outwards from the facade
    const W = 7, Dp = 5
    for (const u of [0.4, Dp]) for (const y of [y0 - W / 2, y0 + W / 2]) bar(white, [X(u), y, 0], [X(u), y, 15.7], 0.6, 0.6, [1, 0, 0], true)
    for (const z of [5.2, 10.4, 15.4]) {
      obox(white, [0, 0, 0], [1, 0, 0], [0, 1, 0], Math.min(X(0.2), X(Dp)), Math.max(X(0.2), X(Dp)), y0 - W / 2, y0 + W / 2, z - 0.45, z, true)
      // glass balustrade on the landing's outer edge
      face(win, [[X(Dp + 0.05), y0 - W / 2, z], [X(Dp + 0.05), y0 + W / 2, z], [X(Dp + 0.05), y0 + W / 2, z + 1.1], [X(Dp + 0.05), y0 - W / 2, z + 1.1]], [sx, 0, 0])
    }
    // the flights, switching back between the landings
    for (const [za, zb, flip] of [[0, 5.2, 1], [5.2, 10.4, -1], [10.4, 15.4, 1]] as [number, number, number][])
      bar(white, [X(Dp * 0.55), y0 - (flip * W) / 2 + flip * 0.6, za + 0.2], [X(Dp * 0.55), y0 + (flip * W) / 2 - flip * 0.6, zb - 0.3], 1.6, 0.4, [0, 0, 1], true)
  }

  // --- The fixed ring roof: a white slab cantilevered over the facades.
  {
    const rsecs = phis.map((f) => {
      const ri = r(R_ROOFIN, f), ro = rayHit(OUTLINE, f)
      return [
        { r: ri, z: 24.2, part: white },
        { r: ri, z: 25.9, part: white },
        { r: ro, z: 25.9, part: white },
        { r: ro, z: 22.6, part: concrete }, // a deep fascia (p75)
        { r: ri, z: 24.2, part: null },
      ] as Sec[]
    })
    loftSections(frames, rsecs, true)
    // posts under its outer edge at the corners of the long sides (detail only)
    if (detail) for (const [x, y] of [[-50, -46], [51, -46], [-50, 55], [51, 55]] as XY[]) obox(concrete, [x, y, 0], [1, 0, 0], [0, 1, 0], -0.6, 0.6, -0.6, 0.6, 15.7, 23.9)
  }

  // --- The retractable roof, open: eleven wings stacked over the north end.
  {
    const X0 = -53.7, X1 = 54.5, Y0 = 27.3, Y1 = 59.4
    const crests = [27.3, 30.0, 33.0, 35.6, 38.1, 41.0, 43.4, 46.2, 49.0, 51.7, 54.2, 56.9] // OSM wing strips' south edges
    // the ribbed top: troughs at 29.1, crests (1.7 m wide) at 31.45
    const prof: [number, number][] = [[Y0, 29.1]]
    for (let k = 0; k < 11; k++) {
      const y = crests[k]
      if (k > 0) prof.push([y, 29.1])
      prof.push([y + 0.4, 31.45], [y + 2.1, 31.45], [Math.min(crests[k + 1] ?? Y1, y + 2.6), 29.1])
    }
    prof.push([Y1, 29.1])
    const segs = detail ? 6 : 1
    const xs = Array.from({ length: segs + 1 }, (_, k) => X0 + ((X1 - X0) * k) / segs)
    for (let k = 0; k < prof.length - 1; k++) {
      const [ya, za] = prof[k], [yb, zb] = prof[k + 1]
      if (yb - ya < 1e-3) continue
      for (let s = 0; s < segs; s++) {
        const xa = xs[s], xb = xs[s + 1]
        face(white, [[xa, ya, za], [xb, ya, za], [xb, yb, zb], [xa, yb, zb]], [0, -(zb - za), yb - ya])
      }
    }
    // the band's underside and its ends
    face(white, [[X0, Y0, 25.9], [X0, Y1, 25.9], [X1, Y1, 25.9], [X1, Y0, 25.9]], [0, 0, -1])
    face(white, [[X0, Y0, 25.9], [X1, Y0, 25.9], [X1, Y0, 29.1], [X0, Y0, 29.1]], [0, -1, 0])
    face(white, [[X0, Y1, 25.9], [X0, Y1, 29.1], [X1, Y1, 29.1], [X1, Y1, 25.9]], [0, 1, 0])
    for (const [x, sx] of [[X0, -1], [X1, 1]] as [number, number][]) {
      const pts: V3[] = [[x, Y0, 25.9], [x, Y1, 25.9], ...[...prof].reverse().map(([y, z]) => [x, y, z] as V3)]
      // fan from the band's bottom edge: the profile is above a straight base, so strips are convex
      for (let k = 0; k < prof.length - 1; k++) {
        const [ya, za] = prof[k], [yb, zb] = prof[k + 1]
        if (yb - ya < 1e-3) continue
        face(white, [[x, ya, 25.9], [x, yb, 25.9], [x, yb, zb], [x, ya, za]], [sx, 0, 0])
      }
      void pts
    }
    // the two long girders the wings ride on, over the long sides, and their ribs (detail)
    for (const x of [-50.5, 51.3]) {
      bar(steel, [x, -49, 25.3], [x, 59.4, 25.3], detail ? 2.2 : 2.6, 2.4, [0, 0, 1], true)
    }
    if (detail) for (let k = 0; k < 11; k++) {
      const y = crests[k] + 1.25
      for (const x of [-30, -10, 10, 30]) bar(steel, [x - 9, y, 25.6], [x + 9, y, 25.6], 0.5, 0.6, [0, 0, 1], false)
      bar(steel, [X0 + 2, y, 25.5], [X1 - 2, y, 25.5], 0.9, 0.7, [0, 0, 1], false)
    }
  }

  const lit = (_p: V3, n: V3) => (n[2] < -0.3 ? 0.7 : 0.25)
  return [
    { part: concrete, material: { ...finish('rg-concrete', 0xd9d9d3), floodlight: lit } },
    { part: seats, material: finish('rg-seats', 0xa3a8a4) },
    { part: green, material: finish('rg-green', 0x3d7258) },
    { part: white, material: { ...finish('rg-white', 0xf1f1ec), floodlight: lit } },
    { part: win, material: PALETTE.window },
    { part: steel, material: finish('rg-steel', 0xbfc4c6) },
  ]
}

if (import.meta.main)
  await writeLods('Court Philippe-Chatrier', { bearing: BEARING, elevation: 0, height: 31.45 }, [
    { file: 'paris-court-philippe-chatrier.glb', parts: build(false), maxTris: 6500, maxBytes: 250_000 },
    { file: 'paris-court-philippe-chatrier.detail.glb', parts: build(true), maxTris: 40_000, maxBytes: 1536 * 1024 },
  ])
