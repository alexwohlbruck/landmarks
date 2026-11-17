/**
 * Mercedes-Benz Stadium, Atlanta (opened 2017, HOK with tvsdesign, Goode Van
 * Slyke, Stanley Beaman & Sears) — original procedural geometry, CC0-1.0.
 * bun generators/atl-mercedes-benz-stadium.ts
 *
 * Map frame: x east, y north, z up, metres, bearing 0. Origin = centroid of
 * OSM way/536744534 (-84.400848, 33.755415). y = 0 is the field, taken as
 * the street level round the building (see Elevation).
 *
 * What makes it recognisable, each drawn as plain geometry:
 * - the roof's eight ETFE petals, drawn CLOSED (as the 2018 lidar, the
 *   2017 Falcons aerial and most photos show the roof): thin white
 *   triangular plates with straight sides, sloping up to the centre where
 *   they meet in a camera-aperture pinwheel; their long outer corners make a
 *   sawtooth edge, each stands just proud of the next along its seam, with a
 *   dark rib line across each (NAIP) and dark seam lines;
 * - the faceted shell: eight nearly plumb sides, each a big inverted triangle of
 *   silver panels between glass triangles that wrap the corners, over a
 *   glazed colonnade; on the north-east side the inverted triangle is the
 *   blue "window to the city";
 * - the fixed roof: eight sloping planes, each stepping up past its
 *   neighbour in a sawtooth that turns the same way as the petals, round a
 *   flat star-shaped plateau and the grey drum the petals sit on;
 * - a darker glazed colonnade band, 12 m, set back 5 m under the shell.
 *
 * Evidence
 * - OSM way/536744534 (building=stadium, height 93, leisure=stadium): the
 *   ground outline, used as the colonnade and the foot of the leaning
 *   facets. No building:part inside it. replaces: the outline only.
 * - USGS 3DEP lidar GA_Statewide_B2_2018 (2018 flight; the roof was closed),
 *   1 m grid, half-size 165 m. Heights above the street round the building
 *   (lidar ground_min + 6.3 m: the ground returns on the north, west and
 *   south sides read 5-7 m; the east plaza deck reads 13 m above it).
 *   Measured: the eave octagon (corners at r 126-145 m, from the edge of the
 *   roof returns); eight roof planes fitted to the points (slopes 21-30°,
 *   residuals 0.1 m except one at 0.75 m), averaged in point-symmetric
 *   pairs; their eaves run from about 59-60 m at one end to 71-74 m at the
 *   other; the step lines where each plane drops below the next (traced
 *   along the drop, 13-23 points each); the flat plateau at 80.0 m; the
 *   closed petals' shallow cone, 96 m at the centre and 89-93 m over the rim
 *   at r 60-65 m. Between the eave and the first ground returns there is a
 *   4-14 m band with no returns (glass) or, on the east, returns sloping
 *   down outwards, which would mean the faces lean in; NAIP's west wall
 *   band (about 12 m wide in plan where relief alone gives 18 m) and the
 *   photos (p05, p22: plumb corners, the colonnade tucked under the facets)
 *   say they stand plumb with the eave the widest line. The model follows
 *   the photos and NAIP: feet 2 m inside the eave corners and 2 m outside
 *   the eave line mid-side, the colonnade set back 5 m under a soffit. A
 *   doubt.
 * - USGS NAIP orthophoto (public domain), 0.41 m/px, roof open: the oculus,
 *   r 53-58 m (dark disc), its centre displaced 24 m east by relief at
 *   about 85 m; the north-east petal traced (relief-corrected for 88 m):
 *   tip (-7, 60), outer corners (47, 91) and (56, 53); the dark band across
 *   each petal about 60% of the way out; the field's long axis about 86°.
 * - Published: eight translucent triangular panels (Wikipedia); petals
 *   220 ft long, each moving in a straight line at 45° to the next, opening
 *   or closing in about 8 minutes (Yahoo Sports, TFC Stadiums); halo board
 *   58 ft by 1,100 ft round, so 106.7 m across (Wikipedia); window to the
 *   city "more than 16 stories" (WSB-TV); oculus "about 120 m" (TFC
 *   Stadiums; NAIP gives 106-116 m, used).
 * - Atlanta Falcons, "Mercedes-Benz Stadium roof animation 1.gif" and "...2.gif"
 *   (Wikimedia Commons, CC BY 3.0): the petals' closed and open positions
 *   from above and the drum; the closed pose drawn here (eight triangles
 *   meeting at the centre, the drum under them) follows their closed frames.
 * - Photos (Wikimedia Commons), compared against renders from their sides:
 *   "View of Mercedes-Benz Stadium from Centennial Olympic Park Drive.jpg"
 *   and "Mercedes-Benz Stadium, Atlanta, Georgia, United States.jpg"
 *   (Gatorfan252525, CC BY-SA 4.0; from the north-east: the window to the
 *   city between glass corner triangles, the star face to its left and the
 *   script face to its right, the roof planes and drum above);
 *   "Mercedes-Benz Stadium, July 2018.jpg" and "Mercedes-Benz Stadium, Jan
 *   2018.jpg" (Thomson200, CC0; the north side: an inverted metal triangle
 *   between glass, the colonnade); "Mercedes-Benz Stadium, December
 *   2024.jpg" (BullDawg2021, CC BY 4.0; from the Backyard to the north: the
 *   glass corner triangle between two metal faces, the dark drum above);
 *   "Mercedes Benz Stadium time lapse capture 2017-08-13.jpg" (Atlanta
 *   Falcons, CC BY 3.0; aerial from the east, roof closed: facet layout,
 *   colonnade, roof planes, the drum's walls); "Mercedes-Benz Stadium,
 *   Atlanta, GA (46558862115, 47474210031, 46558862035, 33597623348,
 *   46558861755, 46558862255, 46558862285).jpg" and "Mercedes-Benz Stadium
 *   from Mitchell Street, Atlanta, GA (32532865367).jpg" (Warren LeMay,
 *   CC0; the window to the city close up, its panel grid); "Mercedes-Benz
 *   Stadium (39440363871, 24574216017, 27663349999).jpg" and "Mercedes-Benz
 *   Stadium with the Georgia Dome remains (38562120085).jpg" (elisfkc,
 *   CC BY-SA 2.0; north and north-west sides); "Mercedes-Benz Stadium Roof
 *   Atlanta United 2018-10-21 - 17 14.jpg" (Eric.Jason.Cross, CC BY-SA 4.0)
 *   and "Mercedes-Benz Stadium Interior in 2024.jpg" (BullDawg2021, CC BY
 *   4.0): the halo under the oculus, red seats in three tiers.
 * - Mapterhorn terrain: 7-8 m over 302.35 m and nearly flat under the
 *   footprint; rising to 12-17 m outside the south-east and north-east
 *   corners (the Mitchell Street ramp and the east plaza).
 *
 * Elevation: 0. The brief expected the field below the street on the south
 * and west; no published field level or section was found, and the lidar
 * shows the streets on the north, west and south sides level with each other
 * (5-7 m above ground_min), so the field is taken at that street level. The
 * east plaza stands about 7 m higher (lidar), so the east colonnade's foot is
 * behind the plaza deck. A doubt; correct it if a section turns up.
 *
 * Drawn bolder than measured, for the map view (lead review): the petals'
 * outer edges reach 60-88 m from the centre, past the closed rim the lidar
 * shows at 60-65 m, so the petal ring spans about 60% of the roof as the
 * open ring does in NAIP; the rib lines are thicker than the real ones.
 *
 * Estimated: colonnade top 12 m (photos: about a fifth of the facade);
 * which sides' centre faces are glass (only the north-east, the window to
 * the city, from the Gatorfan252525, LeMay and time-lapse photos; the
 * others are metal, carrying the star or the script, which are not drawn);
 * the drum (exactly under the petals' edges, grey walls from the plateau,
 * from the time-lapse photo and the lidar rim); the 1.2 m step between
 * petals; the 3 m outward bulge of each petal's outer edge.
 * The halo board and the seating bowl are inside the closed roof and are
 * not drawn.
 * Invented: the transoms on the window to the city (three pale lines for
 * its panel grid, per STYLE.md).
 * Not drawn: the field (the map's), the Mercedes star and lettering, the
 * falcon sculpture, the pedestrian bridges, the masts.
 *
 * Night: the glass (corner triangles, colonnade, window to the city) is
 * `window*`, lit concourses behind it. No licensed night photo was found.
 *
 * Look-only references: none used.
 * Doubts: field level (above); the petals' outline (their axes from the
 * NAIP trace of one open petal, repeated at 45°; the outer reach drawn
 * past the lidar rim on purpose); NAIP shows the roof open, the model shows
 * it closed; the west and south-west sides have few close photos.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'

type XY = [number, number]

// ---------------------------------------------------------------- frame
// Anchor: centroid of OSM way/536744534. Bearing 0 (true north frame).
const ANCHOR = { lng: -84.400848, lat: 33.755415 }
// The lidar/NAIP grids were read about (-84.40085, 33.75541); points read
// there are shifted by this to the anchor frame.
const OFF: XY = [0.17, 0.53]
const sh = (p: XY): XY => [p[0] - OFF[0], p[1] - OFF[1]]

// ---------------------------------------------------------------- helpers
const sub3 = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const cross3 = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const dot3 = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
function triTo(p: Part, a: V3, b: V3, c: V3, want: V3) {
  const n = cross3(sub3(b, a), sub3(c, a))
  if (Math.hypot(...n) < 1e-6) return
  if (dot3(n, want) >= 0) p.tri(a, b, c)
  else p.tri(a, c, b)
}
function quadTo(p: Part, a: V3, b: V3, c: V3, d: V3, want: V3) {
  triTo(p, a, b, c, want)
  triTo(p, a, c, d, want)
}
const area2 = (poly: XY[]) => poly.reduce((s, p, i) => { const q = poly[(i + 1) % poly.length]; return s + p[0] * q[1] - q[0] * p[1] }, 0) / 2
/** Ear clipping of a simple ring (either winding). */
function triangulate(poly: XY[]): [number, number, number][] {
  const ccwRing = area2(poly) > 0
  const idx = poly.map((_, i) => i)
  if (!ccwRing) idx.reverse()
  const out: [number, number, number][] = []
  const cr = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inside = (p: XY, a: XY, b: XY, c: XY) => cr(a, b, p) > 1e-9 && cr(b, c, p) > 1e-9 && cr(c, a, p) > 1e-9
  let guard = 0
  while (idx.length > 3 && guard++ < 10000) {
    let clipped = false
    for (let k = 0; k < idx.length; k++) {
      const i0 = idx[(k + idx.length - 1) % idx.length], i1 = idx[k], i2 = idx[(k + 1) % idx.length]
      const a = poly[i0], b = poly[i1], c = poly[i2]
      if (cr(a, b, c) <= 1e-9) continue
      if (idx.some((j) => j !== i0 && j !== i1 && j !== i2 && inside(poly[j], a, b, c))) continue
      out.push([i0, i1, i2]); idx.splice(k, 1); clipped = true; break
    }
    if (!clipped) idx.splice(1, 1)
  }
  if (idx.length === 3) out.push([idx[0], idx[1], idx[2]])
  return out
}
/** A planar polygon in 3D, triangulated in its plan (or side) projection, facing `want`. */
function face(p: Part, pts: V3[], want: V3) {
  // project on the plane most perpendicular to want
  const ax = [Math.abs(want[0]), Math.abs(want[1]), Math.abs(want[2])]
  const k = ax[2] >= ax[0] && ax[2] >= ax[1] ? 2 : ax[0] >= ax[1] ? 0 : 1
  const uv: XY[] = pts.map((q) => (k === 2 ? [q[0], q[1]] : k === 0 ? [q[1], q[2]] : [q[0], q[2]]))
  for (const [a, b, c] of triangulate(uv)) triTo(p, pts[a], pts[b], pts[c], want)
}
const at = (p: XY, z: number): V3 => [p[0], p[1], z]
const lerp2 = (a: XY, b: XY, t: number): XY => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
const P = (azDeg: number, r: number): XY => { const t = (azDeg * Math.PI) / 180; return [Math.sin(t) * r, Math.cos(t) * r] }

