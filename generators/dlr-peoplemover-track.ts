/**
 * The PeopleMover track, Tomorrowland, Disneyland Park, Anaheim — procedural,
 * CC0-1.0.
 * bun generators/dlr-peoplemover-track.ts
 *
 * The PeopleMover (1967–1995) and its successor Rocket Rods (1998–2000) ran
 * on this elevated concrete track; it has stood unused since, repainted in
 * 2005. It weaves through Tomorrowland at second-storey height: out of the
 * station under the Observatron along a wide twin-track stem to the
 * Tomorrowland entrance, through the Star Tours and Space Mountain
 * buildings, past Pizza Port, through the Carousel Theater, then round the
 * Autopia and over the submarine lagoon and back into the Buzz Lightyear
 * building.
 *
 * Map frame: x east, y north, z up, metres. Origin at the middle of the
 * track's extent (-117.9171189, 33.8127842) on the ground; Tomorrowland is
 * flat. Bearing 0. The model is drawn in place, straight from OSM.
 *
 * What is drawn: the open-air track only — a flat deck whose off-white
 * fascias lean outward (as on the Autopia photos), a weathered grey running
 * surface, and pale chamfered piers with tapering T-heads. The deck around
 * the station ring and along the stem is OSM's roof outline way/371961449,
 * drawn as one slab; its piers by the entrance fork into a Y, as the
 * sculpted supports there do. Stretches inside buildings, the station's
 * Observatron tower (OSM way/107804130 and parts, left to the map) and the
 * station's arches are not drawn.
 *
 * Evidence:
 *  - OSM, measured: the track ways (railway=abandoned/disused, name
 *    PeopleMover), chained by shared nodes into two open runs — Space
 *    Mountain to the Carousel Theater (way/136149024, 135566805,
 *    135566811) and the long Autopia/lagoon loop (way/1516924401 …
 *    134991715) — and the stem/station roof way/371961449.
 *  - Photos (licensed): Autopia, 2019, the curved deck on square piers with
 *    a cross-beam head and its leaning fascia (Jeremy Thompson, CC BY 2.0,
 *    commons File:Disneyland_-_47853009581.jpg and _32908934237.jpg);
 *    the track over the submarine lagoon on T-headed piers (David Jones,
 *    CC BY 2.0, File:Submarine Voyage and Peoplemover - Disneyland,
 *    California (497087559).jpg); the stem deck from the station
 *    (Jeremy Thompson, CC BY 2.0, File:Rocket Rods 1.jpg); the deck by
 *    Pizza Planet, 2022 (Benoît Prieur, CC0, File:Rocket - Tomorrowland at
 *    Disneyland - July 2022.JPG); the loop behind Astro Orbitor
 *    (Carterhawk, CC BY-SA 3.0, File:Dlp astro orbitor.jpg); the station
 *    disc from the monorail station (HarshLight, CC BY 2.0, File:Space
 *    Mountain (28099690590).jpg). Mapillary 2014 night frames (brian_brea)
 *    show the Y supports at the entrance.
 *  - Published: Wikipedia, "PeopleMover (Disneyland)" — elevated track,
 *    station and track still standing as of 2026.
 *
 * Estimated: every height and section. Deck top 6.0 m (OSM tags the stem
 * roof 5 m; the Autopia pier with its block base, and the loop against
 * Astro Orbitor, both suggest about 6), deck 0.9 m deep, 3.0 m wide at the
 * top, piers 0.9 m every ~16 m (from the photos' spans). The stem's Y
 * piers are placed by eye, five along the stem; the photos show organic
 * branching supports there but not their count. Colours are the 2019
 * photos' pale grey-green, muted; parts of the track carry other paint
 * (tan fascias near the monorail station, a navy column by Pizza Planet),
 * which this ignores.
 *
 * Doubts: whether the deck is the same height all round (the north loop
 * over the Autopia may stand higher); the Autopia runs partly in a cut, so
 * the map's lowest-ground rule may sink the model a little; the station
 * ring is mostly hidden inside the OSM Observatron block (21 x 22 m, 9 m)
 * that the map still draws.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { finish } from './palette'

type XY = [number, number]

// ---------------------------------------------------------------------------
// OSM data (lon, lat), copied from the API map call on 2026-10-06.

const ANCHOR: XY = [-117.9171189, 33.8127842]
const OSM: Record<string, XY[]> = {
  '371961449': [[-117.9181835, 33.8122089], [-117.9181840, 33.8122078], [-117.9181842, 33.8122069], [-117.9181861, 33.8122002], [-117.9181867, 33.8121848], [-117.9181859, 33.8121764], [-117.9181848, 33.8121631], [-117.9181824, 33.8121572], [-117.9181745, 33.8121378], [-117.9181642, 33.8121292], [-117.9181474, 33.8121198], [-117.9181253, 33.8121153], [-117.9180347, 33.8121151], [-117.9180229, 33.8121149], [-117.9179947, 33.8121151], [-117.9179799, 33.8121152], [-117.9179457, 33.8121155], [-117.9177779, 33.8121168], [-117.9177308, 33.8121166], [-117.9176663, 33.8121166], [-117.9175337, 33.8121168], [-117.9174569, 33.8121168], [-117.9174072, 33.8121186], [-117.9173743, 33.8121198], [-117.9173508, 33.8121270], [-117.9173127, 33.8121421], [-117.9172905, 33.8121599], [-117.9172717, 33.8121771], [-117.9172524, 33.8121888], [-117.9172335, 33.8121978], [-117.9172038, 33.8122048], [-117.9171690, 33.8122086], [-117.9171378, 33.8122045], [-117.9171107, 33.8121902], [-117.9170773, 33.8121672], [-117.9170643, 33.8121487], [-117.9170612, 33.8121446], [-117.9170538, 33.8121338], [-117.9170514, 33.8121230], [-117.9170467, 33.8121177], [-117.9170461, 33.8120978], [-117.9170454, 33.8120836], [-117.9170488, 33.8120791], [-117.9170530, 33.8120580], [-117.9170660, 33.8120388], [-117.9170688, 33.8120348], [-117.9170759, 33.8120243], [-117.9171112, 33.8119990], [-117.9171293, 33.8119934], [-117.9171546, 33.8119849], [-117.9171925, 33.8119859], [-117.9172085, 33.8119860], [-117.9172516, 33.8120008], [-117.9172789, 33.8120214], [-117.9172935, 33.8120345], [-117.9173066, 33.8120462], [-117.9173481, 33.8120652], [-117.9173880, 33.8120791], [-117.9173898, 33.8120792], [-117.9174246, 33.8120808], [-117.9174775, 33.8120801], [-117.9175273, 33.8120795], [-117.9176423, 33.8120788], [-117.9177084, 33.8120784], [-117.9177773, 33.8120780], [-117.9179075, 33.8120766], [-117.9179654, 33.8120765], [-117.9179794, 33.8120764], [-117.9179879, 33.8120763], [-117.9181293, 33.8120741], [-117.9181535, 33.8120663], [-117.9181667, 33.8120525], [-117.9181783, 33.8120412], [-117.9181883, 33.8120100], [-117.9181887, 33.8120014], [-117.9181882, 33.8119934], [-117.9181875, 33.8119887], [-117.9181864, 33.8119833], [-117.9181837, 33.8119711], [-117.9181374, 33.8119203], [-117.9181650, 33.8119091], [-117.9181937, 33.8119370], [-117.9182207, 33.8119763], [-117.9182208, 33.8119799], [-117.9182213, 33.8119931], [-117.9182219, 33.8120089], [-117.9182199, 33.8120267], [-117.9182153, 33.8120403], [-117.9182047, 33.8120525], [-117.9181956, 33.8120695], [-117.9181920, 33.8120817], [-117.9181912, 33.8120988], [-117.9181930, 33.8121115], [-117.9181994, 33.8121246], [-117.9182033, 33.8121318], [-117.9182087, 33.8121417], [-117.9182170, 33.8121569], [-117.9182197, 33.8121818], [-117.9182218, 33.8121885], [-117.9182219, 33.8122055], [-117.9182213, 33.8122088], [-117.9182189, 33.8122136], [-117.9182170, 33.8122175], [-117.9182130, 33.8122253], [-117.9182031, 33.8122451], [-117.9181787, 33.8122691], [-117.9181595, 33.8122885], [-117.9181412, 33.8122631], [-117.9181591, 33.8122470], [-117.9181642, 33.8122412], [-117.9181796, 33.8122167], [-117.9181835, 33.8122089]],
  '524008560': [[-117.9173019, 33.8120628], [-117.9173128, 33.8120723], [-117.9173236, 33.8120762], [-117.9173359, 33.8120800], [-117.9173555, 33.8120851], [-117.9181115, 33.8120898], [-117.9181407, 33.8120844], [-117.9181572, 33.8120793], [-117.9181704, 33.8120702], [-117.9181815, 33.8120587], [-117.9181934, 33.8120442], [-117.9181997, 33.8120309], [-117.9182037, 33.8120141], [-117.9182056, 33.8119980], [-117.9182036, 33.8119818], [-117.9181971, 33.8119685], [-117.9181540, 33.8119187]],
  '133808478': [[-117.9181471, 33.8122773], [-117.9181833, 33.8122455], [-117.9181947, 33.8122330], [-117.9182022, 33.8122188], [-117.9182053, 33.8122012], [-117.9182039, 33.8121818], [-117.9182008, 33.8121625], [-117.9181954, 33.8121432], [-117.9181832, 33.8121253], [-117.9181671, 33.8121130], [-117.9181450, 33.8121063], [-117.9181152, 33.8121055], [-117.9173515, 33.8121074], [-117.9173340, 33.8121104], [-117.9173218, 33.8121141], [-117.9173099, 33.8121198], [-117.9173007, 33.8121275]],
  '136149024': [[-117.9170304, 33.8114746], [-117.9170298, 33.8115039], [-117.9170162, 33.8115339], [-117.9170014, 33.8115547], [-117.9169868, 33.8115702]],
  '135566805': [[-117.9169868, 33.8115702], [-117.9168592, 33.8117053]],
  '135566811': [[-117.9168592, 33.8117053], [-117.9168165, 33.8117506], [-117.9167984, 33.8117652], [-117.9167790, 33.8117718], [-117.9167547, 33.8117720], [-117.9167289, 33.8117625]],
  '1516924401': [[-117.9163409, 33.8122477], [-117.9163598, 33.8122657], [-117.9163700, 33.8122819], [-117.9163714, 33.8122903]],
  '1516924402': [[-117.9163714, 33.8122903], [-117.9163714, 33.8122990]],
  '1550883946': [[-117.9163714, 33.8122990], [-117.9163690, 33.8123087], [-117.9163643, 33.8123186], [-117.9163470, 33.8123475], [-117.9162683, 33.8124669], [-117.9161813, 33.8125954], [-117.9161142, 33.8126947], [-117.9160928, 33.8127302], [-117.9160727, 33.8127713], [-117.9160566, 33.8128360], [-117.9160439, 33.8129052]],
  '1550883947': [[-117.9160439, 33.8129052], [-117.9160445, 33.8129274], [-117.9160451, 33.8129580], [-117.9160533, 33.8129987]],
  '1550883948': [[-117.9160533, 33.8129987], [-117.9160614, 33.8130315], [-117.9160734, 33.8130610], [-117.9161110, 33.8131403]],
  '1550883949': [[-117.9161110, 33.8131403], [-117.9161361, 33.8131984], [-117.9161409, 33.8132437]],
  '1550883951': [[-117.9161409, 33.8132437], [-117.9161391, 33.8132851], [-117.9161312, 33.8133355], [-117.9161295, 33.8133690], [-117.9161306, 33.8133912], [-117.9161339, 33.8134099], [-117.9161420, 33.8134447], [-117.9161514, 33.8134692], [-117.9161672, 33.8134981], [-117.9161840, 33.8135217], [-117.9162065, 33.8135455], [-117.9162386, 33.8135671], [-117.9162815, 33.8135893], [-117.9163563, 33.8136232], [-117.9164204, 33.8136571], [-117.9164505, 33.8136764], [-117.9166178, 33.8138154], [-117.9166386, 33.8138421], [-117.9166507, 33.8138677], [-117.9166613, 33.8139190], [-117.9166704, 33.8139538], [-117.9166865, 33.8139839], [-117.9167084, 33.8140087], [-117.9167333, 33.8140322], [-117.9167613, 33.8140505], [-117.9167992, 33.8140676], [-117.9168353, 33.8140771], [-117.9168628, 33.8140815]],
  '1550883952': [[-117.9168628, 33.8140815], [-117.9168955, 33.8140841], [-117.9169391, 33.8140835], [-117.9169584, 33.8140832], [-117.9170014, 33.8140794], [-117.9170368, 33.8140716]],
  '133881710': [[-117.9170368, 33.8140716], [-117.9170847, 33.8140586], [-117.9171208, 33.8140439], [-117.9171571, 33.8140261], [-117.9172022, 33.8140011], [-117.9172404, 33.8139730], [-117.9172714, 33.8139447], [-117.9173004, 33.8139107], [-117.9173273, 33.8138701], [-117.9173482, 33.8138420], [-117.9173638, 33.8138121], [-117.9173826, 33.8137581], [-117.9173865, 33.8137252], [-117.9173798, 33.8136933], [-117.9173678, 33.8136679], [-117.9173583, 33.8136245], [-117.9173072, 33.8134935], [-117.9172764, 33.8134189], [-117.9172267, 33.8133587], [-117.9171869, 33.8133383], [-117.9171490, 33.8133268], [-117.9171127, 33.8133180], [-117.9170705, 33.8133128], [-117.9170180, 33.8133139], [-117.9167716, 33.8133350], [-117.9167287, 33.8133360], [-117.9166884, 33.8133318], [-117.9166608, 33.8133251], [-117.9166292, 33.8133094], [-117.9165991, 33.8132885], [-117.9164932, 33.8132161], [-117.9164519, 33.8131945], [-117.9164156, 33.8131794], [-117.9163692, 33.8131637], [-117.9163392, 33.8131565], [-117.9162812, 33.8131475], [-117.9162550, 33.8131396], [-117.9162355, 33.8131305], [-117.9162156, 33.8131196], [-117.9161962, 33.8131019], [-117.9161813, 33.8130834], [-117.9161686, 33.8130622], [-117.9161607, 33.8130388], [-117.9161585, 33.8130131], [-117.9161609, 33.8129878]],
  '1550883945': [[-117.9161609, 33.8129878], [-117.9161715, 33.8129627], [-117.9161861, 33.8129420], [-117.9162128, 33.8129155], [-117.9162484, 33.8128911], [-117.9162827, 33.8128754], [-117.9163650, 33.8128486]],
  '1550883944': [[-117.9163650, 33.8128486], [-117.9164023, 33.8128405], [-117.9164366, 33.8128381], [-117.9164684, 33.8128367], [-117.9165057, 33.8128347], [-117.9165264, 33.8128314], [-117.9165458, 33.8128253], [-117.9168271, 33.8127113], [-117.9169612, 33.8126645], [-117.9170200, 33.8126482], [-117.9170423, 33.8126442], [-117.9170789, 33.8126388], [-117.9171226, 33.8126355], [-117.9173986, 33.8126189], [-117.9174272, 33.8126130], [-117.9174500, 33.8126058]],
  '134991715': [[-117.9174500, 33.8126058], [-117.9175620, 33.8125979]],}

const MX = 111320 * Math.cos((ANCHOR[1] * Math.PI) / 180), MY = 110574
const local = ([lon, lat]: XY): XY => [(lon - ANCHOR[0]) * MX, (lat - ANCHOR[1]) * MY]
const way = (id: string) => OSM[id].map(local)

// ---------------------------------------------------------------------------
// Dimensions (see header for where each comes from)

const H = 6.0        // deck top above ground
const D = 0.9        // deck depth, top to soffit
const HALF = 1.5     // half the deck's top width
const SOFFIT = 1.15  // half the soffit width: the fascia leans out 0.35 m
const CAP = 0.55     // pier-head depth under the soffit
const SPAN = 16      // pier spacing along a single-track beam

const deckTop = new Part()   // running surface, weathered concrete
const deckSide = new Part()  // fascias and soffit, painted off-white
const pier = new Part()

// ---------------------------------------------------------------------------
// Kit

const sub2 = (a: XY, b: XY): XY => [a[0] - b[0], a[1] - b[1]]
const add2 = (a: XY, b: XY): XY => [a[0] + b[0], a[1] + b[1]]
const mul2 = (a: XY, k: number): XY => [a[0] * k, a[1] * k]
const len2 = (a: XY) => Math.hypot(a[0], a[1])
const unit2 = (a: XY): XY => mul2(a, 1 / (len2(a) || 1))
const left = (a: XY): XY => [-a[1], a[0]]
const unit3 = (a: V3): V3 => { const l = Math.hypot(...a) || 1; return [a[0] / l, a[1] / l, a[2] / l] }

function quad(p: Part, a: V3, b: V3, c: V3, d: V3, n?: [V3, V3, V3, V3]) {
  p.tri(a, b, c, undefined, undefined, undefined, n && [n[0], n[1], n[2]])
  p.tri(a, c, d, undefined, undefined, undefined, n && [n[0], n[2], n[3]])
}

/** Douglas–Peucker: drop OSM nodes that sit within `tol` of a straight run. */
function simplify(pts: XY[], tol: number): XY[] {
  if (pts.length < 3) return pts
  let worst = 0, at = 0
  const [a, b] = [pts[0], pts[pts.length - 1]]
  const ab = sub2(b, a), L = len2(ab) || 1
  for (let i = 1; i < pts.length - 1; i++) {
    const d = Math.abs(ab[0] * (pts[i][1] - a[1]) - ab[1] * (pts[i][0] - a[0])) / L
    if (d > worst) { worst = d; at = i }
  }
  if (worst <= tol) return [a, b]
  return [...simplify(pts.slice(0, at + 1), tol).slice(0, -1), ...simplify(pts.slice(at), tol)]
}

