/**
 * Mesa Arts Center, Mesa, Arizona (2005, BOORA Architects with
 * DWL Architects) — the theater building — original procedural geometry,
 * CC0-1.0.
 * bun generators/phx-mesa-arts-center.ts
 *
 * Map frame: x across, y along the building, z up, metres; origin on the
 * ground at the centroid of OSM way/134185633 ("Mesa Arts Center",
 * building=yes, wikidata Q6821052), -111.8303250, 33.4141570. Bearing 20.7:
 * the outline's long walls run 20.7 degrees east of north, so +y points
 * north-north-east and -x faces the Shadow Walk on the west.
 *
 * Scope: the theater building only (way/134185633). The studios and the
 * Mesa Contemporary Arts museum across the Shadow Walk (way/134185637) and
 * the block on Main Street (way/134185640) stand apart and are left to the
 * map. The two white sail canopies that reach from this building over the
 * Shadow Walk are drawn to the walk's middle.
 *
 * Identity (from the photos below):
 *  1. Three theater pavilions in a row along the Shadow Walk, each a big
 *     auditorium with a curved west wall in its own colour: blue-violet
 *     (Ikeda Theater, north), moss green (Piper Repertory, middle),
 *     copper-red (Nesbitt/Elliott, south).          (down, walt, cyg, NAIP)
 *  2. Plain beige concrete fly towers behind each, the Ikeda's tallest
 *     (about 33 m).                                       (down, dooley)
 *  3. Two-storey glass lobbies along the west front with white roof slabs
 *     overhanging the walk, lit at night.            (walt, cyg, dooley)
 *  4. White fabric sails on masts over the Shadow Walk.  (cyg, NAIP)
 *
 * Plan: OSM way/134185633 for the outer walls; the pavilions, fly towers,
 * lobbies and service wings split from it along the lines the lidar
 * heights and NAIP roofs show. The curved auditorium walls bulge 6–8 m west
 * of their straight ends (NAIP).
 * Heights: USGS 3DEP lidar AZ_MaricopaPinal_1_2020 (flown 2020), 1 m grid,
 * read in the turned frame above the ground round the building
 * (ground_min + 6.8 m, flat within half a metre). Measured: Ikeda fly tower
 * 32–33 (rim 35), its auditorium 23–26 (falling to the east), its service
 * wing 13; Piper fly tower 21–24, auditorium 16–18; Nesbitt/Elliott fly
 * tower 19–21, auditorium 8–11; the lobbies and the link 16; the south
 * studios 12–13; the sails' tops 16–19.
 *
 * Estimated: the lobbies' glazing pattern; the sails as four panels each;
 * the colours of the Nesbitt/Elliott drum (from NAIP only).
 *
 * Photos (evidence):
 *  down   "Downtown Mesa Arizona.jpg", Ixnayonthetimmay, CC BY 3.0, from
 *         Main Street at Center Street: the Ikeda's fly tower and violet
 *         drum over the glass lobby
 *         https://commons.wikimedia.org/wiki/File:Downtown_Mesa_Arizona.jpg
 *  walt   "Mesa arts center.jpg", Walt Lockley, CC BY-SA 3.0, on the Shadow
 *         Walk: the green drum, the glass lobby and its white canopy
 *         https://commons.wikimedia.org/wiki/File:Mesa_arts_center.jpg
 *  cyg    "Mesa Arts Center - West - 2009-09-16.JPG", Cygnusloop99,
 *         CC BY-SA 3.0, the west entrance: the sails, a lobby with white
 *         louvres and a violet wall
 *         https://commons.wikimedia.org/wiki/File:Mesa_Arts_Center_-_West_-_2009-09-16.JPG
 *  dooley "Mesa Center for the Arts", Kevin Dooley, CC BY 2.0 (Flickr), at
 *         night: a lit lobby under a fly tower
 *         https://www.flickr.com/photos/12836528@N00/7427161338
 *  NAIP   USGS NAIP orthophoto (public domain): the plan, the curved walls,
 *         the white roofs and the sails.
 * No look-only sources. No commercial imagery.
 *
 * Doubts: no licensed photo shows the east (service) side or the south
 * theater's drum from the ground; they are drawn plain from the lidar and
 * NAIP. The Ikeda fly tower's leaning face (down) is drawn upright. The
 * sails are simplified to flat tilted panels.
 *
 * Night: the lobbies glow (`window`); the walls stay dark.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { box, capPoly, ccw, prism, save, wall, type XY } from './atl-flatiron-building'
import { onWall, rectShape } from './atl-tech-tower'

/** A rectangle x0..x1, y0..y1 whose west side bulges `b` metres west as an arc. */
function drumPlan(x0: number, x1: number, y0: number, y1: number, b: number, n = 10): XY[] {
  const half = (y1 - y0) / 2, ym = (y0 + y1) / 2
  const R = (half * half + b * b) / (2 * b), cx = x0 - b + R
  const a0 = Math.asin(half / R)
  const arc: XY[] = Array.from({ length: n + 1 }, (_, i) => {
    const a = -a0 + (2 * a0 * i) / n // south to north
    return [cx - R * Math.cos(a), ym + R * Math.sin(a)] as XY
  })
  return ccw([[x1, y0], [x1, y1], ...arc.reverse()])
}

/** A sail: a flat four-cornered panel, drawn both ways round. */
function sail(p: Part, q: V3[]) {
  p.quad(q[0], q[1], q[2], q[3])
  p.quad(q[3], q[2], q[1], q[0])
}

