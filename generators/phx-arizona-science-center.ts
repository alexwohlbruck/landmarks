/**
 * Arizona Science Center, Phoenix, Arizona (1997, Antoine Predock) —
 * original procedural geometry, CC0-1.0.
 * bun generators/phx-arizona-science-center.ts
 *
 * Map frame: x east, y north, z up, metres. Bearing 0: the building's
 * wings run east–west. Anchor -112.0665375, 33.4487630, the area centroid
 * of OSM's outline way/783489992, the only OSM building the model covers
 * (the pedestrian bridge way/109818835 to the south and its column parts
 * are left to the map; "Create at Arizona Science Center" way/783489993
 * to the north is a separate building).
 *
 * Identity (from the photos below):
 *  1. The silver wedge: a long metal-clad mass along the middle of the
 *     building, its sheer north face's top rising eastward to a 34 m
 *     end, the main entrance's glass at its foot.   (kpd, k11, lidar)
 *  2. The north "mesa": a battered, faceted grey concrete mass with a
 *     capping lip, in front of the wedge west of the entrance. (kpd, k11,
 *     v5, lidar: a rim at 18.9 round a lower roof)
 *  3. A taller copper-toned slab behind the mesa to the south-west, and
 *     a second battered concrete mass south of the wedge's high end.
 *                                                  (k11, v5, lidar)
 *  4. Low concrete wings west and south, and a long low east wing whose
 *     roof falls toward 7th Street.                (k11, bmk1, lidar)
 * Heights: USGS 3DEP lidar AZ_MaricopaPinal_1_2020 (flown 2020, 1 m grid,
 * tools/lidar.py, read with tools/lidar_frame.py; ground_min 0.5 m below
 * y = 0 here, the lowest ground under the footprint on the south side).
 * Mapterhorn (tools/terrain.ts grid) slopes about 1.5 m, down to the
 * south; elevation 0. Measured (model metres): the wedge's top 18.1 at
 * its west end (x -18) to 33.6 at its east end (x 38); the south mass's tilted
 * top 21.3 on its north-west to 15.8 at its south-east; the copper slab
 * 22.3; the north mesa's rim 18.9; the west wing 12.3, the south block 12.1, its south-west step
 * 9; the entrance hall between the south block and the wedge 5.4
 * (x -18..14, y -10..-2); the east wing 9.9 falling to 6.2 at its east end.
 * Plan: the wings from OSM's outline, the wedge, the two masses and the slab
 * from the lidar's edges.
 *
 * Estimated: the mesa's batter (2.6 m) and lip (0.7 m, 1.5 m deep), its
 * plan as a chamfered rectangle; the south mass's batter and its facets
 * drawn as one tilted plane; the wedge's thickness (6 m); the entrance
 * glazing (kpd, k11); the slab's copper-pink tone (k11, v5: seen behind
 * the mesa; which volume carries it is inferred from the lidar heights);
 * the east wing's window bands. Left out: the terraced stairs and ramps,
 * the shade structures and solar canopies, banners, lettering.
 *
 * Photos (evidence, Wikimedia Commons):
 *  kpd  "Arizonasciencecenter.jpg", Kirs10, public domain, the entrance
 *       from the north
 *       https://commons.wikimedia.org/wiki/File:Arizonasciencecenter.jpg
 *  k11  "Arizona Science Center 2011.jpg", Kirs10, CC0, the entrance plaza
 *       from the north
 *       https://commons.wikimedia.org/wiki/File:Arizona_Science_Center_2011.jpg
 *  v5   "Arizona Science Center-5.jpg", Visitor7, CC BY-SA 3.0, the mesa
 *       close up
 *       https://commons.wikimedia.org/wiki/File:Arizona_Science_Center-5.jpg
 *  bmk1 "Arizona Science Center 1, 600 East Washington Street, Phonenix.jpg",
 *       Beyond My Ken, CC BY-SA 4.0, wide view across the plaza
 *       https://commons.wikimedia.org/wiki/File:Arizona_Science_Center_1,_600_East_Washington_Street,_Phonenix.jpg
 * No look-only sources. No commercial imagery.
 * Doubts: the photos' directions are inferred from the lidar plan (no
 * photo names its side); the south and east faces are unphotographed in
 * the photos used, so the south mass is lidar-only.
 *
 * Night: the entrance glazing and the east wing's window band are
 * `window` and glow; the rest is unlit.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, type Swatch } from './palette'

const ID = 'phx-arizona-science-center'
type XY = [number, number]

const silver = new Part(), concrete = new Part(), copper = new Part(), win = new Part(), roof = new Part()
const P = (x: number, y: number, z: number): V3 => [x, y, z]
const area = (r: XY[]) => r.reduce((s, a, i) => { const b = r[(i + 1) % r.length]; return s + a[0] * b[1] - b[0] * a[1] }, 0) / 2
const ccw = (r: XY[]) => (area(r) < 0 ? [...r].reverse() : r)
const rect = (x0: number, y0: number, x1: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]

/** A prism over a convex ring from 0 up to a top given per point (planar or not; fan-triangulated). */
function prism(wall: Part, cap: Part, ring: XY[], z0: number, ztop: (x: number, y: number) => number) {
  const r = ccw(ring)
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    wall.quad(P(a[0], a[1], z0), P(b[0], b[1], z0), P(b[0], b[1], ztop(...b)), P(a[0], a[1], ztop(...a)))
  }
  for (let i = 1; i < r.length - 1; i++) cap.tri(P(...r[0], ztop(...r[0])), P(...r[i], ztop(...r[i])), P(...r[i + 1], ztop(...r[i + 1])))
}
const flat = (z: number) => () => z
/** A battered (frustum) mass over a convex ring: walls lean in by `inset` to a top plane. */
function frustum(wall: Part, cap: Part, ring: XY[], inset: number, ztop: (x: number, y: number) => number) {
  const r = ccw(ring)
  const cx = r.reduce((s, p) => s + p[0], 0) / r.length, cy = r.reduce((s, p) => s + p[1], 0) / r.length
  const t = r.map(([x, y]) => { const d = Math.hypot(x - cx, y - cy); return [x - ((x - cx) / d) * inset, y - ((y - cy) / d) * inset] as XY })
  for (let i = 0; i < r.length; i++) {
    const j = (i + 1) % r.length
    wall.quad(P(r[i][0], r[i][1], 0), P(r[j][0], r[j][1], 0), P(t[j][0], t[j][1], ztop(...t[j])), P(t[i][0], t[i][1], ztop(...t[i])))
  }
  for (let i = 1; i < t.length - 1; i++) cap.tri(P(...t[0], ztop(...t[0])), P(...t[i], ztop(...t[i])), P(...t[i + 1], ztop(...t[i + 1])))
}
/** A flat panel on the face a→b (outward to the right). */
function panel(part: Part, a: XY, b: XY, s0: number, s1: number, z0: number, z1: number, off = 0.06) {
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy)
  const n: XY = [(dy / L) * off, (-dx / L) * off]
  const p = (s: number): XY => [a[0] + dx * s + n[0], a[1] + dy * s + n[1]]
  const [p0, p1] = [p(s0), p(s1)]
  part.quad(P(p0[0], p0[1], z0), P(p1[0], p1[1], z0), P(p1[0], p1[1], z1), P(p0[0], p0[1], z1))
}