// ---------------------------------------------------------------- parts
const silver = new Part() // metal panel shell, roof, step faces, drum
const glassW = new Part() // glass: the big corner triangles
const baseW = new Part() // the glazed colonnade, a darker band under the shell
const cityW = new Part() // the "window to the city" (blue-tinted)
const etfe = new Part() // the eight roof petals
const dark = new Part() // the drum's dark metal walls, the petals' rib lines

// ---------------------------------------------------------------- measured data
// Eave octagon (lidar, clockwise from the north-north-east corner).
const B: XY[] = ([[49.7, 119.9], [131.9, 59.4], [133.1, -36.3], [64.3, -107.9], [-49.7, -119.9], [-131.9, -59.4], [-133.1, 36.3], [-64.3, 107.9]] as XY[]).map(sh)
// The eight sloping roof planes, z = a x + b y + c in the lidar frame
// (heights above the street), fitted to the lidar, made point-symmetric.
const PL0: [number, number, number][] = [[-0.1528, -0.4053, 115.375], [-0.5234, -0.1711, 137.47], [-0.3505, 0.1634, 112.375], [-0.1731, 0.4922, 123.465], [0.1528, 0.4053, 115.375], [0.5234, 0.1711, 137.47], [0.3505, -0.1634, 112.375], [0.1731, -0.4922, 123.465]]
const PL = PL0.map(([a, b, c]) => [a, b, c + a * OFF[0] + b * OFF[1]] as [number, number, number])
const pz = (i: number, p: XY) => { const [a, b, c] = PL[((i % 8) + 8) % 8]; return a * p[0] + b * p[1] + c }
// The step lines: where each plane drops below its neighbour (point, direction).
const LN0: [number, number, number, number][] = [[59.8143, 89.7274, 0.2054, -0.9787], [116.3784, 31.7655, 0.6236, 0.7817], [100.885, -46.1049, 0.9783, 0.207], [31.3225, -95.5393, 0.8878, -0.4601], [-59.8143, -89.7274, 0.2054, -0.9787], [-116.3784, -31.7655, 0.6236, 0.7817], [-100.885, 46.1049, 0.9783, 0.207], [-31.3225, 95.5393, 0.8878, -0.4601]]
const LN = LN0.map(([x, y, dx, dy]) => [x - OFF[0], y - OFF[1], dx, dy] as [number, number, number, number])
const PLATEAU = 80 // the flat fixed roof around the drum (lidar 80.0 m)

