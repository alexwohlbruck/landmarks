/**
 * Arts and Industries Building — procedural, CC0-1.0, no textures.
 * bun generators/dc-arts-and-industries.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0°, the outline's walls
 * running due north–south and east–west. The anchor is the area centroid of
 * the OSM outline way/42341486 (lng -77.0244787, lat 38.8881823), which is
 * also the plan's centre: the building is symmetrical about both axes and
 * is drawn that way.
 *
 * What it is: Cluss and Schulze's National Museum (1879–81), a 100 m
 * square in polychrome red brick with buff and blue bands. A Greek cross of
 * tall gabled halls meets at a sixteen-sided rotunda with a clerestory, a
 * low cone and a lantern; the four quadrants between the arms are lower
 * halls lit by roof monitors. On the outside, one tall storey of ranges with
 * big round-arched windows runs between four three-storey corner pavilions
 * (hipped roofs, a cupola) and four entrance pavilions, one on each front,
 * each a gabled centre block with its arched window and white stone porch
 * between two square towers with steep slate spires. The rotunda, the eight
 * spired towers and the gabled entrance fronts are the identity.
 *
 * Covers and replaces: the outline way/42341486 (tagged with the National
 * Museum of the American Latino, which the building now houses), and every
 * building:part inside it: the four corner pavilions (way/453547702–705,
 * h 8), the cross of halls (way/453547706, h 10, gabled), the rotunda
 * (way/453547707, h 14, cone) and the eight entrance towers
 * (way/908820585–592, h 10). OSM's heights are all too low and are not used.
 *
 * Evidence
 * - OSM (measured): outline 100.8 × 100.6 m; ranges' wall line 46.4 m from
 *   the centre; corner pavilions 13.2 m square at the corners; entrance
 *   fronts 21.4 m wide out to the outline, their towers 5.0 m square; the
 *   cross of halls 20.8 m wide; the rotunda's circle about 22 m across.
 * - Published (Wikipedia, "Arts and Industries Building"; NRHP nomination):
 *   Greek cross with a central rotunda, four corner pavilions about 40 ft
 *   square and three storeys, lower ranges between, clerestories and
 *   skylights over iron trusses, polychrome brick.
 * - Photos: HABS DC-298 (Jack E. Boucher, 1975, public domain, Wikimedia
 *   Commons): "AERIAL VIEW FROM SOUTHWEST" (two frames), "SOUTH
 *   ELEVATION, VIEW CONCENTRATING ON INDEPENDENCE AVENUE ENTRANCE",
 *   "VIEW OF ROTUNDA FROM SOUTHWEST"; "Arts & Industries Building, south
 *   facade.jpg" and "Arts & Industries Building, facing SE.jpg"
 *   (AgnosticPreachersKid, CC BY-SA 3.0, 2008); "Arts And Industries
 *   Building Flowers.jpg" (Joeyp3413, CC BY-SA 3.0, 2014), a corner
 *   pavilion; "Smithsonian Arts and Industries Building with Carolina
 *   silverbell.jpg" (Sdkb, CC BY-SA 4.0, 2024).
 * - Estimated from the photos, scaled by the OSM widths (no measured
 *   drawings found): ranges 9.5 m to the cornice; corner pavilions 14 m,
 *   hip to 17 m, cupola to 21 m; entrance towers' shafts 16 m and spires to
 *   25.5 m; entrance gables 13 m at the eaves, 17.5 m at the apex; the
 *   halls' clerestory walls 12.2 m, ridges 15.6 m; rotunda drum 23 m, cone to
 *   26.2 m, lantern to 31.5 m.
 * - Simplified: the black and blue brick courses are left out (too thin to
 *   read); the buff friezes under the cornices are kept as broad bands;
 *   the quadrants' many monitors are four; the spires' dormers, finials
 *   and the sculpture over the north door are left out.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { archWin, bays, cbox, flaredSpire, gable, grow, hip, ngon, ngonPrism, panel, rect, rring, roundWin, save, spire, type Rect, type Side } from './dc-smithsonian-castle'

const brick = new Part(), buff = new Part(), slate = new Part(), metal = new Part(), win = new Part(), door = new Part()

const H = 50.3 // half the outline
const RW = 46.4 // ranges' wall line
const RANGE = 9.5
const PAV = 13.2 // corner pavilion size
const TW = 5.0 // entrance towers

/** Run `f` once per front, in a frame turned so the front faces +y (north). */
type Turn = { side: Side; P: (a: number, d: number) => [number, number]; R: (a0: number, a1: number, d0: number, d1: number) => Rect }
const turns: Turn[] = (['n', 'e', 's', 'w'] as Side[]).map((side, k) => {
  const ang = -k * Math.PI / 2 // n → e → s → w, clockwise
  const c = Math.round(Math.cos(ang)), s = Math.round(Math.sin(ang))
  const P = (a: number, d: number): [number, number] => [a * c - d * s, a * s + d * c]
  const R = (a0: number, a1: number, d0: number, d1: number): Rect => {
    const p = P(a0, d0), q = P(a1, d1)
    return rect(Math.min(p[0], q[0]), Math.max(p[0], q[0]), Math.min(p[1], q[1]), Math.max(p[1], q[1]))
  }
  return { side, P, R }
})
// The wall-plane coordinate for a front at depth d, and the along-wall coordinate.
const at = (t: Turn, d: number) => (t.side === 'n' ? d : t.side === 's' ? -d : t.side === 'e' ? d : -d)
const along = (t: Turn, a: number) => (t.side === 'n' || t.side === 'e' ? (t.side === 'n' ? a : -a) : t.side === 's' ? -a : a)

