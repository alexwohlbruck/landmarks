/**
 * Tokyo International Airport (Haneda) Terminal 2 (2004), with its north and
 * east piers and the international facilities opened at its south end in
 * 2020 — procedural, CC0-1.0, no textures.
 * bun generators/tokyo-haneda-terminal-2.ts
 *
 * Writes models/tokyo-haneda-terminal-2.glb (low) and
 * models/tokyo-haneda-terminal-2.detail.glb (detail). Built with the kit in
 * tokyo-haneda-terminal-1.ts.
 *
 * Map frame: x = model east, y = model north, z up, metres. Placed at
 * bearing −30°, like Terminal 1. Anchor: area centroid of the outer ring of
 * the OSM multipolygon relation/18910656. The landside faces −x (west,
 * towards Terminal 1 and the car parks), the airside +x (runway C).
 *
 * Identifying features (photos): the landside blocks of teal-banded glass
 * under thin white roof blades that rise towards the road and overhang it;
 * the round glass Market Place rotunda under a bold white disc overhanging
 * it like a hat brim; the long
 * airside pier and the north and east piers with jet bridges; at the south
 * end the 2020 international facilities: a row of white shells whose
 * pointed-arch ends meet in Vs, dark glazing down the valleys, over a white
 * facade crossed by big white diagonals and a pale teal band.
 *
 * Evidence
 * - OSM: relation/18910656 (Terminal 2, outer way/152955032; its small inner
 *   courtyard way/1372696099 is filled in, a doubt); building:parts and
 *   buildings inside it, used as mapped with their tags: way/1435252861 and
 *   way/1435252867 (44 m, saltbox), way/1435252859 (40 m, saltbox),
 *   way/1435252866 (41 m, flat), way/1435252860 (the rotunda, 44 m),
 *   way/1435268183 (6 levels → 31 m), way/1435268182, way/1435252862,
 *   way/1435268180 (5 levels → 28 m), way/1435268184 (5 levels → 25 m),
 *   way/1435251058 (the 2F international deck, 30.75 m, saltbox) and
 *   way/1449343406–9 (its four vaults), way/1435268186 (the airside pier,
 *   4 levels), small 2-level gate pods way/1435263061–65.
 * - Published: opened 1 December 2004; the international facilities opened
 *   29 March 2020 (Japanese Wikipedia, "東京国際空港").
 * - Photos (Wikimedia Commons):
 *   https://commons.wikimedia.org/wiki/File:Haneda_Bigbird_Terminal_2.jpg
 *     (CC BY-SA 3.0) and
 *   https://commons.wikimedia.org/wiki/File:HND_Airport_Terminal_2.jpg
 *     (JobanLineE531, CC BY-SA 3.0) the landside: blocks, blades, rotunda;
 *   https://commons.wikimedia.org/wiki/File:Tokyo_International_Airport_Terminal_2_-01.jpg
 *     and _-03.jpg (Aimaimyi, CC BY-SA 3.0) the blocks and blades close up;
 *   https://commons.wikimedia.org/wiki/File:Haneda_Airport_Terminal_2_International_Flight_Facilities,_Tokyo,_Japan.jpg
 *     (KyoritsuJP, CC BY-SA 4.0) the vaults and diagonals;
 *   https://commons.wikimedia.org/wiki/File:Tokyo_International_Airport_Terminal_2_Apron_(2023_Feb).jpg
 *     (SuFlyer, CC0) the airside pier;
 *   https://commons.wikimedia.org/wiki/File:Haneda_Airport_-_panoramio_-_oimo.jpg
 *     (oimo, CC BY-SA 3.0) aerial c. 2009: the long pale blade roofs, the
 *     dark pier roofs (before the north pier and the 2020 wing).
 * - The 44 m tags agree with the RuinDig/Yuki Uchida 2025 telephoto from
 *   Terminal 3 (CC BY 4.0), where Terminal 2 stands as high as the nearer
 *   Terminal 1 despite being 1.7 times further.
 *
 * Estimated: the piers at 18 m; the departure hall behind the blocks at
 * 24 m; the curbside front under the blocks at 10 m; the deck's vault
 * springing at 21 m (OSM gives only the top); the blades' tilt and 6 m
 * overhang; the rotunda's glass from 8 m and its brim 7.5 m proud, 3.4 m
 * thick (from Bigbird and JobanLineE531's photos); the shells' pointed
 * section and the valley glazing's share (from KyoritsuJP's photo); the
 * diagonals' layout. The curbside wave canopy is outside the outline and
 * drawn in the detail level only (its wavelength, 24 m, and height are
 * estimated from Aimaimyi's photos). Doubts: the north pier was not photographed; the Haneda Excel
 * Hotel Tokyu (way/322878924, way/500688112) and way/1159870370 stand partly
 * over the outline and are left to the map.
 */
import { type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, type Facade, type Zone, type Mats, despur, simplify, zoneMass, jetBridges, prismRing, vault, drum, writeLod, newMats, ccw } from './tokyo-haneda-terminal-1'
import { capPoly, quadN, unit } from './nyc-570-lexington'

