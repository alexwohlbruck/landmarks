/**
 * Seokjojeon (석조전), Deoksugung, Seoul (1900-1910, J. R. Harding): the
 * neoclassical stone palace, now the Korean Empire History Museum:
 * procedural, CC0-1.0.
 * bun generators/seoul-seokjojeon.ts
 *
 * Frame: bearing 0 (the outline's edges run within 1 degree of the
 * compass), model +x east, +y north; the portico faces south over the
 * sunken garden. Origin at the area centroid of the outline (OSM
 * relation/19357693). y = 0 is the forecourt the front stair rises from;
 * the building stands on its own raised basement storey. Elevation 0.
 * Terrain could not be checked (no z15 tiles over Seoul); the forecourt is
 * level in every photo.
 *
 * OSM, mapped in detail and used as tagged (heights from the parts):
 * - the basement storey 0-3 m (relation/19358426 and its outer east and west
 *   parts 19358429, 19358430), the floor 3-3.25 m (19357694);
 * - the giant order 3.25-13 m (19357696) with its plinths (19357700): six
 *   portico columns at y = -10.6 (OSM local) spaced 2.8 m, four on each
 *   side portico at x = +-27.2; the outline's front edge steps round the
 *   wing columns every 2.9 m;
 * - the ground-floor walls 3-9 m (19357695), the upper veranda floor 9 m
 *   (19358428), the upper walls 9-13 m (19357703), set back 3.4 m behind
 *   the columns;
 * - the entablature 13-15 m (19358510), the front pediment 15-17.5 m
 *   (19358511), the hipped roofs over the middle 15-17.5 m (way/773001489,
 *   way/773001492; roof #a7acb4), and the front stair 0-3 m with its cheek
 *   blocks (19358427) and the side stairs (19357697-19357701).
 * Published: built 1900-1910 to designs by J. R. Harding, a three-storey
 * stone building with a central Ionic portico (Wikipedia, "Deoksugung";
 * Cultural Heritage Administration, Historic Site 124).
 *
 * From the photos: 6 wing columns each side of the portico (s10), all
 * Ionic, about 1.1 m across; balustrades between the columns on both
 * veranda floors and along the roof of the wings, with urns on pedestals
 * over each wing column (s1, s12); round-arched ground-floor windows and
 * square upper ones behind the colonnade (s1); a rusticated basement with
 * square windows (s12). Estimated: column diameter, capital and baluster
 * sizes, window sizes, the urns.
 * Left out: the tympanum's relief (the plum blossom), the lamps, the
 * fountain garden in front (ground), the west passage (relation/19358436).
 *
 * Night: the granite is floodlit (_FLOODLIGHT), strongest low on the
 * columns; windows `window`, the portico doors `entrance`.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 * - s1 "Seokjojeon 20240409 081.jpg", Mobius6, CC BY 4.0 (front, level)
 *   https://commons.wikimedia.org/wiki/File:Seokjojeon_20240409_081.jpg
 * - s10 "Deoksugung, Seoul - Seoul3231.jpg", lumoplank, CC0 (whole front, distant)
 *   https://commons.wikimedia.org/wiki/File:Deoksugung,_Seoul_-_Seoul3231.jpg
 * - s12 "Seokjojeon (Korean Empire History Museum) 20191221 19.jpg", Ahmed, CC BY 4.0 (south-east)
 *   https://commons.wikimedia.org/wiki/File:Seokjojeon_(Korean_Empire_History_Museum)_20191221_19.jpg
 * - s8 "Seokjojeon (Korean Empire History Museum) 20191221 16.jpg", Ahmed, CC BY 4.0 (south-west)
 *   https://commons.wikimedia.org/wiki/File:Seokjojeon_(Korean_Empire_History_Museum)_20191221_16.jpg
 * - s3 "Seokjojeon of Deoksugung palace.jpg", Pip1024, CC BY-SA 4.0 (south-west, near)
 *   https://commons.wikimedia.org/wiki/File:Seokjojeon_of_Deoksugung_palace.jpg
 * - s6 "Seokjojeon IMG 2079.jpg", G41rn8, CC BY-SA 4.0 (west end, distant)
 *   https://commons.wikimedia.org/wiki/File:Seokjojeon_IMG_2079.jpg
 * No look-only references used.
 * Doubts: no licensed photo of the north (rear) side, drawn as plain walls
 * with windows in the OSM outline; the side verandas' column count away
 * from the side porticos is estimated.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { abox, column, pediment, save, type P2 } from './seoul-city-hall'
import { box as kbox } from './seoul-geunjeongjeon'
import { face, flat, lathe, polyCap, prism as polyPrism, offsetRing } from './seoul-n-seoul-tower'

const wall = new Part(), stone = new Part(), win = new Part(), roof = new Part(), door = new Part()

/** A small box with corner-averaged normals, so it welds to 8 vertices and shades soft; no bottom. */
const sbox = (p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, skip = 'b') => kbox(p, x0, y0, z0, x1, y1, z1, skip, true)

