/**
 * klia2 satellite: the satellite building, its piers P and Q and the
 * skybridge to the main building (Kuala Lumpur International Airport
 * Terminal 2, opened 2014) — procedural, CC0-1.0, no textures.
 * bun generators/kl-klia2-satellite.ts
 *
 * Split out of kl-klia2 (the complex is over 1.4 km across); shares its
 * kit (generators/kl-klia2.ts).
 *
 * Map frame: x = east, y = north, z up, metres, turned to bearing 325.9 (the
 * airport grid; the piers run along x, the skybridge along +y to the main
 * building). Anchor: area centroid of the satellite building, OSM
 * way/1033454793 (101.6885529, 2.7394903).
 *
 * The identity: a long straight line of two low white-roofed piers, P and Q,
 * meeting at a taller satellite building, and from it the white skybridge
 * striding north over the taxiway, high enough for aircraft to pass under,
 * to the main building's airside nose.
 *
 * Evidence
 * - OSM: way/1033454793 "KLIA Terminal 2 (Satellite Building)" (3 levels),
 *   way/1033454789 "Pier P (International)", way/1033454790 "Pier Q
 *   (International)" (2 levels), way/1033454788 "Skybridge"
 *   (building=transportation, 3 levels, layer 1), service blocks
 *   way/1033454791 and way/1033454792. Read in this frame. The skybridge's
 *   north end meets the main building's nose (kl-klia2) to within 2 m.
 * - Published: P and Q are reached from the main building by the
 *   skybridge, "the first airport in Asia with such facility" (English
 *   Wikipedia); 300 m long with 60 m of walkalators (klia2.info, an
 *   unofficial guide; OSM maps 173 m of it as the bridge proper).
 * - Photos: "View Over KLIA2.jpg", Jason Thien (Flickr), CC BY 2.0 — the
 *   skybridge from the air: a long white box on a darker truss, high over
 *   the taxiway; the satellite's white rounded roofs; pier P beyond.
 *   "Bird-eye view of KLIA and KLIA2 - panoramio.jpg", CK Tan, CC BY 3.0 —
 *   the whole white line of P and Q from altitude.
 *
 * Numbers (estimated: no published heights)
 * - Piers as klia2's: apron level 0–5 m, glass to 13 m, crown 18.5 m,
 *   ends rolled down over 22 m.
 * - Satellite building: glass to 20 m, its barrel vault eave 21 m, crown
 *   28.5 m, both ends rolled down.
 * - Skybridge: underside 21 m (above the 17 m fins of the A330s it lets
 *   through), enclosure to 28.5 m; a 3.5 m deep truss under it. From the
 *   aerial, against the piers.
 *
 * Doubts: the satellite building's roof shape is read from one distant
 * aerial; the skybridge's real height is not published.
 */
import { type V3 } from './mesh'
import { type XY, quadN, capPoly } from './nyc-570-lexington'
import { writeLod, newMats } from './tokyo-haneda-terminal-1'
import { ringWalls, bands, glassWalls, pierVault } from './kl-klia-terminal-1'
import { K2MATS, k2Materials, vaultBuilding } from './kl-klia2'

export const ANCHOR: [number, number] = [101.6885529, 2.7394903]
export const BEARING = 325.9

const SAT: XY[] = [[-94.7, -31.5], [-94.8, 14.7], [-90.7, 27.1], [-34.7, 27.3], [-29.5, 38.0], [-19.6, 56.2], [-4.0, 107.2], [-3.2, 134.6], [16.6, 135.2], [16.2, 116.4], [21.7, 84.7], [31.7, 58.7], [38.0, 38.7], [39.9, 27.2], [81.0, 27.6], [88.6, 15.1], [89.4, -32.4], [80.6, -45.0], [38.9, -45.7], [37.0, -57.0], [33.6, -71.8], [29.2, -82.8], [23.8, -88.6], [-9.7, -88.6], [-14.5, -85.7], [-24.1, -69.1], [-33.2, -55.9], [-36.1, -44.5], [-91.1, -44.3]]

