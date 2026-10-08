/**
 * Eastern Columbia Building (1930, Claud Beelman), 849 S. Broadway, Los
 * Angeles — original procedural geometry, CC0-1.0.
 * bun generators/la-eastern-columbia.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres; origin at the centroid of the
 * OSM outline (way/427942790) on the ground (flat here). Placed at bearing
 * 38°, so +x runs to Broadway (south-east) and −y is the Ninth Street face.
 *
 * Art deco department store: thirteen floors of turquoise terracotta on the
 * two street faces, stepped up in tiers to a square clock tower near the
 * Broadway end, with a clock on each face between tall gold grille panels, a
 * gold cornice, and a green-bronze crown frame of four arched struts on a
 * central mast. The two back faces are plain painted concrete. Colour is the
 * identity, and so is the stepped clock tower.
 *
 * Sources:
 * - Plan: OSM way/427942790, a 48.2 × 34.5 m rectangle (Ninth St × Broadway),
 *   matching the LA County LARIAC 2020 lidar footprint 2014092853510000.
 * - Heights: LARIAC 2006 DSM sampled at 2 m and resampled into the building
 *   frame, over flat bare earth (77.0 m, ±0.4): the main block 40 m, the first
 *   setback 47 m (DSM 49.7 on its roof edge), the tower 62–75 m (the clock stage drawn 58–70, the frame
 *   above it). The second and third setbacks (53, 58 m) are read off e8 and
 *   e2, all centred on the tower's axis; the mast is taken to 80 m, the
 *   published 264 ft. LARIAC 2020 gives
 *   57.8 m for the footprint; Wikipedia: 150 ft (45.7 m) height limit, clock
 *   tower allowed to 264 ft "total" (80 m, taken to include the mast).
 * - Photos (Wikimedia Commons): e8 "Eastern Columbia Building, Downtown Los
 *   Angeles" (Matthew McNulty, CC BY-SA 4.0; the Ninth St face from the
 *   south-west, Broadway receding right past the Orpheum sign, City Hall in
 *   the distance), e2 "LA Eastern Columbia Building" (Andreas Praefcke, CC BY
 *   3.0; the Broadway face from the south-east, the plain back wing behind),
 *   e4 "Eastern columbia building - Flickr - jimw" (Jim Winstead, CC BY 2.0;
 *   the tower and crown frame), e1 "Eastern Columbia Tower - Los Angeles"
 *   (Galkab, CC BY-SA 3.0; from the south up Broadway), e10 "Eastern Columbia
 *   Building - panoramio - Jordan W." (CC BY-SA 3.0; tower corner).
 *
 * Estimated: tier outlines (from the DSM at 2 m and the photos), the window
 * panels (a recessed strip per 4 m bay between bold piers, three floors
 * tall, gold spandrel bands between rows), the crown frame's members
 * (drawn as four bold struts and a mast), the clock dials (gold rings and
 * hands).
 * Left out: the EASTERN letters (signage), the fine gold sunburst ornaments
 * on the piers, the entrance, the rooftop pool.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

type XY = [number, number]

const turq = new Part(), plain = new Part(), win = new Part(), gold = new Part(), roof = new Part(), crown = new Part()

const BEARING = 38
const HU = 24.1, HV = 17.25
const FLOOR = 4.3, GROUP = 3 * FLOOR, BAY = 4.0, PIER = 1.8, PROUD = 0.05, BEVEL = 0.4
const at = (p: XY, z: number): V3 => [p[0], p[1], z]

/**
 * A rectangular tier u0…u1 × v0…v1 from z0 to z1. Street faces (south-west,
 * south-east) are turquoise, back faces plain; windows per bay, three floors
 * per panel, a bevelled lip and a roof.
 */
