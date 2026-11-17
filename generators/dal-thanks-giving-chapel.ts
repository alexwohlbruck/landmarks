/**
 * Chapel of Thanksgiving, Thanks-Giving Square, Dallas, 1976, Philip
 * Johnson — original procedural geometry, CC0-1.0.
 * bun generators/dal-thanks-giving-chapel.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = centroid of the OSM outline way/654112871
 * (building=chapel, "Thanksgiving Chapel"), 32.7829429, -96.7982737. The
 * chapel is round, so the bearing is 0.
 *
 * Identity: the white spiral tower — one continuous wall winding up
 * counter-clockwise in four turns of shrinking radius, each turn's rim a
 * helix that steps in at the south-east, ending in an upturned blade; the
 * long low curved wall wrapping its foot; the tall curved slab that frames
 * the entrance slot on the west.
 *
 * Evidence:
 *  - plan: OSM outline, a 12-sided ring of radius ~6.0 m (measured 5.9-6.0).
 *  - heights: USGS 3DEP lidar TX_Pecos_Dallas_B3_2018 (2018 flight), 0.5 m
 *    grid, above the chapel's base (ground_min + 1.6, the lowest ground at
 *    its foot; the street to the north is 0.6 m higher): the first turn's
 *    rim rises from 13.4 m at the south-east through 14.6 (E), 15.3 (N),
 *    16.0 (W) to 16.8 (S); the turns climb ~3.8 m each; blade top 28.3.
 *    Measured. Published: "90 feet (27.5 m) above street level"
 *    (Wikipedia); lidar gives 27.7 above the street.
 *  - radii of the four turns 6.0 / 4.4 / 3.4 / 2.2 m: the outer from OSM,
 *    the rest scaled from Highsmith's two side views (11.3 : 8.7 : 7.0 : 4.3
 *    in px). Estimated.
 *  - the ramp wall: lidar at ~7.6 m radius, ~1.0 m above the base at the
 *    north-east, ~1.6-3 m at the north-west (measured); drawn rising from
 *    1.2 m at 35° to 2.8 m at 212° (counter-clockwise from east), white.
 *  - the granite plinth on the south: lidar 4.0-4.6 m (measured), ~10 m
 *    wide with a flat face (Highsmith, LCCN2014633397, from the pool);
 *    brown granite (#8a7466 in the photo) pulled light to #a88f7e.
 *  - the entrance slab: lidar 13.5 m above the base at x 7-8, y -4..+2
 *    (east of the tower; measured); its thick curved shell and the dark
 *    slot behind it from Highsmith, LCCN2014633397 (slab top ~86% of the
 *    first rim). The 8-15 m returns west of the tower are oak canopy.
 *  - colour: white concrete (#f4f2ee), all of it; the slot in `window`.
 *  - night: the tower is floodlit (white walls get a _FLOODLIGHT wash,
 *    brightest low); the entrance slot glows.
 *
 * Photos (all EVIDENCE, public domain, Carol M. Highsmith, Library of
 * Congress, via Wikimedia Commons):
 *  - The Chapel of Thanksgiving building in Thanks-giving Square ...
 *    LCCN2014633932 (the spiral and low wall)
 *  - The public, nondenominational, spiral-shaped chapel ... LCCN2014633397
 *    (from the pool: slab, slot, blade)
 *  - The public, nondenominational, spiral-shaped chapel ... LCCN2014633398
 * Also Dallas_Thanks-Giving_Square_01-04.jpg, Joe Mabel, CC BY-SA 3.0, and
 * Dallas_Thanks-Giving_Square_2008.jpg, Andreas Praefcke, CC BY 3.0 (the
 * square and the bell tower). No look-only sources. No commercial imagery.
 *
 * Terrain: base on the lowest ground at the foot, elevation 0; `bun tools/terrain.ts check` prints ok.
 *
 * Doubts: the sides of the slab and the ramp wall rest on the lidar (the
 * aerials are too blurred to confirm), and agree with the photos; the step's angle (south-east)
 * from the lidar rim heights; the brown granite pool walls and the bridge
 * that meets the chapel from the south (lidar: a deck ~3.5 m up at x ~1)
 * are left to the square. The bell tower (Court of
 * All Nations, ~137 m west across the sunken garden) is not in this model:
 * it is too far to share a placement without stretching the footprint over
 * the garden.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { block, rect, save } from './chi-merchandise-mart'

const ANCHOR: [number, number] = [32.7829429, -96.7982737]
const BEARING = 0

const R = [6.0, 4.4, 3.0, 1.85] // the four turns
// Rim heights at the start of each turn and at the end of the last: the
// turns rise less as they shrink.
const RIMS = [13.4, 17.2, 20.6, 23.4, 25.6]
const TH0 = -Math.PI / 4 // the step, at the south-east; the spiral climbs counter-clockwise
const SEG = 24 // per turn
const BLADE = 28.3

/** A polygon (convex, planar), wound so its normal agrees with `hint`. */
function face(p: Part, pts: V3[], hint: V3) {
  const n: V3 = [0, 0, 0]
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i], b = pts[(i + 1) % pts.length]
    n[0] += (a[1] - b[1]) * (a[2] + b[2]); n[1] += (a[2] - b[2]) * (a[0] + b[0]); n[2] += (a[0] - b[0]) * (a[1] + b[1])
  }
  const q = n[0] * hint[0] + n[1] * hint[1] + n[2] * hint[2] < 0 ? [...pts].reverse() : pts
  for (let i = 1; i < q.length - 1; i++) p.tri(q[0], q[i], q[i + 1])
}

