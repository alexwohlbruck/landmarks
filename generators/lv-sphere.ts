/**
 * Sphere, Las Vegas — procedural, CC0-1.0.
 * bun generators/lv-sphere.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0 (it is round). The
 * origin is the area centroid of OSM way/976405284 (building=commercial,
 * height=112, shape=spherical_cutted), a circle of radius 87 m.
 *
 * Published (Wikipedia, "Sphere (venue)"; OSM height tag): 366 ft (112 m)
 * tall and 516 ft (157 m) wide, so the globe's radius is 78.5 m and its
 * centre, the widest point, stands 33.5 m above the ground.
 *
 * Measured:
 * - the base, from the daylight photos "Sphere-exosphere-in-daytime-on-Jan-
 *   27-2024.jpg" (Y2kcrazyjoker4, CC BY 4.0; from the south-east parking
 *   lot, about 0.16 m per pixel at the sphere) and "View of Sphere from High
 *   Roller on Jan 31 2024.jpg" (zenm, CC BY 2.0; from the south-west, above).
 *   The shell curves visibly inward below its widest point, its lower
 *   edge about 0.9 of the equator's width, and comes down to within ~6 m
 *   of the ground (against the people and light poles), where a low
 *   battered concrete skirt hides its foot. About 27 m of under-curve shows;
 * - the pale ring in a USGS NAIP orthophoto (public domain, taken during
 *   construction) and in the view from above, reaching out toward the OSM
 *   outline (87 m), is a low apron at ground level: drawn as a 1.2 m ledge
 *   out to 80 m.
 *
 * Colour. The Exosphere is an LED skin showing changing content, so the
 * model takes it as it looks in daylight with the screens dark: a charcoal
 * shell with a faint blue cast and soft highlights (the two photos above,
 * and "The Las Vegas Sphere, Nevada (53349695459).jpg", Harold Litwiler,
 * CC BY-SA 2.0). STYLE.md's floor for a defining dark colour, #4a4f57, is
 * about that shade. The LED pucks and ring beams are too fine to model; the
 * shell is a smooth, finely faceted sphere. Its material is not a window
 * name, so it stays unlit at night rather than glowing a uniform warm tone.
 *
 * Estimated: the skirt's 6 m height and batter (76 m at its foot), the
 * apron's height and reach. Not modelled: the pedestrian bridge to the Venetian (outside the
 * outline; it stays the map's), the loading docks and plant to the east.
 * Replaces the outline only; nothing else in OSM lies inside it.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const TAU = Math.PI * 2
const R = 78.5               // 157 m wide
const ZC = 112 - R           // centre 33.5 m up: 112 m to the top
const DRUM_H = 6             // top of the concrete skirt
const DRUM_R0 = 76           // skirt radius at the ground
const DRUM_R1 = 73.3         // and at its top, just inside the shell (73.5 m there)
const APRON_R = 80           // the low apron ring seen from above
const APRON_H = 1.2
const N = 72                 // segments round the circle

const shell = new Part()
const drum = new Part()
const ledge = new Part()

type Ring = { p: V3[]; n: V3[] }
const ring = (r: number, z: number, nr: number, nz: number): Ring => ({
  p: Array.from({ length: N }, (_, i) => [r * Math.cos(i / N * TAU), r * Math.sin(i / N * TAU), z] as V3),
  n: Array.from({ length: N }, (_, i) => {
    const l = Math.hypot(nr, nz)
    return [nr / l * Math.cos(i / N * TAU), nr / l * Math.sin(i / N * TAU), nz / l] as V3
  }),
})
/** The band between two rings, bottom to top, smooth along the given normals. */
function band(p: Part, a: Ring, b: Ring) {
  for (let i = 0; i < N; i++) {
    const j = (i + 1) % N
    p.tri(a.p[i], a.p[j], b.p[j], undefined, undefined, undefined, [a.n[i], a.n[j], b.n[j]])
    p.tri(a.p[i], b.p[j], b.p[i], undefined, undefined, undefined, [a.n[i], b.n[j], b.n[i]])
  }
}

// --- The shell: from just inside the drum to the pole ------------------------
// Latitudes are spaced evenly in angle, so the facets are about square; the
// lowest ring is hidden inside the drum so no gap shows at the ledge.
const lat0 = Math.asin((DRUM_H - 1.5 - ZC) / R)
const LATS = 30
const at = (phi: number) => ring(R * Math.cos(phi), ZC + R * Math.sin(phi), Math.cos(phi), Math.sin(phi))
for (let k = 0; k < LATS; k++) {
  const p0 = lat0 + (Math.PI / 2 - lat0) * (k / LATS)
  const p1 = lat0 + (Math.PI / 2 - lat0) * ((k + 1) / LATS)
  if (k < LATS - 1) band(shell, at(p0), at(p1))
  else {
    // The pole: a fan, smooth to the top.
    const a = at(p0), top: V3 = [0, 0, ZC + R], up: V3 = [0, 0, 1]
    for (let i = 0; i < N; i++) {
      const j = (i + 1) % N
      shell.tri(a.p[i], a.p[j], top, undefined, undefined, undefined, [a.n[i], a.n[j], up])
    }
  }
}

// --- The base: a low battered concrete skirt tucked under the shell, on a
// thin apron. The skirt's top edge sits just inside the shell, so the shell's
// whole under-curve shows from ~6 m up to the equator, as in the photos.
const slope = (DRUM_R0 - DRUM_R1) / DRUM_H
band(drum, ring(DRUM_R0, APRON_H, 1, slope), ring(DRUM_R1, DRUM_H, 1, slope))
{
  // Apron: a bevelled outer edge and a flat top out from the skirt's foot.
  const BEV = 0.4
  band(drum, ring(APRON_R, 0, 1, 0), ring(APRON_R, APRON_H - BEV, 1, 0))
  band(drum, ring(APRON_R, APRON_H - BEV, 1, 0), ring(APRON_R - BEV, APRON_H, 0.35, 1))
  const o = ring(APRON_R - BEV, APRON_H, 0, 1), i = ring(DRUM_R0 - 0.3, APRON_H, 0, 1)
  for (let k = 0; k < N; k++) {
    const l = (k + 1) % N
    ledge.quad(i.p[k], o.p[k], o.p[l], i.p[l])
  }
}

const EXOSPHERE = finish('exosphere', 0x4a4f57, 0.45)
const CONCRETE = finish('concrete', 0xd2d0cb)
const parts = [
  { part: shell, material: EXOSPHERE },
  { part: drum, material: CONCRETE },
  { part: ledge, material: PALETTE.roof },
]
const triangles = parts.reduce((n, p) => n + p.part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Sphere', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres, origin at ground', height: 112, bearing: 0,
})
await Bun.write(new URL('../models/lv-sphere.glb', import.meta.url), glb)
console.log(`lv-sphere.glb: ${triangles} triangles, ${glb.length} bytes`)
