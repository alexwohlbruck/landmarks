/**
 * 1180 Peachtree (Symphony Tower), Atlanta (2006, Pickard Chilton with
 * Kendall/Heaton) — original procedural geometry, CC0-1.0.
 * bun generators/atl-1180-peachtree.ts [out.glb]
 *
 * Uses the kit in atl-one-atlantic-center.ts.
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = area centroid of the OSM outline way/885660351 (tower
 * and its 14-storey podium to the west), 33.786925, -84.384160. Bearing 0:
 * the outline is square to the compass. The tower is the east part, x from
 * -2.9 to 58.8 m; the podium runs west to x = -66.9 m.
 *
 * What makes it recognisable (Mark Larson's, AAK's, AtlChampion's and Marc
 * Merlin's photos):
 *  - a slab of light, sky-reflecting blue-green glass, long east–west, its
 *    long north and south faces carried up past the roof as two glass
 *    "sails" that curve inward towards the top, so from the east or west the
 *    top reads as two blades with a V between them;
 *  - a vertical slot splitting each long face in two;
 *  - the white steel truss between the blades above the roof, seen from the
 *    ends; and dense pale vertical fins on the glass;
 *  - at night a blue line of light up the slot and the crown lit blue-white
 *    from inside (Royian's night photo), drawn as one `neon` material.
 *
 * Evidence:
 *  - plan: OSM way/885660351 and its parts: tower way/1451518608
 *    (x -2.9…55.1, y ±14.5) with the east end bay to 58.8 for |y| ≤ 11; the
 *    sails way/1451518603 and way/1451518604 (y ±14.5…17.3, "round" roof);
 *    podium parts way/885660381, 1424485362/63 (12–14 storeys),
 *    885660360/1424485364 (11-storey strips on the north and south),
 *    1451133448/49, 1451518605/06/07 (rooftop), 1424485361 (two-storey round
 *    west end), (way/885660367, 885660371 and 1425865493 lie outside the outline).
 *  - heights: USGS 3DEP lidar GA_Statewide_B2_2018 (2018 flight), 1 m grid,
 *    above y = 0 at 292.5 m (the lowest ground under the footprint, at the
 *    podium's west end; the tower's own street is about 4.5 m higher): sail
 *    tops 202 m, flat along their length and 4 m wide, at y = ±8…12; the
 *    sails' outer faces leave y = ±17.3 at about 145 m and pass ±16 at 170 m
 *    and ±13 at 190 m (fitted to a circle of radius 231 m); main roof 166 m,
 *    rooftop plant 177 m, end frames 175 m; the slot at x ≈ 25; podium roof
 *    64 m, its north and south strips 50 m, rooftop pavilion 68 m, round west
 *    end about 15 m. Published height 200 m (657 ft, 41 floors, Wikipedia).
 *  - truss layout, fin spacing and glass grouping: estimated from AAK's and
 *    AtlChampion's photos.
 *  - colours: light reflective blue glass (a light windowVariant, as
 *    STYLE.md asks for), white fins and truss; the podium's glass darker.
 *  - elevation 0; the tower's base sinks about 4.5 m into its street.
 *
 * Photos (EVIDENCE):
 *  - 1180_Peachtree.jpg and Promenade_2-1180_Peachtree.jpg, Mark Larson,
 *    CC BY-SA 2.0, https://commons.wikimedia.org/wiki/File:1180_Peachtree.jpg
 *  - Promenade_2,_1180_Peachtree_cropped.jpg, AAK, CC BY-SA 4.0,
 *    https://commons.wikimedia.org/wiki/File:Promenade_2,_1180_Peachtree_cropped.jpg
 *    (from the west: both blades and the truss)
 *  - A1180PchtrMT2511-0726.jpg, AtlChampion, CC BY-SA 4.0,
 *    https://commons.wikimedia.org/wiki/File:A1180PchtrMT2511-0726.jpg
 *  - Symphony_Tower.jpg, Atlantacitizen, CC BY-SA 3.0,
 *    https://commons.wikimedia.org/wiki/File:Symphony_Tower.jpg
 *  - View_of_the_midtown_Atlanta_skyline_from_Freedom_Parkway_above_the_Eastside_Trail.jpg,
 *    Marc Merlin, CC BY-SA 4.0 (from the south-east)
 *  - Midtown_Atlanta_skyline_from_Piedmont_Park,_March_2018_1.jpg,
 *    Thomson200, CC0 (from the east: the two blades)
 *  - Atlanta_Midtown_at_night.jpg, Royian, CC BY-SA 4.0 (night)
 * Look-only (not relied on): "1180 Peachtree, Symphony Tower", ucumari
 * photography, CC BY-NC-ND 2.0. No commercial imagery.
 *
 * Doubts: the truss is drawn as a few bold members, not its real lattice.
 * The lidar puts the end frames 2–3 m west of OSM; OSM is followed. The
 * podium's facades are simplified to glass bands on a pale frame, and its
 * rooftop terrace and trees are left out. The KING & SPALDING letters are
 * left off.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, windowVariant, finish } from './palette'
import { type XY, wall, ringWalls, capPoly, panels, prism, write } from './atl-one-atlantic-center'

const skin = new Part(), fins = new Part(), podGlass = new Part(), neon = new Part(), roof = new Part()

// ─── tower ───
const X0 = -2.9, X1 = 55.1, SEAM = 25.5, GAP = 1.6
const YB = 14.5, YO = 17.3, T = 2.8 // body face, sail outer face, sail thickness
const ROOF = 166, PLANT = 177, FRAME = 175, TOP = 202.2
const Z0 = 125, R = 425
const yOut = (z: number) => (z <= Z0 ? YO : YO - (z - Z0) ** 2 / (2 * R))
const ZS = [0, Z0, 140, 155, 168, 180, 190, 197, TOP]

/** One sail half, north (s = 1) or south (s = -1), between xa and xb. */
function sail(s: 1 | -1, xa: number, xb: number) {
  const P = (x: number, z: number, inner = false): V3 => [x, s * (yOut(z) - (inner ? T : 0)), z]
  for (let k = 0; k < ZS.length - 1; k++) {
    const z0 = ZS[k], z1 = ZS[k + 1]
    // outer face, wound to face out (+y for the north sail)
    const A = P(xa, z0), B = P(xb, z0), C = P(xb, z1), D = P(xa, z1)
    if (s > 0) skin.quad(B, A, D, C)
    else skin.quad(A, B, C, D)
    // inner face, only above the roof (below, the body fills it)
    if (z0 >= ROOF - 1 || z1 > ROOF) {
      const lo = Math.max(z0, ROOF)
      const a = P(xa, lo, true), b = P(xb, lo, true), c = P(xb, z1, true), d = P(xa, z1, true)
      if (s > 0) skin.quad(a, b, c, d)
      else skin.quad(b, a, d, c)
    }
    // end edges of the sail half
    for (const [x, dir] of [[xa, -1], [xb, 1]] as [number, number][]) {
      const lo = z0
      const o0 = P(x, lo), o1 = P(x, z1), i0 = P(x, lo, true), i1 = P(x, z1, true)
      const flip = (dir > 0) !== (s > 0)
      if (flip) skin.quad(o0, i0, i1, o1)
      else skin.quad(i0, o0, o1, i1)
    }
    // fins: pale vertical lines about 7 m apart on the outer face
    const n = Math.max(1, Math.round((xb - xa) / 7))
    for (let m = 1; m < n; m++) {
      const x = xa + (xb - xa) * m / n
      const off = 0.06
      const q = (xx: number, z: number): V3 => [xx, s * (yOut(z) + off), z]
      const a = q(x - 0.3, z0), b = q(x + 0.3, z0), c = q(x + 0.3, z1), d = q(x - 0.3, z1)
      if (s > 0) fins.quad(b, a, d, c)
      else fins.quad(a, b, c, d)
    }
  }
  // floor lines every three storeys (12.3 m) on the straight part
  for (let z = 12.3; z < Z0 - 2; z += 12.3) {
    const a: V3 = [xa, s * (YO + 0.06), z - 0.3], b: V3 = [xb, s * (YO + 0.06), z - 0.3]
    const c: V3 = [xb, s * (YO + 0.06), z + 0.3], d: V3 = [xa, s * (YO + 0.06), z + 0.3]
    if (s > 0) fins.quad(b, a, d, c)
    else fins.quad(a, b, c, d)
  }
  // top cap
  const ti = P(xa, TOP, true), to = P(xa, TOP), tb = P(xb, TOP), tbi = P(xb, TOP, true)
  if (s > 0) fins.quad(ti, tbi, tb, to)
  else fins.quad(to, tb, tbi, ti)
}
for (const s of [1, -1] as const) {
  sail(s, X0, SEAM - GAP / 2)
  sail(s, SEAM + GAP / 2, X1)
  // the slot: a lit strip set 0.4 m into the gap, following the sail's curve
  for (let k = 0; k < ZS.length - 1; k++) {
    const z0 = ZS[k], z1 = ZS[k + 1]
    const q = (x: number, z: number): V3 => [x, s * (yOut(z) - 0.4), z]
    const a = q(SEAM - GAP / 2, z0), b = q(SEAM + GAP / 2, z0), c = q(SEAM + GAP / 2, z1), d = q(SEAM - GAP / 2, z1)
    if (s > 0) neon.quad(b, a, d, c)
    else neon.quad(a, b, c, d)
  }
}

