/**
 * BMW Museum ("the bowl"), Munich: procedural, CC0-1.0.
 * bun generators/munich-bmw-museum.ts
 *
 * Uses the geometry kit exported by generators/munich-olympiaturm.ts.
 *
 * Map frame: x east, y north, z up, metres; bearing 0. Origin: the centroid
 * of OSM way/298266716 (the museum outline: the bowl and the low wing north
 * of it). The bowl's axis is at (1.65, -19.65).
 *
 * Karl Schwanzer, 1973, beside the Vierzylinder; reopened 2008 after the
 * renovation and extension by Atelier Brückner. A silver bowl on a
 * recessed glazed drum, its flat roof painted with the BMW roundel and
 * letters; the rim steps down at a vertical blue stripe.
 *
 * OSM: bowl in two halves, the west one to 21 m (way/302324251), the east
 * one to 19 m (way/5216004), split along a north-south chord 1.25 m east
 * of the axis; the bowl 41.7 m across; lower tiers (ways 303382182,
 * 305310591, 6 and 10 m); roof parts (ways 286002864/66/68/69,
 * 1435773753/54, relation/4002450); the low wing (way/163408029, 6 m, two
 * storeys). The rim heights are OSM's; the step is confirmed by the photo
 * from the Olympiaberg.
 * From photos (Olympiaberg, scaled on the 41.7 m rim): the glazed drum
 * r 11 to 4.2 m with a white fascia; the underside sweeping from r 12 at
 * 4.5 m out to the full radius by about 14 m; the upper wall near vertical,
 * leaning in slightly to the rim; the blue stripe about 2.5 m wide at the
 * step on the south side.
 * Estimated: the roof roundel's size (about 24 m across, from the photo from
 * the Olympiaturm); the low wing's glazing.
 *
 * Photos (Wikimedia Commons, EVIDENCE):
 * - "München, BMW-Museum vom Olympiaberg, 1.jpeg", Renardo la vulpo, CC BY-SA 4.0
 *   https://commons.wikimedia.org/wiki/File:M%C3%BCnchen,_BMW-Museum_vom_Olympiaberg,_1.jpeg
 * - "20221108 BMW Museum.jpg", Flocci Nivis, CC BY 4.0 (night)
 *   https://commons.wikimedia.org/wiki/File:20221108_BMW_Museum.jpg
 * - "BMW tower seen from Olympic tower on a sunny November afternoon.jpg",
 *   Markus Matern, CC BY-SA 3.0 (the roof from above)
 * - "BMW Vierzylinder Tower Munich 2014 01.jpg", Julian Herzog, CC BY 4.0
 *
 * Left out: the "BMW" letters on the roof, the porthole slots, the
 * "museum" lettering over the entrance.
 * Doubts: whether the north end of the step carries a stripe too (no photo
 * of the north side shows it clearly; drawn on the south only).
 *
 * Night: the bowl is lit from below in reality (washed silver-blue); it
 * carries a `floodlight` wash on its lower half. The drum's glazing is
 * `window`.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { TAU, box, face, flat, unit } from './munich-olympiaturm'

const silver = new Part()
const win = new Part()
const white = new Part()
const blue = new Part()
const dark = new Part()
const roofWhite = new Part()

const BC: V3 = [1.65, -19.65, 0]
const RB = 20.85
const SPLIT_X = BC[0] + 1.25
const Z_W = 21.0, Z_E = 19.0
const K = 48

/** Bowl radius at height z. */
function rAt(z: number) {
  if (z <= 4.5) return 12.0
  if (z <= 14) {
    const t = (z - 4.5) / 9.5
    return 12.0 + (RB - 12.0) * Math.sin((t * Math.PI) / 2) ** 0.8
  }
  return RB - ((z - 14) / 7) ** 2 * 0.45
}
const PROFILE_Z = [4.5, 5.3, 6.3, 7.5, 8.9, 10.4, 12.0, 14.0, 16.0, 18.0, 19.0, 20.0, 21.0]

