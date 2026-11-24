/**
 * Estadio Santiago Bernabéu, Madrid, as rebuilt in 2019-2024 (GMP
 * Architekten, L35, Ribas & Ribas): original procedural geometry, CC0-1.0.
 * bun generators/madrid-santiago-bernabeu.ts
 *
 * Modelled as it stands since the 2024 reopening: the stainless-steel
 * ribbon skin wrapping the old bowl, running on unbroken over the shoulder
 * into the fixed roof, the roof's rectangular opening over the pitch (the
 * retractable roof shown open and parked, as in the orthophoto), the 360°
 * video ring hanging under the opening's edge, three tiers of blue seats.
 *
 * Identity, in order (with the photo that shows it):
 *  1. the silver skin of horizontal steel ribbons, a near-vertical wall
 *     that rolls over into the roof (Zaqarbal, west facade; MottaW a, c);
 *  2. the open louvres of its lower third, darker, over a dark glazed
 *     ground floor set back under the skin (MottaW b, c; Zaqarbal);
 *  3. the rounded-rectangle plan with the east side's flared skirt
 *     (PNOA orthophoto; OSM; MottaW b);
 *  4. the roof's rectangular opening over the pitch with the parked
 *     retractable trusses at its ends (PNOA; dom fellowes);
 *  5. the 360° video ring under the opening's edge, deeper at the ends,
 *     and the blue three-tier bowl (Daniel from Glasgow; Badefa; Zoser).
 *
 * Frame: built turned to the pitch, BEARING 4.25 (the pitch's long sides
 * in OSM way/1446479375): x across the pitch (east), y along it (north),
 * z up, metres. Origin = the area centroid of the OSM outline way/1507411898
 * (40.4530548, -3.6882858); the centre spot is at (-5.8, -0.8). y = 0 is the
 * pitch. `elevation` 0: the map's terrain already holds the bowl (the pitch
 * 6 m below the street to the south, 12 m to the north, about 10 m on
 * Castellana to the west), as at Camp Nou.
 *
 * Evidence
 * - OSM (ODbL): way/1507411898 (leisure=stadium "Bernabéu", Q164027), the
 *   outer of relation/21041481 (building=stadium); the pitch way/1446479375
 *   (covered, 70 x 104 m with its run-off). The outline in this frame: west
 *   side x -113, south y -109, north y +109.6, the east side's skirt out to
 *   x +128.6 at y +10.
 * - PNOA orthophoto (IGN / CNIG, pnoa-ma WMS, CC BY 4.0), flown during the
 *   works with the skin and the fixed roof in place: the plan; the roof's
 *   concentric ribbons; the opening (x -44..+33, y +-54 about the anchor,
 *   corners rounded about 8 m); the white parked trusses at its north and
 *   south ends; the east skirt, a lower surface flaring out beyond the
 *   roof's straight east edge (x about +102).
 * - Published (es.wikipedia "Estadio Santiago Bernabéu"): total height 60 m;
 *   a 28,000 m² fixed roof and an 8,000 m² retractable roof (12 moving
 *   trusses, PTFE cushions lit by LEDs when closed); the skin of curved
 *   stainless-steel strips that "light up in different colours and
 *   designs"; the 360° video ring 6.5 m deep on the sides and corners and
 *   11 m at the ends, its screens tilted 8° (a truncated cone); the pitch
 *   in six trays stored in a 30 m deep hypogeum (not visible).
 * - Mapterhorn terrain (bun tools/terrain.ts grid): pitch at 0, the streets
 *   round it at 6 (south) to 12 (north) above it.
 * - Photos (Wikimedia Commons, all EVIDENCE):
 *   - "Estadio Santiago Bernabéu 39.jpg", Luis García (Zaqarbal), CC BY-SA
 *     4.0: the west facade on Castellana; proportions of the glazed ground
 *     floor (about a fifth of the wall), the darker lower louvres, the
 *     silver ribbons, the white rim line and the grey roof above it.
 *   - "M-estadio-santiago-bernabeu-diciembre-2024-a.jpg", -b, -c, MottaW,
 *     CC BY 4.0: the north-west corner (a), the east skirt flaring out over
 *     the louvres (b), the curved soffit under the skin and the louvred
 *     lower third (c).
 *   - "Estadio Santiago Bernabeu (53988716884).jpg", "(53988637723)",
 *     "(53987507417)", "(53988406201)", Daniel from Glasgow, CC BY 2.0: the
 *     bowl, three tiers of blue seats, the video ring, the white roof
 *     trusses.
 *   - "Mavidad Bernabéu 2025.jpg", Badefa, CC0: the bowl and the ring.
 *   - "Estadio Santiago Bernabéu Madrid.jpg", Zoser, CC BY 4.0: the ring
 *     lit in a match, the roof trusses.
 *   - "New Roof (52738870203).jpg", dom fellowes, CC BY 2.0: the
 *     retractable trusses.
 *   No look-only sources, no commercial imagery, no 3D tiles. No lidar in
 *   Spain is used.
 *
 * Numbers. Plan from OSM and the orthophoto (measured). Heights are
 * estimates scaled from the Zaqarbal photo, fitted to the published 60 m:
 * the glazed ground floor to 19 above the pitch (9 m over Castellana); the
 * skin 19-46 nearly vertical, rolling over to the white rim at 57.3 (about
 * 47 m above Castellana); the roof rising to 64 at the opening (about 54 m
 * over the street; 58 m over the lowest street to the south). The bowl's
 * tiers (to 15, 31 and 52) are estimated from the interior photos. Colours
 * from the daylight photos, pulled to the palette's lightness.
 *
 * Night: the skin's built-in lighting is drawn as floodlight on the steel
 * (no licensed night photo of the new skin was found, so its colour is
 * left to the day colour); the glazed ground floor and the gaps behind the
 * louvres are `window`; the video ring is `neon-videoboard`, in a Real
 * Madrid blue.
 *
 * Simplified or left out: the individual ribbons (drawn as bold stepped
 * bands about 4 m apart, not the real ~1 m strips) and their twists; the
 * retractable roof is open (the PNOA state); the roof trusses under the
 * roof are a plain white underside; no stairs, no "B" signs, no rows.
 * Doubts: every height is estimated from photos; the east skirt's section
 * is read from one photo (MottaW b) and the orthophoto; the opening's ends
 * are shown with the moving trusses parked, as in the orthophoto, which
 * was flown before the roof was finished.
 */
