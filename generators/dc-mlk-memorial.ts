/**
 * Martin Luther King Jr. Memorial, Washington, DC — procedural, CC0-1.0.
 *
 *   bun generators/dc-mlk-memorial.ts
 *
 * Map frame: x east, y north, z up, metres. The origin is the centre of the
 * Stone of Hope's OSM outline (lng -77.0442258, lat 38.8862254), on the plaza.
 * Bearing 0: the plan below is OSM's, in true north.
 *
 * The memorial is three pieces of pale granite and a wall. Out of the
 * Mountain of Despair, two great blocks split apart to make the entrance,
 * comes the Stone of Hope, pushed forward toward the Tidal Basin with King
 * emerging from its front face, arms folded, looking across the water to the
 * Jefferson Memorial. Behind them the Inscription Wall curves away both ways.
 *
 * Evidence
 *  - OSM (measured): relation/12268799 "Stone of Hope" (building=yes,
 *    memorial=statue) is a multipolygon of three outer ways, the two halves
 *    of the Mountain of Despair (way/903224407, way/903224408) and the Stone
 *    of Hope itself (way/903224411, 6.9 × 3.9 m, its long side running to
 *    the south-east). The Inscription Wall is the two barrier=wall ways
 *    way/903224417 and way/903224410, drawn along the crescent.
 *  - Published (Wikipedia, NPS): the Stone of Hope is 30 ft (9.1 m) high;
 *    the Inscription Wall is 450 ft (140 m) long; pale granite (Lei Yixin,
 *    ROMA Design Group, 2011).
 *  - Photos (Wikimedia Commons): Rachel Hendrix's two views from above the
 *    Tidal Basin (public domain) for the plan and the relative heights; Larry
 *    Syverson (CC BY-SA 2.0) and John Brighenti (CC BY 2.0, both photos) for
 *    the split Mountain from the entrance plaza; VillageHero (CC BY-SA 2.0)
 *    for the Mountain's rough sloping back; AsaQuathern (CC BY-SA 4.0) for
 *    King's pose; Pmvf (CC BY-SA 4.0) for the wall.
 *
 * Measured: the Stone's front is drawn 4.7 m wide, not OSM's 3.9 m. In
 * Hendrix's view from across the Basin (public domain, about 17° off King's
 * line of sight) the front face is 125 px wide against 230 px from plaza to
 * top: with the published 9.1 m height that is 4.9 m (the small angle only
 * narrows the face, so the true width is if anything a little more).
 * Brighenti's sunset photo, its foot cut off, bounds it at no more than
 * 5.2 m. 4.7 m is the lower, safer reading of both. OSM's outline is
 * probably traced at the hewn, narrower top. Estimated: the Mountain's
 * halves rise to 7.8 m at the split (photos against the Stone) and fall to
 * about 2.4 m at their outer ends; the wall is 3.2 m high and 0.8 m thick;
 * the figure's proportions are measured off the front photo against the
 * block. The cut faces of the split and of the Stone are flat, the outer
 * faces of the Mountain are rough: drawn as flat planes with a jittered top.
 *
 * The plaza, the lawns, the cherry trees and the Tidal Basin are the map's.
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { body, earcut, ellipsoid, prism, rect, save, tube, unit, type XY } from './dc-wwii-memorial'

const rock = new Part()
const figure = new Part()
const wall = new Part()

// Everything below is OSM, shifted to the Stone's centre.
const O: XY = [4.7, 10.55]
const sh = (pts: XY[]): XY[] => pts.map(([x, y]) => [x - O[0], y - O[1]])

// ---- Mountain of Despair ----------------------------------------------------
// Each half: vertical rough sides, and a top that is highest at the cut face
// of the split and falls away toward the half's outer end.
const MOUNT_H = 7.8, MOUNT_LOW = 2.4
function mountain(poly: XY[], cut: [XY, XY]) {
  const [a, b] = cut
  const d = unit([b[0] - a[0], b[1] - a[1], 0])
  const dist = (p: XY) => Math.abs((p[0] - a[0]) * d[1] - (p[1] - a[1]) * d[0])
  const dmax = Math.max(...poly.map(dist))
  // A small, fixed jitter so the top reads as hewn rock, not a ramp.
  const jit = [0, 0.35, -0.3, 0.25, -0.2, 0.4, -0.35, 0.2, -0.25, 0.3, -0.15, 0.2]
  const h = poly.map((p, i) => {
    const t = dist(p) / dmax
    const base = MOUNT_H - (MOUNT_H - MOUNT_LOW) * Math.pow(t, 1.25)
    return t < 0.05 ? base : base + jit[i % jit.length]
  })
  const r = poly.map((p, i) => ({ p, h: h[i] }))
  // Walls, counter-clockwise.
  const ccw = (() => {
    let s = 0
    for (let i = 0; i < r.length; i++) {
      const j = (i + 1) % r.length
      s += r[i].p[0] * r[j].p[1] - r[j].p[0] * r[i].p[1]
    }
    return s > 0 ? r : [...r].reverse()
  })()
  for (let i = 0; i < ccw.length; i++) {
    const A = ccw[i], B = ccw[(i + 1) % ccw.length]
    rock.quad([A.p[0], A.p[1], 0], [B.p[0], B.p[1], 0], [B.p[0], B.p[1], B.h], [A.p[0], A.p[1], A.h])
  }
  for (const [i, j, k] of earcut(ccw.map(v => v.p))) {
    const P = (n: number): V3 => [ccw[n].p[0], ccw[n].p[1], ccw[n].h]
    rock.tri(P(i), P(j), P(k))
  }
}
const M1 = sh([[-13.5, 25.9], [-8.2, 20.9], [-6.0, 23.5], [-4.3, 26.0], [-3.8, 28.5], [-4.6, 29.6], [-7.1, 29.3], [-9.5, 28.7], [-11.1, 27.9], [-11.9, 27.6]])
const M2 = sh([[-16.0, 23.1], [-10.7, 18.3], [-12.6, 16.1], [-14.4, 14.6], [-16.0, 13.6], [-17.4, 13.3], [-18.8, 13.7], [-19.0, 14.8], [-19.2, 16.4], [-18.3, 19.6], [-17.7, 20.7], [-17.3, 21.6]])
mountain(M1, [M1[0], M1[1]])
mountain(M2, [M2[0], M2[1]])

// ---- Stone of Hope ------------------------------------------------------------
// Local frame: F forward (to the south-east, the way King looks), S to his
// left-to-right as seen from the front... i.e. the viewer's right.
const F: XY = [0.581, -0.814]
const S: XY = [F[1] * -1, F[0]] // F rotated +90°: viewer's left when facing him
const L = (u: number, v: number, z: number): V3 => [u * -S[0] + v * F[0], u * -S[1] + v * F[1], z]
const W = 2.35, BACK = -3.45, FACE = 2.35
{
  // The block: flat-cut sides, front top at the hairline, a hewn top that
  // drops a little toward the back.
  const ring = (z0: number, z1f: number, z1b: number, inset = 0): V3[] => [
    L(-W + inset, BACK + inset, z1b), L(W - inset, BACK + inset, z1b), L(W - inset, FACE - inset, z1f), L(-W + inset, FACE - inset, z1f),
  ]
  const lo = ring(0, 0, 0)
  const mid = ring(0, 8.45, 8.1)
  const hi = ring(0, 8.8, 8.4, 0.35)
  rock.loft([lo, mid, hi])
  rock.cap(hi, true)
}
// King, in high relief on the front face, built from the photo: head crown
// 9.2 m, chin 7.85, squared shoulders 7.75, folded arms 5.7–7.3, jacket hem
// 2.7, the legs only roughed out below it.
{
  const y = FACE
  const at = (u: number, v: number, z: number): V3 => L(u, y + v, z)
  // Rows are [z, half-width, half-depth, centre u, centre v]; ovals are in
  // the local frame, so turn them by the stone's heading.
  const rot = Math.atan2(-S[1], -S[0])
  const rows = (rs: number[][]) => rs.map(([z, rx, ry, u = 0, v = 0]) => {
    const c = at(u, v, z)
    return [z, rx, ry, c[0], c[1], rot]
  })
  // Legs and jacket.
  // Legs, only roughed out of the stone, then the jacket from its hem up.
  body(figure, rows([
    [0.2, 0.95, 0.12, 0, -0.05], [1.5, 1.05, 0.22, 0, 0.0], [2.55, 1.2, 0.3, 0, 0.05],
  ]), 12, 50)
  body(figure, rows([
    [2.55, 1.3, 0.5, 0, 0.2], [2.75, 1.35, 0.62, 0, 0.3], [4.3, 1.35, 0.68, 0, 0.32],
    [5.6, 1.42, 0.7, 0, 0.34], [6.6, 1.5, 0.66, 0, 0.32],
  ]), 14, 70)
  // Broad, squared shoulders: a bevelled block across the top of the chest,
  // its outer corners just rounded, as the padded jacket reads in the photo.
  {
    const c = at(0, 0.32, 0)
    prism(figure, rect(c[0], c[1], 1.62, 0.62, rot, 0.3), 6.4, 7.75, 0.3)
  }
  // Collar, then the head: round, sitting straight on the shoulders, 1.35 m
  // from chin to crown (a seventh of the figure).
  body(figure, rows([[7.6, 0.62, 0.5, 0, 0.35], [7.95, 0.5, 0.42, 0, 0.4]]), 10, 60)
  ellipsoid(figure, at(0, 0.45, 8.5), [0.62, 0.62, 0.68], 12, 7)
  // The arms folded high on the chest: forearms crossing in a thick band
  // from elbow to elbow, standing well proud of the jacket; upper arms down
  // the sides from the shoulders.
  tube(figure, [at(-1.6, 0.65, 6.55), at(-0.7, 1.15, 6.6), at(0.5, 1.2, 6.75), at(1.6, 0.7, 6.85)],
    [0.5, 0.52, 0.52, 0.5], [0.5, 0.52, 0.52, 0.5], 8)
  for (const s of [-1, 1]) {
    tube(figure, [at(s * 1.5, 0.32, 7.45), at(s * 1.68, 0.55, 6.6)], [0.5, 0.5], [0.46, 0.48], 8)
  }
}

// ---- the Inscription Wall -----------------------------------------------------
const WALL_H = 3.2, WALL_T = 0.4
function band(pts: XY[]) {
  const N = pts.length
  const Lp: V3[] = [], Rp: V3[] = []
  for (let i = 0; i < N; i++) {
    const a = pts[Math.max(0, i - 1)], c = pts[Math.min(N - 1, i + 1)]
    const d = unit([c[0] - a[0], c[1] - a[1], 0])
    Lp.push([pts[i][0] - d[1] * WALL_T, pts[i][1] + d[0] * WALL_T, 0])
    Rp.push([pts[i][0] + d[1] * WALL_T, pts[i][1] - d[0] * WALL_T, 0])
  }
  const up = (v: V3, z = WALL_H): V3 => [v[0], v[1], z]
  for (let i = 0; i < N - 1; i++) {
    wall.quad(up(Lp[i]), up(Rp[i]), up(Rp[i + 1]), up(Lp[i + 1]))
    wall.quad(Rp[i], Rp[i + 1], up(Rp[i + 1]), up(Rp[i]))
    wall.quad(Lp[i + 1], Lp[i], up(Lp[i]), up(Lp[i + 1]))
  }
  wall.quad(Rp[0], up(Rp[0]), up(Lp[0]), Lp[0])
  wall.quad(Lp[N - 1], up(Lp[N - 1]), up(Rp[N - 1]), Rp[N - 1])
}
// South-west arm (way/903224417), from the Mountain's south half out; and
// the north-east arm (way/903224410), from the north half out. Their first
// points lie inside the Mountain, so they start at its back.
band(sh([[-18.3, 19.6], [-19.2, 16.4], [-19.0, 14.8], [-21.9, 10.5], [-25.0, 4.4], [-26.7, 1.2], [-28.3, -1.8], [-30.8, -8.0], [-32.9, -14.1], [-34.5, -21.7], [-35.3, -27.2], [-35.9, -33.4], [-36.0, -39.8], [-35.6, -43.7]]))
band(sh([[-7.1, 29.3], [-4.6, 29.6], [1.8, 34.8], [8.8, 39.0], [14.4, 41.9], [20.3, 44.1], [27.4, 46.5], [35.0, 48.4], [42.3, 49.4], [49.7, 50.0], [56.4, 49.7], [62.7, 49.0], [66.6, 48.4]]))

await save('dc-mlk-memorial', 'Martin Luther King Jr. Memorial', [
  // The pale, faintly warm granite of the Stone and the Mountain.
  { part: rock, material: finish('mlk-granite', 0xe9e1d6) },
  // King himself, the same stone, a touch lighter where it is polished.
  { part: figure, material: finish('mlk-figure', 0xf3ece2) },
  // The Inscription Wall's dark granite, pulled light.
  { part: wall, material: finish('mlk-wall', 0x8e908f) },
], { bearing: 0, osm: 'relation/12268799' })
