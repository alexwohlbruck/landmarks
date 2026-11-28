/**
 * Fairmont Austin, 101 Red River Street, Austin (2018, Page) — original
 * procedural geometry, CC0-1.0.
 * bun generators/atx-fairmont-austin.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground. Bearing 17.9: Austin's street grid (Cesar Chavez along the
 * south, Red River along the west). Anchor = area centroid of OSM
 * way/134786106 ("Fairmont Austin", 37 levels, wikidata Q17509961),
 * -97.7382109, 30.2621232.
 *
 * Identity (from the photos): a very long, broad slab of reflective blue
 * glass, its curtain wall ruled by fine vertical fins, split near its west
 * end by a deep full-height slot, the slice beyond the slot capped by a
 * sloping top; a tall mast over the roof; a stepped glass podium with
 * pale floor bands filling the south half of the block.
 *
 * Evidence and numbers:
 *  - published: 179 m (588 ft), 37 storeys, completed 2018 (Wikipedia,
 *    "Fairmont Austin"; OSM 37 levels). Taken here as the mast's top.
 *  - lidar: USGS 3DEP USGS_LPC_TX_Central_B1_2017 (2017 flight, the tower
 *    then built to ~138 m with cranes over it), 1 m grid read in the
 *    frame. Ground ~5.5 m over the grid's ground_min, almost flat; every
 *    height here = lidar - 5.5. Measured: the tower's footprint y 14..38
 *    over the OSM part's x -43..40 (the OSM part way/850607753, y 11..41,
 *    is kept); the podium, finished by 2017: the west half 34 m, the east
 *    half 41, a strip along Cesar Chavez 43.
 *  - photo-scaled (x21, pix, heart): the roof ~160 m with the mast the
 *    rest (the mast ~11% of the roof height); the slot ~3 m wide and 3 m
 *    deep, 15 m from the west end; the west slice's top sloping ~4 m.
 *    The tower above 138 m is not in the lidar.
 *  - estimated: the fins' spacing (4.5 m), the podium's floor bands.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  x21   "Fairmont Austin 2021-08-10.jpg", Xnatedawgx, CC BY-SA 4.0 (the
 *        slot, the podium, looking up from the west)
 *        https://commons.wikimedia.org/wiki/File:Fairmont_Austin_2021-08-10.jpg
 *  pix   "Fairmont Austin on an Overcast Day.jpg", Pixelsandbacon, CC BY 4.0
 *        (the sloping top, the mast) https://commons.wikimedia.org/wiki/File:Fairmont_Austin_on_an_Overcast_Day.jpg
 *  heart "Fairmont Austin Heart.jpg", Sk5893, CC BY-SA 4.0 (a long face,
 *        the mast, the top) https://commons.wikimedia.org/wiki/File:Fairmont_Austin_Heart.jpg
 *  lm17  "Fairmont Austin Under Construction 2017.jpg", Larry D. Moore,
 *        CC BY 4.0 https://commons.wikimedia.org/wiki/File:Fairmont_Austin_Under_Construction_2017.jpg
 * No look-only sources. No commercial imagery.
 *
 * Doubts: no open photo shows the whole of the long north or south face
 * square on, so the slot's position and the slice's sloping top are read
 * from oblique views; the roof height is photo-scaled from the published
 * total; the lit "Fairmont" sign at the top is left out (a small sign).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, windowVariant } from './palette'
import { prism, ccw, box, edgePanels, save, type XY } from './atl-flatiron-building'

const ROOF = 160, SLICE_LO = 154, SLICE_HI = 156.5, MAST = 179
const PW = 34, PE = 41, PS = 43 // podium heights
const X0 = -42.8, XS0 = 22, XS1 = 25, X1 = 40.3, Y0 = 11.5, Y1 = 41

const glass = new Part(), fins = new Part(), win = new Part(), roof = new Part(), metal = new Part(), pod = new Part()

/** Flat quad wound to face n. */
function quadN(p: Part, a: V3, b: V3, c: V3, d: V3, n: V3) {
  p.tri(a, b, c, undefined, undefined, undefined, [n, n, n])
  p.tri(a, c, d, undefined, undefined, undefined, [n, n, n])
}

// ── The podium: glass with pale floor bands ──
const PODW: XY[] = ccw([[-42.3, -30.4], [-38.4, -30.4], [-38, -36], [4, -36], [4, Y0], [-42.8, Y0]])
const PODE: XY[] = ccw([[4, -36], [39.7, -36], [40.1, -18.2], [40.4, Y0], [4, Y0]])
const PODS: XY[] = ccw([[-38, -39.8], [39.5, -39.6], [39.6, -36], [-38, -36]])
for (const [ring, h] of [[PODW, PW], [PODE, PE], [PODS, PS]] as [XY[], number][]) {
  prism(pod, ring, 0, h, roof, 0.4)
  for (let i = 0; i < ring.length; i++) {
    edgePanels(win, ring[i], ring[(i + 1) % ring.length], -0.5, h - 1.5, { group: 4.4, gap: 1.0, bay: 9, pier: 0.4, margin: 0.8, min: 4 })
  }
}