/** Shift every part so the outline's centroid is the origin (OSM local → model). */
function recentre(parts: Part[], dx: number, dy: number) {
  // Part.pos is in glTF order (x, z, -y)
  for (const p of parts) for (let i = 0; i < p.pos.length; i += 3) { p.pos[i] -= dx; p.pos[i + 2] += dy }
}

/** An Ionic column: square plinth, shaft, the capital's two scroll bolsters and abacus. Front faces -y unless `side`. */
function ionic(x: number, y: number, z0: number, z1: number, r = 0.55, side = false) {
  sbox(stone, x - r - 0.15, x + r + 0.15, y - r - 0.15, y + r + 0.15, z0, z0 + 0.4, 'bt')
  column(stone, x, y, z0 + 0.4, z1 - 0.25, r, r * 0.86, 10)
  // the volutes: two bolsters across the capital, axis front-to-back
  const R = 0.3, n = 5, zc = z1 - 0.55
  for (const s of [-1, 1]) {
    const c = side ? y + s * (r + 0.02) : x + s * (r + 0.02)
    const ring = (d: number): V3[] => Array.from({ length: n }, (_, k) => {
      const a = (k / n) * 2 * Math.PI
      return side ? [x + d, c + R * Math.cos(a), zc + R * Math.sin(a)] : [c + R * Math.cos(a), y + d, zc + R * Math.sin(a)]
    })
    const A = ring(-r * 0.95), B = ring(r * 0.95)
    for (let k = 0; k < n; k++) {
      const j = (k + 1) % n, a0 = (k / n) * 2 * Math.PI, a1 = (j / n) * 2 * Math.PI
      const N = (a: number): V3 => (side ? [0, Math.cos(a), Math.sin(a)] : [Math.cos(a), 0, Math.sin(a)])
      face(stone, [A[k], A[j], B[j], B[k]], [N(a0), N(a1), N(a1), N(a0)])
    }
    const nf: V3 = side ? [-1, 0, 0] : [0, -1, 0], nb: V3 = side ? [1, 0, 0] : [0, 1, 0]
    for (let k = 1; k < n - 1; k++) {
      stoneTri(A[0], A[k], A[k + 1], nf)
      stoneTri(B[0], B[k], B[k + 1], nb)
    }
  }
  // abacus
  sbox(stone, x - r - 0.2, x + r + 0.2, y - r - 0.2, y + r + 0.2, z1 - 0.25, z1)
}
function stoneTri(a: V3, b: V3, c: V3, n: V3) {
  const ab = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], ac = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  const g = [ab[1] * ac[2] - ab[2] * ac[1], ab[2] * ac[0] - ab[0] * ac[2], ab[0] * ac[1] - ab[1] * ac[0]]
  if (g[0] * n[0] + g[1] * n[1] + g[2] * n[2] >= 0) stone.tri(a, b, c)
  else stone.tri(a, c, b)
}

