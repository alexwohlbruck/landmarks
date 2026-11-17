/**
 * Concertgebouw, Amsterdam — procedural, CC0-1.0, no textures.
 * bun generators/amsterdam-concertgebouw.ts
 *
 * A.L. van Gendt's concert hall of 1888: a neoclassical front of red-brown
 * brick banded with pale stone, a stone centre with six Corinthian columns
 * over three arched doors, an entablature and a sculpted pediment crowned by
 * the gilded lyre; corner pavilions under steep slate mansards with iron
 * cresting; behind them the Grote Zaal under one long, high gabled roof,
 * and at the back the oval of the Kleine Zaal. Along the south-east side,
 * Pi de Bruijn's glazed foyer wing of 1988, widening to the
 * Concertgebouwplein corner.
 *
 * Map frame: x = model east, y = model north, z up, metres. Placed at
 * bearing 66.7°, the outline's long walls: model north (+y, 66.7°) is the
 * front on Van Baerlestraat facing Museumplein; +x (156.7°) is the 1988
 * wing. Anchor: the area centroid of OSM way/46696080. The front is drawn
 * symmetric about the hall's axis, x = −3.1.
 *
 * Evidence
 * - OSM way/46696080 (outline = BAG 0363100012233435, rce 288) and its
 *   parts: 754269611 (the hall, h24 gabled), 754269610 (the front centre,
 *   h21 gabled), 754269606–609 (pavilions, h25 pyramidal), 754269603
 *   (wings, h14), 754276797 (east range, h14), 754269604/605 (the oval,
 *   h24/h13), 754276795/796 (low annexes, h5).
 * - 3D BAG (3dbag.nl, CC BY 4.0, 3D geoinformation group TU Delft /
 *   3DBAG), pand NL.IMBAG.Pand.0363100012233435, LoD2.2 from AHN lidar,
 *   sampled on a 2 m grid in this frame; ground NAP +0.19. Measured: the
 *   hall's ridge 25.0–25.8 on x ≈ −3, its east slope to 19.8 at x 8; the
 *   front centre's gable 22.0 (lidar-reconstructed, lower than the
 *   pediment's apex in the photos); pavilions 21.6; wings 15.2–16.2; the
 *   oval's roof 22–23 at its centre, its outer ring about 13; the 1988 wing
 *   11.8 at the old wall falling to 9.2 at its outer edge. (The LoD2 model
 *   has some spurious steep faces here; those cells were ignored.)
 * - Photos (Wikimedia Commons, all EVIDENCE):
 *   - "Concertgebouw, Van Baerlestraat.jpg" and "Concertgebouw, Van
 *     Baerlestraat, Concertgebouwplein.jpg", Alf van Beem, public domain —
 *     the front straight on (proportions scaled from it) and from the north
 *     corner with the 1988 wing along the side.
 *     https://commons.wikimedia.org/wiki/File:Concertgebouw,_Van_Baerlestraat.jpg
 *     https://commons.wikimedia.org/wiki/File:Concertgebouw,_Van_Baerlestraat,_Concertgebouwplein.jpg
 *   - Gerard Dukker (RCE), "Exterieur NIEUWE AANBOUW, OVERZICHT - Amsterdam
 *     - 20260226 - RCE.jpg", CC BY-SA 4.0 — the 1988 wing's wide end.
 *     https://commons.wikimedia.org/wiki/File:Exterieur_NIEUWE_AANBOUW,_OVERZICHT_-_Amsterdam_-_20260226_-_RCE.jpg
 *   - Diego Delso, "Concertgebouw, Ámsterdam, Países Bajos, 2016-05-30, DD
 *     22-24 HDR.jpg", CC BY-SA 4.0 — the night look.
 *     https://commons.wikimedia.org/wiki/File:Concertgebouw,_%C3%81msterdam,_Pa%C3%ADses_Bajos,_2016-05-30,_DD_22-24_HDR.jpg
 *   - C messier, "Concertgebouw from Museumplein 2539.jpg", CC BY-SA 4.0;
 *     yisris, "Concertgebouw in Amsterdam April 2015.jpg", CC BY 2.0;
 *     Calips, "Concertgebouw in Amsterdam Nederland.jpg", CC BY-SA 3.0 —
 *     the front from Museumplein with the hall's roof and gable behind.
 *     https://commons.wikimedia.org/wiki/File:Concertgebouw_from_Museumplein_2539.jpg
 *     https://commons.wikimedia.org/wiki/File:Concertgebouw_in_Amsterdam_April_2015.jpg
 *     https://commons.wikimedia.org/wiki/File:Concertgebouw_in_Amsterdam_Nederland.jpg
 *   - roberto rembrandt, "Concertgebouw detail.jpg", CC BY-SA 3.0 — the
 *     pediment and the lyre. https://commons.wikimedia.org/wiki/File:Concertgebouw_detail.jpg
 *   - A.L. van Gendt, "A.L. van Gendt Concertgebouw 0.jpg", public domain
 *     (1888 publication) — the plans: hall, front, oval Kleine Zaal.
 *     https://commons.wikimedia.org/wiki/File:A.L._van_Gendt_Concertgebouw_0.jpg
 * - Published: opened 1888, architect A.L. van Gendt; the glazed extension
 *   by Pi de Bruijn, 1988 (nl/en.wikipedia "Concertgebouw").
 *
 * Estimated from the straight front photo (19.3 px/m across the 52.5 m
 * front): wing and pavilion cornice 15.8; pavilion mansards to 21.2 with
 * cresting to 22.6; the centre 22 m wide; six free columns (pairs at the
 * ends, 2.4 m in front of the recessed wall); its entablature 19.0, pediment
 * apex 24.3, lyre to 27.9 (drawn about twice its real size, about 3.7 m, so
 * it reads on a phone); columns 8.0–16.6 over a stone porch with three arched
 * doors; window bays counted. The 1988 wing's glazing, dark upper band and
 * height from the RCE photo and the BAG.
 *
 * Doubts: the brief speaks of a glass cylinder; the OSM outline and the
 * photos show a glazed wedge-shaped wing along the side instead, which is
 * what is drawn. The back (the oval and its roof) has no close licensed
 * photo and follows the 1888 plan and the BAG heights. Sculpture in the
 * pediment and the lettering are left out.
 *
 * Night: the front is floodlit (Delso), windows and the 1988 wing glow;
 * the lyre is gilt and catches the floodlight.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { finishModel, prism, capPoly, unit, area, type XY } from './nyc-570-lexington'
import { rectPanel, archPanel, band } from './nyc-city-hall'

const brick = new Part(), stone = new Part(), slate = new Part(), win = new Part(), gilt = new Part(), annex = new Part()

// ---------------------------------------------------------------- helpers
const cr = (a: V3, b: V3, c: V3): V3 => {
  const u: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v: V3 = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  return [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
}
function poly(p: Part, pts: V3[], out: V3) {
  const n = cr(pts[0], pts[1], pts[2])
  const q = n[0] * out[0] + n[1] * out[1] + n[2] * out[2] >= 0 ? pts : [...pts].reverse()
  for (let i = 1; i < q.length - 1; i++) p.tri(q[0], q[i], q[i + 1])
}
const rect = (x0: number, y0: number, x1: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
const ccw = (r: XY[]) => (area(r) < 0 ? [...r].reverse() : r)
function walls(p: Part, top: Part | null, ring: XY[], z0: number, z1: number, bevel = 0.3) {
  prism({ wall: p, win: null, roof: top, ring: ccw(ring), z0, z1, facade: null, bevel })
}
const L = (a: XY, b: XY) => Math.hypot(b[0] - a[0], b[1] - a[1])
/** A truncated pyramid from rectangle b at z0 to t at z1. */
function trunc(p: Part, b: number[], z0: number, t: number[], z1: number, top: Part | null = p) {
  const B: V3[] = [[b[0], b[1], z0], [b[2], b[1], z0], [b[2], b[3], z0], [b[0], b[3], z0]]
  const T: V3[] = [[t[0], t[1], z1], [t[2], t[1], z1], [t[2], t[3], z1], [t[0], t[3], z1]]
  const cx = (b[0] + b[2]) / 2, cy = (b[1] + b[3]) / 2
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    poly(p, [B[i], B[j], T[j], T[i]], [(B[i][0] + B[j][0]) / 2 - cx, (B[i][1] + B[j][1]) / 2 - cy, 0.5])
  }
  if (top) poly(top, T, [0, 0, 1])
}
function spike(p: Part, x: number, y: number, r: number, z0: number, z1: number) {
  const A: V3 = [x, y, z1]
  const c: V3[] = [[x - r, y - r, z0], [x + r, y - r, z0], [x + r, y + r, z0], [x - r, y + r, z0]]
  for (let i = 0; i < 4; i++) { const a = c[i], b = c[(i + 1) % 4]; poly(p, [a, b, A], [(a[0] + b[0]) / 2 - x, (a[1] + b[1]) / 2 - y, 0.3]) }
}
/** A box between two points in a vertical plane y = y0 (x, z), width w across the segment, depth d in y. */
function bar(p: Part, a: [number, number], b: [number, number], w: number, y0: number, d: number) {
  const dx = b[0] - a[0], dz = b[1] - a[1], l = Math.hypot(dx, dz), nx = (-dz / l) * (w / 2), nz = (dx / l) * (w / 2)
  const q = (x: number, z: number, y: number): V3 => [x, y, z]
  const f = [q(a[0] + nx, a[1] + nz, y0), q(b[0] + nx, b[1] + nz, y0), q(b[0] - nx, b[1] - nz, y0), q(a[0] - nx, a[1] - nz, y0)]
  const k = f.map(([x, , z]) => q(x, z, y0 - d))
  poly(p, f, [0, 1, 0]); poly(p, k, [0, -1, 0])
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4, mx = (f[i][0] + f[j][0]) / 2 - (a[0] + b[0]) / 2, mz = (f[i][2] + f[j][2]) / 2 - (a[1] + b[1]) / 2
    poly(p, [f[i], f[j], k[j], k[i]], [mx, 0, mz])
  }
}
/** A gable roof along y (ridge at x = xr), eaves at x0/x1 (height zE), ridge zR, y0…y1; gable ends in `end`. */
function gableY(p: Part, end: Part | null, x0: number, x1: number, y0: number, y1: number, zE: number, zR: number, xr = (x0 + x1) / 2, ov = 0.4) {
  const sL = (zR - zE) / (xr - x0), sR = (zR - zE) / (x1 - xr)
  poly(p, [[x0 - ov, y0 - ov, zE - ov * sL], [x0 - ov, y1 + ov, zE - ov * sL], [xr, y1 + ov, zR], [xr, y0 - ov, zR]], [-1, 0, 1])
  poly(p, [[x1 + ov, y0 - ov, zE - ov * sR], [x1 + ov, y1 + ov, zE - ov * sR], [xr, y1 + ov, zR], [xr, y0 - ov, zR]], [1, 0, 1])
  if (end) for (const [y, o] of [[y0, -1], [y1, 1]] as [number, number][]) poly(end, [[x0, y, zE], [x1, y, zE], [xr, y, zR]], [0, o, 0])
}
/** Window bays on a wall a→b: a rectangle below, a taller one above, each with a stone head. */
function bays(a: XY, b: XY, n: number, margin: number, w: number, rows: [number, number][]) {
  const len = L(a, b), pitch = (len - 2 * margin) / n
  for (let k = 0; k < n; k++) {
    const s = margin + pitch * (k + 0.5)
    for (const [z0, z1] of rows) {
      rectPanel(stone, a, b, s, w + 0.7, z0 - 0.35, z1 + 0.55, 0.04)
      rectPanel(win, a, b, s, w, z0, z1, 0.08)
    }
  }
}

