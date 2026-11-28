/**
 * The Texas Governor's Mansion (1856, Abner Cook, Greek Revival), 1010
 * Colorado Street, Austin — procedural, CC0-1.0, no textures.
 *   bun generators/atx-governors-mansion.ts
 *
 * Also holds the small facade helpers (`flush`, `opening`, `hipRoof`,
 * `gableRoof`) the other g5 Austin generators import.
 *
 * Map frame: x east, y north, z up, metres; bearing 17.5, the downtown
 * street grid (the outline's long axis), so +x points to the front on
 * Colorado Street (east-south-east) and +y up the block towards 11th
 * Street. Anchor = area centroid of OSM way/363500532, -97.743152,
 * 30.272787. z = 0 is the lowest ground under the footprint, the lawn at
 * the front portico; the ground rises about 1.3 m to the back (lidar and
 * the map's terrain agree), and the back wings run down into it.
 *
 * Identity: the white two-storey house with six giant fluted Ionic columns
 * across the whole east front, the deep entablature they carry, the
 * balcony hung between them at the upper floor, the tall shuttered windows
 * (black-green shutters), and the low hipped tin roof with its white
 * chimneys behind the cornice.
 *
 * Numbers (lidar = USGS 3DEP USGS_LPC_TX_Central_B1_2017_LAS_2019, flown
 * 2017, 0.5 m grid read in this frame; HABS = HABS TX-33-C-4, WPA 1934
 * measured drawings, public domain):
 *  - six columns at 10'9" (3.28 m) centres, the porch 8'5" (2.6 m) deep in
 *    front of the house wall: HABS sheet 2 (second floor plan);
 *  - the house 96'11" (29.5 m) deep from the porch to the back of the 1914
 *    rear part, x 20.4 to -8.9: HABS sheet 2, matching OSM and lidar;
 *  - the front 18.3 m wide: OSM and lidar (HABS gives 56'9" = 17.3 m over
 *    the columns; the lidar edge takes in the cornice);
 *  - the cornice top 12.0 above the porch lawn (lidar 15.3 over a ground of
 *    3.3); the hip's top 13.5 (lidar 16.8); the porch floor 1.3, the
 *    balcony 6.3, the capitals' top 9.9: HABS sheet 3 (front elevation)
 *    scaled to the lidar's 12.0;
 *  - five bays a floor on the front (two windows, the door, two windows),
 *    four shuttered bays on each side of the 1856 block, five unshuttered
 *    on the 1914 rear part: HABS sheet 3 and the photos;
 *  - the west wing (after 1934, not in HABS) x -22.6..-8.9, its top 10.6
 *    (lidar 13.9); the porte-cochère at the west end, a hipped roof on
 *    posts, its top 5.8 (lidar 9.1): OSM parts way/1461481616 and
 *    way/1461481617 and the lidar;
 *  - four chimneys on the 1856 block: count from HABS sheet 3, positions
 *    estimated on the cross walls of HABS sheet 2;
 *  - colours from "moore" and "highsmith" (sampled in sun, pulled to the
 *    palette's lightness): painted brick a warm white #f1eee6, the shutters
 *    a black green pulled to charcoal #4a4f57. The roof colour is not seen in any
 *    photo (NAIP was down): the palette's roof grey, estimated.
 *
 * Sources (all EVIDENCE):
 *  moore     "Texas governors mansion.jpg", Larry D. Moore, CC BY 4.0 (the
 *            front from the east-north-east)
 *            https://commons.wikimedia.org/wiki/File:Texas_governors_mansion.jpg
 *  highsmith "Texas Governors Mansion Highsmith.jpg", Carol M. Highsmith,
 *            public domain (from the north-east: the front and the north side)
 *            https://commons.wikimedia.org/wiki/File:Texas_Governors_Mansion_Highsmith.jpg
 *  habs-se   "EAST (FRONT) ELEVATION FROM SOUTHEAST - Governor's Mansion ...
 *            HABS TEX,226-AUST,3-6", Jack E. Boucher, public domain
 *            https://commons.wikimedia.org/wiki/File:EAST_(FRONT)_ELEVATION_FROM_SOUTHEAST_-_Governor%27s_Mansion,_1010_Colorado_Street,_Austin,_Travis_County,_TX_HABS_TEX,226,-AUST,3-6.tif
 *  habs-w    "WEST ELEVATION - Governor's Mansion ... HABS TEX,226-AUST,3-9",
 *            Jack Boucher, public domain (the rear and the porte-cochère)
 *            https://commons.wikimedia.org/wiki/File:WEST_ELEVATION_-_Governor%27s_Mansion,_1010_Colorado_Street,_Austin,_Travis_County,_TX_HABS_TEX,226,-AUST,3-9.tif
 *  sheet 2/3 HABS TEX,226-AUST,3- sheets 2 and 3 of 11 (plan, front and north
 *            elevations), WPA / HABS, public domain
 *            https://commons.wikimedia.org/wiki/File:Governor%27s_Mansion,_1010_Colorado_Street,_Austin,_Travis_County,_TX_HABS_TEX,226,-AUST,3-_(sheet_3_of_11).png
 * Also OSM (ODbL) and the lidar above. No look-only sources, no commercial
 * imagery.
 *
 * Replaces the outline way/363500532 and its parts way/1461481616 and
 * way/1461481617. The Carriage House (way/379166084) is left to the map.
 *
 * Doubts: the west wing and the porte-cochère have no daylight photo newer
 * than HABS (1970s); their windows are drawn plain. The roof colour and the
 * chimney positions are estimates. The porch and balcony railings are
 * drawn as rails with bold X diagonals; the front steps are a
 * plain flight.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { box, column, prism, save, type XY } from './atl-flatiron-building'

// ── shared helpers ───────────────────────────────────────────────────────

/** A flat quad on the wall a→b (outside to the right), from s0 to s1 along it, z0 to z1, `out` off the wall. */
export function flush(p: Part, a: XY, b: XY, s0: number, s1: number, z0: number, z1: number, out = 0.04) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [t[1], -t[0]]
  const P = (s: number, z: number): V3 => [a[0] + t[0] * s + n[0] * out, a[1] + t[1] * s + n[1] * out, z]
  p.quad(P(s0, z0), P(s1, z0), P(s1, z1), P(s0, z1))
}

