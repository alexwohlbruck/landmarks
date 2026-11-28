/**
 * Rungrado 1st of May Stadium (릉라도 5.1경기장), Pyongyang: original procedural
 * geometry, CC0-1.0, no textures.  bun generators/pyongyang-rungrado.ts
 *
 * Writes two levels of detail in the same frame:
 * - models/pyongyang-rungrado.glb, the low model (<= 6,500 triangles);
 * - models/pyongyang-rungrado.detail.glb, drawn from zoom 16 (<= 40,000):
 *   finer petals, the arches' rims as ribbed box beams, the space-frame
 *   ribs under each petal, the facade's slabs and piers, stepped tiers.
 *
 * Map frame: x east, y north, z up, metres, bearing 0 (the plan is symmetric
 * about the north-south axis). Anchor = the mean of the 16 arch feet, the
 * outer tips of OSM way/23697757: lng 125.775324, lat 39.049711.
 *
 * Identity, in order: the ring of 16 white parabolic arches round the bowl,
 * each leaning in and carrying a vaulted petal of roof, so that the roof
 * reads as a scalloped magnolia or parachute; the scalloped inner edge of the
 * roof; the white rims of the arches against the dark undersides; the
 * stands' banded facade (red-brown bands, pale slabs) set back under each
 * arch; the grey concourse plinth the arches stand on; red seats.
 *
 * Evidence
 *  - OSM (measured in this frame): relation/6365399 (building=stadium,
 *    multipolygon), outer way/23697757 (leisure=stadium, Q211618), inner
 *    way/115568758, the roof's opening, an ellipse 141 x 194 m; 16
 *    building:part petals way/1279416700-715 (height 60, roof:shape dome).
 *    The outer way's 16 tips are the arch feet, on an ellipse of half-axes
 *    173 m (x) and 202 m (y), the arches centred on the axes (feet at
 *    11.25 + 22.5 k deg of the ellipse's parameter, to within 3 m); between
 *    tips the outline bows in by 15-20 m: the plan of the leaning arches.
 *  - Published: en.wikipedia "Rungrado 1st of May Stadium": opened 1989,
 *    "16 arches arranged in a ring", roof peaks at more than 60 m; site
 *    20.7 ha. OSM height 60 matches.
 *  - Photos (Wikimedia Commons, all EVIDENCE):
 *    - p6: Views_from_Yanggakdo_International_Hotel (Nicor), "Rŭngrado May
 *      First Stadium.JPG", CC BY-SA 3.0, from the south-west across the
 *      Taedong: the ring of arches, white roof, set-back facade.
 *      https://commons.wikimedia.org/wiki/File:R%C5%ADngrado_May_First_Stadium.JPG
 *    - p9: Jan Engelhardt, "May Day Stadium - 01 - Near the entrance.jpg",
 *      CC BY-SA 4.0: the arches' rims, the grey petals, the plinth, the
 *      red-brown banded facade. https://commons.wikimedia.org/wiki/File:May_Day_Stadium_-_01_-_Near_the_entrance.jpg
 *    - p1: Christophe95, "Rungrado 1st of May Stadium.jpg", CC BY-SA 4.0
 *      (night): an arch's space frame, the facade's bands.
 *      https://commons.wikimedia.org/wiki/File:Rungrado_1st_of_May_Stadium.jpg
 *    - p7: Christophe95, "Interior of the Rungrado 1st of May Stadium 2.jpg",
 *      CC BY-SA 4.0: the scalloped inner edge, two tiers, red seats.
 *      https://commons.wikimedia.org/wiki/File:Interior_of_the_Rungrado_1st_of_May_Stadium_2.jpg
 *    - p5: Ryuugakusei, "North Korea-Rungrado May Day Stadium-01.jpg",
 *      CC BY 2.0: the inner edge's arches from the field.
 *      https://commons.wikimedia.org/wiki/File:North_Korea-Rungrado_May_Day_Stadium-01.jpg
 *    - p3: Mike Connolly, "May Day Stadium4.jpg", CC BY 2.0, dusk, lit.
 *      https://commons.wikimedia.org/wiki/File:May_Day_Stadium4.jpg
 *    - p2: David Stanley, "May Day Stadium, Pyongyang (5063684320).jpg",
 *      CC BY 2.0. https://commons.wikimedia.org/wiki/File:May_Day_Stadium,_Pyongyang_(5063684320).jpg
 *    - p4: Michael Day, "Mayday Stadium (6647199727).jpg", CC BY 2.0.
 *      https://commons.wikimedia.org/wiki/File:Mayday_Stadium_(6647199727).jpg
 *  No lidar or aerial orthophoto; no commercial imagery.
 *
 * Numbers: feet and plan measured (OSM); arch crowns 60 m (OSM, published).
 * Estimated from p6, p9, p7: the feet on the plinth at 8 m; the arches
 * slightly steeper than a parabola ((1-u^2)^0.55); their lean (the crown 18 m
 * in, from the outline's bow); the inner edge's crests 50 m and valleys 42 m;
 * each petal vaulted 5 m; rims 4.5 m broad and 3 m deep; the petal 2 m
 * thick. The facade ring 46 m inside the feet, up to 24 m (cut under the
 * valleys), three pale slabs over red-brown bands; plinth 8 m; the bowl's
 * inner edge a superellipse 112 x 176 m round the track, two tiers.
 *
 * Doubts: the inner opening is centred on the feet here (OSM has it 9 m
 * south-east of them, likely a sketch); the real petal is a space frame
 * clad on top (detail draws its ribs underneath); seats one red (the ends
 * carry blue mosaics); Mapterhorn is z12 here and shows the stadium as a
 * 40 m mound (surface model); field at street level, elevation 0.
 */
