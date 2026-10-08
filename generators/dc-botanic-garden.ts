/**
 * United States Botanic Garden Conservatory, Washington DC — procedural,
 * CC0-1.0, no textures.
 * bun generators/dc-botanic-garden.ts
 *
 * Exports `bonnet` and `vault` (curved glasshouse and barrel roofs) for
 * dc-union-station; the model is only written when this file is run.
 *
 * Map frame: x east, y north, z up, metres. The anchor is the area centroid
 * of the conservatory's main outline, way/66418744 (lng -77.0129058,
 * lat 38.8879645), which is also the middle of the Palm House to a metre or
 * two. The walls are turned 0.14° clockwise from the compass, so the model
 * is placed at bearing 0.14 and built square.
 *
 * What it is: the Lord & Burnham glasshouse of 1933 (Bennett, Parsons &
 * Frost), renovated 1997–2001. A long limestone orangery faces the Mall on
 * Maryland Avenue: a range of tall arched windows under a balustrade, with
 * a stone pavilion at each end, and the Garden Court's glass roof rising
 * behind it. Behind that stands the Palm House, the tall glasshouse in the
 * middle: chamfered corners, straight glass walls, a curved glass bonnet
 * and a lantern. Glass wings with curved roofs run back down both sides to
 * a glass range along the south, with a small bonnet-roofed glasshouse at
 * each south corner; between them lie two open courts. A low limestone
 * lobby with the south entrance closes the Independence Avenue side.
 *
 * Covers and replaces: way/905917535 (the stone front and its end
 * pavilions) and relation/1029372 ("Conservatory", building=greenhouse;
 * broken in OSM: its outline way/66418744 is tagged as an inner member, so
 * it may not draw at all). No building:parts. The two open courts are the
 * relation's real inner rings and are left open.
 *
 * Evidence
 * - OSM (measured): the main outline x ±40, y -30.4 to 30.1 (the south lobby
 *   x ±28 to y -19, its middle to -30.4); the courts x ±13–31, y -10 to
 *   15.5; the stone front x -43.5 to 44.3, y 30 to 37.2, its end pavilions
 *   back to y 13.2.
 * - USGS NAIP orthophoto (public domain): the plan of the glass: the Palm
 *   House about 21 × 26 m (x ±10.5, y -19 to 7), the wings x ±30–40, the
 *   south range y -19 to -10.6, the Garden Court's hipped glass roof with a
 *   raised middle, the green roofs on the end pavilions.
 * - Published (USBG, Architect of the Capitol; Wikipedia, "United States
 *   Botanic Garden"): Lord & Burnham glasshouse, 1933; the Palm House is
 *   about 80 ft (24.4 m) tall.
 * - Photos (Wikimedia Commons): "U.S. Botanic Garden Conservatory
 *   (8242569566).jpg" (Architect of the Capitol, public domain), the Palm
 *   House square-on from Independence Avenue, used for its profile;
 *   "United States Botanic Garden entrance.jpg" (CC0), the same side;
 *   "United States Botanic Garden.jpg" (public domain), the Maryland
 *   Avenue front; "United States Botanic Garden by Matt Bisanz.JPG" (MBisanz,
 *   CC BY-SA 3.0), from the north-west with the end pavilion; "United States
 *   Botanic Garden - Washington, D.C. in 2012.JPG" and "United States
 *   Botanic Garden, Washington, D.C. 2012.JPG" (Wknight94, CC BY-SA 3.0),
 *   the south-west corner; "2017 United States Botanic Garden.jpg" (CC BY-SA
 *   4.0), from the south-east.
 * - Measured from the square-on photo against the Palm House's width:
 *   straight walls to 15 m, the bonnet to 22.6 m (inset 5 m), the lantern to
 *   24.4 m; the south lobby 6.5 m, its middle 8.2 m.
 * - Estimated: the stone front's height (cornice 9 m, balustrade to 10.2 m)
 *   from the cars in the north photo; the Garden Court roof (9.5 to 12 m,
 *   the raised middle to 14.5 m); the wings and south range (walls 5 m,
 *   curved roofs to 9.5 m); the corner glasshouses (walls 6 m, bonnets to
 *   11 m); the low glass link round the Palm House's foot.
 * - Simplified: the glazing bars, the arched windows' tracery, the
 *   balusters, louvres and the vents are left out; the glass is one pale
 *   material (named `glass`, lightened to the silver the photos show), its
 *   white aluminium frame shown only as bands at the cornices.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cbox, grow, panel, qf, rect, ring, type Rect, type Side } from './dc-white-house'
import { saveModel } from './dc-nga-west'

const lime = new Part(), glass = new Part(), trim = new Part(), roof = new Part(), win = new Part(), door = new Part()

/**
 * A greenhouse bonnet over a chamfered rectangle: straight walls to zw, then
 * a quarter-ellipse curving in by `inset` and up to zt, closed by a flat top.
 * The chamfers shrink with the inset so the diagonal faces stay straight.
 */
