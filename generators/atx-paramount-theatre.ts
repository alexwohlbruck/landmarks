/**
 * The Paramount Theatre (1915, John Eberson; opened as the Majestic), 713
 * Congress Avenue, Austin — procedural, CC0-1.0, no textures.
 *   bun generators/atx-paramount-theatre.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 17.5, the downtown
 * grid, so -x is the front on Congress Avenue (west-north-west) and +y runs
 * up Congress towards the State Theatre next door. Anchor = area centroid
 * of OSM way/328526454, -97.741863, 30.269379. z = 0 is the lowest ground
 * under the footprint (the alley side); the Congress sidewalk is 0.5 m
 * higher (lidar ground).
 *
 * Identity: the tall vertical blade sign, dark green with PARAMOUNT in
 * cream serif capitals stacked down it, a scrolled head and a red-orange
 * fan crest on top, standing out from the middle of the front over the
 * marquee; the white marquee across the whole front with its fan crest and
 * the P medallion; the purple-brown brick front with three tall windows on
 * bracketed balconies under white shell-carved arches, a white
 * bracketed cornice and the green tile hip roof.
 *
 * Famous-sign exception (STYLE.md): the blade carries its lettering,
 * traced from "hudson" and "ajay": stacked capitals with slab serifs and a
 * single-storey bowl on P and R, the O an upright oval; drawn as strokes
 * with generators/lettering.ts, on both faces of the blade, as on the
 * real sign. The marquee's changeable letters are not drawn.
 *
 * Numbers (lidar = USGS 3DEP USGS_LPC_TX_Central_B1_2017_LAS_2019, flown
 * 2017, 0.5 m grid read in this frame; heights over the base):
 *  - the blade: y = 0 (the middle of the front), out to x = -27.3 from the
 *    wall at -24.0, top 23.2: measured (the lidar caught the sign); its
 *    foot at the balcony level, 7.5 m: photo-scaled ("ajay", "night");
 *    shaft 1.8 m wide, head 2.8 m, crest a half ellipse 1.8 m across each way and 2.2 m tall (photo-scaled, top to the lidar);
 *  - front block x -24..-13: cornice 15.0, hip roof ridge 18.6 (lidar
 *    14.9-15.4 and 18.6); the auditorium roof 17.0 (lidar 16.9-17.2); the
 *    stage house x 20..24.2, 19.2 (lidar 19.0-19.2, OSM height 19.2); the
 *    building's width y -11.5..11.5 (OSM, lidar);
 *  - marquee: projects 2.7 m, 3.7-5.2 m over the sidewalk (lidar top 5.1-5.5
 *    over the base), its letter board 11.3 m wide, the fan crest 7.6 m wide
 *    and 1.5 m tall: scaled on "zirkel" (square on, 31.4 px a metre);
 *  - the front: three windows 2.7 m wide at 4.35 m centres, 7.6-11.2 m, on
 *    balconies at 7.4; arches springing at 11.6, radius 1.9; string course
 *    11.4-12.0; diaper frieze to 13.6; cornice 13.6-15.0; small windows at
 *    4.9-6.2 and 10.0-11.2; the end piers to 17.7: all scaled on "zirkel";
 *  - colours from "zirkel" (evening sun), pulled to the palette's
 *    lightness: brick #6b5763 -> #a48589, roof tile #778f8d and the blade's
 *    dark green share one green #5d8770 (six materials), terracotta the
 *    palette `trim`.
 *  - Night: the front over the marquee is floodlit (`_FLOODLIGHT` 0.6); the blade's letters and border, the marquee board (`neon-cream`)
 *    and both fan crests (`neon-crest`) glow, as in "night".
 *
 * Photos (Wikimedia Commons, EVIDENCE):
 *  zirkel    "Paramount Theatre Congress Avenue.jpg", Kenneth C. Zirkel, CC
 *            BY-SA 3.0 (square on, 2011, before the blade was rebuilt)
 *            https://commons.wikimedia.org/wiki/File:Paramount_Theatre_Congress_Avenue.jpg
 *  ajay      "Paramount Theatre & State Theatre - Austin, TX (54987519220).jpg",
 *            ajay_suresh, CC BY 4.0 (from the south-west, with the blade)
 *            https://commons.wikimedia.org/wiki/File:Paramount_Theatre_%26_State_Theatre_-_Austin,_TX_(54987519220).jpg
 *  hudson    "Austin Texas Paramount and State Theaters March 2019.jpg", Paul
 *            Hudson, CC BY 2.0 (the blade's letters close)
 *            https://commons.wikimedia.org/wiki/File:Austin_Texas_Paramount_and_State_Theaters_March_2019.jpg
 *  night     "Paramount Theatre (Austin, TX) at night, SXSW 2024.jpg", Kevin
 *            Payravi, CC BY-SA 4.0
 *            https://commons.wikimedia.org/wiki/File:Paramount_Theatre_(Austin,_TX)_at_night,_SXSW_2024.jpg
 *  highsmith "The old Paramount Theatre, left, and the adjacent, newer State
 *            Theater in downtown Austin, Texas", Carol M. Highsmith, public
 *            domain (from the north-west)
 *            https://commons.wikimedia.org/wiki/File:The_old_Paramount_Theatre,_left,_and_the_adjacent,_newer_State_Theater_in_downtown_Austin,_Texas_LCCN2014632497.tif
 * Also OSM (ODbL) and the lidar. No look-only sources, no commercial imagery.
 *
 * Replaces way/328526454.
 *
 * Doubts: the sides and back are plain brick (they stand against the
 * neighbours and show only over the State Theatre); the diaper pattern of
 * the frieze, the cornice brackets and the shell carving are left as plain
 * bands; the blade's exact depth and its brackets are from the lidar's
 * outline and photos, good to about 0.3 m.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { box, save, type XY } from './atl-flatiron-building'
import { flush, opening, hipRoof } from './atx-governors-mansion'
import { Pen, strokes } from './lettering'

const brick = new Part(), trim = new Part(), green = new Part(), win = new Part(), cream = new Part(), crest = new Part()

const XF = -24.0, XB = 24.2, YS = -11.5, YN = 11.5, EG = 0.5
const Z = (h: number) => EG + h // a height over the Congress sidewalk

// ── the masses ──
box(brick, XF, -13, YS, YN, 0, Z(13.6), null, 0)
box(trim, XF - 0.9, -12.7, YS - 0.2, YN + 0.2, Z(13.6), Z(14.5), null, 0.25, true) // the cornice
hipRoof(green, XF - 0.6, -13, YS - 0.1, YN + 0.1, Z(14.5), 18.6)
box(brick, -13, 20, YS, YN, 0, 16.6, null, 0)
box(brick, -13.2, 20, YS - 0.15, YN + 0.15, 16.6, 17.0, trim, 0.15) // the flat roofs in a pale membrane colour (six materials)
box(brick, 20, XB, YS, YN, 0, 18.8, null, 0)
box(brick, 19.8, XB + 0.1, YS - 0.1, YN + 0.1, 18.8, 19.2, trim, 0.15)
// the end piers of the front, up past the cornice
for (const [y0, y1] of [[YS, YS + 0.9], [YN - 0.9, YN]]) box(brick, XF, XF + 1.2, y0, y1, Z(13.6), Z(17.2), trim, 0.2)

// ── the front on Congress (x = XF, a→b from north to south so its outside is -x) ──
const A: XY = [XF, YN], B: XY = [XF, YS]
const s = (y: number) => YN - y // distance along the front from its north end
// the cream terracotta ground storey, with the doors under the marquee
flush(trim, A, B, 0, YN - YS, 0, Z(4.9), 0.05)
for (const y of [-4.6, -2.3, 0, 2.3, 4.6]) flush(win, A, B, s(y) - 0.9, s(y) + 0.9, Z(0.1), Z(3.0), 0.09)
for (const y of [-9.3, 9.3]) flush(win, A, B, s(y) - 0.8, s(y) + 0.8, Z(0.1), Z(3.0), 0.09)
// the low windows over the marquee
for (const y of [-9.4, -8.2, -7.0, -4.5, 4.5, 7.0, 8.2, 9.4]) flush(win, A, B, s(y) - 0.37, s(y) + 0.37, Z(5.2), Z(6.3), 0.06)
// the three tall windows, their balconies, the arches over them
for (const y of [-4.35, 0, 4.35]) {
  flush(trim, A, B, s(y) - 1.6, s(y) + 1.6, Z(7.4), Z(11.4), 0.04) // the stone frame
  flush(win, A, B, s(y) - 1.35, s(y) + 1.35, Z(7.6), Z(9.9), 0.08)
  flush(win, A, B, s(y) - 1.35, s(y) + 1.35, Z(10.15), Z(11.2), 0.08)
  // the white frames of the French windows: a centre post and two side posts ("zirkel")
  for (const d of [-0.68, 0, 0.68]) flush(trim, A, B, s(y) + d - 0.09, s(y) + d + 0.09, Z(7.6), Z(11.2), 0.11)
  // the balcony: a bracketed slab and its dark railing
  box(trim, XF - 0.8, XF, y - 1.55, y + 1.55, Z(6.9), Z(7.4), trim, 0.12, true)
  box(win, XF - 0.8, XF - 0.65, y - 1.5, y + 1.5, Z(7.4), Z(8.3), win, 0.03)
  // the white arch with its carved shell, as a flush half disc
  opening(trim, A, B, s(y), 3.8, Z(11.6), Z(11.6), 'round', 0.07, 10)
}
for (const y of [-8.2, 8.2]) flush(win, A, B, s(y) - 0.45, s(y) + 0.45, Z(10.0), Z(11.2), 0.06)
flush(trim, A, B, 0, YN - YS, Z(11.4), Z(12.0), 0.06) // the string course

// ── the marquee: a white canopy across the front, its letter board, end posts and fan crest ──
const MX = XF - 2.7
box(trim, MX, XF, YS + 0.3, YN - 0.3, Z(3.7), Z(4.9), trim, 0.15, true)
box(trim, MX - 0.15, XF, -5.65, 5.65, Z(3.6), Z(5.2), trim, 0.12, true)
cream.quad([MX - 0.18, 5.5, Z(3.75)], [MX - 0.18, -5.5, Z(3.75)], [MX - 0.18, -5.5, Z(5.05)], [MX - 0.18, 5.5, Z(5.05)])
for (const y of [YS + 0.5, YN - 0.5, -5.9, 5.9]) box(trim, MX - 0.2, MX + 0.5, y - 0.35, y + 0.35, Z(3.4), Z(5.6), trim, 0.1)
/** A flat fan (half ellipse) in the plane x = xp, facing -x, centred at y = yc, from z0 up. */
function fan(p: Part, xp: number, yc: number, z0: number, rw: number, rh: number, n = 10) {
  for (let k = 0; k < n; k++) {
    const t0 = (Math.PI * k) / n, t1 = (Math.PI * (k + 1)) / n
    const P0: V3 = [xp, yc + rw * Math.cos(t0), z0 + rh * Math.sin(t0)], P1: V3 = [xp, yc + rw * Math.cos(t1), z0 + rh * Math.sin(t1)]
    p.tri([xp, yc, z0], P1, P0)
    p.tri([xp + 0.3, yc, z0], [P0[0] + 0.3, P0[1], P0[2]], [P1[0] + 0.3, P1[1], P1[2]])
    p.quad([P0[0] + 0.3, P0[1], P0[2]], P0, P1, [P1[0] + 0.3, P1[1], P1[2]])
  }
}
fan(crest, MX + 0.2, 0, Z(5.2), 3.8, 1.5)
{ // the P medallion
  const c: V3 = [MX + 0.1, 0, Z(5.95)]
  for (let k = 0; k < 12; k++) {
    const t0 = (2 * Math.PI * k) / 12, t1 = (2 * Math.PI * (k + 1)) / 12
    cream.tri(c, [c[0], c[1] + 0.55 * Math.cos(t1), c[2] + 0.55 * Math.sin(t1)], [c[0], c[1] + 0.55 * Math.cos(t0), c[2] + 0.55 * Math.sin(t0)])
  }
}

