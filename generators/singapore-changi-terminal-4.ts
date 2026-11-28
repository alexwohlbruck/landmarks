/**
 * Singapore Changi Airport Terminal 4 (2017, Benoy with SAA): the low
 * two-storey hall under one long sweeping roof that rises over the check-in
 * hall and curls out over the departure kerb, the green living wall with the
 * "Terminal 4" sign on the landside, and the long straight gate pier along
 * the apron — procedural, CC0-1.0, no textures.
 *   bun generators/singapore-changi-terminal-4.ts
 *
 * Built with the Changi kit in singapore-changi-terminal-1.ts.
 * Map frame: x = model east, y = model north, z up, metres; bearing 23.1°.
 * Anchor: the area centroid of OSM way/409015814, 103.9839006, 1.3384646.
 * The landside (the departure kerb, OSM's roof way/544755541) is the hall's
 * west face, model −x; the pier runs along the apron on the east, model +x.
 *
 * Evidence
 * - OSM (© OpenStreetMap contributors, ODbL): way/409015814 (Changi Airport
 *   Terminal 4, building=transportation, building:levels 3); way/937078222
 *   (the hall's part, building:levels 4); way/544755541 (building=roof, the
 *   departure kerb canopy, layer 1).
 * - Published: opened 31 October 2017, 225,000 m² (Changi Airport Group /
 *   Wikipedia "Changi Airport Terminal 4").
 * - Photos (evidence):
 *   https://commons.wikimedia.org/wiki/File:Singapore_Changi_Airport_Terminal_4,_exterior_wall_logo_1.jpg
 *     (JuneAugust, CC BY-SA 4.0) the living wall with the sign under the roof edge;
 *   https://commons.wikimedia.org/wiki/File:Artist%27s_impression_of_Terminal_4_departure_hall_at_Singapore_Changi_Airport.jpg
 *     (Changi Airport Group, CC BY 3.0) the hall: a long timber-lined roof
 *     rising over full-height glass;
 *   https://commons.wikimedia.org/wiki/File:Changi_Airport_-_Terminal_4_-_Departure_4.jpg
 *     (Renek78, CC BY-SA 4.0) the hall's roof and skylights from inside;
 *   https://commons.wikimedia.org/wiki/File:Singapore_Changi_Airport_Terminal_4_(165259).jpg
 *     (Moheen Reeyad, CC BY-SA 4.0) the hall interior.
 * - No lidar or open aerials; no licensed photo of the whole exterior.
 *
 * Numbers (estimated): the hall's walls to 18 m with a clerestory to the roof;
 * the roof's crown 26 m a third of the way in from the landside, falling to
 * 21 m at the airside wall and curling down to 16.5 m at the kerb edge, 20 m
 * out past the wall; the pier 13 m; the green wall about 80 × 12 m. Doubts:
 * the roof's profile is drawn from interior photos and the logo photo only;
 * the pier's jet bridges are estimated at about 45 m spacing.
 */
import { Part, type V3, type MaterialSpec } from './mesh'
import { finish } from './palette'
import { type XY, type Facade, type Zone, beam, zoneMass, clean, gateStubs, writeLod, newMats, CHANGI } from './singapore-changi-terminal-1'

