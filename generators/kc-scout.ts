/**
 * The Scout, Penn Valley Park, Kansas City, Missouri (Cyrus E. Dallin;
 * modelled 1910, shown at the 1915 Panama-Pacific Exposition, placed here
 * 1916 and bought by public subscription in 1922) — procedural, CC0-1.0,
 * no textures.
 * bun generators/kc-scout.ts
 *
 * A bronze Sioux scout on horseback on a drum of stacked ledge stone at the
 * edge of the park's overlook, looking out over downtown. The horse stands
 * square and alert, head high and ears pricked, tail hanging; the rider sits
 * upright, his right hand raised to shade his eyes, his left at his waist
 * holding a long spear that slants from in front of his shoulder down past
 * the horse's rump; a single feather stands up from his headband.
 *
 * Frame: bearing 0 (x east, y north, z up, metres). Origin at OSM
 * node/3227538952 (tourism=artwork, "The Scout", Q7762663) on the overlook
 * terrace. No building: replaces []. z = 0 is the terrace (lidar 8.3 over
 * the box's ground_min, flat to within 0.3 m under the drum; the hill falls
 * away to the north and east beyond it).
 *
 * Evidence
 * - USGS 3DEP lidar MO_FEMANRCS_1_2020 (flown 2020), 0.5 m grid
 *   (SCRATCH/work/kc-scout/lidar.json): the drum's flat top at z 2.4-2.7,
 *   over x -2.8..0.6, y -2.2..2.4 (elongated north-south, centred about
 *   1.1 m west of the node); the bronze's highest return z 5.5 (2.9 m over
 *   the drum; returns off the dark bronze are sparse).
 * - Mapterhorn terrain: the terrace 8.3-8.6 round the drum.
 * - Photos (Wikimedia Commons, evidence):
 *   - "The Scout statue.jpg", Dean R Specker, CC BY-SA 4.0, from the front
 *     left, close: the pose of horse and rider, the spear, the reins
 *     https://commons.wikimedia.org/wiki/File:The_Scout_statue.jpg
 *   - "The Scout (195590495).jpeg", Benjamin White, CC BY-SA 3.0, from the
 *     rear left with downtown behind: the drum, the heading
 *     https://commons.wikimedia.org/wiki/File:The_Scout_(195590495).jpeg
 *   - "KC Scout.jpg", public domain (Commons), from the rear left: the drum
 *     https://commons.wikimedia.org/wiki/File:KC_Scout.jpg
 *   - "The Scout.jpg", Megan Hader, CC BY-SA 4.0, from the front left
 *     https://commons.wikimedia.org/wiki/File:The_Scout.jpg
 *
 * Measured: the drum's height and plan, the bronze's overall height (lidar).
 * Estimated: the heading, 330 degrees (NNW), from White's photo (taken
 * looking north-north-east over downtown, the Kauffman Center and the
 * cathedral's gold dome in view; it shows the rider's back and the horse's
 * left side, head to the left) and the drum's north-south elongation; every
 * pose detail from the photos, drawn on a horse a little over life size
 * (1.15 x, about 1.85 m at the withers) so that the rider's head stands
 * 3.15 m and the feather 3.4 m over the base plate: the lidar's 2.9 m is a
 * lower bound off sparse bronze returns, and White's photo sets the withers
 * at about 0.47 of the drum's width. The drum's courses (six, about
 * 0.43 m) and their ragged outline are drawn from the photos, the outline
 * invented in detail. Colours: bronze dark green-brown (#3c3f36 in the
 * photos, kept dark as it is the silhouette: #5a5b4f); ledge stone pale
 * warm grey in two tones.
 *
 * Doubts: the heading is not surveyed (+-20 degrees); the reins, necklace
 * and blanket are left out; the drum's real outline is irregular rock.
 * Night: no evidence of floodlighting; nothing lit.
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { smooth, tube, ellipsoid } from './nyc-columbus-monument'
import { saveModel } from './sd-california-tower'

const BRONZE = finish('scout-bronze', 0x5a5b4f, 0.5)
const LEDGE = finish('scout-ledge-stone', 0xdcd5c6)
const LEDGE_2 = finish('scout-ledge-stone-dark', 0xc9c1b0)

const HEAD = (330 * Math.PI) / 180
const C: V3 = [-1.1, 0.1, 0] // drum centre (lidar)
const FW: V3 = [Math.sin(HEAD), Math.cos(HEAD), 0], LF: V3 = [-Math.cos(HEAD), Math.sin(HEAD), 0]
const ZP = 2.6 // drum top

/** Deterministic jitter in [-1, 1]. */
const jit = (i: number, k: number) => Math.sin(i * 12.9898 + k * 78.233) * 43758.5453 % 1

