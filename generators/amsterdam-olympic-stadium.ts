/**
 * Olympisch Stadion (Olympic Stadium; Jan Wils, 1928, restored 1996-2000 to
 * its 1928 form), Stadionplein, Amsterdam-Zuid: original procedural
 * geometry, CC0-1.0.
 * bun generators/amsterdam-olympic-stadium.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = area centroid of the outer ring (way/57855651) of OSM
 * relation/898908 (building=yes, BAG 0363100012076088), 52.343488,
 * 4.854080. Bearing 346.9, the outline's long axis (length-weighted edge
 * direction), so model +y is the long axis, north-north-west; the Marathon
 * Tower stands on the east (+x) side.
 *
 * Identity, in order: the long, low oval of dark red-brown brick with its
 * flat top and regular small windows; the open bowl of terraces inside; the
 * two covered stands on the long sides with their flat steel canopies, the
 * west one higher; the Marathon Tower, a slender brick shaft with a stepped
 * stone capital and the fire bowl on top, at the east gate; the tall lattice
 * floodlight masts with round-topped lamp frames.
 *
 * Evidence
 *  - Plan: OSM relation/898908, outer way/57855651 (x -87.9..84.9,
 *    y -120.3..122.5) and inner way/57855064 (the field and track, x
 *    -64..73, y -102.7..102); roofs way/126786236 (west stand, building=
 *    roof, min_height 19, x -80..-51.6, y +-47.5), way/338974687 and
 *    way/126786371 (east stand, x 64..86.6, y +-47); the Marathontoren
 *    way/98662844 (height 46, x 92.7..98.3, y 7.6..11.7).
 *  - 3D BAG (3dbag.nl, CC BY 4.0, TU Delft/3DGI), pand
 *    NL.IMBAG.Pand.0363100012076088 (AHN5, 2023), sampled on a 6 m grid in
 *    this frame: terraces rising from about 4.5 m at the track to 11-12.4 at
 *    the outer wall; west stand roof 17.8-18.6 over x -84..-60; east stand
 *    roof 13.0-13.2 over x 66..78; a 19.8 m block on the north end (x
 *    -10..18.5, y 118.6..122.5). Ground NAP +0.85. Marathontoren pand
 *    NL.IMBAG.Pand.0363100012250984 (AHN4, 2020): shaft top 43.2-44.9, bowl
 *    45.1-46.0.
 *  - Published (nl.wikipedia "Olympisch Stadion (Amsterdam)",
 *    "Marathontoren"): Jan Wils, 1928; the upper ring added in 1937 was
 *    removed in the 1996-2000 restoration; the Marathon Tower carries the
 *    Olympic fire bowl. Rijksmonument.
 *  - Photos (Wikimedia Commons, all EVIDENCE; only post-restoration views
 *    shape the model, since the 1937-1996 stadium had a second tier):
 *    - Sergé Technau, "Overzicht Olympisch Stadion - Amsterdam - 20409334 -
 *      RCE.jpg", CC BY-SA 4.0 — level overview from the south-south-east:
 *      wall height, windows, a corner mast, the tower.
 *      https://commons.wikimedia.org/wiki/File:Overzicht_Olympisch_Stadion_-_Amsterdam_-_20409334_-_RCE.jpg
 *    - Gerard Dukker, "Exterieur OVERZICHT OOSTZIJDE, MARATHON-TRIBUNE,
 *      MARATHON-TOREN - Amsterdam - 20279165 - RCE.jpg" and "20279166",
 *      CC BY-SA 4.0 — the east stand's canopy and the tower.
 *      https://commons.wikimedia.org/wiki/File:Exterieur_OVERZICHT_OOSTZIJDE,_MARATHON-TRIBUNE,_MARATHON-TOREN_-_Amsterdam_-_20279165_-_RCE.jpg
 *    - Vincent Steenberg, "Olympisch stadion Amsterdam Stadiongrachtzijde.jpg"
 *      and "Olympisch stadion Amsterdam achterzijde.jpg", CC BY-SA 2.5 — the
 *      west stand, its raised back and canopy.
 *      https://commons.wikimedia.org/wiki/File:Olympisch_stadion_Amsterdam_Stadiongrachtzijde.jpg
 *    - Guilhem Vellut, "Olympic stadium @ Amsterdam (17478832033).jpg" and
 *      "Olympic Stadium @ Amsterdam (20017266359).jpg", CC BY 2.0 — a mast,
 *      the brick, the windows. https://commons.wikimedia.org/wiki/File:Olympic_stadium_@_Amsterdam_(17478832033).jpg
 *    - Daniel from Glasgow, "Amsterdam Olympic stadium (33460392888).jpg",
 *      CC BY 2.0. https://commons.wikimedia.org/wiki/File:Amsterdam_Olympic_stadium_(33460392888).jpg
 *    - Ceescamel, "Marathontoren 2018.jpg", CC BY-SA 4.0; Vincent Steenberg,
 *      "Marathontoren01.jpg", CC BY-SA 2.5; Matthias Nonnenmacher,
 *      "Amsterdam Marathonturm am Olympiastadion E 9074 201810.jpg", CC BY-SA
 *      4.0 — the tower's stages, slots, capital and bowl.
 *      https://commons.wikimedia.org/wiki/File:Marathontoren_2018.jpg
 *    - Paul Berendsen, "Olympisch Stadion, Amsterdam, Marathonpoort
 *      (2011).jpg", CC BY-SA 4.0; 24oranges.nl, "Olympic Stadium
 *      Amsterdam.jpg", CC BY-SA 2.0 — gates.
 *  No commercial imagery, no look-only sources. Elevation 0: the field is
 *  at street level (the map's pitch); terrain flat.
 *
 * Estimated: the outer wall's coping at 12.4 m (3D BAG outer terrace edge)
 * and the west stand's raised back at 17.4 m; the window row (one small
 * window per 5 m at 4.6-6.6 m over a concrete lintel line, Technau's and
 * Vellut's views); the Marathon Tower's stages
 * from Ceescamel's and Steenberg's views scaled to its 3D BAG height:
 * plinth 6.5 m, shaft tapering from 5.2 x 4.0 to 4.4 x 3.4 m at 38 m, the
 * stepped capital 38-40.6, neck to 43.2, bowl to 46. The floodlight masts
 * (not in OSM) are placed at the four corners where the curves begin, 36 m
 * tall to the head (46 m overall), flat two-legged ladders with a round-
 * topped lamp frame, from Technau's and Vellut's views; their exact
 * positions are a doubt (no open aerial of today's stadium was found). Left out: the flagpoles on the wall, gates, signs, the scoreboard's
 * face, the low buildings round the stadium.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cap, inset, rect, save, walls, type XY } from './chi-aon-center'
import { along, rectOn } from './phl-independence-hall'
import { swalls, tube } from './amsterdam-johan-cruijff-arena'
import { block } from './chi-aon-center'

const OUTER: XY[] = [[68.6, -78.6], [63.1, -87.2], [56.1, -95.6], [49.0, -104.7], [42.1, -109.5], [36.3, -113.0], [26.1, -116.8], [20.4, -118.4], [12.8, -119.6], [5.3, -120.2], [0.7, -120.3], [-8.0, -119.7], [-14.0, -118.8], [-23.8, -116.0], [-30.8, -113.4], [-38.4, -108.6], [-45.3, -103.5], [-51.2, -98.0], [-57.2, -88.1], [-62.5, -80.0], [-67.4, -70.2], [-70.4, -61.9], [-72.1, -55.4], [-86.7, -54.0], [-87.5, -27.6], [-86.9, 28.7], [-85.9, 54.0], [-71.7, 52.8], [-70.2, 59.6], [-67.0, 68.7], [-62.6, 77.8], [-57.9, 85.4], [-53.2, 91.5], [-47.9, 97.0], [-43.9, 103.3], [-37.9, 107.6], [-30.1, 112.1], [-21.4, 115.9], [-13.9, 118.1], [-9.7, 118.9], [0, 119.4], [18.1, 118.6], [25.9, 116.6], [29.9, 115.7], [40.9, 110.0], [46.2, 106.6], [52.3, 101.8], [57.2, 97.3], [62.4, 88.4], [67.4, 81.2], [70.2, 76.2], [73.4, 69.3], [75.4, 64.2], [77.9, 55.6], [78.5, 52.5], [82.2, 46.1], [81.8, 5.0], [81.6, -7.6], [81.2, -48.7], [80.1, -51.7], [77.0, -56.9], [74.4, -65.6], [72.0, -71.8]]
const INNER: XY[] = [[64.2, 45.5], [61.6, 54.8], [58.8, 62.6], [55.6, 69.7], [51.7, 76.3], [47.0, 82.4], [41.6, 87.8], [35.4, 92.4], [27.9, 96.6], [18.0, 100.1], [8.5, 101.7], [-1.1, 101.8], [-11.5, 100.1], [-21.4, 96.5], [-29.7, 91.8], [-37.1, 85.8], [-43.4, 78.6], [-48.5, 70.5], [-51.6, 63.5], [-54.8, 53.1], [-57.0, 42.5], [-58.3, 31.7], [-58.7, 15.6], [-58.9, -10.0], [-59.1, -27.8], [-58.5, -37.3], [-56.9, -48.0], [-54.6, -57.3], [-51.6, -66.4], [-47.2, -74.9], [-42.2, -81.9], [-35.4, -88.7], [-28.5, -93.8], [-19.1, -98.5], [-9.9, -101.3], [0.6, -102.6], [10.1, -102.2], [20.4, -99.9], [29.3, -96.2], [37.4, -91.1], [43.2, -86.2], [49.5, -79.0], [54.1, -71.7], [58.2, -62.6], [61.8, -52.4], [64.8, -40.7], [66.5, -28.6], [67.0, -10.3], [67.3, 7.9], [67.3, 21.0], [66.6, 32.0], [65.6, 38.8]]

const C: XY = [1.5, 0.5]
/** Where a ray from C at angle t leaves polygon r. */
function rayHit(r: XY[], t: number): XY {
  const d: XY = [Math.cos(t), Math.sin(t)]
  let best = 0
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    const ex = b[0] - a[0], ey = b[1] - a[1]
    const den = d[0] * ey - d[1] * ex
    if (Math.abs(den) < 1e-9) continue
    const s = ((a[0] - C[0]) * ey - (a[1] - C[1]) * ex) / den
    const u = ((a[0] - C[0]) * d[1] - (a[1] - C[1]) * d[0]) / den
    if (s > 0 && u >= 0 && u <= 1) best = Math.max(best, s)
  }
  return [C[0] + d[0] * best, C[1] + d[1] * best]
}
const N = 96
const sample = (r: XY[], pull = 0): XY[] => Array.from({ length: N }, (_, k) => {
  const t = (k / N) * 2 * Math.PI, p = rayHit(r, t), dx = p[0] - C[0], dy = p[1] - C[1], l = Math.hypot(dx, dy)
  return [p[0] - (dx / l) * pull, p[1] - (dy / l) * pull] as XY
})

