/**
 * Bow Bridge, Central Park (Calvert Vaux and Jacob Wrey Mould, 1862; cast
 * by Janes, Kirtland & Co.) — procedural, CC0-1.0, no textures.
 * bun generators/nyc-bow-bridge.ts
 *
 * Frame: x across the bridge, y along it toward its north-west end
 * (bearing 328.7°), z up, metres; y = 0 at the middle of the span, z = 0 at
 * the Lake's water. Anchor: the middle of OSM's man_made=bridge outline
 * way/580516390, -73.971771, 40.775759. The model draws the whole outline
 * (iron span, both stone abutments, railings and the walkway's planking),
 * so `replaces` lists it. The paths beyond the outline are the map's.
 *
 * Evidence
 * - OSM (ODbL): outline way/580516390 (44 m long, 4.6–4.8 m wide over the
 *   span, flaring to ~6 m at the ends), footway way/306771373 (bridge=yes,
 *   layer 1, surface=wood). Bearing from the outline's long axis.
 * - Published (Wikipedia, "Bow Bridge (Central Park)"; HAER NY-195): span
 *   87 ft (26.5 m), balustrade 142 ft (43 m); interlocking-circle railing,
 *   eight planting urns on panelled posts, arabesque scrolls in the
 *   spandrels; restored 1974 and 2023.
 * - Photos (Wikimedia Commons):
 *   Christian David, "Bow Bridge over the Lake, Central Park" (CC BY-SA 4.0)
 *     https://commons.wikimedia.org/wiki/File:Bow_Bridge_over_the_Lake,_Central_Park,_Manhattan,_New_York.jpg
 *   Jakub Hałun, "Bow Bridge, Central Park, New York City, 20231004 1705 2131" (CC BY 4.0)
 *     https://commons.wikimedia.org/wiki/File:Bow_Bridge,_Central_Park,_New_York_City,_20231004_1705_2131.jpg
 *   Bmzuckerman, "Hybrid – Early Victorian … Central Park (Bow Bridge) (2)"
 *     (CC BY 4.0, the abutment, post and spandrel close up)
 *     https://commons.wikimedia.org/wiki/File:Hybrid_-_Early_Victorian_(Gothic_Revival,_Renaissance_Revival)_-_New_York,_NY_-_Central_Park_(Bow_Bridge)_(2).jpg
 *   Superbass, "2024-11-19-Bow Bridge (Central Park)-0644" (CC BY-SA 4.0, the urns)
 *     https://commons.wikimedia.org/wiki/File:2024-11-19-Bow_Bridge_(Central_Park)-0644.jpg
 *
 * Estimated from the side-on photo (David) scaled to the published 43 m
 * balustrade: railing top 5.2 m over the water at midspan and ~2.9 m at the
 * ends (the "bow"), railing 1.1 m, fascia 0.7 m, the arch's soffit 3.3 m
 * above the water at the crown and springing ~0.6 m up on the abutments'
 * faces; the posts (0.75 m square) and urns. Not measured with lidar.
 * The railing's interlocking circles are drawn as a cream panel with a row
 * of dark round openings, as it reads from the shore; the spandrel scrolls
 * as an inset panel.
 *
 * The abutments' feet follow the map's terrain (Mapterhorn): water level to
 * |y| = 14.3 m, rising to 1.8 m at the ends.
 *
 * Doubts: the banks' real height at the abutments; the deck's camber is a parabola.
 */
import { Part, type V3 } from './mesh'
import { finishModel } from './nyc-570-lexington'

const paint = new Part(), stone = new Part(), dark = new Part(), wood = new Part(), urn = new Part()

const HALF = 21.5 // half the balustrade's length
const SPAN = 13.25 // half the iron span, abutment face to face
const deck = (y: number) => 4.1 - 2.3 * (y / HALF) ** 2
const halfW = (y: number) => (Math.abs(y) <= SPAN ? 2.4 : 2.4 + (0.6 * (Math.abs(y) - SPAN)) / (HALF - SPAN))
const RISE = 2.7, SPR = 0.6
const R = (SPAN * SPAN + RISE * RISE) / (2 * RISE)
const arch = (y: number) => SPR + Math.sqrt(R * R - y * y) - (R - RISE)

/** The banks under the abutments, from Mapterhorn: level with the water to |y| 14.3, 1.8 m up at the ends. */
const bank = (y: number) => Math.max(0, (1.8 * (Math.abs(y) - 14.3)) / (HALF - 14.3))
const ys = (a: number, b: number, n: number) => Array.from({ length: n + 1 }, (_, i) => a + ((b - a) * i) / n)

