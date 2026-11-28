/**
 * International Commerce Centre (ICC), West Kowloon, Hong Kong — original
 * procedural geometry, CC0-1.0.
 * bun generators/hk-international-commerce-centre.ts   (writes the low model and the detail model)
 *
 * Uses the geometry kit exported by taipei-101.ts.
 *
 * Frame: BEARING 42.3 (the square plan's faces, from OSM way/25590249), so
 * model +x = compass 132.3 (the SE face), +y = compass 42.3 (the NE face).
 * Origin = area centroid of the outline way/25590249. y = 0 is the street;
 * the tower's walls run down to it inside the Elements mall podium (OSM
 * gives the tower min_height 20 over the podium). elevation 0.
 *
 * What is modelled:
 * - the shaft: a square with re-entrant notched corners (OSM: 60.8 m across
 *   the faces, notch ~4.9 m deep), tapering gently and a little faster near
 *   the top (half-width 30.4 m to 95 m, 25.8 m at the roof);
 * - the notches as bright silver slots running the full height, with proud
 *   mullion ribs along both lips of every notch;
 * - the 6 m parapet (published) round the flat roof at 478-484 m, its top
 *   rising from 481 m at a face's middle to 484 m at the corners and its
 *   coping sloping in, as in the 201408 photo;
 * - the curved, splayed base: below 110 m each face bends out in a concave
 *   sweep to its foot, long on the NE and SW faces (OSM's stepped parts
 *   60/47/40/35 m, out to 36 m and 20 m at the face's middle), 9 m on the
 *   SE and NW and toward every corner, ending in a slightly upturned pale
 *   lip; at each corner the notch opens into a bright, narrow glass tent
 *   between the splaying faces (apex 110 m, as in the 201408 photo);
 * - the NE lobby block way/1047822864 (33 m);
 * - the refuge/plant floors seen in every photo (about 156-166, 286-292,
 *   399-411 and 466-469.5 m) as louvre bands recessed 0.9 m across every
 *   face, with louvre slats (one on the low model, every 1.2 m on the
 *   detail model);
 * - detail model: vertical mullion ribs every ~3.3 m on every face;
 * - the facade's horizontal rhythm as proud pale floor lines (every ninth
 *   floor on the low model, every third on the detail model);
 * - the night LED facade: the curtain wall is `neon-icc-facade` (it glows
 *   in its own cool blue-grey, as the LED-lit facade reads from the
 *   harbour), the floor lines, coping and corner slots `neon-icc-led`
 *   (white); the lobby tents (`window-3`) glow warm; the louvre bands
 *   (`icc-louvre`) stay unlit.
 *
 * Sources
 * - OSM (© OpenStreetMap contributors, ODbL): way/25590249 (height 484,
 *   min_height 20, 118 levels, wikidata Q317034); skirt parts
 *   way/1047822855-1047822864 and way/200726092 (skillion, 33-110 m).
 * - Published (Wikipedia "International Commerce Centre", CTBUH): 484 m
 *   including 6 m roof parapets; 108 storeys (numbered to 118); sky100 on
 *   level 100 at 393 m; the LED light show over two facades (50,000 m²).
 * - Photos (Wikimedia Commons):
 *   "Hong Kong International Commerce Centre (15512862984) 2.jpg", Bernard
 *   Spragg. NZ, CC0, from the harbour (S, corner-on): taper, skirts, notches,
 *   colour; https://commons.wikimedia.org/wiki/File:Hong_Kong_International_Commerce_Centre_(15512862984)_2.jpg
 *   "International Commerce Centre 201408.jpg", Wing1990hk, CC BY 3.0, from
 *   the W corner: the skirt's pointed tent and splay, the notch, the parapet;
 *   https://commons.wikimedia.org/wiki/File:International_Commerce_Centre_201408.jpg
 *   "International Commerce Centre 201010.JPG", T1NH0, CC BY-SA 3.0, from
 *   the harbour: plant-floor bands (heights scaled from it), the skirt;
 *   https://commons.wikimedia.org/wiki/File:International_Commerce_Centre_201010.JPG
 *   "Hong Kong International Commerce Centre; November 2014.jpg", Bernard
 *   Spragg. NZ, CC0; https://commons.wikimedia.org/wiki/File:Hong_Kong_International_Commerce_Centre;_November_2014.jpg
 *   "International Commerce Centre in 201008.jpg", WiNG, CC BY-SA 4.0;
 *   https://commons.wikimedia.org/wiki/File:International_Commerce_Centre_in_201008.jpg
 *   "International Commerce Centre on Victoria Harbour.jpg", Wilfredor, CC0,
 *   at night: the LED facade; https://commons.wikimedia.org/wiki/File:International_Commerce_Centre_on_Victoria_Harbour.jpg
 * - No lidar, no NAIP, no Mapillary token (batch notes).
 * - Look-only references: none.
 *
 * Numbers
 * - Published: 484 m to the parapet top, parapet 6 m.
 * - Measured (OSM): plan, notches, bearing; the skirt parts' extents and
 *   heights, fitted by the concave sweep d = D (1 - cos θ), z = 110 - (110 -
 *   z_foot) sin θ (it lands within 4 m of every part's height).
 * - Measured (photo, scaled to 484 m): the taper (width 1.00 at 95 m, 0.978
 *   at 210 m, 0.947 at 316 m, 0.889 at 421 m, 0.85 at the top), the skirt's
 *   apex (~110 m, agrees with OSM), the plant bands' heights.
 * - Estimated: the tent's width (a fifth of each face at the podium) and
 *   the curve of its sides; the SE/NW sweep and the corner sweep (9 m: OSM's
 *   4.4 m is only the part's top; photos show a wider hem); the lip, the
 *   recess depth, the rib and floor-line spacing and size; the parapet's
 *   slope. Glass colour: sampled from the CC0 2015 photo (sunlit #7d9096,
 *   shaded #434e5b) and the W photo, drawn at #5d7389 (a deep blue-grey,
 *   above the STYLE charcoal floor).
 *
 * Doubts
 * - The Elements mall (way/1415166820 and its parts) is a separate building
 *   under and around the tower and is not modelled; the tower is drawn down
 *   to the street inside it.
 * - The light show runs on two facades; this model puts the LED lines on all
 *   four (which two could not be settled from licensed night photos).
 * - The sweep on the SE and NW faces: OSM maps it 4.4 m deep, drawn 9 m;
 *   photos from those sides are few.
 * - The real show is coloured and animated; the model can only light the
 *   facade in one cool colour.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { K, type P2 } from './taipei-101'

const BEARING = 42.3
const ANCHOR = { lng: 114.1602256, lat: 22.3033785 }
const TOP = 484, ROOF = 478, APEX = 110, ZB = 22

const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const table = (rows: [number, number][]) => (z: number) => {
  if (z <= rows[0][0]) return rows[0][1]
  for (let i = 0; i < rows.length - 1; i++) {
    const [z0, v0] = rows[i], [z1, v1] = rows[i + 1]
    if (z <= z1) return v0 + ((v1 - v0) * (z - z0)) / (z1 - z0)
  }
  return rows[rows.length - 1][1]
}
const half = table([[0, 30.4], [95, 30.4], [210, 29.73], [316, 28.79], [421, 27.03], [TOP, 25.8]])

/**
 * Plan at half-width h, CCW. Each corner (from OSM): the face stops at 0.865 h,
 * a short slanted return, the notch's inner corner at 0.84 h. Returns the ring
 * and which edges are notch walls.
 */