/** Which half an angle lies in: the east half is lower. */
const xAt = (a: number) => BC[0] + RB * Math.cos(a)

// The bowl wall, facet by facet so each half stops at its own rim.
for (let s = 0; s < K; s++) {
  const a0 = (s / K) * TAU, a1 = ((s + 1) / K) * TAU, am = (a0 + a1) / 2
  const top = xAt(am) > SPLIT_X ? Z_E : Z_W
  const zs = PROFILE_Z.filter((z) => z < top).concat([top])
  const P = (a: number, z: number): V3 => [BC[0] + rAt(z) * Math.cos(a), BC[1] + rAt(z) * Math.sin(a), z]
  const nrm = (a: number, z: number): V3 => {
    const dz = 0.2, dr = (rAt(z + dz) - rAt(Math.max(4.5, z - dz))) / (z + dz - Math.max(4.5, z - dz))
    return unit([Math.cos(a), Math.sin(a), -dr])
  }
  // the blue stripe: the facets either side of the south end of the split
  const southStep = Math.abs(xAt(am) - SPLIT_X) < 2.0 && Math.sin(am) < 0
  for (let k = 0; k < zs.length - 1; k++) {
    const z0 = zs[k], z1 = zs[k + 1]
    const part = southStep && z0 >= 9 ? blue : silver
    face(part, [P(a0, z0), P(a1, z0), P(a1, z1), P(a0, z1)], [nrm(a0, z0), nrm(a1, z0), nrm(a1, z1), nrm(a0, z1)])
  }
  // the underside, from the drum out to the start of the wall
  const Q = (a: number, r: number, z: number): V3 => [BC[0] + r * Math.cos(a), BC[1] + r * Math.sin(a), z]
  flat(white, [Q(a0, 10.6, 4.5), Q(a0, 12.0, 4.5), Q(a1, 12.0, 4.5), Q(a1, 10.6, 4.5)], [0, 0, -1])
  // the roof: rim lip and the dark roof face
  const rr = rAt(top) - 0.35
  flat(silver, [P(a0, top), P(a1, top), Q(a1, rr, top), Q(a0, rr, top)], [0, 0, 1])
}
// Roof surfaces: a dark disc in each half, at its own level, with the
// roundel painted over the west (upper) half and spilling... drawn as flat
// fans clipped at the split.
function roofHalf(z: number, east: boolean) {
  const M = 48
  const pts: V3[] = []
  for (let s = 0; s <= M; s++) {
    const a = (s / M) * TAU
    const r = rAt(z) - 0.35
    let x = BC[0] + r * Math.cos(a), y = BC[1] + r * Math.sin(a)
    if (east ? x < SPLIT_X : x > SPLIT_X) x = SPLIT_X
    pts.push([x, y, z + 0.01])
  }
  const c: V3 = [east ? (SPLIT_X + BC[0] + RB) / 2 : (SPLIT_X + BC[0] - RB) / 2, BC[1], z + 0.01]
  for (let s = 0; s < M; s++) {
    if (Math.hypot(pts[s][0] - pts[s + 1][0], pts[s][1] - pts[s + 1][1]) < 1e-6) continue
    dark.tri(c, pts[s], pts[s + 1], undefined, undefined, undefined, [[0, 0, 1], [0, 0, 1], [0, 0, 1]])
  }
}
roofHalf(Z_W, false)
roofHalf(Z_E, true)
// The step's vertical face along the split, silver.
{
  const r = rAt(Z_E) - 0.35, hy = Math.sqrt(r * r - (SPLIT_X - BC[0]) ** 2)
  flat(silver, [[SPLIT_X, BC[1] - hy, Z_E], [SPLIT_X, BC[1] + hy, Z_E], [SPLIT_X, BC[1] + hy, Z_W], [SPLIT_X, BC[1] - hy, Z_W]], [1, 0, 0])
}
// The roof roundel on the upper (west) half, centred on the axis as in the
// aerial photo: white and blue quarters inside a dark ring. Only the part
// west of the split is drawn at the upper level; the east part sits on the
// lower roof.
{
  const R1 = 11.5, M = 40
  for (let s = 0; s < M; s++) {
    const a0 = (s / M) * TAU, a1 = ((s + 1) / M) * TAU, am = (a0 + a1) / 2
    const x0 = BC[0] + R1 * Math.cos(am)
    const z = (x0 > SPLIT_X ? Z_E : Z_W) + 0.03
    // keep each wedge on its own side of the step
    const clip = (a: number): V3 => {
      let x = BC[0] + R1 * Math.cos(a)
      const y = BC[1] + R1 * Math.sin(a)
      if (z === Z_W + 0.03 && x > SPLIT_X) x = SPLIT_X
      if (z === Z_E + 0.03 && x < SPLIT_X) x = SPLIT_X
      return [x, y, z]
    }
    const cx = z === Z_W + 0.03 ? Math.min(BC[0], SPLIT_X) : SPLIT_X
    // quarters as the badge seen from the south: blue upper-left (north-west)
    // and lower-right (south-east)
    const q = Math.cos(am) * Math.sin(am) < 0 ? blue : roofWhite
    q.tri([cx, BC[1], z], clip(a0), clip(a1), undefined, undefined, undefined, [[0, 0, 1], [0, 0, 1], [0, 0, 1]])
  }
}

