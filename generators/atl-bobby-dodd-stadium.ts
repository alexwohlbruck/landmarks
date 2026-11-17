/**
 * Bobby Dodd Stadium at Hyundai Field (Grant Field, 1913), Georgia Tech,
 * Atlanta — procedural, CC0-1.0, no textures.
 *   bun generators/atl-bobby-dodd-stadium.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0 (the field runs due
 * north-south). The anchor is the area centroid of the stadium outline
 * (leisure=stadium way/618966004).
 *
 * An open bowl with no roof, its bench seats pale aluminium (the brightest
 * thing in the block in NAIP). Every stand is drawn in its real tiers: the
 * lower bowl and the upper deck as raked treads with grey riser lips (five
 * per tier), a 4 m grey concourse band between them, and the dark glass
 * face (press box, suites or club) under the upper deck's lip. The north
 * end is a horseshoe lofted round C = (1.75, 25) out to a rounded back
 * (corner radius 38 m, NAIP and lidar), its section blending from the north
 * stand's in the middle to the side stands' at ±75°, where it meets the
 * west and east stands on a mitre.
 *   - West stand (OSM grandstand way/42706712): the lower bowl from the
 *     field wall (x -24.5) to 14 m at x -55; the glass press and suite
 *     levels set back under the upper deck's lip; the upper deck rising
 *     25 m to 34.5 m at the back (x -78); three lattice light rigs on its
 *     back rail, 48 m (lidar).
 *   - East stand (part of grandstand way/245699027): lower bowl to 6.5 m,
 *     the upper deck on raking steel from 13 m to 26.5 m (x 48 to 72),
 *     carried over a concourse building on Techwood Drive; three light
 *     rigs, 33 m.
 *   - North end (way/245699027): the horseshoe, lower stand to 11 m, the
 *     upper north stand 19 m to 36.5 m (y 77 to 112) cantilevered on steel
 *     over the low ground behind it (JJonahJackalope's photo), its
 *     corners rounded as in NAIP; an 18 m block in the north-east corner.
 *   - South end: low end-zone seats to 6 m, and the Wardlaw Center (OSM
 *     way/42706714, 1985), brick and glass, 19 m, with the video board on
 *     its roof (top 33 m, lidar) facing the field.
 *
 * Elevation: z = 0 is the field. The field is below North Avenue (8-10 m)
 * and the west side (15 m), but the ground north of the stadium and
 * Techwood Drive's north end are at field level (lidar and Mapterhorn both
 * show it), so the field is the lowest ground under the outline and
 * elevation stays 0 (Wikipedia: "much of the field itself is below street
 * level due to natural terrain slope from north to south").
 *
 * Evidence
 * - OSM: way/618966004 (stadium), grandstands way/42706712 and
 *   way/245699027, Wardlaw Center way/42706714.
 * - Lidar: USGS 3DEP GA_Statewide_B2_2018, 1 m: every height and edge.
 * - NAIP (USGS): plan; grey-white aluminium seats, white roofs.
 * - Published (Wikipedia, "Bobby Dodd Stadium"): 1913; west stands rebuilt
 *   over the old concrete; north stands 1958, bowled in after 2002;
 *   Wardlaw Center 1985; capacity 51,913 (2024-25). A $70 m renovation
 *   (premium seating on the west side, chairbacks, a new video board,
 *   press moved to the north end zone) was approved in 2026 to start after
 *   the 2026 season (AJC, Rough Draft Atlanta, June 2026); this model is
 *   the stadium before it.
 * - Photos (Wikimedia Commons, all CC BY-SA 4.0 unless noted):
 *   JJonahJackalope, "Bobby Dodd Stadium west stands.jpg" and
 *     "Bobby Dodd Stadium, west stands.jpg" (2019);
 *   JJonahJackalope, "Bobby Dodd Stadium, upper north stands.jpg" (2019;
 *     the raked steel under the north stand);
 *   JJonahJackalope, "South endzone stands, Bobby Dodd Stadium.jpg"
 *     (2019; Wardlaw Center and the board);
 *   Mistercontributer, "East Stands of Bobby Dodd Stadium.jpg" (CC BY-SA
 *     3.0, 2013; the east upper deck over Techwood Drive);
 *   Maxicar, "Boddy Dod Stadium from Tech terrace..jpg" (2014; the whole
 *     bowl from the north-west).
 * Estimated: the glass band heights (photos); the light rigs drawn as
 *   solid frames; the south-west corner block.
 * Left out: lettering, the GT logo, railings.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { add, box, loftSections, mul, prism, quad, rayHit, triangulate, unit, type XY } from './dc-nationals-park'

const seats = new Part(), stone = new Part(), brick = new Part(), steel = new Part(), glass = new Part(), roof = new Part()

type Sec = [number, number, Part | null] // offset outward from the front line, height, part of the edge to the next point

/**
 * A straight stand: front line from A to B (on the field side), sections
 * offset along the outward normal `n`. `ka`/`kb` splay the ends: a point at
 * offset d moves d·k along the line (negative toward the other end), so
 * two stands can meet at a mitre.
 */
