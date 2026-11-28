/**
 * Sinclair Centre, 757 West Hastings Street, Vancouver: procedural,
 * CC0-1.0, no textures.
 *   bun generators/van-sinclair-centre.ts
 *
 * Four federal buildings joined since 1986 by glazed atrium roofs over the
 * lanes between them, so they meet above ground and are one model here:
 *  - the Former Main Post Office (1905-10, Edwardian Baroque, grey
 *    granite), on the Hastings/Granville corner, with its corner clock
 *    tower under a green copper dome and lantern, a giant order on the
 *    upper storeys and a copper mansard with dormers;
 *  - the Winch Building (1911), six storeys of grey stone on Hastings and
 *    Howe, round-arched ground-floor windows;
 *  - the Customs Examining Warehouse (1913), seven storeys of grey stone
 *    on Cordova and Howe, under a hipped roof;
 *  - the Federal Building (1937), pale stone, on Cordova and Granville,
 *    under hipped roofs;
 *  - and the atrium: gabled glass roofs over the cross of lanes.
 *
 * Map frame: x east', y north', z up, metres, turned to bearing 45 (the
 * street grid). -y is Hastings Street (south-west), +x Granville Street
 * (south-east), +y Cordova Street, -x Howe Street. Anchor: the area
 * centroid of OSM way/128059875 (the Sinclair Centre's outline, a mall
 * area), lng -123.1138968, lat 49.2859779. Elevation 0.
 *
 * Evidence
 *  - OSM (ODbL): way/128059875 (Sinclair Centre, shop=mall, Q7522013);
 *    the buildings and parts inside it: Former Main Post Office
 *    way/1363485351 (Q102213790; 3 levels, high mansard) and its tower
 *    way/1363485350, 1363933236 (dome); the atrium way/1363485352 (retail,
 *    gabled); Customs Examining Warehouse way/1363485360 with parts
 *    1363485353, 363648979-985 (27/30/36, the hip as skillion parts);
 *    The Federal Building way/1363485356 with parts 363648975 (36),
 *    363648976 and 1010714304 (36-40, hipped), 363648977 (30),
 *    363648978 (14); the Winch Building way/1363485361 (6 levels).
 *  - City of Vancouver building-footprints-2009 (City 2009 lidar; Contains
 *    information licensed under the Open Government Licence - Vancouver),
 *    tops above sea level: Post Office cornice 41.95, mansard 44.2-46.0,
 *    the tower 55.23; Winch 46.7; Customs eaves 40.98, ridge 47.85;
 *    Federal 48.74, ridge 52.2, its low part 26.45; the atrium's glass
 *    ridge 32.0. Heights here are those less the lowest map ground under
 *    the footprint (Y0 below).
 *  - Mapterhorn terrain: Hastings about 19.6 m above sea level, Cordova
 *    about 14-15 m, with a dip at the Customs' Cordova loading dock.
 *  - Photos (Wikimedia Commons, EVIDENCE):
 *    - wlm: MRDXII, "Vancouver Former Main Post Office WLM2012.JPG",
 *      CC BY-SA 3.0 (the Hastings front and the tower).
 *      https://commons.wikimedia.org/wiki/File:Vancouver_Former_Main_Post_Office_WLM2012.JPG
 *    - x01, x02, x03: Xicotencatl, "Sinclair Centre Vancouver 01/02/03.JPG",
 *      CC BY-SA 4.0 (the clock tower and dome close up; the Hastings and
 *      Granville fronts).
 *      https://commons.wikimedia.org/wiki/File:Sinclair_Centre_Vancouver_01.JPG
 *      https://commons.wikimedia.org/wiki/File:Sinclair_Centre_Vancouver_02.JPG
 *      https://commons.wikimedia.org/wiki/File:Sinclair_Centre_Vancouver_03.JPG
 *    - tmv: Tmv, "Sinclair Centre in Vancouver.jpg", CC BY-SA 4.0.
 *      https://commons.wikimedia.org/wiki/File:Sinclair_Centre_in_Vancouver.jpg
 *    - g3, g4: GoToVan, "Sinclair Centre (17330067269).jpg" and
 *      "(16894011194).jpg", CC BY 2.0 (the Granville front, the mansard's
 *      dormers, the Federal Building behind).
 *      https://commons.wikimedia.org/wiki/File:Sinclair_Centre_(17330067269).jpg
 *      https://commons.wikimedia.org/wiki/File:Sinclair_Centre_(16894011194).jpg
 *    - winch: "WinchBuilding.jpg" (Bob, public domain): the Winch Building
 *      from Hastings and Howe.
 *      https://commons.wikimedia.org/wiki/File:WinchBuilding.jpg
 *    - customs: "CustomsExaminingWarehouse.jpg" (Bob, public domain).
 *      https://commons.wikimedia.org/wiki/File:CustomsExaminingWarehouse.jpg
 *  - Look-only (CC BY-NC, not used for shape): Can Pac Swire's Flickr
 *    photos of the Post Office.
 *  No commercial imagery.
 *
 * Estimated, and doubts:
 *  - The clock tower (lead review 1): about 10.6 m square (from wlm's
 *    diagonal width; OSM's 7.8 x 8.5 m part is only the dome's base) on a
 *    14.4 m corner pavilion with paired engaged giant columns and a
 *    segmental pediment on each street face; stages scaled from crop_wlm
 *    with the clock stage's top at the lidar's 55.2 m: pediments 44.6,
 *    square stage 50.6, drum 56.2, ribbed dome 59.6, lantern 61.6, finial
 *    64.0 (estimated, thin). Clock faces 4 m across in stone rings; corner
 *    turrets with copper caps.
 *  - The Federal Building has no good licensed close-up: drawn as pale
 *    stone with grouped windows under OSM's hipped parts (roof colour
 *    unknown, drawn grey).
 *  - The giant order on the Post Office is drawn as piers between
 *    two-storey window panels; dormers as small boxes.
 *  - The atrium's street ends are glass; its roofs follow OSM's lanes.
 *  - Night: windows glow, the four clock faces are `entrance` (lit), the
 *    Post Office's stone and the tower are floodlit; the atrium's glass
 *    stays dark.
 */