// ── The tower: the main slab, the slot, and the west slice ──
prism(glass, ccw([[X0, Y0], [XS0, Y0], [XS0, Y1], [X0, Y1]]), 0, ROOF, roof, 0.5)
// the slot: a recessed dark strip between the two masses
prism(win, ccw([[XS0 - 0.5, Y0 + 3], [XS1 + 0.5, Y0 + 3], [XS1 + 0.5, Y1 - 3], [XS0 - 0.5, Y1 - 3]]), 0, SLICE_LO - 2, roof, 0)
// the east slice, a little lower, its top sloping down to the east end
{
  const zt = (x: number) => SLICE_HI - ((x - XS1) / (X1 - XS1)) * (SLICE_HI - SLICE_LO)
  const c: XY[] = [[XS1, Y0 + 0.8], [X1, Y0 + 0.8], [X1, Y1 - 0.8], [XS1, Y1 - 0.8]]
  const cy = (Y0 + Y1) / 2, cx = (XS1 + X1) / 2
  for (let i = 0; i < 4; i++) {
    const a = c[i], b = c[(i + 1) % 4], m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
    const n: V3 = Math.abs(a[1] - b[1]) < 1e-6 ? [0, m[1] < cy ? -1 : 1, 0] : [m[0] < cx ? -1 : 1, 0, 0]
    quadN(glass, [a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], zt(b[0])], [a[0], a[1], zt(a[0])], n)
  }
  const dz = SLICE_HI - SLICE_LO, L = X1 - XS1, l = Math.hypot(dz, L), up: V3 = [dz / l, 0, L / l]
  quadN(roof, [XS1, c[0][1], zt(XS1)], [X1, c[0][1], zt(X1)], [X1, c[2][1], zt(X1)], [XS1, c[2][1], zt(XS1)], up)
  for (const y of [c[0][1], c[2][1]]) {
    const sg = y < cy ? -1 : 1
    quadN(fins, [XS1, y + sg * 0.07, zt(XS1) - 1.2], [X1, y + sg * 0.07, zt(X1) - 1.2], [X1, y + sg * 0.07, zt(X1)], [XS1, y + sg * 0.07, zt(XS1)], [0, sg, 0])
  }
}
// a pale rim round the main roof
prism(fins, ccw([[X0 - 0.1, Y0 - 0.1], [XS0 + 0.1, Y0 - 0.1], [XS0 + 0.1, Y1 + 0.1], [X0 - 0.1, Y1 + 0.1]]), ROOF - 1.2, ROOF + 0.3, roof, 0.2)

// ── The vertical fins on the curtain wall, every 4.5 m ──
function finsAlong(a: XY, b: XY, n: XY, z0: number, z1: (x: number) => number, step: number) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), k = Math.max(1, Math.round(L / step)), t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
  for (let i = 1; i < k; i++) {
    const s = (i * L) / k, px = a[0] + t[0] * s, py = a[1] + t[1] * s, w = 0.22
    const top = z1(px) - 1.4
    const p0: XY = [px - t[0] * w, py - t[1] * w], p1: XY = [px + t[0] * w, py + t[1] * w]
    const o = 0.35
    quadN(fins, [p0[0] + n[0] * o, p0[1] + n[1] * o, z0], [p1[0] + n[0] * o, p1[1] + n[1] * o, z0], [p1[0] + n[0] * o, p1[1] + n[1] * o, top], [p0[0] + n[0] * o, p0[1] + n[1] * o, top], [n[0], n[1], 0])
  }
}
const flat = () => ROOF
const sliceZ = (x: number) => SLICE_HI - ((x - XS1) / (X1 - XS1)) * (SLICE_HI - SLICE_LO)
finsAlong([X0, Y0], [XS0, Y0], [0, -1], PW, flat, 4.5)
finsAlong([XS0, Y1], [X0, Y1], [0, 1], 0, flat, 4.5)
finsAlong([X0, Y1], [X0, Y0], [-1, 0], 0, flat, 4.5)
finsAlong([XS1, Y0 + 0.8], [X1, Y0 + 0.8], [0, -1], PE, sliceZ, 4.5)
finsAlong([X1, Y1 - 0.8], [XS1, Y1 - 0.8], [0, 1], 0, sliceZ, 4.5)
finsAlong([X1, Y0 + 0.8], [X1, Y1 - 0.8], [1, 0], PE, sliceZ, 4.5)

// ── Rooftop: a mechanical screen and the mast ──
box(roof, -8, 8, 18, 34, ROOF, ROOF + 4, roof, 0.4)
box(metal, -13, -11, 25, 27, ROOF, MAST - 8, metal, 0.2)
box(metal, -12.5, -11.5, 25.5, 26.5, MAST - 8, MAST, metal, 0.2)

if (import.meta.main) {
  await save('atx-fairmont-austin', 'Fairmont Austin', [
    { part: glass, material: { ...PALETTE.window, color: 0x8badc8 } },
    { part: win, material: windowVariant(2, 0x687f96) },
    { part: fins, material: { ...PALETTE.trim, color: 0xdfe6ea } },
    { part: pod, material: { ...PALETTE.stone, color: 0xd9dde0 } },
    { part: roof, material: PALETTE.roof },
    { part: metal, material: { ...PALETTE.metal, color: 0xb7b9b6 } },
  ], { bearing: 17.9, height: MAST, replaces: ['way/134786106', 'way/850607753'] }, 5000)
}
