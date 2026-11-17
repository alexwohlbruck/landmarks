/**
 * Polyforum Cultural Siqueiros (1967-71, David Alfaro Siqueiros; architects
 * Guillermo Rossell de la Lama, Joaquín Álvarez Ordóñez and Ramón Torres),
 * Insurgentes Sur 701, Nápoles, Mexico City: procedural, CC0-1.0.
 * bun generators/mexico-city-polyforum-siqueiros.ts
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 13: the twelve
 * mural faces in the OSM trace sit at compass 13 + 30k degrees (mean of
 * the twelve outer vertex pairs: 13.3), so in this frame a face looks due
 * north and the rest follow every 30 degrees. Origin: the area centroid of
 * OSM way/227708275 (lng -99.1734362, lat 19.3933153).
 *
 * Form, from the photos: a ring of twelve big trapezoidal mural faces,
 * narrower at the foot and leaning outward, joined by deep pleats: two
 * narrow painted panels fold in from each pair of face edges to a black
 * steel column. The whole shell, framed in black, stands on a low
 * dodecagonal platform over a set-back, glazed ground floor (now a
 * restaurant) with a projecting canopy, so it reads as a crown floating
 * over glass. Inside the ring a faceted dodecagonal roof (the vault of the
 * Foro Universal) rises in two steps. The murals ("La Marcha de la
 * Humanidad", exterior: Destino, Ecología, Acróbatas, ...) are drawn as a
 * few broad flat colour zones per panel over a slate field: black and dark
 * greys dominate (~60%), rust red and ochre are the accents, cream only in
 * small areas, after the photos; no texture, no painted detail.
 *
 * Sources
 * - OSM (ODbL): way/227708275, building, height 18, building:colour black,
 *   roof:colour gainsboro. Its 36-vertex trace gives the twelve-unit
 *   rhythm and the radii (outer vertices r 24-33, mean ~28; notches r
 *   19-23, mean ~21; measured). The trace is irregular (hand-traced), so
 *   the model is drawn regular.
 * - Published: twelve exterior faces, black frame (es.wikipedia
 *   "Polyforum Cultural Siqueiros"); Foro Universal vault 11 m high,
 *   rotating platform 24 m across (es.wikipedia). No overall height is
 *   published; OSM's 18 m is used for the top of the faces.
 * - Photos (Wikimedia Commons, EVIDENCE):
 *   1 Luisalvaz, "Exterior del Polyforum Cultural Siqueiros 01/03/05/07/09/
 *     10/12/14.jpg", CC BY-SA 4.0 (faces, pleats, columns, lean, the foot
 *     band, the set-back ground floor);
 *     https://commons.wikimedia.org/wiki/File:Exterior_del_Polyforum_Cultural_Siqueiros_01.jpg
 *     https://commons.wikimedia.org/wiki/File:Exterior_del_Polyforum_Cultural_Siqueiros_09.jpg
 *     https://commons.wikimedia.org/wiki/File:Exterior_del_Polyforum_Cultural_Siqueiros_12.jpg
 *   2 AlejandroLinaresGarcia, "PolyforumSiqueiros01.jpg", CC BY-SA 3.0 (the
 *     Insurgentes side, level, with people for scale: faces ~13 m tall from
 *     ~5 m, glazed ground floor and canopy);
 *     https://commons.wikimedia.org/wiki/File:PolyforumSiqueiros01.jpg
 *   3 Keizers, "Polyforum Siquieros and WTC in background.jpg", CC BY-SA 3.0
 *     (one face square on: width ~0.85 of its height, foot ~0.8 of its top);
 *     https://commons.wikimedia.org/wiki/File:Polyforum_Siquieros_and_WTC_in_background.jpg
 *   4 JavierDo, "Polyforum - WTC - panoramio.jpg", CC BY-SA 3.0 (a face's
 *     edge and the lean);
 *     https://commons.wikimedia.org/wiki/File:Polyforum_-_WTC_-_panoramio.jpg
 * - Numbers: faces 5.2-18 m (top from OSM; foot estimated from photo 2);
 *   faces 7 m wide at the top, 5.6 m at the foot (OSM's outer vertex pairs
 *   are 5.5-7 m apart; photos suggest a little wider), leaning out 4.4 m
 *   (estimated, photos 1 and 3); face plane at r 28 (top) / 23.6 (foot),
 *   notch columns at r 19.5 (OSM notch mean ~21, drawn deeper so each
 *   pleat reads as a deep V, as in the photos); ground floor glass r 19, 0.8-4.5
 *   m, canopy to r 21.8; platform 0.8 m, r 21.5 (estimated, photo 2).
 * - Invented / doubtful: the roof. No open photo shows it from above, and
 *   it is hidden behind the faces from the street; it is drawn as a low
 *   two-step dodecagonal faceted roof in the slate grey (OSM says
 *   roof:colour gainsboro; drawn mid-grey so it does not outshine the ring),
 *   kept below the faces' tops (17.7 m) as no street photo shows it. The
 *   mural zones are generalised per face (four patterns, alternated and
 *   mirrored), not traced from each real mural. The outdoor sculpted panels
 *   and statues on the plaza are left out: they are small, and no open
 *   photo places them.
 * - Terrain: Mapterhorn has no z15 terrain here (tools/terrain.ts 404s);
 *   flat lake-bed basin (~2,240 m). Elevation 0.
 * - Look-only: none.
 * - Night: the murals are floodlit from below (Gobierno CDMX event photos
 *   show lit faces); the ground-floor glazing glows as windows.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { slab, save, orient, type XY } from './dc-nmaahc'

const black = new Part(), grey = new Part(), rust = new Part(), ochre = new Part(), win = new Part(), cream = new Part()

const N = 12
const Z0 = 0.8 // platform top
const ZB = 5.2, ZT = 18.0 // faces' foot and top
const RT = 28.0, RB = 23.6 // face plane apothem at top and foot
const WT = 3.5, WB = 2.8 // face half-widths at top and foot
const RN = 19.5 // notch columns
const TH = 0.35 // panel thickness

const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const scl = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const lerp3 = (a: V3, b: V3, t: number): V3 => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]
const unit = (v: V3): V3 => { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l] }
const crs = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
// azimuth (clockwise from model north) to a unit vector in x/y
const dir = (deg: number): XY => [Math.sin((deg * Math.PI) / 180), Math.cos((deg * Math.PI) / 180)]
const polar = (deg: number, r: number, z: number): V3 => { const [x, y] = dir(deg); return [x * r, y * r, z] }

/** A thin plate: front quad bl, br, tr, tl facing `n`, thickness t behind. */
function plate(p: Part, q: V3[], n: V3, t: number) {
  const back = q.map((v) => add(v, scl(n, -t)))
  orient(p, q, n)
  orient(p, [back[0], back[3], back[2], back[1]], scl(n, -1))
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    const m = scl(add(add(q[i], q[j]), [0, 0, 0]), 0.5)
    const c = scl(add(add(q[0], q[1]), add(q[2], q[3])), 0.25)
    orient(p, [q[i], q[j], back[j], back[i]], unit([m[0] - c[0], m[1] - c[1], m[2] - c[2]]))
  }
}

