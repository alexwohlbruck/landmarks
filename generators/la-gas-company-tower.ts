/**
 * Gas Company Tower (1991, Richard Keating / SOM), Los Angeles — original
 * procedural geometry, CC0-1.0.
 * bun generators/la-gas-company-tower.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres; origin at the centroid of the
 * OSM outline (way/427532192) on the lowest ground under it (the Olive
 * Street end). Placed at bearing 38°, so here +x runs along the tower's long
 * axis to the south-east (Olive St) and +y to the north-east.
 *
 * A grey granite slab, 63 × 38 m, cut into blocks of different heights
 * around a core of blue glass. The core shows as a glass slot down the middle
 * of each face and rises above the granite as the crown: a lens ("leaf")
 * in plan, pointed at both ends, whose glass rim arches up highest in the
 * middle, like a flame. The blue crown is the landmark's identity.
 *
 * Sources:
 * - Plan: LA County LARIAC 2020 lidar footprint 484947840722 (tower faces
 *   at u −37.4 / +26, v −20 / +18.3 in the building frame; the 2.2 m notch
 *   for the north-east slot at u −10…6.7; the leaf's tip poking through the
 *   north-west face at v −3). The leaf's plan is read off the LA County
 *   2011 and 2013 aerials (LACounty_Aerial_2011/2013 export, EPSG:3857),
 *   which show its two arcs and the helipad on its deck.
 * - Heights: LARIAC 2020 max 227.0 m over its footprint ground, roof
 *   elevation 316.1 m; USGS 3DEP / LARIAC 2006 bare earth under the footprint
 *   runs from 86.5 m (Olive St) to 98.4 m (Grand Ave), so the top is ≈ 229.6
 *   m over the lowest ground. Published 228.3 m (Wikipedia). Tier heights
 *   from the LARIAC 2006 DSM (sampled at 3 m and resampled into the building
 *   frame): south-west granite 196 m, north-east granite 212 m, core 220 m,
 *   crown 229 m, the south-west slot's floor 148 m, the north-east slot's 127 m.
 * - Photos (sides named from the neighbours in them): g1 "Gas Company Tower"
 *   (Nikkul, CC BY-SA 2.0; from Pershing Square over the Biltmore's wings,
 *   the south-east end face with the north-east face in shade), g4 "Los
 *   Angeles downtown p1000070" (CC BY-SA 2.0 fr; from Pershing Square, south-
 *   east), g2 "Citibank Center, US Bank Tower and The Gas Company Tower"
 *   (Selvingarcia, CC BY-SA 3.0; from the Central Library, south-west face),
 *   g9 "Downtown Los Angeles Skyscrapers" (BDS2006, CC BY-SA 3.0; from Angels
 *   Flight, north-east face), g7 "Gas Company Tower, Los Angeles" (Ken Lund,
 *   Flickr CC BY-SA 2.0; from the east).
 *
 * Estimated: the crown's rim, drawn as a convex arc highest mid-length
 *   (the DSM's 232 m peak is central; g7 and g9 show the arch), the
 *   south-east end (no lidar notch there; drawn plain), the slots on the two
 *   end faces (from g1/g4, depth 2 m), the bay rhythm (4.6 m bays, three
 *   floors to a window panel, from g1).
 * Left out: the Deloitte sign, the helipad marking, the lobby canopies.
 * The 4-storey podium is left to its OSM part (way/1307813288), except the
 * stretch the OSM tower part covers, drawn here as a 22 m block.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'

type XY = [number, number]

const granite = new Part(), win = new Part(), blue = new Part(), terrace = new Part(), podium = new Part()

const BEARING = 38
// Building frame (u along 128°, v along 38°) is centred on C, which sits at
// (−10.61, −3.47) from the outline centroid in this frame.
const C: XY = [-10.61, -3.47]
const FLOOR = 4.1, GROUP = 2 * FLOOR, BAY = 9.2, PIER = 1.6, SPANDREL = 2.6, PROUD = 0.05
const BEVEL = 0.5

/** Ground over the lowest point: 0 at the Olive St end (u 26), 12 m at Grand Ave (u −37). */
const groundAt = (u: number) => Math.max(0, Math.min(12, (26 - u) * 0.19))

const P = (u: number, v: number): XY => [u + C[0], v + C[1]]
const at = (p: XY, z: number): V3 => [p[0], p[1], z]
const outward = (a: XY, b: XY): XY => {
  const l = Math.hypot(b[0] - a[0], b[1] - a[1])
  return [(b[1] - a[1]) / l, -(b[0] - a[0]) / l]
}

