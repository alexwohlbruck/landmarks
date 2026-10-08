/**
 * Field Museum of Natural History (1400 South DuSable Lake Shore Drive,
 * 1921, Daniel Burnham's office / Graham, Anderson, Probst & White), Chicago
 * — original procedural geometry, CC0-1.0.
 * bun generators/chi-field-museum.ts
 *
 * This file also exports the small kit the other Museum Campus models by the
 * same builder use (Shedd Aquarium, Adler Planetarium, Soldier Field); the
 * museum itself is only written when this file runs.
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. The OSM outline way/24825537 has its long walls at 88.8°, so the
 * catalog bearing is 358.8 and the building is square to this frame. The
 * anchor is the building's own axis of symmetry (3.5 m west of the outline's
 * area centroid, which the low east vestibule pulls east), so the model can
 * be exactly symmetrical about x = 0 and y = 0.
 *
 * Identity, in order: the long white-marble temple of a building, 215 m by
 * 95 m, on a ground-floor plinth; the central pavilion with its pedimented
 * Ionic portico (four columns in antis between broad piers) on both the
 * north and the south front; the raised central hall (Stanley Field Hall)
 * running right through behind the porticos, its low gabled roof carrying a
 * long skylight; the long wings of engaged Ionic columns; the pedimented end
 * pavilions with two columns in antis at all four corners.
 *
 * Evidence:
 *  - plan: OSM outline way/24825537 (no parts, building:levels 3): main body
 *    214 x 95 m, end pavilions 19 m wide projecting ~4 m, central pavilion
 *    57 m wide projecting 13 m, porticos 36 m wide projecting a further
 *    6.7 m, the low east vestibule 24 x 39 m. Checked on USGS NAIP: the
 *    central hall's roof is a 36 m strip running the full depth, with an
 *    ~18 x 80 m skylight; the end pavilions show as full-depth strips too.
 *  - heights: none in OSM or published that I found. Measured on Paul
 *    Sableman's square-on view of the north portico, scaled by the 36 m
 *    portico width (23 px/m): columns 11.2 m, entablature 2.8 m, attic
 *    3.7 m, cornice 1.7 m, pediment 4.3 m. The porch floor is ~5 m above
 *    the lowest ground (Sea Cow's aerial of the south front; an estimate).
 *    So the pediment apex is ~28.7 m. Wings: the wing order is shorter than
 *    the portico's and its top is level with the portico's entablature
 *    (~19.5 m) on the 1940s north view and the aerial; end pavilion cornice
 *    ~17.2 m and pediment ~21 m, measured on the aerial crop against the
 *    wing columns. All heights are estimates to ~1 m.
 *  - facade: ~14 engaged columns per wing between the central and end
 *    pavilions (aerial, 1940s view); windows in two tiers between them over
 *    a band of ground-floor windows; the east and west ends carry the same
 *    colonnade (Shruti Kansara's view of the east entrance).
 *  - colour: white Georgia marble, weathered pale grey-cream; the hall
 *    roof's skylight `glass`.
 *
 * Photos (Wikimedia Commons): Field_Museum_N.jpg (Sea Cow, CC BY-SA 4.0,
 * aerial of the south front); Field_Museum_(30292342835).jpg (Paul
 * Sableman, CC BY 2.0, north portico); FieldMuseumOfNaturalHistory-2/-4/-5
 * .jpg (Omkarjpathak, CC BY-SA 4.0, south-west and south-east);
 * Field_Museum,_Chicago,_1940s_(NBY_3028).jpg (DeVoe Photo Studio, public
 * domain, north-west); Field_Museum_Back_Entrance_Oct_2020.jpg (Shruti
 * Kansara, CC BY-SA 4.0, east end); Museum_Of_History_..._panoramio.jpg
 * (leamsi.setroc, CC BY-SA 3.0). USGS NAIP for the plan. No commercial
 * imagery.
 *
 * Left out: rooftop mechanical penthouses and the roofed-over light courts,
 * the caryatid porches, acroteria, the wing frieze's medallions, the
 * tabernacle doors either side of the porticos, the outdoor terraces.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, type Swatch } from './palette'

// ---------------------------------------------------------------------------
// Kit, shared by this builder's Museum Campus models.

export type XY = [number, number]

export const rect = (x0: number, y0: number, x1: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
export const circle = (cx: number, cy: number, r: number, seg = 16, a0 = 0): XY[] =>
  Array.from({ length: seg }, (_, i) => [cx + r * Math.cos(a0 + (i / seg) * 2 * Math.PI), cy + r * Math.sin(a0 + (i / seg) * 2 * Math.PI)] as XY)

/** Offset a counter-clockwise ring inwards by d (mitred). */
export function inset(r: XY[], d: number): XY[] {
  const n = r.length
  const nrm = (a: XY, b: XY): XY => { const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1; return [-(b[1] - a[1]) / l, (b[0] - a[0]) / l] }
  return r.map((c, i) => {
    const n1 = nrm(r[(i - 1 + n) % n], c), n2 = nrm(c, r[(i + 1) % n])
    const k = 1 + n1[0] * n2[0] + n1[1] * n2[1]
    return [c[0] + (n1[0] + n2[0]) / Math.max(k, 0.2) * d, c[1] + (n1[1] + n2[1]) / Math.max(k, 0.2) * d] as XY
  })
}

