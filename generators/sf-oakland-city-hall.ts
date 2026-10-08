/**
 * Oakland City Hall, Oakland — original procedural geometry, CC0-1.0.
 * bun generators/sf-oakland-city-hall.ts
 *
 * Frame: built turned to the block, BEARING 26.5 (Washington Street runs
 * 26.5° east of north). x across the block (+x = east-south-east, the front
 * on Frank H. Ogawa Plaza), y along it (+y = north-north-east, 15th Street),
 * z up, metres. Origin = the area centroid of the OSM outline way/36977855.
 *
 * Evidence
 * - OSM way/36977855 (outline, 18 levels, 98 m) and its parts way/782510578,
 *   782510579, 782510581, 782510582 (the podium, 13-16 m), 782510576 (14
 *   levels, 82 m), 425117755 (16 levels, 90 m), 430610784 and 782510580 (the
 *   cupola, 98 m). The outline is roughly right; the parts' heights are not.
 * - USGS 3DEP lidar (CA_AlamedaCo_2_2021) at 0.5 m in the turned frame
 *   (/tmp/city/sf/work/oak/frame.py). y = 0 is the lowest ground under the
 *   footprint, 12.5 m NAVD88 (the plaza side reaches 13.6). Measured above
 *   it: the three-storey podium, 40 x 60 m, roof 16.3 and its cresting 18;
 *   a cross block 51 x 22 m through it to 24 m, whose front (with the
 *   lunette, over the portico) stands 3.5 m proud of the podium; the office
 *   tower 26.6 x 37 m (x -10.3..16.3, y -18..19), roof 64.6 and cornice 65.8;
 *   the crown's first stage 14 x 23 m to 72.2 (balustrade 73.3); the second
 *   14.4 m square to 80.5; the arched lantern stage 10 m square to 89.5; a
 *   small dome, r 4.5, to ~98, and the lantern's tip 99.5.
 * - Published (Wikipedia; NRHP; Oakland Landmark): 1914, Palmer & Hornbostel,
 *   beaux-arts "wedding cake"; 320 ft (98 m), the first high-rise city hall in
 *   the United States; granite base, white terracotta above.
 * - Commons daylight photos: "Oakland City Hall (Oakland, CA) 2.JPG"
 *   (Sanfranman59, CC BY-SA 3.0, the plaza front: portico, lunette, seven bays
 *   on the front and five on the side, arched top storey, the crown's stages);
 *   "Oakland City Hall.jpg" (Daniel Ramirez, CC BY 2.0, the front);
 *   "Oakland City Hall-2/-4/-6/-8.jpg" (Almonroth, CC BY-SA 3.0, the crown,
 *   lantern and clock, the cornice); "USA-Oakland-City Hall-1/-2/-Back-1/-3.jpg"
 *   (Eugene Zelenko, CC BY-SA 4.0, the sides and back); "Oakland City Hall
 *   1917.jpg" (Oakland Chamber of Commerce, public domain, the whole from the
 *   plaza).
 *
 * Estimated from the photos: storey heights (a base storey to 26 m, then
 * twelve floors at 2.85 m), windows drawn as one panel per bay per three
 * floors, the top group round-headed, the podium's arched windows (one per ~5 m bay over a
 * ground storey), the portico's two columns between piers, the lunette
 * (r 4.5), the lantern's corner piers and arched openings, the clock dials
 * (r 1.05) above them, the dome's profile (r 3.8, a drum to 91.5 m and a
 * half-ellipse 6 m tall), the urns. The back and the cross block's rear are drawn like the
 * sides; no photo shows them square on.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

type XY = [number, number]
const BEARING = 26.5
const ANCHOR = { lng: -122.2725829, lat: 37.8053134 }
const stone = new Part(), trim = new Part(), win = new Part(), roof = new Part()

function block(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, ch = 0.3, top: Part | null = p) {
  const r: XY[] = [[x0 + ch, y0], [x1 - ch, y0], [x1, y0 + ch], [x1, y1 - ch], [x1 - ch, y1], [x0 + ch, y1], [x0, y1 - ch], [x0, y0 + ch]]
  for (let i = 0; i < 8; i++) {
    const a = r[i], b = r[(i + 1) % 8]
    p.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
  }
  if (top) for (let i = 1; i < 7; i++) top.tri([r[0][0], r[0][1], z1], [r[i][0], r[i][1], z1], [r[i + 1][0], r[i + 1][1], z1])
}
/** A centred square-ish block. */
const cblock = (p: Part, cx: number, cy: number, hx: number, hy: number, z0: number, z1: number, ch = 0.3, top: Part | null = p) =>
  block(p, cx - hx, cx + hx, cy - hy, cy + hy, z0, z1, ch, top)

