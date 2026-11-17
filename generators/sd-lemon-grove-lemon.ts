/**
 * The Big Lemon, Lemon Grove — the giant lemon on its pedestal at Broadway
 * and Main Street, beside the Lemon Grove Depot trolley stop, with "BEST
 * CLIMATE ON EARTH" cut into the base. A small famous object (STYLE.md,
 * "Towers, rides, sculpture and signs"), so it spends its budget on the
 * lemon's shape and on its lettering.
 *
 * Famous-sign exception (STYLE.md, "Famous signs"): the lemon's painted
 * "LEMON GROVE" (outlined deco capitals with a swash L and G, and a long
 * swash underline) and the base's incised roman capitals are the landmark's
 * identity, so they are modelled with `lettering.ts`, traced from Allan
 * Ferguson's photo. The small "THE CITY OF" and "CALIFORNIA INC., 1977" are
 * left out (a few centimetres tall).
 *
 * Frame: bearing 0. Map frame x east, y north, z up, metres; origin at the
 * anchor (−117.03088, 32.74253), the lemon's centre as seen on NAIP (about
 * 2 m east of OSM node/12636795301, "Lemon Grove Big Lemon"); y = 0 the
 * ground. The lemon's long axis runs east–west (NAIP: a yellow blob longer
 * east–west; the photo from Broadway, looking south, has the tracks on the
 * left and Main Street on the right), with the pointed tip to the west and
 * the lettered face and inscription to the north (toward Broadway).
 *
 * Sources
 * - OSM node/12636795301 (tourism=attraction, "Lemon Grove Big Lemon",
 *   3361 Main Street) © OSM contributors. No building in OSM: `replaces`
 *   is empty.
 * - USGS NAIP orthophoto (position, orientation, about 3 × 2 m in plan).
 * - Published: about 10 ft long, 6 ft high, 3,000 lb; a 1928 parade float
 *   plastered over and set up in 1930 (Alberto O. Treganza); "Best Climate
 *   On Earth" on the base (Wikipedia, "Lemon Grove, California"; Lemon Grove
 *   Historical Society, https://lghistorical.org/historic-lemon-grove/the-big-lemon/).
 * Photos (evidence)
 * - "Lemon Grove, CA.jpg", Allan Ferguson, 2006, CC BY 2.0,
 *   https://commons.wikimedia.org/wiki/File:Lemon_Grove,_CA.jpg — square on
 *   from the north: the lemon's profile, the lettering (traced from it), the
 *   dark band and pale base, the inscription.
 * - "Lemon grove monument.jpg", Allan Ferguson, 2012, CC BY-SA 2.0,
 *   https://commons.wikimedia.org/wiki/File:Lemon_grove_monument.jpg — from
 *   the north-west, low: the tip, the body's fullness, the dark band.
 *
 * Numbers (scale from the 2006 photo, 250 px a metre, set by the published
 * 10 ft length)
 * - Lemon 3.05 m long (published), 1.76 m high (published 6 ft; the photo
 *   agrees), round in section (assumed: no photo from the end). Profile
 *   traced from the photo.
 * - Light cap 0.08 m, dark band 0.30 m × 1.84 m long, base 2.52 m long and
 *   about 1.0 m high (its foot is hidden behind the fence: estimated) — all
 *   measured from the photo. Depths (1.5 m base, 1.2 m band) estimated.
 * - Top of the lemon about 3.1 m above the ground.
 * - Colours from the daylight photos: lemon yellow, dark green ink, a dark
 *   green-grey stone band, a pale grey concrete base.
 *
 * Night: ground spotlights by the fence (visible in the 2006 photo) light
 * the lemon, so it carries `_FLOODLIGHT`. No licensed night photo was found.
 *
 * Doubts
 * - Only the north face is photographed. The south face is left plain (no
 *   lettering, no inscription) rather than guessed.
 * - The lettering is a traced abstraction: the outlines are drawn as dark
 *   strokes at about twice their real weight so they survive at phone size.
 * - Too small to read at map zoom below about 17; minzoom 16 is the lowest
 *   the catalog allows.
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { cbox, rect, save } from './dc-white-house'
import { Pen, strokes, type Pt } from './lettering'

const LEMON = { ...finish('big-lemon-yellow', 0xefd93c, 0.7), floodlight: (_p: V3, n: V3) => 0.55 + 0.35 * Math.max(0, -n[2]) }
const INK = { ...finish('big-lemon-ink', 0x2f5a3c, 0.7), floodlight: () => 0.5 }
const BAND = finish('big-lemon-band', 0x56605a)
const BASE = { ...finish('big-lemon-base', 0xd9d4c8), floodlight: (_p: V3, n: V3) => (n[1] > 0.5 ? 0.35 : 0) }

// Lemon: 3.05 m long along x, tip at -x (west), blunt end at +x (east).
const HALF = 1.525, R = 0.88
const BASE_TOP = 1.0, LEDGE = 1.04, BAND_TOP = 1.34, CAP_TOP = 1.42
const ZC = CAP_TOP - 0.04 + R // lemon centre height (it sits 4 cm into the cap)

// Profile r/R against t, 0 at the blunt east end, 1 at the west tip (traced).
const PROFILE: [number, number][] = [
  [0, 0], [0.01, 0.22], [0.03, 0.42], [0.06, 0.6], [0.1, 0.75], [0.16, 0.86], [0.24, 0.94], [0.34, 0.99],
  [0.46, 1.0], [0.58, 0.98], [0.68, 0.92], [0.77, 0.82], [0.84, 0.67], [0.89, 0.53], [0.93, 0.39],
  [0.96, 0.26], [0.98, 0.16], [0.995, 0.06], [1, 0],
]
const xOf = (t: number) => HALF - 2 * HALF * t
function radiusAt(x: number) {
  const t = (HALF - x) / (2 * HALF)
  for (let i = 0; i < PROFILE.length - 1; i++) {
    const [t0, r0] = PROFILE[i], [t1, r1] = PROFILE[i + 1]
    if (t >= t0 && t <= t1) return R * (r0 + ((r1 - r0) * (t - t0)) / (t1 - t0 || 1))
  }
  return 0
}

/** The lemon: a surface of revolution about the x axis, smooth-shaded. */
function lemon(p: Part) {
  const SEG = 18
  const ring = PROFILE.map(([t, r]) => [xOf(t), r * R] as [number, number])
  // Normals of the profile curve in the (x, r) plane, averaged at each ring.
  const nrm = ring.map((_, i) => {
    const a = ring[Math.max(0, i - 1)], b = ring[Math.min(ring.length - 1, i + 1)]
    const dx = b[0] - a[0], dr = b[1] - a[1], l = Math.hypot(dx, dr) || 1
    // outward normal of the profile, which runs toward -x: (dr, -dx)
    return [dr / l, -dx / l] as [number, number]
  })
  const P = (i: number, k: number): V3 => {
    const a = (2 * Math.PI * k) / SEG
    return [ring[i][0], ring[i][1] * Math.cos(a), ZC + ring[i][1] * Math.sin(a)]
  }
  const N = (i: number, k: number): V3 => {
    const a = (2 * Math.PI * k) / SEG
    let [nx, nr] = nrm[i]
    if (i === 0) [nx, nr] = [1, 0]
    if (i === ring.length - 1) [nx, nr] = [-1, 0]
    return [nx, nr * Math.cos(a), nr * Math.sin(a)]
  }
  for (let i = 0; i < ring.length - 1; i++) {
    for (let k = 0; k < SEG; k++) {
      const a = P(i, k), b = P(i, k + 1), c = P(i + 1, k + 1), d = P(i + 1, k)
      const na = N(i, k), nb = N(i, k + 1), nc = N(i + 1, k + 1), nd = N(i + 1, k)
      if (i > 0) p.tri(a, b, c, undefined, undefined, undefined, [na, nb, nc])
      if (i < ring.length - 2) p.tri(a, c, d, undefined, undefined, undefined, [na, nc, nd])
    }
  }
}

