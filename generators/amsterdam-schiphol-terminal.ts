/**
 * Amsterdam Airport Schiphol, the terminal building — procedural, CC0-1.0, no
 * textures. bun generators/amsterdam-schiphol-terminal.ts
 *
 * Writes models/amsterdam-schiphol-terminal.glb (low) and
 * models/amsterdam-schiphol-terminal.detail.glb (detail: the whole terminal
 * again, with mullion lines on the glass, more canopy trees and rooftop
 * plant).
 *
 * This file also holds the shared Schiphol kit (materials, facades, gate
 * piers, jet bridges, canopy trees) that amsterdam-schiphol-piers-b-c-d.ts
 * and amsterdam-schiphol-piers-e-h.ts import; its own build runs only under
 * import.meta.main.
 *
 * Map frame: x = east, y = north, z up, metres; bearing 0 (the wings run
 * within 3 degrees of east–west and north–south). Anchor: the area centroid
 * of the two OSM terminal outlines, 4.762773, 52.309903.
 *
 * What it is (OSM, checked against the indoor relations Departures 1/2/3
 * relation/20108343, 20108342, 20108344 and Arrivals 1–4): one terminal
 * mapped as two outlines.
 * - way/268641398 (building=airport_terminal, height 13): the L of the
 *   departure halls: Departures 3 along the north (x −235…−40), Departures 1
 *   and 2 down the east side (x 110…200), with the lounges behind them and
 *   the piers' roots (E at the north-east corner, F and G to the north).
 * - way/268641343 (height 9.4): the lower landside block in the crook of the
 *   L: Schiphol Plaza (over the station) and the arrivals halls, whose long
 *   south-west face, angled at about 38 degrees, is the main entrance under
 *   the big canopy with the "Schiphol" lettering.
 * - On top: the dark office block along Departures 3 (the black box with
 *   "Schiphol" lettering seen from the tower and the apron), OSM parts
 *   way/521074359–362 (32 m) with pale cores way/521074357, 358, 363 (36 m);
 *   the raised roofs over Departures 1/2, way/521074365, 366, 368
 *   (13–16 m) and way/521074367 (13–22 m).
 * Not part of this model: the 1967 terminal and old tower south of
 * Departures 1 (way/268641352, a separate OSM building), the Sheraton, the
 * Privium building, the station's bus and taxi shelters (building=roof
 * ways 1172528203–211, 1450228304) and the piers (their own models).
 *
 * Identifying features (photos): a long, low, flat-roofed hall in light grey
 * metal panels with broad blue-grey glass bands; the Plaza entrance's tall
 * full-height glass curtain wall under a thin eave that cantilevers forward
 * and rises outward, held on green steel
 * "tree" columns (a post with four raking arms); the dark box with lettering
 * standing above the roofs; light grey roofs with plant.
 *
 * Evidence
 * - OSM: the ways above (all replaced), roof:colour lightgrey.
 * - Photos (Wikimedia Commons; author, licence):
 *   https://commons.wikimedia.org/wiki/File:Amsterdam_Schiphol_Airport_entry.jpg
 *     (Amin, CC BY-SA 4.0), .../File:Amsterdam_Schiphol_Airport_entrance.jpg
 *     (Cjh1452000, CC BY-SA 3.0), .../File:Amsterdam_Airport_Schiphol_Front.jpg
 *     (SElefant, CC BY-SA 3.0), .../File:SCHIPHOL_-_panoramio.jpg (Mirosław
 *     Wichowski, CC BY-SA 3.0), .../File:Schiphol_Airport_02.JPG (Hide-sp,
 *     CC BY-SA 3.0), .../File:Schiphol_airport_and_train_station_-_Amsterdam_-_February_2010_-_panoramio.jpg
 *     (StevenL, CC BY-SA 3.0): the Plaza entrance, the glass wall, the
 *     canopy and its green tree columns, colours;
 *   https://commons.wikimedia.org/wiki/File:Schiphol_Plaza.jpg (Steven Lek,
 *     CC BY-SA 4.0) the forecourt at night;
 *   https://commons.wikimedia.org/wiki/File:Schiphol_Tower.jpg (Ikreis, CC BY-SA
 *     4.0) the east side and roofs from high up;
 *   https://commons.wikimedia.org/wiki/File:EHAM_Terminal_E.jpg (Mark Brouwer,
 *     CC BY-SA 2.5) the dark office block from the tower;
 *   https://commons.wikimedia.org/wiki/File:SCHIPHOL_PIER_E_-_panoramio.jpg and
 *     .../File:SCHIPHOL_CONTROL_TOWER_,_PIER_D_-_panoramio.jpg (Kayhan
 *     ERTUGRUL, CC BY-SA 3.0) the airside: the long low glass front, the
 *     dark block with its pale cores standing above;
 *   https://commons.wikimedia.org/wiki/File:Ams-above-2007.jpg (Fyodor
 *     Borisov, CC BY-SA 3.0) the whole complex from the south-east.
 * - Terrain: Mapterhorn z14 flat to ±0.5 m over the site (z15 tiles 404).
 * - No lidar; 3D BAG not used (3D city model).
 *
 * Numbers: heights from OSM (13, 9.4, 16, 22, 32, 36), except the Plaza
 * front. Review round 1: Cjh1452000's and Hide-sp's photos show the Plaza
 * front as one continuous glass curtain wall from the forecourt right up
 * under the roof edge, about 15–18 m (people for scale), with the roof
 * cantilevering forward over it as a thin, sloped, slatted eave. So a 22 m
 * deep band of way/268641343 along that face is raised to 16.5 m (estimated)
 * though OSM gives the block 9.4 m, and its walls are one light grey-blue
 * glass skin (`window-2`, #a9bfd1) with slim pale mullion lines every 7.2 m
 * (3.6 m in the detail model) and floor lines every 6 m. The other landside
 * (south- to west-facing) walls of the halls take the same curtain wall;
 * the airside walls keep two broad glass bands (0.6–3.6 m and 4.8–11.4 m,
 * 7.2 m bays). The eave overhangs 9 m, its inner edge at 16.3 m rising to
 * 17.9 m, 0.35 m thick, its top drawn in roof grey (the slats, as ribs in
 * the detail model) and its underside pale; eight green trees 5 m out,
 * posts 10.5 m to four raking arms that reach 6.5 m along and 3.5 m
 * across. The dark block is drawn solid without window panels: from the
 * apron and the tower it reads as one black box (ERTUGRUL's and Brouwer's
 * photos).
 * Night: the glass is `window`/`window-2` and glows; the dark block stays
 * dark.
 * Doubts: the eave's depth and the number of trees (the OSM facade has
 * round bumps that look like their bases, which the model follows loosely);
 * the Plaza front's 16.5 m and the 22 m depth of the raised band are read
 * from photos, not OSM; the airside fronts of Departures 1–3 are photographed
 * only from far off; the "Schiphol" letters (on the Plaza front and the dark
 * box) are left out.
 */