import { Part, type V3 } from './mesh'
import { finish, windowVariant } from './palette'
import { beam, face, se, vadd, vlerp, vmul, vsub } from './seoul-world-cup-stadium'
import { RAD, bar, writeLods } from './melbourne-mcg'

const AX = 173, AY = 202 // feet ellipse
const IX = 70.5, IY = 97 // the roof's inner opening
const N_ARCH = 16
const Z_FOOT = 8, Z_CROWN = 60, LEAN = 15
const Z_IN_CREST = 50, Z_IN_VALLEY = 42, VAULT = 2.5
const THICK = 2

type XY = [number, number]
const foot = (k: number): XY => {
  const p = (11.25 + 22.5 * k) * RAD
  return [AX * Math.cos(p), AY * Math.sin(p)]
}
const inner = (phi: number): XY => [IX * Math.cos(phi), IY * Math.sin(phi)]

/** The outer arch of petal k at s in [0, 1] (foot k to foot k+1). */
function arch(k: number, s: number): V3 {
  const a = foot(k), b = foot(k + 1)
  const u = 2 * s - 1
  const h = Math.pow(Math.max(0, 1 - u * u), 0.55)
  const z = Z_FOOT + (Z_CROWN - Z_FOOT) * h
  // lean in: the crown stands LEAN metres inside the chord, along the petal's axis
  const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2
  const L = Math.hypot(mx, my)
  const x = a[0] + (b[0] - a[0]) * s - (mx / L) * LEAN * h
  const y = a[1] + (b[1] - a[1]) * s - (my / L) * LEAN * h
  return [x, y, z]
}
/** The inner edge of petal k at s. */
function inEdge(k: number, s: number): V3 {
  const p = (11.25 + 22.5 * (k + s)) * RAD
  const [x, y] = inner(p)
  return [x, y, Z_IN_VALLEY + (Z_IN_CREST - Z_IN_VALLEY) * Math.sin(Math.PI * s)]
}
/** A point of petal k's top surface, s across, t from the arch (0) to the inner edge (1). */
function petal(k: number, s: number, t: number): V3 {
  const A = arch(k, s), B = inEdge(k, s)
  const p = vlerp(A, B, t)
  // Each petal is a vault whose section is its arch, dying away inwards: the
  // crown line falls from the arch's crown to the inner edge's crest, and the
  // valley between two petals climbs from the shared foot to just under the
  // crowns by mid-depth (p6's scalloped skyline, p9's grooves).
  const u = 2 * s - 1
  const h = Math.pow(Math.max(0, 1 - u * u), 0.55)
  const crown = Z_CROWN + (Z_IN_CREST - Z_CROWN) * Math.pow(t, 1.3)
  const valley = Z_FOOT + (Z_IN_VALLEY - Z_FOOT) * Math.pow(Math.min(1, t / 0.55), 0.6)
  p[2] = valley + (crown - valley) * h
  return p
}