/** A balustrade along a straight run (axis-aligned): plinth, top rail and square balusters. */
function balustrade(xa: number, ya: number, xb: number, yb: number, z: number, h = 1.0, per = 1.0) {
  const alongX = Math.abs(xb - xa) > Math.abs(yb - ya)
  const t = 0.32
  const L = alongX ? Math.abs(xb - xa) : Math.abs(yb - ya)
  const run = (z0: number, z1: number, w: number) => alongX
    ? sbox(stone, Math.min(xa, xb), Math.max(xa, xb), ya - w / 2, ya + w / 2, z0, z1)
    : sbox(stone, xa - w / 2, xa + w / 2, Math.min(ya, yb), Math.max(ya, yb), z0, z1)
  run(z, z + 0.2, t + 0.08)
  run(z + h - 0.18, z + h, t + 0.1)
  const n = Math.max(1, Math.round(L / per))
  for (let k = 0; k < n; k++) {
    const f = (k + 0.5) / n
    const x = xa + (xb - xa) * f, y = ya + (yb - ya) * f, b = 0.13
    // four sides only: the rails cover the ends
    sbox(stone, x - b, x + b, y - b, y + b, z + 0.2, z + h - 0.18, 'bt')
  }
}

/** An urn on a pedestal, standing on the roof balustrade line. */
function urn(x: number, y: number, z: number) {
  sbox(stone, x - 0.35, x + 0.35, y - 0.35, y + 0.35, z, z + 1.1)
  lathe([x, y], [[0.14, z + 1.1], [0.38, z + 1.45], [0.16, z + 1.85], [0, z + 2.05]], () => stone, 5, 70)
}

