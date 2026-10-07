/**
 * Frederick C. Robie House, Chicago (1909–10, Frank Lloyd Wright) — original
 * procedural geometry, CC0-1.0.
 * bun generators/chi-robie-house.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = centroid of OSM way/125667497, 41.789811, -87.595947.
 * Bearing 0: the house runs east–west along 58th Street (its long edges at
 * 88.7°–89.5°), drawn as it lies.
 *
 * Identity: the Prairie house. Long, low horizontal masses of thin roman
 * brick with limestone copings; a continuous band of art-glass windows on
 * the main floor; very shallow hipped tile roofs with deep eaves, the main
 * one cantilevered far past the west porch (the "prow"); a smaller
 * third-floor belvedere with its own low hip crossing above; a broad
 * central chimney; the lower service wing and garage court to the north-
 * east; low brick terrace walls with stone caps.
 *
 * Abstraction: each roof is one low hip with a thin fascia; the window
 * bands are flush `window` strips between brick piers; the planters, urns,
 * the walled garden's steps and the art-glass pattern are left out.
 *
 * Evidence:
 *  - plan: OSM way/125667497 (40.7 x 15.6 m overall: the main house
 *    x −19.5..10.9, its south bay x −12..4 to y −8.1, the north rooms and
 *    the service wing to y 7.5, the garage x 10.8..21.3). Roof plan from
 *    USGS NAIP (0.1 m/px): main roof running west past the outline to
 *    x ≈ −25 over the porch, belvedere roof x ≈ −7..10, garage roof to the
 *    north-east. Wright's cantilever over the west porch is ≈ 6 m
 *    (published as about 20 ft).
 *  - heights: none in OSM. Estimated from the photos against the brick
 *    coursing and the 2 m terrace walls: brick ground storey and terrace
 *    copings ≈ 3.2 m, main-floor eaves ≈ 6.6 m, belvedere eaves ≈ 9.8 m,
 *    roofs rising ≈ 1.2–1.6 m (a very low pitch), chimney ≈ 13 m. ±1 m.
 *  - colour: red-brown roman brick, pulled light; pale limestone copings
 *    and cream soffits; red-brown clay tile roofs (salmon-red in NAIP,
 *    dark red-brown in the street photos; drawn between the two).
 *
 * Doubt: at minzoom 16 this reads as "a long low brick house with big
 * flat roofs", which is what the Robie House is; the art glass and the
 * fine horizontal raking of the brick do not survive at map scale.
 *
 * Photos (Wikimedia Commons): Frank_Lloyd_Wright_-_Chicago,_IL_-_Frederick_
 * Robie_House_(A), (F) and (G).jpg (Bmzuckerman, CC BY 4.0); Chicago,_robie_
 * house_di_frank_lloyd_wright,_1908-1910,_esterno_01.jpg (Sailko, CC BY
 * 3.0); Robie_House_Exterior_05.jpg and _19.jpg (Stilfehler, CC BY-SA 4.0);
 * two Carol M. Highsmith photos (LCCN2011634997, LCCN2011632338; public
 * domain). USGS NAIP. No commercial imagery.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { block, cap, ccw, inset, panel, rect, relief, save, walls, type XY } from './chi-museum-of-science-industry'

const brick = new Part(), trim = new Part(), roof = new Part(), win = new Part()

/**
 * A low hip roof over x0..x1, y0..y1: a fascia band from z0 − t to z0, a
 * cream soffit under it, and hips rising `rise` to a ridge along the long
 * axis.
 */
function hip(x0: number, x1: number, y0: number, y1: number, z0: number, rise: number, t = 0.35) {
  const r = rect(x0, y0, x1, y1)
  walls(roof, r, z0 - t, z0)
  cap(trim, r, z0 - t, false)
  const alongX = x1 - x0 >= y1 - y0
  const h = alongX ? (y1 - y0) / 2 : (x1 - x0) / 2
  const z1 = z0 + rise
  if (alongX) {
    const ym = (y0 + y1) / 2, a: V3 = [x0 + h, ym, z1], b: V3 = [x1 - h, ym, z1]
    roof.quad([x0, y0, z0], [x1, y0, z0], b, a)
    roof.quad([x1, y1, z0], [x0, y1, z0], a, b)
    roof.tri([x1, y0, z0], [x1, y1, z0], b)
    roof.tri([x0, y1, z0], [x0, y0, z0], a)
  } else {
    const xm = (x0 + x1) / 2, a: V3 = [xm, y0 + h, z1], b: V3 = [xm, y1 - h, z1]
    roof.quad([x1, y0, z0], [x1, y1, z0], b, a)
    roof.quad([x0, y1, z0], [x0, y0, z0], a, b)
    roof.tri([x0, y0, z0], [x1, y0, z0], a)
    roof.tri([x1, y1, z0], [x0, y1, z0], b)
  }
}

