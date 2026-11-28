/**
 * Grand Tower, Frankfurt am Main: procedural, CC0-1.0.
 * bun generators/frankfurt-grand-tower.ts   (writes the low and the detail model)
 *
 * Magnus Kaminiarz & Cie., 2016-2020: Germany's tallest residential tower,
 * 180 m and 47 storeys, in the Europaviertel beside the Skyline Plaza. A
 * rhomboid plan with rounded tips, wrapped storey by storey in white
 * balcony slabs whose rounded loggia fronts step in and out, so the bands
 * seem to ripple up the tower; behind them floor-to-ceiling glass. The
 * plan steps back in stages near the top, and a closed white crown (plant)
 * rises out of the middle.
 *
 * Identity, in order: the white horizontal balcony bands with dark glass
 * between them, rippling where they step in and out; the stepped top, with
 * the east and west tips stopping lowest, then the north half, then the
 * south; the tall closed white crown block above the balconies.
 *
 * Map frame: x east, y north, z up, metres, bearing 0. Origin: the area
 * centroid of OSM way/375714704 (50.108519, 8.654446). y = 0 is the lowest
 * ground under the footprint.
 *
 * Plan: the OSM outline and its building:parts, simplified to 0.35 m. The
 * tiers are unions of parts: to 31 levels everything; to 43 all but the
 * east and west tips (way/1391177597, way/1391177598); to 48 the south
 * part (way/1391177596) and the middle (OSM's north part way/1391177595
 * stops at 43; see Heights); the middle (way/1391177594, 53
 * levels) above that is the closed white crown, and the core
 * (way/1391177593, 54 levels) its top. The south tip (way/1078292395,
 * building:part=roof, 2 levels) is a low glazed pavilion.
 *
 * Heights: OSM's levels times 3.185 m (OSM's 172 m over its 54 levels):
 * tips 98.7 (31), the shoulders 136.9 (43, north) and 152.9 (48, south), the crown
 * 168.8 (53); but the 43 and the 48 are swapped against OSM, which puts 48
 * on the north part and 43 on the south: a (from the west) shows the north
 * (left) side stopping lower, at about 137 m, where the crown starts, and
 * the south (right) side's balconies running on to about 160 m; the
 * core to 180 m (published total: de.wikipedia "Grand Tower (Frankfurt am
 * Main)"; OSM gives 172, "survey"). Checked against a (west view): the
 * white crown starts about 137 m up on the left and the balconies on the
 * right run to about 160 m. The pavilion 7 m (2 levels).
 *
 * Balconies: white slab fronts (slab and parapet) about 0.95 m tall a
 * storey, the glass 1.6 m behind them; every other band set in 0.8 m,
 * which gives the stepping, rippling edge seen in b, d and e (the real
 * fronts step and curve floor by floor). The detail model draws a band
 * every storey; the low model one every two storeys, 1.7 m tall, so the
 * share of white to glass stays as in the photos (about a third white).
 *
 * Evidence (Wikimedia Commons):
 * - a https://commons.wikimedia.org/wiki/File:Grand_Tower,_Frankfurt,_West_view_20200516_1.jpg
 *   DXR, CC BY-SA 4.0: from the west, full height, the crown.
 * - b https://commons.wikimedia.org/wiki/File:Grand_Tower_Frankfurt_01-20.jpg
 *   Silesia711, CC BY-SA 4.0: from the street, the rippling bands.
 * - c https://commons.wikimedia.org/wiki/File:Frankfurt,_Grand_Tower.jpg
 *   Dr. Thomas Liptak, CC BY-SA 4.0: from high up (north-east), the steps
 *   and the crown.
 * - d https://commons.wikimedia.org/wiki/File:Grand_Tower_Frankfurt_am_Main_24_Oktober_2021.jpg
 *   Stefan Oberreuter, CC BY-SA 4.0.
 * - e https://commons.wikimedia.org/wiki/File:Grand_Tower_Frankfurt_09-19.jpg
 *   Silesia711, CC BY-SA 4.0.
 * - f https://commons.wikimedia.org/wiki/File:Base_view_Grand_Tower_Frankfurt_am_Main_24_Oktober_2021.jpg
 *   Stefan Oberreuter, CC BY-SA 4.0: the foot and the car park beside it.
 * - OSM (API, 2026-11): the outline and the parts listed in `replaces`.
 * - No lidar (none in Germany). Look-only: none.
 *
 * Colours: the slab fronts and the crown white, pulled to #eeece6; the
 * glass a grey blue-green #6c8a94 (a, c); the roofs grey.
 *
 * Night: the glass is `window` (flats lit); the pavilion `entrance`.
 *
 * Doubts: the stepping of the real balcony fronts is irregular and is
 * drawn as a regular alternation; the crown's top box is from a and c only;
 * the car park (way/375714703) is a separate building and left to the map.
 */