export function bonnet(p: Part, r: Rect, c: number, zw: number, zt: number, inset: number, steps = 5, top: Part | false = p) {
  const rings: V3[][] = [ring(r, c, 0), ring(r, c, zw)]
  for (let k = 1; k <= steps; k++) {
    const t = ((k / steps) * Math.PI) / 2
    const d = inset * (1 - Math.cos(t)), z = zw + (zt - zw) * Math.sin(t)
    rings.push(ring(grow(r, -d), Math.max(0.05, c - d * 0.414), z))
  }
  p.loft(rings)
  if (top) top.cap(rings[rings.length - 1], true)
}

/**
 * A glass range with straight walls and a curved roof, ridge along `axis`:
 * the section is convex, so each end is one fan.
 */
export function vault(p: Part, r: Rect, zw: number, zt: number, axis: 'x' | 'y', steps = 5, z0 = 0) {
  const along = axis === 'x'
  const [u0, u1] = along ? [r.y0, r.y1] : [r.x0, r.x1]
  const [v0, v1] = along ? [r.x0, r.x1] : [r.y0, r.y1]
  const half = (u1 - u0) / 2, mid = (u0 + u1) / 2
  const sec: Array<[number, number]> = [[u0, z0], [u0, zw]]
  for (let k = 1; k < steps; k++) {
    const t = (k / steps) * Math.PI
    sec.push([mid - half * Math.cos(t), zw + (zt - zw) * Math.sin(t)])
  }
  sec.push([u1, zw], [u1, z0])
  const P = (u: number, z: number, v: number): V3 => (along ? [v, u, z] : [u, v, z])
  for (let k = 0; k < sec.length - 1; k++) {
    const [ua, za] = sec[k], [ub, zb] = sec[k + 1]
    const n: V3 = along ? [0, zb - za, -(ub - ua)] : [zb - za, 0, -(ub - ua)]
    // outward is away from the middle and up
    const out: V3 = along ? [0, (ua + ub) / 2 - mid, Math.max(za, zb) - (zw + z0) / 2] : [(ua + ub) / 2 - mid, 0, Math.max(za, zb) - (zw + z0) / 2]
    const s = n[0] * out[0] + n[1] * out[1] + n[2] * out[2] >= 0 ? 1 : -1
    qf(p, P(ua, za, v0), P(ub, zb, v0), P(ub, zb, v1), P(ua, za, v1), [n[0] * s, n[1] * s, n[2] * s])
  }
  for (const [v, sgn] of [[v0, -1], [v1, 1]] as Array<[number, number]>) {
    const nrm: V3 = along ? [sgn, 0, 0] : [0, sgn, 0]
    for (let k = 1; k < sec.length - 1; k++) {
      const a = P(sec[0][0], sec[0][1], v), b = P(sec[k][0], sec[k][1], v), c = P(sec[k + 1][0], sec[k + 1][1], v)
      const f = [(b[1] - a[1]) * (c[2] - a[2]) - (b[2] - a[2]) * (c[1] - a[1]), (b[2] - a[2]) * (c[0] - a[0]) - (b[0] - a[0]) * (c[2] - a[2]), (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])]
      if (f[0] * nrm[0] + f[1] * nrm[1] + f[2] * nrm[2] >= 0) p.tri(a, b, c)
      else p.tri(a, c, b)
    }
  }
}

/** An arched window: a rectangle to the springing line and a semicircle over it, flat on the wall. */
function archWin(side: Side, at: number, c: number, w: number, z0: number, zs: number, seg = 6) {
  panel(win, side, at, c - w / 2, c + w / 2, z0, zs, 0.05)
  const r = w / 2
  for (let k = 0; k < seg; k++) {
    const a0 = (k * Math.PI) / seg, a1 = ((k + 1) * Math.PI) / seg
    const pt = (a: number): [number, number] => [c + r * Math.cos(a), zs + r * Math.sin(a)]
    const [p0, p1] = [pt(a0), pt(a1)]
    const ns = side === 'n' || side === 's', sg = side === 'n' || side === 'e' ? 1 : -1
    const off = at + sg * 0.05
    const V = (a: number, z: number): V3 => (ns ? [a, off, z] : [off, a, z])
    const n: V3 = ns ? [0, sg, 0] : [sg, 0, 0]
    const A = V(c, zs), B = V(p0[0], p0[1]), C = V(p1[0], p1[1])
    const f = [(B[1] - A[1]) * (C[2] - A[2]) - (B[2] - A[2]) * (C[1] - A[1]), (B[2] - A[2]) * (C[0] - A[0]) - (B[0] - A[0]) * (C[2] - A[2]), (B[0] - A[0]) * (C[1] - A[1]) - (B[1] - A[1]) * (C[0] - A[0])]
    if (f[0] * n[0] + f[1] * n[1] + f[2] * n[2] >= 0) win.tri(A, B, C)
    else win.tri(A, C, B)
  }
}

