/**
 * Dubai International Airport (DXB), Terminal 2: procedural, CC0-1.0, no
 * textures.
 *
 *   bun generators/dubai-dxb-terminal-2.ts
 *
 * Built with the kit in dubai-dxb-terminal-3.ts.
 *
 * What is modelled
 * - Terminal 2 (way/98425234; opened 1998, rebuilt and doubled in 2012;
 *   flydubai's base, bus gates F1-F12, no jet bridges): a long, low,
 *   flat-roofed hall on the north-east side of the field, 708 m by 75-95 m.
 *   Its landside front (north-east) is a glazed wall in two tiers of
 *   grouped panels under a deep overhang that ends in a big rounded silver
 *   bullnose, drawn as a real half-round section (Ravi Dwivedi's photo),
 *   with a red-clad block beside the entrance. On the airside the roof
 *   overhangs too, its edge a white band (Andy Mabbett's 2024 aerials). The
 *   roof carries grey solar fields between white walkways and plant boxes
 *   along its spine; the higher north-west block stands at the end.
 *
 * Frame: x along the terminal (to bearing 121.3 deg, south-east), y to the
 * north-east (the landside), z up, metres; placed at bearing 31.3. Anchor:
 * the area centroid of way/98425234, lng 55.3570379, lat 25.2660882. Flat
 * site (Mapterhorn z12).
 *
 * Numbers
 * - Footprint: OSM way/98425234 (ODbL), fetched 2026-11.
 * - Glass walls to 9.2 m (transom at 5.7 m, 9 m bays), the roof edge at
 *   12.4 m, the landside bullnose 3.2 m deep standing 5.5 m out from the
 *   glass, the airside roof 5 m out; the red block 12 m wide: estimated from the buses (12 m long, 3.3 m tall) in
 *   Andy Mabbett's photos 64-66 and the taxis in Ravi Dwivedi's photo.
 * - North-west block 13 m: estimated from photo 64.
 *
 * Sources (evidence)
 * - OSM way/98425234.
 * - Wikipedia, "Dubai International Airport", Terminal 2.
 * - "Dubai International Airport - 2024-10-24 - Andy Mabbett - 64.jpg",
 *   "- 65.jpg", "- 66.jpg", Andy Mabbett, CC BY-SA 4.0 (airside, from the air):
 *   https://commons.wikimedia.org/wiki/File:Dubai_International_Airport_-_2024-10-24_-_Andy_Mabbett_-_64.jpg
 *   https://commons.wikimedia.org/wiki/File:Dubai_International_Airport_-_2024-10-24_-_Andy_Mabbett_-_65.jpg
 * - "Dubai Airport Terminal 2.jpg", Ravi Dwivedi, CC BY-SA 4.0, 2022
 *   (landside front): https://commons.wikimedia.org/wiki/File:Dubai_Airport_Terminal_2.jpg
 * - "VT-JBQ (7107170119).jpg", Kurush Pawar, CC BY-SA 2.0, 2012 (from the air):
 *   https://commons.wikimedia.org/wiki/File:VT-JBQ_(7107170119).jpg
 * - "ISS-65 Dubai International Airport and Dubai Creek (cropped).jpg",
 *   NASA, public domain (roof).
 *
 * Doubts
 * - The "T2 DXB" letters over the landside entrance are left out: no photo
 *   places them along the 700 m front.
 * - The landside face beyond the entrance and the south-east end are
 *   unphotographed; drawn like the parts that are. Where along the 450 m
 *   front the red block stands is not shown by any photo; it is placed at
 *   the north-west end, beside the block. Plant boxes are estimated from
 *   the aerials.
 */
import { Part, type V3 } from './mesh'
import { cap, clean, inset, panels, walls, type XY } from './clt-terminal'
import { finish } from './palette'
import { DXB, oquad, otri, writeModel } from './dubai-dxb-terminal-3'

const ID = 'dubai-dxb-terminal-2'
const BEARING = 31.3

