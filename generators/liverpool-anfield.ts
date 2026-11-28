/**
 * Anfield, Liverpool: original procedural geometry, CC0-1.0, no textures.
 * bun generators/liverpool-anfield.ts
 *
 * Writes two levels of detail in the same frame:
 * - models/liverpool-anfield.glb, the low model (<= 6,500 triangles);
 * - models/liverpool-anfield.detail.glb, drawn from zoom 16 (<= 40,000):
 *   the box-section roof trusses with posts, the lattice towers' extra
 *   panels, the rafters in the back soffit.
 * Uses the stadium kit exported by manchester-old-trafford.ts (merge that
 * generator first).
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 39.9: model
 * +y runs along the pitch toward the Anfield Road Stand (north-east), +x
 * across it toward the Sir Kenny Dalglish Stand (south-east). Anchor =
 * area centroid of the leisure=stadium outline way/4830206, lng
 * -2.9608963, lat 53.4309644. Bearing 39.9 = the pitch's long edges (OSM
 * way/124589354, 101.3 x 68.6 m). y = 0 is the lowest ground under the
 * footprint, at the Kop / Dalglish corner; the site falls 4.5 m from the
 * Main / Anfield Road corner to there, and the pitch is built level 2.2 m
 * above it (Mapterhorn, `terrain.ts check`), every outer wall running
 * down to y = 0 (`liftField`). Elevation 0.
 *
 * Identity, in order: the huge three-tier Main Stand (2016) with its
 * pitched roof, a steep translucent front slope up to a kink and a white
 * roof rising on to a high back eave overhanging the brick-and-red colonnade, and the great
 * box-section truss on its front edge on four-legged lattice towers;
 * brick in bold piers over recessed glazing, red glass boxes, grey
 * cladding above and brick stair cores; the Kop's single steep tier under
 * a pitched roof with a lattice along its leading edge and a truss on its
 * ridge, its back with plain red blocks for the mural panels; the Anfield Road Stand (2024) and the Sir Kenny
 * Dalglish Stand, two tiers each, every roof carrying its own exposed
 * truss along the leading edge; red seats; red brick bases under white
 * cladding.
 *
 * Evidence
 *  - OSM (measured in this frame): outline way/4830206 (leisure=stadium,
 *    Q45671) x -94.3..84.8, y -115.1..111.3; pitch x -22..46.6,
 *    y -57.7..44. Stands (building=stadium, no heights): Main Stand
 *    way/188699284 (front x -25.9, back x -94, chamfered back corners to
 *    y -78.4 and 63.4); The Kop way/188699283 (front y -62.1, back
 *    y -110..-115, wrapping the Kop/Dalglish corner to x 77); Sir Kenny
 *    Dalglish Stand way/188699282 (front x 49.5, back x 84.8, y
 *    -58.3..49.9); Anfield Road Stand way/188699281 (front y 47.4, back
 *    y 107.7..111.3, wrapping both corners from x -52.5 to 83.9).
 *  - Published (Wikipedia, "Anfield", retrieved 2026-11): capacity
 *    60,725 (with the 2024 Anfield Road expansion); Main Stand three
 *    tiers (rebuilt 2014-16, the lower part 1906); the Kop single tier
 *    (1994); Anfield Road and Sir Kenny Dalglish Stands two tiers.
 *  - Photos (Wikimedia Commons, all EVIDENCE):
 *    - "2023 07 31 arne mueseler 00001/00005/00008/00010/00027
 *      -Verbessert-RR", Arne Müseler, CC BY-SA 2.0: aerials from the
 *      north, west, north-west and south-west (July 2023, the Anfield
 *      Road Stand under construction, its truss and roof in place): the
 *      Main Stand's pitched roof, its glazed front slope and white back,
 *      the truss and its towers, the trusses on the other three roofs,
 *      the brick bases, white cladding, the corner blocks;
 *    - "Anfield Main Stand from Anfield Road.jpg" and "Anfield Main Stand
 *      from Walton Breck Road.jpg", Rodhullandemu, CC BY-SA 4.0: the Main
 *      Stand's brick ends, the roof's end profile, the red colonnade and
 *      glass boxes, the lattice towers at the front corners;
 *    - "Anfield stadium in May 2024.jpg" and "Anfield Road Stand in May
 *      2024.jpg", FYI2023, CC0: inside: the Dalglish Stand's two
 *      tiers under its truss, the finished Anfield Road Stand's tiers and
 *      roof;
 *    - "Across Stanley Park to Anfield Stadium - geograph.org.uk -
 *      7693643", Anthony Parkes, CC BY-SA 2.0: the Main Stand's silhouette
 *      from the north.
 *  - Terrain (Mapterhorn, `terrain.ts check`): 4.5 m of relief over the
 *    footprint, the pitch about 2.2 m over the lowest corner.
 *
 * Measured (OSM): every plan line. Published: tier counts. Estimated from
 * the photos (no OSM or published heights): the Main Stand's roof (leading
 * edge 34 m, the glazed slope rising to a kink at 44.5 m 20 m back, the
 * white roof rising on to a back eave of 48 m over an open soffit,
 * overhanging the colonnade by 4 m), its truss (on the kink, top chord
 * 51.5 m, from tower to tower 126 m), the Kop's roof (30.5 m),
 * the Anfield Road Stand's (35 m), the Dalglish Stand's (26 m), their
 * trusses 6 m deep along the leading edges; the tier profiles; the
 * facade bands. The heights are scaled from doors and storeys in the
 * Rodhullandemu photos and the stands' proportions in the aerials, and
 * could be a few metres out.
 * Look-only: none.
 * Doubts: the Anfield Road Stand is drawn as finished in 2024 from the
 * inside photos and the 2023 aerials (cladding nearly complete); its outer
 * facade is simplified. The red-brick terraced houses round the stadium
 * are not part of it and are left to the map.
 */