import { Part, type V3, type MaterialSpec } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { type XY, type Facade, quadN, unit, capPoly } from './nyc-570-lexington'
import { zoneMass, drum, beam, prismRing, writeLod, newMats, despur, simplify, type Mats, type Zone } from './tokyo-haneda-terminal-1'
import { strut } from './atl-hartsfield-jackson-domestic-terminal'

export type { XY, Mats, Zone }
export { zoneMass, drum, beam, prismRing, writeLod, despur, simplify, strut, quadN, unit, capPoly }

// ===========================================================================
// Schiphol kit
// ===========================================================================

/** Colours from the daylight photos, pulled to the palette's lightness. */
export const AMS = {
  roof: finish('ams-roof', 0xbec3c6),
  panel: finish('ams-panel', 0xdfe1e0),
  window: { name: 'window', color: 0x8fa5b3, roughness: 0.35 } as MaterialSpec,
  dark: finish('ams-dark', 0x51565d),
  steel: finish('ams-steel', 0x6e968b),
  glass: PALETTE.glass as MaterialSpec,
}
export const amsMats = (): Mats => { const M = newMats(['roof', 'wall', 'win', 'dark', 'steel', 'glass']); M.trim = M.wall; return M }
export const amsParts = (M: Mats, roof: MaterialSpec = AMS.roof) => [
  { part: M.roof, material: roof },
  { part: M.wall, material: AMS.panel },
  { part: M.win, material: AMS.window },
  { part: M.dark, material: AMS.dark },
  { part: M.steel, material: AMS.steel },
  { part: M.glass, material: AMS.glass },
]

