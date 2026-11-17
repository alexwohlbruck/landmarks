/**
 * The Carter Center / Jimmy Carter Presidential Library and Museum (1986,
 * Jova/Daniels/Busby with Lawton/Umemura/Yamamoto), Atlanta: procedural,
 * CC0-1.0.
 * bun generators/atl-carter-center.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres, bearing 0. Origin: the area
 * centroid of OSM way/29094121 (-84.3569535, 33.7669847), which outlines the
 * whole complex as one building: four linked circular pavilions on the
 * hill's crest (the Carter Center's offices and conference rooms, from
 * north-east to south-west), the entrance court with its colonnades, a
 * covered walk curving south-east, and the big round Library and Museum.
 * y = 0 is the lowest ground under the footprint, west of the
 * south-western pavilion (lidar ground about 304.9 m). The hill rises 6 to
 * 11 m to the other pavilions and the library's east side.
 *
 * Form: low drums of pale precast concrete: a deep plain fascia over a band
 * of dark glass set between square concrete columns, under flat or very low
 * conical roofs; two pavilions carry a round clerestory lantern and a ring
 * of sloped skylight on their south side; the Library and Museum is the
 * largest drum, flat-roofed with a parapet. The entrance pavilion has a
 * low hipped standing-seam roof over its portico ("CARTER PRESIDENTIAL
 * CENTER" on the frieze, not modelled), flanked by flat-roofed colonnades
 * along the court.
 *
 * Sources
 * - OSM way/29094121 (outline, building=museum). It sits 2 to 4 m north-west
 *   of NAIP and the lidar; the drums are placed from both.
 * - USGS 3DEP lidar GA_Statewide_B3_2018 (2018 flight; GA_Statewide_B2_2018
 *   has a gap here), 1 m grid, roof heights above y = 0: north-east pavilion
 *   13.5 (lantern 15.1), the next 11.4, the next 9.2, the south-west one
 *   11.5 (lantern 15.4), the library 16.0 with an 18.4 parapet (measured).
 *   The site is heavily wooded; the roofs were read where they are clear of
 *   trees.
 * - USGS NAIP (public domain): the circles' plans, the white and grey
 *   roofs, the blue skylight rings, the court and walk.
 * - Photos (Wikimedia Commons, EVIDENCE):
 *   Marc Merlin, "Panorama of the Jimmy Carter Presidential Center viewed
 *     from the path behind it, May 2015.jpg", CC BY-SA 4.0 (a drum's glass
 *     band, columns and fascia);
 *   Marc Merlin, "Entrance to Jimmy Carter Presidential Center, May
 *     2015.jpg", CC BY-SA 4.0 (entrance pavilion, colonnades);
 *   Mojnsen, "Jimmy Carter Presidential Library and Museum.jpg", CC BY-SA
 *     4.0; Hansolo1021, "Jimmy Carter Presidential Library and Museum Front
 *     01.jpg", CC0; edward stojakovic, "Carter Presidential Library Entrance
 *     (8239013422).jpg", CC BY 2.0 (entrance, colour of the concrete and the
 *     metal roof).
 * Published: dedicated 1 October 1986 (Wikipedia).
 * Estimated: the fascia and glass band proportions (from Merlin's
 *   panorama), the column spacing, the entrance pavilion and colonnade sizes
 *   and heights (from the entrance photos), the walk's roof height.
 * Doubts: trees hide most of the complex in every open photo; the drums'
 *   other sides and the library's facade are drawn like the one drum
 *   photographed. Which parts of the court are roofed is read from NAIP.
 * Colour: warm pale concrete, dark glass, white membrane roofs (NAIP),
 *   grey low cones and the grey-green standing seam roof.
 * Night: glass bands glow (`window`); the skylights stay dark (`glass`).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, prism, rect, chamfer, lathe, disc, arc, finishGlb, writeModel } from './sea-tacoma-union-station'

function qf(part: Part, a: V3, b: V3, c: V3, d: V3, want: V3) {
  const u: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v: V3 = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  const n: V3 = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
  if (n[0] * want[0] + n[1] * want[1] + n[2] * want[2] >= 0) part.quad(a, b, c, d)
  else part.quad(d, c, b, a)
}
function box(wall: Part, top: Part | null, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, bevel = 0.2) {
  prism(wall, top, bevel > 0 ? chamfer(rect(x0, y0, x1, y1), bevel) : rect(x0, y0, x1, y1), z0, z1)
}
/** A prism over any convex-or-not ring, its walls on `wall` and its top on `top`. */
const slab = (wall: Part, top: Part | null, ring: XY[], z0: number, z1: number) => prism(wall, top, ring, z0, z1)

