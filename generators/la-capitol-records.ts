/**
 * Capitol Records Building (1956, Welton Becket and Associates; Louis
 * Naidorf), Hollywood — original procedural geometry, CC0-1.0.
 * bun generators/la-capitol-records.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres; origin at the OSM outline's
 * centroid on the lowest ground under it (its south-west corner). Bearing 0:
 * the outline is square to north. Vine St is to the east (+x), Yucca St to
 * the north.
 *
 * What makes it the Capitol Records tower: a round tower stacked with wide
 * white sunshade discs, one per floor, so it reads as a stack of records on
 * a spindle; the dark glass bands between them, broken by white piers; the
 * crown, a dark sign ring around a small glass penthouse; and the tall white
 * spire rising from the back (north) of the roof.
 *
 * Sources:
 * - Plan: OSM way/422141102 (outline, 13 levels, 46.8 m) and its parts
 *   way/907834019 (the tower, a circle r ≈ 15.3 centred at (-0.4, 4.0)) and
 *   way/907834020 (the two-storey wing that wraps it). The wing is extruded
 *   from the whole outline; the tower stands inside it.
 * - Heights: LA County 2006 lidar surface model (2 m grid) over USGS 3DEP
 *   bare earth (lowest ground 119.0 m at the outline's south-west corner;
 *   the tower stands on ≈ 120.5 m): wing roof 7.3 m, tower roof 46.3 m,
 *   penthouse 53.3 m, a spire return of 79.3 m about 6 m north of the
 *   tower's centre, which places the spire at the penthouse's north edge
 *   (confirmed by the aerial p4). LARIAC 2020 footprint 202000150152: 45.1 m
 *   over its own ground. Published: 13 storeys, 150 ft (46 m) (Wikipedia).
 * - Floors: 13 storeys over 44.8 m, 3.45 m each. Photos p8 and p2 show 11
 *   glass bands with sunshades above a two-storey base, which the wing
 *   hides on every side except Vine St (photo p7: a plain white drum).
 * - Sunshade discs: projecting ≈ 1.4 m from the glass, with a fascia ≈ 1.3 m deep (photos p1, p8: about
 *   5% of the width each side), white on top, their outer edge turned down
 *   (at the silhouette each disc shows as a deep curved lip, p8). Twelve
 *   white piers round the tower (spacing measured on p1, ≈ 30°).
 * - Crown: from the aerial p4 — a ring of radius ≈ 9.7 m (0.65 of the
 *   tower) carrying the sign, dark charcoal, on a lighter frame; inside it a
 *   glazed penthouse of radius ≈ 6.6 m with a pale roof; a low white parapet
 *   at the roof edge. The spire: a tapering white needle, ≈ 2.2 m at its foot
 *   (photos p3, p9), to the lidar's 79.3 m.
 *
 * Photos (Wikimedia Commons): p1 "Capitol Records Building LA" (CC BY-SA
 * 2.0, from the east); p2 "Capitol Records Building, Hollywood (2573870208)"
 * (Rob Young, CC BY 2.0, from the south on Vine); p3 "Capitol Records
 * Building Hollywood" (Andreas Praefcke, CC BY 3.0, from the south on Vine);
 * p4 "The Capitol Records Tower, a major landmark near the corner of
 * Hollywood and Vine" (Carol M. Highsmith, public domain, aerial from the
 * south); p5 "Capitol Records Tower from 101 Freeway, Hollywood, CA (4)"
 * (RgtmPnoMn, CC BY-SA 4.0, from the south-east); p6 "Capitol Records
 * Building LA - panoramio" (Gfox228, CC BY 3.0); p7 "Capitol Records"
 * (Mechanicalastro, CC BY-SA 4.0, base at Vine, dusk); p8 "Capitol Records
 * Building en juillet 2022" (Benoît Prieur, CC0, from the south-east, the
 * sunshade detail); p9 "Detail of Architecture Including Capitol Records
 * Building" (Adam Jones, CC BY-SA 2.0, crown and spire).
 *
 * Glass: the real glass reads pale and reflective behind the white discs
 * (p3, p8), so it is the light sky grey-blue window variant.
 *
 * Estimated: the glass radius (13.9 m), the discs' lip depth, the crown's
 * proportions (from p4's oblique view), the wing's single roof height (the
 * lidar shows 7 m on the north and south wings; the small lobby on Vine may
 * be lower). Left out: the sign's lettering (the building is the landmark,
 * not the sign), the flagpole, the "Hollywood Jazz" mural on the south wing,
 * the wing's windows (no photo shows them clearly).
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'

type XY = [number, number]

const stone = new Part(), disc = new Part(), win = new Part(), roof = new Part(), sign = new Part(), glass = new Part()

const C: XY = [-0.4, 4.0] // tower centre
const R_GLASS = 13.9, R_DISC = 15.3, R_BASE = 15.0
const Z_GROUND = 1.5 // the tower's own ground over the lowest point
const FLOOR = 3.45
const Z_BASE = Z_GROUND + 2 * FLOOR // top of the two-storey base, 8.4
const Z_ROOF = 46.3
const WING_H = 7.3
const N = 32 // segments round the tower

const ang = (i: number, n = N) => (i / n) * 2 * Math.PI
const at = (r: number, a: number, z: number, c: XY = C): V3 => [c[0] + r * Math.cos(a), c[1] + r * Math.sin(a), z]
const rn = (a: number, nz = 0): V3 => {
  const k = Math.sqrt(1 - nz * nz)
  return [k * Math.cos(a), k * Math.sin(a), nz]
}

/**
 * A surface of revolution: `profile` is a list of (r, z) points, and `nz`
 * the z part of the normal at each (smooth round the axis, so the curved
 * faces shade round). Outward-facing when the profile runs downward on the
 * outside or inward along the top.
 */
