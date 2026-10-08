/**
 * Big Thunder Mountain Railroad, Frontierland, Disneyland Park (Anaheim) —
 * the rockwork, the track, the station and Rainbow Ridge. Procedural, CC0-1.0.
 * bun generators/dlr-big-thunder-mountain.ts
 *
 * Map frame: x east, y north, z up, metres. Origin at the centroid of OSM's
 * tallest rock part (way/185252217, -117.9203327, 33.8132457), on the ground.
 * Bearing 0.
 *
 * Built the way wdw-big-thunder-mountain.ts was: one fused mass of rock and
 * track. Anaheim's is its own design, though — the 1979 original, mirrored
 * from Florida's plan, with rounded Bryce Canyon hoodoos in muted salmon and
 * tan rather than Monument Valley's sharp orange buttes:
 *  - a low rock base over the ride site (OSM's show buildings way/196827012,
 *    way/249164682, way/107526325 and the tan rockwork between them on the
 *    NAIP orthophoto), terraced, raised over the tunnels and cut down to a
 *    ledge under the deck wherever the track runs in the open;
 *  - hoodoos rising out of it, each a column of stacked, rounded lumps that
 *    pinch in between — the "melted candle" look of Anaheim's spires. Past
 *    the peak and helix groups they are scattered over the rock as a crowd,
 *    9–18 m, as wide as the open track nearby allows, tallest round the peak
 *    and lower towards the station, so the skyline is lumpy all along;
 *  - the main peak at the south end of the summit ridge, its spires stepping
 *    down northwards as OSM's parts do: 31, 23 and 20 m (way/185252217,
 *    -218, -219), then the 122634161 shoulder;
 *  - the helix rock east of the peak (way/249164683, 14 m) with the
 *    clockwise helix wrapped round it;
 *  - horizontal strata: a darker foot, then salmon and pale tan bands.
 *
 * The track is a swept timber deck with a dark rail band (the WDW model's method, not
 * coaster-kit.ts: a mine train with three chain lifts and short drops has
 * nothing for the kit's energy model to check). The centreline is OSM's
 * circuit, 856 m against RCDB's 2,671 ft (814 m), chained in ride order from
 * the station. Heights are a hand profile along it, from Wikipedia's ride
 * description and the OSM layer tags:
 *    0– 27  bat tunnel                       z 1
 *   27– 85  lift 1, in the cavern (tunnel)   to 11.5
 *   85–128  the crest run round the peak's north shoulder, on its east face
 *  128–165  drop to the right, into the tunnel through the helix ridge
 *  165–300  out round the east loop, into the coyote cave (way/107526325)
 *  300–350  lift 2, open, up the east side      to 12.5
 *  350–448  drop right, under lift 2, up into the clockwise helix, down
 *  448–558  the canyon north between peak and ridge, the mining camp
 *  558–607  lift 3 in the tunnel under the summit ridge, out of the peak's
 *           south face at 13.5 m — the dynamite lift
 *  607–760  drop south, right towards the river, the short tunnel, over the
 *           drop, past the T-rex, brakes
 *  760–856  past Rainbow Ridge back to the dual station.
 * Tunnels are not drawn: the rock closes over them. Open track stands on the
 * rock where the rock is high enough, on timber bents where it isn't.
 *
 * The station (way/266074156) is a low timber deck under the platform
 * building (way/49884643, 6 m, two storeys) with its shingle roof. Rainbow
 * Ridge's false-front buildings (Big Thunder Saloon, Assay Office, Epitaph,
 * Pan Handle Hotel, El Dorado Hotel, the barber, the mercantile, the Golden
 * Nugget) are timber boxes on their OSM footprints with pale false fronts.
 * The train shed (way/49884638, 6 m) is a gabled shed.
 *
 * Evidence:
 *  - OSM: every track way with its tunnel/bridge/layer tags, the rock parts
 *    with heights, the show buildings, station, shed and town.
 *  - NAIP (USGS, public domain) orthophoto for where the rockwork is and the
 *    open hairpins (it agrees with OSM within ~3 m).
 *  - Published: peak 104 ft (Wikipedia; OSM's 31 m agrees), track length
 *    2,671 ft, 28 mph, three chain lifts, dual station (RCDB 202), the ride
 *    order (Wikipedia, "Ride variations: Disneyland").
 *  - Photos (Wikimedia Commons): the peak from the south over the T-rex
 *    (deror_avi, IMG 3948, CC BY-SA 3.0); from the station looking north
 *    (Boris Dzhingarov, Flickr 9894258194, CC BY 2.0); from Frontierland
 *    in 1982 (Yolanl, CC BY 4.0); across the Rivers of America from the
 *    south-west (Paigeboyd02, CC BY-SA 4.0); the hoodoos and the north side
 *    from the ride (Ellen Levy Finch, CC BY-SA 3.0; deror_avi IMG 3945);
 *    the town (deror_avi IMG 3946, CC BY-SA 3.0).
 *
 * Measured: the plan of everything (OSM), the peak's three heights (OSM).
 * Published: the peak's height, the track length, the lift count and order.
 * Estimated: every track height (no published profile; lifts put at
 * 11.5–13.5 m so the 28 mph top speed works out), the helix rock and ridge
 * heights beyond OSM's 12–14 m, the other hoodoos' positions and heights
 * (from the photos, which are nearly all taken from the south), the base's
 * relief, and the town's heights (OSM has none).
 * Invented: the north and east sides' detail — no licensed photo shows them
 * from outside the ride.
 *
 * Doubts:
 *  - OSM puts lift 1's open crest run (way/111665768) inside the peak's
 *    mapped parts. The photos show the train on the peak's east face at
 *    about a third of its height, so the peak's spires are moved 1.5–4.5 m
 *    west of OSM's parts to leave that ledge open.
 *  - The NAIP rock extents and the OSM show buildings disagree in the north
 *    (y > 30), which is trees on NAIP; the model keeps OSM's footprint low
 *    there (≤ 6.5 m) so way/196827012 is covered.
 *  - Wikidata has no item for the Anaheim ride alone; Q859406 is the one OSM
 *    and Wikipedia use for it.
 */
import { Part, addGltfTriangles, writeGlb, type V3 } from './mesh'
import { finish } from './palette'

type XY = [number, number]
type Way = { id: number; kind: 'open' | 'tunnel'; pts: XY[] }
const TAU = Math.PI * 2

const rust = new Part()   // the darker foot of the rock
const sand = new Part()   // the main salmon
const pale = new Part()   // pale tan bands, crowns and false fronts
const rail = new Part()   // rails
const wood = new Part()   // deck, bents, station and town walls
const roof = new Part()   // shingle roofs