// ── The low wings ───────────────────────────────────────────────────────
prism(concrete, roof, rect(-69, 7, -41, 25), 0, flat(12.3))
prism(concrete, roof, rect(-41, 3, -17, 25), 0, flat(12.3))
prism(concrete, roof, rect(-57, -18, -41, 7), 0, flat(9))
prism(concrete, roof, rect(-41, -31, -18, 3), 0, flat(12.1))
prism(concrete, roof, rect(-18, -31, 16, -10), 0, flat(12.1))
// the low entrance hall between the south block and the blade (lidar 5.4)
prism(concrete, roof, rect(-18, -10, 14, -2), 0, flat(5.4))
// the east wing, its roof falling east from x 50, a window band along
// its north and south faces
{
  const z = (x: number) => (x <= 50 ? 9.9 : 9.9 - ((x - 50) / 25) * 3.7)
  prism(concrete, roof, [[16, 1], [50, 1], [75, 1], [75, 25], [50, 25], [16, 25]], 0, (x) => z(x))
  panel(win, [16, 1], [75, 1], 0.06, 0.94, 2.2, 4.4)
  panel(win, [75, 25], [16, 25], 0.06, 0.94, 2.2, 4.4)
}

// ── The copper-toned slab-tower over the stairs (k11, v5, bmk2) ──────────
prism(copper, copper, rect(-47, -10, -24, -2), 0, flat(22.3))

