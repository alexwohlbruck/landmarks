/**
 * London Heathrow Terminal 2, "The Queen's Terminal" (Luis Vidal +
 * Architects with Pascall+Watson, opened 4 June 2014): the main building 2A
 * — procedural, CC0-1.0, no textures.
 * bun generators/london-heathrow-terminal-2.ts
 *
 * Writes models/london-heathrow-terminal-2.glb (low) and
 * models/london-heathrow-terminal-2.detail.glb (detail: the whole landmark
 * again, with finer mullions, the soffit's ribs and more canopy columns).
 *
 * The satellite pier T2B is a separate OSM building (way/294572024, about
 * 300 m east, joined to 2A underground and by an airside link) and is not
 * part of this model; both are members of the Terminal 2 multipolygon
 * relation/8469252, which has no building tag.
 *
 * Map frame: x = model east, y = model north, z up, metres; bearing 0.
 * Anchor: area centroid of OSM way/133146402. Landside (the forecourt and
 * the road from the central area) is −x (west); the apron is +x and −y.
 *
 * Identifying features (photos): one big glass box under a roof of three
 * parallel waves: three shallow humps side by side across the 270 m width,
 * their ridges running north–south, so the north and south facades end in a
 * three-wave roof line; north-light rooflight bands curving over each hump;
 * the roof running out as a deep flat canopy over the landside forecourt on
 * slender white columns, and a shorter overhang over the airside glass;
 * silver metal roof, white soffits; tall glass walls with a strong
 * horizontal mullion grid; dark grey boxes (the jet-bridge stair cores)
 * standing against the airside facade.
 *
 * Evidence
 * - OSM: way/133146402 (Terminal 2A, building=airport_terminal, height 40,
 *   building:levels 4), inside it the indoor building:parts way/570155575
 *   and way/570155700 (replaced). Body x −140.7…128, y −97…103.5; the
 *   stair cores on the south side, the service blocks on the east side and
 *   the airside link at the south-east are drawn from the outline's
 *   projections.
 * - Published: opened 4 June 2014; architect Luis Vidal + Architects
 *   (Wikipedia, "Heathrow Terminal 2").
 * - Photos (Wikimedia Commons):
 *   https://commons.wikimedia.org/wiki/File:Looking_to_Terminal_2_at_Heathrow.jpg
 *     and https://commons.wikimedia.org/wiki/File:Terminal_2_at_Heathrow_(geograph_3012298).jpg
 *     (M J Richardson, CC BY-SA 2.0) from the south runway, 2012, nearly
 *     finished: the three-wave roof line, the glass south facade, the
 *     landside canopy on posts at the west end; the eave and crown heights
 *     were read from these;
 *   https://commons.wikimedia.org/wiki/File:London_-_Heathrow_Airport_-_Terminal_2_(geograph_5257264).jpg
 *     (Lewis Clarke, CC BY-SA 2.0) the airside facade: the humps over the
 *     flat projecting eave, the dark stair cores, the glass grid;
 *   https://commons.wikimedia.org/wiki/File:South-West_Corner_of_Heathrow_Terminal_2_-_geograph.org.uk_-_5753017.jpg
 *     (Richard Cooke, CC BY-SA 2.0) the south-west corner: the deep white
 *     soffit on round columns;
 *   https://commons.wikimedia.org/wiki/File:London_Heathrow_Airport_-_Terminal_Two_(geograph_5244405).jpg
 *     (Lewis Clarke, CC BY-SA 2.0) the roof humps from the apron;
 *   https://commons.wikimedia.org/wiki/File:Heathrow_Airport_Terminal_2,_London,_England_-_Diliff.jpg
 *     (Diliff, CC BY-SA 3.0) the departures hall: the rooflight bands;
 *   https://commons.wikimedia.org/wiki/File:Terminal_2_The_Queen%27s_Terminal.jpg
 *     (Panek, CC BY-SA 3.0) the landside entrance under the canopy;
 *   https://commons.wikimedia.org/wiki/File:Terminal_2,_Heathrow_Airport_-_geograph.org.uk_-_7131372.jpg
 *     (Bill Boaden, CC BY-SA 2.0) aerial from the south-east: the plan,
 *     2A and 2B.
 * - Terrain: Mapterhorn flat.
 * - No lidar.
 *
 * Numbers: eave 24 m and crown 35 m (estimated from Richardson's photos:
 * the humps rise about half the wall's height again over the facade; OSM's
 * height 40 is taken to include rooftop plant); three equal humps of 89.6 m
 * over the body's width (estimated; the photos show three); overhangs 5 m
 * north and south and on the airside, 12 m over the landside forecourt on
 * columns (estimated from Cooke's and Panek's photos; OSM's multi-storey car
 * park way/670789079 abuts the west wall, and the canopy reaches over its
 * edge); three
 * rooflight bands a hump (Diliff's photo shows them; spacing estimated); the
 * stair cores 14 m high, the east service blocks 16 m, the north-east block
 * 18 m, the airside link 6–9.5 m (estimated). Jet bridges (review round 1):
 * OSM maps none; their positions are read from the aerials and Clarke's
 * photo: from each south stair core one bridge each way along the facade,
 * 24 m to a round cab on a post, at 5–8.2 m; two more from the east
 * service blocks (estimated).
 * Doubts: the rooflights' exact form (the north-light glazing is drawn as
 * raised glass bands over the humps); the landside canopy's depth and
 * column spacing; the plant OSM's 40 m may describe is left out. T2B is left
 * out (see above). The jet bridges' count and lengths are estimated.
 */
