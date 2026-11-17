/**
 * Will Rogers Memorial Center, Fort Worth (1936, Wyatt C. Hedrick; built
 * for the Fort Worth Frontier Centennial): the Pioneer
 * Tower between the Will Rogers Coliseum and the Will Rogers Memorial
 * Auditorium — original procedural geometry, CC0-1.0.
 * bun generators/dal-will-rogers-memorial-center.ts
 *
 * What is modelled, and why: OSM maps the three as one joined group on
 * the Lancaster Avenue front: the Coliseum (way/178613280) and the
 * Auditorium (way/178613282) share a wall at x -32, and the tower is a
 * building:part (way/614113504, "Pinoeer Tower", height 63) set into a
 * notch of the Coliseum's outline. The group is the composition every
 * photo and the 1936 postcard show (two matching mural fronts either side
 * of the tower), so the model is all three and replaces all three ways.
 *
 * Frame: map frame, x east, y north, z up, metres, turned to bearing 0.9
 * (the outlines' long walls run at 0.9° / 90.9°). Anchor = area centroid
 * of the three ways, -97.36613 32.74580. The fronts face north (+y) to the
 * plaza on Lancaster Avenue.
 *
 * Identity, in order: the tall square buff-brick tower on a pale limestone
 * base, with stepped corner piers, a long grey louvred slot down each
 * face, stone pinnacles and a white stepped octagonal crown with a small
 * lantern; the two curved limestone fronts, six square fluted pylons and
 * five tall dark glass-block windows under a coloured tile mural band,
 * between buff-brick pavilions; the Coliseum's long white dome behind; the
 * Auditorium's curved hall roof and tall stage house.
 *
 * Evidence:
 *  - plan: the OSM outlines above (2026), converted to this frame; the
 *    curved fronts are circles through OSM's arcs (Coliseum r 55.8 m about
 *    (28.25, -5.3); Auditorium r 53.9 m about (-68.1, -5.2)). The lidar
 *    footprints sit 2-3 m south of OSM; OSM is used for plan.
 *  - heights: USGS 3DEP lidar TX_Pecos_Dallas_B3_2018 (2018 flight), 1 m
 *    grid read in this frame (tools/lidar_frame.py). Model z = lidar height
 *    above ground_min (177.03 m) minus 1.7 m, the lowest ground under the
 *    footprint (east of the Coliseum); the site falls ~2 m from west to
 *    east. Measured: Coliseum dome eave 13.8, crown 25.8 (a parabolic
 *    section fitted across it, 68.5 m span), ridge monitor 28.7; the dome is
 *    a stadium in plan (straight sides x -7..61.5, semicircular ends; its
 *    south end on OSM's arc); Coliseum front parapet 15.6, its pavilions
 *    16.3; the low annexes
 *    3.5-4.5; the connecting wings either side of the tower 8.2-8.5;
 *    Auditorium front parapet 15.6, pavilions 16.9, hall eave 14.2 and vault
 *    crown 18.9 (36 m span), side aisles 4.8, stage house 23.0 with a fly
 *    block to 25.3, west and east wings 9.0 and 8.5.
 *  - tower: ~208 ft (63.4 m) as given in the batch brief, OSM height=63.
 *    The lidar puts the top at 64.1 m above the tower's foot, but only as
 *    points the dataset classes as high noise (class 18; the crown's walls
 *    are class 1 to ~50 m), so it confirms the figure rather than sets it. Foot at z 1.4; lantern top 63.4 above it. Plan
 *    11.2 m square on the OSM part. From Michael Barera's telephoto
 *    (22.8 px/m on the 11.4 m shaft) and its crop: limestone base to 23 m,
 *    the stepped brick shaft to 56 m (corner piers 3 m wide, two 0.3 m
 *    steps to the recessed middle), the louvred slot 1.8 m wide from 27 to
 *    52.3 m under a stepped stone head, stone pinnacles to 59 m, the 7.3 m
 *    upper core to 58.7 m with a stone fin on each face, then three white
 *    chamfered tiers (7.9, 6.7, 5.8 m) to 62.5 m, a low roof and lantern.
 *    Estimated, ±1 m.
 *  - fronts (Barera 21 and 23, straight on, ~44 px/m on the 34 m chord):
 *    six pylons 2.6 m wide, 1.6 m deep, bays 3.7 m; glass-block windows
 *    2.3 m wide from 2.9 to 10.3 m and doors to 2.5 m above the plaza; the
 *    mural band from 11.2 to 13.5 m, the parapet above it (scaled to the
 *    lidar parapet). Estimated.
 *  - colour (daylight photos, pulled to the palette's lightness): buff
 *    brick sampled #84714d in sun (Barera 22, 25) -> #cfb886 (kept at the
 *    photo's low saturation so it reads buff, not orange); Cordova cream
 *    limestone #958e78 beside it -> #ece5d4; the crown light silver-white
 *    (#8e969e against sky, near white in sun) and the white dome and flat
 *    roofs (NAIP, Mabel 01) -> one roof white #e6e6e1; the louvres mid grey
 *    #5c6062, lighter in sun -> #a0a6aa; the tile mural (Highsmith, straight on) averages
 *    sage #757e70 over green ground, blue sky and tan figures -> #86a08a so
 *    the band reads as colour under the cream parapet.
 *  - plan check: USGS NAIP orthophoto (public domain): the white oval dome,
 *    the Auditorium's white hall roof and darker stage house.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Will_Rogers_Memorial_Center_June_2016_21_(Will_Rogers_Coliseum).jpg,
 *    _22_(Pioneer_Tower), _23_(Will_Rogers_Auditorium), _24_ and
 *    _25_(Pioneer_Tower), Michael Barera, CC BY-SA 4.0
 *  - Fort_Worth_Will_Rogers_Memorial_Center.jpg, Andreas Praefcke, CC BY
 *    3.0 (the Auditorium from the north-west, its hall roof and stage house)
 *  - Will_Rogers_Memorial_Center_01.jpg and _02.jpg, Joe Mabel, CC BY-SA
 *    3.0 (the group from the north, the Coliseum dome)
 *  - WillRogers1_(1_of_1).jpg and Will_Rogers_Memorial_Complex_1.jpg,
 *    Renelibrary (Rene Gomez), CC BY-SA 4.0 (the Auditorium and tower from
 *    the north-west)
 *  - WillRogersMemorialCenter1.jpg, CC BY-SA 2.5 (tower and Coliseum front)
 *  - Coliseum,_Memorial_Tower,_and_Auditorium_(20106176).jpg, Curt Teich &
 *    Company postcard, c. 1936, public domain (the composition)
 *  - Part_of_a_ceramic-tile_mural_..._LCCN2013650766.tif, Carol M.
 *    Highsmith, public domain (the mural's colours)
 * No look-only sources. No commercial imagery or 3D tiles.
 *
 * Simplified: the lidar shows the roof behind the Coliseum's front rising
 * to 18.8 m in a shallow vault; the model carries the dome's north end on
 * into the front block instead (within ~2 m), since a separate vault drew
 * a stone crescent over the front that no photo shows.
 *
 * Doubts: no licensed photo shows the south or the long sides of either
 * building, so the Coliseum's hall walls are plain brick with a stone
 * cornice and the stage house carries the stone strips Praefcke shows on
 * its west face on all three faces; the tower's south face is assumed to
 * match the others above the wings (the slot is seen on the north, east
 * and west faces); the crown's tier heights are from one photo. Night: no
 * night photo found, so only the windows glow and the tower and fronts get
 * a modest floodlight.
 *
 * Left out: the mural's figures, the flutes on the pylons, the medallions
 * and grilles on the pavilions, the flagpoles and floodlights on the
 * parapets, the lettering, the Tower Promenade canopy, the plazas.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { block, cap, chamfer, panel, rect, save, walls, type XY } from './chi-merchandise-mart'

const ANCHOR: [number, number] = [32.7458, -97.36613]
const BEARING = 0.9

// --- Heights (model z; 0 = lowest ground, east of the Coliseum) ------------
const G_COL = 1.2 // the plaza in front of the Coliseum
const G_AUD = 2.0 // the plaza in front of the Auditorium
const G_TOW = 1.4 // the tower's foot

const norm = (v: V3): V3 => { const l = Math.hypot(...v) || 1; return [v[0] / l, v[1] / l, v[2] / l] }

/** A quad a,b,c,d whose winding follows the normal n. */
function quadN(p: Part, a: V3, b: V3, c: V3, d: V3, n: V3 | V3[]) {
  const ns = Array.isArray(n[0]) ? (n as V3[]) : [n as V3, n as V3, n as V3, n as V3]
  p.tri(a, b, c, undefined, undefined, undefined, [ns[0], ns[1], ns[2]])
  p.tri(a, c, d, undefined, undefined, undefined, [ns[0], ns[2], ns[3]])
}
/** A rect from any two corners, counter-clockwise. */
const R = (x0: number, y0: number, x1: number, y1: number) => rect(Math.min(x0, x1), Math.min(y0, y1), Math.max(x0, x1), Math.max(y0, y1))
/** Split a ring's long edges into pieces no longer than `m` (for the terrain drape). */
function densify(r: XY[], m = 5): XY[] {
  const out: XY[] = []
  r.forEach((a, i) => {
    const b = r[(i + 1) % r.length], n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / m))
    for (let k = 0; k < n; k++) out.push([a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n])
  })
  return out
}
/** Walls only (no bevel) of a densified ring, plus a top cap. */
function prism(w: Part, top: Part | null, r: XY[], z0: number, z1: number, bevel = 0.3) {
  block(w, top, densify(r), z0, z1, bevel)
}
/** Points on the north side of a circle (centre c, radius r) from x0 to x1. */
function arcPts(c: XY, r: number, x0: number, x1: number, n: number): XY[] {
  const a0 = Math.acos((x0 - c[0]) / r), a1 = Math.acos((x1 - c[0]) / r)
  return Array.from({ length: n + 1 }, (_, i) => { const a = a0 + (a1 - a0) * i / n; return [c[0] + r * Math.cos(a), c[1] + r * Math.sin(a)] as XY })
}
/** A vertical curved strip on a circle about c, radius r, between x0 and x1, facing out. */
function arcStrip(p: Part, c: XY, r: number, x0: number, x1: number, z0: number, z1: number, n: number) {
  const pts = arcPts(c, r, x0, x1, n)
  for (let i = 0; i < n; i++) {
    const a = pts[i], b = pts[i + 1]
    const na = norm([a[0] - c[0], a[1] - c[1], 0]), nb = norm([b[0] - c[0], b[1] - c[1], 0])
    quadN(p, [a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1], [na, nb, nb, na])
  }
}
/** A box turned to face direction (ux, uy): centre (cx, cy), half-width along the face hw, depth from d0 to d1 along u. */
function facing(p: Part, top: Part | null, cx: number, cy: number, ux: number, uy: number, hw: number, d0: number, d1: number, z0: number, z1: number, bevel = 0.15) {
  const vx = -uy, vy = ux // along the face (to the left of u)
  const P = (s: number, d: number): XY => [cx + vx * s + ux * d, cy + vy * s + uy * d]
  // counter-clockwise from above: back-right, front-right... computed so the ring winds CCW
  const ring: XY[] = [P(hw, d0), P(-hw, d0), P(-hw, d1), P(hw, d1)]
  const area = ring.reduce((s, a, i) => { const b = ring[(i + 1) % 4]; return s + a[0] * b[1] - b[0] * a[1] }, 0)
  block(p, top, area > 0 ? ring : ring.reverse(), z0, z1, bevel)
}

