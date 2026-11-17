/**
 * Spotify Camp Nou, Barcelona, as rebuilt in 2023-2026 — original
 * procedural geometry, CC0-1.0. bun generators/barcelona-camp-nou.ts
 *
 * Uses the kit exported by generators/barcelona-arc-de-triomf.ts.
 *
 * Modelled as photographed in September 2026 (the newest licensed photos:
 * the bowl in use on 16 September 2026, the outside in July and September
 * 2025): three tiers of stands round the pitch, the upper tier rebuilt, the
 * outside a stack of cantilevered concourse rings on an exposed steel frame.
 * The new roof was not yet built and is not modelled; nor are the cranes.
 *
 * Frame: built turned to the pitch, BEARING 68.4: +-x is the pitch's long
 * axis (north-north-west / south-south-east), +-y its short axis. z up,
 * metres. Origin = the centroid of the OSM stadium outline way/34607291, the
 * centre spot; y = 0 is the pitch. `elevation` 0: the map's terrain already
 * holds the bowl (the pitch 10-12 m below the streets), so the map's own
 * lowest point is the pitch; with -8 the terrain check buries the lower
 * tier by 6.7 m.
 *
 * Evidence
 * - OSM way/34607291 (Spotify Camp Nou, leisure=stadium, Q159848), the
 *   construction outline relation/5503051 (building=construction, +-104 x
 *   +-81 m in this frame: the old stadium's footprint) and the old stands'
 *   parts relation/4094584, 4094585, 4094587, 4094588 (5 to 25 m).
 * - ICGC orthophoto (Institut Cartografic i Geologic de Catalunya,
 *   ortofoto_color_vigent WMS, CC BY 4.0), taken during the works: the
 *   plan. The bowl's rings, fitted as superellipses over it: the pitch edge
 *   +-58 x +-40, the first tier's rim +-86 x +-68, the second's +-108 x
 *   +-88, the top +-120 x +-100, the new steel frame from +-122 x +-102 at the
 *   street, the top eave to +-134 x +-114.
 * - Published (ca/en.wikipedia "Camp Nou", "Espai Barca"): rebuilt from 2023
 *   (Nikken Sekkei, B720), reopened in November 2025 with the third tier
 *   still being built; about 105,000 seats when complete; a roof to come.
 *   The pitch lies about 8 m below the surrounding streets (the 1957 bowl
 *   was dug into the ground); the model's street-level concourse is at 8.
 * - Mapterhorn terrain (bun tools/terrain.ts grid, check): the bowl reads
 *   10-12 m deep under the pitch's surroundings; the check passes with
 *   elevation 0.
 * - Commons photos (EVIDENCE):
 *   "Camp nou 2026.png" (Elad Eisenhammer, CC BY 4.0, 16 September 2026;
 *   the bowl from the lower tier: garnet seats, the third tier, no roof);
 *   "Camp Nou under renovation - Sept. 21, 2025.jpg" (SimpleObjects-9ei,
 *   CC BY-SA 4.0; the outside, the steel frame of the third tier and the
 *   ring concourses);
 *   "Obres del Camp Nou - 20250718 193920.jpg" (Pere Lopez Brosa, CC BY-SA
 *   4.0; the main front, the cantilevered rings and their white soffits).
 *
 * The third tier's exposed steel trusses are a zig-zag of bold braces round
 * the frame's top band (48, fewer than the real ones).
 *
 * Estimated from the photos: the tiers' heights (first to 15, second to 33,
 * third to 50 above the pitch), the frame leaning out 7 m from the street
 * (at 8) to the top (50), the concourse rings at 16, 24, 33 and 42 and the
 * top eave at 50, cantilevering 4.5-5 m past it. Colours from the
 * daylight photos, pulled to the palette's lightness: garnet seats, white
 * concrete rings, charcoal steel, the concourses' glazing (lit at night).
 *
 * Doubts: no licensed photo of the outside from 2026 was found, so the
 * cladding (if any was added in 2026) is not shown; the third tier's
 * completion round the whole bowl is taken from the 2026 photo's side; the
 * 8 m depth is the commonly published figure, not a measured section.
 */
import { Part, type V3 } from './mesh'
import { finish, windowVariant, type Swatch } from './palette'
import { beam, quadN, save } from './barcelona-arc-de-triomf'

const seats = new Part(), concrete = new Part(), steel = new Part(), glazing = new Part()
const N = 48, EXP = 2.6

/** A superellipse ring at height z, counter-clockwise from above. */
const ring = (a: number, b: number, z: number, n = EXP): V3[] =>
  Array.from({ length: N }, (_, i) => {
    const t = (2 * Math.PI * i) / N, c = Math.cos(t), s = Math.sin(t)
    return [a * Math.sign(c) * Math.abs(c) ** (2 / n), b * Math.sign(s) * Math.abs(s) ** (2 / n), z] as V3
  })
