/**
 * The Cosmopolitan of Las Vegas: its two dark glass hotel towers striped
 * with balconies, the square Boulevard Tower on the Strip with its crown
 * sloping up towards the Strip, and the long, kinked Chelsea Tower running
 * west from it, with the casino podium between. Procedural, CC0-1.0.
 * bun generators/lv-cosmopolitan.ts
 *
 * Map frame: x east, y north, z up, metres. Bearing 0: drawn in OSM's own
 * orientation. The origin is the area centroid of the Boulevard Tower's
 * outline, way/134795273 (36.110181, -115.174091).
 *
 * Published (Wikipedia, "Cosmopolitan of Las Vegas"; Arquitectonica, opened
 * 2010): 3,033 rooms in two towers, the Chelsea and the Boulevard, of 52 and
 * 50 storeys. OSM: way/134795273, 184 m, 51 levels (the Boulevard Tower);
 * way/27897905, "The Cosmopolitan Chelsea Tower", 184 m, 53 levels;
 * way/472669744, tagged "Boulevard Tower" and 184 m, which is in fact the
 * podium south-west of the Boulevard Tower, with the pool decks and the
 * round theatre on its roof (USGS NAIP).
 *
 * Measured, from OSM: the Boulevard Tower 52 x 45 m; the Chelsea a slab
 * 25 m deep and 163 m long, its middle third turned 21 degrees. The USGS
 * NAIP orthophoto (public domain) shows both towers' roofs, displaced
 * about 40 m west by relief, with the Chelsea's kink.
 *
 * Photos (Wikimedia Commons):
 * - "Cosmopolitan - North - 2011-06-04.jpg", Cygnusloop99, CC BY-SA 3.0:
 *   from the Bellagio lake, north: the Boulevard Tower's crown rising to
 *   the east; the Chelsea's long north face, about 200 m of it in view,
 *   folded at the kink, its west end plain dark glass under the sign;
 * - "Cosmopolitan - North - 2010-12-12.JPG", Cygnusloop99, CC BY-SA 3.0:
 *   from the Eiffel Tower, north-east: the Boulevard in front, the Chelsea
 *   behind, the balcony stripes, the dark west end;
 * - "The Cosmopolitan Las Vegas 2019.jpg", Steven Lek, CC BY-SA 4.0, and
 *   "Cosmopolitan Casino Beach Club Tower.jpg", Supercarwaar, CC BY-SA 4.0:
 *   the dark glass, the white balcony edges, the dark crown.
 *
 * Estimated: the crowns: the Boulevard's sloping from 176 m on the west to
 * 184 m on the Strip side, the Chelsea's flat at 182 m; the dark west end,
 * 30 m; the podium at 25 m. The balconies are every floor; they are drawn
 * every second floor so the stripes stay clean at map distance. Left out:
 * the signs and "C" logo, the pool decks, the Marquee club, the
 * porte-cochère, and the low buildings round the towers (way/1212809711,
 * way/699020452), left to the map.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { cap, ccw, chamfer, signedArea, walls, type XY } from './lv-caesars-palace'
import { save } from './lv-wynn'

const glass = new Part(), ledge = new Part(), crown = new Part(), stone = new Part(), roof = new Part()

const BALCONY = finish('cosmo-balcony', 0xd8dde0)
const CROWN = windowVariant(2, 0x5a6b7d)

/**
 * Balcony ledges standing `d` proud round the edges of a ccw ring listed in
 * `on`, from z to z + h: a front face and a top. Each ledge runs on past its
 * edge's end by d to wrap the corner, unless the next edge has none.
 */
export function ledges(part: Part, ring: XY[], on: number[], z: number, h: number, d: number) {
  const n = ring.length
  for (const i of on) {
    const a = ring[i], b = ring[(i + 1) % n]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], nn: XY = [t[1], -t[0]]
    const wrap = on.includes((i + 1) % n) ? d : 0
    const a0 = a, b0: XY = [b[0] + t[0] * wrap, b[1] + t[1] * wrap]
    const a1: XY = [a0[0] + nn[0] * d, a0[1] + nn[1] * d], b1: XY = [b0[0] + nn[0] * d, b0[1] + nn[1] * d]
    part.quad([...a1, z], [...b1, z], [...b1, z + h], [...a1, z + h])
    part.quad([...a0, z + h], [...a1, z + h], [...b1, z + h], [...b0, z + h])
    part.quad([...a0, z], [...b0, z], [...b1, z], [...a1, z])
  }
}

