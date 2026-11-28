/**
 * Living Shangri-La, 1128 West Georgia Street, Vancouver: procedural,
 * CC0-1.0, no textures.
 *   bun generators/van-living-shangri-la.ts
 *
 * The city's tallest building (2008, James K.M. Cheng), 201 m: a slender
 * glass tower on a near-triangular plan, its long hypotenuse face lined
 * with balconies, a glass box hung out on the east corner high up, and a
 * glass screen carried past the roof on the two street faces as the
 * crown's fin. The hotel in its lower floors was the Shangri-La Vancouver,
 * now the Hyatt Vancouver Downtown Alberni (OSM's name; old_name
 * Shangri-La Vancouver), so the display name is the building's.
 *
 * Map frame: x east', y north', z up, metres, turned to bearing 45 (the
 * street grid). Anchor: the area centroid of OSM way/91998136,
 * lng -123.1237697, lat 49.2857163. Elevation 0.
 *
 * Evidence
 *  - OSM (ODbL): way/91998136 (building=hotel, height 201, 59 levels,
 *    hotel Q111231428); parts way/360939772 (the tower, 189), 360939774
 *    (201, the core), 360939775 (189-201, the screen along the two street
 *    faces), 360939773 (140-160, the hung box), 360939770 (50),
 *    360939769 and 360939771 (14), 360939768 (7).
 *  - City of Vancouver building-footprints-2009 (City 2009 lidar; Contains
 *    information licensed under the Open Government Licence - Vancouver),
 *    bldgid 149845: the tower's roof 188.5-193.0 m over its 30.8 m base
 *    (the tower was topped out by the flight), the podium 11.6-17.8 m.
 *    Used: roof 189.5, core 193, screen 201 (published, Wikipedia
 *    "Living Shangri-La", 201 m / 62 floors).
 *  - Photos (Wikimedia Commons, EVIDENCE):
 *    - klazu: Klazu, "Living Shangri-La from One Wall Centre.jpg",
 *      CC BY-SA 4.0 (from the south: the hung box, the crown screen).
 *      https://commons.wikimedia.org/wiki/File:Living_Shangri-La_from_One_Wall_Centre.jpg
 *    - darren: Darren Kirby, "Shangri La hotel and residences,
 *      Vancouver.jpg", CC BY-SA 3.0 (the balconied face and its edge).
 *      https://commons.wikimedia.org/wiki/File:Shangri_La_hotel_and_residences,_Vancouver.jpg
 *    - larose: Larry LaRose, "Living Shangri la - panoramio.jpg",
 *      CC BY-SA 3.0 (the balconies the full height).
 *      https://commons.wikimedia.org/wiki/File:Living_Shangri_la_-_panoramio.jpg
 *  No commercial imagery.
 *
 * Estimated, and doubts:
 *  - The curtain wall: plain blue-grey glass (lead review 1: the pale
 *    floor and mullion lines read as pinstripes and are gone).
 *  - Balconies on the hypotenuse face: sawtooth slabs every two floors
 *    (the real ones are every floor), 12 teeth 2.6 m deep (darren).
 *  - The plan (lead review 1 asked): OSM's tower part is a wedge, a
 *    41 x 34 m trapezoid with an acute prow at the west corner, not a
 *    slab. Kept: darren shows the broad glass face meeting a sharp edge
 *    lined with the sawtooth balconies (the hypotenuse face), and the
 *    2009 lidar puts all three roof facets over the wedge at 188-193 m.
 *    No licensed aerial resolves the plan better.
 *  - The podium's heights are OSM's (the lidar agrees within 4 m).
 *  - Night: the curtain wall is `window`, so it glows; the screen is glass
 *    and stays dark.
 */
import { Part, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { area, block, cap, panel, walls, type XY } from './chi-aon-center'

export const BEARING = 45
export const ANCHOR = { lng: -123.1237697, lat: 49.2857163 }
const ccw = (r: XY[]) => (area(r) < 0 ? [...r].reverse() : r)

const TOWER = ccw([[15.8, 17.7], [10.4, 17.6], [-25.6, 17.1], [-25.6, 15.9], [-28.5, 15.9], [-19.8, 7.2], [-21.0, 5.6], [-13.3, -2.0], [4.1, -18.4], [6.0, -16.5], [14.2, -16.1], [15.2, -16.0], [15.7, 11.7]])
const CORE = ccw([[-12.8, 14.9], [-12.7, 7.3], [-13.9, 7.3], [4.1, -18.4], [4.0, -5.9], [6.8, -5.9], [6.3, 7.7], [-1.3, 7.7], [-1.3, 15.0]])
const BOX = ccw([[10.4, 17.6], [10.4, 18.7], [16.7, 18.7], [16.7, 11.6], [15.7, 11.7], [15.8, 17.7]])
const P768 = ccw([[-20.2, -16.5], [1.4, -18.3], [-19.9, -20.0], [-21.3, -18.6]])
const P769 = ccw([[-15.9, -5.3], [1.5, -16.7], [1.4, -18.3], [-20.2, -16.5], [-21.7, -16.3]])
const P770 = ccw([[-15.9, -5.3], [-13.3, -2.0], [4.1, -18.4], [1.5, -16.7]])
const P771 = ccw([[15.8, 17.7], [15.7, 11.7], [15.2, -16.0], [15.1, -19.5], [20.2, -19.7], [20.8, 17.8]])
const Z_ROOF = 189.5, Z_CORE = 193, Z_FIN = 201

/** A curtain wall: glass walls with pale floor lines every `fl` m and mullions about `ml` m apart. */
function curtain(glass: Part, trim: Part, r: XY[], z0: number, z1: number, fl = 9.6, ml = 8, skip?: (a: XY, b: XY) => boolean) {
  walls(glass, r, z0, z1)
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 3 || skip?.(a, b)) continue
    for (let z = z0 + fl; z < z1 - 1; z += fl) panel(trim, a, b, 0, L, z - 0.25, z + 0.25, 0.05)
    const k = Math.max(1, Math.round(L / ml))
    for (let q = 1; q < k; q++) panel(trim, a, b, (q * L) / k - 0.18, (q * L) / k + 0.18, z0, z1, 0.05)
  }
}

