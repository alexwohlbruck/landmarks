/**
 * Atlanta Central Library (Atlanta-Fulton Public Library, Central
 * Library), One Margaret Mitchell Square (1980, Marcel Breuer and Hamilton
 * Smith; Breuer's last building; renovated 2019–2022) — original procedural
 * geometry, CC0-1.0.
 * bun generators/atl-central-library.ts
 *
 * Uses the B4 kit exported from generators/atl-flatiron-building.ts.
 *
 * Map frame: x east, y north, z up, metres, turned to the placement's
 * bearing (49.8°: OSM's long sides run at 49.8° / 229.8°; +x points
 * south-east, to Peachtree Street, −x north-west, to Forsyth Street).
 * Anchor = centroid of OSM way/192941643 ("Atlanta Central Library",
 * 6 levels), 33.757762, -84.388478.
 *
 * Identity: a stack of offset concrete boxes in warm grey-taupe
 * bush-hammered panels. A recessed, glazed street storey; over it a middle
 * tier that steps out, itself cut by deep glazed recesses; over that the
 * big upper block that cantilevers out again on every side, the tall
 * north-west part (40 m) beside a lower south-east part (32 m) on
 * Peachtree, and a narrower strip on Forsyth. The almost blank upper walls
 * are cut by deep rectangular notches: square window boxes and tall
 * slots, some near the corners, glass at their backs. Since the 2019–2022
 * renovation the recessed base is clear glass.
 *
 * Evidence:
 *  - plan: OSM way/192941643: a 38.7 × 60.4 m main rectangle with a
 *    10.6 m wide, 45 m long strip along the north-west side; the upper
 *    block fills it. The glazed base core (x −13…20.5, y ±25, to 11 m) and
 *    the middle tier (x −18…22.6, y ±27.8, 11–20 m) are estimated from the
 *    photos (each steps 2–5 m in from the one above).
 *  - heights: USGS 3DEP lidar GA_Statewide_B2_2018 (2018 flight, before the
 *    renovation, which did not change the massing), 0.5 m grid, above
 *    ground_min 318.97 m; the low ground on the Forsyth side is about 1 m
 *    above that and y = 0 is put there. Measured (lidar − 1 m): the tall
 *    block (x −25.6…6) 40 m (lidar 41–43), the lower south-east block
 *    (x 6…23.8) 32 m (lidar 33), a roof well in it at 24–26 m (left out).
 *  - ground: Mapterhorn rises about 5.7 m from the west corner to the
 *    north-east corner of the footprint, so the base is drawn 11 m tall:
 *    about 5 m of it shows on the Peachtree side; elevation 0.
 *  - notches: every notch is a real recess 1.8 m deep (2.5 m for the
 *    middle tier's glazed bays) with glass at its back; their sizes and
 *    places are estimated from Merlin's and JJonahJackalope's photos
 *    (the tall slot up the centre block in jjj1, the corner slot in jjj2,
 *    the square window boxes in both).
 *  - colour: warm grey-taupe concrete, between Merlin's pale photo and the
 *    greyer overcast jjj1, pulled to the palette's lightness; the
 *    renovated base is clear glass.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Atlanta-Fulton-County Central Library viewed from Georgia Pacific
 *    Center Plaza.jpg, Marc Merlin, CC BY-SA 4.0 (from the east)
 *    https://commons.wikimedia.org/wiki/File:Atlanta-Fulton-County_Central_Library_viewed_from_Georgia_Pacific_Center_Plaza.jpg
 *  - Atlanta Central Library, ATL.jpg, JJonahJackalope, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:Atlanta_Central_Library,_ATL.jpg
 *  - Atlanta Central Library 2.jpg, JJonahJackalope, CC BY-SA 4.0 (during
 *    the renovation: the new glazed base)
 *    https://commons.wikimedia.org/wiki/File:Atlanta_Central_Library_2.jpg
 *  - Atlanta-Fulton Central Library (8216350416).jpg and (8216348716).jpg,
 *    Aleksandr Zykov, CC BY-SA 2.0
 *    https://commons.wikimedia.org/wiki/File:Atlanta-Fulton_Central_Library_(8216350416).jpg
 *    https://commons.wikimedia.org/wiki/File:Atlanta-Fulton_Central_Library_(8216348716).jpg
 *  - Exterior of the Fulton Country Central Library (82252).jpg, Zeroping,
 *    CC BY 4.0 (the renovated glazed base under the cantilever)
 *    https://commons.wikimedia.org/wiki/File:Exterior_of_the_Fulton_Country_Central_Library_(82252).jpg
 *  - Atlanta Fulton Public Main Library, Atlanta, GA (40508251003).jpg,
 *    Warren LeMay, CC0
 *    https://commons.wikimedia.org/wiki/File:Atlanta_Fulton_Public_Main_Library,_Atlanta,_GA_(40508251003).jpg
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the exact depth of each tier and the positions and sizes of the
 * notches are estimated from photos, not drawings; the north-west
 * (Forsyth) face is seen only obliquely; the sloped sills of the window
 * boxes, the panel joints and the roof well are left out. Reworked after
 * review round 1 (was a single cantilevered box with flush windows).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { box, prism, split, save, wall, type XY } from './atl-flatiron-building'

const concrete = new Part(), glass = new Part(), deep = new Part(), roof = new Part()

/** A notch: a recess in one side of a block, `s` along the side (x for n/s, y for e/w). */
type Notch = { side: 'n' | 's' | 'e' | 'w'; s0: number; s1: number; za: number; zb: number }

