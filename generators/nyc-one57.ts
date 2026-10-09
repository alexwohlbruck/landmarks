/**
 * One57, 157 West 57th Street (Christian de Portzamparc, 2014) — original
 * procedural geometry, CC0-1.0.
 * bun generators/nyc-one57.ts
 *
 * x = across the Manhattan grid (118.9°), y = up the avenues (28.9°),
 * z = metres up. Anchor is the centroid of OSM way/260283692
 * (40.7655013, -73.9790093); bearing 28.9°, elevation 0. 57th Street is to
 * the south (y ≈ -25), 58th Street to the north.
 *
 * Evidence
 * - OSM: the outline and 14 building:parts (way/292145960 … 292145973),
 *   which lay out the cascade: the main slab, 20.8 × 35 m, to 306 m; an
 *   annex on its south-east to 298.6 m; the east step to 230 m with its
 *   rounded front strip to 226.8 m; the lower east block to 125 m and its
 *   front strip to 119.8 m; the west step to 95 m; the 57th Street podium
 *   at 35–45 m; a 30 m base on the north and east. Parts tagged
 *   roof:shape=round are the curved tops.
 * - Measured (USGS 3DEP 2017 lidar): the main roof slopes from 310 m at the
 *   58th Street edge through 304 m at mid-depth to 297 m near the south
 *   edge, then rolls over; the east step's roof is 229–233 m; the west strip
 *   the parts leave out (x -26.4…-21.5) stands 32–37 m. The glazed lower
 *   cascade returned almost no points, so its heights are OSM's.
 * - Published (Wikipedia): roof 1,004 ft (306 m); the curved roof hides a
 *   cooling tower and tapers in width to 60 ft (18 m); curved "waterfall"
 *   setbacks face 57th Street while the 58th Street (park) face is flat;
 *   the facade is dark and light blue glass with pewter and silver panes,
 *   arranged in vertical stripes (de Portzamparc cites Klimt).
 * - Photos (Wikimedia Commons): Itrytohelp32 "Billionaires' Row 2020"
 *   (CC BY-SA 4.0, from Top of the Rock, south-east); Choinowski "One57 New
 *   York in 2015" (CC BY-SA 4.0, from Central Park, north); Brian W.
 *   Schaller "A617, One57" (FAL, street level, the cascade); Kidfly182 "One57
 *   November 2024 005", "One57 2025", "One57 September 2024", "One57 October
 *   2024" (CC BY 4.0); Chris O "Billionaire's Row, NYC" (CC BY-SA 4.0, west).
 *
 * Drawing: every block's top is a quarter-ellipse in section, flat at its
 * north edge and rolling over to vertical at its south face, which is what
 * makes the cascade read as water falling toward 57th Street. The Klimt
 * pattern is drawn as broad vertical stripes about 4 m wide, each broken
 * into runs several storeys long in three glass tones; it is seeded, so the
 * model is the same every run. Estimated: the depth each curve falls (from
 * the lidar on the main roof, scaled for the rest), the stripe tones (from
 * photos).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, windowVariant, finish } from './palette'
import { facePanel, prism, rect, save, type XY } from './nyc-432-park'

function build() {
  const dark = new Part(), light = new Part(), silver = new Part(), crown = new Part(), roof = new Part()

  // A small deterministic generator for the stripe pattern.
  let seed = 57
  const rand = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648)

  const STOREY = 3.6, STRIPE = 4.0, SEG = 10
  const tones = [light, silver, dark, light]

  /**
   * Klimt stripes on one face, a → b, standing on z0. `top(s)` is the face's
   * height at s along it. The body behind is `dark`; light and silver runs
   * are laid over it, a few storeys at a time.
   */
  function stripes(a: XY, b: XY, z0: number, top: (s: number) => number) {
    const l = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.round(l / STRIPE)), w = l / n
    for (let i = 0; i < n; i++) {
      const s0 = i * w + 0.12, s1 = (i + 1) * w - 0.12
      const limit = Math.min(top(s0), top(s1), top((s0 + s1) / 2)) - 0.6
      let z = z0 + 0.5 + Math.floor(rand() * 4) * STOREY
      while (z < limit - 2) {
        const run = (5 + Math.floor(rand() * 10)) * STOREY
        const part = tones[Math.floor(rand() * tones.length)]
        const hi = Math.min(z + run, limit)
        if (part !== dark && hi - z > 2) facePanel(part, a, b, s0, s1, z, hi)
        z = hi + (2 + Math.floor(rand() * 4)) * STOREY
      }
    }
  }

  /**
   * A block whose roof rolls over from zHigh at its north edge to zLow at
   * its south face: a quarter-ellipse in section, over the block's depth.
   */
  function cascade(x0: number, x1: number, y0: number, y1: number, zLow: number, zHigh: number, z0 = 0) {
    const L = y1 - y0, D = zHigh - zLow
    const prof: { y: number; z: number; n: V3 }[] = []
    for (let k = 0; k <= SEG; k++) {
      const th = (k / SEG) * Math.PI / 2
      const ny = -D * Math.sin(th), nz = L * Math.cos(th), m = Math.hypot(ny, nz)
      prof.push({ y: y1 - L * Math.sin(th), z: zLow + D * Math.cos(th), n: [0, ny / m, nz / m] })
    }
    // Roof: smooth strips from north to south, in the cap glass.
    for (let k = 0; k < SEG; k++) {
      const p = prof[k], q = prof[k + 1]
      crown.tri([x1, p.y, p.z], [x0, p.y, p.z], [x0, q.y, q.z], undefined, undefined, undefined, [p.n, p.n, q.n])
      crown.tri([x1, p.y, p.z], [x0, q.y, q.z], [x1, q.y, q.z], undefined, undefined, undefined, [p.n, q.n, q.n])
    }
    // Walls: north and south faces flat, the sides following the curve.
    dark.quad([x0, y0, z0], [x1, y0, z0], [x1, y0, zLow], [x0, y0, zLow]) // south
    dark.quad([x1, y1, z0], [x0, y1, z0], [x0, y1, zHigh], [x1, y1, zHigh]) // north
    for (let k = 0; k < SEG; k++) {
      const p = prof[k], q = prof[k + 1]
      dark.quad([x1, q.y, z0], [x1, p.y, z0], [x1, p.y, p.z], [x1, q.y, q.z]) // east, south to north
      dark.quad([x0, p.y, z0], [x0, q.y, z0], [x0, q.y, q.z], [x0, p.y, p.z]) // west
    }
    const height = (y: number) => {
      if (y >= y1) return zHigh
      const t = Math.min(1, (y1 - y) / L)
      return zLow + D * Math.sqrt(1 - t * t)
    }
    const lo = Math.max(z0, 31) // stripes start above the podium
    stripes([x0, y0], [x1, y0], lo, () => zLow)
    stripes([x1, y1], [x0, y1], lo, () => zHigh)
    stripes([x1, y0], [x1, y1], lo, (s) => height(y0 + s))
    stripes([x0, y1], [x0, y0], lo, (s) => height(y1 - s))
  }

  // ---- The tower and its cascade -------------------------------------------------
  cascade(-21.5, -0.7, -14.2, 20.9, 290, 306) // main slab
  cascade(-0.7, 7.8, -14.2, -2.5, 286, 298) // its south-east annex
  cascade(7.8, 20.8, -17.5, -2.5, 214, 230) // east step
  cascade(-6.4, 7.8, -17.5, -14.2, 219, 226.8) // its front strip
  cascade(20.8, 29.6, -21.1, -2.4, 110, 125) // lower east block
  cascade(4.7, 20.8, -21.1, -17.5, 112, 119.8) // its front strip
  cascade(-21.6, -6.4, -21.1, -14.2, 85, 95) // west step
  cascade(-6.4, 4.7, -21.1, -17.5, 88, 95)
  cascade(-21.6, -8.9, -24.7, -21.1, 38, 45) // 57th Street podium
  cascade(-8.9, 29.5, -24.7, -21.1, 28, 35)

  // ---- The flat base on the north, east and west ------------------------------------
  const base = new Part()
  for (const [r, h] of [
    [rect(-26.4, -21.5, -24.9, 5.8), 32], [rect(-26.4, -21.5, 5.8, 36.6), 30], [rect(-21.5, -0.7, 20.9, 36.4), 30],
    [rect(-0.7, 29.6, -2.5, 3.7), 30],
  ] as [XY[], number][]) {
    prism(base, r, 0, h, { bevel: 0.3, top: roof })
    const e = r.map((p, i) => [p, r[(i + 1) % 4]] as [XY, XY])
    for (const [a, b] of e) {
      const l = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.round(l / 4)), w = l / n
      for (let i = 0; i < n; i++) facePanel(dark, a, b, i * w + 0.5, (i + 1) * w - 0.5, 0.8, h - 1.5)
    }
  }

  return [
    { part: dark, material: { ...PALETTE.window, color: 0x5c7590 } }, // the dark blue glass
    { part: light, material: windowVariant(2, 0x93abc2) }, // light blue
    { part: silver, material: windowVariant(3, 0xbcc6ce) }, // pewter and silver panes
    { part: crown, material: { ...PALETTE.glass, color: 0x9fb4c6 } }, // the rolled glass tops
    { part: base, material: finish('base-glass', 0x8c99a6) },
    { part: roof, material: PALETTE.roof },
  ]
}

if (import.meta.main) {
  await save('nyc-one57', 'One57', build(), {
    bearing: 28.9, anchor: [40.7655013, -73.9790093], height: 306,
    note: 'Cascade of rolled glass tops falling toward 57th Street, Klimt-striped blue glass',
  })
}