// ---------------------------------------------------------------------------
// Kit

function tri(p: Part, a: V3, b: V3, c: V3, n?: V3[]) { p.tri(a, b, c, undefined, undefined, undefined, n) }
function quad(p: Part, a: V3, b: V3, c: V3, d: V3, n?: [V3, V3, V3, V3]) {
  tri(p, a, b, c, n && [n[0], n[1], n[2]])
  tri(p, a, c, d, n && [n[0], n[2], n[3]])
}
const area = (q: XY[]) => q.reduce((s, a, i) => { const b = q[(i + 1) % q.length]; return s + a[0] * b[1] - b[0] * a[1] }, 0) / 2

/** Keep the part of a polygon where a·x + b·y + c ≥ 0 (Sutherland–Hodgman). */
function clip(poly: XY[], a: number, b: number, c: number): XY[] {
  const f = (p: XY) => a * p[0] + b * p[1] + c
  const out: XY[] = []
  for (let i = 0; i < poly.length; i++) {
    const p = poly[i], q = poly[(i + 1) % poly.length], fp = f(p), fq = f(q)
    if (fp >= 0) out.push(p)
    if ((fp >= 0) !== (fq >= 0)) {
      const t = fp / (fp - fq)
      out.push([p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t])
    }
  }
  return out
}

/** Ear-clipping triangulation of a simple counter-clockwise polygon. */
function earcut(poly: XY[]): [number, number, number][] {
  const idx = poly.map((_, i) => i), out: [number, number, number][] = []
  const crossz = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inside = (p: XY, a: XY, b: XY, c: XY) => crossz(a, b, p) > 1e-9 && crossz(b, c, p) > 1e-9 && crossz(c, a, p) > 1e-9
  let guard = 0
  while (idx.length > 3 && guard++ < 10000) {
    let cut = false
    for (let k = 0; k < idx.length; k++) {
      const i0 = idx[(k + idx.length - 1) % idx.length], i1 = idx[k], i2 = idx[(k + 1) % idx.length]
      const a = poly[i0], b = poly[i1], c = poly[i2]
      if (crossz(a, b, c) <= 1e-9) continue
      if (idx.some((j) => j !== i0 && j !== i1 && j !== i2 && inside(poly[j], a, b, c))) continue
      out.push([i0, i1, i2]); idx.splice(k, 1); cut = true; break
    }
    if (!cut) idx.splice(0, 1)
  }
  if (idx.length === 3) out.push([idx[0], idx[1], idx[2]])
  return out
}

/** A vertical prism over a polygon, flat-shaded. */
function prism(p: Part, poly: XY[], z0: number, z1: number, o: { top?: boolean; topPart?: Part } = {}) {
  if (area(poly) < 0) poly = [...poly].reverse()
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length]
    if (Math.hypot(b[0] - a[0], b[1] - a[1]) < 1e-6) continue
    quad(p, [a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
  }
  if (o.top !== false) for (const [i, j, k] of earcut(poly)) tri(o.topPart ?? p, [...poly[i], z1] as V3, [...poly[j], z1] as V3, [...poly[k], z1] as V3)
}

/**
 * A pitched roof over a polygon: split along its principal axis, each half
 * a plane from `eave` at the far edge to `ridge` on the axis, 0.3 m proud.
 */
function polyRoof(p: Part, poly: XY[], eave: number, ridge: number, across = false) {
  const cx = poly.reduce((s, q) => s + q[0], 0) / poly.length, cy = poly.reduce((s, q) => s + q[1], 0) / poly.length
  let sxx = 0, syy = 0, sxy = 0
  for (const [x, y] of poly) { sxx += (x - cx) ** 2; syy += (y - cy) ** 2; sxy += (x - cx) * (y - cy) }
  let ang = 0.5 * Math.atan2(2 * sxy, sxx - syy)
  if (across) ang += Math.PI / 2
  const ux = Math.cos(ang), uy = Math.sin(ang)
  const d = (q: XY) => (q[0] - cx) * -uy + (q[1] - cy) * ux
  const span = Math.max(...poly.map((q) => Math.abs(d(q))))
  const z = (q: XY) => eave + (ridge - eave) * (1 - Math.abs(d(q)) / span)
  for (const half of [clip(poly, -uy, ux, -(-uy * cx + ux * cy)), clip(poly, uy, -ux, -(uy * cx - ux * cy))]) {
    if (half.length < 3) continue
    const ccw = area(half) > 0 ? half : [...half].reverse()
    for (const [i, j, k] of earcut(ccw)) {
      const A = ccw[i], B = ccw[j], C = ccw[k]
      tri(p, [A[0], A[1], z(A)], [B[0], B[1], z(B)], [C[0], C[1], z(C)])
    }
  }
  return z
}

/** A small deterministic random source, so the rock comes out the same. */
let seed = 19
const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646 }

const inPoly = (p: XY, poly: XY[]) => {
  let c = false
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j]
    if ((yi > p[1]) !== (yj > p[1]) && p[0] < xi + ((p[1] - yi) * (xj - xi)) / (yj - yi)) c = !c
  }
  return c
}

/** Strata: the rock's tone by height — the darker foot, then bands. */
function stratum(z: number): Part {
  if (z < 3.4) return rust
  const band = Math.floor((z - 3.4) / 3.0)
  // Above the rest of the rock the peak is paler, so the spire reads at
  // phone size against the salmon below it; the tip is pale outright.
  if (z > 25) return pale
  if (z > 15) return band % 3 === 2 ? pale : sand
  return band % 4 === 3 ? pale : sand
}
/**
 * Rock triangles are collected per stratum and written at the end with
 * creased smooth shading, so a hoodoo's lumps read round and steep breaks
 * keep an edge. Flat-shaded, the rock would also blow the file budget.
 */
const rockTris = new Map<Part, number[]>()
function rockTri(a: V3, b: V3, c: V3, p = stratum((a[2] + b[2] + c[2]) / 3)) {
  if (!rockTris.has(p)) rockTris.set(p, [])
  for (const v of [a, b, c]) rockTris.get(p)!.push(v[0], v[2], -v[1]) // map → glTF frame
}
/** A quad keeps one stratum, so a band's edge runs level, not zigzag. */
function rockQuad(a: V3, b: V3, c: V3, d: V3, p = stratum((a[2] + b[2] + c[2] + d[2]) / 4)) {
  rockTri(a, b, c, p); rockTri(a, c, d, p)
}
function flushRock(creaseDegrees: number) {
  for (const [part, pos] of rockTris)
    addGltfTriangles(part, new Float32Array(pos), Uint32Array.from({ length: pos.length / 3 }, (_, i) => i), { creaseDegrees })
  rockTris.clear()
}