/** A plan quad on a wall from a to b (outside on the right), `out` metres proud. */
function face(p: Part, a: XY, b: XY, za: number, zb: number, out = 0.06) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n: XY = [(b[1] - a[1]) / L, -(b[0] - a[0]) / L]
  const P = (q: XY, z: number): V3 => [q[0] + n[0] * out, q[1] + n[1] * out, z]
  p.quad(P(a, za), P(b, za), P(b, zb), P(a, zb))
}

/**
 * A concrete block with real recesses `depth` metres deep cut into its
 * sides, glass (`back`) at the back of each, and a bevelled cap `cap`
 * metres tall over the top. Built as a core shrunk back on each notched
 * side plus strips in front of it, solid except at the notches.
 */
function block(x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, notches: Notch[], depth: number, back: Part, cap = 1.2) {
  const has = (sd: string) => notches.some((n) => n.side === sd)
  const zt = z1 - cap, under = z0 > 0
  const cx0 = x0 + (has('w') ? depth : 0), cx1 = x1 - (has('e') ? depth : 0)
  const cy0 = y0 + (has('s') ? depth : 0), cy1 = y1 - (has('n') ? depth : 0)
  box(concrete, cx0, cx1, cy0, cy1, z0, zt, null, 0, under)
  for (const sd of ['n', 's', 'e', 'w'] as const) {
    const mine = notches.filter((n) => n.side === sd)
    if (!mine.length) continue
    // n/s strips run the full length; e/w strips only between them.
    const [smin, smax] = sd === 'n' || sd === 's' ? [x0, x1] : [cy0, cy1]
    const bounds = [...new Set([smin, smax, ...mine.flatMap((n) => [n.s0, n.s1])])].sort((p, q) => p - q)
    for (let i = 0; i < bounds.length - 1; i++) {
      const s0 = bounds[i], s1 = bounds[i + 1]
      const cut = mine.find((n) => n.s0 <= s0 + 1e-6 && n.s1 >= s1 - 1e-6)
      const zs = (cut ? [[z0, cut.za], [cut.zb, zt]] : [[z0, zt]]).filter(([p, q]) => q - p > 0.05)
      for (const [za, zb] of zs) {
        const bottom = za > 0
        if (sd === 'n') box(concrete, s0, s1, cy1, y1, za, zb, zb < zt ? concrete : null, 0, bottom)
        if (sd === 's') box(concrete, s0, s1, y0, cy0, za, zb, zb < zt ? concrete : null, 0, bottom)
        if (sd === 'e') box(concrete, cx1, x1, s0, s1, za, zb, zb < zt ? concrete : null, 0, bottom)
        if (sd === 'w') box(concrete, x0, cx0, s0, s1, za, zb, zb < zt ? concrete : null, 0, bottom)
      }
    }
  }
  // The glass at the back of each notch.
  for (const n of notches) {
    if (n.side === 'n') face(back, [n.s1, cy1], [n.s0, cy1], n.za, n.zb)
    if (n.side === 's') face(back, [n.s0, cy0], [n.s1, cy0], n.za, n.zb)
    if (n.side === 'e') face(back, [cx1, n.s0], [cx1, n.s1], n.za, n.zb)
    if (n.side === 'w') face(back, [cx0, n.s1], [cx0, n.s0], n.za, n.zb)
  }
  prism(concrete, [[x0, y0], [x1, y0], [x1, y1], [x0, y1]], zt, z1, roof, 0.45, true)
}

const BASE = 11, MID = 20, TALL = 40, LOW = 32, STEP = 6

// ── 1. The glazed street storey, set back under everything. A solid
// concrete corner on the east (Merlin's photo) and piers at the others. ──
const core: XY[] = [[-13, -25], [20.5, -25], [20.5, 25], [-13, 25]]
wall(glass, split(core, 5), 0, BASE)
box(concrete, 13.5, 20.6, 15, 25.1, 0, BASE, null, 0)
for (const [x, y] of [[-13, -25], [20.5, -25], [-13, 25]] as XY[]) box(concrete, x - 1, x + 1, y - 1, y + 1, 0, BASE, null, 0)

// ── 2. The middle tier: steps out over the base, with deep glazed bays
// between solid concrete boxes (jjj2). ──
block(-18, 22.6, -27.8, 27.8, BASE, MID, [
  { side: 's', s0: -15, s1: -5, za: BASE, zb: MID - 1.8 },
  { side: 's', s0: 1, s1: 11, za: BASE, zb: MID - 1.8 },
  { side: 'n', s0: -12, s1: -2, za: BASE, zb: MID - 1.8 },
  { side: 'n', s0: 5, s1: 16, za: BASE, zb: MID - 1.8 },
  { side: 'e', s0: -21, s1: -7, za: BASE, zb: MID - 1.8 },
  { side: 'w', s0: -8, s1: 8, za: BASE, zb: MID - 1.8 },
], 2.5, glass)