// The glazed drum under the bowl and its white fascia.
{
  const M = 32
  for (let s = 0; s < M; s++) {
    const a0 = (s / M) * TAU, a1 = ((s + 1) / M) * TAU
    const P = (a: number, r: number, z: number): V3 => [BC[0] + r * Math.cos(a), BC[1] + r * Math.sin(a), z]
    const N = (a: number): V3 => [Math.cos(a), Math.sin(a), 0]
    face(win, [P(a0, 10.6, 0), P(a1, 10.6, 0), P(a1, 10.6, 3.4), P(a0, 10.6, 3.4)], [N(a0), N(a1), N(a1), N(a0)])
    face(white, [P(a0, 10.9, 3.4), P(a1, 10.9, 3.4), P(a1, 10.9, 4.5), P(a0, 10.9, 4.5)], [N(a0), N(a1), N(a1), N(a0)])
    flat(white, [P(a0, 10.6, 3.4), P(a0, 10.9, 3.4), P(a1, 10.9, 3.4), P(a1, 10.6, 3.4)], [0, 0, -1])
  }
}

// The low wing (way/163408029): two storeys, 6 m, glazed below a white band.
{
  const x0 = -23.0, x1 = 20.5, y0 = -4.0, y1 = 36.0
  const c: V3 = [(x0 + x1) / 2, (y0 + y1) / 2, 0], hx = (x1 - x0) / 2, hy = (y1 - y0) / 2
  box(win, c, [1, 0, 0], [0, 1, 0], hx - 0.6, hy - 0.6, 0, 3.2)
  box(white, c, [1, 0, 0], [0, 1, 0], hx, hy, 3.2, 5.6)
  box(silver, c, [1, 0, 0], [0, 1, 0], hx - 0.3, hy - 0.3, 5.6, 6.0)
}

// At night the bowl is washed from below: brightest on the underside and
// the lower wall, fading toward the rim; the roof is unlit.
const bowlLit = (p: V3, n: V3): number => (n[2] > 0.9 ? 0 : Math.max(0, 1 - Math.max(0, p[2] - 6) / 18))
const parts = [
  { part: silver, material: { ...finish('bmw-museum-silver', 0xc9ccce), floodlight: bowlLit } },
  { part: win, material: PALETTE.window },
  { part: white, material: PALETTE.trim },
  { part: blue, material: finish('bmw-blue', 0x3f72b3) },
  { part: dark, material: finish('bmw-charcoal', 0x666c73) },
  { part: roofWhite, material: finish('bmw-roof-white', 0xeef0f1) },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('BMW Museum', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 0, elevation: 0, height: 21, osm: 'way/298266716',
})
if (glb.length > 250_000) throw new Error(`Size budget exceeded: ${glb.length} bytes`)
const out = new URL('../models/munich-bmw-museum.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
