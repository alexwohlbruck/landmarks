/**
 * 401 North Tryon (401 N Tryon St, between 7th and 8th Streets), Charlotte.
 * A ten-storey office block filling its block's Tryon frontage. Original
 * procedural geometry, CC0-1.0.
 * bun generators/clt-401-north-tryon.ts
 *
 * Map frame: x, y, z up, metres, turned to bearing 46: +x faces North
 * Tryon Street (south-east), +y faces 8th Street (north-east), -y faces
 * 7th Street, -x the courtyard garden and Church St. Origin: centroid of
 * OSM way/397367281 on the ground.
 *
 * Identity, in order:
 *  - a long ten-storey slab on Tryon with rounded corners, each corner
 *    crowned by a low round drum, and a rounded bay at mid-front over the
 *    entrance passage;
 *  - two wings running back from its ends toward Church St, each stepping
 *    down in three terraces (37, 33, 29 m), with saw-toothed low (13 m)
 *    terraces along their courtyard sides;
 *  - a cross-shaped penthouse on the slab's roof.
 *
 * Evidence:
 *  - OSM way/397367281 (building, 10 levels, 401 N Tryon St) and its 17
 *    building:parts way/1336645179-195, with heights 13/29/33/37/43/47 and
 *    min_heights 10 (the passage through the middle), 15 (the rounded bay)
 *    and 43 (the penthouse); every part is extruded as mapped.
 *  - Lidar: USGS_LPC_NC_Phase4_Mecklenburg_2016 (flown 2016-17), 1 m grid,
 *    read with tools/lidar_frame.py at bearing 46; ground 2.3 m over the
 *    box minimum, level. Measured above it: the slab's roof 41.7 m (OSM
 *    43), the penthouse 46.7 m (OSM 47), the terraces 37.3, 33.2, 29.2
 *    and 12.9 m (OSM 37, 33, 29, 13), so the lidar heights are used; the
 *    corner drums' rims 45.8 m. The lidar agrees with the parts' plan.
 *  - NAIP (USGS, public domain): white roofs, the stepped wings, the round
 *    corner drums, the garden court on the Church St side.
 *  - No open-licensed photo of this building was found (Wikimedia Commons
 *    text and geo search, Openverse); no Mapillary token was available.
 *    No commercial imagery.
 *
 * Invented: the facade. The wall colour (a light warm precast) and the
 * window treatment (two-storey panels between piers) are placeholders, not
 * evidence; the passage's and the rounded bay's details too.
 *
 * Doubts: everything about the facade, as above. The building should be
 * checked against a photo before it is approved.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { panel, save, type XY } from './chi-aon-center'
import { wallsF, capF, edgeLen, ccw } from './clt-imaginon'

const BEARING = 46
const ANCHOR: [number, number] = [35.2301209, -80.8395672]

const wall = new Part(), glass = new Part(), roof = new Part(), dark = new Part()

/** OSM heights to the lidar's (above the ground here). */
const LIDAR: Record<number, number> = { 0: 0, 10: 10, 15: 15, 13: 12.9, 29: 29.2, 33: 33.2, 37: 37.3, 43: 41.7, 47: 46.7 }

