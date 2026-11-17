/**
 * Büyük Çamlıca Mosque (Grand Çamlıca Mosque), Üsküdar, Istanbul:
 * procedural, CC0-1.0. bun generators/istanbul-camlica-mosque.ts
 *
 * Opened 2019 (architects Bahar Mızrak and Hayriye Gül Totu), on Çamlıca
 * hill. A neo-Ottoman box of a prayer hall with a cascade of domes: the
 * squat central dome on a window drum, four semi-domes on window drums over
 * tympanum walls pierced by large lattice arches, four weight turrets at the
 * dome's corners, corner domes and small domes; two-storey porticoes under
 * lean-to roofs on the side walls; six minarets (four of 107.1 m with three
 * şerefes at the hall's corners, two of 90 m with two şerefes at the far
 * corners of the courtyard); the arcaded courtyard with its domed bays,
 * şadırvan and raised gate, on a lower storey that shows on the downhill
 * (north-west) end.
 *
 * Built with the mosque kit exported by generators/istanbul-new-mosque.ts.
 *
 * Frame: x across the axis (towards world 61.6), y along it towards the
 * courtyard (world 331.6, the reverse of the qibla, 151.6), z up; placed
 * with bearing 331.6. Origin at the centroid of the OSM outline
 * (relation/7534888, outer way/520825568), 29.070314, 41.034436.
 *
 * Ground: the hill falls from the hall (south-east) to the courtyard's gate
 * (north-west), where a lower storey (museum, shops) shows under the
 * courtyard (photo p01). The hall and courtyard floors are put at L = 6 m
 * over the lowest ground (estimated from p01: one tall arched storey under
 * the courtyard's north-west end); every wall runs down to z = 0 so the
 * uphill side sinks into the hill. The courtyard floor is drawn as the roof
 * of that lower storey (top face only, inside the arcades). Elevation 0.
 * The terrain check could not run: Mapterhorn has no z15 terrain here.
 *
 * OSM (ODbL), fetched 2026-11: relation/7534888 "Büyük Çamlıca Camii"
 * (outer way/520825568, a 102 x 175 m quadrilateral with the plaza edge;
 * inner way/430037541, the open court, 62.5 x 53.6 m, y 12.3..65.9);
 * minarets way/437761713, 714, 716, 719 (height 107.1) at x +-44, y -78.5
 * and +4.2, and way/437761717, 718 (height 90) at x +-44, y +78; the dome
 * way/437761715 (roof, 33.7 m across, centre y -41.3, 3.6 m west of the
 * court's axis: centred on the axis here, as the photos show a symmetric
 * mosque); the şadırvan's round roof way/725800952 (14 m across, centre
 * y 36). The relation's height tag (30) is the hall's walls at best.
 *
 * Published (Wikipedia en "Çamlıca Mosque"; Wikidata Q18341384, height
 * 107.1): main dome 72 m high, 34 m across; finial 7.77 m high; four
 * minarets of 107.1 m with three balconies, two of 90 m with two.
 *
 * Measured from photos. p02 (CC0, from the Galata Tower, 9 km west, long
 * telephoto, nearly level) is the ruler. Its six minaret tips agree with
 * 107.1 and 90 m on one base line and 6.45 px/m (crop px); the view is 68
 * degrees off the axis (from the minaret pair spacings, 88 m across and
 * 74 / 82.5 m along the axis). Over the floor:
 * - dome crown 71.8 m (published 72), dome base 62.5 m, window drum
 *   57-62.5 m; dome drawn 33 m across on a 35 m drum (p02 reads the outer
 *   dome about 28-31 m; the published 34 m span and OSM's 33.7 m roof
 *   are preferred), finial to 78 m;
 * - semi-domes 24 m across, window ring 44.5-48.5 m, crown 55.8 m; under
 *   each a tympanum wall with the big lattice arch, 32-43 m;
 * - weight turrets to 57.5 m; corner domes to 42.5 m; small domes 33-35 m;
 * - hall cornice 30 m; side porticoes' lean-to roofs about 21 m;
 * - minarets: şerefes at 47.3, 63 and 79 m, cap base 91 m, tip 107.1 m;
 *   the 90 m pair at 45.4 and 62 m, cap base 75 m;
 * - courtyard arcade cornice 13 m over the floor (p03: the gate front is
 *   about 12.5 m, measured against its 2 m windows); domes to 16 m; gate
 *   to 18 m.
 * Estimated: hall plan x +-38, y -84..4 (the minarets stand at its corners
 * in p01, p04 and p05); courtyard outer walls x +-39, y 4..74 (OSM's open
 * court plus 8 m arcades).
 * Invented / simplified: window counts (grouped, one panel per real
 * window or pair); the many small domes reduced to twelve round the
 * cascade plus the courtyard's 30; the porticoes' arches.
 *
 * Minarets drawn 5 m across (the real concrete shafts read about 3.4 m in
 * p02, so about 1.5x), with bold şerefe rings.
 *
 * Colours from daylight photos pulled to the palette: near-white cream
 * stone (#ece6da), blue-grey lead (#8e9aab, bluer than the old mosques'),
 * gilt finials, and the red-and-white voussoirs of the courtyard arches as
 * a muted red ring (#c79484) round lattice panels. Night: the mosque is
 * floodlit white, so stone and lead carry _FLOODLIGHT; windows glow.
 *
 * Photos (EVIDENCE, Wikimedia Commons):
 * - p01 "Çamlıca Mosque.jpg", Kingbjelica, CC BY-SA 4.0 (panorama from the
 *   east-north-east: hall side, porticoes, courtyard over its lower storey)
 *   https://commons.wikimedia.org/wiki/File:%C3%87aml%C4%B1ca_Mosque.jpg
 * - p02 "Çamlıca Mosque viewed from Galata Tower.jpg", Julian Lupyan, CC0
 *   (from the west, telephoto; the ruler)
 *   https://commons.wikimedia.org/wiki/File:%C3%87aml%C4%B1ca_Mosque_viewed_from_Galata_Tower.jpg
 * - p03 "Istanbul Big Çamlıca Mosque View from NW in 2019 2036.jpg",
 *   Dosseman, CC BY-SA 4.0 (the courtyard gate front)
 *   https://commons.wikimedia.org/wiki/File:Istanbul_Big_%C3%87aml%C4%B1ca_Mosque_View_from_NW_in_2019_2036.jpg
 * - p04 "Istanbul Big Çamlıca Mosque View from SW in 2019 2021.jpg",
 *   Dosseman, CC BY-SA 4.0 (the west side portico and minarets)
 *   https://commons.wikimedia.org/wiki/File:Istanbul_Big_%C3%87aml%C4%B1ca_Mosque_View_from_SW_in_2019_2021.jpg
 * - p05 "Camlica-2018-06-14.jpg", Håkan Henriksson (Narking), CC BY-SA 4.0
 *   (from the north-west, far: all six minarets, the cascade)
 *   https://commons.wikimedia.org/wiki/File:Camlica-2018-06-14.jpg
 * - p06 "Çamlıca Mosque front view.jpg", Mondo79, CC BY 2.0 (the hall's
 *   courtyard front and the cascade from the courtyard)
 *   https://commons.wikimedia.org/wiki/File:%C3%87aml%C4%B1ca_Mosque_front_view.jpg
 * Look-only: none.
 *
 * Doubts: heights are photo-scaled (no lidar in Turkey); the floor level L
 * and the slope are estimated; the rear (qibla) wall has no close photo and
 * repeats the side walls; the dome's outer diameter (p02 reads it smaller
 * than published).
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { MosqueKit, prism, rect, circle, poly, panel, windowRow, revolve, lit, TAU, type XY, type MinaretSpec } from './istanbul-new-mosque'

export function build() {
  const stone = new Part(), lead = new Part(), win = new Part(), gilt = new Part(), red = new Part()
  const K = new MosqueKit(stone, lead, win, gilt)

  const L = 6 // floor over the lowest ground
  const HX = 38, HY0 = -84, HY1 = 4 // hall
  const CY = -40 // dome centre
  const WALL = L + 30 // hall cornice
  const CXo = 39, CY1 = 74 // courtyard outer walls
  const CXi = 31, CYi0 = 12.3, CYi1 = 65.9 // open court (OSM)
  const CT = L + 13 // courtyard arcade cornice

  // ---- Hall box.
  prism(stone, rect(-HX, HX, HY0, HY1, 0.6), 0, WALL - 1, false)
  prism(stone, rect(-HX - 0.4, HX + 0.4, HY0 - 0.4, HY1 + 0.4, 0.9), WALL - 1, WALL + 0.6, false)
  poly(stone, rect(-HX - 0.4, HX + 0.4, HY0 - 0.4, HY1 + 0.4, 0.9).map(([x, y]) => [x, y, WALL + 0.6] as V3), [0, 0, 1])

  // Hall windows: side and rear walls, grouped in rows.
  const walls: Array<{ a: XY; b: XY; n: XY }> = [
    { a: [HX, HY1], b: [HX, HY0], n: [1, 0] },
    { a: [-HX, HY0], b: [-HX, HY1], n: [-1, 0] },
    { a: [HX, HY0], b: [-HX, HY0], n: [0, -1] },
  ]
  for (const { a, b, n } of walls) {
    const side = n[1] === 0
    // the middle third of the side walls carries the portico
    const skipMid = (k: number) => side && k >= 3 && k <= 6
    windowRow(win, a, b, 10, 2.4, L + 1.6, L + 4.6, n, false, skipMid)
    windowRow(win, a, b, 10, 2.4, L + 7.2, L + 11.6, n, false, skipMid)
    // upper groups: three tall lights in each of the big arched bays
    for (const [t0, t1] of [[0.08, 0.36], [0.64, 0.92]] as const) {
      const f = (t: number): XY => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
      windowRow(win, f(t0), f(t1), 3, 2.6, L + 16, L + 24.5, n, true)
      panel(win, f((t0 + t1) / 2 - 0.035), f((t0 + t1) / 2 + 0.035), L + 25.6, L + 28, n, true)
    }
    if (!side) windowRow(win, [a[0] * 0.25, a[1]], [b[0] * 0.25, b[1]], 3, 2.6, L + 16, L + 24.5, n, 'pointed')
  }
  // Front wall over the courtyard's arcade.
  windowRow(win, [-HX, HY1], [HX, HY1], 8, 2.4, CT + 2.5, WALL - 3.5, [0, 1], 'pointed', (k) => k === 3 || k === 4)

  // Side porticoes: two storeys of open arches under a lead lean-to.
  for (const s of [-1, 1]) {
    const x0 = s * HX, x1 = s * (HX + 4.5), ya = -55, yb = -25
    const n: XY = [s, 0]
    const a: XY = s > 0 ? [x1, yb] : [x1, ya], b: XY = s > 0 ? [x1, ya] : [x1, yb]
    K.arcade(a, b, 6, L + 6, L + 9.5, n, 1.0, 1.0, 0, 4)
    prism(stone, rect(Math.min(x1, x1 - s * 1.0), Math.max(x1, x1 - s * 1.0), ya, yb), L + 9.5, L + 18.5, false)
    windowRow(win, a, b, 6, 2.6, L + 11.5, L + 17, n, 'pointed')
    // floor slab between the storeys and end walls
    prism(stone, rect(Math.min(x0, x1), Math.max(x0, x1), ya, yb), L + 9.5, L + 10.3, true)
    for (const y of [ya, yb]) prism(stone, rect(Math.min(x0, x1), Math.max(x0, x1), y - 0.6, y + 0.6), 0, L + 18.5, false)
    prism(stone, rect(Math.min(x0, x1), Math.max(x0, x1), ya, yb), 0, L, true)
    K.lean(Math.min(x0, x1) - (s < 0 ? 1.2 : 0), Math.max(x0, x1) + (s > 0 ? 1.2 : 0), ya - 0.8, yb + 0.8, L + 21, L + 19, s > 0 ? '-x' : '+x', 0.5)
  }

  // ---- The cascade.
  // Tympanum blocks under the four semi-domes, each with its lattice arch.
  const SD = 17.5, SR = 12
  const dirs: Array<[XY, number]> = [[[0, 1], Math.PI / 2], [[0, -1], -Math.PI / 2], [[1, 0], 0], [[-1, 0], Math.PI]]
  // a second tier over the hall roof that the cascade stands on
  prism(stone, rect(-30.5, 30.5, CY - 30.5, CY + 30.5, 1.2), WALL, L + 33.5, true)
  // the central square under the drum
  prism(stone, rect(-SD - 1, SD + 1, CY - SD - 1, CY + SD + 1), WALL, L + 44.5, true)
  for (const [d, ang] of dirs) {
    const c: XY = [d[0] * SD, CY + d[1] * SD]
    const o: XY = [d[0] * (SD + SR), CY + d[1] * (SD + SR)] // outer face centre
    const t: XY = [-d[1], d[0]] // along the face
    const ring: XY[] = [
      [c[0] - t[0] * SR, c[1] - t[1] * SR], [o[0] - t[0] * SR, o[1] - t[1] * SR],
      [o[0] + t[0] * SR, o[1] + t[1] * SR], [c[0] + t[0] * SR, c[1] + t[1] * SR],
    ]
    const area = ring.reduce((s, p, i) => { const q = ring[(i + 1) % 4]; return s + p[0] * q[1] - q[0] * p[1] }, 0)
    prism(stone, area > 0 ? ring : ring.slice().reverse(), WALL, L + 44.5, true)
    // the big lattice arch on the outer face
    panel(win, [o[0] - t[0] * 7, o[1] - t[1] * 7], [o[0] + t[0] * 7, o[1] + t[1] * 7], L + 31.5, L + 43, d, 'pointed', 0.06)
    K.semidome(c, SR, ang, L + 44.5, L + 48.5, L + 55.8, 8, true)
    // small domes in front of the tympanum (exedrae)
    const f = SD + SR + 4.9
    K.dome(d[0] * f, CY + d[1] * f, 3.5, WALL + 0.6, 3.2, 8, 2, 0, false)
    for (const s of [-1, 1]) K.dome(d[0] * (f - 0.4) + t[0] * s * 10.5, CY + d[1] * (f - 0.4) + t[1] * s * 10.5, 2.9, WALL + 0.6, 2.6, 8, 2, 0, false)
  }
  // Main drum and dome.
  K.drum(0, CY, 17.5, L + 44.5, L + 62.5, 20, { every: 1, frac: 0.5, wz0: L + 57.6, wz1: L + 61.8, arch: false })
  K.dome(0, CY, 16.5, L + 62.5, 9.3, 20, 5, 0, true)
  // the large finial (7.8 m published)
  revolve(gilt, 0, CY, [[0.7, L + 71.6], [1.0, L + 73], [0.5, L + 74.5], [0.9, L + 75.6], [0.3, L + 77.2], [0, L + 78]], 8)
  // Weight turrets at the dome's corners.
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
    const x = sx * (SD + 1.2), y = CY + sy * (SD + 1.2)
    prism(stone, circle(x, y, 2.6, 8, Math.PI / 8), L + 44.5, L + 55, false)
    K.dome(x, y, 2.6, L + 55, 2.4, 8, 2, 0, false)
  }
  // Corner domes on drums over the hall's corner bays.
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
    const x = sx * 25, y = CY + sy * 25
    K.drum(x, y, 5.6, L + 33.5, L + 38, 10, { every: 2, frac: 0.5, wz0: L + 35, wz1: L + 37.6, arch: true })
    K.dome(x, y, 5.4, L + 38, 5.2, 10, 2, 0, false)
  }

  // ---- Courtyard.
  // Outer walls (to the ground), arcade roof, floor.
  const wallT = 1.2
  prism(stone, rect(-CXo, -CXo + wallT, HY1, CY1, 0), 0, CT, false)
  prism(stone, rect(CXo - wallT, CXo, HY1, CY1, 0), 0, CT, false)
  prism(stone, rect(-CXo, CXo, CY1 - wallT, CY1, 0), 0, CT, false)
  for (const r of [rect(-CXo, -CXi, HY1, CY1), rect(CXi, CXo, HY1, CY1), rect(-CXi, CXi, HY1, CYi0), rect(-CXi, CXi, CYi1, CY1)]) {
    prism(stone, r, CT - 1, CT, true, true)
  }
  // cornice lip on the outer edge
  prism(stone, rect(-CXo - 0.4, -CXo + 0.6, HY1, CY1 + 0.4), CT - 0.6, CT + 0.5, true)
  prism(stone, rect(CXo - 0.6, CXo + 0.4, HY1, CY1 + 0.4), CT - 0.6, CT + 0.5, true)
  prism(stone, rect(-CXo + 0.6, CXo - 0.6, CY1 - 0.6, CY1 + 0.4), CT - 0.6, CT + 0.5, true)
  poly(stone, ([[-CXi, CYi0], [CXi, CYi0], [CXi, CYi1], [-CXi, CYi1]] as XY[]).map(([x, y]) => [x, y, L] as V3), [0, 0, 1])
  // Inner arcades facing the court.
  K.arcade([-CXi, CYi1], [-CXi, CYi0], 6, L + 7.2, CT - 1, [1, 0], 1.1, 1.0, L, 4)
  K.arcade([CXi, CYi0], [CXi, CYi1], 6, L + 7.2, CT - 1, [-1, 0], 1.1, 1.0, L, 4)
  K.arcade([-CXi, CYi0], [CXi, CYi0], 7, L + 7.2, CT - 1, [0, 1], 1.1, 1.0, L, 4)
  K.arcade([CXi, CYi1], [-CXi, CYi1], 7, L + 7.2, CT - 1, [0, -1], 1.1, 1.0, L, 4)
  // Domes over the arcade bays.
  const bayDome = (x: number, y: number) => K.dome(x, y, 3.4, CT, 2.6, 8, 2, 0, false)
  for (const s of [-1, 1]) for (let k = 0; k < 6; k++) bayDome(s * (CXi + CXo) / 2, CYi0 + ((CYi1 - CYi0) * (k + 0.5)) / 6)
  for (const y of [(HY1 + CYi0) / 2, (CYi1 + CY1) / 2]) {
    for (let k = 0; k < 7; k++) bayDome(-CXi + ((2 * CXi) * (k + 0.5)) / 7, y)
    for (const s of [-1, 1]) bayDome(s * (CXi + CXo) / 2, y)
  }
  // Outer faces: lower storey windows and the red-and-white arches above.
  const outer: Array<{ a: XY; b: XY; n: XY; count: number }> = [
    { a: [CXo, HY1 + 2], b: [CXo, CY1 - 2], n: [1, 0], count: 7 },
    { a: [-CXo, CY1 - 2], b: [-CXo, HY1 + 2], n: [-1, 0], count: 7 },
  ]
  for (const { a, b, n, count } of outer) {
    windowRow(red, a, b, count, 7.6, L + 6.4, CT - 1.2, n, true)
    windowRow(win, a, b, count, 6.2, L + 7.0, CT - 1.9, n, true)
  }
  // Gate front (north-west end): two bays of arches each side of the portal.
  for (const s of [-1, 1]) {
    const a: XY = [s * 9.5, CY1], b: XY = [s * (CXo - 1.5), CY1]
    windowRow(red, a, b, 3, 7.4, L + 6.4, CT - 1.2, [0, 1], true)
    windowRow(win, a, b, 3, 6.0, L + 7.0, CT - 1.9, [0, 1], true)
  }
  // The raised gate block with its deep arch.
  prism(stone, rect(-8.5, 8.5, CY1 - 2, CY1 + 2.5, 0.4), 0, L + 17.5, true)
  prism(stone, rect(-9, 9, CY1 - 2.3, CY1 + 2.9, 0.5), L + 17, L + 18, true)
  panel(win, [-4.2, CY1 + 2.5], [4.2, CY1 + 2.5], L, L + 13, [0, 1], 'pointed', 0.06)
  for (const s of [-1, 1]) panel(win, [s * 5.4, CY1 + 2.5], [s * 7.4, CY1 + 2.5], L + 5, L + 8.5, [0, 1], false, 0.06)

  // Şadırvan: columns, a broad lead canopy and a dome.
  {
    const c: XY = [0, 37.5]
    for (let k = 0; k < 8; k++) {
      const a = (k * TAU) / 8 + TAU / 16
      prism(stone, circle(c[0] + 4.8 * Math.cos(a), c[1] + 4.8 * Math.sin(a), 0.45, 4), L, L + 4.6, false)
    }
    revolve(lead, c[0], c[1], [[7.2, L + 4.4], [7.2, L + 4.9], [5.2, L + 5.8]], 12)
    poly(lead, circle(c[0], c[1], 7.2, 12).map(([x, y]) => [x, y, L + 4.4] as V3), [0, 0, -1])
    prism(stone, circle(c[0], c[1], 5.2, 12), L + 5.8, L + 7.4, false)
    K.dome(c[0], c[1], 5.0, L + 7.4, 3.6, 10, 2, 0, false)
  }

  // ---- Minarets.
  const tall: MinaretSpec = { R: 2.5, pedHalf: 3.6, ped: L + 18, balconies: [L + 47.3, L + 63, L + 79], capBase: L + 91, capTip: L + 105.2, alem: 1.9, n: 8, base: 0, ring: 1.3 }
  const short: MinaretSpec = { R: 2.4, pedHalf: 3.5, ped: L + 15, balconies: [L + 45.4, L + 62], capBase: L + 75, capTip: L + 88.2, alem: 1.8, n: 8, base: 0, ring: 1.25 }
  for (const s of [-1, 1]) {
    K.minaret(s * 44, -78.5, tall)
    K.minaret(s * 44, 4.2, tall)
    K.minaret(s * 44, 78, short)
  }

  return [
    { part: stone, material: { ...finish('limestone', 0xece6da), floodlight: lit(0.9) } },
    { part: lead, material: { ...finish('lead', 0x8e9aab), floodlight: () => 0.85 } },
    { part: win, material: PALETTE.window },
    { part: gilt, material: { ...finish('gilt', 0xcfa94f), floodlight: () => 0.8 } },
    { part: red, material: { ...finish('ablaq-red', 0xc79484), floodlight: () => 0.7 } },
  ]
}

if (import.meta.main) {
  const parts = build()
  const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
  for (const { part, material } of parts) console.log(material.name, part.triangles)
  if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
  const glb = writeGlb('Büyük Çamlıca Mosque', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
    bearing: 331.6, elevation: 0, height: 113.1,
  })
  if (glb.length > 250_000) throw new Error(`Size budget exceeded: ${glb.length} bytes`)
  const out = new URL('../models/istanbul-camlica-mosque.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}