/**
 * A window or door of width w centred s along the wall a→b: a rectangle from
 * z0 to zs, then its head — 'flat', a semicircle ('round', real radius w/2)
 * or a pointed arch ('pointed', equilateral) — as one flush shape.
 */
export function opening(p: Part, a: XY, b: XY, s: number, w: number, z0: number, zs: number, head: 'flat' | 'round' | 'pointed' = 'flat', out = 0.04, seg = 8) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [t[1], -t[0]]
  const P = (u: number, z: number): V3 => [a[0] + t[0] * (s + u) + n[0] * out, a[1] + t[1] * (s + u) + n[1] * out, z]
  const h = w / 2
  p.quad(P(-h, z0), P(h, z0), P(h, zs), P(-h, zs))
  if (head === 'round') {
    for (let k = 0; k < seg; k++) {
      const a0 = (Math.PI * k) / seg, a1 = (Math.PI * (k + 1)) / seg
      p.tri(P(0, zs), P(h * Math.cos(a0), zs + h * Math.sin(a0)), P(h * Math.cos(a1), zs + h * Math.sin(a1)))
    }
  } else if (head === 'pointed') {
    // equilateral arch: two arcs of radius w struck from the opposite
    // springing points, from (h, zs) over the apex to (-h, zs)
    const A = Math.PI / 3, n2 = Math.max(3, seg / 2)
    const right: [number, number][] = [], left: [number, number][] = []
    for (let k = 0; k <= n2; k++) {
      const th = (A * k) / n2
      right.push([-h + w * Math.cos(th), zs + w * Math.sin(th)])
      left.push([h - w * Math.cos(th), zs + w * Math.sin(th)])
    }
    const ring = [...right, ...left.reverse().slice(1)]
    for (let k = 0; k < ring.length - 1; k++) p.tri(P(0, zs), P(ring[k][0], ring[k][1]), P(ring[k + 1][0], ring[k + 1][1]))
  }
}