/**
 * A 1936 mural front: the curved limestone face between two pavilions,
 * six pylons, five window bays with doors, the mural band and parapet.
 */
function front(o: { stone: Part; roof: Part; win: Part; mural: Part }, c: XY, r: number, x0: number, x1: number, yBack: number, g: number, parapet: number) {
  const depth = 1.6, soffit = g + 11.2, muralTop = g + 13.5
  // Body behind the pylons: back wall on r - depth.
  const recess = arcPts(c, r - depth, x0, x1, 14)
  const body: XY[] = [[x0, yBack], [x1, yBack], ...recess.slice().reverse()]
  prism(o.stone, o.roof, body, 0, parapet, 0.3)
  // The frieze over the pylons: a curved band from r - depth to r + 0.1.
  const inner = arcPts(c, r - depth, x0 + 0.05, x1 - 0.05, 14), outer = arcPts(c, r + 0.1, x0 + 0.05, x1 - 0.05, 14)
  const band: XY[] = [...inner.slice().reverse(), ...outer]
  // inner reversed runs west->east along the south edge; outer runs east->west... make it CCW
  const ring = band.reduce((s, a, i) => { const b = band[(i + 1) % band.length]; return s + a[0] * b[1] - b[0] * a[1] }, 0) > 0 ? band : band.slice().reverse()
  block(o.stone, o.roof, ring, soffit, parapet, 0.25)
  // The mural on the band's face, and its underside.
  arcStrip(o.mural, c, r + 0.16, x0 + 0.4, x1 - 0.4, soffit + 0.15, muralTop, 14)
  // Pylons and window bays.
  const pw = 2.6, n = 6, bay = (x1 - x0 - n * pw) / (n - 1)
  for (let k = 0; k < n; k++) {
    const xc = x0 + pw / 2 + k * (pw + bay)
    const yc = c[1] + Math.sqrt(r * r - (xc - c[0]) ** 2)
    const u = norm([xc - c[0], yc - c[1], 0])
    facing(o.stone, null, c[0] + u[0] * (r - depth / 2), c[1] + u[1] * (r - depth / 2), u[0], u[1], pw / 2, -depth / 2, depth / 2, 0, soffit + 0.05, 0.2)
  }
  for (let k = 0; k < n - 1; k++) {
    const xc = x0 + pw + bay / 2 + k * (pw + bay)
    const rr = r - depth + 0.05
    const yc = c[1] + Math.sqrt(rr * rr - (xc - c[0]) ** 2)
    const u = norm([xc - c[0], yc - c[1], 0]), v: XY = [-u[1], u[0]]
    const A = (s: number, z: number): V3 => [xc + v[0] * s, yc + v[1] * s, z]
    // glass-block window, then the door under its stone lintel
    quadN(o.win, A(1.15, g + 2.9), A(-1.15, g + 2.9), A(-1.15, g + 10.3), A(1.15, g + 10.3), u)
    quadN(o.win, A(0.95, 0), A(-0.95, 0), A(-0.95, g + 2.4), A(0.95, g + 2.4), u)
  }
}

