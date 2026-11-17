/**
 * Christ the Redeemer (Cristo Redentor), Corcovado, Rio de Janeiro:
 * procedural, CC0-1.0.
 * bun generators/rio-christ-the-redeemer.ts
 *
 * Writes two levels of detail in the same frame, sculpted as smooth-shaded
 * surfaces (not stacked blocks):
 * - models/rio-christ-the-redeemer.glb, the low model;
 * - models/rio-christ-the-redeemer.detail.glb, drawn from zoom 17: the same
 *   forms at about three times the resolution, with the fingers, the hair's
 *   strands and the face's smaller features.
 *
 * Model frame: x along the arms (to the statue's left), y the way the statue
 * faces, z up, metres. The placement's bearing (84) turns the statue to face
 * east-north-east over the city towards Sugarloaf, as the pedestal's outline
 * in OSM shows: its sides run 8 degrees off north-south and east-west
 * (way/105667349, the chapel inside the pedestal), and Sugarloaf lies at
 * bearing 86 from the summit. The origin is OSM's monument node
 * (node/4919986733, Q79961); y = 0 is the summit terrace.
 *
 * Built 1922-1931 (Paul Landowski, Heitor da Silva Costa, Albert Caquot,
 * face by Gheorghe Leonida): reinforced concrete clad in soapstone tiles.
 *
 * Published (Wikipedia, "Christ the Redeemer (statue)"): the statue 30 m,
 * on an 8 m pedestal; the arms 28 m wide; the head 3.75 m.
 * OSM maps no building here: the pedestal's outline is the chapel's room
 * (way/105667349, ~8.6 m square with cut corners), so `replaces` is empty.
 *
 * Measured on "Christ the Redeemer - Cristo Redentor.jpg" (Arne Müseler,
 * CC BY-SA 3.0 de, a near-frontal telephoto, scaled from the published 28 m
 * span and 30 m height; heights above the statue's feet):
 * - the arms' top 24.1 m, flat across the shoulders; the hands 23.7 m, each
 *   ~3.6 m long with the fingers; the sleeves end 10.5 m out from the axis
 *   and hang to 20.4 m at the body, the bell of each sleeve hanging lower
 *   than the forearm leaving it;
 * - the head and hair 4.4 m, the chin at 25.6 m, the hair 2.8 m wide;
 * - the mantle: 6.9 m wide at the shoulders, 7.0 m at the waist; its hem is
 *   diagonal, 13.6 m above the feet on the statue's right and 6.7 m on its
 *   left; below it the tunic, 5.9 m wide, falls straight in deep pleats;
 * - the sash: the mantle drawn across the chest from the right armpit down to
 *   the middle; the mantle's front edge falling as a raised band from the
 *   left shoulder to the hem; a flap hanging from the right arm.
 * "Christ the Redeemer 1.jpg" and "2.jpg" (PLBechly, CC BY-SA 4.0, from below)
 * show the same folds, the Sacred Heart at the chest's centre, the palms
 * turned up, the pleats' rhythm (~24 round the tunic), the face: deep-set
 * eyes under a straight brow, a long straight nose, the beard and moustache,
 * the hair parted and falling behind the shoulders. "3.jpg" (from behind)
 * shows the mantle's diagonal folds across the back.
 * Estimated: every depth (no licensed photo is a true side view): the body
 * 4.4 m deep in the mantle, the tunic 3.9 m, the sleeves 3.2 m, the head 3.2
 * m; the folds' heights (0.2-0.6 m, a little bolder than real so they read
 * in the map's soft light) and widths; the face's features.
 *
 * Terrain: tools/terrain.ts could not check the site (Mapterhorn has no
 * z15 tiles here); the map stands the model on its own coarse summit, and
 * elevation stays 0.
 *
 * Night: the statue is floodlit white; the pedestal is lit more softly.
 *
 * Photos (Wikimedia Commons):
 * - "Christ the Redeemer - Cristo Redentor.jpg", Arne Müseler, CC BY-SA 3.0 de (front, telephoto)
 * - "Christ the Redeemer-(Corcovado) front view2.jpg", Mucio Scorzelli, CC BY-SA 4.0 (from the air, front)
 * - "Christ the Redeemer 1.jpg", "2.jpg" and "3.jpg", PLBechly, CC BY-SA 4.0 (from below, front and back)
 */
