/**
 * OpernTurm, Frankfurt am Main: procedural, CC0-1.0.
 * bun generators/frankfurt-opernturm.ts
 *
 * Christoph Mäckler, 2007-2009: 170 m, 42 storeys, a rectangular tower in
 * pale limestone on the Opernplatz, opposite the Alte Oper, with a five-
 * storey block (the "Blockrand") wrapping it to the east and north.
 *
 * Identity, in order: the pale stone slab, its broad faces split down the
 * middle by a glazed slot; the close vertical stone fins between tall
 * window bays; the open crown, where the fins stand free in front of a
 * recessed top storey under a stone frame; the softly rounded corners; the
 * low pale block beside it.
 *
 * Map frame: built turned, bearing 20.1: local +y faces bearing 20.1 (the
 * long sides), local +x bearing 110.1. Origin: the area centroid of OSM
 * way/117615942 (50.116132, 8.670129). y = 0 is the lowest ground under the
 * footprint.
 *
 * Evidence:
 * - p1 https://commons.wikimedia.org/wiki/File:Opernturm.jpg
 *   Thomas Wolf (Der Wolf im Wald), CC BY 3.0: from the Opernplatz (west),
 *   the whole height, the slot, the crown, the low block below.
 * - p2 https://commons.wikimedia.org/wiki/File:Opernplatz,_Frankfurt,_East_view_20180408_1.jpg
 *   DXR, CC BY-SA 4.0: from the north-west across the Opernplatz.
 * - p3 https://commons.wikimedia.org/wiki/File:Opernturm_Frankfurt_am_Main_2019-09-15_01.jpg
 *   Leonhard Lenz, CC0: the crown: free fins, the recessed top, the frame.
 * - p4 https://commons.wikimedia.org/wiki/File:Opernturm_Frankfurt_am_Main_2019-09-15_02.jpg
 *   Leonhard Lenz, CC0.
 * - p5 https://commons.wikimedia.org/wiki/File:Frankfurt_Opernturm_(Taunusanlage).jpg
 *   Tilman AB, CC0: from the Taunusanlage (south).
 * - p6 https://commons.wikimedia.org/wiki/File:Frankfurt_am_Main,_Alte_Oper_und_Opernturm.jpg
 *   Dguendel, CC BY 3.0.
 * - p7 https://commons.wikimedia.org/wiki/File:Opernturm_bei_Nacht_-_panoramio.jpg
 *   Bohao Zhao, CC BY 3.0: at night, lit windows.
 * - OSM (API, 2026-11): the tower way/117615942 (170 m, 42 levels,
 *   limestone, colour #fafae7): a 33.3 x 52.3 m rectangle with a slot in
 *   the middle of every face (3 m wide and 1.6 m deep on the short faces,
 *   4 m and 1.8 m on the long ones) and its fins drawn on the west face at
 *   2.7 m centres; the block way/317389956 (5 levels, limestone).
 * - Published: 170 m, 42 storeys (de.wikipedia "Opernturm").
 * - No lidar (none in Germany). Look-only: none.
 *
 * Numbers: the plan and the fin spacing are OSM's (measured from its
 * nodes), but the slots are cut 3 m deep, not OSM's 1.6-1.8 m: p1 and p3
 * show them splitting the top into two (estimated from their shadow); fins 0.6 m wide and 0.7 m deep (OSM's west face has 1.0-1.1 m
 * steps; drawn a little slimmer so the bays read). Corner radius 1.5 m
 * (p1, p3: the corners are softened, not sharp). The crown: the top frame
 * 168.6-170 m, the recessed top storeys 162-168.6 m set 2 m back (p3:
 * about two storeys); the long faces' slots cut through the crown, so
 * the top stands as two halves (p1, p3). Window bays grouped two storeys a panel, 1.4 m wide in the 2.7 m bay (4.05 m
 * storeys). The block: 22 m with a top storey set back 2 m to 25.5 m
 * (p1, p2: five storeys and a recessed sixth; estimated).
 * Colours: limestone #ebe3d4 (p1-p3; OSM #fafae7, pulled to the palette's
 * stone); windows a blue slate #7389a0 (p1, p3); the slot glass #6a8096 (p1, p3);
 * roofs grey.
 *
 * Night: windows and slot glass are `window*`.
 *
 * Doubts: the slots on the short faces and the east face are from OSM only
 * (p1-p3 show the west and north-west sides). The red UBS lettering near
 * the top is left out (lettering is kept for famous signs only).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { prism, capRing, face, saveLods, ccw, arc, type XY, type Layer } from './frankfurt-commerzbank-tower'
import { inset } from './chi-aon-center'

const ID = 'frankfurt-opernturm'
const X0 = -16.9, X1 = 16.4, Y0 = -26.2, Y1 = 26.1
const RC = 1.5 // corner radius
const TOP = 170, FRAME = 168.6, CROWN = 162
const STOREY = TOP / 42

const stone = new Part(), win = new Part(), slot = new Part(), roof = new Part()

// the plan, anticlockwise from the south-west corner, with the face slots
// (centre, half-width, depth) on each face
type Face = { a: XY; b: XY; slot: [number, number, number] }
const xm = (X0 + X1) / 2, ym = (Y0 + Y1) / 2
const FACES: Face[] = [
  { a: [X0, Y0], b: [X1, Y0], slot: [-0.3, 1.5, 3.0] }, // south (short)
  { a: [X1, Y0], b: [X1, Y1], slot: [0.0, 2.0, 3.0] }, // east (long)
  { a: [X1, Y1], b: [X0, Y1], slot: [-0.3, 1.5, 3.0] }, // north (short)
  { a: [X0, Y1], b: [X0, Y0], slot: [0.0, 2.0, 3.0] }, // west (long)
]
void xm; void ym

/** A face's frame: unit along, outward normal, length. */
const frame = (f: Face) => {
  const L = Math.hypot(f.b[0] - f.a[0], f.b[1] - f.a[1])
  const u: XY = [(f.b[0] - f.a[0]) / L, (f.b[1] - f.a[1]) / L]
  const n: XY = [u[1], -u[0]]
  const P = (s: number, d = 0): XY => [f.a[0] + u[0] * s + n[0] * d, f.a[1] + u[1] * s + n[1] * d]
  // slot position along the face: its centre is in the frame's own coordinate (x or y)
  const sc = Math.abs(u[0]) > 0.5 ? (u[0] > 0 ? f.slot[0] - f.a[0] : f.a[0] - f.slot[0]) : (u[1] > 0 ? f.slot[0] - f.a[1] : f.a[1] - f.slot[0])
  return { L, u, n, P, sc }
}