function build() {
  const brick = new Part(), stone = new Part(), roof = new Part(), win = new Part(), mural = new Part(), louvre = new Part()
  const o = { stone, roof, win, mural }

  // ===== Coliseum ===========================================================
  // The dome: a stadium in plan, parabolic in section.
  const CX = 27.25, HW = 34.25, S0 = -34.75, S1 = 6, EAVE = 13.8, CROWN = 25.8
  const ringAt = (r: number): XY[] => {
    const pts: XY[] = [], seg = 12, side = 8
    for (let i = 0; i <= seg; i++) { const t = Math.PI + Math.PI * i / seg; pts.push([CX + r * Math.cos(t), S0 + r * Math.sin(t)]) }
    for (let i = 1; i < side; i++) pts.push([CX + r, S0 + (S1 - S0) * i / side])
    for (let i = 0; i <= seg; i++) { const t = Math.PI * i / seg; pts.push([CX + r * Math.cos(t), S1 + r * Math.sin(t)]) }
    for (let i = 1; i < side; i++) pts.push([CX - r, S1 - (S1 - S0) * i / side])
    return pts
  }
  // Walls: brick to a stone cornice.
  const wall = ringAt(HW)
  walls(brick, wall, 0, EAVE - 0.9)
  walls(stone, wall, EAVE - 0.9, EAVE)
  // Roof rings: d = r / HW from 1 to 0.12; z = eave + rise (1 - d^2).
  const ds = [1, 0.88, 0.74, 0.6, 0.45, 0.3, 0.12]
  const rise = CROWN - EAVE
  const rings = ds.map(d => ringAt(HW * d))
  const outward = (p: XY): XY => {
    const yy = Math.min(S1, Math.max(S0, p[1]))
    const dx = p[0] - CX, dy = p[1] - yy, l = Math.hypot(dx, dy) || 1
    return [dx / l, dy / l]
  }
  const nAt = (p: XY, d: number): V3 => { const u = outward(p), k = 2 * rise * d / HW; return norm([u[0] * k, u[1] * k, 1]) }
  for (let k = 0; k < rings.length - 1; k++) {
    const A = rings[k], B = rings[k + 1], zA = EAVE + rise * (1 - ds[k] ** 2), zB = EAVE + rise * (1 - ds[k + 1] ** 2)
    for (let i = 0; i < A.length; i++) {
      const j = (i + 1) % A.length
      quadN(roof, [A[i][0], A[i][1], zA], [A[j][0], A[j][1], zA], [B[j][0], B[j][1], zB], [B[i][0], B[i][1], zB],
        [nAt(A[i], ds[k]), nAt(A[j], ds[k]), nAt(B[j], ds[k + 1]), nAt(B[i], ds[k + 1])])
    }
  }
  cap(roof, rings[rings.length - 1], EAVE + rise * (1 - ds[ds.length - 1] ** 2))
  // The ridge monitor along the crown (lidar 30.4 m, 3 m wide).
  block(roof, roof, chamfer(R(CX - 1.5, -36.5, CX + 1.5, 5.5), 0.6), CROWN - 0.5, 28.7, 0.3)
  // Low annexes: west (3.5) and east (4.5) along the hall.
  prism(brick, roof, [[-23.7, 31], [-23.7, 23], [-15.4, 23], [-15.4, -36.1], [-12.4, -36.1], [-7.2, -50.7], [3.4, -62.1], [17.6, -68.3], [24, -60], [4, -38], [4, 31]], 0, 3.5, 0.25)
  prism(brick, roof, R(58, -37.2, 63.3, 29.2), 0, 4.5, 0.25)

  // The front block: pavilions, the curved mural front and the low vault behind.
  const CC: XY = [28.25, -5.3], CR = 55.8
  prism(brick, roof, [[2.2, 27], [11.1, 27], [11.1, 46.7], [7.1, 46.6], [7.1, 43.4], [4.4, 43.4], [2.2, 41.4]], 0, 16.3, 0.35)
  prism(brick, roof, [[45.4, 27], [60.5, 27], [60.5, 41.5], [53.9, 41.5], [53.9, 43.6], [49.3, 43.6], [49.3, 46.8], [45.4, 46.8]], 0, 16.3, 0.35)
  front(o, CC, CR, 11.1, 45.4, 27, G_COL, 15.6)
  // Pavilion windows: a tall window low on each front.
  for (const [xa, xb, y] of [[11.1, 7.1, 46.6], [49.3, 45.4, 46.8]] as [number, number, number][]) {
    panel(win, [xa, y], [xb, y], 1.4, 2.6, G_COL + 0.8, G_COL + 5.2, 0.05)
    panel(win, [xa, y], [xb, y], 1.6, 2.4, G_COL + 8.4, G_COL + 10.2, 0.05)
  }

  // ===== Auditorium =========================================================
  const AC: XY = [-68.1, -5.2], AR = 53.9
  prism(brick, roof, [[-89.2, 33], [-85.2, 33], [-85.2, 45.8], [-89.2, 44.8]], 0, 16.9, 0.35)
  prism(brick, roof, [[-50.9, 33], [-47, 33], [-47, 45], [-50.9, 46]], 0, 16.9, 0.35)
  front(o, AC, AR, -85.2, -50.9, 33, G_AUD, 15.6)
  for (const [xa, xb, y] of [[-85.2, -89.2, 44.8], [-47, -50.9, 45]] as [number, number, number][]) {
    panel(win, [xa, y], [xb, y], 1.2, 2.8, G_AUD + 0.8, G_AUD + 5.2, 0.05)
    panel(win, [xa, y], [xb, y], 1.5, 2.5, G_AUD + 8.4, G_AUD + 10.2, 0.05)
  }
  // The hall: brick walls to the eave and a shallow vault.
  prism(brick, null, R(-84, 2, -48, 40), 0, 14.2, 0)
  vault(roof, brick, -84, -48, 2, 40, 14.2, 18.9)
  // Side aisles and the low blocks beside the stage house.
  prism(brick, roof, [[-91.2, -4.2], [-84, -4.2], [-84, 33], [-91.2, 33]], 0, 4.8, 0.25)
  prism(brick, roof, R(-48, -12, -45.4, 33), 0, 4.8, 0.25)
  prism(brick, roof, R(-89.4, -12, -81, 2), 0, 4.8, 0.25)
  prism(brick, roof, R(-51, -12, -48, 2), 0, 4.8, 0.25)
  // The stage house and its fly block, with stone strips on its faces.
  prism(brick, roof, R(-81, -12, -51, 2), 0, 23.0, 0.35)
  prism(brick, roof, R(-70, -10, -60, -2), 22.6, 25.3, 0.3)
  const strips = (a: XY, b: XY, n: number) => {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    for (let k = 1; k <= n; k++) { const s = (L * k) / (n + 1); panel(stone, a, b, s - 0.45, s + 0.45, 6.5, 22.2, 0.08) }
  }
  strips([-81, 2], [-81, -12], 2) // west
  strips([-51, -12], [-51, 2], 2) // east
  strips([-81, -12], [-51, -12], 5) // south
  // The wings: west, and east toward the tower.
  prism(brick, roof, [[-102.1, 31.3], [-89.2, 31.3], [-89.2, 41.5], [-102.1, 41.4]], 0, 9.0, 0.3)
  wingWindows(win, [-89.2, 41.5], [-102.1, 41.4], G_AUD, 3)

  // ===== The wings either side of the tower =================================
  prism(brick, roof, [[-47, 30.7], [-26.5, 30.7], [-26.5, 43.3], [-32, 43.3], [-32, 41.8], [-47, 41.7]], 0, 8.5, 0.3)
  prism(brick, roof, R(-26.5, 30.7, -15.5, 36.4), 0, 8.5, 0.3)
  prism(brick, roof, [[-15.5, 31], [2.2, 31], [2.2, 41.4], [-10.1, 41.4], [-10.1, 43.3], [-15.5, 43.3]], 0, 8.2, 0.3)
  wingWindows(win, [-32, 41.8], [-47, 41.7], G_AUD, 3)
  wingWindows(win, [2.2, 41.4], [-10.1, 41.4], G_COL, 3)
  wingWindows(win, [-26.5, 43.3], [-32, 43.3], G_TOW, 1)
  wingWindows(win, [-10.1, 43.3], [-15.5, 43.3], G_TOW, 1)

  // ===== Pioneer Tower ======================================================
  tower({ brick, stone, roof, win, louvre }, -21, 42.15)

  // ===== Night ===============================================================
  const towerLit = (p: V3, n: V3) => (n[2] > 0.5 ? 0 : Math.abs(p[0] + 21) < 7 && Math.abs(p[1] - 42.15) < 7 ? 0.55 : 0.25)
  return [
    { part: brick, material: { ...finish('wr-brick', 0xcfb886), floodlight: towerLit } },
    { part: stone, material: { ...finish('wr-limestone', 0xece5d4), floodlight: towerLit } },
    { part: roof, material: finish('wr-roof', 0xe6e6e1) },
    { part: win, material: PALETTE.window },
    { part: mural, material: finish('wr-mural', 0x86a08a) },
    { part: louvre, material: finish('wr-louvre', 0xa0a6aa, 0.5) },
  ]
}