function revolve(part: Part, profile: [number, number, number][], n = N, c: XY = C) {
  for (let i = 0; i < n; i++) {
    const a0 = ang(i, n), a1 = ang(i + 1, n)
    for (let k = 0; k < profile.length - 1; k++) {
      const [r0, z0, n0] = profile[k], [r1, z1, n1] = profile[k + 1]
      const p00 = at(r0, a0, z0, c), p01 = at(r0, a1, z0, c), p10 = at(r1, a0, z1, c), p11 = at(r1, a1, z1, c)
      const m00 = rn(a0, n0), m01 = rn(a1, n0), m10 = rn(a0, n1), m11 = rn(a1, n1)
      part.tri(p00, p10, p11, undefined, undefined, undefined, [m00, m10, m11])
      part.tri(p00, p11, p01, undefined, undefined, undefined, [m00, m11, m01])
    }
  }
}

/** A flat disc (or annulus) facing up. */
function ringCap(part: Part, r0: number, r1: number, z: number, n = N, c: XY = C) {
  for (let i = 0; i < n; i++) {
    const a0 = ang(i, n), a1 = ang(i + 1, n)
    if (r0 <= 0) part.tri([c[0], c[1], z], at(r1, a0, z, c), at(r1, a1, z, c))
    else part.quad(at(r0, a0, z, c), at(r1, a0, z, c), at(r1, a1, z, c), at(r0, a1, z, c))
  }
}

// ---------- the wing: the whole outline, two storeys ----------
const OUTLINE: XY[] = [
  [14.61, -6.91], [12.34, -6.96], [11.26, -8.37], [11.52, -27.95], [-15.57, -28.11], [-15.75, 4.93], [-15.35, 7.54],
  [-14.76, 9.43], [-13.79, 11.48], [-13.5, 26.63], [20.37, 26.85], [20.4, 21.74], [10.96, 21.68], [11.07, 17.42],
  [12.08, 15.38], [14.16, 13.42], [15.5, 10.89], [18.63, 10.39], [18.65, 7.32], [19.48, 7.53], [19.82, 6.06],
  [19.87, 3.64], [19.72, 0.59], [18.51, 0.57], [18.56, -2.42], [14.57, -2.4],
]