/** A prism whose top is the plane z = top(x, y). */
function slopedPrism(wall: Part, top: Part, poly: XY[], z0: number, zt: (p: XY) => number) {
  const r = ccw(poly)
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    wall.quad([...a, z0], [...b, z0], [...b, zt(b)], [...a, zt(a)])
  }
  const flat = new Part()
  cap(flat, r, 0)
  for (let k = 0; k < flat.pos.length; k += 9) {
    const pts: V3[] = [0, 3, 6].map((o) => {
      const x = flat.pos[k + o], y = -flat.pos[k + o + 2]
      return [x, y, zt([x, y])]
    })
    top.tri(pts[0], pts[1], pts[2])
  }
}

// ---------------------------------------------------------------- Boulevard Tower
const BLVD: XY[] = ccw([[-26.7, 23.0], [-22.9, 22.9], [16.2, 22.1], [25.5, 21.9], [29.7, 16.9], [24.6, -23.4], [-27.7, -22.3]])
const BODY = 172 // balconies stop here; the dark crown above
const crownTop = (p: XY) => 176 + ((p[0] + 27.7) / (29.7 + 27.7)) * 8
{
  const r = chamfer(BLVD, 0.6)
  walls(glass, r, 0, BODY)
  slopedPrism(crown, roof, r, BODY, crownTop)
  const all = r.map((_, i) => i)
  for (let z = 8; z < BODY - 2; z += 6.8) ledges(ledge, r, all, z, 0.9, 0.7)
}

// ---------------------------------------------------------------- Chelsea Tower
// way/27897905: a long slab, 25 m deep, running 163 m west from the
// podium with a kink in the middle. Balconies on every face but the west
// end, whose last 30 m are plain dark glass, where the sign hangs.
const CHELSEA: XY[] = ccw([
  [-266.6, -14.4], [-265.8, -38.9], [-259.9, -38.6], [-224.3, -38.8], [-165.6, -62.7], [-103.5, -62.9],
  [-103.7, -34.7], [-159.8, -34.4], [-214.3, -13.7], [-243.6, -13.7], [-258.5, -13.6],
])
const CHELSEA_TOP = 182
const DARK_X = -236 // west of this, plain dark glass
{
  // split the slab at x = DARK_X into the balconied east part and the dark
  // west end
  const cutS: XY = [DARK_X, -38.8], cutN: XY = [DARK_X, -13.7]
  const E: XY[] = ccw([cutS, [-224.3, -38.8], [-165.6, -62.7], [-103.5, -62.9], [-103.7, -34.7], [-159.8, -34.4], [-214.3, -13.7], cutN])
  const W: XY[] = ccw([[-266.6, -14.4], [-265.8, -38.9], [-259.9, -38.6], cutS, cutN, [-243.6, -13.7], [-258.5, -13.6]])
  const e = chamfer(E, 0.6), w = chamfer(W, 0.6)
  walls(glass, e, 0, BODY)
  walls(crown, w, 0, BODY)
  slopedPrism(crown, roof, chamfer(CHELSEA, 0.6), BODY, () => CHELSEA_TOP)
  // balconies on every edge of the east part except the cut
  const on = e.map((p, i) => {
    const q = e[(i + 1) % e.length]
    return Math.abs(p[0] - DARK_X) < 0.01 && Math.abs(q[0] - DARK_X) < 0.01 ? -1 : i
  }).filter((i) => i >= 0)
  for (let z = 8; z < BODY - 2; z += 6.8) ledges(ledge, e, on, z, 0.9, 0.7)
}

// ---------------------------------------------------------------- podium
// way/472669744, the casino podium south-west of the Boulevard Tower.
const PODIUM: XY[] = [
  [-103.7, -27.4], [-103.7, -34.7], [-103.5, -62.9], [-104.4, -77.1], [-104.7, -81.8], [2.2, -84.2], [6.5, -77.2],
  [4.6, -64.7], [-1.4, -58.0], [-3.1, -44.4], [-3.4, -26.4], [-28.0, -25.7], [-28.2, -29.8],
]
walls(stone, chamfer(PODIUM, 0.5), 0, 25)
cap(roof, PODIUM, 25)

await save('lv-cosmopolitan', 'The Cosmopolitan of Las Vegas', [
  { part: glass, material: PALETTE.window },
  { part: ledge, material: BALCONY },
  { part: crown, material: CROWN },
  { part: stone, material: PALETTE.stone },
  { part: roof, material: PALETTE.roof },
], 184, 'Y up, -Z north, +X east, metres; origin at the way/134795273 centroid; bearing 0')