function build() {
  const conc = new Part(), trim = new Part(), win = new Part(), white = new Part(), grey = new Part(), glass = new Part()
  const SEG = 16

  /**
   * A drum: a glass band between square columns over the local ground `gl`,
   * a deep concrete fascia to `top`, and a roof: 'flat' (white membrane,
   * with a lantern and a south skylight ring) or 'cone' (grey, low).
   */
  const drum = (cx: number, cy: number, r: number, gl: number, top: number, roof: 'lantern' | 'cone' | 'flat', fascia = 3.0, sky = 270) => {
    const zf = top - fascia
    // the wall behind the glass, down to y = 0 so the uphill side sinks into the hill
    lathe(conc, cx, cy, [[r - 0.6, 0], [r - 0.6, zf]], SEG)
    // the glass band, set just in front of that wall
    lathe(win, cx, cy, [[r - 0.55, gl + 0.2], [r - 0.55, zf]], SEG)
    // a plinth up to the local ground, and the fascia
    lathe(conc, cx, cy, [[r, 0], [r, gl + 0.2], [r - 0.6, gl + 0.2]], SEG)
    lathe(conc, cx, cy, [[r - 0.6, zf], [r + 0.3, zf], [r + 0.3, top], [r, top]], SEG)
    // square columns at every segment, in front of the glass
    for (let k = 0; k < SEG; k++) {
      const a = ((k + 0.5) / SEG) * 2 * Math.PI, x = cx + (r - 0.3) * Math.cos(a), y = cy + (r - 0.3) * Math.sin(a)
      prism(trim, null, chamfer(rect(x - 0.4, y - 0.4, x + 0.4, y + 0.4), 0.1), gl + 0.2, zf)
    }
    if (roof === 'cone') {
      lathe(grey, cx, cy, [[r, top], [r * 0.12, top + r * 0.09], [0.01, top + r * 0.09]], SEG)
    } else {
      if (roof === 'lantern') {
        disc(white, cx, cy, r, top, SEG)
        // the round clerestory lantern
        lathe(conc, cx, cy, [[r * 0.3, top], [r * 0.3, top + 1.6]], SEG)
        lathe(glass, cx, cy, [[r * 0.3 + 0.03, top + 0.2], [r * 0.3 + 0.03, top + 1.3]], SEG)
        disc(white, cx, cy, r * 0.3, top + 1.6, SEG)
        // the sloped skylight ring on the south half
        for (let k = 0; k < SEG / 2; k++) {
          const s0 = ((sky - 90) * Math.PI) / 180, a0 = s0 + (k / (SEG / 2)) * Math.PI, a1 = s0 + ((k + 1) / (SEG / 2)) * Math.PI
          const P = (a: number, rr: number, z: number): V3 => [cx + rr * Math.cos(a), cy + rr * Math.sin(a), z]
          const ro = r * 0.86, ri = r * 0.62
          qf(glass, P(a0, ro, top + 0.05), P(a1, ro, top + 0.05), P(a1, ri, top + 1.2), P(a0, ri, top + 1.2), [Math.cos((a0 + a1) / 2), Math.sin((a0 + a1) / 2), 2])
          qf(white, P(a0, ri, top + 1.2), P(a1, ri, top + 1.2), P(a1, ri, top + 0.05), P(a0, ri, top + 0.05), [-Math.cos((a0 + a1) / 2), -Math.sin((a0 + a1) / 2), 0])
        }
      } else {
        // a grey roof with a round skylight in the middle, and a parapet ring
        disc(grey, cx, cy, r, top, SEG)
        lathe(glass, cx, cy, [[r * 0.22, top], [r * 0.18, top + 0.8], [0.01, top + 0.8]], SEG)
        lathe(conc, cx, cy, [[r + 0.3, top], [r + 0.3, top + 1.0], [r - 0.3, top + 1.0], [r - 0.3, top]], SEG)
      }
    }
  }

  // the four pavilions, north-east to south-west, and the Library and Museum
  drum(10.0, 58.0, 21.0, 6.5, 13.5, 'lantern', 3.0, 225)
  drum(-34.5, 55.0, 19.5, 4.6, 11.4, 'cone')
  drum(-67.0, 33.5, 20.0, 2.5, 9.2, 'cone', 2.6)
  drum(-86.5, -5.0, 20.0, 1.2, 11.5, 'lantern', 3.0, 270)
  drum(57.5, -72.5, 29.5, 3.4, 16.0, 'flat', 3.6)
  // low glazed links where the drums meet
  for (const [x0, y0, x1, y1, top] of [[-17, 49, -13, 63, 10.2], [-55, 38, -49, 48, 8.6], [-80, 10, -72, 18, 8.6]] as [number, number, number, number, number][]) {
    box(conc, white, x0, y0, x1, y1, 0, top, 0.15)
  }

  // ---- the entrance pavilion: portico and hipped standing-seam roof, at the court's north-west end
  {
    // the court runs south-east from the pavilion; build in a frame turned along it
    const ang = (-33 * Math.PI) / 180, ox = 52.5, oy = 31.0
    const T = (u: number, v: number): XY => [ox + u * Math.cos(ang) - v * Math.sin(ang), oy + u * Math.sin(ang) + v * Math.cos(ang)]
    const ring = (u0: number, v0: number, u1: number, v1: number) => [T(u0, v0), T(u1, v0), T(u1, v1), T(u0, v1)]
    const GL = 5.2, EAVE = GL + 4.4, TOPR = GL + 6.0
    slab(conc, null, ring(-11, -3, 11, 3), 0, EAVE)
    // the hipped roof
    const o = ring(-11.8, -3.8, 11.8, 3.8), i = ring(-8.5, -0.4, 8.5, 0.4)
    const out: V3[] = [[0, -1, 1], [1, 0, 1], [0, 1, 1], [-1, 0, 1]].map(([a, b, c]) => [a * Math.cos(ang) - b * Math.sin(ang), a * Math.sin(ang) + b * Math.cos(ang), c] as V3)
    for (let k = 0; k < 4; k++) qf(grey, [o[k][0], o[k][1], EAVE], [o[(k + 1) % 4][0], o[(k + 1) % 4][1], EAVE], [i[(k + 1) % 4][0], i[(k + 1) % 4][1], TOPR], [i[k][0], i[k][1], TOPR], out[k])
    grey.cap(i.map(([x, y]) => [x, y, TOPR] as V3), true)
    // the frieze band and the dark glazed entrance under it, facing the court (-v)
    slab(trim, null, ring(-10.6, -3.25, 10.6, -2.95), EAVE - 1.4, EAVE - 0.1)
    slab(win, null, ring(-4.0, -3.1, 4.0, -2.98), GL, EAVE - 1.6)
    // two portico columns
    for (const u of [-4.6, 4.6]) {
      const [x, y] = T(u, -4.4)
      lathe(trim, x, y, [[0.45, GL], [0.45, EAVE - 0.1]], 10)
    }
    // the colonnades along the court's two sides: flat roofs on square columns
    for (const u of [-13.5, 13.5]) {
      const CL = 3.6
      slab(trim, white, ring(u - 2.2, -32, u + 2.2, -1), GL + CL - 0.5, GL + CL)
      for (let k = 0; k < 7; k++) {
        const [x, y] = T(u + (u > 0 ? 1.6 : -1.6), -30 + k * 4.8)
        box(trim, null, x - 0.3, y - 0.3, x + 0.3, y + 0.3, 0, GL + CL - 0.5, 0.06)
      }
    }
  }

  // ---- the covered walk curving from the court down to the library
  {
    const pts: XY[] = arc(28.0, -12.0, 38.0, 32, -40, 9)
    for (let k = 0; k < pts.length - 1; k++) {
      const [ax, ay] = pts[k], [bx, by] = pts[k + 1]
      const dx = bx - ax, dy = by - ay, L = Math.hypot(dx, dy), nx = -dy / L * 2.0, ny = dx / L * 2.0
      const ring: XY[] = [[ax - nx, ay - ny], [bx - nx, by - ny], [bx + nx, by + ny], [ax + nx, ay + ny]]
      const z1 = 7.4 - k * 0.15
      slab(trim, white, ring, z1 - 0.45, z1)
      box(trim, null, ax - 0.25, ay - 0.25, ax + 0.25, ay + 0.25, 0, z1 - 0.45, 0.05)
    }
  }

  return finishGlb('The Carter Center', [
    { part: conc, material: finish('carter-concrete', 0xdcd7cc) },
    { part: trim, material: PALETTE.trim },
    { part: win, material: PALETTE.window },
    { part: white, material: finish('carter-membrane', 0xe6e5e1) },
    { part: grey, material: finish('carter-cone-roof', 0x9a9e9f) },
    { part: glass, material: PALETTE.glass },
  ], { bearing: 0, height: 17.0, replaces: ['way/29094121'] }, 6500)
}

if (import.meta.main) await writeModel('atl-carter-center', build())
