/**
 * Christ Cathedral (the Crystal Cathedral, 1980, Philip Johnson and John
 * Burgee) and its Crean Tower (1990, Johnson), Garden Grove — procedural,
 * CC0-1.0.
 * bun generators/la-christ-cathedral.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0 (the long axis of OSM
 * way/29280620 runs within half a degree of east). The anchor is the
 * centre of the star, 0.4 m east and 2.4 m north of the batch's point. The
 * ground is flat (3DEP 39.4-40.1 m across the site), y = 0.
 *
 * What makes it the Crystal Cathedral: a four-pointed star in plan, long
 * east-west, entirely of reflective glass on a white space frame, so it
 * reads silver; sheer walls with sharp prows at the long arms' tips; a
 * faceted glass roof rising from every eave to a 39 m ridge down the long
 * axis, with ridges falling from the centre to the two short arms' tips,
 * which is what makes the roofline fold and the whole read as a crystal; the 90-foot doors in the east prow between two pale lattice
 * frames; and the Crean Tower beside it, a slender spire of polished steel
 * prisms with a jagged crown, nearly twice the cathedral's height.
 *
 * This is Orange County, outside the LA County lidar, and 3DEP point clouds
 * can't be read here, so heights are published or estimated from photos.
 *
 * Sources:
 * - Plan: OSM way/29280620 (the star: tips 128 m apart east-west and 63 m
 *   north-south, the re-entrant corners 29 m apart north-south and 50 m
 *   east-west; drawn here symmetric about both axes, which it is to within
 *   a metre) and way/120714044 (the Crean Tower, a 9 x 9.6 m footprint
 *   north-west of the north tip). USGS NAIP orthophoto: the roof as four
 *   planes, a band over the long arms that shades evenly (flat), the north
 *   arm's roof dark (falling to the north) and the south arm's bright
 *   (falling to the south, toward the sun), and the tower's place.
 * - Published (Wikipedia, "Christ Cathedral (Garden Grove, California)",
 *   and "Crean Tower"): 415 x 207 x 128 ft (126.5 x 63 x 39 m); over 10,000
 *   panes of glass; 90 ft (27 m) motorised doors; Crean Tower 236 ft
 *   (72 m), polished stainless-steel prisms. OSM: 40 m and 73 m.
 * - Photos (Wikimedia Commons): "Crystal Cathedral (6266638898)" and
 *   "(6266110435)" (Christliches Medienmagazin pro, CC BY-SA 2.0; from the
 *   north-west, the tower in front: the north arm's roof falling from the
 *   flat top to its tip, which stands at about half the height), "Crystal
 *   Cathedral with Spire" and "Crystal Cathedral on edge" (Wattewyl, CC BY
 *   3.0; from the east: the long walls' flat tops, a re-entrant corner, the
 *   tower's crown), "Crystal Cathedral - ... August 1995 03" (Giorgio
 *   Galeotti, CC BY-SA 4.0; from the east: the east prow, its doors between
 *   the two lattice frames, the cross above), "2018 Christ Cathedral campus
 *   ... 01, 05" (Farragutful, CC BY-SA 4.0; from the west and south-west),
 *   "Crystal Cathedral (3348568229)" (Bert Kaufmann, CC BY 2.0), "Philip
 *   Johnson - Crystal Cathedral" (CC BY; from the south).
 * - Colour: mirror glass (photos), drawn as a pale silver-grey window
 *   variant (#c9d0d6) and the roof `glass` in silver-grey (#bcc5cc), with
 *   broad white `trim` bars on the ridges, eaves and corners for the space
 *   frame; the tower's polished steel near white round a darker core.
 * - Estimated: the roof's facets. The photos show the long walls' tops
 *   nearly level and NAIP shades the long arms' roof evenly, so the real
 *   roof there may be flatter than drawn; the long walls are drawn falling
 *   from 39 m at the prows to 31 m at the re-entrant corners, with the roof
 *   rising from them to the ridge, so the faceted form reads from above.
 *   The short arms' tip height (19 m, about half the roof, from
 *   two photos taken from opposite ends); the east prow cut to a 9 m face
 *   for the doors, and the frames' size (2.3 m wide, 27 m tall); the Crean
 *   Tower's prisms (four rings stepping in and up, to 30, 44, 56 and 65 m,
 *   and a needle to 72 m; 7.5 m across at the foot), from photos.
 * - Left out: the glass grid (fine lines), the cross, the low entrance
 *   porches, the reflecting pools.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'

const walls = new Part(), roofGlass = new Part(), trim = new Part()
const door = new Part(), steel = new Part(), core = new Part()

const H = 39 // the ridge, and the long arms' prows
const EAVE = 31 // the long walls' tops at the re-entrant corners
const TIP_Z = 19 // the short arms' tips
// The star, counter-clockwise from the east prow. The east tip is cut to a
// 9 m face for the doors and their frames.
const LONG = 64, SHORT = 31.5, RX = 24.8, RY = 14.5
const slope = RY / (LONG - RX)
const EF = LONG - 4.5 / slope // where the prow is 9 m wide
type P2 = [number, number, number] // x, y, top height
const STAR: P2[] = [
  [EF, -4.5, H], [EF, 4.5, H],
  [RX, RY, EAVE], [0, SHORT, TIP_Z], [-RX, RY, EAVE],
  [-LONG, 0, H],
  [-RX, -RY, EAVE], [0, -SHORT, TIP_Z], [RX, -RY, EAVE],
]

const v = (p: P2, z: number): V3 => [p[0], p[1], z]
const norm2 = (x: number, y: number) => { const l = Math.hypot(x, y); return [x / l, y / l] }

// Walls: each side from the ground to its sloping top. Every wall top runs
// up to a point, so no wall is a plain box side.
for (let i = 0; i < STAR.length; i++) {
  const a = STAR[i], b = STAR[(i + 1) % STAR.length]
  walls.quad(v(a, 0), v(b, 0), v(b, b[2]), v(a, a[2]))
}

// Roof: faceted glass planes rising from every eave to a ridge along the
// long axis at 39 m, and to two ridges running from the centre down to the
// short arms' tips. Built for the north half and mirrored.
const roofTri = (a: V3, b: V3, c: V3) => {
  // wind it to face up
  const u = [b[0] - a[0], b[1] - a[1]], w = [c[0] - a[0], c[1] - a[1]]
  if (u[0] * w[1] - u[1] * w[0] >= 0) roofGlass.tri(a, b, c)
  else roofGlass.tri(a, c, b)
}
for (const sy of [1, -1]) {
  const P = (x: number, y: number, z: number): V3 => [x, y * sy, z]
  const prow = P(EF, 4.5, H), ne = P(RX, RY, EAVE), tip = P(0, SHORT, TIP_Z), nw = P(-RX, RY, EAVE)
  const rE = P(EF, 0, H), rRX = P(RX, 0, H), r0 = P(0, 0, H), rNX = P(-RX, 0, H), wTip = P(-LONG, 0, H)
  roofTri(rE, prow, ne); roofTri(rE, ne, rRX)
  roofTri(rRX, ne, r0); roofTri(r0, ne, tip)
  roofTri(r0, tip, nw); roofTri(r0, nw, rNX)
  roofTri(rNX, nw, wTip)
}

// Trim: the white space frame where it shows from afar. Broad bars along
// the ridges, posts at every corner, and a band along every eave.
/** A square bar `t` across between two points. */
function barT(a: V3, b: V3, t: number) {
  const d = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], l = Math.hypot(d[0], d[1], d[2])
  const dn = d.map(x => x / l)
  let s = [-dn[1], dn[0], 0]; const sl = Math.hypot(s[0], s[1])
  s = sl < 1e-6 ? [1, 0, 0] : [s[0] / sl, s[1] / sl, 0]
  const u = [dn[1] * s[2] - dn[2] * s[1], dn[2] * s[0] - dn[0] * s[2], dn[0] * s[1] - dn[1] * s[0]]
  const h = t / 2
  const ring = (p: V3) => [[-h, -h], [h, -h], [h, h], [-h, h]].map(([i, j]) => [p[0] + s[0] * i + u[0] * j, p[1] + s[1] * i + u[1] * j, p[2] + s[2] * i + u[2] * j] as V3)
  const A = ring(a), B = ring(b)
  for (let i = 0; i < 4; i++) { const j = (i + 1) % 4; trim.quad(A[i], A[j], B[j], B[i]) }
  trim.quad(A[3], A[2], A[1], A[0]); trim.quad(B[0], B[1], B[2], B[3])
}
{
  const t = 1.1
  barT([-LONG + 0.6, 0, H], [EF, 0, H], t) // the long ridge
  barT([0, 0, H], [0, SHORT - 0.6, TIP_Z], t) // the short arms' ridges
  barT([0, 0, H], [0, -SHORT + 0.6, TIP_Z], t)
  for (const p of STAR) barT([p[0], p[1], 0], [p[0], p[1], p[2]], t) // corner posts
  for (let i = 0; i < STAR.length; i++) { // eaves
    const a = STAR[i], b = STAR[(i + 1) % STAR.length]
    barT([a[0], a[1], a[2]], [b[0], b[1], b[2]], 0.9)
  }
}

