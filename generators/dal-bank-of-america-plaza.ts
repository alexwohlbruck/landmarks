/**
 * Bank of America Plaza (1985, JPJ Architects), Dallas — original procedural
 * geometry, CC0-1.0.
 * bun generators/dal-bank-of-america-plaza.ts [out.glb]
 *
 * Also exports the small kit the dal- glass towers share (Renaissance Tower,
 * Fountain Place): `turned` (OSM metres into a turned model frame), `slab`
 * (a stacked prism tier), `bar` (a square bar between two points, for trim
 * and neon lines), `ringBands` (pale floor-group lines on a glass wall) and
 * `quadOut` (a quad wound to face away from a point).
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor (the OSM
 * outline's area centroid, -96.8039011 32.7800149) on the ground. Built in a
 * frame turned to bearing 346.6: the plan's sides run at 76.7 and 166.6
 * degrees, so the model's axes follow them.
 *
 * Form: a square glass shaft, about 50 m a side, whose east and west corners
 * are cut back in a staircase of 4 m notches the whole height. Above 240 m
 * the staircase eats further in, in four 8 m steps (248, 256, 264, 272 m),
 * so the top climbs diagonally from both notched corners to a flat roof
 * with a small penthouse (277 m) and a field of short antennas. At night
 * every vertical corner and the top edge of every step is outlined in green
 * argon tube, which is the tower's identity after dark; those lines are
 * `neon-boa-argon` here. The tubes are invisible by day, so the bars are thin
 * (0.42 m) and a pale mint-green: they read as faint mullions by day, and
 * glow green at night. (The map derives a neon's night glow from its day
 * colour, so a paler mint such as #bfe0c6 glows nearly white; #74cf86 is the
 * palest that still glows green beside the night photo.)
 *
 * Night: night photos show the glass mostly dark, with lit floors reading as
 * scattered horizontal strips inside the green outline. So the curtain wall
 * is the unlit finish `boa-glass`, and the pale floor-group lines carry the
 * `window` name: by day they are the light spandrel lines, after dark they
 * glow as lit floors. (A fully lit `window` wall drowned the argon outline.)
 *
 * Sources
 * - OSM (ODbL): outline way/138670474 (height 280.72, 74 levels); parts
 *   way/1492295746 (240), way/1492295747 (248), way/1492295748 (256),
 *   way/1492295749 (264), way/1492295750 (272), way/1492295745 (277). The
 *   plans are used as mapped; the tier heights are OSM's.
 * - Published: 280.7 m, 72 storeys (Wikipedia, "Bank of America Plaza
 *   (Dallas)"; CTBUH). The 280.7 m roof is taken as the antenna field's top;
 *   the penthouse roof is OSM's 277 m.
 * - Lidar: USGS 3DEP TX_Pecos_Dallas_B3_2018 has no returns above ~50 m over
 *   the tower (glass and the point filter), so it gives the footprint only;
 *   its wall returns roughly match the OSM outline (checked by eye, not measured).
 * - Photos (evidence; colours and the step order are from them):
 *   - "View of Bank of America Plaza from Reunion Tower August 2015 20",
 *     Michael Barera, CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:View_of_Bank_of_America_Plaza_from_Reunion_Tower_August_2015_20.jpg
 *   - "Dallas Bank of America Plaza 1", Andreas Praefcke, CC BY 3.0,
 *     https://commons.wikimedia.org/wiki/File:Dallas_Bank_of_America_Plaza_1.jpg
 *   - "Bank of America Plaza 2026", BullDawg2021, CC BY 4.0 (night, the argon
 *     outline), https://commons.wikimedia.org/wiki/File:Bank_of_America_Plaza_2026.jpg
 *   - "Dallas Bank of America Plaza top night", Justin Cozart, CC BY 2.0,
 *     https://commons.wikimedia.org/wiki/File:Dallas_Bank_of_America_Plaza_top_night.jpg
 * Colour: the curtain wall is the light silver-blue the daylight photos show
 * (Praefcke, Barera), near the palette's light window variant.
 * Estimated: the floor-group lines (three storeys of 3.8 m); the penthouse
 * and antenna sizes; the tube size (0.42 m).
 * Not used: "Bank of America Plaza in Dallas - Eric Statzer" (Commons) shows a
 * diamond-patterned facade that matches none of the other photos; it may be
 * mislabelled.
 * Doubts: the brief mentions twin spires; no licensed photo shows any, only a
 * field of short antennas on the flat roof, so none are modelled. Base: the
 * lobby storeys are drawn as the same glass shaft.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { ccw, capRing, outward, finishGlb, turn, type XY } from './sea-columbia-center'

// ---------------------------------------------------------------- shared kit

/** Rotate OSM east/north metres into a model frame turned to `bearing`. */
export function turned(bearing: number) {
  const b = (bearing * Math.PI) / 180, c = Math.cos(b), s = Math.sin(b)
  return (r: XY[]): XY[] => r.map(([e, n]) => [e * c - n * s, e * s + n * c] as XY)
}