const T2: XY[] = [[-138.34, -45.65], [-179.66, -45.59], [-254.55, -45.48], [-324.28, -45.38], [-342.71, -45.35], [-342.61, -32.69], [-342.11, 36.7], [-342.01, 50.1], [-290.04, 50.03], [-249.99, 49.98], [-215.67, 49.93], [-137.63, 49.82], [-137.72, 38.72], [161.36, 38.29], [244.75, 38.17], [322.14, 38.07], [355.04, 38.03], [365.59, 38.01], [365.04, -36.99], [306.85, -36.91], [306.76, -48.21], [156.05, -48.0], [156.13, -37.05], [-138.27, -36.64]]

/** A ring cut by the half-plane a·x + b·y <= c. */
function half(r: XY[], a: number, b: number, c: number): XY[] {
  const out: XY[] = []
  const f = (p: XY) => a * p[0] + b * p[1] - c
  for (let i = 0; i < r.length; i++) {
    const p = r[i], q = r[(i + 1) % r.length], fp = f(p), fq = f(q)
    if (fp <= 0) out.push(p)
    if ((fp < 0 && fq > 0) || (fp > 0 && fq < 0)) { const t = fp / (fp - fq); out.push([p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t]) }
  }
  return out
}

/**
 * The landside roof edge along a→b (wall facing right of travel): the deep
 * overhang ending in a big rounded silver bullnose, as a real curved section
 * (half-round of radius `R` whose front stands `O` out from the wall), with a
 * flat soffit back to the wall and the roof deck over it.
 */
function bullnose(P: { shell: Part; soffit: Part }, a: XY, b: XY, Z: number, H: number, O: number, seg: number) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
  const Q = (s: number, d: number, z: number): V3 => [a[0] + u[0] * s + n[0] * d, a[1] + u[1] * s + n[1] * d, z]
  const R = (H - Z) / 2, dc = O - R, zc = Z + R
  // the half-round, from the bottom (-90 deg) round the front to the top (+90 deg)
  const ang = Array.from({ length: seg + 1 }, (_, i) => -Math.PI / 2 + (Math.PI * i) / seg)
  const N = (t: number): V3 => [n[0] * Math.cos(t), n[1] * Math.cos(t), Math.sin(t)]
  for (let i = 0; i < seg; i++) {
    const t0 = ang[i], t1 = ang[i + 1]
    const A = Q(0, dc + R * Math.cos(t0), zc + R * Math.sin(t0)), B = Q(L, dc + R * Math.cos(t0), zc + R * Math.sin(t0))
    const C = Q(L, dc + R * Math.cos(t1), zc + R * Math.sin(t1)), D = Q(0, dc + R * Math.cos(t1), zc + R * Math.sin(t1))
    P.shell.tri(A, B, C, undefined, undefined, undefined, [N(t0), N(t0), N(t1)])
    P.shell.tri(A, C, D, undefined, undefined, undefined, [N(t0), N(t1), N(t1)])
  }
  // the soffit and the deck back to the wall
  oquad(P.soffit, Q(0, 0, Z), Q(L, 0, Z), Q(L, dc, Z), Q(0, dc, Z), [0, 0, -1])
  oquad(P.shell, Q(0, 0, H), Q(L, 0, H), Q(L, dc, H), Q(0, dc, H), [0, 0, 1])
  // the ends: the half-round and the rectangle behind it
  for (const [s, sg] of [[0, -1], [L, 1]] as [number, number][]) {
    const out: V3 = [u[0] * sg, u[1] * sg, 0]
    for (let i = 0; i < seg; i++) otri(P.shell, Q(s, dc, zc), Q(s, dc + R * Math.cos(ang[i]), zc + R * Math.sin(ang[i])), Q(s, dc + R * Math.cos(ang[i + 1]), zc + R * Math.sin(ang[i + 1])), out)
    oquad(P.shell, Q(s, 0, Z), Q(s, dc, Z), Q(s, dc, H), Q(s, 0, H), out)
  }
}

