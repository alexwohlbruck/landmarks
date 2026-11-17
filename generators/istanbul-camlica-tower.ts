/**
 * Küçük Çamlıca TV and Radio Tower (Çamlıca Tower), Üsküdar, Istanbul:
 * procedural, CC0-1.0. bun generators/istanbul-camlica-tower.ts
 *
 * Opened 2021 (Melike Altınışık Architects). A single concrete shaft shaped
 * after a tulip: the "roots" (a white cage of fins round the lower shaft),
 * the stem with its waist, then the closed bud, a twisted, bulging body of
 * stacked floor plates with dark glazing between them (observation decks and
 * restaurants), its tapered tip, and the steel antenna mast that makes up
 * nearly half the height. Two panoramic lifts run up opposite sides as dark
 * vertical stripes.
 *
 * Frame: x along the bud's long axis (world 134 / 314), y towards the lift
 * on the north-east side (world 44), z up; placed with bearing 44. Origin at
 * the centroid of the OSM outline (way/722961117, a 22.7 m circle),
 * 29.065541, 41.016372. The hilltop is nearly flat under the shaft; the
 * tower's own base is a circle 23 m across, so any slope is small.
 * Elevation 0. The terrain check could not run (no Mapterhorn z15 here).
 *
 * OSM (ODbL), fetched 2026-11: way/722961117 "Çamlıca Televizyon Kulesi",
 * height 369, 49 levels, wikidata Q28657490 (checked: "Çamlıca Tower",
 * height 369). OSM has no parts.
 *
 * Published (Wikipedia en "Küçük Çamlıca TV–Radio Tower"): 369 m in all; a
 * 168 m steel mast; concrete tower 203.5 m (221 m with 18 m underground);
 * elliptical section 13 x 16 m narrowing upwards; floors 4.5 m; decks on
 * floors 33-34, 366.5 and 371 m above sea level with the top at 587 m, so
 * 148.5 and 153 m over the base; lifts on both sides.
 *
 * Measured from photos (level, distant): the concrete including its tip
 * reaches 215-221 m in p01, p02 and p03 (scaled to the 369 m total), so the
 * mast is drawn from 218 m. Widths from p03 (2.5 px/m) and p02 (2.8 px/m):
 * base 20-23 m (OSM 22.7); the fin cage 42-80 m, 29-32 m across; the waist
 * at 112 m, 18 m; the bud 130-205 m, widest at 155-165 m, 42-44 m across
 * the long axis from the south-west (p02, p03) and about 30 m across the
 * other way; tip cone 205-218 m. The bud's lobes are offset in height
 * (twisted): drawn as an ellipse whose long axis turns 75 degrees through
 * the bud. Mast about 4-5 m wide at its foot, tapering, drawn solid.
 * Estimated: the bud's short axis (only p04 from the west shows it, hazy);
 * the lifts' orientation (the stripe is centred in views from the south-
 * west, p02, p03, p05, so they are put on the north-east and south-west).
 * Invented / simplified: the glazing is drawn as eight full rings between
 * the bud's floor plates, two floors apart, glazed on the two lobes at
 * the ends of the turning long axis (so they spiral as in p02, p03); the
 * fin cage is twenty fins and three rings; no platforms on the mast but
 * two.
 *
 * Colours: white concrete (#e4e6e4), lift glazing blue-grey (#6f8394),
 * charcoal mast (#575d66, the defining dark spire, no darker than the
 * STYLE limit). Night: the bud's glazing glows; the shaft is floodlit.
 *
 * Photos (EVIDENCE, Wikimedia Commons):
 * - p01 "Çamlıca Tower viewed from Galata Tower.jpg", Julian Lupyan, CC0
 *   (from the west, telephoto)
 *   https://commons.wikimedia.org/wiki/File:%C3%87aml%C4%B1ca_Tower_viewed_from_Galata_Tower.jpg
 * - p02 "Camlica Tower.jpg", Korybiko, CC BY-SA 4.0 (level, the bud and
 *   lift stripe) https://commons.wikimedia.org/wiki/File:Camlica_Tower.jpg
 * - p03 "TV tower, Istanbul ( 1100239).jpg", Matti Blume, CC BY-SA 4.0
 *   (level, telephoto)
 *   https://commons.wikimedia.org/wiki/File:TV_tower,_Istanbul_(_1100239).jpg
 * - p04 "Çamlıca Kulesi.jpg", Antoloji, CC0
 *   https://commons.wikimedia.org/wiki/File:%C3%87aml%C4%B1ca_Kulesi.jpg
 * - p05 "View of Çamlıca Tower from the Kadikoy coast.IMG 1836.jpg", YG01,
 *   CC BY 4.0 (from the south-west, far)
 *   https://commons.wikimedia.org/wiki/File:View_of_%C3%87aml%C4%B1ca_Tower_from_the_Kadikoy_coast.IMG_1836.jpg
 * Look-only: none.
 *
 * Doubts: the bud's twist and lobes are simplified to a turning ellipse;
 * the lifts' compass orientation rests on which views show the stripe
 * centred; no lidar, heights from published figures and photo ratios.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const TAU = Math.PI * 2
const N = 24

type Sec = { z: number; a: number; b: number; th: number }

function ring(s: Sec, k = 1): V3[] {
  const t = (s.th * Math.PI) / 180
  return Array.from({ length: N }, (_, i) => {
    const u = (i * TAU) / N
    const x = s.a * k * Math.cos(u), y = s.b * k * Math.sin(u)
    return [x * Math.cos(t) - y * Math.sin(t), x * Math.sin(t) + y * Math.cos(t), s.z] as V3
  })
}

/** Loft between rings, smooth round the axis and flat along it. */
function loftSmooth(p0: Part, rings: V3[][], pick?: (i: number) => Part) {
  for (let k = 0; k < rings.length - 1; k++) {
    const r0 = rings[k], r1 = rings[k + 1]
    for (let i = 0; i < N; i++) {
      const j = (i + 1) % N
      const p = pick ? pick(i) : p0
      const a = r0[i], b = r0[j], c = r1[j], d = r1[i]
      const e1 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], e2 = [d[0] - a[0], d[1] - a[1], d[2] - a[2]]
      const F = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]]
      const fl = Math.hypot(F[0], F[1], F[2]) || 1
      const fh = Math.hypot(F[0], F[1]) / fl, fz = F[2] / fl
      const nrm = (q: V3, qn: V3): V3 => {
        // horizontal: average of the ring's neighbouring edge normals
        const hx = qn[0], hy = qn[1], l = Math.hypot(hx, hy) || 1
        return [(hx / l) * fh, (hy / l) * fh, fz]
      }
      const hn = (r: V3[], m: number): V3 => {
        const pm = r[(m + N - 1) % N], pn = r[(m + 1) % N]
        return [pn[1] - pm[1], -(pn[0] - pm[0]), 0]
      }
      const na = nrm(a, hn(r0, i)), nb = nrm(b, hn(r0, j)), nc = nrm(c, hn(r1, j)), nd = nrm(d, hn(r1, i))
      p.tri(a, b, c, undefined, undefined, undefined, [na, nb, nc])
      p.tri(a, c, d, undefined, undefined, undefined, [na, nc, nd])
    }
  }
}

