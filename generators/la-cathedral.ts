/**
 * Cathedral of Our Lady of the Angels — procedural, CC0-1.0, no textures.
 *
 *   bun generators/la-cathedral.ts
 *
 * Rafael Moneo, 2002. Frame: x along the nave toward the altar end and the
 * plaza (south-east, 135.4°), y toward the Hollywood Freeway (north-east),
 * z up, metres; placed at bearing 45.4°. Origin is the area centroid of the
 * OSM outline (way/39550465).
 *
 * Masses, kept as Moneo drew them, with no right angles in plan:
 * - the nave: sheer ochre concrete walls on the OSM outline, stepping up
 *   from the Grand Avenue end (24 m) to the middle (31 m), with the roof
 *   set down behind stone parapets so that from the street it is all wall;
 * - the altar block at the plaza end, standing well above the nave;
 * - the alabaster cross window: a glazed box set high on the altar block's
 *   plaza face, cut by a concrete cross, its top rising past the roof;
 * - the great louvred alabaster window on Temple Street: a wall of broad
 *   dark louvres leaning out from the gable wall that rises above the
 *   nave, and a flatter one on the freeway side;
 * - the campanile, a separate thin slab on a low base at the north-west
 *   corner by Grand Avenue, its top sloping, with stacked bell openings and
 *   the 25 ft cross: the tallest thing on the site.
 *
 * Evidence
 * - OSM way/39550465 (outline; its height=15 is wrong for the cathedral and
 *   comes from the county footprint, which covers the whole plaza and
 *   conference centre) and way/425993507 (campanile, 46.8 m).
 * - LA County LARIAC 2020 lidar: campanile footprint 487281843809, 46.80 m.
 *   The county's cathedral footprint (2014092873370000, 14.95 m) spans the
 *   plaza deck and is not usable for the nave.
 * - Published: nave 333 ft (101 m) long; interior ceiling 85 ft (26 m)
 *   (Wikipedia); campanile 156 ft with a 25 ft cross (olacathedral.org).
 * - 3DEP bare earth: 115.9–119.5 m round the building; y = 0 at the plaza /
 *   Hill Street side.
 * - NAIP ortho: grey roof planes; shadows on Grand Avenue put the
 *   north-west side walls at about 20 m.
 * - Photos (Wikimedia Commons):
 *   - "Exterior of Cathedral of Our Lady of the Angels dllu.jpg", Daniel L.
 *     Lu, CC BY-SA 4.0 — plaza (south-east) face head-on: cross window box.
 *   - "Los Angeles Cathedral.jpg", David C, CC0 — plaza face.
 *   - "Our Lady of Angels, LA, CA, jjron 22.03.2012.jpg", jjron, GFDL 1.2 —
 *     Temple Street (south-west) side: stepped gables, louvred window.
 *   - "Cathedral of Our Lady of Angels, Los Angeles.JPG", CC BY-SA 4.0 —
 *     from the freeway (east): altar block, cross, campanile.
 *   - "Los Angeles Cathedral-3.jpg", David C, CC0 — campanile and the
 *     north side from Grand Avenue.
 *
 * Measured: plan (OSM), campanile height (lidar), ground. Published: length,
 * ceiling, campanile cross. Estimated: the west end 24 m (shadows on
 * Grand Avenue put the walls there at about 20 m), the nave parapets 31 m
 * over the 26 m ceiling, the Temple Street gable 38 m, the altar block 41 m
 * and 37 m and the cross box (photo proportions against the plaza face's
 * width), the campanile shaft's thickness (6 m, on the lidar footprint's
 * long axis, over a base on the whole footprint), window extents. The
 * cantilevered roof slabs either side of the cross box are left out: they
 * hang past the walls.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, cap, ccw, inset, panel, prism, save, walls } from './la-city-hall'

const concrete = new Part(), roof = new Part(), win = new Part(), metal = new Part(), dark = new Part()

/**
 * A sheer walled mass: outer walls to a stone parapet at H, the roof set
 * `drop` below it behind the parapet, so it hides from the street.
 */
function walled(ring: XY[], H: number, drop = 3.5, rim = 1.1) {
  const { top } = prism(concrete, null, ring, 0, H, { bevel: 0.35, corner: 0.4 })
  const inner = inset(top, rim)
  const n = top.length
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    concrete.quad([top[i][0], top[i][1], H], [top[j][0], top[j][1], H], [inner[j][0], inner[j][1], H], [inner[i][0], inner[i][1], H])
  }
  walls(concrete, inner, H - drop, H, true)
  cap(roof, inner, H - drop)
}

