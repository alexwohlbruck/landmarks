/**
 * Harbour Centre (Vancouver Lookout), 555 West Hastings Street, Vancouver:
 * procedural, CC0-1.0, no textures.
 *   bun generators/van-harbour-centre.ts
 *
 * One model for the office tower, its podium and the Lookout: the "flying
 * saucer" on top is the tower's own crown, reached by the glass elevators
 * on the Hastings face.
 *
 * Map frame: x east', y north', z up, metres, turned to bearing 45 (the
 * downtown street grid; OSM edges run at 45.0 / 135.0). +y runs north-east
 * toward Cordova Street and the harbour, -y south-west to Hastings Street.
 * Anchor: the area centroid of OSM way/139571552 (the office outline),
 * lng -123.1120691, lat 49.2847810. Elevation 0.
 *
 * Identity: the Lookout's saucer (pale rings between two outward-leaning
 * dark glazed bands, a shallow cone underneath, the faceted drum on the
 * roof), the white antenna with its three discs, the external elevator
 * shaft running up the middle of the Hastings face into the saucer, the
 * saucer offset over that face, and the square beige precast tower with its
 * punched windows.
 *
 * Evidence
 *  - OSM (ODbL): way/139571552 (office outline) and way/1371268997 (the
 *    "Harbour Centre" outline over this and the SFU building); tower
 *    way/363385368 (a 35.3 m square here, x -17.6..17.7, y -19.9..15.4);
 *    the saucer's tiers way/363433260, 363433261, 363385371, 363385373 (a
 *    19-sided ring, r 19.5 at its widest), the stem way/363385369, the
 *    shaft way/363385948 (9.3 x 2.4 m on the Hastings face), the antenna
 *    way/363433262 (and 363433263-265), whose node puts the saucer's axis
 *    at (0.25, -15.2): 4.7 m inside the Hastings face, so the saucer
 *    overhangs Hastings by about 15 m. Podium parts way/363433251-259 and
 *    way/363434528, 363434602 (heights 13, 16, 26, 31).
 *  - City of Vancouver building-footprints-2009 (City 2009 lidar; Contains
 *    information licensed under the Open Government Licence - Vancouver),
 *    bldgid 148973, elevations above sea level: tower roof 122.5 (a
 *    penthouse 126.6), saucer roof 151.0 (its footprint r 19.5 about the
 *    same axis), drum 158.3, podium roof 38.6, ground 14.0-17.1.
 *  - Mapterhorn terrain: the lowest ground under the footprint is about
 *    12.4 m (Cordova side, north-east); Hastings is about 7 m higher.
 *    Heights below are above that (y = 0), from the lidar:
 *    podium 26.2 (OSM 26), tower roof 110.5, saucer roof 138.6, drum
 *    145.9. Published (Wikipedia "Harbour Centre"): 146.9 m to the
 *    Lookout's roof, which matches the drum, and 177 m to the antenna tip,
 *    used for the antenna.
 *  - The saucer's section, measured row by row from DD30 (below) cropped
 *    at 19 px/m against the 39 m diameter: rim 2.5 m at r 19.5; upper
 *    glazing 3.7 m leaning out from r 17.0 to 19.3; middle ring 1.8 m at
 *    r 17.0; lower glazing 2.4 m from r 15.0 to 16.8; bottom ring 2.5 m at
 *    r 15.0; the underside cone 3.7 m in to the stem; the drum r 9.2,
 *    7.3 m (lidar). Antenna discs 5.5, 15 and 21.5 m over the drum
 *    (DD30), r 1.8 (r1860).
 *  - Photos (Wikimedia Commons, EVIDENCE):
 *    - DD30: Diego Delso, "Harbour Centre, Vancouver, Canadá, 2017-08-14,
 *      DD 30.jpg", CC BY-SA 4.0 (from the north, telephoto: the section).
 *      https://commons.wikimedia.org/wiki/File:Harbour_Centre,_Vancouver,_Canad%C3%A1,_2017-08-14,_DD_30.jpg
 *    - r1860, r1840: Dietmar Rabich, "Vancouver (BC, Canada), Harbour
 *      Centre -- 2022 -- 1860.jpg" and "-- 1840.jpg", CC BY-SA 4.0
 *      (close-ups of the saucer, antenna, precast grid).
 *      https://commons.wikimedia.org/wiki/File:Vancouver_(BC,_Canada),_Harbour_Centre_--_2022_--_1860.jpg
 *      https://commons.wikimedia.org/wiki/File:Vancouver_(BC,_Canada),_Harbour_Centre_--_2022_--_1840.jpg
 *    - herrera: David Herrera, "Vancouver Lookout, Harbour Centre.jpg",
 *      CC BY 2.0 (from Hastings: the elevator shaft, the stem's brackets).
 *      https://commons.wikimedia.org/wiki/File:Vancouver_Lookout,_Harbour_Centre.jpg
 *    - mabel: Joe Mabel, "Vancouver - Harbour Centre 01.jpg", CC BY-SA 3.0.
 *      https://commons.wikimedia.org/wiki/File:Vancouver_-_Harbour_Centre_01.jpg
 *  No commercial imagery.
 *
 * Estimated, and doubts:
 *  - Facade: 9 bays a face (photos), panels grouped over two floors of
 *    about 3.5 m; the real wall is an even grid of punched windows.
 *  - The stem above the roof (a 12.5 x 11.4 m core and four wedge
 *    brackets) and the shaft's two glazed lanes are read from herrera.
 *  - The podium has no good licensed photo: walls plain beige with
 *    grouped window bands, its glazed north slope (way/363433253) read
 *    from DD30. The shaft starts on the Hastings entrance block (16 m).
 *  - Signage ("Harbour Centre", logos), rooftop dishes and the flag left out.
 *  - SFU Harbour Centre (way/143682595, the 1925 Spencer's store, with its
 *    parts) is a separate building and is not drawn.
 *  - Night: the Lookout's glazed bands and the tower's windows are
 *    `window`; the saucer and drum are floodlit.
 */
