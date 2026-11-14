/**
 * Thames Barrier, Woolwich Reach — original procedural geometry, CC0-1.0.
 * bun generators/london-thames-barrier.ts
 *
 * One placement for the whole barrier, like a bridge (docs/reference.md,
 * Bridges): y = 0 is the water. Model frame turned to BEARING 355.06, the
 * line of the piers from pier 9 (south bank) to pier 1 (north bank): +y
 * along the barrier toward the north bank, +x downstream (bearing 85, the
 * piers' long axis), z up, metres. Origin = midway between piers 1 and 9.
 *
 * What it is: nine concrete piers across the river carrying ten gates (four
 * 61 m main gates between piers 4–8, two 31 m rising-sector gates, four
 * smaller falling radial gates). The gates lie in the river bed and are not
 * drawn; the D-shaped gate-arm discs show against the piers' sides. Each
 * pier carries hooded roof shells clad in shining stainless steel — a
 * pointed-arch section, a flat end face, the back rolling down to the deck
 * like a ship's hull — a big one over the upstream (west) end and a smaller
 * one over the downstream (east) end, with the yellow machinery arms
 * between them.
 *
 * Evidence
 * - OSM building=pier ways (material=metal, refs 1–9): way/4970600 (1),
 *   way/4970589 (2), way/4970587 (3), way/4970572 (4), way/4970577 (5),
 *   way/4970578 (6), way/4970580 (7), way/4970583 (8), way/4970585 (9).
 *   Piers 4–8 are 64–65 m long and 11.1–11.7 m wide, 3 and 9 50 m × 8.3–
 *   9.8 m, 1 and 2 37 m × 8.7–8.8 m, their long axes at bearing 85. Pier
 *   centres (this frame) from the OSM centroids; spans 72 m (main) and
 *   38–41 m.
 * - Environment Agency LIDAR Composite DSM/DTM 2 m resample, Open Government
 *   Licence v3.0: water 1.75 m AOD (ground_min); the pier decks 7.5 m above
 *   it; the main piers' west hoods to ~20.5 m above the water, their flat
 *   faces at the west, falling to the deck about 14 m east. The stainless
 *   shells return few lidar points (specular), so their shapes come from
 *   the photos: the main west hoods are drawn 21 m over the deck (28.5 m
 *   over low water), 1.25 × their width and taller than they are long, from the 2023 photos from
 *   146° and 188° (the lidar's 20.5 m is taken as missing the shiny tops).
 * - Published (Wikipedia, "Thames Barrier"): 520 m across, opened 1982 (Rendel,
 *   Palmer and Tritton); 10 gates; the four main gates 61 m wide, 20 m high
 *   when raised; stainless steel shells over the machinery.
 * - Photos (Wikimedia Commons, all EVIDENCE):
 *   "Thames Barrier, London, England - Feb 2010.jpg", Diliff, CC BY-SA 3.0
 *     (from 320°, 363 m): the whole row — big hoods and small ones, their
 *     relative sizes, the piers' height over the water;
 *   "Thames Barrier 2024-10-27 (1).jpg", The wub, CC BY-SA 4.0 (343°,
 *     316 m): hoods from the north-north-west, white end faces on the west;
 *   "Thames Barrier - 2023-09-03.jpg", The wub, CC BY-SA 4.0 (188°, 225 m):
 *     piers 9 and 8 from the south — hood profile, the face with its
 *     porthole, the hood wider than the pier;
 *   "Thames Barrier gate closed (1) - 2023-09-03.jpg", The wub, CC BY-SA 4.0
 *     (146°): piers 8 and 7 from downstream — both hoods, the yellow arms;
 *   "Thames Barrier from a boat.jpg", Secretlondon, CC BY-SA 4.0: pier 4
 *     close — the D-shaped gate-arm disc, the face cabins;
 *   "Thames Barrier - 2020-01-18.jpg", The wub, CC BY-SA 4.0.
 *
 * Measured: pier plans (OSM), deck height (lidar). Published: span widths. Estimated (photos): hood
 * widths (1.45 × the pier on the main piers, 1.3 elsewhere), a gothic
 * two-centred arch section with a creased ridge, flat-shaded so the steel
 * reads in bands, hood heights scaled as (pier length / 65)^1.5 so the five
 * main piers' hoods stand clearly above the outer ones, west hoods 0.3 and
 * east hoods 0.22 of the pier's length, east hoods at 0.7 of the west's height, the arm discs 8.5 m in
 * radius, the yellow arms. Doubts: the service walkways and trusses from
 * the banks to piers 1–3 and 8–9 are left to the map; the hoods' exact
 * plan curvature is simplified to a pointed-arch section swept along a
 * quarter-ellipse.
 */
import { writeFileSync } from 'node:fs'
import { Part, writeGlb, cross, sub, type V3, type MaterialSpec } from './mesh'
import { finish } from './palette'

