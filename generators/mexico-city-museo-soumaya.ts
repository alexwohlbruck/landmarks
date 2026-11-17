/**
 * Museo Soumaya, Plaza Carso, Blvd. Miguel de Cervantes Saavedra,
 * Nuevo Polanco, Mexico City (Fernando Romero / FR-EE, 2011): procedural,
 * CC0-1.0.
 *   bun generators/mexico-city-museo-soumaya.ts
 *
 * Map frame: x east, y north, z up, metres, bearing 0. Origin: the
 * centroid of the OSM outline (way/158035385), at plaza level.
 *
 * Form: the twisted, asymmetric "anvil", about as tall as it is wide: a
 * skin that flares out to a rim at the foot, pulls in to a narrow waist a
 * third of the way up, and flares out again, twisting as it rises, to a
 * broader top whose rim rises to a sharp curled peak at one corner, its
 * plan turning from a rounded pentagon at the base to a rounded rhomboid
 * at the top. A dark glazed band runs under the rim at
 * ground level; there are no other windows. The skin is ~16,000 hexagonal
 * aluminium tiles; here it is one smooth silver surface (no tile grid).
 *
 * Sources
 * - OSM (ODbL): the outline way/158035385 (height 46, 10 levels) and its
 *   eight stacked building:parts, each a slice of the skin at one band of
 *   floors with its own outline and height: way/1467517972 (0-8.5 m, the
 *   base, the same outline as the building), 1467517971 (to 12.5),
 *   1467517970 (to 16), 1467517969 (to 20), 1467517968 (to 25.5),
 *   1467517967 (to 30), 1467517966 (to 35), 1467517965 (to 46, the top).
 *   The model lofts through these outlines, each resampled by angle round
 *   a common centre and set at the middle of its band, so the plan and the
 *   twist are OSM's. All nine are replaced.
 * - Published (es.wikipedia "Museo Soumaya"): 46 m, six exhibition floors,
 *   16,000 hexagonal aluminium modules, opened 2011.
 * - Photos (Wikimedia Commons, EVIDENCE):
 *   1 Diego Delso, "Museo Soumaya, Ciudad de México, México, 2015-07-18,
 *     DD 12.JPG" and "DD 13.JPG", CC BY-SA 4.0 (two sides, level: the
 *     peaked side and the broad anvil side, the dark base band, the rim);
 *     https://commons.wikimedia.org/wiki/File:Museo_Soumaya,_Ciudad_de_M%C3%A9xico,_M%C3%A9xico,_2015-07-18,_DD_12.JPG
 *     https://commons.wikimedia.org/wiki/File:Museo_Soumaya,_Ciudad_de_M%C3%A9xico,_M%C3%A9xico,_2015-07-18,_DD_13.JPG
 *   2 Raystormxc, "Museo Soumaya Plaza.jpg", CC BY-SA 3.0 (the waist and
 *     the top lip, the silver colour);
 *     https://commons.wikimedia.org/wiki/File:Museo_Soumaya_Plaza.jpg
 *   3 José Luiz, "Museo Soumaya from Museo Jumex - Mexico 2024.jpg" and
 *     "Plaza Carso & Museo Soumaya - Mexico 2024 (2).jpg", CC BY-SA 4.0
 *     (from the east and south-east, elevated: the overhang of the top);
 *     https://commons.wikimedia.org/wiki/File:Museo_Soumaya_from_Museo_Jumex_-_Mexico_2024.jpg
 *     https://commons.wikimedia.org/wiki/File:Plaza_Carso_%26_Museo_Soumaya_-_Mexico_2024_(2).jpg
 *   4 artotems, "Museo Soumaya (Plaza Carso).jpg", CC BY 2.0, and Benoît
 *     Prieur, "Exterior of Museo Soumaya Plaza Carso - 2015.jpg", CC0.
 *     https://commons.wikimedia.org/wiki/File:Museo_Soumaya_(Plaza_Carso).jpg
 *     https://commons.wikimedia.org/wiki/File:Exterior_of_Museo_Soumaya_Plaza_Carso_-_2015.jpg
 * - Terrain: Mapterhorn has no z15 terrain here (tools/terrain.ts 404s);
 *   Nuevo Polanco is on the flat lake-bed basin (~2,240 m).
 * - Estimated: the dark glazed band 2.6 m (photo 1, about 1.5 people),
 *   inset 1.5 m under the rim; the rounded lip (about 1 m, thinner at the
 *   peak); the skin a bright silver-grey (#d9dfe3, low roughness), smooth,
 *   with no tile grid.
 * - Changed from OSM on photo evidence (review round 1):
 *   - plan: OSM's slices are wider than the photos allow. In the two
 *     distant photos (3, from Jumex; 4, from the south) the building is
 *     about 0.8 as tall as it is wide across the top, so with the
 *     published 46 m the top is about 55-60 m across, not OSM's ~72 m.
 *     Every slice is rounded halfway towards a circle (OSM draws sharp
 *     rhomboids whose long diagonals the photos don't show) and drawn at
 *     0.82 of OSM's size;
 *   - profile: the slices are pulled in further (factors 0.58-0.95) to
 *     the waist every photo shows (about 0.43 of the top at 15-18 m) and
 *     a foot about 0.66 of the top; the lower body leans north-east so the
 *     top overhangs to the south-west;
 *   - the signature peak: the rim rises to a sharp, curled point at the
 *     south-west corner of OSM's top slice (46 m), the skin flaring out
 *     there to a thin lip; elsewhere the rim is at 42.5 m, falling away
 *     from the peak to about 35.5 m on the far side (photos 1-4; photo 3,
 *     from the east-south-east, and photo 4 both show the peak on the
 *     overhanging side).
 * - Doubts: the camera positions of photos 1-2 are not certain, so the
 *   lean and tilt rest on photos 3-4; between slices the loft is a
 *   straight blend, a little stiffer than the real curve; the roof (never
 *   photographed) is drawn as a shallow fan.
 *
 * Night: the skin is unlit (it reflects the plaza lights); the ground band
 *   is `window` and glows.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { save, smooth } from './dc-wwii-memorial'

/**
 * OSM outlines (way/1467517972 ... 1467517965, base to top), in metres
 * from the anchor, east and north.
 */
