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
 * reads silvery-light; sheer walls with sharp prows at the long arms' tips;
 * a flat glass roof over the long arms at full height, and the two short
 * arms' roofs sloping down to their tips, which is what makes the roofline
 * fold; the 90-foot doors in the east prow between two pale lattice
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
 * - Colour: mirror glass reflecting sky (photos), drawn as the lighter
 *   window variant (sky grey-blue) so it reads light, with pale `trim`
 *   lines at the corners and the eaves for the white frame; the roof glass
 *   `glass`; the tower's polished steel near white.
 * - Estimated: the short arms' tip height (19 m, about half the roof, from
 *   two photos taken from opposite ends); the east prow cut to a 9 m face
 *   for the doors, and the frames' size (2.3 m wide, 27 m tall); the Crean
 *   Tower's prisms (a ring of twelve round a core, an inner ring of six and
 *   a central needle, staggered to make the crown; the shaft 9-10 m across
 *   and nearly straight to about 46 m), from photos and OSM's footprint.
 * - Left out: the glass grid (fine lines), the cross, the low entrance
 *   porches, the reflecting pools.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'

const walls = new Part(), roofGlass = new Part(), trim = new Part()
const door = new Part(), steel = new Part(), core = new Part()

const H = 39 // the flat roof over the long arms
const TIP_Z = 19 // the short arms' tips
// The star, counter-clockwise from the east prow. The east tip is cut to a
// 9 m face for the doors and their frames.
const LONG = 64, SHORT = 31.5, RX = 24.8, RY = 14.5
const slope = RY / (LONG - RX)
const EF = LONG - 4.5 / slope // where the prow is 9 m wide
type P2 = [number, number, number] // x, y, top height
const STAR: P2[] = [
  [EF, -4.5, H], [EF, 4.5, H],
  [RX, RY, H], [0, SHORT, TIP_Z], [-RX, RY, H],
  [-LONG, 0, H],
  [-RX, -RY, H], [0, -SHORT, TIP_Z], [RX, -RY, H],
]

const v = (p: P2, z: number): V3 => [p[0], p[1], z]
const norm2 = (x: number, y: number) => { const l = Math.hypot(x, y); return [x / l, y / l] }

// Walls: each side from the ground to its (possibly sloping) top.
for (let i = 0; i < STAR.length; i++) {
  const a = STAR[i], b = STAR[(i + 1) % STAR.length]
  walls.quad(v(a, 0), v(b, 0), v(b, b[2]), v(a, a[2]))
}

// Roof: the flat band over the long arms, and the two sloping short-arm
// roofs. The band is the hexagon prow - NE - (W tip) - SW... split in two
// convex halves at x = 0 (fans from the centre).
{
  const C: V3 = [0, 0, H]
  const band = [[EF, -4.5], [EF, 4.5], [RX, RY], [-RX, RY], [-LONG, 0], [-RX, -RY], [RX, -RY]]
  for (let i = 0; i < band.length; i++) {
    const a = band[i], b = band[(i + 1) % band.length]
    roofGlass.tri(C, [a[0], a[1], H], [b[0], b[1], H])
  }
  roofGlass.tri([RX, RY, H], [0, SHORT, TIP_Z], [-RX, RY, H])
  roofGlass.tri([-RX, -RY, H], [0, -SHORT, TIP_Z], [RX, -RY, H])
}

