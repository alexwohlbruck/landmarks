/**
 * The Bullock Texas State History Museum (2001, Spillis Candela / DMJM),
 * 1800 North Congress Avenue, Austin — procedural, CC0-1.0, no textures.
 *   bun generators/atx-bullock-museum.ts
 *
 * Also holds the drum helpers (`drum`, `drumOpening`, `dome`) the other g7
 * Austin generators import.
 *
 * Map frame: x east, y north, z up, metres; bearing 18 (the outline's
 * axes, the Capitol street grid), so +x is the front on Congress Avenue
 * (east-south-east) with the rotunda on it. Anchor = area centroid of OSM
 * way/27397820, -97.739128, 30.280298. z = 0 is the lowest ground under
 * the footprint, the plaza in front of the rotunda; the site climbs about
 * 7.5 m to the back (west) wall (lidar and the map's terrain agree), so the
 * west and the uphill ends of the north and south walls sink into the hill.
 *
 * Identity: the rose granite block with the big rotunda on the front: a
 * tall lower drum with three round-arched entrances, a set-back upper drum
 * with its ring of small windows, and the squat ribbed bronze-brown dome;
 * the wings either side with their curved standing-seam metal eaves and
 * the bas-relief panels high on the front; and the 35 ft bronze Lone Star
 * on the plaza in front of the entrance.
 *
 * Numbers (lidar = USGS 3DEP USGS_LPC_TX_Central_B1_2017_LAS_2019, flown
 * 2017, 0.5 m grid read in this frame; heights above the front plaza, which
 * is 1.0 m over the box's ground_min):
 *  - plan: the OSM outline (matches the lidar edges to about 1 m);
 *  - walls and the lower drum's top 19.2 (lidar 20.2); the raised central
 *    block 24.5 (lidar 25.5), reached by a curved metal eave about 4.5 m
 *    wide (the 20.2 strip inside the walls, and the photos); the south-west
 *    annex 11.2 (lidar 12.2): measured;
 *  - the rotunda: centre (26, 8), the lower drum r 13 (lidar edge at x 39),
 *    the upper drum r 10 to 26.2 (lidar 27.2), the dome to 34.0 (lidar
 *    35.0): measured; the dome's profile estimated from "moore23" and "hs47";
 *  - the arches, windows, relief panels and inscription bands: scaled from
 *    "moore23" against the lidar's 19.2 drum (about 0.104 m a pixel at the
 *    drum): estimated;
 *  - the Lone Star: 35 ft (10.67 m) tall (Bullock Museum, published), on two
 *    granite blocks; its position is OSM node/7641253733 ("Lone Star",
 *    tourism=artwork), 29 m in front of the drum's centre on its axis;
 *  - colours sampled in sun from "moore23" and "hs47" and pulled to the
 *    palette's lightness: granite #c3a8a5 -> #dcc3bd, the dark base
 *    #866f6e -> #b59c97, the dome and eave metal #756462 -> #8a7a6f, the
 *    star #604e42 -> #86634f; the flat roofs the palette's roof grey
 *    (estimated: NAIP was down).
 *
 * Sources (all EVIDENCE):
 *  moore23  "Bullock Museum Capitol Mall Austin Texas 2023.jpg", Larry D.
 *           Moore, CC BY 4.0 (the front from the east-south-east)
 *           https://commons.wikimedia.org/wiki/File:Bullock_Museum_Capitol_Mall_Austin_Texas_2023.jpg
 *  moore    "Texas state history museum.jpg", Larry D. Moore, CC BY 4.0 (the
 *           rotunda and the star from the east-north-east)
 *           https://commons.wikimedia.org/wiki/File:Texas_state_history_museum.jpg
 *  hs47     "The Bullock Texas State History Museum in Austin, Texas
 *           LCCN2014632347", Carol M. Highsmith, public domain (the front,
 *           on the axis, the star face on)
 *           https://commons.wikimedia.org/wiki/File:The_Bullock_Texas_State_History_Museum_in_Austin,_Texas_LCCN2014632347.tif
 *  hs46     "... LCCN2014632346", Carol M. Highsmith, public domain (the
 *           rotunda from the north-east)
 *           https://commons.wikimedia.org/wiki/File:The_Bullock_Texas_State_History_Museum_in_Austin,_Texas_LCCN2014632346.tif
 *  barera19 "Austin August 2019 03 (Bullock Texas State History Museum).jpg",
 *           Michael Barera, CC BY-SA 4.0
 *           https://commons.wikimedia.org/wiki/File:Austin_August_2019_03_(Bullock_Texas_State_History_Museum).jpg
 *  whisper  "BobBullockMuseumAustinTX.JPG", WhisperToMe, public domain
 *           https://commons.wikimedia.org/wiki/File:BobBullockMuseumAustinTX.JPG
 * Also OSM (ODbL) and the lidar above. No look-only sources, no commercial
 * imagery.
 *
 * Replaces the outline way/27397820 only. The "Bob Bullock IMAX" way
 * inside it (way/1020770315) is building=no and isn't drawn by the map.
 *
 * Doubts: no licensed photo shows the north, south or west faces; they get
 * the front's arched ground-floor windows and a grouped upper window panel,
 * started at the local ground (estimated from the lidar's slope), without
 * the relief panels. The 3 m-deep lower strip the lidar shows along part of
 * the south wall (top 13.4) is left at full height. The curved eave is drawn
 * round the whole raised block; the lidar shows it reaching the north wall
 * directly. The star's facets are simplified to one ridge per point.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { TAU, at, box, capPoly, ccw, cornice, offset, prism, save, type XY } from './atl-flatiron-building'
import { opening } from './atx-governors-mansion'

// ── shared helpers ───────────────────────────────────────────────────────

/** A closed drum of radius r round c, n sides, z0 to z1, with its top capped in `top`. */
export function drum(p: Part, c: XY, r: number, z0: number, z1: number, n = 32, top: Part | null = null, phase = 0) {
  const ring: XY[] = Array.from({ length: n }, (_, i) => [c[0] + r * Math.cos(phase + (i / n) * TAU), c[1] + r * Math.sin(phase + (i / n) * TAU)])
  p.loft([at(ring, z0), at(ring, z1)])
  if (top) capPoly(top, ring, z1, true)
}

