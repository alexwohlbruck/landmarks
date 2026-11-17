/**
 * San Diego–Coronado Bridge (1969; architect Robert Mosher; Caltrans;
 * steel fabricated and erected by Murphy Pacific) — procedural, CC0-1.0.
 * bun generators/sd-coronado-bridge.ts
 *
 * The whole bridge inside its OSM man_made=bridge outline as one placement:
 * the curving blue steel girder from the Coronado abutment, round the
 * 80-90 degree curve over the bay, up to the crest over the navigation
 * channel and down over Barrio Logan to where the ramps split; the slender
 * paired concrete piers with their cap beams; the pile caps and their dark
 * timber fenders in the water; the concrete parapets; the street lights.
 * The map draws the roadway surfaces; nothing here is a slab at road level
 * (a closing plate 0.3 m under the roadway keeps the hollow girder from
 * showing through).
 *
 * Frame: x east, y north, z up, metres (bearing 0, since the bridge
 * curves); origin at the outline's centroid, on the water. Everything is
 * laid out along `s`, the distance along the outline's midline from the
 * Coronado end (s = 0) to the outline's end at the ramp split (s = 2585).
 *
 * What makes it the Coronado Bridge: the long sweeping curve seen from
 * above; one continuous blue ribbon of girder rising steadily at 4.67% to
 * a high crest over the channel; tall, slender, paired concrete columns
 * under it, very tall at the channel and short near Coronado; the deep
 * box girder over the three channel spans; white parapets and a string of
 * street lights along both edges at night.
 *
 * Sources:
 * - OSM: outline way/1538967145 (man_made=bridge, bridge:structure=beam,
 *   layer 1, no height), 19.5-23.6 m wide along the span, widening to
 *   ~41 m over its last 300 m where a ramp merges; its midline (computed
 *   from the outline, cross-checked against the carriageways way/6055495,
 *   way/1538967139, way/1538967144, way/153343716) is PLAN below. The
 *   lidar deck sits within 1-2 m of it. The ramps beyond the split
 *   (way/1538967140-1538967143) and the Coronado approach on its fill are
 *   left to the map.
 * - Lidar (USGS 3DEP CA_SanDiegoQL2_2014, flown 2014; 1 m grids every
 *   75 m along the deck; water at 0.74 m NAVD88 = z 0): the roadway (lower
 *   quartile of the deck returns) rises on a straight 4.66% grade from
 *   15.5 m at s = 10 to 68.7 m at s = 1150, crests at 74.3 m at s = 1435
 *   and falls at 4.67% to 33.8 m at s = 2450 and 29.5 m at s = 2540; the
 *   deck 21 m wide. The flight has a hole over s = 1820-2440 (Barrio Logan);
 *   the grade is straight across it (63.7 m at 1810 and 33.8 m at 2450 sit
 *   on one 4.67% line). `road(s)` is that profile: two grades and a 626 m
 *   parabolic crest curve; these are the roadway heights to give the map.
 * - Published: total 11,179 ft (3,407 m) with approaches; 63 ft (19.2 m)
 *   between curbs, five lanes; 200 ft (61 m) navigation clearance; main
 *   span 660 ft; 32 spans, 21 piers in the water; grade 4.67%; the curve
 *   "80 degrees" (Wikipedia, "San Diego–Coronado Bridge"). The three
 *   channel spans 660, 660 and 560 ft are a continuous orthotropic steel
 *   box girder, "a single box girder 25 feet by 34 feet in cross section
 *   ... with wing decks cantilevering 15 feet 4 inches on either side";
 *   the other spans are welded steel plate girders (J. Murphy, "Early
 *   California Accelerated Steel Bridge Construction", SSEC Steel Tips,
 *   2007).
 * - USGS NAIP (public domain): the pile caps of the piers in the water,
 *   read along the midline at s = 828, 895, 962, 1036, the channel piers at
 *   1123, 1325, 1527 and 1696 (202, 202 and 171 m apart: the published 660,
 *   660 and 560 ft), and 1780 and 1857; the orthotropic deck's darker
 *   wearing surface from s = 1125 to 1705, which places the box girder.
 *   Pier shadows over Barrio Logan at about s = 1925, 1990, 2060, 2130.
 * - Mapterhorn terrain (3DEP) for the feet of the land piers: GROUND below,
 *   the DEM less its water reading (0.47 m), at each pair of columns.
 * - Photos (Wikimedia Commons): "San Diego–Coronado Bridge Near 2" and
 *   "San Diego–Coronado Bridge pier" (Mds08011, CC BY 4.0; the blue girder
 *   in sun, the pale parapet line, the paired columns and the fendered
 *   pile cap); "Coronado Bridge at Coronado" (Mds08011, CC0; the curve
 *   from the water, the cap beams); "San Diego-Coronado Bridge by Frank
 *   Mckenna" (Frank Mckenna, CC0; the whole curve from the air, west);
 *   "USS Dubuque (LPD-8) passes under the San Diego-Coronado Bridge on 31
 *   May 2007" (U.S. Navy, public domain; channel piers and the box);
 *   "San Diego-Coronado Bridge and Naval Station dfkvb" (Luciof, CC BY-SA
 *   3.0; piers 19 and 20 broadside, the box's depth); "Coronado Bridge
 *   2018" (Antony-22, CC BY-SA 4.0; the long profile from the north-west);
 *   "Coronado bridge night" (public domain) and "Coronado Bay Night JSOS"
 *   (Joshssky, CC BY-SA 4.0; the street lights, the unlit structure).
 * - Pier numbering: OSM has none; "19" and "20" are painted on the
 *   channel piers in the Luciof photo.
 * - Estimated: the pier stations on the curve (s = 80-760, 68 m apart,
 *   carried back from the pile caps NAIP shows, which gives the published
 *   21 piers in the water) and over Barrio Logan (66.6 m apart from 1857 to
 *   the end, from the shadows); the plate girders' depth (4.0 m, photos);
 *   the box's depth 7.6 m (published 25 ft; the Luciof photo agrees) and
 *   its width 10.4 m (34 ft); the columns' sections (channel 5.0 x 4.2 m at
 *   the top, flaring to 6.4 x 5.2 m; others 3.4 x 3.2 m, flaring 2% of
 *   their height), their centres 4.0 m either side of the axis, from
 *   the photos; the cap beams (2.4 m deep, photos); the pile caps (fender
 *   3 m high at the channel piers, from the pier photo, 2 m elsewhere); the parapets (0.85 m); the street
 *   lights, drawn every 64 m in pairs, about half their real number.
 * - Colours from the sunlit photos: the girder's blue (#159ee0-#2ca0de
 *   in sun, #18364d in overcast) pulled to #3f8fcf, its underside a shade
 *   darker; the concrete pale warm grey (#d3dcdc-#e4e0d5); the fenders
 *   charcoal.
 *
 * Night: the street lights along both parapets glow (`lamp`); the girder
 * and piers are not floodlit (the night photos show them dark).
 *
 * Doubts: the pier stations away from the NAIP pile caps are estimated;
 * the widened end (s > 2280) follows the OSM outline's width, not a
 * measured girder; the superelevation of the curve is left flat, since the
 * map draws the roadway flat; the map finds its own deck height for a beam
 * bridge, so its roadway may sit a few metres off road(s). The Coronado
 * end abutment sits in a fill the DEM shows up to the deck's height
 * (15.4 m at s = 0), so the girder's first metres run into that terrain.
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { bead } from './bridge-kit'
import { PALETTE, finish, type Swatch } from './palette'

const norm = (a: V3): V3 => { const l = Math.hypot(...a) || 1; return [a[0] / l, a[1] / l, a[2] / l] }

// ---- Plan ------------------------------------------------------------------

/** The outline's midline every 20 m of s, smoothed over 60 m (OSM). */
const PLAN: [number, number][] = [[-1117.4,-380.7],[-1098.1,-396.5],[-1086.5,-406.0],[-1071.0,-418.7],[-1055.5,-431.4],[-1040.0,-444.0],[-1024.6,-456.7],[-1009.1,-469.4],[-993.6,-482.0],[-977.8,-494.3],[-961.8,-506.2],[-945.2,-517.3],[-928.3,-528.0],[-911.1,-538.2],[-893.7,-547.9],[-875.8,-556.9],[-857.6,-565.1],[-839.0,-572.3],[-820.1,-578.9],[-801.1,-584.9],[-781.8,-590.2],[-762.5,-594.9],[-742.9,-599.0],[-723.2,-602.2],[-703.4,-604.7],[-683.6,-606.5],[-663.6,-607.6],[-643.7,-608.0],[-623.7,-607.6],[-603.8,-606.6],[-583.9,-604.7],[-564.1,-602.3],[-544.4,-599.1],[-524.8,-595.3],[-505.3,-591.0],[-486.0,-585.9],[-466.8,-580.1],[-448.0,-573.4],[-429.5,-565.7],[-411.4,-557.3],[-393.6,-548.1],[-376.1,-538.5],[-358.9,-528.4],[-342.1,-517.6],[-325.6,-506.4],[-309.6,-494.5],[-294.0,-482.0],[-279.0,-468.9],[-264.4,-455.3],[-250.2,-441.3],[-236.5,-426.8],[-223.2,-411.9],[-210.4,-396.5],[-197.6,-381.2],[-184.9,-365.8],[-172.1,-350.4],[-159.3,-335.0],[-146.6,-319.6],[-133.8,-304.2],[-121.0,-288.8],[-108.3,-273.4],[-95.5,-258.0],[-82.7,-242.6],[-70.0,-227.2],[-57.2,-211.8],[-44.4,-196.4],[-31.7,-181.0],[-18.9,-165.7],[-6.1,-150.3],[6.6,-134.9],[19.4,-119.5],[32.2,-104.1],[45.0,-88.7],[57.7,-73.3],[70.5,-57.9],[83.3,-42.5],[96.0,-27.1],[108.8,-11.7],[121.6,3.7],[134.3,19.1],[147.1,34.5],[159.9,49.9],[172.6,65.3],[185.4,80.7],[198.2,96.0],[210.9,111.4],[223.7,126.8],[236.5,142.2],[249.2,157.6],[262.0,173.0],[274.8,188.4],[287.5,203.8],[300.3,219.2],[313.1,234.6],[325.8,250.0],[338.6,265.4],[351.4,280.8],[364.2,296.2],[376.9,311.6],[389.7,327.0],[402.5,342.4],[415.2,357.7],[428.0,373.1],[440.8,388.5],[453.5,403.9],[466.3,419.3],[479.1,434.7],[491.8,450.1],[504.6,465.5],[517.4,480.9],[530.1,496.3],[542.8,511.8],[555.3,527.4],[567.8,543.0],[580.2,558.7],[592.6,574.3],[605.2,589.9],[617.8,605.4],[630.4,620.9],[643.1,636.5],[655.7,652.0],[668.2,667.5],[680.8,683.1],[693.3,698.8],[705.8,714.5],[718.2,730.2],[731.5,745.1],[744.9,759.9],[758.3,774.8],[765.1,782.1]]
const STEP = 20
const END = 2585