import { Part, writeGlb, cross, sub, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const ID = 'madrid-santiago-bernabeu'
const ANCHOR: [number, number] = [40.4530548, -3.6882858]
const BEARING = 4.25
type XY = [number, number]

// --- Plan -----------------------------------------------------------------
/** OSM way/1507411898 in the pitch frame (metres), counter-clockwise. */
const OUTLINE: XY[] = [
  [-112.6, 66.6], [-113.2, 59.7], [-113.9, 42.2], [-113.9, 34.4], [-113.8, 28.0], [-113.7, 19.0], [-113.1, -11.9],
  [-112.4, -43.1], [-111.9, -65.8], [-111.4, -72.7], [-111.0, -77.1], [-109.8, -81.1], [-108.2, -85.6], [-106.2, -88.6],
  [-103.3, -92.7], [-101.4, -95.1], [-97.1, -98.7], [-94.5, -100.4], [-90.2, -102.9], [-83.1, -105.5], [-76.6, -106.6],
  [-69.7, -107.6], [-63.5, -108.0], [-55.1, -108.3], [-47.6, -108.6], [-25.1, -109.0], [11.5, -109.5], [67.7, -109.1],
  [73.6, -108.7], [77.6, -107.9], [81.4, -106.6], [85.1, -104.8], [88.4, -102.6], [91.1, -100.1], [93.8, -96.9],
  [96.0, -93.5], [97.7, -89.7], [98.6, -86.3], [99.4, -82.3], [100.3, -78.1], [101.1, -72.9], [102.0, -66.6],
  [103.0, -57.9], [106.5, -43.3], [109.7, -32.6], [112.8, -26.9], [118.5, -22.8], [121.4, -18.7], [122.8, -15.4],
  [124.2, -12.3], [126.2, -5.0], [127.8, 3.3], [128.6, 10.6], [126.1, 21.6], [124.3, 25.5], [118.5, 38.4],
  [109.9, 56.0], [101.6, 73.4], [93.4, 90.1], [89.7, 97.5], [88.3, 100.3], [86.1, 102.8], [83.5, 105.2],
  [82.1, 106.2], [79.7, 107.0], [74.2, 108.2], [60.5, 108.8], [39.2, 109.3], [13.1, 109.6], [-10.2, 109.6],
  [-37.1, 108.8], [-58.0, 107.5], [-75.2, 105.6], [-78.6, 104.9], [-82.4, 103.7], [-86.9, 101.7], [-92.4, 98.7],
  [-97.7, 94.9], [-101.2, 91.4], [-104.5, 87.6], [-107.5, 82.7], [-110.7, 75.7], [-112.1, 69.6],
]
/** The skin's top and the roof keep the east side straight: the skirt's bulge is cut by this chord. */
const CHORD: [XY, XY] = [[103.0, -57.9], [101.6, 73.4]]
const C: XY = [-5.8, -0.8] // centre spot

/** Distance from C along the unit ray `u` to the polygon (first crossing). */
function rayHit(poly: XY[], u: XY): number {
  let best = Infinity
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length]
    const ex = b[0] - a[0], ey = b[1] - a[1]
    const den = u[0] * ey - u[1] * ex
    if (Math.abs(den) < 1e-9) continue
    const wx = a[0] - C[0], wy = a[1] - C[1]
    const t = (wx * ey - wy * ex) / den, s = (wx * u[1] - wy * u[0]) / den
    if (t > 0 && s >= 0 && s <= 1) best = Math.min(best, t)
  }
  return best
}
/** The outline with the skirt cut off along the chord. */
const TOP_OUTLINE: XY[] = (() => {
  const i0 = OUTLINE.findIndex((p) => p[0] === CHORD[0][0] && p[1] === CHORD[0][1])
  const i1 = OUTLINE.findIndex((p) => p[0] === CHORD[1][0] && p[1] === CHORD[1][1])
  return [...OUTLINE.slice(0, i0 + 1), ...OUTLINE.slice(i1)]
})()

