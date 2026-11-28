/**
 * Commerce Tower (1965, Keene & Simpson), 911 Main Street, Kansas City,
 * Missouri — original procedural geometry, CC0-1.0.
 * bun generators/kc-commerce-tower.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = centroid of OSM way/132575342, -94.5826640 39.1031914.
 * Its walls run at 2.0° / 92.0° (the downtown grid), so the bearing is 2.0
 * and the model is square to its own frame. Elevation 0.
 *
 * Identity, in order: a plain mid-century slab, 26 × 55 m, long side
 * north-south, rising sheer to a flat top; the pale greige frame of piers
 * and spandrels over dark glass in a fine, even grid on every face; the
 * darker mechanical band of the top storeys behind its screen; the red
 * Commerce Bank globe standing on the roof.
 *
 * Evidence
 * - OSM way/132575342 (height 124, 30 levels, Q5152438): the tower's plan,
 *   26.4 × 55.0 m, with a low entrance block on its north side
 *   (x -7.7..3.6, y 25.4..33.4). No building:parts.
 * - USGS 3DEP lidar MO_FEMANRCS_1_2020 (2020 flight), 0.5 m, read in this
 *   frame (the cloud sits ~1.5 m east of OSM). Heights above y = 0 (the
 *   west side on Main Street; the ground rises ~4 m to the east), measured:
 *   the screen parapet 124.2 all round, the roof behind it 121, a
 *   mechanical house 127.5 over the middle (x -4..8, y -6..16), the logo's
 *   top ~129.4, antennas to ~146; the north entrance block 9.2.
 *   Published 124 m, 30 floors (Wikipedia).
 * - Photos: "Commerce Tower Kansas City MO.jpg" (User:Charvex, public
 *   domain; a narrow face and the long face: the grid, ~10 bays on the
 *   narrow face, the dark top band, the red globe over the narrow face);
 *   "Commerce Tower, KC.jpg" (SakuraAvalon86, public domain; from the
 *   south-east: the slab's proportions, the frame's colour in sun);
 *   "Commerce Tower shot at night.jpg" (Noah Bohland, CC BY-SA 4.0; the
 *   deep pale frame, lit windows at night).
 * - Estimated: the bay (2.64 m: 10 on the 26.4 m face) and the storey
 *   (4.0 m: 30 floors to 121 m). The grid is drawn at exactly half the real
 *   density both ways (one panel per two bays and two storeys), which keeps
 *   the real cell's shape; the lobby's height (8 m) and its glazing; the
 *   globe (5.4 m across, from the Charvex photo scaled by the narrow face;
 *   its top at the lidar's 129.4-130.6 spots).
 * - Left out: the antennas and the window-washing rig (too thin).
 * - Look-only, not used: none. "Commerce Tower-2.jpg" on Commerce is the
 *   Clayton, St Louis branch, not this building.
 * - Doubts: the lobby storeys are hidden in every daylight photo; the globe is
 *   read as a sphere because it is round from the north-west and the
 *   south-east; the mechanical house is kept low (lidar 128.7 includes
 *   its equipment) since no photo shows it over the parapet.
 *
 * Colours: the frame reads a pale warm grey-beige in sun (#cdc3b1), pulled
 * to the palette's lightness; windows the palette slate; the top band's
 * louvres a darker grey; the roof `roof`; the globe Commerce red, a `neon`
 * material because it is lit at night.
 */
import { Part } from './mesh'
import { PALETTE, finish } from './palette'
import { block, cap, lathe, onWall, panel, rect, save, walls, type XY } from './chi-aon-center'

function build() {
  const frame = new Part(), win = new Part(), louvre = new Part(), roof = new Part(), sign = new Part()
  const X0 = -13.1, X1 = 13.3, Y0 = -29.3, Y1 = 25.7
  const ROOF = 121, PARAPET = 124.2, LOBBY = 8, MECH = 113.4

  // --- the slab, its screen parapet and roof
  const body = rect(X0, Y0, X1, Y1)
  walls(frame, body, 0, PARAPET - 0.4)
  const lip = body.map(([x, y]) => [x + (x < 0 ? 0.4 : -0.4), y + (y < 0 ? 0.4 : -0.4)] as XY)
  walls(frame, body, PARAPET - 0.4, PARAPET, lip)
  const inner = body.map(([x, y]) => [x + (x < 0 ? 0.9 : -0.9), y + (y < 0 ? 0.9 : -0.9)] as XY)
  walls(frame, lip, PARAPET, PARAPET, inner)
  walls(frame, [...inner].reverse(), ROOF, PARAPET) // inside of the screen, facing in
  cap(roof, inner, ROOF)
  block(louvre, roof, rect(-4, 3, 8, 16), ROOF, 126.4, 0.3) // the mechanical house (lidar 128.7 with its equipment)

  // --- the north entrance block
  block(frame, roof, rect(-7.7, Y1, 3.6, 33.4), 0, 9.2, 0.3)

  // --- windows: half density, two bays by two storeys, over every face
  const BAY = 2.64 * 2, ST = 4.0 * 2
  const faces: [XY, XY][] = [[[X0, Y0], [X1, Y0]], [[X1, Y0], [X1, Y1]], [[X1, Y1], [X0, Y1]], [[X0, Y1], [X0, Y0]]]
  for (const [a, b] of faces) {
    const { L } = onWall(a, b)
    const n = Math.round(L / BAY), pitch = L / n, w = pitch - 1.15
    const m = Math.round((MECH - LOBBY) / ST), h = (MECH - LOBBY) / m
    for (let i = 0; i < n; i++) {
      const s = pitch * (i + 0.5)
      for (let j = 0; j < m; j++) panel(win, a, b, s - w / 2, s + w / 2, LOBBY + j * h + 0.7, LOBBY + (j + 1) * h - 0.7, 0.05)
      // the lobby: tall glass between the piers, which run to the ground
      panel(win, a, b, s - w / 2, s + w / 2, 0.4, LOBBY - 0.9, 0.05)
    }
    // the mechanical storeys: wide dark louvre panels, three bays each
    const k = Math.round(L / 7.9), pk = L / k
    for (let i = 0; i < k; i++) panel(louvre, a, b, pk * i + 0.7, pk * (i + 1) - 0.7, MECH + 0.7, PARAPET - 1.6, 0.05)
  }

  // --- the Commerce Bank globe on its short pedestal (round in every
  // photo, from the north-west and the south-east alike)
  const R = 2.7, CZ = 127.4, CX = 2.0, CY = -2.0
  const prof: XY[] = Array.from({ length: 9 }, (_, i) => {
    const t = -Math.PI / 2 + (i / 8) * Math.PI
    return [R * Math.cos(t), CZ + R * Math.sin(t)] as XY
  })
  lathe(sign, CX, CY, prof, 16)
  block(frame, null, rect(CX - 0.7, CY - 0.7, CX + 0.7, CY + 0.7), ROOF, CZ - R + 0.3, 0)

  return [
    { part: frame, material: finish('kcct-frame', 0xddd4c3) },
    { part: win, material: PALETTE.window },
    { part: louvre, material: finish('kcct-louvre', 0x5f6871) },
    { part: roof, material: PALETTE.roof },
    { part: sign, material: finish('neon-commerce-red', 0xc8463c, 0.6) },
  ]
}

if (import.meta.main) await save('kc-commerce-tower', 'Commerce Tower', [39.1031914, -94.582664], 2.0, build())