/** A vertical slab in the x–z plane between y0 (front, facing -y) and y1; `prof` (x, z) counter-clockwise seen from the front. */
function slab(p: Part, prof: XY[], y0: number, y1: number) {
  const n = prof.length
  for (let i = 1; i < n - 1; i++) {
    p.tri([prof[0][0], y0, prof[0][1]], [prof[i][0], y0, prof[i][1]], [prof[i + 1][0], y0, prof[i + 1][1]])
    p.tri([prof[0][0], y1, prof[0][1]], [prof[i + 1][0], y1, prof[i + 1][1]], [prof[i][0], y1, prof[i][1]])
  }
  for (let i = 0; i < n; i++) {
    const a = prof[i], b = prof[(i + 1) % n]
    p.quad([a[0], y0, a[1]], [a[0], y1, a[1]], [b[0], y1, b[1]], [b[0], y0, b[1]])
  }
}

// --- Nave, in two stepped masses on the OSM outline (its small notches at
// the Grand Avenue end straightened). The freeway side wall runs at an
// angle: y = 17.7 + 0.4065 (x + 31).
const ne = (x: number) => 17.7 + 0.4065 * (x + 31)
const ALTAR_X = 27
walled(ccw([[-47.2, -32.2], [-25, -32.2], [-25, ne(-25)], [-31, 17.7], [-49.1, 21.6], [-51.8, -0.6]]), 24)
walled(ccw([[-25.3, -32.2], [ALTAR_X, -32.2], [ALTAR_X, ne(ALTAR_X)], [-25.3, ne(-25.3)]]), 31)

// --- Altar block at the plaza end: the south part, carrying the cross,
// highest; the freeway part a separate, lower plane.
const ALTAR = 41, ALTAR_N = 36.5
walled(ccw([[ALTAR_X - 0.3, -32.2], [39.6, -31], [40.4, -24.5], [37.4, -21.9], [39.4, -14.7], [49.1, -8.7], [43.3, 11.6], [ALTAR_X - 0.3, 11.6]]), ALTAR, 4)
walled(ccw([[ALTAR_X - 0.3, 11.4], [43.4, 11.4], [44.2, 19.6], [37.4, 33.1], [42.8, 47.7], [ALTAR_X - 0.3, ne(ALTAR_X - 0.3)]]), ALTAR_N, 4)
// Tall slot windows high in the plaza end's flanks, as in the photos.
panel(win, [39.6, -31], [ALTAR_X - 0.3, -32.2], 3, 6.5, 24, 37, 0.06)
panel(win, [44.2, 19.6], [37.4, 33.1], 4, 7, 20, 33, 0.06)

// --- The cross window on the plaza face (outline edge (49.1,-8.7) →
// (41.2,10.8), facing east-south-east): a glazed box hung high on the
// wall, its top standing above the parapet, cut by a concrete cross.
{
  const a: XY = [49.1, -8.7], b: XY = [41.2, 10.8]
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
  const W = 11.5, s0 = (L - W) / 2, D = 3.2
  const z0 = 19, z1 = ALTAR + 3.5
  const at = (s: number, d: number): XY => [a[0] + u[0] * s + n[0] * d, a[1] + u[1] * s + n[1] * d]
  prism(win, win, [at(s0, -2), at(s0 + W, -2), at(s0 + W, D), at(s0, D)], z0, z1, { bevel: 0.01, corner: 0.15, bottom: win })
  const fa = at(s0, D), fb = at(s0 + W, D), mid = W / 2
  panel(concrete, fa, fb, mid - 0.8, mid + 0.8, z0 + 0.4, z1 - 0.2, 0.06)
  panel(concrete, fa, fb, 0.4, W - 0.4, z1 - 8.6, z1 - 7.2, 0.06)
}