/** Superellipse radius about C along angle t: |x/a|^n + |y/b|^n = 1. */
const seR = (a: number, b: number, n: number, t: number) =>
  (Math.abs(Math.cos(t) / a) ** n + Math.abs(Math.sin(t) / b) ** n) ** (-1 / n)

// Directions: evenly spaced along the outline (so the long sides get as many as the corners).
const N = 64
const DIRS: XY[] = (() => {
  const cum = [0]
  for (let i = 1; i <= OUTLINE.length; i++) {
    const a = OUTLINE[i - 1], b = OUTLINE[i % OUTLINE.length]
    cum.push(cum[i - 1] + Math.hypot(b[0] - a[0], b[1] - a[1]))
  }
  const L = cum[cum.length - 1], out: XY[] = []
  let j = 0
  for (let k = 0; k < N; k++) {
    const s = (k / N) * L
    while (cum[j + 1] < s) j++
    const a = OUTLINE[j], b = OUTLINE[(j + 1) % OUTLINE.length], f = (s - cum[j]) / (cum[j + 1] - cum[j])
    const x = a[0] + (b[0] - a[0]) * f - C[0], y = a[1] + (b[1] - a[1]) * f - C[1], l = Math.hypot(x, y)
    out.push([x / l, y / l])
  }
  return out
})()
const ANG = DIRS.map((u) => Math.atan2(u[1], u[0]))
const R_BASE = DIRS.map((u) => rayHit(OUTLINE, u)) // the skin's foot (with the east skirt)
const R_TOP = DIRS.map((u) => rayHit(TOP_OUTLINE, u)) // the skin's wall and roof