import { Part, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { area, block, cap, inset, lathe, panel, walls, type XY } from './chi-aon-center'
import { hipRoof } from './chi-board-of-trade'

export const BEARING = 45
export const ANCHOR = { lng: -123.1138968, lat: 49.2859779 }
const Y0 = 8.2 // m above sea level at y = 0: the lowest map ground under the footprint

const ccw = (r: XY[]) => (area(r) < 0 ? [...r].reverse() : r)
const inside = (p: XY, r: XY[]) => {
  let c = false
  for (let i = 0, j = r.length - 1; i < r.length; j = i++)
    if ((r[i][1] > p[1]) !== (r[j][1] > p[1]) && p[0] < ((r[j][0] - r[i][0]) * (p[1] - r[i][1])) / (r[j][1] - r[i][1]) + r[i][0]) c = !c
  return c
}
const rect = (x0: number, y0: number, x1: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]

// OSM, in the turned frame (0.1 m)
const PO = ccw([[30.1, -37.4], [37.9, -37.4], [37.8, -1.4], [-9.9, -1.6], [-10.0, -37.6]])
const TOWER = rect(30.1, -37.4, 37.9, -28.9)
const WINCH = ccw([[-10.0, -37.6], [-9.9, -1.6], [-39.3, -1.9], [-39.4, -37.5]])
const CUSTOMS = ccw([[-39.3, 4.7], [-1.7, 5.0], [-1.7, 36.7], [-39.3, 36.5]])
const FED = ccw([[3.0, 22.4], [21.5, 22.4], [21.3, 5.3], [33.6, 5.2], [33.6, 3.2], [38.7, 3.2], [38.9, 39.2], [3.2, 39.7]])
const FED30 = ccw([[3.0, 22.4], [3.0, 20.9], [12.8, 20.8], [19.2, 14.6], [19.1, 5.3], [21.3, 5.3], [21.5, 22.4]])
const FED14 = ccw([[3.0, 20.9], [2.8, 5.0], [19.1, 5.3], [19.2, 14.6], [12.8, 20.8]])
const ATR1 = rect(-32.2, -1.6, 33.6, 5.0), ATR2 = rect(-1.7, 5.0, 3.0, 25.4)
const ALL = [PO, WINCH, CUSTOMS, FED, FED30, FED14, ATR1, ATR2]

// heights over y = 0, from the lidar's sea-level tops
const h = (asl: number) => asl - Y0
const PO_EAVE = h(41.95), PO_TOP = h(45.6), WINCH_TOP = h(46.7), CUS_EAVE = h(40.98), CUS_RIDGE = h(47.85)
const FED_TOP = h(48.74), FED_RIDGE = h(52.2), FED30_TOP = h(43.5), FED14_TOP = h(26.45), ATR_EAVE = h(29.5), ATR_RIDGE = h(32.0)

// Mapterhorn over 8.19 m ASL, 9 m steps from -45 (columns x, rows z = -y)
const GRID = [
  [7.5, 7.3, 6.9, 6.8, 6.6, 6.3, 6.0, 5.4, 5.2, 5.0, 4.9],
  [7.6, 5.0, 0.0, 0.3, 1.4, 5.2, 6.4, 6.0, 5.7, 5.5, 5.3],
  [7.7, 6.1, 3.2, 2.1, 3.0, 6.3, 6.9, 6.5, 6.2, 6.1, 6.0],
  [8.0, 7.7, 5.8, 4.4, 5.0, 6.1, 7.0, 6.9, 6.7, 6.7, 6.2],
  [8.4, 8.8, 8.3, 6.9, 6.9, 7.8, 7.1, 7.3, 7.2, 6.9, 6.1],
  [8.9, 9.0, 10.4, 10.9, 10.4, 11.1, 10.7, 10.7, 10.5, 7.4, 7.8],
  [9.5, 10.0, 11.2, 11.4, 11.7, 11.9, 12.0, 11.6, 11.5, 10.4, 9.6],
  [10.0, 10.4, 10.6, 10.8, 11.6, 11.8, 11.8, 11.6, 11.4, 11.1, 10.1],
  [10.5, 10.4, 10.0, 10.2, 11.6, 11.7, 11.7, 11.5, 11.3, 11.1, 10.5],
  [11.1, 11.0, 9.6, 9.6, 11.5, 11.6, 11.5, 11.4, 11.4, 11.3, 10.7],
  [11.4, 11.4, 11.3, 11.3, 11.3, 11.2, 11.1, 11.1, 11.0, 11.0, 11.0],
]
/** The street's height over y = 0 at a point just outside a wall (Mapterhorn, bilinear). */
function ground(x: number, y: number) {
  const fx = Math.max(0, Math.min(9.999, (x + 45) / 9)), fz = Math.max(0, Math.min(9.999, (-y + 45) / 9))
  const i = Math.floor(fz), j = Math.floor(fx), a = fz - i, b = fx - j
  const v = GRID[i][j] * (1 - a) * (1 - b) + GRID[i][j + 1] * (1 - a) * b + GRID[i + 1][j] * a * (1 - b) + GRID[i + 1][j + 1] * a * b
  return Math.max(0, v + 8.19 - Y0)
}

function build() {
  const stone = new Part(), win = new Part(), roof = new Part(), copper = new Part(), glass = new Part(), lit = new Part()

  // ---- masses -----------------------------------------------------------------
  block(stone, roof, PO, 0, PO_EAVE, 0.4)
  block(stone, roof, WINCH, 0, WINCH_TOP, 0.4)
  block(stone, roof, CUSTOMS, 0, CUS_EAVE, 0.4)
  block(stone, roof, FED, 0, FED_TOP, 0.4)
  block(stone, roof, FED30, 0, FED30_TOP, 0.4)
  block(stone, roof, FED14, 0, FED14_TOP, 0.3)
  // the Post Office's copper mansard: a steep slope from the cornice, flat on top
  const mBase = inset(PO, 0.8), mTop = inset(PO, 4.0)
  walls(copper, mBase, PO_EAVE, PO_TOP, mTop)
  cap(roof, mTop, PO_TOP)
  // dormers on the mansard's street sides, a bay each
  const dormers = (a: XY, b: XY, n: number) => {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], nn: XY = [u[1], -u[0]]
    for (let q = 0; q < n; q++) {
      const s = ((q + 0.5) * L) / n
      if (s < 3 || s > L - 3) continue
      const c0: XY = [a[0] + u[0] * s, a[1] + u[1] * s]
      if (c0[0] > 23 && c0[1] < -22.5) continue // the tower
      const c: XY = [a[0] + u[0] * s - nn[0] * 1.3, a[1] + u[1] * s - nn[1] * 1.3]
      const r = ccw([[c[0] - u[0] * 1.1 - nn[0] * 1.2, c[1] - u[1] * 1.1 - nn[1] * 1.2], [c[0] + u[0] * 1.1 - nn[0] * 1.2, c[1] + u[1] * 1.1 - nn[1] * 1.2], [c[0] + u[0] * 1.1 + nn[0] * 1.0, c[1] + u[1] * 1.1 + nn[1] * 1.0], [c[0] - u[0] * 1.1 + nn[0] * 1.0, c[1] - u[1] * 1.1 + nn[1] * 1.0]])
      block(stone, copper, r, PO_EAVE, PO_EAVE + 2.8, 0.3)
      const fa: XY = [c[0] - u[0] * 1.1 + nn[0] * 1.0, c[1] - u[1] * 1.1 + nn[1] * 1.0], fb: XY = [c[0] + u[0] * 1.1 + nn[0] * 1.0, c[1] + u[1] * 1.1 + nn[1] * 1.0]
      panel(win, fa, fb, 0.45, 1.75, PO_EAVE + 0.4, PO_EAVE + 2.2, 0.04)
    }
  }
  for (let i = 0; i < mBase.length; i++) {
    const a = PO[i], b = PO[(i + 1) % PO.length]
    const m: XY = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if ((m[1] < -37 || m[0] > 37.5) && L > 12) {
      dormers(a, b, Math.round(L / 4.4))
    }
  }

  // the Customs' hipped roof: from the eaves to a flat top (OSM's skillion parts)
  {
    const lo = ccw(rect(-36.9, 7.2, -4.0, 34.2)), hi = ccw(rect(-30.3, 14.0, -10.8, 27.2))
    walls(roof, lo, CUS_EAVE, CUS_RIDGE, hi)
    cap(roof, hi, CUS_RIDGE)
  }
  // the Federal Building's hips
  hipRoof(roof, 21.3, 5.3, 31.1, 32.0, FED_TOP, FED_RIDGE)
  hipRoof(roof, 3.0, 22.4, 21.5, 32.0, FED_TOP, FED_RIDGE)

  // the atrium: gabled glass over the lanes, glass ends
  for (const [x0, y0, x1, y1] of [[-32.2, -1.6, 33.6, 5.0], [-1.7, 5.0, 3.0, 25.4]]) {
    const alongX = x1 - x0 > y1 - y0
    walls(glass, ccw(rect(x0, y0, x1, y1)), 0, ATR_EAVE)
    hipRoof(glass, x0, y0, x1, y1, ATR_EAVE, ATR_RIDGE, alongX ? (x1 - x0) / 2 : (y1 - y0) / 2)
    // the gable ends' triangles
    if (alongX) for (const x of [x0, x1]) { glass.tri([x, y0, ATR_EAVE], [x, y1, ATR_EAVE], [x, (y0 + y1) / 2, ATR_RIDGE]); glass.tri([x, y1, ATR_EAVE], [x, y0, ATR_EAVE], [x, (y0 + y1) / 2, ATR_RIDGE]) }
    else for (const y of [y0, y1]) { glass.tri([x0, y, ATR_EAVE], [x1, y, ATR_EAVE], [(x0 + x1) / 2, y, ATR_RIDGE]); glass.tri([x1, y, ATR_EAVE], [x0, y, ATR_EAVE], [(x0 + x1) / 2, y, ATR_RIDGE]) }
  }

  // ---- windows: on street walls only (not where a neighbour or the atrium stands) --
  const semi = (a: XY, b: XY, s0: number, s1: number, z0: number, zs: number, out = 0.05, seg = 8) => {
    panel(win, a, b, s0, s1, z0, zs, out)
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
    const r = (s1 - s0) / 2, sc = (s0 + s1) / 2
    const P = (s: number, z: number): V3 => [a[0] + u[0] * s + n[0] * out, a[1] + u[1] * s + n[1] * out, z]
    for (let i = 0; i < seg; i++) {
      const t0 = Math.PI - (i / seg) * Math.PI, t1 = Math.PI - ((i + 1) / seg) * Math.PI
      win.tri(P(sc, zs), P(sc + r * Math.cos(t1), zs + r * Math.sin(t1)), P(sc + r * Math.cos(t0), zs + r * Math.sin(t0)))
    }
  }
  type Style = { top: number; bay: number; fill: number; storey: number; group: number; arched: boolean; ground: number }
  const facade = (r: XY[], st: Style, skip?: (a: XY, b: XY) => boolean) => {
    for (let i = 0; i < r.length; i++) {
      const a = r[i], b = r[(i + 1) % r.length]
      const L = Math.hypot(b[0] - a[0], b[1] - a[1])
      if (L < 5 || skip?.(a, b)) continue
      const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
      const m: XY = [(a[0] + b[0]) / 2 + n[0] * 0.8, (a[1] + b[1]) / 2 + n[1] * 0.8]
      if (ALL.some((q) => q !== r && inside(m, q))) continue
      const g = Math.max(ground(a[0] + n[0] * 2, a[1] + n[1] * 2), ground(b[0] + n[0] * 2, b[1] + n[1] * 2))
      const k = Math.max(1, Math.round((L - 2) / st.bay)), bay = (L - 2) / k
      const z1 = st.top - 2.2
      for (let q = 0; q < k; q++) {
        const s0 = 1 + q * bay + (bay * (1 - st.fill)) / 2, s1 = 1 + (q + 1) * bay - (bay * (1 - st.fill)) / 2
        // the ground storey
        if (st.arched) semi(a, b, s0, s1, g + 1.0, g + st.ground - 0.8 - (s1 - s0) / 2)
        else panel(win, a, b, s0, s1, g + 1.0, g + st.ground - 0.8, 0.05)
        // the upper storeys, grouped
        const zA = g + st.ground, span = st.storey * st.group
        for (let z = zA; z + span <= z1 + 0.01; z += span) panel(win, a, b, s0, s1, z + 0.6, z + span - 0.6, 0.05)
      }
    }
  }
  const towerEdge = (a: XY, b: XY) => (a[0] > 29.9 && b[0] > 29.9 && Math.min(a[1], b[1]) < -28.5) || false
  facade(PO, { top: PO_EAVE, bay: 4.4, fill: 0.5, storey: 4.6, group: 2, arched: true, ground: 7.5 }, towerEdge)
  facade(WINCH, { top: WINCH_TOP, bay: 4.0, fill: 0.5, storey: 3.9, group: 2, arched: true, ground: 6.0 })
  facade(CUSTOMS, { top: CUS_EAVE, bay: 3.6, fill: 0.45, storey: 3.6, group: 2, arched: false, ground: 5.0 })
  facade(FED, { top: FED_TOP, bay: 3.4, fill: 0.45, storey: 3.6, group: 3, arched: false, ground: 5.4 })
  facade(FED30, { top: FED30_TOP, bay: 3.4, fill: 0.45, storey: 3.6, group: 3, arched: false, ground: 5.4 })

  // ---- the corner clock tower --------------------------------------------------
  // Plan: the tower is about 10.6 m square (wlm: the clock stage spans about
  // 15 m on the diagonal, seen corner-on; OSM's 7.8 x 8.5 m part is only the
  // dome's base), set on the street corner; the pavilion under it 14.4 m.
  // Heights from crop_wlm, street to cornice = 22.4 m, scaled so the clock
  // stage's top is the lidar's 55.2 m: the pediments' crowns 44.6, the
  // square stage 50.6, the clock stage 55.2, the drum 56.2, the dome
  // 59.6, the lantern 61.6, the finial 64.0 (the tower above the cornice
  // about as tall as the front below it, as in wlm).
  const [tx0, ty0, tx1, ty1] = [27.3, -37.4, 37.9, -26.8]
  const cx = (tx0 + tx1) / 2, cy = (ty0 + ty1) / 2
  const T_PAV = h(42.1), T_STAGE = h(50.6), T_CLOCK = h(55.2), T_DRUM = h(56.2), T_DOME = h(59.6), T_LANT = h(61.6), T_FIN = h(64.0)
  const PAV = ccw(rect(23.9, -37.8, 38.3, -23.4))
  block(stone, roof, PAV, 0, T_PAV, 0.4)
  // on each street face of the pavilion: paired giant columns either side of
  // the entrance bay, and a segmental arched pediment over the bay
  const faces: [XY, XY][] = [[[23.9, -37.8], [38.3, -37.8]], [[38.3, -37.8], [38.3, -23.4]]]
  for (const [a, b] of faces) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
    const P = (sv: number, z: number, o: number): V3 => [a[0] + u[0] * sv + n[0] * o, a[1] + u[1] * sv + n[1] * o, z]
    const g = ground(...(([a[0] + u[0] * L / 2 + n[0] * 2, a[1] + u[1] * L / 2 + n[1] * 2]) as [number, number]))
    // engaged columns, half-round, from over the rusticated base to the entablature
    for (const sc of [1.5, 3.3, L - 3.3, L - 1.5]) {
      const R = 0.6, seg = 6, z0 = g + 6.0, z1 = T_PAV - 1.2
      for (let i = 0; i < seg; i++) {
        const t0 = Math.PI - (i / seg) * Math.PI, t1 = Math.PI - ((i + 1) / seg) * Math.PI
        const A = (t: number, z: number) => P(sc + R * Math.cos(t), z, R * Math.sin(t))
        const nA: V3 = [u[0] * Math.cos(t0) + n[0] * Math.sin(t0), u[1] * Math.cos(t0) + n[1] * Math.sin(t0), 0]
        const nB: V3 = [u[0] * Math.cos(t1) + n[0] * Math.sin(t1), u[1] * Math.cos(t1) + n[1] * Math.sin(t1), 0]
        stone.tri(A(t0, z0), A(t1, z0), A(t1, z1), undefined, undefined, undefined, [nA, nB, nB])
        stone.tri(A(t0, z0), A(t1, z1), A(t0, z1), undefined, undefined, undefined, [nA, nB, nA])
      }
      // a square capital block
      const c0 = ccw([[P(sc - 0.8, 0, 0)[0], P(sc - 0.8, 0, 0)[1]], [P(sc + 0.8, 0, 0)[0], P(sc + 0.8, 0, 0)[1]], [P(sc + 0.8, 0, 0.9)[0], P(sc + 0.8, 0, 0.9)[1]], [P(sc - 0.8, 0, 0.9)[0], P(sc - 0.8, 0, 0.9)[1]]])
      block(stone, null, c0, T_PAV - 1.2, T_PAV - 0.4, 0)
    }
    // the segmental pediment: chord across the bay between the column pairs, rise 2.5 m, 1.2 m deep
    const c = L - 2.4, rise = 2.5, Rr = (c * c / 4 + rise * rise) / (2 * rise), sc = L / 2, seg = 10
    const half = Math.asin(c / 2 / Rr), zc = T_PAV + rise - Rr
    for (let i = 0; i < seg; i++) {
      const t0 = Math.PI / 2 + half - (i / seg) * 2 * half, t1 = Math.PI / 2 + half - ((i + 1) / seg) * 2 * half
      const A0 = (o: number) => P(sc + Rr * Math.cos(t0), zc + Rr * Math.sin(t0), o), A1 = (o: number) => P(sc + Rr * Math.cos(t1), zc + Rr * Math.sin(t1), o)
      const B0 = (o: number) => P(sc + Rr * Math.cos(t0), T_PAV, o), B1 = (o: number) => P(sc + Rr * Math.cos(t1), T_PAV, o)
      stone.quad(B0(0.6), B1(0.6), A1(0.6), A0(0.6)) // its face
      stone.quad(A0(0.6), A1(0.6), A1(-0.6), A0(-0.6)) // its top
      stone.quad(B1(-0.6), B0(-0.6), A0(-0.6), A1(-0.6))
    }
    // the entrance: doors and a fanlight in the bay, a tall window over them
    panel(lit, a, b, L / 2 - 1.6, L / 2 + 1.6, g, g + 3.6, 0.06)
    semi(a, b, L / 2 - 1.6, L / 2 + 1.6, g + 3.7, g + 3.8, 0.06)
    semi(a, b, L / 2 - 1.4, L / 2 + 1.4, g + 7.0, T_PAV - 3.0, 0.05)
  }
  // the square stage, paired windows a face
  block(stone, roof, ccw(rect(tx0, ty0, tx1, ty1)), T_PAV - 0.5, T_STAGE, 0.4)
  const sides = (x0: number, y0: number, x1: number, y1: number): [XY, XY][] => [[[x0, y0], [x1, y0]], [[x1, y0], [x1, y1]], [[x1, y1], [x0, y1]], [[x0, y1], [x0, y0]]]
  for (const [a, b] of sides(tx0, ty0, tx1, ty1)) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    semi(a, b, L / 2 - 2.6, L / 2 - 0.6, T_PAV + 3.0, T_STAGE - 2.6, 0.05)
    semi(a, b, L / 2 + 0.6, L / 2 + 2.6, T_PAV + 3.0, T_STAGE - 2.6, 0.05)
  }
  // the clock stage, a big round clock filling each face, corner turrets with copper caps
  const k0 = 0.5
  block(stone, roof, ccw(rect(tx0 + k0, ty0 + k0, tx1 - k0, ty1 - k0)), T_STAGE - 0.5, T_CLOCK, 0.4)
  const clock = (p: V3, nrm: V3) => {
    const R = 2.0, seg = 16, t1: V3 = [-nrm[1], nrm[0], 0]
    for (let i = 0; i < seg; i++) {
      const a0 = (i / seg) * 2 * Math.PI, a1 = ((i + 1) / seg) * 2 * Math.PI
      const Q = (t: number, r: number): V3 => [p[0] + t1[0] * r * Math.cos(t), p[1] + t1[1] * r * Math.cos(t), p[2] + r * Math.sin(t)]
      lit.tri(p, Q(a0, R), Q(a1, R), undefined, undefined, undefined, [nrm, nrm, nrm])
      // a stone ring round the face
      const o: V3 = [nrm[0] * 0.08, nrm[1] * 0.08, 0]
      const q0 = Q(a0, R), q1 = Q(a1, R), r0 = Q(a0, R + 0.45), r1 = Q(a1, R + 0.45)
      const add = (v: V3): V3 => [v[0] + o[0], v[1] + o[1], v[2]]
      stone.tri(add(q0), add(r0), add(r1), undefined, undefined, undefined, [nrm, nrm, nrm])
      stone.tri(add(q0), add(r1), add(q1), undefined, undefined, undefined, [nrm, nrm, nrm])
    }
  }
  const zc = (T_STAGE + T_CLOCK) / 2 + 0.2
  clock([tx1 - k0 + 0.08, cy, zc], [1, 0, 0])
  clock([tx0 + k0 - 0.08, cy, zc], [-1, 0, 0])
  clock([cx, ty0 + k0 - 0.08, zc], [0, -1, 0])
  clock([cx, ty1 - k0 + 0.08, zc], [0, 1, 0])
  for (const [qx, qy] of [[tx0, ty0], [tx1, ty0], [tx1, ty1], [tx0, ty1]] as XY[]) {
    const ex = qx < cx ? 1 : -1, ey = qy < cy ? 1 : -1
    const x0 = Math.min(qx, qx + ex * 1.5), x1 = Math.max(qx, qx + ex * 1.5), y0 = Math.min(qy, qy + ey * 1.5), y1 = Math.max(qy, qy + ey * 1.5)
    block(stone, null, ccw(rect(x0, y0, x1, y1)), T_STAGE - 0.5, T_CLOCK + 1.4, 0.2)
    lathe(copper, (x0 + x1) / 2, (y0 + y1) / 2, [[0.85, T_CLOCK + 1.4], [0.75, T_CLOCK + 2.0], [0.35, T_CLOCK + 2.5], [0.0, T_CLOCK + 2.9]], 8)
  }
  // the drum, the ribbed bell-shaped copper dome, the lantern and the finial
  lathe(stone, cx, cy, [[4.0, T_CLOCK], [4.0, T_DRUM]], 16, 0)
  const domeProf: XY[] = [[4.15, T_DRUM], [4.05, T_DRUM + 0.9], [3.6, T_DRUM + 1.9], [2.7, T_DOME - 0.6], [1.3, T_DOME]]
  lathe(copper, cx, cy, domeProf, 16, 0)
  for (let k = 0; k < 8; k++) {
    // stone-coloured ribs on the dome, eight
    const t = (k / 8) * 2 * Math.PI + Math.PI / 8, w = 0.13
    for (let i = 0; i < domeProf.length - 1; i++) {
      const [r0, z0] = domeProf[i], [r1, z1] = domeProf[i + 1]
      const Q = (r: number, z: number, d: number): V3 => [cx + (r + 0.06) * Math.cos(t + d / Math.max(r, 0.5)), cy + (r + 0.06) * Math.sin(t + d / Math.max(r, 0.5)), z]
      stone.quad(Q(r0, z0, -w), Q(r0, z0, w), Q(r1, z1, w), Q(r1, z1, -w))
    }
  }
  lathe(copper, cx, cy, [[1.2, T_DOME], [1.2, T_LANT - 0.6], [1.5, T_LANT - 0.4], [0.6, T_LANT], [0.0, T_LANT + 0.3]], 8)
  lathe(copper, cx, cy, [[0.22, T_LANT], [0.15, T_FIN], [0, T_FIN + 0.01]], 6)

  const flood = (p: V3) => (p[0] > -10.5 && p[1] < -1 ? 0.6 : 0.2)
  return [
    { part: stone, material: { ...finish('sinclair-granite', 0xd8d5ce), floodlight: flood } as MaterialSpec },
    { part: win, material: PALETTE.window as MaterialSpec },
    { part: roof, material: PALETTE.roof as MaterialSpec },
    { part: copper, material: { ...PALETTE.copper, floodlight: (p: V3) => (p[0] > 29 && p[1] < -28 ? 0.7 : 0.25) } as MaterialSpec },
    { part: glass, material: PALETTE.glass as MaterialSpec },
    { part: lit, material: PALETTE.entrance as MaterialSpec },
  ]
}

if (import.meta.main) {
  const parts = build().filter((x) => x.part.triangles > 0)
  const tris = parts.reduce((s, x) => s + x.part.triangles, 0)
  const glb = writeGlb('Sinclair Centre', parts, { frame: 'Y up, -Z north, +X east; metres; ground anchor', anchor: [ANCHOR.lat, ANCHOR.lng], bearing: BEARING })
  if (tris > 6500 || glb.length > 250_000) throw new Error(`budget: ${tris} triangles / ${glb.length} bytes`)
  const out = new URL('../models/van-sinclair-centre.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${tris} triangles, ${glb.length} bytes`)
}
