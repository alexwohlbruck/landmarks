/**
 * Kyobo Tower (Gangnam), Seocho-dong, Seoul — original procedural geometry,
 * CC0-1.0.
 * bun generators/seoul-kyobo-tower.ts
 *
 * Mario Botta's twin brick-red masses (2003) with the deep glazed slot
 * between them.
 *
 * Frame: BEARING 339.6, so model +y points to compass 339.6 (from the south
 * mass to the north mass) and +x to compass 69.6 (the masses' long axis, the
 * end faces looking onto Gangnam-daero). Origin at 127.024118, 37.503787, the
 * centre of the OSM footprint. y = 0 is the street; elevation 0. Terrain
 * could not be checked: Mapterhorn has no z15 tiles over Seoul.
 *
 * Form, as read from OSM and the photos:
 * - two terracotta slabs, 47.5 x 21 m each (OSM way/304366173 north,
 *   way/541900102 south), 118 m tall, with bevelled edges;
 * - between them an 18 m gap: the glass wall of the 23-storey core part
 *   (way/541900101) set 15 m back from both ends, and in front of it the low
 *   4-storey glazed entrance halls (way/541900103, way/541900105) behind
 *   pairs of round columns;
 * - each slab's end faces split by a central recessed groove (the two halves
 *   standing proud), its outer long face by three grooves into four bays, the dark glazed bays recessed into the top of each end
 *   face, and the square opening punched through the top floors of each
 *   slab's outer long face, open to the sky behind;
 * - brick red all over, no window grid: the real horizontal brick louvres
 *   are far too fine for the map and read as a solid red mass at distance.
 *
 * Evidence
 * - OSM relation/7747040 "교보타워" (building=yes, height 118, 25 levels,
 *   start 2003, wikidata Q134561816), outers way/304366173 and
 *   way/541900102 (25.5 levels each); way/541900101 (23 levels),
 *   way/541900103 and way/541900105 (4 levels, same wikidata), fetched
 *   2026-11-13.
 * - Photos (Flickr, EVIDENCE, CC BY 2.0):
 *   "Mario Botta - Kyobo Tower 01.jpg", Forgemind ArchiMedia,
 *     https://www.flickr.com/photos/44343967@N00/5052325759 (from the
 *     south-east on Gangnam-daero: both slabs, the groove, the top recesses
 *     and the opening through the top, the colour);
 *   "Mario Botta - Kyobo Tower 02.jpg" and "03.jpg", Forgemind ArchiMedia,
 *     https://www.flickr.com/photos/44343967@N00/5052943862 (the striped
 *     entrance columns), https://www.flickr.com/photos/44343967@N00/5052326237
 *     (the lobby between the slabs);
 *   "Gangnam Mario Botta Tower", TCA Think Tank,
 *     https://www.flickr.com/photos/97114498@N04/37078168201 and
 *     https://www.flickr.com/photos/97114498@N04/37048801152 (the brick skin
 *     close up; the view out of the slot between the slabs).
 *   Colour: brick sampled #823c37 on the lit face and #3d2322 in shade in
 *   the Forgemind photo (overcast), a dark red-brown; drawn #95493d (pulled
 *   up to the palette's lightness, keeping the brown-red hue).
 *   The grouped dark slits: the photo shows columns of small dark window
 *   slits beside the grooves and towards the slot; drawn as vertical
 *   columns of two-storey dark panels with brick between (no floor lines).
 * - Look-only (CC BY-NC, not used for shape): Flickr photos by sokokyu,
 *   DraconianRain and 黒忍者 of the tower.
 *
 * Estimated: the slot glass height (23/25.5 of 118 m), the entrance halls'
 * 18 m, the groove, recess and opening sizes (from the one distant photo),
 * the columns. The west faces were not photographed: drawn as the east.
 * No lidar exists for Korea.
 *
 * Night: the glass slot, the top bays and the entrance halls are lit.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const BEARING = 339.6
const ANCHOR = { lng: 127.024118, lat: 37.503787 }

const brick = new Part(), glass = new Part(), hall = new Part(), col = new Part(), roof = new Part()

function box(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, o: { bev?: number; top?: Part | null; bottom?: boolean } = {}) {
  const b = o.bev ?? 0, top = o.top === undefined ? p : o.top
  const r = (z: number, i: number): V3[] => [[x0 + i, y0, z], [x1 - i, y0, z], [x1, y0 + i, z], [x1, y1 - i, z], [x1 - i, y1, z], [x0 + i, y1, z], [x0, y1 - i, z], [x0, y0 + i, z]]
  if (b > 0) {
    p.loft([r(z0, b), r(z1 - b, b)])
    // a chamfered top edge
    const inner: V3[] = [[x0 + b, y0 + b, z1], [x1 - b, y0 + b, z1], [x1 - b, y0 + b, z1], [x1 - b, y1 - b, z1], [x1 - b, y1 - b, z1], [x0 + b, y1 - b, z1], [x0 + b, y1 - b, z1], [x0 + b, y0 + b, z1]]
    p.loft([r(z1 - b, b), inner])
    if (top) top.cap([[x0 + b, y0 + b, z1], [x1 - b, y0 + b, z1], [x1 - b, y1 - b, z1], [x0 + b, y1 - b, z1]], true)
    if (o.bottom) p.cap(r(z0, b), false)
  } else {
    const q = (z: number): V3[] => [[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]]
    p.loft([q(z0), q(z1)])
    if (top) top.cap(q(z1), true)
    if (o.bottom) p.cap(q(z0), false)
  }
}
function cylinder(p: Part, cx: number, cy: number, r: number, z0: number, z1: number, n = 14) {
  const ring = (z: number) => Array.from({ length: n }, (_, k) => [cx + r * Math.cos((2 * Math.PI * k) / n), cy + r * Math.sin((2 * Math.PI * k) / n), z] as V3)
  for (let k = 0; k < n; k++) {
    const a = (2 * Math.PI * k) / n, b = (2 * Math.PI * (k + 1)) / n
    const na: V3 = [Math.cos(a), Math.sin(a), 0], nb: V3 = [Math.cos(b), Math.sin(b), 0]
    const p0 = ring(z0)[k], p1 = ring(z0)[(k + 1) % n], p2 = ring(z1)[(k + 1) % n], p3 = ring(z1)[k]
    p.tri(p0, p1, p2, [0, 0], [0, 0], [0, 0], [na, nb, nb])
    p.tri(p0, p2, p3, [0, 0], [0, 0], [0, 0], [na, nb, na])
  }
  p.cap(ring(z1), true)
}

/**
 * A column of grouped dark window slits on a wall: panels 1.1 m wide and
 * 9 m (about two storeys) tall with 3 m of brick between them, set 5 cm
 * proud of the wall at `plane` (an x plane when `axis` is 'x', else a y
 * plane), facing `out` (+1 or -1), centred at `at` along the wall.
 */
