/**
 * Acropolis of Athens: procedural, CC0-1.0, no textures.
 * bun generators/athens-acropolis.ts
 *
 * The summit of the rock as it stands today: the ruined Parthenon, the
 * Erechtheion with its Caryatid porch, the Propylaia with the Pinakotheke and
 * south wing, the Temple of Athena Nike on its bastion, the Monument of
 * Agrippa, the foundations of the Old Temple of Athena, and the fortification
 * walls round the rim, standing on the upper rock.
 *
 * Map frame: x east, y north, z up, metres; bearing 0, built in true
 * orientation from OSM. The origin is the anchor (23.7262 E, 37.9715 N),
 * between the Parthenon and the Propylaia; y = 0 is the foot of the cliffs.
 *
 * Why the rock is in the model. The map stands a model on its terrain with
 * its base following the ground and everything more than 25 m above it
 * lifted by the mean rise under the plan (see `web/landmark-ground.ts`).
 * Mapterhorn has only z12 here (about 15 m a pixel, tools/terrain.ts can't
 * check the site), and on that DEM the summit is a smooth dome: 156 m at the
 * Parthenon, 133 m at the Nike bastion, 105-115 m round the foot. A model of
 * the summit buildings alone, flat-based, would be draped over that dome
 * with its tops pulled toward the mean and the Parthenon squashed to a few
 * metres; built over the DEM instead, it would float tens of metres up in
 * every viewer without terrain (previews, the inspector, Open Landmarks).
 * So the model carries the upper rock, as the map's fill expects of
 * podiums and rockwork: inside the model's plan the terrain is brought down
 * to the ground round it, and the model draws the cliffs, the walls on
 * their rim and the summit on top. The lower slopes stay the map's.
 *
 * Levels (estimated, see below): P = 34 m, the plateau at the Parthenon's
 * krepis; W = P - 10, the Propylaia's west portico and the Nike bastion; the
 * ramp climbs to W from 7 m lower between the bastion and the Agrippa
 * terrace; the Panathenaic way climbs from the Propylaia's east portico
 * (W + 1.5) to P; the terrace north of the Erechtheion is P - 3.4. The walls
 * are a vertical band below the rim, 14 m on the south (the Kimonian wall),
 * 10 m north and east, 9 m round the Nike bastion; below them the rock
 * slopes out 12 to 18 m to y = 0.
 *
 * Evidence:
 * - OSM. The rim: relation/12352553 (Acropolis walls, outer ways 910010382,
 *   910010327 and 910010328), closed across the Propylaia's west front.
 *   The Parthenon, way/910010406, and its 288 building:parts: every column
 *   (58 circles with their standing heights, among them the four broken
 *   ones of the south flank and the half-height north columns of the east
 *   pronaos), the krepis (0-1.8 m), the peristyle entablature ring
 *   (architrave 12.24-13.6, frieze to 14.96, cornice to 15.34) with its gap
 *   on the south between the broken columns, the west pediment (gabled to
 *   19.96 m), the two corner fragments of the east pediment (17.5 and
 *   18 m), the west cella wall with its door (to 12.54, lintel band to
 *   14.95), the stepped wall ends east of it and the low cella walls
 *   (3.6 m). Erechtheion way/910010334 (main block, north porch, Caryatid
 *   porch); Propylaia relation/12352555 (central building, Pinakotheke,
 *   south wing, eight column circles); Athena Nike relation/12352554
 *   (stylobate and cella); Old Temple of Athena relation/12352551 (tagged
 *   "Old Parthenon"); Monument of Agrippa way/426887028.
 * - Published (Wikipedia, "Parthenon", "Erechtheion", "Propylaia (Acropolis
 *   of Athens)", "Temple of Athena Nike", "Monument of Agrippa"): Parthenon
 *   stylobate 69.5 x 30.9 m, columns 10.4 m and 1.9 m across, 8 x 17;
 *   Erechtheion east porch columns 6.6 m, north porch 7.6 m, its floor about
 *   3 m below the east porch, caryatids 2.3 m on a 1.8 m parapet;
 *   Propylaia west portico of six Doric columns 8.8 m tall, 1.56 m across,
 *   the wider central intercolumniation, six Ionic columns in the hall;
 *   Nike stylobate 8.3 x 5.6 m, Ionic columns 4.1 m; Agrippa pedestal
 *   about 13 m.
 * - Photos (Wikimedia Commons):
 *   "Attica 06-13 Athens 50 View from Philopappos - Acropolis Hill.jpg",
 *   A.Savin, CC BY-SA 3.0 (south-west: walls, levels, Parthenon over the
 *   Kimonian wall);
 *   "View of the Acropolis of Athens from Lycabettus, 20240531 1922 9902.jpg",
 *   Jakub Hałun, CC BY 4.0 (north-east);
 *   "View of the Acropolis from the Areopagus, 20240531 1217 9600.jpg",
 *   Jakub Hałun, CC BY 4.0, and "20101024 Acropolis panoramic view from
 *   Areopagus hill Athens Greece.jpg", Ggia, CC BY-SA 3.0 (north-west:
 *   Pinakotheke, Agrippa, Propylaia, Nike bastion);
 *   "Acropolis From the top.jpg", Sfetkos, CC BY-SA 4.0 (from above);
 *   "The Parthenon (West Facade) on May 19, 2020.jpg" and "West Facade and
 *   North Side of the Parthenon on June 21, 2021.jpg", George E. Koronaios,
 *   CC BY-SA 4.0; "The north side of the Parthenon on September 20,
 *   2020.jpg" and "The South Side of the Parthenon on September 20,
 *   2020.jpg", George E. Koronaios, CC0; "Parthenon east side Acropolis
 *   Athens, Greece.jpg", Jebulon, CC0;
 *   "The Porch of the Caryatids, Erechtheion - panoramio.jpg", Tomi
 *   Mäkitalo, CC BY-SA 3.0; "Athen, Akropolis, Erechtheion Nordosten
 *   2015-09.jpg", HerrAdams, CC BY-SA 4.0;
 *   "Temple Athena Nike 2016.jpg" and "Temple of Athena Nike from below
 *   Athens.jpg", Jebulon, CC0; "Temple of Athena Nike (Athens)-Propylaea.jpg",
 *   Yair-haklai, CC BY-SA 4.0;
 *   "The Acropolis of Athens at night on October 20, 2024.jpg" and "The
 *   Acropolis of Athens from Philopappos Hill on April 7, 2020.jpg" (night),
 *   George E. Koronaios, CC BY-SA 4.0.
 * - Terrain: Mapterhorn z12, read with a copy of tools/terrain.ts set to z12
 *   (the tool itself asks for z15, which Mapterhorn doesn't have here). The
 *   map's fill brings the ground under the model down to 0-29 m above the
 *   lowest point of the 7 x 7 grid (about 105 m, at the plan's north-west
 *   corner), 16.4 m on average, so everything above 25 m stands at about
 *   105 + 16.4 m: P = 34 m puts the plateau at about 155 m, the published
 *   summit. The check finds only the cliff's foot sunk, by up to 1.5 m, on
 *   the west slope, where the rock is meant to meet the hillside.
 *
 * Estimated: the absolute levels (P - W = 10 m read off the Philopappos and
 * Areopagus photos against the Propylaia's 8.8 m columns; the published
 * summit is 156 m); the rock's height (34 m, from the drape above, and
 * against the photos' cliff and wall bands over the Odeon of Herodes
 * Atticus); the wall band heights and
 * the cliff's spread; the Pinakotheke's height (photo), the south wing,
 * the Propylaia's gate wall and doors; the Erechtheion's main-block cornice
 * (7.8 m over the east porch floor, the walls being broken; the east
 * porch's entablature 8.4 m); the Agrippa pedestal's split into base
 * and shaft. The Nike and Erechtheion axes are OSM's.
 * Simplified: column capitals are square blocks (echinus and abacus as one,
 * smooth-shaded so their edges read soft);
 * no triglyphs, metopes, mutules or sculpture; the caryatids are turned
 * figures; the Erechtheion's main block is a closed shell with a sunk top
 * (it is roofless) and its stepped north wall is level; the Propylaia's
 * ceiling beams, the scaffolding and cranes on the Parthenon, the Belvedere
 * flag, the Beulé Gate, the Roman stair and the modern sheds and lift are
 * left out; the rock is a smooth band, its caves and buttresses dropped.
 *
 * Night: the monuments are floodlit warm gold from below; the walls take
 * less, the rock least, fading toward its foot.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { finish } from './palette'
import { triangulate, lathe, type XY } from './chi-aon-center'
import { column, orient } from './dc-lincoln-memorial'

// ---------------------------------------------------------------------------
// Levels (m above the foot of the cliffs).

const P = 34 // plateau at the Parthenon's krepis
const W = P - 10 // Propylaia west portico, Nike bastion
const NORTH_TERRACE = P - 3.4 // north of the Erechtheion

// ---------------------------------------------------------------------------
// OSM data, metres from the anchor (x east, y north).

/** The rim of the walls, relation/12352553, from the Nike bastion east along the south wall, round the east end and back along the north wall. */
const RIM: XY[] = [[-101.4,10.7],[-101.2,9.8],[-104.5,9.0],[-117.7,6.3],[-119.1,6.4],[-119.6,0.8],[-120.0,-3.0],[-113.9,-3.4],[-100.8,-4.5],[-100.6,-5.9],[-97.7,-5.7],[-66.7,-16.4],[-49.4,-22.3],[-49.3,-22.0],[-31.0,-28.3],[-31.1,-28.7],[-17.1,-33.4],[-1.0,-38.6],[5.0,-40.1],[9.0,-41.1],[9.2,-41.7],[19.1,-43.9],[27.6,-44.6],[28.0,-43.8],[39.5,-42.7],[44.9,-42.1],[65.4,-40.0],[75.1,-38.1],[93.8,-36.3],[121.8,-32.6],[132.8,-31.2],[147.6,-29.2],[154.1,-28.4],[163.1,-27.4],[169.3,-26.7],[186.9,-22.7],[186.9,-21.4],[164.7,25.6],[159.4,36.9],[163.5,38.9],[161.9,42.3],[157.7,40.4],[156.7,42.6],[153.4,41.1],[151.5,42.5],[149.5,44.1],[142.2,44.8],[132.5,47.1],[128.5,47.5],[117.1,55.3],[115.7,57.1],[112.3,61.3],[100.1,60.9],[98.9,60.9],[92.3,62.3],[90.3,62.9],[88.9,63.3],[87.7,64.0],[81.6,68.8],[78.4,71.1],[77.4,71.9],[76.8,72.1],[75.2,72.3],[74.0,72.6],[72.5,73.1],[70.7,74.3],[69.5,75.5],[66.4,80.9],[62.8,86.1],[62.3,86.4],[51.0,86.1],[40.4,85.1],[38.8,84.2],[38.2,83.9],[35.8,83.3],[34.8,83.0],[32.3,82.7],[30.5,82.6],[25.2,81.1],[23.2,80.5],[20.0,83.5],[17.4,86.1],[15.3,88.1],[13.4,89.9],[12.8,90.1],[6.4,89.1],[5.8,89.1],[5.2,89.2],[4.3,89.4],[-3.4,88.1],[-4.1,88.0],[-4.9,87.8],[-22.6,84.9],[-24.1,84.6],[-36.4,84.1],[-52.9,83.4],[-54.3,75.2],[-63.5,70.3],[-80.1,65.2],[-80.6,65.2],[-89.5,61.8],[-93.3,59.0],[-111.9,52.8],[-110.9,48.1],[-111.5,48.0]]