/** Facades: broad glass bands between grey panel piers and spandrels. */
export const F_HALL: Facade = { bay: 7.2, ratio: 0.86, floor: 4.8, group: 1, spandrel: 1.2, sill: 0.9, head: 1.5, ground: 0.6, minLength: 6, margin: 0.8 }
export const F_GLASS: Facade = { bay: 7.2, ratio: 0.97, floor: 7, group: 1, spandrel: 0, sill: 0.5, head: 0.8, ground: 0.4, minLength: 5, margin: 0.4 }
export const F_PIER: Facade = { bay: 6, ratio: 0.9, floor: 3.6, group: 1, spandrel: 0.9, sill: 0.9, head: 0.7, ground: 1.0, minLength: 5, margin: 0.6 }
/** The low model's pier facade: the same bands in 13 m bays, so a kilometre of pier stays in budget. */
export const F_PIER_LOW: Facade = { ...F_PIER, bay: 13, ratio: 0.94, minLength: 9 }
export const F_DARK: Facade = { bay: 6, ratio: 0.9, floor: 3.4, group: 2, spandrel: 1.4, sill: 1.0, head: 1.6, minLength: 6, margin: 1 }
/** The landside curtain wall: one glass skin, slim pale mullion and floor lines only (the gaps between panels). */
export const F_CURTAIN: Facade = { bay: 7.2, ratio: 0.97, floor: 3, group: 2, spandrel: 0.3, sill: 0.25, head: 0.3, ground: 0.2, minLength: 1.2, margin: 0.05 }
export const F_CURTAIN_FINE: Facade = { ...F_CURTAIN, bay: 3.6, ratio: 0.955 }
export const F_CLERE: Facade = { bay: 6, ratio: 0.9, floor: 2.2, group: 1, spandrel: 0, sill: 0.4, head: 0.6, minLength: 5, margin: 0.6 }

/** Thin vertical mullion lines on a straight glazed wall a→b (ccw ring order, so it faces out). */
export function mullions(p: Part, a: XY, b: XY, z0: number, z1: number, step: number, w = 0.22, out = 0.1) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]); if (L < step) return
  const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: V3 = [u[1], -u[0], 0]
  const k = Math.round(L / step)
  for (let i = 1; i < k; i++) {
    const s = (L * i) / k, c: XY = [a[0] + u[0] * s + n[0] * out, a[1] + u[1] * s + n[1] * out]
    quadN(p, [c[0] - u[0] * w / 2, c[1] - u[1] * w / 2, z0], [c[0] + u[0] * w / 2, c[1] + u[1] * w / 2, z0], [c[0] + u[0] * w / 2, c[1] + u[1] * w / 2, z1], [c[0] - u[0] * w / 2, c[1] - u[1] * w / 2, z1], [n, n, n, n])
  }
}