function build(detail: boolean) {
  const M = newMats(K2MATS)
  const seg = detail ? 12 : 6
  // --- the satellite building: glazed, under a vault along x, its neck and lobe under lower roofs
  ringWalls(M.panel, SAT, 0, 6)
  bands(M.win, SAT, 1.2, 4.8, 12, 3)
  glassWalls(M, SAT, 6, () => 20, detail ? 6 : 1e4, detail ? 7.2 : 0)
  capPoly(M.roof, SAT, 20)
  pierVault(M, -94.7, 89.4, -45, 27.4, 21, 28.5, 3.5, seg, undefined, [true, true], 20)
  // --- the piers
  vaultBuilding(M, 88.6, 584.3, -16.8, 16.0, { base: 5, eave: 13, crown: 18.5, oh: 3.5, seg, ends: [false, true], hip: 22, detail })
  vaultBuilding(M, -597.1, -94.7, -18.2, 14.7, { base: 5, eave: 13, crown: 18.5, oh: 3.5, seg, ends: [true, false], hip: 22, detail })
  for (const r of [[[-94.7, -17.2], [-94.7, -31.5], [-142.5, -31.8], [-153.5, -17.3]], [[89.2, -16.8], [89.4, -32.4], [138.0, -32.3], [148.8, -16.7]]] as XY[][]) {
    ringWalls(M.panel, r, 0, 9)
    bands(M.win, r, 2, 7, 10, 2)
    capPoly(M.roof, r, 9)
  }
  // --- the skybridge: a glazed white box on a truss, from the neck (y 135) to the main building (y 308)
  const b0 = 135, b1 = 307.5, zu = 21, zt = 28.5
  const xa = (y: number) => (y < 212 ? -3.3 : -3.3 - ((y - 212) / 95.5) * 3.6)
  const xb = (y: number) => (y < 212 ? 16.6 : 16.6 + ((y - 212) / 95.5) * 4.8)
  const ys = [b0, 212, b1]
  for (let i = 0; i < ys.length - 1; i++) {
    const y0 = ys[i], y1 = ys[i + 1]
    const L: [XY, XY] = [[xa(y0), y0], [xa(y1), y1]], R: [XY, XY] = [[xb(y0), y0], [xb(y1), y1]]
    for (const [[p, q], out] of [[L, -1], [R, 1]] as [[XY, XY], number][]) {
      const n: V3 = [out, 0, 0]
      quadN(M.panel, [p[0], p[1], zu - 3.5], [q[0], q[1], zu - 3.5], [q[0], q[1], zu + 0.8], [p[0], p[1], zu + 0.8], [n, n, n, n]) // truss
      quadN(M.win, [p[0], p[1], zu + 0.8], [q[0], q[1], zu + 0.8], [q[0], q[1], zt - 1.2], [p[0], p[1], zt - 1.2], [n, n, n, n])
      quadN(M.roof, [p[0], p[1], zt - 1.2], [q[0], q[1], zt - 1.2], [q[0], q[1], zt], [p[0], p[1], zt], [n, n, n, n])
    }
    const top: XY[] = [[xa(y0), y0], [xb(y0), y0], [xb(y1), y1], [xa(y1), y1]]
    capPoly(M.roof, top, zt)
    capPoly(M.soffit, top, zu - 3.5, false)
  }
  // the bridge's two portal legs over the taxiway edges (estimated)
  for (const y of [150, 292]) {
    for (const x of [xa(y) + 1.2, xb(y) - 1.2]) {
      const r: XY[] = [[x - 1.2, y - 1.2], [x + 1.2, y - 1.2], [x + 1.2, y + 1.2], [x - 1.2, y + 1.2]]
      ringWalls(M.stone, r, 0, zu - 3.5)
    }
  }
  // the north end meets the main building's nose: close it off with glass
  const n: V3 = [0, 1, 0]
  quadN(M.win, [xb(b1), b1, zu], [xa(b1), b1, zu], [xa(b1), b1, zt], [xb(b1), b1, zt], [n, n, n, n])
  return k2Materials(M, !detail)
}

if (import.meta.main) {
  const extras = { bearing: BEARING, osm: 'way/1033454793', height: 28.5 }
  writeLod('klia2 satellite (piers P and Q, skybridge)', 'kl-klia2-satellite.glb', build(false), extras, 8000, 250_000)
  writeLod('klia2 satellite (piers P and Q, skybridge)', 'kl-klia2-satellite.detail.glb', build(true), extras, 40_000, 1_500_000)
}
