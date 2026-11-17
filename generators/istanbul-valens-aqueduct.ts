/**
 * Valens Aqueduct (Bozdoğan Kemeri), Istanbul (completed 368–378 under
 * Valens; repaired by Süleyman I and Mustafa II) — original procedural
 * geometry, CC0-1.0.
 * bun generators/istanbul-valens-aqueduct.ts
 *
 * Map frame: x east, y north, z up, metres; origin on the lowest ground
 * under the arcade (the floor of the valley where Atatürk Bulvarı passes
 * under it). Bearing 35: the model's +x runs along the aqueduct to the
 * ESE (compass 125°, towards Beyazıt), its +y is the NNE side (the Golden
 * Horn side). Anchor = centroid of the OSM outline way/23276526
 * (man_made=bridge, bridge=aqueduct, historic=aqueduct, height 29,
 * ele 63, length 921, width "7.75 - 8.24 m"), 28.955149, 41.016187.
 *
 * Identity (from the photos below):
 *  1. A long, level-topped two-tier arcade striding across the valley:
 *     round-headed arches, the lower ones broad, the upper ones narrower
 *     and taller, set over the lower ones.          (teteris, lowcarb, mondo79)
 *  2. The arches are real openings: the sky and the boulevard show
 *     through both tiers.                                   (all photos)
 *  3. The arcade gets lower up both slopes; the lower tier sinks into the
 *     hill west of the boulevard and only the upper arches show at the far
 *     west end.                                            (haklai2, comertel)
 *  4. Rough grey-buff stone, warm in sunlight.        (haklai2, joseluiz)
 *
 * Plan: the OSM outline (© OpenStreetMap contributors, ODbL), 592 m long
 * and 4.8–5.6 m wide, with its 4 m jog at x ≈ 190–198 (the eastern
 * section runs 4 m further south). The model follows the outline's two
 * long edges, read in this frame; the far west tip widens to 7 m in OSM
 * and is held to 6 m. OSM `length` 921 m is the whole surviving
 * aqueduct (published, en/tr Wikipedia); the outline, and so the model,
 * covers its central 592 m only.
 *
 * Bays: OSM puts a node on every pier at the boulevard (x 25.6, 27.4,
 * 35.5, 44.4, 51.2, 58.9, 67.7, 71.8): about 8 m a bay; published pier
 * thickness 3.70 m and arch span about 4 m (Wikipedia). The model uses
 * 74 equal bays of 8.0 m. Proportions from the level telephoto views
 * (mondo79, lowcarb, teteris), in bays: lower opening 0.57 of the bay
 * (4.6 m), crown 9.2 m over the boulevard; upper opening 0.47 (3.8 m),
 * sill 10.1 m, crown 18.5 m (mondo79: 18.0–18.5); top 21.5–22 m above
 * the boulevard (2.68 bays in mondo79, 2.6 in teteris). Published maximum height 29 m (Wikipedia,
 * OSM) is from the pier foundations, which a 2009 survey found 5.4–6 m
 * below today's ground; 22 + 6 ≈ 28–29 m, so the two agree. Top level at
 * 22 m (the published 1:1000 fall, 0.6 m over the model, is left out).
 *
 * Ground: no lidar, and Mapterhorn has no z13–z15 tiles here (404). The
 * slope across the valley is read from Mapterhorn z12 (about 14 m a
 * pixel) along the centreline, 10 m steps: 61.2 m at the west end
 * (x −300), 42.3 at the anchor, 37.5 at the boulevard (x 50, the lowest:
 * y = 0), 40.0 at x 180, 45.4 at the east end. The arcade's feet follow
 * that profile vertex by vertex (docs/reference.md, Bridges): the piers
 * are 22 m tall at the boulevard, about 14 m at the east end and only
 * the top 2.5 m shows at the far west end (the ground there is held 2.5 m
 * under the top; z12 reads 23 m, above the top, which is the smoothing
 * of the hill). Openings whose springing is under the ground are left
 * out: the lower tier ends about 180 m west of the boulevard, as in
 * haklai2. The z12 profile is coarse; estimated to ±2 m.
 *
 * Photos (Wikimedia Commons, evidence):
 *  - teteris: The Valens Aqueduct Bozdoğan Kemeri - panoramio.jpg
 *    (Maris Teteris, CC BY 3.0)
 *  - haklai2: Valens Aqueduct-2.jpg (Yair Haklai, CC BY-SA 4.0)
 *  - mondo79: AqueductofValensIstanbul.jpg (Mondo79, CC BY 2.0)
 *  - joseluiz: Valens Aqueduct.jpg (José Luiz, CC BY-SA 3.0)
 *  - lowcarb: Valens 2012 DK.jpg (Lowcarb23, CC BY-SA 4.0)
 *  - comertel: Unkapanı -İstanbul - panoramio.jpg (Haluk Comertel, CC BY 3.0)
 *  - metrapro: Valens Aqueduct and Gazanfer Aga Madrasah.jpg (Metra pro, CC0)
 * No look-only sources. No commercial imagery.
 *
 * Left out: the brick voussoirs of a few arches, the vegetation on the
 * top, the buttress stubs, the slight batter of the piers, the coping.
 * Arches are 6-segment semicircles, under STYLE's 8, to keep 148 real
 * openings inside the budget; at map distance they read round.
 *
 * Doubts: the far west and east ends (no photo of the ends was used),
 * the ground profile (z12), the jog at x ≈ 190 (OSM only). The map's
 * terrain here is z12 too, so the feet should sit on what the map draws;
 * `bun tools/terrain.ts check` cannot run (no z15 tiles).
 *
 * Night: the arcade is floodlit from below along the boulevard.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { face } from './bridge-kit'
import { PALETTE, finish } from './palette'

const stone = new Part(), top = new Part()

// --- Plan: the OSM outline's two long edges in this frame (x along, y across).
const SOUTH: [number, number][] = [[-292.5, -3.62], [-184.1, -1.38], [-132, -1.46], [-67.4, -1.44], [25.6, -2.06],
  [71.8, -1.87], [130, -1.64], [182.8, -1.44], [188.7, -1.42], [196.8, -5.51], [224.6, -5.81], [299.4, -6.66]]
const NORTH: [number, number][] = [[-292.5, 3.48], [-184, 3.46], [-132, 3.39], [-67.2, 3.41], [-3.9, 3.74], [22.3, 2.97],
  [71.8, 3.15], [129.6, 3.36], [161.3, 3.49], [188.7, 3.59], [190.1, 3.36], [198.2, 0.18], [224.2, -0.2], [299.4, -1.28]]
const pw = (pts: [number, number][], x: number) => {
  if (x <= pts[0][0]) return pts[0][1]
  for (let i = 0; i + 1 < pts.length; i++) {
    const [x0, y0] = pts[i], [x1, y1] = pts[i + 1]
    if (x <= x1) return y0 + (y1 - y0) * (x - x0) / (x1 - x0)
  }
  return pts[pts.length - 1][1]
}
// Centreline vertices: where either edge turns.
const XS = [-292.5, -184, -132, -67.3, 25.6, 71.8, 130, 188.7, 197.5, 224.4, 299.4]
const CL = XS.map((x) => {
  const s = pw(SOUTH, x), n = pw(NORTH, x)
  return { p: [x, (s + n) / 2] as [number, number], hw: Math.min(3.0, (n - s) / 2) }
})
// Mitred left (+y side) normals at each vertex.
const dirs = CL.slice(1).map((c, i) => {
  const dx = c.p[0] - CL[i].p[0], dy = c.p[1] - CL[i].p[1], l = Math.hypot(dx, dy)
  return [dx / l, dy / l] as [number, number]
})
const lens = dirs.map((_, i) => Math.hypot(CL[i + 1].p[0] - CL[i].p[0], CL[i + 1].p[1] - CL[i].p[1]))
const T0 = lens.reduce((s, l, i) => [...s, s[i] + l], [0])
const LEN = T0[T0.length - 1]
const mitre = CL.map((_, i) => {
  const a = dirs[Math.max(0, i - 1)], b = dirs[Math.min(dirs.length - 1, i)]
  let nx = -(a[1] + b[1]), ny = a[0] + b[0]
  const l = Math.hypot(nx, ny); nx /= l; ny /= l
  const k = 1 / Math.max(0.5, nx * -b[1] + ny * b[0])
  return [nx * k, ny * k] as [number, number]
})
/** Plan point at distance t along the centreline, `side` −1 (south face) … +1 (north face). */
function plan(t: number, side: number): [number, number] {
  let i = 0
  while (i < lens.length - 1 && t > T0[i + 1]) i++
  const f = (t - T0[i]) / lens[i]
  const at = (j: number): [number, number] => [CL[j].p[0] + mitre[j][0] * CL[j].hw * side, CL[j].p[1] + mitre[j][1] * CL[j].hw * side]
  const a = at(i), b = at(i + 1)
  return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f]
}
/** The along-direction at t (for soffit normals). */
function along(t: number): [number, number] {
  let i = 0
  while (i < lens.length - 1 && t > T0[i + 1]) i++
  return dirs[i]
}