// ── the blade sign ──
// In the plane y = 0: u runs out from the wall (x = XF - u), v is height. Profile from "hudson".
const BT = 0.34 // half the blade's thickness
const U0 = 0.7, U1 = 2.5, V0 = 7.5, VH = 19.3, VTOP = 21.0
/** The blade's outline, counter-clockwise in (u, v). */
const outline: [number, number][] = [
  [U0, V0], [U1, V0], [U1, VH - 0.8],
  [U1 + 0.35, VH], [U1 + 0.6, VTOP], // the scrolled head flares out
  [U0 - 0.7, VTOP], [U0 - 0.45, VH], [U0, VH - 0.8],
]
const BP = (u: number, v: number, y: number): V3 => [XF - u, y, v]
{
  const n = outline.length
  const cu = (U0 + U1) / 2, cv = (V0 + VTOP) / 2
  for (const side of [1, -1]) {
    for (let i = 0; i < n; i++) {
      const [u0, v0] = outline[i], [u1, v1] = outline[(i + 1) % n]
      // the face; the tri's winding is set by its explicit normal
      green.tri(BP(cu, cv, side * BT), BP(u0, v0, side * BT), BP(u1, v1, side * BT), undefined, undefined, undefined, [[0, side, 0], [0, side, 0], [0, side, 0]])
    }
  }
  for (let i = 0; i < n; i++) {
    const [u0, v0] = outline[i], [u1, v1] = outline[(i + 1) % n]
    // outward in (u, v) for a counter-clockwise ring is (dv, -du); u runs along -x
    const l = Math.hypot(u1 - u0, v1 - v0)
    const nrm: V3 = [-(v1 - v0) / l, 0, -(u1 - u0) / l]
    const q = [BP(u0, v0, -BT), BP(u1, v1, -BT), BP(u1, v1, BT), BP(u0, v0, BT)]
    green.tri(q[0], q[1], q[2], undefined, undefined, undefined, [nrm, nrm, nrm])
    green.tri(q[0], q[2], q[3], undefined, undefined, undefined, [nrm, nrm, nrm])
  }
  // the brackets tying the blade to the wall
  for (const v of [V0 + 0.8, 13.5, VH - 1.2]) box(green, XF - U0 - 0.05, XF, -0.12, 0.12, v - 0.15, v + 0.15, green, 0)
  // the fan crest on the head, standing in the blade's plane
  const cu2 = (U0 - 0.7 + U1 + 0.6) / 2, R = 1.8
  for (let k = 0; k < 12; k++) {
    const t0 = (Math.PI * k) / 12, t1 = (Math.PI * (k + 1)) / 12
    const p0 = (y: number) => BP(cu2 + R * Math.cos(t0), VTOP + 2.2 * Math.sin(t0), y)
    const p1 = (y: number) => BP(cu2 + R * Math.cos(t1), VTOP + 2.2 * Math.sin(t1), y)
    const c = (y: number) => BP(cu2, VTOP, y)
    for (const side of [1, -1]) crest.tri(c(side * 0.3), p0(side * 0.3), p1(side * 0.3), undefined, undefined, undefined, [[0, side, 0], [0, side, 0], [0, side, 0]])
    const a = p0(0), b = p1(0), m: V3 = [(a[0] + b[0]) / 2 - c(0)[0], 0, (a[2] + b[2]) / 2 - c(0)[2]], l = Math.hypot(m[0], m[2]), nn: V3 = [m[0] / l, 0, m[2] / l]
    crest.tri(p0(-0.3), p1(-0.3), p1(0.3), undefined, undefined, undefined, [nn, nn, nn])
    crest.tri(p0(-0.3), p1(0.3), p0(0.3), undefined, undefined, undefined, [nn, nn, nn])
  }
}