// body ends (east and west faces) and roof
const body: XY[] = [[X0, -YB], [X1, -YB], [X1, YB], [X0, YB]]
wall(skin, body[1], body[2], 0, ROOF)
wall(skin, body[3], body[0], 0, ROOF)
capPoly(roof, body, ROOF)
prism(roof, [[8, -5.5], [44, -5.5], [44, 5.5], [8, 5.5]], ROOF, PLANT, roof, 0.4)

// end frames, east and west, |y| ≤ 11, to 175 m: glass with dense fins
for (const [xa, xb] of [[X1, 58.8], [-6.6, X0]] as [number, number][]) {
  const r: XY[] = [[xa, -11], [xb, -11], [xb, 11], [xa, 11]]
  ringWalls(skin, r, 0, FRAME)
  capPoly(fins, r, FRAME)
  const xf = xa === X1 ? xb : xa, sgn = xa === X1 ? 1 : -1
  for (let k = -5; k <= 5; k++) {
    const y = k * 2.0
    const a: XY = [xf + sgn * 0.06, y - sgn * 0.3], b: XY = [xf + sgn * 0.06, y + sgn * 0.3]
    wall(fins, a, b, 0, FRAME)
  }
}

// the truss between the blades, above the roof, at both ends and at the slot
function bar(a: V3, b: V3, w = 1.3) {
  // a square member from a to b, in the x = const plane, w thick
  const d: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]]
  const l = Math.hypot(d[1], d[2])
  const ny = -d[2] / l * w / 2, nz = d[1] / l * w / 2, hx = w / 2
  const c = (p: V3, sy: number, sx: number): V3 => [p[0] + sx * hx, p[1] + sy * ny, p[2] + sy * nz]
  const r0 = [c(a, -1, -1), c(a, 1, -1), c(a, 1, 1), c(a, -1, 1)], r1 = [c(b, -1, -1), c(b, 1, -1), c(b, 1, 1), c(b, -1, 1)]
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    neon.quad(r0[i], r0[j], r1[j], r1[i])
    neon.quad(r0[j], r0[i], r1[i], r1[j])
  }
}
// The ends above the roof. Each end carries one blade-shaped glass panel,
// continuing the end facade up to its sail's tip, and leaves the other half
// open on the white truss: the north half glazed at the west end and the
// south half at the east end (AAK's photo from the west, Thomson200's from
// the east), so the crown turns end for end.
const yi = (z: number) => yOut(z) - T
const V = 186 // the bottom of the V between the blades
const halfProfile = (): [number, number][] => {
  const pts: [number, number][] = [[0, ROOF], [yi(ROOF), ROOF]]
  for (const z of ZS) if (z > ROOF) pts.push([yi(z), z])
  pts.push([0, V])
  return pts
}
/** A flat polygon in the plane x, given as (y, z) points, facing +x or -x. */
function endPanel(p: Part, x: number, s: 1 | -1, facing: 1 | -1) {
  const q = halfProfile().map(([y, z]) => [x, s * y, z] as V3)
  // the (y, z) profile runs counter-clockwise seen from +x when s = 1
  const ccwFromPlusX = s > 0
  const pts = ccwFromPlusX === (facing > 0) ? q : [...q].reverse()
  for (let i = 1; i < pts.length - 1; i++) p.tri(pts[0], pts[i], pts[i + 1])
}
for (const [x, facing, glassSide] of [[X0, -1, 1], [X1, 1, -1]] as [number, 1 | -1, 1 | -1][]) {
  endPanel(skin, x, glassSide, facing)
  endPanel(skin, x - facing * 0.4, glassSide, (-facing) as 1 | -1) // its back, seen across the roof
  // the open half: a truss of bold members in the end plane
  const s = -glassSide, xm = x - facing * 0.6
  const P = (y: number, z: number): V3 => [xm, s * y, z]
  bar(P(0, ROOF), P(0, V))                     // post on the centre line
  bar(P(0, V), P(yi(TOP), TOP - 0.5))         // the blade's inner edge
  bar(P(0, ROOF + 0.5), P(yi(ROOF), ROOF + 0.5))
  bar(P(0, ROOF), P(yi(185), 185))             // diagonals
  bar(P(yi(ROOF), ROOF), P(0, V))
  bar(P(0, V - 9), P(yi(196), 196))
  bar(P(yi(ROOF), ROOF), P(yi(ROOF) * 0.5, V + 5))
  bar(P(0, V - 9), P(yi(ROOF), ROOF + 9))
  // and the chord along the sail's inner face
  for (let k = 0; k < ZS.length - 1; k++) if (ZS[k + 1] > ROOF) bar(P(yi(Math.max(ZS[k], ROOF)), Math.max(ZS[k], ROOF)), P(yi(ZS[k + 1]), ZS[k + 1]))
}