// ===========================================================================
// The limestone front on Maryland Avenue, with its end pavilions.
const FRONT = rect(-43.5, 44.3, 30.0, 37.2)
const PAV = (s: number) => (s < 0 ? rect(-43.5, -30.0, 13.2, 37.2) : rect(30.0, 44.3, 13.2, 37.2))
const CORNICE = 9.0, BAL = 10.2
{
  for (const r of [FRONT, PAV(-1), PAV(1)]) {
    cbox(lime, r, 0, CORNICE - 0.5, { top: false })
    cbox(lime, grow(r, 0.4), CORNICE - 0.5, CORNICE, { b: 0.2, bottom: true, top: roof })
    cbox(lime, grow(r, 0.15), 0, 0.9, { b: 0.1, top: false })
  }
  // the balustrade: a low parapet round the front and the pavilions' outer sides
  const parapet = (r: Rect) => {
    const t = 0.45
    cbox(lime, rect(r.x0, r.x1, r.y1 - t, r.y1), CORNICE, BAL, { b: 0.12 })
  }
  parapet(FRONT)
  for (const s of [-1, 1]) {
    const p = PAV(s)
    cbox(lime, s < 0 ? rect(p.x0, p.x0 + 0.45, p.y0, p.y1) : rect(p.x1 - 0.45, p.x1, p.y0, p.y1), CORNICE, BAL, { b: 0.12 })
    cbox(lime, rect(p.x0, p.x1, p.y0, p.y0 + 0.45), CORNICE, BAL, { b: 0.12 })
  }
  // Nine tall arched windows across the middle, two on each pavilion's
  // front and on each pavilion's outer side.
  for (let k = 0; k < 9; k++) archWin('n', FRONT.y1, -26.6 + k * 6.65, 3.0, 1.2, 6.2)
  for (const s of [-1, 1]) {
    const p = PAV(s), mx = (p.x0 + p.x1) / 2
    for (const d of [-3.4, 3.4]) archWin('n', FRONT.y1, mx + d, 2.6, 1.2, 6.0)
    for (const y of [19.5, 26.5]) archWin(s < 0 ? 'w' : 'e', s < 0 ? p.x0 : p.x1, y, 2.6, 1.2, 6.0)
  }
  panel(door, 'n', FRONT.y1, -1.6, 1.6, 0.9, 4.2, 0.08)
}

// ===========================================================================
// The Garden Court behind the front: a hipped glass roof, its middle raised.
{
  const court = rect(-30.0, 30.0, 13.2, 30.0)
  cbox(glass, court, 0, CORNICE - 0.4, { top: false })
  cbox(trim, grow(court, 0.2), CORNICE - 0.4, CORNICE, { bottom: true, top: false })
  bonnet(glass, grow(court, -0.2), 0.05, CORNICE, 11.8, 4.0, 1)
  const mid = rect(-9.5, 9.5, 16.5, 27.0)
  cbox(glass, mid, 11.6, 12.8, { top: false })
  cbox(trim, grow(mid, 0.15), 12.8, 13.2, { bottom: true, top: false })
  bonnet(glass, mid, 0.05, 13.2, 14.8, 3.0, 1, false)
  const crest = grow(mid, -3.0)
  glass.cap(ring(crest, 0, 14.8), true)
}