const ID = 'london-thames-barrier'

const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const scl = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const nrm = (a: V3): V3 => scl(a, 1 / (Math.hypot(a[0], a[1], a[2]) || 1))

const DECK = 7.5

/** Piers: centre (x, y) in this frame, OSM length and width, ref. */
const PIERS: { ref: number; x: number; y: number; len: number; wid: number }[] = [
  { ref: 1, x: 0.0, y: 223.1, len: 36.5, wid: 8.7 },
  { ref: 2, x: -0.1, y: 185.0, len: 36.9, wid: 8.8 },
  { ref: 3, x: -2.7, y: 146.0, len: 50.5, wid: 9.8 },
  { ref: 4, x: 4.7, y: 104.5, len: 63.9, wid: 11.6 },
  { ref: 5, x: 2.0, y: 33.2, len: 65.1, wid: 11.7 },
  { ref: 6, x: 6.8, y: -38.4, len: 65.4, wid: 11.5 },
  { ref: 7, x: 2.0, y: -110.4, len: 65.1, wid: 11.1 },
  { ref: 8, x: 2.7, y: -182.2, len: 63.8, wid: 11.4 },
  { ref: 9, x: 0.0, y: -223.1, len: 50.1, wid: 8.3 },
]

function grid(p: Part, g: V3[][], flipNormals = false) {
  const R = g.length, C = g[0].length
  const at = (i: number, j: number) => g[Math.max(0, Math.min(R - 1, i))][Math.max(0, Math.min(C - 1, j))]
  const N = g.map((row, i) => row.map((_, j) => {
    const n = nrm(cross(sub(at(i, j + 1), at(i, j - 1)), sub(at(i + 1, j), at(i - 1, j))))
    return flipNormals ? scl(n, -1) : n
  }))
  for (let i = 0; i < R - 1; i++)
    for (let j = 0; j < C - 1; j++) {
      const a = g[i][j], b = g[i][j + 1], c = g[i + 1][j + 1], d = g[i + 1][j]
      if (Math.hypot(...sub(a, b)) > 1e-6) p.tri(a, b, c, undefined, undefined, undefined, [N[i][j], N[i][j + 1], N[i + 1][j + 1]])
      if (Math.hypot(...sub(c, d)) > 1e-6) p.tri(a, c, d, undefined, undefined, undefined, [N[i][j], N[i + 1][j + 1], N[i + 1][j]])
    }
}

/** The pointed-arch section: height fraction at t in -1..1 (pointed apex, vertical feet). */
/** A gothic (two-centred) arch: circular arcs from the feet meeting at a pointed apex. */
const GC = 0.7
const arch = (t: number) => Math.sqrt(Math.max(0, (1 + GC) ** 2 - (Math.abs(t) + GC) ** 2)) / Math.sqrt(1 + 2 * GC)

/**
 * One hood: the flat face at x = fx on the pier (facing `dir` = ±1 along x),
 * the shell running `len` back from it, `h` tall over the deck and `w` wide.
 */