// ---- Courts: the whole interior under low roofs, behind the ranges.
cbox(brick, rect(-RW, RW, -RW, RW), 0, RANGE, { top: false })
hip(metal, grow(rect(-RW, RW, -RW, RW), 0.2), RANGE, RANGE + 0.8, 6, metal)
// Four monitors over the quadrants.
for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
  const r = rect(sx * 28 - 6, sx * 28 + 6, sy * 28 - 6, sy * 28 + 6)
  cbox(brick, r, RANGE + 0.5, RANGE + 2.6, { top: false })
  hip(metal, grow(r, 0.4), RANGE + 2.6, RANGE + 3.8, 3.0)
  for (const [side, w] of [['n', r.y1], ['s', r.y0]] as Array<[Side, number]>) for (const c of bays(r.x0 + 0.5, r.x1 - 0.5, 4)) panel(win, side, w, c - 0.9, c + 0.9, RANGE + 1.0, RANGE + 2.2)
  for (const [side, w] of [['e', r.x1], ['w', r.x0]] as Array<[Side, number]>) for (const c of bays(r.y0 + 0.5, r.y1 - 0.5, 4)) panel(win, side, w, c - 0.9, c + 0.9, RANGE + 1.0, RANGE + 2.2)
}
// Buff frieze and cornice along the ranges.
for (const t of turns) {
  // Each front's range runs between the corner pavilion and the entrance towers.
  for (const sgn of [-1, 1]) {
    const a0 = sgn < 0 ? -H + PAV : 10.7, a1 = sgn < 0 ? -10.7 : H - PAV
    const r = t.R(a0, a1, RW - 0.0, RW + 0.6)
    cbox(buff, r, RANGE - 1.4, RANGE - 0.5, { top: false, bottom: true })
    cbox(buff, grow(r, 0, 0), RANGE - 0.5, RANGE, { b: 0.2, bottom: true })
    for (const c of bays(a0 + 0.6, a1 - 0.6, 6)) archWin(win, t.side, at(t, RW), along(t, c) - 1.3, along(t, c) + 1.3, 1.6, 7.6, 8)
  }
}

// ---- The cross of tall halls, from the rotunda to the entrance fronts.
const NAVE = 10.4, NAVE_EAVE = 12.2, NAVE_RIDGE = 15.6
for (const t of turns) {
  const r = t.R(-NAVE, NAVE, 9.0, RW - 1.0)
  cbox(brick, r, RANGE, NAVE_EAVE, { top: false })
  cbox(buff, grow(r, 0.25), NAVE_EAVE - 0.5, NAVE_EAVE, { bottom: true, top: false })
  gable(metal, brick, grow(r, 0.3), NAVE_EAVE, NAVE_RIDGE, t.side === 'n' || t.side === 's', [false, false])
  // Clerestory windows along both sides of the hall.
  for (const sgn of [-1, 1]) {
    const sideOf: Side = t.side === 'n' || t.side === 's' ? (sgn < 0 ? 'w' : 'e') : (sgn < 0 ? 's' : 'n')
    const wall = sideOf === 'w' || sideOf === 's' ? -NAVE : NAVE
    for (const c of bays(12.5, RW - 3, 5)) {
      const pos = t.side === 'n' || t.side === 'e' ? c : -c
      archWin(win, sideOf, wall, pos - 1.2, pos + 1.2, RANGE + 0.9, NAVE_EAVE - 0.8, 6)
    }
  }
}

