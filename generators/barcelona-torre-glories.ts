/**
 * Torre Glòries (former Torre Agbar), Barcelona — original procedural
 * geometry, CC0-1.0.
 * bun generators/barcelona-torre-glories.ts
 *
 * Map frame: +x east, +y north, z up, metres. BEARING 0. Origin = area
 * centroid of the OSM outline way/44213122 (lng 2.189521, lat 41.403513).
 *
 * Evidence
 * - OSM way/44213122: an ellipse 40.0 m east-west by 36.9 m north-south
 *   (measured from the outline), height 144.4, 34 levels, roof:shape dome,
 *   wikidata Q336246 (checked: "Torre Glòries", 38-storey skyscraper, coords
 *   41.4035 2.1895). No building:part ways.
 * - Published (Wikipedia es/ca/en): 144 m, 34 storeys above ground and 4
 *   below, Jean Nouvel, 2005; the 360° viewing floor is floor 30 at 125 m
 *   (so about 4.17 m a storey); the top is a glass dome; the facade is an
 *   outer skin of tilted glass louvres over aluminium panels in 40 colours,
 *   reds at the foot through blues to grey-white at the top, and 4,500 LED
 *   fixtures that light it in colours at night.
 * - Mapterhorn terrain (`terrain.ts grid 2.18952 41.40352 30 5`): the street
 *   on the west and north is at about 8.5–9.5 m, but the grid shows a dip to
 *   0–3 m at the east edge of the footprint (the sunken pool garden along
 *   Carrer Badajoz). The map puts y = 0 at the lowest ground, so the model
 *   carries a plain red BASE_DROP of 8 m below street level: the tower's top
 *   stays at 144.4 m above the street, and the extra base sinks into the
 *   ground on the street sides. Estimated from the grid; not checked
 *   against a photo of the sunken garden.
 * - Commons photos (daylight, all EVIDENCE):
 *   "Torre Agbar - Barcelona, Spain - Jan 2007.jpg" (Diliff, CC BY 2.5, from
 *   the south-west, near level: the profile below);
 *   "Torre Glòries 10.jpg" (Kent Wang, CC BY 4.0, from the south, recent
 *   muted colours);
 *   "Torre Agbar Barcelona 2015.jpg" (Bjørn Erik Pedersen, CC BY-SA
 *   4.0, close up from below: oranges and blues);
 *   "Barcelona - Torre Agbar 06.jpg" and "Barcelona - Torre Agbar 21.jpg"
 *   (Zarateman, CC0: the louvres, the red foot, the grey-blue dome, the
 *   darker floor lines every few storeys).
 *
 * Profile (measured on the Diliff photo, width = 40 m): straight to about
 * 70 m, then an ogive: 0.97 of full width at 87 m, 0.90 at 99, 0.82 at 111,
 * 0.72 at 122, 0.62 at 130, 0.50 at 137, small flat crown at 144.4. Fitted
 * as a superellipse w = (1 - t^2.3)^0.5, t = (z - 70) / 74.4.
 *
 * Colour: drawn as five broad horizontal bands, not the real pixel mosaic
 * (STYLE.md): red at the foot (0–30 m), rose-red mixed with blue (30–52),
 * light blue (52–92), steel blue (92–122), grey-blue dome (122–top). Colours from the daylight photos pulled
 * to the palette's lightness (the louvres grey everything down). The band
 * heights are estimated from the Diliff and Kent Wang photos.
 *
 * Night: the facade's LEDs are the landmark at night, so every coloured band
 * is a `neon-*` material that glows in its own colour (the small glass
 * crown is folded into the dome band to stay within six materials). Pale `trim` rings (the louvre floor lines) every three storeys,
 * 12.5 m.
 *
 * Doubts: the band boundaries really interleave over several storeys; the
 * mid-height colour has drifted over the years (2007 photos bluer, 2023
 * ones more muted). The antennas on the crown are left out.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const BEARING = 0
const ANCHOR = { lng: 2.189521, lat: 41.403513 }
const A = 20.0, B = 18.45 // semi-axes (east, north), from the OSM outline
const BASE_DROP = 8
const H = 144.4 + BASE_DROP // top, above the model's y = 0
const Z0 = 70 + BASE_DROP // where the ogive starts
const SEG = 36

const width = (z: number) => {
  if (z <= Z0) return 1
  const t = Math.min(1, (z - Z0) / (H - Z0))
  return Math.pow(Math.max(0, 1 - Math.pow(t, 2.3)), 0.5)
}
const MINW = 0.1 // the flat crown's radius as a share of the base
const ring = (z: number, grow = 0): V3[] => {
  const w = Math.max(MINW, width(z))
  const out: V3[] = []
  for (let i = 0; i < SEG; i++) {
    const a = (i / SEG) * Math.PI * 2
    out.push([(A * w + grow) * Math.cos(a), (B * w + grow) * Math.sin(a), z])
  }
  return out
}

/** Loft with smooth normals (rings counter-clockwise from above). */
function smoothLoft(p: Part, rings: V3[][]) {
  const n = rings[0].length, L = rings.length
  const acc: V3[][] = rings.map((r) => r.map(() => [0, 0, 0] as V3))
  for (let k = 0; k < L - 1; k++) for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    const a = rings[k][i], b = rings[k][j], c = rings[k + 1][j]
    const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
    let m: V3 = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
    const l = Math.hypot(...m) || 1
    m = [m[0] / l, m[1] / l, m[2] / l]
    for (const [kk, ii] of [[k, i], [k, j], [k + 1, i], [k + 1, j]]) {
      const t = acc[kk][ii]; t[0] += m[0]; t[1] += m[1]; t[2] += m[2]
    }
  }
  const N = acc.map((r) => r.map((m) => { const l = Math.hypot(...m) || 1; return [m[0] / l, m[1] / l, m[2] / l] as V3 }))
  for (let k = 0; k < L - 1; k++) for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    const a = rings[k][i], b = rings[k][j], c = rings[k + 1][j], d = rings[k + 1][i]
    p.tri(a, b, c, undefined, undefined, undefined, [N[k][i], N[k][j], N[k + 1][j]])
    p.tri(a, c, d, undefined, undefined, undefined, [N[k][i], N[k + 1][j], N[k + 1][i]])
  }
}

