/**
 * Tokyo International Airport (Haneda) Terminal 3, the international
 * terminal (2010, extended 2014; called Terminal 3 since 2020), with its
 * long curved departure-hall roof and its piers — procedural, CC0-1.0, no
 * textures.
 * bun generators/tokyo-haneda-terminal-3.ts
 *
 * Writes models/tokyo-haneda-terminal-3.glb (low) and
 * models/tokyo-haneda-terminal-3.detail.glb (detail). Built with the kit in
 * tokyo-haneda-terminal-1.ts.
 *
 * Map frame: x = model east, y = model north, z up, metres. Placed at
 * bearing −30°, like Terminals 1 and 2. Anchor: area centroid of the OSM
 * outline way/82592609. The landside faces −x (west), the main pier runs
 * along x ≈ 0–27 with its gates to +x, the north pier along y ≈ 270–304 with
 * its gates to +y.
 *
 * Identifying features (photos): the departure hall under one long, thin,
 * pale roof whose landside eave sags in the middle and sweeps up at both
 * ends, edged with a white fascia and a pale green line; on the airside the
 * eave carries a row of small sharp peaks, one per roof bay, over a band of
 * glazing above the pier; a tall glass wall on the landside; long low glazed
 * piers with jet bridges.
 *
 * Evidence
 * - OSM: way/82592609 (Terminal 3, height 22, 5 levels), way/1435247063
 *   (the departure hall, height 25, roof:height 18.15, skillion; its tags
 *   are read as the hall rising above the piers), way/322819164 (The Royal
 *   Park Hotel, left to the map: the hall roof stops at its south wall).
 * - Published: opened 21 October 2010 as the international terminal,
 *   extended 2014, renamed Terminal 3 in March 2020; five storeys (Japanese
 *   Wikipedia, "東京国際空港").
 * - Photos (Wikimedia Commons):
 *   https://commons.wikimedia.org/wiki/File:New_International_Terminal_of_Tokyo_International_Airport_(4934805392).jpg
 *     (Kentaro Iemoto, CC BY-SA 2.0) the airside: the peaked eave, the hall
 *     glazing above the pier, the pier's two glazed storeys;
 *   https://commons.wikimedia.org/wiki/File:New_International_Terminal!_(5043120391).jpg
 *     (Kentaro Iemoto, CC BY-SA 2.0) the pier face;
 *   https://commons.wikimedia.org/wiki/File:Tokyo_International_Airport_Terminal_3.jpg
 *     (きりしまゆうき, CC BY-SA 4.0) the landside glass wall and the sagging,
 *     upswept eave;
 *   https://commons.wikimedia.org/wiki/File:Haneda_airport_international_terminal_building-2.jpg
 *     (AD Train, CC BY-SA 1.0) the eave's soffit and green line;
 *   https://commons.wikimedia.org/wiki/File:Tokyo_International_Airport_T3_20240604.jpg
 *     (颐园居, CC BY 4.0) the hall at dusk from a pier;
 *   https://commons.wikimedia.org/wiki/File:Haneda-Airport-Terminal3---2025-06-15_189.jpg
 *     and _046.jpg (RuinDig/Yuki Uchida, CC BY 4.0) the eave's peaks from
 *     the observation deck, a pier.
 *
 * Estimated: the piers at 18 m (the pier against the hall's eave in Iemoto's
 * photo, OSM's 22 m read as a top including plant); the hall's walls to 21 m
 * and glass up to the roof; the landside eave 25 m in the middle rising to
 * 34 m at the ends, the airside eave 26.5 m with 3.2 m peaks at eight bays;
 * the roof 1.3 m thick; the landside link deck to the station at 10 m.
 * Doubts: OSM's hall part reaches 40 m further north than the model's roof,
 * over the hotel; the model stops at the hotel. The small dome on the pier
 * roof and the rooftop deck's railings are left out.
 */
import { type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, type Facade, type Zone, despur, simplify, zoneMass, jetBridges, prismRing, writeLod, newMats, clipRect, ccw, inside } from './tokyo-haneda-terminal-1'
import { quadN, unit } from './nyc-570-lexington'

// ===========================================================================
// OSM data, in this frame (bearing -30, anchor 139.7689970, 35.5458505)
// ===========================================================================

