/**
 * Haeundae LCT The Sharp (Landmark Tower and Residential Towers A and B), Haeundae, Busan:
 * original procedural geometry, CC0-1.0.
 * bun generators/busan-lct-landmark-tower.ts   (writes the low model and the detail LOD)
 *
 * The whole complex in one model: OSM maps it as one building outline, way/1467804490, holding
 * the three towers' parts and the four-storey podium part, so the model draws all of them.
 *
 * Frame: bearing 0 (+y north). Origin at the centroid of the outline way/1467804490
 * (129.1688353 E, 35.1604460 N), on the ground; elevation 0. Mapterhorn (z15) shows the ground
 * within -1.3..+4.8 m across the 240 m site (rising inland to the east); the check passes.
 *
 * Form, as read from OSM and the photos:
 * - the Landmark Tower: OSM's plan (way/780727742), a fan with a convex west face, a concave
 *   south-east face and a notch on the north side; the north tip stops at ~293 m, the rest
 *   rises to a curved, sloping glass crest (drawn in the pale crown glass), 392 m over the
 *   setback climbing ever more steeply to the 411.6 m peak, with the southernmost strip
 *   stepping down to a 401 m shoulder (Brit in Seoul, dalbera); the slope is exaggerated a few
 *   metres so it reads at phone size. The balcony ladder on the south-west corner is not drawn
 *   (it read as noise at map scale);
 * - Residential Towers A and B: OSM's Y plans (way/789212890, way/842313393); the
 *   north-north-west wing of each stops ~12 m lower, and a helipad disc on legs stands over the
 *   wing root; each part ends in an open crown frame (posts and a top rail, 7 m on the tall
 *   part, 5 m on the wing) over its roof, as the photos' open glass crowns;
 * - the podium: the complex outline, 20 m, glazed, with a pale parapet band.
 *
 * Evidence
 * - OSM (API map call, fetched 2026-11-27): outline way/1467804490 (building=yes, addr 달맞이길
 *   30); parts way/780727742 (랜드마크타워, height 411.6, 101 levels), way/789212890 (A동, 339.1,
 *   85 levels), way/842313393 (B동, 331, 85 levels), way/842313394 (commercial, 4 levels: the
 *   podium), way/1467804481 (an untagged-height part in the Landmark Tower's notch). No OSM
 *   element carries a wikidata tag; Wikidata Q5961370 ("Haeundae LCT The Sharp", 411 m, 101
 *   floors, at 35.160425 N 129.168885 E) sits inside the outline and names the complex: used.
 *   The landuse relation/20297104 (해운대 엘시티) is not a building and is not replaced.
 * - Published (Wikipedia "Haeundae LCT The Sharp", retrieved 2026-11-27): Landmark Tower
 *   411.6 m, 101 floors; Residential Tower A 339.1 m, 85 floors; B 333 m, 83 floors; SOM with
 *   Samoo; completed 2019.
 * - Photos (daylight, all from Haeundae Beach to the west and south-west):
 *   "La plage Haeundae à Busan (Corée du sud)", dalbera (Flickr 49020894681), CC BY 2.0: all three
 *   towers, the lower north tip and the sloping crest of the Landmark Tower, the helipads and the
 *   stepped tops of A and B, the balcony ladder, the glass colour;
 *   https://www.flickr.com/photos/72746018@N00/49020894681
 *   "Haeundae Beach May 2024.jpg", Brit in Seoul, CC BY-SA 4.0: the same, under blue sky;
 *   https://commons.wikimedia.org/wiki/File:Haeundae_Beach_May_2024.jpg
 *   "Haeundae Beach and Haeundae LCT The Sharp.jpg", A Fun Couple, CC BY 2.0;
 *   https://commons.wikimedia.org/wiki/File:Haeundae_Beach_and_Haeundae_LCT_The_Sharp.jpg
 *   "LCT From Dongbaek Island 2020.01.04 (2).jpg", 생각하는 나무, CC BY-SA 4.0: the far skyline;
 *   https://commons.wikimedia.org/wiki/File:LCT_From_Dongbaek_Island_2020.01.04_(2).jpg
 *   Night: "HaeundaeLCT atNight.jpg", 308 Bees, CC0: the three crowns lit in blue and yellow LED
 *   bands; https://commons.wikimedia.org/wiki/File:HaeundaeLCT_atNight.jpg
 * - No lidar, NAIP or Mapillary here (batch notes). Look-only (Flickr NC, Jens-Olaf, "LCT
 *   Landmark Tower" series): seen for context only, nothing taken from them.
 *
 * Numbers
 * - Published: 411.6 m, 339.1 m, 333 m (B: OSM says 331; the published figure is used).
 * - Measured (OSM): every plan, simplified to ~1 m.
 * - Measured (photos, scaled by the published heights): the Landmark Tower's north tip ~293 m
 *   (Brit in Seoul 291, dalbera 293) and ~16-19 % of the tower's north-south width; the crest
 *   ~13 m from its low to its high end; the residential lower wings ~12 m down (dalbera).
 * - Estimated: podium 20 m (four storeys); crest curve; helipad 15 m across, ~6 m over the low
 *   wing; ledge spacing (three storeys); colours sampled from the photos: glass #6a7b7c (cloud),
 *   #1b4e86-#2e5283 (blue sky), #314d73-#456081 (Dongbaek): drawn deep navy #4b6a90;
 *   residential glass a little lighter, #5f7f9f; the crown glass pale green-blue, #9fbfc9.
 *
 * Doubts
 * - Every licensed photo is from the beach to the west: the east and north faces, and which part
 *   of the plan the lower "north tip" really is, are read from those views only.
 * - The Landmark Tower's lower floors carry a band of horizontal louvres (dalbera) that is not
 *   modelled; the podium's real shape and heights are simplified to one 20 m block.
 * - The crest's rise is ~20 m in the model against ~10-13 m measured, exaggerated for phone size.
 * - The residential crowns are open glass screens; drawn as open frames of posts and a rail.
 *
 * Night: tower glass glows as windows; the crowns are neon (their LED bands); the podium
 * glazing glows as window-3.
 */