// ===========================================================================
// The Palm House: chamfered, straight walls, a curved bonnet, a lantern.
{
  const PH = rect(-10.5, 10.5, -19.0, 7.0), C = 3.5
  const WALL = 15.0, BON = 22.6, LAN = 23.7, TOP = 24.4
  // a low stone plinth, then the glass
  cbox(lime, PH, 0, 0.8, { c: C, b: 0.1, top: false })
  cbox(glass, PH, 0.8, WALL, { c: C, top: false })
  cbox(trim, grow(PH, 0.25), WALL, WALL + 0.8, { c: C + 0.1, b: 0.2, bottom: true, top: false })
  bonnet(glass, PH, C, WALL + 0.8, BON, 5.0, 6, false)
  const crown = grow(PH, -5.0)
  cbox(trim, crown, BON - 0.1, BON + 0.3, { c: 0.6, top: true })
  const lan = grow(crown, -1.2)
  cbox(glass, lan, BON + 0.3, LAN, { c: 0.4, top: false })
  cbox(trim, grow(lan, 0.15), LAN, LAN + 0.25, { c: 0.5, bottom: true, top: false })
  bonnet(glass, grow(lan, 0.15), 0.5, LAN + 0.25, TOP, 2.0, 1)
  // the low glass link round the Palm House's foot, out to the courts and
  // up to the Garden Court
  cbox(glass, rect(-14.0, 14.0, -10.6, 13.2), 0, 6.2, { top: glass })
  cbox(trim, rect(-14.2, 14.2, -10.8, 13.2), 6.2, 6.6, { bottom: true, top: false })
}

// ===========================================================================
// The wings, the south range and its corner glasshouses.
{
  for (const s of [-1, 1]) {
    const wing = s < 0 ? rect(-40.0, -30.0, -10.6, 13.2) : rect(30.0, 40.0, -10.6, 13.2)
    cbox(lime, grow(wing, 0.1), 0, 0.8, { b: 0.1, top: false })
    vault(glass, wing, 5.0, 9.5, 'y')
    cbox(trim, rect(wing.x0 - 0.1, wing.x0 + 0.2, wing.y0, wing.y1), 4.8, 5.2, { top: true })
    cbox(trim, rect(wing.x1 - 0.2, wing.x1 + 0.1, wing.y0, wing.y1), 4.8, 5.2, { top: true })
    // the corner glasshouse
    const corner = s < 0 ? rect(-40.0, -28.5, -20.0, -10.0) : rect(28.5, 40.0, -20.0, -10.0)
    cbox(lime, corner, 0, 0.8, { c: 1.2, b: 0.1, top: false })
    cbox(glass, corner, 0.8, 6.0, { c: 1.2, top: false })
    cbox(trim, grow(corner, 0.2), 6.0, 6.6, { c: 1.3, b: 0.15, bottom: true, top: false })
    bonnet(glass, corner, 1.2, 6.6, 10.4, 3.6, 4, false)
    const c2 = grow(corner, -3.6)
    cbox(trim, c2, 10.3, 10.6, { c: 0.3 })
    bonnet(glass, grow(c2, -0.6), 0.2, 10.6, 11.3, 1.0, 1)
  }
  // the south range between the corners, behind the lobby
  const south = rect(-28.5, 28.5, -19.0, -10.6)
  vault(glass, south, 5.0, 9.0, 'x')
}

// ===========================================================================
// The south lobby on Independence Avenue: plain limestone, the entrance in
// its raised middle.
{
  const lobby = rect(-27.9, 27.9, -29.4, -19.0)
  cbox(lime, lobby, 0, 6.0, { top: false })
  cbox(lime, grow(lobby, 0.25), 6.0, 6.5, { b: 0.2, bottom: true, top: roof })
  const midB = rect(-8.0, 8.0, -30.4, -19.0)
  cbox(lime, midB, 0, 7.7, { top: false })
  cbox(lime, grow(midB, 0.25), 7.7, 8.2, { b: 0.2, bottom: true, top: roof })
  panel(door, 's', -30.4, -3.6, 3.6, 0, 3.6, 0.06)
  for (const x of [-22.5, -15.5, 15.5, 22.5]) panel(win, 's', -29.4, x - 1.3, x + 1.3, 1.0, 3.6, 0.05)
  for (const x of [-5.5, 5.5]) panel(win, 's', -30.4, x - 1.0, x + 1.0, 1.0, 3.6, 0.05)
}

if (import.meta.main) await saveModel('dc-botanic-garden', 'United States Botanic Garden Conservatory', [
  { part: lime, material: finish('usbg-limestone', 0xeadcc5) },
  // `glass` by name (structural glazing, never lit), lightened from the
  // library's blue: dense white aluminium bars make the houses read silver.
  { part: glass, material: { ...PALETTE.glass, color: 0xc4d3dc } },
  { part: trim, material: PALETTE.trim },
  { part: roof, material: PALETTE.roof },
  { part: win, material: PALETTE.window },
  { part: door, material: PALETTE.entrance },
], { source: 'generators/dc-botanic-garden.ts', bearing: 0.14, osm: 'relation/1029372', footprint: [87.8, 67.6], height: 24.4 })
