/**
 * DFW Airport Terminal D and the Grand Hyatt DFW — procedural, CC0-1.0, no
 * textures.
 *
 *   bun generators/dal-dfw-terminal-d.ts
 *
 * Frame: x east, y north, z up, metres, placed at bearing 0 (the terminal's
 * west face runs due north). Anchor: area centroid of the outer way of the
 * OSM multipolygon relation/6640652 "Terminal D" (way/25483474),
 * -97.04405 32.89770.
 *
 * Terminal D (2005, HKS / Corgan) is a "C" around its parking garage: a
 * straight west side facing the apron, two diagonal wings and two gate
 * arms running east along the north and south. Identifying features, from
 * the photos and NAIP:
 * - one long, pale metal roof that follows the C as a barrel: its crest runs
 *   along the airside, highest at the two corners and dipping a little
 *   along the middle of the west side, and it falls in a long curve to a low
 *   eave over the landside curb; the barrel is cut off square at both ends
 *   over the gate arms, so from the airfield the roof reads as a long line
 *   with two raised, rounded shoulders;
 * - on the diagonal wings a row of glazed skylight strips runs down the
 *   landside slope; along the west side a glazed slot follows the crest;
 * - the west front bows out towards the apron, all glass under the roof;
 * - the Grand Hyatt: a 10-storey white slab standing on the terminal over
 *   the middle of the west side, its stair cores rising at the ends, the
 *   HYATT sign at the south end;
 * - low flat gate arms and wings at about 15 m.
 *
 * Evidence
 * - OSM: relation/6640652 (outer way/25483474, 177 nodes), its parts (9 to
 *   16 m tags, not used for heights) and the hotel way/449458671 (48 m,
 *   min 17 m), in this frame.
 * - Lidar: USGS 3DEP TX_Pecos_Dallas_B3_2018 (flown 2018), 1 m grid,
 *   work/dal-dfw-terminal-d/lidar.json. The apron (ground under the
 *   footprint) is at 10.0 m above the grid's ground_min; z = 0 here. Read
 *   above the apron: gate arms and flat wings 15.3 m, the arms' east halves
 *   19 m; the barrel's crest 30.4 m along the diagonals (x − y = −175 to the
 *   north, x + y ≈ −210 to the south) and 25.8 m at the middle of the west
 *   side (y ≈ −10), with the glazed slot along x ≈ −78 about 7 m lower; the
 *   landside slope 27.9 m 21 m off the crest, 23.3 m at 42 m, 15.8 m at
 *   64 m (fitted by crest − 17 (u/70)^2.2); airside 29.2 m 25 m off the
 *   crest and 23.5 m at 53 m (crest − 7 (u/53)^2); the west bow 24 m at the
 *   middle rising to 29 m at its ends; hotel roof 44.8 m, its end cores
 *   46–53 m.
 * - NAIP (USGS orthophoto via tools/usgs.py): plan, the pale roofs, the
 *   skylight strips on the wings, the crest slot.
 * - Published: Terminal D and the Grand Hyatt DFW opened July 2005; the
 *   hotel has 298 rooms and stands directly above the terminal (Wikipedia,
 *   "Dallas Fort Worth International Airport").
 * - Photos (Wikimedia Commons):
 *   https://commons.wikimedia.org/wiki/File:20110123_DFW_terminal_D.jpg
 *     (Squeamish at English Wikipedia, CC BY-SA 3.0) from the west across
 *     the runway: the long roof line, raised rounded ends, glass front,
 *     the white hotel slab and its HYATT sign;
 *   https://commons.wikimedia.org/wiki/File:20050612_DFW_D_Panorama.JPG
 *     (public domain) the airside front from the north-west: the bow's
 *     tall glass under the curved roof edge;
 *   https://commons.wikimedia.org/wiki/File:DFW_Terminals_ACD_View_from_Takeoff_(52831109800).jpg
 *     (formulanone, CC BY-SA 2.0) aerial from the east: both
 *     barrel wings with their ribs, the hotel's dark glass east face between
 *     pale end bays;
 *   https://commons.wikimedia.org/wiki/File:Dallas-Fort_Worth_International_Airport.jpg
 *     (Ziongarage, CC0) the roof's curve from the south-east.
 *   https://www.flickr.com/photos/89165847@N00/6854228473
 *     (mikecogh, CC BY-SA 2.0) the south wing's roof and skylights at
 *     sunset, behind the Center Tower.
 *
 * Estimated: the barrel's section between lidar samples (the fitted curves
 * above); the skylight strips' count and width (NAIP); glazing panel sizes;
 * the hotel's floor grouping (about 10 storeys from 17 m to 44.8 m). The
 * landside eave is drawn at the gate arms' 15.5 m where the real eave falls
 * to about 12 m over the curb. Simplified: jet bridges, the Skylink station
 * and its track, the garage bridges and the gate stubs' small roofs.
 *
 * Colours: the west panorama reads white — roof edge and fascia, the bowed
 * front, the hotel — with light blue-grey glass bands; the roofs are white
 * in NAIP. So the roofs are near-white, walls white, and the glass a light
 * sky grey-blue window variant.
 *
 * Doubts: the hotel's east face reads darker glass in the aerial and white
 * with ribbon windows from the west; drawn white with grouped bands.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { type XY, area, capPoly, facade, finishModel, inside, quadN, unit, type Facade } from './nyc-570-lexington'

const wall = new Part(), win = new Part(), roof = new Part(), vault = new Part(), glass = new Part(), trim = new Part()
const ccw = (r: XY[]) => (area(r) < 0 ? r.slice().reverse() : r)

// --- The OSM outline (way/25483474), this frame ---
const OUTLINE: XY[] = [[192.8,336.9],[192.3,255.2],[188.6,247.1],[188.4,213.9],[181.9,207.2],[158.9,207.2],[158.9,213.6],[133.4,213.4],[133.3,198.8],[85.4,198.5],[85.3,213.4],[59.8,213.5],[59.8,210.0],[53.1,209.9],[53.0,198.1],[12.4,197.6],[12.2,212.3],[-13.0,212.5],[-13.0,197.6],[-63.6,197.7],[-63.6,205.2],[-95.0,205.3],[-96.4,206.7],[-105.1,206.8],[-105.2,197.4],[-102.8,195.4],[-103.2,167.1],[-96.2,167.1],[-96.4,135.4],[-111.2,135.3],[-111.0,109.5],[-96.2,109.5],[-96.3,86.4],[-119.8,62.1],[-119.6,56.1],[-120.0,23.6],[-120.2,-52.3],[-120.4,-88.1],[-97.1,-113.0],[-97.5,-138.7],[-112.1,-138.6],[-112.2,-163.4],[-109.4,-163.4],[-109.4,-170.4],[-97.6,-170.6],[-97.7,-196.2],[-105.0,-196.0],[-105.1,-227.1],[-107.1,-228.9],[-107.1,-237.6],[-98.2,-237.6],[-96.4,-235.6],[-66.1,-236.1],[-66.2,-228.2],[-14.9,-228.5],[-14.8,-232.2],[-21.4,-232.2],[-21.4,-235.8],[-39.6,-235.6],[-39.6,-241.7],[-14.8,-242.0],[10.4,-243.6],[10.2,-228.6],[51.6,-228.9],[51.8,-240.8],[57.9,-241.0],[57.9,-243.7],[83.4,-244.2],[83.1,-228.9],[131.1,-229.2],[131.0,-243.8],[156.7,-244.0],[156.6,-229.4],[183.1,-229.4],[183.1,-226.5],[216.8,-226.4],[216.6,-215.4],[209.5,-215.5],[209.3,-206.3],[116.9,-206.0],[106.5,-196.1],[101.9,-195.7],[97.6,-194.3],[93.4,-191.8],[88.0,-186.7],[72.9,-171.2],[57.1,-155.0],[72.1,-140.4],[64.6,-132.9],[50.0,-147.7],[25.0,-122.7],[5.5,-103.1],[1.3,-97.9],[-2.3,-92.3],[-4.4,-88.0],[-6.7,-82.7],[-9.0,-76.6],[-10.3,-70.8],[-11.2,-65.2],[-11.6,-58.8],[-11.7,-48.6],[-11.7,-14.8],[-11.6,23.1],[-11.4,29.4],[-10.8,36.6],[-9.3,45.5],[-4.0,58.9],[2.2,68.9],[3.5,70.1],[19.1,85.6],[51.3,117.5],[65.5,103.5],[72.9,110.7],[58.7,125.0],[80.8,146.9],[84.5,150.6],[93.9,159.7],[97.2,162.1],[101.3,163.9],[104.7,164.8],[108.0,165.0],[112.1,168.8],[114.9,171.3],[166.9,171.4],[166.9,168.3],[177.8,168.3],[177.8,174.1],[211.1,173.9],[211.3,190.4],[218.5,192.0],[217.6,248.3],[218.9,324.1],[220.5,330.3],[219.5,334.8],[217.9,336.8]]

// --- The barrel roof region: the C between the landside edge and the airside line ---
const LANDSIDE: XY[] = [[114.9,171.3],[112.1,168.8],[108.0,165.0],[104.7,164.8],[101.3,163.9],[97.2,162.1],[93.9,159.7],[84.5,150.6],[80.8,146.9],[58.7,125.0],[51.3,117.5],[19.1,85.6],[3.5,70.1],[2.2,68.9],[-4.0,58.9],[-9.3,45.5],[-10.8,36.6],[-11.4,29.4],[-11.6,23.1],[-11.7,-14.8],[-11.7,-48.6],[-11.6,-58.8],[-11.2,-65.2],[-10.3,-70.8],[-9.0,-76.6],[-6.7,-82.7],[-4.4,-88.0],[-2.3,-92.3],[1.3,-97.9],[5.5,-103.1],[25.0,-122.7],[50.0,-147.7],[57.1,-155.0],[72.9,-171.2],[88.0,-186.7],[93.4,-191.8],[97.6,-194.3],[101.9,-195.7],[106.5,-196.1],[116.9,-206.0]]
const YN = 185, YS = -206, XW = -77
const VAULT: XY[] = ccw([
  [XW, YN], [118, YN], ...LANDSIDE, [XW, YS], [XW, -125], [-97.1, -113.0], [-120.4, -88.1], [-120.2, -52.3], [-120.0, 23.6],
  [-119.6, 56.1], [-119.8, 62.1], [-96.3, 86.4], [-80, 95], [XW, 105],
])

// The crest line, airside: north diagonal, west side, south diagonal.
const CREST: XY[] = [[40, 215], [-90, 85], [-90, -120], [0, -210], [30, -240]]
const smooth = (t: number) => { const c = Math.min(Math.max(t, 0), 1); return c * c * (3 - 2 * c) }
/** Signed distance from the crest, positive towards the landside (east). */
function crestU(x: number, y: number) {
  let best = Infinity, sign = 1
  for (let i = 0; i < CREST.length - 1; i++) {
    const a = CREST[i], b = CREST[i + 1], dx = b[0] - a[0], dy = b[1] - a[1]
    const t = Math.min(Math.max(((x - a[0]) * dx + (y - a[1]) * dy) / (dx * dx + dy * dy), 0), 1)
    const d = Math.hypot(x - a[0] - t * dx, y - a[1] - t * dy)
    if (d < best) { best = d; sign = dx * (y - a[1]) - dy * (x - a[0]) >= 0 ? 1 : -1 }
  }
  return sign * best
}
const BASE = 15.3, EAVE_MIN = 15.6
function vaultZ(x: number, y: number) {
  const c = 25.8 + 4.6 * smooth(Math.abs(y + 10) / 100)
  const u = crestU(x, y)
  const z = u >= 0 ? c - 17 * Math.pow(u / 70, 2.2) : c - 7 * (u / 53) ** 2
  return Math.max(z, EAVE_MIN)
}
const vaultN = (x: number, y: number): V3 => {
  const e = 0.5
  return unit([-(vaultZ(x + e, y) - vaultZ(x - e, y)) / (2 * e), -(vaultZ(x, y + e) - vaultZ(x, y - e)) / (2 * e), 1])
}

