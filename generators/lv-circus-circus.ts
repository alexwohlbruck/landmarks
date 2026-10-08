/**
 * Circus Circus Las Vegas with the Adventuredome: the pink-and-white striped
 * big-top tent on the Strip, the three white hotel towers (the 15-storey
 * Casino Tower, the 29-storey Skyrise and the 35-storey West Tower), and the
 * Adventuredome, the raspberry glass shell of a nautilus-like fan of vaults
 * around a central drum. Procedural, CC0-1.0.
 * bun generators/lv-circus-circus.ts
 *
 * Also a small kit for this builder's Las Vegas models: smooth-shaded grids,
 * surfaces of revolution over a sector, and a stadium ("racetrack") ring.
 * Importing this file builds nothing.
 *
 * Map frame: x east, y north, z up, metres. Bearing 0: drawn in OSM's own
 * orientation. The origin is the area centroid of the resort outline,
 * way/135332959.
 *
 * Published (Wikipedia, "Circus Circus Las Vegas", "Adventuredome"): a
 * 15-storey tower (1972) joined by a second 15-storey tower (1975), known
 * together as the Casino Tower; the 29-storey Circus Skyrise (1986); the
 * 35-storey West Tower (1996). The casino's tent roof "reached 90 feet
 * [27 m] in the air" and is painted white and hot pink. The Adventuredome
 * (1993) is 5 acres under 350,000 sq ft of pink-tinted glass on a deck
 * 18 ft (5.5 m) above the ground.
 *
 * Measured, from OSM: the resort outline; the towers (West Tower
 * way/135332955, tagged 30 levels; Skyrise way/135332957, 29 levels; the
 * Casino Tower as way/135332961 and way/135332956, 15 levels); the tent's
 * racetrack plan (way/135448025, tagged retail); the Adventuredome outline
 * (way/135448016) and its central dome (way/135448011, a circle 29 m in
 * radius). USGS NAIP (public domain) gives the dome's plan: a fan of three
 * vaults to the west about one centre, spanning 129-243 degrees (counter-
 * clockwise from east) out to 112 m, split at 152 and 220 degrees; a
 * small vault to the north (107-129 degrees, to 60 m); a lower ring
 * around the east half, 29-44 m out. NAIP also shows the tent: radial
 * pink and white stripes, about 20 pink, round a flat racetrack top.
 *
 * Photos (Wikimedia Commons):
 * - p1 "Las Vegas Circus Circus P4220697.jpg", Alexander Migl, CC BY-SA 4.0,
 *   and p2 "Circus Circus Las Vegas 2017.jpg", Kevin Verbeem, CC BY-SA 2.0:
 *   from the Strip (east), the tent over the cream arcade, the white towers;
 * - p5 "Exterior of Circus Circus Las Vegas 2026-05-15 1.jpg", Yelderberry,
 *   CC BY-SA 4.0: from the north-east, high, the tent's current hot pink
 *   and white stripes, the white towers with pink accents;
 * - p7 "Circus Circus Hotel & Casino LAS 09 2017 4915.jpg", Mariordo,
 *   CC BY-SA 4.0: from the air to the north, the Adventuredome's vaults,
 *   drum and ring, the Skyrise and West Tower;
 * - p10 "Adventuredome at street level.jpg", Jeremy Thompson, CC BY 2.0:
 *   from the south-west, the deck on columns and a vault's end;
 * - p16 "Circus Circus Skyrise Tower.jpg", BenGrantham, CC BY 2.0: the
 *   Skyrise's white face and the pink sign strip on its end.
 *
 * Estimated: tower heights from storeys (West 108 m, Skyrise 92 m, Casino
 * Tower 48 m); the podium at 11 m; the tent from 11 m to its flat top at
 * 25 m with a 2 m sign drum to the published 27 m; the Adventuredome's
 * heights (vault crowns 26-34 m, drum eave 34 m, cap 42 m, lantern 45 m,
 * ring 22 m, north vault 22 m), from p7 and p10 against the deck; window
 * panels in three-floor groups. Left out: the lettering and the clown
 * sign, the porte-cochère canopy, the Manor motel blocks, the garage.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { chamfer, offset, panels, prism, save, type XY } from './lv-venetian'

// ------------------------------------------------------------------ kit

/**
 * A smooth-shaded surface from a grid of points, `g[i][j]`, i along one
 * direction and j along the other; normals averaged from the grid. Faces
 * point along (dP/di × dP/dj); `flip` turns them round.
 */
