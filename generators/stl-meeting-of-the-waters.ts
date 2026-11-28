/**
 * Meeting of the Waters, Aloe Plaza, St. Louis (Carl Milles, dedicated
 * 1940) — original procedural geometry, CC0-1.0.
 * bun generators/stl-meeting-of-the-waters.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the plaza ground at
 * the pool's centre. Bearing 14.8: the pool's long sides run 104.7°/284.7°
 * (OSM way/108705178), parallel to Market Street and Union Station across
 * it. Anchor = the pool outline's centroid, -90.2076884, 38.6299543.
 *
 * Identity: a long, narrow pool on the plaza in front of Union Station
 * holding nineteen bronze figures on low granite plinths among water jets:
 * at the centre the two rivers, a tall standing man (the Mississippi) and
 * woman (the Missouri) meeting face to face, and along the pool to either
 * side seventeen attendants: tritons and naiads riding big fish, mermen
 * with fish, and small water creatures, each a compact bronze mass.
 *
 * Small sculpture (STYLE.md, "Small, famous objects"): each figure is a bold
 * simple mass (fish body, torso, head, raised arms) at its real size and
 * spacing; no faces or fine detail. The water is the map's (OSM
 * natural=water), so the model draws only the pool's granite coping, the
 * plinths and the bronzes. At zoom 16 the figures are a row of specks on
 * the coping; they read as a fountain from zoom 17 up. minzoom 17.
 *
 * Evidence:
 *  - pool: OSM way/108705178 (amenity=fountain, natural=water,
 *    artist_name=Carl Milles, start_date 1939-11): 60.2 × 10.1 m. No
 *    building in OSM, so `replaces` is empty.
 *  - published: 19 figures (2 principal, 17 attendants), dedicated May 1940
 *    (City of St. Louis landmark page linked from the OSM way; Wikipedia,
 *    "Aloe Plaza").
 *  - estimated from the photos: the coping 0.45 m above the plaza and 0.7 m
 *    wide (1.05 m above the water: Mapterhorn shows the pool 0.5–0.6 m
 *    below the plaza around it, and y = 0 is the water); the
 *    principal figures ≈3.6 m on 0.6 m plinths; the attendants 1.6–2.4 m;
 *    their places along the pool (two staggered rows, the principal pair
 *    in the middle); the colour of the bronze (warm golden brown with a
 *    darker patina) and the pinkish granite.
 *  - Mapterhorn terrain: the plaza within 0.5 m; the pool hollow is in the
 *    DEM, so y = 0 is the water and elevation stays 0.
 *
 * Night: the fountain is lit (OSM lit=yes): the bronzes carry _FLOODLIGHT.
 *
 * Photos (all EVIDENCE):
 *  marelbu1 "St. Louis, Missouri, USA - Carl Milles fountain The Meeting of
 *           the Waters - panoramio.jpg", MARELBU, CC BY 3.0
 *           https://commons.wikimedia.org/wiki/File:St._Louis,_Missouri,_USA_-_Carl_Milles_fountain_The_Meeting_of_the_Waters_-_panoramio.jpg
 *  marelbu_aloe "St. Louis, Missouri, USA - Aloe Plaza - Carl Milles fountain
 *           The Meeting of the Waters 1936-40 - Union Station - panoramio.jpg",
 *           MARELBU, CC BY 3.0
 *           https://commons.wikimedia.org/wiki/File:St._Louis,_Missouri,_USA_-_Aloe_Plaza_-_Carl_Milles_fountain_The_Meeting_of_the_Waters_1936-40_-_Union_Station_-_panoramio.jpg
 *  batt     "St. Louis Union Station (17577826564).jpg", Dustin Batt,
 *           CC BY-SA 2.0 (the pool from its west end)
 *           https://commons.wikimedia.org/wiki/File:St._Louis_Union_Station_(17577826564).jpg
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the attendants' exact order and poses are simplified to three
 * kinds (fish rider, standing merman, small creature) placed by their
 * spacing in the photos; the water jets are left out.
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { ccw, prism, revolve, save, type XY } from './atl-tech-tower'

const granite = new Part(), bronze = new Part()
const L = 30.1, W = 5.05, RIM = 0.7, RIM_H = 1.05

// ── the pool's coping: a ring 0.7 m wide round the water ──
for (const [x0, x1, y0, y1] of [[-L - RIM, L + RIM, W, W + RIM], [-L - RIM, L + RIM, -W - RIM, -W], [-L - RIM, -L, -W, W], [L, L + RIM, -W, W]])
  prism(granite, ccw([[x0, y0], [x1, y0], [x1, y1], [x0, y1]]), 0, RIM_H, granite, 0.12)

const plinth = (c: XY, s: number, h: number) => prism(granite, ccw([[c[0] - s, c[1] - s], [c[0] + s, c[1] - s], [c[0] + s, c[1] + s], [c[0] - s, c[1] + s]]), 0, h, granite, 0.08)

// a stretched solid of revolution: profile [r, t] along an axis from a to b
function along(p: Part, a: V3, b: V3, prof: [number, number][], n = 8, squash = 1) {
  const d: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], len = Math.hypot(...d)
  const T: V3 = [d[0] / len, d[1] / len, d[2] / len]
  let N: V3 = Math.abs(T[2]) > 0.9 ? [1, 0, 0] : [0, 0, 1]
  const B0: V3 = [T[1] * N[2] - T[2] * N[1], T[2] * N[0] - T[0] * N[2], T[0] * N[1] - T[1] * N[0]]
  const bl = Math.hypot(...B0), B: V3 = [B0[0] / bl, B0[1] / bl, B0[2] / bl]
  N = [B[1] * T[2] - B[2] * T[1], B[2] * T[0] - B[0] * T[2], B[0] * T[1] - B[1] * T[0]]
  const ringAt = (r: number, t: number) => Array.from({ length: n }, (_, i) => {
    const q = (i / n) * Math.PI * 2, u = r * Math.cos(q), v = r * Math.sin(q) * squash
    return [a[0] + T[0] * t * len + N[0] * v + B[0] * u, a[1] + T[1] * t * len + N[1] * v + B[1] * u, a[2] + T[2] * t * len + N[2] * v + B[2] * u] as V3
  })
  const rings = prof.map(([r, t]) => ringAt(Math.max(r, 0.001), t))
  for (let k = 0; k < rings.length - 1; k++)
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n
      p.quad(rings[k][i], rings[k][j], rings[k + 1][j], rings[k + 1][i])
    }
}
const limb = (a: V3, b: V3, r0: number, r1: number) => along(bronze, a, b, [[r0 * 0.6, 0], [r0, 0.08], [r1, 0.92], [r1 * 0.6, 1]], 6)
const head = (c: V3, r: number) => revolve(bronze, [c[0], c[1]], [[0.001, c[2] - r], [r * 0.8, c[2] - r * 0.6], [r, c[2]], [r * 0.8, c[2] + r * 0.6], [0, c[2] + r]], 8, 0, false, false)

/** A standing figure on a plinth, facing `f` (radians from +x), height h above z0. */
function standing(c: XY, z0: number, h: number, f: number, armsUp: boolean, slim = 1) {
  const s = h / 3.6, fx = Math.cos(f), fy = Math.sin(f), sx = -fy, sy = fx
  const P = (side: number, fwd: number, z: number): V3 => [c[0] + sx * side + fx * fwd, c[1] + sy * side + fy * fwd, z0 + z]
  // legs as one mass up to the hips, the torso, the head
  revolve(bronze, c, [[0.2 * s * slim, z0], [0.3 * s * slim, z0 + 0.8 * s], [0.36 * s * slim, z0 + 1.7 * s], [0.38 * s * slim, z0 + 2.1 * s], [0.33 * s * slim, z0 + 2.5 * s], [0.42 * s * slim, z0 + 2.85 * s], [0.18 * s, z0 + 3.05 * s]], 8, 0, false, true)
  head([c[0], c[1], z0 + 3.28 * s] as V3, 0.22 * s)
  for (const side of [-1, 1]) {
    const sh = P(side * 0.4 * s, 0, 2.85 * s)
    if (armsUp) limb(sh, P(side * 0.55 * s, 0.35 * s, 3.65 * s), 0.11 * s, 0.08 * s)
    else limb(sh, P(side * 0.55 * s, 0.45 * s, 2.1 * s), 0.11 * s, 0.08 * s)
  }
}
/** A big fish, nose to `f`, with a rider on its back. */
function rider(c: XY, z0: number, len: number, f: number, rider = true) {
  const fx = Math.cos(f), fy = Math.sin(f)
  const nose: V3 = [c[0] + fx * len * 0.5, c[1] + fy * len * 0.5, z0 + 0.25 * len]
  const tail: V3 = [c[0] - fx * len * 0.5, c[1] - fy * len * 0.5, z0 + 0.55 * len]
  along(bronze, tail, nose, [[0.02, 0], [0.13 * len, 0.18], [0.24 * len, 0.55], [0.18 * len, 0.85], [0.04, 1]], 8, 0.8)
  // the tail fin, flung up
  along(bronze, tail, [tail[0] - fx * 0.25 * len, tail[1] - fy * 0.25 * len, tail[2] + 0.4 * len], [[0.04 * len, 0], [0.1 * len, 0.4], [0.17 * len, 0.85], [0.01, 1]], 6, 0.35)
  if (!rider) return
  const b: V3 = [c[0] + fx * 0.05 * len, c[1] + fy * 0.05 * len, z0 + 0.55 * len]
  revolve(bronze, [b[0], b[1]], [[0.22, b[2]], [0.26, b[2] + 0.45], [0.2, b[2] + 0.85], [0.08, b[2] + 0.95]], 7, 0, false, true)
  head([b[0], b[1], b[2] + 1.1], 0.17)
  limb([b[0], b[1], b[2] + 0.8], [b[0] + fx * 0.3, b[1] + fy * 0.3, b[2] + 1.5], 0.08, 0.06)
}