type Ring = V3[]
/** A ring at height z, `r(i)` metres from C along each direction. */
const ring = (r: (i: number) => number, z: number | ((i: number) => number)): Ring =>
  DIRS.map((u, i) => [C[0] + u[0] * r(i), C[1] + u[1] * r(i), typeof z === 'number' ? z : z(i)] as V3)
/** A superellipse ring about C. */
const se = (a: number, b: number, n: number, z: number | ((i: number) => number)) => ring((i) => seR(a, b, n, ANG[i]), z)

// --- Surfaces ----------------------------------------------------------------
type Facing = 'out' | 'in' | 'up' | 'down'
/**
 * The surface lofted through `rings` (same directions, successive along the
 * section), smooth around and along it, its normals turned to `facing`.
 */
function surface(p: Part, rings: Ring[], facing: Facing, smooth = true) {
  const K = rings.length
  const nrm: V3[][] = rings.map((r, k) =>
    r.map((P, i) => {
      const around = sub(r[(i + 1) % N], r[(i + N - 1) % N])
      const a = rings[Math.max(0, smooth ? k - 1 : k)][i], b = rings[Math.min(K - 1, smooth ? k + 1 : k + 1)][i]
      let along = sub(b, a)
      if (Math.hypot(...along) < 1e-6) along = sub(rings[Math.min(K - 1, k + 1)][i], rings[Math.max(0, k - 1)][i])
      let n = cross(around, along)
      const l = Math.hypot(...n) || 1
      n = [n[0] / l, n[1] / l, n[2] / l]
      const radial = n[0] * (P[0] - C[0]) + n[1] * (P[1] - C[1])
      const flip = facing === 'up' ? n[2] < 0 : facing === 'down' ? n[2] > 0 : facing === 'out' ? radial < 0 : radial > 0
      return flip ? ([-n[0], -n[1], -n[2]] as V3) : n
    }),
  )
  for (let k = 0; k < K - 1; k++)
    for (let i = 0; i < N; i++) {
      const j = (i + 1) % N
      const A = rings[k][i], B = rings[k][j], Cc = rings[k + 1][j], D = rings[k + 1][i]
      // Unsmoothed, a band takes its first ring's normals all the way across (a flat-shaded strip).
      const nA = nrm[k][i], nB = nrm[k][j], nC = smooth ? nrm[k + 1][j] : nB, nD = smooth ? nrm[k + 1][i] : nA
      p.tri(A, B, Cc, [0, 0], [0, 0], [0, 0], [nA, nB, nC])
      p.tri(A, Cc, D, [0, 0], [0, 0], [0, 0], [nA, nC, nD])
    }
}
const band = (p: Part, a: Ring, b: Ring, facing: Facing) => surface(p, [a, b], facing, false)

const skin = new Part(), roof = new Part(), white = new Part(), seats = new Part(), glazing = new Part(), screen = new Part()

// --- The skin ----------------------------------------------------------------
// Section: inset `d` from the skin's top outline along each direction, height z.
// On the east the foot flares out to the full outline (the skirt), easing back
// to the straight wall by z 44.
const Z_FOOT = 19, Z_WALL = 50.5, Z_RIM = 57.3, Z_OPEN = 64
const flare = (z: number) => (z >= 44 ? 0 : z <= Z_FOOT ? 1 : 0.5 + 0.5 * Math.cos((Math.PI * (z - Z_FOOT)) / (44 - Z_FOOT)))
const wallR = (d: number, z: number) => (i: number) => R_TOP[i] + (R_BASE[i] - R_TOP[i]) * flare(z) - d
const at = (d: number, z: number) => ring(wallR(d, z), z)