function stand(A: XY, B: XY, n: XY, sec: Sec[], ka = 0, kb = 0, cap: Part | null = stone) {
  const e = unit([B[0] - A[0], B[1] - A[1], 0])
  const P = (end: 0 | 1, d: number, z: number): V3 => {
    const o = end ? B : A, k = end ? kb : ka, s = end ? 1 : -1
    return [o[0] + n[0] * d + e[0] * d * k * s, o[1] + n[1] * d + e[1] * d * k * s, z]
  }
  for (let i = 0; i < sec.length - 1; i++) {
    const [d0, z0, part] = sec[i], [d1, z1] = sec[i + 1]
    if (!part) continue
    const hint: V3 = [-(z1 - z0) * n[0], -(z1 - z0) * n[1], d1 - d0] // left of travel, outward-up
    quad(part, [P(0, d0, z0), P(1, d0, z0), P(1, d1, z1), P(0, d1, z1)], hint)
  }
  if (cap) for (const end of [0, 1] as const) {
    const poly: XY[] = sec.map(([d, z]) => [d, z])
    const out: V3 = end ? e : mul(e, -1)
    for (const [a, b, c] of triangulate(poly)) {
      const T = [poly[a], poly[b], poly[c]].map(([d, z]) => P(end, d, z))
      quad(cap, [T[0], T[1], T[2], T[2]], out)
    }
  }
}

/** A seat rake from (d0, z0) to (d1, z1) in n treads, each ending in a grey riser lip. */
function rake(d0: number, z0: number, d1: number, z1: number, n: number, end: Part | null, lip = 0.8): Sec[] {
  const out: Sec[] = []
  for (let i = 1; i <= n; i++) {
    const d = d0 + ((d1 - d0) * i) / n, z = z0 + ((z1 - z0) * i) / n
    out.push([d, z - lip, roof], [d, z, i === n ? end : seats])
  }
  return out
}

/**
 * A stand profile: lower bowl to (lw, zl), a 4 m grey concourse band,
 * the face (glass to zf, a dark lip to zu0), the upper deck to the back
 * (zu1), then the back: a wall, or a raked underside ud back and down to uz.
 */
type Prof = { lw: number; zl: number; zf: number; zu0: number; zu1: number; ud: number; uz: number }
const WESTP: Prof = { lw: 29.5, zl: 14, zf: 22.5, zu0: 25, zu1: 34.5, ud: 0.3, uz: 1 }
const EASTP: Prof = { lw: 19, zl: 6.5, zf: 12, zu0: 13, zu1: 26.5, ud: 10.8, uz: 12 }
const NORTHP: Prof = { lw: 22, zl: 11, zf: 18, zu0: 19, zu1: 36.5, ud: 14, uz: 15 }
function profile(D: number, p: Prof): Sec[] {
  const c = p.lw + 4
  return [
    [0, 0, brick], [0, 1.2, seats], // the low brick field wall
    ...rake(0, 1.2, p.lw, p.zl, 5, roof), // lower bowl
    [c, p.zl, glass], // concourse band; then the press, suite or club glass
    [c, p.zf, steel], // the upper deck's dark lip
    [c, p.zu0, seats],
    ...rake(c, p.zu0, D - 0.8, p.zu1, 5, stone), // upper deck
    [D, p.zu1, stone], // back rail and wall
    [D, p.zu1 - 2, p.ud > 1 ? roof : stone],
    [D - p.ud, p.uz, stone], // raked underside (north, east) or wall foot
    [D - p.ud, 0, null],
  ]
}
const mix = (a: Prof, b: Prof, t: number): Prof => Object.fromEntries(Object.keys(a).map((k) => [k, (a as any)[k] * (1 - t) + (b as any)[k] * t])) as Prof

// West stand: front at x = -24.5, y -76 to 32; its north end mitred along
// the 75° ray of the north horseshoe (0.268 = cot 75°).
stand([-24.5, -76], [-24.5, 32.04], [-1, 0], profile(54.3, WESTP), 0, 0.268)
// East stand: front at x = 28, y -75 to 32, the upper deck raked over the
// Techwood Drive building (below).
stand([28, -75], [28, 32.04], [1, 0], profile(44.8, EASTP), 0, 0.268)
prism([[62, -75], [82.5, -75], [82.5, 32], [62, 32]], 0, 12, brick, roof) // the street building
prism([[62, 32], [82.5, 32], [82.6, 44.7], [79.5, 49.7], [79.6, 57], [62, 57]], 0, 18, brick, roof) // north-east block

