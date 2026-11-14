/**
 * Trade Tower (World Trade Center Seoul), Samseong-dong, Seoul — original
 * procedural geometry, CC0-1.0.
 * bun generators/seoul-trade-tower.ts
 *
 * Frame: BEARING 66.87, so model +y points to compass 66.87 (east-north-east,
 * towards Yeongdong-daero) and +x to compass 156.87. Origin = area centroid of
 * the OSM outline way/74056379. y = 0 is the plaza at the foot; elevation 0.
 * Terrain could not be checked: Mapterhorn has no z15 tiles over Seoul.
 *
 * Form, as read from OSM and the photos:
 * - a slender slab, 42 m across (x) by 28 m (y), to 228 m, in pale silver
 *   glass;
 * - its east-north-east end steps down in four stages on both sides (210,
 *   160, 110, 60 m, each 5.6 m deep), each step topped by a 5 m chamfer
 *   sloping away from the tower: the stepped chamfers that make the
 *   silhouette from the south and north;
 * - between the two stepped wings a darker recessed glass slot, stepping down
 *   lower than the wings (210, 150, 90 m), and the dark top of the slot
 *   (203-228 m) cut into the main slab's end: the light/dark vertical bands;
 * - pale frames at the step corners and broad vertical piers grouping the
 *   glass into bays (no floor lines);
 * - the sloped dark-glass entrance atrium at the foot of the stepped end;
 * - a red-and-white mast on the roof.
 *
 * Evidence
 * - OSM way/74056379 "트레이드타워" (height 228, 55 levels, wikidata Q486183,
 *   start 1988) and its parts, fetched 2026-11-13: way/380067758 (main
 *   slab, 228, 54 levels), way/380067752 (roof, 228-229), way/637098865-870,
 *   873, 874 (the wing steps: 210, 160, 110, 60, skillion roofs 5 m, facing
 *   68 deg), way/637322920, 637098871, 637098875, 637098877, 637098876 (the
 *   slot: 210, 203-228, 203-222, 150, 90, building:colour #325AA0),
 *   way/637098872 (the atrium, 5-30 m skillion).
 * - Published: 228 m, 55 floors, completed 1988 (en.wikipedia "Trade Tower").
 * - Photos (Wikimedia Commons, EVIDENCE):
 *   "Park Hyatt Seoul view.jpg" (from the south-east, high: the stepped end,
 *     dark slot, pale glass, mast),
 *     https://commons.wikimedia.org/wiki/File:Park_Hyatt_Seoul_view.jpg
 *   "Yeongdong-daero, Gangnam-gu, Seoul, South Korea.jpg" (from the south on
 *     Yeongdong-daero: the steps in profile, the atrium),
 *     https://commons.wikimedia.org/wiki/File:Yeongdong-daero,_Gangnam-gu,_Seoul,_South_Korea.jpg
 *   "Korea-Seoul-Bongeunsa-13.jpg" (from the north-west, Bongeunsa: the plain
 *     west end and the step profile edge-on),
 *     https://commons.wikimedia.org/wiki/File:Korea-Seoul-Bongeunsa-13.jpg
 *   "World Trade Center Seoul.jpg" (from above, the whole complex),
 *     https://commons.wikimedia.org/wiki/File:World_Trade_Center_Seoul.jpg
 *   Authors: kallerna (CC BY-SA 4.0), 张元柏 (CC BY-SA 3.0), Gaël Chardon
 *   (CC BY-SA 2.0), Seoul Institute (CC BY 4.0), in that order.
 *   Colours: main glass ~#9fb2c4 in sun, drawn #a5b7c7; slot ~#3b4c63,
 *   drawn #5d6d80; frames off-white. The step risers (the end faces of the
 *   wing steps) read dark in every photo and are drawn in the slot glass.
 *
 * Estimated: the pier spacing and widths, the frame sizes, the mast (12 m,
 * drawn bolder than real), the atrium's footing. No lidar exists for Korea.
 *
 * Night: offices lit (window-2 for the pale glass, window for the slot); the
 * mast stays unlit.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'

const BEARING = 66.87
const ANCHOR = { lng: 127.060983, lat: 37.510315 }

const pale = new Part(), dark = new Part(), frame = new Part(), roof = new Part(), mast = new Part(), entrance = new Part()

/**
 * A box over (x0..x1, y0..y1) from z0, with a top that may slope along y
 * (zt0 at y0, zt1 at y1) and an optional bevel on the vertical edges.
 */
