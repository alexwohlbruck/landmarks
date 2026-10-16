/**
 * 110 East, 110 East Blvd, South End, Charlotte — procedural, CC0-1.0.
 * bun generators/clt-110-east.ts
 *
 * A 23-storey speculative office tower (Stiles / Shorenstein, Hastings
 * Architecture; topped out August 2023, delivered April 2024) beside the
 * East/West Blvd light-rail station. Three things identify it: a plain,
 * deep-blue glass box with pale floor lines; the parking podium below it
 * (floors 2–10) wrapped in a silver perforated-metal screen whose top edge
 * slants down toward the rail line, leaving the concrete deck edges bare above it; and the
 * recessed 11th-floor amenity level, a dark gap between podium and tower
 * with a terrace notch at the South Blvd / East Blvd corner.
 *
 * Evidence:
 *  - OSM: way/1152461493 (outline, 23 levels, height "88w", read as 88 m),
 *    way/1278215436 (tower part, 10–88 m), way/1278215437 (south podium part,
 *    10–32 m), way/1430326680 (podium, 10–32 m), way/1430326681 (ground
 *    floor, 0–10 m), way/1430326682–1430326694 (ground-floor columns, 10 m).
 *  - Published: 305 ft / 93 m, 23 storeys; floors 2–10 parking, 11 amenity
 *    and terrace, 12–23 offices (Wikipedia "110 East", Q115519219).
 *  - Lidar, USGS 3DEP NC Phase 4 Mecklenburg 2016 (1 m): flown when the site
 *    was a surface lot, so used for the ground only: the lot dips ~1.3 m below
 *    the surrounding sidewalks; y = 0 is that low point and the streets are
 *    taken at 1.3 m.
 *  - Photos (Wikimedia Commons, City Dweller 2, CC BY-SA 4.0):
 *    https://commons.wikimedia.org/wiki/File:110_East_Late_April_2024.jpg (from South Blvd, east)
 *    https://commons.wikimedia.org/wiki/File:110_East_at_the_corner_of_South_Blvd_and_East_Blvd_Mid-December_2025.jpg (east corner, the terrace notch)
 *    https://commons.wikimedia.org/wiki/File:110_East_viewed_from_Steel_Yard_along_the_South_End_Rail_Trail_Late_April_2024.jpg (south-west end, the bare deck above the screen)
 *    https://commons.wikimedia.org/wiki/File:110_East_along_East_Blvd_April_2024.jpg (East Blvd face: screen, lobby, garage entrance)
 *    https://commons.wikimedia.org/wiki/File:110_East_along_the_East_West_Blvd_Station_Late_April_2024.jpg (rail-trail face)
 *    https://commons.wikimedia.org/wiki/File:110_East_wide_view_March_2023.jpg (under construction: podium and core)
 *
 * Heights above the street: the ground floor to 9.5 m (OSM 10), the podium
 * to 32 m (OSM), the amenity level to 37 m (estimated, one tall storey), the
 * offices to 89.5 m (twelve ~4.4 m floors, estimated), the mechanical screen
 * to 93 m (published height). OSM's 88 m is taken as the roof without it.
 * Estimated from photos: the slant of the screen (32 m along South Blvd,
 * falling to 20 m at the north corner and 17 m at the west), the screen's foot (6 m), the
 * terrace notch (two bays, the amenity storey), the setback of the amenity
 * glass (1.5 m), mullion spacing.
 *
 * Doubts: the screen's slant is simplified to one straight run per face;
 * no photo shows the rail-trail face's upper podium squarely.
 *
 * Model frame: bearing 34 (model +y runs north-east along the rail line
 * toward East Blvd; +x is south-east, toward South Blvd); metres above the
 * base.
 */
import { Part } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { type XY, cap, quad, softBox } from './clt-highland-park-mill-3'
import { at, curtain, facesOf, ledge, panel, parapet, walls, writeAtBase, column } from './clt-vantage-south-end'

const GLASS = windowVariant(2, 0x80a0c6)
const SCREEN = finish('east-screen', 0xbcc6ce)
const CONCRETE = finish('east-concrete', 0xd6d5d0)
const ROOF = finish('east-roof', 0xc9ced2)

const STREET = 1.3
const OUTLINE: XY[] = [[-20.0, -47.3], [18.4, -47.1], [18.3, -22.9], [18.2, 12.7], [18.1, 45.5], [13.3, 46.7], [8.4, 48.0], [6.3, 48.5], [4.1, 48.2], [-1.8, 47.5], [-20.7, 45.0], [-20.3, -23.4]]
const TOWER: XY[] = [[-20.3, -23.4], [-8.6, -26.3], [18.3, -22.9], [18.2, 12.7], [18.1, 45.5], [13.3, 46.7], [8.4, 48.0], [6.3, 48.5], [4.1, 48.2], [-1.8, 47.5], [-20.7, 45.0]]
const GF = STREET + 9.5, POD = STREET + 32, AMEN = STREET + 37, ROOFZ = STREET + 89.5, TOP = STREET + 93