// --- Base: the whole outline at the gate arms' height, glass all round ---
/** The middle of the west front: white panels with long window bands (photo). */
const isBow = (a: XY, b: XY) => (a[0] + b[0]) / 2 < -98 && (a[1] + b[1]) / 2 > -112 && (a[1] + b[1]) / 2 < 88
const bowFacade: Facade = { bay: 30, ratio: 0.94, floor: 4.6, group: 1, spandrel: 2.4, sill: 2.5, head: 1.2, ground: 2.5, minLength: 5 }
const baseFacade: Facade = { bay: 9, ratio: 0.9, floor: 5.2, group: 1, spandrel: 2.2, sill: 1.6, head: 1.8, ground: 1.6, minLength: 5 }
{
  const ring = ccw(OUTLINE)
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    facade(wall, win, a, b, 0, BASE - 0.5, isBow(a, b) ? bowFacade : baseFacade)
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]); if (L < 1e-6) continue
    const n: XY = [(b[1] - a[1]) / L, -(b[0] - a[0]) / L]
    trim.quad([a[0] + n[0] * 0.15, a[1] + n[1] * 0.15, BASE - 0.5], [b[0] + n[0] * 0.15, b[1] + n[1] * 0.15, BASE - 0.5], [b[0] + n[0] * 0.15, b[1] + n[1] * 0.15, BASE], [a[0] + n[0] * 0.15, a[1] + n[1] * 0.15, BASE])
  }
  capPoly(roof, ring, BASE)
}