/** Parthenon columns: centre x, y, foot and standing top (m above the krepis), from OSM's circles. */
const COLS: [number, number, number, number][] = [[0.26,6.91,1.8,11.4],[1.11,3.22,1.8,11.4],[2.08,-0.94,1.8,11.4],[3.05,-5.1,1.8,11.4],[3.95,7.76,1.8,11.4],[4.04,-9.34,1.8,11.4],[5.0,-13.52,1.8,11.4],[5.97,-17.68,1.8,11.4],[6.34,3.58,2.5,11.8],[6.82,-21.35,1.8,11.4],[7.19,-0.06,2.5,11.8],[8.14,-4.16,2.5,11.8],[8.14,8.71,1.8,11.4],[9.03,-7.98,2.5,11.8],[9.98,-12.08,2.5,11.8],[10.52,-20.51,1.8,11.4],[10.83,-15.71,2.5,11.8],[12.34,9.68,1.8,11.4],[14.71,-19.55,1.8,11.4],[16.53,10.63,1.8,11.4],[18.9,-18.59,1.8,11.4],[20.72,11.6,1.8,11.4],[23.09,-17.62,1.8,11.4],[24.91,12.55,1.8,11.4],[27.28,-16.67,1.8,11.4],[29.1,13.52,1.8,11.4],[31.47,-15.7,1.8,11.4],[33.38,14.5,1.8,11.4],[35.66,-14.75,1.8,11.4],[37.66,15.48,1.8,11.4],[39.95,-13.77,1.8,10.5],[41.84,16.44,1.8,11.4],[44.22,-12.78,1.8,5.5],[46.04,17.4,1.8,11.4],[48.41,-11.83,1.8,4.5],[50.23,18.35,1.8,11.4],[52.61,-10.86,1.8,9.5],[54.42,19.32,1.8,11.4],[56.79,-9.91,1.8,11.4],[58.61,20.27,1.8,11.4],[60.99,-8.94,1.8,11.4],[62.47,16.44,2.5,6.0],[62.81,21.24,1.8,11.4],[63.32,12.8,2.5,8.0],[64.28,8.7,2.5,10.0],[65.17,4.88,2.5,11.8],[65.18,-7.99,1.8,11.4],[66.12,0.78,2.5,11.8],[66.49,22.09,1.8,11.4],[66.97,-2.85,2.5,11.8],[67.35,18.41,1.8,11.4],[68.32,14.24,1.8,11.4],[69.28,10.07,1.8,11.4],[69.37,-7.02,1.8,11.4],[70.27,5.84,1.8,11.4],[71.24,1.67,1.8,11.4],[72.2,-2.5,1.8,11.4],[73.06,-6.17,1.8,11.4]]

