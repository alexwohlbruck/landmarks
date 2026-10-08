/**
 * Palmolive Building, Chicago (1929, Holabird & Root) — original procedural
 * geometry, CC0-1.0.
 * bun generators/chi-palmolive-building.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = centroid of the OSM outline way/143756601,
 * 41.899771,-87.623512. The outline's edges run at 89° / 179°, so the
 * catalog bearing is 359 and the building is square to this frame.
 *
 * Identity: the symmetrical Art Deco wedding cake in pale limestone, set
 * back in tiers on every side; the deep shadowed vertical channels in the
 * middle of every face, between plain piers with punched windows; the long chamfered top tier; the Lindbergh Beacon
 * mast standing on the roof.
 *
 * Evidence:
 *  - plan: OSM outline, 70 × 32 m, long side east-west on Walton Place.
 *  - heights: roof 468 ft (142.6 m) and tip 565 ft (172.2 m), 37 floors
 *    (CTBUH/SkyscraperPage, as quoted by thechicagoloop.org and
 *    chicagoarchitecture.info).
 *  - setbacks: the first (≈ floor 10, 38.5 m at 142.6/37 = 3.85 m a floor)
 *    from window rows in Teemu008's street photo; the upper two (70 and
 *    84.5 m) and the tier lengths (70, 51 and 40 m, with a last chamfered
 *    step 5.6 m below the roof) measured on Zol87's photo of the north face
 *    from Oak Street, scaled by the 70 m outline. Tier depths (23, 16 and
 *    13 m) are measured on Teemu008's photo against the 32 m Michigan
 *    front. The aerials from 875 N Michigan (Jaysin Trevino; Paul Keller)
 *    confirm the long chamfered top tier, the raised central penthouse and
 *    the mast at its middle. Expect ±1 floor on each setback.
 *  - the beacon mast: a slim square shaft with the beacon drum ~20 m above
 *    the roof (Zol87, Paul Keller's aerial), a spike to the published tip.
 *  - colour: Indiana limestone, a warm pale buff close to `stone`; the
 *    beacon mast reads light silver-grey (Zol87), drawn as a grey `metal`.
 *
 * Photos (Wikimedia Commons): Palmolive_Building_(7187525587).jpg (Teemu008,
 * CC BY-SA 2.0); Palmolive_Building_5.JPG (Thshriver, CC BY-SA 3.0);
 * Hancock_View_10_(3539428327).jpg (Jaysin Trevino, CC BY 2.0); Seen_from
 * _the_observation_deck_of_the_John_Hancock_Center_(22224770683) (Paul
 * Keller, CC BY 2.0); Palmolive_Building.jpg (Zol87, CC BY-SA 4.0); Palmolive_Chicago.JPG
 * (Smallbones, PD). No
 * commercial imagery.
 *
 * Left out: the carved spandrels and the shallow stepped buttresses within
 * each tier; the former PLAYBOY letters.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const stone = new Part(), win = new Part(), roof = new Part(), metal = new Part()

type XY = [number, number]
const ringAt = (pts: XY[], z: number): V3[] => pts.map(([x, y]) => [x, y, z])
/** A rectangle with chamfered corners, counter-clockwise. */
const rect = (hx: number, hy: number, c = .4): XY[] => [[-hx + c, -hy], [hx - c, -hy], [hx, -hy + c], [hx, hy - c],
  [hx - c, hy], [-hx + c, hy], [-hx, hy - c], [-hx, -hy + c]]

type Tier = { hx: number; hy: number; z0: number; z1: number; ch?: number }
const tiers: Tier[] = [
  { hx: 35, hy: 16, z0: 0, z1: 38.5 },
  { hx: 34.2, hy: 11.5, z0: 38.5, z1: 70 },
  { hx: 25.7, hy: 8.2, z0: 70, z1: 84.5 },
  { hx: 20, hy: 6.5, z0: 84.5, z1: 137, ch: .8 },
  { hx: 17, hy: 5.4, z0: 137, z1: 142.6, ch: 1.6 },
]

/**
 * A tier: walls, a coping lip, a roof terrace. Each face is built bay by
 * bay: the central third of the bays are the deep shadowed channels that
 * give the facade its vertical lines (0.9 m deep, windows at the back with a
 * stone spandrel every two floors); the outer bays are stone piers with
 * punched window pairs.
 */