// ---------------------------------------------------------------------------
// "LEMON GROVE", traced from Ferguson's 2006 photo. Coordinates are pixels of
// a 2× crop of it (crop origin 380, 160): photo px = 380 + zx / 2,
// 160 + zy / 2; the lemon spans photo px 222 (east end) to 985 (tip), its
// axis at photo y 335, 250 px a metre.
const Z = (zx: number, zy: number): Pt => [zx, zy]
const LINES: Pt[][] = [
  // L: crossbar top, the loop, back into the E's corner.
  [[25, 128], [110, 127], [185, 125], [215, 106], [245, 72], [290, 42], [335, 30], [358, 40], [352, 62], [318, 85], [275, 112], [240, 132]],
  // L: crossbar underside, stem, foot loop and the long swash underline.
  [[25, 128], [80, 140], [140, 160], [160, 178], [158, 250], [155, 330], [150, 385], [138, 430], [110, 445], [76, 472], [60, 510], [70, 545],
    [110, 556], [160, 540], [195, 500], [215, 458], [242, 432], [300, 412], [380, 400], [450, 400], [520, 412], [570, 442], [612, 476],
    [660, 505], [720, 512], [780, 496], [860, 478], [950, 462], [1030, 445], [1080, 425], [1102, 412]],
  // L: the foot loop's counter.
  [[100, 520], [104, 490], [124, 470], [150, 464], [152, 480], [132, 505], [100, 520]],
  // L stem's right side and the banner line under EMON, into the G.
  [[212, 140], [209, 250], [205, 352], [260, 340], [350, 331], [450, 323], [540, 323], [600, 331], [640, 346]],
  // The swash band's upper edge, the small bowl under the G, and on to the curl.
  [[226, 420], [300, 402], [400, 393], [480, 396], [545, 410], [598, 440], [620, 447]],
  [[620, 447], [640, 470], [670, 479], [700, 471], [706, 456], [620, 447]],
  [[706, 456], [760, 446], [860, 440], [960, 430], [1040, 414], [1088, 402], [1102, 412]],
  // G: the loop and curl over the top, the stem down to the swash.
  [[650, 90], [670, 65], [705, 57], [740, 68], [762, 95], [782, 96], [815, 95], [840, 108], [840, 128], [815, 140], [790, 148], [770, 166],
    [760, 230], [752, 330], [745, 380], [720, 396], [690, 376], [660, 352], [640, 346]],
  [[650, 90], [642, 125], [655, 160], [690, 175], [728, 170], [722, 250], [712, 320], [690, 331], [660, 336], [640, 346]],
  [[692, 100], [700, 85], [715, 90], [718, 115], [708, 140], [695, 130], [692, 100]],
  // E M O N
  [[245, 140], [305, 138], [305, 165], [275, 167], [275, 200], [300, 200], [300, 225], [275, 226], [275, 275], [305, 272], [305, 305], [245, 312], [245, 140]],
  [[310, 140], [345, 140], [360, 200], [375, 138], [405, 135], [410, 300], [385, 302], [383, 215], [365, 290], [350, 292], [335, 215], [335, 305], [310, 306], [310, 140]],
  [[485, 132], [515, 130], [560, 240], [560, 122], [595, 120], [598, 298], [570, 300], [522, 190], [522, 302], [488, 305], [485, 132]],
  // R O V E
  [[780, 215], [830, 215], [855, 240], [855, 290], [840, 310], [870, 430], [840, 432], [815, 330], [812, 330], [812, 432], [785, 435], [780, 215]],
  [[812, 245], [825, 245], [831, 266], [825, 290], [812, 290], [812, 245]],
  [[925, 262], [955, 262], [972, 375], [985, 265], [1000, 268], [985, 437], [958, 440], [925, 262]],
  [[1005, 275], [1045, 275], [1043, 300], [1028, 300], [1028, 340], [1043, 340], [1042, 365], [1028, 365], [1028, 410], [1048, 410], [1045, 440], [1003, 440], [1005, 275]],
].map((l) => l.map(([a, b]) => Z(a, b)))

