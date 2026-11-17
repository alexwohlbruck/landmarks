/**
 * DFW Airport Center Tower (FAA air traffic control tower and the TRACON
 * building at its foot) — procedural, CC0-1.0, no textures.
 *
 *   bun generators/dal-dfw-control-tower.ts
 *
 * Frame: x east, y north, z up, metres, bearing 0. Anchor: area centroid of
 * the OSM outline way/446187562 "FAA Tower", -97.04035 32.89663, which takes
 * in the tower, its podium and the TRACON block south of it.
 *
 * Why this tower: DFW has three towers (West, East and Center). The Center
 * Tower stands in the middle of the central terminal area, beside Terminal D
 * and the Grand Hyatt, so it is the one in almost every photo of the
 * terminals and from the roads, garages and Skylink; the West and East
 * towers stand out on the airfield, seen mostly from aircraft.
 *
 * Identifying features (photos): a tall square shaft of tan concrete whose
 * faces each carry a dark, banded slot of windows up the middle;
 * at the top a broad dark-bronze service deck with a rounded balcony
 * ("bowl", holding the microwave dishes) on each face; above it a narrower
 * drum, then the cab, an octagon of outward-leaning glass under a deep
 * bronze roof band, a small top room and its antennas. At its foot a low
 * podium and the tan TRACON block.
 *
 * Evidence
 * - OSM: tower way/446921579 (12 m round, tagged height 80) and the four
 *   balconies way/446921580–583 (tagged 65–70 m) reaching 9 m from the
 *   tower's centre (-3.3, 27.0); podium way/448386139 (6 m), TRACON
 *   way/448378079 (20 m), its roof plant way/448378081 (20–22 m), the
 *   small block way/448378080 (6–8 m), all in this frame.
 * - Lidar: USGS 3DEP TX_Pecos_Dallas_B3_2018 (flown 2018), 0.5 m,
 *   work/dal-dfw-control-tower/lidar.json; ground round the complex 2.6–3.0 m
 *   over ground_min (z = 0 here is 2.8). Podium roof 5 m, TRACON roof
 *   19.5 m, its plant 21.5 m, the block by the tower 9.5 m. On the tower
 *   the returns stop at 49.8 m above the ground, on a 9 × 10 m square: the
 *   shaft, cut off. This flight drops high returns on tall thin towers (the
 *   West and East towers, well over 60 m in photos, stop at 33 and 30 m),
 *   so the lidar only says the shaft is at least 50 m tall and 9–10 m
 *   square. The heights above that follow OSM: balconies 65–70 m, cab roof
 *   about 80 m. The photos agree that the shaft is more than twice the
 *   height of the deck-to-roof top (mikecogh's silhouette, cut off by the
 *   frame, already shows 2.1 times).
 * - Photos:
 *   https://www.flickr.com/photos/89165847@N00/6854270549
 *     (mikecogh, CC BY-SA 2.0) the top close-up: deck, bowls, drum, cab;
 *   https://www.flickr.com/photos/89165847@N00/6854228473
 *     (mikecogh, CC BY-SA 2.0) the whole silhouette against Terminal D;
 *   https://www.flickr.com/photos/13494744@N00/32002183727
 *     (gholmes, CC BY 2.0) the shaft and top from the Energy Plaza side;
 *   https://commons.wikimedia.org/wiki/File:DFW_Terminals_ACD_View_from_Takeoff_(52831109800).jpg
 *     (formulanone, CC BY-SA 2.0) from the air: the corner piers and
 *     banded faces, the deck's proportions against the shaft.
 *
 * Estimated from the close-up, scaled by the balconies' 18 m span (OSM):
 * the top 17.5 m, set on OSM's 65–70 m balconies: soffit from 62.5 m,
 * deck body to 70.2 m with a rounded balcony bulging 11.4 m out on each
 * face, drum to 73, cab glass 73.4–76.3, roof band to 78.5, top room to
 * 80.3, six masts 83.5–88 m; the shaft's 12.6 m square (the silhouette
 * gives it 0.55–0.6 of the deck's width; lidar's cut-off square is 9–10 m,
 * so the shaft may be drawn a little wide) and the slot on each face
 * (aerial, gholmes). The antennas are drawn as one mast. Doubt: the shaft's south
 * and east faces are not photographed close; drawn like the others.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, area, capPoly, facade, finishModel, quadN, unit, type Facade } from './nyc-570-lexington'

const conc = new Part(), dark = new Part(), win = new Part(), roof = new Part(), trim = new Part(), bronze = new Part()
const ccw = (r: XY[]) => (area(r) < 0 ? r.slice().reverse() : r)
const CX = -3.3, CY = 27.0

// --- The low buildings: podium, TRACON block and its plant, the small block ---
const lowFacade: Facade = { bay: 7, ratio: 0.8, floor: 3.4, group: 1, spandrel: 0, sill: 1.6, head: 1.0, ground: 1.6, minLength: 4 }
const traconFacade: Facade = { bay: 6.5, ratio: 0.7, floor: 3.6, group: 2, spandrel: 1.0, sill: 2.0, head: 1.6, ground: 2.0, minLength: 5 }
function block(ring0: XY[], z0: number, z1: number, f: Facade | null, top = roof) {
  const ring = ccw(ring0)
  for (let i = 0; i < ring.length; i++) facade(conc, f ? win : null, ring[i], ring[(i + 1) % ring.length], z0, z1 - 0.4, f)
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n: XY = [(b[1] - a[1]) / L, -(b[0] - a[0]) / L]
    trim.quad([a[0] + n[0] * 0.1, a[1] + n[1] * 0.1, z1 - 0.4], [b[0] + n[0] * 0.1, b[1] + n[1] * 0.1, z1 - 0.4], [b[0] + n[0] * 0.1, b[1] + n[1] * 0.1, z1], [a[0] + n[0] * 0.1, a[1] + n[1] * 0.1, z1])
  }
  capPoly(top, ring, z1)
}
block([[-29.5, 47.6], [-29.4, -3.8], [25.2, -4.1], [25.1, 47.8]], 0, 5, lowFacade)
block([[-29.4, -3.8], [-29.5, -38.4], [25.4, -38.7], [25.2, -4.1]], 0, 19.5, traconFacade)
block([[-9.9, -4.6], [-9.9, -8.7], [8.1, -8.7], [8.1, -4.6]], 19.5, 21.5, null)
block([[-11.8, 14.6], [-11.8, 5.6], [6.9, 5.5], [7.0, 14.5]], 5, 9.5, null)

// --- Helpers for round things about the tower's axis ---
const ring = (r: number, n: number, phase = 0): XY[] => Array.from({ length: n }, (_, i) => { const t = phase + (i * 2 * Math.PI) / n; return [CX + r * Math.cos(t), CY + r * Math.sin(t)] as XY })
function band(p: Part, r0: XY[], z0: number, r1: XY[], z1: number, smooth = true) {
  const n = r0.length
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    const a: V3 = [r0[i][0], r0[i][1], z0], b: V3 = [r0[j][0], r0[j][1], z0], c: V3 = [r1[j][0], r1[j][1], z1], d: V3 = [r1[i][0], r1[i][1], z1]
    if (!smooth) { p.quad(a, b, c, d); continue }
    const nr = (q: XY, dz: number): V3 => unit([q[0] - CX, q[1] - CY, dz])
    const dz = -((Math.hypot(r1[i][0] - CX, r1[i][1] - CY) - Math.hypot(r0[i][0] - CX, r0[i][1] - CY)) / Math.max(z1 - z0, 0.01)) * 5
    quadN(p, a, b, c, d, [nr(r0[i], dz), nr(r0[j], dz), nr(r1[j], dz), nr(r1[i], dz)])
  }
}
/** A rounded square (superellipse) about the axis. */
const rsq = (h: number, n = 24, e = 4): XY[] => Array.from({ length: n }, (_, i) => {
  const t = (i * 2 * Math.PI) / n, c = Math.cos(t), s = Math.sin(t)
  return [CX + h * Math.sign(c) * Math.abs(c) ** (2 / e), CY + h * Math.sign(s) * Math.abs(s) ** (2 / e)] as XY
})

