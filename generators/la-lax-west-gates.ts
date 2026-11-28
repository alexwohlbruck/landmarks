/**
 * Los Angeles International Airport (LAX): the West Gates at Tom Bradley
 * International (the Midfield Satellite Concourse, Corgan, 2021), the
 * long satellite pier west of Tom Bradley across the taxiways, joined to it
 * underground — procedural, CC0-1.0, no textures.
 *
 *   bun generators/la-lax-west-gates.ts
 *
 * Writes models/la-lax-west-gates.glb (low) and .detail.glb (finer vaults,
 * mullion groups, every jet-bridge leg with rotunda and cab). Built with
 * the LAX kit in la-lax-tom-bradley-terminal.ts.
 *
 * Split from la-lax-tom-bradley-terminal: it stands 600 m west of Tom
 * Bradley across two taxiways and does not read as one complex with it.
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 353 (the
 * airport grid). Anchor = centroid of the OSM outline way/831597425
 * (-118.41507, 33.94344). y = 0 is the apron (37.0 m NAVD88).
 *
 * Identity (lidar, NAIP, interior photos): a 500 m pier, 40 m wide, under
 * a run of twin shallow vaults (two ridges and a valley along the pier,
 * the interior photos' twin barrel ceilings with clerestories at the
 * sides), broken every 50-56 m by a lower flat joint; glazed gate pods on
 * both sides; a wider hub two-thirds of the way south with a raised
 * transverse roof; jet bridges.
 *
 * Evidence
 * - OSM: way/831597425 (Midfield Satellite Concourse); 28 aeroway=
 *   jet_bridge ways (drawn, not replaced).
 * - Lidar: USGS 3DEP CA_LosAngeles_1_B23 (2023 work unit; the 2021
 *   building is in it), 1 m grid, heights above the apron: eaves 17.6,
 *   ridges 20.5 (x = -12 and +12), the valley 19.0; joints 15.7, 8 m wide,
 *   at y = 198, 146, 90, 34, -22, -78, -178 and the south end; gate pods
 *   15.4; the hub (y -169..-80) 23.5-25, its raised band (y -145..-108)
 *   29.1. (A 46 m spike at the hub's east side is left out: a crane or
 *   mast, not in OSM or the photos.)
 * - Photos (Wikimedia Commons, EVIDENCE), interior only:
 *   KLAX7.jpg and KLAX8.jpg, Vmzp85, CC BY-SA 4.0 (the twin vaulted
 *   ceilings and side clerestories);
 *   Looking_outside_the_West_Gates_at_Tom_Bradley_International.jpg,
 *   ActivBowser9177, CC0 (Tom Bradley's waves from the West Gates).
 *   USGS NAIP for the plan and the roof colour (pale grey).
 * Estimated: the vault curve between the measured eave, ridge and valley;
 *   window band heights; jet-bridge floor 4.2 m.
 * Doubts: no licensed exterior photo of the West Gates was found; the
 *   walls' glazing and colours are inferred from the interiors and the
 *   aerial. Plain version, flagged for review.
 */
import { surface, newParts, materials, box, panelRow, mullions, jetBridges, orient, runs, cross, clipBox, writeModel, len2, LAX, type XY, type Block } from './la-lax-tom-bradley-terminal'
import { finish } from './palette'

export const ANCHOR = { lng: -118.41507, lat: 33.94344 }
export const BEARING = 353
const Z_JB = 4.2, XW = -21.8, XE = 18.5, XM = (XW + XE) / 2