// ---------------------------------------------------------------- plan (OSM / BAG)
const AX = -3.1 // the hall's axis
const FRONT = 36.5, CORN = 15.8
const WING_W = [-29.6, -15.8, -17.1, FRONT] as const // west wing
const WING_E = [10.9, -27.4, 22.9, FRONT] as const // east wing (with the east range)
const PAV: [number, number][] = [[-25.6, 33.0], [18.9, 33.0], [-25.6, -12.5], [18.9, -12.5]] // centres, 8 m square
const CEN = [AX - 11, AX + 11] as const // the stone centre, 22 m

// Wings and the rear range (754269603, 754276797).
walls(brick, slate, rect(WING_W[0], WING_W[1], WING_W[2], WING_W[3]), 0, CORN)
walls(brick, slate, rect(WING_E[0], WING_E[1], WING_E[2], WING_E[3]), 0, CORN)
walls(brick, slate, rect(-18.5, -27.5, 12.4, -12.9), 0, 14.0)
walls(brick, slate, [[-31.8, 21.8], [-29.4, 21.8], [-29.4, 29.9], [-31.8, 29.9]], 0, 5.0)
walls(brick, slate, [[-31.9, -8.5], [-29.6, -8.5], [-29.6, -0.5], [-31.9, -0.5]], 0, 5.0)
// Balustrades on the wings' front parts (white), the wings' bands.
for (const r of [rect(WING_W[0], WING_W[1], WING_W[2], WING_W[3]), rect(WING_E[0], WING_E[1], WING_E[2], WING_E[3])]) {
  band(stone, r, CORN - 1.2, CORN - 0.3, 0.25)
  band(stone, r, CORN - 0.3, CORN + 0.9, 0.0)
  band(stone, r, 7.0, 7.6, 0.12)
  band(stone, r, 0, 1.0, 0.1)
  for (const z of [2.6, 4.2, 9.6, 11.6, 13.4]) band(stone, r, z, z + 0.32, 0.04)
}

