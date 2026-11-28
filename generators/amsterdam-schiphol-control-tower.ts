/**
 * Schiphol control tower (Verkeerstoren Schiphol-Centrum), Amsterdam Airport
 * Schiphol: the 101 m air-traffic-control tower of 1991 beside the terminal
 * — procedural, CC0-1.0, no textures.
 * bun generators/amsterdam-schiphol-control-tower.ts
 *
 * Which tower: OSM node/247334421 ("Controltower Schiphol Centre",
 * aeroway=tower, service=aircraft_control, height 101.17, wikidata
 * Q2052814), the main ATC tower in service. The 1967 tower on the old
 * terminal building 130 m to the east (node/7515014670, "Oude
 * verkeerstoren", disused, building:parts way/515330414–418) and Schiphol
 * Tower West by the Polderbaan are other towers and are not modelled.
 *
 * Map frame: x = east, y = north, z up, metres; bearing 0. Anchor: the tower
 * node (the shaft's axis is within 0.3 m of it in the OSM parts).
 *
 * Identifying features (photos): a plain white round shaft with one column
 * of small windows up one side; a wide drum-shaped head that flares out from
 * the shaft in a conical skirt, then a band of teal glazing between two dark
 * grey bands, then a taller white drum that tapers in to a flat roof; on it
 * a small octagonal cab with outward-leaning teal glazing and a white roof;
 * a white faceted radome ball on top. At the foot a dark, nearly black
 * low pavilion wraps round the shaft.
 *
 * Evidence
 * - OSM building:parts (all replaced): way/515330421 shaft 0–65 m
 *   (r 4.7); way/241077084 head 65–85 m (r 12.7); way/515354374 deck
 *   85–86 m (r 8.1); way/515330420 cab 86–96 m (octagon, r 6.8);
 *   way/515330419 radome 96–101 m (r 3.2, roof:shape dome); the base
 *   pavilion way/268643506 with its part way/516989638 (height 11).
 * - Published: 101 m, opened 1991 (Wikipedia nl "Schipholtoren"; OSM
 *   height 101.17).
 * - Photos (Wikimedia Commons):
 *   https://commons.wikimedia.org/wiki/File:Schiphol_Tower.jpg (Ikreis,
 *     CC BY-SA 4.0) from high to the north: head, cab, radome, the window
 *     column, the dark pavilion at the foot; profile radii read from it;
 *   https://commons.wikimedia.org/wiki/File:140823-Schiphol-airport-tower.jpg
 *     (Krzysztof Maria Różański, CC BY-SA 3.0) the head close up from below:
 *     the skirt, the bands and the cab; heights of the head's stages;
 *   https://commons.wikimedia.org/wiki/File:De_Schipholtoren_2026.png
 *     (Deerpeter, CC BY-SA 4.0) head and cab colours in sun;
 *   https://commons.wikimedia.org/wiki/File:Schiphol_tower.JPG and
 *     https://commons.wikimedia.org/wiki/File:Schiphol_tower_2.JPG (Ad
 *     Meskens, CC BY-SA 3.0) the shaft;
 *   https://commons.wikimedia.org/wiki/File:Schiphol_Airport_Schipholtoren_from_the_observation_deck.jpg
 *     (Ymblanter, CC BY-SA 4.0) the window column;
 *   https://commons.wikimedia.org/wiki/File:SCHIPHOL_CONTROL_TOWER_,_PIER_D_-_panoramio.jpg
 *     and https://commons.wikimedia.org/wiki/File:SCHIPHOL_PIER_E_-_panoramio.jpg
 *     (Kayhan ERTUGRUL, CC BY-SA 3.0) the tower over the terminal from the
 *     apron (proportions);
 *   https://commons.wikimedia.org/wiki/File:Schiphol_main_control_tower.JPG
 *     (Supercarwaar, CC BY-SA 3.0) from the approach road;
 *   https://commons.wikimedia.org/wiki/File:Schiphol_Plaza.jpg (Steven Lek,
 *     CC BY-SA 4.0) at night: the lit shaft foot and the cab.
 * - Terrain: Mapterhorn z14 flat (±0.5 m; the airport is about 3 m below
 *   sea level, but flat).
 * - No lidar (the Netherlands' AHN exists, but there is no repo tool; 3D BAG
 *   is a 3D city model and is not used).
 *
 * Numbers: overall stages from OSM (published total 101 m); inside the head
 * (65–85.5 m) the split is estimated from the photos: a long, slightly
 * convex skirt 65–71.5 (r 4.7 to 10.8), lower dark band 71.5–72.3, glazing
 * 72.3–77.6 leaning out from r 11.2 to 12.2, upper dark band 77.6–78.6,
 * upper drum 78.6–85.5 tapering from r 12.9 to 11.4. The cab's glazing 87–92.8 m leaning out from r 5.9 to 6.8, roof
 * 92.8–94; the radome r 3.4 on a short neck, top 101 (published). The
 * window column 1.3 m wide, from 12 to 62 m, facing north (its side
 * estimated: Ikreis's photo, taken from the north, shows it). The base
 * pavilion at its OSM height of 11 m.
 * Doubts: the exact facet count of the cab (OSM and the photos agree on
 * eight sides); the window column's compass side; the thin antenna mast on
 * the head is left out. Night: the head's and the cab's glazing are
 * `window` (lit), as in Lek's night photo.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, quadN, unit, capPoly } from './nyc-570-lexington'
import { prismRing, writeLod } from './tokyo-haneda-terminal-1'

/** A surface of revolution about the z axis through (0,0). Profile [r, z]; smooth unless n ≤ 8. */
function lathe(p: Part, prof: [number, number][], n: number, smooth = n > 8, phase = 0) {
  const ang = (i: number) => phase + (2 * Math.PI * i) / n
  for (let k = 0; k < prof.length - 1; k++) {
    const [r0, z0] = prof[k], [r1, z1] = prof[k + 1]
    if (Math.abs(r0 - r1) < 1e-6 && Math.abs(z0 - z1) < 1e-6) continue
    const dr = r1 - r0, dz = z1 - z0
    for (let i = 0; i < n; i++) {
      const a = ang(i), b = ang(i + 1)
      const P = (r: number, z: number, t: number): V3 => [r * Math.cos(t), r * Math.sin(t), z]
      if (smooth) {
        const N = (t: number): V3 => unit([dz * Math.cos(t), dz * Math.sin(t), -dr])
        quadN(p, P(r0, z0, a), P(r0, z0, b), P(r1, z1, b), P(r1, z1, a), [N(a), N(b), N(b), N(a)])
      } else {
        quadN(p, P(r0, z0, a), P(r0, z0, b), P(r1, z1, b), P(r1, z1, a))
      }
    }
  }
}
const disc = (p: Part, r: number, z: number, n: number, up = true, phase = 0) =>
  capPoly(p, Array.from({ length: n }, (_, i) => [r * Math.cos(phase + (2 * Math.PI * i) / n), r * Math.sin(phase + (2 * Math.PI * i) / n)] as XY), z, up)