// ── The silver wedge: its sheer north face, its top rising east ────────
{
  const zb = (x: number) => 18.1 + ((x + 18) / 56) * (33.6 - 18.1)
  prism(silver, silver, rect(-18, -3, 38, 3), 0, (x) => zb(x))
  // the glazed main entrance in its north face, east of the mesa (kpd)
  panel(win, [16, 3], [10, 3], 0.05, 0.95, 0.3, 8.2)
}

// ── The north mesa (kpd, k11, v5): a battered, faceted concrete mass
// with a capping lip, standing in front of the wedge (lidar rim 18.9,
// its roof inside about 13.4) ────────────────────────────────────────────
{
  const ring: XY[] = [[-7, 3], [5, 3], [10, 8], [10, 15], [5, 20], [-7, 20], [-12, 15], [-12, 8]]
  frustum(concrete, roof, ring, 2.6, flat(17.4))
  // the lip: the top ring pushed back out 0.7 m, 17.4–18.9
  const cx = -1, cy = 11.5
  const lip = ring.map(([x, y]) => { const d = Math.hypot(x - cx, y - cy); return [x - ((x - cx) / d) * 1.9, y - ((y - cy) / d) * 1.9] as XY })
  prism(concrete, roof, lip, 17.4, flat(18.9))
}
// a south door in the south block (glazing only)
panel(win, [-41, -31], [16, -31], 0.6, 0.85, 0.3, 4.4)

// ── The south mesa: a second battered mass behind the wedge's high end ───────────────────────────────────────────────
{
  const base: XY[] = [[14, -31], [31, -31], [38, -24], [38, -3], [14, -3]]
  // the tilted top: high on the north-west, low on the south-east
  const zt = (x: number, y: number) => 21.3 - ((x - 18) / 16) * 2.6 - ((-y - 6) / 20) * 2.9
  frustum(concrete, concrete, base, 3.5, zt)
}

// ── Write ───────────────────────────────────────────────────────────────
const parts: { part: Part; material: Swatch }[] = [
  { part: silver, material: finish('asc-silver', 0xd3d7db) },
  { part: concrete, material: finish('asc-concrete', 0xbcb6ac) },
  { part: copper, material: finish('asc-copper', 0xb58a78) },
  { part: win, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
]
const used = parts.filter((p) => p.part.triangles > 0)
const triangles = used.reduce((s, p) => s + p.part.triangles, 0)
if (used.length > 6) throw new Error(`${ID}: ${used.length} materials`)
if (triangles > 5000) throw new Error(`${ID}: ${triangles} triangles`)
const glb = writeGlb('Arizona Science Center', used, {
  license: 'CC0-1.0',
  frame: 'Y up, -Z north, +X east, metres; origin on the ground at the outline centroid (-112.0665375, 33.4487630); bearing 0',
})
if (glb.length > 250_000) throw new Error(`${ID}: ${glb.length} bytes`)
const out = new URL(`../models/${ID}.glb`, import.meta.url).pathname
await Bun.write(out, glb)
console.log(used.map((p) => `${p.material.name}: ${p.part.triangles}`).join(', '))
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