export const OSM: Record<string, XY[]> = {
  'way/831597425': [[25.9, 153.5], [18.4, 153.5], [18.5, 191.4], [26.5, 191.5], [26.6, 197.9], [25.0, 198.1], [24.9, 198.9], [25.2, 217.8], [25.1, 220.2], [25.3, 226.5], [18.5, 226.5], [18.4, 265.4], [16.5, 265.4], [16.4, 266.9], [-20.0, 266.8], [-20.0, 265.4], [-21.8, 265.4], [-21.8, 259.9], [-21.8, 256.7], [-21.8, 208.0], [-28.5, 208.1], [-28.5, 179.8], [-21.8, 179.7], [-21.8, 150.6], [-28.3, 150.5], [-28.3, 131.7], [-28.5, 119.5], [-28.3, 116.0], [-21.8, 115.8], [-21.7, 95.2], [-20.2, 95.2], [-20.2, 83.2], [-21.8, 83.2], [-21.8, 71.2], [-28.2, 71.2], [-28.2, 46.6], [-28.3, 44.1], [-28.3, 43.0], [-21.6, 43.0], [-21.6, 40.4], [-20.8, 40.4], [-20.7, 28.7], [-21.7, 28.6], [-21.5, -2.1], [-27.9, -2.0], [-27.8, -14.7], [-28.3, -26.8], [-28.0, -29.8], [-21.6, -29.9], [-21.6, -68.9], [-20.1, -68.9], [-20.0, -80.5], [-37.5, -80.5], [-37.4, -97.9], [-37.4, -151.8], [-37.4, -169.6], [-19.6, -169.7], [-19.6, -181.4], [-21.3, -181.3], [-21.3, -226.4], [-19.6, -226.4], [-19.7, -237.2], [-5.5, -237.2], [7.0, -237.2], [12.0, -237.2], [15.4, -237.2], [16.6, -237.2], [16.5, -230.0], [24.6, -229.9], [24.7, -225.0], [24.7, -211.2], [24.8, -208.5], [24.6, -202.3], [18.0, -202.3], [18.0, -181.7], [16.4, -181.6], [16.5, -174.9], [16.5, -169.3], [43.0, -169.2], [43.0, -151.1], [42.9, -144.2], [44.3, -144.1], [44.5, -105.8], [42.9, -105.7], [43.0, -98.8], [43.0, -80.9], [33.3, -80.4], [27.1, -80.4], [16.4, -80.5], [16.5, -72.8], [16.5, -68.8], [18.5, -68.8], [17.9, -34.2], [18.4, -26.2], [16.5, -26.1], [16.6, -20.4], [24.8, -20.3], [24.9, -5.9], [24.9, -1.4], [24.9, 0.6], [24.8, 4.6], [24.8, 7.2], [18.5, 7.3], [18.4, 28.4], [17.3, 28.5], [17.4, 40.3], [18.3, 40.4], [18.4, 52.4], [24.7, 52.4], [24.7, 70.9], [24.7, 73.9], [24.8, 80.3], [18.3, 80.3], [18.3, 83.2], [16.8, 83.2], [16.8, 95.2], [18.5, 95.2], [18.4, 117.5], [26.2, 117.5], [26.1, 139.8], [25.7, 144.0], [25.8, 146.8], [25.9, 149.9]], // Midfield Satellite Concourse
}
export const BLOCKS: Record<string, { base: number; blocks: Block[] }> = {}
export const JET_BRIDGES: XY[][] = [[[12.0, -237.2], [11.9, -256.6], [40.2, -259.6], [43.2, -257.0]], [[24.7, -225.0], [35.8, -225.4], [38.8, -231.0], [41.1, -230.5], [48.1, -215.2], [48.6, -211.2]], [[15.4, -237.2], [15.5, -246.6], [18.1, -246.7], [31.4, -251.7], [35.5, -249.7]], [[42.8, -201.4], [42.8, -205.0], [34.2, -218.0], [30.8, -217.8], [27.9, -211.7], [24.7, -211.2]], [[36.3, -197.8], [35.3, -202.5], [28.6, -208.1], [24.8, -208.5]], [[35.7, -66.4], [34.5, -68.9], [27.1, -80.4], [26.3, -81.6]], [[47.0, -65.8], [45.6, -68.7], [33.3, -80.4]], [[59.7, -38.0], [58.4, -40.8], [32.6, -35.3], [17.9, -34.2]], [[34.4, 15.1], [33.8, 11.3], [28.2, 2.7], [27.0, 0.6], [24.9, 0.6], [20.9, -1.3]], [[45.4, 15.1], [45.3, 11.7], [32.5, -2.2], [24.9, -1.4]], [[25.1, 220.2], [28.5, 219.8], [32.5, 215.5], [34.4, 216.9], [29.5, 234.8], [27.3, 236.7]], [[24.9, 198.9], [27.9, 198.8], [35.6, 206.8], [48.0, 222.8], [49.1, 226.6]], [[25.7, 144.0], [32.3, 144.5], [43.7, 160.7], [44.7, 164.0]], [[-28.5, 179.8], [-29.6, 183.3], [-31.6, 187.6], [-35.4, 195.4], [-42.6, 192.1], [-47.3, 176.7], [-47.3, 173.3]], [[-28.5, 119.5], [-31.5, 119.5], [-33.9, 119.8], [-48.5, 96.3], [-49.2, 91.5]], [[24.7, 70.9], [33.0, 71.1], [35.8, 72.8], [44.9, 83.4], [44.4, 87.5]], [[-48.8, 20.3], [-48.1, 25.1], [-34.3, 46.8], [-28.2, 46.6]], [[-47.2, -54.4], [-47.0, -50.2], [-34.4, -26.2], [-28.3, -26.8]], [[-37.0, -58.4], [-37.1, -54.4], [-28.3, -26.8]], [[-37.6, 20.0], [-36.1, 25.7], [-30.3, 43.2], [-28.3, 44.1], [-26.2, 45.5]], [[-37.5, 93.1], [-36.3, 97.9], [-30.2, 115.9], [-23.0, 120.2]], [[-38.4, 169.8], [-38.2, 174.4], [-38.6, 189.4], [-36.3, 190.5], [-31.0, 180.4], [-28.5, 179.8]], [[24.2, 219.2], [25.2, 217.8], [35.6, 206.8]], [[23.0, 145.5], [25.8, 146.8], [27.2, 146.9], [29.2, 151.2], [34.1, 161.3], [35.2, 165.6]], [[24.7, 73.9], [27.2, 74.1], [34.7, 83.5], [34.9, 87.6]], [[-65.3, 277.7], [-65.2, 280.0], [-48.2, 280.8], [-44.2, 271.2], [-21.8, 259.9]], [[-30.6, 247.2], [-32.7, 249.1], [-40.8, 262.6], [-39.8, 265.1], [-21.8, 256.7]], [[-44.2, 271.2], [-49.5, 252.8], [-49.6, 248.9]]]

