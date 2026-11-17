/**
 * Houston Museum of Natural Science (5555 Hermann Park Drive; 1969 building,
 * Burke Baker Planetarium 1964, Cockrell Butterfly Center 1994, Dan L Duncan
 * Family wing 2012), Houston — original procedural geometry, CC0-1.0.
 * bun generators/hou-museum-of-natural-science.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Built turned to the museum's own grid: catalog bearing 35.6 (the
 * 1969 blocks' walls run at 35.6° / 125.6°), so model +y points north-east,
 * toward the Duncan wing and Warwick Towers, and -y is the planetarium side.
 * +x is the parking-garage side, -x the Hermann Park side with the butterfly
 * cone. Anchor = the centroid of the OSM outline (way/217678285),
 * 29.72212,-95.38970.
 *
 * Identity, in order: the Cockrell Butterfly Center's glass cone on the
 * park side, a steep-walled cone cut by a plane that rises toward the
 * museum (the read from above); the Burke Baker Planetarium's teal ribbed
 * dome on a dark brick drum, with its ring of white posts; the white,
 * windowless 1969 blocks with the curved-cornered entrance wing that carries
 * the museum's name; the dark two-storey glass entrance hall beside it and
 * the low glazed galleria along the planetarium side; the tall 2012 Duncan
 * wing behind, stepped down along its park side.
 *
 * Which OSM ways cover what: way/217678285 is one outline for the whole
 * complex (cone, planetarium, the 1969 blocks, the galleria and the Duncan
 * wing); there are no building:part ways. The parking garage
 * (way/217678290) is a separate building and is not modelled. replaces =
 * [way/217678285].
 *
 * Evidence:
 *  - plan: OSM way/217678285, read in the turned frame; every tier's extent
 *    from the USGS 3DEP lidar TX_Coastal_B1_2018 (flown 2018), 1 m grid,
 *    which matches the outline to ~1 m. NAIP (USGS NAIP Plus) for the plan
 *    and roof colours.
 *  - heights over the ground around (3.8 m over the grid minimum; the site
 *    is flat, 3.3-4.6 m all round), measured from lidar: Duncan wing 23.0 m,
 *    its 5 m park-side step 17.8 m, two mechanical penthouses 26 m; the
 *    middle block 17.2 m; the 1969 south block 12.0 m with a raised roof
 *    13.6 m and an east stair tower 15.5 m; the curved entrance wing 15.5 m;
 *    the entrance hall 11.5 m; the galleria 7 m; the low link by the garage
 *    6.5 m.
 *  - butterfly cone: base circle r 16 m on the OSM arc (centre -52, -29.5);
 *    lidar shows walls rising ~17 m within 4-5 m of the edge, then a top
 *    sloping from ~15.5 m (park side) to ~22.5 m where it meets the museum.
 *    Drawn as a truncated cone, base r 16, top r 11.5, cut by a plane tilted
 *    ~17° toward the north-east (measured). Glass from NAIP (a grey-blue
 *    disc with radial frames); no licensed exterior photo of it was found.
 *  - planetarium: drum r 12.9 m (OSM arc), 4.9 m tall; a white ring of posts
 *    1.2 m tall at r 9.6; dome base r 9.4, rise 5.5 m; total 12.1 m (lidar
 *    12.2 m). Proportions scaled on Ed Uthman's photo (drum width 26 m).
 *  - colours: white concrete #cec6c3-#ded9d4 (pinemikey, Manousek) drawn
 *    #e6dfd7; entrance-hall glass #3b4b6a drawn as the palette window;
 *    dome teal #5e8290-#61858e (Uthman) pulled light to #6f979b; drum dark
 *    brick #131415 in shade, drawn #57504b (no darker than charcoal); roofs
 *    NAIP pale grey, drawn as the palette roof.
 *
 * Photos (all evidence):
 *  - "Houston Museum of Natural Science - Flickr - pinemikey (1).jpg",
 *    Michael Martin, CC BY-SA 2.0 (entrance hall and curved white wing from
 *    the park plaza)
 *    https://commons.wikimedia.org/wiki/File:Houston_Museum_of_Natural_Science_-_Flickr_-_pinemikey_(1).jpg
 *  - "Houston Museum of Natural Science - Flickr - pinemikey.jpg", Michael
 *    Martin, CC BY-SA 2.0 (the same front with the fountain)
 *    https://commons.wikimedia.org/wiki/File:Houston_Museum_of_Natural_Science_-_Flickr_-_pinemikey.jpg
 *  - "HoustonMuseumOfNaturalScience Pano.jpg", Wolfgang Manousek, CC BY 2.0
 *    https://commons.wikimedia.org/wiki/File:HoustonMuseumOfNaturalScience_Pano.jpg
 *  - "Houston Museum of Natural Science, entrance in 2012.JPG", Another
 *    Believer, CC BY-SA 3.0
 *    https://commons.wikimedia.org/wiki/File:Houston_Museum_of_Natural_Science,_entrance_in_2012.JPG
 *  - "Burke-Baker Planetarium Houston.jpg", Ed Uthman, CC BY 3.0 (dome,
 *    posts, drum; the galleria's glass wall beside it)
 *    https://commons.wikimedia.org/wiki/File:Burke-Baker_Planetarium_Houston.jpg
 *  - "Grand Entry Hall of the Houston Museum of Natural Science.JPG", Agsftw,
 *    CC BY-SA 3.0 (the galleria inside: glass wall along one side)
 *    https://commons.wikimedia.org/wiki/File:Grand_Entry_Hall_of_the_Houston_Museum_of_Natural_Science.JPG
 *  Published: Wikipedia, "Houston Museum of Natural Science" (dates, wings).
 *  No commercial imagery.
 *
 * Left out: the lettering on the white wing, banners, the plaza, fountain and
 * sundial (ground), the glass canopy over the entrance steps, rooftop plant
 * other than the two penthouses, the cone's radial glazing bars (six broad
 * ribs stand for them).
 *
 * Doubts: no licensed photo shows the butterfly cone or the Duncan wing from
 * outside. The cone's form rests on lidar and NAIP only; the Duncan wing is
 * drawn plain pale stone with no facade pattern, which it certainly has (its
 * real cladding and glazing are unknown to me from open sources). The
 * north-east and garage sides of the 1969 blocks are drawn plain.
 */
