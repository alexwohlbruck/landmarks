/**
 * Allegiant Stadium, Las Vegas (2020, Manica Architecture with HNTB): the
 * black glass drum that flares outward as it rises, the white light lines
 * sweeping across it, the translucent ETFE roof, and the lanai, the great
 * glass wall at the north end that opens towards the Strip. The pitch is
 * not modelled. Procedural, CC0-1.0.
 * bun generators/lv-allegiant-stadium.ts
 *
 * Map frame: x east, y north, z up, metres. Bearing 0. The origin is the
 * centre of the roof as the NAIP orthophoto shows it; OSM's outline
 * (way/691478555) is the same size but sits about 25 m west of it.
 *
 * Measured, from NAIP (USGS, public domain), on a 20 m grid: the roof's
 * outer edge, a rounded rectangle 276 m east-west by 233 m north-south, and
 * the ETFE oval inside it, about 180 by 170 m.
 *
 * Published: OSM tags 69 m with a 7 m roof rise (roof:height). Wikipedia
 * ("Allegiant Stadium"): "a ten-level domed stadium featuring an ETFE roof,
 * silver and black exterior with light-up strips", "large retractable
 * curtain-like side windows facing the Las Vegas Strip", with the north end
 * zone "in front of the retractable windows".
 *
 * Photos (Wikimedia Commons), compared against the renders:
 * - p9 "Allegiantstadiumjune2020.jpg", JediRich, CC BY 3.0: from the north,
 *   the lanai's glass in six tall bays inside a white-lined frame, the
 *   black band below it, the flared rounded corners;
 * - p12 "Allegiant Stadium.jpg" and p1 "Allegiant Stadium (cropped).jpg",
 *   Tomás Del Coro, CC BY-SA 2.0: the long east side from I-15, the lines
 *   swooping down from the corners to meet low in the middle;
 * - p3, p5 "Allegiant Stadium, Las Vegas, Nevada (51426794436, 52258484672)",
 *   Ken Lund, CC BY-SA 2.0: the north entry and the lanai close up;
 * - p8 "Allegiant Stadium, view from Interstate 15 (2024-02-04).jpg", Amin
 *   Eshaiker, CC BY-SA 4.0: the east side's flare and roof edge.
 *
 * Estimated: the flare (the base 8 m inside the roof edge), the edge at
 * 62 m, the lines' paths, the lanai's extent (its centre a little east of
 * north, facing the Strip), the bay mullions. The black glass is pulled to
 * charcoal, per STYLE.md. The media mesh facing I-15 is a screen and is not
 * drawn; nor are the Al Davis torch and the entry canopies.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cap, save, type XY } from './lv-wynn'
import { quadTo } from './lv-mgm-grand'

const black = new Part()
const line = new Part() // the white light lines and the lanai's mullions
const lanai = new Part()
const etfe = new Part()

const A = 138, B = 116.5 // roof edge half-axes
const FLARE = 8 // the base is this much inside the roof edge
const EDGE = 62, TOP = 69
const EXP = 3.2 // superellipse exponent: a rounded rectangle
const N = 96

/** The superellipse's radius at polar angle t, for half-axes a, b. */
const rad = (t: number, a: number, b: number) =>
  Math.pow(Math.pow(Math.abs(Math.cos(t)) / a, EXP) + Math.pow(Math.abs(Math.sin(t)) / b, EXP), -1 / EXP)
/** A point on the wall at angle t and height z, `off` metres proud. */
const wall = (t: number, z: number, off = 0): V3 => {
  const f = z / EDGE
  const r = rad(t, A - FLARE * (1 - f), B - FLARE * (1 - f)) + off
  return [Math.cos(t) * r, Math.sin(t) * r, z]
}
const outward = (t: number): V3 => [Math.cos(t), Math.sin(t), 0.12]
const T = (i: number) => (i / N) * 2 * Math.PI
const deg = (d: number) => (d * Math.PI) / 180

