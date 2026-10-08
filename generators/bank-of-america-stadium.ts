/**
 * Bank of America Stadium, Charlotte (Carolina Panthers, Charlotte FC) —
 * procedural, CC0-1.0, no textures.  bun generators/bank-of-america-stadium.ts
 *
 * Map frame: x across the field, y along it, z up, metres. Placed at bearing
 * 320°, the field's long axis (OSM pitch way/187011790), so +y points up the
 * field to the north-west end and +x to the north-east sideline. The anchor
 * is the area centroid of the stadium outline (way/180768146, the outer ring
 * of building=stadium relation/12346952). z = 0 is the lowest ground under
 * the outline, at the north-west end; the field is about 1 m above it, the
 * streets along both sidelines and the south-east end about 6–7 m, so the
 * facade there starts higher (the `GROUND` table).
 *
 * What makes it read as itself, from the photos: a grey concrete fortress
 * ringed by a white arcade of round arches, with the grey back of the upper
 * deck above it; two big decks of
 * Panthers-blue seats with the black suite fascia between them and silver
 * club seats at the back of the lower bowl; the six black stair towers with
 * their pale green glass light domes; the two end video boards under their arched
 * black trusses (their backs show the pale Bank of America sign to the
 * street); the four corner lamp bars on white beams; the silver vaulted
 * canopies over the podium on the south-east half; and black piers on the
 * podium facade.
 *
 * The bowl is lofted on rounded rectangles (superellipses) fitted to the OSM
 * building:part rings and checked against lidar, centred on the field 8 m up
 * the y axis from the anchor, so the bowl is exactly symmetrical:
 *   R0 the field wall (inner ring of relation/12346952),
 *   R1 the 7 m ring (relation/17145756), where the silver club seats begin,
 *   RL the upper deck's front and the suite fascia under it (lidar),
 *   R3 the 43 m upper-deck ring (relation/17917766), the rim.
 * Outside R3 the podium follows the real outline, mirrored across the field's
 * axis, at the heights of the OSM perimeter parts (24–32 m).
 *
 * Evidence
 * - Measured, lidar: USGS 3DEP NC Phase 4 Mecklenburg 2016, 1 m, sampled in
 *   this frame along rays from the bowl centre every 6°, all four quadrants
 *   (they agree within a metre). Field 1–2 m; lower bowl from 3 m at the wall
 *   to 13 m at its back; upper-deck front 25 m all round, at RL (73 m out on
 *   the sidelines, 91 m at the ends, 95 m at 48°); rim 46 m along the
 *   sidelines and round the corners to about 50°, 42–43 m at 60–66°, 36 m
 *   behind the end zones (`RIM`); video-board tops 59–61 m, 78 m wide, about
 *   117 m from the bowl centre; lamp bars 52–54 m, between (80, 82) and
 *   (92, 50) in this frame and mirrored; cupola tops 38–39 m; the sideline
 *   canopies' crowns 30–31 m.
 * - Measured, USGS NAIP orthophoto: plan of the towers (sideline pairs at
 *   x ±114, y = 8 ± 23.5; the south-east pair at x ±23, y −124), the four
 *   silver canopies (sidelines at x ±116, y −30 to −76; south-east end at
 *   x ±42 to ±80), seat colour seen from above.
 * - OSM: outline way/180768146 and the building:parts (heights 24–58 m).
 * - Published (Wikipedia): opened 1996; Populous (HOK Sport) with Wagner
 *   Murray; "arches that connect column supports on the upper deck"; six
 *   light domes over the main entrances; team colours black, process blue and
 *   silver; video boards 200 × 56 ft (61 × 17 m) since 2014. The renovation
 *   approved in 2025 starts in 2026 and has changed nothing yet, so the model
 *   shows the stadium as it stands.
 * - Photos (Wikimedia Commons):
 *   Quintin Soloviev, "Bank of America Stadium in 2025" (CC BY 4.0, inside,
 *   from the north-west end) and "Aerial view of Bank of America Stadium in
 *   Charlotte" (CC BY 4.0, from the south-east over the main gate);
 *   Carlos.dkfi, "Bank of america stadium 2023" (CC0, from the south-west,
 *   the arcade and podium); Ken Lund, "Bank of America Stadium, Charlotte,
 *   North Carolina" (47490942382, 47543695591; CC BY-SA 2.0, street level);
 *   City Dweller 2, "Bank of America Stadium Skyline View February 2024"
 *   (CC BY-SA 4.0); HangingCurve, "BofACLTFCConfig" (CC BY-SA 4.0) and
 *   "BofAStadium2015" (CC BY-SA 4.0); B. J. Gardner, "2021 Duke's Mayo Bowl
 *   stadium skyline" (CC0, lamp bar).
 *
 * Estimated: the arcade's proportions and the podium's window groups (from
 * the photos), the canopies' cross-section (5 m rise), the video boards'
 * bottom (a third of their width down from the top, as photographed), and
 * where the silver club seats stop at the ends. The pitch is the map's
 * (STYLE.md, "Don't model the ground").
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

type XY = [number, number]

const seats = new Part(), precast = new Part(), silver = new Part(), win = new Part()
const charcoal = new Part(), cupola = new Part()

const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const unit = (a: V3): V3 => mul(a, 1 / (Math.hypot(...a) || 1))
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v))

/** A quad, wound to face `hint`; per-corner normals if given, else flat. */
function quad(p: Part, P: V3[], hint: V3, ns?: V3[]) {
  const face = cross(sub(P[1], P[0]), sub(P[2], P[0]))
  const ord = dot(face, hint) >= 0 ? [0, 1, 2, 3] : [0, 3, 2, 1]
  const n = ns?.map(unit)
  const t = (a: number, b: number, c: number) => {
    const A = P[ord[a]], B = P[ord[b]], C = P[ord[c]]
    if (Math.hypot(...cross(sub(B, A), sub(C, A))) < 1e-9) return
    p.tri(A, B, C, undefined, undefined, undefined, n && [n[ord[a]], n[ord[b]], n[ord[c]]])
  }
  t(0, 1, 2)
  t(0, 2, 3)
}