// OSM way/536744534, in the anchor frame (counter-clockwise from above).
const OSM: XY[] = [[-20.34, 127.85], [-76.11, 106.18], [-114.49, 78.62], [-122.68, 72.19], [-142.59, 27.06], [-150.64, -25.86], [-132.16, -61.06], [-131.53, -65.9], [-93.57, -109.54], [-41.48, -125.88], [20.35, -127.73], [75.02, -106.41], [122.82, -72.16], [126.64, -61.14], [142.93, -26.34], [150.08, 25.3], [132.87, 65.27], [95.58, 108.9], [44.38, 122.54], [41.33, 125.13]]

const COLONNADE = 12 // top of the glazed ground-floor colonnade
const LEAN_IN = 2, MID_OUT = 2 // facet feet relative to the eave plan (m)

// ---------------------------------------------------------------- roof geometry
const lineAt = (i: number, h: number, plane: number): XY => {
  const [x, y, dx, dy] = LN[i % 8]
  const [a, b, c] = PL[((plane % 8) + 8) % 8]
  const t = (h - c - a * x - b * y) / (a * dx + b * dy)
  return [x + dx * t, y + dy * t]
}
const segLine = (i: number, p: XY, q: XY): XY => {
  const [x, y, dx, dy] = LN[i % 8]
  const ex = q[0] - p[0], ey = q[1] - p[1]
  const den = dx * -ey - dy * -ex
  const s = (dx * (p[1] - y) - dy * (p[0] - x)) / den
  return lerp2(p, q, s)
}
// P_i: where step line i meets the eave (just clockwise of corner i).
const Pst: XY[] = B.map((_, i) => segLine(i, B[i], B[(i + 1) % 8]))
const E: XY[] = B.map((_, i) => lineAt(i, PLATEAU, i)) // plane i reaches the plateau on line i
const T: XY[] = B.map((_, i) => lineAt(i, PLATEAU, i - 1)) // plane i-1 reaches the plateau on line i