// --- Temple Street: the gable wall rising above the nave parapet, and the
// great louvred window leaning out of it in broad bands.
{
  const Y0 = -32.2, Y1 = -30.6
  slab(concrete, [[-24.5, 30.4], [ALTAR_X - 0.3, 30.4], [ALTAR_X - 0.3, 36.8], [-3, 39.5]], Y0, Y1)
  const X0 = -2, X1 = 25, ZB = 9, ZT = 36, LEAN = 1.8, BANDS = 9, TIP = 1.0
  const Y = (z: number) => Y0 - 0.05 - (LEAN * (z - ZB)) / (ZT - ZB)
  for (let k = 0; k < BANDS; k++) {
    const za = ZB + ((ZT - ZB) * k) / BANDS, zb = ZB + ((ZT - ZB) * (k + 1)) / BANDS
    const lo: V3[] = [[X0, Y(za), za], [X1, Y(za), za]]
    const hi: V3[] = [[X1, Y(zb) - TIP, zb], [X0, Y(zb) - TIP, zb]]
    // The louvre face, leaning out to its tip.
    win.quad(lo[0], lo[1], hi[0], hi[1])
    // Its top, running back to the next louvre's foot.
    dark.quad(hi[1], hi[0], [X1, Y(zb), zb], [X0, Y(zb), zb])
  }
  // Stone cheeks either side of the leaning window.
  const tip = Y(ZT) - TIP
  concrete.tri([X0, Y0, ZB], [X0, Y0, ZT], [X0, tip, ZT])
  concrete.tri([X1, Y0, ZB], [X1, tip, ZT], [X1, Y0, ZT])
  concrete.tri([X0, Y0, ZT], [X1, Y0, ZT], [X1, tip, ZT])
  concrete.tri([X0, Y0, ZT], [X1, tip, ZT], [X0, tip, ZT])
}
// Freeway side: the matching louvred window, flatter, in bands.
{
  const a: XY = [ALTAR_X, ne(ALTAR_X)], b: XY = [-25.3, ne(-25.3)]
  for (let k = 0; k < 6; k++) panel(win, a, b, 6, 40, 12 + k * 2.9, 12 + k * 2.9 + 2.1, 0.06)
}

// --- Campanile: lidar footprint 16 × 8 m. A low base on the whole
// footprint, then a thin slab 6 m thick on its long axis, its top sloping
// up to the lidar's 46.8 m (ground 0.8 m above y = 0), then the cross.
{
  const c: XY[] = ccw([[-40.5, 45.7], [-36.3, 38.9], [-50.9, 32.3], [-50.7, 43.3]])
  prism(concrete, concrete, c, 0, 9, { bevel: 0.35, corner: 0.35 })
  const m: XY = [-44.6, 40.05], ax: XY = [0.912, 0.412], by: XY = [-0.412, 0.912]
  const HL = 7.2, HT = 3.0, ZLO = 45.2, ZHI = 47.6
  const P = (s: number, t: number, z: number): V3 => [m[0] + ax[0] * s + by[0] * t, m[1] + ax[1] * s + by[1] * t, z]
  const ztop = (s: number) => ZLO + ((ZHI - ZLO) * (s + HL)) / (2 * HL)
  const corners: [number, number][] = [[-HL, -HT], [HL, -HT], [HL, HT], [-HL, HT]]
  for (let i = 0; i < 4; i++) {
    const [s0, t0] = corners[i], [s1, t1] = corners[(i + 1) % 4]
    concrete.quad(P(s0, t0, 8.6), P(s1, t1, 8.6), P(s1, t1, ztop(s1)), P(s0, t0, ztop(s0)))
  }
  concrete.quad(P(-HL, -HT, ztop(-HL)), P(HL, -HT, ztop(HL)), P(HL, HT, ztop(HL)), P(-HL, HT, ztop(-HL)))
  // Bell openings: two stacked near the high end, on both broad faces.
  for (const t of [-HT - 0.06, HT + 0.06]) for (const [z0, z1] of [[33.5, 37.5], [38.5, 42.5]]) {
    const q = [P(1.4, t, z0), P(4.6, t, z0), P(4.6, t, z1), P(1.4, t, z1)]
    if (t < 0) dark.quad(q[0], q[1], q[2], q[3]); else dark.quad(q[1], q[0], q[3], q[2])
  }
  // The 25 ft cross, standing on the high end.
  const box = (s0: number, s1: number, tt: number, z0: number, z1: number) =>
    prism(metal, metal, [[P(s0, -tt, 0)[0], P(s0, -tt, 0)[1]], [P(s1, -tt, 0)[0], P(s1, -tt, 0)[1]], [P(s1, tt, 0)[0], P(s1, tt, 0)[1]], [P(s0, tt, 0)[0], P(s0, tt, 0)[1]]], z0, z1, { bevel: 0.1, corner: 0.1 })
  box(4.6, 5.6, 0.5, ZHI - 0.6, ZHI + 7.6)
  box(3.0, 7.2, 0.5, ZHI + 4.6, ZHI + 5.6)
}

save('la-cathedral', 'Cathedral of Our Lady of the Angels', [
  { part: concrete, material: finish('ochre-concrete', 0xe2c8a6) },
  { part: roof, material: PALETTE.roof },
  { part: win, material: PALETTE.window },
  { part: metal, material: PALETTE.metal },
  { part: dark, material: finish('bell-openings', 0x7d7369) },
], { bearing: 45.4, anchor: [34.0580782, -118.2455647], height: 55.2, osm: 'way/39550465' })