/**
 * One round of Chaikin corner cutting, keeping the ends: OSM's nodes sit
 * every 3–6 m round the curves, which shows as facets on a smooth beam.
 */
function smooth(pts: XY[]): XY[] {
  const out: XY[] = [pts[0]]
  for (let i = 0; i < pts.length - 1; i++) {
    const [a, b] = [pts[i], pts[i + 1]]
    if (i > 0) out.push(add2(mul2(a, 0.75), mul2(b, 0.25)))
    if (i < pts.length - 2) out.push(add2(mul2(a, 0.25), mul2(b, 0.75)))
  }
  out.push(pts[pts.length - 1])
  return out
}

/** Join ways end to start into one polyline, dropping the shared nodes. */
function chain(ids: string[]): XY[] {
  const out: XY[] = []
  for (const id of ids) {
    const w = way(id)
    if (out.length && len2(sub2(out[out.length - 1], w[0])) > 0.5) throw new Error(`gap before way/${id}`)
    out.push(...(out.length ? w.slice(1) : w))
  }
  return out
}

/** Unit tangent at each node (averaged across a corner) and the mitre scale. */
function frames(pts: XY[]) {
  return pts.map((p, i) => {
    const a = unit2(sub2(p, pts[Math.max(0, i - 1)]))
    const b = unit2(sub2(pts[Math.min(pts.length - 1, i + 1)], p))
    const t = unit2(i === 0 ? b : i === pts.length - 1 ? a : add2(a, b))
    const cos = i === 0 || i === pts.length - 1 ? 1 : Math.max(0.6, a[0] * t[0] + a[1] * t[1])
    return { t, n: left(t), k: 1 / cos }
  })
}

