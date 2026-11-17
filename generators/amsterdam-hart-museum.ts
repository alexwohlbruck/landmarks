/**
 * H'ART Museum (Amstelhof), Amsterdam — procedural, CC0-1.0, no textures.
 * bun generators/amsterdam-hart-museum.ts
 *
 * The Amstelhof of 1681–1683, the Reformed diaconate's home for old women,
 * since 2009 the Hermitage and now the H'ART Museum: a long, austere block
 * of dark brown-red brick round a great courtyard, with a 102 m front on
 * the Amstel, three storeys of plain windows under a white cornice, large
 * grey tiled roofs, a low brick pediment in the middle of the river front
 * and two square roof lanterns (chimney stacks with lead caps) on its ridge.
 *
 * Map frame: x = model east (bearing 163°, along the Amstel front), y =
 * model north (bearing 73°, away from the river), z up, metres. The Amstel
 * front faces −y. Placed at bearing 73.0° (the outline's long edges, 72.8°
 * and 73.0°). Anchor: the outline's area centroid (multipolygon with the
 * courtyard), which lies on the river front's axis (x −50.9…51.3).
 *
 * Evidence
 * - OSM relation/3604193 (building=yes, old_name Amstelhof, start_date 1681,
 *   ref:bag 0363100012165553, wikidata Q17235181 for the monument; the museum
 *   node node/2742811299 carries Q1350009): the outer ring x −50.9…51.3,
 *   y −37.7…31.8 with the rear projection x ±19.4 to y 39.6 (and a 9 m
 *   porch to 42.3); the courtyard x −28…28.4, y −28.3…22.2. OSM height
 *   18.4 (from the 3D BAG, to the lantern tops).
 * - 3D BAG (3dbag.nl, CC BY 4.0, TU Delft / 3DGI), NL.IMBAG.Pand.
 *   0363100012165553, LoD2.2 roofs from AHN lidar, sampled on a 4 m grid in
 *   this frame (ground NAP +0.09): ridges 14.0 over the river and rear
 *   wings; the 23 m deep side wings under broad roofs reading 12.8–14.1
 *   across (a flattened top); the rear projection 12.5–14.4; the 18.2 m
 *   "nok" is the lanterns. Single columns of 23–47 m readings at x −44 and
 *   −36 are reconstruction artefacts.
 * - Photos (Wikimedia Commons, all EVIDENCE):
 *   - S Sepp, "Hermitage amsterdam panorama.jpg", CC BY-SA 3.0 — the whole
 *     river front, level: storeys, window count, pediment, lanterns,
 *     cornice, roof.
 *     https://commons.wikimedia.org/wiki/File:Hermitage_amsterdam_panorama.jpg
 *   - Ymblanter, "Amsterdam Amstelhof seen from Blauwbrug.jpg", CC BY-SA
 *     4.0 — from the north-west: the north wing, roofs, lanterns, dormers.
 *     https://commons.wikimedia.org/wiki/File:Amsterdam_Amstelhof_seen_from_Blauwbrug.jpg
 *   - ThoseIcons, "H'ART Museum letters in the Amstelhof garden, Amsterdam,
 *     October 2026.jpg", CC BY-SA 4.0 — a courtyard face close: the brick
 *     colour, window rows, white cornice, tiled roof.
 *     https://commons.wikimedia.org/wiki/File:H%27ART_Museum_letters_in_the_Amstelhof_garden,_Amsterdam,_October_2026.jpg
 *   - Ymblanter, "Amsterdam Amstelhof Southern part of the eastern wing.jpg",
 *     CC BY-SA 4.0. https://commons.wikimedia.org/wiki/File:Amsterdam_Amstelhof_Southern_part_of_the_eastern_wing.jpg
 * - Estimated from Sepp's panorama, scaled to the 3D BAG ridge: eaves 9.0
 *   (wall to roof about 73:45 in the photo), pediment ±5.5 wide to 13.0,
 *   lanterns at x ±25 rising to 18.2; 31 window bays along the front;
 *   windows grouped as one panel for the ground storey and one spanning the
 *   two upper storeys in each bay.
 *
 * Colour: dark brown-red brick (#7d5a54; the photos show it, not
 * plaster), white cornice and doorcases, grey tiled roofs.
 *
 * Night: the river front is floodlit; windows glow.
 *
 * Doubts: the side wings' roofs are drawn as broad hipped roofs with a
 * flat top, following the BAG, not a photo; the courtyard faces repeat the
 * front's rhythm; dormers, chimneys and the doorcases' detail are left
 * out; only the two river-front lanterns are drawn (a third shows in
 * Ymblanter's photo further along, position unsure).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { finishModel, prism, quadN, unit, type XY } from './nyc-570-lexington'
import { rectPanel, block, hipRoof } from './nyc-city-hall'

const brick = new Part(), trim = new Part(), roof = new Part(), win = new Part(), lead = new Part()
const EAVE = 9.0, RIDGE = 14.0

/** A brick wing on a rectangle with windows on all four faces. */
function wing(x0: number, y0: number, x1: number, y1: number, faces: [boolean, boolean, boolean, boolean]) {
  const ring: XY[] = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
  prism({ wall: brick, win: null, roof: null, ring, z0: 0, z1: EAVE, facade: null, bevel: 0.3 })
  for (let i = 0; i < 4; i++) {
    if (!faces[i]) continue
    const a = ring[i], b = ring[(i + 1) % 4], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const n = Math.max(1, Math.round(L / 3.3))
    for (let k = 0; k < n; k++) {
      const s = (L * (k + 0.5)) / n
      rectPanel(win, a, b, s, 1.3, 1.1, 3.4, 0.05)
      rectPanel(win, a, b, s, 1.3, 4.1, 8.0, 0.05)
    }
  }
  // White cornice band.
  for (let i = 0; i < 4; i++) {
    const a = ring[i], b = ring[(i + 1) % 4], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L, nx = uy, ny = -ux, d = 0.35
    const A: XY = [a[0] + (nx - ux) * d, a[1] + (ny - uy) * d], B: XY = [b[0] + (nx + ux) * d, b[1] + (ny + uy) * d]
    const nn: V3 = [nx, ny, 0], up: V3 = [0, 0, 1], dn: V3 = [0, 0, -1]
    quadN(trim, [A[0], A[1], EAVE - 0.5], [B[0], B[1], EAVE - 0.5], [B[0], B[1], EAVE], [A[0], A[1], EAVE], [nn, nn, nn, nn])
    quadN(trim, [a[0], a[1], EAVE], [b[0], b[1], EAVE], [B[0], B[1], EAVE], [A[0], A[1], EAVE], [up, up, up, up])
    quadN(trim, [A[0], A[1], EAVE - 0.5], [B[0], B[1], EAVE - 0.5], [b[0], b[1], EAVE - 0.5], [a[0], a[1], EAVE - 0.5], [dn, dn, dn, dn])
  }
}
/** A hipped roof with a flat top, over a rectangle. */
function flatHip(x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, inset: number) {
  const B: V3[] = [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]]
  const T: V3[] = [[x0 + inset, y0 + inset, z1], [x1 - inset, y0 + inset, z1], [x1 - inset, y1 - inset, z1], [x0 + inset, y1 - inset, z1]]
  const c = [(x0 + x1) / 2, (y0 + y1) / 2]
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    const m = unit([(B[i][0] + B[j][0]) / 2 - c[0], (B[i][1] + B[j][1]) / 2 - c[1], 0])
    const n = unit([m[0], m[1], inset / (z1 - z0)])
    quadN(roof, B[i], B[j], T[j], T[i], [n, n, n, n])
  }
  roof.cap(T, true)
}