/** Roof underside height over a plan point (sampled), for keeping the facade and stands under it. */
const ROOF_SAMPLES: V3[] = []
for (let k = 0; k < N_ARCH; k++) for (let i = 0; i <= 24; i++) for (let j = 0; j <= 24; j++) ROOF_SAMPLES.push(petal(k, i / 24, j / 24))
function roofZ(x: number, y: number) {
  // the lowest roof within 8 m in plan, so nothing pokes through a valley
  let z = 99
  for (const q of ROOF_SAMPLES) if ((q[0] - x) ** 2 + (q[1] - y) ** 2 < 64 && q[2] < z) z = q[2]
  return z - THICK
}

function build(detail: boolean) {
  const roof = new Part(), white = new Part(), dark = new Part(), facade = new Part(), plinth = new Part(), seats = new Part()

  // --- the petals: top (pale), underside (dark), the rims and the inner fascia
  const NS = detail ? 16 : 8, NT = detail ? 8 : 4
  for (let k = 0; k < N_ARCH; k++) {
    const G = (i: number, j: number) => petal(k, i / NS, j / NT)
    const nrmTop = (i: number, j: number): V3 => {
      const e = 0.01, s = i / NS, t = j / NT
      const ps = vsub(petal(k, Math.min(1, s + e), t), petal(k, Math.max(0, s - e), t))
      const pt = vsub(petal(k, s, Math.min(1, t + e)), petal(k, s, Math.max(0, t - e)))
      let n: V3 = [ps[1] * pt[2] - ps[2] * pt[1], ps[2] * pt[0] - ps[0] * pt[2], ps[0] * pt[1] - ps[1] * pt[0]]
      if (n[2] < 0) n = vmul(n, -1)
      const l = Math.hypot(...n)
      return vmul(n, 1 / l)
    }
    for (let i = 0; i < NS; i++) for (let j = 0; j < NT; j++) {
      const a = G(i, j), b = G(i + 1, j), c = G(i + 1, j + 1), d = G(i, j + 1)
      const na = nrmTop(i, j), nb = nrmTop(i + 1, j), nc = nrmTop(i + 1, j + 1), nd = nrmTop(i, j + 1)
      roof.tri(a, b, c, undefined, undefined, undefined, [na, nb, nc])
      roof.tri(a, c, d, undefined, undefined, undefined, [na, nc, nd])
    }
    // the underside, dark, on a coarser grid in the low model
    const US = detail ? NS : 4, UT = detail ? NT : 2
    const U = (i: number, j: number) => vsub(petal(k, i / US, j / UT), [0, 0, THICK])
    for (let i = 0; i < US; i++) for (let j = 0; j < UT; j++) {
      const a = U(i, j), b = U(i + 1, j), c = U(i + 1, j + 1), d = U(i, j + 1)
      face(dark, [a, c, b], [0, 0, -1])
      face(dark, [a, d, c], [0, 0, -1])
    }
    // the rim: a bold white beam along the arch, from foot to foot
    const rim: V3[] = []
    for (let i = 0; i <= NS; i++) rim.push(vadd(arch(k, i / NS), [0, 0, -0.4]))
    const mx = (foot(k)[0] + foot(k + 1)[0]) / 2, my = (foot(k)[1] + foot(k + 1)[1]) / 2
    const out: V3 = [mx, my, 0]
    beam(white, rim, 4.5, 3.2, vmul(out, 1 / Math.hypot(mx, my)))
    // the inner edge's white fascia
    for (let i = 0; i < NS; i++) {
      const a = inEdge(k, i / NS), b = inEdge(k, (i + 1) / NS)
      face(white, [a, b, vsub(b, [0, 0, THICK + 0.6]), vsub(a, [0, 0, THICK + 0.6])], [-a[0] - b[0], -a[1] - b[1], 0])
    }
    if (detail) {
      // the space frame under the petal: radial ribs and cross ribs as box members
      for (const s of [0.25, 0.5, 0.75]) {
        const path: V3[] = []
        for (let j = 0; j <= NT; j++) {
          const p = petal(k, s, j / NT)
          path.push(vsub(p, [0, 0, THICK + 0.9]))
        }
        beam(dark, path, 1.1, 1.4)
      }
      for (const t of [0.4, 0.75]) {
        const path: V3[] = []
        for (let i = 1; i < NS; i++) path.push(vsub(petal(k, i / NS, t), [0, 0, THICK + 0.9]))
        beam(dark, path, 1.0, 1.2)
      }
      // the rim's ribbed face: short white bars across the beam (p9)
      for (let i = 1; i < NS; i += 1) {
        const p = arch(k, i / NS), q = arch(k, (i + 0.5) / NS)
        bar(white, vadd(p, [0, 0, -0.4]), vadd(q, [0, 0, -0.4]), 5.0, 3.6, vmul(out, 1 / Math.hypot(mx, my)))
      }
    }
  }

  // --- the plinth (concourse) round the feet, and its deck in to the facade
  const NP = detail ? 128 : 64
  const RFAC = 32 // the facade ring stands this far inside the feet ellipse
  const ell = (th: number, dA: number) => [(AX + dA) * Math.cos(th), (AY + dA) * Math.sin(th)] as XY
  for (let i = 0; i < NP; i++) {
    const a = (i / NP) * 2 * Math.PI, b = ((i + 1) / NP) * 2 * Math.PI
    const [x0, y0] = ell(a, 7), [x1, y1] = ell(b, 7)
    const [u0, v0] = ell(a, -RFAC), [u1, v1] = ell(b, -RFAC)
    face(plinth, [[x0, y0, 0], [x1, y1, 0], [x1, y1, Z_FOOT], [x0, y0, Z_FOOT]], [x0 + x1, y0 + y1, 0])
    // a deep canopy lip at the top of the plinth (p9)
    const [c0x, c0y] = ell(a, 9), [c1x, c1y] = ell(b, 9)
    face(plinth, [[c0x, c0y, Z_FOOT - 1.6], [c1x, c1y, Z_FOOT - 1.6], [c1x, c1y, Z_FOOT], [c0x, c0y, Z_FOOT]], [x0 + x1, y0 + y1, 0])
    face(dark, [[x0, y0, Z_FOOT - 1.6], [x1, y1, Z_FOOT - 1.6], [c1x, c1y, Z_FOOT - 1.6], [c0x, c0y, Z_FOOT - 1.6]], [0, 0, -1])
    face(plinth, [[c0x, c0y, Z_FOOT], [c1x, c1y, Z_FOOT], [u1, v1, Z_FOOT], [u0, v0, Z_FOOT]], [0, 0, 1])
  }

  // --- the stands' facade under the arches: pale slabs over red-brown bands, cut under the roof
  {
    const NF = detail ? 128 : 48
    const top = (th: number) => {
      const [x, y] = ell(th, -RFAC)
      return Math.min(44, roofZ(x, y) - 1.5)
    }
    const levels = [Z_FOOT, 14, 15.5, 22, 23.5, 30, 31.5, 37, 38.5, 44]
    for (let i = 0; i < NF; i++) {
      const a = (i / NF) * 2 * Math.PI, b = ((i + 1) / NF) * 2 * Math.PI
      const [x0, y0] = ell(a, -RFAC), [x1, y1] = ell(b, -RFAC)
      const ta = top(a), tb = top(b)
      const o: V3 = [x0 + x1, y0 + y1, 0]
      const ol = Math.hypot(o[0], o[1])
      for (let L = 0; L < levels.length - 1; L++) {
        const z0 = levels[L], z1 = levels[L + 1]
        const za0 = Math.min(z0, ta), za1 = Math.min(z1, ta), zb0 = Math.min(z0, tb), zb1 = Math.min(z1, tb)
        if (za1 - za0 < 0.05 && zb1 - zb0 < 0.05) continue
        const slab = L % 2 === 1
        const off = slab ? 1.0 : 0 // the slabs stand proud of the bands
        const d: V3 = vmul(o, off / ol)
        const part = slab ? white : facade
        face(part, [vadd([x0, y0, za0], d), vadd([x1, y1, zb0], d), vadd([x1, y1, zb1], d), vadd([x0, y0, za1], d)], o)
        if (slab) {
          face(white, [[x0, y0, za1], [x1, y1, zb1], vadd([x1, y1, zb1], d), vadd([x0, y0, za1], d)], [0, 0, 1])
        }
      }
      // the top of the stands' building, under the roof
      face(dark, [[x0, y0, ta], [x1, y1, tb], [x1 * 0.9, y1 * 0.9, tb], [x0 * 0.9, y0 * 0.9, ta]], [0, 0, 1])
      // piers every 4th bay, pale, from the plinth to the top
      if (detail && i % 4 === 0) {
        const p = ell(a + Math.PI / NF, -RFAC + 1.2)
        bar(white, [p[0], p[1], Z_FOOT], [p[0], p[1], Math.min(ta, tb)], 1.6, 1.6, [o[0] / ol, o[1] / ol, 0])
      }
    }
  }

  // --- the bowl: two tiers to the facade's top
  {
    const NB = detail ? 96 : 40
    const prof = (th: number) => {
      const ri = se(th, 56, 88, 2.4)
      const [fx, fy] = ell(th, -RFAC - 1)
      const rf = Math.hypot(fx, fy) // the ray's distance to the facade (the ellipse is near-radial here)
      const zt = Math.min(44, roofZ(fx, fy) - 1.5)
      const pts: [number, number, Part][] = []
      const tierPts = (r0: number, z0: number, r1: number, z1: number, rows: number) => {
        if (!detail) { pts.push([r0, z0, seats]); return }
        for (let s = 0; s < rows; s++) {
          const ra = r0 + ((r1 - r0) * s) / rows
          pts.push([ra, z0 + ((z1 - z0) * s) / rows, white])
          pts.push([ra, z0 + ((z1 - z0) * (s + 1)) / rows, seats])
        }
      }
      const r1 = ri + Math.min(40, (rf - ri) * 0.55)
      pts.push([ri, 0, white])
      tierPts(ri, 1.5, r1, 14, 8)
      pts.push([r1, 14, facade]) // the box band under the upper tier, red-brown (p7)
      pts.push([r1, 17.5, white])
      tierPts(r1 + 3, 17.5, rf, Math.max(18, zt), 6)
      pts.push([rf, Math.max(18, zt), white])
      return pts.map(([r, z, part]) => [r * Math.cos(th), r * Math.sin(th), z, part] as [number, number, number, Part])
    }
    for (let i = 0; i < NB; i++) {
      const a = (i / NB) * 2 * Math.PI, b = ((i + 1) / NB) * 2 * Math.PI
      const A = prof(a), B = prof(b)
      for (let k = 0; k < A.length - 1; k++) {
        const part = A[k][3]
        const p0: V3 = [A[k][0], A[k][1], A[k][2]], p1: V3 = [B[k][0], B[k][1], B[k][2]], p2: V3 = [B[k + 1][0], B[k + 1][1], B[k + 1][2]], p3: V3 = [A[k + 1][0], A[k + 1][1], A[k + 1][2]]
        const c: V3 = [(p0[0] + p2[0]) / 2, (p0[1] + p2[1]) / 2, 0]
        const L = Math.hypot(c[0], c[1])
        const dz = p3[2] - p0[2], dr = Math.hypot(p3[0], p3[1]) - Math.hypot(p0[0], p0[1])
        const nn: V3 = [(-c[0] / L) * dz, (-c[1] / L) * dz, dr]
        if (Math.hypot(...nn) < 1e-6) continue
        face(part, [p0, p1, p2, p3], nn)
      }
    }
  }

  const flood = (_p: V3, n: V3) => (n[2] > 0.7 ? 0.15 : 0.55)
  return [
    { part: roof, material: { ...finish('rg-roof', 0xd8d7d0), floodlight: (p: V3, n: V3) => (n[2] > 0.8 ? 0.1 : 0.3) } },
    { part: white, material: { ...finish('rg-white', 0xf3f2ee), floodlight: flood } },
    { part: dark, material: finish('rg-underside', 0x6e7175) },
    { part: facade, material: windowVariant(2, 0x8f6a60) },
    { part: plinth, material: finish('rg-plinth', 0xbab9b2) },
    { part: seats, material: finish('rg-seats', 0xbd5248) },
  ]
}

if (import.meta.main)
  await writeLods('Rungrado 1st of May Stadium', { bearing: 0, elevation: 0, height: 62 }, [
    { file: 'pyongyang-rungrado.glb', parts: build(false), maxTris: 6500, maxBytes: 250_000 },
    { file: 'pyongyang-rungrado.detail.glb', parts: build(true), maxTris: 40_000, maxBytes: 1_500_000 },
  ])
