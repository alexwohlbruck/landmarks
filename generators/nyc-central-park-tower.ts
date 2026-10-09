/**
 * Central Park Tower, 217 West 57th Street (Adrian Smith + Gordon Gill, 2020)
 * — original procedural geometry, CC0-1.0.
 * bun generators/nyc-central-park-tower.ts
 *
 * x = across the Manhattan grid (118.95°), y = up the avenues (28.95°),
 * z = metres up. Anchor is the centroid of OSM way/261509934
 * (40.7664214, -73.9810095); bearing 28.95°, elevation 0. 57th Street is to
 * the south, Broadway's corner to the west, the Art Students League to the
 * east.
 *
 * Evidence
 * - OSM (way/261509934 and its parts, mapped 2022): the Nordstrom base at
 *   44 m (way/1107961654) and a 23 m strip on 58th Street (way/1107961655);
 *   a south block to 127 m (way/1107961656) and a west wing to 163 m
 *   (way/1107961657); the main shaft, 22.4 × 29.3 m, to 466 m
 *   (way/1107961665) with stepped west corners at 237 and 332 m
 *   (way/1107961662, 663, 664); the crown box to 471 m (way/1107961667); and
 *   the cantilever east over the Art Students League from 89 m to 433 m,
 *   its corners stepping at 237, 332 and 342 m (way/1107961658 … 661).
 * - Published (Wikipedia): 472.4 m to the roof; the cantilever projects
 *   28 ft (8.5 m) east, starts about 290 ft (88 m) up, and is set back 80 ft
 *   from the street; Nordstrom fills the base; glass facade by James
 *   Carpenter Design Associates. Topped out 2019, so the 2017 lidar does not
 *   show it and every height here is OSM's or published.
 * - Photos (Wikimedia Commons): Itrytohelp32 "Billionaires' Row 2020"
 *   (CC BY-SA 4.0, from Top of the Rock, south-east); Percival Kestreltail
 *   "Central Park Tower April 2021" (CC BY-SA 3.0, south-east); Jim.henderson
 *   "Central Park Tower & 220 CPS 2020 (2) jeh" (CC BY-SA 4.0, from the
 *   north-east in Central Park); Kidfly182 "Central Park Tower 2025",
 *   "November 2024 009", "September 2024 006" (CC BY 4.0, street level);
 *   Brian W. Schaller "A614, Central Park Tower" (FAL).
 *
 * Read from photos: the blue-grey glass with white stainless fins running up
 * every corner of every volume; dark two-storey mechanical bands across the
 * cantilever (the shaft's own faces show them only faintly), which line up with the cantilever's corner steps
 * (about 160, 230 and 330 m — estimated from the Top of the Rock photo,
 * scaled between the 433 m cantilever top and the 466 m roof); the crown
 * above the cantilever, its glass screen striped by close vertical fins.
 */
import { Part } from './mesh'
import { PALETTE, finish } from './palette'
import { edges, facePanel, prism, rect, save, type XY } from './nyc-432-park'