/** A barrel vault along y from y0 to y1 across x0..x1, eave z0 to crown z1 (parabolic), with gable ends. */
function vault(roof: Part, end: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number) {
  const n = 10, cx = (x0 + x1) / 2, hw = (x1 - x0) / 2
  const pt = (i: number): [number, number] => { const x = x0 + (x1 - x0) * i / n, d = (x - cx) / hw; return [x, z0 + (z1 - z0) * (1 - d * d)] }
  const nr = (i: number): V3 => { const x = x0 + (x1 - x0) * i / n, d = (x - cx) / hw; return norm([2 * (z1 - z0) * d / hw, 0, 1]) }
  const m = Math.max(1, Math.ceil((y1 - y0) / 8))
  for (let i = 0; i < n; i++) {
    const [xa, za] = pt(i), [xb, zb] = pt(i + 1)
    for (let k = 0; k < m; k++) {
      const ya = y0 + (y1 - y0) * k / m, yb = y0 + (y1 - y0) * (k + 1) / m
      quadN(roof, [xa, ya, za], [xb, ya, zb], [xb, yb, zb], [xa, yb, za], [nr(i), nr(i + 1), nr(i + 1), nr(i)])
    }
  }
  // Gable ends.
  for (const [y, s] of [[y0, -1], [y1, 1]] as [number, number][]) {
    for (let i = 0; i < n; i++) {
      const [xa, za] = pt(i), [xb, zb] = pt(i + 1)
      quadN(end, [xa, y, z0], [xb, y, z0], [xb, y, zb], [xa, y, za], [0, s, 0])
    }
  }
}

