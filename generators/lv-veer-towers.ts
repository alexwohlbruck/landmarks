/**
 * Veer Towers, Las Vegas: the twin 37-storey condominium towers that lean
 * five degrees in opposite directions, glass walls patched with yellow
 * panels, each crowned by a pale louvre screen. One model, both towers.
 * Procedural, CC0-1.0.
 * bun generators/lv-veer-towers.ts
 *
 * Map frame: x east, y north, z up, metres. Bearing 0: drawn in OSM's own
 * orientation. The origin is the midpoint between the two outlines'
 * centroids (36.107407, -115.174681).
 *
 * Published (Wikipedia, "Veer Towers"; Murphy/Jahn, opened 2010): twin
 * 37-storey towers, 480 ft (146 m), that "tilt in opposite directions at a
 * five-degree angle" on parallelogram-shaped footprints, with yellow panels
 * on the glass to reflect sunlight. OSM: way/52134835 (West) and
 * way/52134834 (East), 132 m, 37 levels.
 *
 * Measured, from OSM: both footprints are the same parallelogram, about
 * 30 m east-west, with north-south sides 40 m long and the north and south
 * sides sloping 11.4 m down to the east; the towers stand 57 m apart.
 *
 * Photos (Wikimedia Commons):
 * - "Veer Towers - South - 2010-03-07.JPG", Cygnusloop99, CC BY-SA 3.0:
 *   from Aria, to the west: the West tower in front, square to the view;
 *   the East tower behind it leaning clearly to the north;
 * - "Veer Towers (23793655619).jpg", Thomas Duesing, CC BY 2.0: from the
 *   Strip, east: the West tower leaning south, behind the East tower (whose
 *   own lean hardly shows from there);
 * - "Veer Towers Las Vegas.jpg", Antoine Taveneaux, CC BY-SA 3.0, "Veer
 *   Towers West.jpg" and "Veer Towers East.jpg", Supercarwaar, CC BY-SA
 *   4.0, and "Aria and Veer Towers - December 2019 - Sarah Stierch.jpg",
 *   Missvain, CC BY 4.0: the patchwork of yellow and clear glass panels,
 *   in vertical runs, and the pale louvred screen at the top.
 *
 * Estimated: the lean directions, West to the south and East to the north
 * (along their north-south sides), from the two photos above. The USGS
 * NAIP orthophoto could not confirm it: its relief displacement of the
 * roofs is larger than the lean. The height: OSM's 132 m is used for the
 * roof; the published 146 m would include the screen, drawn here to 136 m.
 * The yellow pattern is drawn as panels three storeys tall and a fifth of a
 * face wide, about three in five of them yellow, placed by a fixed hash rather than
 * copied panel for panel. Left out: the glass lobbies and the podium
 * bridges, which belong to the Crystals and the sidewalk.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { save, type XY } from './lv-wynn'

const glass = new Part(), yellow = new Part(), screen = new Part(), roof = new Part()
const GLASS = windowVariant(2, 0xa3b6c4)
const YELLOW = { ...finish('veer-yellow', 0xd6bd5a, 0.35), name: 'window-3' }

const H = 132, CROWN = 4
const LEAN = Math.tan((5 * Math.PI) / 180) // horizontal metres per metre of height

// The outlines, from OSM, counter-clockwise, relative to the origin.
const C0: XY = [-115.174681, 36.107407]
// In metres about the West tower's centroid (-115.175000, 36.107407);
// `shift` moves them so the origin sits midway between the two centroids.
const WEST: XY[] = [[-15.3, -14.5], [15.2, -25.6], [15.0, 14.5], [-14.7, 25.9]]
const EAST: XY[] = [[42.4, -13.3], [72.4, -24.8], [70.3, 15.4], [44.0, 24.6], [43.5, 13.5]]
const DX = 28.67
const shift = (r: XY[]): XY[] => r.map(([x, y]) => [x - DX, y])

/** a point at height z on a tower leaning `dir` (+1 north, -1 south) */
const at = (p: XY, z: number, dir: number): V3 => [p[0], p[1] + dir * LEAN * z, z]

/** A cheap deterministic hash, 0..1, for the panel pattern. */
const hash = (a: number, b: number, c: number) => {
  const s = Math.sin(a * 127.1 + b * 311.7 + c * 74.7) * 43758.5453
  return s - Math.floor(s)
}

function tower(ring: XY[], dir: number, seed: number) {
  const n = ring.length, top = H - CROWN
  // walls, inclined: each face is a parallelogram or a tilted rectangle
  for (let i = 0; i < n; i++) {
    const a = ring[i], b = ring[(i + 1) % n]
    glass.quad(at(a, 0, dir), at(b, 0, dir), at(b, top, dir), at(a, top, dir))
    // the louvre screen: a pale band standing just proud
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), nn: XY = [(b[1] - a[1]) / L, -(b[0] - a[0]) / L]
    const o = (p: XY, d: number): XY => [p[0] + nn[0] * d, p[1] + nn[1] * d]
    screen.quad(at(o(a, 0.3), top, dir), at(o(b, 0.3), top, dir), at(o(b, 0.3), H, dir), at(o(a, 0.3), H, dir))
    // yellow panels: a grid of three-storey cells, about half filled,
    // biased to run vertically as on the real towers
    const cols = Math.max(3, Math.round(L / 6)), rows = 11
    const ch = (top - 6) / rows
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        const on = hash(seed + i, c, Math.floor(r / 2)) < 0.5 || hash(seed + i, c, r) < 0.25
        if (!on) continue
        const u0 = (c + 0.08) / cols, u1 = (c + 0.92) / cols
        const z0 = 6 + r * ch + 0.5, z1 = 6 + (r + 1) * ch - 0.5
        const p0 = o([a[0] + (b[0] - a[0]) * u0, a[1] + (b[1] - a[1]) * u0], 0.06)
        const p1 = o([a[0] + (b[0] - a[0]) * u1, a[1] + (b[1] - a[1]) * u1], 0.06)
        yellow.quad(at(p0, z0, dir), at(p1, z0, dir), at(p1, z1, dir), at(p0, z1, dir))
      }
    }
  }
  // the screen's inner face and the roof inside it
  for (let i = 0; i < n; i++) {
    const a = ring[i], b = ring[(i + 1) % n]
    screen.quad(at(b, top, dir), at(a, top, dir), at(a, H, dir), at(b, H, dir))
  }
  const r0 = ring.map((p) => at(p, top - 0.5, dir))
  for (let k = 1; k < r0.length - 1; k++) roof.tri(r0[0], r0[k], r0[k + 1])
  // the screen's top edge
  for (let i = 0; i < n; i++) {
    const a = ring[i], b = ring[(i + 1) % n]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), nn: XY = [(b[1] - a[1]) / L, -(b[0] - a[0]) / L]
    const o = (p: XY): XY => [p[0] + nn[0] * 0.3, p[1] + nn[1] * 0.3]
    screen.quad(at(a, H, dir), at(o(a), H, dir), at(o(b), H, dir), at(b, H, dir))
  }
}

tower(shift(WEST), -1, 1)
tower(shift(EAST), 1, 7)

await save('lv-veer-towers', 'Veer Towers', [
  { part: glass, material: GLASS },
  { part: yellow, material: YELLOW },
  { part: screen, material: PALETTE.trim },
  { part: roof, material: PALETTE.roof },
], H, `Y up, -Z north, +X east, metres; origin between the two towers (${C0[1]}, ${C0[0]}); bearing 0`)