// The north end: a horseshoe lofted round C = (1.75, 25), from the field's
// end and side walls out to a rounded back (x -78.5 to 72.5, y 112, corner
// radius 38, from NAIP and the lidar), its profile blending from the north
// stand's at the middle to the side stands' at ±75°.
{
  const C: XY = [1.75, 25]
  const FIELD: XY[] = [[-24.5, -80], [28, -80], [28, 54], [-24.5, 54]]
  const BACK: XY[] = [[-78.5, -80], [72.5, -80]]
  const R = 38
  for (let i = 0; i <= 6; i++) { const t = (i / 6) * (Math.PI / 2); BACK.push([72.5 - R + R * Math.cos(t), 112 - R + R * Math.sin(t)]) }
  for (let i = 0; i <= 6; i++) { const t = Math.PI / 2 + (i / 6) * (Math.PI / 2); BACK.push([-78.5 + R + R * Math.cos(t), 112 - R + R * Math.sin(t)]) }
  const dir = (a: number): XY => [Math.sin((a * Math.PI) / 180), Math.cos((a * Math.PI) / 180)]
  const angles: number[] = []
  for (let a = -75; a <= 75; a += 5) angles.push(a)
  loftSections(C, angles, angles.map((a) => {
    const rf = rayHit(FIELD, C, dir(a)), rb = rayHit(BACK, C, dir(a))
    const t = Math.max(0, Math.min(1, (Math.abs(a) - 35) / 40))
    return profile(rb - rf, mix(NORTHP, a < 0 ? WESTP : EASTP, t)).map(([d, z, part]) => ({ r: rf + d, z, part }))
  }), null)
}

// South end-zone seats, y -71 to -86.
stand([45, -71], [-25, -71], [0, -1], [[0, 0, brick], [0, 1.2, seats], ...rake(0, 1.2, 15, 6, 3, stone), [15.5, 6, stone], [15.5, 0, null]])
// Wardlaw Center (OSM outline), 19 m, brick, its north face glass.
const WARDLAW: XY[] = [[4.3, -93.4], [22.9, -93.3], [22.9, -92.5], [42.8, -92.6], [49.7, -92.6], [57.9, -108.8], [54.7, -110.3], [43.2, -114.6], [37.5, -116.1], [29.8, -117.8], [22.4, -118.7], [15.4, -118.9], [9.8, -118.8], [3.4, -118.5], [-3.5, -117.5], [-9.1, -116.2], [-16.9, -114.1], [-23.8, -111.5], [-31.0, -108.3], [-22.6, -92.1]]
prism(WARDLAW, 0, 19, brick, roof)
prism(WARDLAW, 19, 19.8, stone, roof) // precast cornice
for (const [z0, z1] of [[7, 11.5], [12.5, 17]]) quad(glass, [[-21, -92.04, z0], [48, -92.54, z0], [48, -92.54, z1], [-21, -92.04, z1]], [0, 1, 0])
// The video board on its roof, facing the field (lidar: top 33 m).
box(steel, [15, -97, 26.5], [[1, 0, 0], [0, 1, 0], [0, 0, 1]], [11, 1.5, 6.5], true)
box(glass, [15, -95.45, 26.8], [[1, 0, 0], [0, 1, 0], [0, 0, 1]], [10, 0.05, 5.6])
// South-west corner block between the west stand and Wardlaw (lidar 14-28 m).
prism([[-59.5, -82], [-24.5, -82], [-24.5, -92], [-31, -108.3], [-59.5, -96.5]], 0, 16, brick, roof)

// Light rigs: a white lattice frame drawn solid, on steel legs.
function rig(x: number, y: number, z0: number, top: number, face: XY) {
  const n: V3 = [face[0], face[1], 0], t: V3 = [face[1], -face[0], 0]
  box(steel, [x, y, (z0 + top - 5) / 2], [t, n, [0, 0, 1]], [0.6, 0.6, (top - 5 - z0) / 2])
  box(steel, [x, y, top - 2.5], [t, n, [0, 0, 1]], [5, 0.9, 2.5], true)
  box(stone, add([x, y, top - 2.5], mul(n, 0.95)), [t, n, [0, 0, 1]], [4.7, 0.05, 2.2])
}
for (const y of [20, -18, -56]) rig(-77, y, 34.5, 48, [1, 0])
for (const y of [22, -24, -54]) rig(71, y, 26.5, 33.5, [-1, 0])

// ---------------------------------------------------------------------------
const parts = [
  { part: seats, material: finish('dodd-aluminium', 0xd7dbe0) },
  { part: stone, material: PALETTE.stone },
  { part: brick, material: finish('dodd-brick', 0xae6a58) },
  { part: steel, material: finish('dodd-navy-steel', 0x4b5466) },
  { part: glass, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (import.meta.main) {
  for (const { part, material } of parts) console.log(material.name.padEnd(20), part.triangles)
  if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
  const glb = writeGlb('Bobby Dodd Stadium', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
    bearing: 0, osm: 'way/618966004', height: 48,
  })
  if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
  const out = new URL('../models/atl-bobby-dodd-stadium.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}