type Face = { a: XY; t: XY; n: XY; len: number }
const face = (a: XY, b: XY): Face => {
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]), t: XY = [(b[0] - a[0]) / len, (b[1] - a[1]) / len]
  return { a, t, n: [t[1], -t[0]], len }
}
const at = (f: Face, s: number, d: number, z: number): V3 => [f.a[0] + f.t[0] * s + f.n[0] * d, f.a[1] + f.t[1] * s + f.n[1] * d, z]
/** Faces of a box, anticlockwise from the south: s, e, n, w. */
const facesOf = (x0: number, x1: number, y0: number, y1: number): Face[] =>
  [face([x0, y0], [x1, y0]), face([x1, y0], [x1, y1]), face([x1, y1], [x0, y1]), face([x0, y1], [x0, y0])]
const panel = (p: Part, f: Face, s0: number, s1: number, z0: number, z1: number, d = 0.05) =>
  p.quad(at(f, s0, d, z0), at(f, s1, d, z0), at(f, s1, d, z1), at(f, s0, d, z1))
function relief(p: Part, f: Face, s0: number, s1: number, d1: number, z0: number, z1: number, under = false) {
  p.quad(at(f, s0, d1, z0), at(f, s1, d1, z0), at(f, s1, d1, z1), at(f, s0, d1, z1))
  p.quad(at(f, s0, 0, z0), at(f, s0, d1, z0), at(f, s0, d1, z1), at(f, s0, 0, z1))
  p.quad(at(f, s1, d1, z0), at(f, s1, 0, z0), at(f, s1, 0, z1), at(f, s1, d1, z1))
  p.quad(at(f, s0, d1, z1), at(f, s1, d1, z1), at(f, s1, 0, z1), at(f, s0, 0, z1))
  if (under) p.quad(at(f, s0, 0, z0), at(f, s1, 0, z0), at(f, s1, d1, z0), at(f, s0, d1, z0))
}
/** A round-headed panel: rectangle plus a true semicircle of its own width. */
function arched(p: Part, f: Face, sc: number, w: number, z0: number, z1: number, d = 0.05, n = 8) {
  const r = w / 2, spring = z1 - r
  if (spring > z0) panel(p, f, sc - r, sc + r, z0, spring, d)
  for (let i = 0; i < n; i++) {
    const a0 = (Math.PI * i) / n, a1 = (Math.PI * (i + 1)) / n
    p.tri(at(f, sc, d, spring), at(f, sc + r * Math.cos(a0), d, spring + r * Math.sin(a0)), at(f, sc + r * Math.cos(a1), d, spring + r * Math.sin(a1)))
  }
}
function disc(p: Part, f: Face, sc: number, zc: number, r: number, d: number, n = 14) {
  for (let i = 0; i < n; i++) {
    const a0 = (2 * Math.PI * i) / n, a1 = (2 * Math.PI * (i + 1)) / n
    p.tri(at(f, sc, d, zc), at(f, sc + r * Math.cos(a0), d, zc + r * Math.sin(a0)), at(f, sc + r * Math.cos(a1), d, zc + r * Math.sin(a1)))
  }
}
/** A cornice all round a box: a projecting band with a soffit. */
function cornice(x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, out: number, p = trim) {
  for (const f of facesOf(x0, x1, y0, y1)) relief(p, f, -out, f.len + out, out, z0, z1, true)
}
/** Balustrade: a low solid parapet with a coping, set in from the edge. */
function balustrade(x0: number, x1: number, y0: number, y1: number, z0: number, h: number) {
  for (const f of facesOf(x0, x1, y0, y1)) {
    relief(trim, f, 0, f.len, 0.0001, z0, z0 + h)
    relief(trim, f, -0.15, f.len + 0.15, 0.15, z0 + h - 0.25, z0 + h)
  }
}
/** An urn or pinnacle: a square post with a pointed cap. */
function urn(x: number, y: number, z: number, s = 0.45, h = 1.2) {
  cblock(trim, x, y, s, s, z, z + h, 0.1, null)
  const q: V3[] = [[x - s - 0.1, y - s - 0.1, z + h], [x + s + 0.1, y - s - 0.1, z + h], [x + s + 0.1, y + s + 0.1, z + h], [x - s - 0.1, y + s + 0.1, z + h]]
  for (let i = 0; i < 4; i++) trim.tri(q[i], q[(i + 1) % 4], [x, y, z + h + 1.1])
}

