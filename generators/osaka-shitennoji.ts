/**
 * Shitennō-ji (四天王寺), Tennōji-ku, Osaka: the central precinct — the
 * five-storey pagoda, the Kondō (golden hall), the Chūmon (middle gate),
 * the roofed corridor (kairō) round them with its east and west gates —
 * the 1957-63 reinforced-concrete reconstruction in Asuka style.
 * Procedural, CC0-1.0.
 * bun generators/osaka-shitennoji.ts
 *
 * Writes models/osaka-shitennoji.glb (low) and
 * models/osaka-shitennoji.detail.glb (detail: bracket sets and rafter ends
 * under every eave, balcony railings, finer roof curves, window bars, the
 * kairō's posts at their real spacing).
 *
 * Built with the kit in osaka-castle.ts (croof, tube, panelOn) and
 * tokyo-meiji-jingu.ts (gable2, placed, rafterEnds).
 *
 * Map frame: x east, y north, z up, metres; bearing 358 (all the outlines'
 * sides run at 358° / 88°). Origin: the pagoda outline's centre
 * (135.5164544, 34.6536284). The Shitennō-ji plan: Chūmon, pagoda, Kondō
 * and the lecture hall on one north-south line, the kairō joining the
 * Chūmon to the lecture hall (not modelled; it is its own building).
 *
 * Identity, in order: the slender vermilion five-storey pagoda with its
 * deep, nearly flat Asuka eaves, the bracket bands under each, the green
 * balcony lattices and the tall gilt sōrin; the two-storey-looking Kondō
 * beside it with its lower roof, the green-railed upper storey and the
 * hip-and-gable top with green-bronze shibi; the gate and the long low
 * corridors of vermilion posts and grey tile closing the court; white walls
 * between vermilion posts everywhere.
 *
 * Evidence:
 *  - OSM (bearing-358 frame, metres): pagoda way/258846917 x -7.0..9.1,
 *    y -8.6..6.5 (its stone platform); Kondō way/258846859 x -12.3..12.8,
 *    y 17.2..38.0; Chūmon way/1525716509 x -8.8..12.0, y -39.0..-22.7;
 *    kairō way/1525716508 (west and south-west), way/490792812 (east and
 *    south-east), way/1525716506 and way/1525716505 (north-west and
 *    north-east, to the lecture hall); the west and east gates (重門)
 *    way/1525716507 and way/1525716504. Their height tags come from PLATEAU
 *    (source:height=MLIT_PLATEAU) and are NOT used (city notes).
 *  - published (ja.wikipedia 四天王寺): the pagoda rebuilt 1959 (the eighth),
 *    the Kondō 1961, the central precinct completed 1963 in reinforced
 *    concrete; the Chūmon single-storey irimoya with a stepped (shikoro)
 *    roof; Shitennō-ji-style plan. No heights published there; the
 *    pagoda's commonly cited 39.2 m (including the sōrin) is used for its
 *    top, not confirmed in a primary source.
 *  - heights (estimated from photos with people for scale: Pufacz's pagoda
 *    view, 663highland's Kondō and pagoda views, そらみみ's Chūmon view):
 *    court 1.2 above the model's base; pagoda platform 1.6, storey bodies
 *    9.0 / 8.2 / 7.4 / 6.6 / 5.8 m square, eaves at 7.3 / 12.3 / 16.8 /
 *    21.0 / 25.0 (spans 18.4 down to 12.8, wider than the platform as in the photos), roof top 27.2, sōrin to 39.2.
 *    Kondō: platform 1.3, lower walls to 6.4, lower eave 7.5, upper storey
 *    20 × 15.6 m, its eave 12.2, gable foot 14.2, ridge 16.6, shibi 1.6.
 *    Chūmon: eave 6.6, ridge 11.6. Kairō: eave 4.2, ridge 5.8, 7 m wide.
 *    Side gates: eave 5.4, ridge 8.2.
 *  - terrain (Mapterhorn z14): the court is flat; the ground falls ~1.3 m
 *    towards the east corridor, which sets the model's base. Every wall and
 *    post runs down to y = 0. Elevation 0.
 *  - colours (daylight photos, sampled and pulled to the palette):
 *    vermilion #b4513a (sampled #853c28 on a sunlit column); white walls
 *    #ece6da; tile #5d6067 (sampled #4e555d); balcony and window lattice
 *    green #4f8a6e; gilt #cda550 (the sōrin, rafter-end caps); the stone
 *    platforms #cfc9bd.
 *  - night: not lit; nothing glows.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Shitennoji-pagoda.jpg, Pufacz, CC0 (the pagoda, south-east)
 *  - Shitennoji07s3200.jpg, 08s3200.jpg, 21s5.jpg, 663highland, CC BY 2.5 (Kondō and pagoda)
 *  - Kondo and Gojunoto Tower of Shitennoji Temple.JPG and 2.JPG, そらみみ (Soramimi), CC BY-SA 3.0 / 4.0
 *  - Chumon of Shitennoji Temple and Abeno Harukas.JPG, そらみみ, CC BY-SA 3.0 (the gate and kairō)
 *  - Shitennoji & Abeno Harukas.jpg, 名古屋太郎, CC BY-SA 3.0; Parts of the roof of Shitennoji Kondo.jpg, 名古屋太郎, CC BY-SA 3.0
 *  - Shitennoji pagoda 2021-05-26.jpg, m-louis, CC BY-SA 2.0; Shi Tennō-ji pagode 9290.jpg, Hyppolyte de Saint-Rambert, CC BY-SA 4.0
 *  - Harukas 300 Osaka (26466296051).jpg, KimonBerlin, CC BY-SA 2.0 (the precinct from above)
 * No commercial imagery, no PLATEAU. No look-only references.
 *
 * Left out: the lecture hall (講堂, way/664573978) the kairō ends at, the
 * lanterns, the stone steps' detail. Doubts: storey heights of the pagoda
 * are scaled from one upward view; the Chūmon's stepped roof is drawn as
 * one roof; the kairō's outer wall is drawn as white panels with a green
 * lattice band (its renji windows).
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { placed, save, gable2, rafterEnds, rbox, quadOut, type Mat } from './tokyo-meiji-jingu'
import { box } from './seoul-geunjeongjeon'
import { croof, tube, panelOn, type RoofParts } from './osaka-castle'

type Sz = { detail: boolean }
/** A flat band on a wall plane y = y0 facing ±y, from x0 to x1. */
function quadOutS(p: Part, x0: number, x1: number, y0: number, z0: number, z1: number, sd: number) {
  quadOut(p, [x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1], [0, sd, 0])
}
const F = 1.2 // the court above the model's base

