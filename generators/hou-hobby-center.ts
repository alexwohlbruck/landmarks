/**
 * Hobby Center for the Performing Arts (800 Bagby Street, 2002, Robert A.M.
 * Stern Architects with Morris Architects), Houston — original procedural
 * geometry, CC0-1.0.
 * bun generators/hou-hobby-center.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Built turned to the downtown grid: catalog bearing 34.8, so +x
 * (south-east) is the Bagby Street front and its glass lobby, -y the
 * Walker Street end. Anchor = the centroid of the OSM outline
 * (way/257997076), 29.7616924,-95.3696649.
 *
 * Identity, in order: the four-storey glass lobby along Bagby Street, ~95 m
 * long, under one thin red-brown canopy roof whose edge climbs toward the
 * Walker Street end and whose cream soffit overhangs the glass by ~3.5 m;
 * the row of tall white columns raked at one angle in front of the glass,
 * from the street to the soffit; the white balcony slab across the lobby
 * at the first floor; behind, the pale limestone box of the halls and
 * stage house; red-brown brick wings on Walker Street and the west.
 *
 * Brief vs photos: the brief names "a domed hall behind" — the dome is
 * Sarofim Hall's ceiling, inside; nothing domed shows outside (photos,
 * lidar), so none is drawn. The glass lobby is the identity, as the brief
 * expected.
 *
 * Ground: the site falls ~2.5 m from Walker Street (south) to the north.
 * The map puts y = 0 at the lowest Mapterhorn ground of a 7x7 grid over the
 * plan, at the north end; Bagby Street mid-block is drawn ~2.6 m above
 * that. Heights here are lidar heights over its grid minimum less 7.8 m,
 * which puts the lidar's Bagby street (10.4) at 2.6 m.
 *
 * Evidence:
 *  - plan and heights: USGS 3DEP lidar TX_Coastal_B1_2018 (flown 2018), 1 m
 *    grid, read in the turned frame (grid centred 0.5 m off the anchor,
 *    ignored). Model heights (above y = 0; street 2.6): limestone box
 *    x -36..3, y -24..22, 34.5 m; stage house x 3..21, 37.2 m; north block
 *    x -10..22, y 22..54, 21.4 m; lobby x 22..~50, y -46..52, its roof
 *    sloping down outward and northward: inner edge 31.6 m (south) to
 *    22.7 m (north), outer edge 27.4 (the south-east tip: 1 m grid 25.0-26.9,
 *    0.5 m re-run 27.8 at x 40, y -44; the 0.5 m grid has no points east of
 *    x 46 there, so the very tip is under-sampled) to 18.2 m; Walker Street brick block
 *    x -30..24, y -52..-40, 17.5 m (a 1.2 m cornice canopy at the top), with a sloped metal-clad roof behind
 *    rising 21.8 -> 25.3 m; west brick wing 11.1 m; north-west block 14 m.
 *    The lobby front leans ~4° off the grid (x 45.6 at the north end, 52.5
 *    at the south), as the lidar edge does.
 *  - OSM: outline way/257997076 (building=civic, no height, no parts).
 *  - lobby details scaled on Another Believer's frontal photo: 14 columns,
 *    ~7 m apart, raked ~13° with their tops toward the north; balcony slab
 *    at ~4.5 m over the street; overhang ~4.5 m (the column line ~1.5 m in from the
 *    edge, the glass ~3 m behind the columns in the frontal and corner
 *    photos); the canopy is drawn 0.55 m thick, a thin red-brown fascia over
 *    a cream soffit.
 *  - colour: limestone box #e2e0e7 in Another Believer's photo (sky-lit),
 *    drawn #e6dfd2; brick #694d44-#6d5446 in shade (public-domain photo),
 *    drawn #a86e58; canopy roof red-brown, NAIP #bb8786, drawn #a8726a;
 *    soffit, columns and slab white-cream (trim); the sloped roof behind
 *    the Walker brick block grey metal (#bdc3cd, Barera), drawn #b4b8bd.
 *
 * Photos (Wikimedia Commons, all evidence):
 *  - Hobby_Center,_Houston.jpg, Another Believer, CC BY-SA 3.0 (frontal,
 *    Bagby Street lobby)
 *    https://commons.wikimedia.org/wiki/File:Hobby_Center,_Houston.jpg
 *  - Houston_May_2022_17_(Hobby_Center_for_the_Performing_Arts).jpg,
 *    Michael Barera, CC BY-SA 4.0 (lobby from the north-east)
 *    https://commons.wikimedia.org/wiki/File:Houston_May_2022_17_(Hobby_Center_for_the_Performing_Arts).jpg
 *  - HoustonTX_HobbyCenter.jpg, public domain (south-east corner, the brick
 *    block on Walker)
 *    https://commons.wikimedia.org/wiki/File:HoustonTX_HobbyCenter.jpg
 *  - Hobby_Center_Houston.jpg and The_Hobby_Center_White_Christmas.jpg,
 *    Ed Schipul, CC BY-SA 2.0 / CC BY 2.0 (night, the lit lobby)
 *    https://commons.wikimedia.org/wiki/File:Hobby_Center_Houston.jpg
 *    https://commons.wikimedia.org/wiki/File:The_Hobby_Center_White_Christmas.jpg
 *  USGS NAIP for the plan and roof colours. Published: opened 2002, Robert
 *  A.M. Stern (Wikipedia, "Hobby Center for the Performing Arts"). No
 *  commercial imagery.
 *
 * Left out: the lettering on the stage house and the slab, the LED sign,
 * the Tony Cragg sculptures, the railings and umbrellas, mullions finer
 * than one per bay.
 *
 * Doubts: the west and north sides are in no licensed photo; their masses
 * follow the lidar and are drawn plain in brick and stone. The materials of
 * the north block and the north-west block are guesses. The column count
 * and spacing are read from one frontal photo.
 */