import { Part, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { block, cap, inset, lathe, panel, rect, walls, area, type XY } from './chi-aon-center'

export const BEARING = 45
export const ANCHOR = { lng: -123.1120691, lat: 49.284781 }

const ccw = (r: XY[]) => (area(r) < 0 ? [...r].reverse() : r)

// OSM parts in the turned frame (rounded to 0.1 m)
const OUTLINE: XY[] = [[-23.4, 12.9], [-23.7, -12.7], [-23.9, -22.9], [-17.5, -22.8], [-25.9, -31.2], [-27.1, -32.3], [-25.8, -33.7], [-19.0, -40.7], [-17.1, -38.9], [-17.1, -40.5], [17.6, -40.2], [17.6, -38.9], [18.8, -37.7], [21.2, -37.7], [22.5, -38.7], [23.4, -38.6], [23.4, 39.3], [17.8, 39.3], [17.7, 40.5], [-17.6, 40.3], [-17.7, 38.8], [-23.0, 38.8]]
const P251: XY[] = [[23.3, 39.3], [17.8, 39.3], [17.7, 40.5], [-17.6, 40.3], [-17.7, 38.8], [-23.0, 38.8], [-23.2, 31.0], [-23.4, 12.9], [-23.7, -12.7], [-20.9, -12.7], [-21.0, -19.9], [-17.7, -19.8], [-17.6, 14.9], [17.7, 15.4], [17.4, -19.9], [23.4, -19.9], [23.4, 35.5]]
const P252: XY[] = [[-23.1, 35.4], [23.4, 35.5], [23.4, 28.9], [17.5, 28.8], [17.6, 21.9], [-18.4, 21.6], [-18.2, 30.8], [-23.2, 31.0]]
const P254: XY[] = [[-17.5, -22.8], [-17.4, -26.1], [-17.1, -38.9], [-19.0, -40.7], [-25.8, -33.7], [-27.1, -32.3], [-25.9, -31.2]]
const P255: XY[] = [[-17.7, -19.8], [-17.4, -26.1], [-4.4, -26.0], [-4.4, -19.9]]
const P256: XY[] = [[17.4, -19.9], [17.4, -26.1], [4.9, -26.1], [4.9, -19.9]]
const P257: XY[] = [[-4.4, -22.2], [-4.4, -26.0], [-4.0, -40.3], [5.0, -40.2], [4.9, -26.1], [4.9, -22.3]]
const P258: XY[] = [[-17.4, -26.1], [-17.1, -40.5], [-4.0, -40.3], [-4.4, -26.0]]
const P259: XY[] = [[4.9, -26.1], [5.0, -40.2], [17.6, -40.2], [17.4, -26.1]]
const P528: XY[] = [[-20.9, -12.7], [-23.7, -12.7], [-23.9, -22.9], [-17.5, -22.8], [-17.7, -19.8], [-21.0, -19.9]]
const P602: XY[] = [[17.6, -38.9], [18.8, -37.7], [21.2, -37.7], [22.5, -38.7], [23.4, -38.6], [23.4, -19.9], [17.4, -19.9], [17.4, -26.1]]

const TX0 = -17.6, TX1 = 17.7, TY0 = -19.9, TY1 = 15.4 // the tower
const AX: XY = [0.25, -15.2] // the saucer's axis
const Z_POD = 26.2, Z_TOWER = 110.5, Z_SAUCER = 138.6, Z_DRUM = 145.9, Z_TIP = 177
const SEG = 20

/** Ground above y = 0 along the site (Mapterhorn; it rises toward Hastings, -y). */
const ground = (y: number) => Math.max(0.6, 3.1 - 0.075 * y)

function build() {
  const pre = new Part(), win = new Part(), roof = new Part(), glass = new Part(), white = new Part(), door = new Part()

  // ---- podium -------------------------------------------------------------
  const parts: [XY[], number][] = [[P251, Z_POD], [P255, Z_POD], [P256, Z_POD], [P258, Z_POD], [P259, Z_POD], [P257, 16], [P254, 13], [P528, 13], [P602, 13]]
  for (const [r, h] of parts) block(pre, roof, ccw(r), 0, h, 0.4)
  block(pre, roof, ccw(P252), Z_POD - 0.5, 31, 0.4)
  // the glazed north slope (way/363433253): from the raised block down to the Cordova edge
  {
    const n = ccw([[-23.0, 35.4], [23.4, 35.5], [23.3, 39.3], [17.8, 39.3], [17.7, 40.5], [-17.6, 40.3], [-17.7, 38.8], [-23.0, 38.8]] as XY[])
    walls(pre, n, 0, 24)
    cap(roof, n, 24)
    const zs = (y: number) => 31 - ((y - 35.4) / (39.3 - 35.4)) * 6.5
    const a: V3 = [-23.0, 35.4, 31], b: V3 = [23.4, 35.4, 31], c: V3 = [23.4, 39.3, zs(39.3)], d: V3 = [-23.0, 39.3, zs(39.3)]
    glass.quad(d, c, b, a)
    glass.quad(a, b, c, d)
    pre.tri([-23.0, 35.4, 24], [-23.0, 39.3, 24], d) // end walls
    pre.tri([-23.0, 35.4, 24], d, a)
    pre.tri([23.4, 39.3, 24], [23.4, 35.4, 24], b)
    pre.tri([23.4, 39.3, 24], b, c)
  }
  // grouped window bands on the podium's street walls (not the SFU party wall at x = 23.4)
  const onOutline = (a: XY, b: XY) => {
    const near = (p: XY) => OUTLINE.some((q, i) => {
      const r = OUTLINE[(i + 1) % OUTLINE.length]
      const L = Math.hypot(r[0] - q[0], r[1] - q[1]), t = Math.max(0, Math.min(1, ((p[0] - q[0]) * (r[0] - q[0]) + (p[1] - q[1]) * (r[1] - q[1])) / (L * L)))
      return Math.hypot(q[0] + t * (r[0] - q[0]) - p[0], q[1] + t * (r[1] - q[1]) - p[1]) < 0.4
    })
    return near(a) && near(b) && !(a[0] > 23 && b[0] > 23)
  }
  for (const [r0, h] of [...parts, [[[-23.0, 35.4], [23.4, 35.5], [23.3, 39.3], [17.8, 39.3], [17.7, 40.5], [-17.6, 40.3], [-17.7, 38.8], [-23.0, 38.8]] as XY[], 24] as [XY[], number]]) {
    const r = ccw(r0)
    for (let i = 0; i < r.length; i++) {
      const a = r[i], b = r[(i + 1) % r.length]
      const L = Math.hypot(b[0] - a[0], b[1] - a[1])
      if (L < 6 || !onOutline(a, b)) continue
      const g = Math.max(ground(a[1]), ground(b[1]))
      const z0 = g + 4.5, top = h - 1.6
      if (top - z0 < 3) continue
      const nRow = Math.max(1, Math.round((top - z0) / 7.5))
      const k = Math.max(1, Math.round((L - 2 + 1.4) / (3.6 + 1.4))), w = (L - 2 - (k - 1) * 1.4) / k
      for (let q = 0; q < k; q++)
        for (let j = 0; j < nRow; j++) {
          const za = z0 + ((top - z0) * j) / nRow + 0.6, zb = z0 + ((top - z0) * (j + 1)) / nRow - 0.6
          panel(win, a, b, 1 + q * (w + 1.4), 1 + q * (w + 1.4) + w, za, zb, 0.05)
        }
    }
  }
  // the Hastings entrance under the shaft
  panel(door, [-4.0, -40.3], [5.0, -40.2], 1.5, 7.5, ground(-40.3) + 0.1, ground(-40.3) + 4.2, 0.06)

  // ---- tower --------------------------------------------------------------
  const T = rect(TX0, TY0, TX1, TY1)
  block(pre, roof, T, 20, Z_TOWER, 0.5)
  // punched windows grouped two floors a panel, 9 bays a face; the shaft's
  // bays on the Hastings face are left plain
  const floors = 24, f0 = Z_POD + 1.2, fh = (Z_TOWER - 2.6 - f0) / floors
  for (let i = 0; i < 4; i++) {
    const a = T[i], b = T[(i + 1) % 4]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), bay = L / 9
    for (let q = 0; q < 9; q++) {
      const s0 = q * bay + 0.95, s1 = (q + 1) * bay - 0.95
      if (i === 0) { const x0 = a[0] + s0, x1 = a[0] + s1; if (x1 > -4.5 && x0 < 5.0) continue }
      for (let f = 0; f < floors; f += 2) panel(win, a, b, s0, s1, f0 + f * fh + 0.7, f0 + (f + 2) * fh - 0.7, 0.05)
    }
  }

  // ---- the elevator shaft on the Hastings face ------------------------------
  const SH = ccw(rect(-4.4, -22.3, 4.9, TY0 + 0.2))
  block(pre, roof, SH, 15.5, 123.5, 0)
  // two glazed lanes between pale pilasters, on its outer face
  for (const [s0, s1] of [[0.8, 4.3], [5.0, 8.5]]) panel(win, [-4.4, -22.3], [4.9, -22.3], s0, s1, 17, 121.5, 0.05)

  // ---- the stem: a core and four wedge brackets under the saucer ----------
  block(pre, null, ccw(rect(-7.3, TY0, 7.8, -7.6)), Z_TOWER - 0.5, 123.5, 0)
  for (const deg of [45, 135, 225, 315]) {
    const t = (deg * Math.PI) / 180, u: XY = [Math.cos(t), Math.sin(t)], v: XY = [-u[1], u[0]]
    const P = (r: number, z: number, s: number): V3 => [AX[0] + u[0] * r + v[0] * s, AX[1] + u[1] * r + v[1] * s, z]
    const w = 1.2, r0 = 7.5, r1 = 14.5
    const prof: [number, number][] = [[r0, Z_TOWER + 1.5], [r1, 124.6], [r0, 124.6]] // a triangle in the radial plane
    if (deg === 225 || deg === 315) prof[0] = [r0, 116] // over the Hastings face the brackets start higher (no roof under them)
    const A = prof.map(([r, z]) => P(r, z, -w)), B = prof.map(([r, z]) => P(r, z, w))
    pre.tri(A[0], A[2], A[1]); pre.tri(B[0], B[1], B[2])
    for (let k = 0; k < 3; k++) { const l = (k + 1) % 3; pre.quad(A[k], A[l], B[l], B[k]) }
  }

  // ---- the saucer ----------------------------------------------------------
  const ring = (p: Part, a: XY, b: XY) => lathe(p, AX[0], AY, [a, b], SEG, Math.PI / SEG)
  const AY = AX[1]
  ring(pre, [7.5, 119.0], [15.0, 125.7]) // the underside cone
  ring(pre, [15.0, 125.7], [15.0, 128.2]) // bottom ring
  ring(win, [15.0, 128.2], [16.8, 130.6]) // lower glazing, leaning out
  ring(pre, [16.8, 130.6], [17.0, 130.6])
  ring(pre, [17.0, 130.6], [17.0, 132.4]) // middle ring
  ring(win, [17.0, 132.4], [19.3, 136.1]) // upper glazing
  ring(pre, [19.3, 136.1], [19.5, 136.1])
  ring(pre, [19.5, 136.1], [19.5, Z_SAUCER]) // the rim
  ring(pre, [19.5, Z_SAUCER], [19.0, Z_SAUCER + 0.4]) // its lip
  ring(roof, [19.0, Z_SAUCER + 0.4], [9.2, Z_SAUCER]) // the roof deck
  // the drum, faceted
  lathe(pre, AX[0], AY, [[9.2, Z_SAUCER], [9.2, Z_DRUM - 0.6]], 16, 0)
  lathe(pre, AX[0], AY, [[9.2, Z_DRUM - 0.6], [8.8, Z_DRUM]], 16, 0)
  lathe(roof, AX[0], AY, [[8.8, Z_DRUM], [0, Z_DRUM]], 16, 0)

  // ---- the antenna with its three discs -------------------------------------
  const rod = (r0: number, r1: number, z0: number, z1: number, seg = 8) => {
    lathe(white, AX[0], AY, [[r0, z0], [r1, z1]], seg)
  }
  rod(1.1, 0.9, Z_DRUM, Z_DRUM + 3)
  lathe(white, AX[0], AY, [[0.9, Z_DRUM + 3], [0.5, Z_DRUM + 3]], 8)
  rod(0.5, 0.35, Z_DRUM + 3, Z_TIP)
  lathe(white, AX[0], AY, [[0.35, Z_TIP], [0, Z_TIP]], 8)
  for (const dz of [5.5, 15, 21.5]) {
    const z = Z_DRUM + dz
    lathe(white, AX[0], AY, [[0.5, z - 0.5], [1.8, z - 0.5]], 12)
    rod(1.8, 1.8, z - 0.5, z + 0.5, 12)
    lathe(white, AX[0], AY, [[1.8, z + 0.5], [0.5, z + 0.5]], 12)
  }

  const lit = (p: V3, n: V3) => (p[2] > 121 ? (n[2] < -0.3 ? 0.35 : 0.7) : 0)
  return [
    { part: pre, material: { ...finish('harbour-precast', 0xd9ccb5), floodlight: lit } as MaterialSpec },
    { part: win, material: PALETTE.window as MaterialSpec },
    { part: roof, material: PALETTE.roof as MaterialSpec },
    { part: glass, material: PALETTE.glass as MaterialSpec },
    { part: white, material: { ...finish('antenna-white', 0xf1efea), floodlight: () => 0.5 } as MaterialSpec },
    { part: door, material: PALETTE.entrance as MaterialSpec },
  ]
}

if (import.meta.main) {
  const parts = build().filter((x) => x.part.triangles > 0)
  const tris = parts.reduce((s, x) => s + x.part.triangles, 0)
  const glb = writeGlb('Harbour Centre (Vancouver Lookout)', parts, { frame: 'Y up, -Z north, +X east; metres; ground anchor', anchor: [ANCHOR.lat, ANCHOR.lng], bearing: BEARING })
  if (tris > 6500 || glb.length > 250_000) throw new Error(`budget: ${tris} triangles / ${glb.length} bytes`)
  const out = new URL('../models/van-harbour-centre.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${tris} triangles, ${glb.length} bytes`)
}