const SLICES: [number, number][][] = [
  [[-36.4, 21.4], [-36.0, 23.8], [-35.2, 26.3], [-33.4, 28.3], [-31.2, 29.6], [-29.0, 30.3], [-26.0, 30.7], [2.2, 30.2], [4.7, 29.8], [7.2, 29.0], [9.9, 27.7], [14.6, 24.5], [39.7, 6.6], [41.5, 5.0], [43.1, 3.2], [44.6, 1.2], [45.3, -1.1], [45.2, -3.6], [44.6, -5.5], [43.6, -7.4], [41.2, -10.0], [11.6, -32.1], [9.5, -33.4], [7.2, -34.8], [5.7, -35.5], [4.4, -36.1], [2.5, -36.5], [-0.3, -36.4], [-2.7, -35.8], [-4.4, -35.1], [-6.3, -34.1], [-8.3, -32.8], [-11.3, -30.3], [-25.5, -17.3], [-28.2, -14.6], [-30.0, -12.5], [-32.3, -9.5], [-34.3, -6.6], [-35.8, -3.8], [-36.9, -0.8], [-37.3, 1.6], [-37.5, 6.7], [-37.4, 11.1]],
  [[-30.4, 19.4], [-29.5, 21.2], [-27.2, 23.5], [-23.8, 24.9], [-2.3, 25.4], [0.8, 24.9], [4.1, 23.8], [7.8, 21.8], [32.0, 5.9], [33.7, 4.0], [34.6, 2.1], [34.9, -1.0], [34.3, -3.5], [32.8, -6.0], [30.4, -8.3], [27.0, -11.3], [20.0, -17.6], [17.7, -19.4], [15.6, -21.0], [14.3, -22.0], [10.4, -24.5], [6.3, -26.7], [4.4, -27.2], [1.9, -27.3], [-0.6, -26.7], [-2.9, -25.8], [-12.7, -17.8], [-22.6, -8.9], [-26.6, -4.7], [-28.6, -1.7], [-29.7, 0.3], [-30.5, 2.1], [-31.2, 4.2], [-31.7, 7.2], [-32.0, 10.0], [-31.7, 14.0], [-31.1, 17.7]],
  [[-25.1, 16.9], [-26.1, 14.3], [-26.9, 10.1], [-27.3, 5.0], [-26.9, 2.4], [-25.8, -1.2], [-23.8, -3.9], [-21.2, -6.9], [-15.7, -11.6], [-0.5, -22.2], [2.1, -23.4], [5.1, -23.9], [7.8, -23.4], [10.9, -22.1], [14.8, -19.5], [21.9, -13.6], [27.3, -8.2], [30.5, -4.4], [32.2, -1.2], [32.5, 0.9], [32.3, 2.6], [31.4, 4.3], [29.9, 5.9], [27.6, 7.7], [13.7, 15.2], [4.4, 19.4], [1.0, 20.5], [-2.4, 21.5], [-8.2, 21.7], [-18.8, 21.0], [-21.6, 20.1], [-23.4, 18.9]],
  [[-22.4, 13.8], [-20.0, 15.5], [-17.5, 17.0], [-14.5, 17.5], [-2.9, 17.5], [1.0, 16.7], [21.1, 10.2], [27.6, 7.7], [29.9, 5.9], [30.6, 4.2], [30.9, 1.9], [30.5, -0.3], [29.1, -2.7], [16.8, -16.8], [14.4, -18.8], [11.9, -20.5], [9.2, -21.5], [7.0, -21.8], [4.1, -21.5], [2.1, -21.1], [-15.7, -11.6], [-21.2, -6.9], [-23.8, -3.9], [-24.9, -1.2], [-25.3, 2.0], [-25.0, 4.9], [-24.4, 8.8], [-23.4, 12.0]],
  [[-23.4, 8.3], [-22.2, 11.2], [-20.5, 13.1], [-18.2, 14.7], [-14.9, 15.5], [-3.2, 15.4], [2.9, 15.1], [18.2, 11.9], [24.4, 10.2], [27.4, 9.4], [28.7, 8.8], [29.4, 7.9], [30.0, 6.6], [30.3, 3.8], [30.1, 1.6], [29.1, -0.8], [16.8, -16.8], [14.4, -18.8], [11.9, -20.5], [9.3, -20.9], [6.4, -21.1], [3.8, -20.9], [-12.2, -15.0], [-15.2, -13.7], [-17.4, -12.3], [-21.0, -9.8], [-22.3, -8.8], [-23.5, -7.3], [-24.5, -5.3], [-24.9, -3.7], [-25.0, -1.9], [-24.7, 0.8]],
  [[-22.2, 11.2], [-20.5, 13.1], [-18.2, 14.7], [-14.9, 15.5], [-3.2, 15.4], [2.9, 15.1], [24.7, 12.6], [28.1, 12.1], [30.3, 11.2], [31.8, 9.6], [32.3, 7.5], [32.2, 4.6], [31.8, 2.8], [30.5, -0.3], [29.1, -2.7], [19.6, -17.1], [17.7, -19.4], [15.6, -21.0], [13.4, -21.8], [9.7, -22.2], [-0.7, -20.8], [-7.0, -19.2], [-16.9, -15.9], [-19.6, -14.6], [-22.0, -13.1], [-24.0, -11.4], [-24.9, -9.9], [-25.6, -8.1], [-25.7, -6.3], [-25.4, -3.1], [-24.7, 0.8], [-23.4, 8.3]],
  [[-25.9, -11.8], [-24.8, -14.2], [-23.2, -16.1], [-21.3, -17.3], [-19.3, -18.1], [-2.9, -22.2], [4.6, -23.3], [9.9, -23.0], [12.4, -22.7], [15.8, -21.9], [18.5, -20.4], [20.7, -17.6], [31.3, 5.1], [31.5, 7.3], [31.3, 9.4], [30.7, 11.7], [29.9, 13.0], [28.6, 13.7], [25.9, 14.4], [-0.6, 14.3], [-13.6, 13.2], [-17.3, 12.5], [-19.9, 11.8], [-22.1, 10.2], [-23.9, 7.8], [-24.7, 4.5], [-26.1, -3.8], [-26.4, -7.1], [-26.3, -9.6]],
  [[-34.3, -22.0], [-25.9, 12.3], [-24.7, 13.7], [-22.6, 15.0], [-20.6, 15.7], [29.7, 19.8], [32.0, 19.8], [33.7, 19.5], [35.3, 18.7], [36.2, 17.7], [36.7, 16.2], [36.7, 14.9], [36.4, 12.7], [26.8, -26.2], [25.7, -28.5], [24.0, -30.0], [22.4, -30.9], [20.1, -31.2], [-29.8, -29.7], [-31.5, -29.3], [-32.8, -28.3], [-33.8, -27.0], [-34.3, -24.8]],
]
/** The height each slice is drawn at: the middle of its band of floors. */
const SLICE_Z = [4.5, 10.5, 14.25, 18, 22.75, 27.75, 32.5, 41]

