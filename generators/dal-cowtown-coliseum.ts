/**
 * Cowtown Coliseum (the Coliseum, 1908), 121 East Exchange Avenue, Fort
 * Worth Stockyards: the first indoor rodeo arena — original procedural
 * geometry, CC0-1.0. bun generators/dal-cowtown-coliseum.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = area centroid of the OSM outline way/56029797
 * (building=yes, leisure=stadium, "Cowtown Coliseum", 121 East Exchange
 * Avenue), 32.7896230, -97.3476885. Its long walls run 0.6° east of north,
 * so the catalog bearing is 0.6. The Texas Historical Commission marker
 * "The Coliseum" stands on its lawn (Jpo tx113's photo), which with the
 * address and every photo confirms the building. way/1245926355
 * (building:part) is the roof monitor.
 *
 * Identity, in order: the tall front gable on Exchange Avenue with its huge
 * red-framed segmental window and the Mission bell gable at the apex; the
 * long gabled arena roof with its glazed ridge monitor; the two two-storey
 * front pavilions with broad red tile hip roofs either side of a one-storey
 * entrance arcade; the small corner towers at the gable's feet; pale grey
 * stucco walls with red window frames.
 *
 * Note on colour: the brief described red brick. Every daylight photo
 * (2016, 2017) shows the walls rendered in pale grey stucco; red is only the
 * tile roofs and the window frames. The model follows the photos.
 *
 * Plan: OSM. The arena hall x -27.2..27.2; its front gable wall stands at
 * y -32.5 (the lidar: OSM's -35.5 line is the front of the entrance porch,
 * whose roof the lidar shows from -38 to -32.5); front pavilions
 * x ±16.1..27.2 to y -41.9 (OSM); back wall y 38.3 (OSM). Monitor x
 * -3.5..3.5 (OSM part 7.8 m wide; lidar crest ~6 m), y -22.7..26.5 (OSM).
 *
 * Heights: USGS 3DEP lidar TX_Pecos_Dallas_B3_2018 (2018 flight), 0.5 m
 * grid, above the street (ground_min + 0.7): hall eaves 11.6, gable ridge
 * 20.6, monitor crest 23.3, corner towers 14.7, pavilion eaves 7.7 and
 * ridges 9.7, porch roof 4.6-5.6 (all measured). Bell gable top 24.2,
 * estimated from Michael Barera's front views (~20 px/m at the gable).
 * Big window: 18 m wide, sill 12.4, springing 14.6, rise 4 (a true circular
 * segment), estimated from the same photos; 8 arched windows below it.
 * Porch: 9 round arches (Jpo tx113), 2.4 m openings, 1.0 m piers, on a
 * 1.0 m stepped terrace (estimated). Side walls: 9 bays between pilasters
 * with two tiers of windows (1908 Bellar postcard), sizes estimated.
 *
 * Colour (daylight photos and NAIP, pulled to the palette's lightness):
 * pale grey stucco #d3cfc3; red tile and window frames #b5604e; arena roof
 * a muted maroon-brown #9a6f66 (NAIP); monitor `glass`; porch shade
 * #7f776f. Night: windows glow, the monitor stays dark.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Fort_Worth_Stockyards_June_2016_49_(Cowtown_Coliseum).jpg, Michael
 *    Barera, CC BY-SA 4.0 (south-west)
 *    https://commons.wikimedia.org/wiki/File:Fort_Worth_Stockyards_June_2016_49_(Cowtown_Coliseum).jpg
 *  - Fort_Worth_Stockyards_June_2016_48_(Cowtown_Coliseum).jpg, Michael
 *    Barera, CC BY-SA 4.0 (south-east, east side)
 *    https://commons.wikimedia.org/wiki/File:Fort_Worth_Stockyards_June_2016_48_(Cowtown_Coliseum).jpg
 *  - Fort_Worth_Stockyards_June_2016_17_(Cowtown_Coliseum_and_Box_Office).jpg,
 *    Michael Barera, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:Fort_Worth_Stockyards_June_2016_17_(Cowtown_Coliseum_and_Box_Office).jpg
 *  - Coliseum,_full_shot.jpg, Jpo tx113, CC BY-SA 4.0 (porch, pavilion,
 *    window frames, marker)
 *    https://commons.wikimedia.org/wiki/File:Coliseum,_full_shot.jpg
 *  - The_Coliseum,_Fort_Worth,_Texas_(8123991462).jpg, Nicolas Henderson,
 *    CC BY 2.0
 *    https://commons.wikimedia.org/wiki/File:The_Coliseum,_Fort_Worth,_Texas_(8123991462).jpg
 *  - Coliseum_(20102216).jpg, Geo. W. Bellar postcard, public domain
 *    (front and east side, roof, rear bell gable)
 *    https://commons.wikimedia.org/wiki/File:Coliseum_(20102216).jpg
 * Also: OSM (ODbL); USGS NAIP (public domain) for the roof, monitor and
 * pavilion roofs; Mapterhorn terrain (site within ~1 m of level).
 * Published: built 1907-08 by the Fort Worth Stock Yards Company; first
 * indoor rodeo 1918 (Texas Historical Commission marker; Wikipedia,
 * "Cowtown Coliseum"). No look-only sources. No commercial imagery or 3D
 * tiles.
 *
 * Doubts: the west and north sides are not photographed head-on (west and
 * rear drawn like the east side and front, plainer); the side-wall windows
 * follow the 1908 postcard and may have been altered; the porch arch count
 * is from a partial view.
 *
 * Left out: "COLISEUM 1908" lettering, banners, flagpole, steps, railings,
 * the eave brackets, the window tracery beyond a few bold mullions.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { archPanel, block, cap, panel, rect, save, triangulate, wallBays, type XY } from './chi-merchandise-mart'

const ANCHOR: [number, number] = [32.789623, -97.3476885]
const BEARING = 0.6

const X0 = -27.2, X1 = 27.2, YF = -32.5, YB = 38.3 // arena hall
const PAV = 16.1, PF = -41.9 // pavilions x ±PAV..27.2, front at PF
const EAVE = 11.6, RIDGE = 20.6, MON = 3.5, MON_S = -22.7, MON_N = 26.5, MON_TOP = 23.3
const P_EAVE = 7.7, P_RIDGE = 9.7
const POR = -38.0, POR_EAVE = 4.6, POR_TOP = 5.6, TERRACE = 1.0, SPRING = 3.0

// --- small geometry helpers ------------------------------------------------
function face(p: Part, pts: V3[], n: V3, proj: (q: V3) => XY) {
  let r = pts.map(proj)
  const a = r.reduce((s, c, i) => { const d = r[(i + 1) % r.length]; return s + c[0] * d[1] - d[0] * c[1] }, 0)
  let P = pts
  if (a < 0) { r = [...r].reverse(); P = [...pts].reverse() }
  for (const [i, j, k] of triangulate(r)) p.tri(P[i], P[j], P[k], undefined, undefined, undefined, [n, n, n])
}
/** A profile (x, z) extruded between y0 (front, facing -y) and y1. */
function extrudeY(p: Part, prof: XY[], y0: number, y1: number) {
  face(p, prof.map(([x, z]) => [x, y0, z] as V3), [0, -1, 0], (q) => [q[0], q[2]])
  face(p, prof.map(([x, z]) => [x, y1, z] as V3), [0, 1, 0], (q) => [q[0], q[2]])
  for (let i = 0; i < prof.length; i++) {
    const [ax, az] = prof[i], [bx, bz] = prof[(i + 1) % prof.length]
    const l = Math.hypot(bx - ax, bz - az) || 1, n: V3 = [(bz - az) / l, 0, -(bx - ax) / l]
    p.tri([ax, y0, az], [bx, y0, bz], [bx, y1, bz], undefined, undefined, undefined, [n, n, n])
    p.tri([ax, y0, az], [bx, y1, bz], [ax, y1, az], undefined, undefined, undefined, [n, n, n])
  }
}
function walls(p: Part, r: XY[], z0: number, z1: number) {
  for (let i = 0; i < r.length; i++) {
    const j = (i + 1) % r.length
    p.quad([r[i][0], r[i][1], z0], [r[j][0], r[j][1], z0], [r[j][0], r[j][1], z1], [r[i][0], r[i][1], z1])
  }
}
/** A hipped roof on all four sides (pyramid when square), with fascia and soffit. */
function hipRoof(p: Part, x0: number, x1: number, y0: number, y1: number, ze: number, zr: number) {
  walls(p, rect(x0, y0, x1, y1), ze - 0.3, ze)
  cap(p, rect(x0, y0, x1, y1), ze - 0.3, false)
  const alongY = y1 - y0 >= x1 - x0, h = Math.min(x1 - x0, y1 - y0) / 2
  const xm = (x0 + x1) / 2, ym = (y0 + y1) / 2
  const A: V3 = alongY ? [xm, y0 + h, zr] : [x0 + h, ym, zr], B: V3 = alongY ? [xm, y1 - h, zr] : [x1 - h, ym, zr]
  if (alongY) {
    p.quad([x1, y0, ze], [x1, y1, ze], B, A); p.quad([x0, y1, ze], [x0, y0, ze], A, B)
    p.tri([x0, y0, ze], [x1, y0, ze], A); p.tri([x1, y1, ze], [x0, y1, ze], B)
  } else {
    p.quad([x0, y0, ze], [x1, y0, ze], B, A); p.quad([x1, y1, ze], [x0, y1, ze], A, B)
    p.tri([x0, y1, ze], [x0, y0, ze], A); p.tri([x1, y0, ze], [x1, y1, ze], B)
  }
}
/** A round-arched arcade along a south-facing front at y0 (thickness t) between x0 and x1. */
function arcade(stucco: Part, x0: number, x1: number, y0: number, t: number, n: number, pier: number, terrace: number, spring: number, top: number) {
  const y1 = y0 + t, pitch = (x1 - x0 - pier) / n, w = pitch - pier, r = w / 2, seg = 10
  block(stucco, stucco, rect(x0, y0, x1, y1), 0, terrace, 0)
  for (let k = 0; k <= n; k++) { const x = x0 + k * pitch; block(stucco, null, rect(x, y0, x + pier, y1), terrace, top, 0) }
  for (let k = 0; k < n; k++) {
    const s0 = x0 + pier + k * pitch, s1 = s0 + w, c = s0 + r
    const arc: XY[] = Array.from({ length: seg + 1 }, (_, i) => { const a = Math.PI - (i / seg) * Math.PI; return [c + r * Math.cos(a), spring + r * Math.sin(a)] as XY })
    for (const [y, sn] of [[y0, -1], [y1, 1]] as [number, number][]) {
      const N: V3 = [0, sn, 0], P = ([x, z]: XY): V3 => [x, y, z]
      for (let i = 0; i < seg; i++) stucco.tri(P(arc[i]), P(arc[i + 1]), P(i < seg / 2 ? [s0, top] : [s1, top]), undefined, undefined, undefined, [N, N, N])
      stucco.tri(P([s0, top]), P(arc[seg / 2]), P([s1, top]), undefined, undefined, undefined, [N, N, N])
    }
    for (let i = 0; i < seg; i++) {
      const [ax, az] = arc[i], [bx, bz] = arc[i + 1]
      const na: V3 = [(c - ax) / r, 0, (spring - az) / r], nb: V3 = [(c - bx) / r, 0, (spring - bz) / r]
      stucco.tri([ax, y0, az], [bx, y0, bz], [bx, y1, bz], undefined, undefined, undefined, [na, nb, nb])
      stucco.tri([ax, y0, az], [bx, y1, bz], [ax, y1, az], undefined, undefined, undefined, [na, nb, na])
    }
  }
  return { pitch, w, pier }
}