/**
 * The single-track beam: a flat deck whose fascias lean outward, swept along
 * a polyline. Shading is smooth along the track and crisp across it.
 */
function beam(pts: XY[]) {
  const f = frames(pts)
  // section corners, across (+ = left of travel) and up, with face normals
  const sec: [number, number][] = [[HALF, H], [SOFFIT, H - D], [-SOFFIT, H - D], [-HALF, H]]
  const lean = unit2([D, HALF - SOFFIT]) // fascia normal in (across, up)
  const at = (i: number, s: [number, number]): V3 => {
    const o = add2(pts[i], mul2(f[i].n, s[0] * f[i].k))
    return [o[0], o[1], s[1]]
  }
  const nAt = (i: number, across: number, up: number): V3 => unit3([f[i].n[0] * across, f[i].n[1] * across, up])
  for (let i = 0; i < pts.length - 1; i++) {
    const j = i + 1
    const [tl, bl, br, tr] = sec
    // top
    quad(deckTop, at(i, tr), at(j, tr), at(j, tl), at(i, tl), [[0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1]])
    // left fascia (+n side)
    quad(deckSide, at(i, tl), at(j, tl), at(j, bl), at(i, bl),
      [nAt(i, lean[0], lean[1]), nAt(j, lean[0], lean[1]), nAt(j, lean[0], lean[1]), nAt(i, lean[0], lean[1])])
    // right fascia
    quad(deckSide, at(i, br), at(j, br), at(j, tr), at(i, tr),
      [nAt(i, -lean[0], lean[1]), nAt(j, -lean[0], lean[1]), nAt(j, -lean[0], lean[1]), nAt(i, -lean[0], lean[1])])
    // soffit
    quad(deckSide, at(i, bl), at(j, bl), at(j, br), at(i, br), [[0, 0, -1], [0, 0, -1], [0, 0, -1], [0, 0, -1]])
  }
  // end faces, where the track runs into a building
  const end = (i: number, flip: boolean) => {
    const c = sec.map((s) => at(i, s))
    if (flip) quad(deckSide, c[0], c[1], c[2], c[3])
    else quad(deckSide, c[3], c[2], c[1], c[0])
  }
  end(0, false)
  end(pts.length - 1, true)
}