/** Ear-clipping triangulation of a simple polygon (counter-clockwise). */
function earcut(poly: XY[]): [number, number, number][] {
  const idx = poly.map((_, i) => i)
  const area = poly.reduce((s, p, i) => { const q = poly[(i + 1) % poly.length]; return s + p[0] * q[1] - q[0] * p[1] }, 0)
  if (area < 0) idx.reverse()
  const crossz = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inTri = (p: XY, a: XY, b: XY, c: XY) => crossz(a, b, p) >= 0 && crossz(b, c, p) >= 0 && crossz(c, a, p) >= 0
  const out: [number, number, number][] = []
  let guard = 0
  while (idx.length > 3 && guard++ < 10000) {
    let cut = false
    for (let i = 0; i < idx.length; i++) {
      const ia = idx[(i + idx.length - 1) % idx.length], ib = idx[i], ic = idx[(i + 1) % idx.length]
      const a = poly[ia], b = poly[ib], c = poly[ic]
      if (crossz(a, b, c) <= 1e-9) continue
      if (idx.some((j) => j !== ia && j !== ib && j !== ic && inTri(poly[j], a, b, c))) continue
      out.push([ia, ib, ic])
      idx.splice(i, 1)
      cut = true
      break
    }
    if (!cut) break
  }
  if (idx.length === 3) out.push([idx[0], idx[1], idx[2]])
  return out
}

function extrude(poly: XY[], z0: number, z1: number, wall: Part, top: Part) {
  const area = poly.reduce((s, p, i) => { const q = poly[(i + 1) % poly.length]; return s + p[0] * q[1] - q[0] * p[1] }, 0)
  const ccw = area > 0 ? poly : [...poly].reverse()
  for (let i = 0; i < ccw.length; i++) {
    const a = ccw[i], b = ccw[(i + 1) % ccw.length]
    wall.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
  }
  for (const [i, j, k] of earcut(ccw)) top.tri([ccw[i][0], ccw[i][1], z1], [ccw[j][0], ccw[j][1], z1], [ccw[k][0], ccw[k][1], z1])
}
extrude(OUTLINE, 0, WING_H - 0.5, stone, roof)
// a parapet lip: the wing's roof sits half a metre down inside a white rim,
// drawn as the same outline's walls carried up and a narrow top
{
  const ccw = OUTLINE
  for (let i = 0; i < ccw.length; i++) {
    const a = ccw[i], b = ccw[(i + 1) % ccw.length]
    stone.quad([a[0], a[1], WING_H - 0.5], [b[0], b[1], WING_H - 0.5], [b[0], b[1], WING_H], [a[0], a[1], WING_H])
    stone.quad([b[0], b[1], WING_H - 0.5], [a[0], a[1], WING_H - 0.5], [a[0], a[1], WING_H], [b[0], b[1], WING_H])
  }
}

// ---------- the tower ----------
// The two-storey base: a plain white drum, its top under the first disc.
revolve(stone, [[R_BASE, Z_BASE, 0], [R_BASE, 0, 0]])

// The glass: one smooth band behind every disc, base to roof.
revolve(win, [[R_GLASS, Z_ROOF, 0], [R_GLASS, Z_BASE, 0]])

// No piers: the real ones are slim and the discs dominate; drawn, they cut
// the glass into a grid of small panels that shimmers at map distance.

// Sunshade discs, one per floor from the base's top to the roof: a flat
// white top, the outer edge turned down in a rounded lip, an underside
// sloping back up to the glass.
const LIP = 1.5
for (let f = 0; f <= 11; f++) {
  const z = Z_BASE + f * FLOOR
  const top = z + 0.12
  revolve(disc, [
    [R_GLASS - 0.02, top, 1],
    [R_DISC - 0.12, top, 0.7],
    [R_DISC, top - 0.12, 0],
    [R_DISC, top - LIP + 0.15, 0],
    [R_DISC - 0.15, top - LIP, -0.7],
    [R_GLASS - 0.02, z - 0.35, -0.9],
  ])
}

