/**
 * 1910 Harris County Courthouse (301 Fannin Street, 1910, Lang & Witchell;
 * restored 2011), Houston — original procedural geometry, CC0-1.0.
 * bun generators/hou-1910-courthouse.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Built turned to the downtown grid: catalog bearing 34.0 (the
 * outline's walls run at 34.0° / 124.0°), so model +y points north-east
 * (Congress Avenue front) and +x south-east (San Jacinto side). Anchor =
 * centroid of the OSM outline way/54046920, 29.7610836,-95.3597322; the
 * lidar puts the dome's peak on it to within 0.5 m.
 *
 * Identity, in order: the pale columned drum, ribbed dome and lantern
 * over the middle; a four-way symmetric block with a pedimented,
 * columned portico on every side, the two end porticos (±y) full height
 * and projecting, the two side ones (±x) lower and wider; the cross of
 * red-tiled gables behind the pediments, meeting at the drum; the buff
 * brick walls over a rusticated pink granite ground storey. Symmetric
 * about both axes, and drawn mirrored.
 *
 * Evidence:
 *  - plan: OSM outline way/54046920 read in the turned frame: main block
 *    x ±19.7, y ±26.4; end porticos x ±10.3 projecting to y ±28.2; side
 *    porticos y ±13.5 projecting to x ±22.8. Dome part way/503659681, a
 *    circle r ~9.4 (the drum's base).
 *  - heights: USGS 3DEP lidar TX_Coastal_B1_2018 (flown 2018), 0.5 m grid,
 *    street ground 1.9 m above the grid minimum. Measured above the street:
 *    main parapet 25.4; end pediment apex 28.2 (ridge running y, ±10.3 m);
 *    side gable ridge 29.4 (running x, |y| < 10); side portico top 21.0;
 *    drum base ring 30-31; drum top ~40.6; dome ~48.5; lantern finial 56.1.
 *  - the floors (granite storey to 6.5 m, three brick storeys, attic,
 *    cornice at 23.8), the six giant columns of each portico, the drum's
 *    pilastered peristyle with tall windows, the ribbed dome, the lantern:
 *    from the photos below, scaled on the lidar heights (estimates).
 *  - roof: NAIP (USGS) shows the four gable arms red tile, the corner bays
 *    and the dome pale. Wikipedia: the cupola was removed in 1930 and a
 *    replica restored in the 2009-11 renovation; the photos are after it.
 *  - colour: walls buff brick (#c8b49c sunlit in i_am_jim's photo), drawn
 *    #dcc9ae; ground storey pink-grey granite (#b8a597), drawn #cdbcae;
 *    columns, cornices and the dome cream stone (#d8d0c4), drawn #e8e1d4
 *    and trim; roof tile #c07f68 (palette terracotta pulled light).
 *    NOTE: the brief described a copper-green dome; every licensed photo
 *    since the 2011 restoration shows it pale cream stone, so it is drawn
 *    pale. Before restoration it was also pale (Feller 2013 photos).
 *  - night: no licensed night photo found; the dome, drum and porticos
 *    are given a floodlight share (estimate, as Houston's other civic
 *    landmarks are lit), windows lit.
 *
 * Photos (Wikimedia Commons, all evidence):
 *  - Harris_County_1910_Courthouse_Restored_Houston_Texas.jpg, i_am_jim,
 *    CC BY-SA 3.0
 *    https://commons.wikimedia.org/wiki/File:Harris_County_1910_Courthouse_Restored_Houston_Texas.jpg
 *  - Harris_County_Courthouse_of_1910_Houston_(HDR).jpg, Ed Uthman, CC BY 3.0
 *    https://commons.wikimedia.org/wiki/File:Harris_County_Courthouse_of_1910_Houston_(HDR).jpg
 *  - Harris_County_1910_Courthouse_-_Flickr_-_pinemikey.jpg, Michael
 *    Martin, CC BY-SA 2.0
 *    https://commons.wikimedia.org/wiki/File:Harris_County_1910_Courthouse_-_Flickr_-_pinemikey.jpg
 *  - Harris_County_Courthouse_(1910),_Houston,_Texas_(8304873108).jpg,
 *    Nicolas Henderson, CC BY 2.0
 *    https://commons.wikimedia.org/wiki/File:Harris_County_Courthouse_(1910),_Houston,_Texas_(8304873108).jpg
 *  - Houston_Harris_County_Courthouse.JPG, Anne-Gaëlle Bergé, CC BY-SA 3.0
 *    https://commons.wikimedia.org/wiki/File:Houston_Harris_County_Courthouse.JPG
 *  - 1910_Harris_County_Courthouse,_Houston,_Texas_1704011459_(33048408553).jpg,
 *    Patrick Feller, CC BY 2.0 (the corner, both pediments)
 *    https://commons.wikimedia.org/wiki/File:1910_Harris_County_Courthouse,_Houston,_Texas_1704011459_(33048408553).jpg
 *  USGS NAIP for the plan and roof colours. Published: 1910, Lang &
 *  Witchell, six storeys, Classical Revival (Wikipedia; NRHP 1981).
 *  No commercial imagery.
 *
 * Left out: the pediment sculpture, the balustrades, the dome's ribs and
 * consoles, the corner pavilions' raised attics, the entrance stairs, the
 * lettering, mullions.
 *
 * Doubts: column counts and the storey heights are read from photos at an
 * angle; the two pediment pitches differ because the lidar ridges differ
 * (28.2 vs 29.4 m), which may partly be roof plant on the side ridge.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cap, inset, lathe, panel, rect, save, walls, type XY } from './chi-aon-center'

const MX = 19.7, MY = 26.4 // main block half-sizes
const FX = 10.3, FY = 28.2 // end porticos (±y): half-width, outer face
const SY = 13.5, SX = 22.8 // side porticos (±x)
const BASE = 6.5, CORNICE = 23.8, PARAPET = 25.4, FLAT = 25.0
const END_APEX = 28.2, SIDE_APEX = 29.4, SIDE_HALF = 10

function build() {
  const brick = new Part(), granite = new Part(), trim = new Part(), win = new Part(), tile = new Part(), pale = new Part()

  // ---- main block --------------------------------------------------------
  const main = rect(-MX, -MY, MX, MY)
  walls(granite, inset(main, -0.15), 0, BASE)
  cap(granite, inset(main, -0.15), BASE) // the granite's top ledge (hidden under brick except the lip)
  walls(brick, main, BASE, CORNICE - 0.8)
  const corn = inset(main, -0.45)
  walls(trim, corn, CORNICE - 0.8, CORNICE)
  ring(trim, corn, main, CORNICE - 0.8, false)
  ring(trim, corn, main, CORNICE, true)
  walls(brick, main, CORNICE, PARAPET - 0.3)
  walls(trim, main, PARAPET - 0.3, PARAPET, inset(main, 0.3))
  walls(trim, inset(main, 0.8).reverse(), FLAT, PARAPET, inset(main, 0.8).reverse())
  ring(trim, inset(main, 0.3), inset(main, 0.8), PARAPET, true)
  cap(pale, inset(main, 0.8), FLAT)

  // ---- porticos, mirrored ------------------------------------------------
  // In the frame turned by `q` quarter turns: an end portico on +y.
  for (const s of [1, -1]) {
    // End portico at y = s*MY .. s*FY.
    const T = (x: number, y: number): XY => [x, s * y]
    const box = (part: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number) => {
      const r = s > 0 ? rect(x0, y0, x1, y1) : rect(x0, -y1, x1, -y0)
      walls(part, r, z0, z1); cap(part, r, z1)
    }
    box(granite, -FX - 0.15, FX + 0.15, MY, FY + 0.15, 0, BASE)
    box(brick, -FX, FX, MY, FY, 19.0, 21.0)
    box(trim, -FX - 0.1, FX + 0.1, MY, FY + 0.1, 20.6, 21.0)
    box(brick, -FX, FX, MY, FY, 21.0, CORNICE - 0.8)
    box(trim, -FX - 0.3, FX + 0.3, MY, FY + 0.2, CORNICE - 0.8, CORNICE)
    for (const x of [-8.25, -4.95, -1.65, 1.65, 4.95, 8.25]) {
      const [cx, cy] = T(x, 27.3)
      column(trim, cx, cy, 0.68, BASE, 19.0)
    }
    gable(tile, brick, trim, 'y', s, FX, CORNICE, END_APEX, FY + 0.2)

    // Side portico at x = s*MX .. s*SX.
    const sbox = (part: Part, y0: number, y1: number, x0: number, x1: number, z0: number, z1: number) => {
      const r = s > 0 ? rect(x0, y0, x1, y1) : rect(-x1, y0, -x0, y1)
      walls(part, r, z0, z1); cap(part, r, z1)
    }
    sbox(granite, -SY - 0.15, SY + 0.15, MX, SX + 0.15, 0, BASE)
    sbox(brick, -SY, SY, MX, SX, 17.5, 19.6)
    sbox(trim, -SY - 0.3, SY + 0.3, MX, SX + 0.25, 19.6, 21.0)
    for (const y of [-11.5, -6.9, -2.3, 2.3, 6.9, 11.5]) column(trim, s * 21.7, y, 0.62, BASE, 17.5)
    gable(tile, brick, trim, 'x', s, SIDE_HALF, CORNICE, SIDE_APEX, MX + 0.45)
  }
  // The gable roofs run in to the drum.
  roofRun(tile, 'y', 7.5, FLAT, END_APEX, 0, FY - 0.5)
  roofRun(tile, 'x', 7.8, FLAT, SIDE_APEX, 0, MX - 0.3)

  // ---- windows -----------------------------------------------------------
  const ground: [number, number] = [1.6, 5.2]
  const mainRows: [number, number][] = [[7.6, 12.4], [13.4, 18.3]]
  const attic: [number, number] = [19.9, 22.4]
  const bay = (a: XY, b: XY, s: number, w: number, rows: [number, number][]) => {
    for (const [z0, z1] of rows) panel(win, a, b, s - w / 2, s + w / 2, z0, z1, 0.05)
  }
  for (const s of [1, -1]) {
    // end faces (y = s*MY), the corner bays beside the portico
    const ea: XY = s > 0 ? [MX, MY] : [-MX, -MY], eb: XY = s > 0 ? [-MX, MY] : [MX, -MY]
    for (const d of [2.4, 7.1, 32.3, 37.0]) bay(ea, eb, d, 2.0, [ground, ...mainRows, attic])
    // behind the end portico's columns, and in its granite base / attic
    for (const x of [-6.6, -3.3, 0, 3.3, 6.6]) bay(ea, eb, MX - s * s * x, 1.5, mainRows)
    const pa: XY = s > 0 ? [FX, FY] : [-FX, -FY], pb: XY = s > 0 ? [-FX, FY] : [FX, -FY]
    for (const x of [-6.6, -3.3, 0, 3.3, 6.6]) {
      bay(pa, pb, FX - x, 1.5, [[21.4, 22.6]])
      bay(pa, pb, FX - x, x === 0 ? 2.2 : 1.5, [ground])
    }
    // long faces (x = s*MX), the bays beyond the side portico
    const la: XY = s > 0 ? [MX, -MY] : [-MX, MY], lb: XY = s > 0 ? [MX, MY] : [-MX, -MY]
    for (const d of [2.6, 6.8, 11.0, 41.8, 46.0, 50.2]) bay(la, lb, d, 2.0, [ground, ...mainRows, attic])
    for (const y of [-9.2, -4.6, 0, 4.6, 9.2]) bay(la, lb, MY + y, 1.5, [...mainRows, attic])
    const qa: XY = s > 0 ? [SX, -SY] : [-SX, SY], qb: XY = s > 0 ? [SX, SY] : [-SX, -SY]
    for (const y of [-9.2, -4.6, 0, 4.6, 9.2]) bay(qa, qb, SY + y, y === 0 ? 2.2 : 1.5, [ground])
  }

  // ---- dome --------------------------------------------------------------
  lathe(brick, 0, 0, [[9.2, 22], [9.2, 30.0]], 16)
  lathe(trim, 0, 0, [[9.25, 30.0], [9.6, 30.0], [9.6, 30.6], [7.2, 30.6]], 16)
  lathe(pale, 0, 0, [[7.2, 30.6], [7.2, 39.6]], 16, Math.PI / 16)
  for (let k = 0; k < 16; k++) {
    const a = (k / 16) * 2 * Math.PI
    column(trim, 7.7 * Math.cos(a), 7.7 * Math.sin(a), 0.42, 30.6, 39.6, 8)
  }
  // tall windows in alternate bays, facing the eight directions
  for (let k = 0; k < 8; k++) {
    const a = ((k + 0.25) / 8) * 2 * Math.PI, d = 0.13, r = 7.27
    const P = (t: number, z: number): V3 => [r * Math.cos(t), r * Math.sin(t), z]
    for (const [t0, t1] of [[a - d, a], [a, a + d]]) win.quad(P(t0, 32.0), P(t1, 32.0), P(t1, 38.6), P(t0, 38.6))
  }
  lathe(trim, 0, 0, [[7.2, 39.6], [8.25, 39.6], [8.25, 40.6], [7.5, 40.6], [7.5, 41.3]], 16)
  {
    // the dome: a raised hemisphere, 7.5 m across the base to the lantern
    const prof: XY[] = []
    for (let i = 0; i <= 7; i++) {
      const t = (i / 7) * (Math.PI / 2) * 0.86
      prof.push([7.5 * Math.cos(t), 41.3 + 7.4 * Math.sin(t)])
    }
    lathe(pale, 0, 0, prof, 16)
    const top = prof[prof.length - 1]
    lathe(pale, 0, 0, [[top[0], top[1]], [1.7, top[1]], [1.7, 52.0]], 12)
    lathe(trim, 0, 0, [[1.7, 52.0], [2.05, 52.0], [2.05, 52.5], [1.5, 52.5], [1.0, 53.4], [0.35, 53.9], [0.35, 55.4], [0.0, 56.1]], 12)
    for (let k = 0; k < 8; k++) {
      const a = ((k + 0.5) / 8) * 2 * Math.PI, d = 0.18, r = 1.74
      const P = (t: number, z: number): V3 => [r * Math.cos(t), r * Math.sin(t), z]
      win.quad(P(a - d, 49.4), P(a + d, 49.4), P(a + d, 51.4), P(a - d, 51.4))
    }
  }

  // Floodlight: the dome, drum and porticos (estimate; see header).
  const flood = (p: V3, n: V3) => {
    const r = Math.hypot(p[0], p[1])
    if (n[2] > 0.8) return 0.2
    if (r < 10 && p[2] > 22) return 0.9
    return Math.abs(p[1]) > MY - 0.1 || Math.abs(p[0]) > MX - 0.1 ? 0.45 : 0.3
  }
  return [
    { part: brick, material: { ...finish('buff-brick', 0xdcc9ae), floodlight: flood } },
    { part: granite, material: { ...finish('pink-granite', 0xcdbcae), floodlight: flood } },
    { part: trim, material: { ...finish('cream-stone', 0xece5d8), floodlight: flood } },
    { part: win, material: PALETTE.window },
    { part: tile, material: finish('roof-tile', 0xc07f68) },
    { part: pale, material: { ...finish('dome-stone', 0xe3dccf), floodlight: flood } },
  ]
}

/** A horizontal band between two same-length rings: outer `o`, inner `i`, facing up or down. */
function ring(p: Part, o: XY[], i: XY[], z: number, up: boolean) {
  for (let k = 0; k < o.length; k++) {
    const j = (k + 1) % o.length
    const A: V3 = [o[k][0], o[k][1], z], B: V3 = [o[j][0], o[j][1], z], C: V3 = [i[j][0], i[j][1], z], D: V3 = [i[k][0], i[k][1], z]
    if (up) p.quad(A, B, C, D); else p.quad(A, D, C, B)
  }
}