/** Positions and tangents every `step` metres along a polyline, `first` in. */
function along(pts: XY[], step: number, first: number, last = first) {
  const seg = pts.slice(1).map((p, i) => len2(sub2(p, pts[i])))
  const total = seg.reduce((s, l) => s + l, 0)
  const usable = total - first - last
  const n = Math.max(1, Math.round(usable / step))
  const out: { p: XY; t: XY }[] = []
  for (let k = 0; k <= n; k++) {
    let s = first + (usable * k) / n
    let i = 0
    while (i < seg.length - 1 && s > seg[i]) { s -= seg[i]; i++ }
    const t = unit2(sub2(pts[i + 1], pts[i]))
    out.push({ p: add2(pts[i], mul2(t, s)), t })
  }
  return out
}

/** A chamfered-square prism, its faces aligned with `t`. */
function shaft(c: XY, t: XY, half: number, cham: number, z0: number, z1: number) {
  const n = left(t)
  const ring: XY[] = [[half, half - cham], [half, -half + cham], [half - cham, -half], [-half + cham, -half],
    [-half, -half + cham], [-half, half - cham], [-half + cham, half], [half - cham, half]]
  const pt = (q: XY, z: number): V3 => [c[0] + t[0] * q[0] + n[0] * q[1], c[1] + t[1] * q[0] + n[1] * q[1], z]
  for (let i = 0; i < ring.length; i++) {
    const j = (i + 1) % ring.length
    // ring runs clockwise in (t, n), which is clockwise from above: wind outward
    quad(pier, pt(ring[j], z0), pt(ring[i], z0), pt(ring[i], z1), pt(ring[j], z1))
  }
}

