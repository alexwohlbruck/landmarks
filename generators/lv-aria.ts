/**
 * Aria Resort & Casino, Las Vegas: the two curved silver-blue glass hotel
 * towers set back to back, each with its pale louvred crown and a taller
 * slab at its ends past a slot, and their lower glass wings. Procedural,
 * CC0-1.0.
 * bun generators/lv-aria.ts
 *
 * Also the curved-tower helper this batch's Vdara uses.
 *
 * Map frame: x east, y north, z up, metres. Bearing 0: drawn in OSM's own
 * orientation. The origin is the area centroid of the main tower's outline,
 * way/134930092 (36.107191, -115.177226).
 *
 * Published (Wikipedia, "Aria Resort and Casino"; Pelli Clarke Pelli,
 * opened 2009): "two curvilinear glass towers"; the main one 50 storeys
 * (numbered to 61), the other ten storeys shorter. OSM: way/134930092,
 * 183 m, and way/134930090, 163 m; the lower wings way/134930089 and
 * way/134930091, 65 m, and way/134930088, 100 m.
 *
 * Measured, from OSM: both towers are crescents about 21.5 m deep. The main
 * tower's faces fit circles about one centre (138.5, 2.7) within 0.4 m,
 * radius 155 m (the convex west face) and 133.6 m (the concave east face),
 * running 152.5° to 208.5°, 150 m long. The second tower, to the
 * north-east, bends the other way: radii 140 m (west) and 161.7 m (east)
 * about (-88, 159), from -35° to 9.5°. Both outlines end in steps, where the
 * end slabs stand past a slot.
 *
 * Photos (Wikimedia Commons):
 * - "Aria Las Vegas December 2013.jpg", King of Hearts, CC BY-SA 3.0: from
 *   the south-east, high up, the main tower's concave east face, its crown
 *   and the slot and taller slab at its south end; the second tower behind;
 * - "Project CityCenter in Las Vegas.jpg", Tristan Surtel, CC BY-SA 4.0:
 *   from the east, both towers, the pale louvred crowns, the silver-blue
 *   glass with its pale floor lines, the lower wings;
 * - "CityCenter - East Pano 1 - 2011-06-04.jpg" and "East Pano 2",
 *   Cygnusloop99, CC BY-SA 3.0: from the Strip, the curved tops;
 * - "Daytime aerial view of the Strip ... LCCN2010630596", Carol M.
 *   Highsmith, public domain: from the south, the two towers' tops.
 *
 * Estimated: the crown band (the top 12 m), the end slabs 5 m above the
 * roof, the slot 3 m deep, the floor lines every four storeys (14 m). Left out:
 * the casino podium (way/52175576, left on the map), the "Aria" signs, the
 * porte-cochère canopies.
 */
import { Part } from './mesh'
import { PALETTE, windowVariant } from './palette'
import { arc, crescent, polar, prism, save, strip, type XY } from './lv-wynn'

/** Light, reflective silver-blue glass (STYLE.md: a lighter window variant). */
export const SILVER = windowVariant(2, 0xa9bfd1)

export type Curved = {
  c: XY; r0: number; r1: number
  /** body from a0 to a1 degrees (a0 < a1) */
  a0: number; a1: number
  H: number
  /** pale crown band height */
  crown: number
  /** end slabs: how many degrees each spans, past a slot of `slot` degrees, and how much taller */
  ends?: { span: number; slot: number; rise: number; at: ('a0' | 'a1')[] }
  /** floor lines: from z0, every step */
  lines: { z0: number; step: number; h: number }
  seg?: number
}

/**
 * A curved glass tower: a crescent of glass with pale floor lines on both
 * curved faces and a pale crown band, ending at either end in a slab that
 * stands past a narrow recessed slot and rises above the roof.
 */
export function curvedTower(t: Curved, glass: Part, line: Part, roof: Part) {
  const n = t.seg ?? Math.max(6, Math.round((t.a1 - t.a0) / 2.5))
  const body = (a0: number, a1: number, r0: number, r1: number, H: number, segs: number) => {
    prism(glass, null, crescent(t.c, r0, r1, a0, a1, segs), 0, H - t.crown, 0, 0.4)
    prism(line, roof, crescent(t.c, r0 - 0.15, r1 + 0.15, a0, a1, segs), H - t.crown, H, 0.4, 0.4)
    // floor lines on both curved faces, kept 1 m inside each end
    const pad = (r: number) => (1 / r) * (180 / Math.PI)
    for (let z = t.lines.z0; z + t.lines.h < H - t.crown - 1; z += t.lines.step) {
      const ls = Math.max(1, Math.ceil(segs / 2)) // lines need fewer segments than the walls
      // proud enough that the chords clear the curved wall
      strip(line, arc(t.c, r1, a0 + pad(r1), a1 - pad(r1), ls), z, z + t.lines.h, 0.25)
      strip(line, arc(t.c, r0, a1 - pad(r0), a0 + pad(r0), ls), z, z + t.lines.h, 0.08)
    }
  }
  let a0 = t.a0, a1 = t.a1
  const e = t.ends
  if (e?.at.includes('a0')) a0 += e.span + e.slot
  if (e?.at.includes('a1')) a1 -= e.span + e.slot
  body(a0, a1, t.r0, t.r1, t.H, n)
  if (e) {
    for (const side of e.at) {
      const [s0, s1, k0, k1] = side === 'a0'
        ? [t.a0, t.a0 + e.span, t.a0 + e.span, t.a0 + e.span + e.slot]
        : [t.a1 - e.span, t.a1, t.a1 - e.span - e.slot, t.a1 - e.span]
      body(s0, s1, t.r0, t.r1, t.H + e.rise, 3)
      // the slot: recessed 3 m on both faces, to the crown's foot
      prism(glass, roof, crescent(t.c, t.r0 + 3, t.r1 - 3, k0, k1, 1), 0, t.H - t.crown + 0.01, 0, 0)
    }
  }
}