function build() {
  const brick = new Part(), stone = new Part(), terrace = new Part(), win = new Part(), roof = new Part()

  // --- The brick ring: wall to the coping at 12.4 m, a stone coping on top.
  const Z_WALL = 12.4
  const out = sample(OUTER), top = sample(OUTER, 1.6)
  walls(brick, out, 0, 3.8)
  walls(stone, out, 3.8, 4.2) // the concrete lintel line round the base
  walls(brick, out, 4.2, Z_WALL - 0.5)
  walls(stone, out, Z_WALL - 0.5, Z_WALL)
  for (let k = 0; k < N; k++) {
    const l = (k + 1) % N
    stone.quad([out[k][0], out[k][1], Z_WALL], [out[l][0], out[l][1], Z_WALL], [top[l][0], top[l][1], Z_WALL], [top[k][0], top[k][1], Z_WALL])
  }
  // A row of small windows, and a lower band of entrances, every few metres.
  for (let k = 0; k < N; k++) {
    const a = out[k], b = out[(k + 1) % N], { L } = along(a, b)
    const n = Math.max(1, Math.round(L / 5.2))
    for (let i = 0; i < n; i++) {
      const c = ((i + 0.5) * L) / n
      if (L / n > 2.2) rectOn(win, a, b, c, 0.8, 4.6, 6.6, 0.05)
    }
    if (k % 4 === 0 && L > 4) rectOn(win, a, b, L / 2, 1.3, 0, 2.8, 0.05)
  }

  // --- The open bowl: terraces from the coping down to the track wall.
  const inn = sample(INNER)
  walls(brick, [...inn].reverse(), 0, 4.4)
  swalls(terrace, [...inn].reverse(), 4.4, Z_WALL - 0.2, [...top].reverse())

  // --- West stand: raised brick back, flat canopy with trusses on top.
  {
    const back = rect(-87.2, -48, -72, 48)
    block(brick, roof, back, 0, 17.4, 0.3)
    bays(back, [[13.6, 15.8]])
    const c = rect(-87.6, -48.6, -57.5, 48.6)
    walls(stone, c, 17.8, 18.6)
    cap(roof, c, 18.6)
    cap(stone, c, 17.8, false)
    for (let k = 0; k <= 8; k++) {
      const y = -46 + k * 11.5
      tube(stone, [-86.5, y, 18.6], [-58.5, y, 18.6], 0.4, 4, true)
      tube(stone, [-86.5, y, 21.6], [-58.5, y, 18.7], 0.4, 4, true)
      tube(stone, [-86.5, y, 18.6], [-86.5, y, 21.6], 0.4, 4, true)
      tube(stone, [-63, y, 0], [-63, y, 17.8], 0.35, 4)
    }
  }
  // --- East (Marathon) stand: lower canopy on its brick back.
  {
    const back = rect(73.5, -46, 81.9, 46)
    block(brick, roof, back, 0, 12.6, 0.3)
    const c = rect(64.5, -46.6, 82.3, 46.6)
    walls(stone, c, 12.8, 13.4)
    cap(roof, c, 13.4)
    cap(stone, c, 12.8, false)
    for (let k = 0; k <= 8; k++) {
      const y = -44 + k * 11
      tube(stone, [81.5, y, 13.4], [65.5, y, 13.4], 0.35, 4, true)
      tube(stone, [81.5, y, 15.6], [65.5, y, 13.5], 0.35, 4, true)
      tube(stone, [81.5, y, 13.4], [81.5, y, 15.6], 0.35, 4, true)
    }
  }
  // --- North end block (3D BAG 19.8 m).
  block(brick, roof, rect(-10, 118.4, 18.5, 122.5), 0, 19.8, 0.3)

  // --- Marathon Tower.
  {
    const cx = 95.5, cy = 9.7
    const R = (hx: number, hy: number): XY[] => rect(cx - hx, cy - hy, cx + hx, cy + hy)
    block(brick, stone, R(3.6, 3.0), 0, 6.5, 0.25)
    walls(brick, R(2.6, 2.0), 6.5, 38.0, R(2.2, 1.7))
    // Dark vertical slots up every face.
    const sh = R(2.6, 2.0), st = R(2.2, 1.7)
    for (let k = 0; k < 4; k++) {
      const a0 = sh[k], b0 = sh[(k + 1) % 4], a1 = st[k], b1 = st[(k + 1) % 4]
      const lerp = (p: XY, q: XY, t: number): XY => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t]
      const z0 = 9, z1 = 36.5, f0 = (z0 - 6.5) / 31.5, f1 = (z1 - 6.5) / 31.5
      const A = lerp(a0, a1, f0), B = lerp(b0, b1, f0), A1 = lerp(a0, a1, f1), B1 = lerp(b0, b1, f1)
      const mid = (p: XY, q: XY, t: number): XY => lerp(p, q, t)
      const w = 0.42 / Math.hypot(B[0] - A[0], B[1] - A[1])
      const nx = B[1] - A[1], ny = -(B[0] - A[0]), nl = Math.hypot(nx, ny), o: XY = [(nx / nl) * 0.05, (ny / nl) * 0.05]
      const p0 = mid(A, B, 0.5 - w), p1 = mid(A, B, 0.5 + w)
      const w1 = 0.42 / Math.hypot(B1[0] - A1[0], B1[1] - A1[1])
      const q0 = mid(A1, B1, 0.5 - w1), q1 = mid(A1, B1, 0.5 + w1)
      win.quad([p0[0] + o[0], p0[1] + o[1], z0], [p1[0] + o[0], p1[1] + o[1], z0], [q1[0] + o[0], q1[1] + o[1], z1], [q0[0] + o[0], q0[1] + o[1], z1])
    }
    // Stepped stone capital with corner brackets, neck, fire bowl.
    block(stone, stone, R(2.6, 2.2), 38.0, 39.0, 0.15)
    block(stone, stone, R(3.1, 2.7), 39.0, 40.0, 0.2)
    block(stone, stone, R(2.0, 1.7), 40.0, 40.6, 0.15)
    block(brick, stone, R(1.1, 1.1), 40.6, 43.2, 0.1)
    const bowl: XY[] = [[0.01, 43.2], [0.7, 43.3], [1.6, 43.9], [2.2, 44.8], [2.4, 45.8], [2.1, 46.0], [0.01, 45.7]]
    const ring = (r: number, z: number): V3[] => Array.from({ length: 14 }, (_, k) => [cx + r * Math.cos((k / 14) * 2 * Math.PI), cy + r * Math.sin((k / 14) * 2 * Math.PI), z] as V3)
    for (let i = 0; i < bowl.length - 1; i++) {
      const r0 = ring(bowl[i][0], bowl[i][1]), r1 = ring(bowl[i + 1][0], bowl[i + 1][1])
      swalls(stone, r0.map((p) => [p[0], p[1]] as XY), bowl[i][1], bowl[i + 1][1], r1.map((p) => [p[0], p[1]] as XY))
    }
  }

  // --- Floodlight masts: flat two-legged lattice ladders, wide face to the
  // field, carrying a tall round-topped lamp frame.
  for (const [mx, my] of [[76, -70], [-66, -74], [-63, 78], [74, 74]] as XY[]) {
    const H = 36, dx = C[0] - mx, dy = C[1] - my, l = Math.hypot(dx, dy), ux = -dy / l, uy = dx / l
    const at = (s: number, z: number): V3 => [mx + ux * s, my + uy * s, z]
    const w = (z: number) => 1.9 - 0.6 * (z / H)
    for (const sg of [-1, 1]) tube(stone, at(sg * w(0.12), 0.12), at(sg * w(H), H), 0.4, 4) // starts 0.12 m up so the raked end stays above y = 0
    for (let z = 0; z < H - 1; z += 6) {
      tube(stone, at(-w(z), Math.max(z, 0.15)), at(w(z + 6), z + 6), 0.22, 4)
      tube(stone, at(w(z), Math.max(z, 0.15)), at(-w(z + 6), z + 6), 0.22, 4)
    }
    // The head: two posts, a semicircular top, lamp rows between.
    const hw = 2.6, z0 = H, zs = H + 7.5
    for (const sg of [-1, 1]) tube(stone, at(sg * hw, z0), at(sg * hw, zs), 0.4, 4)
    tube(stone, at(-hw, z0), at(hw, z0), 0.4, 4)
    for (let k = 0; k < 8; k++) {
      const a0 = Math.PI - (k / 8) * Math.PI, a1 = Math.PI - ((k + 1) / 8) * Math.PI
      tube(stone, at(hw * Math.cos(a0), zs + hw * Math.sin(a0)), at(hw * Math.cos(a1), zs + hw * Math.sin(a1)), 0.4, 4)
    }
    for (const z of [z0 + 1.6, z0 + 3.6, z0 + 5.6, z0 + 7.6]) tube(win, at(-hw + 0.3, z), at(hw - 0.3, z), 0.55, 4, true)
  }

  function bays(r: XY[], rowsZ: [number, number][]) {
    for (let k = 0; k < r.length; k++) {
      const a = r[k], b = r[(k + 1) % r.length], { L } = along(a, b)
      const n = Math.floor(L / 4.5)
      for (let i = 0; i < n; i++) for (const [z0, z1] of rowsZ) rectOn(win, a, b, ((i + 0.5) * L) / n, 1.2, z0, z1, 0.05)
    }
  }
  void inset

  const flood = (p: V3, n: V3) => (Math.hypot(p[0] - 95.5, p[1] - 9.7) < 4 && p[2] > 37 ? 0.9 : 0)
  return [
    { part: brick, material: finish('olympic-brick', 0x8e5a49) },
    { part: stone, material: { ...finish('olympic-stone', 0xe9e4d9), floodlight: flood } },
    { part: terrace, material: finish('olympic-terrace', 0xaba79f) },
    { part: win, material: { ...PALETTE.window } },
    { part: roof, material: { ...PALETTE.roof } },
  ]
}

if (import.meta.main) await save('amsterdam-olympic-stadium', 'Olympisch Stadion', [52.343488, 4.85408], 346.9, build(), 5000)