function hood(shell: Part, face: Part, arm: Part, cx: number, cy: number, fx: number, dir: number, len: number, h: number, w: number, seg: number) {
  const S = seg, T = seg + 2
  const g: V3[][] = []
  for (let i = 0; i <= S; i++) {
    const s = i / S // 0 at the face, 1 at the back
    const roll = s < 0.3 ? 0.86 + 0.14 * Math.sin((Math.PI / 2) * (s / 0.3)) : Math.pow(Math.max(0, 1 - Math.pow((s - 0.3) / 0.7, 2.2)), 0.5) // quarter-ellipse fall to the deck
    const hs = h * roll, ws = w * (0.7 + 0.3 * Math.sqrt(Math.max(0, 1 - Math.pow(s, 3))))
    const row: V3[] = []
    for (let j = 0; j <= T; j++) {
      const t = -1 + (2 * j) / T
      row.push([cx + fx - dir * len * s, cy + (t * ws) / 2, DECK + hs * arch(t)])
    }
    g.push(row)
  }
  // Orientation: rows advance away from the face, columns across; flip so
  // the normals point out of the shell.
  // Faceted across, smooth fore-aft: each column of the grid is a band with
  // its own normal (smoothed along its length), so the stainless catches
  // the light in bands and the pointed apex keeps a real crease.
  const R = g.length, C = g[0].length
  const bandN = (i: number, j: number): V3 => {
    const across = sub(g[Math.min(i, R - 1)][j + 1], g[Math.min(i, R - 1)][j])
    const along = sub(g[Math.min(i + 1, R - 1)][j], g[Math.max(i - 1, 0)][j])
    let n = nrm(cross(across, along))
    const m: V3 = g[Math.min(i, R - 1)][j]
    const o = sub(m, [m[0], cy, DECK])
    if (n[0] * o[0] + n[1] * o[1] + n[2] * o[2] < 0) n = scl(n, -1)
    return n
  }
  for (let i = 0; i < R - 1; i++)
    for (let j = 0; j < C - 1; j++) {
      const n0 = bandN(i, j), n1 = bandN(i + 1, j)
      const a = g[i][j], b = g[i][j + 1], c = g[i + 1][j + 1], d = g[i + 1][j]
      if (Math.hypot(...sub(a, b)) > 1e-6) shell.tri(a, b, c, undefined, undefined, undefined, [n0, n0, n1])
      if (Math.hypot(...sub(c, d)) > 1e-6) shell.tri(a, c, d, undefined, undefined, undefined, [n0, n1, n1])
    }
  // The flat face: a pointed-arch panel, plus a porthole ring of shell.
  const outline: V3[] = []
  for (let j = 0; j <= T; j++) {
    const t = -1 + (2 * j) / T
    outline.push([cx + fx + dir * 0.05, cy + (t * w) / 2, DECK + 0.78 * h * arch(t)])
  }
  const n: V3 = [dir, 0, 0], nn: V3[] = [n, n, n]
  const base: V3 = [cx + fx + dir * 0.05, cy, DECK]
  for (let j = 0; j < T; j++) face.tri(base, outline[j], outline[j + 1], undefined, undefined, undefined, nn)
  // Porthole: a dark disc on the face.
  const pc: V3 = [cx + fx + dir * 0.15, cy + w * 0.12, DECK + h * 0.38], pr = Math.max(0.6, h * 0.07)
  for (let k = 0; k < 8; k++) {
    const a0 = (2 * Math.PI * k) / 8, a1 = (2 * Math.PI * (k + 1)) / 8
    arm.tri(pc, add(pc, [0, pr * Math.cos(a0), pr * Math.sin(a0)]), add(pc, [0, pr * Math.cos(a1), pr * Math.sin(a1)]), undefined, undefined, undefined, nn)
  }
}

/** A prism with a rounded-end plan, from z0 to z1. */
function pierBody(p: Part, cx: number, cy: number, len: number, wid: number, z0: number, z1: number, capTop: boolean) {
  const ring: [number, number][] = []
  const r = wid / 2, half = len / 2 - r
  for (const [ox, a0] of [[half, -Math.PI / 2], [-half, Math.PI / 2]] as [number, number][])
    for (let k = 0; k <= 6; k++) {
      const a = a0 + (Math.PI * k) / 6
      ring.push([cx + ox + r * Math.cos(a) * 0.55, cy + r * Math.sin(a)])
    }
  const n = ring.length
  for (let i = 0; i < n; i++) {
    const [x0, y0] = ring[i], [x1, y1] = ring[(i + 1) % n]
    const o = nrm([y1 - y0, -(x1 - x0), 0])
    const nn: V3[] = [o, o, o]
    // Split into 2 bands for the terrain drape.
    p.tri([x0, y0, z0], [x1, y1, z0], [x1, y1, z1], undefined, undefined, undefined, nn)
    p.tri([x0, y0, z0], [x1, y1, z1], [x0, y0, z1], undefined, undefined, undefined, nn)
  }
  if (capTop) {
    const up: V3[] = [[0, 0, 1], [0, 0, 1], [0, 0, 1]]
    for (let i = 1; i < n - 1; i++) p.tri([ring[0][0], ring[0][1], z1], [ring[i][0], ring[i][1], z1], [ring[i + 1][0], ring[i + 1][1], z1], undefined, undefined, undefined, up)
  }
}

const M = {
  steel: { ...finish('stainless', 0xbcc2c8, 0.3), floodlight: (q: V3, n: V3) => (n[2] < 0.9 ? 0.6 : 0.2) } as MaterialSpec,
  face: finish('hood-face', 0xe8e9e6, 0.8),
  concrete: finish('concrete', 0xc8c4b8, 0.9),
  algae: finish('tide-stain', 0x7e7c69, 0.95),
  yellow: finish('machinery-yellow', 0xd8b43e, 0.7),
  arm: finish('gate-arm', 0x7a7a72, 0.85),
}

