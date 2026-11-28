/**
 * Arc de Triomphe de l'Étoile, Paris — procedural, CC0-1.0, no textures.
 * bun generators/paris-arc-de-triomphe.ts
 *
 * Map frame: x along the main arch's passage (compass 115°, towards the
 * Champs-Élysées), y across it (compass 25°), z up, metres. Placement
 * bearing 25. Anchor: the area centroid of the OSM outline way/226413508
 * (lng 2.2950373, lat 48.8737774).
 *
 * Evidence
 * - Published (Wikipedia FR/EN "Arc de triomphe de l'Étoile"): 50 m high,
 *   45 m wide, 22 m deep; the main arch 29.19 m high and 14.62 m wide; the
 *   transverse arches 18.68 m high and 8.44 m wide. Both are drawn as real
 *   semicircles (12 segments), springing at 21.88 m and 14.46 m. Thirty
 *   shields round the attic carry the names of victories (10 on each long
 *   face, 5 on each end).
 * - OSM (measured, in this frame): outline 28.1 × 50.1 m including the four
 *   sculpture groups' pedestals; attic part 24.4 × 47.2 m (the cornice's
 *   overhang over the published 22 × 45 m body); the pedestals of the
 *   groups x ±12.2…14.0, y ±(11.4…19.6), 6 m high (published body faces at
 *   x ±11, so they stand 1.8 m proud); the roof terrace parts 47–50 m.
 * - Photos (Wikimedia Commons, evidence):
 *   "Arc Triomphe.jpg" (Benh LIEU SONG, CC BY-SA 3.0; floodlit at dusk
 *   from the north-east, the east face and the north end);
 *   "Arc de Triomphe de l'Étoile in July 2011.jpg" (Alvesgaspar,
 *   CC BY-SA 3.0; daylight from the south-west, the west face and south end).
 * - Scaled from the photos against the 50 m total (estimated, ±0.5 m):
 *   plinth to 1.6 m (1.2 m above the pavement; the Mapterhorn ground rises 1.2 m across the site, so it is drawn from the lowest point), the groups' pedestals to 6.5 m and the groups to 18.5 m,
 *   the Greek-key impost band 20.4–21.9 m, the upper relief panels
 *   23.8–30.8 m, the frieze 31.2–35.4 m, the cornice 35.4–38.2 m (1.0 m
 *   overhang), the attic 38.2–47.6 m with the shields at 42.8 m, the top
 *   cornice 47.6–48.8 m. The top is the paved stone viewing terrace with a
 *   low parapet (to 49.9 m) and a small stair house (to 50.2 m, size
 *   estimated); OSM's 47–50 m terrace parts are drawn as that paving.
 * - Simplified: the sculpture groups are bevelled proud blocks, the relief
 *   panels and the frieze flush slightly-proud panels in a greyer stone,
 *   the vaults' coffers left out (the soffits are the same grey), the
 *   names on the inner piers and the victories in the spandrels left out. The passages and vaults are a shaded stone (arc-vault).
 * - Look-only references: none.
 * - Terrain: the Place Charles-de-Gaulle is flat; elevation 0.
 *
 * Night: floodlit all round, warm, strongest on the faces.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cbox, grow, qf, rect, save, wallRing } from './dc-white-house'
import { disc, face, kit, ringOn, wallHoles, type Hole } from './london-westminster-abbey'

const stone = new Part(), trim = new Part(), relief = new Part(), vault = new Part(), junk = new Part()
kit.round = 12

const DX = 11.0, DY = 22.5 // half depth (x) and half width (y) of the body
const RM = 7.31, SM = 29.19 - 7.31 // main arch: radius and springing
const RT = 4.22, ST = 18.68 - 4.22 // transverse arches
const TOP = 31.2 // top of the plain body; the frieze above
const main: Hole = { a0: -RM, a1: RM, zb: 0, zs: SM, head: 'round' }
const trans: Hole = { a0: -RT, a1: RT, zb: 0, zs: ST, head: 'round' }

// ---- The body: main faces with the great arch, ends pierced by the transverse arches.
for (const s of [-1, 1]) {
  // Main faces (x = ±DX): a wall across the full width with the main arch.
  wallHoles(stone, face(s > 0 ? 'e' : 'w', s * DX), -DY, DY, 0, TOP, [main], { depth: 0.01, reveal: junk })
  // Ends (y = ±DY): the transverse arch tunnels through the pier to the main passage.
  wallHoles(stone, face(s > 0 ? 'n' : 's', s * DY), -DX, DX, 0, TOP, [trans], { depth: DY - RM, reveal: vault })
  // The pier's inner face on the main passage, with the transverse arch's other mouth.
  wallHoles(vault, face(s > 0 ? 's' : 'n', s * RM), -DX, DX, 0, SM, [trans], { depth: 0.01, reveal: junk })
}
// The main vault: a half cylinder across the depth, facing in.
for (let k = 0; k < kit.round; k++) {
  const t0 = (Math.PI * k) / kit.round, t1 = (Math.PI * (k + 1)) / kit.round
  const P = (x: number, t: number): V3 => [x, RM * Math.cos(t), SM + RM * Math.sin(t)]
  const tm = (t0 + t1) / 2
  qf(vault, P(-DX, t0), P(DX, t0), P(DX, t1), P(-DX, t1), [0, -Math.cos(tm), -Math.sin(tm)])
}
stone.cap([[-DX, -DY, TOP], [DX, -DY, TOP], [DX, DY, TOP], [-DX, DY, TOP]], true)

// ---- Bands: plinth, impost bands, archivolts.
for (const s of [-1, 1]) {
  // Plinth round each pier, stopping at the passages.
  for (const [x0, x1] of [[-DX - 0.3, -RT], [RT, DX + 0.3]]) cbox(trim, rect(x0, x1, s > 0 ? DY - 0.01 : -DY - 0.3, s > 0 ? DY + 0.3 : -DY + 0.01), 0, 1.6, { b: 0.2 })
  for (const [y0, y1] of [[-DY - 0.3, -RM], [RM, DY + 0.3]]) cbox(trim, rect(s > 0 ? DX - 0.01 : -DX - 0.3, s > 0 ? DX + 0.3 : -DX + 0.01, y0, y1), 0, 1.6, { b: 0.2 })
  // The Greek-key impost band: on the piers of the main faces, right across the ends.
  for (const [y0, y1] of [[-DY - 0.3, -RM], [RM, DY + 0.3]]) cbox(trim, rect(s > 0 ? DX - 0.01 : -DX - 0.3, s > 0 ? DX + 0.3 : -DX + 0.01, y0, y1), SM - 1.5, SM, { b: 0.15, bottom: true })
  cbox(trim, rect(-DX - 0.3, DX + 0.3, s > 0 ? DY - 0.01 : -DY - 0.3, s > 0 ? DY + 0.3 : -DY + 0.01), SM - 1.5, SM, { b: 0.15, bottom: true })
  // The transverse arches' imposts, beside the arch on each end.
  for (const [x0, x1] of [[-RT - 1.0, -RT], [RT, RT + 1.0]]) cbox(trim, rect(x0, x1, s > 0 ? DY - 0.01 : -DY - 0.2, s > 0 ? DY + 0.2 : -DY + 0.01), ST - 0.8, ST, { bottom: true })
  // Archivolts: a ring round each arch, flush on its face.
  const Fm = face(s > 0 ? 'e' : 'w', s * DX), Fe = face(s > 0 ? 'n' : 's', s * DY)
  halfRing(Fm, 0, SM, RM, RM + 0.9)
  halfRing(Fe, 0, ST, RT, RT + 0.7)
}
function halfRing(F: ReturnType<typeof face>, a: number, z: number, r0: number, r1: number) {
  for (let k = 0; k < kit.round; k++) {
    const t0 = (Math.PI * k) / kit.round, t1 = (Math.PI * (k + 1)) / kit.round
    const P = (r: number, t: number): V3 => [F.o[0] + F.u[0] * (a + r * Math.cos(t)) + F.n[0] * 0.08, F.o[1] + F.u[1] * (a + r * Math.cos(t)) + F.n[1] * 0.08, z + r * Math.sin(t)]
    qf(trim, P(r0, t0), P(r1, t0), P(r1, t1), P(r0, t1), F.n)
  }
}

// ---- Relief panels, flush and slightly proud, in a frame of trim.
const panel = (side: 'n' | 's' | 'e' | 'w', at: number, a0: number, a1: number, z0: number, z1: number) => {
  const n: V3 = side === 'n' ? [0, 1, 0] : side === 's' ? [0, -1, 0] : side === 'e' ? [1, 0, 0] : [-1, 0, 0]
  const ns = side === 'n' || side === 's'
  const r = (d0: number, d1: number, g: number) => ns
    ? rect(a0 - g, a1 + g, Math.min(at + n[1] * d0, at + n[1] * d1), Math.max(at + n[1] * d0, at + n[1] * d1))
    : rect(Math.min(at + n[0] * d0, at + n[0] * d1), Math.max(at + n[0] * d0, at + n[0] * d1), a0 - g, a1 + g)
  cbox(trim, r(-0.01, 0.22, 0.45), z0 - 0.45, z1 + 0.45, { b: 0.1, bottom: true })
  cbox(relief, r(0.2, 0.32, 0), z0, z1, { bottom: true })
}
for (const s of [-1, 1]) {
  const side = s > 0 ? 'e' : 'w'
  for (const yc of [-14.9, 14.9]) {
    panel(side, s * DX, yc - 4.6, yc + 4.6, 23.8, 30.4)
    // The sculpture groups: a pedestal and a bevelled proud mass.
    const x0 = s * DX, x1 = s * (DX + 1.8)
    cbox(stone, rect(Math.min(x0, x1), Math.max(x0, x1), yc - 4.1, yc + 4.1), 0, 6.0, { top: false })
    cbox(trim, rect(Math.min(x0, x1 + s * 0.2), Math.max(x0, x1 + s * 0.2), yc - 4.3, yc + 4.3), 6.0, 6.6, { b: 0.15, bottom: true })
    const g0 = s * DX, g1 = s * (DX + 1.6)
    cbox(relief, rect(Math.min(g0, g1), Math.max(g0, g1), yc - 3.3, yc + 3.3), 6.6, 15.5, { top: false })
    hipBlock(rect(Math.min(g0, g1), Math.max(g0, g1), yc - 3.3, yc + 3.3), 15.5, 18.6, s)
  }
}
/** The top of a group: tapering to its upper figures, against the wall. */
function hipBlock(r: ReturnType<typeof rect>, z0: number, z1: number, s: number) {
  const out = s > 0 ? r.x1 : r.x0, wall = s > 0 ? r.x0 : r.x1, ym = (r.y0 + r.y1) / 2
  const tOut = out - s * 0.9
  const A: V3 = [out, r.y0, z0], B: V3 = [out, r.y1, z0], C: V3 = [tOut, ym + 1.4, z1], D: V3 = [tOut, ym - 1.4, z1]
  const Aw: V3 = [wall, r.y0, z0], Bw: V3 = [wall, r.y1, z0], Cw: V3 = [wall, ym + 1.4, z1], Dw: V3 = [wall, ym - 1.4, z1]
  qf(relief, A, B, C, D, [s, 0, 0.6])
  qf(relief, Aw, A, D, Dw, [0, -1, 0.5])
  qf(relief, B, Bw, Cw, C, [0, 1, 0.5])
  qf(relief, D, C, Cw, Dw, [0, 0, 1])
}
for (const s of [-1, 1]) panel(s > 0 ? 'n' : 's', s * DY, -7.4, 7.4, 23.8, 30.4)