// ── PARAMOUNT, stacked down both faces, and the cream border ──
function letter(ch: string): Pen {
  const p = new Pen()
  switch (ch) {
    case 'P':
      p.moveTo([-0.32, 0]).lineTo([-0.32, 1]).lineTo([0.08, 1]).arc([0.08, 0.75], -Math.PI, 6).lineTo([-0.32, 0.5])
      p.moveTo([-0.5, 0]).lineTo([-0.14, 0])
      break
    case 'A':
      p.moveTo([-0.4, 0]).lineTo([0, 1]).lineTo([0.4, 0])
      p.moveTo([-0.22, 0.36]).lineTo([0.22, 0.36])
      p.moveTo([-0.55, 0]).lineTo([-0.26, 0]); p.moveTo([0.26, 0]).lineTo([0.55, 0])
      break
    case 'R':
      p.moveTo([-0.32, 0]).lineTo([-0.32, 1]).lineTo([0.06, 1]).arc([0.06, 0.76], -Math.PI, 6).lineTo([-0.32, 0.52])
      p.moveTo([-0.02, 0.52]).lineTo([0.36, 0])
      p.moveTo([-0.5, 0]).lineTo([-0.14, 0])
      break
    case 'M':
      p.moveTo([-0.42, 0]).lineTo([-0.42, 1]).lineTo([0, 0.22]).lineTo([0.42, 1]).lineTo([0.42, 0])
      p.moveTo([-0.56, 0]).lineTo([-0.28, 0]); p.moveTo([0.28, 0]).lineTo([0.56, 0])
      break
    case 'O':
      p.circle([0, 0.5], 0.36, 0.5, 14)
      break
    case 'U':
      p.moveTo([-0.36, 1]).lineTo([-0.36, 0.34]).arc([0, 0.34], Math.PI, 6).lineTo([0.36, 1])
      p.moveTo([-0.52, 1]).lineTo([-0.2, 1]); p.moveTo([0.2, 1]).lineTo([0.52, 1])
      break
    case 'N':
      p.moveTo([-0.36, 0]).lineTo([-0.36, 1]).lineTo([0.36, 0]).lineTo([0.36, 1])
      p.moveTo([-0.5, 0]).lineTo([-0.22, 0]); p.moveTo([0.22, 1]).lineTo([0.5, 1])
      break
    case 'T':
      p.moveTo([-0.44, 1]).lineTo([0.44, 1]); p.moveTo([0, 1]).lineTo([0, 0])
      p.moveTo([-0.18, 0]).lineTo([0.18, 0])
      break
  }
  return p
}
{
  const word = 'PARAMOUNT', CAP = 0.95, PITCH = 1.22, UC = (U0 + U1) / 2
  const top = VH - 0.6
  for (const side of [1, -1]) {
    for (let i = 0; i < word.length; i++) {
      const base = top - (i + 1) * PITCH
      const pl = (lu: number, lv: number, w: number): V3 => {
        // on the north face (+y) the reader faces south, their right is west = +u;
        // on the south face (-y) their right is east = -u
        const u = UC + (side === 1 ? lu : -lu) * CAP
        return BP(u, base + lv * CAP, side * (BT + w))
      }
      strokes(cream, letter(word[i]).paths, { width: 0.15, depth: 0.08, place: pl })
    }
    // the border: a cream line just inside the shaft's edges and round the head
    const border = new Pen()
    const inset = 0.14
    border.moveTo([U0 + inset, V0 + inset]).lineTo([U1 - inset, V0 + inset]).lineTo([U1 - inset, VH - 0.8]).lineTo([U1 + 0.2, VH]).lineTo([U1 + 0.42, VTOP - inset])
      .lineTo([U0 - 0.55, VTOP - inset]).lineTo([U0 - 0.3, VH]).lineTo([U0 + inset, VH - 0.8]).lineTo([U0 + inset, V0 + inset])
    strokes(cream, border.paths, { width: 0.1, depth: 0.06, place: (u, v, w) => BP(u, v, side * (BT + w)) })
  }
}

// the front is floodlit from the marquee and the street ("night")
const lit = (p: V3, n: V3) => (n[0] < -0.5 && p[0] < XF + 0.5 && p[2] > Z(5) ? 0.6 : 0)
if (import.meta.main) {
  await save('atx-paramount-theatre', 'Paramount Theatre', [
    { part: brick, material: { ...finish('paramount-brick', 0xa48589), floodlight: lit } },
    { part: trim, material: { ...PALETTE.trim, floodlight: lit } },
    { part: green, material: finish('paramount-green', 0x5d8770) },
    { part: win, material: PALETTE.window },
    { part: cream, material: finish('neon-cream', 0xf3e6c4) },
    { part: crest, material: finish('neon-crest', 0xd9643c) },
  ], { bearing: 17.5, replaces: ['way/328526454'] }, 5000)
}
