/**
 * Madrid-Barajas north control tower ("TWR N", Bruno Fortea; in service for
 * the 2006 expansion), between T4S and the 36L runway — procedural, CC0-1.0,
 * no textures.
 * bun generators/madrid-barajas-control-tower.ts
 *
 * The airport's main tower: a slender white concrete shaft, split by a dark
 * glazed slot on two sides, that flares like a trumpet into a wide grey
 * metal saucer; above the saucer, stepped grey rings, the cab's leaning dark
 * glass under a flat roof ring, and a mast. It stands on a low concrete base
 * building, the oval of OSM way/205769733, among curved car-port roofs (left
 * to the map).
 *
 * Frame: origin at the tower's axis (OSM parts' common centre, -3.5690538,
 * 40.4918375), x east, y north, bearing 0 (the tower is round).
 *
 * Evidence
 * - OSM: way/205769733 (building=yes, man_made=tower, ref "TWR N",
 *   tower:type=aircraft_control, 1 level: the base building); concentric
 *   building:parts on it: way/205771486 (7.4 m across, 4 levels: the shaft),
 *   way/205771487 (13.4 m, levels 6–7), way/87201143 (20 m, levels 5–6),
 *   way/1058537190 and way/1058537191 (29.2 m, building:part=control_tower,
 *   7 levels: the saucer). No heights. The curved car ports and roofs
 *   (way/205771488, 205771489, 1058537187, 1058537188, 1058537189) are not
 *   part of the model.
 * - Published: a new tower of 71 m (en/es Wikipedia, "Adolfo Suárez
 *   Madrid–Barajas Airport", control towers); 69 m to the top of its mast
 *   (assignment brief, taken as published); architect Bruno Fortea.
 * - Photos (Wikimedia Commons, EVIDENCE):
 *   https://commons.wikimedia.org/wiki/File:Madrid_Barajas_Airport_ATC_T4_2.jpg
 *     (Slashme, CC BY-SA 3.0): side-on from the west with T4S behind: every
 *     height and width below was scaled from it (10 px/m, the mast's top at
 *     69 m); also the trees of T4S yellow north of the tower turning orange
 *     and red to the south;
 *   https://commons.wikimedia.org/wiki/File:Torre_de_control_de_Madrid-Barajas_-_01.jpg
 *     (Carlos Delgado, CC BY-SA 3.0): the shaft and saucer in evening light;
 *   https://commons.wikimedia.org/wiki/File:MAD-LEMD_Torre_de_Control_desde_su_base.jpg
 *     (Felipealvarez, public domain): from the base: the slot in the shaft,
 *     the saucer's underside, the base building;
 *   https://commons.wikimedia.org/wiki/File:Torre_de_control_Aeropuerto_de_Madrid.jpg
 *     (JoseIgnaciodelPino, CC BY-SA 4.0) and
 *     https://commons.wikimedia.org/wiki/File:Madrid_Barajas_ATC_Spain.jpg
 *     (Andres Rueda, CC BY 2.0): from the south-west and north-west;
 *   https://commons.wikimedia.org/wiki/File:Madrid_Airport_-_tower.jpg
 *     (Tiia Monto, CC BY-SA 3.0): from the apron;
 *   https://commons.wikimedia.org/wiki/File:Torre_de_Control_del_Aeropuerto_de_Barajas_de_Madrid_-_panoramio.jpg
 *     (Ricardo Ricote Rodríguez, CC BY 3.0): at night: the shaft floodlit,
 *     the saucer's rim and the cab lit.
 * - Terrain: Mapterhorn flat (±0.5 m) around the base.
 *
 * Numbers (scaled from Slashme's photo unless said): shaft 7.6 m across
 *   (OSM 7.4), straight to 26 m, flaring to 15.5 m across at 41.8 m; the
 *   saucer's dark underside 41.8–44.5 m, its grey rim 31 m across at 48–50.5 m
 *   (OSM 29.2 m), top at 52 m; a terrace ring 24 m across to 53.2 m; rings
 *   of 23 and 17.6 m to 55.5 and 58 m; the cab 16–18 m across, 58–62.3 m;
 *   its roof ring 18.4 m to 64 m; mast to 69 m (published). The dark slots
 *   face east and west (seen from the west and the south-west; the north
 *   and south faces are not photographed close). Base building 4.5 m high
 *   (one level, OSM; estimated).
 * Doubts: whether the shaft has two slots or four; the base building's
 *   height and facade (photographed only from close below).
 */
import { Part, type V3, type MaterialSpec } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, quadN, unit, capPoly } from './nyc-570-lexington'
import { writeLod } from './tokyo-haneda-terminal-1'