function ring(withSlots: boolean, corner = RC): XY[] {
  const out: XY[] = []
  FACES.forEach((f, k) => {
    const { L, P, sc } = frame(f)
    // corner arc at the face's start (centre inset by RC from both faces)
    const prev = FACES[(k + 3) % 4], pn = frame(prev).n, n = frame(f).n
    const c: XY = [f.a[0] - n[0] * corner - pn[0] * corner, f.a[1] - n[1] * corner - pn[1] * corner]
    const a0 = Math.atan2(pn[1], pn[0]), a1 = Math.atan2(n[1], n[0])
    const a1u = a1 < a0 ? a1 + 2 * Math.PI : a1
    out.push(...arc(c, corner, a0, a1u, 3))
    if (withSlots) {
      const [, hw, dp] = f.slot
      out.push(P(sc - hw), P(sc - hw, -dp), P(sc + hw, -dp), P(sc + hw))
    }
    void L
  })
  return out
}

const OUT = ring(true)

// ── the shaft to the crown, the crown, the top frame ──
prism(stone, OUT, 0, CROWN, { top: roof })
/** The part of a cyclic ring on one side of y = cut (sign +1: above), in order. */
function half(r: XY[], sign: number, cut = 2): XY[] {
  const keep = r.map((p) => sign * p[1] >= cut - 1e-6)
  const start = keep.findIndex((k, i) => k && !keep[(i - 1 + r.length) % r.length])
  const out: XY[] = []
  for (let i = 0; i < r.length; i++) { const j = (start + i) % r.length; if (keep[j]) out.push(r[j]) }
  return out
}
// The crown is split in two by the long faces' slots, which run through the
// top: each half has its corner posts, a dark recessed box and the frame.
for (const sign of [1, -1]) {
  const H = half(OUT, sign)
  const ya = sign * 2, yb = sign > 0 ? Y1 : Y0
  const lo = Math.min(ya, yb), hi = Math.max(ya, yb)
  const inner = inset(ccw([[X0, lo], [X1, lo], [X1, hi], [X0, hi]]), 2.0)
  prism(slot, inner, CROWN, FRAME, { top: null })
  for (const cx of [X0, X1]) for (const cy of [lo, hi]) {
    const sx = cx < 0 ? 1 : -1, sy = cy === lo ? 1 : -1
    const post: XY[] = [[cx, cy], [cx + sx * 3.2, cy], [cx + sx * 3.2, cy + sy * 3.2], [cx, cy + sy * 3.2]]
    prism(stone, post, CROWN, FRAME, { top: null })
  }
  prism(stone, H, FRAME, TOP, { top: roof, bottom: stone })
}