const T4_OUTLINE: XY[] = [[-11.5,190.2],[-11.5,183.6],[-11.5,177.4],[-11.5,147.9],[-11.5,129.9],[-11.5,115.7],[-11.5,99.2],[-100.7,98.8],[-100.7,71.1],[-100.7,48.8],[-100.7,-54.8],[-100.7,-64.9],[-100.8,-200.8],[-100.8,-218.5],[-11.2,-218.1],[-11.2,-229.8],[-11.2,-238.1],[-0.9,-238.1],[30.5,-237.9],[39.3,-237.9],[39.3,-229.2],[39.3,-217.8],[46.0,-217.8],[48.1,-217.8],[48.0,-233.7],[48.0,-318.3],[48.0,-355.5],[70.8,-355.4],[70.8,-351.1],[70.8,-306.5],[70.8,-264.2],[70.8,-221.3],[70.8,-188.5],[70.8,-177.9],[70.9,-119.3],[70.9,-78.0],[70.9,-34.5],[70.9,9.2],[70.9,52.5],[70.9,95.7],[71.0,138.9],[71.0,181.6],[71.0,219.7],[71.0,225.1],[71.0,274.2],[71.0,311.7],[71.1,354.8],[71.1,405.2],[74.9,405.2],[96.6,405.3],[96.6,422.8],[96.6,437.6],[75.0,437.5],[61.6,437.5],[-15.2,437.1],[-60.8,436.9],[-60.8,427.1],[-60.8,411.9],[48.3,412.3],[48.3,260.7],[48.2,249.7],[48.2,219.0],[48.2,201.0],[44.6,201.0],[44.6,190.4],[32.9,190.4],[18.1,190.3]]

const H_WALL = 18, H_PIER = 13, H_NORTH = 16
const XK = -122, XA = 50 // the roof's kerb edge and its airside edge
/** The roof's top surface over x: rising from the kerb to the crown, then falling gently to the airside. */
function roofZ(x: number) {
  const xc = -50, zc = 26
  if (x <= xc) { const t = (x - XK) / (xc - XK); return 16.5 + (zc - 16.5) * Math.sin((t * Math.PI) / 2) }
  const t = (x - xc) / (XA - xc); return zc - (zc - 21) * t * t
}
const T_ROOF = 1.6

function quadN(p: Part, a: V3, b: V3, c: V3, d: V3, n: [V3, V3, V3, V3]) {
  p.tri(a, b, c, undefined, undefined, undefined, [n[0], n[1], n[2]])
  p.tri(a, c, d, undefined, undefined, undefined, [n[0], n[2], n[3]])
}
const unit = (v: V3): V3 => { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l] }

