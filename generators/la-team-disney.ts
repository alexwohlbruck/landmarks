/**
 * Team Disney – The Michael D. Eisner Building (1990, Michael Graves),
 * Walt Disney Studios, Burbank — procedural, CC0-1.0.
 * bun generators/la-team-disney.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0. The anchor is the
 * area centroid of OSM relation/6385468, on the ground (160.0 m; the site is
 * flat to half a metre, USGS 3DEP).
 *
 * The building is two grids. The famous east front, the pediment held up by
 * the Seven Dwarfs, is square to the compass; the rest (the groin-vaulted
 * pavilions on Buena Vista Street, the tile-roofed wings and the long wing
 * south along the street) is turned 22.4 degrees anticlockwise. W() places a
 * point of that second grid (u east-north-east, v north-north-west, from the
 * OSM node the lidar grid was centred on).
 *
 * What makes it the Team Disney building: the east front's shallow pediment
 * held by six 19 ft dwarfs standing on a red granite base, with Dopey alone
 * in the pediment's middle; ochre walls over red stone; the round rotunda
 * with its ring of columns rising behind the pediment; the four grey
 * groin-vaulted pavilions whose big semicircular arched ends face the street.
 * Famous-object exception (STYLE.md): the dwarfs are simple bold figures.
 *
 * Sources:
 * - Plan: OSM relation/6385468 (outer and inner rings); USGS NAIP orthophoto,
 *   turned into the wing grid (the four vaults, the flat spine, the tile
 *   roofs, the courtyard, the small drum on the long wing).
 * - Heights: LA County 2020 lidar surface model, a 2 m grid in the wing frame
 *   and 1.5 m over the east block in the north frame: the east block's roof
 *   21 m at the eaves to 23-24 m at the pediment's apex, the block behind it
 *   26.5 m, the rotunda 33 m (about 23 m across, centred 14.5 m west of the
 *   block's middle); the vaults' crowns 28-29 m, the spine 30.5 m, the
 *   street block between the vaults 26 m, the tile wings 17-18 m, the long
 *   wing 17-18 m, its drum 22.5 m, the courtyard roofs 13-16 m.
 * - Published: the dwarfs are 19 ft (5.8 m) tall (Disney; widely reported);
 *   architect Michael Graves, 1990.
 * - Photos (Wikimedia Commons): "Teamdisneyburbankbuilding" (Coolcaesar,
 *   CC BY-SA 4.0; the east front square on), "The Walt Disney Company office"
 *   (Davric, CC BY-SA 4.0; the east front from the south-east), "7 Dwarves
 *   caryatids, Eisner Building Disney Studios" (Cory Doctorow, CC BY-SA 2.0),
 *   "Disney studios burbank team disney building buena vista" (Junkyardsparkle,
 *   CC0; the street side: vault ends, rotunda).
 * - Estimated: the bay rhythm (seven bays at 8 m, the glass 5 m and the
 *   piers 3 m, from the photos fitted to the 58 m front), the storey heights
 *   of the base and the dwarf zone (photo proportions on the lidar's 20.4 m
 *   eaves: base 11.4 m, the dwarfs on 0.9 m plinths up to the entablature),
 *   the dwarfs' figures, the street side's windows, the rotunda's columns.
 * - Left out: the pergola, the canopy, lettering, the dwarfs' faces and
 *   clothes, mullions.
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const ochre = new Part(), granite = new Part(), sand = new Part(), tile = new Part(), grey = new Part(), win = new Part()

const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const unit = (a: V3): V3 => mul(a, 1 / (Math.hypot(...a) || 1))
const TAU = Math.PI * 2
function quad(p: Part, P: V3[], hint: V3, ns?: V3[]) {
  const f = add(cross(sub(P[1], P[0]), sub(P[2], P[0])), cross(sub(P[2], P[0]), sub(P[3], P[0])))
  const ord = dot(f, hint) >= 0 ? [0, 1, 2, 3] : [0, 3, 2, 1]
  const n = ns?.map(unit)
  const t = (a: number, b: number, c: number) => {
    const A = P[ord[a]], B = P[ord[b]], C = P[ord[c]]
    if (Math.hypot(...cross(sub(B, A), sub(C, A))) < 1e-9) return
    p.tri(A, B, C, undefined, undefined, undefined, n && [n[ord[a]], n[ord[b]], n[ord[c]]])
  }
  t(0, 1, 2)
  t(0, 2, 3)
}
function tri(p: Part, A: V3, B: V3, C: V3, hint: V3) {
  if (Math.hypot(...cross(sub(B, A), sub(C, A))) < 1e-9) return
  if (dot(cross(sub(B, A), sub(C, A)), hint) >= 0) p.tri(A, B, C)
  else p.tri(A, C, B)
}

/** A plan frame: local (a, b) to map (x, y), and a local direction to a map one. */
type Frame = { P: (a: number, b: number, z: number) => V3; D: (a: number, b: number) => V3 }
// The anchor is OSM node-frame (30.81, 15.96).
const AX = 30.81, AY = 15.96
const C = Math.cos((22.4 * Math.PI) / 180), S = Math.sin((22.4 * Math.PI) / 180)
const WING: Frame = {
  P: (u, v, z) => [u * C - v * S - AX, u * S + v * C - AY, z],
  D: (u, v) => [u * C - v * S, u * S + v * C, 0],
}
const EB = { x: 79.5 - AX, y: 49.5 - AY } // the east block's centre
const EAST: Frame = { P: (a, b, z) => [EB.x + a, EB.y + b, z], D: (a, b) => [a, b, 0] }