/** Triangulate a simple counter-clockwise polygon (ear clipping). */
function triangulate(pts: XY[]): [number, number, number][] {
  const idx = pts.map((_, i) => i), tris: [number, number, number][] = []
  const cross = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inside = (p: XY, a: XY, b: XY, c: XY) => cross(a, b, p) > 1e-9 && cross(b, c, p) > 1e-9 && cross(c, a, p) > 1e-9
  let guard = 0
  while (idx.length > 3 && guard++ < 10000) {
    let cut = false
    for (let k = 0; k < idx.length; k++) {
      const i0 = idx[(k + idx.length - 1) % idx.length], i1 = idx[k], i2 = idx[(k + 1) % idx.length]
      const a = pts[i0], b = pts[i1], c = pts[i2]
      if (cross(a, b, c) <= 1e-9) continue
      if (idx.some((j) => j !== i0 && j !== i1 && j !== i2 && inside(pts[j], a, b, c))) continue
      tris.push([i0, i1, i2]); idx.splice(k, 1); cut = true; break
    }
    if (!cut) break
  }
  if (idx.length === 3) tris.push([idx[0], idx[1], idx[2]])
  return tris
}

/** Inset a counter-clockwise ring by d, mitred. */
function inset(pts: XY[], d: number): XY[] {
  const n = pts.length
  return pts.map((p, i) => {
    const a = pts[(i + n - 1) % n], b = pts[(i + 1) % n]
    const n1 = outward(a, p), n2 = outward(p, b)
    const k = 1 + n1[0] * n2[0] + n1[1] * n2[1]
    return [p[0] - ((n1[0] + n2[0]) * d) / k, p[1] - ((n1[1] + n2[1]) * d) / k] as XY
  })
}

function capRing(part: Part, pts: XY[], z: number) {
  for (const [i, j, k] of triangulate(pts)) part.tri(at(pts[i], z), at(pts[j], z), at(pts[k], z))
}

type Opts = { windows?: boolean; top?: Part; skip?: (a: XY, b: XY) => boolean }
/**
 * A granite block from z0 to z1 on a counter-clockwise ring given in the
 * building frame, with a bevelled lip and a roof, and window panels: one per
 * 4.6 m bay, three floors tall, starting above the local ground.
 */
function block(ringUV: XY[], z0: number, z1: number, o: Opts = {}) {
  const pts = ringUV.map(([u, v]) => P(u, v))
  const n = pts.length, top = z1 - BEVEL
  for (let i = 0; i < n; i++) {
    const a = pts[i], b = pts[(i + 1) % n], ua = ringUV[i], ub = ringUV[(i + 1) % n]
    granite.quad(at(a, z0), at(b, z0), at(b, top), at(a, top))
    if (o.windows === false || onSlotBack(ua, ub)) continue
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const bays = Math.floor((L - 1.6) / BAY)
    if (bays < 1) continue
    const ou = outward(a, b), t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
    const margin = (L - bays * BAY) / 2
    const ground = Math.max(groundAt(ua[0]), groundAt(ub[0]))
    for (let k = 0; k < bays; k++) {
      const s0 = margin + k * BAY + PIER / 2, s1 = margin + (k + 1) * BAY - PIER / 2
      const p = (s: number): XY => [a[0] + t[0] * s + ou[0] * PROUD, a[1] + t[1] * s + ou[1] * PROUD]
      for (let g = 0; ; g++) {
        let lo = 6 + g * GROUP + SPANDREL / 2, hi = 6 + (g + 1) * GROUP - SPANDREL / 2
        if (lo > top - 4) break
        lo = Math.max(lo, z0 + 1.3); hi = Math.min(hi, top - 1.3)
        if (hi - lo < 3.5 || lo < ground + 7) continue
        win.quad(at(p(s0), lo), at(p(s1), lo), at(p(s1), hi), at(p(s0), hi))
      }
    }
  }
  const inner = inset(pts, BEVEL)
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    granite.quad(at(pts[i], top), at(pts[j], top), at(inner[j], z1), at(inner[i], z1))
  }
  capRing(o.top ?? terrace, inner, z1)
}

/** The back wall of a slot carries the slot's glass, not windows. */
const onSlotBack = (a: XY, b: XY) =>
  (a[1] === b[1] && (a[1] === V0 + D || a[1] === V1 - D)) || (a[0] === b[0] && (a[0] === U0 + D || a[0] === U1 - D))