function tier(u0: number, u1: number, v0: number, v1: number, z0: number, z1: number, o: { allTurq?: boolean; noWindows?: boolean } = {}) {
  const c: XY[] = [[u0, v0], [u1, v0], [u1, v1], [u0, v1]]
  const top = z1 - BEVEL
  for (let i = 0; i < 4; i++) {
    const a = c[i], b = c[(i + 1) % 4]
    // edge 0 faces −v (Ninth St), 1 faces +u (Broadway), 2 +v, 3 −u
    const street = o.allTurq || i === 0 || i === 1
    const part = street ? turq : plain
    part.quad(at(a, z0), at(b, z0), at(b, top), at(a, top))
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const bays = o.noWindows ? 0 : Math.floor(L / BAY)
    if (bays < 1) continue
    const t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [t[1], -t[0]]
    const m = (L - bays * BAY) / 2
    const p = (s: number, d = PROUD): XY => [a[0] + t[0] * s + n[0] * d, a[1] + t[1] * s + n[1] * d]
    // Bold piers with a recessed window strip between each pair: one panel
    // per bay, three floors tall; on the turquoise faces a gold spandrel band
    // sits between the panel rows (e8, e10).
    const base = z0 === 0 ? 5.5 : z0 + 0.8
    const groups = Math.max(1, Math.round((top - base - 1) / GROUP)), gh = (top - base - 1) / groups
    for (let k = 0; k < bays; k++) {
      const s0 = m + k * BAY + PIER / 2, s1 = m + (k + 1) * BAY - PIER / 2
      for (let g = 0; g < groups; g++) {
        const lo = base + g * gh + 0.9, hi = base + (g + 1) * gh - 0.9
        if (hi - lo < 3) continue
        win.quad(at(p(s0), lo), at(p(s1), lo), at(p(s1), hi), at(p(s0), hi))
        if (street && g > 0) gold.quad(at(p(s0, 0.07), lo - 0.9), at(p(s1, 0.07), lo - 0.9), at(p(s1, 0.07), lo - 0.05), at(p(s0, 0.07), lo - 0.05))
      }
    }
    // shop windows along the street faces
    if (street && z0 === 0) win.quad(at(p(1.5), 0.6), at(p(L - 1.5), 0.6), at(p(L - 1.5), 4.4), at(p(1.5), 4.4))
  }
  // bevelled lip and roof
  const b = BEVEL
  const inner: XY[] = [[u0 + b, v0 + b], [u1 - b, v0 + b], [u1 - b, v1 - b], [u0 + b, v1 - b]]
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    const part = o.allTurq || i === 0 || i === 1 ? turq : plain
    part.quad(at(c[i], top), at(c[j], top), at(inner[j], z1), at(inner[i], z1))
  }
  roof.quad(at(inner[0], z1), at(inner[1], z1), at(inner[2], z1), at(inner[3], z1))
}

// ---------- the stepped body ----------
// The main block, then three setbacks, each narrower and all centred on the
// tower's axis (v 0, u 14), up to the clock stage (e8, e2).
const AX = 14
tier(-HU, HU, -HV, HV, 0, 40)                                   // the main block
tier(-20.5, HU, -13.5, 13.5, 40, 47, { allTurq: true })       // first setback
tier(AX - 12, HU - 1, -11, 11, 47, 53, { allTurq: true })       // second
tier(AX - 9.5, AX + 9.5, -9.5, 9.5, 53, 58, { allTurq: true })          // third, the tower's base