/** Ear clipping for a simple counter-clockwise ring. */
export function triangulate(r: XY[]): [number, number, number][] {
  const idx = r.map((_, i) => i), out: [number, number, number][] = []
  const cr = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inside = (p: XY, a: XY, b: XY, c: XY) => cr(a, b, p) > 1e-9 && cr(b, c, p) > 1e-9 && cr(c, a, p) > 1e-9
  let guard = 0
  while (idx.length > 3 && guard++ < 20000) {
    let cut = false
    for (let i = 0; i < idx.length; i++) {
      const ia = idx[(i - 1 + idx.length) % idx.length], ib = idx[i], ic = idx[(i + 1) % idx.length]
      if (cr(r[ia], r[ib], r[ic]) <= 1e-9) continue
      if (idx.some(j => j !== ia && j !== ib && j !== ic && inside(r[j], r[ia], r[ib], r[ic]))) continue
      out.push([ia, ib, ic]); idx.splice(i, 1); cut = true; break
    }
    if (!cut) idx.splice(0, 1)
  }
  if (idx.length === 3) out.push([idx[0], idx[1], idx[2]])
  return out
}

export const signedArea = (r: XY[]) => r.reduce((s, a, i) => { const b = r[(i + 1) % r.length]; return s + a[0] * b[1] - b[0] * a[1] }, 0) / 2
/** The ring counter-clockwise. */
export const ccw = (r: XY[]) => (signedArea(r) < 0 ? [...r].reverse() : r)

/** Walls of a counter-clockwise ring from z0 to z1, optionally to a second ring of the same length. */
export function walls(p: Part, r: XY[], z0: number, z1: number, r1: XY[] = r) {
  for (let i = 0; i < r.length; i++) {
    const j = (i + 1) % r.length
    p.quad([r[i][0], r[i][1], z0], [r[j][0], r[j][1], z0], [r1[j][0], r1[j][1], z1], [r1[i][0], r1[i][1], z1])
  }
}
export function cap(p: Part, r: XY[], z: number, up = true) {
  for (const [a, b, c] of triangulate(r)) {
    const A: V3 = [r[a][0], r[a][1], z], B: V3 = [r[b][0], r[b][1], z], C: V3 = [r[c][0], r[c][1], z]
    if (up) p.tri(A, B, C); else p.tri(A, C, B)
  }
}
/** A flat-topped block with a bevelled top edge; returns the top ring. */
export function block(wall: Part, top: Part | null, r: XY[], z0: number, z1: number, bevel = 0.4): XY[] {
  if (bevel <= 0) { walls(wall, r, z0, z1); if (top) cap(top, r, z1); return r }
  const ins = inset(r, bevel)
  walls(wall, r, z0, z1 - bevel)
  walls(wall, r, z1 - bevel, z1, ins)
  if (top) cap(top, ins, z1)
  return ins
}
/** A projecting cornice band round a ring: out by `d`, from z0 to z1, bevelled under and over. */
export function cornice(p: Part, r: XY[], z0: number, z1: number, d = 0.5) {
  const o = inset(r, -d), h = z1 - z0
  walls(p, r, z0, z0 + h * 0.35, o)
  walls(p, o, z0 + h * 0.35, z1 - h * 0.25)
  walls(p, o, z1 - h * 0.25, z1, inset(r, -d * 0.4))
}