// ── the principal pair at the centre, meeting face to face ──
plinth([-2.2, 0], 0.8, 0.6)
plinth([2.2, 0], 0.8, 0.6)
standing([2.2, 0], 0.6, 3.7, Math.PI, true, 1.05) // the Mississippi (man), from the east
standing([-2.2, 0], 0.6, 3.5, 0, false, 0.9) // the Missouri (woman), from the west
// the shells and fish at their feet
rider([2.2, -0.9], 0.6, 1.4, Math.PI * 0.85, false)
rider([-2.2, 0.9], 0.6, 1.4, -Math.PI * 0.15, false)

// ── seventeen attendants along the pool, in two staggered rows ──
type Kind = 'rider' | 'merman' | 'small'
const ATT: Array<[number, number, Kind]> = [
  [-7.5, 2.2, 'rider'], [-10.5, -2.3, 'merman'], [-13.5, 2.0, 'small'], [-16.5, -2.0, 'rider'], [-19.5, 2.3, 'merman'], [-22.5, -2.2, 'small'], [-25.5, 1.8, 'rider'], [-27.8, -1.4, 'small'],
  [7.5, -2.2, 'rider'], [10.5, 2.3, 'merman'], [13.5, -2.0, 'small'], [16.5, 2.0, 'rider'], [19.5, -2.3, 'merman'], [22.5, 2.2, 'small'], [25.5, -1.8, 'rider'], [27.8, 1.4, 'small'], [5.5, 2.6, 'small'],
]
for (const [x, y, k] of ATT) {
  const towardCentre = x > 0 ? Math.PI : 0
  plinth([x, y], 0.65, 0.5)
  if (k === 'rider') rider([x, y], 0.5, 2.2, towardCentre + (y > 0 ? -0.4 : 0.4))
  else if (k === 'merman') { standing([x, y], 0.5, 2.3, towardCentre, true, 1.1); rider([x, y], 0.5, 1.2, towardCentre + 0.6, false) }
  else rider([x, y], 0.5, 1.4, towardCentre + (y > 0 ? 0.5 : -0.5), false)
}

await save('stl-meeting-of-the-waters', 'Meeting of the Waters', [
  { part: granite, material: finish('stl-pink-granite', 0xbca69c) },
  { part: bronze, material: { ...finish('stl-bronze', 0x8c7752, 0.6), floodlight: (_p: V3, n: V3) => (n[2] > 0.8 ? 0.3 : 0.9) } },
], { height: 4.6, anchor: [38.6299543, -90.2076884], bearing: 14.8 }, 5000)