// ---------- the crown ----------
// A low white parapet set back from the top disc, and the roof inside it.
const Z_TOPDISC = Z_ROOF + 0.12
revolve(stone, [[R_GLASS - 0.6, Z_TOPDISC + 0.9, 0], [R_GLASS - 0.6, Z_TOPDISC, 0]])
ringCap(stone, R_GLASS - 1.0, R_GLASS - 0.6, Z_TOPDISC + 0.9)
revolve(stone, [[R_GLASS - 1.0, Z_TOPDISC + 0.4, 0], [R_GLASS - 1.0, Z_TOPDISC + 0.9, 0]])
ringCap(roof, 0, R_GLASS - 1.0, Z_TOPDISC + 0.4)

// The sign ring: a light frame below, the dark sign band above, with an
// inner wall and a top so it reads from above too.
const R_RING = 10.5, T_RING = 0.35, Z_R0 = Z_TOPDISC + 0.4, Z_R1 = 47.7, Z_R2 = 51.0
revolve(roof, [[R_RING, Z_R1, 0], [R_RING, Z_R0, 0]], 32)
revolve(roof, [[R_RING - T_RING, Z_R0, 0], [R_RING - T_RING, Z_R1, 0]], 32)
revolve(sign, [[R_RING, Z_R2, 0], [R_RING, Z_R1, 0]], 32)
revolve(sign, [[R_RING - T_RING, Z_R1, 0], [R_RING - T_RING, Z_R2, 0]], 32)
ringCap(sign, R_RING - T_RING, R_RING, Z_R2, 32)

// The glazed penthouse inside it, with a pale band and a low domed roof.
const R_PH = 5.0
revolve(glass, [[R_PH, 51.5, 0], [R_PH, Z_R0, 0]], 24)
revolve(stone, [[R_PH + 0.15, 52.4, 0.3], [R_PH + 0.15, 51.5, 0]], 24)
revolve(stone, [[0.01, 53.2, 1], [3.0, 53.0, 0.95], [R_PH + 0.15, 52.4, 0.8]], 24)

// The spire: a tapering four-sided white needle standing at the penthouse's
// north edge, from the roof to the lidar's 79.3 m.
{
  const base: XY = [C[0] + 0.2, C[1] + 6.5]
  const z0 = Z_R0, z1 = 79.3, h0 = 0.8, h1 = 0.05
  const ring = (h: number, z: number): V3[] => [0, 1, 2, 3].map((k) => {
    const a = (k / 4) * 2 * Math.PI + Math.PI / 4
    return [base[0] + h * Math.SQRT2 * Math.cos(a), base[1] + h * Math.SQRT2 * Math.sin(a), z] as V3
  })
  const mid = 56
  const r0 = ring(h0, z0), r1 = ring(h0 * 0.85, mid), r2 = ring(h1, z1)
  disc.loft([r0, r1, r2])
  disc.cap(r2, true)
}

// ---------- write ----------
const parts = [
  { part: stone, material: PALETTE.stone },
  { part: disc, material: PALETTE.trim },
  { part: win, material: windowVariant(2, 0xa9bfd1) },
  { part: roof, material: PALETTE.roof },
  { part: sign, material: finish('capitol-sign', 0x4a4f57) },
  { part: glass, material: PALETTE.glass },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Capitol Records Building', parts, {
  license: 'CC0-1.0', bearing: 0, elevation: 0, height: 79.3,
  frame: 'Y up, -Z north, +X east, metres; origin at the anchor on the ground',
  replaces: ['way/422141102', 'way/907834019', 'way/907834020'],
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = process.argv[2] ?? new URL('../models/la-capitol-records.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