// ---------------------------------------------------------------------------
// OSM data, metres about the peak.

/** The circuit in ride order from the station (track 1). */
const CIRCUIT: Way[] = [
  { id: 111665796, kind: 'open', pts: [[-16.7, -55.3], [-18.8, -54.2], [-20.2, -53.3]] },
  { id: 111665765, kind: 'tunnel', pts: [[-20.2, -53.3], [-20.8, -51.7], [-20.2, -50.4], [-18.8, -48.9], [-16.4, -48.1], [-13.1, -47.0], [-11.1, -45.8], [-9.8, -43.7], [-8.3, -40.7], [-7.8, -36.9]] },
  { id: 111665769, kind: 'tunnel', pts: [[-7.8, -36.9], [-7.3, -32.0], [-4.8, 18.7]] },
  { id: 111665786, kind: 'open', pts: [[-4.8, 18.7], [-4.7, 21.5], [-3.5, 23.6], [-1.2, 25.4], [2.1, 25.8], [4.3, 24.5], [6.1, 23.3], [7.2, 19.9]] },
  { id: 111665768, kind: 'open', pts: [[7.2, 19.9], [6.6, 14.1], [5.7, 11.0], [5.0, 7.3], [3.6, 0.9], [4.2, -3.5], [4.3, -6.8], [5.7, -8.6]] },
  { id: 111665783, kind: 'open', pts: [[5.7, -8.6], [9.2, -11.4], [12.9, -11.6]] },
  { id: 111665763, kind: 'open', pts: [[12.9, -11.6], [16.0, -10.5], [21.2, -5.9]] },
  { id: 111665776, kind: 'tunnel', pts: [[21.2, -5.9], [25.5, 2.0]] },
  { id: 111665775, kind: 'open', pts: [[25.5, 2.0], [28.3, 10.0], [27.7, 15.5], [26.9, 21.0], [28.0, 26.3], [31.3, 29.4], [35.4, 32.3], [37.9, 32.6], [40.8, 32.1], [43.4, 31.1], [45.1, 28.6], [45.8, 25.3], [45.8, 21.6], [44.0, 14.8], [39.6, 0.3], [38.7, -3.6]] },
  { id: 111665767, kind: 'tunnel', pts: [[38.7, -3.6], [39.4, -12.0], [39.5, -16.3], [44.2, -30.0], [45.0, -36.9], [44.6, -39.3], [43.1, -41.2], [41.0, -42.1], [36.5, -40.8], [33.4, -37.7], [31.6, -30.8], [30.9, -25.9]] },
  { id: 111665780, kind: 'open', pts: [[30.9, -25.9], [29.2, -16.8], [23.6, 7.4]] },
  { id: 111665797, kind: 'open', pts: [[23.6, 7.4], [21.5, 17.3], [22.6, 21.0], [25.2, 23.7]] },
  { id: 111665770, kind: 'open', pts: [[25.2, 23.7], [29.3, 24.6], [32.9, 22.6], [34.6, 19.8]] },
  { id: 111666071, kind: 'open', pts: [[34.6, 19.8], [35.0, 14.3], [33.2, 7.1]] },
  { id: 111665789, kind: 'open', pts: [[33.2, 7.1], [22.1, -23.9]] },
  { id: 111665757, kind: 'open', pts: [[22.1, -23.9], [18.4, -27.5], [14.5, -27.9], [11.7, -25.8], [10.2, -23.3], [10.7, -19.9], [11.6, -18.3], [13.3, -16.8], [15.4, -16.1], [17.5, -16.2], [19.1, -16.6], [19.6, -16.8]] },
  { id: 111665791, kind: 'tunnel', pts: [[19.6, -16.8], [21.8, -17.6], [23.0, -18.8], [23.7, -20.7], [23.7, -22.9]] },
  { id: 111665785, kind: 'open', pts: [[23.7, -22.9], [22.6, -27.4], [19.7, -30.4], [16.3, -31.0], [13.0, -30.5], [8.8, -29.0], [7.1, -25.1], [7.3, -19.2], [10.5, -7.1], [12.9, 4.5], [13.4, 11.2], [13.6, 21.6], [12.7, 34.7], [13.5, 40.7], [12.0, 44.5], [7.8, 46.5], [5.1, 46.4], [3.4, 46.0], [2.1, 44.4], [1.6, 40.5]] },
  { id: 111665771, kind: 'tunnel', pts: [[1.6, 40.5], [0.6, 20.8]] },
  { id: 111665792, kind: 'tunnel', pts: [[0.6, 20.8], [-0.2, 5.9]] },
  { id: 111665790, kind: 'tunnel', pts: [[-0.2, 5.9], [-0.7, -8.5]] },
  { id: 111665760, kind: 'open', pts: [[-0.7, -8.5], [-0.5, -31.6], [-1.3, -35.3], [-3.9, -38.2], [-7.0, -39.3], [-11.2, -39.1], [-15.3, -34.6]] },
  { id: 111665759, kind: 'open', pts: [[-15.3, -34.6], [-24.4, -22.2]] },
  { id: 111665766, kind: 'open', pts: [[-24.4, -22.2], [-30.7, -14.1]] },
  { id: 111665778, kind: 'open', pts: [[-30.7, -14.1], [-32.5, -10.4], [-31.8, -6.0], [-29.6, -4.3]] },
  { id: 111665762, kind: 'tunnel', pts: [[-29.6, -4.3], [-28.5, -4.0], [-26.5, -3.5], [-22.9, -3.9], [-19.2, -7.3], [-17.6, -13.4]] },
  { id: 111665764, kind: 'open', pts: [[-17.6, -13.4], [-18.9, -21.9], [-20.2, -34.4], [-20.4, -38.6], [-20.2, -41.5], [-19.8, -43.0], [-18.1, -45.2], [-16.4, -46.3]] },
  { id: 111665795, kind: 'open', pts: [[-16.4, -46.3], [-11.8, -47.7]] },
  { id: 111665782, kind: 'open', pts: [[-11.8, -47.7], [-7.3, -47.0]] },
  { id: 123412143, kind: 'open', pts: [[-7.3, -47.0], [2.0, -44.5], [10.7, -41.3]] },
  { id: 111665774, kind: 'open', pts: [[10.7, -41.3], [13.3, -41.2], [15.5, -41.7], [18.5, -45.2], [19.2, -47.5]] },
  { id: 123412154, kind: 'open', pts: [[19.2, -47.5], [20.4, -51.3]] },
  { id: 123412155, kind: 'open', pts: [[20.4, -51.3], [24.8, -63.8], [25.3, -65.7], [25.5, -68.1], [25.0, -69.7], [23.9, -71.8], [21.8, -73.9], [19.0, -74.7], [18.3, -74.7]] },
  { id: 111666072, kind: 'open', pts: [[18.3, -74.7], [17.6, -74.7], [12.9, -71.8]] },
  { id: 111665788, kind: 'open', pts: [[12.9, -71.8], [9.3, -64.9]] },
  { id: 111665772, kind: 'open', pts: [[9.3, -64.9], [-6.4, -56.8], [-10.4, -54.8], [-16.7, -55.3]] },
]
/** The second station track (way/265090600, 111665784, 111665773), level. */
const SECOND: XY[] = [[12.9, -71.8], [6.5, -72.2], [-11.9, -62.9], [-13.0, -62.3], [-15.5, -58.5], [-16.7, -55.3]]