/** An oriented box: centre, unit axes, half extents. `open` skips faces by index (0..5 = +a,-a,+b,-b,+c,-c). */
function box(p: Part, c: V3, ax: [V3, V3, V3], h: [number, number, number], open: number[] = []) {
  const P = (a: number, b: number, d: number) => add(add(add(c, mul(ax[0], a * h[0])), mul(ax[1], b * h[1])), mul(ax[2], d * h[2]))
  const faces: [number, number][] = [[0, 1], [0, -1], [1, 1], [1, -1], [2, 1], [2, -1]]
  faces.forEach(([i, sgn], f) => {
    if (open.includes(f)) return
    const o = [0, 1, 2].filter(x => x !== i)
    const corner = (a: number, b: number) => {
      const v = [0, 0, 0]
      v[i] = sgn; v[o[0]] = a; v[o[1]] = b
      return P(v[0], v[1], v[2])
    }
    quad(p, [corner(-1, -1), corner(1, -1), corner(1, 1), corner(-1, 1)], mul(ax[i], sgn))
  })
}

// ---------------------------------------------------------------------------
// Bowl rings: half width a, half length b, exponent n, centred on (0, C).

const N = 64 // samples round every ring, uniform along R3's perimeter
const C = 8
type SE = { a: number; b: number; n: number }
const R0: SE = { a: 42, b: 60.8, n: 6.7 }
const R1: SE = { a: 61.8, b: 80, n: 4.9 }
const RL: SE = { a: 73.5, b: 91.5, n: 3.6 }
const R3: SE = { a: 105.9, b: 112.7, n: 3.8 }

/** Ray directions from the bowl centre, evenly spaced along R3. */
const dirs: XY[] = (() => {
  const pts: XY[] = [], M = 4000
  const sp = (v: number, e: number) => Math.sign(v) * Math.pow(Math.abs(v), e)
  for (let i = 0; i <= M; i++) {
    const t = (i / M) * 2 * Math.PI
    pts.push([R3.a * sp(Math.cos(t), 2 / R3.n), R3.b * sp(Math.sin(t), 2 / R3.n)])
  }
  const cum = [0]
  for (let i = 1; i <= M; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]))
  const out: XY[] = []
  let j = 0
  for (let k = 0; k < N; k++) {
    const s = (k / N) * cum[M]
    while (cum[j + 1] < s) j++
    const f = (s - cum[j]) / (cum[j + 1] - cum[j] || 1)
    const x = pts[j][0] + (pts[j + 1][0] - pts[j][0]) * f, y = pts[j][1] + (pts[j + 1][1] - pts[j][1]) * f
    const l = Math.hypot(x, y)
    out.push([x / l, y / l])
  }
  return out
})()

const radius = (se: SE, k: number, off = 0) => {
  const [dx, dy] = dirs[k % N]
  return 1 / Math.pow(Math.pow(Math.abs(dx) / (se.a + off), se.n) + Math.pow(Math.abs(dy) / (se.b + off), se.n), 1 / se.n)
}
const at = (k: number, r: number, z: number): V3 => [dirs[k % N][0] * r, C + dirs[k % N][1] * r, z]
const ringPt = (se: SE, k: number, z: number, off = 0) => at(k, radius(se, k, off), z)
/** Mirror across the field's long axis (x → -x). */
const mirrorV = (k: number) => (N / 2 - k + N) % N
const mirrorS = (k: number) => (N / 2 - k - 1 + N) % N

/** Angle of a direction folded into the first quadrant, degrees from the sideline axis. */
const fold = ([dx, dy]: XY) => (Math.atan2(Math.abs(dy), Math.abs(dx)) * 180) / Math.PI
const table = (t: [number, number][], v: number) => {
  for (let i = 1; i < t.length; i++)
    if (v <= t[i][0]) return t[i - 1][1] + ((t[i][1] - t[i - 1][1]) * (v - t[i - 1][0])) / (t[i][0] - t[i - 1][0])
  return t[t.length - 1][1]
}

// Rim height by angle, from the lidar (see header).
const RIM: [number, number][] = [[0, 46], [48, 46], [54, 45], [60, 43], [66, 42], [72, 37], [78, 36], [90, 36]]
const rim = (k: number) => table(RIM, fold(dirs[k % N]))

// Street level just outside the outline, by angle round the bowl centre
// (lidar ground returns), averaged with its mirror image across the field's
// axis so the facade stays symmetrical.
const GROUND_RAW = [6.6, 6.5, 4.7, 1.1, 1.1, 1.3, 1.4, 1.3, 1.3, 1.1, 3.5, 6.3, 6.7, 6.3, 5.2, 5.8, 6.2, 6.6, 6.7, 6.8, 6.8, 6.9, 6.6, 7.0]
const groundRaw = (deg: number) => {
  const d = ((deg % 360) + 360) % 360, i = Math.floor(d / 15), f = d / 15 - i
  return GROUND_RAW[i % 24] * (1 - f) + GROUND_RAW[(i + 1) % 24] * f
}
const ground = ([dx, dy]: XY) => {
  const deg = (Math.atan2(dy, dx) * 180) / Math.PI
  return (groundRaw(deg) + groundRaw(180 - deg)) / 2
}