// --- The shaft: an 11 m square of tan concrete, a dark recessed slot up the middle of each face ---
const S = 6.3, W = 1.5, SET = 0.6, TOP = 62.5, DZ = TOP - 32.5
{
  const sq: XY[] = [[CX - S, CY - S], [CX + S, CY - S], [CX + S, CY + S], [CX - S, CY + S]]
  for (let i = 0; i < 4; i++) {
    const a = sq[i], b = sq[(i + 1) % 4], L = 2 * S
    const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
    const at = (s: number, d = 0): XY => [a[0] + u[0] * s - n[0] * d, a[1] + u[1] * s - n[1] * d]
    const q = (p0: XY, p1: XY, z0: number, z1: number, part: Part) => part.quad([p0[0], p0[1], z0], [p1[0], p1[1], z0], [p1[0], p1[1], z1], [p0[0], p0[1], z1])
    q(at(0), at(S - W), 5, TOP, conc)
    q(at(S + W), at(L), 5, TOP, conc)
    q(at(S - W), at(S - W, SET), 5, TOP, conc)
    q(at(S + W, SET), at(S + W), 5, TOP, conc)
    // the slot: dark glass, a tan band every two storeys
    for (let z = 5; z < TOP - 0.1; z += 6.5) {
      const zb = Math.min(z + 1.4, TOP), zt = Math.min(z + 6.5, TOP)
      q(at(S - W, SET - 0.02), at(S + W, SET - 0.02), z, zb, conc)
      if (zt > zb) q(at(S - W, SET), at(S + W, SET), zb, zt, dark)
    }
  }
}