/** Height profile along the circuit: [metres from the station, height]. */
const PROFILE: [number, number][] = [
  [0, 1.0], [20, 1.0], [30, 1.2], [85, 11.5],          // bat tunnel, lift 1
  [118, 11.0], [128, 10.4], [150, 3.0], [166, 2.0],     // crest run, drop
  [240, 2.2], [290, 2.2], [302, 3.0], [350, 12.5],      // east loop, cave, lift 2
  [357, 12.0], [392, 3.0], [412, 7.5], [448, 2.5],      // drop, helix
  [470, 3.0], [520, 2.6], [545, 2.2], [560, 1.8],       // canyon, mining camp
  [607, 13.5], [613, 13.0], [645, 3.5], [665, 2.5],     // lift 3, drop
  [685, 5.0], [700, 5.0], [716, 6.0], [745, 3.0],       // tunnel, over the drop
  [760, 4.5], [772, 4.0], [795, 2.0], [812, 1.2], [830, 1.0], [900, 1.0],
]
const zAt = (s: number) => {
  for (let i = 0; i < PROFILE.length - 1; i++) {
    const [s0, z0] = PROFILE[i], [s1, z1] = PROFILE[i + 1]
    if (s <= s1) return z0 + (z1 - z0) * Math.max(0, (s - s0) / (s1 - s0))
  }
  return PROFILE[PROFILE.length - 1][1]
}

/** Rock areas: OSM's show buildings over the ride, and the rock between. */
const R_WEST: XY[] = [[4.0, 34.0], [5.7, 33.8], [6.5, 35.5], [9.9, 35.7], [9.3, 31.6], [11.4, 30.6], [7.9, 9.0], [5.3, -7.5], [4.8, -18.5], [6.7, -21.5], [9.7, -26.1], [11.2, -31.4], [8.9, -40.1], [-2.7, -44.2], [-10.5, -47.1], [-14.3, -49.5], [-17.0, -51.2], [-18.4, -53.4], [-19.5, -55.3], [-24.7, -53.8], [-25.2, -48.5], [-22.6, -46.1], [-21.6, -41.6], [-21.8, -30.5], [-20.5, -20.9], [-20.0, -15.8], [-22.5, -12.5], [-26.9, -7.6], [-28.5, -4.9], [-26.9, -1.5], [-22.6, -1.7], [-20.0, 1.7], [-21.3, 6.5], [-19.2, 9.7], [-15.5, 14.2], [-11.4, 22.1], [-9.2, 26.0], [-10.4, 29.2], [-4.8, 32.3], [-4.6, 39.5], [-4.4, 44.7], [5.6, 43.9], [5.2, 41.5]]
const R_HELIX: XY[] = [[17.2, -17.5], [19.4, -18.5], [21.8, -10.4], [22.0, -5.8], [20.1, -4.6], [20.0, 6.9], [21.8, 7.5], [25.7, -7.7], [22.9, -15.9], [22.6, -24.6], [21.7, -27.5], [17.5, -29.4], [12.7, -28.4], [9.7, -24.5], [9.2, -20.9], [11.6, -17.2]]
const R_CAVE: XY[] = [[31.1, -38.1], [29.3, -29.8], [29.2, -26.2], [33.2, -25.5], [34.2, -31.9], [35.1, -36.5], [36.9, -38.9], [39.5, -38.7], [42.2, -35.5], [37.1, -15.4], [36.9, -9.2], [37.5, -3.5], [40.4, -3.9], [41.6, -14.4], [46.8, -30.7], [47.4, -36.8], [43.8, -43.3], [36.7, -44.5], [32.6, -42.0]]
/** The rock between the peak's ridge and the helix ridge (NAIP). */
const R_MID: XY[] = [[8.9, -40.1], [16.0, -36.0], [24.0, -30.0], [27.0, -20.0], [27.5, -8.0], [26.0, 8.0], [22.0, 22.0], [16.0, 28.0], [11.4, 30.6], [7.9, 9.0], [5.3, -7.5], [4.8, -18.5], [11.2, -31.4]]

/** The station: its outline (way/266074156) and platform building (way/49884643). */
const STATION: XY[] = [[3.8, -72.4], [5.8, -73.4], [7.4, -70.6], [4.8, -69.4], [6.1, -66.8], [7.8, -67.1], [10.5, -63.2], [9.9, -61.8], [1.0, -57.1], [-4.7, -54.0], [-7.2, -57.9], [-9.4, -56.9], [-9.9, -57.8], [-13.9, -55.8], [-15.3, -58.4], [-10.6, -60.8], [-12.6, -64.0], [-9.4, -65.7]]
const PLATFORM: XY[] = [[-13.9, -55.8], [-9.9, -57.8], [-9.4, -56.9], [-7.2, -57.9], [-0.6, -61.2], [-1.5, -63.0], [6.1, -66.8], [4.8, -69.4], [-2.3, -65.6], [-2.8, -66.4], [-11.2, -62.0], [-10.6, -60.8], [-15.3, -58.4]]
/** The train shed (way/49884638). */
const SHED: XY[] = [[61.8, -33.4], [51.2, -52.2], [41.7, -46.9], [43.8, -43.3], [52.3, -28.1]]
/** Small roofs: the queue entrance (way/470832530) and two at the station. */
const SMALL_ROOFS: XY[][] = [
  [[-7.4, -86.8], [-11.0, -85.2], [-9.4, -81.5], [-5.8, -83.0]],
  [[1.7, -72.2], [1.0, -73.6], [2.9, -74.6], [3.6, -73.3]],
  [[8.5, -62.9], [9.2, -61.5], [6.9, -60.2], [6.2, -61.7]],
]
/** Rainbow Ridge: footprint, wall height, false-front height. */
const TOWN: [XY[], number, number][] = [
  [[[23.9, -52.5], [25.2, -54.7], [28.0, -53.0], [26.7, -50.9]], 5.5, 7.5],               // Big Thunder Saloon
  [[[23.9, -50.1], [24.9, -51.9], [26.7, -50.9], [25.7, -49.2]], 6.0, 7.2],               // Assay Office
  [[[21.4, -42.5], [22.3, -43.1], [21.6, -44.3], [20.2, -43.2]], 4.0, 5.2],               // Big Thunder Epitaph
  [[[21.4, -42.5], [20.2, -43.2], [19.4, -41.4], [20.7, -40.9]], 5.5, 6.8],               // Pan Handle Hotel
  [[[20.0, -40.3], [20.2, -41.1], [19.4, -41.4], [19.1, -40.6]], 3.5, 4.2],
  [[[30.7, -58.6], [28.8, -58.9], [29.0, -60.5], [30.9, -60.2]], 5.5, 6.8],               // El Dorado Hotel
  [[[28.6, -57.0], [28.8, -58.9], [30.7, -58.6], [30.5, -56.8]], 3.8, 4.8],               // Barber Shop
  [[[28.2, -65.6], [29.7, -64.4], [27.8, -62.0], [26.4, -63.3]], 3.8, 4.8],               // General Mercantile
  [[[26.1, -60.8], [27.5, -60.5], [27.8, -62.0], [26.6, -63.1]], 4.5, 5.8],               // Golden Nugget
  [[[28.7, -61.3], [30.2, -63.0], [31.6, -61.4], [30.6, -60.3], [29.7, -60.4]], 4.0, 5.0],
  [[[31.6, -63.4], [30.6, -62.4], [31.9, -61.2], [32.9, -62.2]], 3.5, 4.4],
  [[[12.5, -56.1], [11.6, -58.3], [13.8, -60.2], [14.8, -57.2]], 3.2, 3.2],               // way/109502928
]