/**
 * A band between two rings, smooth-shaded round the bowl. `face` is +1 for a
 * band facing out, -1 for one facing in towards the field, 'up' for a flat
 * ring. `pick` chooses the part per segment.
 */
function band(pick: Part | ((k: number) => Part), lo: (k: number) => V3, hi: (k: number) => V3, face: 1 | -1 | 'up') {
  const faceN = (k: number): V3 => {
    const a = lo(k), b = lo(k + 1), c = hi(k)
    let n = unit(cross(sub(b, a), sub(c, a)))
    const out: V3 = [dirs[k % N][0], dirs[k % N][1], 0]
    const want = face === 'up' ? [0, 0, 1] as V3 : mul(out, face)
    if (dot(n, want) < 0) n = mul(n, -1)
    return n
  }
  const fn = Array.from({ length: N }, (_, k) => faceN(k))
  const vn = (k: number) => unit(add(fn[(k - 1 + N) % N], fn[k % N]))
  for (let k = 0; k < N; k++) {
    const P = [lo(k), lo(k + 1), hi(k + 1), hi(k)]
    const n = vn(k), m = vn(k + 1)
    quad(typeof pick === 'function' ? pick(k) : pick, P, fn[k], [n, m, m, n])
  }
}

// ---------------------------------------------------------------------------
// The bowl, from the field outwards. Lower bowl 3 → 13 m, a 1.5 m walkway at
// its back, the black suite fascia up to the upper deck's front at 25 m with
// a pale lip, the upper deck rising to the rim, and the parapet. The rake
// is one plane per deck, so the tier step reads as a step.

const FIELD = 1.2, WALL = 3, BACK = 13, LIP = 25, WALK = 1.5
const zLower = (k: number, r: number) => {
  const r0 = radius(R0, k), r1 = radius(RL, k, -WALK)
  return WALL + ((BACK - WALL) * (r - r0)) / (r1 - r0)
}
// Silver club seats fill the back of the lower bowl along the sidelines and
// round the corners; behind the end zones the bowl is blue to the fascia.
const clubOrBlue = (k: number) => {
  const a = fold(dirs[k]), b = fold(dirs[(k + 1) % N])
  return (a + b) / 2 < 66 ? silver : seats
}

band(charcoal, k => ringPt(R0, k, FIELD), k => ringPt(R0, k, WALL), -1) // field wall
band(seats, k => ringPt(R0, k, WALL), k => at(k, radius(R1, k), zLower(k, radius(R1, k))), -1) // lower bowl
band(clubOrBlue, k => at(k, radius(R1, k), zLower(k, radius(R1, k))), k => ringPt(RL, k, BACK, -WALK), -1) // club seats
band(precast, k => ringPt(RL, k, BACK, -WALK), k => ringPt(RL, k, BACK), 'up') // walkway
band(charcoal, k => ringPt(RL, k, BACK), k => ringPt(RL, k, LIP - 0.7), -1) // suite fascia
band(precast, k => ringPt(RL, k, LIP - 0.7), k => ringPt(RL, k, LIP), -1) // fascia lip
band(seats, k => ringPt(RL, k, LIP), k => ringPt(R3, k, rim(k) - 1.1, -1.2), -1) // upper deck
band(precast, k => ringPt(R3, k, rim(k) - 1.1, -1.2), k => ringPt(R3, k, rim(k), -1.2), -1) // parapet
band(precast, k => ringPt(R3, k, rim(k), -1.2), k => ringPt(R3, k, rim(k), -0.45), 'up') // rim
band(precast, k => ringPt(R3, k, rim(k) - 0.45), k => ringPt(R3, k, rim(k), -0.45), 1) // bevel

// ---------------------------------------------------------------------------
// Podium: the concourse and office blocks between R3 and the outline.

// OSM outline (way/180768146) in this frame.
const OUTLINE: XY[] = [[120.6,38.7],[120.6,24.4],[120.6,20.2],[120.5,13.5],[120.5,2.4],[120.5,-4.8],[120.5,-7.5],[120.8,-22.0],[120.5,-30.1],[122.8,-30.5],[122.0,-39.5],[121.0,-47.3],[119.4,-56.4],[116.8,-66.9],[113.2,-75.6],[105.5,-72.2],[103.2,-77.1],[93.7,-91.8],[80.8,-103.6],[75.4,-107.4],[80.7,-115.2],[70.7,-121.7],[54.2,-128.5],[46.1,-130.2],[44.3,-130.6],[30.9,-131.0],[16.3,-131.0],[13.4,-131.0],[0.7,-131.0],[-13.1,-131.0],[-15.5,-131.0],[-30.3,-131.0],[-34.8,-131.1],[-34.7,-125.9],[-42.1,-130.8],[-45.3,-130.2],[-53.7,-128.3],[-70.8,-121.3],[-79.8,-114.9],[-75.2,-108.0],[-80.5,-104.4],[-93.9,-91.2],[-102.9,-77.2],[-104.3,-74.2],[-105.8,-71.0],[-113.7,-75.1],[-117.2,-64.1],[-120.7,-50.0],[-121.5,-37.5],[-121.9,-30.3],[-113.9,-30.1],[-114.2,-22.6],[-120.5,-22.6],[-120.7,-7.4],[-120.7,7.7],[-120.7,24.4],[-120.9,38.1],[-116.5,38.0],[-114.9,38.0],[-114.1,50.3],[-112.5,62.1],[-110.6,70.2],[-107.5,82.4],[-102.7,94.1],[-96.2,91.2],[-91.0,99.3],[-85.1,106.9],[-74.5,116.8],[-63.7,124.5],[-58.4,126.3],[-48.1,129.8],[-33.0,132.2],[-31.6,125.1],[-21.1,125.1],[-21.1,133.0],[-12.0,135.8],[-0.6,137.2],[10.3,135.9],[20.1,132.8],[20.2,125.1],[37.2,125.1],[37.3,121.6],[44.9,121.6],[60.8,119.6],[63.4,124.2],[76.1,115.5],[76.7,114.9],[82.0,110.0],[86.7,104.7],[87.5,103.8],[88.1,103.1],[91.5,97.5],[95.5,90.9],[102.2,95.0],[108.2,83.1],[112.2,66.8],[113.6,55.3],[113.6,38.8]]