/** A point on the wall a→b of a counter-clockwise ring: s along it, at height z, `out` outside it. */
export function onWall(a: XY, b: XY) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
  const P = (s: number, z: number, out = 0): V3 => [a[0] + u[0] * s + n[0] * out, a[1] + u[1] * s + n[1] * out, z]
  return { L, u, n, P }
}
/** A flat panel on wall a→b from s0 to s1 along it and z0 to z1 up it. */
export function panel(p: Part, a: XY, b: XY, s0: number, s1: number, z0: number, z1: number, out = 0.05) {
  const { P } = onWall(a, b)
  p.quad(P(s0, z0, out), P(s1, z0, out), P(s1, z1, out), P(s0, z1, out))
}
/** A box standing proud of wall a→b (back face omitted): pilasters, capitals, piers. */
export function relief(p: Part, a: XY, b: XY, s0: number, s1: number, z0: number, z1: number, d: number, top = true) {
  const { P } = onWall(a, b)
  p.quad(P(s0, z0, d), P(s1, z0, d), P(s1, z1, d), P(s0, z1, d))
  p.quad(P(s0, z0, 0), P(s0, z0, d), P(s0, z1, d), P(s0, z1, 0))
  p.quad(P(s1, z0, d), P(s1, z0, 0), P(s1, z1, 0), P(s1, z1, d))
  if (top) p.quad(P(s0, z1, d), P(s1, z1, d), P(s1, z1, 0), P(s0, z1, 0))
}
/** An engaged half column on wall a→b at s: smooth shaft, block base and capital. */
export function halfColumn(shaft: Part, blocks: Part, a: XY, b: XY, s: number, z0: number, z1: number, r: number, seg = 6) {
  const { u, n, P } = onWall(a, b)
  const cb = Math.min(0.9, (z1 - z0) * 0.07), cc = Math.min(0.9, (z1 - z0) * 0.08)
  relief(blocks, a, b, s - r * 1.25, s + r * 1.25, z0, z0 + cb, r * 1.2)
  relief(blocks, a, b, s - r * 1.3, s + r * 1.3, z1 - cc, z1, r * 1.25)
  const at = (k: number, z: number, rr: number) => {
    const t = Math.PI - (k * Math.PI) / seg
    return P(s + rr * Math.cos(t), z, rr * Math.sin(t))
  }
  const nm = (k: number): V3 => {
    const t = Math.PI - (k * Math.PI) / seg
    return [u[0] * Math.cos(t) + n[0] * Math.sin(t), u[1] * Math.cos(t) + n[1] * Math.sin(t), 0]
  }
  for (let k = 0; k < seg; k++) {
    const A = at(k, z0 + cb, r), B = at(k + 1, z0 + cb, r), C = at(k + 1, z1 - cc, r * 0.9), D = at(k, z1 - cc, r * 0.9)
    shaft.tri(A, B, C, undefined, undefined, undefined, [nm(k), nm(k + 1), nm(k + 1)])
    shaft.tri(A, C, D, undefined, undefined, undefined, [nm(k), nm(k + 1), nm(k)])
  }
}