import clipping from 'polygon-clipping'
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { prism, capRing, insetRing, ccw, saveLods, type XY, type Layer } from './frankfurt-westhafen-tower'

const ID = 'frankfurt-grand-tower'
const PARTS: Record<string, XY[]> = {
  core: [[-0.4, 2.4], [0.5, 2.0], [5.1, -4.5], [1.8, -12.0], [0.5, -12.6], [-0.8, -12.1], [-5.0, -5.5], [-1.3, 1.9]],
  mid: [[-0.9, 11.5], [0.7, 10.8], [7.1, 0.9], [11.8, -4.7], [8.1, -19.4], [2.8, -15.5], [1.0, -14.9], [-1.1, -15.6], [-5.3, -20.0], [-6.3, -20.1], [-11.5, -6.8], [-11.3, -5.5], [-7.8, -0.3], [-2.5, 10.7]],
  north: [[16.8, 6.2], [16.9, 8.1], [8.2, 21.2], [5.8, 22.3], [4.2, 21.8], [-1.5, 17.9], [-7.6, 21.0], [-10.5, 20.9], [-11.8, 19.6], [-18.4, 5.2], [-17.7, 3.3], [-11.7, 0.2], [-11.1, -1.2], [-7.3, 0.8], [-2.5, 10.7], [-1.8, 11.3], [0.0, 11.3], [0.7, 10.8], [6.7, 1.5], [9.5, 0.4], [10.1, 1.6]],
  south: [[1.0, -14.9], [2.8, -15.5], [7.4, -19.3], [8.1, -19.4], [8.6, -18.8], [11.8, -4.7], [6.7, 1.5], [16.6, -2.6], [17.8, -3.8], [17.7, -5.1], [9.8, -21.9], [8.5, -22.9], [1.3, -19.1], [1.9, -18.1], [0.9, -17.9], [-0.0, -18.2], [0.7, -19.1], [-2.2, -21.0], [-5.1, -23.7], [-6.7, -23.9], [-17.3, -7.9], [-17.4, -5.6], [-7.3, 0.8], [-11.5, -6.0], [-6.5, -19.8], [-5.3, -20.0], [-1.1, -15.6]],
  west: [[-18.0, 3.8], [-11.7, 0.2], [-11.1, -1.2], [-17.4, -5.6], [-18.3, -4.2], [-18.7, 2.1]],
  east: [[16.8, 6.2], [17.8, 4.4], [18.2, -1.7], [17.4, -3.4], [9.5, 0.4], [10.1, 1.6]],
  pavilion: [[-5.6, -23.8], [-4.0, -26.3], [-1.9, -27.4], [4.5, -27.2], [6.6, -25.9], [8.2, -22.9], [1.3, -19.1], [1.9, -18.1], [0.9, -17.9], [-0.0, -18.2], [0.7, -19.1]],
}
const LV = 172 / 54
const H_TIPS = 31 * LV, H_NORTH = 43 * LV, H_SOUTH = 48 * LV, H_MID = 53 * LV, TOP = 180, PAV = 7