/** The twin-vault section: eaves 17.6, ridges 20.5, valley 19.0 (+ lift on the hub). */
function prof(x: number, lift = 0) {
  const h = (XE - XW) / 2, outer = x < XM ? (x - XW) / h : (XE - x) / h // 0 at the eave, 1 at the valley
  return lift + 17.6 + 1.4 * outer + 2.2 * Math.sin(Math.PI * Math.min(1, Math.max(0, outer)))
}
/** Bays (y0, y1, lift); joints between them at 15.7. */
const BAYS: [number, number, number?][] = [[202, 266.8], [150, 194], [94, 142], [38, 86], [-18, 30], [-74, -26], [-169, -80, 4.5], [-226, -186]]

export function build(detail: boolean) {
  const P = newParts()
  const ring = OSM['way/831597425']
  const nu = detail ? 16 : 8
  // the pier's body to the joint height, glazed at gate level
  const pier = box(P.wall, P.flat, clipBox(ring, XW, -237.2, XE, 266.8), 0, 15.7)
  for (let i = 0; i < pier.length; i++) {
    const a = pier[i], b = pier[(i + 1) % pier.length]
    if (len2(a, b) < 12) continue
    panelRow(P.win, a, b, 1.2, 14.6, { bay: detail ? 6 : 10, gap: 1.0, end: 0.8 })
    if (detail) mullions(P.trim, a, b, 1.2, 14.6, 2.0, 0.14, 0.1)
  }
  // vault bays: twin vaults, glazed clerestory walls from the joint height up to the eaves
  for (const [y0, y1, lift = 0] of BAYS) {
    surface(P.roof, (u, v) => { const x = XW + (XE - XW) * u; return [x, y0 + (y1 - y0) * v, prof(x, lift)] }, nu, 1)
    for (const [x, sgn] of [[XW, -1], [XE, 1]] as [number, number][]) {
      const zt = prof(x, lift)
      const A: XY = sgn < 0 ? [x, y1] : [x, y0], B: XY = sgn < 0 ? [x, y0] : [x, y1]
      P.wall.quad([A[0], A[1], 15.7], [B[0], B[1], 15.7], [B[0], B[1], zt], [A[0], A[1], zt])
      panelRow(P.win, A, B, 16.0, zt - 0.4, { bay: detail ? 5 : 9, gap: 0.8, end: 0.6 })
    }
    // the vaults' gable ends, glazed
    for (const [y, north] of [[y0, false], [y1, true]] as [number, boolean][]) {
      for (let i = 0; i < nu; i++) {
        const xa = XW + ((XE - XW) * i) / nu, xb = XW + ((XE - XW) * (i + 1)) / nu
        const q: [number, number, number][] = [[xa, y, 15.7], [xb, y, 15.7], [xb, y, prof(xb, lift)], [xa, y, prof(xa, lift)]]
        if (north) P.win.quad(q[1], q[0], q[3], q[2]); else P.win.quad(q[0], q[1], q[2], q[3])
      }
    }
  }
  // the hub: wider body to 23.5, its raised transverse band to 29.1
  const hub = box(P.wall, P.flat, clipBox(ring, -38, -169.7, 44.5, -80.4), 0, 19.8)
  for (let i = 0; i < hub.length; i++) {
    const a = hub[i], b = hub[(i + 1) % hub.length]
    if (len2(a, b) < 12) continue
    panelRow(P.win, a, b, 1.2, 18.6, { bay: detail ? 6 : 10, gap: 1.0, end: 0.8 })
  }
  box(P.wall, P.flat, [[-24, -145], [28, -145], [28, -108], [-24, -108]], 19.8, 29.1)
  for (const [a, b] of [[[-24, -145], [28, -145]], [[28, -108], [-24, -108]]] as [XY, XY][]) panelRow(P.win, a, b, 23, 28.2, { bay: 8, gap: 1.0, end: 1.0 })
  // gate pods on both sides (OSM), glass boxes to 15.4
  const pods = [...runs(clipBox(ring, -60, -237.2, 60, 266.8), (p) => p[0] < XW - 1.2, cross(XW)), ...runs(clipBox(ring, -60, -237.2, 60, 266.8), (p) => p[0] > XE + 1.2, cross(XE))]
  for (const pod of pods) {
    if (pod.some((p) => p[1] < -168 && p[1] > -81)) continue
    const r = box(P.wall, P.flat, pod, 0, 15.4)
    for (let i = 0; i < r.length; i++) { const a = r[i], b = r[(i + 1) % r.length]; if (len2(a, b) > 5) panelRow(P.win, a, b, 1.2, 14.2, { bay: 7, gap: 0.8, end: 0.5 }) }
  }
  jetBridges(P.metal, orient(JET_BRIDGES, [ring]), Z_JB, detail)
  return materials(P, { roof: finish('lax-west-gates-roof', 0xd2d6d6), flat: LAX.flat })
}

if (import.meta.main) {
  const o = { bearing: BEARING, height: 29.1 }
  await writeModel('la-lax-west-gates.glb', 'LAX West Gates', build(false), { ...o, maxTris: 8000, maxBytes: 250_000 })
  await writeModel('la-lax-west-gates.detail.glb', 'LAX West Gates', build(true), { ...o, maxTris: 40_000, maxBytes: 1536 * 1024 })
}
