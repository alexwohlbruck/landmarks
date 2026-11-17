/**
 * JFK Airport Terminal 7, Queens — procedural, CC0-1.0, no textures.
 * bun generators/nyc-jfk-terminal-7.ts
 *
 * Map frame: x = model east, y = model north, z up, metres. Placed at
 * bearing 13.1°, the terminal's own grid (its long walls run 13° and 103°).
 * Anchor: area centroid of the OSM multipolygon relation/3778808 (outer
 * way/284907949 less its two light wells, inner ways 284907934 and
 * 284907954). Model south is the landside front on the departures road.
 *
 * Status: the terminal closed to flights in stages (the last, Alaska
 * Airlines, left in October 2025) and is to be demolished once the new
 * Terminal 6 beside it opens (Wikipedia, "JFK Airport Terminal 7"). OSM
 * still maps it, and no photo or record of its demolition was found as of
 * October 2026, so it is drawn as it stood. Drop the placement when OSM
 * removes the building.
 *
 * Identifying features (photos): the huge white fascia wrapping the front
 * and both ends of the landside block, leaning outward towards the top, with
 * pointed prows at the corners; the deep soffit under it and the glass wall
 * behind, leaning out to meet it; behind the front block, plain grey
 * terminal blocks with pale roofs, a taller box with a dark glazed roof and
 * a skylight ridge, low piers to the airside.
 *
 * Evidence
 * - OSM relation/3778808 "Terminal 7" (tagged 16.2 m, building=commercial).
 * - Lidar: USGS 3DEP NY_NewYorkCity, flown 2017, 1 m, heights above the
 *   apron (2.5 m above ground_min 0.94 m): front block 14.9 m to its outer
 *   edge (y −72.4); the block behind it 12.3 m; the middle 10 m with a dark
 *   box (no returns: glass) at 15.5 m and a ridge at 15.3 m; the north part
 *   11.5 m; the west wing 9.7 m; the east part 6.3 m; the piers 8 m.
 * - Published: opened 1970 (GMW Architects), rebuilt 1989–91 and renovated
 *   1997–2003 (Corgan Associates) (Wikipedia, "JFK Airport Terminal 7").
 * - Photos (Wikimedia Commons, Quintin Soloviev unless noted):
 *   https://commons.wikimedia.org/wiki/File:JFK_Terminal_7_aerial_view.jpg (CC BY 4.0) the plan and roofs;
 *   https://commons.wikimedia.org/wiki/File:Exterior_of_Terminal_7,_JFK.jpg (CC BY 4.0) the west prow at night;
 *   https://commons.wikimedia.org/wiki/File:JFK_Terminal_7_exterior.jpg (CC BY 4.0) the front from the departures road;
 *   https://commons.wikimedia.org/wiki/File:JFK_Terminal_7_May_2023.jpg (Mybirthday647, CC0) the fascia and soffit;
 *   https://commons.wikimedia.org/wiki/File:JFK_Airport_Terminal_7.jpg (CC BY 4.0) the fascia's lean;
 *   https://commons.wikimedia.org/wiki/File:JFK_Terminal_7_Alaska_Airlines.jpg (CC BY 4.0) the east prow.
 *
 * Estimated from the photos (scaled on the lidar's 14.9 m): the fascia's
 * depth (8 m in plan, 7.3 m tall), the soffit (3 m deep at 7.6 m), the
 * glass wall's lean (2.5 m). Rooftop plant is left out. The fascia's
 * Alaska lettering is left out (not a landmark sign).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, clip, ccw, rect, zones, minusHoles, wallTo, type Facade } from './nyc-jfk-terminal-5'
import { inside, finishModel, capPoly, prism } from './nyc-570-lexington'

const OUTER: XY[] = ccw([[-37.1, -37.8], [-37.1, -26.7], [-39.2, -26.7], [-39.5, -12.7], [-51.8, -12.5], [-51.9, -10.2], [-59.7, -10.2], [-59.8, -59.6], [-82.9, -59.0], [-85.8, -59.0], [-85.9, -45.6], [-85.8, -44.5], [-86.2, 0.9], [-85.9, 2.6], [-85.9, 48.1], [-76.6, 48.1], [-74.2, 48.1], [-72.9, 48.2], [-70.6, 48.1], [-66.4, 48.1], [-66.1, 98.8], [-65.1, 98.8], [-58.8, 98.9], [-57.7, 98.9], [-57.4, 67.9], [8.9, 68.0], [46.4, 68.0], [46.5, 78.7], [47.6, 78.7], [54.0, 78.8], [55.1, 78.9], [55.0, 50.0], [62.1, 50.0], [62.3, 38.9], [64.1, 38.9], [67.0, 39.0], [84.3, 39.3], [84.3, 31.9], [84.4, 13.6], [81.1, 13.5], [81.2, 2.9], [90.6, 2.9], [90.7, -12.6], [90.7, -16.4], [81.0, -16.5], [81.1, -34.6], [85.3, -34.6], [85.5, -45.7], [85.5, -47.4], [90.5, -47.4], [90.6, -63.5], [70.5, -63.4], [70.6, -68.2], [70.6, -68.8], [70.6, -72.3], [30.1, -72.1], [27.4, -72.1], [16.2, -72.2], [4.0, -72.2], [-0.0, -72.2], [-16.2, -72.3], [-32.0, -72.3], [-40.5, -72.4], [-40.3, -62.5], [-39.9, -37.8]])
const HOLES: XY[][] = [
  ccw([[69.3, -26.3], [61.6, -26.4], [62.0, -29.0], [73.3, -29.2], [73.3, -16.4], [70.0, -16.3], [70.0, 2.8], [73.2, 2.9], [73.0, 8.8], [62.2, 8.9], [62.1, 6.7], [69.2, 6.6]]),
  ccw([[64.5, 22.7], [64.7, 13.2], [68.2, 13.3], [68.1, 22.8]]),
]
// The front block and its fascia.
const X0 = -40.5, X1 = 70.6, Y0 = -72.4, Y1 = -37
const ZT = 14.9, ZB = 7.6, D = 8, S = 3, G = 2.5

function build() {
  const panel = new Part(), win = new Part(), roof = new Part(), white = new Part(), glass = new Part()
  const band: Facade = { bay: 8, ratio: 0.8, floor: 3.5, group: 1, spandrel: 0, sill: 3.4, head: 1.4, ground: 3.4, minLength: 6 }
  const part = (r: XY[]) => minusHoles(clip('difference', clip('intersection', [OUTER], [r]), [rect(X0, Y0, X1, Y1)]), HOLES)
  const list = [
    { rings: part(rect(-100, 68, 100, 120)), z: 8, facade: band },
    { rings: part(rect(-100, -80, -59.9, 68)), z: 9.7, facade: band },
    { rings: part(rect(-59.9, 45, 62, 68)), z: 11.5, facade: band },
    { rings: part(rect(-59.9, 5, 77, 45)), z: 10, facade: band },
    { rings: part(rect(-59.9, -37, 70.6, 5)), z: 12.3, facade: band },
    { rings: [...part(rect(70.6, -80, 100, 5)), ...part(rect(77, 5, 100, 68)), ...part(rect(62, 45, 100, 68))], z: 6.3, facade: band },
  ]
  const inFront = (q: XY) => q[0] > X0 && q[0] < X1 && q[1] > Y0 && q[1] < Y1
  zones({ wall: panel, win, roof, coping: white, exterior: [OUTER, ...HOLES], list, heightAt: (q) => (inFront(q) ? ZT : 0) })

  // Raised glass-roofed box and skylight ridge on the middle roof.
  prism({ wall: panel, win: null, roof: glass, coping: white, ring: rect(-7, 9, 57, 25), z0: 9.8, z1: 15.5, facade: null, bevel: 0.4 })
  prism({ wall: panel, win: null, roof: glass, coping: white, ring: rect(-55, 37, 25, 45), z0: 9.8, z1: 15.3, facade: null, bevel: 0.4 })

  // --- The front block: roof, north wall, fascia wrapping three sides, soffit, glass ---
  capPoly(white, rect(X0, Y0, X1, Y1), ZT) // the front block's roof reads whiter than the rest (aerial)
  wallTo(panel, [X1, Y1], [X0, Y1], 12.3, ZT, ZT)
  const P = (x: number, y: number, z: number): V3 => [x, y, z]
  const T = { sw: P(X0, Y0, ZT), se: P(X1, Y0, ZT), nw: P(X0, Y1, ZT), ne: P(X1, Y1, ZT) }
  const B = { sw: P(X0 + D, Y0 + D, ZB), se: P(X1 - D, Y0 + D, ZB), nw: P(X0 + D, Y1, ZB), ne: P(X1 - D, Y1, ZB) }
  // Each face: top edge P→Q in ccw order seen from above, quad P, P', Q', Q faces out and down.
  white.quad(T.sw, B.sw, B.se, T.se)
  white.quad(T.se, B.se, B.ne, T.ne)
  white.quad(T.nw, B.nw, B.sw, T.sw)
  // the fascia's open ends against the block behind
  white.tri(T.nw, P(X0 + D, Y1, ZT), B.nw)
  white.tri(T.ne, B.ne, P(X1 - D, Y1, ZT))
  // soffit (faces down), U-shaped
  const f = D, e = D + S
  white.quad(P(X0 + f, Y0 + f, ZB), P(X0 + e, Y0 + e, ZB), P(X1 - e, Y0 + e, ZB), P(X1 - f, Y0 + f, ZB))
  white.quad(P(X0 + f, Y1, ZB), P(X0 + e, Y1, ZB), P(X0 + e, Y0 + e, ZB), P(X0 + f, Y0 + f, ZB))
  white.quad(P(X1 - f, Y0 + f, ZB), P(X1 - e, Y0 + e, ZB), P(X1 - e, Y1, ZB), P(X1 - f, Y1, ZB))
  // the glass wall, leaning out from the ground (inset e + G) to the soffit's inner edge (inset e)
  const g = e + G
  const glassQuad = (bl: V3, br: V3, tr: V3, tl: V3) => {
    win.quad(bl, br, tr, tl)
    // white mullion fins every ~9 m, as thin strips just proud of the glass
  }
  glassQuad(P(X0 + g, Y0 + g, 0), P(X1 - g, Y0 + g, 0), P(X1 - e, Y0 + e, ZB), P(X0 + e, Y0 + e, ZB))
  glassQuad(P(X1 - g, Y0 + g, 0), P(X1 - g, Y1, 0), P(X1 - e, Y1, ZB), P(X1 - e, Y0 + e, ZB))
  glassQuad(P(X0 + g, Y1, 0), P(X0 + g, Y0 + g, 0), P(X0 + e, Y0 + e, ZB), P(X0 + e, Y1, ZB))
  // diagonal mullions on the long glass front (photo: the struts lean in pairs)
  {
    const n = 12, y0 = Y0 + g, y1 = Y0 + e, w = 0.5
    for (let k = 0; k <= n; k++) {
      const xb = X0 + g + ((X1 - X0 - 2 * g) * k) / n, xt = X0 + e + ((X1 - X0 - 2 * e) * k) / n
      const off = -0.08 // just proud of the glass, outward (−y)
      white.quad(P(xb - w, y0 + off, 0), P(xb + w, y0 + off, 0), P(xt + w, y1 + off, ZB), P(xt - w, y1 + off, ZB))
    }
  }

  finishModel('JFK Airport Terminal 7', 'nyc-jfk-terminal-7', [
    { part: panel, material: finish('t7-panel', 0xc6c9cc) },
    { part: win, material: PALETTE.window },
    { part: roof, material: finish('t7-roof', 0xdadbd9) },
    { part: white, material: finish('t7-fascia', 0xf1f1ee) },
    { part: glass, material: finish('t7-dark-roof', 0x5b6169) },
  ], { bearing: 13.1, osm: 'relation/3778808', height: ZT }, 6500)
}

if (import.meta.main) build()
