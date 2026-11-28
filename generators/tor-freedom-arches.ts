/**
 * Freedom Arches, Nathan Phillips Square, Toronto (1965, Viljo Revell, with
 * the square) — original procedural geometry, CC0-1.0.
 * bun generators/tor-freedom-arches.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Bearing 343.5: the square, the pool and the arches run on the
 * podium's grid, 16.5 degrees west of north; in the turned frame each arch
 * spans along y. Anchor = mean of the six end nodes of OSM's three
 * man_made=arch ways (way/239620642, way/239620645, way/239620643):
 * -79.3832007, 43.6522986. Elevation 0. replaces is empty: OSM maps no
 * building or building:part under the arches (only the lines and the pool,
 * way/25795356, natural=water).
 *
 * Identity: three identical slender concrete arches in parallel planes,
 * 8.7 m apart, each springing from the paving on one side of the
 * reflecting pool / skating rink and landing on the other, their flat
 * band-like section steep at the feet and rounded over the top. Small dark
 * spotlights hang under each arch and light the pool at night.
 *
 * What is modelled: the three arches only. The elevated walkway round the
 * square's west, south and east edges (OSM way/27944798, a footway bridge)
 * is a separate structure: it runs 20-40 m from the arches along the
 * square's edges and never touches them; the arches stand alone on the
 * paving beside the pool (ozon, kua2). So it is not part of this model.
 *
 * Evidence:
 *  - plan: OSM arch ways, turned into the frame: arches at x -8.7, 0, +8.6
 *    (drawn at -8.65, 0, 8.65) and spans of 35.4, 33.9 and 33.3 m between
 *    their end nodes (drawn as one span of 34.2 m for all three: the three
 *    are identical in every photo). The pool (way/25795356) is 30 m across
 *    in the arches' direction; the feet stand on the paving about 2 m
 *    beyond its edges (ozon).
 *  - rise: photo-scaled, 13.5 m above the paving. kua2 (seen nearly face
 *    on) gives a rise of about 0.44 of the span; pano (people for scale)
 *    gives 11-13 m to the crown. Estimated, no published figure found.
 *  - shape: a circular arc whose centre lies 4.1 m below the paving (radius
 *    17.6 m), which meets the ground at 77 degrees, as the feet do in kua2.
 *  - section: a band 1.5 m wide and 0.9 m deep (ozon, people for scale;
 *    kua1), constant along the arch; a concrete pad under each foot, bench high
 *    (ozon).
 *  - lamps: the dark spot fittings under the intrados (kua1, kua2), drawn
 *    seven to an arch, sparser than the real ones.
 *  - colour: weathered pale grey concrete (all photos).
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  kua1  "Nathan Phillips Square arches 2010.jpg", Benson Kua, CC BY-SA 2.0
 *        https://commons.wikimedia.org/wiki/File:Nathan_Phillips_Square_arches_2010.jpg
 *  kua2  "Arches Toronto 2010.jpg", Benson Kua, CC BY-SA 2.0 (from the west
 *        end of the pool at dusk)
 *        https://commons.wikimedia.org/wiki/File:Arches_Toronto_2010.jpg
 *  ozon  "Nathan Phillips Square May 2012.jpg", Terry Ozon, CC BY 2.0 (from
 *        the south walkway, looking north)
 *        https://commons.wikimedia.org/wiki/File:Nathan_Phillips_Square_May_2012.jpg
 *  pano  "Toronto - ON - Rathaus und Nathan Phillips Square.jpg",
 *        Taxiarchos228, CC BY 3.0
 *        https://commons.wikimedia.org/wiki/File:Toronto_-_ON_-_Rathaus_und_Nathan_Phillips_Square.jpg
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the rise and the section are photo estimates (no drawing or
 * published dimension found). OSM's three spans differ by 2 m; the photos
 * show identical arches, so one span is used.
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { box, save } from './atl-flatiron-building'

const conc = new Part(), lamp = new Part()

const XS = [-8.65, 0, 8.65] // the three arches' planes
const HALF = 17.1 // half-span at the paving
const RISE = 13.5
const R = (HALF * HALF + RISE * RISE) / (2 * RISE) // centreline radius
const ZC = RISE - R // the circle's centre, below the paving
const W = 0.75, D = 0.45 // half-width (along x) and half-depth (radial)
const N = 26

/** One arch in the plane x = x0: a band swept along the circle, cut flat at z = 0 at both feet. */
function arch(x0: number) {
  const phi0 = (r: number) => Math.asin(-ZC / r) // where radius r meets the paving
  const ring = (k: number) => {
    const t = k / N
    const pt = (r: number) => {
      const a0 = phi0(r), a = a0 + (Math.PI - 2 * a0) * t
      return { y: r * Math.cos(a), z: ZC + r * Math.sin(a), ny: Math.cos(a), nz: Math.sin(a) }
    }
    return { o: pt(R + D), i: pt(R - D) }
  }
  for (let k = 0; k < N; k++) {
    const a = ring(k), b = ring(k + 1)
    const P = (s: { y: number; z: number }, x: number): V3 => [x, s.y, s.z]
    const no = (s: { ny: number; nz: number }): V3 => [0, s.ny, s.nz]
    const ni = (s: { ny: number; nz: number }): V3 => [0, -s.ny, -s.nz]
    // extrados (up and out), smooth along the curve
    conc.tri(P(a.o, x0 - W), P(b.o, x0 - W), P(b.o, x0 + W), undefined, undefined, undefined, [no(a.o), no(b.o), no(b.o)])
    conc.tri(P(a.o, x0 - W), P(b.o, x0 + W), P(a.o, x0 + W), undefined, undefined, undefined, [no(a.o), no(b.o), no(a.o)])
    // intrados (facing the pool below)
    conc.tri(P(a.i, x0 - W), P(b.i, x0 + W), P(b.i, x0 - W), undefined, undefined, undefined, [ni(a.i), ni(b.i), ni(b.i)])
    conc.tri(P(a.i, x0 - W), P(a.i, x0 + W), P(b.i, x0 + W), undefined, undefined, undefined, [ni(a.i), ni(a.i), ni(b.i)])
    // the two flat faces
    for (const [x, s] of [[x0 + W, 1], [x0 - W, -1]] as [number, number][]) {
      const nn: V3 = [s, 0, 0], q = [nn, nn, nn]
      conc.tri(P(a.i, x), P(a.o, x), P(b.o, x), undefined, undefined, undefined, q)
      conc.tri(P(a.i, x), P(b.o, x), P(b.i, x), undefined, undefined, undefined, q)
    }
  }
  // A bench-high pad under each foot (also keeps its top clear of the paving where it rises 0.4 m).
  for (const s of [-1, 1]) box(conc, x0 - 1.1, x0 + 1.1, s * HALF - 1.4, s * HALF + 1.4, 0, 0.6, conc, 0.12)
  // Spotlights under the intrados.
  for (let k = 1; k <= 7; k++) {
    const a = Math.asin(-ZC / (R - D)), t = 0.1 + (0.8 * k) / 8, ang = a + (Math.PI - 2 * a) * t
    const r = R - D - 0.25, y = r * Math.cos(ang), z = ZC + r * Math.sin(ang)
    box(lamp, x0 - 0.22, x0 + 0.22, y - 0.22, y + 0.22, z - 0.25, z + 0.2, lamp, 0.05, true)
  }
}

for (const x of XS) arch(x)

await save('tor-freedom-arches', 'Freedom Arches', [
  { part: conc, material: finish('fa-concrete', 0xd7d4cc) },
  { part: lamp, material: finish('lamp', 0x3d3f42) },
], { height: RISE + D, anchor: [43.6522986, -79.3832007], bearing: 343.5 }, 5000)