// The OSM perimeter building:parts that set the podium's height, in this
// frame. Anything not covered is 24 m, the commonest height.
const BLOCKS: [number, XY[]][] = [
  [27,[[-46.5,121.5],[-59.3,119.4],[-72.3,114.1],[-82.8,106.2],[-91.0,99.3],[-85.1,106.9],[-74.5,116.8],[-63.7,124.5],[-58.4,126.3],[-48.1,129.8]]],
  [31,[[-113.9,-30.1],[-121.9,-30.3],[-121.5,-37.5],[-120.7,-50.0],[-117.2,-64.1],[-113.7,-75.1],[-105.8,-71.0],[-109.3,-61.5],[-112.7,-46.0]]],
  [27,[[-96.2,-73.8],[-102.9,-77.2],[-93.9,-91.2],[-80.5,-104.4],[-74.2,-96.2],[-86.9,-87.0]]],
  [31,[[-120.7,24.4],[-120.7,7.7],[-120.7,-7.4],[-113.3,-7.3],[-113.5,24.5]]],
  [31,[[41.9,-121.2],[44.3,-130.6],[46.1,-130.2],[54.2,-128.5],[70.7,-121.7],[80.7,-115.2],[75.4,-107.4],[66.7,-112.5],[51.3,-119.1]]],
  [27,[[75.3,-95.7],[87.1,-86.5],[96.3,-73.5],[103.2,-77.1],[93.7,-91.8],[80.8,-103.6]]],
  [31,[[105.5,-72.2],[108.9,-63.5],[111.5,-53.0],[113.2,-42.7],[114.1,-29.7],[120.5,-30.1],[122.8,-30.5],[122.0,-39.5],[121.0,-47.3],[119.4,-56.4],[116.8,-66.9],[113.2,-75.6]]],
  [31,[[-9.9,-113.4],[-9.9,-115.4],[-15.6,-115.4],[-15.5,-131.0],[-13.1,-131.0],[0.7,-131.0],[13.4,-131.0],[16.3,-131.0],[16.2,-115.5],[10.0,-115.5],[10.0,-113.4]]],
  [31,[[114.4,24.5],[114.4,-7.5],[120.5,-7.5],[120.5,-4.8],[120.5,2.4],[120.5,13.5],[120.6,20.2],[120.6,24.4]]],
  [27,[[88.1,103.1],[87.5,103.8],[86.7,104.7],[82.0,110.0],[76.7,114.9],[76.1,115.5],[63.4,124.2],[60.8,119.6],[74.3,113.1]]],
  [32,[[10.3,135.9],[-0.6,137.2],[-12.0,135.8],[-21.1,133.0],[-21.1,125.1],[20.2,125.1],[20.1,132.8]]],
  [31,[[-40.2,-121.7],[-42.1,-130.8],[-45.3,-130.2],[-53.7,-128.3],[-70.8,-121.3],[-79.8,-114.9],[-75.2,-108.0],[-66.4,-113.5],[-50.4,-119.7]]],
]

function inside([x, y]: XY, poly: XY[]) {
  let c = false
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [x1, y1] = poly[i], [x2, y2] = poly[j]
    if ((y1 > y) !== (y2 > y) && x < ((x2 - x1) * (y - y1)) / (y2 - y1) + x1) c = !c
  }
  return c
}
/** Farthest crossing of the outline along a ray from the bowl centre. */
function outlineRadius([dx, dy]: XY) {
  let best = 0
  for (let i = 0; i < OUTLINE.length; i++) {
    const [x1, y1] = OUTLINE[i], [x2, y2] = OUTLINE[(i + 1) % OUTLINE.length]
    const ex = x2 - x1, ey = y2 - y1, den = dx * ey - dy * ex
    if (Math.abs(den) < 1e-9) continue
    const t = (x1 * ey - (y1 - C) * ex) / den, s = (x1 * dy - (y1 - C) * dx) / den
    if (t > 0 && s >= 0 && s <= 1) best = Math.max(best, t)
  }
  return best
}
// Mirrored so the podium is symmetrical; the wider side wins, so the model
// still covers every part it replaces.
const rawOut = dirs.map(outlineRadius)
const rOut = rawOut.map((r, k) => Math.max(r, rawOut[mirrorV(k)]))
const segDir = (k: number): XY => {
  const a = dirs[k], b = dirs[(k + 1) % N], l = Math.hypot(a[0] + b[0], a[1] + b[1])
  return [(a[0] + b[0]) / l, (a[1] + b[1]) / l]
}
const segMid = (k: number): XY => {
  const d = segDir(k), r = (radius(R3, k) + radius(R3, k + 1) + rOut[k] + rOut[(k + 1) % N]) / 4
  return [d[0] * r, C + d[1] * r]
}
const rawH = Array.from({ length: N }, (_, k) => {
  const d = segDir(k), r0 = (radius(R3, k) + radius(R3, k + 1)) / 2, r1 = (rOut[k] + rOut[(k + 1) % N]) / 2
  let h = 24
  for (const f of [0.3, 0.6, 0.9]) {
    const r = r0 + (r1 - r0) * f, pt: XY = [d[0] * r, C + d[1] * r]
    for (const [bh, poly] of BLOCKS) if (inside(pt, poly)) h = Math.max(h, bh)
  }
  return h
})
const podH0 = rawH.map((h, k) => Math.max(h, rawH[mirrorS(k)]))