function build() {
  const glass = new Part(), trim = new Part(), dark = new Part(), base = new Part(), roof = new Part()

  const FLOORS3 = 13.2 // three storeys between the pale floor lines
  const BANDS: [number, number][] = [[159, 167], [228, 237], [328, 337]]

  /**
   * A glass volume: pale corner fins on every face, mullion lines every
   * `bay` metres, floor lines every three storeys, the mechanical bands.
   */
  function volume(r: XY[], z0: number, z1: number, o: { bay?: number; bottom?: boolean; finsAbove?: number; bands?: boolean } = {}) {
    prism(glass, r, z0, z1, { bevel: 0.3, top: roof, bottom: o.bottom })
    for (const [a, b] of edges(r)) {
      const l = Math.hypot(b[0] - a[0], b[1] - a[1])
      // Corner fins.
      facePanel(trim, a, b, 0, Math.min(1.0, l / 4), z0, z1, 0.06)
      facePanel(trim, a, b, l - Math.min(1.0, l / 4), l, z0, z1, 0.06)
      // Mullion lines, closer on the crown screen.
      const lines = (from: number, to: number, bay: number) => {
        const n = Math.round(l / bay)
        for (let i = 1; i < n; i++) facePanel(trim, a, b, (i * l) / n - 0.22, (i * l) / n + 0.22, from, to, 0.05)
      }
      const crown = o.finsAbove ?? Infinity
      lines(z0, Math.min(z1, crown), o.bay ?? 7.5)
      if (z1 > crown) lines(crown, z1, 2.6)
      // Floor lines.
      for (let z = z0 + FLOORS3; z < Math.min(z1, crown) - 2; z += FLOORS3) facePanel(trim, a, b, 0, l, z - 0.25, z + 0.25, 0.045)
      // Mechanical bands.
      if (o.bands) for (const [m0, m1] of BANDS) if (m0 > z0 + 1 && m1 < z1 - 1) facePanel(dark, a, b, 0.9, l - 0.9, m0, m1, 0.07)
    }
  }

  // ---- Nordstrom base, glass with close white fins -------------------------------------
  for (const r of [rect(-16.6, 29.0, -31.8, 24.0), rect(-30.5, -16.6, -17.1, 24.0)]) {
    prism(base, r, 0, 44, { bevel: 0.4, top: roof })
  }
  prism(base, rect(-30.5, 29.0, 24.0, 28.9), 0, 23, { bevel: 0.4, top: roof })
  // The fins, as pale broad pilasters on the street faces, with the
  // shopfront glazing between them at the foot.
  const baseFaces: [XY, XY, number][] = [
    [[-16.6, -31.8], [29.0, -31.8], 44], [[29.0, -31.8], [29.0, 24.0], 44], [[-30.5, 24.0], [-30.5, -17.1], 44],
    [[-30.5, -17.1], [-16.6, -17.1], 44], [[-16.6, -17.1], [-16.6, -31.8], 44], [[29.0, 28.9], [-30.5, 28.9], 23],
  ]
  for (const [a, b, h] of baseFaces) {
    const l = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.round(l / 4.5)), w = l / n
    for (let i = 0; i < n; i++) facePanel(glass, a, b, i * w + 1.1, (i + 1) * w - 1.1, 1.0, h - 2.5)
  }

  // ---- Lower wings ---------------------------------------------------------------------
  volume(rect(6.6, 28.9, -16.3, -8.0), 44, 127)
  volume(rect(-12.4, 6.6, 9.2, 21.3), 44, 163)

  // ---- Main shaft, with stepped west corners -------------------------------------------
  const ROOF = 466, CANT = 433
  volume(rect(11.3, 29.0, -8.0, 21.3), 44, ROOF, { finsAbove: CANT })
  volume(rect(6.6, 11.3, -3.4, 16.5), 44, ROOF, { finsAbove: CANT })
  volume(rect(6.6, 11.3, 16.5, 21.3), 44, 332)
  volume(rect(6.6, 11.3, -8.0, -3.4), 44, 237)
  // Crown box over the roof.
  prism(trim, rect(16.4, 22.6, -0.9, 10.4), ROOF, 471.5, { bevel: 0.3, top: roof })

  // ---- The cantilever over the Art Students League -------------------------------------
  const C0 = 89
  volume(rect(29.0, 37.5, -0.8, 16.5), C0, CANT, { bottom: true, bands: true })
  volume(rect(29.0, 32.6, -7.5, -0.8), C0, CANT, { bottom: true, bands: true })
  volume(rect(32.6, 37.5, -7.5, -0.8), C0, 342, { bottom: true, bands: true })
  volume(rect(29.0, 37.4, 16.5, 18.7), C0, 332, { bottom: true, bands: true })
  volume(rect(29.0, 37.4, 18.7, 21.2), C0, 237, { bottom: true, bands: true })

  return [
    { part: glass, material: { ...PALETTE.window, color: 0x7c95ad } }, // the blue reflective glass, lightened
    { part: trim, material: PALETTE.trim },
    { part: dark, material: finish('mechanical-band', 0x4f565f) },
    { part: base, material: finish('nordstrom-fins', 0xdfe3e4) },
    { part: roof, material: PALETTE.roof },
  ]
}

if (import.meta.main) {
  await save('nyc-central-park-tower', 'Central Park Tower', build(), {
    bearing: 28.95, anchor: [40.7664214, -73.9810095], height: 471.5,
    note: 'Glass shaft with white corner fins, stepped corners and the eastern cantilever; Nordstrom base',
  })
}