function planAt(s: number): [number, number] {
  const f = Math.min(Math.max(s / STEP, 0), PLAN.length - 1.0001)
  const i = Math.floor(f), t = f - i
  const a = PLAN[i], b = PLAN[i + 1]
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
}
/** The plan point at s, the unit tangent along s, and the unit normal to its left. */
function frame(s: number) {
  const p = planAt(s)
  const a = planAt(s - 10), b = planAt(s + 10)
  const l = Math.hypot(b[0] - a[0], b[1] - a[1])
  const t: [number, number] = [(b[0] - a[0]) / l, (b[1] - a[1]) / l]
  return { p, t, n: [-t[1], t[0]] as [number, number] }
}

// ---- Profile -----------------------------------------------------------------

/** The roadway above the water (lidar): 4.66% up, a 626 m crest curve, 4.67% down. */
const G1 = (s: number) => 17.0 + 0.0466 * (s - 40)
const G2 = (s: number) => 63.7 - 0.0467 * (s - 1810)
const BVC = 1113.5, EVC = 1739.5, A = 0.0466 + 0.0467
function road(s: number): number {
  if (s <= BVC) return G1(s)
  if (s >= EVC) return G2(s)
  return G1(s) - (A / (2 * (EVC - BVC))) * (s - BVC) ** 2
}