function block(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, zt0: number, zt1 = zt0, top: Part | null = roof, bottom = false, bev = 0) {
  const b = bev
  const ring = (z0a: number, z1a: number, which: 'bot' | 'top'): V3[] => {
    const zA = which === 'bot' ? z0a : zt0, zB = which === 'bot' ? z0a : zt1
    void z1a
    return b > 0
      ? [[x0 + b, y0, zA], [x1 - b, y0, zA], [x1, y0 + b, zA], [x1, y1 - b, zB], [x1 - b, y1, zB], [x0 + b, y1, zB], [x0, y1 - b, zB], [x0, y0 + b, zA]]
      : [[x0, y0, zA], [x1, y0, zA], [x1, y1, zB], [x0, y1, zB]]
  }
  const lo = ring(z0, 0, 'bot'), hi = ring(0, 0, 'top')
  p.loft([lo, hi])
  if (top) top.cap(hi, true)
  if (bottom) p.cap(lo, false)
}

// ------------------------------------------------------------- the slab
const X = 21, Y0 = -27.1, YE = 0.7, H = 228
const SX = 6.7 // half-width of the dark slot
// main slab with a notch for the slot at its east end, top 203-228
block(pale, -X, X, Y0, -4.1, 0, H, H, roof, false, 0.8)
block(pale, -X, -SX, -4.1, YE, 0, H, H) // wing shoulders of the main slab
block(pale, SX, X, -4.1, YE, 0, H, H)
// the slot: dark, recessed 1.2 m from the wings' end planes, stepping 210 / 150 / 90
block(dark, -SX, SX, -4.1, YE - 1.2, 0, 228, 222, dark)
const slotSteps: [number, number, number][] = [[YE - 1.2, 6.4, 150], [6.4, 11.8, 90]]
for (const [a, b, h] of slotSteps) block(dark, -SX, SX, a, b - 1.2, 0, h, h - 5, dark)

// the wings: four steps each side, chamfered 5 m down towards +y
const steps: [number, number, number][] = [[YE, 6.4, 210], [6.4, 11.8, 160], [11.8, 17.6, 110], [17.6, 22.9, 60]]
for (const s of [-1, 1]) {
  const xa = s < 0 ? -X : SX, xb = s < 0 ? -SX : X
  for (const [a, b, h] of steps) block(pale, xa, xb, a, b, 0, h, h - 5, dark, false, 0.5) // the chamfer is dark sloped glass
}

// The risers: the exposed end face of each wing step (facing +y) is dark
// glass, so the stepped end reads as light treads and dark risers.
for (const s of [-1, 1]) {
  const xa = s < 0 ? -X : SX, xb = s < 0 ? -SX : X
  const tops = [H, ...steps.map(([, , h]) => h - 5)]
  const ys = [YE, ...steps.map(([, b]) => b)]
  for (let k = 0; k < ys.length; k++) {
    const zt = tops[k], zb = k + 1 < steps.length + 1 && k < steps.length ? steps[k][2] : 0
    if (zt <= zb) continue
    const y = ys[k] + 0.05
    dark.quad([xb, y, zb], [xa, y, zb], [xa, y, zt], [xb, y, zt])
  }
}