function build(S: Sz) {
  const red = new Part(), white = new Part(), tile = new Part(), gold = new Part(), green = new Part(), stone = new Part()
  const D = S.detail
  const RP: RoofParts = { roof: tile, ridge: tile, gable: white, soffit: red, edge: red }
  const co: boolean | 2 = D ? false : 2
  const faces = ['s', 'e', 'n', 'w'] as const
  const out = { s: [0, -1, 0], n: [0, 1, 0], e: [1, 0, 0], w: [-1, 0, 0] } as Record<string, V3>
  /** A storey body: white walls, vermilion corner and bay posts, a bracket band to z2. */
  const body = (cx: number, cy: number, hx: number, hy: number, z0: number, z1: number, z2: number, bays: number, doors = false) => {
    box(white, cx - hx, cy - hy, z0, cx + hx, cy + hy, z1, 'bt')
    box(red, cx - hx - 0.05, cy - hy - 0.05, z1, cx + hx + 0.05, cy + hy + 0.05, z2, 'b')
    for (const f of faces) {
      const L = f === 's' || f === 'n' ? hx : hy, bw = (2 * L) / bays
      for (let i = 0; i <= bays; i++) panelOn(red, f, hx, hy, -L + i * bw - 0.22, -L + i * bw + 0.22, z0, z1, 0.05, cx, cy)
      if (doors) for (let i = 1; i < bays - 1; i++) {
        const t = -L + (i + 0.5) * bw
        panelOn(i % 2 ? red : green, f, hx, hy, t - bw * 0.3, t + bw * 0.3, z0 + 0.3, z1 - 0.6, 0.06, cx, cy)
      }
      if (D) { // bracket sets: blocks at each post head, rafter ends along the eave line
        const a = [cx + out[f][0] * hx, cy + out[f][1] * hy] as const
        for (let i = 0; i <= bays; i++) {
          const t = -L + i * bw
          const p: V3 = f === 's' ? [cx + t, cy - hy, 0] : f === 'n' ? [cx - t, cy + hy, 0] : f === 'e' ? [cx + hx, cy + t, 0] : [cx - hx, cy - t, 0]
          for (const k of [0.5, 1.1]) rbox(red, p[0] + out[f][0] * k, p[1] + out[f][1] * k, f === 's' || f === 'n' ? 0.35 : 0.28, f === 's' || f === 'n' ? 0.28 : 0.35, z1 + (z2 - z1) * (k / 1.6), z1 + (z2 - z1) * (k / 1.6) + 0.4, 0, 'b')
        }
        void a
      }
    }
  }
  /** Rafter ends with gilt caps along an eave ring (detail). */
  const rafters = (cx: number, cy: number, ex: number, ey: number, z: number) => {
    if (!D) return
    for (const f of faces) {
      const L = (f === 's' || f === 'n' ? ex : ey) * 0.8
      const o = out[f], c: V3 = [cx + o[0] * (f === 'e' || f === 'w' ? ex - 0.4 : 0), cy + o[1] * (f === 's' || f === 'n' ? ey - 0.4 : 0), z]
      const al: V3 = f === 's' || f === 'n' ? [1, 0, 0] : [0, 1, 0]
      rafterEnds(gold, [c[0] - al[0] * L, c[1] - al[1] * L, z], [c[0] + al[0] * L, c[1] + al[1] * L, z], 0.75, 0.16, 0.16, 0.3, o)
    }
  }
  const platform = (cx: number, cy: number, hx: number, hy: number, z1: number) => {
    box(stone, cx - hx, cy - hy, 0, cx + hx, cy + hy, z1, 'b')
  }

  // ---- The pagoda ------------------------------------------------------------
  {
    const cx = 1.05, cy = -1.05
    const P0 = F + 1.6
    platform(cx, cy, 8.05, 7.55, P0)
    box(stone, cx - 2.2, cy - 10.1, 0, cx + 2.2, cy - 7.55, F + 0.8, 'b') // the south steps
    const half = [4.5, 4.1, 3.7, 3.3, 2.9], eave = [7.3, 12.3, 16.8, 21.0, 25.0], span = [9.2, 8.5, 7.8, 7.1, 6.4]
    let z0 = P0
    for (let k = 0; k < 5; k++) {
      const h = half[k], ze = F + eave[k], zw = ze - 1.6
      body(cx, cy, h, h, z0, zw - 0.8, zw + 0.4, 3, k === 0)
      if (k > 0) { // the balcony with its green lattice
        const b = h + 0.9
        box(red, cx - b, cy - b, z0 - 0.15, cx + b, cy + b, z0 + 0.1, '')
        for (const f of faces) panelOn(green, f, b, b, -b + 0.2, b - 0.2, z0 + 0.1, z0 + 0.75, 0.02, cx, cy)
        if (D) for (const f of faces) for (let t = -b; t <= b + 0.01; t += 1.0) {
          const p = f === 's' ? [cx + t, cy - b] : f === 'n' ? [cx - t, cy + b] : f === 'e' ? [cx + b, cy + t] : [cx - b, cy - t]
          rbox(red, p[0], p[1], 0.07, 0.07, z0 + 0.1, z0 + 0.85, 0, 'b')
        }
      }
      const next = k < 4 ? half[k + 1] : 0.8
      const zt = k < 4 ? ze + 1.5 : F + 27.2
      croof(RP, { coarse: co, kind: 'skirt', cx, cy, ex: span[k], ey: span[k], ze, gx: next, gy: next, zg: zt, lift: 0.5, flare: 0.35, sag: 0.3, th: 0.8, pow: 2.4,
        soffit: D || k === 0 ? { bx: h, by: h, zb: zw + 0.4 } : undefined, hipRidge: { w: 0.32, h: 0.28 } })
      rafters(cx, cy, span[k], span[k], ze - 0.75)
      z0 = zt - 0.2
    }
    // the sōrin: base, bowl, nine rings, the water-flame and the jewel
    const zb = F + 27.2
    box(red, cx - 0.9, cy - 0.9, zb - 0.3, cx + 0.9, cy + 0.9, zb + 0.5, 'b')
    tube(gold, [[cx, cy, zb + 0.5], [cx, cy, zb + 1.2]], [0.75, 0.55], 8)
    tube(gold, [[cx, cy, zb + 1.2], [cx, cy, zb + 11.0]], [0.16, 0.13], 8)
    const nR = D ? 9 : 4
    for (let i = 0; i < nR; i++) {
      const z = zb + 1.7 + (i * 6.0) / (nR - 1)
      tube(gold, [[cx, cy, z - 0.12], [cx, cy, z + 0.12]], [0.62 - i * 0.025, 0.62 - i * 0.025], D ? 12 : 8)
    }
    for (const a of [0, Math.PI / 2]) { // the flame (suien), two crossed plates
      const c = Math.cos(a), s = Math.sin(a)
      tube(gold, [[cx, cy, zb + 8.3], [cx, cy, zb + 9.4], [cx, cy, zb + 10.3]], [[0.15, 0.15], [0.75, 0.06], [0.1, 0.05]].map(([w, t]) => [w * Math.abs(c) + t * Math.abs(s), w * Math.abs(s) + t * Math.abs(c)] as [number, number]), 4)
    }
    tube(gold, [[cx, cy, zb + 10.8], [cx, cy, zb + 11.4], [cx, cy, zb + 12.0]], [0.05, 0.3, 0.02], 8)
  }

  // ---- The Kondō -------------------------------------------------------------
  {
    const cx = 0.25, cy = 27.6, P0 = F + 1.3
    platform(cx, cy, 12.55, 10.4, P0)
    body(cx, cy, 11.0, 8.9, P0, F + 5.6, F + 6.6, 5, true)
    croof(RP, { coarse: co, kind: 'skirt', cx, cy, ex: 14.4, ey: 12.3, ze: F + 7.5, gx: 10.0, gy: 7.8, zg: F + 8.6, lift: 0.4, flare: 0.3, sag: 0.25, th: 0.55, pow: 2.6,
      soffit: { bx: 11.0, by: 8.9, zb: F + 6.6 }, hipRidge: { w: 0.34, h: 0.3 } })
    rafters(cx, cy, 14.4, 12.3, F + 6.8)
    const b = 10.6
    box(red, cx - b, cy - b + 2.2, F + 8.4, cx + b, cy + b - 2.2, F + 8.6, '')
    for (const f of faces) panelOn(green, f, b, b - 2.2, -(f === 's' || f === 'n' ? b : b - 2.2) + 0.2, (f === 's' || f === 'n' ? b : b - 2.2) - 0.2, F + 8.6, F + 9.3, 0.02, cx, cy)
    body(cx, cy, 10.0, 7.8, F + 8.6, F + 10.4, F + 11.4, 5)
    croof(RP, { coarse: co, kind: 'paljak', cx, cy, ex: 12.8, ey: 10.6, ze: F + 12.2, gx: 8.6, gy: 4.6, zg: F + 14.2, zr: F + 16.6, rx: 8.1,
      lift: 0.45, flare: 0.3, sag: 0.3, th: 0.55, pow: 2.6, soffit: { bx: 10.0, by: 7.8, zb: F + 11.4 }, ridge: { h: 0.6, w: 0.65 }, ridgeSag: 0.05, hipRidge: { w: 0.34, h: 0.3 } })
    rafters(cx, cy, 12.8, 10.6, F + 11.5)
    for (const s of [-1, 1]) { // shibi: green-bronze fins curving inward
      const x = cx + s * 8.3, z = F + 17.0
      tube(green, [[x, cy, z], [x - s * 0.15, cy, z + 0.8], [x - s * 0.55, cy, z + 1.5], [x - s * 1.0, cy, z + 1.75]], [[0.25, 0.5], [0.22, 0.45], [0.16, 0.3], [0.05, 0.05]], 6, [0, 1, 0])
    }
  }

  // ---- The Chūmon ------------------------------------------------------------
  {
    const cx = 1.6, cy = -30.85, P0 = F + 0.8
    platform(cx, cy, 8.6, 5.6, P0)
    const hx = 7.6, hy = 4.4
    for (const s of [-1, 1]) box(white, cx + s * 2.6, cy - hy, P0, cx + s * hx, cy + hy, F + 5.2, s < 0 ? 'bt' : 'bt') // the side bays (the guardian kings' rooms)
    for (const xx of [-hx, -2.6, 2.6, hx]) for (const yy of [-hy, 0, hy]) {
      if (D) tube(red, [[cx + xx, cy + yy, P0], [cx + xx, cy + yy, F + 5.2]], [0.3, 0.28], 8)
      else box(red, cx + xx - 0.28, cy + yy - 0.28, P0, cx + xx + 0.28, cy + yy + 0.28, F + 5.2, 'bt')
    }
    box(red, cx - hx - 0.1, cy - hy - 0.1, F + 5.2, cx + hx + 0.1, cy + hy + 0.1, F + 5.9, 'b')
    croof(RP, { coarse: co, kind: 'paljak', cx, cy, ex: 10.4, ey: 7.6, ze: F + 6.6, gx: 6.6, gy: 3.0, zg: F + 8.8, zr: F + 11.6, rx: 6.1,
      lift: 0.4, flare: 0.3, sag: 0.3, th: 0.5, pow: 2.6, soffit: { bx: hx, by: hy, zb: F + 5.9 }, ridge: { h: 0.55, w: 0.6 }, ridgeSag: 0.04, hipRidge: { w: 0.32, h: 0.28 } })
    rafters(cx, cy, 10.4, 7.6, F + 6.0)
    for (const s of [-1, 1]) {
      const x = cx + s * 6.4, z = F + 12.0
      tube(green, [[x, cy, z], [x - s * 0.12, cy, z + 0.6], [x - s * 0.45, cy, z + 1.15], [x - s * 0.8, cy, z + 1.35]], [[0.2, 0.4], [0.18, 0.36], [0.13, 0.24], [0.04, 0.04]], 6, [0, 1, 0])
    }
  }

  // ---- The kairō (roofed corridor) and its side gates ------------------------
  const W = 3.6 // half-width of the roof
  const run = (ax: number, ay: number, bx: number, by: number) => {
    const L = Math.hypot(bx - ax, by - ay) / 2, rot = Math.atan2(by - ay, bx - ax)
    const Q = placed({ red, white, green, tile }, rot, (ax + bx) / 2, (ay + by) / 2)
    gable2({ roof: Q.tile, edge: Q.red, soffit: Q.red }, { L, Df: W, Db: W, zf: F + 4.2, zb: F + 4.2, zr: F + 5.8, sag: 0.2, th: 0.3, ridge: { w: 0.4, h: 0.3 }, coarse: true })
    // the outer wall (white, with the green lattice band) on the corridor's centre line; posts either side
    box(Q.white, -L, -0.15, 0, L, 0.15, F + 3.6, 'bt')
    for (const sd of [-1, 1]) quadOutS(Q.green, -L + 0.3, L - 0.3, sd * 0.17, F + 2.2, F + 3.0, sd)
    const n = Math.max(1, Math.round((2 * L) / (D ? 3.9 : 7.8)))
    // the court side (towards (0, 15)) is open between posts; the outer side's posts stand in the wall
    const mx = (ax + bx) / 2, my = (ay + by) / 2, inner = (-Math.sin(rot) * (0 - mx) + Math.cos(rot) * (15 - my)) > 0 ? 2.4 : -2.4
    for (let i = 0; i <= n; i++) for (const yy of D ? [-2.4, 2.4] : [inner]) {
      const x = -L + (2 * L * i) / n
      if (D) tube(Q.red, [[x, yy, 0], [x, yy, F + 3.9]], [0.2, 0.19], 6)
      else box(Q.red, x - 0.2, yy - 0.2, 0, x + 0.2, yy + 0.2, F + 3.6, 'bt')
    }
    box(Q.red, -L, -2.6, F + 3.6, L, 2.6, F + 3.9, '') // tie beams as one plate under the roof
  }
  run(-36.3, -31.1, -8.7, -31.1); run(-32.9, -35.3, -32.9, 8.4)
  run(12.0, -30.8, 38.6, -30.8); run(34.3, -34.3, 34.3, 9.8)
  run(-33.3, 22.9, -33.3, 66.4); run(-37.0, 66.4, -18.3, 66.4)
  run(33.9, 23.8, 33.9, 66.6); run(18.1, 66.6, 38.0, 66.6)
  for (const [x0, x1, y0, y1] of [[-38.2, -28.4, 8.4, 23.0], [29.1, 39.0, 9.8, 23.8]]) {
    const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2
    for (const xx of [-3.0, 3.0]) for (const yy of D ? [-5.0, -1.7, 1.7, 5.0] : [-5.0, 5.0]) box(red, cx + xx - 0.22, cy + yy - 0.22, 0, cx + xx + 0.22, cy + yy + 0.22, F + 4.6, 'bt')
    box(red, cx - 3.3, cy - 5.3, F + 4.6, cx + 3.3, cy + 5.3, F + 5.0, '')
    const G = placed({ tile, red, white }, Math.PI / 2, cx, cy)
    if (D) croof({ roof: G.tile, ridge: G.tile, gable: G.white, soffit: G.red, edge: G.red }, { coarse: false, kind: 'paljak', ex: 7.2, ey: 4.9, ze: F + 5.4, gx: 4.6, gy: 2.0, zg: F + 6.8, zr: F + 8.2, rx: 4.2,
      lift: 0.35, flare: 0.25, sag: 0.3, th: 0.4, pow: 2.6, soffit: { bx: 5.3, by: 3.3, zb: F + 5.0 }, ridge: { h: 0.45, w: 0.5 }, ridgeSag: 0.03, hipRidge: { w: 0.28, h: 0.25 } })
    else gable2({ roof: G.tile, edge: G.red, soffit: G.red }, { L: 7.2, Df: 4.9, Db: 4.9, zf: F + 5.4, zb: F + 5.4, zr: F + 8.2, sag: 0.3, th: 0.35, ridge: { w: 0.45, h: 0.4 }, coarse: true })
  }

  const parts: Mat[] = [
    { part: red, material: finish('vermilion', 0xb4513a) },
    { part: white, material: finish('white-wall', 0xece6da) },
    { part: tile, material: finish('roof-tile', 0x5d6067) },
    { part: gold, material: finish('gilt', 0xcda550) },
    { part: green, material: finish('lattice-green', 0x4f8a6e) },
    { part: stone, material: finish('granite', 0xcfc9bd) },
  ]
  return parts
}

if (import.meta.main) {
  const extras = { bearing: 358, elevation: 0, height: F + 39.2, osm: 'way/258846917' }
  await save('Shitennō-ji', build({ detail: false }), 'osaka-shitennoji.glb', 6500, 250_000, extras)
  await save('Shitennō-ji', build({ detail: true }), 'osaka-shitennoji.detail.glb', 40_000, 1536 * 1024, extras)
}