/** Overall width: 20.4 m (63 ft between curbs plus parapets), then the outline's widening. */
function width(s: number): number {
  const pts: [number, number][] = [[2280, 20.4], [2350, 28.5], [2400, 32.5], [2450, 36.5], [2500, 40], [END, 41]]
  if (s <= pts[0][0]) return 20.4
  for (let i = 1; i < pts.length; i++) if (s <= pts[i][0]) {
    const [s0, w0] = pts[i - 1], [s1, w1] = pts[i]
    return w0 + ((w1 - w0) * (s - s0)) / (s1 - s0)
  }
  return pts[pts.length - 1][1]
}

/** The box girder over the three channel spans; plate girders elsewhere. */
const BOX: [number, number] = [1123, 1696]
const BOX_DEPTH = 7.6, BOX_HALF = 5.2, PLATE_DEPTH = 4.0
const PARAPET_H = 0.85, PARAPET_W = 0.45, FASCIA = 1.3

// ---- Geometry helpers ------------------------------------------------------------

/** A point at station s, lateral offset u (left positive), height z. */
function at(s: number, u: number, z: number): V3 {
  const { p, n } = frame(s)
  return [p[0] + n[0] * u, p[1] + n[1] * u, z]
}

/** A quad wound to face `n`, with one normal per corner (smooth along s). */
function quadN(part: Part, a: V3, b: V3, c: V3, d: V3, na: V3, nb: V3) {
  const ok = (() => { const g = cross(sub(b, a), sub(c, a)); const m = [na[0] + nb[0], na[1] + nb[1], na[2] + nb[2]]; return g[0] * m[0] + g[1] * m[1] + g[2] * m[2] >= 0 })()
  if (ok) {
    part.tri(a, b, c, undefined, undefined, undefined, [na, nb, nb])
    part.tri(a, c, d, undefined, undefined, undefined, [na, nb, na])
  } else {
    part.tri(a, c, b, undefined, undefined, undefined, [na, nb, nb])
    part.tri(a, d, c, undefined, undefined, undefined, [na, na, nb])
  }
}