// ------------------------------------------------------------- frames
// Pale corner frames: on each wing step's outer leading corner and along the
// slot's lips, full height of the step (the white frames in the photos).
const FW = 1.4, FD = 0.35
function vframe(x: number, y: number, ox: number, oy: number, z1: number) {
  // a pale pier of FW across, standing FD proud of the wall, at (x, y), pushed out along (ox, oy)
  const hx = oy !== 0 ? FW / 2 : FD / 2, hy = ox !== 0 ? FW / 2 : FD / 2
  const cx = x + ox * FD / 2, cy = y + oy * FD / 2
  block(frame, cx - hx, cx + hx, cy - hy, cy + hy, 0, z1, z1, frame)
}
for (const s of [-1, 1]) {
  for (const [, b, h] of steps) {
    vframe(s * (X - FW / 2), b, 0, 1, h - 5) // on the step's end face, at the outer corner
    vframe(s * X, b - FW / 2, s, 0, h - 5) // on the side face, at the step's leading edge
    vframe(s * (SX + FW / 2), b, 0, 1, h - 5) // the slot lip
  }
  vframe(s * X, YE - FW / 2, s, 0, H) // main slab corner at the first step
  vframe(s * X, Y0 + 0.6 + FW / 2, s, 0, H) // west corners
  vframe(s * (X - 0.6 - FW / 2), Y0, 0, -1, H)
}
// broad vertical piers grouping the glass: on the long side faces of the
// slab (three bays), and on the west end (four bays)
for (const s of [-1, 1]) for (const y of [-17.9, -8.7]) vframe(s * X, y, s, 0, H - 2)
for (const x of [-7, 7]) vframe(x, Y0, 0, -1, H - 2)
// the roof parapet, a pale band round the top of the slab
for (const [x0, x1, y0, y1] of [[-X, X, Y0, Y0 + 1.2], [-X, X, -4.1 - 1.2, -4.1], [-X, -X + 1.2, Y0, YE], [X - 1.2, X, Y0, YE]] as [number, number, number, number][])
  block(frame, x0, x1, y0, y1, H, H + 2.2, H + 2.2, frame)

// ------------------------------------------------------------- the mast
block(mast, -1.6, 1.6, -15.6, -12.4, H, H + 6)
block(frame, -1.6, 1.6, -15.6, -12.4, H + 6, H + 9, H + 9, frame)
block(mast, -1.2, 1.2, -15.2, -12.8, H + 9, H + 14)

// ---------------------------------------------------- the entrance atrium
// way/637098872: dark glass sloping from 30 m at the tower down to the
// plaza, its footing a lit entrance hall.
{
  const x0 = -6.5, x1 = 7, ya = 11.8, yb = 34.3
  block(entrance, x0, x1, ya, yb, 0, 5, 5, null)
  const t: V3[] = [[x0, ya, 30], [x1, ya, 30], [x1, yb, 5], [x0, yb, 5]]
  dark.quad(t[0], t[1], t[2], t[3]) // sloped roof, facing up and out
  dark.tri([x0, yb, 5], [x0, ya, 5], [x0, ya, 30]) // side triangles
  dark.tri([x1, ya, 5], [x1, yb, 5], [x1, ya, 30])
}

const parts = [
  { part: pale, material: windowVariant(2, 0xa5b7c7) },
  { part: dark, material: { ...PALETTE.window, color: 0x5d6d80 } },
  { part: frame, material: finish('tt-frame', 0xe9eae6) },
  { part: roof, material: PALETTE.roof },
  { part: mast, material: finish('tt-mast-red', 0xc4473d) },
  { part: entrance, material: PALETTE.entrance },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Trade Tower', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: H + 14,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: REPLACES(),
})
function REPLACES() {
  return ['way/74056379', 'way/380067752', 'way/380067758', 'way/637098865', 'way/637098866', 'way/637098867', 'way/637098868',
    'way/637098869', 'way/637098870', 'way/637098871', 'way/637098872', 'way/637098873', 'way/637098874', 'way/637098875',
    'way/637098876', 'way/637098877', 'way/637322920']
}
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/seoul-trade-tower.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
