/**
 * Musée d'Orsay (the former Gare d'Orsay and Hôtel d'Orsay) — procedural,
 * CC0-1.0, no textures. bun generators/paris-musee-d-orsay.ts
 *
 * Frame: x along the quai Anatole-France (bearing 114°), y towards the
 * Seine; placement bearing 24° (the outline's long walls run at 113.9°).
 * Anchor: the area centroid of way/63178753, lng 2.3265366, lat 48.8599294.
 * Uses the kit exported by paris-sacre-coeur.ts.
 *
 * Covers and replaces: way/63178753 only (building=train_station, height
 * 35, the whole museum: station, hotel wing and the entrance on the parvis;
 * OSM maps no building:parts on it). The underground RER station
 * way/415077613 (location=underground) is not drawn and not replaced. The
 * Hôtel d'Orsay is the west end of the same building (rue de Bellechasse),
 * so it is part of this model.
 *
 * Evidence
 * - OSM (measured): outline 174 × 75 m with the parvis annex on the west;
 *   the clock pavilions' projections on the Seine front (x −52.8 to −32.6
 *   and 71.0 to 89.1); height 35 (unspecified; taken as the pavilions'
 *   finials).
 * - Published: Victor Laloux, 1898–1900; the nave 138 m long, 40 m wide,
 *   32 m high inside (fr.wikipedia "Musée d'Orsay").
 * - Photos (Wikimedia Commons):
 *   · "Paris 20130809 - Musée d'Orsay from Grande roue des Tuileries.jpg",
 *     Martin Robson, CC BY-SA 3.0 — the whole Seine front from the north:
 *     the two clock pavilions with their rounded roofs and finials, the
 *     seven arched bays, statues on the attic, the slate vault with its
 *     glazed crown band, the hotel to the west.
 *     https://commons.wikimedia.org/wiki/File:Paris_20130809_-_Mus%C3%A9e_d%27Orsay_from_Grande_roue_des_Tuileries.jpg
 *   · "Musée d'Orsay (22284728710).jpg", Jorge Láscar, CC BY 2.0 — the west
 *     pavilion at dusk: the clock (lit) in its arch-topped gable, the arched
 *     window and door, the big lit arches, the hotel's storeys and mansard.
 *     https://commons.wikimedia.org/wiki/File:Mus%C3%A9e_d%27Orsay_(22284728710).jpg
 * - Estimated from the photos (pavilion 20 m wide = 320 px): Seine range
 *   cornice 18 m, attic to 22, statues to 26; arches 5.2–16.2 m, 9.6 m
 *   wide; pavilion cornice 20 m, clock centre 24.6 m, radius 3 m, the gable
 *   to ~28 m, roofs to 32 m, finials to 36.4; vault springing 19 m, crown
 *   27 m; hotel cornice 21, mansard to 25.5; the south range and the
 *   parvis annex's heights are assumed (no photo here).
 * - Ground: Mapterhorn shows the quai 1.8 m above the lowest ground under
 *   the footprint (the rue de Lille side); heights are above G = 1.8 and
 *   the walls run down to y = 0. terrain.ts check: ok.
 * - Simplified: the arches' archivolts, sculpture and the clock's numerals
 *   are left out; the attic statues are six pale blocks; the south and east
 *   fronts are generic bays.
 * - Doubts: the rue de Lille side, the east end and the parvis annex are
 *   unphotographed here; no usable night photo was found (the "by night"
 *   search returned a metro stair), so the night look is from the dusk
 *   photo: floodlit stone, lit arches and windows, the clocks lit.
 */