/**
 * A window or door on a drum (centre c, radius r), centred at angle th
 * (radians from +x), w wide along the wall, from z0 to the springing zs,
 * with a flat or semicircular head, bent round the drum in k strips.
 */
export function drumOpening(p: Part, c: XY, r: number, th: number, w: number, z0: number, zs: number, head: 'flat' | 'round' = 'flat', k = 6, out = 0.05) {
  const R = r + out, h = w / 2
  const top = (u: number) => (head === 'round' ? zs + Math.sqrt(Math.max(0, h * h - u * u)) : zs)
  for (let i = 0; i < k; i++) {
    const u0 = -h + (w * i) / k, u1 = -h + (w * (i + 1)) / k
    const a0 = th + u0 / R, a1 = th + u1 / R
    const P = (a: number, z: number): V3 => [c[0] + R * Math.cos(a), c[1] + R * Math.sin(a), z]
    p.quad(P(a0, z0), P(a1, z0), P(a1, top(u1)), P(a0, top(u0)))
  }
}

/** A dome over a circle (c, r) from z0, rising h, n ribs (flat-shaded facets), m rings. */
export function dome(p: Part, c: XY, r: number, z0: number, h: number, n = 16, m = 5) {
  const rings: V3[][] = []
  for (let j = 0; j <= m; j++) {
    const f = (j / m) * (Math.PI / 2), rr = Math.max(0.02, r * Math.cos(f))
    rings.push(Array.from({ length: n }, (_, i) => [c[0] + rr * Math.cos((i / n) * TAU), c[1] + rr * Math.sin((i / n) * TAU), z0 + h * Math.sin(f)] as V3))
  }
  p.loft(rings)
}