/** The outer ring of the union of some parts, counter-clockwise, simplified. */
function union(...names: string[]): XY[] {
  const polys = names.map((n) => [[...PARTS[n], PARTS[n][0]].map(([x, y]) => [x, y] as [number, number])])
  const u = clipping.union(polys[0] as any, ...(polys.slice(1) as any))
  // the largest polygon's outer ring
  let best: [number, number][] = [], area = 0
  for (const poly of u) {
    const r = poly[0], a = Math.abs(r.reduce((s, p, i) => { const q = r[(i + 1) % r.length]; return s + p[0] * q[1] - q[0] * p[1] }, 0))
    if (a > area) { area = a; best = r }
  }
  let ring = best.slice(0, -1) as XY[]
  // drop near-duplicate and collinear points left by the union
  const out: XY[] = []
  for (const p of ring) if (!out.length || Math.hypot(p[0] - out[out.length - 1][0], p[1] - out[out.length - 1][1]) > 0.6) out.push(p)
  ring = out.filter((p, i) => {
    const a = out[(i - 1 + out.length) % out.length], b = out[(i + 1) % out.length]
    const cr = (p[0] - a[0]) * (b[1] - a[1]) - (p[1] - a[1]) * (b[0] - a[0])
    return Math.abs(cr) / (Math.hypot(b[0] - a[0], b[1] - a[1]) || 1) > 0.15
  })
  return ccw(ring)
}

type Set = { glass: Part; white: Part; roof: Part; pav: Part }
const mk = (): Set => ({ glass: new Part(), white: new Part(), roof: new Part(), pav: new Part() })

/** Smooth-shaded vertical band round a closed ring (outside to the right of a ccw ring). */
function band(p: Part, r: XY[], z0: number, z1: number) {
  const n = r.length
  const nrm = r.map((c, i) => {
    const a = r[(i - 1 + n) % n], b = r[(i + 1) % n], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1
    return [dy / l, -dx / l, 0] as V3
  })
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    // split the normal at sharp corners: use the face normal where the turn is sharp
    const fd: XY = [r[j][0] - r[i][0], r[j][1] - r[i][1]], fl = Math.hypot(...fd) || 1
    const fn: V3 = [fd[1] / fl, -fd[0] / fl, 0]
    const pick = (v: V3) => (v[0] * fn[0] + v[1] * fn[1] > 0.8 ? v : fn)
    const ni = pick(nrm[i]), nj = pick(nrm[j])
    p.tri([r[i][0], r[i][1], z0], [r[j][0], r[j][1], z0], [r[j][0], r[j][1], z1], undefined, undefined, undefined, [ni, nj, nj])
    p.tri([r[i][0], r[i][1], z0], [r[j][0], r[j][1], z1], [r[i][0], r[i][1], z1], undefined, undefined, undefined, [ni, nj, ni])
  }
}

/** A flat ring between r and its inset ri (same vertex count), facing up or down. */
function annulus(p: Part, r: XY[], ri: XY[], z: number, up = true) {
  for (let i = 0; i < r.length; i++) {
    const j = (i + 1) % r.length
    const a: V3 = [r[i][0], r[i][1], z], b: V3 = [r[j][0], r[j][1], z], c: V3 = [ri[j][0], ri[j][1], z], d: V3 = [ri[i][0], ri[i][1], z]
    if (up) p.quad(a, b, c, d); else p.quad(a, d, c, b)
  }
}