// The hall (754269611): walls to 19.2, a long gabled roof, ridge 25.6 (BAG).
walls(brick, null, rect(-17.1, -12.9, 10.9, 32.8), 0, 19.2)
gableY(slate, brick, -17.1, 10.9, -12.9, 32.8, 19.2, 25.6, AX)
// A lunette in the hall's front gable, seen above the pediment.
archPanel(win, [10.9, 32.8], [-17.1, 32.8], 10.9 - AX, 5.0, 20.0, 22.6, 0.06, 8)
// Clerestory windows along the hall's sides, above the wings.
for (const [a, b] of [[[10.9, -12.9], [10.9, 32.8]], [[-17.1, 32.8], [-17.1, -12.9]]] as [XY, XY][]) {
  const len = L(a, b), n = 8, pitch = len / n
  for (let k = 0; k < n; k++) archPanel(win, a, b, pitch * (k + 0.5), 2.4, 16.4, 18.6, 0.06, 6)
}

// Pavilions: brick with stone quoins and bands, a steep slate mansard to
// 21.2 with an aedicule dormer on each face, iron cresting to 22.6.
for (const [cx, cy] of PAV) {
  const h = 4.0, r = rect(cx - h, cy - h, cx + h, cy + h)
  walls(brick, null, r, 0, CORN + 0.3)
  band(stone, r, CORN - 0.9, CORN + 0.3, 0.3)
  band(stone, r, 7.0, 7.6, 0.14); band(stone, r, 0, 1.0, 0.12)
  for (const z of [2.6, 4.2, 9.6, 11.6, 13.4]) band(stone, r, z, z + 0.32, 0.05)
  // Quoins.
  for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) walls(stone, null, [[cx + sx * h - 0.45, cy + sy * h - 0.45], [cx + sx * h + 0.45, cy + sy * h - 0.45], [cx + sx * h + 0.45, cy + sy * h + 0.45], [cx + sx * h - 0.45, cy + sy * h + 0.45]], 0, CORN - 0.9, 0.05)
  trunc(slate, [cx - h + 0.3, cy - h + 0.3, cx + h - 0.3, cy + h - 0.3], CORN + 0.3, [cx - 2.4, cy - 2.4, cx + 2.4, cy + 2.4], 21.0, slate)
  // Cresting: a low open rail of posts round the flat top, finials at the corners.
  for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) spike(slate, cx + sx * 2.2, cy + sy * 2.2, 0.16, 21.0, 22.8)
  for (const [a, b] of [[[cx - 2.4, cy - 2.4], [cx + 2.4, cy - 2.4]], [[cx + 2.4, cy - 2.4], [cx + 2.4, cy + 2.4]], [[cx + 2.4, cy + 2.4], [cx - 2.4, cy + 2.4]], [[cx - 2.4, cy + 2.4], [cx - 2.4, cy - 2.4]]] as [XY, XY][])
    rectPanel(slate, a, b, 2.4, 4.6, 21.0, 21.7, -0.15)
  // Aedicule dormers: a stone frame with a pediment on each face.
  for (const [dx, dy] of [[0, -1], [1, 0], [0, 1], [-1, 0]]) {
    const t: XY = [-dy, dx], f = h - 0.5 // front plane in from the wall
    const at = (u: number, z: number): V3 => [cx + dx * f + t[0] * u, cy + dy * f + t[1] * u, z]
    const out: V3 = [dx, dy, 0]
    poly(stone, [at(-1.2, CORN + 0.3), at(1.2, CORN + 0.3), at(1.2, CORN + 3.0), at(-1.2, CORN + 3.0)], out)
    poly(stone, [at(-1.45, CORN + 3.0), at(1.45, CORN + 3.0), at(0, CORN + 4.0)], out)
    const back = (u: number, z: number): V3 => [cx + dx * (f - 1.6) + t[0] * u, cy + dy * (f - 1.6) + t[1] * u, z]
    for (const s of [-1, 1]) poly(slate, [at(s * 1.2, CORN + 0.3), at(s * 1.2, CORN + 3.0), back(s * 1.2, CORN + 3.0), back(s * 1.2, CORN + 0.3)], [t[0] * s, t[1] * s, 0])
    for (const s of [-1, 1]) poly(slate, [at(s * 1.45, CORN + 3.0), at(0, CORN + 4.0), back(0, CORN + 4.0), back(s * 1.45, CORN + 3.0)], [t[0] * s, t[1] * s, 1])
    const wv: V3 = [dx * 0.06, dy * 0.06, 0]
    const wa = (u: number, z: number): V3 => { const p = at(u, z); return [p[0] + wv[0], p[1] + wv[1], p[2]] }
    poly(win, [wa(-0.6, CORN + 0.8), wa(0.6, CORN + 0.8), wa(0.6, CORN + 2.6), wa(-0.6, CORN + 2.6)], out)
  }
}