function ellipse(cx: number, cy: number, rx: number, ry: number, n = 16): Pt[] {
  return Array.from({ length: n + 1 }, (_, i) => [cx + rx * Math.cos((2 * Math.PI * i) / n), cy + ry * Math.sin((2 * Math.PI * i) / n)] as Pt)
}
LINES.push(ellipse(445, 218, 32, 82), ellipse(445, 218, 12, 55), ellipse(900, 345, 33, 95), ellipse(900, 345, 12, 70))

/** Photo-crop pixel (u, v) → a point on the lemon's north face, w metres out along its normal. */
function onLemon(u: number, v: number, w: number): V3 {
  const sx = 380 + u / 2, sy = 160 + v / 2
  const x = HALF - (sx - 222) / 250, z = (335 - sy) / 250
  const r = radiusAt(x)
  const y = Math.sqrt(Math.max(0.0001, r * r - z * z))
  // Normal: gradient of y² + z² − r(x)² (with dr/dx by difference).
  const drdx = (radiusAt(x + 0.01) - radiusAt(x - 0.01)) / 0.02
  const n: V3 = [-r * drdx, y, z]
  const l = Math.hypot(n[0], n[1], n[2])
  return [x + (n[0] / l) * w, y + (n[1] / l) * w, ZC + z + (n[2] / l) * w]
}