function build() {
  const silver = new Part(), white = new Part(), win = new Part(), red = new Part(), roof = new Part(), solar = new Part()
  const ring = clean(T2, 0.4)
  const XB = -138 // the north-west block ends here
  const hall = clean(half(ring, -1, 0, -XB), 0.1)
  const block = clean(half(ring, 1, 0, XB), 0.1)
  const H = 12.4, Z = 9.2
  const isLong = (a: XY, b: XY) => Math.abs(b[1] - a[1]) < 3 && Math.abs(b[0] - a[0]) > 20

  // --- the hall: glass walls under a deep roof; the landside (north-east, +y) edge a bullnose
  {
    walls(white, hall, 0, Z)
    for (let i = 0; i < hall.length; i++) {
      const a = hall[i], b = hall[(i + 1) % hall.length]
      const landside = isLong(a, b) && a[1] > 0
      if (landside) {
        // the glazed front in grouped panels: a tall lower tier and a clerestory over a transom
        panels(win, [a, b], 0.4, 5.4, { bay: 9, gap: 0.9, minLen: 10, end: 0.6, keep: (p, q) => p === a && q === b })
        panels(win, [a, b], 6.0, 8.6, { bay: 9, gap: 0.9, minLen: 10, end: 0.6, keep: (p, q) => p === a && q === b })
        bullnose({ shell: silver, soffit: white }, a, b, Z, H, 5.5, 8)
      } else panels(win, [a, b], 0.4, Z - 0.6, { bay: 12, gap: 1, minLen: 10, end: 0.6, keep: (p, q) => p === a && q === b })
    }
    // the roof over the hall: pushed 5 m out on the airside, where its edge is a white band
    const slab: XY[] = hall.map((p, i) => {
      const prev = hall[(i - 1 + hall.length) % hall.length], next = hall[(i + 1) % hall.length]
      const out = (isLong(prev, p) || isLong(p, next)) && p[0] > XB + 1 && p[1] < 0 ? -5 : 0
      return [p[0], p[1] + out] as XY
    })
    walls(white, slab, Z, H)
    cap(white, slab, H)
    cap(white, slab, Z, false)
    // the red-clad block at the entrance end of the landside front (Ravi Dwivedi's photo)
    const front = hall.filter((p) => p[1] > 0)
    const yF = Math.max(...front.map((p) => p[1]))
    {
      const x0 = XB + 3, x1 = XB + 15
      const r: XY[] = [[x0, yF - 0.5], [x1, yF - 0.5], [x1, yF + 1.2], [x0, yF + 1.2]]
      walls(red, r, 0, Z)
      cap(red, r, Z)
    }
    // solar arrays on the roof, in fields between white walkways
    const ys = [Math.max(...hall.map((p) => p[1])), Math.min(...hall.map((p) => p[1]))]
    const x0 = XB + 6, x1 = Math.max(...hall.map((p) => p[0])) - 6
    const n = Math.round((x1 - x0) / 46)
    for (let k = 0; k < n; k++) {
      const a = x0 + ((x1 - x0) * k) / n + 2, b = x0 + ((x1 - x0) * (k + 1)) / n - 2
      for (const [y0, y1] of [[ys[1] + 4, -3], [3, ys[0] - 4]]) {
        const r: V3[] = [[a, y0, H + 0.15], [b, y0, H + 0.15], [b, y1, H + 0.15], [a, y1, H + 0.15]]
        solar.quad(r[0], r[1], r[2], r[3])
      }
    }
    // plant boxes along the roof's spine
    for (let k = 0; k < n; k += 2) {
      const xc = x0 + ((x1 - x0) * (k + 0.5)) / n
      const r: XY[] = [[xc - 6, -2.2], [xc + 6, -2.2], [xc + 6, 2.2], [xc - 6, 2.2]]
      walls(roof, r, H, H + 2.4)
      cap(roof, r, H + 2.4)
    }
  }
  // --- the north-west block, a little higher, with window bands
  {
    walls(white, block, 0, 13)
    cap(roof, inset(block, 0.01), 13)
    panels(win, block, 2, 6.5, { bay: 14, gap: 1.6, minLen: 12 })
    panels(win, block, 8, 11.4, { bay: 14, gap: 1.6, minLen: 12 })
  }
  return [
    { part: silver, material: DXB.silver },
    { part: white, material: DXB.trim },
    { part: win, material: DXB.window },
    { part: red, material: finish('dxb-red', 0xc4574d) },
    { part: roof, material: DXB.roof },
    { part: solar, material: finish('dxb-solar', 0x8a96a2) },
  ]
}

if (import.meta.main) {
  await writeModel(`${ID}.glb`, 'Dubai International Airport Terminal 2', build(), { bearing: BEARING, elevation: 0 }, 5000, 250_000)
}