/**
 * A pier head: a cross-beam under the soffit, square across the track, its
 * underside tapering in so it reads as a T rather than a box.
 */
function head(c: XY, t: XY, halfAcross: number, halfAlong: number, z0: number, z1: number) {
  const n = left(t)
  const P = (a: number, b: number, z: number): V3 => [c[0] + t[0] * a + n[0] * b, c[1] + t[1] * a + n[1] * b, z]
  const lo = halfAcross * 0.62
  const top = [P(halfAlong, halfAcross, z1), P(-halfAlong, halfAcross, z1), P(-halfAlong, -halfAcross, z1), P(halfAlong, -halfAcross, z1)]
  const bot = [P(halfAlong, lo, z0), P(-halfAlong, lo, z0), P(-halfAlong, -lo, z0), P(halfAlong, -lo, z0)]
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    quad(pier, bot[j], bot[i], top[i], top[j])
  }
  quad(pier, bot[0], bot[1], bot[2], bot[3])
}

function tPier(p: XY, t: XY) {
  const z1 = H - D, z0 = z1 - CAP
  shaft(p, t, 0.45, 0.13, 0, z0 + 0.05)
  head(p, t, SOFFIT, 0.45, z0, z1)
}

/**
 * The wide deck's piers by the Tomorrowland entrance branch into a Y, two
 * arms leaning out to the soffit's edges.
 */