function plan(h: number, m: number): { r: P2[]; notch: boolean[] } {
  const c = 0.865 * h, n = 0.84 * h, e = 0.935 * h
  const face: P2[] = []
  for (let k = 1; k <= m; k++) face.push([h, -c + (2 * c * k) / (m + 1)])
  const corner: P2[] = [[h, c], [e, n], [n, n], [n, e], [c, h]]
  const cornerNotch = [true, true, true, true, false] // edge leaving each corner point
  const rot = (p: P2, k: number): P2 => { let [x, y] = p; for (let i = 0; i < k; i++) [x, y] = [-y, x]; return [x, y] }
  const r: P2[] = [], notch: boolean[] = []
  for (let k = 0; k < 4; k++) {
    face.forEach((p) => { r.push(rot(p, k)); notch.push(false) })
    corner.forEach((p, i) => { r.push(rot(p, k)); notch.push(cornerNotch[i]) })
  }
  return { r, notch }
}

/** Skirt of each face, in face order +x (SE), +y (NE), -x (NW), -y (SW). */
const SKIRTS = [
  { dOut: 9, zf: 20 }, // SE: OSM way/1047822862 (4.4 m at 110 m; the photos show a wider hem)
  { dOut: 36, zf: 33 }, // NE: way/200726092, 1047822858, 1047822863, 1047822857
  { dOut: 9, zf: 20 }, // NW: way/1047822861 (as SE)
  { dOut: 20, zf: 38 }, // SW: way/1047822859, 1047822855, 1047822856
]