for (let i = 0; i < 8; i++) {
  const j = (i + 1) % 8
  // sloping plane i: P_i → B_{i+1} → P_{i+1} → T_{i+1} → E_i
  const poly: V3[] = [at(Pst[i], pz(i, Pst[i])), at(B[j], pz(i, B[j])), at(Pst[j], pz(i, Pst[j])), at(T[j], PLATEAU), at(E[i], PLATEAU)]
  face(silver, poly, [0, 0, 1])
  // step face along line i: low side plane i, high side plane i-1 (to the plateau)
  const [, , dx, dy] = LN[i]
  // normal toward plane i's side (clockwise side of the line from the eave inwards)
  let nrm: V3 = [-dy, dx, 0]
  // plane i's region holds corner i+1
  if (nrm[0] * (B[j][0] - Pst[i][0]) + nrm[1] * (B[j][1] - Pst[i][1]) < 0) nrm = [dy, -dx, 0]
  face(silver, [at(Pst[i], pz(i, Pst[i])), at(E[i], PLATEAU), at(T[i], PLATEAU), at(Pst[i], pz(i - 1, Pst[i]))], nrm)
}

// ---------------------------------------------------------------- facade
// Base corners: the OSM vertex nearest each eave corner by bearing.
const azOf = (p: XY) => ((Math.atan2(p[0], p[1]) * 180) / Math.PI + 360) % 360
const corner = B.map((b) => {
  let best = 0, bd = 1e9
  OSM.forEach((o, k) => { let d = Math.abs(azOf(o) - azOf(b)); d = Math.min(d, 360 - d); if (d < bd) { bd = d; best = k } })
  return best
})
const N_OSM = OSM.length
// The window to the city faces downtown, on the north-east side (side 0).
const CITY_SIDE = 0
const eaveTop = (i: number): V3 => at(B[i], pz(i - 1, B[i])) // corner i, plane i-1's high end
const foot: XY[] = [] // the facets' feet: corner, centre, corner, ... (clockwise)
for (let i = 0; i < 8; i++) {
  const j = (i + 1) % 8
  // base chain clockwise = decreasing OSM index
  const chain: XY[] = []
  for (let k = corner[i]; ; k = (k - 1 + N_OSM) % N_OSM) { chain.push(OSM[k]); if (k === corner[j]) break }
  // M: the base point that stands furthest out from the eave line
  const e0 = B[i], e1 = B[j]
  const ex = e1[0] - e0[0], ey = e1[1] - e0[1], el = Math.hypot(ex, ey)
  // B runs clockwise seen from above, so outward is to the left of e0→e1
  const ou: XY = [-ey / el, ex / el]
  const dist = (p: XY) => (p[0] - e0[0]) * ou[0] + (p[1] - e0[1]) * ou[1]
  let m = 1
  for (let k = 1; k < chain.length - 1; k++) if (dist(chain[k]) > dist(chain[m])) m = k
  const out: V3 = [ou[0], ou[1], 0.3]
  const bot = (p: XY) => at(p, COLONNADE)
  // The facets stand nearly plumb: their feet are drawn on the eave's own
  // plan (corners 2 m in, the centre foot 2 m out where OSM's mid-side
  // vertex projects onto the eave line), so the eave is the widest line and
  // the colonnade tucks in under it (p05, p22, and NAIP's wall band; see the
  // header for the lidar's conflicting hint of a lean).
  const cIn = (b: XY): XY => { const r = Math.hypot(b[0], b[1]); return [b[0] * (1 - LEAN_IN / r), b[1] * (1 - LEAN_IN / r)] }
  const mo = chain[m]
  const tt = Math.min(0.85, Math.max(0.15, ((mo[0] - e0[0]) * ex + (mo[1] - e0[1]) * ey) / (el * el)))
  const footM: XY = [e0[0] + ex * tt + ou[0] * MID_OUT, e0[1] + ey * tt + ou[1] * MID_OUT]
  chain[0] = cIn(B[i]); chain[chain.length - 1] = cIn(B[j]); chain[m] = footM
  // left half of corner diamond i (glass): one flat triangle from the eave
  // corner down to the corner and centre feet (the OSM chamfer points between
  // are dropped so each facet is a single crisp plane)
  const tl = eaveTop(i)
  triTo(glassW, tl, bot(chain[0]), bot(chain[m]), out)
  foot.push(chain[0], chain[m])
  // the sliver between the corner and the step, and the step's jog (glass)
  const pHi = at(Pst[i], pz(i - 1, Pst[i])), pLo = at(Pst[i], pz(i, Pst[i]))
  // (on the window to the city these belong to the window, which spans the eave)
  const sl = i === CITY_SIDE ? cityW : glassW
  triTo(sl, bot(chain[m]), tl, pHi, out)
  triTo(sl, bot(chain[m]), pHi, pLo, out)
  // the centre: an inverted triangle from the colonnade up to the eave
  triTo(i === CITY_SIDE ? cityW : silver, bot(chain[m]), pLo, at(B[j], pz(i, B[j])), out)
  if (i === CITY_SIDE) {
    // a few pale transoms across the window, parallel to its top edge (p05)
    const apex = bot(chain[m]), r = at(B[j], pz(i, B[j]))
    const nn = cross3(sub3(pLo, apex), sub3(r, apex)), nl = Math.hypot(...nn)
    const o: V3 = [(nn[0] / nl) * 0.08, (nn[1] / nl) * 0.08, (nn[2] / nl) * 0.08]
    const sgn = dot3(nn, out) >= 0 ? 1 : -1
    const L = (a: V3, b: V3, t: number): V3 => [a[0] + (b[0] - a[0]) * t + o[0] * sgn, a[1] + (b[1] - a[1]) * t + o[1] * sgn, a[2] + (b[2] - a[2]) * t + o[2] * sgn]
    for (const t of [0.36, 0.6, 0.82]) {
      const w = 0.7 / (pz(i, B[j]) - COLONNADE) // band height as a fraction
      const t0 = t - w / 2, t1 = t + w / 2
      quadTo(silver, L(apex, pLo, t0), L(apex, r, t0), L(apex, r, t1), L(apex, pLo, t1), out)
    }
  }
  // right half of corner diamond i+1
  const tr = at(B[j], pz(i, B[j]))
  triTo(glassW, tr, bot(chain[m]), bot(chain[chain.length - 1]), out)
}
// The colonnade: glazed, vertical, set back 5 m under the facets' feet, with
// a dark soffit between (p22, p05: the colonnade is tucked in under the shell).
const SETBACK = 5
const footIn = foot.map((p): XY => { const r = Math.hypot(p[0], p[1]); return [p[0] * (1 - SETBACK / r), p[1] * (1 - SETBACK / r)] })
for (let k = 0; k < foot.length; k++) {
  const l = (k + 1) % foot.length
  const a = footIn[k], b = footIn[l], m = lerp2(a, b, 0.5)
  quadTo(baseW, at(a, 0), at(b, 0), at(b, COLONNADE), at(a, COLONNADE), [m[0], m[1], 0])
  quadTo(dark, at(footIn[k], COLONNADE), at(footIn[l], COLONNADE), at(foot[l], COLONNADE), at(foot[k], COLONNADE), [0, 0, -1])
}

