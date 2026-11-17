/**
 * Palau Sant Jordi, Montjuïc, Barcelona — original procedural geometry,
 * CC0-1.0.
 * bun generators/barcelona-palau-sant-jordi.ts
 * (uses the shared kit in barcelona-venetian-towers.ts)
 *
 * Map frame: +x east, +y north, z up, metres. BEARING 2 (the outline's long
 * axis, measured from its west and east edges). Origin = area centroid of
 * OSM way/35793637, lng 2.152562, lat 41.363225.
 *
 * Evidence
 * - OSM way/35793637: building=stadium, architect Arata Isozaki, 1990,
 *   capacity 18,000, wikidata Q630630 (checked: "Palau Sant Jordi",
 *   sporting arena in Barcelona, 41.3634 2.1526). The outline (118 × 203 m)
 *   takes in the arena and the low south annex. Parts: the dome
 *   way/146825150 (a rounded oblong 109 × 132 m, centre y = 23 m) and the
 *   raised central roof way/146825159 (50 × 74 m). Both measured in the
 *   model frame from the OSM nodes.
 * - Published (Viquipèdia, "Palau Sant Jordi"): Isozaki's dome was built
 *   on the ground and jacked up (the Pantadome system of Mamoru
 *   Kawaguchi); the roof is clad in ceramic tile and zinc; 62 columns carry
 *   it over the perimeter concourse. No height given.
 * - Mapterhorn terrain (terrain.ts grid 2.152562 41.363225 110 10
 *   --bearing 2): the tiles here carry the building itself, so they serve as
 *   a height measurement: the plateau of the central roof reads 42.7–44.0 m
 *   above the table's lowest point, the ground south of the building about
 *   2–5 m, the Anella Olímpica esplanade on the north about 19.8 m. The roof
 *   meets its eave about 14 m above the south ground (the step between
 *   x = -60 and -50 m), and rises steeply for its first 10 m before
 *   flattening. Heights below are from this surface over a base taken at
 *   2.3 m in the table (the lowest ground round the footprint): eave 18 m,
 *   central roof edge 39.5 m, top 41.5 m. Measured, about ±1.5 m (z15 tiles,
 *   about 2 m a pixel).
 * - Commons photos (daylight, EVIDENCE):
 *   "Palau Sant Jordi Barcelona 2013.jpg" (Felix König, CC BY 3.0, from the
 *   north-east above: the dark ribbed dome, the paler raised centre with
 *   its skylight bubbles, the pale glazed slot in the side of the dome,
 *   the wavy eave and the low annex);
 *   "Palau Sant Jordi vist des del mirador de migdia.JPG" (Jordiferrer,
 *   CC BY-SA 3.0, 2011, from the south: the annex's grey south wall with a
 *   window band under its cornice and its grey roof stepping up to the
 *   arena);
 *   "Palau Sant Jordi des de l'estadi - P1250756.jpg" (pere prlpz, CC BY-SA
 *   3.0, 2014, from the stadium to the east);
 *   "Palau Sant Jordi 2013.JPG" (Felix König, CC BY 3.0);
 *   "Barcelona - Montjuïc - Anella Olímpica - 1992 Summer Olympics site -
 *   View SSW on Palau Sant Jordi 1990 by Arata Isozaki.jpg" (Txllxt
 *   TxllxT, CC BY-SA 4.0).
 *
 * Shapes: the plan is a superellipse (exponent 3.5) fitted to the dome part;
 * the lower roof is lofted from it to the central part's outline along the
 * measured profile, with 24 raised ribs (the photos' ridges); the central
 * roof is a separate, slightly raised paler shell with rows of skylight
 * domes; a pale glazed band crosses the lower roof at mid-length on both
 * long sides (seen on both photos); under the roof a dark glazed perimeter
 * wall with a wavy grey eave; the south annex is a grey building to 11 m
 * with a dark window band at 8–10 m and a roof stepping up to 14 m
 * (estimated from the Jordiferrer photo, scaled by the annex's 101 m width).
 * Colours: roof charcoal-grey 0x5f666e (the photos' dark zinc, lifted to
 * the palette's floor), centre 0x878d93, skylights and band pale glass.
 *
 * Doubts: the annex height (one photo; the tiles read its roof near the
 * level of the ground to the south, so part of its south wall may stand in
 * a cutting); the band's exact position; the
 * podium on the north side is under the esplanade and not drawn (the walls
 * run down to y = 0 and sink into the hill there).
 */
