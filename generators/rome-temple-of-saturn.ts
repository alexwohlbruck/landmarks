/**
 * Temple of Saturn (Tempio di Saturno), Roman Forum, Rome: procedural,
 * CC0-1.0, no textures. The ruin as it stands.
 *   bun generators/rome-temple-of-saturn.ts
 *
 * Map frame: x, y, z up, metres, turned to bearing 35.5: +y points
 * north-east, out of the pronaos toward the Forum; +x south-east. The
 * bearing makes OSM's six front columns a line along x. Origin: the centre
 * of the six front column circles, 12.4842015, 41.8925079. y = 0 is the
 * lowest ground the map draws under the footprint (the front's east corner).
 *
 * Modelled: the eight standing columns (six across the front, one return
 * each side) with grey granite shafts, white bases and Ionic capitals as
 * bold volute blocks; the entablature they carry (architrave and frieze
 * with the inscription band, the bracketed cornice) across the front and
 * back to the returns; the brick backing standing on the entablature's
 * middle; the travertine podium under the columns on OSM's plan (a strip
 * under the front row and the two side arms), the stub of the collapsed
 * front stair, and the podium core and rear wall behind at their lower,
 * broken heights.
 *
 * Sources
 * - OSM (ODbL), fetched 2026-11-28: the site relation/1849835 ("Tempio di
 *   Saturno", historic=archaeological_site, not a building); inside it the
 *   eight columns way/131557561, 131557601, 131557596, 131557584,
 *   131557606, 131557570, 1000529938, 1000529939 (building=yes, ruins); the
 *   podium relation/1849876; the stair stub relation/1849862; the core
 *   relation/1767597 and the rear wall relation/1849870. Not drawn:
 *   relation/1849871 (a wall strip outside the podium's width) and
 *   way/131557332 ("Ara di Saturno", a modern shelter roof 35 m in front).
 * - Published: Italian Wikipedia "Tempio di Saturno": the front columns and
 *   the first two of the sides survive; grey and pink granite shafts,
 *   four-faced Ionic capitals; reused entablature with the inscription
 *   SENATUS POPULUSQUE ROMANUS INCENDIO CONSUMPTUM RESTITUIT; podium of
 *   concrete faced with travertine.
 * - Photos (Wikimedia Commons, EVIDENCE):
 *   1 Diana Ringo, "Temple of Saturn, Rome.jpg", CC BY-SA 3.0 (square on
 *     to the front: every height, the entablature, the brick backing);
 *     https://commons.wikimedia.org/wiki/File:Temple_of_Saturn,_Rome.jpg
 *   2 José Luiz, "Temple of Saturn (seen from Tabularium) - Roman Forum -
 *     Rome 2016.jpg", CC BY-SA 4.0 (from behind and above: the podium's
 *     side, the returns, the open top behind the front row);
 *     https://commons.wikimedia.org/wiki/File:Temple_of_Saturn_(seen_from_Tabularium)_-_Roman_Forum_-_Rome_2016.jpg
 * - Terrain: Mapterhorn z13 only; it slopes ~3 m up toward the Capitoline
 *   across the podium. Elevation 0.
 *
 * Numbers
 * - From OSM: column centres (the span 18.95 m), every plan.
 * - Measured on photo 1 (18.95 m = 751 px, 39.6 px/m): columns 12.5 m from
 *   base to capital top, ~1.45 m across (OSM's circles are 1.2); the
 *   architrave and frieze 1.6 m, the cornice 1.05 m; the brick backing
 *   7 m wide and 2.1 m high, x -3.3 to 3.8.
 * - Estimated: the podium 5 m over the lowest ground at the front (photo
 *   2's side wall against the columns, ~0.4 of their height); the core behind 1.2 m lower, the rear
 *   wall 1.6 m lower (kept above the map's sloping ground); the stair stub 2.5 m lower.
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { extrude, prism, rect, save, smooth, type XY } from './dc-wwii-memorial'

const granite = new Part()
const marble = new Part()
const trav = new Part()
const brick = new Part()

function box(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, b = 0) {
  prism(p, rect((x0 + x1) / 2, (y0 + y1) / 2, Math.abs(x1 - x0) / 2, Math.abs(y1 - y0) / 2), z0, z1, b)
}
function lathe(p: Part, cx: number, cy: number, prof: [number, number][], n: number) {
  smooth(p, m => {
    m.loft(prof.map(([r, z]) => Array.from({ length: n }, (_, i) => {
      const a = ((i + 0.5) / n) * Math.PI * 2
      return [cx + r * Math.cos(a), cy + r * Math.sin(a), z] as V3
    })))
  }, 50)
}

const H = 5.0 // podium top
const PODIUM: XY[] = [[-9.1, -6.2], [-10.8, -6.3], [-11.1, 1.7], [1.2, 2.0], [4.6, 2.1], [9.5, 2.1], [9.4, 3.1], [10.6, 3.2], [10.7, 2.0], [11.3, 2.1], [11.4, -3.4], [10.3, -3.4], [10.3, -4.5], [9.0, -4.4], [9.0, -1.1], [-8.6, -1.3], [-8.6, -6.1]]
const STAIR: XY[] = [[4.6, 2.1], [4.4, 6.4], [1.2, 6.3], [1.2, 2.0]]
const REAR: XY[] = [[-9.4, -21.3], [-8.1, -21.2], [-8.4, -23.7], [-6.3, -25.8], [-3.9, -26.0], [-4.0, -21.3], [-7.0, -21.3], [-6.9, -19.4], [-5.4, -19.4], [-5.2, -18.4], [-3.1, -18.5], [-2.9, -16.3], [-3.5, -15.4], [-3.3, -14.2], [-2.9, -13.6], [-3.2, -10.9], [-1.1, -10.8], [-1.3, -7.8], [-3.5, -7.7], [-3.4, -6.1], [-8.6, -6.1], [-9.1, -6.2], [-9.4, -19.6]]
const BACK: XY[] = [[-12.3, -29.8], [-12.4, -29.1], [-5.5, -28.9], [8.4, -28.5], [8.2, -21.5], [9.0, -21.5], [9.2, -29.2]]

extrude(trav, PODIUM, 0, H, undefined, { caps: [false, true] })
// The podium's top course, a slight lip under the column bases.
box(trav, -11.3, 11.5, -1.4, 2.3, H - 0.5, H)
extrude(trav, STAIR, 0, H - 2.5, undefined, { caps: [false, true] })
extrude(trav, REAR, 0, H - 1.2, undefined, { caps: [false, true] })
extrude(trav, BACK, 0, H - 1.6, undefined, { caps: [false, true] })

// The columns: OSM centres, base, granite shaft, Ionic capital.
const COLS: [number, number][] = [[-9.44, -0.14], [-5.84, 0.03], [-2.08, 0.07], [1.86, 0.07], [5.99, 0.11], [9.51, -0.14], [-9.49, -3.71], [9.61, -3.49]]
const BASE = H + 0.8, SHAFT = H + 11.5, CAP = H + 12.5
for (const [x, y] of COLS) {
  box(marble, x - 0.95, x + 0.95, y - 0.95, y + 0.95, H, H + 0.35)
  lathe(marble, x, y, [[0.88, H + 0.35], [0.8, BASE]], 8)
  lathe(granite, x, y, [[0.73, BASE], [0.64, SHAFT]], 8)
  // Four-faced Ionic capital: a block with its volutes as rolls at the corners.
  box(marble, x - 0.85, x + 0.85, y - 0.85, y + 0.85, SHAFT, SHAFT + 0.55)
  box(marble, x - 1.05, x + 1.05, y - 1.05, y + 1.05, SHAFT + 0.55, CAP, 0.12)
}

// The entablature: architrave and frieze (the inscription band on the
// front, a lighter face), cornice; across the front and back over the
// returns on both sides.
{
  const x0 = -10.55, x1 = 10.65, yf = 0.95, yb = -4.6
  box(marble, x0, x1, yf - 1.9, yf, CAP, CAP + 1.6)
  for (const [a, b] of [[x0, x0 + 1.9], [x1 - 1.9, x1]]) box(marble, a, b, yb, yf - 1.9, CAP, CAP + 1.6)
  // The cornice, projecting, with its soffit band.
  box(marble, x0 - 0.5, x1 + 0.5, yf - 2.3, yf + 0.5, CAP + 1.6, CAP + 2.65, 0.2)
  for (const [a, b] of [[x0 - 0.5, x0 + 2.2], [x1 - 2.2, x1 + 0.5]]) box(marble, a, b, yb - 0.4, yf - 2.3, CAP + 1.6, CAP + 2.65, 0.2)
  // The inscription band: two flat lines of lettering as a slightly
  // darker strip on the frieze (no letters).
  box(trav, -8.6, 8.8, yf - 0.02, yf + 0.04, CAP + 0.55, CAP + 1.35)
  // The brick backing on top, in two steps.
  box(brick, -3.3, 3.8, yf - 3.0, yf - 0.8, CAP + 2.65, CAP + 4.1)
  box(brick, -1.0, 1.6, yf - 2.6, yf - 1.1, CAP + 4.1, CAP + 4.75)
}

const up = (n: V3) => (n[2] > 0.7 ? 0.45 : 1)
const lit = (k: number) => (_p: V3, n: V3) => k * up(n)
console.log({ granite: granite.triangles, marble: marble.triangles, trav: trav.triangles, brick: brick.triangles })
await save('rome-temple-of-saturn', 'Temple of Saturn', [
  // Colours from photos 1 and 2, pulled to the palette's lightness: grey
  // granite shafts, weathered white marble, grey-cream travertine, brick.
  { part: granite, material: { ...finish('saturn-granite', 0xb2ada3), floodlight: lit(1) } },
  { part: marble, material: { ...finish('saturn-marble', 0xe7e2d7), floodlight: lit(1) } },
  { part: trav, material: { ...finish('saturn-travertine', 0xcfc5b3), floodlight: lit(0.8) } },
  { part: brick, material: { ...finish('saturn-brick', 0xb08670), floodlight: lit(0.6) } },
], { bearing: 35.5, osm: 'relation/1849876' })
