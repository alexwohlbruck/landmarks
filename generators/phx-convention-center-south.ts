/**
 * Phoenix Convention Center, South Building (1985, the former Phoenix
 * Civic Plaza expansion; refaced in the 2006–08 expansion), Phoenix,
 * Arizona — original procedural geometry, CC0-1.0.
 * bun generators/phx-convention-center-south.ts
 *
 * Uses the kit in phx-convention-center-west.ts (merge that first).
 *
 * Map frame: x east, y north, z up, metres. Bearing 0: the walls run
 * north–south and east–west. Anchor -112.0686398, 33.4473001, the area
 * centroid of OSM's outline way/37057886; geometry is written in this
 * frame directly.
 *
 * What is drawn: OSM way/37057886 only (no building:parts). No skybridge
 * joins it to the North Building across Washington Street in OSM or in
 * the lidar, so it stands alone.
 *
 * Identity (from the photos and aerial below):
 *  1. The long tan concrete frieze along Washington Street, carved into
 *     big alternating triangular coffers, cantilevered over a recessed,
 *     glazed ground floor.                                    (wl8961)
 *  2. A flat, low box of two big halls (the south one 2.5 m higher),
 *     with a lower stepped brick wing along 3rd Street.   (lidar, NAIP)
 *  3. The plain tan and buff-brick walls and the white membrane roof.
 *                                                  (wl8961, NAIP)
 *
 * Heights: USGS 3DEP lidar AZ_MaricopaPinal_1_2020 (flown 2020, 1 m grid,
 * tools/lidar.py; ground_min 329.93 m). y = 0 is 330.23 m, the street on
 * Jefferson to the south, the lowest ground at the footprint; the ground
 * rises about 3 m to the plaza and Washington on the north. Measured (model
 * metres): the north hall 14.7, the south hall 17.2, the frieze's top
 * 17.9; the 3rd St wing 11.4–14.4 (drawn 12, with a 14.4 block at
 * y -2..28); the east annex 9.7.
 *
 * Estimated: the frieze's depth (6.6 m, where the lidar's 17.9 m returns
 * run) and its underside (9 m, from wl8961 scaled to the lidar top); the
 * coffers' size and rhythm (6.5 m triangles, alternately up and down,
 * from wl8961); the recessed glazing under it; the brick's extent on the
 * 3rd St wing; the tan coping. The south, east and 3rd St faces are drawn
 * plain: no licensed photo shows them square on.
 *
 * Photos (evidence):
 *  wl8961 "Phoenix Convention Center South Building, 3rd Street and
 *         Washington Street, Phoenix, AZ", w_lemay, CC BY-SA 2.0, Flickr
 *         https://www.flickr.com/photos/59081381@N03/54442798961
 *  wl1897 the same title, w_lemay, CC BY-SA 2.0 (from 3rd St)
 *         https://www.flickr.com/photos/59081381@N03/54441941897
 *  wl7195 the same title, w_lemay, CC BY-SA 2.0 (at night)
 *         https://www.flickr.com/photos/59081381@N03/54443177195
 * Aerial: USGS NAIP (public domain). No look-only sources. No commercial
 * imagery.
 *
 * Night: the glazing under the frieze is `window` and glows (wl7195 shows
 * the lobby lit); the frieze carries `_FLOODLIGHT`, lit from below.
 */
import { Part } from './mesh'
import { PALETTE, finish } from './palette'
import { Kit, write, type XY } from './phx-convention-center-west'

const ID = 'phx-convention-center-south'
const k = new Kit([0, 0])
const tan = new Part(), coffer = new Part(), brick = new Part(), win = new Part(), roof = new Part()

// ── The halls ───────────────────────────────────────────────────────────
const XW = -27, XE = 68.4
const north: XY[] = [[XW, -30], [XE, -30], [XE, 79], [XW, 79]]
k.prism(tan, north, 0, 14.7, roof)
const south: XY[] = [[XW, -78.9], [68.7, -78.9], [68.7, -30], [XW, -30]]
k.prism(tan, south, 0, 17.2, roof)
// the east annex
k.box(tan, XE, 92.5, -76.3, -26.8, 0, 9.7, roof)

// ── The 3rd St wing: buff brick with a tan coping ───────────────────────
const wing: XY[] = [
  [-73, -73], [XW, -73], [XW, 79.8], [-53.8, 79.8], [-53.7, 76.2], [-74, 76.2], [-74, 56.6], [-77.2, 56.5],
  [-77, 27.6], [-81.6, 27.6], [-81.5, -14.7], [-84.2, -14.7], [-84.2, -49.2], [-73, -49.2],
]
k.walls(brick, wing, 0, 10)
k.walls(tan, wing, 10, 12)
k.top(roof, wing, 12)
k.box(tan, -81.4, -40, -2, 27.5, 11.9, 14.4, roof)
k.walls(brick, [[-81.45, -2], [-40, -2], [-40, 27.5], [-81.45, 27.5]], 0, 11.95)

// ── The Washington St front: the coffered frieze over recessed glass ────
const F0 = 9, F1 = 17.9, FX0 = -16, FX1 = XE, FY0 = 79, FY1 = 85.6
k.box(tan, FX0, FX1, FY0, FY1, F0, F1, tan, true)
// the glazing on the hall's north wall under the frieze, and its piers
const front: [XY, XY] = [[FX1, FY0], [FX0, FY0]]
for (let i = 0; i < 6; i++) {
  const s0 = 0.02 + i * (0.96 / 6), s1 = s0 + 0.96 / 6 - 0.03
  k.panel(win, front[0], front[1], s0, s1, 2.8, F0 - 0.6)
}
// the coffers: alternating triangles across the frieze's north face, set
// just proud of it in the darker tan
{
  const n = 13, w = (FX1 - FX0) / n, y = FY1 + 0.06, z0 = F0 + 1.1, z1 = F1 - 1.1
  for (let i = 0; i < n; i++) {
    const x0 = FX1 - i * w - 0.5, x1 = FX1 - (i + 1) * w + 0.5, xm = (x0 + x1) / 2
    // seen from the north, x decreases to the right, so wind accordingly
    if (i % 2 === 0) coffer.tri(k.P(x0, y, z1), k.P(xm, y, z0), k.P(x1, y, z1))
    else coffer.tri(k.P(x0, y, z0), k.P(x1, y, z0), k.P(xm, y, z1))
  }
  // and on the frieze's west end
  coffer.tri(k.P(FX0 - 0.06, FY1 - 1, z1), k.P(FX0 - 0.06, (FY0 + FY1) / 2, z0), k.P(FX0 - 0.06, FY0 + 1, z1))
}

const lit = (p: [number, number, number], n: [number, number, number]) =>
  p[1] > FY0 - 0.1 && p[2] >= F0 - 0.01 && n[2] < 0.5 ? 0.85 : 0

await write(ID, 'Phoenix Convention Center South Building',
  'Y up, -Z north, +X east, metres; origin on the ground at the outline centroid (-112.0686398, 33.4473001); bearing 0', [
    { part: tan, material: { ...finish('pcc-tan', 0xd8c6a8), floodlight: lit } },
    { part: coffer, material: finish('pcc-coffer', 0xbda687) },
    { part: brick, material: finish('pcc-brick', 0xc4a587) },
    { part: win, material: { ...PALETTE.window, color: 0x667c88 } },
    { part: roof, material: finish('pcc-roof', 0xdcdcd6) },
  ])