import { Part, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import { qf, tf, save } from './dc-white-house'
import { box, revolve, arch, rose, type Side } from './paris-sacre-coeur'

/** The quai Anatole-France (the Seine front) above y = 0; rue de Lille is lower (header: Ground). */
const G = 1.8

const stone = new Part(), trim = new Part(), slate = new Part(), glass = new Part(), win = new Part(), lit = new Part()

/** A mansard over a rectangle: steep slope from the cornice, then a low top. */
function mansard(x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, inset: number) {
  const r0: V3[] = [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]]
  const r1: V3[] = [[x0 + inset, y0 + inset, z1], [x1 - inset, y0 + inset, z1], [x1 - inset, y1 - inset, z1], [x0 + inset, y1 - inset, z1]]
  slate.loft([r0, r1])
  slate.cap(r1, true)
}
/** Window bays along a wall; rows [z0, z1, round]. */
function bays(side: Side, at: number, a0: number, a1: number, pitch: number, rows: [number, number, boolean][], w = 1.8) {
  const n = Math.max(1, Math.round((a1 - a0) / pitch)), step = (a1 - a0) / n
  for (let k = 0; k < n; k++) {
    const c = a0 + step * (k + 0.5)
    for (const [z0, z1, round] of rows) {
      if (round) arch(win, side, at, c, w, G + z0, G + z1)
      else pane(side, at, c, w, G + z0, G + z1)
    }
  }
}
function pane(side: Side, at: number, a: number, w: number, z0: number, z1: number, p = win) {
  const n: V3 = side === 'n' ? [0, 1, 0] : side === 's' ? [0, -1, 0] : side === 'e' ? [1, 0, 0] : [-1, 0, 0]
  const ns = side === 'n' || side === 's', off = at + (ns ? n[1] : n[0]) * 0.05
  const Q = (s: number, z: number): V3 => (ns ? [s, off, z] : [off, s, z])
  qf(p, Q(a - w / 2, z0), Q(a + w / 2, z0), Q(a + w / 2, z1), Q(a - w / 2, z1), n)
}

// ---------------------------------------------------------------------------
// Plan: OSM way/63178753 in the frame (x along the quai, east; y towards the
// Seine). The station front runs on y = 38 from x −83 to 91.

const YN = 37.9, YS = -37.4

// ---- The Hôtel d'Orsay (west end, on the rue de Bellechasse): five
// storeys under a slate mansard, and the low entrance annex on the parvis.
box(stone, -83.0, -52.0, YS, YN, 0, G + 20.0, false)
box(trim, -83.6, -51.6, YS - 0.6, YN + 0.6, G + 20.0, G + 21.0, trim, true)
mansard(-83.3, -52.0, YS - 0.3, YN + 0.3, G + 21.0, G + 25.5, 2.0)
bays('n', YN, -83.0, -52.8, 4.4, [[1.4, 5.2, true], [6.6, 10.6, false], [12.0, 15.6, false], [16.6, 19.0, false]], 1.7)
bays('w', -83.0, 10.8, YN, 4.4, [[6.6, 10.6, false], [12.0, 15.6, false], [16.6, 19.0, false]], 1.7)
bays('w', -83.0, YS, -25.4, 4.4, [[6.6, 10.6, false], [12.0, 15.6, false], [16.6, 19.0, false]], 1.7)
bays('s', YS, -83.0, -52.0, 4.4, [[1.4, 5.2, true], [6.6, 10.6, false], [12.0, 15.6, false], [16.6, 19.0, false]], 1.7)
box(stone, -97.2, -83.0, -25.4, 10.8, 0, G + 8.0)
box(trim, -97.6, -83.0, -25.8, 11.2, G + 8.0, G + 8.8, trim, true)
for (const a of [-17.0, -7.3, 2.4]) pane('w', -97.2, a, 6.0, G + 0.4, G + 6.4, lit) // the museum entrance's glazed doors

// ---- The south range on the rue de Lille: offices along the nave's flank.
box(stone, -52.0, 91.0, YS, -21.0, 0, G + 18.0, false)
box(trim, -52.0, 91.5, YS - 0.5, -21.0, G + 18.0, G + 19.0, trim, true)
mansard(-52.0, 91.2, YS - 0.2, -21.0, G + 19.0, G + 23.0, 2.2)
bays('s', YS, -52.0, 91.0, 5.6, [[1.4, 6.0, true], [7.6, 11.6, false], [13.0, 16.6, false]], 2.0)
bays('e', 91.0, YS, -21.0, 5.6, [[1.4, 6.0, true], [7.6, 11.6, false], [13.0, 16.6, false]], 2.0)