// ---------------------------------------------------------------------------
// Podium: three storeys, arched windows over a ground storey.
const PX0 = -18, PX1 = 22, PY0 = -30, PY1 = 30, PH = 16.3
const BX0 = -26, BX1 = 23.5, BY0 = -11, BY1 = 11, BH = 24 // the cross block
const TX0 = -10.3, TX1 = 16.3, TY0 = -18, TY1 = 19 // the tower
const TOWER_ROOF = 64.6
block(stone, PX0, PX1, PY0, PY1, 0, PH, 0.4, roof)
const inBand = (y: number) => y > BY0 - 0.2 && y < BY1 + 0.2
facesOf(PX0, PX1, PY0, PY1).forEach((f, k) => {
  const n = Math.round((f.len - 4) / 5.2), w = (f.len - 4) / n
  for (let i = 0; i < n; i++) {
    const sc = 2 + w * (i + 0.5), p = at(f, sc, 0, 0)
    if ((k === 1 || k === 3) && inBand(p[1])) continue // the cross block's faces take over here
    panel(win, f, sc - 0.8, sc + 0.8, 1.4, 4.2) // ground storey
    arched(trim, f, sc, 2.9, 5.4, 13.2, 0.03) // stone surround
    arched(win, f, sc, 2.3, 5.8, 12.8, 0.07)
  }
  // corner pavilions read as pilaster strips
  relief(trim, f, 0, 1.6, 0.15, 0.5, PH - 1.8)
  relief(trim, f, f.len - 1.6, f.len, 0.15, 0.5, PH - 1.8)
  relief(trim, f, -0.1, f.len + 0.1, 0.12, 4.8, 5.3) // string course
})
cornice(PX0, PX1, PY0, PY1, PH - 1.6, PH - 0.4, 0.7)
cornice(PX0, PX1, PY0, PY1, PH - 0.4, PH, 0.35)
// the cresting along the parapet: a solid ornamental band
for (const f of facesOf(PX0, PX1, PY0, PY1)) relief(trim, f, 0.2, f.len - 0.2, 0.0001, PH, PH + 1.7)