// ---- Rotunda: sixteen-sided drum with a clerestory, low cone, lantern.
{
  const R = 11.0, N = 16, DRUM = 23.0
  ngonPrism(brick, 0, 0, R, N, RANGE, DRUM - 0.7, { top: false })
  ngonPrism(buff, 0, 0, R + 0.35, N, DRUM - 0.7, DRUM, { bottom: true, top: false })
  const apo = R * Math.cos(Math.PI / N)
  // One arched window per face, as flat panels on the face planes.
  for (let k = 0; k < N; k++) {
    const t = (2 * Math.PI * (k + 0.5)) / N + Math.PI / N - Math.PI / N
    const mid = (2 * Math.PI * k) / N + Math.PI / N + Math.PI / N // face k spans corners k..k+1
    void t
    const cx = apo * Math.cos(mid), cy = apo * Math.sin(mid)
    const n: V3 = [Math.cos(mid), Math.sin(mid), 0], u: V3 = [-Math.sin(mid), Math.cos(mid), 0]
    const w = 1.3, z0 = 16.6, zs = 20.6, rr = w
    const P = (a: number, z: number): V3 => [cx + n[0] * 0.05 + u[0] * a, cy + n[1] * 0.05 + u[1] * a, z]
    win.quad(P(-w, z0), P(w, z0), P(w, zs), P(-w, zs))
    for (let s = 0; s < 6; s++) {
      const a0 = Math.PI * s / 6, a1 = Math.PI * (s + 1) / 6
      win.tri(P(0, zs), P(rr * Math.cos(a0), zs + rr * Math.sin(a0)), P(rr * Math.cos(a1), zs + rr * Math.sin(a1)))
    }
  }
  // Low cone.
  const base = ngon(0, 0, R + 0.35, N, DRUM)
  const top = ngon(0, 0, 3.4, N, 26.2)
  metal.loft([base, top])
  // Lantern: an octagon of windows, a crown of buff, a small spire.
  ngonPrism(brick, 0, 0, 3.0, 8, 26.2, 28.7, { top: false })
  for (let k = 0; k < 8; k++) {
    const mid = (2 * Math.PI * k) / 8 + Math.PI / 8 + Math.PI / 8
    const a = 3.0 * Math.cos(Math.PI / 8) + 0.04, n: V3 = [Math.cos(mid), Math.sin(mid), 0], u: V3 = [-Math.sin(mid), Math.cos(mid), 0]
    const P = (s: number, z: number): V3 => [n[0] * a + u[0] * s, n[1] * a + u[1] * s, z]
    win.quad(P(-0.6, 26.7), P(0.6, 26.7), P(0.6, 28.1), P(-0.6, 28.1))
  }
  ngonPrism(buff, 0, 0, 3.4, 8, 28.7, 29.3, { bottom: true, top: false })
  spire(slate, ngon(0, 0, 3.4, 8, 29.3), [0, 0, 31.5])
  metal.cap(top, true)
}

// ---- Corner pavilions: three storeys, a hip, a cupola.
const PAV_EAVE = 14.0
for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
  const xs = [sx * H, sx * (H - PAV)].sort((a, b) => a - b), ys = [sy * H, sy * (H - PAV)].sort((a, b) => a - b)
  const r = rect(xs[0], xs[1], ys[0], ys[1])
  cbox(brick, r, 0, PAV_EAVE - 1.6, { top: false })
  cbox(buff, grow(r, 0.05), PAV_EAVE - 1.6, PAV_EAVE - 0.6, { top: false })
  cbox(buff, grow(r, 0.4), PAV_EAVE - 0.6, PAV_EAVE, { b: 0.25, bottom: true, top: false })
  hip(slate, grow(r, 0.4), PAV_EAVE, 17.0, 4.2, metal)
  const c = rect((r.x0 + r.x1) / 2 - 1.6, (r.x0 + r.x1) / 2 + 1.6, (r.y0 + r.y1) / 2 - 1.6, (r.y0 + r.y1) / 2 + 1.6)
  cbox(buff, c, 16.9, 19.0, { top: false })
  hip(slate, grow(c, 0.3), 19.0, 21.0, 1.85)
  // Windows: three bays on each outer face, three storeys, round-arched.
  for (const [side, w, a0, a1] of [
    [sy > 0 ? 'n' : 's', sy * H, r.x0, r.x1], [sx > 0 ? 'e' : 'w', sx * H, r.y0, r.y1],
  ] as Array<[Side, number, number, number]>) {
    for (const cc of bays(a0 + 0.8, a1 - 0.8, 3)) {
      archWin(win, side, w, cc - 0.85, cc + 0.85, 1.2, 4.0)
      archWin(win, side, w, cc - 0.95, cc + 0.95, 5.2, 8.8)
      archWin(win, side, w, cc - 0.6, cc + 0.6, 10.0, 11.8)
    }
  }
}