// ── the museum ───────────────────────────────────────────────────────────

if (import.meta.main) {
  const granite = new Part(), base = new Part(), metal = new Part(), roof = new Part(), win = new Part(), star = new Part()

  const WALL = 19.2, RAISED = 24.5, EAVE = 4.5, ANNEX = 11.2
  const C: XY = [26, 8], RL = 13, RU = 10, UTOP = 26.2, DTOP = 34.0
  // the ground along the walls, from the lidar: 0 at the front, rising to about 7.5 at the back
  const ground = (x: number, y: number) => Math.max(0, 0.1 * (30 - x)) + (y < -30 ? 1.1 : 0)

  // the outline (OSM way/27397820 in this frame), the south-west annex cut off
  const M: XY[] = ccw([[-11.16, -37.73], [47.84, -37.17], [47.97, -16.73], [44.1, -16.4], [39.97, -12.93], [36.63, -8.91], [35.09, -6.17], [34.17, -3.07],
    [25.24, 22.78], [25.69, 40.91], [25.71, 47.98], [11.07, 47.84], [-10.7, 47.65], [-10.43, 33.31], [-42.15, 32.94], [-41.89, -23.76], [-30.29, -23.93], [-30.71, -32.9], [-30.75, -37.7]])
  prism(granite, M, 0, WALL - 0.7, null, 0)
  cornice(granite, M, WALL - 0.7, 0.7, 0.35, roof)
  // the south-west annex
  box(granite, -30.85, -11.16, -42.55, -37.6, 0, ANNEX, roof, 0.3)

  // the raised central block: the curved metal eave from the wall top up to its flat roof
  const P: XY[] = ccw([[-11, -37.7], [47.84, -37.17], [47.97, -16.73], [44.1, -16.4], [34.17, -3.07], [25.24, 22.78], [25.69, 47.98], [-10.7, 47.65], [-10.6, 18], [-42.1, 18], [-42.0, -2.5], [-11, -2.5]])
  const eave: V3[][] = []
  for (let k = 0; k <= 4; k++) {
    const f = (k / 4) * (Math.PI / 2)
    eave.push(at(offset(P, -EAVE * (1 - Math.cos(f))), WALL + 0.02 + (RAISED - WALL) * Math.sin(f)))
  }
  metal.loft(eave)
  capPoly(roof, offset(P, -EAVE), RAISED, true)

  // ── the rotunda ──
  drum(granite, C, RL, 0, WALL - 0.6, 32, null)
  drum(base, C, RL + 0.15, 0, 1.8, 32, null)
  cornice(granite, Array.from({ length: 32 }, (_, i) => [C[0] + RL * Math.cos((i / 32) * TAU), C[1] + RL * Math.sin((i / 32) * TAU)] as XY), WALL - 0.6, 0.6, 0.35, roof)
  drum(granite, C, RU, WALL, UTOP - 0.5, 32, null)
  cornice(granite, Array.from({ length: 32 }, (_, i) => [C[0] + RU * Math.cos((i / 32) * TAU), C[1] + RU * Math.sin((i / 32) * TAU)] as XY), UTOP - 0.5, 0.5, 0.3, null)
  dome(metal, C, RU - 0.2, UTOP, DTOP - 0.6 - UTOP, 16, 5)
  // the little lantern ring and cap on the crown
  drum(metal, C, 1.1, DTOP - 0.7, DTOP, 10, metal)
  // three round-arched entrances in front, the windows over them, and the upper drum's ring of windows
  for (const d of [-36, 0, 36]) {
    const th = (d * Math.PI) / 180
    drumOpening(win, C, RL, th, 5.4, 0, 7.2, 'round', 8, 0.2)
    drumOpening(win, C, RL, th, 2.3, 12.4, 15.6, 'flat', 3)
  }
  for (let d = -80; d <= 80; d += 20) drumOpening(win, C, RU, (d * Math.PI) / 180, 1.9, 20.6, 22.4, 'flat', 2)

  // ── the faces: arched windows below, relief panels (front) or a window panel above ──
  const faces: Array<[XY, XY, boolean]> = []
  for (let i = 0; i < M.length; i++) {
    const a = M[i], b = M[(i + 1) % M.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const m: XY = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
    if (L < 6 || Math.hypot(m[0] - C[0], m[1] - C[1]) < RL + 2) continue // short jogs, and the chord hidden in the drum
    const front = a[0] > 24 && b[0] > 24 && Math.abs(b[1] - a[1]) > 15 // the east faces of the wings
    faces.push([a, b, front])
  }
  for (const [a, b, front] of faces) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.round(L / 7.2)), bay = L / n
    if (front) opening(base, a, b, L / 2, L - 0.4, 0, 1.8, 'flat', 0.06) // the dark granite base course
    for (let k = 0; k < n; k++) {
      const s = (k + 0.5) * bay
      const q: XY = [a[0] + ((b[0] - a[0]) * s) / L, a[1] + ((b[1] - a[1]) * s) / L], g = ground(q[0], q[1])
      if (front) {
        opening(win, a, b, s, 3.6, 1.8, 6.6, 'round', 0.2)
        opening(base, a, b, s, Math.min(5.2, bay - 1.6), 11.0, 16.2, 'flat', 0.05) // the bas-relief panel
      } else {
        opening(win, a, b, s, 3.0, g + 1.4, g + 5.6, 'round', 0.05)
        if (g < 4) opening(win, a, b, s, Math.min(3.2, bay - 2.4), 10.6, 16.0, 'flat', 0.05)
      }
    }
  }

  // ── the Lone Star: 10.67 m tall, one point up, its two lower points on granite blocks, its face to the east ──
  {
    const X = 55.4, Y = 7.8, PED = 0.9, R = (10.67 - PED) / 1.809, r = R * 0.382, cz = PED + 0.809 * R, T = 1.1
    const pts: [number, number][] = []
    for (let i = 0; i < 10; i++) {
      const a = Math.PI / 2 + (i * Math.PI) / 5, rr = i % 2 ? r : R
      pts.push([Y + rr * Math.cos(a), cz + rr * Math.sin(a)])
    }
    const F: V3 = [X + T, Y, cz], B: V3 = [X - T, Y, cz]
    for (let i = 0; i < 10; i++) {
      const p0 = pts[i], p1 = pts[(i + 1) % 10]
      const A: V3 = [X, p0[0], p0[1]], Bp: V3 = [X, p1[0], p1[1]]
      star.tri(F, Bp, A)
      star.tri(B, A, Bp)
    }
    for (const i of [4, 6]) box(base, X - 1.0, X + 1.0, pts[i][0] - 0.9, pts[i][0] + 0.9, 0, PED + 0.05, base, 0.15)
  }

  const lit = (p: V3, n: V3) => (Math.hypot(p[0] - C[0], p[1] - C[1]) < RL + 1 && n[0] > 0.2 && p[2] < UTOP ? 0.7 : 0)
  await save('atx-bullock-museum', 'Bullock Texas State History Museum', [
    { part: granite, material: { ...finish('bullock-granite', 0xdcc3bd), floodlight: lit } },
    { part: base, material: finish('bullock-base', 0xb59c97) },
    { part: metal, material: finish('bullock-bronze', 0x8a7a6f) },
    { part: roof, material: PALETTE.roof },
    { part: win, material: PALETTE.window },
    { part: star, material: finish('bullock-star', 0x86634f) },
  ], { bearing: 18, replaces: ['way/27397820'] }, 5000)
}