// ---------------------------------------------------------------------------
// The cross block: lunette front over the portico, its rear, and its ends.
block(stone, BX0, BX1, BY0, BY1, 0, BH, 0.3, roof)
{
  const F = facesOf(BX0, BX1, BY0, BY1)
  // the long sides above the podium roof: two rows of windows
  for (const f of [F[0], F[2]]) {
    const n = Math.round(f.len / 5), w = f.len / n
    for (let i = 0; i < n; i++) {
      const sc = w * (i + 0.5), p = at(f, sc, 0.5, 0)
      if (p[0] > TX0 - 0.5 && p[0] < TX1 + 0.5) continue // the tower stands here
      panel(win, f, sc - 0.8, sc + 0.8, PH + 2.4, BH - 1.6)
      if (p[0] < PX0 || p[0] > PX1) { panel(win, f, sc - 0.8, sc + 0.8, 1.4, 4.2); panel(win, f, sc - 0.8, sc + 0.8, 6, PH - 2.2) }
    }
  }
  cornice(BX0, BX1, BY0, BY1, BH - 1.2, BH - 0.3, 0.45)
  balustrade(BX0, BX1, BY0, BY1, BH - 0.3, 0.9)
  // the rear (west) end: windows in three rows
  const rear = F[3]
  for (let i = 0; i < 4; i++) {
    const sc = 2 + ((rear.len - 4) * (i + 0.5)) / 4
    panel(win, rear, sc - 0.9, sc + 0.9, 1.4, 4.2)
    arched(win, rear, sc, 2.2, 6, 13)
    panel(win, rear, sc - 0.9, sc + 0.9, PH + 2.4, BH - 1.8)
  }
  // The front (east): the lunette over the portico.
  const front = F[1], mid = front.len / 2
  arched(trim, front, mid, 10.2, PH + 1.4, PH + 1.4 + 5.1, 0.03, 12)
  arched(win, front, mid, 9.0, PH + 1.7, PH + 1.7 + 4.5, 0.07, 12)
  for (const s of [mid - 7.5, mid + 7.5]) panel(win, front, s - 0.8, s + 0.8, PH + 2.4, BH - 2) // small windows either side
  // The portico: a deep porch in front of the podium line, two columns
  // between square piers, an entablature and the cresting over it.
  const PO = 25.5, depth = PO - BX1
  const pf = face([PO, BY0], [PO, BY1])
  // dark recessed entrance on the block's face
  panel(win, front, 3.2, front.len - 3.2, 0.3, PH - 3.4)
  for (const [s0, s1] of [[0, 3.2], [front.len - 3.2, front.len]]) {
    // piers
    const a = at(front, s0, 0, 0), b = at(front, s1, depth, 0)
    block(stone, Math.min(a[0], b[0]), Math.max(a[0], b[0]), Math.min(a[1], b[1]), Math.max(a[1], b[1]), 0, PH - 2.2, 0.2, null)
  }
  for (const s of [mid - 3.6, mid + 3.6]) {
    const c = at(front, s, depth - 1.1, 0), r = 0.95, nn = 12
    for (let i = 0; i < nn; i++) {
      const a0 = (2 * Math.PI * i) / nn, a1 = (2 * Math.PI * (i + 1)) / nn
      const P = (a: number, z: number): V3 => [c[0] + r * Math.cos(a), c[1] + r * Math.sin(a), z]
      const N = (a: number): V3 => [Math.cos(a), Math.sin(a), 0]
      stone.tri(P(a0, 0.6), P(a1, 0.6), P(a1, PH - 2.2), undefined, undefined, undefined, [N(a0), N(a1), N(a1)])
      stone.tri(P(a0, 0.6), P(a1, PH - 2.2), P(a0, PH - 2.2), undefined, undefined, undefined, [N(a0), N(a1), N(a0)])
    }
    cblock(trim, c[0], c[1], 1.2, 1.2, 0, 0.6, 0.15) // base
    cblock(trim, c[0], c[1], 1.25, 1.25, PH - 2.8, PH - 2.2, 0.15) // capital
  }
  // entablature, cornice and cresting across the porch
  block(stone, BX1 - 0.1, PO, BY0, BY1, PH - 2.2, PH - 0.4, 0.2, roof)
  relief(trim, pf, -0.5, pf.len + 0.5, 0.6, PH - 1.0, PH - 0.3, true)
  relief(trim, pf, 0.2, pf.len - 0.2, 0.0001, PH - 0.4, PH + 1.7)
  block(trim, PO - 0.2, PO, BY0, BY1, PH - 0.4, PH + 1.7, 0.1, trim)
}