/** A sloped slab: a thin plate between two lines (inner a0→a1 at z0, outer b0→b1 at z1), thickness t. */
export function plate(top: Part, under: Part, edge: Part, a0: XY, a1: XY, b0: XY, b1: XY, z0: number, z1: number, t: number) {
  const T = (p: XY, z: number): V3 => [p[0], p[1], z]
  const e1: V3 = [a1[0] - a0[0], a1[1] - a0[1], 0], e2: V3 = [b0[0] - a0[0], b0[1] - a0[1], z1 - z0]
  let n = unit([e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]])
  if (n[2] < 0) n = [-n[0], -n[1], -n[2]]
  const dn: V3 = [-n[0], -n[1], -n[2]]
  quadN(top, T(a0, z0), T(a1, z0), T(b1, z1), T(b0, z1), [n, n, n, n])
  quadN(under, T(a0, z0 - t), T(b0, z1 - t), T(b1, z1 - t), T(a1, z0 - t), [dn, dn, dn, dn])
  for (const [p, q, za, zb] of [[b0, b1, z1, z1], [a1, b1, z0, z1], [a0, b0, z0, z1]] as [XY, XY, number, number][]) {
    edge.quad(T(p, za - t), T(q, zb - t), T(q, zb), T(p, za)); edge.quad(T(q, zb - t), T(p, za - t), T(p, za), T(q, zb))
  }
}

/** A canopy "tree": a round post to zFork, then four raking arms to the canopy underside. */
export function tree(p: Part, c: XY, u: XY, zFork: number, arms: [number, number, number][], r = 0.4, detail = false) {
  drum(p, c[0], c[1], r, r * 0.85, 0, zFork, detail ? 10 : 6, null)
  const n: XY = [-u[1], u[0]]
  for (const [s, t, z] of arms) strut(p, [c[0], c[1], zFork - 0.3], [c[0] + u[0] * s + n[0] * t, c[1] + u[1] * s + n[1] * t, z], detail ? 0.3 : 0.38)
}

/**
 * A fixed jet-bridge link: a glazed box from the pier wall (root) out to a
 * rotunda/cab on a post, at gate level, as the photos show at every
 * Schiphol pier (white links, a stair tower at the cab).
 */
export function jetBridge(M: Mats, root: XY, dir: XY, len: number, z0: number, z1: number, detail: boolean, w = 3.2) {
  const L = Math.hypot(dir[0], dir[1]), u: XY = [dir[0] / L, dir[1] / L]
  const end: XY = [root[0] + u[0] * len, root[1] + u[1] * len]
  beam(M.wall, root, end, w, z0, z1, true)
  // cab: a small box across the end, on a post
  const n: XY = [-u[1], u[0]]
  const c0: XY = [end[0] - u[0] * 1.6, end[1] - u[1] * 1.6], c1: XY = [end[0] + u[0] * 2.4, end[1] + u[1] * 2.4]
  beam(M.wall, c0, c1, w + 1.6, z0 - 0.4, z1 + 0.4, true)
  drum(M.steel, end[0], end[1], 0.45, 0.45, 0, z0 - 0.4, 6, null)
  if (detail) {
    // the glazed band along both sides and a stair tower beside the cab
    for (const sg of [1, -1]) {
      const off = (w / 2 + 0.05) * sg
      const p0: XY = [root[0] + n[0] * off + u[0] * 0.8, root[1] + n[1] * off + u[1] * 0.8], p1: XY = [end[0] + n[0] * off - u[0] * 1.8, end[1] + n[1] * off - u[1] * 1.8]
      const za = z0 + 0.9, zb = z1 - 0.5, nn: V3 = [n[0] * sg, n[1] * sg, 0]
      quadN(M.win, [p0[0], p0[1], za], [p1[0], p1[1], za], [p1[0], p1[1], zb], [p0[0], p0[1], zb], [nn, nn, nn, nn])
    }
    const st: XY = [end[0] + n[0] * 4, end[1] + n[1] * 4]
    prismRing(M.steel, [[st[0] - 1.3, st[1] - 1.3], [st[0] + 1.3, st[1] - 1.3], [st[0] + 1.3, st[1] + 1.3], [st[0] - 1.3, st[1] + 1.3]], 0, z1 - 0.2, M.roof)
  }
  return end
}


