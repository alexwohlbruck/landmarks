/**
 * El Cortez, San Diego — 702 Ash Street on Cortez Hill. Walker & Eisen's
 * 1927 Spanish Renaissance (Churrigueresque-trimmed) apartment hotel, now
 * apartments, with its rooftop "EL CORTEZ" sign in red neon.
 *
 * Identity, in order: the red "EL CORTEZ" sign standing on top (EL over
 * CORTEZ); the stepped silhouette — two lower wings splayed forward, the
 * tall slab between, a narrower pilastered tower over its middle, and a
 * smaller crowning stage with finials; the cream stucco with punched
 * windows; the ornate arched entrance frontispiece over the terrace.
 *
 * Frame: bearing 45 — the slab faces south-west, toward 7th Avenue and Ash
 * Street; +x runs along the slab toward the south-east, +y back toward the
 * north-east. Map frame z up, metres; origin at the anchor (−117.1579151,
 * 32.7204475), the centroid of OSM way/132936848; z = 0 is the lowest ground
 * under the outline (its east corner, 0.8 m above the lidar box's
 * ground_min). The site falls ≈ 5 m from the north-west to that corner, so
 * the walls on the uphill side sink into the hill.
 *
 * Sources
 * - OSM way/132936848 (building=apartments, "El Cortez": the whole lot),
 *   parts way/305671135 (wings, height 48 m), way/612697753 (slab, 70 m),
 *   way/305671137 (tower, 94 m, 15 levels). © OSM contributors. The plan is
 *   OSM's; the parts' heights are well above every lidar return and are
 *   not used.
 * - USGS 3DEP lidar CA_SanDiegoQL2_2014 (flown 2014), 1 m grid, read in
 *   this frame (heights above z = 0): wings 29.0 m; slab roof 46.6 m with
 *   an inset rooftop storey to 49.0 m; tower shoulders 58.9 m; crowning
 *   stage 66.6 m; scattered sign returns to 69.8 m. Front podium/terrace
 *   11.7 m with a central projection to ≈ 14 m; rear annex 11.8 m; a low block
 *   behind the east wing ≈ 5.6 m.
 * - USGS NAIP orthophoto: the plan, the terracotta-paved pool deck and
 *   rear roof, the grey main roofs.
 * Photos (evidence):
 * - "ElCortezHotelSanDiegoApr09.jpg", Nehrams2020, CC BY-SA 3.0,
 *   https://commons.wikimedia.org/wiki/File:ElCortezHotelSanDiegoApr09.jpg
 *   (front, from the south-west: massing, tower, crown, sign).
 * - "Cortez Hill, San Diego, CA 92101, USA - panoramio (3)/(4)/(8).jpg",
 *   Roman Eugeniusz, CC BY-SA 3.0,
 *   https://commons.wikimedia.org/wiki/File:Cortez_Hill,_San_Diego,_CA_92101,_USA_-_panoramio_(3).jpg
 *   (front; the sign's letterforms; the entrance frontispiece).
 * - "El Cortez Hotel, San Diego 01–04.jpg", Visitor7, CC BY-SA 3.0,
 *   https://commons.wikimedia.org/wiki/File:El_Cortez_Hotel,_San_Diego_01.jpg
 *   (the north-east side, the sign seen from behind, the frontispiece).
 * - "El Cortez Apartment Hotel.jpg", Los Angeles, CC BY-SA 3.0; "ElCortezHotel.jpg",
 *   Jamie Lantzy, CC BY-SA 3.0; "ElCortezHillSanDiego.jpg", kid_pro_quo
 *   (Flickr), CC BY 2.0 (other sides and distance).
 *
 * Numbers
 * - Plan: OSM parts, measured; z heights: lidar, measured (above).
 * - Bays ≈ 2.8 m (13 across the slab front, counted on Nehrams2020's photo);
 *   windows grouped two storeys a panel (≈ 3.2 m storeys) — estimated.
 * - Tower pilasters, cornices and finials: estimated from Nehrams2020's
 *   photo against the 16 m tower face.
 * - Sign: letters 2.6 m tall, CORTEZ ≈ 13.5 m long (0.82 of the tower's
 *   width), EL above it after a half-letter gap, on a
 *   frame standing on the crown — scaled from Nehrams2020's and Eugeniusz's
 *   photos against the tower (estimated). Letterforms: bold serif capitals,
 *   traced from the same photos. The sign is the landmark's signature, so
 *   per STYLE.md ("Famous signs") its lettering is built, with
 *   generators/lettering.ts, in its own red as `neon-*` (lit red at night).
 * - Frontispiece: ≈ 8 m wide, to ≈ 22 m, semicircular arched door —
 *   estimated from Eugeniusz (8) and Visitor7 (03, 04).
 * - Colours from the daylight photos: cream stucco, dark window glass,
 *   red sign, terracotta deck, grey roofs.
 *
 * Doubts
 * - OSM's heights (48/70/94 m) disagree with the lidar (29/49/67 m to the
 *   crown). 94 m (310 ft) may be the published height to the sign's top,
 *   which the photos don't support; the lidar is followed.
 * - The north-east face is drawn plain; its fire escapes are left out.
 * - The rear annex and the low block behind the east wing are simple
 *   blocks from lidar and NAIP. The outline also covers at-grade pool
 *   terraces and yards (lidar ground), which are not modelled.
 * - No licensed night photo was checked; the sign is lit red from its
 *   reputation as a neon sign.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { qf, tf, save } from './dc-white-house'
import { pslab, ccw, type XY } from './dc-nga-west'
import { Pen, strokes } from './lettering'

const stucco = new Part(), win = new Part(), roof = new Part(), deck = new Part(), neon = new Part(), door = new Part()

// Plan (OSM, this frame).
const SLAB_X0 = -7.2, SLAB_X1 = 29.5, Y0 = -14.1, Y1 = 1.6
const TOW_X0 = 3.8, TOW_X1 = 20.0, TXC = (TOW_X0 + TOW_X1) / 2, TYC = (Y0 + Y1) / 2
const WING_L: XY[] = [[-7.3, -14.0], [-14.7, -21.0], [-24.3, -11.6], [-13.3, 1.4], [-7.2, 1.7]]
const WING_R: XY[] = [[29.5, -14.1], [29.2, 1.6], [34.1, 1.5], [46.8, -11.4], [37.0, -21.3]]
// Heights (lidar, above z = 0).
const WING_Z = 29.0, SLAB_Z = 46.6, PENT_Z = 49.0, TOW_Z = 58.9, CROWN_Z = 66.6
const POD_Z = 11.7

/** Window panels on each long-enough edge of a counter-clockwise ring. */
function facade(ring: XY[], z0: number, z1: number, groups: number, o: { bay?: number; w?: number; skip?: (a: XY, b: XY) => boolean; zmin?: (a: XY, b: XY) => number } = {}) {
  const bay = o.bay ?? 2.8, w = o.w ?? 1.4
  const r = ccw(ring)
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    if (o.skip?.(a, b)) continue
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 4) continue
    const t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: V3 = [t[1], -t[0], 0]
    const P = (s: number, z: number): V3 => [a[0] + t[0] * s + n[0] * 0.04, a[1] + t[1] * s + n[1] * 0.04, z]
    const k = Math.max(1, Math.round((L - 1.6) / bay)), pitch = (L - 1.6) / k
    const zs = Math.max(z0, o.zmin?.(a, b) ?? z0), h = (z1 - zs) / groups
    if (h < 2) continue
    for (let q = 0; q < k; q++) {
      const s = 0.8 + q * pitch + (pitch - w) / 2
      for (let g = 0; g < groups; g++) {
        const sp = Math.min(1.1, h * 0.17), za = zs + g * h + sp, zb = zs + (g + 1) * h - sp
        qf(win, P(s, za), P(s + w, za), P(s + w, zb), P(s, zb), n)
      }
    }
  }
}
const rect = (x0: number, y0: number, x1: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
const onSlabLine = (a: XY, b: XY) => Math.abs(a[0] - b[0]) < 0.6 && (Math.abs(a[0] - SLAB_X0) < 0.5 || Math.abs(a[0] - SLAB_X1) < 0.5)

// Behind the slab: the rear annex, and a low block behind the east wing
// where the ground falls away. The pool terraces on the north-west are at
// grade (lidar ground) and are left to the map.
pslab(stucco, rect(2.0, Y1, 21.0, 20.0), 0, 11.8, 0.3, deck)
facade(rect(2.0, Y1, 21.0, 20.0), 6.4, 11.2, 1, { skip: (a, b) => Math.abs(a[1] - Y1) < 0.1 && Math.abs(b[1] - Y1) < 0.1 })
pslab(stucco, [[21.0, Y1], [36.9, Y1], [27.0, 11.7], [21.0, 11.7]], 0, 5.6, 0.25, deck)
// Front podium with the terrace on top, its central projection, and the
// street-level shops.
const POD: XY[] = [[-9.0, -14.0], [-9.0, -27.0], [33.0, -27.0], [33.0, -14.1]]
pslab(stucco, POD, 0, POD_Z, 0.3, deck)
pslab(stucco, rect(6.0, -33.0, 18.0, -26.9), 0, 13.6, 0.3, deck)
facade(rect(-9.0, -27.0, 33.0, -14.0), 1.2, 9.0, 1, { bay: 3.6, w: 2.4, skip: (a, b) => a[1] > -15 || b[1] > -15 })
// The terrace's parapet.
for (const [x0, x1] of [[-9.0, 6.0], [18.0, 33.0]]) pslab(stucco, rect(x0, -27.0, x1, -26.6), POD_Z, POD_Z + 1.1, 0.15)

// Wings.
for (const w of [WING_L, WING_R]) {
  pslab(stucco, w, 0, WING_Z, 0.5, roof)
  facade(w, 7.0, WING_Z - 1.4, 3, { skip: onSlabLine })
}
// The slab, its rooftop storey, the tower, the crowning stage.
pslab(stucco, rect(SLAB_X0, Y0, SLAB_X1, Y1), 0, SLAB_Z, 0.5, roof)
pslab(stucco, rect(SLAB_X0 + 1.6, Y0 + 1.6, SLAB_X1 - 1.6, Y1 - 1.6), SLAB_Z, PENT_Z, 0.3, roof)
facade(rect(SLAB_X0, Y0, SLAB_X1, Y1), POD_Z + 1.0, SLAB_Z - 1.2, 5, {
  zmin: (a, b) => (Math.abs(a[0] - b[0]) < 0.6 ? WING_Z + 0.5 : a[1] > 0 ? 12.0 : POD_Z + 1.0),
})
pslab(stucco, rect(TOW_X0, Y0, TOW_X1, Y1), SLAB_Z, TOW_Z - 1.0, 0, false)
// Tower cornice, projecting.
pslab(stucco, rect(TOW_X0 - 0.5, Y0 - 0.5, TOW_X1 + 0.5, Y1 + 0.5), TOW_Z - 1.0, TOW_Z, 0.35, roof, true)
facade(rect(TOW_X0, Y0, TOW_X1, Y1), PENT_Z + 0.6, TOW_Z - 1.6, 2, { bay: 3.2, w: 1.6 })
// Pilasters on the tower's faces, between its bays.
for (const [side, at] of [[0, Y0], [0, Y1], [1, TOW_X0], [1, TOW_X1]] as [number, number][]) {
  const L = side === 0 ? TOW_X1 - TOW_X0 : Y1 - Y0, base = side === 0 ? TOW_X0 : Y0
  const k = Math.round((L - 1.6) / 3.2), pitch = (L - 1.6) / k
  for (let q = 0; q <= k; q++) {
    const s = base + 0.8 + q * pitch
    const out = side === 0 ? (at === Y0 ? -1 : 1) : (at === TOW_X0 ? -1 : 1)
    const r: XY[] = side === 0 ? rect(s - 0.35, at, s + 0.35, at + out * 0.35) : rect(at, s - 0.35, at + out * 0.35, s + 0.35)
    pslab(stucco, r, SLAB_Z, TOW_Z - 1.0, 0, true)
  }
}
// Crowning stage, inset, with its own cornice, and finials on both levels.
const CI = 2.0
pslab(stucco, rect(TOW_X0 + CI, Y0 + CI, TOW_X1 - CI, Y1 - CI), TOW_Z, CROWN_Z - 0.8, 0, false)
pslab(stucco, rect(TOW_X0 + CI - 0.4, Y0 + CI - 0.4, TOW_X1 - CI + 0.4, Y1 - CI + 0.4), CROWN_Z - 0.8, CROWN_Z, 0.3, roof, true)
facade(rect(TOW_X0 + CI, Y0 + CI, TOW_X1 - CI, Y1 - CI), TOW_Z + 0.8, CROWN_Z - 1.4, 1, { bay: 3.0, w: 1.3 })
function finial(x: number, y: number, z: number, r: number, h: number) {
  pslab(stucco, rect(x - r, y - r, x + r, y + r), z, z + h * 0.45, 0.1, false)
  const q: V3[] = [[x - r * 0.8, y - r * 0.8, z + h * 0.45], [x + r * 0.8, y - r * 0.8, z + h * 0.45], [x + r * 0.8, y + r * 0.8, z + h * 0.45], [x - r * 0.8, y + r * 0.8, z + h * 0.45]]
  for (let i = 0; i < 4; i++) {
    const a = q[i], b = q[(i + 1) % 4]
    tf(stucco, a, b, [x, y, z + h], [(a[0] + b[0]) / 2 - x, (a[1] + b[1]) / 2 - y, r])
  }
}
for (const [x, y] of [[TOW_X0, Y0], [TOW_X1, Y0], [TOW_X1, Y1], [TOW_X0, Y1]]) finial(x + (x < TXC ? 0.6 : -0.6), y + (y < TYC ? 0.6 : -0.6), TOW_Z, 0.6, 3.0)
for (const x of [TXC - 3.2, TXC + 3.2]) for (const y of [Y0, Y1]) finial(x, y + (y < TYC ? 0.6 : -0.6), TOW_Z, 0.45, 2.2)
for (const [x, y] of [[TOW_X0 + CI, Y0 + CI], [TOW_X1 - CI, Y0 + CI], [TOW_X1 - CI, Y1 - CI], [TOW_X0 + CI, Y1 - CI]]) finial(x, y, CROWN_Z, 0.45, 2.0)

// The entrance frontispiece on the slab's front over the terrace: a
// projecting frame with a semicircular top and the arched door.
{
  const xc = TXC, half = 4.0, z0 = POD_Z, zs = 18.5, yF = Y0 - 0.8
  const seg = 10
  const outline: XY[] = [[xc - half, z0], [xc + half, z0]]
  for (let i = 0; i <= seg; i++) { const a = (i / seg) * Math.PI; outline.push([xc + half * Math.cos(a), zs + half * Math.sin(a)]) }
  // Front face (fan from the bottom centre) and the edges back to the wall.
  const F = (u: number, z: number, y = yF): V3 => [u, y, z]
  const ring = outline.slice(1).concat([outline[0]])
  for (let i = 0; i < ring.length - 1; i++) tf(stucco, F(xc, z0), F(ring[i][0], ring[i][1]), F(ring[i + 1][0], ring[i + 1][1]), [0, -1, 0])
  for (let i = 0; i < ring.length - 1; i++) {
    const a = ring[i], b = ring[i + 1]
    qf(stucco, F(a[0], a[1]), F(b[0], b[1]), F(b[0], b[1], Y0), F(a[0], a[1], Y0), [b[1] - a[1], 0, -(b[0] - a[0])])
  }
  // Arched door: a semicircular-headed opening, flush on the frame.
  const dw = 1.9, dz = z0 + 3.4
  const dpts: XY[] = [[xc - dw, z0], [xc + dw, z0]]
  for (let i = 0; i <= 8; i++) { const a = (i / 8) * Math.PI; dpts.push([xc + dw * Math.cos(a), dz + dw * Math.sin(a)]) }
  for (let i = 1; i < dpts.length - 1; i++) tf(door, F(xc, z0, yF - 0.05), F(dpts[i][0], dpts[i][1], yF - 0.05), F(dpts[i + 1][0], dpts[i + 1][1], yF - 0.05), [0, -1, 0])
}

// The sign: EL over CORTEZ, bold serif capitals, on a frame on the crown,
// facing the front (south-west); readable from the front, reversed behind.
{
  const H = 2.6, SW = 0.6, GAP = 1.3
  const ys = TYC, z0 = CROWN_Z + 1.2
  const serif = (p: Pen, x: number, y: number, w = 0.5) => p.moveTo([x - w, y]).lineTo([x + w, y])
  // Letters in units of the cap height (1), each from x = 0.
  const L: Record<string, [Pen, number]> = {
    E: (() => { const p = new Pen(); p.moveTo([0.12, 0]).lineTo([0.12, 1]); p.moveTo([0.0, 0.95]).lineTo([0.62, 0.95]).lineTo([0.62, 0.8]); p.moveTo([0.12, 0.5]).lineTo([0.48, 0.5]); p.moveTo([0.0, 0.05]).lineTo([0.66, 0.05]).lineTo([0.66, 0.22]); return [p, 0.68] })(),
    L: (() => { const p = new Pen(); p.moveTo([0.14, 0]).lineTo([0.14, 1]); serif(p, 0.14, 0.95, 0.16); p.moveTo([0.0, 0.05]).lineTo([0.62, 0.05]).lineTo([0.62, 0.22]); return [p, 0.64] })(),
    C: (() => { const p = new Pen(); p.moveTo([0.7, 0.78]); p.cubicTo([0.62, 1.02], [0.05, 1.05], [0.04, 0.5], 6).cubicTo([0.05, -0.05], [0.62, -0.02], [0.72, 0.22], 6); p.moveTo([0.7, 0.68]).lineTo([0.7, 0.98]); return [p, 0.76] })(),
    O: (() => { const p = new Pen(); p.circle([0.4, 0.5], 0.36, 0.46, 14); return [p, 0.8] })(),
    R: (() => { const p = new Pen(); p.moveTo([0.12, 0]).lineTo([0.12, 0.95]).lineTo([0.42, 0.95]).cubicTo([0.72, 0.95], [0.72, 0.5], [0.42, 0.5]).lineTo([0.12, 0.5]); p.moveTo([0.36, 0.5]).lineTo([0.68, 0.04]); serif(p, 0.12, 0.05, 0.16); serif(p, 0.68, 0.05, 0.12); return [p, 0.74] })(),
    T: (() => { const p = new Pen(); p.moveTo([0.0, 0.8]).lineTo([0.0, 0.95]).lineTo([0.72, 0.95]).lineTo([0.72, 0.8]); p.moveTo([0.36, 0.95]).lineTo([0.36, 0]); serif(p, 0.36, 0.05, 0.17); return [p, 0.72] })(),
    Z: (() => { const p = new Pen(); p.moveTo([0.04, 0.78]).lineTo([0.04, 0.95]).lineTo([0.64, 0.95]).lineTo([0.06, 0.05]).lineTo([0.66, 0.05]).lineTo([0.66, 0.22]); return [p, 0.7] })(),
  }
  const word = (s: string) => {
    const pen = new Pen(); let x = 0
    for (const ch of s) { const [p, w] = L[ch]; pen.add(p, x, 0); x += w + 0.16 }
    return { pen, width: x - 0.16 }
  }
  const place = (zb: number, x0: number) => (u: number, v: number, w: number): V3 => [x0 + u * H, ys - w, zb + v * H]
  const cortez = word('CORTEZ'), el = word('EL')
  const cx0 = TXC - (cortez.width * H) / 2, ex0 = TXC - (el.width * H) / 2
  const zEL = z0 + H + GAP
  strokes(neon, cortez.pen.paths, { width: SW / H, depth: 0.35, place: place(z0, cx0), back: true })
  strokes(neon, el.pen.paths, { width: SW / H, depth: 0.35, place: place(zEL, ex0), back: true })
  // The frame behind the letters: posts and rails, thin and grey.
  const fr = (x0: number, x1: number, z0b: number, z1b: number) => pslab(roof, rect(x0, ys + 0.05, x1, ys + 0.35), z0b, z1b, 0, true, true)
  for (const x of [cx0 + 0.3, TXC - 1.6, TXC + 1.6, cx0 + cortez.width * H - 0.3]) fr(x - 0.15, x + 0.15, CROWN_Z, x > ex0 - 0.5 && x < ex0 + el.width * H + 0.5 ? zEL + H : z0 + H)
  fr(cx0, cx0 + cortez.width * H, z0 + 0.2, z0 + 0.45)
  fr(cx0, cx0 + cortez.width * H, z0 + H - 0.45, z0 + H - 0.2)
  fr(ex0, ex0 + el.width * H, zEL + 0.2, zEL + 0.45)
}

if (import.meta.main) {
  await save('sd-el-cortez', 'El Cortez', [
    { part: stucco, material: finish('el-cortez-stucco', 0xf0e8d8) },
    { part: win, material: finish('window', 0x5f646b, 0.35) },
    { part: roof, material: PALETTE.roof },
    { part: deck, material: finish('el-cortez-deck', 0xc08a6e) },
    { part: neon, material: finish('neon-el-cortez-red', 0xd2453f, 0.5) },
    { part: door, material: PALETTE.entrance },
  ], { anchor: [-117.1579151, 32.7204475], bearing: 45 }, 6500)
}