// ---------------------------------------------------------------- the stone centre
{
  const [x0, x1] = CEN, yF = FRONT + 0.6
  // The centre's body: stone, its front wall recessed behind the portico.
  walls(stone, slate, rect(x0, 30.0, x1, yF), 0, 19.0, 0.25)
  // Portico (photo, 19.3 px/m): six free-standing columns, pairs at the
  // ends and two in the middle, so three wide bays over the three doors.
  const yC = yF + 2.4 // column axis, 2.4 m in front of the recessed wall
  const yE = yC + 1.0 // front of the entablature and pediment
  const cols = [-9.4, -6.7, -2.4, 2.4, 6.7, 9.4].map((u) => AX + u)
  // Ground floor: a stone porch to the column line with the three arched doors.
  walls(stone, stone, rect(x0 + 0.6, yF - 0.2, x1 - 0.6, yE), 0, 8.0, 0.2)
  for (const u of [-4.6, 0, 4.6]) archPanel(win, [x1 - 0.6, yE], [x0 + 0.6, yE], (x1 - 0.6) - (AX + u), 3.0, 0.2, 6.0, 0.06, 8)
  band(stone, rect(x0 + 0.6, yF - 0.2, x1 - 0.6, yE), 7.4, 8.0, 0.3)
  // Columns: real cylinders with bases and block capitals.
  for (const x of cols) {
    const y = yC, n = 12, r = 0.66
    const ring = (rr: number, z: number): V3[] => Array.from({ length: n }, (_, i) => { const t = (i / n) * 2 * Math.PI; return [x + rr * Math.cos(t), y + rr * Math.sin(t), z] as V3 })
    const a = ring(r, 8.6), b = ring(r * 0.88, 15.7)
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n
      const na = unit([a[i][0] - x, a[i][1] - y, 0]), nb = unit([a[j][0] - x, a[j][1] - y, 0])
      stone.tri(a[i], a[j], b[j], undefined, undefined, undefined, [na, nb, nb])
      stone.tri(a[i], b[j], b[i], undefined, undefined, undefined, [na, nb, na])
    }
    walls(stone, stone, rect(x - 0.9, y - 0.9, x + 0.9, y + 0.9), 8.0, 8.6, 0.05)
    walls(stone, stone, rect(x - 0.95, y - 0.95, x + 0.95, y + 0.95), 15.7, 16.6, 0.1)
  }
  // The recessed wall behind: three tall windows in the wide bays, dark
  // between the pale columns; narrow end bays plain stone.
  for (const u of [-4.55, 0, 4.55]) {
    rectPanel(win, [x1, yF], [x0, yF], x1 - (AX + u), 3.2, 8.9, 15.9, 0.06)
    archPanel(stone, [x1, yF], [x0, yF], x1 - (AX + u), 3.6, 15.9, 16.5, 0.04, 6)
  }
  // Entablature carried by the columns, open underneath back to the wall.
  walls(stone, stone, rect(x0 - 0.3, yF - 0.2, x1 + 0.3, yE), 16.6, 19.0, 0.15)
  capPoly(stone, rect(x0 - 0.3, yF - 0.2, x1 + 0.3, yE), 16.6, false)
  band(stone, rect(x0 - 0.3, yF - 0.2, x1 + 0.3, yE), 18.3, 19.0, 0.3)
  // Low pediment, apex 24.3, below the hall's ridge (25.6) behind it.
  const zB = 19.0, zA = 24.3, yP = yE
  poly(stone, [[x0, yP - 0.3, zB], [x1, yP - 0.3, zB], [AX, yP - 0.3, zA]], [0, 1, 0])
  for (const s of [-1, 1]) {
    const xe = s < 0 ? x0 - 0.6 : x1 + 0.6
    poly(slate, [[xe, yP - 0.6, zB - 0.1], [AX, yP - 0.6, zA + 0.35], [AX, 30.0, zA + 0.35], [xe, 30.0, zB - 0.1]], [s, 0, 2.2])
    // Bold raking cornice.
    poly(stone, [[xe, yP + 0.3, zB + 0.05], [AX, yP + 0.3, zA + 0.45], [AX, yP - 0.7, zA + 0.45], [xe, yP - 0.7, zB + 0.05]], [s, 0, 2.2])
    poly(stone, [[xe, yP + 0.3, zB + 0.05], [xe, yP + 0.3, zB - 0.5], [AX, yP + 0.3, zA - 0.1], [AX, yP + 0.3, zA + 0.45]], [0, 1, 0])
  }
  poly(stone, [[x0 - 0.6, 30.0, zB - 0.1], [x1 + 0.6, 30.0, zB - 0.1], [AX, 30.0, zA + 0.35]], [0, -1, 0])
  for (const x of [x0, x1]) walls(stone, stone, rect(x - 0.5, yP - 0.6, x + 0.5, yP + 0.3), zB, zB + 0.9, 0.05)

  // ---- The gilded lyre on the apex, facing Museumplein. Drawn about
  // twice real size with thick members, so it reads at 200 px.
  const z0 = zA + 0.3, y0 = yP + 0.4, D = 0.9, S = 2.0
  const X = (u: number) => AX + u * S, Z = (v: number) => z0 + v * S
  bar(gilt, [X(-0.75), Z(0.12)], [X(0.75), Z(0.12)], 0.26 * S, y0, D) // base
  for (const s of [-1, 1]) {
    const arm: [number, number][] = [[0.3, 0.2], [0.72, 0.55], [0.82, 1.0], [0.68, 1.35], [0.82, 1.62], [1.02, 1.7]]
    for (let i = 0; i < arm.length - 1; i++) bar(gilt, [X(s * arm[i][0]), Z(arm[i][1])], [X(s * arm[i + 1][0]), Z(arm[i + 1][1])], 0.25 * S, y0, D)
  }
  bar(gilt, [X(-0.72), Z(1.32)], [X(0.72), Z(1.32)], 0.18 * S, y0, D) // yoke
  for (const u of [-0.26, 0, 0.26]) bar(gilt, [X(u), Z(0.22)], [X(u), Z(1.3)], 0.09 * S, y0 - 0.2, D - 0.4) // strings
  walls(stone, stone, rect(AX - 1.2, y0 - D - 0.1, AX + 1.2, y0 + 0.1), zA - 0.3, z0 + 0.05, 0.05) // plinth
}