import { Part, type MaterialSpec, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import {
  add, at, bead, crs, latticeTower, lerp, lerp3, liftField, nrm, oq, prism, rod, roofBlock, sample, scl, seatBlock, sub, writeLods, zAt, UP,
  type PP, type St,
} from './manchester-old-trafford'

const ID = 'liverpool-anfield'
/** The pitch's height over the lowest ground under the footprint (Mapterhorn, `terrain.ts check`). */
const FIELD = 2.2

const M = {
  brick: { ...finish('anfield-brick', 0xb8705a), floodlight: (q: V3, n: V3) => (Math.abs(n[2]) < 0.4 && q[2] < 30 ? 0.3 : 0) } as MaterialSpec,
  red: finish('lfc-red', 0xc8403c),
  white: { ...finish('roof-white', 0xdfe2e3, 0.6), doubleSided: true } as MaterialSpec,
  steel: finish('steel-grey', 0xa9b0b6, 0.55),
  window: PALETTE.window as MaterialSpec,
  lamp: finish('lamp-floodlight', 0xd9dad6, 0.5),
}

const line = (x0: number, y0: number, x1: number, y1: number, n: [number, number], count = 1): St[] =>
  Array.from({ length: count + 1 }, (_, i) => ({ o: [lerp(x0, x1, i / count), lerp(y0, y1, i / count), 0] as V3, n: [n[0], n[1], 0] as V3 }))

/** A box of section w (across, horizontal) x h (vertical-ish) from a to b. */
function boxBeam(p: Part, a: V3, b: V3, w: number, h: number) {
  const t = nrm(sub(b, a))
  const s = nrm(Math.abs(t[2]) > 0.95 ? crs(t, [1, 0, 0]) : crs(t, UP))
  const u = crs(s, t)
  const c = (q: V3, i: number, j: number): V3 => add(q, add(scl(s, (i * w) / 2), scl(u, (j * h) / 2)))
  const ring = (q: V3) => [c(q, -1, -1), c(q, 1, -1), c(q, 1, 1), c(q, -1, 1)]
  const A = ring(a), B = ring(b)
  for (let k = 0; k < 4; k++) {
    const l = (k + 1) % 4
    const mid = scl(add(add(A[k], A[l]), add(B[k], B[l])), 0.25), cen = scl(add(a, b), 0.5)
    oq(p, A[k], A[l], B[l], B[k], sub(mid, cen))
  }
  oq(p, A[0], A[1], A[2], A[3], scl(t, -1))
  oq(p, B[0], B[1], B[2], B[3], t)
}

function build(detail: boolean) {
  const brick = new Part(), red = new Part(), white = new Part(), steel = new Part(), win = new Part(), lamp = new Part()
  const RS = detail ? 6 : 4
  const r = detail ? 0.45 : 0.85

  /** Facade on a straight stand: horizontal bands [z0, z1, part, offset] between stations a and b at D. */
  const facade = (a: St, b: St, D: number, bands: [number, number, Part, number?][]) => {
    for (const [z0, z1, p, off] of bands) oq(p, at(a, D + (off ?? 0), z0), at(b, D + (off ?? 0), z0), at(b, D + (off ?? 0), z1), at(a, D + (off ?? 0), z1), a.n)
  }
  /** Colour blocks (murals, boxes) flush on a facade: [along0, along1, z0, z1, part] measured from station a toward b. */
  const blocks = (a: St, b: St, D: number, bl: [number, number, number, number, Part][]) => {
    const L = Math.hypot(b.o[0] - a.o[0], b.o[1] - a.o[1])
    for (const [s0, s1, z0, z1, p] of bl) {
      const A: St = { o: lerp3(a.o, b.o, s0 / L), n: a.n }, B: St = { o: lerp3(a.o, b.o, s1 / L), n: a.n }
      oq(p, at(A, D + 0.08, z0), at(B, D + 0.08, z0), at(B, D + 0.08, z1), at(A, D + 0.08, z1), a.n)
    }
  }
  /**
   * A bold longitudinal truss: box-section chords and diagonals (flat
   * Warren), top chord at zt, bottom chord at zb, n panels.
   */
  const boldTruss = (p0: [number, number], p1: [number, number], zb: number, zt: number, n: number, w: number) => {
    const bot = sample([p0[0], p0[1], zb], [p1[0], p1[1], zb], n), top = sample([p0[0], p0[1], zt], [p1[0], p1[1], zt], n)
    const cw = w, ch = detail ? 1.1 : 1.4
    for (let i = 0; i < n; i++) {
      boxBeam(steel, top[i], top[i + 1], cw, ch)
      boxBeam(steel, bot[i], bot[i + 1], cw, ch)
      boxBeam(steel, i % 2 ? top[i] : bot[i], i % 2 ? bot[i + 1] : top[i + 1], cw * 0.8, ch * 0.7)
      if (detail && i > 0) boxBeam(steel, bot[i], top[i], cw * 0.6, ch * 0.5)
    }
  }
  /** Lamp beads under a leading edge from a to b. */
  const lamps = (a: V3, b: V3) => {
    const n = Math.max(1, Math.round(Math.hypot(...sub(b, a)) / (detail ? 4.5 : 9)))
    for (let k = 0; k < n; k++) bead(lamp, lerp3(a, b, (k + 0.5) / n), detail ? 0.6 : 0.9)
  }
  /** A stair core: a brick drum on a facade at (x, y), w across, to z. */
  const core = (x: number, y: number, w: number, z: number, part = brick) => prism(part, [[x - w / 2, y - w / 2], [x + w / 2, y - w / 2], [x + w / 2, y + w / 2], [x - w / 2, y + w / 2]], 0, z)

  // ---------------------------------------------------------------- Main Stand
  {
    const n: [number, number] = [-1, 0]
    const XF = -25.9, D = 68
    // the leading edge 4 m in from the seats' front (the front rows open), the translucent slope (grey) up to the kink, the white roof on to the back eave
    const roofTop: PP[] = [[4, 31.5, steel], [4, 34, steel], [20, 44.5, white], [72, 48, null]]
    const under = (d: number) => zAt(roofTop.slice(1), d) - 1.5
    const seats: PP[] = [[0, 0, red], [0, 1.2, red], [21, 9, win], [21, 12.5, red], [33, 19.5, win], [33, 23, red], [60, 41, steel], [60, under(60), null]]
    seatBlock(line(XF, -62, XF, 47.4, n, 6), seats, D, under, brick)
    roofBlock(line(XF, -78, XF, 63.4, n, 6), roofTop, 1.5, steel, steel)
    lamps(at({ o: [XF, -62, 0], n: [-1, 0, 0] }, 5, 30.6), at({ o: [XF, 47.4, 0], n: [-1, 0, 0] }, 5, 30.6))
    // the back: brick to 26 m in bold piers over recessed glazing, red glass boxes along the top, grey cladding with a dark glazing strip above
    const sts = line(XF, -66, XF, 50, n, 1)
    facade(sts[0], sts[1], D, [[0, 6, brick], [6, 24, win, -1.6], [24, 26, brick], [26, 38, steel]])
    facade(sts[0], sts[1], D, [[30, 34, win, 0.06]])
    for (let y = -64; y <= 48; y += 8) prism(brick, [[XF - D, y - 1.6], [XF - D, y + 1.6], [XF - D + 1.7, y + 1.6], [XF - D + 1.7, y - 1.6]], 6, 24)
    for (let y = -60; y <= 44; y += 8) prism(red, [[XF - D - 1.2, y], [XF - D - 1.2, y + 4], [XF - D + 0.1, y + 4], [XF - D + 0.1, y]], 20, 26)
    // the open soffit over the back: a dark recessed wall up to the roof's underside
    const sw = line(XF, -78, XF, 63.4, n, 1)
    oq(steel, at(sw[0], D - 4, 38), at(sw[1], D - 4, 38), at(sw[1], D - 4, under(D - 4)), at(sw[0], D - 4, under(D - 4)), [-1, 0, 0])
    oq(steel, at(sw[0], D - 4, 38), at(sw[1], D - 4, 38), at(sw[1], D, 38), at(sw[0], D, 38), [0, 0, 1])
    // the ends: brick blocks with chamfered back corners, their tops falling with the upper tier toward the front
    const brickZ = (d: number) => Math.min(30, 8 + Math.max(0, d - 3) * (22 / 37))
    const endBlock = (poly: [number, number][]) => prism(brick, poly, 0, poly.map(([x]) => brickZ(XF - x)))
    endBlock([[-94, -66], [-75.6, -78.4], [-52.2, -78], [-39.5, -77.7], [-37.1, -69.1], [-25.9, -62.1], [-25.9, -62], [-94, -62]])
    endBlock([[-94, 50], [-94, 47.4], [-25.9, 47.4], [-38.1, 62.3], [-51.6, 63.3], [-76.6, 63.4]])
    // tall slit windows in the end walls (Rodhullandemu's views)
    for (const [y, s] of [[-78.05, -1], [63.45, 1]] as [number, number][])
      for (const x of [-62, -70]) oq(win, [x - 0.8, y, 7], [x + 0.8, y, 7], [x + 0.8, y, 27], [x - 0.8, y, 27], [0, s, 0])
    // sloped silver bands following the upper tier up to the roof
    for (const [y, s] of [[-78, -1], [63.4, 1]] as [number, number][]) {
      const e: St = { o: [XF, y, 0], n: [-1, 0, 0] }
      const ds = [-3, 3, 20, 40, 64]
      for (let k = 0; k < ds.length - 1; k++)
        oq(steel, at(e, ds[k], brickZ(ds[k])), at(e, ds[k + 1], brickZ(ds[k + 1])), at(e, ds[k + 1], under(ds[k + 1])), at(e, ds[k], under(ds[k])), [0, s, 0])
    }
    // stair cores at the back corners, brick to the cladding
    for (const y of [-71, 56]) core(-91, y, 6, 32)
    // the great truss on the roof's front edge (on the kink), box-section, on lattice towers at both ends
    const xT = XF - 20
    boldTruss([xT, -72], [xT, 58], 45, 52, detail ? 18 : 10, 2.2)
    for (const y of [-72, 58]) latticeTower(steel, [xT, y], 4.5, 45, r * 1.5, RS, detail ? 8 : 4)
    if (detail) for (let y = -74; y <= 59; y += 6) {
      const s: St = { o: [XF, y, 0], n: [-1, 0, 0] }
      rod(steel, at(s, D - 4, under(D - 4) - 0.2), at(s, 72, under(72) - 0.2), 0.3, 4)
    }
    // rafters over the translucent slope
    for (let y = -62; y <= 47; y += detail ? 6 : 12) {
      const s: St = { o: [XF, y, 0], n: [-1, 0, 0] }
      boxBeam(white, at(s, 4, 34.4), at(s, 20, 44.9), 0.6, 0.5)
    }
  }
  // ---------------------------------------------------------------- the Kop
  {
    const n: [number, number] = [0, -1]
    const YF = -62.1, D = 50
    // pitched: from the leading edge up to a ridge 22 m back, down to the back
    const roofTop: PP[] = [[7, 27, steel], [7, 29.5, white], [22, 33.5, white], [50, 30.5, null]]
    const under = (d: number) => zAt(roofTop.slice(1), d) - 1.3
    const seats: PP[] = [[0, 0, red], [0, 1.2, red], [44, 26.5, steel], [44, under(44), null]]
    const sSts = line(49.5, YF, -25.9, YF, n, 4)
    seatBlock(sSts, seats, D, under, brick)
    roofBlock(line(63.7, YF, -37, YF, n, 4), roofTop, 1.3, steel, steel)
    lamps(at(sSts[0], 8, 26.4), at(sSts[4], 8, 26.4))
    const sts = line(63.7, YF, -37, YF, n, 1)
    facade(sts[0], sts[1], D, [[0, 11, brick], [11, 30, steel]])
    // the mural panels as plain colour blocks, a dark glazing strip
    blocks(sts[0], sts[1], D, [[12, 30, 13, 27, red], [36, 54, 13, 27, red], [60, 78, 13, 27, red], [84, 98, 13, 27, red], [0, 100.7, 5, 8, win]])
    for (const x of [-30, 58]) core(x, YF - D + 1.5, 6, 27)
    // the Kop / Dalglish corner block
    const cb: [number, number][] = [[49.5, -58.3], [77, -58.8], [77, -60.9], [70.1, -60.9], [69.9, -77.2], [63.7, -81.6], [63.7, -110.1], [49.5, -110.1]]
    prism(brick, cb, 0, 11)
    prism(steel, cb, 11, 27)
    // the lattice along the leading edge, and the truss along the ridge
    boldTruss([-36, YF - 7], [62, YF - 7], 25.2, 29.3, detail ? 14 : 8, 0.9)
    boldTruss([-36, YF - 22], [62, YF - 22], 33.8, 38.5, detail ? 14 : 8, 1.4)
  }
  // ------------------------------------------------- Sir Kenny Dalglish Stand
  {
    const n: [number, number] = [1, 0]
    const XF = 49.5, D = 35
    const roofTop: PP[] = [[6, 24, steel], [6, 26, white], [35, 24.5, null]]
    const under = (d: number) => zAt(roofTop.slice(1), d) - 1.2
    const seats: PP[] = [[0, 0, red], [0, 1.2, red], [15, 7.5, win], [15, 10.5, red], [30, 20, steel], [30, under(30), null]]
    const sSts = line(XF, -58.3, XF, 49.1, n, 4)
    seatBlock(sSts, seats, D, under, brick)
    roofBlock(sSts, roofTop, 1.2, steel, steel)
    lamps(at(sSts[0], 7, 23.4), at(sSts[4], 7, 23.4))
    const sts = line(XF, -58.3, XF, 49.1, n, 1)
    facade(sts[0], sts[1], D, [[0, 8, brick], [8, 24.5, white]])
    blocks(sts[0], sts[1], D, [[0, 107.4, 11, 14, win], [8, 30, 15.5, 23, red], [40, 64, 15.5, 23, red], [76, 98, 15.5, 23, red]])
    for (const y of [-55, -3, 46]) core(XF + D - 2.6, y, 5, 22)
    boldTruss([XF + 7, -60], [XF + 7, 51], 26.4, 31.5, detail ? 12 : 8, 1.1)
  }
  // ---------------------------------------------------- Anfield Road Stand
  {
    const n: [number, number] = [0, 1]
    const YF = 47.4, D = 60
    const roofTop: PP[] = [[6, 32.5, steel], [6, 35, white], [60, 33.5, null]]
    const under = (d: number) => zAt(roofTop.slice(1), d) - 1.3
    const seats: PP[] = [[0, 0, red], [0, 1.2, red], [22, 9.5, win], [22, 13, red], [52, 30, steel], [52, under(52), null]]
    const sSts = line(-25.9, YF, 49.5, YF, n, 4)
    seatBlock(sSts, seats, D, under, brick)
    roofBlock(line(-38, YF, 76, YF, n, 4), roofTop, 1.3, steel, steel)
    lamps(at(sSts[0], 7, 31.9), at(sSts[4], 7, 31.9))
    const sts = line(-38, YF, 76, YF, n, 1)
    facade(sts[0], sts[1], D, [[0, 8, brick], [8, 33.5, white]])
    blocks(sts[0], sts[1], D, [[0, 114, 14, 18, win], [14, 36, 20, 30, red], [46, 68, 20, 30, red], [78, 100, 20, 30, red]])
    // the corner blocks it wraps
    for (const poly of [
      [[-25.9, 47.4], [-25.9, 107.4], [-41.3, 107.7], [-52.5, 96.6], [-51.6, 63.3], [-38.1, 62.3]],
      [[49.5, 49.1], [83.9, 49.9], [83.2, 58.3], [77.6, 57.9], [76.8, 102.4], [65, 111.3], [49.5, 107.4]],
    ] as [number, number][][]) {
      prism(brick, poly, 0, 8)
      prism(white, poly, 8, 32)
    }
    for (const x of [-34, 70]) core(x, YF + D - 1.5, 6, 31)
    boldTruss([-37, YF + 8], [75, YF + 8], 35.4, 42, detail ? 16 : 10, 1.5)
  }

  const out = [
    { part: brick, material: M.brick },
    { part: red, material: M.red },
    { part: white, material: M.white },
    { part: steel, material: M.steel },
    { part: win, material: M.window },
    { part: lamp, material: M.lamp },
  ]
  // the pitch stands 2.2 m over the lowest ground (the Kop / Dalglish corner)
  liftField(out, FIELD)
  return out
}

if (import.meta.main) {
  writeLods('Anfield', [
    { file: `${ID}.glb`, parts: build(false) },
    { file: `${ID}.detail.glb`, parts: build(true) },
  ])
}