function yPier(p: XY, t: XY, spread: number) {
  const n = left(t)
  const fork = 2.6, z1 = H - D
  shaft(p, t, 0.45, 0.13, 0, fork + 0.2)
  for (const s of [1, -1]) {
    const foot = add2(p, mul2(n, s * 0.25)), top = add2(p, mul2(n, s * spread))
    const a: V3 = [foot[0], foot[1], fork], b: V3 = [top[0], top[1], z1]
    // a square tube from a to b, 0.7 m across, faces aligned with t
    const ax = unit3([b[0] - a[0], b[1] - a[1], b[2] - a[2]])
    const u: V3 = [t[0], t[1], 0]
    const w = unit3([ax[1] * u[2] - ax[2] * u[1], ax[2] * u[0] - ax[0] * u[2], ax[0] * u[1] - ax[1] * u[0]])
    const r = 0.35
    const ring = (o: V3): V3[] => [[1, 1], [-1, 1], [-1, -1], [1, -1]].map(([i, j]) =>
      [o[0] + (u[0] * i + w[0] * j) * r, o[1] + (u[1] * i + w[1] * j) * r, o[2] + (u[2] * i + w[2] * j) * r] as V3)
    const ra = ring(a), rb = ring(b)
    for (let i = 0; i < 4; i++) {
      const j = (i + 1) % 4
      if (s > 0) quad(pier, ra[i], ra[j], rb[j], rb[i])
      else quad(pier, ra[j], ra[i], rb[i], rb[j])
    }
  }
}