import { Part, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { face, lathe, saveLods, ccw, type Layer, type XY } from './auckland-sky-tower'
import { offsetRing, roofCap } from './hcmc-landmark-81'

// ---- Frame: bearing 0, origin at the centroid of the complex outline way/1467804490 -------------

const BASE = 20 // the podium roof (OSM: 4 levels; estimated)
const LT_TOP = 411.6, LT_WING = 293, LT_SHOULDER = 401
const A_TOP = 339.1, B_TOP = 333.0, DROP = 12 // the lower wing of each residential tower

// OSM, simplified to 0.9-1.2 m, in the model frame
const OUTLINE: XY[] = [[-77.7, 135.1], [-102.0, 123.2], [-102.4, 121.5], [-90.7, 100.9], [-105.1, 75.2], [-96.3, 70.4], [-95.2, 72.0], [-91.6, 70.0], [-92.4, 68.2], [-81.1, 62.7], [-81.8, 50.1], [-80.4, 43.4], [-67.3, 19.6], [-65.6, 9.2], [-62.6, 9.6], [-63.5, -2.9], [-67.6, -18.8], [-68.0, -28.9], [-66.0, -40.6], [-62.0, -51.2], [-54.8, -61.3], [-43.6, -68.1], [-29.9, -72.7], [-11.8, -73.3], [9.7, -76.2], [68.3, -96.9], [87.2, -98.7], [89.9, -105.4], [111.5, -104.9], [135.8, -60.9], [130.6, -52.5], [121.1, -52.1], [116.6, -35.4], [115.0, -35.9], [114.5, -34.5], [105.5, -36.6], [105.9, -32.1], [81.7, -22.8], [78.8, -26.8], [72.8, -17.6], [71.1, -18.5], [70.3, -17.3], [50.2, -29.0], [39.8, -11.0], [18.0, 15.0], [22.2, 32.3], [39.2, 32.9], [39.1, 34.5], [40.6, 34.6], [39.7, 48.6], [36.4, 49.9], [36.4, 53.7], [34.5, 56.1], [5.7, 72.6], [-14.7, 81.0], [-20.2, 84.8], [-29.1, 95.5], [-31.5, 107.3], [-34.9, 111.7]]
// the Landmark Tower (way/780727742), split 32 m south of the anchor line into the main body and the lower north tip
const W: XY = [59.1, -32.0], A: XY = [83.1, -32.0]
const LT_MAIN: XY[] = [W, [64.4, -41.8], [64.8, -55.6], [61.5, -66.6], [52.1, -80.6], [53.3, -81.7], [52.4, -82.8], [61.2, -90.8], [62.3, -89.8], [63.4, -90.9], [65.6, -88.7], [69.2, -90.4], [68.9, -93.7], [70.1, -95.1], [84.5, -95.9], [84.6, -94.2], [86.1, -94.3], [87.9, -77.1], [94.7, -65.3], [105.3, -57.9], [120.0, -53.7], [119.6, -52.4], [121.1, -52.1], [116.6, -35.4], [115.0, -35.9], [114.5, -34.5], [105.5, -36.6], [105.2, -34.2], [94.8, -37.5], [89.4, -43.7], [85.1, -42.3], [84.1, -34.2], A]
const LT_WINGP: XY[] = [A, [80.5, -25.9], [78.8, -26.8], [72.8, -17.6], [71.1, -18.5], [70.3, -17.3], [56.8, -25.2], [57.8, -26.5], [56.5, -27.1], W]
// the residential towers, split at the root of the north-north-west wing (the lower one)
const A_FULL: XY[] = [[-45.2, 91.5], [-43.7, 91.6], [-44.5, 105.7], [-46.5, 105.6], [-46.6, 107.1], [-68.7, 105.9], [-77.2, 110.9], [-87.9, 129.6], [-89.6, 130.1], [-102.0, 123.2], [-102.4, 121.5], [-90.7, 100.9], [-105.1, 75.2], [-96.3, 70.4], [-95.2, 72.0], [-91.6, 70.0], [-92.4, 68.2], [-83.5, 63.3], [-69.1, 89.0], [-45.1, 90.0]]
const B_FULL: XY[] = [[39.1, 34.5], [40.6, 34.6], [39.7, 48.6], [37.8, 48.5], [37.7, 50.0], [15.4, 49.1], [7.1, 53.8], [-3.6, 72.6], [-4.7, 72.0], [-5.1, 73.2], [-17.7, 66.1], [-18.1, 64.4], [-6.4, 43.9], [-20.8, 18.1], [-12.1, 13.3], [-10.9, 15.0], [-7.3, 13.0], [-8.1, 11.2], [0.8, 6.3], [15.1, 32.0], [39.2, 32.9]]
// split a ring at two of its vertices into [the run i..j, the run j..i]
const split = (r: XY[], i: number, j: number): [XY[], XY[]] => [r.slice(i, j + 1), [...r.slice(j), ...r.slice(0, i + 1)]]

type Set = { glass: Part; res: Part; crown: Part; trim: Part; roof: Part; podium: Part }
const mk = (): Set => ({ glass: new Part(), res: new Part(), crown: new Part(), trim: new Part(), roof: new Part(), podium: new Part() })

const nrmXY = (a: XY, b: XY): V3 => { const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1; return [dy / l, -dx / l, 0] }

/**
 * A tower block on a counter-clockwise ring: walls from `z0(i)` (per edge) to the top line `top(p)`,
 * the top `band` metres of them in the crown material (the glass parapet), a parapet lip, inner
 * faces down to the roof `drop` metres below the lowest top, and the roof.
 */
function block(s: Set, wall: Part, ring: XY[], z0: (i: number) => number, top: (p: XY) => number, o: { band?: number; drop?: number; inner?: (i: number) => boolean; fins?: number; segLen?: number } = {}) {
  const r = ccw(ring), n = r.length, band = o.band ?? 6, drop = o.drop ?? 5
  const segOf = (a: XY, b: XY) => (o.segLen ? Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / o.segLen)) : 1)
  for (let i = 0; i < n; i++) {
    const a = r[i], b = r[(i + 1) % n], N = nrmXY(a, b), lo = z0(i), seg = segOf(a, b)
    // subdivide long edges so a sloping top line stays smooth
    for (let k = 0; k < seg; k++) {
      const p: XY = [a[0] + ((b[0] - a[0]) * k) / seg, a[1] + ((b[1] - a[1]) * k) / seg]
      const q: XY = [a[0] + ((b[0] - a[0]) * (k + 1)) / seg, a[1] + ((b[1] - a[1]) * (k + 1)) / seg]
      const tp = top(p), tq = top(q)
      if (Math.min(tp, tq) - band > lo) face(wall, [[p[0], p[1], lo], [q[0], q[1], lo], [q[0], q[1], tq - band], [p[0], p[1], tp - band]], N)
      face(s.crown, [[p[0], p[1], Math.max(lo, tp - band)], [q[0], q[1], Math.max(lo, tq - band)], [q[0], q[1], tq], [p[0], p[1], tp]], N)
      // vertical mullion fins in the wall's own colour (shading only)
      if (o.fins && !(o.inner?.(i))) {
        const L = Math.hypot(q[0] - p[0], q[1] - p[1]), nf = Math.round(L / o.fins)
        const u: XY = [(q[0] - p[0]) / L, (q[1] - p[1]) / L]
        for (let f = 1; f < nf; f++) {
          const c: XY = [p[0] + ((q[0] - p[0]) * f) / nf, p[1] + ((q[1] - p[1]) * f) / nf]
          const zt = top(c) - band, w = 0.16, out = 0.2
          const P = (sv: number, d: number, z: number): V3 => [c[0] + u[0] * sv + N[0] * d, c[1] + u[1] * sv + N[1] * d, z]
          face(wall, [P(-w, out, lo), P(w, out, lo), P(w, out, zt), P(-w, out, zt)], N)
          face(wall, [P(-w, 0, lo), P(-w, out, lo), P(-w, out, zt), P(-w, 0, zt)], [-u[0], -u[1], 0])
          face(wall, [P(w, out, lo), P(w, 0, lo), P(w, 0, zt), P(w, out, zt)], [u[0], u[1], 0])
        }
      }
    }
  }
  // parapet lip, inner faces, roof
  const ins = offsetRing(r, -0.6)
  const tmin = Math.min(...r.map(top))
  const roofZ = tmin - drop
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n, seg = segOf(r[i], r[j])
    for (let k = 0; k < seg; k++) {
      const t0 = k / seg, t1 = (k + 1) / seg
      const L = (A2: XY, B2: XY, t: number): XY => [A2[0] + (B2[0] - A2[0]) * t, A2[1] + (B2[1] - A2[1]) * t]
      const p = L(r[i], r[j], t0), q = L(r[i], r[j], t1), pi = L(ins[i], ins[j], t0), qi = L(ins[i], ins[j], t1)
      face(s.crown, [[p[0], p[1], top(p)], [q[0], q[1], top(q)], [qi[0], qi[1], top(q)], [pi[0], pi[1], top(p)]], [0, 0, 1])
      const N = nrmXY(r[i], r[j])
      face(s.crown, [[pi[0], pi[1], roofZ], [qi[0], qi[1], roofZ], [qi[0], qi[1], top(q)], [pi[0], pi[1], top(p)]], [-N[0], -N[1], 0])
    }
  }
  roofCap(s.roof, ins, roofZ)
  return roofZ
}

