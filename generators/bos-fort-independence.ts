/**
 * Fort Independence, Castle Island, South Boston (1833–1851, Sylvanus
 * Thayer): the granite pentagonal fort with a bastion at each corner, its
 * earth-topped ramparts round an open parade — original procedural
 * geometry, CC0-1.0.
 * bun generators/bos-fort-independence.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground. Bearing 0. Anchor -71.01112, 42.33828 = the area centroid
 * of the outer ring of OSM relation/64881 (a multipolygon: outer way/29833521,
 * inner way/29833522, the parade).
 *
 * Identity (from the photos and the lidar below):
 *  1. The bastioned pentagon: five curtain walls and five arrow-headed
 *     bastions, read best from above; the plan is OSM's outer ring (it
 *     matches the lidar to a metre or two).
 *  2. Plain dressed-granite scarp walls, light warm grey, about 9–11 m tall,
 *     with a thin coping, a row of small gun loops and the sally port in
 *     the south curtain (where OSM's outline has its extra nodes).
 *  3. Over the walls, the earth ramparts: a parapet mound along the outer
 *     edge and the flat terreplein behind it, grassed (drawn as a muted green
 *     finish, STYLE.md's rule for roof gardens; the lawns round the fort and
 *     the parade are the map's and are not modelled).
 *  4. The inner granite walls of the casemates round the parade, with their
 *     doors and windows.
 *
 * Heights: USGS 3DEP lidar MA_CentralEastern_1_2021 (2021 flight), 1 m
 * grid, read with tools/lidar_frame.py at bearing 0. z = 0 is the ground at
 * the bastion tips, 7.5 m above the grid's ground_min (the ground round the
 * fort rises from 7.5 at the north and east tips to 10–10.5 on the south
 * and west; the walls run down to z = 0 everywhere and sink into it).
 * Measured: the walls' top (coping) 11.2; the parapet mound's crest 13.4
 * (lidar 20–21.9; the higher bumps are trees and traverses); the
 * terreplein 10.9 (lidar 18.4); the parade 4.2 (lidar 11.7); OSM's height
 * tag 10 is the wall above the outside ground.
 *
 * Estimated from the photos (Fletcher's and Beyond My Ken's views across the
 * harbour, Paul Keleher's close-up): the parapet mound's width (4.5 m, crest
 * 2 m in), the gun loops (1.0 × 1.4 m at z 6.5, about 9 m apart), the sally
 * port (3.2 m wide, round-headed, 4.6 m tall), the casemate openings on the
 * parade side (6 m apart).
 *
 * Ground: Mapterhorn shows the fort as a plateau 4 m above the lowest
 * ground under the footprint (the bastion tips); the map fills that from
 * the ground outside, so the walls stand to their full height. Elevation 0.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Fort Independence, Boston, August 2024.jpg, Fletcher, CC BY 4.0 (the
 *    south-west and west walls from the harbour)
 *    https://commons.wikimedia.org/wiki/File:Fort_Independence,_Boston,_August_2024.jpg
 *  - 2017 Fort Independence, Castle Island from Boston Harbor 1.jpg, Beyond
 *    My Ken, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:2017_Fort_Independence,_Castle_Island_from_Boston_Harbor_1.jpg
 *  - Castle Island - Fort Independence.jpg, Eric Kilby, CC BY-SA 2.0
 *    https://commons.wikimedia.org/wiki/File:Castle_Island_-_Fort_Independence.jpg
 *  - Fort Independence, Castle Island, South Boston.jpg, Paul Keleher,
 *    CC BY 2.0 (the walls, coping and earth parapet close up)
 *    https://commons.wikimedia.org/wiki/File:Fort_Independence,_Castle_Island,_South_Boston.jpg
 *  - Boston. Harbor. Fort Independence, Castle Island (DPLA 480a6fb8…),
 *    Fairchild Aerial Surveys, public domain (oblique aerial)
 *    https://commons.wikimedia.org/wiki/File:Boston._Harbor._Fort_Independence,_Castle_Island_-_DPLA_-_480a6fb84f38256efe7b5ed10e75d9ff.jpg
 * No commercial imagery. Published: dates and the engineer from Wikipedia
 * (Fort Independence (Massachusetts)).
 *
 * Doubts: the parade-side casemate fronts are drawn as one plain granite
 * wall with openings (no photo of the parade was used); the traverses and
 * small mounds on the ramparts, the flagstaff and the Donald McKay obelisk
 * outside (not part of the fort) are left out.
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { archShape, onWall, rectShape } from './atl-tech-tower'
import { at, capPoly, ccw, save, type XY } from './atl-flatiron-building'

const gran = new Part(), earth = new Part(), dark = new Part()

const OUTER: XY[] = ccw([[58.76, -81.64], [29.44, -70.41], [28.71, -58.39], [3.87, -54.83], [-0.89, -54.24], [-5.65, -53.62], [-32.39, -49.59], [-37.71, -60.98], [-65.98, -64.26], [-66.58, -36.64], [-55.56, -30.79], [-67.21, 12.54], [-79.61, 14.3], [-93.78, 41.41], [-63.75, 47.31], [-51.37, 39.62], [-17.44, 56.84], [-20.46, 68.87], [1.2, 88.35], [21.02, 66.8], [17.26, 55.59], [26.17, 49.09], [27.61, 47.94], [28.96, 46.89], [60.21, 23.32], [69.03, 30.56], [98.04, 18.68], [81.59, -4.05], [69.72, -3.86], [55.16, -44.14], [55.14, -44.93], [55.46, -45.51], [62.27, -54.57]])
const INNER: XY[] = ccw([[36.72, -48.45], [56.52, 6.74], [0.58, 48.79], [-56.88, 21.49], [-42.83, -37.97]])

const WALL = 11.2, CREST = 13.4, TERRE = 10.9, PARADE = 4.2

// ── the scarp walls ──
gran.loft([at(OUTER, 0), at(OUTER, WALL - 0.35)])
// the coping: a thin band standing a little proud
{
  const n = OUTER.length
  for (let i = 0; i < n; i++) {
    const a = OUTER[i], b = OUTER[(i + 1) % n], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], o: XY = [t[1] * 0.25, -t[0] * 0.25]
    const A: V3 = [a[0] + o[0], a[1] + o[1], WALL - 0.35], B: V3 = [b[0] + o[0], b[1] + o[1], WALL - 0.35]
    gran.quad([a[0], a[1], WALL - 0.35], [b[0], b[1], WALL - 0.35], B, A) // underside lip
    gran.quad(A, B, [B[0], B[1], WALL], [A[0], A[1], WALL])
    gran.quad([A[0], A[1], WALL], [B[0], B[1], WALL], [b[0], b[1], WALL], [a[0], a[1], WALL])
  }
}

// ── the ramparts: the parapet mound along every outer edge, and the
// terreplein, a flat top between the walls and the parade ──
{
  const n = OUTER.length
  const W1 = 2.0, W2 = 4.5 // crest and inner foot of the mound, metres in from the wall
  for (let i = 0; i < n; i++) {
    const a = OUTER[i], b = OUTER[(i + 1) % n], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 2) continue
    const t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], inw: XY = [-t[1], t[0]] // left of a→b is inside (ccw)
    const P = (p: XY, d: number, z: number): V3 => [p[0] + inw[0] * d, p[1] + inw[1] * d, z]
    // the outer slope from the coping up to the crest, the inner slope down to the terreplein
    earth.quad(P(a, 0, WALL), P(b, 0, WALL), P(b, W1, CREST), P(a, W1, CREST))
    earth.quad(P(a, W1, CREST), P(b, W1, CREST), P(b, W2, TERRE), P(a, W2, TERRE))
    // end caps, so a corner never shows a hole
    earth.tri(P(a, 0, WALL), P(a, W1, CREST), P(a, W2, TERRE))
    earth.tri(P(b, 0, WALL), P(b, W2, TERRE), P(b, W1, CREST))
  }
  // the terreplein: the outer ring with the parade cut out (a keyhole polygon)
  const startI = INNER.reduce((best, p, k) => (p[1] < INNER[best][1] ? k : best), 0)
  const near = OUTER.reduce((best, p, k) => {
    const q = INNER[startI], d = Math.hypot(p[0] - q[0], p[1] - q[1])
    return d < best.d ? { k, d } : best
  }, { k: 0, d: Infinity }).k
  const outerSeq = [...OUTER.slice(near), ...OUTER.slice(0, near), OUTER[near]]
  const innerCW = [...INNER].reverse()
  const s = innerCW.indexOf(INNER[startI])
  const innerSeq = [...innerCW.slice(s), ...innerCW.slice(0, s), innerCW[s]]
  capPoly(earth, [...outerSeq, ...innerSeq], TERRE, true)
}

// ── the parade side: the casemates' granite fronts, facing in ──
{
  const ring = [...INNER].reverse() // clockwise: the walls face the parade
  gran.loft([at(ring, 0), at(ring, TERRE - 0.3)])
  gran.loft([at(ring, TERRE - 0.3), at(ring, TERRE)])
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const n = Math.floor((L - 8) / 6)
    for (let k = 0; k <= n; k++) {
      const sx = 4 + ((L - 8) * k) / Math.max(1, n)
      onWall(dark, a, b, archShape(sx, 1.6, PARADE, PARADE + 2.2, 6), 0.05)
    }
  }
}

// ── gun loops on the long faces, and the sally port ──
for (let i = 0; i < OUTER.length; i++) {
  const a = OUTER[i], b = OUTER[(i + 1) % OUTER.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
  if (L < 18) continue
  const n = Math.floor((L - 6) / 9)
  for (let k = 0; k <= n; k++) {
    const sx = 3 + ((L - 6) * k) / Math.max(1, n)
    onWall(dark, a, b, rectShape(sx - 0.5, sx + 0.5, 5.8, 7.2), 0.05)
  }
}
{
  // the south curtain between (3.87, -54.83) and (-5.65, -53.62): the sally port
  const a: XY = [3.87, -54.83], b: XY = [-5.65, -53.62]
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  const [p, q] = OUTER.indexOf(OUTER.find((v) => v[0] === 3.87)!) < OUTER.indexOf(OUTER.find((v) => v[0] === -5.65)!) ? [a, b] : [b, a]
  onWall(gran, p, q, archShape(L / 2, 4.4, 2.6, 6.2, 10), 0.08)
  onWall(dark, p, q, archShape(L / 2, 3.2, 2.6, 5.6, 10), 0.14)
}

await save('bos-fort-independence', 'Fort Independence', [
  { part: gran, material: finish('fort-granite', 0xd4cdbd) },
  { part: earth, material: finish('fort-rampart', 0x9fae84) },
  { part: dark, material: finish('fort-opening', 0x4a4f57) },
], { height: CREST, anchor: [42.33828, -71.01112], bearing: 0 }, 5000)