function build() {
  const AX = 0.4 // the portico's axis (OSM local)
  const mirror = (f: (s: 1 | -1) => void) => { f(1); f(-1) }
  const X = (s: number, d: number) => AX + s * d

  // ---- basement storey 0-3 m, rusticated, under the whole building
  const base: P2[] = [[-24.7, -8.7], [25.4, -7.7], [25.3, -2.0], [27.4, -2.0], [27.9, 2.8], [28.0, 13.8], [27.3, 19.5], [24.7, 19.3], [24.6, 22.4], [-25.2, 21.8], [-25.2, 18.6], [-27.4, 18.1], [-27.9, 12.8], [-27.9, 2.8], [-27.4, -3.0], [-24.8, -3.0]]
  polyPrism(wall, roof, base, 0, 3)
  polyPrism(stone, stone, offsetRing(base, -0.15), 2.9, 3.3) // the floor's edge band
  // basement windows: square, along the long sides and the rear
  for (let x = -21.5; x <= 22; x += 2.95) {
    flat(win, [[x - 0.6, -8.62 + (x + 24.7) * 0.02, 0.7], [x + 0.6, -8.62 + (x + 24.7) * 0.02, 0.7], [x + 0.6, -8.62 + (x + 24.7) * 0.02, 2.3], [x - 0.6, -8.62 + (x + 24.7) * 0.02, 2.3]], [0, -1, 0])
    flat(win, [[x + 0.6, 22.3, 0.7], [x - 0.6, 22.3, 0.7], [x - 0.6, 22.3, 2.3], [x + 0.6, 22.3, 2.3]], [0, 1, 0])
  }
  for (const y of [5.5, 8.4, 11.3]) {
    flat(win, [[28.05, y - 0.6, 0.7], [28.05, y + 0.6, 0.7], [28.05, y + 0.6, 2.3], [28.05, y - 0.6, 2.3]], [1, 0, 0])
    flat(win, [[-28.05, y + 0.6, 0.7], [-28.05, y - 0.6, 0.7], [-28.05, y - 0.6, 2.3], [-28.05, y + 0.6, 2.3]], [-1, 0, 0])
  }

  // ---- the walls behind the colonnade: ground floor 3-9, upper 9-13
  const body: P2[] = [[-20.8, -5.0], [21.5, -4.4], [21.2, 22.0], [12.4, 22.3], [12.6, 17.1], [7.2, 17.0], [7.1, 22.3], [-7.3, 22.0], [-7.2, 16.6], [-12.7, 16.5], [-12.9, 21.9], [-21.4, 21.8]]
  polyPrism(wall, null, body, 3.25, 13)
  // the ground-floor vestibule behind the portico
  abox(wall, -4.1, 4.9, -8.2, -4.6, 3.25, 9, null)
  // the veranda floors: 9 m slab out to the columns
  const ver: P2[] = [[-24.6, -8.4], [25.2, -7.6], [25.0, 22.0], [-24.9, 21.6]]
  polyPrism(stone, stone, ver, 8.9, 9.3, true)
  abox(stone, -7.4, 8.2, -11.4, -8.2, 8.9, 9.3, stone, true) // the portico's
  // windows: round-arched below, square above, one per bay (front, ends)
  const arch = (x: number, y: number, n: V3, w: number, z0: number, zs: number) => {
    const h = w / 2
    const P = (u: number, z: number): V3 => (n[1] !== 0 ? [x + u, y, z] : [x, y + u, z])
    flat(win, [P(-h, z0), P(h, z0), P(h, zs), P(-h, zs)], n)
    for (let k = 0; k < 8; k++) {
      const a0 = (k / 8) * Math.PI, a1 = ((k + 1) / 8) * Math.PI
      const A = P(h * Math.cos(a0), zs + h * Math.sin(a0)), B = P(h * Math.cos(a1), zs + h * Math.sin(a1))
      winTri(P(0, zs), A, B, n)
    }
  }
  const winTri = (a: V3, b: V3, c: V3, n: V3) => {
    const ab = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], ac = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
    const g = [ab[1] * ac[2] - ab[2] * ac[1], ab[2] * ac[0] - ab[0] * ac[2], ab[0] * ac[1] - ab[1] * ac[0]]
    if (g[0] * n[0] + g[1] * n[1] + g[2] * n[2] >= 0) win.tri(a, b, c)
    else win.tri(a, c, b)
  }
  const FY = (x: number) => -5.0 + (x + 20.8) * (0.6 / 42.3) - 0.06 // the front wall's line
  mirror((s) => {
    for (let k = 0; k < 5; k++) {
      const x = X(s, 10.45 + 2.95 * k)
      if (Math.abs(x) > 20.5) continue
      arch(x, FY(x), [0, -1, 0], 1.3, 4.3, 7.0)
      flat(win, [[x - 0.65, FY(x), 10.3], [x + 0.65, FY(x), 10.3], [x + 0.65, FY(x), 12.3], [x - 0.65, FY(x), 12.3]], [0, -1, 0])
    }
    // the portico bays: square windows beside the doors, upper windows
    for (const d of [2.9, 5.6]) {
      const x = X(s, d), y = d > 4 ? FY(x) : -8.26
      flat(win, [[x - 0.6, y, 4.3], [x + 0.6, y, 4.3], [x + 0.6, y, 7.6], [x - 0.6, y, 7.6]], [0, -1, 0])
    }
    for (const d of [0, 2.8, 5.6]) {
      if (s < 0 && d === 0) continue
      const x = X(s, d)
      flat(win, [[x - 0.6, FY(x), 10.3], [x + 0.6, FY(x), 10.3], [x + 0.6, FY(x), 12.3], [x - 0.6, FY(x), 12.3]], [0, -1, 0])
    }
    // the ends: windows on both floors behind the side verandas
    const ex = s > 0 ? 21.56 : -20.96
    for (const y of [-1.4, 1.6, 4.6, 7.6, 10.6, 13.6, 16.6, 19.6]) {
      arch(ex, y, [s, 0, 0], 1.2, 4.3, 7.0)
      flat(win, s > 0 ? [[ex, y - 0.6, 10.3], [ex, y + 0.6, 10.3], [ex, y + 0.6, 12.3], [ex, y - 0.6, 12.3]] : [[ex, y + 0.6, 10.3], [ex, y - 0.6, 10.3], [ex, y - 0.6, 12.3], [ex, y + 0.6, 12.3]], [s, 0, 0])
    }
  })
  // the doors
  flat(door, [[AX - 1.2, -8.26, 3.3], [AX + 1.2, -8.26, 3.3], [AX + 1.2, -8.26, 7.6], [AX - 1.2, -8.26, 7.6]], [0, -1, 0])
  // rear: windows on both floors
  for (const [x0, x1, y] of [[-20.5, -13.5, 21.86], [-6.5, 6.5, 22.16], [13.2, 20.5, 22.36]] as [number, number, number][])
    for (let x = x0 + 1.2; x < x1 - 0.5; x += 2.9) for (const [z0, z1] of [[4.3, 7.6], [10.3, 12.3]])
      flat(win, [[x + 0.6, y, z0], [x - 0.6, y, z0], [x - 0.6, y, z1], [x + 0.6, y, z1]], [0, 1, 0])

  // ---- the giant order
  const PY = -10.6, WY = -8.0, ZC0 = 3.3, ZC1 = 13
  for (const d of [1.4, 4.2, 7.0]) mirror((s) => ionic(X(s, d), PY, ZC0, ZC1))
  mirror((s) => {
    for (let k = 0; k < 6; k++) ionic(X(s, 8.95 + 2.95 * k), WY + (s > 0 ? 0.2 : -0.2) * (k / 5), ZC0, ZC1)
    // side porticos and the side verandas
    for (const y of [4.3, 7.4, 10.3, 13.1]) ionic(s > 0 ? 27.2 : -27.3, y, ZC0, ZC1, 0.55, true)
    for (const y of [-4.6, -1.4, 16.3, 19.3]) ionic(s > 0 ? 24.5 : -24.4, y, ZC0, ZC1, 0.55, true)
    // rear corner piers
    abox(stone, (s > 0 ? 24.0 : -24.9), (s > 0 ? 24.9 : -24.0), 21.0, 22.0, 3.25, 13, null)
  })

  // ---- balustrades: both veranda floors between the columns
  for (const z of [3.3, 9.3]) {
    const per = z < 5 ? 0.9 : 0.55
    mirror((s) => {
      for (let k = 0; k < 5; k++) {
        const xa = X(s, 8.95 + 2.95 * k + 0.75), xb = X(s, 8.95 + 2.95 * (k + 1) - 0.75)
        balustrade(xa, WY + (s > 0 ? 0.2 : -0.2) * ((k + 0.5) / 5), xb, WY + (s > 0 ? 0.2 : -0.2) * ((k + 0.5) / 5), z, 0.95, per)
      }
      const ex = s > 0 ? 24.5 : -24.4
      balustrade(ex, -3.85, ex, -2.15, z, 0.95, per)
      balustrade(ex, 17.05, ex, 18.55, z, 0.95, per)
      const px = s > 0 ? 27.2 : -27.3
      for (const [ya, yb] of [[5.05, 6.65], [8.15, 9.55], [11.05, 12.35]]) balustrade(px, ya, px, yb, z, 0.95, per)
    })
  }
  // the portico's upper floor
  for (const d of [-7.0, -4.2, -1.4, 1.4, 4.2]) balustrade(AX + d + 0.75, PY, AX + d + 2.8 - 0.75, PY, 9.3, 0.95, 0.42)

  // ---- entablature, cornice and roof
  const ent: P2[] = [[-24.6, -8.5], [25.3, -7.5], [25.0, 3.7], [28.1, 3.7], [28.0, 13.9], [24.7, 13.8], [24.5, 22.2], [-25.2, 21.6], [-25.1, 12.9], [-28.1, 12.9], [-27.9, 2.7], [-24.7, 2.8]]
  polyPrism(stone, null, ent, 13, 14.4)
  polyPrism(stone, roof, offsetRing(ent, -0.4), 14.4, 15)
  polyCap(stone, offsetRing(ent, -0.4), 14.4, false)
  // the portico's entablature and pediment
  abox(stone, -7.4, 8.2, -11.5, -8.0, 13, 14.4, null)
  abox(stone, -7.8, 8.6, -11.9, -8.0, 14.4, 15, stone, true)
  pediment(stone, roof, -7.8, 8.6, -11.9, -6.0, 15, 2.6)
  // the hipped roofs over the middle (OSM ways 773001489 and 773001492)
  const hip = (x0: number, x1: number, y0: number, y1: number, z0: number, z1: number) => {
    const inset = (x1 - x0) / 2
    const a: V3 = [x0, y0, z0], b: V3 = [x1, y0, z0], c: V3 = [x1, y1, z0], d: V3 = [x0, y1, z0]
    const e: V3 = [(x0 + x1) / 2, y0 + inset, z1], f: V3 = [(x0 + x1) / 2, y1 - inset, z1]
    roof.tri(a, b, e); roof.tri(c, d, f); roof.tri(b, c, f); roof.tri(b, f, e); roof.tri(d, a, e); roof.tri(d, e, f)
  }
  hip(-6.2, 6.6, -6.0, 21.4, 15, 17.4)
  // roof balustrades on the wings and sides, urns over the wing columns
  mirror((s) => {
    const y = WY - 0.1
    balustrade(X(s, 8.4), y, X(s, 24.0), y + (s > 0 ? 0.2 : -0.2), 15, 1.0, 1.2)
    for (let k = 0; k < 6; k++) urn(X(s, 8.95 + 2.95 * k), WY + (s > 0 ? 0.2 : -0.2) * (k / 5) - 0.1, 15)
    const ex = s > 0 ? 24.75 : -24.85
    balustrade(ex, -7.0, ex, 3.2, 15, 1.0, 1.2)
    balustrade(ex, 14.3, ex, 21.6, 15, 1.0, 1.2)
    const px = s > 0 ? 27.75 : -27.75
    balustrade(px, 3.9, px, 13.5, 15, 1.0, 1.2)
    for (const yy of [4.3, 13.1]) urn(px, yy, 15)
  })

  // ---- the front stair and its cheek blocks
  const SY0 = -18.0, SY1 = -11.6, NS = 9
  for (let k = 0; k < NS; k++) {
    const y0 = SY0 + ((SY1 - SY0) * k) / NS, z1 = (3.3 * (k + 1)) / NS
    sbox(stone, -5.4, 6.4, y0, SY1, z1 - 3.3 / NS, z1)
  }
  for (const [x0, x1] of [[-7.5, -5.4], [6.4, 8.7]]) {
    abox(wall, x0, x1, -19.0, -11.4, 0, 3.3, stone)
    abox(stone, x0 + 0.2, x1 - 0.2, -18.8, -17.2, 3.3, 4.6, stone)
  }

  recentre([wall, stone, win, roof, door], 0.08, 4.87)
  const lit = (p: V3, n: V3) => (n[2] > 0.6 ? 0.2 : Math.max(0.3, 1 - p[2] / 22))
  save('seoul-seokjojeon', 'Seokjojeon', [
    { part: stone, material: { ...finish('seokjojeon-granite', 0xe8e2d5), floodlight: lit } },
    { part: wall, material: { ...finish('seokjojeon-wall', 0xd0cabd), floodlight: lit } },
    { part: win, material: PALETTE.window },
    { part: roof, material: { ...PALETTE.roof, color: 0xa7acb4 } },
    { part: door, material: { ...PALETTE.entrance, color: 0x8a7a5e } },
  ], 0, 17.6)
}

if (import.meta.main) build()
