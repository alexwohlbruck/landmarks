/**
 * Virgen de El Panecillo (Virgin of Quito), on the summit of El Panecillo,
 * Quito: procedural, CC0-1.0.
 * bun generators/quito-virgen-del-panecillo.ts
 *
 * Writes two levels of detail in the same frame, sculpted as smooth-shaded
 * surfaces (lofted sections, swept tubes, cambered wing shells), after
 * rio-christ-the-redeemer.ts:
 * - models/quito-virgen-del-panecillo.glb, the low model;
 * - models/quito-virgen-del-panecillo.detail.glb, drawn from zoom 17: the
 *   same forms at about three times the resolution, with the fingers, the
 *   chain's links, the feathers' scalloped edges and the corbels.
 *
 * The monument: a winged Virgin of the Apocalypse in 7,400 aluminium plates,
 * by Agustín de la Herrán Matorras (1975), after Bernardo de Legarda's
 * carved "Virgin of Quito" (1734): she dances on a crescent moon and a
 * chained serpent coiled on the globe, her right hand raised, her left hand
 * holding the serpent's chain across her waist, her head inclined to her
 * left under a ring of twelve stars. The globe sits in a balcony ringed with
 * teal leaves on top of a tapering twelve-sided tower of dark volcanic stone
 * (begun 1971, finished 1974) with piers, two tiers of arched stained-glass
 * windows and a corbelled cornice, on a ring of three steps.
 *
 * Model frame: x east, y north, z up, metres (written as glTF Y-up). The
 * statue faces +y; the placement's bearing (20) turns her to face NNE over
 * the historic centre, as the photos show: she is seen square-on from the
 * north terrace in line with "La Olla" (node/1815299787, bearing 20 from the
 * tower) and from the Centro Cultural Metropolitano (bearing ~36) her face
 * is turned slightly towards the camera.
 * Anchor: the centroid of the tower's OSM outline (way/302693995, building,
 * a circle ~13 m across, taken as the tower and its steps); OSM's artwork
 * polygon (way/302694122, Q6163386, ~10 m across) is the tower alone.
 *
 * Published (Wikipedia, "El Panecillo" and es: "Virgen de El Panecillo"):
 * 41 m in all with the base; 7,400 aluminium pieces; assembled 1975.
 * Measured on "Virgen de Quito Panecillo from the roof of the Centro
 * Cultural Metropolitano" (David Adam Kess, CC BY-SA 4.0, a near-frontal
 * telephoto), scaled to the published 41 m from the tower's foot to the top
 * of the stars (0.0456 m a pixel at 2x):
 * - the tower 9.4 m across at its foot, 11.5 m across the cornice; the
 *   cornice's top 11.6 m;
 * - the globe 8.3 m across, its top 15.4 m (drawn 8.7 m across and round,
 *   its equator just above the frieze, so its visible height reads as in
 *   judy2 and Kess; its top 16.85 m);
 * - the serpent's coils 14.6-17.8 m and 7.9 m across; the moon's horns' tips
 *   20.5 m, 3.4 m and 3.8 m either side (drawn half as big, to ~19.3 m: at
 *   full size they read too large beside the photos);
 * - the feet 17.8 m, the waist 26.4, the shoulders 35.8, the chin 36.9, the
 *   head's top 39.4, the stars' top 41; the ring of stars 4.3 m across;
 * - the wings 14.9 m tip to tip: her right wing out level with her
 *   shoulders, her left angled down to its tip at 27.6 m; the raised hand's
 *   top 36.5 m, 4.1 m out to her right; the head ~1.9 m to her left of the
 *   waist's centre (the dancing pose).
 * Estimated: every depth, from the side photos (HansNYC "The Panecillo -
 * Quito" series, CC BY 2.0; barspiller, CC BY 2.0): the body 2.8-3 m deep,
 * the robe trailing back over the serpent; the wings sweeping back 3-4 m
 * (her right one rising steeply to 38.7 m at its tip, which from the city
 * below reads near level with her head; her left one falling to 28 m, as
 * in the side views), up to ~3.9 m broad, in two layers of feathers (three
 * in the detail model); the head and veil drawn at 0.76 of the first size,
 * close round the head (the first, larger one read as a heavy hood); the
 * S-curve: hips swung ~0.65 m to her right, the waist (3.5 m) narrower than
 * the shoulders (5 m), the mantle wrapped diagonally, the robe flaring
 * again to the hem and trailing back; the
 * ring of stars tilted back ~30 degrees; the arms' path from "Virgen de
 * Quito" (Carine06, CC BY-SA 2.0); the folds, a little bolder than real; the
 * serpent's coils (one and a half turns) and its head at the front on her
 * left (Judy Gallagher's night photo); the tower's windows and piers from
 * "Quito El Panecillo monument entrance" (Cayambe, CC BY-SA 3.0) and
 * djhans's view (CC BY 2.0); twelve bays; the entrance put on the front
 * bay (no licensed photo fixes which bay it is in).
 * Colours from daylight photos: the aluminium a mid silver-grey with dark
 * seams (#666467 overall on Kess, #838489 under cloud on Swaine, #bac0c7
 * sunlit on the smooth globe), drawn #8d8e95, a touch cool so the map's
 * warm-white floodlight comes out nearer white, and less rough (0.45) for a
 * metallic highlight; the stone grey-brown (#5b534d-#6f6967, Cayambe,
 * Swaine), drawn #6e6863; the leaves teal (#495e5e in shade, HansNYC),
 * #5f9089; the window glass dark slate (#4a535c); the face a lighter
 * #a9aab0 (smoother and brighter than the seamed veil in judy2): an oval
 * shell with brow, nose ridge and chin, standing proud of the veil's edge.
 * Re-measured on Kess: the shaft about 1.1x as tall as it is wide (9.85 m
 * over ~9 m across the piers at its foot), tapering upward, under a cornice
 * 11.2 m across, its corbelled band 1.45 m deep (0.4 m less than first
 * drawn, to make room for the taller globe); the globe a round ball 8.7 m
 * across, its equator at 12.5 m just above the frieze, its top 16.85 m; to
 * keep the total at 41 m the lower robe is drawn compressed, the hem at
 * 19.0 m instead of the measured 17.8 (the serpent, moon and chain lifted
 * with it; the robe above the waist is unchanged); the frieze a
 * band of rounded upright shell-scallops round the globe's foot; the moon's
 * horns modest, their tips at ~19.3 m. The modelled
 * height is 41.5 m to the stars' points.
 * Not modelled: the 7,400 plates' dark seams (they would be a texture or
 * pinstripes), the balcony's iron railing, the continents on the globe.
 *
 * Elevation 0. Terrain: Mapterhorn here exists only at z12. Across the
 * footprint it rises ~1.5 m from north to south (tools/terrain.ts check
 * --zoom 12 prints ok), so on the south side the steps and the shaft's foot
 * sink into the hill; the entrance and the windows start above that. The
 * terraces and retaining walls around the summit are ground, not modelled.
 *
 * Night: the statue is fully floodlit (the map's floodlight colour is its
 * own fixed warm white; the statue's cool base pulls it toward the photo's
 * cool white); both tiers of windows are dark slate glass by day and glow
 * at night (window-2);
 * the stone and the cornice are lit more softly.
 *
 * Photos (evidence):
 * - "Virgen de Quito Panecillo from the roof of the Centro Cultural Metropolitano.JPG",
 *   David Adam Kess, CC BY-SA 4.0, https://commons.wikimedia.org/wiki/File:Virgen_de_Quito_Panecillo_from_the_roof_of_the_Centro_Cultural_Metropolitano.JPG
 * - "Quito El Panecillo monument entrance.jpg", Cayambe, CC BY-SA 3.0,
 *   https://commons.wikimedia.org/wiki/File:Quito_El_Panecillo_monument_entrance.jpg
 * - "El Panecillo, Quito - 1.jpg", Maros Mraz, CC BY-SA 3.0,
 *   https://commons.wikimedia.org/wiki/File:El_Panecillo,_Quito_-_1.jpg
 * - "Quito-IMG 8722.JPG", C T Johansson, CC BY-SA 3.0,
 *   https://commons.wikimedia.org/wiki/File:Quito-IMG_8722.JPG
 * - "Quito - Virgen del Panecillo", peter_swaine, CC BY 2.0, https://www.flickr.com/photos/154314265@N04/33554220464
 * - "Virgin of el Panecillo, Quito, Ecuador, July 6, 20..", Judy Gallagher, CC BY 2.0,
 *   https://www.flickr.com/photos/52450054@N04/52217180704 (day) and
 *   https://www.flickr.com/photos/52450054@N04/48656714962 (night)
 * - "Virgen de Quito", Carine06, CC BY-SA 2.0, https://www.flickr.com/photos/43555660@N00/16068384973
 * - "The Virgin of Quito", barspiller, CC BY 2.0, https://www.flickr.com/photos/7408004@N06/10580327863
 * - "La Virgen de Quito", maveric2003, CC BY 2.0, https://www.flickr.com/photos/47983324@N00/3143830032
 * - "Virgen del Panecillo", dj_Hans, CC BY 2.0, https://www.flickr.com/photos/83949127@N00/3626250400
 * - "The Panecillo - Quito", HansNYC, CC BY 2.0, https://www.flickr.com/photos/78362459@N00/8659249127
 *   (side, her left), https://www.flickr.com/photos/78362459@N00/8660349738 (her right wing),
 *   https://www.flickr.com/photos/78362459@N00/8660349578 (side, the leaves)
 * Look-only (not relied on): none.
 *
 * Doubts: no licensed photo shows the back square-on, so the back of the
 * robe and the wings' depth are estimated from the three-quarter and side
 * views; the serpent's exact coiling under the robe is hidden in every
 * photo; the published 41 m is taken as the tower's foot to the stars.
 */
