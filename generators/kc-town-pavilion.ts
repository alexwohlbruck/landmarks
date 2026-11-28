/**
 * Town Pavilion (1986, HNTB), 1111 Main Street, Kansas City, Missouri, with
 * the retail podium and atrium that share its OSM outline — original
 * procedural geometry, CC0-1.0.
 * bun generators/kc-town-pavilion.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground. Anchor = centroid of OSM way/132570890, -94.5826200
 * 39.1005482; walls at 2° (the downtown grid), catalog bearing 2.
 * Elevation 0.
 *
 * Identity, in order: a broad slab of reflective blue glass, crossed on
 * every face by a pale granite spine with punched windows; each spine rises
 * past the glass roof into a gabled top (three tall windows under the
 * north and south gables, the old TRANSAMERICA sign on the south one);
 * behind them the hipped pyramid with its spire, lit at night; the
 * granite-and-glass retail podium around the tower's foot.
 *
 * Note for the lead: the assignment called this a silver-grey glass tower
 * with a tiered pyramidal crown. The evidence agrees on the glass and the
 * pyramid, and adds the granite spines and their gables, which are what
 * people know it by (the gabled crown described for One Kansas City Place
 * is this building's, or 1201 Walnut's).
 *
 * Evidence
 * - OSM way/132570890 (the whole complex outline, Q7829998) and the tower
 *   part way/466813909 (180 m, 38 levels). The outline is the model's: the
 *   podium is drawn over all of it and no further. OSM rings are turned by
 *   the bearing into the model's frame, so the podium stops at the party
 *   walls of Harzfeld's (way/195846009) and the Boley Building
 *   (way/466815004), which stay the map's; no windows on those walls.
 * - USGS 3DEP lidar MO_FEMANRCS_1_2020 (2020 flight), 1 m, read at bearing
 *   2. Heights above the lowest ground (266.9 m NAVD88), measured: tower
 *   glass roof 142.5 over x -21..37.5, y -23..20.5; the north-south spine's
 *   gabled roof, eaves 149, ridge 155, x -9.5..9.5 over the full depth; the
 *   east-west spine flat at 149, y -9..7, with gable ends to 155 at both
 *   faces; the pyramid's base block ±12.5 m about (0, -1) to 157.5, apex
 *   171; the spire 175.5. Published 180 m (591 ft), 38 floors (Wikipedia,
 *   CTBUH). Podium: ~18 m over the west and south-west, 27 m over the
 *   north-east wing and the block south-east of the tower (which follows
 *   the Boley Building's north wall), the atrium
 *   between them a glazed gable (eaves ~19, ridge ~26).
 * - Photos: "Town Pavilion KCMO.jpg" (User:Charvex, public domain; from the
 *   south: the spine ~18 m wide, left of centre, its gable and three
 *   windows, the glass, the pyramid and spire behind), "TownPavillion.jpg"
 *   (Hello2020121212, CC BY-SA 4.0; from the south-east at 12th and Main:
 *   two spines and gables, the granite podium with its arched windows),
 *   "One Kansas City Place Complex and Town Pavilion.JPG" (Baylor98,
 *   CC BY-SA 4.0; from the south-east, with the circular emblem in the
 *   east gable), "Town Pavilion.JPG" (Little Mountain 5, CC BY-SA 3.0).
 * - Estimated: storey 3.75 m, the spines' window bays (5 across, two-storey
 *   groups), the gable windows, the podium's window bands, the atrium's
 *   ridge line.
 *
 * Night: the glass and the spines' windows are `window`/`window-2` (lit
 * offices); the gables, the pyramid and the spire are floodlit
 * (`_FLOODLIGHT`), as the crown is lit at night.
 *
 * Left out: the TRANSAMERICA letters and the emblem, the glass's
 * horizontal mullions beyond a pale line every three storeys, the podium's
 * cornices and arches (drawn as plain panels).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { block, cap, rect, save, walls, inset, turn, type XY } from './chi-aon-center'
import { Tower, groups } from './kc-power-and-light-building'
import { hipRoof } from './chi-board-of-trade'

const BEARING = 2

function build() {
  const glass = new Part(), granite = new Part(), win = new Part(), roof = new Part(), trim = new Part(), atrium = new Part()
  const T = new Tower(granite, roof, win)

  // --- podium over the whole outline (OSM way/132570890, counter-clockwise)
  // OSM rings are measured north-up about the anchor; W() turns them into
  // the model's frame (the placement turns the model 2° clockwise).
  const W = (r: XY[]) => turn(r, BEARING)
  const outline: XY[] = W(([[0.6, 39.0], [1.1, 51.4], [9.2, 51.1], [9.3, 53.4], [36.0, 52.4], [39.0, 49.0], [37.8, 16.6], [36.1, -22.1], [36.0, -26.8], [35.9, -29.0], [35.9, -31.2], [35.8, -33.8], [6.6, -32.9], [6.3, -42.6], [1.6, -42.4], [1.2, -55.1], [-3.3, -55.0], [-3.3, -56.4], [-7.7, -56.2], [-22.0, -55.6], [-21.8, -52.3], [-24.0, -53.9], [-26.4, -55.7], [-33.5, -55.4], [-37.6, -50.8], [-37.3, -43.0], [-33.3, -39.4], [-37.0, -39.2], [-35.6, -5.0], [-33.8, 40.4]] as XY[]).reverse())
  // The neighbours (OSM way/195846009 Harzfeld's, way/466815004 Boley),
  // only so no window is drawn on the party walls; not drawn.
  const harzfeld = W([[-33.2, 55.0], [-26.1, 54.7], [1.2, 53.6], [1.1, 51.4], [0.6, 39.0], [-33.8, 40.4]].reverse() as XY[])
  const boley = W([[35.0, -60.5], [1.1, -59.4], [1.2, -55.1], [1.6, -42.4], [6.3, -42.6], [6.6, -32.9], [35.8, -33.8]].reverse() as XY[])
  const TX0 = -21, TX1 = 37.5, TY0 = -23, TY1 = 20.5
  const towerRing = rect(TX0, TY0, TX1, TY1)
  T.mass(outline, 0, 18, 0.4)
  // the 27 m wings: north-east of the tower, and between it and the Boley
  // Building (following Boley's north wall and the outline's east side)
  const ne: XY[] = W([[1.1, 20], [37.9, 20], [38.9, 49], [36, 52.4], [9.3, 53.4], [9.2, 51.1], [1.1, 51.4]])
  T.mass(ne, 18, 27, 0.4)
  const se: XY[] = W([[6.6, -32.9], [35.8, -33.8], [36.1, -22.5], [6.6, -22.5]])
  T.mass(se, 18, 27, 0.4)
  T.masses.push({ r: harzfeld, z0: 0, z1: 45 }, { r: boley, z0: 0, z1: 30 })
  // the atrium: glazed gables either side of the tower, x -9..0.6 north-up
  for (const [y0, y1] of [[20, 39], [-45, -22.5]]) {
    const x0 = -9, x1 = 0.6, xr = -3, e = 18, r = 25.5
    const q = (x: number, y: number, z: number): V3 => { const [[a, b]] = W([[x, y]]); return [a, b, z] }
    atrium.quad(q(x0, y0, e), q(xr, y0, r), q(xr, y1, r), q(x0, y1, e))
    atrium.quad(q(xr, y0, r), q(x1, y0, e), q(x1, y1, e), q(xr, y1, r))
    atrium.tri(q(x0, y0, e), q(x1, y0, e), q(xr, y0, r))
    atrium.tri(q(x1, y1, e), q(x0, y1, e), q(xr, y1, r))
  }
  T.masses.push({ r: towerRing, z0: 18, z1: 142.5 })
  T.windows(outline, [[4, 8.5], [10.5, 16]], { bay: 6, fill: 0.62, end: 2, minLen: 8 })
  T.windows(ne, [[20, 25.5]], { bay: 6, fill: 0.62, end: 2, minLen: 8 })
  T.windows(se, [[20, 25.5]], { bay: 6, fill: 0.62, end: 2, minLen: 8 })

  // --- the glass tower
  walls(glass, towerRing, 18, 141.6)
  block(trim, roof, towerRing, 141.6, 142.5, 0.3)
  const STOREY = 3.75
  for (let z = 18 + 3 * STOREY; z < 140; z += 3 * STOREY) walls(trim, inset(towerRing, -0.05), z, z + 0.3)

  // --- the granite spines, 0.5 m proud of the glass, with their tops
  const SX = 9.5, EY0 = -9, EY1 = 7, P = 0.5, EAVE = 149, RIDGE = 155
  const south = rect(-SX, TY0 - P, SX, TY0), north = rect(-SX, TY1, SX, TY1 + P)
  const east = rect(TX1, EY0, TX1 + P, EY1), west = rect(TX0 - P, EY0, TX0, EY1)
  for (const r of [south, north, east, west]) { walls(granite, r, 18, EAVE); T.masses.push({ r, z0: 18, z1: EAVE }) }
  // the east-west spine's flat top over the roof, and the north-south one
  const nsBar = rect(-SX, TY0 - P, SX, TY1 + P)
  walls(glass, rect(TX0, EY0, TX1, EY1), 142.5, EAVE - 0.6); block(trim, roof, rect(TX0, EY0, TX1, EY1), EAVE - 0.6, EAVE, 0.25)
  walls(granite, nsBar, 142.5, EAVE)
  // north-south pitched roof, gables on the north and south faces
  roof.quad([SX, TY0 - P, EAVE], [SX, TY1 + P, EAVE], [0, TY1 + P, RIDGE], [0, TY0 - P, RIDGE])
  roof.quad([-SX, TY1 + P, EAVE], [-SX, TY0 - P, EAVE], [0, TY0 - P, RIDGE], [0, TY1 + P, RIDGE])
  granite.tri([-SX, TY0 - P, EAVE], [SX, TY0 - P, EAVE], [0, TY0 - P, RIDGE])
  granite.tri([SX, TY1 + P, EAVE], [-SX, TY1 + P, EAVE], [0, TY1 + P, RIDGE])
  // east-west gable walls standing at the two ends (1.2 m thick)
  for (const [xo, xi] of [[TX1 + P, TX1 - 0.7], [TX0 - P, TX0 + 0.7]]) {
    const cy = (EY0 + EY1) / 2, outward = xo > xi
    const a: V3 = [xo, EY0, EAVE], b: V3 = [xo, EY1, EAVE], c: V3 = [xo, cy, RIDGE]
    const a2: V3 = [xi, EY0, EAVE], b2: V3 = [xi, EY1, EAVE], c2: V3 = [xi, cy, RIDGE]
    if (outward) { granite.tri(a, b, c); granite.tri(b2, a2, c2); granite.quad(b, b2, c2, c); granite.quad(a2, a, c, c2) }
    else { granite.tri(b, a, c); granite.tri(a2, b2, c2); granite.quad(a, a2, c2, c); granite.quad(b2, b, c, c2) }
  }
  // the pyramid's base block, the hipped pyramid and the spire
  const PX = 0, PY = -1, PH = 12.5
  block(granite, null, rect(PX - PH, PY - PH, PX + PH, PY + PH), 142.5, 157.5, 0.35)
  hipRoof(roof, PX - PH + 0.35, PY - PH + 0.35, PX + PH - 0.35, PY + PH - 0.35, 157.5, 171, 0)
  {
    const s = (h: number) => rect(PX - h, PY - h, PX + h, PY + h)
    walls(trim, s(0.45), 169, 172.5); cap(trim, s(0.45), 172.5)
    walls(trim, s(0.2), 172.5, 175.5, s(0.05))
  }

  // spine windows: five bays, two-storey groups; the gables' three tall lights
  const G = groups(20, 140.5, STOREY, 2, 1.4)
  for (const r of [south, north, east, west]) T.windows(r, G, { bay: 3.6, fill: 0.6, end: 0.9, minLen: 10, part: win })
  for (const [y, s] of [[TY0 - P - 0.06, -1], [TY1 + P + 0.06, 1]] as [number, number][]) {
    for (const x of [-4.2, 0, 4.2]) {
      const h = x === 0 ? 151.5 : 149.5, w = 1.5
      const q: V3[] = [[x - w, y, 143.5], [x + w, y, 143.5], [x + w, y, h], [x - w, y, h]]
      if (s < 0) win.quad(q[0], q[1], q[2], q[3]); else win.quad(q[1], q[0], q[3], q[2])
    }
  }

  // Night: the crown (gables, pyramid, spire) is floodlit.
  const crown = (p: V3, n: V3) => (p[2] > 141 ? (n[2] > 0.7 ? 0.5 : 0.9) : 0)
  return [
    { part: glass, material: { ...PALETTE.window, color: 0x7896b6 } },
    { part: win, material: windowVariant(2, 0x5f7488) },
    { part: granite, material: { ...finish('pavilion-granite', 0xd8d2c7), floodlight: crown } },
    { part: roof, material: { ...PALETTE.roof, floodlight: crown } },
    { part: trim, material: { ...finish('silver-mullion', 0xc9d2db, 0.5), floodlight: crown } },
    { part: atrium, material: PALETTE.glass },
  ]
}

if (import.meta.main) await save('kc-town-pavilion', 'Town Pavilion', [39.1005482, -94.58262], BEARING, build(), 6500)