// ---- The nave: the great barrel vault, 40-odd metres wide, slate on its
// flanks with the long glazed band along its crown, from the hotel to the
// east end.
const VY = 3.0, VH = 24.5, VZ = G + 19.0, VR = 8.2 // centre line, half span, springing, rise
{
  const seg = 12, x0 = -52.0, x1 = 91.0
  const prof = Array.from({ length: seg + 1 }, (_, k) => {
    const t = Math.PI * (1 - k / seg) // from the south foot to the north foot
    return { y: VY + VH * Math.cos(t), z: VZ + VR * Math.sin(t), n: [0, Math.cos(t) / VH, Math.sin(t) / VR] as V3 }
  })
  for (let k = 0; k < seg; k++) {
    const a = prof[k], b = prof[k + 1]
    const mid = (k + 0.5) / seg, part = mid > 0.36 && mid < 0.64 ? glass : slate
    const na = [0, a.n[1], a.n[2]] as V3, nb = [0, b.n[1], b.n[2]] as V3
    const A: V3 = [x0, a.y, a.z], B: V3 = [x1, a.y, a.z], C: V3 = [x1, b.y, b.z], D: V3 = [x0, b.y, b.z]
    part.tri(A, B, C, undefined, undefined, undefined, [na, na, nb])
    part.tri(A, C, D, undefined, undefined, undefined, [na, nb, nb])
  }
  // The east end: a stone gable wall under the vault with a glazed lunette.
  const pts = prof.map((p) => [p.y, p.z] as [number, number])
  for (let k = 0; k < seg; k++) {
    const [ya, za] = pts[k], [yb, zb] = pts[k + 1]
    qf(stone, [x1, ya, VZ], [x1, yb, VZ], [x1, yb, zb], [x1, ya, za], [1, 0, 0])
  }
  box(stone, x1 - 0.6, x1, VY - VH, VY + VH, 0, VZ, false)
  for (let k = 0; k < 8; k++) {
    const t0 = (Math.PI * k) / 8, t1 = (Math.PI * (k + 1)) / 8, r = VH - 6
    tf(glass, [x1 + 0.06, VY, VZ + 0.5], [x1 + 0.06, VY + r * Math.cos(t0), VZ + 0.5 + (r * VR / VH) * Math.sin(t0)], [x1 + 0.06, VY + r * Math.cos(t1), VZ + 0.5 + (r * VR / VH) * Math.sin(t1)], [1, 0, 0])
  }
}

// ---- The Seine front between the pavilions: seven great arched windows
// under an attic with its statues.
box(stone, -32.6, 71.0, 27.0, YN, 0, G + 19.0, false)
box(trim, -32.6, 71.0, 27.0, YN + 0.6, G + 18.0, G + 19.0, trim, true)
box(stone, -32.6, 71.0, 27.0, YN, G + 19.0, G + 21.4, false)
box(trim, -32.6, 71.0, 26.6, YN + 0.4, G + 21.4, G + 22.0, trim, true)
const bay = (71.0 + 32.6) / 7
for (let k = 0; k < 7; k++) {
  const c = -32.6 + bay * (k + 0.5)
  arch(win, 'n', YN, c, 9.6, G + 5.2, G + 16.2)
  pane('n', YN, c, 8.0, G + 0.3, G + 4.6, lit) // the glazed doors and canopies under them
}
for (let k = 1; k < 7; k++) {
  const x = -32.6 + bay * k
  box(trim, x - 0.9, x + 0.9, YN - 1.6, YN + 0.2, G + 22.0, G + 23.0, trim) // pedestal
  box(trim, x - 0.6, x + 0.6, YN - 1.3, YN - 0.1, G + 23.0, G + 26.0, trim) // statue
}