// ---------------------------------------------------------------- front windows
{
  const [x0, x1] = CEN
  // Wing fronts between the pavilions and the centre: two bays a side.
  for (const [a, b] of [[[-21.6, FRONT], [-29.6 + 8, FRONT]], [[x0, FRONT], [-21.6, FRONT]], [[14.9, FRONT], [x1, FRONT]]] as [XY, XY][]) {
    const aa: XY = a[0] < b[0] ? b : a, bb: XY = a[0] < b[0] ? a : b
    if (L(aa, bb) < 3) continue
    bays(aa, bb, 2, 0.8, 1.5, [[2.2, 5.6], [8.4, 12.6]])
  }
  // Pavilion fronts and sides: one bay per face.
  for (const [cx, cy] of PAV) {
    const h = 4.0
    for (const [a, b] of [[[cx + h, cy + h], [cx - h, cy + h]], [[cx - h, cy - h], [cx + h, cy - h]], [[cx + h, cy - h], [cx + h, cy + h]], [[cx - h, cy + h], [cx - h, cy - h]]] as [XY, XY][])
      bays(a, b, 1, 1.0, 1.8, [[2.2, 5.6], [8.4, 12.6]])
  }
  // Long side walls of the wings.
  bays([-29.6, 29.0], [-29.6, -8.5], 6, 1.0, 1.5, [[2.2, 5.6], [8.4, 12.6]])
}