import { Part, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { finish } from './palette'

const TAU = Math.PI * 2
const PED = 8 // pedestal height; the statue's feet stand on it
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const len = (a: V3) => Math.hypot(a[0], a[1], a[2])
const unit = (a: V3): V3 => { const l = len(a) || 1; return [a[0] / l, a[1] / l, a[2] / l] }
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v))
const smooth = (t: number) => { const c = clamp(t, 0, 1); return c * c * (3 - 2 * c) }

/** Piecewise-linear interpolation of [x, ...values] rows at x. */
function interp(rows: number[][], x: number): number[] {
  if (x <= rows[0][0]) return rows[0].slice(1)
  for (let k = 0; k < rows.length - 1; k++) {
    if (x <= rows[k + 1][0]) {
      const t = (x - rows[k][0]) / (rows[k + 1][0] - rows[k][0])
      return rows[k].slice(1).map((v, i) => lerp(v, rows[k + 1][i + 1], t))
    }
  }
  return rows[rows.length - 1].slice(1)
}

/**
 * A smooth surface from a grid of rows (grid[k][i]): normals from the grid's
 * own neighbours, turned away from `inside(p)`. Each row is closed when
 * `closed` (the last point joins the first).
 */
function surface(p: Part, grid: V3[][], closed: boolean, inside: (q: V3) => V3) {
  const K = grid.length, N = grid[0].length
  const at = (k: number, i: number) => grid[clamp(k, 0, K - 1)][closed ? ((i % N) + N) % N : clamp(i, 0, N - 1)]
  const nrm = grid.map((row, k) => row.map((q, i) => {
    let n = cross(sub(at(k, i + 1), at(k, i - 1)), sub(at(k + 1, i), at(k - 1, i)))
    if (len(n) < 1e-9) n = sub(q, inside(q))
    n = unit(n)
    return dot(n, sub(q, inside(q))) < 0 ? mul(n, -1) : n
  }))
  const M = closed ? N : N - 1
  for (let k = 0; k < K - 1; k++)
    for (let i = 0; i < M; i++) {
      const j = (i + 1) % N
      const a = grid[k][i], b = grid[k][j], c = grid[k + 1][j], d = grid[k + 1][i]
      const na = nrm[k][i], nb = nrm[k][j], nc = nrm[k + 1][j], nd = nrm[k + 1][i]
      if (len(sub(a, b)) > 1e-6) p.tri(a, b, c, undefined, undefined, undefined, [na, nb, nc])
      if (len(sub(c, d)) > 1e-6) p.tri(a, c, d, undefined, undefined, undefined, [na, nc, nd])
    }
}

/** A raised fold: height h, width w, along the segment (x0, z0)-(x1, z1) on a surface's (x, z) map. */
type Fold = { x0: number; z0: number; x1: number; z1: number; h: number; w: number; side: 1 | -1 }
function foldAt(f: Fold, x: number, z: number) {
  const dx = f.x1 - f.x0, dz = f.z1 - f.z0, L2 = dx * dx + dz * dz || 1
  const t = clamp(((x - f.x0) * dx + (z - f.z0) * dz) / L2, 0, 1)
  const d = Math.hypot(x - (f.x0 + dx * t), z - (f.z0 + dz * t))
  return f.h * Math.exp(-((d / f.w) ** 2))
}