const N = 96
const C: [number, number] = [0.6, -1.2] // a centre every slice is star-shaped about

/** The slice's radius along each of N directions round C (ray casting). */
function resample(ring: [number, number][]): number[] {
  return Array.from({ length: N }, (_, i) => {
    const a = (i / N) * 2 * Math.PI, dx = Math.cos(a), dy = Math.sin(a)
    let best = 0
    for (let k = 0; k < ring.length; k++) {
      const [x0, y0] = ring[k], [x1, y1] = ring[(k + 1) % ring.length]
      const ex = x1 - x0, ey = y1 - y0, wx = x0 - C[0], wy = y0 - C[1]
      const den = dx * ey - dy * ex
      if (Math.abs(den) < 1e-9) continue
      const t = (wx * ey - wy * ex) / den, u = (wx * dy - wy * dx) / den
      if (t > 0 && u >= 0 && u <= 1) best = Math.max(best, t)
    }
    return best
  })
}
// OSM's slices are drawn as sharp rhomboids whose long diagonals are much
// longer than the photos show; each is rounded halfway towards a circle of
// its own mean radius.
const R = SLICES.map(resample).map(r => { const m = r.reduce((s, v) => s + v, 0) / r.length; return r.map(v => 0.5 * v + 0.5 * m) })
const mix = (a: number[], b: number[], t: number) => a.map((v, i) => v + (b[i] - v) * t)
const scaled = (a: number[], k: number, d = 0) => a.map(v => v * k - d)
// Plan scale: OSM's slices are wider than the photos allow. In the two
// distant photos (3, from Jumex; 4, from the south) the building is about
// 0.8 as tall as it is wide across the top, so with the published 46 m
// the top is about 57 m across, not OSM's ~72 m: every slice is drawn at
// 0.82 of OSM's size about the centre.
const PLAN = 0.82
// The lower body leans: its foot and waist sit off to the north-east, so
// the top overhangs to the south-west (photos 3, 4).
const LEAN: [number, number] = [4, 3.5]
// The signature peak: the top rim rises to a sharp, curled point at the
// south-west corner (46 m), flaring outward and curling up to a thin lip
// there; elsewhere the rim is at 42.5 m and falls away from the peak to
// about 35.5 m on the far side (photos 1-4).
const HIGH = 1.25 * Math.PI, DROP = 8, PEAK_W = 0.55, FLARE = 4, FLARE_W = 0.3, CURL = 4.2
const dA = (a: number) => { let d = Math.abs(a - HIGH) % (2 * Math.PI); return d > Math.PI ? 2 * Math.PI - d : d }
const near = (a: number, w: number) => Math.exp(-((dA(a) / w) ** 2))
/** A cusp-shaped falloff, so the peak comes to a point rather than a hump. */
const cusp = (a: number, w: number) => Math.exp(-dA(a) / w)
/** A ring of radii at height z; `lip` pulls the rim inward (less at the peak, so the lip is thin there). */
const ring = (r: number[], z: number, lip = 0): V3[] => {
  const k = Math.max(0, 1 - z / 34)
  return r.map((v, i) => {
    const a = (i / N) * 2 * Math.PI, g = near(a, FLARE_W)
    const flare = FLARE * Math.max(0, (Math.min(z, 42) - 30) / 12) ** 2 * g
    const rr = v * PLAN + flare - lip * (1 - 0.8 * g)
    // Height: the lip is squeezed thin at the peak, then the rim falls away from it.
    let zz = z > 41 ? 41 + (z - 41) * (1 - 0.5 * g) : z
    // The curl: the lip turns up to the peak's tip.
    if (z > 38) zz += CURL * ((z - 38) / 4.5) * cusp(a, 0.3)
    zz -= Math.max(0, (zz - 26) / 20) * DROP * (1 - cusp(a, PEAK_W))
    return [C[0] + LEAN[0] * k + rr * Math.cos(a), C[1] + LEAN[1] * k + rr * Math.sin(a), zz] as V3
  })
}