function slits(axis: 'x' | 'y', plane: number, out: number, at: number, z0: number, z1: number) {
  const w = 0.55, q = plane + out * 0.05
  for (let z = z0; z + 9 <= z1; z += 12) {
    const a = at - w, b = at + w, za = z, zb = z + 9
    const pts: V3[] = axis === 'x'
      ? [[q, a, za], [q, b, za], [q, b, zb], [q, a, zb]]
      : [[a, q, za], [b, q, za], [b, q, zb], [a, q, zb]]
    // wind the panel to face `out`
    const facesPlus = axis === 'x' ? true : false
    const flip = (facesPlus ? out > 0 : out < 0)
    if (flip) glass.quad(pts[0], pts[1], pts[2], pts[3])
    else glass.quad(pts[0], pts[3], pts[2], pts[1])
  }
}

const XE = 23.8, H = 118
const TOPZ = H - 22 // top of the opening zone
/**
 * One slab over y0..y1 (outer face at `yo`, inner face at `yi`): the brick
 * mass with the punched opening through its top floors, the top recesses on
 * the end faces, and the proud halves that leave a groove down every face.
 */
function slab(y0: number, y1: number, outerSign: number) {
  const XB = XE - 2.2 // the body's end faces, 2.2 m behind the proud end piers
  const HX = 7 // half-width of the opening (x)
  const OZ0 = TOPZ - 2, OZ1 = H - 6 // the opening's sill and head
  // below the opening
  box(brick, -XB, XB, y0, y1, 0, OZ0, { top: null })
  // either side of the opening, full depth
  box(brick, -XB, -HX, y0, y1, OZ0, OZ1, { top: null })
  box(brick, HX, XB, y0, y1, OZ0, OZ1, { top: null })
  // the opening's floor (seen from above and through the hole)
  roof.cap([[-HX, y0, OZ0], [HX, y0, OZ0], [HX, y1, OZ0], [-HX, y1, OZ0]], true)
  // the head over the opening and the roof
  box(brick, -XB, XB, y0, y1, OZ1, H, { bev: 0.8, top: roof, bottom: true })

  // The end faces: two proud brick piers either side of a 2 m groove, and
  // over the top 26 m a dark glazed bay in the middle third, under a lintel.
  const G = 1.0, ym = (y0 + y1) / 2
  for (const s of [-1, 1]) {
    const xa = Math.min(s * XB, s * XE), xb = Math.max(s * XB, s * XE)
    box(brick, xa, xb, y0, ym - G, 0, H - 26, { bev: 0.3 })
    box(brick, xa, xb, ym + G, y1, 0, H - 26, { bev: 0.3 })
    box(brick, xa, xb, y0, y0 + 6.5, H - 26, H, { bev: 0.6, top: roof })
    box(brick, xa, xb, y1 - 6.5, y1, H - 26, H, { bev: 0.6, top: roof })
    box(brick, xa, xb, y0 + 6.5, y1 - 6.5, H - 4, H, { bev: 0.3, top: roof, bottom: true })
    const xg = s * (XB + 0.05), gy0 = y0 + 6.5, gy1 = y1 - 6.5
    if (s > 0) glass.quad([xg, gy0, H - 26], [xg, gy1, H - 26], [xg, gy1, H - 4], [xg, gy0, H - 4])
    else glass.quad([xg, gy1, H - 26], [xg, gy0, H - 26], [xg, gy0, H - 4], [xg, gy1, H - 4])
    // the groove's floor-to-sill closure where the bay begins
    box(brick, xa, xb, ym - G, ym + G, H - 27, H - 26, { top: brick })
    // grouped dark slits flanking the groove, as in the photo
    for (const y of [ym - G - 2.2, ym + G + 2.2]) slits('x', s * XE, s, y, 24, H - 28)
  }
  // the outer long face: proud halves with the central groove, and pier
  // frames either side of the opening
  const D = 0.9, yf = outerSign > 0 ? y1 : y0
  const ya = Math.min(yf, yf + outerSign * D), yb = Math.max(yf, yf + outerSign * D)
  const edges = [-XB + 1.5, -11, 0, 11, XB - 1.5] // grooves at -11, 0 and 11 m
  for (let k = 0; k < edges.length - 1; k++) {
    const a = edges[k] + (k > 0 ? G * 0.7 : 0), b = edges[k + 1] - (k < edges.length - 2 ? G * 0.7 : 0)
    box(brick, a, b, ya, yb, 0, OZ0, { bev: 0.3 })
    slits('y', outerSign > 0 ? yb : ya, outerSign, (a + b) / 2, 24, OZ0 - 2)
  }
  // and on the inner faces towards the slot, either side of the glass core
  const yi = outerSign > 0 ? y0 : y1
  for (const x of [-16.5, 16.5]) slits('y', yi, -outerSign, x, 24, H - 6)
  box(brick, -XB + 1.5, -HX, ya, yb, OZ0, H - 3, { bev: 0.3 })
  box(brick, HX, XB - 1.5, ya, yb, OZ0, H - 3, { bev: 0.3 })
}
slab(9.3, 30.4, 1) // north
slab(-30.6, -8.7, -1) // south