/** A hipped roof over an axis-aligned rectangle, eaves at z0, ridge at z1 along the longer side. */
export function hipRoof(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number) {
  const dx = x1 - x0, dy = y1 - y0
  const A: V3 = [x0, y0, z0], B: V3 = [x1, y0, z0], C: V3 = [x1, y1, z0], D: V3 = [x0, y1, z0]
  if (dx >= dy) {
    const r = dy / 2, R0: V3 = [x0 + r, y0 + r, z1], R1: V3 = [x1 - r, y0 + r, z1]
    p.quad(A, B, R1, R0); p.quad(C, D, R0, R1); p.tri(B, C, R1); p.tri(D, A, R0)
  } else {
    const r = dx / 2, R0: V3 = [x0 + r, y0 + r, z1], R1: V3 = [x0 + r, y1 - r, z1]
    p.quad(B, C, R1, R0); p.quad(D, A, R0, R1); p.tri(A, B, R0); p.tri(C, D, R1)
  }
}

/**
 * A gabled roof over an axis-aligned rectangle, ridge along x ('x') or y,
 * eaves at z0 and ridge at z1; the gable triangles go in `wallPart`.
 * `over` extends the slopes past the walls at the eaves.
 */
export function gableRoof(p: Part, wallPart: Part | null, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, axis: 'x' | 'y', over = 0) {
  if (axis === 'x') {
    const ym = (y0 + y1) / 2, s = (z1 - z0) / (ym - y0), ze = z0 - over * s
    p.quad([x0, y0 - over, ze], [x1, y0 - over, ze], [x1, ym, z1], [x0, ym, z1])
    p.quad([x1, y1 + over, ze], [x0, y1 + over, ze], [x0, ym, z1], [x1, ym, z1])
    if (wallPart) { wallPart.tri([x1, y0, z0], [x1, y1, z0], [x1, ym, z1]); wallPart.tri([x0, y1, z0], [x0, y0, z0], [x0, ym, z1]) }
  } else {
    const xm = (x0 + x1) / 2, s = (z1 - z0) / (xm - x0), ze = z0 - over * s
    p.quad([x1 + over, y0, ze], [x1 + over, y1, ze], [xm, y1, z1], [xm, y0, z1])
    p.quad([x0 - over, y1, ze], [x0 - over, y0, ze], [xm, y0, z1], [xm, y1, z1])
    if (wallPart) { wallPart.tri([x0, y0, z0], [x1, y0, z0], [xm, y0, z1]); wallPart.tri([x1, y1, z0], [x0, y1, z0], [xm, y1, z1]) }
  }
}

// ── the mansion ──────────────────────────────────────────────────────────