/** A thin sloping roof blade over a box, high along one long side, overhanging it. */
function blade(p: Mats[string], x0: number, y0: number, x1: number, y1: number, zLo: number, zHi: number, high: 'w' | 'e', over: number, t = 0.7) {
  const X0 = x0 - (high === 'w' ? over : 1), X1 = x1 + (high === 'e' ? over : 1), Y0 = y0 - 1, Y1 = y1 + 1
  const z = (x: number) => (high === 'w' ? zHi + ((zLo - zHi) * (x - X0)) / (X1 - X0) : zLo + ((zHi - zLo) * (x - X0)) / (X1 - X0))
  const top = (x: number, y: number): V3 => [x, y, z(x)], bot = (x: number, y: number): V3 => [x, y, z(x) - t]
  const corners: XY[] = [[X0, Y0], [X1, Y0], [X1, Y1], [X0, Y1]]
  p.quad(top(X0, Y0), top(X1, Y0), top(X1, Y1), top(X0, Y1))
  p.quad(bot(X0, Y0), bot(X0, Y1), bot(X1, Y1), bot(X1, Y0))
  for (let i = 0; i < 4; i++) {
    const a = corners[i], b = corners[(i + 1) % 4]
    p.quad(bot(a[0], a[1]), bot(b[0], b[1]), top(b[0], b[1]), top(a[0], a[1]))
  }
}
/**
 * A shell over x0…x1 spanning y0…y1 with a pointed-arch section: two circular
 * arcs from the springing lines at z0 meeting at the crown z0 + rise. The
 * lowest `valley` share of each side, and a `band` along each end following
 * the arch, are drawn in `valleyPart` (the dark glazing);
 * the ends are flat pointed-arch faces with an arched window panel.
 */
function shell(p: Mats[string], valleyPart: Mats[string], win: Mats[string], x0: number, y0: number, x1: number, y1: number, z0: number, rise: number, n: number, valley = 0.2, band = 3) {
  const a = (y1 - y0) / 2, e = 0.9 * a
  const zc = (e * e + rise * rise - a * a - 2 * a * e) / (2 * rise) // centre height of the left arc (centre at y0 + a + e)
  const cyL = y0 + a + e, R = Math.hypot(a + e, zc)
  const t0 = Math.atan2(0 - zc, y0 - cyL), t1 = Math.atan2(rise - zc, y0 + a - cyL)
  const left: [number, number, V3][] = [] // (y, z, normal)
  for (let i = 0; i <= n; i++) {
    const t = t0 + ((t1 - t0) * i) / n
    const y = cyL + R * Math.cos(t), z = z0 + zc + R * Math.sin(t)
    left.push([y, z, [0, Math.cos(t), Math.sin(t)]])
  }
  const right = left.map(([y, z, nn]) => [y1 - (y - y0), z, [0, -nn[1], nn[2]]] as [number, number, V3]).reverse()
  // along x: a dark glazed strip at each end following the arch, the white shell between
  const xs: [number, number, boolean][] = [[x0, x0 + band, true], [x0 + band, x1 - band, false], [x1 - band, x1, true]]
  for (const [xa, xb, edge] of xs) for (const side of [left, right]) for (let i = 0; i < n; i++) {
    const [ya, za, na] = side[i], [yb, zb, nb] = side[i + 1]
    const low = side === left ? i < n * valley : i >= n * (1 - valley)
    quadN(edge || low ? valleyPart : p, [xa, ya, za], [xb, ya, za], [xb, yb, zb], [xa, yb, zb], [na, na, nb, nb])
  }
  const prof = [...left, ...right.slice(1)]
  for (const [x, sx] of [[x0, -1], [x1, 1]] as [number, number][]) {
    const nE: V3 = [sx, 0, 0]
    for (let i = 1; i < prof.length - 1; i++) p.tri([x, prof[0][0], prof[0][1]], [x, prof[i][0], prof[i][1]], [x, prof[i + 1][0], prof[i + 1][1]], undefined, undefined, undefined, [nE, nE, nE])
    // an arched window panel in the end, 0.06 m proud, following the arch at 55 %
    const k = 0.55, ym = (y0 + y1) / 2, zb = z0 + 1.2
    const pts = prof.map(([y, z]) => [ym + (y - ym) * k, zb + (z - z0) * k] as XY)
    const xx = x + sx * 0.06
    for (let i = 1; i < pts.length - 1; i++) win.tri([xx, pts[0][0], pts[0][1]], [xx, pts[i][0], pts[i][1]], [xx, pts[i + 1][0], pts[i + 1][1]], undefined, undefined, undefined, [nE, nE, nE])
  }
}
const bbox = (r: XY[]) => [Math.min(...r.map((p) => p[0])), Math.min(...r.map((p) => p[1])), Math.max(...r.map((p) => p[0])), Math.max(...r.map((p) => p[1]))] as [number, number, number, number]

// ===========================================================================
// OSM data, in this frame (bearing -30, anchor 139.7887751, 35.5514518)
// ===========================================================================