export function grid(p: Part, g: V3[][], flip = false) {
  const ni = g.length, nj = g[0].length
  const N = (i: number, j: number): V3 => {
    const a = g[Math.min(i + 1, ni - 1)][j], b = g[Math.max(i - 1, 0)][j]
    const c = g[i][Math.min(j + 1, nj - 1)], d = g[i][Math.max(j - 1, 0)]
    const u: V3 = [a[0] - b[0], a[1] - b[1], a[2] - b[2]], v: V3 = [c[0] - d[0], c[1] - d[1], c[2] - d[2]]
    let n: V3 = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
    if (flip) n = [-n[0], -n[1], -n[2]]
    const l = Math.hypot(...n) || 1
    return [n[0] / l, n[1] / l, n[2] / l]
  }
  for (let i = 0; i < ni - 1; i++) {
    for (let j = 0; j < nj - 1; j++) {
      const a = g[i][j], b = g[i + 1][j], c = g[i + 1][j + 1], d = g[i][j + 1]
      const na = N(i, j), nb = N(i + 1, j), nc = N(i + 1, j + 1), nd = N(i, j + 1)
      if (!flip) {
        p.tri(a, b, c, undefined, undefined, undefined, [na, nb, nc])
        p.tri(a, c, d, undefined, undefined, undefined, [na, nc, nd])
      } else {
        p.tri(a, c, b, undefined, undefined, undefined, [na, nc, nb])
        p.tri(a, d, c, undefined, undefined, undefined, [na, nd, nc])
      }
    }
  }
}

const rad = (d: number) => (d * Math.PI) / 180
export const polar = (c: XY, r: number, deg: number): XY => [c[0] + r * Math.cos(rad(deg)), c[1] + r * Math.sin(rad(deg))]

/**
 * A vault over a sector about `c`, between angles a0 < a1 (degrees,
 * counter-clockwise from east) and radii r0 < r1: its height falls from
 * `top` at r0 to `base` at r1 along a quarter ellipse, so it meets the
 * ground steeply and is flat at the crown. The two radial ends get
 * vertical walls in `ends` (where the next vault steps down) and the
 * inner edge a wall down to `base` (hidden in whatever stands at r0).
 */
export function vault(roof: Part, ends: Part | null, c: XY, a0: number, a1: number, r0: number, r1: number,
  base: number, top: number, segA: number, segR = 6, endWalls: [boolean, boolean] = [true, true], lobe = 0) {
  const prof = Array.from({ length: segR + 1 }, (_, k) => {
    const t = k / segR // 0 at the crown, 1 at the rim
    const r = r0 + (r1 - r0) * Math.sin((t * Math.PI) / 2)
    const z = base + (top - base) * Math.cos((t * Math.PI) / 2)
    return [r, z] as [number, number]
  })
  // `lobe` lowers the vault toward its two radial edges, so a fan of
  // vaults reads as a scalloped shell with valleys between the lobes.
  const lift = (a: number) => 1 - lobe * (1 - Math.sin((Math.PI * (a - a0)) / (a1 - a0)))
  const g: V3[][] = []
  for (let i = 0; i <= segA; i++) {
    const a = a0 + ((a1 - a0) * i) / segA
    g.push(prof.map(([r, z]) => [...polar(c, r, a), base + (z - base) * lift(a)] as V3))
  }
  grid(roof, g, true)
  if (!ends) return
  // radial end walls: the profile closed down to the base
  const wall = (a: number, out: boolean) => {
    const pts: V3[] = prof.map(([r, z]) => [...polar(c, r, a), base + (z - base) * lift(a)] as V3)
    const foot: V3[] = prof.map(([r]) => [...polar(c, r, a), base] as V3)
    for (let k = 0; k < pts.length - 1; k++) {
      if (out) ends.quad(foot[k], pts[k], pts[k + 1], foot[k + 1])
      else ends.quad(foot[k], foot[k + 1], pts[k + 1], pts[k])
    }
  }
  if (endWalls[0]) wall(a0, true)
  if (endWalls[1]) wall(a1, false)
}