function build110East() {
  const glass = new Part(), win = new Part(), screen = new Part(), conc = new Part(), trim = new Part(), roof = new Part()

  // --- Ground floor: lobby and shop glass between concrete piers.
  walls(conc, OUTLINE, -0.6, GF)
  for (const f of facesOf(OUTLINE)) {
    if (f.L < 8) continue
    const n = Math.floor(f.L / 7.5), s0 = (f.L - n * 7.5) / 2
    for (let k = 0; k < n; k++) panel(win, f, s0 + 7.5 * k + 0.7, s0 + 7.5 * (k + 1) - 0.7, STREET + 0.2, STREET + 5.6)
  }

  // --- Podium: the bare concrete deck, open levels as dark bands, wrapped
  // in the metal screen up to a line that slants round the podium.
  walls(conc, OUTLINE, GF, POD)
  const F = facesOf(OUTLINE)
  // Runs round the outline at its four corners (W, S, E, N, back to W).
  const runs = F.map((_, i) => F.slice(0, i).reduce((s, f) => s + f.L, 0))
  const total = F.reduce((s, f) => s + f.L, 0)
  const corners = [0, runs[1], runs[F.findIndex((f) => f.o[1] > 0.5)], runs[F.findIndex((f) => f.o[0] < -0.9)], total]
  let run = 0
  for (const f of F) {
    for (let z = GF + 1.6; z < POD - 2; z += 6.4) panel(win, f, 0.3, f.L - 0.3, z, z + 2.4, 0.04)
    // The screen top: high along South Blvd, slanting down to the rail-trail
    // side, lowest at the west corner.
    const H = [STREET + 17, POD - 0.3, POD - 0.3, STREET + 20, STREET + 17]
    const z = (s: number) => {
      const r = run + s, k = Math.max(0, corners.findIndex((c, i) => r <= corners[i + 1] + 1e-6))
      const t = (r - corners[k]) / (corners[k + 1] - corners[k])
      return H[k] + (H[k + 1] - H[k]) * t
    }
    const N: [number, number, number] = [f.o[0], f.o[1], 0], d = 0.35, foot = STREET + 6
    const steps = Math.max(1, Math.ceil(f.L / 12))
    for (let i = 0; i < steps; i++) {
      const s0 = (i / steps) * f.L, s1 = ((i + 1) / steps) * f.L
      quad(screen, at(f, s0, d, foot), at(f, s1, d, foot), at(f, s1, d, z(s1)), at(f, s0, d, z(s0)), N)
      quad(trim, at(f, s0, 0, z(s0)), at(f, s1, 0, z(s1)), at(f, s1, d, z(s1)), at(f, s0, d, z(s0)), [0, 0, 1])
    }
    ledge(screen, f, 0, f.L, foot - 0.4, foot, d)
    run += f.L
  }
  // Podium roof south of the tower.
  cap(roof, [[-20.0, -47.3], [18.4, -47.1], [18.3, -22.9], [-8.6, -26.3], [-20.3, -23.4]], POD)
  ledge(trim, F[0], 0, F[0].L, POD - 0.4, POD + 1.0, 0.1)

  // --- Amenity level: dark glass set back under the tower, with the
  // terrace notch at the east corner.
  {
    const I: XY[] = [[-18.8, -21.6], [-8.6, -24.6], [16.8, -21.4], [16.6, 44.0], [6.3, 46.9], [-19.2, 43.6]]
    walls(win, I, POD, AMEN)
    cap(conc, TOWER, AMEN, false)
  }

  // --- The office tower: a blue glass box with pale lines every two floors.
  {
    const T = facesOf(TOWER)
    walls(glass, TOWER, AMEN, ROOFZ - 0.6)
    walls(conc, TOWER, AMEN - 0.6, AMEN)
    for (const f of T) curtain(trim, f, 0, f.L, AMEN, ROOFZ - 0.6, 8.7, f.L > 30 ? 12.5 : 9.5)
    parapet(trim, trim, roof, TOWER, ROOFZ, 1.4)
    // The terrace notch: the tower's east corner opens over two bays.
    const se = T.find((f) => f.o[0] > 0.9)!
    panel(win, se, se.L - 13.5, se.L - 0.2, AMEN - 0.5, AMEN + 4.2, 0.08)
    const ne = T.find((f) => f.o[1] > 0.9 && f.L > 4)!
    panel(win, ne, 0.2, Math.min(ne.L, 6), AMEN - 0.5, AMEN + 4.2, 0.08)
    for (const c of [[16.2, 43.4], [16.2, 30.0]] as XY[]) column(conc, c, 0.5, POD, AMEN)
    softBox(roof, [[-12, -12], [10, -12], [10, 30], [-12, 30]], ROOFZ - 1.4, TOP, 0.4, roof)
  }

  return {
    id: 'clt-110-east', name: '110 East', anchor: [0, 0] as XY, height: TOP,
    parts: [
      { part: glass, material: GLASS },
      { part: win, material: PALETTE.window },
      { part: screen, material: SCREEN },
      { part: conc, material: CONCRETE },
      { part: trim, material: PALETTE.trim },
      { part: roof, material: ROOF },
    ],
  }
}

if (import.meta.main) await writeAtBase(build110East())