import { Part, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import { cap, circle, inset, lathe, panel, save, walls, type XY } from './chi-aon-center'
import { arc } from './hou-alley-theatre'

const area = (r: XY[]) => r.reduce((s, a, i) => { const b = r[(i + 1) % r.length]; return s + a[0] * b[1] - b[0] * a[1] }, 0) / 2
const ccw = (r: XY[]) => (area(r) < 0 ? [...r].reverse() : r)

function build() {
  const stone = new Part(), roof = new Part(), win = new Part(), glass = new Part(), teal = new Part(), dark = new Part()

  /** A flat-roofed block: walls to z1 with a 0.4 m bevelled coping, roof cap. */
  const block = (r0: XY[], z0: number, z1: number, wall = stone, bev = 0.4) => {
    const r = ccw(r0)
    walls(wall, r, z0, z1 - bev)
    const i = inset(r, bev)
    walls(wall, r, z1 - bev, z1, i)
    cap(roof, i, z1)
    return r
  }

  // ---- Duncan wing (2012): a 17.8 m step on the park side, 23 m core ----
  const duncan: XY[] = [[-76.4, 6.1], [-52.9, -4.8], [-38, -3], [-30, 6], [-30, 22], [15.6, 22], [16.1, 90.6], [-8.7, 90.9]]
  block(duncan, 0, 17.8)
  const core: XY[] = [[-69.4, 6.6], [-52, -0.6], [-38.5, 0.5], [-31.5, 8], [-31.5, 21], [15.0, 21], [15.0, 89.5], [-5.6, 89.6]]
  block(core, 17.0, 23.0)
  block([[-14, 29], [4, 29], [4, 40], [-14, 40]], 22.6, 26.0)
  block([[-16, 75], [6, 75], [6, 85], [-16, 85]], 22.6, 25.6)

  // ---- middle block, 17.2 m ----
  block([[-32, -28], [-2, -28], [-2, 21.5], [-46, 21.5], [-46, -15], [-32, -15]], 0, 17.2)

  // ---- 1969 south block, 12 m, with a raised roof and an east stair tower ----
  block([[-36.2, -33.4], [-18.7, -38.2], [-21.5, -41.8], [9.3, -46.5], [9.3, -44], [62.5, -44], [63.4, -46.3], [65.8, -46.8],
    [68.3, -33.8], [65.9, -33.4], [66.6, -30.1], [80.6, -29.8], [80.7, 7.1], [-2, 7.1], [-2, -28.5], [-31, -28.5]], 0, 12.0)
  block([[18, -21], [36, -21], [36, -3], [18, -3]], 11.6, 13.6)
  block([[62, -18], [74, -18], [74, 3], [62, 3]], 11.6, 15.5)

  // ---- low link toward the garage, 6.5 m ----
  block([[-2, 7.1], [28.5, 7.1], [28.5, 30], [23.3, 30], [23.3, 25.8], [15.6, 25.8], [15.6, 22], [-2, 22]], 0, 6.5)

  // ---- the curved white entrance wing, 15.5 m ----
  const wing: XY[] = [[-21.5, -41.8], ...arc([-24.3, -56.5], [-13.0, -70.4], 3.6, 8), [-13.0, -70.4], [5.4, -65.6], [8.9, -48.2], [9.3, -46.5]]
  block(wing, 0, 15.5)
  // the tall dark slots at the foot of its park face
  {
    const a: XY = [-21.5, -41.8], b: XY = [-24.8, -59.4]
    for (let k = 0; k < 4; k++) panel(win, a, b, 1.2 + k * 2.4, 2.2 + k * 2.4, 0.6, 7.5, 0.05)
  }

  // ---- entrance hall: two storeys of dark glass on the park side ----
  {
    const a: XY = [-36.2, -33.4], b: XY = [-18.7, -38.2]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    for (const [z0, z1] of [[0.4, 5.3], [5.9, 10.9]]) panel(win, a, b, 0.5, L - 0.5, z0, z1, 0.05)
    // and round the step to the wing
    const c: XY = [-21.5, -41.8], L2 = Math.hypot(c[0] - b[0], c[1] - b[1])
    for (const [z0, z1] of [[0.4, 5.3], [5.9, 10.9]]) panel(win, b, c, 0.3, L2 - 0.3, z0, z1, 0.05)
    // the sloped glass canopy over the entrance steps, as a dark band
    const { u, n } = { u: [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: [(b[1] - a[1]) / L, -(b[0] - a[0]) / L] }
    const P = (sAl: number, out: number, z: number): V3 => [a[0] + u[0] * sAl + n[0] * out, a[1] + u[1] * sAl + n[1] * out, z]
    glass.quad(P(2.5, 0.1, 6.4), P(2.5, 4.5, 5.0), P(L - 1.5, 4.5, 5.0), P(L - 1.5, 0.1, 6.4))
    glass.quad(P(2.5, 0.1, 6.4), P(L - 1.5, 0.1, 6.4), P(L - 1.5, 4.5, 5.0), P(2.5, 4.5, 5.0))
  }

  // ---- galleria: a low glazed strip along the planetarium side, 7 m ----
  const gal: XY[] = [[9.3, -46.5], [26.6, -49.7], [43.8, -46.9], [62.5, -50.3], [62.5, -44], [9.3, -44]]
  block(gal, 0, 7.0)
  for (const [a, b] of [[gal[0], gal[1]], [gal[2], gal[3]]] as [XY, XY][]) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(2, Math.round(L / 6))
    for (let k = 0; k < n; k++) panel(win, a, b, 0.5 + k * (L - 1) / n + 0.2, 0.5 + (k + 1) * (L - 1) / n - 0.2, 0.5, 6.0, 0.05)
  }

  // ---- Cockrell Butterfly Center: the slant-topped glass cone ----
  {
    const C: XY = [-52, -29.5], N = 16, R0 = 16, R1 = 11.5
    const u: XY = [0.81, 0.58] // the direction the top rises toward
    const zTop = (p: XY) => 19.0 + 0.3 * ((p[0] - C[0]) * u[0] + (p[1] - C[1]) * u[1])
    const base = circle(C[0], C[1], R0, N, Math.PI / N)
    const top = circle(C[0], C[1], R1, N, Math.PI / N)
    const mid = base.map((p, i) => [lerp(p[0], top[i][0], 0.06), lerp(p[1], top[i][1], 0.06)] as XY)
    for (let i = 0; i < N; i++) {
      const j = (i + 1) % N
      // a low stone base course, then glass up to the slanted top
      stone.quad([base[i][0], base[i][1], 0], [base[j][0], base[j][1], 0], [mid[j][0], mid[j][1], 1.0], [mid[i][0], mid[i][1], 1.0])
      const zi = zTop(top[i]) - 0.4, zj = zTop(top[j]) - 0.4
      glass.quad([mid[i][0], mid[i][1], 1.0], [mid[j][0], mid[j][1], 1.0], [top[j][0], top[j][1], zj], [top[i][0], top[i][1], zi])
      // a frame band round the cut edge
      stone.quad([top[i][0], top[i][1], zi], [top[j][0], top[j][1], zj], [top[j][0], top[j][1], zj + 0.4], [top[i][0], top[i][1], zi + 0.4])
    }
    // the slanted top, glass, with six broad ribs over it and down the sides
    const ring = top.map(p => [p[0], p[1], zTop(p)] as V3)
    const ctr: V3 = [C[0], C[1], zTop(C) + 0.6]
    for (let i = 0; i < N; i++) glass.tri(ring[i], ring[(i + 1) % N], ctr)
    for (let k = 0; k < 6; k++) {
      const i = Math.round(k * N / 6) % N, a = top[i]
      const t: XY = [-(a[1] - C[1]) / R1, (a[0] - C[0]) / R1], w = 0.35
      const A: V3 = [a[0] - t[0] * w, a[1] - t[1] * w, zTop(a) + 0.05], B: V3 = [a[0] + t[0] * w, a[1] + t[1] * w, zTop(a) + 0.05]
      const k0 = 0.12, D: V3 = [ctr[0] - t[0] * w * 0.5, ctr[1] - t[1] * w * 0.5, ctr[2] + k0], E: V3 = [ctr[0] + t[0] * w * 0.5, ctr[1] + t[1] * w * 0.5, ctr[2] + k0]
      stone.quad(A, B, E, D)
      // down the side, on the glass
      const bA = base[i], m = mid[i], o = 0.08
      const nx = (m[0] - C[0]) / Math.hypot(m[0] - C[0], m[1] - C[1]), ny = (m[1] - C[1]) / Math.hypot(m[0] - C[0], m[1] - C[1])
      const P = (p: XY, z: number, s: number): V3 => [p[0] + t[0] * s + nx * o, p[1] + t[1] * s + ny * o, z]
      void bA
      stone.quad(P(m, 1.0, w), P(m, 1.0, -w), P(a, zTop(a) - 0.4, -w), P(a, zTop(a) - 0.4, w))
    }
  }

  // ---- Burke Baker Planetarium ----
  {
    const cx = 37, cy = -58.1
    // the dark brick drum with a white fascia, flat white roof ring
    lathe(dark, cx, cy, [[0.01, 0], [12.9, 0], [12.9, 4.4]], 16)
    lathe(stone, cx, cy, [[12.9, 4.4], [13.1, 4.4], [13.1, 5.1], [9.6, 5.1]], 16)
    // the ring of white posts round a dark clerestory, then the teal dome
    lathe(dark, cx, cy, [[9.3, 5.1], [9.3, 6.0]], 16)
    for (let k = 0; k < 12; k++) {
      const t = (k / 12) * 2 * Math.PI, c = Math.cos(t), s = Math.sin(t)
      const p = (r: number, a: number, z: number): V3 => [cx + r * Math.cos(t + a) , cy + r * Math.sin(t + a), z]
      void c; void s
      const a = 0.05
      stone.quad(p(9.7, -a, 5.1), p(9.7, a, 5.1), p(9.7, a, 6.0), p(9.7, -a, 6.0))
      stone.quad(p(9.3, a, 5.1), p(9.3, -a, 5.1), p(9.3, -a, 6.0), p(9.3, a, 6.0))
      stone.quad(p(9.3, -a, 5.1), p(9.7, -a, 5.1), p(9.7, -a, 6.0), p(9.3, -a, 6.0))
      stone.quad(p(9.7, a, 5.1), p(9.3, a, 5.1), p(9.3, a, 6.0), p(9.7, a, 6.0))
    }
    lathe(stone, cx, cy, [[9.3, 6.0], [9.8, 6.0], [9.8, 6.5], [9.4, 6.5]], 16)
    const prof: XY[] = []
    const R = (9.4 * 9.4 + 5.6 * 5.6) / (2 * 5.6), zc = 6.5 + 5.6 - R
    const a0 = Math.asin(9.4 / R)
    for (let i = 0; i <= 6; i++) { const a = a0 * (1 - i / 6); prof.push([R * Math.sin(a), zc + R * Math.cos(a)]) }
    prof[prof.length - 1] = [0.001, 6.5 + 5.6]
    lathe(teal, cx, cy, prof, 16)
  }

  return [
    { part: stone, material: finish('hmns-white-concrete', 0xe6dfd7) },
    { part: roof, material: PALETTE.roof },
    { part: win, material: PALETTE.window },
    { part: glass, material: PALETTE.glass },
    { part: teal, material: finish('hmns-planetarium-dome', 0x6f979b, 0.6) },
    { part: dark, material: finish('hmns-planetarium-brick', 0x57504b, 0.9) },
  ]
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t

if (import.meta.main) await save('hou-museum-of-natural-science', 'Houston Museum of Natural Science', [29.72212, -95.3897], 35.6, build())