function build() {
  const M = newMats(['wall', 'win', 'roof', 'trim', 'green', 'pier'])
  const body = clean(T4_OUTLINE, 0.6)
  const HALL: Facade = { bay: 9, ratio: 0.93, floor: 7.5, group: 1, spandrel: 1.6, sill: 0.8, head: 1.6, ground: 0.8, minLength: 6 }
  const PIER: Facade = { bay: 9, ratio: 0.92, floor: 4.6, group: 1, spandrel: 0, sill: 1.0, head: 2.0, ground: 6.2, minLength: 6 }
  const zones: Zone[] = [ // disjoint
    { rect: [-110, -219, 48.05, 99.5], z: H_WALL, facade: HALL, roof: 'trim' },
    { rect: [-12, 99.5, 48.05, 205], z: H_NORTH, facade: HALL },
    { rect: [48.05, -400, 120, 410], z: H_PIER, facade: PIER, wall: 'pier' },
    { rect: [-80, 405, 120, 450], z: H_PIER, facade: PIER, wall: 'pier' },
    { rect: [-20, -245, 48.05, -219], z: H_PIER, facade: PIER, wall: 'pier' },
  ]
  zoneMass(M, body, zones)

  // --- The sweeping roof: a curved slab over the hall, overhanging the kerb ---
  const Y0 = -221, Y1 = 101.5, NX = 18
  const xs = Array.from({ length: NX + 1 }, (_, i) => XK + ((XA - XK) * i) / NX)
  const nrm = (x: number): V3 => { const e = 0.5; return unit([-(roofZ(x + e) - roofZ(x - e)) / (2 * e), 0, 1]) }
  for (let i = 0; i < NX; i++) {
    const a = xs[i], b = xs[i + 1], na = nrm(a), nb = nrm(b)
    quadN(M.roof, [a, Y0, roofZ(a)], [b, Y0, roofZ(b)], [b, Y1, roofZ(b)], [a, Y1, roofZ(a)], [na, nb, nb, na])
    const da: V3 = [-na[0], 0, -na[2]], db: V3 = [-nb[0], 0, -nb[2]]
    quadN(M.trim, [a, Y1, roofZ(a) - T_ROOF], [b, Y1, roofZ(b) - T_ROOF], [b, Y0, roofZ(b) - T_ROOF], [a, Y0, roofZ(a) - T_ROOF], [da, db, db, da])
    for (const [y, s] of [[Y0, -1], [Y1, 1]] as [number, number][]) {
      const n: V3 = [0, s, 0]
      quadN(M.trim, [a, y, roofZ(a) - T_ROOF], [b, y, roofZ(b) - T_ROOF], [b, y, roofZ(b)], [a, y, roofZ(a)], [n, n, n, n])
    }
  }
  for (const [x, s] of [[XK, -1], [XA, 1]] as [number, number][]) {
    const n: V3 = [s, 0, 0]
    quadN(M.trim, [x, Y0, roofZ(x) - T_ROOF], [x, Y1, roofZ(x) - T_ROOF], [x, Y1, roofZ(x)], [x, Y0, roofZ(x)], [n, n, n, n])
  }
  // the clerestory between the walls and the roof: glass on all four sides
  {
    const xw = -100.8, xa = 48.05
    const band = (x0: number, x1: number, y: number, s: number) => {
      for (let i = 0; i < 8; i++) {
        const a = x0 + ((x1 - x0) * i) / 8, b = x0 + ((x1 - x0) * (i + 1)) / 8, n: V3 = [0, s, 0]
        quadN(M.win, [a, y, H_WALL], [b, y, H_WALL], [b, y, roofZ(b) - T_ROOF + 0.05], [a, y, roofZ(a) - T_ROOF + 0.05], [n, n, n, n])
      }
    }
    band(xa, xw, -219.2, -1); band(xw, xa, 99.6, 1)
    for (const [x, s] of [[xw, -1], [xa, 1]] as [number, number][]) {
      const n: V3 = [s, 0, 0], z1 = roofZ(x) - T_ROOF + 0.05
      quadN(M.win, [x, -219.2, H_WALL], [x, 99.6, H_WALL], [x, 99.6, z1], [x, -219.2, z1], [n, n, n, n])
    }
    // tree-like steel columns carrying the overhang at the kerb edge
    for (let y = -205; y <= 90; y += 33) beam(M.trim, [XK + 4, y - 0.6], [XK + 4, y + 0.6], 1.2, 0, roofZ(XK + 4) - T_ROOF + 0.1, false)
  }

  // --- The living wall with the sign, on the landside face ---
  {
    const x = -101.0, n: V3 = [-1, 0, 0]
    quadN(M.green, [x, 55, 2.5], [x, -70, 2.5], [x, -70, 17.6], [x, 55, 17.6], [n, n, n, n])
  }

  // --- Jet-bridge stubs along the pier's apron face ---
  gateStubs(M.pier, [71, -330], [1, 0], [0, 1], Array.from({ length: 16 }, (_, k) => k * 47), 14)

  return [
    { part: M.wall, material: finish('changi-t4-panel', 0xdfe2e3) as MaterialSpec },
    { part: M.win, material: { name: 'window', color: 0x9fb6c6, roughness: 0.35 } as MaterialSpec },
    { part: M.roof, material: finish('changi-t4-roof', 0xbfc5ca) as MaterialSpec },
    { part: M.trim, material: finish('changi-t4-soffit', 0xeeece6) as MaterialSpec },
    { part: M.green, material: finish('changi-t4-green', 0x83a26f) as MaterialSpec },
    { part: M.pier, material: finish('changi-t4-pier', 0xd2d7da) as MaterialSpec },
  ]
}

if (import.meta.main) {
  writeLod('Changi Airport Terminal 4', 'singapore-changi-terminal-4.glb', build(), { bearing: CHANGI.bearing, osm: 'way/409015814', height: 26 }, 8000, 250_000)
}