// ---------------------------------------------------------------------------
// The track's centreline, resampled every STEP metres with the profile's
// heights, smoothed.

const STEP = 4.0
const STATION_Z = 1.0
type Sample = { x: number; y: number; z: number; s: number; kind: Way['kind'] }
const samples: Sample[] = []
let TRACK_LENGTH = 0
{
  const pts: Sample[] = []
  let s = 0
  for (const w of CIRCUIT) {
    for (let i = 0; i < w.pts.length - 1; i++) {
      const a = w.pts[i], b = w.pts[i + 1], l = Math.hypot(b[0] - a[0], b[1] - a[1])
      const n = Math.max(1, Math.round(l / 0.4))
      for (let k = 0; k < n; k++) {
        const t = k / n
        pts.push({ x: a[0] + (b[0] - a[0]) * t, y: a[1] + (b[1] - a[1]) * t, z: 0, s: s + l * t, kind: w.kind })
      }
      s += l
    }
  }
  TRACK_LENGTH = s
  let next = 0
  for (const p of pts) if (p.s >= next) { samples.push({ ...p, z: zAt(p.s) }); next += STEP }
  for (let pass = 0; pass < 2; pass++) {
    const z = samples.map((q) => q.z), W = 2
    samples.forEach((q, i) => {
      let sum = 0
      for (let k = -W; k <= W; k++) sum += z[(i + k + z.length) % z.length]
      q.z = sum / (2 * W + 1)
    })
  }
}

/** Nearest sample, open or tunnel: distance and the track's height there. */
function nearest(x: number, y: number, tunnel: boolean): [number, number] {
  let best = Infinity, z = 0
  for (const q of samples) {
    if ((q.kind === 'tunnel') !== tunnel) continue
    const d = Math.hypot(q.x - x, q.y - y)
    if (d < best) { best = d; z = q.z }
  }
  return [best, z]
}

// ---------------------------------------------------------------------------
// The rock base: a terraced height field over the rock areas, raised over
// the tunnels and cut down to a ledge under the deck along the open track.

const hash = (i: number, j: number) => { const s = Math.sin(i * 127.1 + j * 311.7) * 43758.5453; return s - Math.floor(s) }
function noise(x: number, y: number, scale: number) {
  const u = x / scale, v = y / scale, i = Math.floor(u), j = Math.floor(v)
  const fu = u - i, fv = v - j, su = fu * fu * (3 - 2 * fu), sv = fv * fv * (3 - 2 * fv)
  const a = hash(i, j), b = hash(i + 1, j), c = hash(i, j + 1), d = hash(i + 1, j + 1)
  return (a * (1 - su) + b * su) * (1 - sv) + (c * (1 - su) + d * su) * sv
}

function baseHeight(x: number, y: number): number {
  const p: XY = [x, y]
  if (inPoly(p, STATION) || inPoly(p, SHED)) return 0
  const [dT, zT] = nearest(x, y, true)
  const cave = inPoly(p, R_CAVE)
  const inside = inPoly(p, R_WEST) || inPoly(p, R_HELIX) || inPoly(p, R_MID) || cave || dT < 5
  if (!inside) return 0
  let h = 2.6 + 3.0 * noise(x + 40, y + 70, 14) + 1.4 * noise(x + 3, y - 9, 6)
  h += 4.5 * Math.max(0, 1 - Math.hypot(x, (y - 6) * 0.7) / 20)  // the summit ridge's shoulders
  if (y > 30) h = Math.min(h, 6.5)                               // the low north end
  if (y < -34) h = Math.min(h, 5.8)                              // the low front wall, seen from the station
  if (cave) h = Math.max(4.6, Math.min(h, 6.0))                  // the coyote cave, 4–5 m in OSM
  h = Math.round(h / 1.3) * 1.3                                  // terraces
  if (dT < 6) h = Math.max(h, zT + 3.5 - Math.max(0, dT - 2.5) * 1.5)
  // Open track: the rock comes up to a ledge just under the deck, and stays
  // clear of it for 4 m either side (a grid cell), then climbs again.
  // Every open stretch nearby counts, not just the nearest: where two cross,
  // the lower one sets the cut.
  for (const q of samples) {
    if (q.kind !== 'open') continue
    const d = Math.hypot(q.x - x, q.y - y)
    if (d < 7.0) h = Math.min(h, Math.max(0, q.z - 0.7) + Math.max(0, d - 3.8) * 2.2)
  }
  return Math.max(0, h)
}