// The gate arms' raised east halves (19 m, lidar).
function box(x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, p: Part, top: Part) {
  const r: XY[] = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
  for (let i = 0; i < 4; i++) {
    const a = r[i], b = r[(i + 1) % 4]
    p.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
  }
  top.quad([x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1])
}
box(48, 186, 180, 199, BASE, 19, wall, roof)
box(48, -220, 180, -207, BASE, 19, wall, roof)

// --- The barrel roof: the region cut into 8 m cells, heights from the fitted section ---
function clip(poly: XY[], x0: number, y0: number, x1: number, y1: number): XY[] {
  const edges: [(p: XY) => number, number, number][] = [[(p) => p[0] - x0, 0, x0], [(p) => x1 - p[0], 0, x1], [(p) => p[1] - y0, 1, y0], [(p) => y1 - p[1], 1, y1]]
  let out = poly
  for (const [f, axis, v] of edges) {
    const src = out; out = []
    for (let i = 0; i < src.length; i++) {
      const a = src[i], b = src[(i + 1) % src.length], fa = f(a), fb = f(b)
      if (fa >= 0) out.push(a)
      if ((fa >= 0) !== (fb >= 0)) {
        const t = (v - a[axis]) / (b[axis] - a[axis])
        out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t])
      }
    }
    if (!out.length) break
  }
  // drop repeated points
  return out.filter((p, i) => { const q = out[(i + 1) % out.length]; return Math.hypot(p[0] - q[0], p[1] - q[1]) > 0.05 })
}
{
  const G = 8
  const tmp = new Part()
  for (let x = -128; x < 128; x += G) for (let y = -216; y < 192; y += G) {
    const piece = clip(VAULT, x, y, x + G, y + G)
    if (piece.length < 3 || Math.abs(area(piece)) < 0.5) continue
    tmp.pos = []; tmp.nrm = []; tmp.uv = []
    capPoly(tmp, piece, 0)
    for (let k = 0; k < tmp.pos.length; k += 9) {
      // capPoly wrote glTF-frame (x, z, −y); read back the plan points
      const P: V3[] = [0, 1, 2].map((j) => { const px = tmp.pos[k + 3 * j], py = -tmp.pos[k + 3 * j + 2]; return [px, py, vaultZ(px, py)] as V3 })
      vault.tri(P[0], P[1], P[2], undefined, undefined, undefined, P.map((p) => vaultN(p[0], p[1])))
    }
  }
}
// Its edges: walls from the flat roof up to the barrel, glazed where they face out.
{
  const ring = VAULT
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.ceil(L / 6))
    const nrm = unit([b[1] - a[1], a[0] - b[0], 0])
    for (let k = 0; k < n; k++) {
      const p = [a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n], q = [a[0] + (b[0] - a[0]) * (k + 1) / n, a[1] + (b[1] - a[1]) * (k + 1) / n]
      const zp = vaultZ(p[0], p[1]), zq = vaultZ(q[0], q[1])
      if (zp < BASE + 0.4 && zq < BASE + 0.4) { wall.quad([p[0], p[1], BASE - 0.5], [q[0], q[1], BASE - 0.5], [q[0], q[1], zq], [p[0], p[1], zp]); continue }
      const bow = isBow(a, b)
      quadN(bow ? wall : trim, [p[0], p[1], BASE - 0.5], [q[0], q[1], BASE - 0.5], [q[0], q[1], zq], [p[0], p[1], zp], [nrm, nrm, nrm, nrm])
      const g0 = BASE + (bow ? 2.2 : 0.6), gp = bow ? Math.min(zp, zq) - 2.2 : zp - 1.3, gq = bow ? Math.min(zp, zq) - 2.2 : zq - 1.3
      if (gp > g0 + 0.6 && gq > g0 + 0.6 && L / n > 3) {
        const d = 0.06, s = 0.35 / (L / n)
        const P = (t: number, z: number): V3 => [p[0] + (q[0] - p[0]) * t + nrm[0] * d, p[1] + (q[1] - p[1]) * t + nrm[1] * d, z]
        win.quad(P(s, g0), P(1 - s, g0), P(1 - s, gp + (gq - gp) * (1 - s)), P(s, gp + (gq - gp) * s))
      }
    }
  }
}
// Skylight strips down the landside slope of both diagonal wings, and the slot along the crest.
const HOTEL: XY[] = [[-50.8, -69.8], [-25.1, -72.4], [-25.5, 32.7], [-32.6, 35.4], [-32.7, 44.4], [-50.2, 44.5]]
function strip(a: XY, dir: XY, u0: number, u1: number, w: number) {
  const n: XY = [-dir[1], dir[0]], steps = 5
  const pts: [XY, XY][] = []
  for (let k = 0; k <= steps; k++) {
    const u = u0 + (u1 - u0) * k / steps, c: XY = [a[0] + dir[0] * u, a[1] + dir[1] * u]
    pts.push([[c[0] - n[0] * w / 2, c[1] - n[1] * w / 2], [c[0] + n[0] * w / 2, c[1] + n[1] * w / 2]])
  }
  for (let k = 0; k < steps; k++) {
    const [l0, r0] = pts[k], [l1, r1] = pts[k + 1]
    if (![l0, r0, l1, r1].every((p) => inside(p, VAULT) && !inside(p, HOTEL))) continue
    const Z = (p: XY): V3 => [p[0], p[1], vaultZ(p[0], p[1]) + 0.12]
    glass.quad(Z(r0), Z(l0), Z(l1), Z(r1))
  }
}
for (const [a, b] of [[CREST[0], CREST[1]], [CREST[2], CREST[3]]] as [XY, XY][]) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
  // the normal that points down the landside slope (+u)
  const nA: XY = [-t[1], t[0]], m: XY = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
  const land: XY = crestU(m[0] + nA[0] * 10, m[1] + nA[1] * 10) > 0 ? nA : [-nA[0], -nA[1]]
  for (let s = 34; s < L - 8; s += 11.5) strip([a[0] + t[0] * s, a[1] + t[1] * s], land, 7, 60, 2.6)
}
for (let y = -112; y < 96; y += 8) {
  const x0 = -80.5, x1 = -76.5, y1 = Math.min(y + 8, 96)
  const Z = (x: number, yy: number): V3 => [x, yy, vaultZ(x, yy) + 0.12]
  glass.quad(Z(x0, y), Z(x1, y), Z(x1, y1), Z(x0, y1))
}