function build() {
  const stucco = new Part(), red = new Part(), roof = new Part(), win = new Part(), glass = new Part(), shade = new Part()
  const south = (y: number, x0: number, x1: number): [XY, XY] => [[x0, y], [x1, y]]
  const north = (y: number, x0: number, x1: number): [XY, XY] => [[x1, y], [x0, y]]
  const east = (x: number, y0: number, y1: number): [XY, XY] => [[x, y0], [x, y1]]
  const west = (x: number, y0: number, y1: number): [XY, XY] => [[x, y1], [x, y0]]
  const slope = (RIDGE - EAVE) / X1
  const roofZ = (x: number) => RIDGE - Math.abs(x) * slope

  // --- Arena hall ---------------------------------------------------------
  block(stucco, null, rect(X0, YF, X1, YB), 0, EAVE, 0)
  // gable walls, front and back, standing 0.5 m proud of the roof as a coping
  const gable: XY[] = [[X0, EAVE - 0.01], [X1, EAVE - 0.01], [X1, EAVE + 0.5], [0, RIDGE + 0.5], [X0, EAVE + 0.5]]
  extrudeY(stucco, gable, YF, YF + 0.8)
  extrudeY(stucco, gable, YB - 0.8, YB)
  // the roof: two slopes with an overhang on the long sides, in 5 m strips
  {
    const o = 0.6, zo = EAVE - o * slope, n = Math.ceil((YB - YF) / 5)
    for (let k = 0; k < n; k++) {
      const ya = YF + 0.4 + ((YB - YF - 0.8) * k) / n, yb = YF + 0.4 + ((YB - YF - 0.8) * (k + 1)) / n
      roof.quad([X1 + o, ya, zo], [X1 + o, yb, zo], [0, yb, RIDGE], [0, ya, RIDGE])
      roof.quad([X0 - o, yb, zo], [X0 - o, ya, zo], [0, ya, RIDGE], [0, yb, RIDGE])
    }
    for (const [x, xi] of [[X1 + o, X1], [X0 - o, X0]]) {
      const s = Math.sign(x)
      roof.quad([x, YF + 0.4, zo - 0.25], [x, YB - 0.4, zo - 0.25], [x, YB - 0.4, zo], [x, YF + 0.4, zo])
      if (s > 0) cap(roof, rect(xi, YF + 0.4, x, YB - 0.4), zo - 0.25, false)
      else cap(roof, rect(x, YF + 0.4, xi, YB - 0.4), zo - 0.25, false)
    }
  }
  // the ridge monitor: glazed sides and a low glazed gable
  {
    const zb = roofZ(MON) - 0.2, zs = MON_TOP - 1.1
    glass.quad([MON, MON_S, zb], [MON, MON_N, zb], [MON, MON_N, zs], [MON, MON_S, zs])
    glass.quad([-MON, MON_N, zb], [-MON, MON_S, zb], [-MON, MON_S, zs], [-MON, MON_N, zs])
    const end: XY[] = [[-MON, zb], [MON, zb], [MON, zs], [0, MON_TOP], [-MON, zs]]
    face(roof, end.map(([x, z]) => [x, MON_S, z] as V3), [0, -1, 0], (q) => [q[0], q[2]])
    face(roof, end.map(([x, z]) => [x, MON_N, z] as V3), [0, 1, 0], (q) => [q[0], q[2]])
    const o = 0.35
    roof.quad([MON + o, MON_S - o, zs - 0.1], [MON + o, MON_N + o, zs - 0.1], [0, MON_N + o, MON_TOP], [0, MON_S - o, MON_TOP])
    roof.quad([-MON - o, MON_N + o, zs - 0.1], [-MON - o, MON_S - o, zs - 0.1], [0, MON_S - o, MON_TOP], [0, MON_N + o, MON_TOP])
    // glazing strips on the monitor's top, as the NAIP shows it pale
    glass.quad([MON * 0.9, MON_S, zs + 0.06], [MON * 0.9, MON_N, zs + 0.06], [0.3, MON_N, MON_TOP - 0.03], [0.3, MON_S, MON_TOP - 0.03])
    glass.quad([-MON * 0.9, MON_N, zs + 0.06], [-MON * 0.9, MON_S, zs + 0.06], [-0.3, MON_S, MON_TOP - 0.03], [-0.3, MON_N, MON_TOP - 0.03])
  }

  // --- The bell gables (espadañas) at the apex ------------------------------
  const bell = (y0: number, y1: number, k: number) => {
    const W = 2.2 * k, w = 1.15 * k, zb = RIDGE - 1.5, zs = RIDGE + 1.6 * k, zc = RIDGE + 2.5 * k
    const prof: XY[] = [[-W, zb], [W, zb], [W, zs], [w, zs], [w, zc]]
    for (let i = 1; i < 10; i++) { const a = (i / 10) * Math.PI; prof.push([w * Math.cos(a), zc + w * Math.sin(a)]) }
    prof.push([-w, zc], [-w, zs], [-W, zs])
    extrudeY(stucco, prof, y0, y1)
    for (const [y, sgn] of [[y0, 1], [y1, -1]] as [number, number][]) {
      const [a, b] = sgn > 0 ? south(y, -W, W) : north(y, -W, W)
      for (const d of [-1.05 * k, 1.05 * k]) archPanel(shade, a, b, W + d - 0.42 * k, W + d + 0.42 * k, RIDGE + 0.5 * k, RIDGE + 1.1 * k, 0.04, 6)
      archPanel(shade, a, b, W - 0.42 * k, W + 0.42 * k, zs + 0.2, zc + 0.1, 0.04, 6)
    }
  }
  bell(YF - 0.1, YF + 0.9, 1)
  bell(YB - 0.9, YB + 0.1, 0.75)

  // --- Front gable: the big segmental window and the arched windows -------
  {
    const [a, b] = south(YF, X0, X1), mid = -X0
    const c = 18, h = 4.0, R = (c * c / 4 + h * h) / (2 * h), sill = 12.4, spr = 14.6, zc = spr + h - R
    // the window as a fan of thin quads under the segment
    const seg = 12, ang = Math.asin(c / 2 / R)
    const { P } = { P: (s: number, z: number, o: number): V3 => [a[0] + s, YF - o, z] }
    for (let i = 0; i < seg; i++) {
      const t0 = -ang + (2 * ang * i) / seg, t1 = -ang + (2 * ang * (i + 1)) / seg
      const s0 = mid + R * Math.sin(t0), s1 = mid + R * Math.sin(t1)
      win.quad(P(s0, sill, 0.05), P(s1, sill, 0.05), P(s1, zc + R * Math.cos(t1), 0.05), P(s0, zc + R * Math.cos(t0), 0.05))
    }
    // bold red frame: transom at the springing and mullions
    panel(red, a, b, mid - c / 2 - 0.3, mid + c / 2 + 0.3, sill - 0.35, sill, 0.1)
    panel(red, a, b, mid - c / 2, mid + c / 2, spr - 0.15, spr + 0.15, 0.09)
    for (let k = 0; k <= 8; k++) {
      const s = mid - c / 2 + (k * c) / 8, top = zc + Math.sqrt(Math.max(0, R * R - (s - mid) ** 2))
      panel(red, a, b, s - 0.16, s + 0.16, sill, top, 0.09)
    }
    // the red arch rim, as short segments
    for (let i = 0; i < seg; i++) {
      const t0 = -ang + (2 * ang * i) / seg, t1 = -ang + (2 * ang * (i + 1)) / seg
      const p0: XY = [mid + R * Math.sin(t0), zc + R * Math.cos(t0)], p1: XY = [mid + R * Math.sin(t1), zc + R * Math.cos(t1)]
      red.quad(P(p0[0], p0[1], 0.1), P(p1[0], p1[1], 0.1), P(p1[0], p1[1] + 0.35, 0.1), P(p0[0], p0[1] + 0.35, 0.1))
    }
    // eight arched windows in a row under it
    for (let k = 0; k < 8; k++) { const s = mid + (k - 3.5) * 2.6; archPanel(win, a, b, s - 0.75, s + 0.75, 9.0, 10.3, 0.05, 6) }
  }
  // the back gable: a plainer row of windows
  wallBays(win, ...north(YB, X0, X1), [[7.0, 9.8]], { pitch: 4.0, w: 1.8, end: 4.0, arch: true })

  // --- Corner towers at the front gable's feet ----------------------------
  for (const [x0, x1] of [[X0, X0 + 4.2], [X1 - 4.2, X1]]) {
    block(stucco, null, rect(x0, YF, x1, YF + 4.2), EAVE - 1, 13.6, 0)
    block(stucco, null, rect(x0 - 0.15, YF - 0.15, x1 + 0.15, YF + 4.35), 13.3, 13.6, 0)
    hipRoof(red, x0 - 0.4, x1 + 0.4, YF - 0.4, YF + 4.6, 13.6, 14.9)
    for (const [a, b] of [south(YF, x0, x1), x0 < 0 ? west(x0, YF, YF + 4.2) : east(x1, YF, YF + 4.2)])
      archPanel(shade, a, b, 1.4, 2.8, 11.9, 12.6, 0.05, 6)
  }

  // --- Long sides: pilasters and two tiers of windows ---------------------
  {
    const n = 9, L = YB - (YF + 4.2), pitch = L / n
    for (const [x, sgn] of [[X1, 1], [X0, -1]] as [number, number][]) {
      for (let k = 0; k <= n; k++) {
        const y = YF + 4.2 + k * pitch
        const r = sgn > 0 ? rect(x, y - 0.55, x + 0.6, y + 0.55) : rect(x - 0.6, y - 0.55, x, y + 0.55)
        block(stucco, stucco, r, 0, EAVE + 0.4, 0)
      }
      for (let k = 0; k < n; k++) {
        const y0 = YF + 4.2 + k * pitch, [a, b] = sgn > 0 ? east(x, y0, y0 + pitch) : west(x, y0, y0 + pitch)
        panel(win, a, b, pitch / 2 - 2.2, pitch / 2 + 2.2, 2.4, 5.2, 0.05)
        archPanel(win, a, b, pitch / 2 - 2.3, pitch / 2 + 2.3, 6.8, 8.3, 0.05, 10)
        panel(red, a, b, pitch / 2 - 0.12, pitch / 2 + 0.12, 6.8, 10.6, 0.08)
      }
    }
  }

  // --- Front pavilions ------------------------------------------------------
  for (const sgn of [-1, 1]) {
    const x0 = sgn < 0 ? X0 : PAV, x1 = sgn < 0 ? -PAV : X1, cx = (x0 + x1) / 2, Wd = x1 - x0
    block(stucco, null, rect(x0, PF, x1, YF + 0.5), 0, P_EAVE, 0)
    block(stucco, null, rect(x0 - 0.12, PF - 0.12, x1 + 0.12, YF + 0.5), 0, 0.9, 0) // plinth
    hipRoof(red, x0 - 1.0, x1 + 1.0, PF - 1.0, YF + 1.0, P_EAVE, P_RIDGE)
    const [a, b] = south(PF, x0, x1)
    for (const d of [-3.3, 0, 3.3]) {
      archPanel(win, a, b, Wd / 2 + d - 1.0, Wd / 2 + d + 1.0, 1.6, 3.4, 0.05, 8)
      panel(win, a, b, Wd / 2 + d - 1.2, Wd / 2 + d + 1.2, 5.0, 6.7, 0.05)
    }
    const [sa, sb] = sgn < 0 ? west(x0, PF, YF) : east(x1, PF, YF)
    for (const s of [2.3, 5.4]) {
      archPanel(win, sa, sb, s - 0.85, s + 0.85, 1.6, 3.4, 0.05, 8)
      panel(win, sa, sb, s - 1.0, s + 1.0, 5.0, 6.7, 0.05)
    }
    void cx
  }

  // --- Entrance porch -------------------------------------------------------
  {
    const x0 = -PAV, x1 = PAV
    const { pitch, w, pier } = arcade(stucco, x0, x1, POR, 0.6, 9, 1.0, TERRACE, SPRING, POR_EAVE)
    // roof: one slope from the front eave up to the gable wall
    red.quad([x0, POR - 0.6, POR_EAVE], [x1, POR - 0.6, POR_EAVE], [x1, YF, POR_TOP], [x0, YF, POR_TOP])
    red.quad([x0, POR - 0.6, POR_EAVE - 0.25], [x1, POR - 0.6, POR_EAVE - 0.25], [x1, POR - 0.6, POR_EAVE], [x0, POR - 0.6, POR_EAVE])
    cap(red, rect(x0, POR - 0.6, x1, POR), POR_EAVE - 0.25, false)
    // the porch in shadow: ceiling, floor and the doors on the hall wall
    cap(shade, rect(x0, POR + 0.6, x1, YF), 4.2, false)
    for (let k = 0; k < 8; k++) cap(shade, rect(x0 + (k * (x1 - x0)) / 8, POR + 0.6, x0 + ((k + 1) * (x1 - x0)) / 8, YF), TERRACE, true)
    panel(shade, ...south(YF, x0, x1), 0, x1 - x0, TERRACE, 4.2, 0.03)
    for (let k = 0; k < 9; k++) {
      const s = pier + k * pitch + w / 2
      panel(red, ...south(YF - 0.05, x0, x1), s - 0.95, s + 0.95, TERRACE, 3.4, 0.03)
    }
  }

  return [
    { part: stucco, material: finish('coliseum-stucco', 0xd3cfc3) },
    { part: red, material: finish('coliseum-red-tile', 0xb5604e) },
    { part: roof, material: finish('coliseum-roof', 0x9a6f66) },
    { part: win, material: PALETTE.window },
    { part: glass, material: PALETTE.glass },
    { part: shade, material: finish('coliseum-porch-shade', 0x7f776f) },
  ]
}

if (import.meta.main) await save('dal-cowtown-coliseum', 'Cowtown Coliseum', ANCHOR, BEARING, build())