const BASE: XY[] = [[-2.0, -14.7], [-2.6, -25.0], [-19.9, 2.7], [-0.3, 14.9], [-0.5, 12.5], [5.6, 11.3], [10.6, 7.2], [13.1, 1.2], [12.5, -5.3], [8.8, -10.7], [1.1, -14.4]]

function build(detail: boolean) {
  const white = new Part(), win = new Part(), band = new Part(), base = new Part(), roof = new Part()
  const N = detail ? 36 : 28
  const R = 4.7

  // --- shaft ---
  lathe(white, [[R, 0], [R, 65]], N)
  // the window column up the north side: grouped panels in a slightly darker inset strip
  {
    const w = 0.65, y = (x: number) => Math.sqrt(R * R - x * x) + 0.05
    const rows = detail ? 10 : 6, z0 = 12, z1 = 62, h = (z1 - z0) / rows
    for (let k = 0; k < rows; k++) {
      const a = z0 + k * h + 0.8, b = z0 + (k + 1) * h - 0.8
      const n: V3 = [0, 1, 0]
      quadN(win, [w, y(w), a], [-w, y(-w), a], [-w, y(-w), b], [w, y(w), b], [n, n, n, n])
    }
  }

  // --- head ---
  lathe(white, [[R, 65], [7.6, 68.4], [10.8, 71.5]], N) // skirt, a long slightly convex cone
  lathe(band, [[10.8, 71.5], [10.9, 72.3]], N)        // lower dark band
  disc(band, 11.2, 72.3, N, false)
  lathe(win, [[11.2, 72.3], [12.2, 77.6]], N)          // glazing, leaning out
  disc(band, 12.5, 77.6, N, false)
  lathe(band, [[12.5, 77.6], [12.5, 78.6]], N)         // upper dark band
  disc(white, 12.9, 78.6, N, false)
  lathe(white, [[12.9, 78.6], [12.9, 79.6], [11.4, 85.5]], N) // upper drum, tapering in
  disc(roof, 11.4, 85.5, N)
  // the deck parapet ring (OSM 85–86)
  lathe(white, [[8.1, 85.5], [8.1, 86.3]], N)
  disc(white, 8.1, 86.3, N)

  // --- cab: octagon, glazing leaning out ---
  const ph = Math.PI / 8
  lathe(white, [[5.7, 86.3], [5.7, 87]], 8, false, ph)
  disc(white, 5.95, 87, 8, true, ph)
  lathe(win, [[5.9, 87], [6.8, 92.8]], 8, false, ph)
  disc(white, 6.95, 92.8, 8, false, ph)
  lathe(white, [[6.95, 92.8], [6.95, 94]], 8, false, ph)
  disc(roof, 6.95, 94, 8, true, ph)
  // radome on a short neck
  lathe(white, [[1.6, 94], [1.6, 94.6]], 10)
  const rr = 3.4, zc = 101 - rr, rings = detail ? 10 : 7
  const sph: [number, number][] = []
  for (let i = 0; i <= rings; i++) { const t = -Math.PI / 2 + 0.35 + ((Math.PI - 0.35) * i) / rings; sph.push([rr * Math.cos(t), zc + rr * Math.sin(t)]) }
  sph[sph.length - 1] = [0, 101]
  disc(white, sph[0][0], sph[0][1], detail ? 16 : 12, false)
  lathe(white, sph, detail ? 16 : 12, true)

  // --- base pavilion, dark ---
  prismRing(base, BASE, 0, 11, roof)
  return [
    { part: white, material: finish('ams-tower-white', 0xdcddd9) },
    { part: win, material: { name: 'window', color: 0x6c9296, roughness: 0.35 } },
    { part: band, material: finish('ams-tower-band', 0x6e747a) },
    { part: base, material: finish('ams-tower-base', 0x4f5359) },
    { part: roof, material: PALETTE.roof },
  ]
}

if (import.meta.main) {
  const extras = { bearing: 0, osm: 'node/247334421', height: 101 }
  writeLod('Schiphol control tower', 'amsterdam-schiphol-control-tower.glb', build(false), extras, 5000, 250_000)
}