function capRing(p: Part, r: V3[], up: boolean) {
  const c: V3 = [0, 0, r[0][2]]
  for (let i = 0; i < N; i++) {
    const a = r[i], b = r[(i + 1) % N]
    if (up) p.tri(c, a, b)
    else p.tri(c, b, a)
  }
}

function box(p: Part, cx: number, cy: number, z0: number, z1: number, hx: number, hy: number, ang: number) {
  const ca = Math.cos(ang), sa = Math.sin(ang)
  const pt = (u: number, v: number, z: number): V3 => [cx + u * ca - v * sa, cy + u * sa + v * ca, z]
  const bot = [pt(-hx, -hy, z0), pt(hx, -hy, z0), pt(hx, hy, z0), pt(-hx, hy, z0)]
  const top = bot.map((q) => [q[0], q[1], z1] as V3)
  p.loft([bot, top])
  p.cap(top, true)
}

/** Ellipse radius in direction phi (world angle in the model frame). */
function radiusAt(s: Sec, phi: number) {
  const d = phi - (s.th * Math.PI) / 180
  return (s.a * s.b) / Math.hypot(s.b * Math.cos(d), s.a * Math.sin(d))
}

export function build() {
  const conc = new Part(), win = new Part(), lift = new Part(), mast = new Part()

  // Shaft profile: z, half-axes a (x, long) and b (y), and the twist.
  const lerpSec = (s0: Sec, s1: Sec, t: number): Sec => ({ z: s0.z + (s1.z - s0.z) * t, a: s0.a + (s1.a - s0.a) * t, b: s0.b + (s1.b - s0.b) * t, th: s0.th + (s1.th - s0.th) * t })
  const key: Sec[] = [
    { z: 0, a: 11.4, b: 11.2, th: 0 },
    { z: 12, a: 11.0, b: 10.6, th: 0 },
    { z: 80, a: 10.6, b: 10.2, th: 0 },
    { z: 112, a: 9.4, b: 8.8, th: 0 },
    { z: 128, a: 11.6, b: 10.2, th: -10 },
    { z: 142, a: 17.0, b: 12.4, th: -25 },
    { z: 158, a: 21.0, b: 15.0, th: -5 },
    { z: 172, a: 20.6, b: 15.4, th: 20 },
    { z: 186, a: 17.0, b: 13.4, th: 40 },
    { z: 198, a: 12.8, b: 10.8, th: 50 },
    { z: 207, a: 9.0, b: 7.8, th: 50 },
    { z: 214, a: 5.6, b: 5.0, th: 50 },
    { z: 218, a: 3.4, b: 3.2, th: 50 },
  ]
  const at = (z: number): Sec => {
    for (let k = 0; k < key.length - 1; k++) if (z <= key[k + 1].z) return lerpSec(key[k], key[k + 1], (z - key[k].z) / (key[k + 1].z - key[k].z))
    return key[key.length - 1]
  }
  // Ring heights: the keys, plus the glazing bands in the bud and the crown.
  const bands: Array<[number, number]> = []
  for (let k = 0; k < 8; k++) bands.push([136 + 8.5 * k, 136 + 8.5 * k + 3.2])
  bands.push([205.5, 209])
  let zs = key.map((s) => s.z)
  for (const [z0, z1] of bands) zs.push(z0, z1)
  zs.push(95, 120, 135)
  zs = [...new Set(zs.map((z) => Math.round(z * 100) / 100))].sort((a, b) => a - b)
  const inBand = (z0: number, z1: number) => bands.some(([b0, b1]) => z0 >= b0 - 1e-6 && z1 <= b1 + 1e-6)
  for (let k = 0; k < zs.length - 1; k++) {
    const z0 = zs[k], z1 = zs[k + 1]
    if (inBand(z0, z1)) {
      // glazing set 0.5 m in, with the slab noses above and below
      const s0 = at(z0), s1 = at(z1)
      const k0 = 1 - 0.5 / Math.max(s0.a, 1), k1 = 1 - 0.5 / Math.max(s1.a, 1)
      const o0 = ring(s0), i0 = ring(s0, k0), i1 = ring(s1, k1), o1 = ring(s1)
      loftSmooth(conc, [o0, i0].map((r) => r))
      loftSmooth(win, [i0, i1], z0 > 200 ? undefined : (i) => (Math.abs(Math.cos(((i + 0.5) * TAU) / N)) > 0.42 ? win : conc))
      loftSmooth(conc, [i1, o1])
    } else {
      loftSmooth(conc, [ring(at(z0)), ring(at(z1))])
    }
  }
  capRing(conc, ring(at(218)), true)

  // The fin cage round the roots: twenty fins and three rings.
  for (let i = 0; i < 20; i++) {
    const u = (i * TAU) / 20 + TAU / 40
    const r0 = 10.2, r1 = 13.8
    box(conc, ((r0 + r1) / 2) * Math.cos(u), ((r0 + r1) / 2) * Math.sin(u), 40, 82, (r1 - r0) / 2, 0.5, u)
  }
  for (const z of [40, 61, 82]) {
    const lo = ring({ z: z - 0.8, a: 14.2, b: 14.2, th: 0 }), hi = ring({ z: z + 0.8, a: 14.2, b: 14.2, th: 0 })
    const ilo = ring({ z: z - 0.8, a: 10.4, b: 10.0, th: 0 }), ihi = ring({ z: z + 0.8, a: 10.4, b: 10.0, th: 0 })
    loftSmooth(conc, [lo, hi])
    for (let i = 0; i < N; i++) {
      const j = (i + 1) % N
      conc.quad(ihi[i], hi[i], hi[j], ihi[j])
      conc.quad(ilo[i], ilo[j], lo[j], lo[i])
    }
  }

  // Lift stripes up the north-east and south-west sides, following the skin.
  for (const side of [1, -1]) {
    const phi = side > 0 ? Math.PI / 2 : -Math.PI / 2
    const W = 1.7
    const levels = zs.filter((z) => z >= 2 && z <= 210)
    for (let k = 0; k < levels.length - 1; k++) {
      const z0 = levels[k], z1 = levels[k + 1]
      const r0 = radiusAt(at(z0), phi) + 0.2, r1 = radiusAt(at(z1), phi) + 0.2
      const P = (x: number, r: number, z: number): V3 => [side * x, side * r, z]
      // the stripe faces outward (+y for side 1)
      const a = P(-W, r0, z0), b = P(W, r0, z0), c = P(W, r1, z1), d = P(-W, r1, z1)
      if (side > 0) lift.quad(b, a, d, c)
      else lift.quad(b, a, d, c)
    }
  }

  // Steel mast, drawn solid and bold, with two platforms.
  const mastSec: Array<[number, number]> = [[217.5, 2.6], [260, 2.1], [300, 1.6], [338, 1.0], [352, 0.55], [369, 0.22]]
  const sq = (h: number, z: number): V3[] => [[-h, -h, z], [h, -h, z], [h, h, z], [-h, h, z]]
  mast.loft(mastSec.map(([z, h]) => sq(h, z)))
  mast.cap(sq(0.22, 369), true)
  for (const [z, h] of [[232, 4.2], [300, 3.0]] as Array<[number, number]>) {
    mast.loft([sq(h, z - 0.6), sq(h, z + 0.6)])
    mast.cap(sq(h, z + 0.6), true)
    mast.cap(sq(h, z - 0.6), false)
  }

  const flood = (p: V3, n: V3) => (n[2] > 0.9 ? 0.3 : p[2] < 215 ? 0.75 : 0.4)
  return [
    { part: conc, material: { ...finish('concrete', 0xe4e6e4), floodlight: flood } },
    { part: win, material: PALETTE.window },
    { part: lift, material: { ...PALETTE.glass, color: 0x6f8394 } },
    { part: mast, material: finish('mast-steel', 0x575d66) },
  ]
}

if (import.meta.main) {
  const parts = build()
  const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
  for (const { part, material } of parts) console.log(material.name, part.triangles)
  if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
  const glb = writeGlb('Çamlıca Tower', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
    bearing: 44, elevation: 0, height: 369,
  })
  if (glb.length > 250_000) throw new Error(`Size budget exceeded: ${glb.length} bytes`)
  const out = new URL('../models/istanbul-camlica-tower.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}