// The east prow: the doors between two lattice frames standing proud of it.
{
  const x = EF + 0.05
  door.quad([x, -2.0, 0], [x, 2.0, 0], [x, 2.0, 25], [x, -2.0, 25])
  const box = (x0: number, x1: number, y0: number, y1: number, z1: number) => {
    const p = (X: number, Y: number, Z: number): V3 => [X, Y, Z]
    trim.quad(p(x1, y0, 0), p(x1, y1, 0), p(x1, y1, z1), p(x1, y0, z1))
    trim.quad(p(x0, y0, 0), p(x1, y0, 0), p(x1, y0, z1), p(x0, y0, z1))
    trim.quad(p(x1, y1, 0), p(x0, y1, 0), p(x0, y1, z1), p(x1, y1, z1))
    trim.quad(p(x0, y0, z1), p(x1, y0, z1), p(x1, y1, z1), p(x0, y1, z1))
  }
  box(EF - 0.2, EF + 1.2, 2.0, 4.3, 27)
  box(EF - 0.2, EF + 1.2, -4.3, -2.0, 27)
}

// ---------------------------------------------------------------------------
// The Crean Tower (OSM way/120714044's centre, from the anchor): mirrored
// steel prisms in four tiers, each ring inside and taller than the last,
// round a dark core, up to a needle at 72 m.
const TX = -31.9, TY = 37.2
{
  const oct = (r: number, z: number) => Array.from({ length: 8 }, (_, i) => {
    const a = (Math.PI / 8) + (i * Math.PI) / 4
    return [TX + r * Math.cos(a), TY + r * Math.sin(a), z] as V3
  })
  core.loft([oct(2.4, 0), oct(1.9, 30), oct(1.3, 46), oct(0.7, 60)])
  core.cap(oct(0.7, 60), true)

  // A prism: a triangular section pointing outward at angle `a`, standing
  // at radius r from the ground to `h`, with a pointed top.
  const prism = (a: number, r: number, h: number, w: number) => {
    const c = Math.cos(a), s = Math.sin(a)
    const sec = (z: number): V3[] => {
      const cx = TX + r * c, cy = TY + r * s
      return [
        [cx + c * w * 0.55, cy + s * w * 0.55, z],
        [cx - s * w / 2 - c * w * 0.3, cy + c * w / 2 - s * w * 0.3, z],
        [cx + s * w / 2 - c * w * 0.3, cy - c * w / 2 - s * w * 0.3, z],
      ]
    }
    const shoulder = h - 3.5 * w
    const t = sec(shoulder)
    steel.loft([sec(0), t])
    const apex: V3 = [TX + r * c, TY + r * s, h]
    for (let i = 0; i < 3; i++) steel.tri(t[i], t[(i + 1) % 3], apex)
  }
  const TIERS: [number, number, number, number][] = [ // radius, top, count, width
    [3.0, 30, 12, 1.4], [2.3, 44, 10, 1.3], [1.6, 56, 8, 1.15], [0.9, 65, 6, 1.0],
  ]
  TIERS.forEach(([r, h, n, w], k) => {
    for (let i = 0; i < n; i++) prism((2 * Math.PI * (i + 0.5 * (k % 2))) / n, r, h, w)
  })
  prism(0, 0.01, 72, 1.3)
}

const parts = [
  { part: walls, material: windowVariant(2, 0xc9d0d6) },
  { part: roofGlass, material: { ...PALETTE.glass, color: 0xbcc5cc } },
  { part: trim, material: PALETTE.trim },
  { part: door, material: PALETTE.window }, // the doorway reads dark between its frames
  { part: steel, material: finish('crean-steel', 0xd8dde1, 0.4) },
  { part: core, material: finish('crean-core', 0x858e96) },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
for (const { part, material } of parts) console.log(material.name.padEnd(14), part.triangles)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Christ Cathedral', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  bearing: 0, osm: 'way/29280620 way/120714044',
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/la-christ-cathedral.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
