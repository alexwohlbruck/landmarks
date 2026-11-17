/**
 * Some Sevit (세빛섬, the Floating Islands), Banpo Han River Park, Seoul:
 * procedural, CC0-1.0.
 * bun generators/seoul-some-sevit.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0. The origin is the
 * area-weighted centroid of the four islet outlines of OSM relation/4077217
 * (Gavit way/305677067, Chavit way/270550732, Solbit way/305677071, Yevit
 * way/305692221). y = 0 is the waterline: the map draws the river, so the
 * water itself is not modelled; the pontoons are (they are structures, the
 * islets' decks), 1.2 m freeboard (estimated from the hull against people
 * on deck in "Korea Sevit Island 04"). Elevation 0.
 *
 * Published (Money Today, 2014-12-27, mt.co.kr/estate/2014/12/27/2014122400441651139):
 * - Gavit 27 m high, 3 storeys (plus the roof deck), 5,478 m²;
 * - Chavit 21 m, 3 storeys, 3,419 m²; Solbit 13 m, 2 storeys, 1,098 m².
 * - Yevit (Wikipedia: 792 m²) is the small media-art and stage island.
 * - architect 해안건축 (Haeahn Architecture), Kim Tae-man; opened 2014.
 * Heights are taken above the deck.
 *
 * OSM: the three building footprints (Gavit way/414267182, Chavit
 * way/320797228, Solbit way/320797229), used as tagged; the islet outlines
 * give the pontoons. No heights tagged. Yevit has no building in OSM (a
 * bandstand node, 예빛섬 야외무대).
 *
 * From photos (forms; heights scaled to the published ones):
 * - Gavit: stacked volumes of dark grey-green glass in a white frame grid whose walls lean outward
 *   in faceted "petals": a low wing round the south and west (about a third
 *   of the height), the main volume to about three quarters, and a round
 *   glass drum on top at the north-east (Korea Sevit Island 07, 13, 15).
 * - Chavit: a big rounded silver-glass body filling its pontoon (drawn on
 *   the islet outline, 12 % in) to the published 21 m, wrapped at its west
 *   end in a white steel diagrid (the "egg", Korea Sevit Island 02), and
 *   big white arched ribs that sweep up its ends and curl about 10 m above
 *   the roof (13, and the 2012 panoramio photo).
 * - Solbit: a bronze, vertically ribbed ball (barrel-like, flattened top)
 *   with a leaning glass wedge on its west end (04, 13, panoramio).
 * Estimated: the tier heights and flares, the number of petals, the rib and
 * diagrid spacing (about half the real density, drawn thicker), the barrel
 * profile; Yevit's stage block (no usable photo of Yevit: invented, kept
 * plain).
 * Left out: railings, the link bridges (OSM way/305677069), LED media
 * facade, signage, roof furniture.
 *
 * Night: the islands are lit in colour by LED (the glass walls are
 * `window`, so they glow); the steel stays unlit.
 * The map's terrain is irrelevant on water; not checked (no z15 tiles).
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 * - "Korea Sevit Island 02 (15354607748).jpg", KOREA.NET (Republic of Korea), CC BY-SA 2.0
 *   https://commons.wikimedia.org/wiki/File:Korea_Sevit_Island_02_(15354607748).jpg
 * - "Korea Sevit Island 04 (15541583392).jpg", KOREA.NET, CC BY-SA 2.0
 *   https://commons.wikimedia.org/wiki/File:Korea_Sevit_Island_04_(15541583392).jpg
 * - "Korea Sevit Island 07 (14920001864).jpg", KOREA.NET, CC BY-SA 2.0
 *   https://commons.wikimedia.org/wiki/File:Korea_Sevit_Island_07_(14920001864).jpg
 * - "Korea Sevit Island 12 (15537998931).jpg", KOREA.NET, CC BY-SA 2.0
 *   https://commons.wikimedia.org/wiki/File:Korea_Sevit_Island_12_(15537998931).jpg
 * - "Korea Sevit Island 13 (15516982386).jpg", KOREA.NET, CC BY-SA 2.0
 *   https://commons.wikimedia.org/wiki/File:Korea_Sevit_Island_13_(15516982386).jpg
 * - "Korea Sevit Island 15 (15540663165).jpg", KOREA.NET, CC BY-SA 2.0
 *   https://commons.wikimedia.org/wiki/File:Korea_Sevit_Island_15_(15540663165).jpg
 * - "Han river architecture - as seen on TV - panoramio.jpg", gary4now, CC BY 3.0
 *   https://commons.wikimedia.org/wiki/File:Han_river_architecture_-_as_seen_on_TV_-_panoramio.jpg
 * No look-only references used.
 * Doubts: Gavit's tier split and the drum's position are read from oblique
 * photos; the south and east sides of Solbit are unphotographed; Yevit.
 */