// ── 3. The upper block, cantilevered out again: the tall middle part, the
// lower Peachtree part and the narrower Forsyth strip, with their deep
// window boxes (about 4.5 m square) and tall slots (3.2 m wide), each
// 2.4 m deep with a projecting sloped sill under it as in the photos. ──
const sills: Array<{ side: Notch['side']; s0: number; s1: number; z: number; at: number }> = []
function upper(x0: number, x1: number, y0: number, y1: number, z1: number, raw: Notch[]) {
  // Each notch drawn 1 m wider and 0.5 m taller than measured off the
  // photos, so it still reads at phone size.
  const ns = raw.map((n) => ({ ...n, s0: n.s0 - 0.5, s1: n.s1 + 0.5, za: n.za - 0.5 }))
  block(x0, x1, y0, y1, MID, z1, ns, 2.4, deep)
  for (const n of ns) sills.push({ side: n.side, s0: n.s0, s1: n.s1, z: n.za, at: n.side === 'n' ? y1 : n.side === 's' ? y0 : n.side === 'e' ? x1 : x0 })
}
upper(-15, STEP, -30.1, 30.2, TALL, [
  { side: 'n', s0: -12, s1: -8.8, za: 24, zb: 38 },
  { side: 'n', s0: -2, s1: 2.5, za: 29.5, zb: 34 },
  { side: 's', s0: -11, s1: -6.5, za: 30, zb: 34.5 },
  { side: 's', s0: -0.5, s1: 2.7, za: 23, zb: 37 },
  { side: 'e', s0: -4, s1: 0.5, za: 33.5, zb: 38 },
])
upper(STEP, 23.8, -30.1, 30.2, LOW, [
  { side: 'n', s0: 11, s1: 15.5, za: 24, zb: 28.5 },
  { side: 's', s0: 9.5, s1: 14, za: 24, zb: 28.5 },
  { side: 's', s0: 18.8, s1: 22, za: 21.5, zb: 30.5 },
  { side: 'e', s0: -7, s1: -2.5, za: 24.5, zb: 29 },
  { side: 'e', s0: 9.5, s1: 12.7, za: 21.5, zb: 30.5 },
])
upper(-25.6, -15, -22.5, 22.5, TALL, [
  { side: 'w', s0: -1.6, s1: 1.6, za: 24, zb: 38 },
  { side: 'w', s0: 11, s1: 15.5, za: 28, zb: 32.5 },
])
// The sills: a sloped concrete shelf at the foot of each notch, from the
// back glass out 0.9 m past the face, falling 0.7 m.
for (const sl of sills) {
  const O = 0.9, H = 0.7, back = 2.4
  // In local terms: u along the face, v outward from the face line.
  const P = (u: number, v: number, z: number): V3 => {
    if (sl.side === 'n') return [u, sl.at + v, z]
    if (sl.side === 's') return [u, sl.at - v, z]
    if (sl.side === 'e') return [sl.at + v, u, z]
    return [sl.at - v, u, z]
  }
  const flip = sl.side === 's' || sl.side === 'e'
  const [u0, u1] = flip ? [sl.s1, sl.s0] : [sl.s0, sl.s1]
  // top: from the glass (v = -back) level, then sloping down to the lip
  const tq = (a: V3, b: V3, c: V3, d: V3) => concrete.quad(a, b, c, d)
  tq(P(u0, 0, sl.z), P(u1, 0, sl.z), P(u1, O, sl.z - H), P(u0, O, sl.z - H))
  // the lip's front face and underside
  tq(P(u0, O, sl.z - H), P(u1, O, sl.z - H), P(u1, O, sl.z - H - 0.3), P(u0, O, sl.z - H - 0.3))
  tq(P(u0, O, sl.z - H - 0.3), P(u1, O, sl.z - H - 0.3), P(u1, 0, sl.z - H - 0.6), P(u0, 0, sl.z - H - 0.6))
  // the two ends
  for (const [u, s] of [[u0, -1], [u1, 1]] as [number, number][]) {
    const pts = [P(u, 0, sl.z), P(u, O, sl.z - H), P(u, O, sl.z - H - 0.3), P(u, 0, sl.z - H - 0.6)]
    // Both windings: the end is seen from one side or the other.
    concrete.tri(pts[0], pts[1], pts[2]); concrete.tri(pts[0], pts[2], pts[3])
    concrete.tri(pts[0], pts[2], pts[1]); concrete.tri(pts[0], pts[3], pts[2])
    void s
  }
  void back
}

await save('atl-central-library', 'Atlanta Central Library', [
  { part: concrete, material: finish('library-concrete', 0xc2b9ab) },
  { part: glass, material: { ...PALETTE.window, color: 0x7d93a3 } },
  { part: deep, material: windowVariant(2, 0x5f6f7c) },
  { part: roof, material: PALETTE.roof },
], { height: TALL, anchor: [33.757762, -84.388478], bearing: 49.8 })