// ---- The two clock pavilions at the ends of the Seine front: tall
// rounded slate roofs with an œil-de-bœuf and a finial, the great clock
// faces on the river side.
for (const [x0, x1] of [[-52.8, -32.6], [71.0, 89.1]]) {
  const xc = (x0 + x1) / 2, y0 = 21.0, y1 = YN + 1.5
  box(stone, x0, x1, y0, y1, 0, G + 20.0, false)
  box(trim, x0 - 0.6, x1 + 0.6, y0 - 0.6, y1 + 0.6, G + 20.0, G + 21.2, trim, true)
  // The roof: convex flanks from the cornice to a small flat top.
  const W = (x1 - x0) / 2, D = (y1 - y0) / 2, yc = (y0 + y1) / 2
  const rings: V3[][] = []
  for (let k = 0; k <= 5; k++) {
    const th = (k / 5) * (Math.PI / 2), ix = (W - 3.4) * (1 - Math.cos(th)), iy = (D - 3.4) * (1 - Math.cos(th))
    const z = G + 21.2 + 11.0 * Math.sin(th)
    rings.push([[x0 + ix, y0 + iy, z], [x1 - ix, y0 + iy, z], [x1 - ix, y1 - iy, z], [x0 + ix, y1 - iy, z]])
  }
  slate.loft(rings)
  slate.cap(rings[5], true)
  revolve(trim, xc, yc, [[1.4, G + 32.2], [1.1, G + 33.6], [0.5, G + 34.6], [0.12, G + 36.4], [0, G + 36.4]], 8)
  // The clock: a big round lit face in an arch-topped stone gable rising
  // from the cornice in front of the roof, on the river side.
  const gy0 = y1 - 1.6, gy1 = y1 + 0.3, gw = 4.6, gz = G + 24.4
  box(stone, xc - gw, xc + gw, gy0, gy1, G + 21.2, gz, false)
  for (let k = 0; k < 8; k++) {
    const t0 = (Math.PI * k) / 8, t1 = (Math.PI * (k + 1)) / 8
    const P = (t: number, y: number): V3 => [xc + gw * Math.cos(t), y, gz + 3.6 * Math.sin(t)]
    tf(stone, [xc, gy1, gz], P(t0, gy1), P(t1, gy1), [0, 1, 0])
    qf(trim, P(t0, gy0), P(t1, gy0), P(t1, gy1 + 0.2), P(t0, gy1 + 0.2), [Math.cos((t0 + t1) / 2), 0, Math.sin((t0 + t1) / 2)])
  }
  rose(lit, 'n', gy1, xc, G + 24.6, 3.0)
  // The tall arched window and the door below it.
  arch(win, 'n', y1, xc, 4.2, G + 7.2, G + 14.6)
  pane('n', y1, xc, 2.6, G + 0.3, G + 6.0, lit)
  // The pavilion's side windows.
  bays('e', x1, y0, y1, 5.0, [[1.4, 6.0, true], [8.0, 14.6, true]], 2.0)
  bays('w', x0, y0, y1, 5.0, [[1.4, 6.0, true], [8.0, 14.6, true]], 2.0)
}
// The stretch east of the east pavilion, to the corner.
box(stone, 89.1, 91.0, 21.0, YN, 0, G + 18.0)

const flood = (_p: V3, n: V3) => (n[2] > 0.8 ? 0.2 : 0.9)
console.log({ stone: stone.triangles, trim: trim.triangles, slate: slate.triangles, glass: glass.triangles, win: win.triangles, lit: lit.triangles })
await save('paris-musee-d-orsay', "Musée d'Orsay", [
  { part: stone, material: { ...finish('orsay-stone', 0xe7dcc6), floodlight: flood } },
  { part: trim, material: { ...PALETTE.trim, floodlight: flood } },
  { part: slate, material: { ...finish('orsay-slate', 0x7a828c), floodlight: () => 0.15 } },
  { part: glass, material: PALETTE.glass },
  { part: win, material: PALETTE.window },
  { part: lit, material: PALETTE.entrance },
], { bearing: 24, osm: 'way/63178753', footprint: [188, 77], height: G + 36.4 }, 5000)