// ---- Entablature: frieze, cornice, attic with its shields, top cornice, terrace.
const body = rect(-DX, DX, -DY, DY)
cbox(relief, grow(body, 0.18), TOP, 35.0, { top: false, bottom: true })
cbox(trim, grow(body, 0.3), 35.0, 35.6, { bottom: true, top: false })
cbox(trim, grow(body, 1.0), 35.6, 38.2, { b: 0.45, bottom: true })
cbox(stone, grow(body, 0.2), 38.2, 47.6, { top: false })
cbox(trim, grow(body, 0.75), 47.6, 48.8, { b: 0.35, bottom: true, top: false })
// The viewing terrace: pale stone paving inside the cornice, a low parapet
// round its edge, and the small stair house.
stone.cap([[-DX - 0.75, -DY - 0.75, 48.8], [DX + 0.75, -DY - 0.75, 48.8], [DX + 0.75, DY + 0.75, 48.8], [-DX - 0.75, DY + 0.75, 48.8]], true)
wallRing(trim, grow(body, 0.1), 0.45, 48.8, 49.9)
cbox(stone, rect(-2.6, 2.6, -3.6, 3.6), 48.8, 50.2, { top: trim, c: 0.3 })
{
  const ZS = 42.8, R = 0.95
  for (const s of [-1, 1]) {
    const Fm = face(s > 0 ? 'e' : 'w', s * (DX + 0.2)), Fe = face(s > 0 ? 'n' : 's', s * (DY + 0.2))
    for (let k = 0; k < 10; k++) {
      const a = -DY + 2.25 + k * 4.5
      disc(relief, Fm, a, ZS, R, 12, 0.08)
      ringOn(trim, Fm, a, ZS, R, R + 0.3, 12, 0.1)
      // A plain pilaster panel between the shields.
      if (k < 9) qf(trim, [s * (DX + 0.3), a + 1.85, 39.4], [s * (DX + 0.3), a + 2.65, 39.4], [s * (DX + 0.3), a + 2.65, 46.4], [s * (DX + 0.3), a + 1.85, 46.4], [s, 0, 0])
    }
    for (let k = 0; k < 5; k++) {
      const a = -DX + 2.2 + k * 4.4
      disc(relief, Fe, a, ZS, R, 12, 0.08)
      ringOn(trim, Fe, a, ZS, R, R + 0.3, 12, 0.1)
    }
    // Moulding at the attic's base and under the top cornice.
    void Fe
  }
  cbox(trim, grow(body, 0.35), 39.0, 39.4, { bottom: true, top: false })
  cbox(trim, grow(body, 0.35), 46.4, 46.8, { bottom: true, top: false })
}

// Floodlit all round: the faces strongly, upward faces barely.
const lit = (_q: V3, n: V3) => (n[2] > 0.8 ? 0.15 : n[2] < -0.5 ? 0.5 : 0.95)
await save('paris-arc-de-triomphe', 'Arc de Triomphe', [
  { part: stone, material: { ...PALETTE.stone, floodlight: lit } },
  { part: trim, material: { ...PALETTE.trim, floodlight: lit } },
  { part: relief, material: { ...finish('arc-relief', 0xd6cbb9), floodlight: lit } },
  { part: vault, material: { ...finish('arc-vault', 0xb3a998), floodlight: (_q: V3, n: V3) => (n[2] < -0.5 ? 0.6 : 0.4) } },
], { source: 'generators/paris-arc-de-triomphe.ts' }, 5000)