import { Part, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { finish, windowVariant } from './palette'

const TAU = Math.PI * 2
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const len = (a: V3) => Math.hypot(a[0], a[1], a[2])
const unit = (a: V3): V3 => { const l = len(a) || 1; return [a[0] / l, a[1] / l, a[2] / l] }
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const lerp3 = (a: V3, b: V3, t: number): V3 => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)]
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v))
const smooth = (t: number) => { const c = clamp(t, 0, 1); return c * c * (3 - 2 * c) }

/** Piecewise-linear interpolation of [x, ...values] rows at x. */
function interp(rows: number[][], x: number): number[] {
  if (x <= rows[0][0]) return rows[0].slice(1)
  for (let k = 0; k < rows.length - 1; k++) {
    if (x <= rows[k + 1][0]) {
      const t = (x - rows[k][0]) / (rows[k + 1][0] - rows[k][0])
      return rows[k].slice(1).map((v, i) => lerp(v, rows[k + 1][i + 1], t))
    }
  }
  return rows[rows.length - 1].slice(1)
}

/** Catmull-Rom through points, `per` samples per span. */
function spline(pts: V3[], per: number): V3[] {
  const out: V3[] = []
  const P = (i: number) => pts[clamp(i, 0, pts.length - 1)]
  for (let i = 0; i < pts.length - 1; i++) {
    for (let s = 0; s < per; s++) {
      const t = s / per, t2 = t * t, t3 = t2 * t
      const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2)
      out.push([0, 1, 2].map((k) => 0.5 * (2 * p1[k] + (-p0[k] + p2[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2 + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t3)) as V3)
    }
  }
  out.push(pts[pts.length - 1])
  return out
}
/** The same for a list of numbers (radii along a path). */
function splineN(v: number[], per: number): number[] {
  return spline(v.map((x) => [x, 0, 0] as V3), per).map((p) => p[0])
}

/**
 * A smooth surface from a grid of rows (grid[k][i]): normals from the grid's
 * own neighbours, turned away from `inside(q, k)`. Rows are closed loops
 * when `closed`.
 */
function surface(p: Part, grid: V3[][], closed: boolean, inside: (q: V3, k: number) => V3) {
  const K = grid.length, N = grid[0].length
  const at = (k: number, i: number) => grid[clamp(k, 0, K - 1)][closed ? ((i % N) + N) % N : clamp(i, 0, N - 1)]
  const nrm = grid.map((row, k) => row.map((q, i) => {
    let n = cross(sub(at(k, i + 1), at(k, i - 1)), sub(at(k + 1, i), at(k - 1, i)))
    const out = sub(q, inside(q, k))
    if (len(n) < 1e-9) n = out
    n = unit(n)
    return dot(n, out) < 0 ? mul(n, -1) : n
  }))
  const M = closed ? N : N - 1
  for (let k = 0; k < K - 1; k++)
    for (let i = 0; i < M; i++) {
      const j = (i + 1) % N
      const a = grid[k][i], b = grid[k][j], c = grid[k + 1][j], d = grid[k + 1][i]
      const na = nrm[k][i], nb = nrm[k][j], nc = nrm[k + 1][j], nd = nrm[k + 1][i]
      if (len(sub(a, b)) > 1e-6 && len(sub(b, c)) > 1e-6) p.tri(a, b, c, undefined, undefined, undefined, [na, nb, nc])
      if (len(sub(c, d)) > 1e-6 && len(sub(d, a)) > 1e-6) p.tri(a, c, d, undefined, undefined, undefined, [na, nc, nd])
    }
}

/**
 * A tube swept along `path` (parallel-transported frames), radius per point;
 * `flat` squashes the section along the frame's binormal. Ends taper to the
 * radii given (give ~0.03 to close them).
 */
function tube(p: Part, path: V3[], radii: number[], n: number, flat = 1, up: V3 = [0, 0, 1]) {
  const K = path.length
  const T = path.map((_, k) => unit(sub(path[Math.min(k + 1, K - 1)], path[Math.max(k - 1, 0)])))
  let N = sub(up, mul(T[0], dot(up, T[0])))
  if (len(N) < 1e-6) N = sub([1, 0, 0], mul(T[0], T[0][0]))
  N = unit(N)
  const grid: V3[][] = []
  for (let k = 0; k < K; k++) {
    if (k > 0) N = unit(sub(N, mul(T[k], dot(N, T[k]))))
    const B = cross(T[k], N)
    grid.push(Array.from({ length: n }, (_, i) => {
      const t = (i / n) * TAU
      return add(path[k], add(mul(N, radii[k] * Math.cos(t)), mul(B, radii[k] * flat * Math.sin(t))))
    }))
  }
  surface(p, grid, true, (_q, k) => path[k])
}

/** A rounded section point at angle t (front = +y at t = pi/2). */
const sec = (a: number, bf: number, bb: number, t: number, e = 0.82): [number, number] => {
  const c = Math.cos(t), s = Math.sin(t)
  return [a * Math.sign(c) * Math.abs(c) ** e, (s > 0 ? bf : bb) * Math.sign(s) * Math.abs(s) ** e]
}

/** A raised fold: height h, width w, along the segment (x0, z0)-(x1, z1) on a surface's (x, z) map. */
type Fold = { x0: number; z0: number; x1: number; z1: number; h: number; w: number; side: 1 | -1 }
function foldAt(f: Fold, x: number, z: number) {
  const dx = f.x1 - f.x0, dz = f.z1 - f.z0, L2 = dx * dx + dz * dz || 1
  const t = clamp(((x - f.x0) * dx + (z - f.z0) * dz) / L2, 0, 1)
  const d = Math.hypot(x - (f.x0 + dx * t), z - (f.z0 + dz * t))
  return f.h * Math.exp(-((d / f.w) ** 2))
}

/** Mirror a part across x = 0, keeping every face wound outward. */
function mirrorX(p: Part) {
  for (let t = 0; t < p.pos.length / 9; t++) {
    for (let v = 0; v < 3; v++) { p.pos[t * 9 + v * 3] *= -1; p.nrm[t * 9 + v * 3] *= -1 }
    for (const arr of [p.pos, p.nrm]) for (let k = 0; k < 3; k++) {
      const a = t * 9 + 3 + k, b = t * 9 + 6 + k
      ;[arr[a], arr[b]] = [arr[b], arr[a]]
    }
    const a = t * 6 + 2, b = t * 6 + 4
    ;[p.uv[a], p.uv[b]] = [p.uv[b], p.uv[a]]; [p.uv[a + 1], p.uv[b + 1]] = [p.uv[b + 1], p.uv[a + 1]]
  }
}

// ------------------------------------------------------------ dimensions ---
const STEP = 0.45 // the ring of steps
const TOWER = 9.85 // the shaft, from the steps to the cornice's foot
const CORNICE = STEP + TOWER + 1.45 // the parapet's top, the balcony's rim (11.75)
const FLOOR = CORNICE - 0.25 // the balcony's floor
const GLOBE: V3 = [0, 0, CORNICE + 0.75], GR = 4.35, GZ = 4.35 // a round ball, its equator just above the frieze
const FEET = 17.6 // the robe is authored from here...
const HEM = 19.0 // ...and drawn from here: the lower robe is compressed to make room for the taller globe
/** Map an authored height on the lower robe to its drawn height (unchanged above the waist). */
const lz = (z: number) => (z >= 28.2 ? z : 28.2 - ((28.2 - z) * (28.2 - HEM)) / (28.2 - FEET))
const BAYS = 12

function build(R: number) {
  const metal = new Part(), facePart = new Part(), stone = new Part(), teal = new Part(), glass = new Part(), door = new Part()

  // ================================================== the tower (stone) ===
  // Three low round steps, then a slender twelve-sided shaft tapering
  // upward, a pier at each corner, two tiers of narrow round-arched
  // stained-glass windows in each bay, and a corbelled cornice flaring to the
  // balcony's parapet.
  {
    const NS = R > 1 ? 48 : 20
    const ring = (r: number, z: number, n = NS): V3[] => Array.from({ length: n }, (_, i) => { const t = (i / n) * TAU; return [r * Math.cos(t), r * Math.sin(t), z] as V3 })
    const steps = [[5.55, 0.15], [5.3, 0.3], [5.05, STEP]]
    let z0 = 0
    for (const [r, z1] of steps) {
      stone.loft([ring(r, z0 === 0 ? 0 : z0 - 0.001), ring(r, z1)])
      // The tread: an annulus from this riser in to the next one (or the shaft).
      const inner = r - 0.3
      const o = ring(r, z1), i = ring(inner, z1)
      for (let k = 0; k < NS; k++) { const l = (k + 1) % NS; stone.quad(i[k], o[k], o[l], i[l]) }
      z0 = z1
    }

    // The shaft: apothem tapers 4.2 -> 3.85. Faces centred on +y and every 30 degrees.
    const apo = (z: number) => lerp(4.2, 3.85, (z - STEP) / TOWER)
    const ang = (k: number) => Math.PI / 2 + (k * TAU) / BAYS // face centre direction
    const corner = (k: number, z: number): V3 => {
      const a = ang(k) + Math.PI / BAYS, r = apo(z) / Math.cos(Math.PI / BAYS)
      return [r * Math.cos(a), r * Math.sin(a), z]
    }
    const zt = STEP + TOWER
    for (let k = 0; k < BAYS; k++) {
      const a0 = corner(k - 1, STEP), a1 = corner(k, STEP), b1 = corner(k, zt), b0 = corner(k - 1, zt)
      stone.quad(a0, a1, b1, b0)
    }
    stone.cap(Array.from({ length: BAYS }, (_, k) => corner(k, zt)), true)

    // Piers: a bevelled block at each corner, standing 0.3 proud.
    for (let k = 0; k < BAYS; k++) {
      const sec6 = (z: number): V3[] => {
        const c = corner(k, z), out = unit([c[0], c[1], 0]), tan: V3 = [-out[1], out[0], 0]
        const P = (t: number, o: number): V3 => add(c, add(mul(tan, t), mul(out, o)))
        return [P(-0.4, -0.3), P(-0.4, 0.16), P(-0.26, 0.3), P(0.26, 0.3), P(0.4, 0.16), P(0.4, -0.3)]
      }
      const rings = [sec6(STEP), sec6(zt + 0.2)]
      for (let i = 0; i < 6; i++) {
        const j = (i + 1) % 6
        stone.quad(rings[0][i], rings[0][j], rings[1][j], rings[1][i])
      }
    }

    // Windows: narrow round-arched panels 0.04 proud of each bay's face,
    // stone showing broadly between them; dark by day, glowing at night.
    const face = (k: number, s: number, z: number, off: number): V3 => {
      const a = corner(k - 1, z), b = corner(k, z), m = lerp3(a, b, 0.5 + s / len(sub(b, a)))
      const n: V3 = [Math.cos(ang(k)), Math.sin(ang(k)), 0]
      return add(m, mul(n, off))
    }
    const arched = (part: Part, k: number, w: number, zb: number, zs: number, roundTop: boolean) => {
      const hw = w / 2, segs = R > 1 ? 8 : 6
      const outline: [number, number][] = [[-hw, zb], [hw, zb], [hw, zs]]
      if (roundTop) for (let i = 1; i < segs; i++) { const t = (i / segs) * Math.PI; outline.push([hw * Math.cos(t), zs + hw * Math.sin(t)]) }
      outline.push([-hw, zs])
      const pts = outline.map(([s, z]) => face(k, s, z, 0.04))
      for (let i = 1; i < pts.length - 1; i++) part.tri(pts[0], pts[i], pts[i + 1])
    }
    for (let k = 0; k < BAYS; k++) {
      if (k === 0) {
        arched(door, k, 1.0, STEP + 0.02, STEP + 2.3, true) // the entrance
        arched(glass, k, 0.75, STEP + 3.3, STEP + 4.3, true)
      } else arched(glass, k, 0.75, STEP + 1.1, STEP + 4.3, true)
      arched(glass, k, 0.8, STEP + 5.4, STEP + 8.4, true)
    }

    // The cornice: corbels flaring out to the parapet, then the parapet's
    // inner wall down to the balcony floor.
    const NC = R > 1 ? 72 : 24
    const corb = (r: number, z: number, amp: number): V3[] => Array.from({ length: NC }, (_, i) => {
      const t = (i / NC) * TAU
      const rr = r + amp * Math.max(0, Math.cos(BAYS * 2 * (t - Math.PI / 2))) ** 2
      return [rr * Math.cos(t), rr * Math.sin(t), z] as V3
    })
    const cr = R > 1
      ? [corb(4.12, zt - 0.4, 0), corb(4.35, zt + 0.2, 0.14), corb(4.85, zt + 0.7, 0.22), corb(5.35, zt + 1.0, 0.12), corb(5.6, zt + 1.2, 0), corb(5.6, CORNICE, 0)]
      : [corb(4.12, zt - 0.4, 0), corb(4.4, zt + 0.2, 0), corb(4.95, zt + 0.75, 0), corb(5.6, zt + 1.2, 0), corb(5.6, CORNICE, 0)]
    stone.loft(cr)
    const rim = cr[cr.length - 1], inn = corb(5.35, CORNICE, 0), flo = corb(5.35, FLOOR, 0)
    for (let k = 0; k < NC; k++) { const l = (k + 1) % NC; stone.quad(inn[k], rim[k], rim[l], inn[l]) }
    for (let k = 0; k < NC; k++) { const l = (k + 1) % NC; stone.quad(inn[k], inn[l], flo[l], flo[k]) }
    stone.cap(flo, true)
  }

  // ================================================ the frieze (teal) ===
  // A band of rounded upright leaf-shells round the globe's foot, on the
  // parapet: a thin wall whose top runs in round scallops, each shell
  // bulging a little outward.
  {
    const NL = R > 1 ? 30 : 18, per = R > 1 ? 6 : 3
    const N = NL * per
    const rOut = 5.5, rIn = 5.3, zb = CORNICE - 0.05, base = 0.2, lobe = 0.5
    const col = (i: number) => {
      const f = (i % per) / per, t = (i / N) * TAU
      const s = 2 * (f - 0.5) // -1..1 across a shell, its edges at the dips
      const top = zb + base + lobe * Math.sqrt(Math.max(0, 1 - s * s))
      const bulge = 0.12 * (1 - s * s)
      const lean = 0.18 // leaning outward at the top
      const P = (r: number, z: number): V3 => [r * Math.cos(t), r * Math.sin(t), z]
      return { ob: P(rOut + bulge * 0.3, zb), ot: P(rOut + bulge + lean, top), ib: P(rIn, zb), it: P(rIn + bulge * 0.5 + lean, top - 0.04) }
    }
    const cols = Array.from({ length: N }, (_, i) => col(i))
    for (let i = 0; i < N; i++) {
      const a = cols[i], b = cols[(i + 1) % N]
      teal.quad(a.ob, b.ob, b.ot, a.ot)
      teal.quad(b.ib, a.ib, a.it, b.it)
      teal.quad(a.ot, b.ot, b.it, a.it)
    }
  }

  // =================================================== the globe ===
  // A broad, slightly flattened dome nearly as wide as the cornice, sitting
  // straight on the balcony.
  {
    const NU = R > 1 ? 48 : 20, NV = R > 1 ? 14 : 6
    const lat0 = Math.asin(Math.max(-1, (FLOOR - 0.1 - GLOBE[2]) / GZ))
    const grid: V3[][] = []
    for (let k = 0; k <= NV; k++) {
      const la = lerp(lat0, Math.PI / 2, k / NV)
      const r = GR * Math.cos(la), z = GLOBE[2] + GZ * Math.sin(la)
      grid.push(Array.from({ length: NU }, (_, i) => { const t = (i / NU) * TAU; return [r * Math.cos(t), r * Math.sin(t), z] as V3 }))
    }
    surface(metal, grid, true, () => GLOBE)
  }
  const onGlobe = (x: number, y: number) => GLOBE[2] + GZ * Math.sqrt(Math.max(0, 1 - (x * x + y * y) / (GR * GR)))
  // ================================================ the serpent ===
  // A thick body coiled one and a half times on the globe's crown, the tail
  // at the back, the head rearing at the front on her left with open jaws.
  {
    const ctrl: V3[] = []
    const turns: [number, number, number][] = [] // [angle deg, radius, lift]
    // tail behind, first (lower) turn widening, then the upper turn under the feet
    for (const [a, r, lift] of [
      [-130, 3.4, 0.3], [-90, 3.25, 0.65], [-40, 3.1, 0.9], [10, 3.0, 1.0], [60, 2.95, 1.05], [110, 2.95, 1.05], [160, 2.9, 1.05],
      [210, 2.85, 1.1], [255, 2.55, 1.7], [300, 2.3, 2.15], [345, 2.2, 2.25], [385, 2.3, 2.15], [420, 2.6, 1.9],
    ] as [number, number, number][]) turns.push([a, r, lift])
    for (const [a, r, lift] of turns) {
      const t = (a * Math.PI) / 180, x = r * Math.cos(t), y = r * Math.sin(t)
      ctrl.push([x, y, onGlobe(x, y) + lift])
    }
    // the neck rears forward and out on her left, then the head
    const neck0 = ctrl[ctrl.length - 1]
    ctrl.push([neck0[0] + 0.3, neck0[1] + 0.8, neck0[2] + 0.2], [1.8, 3.3, 17.7])
    const per = R > 1 ? 6 : 2
    const path = spline(ctrl, per)
    const rad0 = [0.05, 0.5, 0.85, 1.0, 1.05, 1.08, 1.08, 1.05, 1.0, 0.95, 0.9, 0.88, 0.82, 0.74, 0.68]
    const rad = splineN(rad0, per)
    tube(metal, path, rad, R > 1 ? 16 : 8, 0.9)

    // The head: a blunt skull, then the upper jaw and the gaping lower jaw.
    const hb: V3 = [1.8, 3.3, 17.7], dir = unit([0.25, 1, 0.1])
    const side = unit(cross(dir, [0, 0, 1])), upv = cross(side, dir)
    const at = (f: number, u: number, s = 0): V3 => add(hb, add(mul(dir, f), add(mul(upv, u), mul(side, s))))
    const n = R > 1 ? 14 : 8
    const loftAlong = (pts: V3[], ws: number[], hs: number[]) => {
      const grid = pts.map((c, k) => Array.from({ length: n }, (_, i) => {
        const t = (i / n) * TAU
        return add(c, add(mul(side, ws[k] * Math.cos(t)), mul(upv, hs[k] * Math.sin(t))))
      }))
      surface(metal, grid, true, (_q, k) => pts[k])
    }
    loftAlong([at(-0.5, 0), at(0, 0.1), at(0.5, 0.15), at(0.9, 0.1)], [0.62, 0.78, 0.74, 0.55], [0.6, 0.72, 0.62, 0.45])
    // upper jaw: forward and a little up
    loftAlong([at(0.6, 0.2), at(1.2, 0.35), at(1.8, 0.45), at(2.1, 0.45)], [0.55, 0.48, 0.36, 0.05], [0.3, 0.26, 0.2, 0.05])
    // lower jaw: dropped open
    loftAlong([at(0.6, -0.2), at(1.1, -0.45), at(1.6, -0.7), at(1.85, -0.8)], [0.5, 0.42, 0.3, 0.05], [0.22, 0.2, 0.15, 0.05])
    // brow ridges / horns swept back
    for (const s of [-1, 1]) tube(metal, [at(0.35, 0.55, s * 0.4), at(-0.1, 0.85, s * 0.5), at(-0.6, 1.0, s * 0.55)], [0.18, 0.12, 0.03], R > 1 ? 8 : 5)
  }

  // ============================================== the crescent moon ===
  // Its horns rise either side of the feet, curving in.
  {
    const c: V3 = [0.15, 0.8, 21.15], r = 3.0
    const N = R > 1 ? 28 : 8
    const pts: V3[] = [], rads: number[] = []
    for (let i = 0; i <= N; i++) {
      const a = lerp(188, 352, i / N) * (Math.PI / 180)
      const u = i / N
      pts.push([c[0] + r * Math.cos(a), c[1] - 0.25 * Math.sin(Math.PI * u), c[2] + r * Math.sin(a)])
      rads.push(0.03 + 0.5 * Math.sin(Math.PI * u) ** 0.7)
    }
    // flattened front to back: a blade seen from the front
    tube(metal, pts, rads, R > 1 ? 12 : 7, 0.45, [0, 1, 0])
  }

  // ======================================================= the figure ===
  // The robe, lofted from the hem to the neck. Columns: z, centre x,
  // centre y, half-width, half-depth to the front, half-depth to the back.
  // The centre drifts to her left as it rises (the dancing sway) and the
  // robe trails back over the serpent at the hem.
  const body = [
    [FEET, -0.05, 0.05, 2.35, 1.95, 3.2],
    [18.4, -0.12, 0.05, 2.22, 1.8, 2.95],
    [20.0, -0.25, 0.05, 2.08, 1.68, 2.6],
    [22.5, -0.45, 0.05, 2.02, 1.6, 2.2],
    [25.0, -0.62, 0.02, 2.12, 1.5, 1.75],
    [26.6, -0.55, 0.02, 2.0, 1.4, 1.45],
    [28.2, -0.32, 0.05, 1.75, 1.3, 1.22],
    [30.0, -0.05, 0.1, 1.8, 1.38, 1.18],
    [32.0, 0.15, 0.12, 2.2, 1.5, 1.25],
    [33.8, 0.3, 0.08, 2.5, 1.42, 1.3],
    [34.6, 0.4, 0.04, 2.48, 1.32, 1.28],
    [35.2, 0.5, 0.0, 2.3, 1.18, 1.22],
    [35.75, 0.7, 0.0, 1.8, 1.0, 1.05],
    [36.2, 0.9, 0.05, 0.85, 0.7, 0.75],
    [36.6, 1.0, 0.08, 0.6, 0.55, 0.6],
  ]
  const bodyAt = (z: number) => interp(body, z)
  {
    const front: Fold[] = [
      { x0: 0.95, z0: 23.6, x1: 0.95, z1: 21.4, h: 0.38, w: 0.85, side: 1 },   // her left knee, bent forward
      { x0: 0.95, z0: 21.0, x1: 1.3, z1: FEET, h: 0.3, w: 0.45, side: 1 },     // the fold falling from it
      { x0: 1.9, z0: 33.6, x1: -1.6, z1: 25.8, h: 0.42, w: 0.5, side: 1 },     // the mantle wrapped diagonally across the body
      { x0: 1.7, z0: 29.6, x1: -2.2, z1: 22.6, h: 0.4, w: 0.45, side: 1 },
      { x0: -2.2, z0: 27.0, x1: 1.4, z1: 21.2, h: 0.3, w: 0.45, side: 1 },     // its edge drawn back across the thighs
      { x0: -1.3, z0: 26.0, x1: -1.55, z1: FEET + 0.2, h: 0.3, w: 0.4, side: 1 }, // straight folds down her right leg
      { x0: -0.3, z0: 22.0, x1: -0.45, z1: FEET + 0.2, h: 0.22, w: 0.35, side: 1 },
      { x0: -0.6, z0: 36.0, x1: -1.1, z1: 31.6, h: 0.24, w: 0.3, side: 1 },     // the veil's edges down the chest
      { x0: 1.2, z0: 35.9, x1: 1.35, z1: 32.2, h: 0.24, w: 0.3, side: 1 },
      { x0: -0.6, z0: 33.4, x1: -0.6, z1: 33.4, h: 0.22, w: 0.55, side: 1 },     // the breast
      { x0: 0.75, z0: 33.4, x1: 0.75, z1: 33.4, h: 0.22, w: 0.55, side: 1 },
      { x0: -2.0, z0: 33.0, x1: 1.6, z1: 24.0, h: 0.24, w: 0.6, side: -1 },     // folds across the back
      { x0: 1.8, z0: 30.0, x1: -1.0, z1: 20.0, h: 0.22, w: 0.6, side: -1 },
      { x0: 0, z0: 26.0, x1: 0.2, z1: FEET, h: 0.28, w: 0.5, side: -1 },        // the train's central fold
    ]
    const NU = R > 1 ? 104 : 30
    const zs = R > 1
      ? Array.from({ length: 51 }, (_, k) => lerp(FEET, 36.6, k / 50))
      : [FEET, 18.4, 19.4, 20.6, 21.8, 23.0, 24.2, 25.4, 26.6, 27.6, 28.6, 29.6, 30.8, 32.0, 33.2, 34.3, 35.2, 35.75, 36.2, 36.6]
    const grid: V3[][] = [], centres: V3[] = []
    // the hem turned under, closing the bottom
    for (const [scale, dz] of [[0.05, 0.25], [0.88, -0.05]] as [number, number][]) {
      const [cx, cy, a, bf, bb] = bodyAt(FEET)
      centres.push([cx, cy, HEM])
      grid.push(Array.from({ length: NU }, (_, i) => { const [x, y] = sec(a * scale, bf * scale, bb * scale, (i / NU) * TAU); return [cx + x, cy + y, HEM + dz] as V3 }))
    }
    for (const z of zs) {
      const [cx, cy, a, bf, bb] = bodyAt(z)
      centres.push([cx, cy, lz(z)])
      grid.push(Array.from({ length: NU }, (_, i) => {
        const t = (i / NU) * TAU, s = Math.sin(t)
        let [x, y] = sec(a, bf, bb, t)
        let bump = 0
        for (const f of front) if (f.side * s > 0) bump += foldAt(f, x + cx, z) * Math.min(1, Math.abs(s) * 1.6)
        // deep vertical folds in the falling robe, twisting a little with the sway
        const amp = 0.16 * smooth((25.5 - z) / 6) + 0.05 * smooth((31 - z) / 3)
        bump += amp * Math.cos(11 * t + 0.25 * (z - FEET))
        const r = Math.hypot(x, y) || 1
        x += (x / r) * bump; y += (y / r) * bump
        return [cx + x, cy + y, lz(z)] as V3
      }))
    }
    // close the neck inside the head
    { const [cx, cy] = bodyAt(36.6); centres.push([cx, cy, 37.0]); grid.push(Array.from({ length: NU }, () => [cx, cy, 37.0] as V3)) }
    surface(metal, grid, true, (_q, k) => centres[k])
  }

  // -------------------------------------------------------- the head ---
  // Built in its own frame at the neck, then inclined to her left (14
  // degrees) and bowed a little forward.
  const NECK: V3 = [1.0, 0.15, 36.45]
  const HS = 0.76 // the head with its veil; smaller than first drawn, which read as a heavy hood beside the photos
  const roll = (18 * Math.PI) / 180, nod = (6 * Math.PI) / 180
  const headTo = (q: V3): V3 => {
    let [x, y, z] = q
    ;[x, z] = [x * Math.cos(roll) + z * Math.sin(roll), -x * Math.sin(roll) + z * Math.cos(roll)]
    ;[y, z] = [y * Math.cos(nod) + z * Math.sin(nod), -y * Math.sin(nod) + z * Math.cos(nod)]
    return add(NECK, mul([x, y, z], HS))
  }
  {
    // local h, half-width, front, back (veil included)
    const prof = [
      [-0.7, 0.85, 0.7, 0.9], [-0.2, 0.82, 0.7, 0.92], [0.35, 0.86, 0.72, 0.98], [0.9, 0.98, 1.02, 1.08],
      [1.5, 1.02, 1.12, 1.12], [2.05, 0.98, 1.06, 1.1], [2.5, 0.86, 0.9, 1.0], [2.8, 0.64, 0.66, 0.8],
      [2.98, 0.34, 0.35, 0.45], [3.05, 0.05, 0.05, 0.05],
    ]
    const feats: Fold[] = [
      { x0: 0, z0: 1.1, x1: 0, z1: 1.95, h: 0.26, w: 0.17, side: 1 },      // the nose ridge
      { x0: -0.48, z0: 2.0, x1: 0.48, z1: 2.0, h: 0.16, w: 0.13, side: 1 },   // the brow
      { x0: 0, z0: 0.55, x1: 0, z1: 0.62, h: 0.22, w: 0.24, side: 1 },      // the chin
      { x0: -0.6, z0: 1.15, x1: -0.6, z1: 1.55, h: 0.08, w: 0.22, side: 1 }, // the cheeks
      { x0: 0.6, z0: 1.15, x1: 0.6, z1: 1.55, h: 0.08, w: 0.22, side: 1 },
      { x0: -0.33, z0: 1.78, x1: -0.33, z1: 1.78, h: -0.08, w: 0.16, side: 1 }, // the eyes
      { x0: 0.33, z0: 1.78, x1: 0.33, z1: 1.78, h: -0.08, w: 0.16, side: 1 },
      { x0: -0.16, z0: 0.92, x1: 0.16, z1: 0.92, h: -0.05, w: 0.06, side: 1 }, // the mouth
    ]
    const NU = R > 1 ? 72 : 20, NV = R > 1 ? 44 : 14
    const grid: V3[][] = [], centres: V3[] = []
    for (let k = 0; k <= NV; k++) {
      const h = lerp(-0.7, 3.05, 1 - (1 - k / NV) ** 1.2)
      const [a, bf, bb] = interp(prof, h)
      centres.push(headTo([0, 0, h]))
      grid.push(Array.from({ length: NU }, (_, i) => {
        const t = (i / NU) * TAU, sn = Math.sin(t)
        let [x, y] = sec(a, bf, bb, t, 1.0)
        const r0 = Math.hypot(x, y) || 1
        let dr = 0
        // The face: a forward-facing oval standing a little proud of the
        // veil's edge, so it catches the light, with the veil and hair
        // framing it and falling behind to the shoulders.
        const fx = a * Math.cos(t)
        const ov = 1 - (fx / 0.66) ** 2 - ((h - 1.35) / 1.05) ** 2 // > 0 inside the oval
        const face = sn > 0 ? smooth(ov / 0.18) * smooth((sn - 0.35) / 0.25) : 0
        dr += face * 0.2
        // the veil's edge, a soft ridge just outside the oval on the sides and brow
        const edge = sn > 0.2 ? Math.exp(-(((ov + 0.12) / 0.12) ** 2)) * smooth((h - 0.2) / 0.4) : 0
        dr += edge * 0.07
        dr -= smooth((sn - 0.5) / 0.3) * 0.35 * smooth((0.35 - h) / 0.5) // the throat under the chin
        if (sn > 0) for (const f of feats) dr += foldAt(f, fx, h) * face
        // the veil's soft folds down the sides and back, and its fall behind
        dr += (1 - face) * 0.05 * Math.cos(9 * t) * smooth((2.3 - h) / 1.0)
        dr += smooth((-sn - 0.2) / 0.5) * 0.12 * smooth((0.6 - h) / 0.8)
        x += (x / r0) * dr; y += (y / r0) * dr
        return headTo([x, y, h])
      }))
    }
    surface(metal, grid, true, (_q, k) => centres[k])

    // The face, smoother and brighter in the photos than the seamed veil: a
    // clean oval shell of its own lighter finish laid over the head's face,
    // with the brow, nose ridge and chin, so the oval reads from the city.
    const NF = R > 1 ? 36 : 14, rings = R > 1 ? [0, 0.2, 0.4, 0.6, 0.8, 0.92, 1] : [0, 0.5, 0.85, 1]
    const fgrid: V3[][] = [], fcent: V3[] = []
    for (const sr of rings) {
      fcent.push(headTo([0, 1.2, 1.35]))
      fgrid.push(Array.from({ length: NF }, (_, i) => {
        const ph = (i / NF) * TAU
        const fx = 0.6 * Math.max(sr, 0.001) * Math.cos(ph), h = 1.35 + 0.95 * Math.max(sr, 0.001) * Math.sin(ph)
        const [a, bf] = interp(prof, h)
        const yb = bf * Math.sqrt(Math.max(0, 1 - (fx / a) ** 2))
        let y = yb + 0.36 + 0.1 * Math.sqrt(Math.max(0, 1 - sr * sr))
        for (const f of feats) y += foldAt(f, fx, h) * 0.9
        return headTo([fx, y, h])
      }))
    }
    surface(facePart, fgrid, true, (_q, k) => fcent[k])
  }

  // ---------------------------------------------------- the ring of stars ---
  {
    const c: V3 = [0, -0.6, 3.7], rr = 2.75, tilt = (30 * Math.PI) / 180
    // ring plane: x across, v up-and-back; normal faces forward and up
    const vx: V3 = [1, 0, 0], vy: V3 = [0, -Math.sin(tilt), Math.cos(tilt)], nn: V3 = unit(cross(vx, vy))
    const onRing = (a: number, r = rr): V3 => headTo(add(c, add(mul(vx, r * Math.cos(a)), mul(vy, r * Math.sin(a)))))
    const a0 = -Math.PI / 2 + (35 * Math.PI) / 180, a1 = -Math.PI / 2 + TAU - (35 * Math.PI) / 180
    const NR = R > 1 ? 48 : 22
    const ringPts = Array.from({ length: NR + 1 }, (_, i) => onRing(lerp(a0, a1, i / NR)))
    tube(metal, ringPts, ringPts.map((_, i) => (i === 0 || i === NR ? 0.03 : 0.08)), R > 1 ? 6 : 4)
    const nW = unit(sub(headTo(add(c, nn)), headTo(c)))
    for (let s = 0; s < 12; s++) {
      const a = lerp(a0 + 0.12, a1 - 0.12, s / 11)
      const p = onRing(a)
      const radial = unit(sub(p, headTo(c))), tang = cross(nW, radial)
      const pt = (k: number, depth: number): V3 => {
        const ang = (k / 10) * TAU, r = k % 2 === 0 ? 0.42 : 0.18
        return add(p, add(mul(radial, r * Math.cos(ang)), add(mul(tang, r * Math.sin(ang)), mul(nW, depth))))
      }
      const fr = Array.from({ length: 10 }, (_, k) => pt(k, 0.08)), bk = Array.from({ length: 10 }, (_, k) => pt(k, -0.08))
      const cf = add(p, mul(nW, 0.14)), cb = add(p, mul(nW, -0.14))
      for (let k = 0; k < 10; k++) {
        const l = (k + 1) % 10
        metal.tri(cf, fr[k], fr[l])
        metal.tri(cb, bk[l], bk[k])
        metal.quad(fr[l], fr[k], bk[k], bk[l])
      }
    }
  }

  // ======================================================== the arms ===
  // Her right arm raised, the hand open and upright at her head's height,
  // a sleeve hanging from the elbow; her left forearm drawn across her
  // waist, the fist holding the serpent's chain.
  {
    const NA = R > 1 ? 16 : 9
    const per = R > 1 ? 5 : 2
    // right arm (-x): shoulder, elbow out and down, forearm up
    const rArm: V3[] = [[-1.6, -0.05, 35.0], [-2.55, 0.2, 34.2], [-3.35, 0.55, 32.7], [-3.75, 0.85, 33.6], [-3.95, 1.0, 35.0], [-4.0, 1.05, 35.55]]
    tube(metal, spline(rArm, per), splineN([1.05, 1.0, 1.08, 0.9, 0.55, 0.36], per), NA)
    // the hanging sleeve under the forearm and elbow
    tube(metal, spline([[-3.6, 0.75, 33.6], [-3.45, 0.62, 32.3], [-3.2, 0.45, 31.0], [-3.05, 0.35, 30.4]], per), splineN([0.8, 0.8, 0.55, 0.04], per), NA, 0.55, [1, 0, 0])
    // the open hand, palm forward, fingers up
    {
      const base: V3 = [-4.0, 1.05, 35.55]
      const up = unit([-0.1, 0.12, 1]), across: V3 = [1, 0, 0]
      const hand = (h: number, w: number, d: number, dx = 0): V3[] => Array.from({ length: NA }, (_, i) => {
        const t = (i / NA) * TAU
        return add(base, add(mul(up, h), add(mul(across, dx + w * Math.cos(t)), [0, d * Math.sin(t), 0])))
      })
      if (R > 1) {
        surface(metal, [hand(-0.05, 0.36, 0.22), hand(0.35, 0.44, 0.17), hand(0.75, 0.45, 0.15)], true, (_q, k) => add(base, mul(up, [-0.05, 0.35, 0.75][k])))
        for (const [dx, l] of [[-0.31, 0.6], [-0.1, 0.78], [0.11, 0.74], [0.31, 0.58]] as [number, number][]) {
          const f0 = add(base, add(mul(up, 0.7), [dx, 0.02, 0])), dir = unit([dx * 0.35, 0.05, 1])
          tube(metal, [f0, add(f0, mul(dir, l * 0.5)), add(f0, mul(dir, l)), add(f0, mul(dir, l + 0.06))], [0.1, 0.09, 0.075, 0.02], 8)
        }
        tube(metal, [add(base, [0.35, 0.05, 0.2]), add(base, [0.62, 0.12, 0.5]), add(base, [0.75, 0.15, 0.72]), add(base, [0.78, 0.15, 0.78])], [0.12, 0.1, 0.08, 0.02], 8)
      } else {
        surface(metal, [hand(-0.05, 0.36, 0.22), hand(0.4, 0.45, 0.17), hand(1.0, 0.42, 0.13), hand(1.35, 0.3, 0.1), hand(1.45, 0.05, 0.03)], true, (_q, k) => add(base, mul(up, [-0.05, 0.4, 1.0, 1.35, 1.45][k])))
        tube(metal, [add(base, [0.35, 0.05, 0.2]), add(base, [0.62, 0.12, 0.5]), add(base, [0.78, 0.15, 0.78])], [0.13, 0.1, 0.03], 6)
      }
    }
    // left arm (+x): down her side, the forearm across the waist
    const lArm: V3[] = [[1.75, 0.0, 34.9], [2.55, 0.15, 33.4], [2.8, 0.5, 31.4], [2.0, 1.35, 30.8], [0.5, 1.8, 30.9], [-0.9, 1.75, 31.0]]
    tube(metal, spline(lArm, per), splineN([1.05, 1.0, 1.0, 0.9, 0.8, 0.45], per), NA)
    // the sleeve's fall under the left forearm
    tube(metal, spline([[1.6, 1.3, 30.6], [0.9, 1.5, 29.9], [0.2, 1.65, 29.6], [-0.3, 1.7, 29.8]], per), splineN([0.55, 0.65, 0.5, 0.04], per), NA, 0.6, [0, 1, 0])
    // the fist round the chain
    tube(metal, [[-0.75, 1.75, 31.0], [-1.0, 1.8, 31.0], [-1.35, 1.8, 30.95], [-1.55, 1.78, 30.9]], [0.42, 0.5, 0.45, 0.05], NA)
  }

  // ======================================================= the chain ===
  // From her left fist down her right side to the serpent's neck.
  {
    const ch: V3[] = ([[-1.45, 1.85, 30.7], [-2.0, 2.0, 28.0], [-2.35, 2.05, 24.5], [-2.45, 2.1, 21.0], [-2.25, 2.35, 18.6], [-1.8, 2.75, 17.1]] as V3[]).map(([x, y, z]) => [x, y, lz(z)] as V3)
    if (R > 1) {
      const path = spline(ch, 12)
      // links along the path, alternating flat and edge-on
      const L = [0]
      for (let i = 1; i < path.length; i++) L.push(L[i - 1] + len(sub(path[i], path[i - 1])))
      const total = L[L.length - 1], step = 0.5
      const pAt = (s: number): V3 => {
        let i = 1
        while (i < L.length - 1 && L[i] < s) i++
        return lerp3(path[i - 1], path[i], (s - L[i - 1]) / (L[i] - L[i - 1] || 1))
      }
      for (let k = 0; k * step + step <= total; k++) {
        const a = pAt(k * step), b = pAt(k * step + step), c = lerp3(a, b, 0.5)
        const d = unit(sub(b, a))
        const ref: V3 = k % 2 ? [1, 0, 0] : [0, 1, 0]
        const w = unit(cross(d, ref))
        const loop: V3[] = []
        const NLk = 10
        for (let i = 0; i <= NLk; i++) {
          const t = (i / NLk) * TAU
          loop.push(add(c, add(mul(d, 0.36 * Math.cos(t)), mul(w, 0.2 * Math.sin(t)))))
        }
        tube(metal, loop, loop.map(() => 0.07), 5)
      }
    } else {
      const path = spline(ch, 3)
      tube(metal, path, path.map((_, i) => (i === path.length - 1 ? 0.05 : 0.17)), 5)
    }
  }

  // ======================================================= the wings ===
  // Broad, thick wings built as stacked layers of feathers, each a cambered
  // shell from the same curved leading edge: the long primaries the full
  // chord, ending in rounded feather tips; the secondaries over them to about
  // two thirds; the short coverts on top to about a third, each layer
  // standing proud of the one under it so the steps read as rows of
  // feathers. The feathered face is the front one. Her right wing rises
  // steeply up, out and back; her left falls out and back, close to her side.
  {
    const wing = (root: V3, tip: V3, chordRef: V3, normalRef: V3, c0: number, arch: number) => {
      const s = unit(sub(tip, root)), L = len(sub(tip, root))
      let d = sub(chordRef, mul(s, dot(chordRef, s))); d = unit(d)
      let nW = cross(s, d); if (dot(nW, normalRef) < 0) nW = mul(nW, -1)
      // layers: [chord fraction, number of feather lobes, lobe depth, offset proud, thickness, span start, span end]
      const layers = R > 1
        ? [[1.0, 8, 0.16, 0, 0.5, 0, 1], [0.66, 11, 0.1, 0.13, 0.32, 0, 0.9], [0.34, 15, 0.08, 0.25, 0.26, 0, 0.78]]
        : [[1.0, 6, 0.16, 0, 0.5, 0, 1], [0.5, 9, 0.12, 0.18, 0.34, 0, 0.85]]
      const NSp = R > 1 ? 36 : 13, NCh = R > 1 ? 18 : 8
      for (const [frac, nF, depth, proud, th0, u0, u1] of layers) {
        const grid: V3[][] = [], centres: V3[] = [], inner = new Map<V3, V3>()
        for (let k = 0; k <= NSp; k++) {
          const u = lerp(u0, u1, k / NSp)
          const ul = (u - u0) / (u1 - u0)
          // the full chord: narrowest at the root, broadest past the wrist, a rounded tip
          const cFull = c0 * (0.55 + 0.55 * Math.sin(Math.PI * Math.min(1, u * 1.15))) * (1 - u ** 5) ** 0.5 + 0.08
          // this layer's feathers: round lobes along its lower edge
          const lobeS = 0.5 + 0.5 * Math.cos(TAU * nF * u)
          let c = cFull * frac * (1 - depth * (1 - lobeS)) * (frac < 1 ? (1 - ul ** 4) ** 0.5 : 1)
          c = Math.max(c, 0.05)
          // the leading edge bows up and out like a bird's wrist
          const lead = add(add(root, mul(s, L * u)), mul(d, -arch * Math.sin(Math.PI * Math.min(1, u * 1.25)) - 0.0))
          const th = th0 * (1 - 0.6 * u) + 0.05
          const cam = (v: number) => 0.45 * Math.sin(Math.PI * v * frac) * (1 - 0.5 * u) // cupped toward the back
          centres.push(add(add(lead, mul(d, c * 0.5)), mul(nW, proud - cam(0.5))))
          grid.push(Array.from({ length: NCh }, (_, i) => {
            const t = (i / NCh) * TAU
            const v = 0.5 - 0.5 * Math.cos(t)
            const thick = th * (1 - 0.7 * v) * 0.5 * Math.sin(t)
            const mid = add(add(lead, mul(d, c * v)), mul(nW, proud * (1 - 0.3 * v) - cam(v * c / Math.max(cFull, 0.1))))
            const q = add(mid, mul(nW, thick))
            inner.set(q, Math.abs(Math.sin(t)) < 0.05 ? centres[k] : mid)
            return q
          }))
        }
        surface(metal, grid, true, (q, k) => inner.get(q) ?? centres[k])
      }
    }
    // her right wing (-x): rising steeply up, out and back
    wing([-0.95, -1.35, 35.0], [-6.4, -4.8, 38.7], [0.15, -0.3, -1], [0.1, 1, 0.1], 3.6, 0.75)
    // her left wing (+x): falling out and back, close to her side
    wing([1.7, -1.3, 35.4], [6.5, -3.8, 28.0], [-0.4, -0.4, -0.8], [0.3, 1, 0.1], 3.5, 0.6)
  }

  // Everything above was authored with her right hand on -x; she faces +y,
  // so her right is east (+x): mirror the figure across x = 0.
  mirrorX(metal)
  mirrorX(facePart)

  // ===================================================== materials ===
  const zt = STEP + TOWER
  const statueLit = (_p: V3, _n: V3) => 1
  const stoneLit = (p: V3, n: V3) => (n[2] > 0.9 ? 0.15 : p[2] > zt - 0.5 ? 0.85 : 0.5)
  const parts: Array<{ part: Part; material: MaterialSpec }> = [
    // A little cool, so the map's warm-white floodlight comes out near white.
    { part: metal, material: { ...finish('panecillo-aluminium', 0x8d8e95, 0.45), floodlight: statueLit } },
    { part: facePart, material: { ...finish('panecillo-aluminium-face', 0xa9aab0, 0.45), floodlight: statueLit } },
    { part: stone, material: { ...finish('panecillo-stone', 0x6e6863), floodlight: stoneLit } },
    { part: teal, material: { ...finish('panecillo-teal', 0x5f9089), floodlight: () => 0.6 } },
    { part: glass, material: windowVariant(2, 0x4a535c) },
    { part: door, material: { name: 'entrance', color: 0x5a524c, roughness: 0.85 } },
  ]
  return parts
}

async function write(file: string, parts: Array<{ part: Part; material: MaterialSpec }>, maxTris: number, maxBytes: number) {
  const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
  if (triangles > maxTris) throw new Error(`${file}: triangle budget exceeded: ${triangles}`)
  const glb = writeGlb('Virgen de El Panecillo', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor', bearing: 20, elevation: 0, height: 41.5,
  })
  if (glb.length > maxBytes) throw new Error(`${file}: size budget exceeded: ${glb.length} bytes`)
  const out = new URL(`../models/${file}`, import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}

await write('quito-virgen-del-panecillo.glb', build(1), 6500, 250_000)
await write('quito-virgen-del-panecillo.detail.glb', build(2), 40_000, 1536 * 1024)