import { Part, sub, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { TAU, add, beam, flat, lathe, mul, prism, tube, unit } from './seoul-n-seoul-tower'

const LON0 = 126.99491, LAT0 = 37.51173
const KX = 111320 * Math.cos((LAT0 * Math.PI) / 180), KY = 110574
const loc = ([lon, lat]: number[]): [number, number] => [(lon - LON0) * KX, (lat - LAT0) * KY]
type P2 = [number, number]

const ISLETS: Record<string, number[][]> = {
  chavit: [[126.9960996, 37.5122925], [126.9961654, 37.5123273], [126.996203, 37.5123537], [126.9962269, 37.5123714], [126.9962481, 37.512388], [126.9962702, 37.5124167], [126.996292, 37.5124402], [126.9963142, 37.512467], [126.9963322, 37.512495], [126.9963463, 37.5125235], [126.9963574, 37.5125541], [126.9963658, 37.5125865], [126.9963681, 37.5126184], [126.9963638, 37.5126501], [126.996346, 37.5126796], [126.9963235, 37.5127053], [126.9962926, 37.512728], [126.9962581, 37.5127446], [126.9962216, 37.5127541], [126.9961854, 37.512759], [126.9961478, 37.512761], [126.9961103, 37.512761], [126.9960767, 37.5127573], [126.9960446, 37.5127521], [126.996009, 37.5127456], [126.9959748, 37.5127376], [126.995946, 37.512728], [126.995918, 37.5127169], [126.9958076, 37.5126645], [126.9957492, 37.5126331], [126.9956933, 37.5125974], [126.995641, 37.5125599], [126.9956271, 37.5125513], [126.9956085, 37.5125272], [126.9955933, 37.5125094], [126.9955817, 37.5124939], [126.9955731, 37.5124823], [126.9955544, 37.5124551], [126.9955376, 37.5124264], [126.9955241, 37.5123982], [126.9955134, 37.5123675], [126.9955088, 37.5123381], [126.9955107, 37.5123061], [126.9955188, 37.512278], [126.995535, 37.5122489], [126.9955597, 37.512227], [126.9955901, 37.5122062], [126.9956241, 37.5121934], [126.9956662, 37.5121798], [126.9956992, 37.5121786], [126.9957369, 37.5121774], [126.995773, 37.5121791], [126.9958105, 37.5121833], [126.9958487, 37.5121908], [126.9958898, 37.5121998], [126.9959265, 37.5122115], [126.9959638, 37.5122249]],
  gavit: [[126.9952208, 37.5116045], [126.9951865, 37.5115679], [126.9950505, 37.5114226], [126.9948332, 37.5113131], [126.9947246, 37.5112833], [126.9946052, 37.5112822], [126.9945462, 37.511312], [126.9944818, 37.5113641], [126.994451, 37.5114439], [126.9944577, 37.5115322], [126.9944812, 37.5116322], [126.9944912, 37.5116785], [126.9945482, 37.5117625], [126.994577, 37.5118035], [126.9946374, 37.5118801], [126.994734, 37.5119673], [126.9948345, 37.5120301], [126.9949217, 37.5120793], [126.9949619, 37.5121035], [126.994991, 37.5121053], [126.9950826, 37.5121109], [126.9951577, 37.5121045], [126.9952693, 37.512042], [126.9953066, 37.511996], [126.9953186, 37.511958], [126.9953321, 37.5119154], [126.9953187, 37.5118365], [126.9953093, 37.5117763], [126.9952778, 37.5116939], [126.9952544, 37.5116524]],
  solbit: [[126.9948169, 37.512695], [126.99496, 37.5126799], [126.9950633, 37.5126365], [126.9950909, 37.5125965], [126.9950937, 37.5125802], [126.995092, 37.5125577], [126.9950433, 37.5124943], [126.9949677, 37.5124387], [126.994876, 37.512406], [126.9948395, 37.5123929], [126.9948011, 37.51239], [126.9947209, 37.512384], [126.9945918, 37.5123988], [126.9945396, 37.5124196], [126.99451, 37.5124577], [126.99451, 37.5125024], [126.9945489, 37.5125769], [126.9946039, 37.5126279], [126.9947196, 37.5126779]],
  yevit: [[126.9944667, 37.5105339], [126.9944755, 37.5105395], [126.9944938, 37.510551], [126.9945137, 37.5105636], [126.9947363, 37.5107039], [126.9947503, 37.5107127], [126.9947676, 37.5107236], [126.9945902, 37.5109006], [126.9942893, 37.5107109]],
}
const BLDG: Record<string, number[][]> = {
  chavit: [[126.9958217, 37.5122749], [126.995761, 37.5123097], [126.9957315, 37.5123606], [126.9957166, 37.5124118], [126.9957308, 37.5124715], [126.9957738, 37.512536], [126.9958327, 37.5125928], [126.9959123, 37.512631], [126.9960114, 37.5126454], [126.9961089, 37.5126311], [126.9962011, 37.5125915], [126.9962359, 37.5125297], [126.9962334, 37.5124707], [126.9961931, 37.5123957], [126.9961439, 37.512346], [126.9960284, 37.5122751], [126.995903, 37.5122603]],
  solbit: [[126.9947322, 37.5124397], [126.9946748, 37.512473], [126.9946551, 37.5125195], [126.9946647, 37.5125623], [126.9946972, 37.512601], [126.9947727, 37.5126336], [126.994854, 37.5126396], [126.9949352, 37.512631], [126.9949846, 37.5126177], [126.9950218, 37.5125836], [126.9950322, 37.5125453], [126.9950057, 37.5125046], [126.994933, 37.5124517], [126.9948643, 37.5124298], [126.9948018, 37.512425]],
  gavit: [[126.9946037, 37.5115263], [126.9945931, 37.5114309], [126.9946143, 37.511393], [126.994678, 37.5113523], [126.9947417, 37.5113453], [126.9948674, 37.5113958], [126.9948656, 37.5114393], [126.99497, 37.5114674], [126.9949659, 37.5115215], [126.9950655, 37.5115263], [126.9950638, 37.511567], [126.9951717, 37.5115993], [126.9952372, 37.511647], [126.9952797, 37.5117523], [126.9953027, 37.5118716], [126.9952797, 37.5118829], [126.9953009, 37.5119418], [126.9952885, 37.5119699], [126.9952425, 37.5119952], [126.9951505, 37.512026], [126.9950744, 37.5120331], [126.9949063, 37.5119924], [126.9947877, 37.5118871], [126.9947399, 37.5118141], [126.9946869, 37.5117257], [126.9946408, 37.5116218]],
}

function areaCentroid(r: P2[]) {
  let A = 0, cx = 0, cy = 0
  for (let i = 0; i < r.length; i++) {
    const [x0, y0] = r[i], [x1, y1] = r[(i + 1) % r.length], k = x0 * y1 - x1 * y0
    A += k; cx += (x0 + x1) * k; cy += (y0 + y1) * k
  }
  A /= 2
  return { A: Math.abs(A), c: [cx / (6 * A), cy / (6 * A)] as P2 }
}
// Anchor: area-weighted centroid of the islets.
let SA = 0, SX = 0, SY = 0
for (const k of Object.keys(ISLETS)) {
  const { A, c } = areaCentroid(ISLETS[k].map(loc))
  SA += A; SX += A * c[0]; SY += A * c[1]
}
const OX = SX / SA, OY = SY / SA
const ring = (ll: number[][]): P2[] => ll.map(loc).map(([x, y]) => [x - OX, y - OY] as P2)

/** Distance from c to the polygon's boundary along angle a (polygon star-shaped about c). */
function radiusAt(poly: P2[], c: P2, a: number) {
  const d = [Math.cos(a), Math.sin(a)]
  let best = 0
  for (let i = 0; i < poly.length; i++) {
    const p = poly[i], q = poly[(i + 1) % poly.length]
    const ex = q[0] - p[0], ey = q[1] - p[1]
    const den = d[0] * ey - d[1] * ex
    if (Math.abs(den) < 1e-9) continue
    const wx = p[0] - c[0], wy = p[1] - c[1]
    const t = (wx * ey - wy * ex) / den, s = (wx * d[1] - wy * d[0]) / den
    if (t > 0 && s >= 0 && s <= 1) best = Math.max(best, t)
  }
  return best
}
/** Resample a footprint as N radii about its centroid. */
function radial(poly: P2[], n: number) {
  const { c } = areaCentroid(poly)
  const r = Array.from({ length: n }, (_, i) => radiusAt(poly, c, (i / n) * TAU))
  return { c, r }
}
const ringAt = (c: P2, r: number[], z: number, f: (i: number, a: number) => number = () => 0, k = 1): V3[] =>
  r.map((ri, i) => {
    const a = (i / r.length) * TAU, rr = ri * k + f(i, a)
    return [c[0] + rr * Math.cos(a), c[1] + rr * Math.sin(a), z]
  })
/** Loft closed rings (counter-clockwise from above), flat-shaded, facing out. */
function loftRings(p: Part, rings: V3[][]) {
  for (let k = 0; k < rings.length - 1; k++) {
    const a = rings[k], b = rings[k + 1], n = a.length
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n
      p.quad(a[i], a[j], b[j], b[i])
    }
  }
}
function fanCap(p: Part, r: V3[], up: boolean) {
  const c = mul(r.reduce(add, [0, 0, 0] as V3), 1 / r.length)
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    if (up) p.tri(c, a, b)
    else p.tri(c, b, a)
  }
}

