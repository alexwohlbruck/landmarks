/**
 * Old Town Hall (Staroměstská radnice) with the Astronomical Clock, Prague —
 * procedural, CC0-1.0, no textures.
 * bun generators/prague-old-town-hall.ts   (after prague-charles-bridge.ts, whose kit it uses)
 *
 * The hall is a row of medieval houses on the west side of Old Town Square,
 * bought by the town one by one: from the east, Wolflin's house with the
 * tower (1364), the Kříž house with its Renaissance window "PRAGA CAPUT
 * REGNI", Mikeš's house, U Kohouta and the houses toward Malé náměstí. The
 * square tower (69.5 m) carries a corbelled gallery (1805–07), four corner
 * turrets and a steep slate roof; on its south face the Astronomical Clock
 * (orloj, 1410) in its late-Gothic stone frame, and above it the chapel's
 * oriel; on its east side the chapel (1381) with its five-sided bay and the
 * last bay of the neo-Gothic wing burnt in May 1945.
 *
 * Frame: map frame x east, y north, z up, metres; bearing 0. Anchor
 * 14.42029, 50.08698 (the lead's anchor, the outline's centroid). The row of
 * houses runs 27° north of east (its square front faces south-south-east);
 * the tower is turned 24°. z = 0 is the square: Mapterhorn z14 varies by
 * under 1 m over the site, so every wall stands on z = 0.
 *
 * Replaces: the outline way/255771323 and every part inside it: houses
 * 754559121, 754559123, 754559124, 479289488, 1229641326, 479289484–479289487,
 * the tower way/391354925 with 481986568 (the clock's frame), 481986569
 * (roof), 481986570–481986573 (turrets), 481986574 (gallery), 482235438 (the
 * oriel); the north wing 462411198, 462411199; the chapel 321115101 and its
 * bay 482235437.
 *
 * Sources
 * - OSM (© OpenStreetMap contributors): outline way/255771323 (h 22, 4
 *   levels, gabled roof 7 m, roof firebrick); tower way/391354925 (h 41)
 *   with gallery 41–44, roof 44–60 hipped across, four corner turrets 40–52
 *   with 8 m pyramids; the clock frame 481986568 (projecting 2 m on the
 *   south face, h 16); the oriel 482235438 (copper, 14–25, round plan 2.2 m
 *   on the south face); the chapel 321115101 (h 20) and its bay 482235437
 *   (8–27, pyramidal 7 m); the north wing 462411198 (h 18); the house parts
 *   754559121 (5 levels), 754559123 (4, orange), 754559124 (4).
 * - Published: Czech Wikipedia "Staroměstská radnice": tower 69.5 m; the
 *   order of the houses (Wolflin, Kříž, Mikeš, U Kohouta, U Minuty); the
 *   gallery of 1805–07; the chapel's five-sided oriel; the 1945 fire.
 * - Mapterhorn terrain z14: flat to within 1 m.
 * Photos (evidence, Wikimedia Commons):
 * - Jakub Hałun, "20190816 Ratusz staromiejski w Pradze 1147 5234.jpg", CC
 *   BY-SA 4.0 (the tower from the east: gallery arcade, turrets, roof with
 *   dormers and finials, the clock dial, the chapel and its bay, the red
 *   neo-Gothic bay): https://commons.wikimedia.org/wiki/File:20190816_Ratusz_staromiejski_w_Pradze_1147_5234.jpg
 * - Diliff, "Prague Old Town Square, Czech Republic - Oct 2010.jpg", CC
 *   BY-SA 3.0 (the row of houses and the tower from the south-west at
 *   night: red Kříž house with its window, white houses, roofline, dormers,
 *   the clock and oriel, the two upper clock dials):
 *   https://commons.wikimedia.org/wiki/File:Prague_Old_Town_Square,_Czech_Republic_-_Oct_2010.jpg
 * - Alvesgaspar, "Old Town Hall Prague September 2016-1.jpg", CC BY-SA 4.0
 *   (the Kříž window: three lights in a stone frame, the arched crest above):
 *   https://commons.wikimedia.org/wiki/File:Old_Town_Hall_Prague_September_2016-1.jpg
 * - Dietmar Rabich, "Prag, Altstädter Rathaus -- 2019 -- 6723.jpg", CC BY-SA
 *   4.0; Richard Mortel, "Old Town Hall, Prague (11) (26274818505).jpg", CC
 *   BY 2.0; Szczecinolog, "Staroměstská radnice in Prague, 2018.jpg", CC
 *   BY-SA 4.0 (the clock, the facades).
 *
 * Numbers
 * - Tower body 10.6 × 10.1 m (between OSM's 11.3 × 10.7, which takes in the
 *   clock and chapel walls, and Wikipedia's 8.37 × 7.91 inside the
 *   gallery's base), corbel at 44.5, gallery parapet 48, roof 47.5 → 64.5,
 *   finials to 69.5 (the published height): OSM's part heights scaled up to
 *   the published total, the roof and turret proportions from Hałun's photo.
 * - The orloj: astronomical dial 4.3 m across (4.8 m with its gilt rim) at 8.2 m,
 *   calendar dial 3.2 m at 3.6 m, frame 5.8 m wide to 12.6 m with a dark carved
 *   surround and a canopy to 15 m; drawn at the top of the real size and with
 *   strong contrast (lead's review) so it reads at 200 px to 12 m with a pitched canopy (estimated from
 *   the photos against the tower's width).
 * - Houses: eaves 15.5–17 m, roofs 7 m (OSM), three window storeys.
 *
 * Simplified / doubts
 * - Sculpture on the clock (apostles, skeleton, the Turk) and on the chapel
 *   bay is left out; the dials are flat coloured discs and rings.
 * - The houses' facades are reduced to window panels and the Kříž window; U
 *   Minuty's sgraffito house is a separate OSM building and not part of
 *   this model.
 * - The western tail of the outline toward Malé náměstí is one plain house.
 */