function build() {
  const steel = new Part(), face = new Part(), concrete = new Part(), algae = new Part(), yellow = new Part(), arm = new Part()
  const only = process.env.ONLY?.split(',').map(Number)
  for (const P of PIERS.filter((p) => !only || only.includes(p.ref))) {
    const k = P.len / 65 // size relative to a main pier
    const main = P.len > 60
    // Pier body: tide-stained base, concrete above.
    pierBody(algae, P.x, P.y, P.len, P.wid, 0, 3.2, false)
    pierBody(concrete, P.x, P.y, P.len, P.wid, 3.2, DECK, true)
    // Hoods: the big upstream one at the west end, the smaller downstream one at the east end.
    const hw = P.wid * (main ? 1.45 : 1.3)
    const WL = 0.3 * P.len, EL = 0.22 * P.len
    hood(steel, face, arm, P.x, P.y, -P.len / 2 + 3 * k, -1, WL, 21 * Math.pow(k, 1.5), hw, 10)
    hood(steel, face, arm, P.x, P.y, P.len / 2 - 3 * k, 1, EL, 14.5 * Math.pow(k, 1.5), hw * 0.88, 8)
    // Machinery between the hoods: a low housing and (main piers) yellow arms.
    const mx0 = P.x - P.len / 2 + 3 * k + WL * 0.85, mx1 = P.x + P.len / 2 - 3 * k - EL * 0.8
    if (mx1 > mx0 + 1) {
      const hy = P.wid * 0.38
      const box = (x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, part: Part) => {
        const c: V3[] = [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0], [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]]
        const q = (a: number, b: number, cc: number, d: number) => part.quad(c[a], c[b], c[cc], c[d])
        q(0, 1, 5, 4); q(1, 2, 6, 5); q(2, 3, 7, 6); q(3, 0, 4, 7); q(4, 5, 6, 7)
      }
      box(mx0, mx1, P.y - hy, P.y + hy, DECK, DECK + 3.2, concrete)
      if (main) {
        const ax = (mx0 + mx1) / 2
        for (const side of [-1, 1]) {
          const y = P.y + side * P.wid * 0.3
          const foot: V3 = [ax - 4, y, DECK + 3.2], top: V3 = [ax + 2.5, y, DECK + 14]
          // A bold box beam leaning over the machinery.
          const t = nrm(sub(top, foot)), u: V3 = [0, 0.7, 0], v = scl(nrm(cross(t, [0, 1, 0])), 0.7)
          const ring = (c: V3) => [add(add(c, u), v), add(sub(c, u), v), sub(sub(c, u), v), add(sub(c, v), u)] as V3[]
          const r0 = ring(foot), r1 = ring(top)
          const mid = scl(add(foot, top), 0.5)
          const faceN = (a: V3, b: V3, c: V3, d: V3) => {
            const ctr = scl(add(add(a, b), add(c, d)), 0.25), o = nrm(sub(ctr, mid)), nn: V3[] = [o, o, o]
            yellow.tri(a, b, c, undefined, undefined, undefined, nn)
            yellow.tri(a, c, d, undefined, undefined, undefined, nn)
          }
          for (let i = 0; i < 4; i++) faceN(r0[i], r0[(i + 1) % 4], r1[(i + 1) % 4], r1[i])
          faceN(r1[0], r1[1], r1[2], r1[3])
        }
      }
    }
    // Gate-arm discs: D-shaped plates against the pier's sides where the
    // gates pivot (photo of pier 4), the straight edge at the water.
    if (P.ref !== 1 && P.ref !== 9) {
      const R = main ? 8.5 : 5.5, px = (mx0 + mx1) / 2 + 1
      for (const side of [-1, 1]) {
        const y = P.y + side * (P.wid / 2 + 0.6)
        const n: V3 = [0, side, 0], nn: V3[] = [n, n, n]
        const c: V3 = [px, y, 0]
        for (let s = 0; s < 10; s++) {
          const a0 = (Math.PI * s) / 10, a1 = (Math.PI * (s + 1)) / 10
          const p0: V3 = [px + R * Math.cos(a0), y, R * Math.sin(a0)], p1: V3 = [px + R * Math.cos(a1), y, R * Math.sin(a1)]
          arm.tri(c, p0, p1, undefined, undefined, undefined, nn)
          // rim
          const i0 = add(p0, [0, -side * 0.6, 0]), i1 = add(p1, [0, -side * 0.6, 0])
          const rn = nrm([Math.cos((a0 + a1) / 2), 0, Math.sin((a0 + a1) / 2)])
          arm.tri(p0, i0, i1, undefined, undefined, undefined, [rn, rn, rn])
          arm.tri(p0, i1, p1, undefined, undefined, undefined, [rn, rn, rn])
        }
      }
    }
  }
  return [
    { part: steel, material: M.steel },
    { part: face, material: M.face },
    { part: concrete, material: M.concrete },
    { part: algae, material: M.algae },
    { part: yellow, material: M.yellow },
    { part: arm, material: M.arm },
  ]
}

if (import.meta.main) {
  const extras = { license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the water anchor' }
  const parts = build()
  const tris = parts.reduce((s, { part }) => s + part.triangles, 0)
  const glb = writeGlb('Thames Barrier', parts, extras)
  writeFileSync(process.env.OUT ?? new URL(`../models/${ID}.glb`, import.meta.url), glb)
  console.log(`models/${ID}.glb: ${tris} triangles, ${glb.length} bytes`)
}