function build() {
  const teal = new Part()     // Gavit and Solbit glass (window)
  const silver = new Part()   // Chavit glass (window-2)
  const white = new Part()    // steel ribs, floor lines, parapets
  const roof = new Part()     // roofs
  const hull = new Part()     // pontoons
  const bronze = new Part()   // Solbit's ribbed barrel

  const DECK = 1.2
  // ---- Pontoons: every islet outline, hull and deck.
  for (const k of Object.keys(ISLETS)) prism(hull, hull, ring(ISLETS[k]), 0, DECK)

  // ---- Gavit: a main volume of outward-leaning glass petals to 21 m,
  //      with lower leaning wings round its west and south, and a round
  //      glass drum on top at the north-east.
  {
    const N = 48
    const { c, r } = radial(ring(BLDG.gavit), N)
    const z0 = DECK, H = 21, KIN = 0.74
    const deg = Math.PI / 180
    const rAt = (a: number) => {
      const t = (((a % TAU) + TAU) % TAU) / TAU * N, i = Math.floor(t) % N, f = t - Math.floor(t)
      return r[i] * (1 - f) + r[(i + 1) % N] * f
    }
    // Lean: a triangle wave in seven petals, 0.6 to 2.8 m at the top.
    const lean = (a: number) => {
      const t = ((((a % TAU) + TAU) % TAU) / TAU) * 7 % 1
      return 0.6 + 2.2 * (1 - Math.abs(2 * t - 1))
    }
    // Sectors: [from, to, main-volume radius factor]; wings fill the low ones.
    const sectors: [number, number, number][] = [[-50, 125, 1], [125, 165, KIN], [165, 280, KIN], [280, 310, 1]]
    const wings: [number, number, number][] = [[125, 165, 14.5], [165, 280, 9.5]]
    type Pt = [number, number] // [angle, k]
    const pts: Pt[] = []
    for (const [a0, a1, k] of sectors) {
      const steps = Math.max(2, Math.round((a1 - a0) / 7.5))
      for (let s2 = 0; s2 <= steps; s2++) pts.push([(a0 + ((a1 - a0) * s2) / steps) * deg, k])
    }
    // Each petal's top edge peaks at its middle (1.6 m), so the roofline
    // zigzags like the photos' tilted glass tops.
    const phase = (a: number) => (((((a % TAU) + TAU) % TAU) / TAU) * 7) % 1
    const tilt = (a: number) => 2.4 * (1 - Math.abs(2 * phase(a) - 1))
    /** A point on a volume of height h at fraction t of its height. */
    const P = ([a, k]: Pt, t: number, h: number, out = 0): V3 => {
      const rr = rAt(a) * k + lean(a) * t + out
      return [c[0] + rr * Math.cos(a), c[1] + rr * Math.sin(a), z0 + t * (h + tilt(a))]
    }
    const shell = (ptsL: Pt[], h: number, closed: boolean) => {
      const n = ptsL.length, m = closed ? n : n - 1
      for (let i = 0; i < m; i++) {
        const A = ptsL[i], B = ptsL[(i + 1) % n]
        teal.quad(P(A, 0, h), P(B, 0, h), P(B, 1, h), P(A, 1, h))
        // the white cornice along the top edge, proud of the wall
        const tA = 1 - 0.8 / (h + tilt(A[0])), tB = 1 - 0.8 / (h + tilt(B[0]))
        const a0 = P(A, tA, h, 0.12), b0 = P(B, tB, h, 0.12), a1 = P(A, 1, h, 0.12), b1 = P(B, 1, h, 0.12)
        white.quad(a0, b0, b1, a1)
        flat(white, [P(A, 1, h), P(B, 1, h), b1, a1], [0, 0, 1])
        flat(white, [a0, b0, P(B, tB, h), P(A, tA, h)], [0, 0, -1])
        // the white frame's floor lines, every two storeys
        for (const zl of [6.6, 13.2]) {
          if (zl > h - 2) continue
          const ta = zl / (h + tilt(A[0])), tb = zl / (h + tilt(B[0])), da = 0.55 / (h + tilt(A[0])), db = 0.55 / (h + tilt(B[0]))
          white.quad(P(A, ta, h, 0.12), P(B, tb, h, 0.12), P(B, tb + db, h, 0.12), P(A, ta + da, h, 0.12))
          flat(white, [P(A, ta + da, h), P(B, tb + db, h), P(B, tb + db, h, 0.12), P(A, ta + da, h, 0.12)], [0, 0, 1])
        }
      }
      // vertical white fins on the creases between petals
      const a0 = ptsL[0][0]
      for (let q = -7; q < 14; q++) {
        const ac = (q / 7) * TAU
        const inRange = closed ? q >= 0 && q < 7 : ac > Math.min(a0, ptsL[n - 1][0]) + 0.05 && ac < Math.max(a0, ptsL[n - 1][0]) - 0.05
        if (!inRange) continue
        const k = closed ? (ptsL.find(([aa]) => Math.abs(((aa - ac) % TAU + TAU + Math.PI) % TAU - Math.PI) < 0.2)?.[1] ?? 1) : 1
        if (closed && k < 1) continue
        tube(white, [P([ac, k], 0, h, 0.2), P([ac, k], 1, h, 0.2)], 0.55)
      }
    }
    shell(pts, H, true)
    const top = pts.map((q) => P(q, 1, H))
    const cc: V3 = [c[0], c[1], z0 + H]
    for (let i = 0; i < top.length; i++) roof.tri(cc, top[i], top[(i + 1) % top.length])
    // Wings: from the main volume's face out to the footprint, lower.
    for (const [a0, a1, h] of wings) {
      const steps = Math.max(2, Math.round((a1 - a0) / 7.5))
      const outer: Pt[] = Array.from({ length: steps + 1 }, (_, s2) => [(a0 + ((a1 - a0) * s2) / steps) * deg, 1])
      const inner: Pt[] = [...outer].reverse().map(([a]) => [a, KIN * 0.98])
      shell(outer, h, false)
      // the two short side walls
      const sw = (A: Pt, B: Pt) => teal.quad(P(A, 0, h), P(B, 0, h), P(B, 1, h), P(A, 1, h))
      sw(inner[inner.length - 1], outer[0])
      sw(outer[outer.length - 1], inner[0])
      for (let i = 0; i < outer.length - 1; i++) {
        const o0 = P(outer[i], 1, h), o1 = P(outer[i + 1], 1, h)
        const i1 = P(inner[inner.length - 2 - i], 1, h), i0 = P(inner[inner.length - 1 - i], 1, h)
        flat(roof, [i0, o0, o1, i1], [0, 0, 1])
      }
    }
    // Drum: round glass, north-east, to the published 27 m.
    const c3: P2 = [c[0] + 5, c[1] + 9]
    lathe(c3, [[8.5, z0 + 20.6], [9.2, z0 + 26.4]], () => teal, 24)
    lathe(c3, [[9.2, z0 + 26.4], [9.4, z0 + 27], [8.8, z0 + 27], [0, z0 + 27]], (b) => (b < 2 ? white : roof), 24)
  }

  // ---- Chavit: a silver glass egg, white diagrid over its west end,
  //      sweeping white arched ribs over the roof.
  {
    const N = 40
    // The body fills its pontoon (photo 13): the islet outline drawn in by
    // 12 % (OSM's building way is the inner core), to the published 21 m.
    const chav = (() => { const isl = ring(ISLETS.chavit), { c: ic } = areaCentroid(isl); return isl.map(([x, y]) => [ic[0] + (x - ic[0]) * 0.86, ic[1] + (y - ic[1]) * 0.86] as P2) })()
    const { c, r } = radial(chav, N)
    const z0 = DECK, H = 21
    const prof: [number, number][] = [[0, 0.96], [2, 1.0], [16, 1.0], [19, 0.94], [20.4, 0.84], [H, 0.66]]
    const rings = prof.map(([z, k]) => ringAt(c, r, z0 + z, () => 0, k))
    loftRings(silver, rings.slice(0, 5))
    loftRings(roof, rings.slice(4))
    fanCap(roof, rings[rings.length - 1], true)
    // floor lines
    for (const zz of [6.8, 12.6]) {
      const kz = (z: number) => {
        for (let i = 0; i < prof.length - 1; i++) if (z <= prof[i + 1][0]) return prof[i][1] + ((z - prof[i][0]) / (prof[i + 1][0] - prof[i][0])) * (prof[i + 1][1] - prof[i][1])
        return prof[prof.length - 1][1]
      }
      loftRings(white, [ringAt(c, r, z0 + zz, () => 0.12, kz(zz)), ringAt(c, r, z0 + zz + 0.5, () => 0.12, kz(zz + 0.5))])
    }
    // The rounded glass annexe on the south, with the media banner
    // (Korea Sevit Island 02 and 13).
    {
      const a = (268 * Math.PI) / 180, rr = radiusAt(chav, c, a) - 5.0
      const cd: P2 = [c[0] + rr * Math.cos(a), c[1] + rr * Math.sin(a)]
      lathe(cd, [[8.0, z0], [8.6, z0 + 7], [8.3, z0 + 13.5]], () => silver, 20)
      lathe(cd, [[8.3, z0 + 13.5], [8.5, z0 + 13.6], [8.5, z0 + 14.3], [0, z0 + 14.3]], (b) => (b < 2 ? white : roof), 20)
    }
    // Surface point of the egg at angle a and height z, pushed out by `off`.
    const kz = (z: number) => {
      for (let i = 0; i < prof.length - 1; i++) if (z <= prof[i + 1][0]) return prof[i][1] + ((z - prof[i][0]) / (prof[i + 1][0] - prof[i][0])) * (prof[i + 1][1] - prof[i][1])
      return prof[prof.length - 1][1]
    }
    const rAt = (a: number) => {
      const t = (((a % TAU) + TAU) % TAU) / TAU * N, i = Math.floor(t) % N, f = t - Math.floor(t)
      return r[i] * (1 - f) + r[(i + 1) % N] * f
    }
    const S = (a: number, z: number, off: number): V3 => {
      const rr = rAt(a) * kz(z) + off
      return [c[0] + rr * Math.cos(a), c[1] + rr * Math.sin(a), z0 + z]
    }
    // Diagrid over the west end (a from 100 to 245 degrees): two families
    // of helices, 9 each, drawn 0.7 m thick, 1.6 m off the glass.
    const deg = Math.PI / 180
    for (const dir of [-1, 1])
      for (let k = 0; k < 7; k++) {
        const pts: V3[] = []
        for (let s = 0; s <= 7; s++) {
          const u = s / 7, z = 0.6 + u * 19.4
          const a = (106 + k * 22 + dir * (u - 0.5) * 70) * deg
          if (a < 100 * deg || a > 245 * deg) continue
          pts.push(S(a, z, 1.6 + 0.6 * Math.sin(u * Math.PI)))
        }
        if (pts.length > 1) tube(white, pts, 0.7)
      }
    // The sweeping arched ribs: white tubes that rise from the deck at each
    // end, up the curve of the egg, and curl over the roof toward the
    // middle like petals: five at the west end, four at the east.
    const rib = (phi: number) => {
      const pts: V3[] = []
      for (let s = 0; s <= 6; s++) { const z = (s / 6) * 19; pts.push(S(phi, z, 2.4 + 2.4 * (z / 19) ** 2)) }
      const top = S(phi, 19, 4.8), mid: V3 = [c[0], c[1], 0]
      for (let s = 1; s <= 6; s++) {
        const u = s / 6, k = 1 - 0.5 * u
        pts.push([mid[0] + (top[0] - mid[0]) * k, mid[1] + (top[1] - mid[1]) * k, z0 + 19 + Math.sin(u * Math.PI * 0.62) * 10])
      }
      tube(white, pts, 1.4)
    }
    for (const d of [140, 160, 180, 200, 220]) rib(d * deg)
    for (const d of [-30, -10, 10, 30]) rib(d * deg)
  }

  // ---- Solbit: bronze ribbed barrel, leaning glass wedge on the west end.
  {
    const N = 32
    const { c, r } = radial(ring(BLDG.solbit), N)
    const z0 = DECK, H = 13
    const prof: [number, number][] = [[0, 0.68], [2.2, 0.88], [6.5, 1.0], [10.6, 0.88], [H, 0.64]]
    const rings = prof.map(([z, k]) => ringAt(c, r, z0 + z, () => 0, k))
    loftRings(bronze, rings)
    fanCap(roof, rings[rings.length - 1], true)
    // vertical ribs, 0.6 m proud, 0.6 wide, every other sample (16)
    for (let i = 0; i < N; i += 2) {
      const a = (i / N) * TAU + TAU / (2 * N)
      if (Math.cos(a) < -0.8) continue // under the wedge
      const ri = (k: number) => ((r[i] + r[(i + 1) % N]) / 2) * k
      const d: V3 = [Math.cos(a), Math.sin(a), 0], e: V3 = [-Math.sin(a), Math.cos(a), 0]
      for (let s = 0; s < prof.length - 1; s++) {
        const [za, ka] = prof[s], [zb, kb] = prof[s + 1]
        const A = add([c[0], c[1], z0 + za], mul(d, ri(ka) - 0.1)), B = add([c[0], c[1], z0 + zb], mul(d, ri(kb) - 0.1))
        const Ao = add(A, mul(d, 0.6)), Bo = add(B, mul(d, 0.6))
        const w = mul(e, 0.3)
        flat(bronze, [add(Ao, mul(w, -1)), add(Ao, w), add(Bo, w), add(Bo, mul(w, -1))], unit(sub(add(Ao, Bo), add(A, B))))
        flat(bronze, [add(A, w), add(B, w), add(Bo, w), add(Ao, w)], e)
        flat(bronze, [add(A, mul(w, -1)), add(Ao, mul(w, -1)), add(Bo, mul(w, -1)), add(B, mul(w, -1))], mul(e, -1))
      }
    }
    // The crown: a slatted rim proud of the roof edge.
    loftRings(bronze, [ringAt(c, r, z0 + H, () => 0, 0.64), ringAt(c, r, z0 + H + 1.4, () => 0.6, 0.64)])
    loftRings(bronze, [ringAt(c, r, z0 + H + 1.4, () => 0.3, 0.64).reverse(), ringAt(c, r, z0 + H, () => -0.3, 0.64).reverse()])
    // The glass wedge, leaning out to the west.
    const rw = radiusAt(ring(BLDG.solbit), c, Math.PI)
    const x0 = c[0] - rw * 0.8, hw = 6
    const q = (x: number, y: number, z: number): V3 => [x, c[1] + y, z]
    const xb = x0 - 3.5, xt = x0 - 6.5
    const boxPts = [q(x0, -hw, z0), q(xb, -hw, z0), q(xb, hw, z0), q(x0, hw, z0), q(x0, -hw, z0 + H + 1), q(xt, -hw, z0 + H + 1), q(xt, hw, z0 + H + 1), q(x0, hw, z0 + H + 1)]
    const [a, b, cc, d, e, f, g, h] = boxPts
    flat(teal, [b, cc, g, f], unit([-(H + 1), 0, -3]))
    flat(teal, [a, b, f, e], [0, -1, 0])
    flat(teal, [cc, d, h, g], [0, 1, 0])
    flat(roof, [e, f, g, h], [0, 0, 1])
    // white frame on the wedge's edges
    beam(white, b, f, 0.6); beam(white, cc, g, 0.6); beam(white, f, g, 0.6); beam(white, e, f, 0.5); beam(white, h, g, 0.5)
  }

  // ---- Yevit: a plain stage block on its pontoon (invented, no photo).
  {
    const yr = ring(ISLETS.yevit)
    const { c } = areaCentroid(yr)
    const ax = unit([yr[4][0] - yr[0][0], yr[4][1] - yr[0][1], 0]), ay: V3 = [-ax[1], ax[0], 0]
    const at = (u: number, v: number): P2 => [c[0] + ax[0] * u + ay[0] * v, c[1] + ax[1] * u + ay[1] * v]
    prism(white, roof, [at(-7, 2), at(7, 2), at(7, 10), at(-7, 10)], DECK, DECK + 5.5)
  }

  const parts = [
    { part: teal, material: { ...PALETTE.window, color: 0x6f8a85 } },
    { part: silver, material: windowVariant(2, 0xb2bcc5) },
    { part: white, material: PALETTE.trim },
    { part: roof, material: PALETTE.roof },
    { part: hull, material: finish('pontoon', 0x9a7b6c) },
    { part: bronze, material: finish('solbit-bronze', 0xc49a63) },
  ]
  const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
  if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
  const glb = writeGlb('Some Sevit', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
    bearing: 0, elevation: 0, height: DECK + 27,
  })
  if (glb.length > 250_000) throw new Error(`Size budget exceeded: ${glb.length} bytes`)
  const out = new URL('../models/seoul-some-sevit.glb', import.meta.url).pathname
  Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes; anchor ${(LON0 + OX / KX).toFixed(7)} ${(LAT0 + OY / KY).toFixed(7)}`)
}

if (import.meta.main) build()