/** A blue glass wall panel recessed into a slot, from z0 to z1, between two building-frame points. */
function slotGlass(a: XY, b: XY, z0: number, z1: number) {
  const o = outward(a, b), d = 0.06
  const pa = P(a[0] + o[0] * d, a[1] + o[1] * d), pb = P(b[0] + o[0] * d, b[1] + o[1] * d)
  blue.quad(at(pa, z0), at(pb, z0), at(pb, z1), at(pa, z1))
}

// ---------- the shaft ----------
// Faces: NW u −37.4 (corners notched back to −33.6 beyond v −15.4 / 9.1),
// SE u 26, SW v −20, NE v 18.3. Slots 2 m deep: NE u −10…6.7 and NW
// v −7…1 from lidar; the plan turns on itself (180°), so the SW slot is the
// NE one mirrored (u −16.4…−3, left of centre seen from outside, as in every
// photo) and the SE slot the NW one (v −2.7…5.3). The leaf's tips sit in the
// end slots and poke through the faces by a metre (lidar, NW end).
const U0 = -37.4, U1 = 26, V0 = -20, V1 = 18.3, D = 2.5
const Z_SW = 196.5, Z_MID = 204, Z_NE = 212.5, Z_DECK = 224, Z_TIP = 229.6
const Z_SLOT_SW = 148, Z_SLOT_NE = 127, Z_SLOT_END = 150

// Lower shaft: the whole plan up to the lowest slot floor, with the slots
// already cut from there up as separate blocks above.
const lower: XY[] = [
  [-33.6, V0], [U1, V0], [U1, V1], [-33.6, V1], [-33.6, 9.1], [U0, 9.1], [U0, -15.4], [-33.6, -15.4],
]
block(lower, 0, Z_SLOT_NE)

// Above 127 m the north-east slot is open: the plan loses u −10…6.7, v > 16.3.
const midNE: XY[] = [
  [-33.6, V0], [U1, V0], [U1, V1], [6.7, V1], [6.7, V1 - D], [-10, V1 - D], [-10, V1], [-33.6, V1], [-33.6, 9.1],
  [U0, 9.1], [U0, -15.4], [-33.6, -15.4],
]
block(midNE, Z_SLOT_NE, Z_SLOT_SW)
slotGlass([6.7, V1 - D], [-10, V1 - D], Z_SLOT_NE, Z_SW)

// 148–196.5 m: all four slots open.
const mid: XY[] = [
  [-33.6, V0], [-16.4, V0], [-16.4, V0 + D], [-3, V0 + D], [-3, V0], [U1, V0],
  [U1, -2.7], [U1 - D, -2.7], [U1 - D, 5.3], [U1, 5.3], [U1, V1],
  [6.7, V1], [6.7, V1 - D], [-10, V1 - D], [-10, V1], [-33.6, V1], [-33.6, 9.1],
  [U0, 9.1], [U0, 1], [U0 + D, 1], [U0 + D, -7], [U0, -7], [U0, -15.4], [-33.6, -15.4],
]
block(mid, Z_SLOT_SW, Z_SW)
slotGlass([-16.4, V0 + D], [-3, V0 + D], Z_SLOT_SW, Z_SW)
slotGlass([U1 - D, -2.7], [U1 - D, 5.3], Z_SLOT_END, Z_MID)
slotGlass([U0 + D, 1], [U0 + D, -7], Z_SLOT_END, Z_MID)
// The end slots open at 150 m, two metres above the south-west one: a lintel.
// (Drawn as part of the block below; the glass starts at 150.)

// Above the south-west granite (196.5): the south-west strip v < −13 drops
// out; the rest carries on to 204, where the leaf's glass walls take over
// between the north-east band (to 212.5) and the crown.
// The long faces' slots cut on through these upper blocks to the leaf, so
// the glass reads as one piece from the slot to the crown (photos g1, g2, g9).
const upper: XY[] = [
  [-33.6, -13], [-16.4, -13], [-16.4, -8], [-3, -8], [-3, -13], [U1, -13],
  [U1, -2.7], [U1 - D, -2.7], [U1 - D, 5.3], [U1, 5.3], [U1, V1],
  [6.7, V1], [6.7, 9], [-10, 9], [-10, V1], [-33.6, V1], [-33.6, 9.1],
  [U0, 9.1], [U0, 1], [U0 + D, 1], [U0 + D, -7], [U0, -7], [U0, -13],
]
block(upper, Z_SW, Z_MID)
block([[-33.6, 9], [-10, 9], [-10, V1], [-33.6, V1]], Z_MID, Z_NE)
block([[6.7, 9], [U1, 9], [U1, V1], [6.7, V1]], Z_MID, Z_NE)

