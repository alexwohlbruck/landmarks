/**
 * Symphony Towers, San Diego — 750 B Street (1989; office tower over
 * Copley Symphony Hall, which keeps its own OSM building and is not drawn).
 *
 * Identity: a tall rose-granite slab, 67 × 30 m, its granite pierced by
 * small square windows, cut by broad recessed bays of dark reflective glass
 * — one in the middle of each long face that rises above the roof line,
 * and one near each end whose top steps down — so the top reads as a
 * stepped, notched silhouette.
 *
 * Frame: bearing 0 (the outline runs 0.2°/90.2°). Map frame x east, y
 * north, z up, metres; origin at the anchor (−117.1578641, 32.7180549), the
 * centroid of OSM way/31846117; z = 0 the lowest street under the
 * footprint (B Street on the south, 2.0 m above the lidar box's ground_min;
 * the ground rises ≈ 4 m to the north).
 *
 * Sources
 * - OSM way/31846117 (building=commercial, "Symphony Towers", 34 levels,
 *   height 152, colour #b19a9a). © OSM contributors. The plan's note of
 *   parts way/1329699394/…395 does not hold: 1329699394 is a part of the
 *   hotel to the east, and nothing else lies inside this outline.
 * - USGS 3DEP lidar CA_SanDiegoQL2_2014 (flown 2014), 1 m grid, above z = 0:
 *   main roof 128.8 m; the middle bay and roof centre 131.3 m (a few returns
 *   to 132.9); the end bays' tops 123.9 m on the long faces.
 * - Published height 152 m / 499 ft (Wikipedia, OSM). No lidar return or
 *   photo shows anything above ≈ 133 m, so the model stops at the lidar.
 * Photos (evidence):
 * - "ImperialSymphonyTowersSD.jpeg", Gateman1997, CC BY-SA 4.0,
 *   https://commons.wikimedia.org/wiki/File:ImperialSymphonyTowersSD.jpeg
 *   (the whole tower, right, sunny: granite and glass bays, the stepped top).
 * - "Symphony Towers San Diego.jpg", Coolcaesar, CC BY-SA 3.0,
 *   https://commons.wikimedia.org/wiki/File:Symphony_Towers_San_Diego.jpg
 *   (looking up: punched granite, recessed glass bays, the glass top steps).
 * - "SymphonyTowersSanDiegoDec06.jpg", Allan Ferguson, CC BY 2.0,
 *   https://commons.wikimedia.org/wiki/File:SymphonyTowersSanDiegoDec06.jpg
 *   (granite colour, the base over Copley Symphony Hall).
 * - "Core-Columbia, San Diego, CA, USA - panoramio (38)/(39).jpg", Roman
 *   Eugeniusz, CC BY-SA 3.0 (the base and the hall's entrance).
 *
 * Numbers
 * - Bays: middle glass bay 15 m wide rising to the raised roof centre (27 m
 *   wide in the lidar), end glass bays 7.5 m whose tops step down to the
 *   lidar's 123.9 m, granite between — widths estimated from Gateman1997's
 *   and Coolcaesar's photos, made symmetric. Glass recessed 1.2 m
 *   (estimated); the real bays fold in a sawtooth, drawn flat here.
 * - Storeys ≈ 3.8 m (34 levels); granite windows one panel per 3 m bay over
 *   two storeys; glass mullion lines every 4 storeys and 4.5 m (estimated).
 * - Colours from the sunny photos, pulled to the palette's lightness: rose
 *   granite, dark blue-grey glass.
 *
 * Doubts
 * - The end (east and west) faces: drawn granite with a middle glass bay
 *   from the one oblique view (Coolcaesar).
 * - A lit crown outline was described to us; no licensed photo shows one
 *   that could be identified as this tower, so nothing is lit but the
 *   windows.
 * - The 152 m height is not supported by the lidar or the photos.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { qf, cbox, rect, save } from './dc-white-house'

const gr = new Part(), win = new Part(), glass = new Part(), mull = new Part(), roof = new Part(), lobby = new Part()

const HX = 33.5, HY = 15.1, REC = 1.2
const ROOF = 128.8, MID = 131.3, NOTCH = 123.9, LOBBY = 7.6
const ST = 3.8

// Along a long face: [x0, x1, kind, top].
type Seg = [number, number, 'g' | 'v', number]
const SEGS: Seg[] = [
  [-HX, -28.5, 'g', ROOF], [-28.5, -21.0, 'v', NOTCH], [-21.0, -7.5, 'g', ROOF],
  [-7.5, 7.5, 'v', MID], [7.5, 21.0, 'g', ROOF], [21.0, 28.5, 'v', NOTCH], [28.5, HX, 'g', ROOF],
]

// Core: everything but the outer 1.2 m of the long faces.
cbox(gr, rect(-HX, HX, -HY + REC, HY - REC), 0, ROOF, { b: 0.4, top: roof })
// The raised centre of the roof (lidar), granite.
cbox(gr, rect(-13.5, 13.5, -HY + REC, HY - REC), ROOF, MID, { b: 0.3, top: roof })

function glassWall(P: (u: number, z: number) => V3, n: V3, u0: number, u1: number, z0: number, z1: number) {
  qf(glass, P(u0, z0), P(u1, z0), P(u1, z1), P(u0, z1), n)
  // Faint mullion lines: verticals every ≈ 4.5 m, floor lines every 4 storeys.
  const out = (u: number, z: number): V3 => { const p = P(u, z); return [p[0] + n[0] * 0.05, p[1] + n[1] * 0.05, z] }
  const k = Math.max(1, Math.round((u1 - u0) / 4.5))
  for (let i = 1; i < k; i++) {
    const u = u0 + ((u1 - u0) * i) / k
    qf(mull, out(u - 0.12, z0), out(u + 0.12, z0), out(u + 0.12, z1), out(u - 0.12, z1), n)
  }
  for (let z = LOBBY + 4 * ST; z < z1 - 2; z += 4 * ST) qf(mull, out(u0, z - 0.15), out(u1, z - 0.15), out(u1, z + 0.15), out(u0, z + 0.15), n)
}

function punched(P: (u: number, z: number) => V3, n: V3, u0: number, u1: number, z0: number, z1: number) {
  const k = Math.max(1, Math.round((u1 - u0 - 1.0) / 3.0)), pitch = (u1 - u0 - 1.0) / k
  for (let i = 0; i < k; i++) {
    const a = u0 + 0.5 + i * pitch + (pitch - 1.6) / 2
    for (let z = z0; z + 2 * ST <= z1 + 0.01; z += 2 * ST) {
      const p = (u: number, zz: number): V3 => { const q = P(u, zz); return [q[0] + n[0] * 0.04, q[1] + n[1] * 0.04, zz] }
      qf(win, p(a, z + 1.2), p(a + 1.6, z + 1.2), p(a + 1.6, z + 2 * ST - 1.2), p(a, z + 2 * ST - 1.2), n)
    }
  }
}

// Long faces, south (y = −HY) and north (y = +HY).
for (const s of [-1, 1]) {
  const n: V3 = [0, s, 0]
  const yF = s * HY, yR = s * (HY - REC + 0.04)
  const PF = (u: number, z: number): V3 => [u, yF, z], PR = (u: number, z: number): V3 => [u, yR, z]
  for (const [x0, x1, kind, top] of SEGS) {
    if (kind === 'g') {
      // A granite pier the full depth of the recess.
      cbox(gr, rect(x0, x1, s < 0 ? -HY : HY - REC, s < 0 ? -HY + REC : HY), 0, top, { b: 0.4, top: roof })
      punched(PF, n, x0, x1, LOBBY + 0.8, top - 3.0)
      qf(lobby, [x0 + 0.4, yF + s * 0.04, 0.4], [x1 - 0.4, yF + s * 0.04, 0.4], [x1 - 0.4, yF + s * 0.04, LOBBY - 0.8], [x0 + 0.4, yF + s * 0.04, LOBBY - 0.8], n)
    } else {
      glassWall(PR, n, x0, x1, 0, top)
      // Where the bay stops short of the roof, the core above it is granite
      // (already drawn); the bay's own top is a ledge.
      if (top < ROOF) qf(roof, [x0, yR, top], [x1, yR, top], [x1, yF, top], [x0, yF, top], [0, 0, 1])
      if (top > ROOF) qf(roof, [x0, yR, top], [x1, yR, top], [x1, yF, top], [x0, yF, top], [0, 0, 1])
      // The middle bay stands proud as a full-depth glass slot over the roof.
      if (top > ROOF) cbox(glass, rect(x0, x1, s < 0 ? -HY : HY - REC, s < 0 ? -HY + REC : HY), ROOF, MID, { top: roof })
    }
  }
}
// End faces: granite with a middle glass bay and punched windows.
for (const s of [-1, 1]) {
  const n: V3 = [s, 0, 0], x = s * HX
  const P = (u: number, z: number): V3 => [x, s * u, z]
  punched(P, n, -HY + REC, -5.5, LOBBY + 0.8, ROOF - 3.0)
  punched(P, n, 5.5, HY - REC, LOBBY + 0.8, ROOF - 3.0)
  const Pg = (u: number, z: number): V3 => [x + s * 0.04, s * u, z]
  glassWall(Pg, n, -5.5, 5.5, LOBBY, ROOF - 0.6)
  qf(lobby, Pg(-HY + 2, 0.4), Pg(HY - 2, 0.4), Pg(HY - 2, LOBBY - 0.8), Pg(-HY + 2, LOBBY - 0.8), n)
}

if (import.meta.main) {
  await save('sd-symphony-towers', 'Symphony Towers', [
    { part: gr, material: finish('symphony-granite', 0xd3bcb0) },
    { part: win, material: finish('window', 0x5a6470, 0.35) },
    { part: glass, material: windowVariant(2, 0x5f7488) },
    { part: mull, material: finish('symphony-mullion', 0x8193a4) },
    { part: roof, material: PALETTE.roof },
    { part: lobby, material: PALETTE.entrance },
  ], { anchor: [-117.1578641, 32.7180549], bearing: 0 })
}
