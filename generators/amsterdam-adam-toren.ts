/**
 * A'DAM Toren (former Shell tower, Toren Overhoeks; Arthur Staal 1966-71,
 * renovated 2014-16 by Claus en Kaan with OeverZaaijer), Overhoeksplein,
 * Amsterdam-Noord: original procedural geometry, CC0-1.0.
 * bun generators/amsterdam-adam-toren.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = area centroid of the OSM outline way/44824385 (the
 * ground-floor footprint), 52.383779, 4.902205. The tower's walls run at
 * 8.6 / 98.6 degrees, so the catalog bearing is 8.6 and the tower is square
 * to this frame. The podium and the lookout deck are turned 45 degrees to
 * it ("overhoeks", the tower's old name).
 *
 * Identity, in order: the dark square office shaft with its even grid of
 * windows, standing on white V-shaped legs over a glass podium; the white
 * lookout deck on top, a square turned 45 degrees to the shaft and
 * cantilevered far out over it, with its band of restaurant glazing and the
 * sloping soffit; the round glass drum between shaft and deck; the white
 * mast with the three St Andrew's crosses (XXX) of the city arms; the
 * "Over the Edge" swing on the deck.
 *
 * Evidence:
 *  - plan: OSM way/44824385 and its parts, read in the turned frame:
 *    tower 593068474 x -20.9..4.7, y -5.6..20.1 (a 25.6 m square, tagged
 *    10-64 m, 18 levels); podium 593068473 (7 m, two levels), its east wing
 *    750296019 (7-10 m) and terrace 750296020 (3 m); glass drum 750257534
 *    (radius 9.75 m, tagged 65-70 m); deck 750257537 (a 32.8 m square turned
 *    45 degrees, tagged 70-75 m); roof housing 750257536 (11 m square,
 *    75-83 m); mast 750257535 (2 x 1.9 m, 83-99 m). All concentric about
 *    (-8.1, 7.25).
 *  - heights: photo-scaled from Muck's level telephoto across the IJ
 *    (A'DAM_Toren-01.jpg), with the mast top at 99 m (OSM; nl.wikipedia:
 *    "about 100 m" with the mast). In that photo the deck's width matches
 *    OSM's 46.4 m diagonal at the same scale (9.7-9.9 px/m), so it is a fair
 *    ruler. Read: white transfer beam 10-12 m, shaft roof 68 m, drum
 *    68-73 m, deck soffit edge 73.8 m, lower slab to 75.8, glazing to 79.6,
 *    top slab to 81.5, housing corners 86, mast 99. OSM's part heights put
 *    the shaft top at 64 and the deck at 70-75 m; the photo shows a deck
 *    about 8 m deep (two storeys, the revolving restaurant and the lookout),
 *    so the photo is followed.
 *  - deck layers from the same photo: the top slab overhangs the glazing by
 *    about 2 m; the lower slab is a little narrower than the glazing; the
 *    soffit slopes in to the drum (Golsteijn's view from below, during the
 *    renovation, shows the sloping soffit framing).
 *  - colours from the daylight photos: the shaft reads as dark glass in a
 *    dark frame, so it is a curtain wall in the palette's `window`
 *    mid-tone (shared with the deck's restaurant band and the drum) with
 *    pale lines only at the corners and a floor band every third storey
 *    (lead review: no cell grid, no dark lattice). Legs, beam, deck lips,
 *    housing and mast are white; the swing frame is drawn in the dark
 *    finish.
 *  - night (Golsteijn's A'DAM_Toren_avond.jpg, Muck's A'DAM_Toren-03-Night.
 *    jpg): the soffit and the mast are floodlit (in changing colours), the
 *    XXX crosses glow, the restaurant band is lit. So: `_FLOODLIGHT` on the
 *    white soffit and mast, the crosses `neon`, the deck glazing `window`.
 *    No facade-wide LED show appears in the open night photos; the shaft's
 *    windows glow as ordinary windows.
 *  - elevation 0 (flat IJ bank, about 1 m NAP); no lidar (AHN is not read by
 *    the repo's tools).
 *
 * Photos (Wikimedia Commons, all evidence):
 *  - A'DAM_Toren-01.jpg (Muck, CC BY-SA 4.0): level telephoto from the IJ,
 *    south; the main ruler.
 *  - A'DAM_Toren_en_de_skyline_van_Amsterdam.jpg (MrAronymous, CC0): from
 *    the north-east, high.
 *  - A'DAM_Toren.JPG (Marion Golsteijn, CC BY-SA 4.0): from below, the deck
 *    and soffit over the shaft's corner.
 *  - IJpromenade_A'dam_toren.jpg (Frank Markesteijn, CC BY-SA 4.0): the
 *    white legs and the glass podium.
 *  - Top_A'DAM_Toren.JPG (Marion Golsteijn, CC BY-SA 4.0): the mast and the
 *    housing's V-topped walls.
 *  - Shell_toren.jpg (Arjen Kruisman, CC BY-SA 4.0): the window grid.
 *  - A'DAM_Toren_avond.jpg (Marion Golsteijn, CC BY-SA 4.0) and
 *    A'DAM_Toren-03-Night.jpg (Muck, CC BY-SA 4.0): night.
 * No commercial imagery. No look-only sources.
 *
 * Left out: the A'DAM lettering and sign panels (signage is not the
 * identity), railings, the LED edge strips, the lift shaft lights, aerials.
 *
 * Doubts: the white legs are simplified to a corner post and one V per face,
 * set out the same on every face; the real legs differ side to side. The
 * housing roof between its V-topped walls is guessed (drawn falling to the
 * mast). The swing's frame is drawn bolder and simpler than the real steel.
 *
 * This file also holds a small kit shared by this builder's other IJ
 * generators (eye-filmmuseum, nemo, scheepvaartmuseum, ship-amsterdam);
 * merge it first.
 */