if (import.meta.main) {
  const white = new Part(), roof = new Part(), win = new Part(), shut = new Part(), door = new Part()

  const FRONT = 17.8, PORCH = 20.4, BACK = -8.9, YS = -9.9, YN = 8.4, YC = (YS + YN) / 2
  const OLD = 5.6 // the 1856 block's back wall; the 1914 part runs on behind it
  const WALL = 9.7, TOP = 12.0, RIDGE = 13.5, PFLOOR = 1.3, BALC = 6.3

  // the house walls up to the entablature
  // (the rear part's north wall is set back 1.4 m from x = -0.4: OSM and lidar)
  const STEP = -0.4, YN2 = 7.0
  const plan: XY[] = [[BACK, YS], [FRONT, YS], [FRONT, YN], [STEP, YN], [STEP, YN2], [BACK, YN2]]
  prism(white, plan, 0, WALL, null, 0)
  // the entablature round the house and over the porch, closed underneath (the porch ceiling)
  prism(white, [[BACK, YS], [PORCH - 0.1, YS], [PORCH - 0.1, YN], [STEP, YN], [STEP, YN2], [BACK, YN2]], WALL, TOP - 0.7, null, 0, true)
  // the cornice, projecting 0.45 m, with its top
  prism(white, [[BACK - 0.45, YS - 0.45], [PORCH + 0.35, YS - 0.45], [PORCH + 0.35, YN + 0.45], [STEP - 0.45, YN + 0.45], [STEP - 0.45, YN2 + 0.45], [BACK - 0.45, YN2 + 0.45]], TOP - 0.7, TOP, white, 0.25, true)
  // the low hip over the 1856 block (and the porch); the 1914 part's roof is flat behind the cornice
  hipRoof(roof, OLD - 0.5, PORCH - 0.2, YS - 0.2, YN + 0.2, TOP, RIDGE)
  prism(roof, [[BACK - 0.2, YS - 0.2], [OLD - 0.5, YS - 0.2], [OLD - 0.5, YN + 0.2], [STEP - 0.2, YN + 0.2], [STEP - 0.2, YN2 + 0.2], [BACK - 0.2, YN2 + 0.2]], TOP - 0.01, TOP + 0.02, roof, 0)
  // the one tall chimney seen today, on the north wall at the step ("highsmith");
  // the low stacks of HABS sheet 3 don't show over the cornice and are left out
  box(white, STEP - 1.4, STEP - 0.2, YN - 0.9, YN + 0.05, WALL, RIDGE + 0.2, white, 0.12)

  // the porch: a white base, six columns, the balcony between them, the steps
  box(white, FRONT, PORCH, YS + 0.05, YN - 0.05, 0, PFLOOR, white, 0.1)
  const COLX = PORCH - 0.55, SP = 3.28
  const cols = Array.from({ length: 6 }, (_, i) => YC + (i - 2.5) * SP)
  for (const y of cols) {
    box(white, COLX - 0.55, COLX + 0.55, y - 0.55, y + 0.55, PFLOOR, PFLOOR + 0.35, white, 0.08)
    // the shaft, tapering a little, smooth-shaded
    column(white, [COLX, y], 0.46, PFLOOR + 0.35, PFLOOR + 4.5, 12)
    column(white, [COLX, y], 0.42, PFLOOR + 4.5, WALL - 0.45, 12)
    // the Ionic capital: a wide cushion with the volutes, square abacus over it
    box(white, COLX - 0.42, COLX + 0.42, y - 0.68, y + 0.68, WALL - 0.45, WALL - 0.12, white, 0.12)
    box(white, COLX - 0.55, COLX + 0.55, y - 0.55, y + 0.55, WALL - 0.12, WALL, white, 0)
  }
  // the balcony slab and its white railing band, on the front between the columns
  box(white, FRONT, COLX - 0.2, YS + 0.3, YN - 0.3, BALC - 0.35, BALC, white, 0.08, true)
  // the railings: the white X lattice of the photos, as a top and bottom rail
  // with bold diagonals (two-sided, so the open lattice reads from both sides)
  const rail = (x: number, y0: number, y1: number, z0: number, h: number) => {
    box(white, x - 0.08, x + 0.08, y0, y1, z0 + h - 0.12, z0 + h, white, 0, true)
    box(white, x - 0.06, x + 0.06, y0, y1, z0, z0 + 0.1, white, 0)
    const n = Math.max(1, Math.round((y1 - y0) / (h - 0.2))), w = (y1 - y0) / n, d = 0.06
    for (let k = 0; k < n; k++) {
      const ya = y0 + k * w, yb = ya + w, zb = z0 + 0.1, zt = z0 + h - 0.12
      for (const [p0, p1] of [[[ya, zb], [yb, zt]], [[ya, zt], [yb, zb]]] as [number, number][][]) {
        const q: V3[] = [[x, p0[0] + d, p0[1]], [x, p1[0] + d, p1[1]], [x, p1[0] - d, p1[1]], [x, p0[0] - d, p0[1]]]
        white.quad(q[0], q[1], q[2], q[3]); white.quad(q[0], q[3], q[2], q[1])
      }
    }
  }
  for (let i = 0; i < 5; i++) rail(COLX - 0.35, cols[i] + 0.45, cols[i + 1] - 0.45, BALC, 0.95)
  for (const y of [YS + 0.3, YN - 0.3]) {
    // the balcony's ends, from the house wall out to the end columns
    box(white, FRONT, COLX - 0.45, y - 0.06, y + 0.06, BALC + 0.83, BALC + 0.95, white, 0)
  }
  // the porch railing between the columns, but open at the middle bay for the steps
  for (let i = 0; i < 5; i++) if (i !== 2) rail(COLX - 0.05, cols[i] + 0.45, cols[i + 1] - 0.45, PFLOOR, 0.85)
  for (let k = 0; k < 4; k++) {
    const x = PORCH + 0.35 * (k + 1)
    box(white, PORCH - 0.1, x, cols[2] + 0.5, cols[3] - 0.5, 0, PFLOOR - 0.32 * (k + 1), white, 0)
  }

  // ── openings ──
  const SH = (p0: XY, p1: XY, s: number, w: number, z0: number, z1: number, shutters: boolean) => {
    flush(win, p0, p1, s - w / 2, s + w / 2, z0, z1, 0.04)
    // a shutter either side, each about 0.65 of the window's width as the
    // photos show them, flat on the wall, from sill to head
    if (shutters) { flush(shut, p0, p1, s - w * 1.18, s - w / 2 - 0.03, z0, z1, 0.05); flush(shut, p0, p1, s + w / 2 + 0.03, s + w * 1.18, z0, z1, 0.05) }
  }
  // the front, between the columns: two windows, the door, two windows a floor
  {
    const a: XY = [FRONT, YS], b: XY = [FRONT, YN]
    for (let i = 0; i < 5; i++) {
      const s = (cols[i] + cols[i + 1]) / 2 - YS
      if (i === 2) {
        // the door with its sidelights and transom; the upper door onto the balcony
        flush(door, a, b, s - 0.65, s + 0.65, PFLOOR, PFLOOR + 2.7, 0.05)
        flush(win, a, b, s - 1.05, s + 1.05, PFLOOR + 2.75, PFLOOR + 3.45, 0.04)
        flush(win, a, b, s - 1.05, s - 0.7, PFLOOR, PFLOOR + 2.7, 0.04)
        flush(win, a, b, s + 0.7, s + 1.05, PFLOOR, PFLOOR + 2.7, 0.04)
        flush(win, a, b, s - 0.55, s + 0.55, BALC + 0.05, BALC + 2.55, 0.04)
      } else {
        SH(a, b, s, 1.15, PFLOOR + 0.15, PFLOOR + 3.4, true)
        SH(a, b, s, 1.05, BALC + 0.15, BALC + 2.55, true)
      }
    }
  }
  // the sides: four shuttered bays on the 1856 block, five plain on the 1914 part
  for (const side of ['n', 's'] as const) {
    const a: XY = side === 'n' ? [FRONT, YN] : [BACK, YS], b: XY = side === 'n' ? [BACK, YN] : [FRONT, YS]
    const sOf = (x: number) => (side === 'n' ? FRONT - x : x - BACK)
    for (const x of [15.8, 12.3, 9.0, 6.3]) {
      SH(a, b, sOf(x), 1.05, PFLOOR + 0.2, PFLOOR + 3.1, true)
      SH(a, b, sOf(x), 1.0, BALC + 0.35, BALC + 2.55, true)
    }
    // the 1914 part (HABS sheet 3's north elevation); on the north its wall is set back
    const rear = side === 'n' ? [2.5] : [2.5, -0.6, -3.9, -6.9]
    for (const x of rear) {
      flush(win, a, b, sOf(x) - 0.5, sOf(x) + 0.5, PFLOOR + 0.6, PFLOOR + 3.1, 0.04)
      flush(win, a, b, sOf(x) - 0.5, sOf(x) + 0.5, BALC + 0.4, BALC + 2.5, 0.04)
    }
  }
  {
    const a: XY = [STEP, YN2], b: XY = [BACK, YN2]
    for (const x of [-3.9, -6.9]) {
      flush(win, a, b, STEP - x - 0.5, STEP - x + 0.5, PFLOOR + 0.6, PFLOOR + 3.1, 0.04)
      flush(win, a, b, STEP - x - 0.5, STEP - x + 0.5, BALC + 0.4, BALC + 2.5, 0.04)
    }
  }

  // ── the west wing and the porte-cochère ──
  const WW = -22.6, WTOP = 10.6, WG = 1.2 // its ground, from the lidar
  prism(white, [[WW, -2.35], [BACK, -2.35], [BACK, 7.0], [-12.1, 7.0], [-12.1, 8.8], [WW, 8.8]], 0, WTOP - 0.6, null, 0)
  box(white, WW - 0.3, BACK + 0.01, -2.65, 9.1, WTOP - 0.6, WTOP, white, 0.2, true)
  box(roof, WW, BACK, -2.35, 8.8, WTOP - 0.02, WTOP + 0.01, roof, 0)
  for (const [a, b, s0, s1] of [[[WW, 8.8], [WW, -2.35], 1.5, 9.7], [[WW, -2.35], [BACK, -2.35], 1.5, 12.2], [[-12.1, 8.8], [WW, 8.8], 1.0, 9.5]] as [XY, XY, number, number][]) {
    const L = s1 - s0, n = Math.max(1, Math.round(L / 2.6))
    for (let k = 0; k < n; k++) {
      const s = s0 + ((k + 0.5) * L) / n
      flush(win, a, b, s - 0.6, s + 0.6, WG + 0.9, WG + 3.0, 0.04)
      flush(win, a, b, s - 0.6, s + 0.6, WG + 5.0, WG + 7.0, 0.04)
    }
  }
  {
    const x0 = -28.2, x1 = WW, y0 = -1.4, y1 = 5.0, zr = 4.95
    for (const [x, y] of [[x0 + 0.35, y0 + 0.35], [x0 + 0.35, y1 - 0.35], [x1 - 0.1, y0 + 0.35], [x1 - 0.1, y1 - 0.35]]) box(white, x - 0.18, x + 0.18, y - 0.18, y + 0.18, 0, zr, null, 0)
    box(white, x0, x1, y0, y1, zr - 0.35, zr, null, 0, true)
    hipRoof(roof, x0 - 0.3, x1, y0 - 0.3, y1 + 0.3, zr, 5.8)
  }

  const front = (p: V3, n: V3) => (n[0] > 0.4 && p[0] > FRONT - 0.5 ? 0.7 : 0)
  await save('atx-governors-mansion', "Texas Governor's Mansion", [
    { part: white, material: { ...finish('mansion-white', 0xf1eee6), floodlight: front } },
    { part: roof, material: PALETTE.roof },
    { part: win, material: PALETTE.window },
    { part: shut, material: finish('mansion-shutters', 0x4a4f57) },
    { part: door, material: PALETTE.entrance },
  ], { bearing: 17.5, replaces: ['way/363500532', 'way/1461481616', 'way/1461481617'] }, 5000)
}