// ---------------------------------------------------------------------------
// The deck around the station and along the stem to the Tomorrowland
// entrance: OSM maps it as one roof outline (way/371961449), so it is drawn
// as that slab, with its fascia leaning in like the beam's.

function earClip(poly: XY[]): [number, number, number][] {
  const idx = poly.map((_, i) => i)
  const out: [number, number, number][] = []
  const cross = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inTri = (p: XY, a: XY, b: XY, c: XY) => cross(a, b, p) >= 0 && cross(b, c, p) >= 0 && cross(c, a, p) >= 0
  let guard = 0
  while (idx.length > 3 && guard++ < 100000) {
    let cut = false
    for (let k = 0; k < idx.length; k++) {
      const i = idx[(k + idx.length - 1) % idx.length], j = idx[k], l = idx[(k + 1) % idx.length]
      const [a, b, c] = [poly[i], poly[j], poly[l]]
      if (cross(a, b, c) <= 1e-9) continue
      if (idx.some((m) => m !== i && m !== j && m !== l && inTri(poly[m], a, b, c))) continue
      out.push([i, j, l])
      idx.splice(k, 1)
      cut = true
      break
    }
    if (!cut) throw new Error('ear clipping failed')
  }
  out.push([idx[0], idx[1], idx[2]])
  return out
}