/**
 * A ribbon along s between two section points (u, dz below/above the
 * road), facing the section-plane normal (nu, nz): one quad per station
 * pair, normals turned with the curve.
 */
function ribbon(part: Part, ss: number[], e0: (s: number) => [number, number], e1: (s: number) => [number, number], nrm: [number, number]) {
  for (let i = 0; i < ss.length - 1; i++) {
    const sa = ss[i], sb = ss[i + 1]
    const pt = (s: number, e: (s: number) => [number, number]) => { const [u, dz] = e(s); return at(s, u, road(s) + dz) }
    const nv = (s: number): V3 => { const { n } = frame(s); return norm([n[0] * nrm[0], n[1] * nrm[0], nrm[1]]) }
    quadN(part, pt(sa, e0), pt(sb, e0), pt(sb, e1), pt(sa, e1), nv(sa), nv(sb))
  }
}

/** A closing face across the girder at station s, facing along -t (dir -1) or +t (dir +1). */
function endFace(part: Part, s: number, ring: [number, number][], dir: number) {
  const { t } = frame(s)
  const n: V3 = [t[0] * dir, t[1] * dir, 0]
  const pts = ring.map(([u, dz]) => at(s, u, road(s) + dz))
  for (let i = 1; i < pts.length - 1; i++) {
    const a = pts[0], b = pts[i], c = pts[i + 1]
    const g = cross(sub(b, a), sub(c, a))
    if (g[0] * n[0] + g[1] * n[1] + g[2] * n[2] >= 0) part.tri(a, b, c)
    else part.tri(a, c, b)
  }
}

/**
 * An upright prism in a pier's frame: centre (s, u), a ring of plan points
 * (along, across) at each height, lofted bottom to top; caps on request.
 */