/** A box in a frame with a bevelled lip; walls split granite below `zg`, ochre above. */
function block(F: Frame, a0: number, a1: number, b0: number, b1: number, z0: number, z1: number, zg = 0, top: Part | null = grey, lip = 0.4) {
  const c: [number, number][] = [[a0, b0], [a1, b0], [a1, b1], [a0, b1]]
  const ci: [number, number][] = [[a0 + lip, b0 + lip], [a1 - lip, b0 + lip], [a1 - lip, b1 - lip], [a0 + lip, b1 - lip]]
  const ca = (a0 + a1) / 2, cb = (b0 + b1) / 2
  for (let i = 0; i < 4; i++) {
    const p = c[i], q = c[(i + 1) % 4], pi = ci[i], qi = ci[(i + 1) % 4]
    const o = F.D((p[0] + q[0]) / 2 - ca, (p[1] + q[1]) / 2 - cb)
    const zs = Math.min(Math.max(zg, z0), z1 - lip)
    if (zs > z0) quad(granite, [F.P(p[0], p[1], z0), F.P(q[0], q[1], z0), F.P(q[0], q[1], zs), F.P(p[0], p[1], zs)], o)
    quad(ochre, [F.P(p[0], p[1], zs), F.P(q[0], q[1], zs), F.P(q[0], q[1], z1 - lip), F.P(p[0], p[1], z1 - lip)], o)
    quad(sand, [F.P(p[0], p[1], z1 - lip), F.P(q[0], q[1], z1 - lip), F.P(qi[0], qi[1], z1), F.P(pi[0], pi[1], z1)], add(unit(o), [0, 0, 1]))
  }
  if (top) quad(top, ci.map(([a, b]) => F.P(a, b, z1)), [0, 0, 1])
}

/** A hipped tile roof over a frame rectangle, with an overhang and a soffit. */
function hip(F: Frame, a0: number, a1: number, b0: number, b1: number, zE: number, zR: number, o = 0.7) {
  a0 -= o; a1 += o; b0 -= o; b1 += o
  const alongA = a1 - a0 >= b1 - b0
  const h = (alongA ? b1 - b0 : a1 - a0) / 2
  const e = zE - 0.2
  const A = F.P(a0, b0, e), B = F.P(a1, b0, e), Cc = F.P(a1, b1, e), D = F.P(a0, b1, e)
  const R0 = alongA ? F.P(a0 + h, (b0 + b1) / 2, zR) : F.P((a0 + a1) / 2, b0 + h, zR)
  const R1 = alongA ? F.P(a1 - h, (b0 + b1) / 2, zR) : F.P((a0 + a1) / 2, b1 - h, zR)
  const up = (d: V3): V3 => [d[0], d[1], 1]
  if (alongA) {
    quad(tile, [A, B, R1, R0], up(F.D(0, -1))); quad(tile, [Cc, D, R0, R1], up(F.D(0, 1)))
    tri(tile, D, A, R0, up(F.D(-1, 0))); tri(tile, B, Cc, R1, up(F.D(1, 0)))
  } else {
    quad(tile, [B, Cc, R1, R0], up(F.D(1, 0))); quad(tile, [D, A, R0, R1], up(F.D(-1, 0)))
    tri(tile, A, B, R0, up(F.D(0, -1))); tri(tile, Cc, D, R1, up(F.D(0, 1)))
  }
  quad(sand, [A, B, Cc, D], [0, 0, -1])
}