// ---------------------------------------------------------------------------
// The office tower: a base storey to 26 m, then twelve floors in seven bays
// on the front and five on the sides, in three-floor groups, the top group
// round-headed; a frieze and a deep cornice.
const SH0 = 26.6, FLOOR = 2.85
block(stone, TX0, TX1, TY0, TY1, PH, TOWER_ROOF, 0.4, roof)
const hidden = (x: number, y: number, z: number) =>
  (z < PH + 1.7 && x > PX0 && x < PX1 && y > PY0 && y < PY1) || (z < BH + 0.6 && x > BX0 && x < BX1 + 2 && y > BY0 && y < BY1)
facesOf(TX0, TX1, TY0, TY1).forEach((f) => {
  const n = Math.round(f.len / 5.3), w = f.len / n
  for (let i = 0; i < n; i++) {
    const sc = w * (i + 0.5), hw = 0.85
    // the base storey's windows, where the cross block doesn't hide them
    const p = at(f, sc, 0.6, 0)
    if (!hidden(p[0], p[1], 21.5)) panel(win, f, sc - hw, sc + hw, PH + 2.6, SH0 - 2.4, 0.09)
    for (let g = 0; g < 4; g++) {
      const z0 = SH0 + g * 3 * FLOOR + 0.8, z1 = SH0 + (g + 1) * 3 * FLOOR - 0.8
      relief(trim, f, sc - hw - 0.35, sc + hw + 0.35, 0.04, z0 - 0.25, z1 + (g === 3 ? 0.35 : 0.25)) // ornamental frame
      if (g < 3) panel(win, f, sc - hw, sc + hw, z0, z1, 0.09)
      else arched(win, f, sc, 2 * hw, z0, z1, 0.09)
    }
  }
  relief(trim, f, -0.25, f.len + 0.25, 0.25, SH0 - 1.0, SH0 - 0.3) // the base's cornice
})
cornice(TX0, TX1, TY0, TY1, 61.2, 62.6, 0.4)
cornice(TX0, TX1, TY0, TY1, 62.6, 64.9, 1.3)
cornice(TX0, TX1, TY0, TY1, 64.9, 65.8, 1.0)