/** OSM way/82592609 */
export const T3_OUTLINE: XY[] = [[-153.2, 321.1], [-144.7, 302.7], [-144.8, 304.1], [-85.2, 303.7], [-84.9, 322.8], [-84.9, 327.3], [-81.9, 327.3], [-82, 324.9], [-79.1, 324.9], [-79.2, 320.9], [-81.6, 321], [-81.9, 303.7], [-20.4, 303.3], [-20.1, 322], [-20.1, 326.9], [-17.1, 326.9], [-17.1, 324.5], [-14.3, 324.5], [-14.3, 320.5], [-16.8, 320.6], [-17, 303.2], [68.1, 302.7], [68.4, 323.2], [68.4, 327.1], [71.4, 327.1], [71.3, 324.7], [74.2, 324.6], [74.1, 320.7], [71.7, 320.8], [71.4, 302.7], [144.9, 302.2], [145.2, 323.3], [145.3, 327.3], [148.2, 327.3], [148.2, 324.9], [151, 324.9], [151, 320.9], [148.5, 321], [148.3, 302.2], [219.8, 301.7], [220, 322.4], [220.1, 326.8], [223.1, 326.7], [223, 324.3], [225.9, 324.3], [225.8, 320.3], [223.4, 320.4], [223.1, 301.7], [297.8, 301.2], [298.1, 321.7], [298.2, 326.9], [301.2, 326.9], [301.1, 324.5], [304, 324.5], [303.9, 320.5], [301.5, 320.6], [301.2, 301.2], [358.3, 300.9], [358.3, 297.6], [372.7, 318.9], [372.8, 321.7], [372.9, 323.9], [375.9, 323.9], [375.8, 321.5], [378.7, 321.5], [378.6, 317.5], [376.2, 317.6], [358.4, 291.2], [357.8, 268.6], [311.7, 268.8], [301, 268.7], [44.3, 269.5], [42.1, 265.1], [39.5, 259.9], [35.2, 251.2], [26.8, 234.1], [26.6, 219.9], [26.5, 206.6], [26.3, 196.2], [26.3, 188.5], [26.9, 155.4], [27.2, 145.9], [54.9, 145.3], [55.1, 142.8], [55, 139.5], [27.2, 139.3], [27.5, 74.3], [55.2, 74.3], [55.5, 71.5], [55.8, 68.6], [27.6, 67.8], [27.5, 18.9], [28, 2.7], [55.4, 2], [55.6, -1.1], [55.7, -3.3], [27.6, -3.1], [27, -52.9], [44.6, -67.8], [48.5, -70.8], [49.8, -90.9], [44.8, -94.9], [27, -109.2], [24.2, -111.4], [25, -150.6], [53.2, -151.2], [53.1, -154.7], [53.1, -158.3], [25.2, -157.7], [26.6, -222.2], [56.9, -222.7], [56.8, -228], [56.8, -231], [26.6, -230.3], [27.1, -294.7], [55.2, -295.4], [55.1, -302.8], [55.1, -309.1], [27.7, -308.5], [28.1, -351.3], [27.4, -358.8], [25.5, -364.8], [24.1, -367.9], [48.6, -380.8], [55.3, -380.7], [55.5, -391.6], [55.7, -398.4], [18.3, -379.5], [9, -397.5], [6.4, -404.9], [5.4, -412.2], [6.3, -471.4], [32.7, -471.5], [32.8, -475.6], [33.1, -485.4], [6.5, -485.4], [6.8, -506.3], [-0.4, -505.8], [-5.8, -505.8], [-5.1, -550.4], [29.8, -550.2], [29.9, -552.5], [29.9, -554.6], [-11.4, -554.8], [-11.1, -506], [-14.8, -505.8], [-14.9, -450.3], [-22.1, -450.4], [-22.5, -394.9], [-15.4, -394.9], [3.4, -357.6], [-4.2, -357.2], [-4.1, -324.4], [2.8, -324.9], [2.7, -279.2], [-8.3, -279.7], [-8.8, -276.4], [-11.6, -200.6], [-60.7, -201.1], [-60.4, -196.6], [-62.6, -196.4], [-62.5, -180.8], [-98.4, -173], [-110.1, -172.7], [-109.9, -186.8], [-110, -205.6], [-121.9, -205.7], [-122.7, -141.5], [-122, -111.9], [-124.6, -111.6], [-127.3, -111.6], [-127.4, -109.1], [-141.5, -108.8], [-141.7, -102.1], [-141.8, -98], [-141.8, -93.8], [-150.6, -93.1], [-155.2, -79.8], [-155.3, -61.3], [-155.4, -56.1], [-155.4, -40], [-155.5, -39.7], [-155.8, 12.2], [-155.9, 20.1], [-136.4, 19.5], [-136.8, 11.9], [-131.3, 11.8], [-131.6, -39], [-126.6, -51.7], [-127, -66.7], [-123.3, -66.9], [-121.4, -66.8], [-121.4, -59.3], [-121.7, 34.6], [-100.1, 34.8], [-19.3, 30.2], [-13.4, 29.3], [-12.1, 29.3], [-3.4, 30], [-10.3, 212], [-38.4, 212.2], [-38.6, 226.5], [-38.8, 242.6], [-17.8, 242.8], [-18.1, 252.2], [-18, 260.2], [-18, 266.2], [-18, 269.7], [-148.1, 269.2], [-148, 273.5], [-148, 282.2], [-147.6, 298.1], [-157.4, 318.4], [-157.1, 321.1], [-157.1, 323.4], [-157.1, 327.1], [-154.2, 327.1], [-154.2, 325.1], [-151.1, 325.1], [-151.1, 321.1]]
/** OSM way/1435247063 */
export const T3_HALL: XY[] = [[-112.5, 75.6], [-122.1, 77], [-123.4, 29.3], [-123.3, -65], [-138.6, -63.2], [-141.7, -102.1], [-117.9, -104], [-121.9, -205.7], [-110, -205.6], [-110.1, -172.7], [-98.4, -173], [-81.1, -173.5], [-23.6, -173.1], [-22.4, -158], [-21.9, 75.9]]