/** A quad wound to face n. */
function qn(p: Part, a: V3, b: V3, c: V3, d: V3, n: V3) {
  const e1 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], e2 = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  const g = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]]
  if (g[0] * n[0] + g[1] * n[1] + g[2] * n[2] >= 0) p.quad(a, b, c, d); else p.quad(d, c, b, a)
}
function cube(p: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number) {
  const a: V3 = [x0, y0, z0], b: V3 = [x1, y0, z0], c: V3 = [x1, y1, z0], d: V3 = [x0, y1, z0]
  const e: V3 = [x0, y0, z1], f: V3 = [x1, y0, z1], g: V3 = [x1, y1, z1], h: V3 = [x0, y1, z1]
  p.quad(a, b, f, e); p.quad(b, c, g, f); p.quad(c, d, h, g); p.quad(d, a, e, h); p.quad(e, f, g, h)
}
/** A strip on the side face x = s·(halfW(y)+off) between lo(y) and hi(y), facing out (or in). */
function side(p: Part, s: number, off: number, yy: number[], lo: (y: number) => number, hi: (y: number) => number, out = true) {
  for (let i = 0; i < yy.length - 1; i++) {
    const a = yy[i], b = yy[i + 1], xa = s * (halfW(a) + off), xb = s * (halfW(b) + off)
    qn(p, [xa, a, lo(a)], [xb, b, lo(b)], [xb, b, hi(b)], [xa, a, hi(a)], [out ? s : -s, 0, 0])
  }
}
/** A horizontal strip between two side offsets, at z(y), facing up or down. */
function across(p: Part, o0: number, o1: number, yy: number[], z: (y: number) => number, up: boolean, sides = [-1, 1]) {
  for (const s of sides)
    for (let i = 0; i < yy.length - 1; i++) {
      const a = yy[i], b = yy[i + 1]
      qn(p, [s * (halfW(a) + o0), a, z(a)], [s * (halfW(b) + o0), b, z(b)], [s * (halfW(b) + o1), b, z(b)], [s * (halfW(a) + o1), a, z(a)], [0, 0, up ? 1 : -1])
    }
}

const all = ys(-HALF, HALF, 32)
const span = ys(-SPAN, SPAN, 20)
const RAIL = 1.1, FASCIA = 0.7

for (const s of [-1, 1]) {
  // The fascia: the deck's edge band, cream iron over the span, the full length.
  side(paint, s, 0.15, all, (y) => deck(y) - FASCIA, deck)
  side(paint, s, 0.22, all, (y) => deck(y) - 0.12, (y) => deck(y) + 0.02) // a moulding at its top
  across(paint, 0.15, 0.22, all, (y) => deck(y) + 0.02, true, [s])
  // The railing: a cream panel with a capping rail.
  side(paint, s, 0.05, all, deck, (y) => deck(y) + RAIL - 0.1)
  side(paint, s, -0.12, all, deck, (y) => deck(y) + RAIL - 0.1, false)
  side(paint, s, 0.1, all, (y) => deck(y) + RAIL - 0.1, (y) => deck(y) + RAIL)
  side(paint, s, -0.17, all, (y) => deck(y) + RAIL - 0.1, (y) => deck(y) + RAIL, false)
  across(paint, -0.17, 0.1, all, (y) => deck(y) + RAIL, true, [s])
  // Its interlocking circles: a row of dark round openings on both faces.
  const pitch = 0.62
  for (let y = -HALF + 0.6; y <= HALF - 0.5; y += pitch) {
    if ([SPAN, HALF - 0.45].some((p) => Math.abs(Math.abs(y) - p) < 0.55)) continue
    const zc = deck(y) + 0.55, r = 0.2
    for (const [off, out] of [[0.07, 1], [-0.14, -1]] as [number, number][]) {
      const x = s * (halfW(y) + off), pts: V3[] = Array.from({ length: 6 }, (_, k) => [x, y + r * Math.cos((k * Math.PI) / 3), zc + r * Math.sin((k * Math.PI) / 3)])
      for (let k = 1; k < 5; k++) {
        const n: V3 = [s * out, 0, 0]
        const [a, b, c] = [pts[0], pts[k], pts[k + 1]]
        const g = (b[1] - a[1]) * (c[2] - a[2]) - (b[2] - a[2]) * (c[1] - a[1])
        if (g * n[0] >= 0) dark.tri(a, b, c); else dark.tri(a, c, b)
      }
    }
  }
  // The spandrel: an inset panel between the arch and the fascia, its
  // scrolls read as darker openwork near the springings.
  side(paint, s, 0.0, span, arch, (y) => deck(y) - FASCIA)
  const scroll = (y: number) => Math.abs(y) > SPAN - 4.2
  for (const sg of [-1, 1]) {
    const yy = ys(sg * (SPAN - 0.5), sg * (SPAN - 4.2), 5)
    side(dark, s, 0.02, yy, (y) => arch(y) + 0.5, (y) => deck(y) - FASCIA - 0.12)
  }
  void scroll
  // The arch rib: a bolder band on the arch's lower edge, proud of the spandrel.
  side(paint, s, 0.12, span, arch, (y) => arch(y) + 0.45)
  across(paint, 0.0, 0.12, span, (y) => arch(y) + 0.45, true, [s])
  across(paint, 0.0, 0.12, span, arch, false, [s])
}
// The arch's soffit across the width, and the deck's underside over the abutments.
for (let i = 0; i < span.length - 1; i++) {
  const a = span[i], b = span[i + 1], w = halfW(0)
  qn(paint, [-w, a, arch(a)], [w, a, arch(a)], [w, b, arch(b)], [-w, b, arch(b)], [0, 0, -1])
}
// The walkway: planking between the railings, the full length.
for (let i = 0; i < all.length - 1; i++) {
  const a = all[i], b = all[i + 1]
  qn(wood, [-(halfW(a) - 0.12), a, deck(a)], [halfW(a) - 0.12, a, deck(a)], [halfW(b) - 0.12, b, deck(b)], [-(halfW(b) - 0.12), b, deck(b)], [0, 0, 1])
}