/** Inside test for a plan ring. */
export function inRing(pt: XY, poly: XY[]) {
  let hit = false
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const a = poly[i], b = poly[j]
    if ((a[1] > pt[1]) !== (b[1] > pt[1]) && pt[0] < ((b[0] - a[0]) * (pt[1] - a[1])) / (b[1] - a[1]) + a[0]) hit = !hit
  }
  return hit
}

/**
 * A row of jet bridges along a pier wall a→b of `ring`: one every `every`
 * metres, `skip` metres clear of each end, pointing straight out of the
 * building, `len` long, the link's floor at z0 and roof at z1.
 */
export function gateRow(M: Mats, ring: XY[], a: XY, b: XY, every: number, len: number, z0: number, z1: number, detail: boolean, skip = 16) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
  let n: XY = [u[1], -u[0]]
  const m: XY = [(a[0] + b[0]) / 2 + n[0] * 1.5, (a[1] + b[1]) / 2 + n[1] * 1.5]
  if (inRing(m, ring)) n = [-n[0], -n[1]]
  const k = Math.max(1, Math.round((L - 2 * skip) / every))
  for (let i = 0; i <= (k > 1 ? k : 0); i++) {
    const s = k > 1 ? skip + ((L - 2 * skip) * i) / k : L / 2
    jetBridge(M, [a[0] + u[0] * s, a[1] + u[1] * s], n, len, z0, z1, detail)
  }
}

/** Jet bridges at the ends of the gate stubs OSM draws on a pier outline (found with despur). */
export function stubBridges(M: Mats, ring: XY[], len: number, z0: number, z1: number, detail: boolean, wmax = 12, taken: XY[] = []) {
  const { spurs } = despur(ring, wmax, 12)
  for (const sp of spurs) {
    const a = sp[0], b = sp[sp.length - 1], root: XY = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
    let far = sp[1], dmax = 0
    for (const p of sp) { const d = Math.hypot(p[0] - root[0], p[1] - root[1]); if (d > dmax) { dmax = d; far = p } }
    if (dmax < 3 || dmax > 30) continue
    // the stub's tip: the mid of its far edge, pushed to the far distance along the stub's axis
    const ax: XY = [(far[0] - root[0]) / dmax, (far[1] - root[1]) / dmax]
    const proj = sp.map((p) => (p[0] - root[0]) * ax[0] + (p[1] - root[1]) * ax[1])
    const tipD = Math.max(...proj)
    const tip: XY = [root[0] + ax[0] * tipD, root[1] + ax[1] * tipD]
    if (taken.some((t) => Math.hypot(t[0] - tip[0], t[1] - tip[1]) < 8)) continue
    taken.push(tip)
    jetBridge(M, tip, ax, len, z0, z1, detail)
  }
  return taken
}

// ===========================================================================
// The terminal
// ===========================================================================

export const ANCHOR = { lng: 4.762773, lat: 52.309903 }