// ---------------------------------------------------------------- the oval (Kleine Zaal)
{
  const cx = AX, cy = -27.3, n = 16
  const ell = (a: number, b: number, z: number): V3[] => Array.from({ length: n }, (_, i) => { const t = (i / n) * 2 * Math.PI; return [cx + a * Math.cos(t), cy + b * Math.sin(t), z] as V3 })
  const o0 = ell(15.0, 12.8, 0), o1 = ell(15.0, 12.8, 13.0)
  brick.loft([o0, o1]); band(stone, o1.map(([x, y]) => [x, y] as XY), 12.2, 13.0, 0.25)
  capPoly(slate, o1.map(([x, y]) => [x, y] as XY), 13.0)
  const i0 = ell(10.6, 8.5, 12.9), i1 = ell(10.6, 8.5, 17.4)
  brick.loft([i0, i1]); band(stone, i1.map(([x, y]) => [x, y] as XY), 16.8, 17.4, 0.25)
  for (let k = 0; k < n; k += 2) {
    const t = ((k + 0.5) / n) * 2 * Math.PI
    const a: XY = [cx + 10.6 * Math.cos(t - 0.12), cy + 8.5 * Math.sin(t - 0.12)], b: XY = [cx + 10.6 * Math.cos(t + 0.12), cy + 8.5 * Math.sin(t + 0.12)]
    archPanel(win, a, b, L(a, b) / 2, 1.4, 13.8, 16.2, 0.07, 6)
  }
  // Roof: an oval cone (pyramidal in OSM) to 23.0.
  const top: V3 = [cx, cy, 23.0]
  const r1 = ell(10.9, 8.8, 17.2)
  for (let i = 0; i < n; i++) poly(slate, [r1[i], r1[(i + 1) % n], top], [r1[i][0] - cx, r1[i][1] - cy, 2])
}