/** A balconied tier: glass set back, white slab fronts stepping in and out. */
function tier(s: Set, r: XY[], z0: number, z1: number, every: number, roofTop = true) {
  const front = every > LV * 1.5 ? 1.7 : 0.95, soffit = every <= LV * 1.5
  const g = insetRing(r, 1.6)
  band(s.glass, g, z0, z1)
  const nb = Math.round((z1 - z0) / every)
  const step = (z1 - z0) / nb
  for (let k = 1; k <= nb; k++) {
    const z = z0 + k * step
    const fr = insetRing(r, k % 2 ? 0.8 : 0)
    band(s.white, fr, z - front, z)
    annulus(s.white, fr, g, z, true)
    if (soffit) annulus(s.white, fr, g, z - front, false)
  }
  if (roofTop) capRing(s.roof, g, z1 + 0.01)
  // the loggias' white side walls: fins from the glass to the front, about
  // every 6.5 m round the plan (a, c: the white verticals between bays)
  const per = r.reduce((acc, a, i) => acc + Math.hypot(r[(i + 1) % r.length][0] - a[0], r[(i + 1) % r.length][1] - a[1]), 0)
  const nf = Math.round(per / 6.5), spacing = per / nf
  let i = 0, acc = 0
  for (let k = 0; k < nf; k++) {
    const want = (k + 0.5) * spacing
    while (true) {
      const a = r[i], b = r[(i + 1) % r.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
      if (acc + L >= want) {
        const f = (want - acc) / L, t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], nIn: XY = [-t[1], t[0]]
        if (f * L < 1 || (1 - f) * L < 1) break // not on a corner
        const p: XY = [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f], w = 0.35
        const q = (u: number, v: number): XY => [p[0] + t[0] * u + nIn[0] * v, p[1] + t[1] * u + nIn[1] * v]
        prism(s.white, [q(-w, 0), q(w, 0), q(w, 1.7), q(-w, 1.7)], z0, z1 - 0.01, { top: null })
        break
      }
      acc += L; i = (i + 1) % r.length
    }
  }
}

function build(s: Set, detail: boolean) {
  const every = detail ? LV : 2 * LV
  const t1 = union('core', 'mid', 'north', 'south', 'west', 'east')
  const t2 = union('core', 'mid', 'north', 'south')
  const t3 = union('core', 'mid', 'south')
  // the pavilion at the south tip
  prism(s.pav, insetRing(PARTS.pavilion, 0.6), 0, PAV - 0.6, { top: null })
  prism(s.white, PARTS.pavilion, PAV - 0.6, PAV)
  // a white plinth slab at the foot
  tier(s, t1, 0, H_TIPS, every, false)
  tier(s, t2, H_TIPS, H_NORTH, every, false)
  tier(s, t3, H_NORTH, H_SOUTH, every)
  // roofs of the lower tiers: the band tops already cover the fronts; cap the glass
  capRing(s.roof, insetRing(t1, 1.6), H_TIPS + 0.01)
  capRing(s.roof, insetRing(t2, 1.6), H_NORTH + 0.01)
  // the white crown: the middle part from the south tier's top, the core above
  const mid = insetRing(PARTS.mid, -0.3)
  prism(s.white, mid, H_NORTH, H_MID - 0.5, { top: null })
  // a chamfered top edge
  {
    const q = ccw(mid), qi = insetRing(q, 0.5)
    for (let i = 0; i < q.length; i++) {
      const j = (i + 1) % q.length
      s.white.quad([q[i][0], q[i][1], H_MID - 0.5], [q[j][0], q[j][1], H_MID - 0.5], [qi[j][0], qi[j][1], H_MID], [qi[i][0], qi[i][1], H_MID])
    }
    capRing(s.roof, qi, H_MID)
  }
  prism(s.white, PARTS.core, H_MID, TOP)
}

const mats = (s: Set): Layer[] => [
  { part: s.glass, material: { ...PALETTE.window, color: 0x6c8a94 } },
  { part: s.white, material: finish('grand-tower-white', 0xeeece6) },
  { part: s.roof, material: PALETTE.roof },
  { part: s.pav, material: { ...PALETTE.entrance, color: 0x6c8a94 } },
]

const low = mk(), det = mk()
build(low, false)
build(det, true)
await saveLods(ID, 'Grand Tower', mats(low), mats(det), { anchor: [50.108519, 8.654446], bearing: 0, elevation: 0, height: TOP })