/** An open crown frame on a ring: square posts every ~4.5 m and a top rail, both faces drawn. */
function frame(p: Part, ring: XY[], z0: number, z1: number, d: boolean, skip: (i: number) => boolean) {
  const r = ccw(ring), n = r.length, pw = d ? 0.5 : 0.7, rail = d ? 1.0 : 1.3, step = d ? 3.5 : 5.5
  const quad = (a: V3, b: V3, c: V3, e: V3, N: V3) => face(p, [a, b, c, e], N)
  for (let i = 0; i < n; i++) {
    if (skip(i)) continue
    const a = r[i], b = r[(i + 1) % n], N = nrmXY(a, b), L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
    const In: V3 = [-N[0], -N[1], 0]
    // the rail: outer, inner, top and soffit
    const at = (sv: number, dv: number, z: number): V3 => [a[0] + u[0] * sv - N[0] * dv, a[1] + u[1] * sv - N[1] * dv, z]
    quad(at(0, 0, z1 - rail), at(L, 0, z1 - rail), at(L, 0, z1), at(0, 0, z1), N)
    quad(at(L, pw, z1 - rail), at(0, pw, z1 - rail), at(0, pw, z1), at(L, pw, z1), In)
    quad(at(0, 0, z1), at(L, 0, z1), at(L, pw, z1), at(0, pw, z1), [0, 0, 1])
    quad(at(0, pw, z1 - rail), at(L, pw, z1 - rail), at(L, 0, z1 - rail), at(0, 0, z1 - rail), [0, 0, -1])
    // posts, the first at the corner
    const np = Math.max(1, Math.round(L / step))
    for (let k = 0; k < np; k++) {
      const s0 = (L * k) / np, s1 = Math.min(L, s0 + pw)
      quad(at(s0, 0, z0), at(s1, 0, z0), at(s1, 0, z1 - rail), at(s0, 0, z1 - rail), N)
      quad(at(s1, pw, z0), at(s0, pw, z0), at(s0, pw, z1 - rail), at(s1, pw, z1 - rail), In)
      quad(at(s1, 0, z0), at(s1, pw, z0), at(s1, pw, z1 - rail), at(s1, 0, z1 - rail), [u[0], u[1], 0])
      quad(at(s0, pw, z0), at(s0, 0, z0), at(s0, 0, z1 - rail), at(s0, pw, z1 - rail), [-u[0], -u[1], 0])
    }
  }
}