/** Wall panels along one face of a frame rectangle: `face` is the outward local direction. */
function bays(F: Frame, p0: [number, number], p1: [number, number], out: [number, number], pitch: number, width: number, rows: [number, number][]) {
  const L = Math.hypot(p1[0] - p0[0], p1[1] - p0[1])
  const n = Math.max(1, Math.round(L / pitch))
  const da = (p1[0] - p0[0]) / L, db = (p1[1] - p0[1]) / L
  const at = (s: number, z: number) => F.P(p0[0] + da * s + out[0] * 0.06, p0[1] + db * s + out[1] * 0.06, z)
  const hint = F.D(out[0], out[1])
  for (let i = 0; i < n; i++) {
    const s = (L * (i + 0.5)) / n
    for (const [z0, z1] of rows) quad(win, [at(s - width / 2, z0), at(s + width / 2, z0), at(s + width / 2, z1), at(s - width / 2, z1)], hint)
  }
}

/** A surface of revolution, smooth-shaded, about map point (cx, cy). */
function revolve(p: Part, cx: number, cy: number, prof: [number, number][], segs: number, cap = true) {
  const pt = (a: number, r: number, z: number): V3 => [cx + r * Math.cos(a), cy + r * Math.sin(a), z]
  for (let j = 0; j < prof.length - 1; j++) {
    const [r0, z0] = prof[j], [r1, z1] = prof[j + 1]
    for (let i = 0; i < segs; i++) {
      const a0 = (i / segs) * TAU, a1 = ((i + 1) / segs) * TAU
      const nn = (a: number): V3 => unit([Math.cos(a) * (z1 - z0), Math.sin(a) * (z1 - z0), -(r1 - r0)])
      quad(p, [pt(a0, r0, z0), pt(a1, r0, z0), pt(a1, r1, z1), pt(a0, r1, z1)], add(nn(a0), nn(a1)), [nn(a0), nn(a1), nn(a1), nn(a0)])
    }
  }
  const [rt, zt] = prof[prof.length - 1]
  if (cap && rt > 0.01) for (let i = 0; i < segs; i++) tri(p, [cx, cy, zt], pt((i / segs) * TAU, rt, zt), pt(((i + 1) / segs) * TAU, rt, zt), [0, 0, 1])
}

// ---------------------------------------------------------------------------
// The wing grid. Long wing south along Buena Vista Street, and its drum.
block(WING, -9.5, 10.4, -87, -2, 0, 15.6, 7)
hip(WING, -9.5, 10.4, -87, -2, 15.6, 18.3)
bays(WING, [-9.5, -86], [-9.5, -3], [-1, 0], 6.2, 3.0, [[1.2, 6.0], [8.4, 14.6]])
bays(WING, [10.4, -86], [10.4, -3], [1, 0], 6.2, 3.0, [[1.2, 6.0], [8.4, 14.6]])
bays(WING, [-8.5, -87], [9.4, -87], [0, -1], 6.0, 3.0, [[1.2, 6.0], [8.4, 14.6]])
{
  const [cx, cy] = WING.P(13.5, -40.7, 0)
  revolve(granite, cx, cy, [[7.8, 0], [7.8, 7]], 16, false)
  revolve(ochre, cx, cy, [[7.8, 7], [7.8, 22.0]], 16, false)
  revolve(sand, cx, cy, [[7.8, 22.0], [8.3, 22.3], [8.3, 22.7], [7.6, 22.8]], 16, false)
  revolve(grey, cx, cy, [[7.6, 22.8], [0.01, 22.8]], 16, false)
  for (let k = 0; k < 8; k++) {
    const a = ((2 * k + 0.5) / 16) * TAU, r = 7.8 * Math.cos(Math.PI / 16) + 0.06
    const P = (s: number, z: number): V3 => [cx + r * Math.cos(a) - s * Math.sin(a), cy + r * Math.sin(a) + s * Math.cos(a), z]
    quad(win, [P(-1.3, 9), P(1.3, 9), P(1.3, 19), P(-1.3, 19)], [Math.cos(a), Math.sin(a), 0])
  }
}

