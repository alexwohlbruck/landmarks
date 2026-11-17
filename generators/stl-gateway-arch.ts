/**
 * Gateway Arch (Eero Saarinen, 1963-65), St. Louis — original procedural
 * geometry, CC0-1.0.
 *
 *   bun generators/stl-gateway-arch.ts
 *
 * Map frame, turned to the arch: +y runs along the arch's plane towards the
 * north leg, +x across it towards the river (east-south-east), z up, metres.
 * BEARING 17.8. Origin: the midpoint between the legs, on the ground, at
 * -90.18497, 38.62461.
 *
 * Form: the published weighted catenary. The centroid curve is
 *   y = 68.7672 * (cosh(3.0022 * x / 299.2239) - 1)   (feet, y down from the top centroid)
 * with fc = 625.0925 ft (centroid height), L = 299.2239 ft (half span of
 * the centroid at the ground). The section is an equilateral triangle whose
 * area grows as Qt * cosh(Cx/L), so its side runs 17 ft * sqrt(cosh(Cx/L)),
 * from 17 ft at the top to 54 ft at the ground. One flat face is the
 * extrados (outer face, the top at the crown), the third corner points into
 * the arch: that puts the outer top at 625.09 + 4.9 = 630 ft and the outer
 * faces of the legs 630 ft apart, both as published. Sections are cut square
 * to the centroid curve and lofted at ~3 m steps of arc length, smooth along
 * the curve and creased at the three edges, which are chamfered 0.35 m.
 * Legs are cut off at the ground plane.
 *
 * Evidence
 * - Published: NPS, "Arch History and Architecture" and the catenary
 *   equation on the Gateway Arch's own drawings (as given in the assignment
 *   and on Wikipedia, "Gateway Arch"): 630 ft (192.0 m) high, 630 ft wide,
 *   legs equilateral triangles 54 ft to 17 ft a side, stainless-steel skin.
 * - USGS 3DEP lidar USGS_LPC_MO_StLouis_2017_LAS_2018 (2017 flight), 1 m grid
 *   around the arch: crown 192 m above the grounds (DSM 209 vs ground 17);
 *   the NPS curve fitted to the lidar extrados heights 75 m either side of
 *   the crown with 0.58 m RMS; the plane's bearing 17.8 (across offsets
 *   balance at 17.5-18.0) and the centre 15.0 m W, 1.5 m S of the grid
 *   centre -90.1848, 38.62462. Top width read ±2.6-2.8 m (17 ft = 5.2 m).
 * - OSM relation/12813920 (building, height 192, wikidata Q45234) and its
 *   32 building:parts way/1419494392-1419494423 (stepped approximations of
 *   the legs; their skillion roof:direction 17/197 and their ends agree with
 *   the lidar bearing; leg-to-leg extent 191 m).
 * - NAIP 2020s orthophoto (tools/usgs.py naip): plan and leg positions.
 * - Mapterhorn terrain: grounds level (~9.6 m on the table) under both legs;
 *   dips to ~6.5 m at the old sunken museum ramps inside each leg.
 * - Photos (Wikimedia Commons, all EVIDENCE):
 *   "St Louis Gateway Arch.jpg" (Flickr user 11399912@N, CC BY 2.0, from the
 *     Illinois bank, east), https://commons.wikimedia.org/wiki/File:St_Louis_Gateway_Arch.jpg
 *   "Gateway Arch, St. Louis, Missouri.jpg" (Bobindrums, CC BY-SA 4.0, from
 *     the west lawn), https://commons.wikimedia.org/wiki/File:Gateway_Arch,_St._Louis,_Missouri.jpg
 *   "Gateway Arch, St. Louis.jpg" (Lewis Hulbert, CC BY-SA 4.0, from the
 *     west), https://commons.wikimedia.org/wiki/File:Gateway_Arch,_St._Louis.jpg
 *   "St. Louis Gateway Arch.jpg" (TheWB, CC BY-SA 3.0, from the foot of a
 *     leg: the flat faces and sharp edges), https://commons.wikimedia.org/wiki/File:St._Louis_Gateway_Arch.jpg
 *   "St Louis night expblend.jpg" (Daniel Schwen, CC BY-SA 4.0, night, from
 *     the east: the whole arch floodlit), https://commons.wikimedia.org/wiki/File:St_Louis_night_expblend.jpg
 *
 * Numbers: height, span, curve and section are published; bearing and
 * anchor measured (lidar, OSM agrees to ~1 m); chamfer 0.35 m invented
 * (STYLE's bevel); colour from the daylight photos, pulled to the palette's
 * lightness. Left out: the observation windows at the crown (16 a side,
 * 7 x 27 in, far below 200 px), the panel seams, the grounds and the
 * underground museum.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { finish } from './palette'

const BEARING = 17.8
const ANCHOR = { lng: -90.18497, lat: 38.62461 }

const FT = 0.3048
const FC = 625.0925 * FT // centroid height at the crown
const A = 68.7672 * FT
const C = 3.0022
const L = 299.2239 * FT // half span of the centroid at the ground
const S_TOP = 17 * FT // section side at the crown
const CH = 0.35 // edge chamfer

const zc = (u: number) => FC - A * (Math.cosh((C * u) / L) - 1)
const dz = (u: number) => -(A * C / L) * Math.sinh((C * u) / L)
const side = (u: number) => S_TOP * Math.sqrt(Math.cosh((C * u) / L))

/** Section outline in (w across, n outward) coordinates, anticlockwise seen from +u. */
function outline(s: number): [number, number][] {
  const h = (s * Math.sqrt(3)) / 2
  const tri: [number, number][] = [[s / 2, h / 3], [-s / 2, h / 3], [0, (-2 * h) / 3]]
  const out: [number, number][] = []
  for (let i = 0; i < 3; i++) {
    const p = tri[i], prev = tri[(i + 2) % 3], next = tri[(i + 1) % 3]
    const toward = (q: [number, number]): [number, number] => {
      const d = Math.hypot(q[0] - p[0], q[1] - p[1])
      return [p[0] + ((q[0] - p[0]) * CH) / d, p[1] + ((q[1] - p[1]) * CH) / d]
    }
    out.push(toward(prev), toward(next))
  }
  return out
}