import { Part, cross, sub, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { area, cap, inset, rect, save, walls, type XY } from './chi-aon-center'
import { along, face, rectOn } from './phl-independence-hall'

// ---------------------------------------------------------------------------
// Kit shared by this builder's amsterdam- IJ models.

/** The ring made counter-clockwise (from above). */
export const ccw = (r: XY[]): XY[] => (area(r) < 0 ? [...r].reverse() : r)

/** A closed OSM ring turned into the model frame's points, last point dropped. */
export const open = (r: XY[]): XY[] => (r.length > 2 && r[0][0] === r[r.length - 1][0] && r[0][1] === r[r.length - 1][1] ? r.slice(0, -1) : r)

/** A prism over a simple ring from z0 to z1, top cap optional. */
export function prism(p: Part, r: XY[], z0: number, z1: number, top: Part | null = p, bottom = false) {
  const c = ccw(r)
  walls(p, c, z0, z1)
  if (top) cap(top, c, z1)
  if (bottom) cap(p, c, z0, false)
}

/** A prism whose top edge is chamfered by b. */
export function bprism(p: Part, top: Part | null, r: XY[], z0: number, z1: number, b = 0.3) {
  const c = ccw(r), i = inset(c, b)
  walls(p, c, z0, z1 - b)
  walls(p, c, z1 - b, z1, i)
  if (top) cap(top, i, z1)
}

/**
 * A square-section bar from a to b, `w` wide and `d` deep (d across the
 * plane that holds the bar and `side`), all faces closed.
 */
export function bar(p: Part, a: V3, b: V3, w: number, d = w, side: V3 = [0, 0, 1]) {
  const ax = sub(b, a), L = Math.hypot(...ax)
  const t: V3 = [ax[0] / L, ax[1] / L, ax[2] / L]
  let u = cross(t, side)
  if (Math.hypot(...u) < 1e-6) u = cross(t, [1, 0, 0])
  const ul = Math.hypot(...u); u = [u[0] / ul, u[1] / ul, u[2] / ul]
  const v = cross(u, t)
  const off = (q: V3, su: number, sv: number): V3 => [q[0] + u[0] * su + v[0] * sv, q[1] + u[1] * su + v[1] * sv, q[2] + u[2] * su + v[2] * sv]
  const corners: [number, number][] = [[-w / 2, -d / 2], [w / 2, -d / 2], [w / 2, d / 2], [-w / 2, d / 2]]
  const A = corners.map(([s, r]) => off(a, s, r)), B = corners.map(([s, r]) => off(b, s, r))
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    const mid: V3 = [(A[i][0] + A[j][0]) / 2 - a[0], (A[i][1] + A[j][1]) / 2 - a[1], (A[i][2] + A[j][2]) / 2 - a[2]]
    face(p, [A[i], A[j], B[j], B[i]], mid)
  }
  face(p, A, [-t[0], -t[1], -t[2]])
  face(p, B, t)
}

