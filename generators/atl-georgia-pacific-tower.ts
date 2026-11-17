/**
 * Georgia-Pacific Tower, Atlanta (1982, Skidmore, Owings & Merrill) —
 * original procedural geometry, CC0-1.0.
 * bun generators/atl-georgia-pacific-tower.ts
 *
 * Uses the B4 kit exported from generators/atl-flatiron-building.ts.
 *
 * Map frame: x east, y north, z up, metres; bearing 0, the plan is OSM's.
 * Anchor = centroid of the outline OSM way/479134200 ("Georgia-Pacific
 * Tower", tagged height 50, 14 levels — wrong: the tower is 212 m and 52
 * floors), 33.757448, -84.387060.
 *
 * Identity: a 52-storey slab of pink Marble Hill granite with a grid of
 * small square punched windows. Its plan is three slabs side by side,
 * each shifted about 9 m east of the one to its south, so the east end is
 * a sawtooth in plan; and each slab steps down in four 9 m tiers towards
 * the east, so from the north or south the tower is a staircase, and
 * from the east or west the steps of the three slabs make the jagged
 * notched silhouette it is known for. The west face is one sheer diagonal
 * wall with a knife-edge corner at its south-west end. The step faces
 * carry columns of dark louvre slots.
 *
 * Evidence:
 *  - plan and tiers: OSM way/479134200 and its parts way/479134201–204
 *    (tagged 100/150/200/212 m: the tiers' plans are right, the tags are
 *    rough). Each slab's tier edges are taken from the parts: north slab
 *    5.78 / 14.9 / 24.16 / 33.4 / 42.7, middle −2.6 / 5.74 / 14.78 / 24.13 /
 *    33.24, south −12.3 / −2.9 / 5.8 / 14.6 / 23.8 (x, metres); slab edges
 *    at y = 18.25 / 5.17 / −6.7 / −18.8; the west face from (−43.81,
 *    −18.54) to (−23.89, 18.29). The 2018 lidar shows the same three slabs
 *    and the same tier edges within about a metre.
 *  - heights: USGS 3DEP lidar GA_Statewide_B2_2018 (2018 flight), 1 m grid,
 *    above ground_min 319.44 m; the street on the east side is about 2 m
 *    above that, and y = 0 is put there. Measured (lidar − 2 m): main roof
 *    209.3 (lidar 210.1–212.9), first step 201 (lidar 202–204 on the north
 *    and south slabs, 198.4 on the middle one; one height used), then
 *    152.1, 108.1 and 64.2 (lidar 154.1, 110.1, 66.2). Published: 212 m,
 *    52 floors (Wikipedia; CTBUH).
 *  - ground: Mapterhorn rises about 2.3 m from the east side to the west
 *    face; elevation 0.
 *  - windows: a 3.8 m storey grid; panels grouped three storeys to a band
 *    and two windows to a bay (STYLE). The louvre columns on the step
 *    faces are drawn as a recessed central slot on each riser, as in Connor.carey's
 *    rear and side photos.
 *  - colour: rusty brown-red granite (all photos; it reads browner than
 *    pink in daylight), pulled to the palette's lightness. The louvre
 *    slots are sunk 1.4 m into each step face, dark brown louvres at the
 *    back, so they read as dark recesses.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Georgia-Pacific-Tower-Side.jpg, Connor.carey, CC BY-SA 3.0 (the stepped
 *    side and its louvre strips)
 *    https://commons.wikimedia.org/wiki/File:Georgia-Pacific-Tower-Side.jpg
 *  - Georgia-Pacific-Tower-Rear.jpg, Connor.carey, CC BY-SA 3.0 (the
 *    staircase silhouette end-on)
 *    https://commons.wikimedia.org/wiki/File:Georgia-Pacific-Tower-Rear.jpg
 *  - Georgia-Pacific-Tower-Front-Angle.jpg, Connor.carey, CC BY-SA 3.0 (the
 *    sheer west face and its knife-edge corner)
 *    https://commons.wikimedia.org/wiki/File:Georgia-Pacific-Tower-Front-Angle.jpg
 *  - AGeorgaPacificDT2511-0630.jpg, AtlChampion, CC BY-SA 4.0 (from above,
 *    the notched steps)
 *    https://commons.wikimedia.org/wiki/File:AGeorgaPacificDT2511-0630.jpg
 *  - GeorgiaPacificHDQ.jpg, Organicabq, public domain (from the north-east)
 *    https://commons.wikimedia.org/wiki/File:GeorgiaPacificHDQ.jpg
 *  - Georgia-Pacific Tower, Atlanta, GA.jpg, JJonahJackalope, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:Georgia-Pacific_Tower,_Atlanta,_GA.jpg
 * No look-only sources. No commercial imagery.
 *
 * Doubts: one height is used for the first step on all three slabs (the
 * lidar has the middle one 4 m lower); the GP logo at the top and the
 * lobby glazing at the foot are left out; the window grid is grouped.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { box, prism, save, type XY } from './atl-flatiron-building'

const granite = new Part(), win = new Part(), louvre = new Part(), roof = new Part()

const H = [209.3, 201, 152.1, 108.1, 64.2]
const BANDS = [
  { y0: 5.17, y1: 18.25, B: [5.78, 14.9, 24.16, 33.4, 42.7] },
  { y0: -6.7, y1: 5.17, B: [-2.6, 5.74, 14.78, 24.13, 33.24] },
  { y0: -18.8, y1: -6.7, B: [-12.3, -2.9, 5.8, 14.6, 23.8] },
]
const westX = (y: number) => -43.81 + ((y + 18.54) * 19.92) / 36.83

/** The roof height at a plan point, 0 off the building. */
function heightAt(x: number, y: number): number {
  for (const b of BANDS) {
    if (y < b.y0 || y > b.y1) continue
    if (x < westX(y)) return 0
    for (let k = 0; k < 5; k++) if (x <= b.B[k]) return H[k]
    return 0
  }
  return 0
}