// --- The Grand Hyatt: a white slab from the terminal roof to 44.8 m, cores to 53 m ---
const hotelFacade: Facade = { bay: 6.5, ratio: 0.72, floor: 3.3, group: 2, spandrel: 0.9, sill: 1.2, head: 1.6, minLength: 5 }
{
  const ring = ccw(HOTEL), z0 = 20, z1 = 44.8
  // white all round with grouped window bands (west photo); the east face's glass a little broader, between solid end bays
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    const east = a[0] > -27 && b[0] > -27 && Math.abs(a[1] - b[1]) > 50
    facade(wall, win, a, b, z0, z1 - 0.6, east ? { ...hotelFacade, ratio: 0.85, margin: 9 } : hotelFacade)
  }
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n: XY = [(b[1] - a[1]) / L, -(b[0] - a[0]) / L]
    trim.quad([a[0] + n[0] * 0.12, a[1] + n[1] * 0.12, z1 - 0.6], [b[0] + n[0] * 0.12, b[1] + n[1] * 0.12, z1 - 0.6], [b[0] + n[0] * 0.12, b[1] + n[1] * 0.12, z1], [a[0] + n[0] * 0.12, a[1] + n[1] * 0.12, z1])
  }
  capPoly(roof, ring, z1)
  // stair and lift cores standing above the roof at both ends (lidar 46–53 m)
  box(-46, 30, -34, 43, z1, 52, trim, roof)
  box(-44, -70, -27, -58, z1, 50, trim, roof)
  // the HYATT sign's panel on the south core, facing west and east
  box(-45, -69, -43.6, -59, 50, 52.5, trim, trim)
}

finishModel('DFW Airport Terminal D and Grand Hyatt DFW', 'dal-dfw-terminal-d', [
  { part: wall, material: finish('dfw-d-panel', 0xf1f1ef) },
  { part: win, material: windowVariant(2, 0xa9bfd1) },
  { part: roof, material: finish('dfw-d-flat-roof', 0xdfe3e5) },
  { part: vault, material: finish('dfw-d-roof', 0xeef0f1) },
  { part: glass, material: PALETTE.glass },
  { part: trim, material: PALETTE.trim },
], { bearing: 0, osm: 'relation/6640652', height: 52.5 }, 6500)

