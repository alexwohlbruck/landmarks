/**
 * San Diego Convention Center (111 W Harbor Drive; Arthur Erickson with
 * Deems Lewis McKinley, 1989; Phase II by HOK, 2001) — original procedural
 * geometry, CC0-1.0.  bun generators/sd-convention-center.ts
 *
 * Identity, in order: the white tensile-fabric peaks of the Sails Pavilion
 * on the roof of the north-west half; the 600 m white concrete hall along
 * the bay; the giant white triangular stair frames with round "porthole"
 * windows leaning on the Harbor Drive front; the green glass barrel-vault
 * galleries ("eyebrows") running the length of that front; the tall white
 * pylons along the bay side; the big curved hall roof between the two phases
 * and the stepped, terraced ends.
 *
 * Frame: plan turned to bearing 303.3, so +y runs along the hall toward
 * the north-west (the Sails Pavilion end) and +x faces north-east onto
 * Harbor Drive; z up; metres. Origin at the centroid of the OSM outline
 * way/30929677 (-117.16183, 32.70643). y = 0 is the ground (flat bayfront
 * fill; lidar ground 3-4 m above datum all round).
 *
 * Sources
 * - OSM (© OpenStreetMap contributors): outline way/30929677 (building=yes,
 *   3 levels, building:colour white, wikidata Q2236617); Sails Pavilion part
 *   way/1154864702 (building:part, height 26, roof:height 15, half-hipped,
 *   roof:colour white).
 * - USGS 3DEP lidar CA_SanDiegoQL2_2014 (flown 2014; the Phase III
 *   expansion was never built, so the building is as it stands), 1 m grid
 *   on the anchor.
 * Photos (evidence):
 * - "San Diego Convention Center Aerial View.jpg", Redideo, CC BY 4.0
 *   https://commons.wikimedia.org/wiki/File:San_Diego_Convention_Center_Aerial_View.jpg
 *   (Harbor Drive front of Phase II from above: galleries, curved hall, roofs).
 * - "San Diego Convention Center hjks.jpg", Luciof, CC BY-SA 3.0
 *   https://commons.wikimedia.org/wiki/File:San_Diego_Convention_Center_hjks.jpg
 *   (bay side: Sails Pavilion peaks, pylons, stairs).
 * - "San Diego Convention Center (cropped1).jpg", Bernard Gagnon,
 *   CC BY-SA 3.0 (bay side, whole Phase I).
 * - "Downtown San Diego 021.jpg", Sebastian Wallroth, CC BY 4.0
 *   (triangular stair frames along Harbor Drive).
 * - "San Diego Convention Center-1/-2/-3/-9.jpg", Visitor7, CC BY-SA 3.0
 *   (Harbor Drive front, the porthole triangle close up, galleries).
 * - "San Diego Convention Center (8727177848).jpg", vxla, CC BY 2.0;
 *   "San Diego Convention Center (14091418542).jpg", The Conmunity - Pop
 *   Culture Geek, CC BY 2.0 (panorama from a tower across Harbor Drive:
 *   sails, frames, galleries);
 *   "SD Convention Ctr west side 4.JPG", BrokenSphere, CC BY-SA 3.0;
 *   "San Diego Convention Center 2024 01/02.jpg", Gage Skidmore, CC BY-SA 2.0;
 *   "San Diego convention center zxc.jpg", Luciof, CC BY-SA 3.0;
 *   "San Diego Convention Center 2006.jpg", Epukas, public domain.
 * - Night: "San Diego convention center at night.jpg", LostplanetKD73,
 *   CC BY-SA 4.0 (sails and frames floodlit white, galleries lit).
 *
 * Numbers (lidar, measured, heights above the ground at ~3 m):
 * - Length 620 m along the bay (OSM outline; not the ~1 km sometimes
 *   quoted, which counts the Hilton next door), width 165 m.
 * - Phase I hall roof 26 m; side bands 22 m; bay terraces 13 m; Harbor
 *   Drive gallery step 12-13 m; base terrace 7 m.
 * - Sails Pavilion (round 2, lidar maxima re-read over the sails): two rows
 *   of masts at x = 8 and 24, peaks every 18 m at y = 34-106 (ten peaks),
 *   lidar 37-40 m above the ground along the mast lines; fabric apexes 37 m
 *   (the lidar) with the masts standing to 41 m; the fabric sags to 23 m between the
 *   peaks and at the edges (sharper and deeper than the lidar's 1 m maxima
 *   show, to match Luciof's photo and the Conmunity panorama). OSM's 26 m
 *   is the pavilion's base.
 * - Phase II roof 22 m; the big hall between the phases rises to 32 m
 *   under a curved roof; the stair terraces at the joint 19 m.
 * - Ends: stepped, 17-22 m down to 14 m (lidar).
 * - Triangle frames: seven, every 30 m along the Phase I front, in its
 *   plane, struts (3 m, bright white like the fabric so the row reads at
 *   phone size) rising 25 m over 27 m toward the north-west, plus the
 *   closed porthole frame by the main stair at the joint (photo-scaled from
 *   Wallroth's photo and the Conmunity panorama); pylons 34 m (photo-scaled
 *   against the sails). Counts and positions estimated.
 * - Colours: white concrete and fabric, pale green gallery glass, grey roofs
 *   (NAIP and the aerial photo; the roof grey taken from the aerial photo's
 *   mid-grey, which also lets the white sails stand out).
 *
 * Night: sails, frames and pylons carry _FLOODLIGHT; galleries and window
 * bands glow.
 *
 * Doubts
 * - The pylon count and the frames' exact spacing are from oblique photos
 *   only; Phase II's front is drawn with galleries and no frames, as the
 *   aerial photo shows it.
 * - Roof plant, skylights, the Sails' masts and cables, stairs and railings
 *   are left out; the real fabric edges scallop between their supports.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant, type Swatch } from './palette'
import { save, walls, cap, inset, panel, rect, type XY } from './chi-aon-center'

const CONC = finish('sdcc-concrete', 0xf1ece3)
const FABRIC = finish('sdcc-sails', 0xfbf8f1, 0.7)
const GALLERY = windowVariant(2, 0x8cbfae) // the green glass barrel vaults; lit at night
const WIN = PALETTE.window
const ROOF = finish('sdcc-roof', 0xa3a9ad) // the hall roofs read mid-grey in the aerial photo, so the white sails stand out

const conc = new Part(), fabric = new Part(), gallery = new Part(), win = new Part(), roof = new Part()

function box(r: XY[], z0: number, z1: number, b = 0.5, wall = conc, top = roof) {
  const ins = inset(r, b)
  walls(wall, r, z0, z1 - b)
  walls(wall, r, z1 - b, z1, ins)
  cap(top, ins, z1)
}
const R = (x0: number, x1: number, y0: number, y1: number) => rect(x0, y0, x1, y1)
function bands(r: XY[], rows: [number, number][], bay = 7, gap = 2.0, end = 3, minLen = 12) {
  r.forEach((a, i) => {
    const b = r[(i + 1) % r.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < minLen) return
    const use = L - 2 * end, k = Math.max(1, Math.round((use + gap) / (bay + gap))), w = (use - (k - 1) * gap) / k
    for (let q = 0; q < k; q++) for (const [z0, z1] of rows) panel(win, a, b, end + q * (w + gap), end + q * (w + gap) + w, z0, z1, 0.05)
  })
}

// ---------------------------------------------------------------------------
// Base terrace: the OSM outline (way/30929677), simplified, counter-clockwise.
const OUTLINE: XY[] = ([
  [81.30, -4.39], [70.58, -247.03], [61.58, -246.75], [60.82, -254.91], [51.51, -254.73], [51.57, -260.98],
  [20.46, -281.93], [-22.31, -310.71], [-39.37, -310.70], [-81.94, -279.74], [-80.04, -259.63], [-58.35, -51.15],
  [-74.99, -49.68], [-68.46, 15.50], [-58.33, 8.25], [-52.83, 19.91], [-65.04, 30.34], [-87.23, 56.22],
  [-93.93, 67.82], [-99.36, 69.55], [-99.34, 99.39], [-92.13, 97.69], [-92.64, 113.00], [-130.99, 113.42],
  [-129.08, 134.76], [-92.50, 134.90], [-92.55, 153.30], [-89.05, 198.23], [-39.85, 248.14], [20.21, 307.59],
  [48.73, 279.52], [40.33, 271.06], [62.50, 248.89], [62.34, 243.85], [85.18, 244.10], [85.08, 20.00],
  [85.82, 10.23],
] as XY[]).reverse() // OSM runs clockwise
box(OUTLINE, 0, 7, 0.5)
bands(OUTLINE, [[0.8, 5.6]], 6, 2.2, 2, 10)

// ---------------------------------------------------------------------------
// Phase II (south-east half)
const P2_BASE = R(-66, 80, -262, -55)
box(P2_BASE, 7, 13)
const P2 = R(-54, 66, -258, -58)
box(P2, 13, 22)
bands(P2, [[14.2, 20.6]], 7.5, 2.2)
// The stepped south-east end.
box(R(-74, 30, -282, -262), 7, 20)
box(R(-66, 12, -296, -282), 7, 13)

// The big hall between the phases, under a curved roof (27 m eaves, 32 m crown).
{
  const x0 = -48, x1 = 64, y0 = -55, y1 = -5, zE = 27, zC = 32, n = 8
  box(R(-66, 80, -55, -5), 7, 13)
  const r = R(x0, x1, y0, y1)
  walls(conc, r, 13, zE)
  bands(r, [[14.5, 25.5]], 6, 2.0, 3, 20)
  const zAt = (y: number) => zE + (zC - zE) * Math.sin((Math.PI * (y - y0)) / (y1 - y0))
  for (let i = 0; i < n; i++) {
    const ya = y0 + ((y1 - y0) * i) / n, yb = y0 + ((y1 - y0) * (i + 1)) / n
    roof.quad([x0, ya, zAt(ya)], [x1, ya, zAt(ya)], [x1, yb, zAt(yb)], [x0, yb, zAt(yb)])
    // gable ends, east and west
    conc.quad([x1, ya, zE], [x1, yb, zE], [x1, yb, zAt(yb)], [x1, ya, zAt(ya)])
    conc.quad([x0, yb, zE], [x0, ya, zE], [x0, ya, zAt(ya)], [x0, yb, zAt(yb)])
  }
}
// The stair terraces at the joint, stepping up toward the Sails Pavilion.
box(R(-66, 80, -5, 25), 7, 13)
box(R(-54, 66, -5, 25), 13, 16.5)
box(R(-48, 62, 2, 25), 16.5, 19.5)

// ---------------------------------------------------------------------------
// Phase I (north-west half)
const P1_BASE = R(-66, 80, 25, 232)
box(P1_BASE, 7, 13)
const P1 = R(-45, 72, 25, 248)
box(P1, 13, 22)
bands(R(-45, 72, 126, 248), [[14.2, 20.6]], 7.5, 2.2)
const HALL = R(-9, 45, 130, 250)
box(HALL, 22, 26)
// The stepped north-west end.
box([[-66, 222], [62, 232], [62, 249], [40, 271], [48, 280], [20, 306], [-40, 247], [-66, 232]] as XY[], 7, 17)
box([[-36, 236], [46, 248], [32, 262], [36, 268], [14, 290], [-30, 248]] as XY[], 17, 20)

// ---------------------------------------------------------------------------
// The Sails Pavilion: a fabric heightfield over x -18..54, y 22..124. The
// lidar shows two rows of masts (x = 8 and 24) with peaks every 18 m
// (y = 34 ... 106), tops 37 m and mast tips ~40 m above datum. Each peak is a
// sharp tent cone; the fabric sags deep between peaks and down to the
// edges; white masts stand above every peak.
{
  const X0 = -18, X1 = 54, Y0 = 22, Y1 = 124, ZB = 19.5, ZE = 23, ZP = 37
  const nx = 36, ny = 34
  const PEAKS: [number, number][] = []
  for (const px of [8, 24]) for (let py = 34; py <= 106; py += 18) PEAKS.push([px, py])
  const z = (x: number, y: number) => {
    let f = 0
    for (const [px, py] of PEAKS) {
      const d = Math.hypot((x - px) / 20, (y - py) / 11)
      f = Math.max(f, Math.max(0, 1 - d) ** 1.7)
    }
    return ZE + (ZP - ZE) * f
  }
  // the masts: white posts through each peak, standing ~4 m clear
  for (const [px, py] of PEAKS) beam([px, py, ZP - 3], [px, py, ZP + 4], 1.2, fabric)
  const P = (i: number, j: number): V3 => {
    const x = X0 + ((X1 - X0) * i) / nx, y = Y0 + ((Y1 - Y0) * j) / ny
    return [x, y, z(x, y)]
  }
  // smooth normals from the heightfield, so the fabric welds into one surface
  const N = (i: number, j: number): V3 => {
    const x = X0 + ((X1 - X0) * i) / nx, y = Y0 + ((Y1 - Y0) * j) / ny, h = 0.5
    const gx = (z(x + h, y) - z(x - h, y)) / (2 * h), gy = (z(x, y + h) - z(x, y - h)) / (2 * h)
    const l = Math.hypot(gx, gy, 1)
    return [-gx / l, -gy / l, 1 / l]
  }
  for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) {
    const a = P(i, j), b = P(i + 1, j), c = P(i + 1, j + 1), d = P(i, j + 1)
    // split along the diagonal that keeps the peaks sharp
    const na = N(i, j), nb = N(i + 1, j), nc = N(i + 1, j + 1), nd = N(i, j + 1)
    if ((i + j) % 2 === 0) { fabric.tri(a, b, c, undefined, undefined, undefined, [na, nb, nc]); fabric.tri(a, c, d, undefined, undefined, undefined, [na, nc, nd]) }
    else { fabric.tri(a, b, d, undefined, undefined, undefined, [na, nb, nd]); fabric.tri(b, c, d, undefined, undefined, undefined, [nb, nc, nd]) }
  }
  // glass walls from the roof below up to the fabric's edge
  const edge: V3[] = []
  for (let i = 0; i < nx; i++) edge.push(P(i, 0))
  for (let j = 0; j < ny; j++) edge.push(P(nx, j))
  for (let i = nx; i > 0; i--) edge.push(P(i, ny))
  for (let j = ny; j > 0; j--) edge.push(P(0, j))
  edge.forEach((a, k) => {
    const b = edge[(k + 1) % edge.length]
    win.quad([a[0], a[1], ZB], [b[0], b[1], ZB], b, a)
  })
}

// ---------------------------------------------------------------------------
// Harbor Drive front: the green barrel-vault galleries, two tiers.
function vault(x0: number, x1: number, y0: number, y1: number, z0: number, r: number, n = 6) {
  // a quarter cylinder along y, leaning on the wall at x0, falling to x1
  const pts: [number, number][] = Array.from({ length: n + 1 }, (_, k) => {
    const t = (Math.PI / 2) * (k / n)
    return [x0 + (x1 - x0) * Math.sin(t), z0 + r * Math.cos(t)]
  })
  for (let k = 0; k < n; k++) {
    const [xa, za] = pts[k], [xb, zb] = pts[k + 1]
    gallery.quad([xa, y0, za], [xb, y0, zb], [xb, y1, zb], [xa, y1, za])
  }
  // end caps
  for (const [y, s] of [[y0, -1], [y1, 1]] as [number, number][]) {
    for (let k = 0; k < n; k++) {
      const [xa, za] = pts[k], [xb, zb] = pts[k + 1]
      const A: V3 = [x0, y, z0 - 0.01], B: V3 = [xa, y, za], C: V3 = [xb, y, zb]
      gallery.tri(A, B, C, undefined, undefined, undefined, [[0, s, 0], [0, s, 0], [0, s, 0]])
    }
  }
}
for (const [y0, y1] of [[-256, -60], [28, 244]] as [number, number][]) {
  vault(72, 79, y0, y1, 13, 6.5)
  vault(80, 84.5, y0, y1, 7, 4.5)
}

// The great triangular frames on the Harbor Drive front of Phase I: in the
// plane of the front, each a sloping strut rising toward the north-west from
// the pavement to the roof edge and a vertical post, with the green
// galleries showing between them. The lowest frame is closed with a
// porthole, as at the main stair.
function beam(a: V3, b: V3, w: number, part: Part = fabric) {
  const d = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], L = Math.hypot(d[0], d[1], d[2])
  const u: V3 = [d[0] / L, d[1] / L, d[2] / L]
  const sx: V3 = [1, 0, 0] // the frames lie in the plane x = const
  const up: V3 = [u[1] * sx[2] - u[2] * sx[1], u[2] * sx[0] - u[0] * sx[2], u[0] * sx[1] - u[1] * sx[0]]
  const h = w / 2
  const off = (p: V3, i: number, j: number): V3 => [p[0] + sx[0] * h * i + up[0] * h * j, p[1] + sx[1] * h * i + up[1] * h * j, p[2] + sx[2] * h * i + up[2] * h * j]
  const ring = (p: V3) => [off(p, -1, -1), off(p, 1, -1), off(p, 1, 1), off(p, -1, 1)]
  const A = ring(a), B = ring(b)
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    const mid: V3 = [(A[i][0] + A[j][0]) / 2 - a[0], (A[i][1] + A[j][1]) / 2 - a[1], (A[i][2] + A[j][2]) / 2 - a[2]]
    const l = Math.hypot(mid[0], mid[1], mid[2]), n: V3 = [mid[0] / l, mid[1] / l, mid[2] / l]
    part.tri(A[i], A[j], B[j], undefined, undefined, undefined, [n, n, n])
    part.tri(A[i], B[j], B[i], undefined, undefined, undefined, [n, n, n])
  }
  const nb: V3 = [-u[0], -u[1], -u[2]]
  part.tri(A[0], A[1], A[2], undefined, undefined, undefined, [nb, nb, nb]); part.tri(A[0], A[2], A[3], undefined, undefined, undefined, [nb, nb, nb])
  part.tri(B[0], B[1], B[2], undefined, undefined, undefined, [u, u, u]); part.tri(B[0], B[2], B[3], undefined, undefined, undefined, [u, u, u])
}
const FX = 86.5
for (let y0 = 34; y0 <= 214; y0 += 30) {
  beam([FX, y0 + 1.6, 1.5], [FX, y0 + 27, 25], 3.0)
  beam([FX, y0 + 27, 0], [FX, y0 + 27, 25], 2.6)
}
// the closed frame by the main stair, with its porthole
{
  const y0 = 4, y1 = 31, H = 25, n: V3 = [1, 0, 0]
  conc.tri([FX - 1, y0, 0], [FX - 1, y1, 0], [FX - 1, y1, H], undefined, undefined, undefined, [n, n, n])
  conc.tri([FX + 1, y0, 0], [FX + 1, y1, H], [FX + 1, y1, 0], undefined, undefined, undefined, [[-1, 0, 0], [-1, 0, 0], [-1, 0, 0]])
  beam([FX, y0 + 1.6, 1.5], [FX, y1, H], 3.0)
  beam([FX, y1, 0], [FX, y1, H], 2.6)
  const cy = 23, cz = 8, r = 3.6, k = 14
  for (let q = 0; q < k; q++) {
    const a = (2 * Math.PI * q) / k, b = (2 * Math.PI * (q + 1)) / k
    win.tri([FX + 1.05, cy, cz], [FX + 1.05, cy + r * Math.cos(a), cz + r * Math.sin(a)], [FX + 1.05, cy + r * Math.cos(b), cz + r * Math.sin(b)],
      undefined, undefined, undefined, [n, n, n])
  }
}

// The tall white pylons along the bay side of Phase I.
for (let y = 32; y <= 250; y += 27) box(R(-49.5, -47.5, y - 0.9, y + 0.9), 13, 34, 0.25, conc, conc)

const LIT = (p: V3, n: V3) => (n[2] < 0.5 && ((p[0] > 84 && p[1] > 0 && p[1] < 245) || (p[0] < -47 && p[0] > -50 && p[2] > 13)) ? 0.7 : 0)

if (import.meta.main) {
  await save('sd-convention-center', 'San Diego Convention Center', [-117.16183, 32.70643], 303.3, [
    { part: conc, material: { ...CONC, floodlight: LIT } as Swatch },
    { part: fabric, material: { ...FABRIC, floodlight: () => 0.9 } as Swatch },
    { part: gallery, material: GALLERY },
    { part: win, material: WIN },
    { part: roof, material: ROOF },
  ], 6500)
}