// The silver canopies: barrel vaults over the podium on the south-east half,
// two along the sidelines and two either side of the main gate (NAIP). Their
// crowns are the 30–31 m the lidar and OSM give these blocks; the vault
// springs 5 m lower from the podium roof.
const isCanopy = (k: number) => {
  const [x, y] = segMid(k)
  return (Math.abs(x) > 100 && y > -77 && y < -29) || (Math.abs(x) > 40 && Math.abs(x) < 82 && y < -104)
}
const CROWN = 31, RISE = 5
const podH = podH0.map((h, k) => (isCanopy(k) ? CROWN - RISE : h))
// The main gate: the glass front between the two south-east towers.
const isGate = (k: number) => {
  const [x, y] = segMid(k)
  return Math.abs(x) < 17 && y < -100
}

const SLOT = 1.6 // depth of the arcade, behind the arches
const BEVEL = 0.5

for (let k = 0; k < N; k++) {
  const k1 = (k + 1) % N, h = podH[k]
  const o0 = at(k, rOut[k], 0), o1 = at(k1, rOut[k1], 0)
  const i0 = ringPt(R3, k, 0, -SLOT), i1 = ringPt(R3, k1, 0, -SLOT)
  const L = Math.hypot(o1[0] - o0[0], o1[1] - o0[1])
  const u: V3 = [(o1[0] - o0[0]) / L, (o1[1] - o0[1]) / L, 0], out: V3 = [u[1], -u[0], 0]
  const v = (s: number, z: number, d = 0): V3 => [o0[0] + u[0] * s - out[0] * d, o0[1] + u[1] * s - out[1] * d, z]
  const up: V3 = [0, 0, 1]
  const zr = (p: V3, z: number): V3 => [p[0], p[1], z]

  if (isCanopy(k)) {
    // Barrel vault from the arcade out past the facade, its axis along the
    // facade: an arc of six facets, smooth-shaded, with a 1.2 m eave.
    const EAVE = 1.2, SEG = 6
    const a0 = zr(i0, 0), a1 = zr(i1, 0), b0 = v(0, 0, -EAVE), b1 = v(L, 0, -EAVE)
    const prof = (t: number) => h + RISE * Math.sin(Math.PI * t)
    const P = (a: V3, b: V3, t: number): V3 => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, prof(t)]
    const nrm = (t: number): V3 => {
      const dz = RISE * Math.PI * Math.cos(Math.PI * t)
      const span = Math.hypot(b0[0] - a0[0], b0[1] - a0[1])
      return unit(add(mul(out, -dz / span), [0, 0, 1]))
    }
    for (let j = 0; j < SEG; j++) {
      const t0 = j / SEG, t1 = (j + 1) / SEG
      quad(silver, [P(a0, b0, t0), P(a1, b1, t0), P(a1, b1, t1), P(a0, b0, t1)], up, [nrm(t0), nrm(t0), nrm(t1), nrm(t1)])
    }
    // End walls where a run of vault starts or stops.
    for (const [kk, a, b, s] of [[k - 1, a0, b0, -1], [k + 1, a1, b1, 1]] as [number, V3, V3, number][]) {
      if (isCanopy((kk + N) % N)) continue
      for (let j = 0; j < SEG; j++) {
        const t0 = j / SEG, t1 = (j + 1) / SEG
        quad(silver, [P(a, b, t0), P(a, b, t1), zr(P(a, b, t1), h), zr(P(a, b, t0), h)], mul(u, s))
      }
    }
  } else {
    // Flat roof, with a rounded edge back from the facade.
    quad(precast, [v(0, h, BEVEL), v(L, h, BEVEL), zr(i1, h), zr(i0, h)], up)
    const nb = unit(add(out, up))
    quad(precast, [v(0, h - BEVEL), v(L, h - BEVEL), v(L, h, BEVEL), v(0, h, BEVEL)], nb, [out, out, nb, nb].map((n, i) => i < 2 ? unit(add(out, mul(nb, 0.6))) : unit(add(up, mul(nb, 0.6)))))
  }

  // Facade: grey concrete (silver, so the white arcade above stands out as it
  // does in the photos), a black pier at each bay, and per bay a slate
  // window panel per group of about three floors, the concrete showing
  // between them as spandrels; a parapet band at the top. Facade
  // detail starts at the street outside, which is up to 6 m above z = 0.
  const top = isCanopy(k) ? h : h - BEVEL
  quad(silver, [v(0, 0), v(L, 0), v(L, top), v(0, top)], out)
  if (L < 4) continue
  const g = ground(segDir(k)), D = -0.04 // v() offsets inward, so negative is proud of the wall
  const pier = 1.6
  if (isGate(k)) {
    // The main gate's tall glass front.
    quad(win, [v(0.6, g + 0.6, D), v(L - 0.6, g + 0.6, D), v(L - 0.6, h - 3.2, D), v(0.6, h - 3.2, D)], out)
    continue
  }
  box(charcoal, v(pier / 2, (g + h - 1.6) / 2, -0.25), [u, out, up], [pier / 2, 0.25, (h - 1.6 - g) / 2], [5])
  const lo = g + 5.6, hi = h - 3.4
  if (hi - lo < 4) continue
  const groups = Math.max(1, Math.round((hi - lo) / 10)), SP = 1.8
  const gh = (hi - lo - SP * (groups - 1)) / groups
  for (let gi = 0; gi < groups; gi++) {
    const z0 = lo + gi * (gh + SP), z1 = z0 + gh
    quad(win, [v(pier + 1, z0, D), v(L - 1, z0, D), v(L - 1, z1, D), v(pier + 1, z1, D)], out)
  }
}
// Steps between neighbouring blocks of different heights.
for (let k = 0; k < N; k++) {
  const h = podH[k], hp = podH[(k - 1 + N) % N]
  if (hp === h || isCanopy(k) || isCanopy((k - 1 + N) % N)) continue
  const o0 = at(k, rOut[k], 0), i0 = ringPt(R3, k, 0, -SLOT)
  const lo = Math.min(h, hp), hi = Math.max(h, hp)
  const t: V3 = [-dirs[k][1], dirs[k][0], 0]
  quad(precast, [[i0[0], i0[1], lo], [o0[0], o0[1], lo], [o0[0], o0[1], hi], [i0[0], i0[1], hi]], h > hp ? mul(t, -1) : t)
}