/** A quad wound so its face points away from `from`. */
export function quadOut(part: Part, a: V3, b: V3, c: V3, d: V3, from: V3) {
  const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  const n = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
  const m = [(a[0] + c[0]) / 2 - from[0], (a[1] + c[1]) / 2 - from[1], (a[2] + c[2]) / 2 - from[2]]
  if (n[0] * m[0] + n[1] * m[1] + n[2] * m[2] >= 0) part.quad(a, b, c, d)
  else part.quad(a, d, c, b)
}

/** A square bar of width `w` from a to b: four sides and two ends. */
export function bar(part: Part, a: V3, b: V3, w: number, h = w) {
  const d: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]]
  const L = Math.hypot(...d), t: V3 = [d[0] / L, d[1] / L, d[2] / L]
  // two perpendiculars; for a vertical bar use x and y
  let p: V3 = Math.abs(t[2]) > 0.9 ? [1, 0, 0] : [0, 0, 1]
  const dot = p[0] * t[0] + p[1] * t[1] + p[2] * t[2]
  p = [p[0] - t[0] * dot, p[1] - t[1] * dot, p[2] - t[2] * dot]
  const pl = Math.hypot(...p); p = [p[0] / pl, p[1] / pl, p[2] / pl]
  const q: V3 = [t[1] * p[2] - t[2] * p[1], t[2] * p[0] - t[0] * p[2], t[0] * p[1] - t[1] * p[0]]
  const off = (o: V3, i: number, j: number): V3 => [o[0] + p[0] * i * w / 2 + q[0] * j * h / 2, o[1] + p[1] * i * w / 2 + q[1] * j * h / 2, o[2] + p[2] * i * w / 2 + q[2] * j * h / 2]
  const ring: [number, number][] = [[-1, -1], [1, -1], [1, 1], [-1, 1]]
  const A = ring.map(([i, j]) => off(a, i, j)), B = ring.map(([i, j]) => off(b, i, j))
  const C: V3 = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2]
  for (let k = 0; k < 4; k++) { const l = (k + 1) % 4; quadOut(part, A[k], A[l], B[l], B[k], C) }
  quadOut(part, A[0], A[1], A[2], A[3], C)
  quadOut(part, B[0], B[1], B[2], B[3], C)
}

/** The walls of a closed counter-clockwise ring between z0 and z1, flat-shaded. */
export function walls(part: Part, r: XY[], z0: number, z1: number) {
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    part.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
  }
}

/** A prism tier: walls, and its top cap. */
export function slab(wall: Part, roof: Part, r: XY[], z0: number, z1: number) {
  walls(wall, r, z0, z1)
  capRing(roof, r, z1)
}

/**
 * Pale horizontal lines on every wall of a ring, `every` metres apart from
 * the ground, `t` tall, set `proud` off the wall, stopping `inset` short of
 * each corner so nothing pokes past an edge.
 */
export function ringBands(part: Part, r: XY[], z0: number, z1: number, every: number, t: number, proud = 0.05, inset = 0.4) {
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length], n = outward(a, b)
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 2 * inset + 0.5) continue
    const tx = (b[0] - a[0]) / L, ty = (b[1] - a[1]) / L
    const A: XY = [a[0] + tx * inset + n[0] * proud, a[1] + ty * inset + n[1] * proud]
    const B: XY = [b[0] - tx * inset + n[0] * proud, b[1] - ty * inset + n[1] * proud]
    for (let z = Math.ceil((z0 + t) / every) * every; z < z1 - t; z += every)
      part.quad([A[0], A[1], z - t / 2], [B[0], B[1], z - t / 2], [B[0], B[1], z + t / 2], [A[0], A[1], z + t / 2])
  }
}