function pierPrism(part: Part, s: number, u: number, rings: { z: number; a: number; b: number; c?: number }[], capTop = false, capBottom = false) {
  const { p, t, n } = frame(s)
  const ringAt = ({ z, a, b, c = 0 }: { z: number; a: number; b: number; c?: number }): V3[] => {
    const ha = a / 2, hb = b / 2
    const plan: [number, number][] = c > 0
      ? [[-ha + c, -hb], [ha - c, -hb], [ha, -hb + c], [ha, hb - c], [ha - c, hb], [-ha + c, hb], [-ha, hb - c], [-ha, -hb + c]]
      : [[-ha, -hb], [ha, -hb], [ha, hb], [-ha, hb]]
    // (along, across) -> world; across is +n (left); CCW from above.
    return plan.map(([al, ac]) => [p[0] + t[0] * al + n[0] * (u + ac), p[1] + t[1] * al + n[1] * (u + ac), z] as V3)
  }
  const rs = rings.map(ringAt)
  // The plan runs along t then across n (= t turned left), so it is CCW from above.
  for (let k = 0; k < rs.length - 1; k++) {
    const r0 = rs[k], r1 = rs[k + 1], m = r0.length
    for (let i = 0; i < m; i++) {
      const j = (i + 1) % m
      part.quad(r0[i], r0[j], r1[j], r1[i])
    }
  }
  if (capTop) part.cap(rs[rs.length - 1], true)
  if (capBottom) part.cap(rs[0], false)
}

// ---- Piers -----------------------------------------------------------------------

type Pier = { s: number; channel?: boolean; ground?: [number, number] }

/** Ground under the land piers' two columns (left, right), above the water (Mapterhorn - 0.47 m). */
const GROUND: Record<number, [number, number]> = {
  1924: [2.9, 2.9], 1990: [3.7, 3.5], 2057: [3.7, 3.4], 2124: [4.2, 4.2], 2190: [5.2, 5.2],
  2257: [6.8, 6.7], 2324: [7.7, 7.7], 2390: [9.1, 9.0], 2457: [10.4, 10.4], 2524: [11.5, 11.5], 2575: [12.8, 12.8],
}

const PIERS: Pier[] = [
  ...Array.from({ length: 12 }, (_, i) => ({ s: 80 + 68 * i })),       // the curve, 80..828
  { s: 895 }, { s: 962 }, { s: 1036 },
  { s: 1123, channel: true }, { s: 1325, channel: true }, { s: 1527, channel: true }, { s: 1696, channel: true },
  { s: 1780 }, { s: 1857 },
  ...Object.entries(GROUND).map(([s, g]) => ({ s: Number(s), ground: g })),
]

const inBox = (s: number) => s >= BOX[0] && s <= BOX[1]
const depth = (s: number) => (inBox(s) ? BOX_DEPTH : PLATE_DEPTH)

// ---- Build -----------------------------------------------------------------------

