/**
 * Community Christian Church, 4601 Main Street, Kansas City, Missouri.
 * Frank Lloyd Wright, 1940-42: a plan on a 30/60-degree grid, pale gunite
 * walls, a second storey of clerestory glass under a thin cantilevered roof,
 * a raised flat roof behind it and the tall blank sanctuary block at the
 * north-west, crowned by the open steel lattice of the "Steeple of Light",
 * from which searchlights beam into the sky at night (since 1994).
 *
 * Frame: bearing 0, +x east, +y north, z up, metres. Origin at the OSM
 * outline's centroid, -94.586407 39.043178. z = 0 is the lowest ground
 * under the footprint, at the south tip (lidar 1.5 above the box's
 * ground_min); the ground rises about 4 m to the north side, so the north
 * walls sink into the slope.
 *
 * What it covers: way/331463804 (the church outline, the whole building).
 *
 * Sources
 * - OSM (c) OpenStreetMap contributors: way/331463804, architect tag,
 *   wikidata Q5154675.
 * - USGS 3DEP lidar MO_FEMANRCS_1_2020 (flown 2020), 0.5 m grid
 *   (work/kc-community-christian-church/lidar.json): the low south wing at
 *   6.4 (z 4.9); the cantilevered eave at 11.0-11.4 (z 9.6); the raised
 *   main roof at 13.1-13.4 (z 11.7); the sanctuary block 15-17 (z 13.5-15.5).
 * - Published: Wikipedia "Community Christian Church (Kansas City,
 *   Missouri)": Wright, 1940; the Steeple of Light completed 1994 from his
 *   drawings, searchlights shining up from the roof.
 * Photos (evidence, Wikimedia Commons):
 * - "Community Christian Church KCMO.jpg", Charvex, public domain (from the
 *   south-west): https://commons.wikimedia.org/wiki/File:Community_Christian_Church_KCMO.jpg
 * - "Community Church in Kansas City, Missouri 01.jpg" ... "05.jpg",
 *   Roseisuppose, CC BY-SA 4.0 (from the south-west and the east entrance):
 *   https://commons.wikimedia.org/wiki/File:Community_Church_in_Kansas_City,_Missouri_01.jpg
 *   https://commons.wikimedia.org/wiki/File:Community_Church_in_Kansas_City,_Missouri_02.jpg
 *   https://commons.wikimedia.org/wiki/File:Community_Church_in_Kansas_City,_Missouri_04.jpg
 *
 * Numbers
 * - Outline from OSM (exact); the storey split from lidar (measured; the
 *   raised roof and sanctuary set 0.3-0.8 m above the lidar flats, where the
 *   photo from the west shows them taller against the eave): podium
 *   / south wing roof 4.9, glass band 6.3-9.2 (photo-scaled, estimated), eave
 *   9.2-9.7 overhanging 2.6 m (photo-scaled), raised roof 12.0, sanctuary
 *   15.0, lattice crown to 16.4 (lidar 15-17.1 over the crown, measured).
 * - The upper storey's south edge (a 62-degree line through (0, -2)), the
 *   raised roof's and the sanctuary's outlines: traced from the lidar height
 *   bands (measured, +-1 m).
 *
 * Simplified / doubts
 * - The lattice crown is drawn as a ring of white steel frames over the
 *   sanctuary; its real geometry (a hexagonal open truss) is only seen
 *   edge-on in the photos. The searchlights are `lamp` beads at its foot.
 * - The entrance steps, lettering, chapel doors and the red cross sculpture
 *   on the corner are left out; the entrance is a glass panel on the east.
 * - The north side (on the slope) has no photo; drawn like the south.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { pslab, pwalls, pcap, poffset, ccw, type XY } from './dc-nga-west'
import { saveModel } from './sd-california-tower'

const WALL = finish('ccc-gunite', 0xeeebe2)
const ROOF = finish('ccc-roof', 0xc4c6c4)
const FRAME = finish('ccc-steel', 0xf6f4ee)
const LAMP = finish('lamp-searchlight', 0xd9d6cc)

/** OSM way/331463804 in this frame. */
const OUTLINE: XY[] = [
  [-17.6, 30.5], [-29.0, 11.8], [-20.9, -3.3], [-15.6, -13.4], [-12.9, -18.5], [5.5, -8.8],
  [11.3, -19.7], [22.4, -13.9], [24.3, 1.6], [22.5, 5.0], [9.7, 28.7],
]