const TWR = {
  concrete: finish('mad-twr-concrete', 0xebe7de),
  metal: finish('mad-twr-metal', 0xadb3b8),
  under: finish('mad-twr-underside', 0x868d93),
  window: { name: 'window', color: 0x64798a, roughness: 0.35, floodlight: undefined } as MaterialSpec,
  dark: finish('mad-twr-slot', 0x5e6870),
}

/** A lathe of (r, z) points, between angles a0…a1 (radians, full if equal), with smooth normals. */
function lathe(p: Part, prof: [number, number][], n: number, a0 = 0, a1 = 2 * Math.PI, cx = 0, cy = 0) {
  const full = Math.abs(a1 - a0 - 2 * Math.PI) < 1e-6
  const angs = Array.from({ length: n + 1 }, (_, i) => a0 + ((a1 - a0) * i) / n)
  const sl = (i: number): [number, number] => { // profile normal in (r, z)
    const a = prof[Math.max(0, i - 1)], b = prof[Math.min(prof.length - 1, i + 1)]
    const dr = b[0] - a[0], dz = b[1] - a[1], L = Math.hypot(dr, dz) || 1
    return [dz / L, -dr / L]
  }
  for (let j = 0; j < prof.length - 1; j++) {
    const [r0, z0] = prof[j], [r1, z1] = prof[j + 1]
    if (Math.abs(r0 - r1) < 1e-6 && Math.abs(z0 - z1) < 1e-6) continue
    const s0 = sl(j), s1 = sl(j + 1)
    for (let i = 0; i < n; i++) {
      const ta = angs[i], tb = angs[i + 1]
      const P = (r: number, z: number, t: number): V3 => [cx + r * Math.cos(t), cy + r * Math.sin(t), z]
      const N = (s: [number, number], t: number): V3 => unit([s[0] * Math.cos(t), s[0] * Math.sin(t), s[1]])
      quadN(p, P(r0, z0, ta), P(r0, z0, tb), P(r1, z1, tb), P(r1, z1, ta), [N(s0, ta), N(s0, tb), N(s1, tb), N(s1, ta)])
    }
  }
  if (!full) { // close the cut faces
    for (const [t, sg] of [[a0, -1], [a1, 1]] as [number, number][]) {
      const nn: V3 = [-Math.sin(t) * sg, Math.cos(t) * sg, 0]
      for (let j = 0; j < prof.length - 1; j++) {
        const [r0, z0] = prof[j], [r1, z1] = prof[j + 1]
        const ri = 2.2
        const a: V3 = [ri * Math.cos(t), ri * Math.sin(t), z0], b: V3 = [r0 * Math.cos(t), r0 * Math.sin(t), z0], c: V3 = [r1 * Math.cos(t), r1 * Math.sin(t), z1], d: V3 = [ri * Math.cos(t), ri * Math.sin(t), z1]
        quadN(p, a, b, c, d, [nn, nn, nn, nn])
      }
    }
  }
}
const disc = (p: Part, r: number, z: number, n: number, up = true) => {
  const ring: V3[] = Array.from({ length: n }, (_, i) => [r * Math.cos((2 * Math.PI * i) / n), r * Math.sin((2 * Math.PI * i) / n), z])
  const nn: V3 = [0, 0, up ? 1 : -1]
  for (let i = 1; i < n - 1; i++) up ? p.tri(ring[0], ring[i], ring[i + 1], undefined, undefined, undefined, [nn, nn, nn]) : p.tri(ring[0], ring[i + 1], ring[i], undefined, undefined, undefined, [nn, nn, nn])
}

/** OSM way/205769733, relative to the tower's axis. */
const BASE: XY[] = [[-20.1,14.9],[-25.4,20.7],[-12.7,29.5],[-7.9,31.3],[-3.5,32.1],[1.4,32.4],[6.6,32.0],[12.4,30.4],[16.8,27.7],[21.0,24.3],[25.4,20.1],[27.9,16.1],[29.9,12.0],[31.7,7.7],[32.5,2.8],[32.5,-3.1],[31.0,-10.7],[27.9,-17.2],[23.6,-23.0],[1.2,-41.7],[-3.8,-35.4],[-18.7,-47.8],[-21.5,-44.8],[-28.3,-50.6],[-20.5,-59.5],[-27.3,-63.9],[-32.6,-65.9],[-37.9,-66.8],[-44.3,-67.0],[-50.2,-65.9],[-56.4,-63.7],[-61.7,-60.4],[-64.8,-57.6],[-67.4,-54.7],[-70.2,-50.4],[-72.8,-45.4],[-74.3,-40.2],[-74.7,-35.4],[-74.4,-29.6],[-72.7,-23.7],[-70.4,-19.2],[-68.0,-15.1],[-65.0,-11.4],[-39.3,9.8],[-33.9,3.4]]