const G = 4.3, GX0 = -36, GY0 = -58, NX = 20, NY = 25
const HF: number[][] = []
for (let j = 0; j <= NY; j++) {
  HF.push([])
  for (let i = 0; i <= NX; i++) HF[j].push(baseHeight(GX0 + i * G, GY0 + j * G))
}
const jx = (i: number, j: number) => (hash(i * 3.1, j * 7.7) - 0.5) * 1.6, jy = (i: number, j: number) => (hash(i * 5.3, j * 2.9) - 0.5) * 1.6
for (let j = 0; j < NY; j++) for (let i = 0; i < NX; i++) {
  const P = (ii: number, jj: number): V3 => [GX0 + ii * G + jx(ii, jj), GY0 + jj * G + jy(ii, jj), HF[jj][ii]]
  const a = P(i, j), b = P(i + 1, j), c = P(i + 1, j + 1), d = P(i, j + 1)
  const pairs: [V3, V3, V3][] = Math.abs(a[2] - c[2]) < Math.abs(b[2] - d[2]) ? [[a, b, c], [a, c, d]] : [[a, b, d], [b, c, d]]
  for (const [p, q, r] of pairs) if (p[2] + q[2] + r[2] > 0.05) rockTri(p, q, r)
}
const groundAt = (x: number, y: number) => {
  const u = (x - GX0) / G, v = (y - GY0) / G
  if (u < 0 || v < 0 || u > NX || v > NY) return 0
  const i = Math.min(NX - 1, Math.floor(u)), j = Math.min(NY - 1, Math.floor(v))
  const fu = u - i, fv = v - j
  return (HF[j][i] * (1 - fu) + HF[j][i + 1] * fu) * (1 - fv) + (HF[j + 1][i] * (1 - fu) + HF[j + 1][i + 1] * fu) * fv
}

// ---------------------------------------------------------------------------
// Hoodoos: columns of stacked, rounded lumps, pinched between, tapering to
// a knobbly crown — Anaheim's Bryce Canyon spires.

type HoodooOpts = { sx?: number; sy?: number; taper?: number; lump?: number; n?: number; z0?: number; pinch?: number }
let hoodooTris = 0
const HOODOOS: { cx: number; cy: number; r: number; h: number; tp: number; sx: number; sy: number; z0: number }[] = []
function hoodoo(cx: number, cy: number, r: number, h: number, o: HoodooOpts = {}) {
  const n = o.n ?? (h > 18 ? 8 : 6), sx = o.sx ?? 1, sy = o.sy ?? 1, z0 = o.z0 ?? 0
  // A round hoodoo turns at random; an elongated one keeps its long axis on
  // the map's x or y as given.
  const rot = sx === sy ? rnd() * TAU : 0
  const flute = Array.from({ length: n }, (_, i) => (i % 2 ? 0.86 : 1.0) * (0.92 + rnd() * 0.16))
  const lump = o.lump ?? (h > 20 ? 4.2 : h > 12 ? 3.8 : 3.4)   // a lump's height
  const lumps = Math.max(2, Math.round((h - z0) / lump))
  const tp = o.taper ?? 0.62
  HOODOOS.push({ cx, cy, r, h, tp, sx, sy, z0 })
  const taper = (t: number) => r * (1 - tp * Math.pow(t, 1.15))
  const rings: V3[][] = []
  let lx = 0, ly = 0
  const ring = (t: number, k: number, z: number): V3[] => {
    const rad = taper(t) * k, spin = (rnd() - 0.5) * 0.5
    return flute.map((f0, i) => {
      // Each ring's corners wander a little in and out, and the ring turns a
      // little, so the lumps read as weathered rock, not a stack of discs.
      const f = f0 * (0.9 + rnd() * 0.2)
      const a = ((i + spin) / n) * TAU
      // An ellipse sx × sy, turned by rot.
      const ex = rad * f * Math.cos(a) * sx, ey = rad * f * Math.sin(a) * sy
      return [cx + lx + ex * Math.cos(rot) - ey * Math.sin(rot), cy + ly + ex * Math.sin(rot) + ey * Math.cos(rot), z]
    })
  }
  rings.push(ring(0, 1.06, z0))
  for (let k = 0; k < lumps; k++) {
    const t0 = k / lumps, t1 = (k + 1) / lumps
    const zb = z0 + t0 * (h - z0), zt = z0 + t1 * (h - z0)
    // The bulge, partway up the lump, then the pinch at its top.
    rings.push(ring(t0 + (t1 - t0) * 0.4, 1.02 + rnd() * 0.08, zb + (zt - zb) * (0.3 + rnd() * 0.25)))
    if (k < lumps - 1) {
      lx += (rnd() - 0.5) * r * 0.1; ly += (rnd() - 0.5) * r * 0.1   // a slight wander
      rings.push(ring(t1, (o.pinch ?? 0.86) + rnd() * 0.06, zt))
    }
  }
  rings.push(ring(1, 0.62, h - 0.4))
  for (let k = 0; k < rings.length - 1; k++) {
    const lo = rings[k], hi = rings[k + 1]
    for (let a = 0; a < n; a++) { const b = (a + 1) % n; rockQuad(lo[a], lo[b], hi[b], hi[a]) }
  }
  const top = rings[rings.length - 1], apex: V3 = [cx + lx, cy + ly, h + 0.2]
  // Crowns catch the light: pale, as the sun-bleached tips are.
  for (let a = 0; a < n; a++) rockTri(top[a], top[(a + 1) % n], apex, pale)
  hoodooTris += n * (2 * (rings.length - 1) + 1)
}

// The summit ridge: a broad lumpy mound under the peak, long north–south,
// the shoulder the spires stand on (OSM's 8 m part way/122634163 rising to
// the unheighted 122634161).
hoodoo(-2.6, 9.0, 8.0, 13.0, { sx: 0.75, sy: 1.6, taper: 0.45, lump: 4.4, n: 8 })
// The peak (OSM's parts: 31, 23, 20 m, stepping north), its flanking spires
// and the shoulder behind. Kept west of x ≈ 4 above 10 m, where the lift 1
// crest run passes along the east face.
hoodoo(-4.6, 3.0, 8.6, 16.5, { sx: 1.1, taper: 0.55, lump: 4.2, n: 8 }) // the peak's broad, knobbly body
hoodoo(-1.8, 0.4, 5.5, 31.0, { taper: 0.8, n: 8 })        // the spire
for (const [x, y, r, h] of [
  [-2.2, 4.0, 4.4, 23.0], [-0.2, 7.0, 4.0, 20.0],          // its northward steps
  [-1.0, 12.0, 3.6, 16.5],
  [-2.6, 15.2, 3.4, 14.5], [-0.8, 19.6, 2.6, 14.0],
  [-6.0, -0.4, 3.0, 19.0], [1.0, -4.4, 2.8, 17.0],          // the flanks either side
  [-7.4, 5.0, 3.2, 14.0],
] as [number, number, number, number][]) hoodoo(x, y, r, h)