// ---------------------------------------------------------------- wings
const XW = -50.9, XE = 51.3, YF = -37.7, YC0 = -28.2, YC1 = 22.0, YB = 31.6
const o = 0.4 // eaves overhang
// River front and rear wings, the full width; side wings between them.
wing(XW, YF, XE, YC0, [true, false, true, true])
wing(XW, YC1, XE, YB, [true, true, true, true])
wing(28.3, YC0, XE, YC1, [false, true, false, true])
wing(XW, YC0, -28.0, YC1, [false, true, false, true])
hipRoof(roof, XW - o, YF - o, XE + o, YC0 + o, EAVE - 0.1, RIDGE - EAVE + 0.1)
hipRoof(roof, XW - o, YC1 - o, XE + o, YB + o, EAVE - 0.1, RIDGE - EAVE + 0.1)
flatHip(28.3 - o, YC0 - 2, XE + o, YC1 + 2, EAVE - 0.1, 13.6, 4.6)
flatHip(XW - o, YC0 - 2, -28.0 + o, YC1 + 2, EAVE - 0.1, 13.6, 4.6)
// Rear projection (the former church hall) and its porch.
wing(-19.4, YB - 0.5, 19.4, 39.5, [true, true, true, false])
hipRoof(roof, -19.4 - o, YB - 0.5, 19.4 + o, 39.5 + o, EAVE - 0.1, RIDGE - EAVE + 0.1)
prism({ wall: brick, win: null, roof, coping: trim, ring: [[-4.5, 39.4], [4.6, 39.4], [4.6, 42.2], [-4.5, 42.2]], z0: 0, z1: 3.0, facade: null, bevel: 0.2 })