// ── The louvre slots: every step face (the east riser of each tier, and
// the north or south faces where a neighbouring slab is lower) carries a
// column of louvres sunk in a recess 1.4 m deep, as the photos show. ──
type Slot = { side: 'n' | 's' | 'e'; s0: number; s1: number; za: number; zb: number }
const D = 1.4, SLOT = 4.6, TOP = 1.5
const slots: Slot[][][] = BANDS.map(() => [[], [], [], [], []])
for (let bi = 0; bi < 3; bi++) {
  const b = BANDS[bi]
  for (let k = 0; k < 5; k++) {
    const xa = k === 0 ? null : b.B[k - 1], xb = b.B[k], h = H[k]
    for (const side of ['n', 's'] as const) {
      const y = side === 'n' ? b.y1 : b.y0, probe = side === 'n' ? y + 0.3 : y - 0.3
      const x0 = xa ?? westX(y)
      const cuts = [x0, ...BANDS.flatMap((o) => o.B).filter((c) => c > x0 + 0.5 && c < xb - 0.5).sort((p, q) => p - q), xb]
      for (let i = 0; i < cuts.length - 1; i++) {
        const c0 = cuts[i], c1 = cuts[i + 1], hn = heightAt((c0 + c1) / 2, probe)
        if (hn === 0 || hn >= h - 3) continue
        const w = Math.min(SLOT, (c1 - c0) * 0.4), m = (c0 + c1) / 2
        slots[bi][k].push({ side, s0: m - w / 2, s1: m + w / 2, za: hn, zb: h - TOP })
      }
    }
    const m = (b.y0 + b.y1) / 2
    slots[bi][k].push({ side: 'e', s0: m - SLOT / 2, s1: m + SLOT / 2, za: k < 4 ? H[k + 1] : 4.2, zb: h - TOP })
  }
}

/** A plan quad on a wall from a to b (outside on the right), `out` metres proud. */
function face(p: Part, a: XY, b: XY, za: number, zb: number, out = 0.06) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n: XY = [(b[1] - a[1]) / L, -(b[0] - a[0]) / L]
  const P = (q: XY, z: number): V3 => [q[0] + n[0] * out, q[1] + n[1] * out, z]
  p.quad(P(a, za), P(b, za), P(b, zb), P(a, zb))
}

