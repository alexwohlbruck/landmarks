/**
 * Seven Magic Mountains (Ugo Rondinone, 2016), in the desert south of Las
 * Vegas: seven totems of stacked limestone boulders, each boulder painted
 * one day-glo colour. Procedural, CC0-1.0.
 * bun generators/lv-seven-magic-mountains.ts
 *
 * Map frame: x east, y north, z up, metres. Bearing 0. The origin is the
 * middle of the seven totems (their mean position), 4 m east-north-east of
 * the OSM node (node/4489080290); there is no OSM building to replace.
 *
 * Published (Wikipedia, "Seven Magic Mountains"; sevenmagicmountains.com):
 * seven towers of painted, locally quarried boulders, 30 to 35 ft (9.1 to
 * 10.7 m) tall, the boulders up to about 25 tons each.
 *
 * Measured: the layout from the USGS NAIP orthophoto (public domain), where
 * each totem is a bright spot with its shadow to the east: a loose line
 * running north-north-east for about 33 m, the totems 5 to 8 m apart, the
 * second-southernmost set back to the west. Positions to about a metre.
 *
 * Photos (Openverse / Flickr), naming the totems T1 (south) to T7 (north):
 * - f19 "Seven Magic Mountains Nevada", lewblank, CC BY-SA 2.0: all seven
 *   from the east, far off, so their heights compare at one scale (T3
 *   tallest, T6 shortest) and the order of colours reads cleanly;
 * - f1 "Seven Magic Mountain", Prayitno, CC BY 2.0 (49298463898): the same
 *   side, closer, boulder sizes and T3's sixth boulder;
 * - f4 "Seven Magic Mountains by Ugo Rondinone", TDelCoro, CC BY-SA 2.0
 *   (50017559538): all seven from the west, in reverse order, with people
 *   for scale: boulder heights and widths;
 * - f5 and f3 (TDelCoro 50018885982, CC BY-SA 2.0; Prayitno 49370591508,
 *   CC BY 2.0): close views of T1, T2, T5 and T7, the boulders' blocky,
 *   rounded shapes.
 *
 * The colours, top to bottom: T1 red, white, yellow, blue, black; T2 blue,
 * white, black, white, dark teal; T3 green, yellow, orange, red, pink,
 * pale pink; T4 pink, red, orange, yellow; T5 yellow, blue, white, pink;
 * T6 pink, black, white; T7 orange, yellow, green, blue, pink, red. T2's
 * teal base is drawn in the green, the pale pinks and T6's mauve in the
 * pink, the grey-white boulders in the white.
 *
 * Estimated: heights from f19 with T3 at the published 10.7 m; each
 * boulder's height and width from f4 and f1 (people for scale), widened
 * 15% after f5 and f3, its depth at 0.9 of its width; the boulders' irregular shapes (a seeded jitter on
 * an eight-sided lump), their small offsets and turns in the stack. Eight
 * finishes, two over the house limit of six: the totems are their colours,
 * and merging any pair (red into orange, black into blue) puts two
 * neighbouring boulders in one colour on several totems.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { finish } from './palette'

type XY = [number, number]

// Seeded random, so the model is the same on every run.
let seed = 7
const rnd = () => {
  seed |= 0
  seed = (seed + 0x6d2b79f5) | 0
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}
const jit = (a: number) => (rnd() * 2 - 1) * a

const C = {
  pink: new Part(), red: new Part(), orange: new Part(), yellow: new Part(),
  green: new Part(), blue: new Part(), white: new Part(), black: new Part(),
}
type Colour = keyof typeof C

/**
 * One boulder: an eight-sided lump lofted through four rings, blocky in the
 * middle and bevelled in at top and bottom, every corner jittered so it reads
 * as rough stone. Flat-shaded, so the facets catch the light.
 */
function boulder(p: Part, c: XY, z0: number, h: number, w: number, d: number, turn: number) {
  const n = 8
  const levels: [number, number][] = [[0, 0.74], [0.17, 1], [0.78, 0.97], [1, 0.68]]
  const phase = rnd() * Math.PI * 2
  const rings: V3[][] = levels.map(([f, k], li) => {
    const z = z0 + h * f + (li > 0 && li < levels.length - 1 ? jit(h * 0.05) : 0)
    return Array.from({ length: n }, (_, i) => {
      const a = phase + (i / n) * Math.PI * 2 + jit(0.18)
      const r = k * (1 + jit(0.14))
      const x = Math.cos(a) * (w / 2) * r, y = Math.sin(a) * (d / 2) * r
      const ct = Math.cos(turn), st = Math.sin(turn)
      return [c[0] + x * ct - y * st, c[1] + x * st + y * ct, z] as V3
    })
  })
  for (let k = 0; k < rings.length - 1; k++) {
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n
      p.quad(rings[k][i], rings[k][j], rings[k + 1][j], rings[k + 1][i])
    }
  }
  const top = rings[rings.length - 1], bot = rings[0]
  const centre = (r: V3[], z: number): V3 => [r.reduce((s, q) => s + q[0], 0) / n, r.reduce((s, q) => s + q[1], 0) / n, z]
  const apex = centre(top, z0 + h + h * 0.04)
  const foot = centre(bot, z0)
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    p.tri(top[i], top[j], apex)
    p.tri(bot[j], bot[i], foot)
  }
}