// ---------------------------------------------------------------- river front centre
// A low brick pediment over the middle five bays, rising into the roof,
// with a white raking cornice; the central doorcase below.
{
  const y = YF - 0.05, hw = 5.5, apex = 13.0, n: V3 = [0, -1, 0]
  brick.tri([-hw, y, EAVE], [hw, y, EAVE], [0, y, apex], undefined, undefined, undefined, [n, n, n])
  for (const s of [-1, 1]) {
    const a: V3 = [s * (hw + 0.5), y - 0.3, EAVE - 0.1], b: V3 = [0, y - 0.3, apex + 0.35]
    const r = unit([s * 0.6, -0.4, 1])
    quadN(trim, a, b, [0, y + 0.6, apex + 0.35], [s * (hw + 0.5), y + 0.6, EAVE - 0.1], [r, r, r, r])
    // Roof slopes from the pediment back into the main roof.
    const q = unit([s * (apex - EAVE), 0, hw])
    quadN(roof, [s * (hw + 0.4), y + 0.5, EAVE + 0.05], [0, y + 0.5, apex + 0.3], [0, YF + 4.6, RIDGE - 0.1], [s * (hw + 0.4), YF + 4.6, EAVE + 0.05], [q, q, q, q])
  }
  block(trim, -1.6, YF - 0.25, 1.6, YF + 0.01, 0, 3.8)
  rectPanel(win, [-1.6, YF - 0.25], [1.6, YF - 0.25], 1.6, 1.8, 0.2, 3.2, 0.05)
}
// Two more doorcases along the front (Sepp's photo), at the quarter points.
for (const x of [-38, 38]) block(trim, x - 1.4, YF - 0.2, x + 1.4, YF + 0.01, 0, 3.6)

// ---------------------------------------------------------------- lanterns
// Square brick stacks on the river wing's ridge with a white cornice, a lead cap and a finial.
for (const x of [-25, 25]) {
  const y = (YF + YC0) / 2
  prism({ wall: brick, win: null, roof: null, ring: [[x - 0.9, y - 0.9], [x + 0.9, y - 0.9], [x + 0.9, y + 0.9], [x - 0.9, y + 0.9]], z0: 11.0, z1: 16.2, facade: null, bevel: 0.15 })
  block(trim, x - 1.15, y - 1.15, x + 1.15, y + 1.15, 16.2, 16.6)
  // Lead cap: a stepped bell and a spike.
  block(lead, x - 0.8, y - 0.8, x + 0.8, y + 0.8, 16.6, 17.1)
  const P: V3[] = [[x - 0.7, y - 0.7, 17.1], [x + 0.7, y - 0.7, 17.1], [x + 0.7, y + 0.7, 17.1], [x - 0.7, y + 0.7, 17.1]]
  for (let i = 0; i < 4; i++) {
    const a = P[i], b = P[(i + 1) % 4], m = unit([(a[0] + b[0]) / 2 - x, (a[1] + b[1]) / 2 - y, 0.5])
    lead.tri(a, b, [x, y, 18.4], undefined, undefined, undefined, [m, m, m])
  }
}

// ---------------------------------------------------------------- write
const flood = (p: V3, n: V3) => (n[1] < -0.6 && p[2] < EAVE + 0.1 ? 0.5 : 0)
finishModel("H'ART Museum (Amstelhof)", 'amsterdam-hart-museum', [
  { part: brick, material: { ...finish('amstelhof-brick', 0x7d5a54), floodlight: flood } },
  { part: trim, material: { ...PALETTE.trim, floodlight: flood } },
  { part: roof, material: finish('amstelhof-roof', 0x767c83) },
  { part: win, material: PALETTE.window },
  { part: lead, material: finish('amstelhof-lead', 0x8d959c) },
], { bearing: 73.0, osm: 'relation/3604193', height: 18.4 })