/** Old Temple of Athena foundations, relation/12352551's outer way. */
const OLD_TEMPLE: XY[] = [[-3.6,36.8],[30.3,42.0],[28.3,55.3],[-5.6,50.1]]
/** Monument of Agrippa, way/426887028. */
const AGRIPPA: XY[] = [[-121.7,27.9],[-116.0,28.6],[-116.7,33.7],[-122.4,32.9]]

// ---------------------------------------------------------------------------
// Geometry helpers.

const rad = (d: number) => (d * Math.PI) / 180

/** A rotated local frame: u along `deg` (counter-clockwise from east), v to its left. */
function frame(ox: number, oy: number, deg: number) {
  const c = Math.cos(rad(deg)), s = Math.sin(rad(deg))
  return {
    deg,
    at: (u: number, v: number): XY => [ox + u * c - v * s, oy + u * s + v * c],
    local: ([x, y]: XY): XY => [(x - ox) * c + (y - oy) * s, -(x - ox) * s + (y - oy) * c],
  }
}
type Frame = ReturnType<typeof frame>

const area = (r: XY[]) => r.reduce((s, a, i) => { const b = r[(i + 1) % r.length]; return s + a[0] * b[1] - b[0] * a[1] }, 0) / 2
const ccw = (r: XY[]) => (area(r) < 0 ? [...r].reverse() : r)

/** Vertical walls round a counter-clockwise ring, with an optional triangulated top. */
function prism(p: Part, ring: XY[], z0: number, z1: number, top = true) {
  const r = ccw(ring)
  for (let i = 0; i < r.length; i++) {
    const j = (i + 1) % r.length
    p.quad([r[i][0], r[i][1], z0], [r[j][0], r[j][1], z0], [r[j][0], r[j][1], z1], [r[i][0], r[i][1], z1])
  }
  if (top) for (const [a, b, c] of triangulate(r)) p.tri([r[a][0], r[a][1], z1], [r[b][0], r[b][1], z1], [r[c][0], r[c][1], z1])
}

/** A rectangle in a frame, corners cut by `c` (a bevel in plan), counter-clockwise. */
function rectIn(F: Frame, u0: number, u1: number, v0: number, v1: number, c = 0): XY[] {
  const r: [number, number][] = c > 0
    ? [[u0 + c, v0], [u1 - c, v0], [u1, v0 + c], [u1, v1 - c], [u1 - c, v1], [u0 + c, v1], [u0, v1 - c], [u0, v0 + c]]
    : [[u0, v0], [u1, v0], [u1, v1], [u0, v1]]
  return r.map(([u, v]) => F.at(u, v))
}
const box = (p: Part, F: Frame, u0: number, u1: number, v0: number, v1: number, z0: number, z1: number, c = 0, top = true) =>
  prism(p, rectIn(F, u0, u1, v0, v1, c), z0, z1, top)

/** A triangular gable across a frame's v, from `u0` to `u1` deep: base at z0, apex z1 over v = vc. */
function gable(p: Part, F: Frame, u0: number, u1: number, v0: number, v1: number, z0: number, z1: number) {
  const vc = (v0 + v1) / 2
  const A = (u: number, v: number, z: number): V3 => [...F.at(u, v), z]
  for (const [u, out] of [[u0, -1], [u1, 1]] as const) {
    const t: V3[] = [A(u, v0, z0), A(u, v1, z0), A(u, vc, z1)]
    const n = F.at(out, 0), o = F.at(0, 0)
    const d: V3 = [n[0] - o[0], n[1] - o[1], 0]
    const g = [t[1][0] - t[0][0], t[1][1] - t[0][1], 0], h = [t[2][0] - t[0][0], t[2][1] - t[0][1], t[2][2] - t[0][2]]
    const nn = [g[1] * h[2] - g[2] * h[1], g[2] * h[0] - g[0] * h[2]]
    if (nn[0] * d[0] + nn[1] * d[1] >= 0) p.tri(t[0], t[1], t[2]); else p.tri(t[0], t[2], t[1])
  }
  // The two sloping faces.
  orient(p, [A(u0, v0, z0), A(u1, v0, z0), A(u1, vc, z1), A(u0, vc, z1)], [...dirOf(F, 0, -1), 0.2] as V3)
  orient(p, [A(u0, v1, z0), A(u1, v1, z0), A(u1, vc, z1), A(u0, vc, z1)], [...dirOf(F, 0, 1), 0.2] as V3)
}
function dirOf(F: Frame, du: number, dv: number): XY {
  const a = F.at(du, dv), o = F.at(0, 0)
  return [a[0] - o[0], a[1] - o[1]]
}