// ---------- the clock stage ----------
// 16 m square on the axis, 58 to 70 m; gold cornice band at the top; on each
// face a large clock between gold grille panels (e4).
const T0: XY = [AX - 8, -8], T1: XY = [AX + 8, 8], TZ0 = 58, TZ1 = 70
{
  tier(T0[0], T1[0], T0[1], T1[1], TZ0, TZ1, { allTurq: true, noWindows: true })
  const cx = (T0[0] + T1[0]) / 2, cy = (T0[1] + T1[1]) / 2, h = (T1[0] - T0[0]) / 2
  const faces: { c: XY; n: XY; t: XY }[] = [
    { c: [cx, T0[1]], n: [0, -1], t: [1, 0] },
    { c: [T1[0], cy], n: [1, 0], t: [0, 1] },
    { c: [cx, T1[1]], n: [0, 1], t: [-1, 0] },
    { c: [T0[0], cy], n: [-1, 0], t: [0, -1] },
  ]
  for (const f of faces) {
    const q = (s: number, d = 0.08): XY => [f.c[0] + f.t[0] * s + f.n[0] * d, f.c[1] + f.t[1] * s + f.n[1] * d]
    gold.quad(at(q(-h - 0.3, 0.3), TZ1 - 1.8), at(q(h + 0.3, 0.3), TZ1 - 1.8), at(q(h + 0.3, 0.3), TZ1 - 0.4), at(q(-h - 0.3, 0.3), TZ1 - 0.4))
    for (const s of [-6.3, 6.3]) {
      gold.quad(at(q(s - 0.9), TZ0 + 1), at(q(s + 0.9), TZ0 + 1), at(q(s + 0.9), TZ1 - 3), at(q(s - 0.9), TZ1 - 3))
    }
    // the clock: a pale dial, a bold gold ring and two hands
    const zc = (TZ0 + TZ1 - 2) / 2, R = 4.2, r = 3.4, N = 16
    const P = (rr: number, a: number, d: number) => { const p = q(rr * Math.cos(a), d); return at(p, zc + rr * Math.sin(a)) }
    for (let i = 0; i < N; i++) {
      const a0 = (i / N) * 2 * Math.PI, a1 = ((i + 1) / N) * 2 * Math.PI
      gold.quad(P(r, a0, 0.1), P(R, a0, 0.1), P(R, a1, 0.1), P(r, a1, 0.1))
      plain.tri(at(q(0, 0.09), zc), P(r, a0, 0.09), P(r, a1, 0.09))
    }
    const hand = (len: number, ang: number, w: number) => {
      const dx = Math.cos(ang), dz = Math.sin(ang), ex = -dz * w, ez = dx * w
      const A = (s: number, e: number): V3 => at(q(s * dx + e * ex, 0.12), zc + s * dz + e * ez)
      gold.quad(A(-0.4, -1), A(len, -1), A(len, 1), A(-0.4, 1))
    }
    hand(3.0, Math.PI * 0.35, 0.3)
    hand(2.2, Math.PI * 1.25, 0.35)
  }

  // ---------- the crown frame ----------
  // A mast 2.4 m square to 80 m, and four struts from the middle of each
  // parapet edge rising to it at 77 m (e2, e4).
  const mast = 1.2, MZ = 80
  const box = (x0: number, x1: number, y0: number, y1: number, z0: number, z1: number) => {
    const c: XY[] = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
    for (let i = 0; i < 4; i++) {
      const a = c[i], b = c[(i + 1) % 4]
      crown.quad(at(a, z0), at(b, z0), at(b, z1), at(a, z1))
    }
    crown.quad(at(c[0], z1), at(c[1], z1), at(c[2], z1), at(c[3], z1))
  }
  box(cx - mast, cx + mast, cy - mast, cy + mast, TZ1, MZ)
  // four corner posts, short, as the frame's feet
  for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
    const px = cx + sx * (h - 1.2), py = cy + sy * (h - 1.2)
    box(px - 0.6, px + 0.6, py - 0.6, py + 0.6, TZ1, TZ1 + 3.2)
  }
  // struts: from each edge's middle, inset 0.8, up to the mast at 77 m
  for (const f of faces) {
    const foot: XY = [cx + f.n[0] * (h - 0.8), cy + f.n[1] * (h - 0.8)]
    const head: XY = [cx + f.n[0] * mast, cy + f.n[1] * mast]
    const w = 0.7, tt = f.t
    const s = (p: XY, z: number, e: number, d: number): V3 => [p[0] + tt[0] * e, p[1] + tt[1] * e, z + d]
    const zf = TZ1, zh = 77
    crown.sweep([
      [s(foot, zf, -w, 0), s(foot, zf, w, 0), s(foot, zf, w, 1.4), s(foot, zf, -w, 1.4)],
      [s(head, zh, -w, 0), s(head, zh, w, 0), s(head, zh, w, 1.4), s(head, zh, -w, 1.4)],
    ])
  }
}

const parts = [
  { part: turq, material: finish('ec-turquoise', 0x86c4bb) },
  { part: plain, material: finish('ec-painted', 0xc3cdcb) },
  { part: win, material: PALETTE.window },
  { part: gold, material: finish('ec-gold', 0xd9bd78) },
  { part: roof, material: PALETTE.roof },
  { part: crown, material: PALETTE.patina },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Eastern Columbia Building', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, height: 80,
  frame: 'Y up, -Z north, +X east, metres; origin at the anchor on the ground',
  replaces: ['way/427942790'],
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = process.argv[2] ?? new URL('../models/la-eastern-columbia.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