// ------------------------------------------------------------ the slot
const SL = 106 // the 23-storey glass core between the slabs
box(glass, -8.7, 8.4, -8.7, 9.3, 0, SL, { top: roof })
// grouped vertical piers on the slot's glass ends (three bays)
for (const sx of [-8.7, 8.4]) for (const y of [-2.7, 3.3]) {
  const o = sx > 0 ? 0.4 : -0.4
  box(brick, Math.min(sx, sx + o), Math.max(sx, sx + o), y - 0.6, y + 0.6, 0, SL, { top: brick })
}
// the 4-storey entrance halls in front of the slot, both ends
box(hall, -XE + 1.5, -8.7, -8.7, 9.3, 0, 18, { top: roof })
box(hall, 8.4, XE - 1.5, -8.7, 9.3, 0, 18, { top: roof })
// a brick lintel across the gap at the hall roof, both ends
box(brick, -XE, -XE + 2.5, -8.7, 9.3, 18, 22, { bev: 0.3 })
box(brick, XE - 2.5, XE, -8.7, 9.3, 18, 22, { bev: 0.3 })
// the round entrance columns, two per end
for (const s of [-1, 1]) for (const y of [-4, 4.6]) cylinder(col, s * (XE - 0.6), y, 1.1, 0, 18)

const parts = [
  { part: brick, material: finish('kyobo-brick', 0x95493d, 0.9) },
  { part: glass, material: { ...PALETTE.window, color: 0x55687a } },
  { part: hall, material: PALETTE.entrance },
  { part: col, material: finish('kyobo-column', 0xd8d4cc) },
  { part: roof, material: PALETTE.roof },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Kyobo Tower', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: H,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['relation/7747040', 'way/304366173', 'way/541900102', 'way/541900101', 'way/541900103', 'way/541900105'],
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/seoul-kyobo-tower.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