// The other clusters, from the photos (mostly taken from the south): each
// a low mound with its spires fused on.
const cluster = (x: number, y: number, r: number, h: number, spires: [number, number, number, number][], sx = 1, sy = 1) => {
  hoodoo(x, y, r, h, { sx, sy, taper: 0.4, lump: 3.6 })
  for (const [dx, dy, rr, hh] of spires) hoodoo(x + dx, y + dy, rr, hh)
}
// The helix rock (OSM 14 m) and the ridge north of it (12 m).
cluster(14.6, -22.0, 3.2, 8.0, [[0, 0.2, 3.0, 14.0], [-1.0, -1.2, 1.8, 12.0], [1.6, 1.4, 1.8, 11.5]])
cluster(21.8, -2.0, 2.8, 6.0, [[1.2, -8.5, 2.2, 12.0], [-0.2, 3.8, 2.0, 10.0]], 0.75, 2.2)
// The crowd: Anaheim's rock is stacks of bulbous hoodoos all along its
// skyline, 9–18 m, not a mesa. Scattered on a jittered grid over the rock,
// each as wide as the open track nearby allows (the ledges stay clear),
// skipping the hand-placed groups above, until the budget is spent.
{
  const placed = HOODOOS.map((o) => ({ x: o.cx, y: o.cy, r: o.r * Math.max(o.sx, o.sy) }))
  const clearance = (x: number, y: number, h: number) => {
    let c = Infinity
    for (const q of samples) {
      if (q.kind !== 'open' || q.z > h + 0.5) continue // a deck above the crown can pass over
      c = Math.min(c, Math.hypot(q.x - x, q.y - y) - 1.0) // the deck's half width
    }
    return c
  }
  const cands: { x: number; y: number; k: number }[] = []
  for (let gy = -50; gy <= 44; gy += 4.5) for (let gx = -32; gx <= 46; gx += 4.5) {
    const x = gx + (hash(gx, gy) - 0.5) * 3.4, y = gy + (hash(gy, gx) - 0.5) * 3.4
    cands.push({ x, y, k: hash(x * 1.7, y * 2.3) })
  }
  // The cave and the lobes either side of the station go first: from above
  // they are the flattest stretches.
  const first = (c: { x: number; y: number }) => inPoly([c.x, c.y], R_CAVE) || c.y < -36
  cands.sort((a, b) => Number(first(b)) - Number(first(a)) || a.k - b.k)
  let budget = 1750, crowd = 0
  for (const { x, y, k } of cands) {
    const p: XY = [x, y]
    if (!(inPoly(p, R_WEST) || inPoly(p, R_HELIX) || inPoly(p, R_MID) || inPoly(p, R_CAVE))) continue
    // Taller in the middle of the site, lower at the front, the north end
    // and over the cave, as the photos and OSM have it.
    // Tallest round the peak, stepping down towards the station so the
    // spire stays the one that stands out.
    const dPeak = Math.hypot(x + 2, y - 4)
    let h = 9 + 9 * k * Math.max(0.3, 1 - dPeak / 45)
    if (y < -24) h = Math.min(h, 11)
    if (y < -36) h = Math.min(h, 8)
    if (y > 30 || inPoly(p, R_CAVE)) h = Math.min(h, 8)
    const r = Math.min(4.6, (clearance(x, y, h) - 0.4) / 1.2)
    if (r < 2.0) continue
    if (placed.some((o) => Math.hypot(o.x - x, o.y - y) < (o.r + r) * 0.75)) continue
    const n = 6, lumps = Math.max(2, Math.round(h / 3.8))
    const cost = n * (4 * lumps - 1)
    if (cost > budget) continue
    budget -= cost
    hoodoo(x, y, r, h, { n, lump: 3.8, taper: 0.5, pinch: 0.76 })
    placed.push({ x, y, r })
    crowd++
  }
  if (process.env.REPORT) console.log('crowd hoodoos', crowd, 'budget left', budget)
}

flushRock(70)

// ---------------------------------------------------------------------------
// The track: a timber deck with two dark rails, along the open stretches;
// timber bents where it stands clear of the rock.