const skin = new Part(), band = new Part()

// The skin: from the rim at the foot, through OSM's slices, to the lip.
// Each slice is pulled in about the centre to the profile the photos show:
// the foot about 0.66 of the top, the waist about 0.43 at 15-18 m (photos
// 3, 4), flaring to the top; the factors are chosen so the skin curves
// smoothly.
const F = [0.62, 0.6, 0.58, 0.58, 0.6, 0.66, 0.74, 0.88, 0.95, 1]
const SRC = [R[0], mix(R[0], R[1], 0.5), R[1], R[2], R[3], R[4], R[5], R[6], mix(R[6], R[7], 0.5), R[7]]
const ZS = [3.4, 6.0, 10.5, 14.25, 18, 22.75, 27.75, 32.5, 37.0, 41.0]
const rows: [number[], number, number][] = [
  [scaled(R[0], 0.62), 2.6, 1.2], // underside of the rim, tucked in
  ...SRC.map((r, k) => [scaled(r, F[k]), ZS[k], 0] as [number[], number, number]),
  [R[7], 41.6, 0.3], // the rounded lip
  [R[7], 42.2, 1.2],
  [R[7], 42.5, 2.8],
]
smooth(skin, p => {
  const rs = rows.map(([r, z, lip]) => ring(r, z, lip))
  p.loft(rs)
  // Roof: a shallow fan from the centre.
  const top = rs[rs.length - 1], c: V3 = [C[0], C[1], 38.5]
  for (let i = 0; i < N; i++) p.tri(c, top[i], top[(i + 1) % N])
  // The rim's underside, closing against the glass band.
  const under = rs[0], inner = ring(scaled(R[0], 0.62), 2.6, 1.6)
  for (let i = 0; i < N; i++) { const j = (i + 1) % N; p.quad(under[j], under[i], inner[i], inner[j]) }
}, 40)

// The dark glazed band at ground level, set in under the rim.
{
  const lo = ring(scaled(R[0], 0.62), 0, 1.6), hi = ring(scaled(R[0], 0.62), 2.6, 1.6)
  band.loft([lo, hi])
}

await save('mexico-city-museo-soumaya', 'Museo Soumaya', [
  // Bright silver: the tiles read as polished metal in every photo.
  { part: skin, material: finish('aluminium-tiles', 0xd9dfe3, 0.2) },
  { part: band, material: PALETTE.window },
], { bearing: 0 }, 6500)