// ---------------------------------------------------------------------------
// Above the podium: the white arcade of round arches on R3, the dark
// concourse behind them, and the silver-grey back of the upper deck up to the
// rim. (The white columns that continue up the deck's back to the rim were
// tried and dropped: at phone size they turned the band into a picket fence.)

for (let k = 0; k < N; k++) {
  const k1 = (k + 1) % N, h = podH[k]
  const a = ringPt(R3, k, 0), b = ringPt(R3, k1, 0)
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  const u: V3 = [(b[0] - a[0]) / L, (b[1] - a[1]) / L, 0], out: V3 = [u[1], -u[0], 0]
  const v = (s: number, z: number, d = 0): V3 => [a[0] + u[0] * s + out[0] * d, a[1] + u[1] * s + out[1] * d, z]
  const top = (s: number) => {
    const t = s / L
    return rim(k) * (1 - t) + rim(k1) * t - 0.45
  }
  const rimLo = Math.min(rim(k), rim(k1))
  const pier = 1.8
  const r = Math.min((L - pier) / 2, 5.5), sc = L / 2
  // Arches spring 2.6 m above the podium where the upper deck is tall enough,
  // lower behind the end zones; a grey band of at least 4 m stays above.
  const zs = h + clamp(rimLo - 4.5 - h - r - 0.9, 0.8, 2.6)
  const zt = Math.min(zs + r + 0.9, rimLo - 4)
  // The back of the upper deck.
  quad(silver, [v(0, zt), v(L, zt), v(L, top(L)), v(0, top(0))], out)
  // Concourse wall behind the arches.
  const ia = ringPt(R3, k, 0, -SLOT), ib = ringPt(R3, k1, 0, -SLOT)
  quad(win, [[ia[0], ia[1], h], [ib[0], ib[1], h], [ib[0], ib[1], zt], [ia[0], ia[1], zt]], out)
  if (zs + r > zt - 0.3) {
    quad(precast, [v(0, h), v(L, h), v(L, zt), v(0, zt)], out)
  } else {
    const p = (L - 2 * r) / 2
    quad(precast, [v(0, h), v(p, h), v(p, zt), v(0, zt)], out)
    quad(precast, [v(L - p, h), v(L, h), v(L, zt), v(L - p, zt)], out)
    const ARC = 6
    for (let j = 0; j < ARC; j++) {
      const t0 = Math.PI - (j * Math.PI) / ARC, t1 = Math.PI - ((j + 1) * Math.PI) / ARC
      const s0 = sc + r * Math.cos(t0), s1 = sc + r * Math.cos(t1)
      quad(precast, [v(s0, zs + r * Math.sin(t0)), v(s1, zs + r * Math.sin(t1)), v(s1, zt), v(s0, zt)], out)
    }
    // Soffit of the arch band, so the opening has depth.
    quad(precast, [v(p, zs, 0), v(L - p, zs, 0), [ib[0] - u[0] * p, ib[1] - u[1] * p, zs], [ia[0] + u[0] * p, ia[1] + u[1] * p, zs]], [0, 0, 1])
  }
}

// ---------------------------------------------------------------------------
// Stair towers: black, square with chamfered corners, each under a glass
// light dome. A Panthers-blue panel on the outward face.

