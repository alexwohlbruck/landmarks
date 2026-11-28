/**
 * Citymark Centre (城脉中心, "Chengmai Center"), Sungang, Luohu, Shenzhen —
 * original procedural geometry, CC0-1.0.
 * bun generators/shenzhen-citymark-centre.ts   (writes the low model and the detail LOD)
 *
 * Frame: bearing 0 (its faces look north, south, east and west). Origin =
 * area centroid of the OSM outline way/1271754601 (114.100107 E, 22.560966 N),
 * on the ground; the tower axis is at the origin. Elevation 0.
 *
 * Form, as read from OSM and the photos:
 * - plan: a 41 m square whose four corners are scooped out in deep concave
 *   curves, leaving four flat face slabs about 20 m wide (OSM outline);
 * - the taper: straight, from 41 m across at the foot to 25 m at the top,
 *   the face slabs narrowing from 20.8 to 15 m;
 * - silver edges where each face slab meets the scoops, full height;
 * - in the scoops of the upper half (the serviced apartments), stacked
 *   balcony slabs, a horizontal "ladder" up each corner;
 * - the crown: the four face slabs rise as parapet walls to 388.3 m round a
 *   lower roof, their outer edges as slim blades;
 * - blue glass all over (the faces carry LED text and numerals at night).
 *
 * Evidence
 * - OSM, fetched 2026-11-27 with tools/osm.py: outline way/1271754601
 *   (城脉中心, Citymark Center, 388 m, 70 levels, start_date 2022, Q130693037);
 *   no building:part ways.
 * - Published: 388.3 m, 70 floors, completed 2022 (Wikipedia "Citymark
 *   Centre"; Wikidata Q130693037; CTBUH).
 * - Photos (Wikimedia Commons, daylight unless noted):
 *   "Citymark Centre - Chengmai Center Shenzhen 2025.jpeg", Ubahnverleih,
 *   CC BY-SA 4.0, from the street (NW): whole tower, taper, the corner
 *   balconies, the crown blades; https://commons.wikimedia.org/wiki/File:Citymark_Centre_-_Chengmai_Center_Shenzhen_2025.jpeg
 *   "SUNGANG EAST ROAD, LUOHU DISTRICT, SHENZHEN (91).jpg", Dinkun Chen,
 *   CC BY-SA 4.0, from the east (98 deg, 1.6 km): the upper ~215 m near
 *   face-on: face slab and scoop widths, balcony zone, crown;
 *   https://commons.wikimedia.org/wiki/File:SUNGANG_EAST_ROAD,_LUOHU_DISTRICT,_SHENZHEN_(91).jpg
 *   "Citymark Centre Shenzhen, 2025.jpeg", Ubahnverleih, CC BY-SA 4.0, from
 *   the foot (NW, 80 m) looking up: the face slab, edges and scoops;
 *   https://commons.wikimedia.org/wiki/File:Citymark_Centre_Shenzhen,_2025.jpeg
 *   "HONGLING NORTH ROAD, SHENZHEN (8).jpg", Dinkun Chen, CC BY-SA 4.0, from
 *   the foot (NW): the same, in sun; https://commons.wikimedia.org/wiki/File:HONGLING_NORTH_ROAD,_SHENZHEN_(8).jpg
 *   "SUNGANG EAST ROAD, LUOHU DISTRICT, SHENZHEN (60).jpg", Dinkun Chen,
 *   CC BY-SA 4.0, night: the LED face; https://commons.wikimedia.org/wiki/File:SUNGANG_EAST_ROAD,_LUOHU_DISTRICT,_SHENZHEN_(60).jpg
 * - No lidar, NAIP or Mapillary used. Look-only references: none.
 *
 * Numbers
 * - Published: 388.3 m top.
 * - Measured (OSM): the plan: faces at +/-20.4 m, face slabs 20.8 m wide, the
 *   scoops' curve (a quadratic through the outline's corner points).
 * - Measured (photo, east photo): the whole width falls to ~0.65 over the
 *   upper ~215 m (drawn a little gentler, 0.70, as the NW street photo,
 *   whose perspective exaggerates the taper, still suggests less);
 *   the balcony zone from about 45% to 95% of the height.
 * - Estimated: the taper below (the lower half is hidden in every distant
 *   photo; drawn linear to the ground outline), the crown (parapets from
 *   378 m, blades), balcony spacing (grouped: 2 storeys in the low model,
 *   one in the detail) and depth (1.4 m), colours sampled from
 *   the east and street photos (#50698f-#829bae), pulled to the palette.
 *
 * Doubts
 * - Evidence is moderate: one distant face-on photo (the upper half only),
 *   one full-height street photo from the NW and two looking up from the
 *   foot; the south and west sides are not photographed close, and the
 *   tower is drawn four-fold symmetric.
 * - The night LED text on the faces is not modelled.
 *
 * Night: the glass glows as windows (`window`); the scoop glass `window-2`.
 */