// ---------------------------------------------------------------------------
// "BEST CLIMATE ON EARTH": incised roman capitals, cap height 1.
function glyph(c: string): { pen: Pen; w: number } {
  const p = new Pen()
  const serif = (x: number, y: number, d = 0.12) => p.moveTo([x - d, y]).lineTo([x + d, y])
  switch (c) {
    case 'B':
      p.moveTo([0, 0]).lineTo([0, 1]).lineTo([0.3, 1]).arc([0.3, 0.76], -Math.PI, 6).lineTo([0, 0.52])
      p.moveTo([0, 0.52]).lineTo([0.34, 0.52]).arc([0.34, 0.26], -Math.PI, 6).lineTo([0, 0])
      serif(0, 0); serif(0, 1)
      return { pen: p, w: 0.62 }
    case 'E':
      p.moveTo([0.5, 0.88]).lineTo([0.5, 1]).lineTo([0, 1]).lineTo([0, 0]).lineTo([0.55, 0]).lineTo([0.55, 0.13])
      p.moveTo([0, 0.52]).lineTo([0.38, 0.52]); serif(0, 0); serif(0, 1)
      return { pen: p, w: 0.56 }
    case 'S':
      p.moveTo([0.52, 0.86]).cubicTo([0.45, 1.03], [0.05, 1.03], [0.05, 0.77]).cubicTo([0.05, 0.53], [0.55, 0.5], [0.55, 0.25]).cubicTo([0.55, -0.03], [0.08, -0.03], [0.02, 0.15])
      return { pen: p, w: 0.57 }
    case 'T':
      p.moveTo([0, 0.88]).lineTo([0, 1]).lineTo([0.6, 1]).lineTo([0.6, 0.88]); p.moveTo([0.3, 1]).lineTo([0.3, 0]); serif(0.3, 0)
      return { pen: p, w: 0.6 }
    case 'C':
      p.moveTo([0.62, 0.8]).cubicTo([0.5, 1.04], [0.03, 1.04], [0.03, 0.5]).cubicTo([0.03, -0.04], [0.5, -0.04], [0.63, 0.2])
      return { pen: p, w: 0.65 }
    case 'L':
      p.moveTo([0, 1]).lineTo([0, 0]).lineTo([0.5, 0]).lineTo([0.5, 0.12]); serif(0, 1)
      return { pen: p, w: 0.52 }
    case 'I':
      p.moveTo([0.1, 0]).lineTo([0.1, 1]); serif(0.1, 0); serif(0.1, 1)
      return { pen: p, w: 0.2 }
    case 'M':
      p.moveTo([0, 0]).lineTo([0.05, 1]).lineTo([0.38, 0]).lineTo([0.71, 1]).lineTo([0.76, 0]); serif(0, 0, 0.09); serif(0.76, 0, 0.09)
      return { pen: p, w: 0.76 }
    case 'A':
      p.moveTo([0, 0]).lineTo([0.33, 1]).lineTo([0.66, 0]); p.moveTo([0.14, 0.36]).lineTo([0.52, 0.36]); serif(0, 0, 0.09); serif(0.66, 0, 0.09)
      return { pen: p, w: 0.66 }
    case 'O':
      p.circle([0.36, 0.5], 0.36, 0.5)
      return { pen: p, w: 0.72 }
    case 'N':
      p.moveTo([0, 0]).lineTo([0, 1]).lineTo([0.62, 0]).lineTo([0.62, 1]); serif(0, 0, 0.09); serif(0.62, 1, 0.09)
      return { pen: p, w: 0.62 }
    case 'R':
      p.moveTo([0, 0]).lineTo([0, 1]).lineTo([0.32, 1]).arc([0.32, 0.75], -Math.PI, 6).lineTo([0, 0.5]); p.moveTo([0.24, 0.5]).lineTo([0.6, 0]); serif(0, 0); serif(0, 1)
      return { pen: p, w: 0.62 }
    case 'H':
      p.moveTo([0, 0]).lineTo([0, 1]); p.moveTo([0.6, 0]).lineTo([0.6, 1]); p.moveTo([0, 0.52]).lineTo([0.6, 0.52])
      serif(0, 0, 0.09); serif(0, 1, 0.09); serif(0.6, 0, 0.09); serif(0.6, 1, 0.09)
      return { pen: p, w: 0.6 }
  }
  return { pen: p, w: 0.5 }
}

