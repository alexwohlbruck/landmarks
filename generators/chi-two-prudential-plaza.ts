/**
 * Two Prudential Plaza (180 North Stetson, 1990, Loebl Schlossman & Hackl),
 * Chicago — original procedural geometry, CC0-1.0.
 * bun generators/chi-two-prudential-plaza.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = centroid of the OSM outline way/64388666,
 * 41.885419,-87.622720. Its faces run at 88.6° / 178.9°, so the catalog
 * bearing is 359.
 *
 * Identity, in order: the pyramidal crown of stacked horizontal setbacks,
 * white-edged, under a needle spire; the north and south ends of the slab
 * stepping in to the crown in chevron setbacks; the full-height blue glass
 * strip up the middle of every face; the grey-tan granite shaft with punched
 * windows and notched corners.
 *
 * Evidence:
 *  - plan: OSM outline, 41.7 × 55.2 m. The NAIP orthophoto shows the crown
 *    over the full east-west width but only ~37 m north-south, with the
 *    stepped setbacks of the ends between it and the outline.
 *  - heights: 303 m to the spire tip (OSM, published). The crown's apex
 *    (~272 m), its foot (~232 m) and the start of the cascade (~160 m) are
 *    read from MusikAnimal's full-height photo, scaled by the 303 m tip. 64 floors (published), ~3.9 m each.
 *  - crown: fourteen horizontal setbacks with pale glass fronts and white
 *    coping (Alvesgaspar's close-up of the peak and spire, Tony Hisgett),
 *    from ~232 m to the apex at ~272 m, and the spire, silver-grey here so
 *    it reads against the sky, on to 303 m. Below it the ends step in, six
 *    tiers from ~160 m, while the corner notches deepen, so each face's top
 *    edge cascades down in chevrons (MusikAnimal).
 *  - corners: a two-step chevron notch up every corner, its short walls
 *    blue glass as in the photos.
 *  - glass strips: ~8 m wide, from the lobby to the crown, on every face
 *    (Potro, Tony Hisgett, MusikAnimal).
 *  - colour: the granite reads grey-tan; a cool grey finish at the palette's
 *    lightness. The strips and crown glass are reflective sky blue, a light
 *    window variant; the punched windows the palette window.
 *
 * Estimated: the number and depth of the setbacks (six of 1.5 m), the corner
 * notches (two steps of 2 m; the OSM outline shows one at the south-west),
 * the window bay rhythm (five bays a side, three-storey groups).
 *
 * Photos (Wikimedia Commons): Two_Prudential_Plaza_Chicago_in_May_2016.jpg
 * (MusikAnimal, CC BY-SA 4.0); Chicago_2007-14_(peak_and_spire).jpg
 * (Alvesgaspar, CC BY-SA 3.0); Two_Prudential_Plaza_Chicago_(15338638051)
 * and _2_(15622898381) (Tony Hisgett, CC BY 2.0);
 * Two_Prudential_Plaza_March_2015.JPG (Potro, CC BY-SA 4.0). NAIP (USGS,
 * public domain). No commercial imagery.
 *
 * Left out: the glazed chevrons part-way up the faces, the lobby and the
 * connection to One Prudential Plaza, mullions.
 */
import { Part } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { bays, cap, chamfer, panel, rect, rows, save, walls, type XY } from './chi-aon-center'

const granite = new Part(), win = new Part(), glass = new Part(), white = new Part(), roof = new Part()

const HX = 20.85, HY = 27.6 // shaft half-widths
const SHOULDER = 160, CROWN = 232, APEX = 272, TIP = 303
const CY = 18.5, CX = HX - 1.6 // half-widths of the crown's foot
const STRIP = 8.0, STEPS = 6

/**
 * A rectangle whose corners are cut by a two-step chevron notch, each step
 * `n` deep, counter-clockwise from the south face.
 */
function notched(hx: number, hy: number, n: number): XY[] {
  const se: XY[] = [[hx - 2 * n, -hy], [hx - 2 * n, -hy + n], [hx - n, -hy + n], [hx - n, -hy + 2 * n], [hx, -hy + 2 * n]]
  const ne = se.map(([x, y]): XY => [x, -y]).reverse()
  const nw = ne.map(([x, y]): XY => [-x, y]).reverse()
  const sw = se.map(([x, y]): XY => [-x, y]).reverse()
  return [...se, ...ne, ...nw, ...sw]
}
/** Walls of a notched ring: the notches' short walls are blue glass, the rest granite. */
function shell(r: XY[], z0: number, z1: number, n: number) {
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    const p = Math.hypot(b[0] - a[0], b[1] - a[1]) <= n + 0.01 ? glass : granite
    p.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
  }
}
const faceBays = (r: XY[], z0: number, z1: number, n: number) =>
  bays(win, r, rows(z0, z1, Math.max(1, Math.round((z1 - z0) / 11.7))), { bay: 1.2, gap: 2.2, end: 1.4, minLen: n + 4 })