/** A flat polygon on a quad, given in (s, t): s across 0..1, t up 0..1; d proud. */
function onQuad(p: Part, q: V3[], n: V3, poly: [number, number][], d: number) {
  const P = ([s, t]: [number, number]): V3 => add(lerp3(lerp3(q[0], q[1], s), lerp3(q[3], q[2], s), t), scl(n, d))
  const pts = poly.map(P)
  for (let i = 1; i < pts.length - 1; i++) orient(p, [pts[0], pts[i], pts[i + 1]], n)
}
const disc = (cs: number, ct: number, rs: number, rt: number, a0 = 0, a1 = 360, k = 10): [number, number][] => {
  const out: [number, number][] = a1 - a0 < 360 ? [[cs, ct]] : []
  const m = a1 - a0 < 360 ? k : k - 1
  for (let i = 0; i <= m; i++) { const a = ((a0 + ((a1 - a0) * i) / k) * Math.PI) / 180; out.push([cs + rs * Math.cos(a), ct + rt * Math.sin(a)]) }
  return out
}

// Four generalised mural patterns: [part, polygon in (s, t)] over a slate
// field. Dark greys and black dominate (~60%), rust red and ochre are the
// main accents, cream only in small areas, as in the photos.
type Zone = [Part, [number, number][]]
const patterns: Zone[][] = [
  // the sphere: a big black ring with a small cream core, rust sweep, ochre foot
  [
    [black, [[0.06, 0.04], [0.45, 0.04], [0.06, 0.45]]],
    [rust, [[0.06, 0.5], [0.94, 0.3], [0.94, 0.46], [0.06, 0.64]]],
    [black, disc(0.55, 0.72, 0.38, 0.23, 0, 360, 12)],
    [grey, disc(0.55, 0.72, 0.27, 0.16, 0, 360, 12)],
    [cream, disc(0.55, 0.72, 0.13, 0.08, 0, 360, 10)],
    [ochre, [[0.55, 0.04], [0.94, 0.04], [0.94, 0.2]]],
  ],
  // a broad black diagonal sweep, a rust band beside it, an ochre corner
  [
    [black, [[0.06, 0.2], [0.3, 0.04], [0.94, 0.62], [0.94, 0.9]]],
    [rust, [[0.45, 0.04], [0.72, 0.04], [0.94, 0.3], [0.94, 0.5]]],
    [ochre, [[0.06, 0.62], [0.4, 0.96], [0.06, 0.96]]],
    [cream, [[0.62, 0.84], [0.8, 0.9], [0.66, 0.96]]],
  ],
  // figures: a tall ochre form against black, a rust arc, a cream head
  [
    [black, [[0.2, 0.04], [0.8, 0.04], [0.86, 0.96], [0.14, 0.96]]],
    [ochre, [[0.32, 0.04], [0.6, 0.04], [0.68, 0.62], [0.52, 0.8], [0.38, 0.7]]],
    [rust, disc(0.06, 0.5, 0.26, 0.3, -90, 90, 8)],
    [cream, disc(0.52, 0.86, 0.09, 0.06, 0, 360, 8)],
  ],
  // banded: black arcs at the top, a rust band, a black foot, ochre wedge
  [
    [black, disc(0.5, 0.96, 0.46, 0.34, 180, 360, 10)],
    [rust, [[0.06, 0.34], [0.94, 0.42], [0.94, 0.54], [0.06, 0.46]]],
    [black, [[0.06, 0.04], [0.94, 0.04], [0.94, 0.16], [0.06, 0.24]]],
    [ochre, [[0.6, 0.16], [0.94, 0.16], [0.94, 0.36]]],
    [cream, [[0.42, 0.48], [0.58, 0.5], [0.58, 0.55], [0.42, 0.53]]],
  ],
]