const rotK = (p: P2, k: number): P2 => { let [x, y] = p; for (let i = 0; i < k; i++) [x, y] = [-y, x]; return [x, y] }
/** Plant / refuge floors: recessed louvre bands across every face. */
const BANDS: [number, number][] = [[156, 166], [286, 292], [399, 411], [466, 469.5]]
const RECESS = 0.9

export function build(detail: boolean) {
  const glassP = new Part(), louvre = new Part(), led = new Part(), roof = new Part(), tent = new Part()
  const M = detail ? 9 : 3

  // ---------------------------------------------------------- shaft, above the skirts
  const base = detail ? [APEX, 135, 185, 235, 260, 316, 345, 370, 421, 445, ROOF] : [APEX, 210, 316, 421, ROOF]
  const LEVELS = [...new Set([...base, ...BANDS.flat()])].sort((a, b) => a - b)
  const inBand = (z0: number, z1: number) => BANDS.some(([a, b]) => z0 >= a && z1 <= b)
  for (let l = 0; l < LEVELS.length - 1; l++) {
    const z0 = LEVELS[l], z1 = LEVELS[l + 1]
    const p0 = plan(half(z0), M), p1 = plan(half(z1), M)
    if (inBand(z0, z1)) {
      // the recess: walls set back, louvre slats proud of them, ledges above and below
      const i0 = K.offset(p0.r, -RECESS), i1 = K.offset(p1.r, -RECESS)
      K.loft(louvre, K.at(i0, z0), K.at(i1, z1))
      K.loft(roof, K.at(p0.r, z0), K.at(i0, z0)) // sill, facing up
      K.loft(led, K.at(i1, z1), K.at(p1.r, z1)) // head, facing down
      const ns = detail ? Math.max(1, Math.round((z1 - z0) / 1.2)) : 1
      for (let k = 0; k < ns; k++) {
        const zc = z0 + ((k + 0.5) * (z1 - z0)) / ns
        const o = K.offset(plan(half(zc), M).r, -0.15)
        const hz = detail ? 0.18 : Math.min(1.2, (z1 - z0) / 4)
        K.loft(louvre, K.at(o, zc - hz), K.at(o, zc + hz)) // a slat, nearly flush with the face
      }
      continue
    }
    const lo = K.at(p0.r, z0), hi = K.at(p1.r, z1), n = lo.length
    for (let a = 0; a < n; a++) {
      const b = (a + 1) % n
      ;(p0.notch[a] ? led : glassP).quad(lo[a], lo[b], hi[b], hi[a])
    }
  }

  // ---------------------------------------------------------- parapet (6 m, published) with a sloped top
  {
    const t = plan(half(ROOF), M).r, inn = K.offset(t, -1.3)
    // the parapet rises toward each corner (as in the 201408 photo): 481 m at a face's middle, 484 m at the notch
    const zTop = (i: number) => {
      const [x, y] = t[i], h = half(ROOF), u = Math.min(1, Math.max(Math.abs(x), Math.abs(y)) > 0 ? Math.min(Math.abs(x), Math.abs(y)) / (0.865 * h) : 0)
      return 481 + 3 * Math.min(1, u) ** 1.5
    }
    K.loft(glassP, K.at(t, ROOF), K.at(t, zTop))
    K.loft(led, K.at(t, zTop), K.at(inn, (i) => zTop(i) - 1.0)) // sloped coping
    K.loft(roof, K.at(inn, (i) => zTop(i) - 1.0), K.at(inn, ROOF + 0.5))
    K.cap(roof, inn, ROOF + 0.5, true)
  }

  // ---------------------------------------------------------- floor lines and ribs
  // pale horizontal floor lines as proud bands (the facade's strong horizontal
  // rhythm, and the LED light show's lines at night)
  const step = detail ? 12.9 : 38.7
  const lw = detail ? 0.2 : 0.4
  for (let z = APEX + 6; z < ROOF - 4; z += step) {
    if (BANDS.some(([a, b]) => z > a - 3 && z < b + 3)) continue
    const o = K.offset(plan(half(z), M).r, detail ? 0.22 : 0.3), r0 = plan(half(z), M).r
    K.loft(led, K.at(o, z - lw), K.at(o, z + lw))
    K.loft(led, K.at(o, z + lw), K.at(r0, z + lw))
  }
  /** A proud rib on face k at face share u (0.865 h * u along the face), w wide, d deep, from z0 to z1. */
  const rib = (p: Part, k: number, u: number, w: number, d: number, z0: number, z1: number, zs: number[]) => {
    const lv = [z0, ...zs.filter((z) => z > z0 && z < z1), z1]
    const sec = (z: number): V3[] => {
      const h = half(z), x = 0.865 * h * u
      return ([[h, x - w], [h + d, x - w], [h + d, x + w], [h, x + w]] as P2[]).map((q) => [...rotK(q, k), z] as V3)
    }
    for (let l = 0; l < lv.length - 1; l++) {
      const a = sec(lv[l]), b = sec(lv[l + 1])
      for (let e = 0; e < 3; e++) p.quad(a[e], a[e + 1], b[e + 1], b[e])
    }
    const t = sec(z1)
    p.quad(t[0], t[3], t[2], t[1]) // caps (facing up)
    const g = sec(z0)
    p.quad(g[0], g[1], g[2], g[3])
  }
  const RZ = [APEX, 210, 316, 421, ROOF]
  for (let k = 0; k < 4; k++) {
    // mullion ribs along both lips of every corner notch
    rib(led, k, 1 - 0.035, 0.35, 0.8, APEX, 483, RZ)
    rib(led, k, -1 + 0.035, 0.35, 0.8, APEX, 483, RZ)
    if (detail) {
      // vertical mullion ribs every ~3.3 m across the face
      const nr = 15
      for (let r = 1; r < nr; r++) {
        const u = -1 + (2 * r) / nr
        rib(glassP, k, u, 0.12, 0.35, APEX, ROOF, RZ)
      }
    }
  }

  // ---------------------------------------------------------- the splayed base
  // Below APEX each face bends out in a smooth concave sweep, d = D (1 - sqrt(1 - q^2)),
  // q = (APEX - z) / (APEX - z_foot), ends in a slightly upturned lip and stands
  // plumb below its foot. Its two edges draw in from the corners as the corner
  // notch opens into a bright pointed glass tent (apex at APEX).
  const W = 0.865 * half(0)
  const cTent = (z: number) => 0.2 * Math.min(1, Math.max(0, (APEX - z) / (APEX - ZB))) ** 2.6
  // the long NE and SW sweeps (OSM) reach out from the face's middle; toward
  // the corners every face sweeps alike (9 m to a 20 m foot), so the corner
  // tents stay narrow wedges
  const dFace = (k: number, z: number, u = 1) => {
    const w = 1 - u * u
    const dOut = 9 + (SKIRTS[k].dOut - 9) * w, zf = 20 + (SKIRTS[k].zf - 20) * w
    const q = Math.min(1, Math.max(0, (APEX - z) / (APEX - zf)))
    return dOut * (1 - Math.sqrt(1 - q * q))
  }
  const P = (k: number, z: number, u: number, extra = 0): V3 => {
    const d = dFace(k, z, u) + extra
    const xe = W * (1 - cTent(z))
    const [x, y] = rotK([half(z) + d, u * xe], k)
    return [x, y, z]
  }
  const N = detail ? 26 : 12
  const zset = new Set<number>([0, ...SKIRTS.map((s) => s.zf), ZB])
  for (let i = 0; i < N; i++) zset.add(APEX - (APEX - 20) * Math.sin(((i / N) * Math.PI) / 2))
  for (const s of SKIRTS) for (const q of [0.97, 0.99]) zset.add(APEX - (APEX - s.zf) * q)
  const ZS = [...zset].filter((z) => z >= 0 && z <= APEX).sort((a, b) => a - b)
  if (ZS[ZS.length - 1] !== APEX) ZS.push(APEX)
  const NU = detail ? 12 : 6
  for (let l = 0; l < ZS.length - 1; l++) {
    const z0 = ZS[l], z1 = ZS[l + 1]
    for (let k = 0; k < 4; k++) {
      for (let i = 0; i < NU; i++) {
        const u0 = -1 + (2 * i) / NU, u1 = -1 + (2 * (i + 1)) / NU
        glassP.quad(P(k, z0, u0), P(k, z0, u1), P(k, z1, u1), P(k, z1, u0))
      }
      // the tent: face k's end, the notch's inner corner, face k+1's start
      const k2 = (k + 1) % 4
      // the notch's inner corner, carried out with both splaying faces so the tent stays a narrow wedge
      const Nc = (z: number): V3 => { const n = 0.84 * half(z); return [...rotK([n + dFace(k, z), n + dFace(k2, z)], k), z] as V3 }
      const lo = [P(k, z0, 1), Nc(z0), P(k2, z0, -1)], hi = [P(k, z1, 1), Nc(z1), P(k2, z1, -1)]
      for (let i = 0; i < 2; i++) tent.quad(lo[i], lo[i + 1], hi[i + 1], hi[i])
    }
  }
  // the hem's upturned lip at each face's foot: a pale nosing 1.4 m out, rising 0.8 m
  for (let k = 0; k < 4; k++) {
    const nU = NU * 2
    const zfu = (u: number) => 20 + (SKIRTS[k].zf - 20) * (1 - u * u)
    for (let i = 0; i < nU; i++) {
      const u0 = -1 + (2 * i) / nU, u1 = -1 + (2 * (i + 1)) / nU
      const A = P(k, zfu(u0), u0), B = P(k, zfu(u1), u1)
      const o = (q: V3, dz: number, out: number): V3 => { const n = rotK([out, 0], k); return [q[0] + n[0], q[1] + n[1], q[2] + dz] }
      led.quad(A, B, o(B, 0.8, 1.4), o(A, 0.8, 1.4)) // top, rising outward
      led.quad(o(A, 0.8, 1.4), o(B, 0.8, 1.4), o(B, -0.9, 1.4), o(A, -0.9, 1.4)) // front
      led.quad(o(A, -0.9, 1.4), o(B, -0.9, 1.4), o(B, -0.9, 0), o(A, -0.9, 0)) // soffit
    }
  }
  // NE lobby block, way/1047822864, 33 m
  {
    const r: P2[] = [[-12.9, 66.6], [-7.7, 87.0], [-4.4, 99.8], [5.5, 99.8], [7.7, 90.5], [13.6, 66.4]]
    K.prism(glassP, r, 0, 31.5, false)
    const rr = K.ccw(r)
    K.loft(led, K.at(rr, 31.5), K.at(rr, 33))
    K.cap(roof, rr, 33, true)
  }

  return [
    // the LED facade: the curtain wall glows in its own cool colour at night
    { part: glassP, material: finish('neon-icc-facade', 0x5d7389, 0.35) },
    { part: louvre, material: finish('icc-louvre', 0x6c7681) }, // plant-floor louvres, unlit
    { part: tent, material: windowVariant(3, 0xdbe5ec) },
    { part: led, material: finish('neon-icc-led', 0xd9e1e7) },
    { part: roof, material: PALETTE.roof },
  ]
}

// ============================================================ write
const REPLACES = [
  'way/25590249', // the tower
  'way/200726092', 'way/1047822855', 'way/1047822856', 'way/1047822857', 'way/1047822858', 'way/1047822859',
  'way/1047822860', 'way/1047822861', 'way/1047822862', 'way/1047822863', 'way/1047822864', // skirts, lobby block
]

if (import.meta.main) {
  for (const [file, detail, maxTris, maxBytes] of [
    ['hk-international-commerce-centre.glb', false, 6500, 250 * 1024],
    ['hk-international-commerce-centre.detail.glb', true, 40000, 1536 * 1024],
  ] as const) {
    const parts = build(detail)
    const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
    if (process.env.COUNTS) console.log(parts.map(({ part, material }) => material.name + ' ' + part.triangles).join(', '))
    if (triangles > maxTris) throw new Error(`${file}: triangle budget exceeded: ${triangles}`)
    const glb = writeGlb('International Commerce Centre', parts, {
      license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: TOP,
      frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
      replaces: REPLACES,
    })
    if (glb.length > maxBytes) throw new Error(`${file}: file budget exceeded: ${glb.length}`)
    const out = new URL(`../models/${file}`, import.meta.url).pathname
    await Bun.write(out, glb)
    console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
  }
}