/** A brick wall run with a limestone coping: a terrace or planter wall. */
function terraceWall(r: XY[], z1: number) {
  walls(brick, r, 0, z1 - 0.3)
  block(trim, trim, inset(r, -0.15), z1 - 0.3, z1, 0.1)
}

// --- Plan --------------------------------------------------------------------
const COPING = 3.2, MAIN_EAVE = 6.6, TOP_EAVE = 9.8
// Main house: the long body and the south bay (OSM).
const body: XY[] = [[-19.5, -6.8], [-12.2, -6.7], [-12.1, -8.1], [4.0, -7.8], [4.0, -6.4], [10.9, -6.3], [10.8, 1.6], [-5.1, 1.8], [-5.1, 6.6], [-10.1, 6.5], [-10.0, 1.9], [-19.5, 1.7]]
// North rooms and service wing to the garage (OSM), lower.
const service: XY[] = [[-5.1, 1.8], [10.8, 1.6], [21.3, 1.6], [21.2, 7.5], [-5.1, 7.2]]

// Ground storey of the main body, then the main floor set back slightly
// behind a continuous limestone coping, with its band of art glass.
walls(brick, body, 0, COPING - 0.3)
block(trim, trim, inset(body, -0.2), COPING - 0.3, COPING, 0.1)
const upper = inset(body, 0.4)
walls(brick, upper, COPING, MAIN_EAVE - 0.35)
// Art-glass bands: the long south front and its bay, and the north front.
for (const [a, b] of [[[-19.1, -6.4], [-11.8, -6.3]], [[-11.7, -7.7], [3.6, -7.4]], [[3.6, -6.0], [10.5, -5.9]], [[10.4, 1.2], [-4.7, 1.4]]] as [XY, XY][]) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  panel(win, a, b, 0.6, L - 0.6, COPING + 0.5, MAIN_EAVE - 0.8, 0.05)
  // Brick piers between window groups, standing just proud.
  const n = Math.max(2, Math.round(L / 4))
  for (let i = 1; i < n; i++) relief(brick, a, b, (i * L) / n - 0.35, (i * L) / n + 0.35, COPING + 0.4, MAIN_EAVE - 0.7, 0.15)
}
// West wall of the main floor: glazed doors to the porch.
panel(win, [-19.1, 1.3], [-19.1, -6.4], 1.2, 6.5, COPING + 0.5, MAIN_EAVE - 0.8, 0.05)

// The west porch: a walled terrace under the cantilevered prow.
terraceWall(ccw([[-24.6, -6.8], [-19.5, -6.8], [-19.5, -6.1], [-23.9, -6.1], [-23.9, 1.0], [-19.5, 1.0], [-19.5, 1.7], [-24.6, 1.7]]), 2.6)
// The long south terrace wall along the street front.
terraceWall(rect(-19.5, -10.6, 4.0, -9.9), 2.0)
terraceWall(rect(-19.5, -9.9, -18.8, -6.8), 2.0)

// Service wing: two lower storeys, brick, a coping at the first floor.
walls(brick, service, 0, COPING - 0.3)
block(trim, trim, inset(service, -0.15), COPING - 0.3, COPING, 0.1)
walls(brick, inset(service, 0.3), COPING, 5.9)
panel(win, [21.0, 7.3], [-4.8, 7.0], 6, 20, COPING + 0.5, 5.3, 0.05)
panel(win, [11.1, 1.9], [21.0, 1.9], 1, 9, COPING + 0.5, 5.3, 0.05)

// Belvedere: the third floor, a smaller brick block with a window band.
const top = rect(-5, -3.6, 8, 3.6)
walls(brick, top, MAIN_EAVE, TOP_EAVE - 0.35)
for (const [a, b] of [[[-5, -3.6], [8, -3.6]], [[8, 3.6], [-5, 3.6]]] as [XY, XY][]) panel(win, a, b, 0.8, 12.2, 8.3, TOP_EAVE - 0.8, 0.05)

// --- Roofs ---------------------------------------------------------------------
hip(-25.6, 12.6, -9.0, 3.2, MAIN_EAVE, 1.5)      // main: the long cantilevered prow to the west
hip(-7.2, 10.2, -5.8, 5.8, TOP_EAVE, 1.4)        // belvedere
hip(9.6, 22.6, 0.2, 8.9, 6.2, 1.1)               // service wing and garage

// --- Chimney -------------------------------------------------------------------
const ch = rect(-4.4, -1.6, -1.0, 1.6)
walls(brick, ch, MAIN_EAVE, 12.6)
block(trim, trim, inset(ch, -0.25), 12.6, 13.0, 0.1)

await save('chi-robie-house', 'Frederick C. Robie House', [
  { part: brick, material: finish('roman-brick', 0xbf8676) },
  { part: trim, material: PALETTE.stone },
  { part: roof, material: finish('robie-tile', 0x7f5a50) },
  { part: win, material: PALETTE.window },
], { height: 13 })