/** Convex corners of a counter-clockwise ring. */
export const convex = (r: XY[]) => r.filter((_, i) => turn(r, i) > 1)

// ---------------------------------------------------------------- the model

const BEARING = 346.6

function build() {
  // OSM east/north metres about the anchor, then turned into the model frame.
  const T = turned(BEARING)
  // The rings below were taken about a point 6.45 m east, 2.59 m south of the
  // anchor; SHIFT moves them onto it.
  const SHIFT: XY = [6.45, -2.59]
  const P = (r: XY[]) => ccw(T(r.map(([e, n]) => [e + SHIFT[0], n + SHIFT[1]] as XY)))
  const OUT = P([[9.8, 34.3], [10.7, 30.4], [14.6, 31.3], [21.7, 1.7], [17.8, 0.8], [18.7, -3.1], [14.8, -4.0], [15.8, -7.8], [11.9, -8.8], [12.8, -12.6], [8.9, -13.5], [9.8, -17.4], [5.9, -18.3], [6.8, -22.2], [-22.7, -29.1], [-23.6, -25.3], [-27.5, -26.2], [-34.6, 3.5], [-30.7, 4.4], [-31.6, 8.2], [-27.7, 9.2], [-28.6, 13.0], [-24.7, 13.9], [-25.7, 17.8], [-21.7, 18.7], [-22.7, 22.6], [-18.8, 23.5], [-19.7, 27.3]])
  const T248 = P([[5.9, -18.3], [9.8, -17.4], [8.9, -13.5], [7.9, -9.7], [11.9, -8.8], [10.9, -4.9], [14.8, -4.0], [18.7, -3.1], [17.8, 0.8], [21.7, 1.7], [14.6, 31.3], [10.7, 30.4], [9.8, 34.3], [-19.7, 27.3], [-18.8, 23.5], [-22.7, 22.6], [-21.7, 18.7], [-20.8, 14.8], [-24.7, 13.9], [-23.8, 10.1], [-27.7, 9.2], [-31.6, 8.2], [-30.7, 4.4], [-34.6, 3.5], [-27.5, -26.2], [-23.6, -25.3], [-22.7, -29.1], [6.8, -22.2]])
  const T256 = P([[21.7, 1.7], [14.6, 31.3], [10.7, 30.4], [9.8, 34.3], [-19.7, 27.3], [-18.8, 23.5], [-17.8, 19.6], [-21.7, 18.7], [-20.8, 14.8], [-24.7, 13.9], [-23.8, 10.1], [-27.7, 9.2], [-26.8, 5.3], [-30.7, 4.4], [-34.6, 3.5], [-27.5, -26.2], [-23.6, -25.3], [-22.7, -29.1], [6.8, -22.2], [5.9, -18.3], [5.0, -14.4], [8.9, -13.5], [7.9, -9.7], [11.9, -8.8], [10.9, -4.9], [14.8, -4.0], [13.9, -0.1], [17.8, 0.8]])
  const T264 = P([[-14.9, 24.4], [10.7, 30.4], [16.9, 4.6], [13.0, 3.7], [14.8, -4.0], [10.9, -4.9], [11.9, -8.8], [7.9, -9.7], [8.9, -13.5], [5.0, -14.4], [1.1, -15.4], [2.0, -19.2], [-23.6, -25.3], [-29.8, 0.5], [-25.9, 1.4], [-26.8, 5.3], [-27.7, 9.2], [-23.8, 10.1], [-24.7, 13.9], [-20.8, 14.8], [-21.7, 18.7], [-17.8, 19.6], [-14.0, 20.5]])
  const T272 = P([[8.9, -13.5], [5.0, -14.4], [1.1, -15.4], [-20.7, -20.5], [-25.9, 1.4], [-26.8, 5.3], [-27.7, 9.2], [-23.8, 10.1], [-24.7, 13.9], [-20.8, 14.8], [-21.7, 18.7], [-17.8, 19.6], [-14.0, 20.5], [7.8, 25.6], [13.0, 3.7], [14.8, -4.0], [10.9, -4.9], [11.9, -8.8], [7.9, -9.7]])
  const PENT = P([[-22.2, 12.6], [-8.0, 15.9], [-5.3, 4.3], [6.5, 7.0], [9.8, -7.2], [-7.2, -11.2], [-10.4, 2.5], [-19.3, 0.4]])
  // OSM rings repeat collinear points where a step was dropped; drop them so
  // corners are only real corners.
  const clean = (r: XY[]) => r.filter((_, i) => Math.abs(turn(r, i)) > 1)
  const tiers: [XY[], number, number][] = [
    [clean(OUT), 0, 240], [clean(T248), 240, 248], [clean(T256), 248, 256],
    [clean(T264), 256, 264], [clean(T272), 264, 272],
  ]

  const glass = new Part(), lines = new Part(), roof = new Part(), neon = new Part(), metal = new Part()
  const STOREY = 3.8
  for (const [r, z0, z1] of tiers) {
    slab(glass, roof, r, z0, z1)
    ringBands(lines, r, z0 + 6, z1, 3 * STOREY, 0.9)
  }
  // the penthouse: dark mechanical screen, then roof
  slab(metal, roof, clean(PENT), 272, 277)

  // Argon tubes: every convex vertical corner of each tier over its height,
  // and the top edge of each tier where it is exposed (not under the next).
  const W = 0.42
  tiers.forEach(([r, z0, z1], k) => {
    const next = tiers[k + 1]?.[0]
    r.forEach((p, i) => {
      if (turn(r, i) <= 1) return
      const n = outward(r[(i - 1 + r.length) % r.length], p), m = outward(p, r[(i + 1) % r.length])
      const o: XY = [p[0] + (n[0] + m[0]) * 0.12, p[1] + (n[1] + m[1]) * 0.12]
      bar(neon, [o[0], o[1], k === 0 ? 2 : z0], [o[0], o[1], z1 + W / 2], W)
    })
    for (let i = 0; i < r.length; i++) {
      const a = r[i], b = r[(i + 1) % r.length], n = outward(a, b)
      const mid: XY = [(a[0] + b[0]) / 2 - n[0] * 0.5, (a[1] + b[1]) / 2 - n[1] * 0.5]
      if (next && insideRing(mid, next)) continue
      const off = 0.12
      bar(neon, [a[0] + n[0] * off, a[1] + n[1] * off, z1 + W / 2 - 0.01], [b[0] + n[0] * off, b[1] + n[1] * off, z1 + W / 2 - 0.01], W)
    }
  })

  // antenna field on the roof: a few short masts (estimated)
  for (const [e, n] of [[-12, 8], [2, -6], [-4, 10], [6, 2], [-16, -2], [-8, -14], [4, 16]] as XY[]) {
    const [p] = T([[e + SHIFT[0], n + SHIFT[1]]])
    bar(metal, [p[0], p[1], 272], [p[0], p[1], 280.7], 0.6)
  }

  return finishGlb('dal-bank-of-america-plaza', 'Bank of America Plaza', [
    { part: glass, material: finish('boa-glass', 0x95b2c9, 0.35) },
    { part: lines, material: { ...PALETTE.window, color: 0xd9e3e2 } },
    { part: roof, material: PALETTE.roof },
    { part: metal, material: finish('boa-plant', 0x7c8790) },
    { part: neon, material: finish('neon-boa-argon', 0x74cf86, 0.5) },
  ], { bearing: BEARING, height: 280.7, replaces: ['way/138670474', 'way/1492295745', 'way/1492295746', 'way/1492295747', 'way/1492295748', 'way/1492295749', 'way/1492295750'] })
}

function insideRing(p: XY, r: XY[]) {
  let c = false
  for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
    const [xi, yi] = r[i], [xj, yj] = r[j]
    if ((yi > p[1]) !== (yj > p[1]) && p[0] < xi + ((p[1] - yi) * (xj - xi)) / (yj - yi)) c = !c
  }
  return c
}

if (import.meta.main) {
  const { glb, triangles } = build()
  const out = process.argv[2] ?? new URL('../models/dal-bank-of-america-plaza.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
}