// --- Ground: Mapterhorn z12 along the centreline (model x, metres ASL), y = 0 at 37.5.
const Z12 = [61.2, 60.6, 60.4, 60.1, 59.2, 58.3, 57.4, 56.4, 55.2, 54.4, 53.6, 52.8, 52.3, 51.9, 51.3, 50.8, 50.4, 49.9,
  49.8, 49.5, 49.3, 48.9, 48.4, 47.9, 47.4, 46.3, 45.3, 44.4, 43.9, 43.1, 42.3, 41.1, 39.9, 38.7, 37.8, 37.5, 37.8, 38.7,
  39.9, 41.3, 41.9, 41.6, 41.2, 40.6, 40.5, 40.3, 40.1, 40.0, 40.0, 40.1, 40.6, 40.9, 41.2, 41.3, 41.4, 41.8, 42.3, 43.0,
  43.6, 44.3, 45.4] // x = −300 … 300 every 10 m
const ZT = 22 // top of the arcade above the boulevard
const groundAtX = (x: number) => {
  const f = Math.min(Math.max((x + 300) / 10, 0), Z12.length - 1.0001), i = Math.floor(f)
  const h = Z12[i] + (Z12[i + 1] - Z12[i]) * (f - i) - 37.5
  return Math.min(Math.max(h, 0), ZT - 2.5)
}
const g = (t: number) => groundAtX(plan(t, 0)[0])