// ---------------------------------------------------------------------------
// The crown: three set-back stages and a small dome.
const CX = 3.3, CY = 0.8
{
  // Stage 1: 14 x 23 m, plain with a few windows, a cornice and balustrade.
  const x0 = -4, x1 = 10, y0 = -11, y1 = 12, top = 72.2
  block(stone, x0, x1, y0, y1, TOWER_ROOF, top, 0.3, roof)
  facesOf(x0, x1, y0, y1).forEach((f) => {
    const n = Math.round(f.len / 4.6)
    for (let i = 0; i < n; i++) {
      const sc = (f.len * (i + 0.5)) / n
      arched(win, f, sc, 1.5, 66.8, 70.0)
    }
  })
  cornice(x0, x1, y0, y1, top - 1.0, top, 0.45)
  balustrade(x0, x1, y0, y1, top, 1.1)
  for (const [x, y] of [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]) urn(x + Math.sign(CX - x) * 0.6, y + Math.sign(CY - y) * 0.6, top)
}
{
  // Stage 2: 14.4 m square with a balustrade and urns.
  const h = 7.2, top = 80.5
  cblock(stone, CX, CY, h, h, 72.2, top - 1.2, 0.3, roof)
  facesOf(CX - h, CX + h, CY - h, CY + h).forEach((f) => {
    for (const s of [f.len / 2 - 3.6, f.len / 2, f.len / 2 + 3.6]) arched(win, f, s, 1.6, 74.2, 77.6)
  })
  cornice(CX - h, CX + h, CY - h, CY + h, top - 2.0, top - 1.2, 0.45)
  balustrade(CX - h, CX + h, CY - h, CY + h, top - 1.2, 1.2)
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) urn(CX + sx * (h - 0.6), CY + sy * (h - 0.6), top - 1.2, 0.45, 1.3)
}
{
  // Stage 3: the lantern, 10 m square: corner piers, a big round arch on
  // each face, the clock above it in the attic, a cornice.
  const h = 5, z0 = 79.3, top = 89.5
  cblock(stone, CX, CY, h, h, z0, top - 1.0, 0.25, null)
  facesOf(CX - h, CX + h, CY - h, CY + h).forEach((f) => {
    const mid = f.len / 2
    arched(trim, f, mid, 4.4, 80.6, 85.6, 0.03)
    arched(win, f, mid, 3.6, 81.0, 85.2, 0.07)
    // paired columns at the corners, as piers standing proud
    relief(trim, f, 0.2, 1.3, 0.3, z0, top - 1.0)
    relief(trim, f, f.len - 1.3, f.len - 0.2, 0.3, z0, top - 1.0)
    disc(trim, f, mid, 87.0, 1.3, 0.06)
    disc(win, f, mid, 87.0, 1.05, 0.1)
  })
  cornice(CX - h, CX + h, CY - h, CY + h, top - 1.0, top, 0.5)
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) urn(CX + sx * (h - 0.3), CY + sy * (h - 0.3), top, 0.35, 1.0)
  // drum and dome: a round drum to 92 and a half-ellipse dome to 98
  const R = 3.8, n = 16, prof: [number, number][] = [[R, top], [R, 91.5]]
  for (let k = 1; k <= 6; k++) { const a = (k / 6) * (Math.PI / 2); prof.push([R * Math.cos(a), 91.5 + 6 * Math.sin(a)]) }
  prof[prof.length - 1][0] = 0.9 // the lantern's foot
  for (let k = 0; k < prof.length - 1; k++) {
    const [r0, z0_] = prof[k], [r1, z1_] = prof[k + 1]
    for (let i = 0; i < n; i++) {
      const a0 = (2 * Math.PI * i) / n, a1 = (2 * Math.PI * (i + 1)) / n
      const P = (r: number, a: number, z: number): V3 => [CX + r * Math.cos(a), CY + r * Math.sin(a), z]
      const N = (a: number, kk: number): V3 => {
        const dr = prof[Math.min(kk + 1, prof.length - 1)][0] - prof[Math.max(kk - 1, 0)][0], dz = prof[Math.min(kk + 1, prof.length - 1)][1] - prof[Math.max(kk - 1, 0)][1]
        const l = Math.hypot(dr, dz) || 1
        return [(Math.cos(a) * dz) / l, (Math.sin(a) * dz) / l, -dr / l]
      }
      const part = k === 0 ? stone : trim
      const nrm = k === 0 ? undefined : [N(a0, k), N(a1, k), N(a1, k + 1)]
      part.tri(P(r0, a0, z0_), P(r0, a1, z0_), P(r1, a1, z1_), undefined, undefined, undefined, nrm)
      part.tri(P(r0, a0, z0_), P(r1, a1, z1_), P(r1, a0, z1_), undefined, undefined, undefined, k === 0 ? undefined : [N(a0, k), N(a1, k + 1), N(a0, k + 1)])
    }
  }
  // lantern and finial
  const lz = prof[prof.length - 1][1]
  cblock(trim, CX, CY, 0.8, 0.8, lz - 0.3, lz + 1.0, 0.15, trim)
  const q: V3[] = [[CX - 0.5, CY - 0.5, lz + 1.0], [CX + 0.5, CY - 0.5, lz + 1.0], [CX + 0.5, CY + 0.5, lz + 1.0], [CX - 0.5, CY + 0.5, lz + 1.0]]
  for (let i = 0; i < 4; i++) trim.tri(q[i], q[(i + 1) % 4], [CX, CY, 99.6])
}

const parts = [
  { part: stone, material: finish('oakland-granite', 0xe8e4dc) },
  { part: trim, material: PALETTE.trim },
  { part: win, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Oakland City Hall', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: 99.6,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['way/36977855', ...[425117755, 430610784, 782510576, 782510578, 782510579, 782510580, 782510581, 782510582].map((w) => `way/${w}`)],
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/sf-oakland-city-hall.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