// ---------------------------------------------------------------- the closed roof
// Drawn closed, as the 2018 lidar, the 2017 Falcons aerial and most photos
// show it: eight ETFE petals meeting at the centre in a camera-aperture
// pinwheel, a low dome. Each petal is a thin plate sloping up from its outer
// edge to the 96-97 m centre (lidar: 96 m at the centre, 89-93 m over the
// rim at r 60-65 m). Its two side edges are straight (radial, 45° apart; axis
// bearing 80° + 45° k from the NAIP trace) and its outer edge runs nearly
// straight, a little convex, from 60 m out at the counter-clockwise corner to
// 88 m at the clockwise one: a skewed triangle whose long corner overlaps
// the next petal, so the ring's edge is a sawtooth turning the same way as
// the roof planes. Each petal sits 1.2 m above the next along their seam.
// The drum under them follows their outline exactly, its grey walls rising
// from the plateau to each petal's edge, so nothing overhangs.
const PETAL_AXIS0 = 80, R_LO = 60, R_HI = 88, PETAL_STEP = 1.2
const NSEG = 6 // segments along each petal's outer edge
const zTop = (r: number, f: number) => 96.5 - 0.1 * r + PETAL_STEP * (f - 0.5) // f: 0 ccw side → 1 cw side
const drumRing: XY[] = [], drumZ: number[] = []
for (let i = 0; i < 8; i++) {
  const th = PETAL_AXIS0 + i * 45
  const ang = (f: number) => th - 22.5 + 45 * f
  const A = P(ang(0), R_LO), C = P(ang(1), R_HI)
  const nrm = P(th, 1) // outward bulge direction
  const outline: XY[] = [], zs: number[] = [], fs: number[] = []
  for (let k = 0; k <= NSEG; k++) {
    const t = k / NSEG, bulge = 3 * Math.sin(Math.PI * t)
    const p: XY = [A[0] + (C[0] - A[0]) * t + nrm[0] * bulge, A[1] + (C[1] - A[1]) * t + nrm[1] * bulge]
    // f: the point's angular position across the petal
    let da = azOf(p) - ang(0); da = ((da % 360) + 360) % 360; if (da > 180) da -= 360
    const f = Math.min(1, Math.max(0, da / 45))
    outline.push(p); fs.push(f); zs.push(zTop(Math.hypot(p[0], p[1]), f))
    drumRing.push(k === 0 ? P(ang(0) + 0.3, R_LO) : k === NSEG ? P(ang(1) - 0.3, R_HI) : p)
    drumZ.push(zs[k])
  }
  const Oc: V3 = [0, 0, 96.5]
  for (let k = 0; k < NSEG; k++) triTo(etfe, Oc, at(outline[k], zs[k]), at(outline[k + 1], zs[k + 1]), [0, 0, 1])
  // the seam face where this petal's clockwise edge stands above the next one
  {
    const e = outline[NSEG], side = P(ang(1) + 90, 1)
    const below = (r: number) => zTop(r, 0) // the next petal's ccw edge
    const rIn = R_LO // beyond this the drum wall carries it
    const pr = (r: number) => P(ang(1), r)
    quadTo(etfe, at(pr(0.01), below(0)), at(pr(rIn), below(rIn)), at(pr(rIn), zTop(rIn, 1)), [0, 0, zTop(0, 1)], [side[0], side[1], 0])
    void e
  }
  // the dark rib line across each petal (NAIP), parallel to its outer edge
  for (const g of [0.66]) {
    const w = 0.045
    const q = (t: number, gg: number): V3 => { const p = outline[0]; const k = t * NSEG, k0 = Math.min(NSEG - 1, Math.floor(k)); const pp = lerp2(outline[k0], outline[k0 + 1], k - k0); void p; const r = Math.hypot(pp[0], pp[1]) * gg; const a2 = azOf(pp); const f = fs[k0] + (fs[k0 + 1] - fs[k0]) * (k - k0); return at(P(a2, r), zTop(r, f) + 0.08) }
    for (let k = 0; k < NSEG; k++) {
      const t0 = 0.03 + (0.94 * k) / NSEG, t1 = 0.03 + (0.94 * (k + 1)) / NSEG
      face(dark, [q(t0, g), q(t1, g), q(t1, g + w), q(t0, g + w)], [0, 0, 1])
    }
  }
  // the seam line along the clockwise edge
  {
    const s0 = P(ang(1), 1), nn = P(ang(1) - 90, 1), w = 1.4
    const pt = (r: number, o: number): V3 => [s0[0] * r + nn[0] * o, s0[1] * r + nn[1] * o, zTop(r, 1) + 0.09]
    face(dark, [pt(4, 0), pt(R_HI - 0.5, 0), pt(R_HI - 0.5, w), pt(4, w)], [0, 0, 1])
  }
}
// the drum: grey metal walls from the plateau up to the petals' edges (p22)
for (let k = 0; k < drumRing.length; k++) {
  const l = (k + 1) % drumRing.length
  const a = drumRing[k], b = drumRing[l]
  const m = lerp2(a, b, 0.5), t: XY = [b[0] - a[0], b[1] - a[1]]
  let n: V3 = [t[1], -t[0], 0]
  if (n[0] * m[0] + n[1] * m[1] < 0) n = [-n[0], -n[1], 0]
  // on the radial step the wall faces the lower petal's side (counter-clockwise of the seam is above)
  const step = Math.hypot(t[0], t[1]) > 20
  if (step) { const sd = P(azOf(m) + 90, 1); n = [sd[0], sd[1], 0] }
  // on the step the wall runs up to the upper petal's edge all the way in
  const zb = step ? zTop(R_LO, 1) : drumZ[l]
  quadTo(silver, at(a, PLATEAU), at(b, PLATEAU), at(b, zb), at(a, drumZ[k]), n)
}
// the plateau: the 16-point star [T0,E0,T1,E1,...] round the drum, stitched by bearing
{
  const star: XY[] = []
  for (let i = 0; i < 8; i++) { star.push(T[i]); star.push(E[i]) }
  const pts = [...star.map((p) => ({ p, az: azOf(p), o: true })), ...drumRing.map((p) => ({ p, az: azOf(p), o: false }))].sort((a, b) => a.az - b.az)
  let lastO = pts[0], lastI = pts[0]
  for (const q of pts) if (q.o) lastO = q; else lastI = q
  for (const q of pts) {
    if (q.o) { triTo(silver, at(lastO.p, PLATEAU), at(q.p, PLATEAU), at(lastI.p, PLATEAU), [0, 0, 1]); lastO = q }
    else { triTo(silver, at(lastI.p, PLATEAU), at(q.p, PLATEAU), at(lastO.p, PLATEAU), [0, 0, 1]); lastI = q }
  }
}

