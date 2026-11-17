/**
 * Het Scheepvaartmuseum ('s Lands Zeemagazijn, the Admiralty storehouse;
 * Daniël Stalpaert, 1656; courtyard roof by Laurent Ney, 2011),
 * Kattenburgerplein, Amsterdam: original procedural geometry, CC0-1.0.
 * bun generators/amsterdam-scheepvaartmuseum.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = area centroid of the OSM building multipolygon
 * relation/3604837 (outer ring and courtyard), 52.371716, 4.914800. Its
 * walls run at 151.6 / 61.9 degrees, so the catalog bearing is 331.6: +y
 * is the north-north-west front on the Oosterdok, where the replica ship
 * Amsterdam is moored.
 *
 * Identity, in order: a big square sandstone block round a square
 * courtyard, four storeys under a steep dark slate roof that runs round
 * the courtyard as a ring; on every face a central projecting bay crowned
 * by a sculpted pediment cutting into the roof; tall white chimneys and a
 * small lantern on the roof, dormers in the slope; and inside the ring the
 * 2011 glass roof over the courtyard with its pattern of lines, a compass
 * rose of radial bars and crossing rhumb lines.
 *
 * Evidence:
 *  - plan: OSM relation/3604837 (tagged 17 m, start 1656), read in the
 *    turned frame: outer walls x -32.2..32.2, y -29.9..27.6, central
 *    projections of 2.5-3.2 m on all four faces (north x -7.7..7.5, south
 *    x -9.0..8.2, west and east y -7.6..5.0); courtyard x -14.6..14.3,
 *    y -19.3..9.7 (it sits north of centre, as OSM draws it). The museum
 *    site way/1287492683 (the outline the lead named) also holds the quay,
 *    the ship and the royal barge; the building itself is the relation,
 *    and the glass courtyard roof is way/269078550 (building=roof, glass).
 *  - heights: walls to the cornice 16.6 m (OSM's 17 m, and Fernando's and
 *    Nataliia Ieremieieva's level photos: about 210 px of wall on a 64 m
 *    face of 810 px); the roof about half the wall height again in
 *    Fernando's corner view, so the ridge is drawn at 24.6 m (a 45-50
 *    degree slope over 17-18 m deep wings); pediments rise about 3.6 m
 *    above the cornice.
 *  - the glass roof: a shallow dome at the inner eaves, its bars from
 *    Steven Lek's photo of it from below (radial bars from a central hub,
 *    a ring, and straight lines crossing to form a star). Drawn as glass
 *    with bold dark bars on top, sixteen radial and sixteen crossing.
 *  - colours from the daylight photos: pale grey-beige sandstone, white
 *    trim and chimneys, dark slate roof (pulled to 0x5c6066), the
 *    courtyard roof `glass` with charcoal bars.
 *  - elevation 0: the block stands on the quay at the water's edge (about
 *    0-1 m NAP). No lidar.
 *
 * Photos (Wikimedia Commons, all evidence):
 *  - Nederlands_Scheepvaartmuseum_2024.jpg (Fernando, CC BY-SA 4.0): from
 *    the west across the water, the corner, roof and pediments.
 *  - Het_Scheepvaartmuseum,_Amsterdam.jpg (Nataliia Ieremieieva,
 *    CC BY-SA 4.0): the north front behind the ship.
 *  - Roof_Scheepvaartmuseum_Amsterdam_2019.jpg (Steven Lek, CC BY-SA 4.0):
 *    the courtyard roof's bars from below.
 *  - Scheepvaartmuseum_2022.jpg (Ainali, CC BY-SA 4.0) and
 *    National_Maritime_Museum_Amsterdam.JPG (BristolIcarus, CC BY-SA 4.0):
 *    the facades.
 * No commercial imagery. No look-only sources.
 *
 * Left out: the pediment sculpture and arms, the armillary spheres and
 * vanes on the chimneys, sash bars, the quay steps and railings.
 *
 * Doubts: no open aerial was found, so the roof ring's shape (straight
 * slopes to one ridge round the ring), the dormers' count and the glass
 * roof's rise are read from oblique photos and drawn plainly. The lantern's
 * place (over the north-east of the ring) is from Ieremieieva's photo only.
 * The south wing is drawn as shallow as OSM's courtyard makes it.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cap, inset, lathe, rect, save, walls, type XY } from './chi-aon-center'
import { along, archOn, face, rectOn } from './phl-independence-hall'
import { bprism, ccw } from './amsterdam-adam-toren'

const OUTER: XY[] = [[32.2, -29.9], [8.2, -29.8], [8.2, -32.6], [-9.0, -32.6], [-9.0, -29.7], [-32.2, -29.7], [-32.2, -7.4], [-35.0, -7.4], [-35.0, 5.1], [-32.2, 5.1], [-32.2, 27.6], [-7.7, 27.6], [-7.7, 30.8], [7.5, 30.8], [7.5, 27.5], [32.2, 27.5], [32.2, 4.8], [34.8, 4.8], [34.8, -7.8], [32.2, -7.8]]
const X0 = -32.2, X1 = 32.2, Y0 = -29.8, Y1 = 27.55 // the main block
const CI = { x0: -14.6, x1: 14.3, y0: -19.3, y1: 9.7 } // courtyard
const CORN = 16.6, RIDGE = 24.6

function build() {
  const stone = new Part(), trim = new Part(), roof = new Part(), win = new Part(), glass = new Part(), bars = new Part()
  const outer = ccw(OUTER)

  // --- Walls, a cornice band, the courtyard's walls.
  walls(stone, outer, 0, CORN - 0.7)
  {
    const o = inset(outer, -0.35), i = inset(outer, 0.0)
    walls(trim, i, CORN - 0.7, CORN - 0.55, o)
    walls(trim, o, CORN - 0.55, CORN - 0.15)
    walls(trim, o, CORN - 0.15, CORN, i)
  }
  const court = rect(CI.x0, CI.y0, CI.x1, CI.y1)
  walls(stone, [...court].reverse(), 0, CORN)

  // --- The roof ring: outer slopes up from the cornice to one ridge ring,
  // inner slopes down to the courtyard's eaves.
  const O = rect(X0, Y0, X1, Y1), I = court
  const R: XY[] = O.map((p, k) => [(p[0] + I[k][0]) / 2, (p[1] + I[k][1]) / 2] as XY)
  for (let k = 0; k < 4; k++) {
    const l = (k + 1) % 4
    roof.quad([O[k][0], O[k][1], CORN], [O[l][0], O[l][1], CORN], [R[l][0], R[l][1], RIDGE], [R[k][0], R[k][1], RIDGE])
    roof.quad([R[k][0], R[k][1], RIDGE], [R[l][0], R[l][1], RIDGE], [I[l][0], I[l][1], CORN], [I[k][0], I[k][1], CORN])
  }
  // Fill the gap between the outer wall line and the projections' tops.
  // (The projections get their own gabled roofs below.)

  // --- Central projections: each to the cornice, a pediment, and a gabled
  // roof running back into the main roof.
  const projections: { a: XY; b: XY; depth: number }[] = [
    { a: [-9.0, -29.8], b: [8.2, -29.8], depth: 2.8 }, // south
    { a: [32.2, -7.8], b: [32.2, 4.8], depth: 2.6 }, // east
    { a: [7.5, 27.55], b: [-7.7, 27.55], depth: 3.2 }, // north
    { a: [-32.2, 5.1], b: [-32.2, -7.4], depth: 2.8 }, // west
  ]
  for (const { a, b, depth } of projections) {
    const { P, L, n } = along(a, b)
    const hw = L / 2, apex = CORN + 3.6
    // Gabled roof from the pediment back 9 m into the main roof.
    const back = -9
    const pts = (s: number, o: number, z: number) => P(s, z, o)
    roof.quad(pts(-0.2, depth + 0.15, CORN), pts(-0.2, back, CORN), pts(hw, back, apex + 0.2), pts(hw, depth + 0.15, apex + 0.2))
    roof.quad(pts(hw, depth + 0.15, apex + 0.2), pts(hw, back, apex + 0.2), pts(L + 0.2, back, CORN), pts(L + 0.2, depth + 0.15, CORN))
    // The pediment: a trim triangle on the front, framed.
    face(trim, [pts(0, depth + 0.05, CORN), pts(L, depth + 0.05, CORN), pts(hw, depth + 0.05, apex)], [n[0], n[1], 0])
    face(stone, [pts(1.2, depth + 0.1, CORN + 0.4), pts(L - 1.2, depth + 0.1, CORN + 0.4), pts(hw, depth + 0.1, apex - 0.7)], [n[0], n[1], 0])
    // The projection's corners carry trim pilasters.
    for (const s of [0, L - 1.0]) {
      const c0 = pts(s, depth, 0), c1 = pts(s + 1.0, depth, 0)
      face(trim, [[c0[0] + n[0] * 0.08, c0[1] + n[1] * 0.08, 0.8], [c1[0] + n[0] * 0.08, c1[1] + n[1] * 0.08, 0.8], [c1[0] + n[0] * 0.08, c1[1] + n[1] * 0.08, CORN - 0.7], [c0[0] + n[0] * 0.08, c0[1] + n[1] * 0.08, CORN - 0.7]], [n[0], n[1], 0])
    }
  }

  // --- Windows: arched on the ground floor, then three rows of tall sashes;
  // the projections' upper windows are arched too.
  const sides = outer.map((a, k) => [a, outer[(k + 1) % outer.length]] as [XY, XY])
  for (const [a, b] of sides) {
    const { L } = along(a, b)
    if (L < 3) continue
    const proj = L < 20 && L > 11
    const pitch = 2.75, n = Math.max(1, Math.floor((L - 1.6) / pitch)), off = (L - n * pitch) / 2
    for (let q = 0; q < n; q++) {
      const c = off + pitch * (q + 0.5)
      if (proj && (c < 1.3 || c > L - 1.3)) continue
      archOn(win, a, b, c, 0.62, 1.2, 4.1, 0.05, 6)
      if (proj) {
        archOn(win, a, b, c, 0.55, 6.0, 8.0, 0.05, 6)
        archOn(win, a, b, c, 0.55, 9.9, 11.9, 0.05, 6)
        rectOn(win, a, b, c, 0.55, 13.2, 15.2, 0.05)
      } else {
        rectOn(win, a, b, c, 0.55, 6.0, 8.6, 0.05)
        rectOn(win, a, b, c, 0.55, 9.9, 12.4, 0.05)
        rectOn(win, a, b, c, 0.55, 13.4, 15.3, 0.05)
      }
    }
  }

  // --- Dormers in the outer slopes, five a side.
  for (let k = 0; k < 4; k++) {
    const l = (k + 1) % 4
    const a = O[k], b = O[l], { P, L, n } = along(a, b)
    const depth = Math.hypot(R[k][0] - O[k][0], R[k][1] - O[k][1]) / Math.SQRT2
    const slope = (RIDGE - CORN) / depth
    for (const f of [0.12, 0.27, 0.73, 0.88]) {
      const s = L * f, d0 = 1.4, d1 = 4.0, w = 0.9
      const zf = CORN + d0 * slope, zt = zf + 2.0
      // front face, sides and a small pitched top
      const p = (ss: number, o: number, z: number) => P(ss, z, -o)
      face(trim, [p(s - w, d0, zf - 0.6), p(s + w, d0, zf - 0.6), p(s + w, d0, zt), p(s, d0, zt + 0.7), p(s - w, d0, zt)], [n[0], n[1], 0])
      rectOn(win, p(s - w, d0, 0).slice(0, 2) as XY, p(s + w, d0, 0).slice(0, 2) as XY, w, 0.5, zf - 0.2, zt - 0.3, 0.04)
      for (const sg of [-1, 1]) face(trim, [p(s + sg * w, d0, zf - 0.6), p(s + sg * w, d1, CORN + d1 * slope - 0.2), p(s + sg * w, d1, zt), p(s + sg * w, d0, zt)], [-n[1] * sg * 0 + sg * (b[0] - a[0]) / L, sg * (b[1] - a[1]) / L, 0])
      face(roof, [p(s - w - 0.15, d0 - 0.15, zt - 0.05), p(s, d0 - 0.15, zt + 0.75), p(s, d1, zt + 0.75), p(s - w - 0.15, d1, zt - 0.05)], [n[0] * 0 - (b[0] - a[0]) / L, -(b[1] - a[1]) / L, 1])
      face(roof, [p(s, d0 - 0.15, zt + 0.75), p(s + w + 0.15, d0 - 0.15, zt - 0.05), p(s + w + 0.15, d1, zt - 0.05), p(s, d1, zt + 0.75)], [(b[0] - a[0]) / L, (b[1] - a[1]) / L, 1])
    }
  }

  // --- Chimneys on the ridge, and the lantern.
  const chim = (x: number, y: number) => bprism(trim, trim, rect(x - 0.7, y - 0.7, x + 0.7, y + 0.7), RIDGE - 3, RIDGE + 2.6, 0.15)
  for (const x of [-15, 15]) { chim(x, R[0][1]); chim(x, R[2][1]) }
  for (const y of [-12, 6]) { chim(R[0][0], y); chim(R[1][0], y) }
  {
    const lx = R[2][0] - 3.5, ly = R[2][1] // north-east of the ring
    bprism(trim, trim, rect(lx - 1.1, ly - 1.1, lx + 1.1, ly + 1.1), RIDGE - 2, RIDGE + 1.6, 0.12)
    lathe(roof, lx, ly, [[1.25, RIDGE + 1.6], [1.1, RIDGE + 2.2], [0.6, RIDGE + 2.8], [0.12, RIDGE + 3.2], [0.12, RIDGE + 4.4], [0, RIDGE + 4.4]], 8)
  }

  // --- The courtyard's glass roof: a shallow dome with a compass rose of
  // dark bars on it.
  const W = (CI.x1 - CI.x0) / 2, Hh = (CI.y1 - CI.y0) / 2, cx = (CI.x0 + CI.x1) / 2, cy = (CI.y0 + CI.y1) / 2
  const zg = (x: number, y: number) => {
    const u = (x - cx) / W, v = (y - cy) / Hh
    return CORN + 0.05 + 2.6 * (1 - u * u) * (1 - v * v)
  }
  const N = 8
  for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) {
    const xa = CI.x0 + (i / N) * 2 * W, xb = CI.x0 + ((i + 1) / N) * 2 * W, ya = CI.y0 + (j / N) * 2 * Hh, yb = CI.y0 + ((j + 1) / N) * 2 * Hh
    const q = (x: number, y: number): V3 => [x, y, zg(x, y)]
    glass.quad(q(xa, ya), q(xb, ya), q(xb, yb), q(xa, yb))
  }
  const line = (p0: XY, p1: XY, w: number, segs = 8) => {
    for (let k = 0; k < segs; k++) {
      const t0 = k / segs, t1 = (k + 1) / segs
      const A: XY = [p0[0] + (p1[0] - p0[0]) * t0, p0[1] + (p1[1] - p0[1]) * t0], B: XY = [p0[0] + (p1[0] - p0[0]) * t1, p0[1] + (p1[1] - p0[1]) * t1]
      const dx = B[0] - A[0], dy = B[1] - A[1], l = Math.hypot(dx, dy) || 1, ox = (-dy / l) * w / 2, oy = (dx / l) * w / 2
      const z = (x: number, y: number) => zg(x, y) + 0.12
      bars.quad([A[0] + ox, A[1] + oy, z(A[0] + ox, A[1] + oy)], [A[0] - ox, A[1] - oy, z(A[0] - ox, A[1] - oy)], [B[0] - ox, B[1] - oy, z(B[0] - ox, B[1] - oy)], [B[0] + ox, B[1] + oy, z(B[0] + ox, B[1] + oy)])
    }
  }
  // Points round the courtyard's edge, 16 of them, by angle from the centre.
  const edge = (ang: number): XY => {
    const dx = Math.cos(ang), dy = Math.sin(ang), t = Math.min(W / Math.abs(dx || 1e-9), Hh / Math.abs(dy || 1e-9)) * 0.98
    return [cx + dx * t, cy + dy * t]
  }
  const K = 16
  for (let k = 0; k < K; k++) {
    const ang = (k / K) * 2 * Math.PI
    line([cx, cy], edge(ang), 0.4, 6)
    line(edge(ang), edge(ang + (5 / K) * 2 * Math.PI), 0.3, 10)
  }
  for (let k = 0; k < 24; k++) {
    const a0 = (k / 24) * 2 * Math.PI, a1 = ((k + 1) / 24) * 2 * Math.PI, r = 6.5
    line([cx + r * Math.cos(a0), cy + r * Math.sin(a0)], [cx + r * Math.cos(a1), cy + r * Math.sin(a1)], 0.35, 1)
  }
  lathe(bars, cx, cy, [[0.9, zg(cx, cy) + 0.1], [0.7, zg(cx, cy) + 0.6], [0, zg(cx, cy) + 0.7]], 8)
  // The glass meets the inner roof's eaves.
  cap(glass, [...court], CORN - 0.01, false)

  return [
    { part: stone, material: finish('zeemagazijn-sandstone', 0xe2d9c9) },
    { part: trim, material: { ...PALETTE.trim } },
    { part: roof, material: finish('zeemagazijn-slate', 0x5c6066) },
    { part: win, material: { ...PALETTE.window } },
    { part: glass, material: { ...PALETTE.glass } },
    { part: bars, material: finish('zeemagazijn-bars', 0x4a4f57) },
  ]
}

if (import.meta.main) await save('amsterdam-scheepvaartmuseum', 'Het Scheepvaartmuseum', [52.371716, 4.9148], 331.6, build(), 6500)