/** A ring at height z as V3s. */
export const at = (r: XY[], z: number): V3[] => r.map(([x, y]) => [x, y, z] as V3)

// ---------------------------------------------------------------------------
// A'DAM Toren

const CX = -8.1, CY = 7.25 // tower, drum, deck, housing and mast centre
const H = 12.8 // tower half-width

function build() {
  const white = new Part(), dark = new Part(), win = new Part(), roof = new Part(), neon = new Part()
  const shaft = win // the shaft's curtain wall shares the deck band's `window` glass
  const swing = dark // the swing's frame is black steel with red trim; drawn in the dark finish

  // --- Podium: the glass pavilion turned 45 degrees, 7 m, and its parts.
  const podium: XY[] = open([[-4.8, -9.9], [-4.8, -5.6], [-9.1, -5.6], [-24.4, 9.6], [-28.2, 13.4], [-17.9, 23.7], [-16.2, 25.5], [-14.4, 27.2], [-13.2, 26.0], [-11.7, 24.4], [-8.8, 21.6], [-7.4, 20.2], [-7.1, 19.9], [4.4, 8.6], [4.7, 8.5], [4.7, 3.9], [9.2, 4.0], [12.6, 0.6], [19.5, -6.3], [28.8, -15.6], [27.0, -17.4], [25.9, -18.5], [18.1, -26.2], [14.7, -29.6], [5.6, -20.2], [3.7, -18.4], [-4.8, -9.9]])
  prism(win, podium, 0, 6.1, null)
  bprism(dark, roof, podium, 6.1, 7.0, 0.25)
  const wing: XY[] = open([[14.7, -29.6], [5.6, -20.2], [19.5, -6.3], [28.8, -15.6], [27.0, -17.4], [25.9, -18.5], [18.1, -26.2], [14.7, -29.6]])
  bprism(dark, roof, inset(ccw(wing), 1.2), 7.0, 10.0, 0.25)
  const terrace: XY[] = open([[18.3, 8.5], [18.4, 5.2], [18.4, 4.0], [10.7, 4.0], [9.2, 4.0], [4.7, 3.9], [4.7, 8.5], [18.3, 8.5]])
  bprism(dark, roof, terrace, 0, 3.0, 0.2)

  // --- Under the shaft: a recessed glass lobby, white corner posts and a V
  // of white struts on each face, under a white transfer beam.
  const sqr = (h: number): XY[] => rect(CX - h, CY - h, CX + h, CY + h)
  prism(win, sqr(H - 3.2), 0, 10.0, roof)
  const B0 = 10.0, B1 = 12.0
  {
    const r = sqr(H), i = inset(r, 0.35)
    walls(white, r, B0 + 0.35, B1, r)
    walls(white, i, B0, B0 + 0.35, r)
    cap(white, i, B0, false)
  }
  const P = 0.85 // post half-width
  for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
    const x = CX + sx * (H - P), y = CY + sy * (H - P)
    prism(white, rect(x - P, y - P, x + P, y + P), 0, B0, null)
  }
  const sides = (r: XY[]) => r.map((a, k) => [a, r[(k + 1) % r.length]] as [XY, XY])
  for (const [a, b] of sides(sqr(H - 0.5))) {
    const { P: Q, L } = along(a, b)
    const foot = Q(L * 0.5, 0, 0), up = Q(L * 0.5, 1, 0)
    for (const s of [0.2, 0.8]) bar(white, [foot[0], foot[1], 0.4], Q(L * s, B0 + 0.3, 0), 1.3, 0.9, sub(up, foot))
  }

  // --- The office shaft, 12-68 m: a mid-tone glass curtain wall
  // with pale lines only at the corners and a floor band every third
  // storey (no cell grid).
  const T0 = B1, T1 = 68.0
  {
    const r = sqr(H)
    walls(shaft, r, T0, T1)
    // Roof inside a low dark parapet.
    const i = inset(r, 0.5)
    walls(dark, r, T1, T1 + 0.8, r)
    walls(dark, [...i].reverse(), T1, T1 + 0.8)
    for (let k = 0; k < 4; k++) {
      const l = (k + 1) % 4
      dark.quad([r[k][0], r[k][1], T1 + 0.8], [r[l][0], r[l][1], T1 + 0.8], [i[l][0], i[l][1], T1 + 0.8], [i[k][0], i[k][1], T1 + 0.8])
    }
    cap(roof, i, T1)
    const FLOOR = (T1 - T0) / 17
    for (const [a, b] of sides(r)) {
      const { L } = along(a, b)
      for (const c of [0.45, L - 0.45]) rectOn(white, a, b, c, 0.45, T0, T1, 0.06)
      for (let f = 3; f < 17; f += 3) rectOn(white, a, b, L / 2, L / 2, T0 + f * FLOOR - 0.16, T0 + f * FLOOR + 0.16, 0.06)
    }
  }

  // --- Glass drum, 68-73 m.
  const DR = 9.75, SEG = 24
  const ring = (rad: number): XY[] => Array.from({ length: SEG }, (_, k) => [CX + rad * Math.cos((k / SEG) * 2 * Math.PI), CY + rad * Math.sin((k / SEG) * 2 * Math.PI)] as XY)
  walls(win, ring(DR), T1, 73.0)

  // --- The lookout deck: a square turned 45 degrees about the centre.
  const diamond = (hd: number): XY[] => [[CX, CY - hd], [CX + hd, CY], [CX, CY + hd], [CX - hd, CY]]
  const S0 = 73.8, S1 = 75.8, G1 = 79.6, D1 = 81.5
  const low = diamond(21.0), glz = diamond(21.4), top = diamond(23.2)
  // Soffit: from the lower slab's edge down and in to the drum.
  {
    const inner = diamond(11.2)
    for (let k = 0; k < 4; k++) {
      const l = (k + 1) % 4
      face(white, [[low[k][0], low[k][1], S0], [low[l][0], low[l][1], S0], [inner[l][0], inner[l][1], 72.6], [inner[k][0], inner[k][1], 72.6]], [0, 0, -1])
    }
    cap(white, inner, 72.6, false)
  }
  walls(white, low, S0, S1)
  cap(white, low, S1)
  walls(win, glz, S1, G1)
  {
    // Top slab, overhanging, with chamfered edges.
    const i = inset(top, 0.35)
    walls(white, i, G1, G1 + 0.35, top)
    walls(white, top, G1 + 0.35, D1 - 0.35)
    walls(white, top, D1 - 0.35, D1, i)
    cap(white, i, G1, false)
    cap(roof, i, D1) // the lookout's grey decking
  }

  // --- Roof housing: an 11 m square whose walls have V-shaped tops, low at
  // the middle of each side where the mast rises, high at the corners.
  {
    const h = 5.5, zc = 86.0, zm = 84.2
    const c = sqr(h)
    for (let k = 0; k < 4; k++) {
      const a = c[k], b = c[(k + 1) % 4], m: XY = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
      const n: V3 = [m[0] - CX, m[1] - CY, 0]
      face(white, [[a[0], a[1], D1], [m[0], m[1], D1], [m[0], m[1], zm], [a[0], a[1], zc]], n)
      face(white, [[m[0], m[1], D1], [b[0], b[1], D1], [b[0], b[1], zc], [m[0], m[1], zm]], n)
      face(white, [[a[0], a[1], zc], [m[0], m[1], zm], [CX, CY, zm - 0.6]], [0, 0, 1])
      face(white, [[m[0], m[1], zm], [b[0], b[1], zc], [CX, CY, zm - 0.6]], [0, 0, 1])
    }
  }

  // --- The mast, drawn 2.4 m square, to 99 m, with the XXX on its faces.
  const M = 1.2, MT = 99.0
  {
    const r = sqr(M), i = inset(r, 0.2)
    walls(white, r, 83.4, MT - 0.2) // from the housing's low centre
    walls(white, r, MT - 0.2, MT, i)
    cap(white, i, MT)
    for (const [a, b] of sides(r)) {
      const { P: Q, L } = along(a, b)
      for (let k = 0; k < 3; k++) {
        const zc = 96.9 - k * 1.95, s = 0.78, t = 0.24
        for (const sg of [1, -1]) {
          // One stroke of the cross, a flat bar from corner to corner, in (s, z) on the face.
          const s0 = L / 2 - s, z0 = zc - sg * s, s1 = L / 2 + s, z1 = zc + sg * s
          const l = Math.hypot(s1 - s0, z1 - z0), ps = -(z1 - z0) / l * t, pz = (s1 - s0) / l * t
          face(neon, [Q(s0 - ps, z0 - pz, 0.04), Q(s1 - ps, z1 - pz, 0.04), Q(s1 + ps, z1 + pz, 0.04), Q(s0 + ps, z0 + pz, 0.04)], [Q(0, 0, 1)[0] - Q(0, 0, 0)[0], Q(0, 0, 1)[1] - Q(0, 0, 0)[1], 0])
        }
      }
    }
  }

  // --- The "Over the Edge" swing near the deck's east corner: a frame of
  // four posts leaning out over the south-east edge, joined by a top beam.
  {
    const e: XY = top[1], s: XY = top[0] // east and south corners
    const dir: XY = [(s[0] - e[0]) / Math.hypot(s[0] - e[0], s[1] - e[1]), (s[1] - e[1]) / Math.hypot(s[0] - e[0], s[1] - e[1])]
    const out: XY = [dir[1], -dir[0]] // outward from the south-east edge
    for (let k = 0; k < 4; k++) {
      const d = 4.0 + k * 2.4
      const bx = e[0] + dir[0] * d - out[0] * 4.0, by = e[1] + dir[1] * d - out[1] * 4.0
      bar(swing, [bx, by, D1], [bx + out[0] * 3.2, by + out[1] * 3.2, D1 + 6.5], 0.55, 0.55)
    }
    const a0 = 4.0, a1 = 4.0 + 3 * 2.4
    bar(swing, [e[0] + dir[0] * a0 - out[0] * 0.8, e[1] + dir[1] * a0 - out[1] * 0.8, D1 + 6.5], [e[0] + dir[0] * a1 - out[0] * 0.8, e[1] + dir[1] * a1 - out[1] * 0.8, D1 + 6.5], 0.6, 0.6)
  }

  const flood = (p: V3, n: V3) => {
    if (p[2] > 72 && p[2] < 75.5 && n[2] < -0.3) return 1 // the soffit
    if (p[2] > 81 && Math.hypot(p[0] - CX, p[1] - CY) < 2) return 0.9 // the mast
    return 0
  }
  return [
    { part: white, material: { ...finish('adam-white', 0xf3f0ea), floodlight: flood } },
    { part: dark, material: finish('adam-dark', 0x56534e) },
    { part: win, material: { ...PALETTE.window } },
    { part: roof, material: { ...PALETTE.roof } },
    { part: neon, material: finish('neon-adam-red', 0xa8403a) },
  ]
}


if (import.meta.main) await save('amsterdam-adam-toren', "A'DAM Toren", [52.383779, 4.902205], 8.6, build(), 5000)