/** OSM way/152955032 */
export const T2_OUTLINE: XY[] = [[22.5, 397.6], [6.9, 412.7], [6.5, 490.2], [25.7, 490.2], [25.6, 496.2], [25.6, 498.5], [6.4, 498.6], [6, 552], [25.4, 552.1], [25.4, 554.5], [25.4, 565], [22.4, 565], [5.9, 564.9], [5.4, 637], [25.1, 636.9], [25.1, 639.4], [25.1, 649.8], [23, 649.8], [5.4, 649.9], [0.1, 669.8], [-17.5, 736.7], [-17.5, 740.1], [-0.6, 740], [-0.6, 742.1], [-0.6, 750.2], [-6.5, 750.2], [-6.5, 748.3], [-16.9, 748.4], [-17, 814.9], [-1.1, 814.8], [-1.1, 816.9], [-1.1, 824.3], [-7.1, 824.3], [-7.1, 822.5], [-17.1, 822.5], [-17.2, 884.6], [-1.3, 884.5], [-1.3, 886.7], [-1.3, 894.8], [-6.8, 894.8], [-6.8, 892.8], [-17, 892.8], [-17, 896], [-40.8, 896.1], [-40.4, 719.2], [-31.5, 719.2], [-17, 667.5], [-14.7, 659.4], [-18.3, 658.8], [-16.7, 649.7], [-17, 563.2], [-12.5, 563.2], [-12.7, 479], [-17.3, 478.9], [-17.8, 365.8], [-13.2, 365.8], [-13, 309.4], [-3.6, 309.4], [-3.2, 202.5], [-27.5, 202.6], [-27.7, 254.5], [-47, 254.6], [-53.8, 254.6], [-53.8, 247.4], [-53.7, 202.8], [-68.8, 202.8], [-69.2, 105.7], [-69.6, 6.6], [-69.7, -45], [-69.7, -80], [-69.4, -181.2], [-69.5, -240.5], [-69.6, -318.1], [-69.7, -343.6], [-69.7, -363], [-125, -425.5], [-148.5, -425.5], [-147.8, -477.5], [-75.2, -477.8], [-74.9, -441.1], [-41.8, -441.1], [-44.7, -456.9], [-48.4, -457], [-48.5, -463.4], [-48.1, -464.8], [-47.2, -465.7], [-46, -465.8], [-45.3, -465.4], [-44.9, -464.7], [-45, -463.4], [-35.2, -463.6], [-35.3, -461.4], [-35.4, -458.6], [-37.3, -458.6], [-33.9, -441.1], [-0.7, -440.6], [23, -440.3], [23.7, -458.2], [22.3, -458.2], [22.7, -462.5], [23.1, -463.3], [23.6, -463.9], [24.4, -464.2], [25.4, -464.2], [26.3, -463.6], [26.8, -462.7], [35.9, -462.6], [35.8, -460.2], [35.8, -457.9], [32.2, -457.9], [31.6, -440.2], [64.9, -439.8], [83.1, -440], [87, -459.1], [84.3, -459.1], [84.5, -463.4], [84.8, -464.2], [85.3, -464.8], [86.1, -465.2], [87.1, -465.2], [88, -464.7], [88.6, -463.8], [97.7, -464.2], [97.8, -461.9], [97.9, -459.5], [96, -459.2], [92.2, -439.8], [112.8, -439.9], [143.1, -440], [147.1, -458.5], [145.6, -458.5], [145.9, -462.8], [146.3, -463.6], [146.8, -464.1], [147.5, -464.5], [148.5, -464.5], [149.5, -464], [150, -463.1], [159.1, -463.2], [159.1, -460.4], [159.2, -458.5], [155.5, -458.4], [151.8, -440], [196.6, -440.1], [200.5, -440.1], [205.9, -450], [209.7, -456.6], [206.6, -456.6], [206.7, -462], [207.1, -462.8], [207.6, -463.4], [208.4, -463.7], [209.4, -463.8], [210.3, -463.2], [210.8, -462.3], [220.9, -463.3], [220.6, -458], [219.7, -457.9], [215.5, -450], [208.6, -436.4], [209.2, -436.1], [209.2, -424.2], [225.5, -424.1], [225.6, -426.4], [230.9, -426.3], [231, -419.7], [255.3, -396.9], [257.5, -396.7], [257.9, -401.4], [262.2, -401.4], [263, -401], [263.6, -400.5], [264, -399.8], [264.1, -398.8], [263.5, -397.8], [262.6, -397.3], [263.1, -388.2], [259.9, -388], [258.4, -387.9], [258.2, -391.6], [254.6, -391.5], [230.4, -414.4], [225.6, -414.1], [225.5, -417.1], [209.1, -416.8], [209.2, -407.5], [206.6, -406.8], [206.6, -404.9], [211.8, -383.4], [213.2, -383.4], [213.1, -379.1], [212.7, -378.3], [212.2, -377.7], [211.4, -377.4], [210.5, -377.3], [209.5, -377.9], [209, -378.8], [202.2, -378.8], [192.4, -378.7], [192.3, -383.5], [199.3, -383.6], [194.4, -403.5], [88.9, -403.3], [88.8, -382.4], [90.2, -382.4], [90, -378.2], [89.7, -377.4], [89.2, -376.8], [88.4, -376.4], [87.4, -376.4], [86.5, -376.9], [85.9, -377.8], [81.3, -377.7], [76.8, -377.5], [76.7, -382.3], [80.4, -382.4], [80.3, -403.1], [69.5, -402.9], [12.8, -346.6], [12.7, -263.5], [30.2, -263.4], [30.2, -264.8], [34.5, -264.6], [35.3, -264.3], [35.9, -263.8], [36.2, -263], [36.3, -262], [35.7, -261.1], [34.8, -260.5], [34.9, -253], [34.9, -251.5], [30.2, -251.3], [30.1, -255], [12.7, -254.9], [12.7, -190.6], [28.8, -190.6], [28.8, -192], [33.1, -191.8], [33.9, -191.4], [34.4, -190.9], [34.8, -190.1], [34.8, -189.2], [34.3, -188.2], [33.4, -187.7], [33.5, -178.6], [31.7, -178.6], [28.8, -178.5], [28.7, -182.2], [12.7, -182.1], [12.6, -151.5], [12.6, -131], [28.8, -131], [28.8, -132.4], [33.1, -132.2], [33.9, -131.8], [34.5, -131.3], [34.8, -130.5], [34.9, -129.6], [34.3, -128.6], [33.4, -128.1], [33.6, -119], [29.7, -118.9], [28.8, -118.9], [28.7, -122.6], [12.6, -122.5], [12.6, -59.1], [28.7, -59], [28.7, -60.4], [33, -60.2], [33.8, -59.9], [34.4, -59.4], [34.7, -58.6], [34.8, -57.6], [34.2, -56.7], [33.3, -56.1], [33.5, -47.1], [30.7, -47], [28.7, -47], [28.6, -50.6], [12.6, -50.5], [12.5, 12.1], [28.5, 12.2], [28.4, 10.8], [32.7, 11], [33.5, 11.3], [34.1, 11.8], [34.5, 12.6], [34.5, 13.6], [34, 14.5], [33, 15.1], [33.2, 24.1], [30.6, 24.2], [28.4, 24.2], [28.4, 20.6], [12.5, 20.7], [12.4, 84], [28.4, 84.1], [28.4, 82.7], [32.7, 82.9], [33.5, 83.2], [34.1, 83.7], [34.5, 84.5], [34.5, 85.5], [33.9, 86.4], [33, 87], [33.2, 96], [32.5, 96], [28.4, 96.1], [28.4, 92.5], [12.4, 92.6], [12.4, 105.5], [12.4, 156.7], [20, 156.4], [27.8, 156.2], [27.8, 154.8], [32.1, 154.9], [32.9, 155.3], [33.5, 155.8], [33.9, 156.6], [33.9, 157.6], [33.3, 158.5], [32.4, 159.1], [37.8, 159.8], [32.6, 168.1], [27.8, 168.2], [27.8, 164.6], [19.8, 164.6], [12.6, 164.7], [12.4, 275.9], [19.6, 275.8], [28.7, 275.6], [28.7, 274.2], [33, 274.4], [33.8, 274.7], [34.4, 275.2], [34.7, 276], [34.8, 277], [34.2, 277.9], [33.3, 278.5], [33.5, 287.6], [29.2, 287.6], [28.7, 287.7], [28.6, 284], [19.6, 284.1], [12.4, 284.1], [12.4, 301.5], [69.2, 360], [132.6, 360.7], [133.3, 349.7], [133.6, 345.3], [130.1, 345.7], [130.1, 339.5], [130.3, 338.3], [130.8, 337.6], [131.5, 337.1], [132.4, 337.1], [133.3, 337.5], [133.6, 338.3], [133.6, 339.5], [143.3, 339], [143.3, 341.7], [143.3, 344.2], [141.8, 344.3], [148.4, 344.9], [148.9, 349.6], [148.5, 355.1], [148.4, 358.9], [196, 359.6], [202.3, 349.3], [205.1, 344.1], [201.1, 344.1], [201.2, 339.4], [201.4, 338.3], [201.7, 337.8], [202.3, 337.4], [202.9, 337.1], [203.3, 337.2], [203.8, 337.3], [204.2, 337.6], [204.7, 338.4], [204.8, 339.4], [214.8, 339], [214.6, 342.1], [214.5, 344.1], [213.5, 344.1], [210.8, 349.3], [204.7, 362.4], [206.2, 362.8], [206.2, 364.9], [205.9, 381.4], [221.2, 381.2], [221.2, 379.9], [226.1, 379.6], [226.5, 385.8], [245.8, 405.3], [252.5, 412.1], [254.1, 412.1], [254, 408.5], [257.8, 408.4], [258.6, 408.7], [259.1, 409.3], [259.5, 410.1], [259.7, 411], [259.3, 411.9], [258.6, 412.4], [259.1, 421.9], [256.2, 422], [254.3, 422], [254.2, 416.6], [251.1, 416.7], [241.8, 407.3], [226.4, 391.7], [221.5, 391.9], [221.4, 389.3], [205.4, 389.6], [205.4, 394.6], [203.1, 395.3], [203.1, 397.2], [205.3, 407.3], [207.2, 416.3], [206.7, 416.4], [210.2, 416.3], [210.2, 420.9], [209.8, 421.7], [209.3, 422.2], [208.4, 422.6], [207.6, 422.7], [206.6, 422.4], [206, 421.1], [199.4, 421.2], [196.7, 421.3], [196.7, 416.6], [198.6, 416.4], [196.2, 407.2], [193.6, 397.1], [142.3, 397.2], [142.2, 407.2], [142.1, 418.8], [143.5, 418.8], [143.3, 423], [142.9, 423.8], [142.4, 424.4], [141.6, 424.8], [140.6, 424.8], [139.7, 424.3], [139.2, 423.4], [133.5, 423.5], [129.9, 423.6], [130, 418.8], [133.6, 418.8], [133.6, 407.2], [133.6, 397.4]]
/** OSM way/1435251058 (building:levels=5, height=30.75m, layer=4, name=第2ターミナル2階国際線デッキ, roof:shape=saltbox) */
export const P_DECK: XY[] = [[-69.5, -240.5], [-64.9, -235.7], [-56.8, -232], [-53, -231.8], [-39.9, -231.2], [-18.4, -234.8], [-4.4, -241.4], [-1.3, -242.8], [2.3, -317.3], [3.2, -335.7], [0.7, -340.9], [0.2, -342], [-16.4, -349.9], [-27.3, -352.3], [-32, -352.4], [-35.1, -353.2], [-38.8, -353.5], [-42.3, -354.5], [-49.1, -354], [-58.4, -353.1], [-63.7, -351.3], [-66.9, -348], [-69.7, -343.6], [-69.6, -318.1]]
/** OSM way/1435252859 (building:levels=5, height=40m, layer=3, roof:shape=saltbox) */
export const P_B40: XY[] = [[-51.6, -221.7], [-28.7, -221.6], [-30.4, -51.4], [-33.2, -48.9], [-41.6, -53.3], [-49.2, -52.9], [-52.6, -54.4], [-52.2, -192.4]]
/** OSM way/1435252862 (building:levels=5) */
export const P_B28A: XY[] = [[-25.7, -221.3], [-16.3, -220.9], [-16.3, -213.1], [-16, -143.4], [-25.8, -143.3]]
/** OSM way/1435268182 (building:levels=5, layer=2) */
export const P_P5: XY[] = [[-4.1, -239.4], [-3.5, -226], [-3, -226], [-0.6, -226.1], [-0.7, -79.3], [-6, -78.2], [-6.8, -95.9], [-13.7, -96.9], [-14.8, -109.4], [-14.7, -141.8], [-16, -143.4], [-15.5, -182.8], [-16.3, -213.1], [-16.2, -224.4], [-51.6, -221.7], [-53, -231.8], [-39.9, -231.2], [-18.4, -234.8]]
/** OSM way/1435268183 (building:levels=6) */
export const P_P6: XY[] = [[-67, -221.2], [-54, -220.7], [-53.6, -68.2], [-66.1, -69], [-64.8, -110.8], [-63.9, -111.5], [-64, -128.3], [-65.2, -129.5], [-65.5, -169.6], [-66, -173.3], [-64.1, -173.8], [-63.7, -179.6], [-64.4, -183.7], [-66.9, -185.2]]
/** OSM way/1435268184 (building:levels=5) */
export const P_SOUTH: XY[] = [[-147.8, -477.5], [-75.2, -477.8], [-74.9, -441.1], [-76.2, -407.9], [1.6, -409.9], [-0.2, -363.9], [-17.1, -363.8], [-17.8, -368.6], [-58.2, -367.6], [-58.2, -364], [-66.2, -364.6], [-125, -425.5], [-148.5, -425.5]]
/** OSM way/1435268186 (building:levels=4, layer=2, roof:shape=flat) */
export const P_PIER: XY[] = [[194.6, 396.7], [193.8, 366], [64.6, 365.4], [3.9, 305], [6, -8], [8.9, -20.2], [9.4, -36.1], [9.3, -51.5], [2.6, -74], [-1.6, -72.2], [-2.3, -77.8], [-0.6, -78.4], [-0.6, -226.1], [-3, -226], [-3.5, -226], [-4.1, -239.4], [-4.4, -241.4], [3.6, -246.2], [5.8, -249.9], [7, -253.7], [7.5, -259.1], [7.3, -262.3], [6.3, -264.3], [5.1, -266.6], [3.8, -268.9], [1.9, -269.5], [4.4, -271.9], [5.4, -272.5], [6.4, -273.9], [6.7, -275.5], [6.9, -278.3], [7.6, -280.8], [6.9, -286.7], [6.2, -289], [4.9, -291.5], [1.9, -293], [3.9, -294.5], [4.7, -295.8], [5.6, -296.4], [5.9, -297.5], [6.6, -299.1], [6.8, -300.4], [7.7, -303.1], [7.7, -304.6], [7.2, -308.6], [6.9, -309.9], [6, -312.1], [5.1, -313.2], [3.8, -315.8], [2.3, -317.3], [4.9, -319.4], [5.7, -320.4], [6.2, -321.5], [7.9, -326.2], [7.5, -329.6], [7.5, -332.4], [7, -335.1], [4.3, -339.5], [2.7, -341.5], [0.8, -342.9], [0.2, -353.8], [63.2, -417.1], [112.7, -416.3], [112.8, -439.9], [196.6, -440.1], [195.6, -403.8], [69.5, -402.9], [12.8, -346.6], [12.6, -151.5], [12.4, 105.5], [12.4, 301.5], [69.2, 360], [196, 359.6], [206.2, 364.9], [205.4, 394.6]]
/** OSM way/1449343406 (layer=3, roof:shape=flat) */
export const P_V1: XY[] = [[-68.5, -338.8], [-64.2, -334.2], [-60.5, -332.8], [-58, -332], [-54.5, -331.7], [-50.6, -331.3], [-43.7, -331.5], [-29.2, -331.8], [-14.2, -335.1], [-7, -338.1], [0.7, -340.9], [-2.8, -338.4], [-7.1, -336.5], [-12, -334.3], [-16.2, -332.3], [-26.5, -329], [-28.6, -328.6], [-20.6, -326.9], [-9.9, -323.1], [-4.7, -320.2], [-0.1, -317.6], [-7.3, -320.3], [-14, -322.7], [-25.8, -325.2], [-31.9, -326.1], [-39.6, -326.5], [-47.6, -326.6], [-57.3, -325.9], [-61, -325], [-65.3, -322.5], [-67.8, -319.9], [-69.6, -318.1], [-68.4, -321.4], [-66.4, -324.5], [-62.7, -326.7], [-57.9, -328.9], [-62.3, -330.4], [-65.5, -332.8], [-67.7, -335]]
/** OSM way/1449343407 (layer=3, roof:shape=flat) */
export const P_V2: XY[] = [[-68.5, -315.2], [-64.2, -310.5], [-60.5, -309.1], [-58.1, -308.3], [-54.5, -308], [-50.6, -307.7], [-43.7, -307.8], [-29.2, -308.1], [-14.2, -311.4], [-7, -314.4], [0.7, -317.2], [-2.8, -314.7], [-7.1, -312.9], [-12, -310.7], [-16.3, -308.6], [-26.5, -305.4], [-28.6, -304.9], [-20.6, -303.3], [-9.9, -299.4], [-4.7, -296.5], [-0.1, -294], [-7.3, -296.6], [-14.1, -299], [-25.8, -301.5], [-31.9, -302.5], [-39.6, -302.9], [-47.6, -302.9], [-57.3, -302.2], [-61, -301.3], [-65.3, -298.9], [-67.9, -296.2], [-69.6, -294.4], [-68.4, -297.7], [-66.5, -300.9], [-62.7, -303.1], [-57.9, -305.3], [-62.3, -306.8], [-65.5, -309.1], [-67.8, -311.3]]
/** OSM way/1449343408 (layer=3, roof:shape=flat) */
export const P_V3: XY[] = [[-68.6, -291], [-64.3, -286.4], [-60.6, -285], [-58.1, -284.1], [-54.5, -283.9], [-50.7, -283.5], [-43.8, -283.7], [-29.3, -284], [-14.3, -287.3], [-7.1, -290.2], [0.6, -293.1], [-2.9, -290.5], [-7.2, -288.7], [-12.1, -286.5], [-16.3, -284.5], [-26.6, -281.2], [-28.7, -280.8], [-20.7, -279.1], [-9.9, -275.3], [-4.7, -272.4], [-0.1, -269.8], [-7.4, -272.5], [-14.1, -274.9], [-25.9, -277.4], [-32, -278.3], [-39.6, -278.7], [-47.7, -278.7], [-57.4, -278], [-61.1, -277.2], [-65.4, -274.7], [-67.9, -272.1], [-69.7, -270.3], [-68.5, -273.6], [-66.5, -276.7], [-62.7, -278.9], [-58, -281.1], [-62.4, -282.6], [-65.6, -285], [-67.8, -287.2]]
/** OSM way/1449343409 (layer=3, roof:shape=flat) */
export const P_V4: XY[] = [[-68.9, -266.8], [-64.6, -262.2], [-60.9, -260.8], [-58.5, -259.9], [-54.9, -259.7], [-51, -259.3], [-44.1, -259.5], [-29.6, -259.8], [-14.6, -263.1], [-7.4, -266], [0.3, -268.9], [-3.2, -266.4], [-7.5, -264.5], [-12.4, -262.3], [-16.7, -260.3], [-26.9, -257], [-29, -256.6], [-21, -254.9], [-10.3, -251.1], [-5.1, -248.2], [-0.5, -245.6], [-7.7, -248.3], [-14.5, -250.7], [-26.2, -253.2], [-32.3, -254.1], [-40, -254.5], [-48, -254.5], [-57.7, -253.8], [-61.4, -253], [-65.7, -250.5], [-68.3, -247.9], [-70.1, -246.1], [-68.8, -249.4], [-66.9, -252.5], [-63.1, -254.7], [-58.3, -256.9], [-62.8, -258.4], [-65.9, -260.8], [-68.2, -263]]
/** OSM way/1435252860 (building:levels=5, height=44m, layer=3, roof:shape=flat) */
export const P_ROT: XY[] = [[-63.6, -27.5], [-58.7, -21.3], [-51.7, -17.4], [-40.5, -18.1], [-32.6, -24.1], [-29, -32.3], [-28.7, -37.7], [-29.9, -42.2], [-31.4, -46.2], [-33.2, -48.9], [-41.6, -53.3], [-49.2, -52.9], [-54, -53], [-57.6, -51.4], [-63, -45.6], [-66, -38.3], [-65.6, -32.5]]
/** OSM way/1435252861 (building:levels=5, height=44m, layer=3, roof:shape=saltbox) */
export const P_B44N: XY[] = [[-51.7, -17.4], [-40.5, -18.1], [-30.2, -19.4], [-31.6, 104.8], [-31.6, 104.9], [-33.2, 246.1], [-53.8, 247.4]]
/** OSM way/1435252866 (building:levels=5, height=41m, layer=3, roof:shape=flat) */
export const P_B41: XY[] = [[-11.7, 4.9], [-10.3, -2], [-11.1, -10.7], [-10.3, -18.9], [-9.6, -38.5], [-9.2, -43], [-10.3, -47.9], [-11.8, -62.2], [-2, -71], [2.3, -72.8], [9, -50.4], [9.1, -34.9], [8.6, -19.1], [5.7, -6.9], [3.3, 3.3]]
/** OSM way/1435252867 (building:levels=5, height=44m, layer=3, roof:shape=saltbox) */
export const P_B44S: XY[] = [[-30.3, 42.3], [-22.9, 42], [-23.2, 27.6], [-12.9, 27.1], [-12.2, 4], [-11.7, -11.7], [-10.2, -39.5], [-10.8, -48.8], [-12.4, -63.2], [-12.6, -74.7], [-13, -90], [-19.1, -90.3], [-21.6, -90.5], [-22, -101.7], [-32.3, -101.7], [-28.8, -30.3]]
/** OSM way/1435268180 () */
export const P_B28B: XY[] = [[-26.8, -142], [-14.7, -141.8], [-14.8, -109.4], [-27.4, -109.4]]