/** Arc-length samples of u over [-U, U], ~STEP metres apart. */
function samples(U: number, step: number): number[] {
  const fine: number[] = [], acc: number[] = [0]
  const N = 4000
  for (let i = 0; i <= N; i++) fine.push(-U + (2 * U * i) / N)
  for (let i = 1; i <= N; i++) acc.push(acc[i - 1] + Math.hypot(fine[i] - fine[i - 1], zc(fine[i]) - zc(fine[i - 1])))
  const total = acc[N], n = Math.round(total / step), us: number[] = []
  let j = 0
  for (let k = 0; k <= n; k++) {
    const target = (total * k) / n
    while (j < N - 1 && acc[j + 1] < target) j++
    const f = (target - acc[j]) / (acc[j + 1] - acc[j] || 1)
    us.push(fine[j] + (fine[j + 1] - fine[j]) * f)
  }
  return us
}

const steel = new Part()
const U_EXT = L + 3 // run past the ground, then clip
const rings: { p: V3[]; n: V3[] }[] = samples(U_EXT, 3).map((u) => {
  const g = Math.hypot(1, dz(u))
  const nOut: V3 = [0, -dz(u) / g, 1 / g] // outward normal in the plane (y, z)
  const w: V3 = [1, 0, 0]
  const o = outline(side(u))
  const c: V3 = [0, u, zc(u)]
  const p = o.map(([a, b]) => [c[0] + w[0] * a + nOut[0] * b, c[1] + w[1] * a + nOut[1] * b, c[2] + w[2] * a + nOut[2] * b] as V3)
  // Face normals in the section: edge i runs o[i] -> o[i+1]; outward is its right-hand perpendicular.
  const n = o.map((q, i) => {
    const r = o[(i + 1) % o.length]
    let ea = r[1] - q[1], eb = -(r[0] - q[0])
    const l = Math.hypot(ea, eb)
    ea /= l; eb /= l
    // make it point away from the section's centroid (origin)
    if (ea * (q[0] + r[0]) + eb * (q[1] + r[1]) < 0) { ea = -ea; eb = -eb }
    return [w[0] * ea + nOut[0] * eb, w[1] * ea + nOut[1] * eb, w[2] * ea + nOut[2] * eb] as V3
  })
  return { p, n }
})

// Clip a half (crown first) at z = 0: keep the rings wholly above ground, then a
// last ring where each edge line crosses the ground.
function clipEnd(list: typeof rings) {
  let k = 0
  while (list[k + 1].p.every((q) => q[2] > 0)) k++
  const last = list[k].p.map((_, i) => {
    for (let j = k; j < list.length - 1; j++) {
      const a = list[j].p[i], b = list[j + 1].p[i]
      if (b[2] <= 0) {
        const f = a[2] / (a[2] - b[2])
        return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, 0] as V3
      }
    }
    throw new Error('ring never reaches the ground')
  })
  return [...list.slice(0, k + 1), { p: last, n: list[k + 1].n }]
}
// Clip each half from the crown outward.
const crown = Math.floor(rings.length / 2)
const body = [...clipEnd(rings.slice(0, crown + 1).reverse()).reverse(), ...clipEnd(rings.slice(crown)).slice(1)]

for (let k = 0; k < body.length - 1; k++) {
  const r0 = body[k], r1 = body[k + 1], m = r0.p.length
  for (let i = 0; i < m; i++) {
    const j = (i + 1) % m
    const n0 = r0.n[i], n1 = r1.n[i]
    steel.tri(r0.p[i], r0.p[j], r1.p[j], undefined, undefined, undefined, [n0, n0, n1])
    steel.tri(r0.p[i], r1.p[j], r1.p[i], undefined, undefined, undefined, [n0, n1, n1])
  }
}

const TIP = Math.max(...body.flatMap((r) => r.p.map((q) => q[2])))
// Floodlit from pits at the feet: brightest low on the legs, fading up to the crown.
const flood = (p: V3) => 0.95 - 0.35 * (p[2] / TIP)

const parts = [{ part: steel, material: { ...finish('stainless', 0xdadfe3, 0.35), floodlight: flood } }]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const replaces = ['relation/12813920', ...Array.from({ length: 32 }, (_, i) => `way/${1419494392 + i}`)]
const glb = writeGlb('Gateway Arch', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: TIP,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces,
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/stl-gateway-arch.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes, top ${TIP.toFixed(2)} m, span ${(Math.max(...body.flatMap((r) => r.p.map((q) => q[1]))) - Math.min(...body.flatMap((r) => r.p.map((q) => q[1])))).toFixed(2)} m`)