function build(detail: boolean) {
  const C = new Part(), M = new Part(), U = new Part(), W = new Part(), D = new Part()
  const n = detail ? 32 : 24, h = detail ? 12 : 8
  // --- the shaft: two white lobes, the dark glazed core showing in the slots east and west ---
  const shaft: [number, number][] = [[3.8, 0], [3.8, 29], [4.0, 32], [4.5, 35], [5.3, 37.5], [6.4, 39.6], [7.9, 41.2], [9.6, 42.2], [0.01, 42.3]]
  const slot = detail ? 0.11 : 0.13 // half-angle of the slot, radians
  lathe(C, shaft, h, slot, Math.PI - slot)
  lathe(C, shaft, h, Math.PI + slot, 2 * Math.PI - slot)
  lathe(D, [[3.0, 0], [3.0, 29], [3.4, 33], [4.2, 37], [5.6, 42.2]], detail ? 8 : 4, -slot - 0.05, slot + 0.05)
  lathe(D, [[3.0, 0], [3.0, 29], [3.4, 33], [4.2, 37], [5.6, 42.2]], detail ? 8 : 4, Math.PI - slot - 0.05, Math.PI + slot + 0.05)
  // --- the saucer: dark ribbed underside, the grey rim with its window band ---
  lathe(U, [[9.5, 42.2], [11.6, 43.0], [13.4, 44.6]], n)
  lathe(M, [[13.4, 44.6], [14.8, 45.9], [15.5, 47.1], [15.7, 48.2]], n)
  lathe(W, [[15.75, 48.2], [15.75, 49.1]], n)
  lathe(M, [[15.7, 49.1], [15.6, 50.5], [15.1, 51.4], [14.0, 52.0], [12.0, 52.0]], n)
  // terrace ring and the stepped rings
  lathe(M, [[12.0, 52.0], [12.0, 53.2], [11.5, 53.2]], n)
  lathe(M, [[11.5, 53.2], [11.5, 54.4]], n)
  lathe(W, [[11.55, 54.4], [11.55, 55.0]], n)
  lathe(M, [[11.5, 55.0], [11.5, 55.5], [8.8, 55.5], [8.8, 58.0], [8.0, 58.0]], n)
  // the cab: leaning dark glass, then the roof ring
  lathe(W, [[8.0, 58.0], [9.0, 62.3]], n)
  lathe(M, [[9.0, 62.3], [9.2, 62.3], [9.2, 64.0], [0.01, 64.0]], n)
  // the mast and its frame
  lathe(M, [[1.2, 64.0], [1.2, 65.6], [0.3, 65.6], [0.3, 69.0], [0.01, 69.0]], detail ? 8 : 6)
  // --- the base building ---
  const ring = BASE.slice()
  const ccwR = (() => { let s = 0; for (let i = 0; i < ring.length; i++) { const a = ring[i], b = ring[(i + 1) % ring.length]; s += a[0] * b[1] - b[0] * a[1] } return s > 0 ? ring : ring.reverse() })()
  const zB = 4.5
  for (let i = 0; i < ccwR.length; i++) {
    const a = ccwR[i], b = ccwR[(i + 1) % ccwR.length]
    const nn = unit([b[1] - a[1], a[0] - b[0], 0])
    quadN(C, [a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], zB], [a[0], a[1], zB], [nn, nn, nn, nn])
    // a glazed band
    const o = 0.06
    quadN(W, [a[0] + nn[0] * o, a[1] + nn[1] * o, 1.0], [b[0] + nn[0] * o, b[1] + nn[1] * o, 1.0], [b[0] + nn[0] * o, b[1] + nn[1] * o, 3.4], [a[0] + nn[0] * o, a[1] + nn[1] * o, 3.4], [nn, nn, nn, nn])
  }
  capPoly(C, ccwR, zB)
  return [
    { part: C, material: { ...TWR.concrete, floodlight: (q: V3, nn: V3) => (q[2] < 42 && q[2] > 4 ? 0.8 * Math.max(0, 1 - Math.abs(nn[2])) : 0) } as MaterialSpec },
    { part: M, material: TWR.metal },
    { part: U, material: TWR.under },
    { part: W, material: TWR.window },
    { part: D, material: TWR.dark },
  ]
}

if (import.meta.main) {
  const extras = { bearing: 0, osm: 'way/1058537191', height: 69 }
  writeLod('Madrid-Barajas Control Tower', 'madrid-barajas-control-tower.glb', build(false), extras, 5000, 250_000)
}