// The glazed ground floor, set back 4 m under the skin, from the pitch level
// (buried under the street) to the skin's soffit.
const PLINTH = (z: number) => ring((i) => R_BASE[i] - 4, z)
band(glazing, PLINTH(0), PLINTH(Z_FOOT), 'out')
// The soffit curving out and down from the glazing to the skin's lower edge.
surface(skin, [PLINTH(Z_FOOT), at(2.4, Z_FOOT + 0.2), at(0.8, Z_FOOT + 1.2), at(0, Z_FOOT + 2.6)], 'down')

// Lower third: open louvres, steel blades tilted out over dark gaps (lit behind at night).
let z = Z_FOOT + 2.6
for (let k = 0; k < 3; k++) {
  const blade = 1.7, gap = 2.3
  band(skin, at(0.9, z), at(-0.3, z + blade), 'out') // the blade, tilted out
  band(skin, at(-0.3, z + blade), at(0.9, z + blade + 0.35), 'up') // its top edge, back to the gap
  band(glazing, at(0.9, z + blade + 0.35), at(0.9, z + blade + gap), 'out') // the gap behind
  z += blade + gap
}
// Upper wall: stepped ribbons, each leaning out over the one below.
const RIB = (Z_WALL - z) / 4 - 0.35
for (let k = 0; k < 4; k++) {
  band(skin, at(0.7, z), at(-0.1, z + RIB), 'out')
  band(skin, at(-0.1, z + RIB), at(0.7, z + RIB + 0.35), 'up') // a chamfered step back in
  z += RIB + 0.35
}
// The roll over the shoulder: tight, smooth, up to the white rim line.
surface(skin, [at(0.7, z), at(1.0, 53), at(2.0, 55.4), at(3.6, 56.8)], 'out')
// The rim: a white lip, then the roof's ribbons rising to the opening.
band(white, at(3.6, 56.8), at(3.9, Z_RIM), 'out')
band(white, at(3.9, Z_RIM), at(5.5, Z_RIM), 'up')

// --- The roof --------------------------------------------------------------
// The opening: x -44..+33 (about C: +-38.5), y +-54.5, corners about 8 m.
const OPEN_A = 38.5, OPEN_B = 54.5, OPEN_N = 7
const OPEN = (zz: number, grow = 0) => se(OPEN_A + grow, OPEN_B + grow, OPEN_N, zz)
// The roof's ribbons, as five broad terraces stepping up toward the opening,
// so the concentric lines of the orthophoto read from above.
{
  const rOpen = (i: number) => seR(OPEN_A, OPEN_B, OPEN_N, ANG[i])
  const roofAt = (t: number, zz: number) => ring((i) => R_TOP[i] - 5.5 + (rOpen(i) - (R_TOP[i] - 5.5)) * t, zz)
  const T = [0, 0.2, 0.4, 0.6, 0.8, 1], Z = [Z_RIM, 58.6, 59.9, 61.2, 62.5, Z_OPEN], STEP = 0.8
  for (let k = 0; k < 5; k++) {
    const z0 = k === 0 ? Z[0] : Z[k] + STEP
    surface(roof, [roofAt(T[k], z0), roofAt(T[k + 1], Z[k + 1])], 'up', false)
    if (k < 4) band(roof, roofAt(T[k + 1], Z[k + 1]), roofAt(T[k + 1], Z[k + 1] + STEP), 'out')
  }
}
// The opening's fascia, and the white underside of the trusses back out over the stands.
band(white, OPEN(Z_OPEN), OPEN(Z_OPEN - 4), 'in')
const BOWL_TOP = se(99, 105, 4, 52), UNDER = se(99, 105, 4, 54)
band(white, OPEN(Z_OPEN - 4), UNDER, 'down')

