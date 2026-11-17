/**
 * Edificio El Moro (Lotería Nacional), Paseo de la Reforma 1, Mexico City
 * (Manuel Ortiz Monasterio, Bernardo Calderón and Luis Ávila; opened
 * 1946): procedural, CC0-1.0. bun generators/mexico-city-el-moro.ts
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 330: the
 * tower's axis points to compass 150, so its front (the entrance, facing
 * El Caballito and the Reforma / Juárez / Bucareli junction) is the
 * model's -y face, and the plan is symmetric about x = 0. Origin: the area
 * centroid of OSM way/176476753 (lng -99.1500983, lat 19.4360967).
 *
 * Form: a pale cream Art Deco tower, T-shaped in plan (a 14.4 m front
 * slab and a narrow spine behind it), with one broad window bay up the
 * middle of its front between plain piers; two stepped shoulders on each
 * side (lower block to 42.2 m, upper flanks to 51.5 m); a rounded
 * entrance bay at its foot. Two lower wings fan back from it along the
 * two streets, stepping down 27.7 / 24.4 / 20.4 m, faced with tall window
 * strips between piers over a ground storey; red-brown roof terraces.
 * The gold "LN" monogram at the top of the front.
 *
 * Sources
 * - OSM (ODbL): the outline way/176476753 (building:levels=29) and its
 *   parts, read in this frame (measured): way/313853815 (the tower, T plan:
 *   slab x +-7.2, y -22..-15; spine x +-2.4 back to y -4.8; height=107),
 *   way/1139736164 (the lower tower, x +-9.9), 1139736162/63 (upper
 *   flanks), 1139736165/66 (the wing roots), 1139736167/68 (the wings,
 *   height=65), 1139736169/70 (the rear block), 1139736172 (the entrance
 *   bay). Symmetrised about x = 0 (left and right agree within ~1 m).
 * - Published: roof height 65 m, 107 m "maximum" (es.wikipedia, "Edificio
 *   El Moro", infobox; 29 floors). The photos show no 42 m mast, only a
 *   small antenna, so the 107 m is not modelled (doubt: probably wrong in
 *   the infobox and copied to OSM). OSM's 65 m on the wings is the
 *   tower's roof height, not theirs.
 * - Photos (Wikimedia Commons, EVIDENCE):
 *   1 Felipe Alfonso Castillo Vazquez, "Edificio El Moro 2010.JPG",
 *     CC BY-SA 3.0 (level, square-on front: all heights below);
 *     https://commons.wikimedia.org/wiki/File:Edificio_El_Moro_2010.JPG
 *   2 Ymblanter, "El Moro Building.jpg", CC BY-SA 4.0 (from the south-west:
 *     the side steps and the west wing);
 *     https://commons.wikimedia.org/wiki/File:El_Moro_Building.jpg
 *   3 ProtoplasmaKid, "Vista aérea del Edificio Moro 05.jpg", "... 03.jpg",
 *     "... 08.jpg", "... 01.jpg", CC BY-SA 4.0 (drone views of the front
 *     and both sides: plan, wing roofs, shoulders);
 *     https://commons.wikimedia.org/wiki/File:Vista_a%C3%A9rea_del_Edificio_Moro_05.jpg
 *     https://commons.wikimedia.org/wiki/File:Vista_a%C3%A9rea_del_Edificio_Moro_03.jpg
 *     https://commons.wikimedia.org/wiki/File:Vista_a%C3%A9rea_del_Edificio_Moro_08.jpg
 *     https://commons.wikimedia.org/wiki/File:Vista_a%C3%A9rea_del_Edificio_Moro_01.jpg
 *   4 Luis Lemus, "Edificio de la Lotería Nacional.JPG", CC BY-SA 3.0 (the
 *     side of the shaft, portholes and window strips);
 *     https://commons.wikimedia.org/wiki/File:Edificio_de_la_Loter%C3%ADa_Nacional.JPG
 * - Heights (estimated from photo 1, level and with vertical image plane,
 *   scaled so the parapet is the published 65 m roof; the shaft then
 *   comes out 13.6 m wide against OSM's 14.4 m): upper flanks 51.5, lower
 *   shoulders 42.2, window bay 18.8-61.5, entrance bay 18.8 (window band
 *   14.5-16.3), wing roots 27.7, inner wings 24.4, wing ends 20.4, wing
 *   ground storey 5.8.
 * - The rear block (way/1139736169/70) is seen in no licensed photo: it
 *   is drawn plain at 20.4 m and 12 m (invented; doubt).
 * - The old 1936 Lotería building (the low triangular one across Reforma)
 *   is not part of this OSM way or this model.
 * - Terrain: Mapterhorn has no z15 terrain here; flat lake-bed basin
 *   (~2,240 m).
 * - Look-only: none.
 * - Simplified: the window strips are grouped panels (each wing strip is
 *   split once at mid height, the tower's bay every three floors); the
 *   portholes, lamp brackets and the ground-storey details are left out.
 * - Night: windows glow; the tower carries a light floodlight; the LN
 *   monogram is `neon` gold.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { slab, panel, save, type XY } from './dc-nmaahc'
import { qf } from './dc-white-house'

const stone = new Part(), trim = new Part(), win = new Part(), roof = new Part(), terra = new Part(), gold = new Part()

const mx = (r: XY[]): XY[] => r.map(([x, y]) => [-x, y] as XY).reverse()

const TOP = 65.0, FLANK = 51.5, SHOULDER = 42.2
const ROOT = 27.7, WING = 24.4, WEND = 20.4, GROUND = 5.8

// --- Tower --------------------------------------------------------------
// T plan: front slab and spine. Built as one ring (CCW).
const tower: XY[] = [[-7.2, -22.0], [-3.0, -22.0], [-3.0, -21.55], [3.0, -21.55], [3.0, -22.0], [7.2, -22.0], [7.2, -15.0], [2.4, -15.0], [2.4, -4.8], [-2.4, -4.8], [-2.4, -15.0], [-7.2, -15.0]]
slab(stone, tower, 0, TOP - 0.6, 0, roof)
// parapet cap, trim
slab(trim, tower, TOP - 0.6, TOP, 0.25, roof)
// the lower tower (shoulders) and upper flanks
const lower: XY[] = [[-9.9, -20.7], [9.9, -20.7], [9.4, -14.5], [7.1, -4.3], [6.3, 0.9], [-6.3, 0.9], [-7.1, -4.3], [-9.4, -14.5]]
slab(stone, lower, 0, SHOULDER, 0.4, roof)
const flankR: XY[] = [[2.3, -15.1], [9.0, -14.6], [7.1, -4.4], [2.3, -4.8]]
slab(stone, flankR, SHOULDER, FLANK, 0.35, roof)
slab(stone, mx(flankR), SHOULDER, FLANK, 0.35, roof)

// Front window bay: recessed 0.45, three strips (two slim stone mullions),
// grouped by thin trim spandrels every three floors.
{
  const y = -22.0, x0 = -3.0, x1 = 3.0, z0 = 18.8, z1 = 61.5, d = 0.45
  // the bay is a notch in the tower's plan; close it above the windows
  slab(stone, [[x0, y], [x1, y], [x1, y + d], [x0, y + d]], z1, TOP - 0.6, 0, false)
  const S: V3 = [0, -1, 0], E: V3 = [1, 0, 0], W: V3 = [-1, 0, 0], U: V3 = [0, 0, 1], Dn: V3 = [0, 0, -1]
  qf(win, [x0, y + d - 0.01, z0], [x1, y + d - 0.01, z0], [x1, y + d - 0.01, z1], [x0, y + d - 0.01, z1], S)
  for (const xm of [-1.0, 1.0]) {
    const a = xm - 0.28, b = xm + 0.28, yy = y + d, yf = y + 0.12
    qf(stone, [a, yf, z0], [b, yf, z0], [b, yf, z1], [a, yf, z1], S)
    qf(stone, [a, yf, z0], [a, yy, z0], [a, yy, z1], [a, yf, z1], W)
    qf(stone, [b, yf, z0], [b, yy, z0], [b, yy, z1], [b, yf, z1], E)
  }
  for (const zs of [29.5, 40.2, 50.9]) {
    qf(trim, [x0, y + 0.2, zs - 0.3], [x1, y + 0.2, zs - 0.3], [x1, y + 0.2, zs + 0.3], [x0, y + 0.2, zs + 0.3], S)
    qf(trim, [x0, y + 0.2, zs - 0.3], [x1, y + 0.2, zs - 0.3], [x1, y + d, zs - 0.3], [x0, y + d, zs - 0.3], Dn)
    qf(trim, [x0, y + 0.2, zs + 0.3], [x1, y + 0.2, zs + 0.3], [x1, y + d, zs + 0.3], [x0, y + d, zs + 0.3], U)
  }
}
// side strips on the slab's flanks (above the shoulders) and the flanks' fronts
for (const s of [-1, 1]) {
  const x = s * 7.2
  const a: XY = s > 0 ? [x, -22.0] : [x, -15.0], b: XY = s > 0 ? [x, -15.0] : [x, -22.0]
  panel(win, a, b, 0.36, 0.64, SHOULDER + 1.5, 61.5, 0.05)
  // upper flank front (y = -14.6..-15.1 face, x 7.2..9.0): narrow strip
  const fa: XY = s > 0 ? [7.2, -14.85] : [-9.0, -14.6], fb: XY = s > 0 ? [9.0, -14.6] : [-7.2, -14.85]
  panel(win, fa, fb, 0.3, 0.7, SHOULDER + 1.0, FLANK - 1.2, 0.06)
  // flank outer side strip
  const oa: XY = s > 0 ? [9.0, -14.6] : [-7.1, -4.4], ob: XY = s > 0 ? [7.1, -4.4] : [-9.0, -14.6]
  panel(win, oa, ob, 0.35, 0.65, SHOULDER + 1.0, FLANK - 1.2, 0.05)
  // lower shoulder side: a tall strip
  const la: XY = s > 0 ? [9.9, -20.7] : [-9.4, -14.5], lb: XY = s > 0 ? [9.4, -14.5] : [-9.9, -20.7]
  panel(win, la, lb, 0.3, 0.7, GROUND + 3, SHOULDER - 2.5, 0.05)
}
// spine back above the shoulders
panel(win, [2.4, -4.8], [-2.4, -4.8], 0.3, 0.7, SHOULDER + 1.5, 61.5, 0.05)

// Entrance bay: a rounded block on the front, window band, door.
{
  const R = 1.1, x0 = -5.0, x1 = 5.0, yb = -21.6, yf = -23.2
  const ring: XY[] = []
  ring.push([x1, yb])
  for (let i = 0; i <= 4; i++) { const t = -(Math.PI / 2) * (i / 4); ring.push([x1 - R + R * Math.cos(t), yf + R + R * Math.sin(t)]) }
  for (let i = 0; i <= 4; i++) { const t = -Math.PI / 2 - (Math.PI / 2) * (i / 4); ring.push([x0 + R + R * Math.cos(t), yf + R + R * Math.sin(t)]) }
  ring.push([x0, yb])
  slab(stone, ring.reverse(), 0, 18.8, 0.3, roof)
  panel(win, [-3.2, yf], [3.2, yf], 0, 1, 14.5, 16.3, 0.05)
  panel(win, [-1.6, yf], [1.6, yf], 0, 1, 0.4, 7.2, 0.05)
  // porch hood over the door
  slab(trim, [[-2.6, yf - 0.9], [2.6, yf - 0.9], [2.6, yf], [-2.6, yf]], 7.4, 8.0, 0.15)
}

// LN monogram at the top of the front, gold (lit).
{
  const y = -22.1, zb = 62.0
  const bar = (xa: number, za: number, xb: number, zb2: number, w: number) => {
    // a flat bar from (xa,za) to (xb,zb2), w wide, 0.25 proud
    const dx = xb - xa, dz = zb2 - za, l = Math.hypot(dx, dz), nx = (-dz / l) * w / 2, nz = (dx / l) * w / 2
    const P = (x: number, z: number, d: number): V3 => [x, y - d, z]
    const A = [xa + nx, za + nz], B = [xb + nx, zb2 + nz], C = [xb - nx, zb2 - nz], D = [xa - nx, za - nz]
    const pts = [A, B, C, D]
    // front face (-y)
    gold.quad(P(D[0], D[1], 0.25), P(C[0], C[1], 0.25), P(B[0], B[1], 0.25), P(A[0], A[1], 0.25))
    for (let i = 0; i < 4; i++) {
      const u = pts[i], v = pts[(i + 1) % 4]
      gold.quad(P(u[0], u[1], 0), P(v[0], v[1], 0), P(v[0], v[1], 0.25), P(u[0], u[1], 0.25))
    }
  }
  // L
  bar(-1.15, zb, -1.15, zb + 2.4, 0.5)
  bar(-1.4, zb + 0.25, 0.1, zb + 0.25, 0.5)
  // N, offset up and right, interlocking
  bar(0.0, zb + 0.6, 0.0, zb + 2.4, 0.45)
  bar(0.0, zb + 2.4, 1.2, zb + 0.6, 0.45)
  bar(1.2, zb + 0.6, 1.2, zb + 2.6, 0.45)
}

// --- Wings ---------------------------------------------------------------
const root: XY[] = [[6.3, 0.9], [7.1, -4.3], [9.4, -14.5], [9.7, -17.3], [15.0, -15.7], [13.1, -10.3], [10.8, -4.1], [9.2, 1.3]]
const inner: XY[] = [[9.2, 1.3], [10.8, -4.1], [13.1, -10.3], [15.0, -15.7], [20.2, -13.6], [24.5, -10.8], [21.5, 5.7], [19.9, 4.4], [17.0, 2.6], [14.7, 1.8], [11.6, 1.2]]
const outer: XY[] = [[24.5, -10.8], [28.4, -8.3], [32.0, -5.1], [28.4, -1.9], [25.5, 1.5], [25.3, 3.8], [23.6, 5.4], [21.5, 5.7]]
for (const m of [false, true]) {
  const T = (r: XY[]) => (m ? mx(r) : r)
  slab(stone, T(root), 0, ROOT - 0.5, 0.3, terra)
  slab(trim, T(root), ROOT - 0.5, ROOT, 0.2, terra)
  slab(stone, T(inner), 0, WING - 0.5, 0.3, terra)
  slab(trim, T(inner), WING - 0.5, WING, 0.2, terra)
  slab(stone, T(outer), 0, WEND - 0.5, 0.3, terra)
  slab(trim, T(outer), WEND - 0.5, WEND, 0.2, terra)
}
// a narrow front piece between the lower tower and the wing root
for (const m of [false, true]) {
  const r: XY[] = [[9.4, -14.5], [9.9, -20.7], [10.6, -20.6], [10.0, -17.0]]
  slab(stone, m ? mx(r) : r, 0, ROOT - 0.5, 0.2, terra)
}

// Wing facades: on each front edge, tall window strips between piers over
// a ground storey of broad windows; split once at mid height.
function stripsOn(a: XY, b: XY, top: number, pitch = 2.2, w = 1.2) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  const n = Math.max(1, Math.floor((L - 0.8) / pitch))
  const used = n * pitch, t0 = (L - used) / 2 / L
  const zTop = top - 2.6, zMid = (GROUND + 1.0 + zTop) / 2
  for (let i = 0; i < n; i++) {
    const c = t0 + ((i + 0.5) * pitch) / L, h = w / 2 / L
    panel(win, a, b, c - h, c + h, GROUND + 1.0, zMid - 0.35, 0.05)
    panel(win, a, b, c - h, c + h, zMid + 0.35, zTop, 0.05)
  }
  // ground storey: broad windows
  const g = Math.max(1, Math.floor(L / 4.2))
  for (let i = 0; i < g; i++) {
    const c0 = (i + 0.18) / g, c1 = (i + 0.82) / g
    panel(win, a, b, c0, c1, 1.2, GROUND - 1.0, 0.05)
  }
}
const edgesOf = (ring: XY[], pick: (a: XY, b: XY) => boolean, top: number) => {
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    if (pick(a, b)) stripsOn(a, b, top)
  }
}
for (const m of [false, true]) {
  const T = (r: XY[]) => (m ? mx(r) : r)
  // fronts: the street edges (outward-facing edges with y < ~0)
  const isFront = (a: XY, b: XY) => Math.hypot(b[0] - a[0], b[1] - a[1]) > 2.5 && (a[1] + b[1]) / 2 < -2
  const isBack = (a: XY, b: XY) => Math.hypot(b[0] - a[0], b[1] - a[1]) > 3.5 && (a[1] + b[1]) / 2 > -2
  // root front: edge (9.7,-17.3)->(15,-15.7)
  edgesOf(T(root), (a, b) => isFront(a, b) && Math.abs(a[0]) > 9.5 && Math.abs(b[0]) > 9.5 && Math.min(a[1], b[1]) < -15, ROOT)
  edgesOf(T(inner), isFront, WING)
  edgesOf(T(outer), (a, b) => isFront(a, b) || isBack(a, b), WEND)
  edgesOf(T(inner), (a, b) => isBack(a, b) && Math.abs(a[0]) > 12, WING)
}

// --- Rear block (no photo: plain) -----------------------------------------
const rear: XY[] = [[-9.7, 18.6], [-14.3, 13.9], [-19.4, 8.6], [-18.4, 8.0], [-14.6, 5.0], [-11.7, 3.1], [-9.2, 1.3], [-6.3, 0.9], [6.3, 0.9], [9.2, 1.3], [11.6, 1.2], [14.7, 1.8], [17.0, 2.6], [19.9, 4.4], [21.5, 5.7], [12.6, 15.1], [8.4, 19.4], [-0.1, 10.4]]
slab(stone, rear, 0, WEND - 0.5, 0.3, terra)
slab(trim, rear, WEND - 0.5, WEND, 0.2, terra)
const tip: XY[] = [[-0.1, 10.4], [8.4, 19.4], [8.5, 21.6], [6.4, 22.2], [5.9, 24.3], [3.1, 25.3], [3.1, 28.0], [1.5, 29.6], [-0.3, 30.1], [-2.3, 29.5], [-3.7, 27.6], [-3.7, 25.8], [-5.4, 26.1], [-6.6, 24.6], [-6.3, 23.2], [-7.4, 22.0], [-9.0, 21.9], [-10.0, 20.6], [-9.7, 18.6]]
slab(stone, tip, 0, 12, 0.3, terra)
stripsOn([21.5, 5.7], [12.6, 15.1], WEND)
stripsOn([-14.3, 13.9], [-19.4, 8.6], WEND)

// ---------------------------------------------------------------------------
const towerLit = (p: V3, n: V3) => (n[2] > 0.7 ? 0 : p[2] > SHOULDER ? 0.55 : p[2] > ROOT ? 0.3 : 0)
await save('mexico-city-el-moro', 'Edificio El Moro', [
  { part: stone, material: { ...PALETTE.stone, floodlight: towerLit } as any },
  { part: trim, material: PALETTE.trim },
  { part: win, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
  { part: terra, material: finish('moro-roof-terrace', 0xa86b58) },
  { part: gold, material: finish('neon-ln-gold', 0xd9b13b, 0.5) },
], { name: 'Edificio El Moro' }, 6500)