// The four groin-vaulted pavilions: walls to 21 m, a cross vault to 28.3 m,
// a big lunette window in each arched end.
const VS = 21, VR = 7.25
function vault(u0: number, v0: number) {
  const u1 = u0 + 2 * VR, v1 = v0 + 2 * VR, cu = u0 + VR, cv = v0 + VR
  block(WING, u0, u1, v0, v1, 0, VS, 8, null, 0.35)
  const h = (d: number) => VS + Math.sqrt(Math.max(0, VR * VR - d * d))
  const n = 8
  // each quarter (between the diagonals) belongs to the barrel ending on its face
  for (const [du, dv] of [[1, 0], [-1, 0], [0, 1], [0, -1]] as [number, number][]) {
    for (let i = 0; i < n; i++) {
      const s0 = -VR + (2 * VR * i) / n, s1 = -VR + (2 * VR * (i + 1)) / n
      // s runs across the face, t from the centre line out to the face
      const pt = (s: number, t: number): V3 => {
        const a = du !== 0 ? cu + du * t : cu + s
        const b = du !== 0 ? cv + s : cv + dv * t
        return WING.P(a, b, h(s))
      }
      const nr = (s: number): V3 => {
        const d = du !== 0 ? WING.D(0, s) : WING.D(s, 0)
        return unit([d[0], d[1], Math.sqrt(Math.max(0.01, VR * VR - s * s))])
      }
      const A = pt(s0, Math.abs(s0)), B = pt(s1, Math.abs(s1)), Cc = pt(s1, VR + 0.4), D = pt(s0, VR + 0.4)
      quad(grey, [A, B, Cc, D], [0, 0, 1], [nr(s0), nr(s1), nr(s1), nr(s0)])
    }
    // the lunette wall under the arch, and its half-round window
    const face = (s: number, z: number, off = 0): V3 => du !== 0 ? WING.P(cu + du * (VR + off), cv + s, z) : WING.P(cu + s, cv + dv * (VR + off), z)
    const o = WING.D(du, dv)
    for (let i = 0; i < n; i++) {
      const s0 = -VR + (2 * VR * i) / n, s1 = -VR + (2 * VR * (i + 1)) / n
      tri(ochre, face(0, VS), face(s0, h(s0)), face(s1, h(s1)), o)
    }
    const wr = VR * 0.6
    for (let i = 0; i < 6; i++) {
      const a0 = (i / 6) * Math.PI, a1 = ((i + 1) / 6) * Math.PI
      tri(win, face(0, VS + 0.3, 0.06), face(wr * Math.cos(a0), VS + 0.3 + wr * Math.sin(a0), 0.06), face(wr * Math.cos(a1), VS + 0.3 + wr * Math.sin(a1), 0.06), o)
    }
  }
  // windows on the vaults' walls below the arches
  const rows: [number, number][] = [[1.2, 7], [9.4, 19]]
  bays(WING, [u0, v0 + 0.5], [u0, v1 - 0.5], [-1, 0], 5, 2.6, rows)
  bays(WING, [u1, v0 + 0.5], [u1, v1 - 0.5], [1, 0], 5, 2.6, rows)
  bays(WING, [u0 + 0.5, v0], [u1 - 0.5, v0], [0, -1], 5, 2.6, rows)
  bays(WING, [u0 + 0.5, v1], [u1 - 0.5, v1], [0, 1], 5, 2.6, rows)
}
vault(-9.6, -2.0)
vault(-9.6, 29.3)
vault(18.8, -2.0)
vault(18.8, 29.3)
// the flat spine between them, the street block between the west pair, the
// low courtyard roofs between the east pair and the tile wings
block(WING, 4.9, 18.8, -2.0, 43.8, 0, 30.5, 8)
bays(WING, [4.9, -2.0], [18.8, -2.0], [0, -1], 4.6, 2.6, [[1.2, 7], [9.4, 18], [20.5, 28.5]])
bays(WING, [4.9, 43.8], [18.8, 43.8], [0, 1], 4.6, 2.6, [[1.2, 7], [9.4, 18], [20.5, 28.5]])
block(WING, -9.6, 4.9, 12.5, 29.3, 0, 26, 8)
{
  // the street front between the vaults: a tall bay with a round window
  const at = (s: number, z: number): V3 => WING.P(-9.66, s, z)
  const o = WING.D(-1, 0)
  quad(win, [at(17.4, 1.2), at(24.4, 1.2), at(24.4, 13), at(17.4, 13)], o)
  const c = at(20.9, 19.5)
  for (let i = 0; i < 12; i++) {
    const a0 = (i / 12) * TAU, a1 = ((i + 1) / 12) * TAU
    tri(win, c, at(20.9 + 2.2 * Math.cos(a0), 19.5 + 2.2 * Math.sin(a0)), at(20.9 + 2.2 * Math.cos(a1), 19.5 + 2.2 * Math.sin(a1)), o)
  }
}
block(WING, 33.3, 67.4, 12.5, 29.3, 0, 13.5, 0)
block(WING, 18.8, 33.3, 12.5, 29.3, 0, 16, 8)
block(WING, 33.3, 67.4, 29.3, 43.3, 0, 15.6, 7, null)
hip(WING, 33.3, 67.4, 29.3, 43.3, 15.6, 18.3)
block(WING, 33.3, 67.4, -2.8, 12.5, 0, 15.6, 7, null)
hip(WING, 33.3, 67.4, -2.8, 12.5, 15.6, 18.3)
bays(WING, [33.8, 43.3], [66.9, 43.3], [0, 1], 6.2, 3.0, [[1.2, 6.0], [8.4, 14.6]])
bays(WING, [33.8, -2.8], [66.9, -2.8], [0, -1], 6.2, 3.0, [[1.2, 6.0], [8.4, 14.6]])
bays(WING, [33.8, 12.5], [66.9, 12.5], [0, 1], 6.2, 3.0, [[8.4, 14.6]])
bays(WING, [33.8, 29.3], [66.9, 29.3], [0, -1], 6.2, 3.0, [[8.4, 14.6]])
// the link from the tile wings to the east block, under the rotunda
block(WING, 67.0, 80.0, -2.0, 38.0, 0, 18.0, 7)