/** A surface of revolution about (cx, cy) from a (radius, z) profile, smooth-shaded. */
export function lathe(p: Part, cx: number, cy: number, prof: XY[], seg = 16, a0 = 0) {
  const nrm = prof.map((_, i) => {
    const [r0, z0] = prof[Math.max(0, i - 1)], [r1, z1] = prof[Math.min(prof.length - 1, i + 1)]
    const l = Math.hypot(z1 - z0, r1 - r0) || 1
    return [(z1 - z0) / l, -(r1 - r0) / l] as XY
  })
  for (let k = 0; k < seg; k++) {
    const a = a0 + (k / seg) * 2 * Math.PI, b = a0 + ((k + 1) / seg) * 2 * Math.PI
    const P = ([r, z]: XY, t: number): V3 => [cx + r * Math.cos(t), cy + r * Math.sin(t), z]
    const N = (n: XY, t: number): V3 => [n[0] * Math.cos(t), n[0] * Math.sin(t), n[1]]
    for (let i = 0; i < prof.length - 1; i++) {
      const A = P(prof[i], a), B = P(prof[i], b), C = P(prof[i + 1], b), D = P(prof[i + 1], a)
      const nA = N(nrm[i], a), nB = N(nrm[i], b), nC = N(nrm[i + 1], b), nD = N(nrm[i + 1], a)
      if (prof[i][0] > 1e-6) p.tri(A, B, C, undefined, undefined, undefined, [nA, nB, nC])
      if (prof[i + 1][0] > 1e-6) p.tri(A, C, D, undefined, undefined, undefined, [nA, nC, nD])
    }
  }
}
/** A free-standing classical column: plinth block, tapering smooth shaft, capital block. */
export function column(shaft: Part, blocks: Part, cx: number, cy: number, z0: number, z1: number, r: number, seg = 10) {
  const cb = Math.min(0.8, (z1 - z0) * 0.06), cc = Math.min(0.9, (z1 - z0) * 0.08)
  block(blocks, blocks, rect(cx - r * 1.2, cy - r * 1.2, cx + r * 1.2, cy + r * 1.2), z0, z0 + cb, 0.12)
  lathe(shaft, cx, cy, [[r, z0 + cb], [r * 0.86, z1 - cc]], seg)
  block(blocks, blocks, rect(cx - r * 1.3, cy - r * 1.3, cx + r * 1.3, cy + r * 1.3), z1 - cc, z1, 0.15)
}

/**
 * A gabled block whose ridge runs along y: eaves at z0 along x0 and x1,
 * ridge at z1 on the centre line, triangular gable walls (pediments) at y0
 * and y1 in `gableP`, sloping roof in `roofP`.
 */
export function gableY(roofP: Part, gableP: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number) {
  const xm = (x0 + x1) / 2
  roofP.quad([x1, y0, z0], [x1, y1, z0], [xm, y1, z1], [xm, y0, z1])
  roofP.quad([x0, y1, z0], [x0, y0, z0], [xm, y0, z1], [xm, y1, z1])
  gableP.tri([x0, y0, z0], [x1, y0, z0], [xm, y0, z1])
  gableP.tri([x1, y1, z0], [x0, y1, z0], [xm, y1, z1])
}
/** A raking cornice: a slim bevelled lip along a pediment's two slopes, on the gable plane y = yf facing `dir`. */
export function rakingCornice(p: Part, x0: number, x1: number, yf: number, dir: 1 | -1, z0: number, z1: number, t = 0.6, d = 0.5) {
  const xm = (x0 + x1) / 2
  for (const [xa, xb] of [[x0, xm], [x1, xm]]) {
    const A: V3 = [xa, yf, z0], B: V3 = [xb, yf, z1]
    const o = (v: V3, dz: number, dy: number): V3 => [v[0], v[1] + dir * dy, v[2] + dz]
    const q = (a: V3, b: V3, c: V3, e: V3) => {
      // Wind to face outwards along `dir`, whichever slope this is.
      const nY = (b[2] - a[2]) * (c[0] - a[0]) - (b[0] - a[0]) * (c[2] - a[2])
      if (Math.sign(nY || 1) === dir) p.quad(a, b, c, e); else p.quad(a, e, c, b)
    }
    q(o(A, -t, d), o(B, -t, d), o(B, 0, d), o(A, 0, d))
    // Top surface of the lip, sloping with the roof.
    const up = (v: V3, dy: number): V3 => [v[0], v[1] + dir * dy, v[2]]
    const topA = up(A, d), topB = up(B, d), backA = up(A, 0), backB = up(B, 0)
    const n = (b: V3, a: V3, c: V3) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
    if (n(topB, topA, backA) * (xb - xa) * dir < 0) p.quad(topA, topB, backB, backA); else p.quad(topA, backA, backB, topB)
  }
}