const TOWERS: XY[] = [[114, C - 23.5], [114, C + 23.5], [-114, C - 23.5], [-114, C + 23.5], [23.2, -124.4], [-23.2, -124.4]]
const TH = 33, HALF = 7.5, CH = 1.0, SEG = 12
for (const [cx, cy] of TOWERS) {
  const ring = (d: number, z: number): { p: V3; n: V3 }[] => {
    const h = HALF - d, c = CH - d * 0.414
    const pts: XY[] = [[h - c, -h], [h, -h + c], [h, h - c], [h - c, h], [-h + c, h], [-h, h - c], [-h, -h + c], [-h + c, -h]]
    const nrm: XY[] = [[0, -1], [1, 0], [1, 0], [0, 1], [0, 1], [-1, 0], [-1, 0], [0, -1]]
    return pts.map((p, i) => ({ p: [cx + p[0], cy + p[1], z], n: [nrm[i][0], nrm[i][1], 0] }))
  }
  const lo = ring(0, 0), mid = ring(0, TH - 0.6), hi = ring(0.6, TH)
  for (let i = 0; i < 8; i++) {
    const j = (i + 1) % 8
    const corner = i % 2 === 0
    const fn = unit(add(lo[i].n, lo[j].n))
    const nA = corner ? lo[i].n : fn, nB = corner ? lo[j].n : fn
    quad(charcoal, [lo[i].p, lo[j].p, mid[j].p, mid[i].p], fn, corner ? [lo[i].n, lo[j].n, lo[j].n, lo[i].n] : [nA, nB, nB, nA])
    const tA = unit(add(lo[i].n, [0, 0, 1])), tB = unit(add(lo[j].n, [0, 0, 1]))
    quad(charcoal, [mid[i].p, mid[j].p, hi[j].p, hi[i].p], unit(add(fn, [0, 0, 1])), [lo[i].n, lo[j].n, tB, tA])
  }
  for (let i = 1; i < 7; i++) quad(charcoal, [hi[0].p, hi[i].p, hi[i + 1].p, hi[i + 1].p], [0, 0, 1])
  const side = Math.abs(cx) > 60 ? ([Math.sign(cx), 0] as XY) : ([0, -1] as XY)
  const t: XY = [-side[1], side[0]]
  const fx = cx + side[0] * (HALF + 0.05), fy = cy + side[1] * (HALF + 0.05)
  const P = (s: number, z: number): V3 => [fx + t[0] * s, fy + t[1] * s, z]
  quad(seats, [P(-3, 12), P(3, 12), P(3, 28), P(-3, 28)], [side[0], side[1], 0])

  // Light dome: a short glass drum under a low dome, 38.6 m (lidar 38–39).
  const RD = 6.2, Z0 = TH, Z1 = TH + 2.2, ZT = 38.6, ROWS = 3
  const pt = (i: number, r: number, z: number): V3 => [cx + r * Math.cos((i * 2 * Math.PI) / SEG), cy + r * Math.sin((i * 2 * Math.PI) / SEG), z]
  const rn = (i: number, upv = 0): V3 => unit([Math.cos((i * 2 * Math.PI) / SEG), Math.sin((i * 2 * Math.PI) / SEG), upv])
  for (let i = 0; i < SEG; i++) {
    quad(cupola, [pt(i, RD, Z0), pt(i + 1, RD, Z0), pt(i + 1, RD, Z1), pt(i, RD, Z1)], rn(i), [rn(i), rn(i + 1), rn(i + 1), rn(i)])
    for (let j = 0; j < ROWS; j++) {
      const a0 = (j * Math.PI) / 2 / ROWS, a1 = ((j + 1) * Math.PI) / 2 / ROWS
      const H = ZT - Z1
      const r0 = RD * Math.cos(a0), r1 = RD * Math.cos(a1), z0 = Z1 + H * Math.sin(a0), z1 = Z1 + H * Math.sin(a1)
      const n = (ii: number, a: number) => unit([Math.cos((ii * 2 * Math.PI) / SEG) * Math.cos(a) / RD, Math.sin((ii * 2 * Math.PI) / SEG) * Math.cos(a) / RD, Math.sin(a) / H])
      quad(cupola, [pt(i, r0, z0), pt(i + 1, r0, z0), pt(i + 1, r1, z1), pt(i, r1, z1)], n(i, (a0 + a1) / 2), [n(i, a0), n(i + 1, a0), n(i + 1, a1), n(i, a1)])
    }
  }
}

// ---------------------------------------------------------------------------
// Video boards over both end zones, 117 m from the bowl centre, 78 m wide,
// standing on the end rim: a black box with the 61 × 17 m screen facing the
// field, under a low arched black truss whose crown is the lidar's 60 m. Each
// board's back carries the pale Bank of America sign to the street.

for (const s of [-1, 1]) {
  const y = C + s * 117
  const z0 = 33, z1 = 57, x = 39, d = 2.0
  const P = (xx: number, yy: number, z: number): V3 => [xx, yy, z]
  box(charcoal, [0, y, (z0 + z1) / 2], [[1, 0, 0], [0, 1, 0], [0, 0, 1]], [x, d, (z1 - z0) / 2])
  const yIn = y - s * (d + 0.05)
  quad(win, [P(-30.5, yIn, 36), P(30.5, yIn, 36), P(30.5, yIn, 53), P(-30.5, yIn, 53)], [0, -s, 0])
  {
    const yOut = y + s * (d + 0.05)
    quad(silver, [P(-x + 1.5, yOut, z0 + 1.5), P(x - 1.5, yOut, z0 + 1.5), P(x - 1.5, yOut, z1 - 1.5), P(-x + 1.5, yOut, z1 - 1.5)], [0, s, 0])
  }
  // The arched truss: a band 1.2 m deep, rising 3.5 m from the board's top
  // corners to its middle.
  const ARCH = 10, rise = 3.5
  const zA = (t: number) => z1 + rise * Math.sin(Math.PI * t)
  for (let j = 0; j < ARCH; j++) {
    const t0 = j / ARCH, t1 = (j + 1) / ARCH, x0 = -x + 2 * x * t0, x1 = -x + 2 * x * t1
    for (const yy of [y - 0.6, y + 0.6]) {
      const f = yy > y ? 1 : -1
      quad(charcoal, [P(x0, yy, z1), P(x1, yy, z1), P(x1, yy, zA(t1)), P(x0, yy, zA(t0))], [0, f, 0])
    }
    const n0: V3 = unit([-rise * Math.PI * Math.cos(Math.PI * t0) / (2 * x), 0, 1]), n1: V3 = unit([-rise * Math.PI * Math.cos(Math.PI * t1) / (2 * x), 0, 1])
    quad(charcoal, [P(x0, y - 0.6, zA(t0)), P(x1, y - 0.6, zA(t1)), P(x1, y + 0.6, zA(t1)), P(x0, y + 0.6, zA(t0))], [0, 0, 1], [n0, n1, n1, n0])
  }
}