// Shaft, with the chevron notches up every corner.
const N0 = 2.0
const shaft = notched(HX, HY, N0)
shell(shaft, 0, SHOULDER, N0)
// The cascade: the ends step in towards the crown's depth while the corner
// notches deepen, so each face's top edge steps down in chevrons.
const tierH = (CROWN - SHOULDER) / STEPS
let below = shaft
for (let k = 1; k <= STEPS; k++) {
  const y = HY - (HY - CY) * k / STEPS, n = N0 + 0.25 * k, z = SHOULDER + tierH * k
  const ring = notched(HX, y, n)
  // The ledge between the tier below and this one.
  const yb = HY - (HY - CY) * (k - 1) / STEPS, xb = HX - 2 * (N0 + 0.25 * (k - 1))
  for (const s of [-1, 1]) {
    const a: XY[] = s < 0 ? [[-xb, -yb], [xb, -yb], [xb, -y], [-xb, -y]] : [[-xb, y], [xb, y], [xb, yb], [-xb, yb]]
    cap(roof, a, z - tierH + 0.01)
    const lip: XY[] = s < 0 ? [[-HX + 2 * n, -yb], [HX - 2 * n, -yb]] : [[HX - 2 * n, yb], [-HX + 2 * n, yb]]
    white.quad([lip[0][0], lip[0][1], z - tierH - 0.8], [lip[1][0], lip[1][1], z - tierH - 0.8], [lip[1][0], lip[1][1], z - tierH + 0.03], [lip[0][0], lip[0][1], z - tierH + 0.03])
  }
  shell(ring, z - tierH, z, n)
  faceBays(ring, z - tierH + 0.4, z - 1, n)
  // The glass strip carried up each end front.
  for (const s of [-1, 1]) {
    const a: XY = [s * -HX, s * -y], b: XY = [s * HX, s * -y]
    panel(glass, a, b, HX - STRIP / 2, HX + STRIP / 2, z - tierH - 0.8, z - 0.6, 0.08)
  }
  below = ring
}
// Crown's foot: the last tier's top, around the pyramid.
cap(roof, below.map(([x, y]): XY => [x, y]), CROWN + 0.01)

// Crown: fourteen horizontal setbacks from the 38 × 37 m foot to the apex,
// each a pale glass front under a white coping, then the spire.
const TIERS = 14
for (let k = 0; k < TIERS; k++) {
  const t0 = k / TIERS, t1 = (k + 1) / TIERS
  const z0 = CROWN + (APEX - CROWN) * t0, z1 = CROWN + (APEX - CROWN) * t1
  const r0 = rect(-CX * (1 - t0), -CY * (1 - t0), CX * (1 - t0), CY * (1 - t0))
  const r1 = rect(-CX * (1 - t1), -CY * (1 - t1), CX * (1 - t1), CY * (1 - t1))
  const zc = z0 + (z1 - z0) * 0.6
  walls(glass, r0, z0, zc)
  walls(white, r0, zc, z1 - 0.3)
  walls(white, r0, z1 - 0.3, z1, r1)
}
// Spire: a stout octagonal base, then the needle to 303 m.
{
  const n = 8, ring = (r: number) => Array.from({ length: n }, (_, i): XY => [r * Math.cos(2 * Math.PI * (i + 0.5) / n), r * Math.sin(2 * Math.PI * (i + 0.5) / n)])
  walls(roof, ring(3.4), APEX - 3, APEX + 3, ring(2.6))
  walls(roof, ring(2.6), APEX + 3, APEX + 9, ring(1.5))
  const top = ring(1.5)
  for (let i = 0; i < n; i++) { const j = (i + 1) % n; roof.tri([top[i][0], top[i][1], APEX + 9], [top[j][0], top[j][1], APEX + 9], [0, 0, TIP]) }
}

// Facade: the glass strip up the middle of each face, and punched-window
// bays either side of it in three-storey groups.
const n2 = 2 * N0
const faces: [XY, XY, number][] = [ // wall start, end, top of the strip
  [[-HX + n2, -HY], [HX - n2, -HY], SHOULDER],
  [[HX, -HY + n2], [HX, HY - n2], CROWN],
  [[HX - n2, HY], [-HX + n2, HY], SHOULDER],
  [[-HX, HY - n2], [-HX, -HY + n2], CROWN],
]
for (const [a, b, top] of faces) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), m = L / 2
  panel(glass, a, b, m - STRIP / 2, m + STRIP / 2, 7, top - 0.8, 0.06)
  const side = m - STRIP / 2 - 1.2 // window run on each side of the strip
  const nb = Math.round(side / 3.4), pitch = side / nb
  for (let i = 0; i < nb; i++) for (const s of [0, m + STRIP / 2 + 0.6]) {
    const s0 = s + (s ? 0 : 0.6) + i * pitch + pitch * 0.25, s1 = s0 + pitch * 0.36
    for (const [z0, z1] of rows(7, SHOULDER - 2, 13, 2.4)) panel(win, a, b, s0, s1, z0, z1)
  }
}
await save('chi-two-prudential-plaza', 'Two Prudential Plaza', [41.885419, -87.62272], 359, [
  { part: granite, material: finish('pru-granite', 0xcdc9c2) },
  { part: win, material: PALETTE.window },
  { part: glass, material: windowVariant(2, 0xa9bfd1) },
  { part: white, material: PALETTE.trim },
  { part: roof, material: PALETTE.roof },
])