/** Degrees from the centroid, for a placement. */
export function anchorOf(lon: number, lat: number, dx: number, dy: number): [number, number] {
  const kx = 111320 * Math.cos((lat * Math.PI) / 180), ky = 110574
  return [lat + dy / ky, lon + dx / kx]
}

/** Check the budget and write models/<id>.glb. */
export async function save(id: string, name: string, anchor: [number, number], bearing: number, parts: { part: Part; material: Swatch }[], maxTri = 5000) {
  const used = parts.filter(x => x.part.triangles > 0)
  const triangles = used.reduce((s, x) => s + x.part.triangles, 0)
  if (used.length > 6) throw new Error(`${id}: ${used.length} materials`)
  const glb = writeGlb(name, used, { frame: 'Y up, -Z north, +X east; metres; ground anchor', anchor, bearing })
  if (triangles > maxTri || glb.length > 250_000) throw new Error(`${id}: budget exceeded: ${triangles} triangles / ${glb.length} bytes`)
  const out = process.argv[2] ?? new URL(`../models/${id}.glb`, import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}

// ---------------------------------------------------------------------------
// Field Museum

function build() {
  const marble = new Part(), trim = new Part(), win = new Part(), roof = new Part(), glass = new Part()

  // Plan (half sizes; the building is symmetrical about both axes).
  const WX = 107.5, WY = 47.3 // main body
  const EX = 88.5, EY = 51.5 // end pavilions: |x| from EX to WX, |y| to EY
  const CX = 28.5, CY = 60.8 // central pavilion
  const PX = 18, PY = 67.5 // portico and central hall

  // Heights.
  const PLINTH = 6.5, ORDER = 15, WING = 19.5 // wing order base, capitals, top
  const PORCH = 5, P_COL = 16.2, P_ENT = 19, P_ATT = 22.7, P_COR = 24.4, P_APEX = 28.7
  const E_COR = 17.2, E_APEX = 21.2

  // --- Body: one ring round the main block, end pavilions and central pavilion.
  const body: XY[] = [
    [-WX, -EY], [-EX, -EY], [-EX, -WY], [-CX, -WY], [-CX, -CY], [CX, -CY], [CX, -WY], [EX, -WY], [EX, -EY], [WX, -EY],
    [WX, EY], [EX, EY], [EX, WY], [CX, WY], [CX, CY], [-CX, CY], [-CX, WY], [-EX, WY], [-EX, EY], [-WX, EY],
  ]
  walls(marble, body, 0, PLINTH - 0.6)
  cornice(trim, body, PLINTH - 0.6, PLINTH, 0.35) // ground-floor string course
  walls(marble, body, PLINTH, ORDER + 1.6)
  // Wings and central pavilion: frieze and main cornice. The end pavilions
  // stop lower and carry their own gabled roofs.
  const upper: XY[] = [[-EX, -WY], [-CX, -WY], [-CX, -CY], [CX, -CY], [CX, -WY], [EX, -WY], [EX, WY], [CX, WY], [CX, CY], [-CX, CY], [-CX, WY], [-EX, WY]]
  walls(marble, upper, ORDER + 1.6, WING - 1.0)
  cornice(trim, upper, WING - 1.0, WING, 0.55)
  cap(roof, inset(upper, -0.2), WING)

  // End pavilions: walls to their cornice, gabled roof running north-south
  // with a pediment over each long front.
  for (const s of [-1, 1]) {
    const x0 = s < 0 ? -WX : EX, x1 = s < 0 ? -EX : WX
    const r = rect(x0, -EY, x1, EY)
    walls(marble, r, ORDER + 1.6, E_COR - 0.8)
    cornice(trim, r, E_COR - 0.8, E_COR, 0.45)
    const o = inset(r, -0.25)
    gableY(roof, marble, o[0][0], o[1][0], o[0][1], o[2][1], E_COR, E_APEX)
    for (const [yf, dir] of [[-EY - 0.25, -1], [EY + 0.25, 1]] as [number, 1 | -1][])
      rakingCornice(trim, o[0][0] - 0.2, o[1][0] + 0.2, yf, dir, E_COR, E_APEX + 0.15, 0.55, 0.45)
  }

  // --- Central hall over the pavilion, its north and south ends the portico
  // fronts: attic, cornice, gabled skylit roof.
  const hall = rect(-PX, -PY, PX, PY)
  walls(marble, rect(-PX, -CY, PX, CY), WING, P_ENT)
  walls(marble, hall, P_ENT, P_ATT)
  cornice(trim, hall, P_ATT, P_COR, 0.6)
  const ho = inset(hall, -0.35)
  gableY(roof, marble, ho[0][0], ho[1][0], ho[0][1], ho[2][1], P_COR, P_APEX)
  for (const [yf, dir] of [[-PY - 0.35, -1], [PY + 0.35, 1]] as [number, 1 | -1][])
    rakingCornice(trim, ho[0][0] - 0.25, ho[1][0] + 0.25, yf, dir, P_COR, P_APEX + 0.2, 0.7, 0.5)
  // Skylight: a long glass band either side of the ridge.
  {
    const slope = (P_APEX - P_COR) / (PX + 0.35), at = (x: number) => P_COR + slope * (PX + 0.35 - Math.abs(x)) + 0.06
    const y0 = -40, y1 = 40, a = 0, b = 6.5
    for (const s of [-1, 1]) {
      const xa = s * a, xb = s * b
      const q: V3[] = [[xb, y0, at(xb)], [xb, y1, at(xb)], [xa, y1, at(xa)], [xa, y0, at(xa)]]
      if (s > 0) glass.quad(q[0], q[1], q[2], q[3]); else glass.quad(q[3], q[2], q[1], q[0])
    }
  }

  // --- Porticos: podium with steps, piers, four Ionic columns in antis,
  // entablature across the front, recessed wall of glazing behind.
  for (const s of [-1, 1]) {
    const yIn = s * CY, yOut = s * PY
    const lo = Math.min(yIn, yOut), hi = Math.max(yIn, yOut)
    // Podium under the porch.
    block(marble, marble, rect(-PX, lo, PX, hi), 0, PORCH, 0.2)
    // Steps down from the porch, within the portico's width.
    for (let k = 0; k < 4; k++) {
      const d0 = 1.8 * k, d1 = 1.8 * (k + 1)
      const y0 = s < 0 ? -PY - d1 : PY + d0, y1 = s < 0 ? -PY - d0 : PY + d1
      block(marble, marble, rect(-PX + 2.5, y0, PX - 2.5, y1), 0, PORCH - 1.25 * k - 0.0, 0)
    }
    // Piers (antae) at both ends, full depth of the porch.
    const PIER = 6.2
    for (const e of [-1, 1]) {
      const x0 = e < 0 ? -PX : PX - PIER, x1 = e < 0 ? -PX + PIER : PX
      const r = s < 0 ? rect(x0, -PY, x1, -CY) : rect(x0, CY, x1, PY)
      walls(marble, r, PORCH, P_COL)
    }
    // Glazing on the pavilion wall behind the columns, the porch soffit,
    // and four columns in antis on the porch's front line.
    const xa = -PX + PIER, xb = PX - PIER, bay = (xb - xa) / 5
    const wa: XY = s < 0 ? [xa, -CY] : [xb, CY], wb: XY = s < 0 ? [xb, -CY] : [xa, CY]
    for (let k = 0; k < 5; k++) panel(win, wa, wb, k * bay + 0.9, (k + 1) * bay - 0.9, PORCH + 0.2, P_COL - 1.5, 0.05)
    const yA = Math.min(s * CY, s * PY), yB = Math.max(s * CY, s * PY)
    marble.quad([xa, yA, P_COL], [xa, yB, P_COL], [xb, yB, P_COL], [xb, yA, P_COL])
    for (let k = 1; k <= 4; k++) column(trim, trim, xa + k * bay, s * (PY - 1.4), PORCH, P_COL, 1.05, 10)
    // Entablature across the front: the hall wall above the columns.
    const ent = s < 0 ? rect(-PX, -PY, PX, -CY) : rect(-PX, CY, PX, PY)
    walls(marble, ent, P_COL, P_ENT)
    cornice(trim, ent, P_COL + 1.6, P_COL + 2.2, 0.25)
  }

  // --- Facades. Engaged columns and windows on the long wings, the end
  // pavilions' two columns in antis, windows on the plain central bays.
  const ROWS: [number, number][] = [[2.0, 4.4], [7.2, 14.2]]
  const colonnade = (a: XY, b: XY, n: number, end: number) => {
    const { L } = onWall(a, b)
    const pitch = (L - 2 * end) / (n - 1)
    for (let k = 0; k < n; k++) halfColumn(trim, trim, a, b, end + k * pitch, PLINTH, ORDER, 0.62, 6)
    for (let k = 0; k < n - 1; k++) {
      const c = end + (k + 0.5) * pitch
      for (const [z0, z1] of ROWS) panel(win, a, b, c - 1.25, c + 1.25, z0, z1)
    }
  }
  for (const s of [-1, 1]) for (const t of [-1, 1]) {
    // Long wing between central and end pavilion, on the front y = t * WY.
    const xi = s * CX, xo = s * EX
    const a: XY = t < 0 ? [Math.min(xi, xo), -WY] : [Math.max(xi, xo), WY]
    const b: XY = t < 0 ? [Math.max(xi, xo), -WY] : [Math.min(xi, xo), WY]
    colonnade(a, b, 14, 2.4)
    // End pavilion front: two columns in a recess between broad piers.
    const x0 = s < 0 ? -WX : EX, x1 = s < 0 ? -EX : WX
    const pa: XY = t < 0 ? [x0, -EY] : [x1, EY], pb: XY = t < 0 ? [x1, -EY] : [x0, EY]
    const L = x1 - x0
    panel(win, pa, pb, 5.6, L - 5.6, PLINTH + 0.4, ORDER - 0.6, 0.05)
    for (const f of [1 / 3, 2 / 3]) halfColumn(trim, trim, pa, pb, 5.6 + (L - 11.2) * f, PLINTH, ORDER, 0.75, 6)
    for (const sx of [2.6, L - 2.6]) panel(win, pa, pb, sx - 1, sx + 1, 2.0, 4.4)
    // Central pavilion side bays: punched windows over a small door.
    const ca: XY = t < 0 ? [s < 0 ? -CX : PX, -CY] : [s < 0 ? -PX : CX, CY]
    const cb: XY = t < 0 ? [s < 0 ? -PX : CX, -CY] : [s < 0 ? -CX : PX, CY]
    for (const [z0, z1] of [[1.4, 4.2], [16.2, 17.4]] as [number, number][]) panel(win, ca, cb, 3.6, 6.9, z0, z1)
  }
  // East and west ends: the same colonnade along each end pavilion's outer face.
  for (const s of [-1, 1]) {
    const a: XY = s < 0 ? [-WX, EY] : [WX, -EY], b: XY = s < 0 ? [-WX, -EY] : [WX, EY]
    colonnade(a, b, 22, 3.2)
  }

  // --- East vestibule: the low entrance block on the east front.
  {
    const r = rect(WX, -17, 132, 22.5)
    block(marble, roof, r, 0, 5.2, 0.3)
    panel(win, [132, -17], [132, 22.5], 4, 35.5, 0.6, 3.8)
    panel(win, [WX, -17], [132, -17], 3, 21, 0.6, 3.8)
    panel(win, [132, 22.5], [WX, 22.5], 3, 21, 0.6, 3.8)
  }

  return [
    { part: marble, material: finish('georgia-marble', 0xe7e1d6) },
    { part: trim, material: PALETTE.trim },
    { part: win, material: PALETTE.window },
    { part: roof, material: finish('pale-roof', 0xc6cacb) },
    { part: glass, material: PALETTE.glass },
  ]
}

if (import.meta.main) await save('chi-field-museum', 'Field Museum', anchorOf(-87.617001, 41.866214, -3.5, -0.3), 358.8, build())