function drum(a: Part, b: Part) {
  const N = 6, n = 18, A = 2.25, B = 1.7
  for (let k = 0; k < N; k++) {
    const z0 = (k * ZP) / N, z1 = ((k + 1) * ZP) / N
    // each course a little ragged; the courses step in and out by a few centimetres
    const ring = (z: number, inset: number): V3[] => Array.from({ length: n }, (_, i) => {
      const t = (i / n) * 2 * Math.PI, r = 1 + 0.06 * jit(i, k) - inset
      const f = A * r * Math.cos(t), s = B * r * Math.sin(t)
      return [C[0] + f * FW[0] + s * LF[0], C[1] + f * FW[1] + s * LF[1], z]
    })
    const p = k % 2 ? b : a
    const lo = ring(z0, 0.03), mid = ring(z1 - 0.12, 0), top = ring(z1, 0.025)
    p.loft([lo, mid, top])
    if (k === N - 1) p.cap(top, true)
    else p.cap(top, true)
  }
}

/** A point on the statue: f forward along the heading, s to the horse's left, u up from the base plate. */
const K = 1.15, ZB = ZP + 0.1
const H = (f: number, s: number, u: number): V3 => [
  C[0] + 0.05 * FW[0] + K * (f * FW[0] + s * LF[0]),
  C[1] + 0.05 * FW[1] + K * (f * FW[1] + s * LF[1]),
  ZB + K * u,
]