import { Part, type V3, type MaterialSpec } from './mesh'
import { PALETTE, finish } from './palette'
import { emit, lathe, prism, smoothLoft, walls, offset, panel, type P2 } from './barcelona-venetian-towers'

const BEARING = 2
const ANCHOR = { lng: 2.152562, lat: 41.363225 }
const roofM = finish('sant-jordi-zinc', 0x5f666e)
const centreM = finish('sant-jordi-centre', 0x878d93)
const glassM: MaterialSpec = { name: 'glass', color: 0xbdb8a2, roughness: 0.3 }
const roof = new Part(), centre = new Part(), glass = new Part(), win = new Part(), eave = new Part(), annex = new Part()

const SEG = 64
const superE = (cx: number, cy: number, a: number, b: number, n: number, k: number): P2 => {
  const t = (k / SEG) * Math.PI * 2, c = Math.cos(t), s = Math.sin(t)
  return [cx + a * Math.sign(c) * Math.pow(Math.abs(c), 2 / n), cy + b * Math.sign(s) * Math.pow(Math.abs(s), 2 / n)]
}
const OUT = { cx: -0.4, cy: 23.1, a: 54.7, b: 65.8, n: 3.5 }
const CEN = { cx: -0.3, cy: 23.4, a: 25, b: 37, n: 3 }
const outer = (k: number, grow = 0) => superE(OUT.cx, OUT.cy, OUT.a + grow, OUT.b + grow, OUT.n, k)
const cen = (k: number, f = 1) => superE(CEN.cx, CEN.cy, CEN.a * f, CEN.b * f, CEN.n, k)
const ring = (f: (k: number) => P2, z: number | ((k: number) => number)): V3[] =>
  Array.from({ length: SEG }, (_, k) => { const p = f(k); return [p[0], p[1], typeof z === 'number' ? z : z(k)] })

// Wall under the eave (glazed perimeter), set in from the roof edge.
const EAVE = 18
const wave = (k: number) => 0.9 * Math.sin((k / SEG) * Math.PI * 2 * 6)
smoothLoft(win, [ring((k) => outer(k, -2.5), 0), ring((k) => outer(k, -2.5), (k) => EAVE - 2.6 + wave(k))])
// Wavy eave band.
smoothLoft(eave, [
  ring((k) => outer(k, -2.5), (k) => EAVE - 2.6 + wave(k)),
  ring((k) => outer(k, 0.8), (k) => EAVE - 2.4 + wave(k)),
  ring((k) => outer(k, 1.0), (k) => EAVE - 1.0 + wave(k) * 0.5),
  ring((k) => outer(k, 0.2), EAVE),
])