function tier(t: Tier) {
  const ch = t.ch ?? .4, ring = rect(t.hx, t.hy, ch)
  for (const k of [1, 3, 5, 7]) {
    const a = ring[k], b = ring[(k + 1) % 8]
    stone.quad([a[0], a[1], t.z0], [b[0], b[1], t.z0], [b[0], b[1], t.z1], [a[0], a[1], t.z1])
  }
  // A bevelled coping, then the terrace or roof inside it.
  const lip = rect(t.hx - .6, t.hy - .6, Math.max(.2, ch - .3))
  stone.loft([ringAt(ring, t.z1), ringAt(lip, t.z1 + .5)])
  const low = ringAt(lip, t.z1 + .5).map(([x, y]): V3 => [x * .985, y * .97, t.z1 + .5])
  stone.loft([ringAt(lip, t.z1 + .5), low])
  roof.cap(low, true)
  const faces: [XY, XY, number][] = [[[0, -1], [1, 0], t.hx], [[1, 0], [0, 1], t.hy], [[0, 1], [-1, 0], t.hx], [[-1, 0], [0, -1], t.hy]]
  const FL = 3.85, D = .9
  const zA = t.z0 + (t.z0 ? 1.2 : 5.2), zB = t.z1 - 1.6
  for (const [n, u, h] of faces) {
    const d = n[0] ? t.hx : t.hy, S = h - ch
    const nb = Math.max(3, Math.round(2 * S / 5.2)), w = 2 * S / nb
    const P = (s: number, z: number, dd = 0): V3 => [n[0] * (d - dd) + u[0] * s, n[1] * (d - dd) + u[1] * s, z]
    const wall = (s0: number, s1: number, z0: number, z1: number) => { if (s1 > s0 && z1 > z0) stone.quad(P(s0, z0), P(s1, z0), P(s1, z1), P(s0, z1)) }
    let last = -S
    for (let b = 0; b < nb; b++) {
      const mid = -S + (b + .5) * w
      if (Math.abs(mid) > S * .34 + 1e-6) continue
      const s0 = mid - w * .26, s1 = mid + w * .26
      wall(last, s0, t.z0, t.z1)
      wall(s0, s1, t.z0, zA); wall(s0, s1, zB, t.z1)
      // Reveals, sill and soffit.
      stone.quad(P(s0, zA), P(s0, zA, D), P(s0, zB, D), P(s0, zB))
      stone.quad(P(s1, zA, D), P(s1, zA), P(s1, zB), P(s1, zB, D))
      stone.quad(P(s0, zA), P(s1, zA), P(s1, zA, D), P(s0, zA, D))
      stone.quad(P(s0, zB, D), P(s1, zB, D), P(s1, zB), P(s0, zB))
      // The back: windows, two floors to a panel, stone between.
      const k = Math.max(1, Math.round((zB - zA) / (2 * FL))), gh = (zB - zA) / k
      for (let g = 0; g < k; g++) {
        const z0 = zA + g * gh, z1 = zA + (g + 1) * gh
        win.quad(P(s0, z0 + .35, D), P(s1, z0 + .35, D), P(s1, z1 - .35, D), P(s0, z1 - .35, D))
        stone.quad(P(s0, z0, D), P(s1, z0, D), P(s1, z0 + .35, D), P(s0, z0 + .35, D))
        stone.quad(P(s0, z1 - .35, D), P(s1, z1 - .35, D), P(s1, z1, D), P(s0, z1, D))
      }
      last = s1
    }
    wall(last, S, t.z0, t.z1)
    // Punched window pairs in the outer bays, three floors to a row.
    const rows = Math.max(1, Math.round((zB - zA) / (3 * FL))), rh = (zB - zA) / rows
    for (let b = 0; b < nb; b++) {
      const mid = -S + (b + .5) * w
      if (Math.abs(mid) <= S * .34 + 1e-6) continue
      for (let r = 0; r < rows; r++) {
        const z0 = zA + r * rh + 2.2, z1 = zA + (r + 1) * rh - 2.2
        for (const [a0, a1] of [[-.3, -.08], [.08, .3]]) {
          const s0 = mid + a0 * w, s1 = mid + a1 * w
          win.quad(P(s0, z0, -.05), P(s1, z0, -.05), P(s1, z1, -.05), P(s0, z1, -.05))
        }
      }
    }
  }
}
tiers.forEach(tier)
// The ground-floor shopfront band and entrances, under the first spandrel.
for (const [n, u, d, h] of [[[0, -1], [1, 0], 16, 33], [[1, 0], [0, 1], 35, 14], [[0, 1], [-1, 0], 16, 33], [[-1, 0], [0, -1], 35, 14]] as [XY, XY, number, number][]) {
  const P = (s: number, z: number): V3 => [n[0] * (d + .05) + u[0] * s, n[1] * (d + .05) + u[1] * s, z]
  win.quad(P(-h, .6), P(h, .6), P(h, 4.6), P(-h, 4.6))
}
// Raised central penthouse on the top tier.
{
  const top = tiers[tiers.length - 1].z1 + .5, ring = rect(11, 3.6, 1.4)
  stone.loft([ringAt(ring, top - .5), ringAt(ring, top + 5.5)]); roof.cap(ringAt(ring, top + 5.5), true)
}
// The Lindbergh Beacon mast: a slim tapering shaft, the beacon drum, a spike.
{
  const z0 = 148.6, N = 8
  const sq = (r: number, z: number): V3[] => [[-r, -r, z], [r, -r, z], [r, r, z], [-r, r, z]]
  metal.loft([sq(1.3, z0), sq(.8, 160)]); metal.loft([sq(.8, 160), sq(.8, 162)])
  const ring = (r: number, z: number) => Array.from({ length: N }, (_, i): V3 => [r * Math.cos(2 * Math.PI * i / N), r * Math.sin(2 * Math.PI * i / N), z])
  metal.loft([ring(.8, 162), ring(1.6, 162.4), ring(1.6, 165.8), ring(.6, 166.6)])
  const tip = ring(.6, 166.6)
  for (let i = 0; i < N; i++) metal.tri(tip[i], tip[(i + 1) % N], [0, 0, 172.2])
}

const parts = [
  { part: stone, material: finish('indiana-limestone', 0xece2d0) },
  { part: win, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
  { part: metal, material: { ...PALETTE.metal, color: 0xb4b9bd, roughness: .5 } },
]
const triangles = parts.reduce((s, p) => s + p.part.triangles, 0)
const glb = writeGlb('Palmolive Building', parts, {
  frame: 'Y up, -Z north, +X east; metres; ground anchor', anchor: [41.899771, -87.623512], bearing: 359,
})
if (triangles > 5000 || glb.length > 250000) throw new Error(`Budget exceeded: ${triangles} triangles / ${glb.length} bytes`)
const out = process.argv[2] ?? new URL('../models/chi-palmolive-building.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