function statue(q: Part) {
  // the bronze base plate
  const pl = [H(-0.95, -0.36, -0.087), H(1.0, -0.36, -0.087), H(1.0, 0.36, -0.087), H(-0.95, 0.36, -0.087)]
  const pt = pl.map(([x, y]) => [x, y, ZB] as V3)
  q.loft([pl, pt]); q.cap(pt, true)

  // --- the horse, standing square and alert
  // barrel from buttock to chest
  tube(q, [H(-0.78, 0, 1.2), H(-0.6, 0, 1.3), H(-0.1, 0, 1.25), H(0.38, 0, 1.3), H(0.62, 0, 1.33)], [0.2, 0.33, 0.36, 0.35, 0.25], 12)
  // quarters, rounded over the hind legs
  ellipsoid(q, H(-0.55, 0, 1.22), [0.32, 0.34, 0.3], 10, 5, -HEAD + Math.PI / 2)
  // the neck held high, nearly upright, and the head carried level, nose a little down
  tube(q, [H(0.48, 0, 1.36), H(0.64, 0, 1.75), H(0.74, 0, 2.05), H(0.79, 0, 2.2)], [0.3, 0.23, 0.17, 0.14], 10)
  tube(q, [H(0.76, 0, 2.24), H(0.94, 0, 2.17), H(1.12, 0, 2.03), H(1.2, 0, 1.95)], [0.14, 0.13, 0.1, 0.085], 8)
  // mane crest and pricked ears
  tube(q, [H(0.42, 0, 1.6), H(0.6, 0, 1.92), H(0.72, 0, 2.2)], [0.07, 0.08, 0.05], 6)
  for (const s of [-0.06, 0.06]) tube(q, [H(0.76, s, 2.26), H(0.74, s * 1.3, 2.42)], [0.04, 0.01], 5)
  // legs: the near fore a stride ahead, the others square
  const leg = (pts: V3[]) => tube(q, pts, [0.12, 0.075, 0.062], 7)
  leg([H(0.5, 0.13, 1.05), H(0.62, 0.13, 0.52), H(0.66, 0.13, 0.04)])
  leg([H(0.48, -0.13, 1.05), H(0.5, -0.13, 0.52), H(0.5, -0.13, 0.04)])
  leg([H(-0.6, 0.14, 1.05), H(-0.74, 0.14, 0.55), H(-0.66, 0.14, 0.04)])
  leg([H(-0.6, -0.14, 1.05), H(-0.72, -0.14, 0.55), H(-0.62, -0.14, 0.04)])
  // gaskins and forearms, thickening the upper legs
  for (const s of [-0.14, 0.14]) {
    tube(q, [H(-0.58, s, 1.12), H(-0.7, s, 0.62)], [0.15, 0.08], 7)
    tube(q, [H(0.5, s * 0.95, 1.1), H(0.52 + (s > 0 ? 0.08 : 0), s * 0.95, 0.6)], [0.13, 0.075], 7)
  }
  for (const [f, s] of [[0.66, 0.13], [0.5, -0.13], [-0.66, 0.14], [-0.62, -0.14]] as [number, number][]) ellipsoid(q, H(f + 0.02, s, 0.05), [0.09, 0.075, 0.06], 6, 3, -HEAD + Math.PI / 2)
  // tail, hanging close
  tube(q, [H(-0.8, 0, 1.3), H(-0.92, 0, 1.0), H(-0.9, 0, 0.62)], [0.07, 0.1, 0.06], 7)

  // --- the scout, upright on a blanket
  tube(q, [H(-0.28, 0, 1.6), H(0.02, 0, 1.64), H(0.3, 0, 1.62)], [0.06, 0.2, 0.06], 8) // blanket over the back
  // thighs forward and down the horse's sides, the lower legs hanging
  for (const s of [-1, 1]) tube(q, [H(0.0, s * 0.14, 1.72), H(0.26, s * 0.36, 1.48), H(0.18, s * 0.34, 1.0), H(0.24, s * 0.33, 0.95)], [0.1, 0.08, 0.06, 0.05], 6)
  // torso, a little forward, and head
  tube(q, [H(-0.02, 0, 1.68), H(0.02, 0, 1.98), H(0.06, 0, 2.3)], [0.19, 0.18, 0.21], 8)
  ellipsoid(q, H(0.1, 0, 2.5), [0.12, 0.11, 0.14], 8, 4, -HEAD + Math.PI / 2)
  // the feather, up and a little back from the headband
  tube(q, [H(0.04, 0.0, 2.58), H(-0.01, 0.0, 2.95)], [0.035, 0.015], 5)
  // right arm up, the hand shading the eyes; left arm down at the waist on the spear
  tube(q, [H(0.06, -0.18, 2.28), H(0.24, -0.34, 2.42), H(0.22, -0.08, 2.55)], [0.075, 0.065, 0.05], 6)
  tube(q, [H(0.06, 0.18, 2.28), H(0.1, 0.28, 2.0), H(0.3, 0.16, 1.86)], [0.075, 0.065, 0.05], 6)
  // the spear, from in front of the shoulder down past the rump
  tube(q, [H(0.55, -0.02, 2.3), H(0.3, 0.16, 1.86), H(-1.25, 0.32, 1.25)], [0.04, 0.045, 0.035], 5)
}

function build() {
  const a = new Part(), b = new Part(), bronze = new Part()
  drum(a, b)
  smooth(bronze, statue, 60)
  return [
    { part: a, material: LEDGE },
    { part: b, material: LEDGE_2 },
    { part: bronze, material: BRONZE },
  ]
}

if (import.meta.main) await saveModel('kc-scout', 'The Scout', build(), 6500)