// ---------- the crown: the blue glass leaf ----------
// Two circular arcs between the tips, the north-east arc bulging 12 m and the
// south-west 9.5 m (aerials). The rim is lowest mid-length, at the core's
// roof plus a parapet, and sweeps up to both tips.
{
  const T0: XY = [-38.3, -3], T1: XY = [26.9, 1.3]
  const N = 14
  const chord = Math.hypot(T1[0] - T0[0], T1[1] - T0[1])
  const dir: XY = [(T1[0] - T0[0]) / chord, (T1[1] - T0[1]) / chord], nrm: XY = [-dir[1], dir[0]]
  const arc = (bulge: number, side: 1 | -1): XY[] => {
    const pts: XY[] = []
    for (let i = 0; i <= N; i++) {
      const s = i / N, w = side * bulge * (1 - (2 * s - 1) ** 2) // parabolic arc, close to circular at this bulge
      pts.push([T0[0] + dir[0] * chord * s + nrm[0] * w, T0[1] + dir[1] * chord * s + nrm[1] * w])
    }
    return pts
  }
  const ne = arc(12, 1), sw = arc(9.5, -1)
  // counter-clockwise: SW arc from T0 to T1, then NE arc back
  const ring: { p: XY; s: number }[] = [
    ...sw.map((p, i) => ({ p, s: i / N })),
    ...ne.slice(1, -1).reverse().map((p, i) => ({ p, s: (N - 1 - i) / N })),
  ]
  const RIM = Z_DECK + 1.5
  // a convex arc: highest mid-length, falling to the tips (g7, g9, DSM peak)
  const rimZ = (s: number) => RIM + (Z_TIP - RIM) * Math.sqrt(Math.max(0, 1 - (2 * s - 1) ** 2))
  const DECK = Z_DECK
  const n = ring.length
  const world = ring.map(({ p }) => P(p[0], p[1]))
  // the glass walls run from the slot floors (hidden inside the granite) to the rim
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    const a = world[i], b = world[j], za = rimZ(ring[i].s), zb = rimZ(ring[j].s)
    blue.quad(at(a, Z_SLOT_SW), at(b, Z_SLOT_SW), at(b, zb), at(a, za))
    // inner face of the rim, down to the deck
    blue.quad(at(b, DECK), at(a, DECK), at(a, za), at(b, zb))
  }
  // the deck, inset by the rim's thickness
  const deck = inset(world, 0.4)
  capRing(terrace, deck, DECK)
  // the rim's top edge, a thin band between outer and inner rings
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    blue.quad(at(world[i], rimZ(ring[i].s)), at(world[j], rimZ(ring[j].s)), at(deck[j], rimZ(ring[j].s)), at(deck[i], rimZ(ring[i].s)))
  }
}

// ---------- the podium ----------
// The OSM tower part (way/495115501) runs on past the tower's south-east
// face to u 41.9 over the lobby podium; the model replaces it, so it draws
// that stretch as a plain 22 m block (DSM). The rest of the 4-storey podium
// is its own OSM part (way/1307813288), left to the map.
{
  const ring: XY[] = [[U1, V0], [41.7, V0], [41.9, 8.8], [U1, 8.8]]
  const pts = ring.map(([u, v]) => P(u, v)), n = pts.length, Z = 22
  for (let i = 0; i < n; i++) {
    const a = pts[i], b = pts[(i + 1) % n]
    podium.quad(at(a, 0), at(b, 0), at(b, Z - 0.4), at(a, Z - 0.4))
  }
  const inner = inset(pts, 0.4)
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    podium.quad(at(pts[i], Z - 0.4), at(pts[j], Z - 0.4), at(inner[j], Z), at(inner[i], Z))
  }
  capRing(terrace, inner, Z)
}

const parts = [
  { part: granite, material: finish('gct-granite', 0xd6d8d9) },
  { part: podium, material: PALETTE.stone },
  { part: win, material: PALETTE.window },
  { part: blue, material: windowVariant(2, 0x7092cc) },
  { part: terrace, material: PALETTE.roof },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Gas Company Tower', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, height: Z_TIP,
  frame: 'Y up, -Z north, +X east, metres; origin at the anchor on the ground',
  replaces: ['way/427532192', 'way/495115501'],
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = process.argv[2] ?? new URL('../models/la-gas-company-tower.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