/** A Doric or Ionic column: tapered shaft and a square capital block, turned to the frame. */
function order(p: Part, F: Frame, x: number, y: number, z0: number, shaftTop: number, r0: number, r1: number, cap: number, capH: number, seg = 12) {
  column(p, x, y, z0, shaftTop, r0, r1, seg)
  if (cap > 0) {
    // The capital: a square block, smooth-shaded so its edges read as the
    // echinus's cushion (and its corners weld, which halves its size).
    const l = F.local([x, y]), h = cap / 2
    const corners = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([a, b]) => {
      const [cx, cy] = F.at(l[0] + a * h, l[1] + b * h), d = dirOf(F, a, b), k = Math.hypot(d[0], d[1])
      return { xy: [cx, cy] as XY, n: [d[0] / k, d[1] / k] as XY }
    })
    for (let i = 0; i < 4; i++) {
      const A = corners[i], B = corners[(i + 1) % 4]
      const a0: V3 = [...A.xy, shaftTop], b0: V3 = [...B.xy, shaftTop], b1: V3 = [...B.xy, shaftTop + capH], a1: V3 = [...A.xy, shaftTop + capH]
      const na0: V3 = [A.n[0], A.n[1], -0.35], nb0: V3 = [B.n[0], B.n[1], -0.35], nb1: V3 = [B.n[0], B.n[1], 0.35], na1: V3 = [A.n[0], A.n[1], 0.35]
      p.tri(a0, b0, b1, undefined, undefined, undefined, [na0, nb0, nb1])
      p.tri(a0, b1, a1, undefined, undefined, undefined, [na0, nb1, na1])
    }
  }
}

/** Douglas-Peucker on a closed ring. */
function simplify(r: XY[], tol: number): XY[] {
  const dp = (pts: XY[]): XY[] => {
    if (pts.length < 3) return pts
    const [a, b] = [pts[0], pts[pts.length - 1]]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1
    let k = 0, dmax = 0
    for (let i = 1; i < pts.length - 1; i++) {
      const d = Math.abs((b[0] - a[0]) * (a[1] - pts[i][1]) - (a[0] - pts[i][0]) * (b[1] - a[1])) / L
      if (d > dmax) { dmax = d; k = i }
    }
    if (dmax <= tol) return [a, b]
    return [...dp(pts.slice(0, k + 1)).slice(0, -1), ...dp(pts.slice(k))]
  }
  // Split at the vertex farthest from the first, so both halves are open chains.
  let far = 0, fd = 0
  r.forEach((p, i) => { const d = Math.hypot(p[0] - r[0][0], p[1] - r[0][1]); if (d > fd) { fd = d; far = i } })
  const a = dp([...r.slice(0, far + 1)]), b = dp([...r.slice(far), r[0]])
  return [...a.slice(0, -1), ...b.slice(0, -1)]
}

/** Half-plane clip (Sutherland-Hodgman): keep the side where f(p) >= 0, f linear. */
function clip(r: XY[], f: (p: XY) => number): XY[] {
  const out: XY[] = []
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length], fa = f(a), fb = f(b)
    if (fa >= 0) out.push(a)
    if ((fa >= 0) !== (fb >= 0)) {
      const t = fa / (fa - fb)
      out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t])
    }
  }
  // Drop repeats.
  return out.filter((p, i) => { const q = out[(i + 1) % out.length]; return Math.hypot(p[0] - q[0], p[1] - q[1]) > 1e-6 })
}

/** Insert the points where a ring crosses f = 0. */
function cut(r: XY[], f: (p: XY) => number): XY[] {
  const out: XY[] = []
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length], fa = f(a), fb = f(b)
    out.push(a)
    if (fa * fb < 0) { const t = fa / (fa - fb); out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]) }
  }
  return out
}

/** Split every edge longer than `max`. */
function densify(r: XY[], max: number): XY[] {
  const out: XY[] = []
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    const n = Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / max)
    for (let k = 0; k < n; k++) out.push([a[0] + ((b[0] - a[0]) * k) / n, a[1] + ((b[1] - a[1]) * k) / n])
  }
  return out
}

// ---------------------------------------------------------------------------