// ─── podium, x -66.9 … -2.9 ───
const podium = (ring: XY[], z1: number, bays = 3.6) => {
  ringWalls(fins, ring, 0, z1)
  ring.forEach((a, i) => {
    const b = ring[(i + 1) % ring.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L > 2.5) panels(podGlass, a, b, 4.5, z1 - 1.2, { group: 8.4, spandrel: 1.6, bays: Math.max(1, Math.round(L / bays)), pier: 0.7, origin: 0 })
  })
  capPoly(roof, ring, z1)
}
podium([[-55.5, -14.6], [-2.9, -14.6], [-2.9, 14.6], [-55.5, 14.6]], 64)
podium([[-46.4, 14.6], [-11.7, 14.6], [-11.7, 17.3], [-46.4, 17.3]], 50)
podium([[-46.4, -17.3], [-11.7, -17.3], [-11.7, -14.6], [-46.4, -14.6]], 50)
podium([[-46, -7], [-8, -7], [-8, 7], [-46, 7]], 68)
// the two-storey round west end, traced from OSM way/1424485361
podium([[-55.5, -10.0], [-55.5, -9.7], [-58, -8.6], [-60, -7.6], [-61.8, -6.7], [-64.3, -5.2], [-66.8, -3.5], [-66.9, 3.7], [-64.5, 5.2], [-61.9, 6.8], [-59.7, 8.0], [-57.7, 9.0], [-55.5, 10.0]].reverse() as XY[], 15)

void finish
await write('atl-1180-peachtree', '1180 Peachtree', [
  { part: skin, material: windowVariant(2, 0x9fbcd4) },
  { part: fins, material: PALETTE.trim },
  { part: podGlass, material: PALETTE.window },
  { part: neon, material: { name: 'neon-1180-crown', color: 0xb4d6ec, roughness: 0.6 } },
  { part: roof, material: PALETTE.roof },
], {
  bearing: 0, elevation: 0, height: 202.2,
  replaces: ['way/885660351', 'way/1451518608', 'way/1451518603', 'way/1451518604', 'way/885660381', 'way/885660360', 'way/1424485361', 'way/1424485362', 'way/1424485363', 'way/1424485364', 'way/1451133448', 'way/1451133449', 'way/1451518605', 'way/1451518606', 'way/1451518607'],
})