import { Part, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import { cap, inset, panel, save, walls, type XY, rect } from './chi-aon-center'

const G = 2.6 // Bagby Street above y = 0
const lerp1 = (pts: [number, number][], y: number) => {
  for (let i = 0; i < pts.length - 1; i++) {
    const [y0, v0] = pts[i], [y1, v1] = pts[i + 1]
    if (y <= y1 || i === pts.length - 2) return v0 + ((v1 - v0) * (y - y0)) / (y1 - y0)
  }
  return pts[0][1]
}
// lobby roof: inner and outer edge heights along y (lidar - 7.8)
const INNER: [number, number][] = [[-46, 31.6], [0, 29.3], [22, 26.8], [52, 22.7]]
const OUTER: [number, number][] = [[-46, 27.4], [0, 22.0], [22, 20.8], [52, 18.2]]
const xe = (y: number) => 49.3 - 0.07 * y // roof edge
const OVER = 4.5, THICK = 0.55

function build() {
  const stone = new Part(), brick = new Part(), roof = new Part(), trim = new Part(), win = new Part(), metal = new Part()

  const box = (wall: Part, top: Part, r: XY[], z1: number, bev = 0.4) => {
    walls(wall, r, 0, z1 - bev)
    walls(wall, r, z1 - bev, z1, inset(r, bev))
    cap(top, inset(r, bev), z1)
  }
  // ---- stone box of the halls and the stage house ----
  box(stone, stone, rect(-36, -24, 3.2, 22), 34.5)
  box(stone, stone, rect(3, -28, 21.5, 21), 37.2)
  box(stone, stone, rect(-10, 21.5, 22.5, 54), 21.4)
  // ---- brick wings ----
  box(brick, roof, rect(-44, -16, -35.5, 28), 11.1)
  box(brick, roof, rect(-30, 22, -9.5, 48), 14.0)
  box(brick, roof, rect(-30, -52, 24, -39.5), 16.6)
  // its flat red-brown cornice canopy, overhanging ~1.2 m (photos)
  {
    const r = rect(-31.2, -53.2, 25.2, -39.5)
    walls(roof, r, 16.6, 17.5)
    cap(roof, r, 17.5)
    cap(trim, r, 16.6, false)
  }
  // sloped metal roof block behind the Walker brick block
  {
    const x0 = -44, x1 = 22, y0 = -40, y1 = -24, z0 = 21.8, z1 = 25.3
    const r = rect(x0, y0, x1, y1)
    walls(metal, r, 0, z0)
    // top: shed rising to +x, with its east gable
    metal.quad([x0, y0, z0], [x1, y0, z1], [x1, y1, z1], [x0, y1, z0])
    metal.tri([x1, y0, z0], [x1, y1, z0], [x1, y1, z1]); metal.tri([x1, y0, z0], [x1, y1, z1], [x1, y0, z1])
    metal.tri([x0, y0, z0], [x1, y0, z0], [x1, y0, z1])
    metal.tri([x1, y1, z0], [x0, y1, z0], [x1, y1, z1])
  }

  // ---- the lobby ----
  const ys = [-46, -34, -23, -11.5, 0, 11, 22]
  const ysN = [22, 37, 52]
  const h = (x: number, y: number, xi: number) => {
    const a = lerp1(INNER, y), b = lerp1(OUTER, y), t = (x - xi) / (xe(y) - xi)
    return a + (b - a) * t
  }
  /** roof slab over rows `yy` between x = xi and the edge */
  const canopy = (yy: number[], xi: number) => {
    const P = (x: number, y: number, dz = 0): V3 => [x, y, h(x, y, xi) + dz]
    for (let i = 0; i < yy.length - 1; i++) {
      const y0 = yy[i], y1 = yy[i + 1]
      const a = P(xi, y0), b = P(xe(y0), y0), c = P(xe(y1), y1), d = P(xi, y1)
      roof.quad(a, b, c, d) // top
      const ad = P(xi, y0, -THICK), bd = P(xe(y0), y0, -THICK), cd = P(xe(y1), y1, -THICK), dd = P(xi, y1, -THICK)
      trim.quad(ad, dd, cd, bd) // soffit
      roof.quad(bd, cd, c, b) // outer fascia
      roof.quad(dd, ad, a, d) // inner edge
    }
    // end fascias
    const s0 = yy[0], s1 = yy[yy.length - 1]
    roof.quad(P(xi, s0, -THICK), P(xe(s0), s0, -THICK), P(xe(s0), s0), P(xi, s0))
    roof.quad(P(xe(s1), s1, -THICK), P(xi, s1, -THICK), P(xi, s1), P(xe(s1), s1))
  }
  canopy(ys, 21.5)
  canopy(ysN, 29.5)
  const soff = (x: number, y: number) => h(x, y, y > 22 ? 29.5 : 21.5) - THICK
  const xg = (y: number) => xe(y) - OVER

  // glass walls: the front, and both ends, up to the soffit, with pale
  // mullions one per bay and the floor line of the balcony
  const front = [-44, ...ys.slice(1, -1), 22, 37, 50]
  for (let i = 0; i < front.length - 1; i++) {
    const y0 = front[i], y1 = front[i + 1]
    win.quad([xg(y0), y0, 0], [xg(y1), y1, 0], [xg(y1), y1, soff(xg(y1), y1)], [xg(y0), y0, soff(xg(y0), y0)])
  }
  for (let y = -40.5; y < 50; y += 3.5) {
    const x = xg(y) + 0.08
    trim.quad([x, y - 0.12, 0], [x, y + 0.12, 0], [x, y + 0.12, soff(x, y)], [x, y - 0.12, soff(x, y)])
  }
  {
    // south end, y = -44, facing -y; north end, y = 50, facing +y
    const ys0 = -44, x0 = 21.5, x1 = xg(ys0)
    win.quad([x0, ys0, 0], [x1, ys0, 0], [x1, ys0, soff(x1, ys0)], [x0, ys0, soff(x0, ys0)])
    const yn = 50, xn0 = 22.5, xn1 = xg(yn)
    win.quad([xn1, yn, 0], [xn0, yn, 0], [xn0, yn, soff(xn0, yn)], [xn1, yn, soff(xn1, yn)])
  }
  // floor lines on the glass, one per two storeys
  for (const z of [G + 10.2, G + 15.6]) {
    const yy = [-44, -22, 0, 22, 50]
    for (let i = 0; i < yy.length - 1; i++) {
      const y0 = yy[i], y1 = yy[i + 1], o = 0.1
      if (soff(xg(y0), y0) < z + 0.5 || soff(xg(y1), y1) < z + 0.5) continue
      trim.quad([xg(y0) + o, y0, z - 0.15], [xg(y1) + o, y1, z - 0.15], [xg(y1) + o, y1, z + 0.15], [xg(y0) + o, y0, z + 0.15])
    }
  }
  // the white balcony slab across the lobby at the first floor
  {
    const z0 = G + 4.4, z1 = G + 5.6, y0 = -44, y1 = 50
    const o = (y: number) => xe(y) - 1.4
    const r: XY[] = [[xg(y0), y0], [o(y0), y0], [o(y1), y1], [xg(y1), y1]]
    walls(trim, r, z0, z1)
    cap(trim, r, z1)
    cap(trim, r, z0, false)
  }
  // raked columns, tops toward the north
  {
    const lean = 0.23, n = 14, y0 = -42, y1 = 47
    for (let i = 0; i < n; i++) {
      const yb = y0 + ((y1 - y0 - 5) * i) / (n - 1)
      const x = xe(yb) - 1.5
      // solve for the point where the raked column meets the soffit
      let zt = 20
      for (let k = 0; k < 6; k++) zt = soff(x, yb + lean * zt) + 0.05
      const yt = yb + lean * zt
      const r0 = 0.65, r1 = 0.45, seg = 6
      const ring = (yc: number, z: number, r: number) => Array.from({ length: seg }, (_, k) => {
        const t = (k / seg) * 2 * Math.PI
        return [x + r * Math.cos(t), yc + r * Math.sin(t), z] as V3
      })
      trim.loft([ring(yb, 0, r0), ring(yt, zt, r1)])
    }
  }
  // brick pier at the south-east corner (photos), carrying the corner
  box(brick, roof, rect(xg(-44) - 3.5, -46, xg(-44) + 0.4, -42.5), 12)
  void panel

  return [
    { part: stone, material: finish('hobby-limestone', 0xe6dfd2) },
    { part: brick, material: finish('hobby-brick', 0xa86e58) },
    { part: roof, material: finish('hobby-canopy', 0xa8726a) },
    { part: trim, material: PALETTE.trim },
    { part: win, material: PALETTE.window },
    { part: metal, material: finish('hobby-metal', 0xb4b8bd) },
  ]
}

if (import.meta.main) await save('hou-hobby-center', 'Hobby Center for the Performing Arts', [29.7616924, -95.3696649], 34.8, build())