function build() {
  const marble = new Part(), wall = new Part(), rock = new Part(), summit = new Part(), shade = new Part()

  // Frames, from OSM.
  const PAR = frame(36.655, 0.37, 13.0) // Parthenon, centre of the stylobate
  const PRO = frame(-101.65, 21.9, 12.5) // Propylaia, west portico on its axis
  const ERE = frame(13.5, 57.6, 4.1) // Erechtheion, south-west corner of the main block
  const NIK = frame(-115.13, 3.25, -4.7) // Nike, centre of the stylobate

  // ---- The rock, its summit and the walls on its rim.

  // Close the rim across the west: the Pinakotheke and Agrippa terrace, the
  // foot of the ramp up to the Propylaia, round to the Nike bastion's west face.
  const rimRaw: XY[] = [...RIM.slice(5), [-115.4, 47.1], [-123.5, 34.6], PRO.at(-24, 12), PRO.at(-24, -12)]
  let rim = ccw(simplify(rimRaw, 0.5))

  // Summit levels, as zones of the plan, each a planar height: the ramp
  // climbing to the Propylaia between the Nike bastion and the Agrippa
  // terrace; the Propylaia; the Panathenaic way up to the plateau; the
  // plateau, and the lower terrace north of the Erechtheion.
  const U = (p: XY) => PRO.local(p)[0], V = (p: XY) => PRO.local(p)[1]
  const way = (p: XY) => { const k = U(p); return k <= 24 ? W + ((k - 14) / 10) * 1.5 : W + 1.5 + ((k - 24) / 26) * (P - W - 1.5) }
  type Zone = { planes: ((p: XY) => number)[]; z: (p: XY) => number; ramp?: boolean }
  const flat = (h: number) => () => h
  const zones: Zone[] = [
    { planes: [p => -3.4 - U(p), p => V(p) + 12, p => 9.5 - V(p)], z: p => W - 0.35 * (-3.4 - U(p)), ramp: true },
    { planes: [p => -3.4 - U(p), p => -12 - V(p)], z: flat(W) },
    { planes: [p => -3.4 - U(p), p => V(p) - 9.5], z: flat(W) },
    { planes: [p => U(p) + 3.4, p => 14 - U(p)], z: flat(W) },
    { planes: [p => U(p) - 14, p => 50 - U(p)], z: way },
    { planes: [p => U(p) - 50, p => -14 - p[0]], z: flat(P) },
    { planes: [p => U(p) - 50, p => p[0] - 37], z: flat(P) },
    { planes: [p => U(p) - 50, p => p[0] + 14, p => 37 - p[0], p => 66 - p[1]], z: flat(P) },
    { planes: [p => U(p) - 50, p => p[0] + 14, p => 37 - p[0], p => p[1] - 66], z: flat(NORTH_TERRACE) },
  ]
  const zoneAt = (p: XY) => zones.find(Z => Z.planes.every(f => f(p) >= -1e-7)) ?? zones[zones.length - 1]
  for (const Z of zones) for (const f of Z.planes) rim = cut(rim, f)
  rim = densify(rim, 6)
  const insideRim = (q: XY) => {
    let c = false
    for (let i = 0, j = rim.length - 1; i < rim.length; j = i++) {
      const [xi, yi] = rim[i], [xj, yj] = rim[j]
      if ((yi > q[1]) !== (yj > q[1]) && q[0] < ((xj - xi) * (q[1] - yi)) / (yj - yi) + xi) c = !c
    }
    return c
  }

  // Top faces, one planar piece per zone, and the retaining faces where a
  // zone drops below its neighbour (the Nike bastion over the ramp, the
  // terrace north of the Erechtheion).
  for (const Z of zones) {
    const piece = Z.planes.reduce((r, f) => (r.length >= 3 ? clip(r, f) : r), rim)
    if (piece.length < 3) continue
    const r = ccw(piece)
    for (const [a, b, c] of triangulate(r)) summit.tri([...r[a], Z.z(r[a])] as V3, [...r[b], Z.z(r[b])] as V3, [...r[c], Z.z(r[c])] as V3)
    for (let i = 0; i < r.length; i++) {
      const a = r[i], b = r[(i + 1) % r.length]
      const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1, no: XY = [(b[1] - a[1]) / l, -(b[0] - a[0]) / l]
      const q: XY = [(a[0] + b[0]) / 2 + no[0] * 0.05, (a[1] + b[1]) / 2 + no[1] * 0.05]
      if (!insideRim(q)) continue
      const N = zoneAt(q)
      if (N === Z) continue
      const za = Z.z(a), zb = Z.z(b), na = N.z(a), nb = N.z(b)
      if (na < za + 0.05 && nb < zb + 0.05) continue
      orient(wall, [[a[0], a[1], za], [b[0], b[1], zb], [b[0], b[1], Math.max(na, zb)], [a[0], a[1], Math.max(na, za)]], [-no[0], -no[1], 0])
    }
  }

  // Wall band and cliff round the rim.
  const n = rim.length
  const edgeN = rim.map((a, i) => { const b = rim[(i + 1) % n], l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1; return [(b[1] - a[1]) / l, -(b[0] - a[0]) / l, l] })
  const edgeZone = rim.map((a, i) => {
    const b = rim[(i + 1) % n]
    return zoneAt([(a[0] + b[0]) / 2 - edgeN[i][0] * 0.05, (a[1] + b[1]) / 2 - edgeN[i][1] * 0.05])
  })
  const wallH = (p: XY, i: number): number => {
    const [x, y] = p
    if (edgeZone[i].ramp || edgeZone[(i - 1 + n) % n].ramp) return 2.5 // foot of the ramp
    if (x < -99 && y < 11) return 9 // Nike bastion
    if (x < -105) return 8 // Pinakotheke and Agrippa terrace
    if (y < 0 && x < 150) return 14 // Kimonian wall
    return 10
  }
  const spread = (p: XY): number => (p[0] < -99 ? 18 : p[1] < 0 ? 14 : 12)
  // Outward normals, smoothed along the rim so the cliff's foot doesn't fold.
  const cum: number[] = [0]
  for (let i = 1; i <= n; i++) cum.push(cum[i - 1] + Math.hypot(rim[i % n][0] - rim[i - 1][0], rim[i % n][1] - rim[i - 1][1]))
  const total = cum[n]
  const foot: XY[] = rim.map((p, i) => {
    let nx = 0, ny = 0
    for (let j = 0; j < n; j++) {
      let d = Math.abs((cum[j] + edgeN[j][2] / 2) - cum[i]); d = Math.min(d, total - d)
      const w = Math.max(0, 1 - d / 30) * edgeN[j][2]
      nx += edgeN[j][0] * w; ny += edgeN[j][1] * w
    }
    const l = Math.hypot(nx, ny) || 1, s = spread(p)
    return [p[0] + (nx / l) * s, p[1] + (ny / l) * s]
  })
  const shoulder = rim.map((p, i) => Math.min(edgeZone[i].z(p), edgeZone[(i - 1 + n) % n].z(p)) - wallH(p, i))
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n, Z = edgeZone[i]
    const a = rim[i], b = rim[j]
    orient(wall, [[a[0], a[1], shoulder[i]], [b[0], b[1], shoulder[j]], [b[0], b[1], Z.z(b)], [a[0], a[1], Z.z(a)]], [edgeN[i][0], edgeN[i][1], 0])
    const fa = foot[i], fb = foot[j]
    orient(rock, [[fa[0], fa[1], 0], [fb[0], fb[1], 0], [b[0], b[1], shoulder[j]], [a[0], a[1], shoulder[i]]], [edgeN[i][0], edgeN[i][1], 0.5])
  }

  // ---- Parthenon. Krepis at P; heights above it from OSM's parts.

  const pz = (h: number) => P + h
  // Euthynteria and three steps, to the stylobate (69.8 x 30.8 m).
  box(marble, PAR, -36.5, 36.5, -17.0, 17.0, pz(-1.5), pz(0.6), 0.3)
  box(marble, PAR, -35.7, 35.7, -16.2, 16.2, pz(0.6), pz(1.2), 0.3)
  box(marble, PAR, -34.9, 34.9, -15.4, 15.4, pz(1.2), pz(1.8), 0.3)
  // The cella floor, a step up inside the colonnade.
  box(marble, PAR, -31.0, 31.0, -11.6, 11.6, pz(1.8), pz(2.5), 0.2)
  // Columns: the peristyle (Doric, 1.9 m at the foot), the inner prostyles.
  for (const [x, y, z0, z1] of COLS) {
    const inner = z0 > 2
    const full = z1 >= (inner ? 11.8 : 11.4)
    const r0 = inner ? 0.82 : 0.95, r1 = inner ? 0.66 : 0.76
    const rTop = full ? r1 : r0 + (r1 - r0) * ((z1 - z0) / ((inner ? 11.8 : 11.4) - z0))
    column(marble, x, y, pz(z0), pz(z1), r0, rTop, inner ? 10 : 12, !full)
    if (full) order(marble, PAR, x, y, pz(z1), pz(z1), 0, 0, inner ? 1.7 : 2.05, inner ? 0.72 : 0.84)
  }
  // Peristyle entablature (architrave and frieze, 12.24-14.96) and cornice
  // (to 15.34): long beams on the flanks, the south one broken between the
  // fallen columns, end beams between them.
  const EO = [34.9, 15.45], EI = [33.0, 13.55], CO = [35.5, 16.05]
  const flank = (s: number, segs: [number, number][]) => {
    for (const [a, b] of segs) {
      const v0 = s < 0 ? -EO[1] : EI[1], v1 = s < 0 ? -EI[1] : EO[1]
      box(marble, PAR, a, b, v0, v1, pz(12.24), pz(14.96))
      orient(marble, rectIn(PAR, a, b, v0, v1).map(([p, q]) => [p, q, pz(12.24)] as V3), [0, 0, -1])
      const c0 = a <= -EO[0] + 0.01 ? -CO[0] : a, c1 = b >= EO[0] - 0.01 ? CO[0] : b
      box(marble, PAR, c0, c1, s < 0 ? -CO[1] : EI[1], s < 0 ? -EI[1] : CO[1], pz(14.96), pz(15.34))
      orient(marble, rectIn(PAR, c0, c1, s < 0 ? -CO[1] : EO[1], s < 0 ? -EO[1] : CO[1]).map(([p, q]) => [p, q, pz(14.96)] as V3), [0, 0, -1])
    }
  }
  flank(1, [[-EO[0], EO[0]]])
  flank(-1, [[-EO[0], -4.4], [17.3, EO[0]]])
  for (const s of [-1, 1]) {
    const u0 = s < 0 ? -EO[0] : EI[0], u1 = s < 0 ? -EI[0] : EO[0]
    box(marble, PAR, u0, u1, -EI[1], EI[1], pz(12.24), pz(14.96))
    orient(marble, rectIn(PAR, u0, u1, -EI[1], EI[1]).map(([p, q]) => [p, q, pz(12.24)] as V3), [0, 0, -1])
    const c0 = s < 0 ? -CO[0] : EI[0], c1 = s < 0 ? -EI[0] : CO[0]
    box(marble, PAR, c0, c1, -EI[1], EI[1], pz(14.96), pz(15.34))
    orient(marble, rectIn(PAR, s < 0 ? -CO[0] : EO[0], s < 0 ? -EO[0] : CO[0], -EI[1], EI[1]).map(([p, q]) => [p, q, pz(14.96)] as V3), [0, 0, -1])
  }
  // West pediment, its tympanum standing (OSM, gabled to 19.96; the raking
  // cornice drawn at the Doric pitch, apex 19.3).
  gable(marble, PAR, -35.2, -33.9, -16.05, 16.05, pz(15.34), pz(19.3))
  // East pediment: only the two corner fragments of the raking cornice.
  for (const [v0, v1, h] of [[-16.05, -9.0, 17.9], [10.6, 16.05, 17.4]] as const) {
    const lowAt = v0 < 0 ? v0 : v1, highAt = v0 < 0 ? v1 : v0
    const A = (uu: number, v: number, z: number): V3 => [...PAR.at(uu, v), z]
    const zl = pz(15.6), zh = pz(h)
    const u0 = 33.9, u1 = 35.2
    // A wedge: vertical inner end at highAt, sloping top down to the corner.
    const q = (uu: number) => [A(uu, lowAt, pz(15.34)), A(uu, highAt, pz(15.34)), A(uu, highAt, zh), A(uu, lowAt, zl)]
    orient(marble, q(u1), [...dirOf(PAR, 1, 0), 0] as V3)
    orient(marble, q(u0), [...dirOf(PAR, -1, 0), 0] as V3)
    orient(marble, [A(u0, lowAt, zl), A(u1, lowAt, zl), A(u1, highAt, zh), A(u0, highAt, zh)], [0, 0, 1])
    orient(marble, [A(u0, highAt, pz(15.34)), A(u1, highAt, pz(15.34)), A(u1, highAt, zh), A(u0, highAt, zh)], [...dirOf(PAR, 0, highAt > lowAt ? 1 : -1), 0] as V3)
    orient(marble, [A(u0, lowAt, pz(15.34)), A(u1, lowAt, pz(15.34)), A(u1, lowAt, zl), A(u0, lowAt, zl)], [...dirOf(PAR, 0, highAt > lowAt ? -1 : 1), 0] as V3)
  }
  // Inner west porch: entablature over its six columns.
  box(marble, PAR, -29.6, -27.9, -11.6, 11.6, pz(12.52), pz(14.95))
  orient(marble, rectIn(PAR, -29.6, -27.9, -11.6, 11.6).map(([p, q]) => [p, q, pz(12.52)] as V3), [0, 0, -1])
  // West cella wall with its great door, and the lintel band over it.
  box(marble, PAR, -24.4, -21.8, -10.7, -2.45, pz(2.5), pz(12.54), 0, false)
  box(marble, PAR, -24.4, -21.8, 2.5, 10.7, pz(2.5), pz(12.54), 0, false)
  box(marble, PAR, -24.4, -21.8, -10.7, 10.7, pz(12.54), pz(14.95))
  orient(marble, rectIn(PAR, -24.4, -21.8, -2.45, 2.5).map(([p, q]) => [p, q, pz(12.54)] as V3), [0, 0, -1])
  // The cella's long walls: stepped ends east of the west wall, then low.
  for (const s of [-1, 1]) {
    const v0 = s < 0 ? -10.7 : 9.6, v1 = s < 0 ? -9.6 : 10.7
    const steps = [12.0, 9.9, 7.8, 5.7]
    steps.forEach((h, k) => box(marble, PAR, -21.8 + k * 1.3, -21.8 + (k + 1) * 1.3, v0, v1, pz(2.5), pz(h)))
    box(marble, PAR, -16.6, s < 0 ? -2.5 : 25.9, v0, v1, pz(2.5), pz(3.6))
  }
  // East cella wall stump.
  box(marble, PAR, 18.5, 28.0, -10.7, -9.4, pz(2.5), pz(3.6))
  box(marble, PAR, 26.6, 28.0, -9.4, 6.0, pz(2.5), pz(3.6))

  // Old Temple of Athena: its foundation course.
  prism(wall, OLD_TEMPLE, P - 0.3, P + 0.4)

  // ---- Erechtheion. East porch floor at P, the north porch 3 m lower.

  const E = P
  // Main block (23.3 x 12.6 m with its east porch), a shell with a sunk top.
  {
    const o = rectIn(ERE, 0, 20.6, 0.4, 13.0)
    prism(marble, o, NORTH_TERRACE - 0.4, E + 7.8, false)
    const i = rectIn(ERE, 0.9, 19.7, 1.3, 12.1)
    // Coping between the outer ring and the inner, then the inner faces down to the sunk top.
    for (let k = 0; k < 4; k++) {
      const l = (k + 1) % 4
      marble.quad([o[k][0], o[k][1], E + 7.8], [o[l][0], o[l][1], E + 7.8], [i[l][0], i[l][1], E + 7.8], [i[k][0], i[k][1], E + 7.8])
      orient(marble, [[i[k][0], i[k][1], E + 6.4], [i[l][0], i[l][1], E + 6.4], [i[l][0], i[l][1], E + 7.8], [i[k][0], i[k][1], E + 7.8]],
        [-(i[l][1] - i[k][1]), i[l][0] - i[k][0], 0])
    }
    for (const [a, b, c] of triangulate(i)) marble.tri([i[a][0], i[a][1], E + 6.4], [i[b][0], i[b][1], E + 6.4], [i[c][0], i[c][1], E + 6.4])
  }
  // East porch: platform and six Ionic columns, entablature (no pediment).
  box(marble, ERE, 20.6, 23.3, 0.4, 13.0, NORTH_TERRACE - 0.4, E, 0.2)
  for (let k = 0; k < 6; k++) order(marble, ERE, ...ERE.at(22.5, 1.3 + k * 2.2), E, E + 6.0, 0.36, 0.3, 0.9, 0.58, 8)
  box(marble, ERE, 21.6, 23.3, 0.4, 13.0, E + 6.58, E + 8.4)
  orient(marble, rectIn(ERE, 21.6, 23.3, 0.4, 13.0).map(([p, q]) => [p, q, E + 6.58] as V3), [0, 0, -1])
  // North porch: four columns on the front and one on each side, a gabled
  // roof with its pediment to the north.
  const NP = NORTH_TERRACE + 0.4
  box(marble, ERE, -4.15, 8.8, 13.0, 20.4, NORTH_TERRACE - 0.4, NP, 0.2)
  for (const [uu, vv] of [[-3.4, 19.6], [0.3, 19.6], [4.1, 19.6], [8.0, 19.6], [-3.4, 16.3], [8.0, 16.3]] as XY[]) {
    order(marble, ERE, ...ERE.at(uu, vv), NP, NP + 6.95, 0.42, 0.35, 1.05, 0.68, 8)
  }
  box(marble, ERE, -4.15, 8.8, 13.0, 20.4, NP + 7.63, NP + 9.5, 0.15)
  orient(marble, rectIn(ERE, -4.15, 8.8, 13.0, 20.4).map(([p, q]) => [p, q, NP + 7.63] as V3), [0, 0, -1])
  {
    // Gable: ridge along v (north-south), pediment on the north face.
    const G = frame(...ERE.at(2.33, 13.0), 4.1 + 90)
    gable(marble, G, 0, 7.4, -6.6, 6.6, NP + 9.5, NP + 11.2)
  }
  // Caryatid porch: parapet, six maidens, the roof slab.
  box(marble, ERE, -0.33, 6.8, -3.6, 0.4, E - 0.4, E + 1.8, 0.15)
  for (const [uu, vv] of [[0.45, -3.0], [2.3, -3.0], [4.15, -3.0], [6.0, -3.0], [0.45, -1.2], [6.0, -1.2]] as XY[]) {
    const [x, y] = ERE.at(uu, vv)
    lathe(marble, x, y, [[0.34, E + 1.8], [0.3, E + 3.0], [0.13, E + 3.7], [0.16, E + 3.95], [0.26, E + 4.11]], 6)
  }
  box(marble, ERE, -0.33, 6.8, -3.6, 0.4, E + 4.11, E + 5.0, 0.15)
  orient(marble, rectIn(ERE, -0.33, 6.8, -3.6, 0.4).map(([p, q]) => [p, q, E + 4.11] as V3), [0, 0, -1])

  // ---- Propylaia. West portico at W, the east portico 1.5 m higher.

  // Platform and west steps.
  box(marble, PRO, -3.4, 15.9, -10.6, 10.6, W - 2.5, W, 0.2)
  for (let k = 1; k <= 3; k++) box(marble, PRO, -3.4 + k * 0.7, 15.9, -10.6, 10.6, W - 2.5 + k * 0.6, W - 2.5 + (k + 1) * 0.6 > W ? W : W - 2.5 + (k + 1) * 0.6, 0, true)
  box(marble, PRO, 15.9, 23.6, -10.6, 10.6, W - 1, W + 1.5, 0.2)
  // West and east porticoes: six Doric columns each, the middle bay wider.
  const vs = [-9.6, -6.25, -2.87, 2.87, 6.25, 9.6]
  for (const v of vs) order(marble, PRO, ...PRO.at(0, v), W, W + 8.2, 0.78, 0.62, 1.7, 0.6, 10)
  for (const v of vs) order(marble, PRO, ...PRO.at(22.6, v), W + 1.5, W + 1.5 + 7.9, 0.76, 0.6, 1.65, 0.6, 10)
  for (const [u0, z] of [[0, W + 8.8], [22.6, W + 1.5 + 8.5]] as [number, number][]) {
    box(marble, PRO, u0 - 0.95, u0 + 0.95, -10.6, 10.6, z, z + 2.1)
    orient(marble, rectIn(PRO, u0 - 0.95, u0 + 0.95, -10.6, 10.6).map(([p, q]) => [p, q, z] as V3), [0, 0, -1])
    box(marble, PRO, u0 - 1.2, u0 + 1.2, -10.85, 10.85, z + 2.1, z + 2.6)
    orient(marble, rectIn(PRO, u0 - 1.2, u0 + 1.2, -10.85, 10.85).map(([p, q]) => [p, q, z + 2.1] as V3), [0, 0, -1])
  }
  // The hall's side walls, the Ionic columns either side of the passage.
  for (const s of [-1, 1]) {
    box(marble, PRO, 1.0, 21.6, s < 0 ? -10.4 : 8.95, s < 0 ? -8.95 : 10.4, W, W + 10.9, 0.15)
  }
  for (const uu of [3.8, 7.6, 11.4]) for (const v of [-2.65, 2.65]) order(marble, PRO, ...PRO.at(uu, v), W, W + 9.8, 0.52, 0.43, 1.2, 0.5, 8)
  // The gate wall and its five doorways (1.4, 2.7, 4.2, 2.7, 1.4 m wide).
  {
    const doors: [number, number, number][] = [[-7.6, -6.2, 3.3], [-5.2, -2.5, 5.6], [-2.1, 2.1, 7.4], [2.5, 5.2, 5.6], [6.2, 7.6, 3.3]]
    const z0 = W + 1.5, z1 = W + 11.2
    let v = -8.95
    for (const [a, b, h] of doors) {
      box(marble, PRO, 14.4, 15.9, v, a, z0, z1, 0, false)
      box(marble, PRO, 14.4, 15.9, a, b, z0 + h, z1, 0, false)
      orient(marble, rectIn(PRO, 14.4, 15.9, a, b).map(([p, q]) => [p, q, z0 + h] as V3), [0, 0, -1])
      // Doorway reveal, in shadow.
      shadeDoor(shade, PRO, 15.9, a, b, z0, z0 + h)
      v = b
    }
    box(marble, PRO, 14.4, 15.9, v, 8.95, z0, z1, 0, false)
    // Top of the gate wall.
    orient(marble, rectIn(PRO, 14.4, 15.9, -8.95, 8.95).map(([p, q]) => [p, q, z1] as V3), [0, 0, 1])
  }
  // Pinakotheke (north-west wing): the picture room and its porch of three
  // columns facing the ramp.
  box(marble, PRO, -8.0, 4.4, 17.0, 27.5, W - 2.0, W + 12.5, 0.25)
  for (const s of [-8.0, 3.2]) box(marble, PRO, s, s + 1.2, 12.0, 17.0, W - 2.0, W + 9.6, 0, true)
  for (const uu of [-4.4, -1.6, 1.0]) order(marble, PRO, ...PRO.at(uu, 12.6), W, W + 5.4, 0.55, 0.45, 1.25, 0.45, 8)
  box(marble, PRO, -8.0, 4.4, 12.0, 17.0, W + 5.85, W + 7.6)
  orient(marble, rectIn(PRO, -8.0, 4.4, 12.0, 17.0).map(([p, q]) => [p, q, W + 5.85] as V3), [0, 0, -1])
  box(marble, PRO, -8.0, 4.4, 12.0, 27.5, W - 2.0, W, 0.25, true)
  // South wing: a smaller hall with its porch to the passage.
  box(marble, PRO, -5.6, 4.3, -18.9, -14.0, W - 2.0, W + 7.2, 0.25)
  for (const uu of [-2.8, 0.2]) order(marble, PRO, ...PRO.at(uu, -12.6), W, W + 5.4, 0.55, 0.45, 1.25, 0.45, 8)
  box(marble, PRO, -5.6, 4.3, -14.0, -12.0, W + 5.85, W + 7.2)
  orient(marble, rectIn(PRO, -5.6, 4.3, -14.0, -12.0).map(([p, q]) => [p, q, W + 5.85] as V3), [0, 0, -1])
  box(marble, PRO, 3.1, 4.3, -14.0, -12.0, W, W + 5.85, 0, false)

  // ---- Temple of Athena Nike on its bastion (bastion top at W).

  box(marble, NIK, -4.6, 4.6, -3.2, 3.2, W - 0.2, W + 0.3, 0.15)
  box(marble, NIK, -4.15, 4.15, -2.82, 2.82, W + 0.3, W + 0.8, 0.1)
  for (const uu of [-3.75, 3.75]) for (const v of [-2.25, -0.75, 0.75, 2.25]) order(marble, NIK, ...NIK.at(uu, v), W + 0.8, W + 4.55, 0.27, 0.23, 0.62, 0.32, 8)
  box(marble, NIK, -2.4, 2.4, -2.3, 2.3, W + 0.8, W + 4.87, 0, false)
  box(marble, NIK, -4.15, 4.15, -2.82, 2.82, W + 4.87, W + 6.3, 0.1)
  orient(marble, rectIn(NIK, -4.15, 4.15, -2.82, 2.82).map(([p, q]) => [p, q, W + 4.87] as V3), [0, 0, -1])
  gable(marble, NIK, 3.4, 4.15, -2.82, 2.82, W + 6.3, W + 7.25)

  // ---- Monument of Agrippa: stepped base and the tall pedestal.

  prism(marble, AGRIPPA, W - 4, W + 2.4)
  {
    const A = frame(-119.2, 30.8, 8)
    box(marble, A, -1.9, 1.9, -1.65, 1.65, W + 2.4, W + 12.2, 0.15)
    box(marble, A, -2.15, 2.15, -1.9, 1.9, W + 12.2, W + 12.9, 0.15)
  }

  // At night the monuments are floodlit gold from below, the walls less, the
  // rock least and fading toward its foot; faces looking up take least.
  const lit = (k: number) => (p: V3, n: V3) => (n[2] > 0.8 ? 0.45 : 1) * k
  const rockLit = (p: V3, n: V3) => (n[2] > 0.8 ? 0.15 : 0.35) * Math.max(0, Math.min(1, p[2] / P))
  return [
    // Colours from the daylight photos, pulled to the palette's lightness:
    // the honey Pentelic marble; the golden limestone of the walls; the
    // grey limestone of the rock and summit; the shadow in the doorways.
    { part: marble, material: { ...finish('pentelic-marble', 0xf1e1c1), floodlight: lit(1) } },
    { part: wall, material: { ...finish('acropolis-wall', 0xd6b98b), floodlight: lit(0.75) } },
    { part: rock, material: { ...finish('acropolis-rock', 0xb3a896), floodlight: rockLit } },
    { part: summit, material: { ...finish('acropolis-summit', 0xc8c0b2), floodlight: (_p: V3, n: V3) => (n[2] > 0.8 ? 0.05 : 0.2) } },
    { part: shade, material: finish('doorway-shadow', 0x8a8170) },
  ]
}

/** The shaded reveal of a doorway in a wall face at u, between v = a and b. */
function shadeDoor(p: Part, F: Frame, uFace: number, a: number, b: number, z0: number, z1: number) {
  const A = (v: number, z: number): V3 => [...F.at(uFace - 0.75, v), z]
  orient(p, [A(a, z0), A(b, z0), A(b, z1), A(a, z1)], [...dirOf(F, 1, 0), 0] as V3)
}

if (import.meta.main) {
  const parts = build().filter(x => x.part.triangles > 0)
  const triangles = parts.reduce((s, x) => s + x.part.triangles, 0)
  if (triangles > 8000) throw new Error(`Triangle budget exceeded: ${triangles}`)
  const glb = writeGlb('Acropolis of Athens', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
    anchor: [23.7262, 37.9715], bearing: 0, osm: 'way/910010406',
  })
  if (glb.length > 250_000) throw new Error(`File budget exceeded: ${glb.length}`)
  const out = process.argv[2] ?? new URL('../models/athens-acropolis.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
  for (const { part, material } of parts) console.log(`  ${material.name}: ${part.triangles}`)
}