// ===========================================================================
// Terminal 3
// ===========================================================================

/** The hall roof: eaves (model x) and ends (model y), and its height field. */
const XL = -126, XA = -21, Y0 = -176, Y1 = 37
const BAY = (Y1 - Y0) / 8 // the airside eave rises to a small peak at every bay line
function roofTop(x: number, y: number) {
  const u = (x - XL) / (XA - XL), s = (2 * (y - Y0)) / (Y1 - Y0) - 1
  const zL = 25 + 9 * s * s // the landside eave sags in the middle and sweeps up to both ends
  const zA = 26.5 + 4 * s ** 4 // the airside eave is nearly level, curling up at the ends
  const off = Math.abs((((y - Y0) % BAY) + BAY) % BAY), p = Math.min(off, BAY - off) // distance to the nearest bay line
  const peak = 3.2 * Math.max(0, 1 - p / 5.3) // a small sharp peak at every bay line, on the airside eave
  return zL + (zA - zL) * u + 1.2 * Math.sin(Math.PI * u) + peak * u ** 4
}
const T_ROOF = 1.3

function buildT3(detail: boolean) {
  const M = newMats(['wall', 'win', 'roof', 'trim', 'bridge', 'green'])
  const { body, spurs } = despur(T3_OUTLINE)
  const B = simplify(body, 0.35)
  const d = (f: Facade): Facade => (detail ? { ...f, bay: f.bay / 2.5, ratio: 0.9 } : f)
  // The piers: a dark service floor, then the glazed gate lounges, two storeys a panel.
  const PIER: Facade = d({ bay: 9, ratio: 0.94, floor: 4.6, group: 2, spandrel: 1.0, sill: 1.0, head: 2.2, ground: 6.4, minLength: 6 })
  // The hall: one glass wall from the ground to the roof.
  const HALL: Facade = d({ bay: 9, ratio: 0.95, floor: 5.5, group: 4, spandrel: 0.6, sill: 0.3, head: 0.2, ground: 0.6, minLength: 4 })
  const H_PIER = 18, H_HALLWALL = 21
  const zones: Zone[] = [
    { rect: [-400, -600, 500, 500], z: H_PIER, facade: PIER },
    { rect: [-160, -100, -121.8, 25], z: 10, facade: PIER }, // the landside link deck to the station and car park
    { rect: [XL, Y0, XA, 40], z: H_HALLWALL, facade: HALL, lip: 0 },
  ]
  const { pieces } = zoneMass(M, B, zones)

  // --- The hall's glazing from its walls up to the underside of the roof ---
  const hall = pieces.find((p) => p.zone.z === H_HALLWALL)!.ring
  for (let i = 0; i < hall.length; i++) {
    const a = hall[i], b = hall[(i + 1) % hall.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]); if (L < 0.5) continue
    const n: XY = [(b[1] - a[1]) / L, (a[0] - b[0]) / L], m: XY = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
    const out: XY = [m[0] + n[0] * 0.3, m[1] + n[1] * 0.3]
    if (inside(out, B) && out[0] >= XL && out[0] <= XA && out[1] >= Y0 && out[1] <= 40) continue // inside the hall
    const steps = Math.max(1, Math.round(L / (detail ? 6 : 18)))
    for (let k = 0; k < steps; k++) {
      const p = (t: number): XY => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
      const p0 = p(k / steps), p1 = p((k + 1) / steps)
      const z0 = H_HALLWALL, za = roofTop(p0[0], p0[1]) - T_ROOF, zb = roofTop(p1[0], p1[1]) - T_ROOF
      const N: V3 = [n[0], n[1], 0]
      quadN(M.win, [p0[0], p0[1], z0 - 0.02], [p1[0], p1[1], z0 - 0.02], [p1[0], p1[1], zb], [p0[0], p0[1], za], [N, N, N, N])
    }
  }

  // --- The hall roof: a smooth grid between the eaves, with its fascia and soffit ---
  const nx = detail ? 14 : 6, ny = detail ? 96 : 48
  const X = (i: number) => XL + ((XA - XL) * i) / nx, Y = (j: number) => Y0 + ((Y1 - Y0) * j) / ny
  const top = (i: number, j: number): V3 => [X(i), Y(j), roofTop(X(i), Y(j))]
  const bot = (i: number, j: number): V3 => [X(i), Y(j), roofTop(X(i), Y(j)) - T_ROOF]
  const nrm = (x: number, y: number): V3 => { const e = 0.5; return unit([-(roofTop(x + e, y) - roofTop(x - e, y)) / (2 * e), -(roofTop(x, y + e) - roofTop(x, y - e)) / (2 * e), 1]) }
  for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) {
    const ns = [[i, j], [i + 1, j], [i + 1, j + 1], [i, j + 1]].map(([a, b]) => nrm(X(a), Y(b))) as [V3, V3, V3, V3]
    quadN(M.roof, top(i, j), top(i + 1, j), top(i + 1, j + 1), top(i, j + 1), ns)
    const nd = ns.map((v) => [-v[0], -v[1], -v[2]] as V3) as [V3, V3, V3, V3]
    quadN(M.trim, bot(i, j), bot(i, j + 1), bot(i + 1, j + 1), bot(i + 1, j), [nd[0], nd[3], nd[2], nd[1]])
  }
  // fascia: white band with a pale green line along its top
  const edge: [number, number][] = []
  for (let i = 0; i < nx; i++) edge.push([i, 0])
  for (let j = 0; j < ny; j++) edge.push([nx, j])
  for (let i = nx; i > 0; i--) edge.push([i, ny])
  for (let j = ny; j > 0; j--) edge.push([0, j])
  for (let k = 0; k < edge.length; k++) {
    const [i0, j0] = edge[k], [i1, j1] = edge[(k + 1) % edge.length]
    const A = top(i0, j0), Bt = top(i1, j1), C = bot(i1, j1), D = bot(i0, j0)
    const g = 0.35
    const Ag: V3 = [A[0], A[1], A[2] - g], Bg: V3 = [Bt[0], Bt[1], Bt[2] - g]
    M.green.quad(Bt, A, Ag, Bg)
    M.trim.quad(Bg, Ag, D, C)
  }
  // detail: the roof's bay ribs and the hall's mullion fins
  if (detail) {
    for (let j = 0; j <= 8; j++) {
      const y = Y0 + BAY * j
      for (let i = 0; i < nx; i++) {
        const xa = X(i), xb = X(i + 1), za = roofTop(xa, y), zb = roofTop(xb, y)
        quadN(M.trim, [xa, y - 0.5, za + 0.02], [xb, y - 0.5, zb + 0.02], [xb, y + 0.5, zb + 0.02], [xa, y + 0.5, za + 0.02], [[0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1]])
      }
    }
  }

  // --- Jet bridges ---
  jetBridges(M, spurs, { z0: 5.0, z1: 8.4, detail })

  return [
    { part: M.wall, material: finish('hnd-t3-panel', 0xd5d8d9) },
    { part: M.win, material: { name: 'window', color: 0x9db3c4, roughness: 0.35 } },
    { part: M.roof, material: finish('hnd-t3-roof', 0xb3b8bb) },
    { part: M.trim, material: finish('hnd-t3-white', 0xf1f1ee) },
    { part: M.bridge, material: finish('hnd-jet-bridge', 0xc6cacd) },
    { part: M.green, material: finish('hnd-t3-fascia', 0xa9d1b0) },
  ]
}

if (import.meta.main) {
  const extras = { bearing: -30, osm: 'way/82592609', height: 32 }
  writeLod('Haneda Airport Terminal 3', 'tokyo-haneda-terminal-3.glb', buildT3(false), extras, 8000, 250_000)
  writeLod('Haneda Airport Terminal 3', 'tokyo-haneda-terminal-3.detail.glb', buildT3(true), extras, 40_000, 1_500_000)
}