import { Part, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import { tube, bead } from './bridge-kit'
import { frame, face, faceOut, box, ring, loft, spire, hipRoof, gableRoof, pointedZ, panel, saveLods, dropToZero, type Xf } from './prague-charles-bridge'

const STONE = finish('radnice-sandstone', 0x8a7d6c)
const PLASTER = finish('radnice-plaster', 0xeee1c8)
const TILE = { ...PALETTE.terracotta, name: 'terracotta' }
const SLATE = finish('radnice-slate', 0x5d646b)
const CLOCK = finish('orloj-blue', 0x2c66b4)

const TH = 27 // the row's angle, degrees north of east
const ROW = frame(0, 0, 0, TH)
const toRow = (x: number, y: number): [number, number] => {
  const a = (TH * Math.PI) / 180
  return [x * Math.cos(a) + y * Math.sin(a), -x * Math.sin(a) + y * Math.cos(a)]
}
void toRow

/** A disc (n-gon) on a plane through c spanned by unit vectors a (across) and b (up). */
function disc(p: Part, c: V3, a: V3, b: V3, r: number, n: number, out: V3, r0 = 0) {
  const P = (rr: number, k: number): V3 => {
    const t = (2 * Math.PI * k) / n
    return [c[0] + rr * (Math.cos(t) * a[0] + Math.sin(t) * b[0]), c[1] + rr * (Math.cos(t) * a[1] + Math.sin(t) * b[1]), c[2] + rr * (Math.cos(t) * a[2] + Math.sin(t) * b[2])]
  }
  if (r0 <= 0) return face(p, Array.from({ length: n }, (_, k) => P(r, k)), out)
  for (let k = 0; k < n; k++) face(p, [P(r0, k), P(r0, k + 1), P(r, k + 1), P(r, k)], out)
}

function build(D: boolean) {
  const stone = new Part(), plaster = new Part(), tile = new Part(), slate = new Part(), win = new Part(), clock = new Part()

  // ---- The houses, in the row's frame (u along the square front, v back; the front at v = −10.9).
  const V0 = -10.9, V1 = 10.1
  type House = { u0: number; u1: number; eave: number; wall: Part; name: string; v1?: number }
  const houses: House[] = [
    { u0: 8.4, u1: 21.4, eave: 15.5, wall: plaster, name: 'Wolflin' }, // 754559124
    { u0: -4.1, u1: 8.4, eave: 15.5, wall: tile, name: 'Kříž' }, // 754559123, the red house with the window
    { u0: -19.9, u1: -4.1, eave: 17.0, wall: plaster, name: 'Mikeš, U Kohouta' }, // 754559121
    { u0: -29.5, u1: -19.9, eave: 16.0, wall: plaster, name: 'west' }, // the outline's west end
  ]
  for (const h of houses) {
    const cu = (h.u0 + h.u1) / 2, hu = (h.u1 - h.u0) / 2, cv = (V0 + V1) / 2, hv = (V1 - V0) / 2
    const F: Xf = (u, v, w) => ROW(cu + u, cv + v, w)
    box(h.wall, F, -hu, hu, -hv, hv, 0, h.eave, 'b t')
    // gabled roof along the row, its ends hidden against the neighbours (end walls drawn in the house's colour)
    gableRoof(tile, h.wall, F, 0, 0, hu, hv, h.eave, h.eave + 7, 0.35)
    // windows: three storeys over a ground floor, a panel per real bay
    const n = Math.max(2, Math.round((2 * hu) / 3.4))
    for (let k = 0; k < n; k++) {
      const a = -hu + (2 * hu * (k + 0.5)) / n
      for (const [w0, w1] of [[5.0, 7.4], [8.6, 10.8], [12.0, 14.0]]) {
        if (h.name === 'Kříž' && w0 === 5.0) continue
        panel(win, F, hu, hv, 'v0', a, 0.6, w0 + (h.eave > 16 ? 0.4 : 0), w1 + (h.eave > 16 ? 0.4 : 0), false, 0.04)
      }
      if (D) panel(win, F, hu, hv, 'v1', a, 0.6, 8.6, 10.8, false, 0.04)
    }
    // dormers on the front slope
    if (D) {
      const nd = Math.max(1, Math.round(hu / 3.5))
      for (let k = 0; k < nd; k++) {
        const a = -hu + (2 * hu * (k + 0.5)) / nd
        const vv = -hv * 0.45, zb = h.eave + 7 * (1 - 0.45) - 0.4
        box(h.wall, F, a - 0.8, a + 0.8, vv - 1.0, vv + 0.6, zb, zb + 1.9, 'b')
        gableRoof(tile, h.wall, (u, v, w) => F(a + v, vv - 0.2 + u, w), 0, 0, 0.9, 0.95, zb + 1.9, zb + 2.8, 0.1)
        panel(win, (u, v, w) => F(a + u, vv - 0.2 + v, w), 0.8, 0.8, 'v0', 0, 0.45, zb + 0.4, zb + 1.5, false, 0.03)
      }
    }
    // the ground floor: doors and shop windows
    for (let k = 0; k < n; k += 2) panel(win, F, hu, hv, 'v0', -hu + (2 * hu * (k + 0.5)) / n, 0.8, 0, 3.2, true, 0.04, D ? 4 : 2)
  }
  // The Kříž window: three lights in a stone frame, a crest in an arch above.
  {
    const h = houses[1], cu = (h.u0 + h.u1) / 2
    const F: Xf = (u, v, w) => ROW(cu + u, V0 - v, w)
    box(stone, F, -3.2, 3.2, 0, 0.35, 4.2, 4.6, 'v0') // sill
    box(stone, F, -2.6, 2.6, 0, 0.3, 7.6, 8.4, 'v0') // lintel
    for (const s of [-2.6, -0.95, 0.95, 2.6]) box(stone, F, s - 0.18, s + 0.18, 0, 0.25, 4.6, 7.6, 'v0')
    for (const [a, hw] of [[-1.78, 0.62], [0, 0.78], [1.78, 0.62]]) face(win, [F(a - hw, 0.12, 4.7), F(a + hw, 0.12, 4.7), F(a + hw, 0.12, 7.5), F(a - hw, 0.12, 7.5)], ROW(0, -1, 0))
    const arc = (r: number, k: number, n: number): [number, number] => [r * Math.cos((Math.PI * k) / n), 8.4 + r * Math.sin((Math.PI * k) / n)]
    const n = D ? 10 : 5
    for (let k = 0; k < n; k++) {
      const [a0, z0] = arc(1.5, k, n), [a1, z1] = arc(1.5, k + 1, n), [b0, y0] = arc(1.15, k, n), [b1, y1] = arc(1.15, k + 1, n)
      face(stone, [F(b0, 0.25, y0), F(b1, 0.25, y1), F(a1, 0.25, z1), F(a0, 0.25, z0)], ROW(0, -1, 0))
      face(tile, [F(0, 0.15, 8.4), F(b1, 0.15, y1), F(b0, 0.15, y0)], ROW(0, -1, 0))
    }
  }

  // ---- The tower (OSM way/391354925), turned 24°, centre (27.05, 7.27).
  const FT = frame(27.05, 7.27, 0, 24)
  const hu = 5.3, hv = 5.05, CB = 44.5, GAL = 48, co = 0.6
  box(stone, FT, -hu, hu, -hv, hv, 0, CB, 'b t')
  // a cornice where the ashlar upper stage begins, and the corbel table
  const ring4 = (u: number, v: number, w: number) => [FT(-u, -v, w), FT(u, -v, w), FT(u, v, w), FT(-u, v, w)]
  const mid = FT(0, 0, CB)
  for (const [z0, z1, o] of D ? [[31.6, 32.1, 0.2], [CB - 0.8, CB, co]] : [[CB - 0.8, CB, co]]) {
    const a = ring4(hu, hv, z0), b = ring4(hu + o, hv + o, z0 + 0.2), c = ring4(hu + o, hv + o, z1), d = ring4(hu, hv, z1)
    for (let i = 0; i < 4; i++) {
      const j = (i + 1) % 4
      faceOut(stone, [a[i], a[j], b[j], b[i]], FT(0, 0, z0 + 3))
      faceOut(stone, [b[i], b[j], c[j], c[i]], mid)
      face(stone, [c[i], c[j], d[j], d[i]], [0, 0, 1])
    }
  }
  // the gallery: an arcade between piers, a parapet, its floor
  {
    const ou = hu + co, ov = hv + co, iu = ou - 0.45, iv = ov - 0.45
    const ro = ring4(ou, ov, CB), rt = ring4(ou, ov, GAL), ri = ring4(iu, iv, GAL), rf = ring4(iu, iv, CB + 0.6)
    for (let i = 0; i < 4; i++) {
      const j = (i + 1) % 4
      faceOut(stone, [ro[i], ro[j], rt[j], rt[i]], mid)
      face(stone, [rt[i], rt[j], ri[j], ri[i]], [0, 0, 1])
      faceOut(stone, [ri[j], ri[i], rf[i], rf[j]], FT(0, 0, 80))
    }
    face(stone, rf, [0, 0, 1])
    for (const f of ['u0', 'u1', 'v0', 'v1'] as const) {
      const half = (f[0] === 'u' ? ov : ou) - 0.9, n = D ? 6 : 3, wdt = (2 * half) / n
      for (let k = 0; k < n; k++) panel(win, FT, ou, ov, f, -half + wdt * (k + 0.5), wdt * 0.33, CB + 1.1, GAL - 0.7, true, 0.04, D ? 4 : 2)
    }
    // the corner turrets, corbelled out from the gallery
    for (const [su, sv] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
      const cu = su * (ou - 0.2), cv = sv * (ov - 0.2), n = D ? 8 : 4, r = 0.85
      loft(stone, [ring(FT, cu, cv, 0.3, 0.3, CB - 2.5, n, Math.PI / n), ring(FT, cu, cv, r, r, CB - 0.5, n, Math.PI / n), ring(FT, cu, cv, r, r, GAL + 1.0, n, Math.PI / n)])
      spire(slate, FT, cu, cv, r * 1.08, GAL + 1.0, 62, n)
      if (D) { tube(stone, [FT(cu, cv, 61.6), FT(cu, cv, 63.2)], 0.05, 4); bead(stone, FT(cu, cv, 62.8), 0.17) }
    }
    // the roof (OSM: hipped, ridge across), its dormers and two finials
    hipRoof(slate, FT, 0, 0, 3.9, 3.7, 2.4, GAL - 0.5, 64.5, true)
    for (const s of [-1, 1]) {
      tube(stone, [FT(s * 1.2, 0, 64.3), FT(s * 1.2, 0, 69.5)], D ? 0.07 : 0.12, D ? 4 : 3)
      if (D) bead(stone, FT(s * 1.2, 0, 67.6), 0.32)
    }
    if (D) for (const f of ['v0', 'v1'] as const) {
      // the big dormer on each long slope (Hałun's photo)
      const sv = f === 'v0' ? -1 : 1
      const z0 = 53.5, vv = sv * 3.7 * (1 - (z0 - 47.5) / 17)
      box(slate, FT, -1.1, 1.1, Math.min(vv, vv + sv * 0.9), Math.max(vv, vv + sv * 0.9) , z0, z0 + 2.4, 'b')
      panel(win, (u, v, w) => FT(u, vv + sv * 0.9 + v * sv, w), 0, 0, 'v1', 0, 0.7, z0 + 0.3, z0 + 2.2, true, 0.02, 4)
      spire(slate, (u, v, w) => FT(u, vv + sv * 0.45 + v, w), 0, 0, 1.2, z0 + 2.4, z0 + 4.2, 4, Math.PI / 4)
    }
  }
  // tower clock dials below the gallery on the four faces
  for (const f of ['u0', 'u1', 'v0', 'v1'] as const) {
    const half = f[0] === 'u' ? hv : hu
    void half
    const nrm = sub3(FT(f === 'u1' ? 1 : f === 'u0' ? -1 : 0, f === 'v1' ? 1 : f === 'v0' ? -1 : 0, 0), FT(0, 0, 0))
    const c = pt(FT, hu, hv, f, 0, 38.5, 0.06)
    const across = sub3(pt(FT, hu, hv, f, 1, 38.5, 0), pt(FT, hu, hv, f, 0, 38.5, 0))
    disc(slate, c, across, [0, 0, 1], 1.7, D ? 16 : 8, nrm)
    disc(stone, [c[0] + nrm[0] * 0.02, c[1] + nrm[1] * 0.02, c[2]], across, [0, 0, 1], 1.95, D ? 16 : 8, nrm, 1.7)
  }
  // windows and the entrance portal
  panel(win, FT, hu, hv, 'v0', -2.4, 0.9, 0, 4.2, true, 0.05, D ? 6 : 2)
  for (const f of ['u1', 'u0', 'v1'] as const) for (const w0 of [18, 26]) panel(win, FT, hu, hv, f, 0, 0.55, w0, w0 + 3.2, true, 0.04, D ? 4 : 2)
  panel(win, FT, hu, hv, 'v0', -2.0, 0.55, 26, 29.2, true, 0.04, D ? 4 : 2)

  // ---- The Astronomical Clock on the south face (OSM 481986568 projects 2 m).
  {
    const ua = 1.4
    const S = (a: number, d: number, w: number) => FT(ua + a, -hv - d, w)
    const out = sub3(FT(0, -1, 0), FT(0, 0, 0))
    box(stone, S, -2.9, 2.9, 0, 1.3, 0, 12.6, 'b v0')
    // the dark carved surround the dials sit in
    face(slate, [S(-2.55, 1.32, 1.7), S(2.55, 1.32, 1.7), S(2.55, 1.32, 11.4), S(-2.55, 1.32, 11.4)], out)
    // the pitched canopy over the frame
    gableRoof(slate, stone, (u, v, w) => S(u, 0.65 + v, w), 0, 0, 3.2, 1.0, 12.6, 15.0, 0.25)
    // the apostles' windows
    for (const s of [-1, 1]) panel(win, (u, v, w) => S(u, v, w), 0, 0, 'v0', s * 1.1, 0.5, 11.6, 12.4, true, 1.34, 3)
    // the astronomical dial: the blue disc, a dark outer ring, the gilded zodiac ring off-centre
    const across = sub3(FT(1, 0, 0), FT(0, 0, 0))
    const n = D ? 28 : 14
    const c1 = S(0, 1.36, 8.2)
    disc(clock, c1, across, [0, 0, 1], 2.15, n, out)
    disc(tile, S(0, 1.38, 7.35), across, [0, 0, 1], 1.2, n, out) // the dark lower (night) sector, read as warm brown
    disc(plaster, S(0, 1.4, 8.6), across, [0, 0, 1], 1.3, n, out, 1.08) // the gilt zodiac ring
    disc(plaster, S(0, 1.39, 8.2), across, [0, 0, 1], 2.4, n, out, 2.15) // the gilt rim
    // the calendar dial below
    disc(plaster, S(0, 1.36, 3.6), across, [0, 0, 1], 1.35, n, out) // the gilt calendar
    disc(clock, S(0, 1.38, 3.6), across, [0, 0, 1], 1.6, n, out, 1.35) // its blue ring
    if (D) {
      // the four figures beside the dial and the two beside the calendar, as dark niche figures
      for (const [a, w] of [[-2.75, 7.6], [-2.75, 9.4], [2.75, 7.6], [2.75, 9.4], [-2.2, 3.0], [2.2, 3.0]]) {
        loft(slate, [ring((u, v, ww) => S(a + u, 1.5 + v, ww), 0, 0, 0.18, 0.14, w - 0.6, 6), ring((u, v, ww) => S(a + u, 1.5 + v, ww), 0, 0, 0.12, 0.1, w + 0.55, 6)], true)
        bead(slate, S(a, 1.5, w + 0.75), 0.13)
      }
    }
    // the chapel's oriel above the clock (OSM 482235438: 14–25, copper roof)
    const no = D ? 5 : 3
    const oc = (k: number, r: number, w: number) => { const t = Math.PI * (k / no); return S(-0.5 + r * Math.cos(t), 0.0 + r * Math.sin(t) * 1.1, w) }
    const rings = [[13.6, 0.5], [14.6, 1.25], [19.0, 1.25]] as [number, number][]
    for (let i = 0; i + 1 < rings.length; i++) for (let k = 0; k < no; k++) {
      const [w0, r0] = rings[i], [w1, r1] = rings[i + 1]
      faceOut(stone, [oc(k, r0, w0), oc(k + 1, r0, w0), oc(k + 1, r1, w1), oc(k, r1, w1)], S(-0.5, -0.5, (w0 + w1) / 2))
    }
    for (let k = 0; k < no; k++) {
      faceOut(slate, [oc(k, 1.35, 19.0), oc(k + 1, 1.35, 19.0), S(-0.5, 0.2, 24.5)], S(-0.5, -0.3, 19.5))
      if (k % 2 === 0 || D) {
        const t = Math.PI * ((k + 0.5) / no)
        const p0 = S(-0.5 + 1.27 * Math.cos(t), 1.27 * Math.sin(t) * 1.1, 15.4), p1 = S(-0.5 + 1.27 * Math.cos(t), 1.27 * Math.sin(t) * 1.1, 18.4)
        const side = sub3(oc(k + 1, 1.25, 15), oc(k, 1.25, 15)), l = Math.hypot(side[0], side[1]) || 1
        const s0: V3 = [side[0] / l * 0.3, side[1] / l * 0.3, 0]
        face(win, [sub3(p0, s0), add3(p0, s0), add3(p1, s0), sub3(p1, s0)], sub3(p0, S(-0.5, 0, 15.4)))
      }
    }
  }

  // ---- The chapel east of the tower (OSM 321115101, h 20) and its five-sided bay (482235437).
  {
    const FC = frame(35.0, 10.6, 0, 24)
    box(stone, FC, -2.6, 2.6, -4.6, 4.6, 0, 15.0, 'b')
    hipRoof(slate, FC, 0, 0, 2.8, 4.8, 4.6, 15.0, 20.0, false)
    for (const a of [-2.4, 2.4]) panel(win, FC, 2.6, 4.6, 'u1', a, 0.55, 7.5, 13.2, true, 0.04, D ? 4 : 2)
    const B = frame(36.1, 11.7, 0, 24)
    const nb = 5
    const bp = (k: number, r: number, w: number) => { const t = -Math.PI / 2 + Math.PI * (k / nb); return B(r * Math.cos(t), r * Math.sin(t), w) }
    for (const [w0, r0, w1, r1] of [[6.0, 0.6, 8.0, 2.0], [8.0, 2.0, 20.0, 2.0]] as [number, number, number, number][])
      for (let k = 0; k < nb; k++) faceOut(stone, [bp(k, r0, w0), bp(k + 1, r0, w0), bp(k + 1, r1, w1), bp(k, r1, w1)], B(-0.5, 0, (w0 + w1) / 2))
    for (let k = 0; k < nb; k++) {
      faceOut(slate, [bp(k, 2.1, 20), bp(k + 1, 2.1, 20), B(0, 0, 29)], B(-0.5, 0, 21))
      const t = -Math.PI / 2 + Math.PI * ((k + 0.5) / nb), c = B(1.92 * Math.cos(t), 1.92 * Math.sin(t), 0)
      const w = 0.42
      const dir: V3 = [-Math.sin(t + (24 * Math.PI) / 180) * w, Math.cos(t + (24 * Math.PI) / 180) * w, 0]
      face(win, [[c[0] - dir[0], c[1] - dir[1], 10.5], [c[0] + dir[0], c[1] + dir[1], 10.5], [c[0] + dir[0], c[1] + dir[1], 17.5], [c[0] - dir[0], c[1] - dir[1], 17.5]], [Math.cos(t + 0.42), Math.sin(t + 0.42), 0])
    }
    if (D) { tube(stone, [B(0, 0, 28.8), B(0, 0, 30.6)], 0.05, 4); bead(stone, B(0, 0, 30.2), 0.15) }
  }
  // ---- The surviving neo-Gothic bay of the burnt north wing (OSM 462411198, h 18) and the low link (462411199).
  {
    const FN = frame(25.8, 17.0, 0, 24)
    box(tile, FN, -5.8, 5.8, -3.0, 3.0, 0, 18.0, 'b')
    for (const a of [-3.2, 0, 3.2]) for (const w0 of [6.5, 11.5]) panel(win, FN, 5.8, 3.0, 'v1', a, 0.8, w0, w0 + 3.2, false, 0.04)
    for (const w0 of [6.5, 11.5]) panel(win, FN, 5.8, 3.0, 'u1', 0, 0.9, w0, w0 + 3.2, false, 0.04)
    for (const a of [-3.2, 0, 3.2]) panel(win, FN, 5.8, 3.0, 'v1', a, 0.9, 1.0, 4.4, true, 0.04, D ? 4 : 2)
    const FK = frame(14.5, 15.8, 0, 24)
    box(plaster, FK, -3.6, 3.6, -3.0, 3.0, 0, 7.0, 'b')
  }

  const parts = [stone, plaster, tile, slate, win, clock]
  dropToZero(parts)
  const lit = (p: V3, n: V3) => (n[2] > 0.7 ? 0.2 : 0.7)
  return [
    { part: stone, material: { ...STONE, floodlight: lit } },
    { part: plaster, material: { ...PLASTER, floodlight: lit } },
    { part: tile, material: TILE },
    { part: slate, material: SLATE },
    { part: win, material: PALETTE.window },
    { part: clock, material: CLOCK },
  ]
}

const sub3 = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const add3 = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
/** A point on a face of a box centred in frame F (u0/u1/v0/v1), `a` across, `w` up, `d` out. */
function pt(F: Xf, hu: number, hv: number, f: 'u0' | 'u1' | 'v0' | 'v1', a: number, w: number, d: number): V3 {
  if (f === 'u1') return F(hu + d, a, w)
  if (f === 'u0') return F(-hu - d, -a, w)
  if (f === 'v1') return F(-a, hv + d, w)
  return F(a, -hv - d, w)
}

if (import.meta.main) await saveLods('prague-old-town-hall', 'Old Town Hall', build(true), null, { bearing: 0 })
