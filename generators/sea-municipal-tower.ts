/**
 * Seattle Municipal Tower (1990, Bassetti Architects), Seattle — original
 * procedural geometry, CC0-1.0.
 * bun generators/sea-municipal-tower.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor (the OSM
 * outline's area centroid) on the lowest ground under the tower, at its
 * west corner on 4th Avenue (50.8 m NAVD88). Built with the tower's long
 * axis on the model's y axis; placed at bearing 59°.
 *
 * Form: a rose-granite shaft on a long octagonal plan (69 x 39 m, the ends
 * chamfered), banded with dark window ribbons, under a tall barrel vault of
 * green glass that runs the length of the tower. At the south-west end the
 * vault stops in an arched gable and the end of the shaft steps down in
 * terraces; at the north-east end the vault runs on over the chamfers. A
 * 14-storey annex (OSM part way/331321181) stands against the south-east
 * face.
 *
 * Sources
 * - OSM: outline way/107124286; parts way/331321180 (the shaft: 62 floors,
 *   220 m, roof:shape round) and way/331321181 (the annex, 14 floors). The
 *   shaft's plan is used as tagged; it is symmetric to a few decimetres.
 * - Lidar (measured): USGS 3DEP WA_KingCo_1_2021, heights above the lowest
 *   ground under the tower: vault eaves 188 m, ridge 212–215 m, the profile
 *   in between (z 196 at 3.5 m in from the eave, 206 at 9.5 m); south-west
 *   terraces 181, 177, 174, 170 m, each ~3 m deep; annex roof ~35 m. The
 *   south part of the OSM outline is a plaza at street level and is left to
 *   the map.
 * - Published: 220 m, 62 storeys (Wikipedia, "Seattle Municipal Tower").
 * - Photos (Wikimedia Commons): the granite and window bands from the
 *   street, the vault and the terraced end from Columbia Center; credits in
 *   the batch report.
 * Estimated: window grouping (ribbons of three storeys of 3.7 m), the
 * serrations of the chamfered corners (three teeth each, from photos), the
 * annex's facade.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, type Prism, type Grid, ccw, capRing, chamfer, edgeBase, edgePanels, finishGlb, wallEdge } from './sea-columbia-center'

function build() {
  // The tower's own frame (u along the long axis towards the north-east, v
  // towards the north-west), centred at local (-6, 13) m from the anchor.
  // Model coordinates: x = -v - 14.23, y = u + 1.55.
  const M = ([u, v]: XY): XY => [-v - 14.23, u + 1.55]
  const CORE: XY[] = [[34.3, -6.2], [21.5, -19.5], [-21.5, -19.5], [-34.3, -6.2], [-34.3, 6.2], [-21.5, 19.5], [21.5, 19.5], [34.3, 6.2]]
  // The chamfered corners are serrated: each steps across in three square
  // teeth whose inner corners sit on the chamfer line.
  const TEETH = 3
  const OCT: XY[] = []
  CORE.forEach((a, i) => {
    const b = CORE[(i + 1) % CORE.length]
    OCT.push(a)
    if (a[0] === b[0] || a[1] === b[1]) return
    for (let k = 0; k < TEETH; k++) {
      const p: XY = [a[0] + ((b[0] - a[0]) * k) / TEETH, a[1] + ((b[1] - a[1]) * k) / TEETH]
      const q: XY = [a[0] + ((b[0] - a[0]) * (k + 1)) / TEETH, a[1] + ((b[1] - a[1]) * (k + 1)) / TEETH]
      const c1: XY = [q[0], p[1]], c2: XY = [p[0], q[1]]
      OCT.push(Math.hypot(...c1) > Math.hypot(...c2) ? c1 : c2)
      if (k < TEETH - 1) OCT.push(q)
    }
  })
  /** The octagon cut to u in [a, b]. */
  const slice = (a: number, b: number): XY[] => {
    let poly = OCT
    for (const [k, s] of [[a, 1], [b, -1]] as [number, number][]) {
      const out: XY[] = []
      poly.forEach((p, i) => {
        const q = poly[(i + 1) % poly.length]
        const fp = (p[0] - k) * s, fq = (q[0] - k) * s
        if (fp >= 0) out.push(p)
        if (fp * fq < 0) { const t = fp / (fp - fq); out.push([p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t]) }
      })
      poly = out
    }
    return poly
  }
  // Annex, in the same frame.
  const ANNEX: XY[] = [[6.4, -52.7], [34.6, -52.7], [34.3, -6.5], [21.5, -19.6], [-7.4, -19.6], [-7.3, -25.4], [-2.4, -25.4], [-2.3, -52.7]]

  const granite = new Part(), glass = new Part(), vault = new Part(), roof = new Part(), frame = new Part()
  const EAVE = 188, RIDGE = 213.5, HALF = 19.5
  const TERR: [number, number, number][] = [[-25, -21.5, 180.7], [-28, -25, 176.7], [-31, -28, 173.7], [-34.3, -31, 169.7]]
  const mr = (r: XY[]) => ccw(r.map(M))
  const prisms: Prism[] = [
    { ring: mr(slice(-21.5, 34.3)), z1: EAVE, wall: granite, roof, kind: 'tower' },
    ...TERR.map(([a, b, z]) => ({ ring: mr(slice(a, b)), z1: z, wall: granite, roof, kind: 'tower' })),
    { ring: chamfer(mr(ANNEX), 0.4), z1: 34.7, wall: granite, roof, kind: 'annex' },
  ]
  // Continuous window ribbons, one per three storeys, wrapping each face
  // between its corners, with granite spandrels of nearly equal weight.
  const grid: Grid = { group: 3 * 3.7, spandrel: 4.6, head: 2.5, foot: 4, inset: 0.7 }
  for (const P of prisms) {
    const r = P.ring
    for (let i = 0; i < r.length; i++) {
      const z0 = edgeBase(prisms, P, i)
      if (z0 >= P.z1 - 0.01) continue
      wallEdge(P.wall, r, i, z0, P.z1)
      edgePanels(glass, r, i, z0, P.z1, P.kind === 'annex' ? { ...grid, group: 2 * 3.5, spandrel: 2.8 } : grid, true)
    }
    capRing(P.roof, r, P.z1)
  }

  // The vault: a barrel across the full width, run from the south-west
  // gable to the north-east end, where the chamfers cut it.
  const prof = (v: number) => EAVE + (RIDGE - EAVE) * (1 - Math.abs(v / HALF) ** 1.8)
  const uEnd = (v: number) => Math.min(34.3, 21.5 + ((HALF - Math.abs(v)) * 12.8) / 13.3)
  const U0 = -21.5, N = 14
  const P3 = (u: number, v: number, z: number): V3 => { const [x, y] = M([u, v]); return [x, y, z] }
  const vs = Array.from({ length: N + 1 }, (_, k) => -HALF + (2 * HALF * k) / N)
  // smooth normals across the barrel (map frame: v points to -x)
  const nrm = (v: number): V3 => { const d = 1e-3, s = (prof(v + d) - prof(v - d)) / (2 * d); const l = Math.hypot(s, 1); return [s / l, 0, 1 / l] }
  for (let k = 0; k < N; k++) {
    const a = vs[k], b = vs[k + 1], za = prof(a), zb = prof(b), na = nrm(a), nb = nrm(b)
    const A0 = P3(U0, a, za), A1 = P3(uEnd(a), a, za), B1 = P3(uEnd(b), b, zb), B0 = P3(U0, b, zb)
    vault.tri(A0, B0, B1, undefined, undefined, undefined, [na, nb, nb])
    vault.tri(A0, B1, A1, undefined, undefined, undefined, [na, nb, na])
    // the gable and the north-east chamfer and end walls, up to the barrel
    // the gable under the arch is glazed, as the end of the top floors
    glass.quad(P3(U0, b, EAVE), P3(U0, a, EAVE), P3(U0, a, za), P3(U0, b, zb))
    granite.quad(P3(uEnd(a), a, EAVE), P3(uEnd(b), b, EAVE), P3(uEnd(b), b, zb), P3(uEnd(a), a, za))
  }
  // A bronze rim round the gable arch, and ribs along the vault every few bays.
  const rib = (u: number, w: number, out: number) => {
    for (let k = 0; k < N; k++) {
      const a = vs[k], b = vs[k + 1]
      if (u > Math.min(uEnd(a), uEnd(b)) - 0.5) continue
      const lift = (v: number): V3 => nrm(v).map((c) => c * out) as V3
      const pa = P3(u, a, prof(a)), pb = P3(u, b, prof(b)), la = lift(a), lb = lift(b)
      const q = (p: V3, l: V3, du: number): V3 => { const [x, y] = M([u + du, 0]); const [x0, y0] = M([u, 0]); return [p[0] + l[0] + x - x0, p[1] + l[1] + y - y0, p[2] + l[2]] }
      frame.quad(q(pa, la, 0), q(pb, lb, 0), q(pb, lb, w), q(pa, la, w))
    }
  }
  rib(U0, 1.2, 0.08)
  for (const u of [-7, 7, 21]) rib(u - 0.4, 0.8, 0.06)

  return finishGlb('sea-municipal-tower', 'Seattle Municipal Tower', [
    { part: granite, material: finish('smt-granite', 0xdcc5b8) },
    { part: glass, material: PALETTE.window },
    { part: vault, material: { ...PALETTE.glass, color: 0x86aaa3 } },
    { part: frame, material: finish('smt-bronze', 0x9a8a78) },
    { part: roof, material: PALETTE.roof },
  ], { bearing: 59, height: RIDGE, replaces: ['way/107124286', 'way/331321180', 'way/331321181'] })
}

if (import.meta.main) {
  const { glb, triangles } = build()
  const out = process.argv[2] ?? new URL('../models/sea-municipal-tower.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
}