for (let k = 0; k < N; k++) {
  const a = k * (360 / N)
  const [fx, fy] = dir(a), [tx, ty] = [fy, -fx] // tangent, clockwise
  const F = (r: number, w: number, z: number): V3 => [fx * r + tx * w, fy * r + ty * w, z]
  // face corners: bl, br, tr, tl seen from outside (left = anticlockwise side)
  const q: V3[] = [F(RB, -WB, ZB), F(RB, WB, ZB), F(RT, WT, ZT), F(RT, -WT, ZT)]
  let n = unit(crs(add(q[1], scl(q[0], -1)), add(q[3], scl(q[0], -1))))
  if (n[0] * fx + n[1] * fy < 0) n = scl(n, -1)
  plate(black, q, n, TH)
  const inner: [number, number][] = [[0.04, 0.03], [0.96, 0.03], [0.96, 0.97], [0.04, 0.97]]
  onQuad(grey, q, n, inner, 0.04)
  const mirror = k % 2 === 1
  for (const [zi, [part, poly]] of patterns[k % 4].entries()) onQuad(part, q, n, poly.map(([s, t]) => [mirror ? 1 - s : s, t] as [number, number]), 0.08 + 0.03 * zi)
  // a black foot band across the face's lower edge
  onQuad(black, q, n, [[0, 0], [1, 0], [1, 0.06], [0, 0.06]], 0.25)

  // the pleat after this face: face edge (br/tr) -> notch column -> next face's (bl/tl)
  const an = a + 360 / N / 2
  const nb = polar(an, RN, ZB), nt = polar(an, RN, ZT + 0.2)
  const [gx, gy] = dir(an)
  const b2 = add(q[1], [0, 0, 0]), t2 = q[2]
  const next = (k + 1) * (360 / N)
  const [hx, hy] = dir(next), [ux, uy] = [hy, -hx]
  const G = (r: number, w: number, z: number): V3 => [hx * r + ux * w, hy * r + uy * w, z]
  const sides: V3[][] = [
    [b2, nb, nt, t2],
    [nb, G(RB, -WB, ZB), G(RT, -WT, ZT), nt],
  ]
  for (const [si, s] of sides.entries()) {
    let sn = unit(crs(add(s[1], scl(s[0], -1)), add(s[3], scl(s[0], -1))))
    const c = scl(add(add(s[0], s[1]), add(s[2], s[3])), 0.25)
    const out: V3 = [gx * 30 - c[0], gy * 30 - c[1], 0]
    if (sn[0] * out[0] + sn[1] * out[1] < 0) sn = scl(sn, -1)
    const qq = si === 0 ? s : s
    plate(black, qq, sn, TH)
    onQuad(grey, qq, sn, [[0.06, 0.03], [0.94, 0.03], [0.94, 0.97], [0.06, 0.97]], 0.04)
    // a rust stripe and a broad black stripe on each pleat panel, mirrored
    const st = (k + si) % 2 === 0
    onQuad(rust, qq, sn, st ? [[0.15, 0.03], [0.5, 0.03], [0.62, 0.97], [0.3, 0.97]] : [[0.45, 0.03], [0.85, 0.03], [0.75, 0.97], [0.4, 0.97]], 0.08)
    onQuad(black, qq, sn, st ? [[0.62, 0.03], [0.94, 0.03], [0.94, 0.97], [0.66, 0.97]] : [[0.06, 0.03], [0.4, 0.03], [0.36, 0.97], [0.06, 0.97]], 0.08)
  }
  // the black steel column in the notch
  const cw = 0.45
  const [px, py] = dir(an)
  const [qx, qy] = [py, -px]
  const col: XY[] = [[px * (RN - cw) - qx * cw, py * (RN - cw) - qy * cw], [px * (RN + cw) - qx * cw, py * (RN + cw) - qy * cw], [px * (RN + cw) + qx * cw, py * (RN + cw) + qy * cw], [px * (RN - cw) + qx * cw, py * (RN - cw) + qy * cw]]
  slab(black, col, Z0, ZT + 0.5, 0.1)
}