// ---------------------------------------------------------------------------
// The east block, square to the compass: 18.5 m deep, 58 m long, its east
// front the dwarfs' pediment.
const XB0 = -10, XB1 = 8.5, YB = 29
const BASE = 11.4, LEDGE = 12.0, PLINTH = 12.9, ENT0 = 19.0, ENT1 = 20.4, APEX = 24.0
{
  // walls: red granite base, ochre above (the east front's ochre band is the dwarf zone)
  const c: [number, number][] = [[XB0, -YB], [XB1, -YB], [XB1, YB], [XB0, YB]]
  for (let i = 0; i < 4; i++) {
    const p = c[i], q = c[(i + 1) % 4]
    const o = EAST.D((p[0] + q[0]) / 2 - (XB0 + XB1) / 2, (p[1] + q[1]) / 2)
    quad(granite, [EAST.P(p[0], p[1], 0), EAST.P(q[0], q[1], 0), EAST.P(q[0], q[1], BASE), EAST.P(p[0], p[1], BASE)], o)
    quad(ochre, [EAST.P(p[0], p[1], BASE), EAST.P(q[0], q[1], BASE), EAST.P(q[0], q[1], ENT1), EAST.P(p[0], p[1], ENT1)], o)
  }
  // the gable roof: eaves north and south at the entablature's top, ridge
  // east-west over the middle, tiled
  const ov = 1.0
  const E0 = EAST.P(XB0, -YB - ov, ENT1 - 0.15), E1 = EAST.P(XB1 + ov, -YB - ov, ENT1 - 0.15)
  const N0 = EAST.P(XB0, YB + ov, ENT1 - 0.15), N1 = EAST.P(XB1 + ov, YB + ov, ENT1 - 0.15)
  const R0 = EAST.P(XB0, 0, APEX + 0.1), R1 = EAST.P(XB1 + ov, 0, APEX + 0.1)
  quad(tile, [E0, E1, R1, R0], [0, -1, 4])
  quad(tile, [N1, N0, R0, R1], [0, 1, 4])
  quad(sand, [E0, E1, N1, N0], [0, 0, -1])
  // ledge the dwarfs stand on, and the entablature band they hold up, on all
  // of the east front and returning a little on the ends
  const band = (z0: number, z1: number, d: number) => {
    const A = EAST.P(XB1, -YB - 0.4, z0), B = EAST.P(XB1 + d, -YB - 0.4, z0), Cc = EAST.P(XB1 + d, YB + 0.4, z0), D = EAST.P(XB1, YB + 0.4, z0)
    const up = (v: V3, z: number): V3 => [v[0], v[1], z]
    quad(sand, [B, Cc, up(Cc, z1), up(B, z1)], [1, 0, 0])
    quad(sand, [up(A, z1), up(B, z1), up(Cc, z1), up(D, z1)], [0, 0, 1])
    quad(sand, [A, B, Cc, D], [0, 0, -1])
    quad(sand, [A, B, up(B, z1), up(A, z1)], [0, -1, 0])
    quad(sand, [D, Cc, up(Cc, z1), up(D, z1)], [0, 1, 0])
  }
  band(BASE, LEDGE, 1.9)
  band(ENT0, ENT1, 1.2)
  // the pediment: tympanum on the front plane, raking cornices
  const xp = XB1 + 0.5
  tri(ochre, EAST.P(xp, -YB, ENT1), EAST.P(xp, YB, ENT1), EAST.P(xp, 0, APEX - 0.5), [1, 0, 0])
  for (const s of [1, -1]) {
    const A = EAST.P(XB1 + 1.3, s * (YB + 0.6), ENT1), B = EAST.P(XB1 + 1.3, 0, APEX)
    const A2 = EAST.P(XB1 + 1.3, s * (YB + 0.6), ENT1 + 0.6), B2 = EAST.P(XB1 + 1.3, 0, APEX + 0.6)
    quad(sand, [A, B, B2, A2], [1, 0, 0])
    const Ab = EAST.P(XB1, s * (YB + 0.6), ENT1 + 0.6), Bb = EAST.P(XB1, 0, APEX + 0.6)
    quad(sand, [A2, B2, Bb, Ab], [0, s, 3])
    const Au = EAST.P(XB1, s * (YB + 0.6), ENT1), Bu = EAST.P(XB1, 0, APEX)
    quad(sand, [A, B, Bu, Au], [0, -s, -3])
  }
  // windows: seven bays at 8 m, between 3 m piers. The base: one broad
  // panel a bay over its two storeys; the dwarf zone: a broad window a bay;
  // in the tympanum, a window a bay under the slope.
  const bayY = [-24, -16, -8, 0, 8, 16, 24]
  const at = (y: number, z: number): V3 => EAST.P(XB1 + 0.06, y, z)
  for (const y of bayY) {
    quad(win, [at(y - 2.3, 1.0), at(y + 2.3, 1.0), at(y + 2.3, 10.6), at(y - 2.3, 10.6)], [1, 0, 0])
    quad(win, [at(y - 2.5, 12.6), at(y + 2.5, 12.6), at(y + 2.5, 18.6), at(y - 2.5, 18.6)], [1, 0, 0])
    const slope = (yy: number) => ENT1 + (APEX - 0.5 - ENT1) * (1 - Math.abs(yy) / YB)
    {
      // a window a bay under the raking cornice, its top following the slope
      const tp = (yy: number, z: number): V3 => EAST.P(xp + 0.06, yy, z)
      const ya = y - 2.4, yb = y + 2.4, z0 = ENT1 + 0.3
      const ta = slope(ya) - 0.35, tb = slope(yb) - 0.35
      if (Math.min(ta, tb) > z0 + 0.3) quad(win, [tp(ya, z0), tp(yb, z0), tp(yb, tb), tp(ya, ta)], [1, 0, 0])
    }
  }
  // the north and south ends: bays of the same rhythm
  for (const s of [1, -1] as const) {
    const ae = (x: number, z: number): V3 => EAST.P(x, s * (YB + 0.06), z)
    for (const x of [-5.6, 0, 5.4]) {
      quad(win, [ae(x - 2, 1.0), ae(x + 2, 1.0), ae(x + 2, 10.6), ae(x - 2, 10.6)], [0, s, 0])
      quad(win, [ae(x - 2, 12.6), ae(x + 2, 12.6), ae(x + 2, 18.6), ae(x - 2, 18.6)], [0, s, 0])
    }
  }
  // the block rising behind the pediment, and the rotunda
  block(EAST, -10, 5.5, -14, 14.5, ENT1 - 1, 26.5, 0)
  for (const y of [-9, 0, 9]) {
    const ap = (yy: number, z: number): V3 => EAST.P(5.56, yy, z)
    quad(win, [ap(y - 2.4, 23.4), ap(y + 2.4, 23.4), ap(y + 2.4, 25.4), ap(y - 2.4, 25.4)], [1, 0, 0])
  }
  const [rx, ry] = EAST.P(-14.5, 0, 0)
  const RD = 10.4
  revolve(granite, rx, ry, [[RD, 0], [RD, 8]], 20, false)
  revolve(ochre, rx, ry, [[RD, 8], [RD, 28.4]], 20, false)
  revolve(sand, rx, ry, [[RD, 28.4], [RD + 0.4, 28.6], [RD + 0.4, 29.0], [RD - 1.6, 29.0]], 20, false)
  revolve(granite, rx, ry, [[RD - 1.6, 29.0], [RD - 1.6, 32.0]], 20, false)
  revolve(sand, rx, ry, [[RD + 0.8, 32.0], [RD + 0.8, 33.0], [0.01, 33.0]], 20, false)
  revolve(sand, rx, ry, [[0.01, 32.0], [RD + 0.8, 32.0]], 20, false)
  // the ring of columns round the top
  for (let k = 0; k < 16; k++) {
    const a = (k / 16) * TAU, r = RD - 0.5
    const cx = rx + r * Math.cos(a), cy = ry + r * Math.sin(a)
    const h = 0.45
    const ring = (z: number): V3[] => [[cx - h, cy - h, z], [cx + h, cy - h, z], [cx + h, cy + h, z], [cx - h, cy + h, z]]
    sand.loft([ring(29.0), ring(32.0)])
  }
  // windows round the drum's shaft
  for (let k = 0; k < 10; k++) {
    const a = ((2 * k + 0.5) / 20) * TAU, r = RD * Math.cos(Math.PI / 20) + 0.06
    const P = (s: number, z: number): V3 => [rx + r * Math.cos(a) - s * Math.sin(a), ry + r * Math.sin(a) + s * Math.cos(a), z]
    quad(win, [P(-1.4, 20.6), P(1.4, 20.6), P(1.4, 26.6), P(-1.4, 26.6)], [Math.cos(a), Math.sin(a), 0])
  }
}