const edgeOn = (ring: XY[], i: number, a: XY, b: XY) => {
  const r = ccw(ring), p = r[i], q = r[(i + 1) % r.length], eq = (u: XY, v: XY) => Math.hypot(u[0] - v[0], u[1] - v[1]) < 0.05
  return (eq(p, a) && eq(q, b)) || (eq(p, b) && eq(q, a))
}

function build(s: Set, d: boolean) {
  const fins = d ? 1.8 : 4.5
  // ---- the Landmark Tower: the main body with its sloping crest, rising to the south ----
  // crest: a curved top edge, 392 m over the setback to the north tip, rising ever more steeply to
  // the 411.6 m peak; the southernmost strip (south of y = -86.5) stops at a 401 m shoulder
  const crest = (p: XY) => {
    if (p[1] < -86.5) return LT_SHOULDER
    const t = Math.max(0, Math.min(1, (-32 - p[1]) / 54))
    return 392 + (LT_TOP - 392) * Math.pow(t, 1.7)
  }
  block(s, s.glass, LT_MAIN, (i) => (edgeOn(LT_MAIN, i, W, A) ? LT_WING : 0), crest, { band: 9, drop: 8, segLen: d ? 1.5 : 3, fins, inner: (i) => edgeOn(LT_MAIN, i, W, A) })
  // the north tip: a flat top, a slim parapet, a clean step to the main body
  block(s, s.glass, LT_WINGP, () => 0, () => LT_WING, { band: 2.5, drop: 1.5, fins })

  // ---- the residential towers: Y plans; the north-north-west wing stops a storey group lower ----
  for (const [full, H, i0, i1] of [[A_FULL, A_TOP, 5, 11], [B_FULL, B_TOP, 5, 12]] as [XY[], number, number, number][]) {
    const [wing, main] = split(full, i0, i1)
    const cut0 = full[i0], cut1 = full[i1]
    // the bodies stop under an open crown frame: posts and a top rail standing 7 m over the roof line
    const F = 7, FW = 5
    block(s, s.res, main, (i) => (edgeOn(main, i, cut0, cut1) ? H - DROP - FW : 0), () => H - F, { band: 3, drop: 1.5, fins, inner: (i) => edgeOn(main, i, cut0, cut1) })
    block(s, s.res, wing, () => 0, () => H - DROP - FW, { band: 3, drop: 1.5, fins })
    frame(s.crown, main, H - F, H, d, (i) => edgeOn(main, i, cut0, cut1))
    frame(s.crown, wing, H - DROP - FW, H - DROP, d, () => false)
    // the helipad: a disc on legs over the wing root
    const c: XY = [(cut0[0] + cut1[0]) / 2, (cut0[1] + cut1[1]) / 2]
    // pushed 3 m out over the lower wing, so it stands clear of the taller part's parapet
    const L = Math.hypot(cut1[0] - cut0[0], cut1[1] - cut0[1]), out: XY = [(cut1[1] - cut0[1]) / L, -(cut1[0] - cut0[0]) / L]
    const ctr: XY = [c[0] + out[0] * 3, c[1] + out[1] * 3]
    const deck = H - DROP + 6
    lathe(s.trim, ctr, [[0, deck - 0.6], [7.5, deck - 0.6], [7.5, deck], [0, deck]], d ? 24 : 12)
    for (let k = 0; k < 4; k++) {
      const ang = (k / 4) * Math.PI * 2 + Math.PI / 4, rr = 4.2
      const x = ctr[0] + rr * Math.cos(ang), y = ctr[1] + rr * Math.sin(ang)
      lathe(s.trim, [x, y], [[0.45, H - DROP - 4], [0.45, deck - 0.6]], 6)
    }
  }

  // ---- the podium: the complex outline, set in 0.3 m so the tower faces run down past it ----
  const pod = offsetRing(ccw(OUTLINE), -0.3)
  for (let i = 0; i < pod.length; i++) {
    const a = pod[i], b = pod[(i + 1) % pod.length], N = nrmXY(a, b)
    face(s.podium, [[a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], BASE - 2.5], [a[0], a[1], BASE - 2.5]], N)
    face(s.trim, [[a[0], a[1], BASE - 2.5], [b[0], b[1], BASE - 2.5], [b[0], b[1], BASE], [a[0], a[1], BASE]], N)
  }
  roofCap(s.roof, pod, BASE)
}

// ---- Materials and output ----------------------------------------------------------------------

const GLASS: MaterialSpec = { ...PALETTE.window, color: 0x4b6a90 }
const RES: MaterialSpec = windowVariant(2, 0x5f7f9f)
const CROWN: MaterialSpec = finish('neon-lct-crown', 0x9fbfc9, 0.4)
const TRIM: MaterialSpec = PALETTE.trim
const ROOFM: MaterialSpec = PALETTE.roof
const PODIUM: MaterialSpec = windowVariant(3, 0x8a96a0)

const low = mk(), det = mk()
build(low, false)
build(det, true)
const layers = (s: Set): Layer[] => [
  { part: s.glass, material: GLASS },
  { part: s.res, material: RES },
  { part: s.crown, material: CROWN },
  { part: s.trim, material: TRIM },
  { part: s.roof, material: ROOFM },
  { part: s.podium, material: PODIUM },
]

if (import.meta.main) {
  await saveLods('busan-lct-landmark-tower', 'Haeundae LCT The Sharp', layers(low), layers(det), {
    frame: 'Y up, -Z north, +X east, metres, bearing 0; origin at the centroid of the OSM outline way/1467804490, on the ground',
    bearing: 0, height: LT_TOP,
  }, 5000)
}