/** [colour, height, width] from the top boulder down. */
type Stack = { at: XY; height: number; boulders: [Colour, number, number][] }

// Positions from NAIP, metres east and north of (-115.2710, 35.8383);
// heights from f19; boulders from f4 and f1.
const TOTEMS: Stack[] = [
  { at: [-5.5, -15.5], height: 9.4, boulders: [['red', 2.4, 2.5], ['white', 1.3, 2.6], ['yellow', 1.9, 2.7], ['blue', 1.8, 3.6], ['black', 2.3, 2.3]] },
  { at: [-6.3, -6.0], height: 9.9, boulders: [['blue', 1.8, 2.9], ['white', 2.0, 2.1], ['black', 2.7, 2.0], ['white', 1.6, 2.3], ['green', 2.4, 3.2]] },
  { at: [0.5, -4.5], height: 10.7, boulders: [['green', 2.3, 2.6], ['yellow', 1.0, 2.5], ['orange', 1.5, 2.3], ['red', 2.0, 2.3], ['pink', 1.8, 2.4], ['pink', 1.6, 2.7]] },
  { at: [8.5, -2.8], height: 9.1, boulders: [['pink', 3.2, 2.6], ['red', 2.6, 2.5], ['orange', 2.6, 2.5], ['yellow', 2.2, 2.7]] },
  { at: [6.3, 6.0], height: 8.4, boulders: [['yellow', 1.4, 3.1], ['blue', 2.5, 2.9], ['white', 2.3, 2.3], ['pink', 3.1, 2.0]] },
  { at: [15.0, 7.5], height: 7.8, boulders: [['pink', 2.3, 1.8], ['black', 2.5, 1.8], ['white', 2.7, 2.2]] },
  { at: [14.5, 14.5], height: 9.2, boulders: [['orange', 2.6, 2.1], ['yellow', 1.5, 2.9], ['green', 1.15, 2.3], ['blue', 1.2, 3.1], ['pink', 1.5, 2.3], ['red', 2.0, 2.2]] },
]
const mean: XY = [
  TOTEMS.reduce((s, t) => s + t.at[0], 0) / TOTEMS.length,
  TOTEMS.reduce((s, t) => s + t.at[1], 0) / TOTEMS.length,
]

// Widths measured off f4 lose the boulders' soft edges to the sky; f5
// and f3, close up, show them broader.
const WIDEN = 1.15

for (const t of TOTEMS) {
  const at: XY = [t.at[0] - mean[0], t.at[1] - mean[1]]
  // Each boulder sinks a little into the one below, as the real ones sit.
  const sink = 0.12
  const sum = t.boulders.reduce((s, b) => s + b[1], 0)
  const k = (t.height + sink * (t.boulders.length - 1)) / sum
  let z = 0
  for (const [colour, h0, w] of [...t.boulders].reverse()) {
    const h = h0 * k
    const off: XY = [at[0] + jit(0.15), at[1] + jit(0.15)]
    boulder(C[colour], off, z, h, w * WIDEN, w * WIDEN * 0.9, rnd() * Math.PI)
    z += h - sink
  }
}

const FINISH: Record<Colour, number> = {
  pink: 0xee77ad, red: 0xde4a43, orange: 0xf08a35, yellow: 0xf0da45,
  green: 0x45b86a, blue: 0x3f72d2, white: 0xf3f0e8, black: 0x4a4f57,
}
const parts = (Object.keys(C) as Colour[]).map((c) => ({ part: C[c], material: finish(`magic-${c}`, FINISH[c], 0.9) }))
const triangles = parts.reduce((s, p) => s + p.part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Seven Magic Mountains', parts, {
  license: 'CC0-1.0', height: 10.7,
  frame: 'Y up, -Z north, +X east, metres; origin at the middle of the seven totems; bearing 0',
})
if (glb.length > 250000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/lv-seven-magic-mountains.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes; origin offset ${mean.map((v) => v.toFixed(2)).join(', ')} m`)