/** Tall windows on a wing's front, wall a->b (counter-clockwise, so outward is to the right). */
function wingWindows(win: Part, a: XY, b: XY, g: number, n: number) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), w = 1.3
  for (let k = 0; k < n; k++) { const s = (L * (k + 0.5)) / n; panel(win, a, b, s - w / 2, s + w / 2, g + 0.8, g + 4.8, 0.05) }
}

/** The Pioneer Tower, centred on (cx, cy). */
function tower(m: { brick: Part; stone: Part; roof: Part; win: Part; louvre: Part }, cx: number, cy: number) {
  const g = G_TOW, H = 5.6, P = 5.4, CORE = 4.75, STEP = 5.05
  const sq = (h: number, x = cx, y = cy) => R(x - h, y - h, x + h, y + h)
  // The limestone base, with a thin ledge at its top.
  block(m.stone, m.stone, sq(H), 0, g + 23.0, 0.2)
  // Brick core and corner piers.
  block(m.brick, null, sq(CORE), g + 23.0, g + 56.0, 0)
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
    const x0 = cx + sx * (P - 3.0), x1 = cx + sx * P, y0 = cy + sy * (P - 3.0), y1 = cy + sy * P
    block(m.brick, null, chamfer(R(x0, y0, x1, y1), 0.15), g + 23.0, g + 56.0, 0)
    // stone coping on the pier tops
    block(m.stone, m.stone, chamfer(R(x0 - sx * 0.1, y0 - sy * 0.1, x1 + sx * 0.1, y1 + sy * 0.1), 0.15), g + 56.0, g + 56.5, 0.12)
    // the pinnacle: a stepped stone shaft on each pier
    const px = cx + sx * 4.15, py = cy + sy * 4.15
    block(m.stone, m.stone, chamfer(R(px - 0.6, py - 0.6, px + 0.6, py + 0.6), 0.12), g + 56.5, g + 58.4, 0.1)
    block(m.stone, m.stone, chamfer(R(px - 0.38, py - 0.38, px + 0.38, py + 0.38), 0.1), g + 58.4, g + 59.1, 0.1)
  }
  // Each face: the two steps beside the piers, the louvred slot and its
  // stepped stone head, the stone fin up the upper core.
  for (let f = 0; f < 4; f++) {
    const t = (f * Math.PI) / 2, ux = Math.cos(t), uy = Math.sin(t), vx = -uy, vy = ux
    const Pt = (s: number, d: number): XY => [cx + vx * s + ux * d, cy + vy * s + uy * d]
    const box = (part: Part, top: Part | null, s0: number, s1: number, d0: number, d1: number, z0: number, z1: number, bevel = 0) => {
      const ring: XY[] = [Pt(s0, d0), Pt(s1, d0), Pt(s1, d1), Pt(s0, d1)]
      const area = ring.reduce((s, a, i) => { const b = ring[(i + 1) % 4]; return s + a[0] * b[1] - b[0] * a[1] }, 0)
      block(part, top, area > 0 ? ring : ring.reverse(), z0, z1, bevel)
    }
    for (const s of [-1, 1]) box(m.brick, null, s * 1.75, s * 2.4, CORE - 0.1, STEP, g + 23.0, g + 56.0)
    // the slot, on the core face (normal u)
    const A = (s: number, z: number): V3 => { const [x, y] = Pt(s, CORE + 0.04); return [x, y, z] }
    quadN(m.louvre, A(0.9, g + 27.0), A(-0.9, g + 27.0), A(-0.9, g + 52.3), A(0.9, g + 52.3), [ux, uy, 0])
    box(m.stone, m.stone, -1.75, 1.75, CORE - 0.1, CORE + 0.3, g + 52.3, g + 54.0, 0.1)
    box(m.stone, m.stone, -1.0, 1.0, CORE - 0.1, CORE + 0.3, g + 54.0, g + 55.0, 0.1)
    // fin from the head up the upper core to the first crown tier
    box(m.stone, m.stone, -0.32, 0.32, 3.4, 3.95, g + 55.0, g + 59.95, 0.08)
    // The north (front) face: the entrance, a tall glass-block window over
    // the doors in a stone surround (only the front is open: the wings and
    // the block behind cover the other faces' feet).
    if (f === 1) {
      const B = (s: number, z: number): V3 => { const [x, y] = Pt(s, H + 0.04); return [x, y, z] }
      quadN(m.win, B(0.8, g + 3.4), B(-0.8, g + 3.4), B(-0.8, g + 13.6), B(0.8, g + 13.6), [ux, uy, 0])
      quadN(m.win, B(1.0, 0), B(-1.0, 0), B(-1.0, g + 2.8), B(1.0, g + 2.8), [ux, uy, 0])
      for (const s of [-1, 1]) box(m.stone, m.stone, s * 1.5, s * 2.1, H - 0.05, H + 0.3, 0, g + 14.4, 0.08)
      box(m.stone, m.stone, -2.1, 2.1, H - 0.05, H + 0.3, g + 14.4, g + 15.0, 0.08)
    }
  }
  // Upper core and the white crown.
  block(m.brick, null, sq(CORE), g + 56.0, g + 56.6, 0)
  block(m.brick, m.brick, chamfer(sq(3.65), 0.3), g + 56.6, g + 58.7, 0.05)
  const tiers: [number, number, number, number][] = [[3.95, 1.05, 58.7, 59.95], [3.35, 0.9, 59.95, 61.15], [2.9, 0.8, 61.15, 62.5]]
  for (const [h, c, z0, z1] of tiers) block(m.roof, m.roof, chamfer(sq(h), c), g + z0, g + z1, 0.12)
  // small windows in the top tier
  for (let f = 0; f < 4; f++) {
    const t = (f * Math.PI) / 2, ux = Math.cos(t), uy = Math.sin(t), vx = -uy, vy = ux
    const C = (s: number, z: number): V3 => [cx + vx * s + ux * 2.94, cy + vy * s + uy * 2.94, z]
    quadN(m.win, C(0.6, g + 61.5), C(-0.6, g + 61.5), C(-0.6, g + 62.1), C(0.6, g + 62.1), [ux, uy, 0])
  }
  // low pyramid roof and the lantern
  const top = chamfer(sq(2.78), 0.75), lid = chamfer(sq(1.0), 0.25)
  const t0 = top.map(([x, y]) => [x, y, g + 62.5] as V3)
  // pyramid: loft the octagon to a small square-ish ring of equal length
  const ringTo = top.map(([x, y]) => { const dx = x - cx, dy = y - cy, l = Math.max(Math.abs(dx), Math.abs(dy)) || 1; return [cx + dx / l * 1.0, cy + dy / l * 1.0, g + 63.0] as V3 })
  for (let i = 0; i < t0.length; i++) {
    const j = (i + 1) % t0.length
    const mid: V3 = [(t0[i][0] + t0[j][0]) / 2 - cx, (t0[i][1] + t0[j][1]) / 2 - cy, 0]
    const nn = norm([mid[0], mid[1], 3.5])
    quadN(m.roof, t0[i], t0[j], ringTo[j], ringTo[i], nn)
  }
  cap(m.roof, ringTo.map(([x, y]) => [x, y] as XY), g + 63.0)
  block(m.roof, m.roof, lid, g + 63.0, g + 63.4, 0.08)
}

if (import.meta.main) await save('dal-will-rogers-memorial-center', 'Will Rogers Memorial Center', ANCHOR, BEARING, build(), 6500)