/** A round column, smooth-shaded, open at both ends (they sit on and under masonry). */
function column(p: Part, x: number, y: number, r: number, z0: number, z1: number, seg = 10) {
  lathe(p, x, y, [[r, z0], [r, z1]], seg)
}

/** A triangle or quad wound so that it faces along `n`. */
function oriented(p: Part, pts: V3[], n: V3) {
  const [a, b, c] = pts
  const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  const g = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
  const q = g[0] * n[0] + g[1] * n[1] + g[2] * n[2] >= 0 ? pts : [...pts].reverse()
  if (q.length === 3) p.tri(q[0], q[1], q[2]); else p.quad(q[0], q[1], q[2], q[3])
}

/**
 * The pediment at one end of a gable along `axis` (signed by `s`): the
 * tympanum triangle in `wall` on the face at `face`, and a raking cornice
 * in `trim` standing proud of it along both slopes.
 */
function gable(_roof: Part, wall: Part, trim: Part, axis: 'x' | 'y', s: number, half: number, z0: number, z1: number, face: number) {
  // (u across, v along the axis outward) to the frame
  const M = (u: number, v: number, z: number): V3 => (axis === 'y' ? [u, s * v, z] : [s * v, u, z])
  const out: V3 = axis === 'y' ? [0, s, 0] : [s, 0, 0]
  oriented(wall, [M(half, face, z0), M(0, face, z1), M(-half, face, z0)], out)
  const w = 0.6, f = face + 0.3, back = face - 0.8, e = half + 0.45
  for (const side of [1, -1]) {
    const A = M(side * e, f, z0 - 0.2), B = M(0, f, z1 + 0.35), C = M(0, f, z1 + 0.35 - w), D = M(side * e, f, z0 - 0.2 - w)
    oriented(trim, [A, B, C, D], out)
    const A2 = M(side * e, back, z0 - 0.2), B2 = M(0, back, z1 + 0.35)
    const slope = (z1 - z0) / half
    oriented(trim, [A, B, B2, A2], axis === 'y' ? [side * slope, 0, 1] : [0, side * slope, 1])
    const D2 = M(side * e, back, z0 - 0.2 - w), C2 = M(0, back, z1 + 0.35 - w)
    oriented(trim, [D, C, C2, D2], axis === 'y' ? [-side * slope, 0, -1] : [0, -side * slope, -1])
    oriented(trim, [A, D, D2, A2], axis === 'y' ? [side, 0, 0] : [0, side, 0])
  }
}

/** The two slopes of a gable running along `axis` from -len to +len. */
function roofRun(p: Part, axis: 'x' | 'y', half: number, z0: number, z1: number, _from: number, len: number) {
  const M = (u: number, v: number, z: number): V3 => (axis === 'y' ? [u, v, z] : [v, u, z])
  const slope = (z1 - z0) / half
  for (const side of [1, -1]) {
    const n: V3 = axis === 'y' ? [side * slope, 0, 1] : [0, side * slope, 1]
    oriented(p, [M(side * half, -len, z0), M(side * half, len, z0), M(0, len, z1), M(0, -len, z1)], n)
    // gable end, behind the pediment
    oriented(p, [M(half, side * len, z0), M(0, side * len, z1), M(-half, side * len, z0)], axis === 'y' ? [0, side, 0] : [side, 0, 0])
  }
}

if (import.meta.main) await save('hou-1910-courthouse', '1910 Harris County Courthouse', [29.7610836, -95.3597322], 34.0, build(), 6500)