const W = 2.0, DEPTH = 0.45, RAIL = 0.9
const frames = samples.map((q, i) => {
  const a = samples[(i - 1 + samples.length) % samples.length], b = samples[(i + 1) % samples.length]
  const t: V3 = [b.x - a.x, b.y - a.y, b.z - a.z]
  const l = Math.hypot(t[0], t[1]) || 1
  const side: V3 = [t[1] / l, -t[0] / l, 0]
  const up: V3 = [side[1] * t[2] - side[2] * t[1], side[2] * t[0] - side[0] * t[2], side[0] * t[1] - side[1] * t[0]]
  const ul = Math.hypot(...up) || 1
  return { side, up: [up[0] / ul, up[1] / ul, up[2] / ul] as V3 }
})
const at = (i: number, off: number, dz: number): V3 => {
  const q = samples[i], f = frames[i]
  return [q.x + f.side[0] * off, q.y + f.side[1] * off, q.z + dz]
}
let bentEvery = 0
for (let i = 0; i < samples.length; i++) {
  const j = (i + 1) % samples.length
  const s0 = samples[i], s1 = samples[j]
  if (s0.kind === 'tunnel' && s1.kind === 'tunnel') continue
  const f0 = frames[i], f1 = frames[j]
  const out0 = f0.side, out1 = f1.side
  const in0: V3 = [-out0[0], -out0[1], 0], in1: V3 = [-out1[0], -out1[1], 0]
  quad(wood, at(i, -W / 2, 0), at(i, W / 2, 0), at(j, W / 2, 0), at(j, -W / 2, 0), [f0.up, f0.up, f1.up, f1.up])
  // No fascia: at 0.45 m it doesn't read at map distance, and its budget
  // went to the hoodoos.
  void in0; void in1; void out1
  // The rails and ties, as one dark band between pale deck edges: two
  // 0.2 m rails would alias away at map distance.
  quad(rail, at(i, -RAIL / 2, 0.08), at(i, RAIL / 2, 0.08), at(j, RAIL / 2, 0.08), at(j, -RAIL / 2, 0.08), [f0.up, f0.up, f1.up, f1.up])
  // A bent every other sample where the deck stands clear of the rock: two
  // posts and a cap, each a flat double-sided panel across the track.
  const g0 = groundAt(s0.x, s0.y)
  if (s0.z - DEPTH - g0 > 1.2 && bentEvery++ % 4 === 0) { // every 16 m
    const zt = s0.z - DEPTH, p = 0.34
    const panel = (o0: number, o1: number, z0: number, z1: number) => {
      const a = at(i, o0, 0), b = at(i, o1, 0)
      quad(wood, [a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
      quad(wood, [b[0], b[1], z0], [a[0], a[1], z0], [a[0], a[1], z1], [b[0], b[1], z1])
    }
    panel(-W / 2 + 0.05, -W / 2 + 0.05 + p, g0 - 0.2, zt)
    panel(W / 2 - 0.05 - p, W / 2 - 0.05, g0 - 0.2, zt)
    panel(-W / 2 - 0.2, W / 2 + 0.2, zt - 0.4, zt)
    if (zt - g0 > 5) panel(-W / 2, W / 2, g0 + (zt - g0) / 2 - 0.2, g0 + (zt - g0) / 2 + 0.2)
  }
}
// The second station track, level.
for (let i = 0; i < SECOND.length - 1; i++) {
  const a = SECOND[i], b = SECOND[i + 1], l = Math.hypot(b[0] - a[0], b[1] - a[1]), sx = (b[1] - a[1]) / l, sy = -(b[0] - a[0]) / l
  const P = (q: XY, off: number, z: number): V3 => [q[0] + sx * off, q[1] + sy * off, z]
  quad(wood, P(a, -W / 2, STATION_Z), P(a, W / 2, STATION_Z), P(b, W / 2, STATION_Z), P(b, -W / 2, STATION_Z))
  quad(rail, P(a, -RAIL / 2, STATION_Z + 0.08), P(a, RAIL / 2, STATION_Z + 0.08), P(b, RAIL / 2, STATION_Z + 0.08), P(b, -RAIL / 2, STATION_Z + 0.08))
}

// ---------------------------------------------------------------------------
// The station, the shed and Rainbow Ridge.

prism(wood, STATION, 0, STATION_Z - 0.1)                       // the station deck
// The platform building: Anaheim's is the one open-air Big Thunder station,
// so its roof stands on posts over the platform, not on walls.
PLATFORM.forEach(([x, y], i) => {
  if (i % 2) return
  prism(wood, [[x - 0.18, y - 0.18], [x + 0.18, y - 0.18], [x + 0.18, y + 0.18], [x - 0.18, y + 0.18]], STATION_Z - 0.1, 3.6, { top: false })
})
polyRoof(roof, PLATFORM, 3.6, 6.4)
prism(wood, SHED, 0, 4.6, { top: false })
polyRoof(roof, SHED, 4.6, 6.4)
for (const poly of SMALL_ROOFS) {
  for (const [x, y] of poly) prism(wood, [[x - 0.12, y - 0.12], [x + 0.12, y - 0.12], [x + 0.12, y + 0.12], [x - 0.12, y + 0.12]], 0, 2.8, { top: false })
  polyRoof(roof, poly, 2.8, 3.6)
}
for (const [poly, wall, front] of TOWN) {
  prism(wood, poly, 0, wall, { top: false })
  const zr = polyRoof(roof, poly, wall, wall + 1.2, true)
  // The false front: the edge nearest the track or the street, raised as a
  // flat pale board above the eaves.
  let best = -1, bd = Infinity
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length], m: XY = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
    const [d] = nearest(m[0], m[1], false)
    if (Math.hypot(b[0] - a[0], b[1] - a[1]) > 1.2 && d < bd) { bd = d; best = i }
  }
  if (front > wall + 0.3 && best >= 0) {
    const a = poly[best], b = poly[(best + 1) % poly.length]
    const P = (q: XY, z: number): V3 => [q[0], q[1], z]
    quad(pale, P(a, 0), P(b, 0), P(b, front), P(a, front))
    quad(pale, P(b, wall - 0.2), P(a, wall - 0.2), P(a, front), P(b, front))
    void zr
  }
}

// ---------------------------------------------------------------------------

// Anaheim's rock is muted salmon and tan, lighter and pinker than Florida's
// orange: a darker foot, the main salmon, pale tan bands and crowns.
const parts = [
  { part: rust, material: finish('btm-anaheim-foot', 0xb57d62) },
  { part: sand, material: finish('btm-anaheim-rock', 0xcd9c7d) },
  { part: pale, material: finish('btm-anaheim-sandstone', 0xe6c6a8) },
  { part: rail, material: finish('btm-anaheim-rail', 0x5c5049) },
  { part: wood, material: finish('btm-anaheim-timber', 0x9a7a60) },
  { part: roof, material: finish('btm-anaheim-shingle', 0x8d8073) },
]
const triangles = parts.reduce((sum, { part }) => sum + part.triangles, 0)
if (process.env.REPORT) {
  console.log(parts.map(({ part, material }) => `${material.name} ${part.triangles}`).join(', '))
  console.log('hoodoo tris', hoodooTris, 'base tris', rust.triangles + sand.triangles + pale.triangles - hoodooTris)
  console.log('track length', TRACK_LENGTH.toFixed(0), 'samples', samples.length, 'max track z', Math.max(...samples.map((q) => q.z)).toFixed(1))
  const buried = samples.filter((q) => q.kind === 'open' && groundAt(q.x, q.y) > q.z - 0.2)
  console.log('open samples under the rock surface:', buried.map((q) => `${q.s.toFixed(0)}(+${(groundAt(q.x, q.y) - q.z).toFixed(1)})`).join(' '))
  for (const o of HOODOOS) {
    let worst = Infinity, at = 0
    for (const q of samples) {
      if (q.kind !== 'open' || q.z > o.h || q.z < o.z0) continue
      const t = (q.z - o.z0) / (o.h - o.z0)
      // In the ellipse's own units: its radius there, plus the deck's half width.
      const reach = o.r * (1 - o.tp * Math.pow(t, 1.15)) * 1.12 + W / 2 / Math.min(o.sx, o.sy)
      const gap = Math.hypot((q.x - o.cx) / o.sx, (q.y - o.cy) / o.sy) - reach
      if (gap < worst) { worst = gap; at = q.s }
    }
    if (worst < 0) console.log(`hoodoo (${o.cx}, ${o.cy}) h ${o.h} reaches the track at s=${at.toFixed(0)} by ${(-worst).toFixed(1)} m`)
  }
  for (const s of [0, 85, 128, 150, 302, 350, 392, 412, 448, 560, 607, 645, 716, 760]) {
    const q = samples.reduce((b, c) => Math.abs(c.s - s) < Math.abs(b.s - s) ? c : b)
    console.log(`s=${s} (${q.x.toFixed(1)}, ${q.y.toFixed(1)}) z=${q.z.toFixed(1)} ${q.kind} ground ${groundAt(q.x, q.y).toFixed(1)}`)
  }
}
if (triangles > 6500 && !process.env.REPORT) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Big Thunder Mountain Railroad', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 0, elevation: 0, height: 31.2,
})
if (glb.length > 250000 && !process.env.REPORT) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/dlr-big-thunder-mountain.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