function inscription(text: string, gap: number, space: number) {
  const pen = new Pen()
  let u = 0
  for (const c of text) {
    if (c === ' ') { u += space; continue }
    const g = glyph(c)
    pen.add(g.pen, u)
    u += g.w + gap
  }
  return { pen, width: u - gap }
}

function build() {
  const yellow = new Part(), ink = new Part(), band = new Part(), base = new Part()

  // Pedestal: pale base with a ledge, the dark stone band, a light cap.
  cbox(base, rect(-1.26, 1.26, -0.75, 0.75), 0, BASE_TOP, { b: 0.04 })
  cbox(base, rect(-0.96, 0.96, -0.64, 0.64), BASE_TOP, LEDGE, { b: 0.02 })
  cbox(band, rect(-0.92, 0.92, -0.6, 0.6), LEDGE, BAND_TOP, { top: false })
  cbox(base, rect(-0.94, 0.94, -0.62, 0.62), BAND_TOP, CAP_TOP, { b: 0.02, bottom: true })

  lemon(yellow)

  // LEMON GROVE on the north face, outlines at about twice their weight.
  strokes(ink, LINES, { width: 12, depth: 1, place: (u, v, w) => onLemon(u, v, w * 0.012 - 0.004) })

  // BEST CLIMATE ON EARTH on the base's north face: 0.11 m capitals,
  // centred 0.75 m up, 1.97 m wide (photo).
  const H = 0.11
  const { pen, width } = inscription('BEST CLIMATE ON EARTH', 0.26, 0.5)
  const s = 1.97 / (width * H) // fit the measured width
  strokes(band, pen.paths, {
    width: 0.16, depth: 1,
    place: (u, v, w) => [0.985 - u * H * s, 0.75 + w * 0.008, 0.75 - H / 2 + v * H],
  })

  return [
    { part: yellow, material: LEMON },
    { part: ink, material: INK },
    { part: band, material: BAND },
    { part: base, material: BASE },
  ]
}

if (import.meta.main) {
  await save('sd-lemon-grove-lemon', 'The Big Lemon, Lemon Grove', build(), {}, 6500)
}