// ---------------------------------------------------------------- the 1988 wing
{
  // Outline east of the old wall (OSM): a strip widening to the south corner.
  const ring: XY[] = ccw([[22.9, 29.0], [26.4, 33.8], [26.4, -14.6], [31.7, -24.9], [37.4, -36.1], [31.8, -38.9], [22.7, -43.4], [22.7, -36.7], [22.9, -27.4]])
  const z1 = 10.6
  prism({ wall: win, win: null, roof: null, ring, z0: 0, z1: 7.0, facade: null, bevel: 0.15 })
  prism({ wall: win, win: null, roof: null, ring, z0: 7.0, z1, facade: null, bevel: 0.15 })
  for (const z of [8.2, 9.4]) band(annex, ring, z, z + 0.25, 0.04)
  band(annex, ring, 6.6, 7.2, 0.45) // the bronze canopy line
  // Low roof falling outward (BAG 11.8 → 9.2): a flat lid a little proud.
  capPoly(slate, ring, z1)
  // Columns at the glass.
  for (const [a, b] of ring.map((p, i) => [p, ring[(i + 1) % ring.length]] as [XY, XY])) {
    const len = L(a, b)
    if (len < 6 || Math.min(a[0], b[0]) < 23.2) continue
    const n = Math.round(len / 6)
    for (let k = 0; k <= n; k++) {
      const s = (len * k) / n, ux = (b[0] - a[0]) / len, uy = (b[1] - a[1]) / len
      const x = a[0] + ux * s + uy * 0.5, y = a[1] + uy * s - ux * 0.5
      prism({ wall: annex, win: null, roof: null, ring: [[x - 0.4, y - 0.4], [x + 0.4, y - 0.4], [x + 0.4, y + 0.4], [x - 0.4, y + 0.4]], z0: 0, z1: 7.0, facade: null, bevel: 0.15 })
    }
  }
}

// ---------------------------------------------------------------- write
const lit = (p: V3, n: V3) => (n[1] > 0.5 && p[1] > 28 ? 0.75 : Math.abs(n[2]) < 0.5 ? 0.3 : 0.1)
finishModel('Concertgebouw', 'amsterdam-concertgebouw', [
  { part: brick, material: { ...finish('concertgebouw-brick', 0x8f5446), floodlight: lit } },
  { part: stone, material: { ...PALETTE.stone, floodlight: lit } },
  { part: slate, material: finish('concertgebouw-slate', 0x6c7580) },
  { part: win, material: PALETTE.window },
  { part: gilt, material: { ...finish('concertgebouw-gilt', 0xd9ae4c, 0.5), floodlight: () => 0.9 } },
  { part: annex, material: finish('concertgebouw-annex', 0x58687a) },
], { bearing: 66.7, osm: 'way/46696080', height: 27.9 }, 6500)