// Bands: [from, to] in metres above the street (the model adds BASE_DROP).
const BANDS: { from: number; to: number; part: Part; mat: ReturnType<typeof finish> }[] = [
  { from: -BASE_DROP, to: 30, part: new Part(), mat: finish('neon-glories-red', 0xc87a62) },
  { from: 30, to: 52, part: new Part(), mat: finish('neon-glories-rose', 0xb4939a) },
  { from: 52, to: 92, part: new Part(), mat: finish('neon-glories-blue', 0x86a9c9) },
  { from: 92, to: 122, part: new Part(), mat: finish('neon-glories-steel', 0x7f98b4) },
  { from: 122, to: 144.4, part: new Part(), mat: finish('neon-glories-dome', 0x9aa9b6) },
]
const trim = new Part()

const STEP = 4.17
for (const b of BANDS) {
  const z0 = b.from + BASE_DROP, z1 = b.to + BASE_DROP
  const zs: number[] = []
  // dense where the ogive curves, sparse on the straight shaft
  for (let z = z0; z < z1 - 0.01;) {
    zs.push(z)
    z += Math.min(z1 - z, z < Z0 ? 12 : z < H - 10 ? 3.2 : 1.1)
  }
  zs.push(z1)
  smoothLoft(b.part, zs.map((z) => ring(z)))
}

// The flat crown.
BANDS[BANDS.length - 1].part.cap(ring(H), true)

// Floor-line rings every three storeys (louvre lines), proud by 0.3 m.
for (let k = 1; ; k++) {
  const zc = BASE_DROP + 3 * STEP * k
  if (zc > H - 8) break
  const h = 0.7, z0 = zc - h / 2, z1 = zc + h / 2
  smoothLoft(trim, [ring(z0, -0.05), ring(z0 + 0.2, 0.22), ring(z1 - 0.2, 0.22), ring(z1, -0.05)])
}

const parts = [
  ...BANDS.map((b) => ({ part: b.part, material: b.mat })),
  { part: trim, material: PALETTE.trim },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Torre Glòries', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: H,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['way/44213122'],
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/barcelona-torre-glories.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