// Lower roof: lerp from the outer superellipse to the central outline along the profile.
const prof: [number, number][] = [[0, EAVE], [0.06, 23], [0.13, 27.5], [0.22, 31.3], [0.36, 34.8], [0.55, 37.4], [0.78, 38.9], [1, 39.5]]
const lerpRing = (u: number, z: number, lift = 0): V3[] => ring((k) => {
  const o = outer(k, 0.2), c = cen(k)
  return [o[0] + (c[0] - o[0]) * u, o[1] + (c[1] - o[1]) * u]
}, z + lift)
smoothLoft(roof, prof.map(([u, z]) => lerpRing(u, z)))
// Ribs: raised strips running up the lower roof.
const RIBS = 24
for (let r = 0; r < RIBS; r++) {
  const k = Math.round(((r + 0.5) / RIBS) * SEG) % SEG
  const k2 = (k + 1) % SEG
  const strips: V3[][] = prof.map(([u, z]) => {
    const pt = (kk: number, frac: number): V3 => {
      const o = outer(kk, 0.2), c = cen(kk)
      return [o[0] + (c[0] - o[0]) * u, o[1] + (c[1] - o[1]) * u, z + frac]
    }
    const a = pt(k, 0), b = pt(k2, 0)
    const m = (s: number, h: number): V3 => [a[0] + (b[0] - a[0]) * s, a[1] + (b[1] - a[1]) * s, a[2] + (b[2] - a[2]) * s + h]
    return [m(0.3, 0.02), m(0.7, 0.02), m(0.6, 0.35), m(0.4, 0.35)]
  })
  // loft along the rib: treat the 4-point sections as rings (closed tube)
  smoothLoft(roof, strips.map((s) => [...s]))
}
// Pale glazed band across the lower roof at mid-length, both long sides.
for (const side of [-1, 1]) {
  const kc = side > 0 ? 0 : SEG / 2 // east side at angle 0, west at pi
  const ks = [kc, kc + 1].map((k) => (k + SEG) % SEG)
  const rows = prof.map(([u, z]) => ks.map((k) => {
    const o = outer(k, 0.2), c = cen(k)
    return [o[0] + (c[0] - o[0]) * u, o[1] + (c[1] - o[1]) * u, z + 0.08] as V3
  }))
  for (let i = 0; i < rows.length - 1; i++) for (let j = 0; j < 1; j++) {
    const a = rows[i][j], b = rows[i][j + 1], c = rows[i + 1][j + 1], d = rows[i + 1][j]
    // wind to face up/outward
    const nz = (b[0] - a[0]) * (d[1] - a[1]) - (b[1] - a[1]) * (d[0] - a[0])
    if (nz > 0) glass.quad(a, b, c, d)
    else glass.quad(a, d, c, b)
  }
}

// Central raised roof: a step up and a low shell.
smoothLoft(centre, [ring((k) => cen(k, 1.0), 39.2), ring((k) => cen(k, 1.0), 40.2), ring((k) => cen(k, 0.75), 41.0), ring((k) => cen(k, 0.45), 41.4), ring((k) => cen(k, 0.15), 41.5), ring((k) => cen(k, 0.0), 41.5)])
// Skylight domes in rows along the centre.
for (const x of [-12, 0, 12]) for (let j = 0; j < 6; j++) {
  const y = CEN.cy - 25 + j * 10
  lathe(glass, [[1.6, 41.2], [1.2, 41.9], [0, 42.3]], 8, CEN.cx + x, y)
}

// South annex: a real building (Jordiferrer's photo from the south): grey walls to 11 m with a dark
// window band under the cornice, a grey roof stepping up to 14 m against the arena.
{
  const A: P2[] = [[-49.0, -102.0], [52.1, -100.3], [51.3, -43.0], [-49.8, -44.8]]
  walls(annex, A, 0, 11, 6)
  prism(centre, offset(A, 0.3), 11, 11.8, false, 6)
  prism(centre, [[-46, -62], [49, -60.4], [48.6, -43.5], [-46.5, -45.2]], 11.8, 14, false, 6)
  // window band on the south, east and west faces
  for (let i = 0; i < 4; i++) {
    const a = A[i], b = A[(i + 1) % 4]
    if (i === 2) continue // the north side meets the arena
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]), t: P2 = [(b[0] - a[0]) / len, (b[1] - a[1]) / len], n: P2 = [t[1], -t[0]]
    const m = Math.floor(len / 6)
    for (let k = 0; k < m; k++) {
      const s0 = k * (len / m) + 0.4, s1 = (k + 1) * (len / m) - 0.4
      panel(win, [a[0] + t[0] * s0, a[1] + t[1] * s0], [a[0] + t[0] * s1, a[1] + t[1] * s1], 8, 10.2, n)
    }
  }
}

await emit('barcelona-palau-sant-jordi', 'Palau Sant Jordi', [
  { part: roof, material: roofM },
  { part: centre, material: centreM },
  { part: glass, material: glassM },
  { part: win, material: PALETTE.window },
  { part: eave, material: PALETTE.roof },
  { part: annex, material: PALETTE.roof },
], { bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: 42.3, replaces: ['way/35793637', 'way/146825150', 'way/146825159'] }, 6500)