/** A plain lower wing from an OSM outline: glass with floor lines. */
export function wing(ring: XY[], H: number, glass: Part, line: Part, roof: Part, step = 14) {
  prism(glass, roof, ring, 0, H, 0.4, 0.4)
  for (let z = 6; z + 1 < H - 2; z += step) {
    for (let i = 0; i < ring.length; i++) {
      const a = ring[i], b = ring[(i + 1) % ring.length]
      const L = Math.hypot(b[0] - a[0], b[1] - a[1])
      if (L < 4) continue
      const k = 0.8 / L
      strip(line, [[a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k], [b[0] - (b[0] - a[0]) * k, b[1] - (b[1] - a[1]) * k]], z, z + 1)
    }
  }
}

if (import.meta.main) {
  const glass = new Part(), line = new Part(), roof = new Part()
  const LINES = { z0: 10, step: 14, h: 1.2 }
  // the main tower, 183 m
  curvedTower({ c: [138.5, 2.7], r0: 133.6, r1: 155, a0: 152.5, a1: 208.5, H: 178, crown: 12,
    ends: { span: 3.2, slot: 0.9, rise: 5, at: ['a0', 'a1'] }, lines: LINES }, glass, line, roof)
  // the second tower, 163 m
  curvedTower({ c: [-88, 159], r0: 140, r1: 161.7, a0: -35, a1: 9.5, H: 158, crown: 11,
    ends: { span: 3.4, slot: 0.9, rise: 5, at: ['a0', 'a1'] }, lines: LINES }, glass, line, roof)

  // the lower wings, from OSM (the parts outside the towers)
  const LINK: XY[] = [[51.8, 76.8], [45.0, 67.2], [37.6, 57.9], [28.0, 47.4], [16.5, 36.8], [7.4, 30.0], [8.7, 35.7], [10.3, 40.9],
    [11.8, 45.9], [16.0, 55.5], [19.6, 62.1], [14.4, 76.1], [11.9, 69.6], [-0.3, 71.2], [6.4, 84.2], [10.8, 90.4], [12.4, 92.6],
    [21.0, 102.7], [27.0, 109.2], [28.3, 110.6], [37.6, 119.6], [48.8, 128.5], [48.1, 125.1], [42.8, 109.3], [37.6, 97.4],
    [32.0, 88.0], [28.4, 81.9], [33.4, 71.1], [38.6, 79.1]]
  const WEST: XY[] = [[-15.1, 22.7], [-12.7, 35.5], [-9.9, 46.4], [-8.9, 49.2], [-17.0, 45.9], [-23.8, 43.1], [-32.8, 39.2],
    [-45.6, 34.9], [-58.5, 32.1], [-70.3, 30.2], [-79.7, 29.6], [-88.3, 29.2], [-99.4, 29.0], [-104.1, 20.3], [-110.0, 21.1],
    [-118.1, 8.1], [-110.7, 6.6], [-100.6, 5.1], [-90.8, 4.2], [-84.1, 4.1], [-76.8, 4.2], [-72.1, 4.5], [-66.7, 4.8],
    [-58.8, 5.7], [-52.5, 7.2], [-46.8, 8.4], [-37.0, 11.3], [-27.8, 14.6], [-15.5, 19.0]]
  const EAST: XY[] = [[71.9, 115.7], [78.6, 119.8], [86.4, 123.4], [96.2, 127.0], [105.1, 129.8], [113.7, 131.8], [121.9, 133.1],
    [130.1, 133.1], [133.8, 143.3], [136.9, 143.2], [138.1, 146.1], [141.1, 146.1], [144.9, 155.8], [131.8, 155.2], [120.7, 154.4],
    [110.6, 153.0], [100.8, 151.1], [91.4, 148.8], [80.1, 145.1], [72.8, 142.1], [71.7, 132.3], [68.4, 118.1], [66.8, 112.2]]
  wing(LINK, 65, glass, line, roof)
  wing(WEST, 65, glass, line, roof)
  wing(EAST, 100, glass, line, roof)

  await save('lv-aria', 'Aria Resort & Casino', [
    { part: glass, material: SILVER },
    { part: line, material: PALETTE.trim },
    { part: roof, material: PALETTE.roof },
  ], 183, 'Y up, -Z north, +X east, metres; origin at the way/134930092 centroid; bearing 0')
}