if (import.meta.main) {
  const conc = new Part(), white = new Part(), glass = new Part(), violet = new Part(), green = new Part(), copper = new Part()

  // ── Ikeda Theater (north). ──
  prism(violet, drumPlan(-24, 8, 15.5, 49.5, 7), 0, 24.5, white, 0.4)
  box(conc, 8, 22.5, 15, 50.5, 0, 33, conc, 0.5) // fly tower
  box(conc, 22.5, 32.1, 16.7, 50.6, 0, 13, white, 0.4) // service wing
  // the lobby along the walk: glass under a white slab
  const lobbyN: XY[] = ccw([[-38.9, 46.9], [-39, 27.9], [-41.6, 26.6], [-34.4, 11.7], [-24, 14], [-24, 54.3], [-38.9, 54.3]])
  wall(glass, lobbyN, 0, 15.2)
  capPoly(white, lobbyN, 15.2, true)
  box(white, -40.5, -16.9, 46.9, 54.3, 15.2, 16.2, white, 0.2, true)
  box(white, -43.2, -24, 12.5, 46.9, 15.2, 16.2, white, 0.2, true)
  box(conc, -24, 4.8, 47.3, 54.3, 0, 16, white, 0.3) // north link

  // ── Piper Repertory Theater (middle). ──
  prism(green, drumPlan(-12, 7, -19.5, 7, 6), 0, 17.5, white, 0.4)
  box(conc, 7, 19.5, -20, 8, 0, 23, conc, 0.4) // fly tower
  box(conc, 19.5, 32.2, -19.3, 14, 0, 11, white, 0.3) // service
  const lobbyM: XY[] = ccw([[-39.4, -0.9], [-27.3, -1.1], [-18.4, -12], [-18, 7], [-34.4, 11.7], [-39.7, 9.2]])
  wall(glass, lobbyM, 0, 15.2)
  capPoly(white, lobbyM, 15.2, true)
  box(white, -42, -18, -2.5, 11.5, 15.2, 16, white, 0.2, true)
  // the link between the north and middle theaters
  box(conc, -24, 30, 7, 15, 0, 15.5, white, 0.3)

  // ── Nesbitt/Elliott Theater (south) and the studios. ──
  prism(copper, drumPlan(-8, 15, -61, -43, 5), 0, 11, white, 0.3)
  box(conc, 15, 25, -62.5, -41, 0, 20, conc, 0.4) // fly tower
  box(conc, 25, 32.7, -59.7, -41.5, 0, 10, white, 0.3)
  box(conc, -11.2, -8, -65.6, -43, 0, 8, white, 0.3)
  box(conc, -3.1, 8.6, -63, -61, 0, 8, white, 0.2)
  // studios between the south and middle theaters, 12–13 m, glass to the walk
  box(conc, -15, 30.2, -41.5, -19.5, 0, 12.5, white, 0.3)
  box(glass, -22, -15, -42.5, -35.5, 0, 12, white, 0.2)
  box(glass, -20.5, -15, -30, -19.6, 0, 12, white, 0.2)
  box(white, -23.5, -15, -43.5, -19, 12, 12.8, white, 0.2, true)
  // between the middle theater and the studios
  box(conc, -18, 7, -21, -19, 0, 14, white, 0.2)

  // ── The Shadow Walk sails: a cluster on masts at each crossing, twisted
  // white panels stacked up the masts (cyg), reaching over the walk. ──
  for (const [yc, top] of [[4, 18.5], [-41, 19.5]] as const) {
    for (const xm of [-44, -39.5]) {
      box(white, xm - 0.3, xm + 0.3, yc - 0.3, yc + 0.3, 0, top + 1.5, null, 0)
      for (let k = 0; k < 3; k++) {
        const z0 = 8 + k * 3.6, s = k % 2 ? 1 : -1
        sail(white, [[xm - 3.2, yc - 3.5 * s, z0], [xm + 3.2, yc - 2.5 * s, z0 + 2.8], [xm + 3.2, yc + 3.5 * s, z0 + 1.2], [xm - 3.2, yc + 2.5 * s, z0 + 3.6]])
      }
    }
  }

  // Pale mullion fins and a floor line on the glass lobbies (walt, cyg).
  for (const ring of [lobbyN, lobbyM]) {
    for (let i = 0; i < ring.length; i++) {
      const a = ring[i], b = ring[(i + 1) % ring.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
      if (L < 3) continue
      const k = Math.max(1, Math.round(L / 4.5))
      for (let j = 1; j < k; j++) onWall(white, a, b, rectShape((L * j) / k - 0.2, (L * j) / k + 0.2, 0, 15.2), 0.06)
      onWall(white, a, b, rectShape(0, L, 7.4, 7.9), 0.06)
    }
  }

  await save('phx-mesa-arts-center', 'Mesa Arts Center', [
    { part: conc, material: finish('mac-concrete', 0xddd0b8) },
    { part: white, material: PALETTE.trim },
    { part: glass, material: windowVariant(2, 0xa9bfd1) },
    { part: violet, material: finish('mac-ikeda-violet', 0x9d9bc9) },
    { part: green, material: finish('mac-piper-green', 0xa6b88a) },
    { part: copper, material: finish('mac-nesbitt-copper', 0xc78f6a) },
  ], { height: 33, anchor: [33.414157, -111.830325], bearing: 20.7 })
}