const PARTS: { id: string; z0: number; z1: number; r: XY[] }[] = [
  { id: 'way/1336645179', z0: 0, z1: 13, r: [[-8.8, 13.4], [-8.2, 22.6], [-17.3, 23.1]] },
  { id: 'way/1336645180', z0: 0, z1: 13, r: [[-17.3, 23.1], [-16.8, 32.4], [-25.6, 32.6]] },
  { id: 'way/1336645181', z0: 0, z1: 13, r: [[-25.6, 32.6], [-25.0, 42.0], [-34.0, 42.4]] },
  { id: 'way/1336645182', z0: 0, z1: 13, r: [[-10.0, -10.7], [-10.6, -19.9], [-19.6, -19.4]] },
  { id: 'way/1336645183', z0: 0, z1: 13, r: [[-19.6, -19.4], [-20.2, -28.7], [-29.2, -28.1]] },
  { id: 'way/1336645184', z0: 0, z1: 13, r: [[-29.2, -28.1], [-30.0, -37.5], [-38.9, -36.9]] },
  { id: 'way/1336645185', z0: 0, z1: 29, r: [[-25.0, 42.0], [-24.3, 55.4], [-33.2, 55.8], [-34.0, 42.4]] },
  { id: 'way/1336645186', z0: 0, z1: 33, r: [[-25.6, 32.6], [-16.8, 32.4], [-15.6, 54.8], [-20.1, 55.1], [-24.3, 55.4], [-25.0, 42.0]] },
  { id: 'way/1336645187', z0: 0, z1: 37, r: [[-17.3, 23.1], [-8.2, 22.6], [-6.5, 54.4], [-15.6, 54.8], [-16.8, 32.4]] },
  { id: 'way/1336645188', z0: 0, z1: 29, r: [[-39.8, -51.0], [-38.9, -36.9], [-30.0, -37.5], [-31.0, -51.5]] },
  { id: 'way/1336645189', z0: 0, z1: 33, r: [[-31.0, -51.5], [-30.0, -37.5], [-29.2, -28.1], [-20.2, -28.7], [-21.8, -52.1], [-26.5, -51.8]] },
  { id: 'way/1336645190', z0: 0, z1: 37, r: [[-21.8, -52.1], [-20.2, -28.7], [-19.6, -19.4], [-10.6, -19.9], [-12.8, -52.7]] },
  { id: 'way/1336645191', z0: 0, z1: 43, r: [[26.4, 4.3], [28.7, 44.3], [27.5, 44.4], [27.5, 45.7], [27.2, 47.2], [26.5, 48.5], [25.7, 49.6], [24.5, 50.6], [23.1, 51.4], [21.7, 51.8], [20.1, 51.9], [20.2, 53.0], [0.3, 54.0], [-6.5, 54.4], [-8.2, 22.6], [-8.8, 13.4], [-9.2, 4.7], [26.3, 2.6]] },
  { id: 'way/1336645192', z0: 0, z1: 43, r: [[25.9, -5.1], [-9.6, -3.2], [-10.0, -10.7], [-10.6, -19.9], [-12.8, -52.7], [14.0, -55.0], [14.1, -53.9], [15.4, -54.0], [16.8, -53.9], [18.3, -53.3], [19.6, -52.4], [20.8, -51.2], [21.6, -49.9], [22.1, -48.6], [22.3, -47.3], [23.4, -47.3], [25.7, -7.2]] },
  { id: 'way/1336645193', z0: 10, z1: 43, r: [[-9.2, 4.7], [-9.6, -3.2], [25.9, -5.1], [26.3, 2.6]] },
  { id: 'way/1336645194', z0: 15, z1: 43, r: [[25.7, -7.2], [25.9, -5.1], [26.3, 2.6], [26.4, 4.3], [27.4, 2.6], [28.0, 0.8], [28.2, -1.3], [27.9, -3.4], [27.0, -5.4]] },
  { id: 'way/1336645195', z0: 43, z1: 47, r: [[-0.1, -30.3], [-1.2, -30.2], [-1.6, -37.7], [10.9, -38.4], [11.4, -30.9], [10.3, -30.8], [11.6, -8.6], [17.2, -9.0], [18.4, -7.3], [19.3, -5.1], [20.0, -3.0], [20.3, -0.5], [20.3, 1.6], [19.9, 3.7], [19.3, 5.6], [18.2, 7.6], [12.1, 8.0], [13.4, 30.8], [14.6, 30.7], [15.0, 37.5], [3.1, 38.1], [2.6, 31.1], [3.7, 31.0], [2.4, 8.7], [-0.9, 8.9], [-1.9, -8.5], [1.2, -8.6]] },
]

for (const p of PARTS) {
  const r = ccw(p.r), z0 = LIDAR[p.z0], z1 = LIDAR[p.z1]
  wallsF(wall, r, () => z0, () => z1)
  capF(roof, r, () => z1)
  if (z0 > 0) capF(dark, r, () => z0, false)
  if (z1 - z0 < 6) continue
  // two-storey window panels between piers on every face long enough
  const storey = 4.1
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length], L = edgeLen(a, b)
    if (L < 4) continue
    const n = Math.max(1, Math.round(L / 3.4)), w = L / n
    for (let zA = Math.max(z0, 0) + (z0 === 0 ? 4.6 : 0.6); zA + storey * 2 - 0.6 <= z1 - 0.8; zA += storey * 2) {
      for (let k = 0; k < n; k++) panel(glass, a, b, k * w + 0.5, (k + 1) * w - 0.5, zA, zA + storey * 2 - 0.9)
    }
    // the ground floor: a darker glazed base
    if (z0 === 0) panel(dark, a, b, 0.4, L - 0.4, 0.3, 3.9)
  }
}

// the round drums on the slab's two Tryon corners (lidar rims 45.8 m, NAIP)
for (const [cx, cy] of [[19.5, 46.0], [15.0, -45.5]] as XY[]) {
  const n = 16, rr = 6.0
  const ring: XY[] = Array.from({ length: n }, (_, i) => [cx + rr * Math.cos(i / n * 2 * Math.PI), cy + rr * Math.sin(i / n * 2 * Math.PI)] as XY)
  wallsF(wall, ring, () => 41.6, () => 45.8)
  capF(roof, ring, () => 45.8)
}

if (import.meta.main) {
  await save('clt-401-north-tryon', '401 North Tryon', ANCHOR, BEARING, [
    { part: wall, material: finish('401ntryon-precast', 0xd3cabb) },
    { part: glass, material: { ...PALETTE.window } },
    { part: dark, material: finish('401ntryon-base', 0x4c5257) },
    { part: roof, material: PALETTE.roof },
  ])
}