// ---------------------------------------------------------------------------
// Lamp bars: at each corner a black bar, 34 m long, about 52.5 m up (lidar
// 52–54), with its pale lamp face tipped down at the field, held by three
// white beams running back to the rim. Mirrored across both axes.

/** A square-section tube along a path. */
function tube(p: Part, path: V3[], side: V3, w: number) {
  const secs = path.map((c, i) => {
    const f = unit(sub(path[Math.min(i + 1, path.length - 1)], path[Math.max(i - 1, 0)]))
    const n = unit(cross(side, f))
    const s = mul(side, w / 2), m = mul(n, w / 2)
    return [add(add(c, s), m), add(sub(c, s), m), sub(sub(c, s), m), sub(add(c, s), m)] as V3[]
  })
  for (let i = 0; i < secs.length - 1; i++) {
    const c = path[i]
    for (let e = 0; e < 4; e++) {
      const f = (e + 1) % 4
      const P = [secs[i][e], secs[i][f], secs[i + 1][f], secs[i + 1][e]]
      const mc = mul(add(add(P[0], P[1]), add(P[2], P[3])), 0.25)
      quad(p, P, sub(mc, mul(add(c, path[i + 1]), 0.5)))
    }
  }
}
/** The bowl sample nearest a direction from the bowl centre. */
const nearestK = (p: XY) => {
  const l = Math.hypot(p[0], p[1]) || 1
  let best = 0, bd = -2
  dirs.forEach((d, k) => { const v = (d[0] * p[0] + d[1] * p[1]) / l; if (v > bd) { bd = v; best = k } })
  return best
}
/** R3's radius in a direction (x, y − C). */
const r3At = (p: XY) => {
  const l = Math.hypot(p[0], p[1]), dx = Math.abs(p[0]) / l, dy = Math.abs(p[1]) / l
  return 1 / Math.pow(Math.pow(dx / R3.a, R3.n) + Math.pow(dy / R3.b, R3.n), 1 / R3.n)
}
const BAR: [XY, XY] = [[79.5, 75], [91.5, 43]] // first quadrant, x and y − C
const ZBAR = 52.5
for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
  const Q = ([x, y]: XY): XY => [sx * x, sy * y]
  const P = (q: XY, z: number): V3 => [q[0], C + q[1], z]
  const a = P(Q(BAR[0]), ZBAR), b = P(Q(BAR[1]), ZBAR)
  const along = unit(sub(b, a)), mid = mul(add(a, b), 0.5)
  const toField: V3 = unit([-mid[0], C - mid[1], 0])
  const perp: V3 = unit(cross(along, [0, 0, 1]))
  const inward = dot(perp, toField) > 0 ? perp : mul(perp, -1)
  const tilt = (28 * Math.PI) / 180
  const nrm: V3 = add(mul(inward, Math.cos(tilt)), [0, 0, -Math.sin(tilt)])
  const upv: V3 = add(mul(inward, Math.sin(tilt)), [0, 0, Math.cos(tilt)])
  const L = Math.hypot(...sub(b, a)) / 2, T = 0.6, H = 1.7
  box(charcoal, mid, [along, nrm, upv], [L, T, H])
  const F = (u: number, v: number) => add(add(add(mid, mul(nrm, T + 0.03)), mul(along, u)), mul(upv, v))
  quad(precast, [F(-L + 0.4, -H + 0.35), F(L - 0.4, -H + 0.35), F(L - 0.4, H - 0.35), F(-L + 0.4, H - 0.35)], nrm)
  // Beams: from the back of the bar, square to it, out to the rim.
  for (const t of [0.12, 0.5, 0.88]) {
    const iB = add(add(a, mul(sub(b, a), t)), mul(inward, -0.7))
    let q: XY = [iB[0], iB[1] - C]
    const dir: XY = [-inward[0], -inward[1]]
    for (let i = 0; i < 80 && Math.hypot(q[0], q[1]) < r3At(q) - 0.8; i++) q = [q[0] + dir[0] * 0.5, q[1] + dir[1] * 0.5]
    const o = P(q, rim(nearestK(q)) + 0.2)
    tube(precast, [o, iB], unit(cross(unit(sub(iB, o)), [0, 0, 1])), 1.4)
  }
}

// ---------------------------------------------------------------------------
// Materials (six). The Panthers blue is the seats' real hue, pulled to the
// palette's lightness: the old saturated blue read as a cartoon. Black is the
// style's charcoal floor (towers, suite fascia, boards, piers, lamp bars).
// Silver: the club seats, the canopies, the podium's concrete walls, the back
// of the upper deck and the boards' signs. The precast (arcade, rim, roofs,
// beams) is the real pale off-white. The light domes are pale green-grey
// glass, as photographed; palette glass blue read as more seats.
const parts = [
  { part: seats, material: finish('panthers-blue-seats', 0x84a6c6) },
  { part: charcoal, material: finish('panthers-charcoal', 0x4a4f57) },
  { part: silver, material: finish('panthers-silver', 0xbcc1c5) },
  { part: precast, material: finish('boa-precast', 0xe9e4da) },
  { part: win, material: PALETTE.window },
  { part: cupola, material: finish('light-dome-glass', 0xa3bfb2) },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
for (const { part, material } of parts) console.log(material.name.padEnd(20), part.triangles)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Bank of America Stadium', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  bearing: 320, osm: 'relation/12346952', footprint: [243, 268], height: 60.5,
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const outPath = new URL('../models/bank-of-america-stadium.glb', import.meta.url).pathname
await Bun.write(outPath, glb)
console.log(`${outPath}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