// --- The deck: a broad bronze body with a rounded balcony bulging out of each face ---
{
  // the body: a rounded square a little wider than the shaft, 62.5–70 m
  const B0 = rsq(7.4), B1 = rsq(8.8)
  band(bronze, B0, TOP - 0.01, B1, 64.0)
  band(bronze, B1, 64.0, B1, 65.6)
  band(dark, B1, 65.6, B1, 69.0)
  band(trim, B1, 69.0, B1, 69.6)
  band(bronze, B1, 69.6, rsq(8.0), 70.2)
  capPoly(roof, rsq(8.0), 70.2)
  capPoly(bronze, B0, TOP - 0.01, false)
  // the four balconies: rounded bulges reaching 11.4 m from the axis, a rounded underside
  const lobe = (dir: number, rr: number, rt: number): XY[] => {
    const c = Math.cos(dir), s = Math.sin(dir), n = 12, out: XY[] = []
    for (let i = 0; i <= n; i++) {
      const t = -Math.PI / 2 + (i / n) * Math.PI
      const u = Math.cos(t) * rr, v = Math.sin(t) * rt // u radial, v tangential
      out.push([CX + c * (6.4 + u) - s * v, CY + s * (6.4 + u) + c * v])
    }
    return out
  }
  for (let k = 0; k < 4; k++) {
    const dir = (k * Math.PI) / 2
    const L = [lobe(dir, 2.4, 4.2), lobe(dir, 4.4, 5.6), lobe(dir, 5.0, 6.0), lobe(dir, 5.0, 6.0), lobe(dir, 4.7, 5.8)]
    const z = [61.2, 63.6, 65.0, 69.4, 70.2]
    const open = (p: Part, r0: XY[], z0: number, r1: XY[], z1: number) => {
      for (let i = 0; i < r0.length - 1; i++) p.quad([r0[i][0], r0[i][1], z0], [r0[i + 1][0], r0[i + 1][1], z0], [r1[i + 1][0], r1[i + 1][1], z1], [r1[i][0], r1[i][1], z1])
    }
    open(bronze, L[0], z[0], L[1], z[1])
    open(bronze, L[1], z[1], L[2], z[2])
    open(dark, L[2], z[2] + 0.6, L[3], z[3] - 0.7)
    open(bronze, L[2], z[2], L[2], z[2] + 0.6)
    open(trim, L[3], z[3] - 0.7, L[3], z[3])
    open(bronze, L[3], z[3], L[4], z[4])
    capPoly(roof, L[4], z[4])
    capPoly(bronze, L[0], z[0], false)
  }
}

// --- Drum, cab, roof band, top room, masts ---
{
  const N = 8, ph = Math.PI / 8
  band(bronze, ring(6.2, 16), 70.2, ring(6.2, 16), 73.0)
  band(trim, ring(6.2, N, ph), 73.0, ring(6.3, N, ph), 73.4, false)
  band(win, ring(6.3, N, ph), 73.4, ring(7.0, N, ph), 76.3, false)
  band(bronze, ring(7.0, N, ph), 76.3, ring(7.1, N, ph), 77.6, false)
  band(bronze, ring(7.1, N, ph), 77.6, ring(6.2, N, ph), 78.5, false)
  capPoly(roof, ring(6.2, N, ph), 78.5)
  band(bronze, ring(3.8, N, ph), 78.5, ring(3.8, N, ph), 80.0, false)
  band(trim, ring(3.8, N, ph), 80.0, ring(4.0, N, ph), 80.3, false)
  capPoly(roof, ring(4.0, N, ph), 80.3)
  // antenna masts on the cab roof, of differing heights, chunky enough to read
  const masts: [number, number, number][] = [[0, 0, 88], [4.6, 0.6, 85.5], [-4.4, 1.2, 84.5], [0.8, 4.6, 86], [-1.0, -4.7, 85], [3.2, -3.4, 83.5]]
  for (const [dx, dy, top] of masts) {
    const r = 0.32, x = CX + dx, y = CY + dy
    const sq: XY[] = [[x - r, y - r], [x + r, y - r], [x + r, y + r], [x - r, y + r]]
    const z0 = Math.hypot(dx, dy) < 4 ? 80.3 : 78.5
    band(trim, sq, z0, sq, top, false)
    capPoly(trim, sq, top)
  }
}

finishModel('DFW Airport Center Tower', 'dal-dfw-control-tower', [
  { part: conc, material: finish('dfw-tower-concrete', 0xddcbaa) },
  { part: dark, material: finish('dfw-tower-dark', 0x5a5d62) },
  { part: win, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
  { part: trim, material: PALETTE.trim },
  { part: bronze, material: finish('dfw-tower-bronze', 0x6e645a) },
], { bearing: 0, osm: 'way/446187562', height: 88 }, 5000)
