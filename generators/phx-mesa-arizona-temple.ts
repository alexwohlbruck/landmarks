/**
 * Mesa Arizona Temple (The Church of Jesus Christ of Latter-day Saints),
 * Mesa, Arizona (dedicated 1927, Don Carlos Young and Ramm Hansen;
 * renovated 1975 and 2018–2021) — original procedural geometry, CC0-1.0.
 * bun generators/phx-mesa-arizona-temple.ts
 *
 * Map frame: x east, y north, z up, metres; origin on the ground at the
 * centroid of OSM way/248614888 ("Mesa Arizona Temple", building=temple,
 * wikidata Q1518820), -111.8197224, 33.4127553. Bearing 0: the walls run
 * north-south and east-west.
 *
 * Identity (from the photos below):
 *  1. A flat-topped neoclassical block, no spire, clad in pale cream-white
 *     terracotta, standing on a wide one-storey base.        (midi, runt)
 *  2. On every face a central colonnade of tall pilasters between plain end
 *     pavilions, with tall narrow dark windows between the pilasters.
 *                                                       (midi, runt, mai)
 *  3. A sculpted frieze band over the pilasters, a projecting cornice and a
 *     plain parapet.                                          (midi, runt)
 *  4. The base: a one-storey terrace block with big gridded windows.
 *                                                           (midi, mai)
 *
 * Plan: the base is OSM way/248614888 as drawn (it matches the lidar within
 * a metre). The temple block on it, from the lidar: x -8.5..25.5,
 * y -0.5..26.5 (34 by 27 m), in the north part of the base; the base runs
 * on south of it as a long one-storey wing. A raised part of the base
 * (5.4 m) along the block's west side and the west annex, from the lidar.
 *
 * Heights: USGS 3DEP lidar AZ_MaricopaPinal_1_2020 (flown 2020, during the
 * renovation; the building's shell was not changed), 1 m grid, above the
 * ground round the base (ground_min + 3.9 m, flat within 0.3 m; the gardens
 * west are a metre lower). Measured: the base 4.4, the west part 5.4, the
 * block's parapet 16.2, the roof inside it 14.7.
 * Scaled from midi (19.5 px a metre, set by the lidar's 4.4 and 16.2):
 * the pilasters 4.9–12.2 with capitals to 12.8, the frieze 12.8–14.6, the
 * cornice 14.6–15.4, the windows 7.8–11.8, the bays 2.75 m (seven on the
 * long faces), the end pavilions 6.8 m on the long faces.
 * Estimated: six bays on the short faces (runt shows them foreshortened);
 * the base windows' spacing on faces no photo shows squarely.
 *
 * Photos (evidence, Wikimedia Commons):
 *  midi  "Mesa Temple.jpg", midiman from Tempe, CC BY 2.0, a long face
 *        across the reflecting pool
 *        https://commons.wikimedia.org/wiki/File:Mesa_Temple.jpg
 *  runt  "Mesa Temple - panoramio.jpg", runt35, CC BY 3.0, a corner: a long
 *        and a short face, the base
 *        https://commons.wikimedia.org/wiki/File:Mesa_Temple_-_panoramio.jpg
 *  mai   "TempleMesaArizona.JPG", Maithe38, CC BY-SA 3.0, close: the
 *        pilasters, the windows, the gridded base windows
 *        https://commons.wikimedia.org/wiki/File:TempleMesaArizona.JPG
 *  NAIP  USGS NAIP orthophoto (public domain): the plan and the pale roofs.
 * No look-only sources. No commercial imagery.
 *
 * Doubts: which face midi shows is not certain (the photo predates the
 * 2018–2021 renovation of the gardens); all four faces are drawn alike.
 * The frieze's sculpture is a plain band. The base's south wing and its
 * entrances are in no photo: no doors are drawn, and its windows repeat the
 * north ones. The low mechanical rise on the roof is left out.
 *
 * Night: the temple is floodlit (as LDS temples are); the block's walls
 * carry _FLOODLIGHT, the windows glow (`window`). No night photo checked.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { box, capPoly, ccw, cornice, ledge, offset, prism, save, toFrame, wall, at, type XY } from './atl-flatiron-building'
import { onWall, rectShape } from './atl-tech-tower'

const ANCHOR = { lng: -111.8197224, lat: 33.4127553 }
const OSM: XY[] = [[-111.8198691, 33.4123818], [-111.8196726, 33.4123804], [-111.8196728, 33.4123677], [-111.8196201, 33.4123674], [-111.8196199, 33.4123822], [-111.8194273, 33.4123809], [-111.8194256, 33.4125405], [-111.8193901, 33.4125402], [-111.8193884, 33.4126989], [-111.8193718, 33.4126987], [-111.8193682, 33.4130438], [-111.8199663, 33.4130481], [-111.8199675, 33.412928], [-111.8200692, 33.4129287], [-111.8200693, 33.4129107], [-111.8200853, 33.4129109], [-111.8200861, 33.4128367], [-111.8200689, 33.4128366], [-111.8200691, 33.4128176], [-111.8199718, 33.4128169], [-111.8199731, 33.4126931], [-111.8198764, 33.4126924], [-111.819878, 33.4125326], [-111.8198676, 33.4125326]]

if (import.meta.main) {
  const stone = new Part(), trim = new Part(), win = new Part(), roof = new Part(), shade = new Part()

  // ── The base: OSM's outline, 4.4 m, with a coping. ──
  const BASE = 4.4
  const ring = toFrame(OSM, ANCHOR)
  prism(stone, ring, 0, BASE, roof, 0.25)
  cornice(trim, ring, BASE - 0.5, 0.5, 0.25, null)
  // the raised part along the block's west side and the west annex
  box(stone, -15.5, -8.5, -0.5, 26.5, BASE, 5.4, roof, 0.2)
  box(stone, -33.6, -15.5, 6.9, 19.2, 0, 5.4, roof, 0.25)

  // Big gridded windows along the base's walls (midi, mai): 2.3 m wide,
  // 0.9–3.4 m, one every 3.3 m, kept off the corners.
  const n = ring.length
  for (let i = 0; i < n; i++) {
    const a = ring[i], b = ring[(i + 1) % n], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 7) continue
    const k = Math.floor((L - 3) / 3.3), s0 = (L - (k - 1) * 3.3) / 2
    for (let j = 0; j < k; j++) {
      const s = s0 + j * 3.3
      onWall(win, a, b, rectShape(s - 1.15, s + 1.15, 0.9, 3.4), 0.05)
    }
  }

  // ── The temple block. ──
  const X0 = -8.5, X1 = 25.5, Y0 = -0.5, Y1 = 26.5, TOP = 16.2, ROOF = 14.7
  const BLOCK: XY[] = ccw([[X0, Y0], [X1, Y0], [X1, Y1], [X0, Y1]])
  wall(stone, BLOCK, BASE, TOP - 0.3)
  // chamfered parapet top, a ledge in, the recessed roof
  const inner = offset(BLOCK, -0.3), well = offset(BLOCK, -1.3)
  stone.loft([at(BLOCK, TOP - 0.3), at(inner, TOP)])
  ledge(stone, inner, well, TOP, true)
  wall(stone, [...well].reverse(), ROOF, TOP)
  capPoly(roof, well, ROOF, true)
  // the frieze as a slightly proud band, the cornice over it
  cornice(trim, BLOCK, 12.8, 1.8, 0.12, null)
  cornice(trim, BLOCK, 14.6, 0.8, 0.55, null)
  ledge(trim, offset(BLOCK, 0.3), BLOCK, 15.4, true)
  // a plinth course where the block meets the base
  cornice(trim, BLOCK, BASE, 0.5, 0.2, null)

  // The colonnades: pilasters (0.9 m wide, 0.45 m proud) between plain end
  // pavilions, a dark window between each pair, a blind panel below.
  type Face = { a: XY; b: XY; bays: number }
  const faces: Face[] = [
    { a: [X0, Y0], b: [X1, Y0], bays: 7 }, // south
    { a: [X1, Y0], b: [X1, Y1], bays: 6 }, // east
    { a: [X1, Y1], b: [X0, Y1], bays: 7 }, // north
    { a: [X0, Y1], b: [X0, Y0], bays: 6 }, // west
  ]
  const BAY = 2.75, PW = 0.9, PD = 0.6
  for (const f of faces) {
    const L = Math.hypot(f.b[0] - f.a[0], f.b[1] - f.a[1])
    const t: XY = [(f.b[0] - f.a[0]) / L, (f.b[1] - f.a[1]) / L], nn: XY = [t[1], -t[0]]
    const P = (s: number, d: number): XY => [f.a[0] + t[0] * s + nn[0] * d, f.a[1] + t[1] * s + nn[1] * d]
    const span = f.bays * BAY, s0 = (L - span) / 2
    // the colonnade's back wall reads darker, in the pilasters' shadow
    onWall(shade, f.a, f.b, rectShape(s0, s0 + span, 4.9, 12.8), 0.03)
    // antae: broader pilasters closing the colonnade at each end
    for (const s of [s0 - 0.6, s0 + span + 0.6]) {
      const q = [P(s - 0.6, 0), P(s + 0.6, 0), P(s + 0.6, PD), P(s - 0.6, PD)]
      prism(trim, ccw(q), 4.9, 12.8, trim, 0.1)
    }
    for (let k = 0; k <= f.bays; k++) {
      const s = s0 + k * BAY
      if (k > 0 && k < f.bays) {
        const q = [P(s - PW / 2, 0), P(s + PW / 2, 0), P(s + PW / 2, PD), P(s - PW / 2, PD)]
        prism(trim, ccw(q), 4.9, 12.2, null, 0)
        const c = [P(s - PW / 2 - 0.15, 0), P(s + PW / 2 + 0.15, 0), P(s + PW / 2 + 0.15, PD + 0.15), P(s - PW / 2 - 0.15, PD + 0.15)]
        prism(trim, ccw(c), 12.2, 12.8, trim, 0.1)
      }
      if (k < f.bays) {
        const m = s + BAY / 2
        onWall(win, f.a, f.b, rectShape(m - 0.7, m + 0.7, 7.8, 11.8), 0.05)
        onWall(stone, f.a, f.b, rectShape(m - 0.85, m + 0.85, 5.2, 7.4), 0.06)
      }
    }
  }

  const lit = (p: V3, nrm: V3) => (p[2] > BASE && nrm[2] < 0.5 ? 0.8 : nrm[2] < 0.5 ? 0.4 : 0)
  await save('phx-mesa-arizona-temple', 'Mesa Arizona Temple', [
    { part: stone, material: { ...finish('mesa-temple-terracotta', 0xebe4d6), floodlight: lit } },
    { part: trim, material: { ...PALETTE.trim, floodlight: lit } },
    { part: win, material: PALETTE.window },
    { part: roof, material: finish('mesa-temple-roof', 0xddd6c8) },
    { part: shade, material: { ...finish('mesa-temple-shade', 0xd3cbbb), floodlight: lit } },
  ], { height: TOP, anchor: [ANCHOR.lat, ANCHOR.lng], bearing: 0 })
}