// --- Ground floor, canopy and platform -------------------------------------
const ring = (r: number, off = 0): XY[] => Array.from({ length: N }, (_, i) => dir(i * (360 / N) + off).map((v) => v * r) as XY)
slab(cream, ring(21.5, 15), 0, Z0, 0.25) // platform
slab(win, ring(19.0, 15), Z0, 4.5, 0, false) // glazed ground floor
// mullion piers on the glazing, one at each corner of the 12-gon
for (let k = 0; k < N; k++) {
  const [x, y] = dir(k * 30 + 15), [qx, qy] = [y, -x]
  const r = 19.05, w = 0.25
  slab(black, [[x * r - qx * w, y * r - qy * w], [x * (r + 0.3) - qx * w, y * (r + 0.3) - qy * w], [x * (r + 0.3) + qx * w, y * (r + 0.3) + qy * w], [x * r + qx * w, y * r + qy * w]], Z0, 4.5, 0, false)
}
slab(black, ring(21.8, 15), 4.5, ZB, 0.2, black) // the canopy and foot slab

// --- The faceted roof inside the ring --------------------------------------
{
  const steps: [number, number][] = [[18.6, ZB], [18.6, 14.0], [12.4, 15.6], [11.8, 15.6], [11.8, 16.4], [6.0, 17.3], [0.01, 17.7]]
  const R = (r: number, z: number) => Array.from({ length: N }, (_, i) => polar(i * 30 + 15, r / Math.cos(Math.PI / 12), z)).reverse()
  grey.loft(steps.map(([r, z]) => R(r, z)))
}

const lit = (p: V3, n: V3) => (n[2] > 0.6 ? 0.15 : p[2] > ZB - 0.1 ? 0.9 : 0.2)
await save('mexico-city-polyforum-siqueiros', 'Polyforum Cultural Siqueiros', [
  { part: black, material: { ...finish('polyforum-black', 0x4a4f57), floodlight: lit } as any },
  { part: grey, material: { ...finish('polyforum-mural-slate', 0x7d8083), floodlight: lit } as any },
  { part: rust, material: { ...finish('polyforum-mural-rust', 0xb0634f), floodlight: lit } as any },
  { part: ochre, material: { ...finish('polyforum-mural-ochre', 0xb8955e), floodlight: lit } as any },
  { part: win, material: PALETTE.window },
  // cream: the mural's small light accents and the platform
  { part: cream, material: finish('polyforum-cream', 0xd8d2c6) },
], { name: 'Polyforum Cultural Siqueiros' }, 6500)