const at = (r: number, t: number, z: number): V3 => [r * Math.cos(t), r * Math.sin(t), z]
const out = (t: number): V3 => [Math.cos(t), Math.sin(t), 0]

/** Smooth-shaded wall band at radius r from angle t0 to t1, bottom zb(t), top zt(t). */
function wall(p: Part, r: number, t0: number, t1: number, n: number, zb: (t: number) => number, zt: (t: number) => number, inward = false) {
  for (let k = 0; k < n; k++) {
    const a = t0 + ((t1 - t0) * k) / n, b = t0 + ((t1 - t0) * (k + 1)) / n
    const na = inward ? out(a).map((v) => -v) as V3 : out(a), nb = inward ? out(b).map((v) => -v) as V3 : out(b)
    const A = at(r, a, zb(a)), B = at(r, b, zb(b)), C = at(r, b, zt(b)), D = at(r, a, zt(a))
    p.tri(A, B, C, undefined, undefined, undefined, [na, nb, nb])
    p.tri(A, C, D, undefined, undefined, undefined, [na, nb, na])
  }
}

function build() {
  const white = new Part(), slot = new Part(), granite = new Part()
  const rim = (i: number) => (t: number) => RIMS[i] + (RIMS[i + 1] - RIMS[i]) * ((t - TH0) / (2 * Math.PI))
  const T1 = TH0 + 2 * Math.PI

  for (let i = 0; i < 4; i++) {
    const r = R[i], ri = i < 3 ? R[i + 1] : 0
    const top = rim(i)
    // The turn's wall, from below the turn under it (or the ground) to its rim.
    const bottom = i === 0 ? () => 0 : (t: number) => rim(i - 1)(t) - 0.3
    wall(white, r, TH0, T1, SEG, bottom, top)
    // Its roof: a helicoid ring out to the next turn in (a disc for the last).
    for (let k = 0; k < SEG; k++) {
      const a = TH0 + (2 * Math.PI * k) / SEG, b = TH0 + (2 * Math.PI * (k + 1)) / SEG
      const pts: V3[] = ri > 0 ? [at(r, a, top(a)), at(r, b, top(b)), at(ri, b, top(b)), at(ri, a, top(a))] : [at(r, a, top(a)), at(r, b, top(b)), [0, 0, (top(a) + top(b)) / 2]]
      face(white, pts, [0, 0, 1])
    }
    // The step: where the turn ends, a riser back down to its start.
    face(white, [at(ri, TH0, top(TH0)), at(r, TH0, top(TH0)), at(r, TH0, top(T1)), at(ri, TH0, top(T1))], [-Math.sin(TH0), Math.cos(TH0), 0])
  }

  // The blade: the last turn's wall carried on up past its roof over its
  // final 110°, a 0.6 m shell, tapering up to the tip.
  {
    const r = R[3], th = 0.6, t1 = T1, t0 = T1 - (170 * Math.PI) / 180
    const base = rim(3)
    const tip = (t: number) => base(t) + (BLADE - base(t1)) * Math.pow((t - t0) / (t1 - t0), 1.6)
    wall(white, r, t0, t1, 8, base, tip)
    wall(white, r - th, t0, t1, 8, base, tip, true)
    for (let k = 0; k < 8; k++) {
      const a = t0 + ((t1 - t0) * k) / 8, b = t0 + ((t1 - t0) * (k + 1)) / 8
      face(white, [at(r, a, tip(a)), at(r, b, tip(b)), at(r - th, b, tip(b)), at(r - th, a, tip(a))], [0, 0, 1])
    }
    face(white, [at(r - th, t1, base(t1)), at(r, t1, base(t1)), at(r, t1, BLADE), at(r - th, t1, BLADE)], [-Math.sin(t1), Math.cos(t1), 0])
  }

  /** A curved shell wall of thickness th, outer radius r, between angles, height h. */
  const shell = (r: number, th: number, t0: number, t1: number, h: (t: number) => number, n: number) => {
    wall(white, r, t0, t1, n, () => 0, h)
    wall(white, r - th, t0, t1, n, () => 0, h, true)
    for (let k = 0; k < n; k++) {
      const a = t0 + ((t1 - t0) * k) / n, b = t0 + ((t1 - t0) * (k + 1)) / n
      face(white, [at(r, a, h(a)), at(r, b, h(b)), at(r - th, b, h(b)), at(r - th, a, h(a))], [0, 0, 1])
    }
    for (const [t, s] of [[t0, -1], [t1, 1]] as [number, number][])
      face(white, [at(r - th, t, 0), at(r, t, 0), at(r, t, h(t)), at(r - th, t, h(t))], [-Math.sin(t) * s, Math.cos(t) * s, 0])
  }
  const deg = (d: number) => (d * Math.PI) / 180
  // The low curved wall of the ramp round the foot, its top rising
  // counter-clockwise from the north-east to the south-east.
  shell(7.6, 0.5, deg(35), deg(212), (t) => 1.2 + 1.8 * (t - deg(35)) / deg(177), 16)
  // The brown granite plinth on the south, where the bridge lands.
  block(granite, granite, rect(-5.6, -8.6, 4.6, -2.5), 0, 4.2, 0.25)
  // The entrance slab on the east, a thick curved shell standing off the
  // tower, with the entrance slot in the gap behind it.
  shell(8.1, 1.5, deg(-28), deg(15), () => 13.5, 5)
  {
    const t = deg(-6), w = 0.8 / 6.0
    face(slot, [at(6.07, t - w, 0.2), at(6.07, t + w, 0.2), at(6.07, t + w, 11.5), at(6.07, t - w, 11.5)], out(t))
  }

  const lit = (p: V3, n: V3) => (Math.abs(n[2]) > 0.7 ? 0.05 : Math.max(0.15, 0.6 - 0.015 * p[2]))
  return [
    { part: white, material: { ...finish('tgs-chapel-white', 0xf4f2ee), floodlight: lit } },
    { part: slot, material: PALETTE.window },
    // pulled light from the photos' brown (#8a7466)
    { part: granite, material: finish('tgs-granite', 0xa88f7e) },
  ]
}

if (import.meta.main) await save('dal-thanks-giving-chapel', 'Chapel of Thanksgiving', ANCHOR, BEARING, build())