// --- Arcade.
const BAYS = Math.round(LEN / 8.0), BAY = LEN / BAYS
const SEG = 6
type Opening = { c: number; a: number; sill: number; spring: number }
const LOW = { a: 2.3, spring: 6.9 }, UP = { a: 1.9, sill: 10.2, spring: 16.6 }
const ZM = 9.7 // seam between the tiers, between the lower crowns (9.2) and the upper sills (10.2)

const P = (t: number, side: number, z: number): V3 => { const [x, y] = plan(t, side); return [x, y, z] }
const nrm = (t: number, side: number): V3 => {
  const [dx, dy] = along(t)
  return [-dy * side, dx * side, 0]
}
/** Arch profile: t and z of the intrados, left springing to right springing. */
const arc = (o: Opening) => Array.from({ length: SEG + 1 }, (_, k) => {
  const th = Math.PI * (1 - k / SEG)
  return [o.c + o.a * Math.cos(th), o.spring + o.a * Math.sin(th)] as [number, number]
})

/**
 * One tier: from `zb(t)` (or its own base) to zt, with openings, on both
 * faces, plus the openings' soffits. Pier faces run between openings.
 */
function tier(t0: number, t1: number, zb: (t: number) => number, zt: number, ops: Opening[]) {
  for (const side of [-1, 1]) {
    const n = (t: number) => nrm(t, side)
    let cur = t0
    const pier = (ta: number, tb: number) => {
      if (tb - ta < 1e-3) return
      // Split long runs so the foot follows the ground vertex by vertex.
      const k = Math.ceil((tb - ta) / 4.5)
      for (let i = 0; i < k; i++) {
        const a = ta + (tb - ta) * i / k, b = ta + (tb - ta) * (i + 1) / k
        face(stone, P(a, side, zb(a)), P(b, side, zb(b)), P(b, side, zt), P(a, side, zt), n((a + b) / 2))
      }
    }
    for (const o of ops) {
      pier(cur, o.c - o.a)
      const pts = arc(o)
      const TL = P(o.c - o.a, side, zt), TR = P(o.c + o.a, side, zt)
      const half = SEG / 2
      const fan = (a: V3, b: V3, c: V3) => {
        const nn = n(o.c)
        const gx = (b[1] - a[1]) * (c[2] - a[2]) - (b[2] - a[2]) * (c[1] - a[1])
        const gy = (b[2] - a[2]) * (c[0] - a[0]) - (b[0] - a[0]) * (c[2] - a[2])
        if (gx * nn[0] + gy * nn[1] >= 0) stone.tri(a, b, c, undefined, undefined, undefined, [nn, nn, nn])
        else stone.tri(a, c, b, undefined, undefined, undefined, [nn, nn, nn])
      }
      for (let k = 0; k < SEG; k++) {
        const a = P(pts[k][0], side, pts[k][1]), b = P(pts[k + 1][0], side, pts[k + 1][1])
        fan(k < half ? TL : TR, a, b)
      }
      fan(TL, P(pts[half][0], side, pts[half][1]), TR)
      // Below the sill (upper tier) the pier face runs across.
      const base = Math.max(o.sill, 0)
      if (o.sill > -1) {
        const ta = o.c - o.a, tb = o.c + o.a
        face(stone, P(ta, side, zb(ta)), P(tb, side, zb(tb)), P(tb, side, base), P(ta, side, base), n(o.c))
      }
      cur = o.c + o.a
    }
    pier(cur, t1)
  }
  // Soffits: jambs and the arch's underside, facing into the opening.
  for (const o of ops) {
    const pts = arc(o)
    const foot = (t: number) => (o.sill > -1 ? o.sill : zb(t))
    for (const [t, s] of [[o.c - o.a, 1], [o.c + o.a, -1]] as [number, number][]) {
      const [dx, dy] = along(t), nn: V3 = [dx * s, dy * s, 0]
      face(stone, P(t, -1, foot(t)), P(t, 1, foot(t)), P(t, 1, o.spring), P(t, -1, o.spring), nn)
    }
    for (let k = 0; k < SEG; k++) {
      const [ta, za] = pts[k], [tb, zb2] = pts[k + 1]
      const mt = (ta + tb) / 2, mz = (za + zb2) / 2
      const [dx, dy] = along(mt)
      const ux = (o.c - mt) / o.a, uz = (o.spring - mz) / o.a // towards the arch centre
      const nn: V3 = [dx * ux, dy * ux, uz]
      face(stone, P(ta, -1, za), P(ta, 1, za), P(tb, 1, zb2), P(tb, -1, zb2), nn)
    }
    if (o.sill > -1) {
      const nn: V3 = [0, 0, 1]
      face(stone, P(o.c - o.a, -1, o.sill), P(o.c + o.a, -1, o.sill), P(o.c + o.a, 1, o.sill), P(o.c - o.a, 1, o.sill), nn)
    }
  }
}