import { type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, quadN, unit } from './nyc-570-lexington'
import { prismRing, newMats, writeLod, drum, beam, type Mats } from './tokyo-haneda-terminal-1'
import { LHR, band, type WallPlane } from './london-heathrow-terminal-5'

const X0 = -140.7, X1 = 128, Y0 = -96.5, Y1 = 103.2
const EAVE = 24.5, CROWN = 33, DEPTH = 1.6, WALL = 23, EDGE_WAVE = 0.18
const N_HUMP = 3, HW = (X1 - X0) / N_HUMP
const OV_NS = 5, OV_E = 5, OV_W = 12

/**
 * The roof's top: three domed humps side by side. Across x each hump is a
 * parabola; along y it stays high and rolls down near the north and south
 * edges, where a little of each hump is left, so the roof edge waves gently.
 */
const zRoof = (x: number, y: number) => {
  if (x <= X0 || x >= X1) return EAVE
  const k = Math.min(N_HUMP - 1, Math.max(0, Math.floor((x - X0) / HW)))
  const c = X0 + HW * (k + 0.5), u = (x - c) / (HW / 2)
  const yc = (Y0 + Y1) / 2, hy = (Y1 - Y0) / 2 + OV_NS, v = Math.min(1, Math.abs(y - yc) / hy)
  return EAVE + (CROWN - EAVE) * Math.max(0, 1 - u * u) * (EDGE_WAVE + (1 - EDGE_WAVE) * (1 - v ** 4))
}
const nRoof = (x: number, y: number, side = 0): V3 => {
  const e = 0.05, xa = side > 0 ? x : x - e, xb = side < 0 ? x : x + e
  return unit([-(zRoof(xb, y) - zRoof(xa, y)) / (xb - xa), -(zRoof(x, y + e) - zRoof(x, y - e)) / (2 * e), 1])
}