// The abutments: dressed stone from the water to the fascia, flaring to the ends.
for (const sg of [-1, 1]) {
  const yy = ys(sg * SPAN, sg * HALF, 4)
  for (const s of [-1, 1]) side(stone, s, 0.15, yy, bank, (y) => deck(y) - FASCIA)
  // its face to the water under the arch's springing
  const w = halfW(SPAN) + 0.15
  qn(stone, [-w, sg * SPAN, 0], [w, sg * SPAN, 0], [w, sg * SPAN, arch(SPAN) + 0.2], [-w, sg * SPAN, arch(SPAN) + 0.2], [0, -sg, 0])
  // pilaster posts on the abutment faces, the urn posts above the railing
  for (const s of [-1, 1]) {
    for (const yp of [SPAN + 0.4, HALF - 0.45]) {
      const y = sg * yp, x = s * (halfW(y) + 0.1), z0 = deck(y) - FASCIA
      cube(stone, x - 0.42, y - 0.42, x + 0.42, y + 0.42, bank(y), z0 + 0.05)
      cube(paint, x - 0.4, y - 0.4, x + 0.4, y + 0.4, z0, deck(y) + RAIL + 0.25)
      cube(paint, x - 0.48, y - 0.48, x + 0.48, y + 0.48, deck(y) + RAIL + 0.25, deck(y) + RAIL + 0.4)
      // the urn: foot, bowl and lip
      const zb = deck(y) + RAIL + 0.4, ring = (r: number, z: number): V3[] => Array.from({ length: 8 }, (_, k) => [x + r * Math.cos((k * Math.PI) / 4), y + r * Math.sin((k * Math.PI) / 4), z])
      const rings = [ring(0.18, zb), ring(0.12, zb + 0.15), ring(0.28, zb + 0.3), ring(0.42, zb + 0.6), ring(0.45, zb + 0.75)]
      urn.loft(rings)
      urn.cap(rings[rings.length - 1], true)
    }
  }
}

finishModel('Bow Bridge', 'nyc-bow-bridge', [
  { part: paint, material: { name: 'cast-iron-cream', color: 0xe8e1cb, roughness: 0.7 } },
  { part: stone, material: { name: 'stone', color: 0xb9a888, roughness: 0.9 } },
  { part: dark, material: { name: 'openwork', color: 0x59604f, roughness: 0.9 } },
  { part: wood, material: { name: 'walkway', color: 0x9a8670, roughness: 0.9 } },
  { part: urn, material: { name: 'metal', color: 0x8f8a78, roughness: 0.7 } },
], { bearing: 328.7, osm: 'way/580516390', height: deck(0) + 1.1 })