function build() {
  const wall = new Part(), trim = new Part(), roof = new Part(), screen = new Part(), podium = new Part(), win = new Part()

  // podium
  for (const [r, z] of [[P768, 7], [P769, 14], [P771, 14]] as [XY[], number][]) {
    block(podium, roof, r, 0, z, 0.3)
    for (let i = 0; i < r.length; i++) {
      const a = r[i], b = r[(i + 1) % r.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
      if (L > 6 && z > 8) panel(win, a, b, 1, L - 1, 1.2, z - 1.6, 0.05)
    }
  }
  curtain(wall, trim, P770, 0, 50, 1e9, 1e9)
  cap(roof, P770, 50)

  // the tower
  curtain(wall, trim, TOWER, 0, Z_ROOF, 1e9, 1e9)
  cap(roof, TOWER, Z_ROOF)
  // the core's crown
  block(podium, roof, CORE, Z_ROOF - 0.5, Z_CORE, 0.3)
  // the hung glass box on the east corner, 140-160 m
  curtain(wall, trim, BOX, 140, 160, 1e9, 1e9)
  cap(roof, BOX, 160)
  cap(roof, BOX, 140, false)
  // the screen: glass carried past the roof on the two street faces (OSM way/360939775)
  {
    const A: XY = [-25.6, 17.1], B: XY = [15.8, 17.7], C: XY = [15.2, -16.0]
    for (const [p, q] of [[A, B], [B, C]] as [XY, XY][]) {
      const L = Math.hypot(q[0] - p[0], q[1] - p[1]), u: XY = [(q[0] - p[0]) / L, (q[1] - p[1]) / L], n: XY = [u[1], -u[0]]
      const P = (s: number, z: number, o: number): V3 => [p[0] + u[0] * s + n[0] * o, p[1] + u[1] * s + n[1] * o, z]
      screen.quad(P(0, Z_ROOF, 0), P(L, Z_ROOF, 0), P(L, Z_FIN, 0), P(0, Z_FIN, 0))
      screen.quad(P(L, Z_ROOF, -0.6), P(0, Z_ROOF, -0.6), P(0, Z_FIN, -0.6), P(L, Z_FIN, -0.6))
      trim.quad(P(0, Z_FIN, 0.05), P(L, Z_FIN, 0.05), P(L, Z_FIN, -0.65), P(0, Z_FIN, -0.65))
    }
  }
  // balconies on the hypotenuse face (darren): sawtooth slabs, each tooth
  // a triangle pointing out and along the face, one slab every two floors
  {
    const a: XY = [-28.5, 15.9], b: XY = [4.1, -18.4]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
    const mid: XY = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], c: XY = [0, 5]
    const sgn = (mid[0] - c[0]) * n[0] + (mid[1] - c[1]) * n[1] > 0 ? 1 : -1
    const Q = (s: number, o: number): XY => [a[0] + u[0] * s + n[0] * o * sgn, a[1] + u[1] * s + n[1] * o * sgn]
    const teeth = 12, tw = (L - 2) / teeth, depth = 2.6, t = 0.4
    // the outline, inner edge along the wall then the teeth back along the outside
    const ring: XY[] = [Q(1, 0), Q(L - 1, 0)]
    for (let k = teeth - 1; k >= 0; k--) { ring.push(Q(1 + (k + 1) * tw - 0.15, depth)); ring.push(Q(1 + k * tw, 0.25)) }
    const rr = area(ring) < 0 ? [...ring].reverse() : ring
    for (let z = 56; z < Z_ROOF - 3; z += 5.1) {
      walls(trim, rr, z, z + t)
      cap(trim, rr, z + t)
      cap(trim, rr, z, false)
    }
  }

  return [
    { part: wall, material: windowVariant(2, 0x7f97aa) as MaterialSpec },
    { part: trim, material: PALETTE.trim as MaterialSpec },
    { part: roof, material: PALETTE.roof as MaterialSpec },
    { part: screen, material: { ...PALETTE.glass, doubleSided: true } as MaterialSpec },
    { part: podium, material: finish('shangri-la-stone', 0xd9d6d0) as MaterialSpec },
    { part: win, material: PALETTE.window as MaterialSpec },
  ]
}

if (import.meta.main) {
  const parts = build().filter((x) => x.part.triangles > 0)
  const tris = parts.reduce((s, x) => s + x.part.triangles, 0)
  const glb = writeGlb('Living Shangri-La', parts, { frame: 'Y up, -Z north, +X east; metres; ground anchor', anchor: [ANCHOR.lat, ANCHOR.lng], bearing: BEARING })
  if (tris > 5000 || glb.length > 250_000) throw new Error(`budget: ${tris} triangles / ${glb.length} bytes`)
  const out = new URL('../models/van-living-shangri-la.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${tris} triangles, ${glb.length} bytes`)
}