// ---------------------------------------------------------------- write
const parts = [
  { part: silver, material: finish('mbs-silver', 0xc9ccd0, 0.6) },
  { part: baseW, material: { ...PALETTE.window, color: 0x5d6e7e } },
  { part: glassW, material: windowVariant(2, 0x8297ab) },
  { part: cityW, material: windowVariant(3, 0x5d84b9) },
  { part: etfe, material: finish('mbs-etfe', 0xf3f5f6, 0.5) },
  { part: dark, material: finish('mbs-dark', 0x555b64, 0.6) },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
console.log(parts.map((p) => `${p.material.name} ${p.part.triangles}`).join(', '))
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const HEIGHT = 98
const glb = writeGlb('Mercedes-Benz Stadium', parts, {
  license: 'CC0-1.0', bearing: 0, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: HEIGHT,
  frame: 'Y up, -Z north, +X east, metres; origin at the OSM centroid on the street/field level',
  replaces: ['way/536744534'],
})
if (glb.length > 250000) throw new Error(`File budget exceeded: ${glb.length}`)
const outPath = new URL('../models/atl-mercedes-benz-stadium.glb', import.meta.url).pathname
await Bun.write(outPath, glb)
console.log(`${outPath}: ${triangles} triangles, ${glb.length} bytes`)