function build(R: number) {
  const stone = new Part(), pedestal = new Part()
  const Z = (h: number) => PED + h
  const axis = (q: V3): V3 => [0, 0, q[2]]

  // ------------------------------------------------------- the pedestal ---
  // Dark granite, a square with cut corners, a plinth and a cornice.
  {
    const ring = (h: number, z: number): V3[] => {
      const c = h * 0.72
      return [[h, -c], [h, c], [c, h], [-c, h], [-h, c], [-h, -c], [-c, -h], [c, -h]].map(([x, y]) => [x, y, z] as V3)
    }
    const rings = [ring(4.6, 0), ring(4.6, 0.7), ring(4.3, 0.9), ring(4.2, PED - 0.6), ring(4.45, PED - 0.4), ring(4.45, PED)]
    for (let k = 0; k < rings.length - 1; k++)
      for (let i = 0; i < 8; i++) {
        const j = (i + 1) % 8
        pedestal.quad(rings[k][i], rings[k][j], rings[k + 1][j], rings[k + 1][i])
      }
    const top = rings[rings.length - 1]
    for (let i = 1; i < 7; i++) pedestal.tri(top[0], top[i], top[i + 1])
  }

  /** A rounded section point at angle t (front = +y at t = pi/2), half-width a, half-depth b. */
  const sec = (a: number, b: number, t: number, e = 0.82): [number, number] => {
    const c = Math.cos(t), s = Math.sin(t)
    return [a * Math.sign(c) * Math.abs(c) ** e, b * Math.sign(s) * Math.abs(s) ** e]
  }

  // ------------------------------------------------------------ the tunic ---
  // Straight, deeply pleated; it runs up inside the mantle.
  {
    const NU = R > 1 ? 192 : 72, pleats = 24
    const prof = [[0, 3.05, 2.0], [0.5, 3.0, 1.97], [4, 2.97, 1.95], [9, 2.95, 1.95], [15, 2.95, 1.95]]
    const zs = R > 1 ? [0, 0.25, 0.5, 2, 4, 6.5, 9, 12, 15] : [0, 0.5, 4, 9, 15]
    const grid = zs.map((h) => {
      const [a, b] = interp(prof, h)
      return Array.from({ length: NU }, (_, i) => {
        const t = (i / NU) * TAU
        const pl = 1 - 0.075 * (0.5 - 0.5 * Math.cos(pleats * t)) ** 0.8
        const [x, y] = sec(a * pl, b * pl, t)
        return [x, y + 0.15, Z(h)] as V3
      })
    })
    surface(stone, grid, true, axis)
    // The feet below the hem.
    for (const s of [-1, 1]) {
      const g: V3[][] = []
      const n = 10 * R
      for (const [zz, rx, ry] of [[0, 0.5, 0.55], [0.12, 0.48, 0.5], [0.22, 0.38, 0.38], [0.3, 0.0, 0.0]] as [number, number, number][])
        g.push(Array.from({ length: n }, (_, i) => { const t = (i / n) * TAU; return [s * 0.8 + rx * Math.cos(t), 1.95 + ry * Math.sin(t), Z(zz)] as V3 }))
      surface(stone, g, true, () => [s * 0.8, 1.95, Z(0)])
    }
  }

  // ------------------------------------------------------------ the mantle ---
  // Over the shoulders to a diagonal hem; folds raised from it.
  {
    const prof = [ // h, half-width, half-depth
      [6, 3.2, 2.3], [10, 3.3, 2.32], [14, 3.4, 2.3], [18, 3.52, 2.25], [21.5, 3.6, 2.15],
      [23.6, 3.62, 2.0], [24.15, 3.35, 1.85], [24.55, 2.4, 1.6], [24.85, 1.5, 1.35], [25.1, 1.2, 1.2],
    ]
    const hem = (x: number) => 10.15 + 3.45 * clamp(-x / 3.2, -1, 1) // 13.6 on the statue's right (-x), 6.7 on its left
    const front: Fold[] = [
      { x0: -3.3, z0: 21.4, x1: 0.8, z1: 19.7, h: 0.62, w: 0.5, side: 1 },   // the sash across the chest
      { x0: 0.9, z0: 19.7, x1: 1.3, z1: 21.6, h: 0.3, w: 0.4, side: 1 },      // its end tucked under the edge
      { x0: -2.9, z0: 17.6, x1: 1.0, z1: 15.2, h: 0.4, w: 0.75, side: 1 },   // the swag hanging below it
      { x0: -2.6, z0: 14.6, x1: 0.9, z1: 11.8, h: 0.18, w: 0.7, side: 1 },
      { x0: 1.45, z0: 24.0, x1: 1.7, z1: 7.4, h: 0.6, w: 0.3, side: 1 },    // the mantle's front edge, a raised band
      { x0: -3.05, z0: 21.6, x1: -3.05, z1: 14.0, h: 0.5, w: 0.42, side: 1 }, // the flap hanging from the right arm
      { x0: 2.4, z0: 18.5, x1: 2.6, z1: 8.0, h: 0.22, w: 0.5, side: 1 },      // folds falling on the left side
      { x0: 0.05, z0: 22.6, x1: 0.05, z1: 22.6, h: 0.3, w: 0.3, side: 1 },     // the Sacred Heart
      { x0: -3.2, z0: 23.0, x1: 2.6, z1: 11.5, h: 0.28, w: 0.7, side: -1 },   // the diagonal folds across the back
      { x0: -3.0, z0: 18.0, x1: 1.5, z1: 9.5, h: 0.2, w: 0.6, side: -1 },
    ]
    const NU = R > 1 ? 128 : 56, NV = R > 1 ? 44 : 20
    const grid: V3[][] = []
    // The bottom row is the hem turned in (the cloth's thickness), then up to the neck.
    for (let k = -1; k <= NV; k++) {
      grid.push(Array.from({ length: NU }, (_, i) => {
        const t = (i / NU) * TAU
        const x0 = 3.3 * Math.cos(t)
        const zh = hem(x0)
        const v = k < 0 ? 0 : k / NV
        const h = lerp(zh, 25.1, v ** 1.1)
        const [a, b] = interp(prof, h)
        let [x, y] = sec(a, b, t)
        // Folds push out along the section's normal (radially, near enough).
        let bump = 0
        for (const f of front) if (f.side * Math.sin(t) > 0) bump += foldAt(f, x, h) * Math.min(1, Math.abs(Math.sin(t)) * 1.6)
        // Broad, soft vertical folds where the cloth hangs free below the chest.
        bump += 0.09 * smooth((19 - h) / 6) * Math.cos(9 * t)
        if (k < 0) bump -= 0.4 // the hem's inside edge
        const r = Math.hypot(x, y) || 1
        x += (x / r) * bump; y += (y / r) * bump
        return [x, y + 0.1, Z(h)] as V3
      }))
    }
    surface(stone, grid, true, axis)
  }

  // ------------------------------------------------------------ the arms ---
  for (const s of [1, -1]) {
    // [x out from the axis, top, bottom of the sleeve's bell, half depth]
    const SL = [
      [2.6, 24.35, 19.0, 1.72], [3.6, 24.4, 19.3, 1.68], [5.2, 24.32, 20.0, 1.62], [7.0, 24.25, 20.8, 1.56],
      [8.6, 24.15, 21.05, 1.56], [9.8, 24.05, 21.15, 1.6], [10.45, 24.0, 21.2, 1.64],
    ]
    const xs = R > 1 ? Array.from({ length: 19 }, (_, k) => 2.6 + (7.85 * k) / 18) : [2.6, 3.6, 5.2, 7.0, 8.6, 9.8, 10.45]
    const NU = 20 * R
    /** The sleeve's section: a rounded top over a bell hanging to a soft point. */
    const sleeve = (x: number, shrink = 0): V3[] => {
      const [top, bot, d] = interp(SL, x)
      const ht = d * 0.9 - shrink, zc = top - d * 0.9, hb = zc - bot - shrink
      return Array.from({ length: NU }, (_, i) => {
        const t = (i / NU) * TAU, c = Math.cos(t), sn = Math.sin(t)
        const y = (d - shrink) * c * (sn < 0 ? 1 - 0.5 * (-sn) ** 1.4 : 1)
        const z = zc + (sn >= 0 ? ht : hb) * sn
        // A soft fold down the bell's front.
        const fold = sn < 0 ? 0.12 * Math.exp(-(((t - 4.3) / 0.35) ** 2)) : 0
        return [s * x, y + fold, Z(z)] as V3
      })
    }
    const grid = xs.map((x) => sleeve(x))
    // The bell's rim turned inward to the forearm.
    grid.push(sleeve(10.5, 0.35))
    const [, , dEnd] = interp(SL, 10.45)
    surface(stone, grid, true, (q) => [q[0], 0, Z(22.8)])
    // The opening: a dark-ish recess is not modelled; the rim closes onto the forearm.
    const rimIn = sleeve(10.5, 0.35)
    const fore: V3[] = Array.from({ length: NU }, (_, i) => { const t = (i / NU) * TAU; return [s * 10.45, 0.62 * Math.cos(t), Z(23.5 + 0.55 * Math.sin(t))] as V3 })
    surface(stone, [rimIn, fore], true, () => [s * 10.2, 0, Z(23.3)])
    void dEnd

    // The forearm, the wrist and the open hand, palm up.
    const NF = 12 * R
    const limb = (x: number, ry: number, rz: number, zc: number, yc = 0): V3[] =>
      Array.from({ length: NF }, (_, i) => { const t = (i / NF) * TAU; return [s * x, yc + ry * Math.cos(t), Z(zc + rz * Math.sin(t))] as V3 })
    const arm = [limb(10.3, 0.6, 0.55, 23.5), limb(11.0, 0.52, 0.45, 23.55), limb(11.35, 0.5, 0.36, 23.6)]
    surface(stone, arm, true, (q) => [q[0], 0, Z(23.55)])
    // The palm: a broad slab, slightly cupped, tilted forward.
    const palm = [
      limb(11.35, 0.5, 0.36, 23.6), limb(11.7, 0.66, 0.27, 23.62, 0.04), limb(12.3, 0.7, 0.24, 23.62, 0.06), limb(12.9, 0.66, 0.2, 23.6, 0.06),
    ]
    surface(stone, palm, true, (q) => [q[0], 0.05, Z(23.6)])
    // The fingers: four in the detail model, one tapering slab in the low.
    if (R > 1) {
      for (const [dy, l] of [[-0.44, 0.8], [-0.15, 1.05], [0.15, 1.0], [0.43, 0.85]] as [number, number][]) {
        const f = [limb(12.85, 0.15, 0.13, 23.6, 0.06 + dy), limb(12.85 + l * 0.6, 0.14, 0.12, 23.6, 0.06 + dy), limb(12.85 + l, 0.1, 0.09, 23.62, 0.06 + dy), limb(12.9 + l, 0.02, 0.02, 23.62, 0.06 + dy)]
        surface(stone, f, true, (q) => [q[0], 0.06 + dy, Z(23.6)])
      }
    } else {
      surface(stone, [limb(12.85, 0.64, 0.18, 23.6, 0.06), limb(13.5, 0.55, 0.13, 23.62, 0.06), limb(13.95, 0.38, 0.08, 23.63, 0.06), limb(14.0, 0.02, 0.02, 23.63, 0.06)], true, (q) => [q[0], 0.06, Z(23.6)])
    }
    // The thumb, raised and turned forward.
    const thumbPath: V3[] = [[11.55, 0.55, 23.72], [11.95, 0.8, 23.95], [12.35, 0.95, 24.15], [12.6, 1.0, 24.22]]
    const tg = thumbPath.map(([x, y, z], k) => {
      const r = [0.17, 0.15, 0.12, 0.02][k]
      return Array.from({ length: 8 * R }, (_, i) => { const t = (i / (8 * R)) * TAU; return [s * x, y + r * Math.cos(t), Z(z + r * Math.sin(t))] as V3 })
    })
    surface(stone, tg, true, (q) => [q[0], q[1], q[2]])
  }

  // ------------------------------------------------------------ the head ---
  {
    // Height above the feet, half-width (hair included), half-depth.
    const prof = [
      [24.6, 1.55, 1.48], [25.0, 1.48, 1.45], [25.5, 1.42, 1.5], [26.1, 1.4, 1.58], [26.8, 1.42, 1.62], [27.5, 1.42, 1.64],
      [28.2, 1.38, 1.63], [28.8, 1.3, 1.56], [29.3, 1.12, 1.4], [29.7, 0.82, 1.06], [29.92, 0.42, 0.55], [30.0, 0.0, 0.0],
    ]
    const NU = R > 1 ? 72 : 32, NV = R > 1 ? 52 : 22
    const feats = [
      // [x, z, height, width, shape]  shape: 0 round, 1 vertical line to z2
      { x0: 0, z0: 27.0, x1: 0, z1: 28.15, h: 0.42, w: 0.2, side: 1 },     // the nose
      { x0: -0.6, z0: 28.38, x1: 0.6, z1: 28.38, h: 0.2, w: 0.14, side: 1 }, // the brow
      { x0: 0, z0: 25.25, x1: 0, z1: 26.35, h: 0.3, w: 0.5, side: 1 },     // the beard
      { x0: -0.35, z0: 26.85, x1: 0.35, z1: 26.85, h: 0.12, w: 0.12, side: 1 }, // the moustache
      { x0: -0.95, z0: 27.0, x1: -0.95, z1: 28.2, h: 0.1, w: 0.25, side: 1 }, // the cheekbones
      { x0: 0.95, z0: 27.0, x1: 0.95, z1: 28.2, h: 0.1, w: 0.25, side: 1 },
    ] as Fold[]
    const dents = [
      { x0: -0.43, z0: 27.98, x1: -0.43, z1: 27.98, h: -0.2, w: 0.2, side: 1 }, // the eyes
      { x0: 0.43, z0: 27.98, x1: 0.43, z1: 27.98, h: -0.2, w: 0.2, side: 1 },
      { x0: -0.2, z0: 26.62, x1: 0.2, z1: 26.62, h: -0.07, w: 0.08, side: 1 }, // the mouth
    ] as Fold[]
    const grid: V3[][] = []
    for (let k = 0; k <= NV; k++) {
      const h = lerp(24.6, 30.0, 1 - (1 - k / NV) ** 1.15)
      const [a, b] = interp(prof, h)
      grid.push(Array.from({ length: NU }, (_, i) => {
        const t = (i / NU) * TAU, sn = Math.sin(t)
        let [x, y] = sec(a, b, t, 0.9)
        const r0 = Math.hypot(x, y) || 1
        let dr = 0
        // The face set into the frame of the hair (front +-45 degrees),
        // drawing in below the beard to the neck.
        const front = smooth((sn - 0.62) / 0.25)
        dr -= front * 0.3 * smooth((h - 25.2) / 0.4) * smooth((29.2 - h) / 0.4)
        dr -= front * 0.75 * smooth((25.3 - h) / 0.5)
        const fx = a * Math.cos(t)
        if (sn > 0) for (const f of [...feats, ...dents]) dr += foldAt(f, fx, h) * front
        // The hair: strands down the sides and back (detail model), and
        // falling to the shoulders behind.
        if (R > 1) dr += -0.05 * (1 - front) * (0.5 + 0.5 * Math.cos(30 * t)) * smooth((29.4 - h) / 1)
        dr += (1 - front) * 0.12 * smooth((25.6 - h) / 0.8)
        x += (x / r0) * dr; y += (y / r0) * dr
        return [x, y - 0.05, Z(h)] as V3
      }))
    }
    surface(stone, grid, true, axis)
  }

  const statueLit = (_p: V3, _n: V3) => 1
  const pedLit = (_p: V3, n: V3) => (n[2] > 0.9 ? 0.2 : 0.55)
  const parts: Array<{ part: Part; material: MaterialSpec }> = [
    { part: stone, material: { ...finish('redeemer-soapstone', 0xd9d6cb), floodlight: statueLit } },
    { part: pedestal, material: { ...finish('redeemer-granite', 0x6e645b), floodlight: pedLit } },
  ]
  return parts
}

async function write(file: string, parts: Array<{ part: Part; material: MaterialSpec }>, maxTris: number, maxBytes: number) {
  const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
  if (triangles > maxTris) throw new Error(`${file}: triangle budget exceeded: ${triangles}`)
  const glb = writeGlb('Christ the Redeemer', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor', bearing: 84, elevation: 0, height: 38,
  })
  if (glb.length > maxBytes) throw new Error(`${file}: size budget exceeded: ${glb.length} bytes`)
  const out = new URL(`../models/${file}`, import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}

await write('rio-christ-the-redeemer.glb', build(1), 6500, 250_000)
await write('rio-christ-the-redeemer.detail.glb', build(2), 40_000, 1536 * 1024)