function build(detail: boolean) {
  const M: Mats = newMats(['roof', 'win', 'trim', 'wall', 'core', 'glass'])
  const n = detail ? 14 : 8
  // sample points: every hump from edge to edge, plus the flat overhangs either side
  const xs: number[] = [X0 - OV_W]
  for (let k = 0; k < N_HUMP; k++) for (let i = 0; i <= n; i++) { const x = X0 + HW * k + (HW * i) / n; if (x > xs[xs.length - 1] + 0.01) xs.push(x) }
  xs.push(X1 + OV_E)
  const ry0 = Y0 - OV_NS, ry1 = Y1 + OV_NS
  const ny = detail ? 16 : 8
  const ys = Array.from({ length: ny + 1 }, (_, j) => ry0 + ((ry1 - ry0) * j) / ny)

  // --- the roof: domed top, soffit under it, fascias round the edge ---
  for (let i = 0; i < xs.length - 1; i++) {
    const a = xs[i], b = xs[i + 1]
    for (let j = 0; j < ny; j++) {
      const c = ys[j], d = ys[j + 1]
      const P = (x: number, y: number): V3 => [x, y, zRoof(x, y)]
      quadN(M.roof, P(a, c), P(b, c), P(b, d), P(a, d), [nRoof(a, c, 1), nRoof(b, c, -1), nRoof(b, d, -1), nRoof(a, d, 1)])
      const Q = (x: number, y: number): V3 => [x, y, zRoof(x, y) - DEPTH], dn: V3 = [0, 0, -1]
      quadN(M.trim, Q(a, c), Q(a, d), Q(b, d), Q(b, c), [dn, dn, dn, dn])
    }
    const s: V3 = [0, -1, 0], N: V3 = [0, 1, 0]
    quadN(M.trim, [a, ry0, zRoof(a, ry0) - DEPTH], [b, ry0, zRoof(b, ry0) - DEPTH], [b, ry0, zRoof(b, ry0)], [a, ry0, zRoof(a, ry0)], [s, s, s, s])
    quadN(M.trim, [b, ry1, zRoof(b, ry1) - DEPTH], [a, ry1, zRoof(a, ry1) - DEPTH], [a, ry1, zRoof(a, ry1)], [b, ry1, zRoof(b, ry1)], [N, N, N, N])
  }
  for (const [x, sx] of [[X0 - OV_W, -1], [X1 + OV_E, 1]] as [number, number][]) {
    const nn: V3 = [sx, 0, 0]
    quadN(M.trim, [x, ry0, EAVE - DEPTH], [x, ry1, EAVE - DEPTH], [x, ry1, EAVE], [x, ry0, EAVE], [nn, nn, nn, nn])
  }

  // --- rooflight bands: glazed strips over each hump, following its curve ---
  const bands = detail ? [-70, -35, 0, 35, 70] : [-55, 0, 55]
  for (let k = 0; k < N_HUMP; k++) {
    const hx0 = X0 + HW * k + 6, hx1 = X0 + HW * (k + 1) - 6
    for (const yc of bands) {
      const w = detail ? 5 : 6, y0 = yc + 3 - w / 2, y1 = yc + 3 + w / 2, h = 1.0
      const steps = detail ? 10 : 6
      for (let i = 0; i < steps; i++) {
        const a = hx0 + ((hx1 - hx0) * i) / steps, b = hx0 + ((hx1 - hx0) * (i + 1)) / steps
        // a north-light: glass rising from the roof at y0 to an upstand h high at y1, glazed to the north
        const zA = zRoof(a, y1), zB = zRoof(b, y1), za0 = zRoof(a, y0), zb0 = zRoof(b, y0)
        const tn = (x: number, z0: number, z1: number): V3 => { const r = nRoof(x, yc); return unit([r[0], r[1] - (z1 - z0) / (y1 - y0), r[2]]) }
        const na = tn(a, za0, zA + h), nb = tn(b, zb0, zB + h)
        quadN(M.glass, [a, y0, za0 + 0.05], [b, y0, zb0 + 0.05], [b, y1, zB + h], [a, y1, zA + h], [na, nb, nb, na])
        const N: V3 = [0, 1, 0]
        quadN(M.glass, [b, y1, zB - 0.1], [a, y1, zA - 0.1], [a, y1, zA + h], [b, y1, zB + h], [N, N, N, N])
      }
    }
  }

  // --- glazed valleys between the humps (the dark joints seen from the apron) ---
  for (let k = 1; k < N_HUMP; k++) {
    const x = X0 + HW * k, w = 1.6, up: V3 = [0, 0, 1]
    quadN(M.glass, [x - w, ry0 + 1, EAVE + 0.12], [x + w, ry0 + 1, EAVE + 0.12], [x + w, ry1 - 1, EAVE + 0.12], [x - w, ry1 - 1, EAVE + 0.12], [up, up, up, up])
  }

  // --- the glass walls: straight-topped at WALL, with a white band up to the soffit ---
  const sides: { a: XY; b: XY; n: V3 }[] = [
    { a: [X0, Y0], b: [X1, Y0], n: [0, -1, 0] }, { a: [X1, Y0], b: [X1, Y1], n: [1, 0, 0] },
    { a: [X1, Y1], b: [X0, Y1], n: [0, 1, 0] }, { a: [X0, Y1], b: [X0, Y0], n: [-1, 0, 0] },
  ]
  for (const { a, b, n: nE } of sides) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: V3 = [(b[0] - a[0]) / L, (b[1] - a[1]) / L, 0]
    const W: WallPlane = { o: [a[0], a[1], 0], u, v: [0, 0, 1], n: nE }
    quadN(M.win, [a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], WALL], [a[0], a[1], WALL], [nE, nE, nE, nE])
    // the band between the glass and the soffit, following the roof's wave
    const seg = Math.max(1, Math.round(L / (HW / (detail ? 14 : 8))))
    for (let k = 0; k < seg; k++) {
      const p: XY = [a[0] + (b[0] - a[0]) * (k / seg), a[1] + (b[1] - a[1]) * (k / seg)], q: XY = [a[0] + (b[0] - a[0]) * ((k + 1) / seg), a[1] + (b[1] - a[1]) * ((k + 1) / seg)]
      const zp = zRoof(p[0], p[1]) - DEPTH + 0.1, zq = zRoof(q[0], q[1]) - DEPTH + 0.1
      quadN(M.trim, [p[0], p[1], WALL], [q[0], q[1], WALL], [q[0], q[1], zq], [p[0], p[1], zp], [nE, nE, nE, nE])
    }
    const step = detail ? 4.5 : 9
    for (let s = step; s < L - 1; s += step) band(M.trim, W, [s, 0.3], [s, WALL - 0.3], detail ? 0.3 : 0.45)
    for (const t of detail ? [4.6, 9.2, 13.8, 18.4] : [7, 14]) band(M.trim, W, [0.3, t], [L - 0.3, t], detail ? 0.35 : 0.55)
  }

  // --- the landside canopy's columns (and the hall's own columns at the overhangs) ---
  const cols = detail ? 10 : 6
  for (let k = 0; k < cols; k++) {
    const y = Y0 + 6 + ((Y1 - Y0 - 12) * k) / (cols - 1)
    drum(M.trim, X0 - OV_W + 3, y, 0.7, 0.7, 0, EAVE - DEPTH + 0.1, detail ? 10 : 6, null)
  }

  // --- the stair cores against the airside facade (outline projections), dark grey ---
  const cores: [number, number, number, number][] = [[-133, -138.8, -119.7, Y0], [-85.3, -141.3, -71.7, Y0], [9.5, -124.5, 22, Y0], [80.5, -118.3, 93, Y0]]
  for (const [a, b, c, d] of cores) prismRing(M.core, [[a, b], [c, b], [c, d], [a, d]], 0, 14, M.core)
  // --- jet bridges (review round 1): from each stair core a bridge each way along the
  // facade to a round cab on a post, as in Clarke's photo; OSM maps none, so their positions
  // are read from the aerials (Boaden's shows the same core-and-bridge pattern) ---
  const jb = (a: XY, b: XY) => {
    beam(M.wall, a, b, 3.6, 5, 8.2, true)
    drum(M.wall, b[0], b[1], 2.3, 2.3, 4.6, 8.7, detail ? 12 : 8, M.wall)
    drum(M.wall, b[0], b[1], 0.6, 0.6, 0, 4.6, 6, null)
    if (detail) drum(M.wall, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2, 0.4, 0.4, 0, 5, 6, null)
  }
  for (const [a, b, c] of cores) {
    const y = b + 6
    jb([a, y], [a - 24, y])
    jb([c, y], [c + 24, y])
  }
  // the east side's two stands, at the service blocks (estimated)
  for (const y of [-73.6, 17]) jb([150.2, y], [174, y])
  // a low gate-room bar linking the two western cores to the facade
  prismRing(M.wall, [[-129, -114.7], [-81, -114.7], [-81, Y0], [-129, Y0]], 0, 9, M.roof)
  // service blocks on the east side and the north-east block
  for (const [a, b, c, d, h] of [[X1, -78, 150.2, -69.1, 16], [X1, 12.5, 150, 21.4, 16], [127.6, 59.5, 170, 97.2, 18], [87, Y1, 116.2, 119.6, 14]] as [number, number, number, number, number][]) {
    prismRing(M.wall, [[a, b], [c, b], [c, d], [a, d]], 0, h, M.roof)
    const W: WallPlane = { o: [c, b, 0], u: [0, 1, 0], v: [0, 0, 1], n: [1, 0, 0] }
    band(M.win, W, [1.5, h * 0.55], [d - b - 1.5, h * 0.55], h * 0.4, 0.05)
  }
  // the airside link to the south-east: a glazed bridge on posts
  const link: XY[] = [[121.2, -114.5], [137.4, -133.5], [137.3, -172], [148.3, -182.8], [161.9, -182.8]]
  for (let i = 0; i < link.length - 1; i++) {
    beam(M.wall, link[i], link[i + 1], 5, 6, 9.5, true)
    drum(M.wall, link[i + 1][0], link[i + 1][1], 0.6, 0.6, 0, 6, 6, null)
  }

  return [
    { part: M.roof, material: LHR.roof },
    { part: M.win, material: LHR.window },
    { part: M.trim, material: LHR.white },
    { part: M.wall, material: LHR.panel },
    { part: M.core, material: finish('lhr-t2-core', 0x5d636a) },
    { part: M.glass, material: PALETTE.glass },
  ]
}

if (import.meta.main) {
  const extras = { bearing: 0, osm: 'way/133146402', height: CROWN + 1 }
  writeLod("Heathrow Terminal 2, The Queen's Terminal", 'london-heathrow-terminal-2.glb', build(false), extras, 8000, 250_000)
  writeLod("Heathrow Terminal 2, The Queen's Terminal", 'london-heathrow-terminal-2.detail.glb', build(true), extras, 40_000, 1_500_000)
}