// ── Massing: fifteen cells, three slabs of five tiers, each cell solid up
// to the slots' heads with its recesses left open, and a bevelled cap. ──
for (let bi = 0; bi < 3; bi++) {
  const b = BANDS[bi]
  for (let k = 0; k < 5; k++) {
    const h = H[k], x1 = b.B[k], cs = slots[bi][k]
    const xmin = (y: number) => (k === 0 ? westX(y) : b.B[k - 1])
    const has = (sd: string) => cs.some((c) => c.side === sd)
    const zt = h - TOP
    const ya = b.y0 + (has('s') ? D : 0), yb = b.y1 - (has('n') ? D : 0), xc = x1 - (has('e') ? D : 0)
    // The core.
    prism(granite, [[xmin(ya), ya], [xc, ya], [xc, yb], [xmin(yb), yb]], 0, zt, null, 0)
    // The strip in front of the core on each slotted side, minus the slots.
    for (const sd of ['n', 's', 'e'] as const) {
      const mine = cs.filter((c) => c.side === sd)
      if (!mine.length) continue
      const [smin, smax] = sd === 'e' ? [ya, yb] : [-1e9, x1]
      const bounds = [...new Set([smin, smax, ...mine.flatMap((c) => [c.s0, c.s1])])].sort((p, q) => p - q)
      for (let i = 0; i < bounds.length - 1; i++) {
        const s0 = bounds[i], s1 = bounds[i + 1]
        const cut = mine.find((c) => c.s0 <= s0 + 1e-6 && c.s1 >= s1 - 1e-6)
        const zs: [number, number][] = cut ? [[0, cut.za], [cut.zb, zt]].filter(([p, q]) => q - p > 0.05) as [number, number][] : [[0, zt]]
        for (const [z0, z1] of zs) {
          let ring: XY[]
          if (sd === 'e') ring = [[xc, s0], [x1, s0], [x1, s1], [xc, s1]]
          else {
            const [y0, y1] = sd === 'n' ? [yb, b.y1] : [b.y0, ya]
            ring = s0 < -1e8 ? [[xmin(y0), y0], [s1, y0], [s1, y1], [xmin(y1), y1]] : [[s0, y0], [s1, y0], [s1, y1], [s0, y1]]
          }
          prism(granite, ring, z0, z1, z1 < zt ? granite : null, 0, z0 > 0)
        }
      }
    }
    // The cap over the slots, bevelled, with the roof.
    const ring: XY[] = [[xmin(b.y0), b.y0], [x1, b.y0], [x1, b.y1], [xmin(b.y1), b.y1]]
    prism(granite, ring, zt, h, roof, 0.5, true)
    // The louvres at the back of each slot.
    for (const c of cs) {
      if (c.side === 'e') face(louvre, [xc, c.s0], [xc, c.s1], c.za, c.zb)
      else if (c.side === 'n') face(louvre, [c.s1, yb], [c.s0, yb], c.za, c.zb)
      else face(louvre, [c.s0, ya], [c.s1, ya], c.za, c.zb)
    }
  }
}

// ── Windows ──
const STOREY = 3.8, GROUP = 3 * STOREY, GAP = 2.6, Z0 = 4.2
/** Grouped window panels on the stretch a→b (outside on the right), between zlo and zhi, on the global storey grid. */
function grid(a: XY, b: XY, zlo: number, zhi: number) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  if (L < 2) return
  const t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [t[1], -t[0]]
  const P = (s: number, z: number): V3 => [a[0] + t[0] * s + n[0] * 0.06, a[1] + t[1] * s + n[1] * 0.06, z]
  const margin = 1.0, pier = 2.1, bays = Math.max(1, Math.round((L - 2 * margin) / 4.6)), w = (L - 2 * margin) / bays
  const spans = Array.from({ length: bays }, (_, k) => [margin + k * w + pier / 2, margin + (k + 1) * w - pier / 2] as [number, number])
  for (let g = 0; ; g++) {
    const za = Z0 + g * GROUP + GAP / 2, zb = Z0 + (g + 1) * GROUP - GAP / 2
    if (zb > zhi) break
    if (za < zlo) continue
    for (const [s0, s1] of spans) win.quad(P(s0, za), P(s1, za), P(s1, zb), P(s0, zb))
  }
}

for (let bi = 0; bi < 3; bi++) {
  const b = BANDS[bi]
  for (let k = 0; k < 5; k++) {
    const xa = k === 0 ? null : b.B[k - 1], xb = b.B[k], h = H[k]
    // The outer north and south faces (where nothing stands next to them).
    for (const side of ['n', 's'] as const) {
      const y = side === 'n' ? b.y1 : b.y0, probe = side === 'n' ? y + 0.3 : y - 0.3
      const x0 = xa ?? westX(y)
      const cuts = [x0, ...BANDS.flatMap((o) => o.B).filter((c) => c > x0 + 0.5 && c < xb - 0.5).sort((p, q) => p - q), xb]
      for (let i = 0; i < cuts.length - 1; i++) {
        const c0 = cuts[i], c1 = cuts[i + 1]
        if (heightAt((c0 + c1) / 2, probe) !== 0) continue
        grid(side === 'n' ? [c1, y] : [c0, y], side === 'n' ? [c0, y] : [c1, y], 0.5, h - 1.5)
      }
    }
    // The east riser: a bay of windows either side of the louvre slot.
    const hn = k < 4 ? H[k + 1] : 0, m = (b.y0 + b.y1) / 2
    grid([xb, b.y0], [xb, m - SLOT / 2 - 0.3], hn + 0.5, h - 1.5)
    grid([xb, m + SLOT / 2 + 0.3], [xb, b.y1], hn + 0.5, h - 1.5)
  }
}
// The sheer west face, one diagonal wall.
grid([westX(18.25), 18.25], [westX(-18.8), -18.8], 0, H[0] - 1.5)

await save('atl-georgia-pacific-tower', 'Georgia-Pacific Tower', [
  { part: granite, material: finish('gp-granite', 0xb07a66) },
  { part: win, material: PALETTE.window },
  { part: louvre, material: finish('gp-louvre', 0x5e4e48) },
  { part: roof, material: PALETTE.roof },
], { height: H[0], anchor: [33.757448, -84.387060], bearing: 0 }, 6500)
