/**
 * World Trade Center Mexico City (Montecito 38 / Insurgentes Sur, Nápoles;
 * built 1966–72 as the Hotel de México, reclad and opened as the WTC in
 * 1995), Mexico City — original procedural geometry, CC0-1.0.
 * bun generators/mexico-city-world-trade-center.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = area centroid of the tower's OSM outline way/362824952
 * ("Torre WTC México"), 19.394418,-99.173854 (the landuse way/1185211773
 * named in the assignment is the whole site). The slab's long south face
 * runs at 103°, so the catalog bearing is 13 and the slab's long axis is
 * this frame's x.
 *
 * Identity, in order: the broad, flat slab of blue glass, 128 m long and
 * ~25 m deep, with a fine paler grid; the big round drum of dark blue glass
 * (the old revolving restaurant) sitting on the roof left of centre on a
 * narrow neck, wider than the slab is deep so it overhangs both faces, with
 * a narrower cap on top; the white crown of curved legs gathering into the
 * red-and-white lattice mast; the low podium the slab stands on.
 *
 * Evidence:
 *  - plan: OSM. Outline/podium way/362824952 (= part way/312315753, 22 m);
 *    the shaft way/227708277 (22–145.1 m), whose north face OSM draws
 *    slightly concave, with a dark service shaft notched into each end;
 *    the drum way/312315752 (r ≈ 19 m, 147–166 m), its cap way/312329506
 *    (r ≈ 14 m, 166–172 m), the crown way/312329508 (r ≈ 9.5 m,
 *    172–185 m, pyramidal); three posts way/312329503–5 (to 207 m).
 *  - heights: roof 191 m, antenna 218 m, top floor 172 m, 50 floors
 *    (published, Wikipedia en "World Trade Center Mexico City"). Slab roof
 *    145 m (OSM, agrees with EneasMx's level view: the drum, 38 m across,
 *    against the slab). Drum: neck 145–149, body 149–169, cap 169–173 m,
 *    photo-scaled on Felipe Alfonso Castillo Vázquez's close view (cap
 *    ≈ 27 m across, body ≈ 20 m tall) and EneasMx's; white legs to 190 m
 *    (≈ the published 191 m roof), mast to 218 m (published).
 *  - colour: the slab glass reads mid blue with a paler blue grid of
 *    mullions and spandrels (Daniel Manrique, Castillo Vázquez), pulled
 *    light; the drum darker navy, kept a notch darker than the slab. The
 *    drum stays dark at night (Gobierno CDMX night aerial), so it is `glass`.
 *
 * Left out: the convention centre (Centro Internacional de Exposiciones y
 * Convenciones, OSM way/29734490) and the WTC mall (way/29734652) are
 * separate buildings and stay the map's; the Polyforum Siqueiros is its own
 * model. The rooftop dishes and small masts are left out.
 *
 * Terrain: Mapterhorn has no z15 tiles here (tools/terrain.ts 404s); the
 * site is on the flat lake-bed basin (~2,240 m). Modelled level, elevation 0.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - World_Trade_Center_-_Mexico_City.jpg, EneasMx, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:World_Trade_Center_-_Mexico_City.jpg
 *  - Torre_wtc_mexico.jpg, Daniel Manrique, CC BY-SA 3.0
 *    https://commons.wikimedia.org/wiki/File:Torre_wtc_mexico.jpg
 *  - Aerial_view_World_Trade_Center_Mexico_03_2014_MEX_7842.JPG, Mariordo
 *    (Mario Roberto Durán Ortiz), CC BY-SA 3.0
 *    https://commons.wikimedia.org/wiki/File:Aerial_view_World_Trade_Center_Mexico_03_2014_MEX_7842.JPG
 *  - Antena_del_World_Trade_Center_México.JPG, Felipe Alfonso Castillo
 *    Vázquez, CC BY 3.0
 *    https://commons.wikimedia.org/wiki/File:Antena_del_World_Trade_Center_M%C3%A9xico.JPG
 *  - Sobrevuelos_CDMX_HJ2A6040_(39675330524).jpg, Gobierno CDMX, CC0 (dusk)
 *    https://commons.wikimedia.org/wiki/File:Sobrevuelos_CDMX_HJ2A6040_(39675330524).jpg
 *  - WTC_Ciudad_de_México_-_panoramio.jpg, JavierDo, CC BY-SA 3.0
 *    https://commons.wikimedia.org/wiki/File:WTC_Ciudad_de_M%C3%A9xico_-_panoramio.jpg
 * Look-only: none. No commercial imagery.
 *
 * Doubts: the concave north face is OSM's; the photos neither confirm nor
 * contradict it. The neck under the drum and the split of the drum's
 * height are photo estimates. The end service shafts are drawn as OSM's
 * notches in a darker blue, at full height.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { area, cap, lathe, panel, save, triangulate, walls, type XY } from './chi-aon-center'

const ANCHOR: [number, number] = [19.394418, -99.173854]
const BEARING = 13
const POD = 22, ROOF = 145
const DC: XY = [-20.4, 9.3] // drum centre (OSM ways 312315752 / 312329506 / 312329508)

const ccw = (r: XY[]) => (area(r) < 0 ? r.slice().reverse() : r)
// The podium: the tower's outline, way/362824952.
const PODIUM = ccw([[37.71, -49.36], [26.54, -49.43], [-8.87, -49.43], [-8.47, -10.61], [-37.79, -10.4], [-55.99, -10.28], [-75.53, -10.14], [-75.61, 29.37], [-6.13, 29.51], [4.17, 29.54], [13.88, 29.56], [66.3, 29.67], [66.02, -10.26], [37.92, -9.77], [37.7, -45.99]])
// The shaft, way/227708277, from its south-west corner round anticlockwise.
const SHAFT = ccw([[-71.93, -5.38], [56.3, -5.74], [55.78, 15.44], [52.37, 14.59], [52.28, 20.5], [55.63, 21.25], [55.56, 23.89], [51.14, 22.72], [38.28, 20.66], [22.52, 18.82], [9.8, 17.95], [-1.81, 17.43], [-14.54, 17.05], [-27.93, 17.91], [-38.13, 19.12], [-55.32, 21.65], [-72.72, 24.4], [-72.5, 21.87], [-67.17, 21.3], [-67.0, 16.0], [-72.61, 16.11]])

function build() {
  const glass = new Part(), grid = new Part(), drum = new Part(), mast = new Part(), roof = new Part(), pod = new Part()

  // --- Podium.
  walls(pod, PODIUM, 0, POD)
  cap(roof, PODIUM, POD)
  // Its glazed band (the lobby levels), on the long outer walls.
  for (let i = 0; i < PODIUM.length; i++) {
    const a = PODIUM[i], b = PODIUM[(i + 1) % PODIUM.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L > 12) panel(glass, a, b, 1.5, L - 1.5, 4, 14, 0.05)
  }

  // --- The shaft. The notch walls at the ends are the darker service shafts.
  const endNotch = (a: XY, b: XY) => Math.min(Math.abs(a[0]), Math.abs(b[0])) > 50 && Math.max(Math.abs(a[0]), Math.abs(b[0])) < 80 &&
    !(Math.abs(a[1] - b[1]) > 10)
  for (let i = 0; i < SHAFT.length; i++) {
    const a = SHAFT[i], b = SHAFT[(i + 1) % SHAFT.length]
    const p = endNotch(a, b) && Math.hypot(b[0] - a[0], b[1] - a[1]) < 7 ? drum : glass
    p.quad([a[0], a[1], POD], [b[0], b[1], POD], [b[0], b[1], ROOF], [a[0], a[1], ROOF])
  }
  // Parapet coping and the roof, sunk 0.9 m.
  {
    const lo = ROOF - 0.9
    for (const [x, y, z] of triangulate(SHAFT)) roof.tri([SHAFT[x][0], SHAFT[x][1], lo], [SHAFT[y][0], SHAFT[y][1], lo], [SHAFT[z][0], SHAFT[z][1], lo])
    for (let i = 0; i < SHAFT.length; i++) {
      const a = SHAFT[i], b = SHAFT[(i + 1) % SHAFT.length], l = Math.hypot(b[0] - a[0], b[1] - a[1])
      const n: XY = [-(b[1] - a[1]) / l * 0.5, (b[0] - a[0]) / l * 0.5]
      const a2: XY = [a[0] + n[0], a[1] + n[1]], b2: XY = [b[0] + n[0], b[1] + n[1]]
      grid.quad([a[0], a[1], ROOF], [b[0], b[1], ROOF], [b2[0], b2[1], ROOF], [a2[0], a2[1], ROOF])
      grid.quad([b2[0], b2[1], ROOF], [a2[0], a2[1], ROOF], [a2[0], a2[1], lo], [b2[0], b2[1], lo])
      // Pale coping band on the face.
      if (l > 7) panel(grid, a, b, 0, l, ROOF - 1.2, ROOF, 0.05)
    }
  }
  // The pale grid: spandrel lines every three storeys, mullion lines every
  // ~6.4 m, on the long faces and the ends.
  const FL = (ROOF - POD) / 40
  for (let i = 0; i < SHAFT.length; i++) {
    const a = SHAFT[i], b = SHAFT[(i + 1) % SHAFT.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 7) continue
    for (let z = POD + 3 * FL; z < ROOF - 3; z += 3 * FL) panel(grid, a, b, 0, L, z - 0.4, z + 0.4, 0.05)
    const nb = Math.max(1, Math.round(L / 6.4))
    for (let k = 1; k < nb; k++) panel(grid, a, b, (L * k) / nb - 0.3, (L * k) / nb + 0.3, POD, ROOF - 1.2, 0.05)
  }

  // --- The drum: a narrow neck, the drum with a flange at its foot, a
  // narrower cap, then the white crown and the mast.
  lathe(drum, DC[0], DC[1], [[0, ROOF - 0.9], [11, ROOF - 0.9], [11, 148.2], [17.6, 148.2], [19.6, 149], [19.6, 150.2], [19.0, 150.4], [19.0, 168.4], [18.4, 169], [13.8, 169], [13.8, 172.4], [13.2, 173], [0, 173]], 24)
  // Crown: six curved white legs from the cap's rim, gathering at the mast.
  const LEGS = 6, legW = 0.9
  for (let k = 0; k < LEGS; k++) {
    const t = (k / LEGS) * 2 * Math.PI + 0.3
    const c = Math.cos(t), s = Math.sin(t), u: XY = [-s, c]
    const pts: [number, number][] = []
    for (let j = 0; j <= 6; j++) {
      const f = j / 6
      pts.push([9.5 * (1 - f) ** 1.5 + 1.0 * f, 173 + 17 * Math.sin((f * Math.PI) / 2)])
    }
    // A bold square-section member along the curve.
    const sections: V3[][] = pts.map(([r, z]) => {
      const x = DC[0] + c * r, y = DC[1] + s * r, h = legW / 2
      return [[x - u[0] * h - c * h, y - u[1] * h - s * h, z], [x + u[0] * h - c * h, y + u[1] * h - s * h, z], [x + u[0] * h + c * h, y + u[1] * h + s * h, z], [x - u[0] * h + c * h, y - u[1] * h + s * h, z]]
    })
    mast.sweep(sections)
  }
  // Mast: a tapering square lattice drawn as a solid, bold enough to read.
  const mastRing = (h: number, z: number): V3[] => [[DC[0] - h, DC[1] - h, z], [DC[0] + h, DC[1] - h, z], [DC[0] + h, DC[1] + h, z], [DC[0] - h, DC[1] + h, z]]
  mast.loft([mastRing(2.0, 173), mastRing(1.6, 196), mastRing(1.0, 212), mastRing(0.5, 218)])
  mast.cap(mastRing(0.5, 218), true)

  return [
    { part: glass, material: { ...PALETTE.window, color: 0x5f83ab } },
    { part: grid, material: finish('wtc-grid', 0xa9c0d6) },
    { part: drum, material: { ...PALETTE.glass, color: 0x4f6f98 } },
    { part: mast, material: finish('wtc-mast', 0xecebe6) },
    { part: roof, material: PALETTE.roof },
    { part: pod, material: finish('wtc-podium', 0xd9d4ca) },
  ]
}

if (import.meta.main) await save('mexico-city-world-trade-center', 'World Trade Center Mexico City', ANCHOR, BEARING, build(), 5000)