/**
 * A racetrack ring: centre, unit axis, half the straight, radius; `n`
 * points per semicircle, `m` per straight, counter-clockwise. Two rings
 * built with the same n and m correspond point for point, so a loft
 * between them has radial seams round the ends and parallel ones along
 * the sides, as a tent's stripes do.
 */
export function racetrack(c: XY, ax: XY, half: number, r: number, n: number, m: number): XY[] {
  const px: XY = [-ax[1], ax[0]]
  const P = (s: number, t: number): XY => [c[0] + ax[0] * s + px[0] * t, c[1] + ax[1] * s + px[1] * t]
  const out: XY[] = []
  for (let end = 0; end < 2; end++) {
    const sgn = end === 0 ? 1 : -1
    for (let k = 0; k < n; k++) {
      const a = -Math.PI / 2 + (Math.PI * k) / n
      out.push(P(sgn * (half + r * Math.cos(a)), sgn * r * Math.sin(a)))
    }
    for (let k = 0; k < m; k++) {
      const s = half - (2 * half * k) / m
      out.push(P(sgn * s, sgn * r))
    }
  }
  return out
}

/** The walls of a counter-clockwise ring between two heights, no caps. */
export function ring(p: Part, r: XY[], z0: number, z1: number) {
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    p.quad([...a, z0], [...b, z0], [...b, z1], [...a, z1])
  }
}

/** A flat cap over a convex ring (collinear points allowed), from its centroid. */
export function fan(p: Part, r: XY[], z: number, up = true) {
  const c: V3 = [r.reduce((s, q) => s + q[0], 0) / r.length, r.reduce((s, q) => s + q[1], 0) / r.length, z]
  for (let i = 0; i < r.length; i++) {
    const a: V3 = [...r[i], z], b: V3 = [...r[(i + 1) % r.length], z]
    if (up) p.tri(c, a, b)
    else p.tri(c, b, a)
  }
}

// ---------------------------------------------------------------- model