// ---------------------------------------------------------------------------
// The dwarfs. Each stands on the ledge in front of a pier, arms raised to
// the entablature: boots, a round robe, a big head, a pointed cap, two arms.
// Bold simple figures, 5.8 m (19 ft) to the hands.
function dwarf(x: number, y: number, z: number, k = 1, belly = 1) {
  const P = (a: number, b: number, c: number): V3 => [x + a * k, y + b * k, z + c * k]
  const ring = (r: number, c: number, n = 8, sx = 1, dx = 0): V3[] => Array.from({ length: n }, (_, i) => P(dx + r * sx * Math.cos((i / n) * TAU), r * Math.sin((i / n) * TAU), c))
  // boots
  for (const s of [-1, 1]) {
    const b = (c: number): V3[] => [P(-0.5, s * 0.55 - 0.45, c), P(0.95, s * 0.55 - 0.45, c), P(0.95, s * 0.55 + 0.45, c), P(-0.5, s * 0.55 + 0.45, c)]
    sand.loft([b(0), b(0.5)])
    sand.cap(b(0.5), true)
  }
  // robe and body, fuller at the belly
  sand.loft([ring(1.1, 0.45), ring(1.3 * belly, 1.4, 8, 1, 0.1), ring(1.25 * belly, 2.4, 8, 1, 0.15), ring(0.95, 3.2)])
  // a big head with the beard bulging forward and down
  sand.loft([ring(0.95, 3.2, 8, 1.15, 0.2), ring(1.05, 3.7, 8, 1.1, 0.15), ring(1.0, 4.3), ring(0.65, 4.75)])
  // cap: a cone leaning back
  const capBase = ring(0.85, 4.55)
  const tip = P(-0.9, 0, 6.0)
  for (let i = 0; i < 8; i++) tri(sand, capBase[i], capBase[(i + 1) % 8], tip, sub(add(capBase[i], capBase[(i + 1) % 8]), mul(P(0, 0, 4.55), 2)))
  // arms: from the shoulders up and out to the hands under the entablature
  for (const s of [-1, 1]) {
    const sh: V3 = [0, s * 1.0, 2.9], el: V3 = [0.15, s * 2.15, 4.2], hand: V3 = [0.15, s * 1.95, 6.1]
    const w = 0.4
    const sec = (c: V3): V3[] => [P(c[0] - w, c[1] - w, c[2]), P(c[0] + w, c[1] - w, c[2]), P(c[0] + w, c[1] + w, c[2]), P(c[0] - w, c[1] + w, c[2])]
    sand.loft([sec(sh), sec(el), sec(hand)])
    sand.cap(sec(hand), true)
  }
}
{
  const xf = EB.x + XB1 + 1.1
  const pier = [-20, -12, -4, 4, 12, 20]
  pier.forEach((y, i) => {
    // each stands on a small plinth on the ledge
    const ring = (z: number): V3[] => [[xf - 0.9, EB.y + y - 1.1, z], [xf + 0.9, EB.y + y - 1.1, z], [xf + 0.9, EB.y + y + 1.1, z], [xf - 0.9, EB.y + y + 1.1, z]]
    ochre.loft([ring(LEDGE), ring(PLINTH)])
    ochre.cap(ring(PLINTH), true)
    dwarf(xf, EB.y + y, PLINTH, 1.0, i === 1 ? 1.15 : 1)
  })
  // Dopey, alone in the pediment's middle, on the entablature
  dwarf(EB.x + XB1 + 0.95, EB.y, ENT1, 0.7)
}

// ---------------------------------------------------------------------------
// Palette, from daylight photos pulled to palette lightness: ochre walls,
// the red granite base, sandstone cornices and the dwarfs (they are cast in
// the same warm pink-tan), clay tile roofs (`terracotta`), the vaults' and
// flat roofs' grey metal (`roof`), windows `window`.
const parts = [
  { part: ochre, material: finish('team-disney-ochre', 0xe6cc8c) },
  { part: granite, material: finish('team-disney-granite', 0xc98a7c) },
  { part: sand, material: finish('team-disney-sandstone', 0xebbba6) },
  { part: tile, material: PALETTE.terracotta },
  { part: grey, material: PALETTE.roof },
  { part: win, material: PALETTE.window },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
for (const { part, material } of parts) console.log(material.name.padEnd(24), part.triangles)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Team Disney – The Michael D. Eisner Building', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  bearing: 0, osm: 'relation/6385468',
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const outPath = new URL('../models/la-team-disney.glb', import.meta.url).pathname
await Bun.write(outPath, glb)
console.log(`${outPath}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