function slab(outline: XY[]) {
  let poly = outline.slice(0, -1)
  const area = poly.reduce((s, p, i) => { const q = poly[(i + 1) % poly.length]; return s + p[0] * q[1] - q[0] * p[1] }, 0)
  if (area < 0) poly = poly.reverse()
  const N = poly.length
  // outward normal at each node (averaged), for the inset soffit and shading
  const out = poly.map((p, i) => {
    const a = unit2(sub2(p, poly[(i + N - 1) % N])), b = unit2(sub2(poly[(i + 1) % N], p))
    const na: XY = [a[1], -a[0]], nb: XY = [b[1], -b[0]]
    const m = unit2(add2(na, nb))
    return { m, k: 1 / Math.max(0.5, m[0] * na[0] + m[1] * na[1]) }
  })
  const inset = HALF - SOFFIT
  const low = poly.map((p, i) => sub2(p, mul2(out[i].m, inset * out[i].k)))
  for (const [a, b, c] of earClip(poly)) {
    const up: V3 = [0, 0, 1], dn: V3 = [0, 0, -1]
    deckTop.tri([...poly[a], H] as V3, [...poly[b], H] as V3, [...poly[c], H] as V3, undefined, undefined, undefined, [up, up, up])
    deckSide.tri([...low[a], H - D] as V3, [...low[c], H - D] as V3, [...low[b], H - D] as V3, undefined, undefined, undefined, [dn, dn, dn])
  }
  const lean = unit2([D, inset])
  for (let i = 0; i < N; i++) {
    const j = (i + 1) % N
    const n = (q: number): V3 => unit3([out[q].m[0] * lean[0], out[q].m[1] * lean[0], lean[1]])
    quad(deckSide, [...low[i], H - D] as V3, [...low[j], H - D] as V3, [...poly[j], H] as V3, [...poly[i], H] as V3,
      [n(i), n(j), n(j), n(i)])
  }
}

slab(way('371961449'))

// Stem piers: under the middle of the twin-track deck, Y-shaped, between the
// station ring and the loops at the entrance end.
{
  const s1 = way('524008560'), s2 = [...way('133808478')].reverse()
  // both run from the station end westward; pair them by x
  const yAt = (pts: XY[], x: number) => {
    for (let i = 0; i < pts.length - 1; i++) {
      const [a, b] = [pts[i], pts[i + 1]]
      if ((a[0] - x) * (b[0] - x) <= 0 && a[0] !== b[0]) return a[1] + ((x - a[0]) / (b[0] - a[0])) * (b[1] - a[1])
    }
    throw new Error(`no stem at x=${x}`)
  }
  const xs = [s1[0][0] - 12, s1[0][0] - 26, s1[0][0] - 40, s1[0][0] - 54, s1[0][0] - 68]
  for (const x of xs) {
    const y = (yAt(s1, x) + yAt(s2, x)) / 2
    const t = unit2(sub2([x - 1, (yAt(s1, x - 1) + yAt(s2, x - 1)) / 2], [x, y]))
    yPier([x, y], t, 2.1)
  }
  // the two loops at the entrance end: single-track piers along each
  for (const pts of [s1, s2]) {
    const xEnd = s1[0][0] - 70
    const loop = pts.filter((p) => p[0] < xEnd)
    for (const { p, t } of along(loop, 11, 5, 3)) tPier(p, t)
  }
}

// ---------------------------------------------------------------------------
// The open single-track runs. Inside buildings (Star Tours, Space Mountain,
// the Carousel Theater, Buzz Lightyear) the track isn't drawn.

const RUNS = [
  // Space Mountain's east side past Pizza Port to the Carousel Theater
  ['136149024', '135566805', '135566811'],
  // out of the Carousel Theater, round the Autopia and the lagoon, back to
  // the Buzz Lightyear building
  ['1516924401', '1516924402', '1550883946', '1550883947', '1550883948', '1550883949', '1550883951',
    '1550883952', '133881710', '1550883945', '1550883944', '134991715'],
]
let piers = 0
for (const ids of RUNS) {
  const pts = simplify(smooth(chain(ids)), 0.08)
  beam(pts)
  for (const { p, t } of along(pts, SPAN, 5)) { tPier(p, t); piers++ }
}

// ---------------------------------------------------------------------------

const parts = [
  { part: deckTop, material: finish('peoplemover-deck', 0xc9cdc6) },
  { part: deckSide, material: finish('peoplemover-concrete', 0xe8ebe4) },
  { part: pier, material: finish('peoplemover-pier', 0xd9ddd5) },
]
const triangles = parts.reduce((sum, { part }) => sum + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('PeopleMover track', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 0, elevation: 0, height: H,
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/dlr-peoplemover-track.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles (${piers} beam piers), ${glb.length} bytes`)