if (import.meta.main) {
  const wall = new Part() // white: tower walls, podium, arcade
  const trim = new Part() // the tent's white stripes, parapets, sign drum
  const win = new Part()
  const roof = new Part()
  const pink = new Part() // the tent's hot pink stripes, the sign strips
  const dome = new Part() // the Adventuredome's raspberry glass

  // way/135332959, the resort outline.
  const OUTLINE: XY[] = [
    [203.9, -53.8], [215.6, -60.0], [219.6, -63.3], [227.2, -66.2], [222.4, -75.5], [218.5, -73.5], [212.4, -85.3], [211.8, -93.9],
    [209.4, -99.1], [225.0, -107.3], [211.7, -134.0], [195.9, -125.7], [190.7, -133.0], [185.0, -135.8], [178.4, -136.9], [170.2, -140.2],
    [164.1, -140.9], [-45.5, -36.7], [-57.4, -30.7], [-45.5, -7.4], [-50.2, -9.9], [-56.8, -12.1], [-63.8, -13.4], [-71.7, -13.5],
    [-78.3, -12.4], [-85.4, -10.2], [-87.8, -8.8], [-92.7, -18.2], [-98.4, -29.6], [-102.5, -37.6], [-117.8, -67.1], [-120.2, -71.7],
    [-129.0, -66.9], [-145.8, -57.7], [-154.1, -53.2], [-165.2, -47.1], [-161.9, -40.0], [-170.5, -34.9], [-166.7, -27.9], [-183.8, -19.3],
    [-179.0, -11.3], [-188.4, -5.7], [-180.9, 8.0], [-189.1, 13.0], [-185.2, 21.2], [-193.9, 25.0], [-185.1, 40.9], [-194.2, 45.6],
    [-158.3, 114.4], [-148.6, 109.8], [-141.3, 124.6], [-58.3, 81.0], [-30.9, 66.4], [-28.9, 69.9], [-20.4, 65.8], [-9.6, 86.1],
    [-14.9, 88.8], [9.2, 134.1], [38.3, 118.8], [37.9, 133.4], [48.8, 133.9], [49.7, 107.3], [100.5, 81.9], [91.7, 66.7], [81.4, 50.3],
    [76.6, 40.8], [67.1, 45.6], [68.6, 48.5], [56.9, 54.9], [54.6, 50.5], [58.8, 48.2], [47.8, 27.6], [53.3, 24.7], [48.6, 16.0],
    [162.2, -41.6], [159.9, -46.0], [168.4, -47.0], [178.0, -51.6], [185.2, -59.2], [191.4, -57.0], [195.5, -49.4],
  ]
  // The resort outline runs round the Adventuredome's deck on its west
  // side; the deck itself is way/135448016's outline, filled here so the
  // two read as one podium.
  const DECK: XY[] = [
    [-87.8, -8.8], [-78.3, -12.4], [-67.3, -13.4], [-56.8, -12.1], [-45.5, -7.4], [-38.3, -2.3], [-29.9, 7.8], [-25.2, 18.4],
    [-23.8, 27.0], [-23.5, 33.3], [-26.9, 47.8], [-30.6, 54.8], [-35.8, 61.3], [-41.6, 66.5], [-48.0, 70.3], [-56.3, 73.5],
    [-62.3, 74.7], [-69.1, 75.1], [-76.5, 74.3], [-80.7, 73.2], [-86.1, 92.2], [-99.3, 87.2], [-108.8, 80.9], [-138.6, 117.7],
    [-153.4, 104.6], [-165.3, 89.3], [-173.5, 73.8], [-179.6, 55.1], [-182.2, 34.6], [-180.4, 12.2], [-173.1, -11.6], [-161.7, -31.3],
    [-149.3, -45.5], [-134.1, -57.7], [-117.8, -67.1], [-102.5, -37.6], [-92.7, -18.2],
  ]
  const WEST: XY[] = [[17.3, 37.9], [-0.9, 47.2], [-41.2, -30.5], [-23.0, -39.8]]
  const SKYRISE: XY[] = [
    [91.7, 66.7], [46.7, 89.4], [51.2, 97.9], [39.7, 104.0], [34.8, 94.9], [-0.5, 113.4], [-9.7, 96.1], [32.3, 74.8], [81.4, 50.3],
  ]
  const CASINO_A: XY[] = [[52.9, -29.9], [-2.2, -1.1], [-11.8, -19.3], [51.8, -52.5], [58.9, -39.0], [50.4, -34.6]]
  const CASINO_B: XY[] = [[85.2, -6.0], [51.9, -71.2], [70.3, -80.5], [103.5, -15.2]]

  // ---- podium: the casino floors, white, flat grey roofs.
  const PODIUM = 11
  prism(wall, roof, offset(OUTLINE, -0.3), 0, PODIUM)
  // the Strip front's cream arcade: arched openings on the east-facing walls
  const eastward = (a: XY, b: XY) => {
    const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy)
    const nx = dy / L // outward normal of a ccw ring is (dy, -dx)/L
    return nx > 0.6 && (a[0] + b[0]) / 2 > 150
  }
  panels(win, offset(OUTLINE, -0.3), 1.5, 9.5, { bay: 6, pier: 2.2, out: 0.05, minLen: 8, end: 1.5, keep: eastward, shape: 'arch' })

  // ---- the big top: a racetrack tent, pink and white stripes, on the podium.
  // Fit to way/135448025: axis bearing 29°, 28.7 m radius, 13.8 m
  // half-straight; the flat top from NAIP, about 24 x 46 m.
  const TC: XY = [154.1, -86.7]
  const ax: XY = [Math.sin(rad(29)), Math.cos(rad(29))]
  const NS = 10, MS = 4 // points per semicircle and per straight: 28 stripes
  const outer = racetrack(TC, ax, 13.7, 28.4, NS, MS)
  const inner = racetrack(TC, ax, 11, 12, NS, MS)
  const TENT0 = PODIUM + 0.2, TENT1 = 25
  // the tent's skirt: a short white drum standing just inside the outline
  ring(trim, outer, PODIUM - 0.5, TENT0)
  for (let i = 0; i < outer.length; i++) {
    const j = (i + 1) % outer.length
    const a: V3 = [...outer[i], TENT0], b: V3 = [...outer[j], TENT0]
    const c: V3 = [...inner[j], TENT1], d: V3 = [...inner[i], TENT1]
    ;(i % 2 === 0 ? pink : trim).quad(a, b, c, d)
  }
  // the flat top and the sign drum round it
  ring(trim, inner, TENT1 - 0.01, 27)
  fan(roof, inner, 27)

  // ---- the hotel towers: white, window panels in three-floor groups.
  function tower(poly: XY[], h: number, bay: number) {
    const body = chamfer(poly, 0.5)
    prism(trim, roof, body, PODIUM, h)
    prism(trim, roof, offset(body, 0.35), h - 1.6, h + 0.4) // parapet band
    panels(win, body, PODIUM + 4, h - 4, { bay, pier: 2.6, group: 8.7, gap: 1.6, out: 0.06, minLen: 14, end: 2.5 })
  }
  tower(WEST, 108, 6.2)
  tower(SKYRISE, 92, 6.2)
  tower(CASINO_A, 48, 6.2)
  tower(CASINO_B, 48, 6.2)
  // the pink sign strips on the Skyrise's ends (the vertical CIRCUS signs,
  // drawn as plain plaques) and the Casino Tower's Strip end
  function plaque(a: XY, b: XY, w: number, z0: number, z1: number) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
    const n: XY = [u[1], -u[0]], m: XY = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
    prism(pink, pink, [
      [m[0] - u[0] * w / 2, m[1] - u[1] * w / 2], [m[0] + u[0] * w / 2, m[1] + u[1] * w / 2],
      [m[0] + u[0] * w / 2 + n[0] * 0.5, m[1] + u[1] * w / 2 + n[1] * 0.5], [m[0] - u[0] * w / 2 + n[0] * 0.5, m[1] - u[1] * w / 2 + n[1] * 0.5],
    ], z0, z1)
  }
  plaque([81.4, 50.3], [91.7, 66.7], 4.5, 40, 86) // Skyrise, east end
  plaque([-0.5, 113.4], [-9.7, 96.1], 4.5, 40, 86) // Skyrise, west end
  plaque([51.9, -71.2], [70.3, -80.5], 4, 18, 44) // Casino Tower, south end

  // ---- the Adventuredome, on its deck.
  const DECK_H = 6.5
  prism(wall, roof, offset(DECK, -0.3), 0, DECK_H)
  const C: XY = [-68.0, 31.0]
  const R = 112
  // the west fan: three vaults, the middle one highest, each stepping down
  // to its neighbour with a glazed end wall
  vault(dome, dome, C, 129.6, 152, 27, R - 1, DECK_H, 36, 5, 7, [true, true], 0.12)
  vault(dome, dome, C, 152, 220, 27, R - 1, DECK_H, 40, 12, 7, [true, true], 0.18)
  vault(dome, dome, C, 220, 243, 27, R - 1, DECK_H, 36, 5, 7, [true, true], 0.12)
  // the small north vault and the low ring round the east half
  vault(dome, dome, C, 107, 129.6, 27, 60, DECK_H, 27, 3, 5, [true, false])
  vault(dome, dome, C, -103, 107, 27, 44, DECK_H, 27, 18, 4, [true, true])
  // the central drum, its shallow cap and the lantern
  {
    const seg = 24, r0 = 29, eave = 42
    const ring = (r: number) => Array.from({ length: seg }, (_, i) => polar(C, r, (360 * i) / seg))
    prism(dome, null, ring(r0), DECK_H, eave)
    const prof: [number, number][] = [[r0 + 2.2, eave - 0.6], [r0, eave + 2], [23, eave + 5.2], [15, eave + 7.5], [6.5, eave + 8.4]]
    const g: V3[][] = []
    for (let i = 0; i <= seg; i++) g.push(prof.map(([r, z]) => [...polar(C, r, (360 * i) / seg), z] as V3))
    grid(dome, g)
    const lantern = ring(4.5)
    prism(dome, null, lantern, eave + 7.8, eave + 10.3)
    const capG: V3[][] = []
    for (let i = 0; i <= 12; i++) capG.push([[...polar(C, 4.6, 30 * i), eave + 10.3], [...polar(C, 0.01, 30 * i), eave + 11.3]] as V3[])
    grid(dome, capG)
    // close the eave's underside lip
    prism(dome, null, ring(r0 + 2.2), eave - 1.4, eave - 0.6)
  }

  await save('lv-circus-circus', 'Circus Circus', [
    { part: wall, material: PALETTE.stone },
    { part: trim, material: PALETTE.trim },
    { part: win, material: PALETTE.window },
    { part: roof, material: PALETTE.roof },
    { part: pink, material: finish('big-top-pink', 0xe593b8) },
    { part: dome, material: finish('adventuredome-glass', 0xc77588, 0.4) },
  ], 108, 'Y up, -Z north, +X east, metres; origin at the way/135332959 centroid; bearing 0', 6500)
}