const RINGS: Record<string, XY[]> = {
    'way/268641398': [[200.8, -162.5], [195.7, -161.9], [163.4, -160.8], [161.6, -188.7], [163.9, -188.8], [163.1, -205.0], [141.0, -203.5], [141.1, -201.2], [136.6, -201.0], [137.0, -195.3], [82.1, -192.2], [80.8, -208.9], [50.7, -207.3], [51.9, -189.8], [49.2, -189.6], [50.0, -169.0], [61.1, -169.5], [64.9, -100.9], [61.2, -100.4], [63.7, -61.8], [67.3, -61.9], [70.5, 1.4], [60.6, 10.6], [8.0, 44.8], [-10.4, 44.4], [-44.2, 42.7], [-43.9, 37.8], [-187.4, 29.7], [-187.6, 34.5], [-193.7, 34.2], [-193.5, 29.1], [-222.1, 27.9], [-223.0, 44.0], [-227.7, 43.8], [-232.5, 111.4], [-234.5, 161.1], [-64.3, 170.9], [-61.7, 131.3], [-37.3, 132.5], [-39.0, 172.4], [108.2, 77.2], [128.6, 62.0], [142.5, 53.1], [139.4, 43.5], [141.2, 46.2], [155.1, 37.1], [159.8, 44.9], [192.0, 23.1], [198.2, -32.8], [204.3, -128.4]],
    'way/268641343': [[-226.8, 7.4], [-221.0, 8.1], [-222.1, 27.9], [-10.2, 39.5], [-10.4, 44.4], [8.0, 44.8], [60.6, 10.6], [70.5, 1.4], [67.3, -61.9], [63.7, -61.8], [61.2, -100.4], [64.9, -100.9], [61.1, -169.5], [50.0, -169.0], [49.2, -188.8], [42.6, -188.4], [42.7, -186.2], [36.8, -185.8], [37.1, -180.6], [35.2, -180.6], [35.0, -182.7], [30.5, -182.5], [30.7, -180.3], [28.9, -180.2], [28.5, -189.1], [10.3, -188.3], [11.1, -169.3], [8.0, -169.6], [6.9, -167.4], [7.5, -166.4], [11.3, -166.7], [14.2, -117.4], [8.6, -117.1], [1.2, -111.5], [0.1, -114.3], [-2.1, -114.7], [-3.1, -113.9], [-3.5, -112.7], [-3.1, -111.6], [-1.2, -109.7], [-12.6, -100.9], [-15.9, -102.3], [-29.3, -103.6], [-29.4, -100.2], [-32.1, -98.0], [-26.0, -90.5], [-36.9, -82.0], [-38.7, -85.0], [-41.4, -84.3], [-41.2, -82.1], [-39.0, -80.3], [-48.8, -72.7], [-50.6, -75.8], [-52.7, -75.7], [-53.3, -73.2], [-50.9, -71.1], [-63.9, -60.9], [-75.5, -61.5], [-75.6, -59.6], [-93.6, -45.5], [-87.7, -42.2], [-96.1, -35.5], [-98.0, -38.5], [-99.5, -38.7], [-100.7, -37.6], [-100.8, -36.3], [-98.3, -33.8], [-119.6, -16.8], [-119.8, -10.7], [-131.6, -11.4], [-131.8, -9.3], [-134.4, -11.7], [-137.1, -11.5], [-138.9, -9.7], [-140.6, -9.8], [-140.4, -11.9], [-223.1, -16.5], [-224.2, 1.3], [-220.6, 1.5], [-220.7, 4.2], [-222.1, 4.7], [-226.6, 4.2], [-227.4, 5.2]],
    'way/521074357': [[-77.4, 57.8], [-68.9, 59.8], [-59.9, 59.0], [-59.5, 51.7], [-68.7, 50.0], [-77.0, 50.8]],
    'way/521074358': [[-127.7, 55.3], [-119.2, 57.3], [-110.2, 56.5], [-109.8, 49.2], [-119.0, 47.5], [-127.3, 48.3]],
    'way/521074359': [[-116.3, 59.1], [-72.0, 61.2], [-71.9, 59.4], [-77.4, 57.8], [-77.0, 50.8], [-71.4, 50.0], [-71.3, 48.2], [-115.6, 46.0], [-115.7, 47.8], [-109.8, 49.2], [-110.2, 56.5], [-116.2, 57.3]],
    'way/521074360': [[-166.6, 56.6], [-122.3, 58.7], [-122.2, 56.9], [-127.7, 55.3], [-127.3, 48.3], [-121.8, 47.5], [-121.7, 45.7], [-166.0, 43.5], [-166.0, 45.4], [-160.2, 46.7], [-160.6, 54.0], [-166.5, 54.8]],
    'way/521074361': [[-65.9, 61.5], [-13.7, 63.9], [-13.0, 50.9], [-65.3, 48.4], [-65.4, 50.3], [-59.5, 51.7], [-59.9, 59.0], [-65.9, 59.8]],
    'way/521074362': [[-223.2, 53.6], [-172.7, 56.2], [-172.6, 54.4], [-178.1, 52.9], [-177.8, 45.8], [-172.2, 45.1], [-172.1, 43.2], [-222.5, 40.6]],
    'way/521074363': [[-178.1, 52.9], [-169.6, 54.8], [-160.6, 54.0], [-160.2, 46.7], [-169.4, 45.0], [-177.8, 45.8]],
    'way/521074365': [[140.3, 16.4], [166.5, 14.7], [154.5, -194.7], [128.4, -193.1], [135.4, -69.1], [146.6, -69.7], [147.6, -51.4], [136.4, -51.1], [137.2, -38.0], [152.5, -38.5], [153.0, -30.4], [137.6, -29.9], [138.4, -17.2], [149.5, -17.7], [150.5, 1.0], [139.4, 1.3]],
    'way/521074366': [[135.8, -62.1], [128.4, -193.1], [105.8, -191.9], [113.3, -61.3]],
    'way/521074367': [[139.1, -3.5], [135.8, -62.1], [113.3, -61.3], [116.6, -2.6]],
    'way/521074368': [[117.8, 17.6], [140.3, 16.4], [139.1, -3.5], [116.6, -2.6]],
}
const ring = (id: string) => RINGS['way/' + id]