/** Keep the part of a convex-or-not polygon on the side n.(p - p0) >= 0 (Sutherland-Hodgman, one edge). */
function clipHalf(poly: XY[], p0: XY, n: XY): XY[] {
  const f = (p: XY) => n[0] * (p[0] - p0[0]) + n[1] * (p[1] - p0[1])
  const out: XY[] = []
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length], fa = f(a), fb = f(b)
    if (fa >= 0) out.push(a)
    if ((fa >= 0) !== (fb >= 0)) { const t = fa / (fa - fb); out.push([a[0] + t * (b[0] - a[0]), a[1] + t * (b[1] - a[1])]) }
  }
  return out
}

function build() {
  const wall = new Part(), roof = new Part(), glass = new Part(), frame = new Part(), lamp = new Part(), door = new Part()
  const Z_PODIUM = 4.9, Z_PARAPET = 6.3, Z_GLASS = 9.2, Z_EAVE = 9.7, Z_RAISED = 12.0, Z_SANCT = 15.0

  // ---- podium: the whole outline to the south wing's roof
  pslab(wall, OUTLINE, 0, Z_PODIUM, 0.25, roof)
  // ---- upper storey north of a 62-degree line through (0, -2)
  const d62: XY = [Math.sin((62 * Math.PI) / 180), Math.cos((62 * Math.PI) / 180)]
  const UP = ccw(clipHalf(OUTLINE, [0, -2], [-d62[1], d62[0]]))
  pslab(wall, UP, Z_PODIUM, Z_PARAPET, 0.15, false)
  const GL = poffset(UP, -0.9)
  // the ledge between the parapet and the glass, the glass band, and its posts
  pcap(roof, UP, Z_PARAPET, true)
  pwalls(glass, GL, Z_PARAPET, Z_GLASS)
  GL.forEach((p, i) => {
    const q = GL[(i + 1) % GL.length]
    const L = Math.hypot(q[0] - p[0], q[1] - p[1]), n = Math.max(1, Math.round(L / 4.5))
    for (let k = 0; k < n; k++) {
      const t = k / n, x = p[0] + t * (q[0] - p[0]), y = p[1] + t * (q[1] - p[1])
      const ux = (q[0] - p[0]) / L, uy = (q[1] - p[1]) / L
      // a thin post just proud of the glass
      const nx = uy, ny = -ux
      const a: XY = [x - ux * 0.09 + nx * 0.02, y - uy * 0.09 + ny * 0.02], b: XY = [x + ux * 0.09 + nx * 0.02, y + uy * 0.09 + ny * 0.02]
      const c: XY = [b[0] + nx * 0.16, b[1] + ny * 0.16], d: XY = [a[0] + nx * 0.16, a[1] + ny * 0.16]
      pwalls(frame, [a, b, c, d], Z_PARAPET, Z_GLASS)
    }
  })
  // ---- the thin cantilevered roof, overhanging 2.6 m, soft-edged
  const EAVE = poffset(UP, 2.6)
  pslab(wall, EAVE, Z_GLASS, Z_EAVE, 0.12, roof, true)
  // ---- the raised flat roof behind the eave (lidar 13.2)
  const RAISED: XY[] = [[-21.0, 13.0], [-17.0, 0.5], [-2.5, -0.5], [2.0, 8.5], [16.0, 9.5], [15.5, 16.5], [4.0, 19.5], [3.0, 26.5], [-8.0, 26.5], [-8.0, 18.0], [-20.0, 18.0]]
  pslab(wall, RAISED, Z_EAVE, Z_RAISED, 0.2, roof)
  // ---- the sanctuary block (lidar 15-17), blank walls, chamfered corners
  const SANCT: XY[] = [[-21.5, 18.5], [-9.0, 18.0], [-6.8, 22.5], [-7.0, 28.5], [-9.5, 31.0], [-17.8, 30.8], [-21.8, 24.5]]
  pslab(wall, SANCT, 0, Z_SANCT, 0.25, roof)
  // ---- the Steeple of Light: an open ring of white steel frames round the sanctuary roof
  const C: XY = [-14.3, 24.6]
  const crown = poffset(SANCT, -1.6)
  crown.forEach((p, i) => {
    const q = crown[(i + 1) % crown.length]
    const post = (x: number, y: number, z1: number) => pwalls(frame, [[x - 0.13, y - 0.13], [x + 0.13, y - 0.13], [x + 0.13, y + 0.13], [x - 0.13, y + 0.13]], Z_SANCT, z1)
    post(p[0], p[1], 16.4)
    // a raking member from each corner up to the next corner's midpoint
    const m: XY = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2]
    post(m[0], m[1], 15.9)
    // top chord
    const L = Math.hypot(q[0] - p[0], q[1] - p[1]), ux = (q[0] - p[0]) / L, uy = (q[1] - p[1]) / L
    const nx = uy * 0.12, ny = -ux * 0.12
    const top: XY[] = [[p[0] - nx, p[1] - ny], [q[0] - nx, q[1] - ny], [q[0] + nx, q[1] + ny], [p[0] + nx, p[1] + ny]]
    pslab(frame, top, 16.15, 16.4, 0, true, true)
    // the searchlight at each corner, aimed up
    const s = 0.32, lz = Z_SANCT
    const lx = p[0] + (C[0] - p[0]) * 0.15, ly = p[1] + (C[1] - p[1]) * 0.15
    pslab(lamp, [[lx - s, ly - s], [lx + s, ly - s], [lx + s, ly + s], [lx - s, ly + s]], lz, lz + 0.6, 0.12, true)
  })
  // ---- doors: the east entrance and the chapel door (flush glass)
  const doorAt = (a: XY, b: XY, z0: number, z1: number, t0: number, t1: number) => {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L
    const nx = uy * 0.05, ny = -ux * 0.05
    const P0: XY = [a[0] + ux * t0 + nx, a[1] + uy * t0 + ny], P1: XY = [a[0] + ux * t1 + nx, a[1] + uy * t1 + ny]
    door.quad([P0[0], P0[1], z0], [P1[0], P1[1], z0], [P1[0], P1[1], z1], [P0[0], P0[1], z1])
  }
  // the long south-east face and the east face (outline wound clockwise: walk it counter-clockwise)
  doorAt([11.3, -19.7], [22.4, -13.9], 1.4, 3.6, 3.5, 8.0)
  doorAt([22.4, -13.9], [24.3, 1.6], 1.6, 3.8, 6.0, 9.0)
  // a band of windows on the podium's south faces
  doorAt([-12.9, -18.5], [5.5, -8.8], 1.6, 3.4, 4.0, 15.0)

  const lit = (q: V3, n: V3) => (n[2] > 0.7 ? 0.1 : q[2] > 9 ? 0.35 : 0.2)
  return [
    { part: wall, material: { ...WALL, floodlight: lit } },
    { part: roof, material: ROOF },
    { part: glass, material: PALETTE.window },
    { part: frame, material: { ...FRAME, floodlight: (q: V3) => (q[2] > 14.8 ? 0.9 : 0) } },
    { part: lamp, material: LAMP },
    { part: door, material: PALETTE.entrance },
  ]
}

if (import.meta.main) await saveModel('kc-community-christian-church', 'Community Christian Church', build())