/** The band between two rings; its faces point up-and-in (`up`) or outward/downward. */
function band(p: Part, r0: V3[], r1: V3[], mode: 'up' | 'out' | 'in' | 'down') {
  for (let i = 0; i < N; i++) {
    const j = (i + 1) % N
    const A = r0[i], B = r0[j], C = r1[j], D = r1[i]
    const u: V3 = [B[0] - A[0], B[1] - A[1], B[2] - A[2]], v: V3 = [D[0] - A[0], D[1] - A[1], D[2] - A[2]]
    let n: V3 = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
    const m: V3 = [(A[0] + C[0]) / 2, (A[1] + C[1]) / 2, 0]
    const radial = n[0] * m[0] + n[1] * m[1]
    const flip =
      mode === 'up' ? n[2] < 0 : mode === 'down' ? n[2] > 0 : mode === 'out' ? radial < 0 : radial > 0
    if (flip) n = [-n[0], -n[1], -n[2]]
    quadN(p, A, B, C, D, n)
  }
}

// --- the bowl: three tiers of seats with concrete fascias between ---
const PITCH = ring(58, 40, 0, 4)
const T1a = ring(58, 40, 1.2, 4), T1b = ring(86, 68, 15)
band(concrete, PITCH, T1a, 'in') // the pitch-side wall
band(seats, T1a, T1b, 'up')
// a walkway, then the second tier rising from a fascia
const T2w = ring(89, 71, 15), T2f = ring(89, 71, 17.5), T2b = ring(108, 88, 33)
band(concrete, T1b, T2w, 'up')
band(concrete, T2w, T2f, 'in')
band(seats, T2f, T2b, 'up')
// the third tier
const T3w = ring(110, 90, 33), T3f = ring(110, 90, 35.5), T3b = ring(120, 100, 50)
band(concrete, T2b, T3w, 'up')
band(concrete, T3w, T3f, 'in')
band(seats, T3f, T3b, 'up')
// the rim and the back wall of the top tier
const RIMi = ring(120, 100, 51.2)
band(concrete, T3b, RIMi, 'in')

// --- the outside: the steel frame leaning out as it rises, and the concourse rings cantilevering from it ---
const lean = (z: number) => Math.max(0, z - 8) / 42 * 7 // the frame's outward lean, 0 at the street to 7 m at the top
const FA = (z: number) => 122 + lean(z), FB = (z: number) => 102 + lean(z)
band(steel, ring(FA(0), FB(0), 0), ring(FA(8), FB(8), 8), 'out')
band(steel, ring(FA(8), FB(8), 8), ring(FA(50), FB(50), 50), 'out')
// the top: from the rim of the stands out to the frame
band(concrete, ring(120, 100, 51.2), ring(FA(50) + 5, FB(50) + 5, 51.2), 'up')
for (const z of [16, 24, 33, 42, 50]) {
  const thick = z === 50 ? 1.2 : 0.9, o = z === 50 ? 5 : 4.5
  const iTop = ring(FA(z), FB(z), z + thick), oTop = ring(FA(z) + o, FB(z) + o, z + thick), oBot = ring(FA(z) + o, FB(z) + o, z), iBot = ring(FA(z), FB(z), z)
  if (z < 50) band(concrete, iTop, oTop, 'up')
  band(concrete, oBot, oTop, 'out')
  band(concrete, iBot, oBot, 'down')
  // the concourse behind each ring: a lit glazed band on the frame
  if (z < 50) band(glazing, ring(FA(z + thick) + 0.06, FB(z + thick) + 0.06, z + thick), ring(FA(z + 3.6) + 0.06, FB(z + 3.6) + 0.06, z + 3.6), 'out')
}
// the third tier's steel trusses: a zig-zag of bold braces round the frame's top band
{
  const lo = ring(FA(43) + 1.2, FB(43) + 1.2, 42.9), hi = ring(FA(50) + 1.2, FB(50) + 1.2, 50)
  for (let i = 0; i < N; i++) beam(steel, i % 2 ? lo[i] : hi[i], i % 2 ? hi[(i + 1) % N] : lo[(i + 1) % N], 0.8)
}

await save('barcelona-camp-nou', 'Spotify Camp Nou', [41.380885, 2.122814], 68.4, [
  { part: seats, material: finish('campnou-seats', 0xa45c66) },
  { part: concrete, material: { ...finish('campnou-concrete', 0xe3e1db), floodlight: (_p: V3, n: V3) => (n[2] > 0.7 ? 0.2 : 0.7) } as Swatch },
  { part: steel, material: finish('campnou-steel', 0x5b6168) },
  { part: glazing, material: windowVariant(2, 0x8fa3b3) },
], 6500)