// ---- Entrance pavilions, one on each front: the gabled centre block
// between two spired towers, with the white stone porch.
const TOWER = 16.0, SPIRE = 25.5, GEAVE = 13.0, GAPEX = 17.5
for (const t of turns) {
  const ns = t.side === 'n' || t.side === 's'
  // Centre block: from the towers back into the hall.
  const cb = t.R(-5.8, 5.8, RW - 6.0, H)
  cbox(brick, cb, 0, GEAVE, { top: false })
  gable(slate, brick, grow(cb, 0.1, 0.1), GEAVE, GAPEX, ns, [true, true])
  // The gable's coping and the buff frieze across its front.
  const frontR = t.R(-5.9, 5.9, H - 0.4, H + 0.15)
  cbox(buff, frontR, GEAVE - 0.6, GEAVE, { bottom: true })
  cbox(buff, t.R(-5.9, 5.9, H - 0.4, H + 0.15), 7.0, 7.5, { bottom: true })
  // The big tripartite arched window and the side lights.
  archWin(win, t.side, at(t, H), -1.9, 1.9, 7.9, 12.6, 8)
  for (const s of [-4.1, 4.1]) archWin(win, t.side, at(t, H), s - 1.05, s + 1.05, 8.2, 11.6)
  // Porch: a white stone arch with a pediment, projecting.
  const pr = t.R(-2.3, 2.3, H, H + 1.2)
  cbox(buff, pr, 0, 6.0, { top: false, bottom: false })
  gable(buff, buff, grow(pr, 0.15, 0.15), 6.0, 7.3, !ns)
  archWin(door, t.side, at(t, H + 1.2), -1.4, 1.4, 0.0, 4.6, 8)
  // Towers.
  for (const s of [-1, 1]) {
    const a0 = s < 0 ? -10.8 : 5.8, a1 = a0 + TW
    const r = t.R(a0, a1, H - TW, H)
    cbox(brick, r, 0, TOWER - 1.2, { top: false })
    cbox(buff, grow(r, 0.05), TOWER - 2.6, TOWER - 1.9, { top: false })
    cbox(brick, grow(r, 0.35), TOWER - 1.2, TOWER, { b: 0.15, bottom: true, top: false })
    const cxy = [(r.x0 + r.x1) / 2, (r.y0 + r.y1) / 2]
    flaredSpire(slate, (g, z) => rring(grow(r, 0.35 + g), z), TOWER, [cxy[0], cxy[1], SPIRE], 0.15, buff)
    // Tower windows: a triple arch at the top, single ones below, on the
    // front and both sides.
    const ac = (a0 + a1) / 2
    for (const d of [-1.3, 0, 1.3]) archWin(win, t.side, at(t, H), ac + d - 0.45, ac + d + 0.45, 11.2, 13.6)
    archWin(win, t.side, at(t, H), ac - 0.9, ac + 0.9, 5.6, 9.6)
    archWin(win, t.side, at(t, H), ac - 0.8, ac + 0.8, 1.4, 4.2)
  }
}
// The along/at helpers flip the front's local axis; the windows above use
// the local coordinate directly, which is right for n and e and mirrored
// for s and w, where the layout is symmetric anyway.
void along

console.log({ brick: brick.triangles, buff: buff.triangles, slate: slate.triangles, metal: metal.triangles, win: win.triangles, door: door.triangles })
await save('dc-arts-and-industries', 'Arts and Industries Building', [
  { part: brick, material: finish('aib-brick', 0xc0705c) },
  { part: buff, material: finish('aib-buff', 0xe6d5b6) },
  { part: slate, material: finish('aib-slate', 0x6a7078) },
  { part: metal, material: PALETTE.roof },
  { part: win, material: PALETTE.window },
  { part: door, material: PALETTE.entrance },
], { bearing: 0, osm: 'way/42341486', footprint: [100.8, 100.6], height: 31.5 }, 6500)