// ── fins, window panels and slot glass on each face ──
for (const f of FACES) {
  const { L, n, P, sc } = frame(f)
  const N: V3 = [n[0], n[1], 0]
  const [, hw, dp] = f.slot
  // the slot: glass at its back in three-storey panels, a thin stone line between
  for (let z = 1; z < FRAME - 0.5; z += 3 * STOREY) {
    const z1 = Math.min(z + 3 * STOREY - 0.5, FRAME - 0.2)
    face(slot, [[...P(sc - hw, -dp + 0.05), z], [...P(sc + hw, -dp + 0.05), z], [...P(sc + hw, -dp + 0.05), z1], [...P(sc - hw, -dp + 0.05), z1]] as V3[], N)
  }
  // two runs of bays, one each side of the slot, between the corner and the slot
  for (const [s0, s1] of [[RC + 1.4, sc - hw - 0.3], [sc + hw + 0.3, L - RC - 1.4]]) {
    const span = s1 - s0, nb = Math.max(1, Math.round(span / 2.7)), w = span / nb
    // fins at every bay boundary (and both ends)
    for (let k = 0; k <= nb; k++) {
      const s = s0 + k * w
      const fin: XY[] = [P(s - 0.3, 0), P(s + 0.3, 0), P(s + 0.3, 0.7), P(s - 0.3, 0.7)]
      prism(stone, fin, 7.5, FRAME, { top: stone })
    }
    // window panels between, three storeys each, from the lobby up to the crown
    for (let k = 0; k < nb; k++) {
      const sa = s0 + k * w + 0.65, sb = s0 + (k + 1) * w - 0.65
      for (let z = 8; z < CROWN - 1; z += 2 * STOREY) {
        const za = z + 0.9, zb = Math.min(z + 2 * STOREY - 0.9, CROWN - 0.8)
        face(win, [[...P(sa, 0.05), za], [...P(sb, 0.05), za], [...P(sb, 0.05), zb], [...P(sa, 0.05), zb]] as V3[], N)
      }
      // the lobby: tall glazing to 7 m
      face(win, [[...P(sa, 0.05), 0.4], [...P(sb, 0.05), 0.4], [...P(sb, 0.05), 6.8], [...P(sa, 0.05), 6.8]] as V3[], N)
    }
  }
}

// ── the block (Blockrand) east and north of the tower ──
{
  const BLOCK: XY[] = [[-10.6, 26.0], [-10.7, 28.3], [-13.4, 28.3], [-13.4, 38.0], [11.7, 38.0], [11.6, 40.4], [32.2, 40.3], [32.9, 38.4], [34.5, 31.7], [41.4, 7.4], [53.8, -35.0], [53.9, -36.1], [53.6, -37.3], [53.1, -38.4], [52.1, -39.5], [51.2, -40.2], [49.5, -40.7], [25.4, -41.0], [25.4, -24.3], [16.4, -24.4], [16.4, 26.1]]
  const r = ccw(BLOCK)
  const H = 22, H2 = 25.5
  prism(stone, r, 0, H, { top: roof })
  // a top storey set back from the street fronts: the block's outer edges
  const top = inset(r, 2.0)
  prism(slot, top, H, H2 - 0.6, { top: null })
  prism(stone, top, H2 - 0.6, H2, { top: roof })
  // window panels: storeys in pairs, bays ~3 m
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 4) continue
    // skip the wall against the tower (x = 16.4 between the tower's ends)
    if (Math.abs(a[0] - 16.4) < 0.2 && Math.abs(b[0] - 16.4) < 0.2) continue
    const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: V3 = [u[1], -u[0], 0]
    const P = (s: number, z: number): V3 => [a[0] + u[0] * s + n[0] * 0.05, a[1] + u[1] * s + n[1] * 0.05, z]
    const nb = Math.max(1, Math.round((L - 1) / 3.2)), w = (L - 1) / nb
    for (let k = 0; k < nb; k++) {
      const sa = 0.5 + k * w + 0.4, sb = 0.5 + (k + 1) * w - 0.4
      for (const [za, zb] of [[1, 6.5], [8.2, 14.2], [15.3, 21]]) face(win, [P(sa, za), P(sb, za), P(sb, zb), P(sa, zb)], n)
    }
  }
}

const parts: Layer[] = [
  { part: stone, material: finish('opernturm-limestone', 0xebe3d4) },
  { part: win, material: { ...PALETTE.window, color: 0x7389a0 } },
  { part: slot, material: windowVariant(2, 0x6a8096) },
  { part: roof, material: PALETTE.roof },
]
await saveLods(ID, 'OpernTurm', parts, null, { anchor: [50.116132, 8.670129], bearing: 20.1, elevation: 0, height: TOP })