if (import.meta.main) {
  const blue = new Part(), shade = new Part(), concrete = new Part(), fender = new Part(), lamp = new Part(), deck = new Part()

  // Stations along the girder: 25 m round the curve, closer through the
  // crest curve, sparse on the straight grades, every 25 m where it widens.
  const stationsOf = (a: number, b: number, step: number) => {
    const n = Math.max(1, Math.ceil((b - a) / step))
    return Array.from({ length: n + 1 }, (_, i) => a + ((b - a) * i) / n)
  }
  const all = [...new Set([
    ...stationsOf(0, 1060, 25), ...stationsOf(1060, BVC, 30), ...stationsOf(BVC, EVC, 32),
    ...stationsOf(EVC, 2280, 90), ...stationsOf(2280, END, 25), BOX[0], BOX[1],
  ].map((s) => Math.round(s * 100) / 100))].sort((a, b) => a - b)

  // Three girder units: plate (Coronado), box (channel), plate (San Diego).
  const units: [number, number, boolean][] = [[0, BOX[0], false], [BOX[0], BOX[1], true], [BOX[1], END, false]]
  for (const [s0, s1, box] of units) {
    const ss = all.filter((s) => s >= s0 - 1e-6 && s <= s1 + 1e-6)
    const D = box ? BOX_DEPTH : PLATE_DEPTH
    const h = (s: number) => width(s) / 2
    const bw = (s: number) => (box ? BOX_HALF : h(s) - 0.8)
    for (const side of [1, -1]) {
      // Parapet: inner face, top, outer face (concrete).
      ribbon(concrete, ss, (s) => [side * (h(s) - PARAPET_W), 0], (s) => [side * (h(s) - PARAPET_W), PARAPET_H], [-side, 0])
      ribbon(concrete, ss, (s) => [side * (h(s) - PARAPET_W), PARAPET_H], (s) => [side * h(s), PARAPET_H], [0, 1])
      ribbon(concrete, ss, (s) => [side * h(s), 0], (s) => [side * h(s), PARAPET_H], [side, 0])
      // Fascia (blue), the wing's underside (shade), the web (blue).
      ribbon(blue, ss, (s) => [side * h(s), -FASCIA], (s) => [side * h(s), 0], [side, 0])
      const reach = h(s0 + 1) - bw(s0 + 1), l = Math.hypot(0.6, reach)
      ribbon(shade, ss, (s) => [side * bw(s), -FASCIA - 0.6], (s) => [side * h(s), -FASCIA], [(side * 0.6) / l, -reach / l])
      ribbon(blue, ss, (s) => [side * bw(s), -D], (s) => [side * bw(s), -FASCIA - 0.6], [side, 0])
    }
    // Soffit, and the closing plate under the roadway.
    ribbon(shade, ss, (s) => [-bw(s), -D], (s) => [bw(s), -D], [0, -1])
    ribbon(deck, ss, (s) => [-(h(s) - PARAPET_W), -0.3], (s) => [h(s) - PARAPET_W, -0.3], [0, 1])
    // Ends, closed: the web body, the deck with its wings, the parapets' ends.
    for (const [s, dir] of [[s0, -1], [s1, 1]] as [number, number][]) {
      const H = h(s), B = bw(s), W0 = -FASCIA - 0.6
      endFace(blue, s, [[-B, -D], [B, -D], [B, W0], [-B, W0]], dir)
      endFace(blue, s, [[-H, -FASCIA], [-B, W0], [B, W0], [H, -FASCIA], [H, -0.3], [-H, -0.3]], dir)
      endFace(concrete, s, [[-H, -0.3], [-H + PARAPET_W, -0.3], [-H + PARAPET_W, PARAPET_H], [-H, PARAPET_H]], dir)
      endFace(concrete, s, [[H - PARAPET_W, -0.3], [H, -0.3], [H, PARAPET_H], [H - PARAPET_W, PARAPET_H]], dir)
    }
  }

  // Piers.
  for (const pier of PIERS) {
    const { s } = pier
    const R = road(s), D = depth(s) + (pier.channel ? 0 : 0)
    const under = R - (pier.channel ? BOX_DEPTH : D)
    const H = width(s) / 2
    const c = pier.channel ? 4.0 : Math.max(4.0, H * 0.4)
    const water = !pier.ground
    const capTop = water ? (pier.channel ? 5.0 : 4.0) : 0
    // Pile cap in the water: a dark timber fender to 3 m, the concrete cap above.
    if (water) {
      const [fa, fb] = pier.channel ? [15, 26] : [9, 18.5]
      const fz = pier.channel ? 3.0 : 2.0
      pierPrism(fender, s, 0, [{ z: 0, a: fa, b: fb }, { z: fz, a: fa, b: fb }], true)
      pierPrism(concrete, s, 0, [{ z: fz, a: fa - 1.4, b: fb - 1.4 }, { z: capTop, a: fa - 1.4, b: fb - 1.4 }], true)
    }
    // Two columns, flaring toward the foot; a cap beam on the plate-girder piers.
    const capDepth = pier.channel ? 0 : 2.4
    const topZ = under - capDepth + 0.2
    for (const side of [-1, 1]) {
      const foot = water ? capTop : pier.ground![side < 0 ? 1 : 0] - 0.3
      const hgt = topZ - foot
      const [ta, tb] = pier.channel ? [5.0, 4.2] : [3.4, 3.2]
      const [ba, bb] = pier.channel ? [6.4, 5.2] : [ta + 0.02 * hgt, tb + 0.02 * hgt]
      // The flare is on the outer face only, so the gap between the columns stays parallel.
      const shift = (bb - tb) / 2
      const ringAt = (z: number, a: number, b: number, off: number) => ({ z, a, b, c: 0.45, off })
      const r0 = ringAt(foot, ba, bb, shift), r1 = ringAt(topZ, ta, tb, 0)
      // Two prisms can't share a centre that moves, so loft by hand: bottom ring offset outward.
      const { p, t, n } = frame(s)
      const ring = ({ z, a, b, c: ch, off }: { z: number; a: number; b: number; c: number; off: number }): V3[] => {
        const ha = a / 2, hb = b / 2, uc = side * (c + off)
        const plan: [number, number][] = [[-ha + ch, -hb], [ha - ch, -hb], [ha, -hb + ch], [ha, hb - ch], [ha - ch, hb], [-ha + ch, hb], [-ha, hb - ch], [-ha, -hb + ch]]
        return plan.map(([al, ac]) => [p[0] + t[0] * al + n[0] * (uc + ac), p[1] + t[1] * al + n[1] * (uc + ac), z] as V3)
      }
      const A0 = ring(r0), A1 = ring(r1)
      for (let i = 0; i < 8; i++) { const j = (i + 1) % 8; concrete.quad(A0[i], A0[j], A1[j], A1[i]) }
    }
    if (!pier.channel) {
      const half = H - 0.9
      const along = 4.2
      pierPrism(concrete, s, 0, [{ z: under - capDepth, a: along, b: 2 * half }, { z: under, a: along, b: 2 * half }], false, true)
    } else {
      // A short capital where the columns meet the box.
      for (const side of [-1, 1]) pierPrism(concrete, s, side * 4.0, [{ z: under - 1.2, a: 5.0, b: 4.2, c: 0.45 }, { z: under, a: 6.0, b: 4.8, c: 0.45 }], false, false)
    }
  }

  // Street lights: poles on both parapets every 64 m, a lamp bead on each.
  for (let s = 30; s < END - 10; s += 64) {
    const R = road(s), H = width(s) / 2
    for (const side of [-1, 1]) {
      const base = at(s, side * (H - 0.22), R + PARAPET_H), top = at(s, side * (H - 0.22), R + 10.5)
      const { t, n } = frame(s)
      // A three-sided pole, open at the ends.
      const r = 0.2
      const ring = (q: V3) => [0, 1, 2].map((k) => {
        const a = (2 * Math.PI * k) / 3
        return [q[0] + (t[0] * Math.cos(a) + n[0] * Math.sin(a)) * r, q[1] + (t[1] * Math.cos(a) + n[1] * Math.sin(a)) * r, q[2]] as V3
      })
      const r0 = ring(base), r1 = ring(top)
      for (let k = 0; k < 3; k++) { const j = (k + 1) % 3; concrete.quad(r0[k], r0[j], r1[j], r1[k]) }
      bead(lamp, at(s, side * (H - 1.4), R + 10.8), 1.0, true)
    }
  }

  const BLUE: Swatch = finish('coronado-blue', 0x3f8fcf)
  const SHADE: Swatch = finish('coronado-blue-shade', 0x2f70ad)
  const CONCRETE: Swatch = finish('concrete', 0xd9d6cc)
  const FENDER: Swatch = finish('fender', 0x4a4f57)
  const LAMP: Swatch = { name: 'lamp', color: 0x9aa0a6, roughness: 0.6 }
  const parts = [
    { part: blue, material: BLUE },
    { part: shade, material: SHADE },
    { part: concrete, material: CONCRETE },
    { part: fender, material: FENDER },
    { part: lamp, material: LAMP },
    { part: deck, material: PALETTE.roof },
  ]
  const tris = parts.reduce((n, p) => n + p.part.triangles, 0)
  if (tris > 6500) throw new Error(`${tris} triangles, over 6500`)
  const extras = {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the outline centroid, on the water',
    bearing: 0, elevation: 0, roadway: { coronadoEnd: road(0), crest: road(1426), crestAt: 1426, sanDiegoEnd: road(END), grade: 0.0467 },
  }
  const glb = writeGlb('San Diego–Coronado Bridge', parts, extras)
  console.log(parts.map((p) => `${p.material.name} ${p.part.triangles}`).join(", "))
  if (glb.length > 250 * 1024) throw new Error(`${glb.length} bytes, over 250 KB`)
  await Bun.write(new URL('../models/sd-coronado-bridge.glb', import.meta.url), glb)
  console.log(`sd-coronado-bridge.glb: ${tris} triangles, ${glb.length} bytes`)
}