import { Part, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { face, saveLods, type Layer, type XY } from './auckland-sky-tower'
import { grid, rib, flat, nrm3 } from './shenzhen-ping-an-finance-centre'

const H = 388.3
const PAR = 378 // main roof; the face parapets rise from here
const a = (z: number) => 20.4 - (20.4 - 12.5) * (z / H) // face plane distance
const f = (z: number) => 10.4 - (10.4 - 7.5) * (z / H) // face slab half-width
const BAL0 = 0.45 * H, BAL1 = 0.95 * H

/** The plan at z, counter-clockwise from the east face's south end; nc points per scoop (exclusive of ends). */
function plan(z: number, nc: number, out = 0): V3[] {
  const A = a(z) + out, F = f(z)
  const C = F + 0.22 * (A - F)
  const pts: V3[] = []
  // build one quadrant (east face north end -> scoop -> north face east end) and rotate
  const quad: XY[] = [[A, -F], [A, F]]
  for (let i = 1; i <= nc; i++) {
    const t = i / (nc + 1)
    const x = (1 - t) * (1 - t) * A + 2 * t * (1 - t) * C + t * t * F
    const y = (1 - t) * (1 - t) * F + 2 * t * (1 - t) * C + t * t * A
    quad.push([x, y])
  }
  for (let q = 0; q < 4; q++) {
    const c = Math.cos((q * Math.PI) / 2), s = Math.sin((q * Math.PI) / 2)
    for (const [x, y] of quad) pts.push([x * c - y * s, x * s + y * c, z])
  }
  return pts
}

/** A counter-clockwise ring pushed out by d along its vertex normals. */
function offsetRing(r: V3[], d: number): V3[] {
  const n = r.length
  return r.map((p, i) => {
    const a = r[(i - 1 + n) % n], b = r[(i + 1) % n]
    const e1 = nrm3([p[1] - a[1], -(p[0] - a[0]), 0]), e2 = nrm3([b[1] - p[1], -(b[0] - p[0]), 0])
    const m = nrm3([e1[0] + e2[0], e1[1] + e2[1], 0])
    const cos = Math.max(0.5, m[0] * e1[0] + m[1] * e1[1])
    return [p[0] + (m[0] * d) / cos, p[1] + (m[1] * d) / cos, p[2]] as V3
  })
}

type Set = { glass: Part; scoop: Part; silver: Part; roof: Part }
const mk = (): Set => ({ glass: new Part(), scoop: new Part(), silver: new Part(), roof: new Part() })

function build(s: Set, d: boolean) {
  const nc = d ? 7 : 4
  const per = 2 + nc // points per quadrant
  const zs = d ? [0, 40, 80, 120, 160, 200, 240, 280, 320, 350, PAR] : [0, 130, 260, PAR]
  const rings = zs.map((z) => plan(z, nc))
  // face columns (i % per === 0) are the flat face slabs; the rest are scoop
  grid(rings, true, (i) => (i % per === 0 ? s.glass : s.scoop), (vi) => vi % per !== 0 && vi % per !== 1)
  flat(s.roof, plan(PAR, nc).map((q) => [q[0], q[1]] as XY), PAR)

  // ---- silver edges where each face slab meets the scoops
  for (let q = 0; q < 4; q++) for (const k of [0, 1]) {
    const vi = q * per + k
    const path = zs.map((z, j) => rings[j][vi])
    const out = zs.map((z, j) => {
      const p = rings[j][vi]
      return nrm3([p[0], p[1], 0])
    })
    rib(s.silver, path, out, d ? 0.9 : 1.3, d ? 0.6 : 0.8, 0.15, true)
  }

  // ---- the crown: each face slab rises as a parapet wall to the top, 2.5 m thick, with blades at its edges
  const T = 2.5
  for (let q = 0; q < 4; q++) {
    const c = Math.cos((q * Math.PI) / 2), sn = Math.sin((q * Math.PI) / 2)
    const R = (x: number, y: number, z: number): V3 => [x * c - y * sn, x * sn + y * c, z]
    const A0 = a(PAR), F0 = f(PAR), A1 = a(H), F1 = f(H)
    const o0 = R(A0, -F0, PAR), o1 = R(A0, F0, PAR), o2 = R(A1, F1, H), o3 = R(A1, -F1, H)
    const n: V3 = nrm3(R(1, 0, 0))
    face(s.glass, [o0, o1, o2, o3], [n[0], n[1], 0.05])
    const i0 = R(A0 - T, -F0, PAR), i1 = R(A0 - T, F0, PAR), i2 = R(A1 - T, F1, H), i3 = R(A1 - T, -F1, H)
    face(s.silver, [i1, i0, i3, i2], [-n[0], -n[1], 0])
    face(s.roof, [o3, o2, i2, i3], [0, 0, 1])
    const side = nrm3(R(0, 1, 0))
    face(s.silver, [o1, i1, i2, o2], side)
    face(s.silver, [i0, o0, o3, i3], [-side[0], -side[1], 0])
    // blades: slim fins at the slab's two edges, standing a little above it
    for (const sg of [-1, 1]) {
      const b0 = R(A0 + 0.3, sg * F0, PAR - 8), b1 = R(A1 + 0.3, sg * F1, H - 0.4)
      const o = nrm3(R(1, sg * 1, 0))
      rib(s.silver, [b0, b1], [o, o], d ? 0.7 : 1.0, 1.0, 0.4, true)
    }
  }

  // ---- balcony slabs stacked in the scoops of the upper half
  const step = d ? 4.6 : 9.2, th = d ? 0.45 : 0.8, dep = 1.4
  for (let z = BAL0; z < BAL1; z += step) {
    const r0 = plan(z, nc), r1 = offsetRing(r0, dep)
    for (let q = 0; q < 4; q++) {
      const idx = [q * per + 1]
      for (let k = 2; k < per; k++) idx.push(q * per + k)
      idx.push(((q + 1) % 4) * per)
      // the slab: top, soffit and outer edge, over the scoop's points
      for (let m = 0; m < idx.length - 1; m++) {
        const p0 = r0[idx[m]], p1 = r0[idx[m + 1]], q0 = r1[idx[m]], q1 = r1[idx[m + 1]]
        const up = (p: V3): V3 => [p[0], p[1], p[2] + th]
        face(s.silver, [up(p0), up(p1), up(q1), up(q0)], [0, 0, 1])
        face(s.silver, [p0, q0, q1, p1], [0, 0, -1])
        const e: V3 = nrm3([q1[1] - q0[1], -(q1[0] - q0[0]), 0])
        const mid = [(q0[0] + q1[0]) / 2, (q0[1] + q1[1]) / 2]
        const sgn = e[0] * mid[0] + e[1] * mid[1] > 0 ? 1 : -1
        face(s.silver, [q0, q1, up(q1), up(q0)], [e[0] * sgn, e[1] * sgn, 0])
      }
    }
  }
}

// ---- Materials and output ----------------------------------------------------------------------------------

const GLASS: MaterialSpec = { ...PALETTE.window, color: 0x6f8fb4 }
const SCOOP: MaterialSpec = windowVariant(2, 0x617da3)
const SILVER: MaterialSpec = finish('cm-silver', 0xccd2da, 0.5)
const ROOF: MaterialSpec = PALETTE.roof
const layers = (s: Set): Layer[] => [
  { part: s.glass, material: GLASS },
  { part: s.scoop, material: SCOOP },
  { part: s.silver, material: SILVER },
  { part: s.roof, material: ROOF },
]

if (import.meta.main) {
  const low = mk(), det = mk()
  build(low, false)
  build(det, true)
  await saveLods('shenzhen-citymark-centre', 'Citymark Centre', layers(low), layers(det), {
    frame: 'Y up, -Z north, +X east, metres; origin at the OSM outline centroid, on the ground',
    bearing: 0, height: H,
  }, 5000)
}