/** Keep the part of a ring within `dmax` of the line through A, measured along the inward normal nIn. */
function clipBand(r: XY[], A: XY, nIn: XY, dmax: number): XY[] {
  const d = (p: XY) => (p[0] - A[0]) * nIn[0] + (p[1] - A[1]) * nIn[1]
  const out: XY[] = []
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length], da = d(a), db = d(b)
    if (da <= dmax) out.push(a)
    if ((da <= dmax) !== (db <= dmax)) { const t = (dmax - da) / (db - da); out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]) }
  }
  return out
}

/** The Plaza front: the straight run of way/268641343's south-west face, and its outward normal. */
const FRONT_A: XY = [1.2, -111.5], FRONT_B: XY = [-119.6, -16.8]

function build(detail: boolean) {
  const M = amsMats()
  const big: XY[] = [[-400, -400], [400, -400], [400, 400], [-400, 400]]
  const fl = (u: XY) => Math.abs(u[0] - -0.617) + Math.abs(u[1] - -0.787)
  M.win2 = new Part()
  const FC = detail ? F_CURTAIN_FINE : F_CURTAIN
  // landside fronts (facing south to west) of the departure halls: the same curtain wall
  const landside = (n: XY) => n[1] < -0.55 || fl(n) < 0.35
  // the Plaza front: a band of way/268641343 along its south-west face, raised to the roof
  // edge of the tall glass wall in the photos (FRONT_H), deeper than the eave's tie-back
  const L = Math.hypot(FRONT_B[0] - FRONT_A[0], FRONT_B[1] - FRONT_A[1])
  const u: XY = [(FRONT_B[0] - FRONT_A[0]) / L, (FRONT_B[1] - FRONT_A[1]) / L], n: XY = [-u[1], u[0]] // n points out (south-west)
  const FRONT_H = 16.5
  const band = clipBand(ring('268641343'), FRONT_A, [-n[0], -n[1]], 22)
  const zones: Zone[] = [
    { ring: ring('268641398'), z: 13, facade: F_HALL, facadeFor: (m) => (landside(m) ? FC : F_HALL) },
    { ring: ring('268641343'), z: 9.4, facade: F_HALL, facadeFor: (m) => (landside(m) ? FC : F_HALL) },
    { ring: band, z: FRONT_H, facade: FC, win: 'win2', lip: 0.35 },
    // the dark office block and its pale cores
    ...['521074359', '521074360', '521074361', '521074362'].map((id) => ({ ring: ring(id), z: 32, facade: null, wall: 'dark', roof: 'roof' }) as Zone),
    ...['521074357', '521074358', '521074363'].map((id) => ({ ring: ring(id), z: 36, facade: null, roof: 'roof' }) as Zone),
    // raised roofs over Departures 1 and 2, glazed clerestories
    ...['521074365', '521074366', '521074368'].map((id) => ({ ring: ring(id), z: 16, facade: F_CLERE, lip: 0.4, roof: 'wall' }) as Zone),
    { ring: ring('521074367'), z: 22, facade: F_CLERE, lip: 0.5, roof: 'wall' },
  ]
  // the halls' glass is the same light grey-blue as the curtain wall (it reads light and reflective in daylight)
  zones[0].win = 'win2'; zones[1].win = 'win2'
  zoneMass(M, big, zones, { lip: 0.6 })

  // --- the Plaza eave: the roof cantilevering forward as a thin, sloped, slatted lid, held on tree columns ---
  const DEPTH = 9, Z0 = FRONT_H - 0.2, Z1 = FRONT_H + 1.4, T = 0.35
  const at = (s: number, d: number): XY => [FRONT_A[0] + u[0] * s + n[0] * d, FRONT_A[1] + u[1] * s + n[1] * d]
  const segs = detail ? 16 : 6
  for (let k = 0; k < segs; k++) {
    const s0 = -6 + ((L + 12) * k) / segs, s1 = -6 + ((L + 12) * (k + 1)) / segs
    plate(M.roof, M.wall, M.wall, at(s0, -2), at(s1, -2), at(s0, DEPTH), at(s1, DEPTH), Z0, Z1, T)
  }
  if (detail) for (let s = -4; s < L + 6; s += 2.4) { // slats on the eave's top, across it
    const a = at(s, -1.5), b = at(s, DEPTH - 0.3), zz = (d: number) => Z0 + ((Z1 - Z0) * d) / DEPTH + 0.04
    quadN(M.steel, [a[0], a[1], zz(-1.5)], [a[0] + u[0] * 0.3, a[1] + u[1] * 0.3, zz(-1.5)], [b[0] + u[0] * 0.3, b[1] + u[1] * 0.3, zz(DEPTH - 0.3)], [b[0], b[1], zz(DEPTH - 0.3)], [[0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1]])
  }
  const zUnder = (d: number) => Z0 - T + ((Z1 - Z0) * d) / DEPTH
  const trees = 8
  for (let k = 0; k < trees; k++) {
    const s = 6 + ((L - 12) * k) / (trees - 1), d = 5
    tree(M.steel, at(s, d), u, 10.5, [[-6.5, -3.5, zUnder(d - 3.5)], [6.5, -3.5, zUnder(d - 3.5)], [-6.5, 3.5, zUnder(d + 3.5)], [6.5, 3.5, zUnder(d + 3.5)]], 0.45, detail)
  }

  if (detail) {
    // rooftop plant on the halls
    const plant: [number, number, number, number][] = [[-200, 90, -180, 110], [-150, 120, -120, 135], [-100, 95, -80, 115], [-20, 100, 0, 118], [40, 60, 60, 75], [150, -100, 170, -80], [150, -160, 165, -140], [-180, -5, -160, 10], [20, -150, 40, -130]]
    for (const [x0, y0, x1, y1] of plant) prismRing(M.wall, [[x0, y0], [x1, y0], [x1, y1], [x0, y1]], 12.9, 15.2, M.roof)
  }
  return [...amsParts(M), { part: M.win2, material: windowVariant(2, 0xa9bfd1) }]
}

if (import.meta.main) {
  const extras = { bearing: 0, osm: 'way/268641398', height: 36 }
  writeLod('Amsterdam Airport Schiphol terminal', 'amsterdam-schiphol-terminal.glb', build(false), extras, 8000, 250_000)
  writeLod('Amsterdam Airport Schiphol terminal', 'amsterdam-schiphol-terminal.detail.glb', build(true), extras, 40_000, 1_500_000)
}