// The retractable roof's trusses, parked at the opening's north and south ends.
{
  const zz = Z_OPEN - 0.2, depth = 7, h = 1.6
  for (const sgn of [-1, 1]) {
    const y0 = C[1] + sgn * (OPEN_B - 1.5), y1 = C[1] + sgn * (OPEN_B - 1.5 - depth)
    const x0 = C[0] - OPEN_A + 3, x1 = C[0] + OPEN_A - 3
    const [ya, yb] = sgn > 0 ? [y1, y0] : [y0, y1]
    const b: V3[] = [[x0, ya, zz], [x1, ya, zz], [x1, yb, zz], [x0, yb, zz]]
    const t: V3[] = b.map((p) => [p[0], p[1], zz + h] as V3)
    white.cap(t, true)
    for (let k = 0; k < 4; k++) white.quad(b[k], b[(k + 1) % 4], t[(k + 1) % 4], t[k])
  }
}

// --- The 360° video ring, hanging under the opening's edge ------------------
// 6.5 m deep on the sides and corners, 11 m at the ends; tilted 8°, its foot
// drawn in toward the pitch so the screens face down to the stands.
{
  const deep = (i: number) => {
    const s = Math.abs(Math.sin(ANG[i])), c = Math.abs(Math.cos(ANG[i]))
    return s > 0.93 && c < 0.3 ? 11 : 6.5
  }
  const top = OPEN(Z_OPEN - 4.2, 2)
  const foot = ring((i) => seR(OPEN_A + 2, OPEN_B + 2, OPEN_N, ANG[i]) - Math.tan((8 * Math.PI) / 180) * deep(i), (i) => Z_OPEN - 4.2 - deep(i))
  const footIn = ring((i) => seR(OPEN_A + 1.4, OPEN_B + 1.4, OPEN_N, ANG[i]) - Math.tan((8 * Math.PI) / 180) * deep(i), (i) => Z_OPEN - 4.2 - deep(i))
  const topIn = OPEN(Z_OPEN - 4.2, 1.4)
  band(screen, top, foot, 'out')
  band(screen, topIn, footIn, 'in')
  band(screen, foot, footIn, 'down')
}

// --- The bowl: three tiers of blue seats --------------------------------------
const PITCH = (zz: number) => se(38, 55, 8, zz)
band(white, PITCH(0), PITCH(1.5), 'in')
band(seats, PITCH(1.5), se(60, 74, 5, 15), 'up')
band(white, se(60, 74, 5, 15), se(62, 76, 5, 15), 'up')
band(white, se(62, 76, 5, 15), se(62, 76, 5, 18), 'in')
band(seats, se(62, 76, 5, 18), se(78, 90, 4.5, 31), 'up')
band(white, se(78, 90, 4.5, 31), se(80, 92, 4.5, 31), 'up')
band(white, se(80, 92, 4.5, 31), se(80, 92, 4.5, 34), 'in')
band(seats, se(80, 92, 4.5, 34), BOWL_TOP, 'up')
band(white, BOWL_TOP, UNDER, 'in')

// --- Write --------------------------------------------------------------------
const lit = (_p: V3, n: V3) => (n[2] > 0.6 ? 0.1 : n[2] < -0.5 ? 0.3 : 0.55)
const parts: Array<{ part: Part; material: MaterialSpec }> = [
  { part: skin, material: { ...finish('bernabeu-steel', 0xbfc5cb, 0.45), floodlight: lit } },
  { part: roof, material: finish('bernabeu-roof', 0xb7bec5, 0.5) },
  { part: white, material: finish('bernabeu-white', 0xeeece7) },
  { part: seats, material: finish('bernabeu-seats', 0x5b73a2) },
  { part: glazing, material: PALETTE.window },
  { part: screen, material: finish('neon-videoboard', 0x5f7cbc, 0.5) },
]

if (import.meta.main) {
  const triangles = parts.reduce((t, { part }) => t + part.triangles, 0)
  if (triangles > 6500) throw new Error(`triangle budget exceeded: ${triangles}`)
  const glb = writeGlb('Estadio Santiago Bernabéu', parts, {
    license: 'CC0-1.0',
    frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
    anchor: ANCHOR,
    bearing: BEARING,
    elevation: 0,
    height: Z_OPEN,
  })
  if (glb.length > 250_000) throw new Error(`size budget exceeded: ${glb.length} bytes`)
  const out = new URL(`../models/${ID}.glb`, import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}