// Lower tier: wherever the ground is under the seam.
const lowOps: Opening[] = [], upOps: Opening[] = []
for (let b = 0; b < BAYS; b++) {
  const c = (b + 0.5) * BAY
  const gl = Math.max(g(c - LOW.a), g(c + LOW.a))
  if (gl < LOW.spring - 0.6) lowOps.push({ c, a: LOW.a, sill: -2, spring: LOW.spring })
  const gu = Math.max(g(c - UP.a), g(c + UP.a))
  if (gu < UP.spring - 0.6) upOps.push({ c, a: UP.a, sill: gu > UP.sill ? -2 : UP.sill, spring: UP.spring })
}
// The lower tier runs where the ground is below the seam; elsewhere the
// upper tier reaches down to the ground itself.
const lowRuns: [number, number][] = []
{
  let start = -1
  const step = BAY / 4
  for (let t = 0; t <= LEN + 1e-6; t += step) {
    const under = g(t) < ZM - 0.3
    if (under && start < 0) start = t
    if ((!under || t + step > LEN + 1e-6) && start >= 0) { lowRuns.push([start, under ? LEN : t]); start = -1 }
  }
}
const inRun = (t: number) => lowRuns.some(([a, b]) => t >= a - 1e-6 && t <= b + 1e-6)
for (const [a, b] of lowRuns) tier(a, b, g, ZM, lowOps.filter((o) => o.c - o.a > a && o.c + o.a < b))
const upBase = (t: number) => (inRun(t) ? ZM : Math.max(ZM, g(t)))
// Upper tier with base following: runs share their seam; outside the
// lower runs the upper tier stands on the ground.
tier(0, LEN, upBase, ZT, upOps)

// Top: the walkway of the channel, one slab per bay; the two ends.
for (let b = 0; b < BAYS; b++) {
  const ta = b * BAY, tb = (b + 1) * BAY
  face(top, P(ta, -1, ZT), P(tb, -1, ZT), P(tb, 1, ZT), P(ta, 1, ZT), [0, 0, 1])
}
for (const [t, s] of [[0, -1], [LEN, 1]] as [number, number][]) {
  const [dx, dy] = along(t), nn: V3 = [dx * s, dy * s, 0]
  face(stone, P(t, -1, g(t)), P(t, 1, g(t)), P(t, 1, ZT), P(t, -1, ZT), nn)
}

// Floodlit from the boulevard and the parks along it: the faces, not the top.
const lit = (p: V3, n: V3) => (n[2] > 0.7 ? 0.2 : 0.85)
const parts = [
  { part: stone, material: { ...finish('aqueduct-stone', 0xd6ccbc), floodlight: lit } },
  { part: top, material: finish('aqueduct-top', 0xa9a397) },
]
const triangles = parts.reduce((s, p) => s + p.part.triangles, 0)
const glb = writeGlb('Valens Aqueduct', parts, {
  frame: 'Y up, -Z north, +X east; metres; ground anchor', anchor: [41.016187, 28.955149], bearing: 35,
})
if (triangles > 6500 || glb.length > 250000) throw new Error(`Budget exceeded: ${triangles} triangles / ${glb.length} bytes`)
const out = process.argv[2] ?? new URL('../models/istanbul-valens-aqueduct.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes, ${BAYS} bays of ${BAY.toFixed(2)} m, ${lowOps.length} lower + ${upOps.length} upper arches`)