// Trim: the white frame where it shows from afar. A band along every eave
// and a post at every corner, set 5 cm proud of the glass.
{
  const off = 0.05, band = 0.7, post = 0.8
  for (let i = 0; i < STAR.length; i++) {
    const a = STAR[i], b = STAR[(i + 1) % STAR.length]
    const [dx, dy] = norm2(b[0] - a[0], b[1] - a[1])
    const nx = dy * off, ny = -dx * off // outward (the star runs counter-clockwise)
    const A = (p: P2, along: number, z: number): V3 => [p[0] + nx + dx * along, p[1] + ny + dy * along, z]
    // eave band, following the top
    trim.quad(A(a, 0, a[2] - band), A(b, 0, b[2] - band), A(b, 0, b[2]), A(a, 0, a[2]))
    // corner posts, a strip at each end of this face
    trim.quad(A(a, 0, 0), A(a, post, 0), A(a, post, a[2] + (b[2] - a[2]) * post / Math.hypot(b[0] - a[0], b[1] - a[1])), A(a, 0, a[2]))
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    trim.quad(A(a, L - post, 0), A(a, L, 0), A(a, L, b[2]), A(a, L - post, a[2] + (b[2] - a[2]) * (L - post) / L))
  }
  // A rim on the roof's edge, so the eave reads as a white line from above.
  const rim = 0.6
  for (let i = 0; i < STAR.length; i++) {
    const a = STAR[i], b = STAR[(i + 1) % STAR.length]
    const [dx, dy] = norm2(b[0] - a[0], b[1] - a[1])
    const ix = -dy * rim, iy = dx * rim // inward
    trim.quad([a[0], a[1], a[2] + 0.06], [b[0], b[1], b[2] + 0.06], [b[0] + ix, b[1] + iy, b[2] + 0.06], [a[0] + ix, a[1] + iy, a[2] + 0.06])
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
// The Crean Tower (OSM way/120714044's centre, from the anchor).
const TX = -31.9, TY = 37.2
{
  // The core: a slim tapering octagon behind the prisms, the dark of the
  // open structure inside them.
  const oct = (r: number, z: number) => Array.from({ length: 8 }, (_, i) => {
    const a = (Math.PI / 8) + (i * Math.PI) / 4
    return [TX + r * Math.cos(a), TY + r * Math.sin(a), z] as V3
  })
  core.loft([oct(3.4, 0), oct(3.0, 50)])
  core.cap(oct(3.0, 50), true)

  // A prism: a triangular section pointing outward at angle `a`, from the
  // ground to `h`, leaning in from radius r0 to r1, with a pointed top.
  const prism = (a: number, r0: number, r1: number, h: number, w: number) => {
    const c = Math.cos(a), s = Math.sin(a)
    const sec = (r: number, z: number): V3[] => {
      const cx = TX + r * c, cy = TY + r * s
      return [
        [cx + c * w * 0.55, cy + s * w * 0.55, z],
        [cx - s * w / 2 - c * w * 0.3, cy + c * w / 2 - s * w * 0.3, z],
        [cx + s * w / 2 - c * w * 0.3, cy - c * w / 2 - s * w * 0.3, z],
      ]
    }
    const tipZ = h, shoulder = h - 3.5
    const rs = r0 + (r1 - r0) * (shoulder / h)
    const b = sec(r0, 0), t = sec(rs, shoulder)
    steel.loft([b, t])
    const apex: V3 = [TX + r1 * c, TY + r1 * s, tipZ]
    for (let i = 0; i < 3; i++) steel.tri(t[i], t[(i + 1) % 3], apex)
  }
  // Outer ring of twelve, alternating heights; an inner ring of six; and
  // the needle. The tallest stand in the middle, so the crown steps up.
  // The shaft barely tapers (photos); the crown is the prisms' staggered
  // tips, from 46 m at the rim up to the needle at 72 m.
  const OUTER = [46, 53, 49, 57]
  for (let i = 0; i < 12; i++) prism((i * Math.PI) / 6, 4.3, 3.9, OUTER[i % 4], 1.7)
  for (let i = 0; i < 6; i++) prism((i * Math.PI) / 3 + Math.PI / 12, 2.4, 2.0, i % 2 ? 61 : 66, 1.8)
  prism(0, 0.01, 0.01, 72, 2.0)
}

const parts = [
  { part: walls, material: windowVariant(2, 0xaec2d2) },
  { part: roofGlass, material: PALETTE.glass },
  { part: trim, material: PALETTE.trim },
  { part: door, material: PALETTE.window }, // the doorway reads dark between its frames
  { part: steel, material: finish('crean-steel', 0xdfe3e6, 0.4) },
  { part: core, material: PALETTE.roof },
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