// ===========================================================================
// Terminal 2
// ===========================================================================

function buildT2(detail: boolean) {
  const M = newMats(['wall', 'win', 'roof', 'trim', 'bridge', 'glass'])
  const { body, spurs } = despur(T2_OUTLINE)
  const B = simplify(body, 0.35)
  const d = (f: Facade): Facade => (detail ? { ...f, bay: f.bay / 2.5, ratio: 0.9 } : f)
  // The landside blocks: glass curtain walls, two storeys a panel, thin pale floor bands.
  const GLASS: Facade = d({ bay: 7, ratio: 0.94, floor: 5.2, group: 2, spandrel: 1.6, sill: 1.0, head: 3.0, ground: 7, minLength: 5 })
  const BODY: Facade = d({ bay: 8, ratio: 0.88, floor: 4.6, group: 2, spandrel: 2.4, sill: 1.0, head: 2.0, ground: 5.6, minLength: 6 })
  const PIER: Facade = d({ bay: 10, ratio: 0.9, floor: 4.4, group: 1, spandrel: 0, sill: 1.0, head: 2.0, ground: 5.4, minLength: 6 })

  const saltbox: [XY[], number][] = [[P_B44N, 44], [P_B44S, 44], [P_B40, 40]]
  const zones: Zone[] = [
    { rect: [-300, -600, 400, 1000], z: H_PIER, facade: PIER },
    { rect: [-54, -230.5, 12.7, 255], z: H_BODY, facade: BODY }, // the departure hall behind the blocks
    { rect: [-71, -48, -54, 255], z: H_FRONT, facade: PIER }, // the curbside front under the blocks
    { rect: [-71, -441, 12.7, -354.6], z: H_BODY, facade: BODY },
    { ring: P_SOUTH, z: 25, facade: BODY },
    { ring: P_DECK, z: H_DECK, facade: BODY },
    { ring: P_P5, z: 28, facade: GLASS },
    { ring: P_P6, z: 31, facade: GLASS },
    { ring: P_B28A, z: 28, facade: GLASS },
    { ring: P_B28B, z: 28, facade: GLASS },
    { ring: P_B41, z: 41, facade: GLASS },
    ...saltbox.map(([r, h]) => ({ ring: r, z: h - 4, facade: GLASS }) as Zone),
  ]
  zoneMass(M, B, zones)
  // the blades over the saltbox blocks, rising to the landside (west)
  for (const [r, h] of saltbox) { const [x0, y0, x1, y1] = bbox(r); blade(M.trim, x0, y0, x1, y1, h - 4.6, h, 'w', 6, 0.9) }

  // --- The Market Place rotunda: a glass drum under a broad white disc that overhangs it like a hat brim ---
  {
    const [x0, y0, x1, y1] = bbox(P_ROT), cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, r = (x1 - x0 + y1 - y0) / 4
    const n = detail ? 40 : 24, R = r + 7.5
    drum(M.wall, cx, cy, r, r, 0, 8, n, null)
    drum(M.win, cx, cy, r, r, 8, 39.6, n, null)
    drum(M.trim, cx, cy, r + 1.0, R, 39.0, 40.4, n, null) // the brim's soffit, sloping out
    drum(M.trim, cx, cy, R, R, 40.4, 42.4, n, null) // its thick white edge
    drum(M.trim, cx, cy, R, R - 1.2, 42.4, 42.9, n, M.trim) // a rounded lip onto the white top
    drum(M.trim, cx, cy, r * 0.5, r * 0.42, 42.9, 44, n, M.roof)
    const ring = Array.from({ length: n }, (_, i) => [cx + (r + 1.0) * Math.cos((2 * Math.PI * i) / n), cy + (r + 1.0) * Math.sin((2 * Math.PI * i) / n)] as XY)
    capPoly(M.trim, ring, 39.0, false)
  }

  // --- The 2020 international facilities: four white shells with pointed-arch ends, meeting in Vs ---
  // The shells span the OSM vault parts' bays edge to edge, so neighbours spring from one valley line;
  // the lowest strip of each shell along the valleys is the dark blue-grey glazing.
  {
    const lines = [-341, -317.4, -293.6, -269.4, -245.6], xA = -69.9, xB = 0.2, rise = 30.75 - H_DECK
    for (let k = 0; k < 4; k++) shell(M.trim, M.glass, M.win, xA, lines[k], xB, lines[k + 1], H_DECK, rise, detail ? 10 : 6)
  }
  { // the big white diagonals on the deck's landside face (x ≈ −69.7), under the vaults
    const xF = -70.0
    const ys = [-354, -331, -307, -283, -259, -235]
    for (let k = 0; k < ys.length - 1; k++) {
      const ya = ys[k], yb = ys[k + 1], ym = (ya + yb) / 2
      for (const [p, q] of [[[ya, H_DECK - 1], [ym, 8]], [[yb, H_DECK - 1], [ym, 8]]] as [number[], number[]][]) {
        const L = Math.hypot(q[0] - p[0], q[1] - p[1]), w = 1.1, nx = (-(q[1] - p[1]) / L) * w / 2, nz = ((q[0] - p[0]) / L) * w / 2
        const P = (y: number, z: number): V3 => [xF, y, z]
        quadN(M.trim, P(p[0] - nx, p[1] - nz), P(q[0] - nx, q[1] - nz), P(q[0] + nx, q[1] + nz), P(p[0] + nx, p[1] + nz), [[-1, 0, 0], [-1, 0, 0], [-1, 0, 0], [-1, 0, 0]])
      }
    }
  }

  // --- The wave canopy along the departures curb (detail only): a thin white slab rolling in waves, on posts ---
  if (detail) {
    const xW = -71, xC = -84, y0 = -230, y1 = 250, wl = 24
    const z = (y: number) => 10.5 + 1.4 * Math.sin((2 * Math.PI * (y - y0)) / wl)
    const steps = Math.round((y1 - y0) / 3)
    for (let k = 0; k < steps; k++) {
      const ya = y0 + ((y1 - y0) * k) / steps, yb = y0 + ((y1 - y0) * (k + 1)) / steps
      const nA = unit([0, -(z(ya + 0.1) - z(ya - 0.1)) / 0.2, 1]), nB = unit([0, -(z(yb + 0.1) - z(yb - 0.1)) / 0.2, 1])
      quadN(M.trim, [xW, ya, z(ya)], [xC, ya, z(ya)], [xC, yb, z(yb)], [xW, yb, z(yb)], [nA, nA, nB, nB])
      const dA: V3 = [-nA[0], -nA[1], -nA[2]], dB: V3 = [-nB[0], -nB[1], -nB[2]]
      quadN(M.trim, [xW, ya, z(ya) - 0.4], [xW, yb, z(yb) - 0.4], [xC, yb, z(yb) - 0.4], [xC, ya, z(ya) - 0.4], [dA, dB, dB, dA])
      M.trim.quad([xC, ya, z(ya) - 0.4], [xC, yb, z(yb) - 0.4], [xC, yb, z(yb)], [xC, ya, z(ya)])
    }
    for (let y = y0 + wl / 4; y < y1; y += wl) drum(M.trim, xC + 2, y, 0.45, 0.45, 0, z(y) - 0.4, 8, null)
  }

  // --- Jet bridges ---
  jetBridges(M, spurs, { z0: 4.8, z1: 8.2, detail })

  return [
    { part: M.wall, material: finish('hnd-t2-panel', 0xe9ebea) },
    { part: M.win, material: { name: 'window', color: 0x8db1b9, roughness: 0.35 } },
    { part: M.roof, material: PALETTE.roof },
    { part: M.trim, material: finish('hnd-t2-white', 0xf6f6f2) },
    { part: M.bridge, material: finish('hnd-jet-bridge', 0xc6cacd) },
    { part: M.glass, material: { name: 'glass', color: 0x5d6a78, roughness: 0.24 } },
  ]
}

const H_PIER = 18, H_BODY = 24, H_DECK = 21, H_FRONT = 10

if (import.meta.main) {
  const extras = { bearing: -30, osm: 'relation/18910656', height: 44 }
  writeLod('Haneda Airport Terminal 2', 'tokyo-haneda-terminal-2.glb', buildT2(false), extras, 8000, 250_000)
  writeLod('Haneda Airport Terminal 2', 'tokyo-haneda-terminal-2.detail.glb', buildT2(true), extras, 40_000, 1_500_000)
}