// The drum, from the ground to the roof edge, and the roof's dark rim
// sloping up to the ETFE.
const RIM_IN = 0.68 // the ETFE oval as a fraction of the edge ring
for (let i = 0; i < N; i++) {
  const t0 = T(i), t1 = T(i + 1)
  quadTo(black, wall(t0, 0), wall(t1, 0), wall(t1, EDGE), wall(t0, EDGE), outward((t0 + t1) / 2))
  const rim = (t: number, s: number, z: number): V3 => [Math.cos(t) * rad(t, A, B) * s, Math.sin(t) * rad(t, A, B) * s, z]
  quadTo(black, rim(t0, 1, EDGE), rim(t1, 1, EDGE), rim(t1, RIM_IN, EDGE + 2), rim(t0, RIM_IN, EDGE + 2), [0, 0, 1])
}
// The ETFE roof: a shallow dome over the oval, up to 69 m.
{
  const rings = [[RIM_IN, EDGE + 2], [RIM_IN * 0.75, EDGE + 5], [RIM_IN * 0.45, TOP - 0.6], [RIM_IN * 0.2, TOP]]
  const ring = (s: number, z: number): V3[] =>
    Array.from({ length: N }, (_, k) => {
      const t = T(k)
      return [Math.cos(t) * rad(t, A, B) * s, Math.sin(t) * rad(t, A, B) * s, z] as V3
    })
  const R = rings.map(([s, z]) => ring(s, z))
  for (let j = 0; j < R.length - 1; j++)
    for (let k = 0; k < N; k++) quadTo(etfe, R[j][k], R[j][(k + 1) % N], R[j + 1][(k + 1) % N], R[j + 1][k], [0, 0, 1])
  cap(etfe, R[R.length - 1].map(([x, y]) => [x, y] as XY), TOP)
}

/**
 * A light line, 1.6 m tall and 0.15 m proud (the wall's facets sag 0.07 m
 * between corners), along the wall between polar angles a0 and a1
 * (degrees), at the height z(s) for s from 0 to 1.
 */
function stroke(a0: number, a1: number, z: (s: number) => number, h = 1.6) {
  const n = Math.max(2, Math.round(Math.abs(a1 - a0) / 3))
  for (let k = 0; k < n; k++) {
    const s0 = k / n, s1 = (k + 1) / n
    const t0 = deg(a0 + (a1 - a0) * s0), t1 = deg(a0 + (a1 - a0) * s1)
    const [lo, hi] = a1 > a0 ? [t0, t1] : [t1, t0]
    const [zl, zh] = a1 > a0 ? [z(s0), z(s1)] : [z(s1), z(s0)]
    quadTo(line, wall(lo, zl, 0.15), wall(hi, zh, 0.15), wall(hi, zh + h, 0.15), wall(lo, zl + h, 0.15), outward((lo + hi) / 2))
  }
}

// The base line all round, at the top of the entry level.
stroke(0, 360, () => 13)
// The swoosh (p12, p1): from high at both corners down to meet low in the
// middle, a V with curved arms, and a straight line along the top above it.
// Which sides p12 shows is not certain, so every side but the lanai's
// carries it.
for (const c of [0, 180, 270]) {
  const half = c === 270 ? 44 : 38
  stroke(c - half, c + half, (s) => 16 + 34 * Math.pow(Math.abs(2 * s - 1), 1.5))
  stroke(c - half * 0.65, c + half * 0.65, () => 55)
}

// The lanai at the north end, facing the Strip (p9): a glass wall in six
// tall bays between broad mullions, framed by a white line.
const L0 = 50, L1 = 116, LZ0 = 19, LZ1 = 50 // polar angles (deg) and heights
for (let k = 0; k < 24; k++) {
  const t0 = deg(L0 + ((L1 - L0) * k) / 24), t1 = deg(L0 + ((L1 - L0) * (k + 1)) / 24)
  quadTo(lanai, wall(t0, LZ0, 0.1), wall(t1, LZ0, 0.1), wall(t1, LZ1, 0.1), wall(t0, LZ1, 0.1), outward((t0 + t1) / 2))
}
stroke(L0 - 1, L1 + 1, () => LZ1, 1.4)
stroke(L0 - 1, L1 + 1, () => LZ0 - 1.4, 1.4)
for (let k = 0; k <= 6; k++) {
  const a = L0 + ((L1 - L0) * k) / 6, t0 = deg(a - 0.45), t1 = deg(a + 0.45)
  quadTo(line, wall(t0, LZ0, 0.17), wall(t1, LZ0, 0.17), wall(t1, LZ1, 0.17), wall(t0, LZ1, 0.17), outward(deg(a)))
}

await save('lv-allegiant-stadium', 'Allegiant Stadium', [
  { part: black, material: finish('allegiant-black', 0x4a4f57, 0.4) },
  { part: line, material: PALETTE.trim },
  { part: lanai, material: PALETTE.window },
  // The ETFE reads silver-grey from above (NAIP), not sky blue; still `glass`.
  { part: etfe, material: { ...PALETTE.glass, color: 0xc3cbd2 } },
], TOP, 'Y up, -Z north, +X east, metres; origin at the roof centre from NAIP (-115.18307, 36.090734); bearing 0')
