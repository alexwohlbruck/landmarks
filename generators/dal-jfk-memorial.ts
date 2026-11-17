/**
 * John Fitzgerald Kennedy Memorial (Philip Johnson, 1970), Dallas:
 * procedural, CC0-1.0.
 * bun generators/dal-jfk-memorial.ts
 *
 * Map frame: x east, y north, z up, metres, turned to the placement's
 * bearing 345.3 (the walls of OSM way/1390843350 run at 75.3 / 165.3 deg),
 * so x runs along the north and south walls and y along the east and west
 * ones. The origin is the centroid of the OSM outline way/1390843350, on the
 * plaza. y = 0 is the plaza.
 *
 * The cenotaph: an open-roofed square "open tomb" of tall precast concrete
 * columns, lifted off the plaza on short legs, open to the sky, entered by a
 * narrow slot in the middle of the north and south walls; inside, a low
 * square of black granite carved with the President's name.
 *
 * Published (Wikipedia, "John F. Kennedy Memorial Plaza"; Dallas County):
 * - 50 x 50 ft (15.2 m) square, 30 ft (9.1 m) tall walls;
 * - 72 precast concrete columns, eight of which reach the ground as legs,
 *   holding the walls about 29 in (0.74 m) above the plaza.
 * Measured:
 * - plan: OSM way/1390843350 (the wall ring, barrier=wall, height 9.144)
 *   and the two building ways inside it, way/1390843351 and -52 (the two
 *   U-shaped halves): 15.9 m square, walls about 1.3 m deep, slots 1.5 to
 *   1.7 m wide;
 * - height: USGS lidar TX_Pecos_Dallas_B3_2018 (2018 flight), wall tops
 *   9.9 m over the plaza all round, i.e. the 9.1 m walls plus the 0.74 m
 *   lift. The lidar puts the slots on the centre line; OSM draws them about
 *   1.5 m off centre in a pinwheel. The photos taken square on (Barera
 *   January 2016 01 and 03) show them centred, so they are centred here.
 * Estimated from the photos:
 * - 19 columns along the east and west walls, 7 on each half of the north
 *   and south walls (66 drawn against the published 72; the real corner
 *   columns are narrower), each about 0.85 m wide and 1 m deep, with soft
 *   chamfered edges so the joints read as shallow grooves, not stripes;
 * - the legs: the four corner columns and the four beside the slots, drawn
 *   0.6 m square under their columns;
 * - the round bosses (light fittings) that run up the slot edges and the
 *   corners (on both faces), eight per edge, drawn a little large;
 * - the granite block: 2.6 m square, 0.45 m high, at the centre.
 * Colours from the daylight photos: weathered warm white concrete, a shade
 * greyer than `stone`; the granite is black, drawn at the palette's
 * charcoal limit.
 * Left out: the sunken square of paving round the granite, and the plaza
 * (both are ground).
 *
 * Night: the memorial is lit from inside and below; the walls carry
 * _FLOODLIGHT, strongest on the inner faces.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 * - "Dallas January 2016 01 (John Fitzgerald Kennedy Memorial).jpg",
 *   "... 02 ...", "... 03 ...", Michael Barera, CC BY-SA 4.0
 * - "John F. Kennedy Memorial Plaza 04081801.jpg", "... 04081802.jpg",
 *   PLBthetoonist, CC BY-SA 4.0
 * - "John F. Kennedy Memorial Plaza - panoramio.jpg", Michael Laferriere,
 *   CC BY 3.0
 * - "John Fitzgerald Kennedy Memorial (14012260475).jpg", Nelo Hotsuma,
 *   CC BY 2.0
 * - "JFK Memorial Dallas.jpg", Jim Bowen, CC BY 2.0
 * - "John Fitzgerald Kennedy Memorial by Philip Johnson, Dallas, Texas
 *   (41064792615).jpg", mliu92, CC BY-SA 2.0
 * - "The John Fitzgerald Kennedy Memorial, ... LCCN2015631022.tif",
 *   Carol M. Highsmith, public domain
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the column count and the bosses are counted from photos; the
 * granite block's size is estimated against the walls.
 */
import { Part } from './mesh'
import { finish } from './palette'
import { block, cap, chamfer, rect, save, type XY } from './chi-merchandise-mart'

const ANCHOR: [number, number] = [32.7787216, -96.8064416]
const BEARING = 345.3

const H = 0.74 // underside of the walls
const TOP = 9.9 // wall tops (lidar)
const OUT = 7.95 // half the outer square
const D = 1.0 // column depth
const SLOT = 0.76 // half the slot
const LEG = 0.3 // half a leg

function build() {
  const conc = new Part(), granite = new Part()

  /** One column, x0..x1 by y0..y1, lifted unless it is a leg. */
  const column = (x0: number, y0: number, x1: number, y1: number, leg: boolean) => {
    const r: XY[] = chamfer(rect(x0, y0, x1, y1), 0.1)
    block(conc, conc, r, H, TOP, 0)
    cap(conc, r, H, false)
    if (leg) {
      const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2
      block(conc, null, rect(cx - LEG, cy - LEG, cx + LEG, cy + LEG), 0, H, 0)
    }
  }

  // East and west walls: 19 columns each, full length.
  const nEW = 19, wEW = (2 * OUT) / nEW
  for (const s of [-1, 1]) {
    const x0 = s > 0 ? OUT - D : -OUT, x1 = x0 + D
    for (let k = 0; k < nEW; k++) {
      const y0 = -OUT + k * wEW
      column(x0, y0, x1, y0 + wEW, k === 0 || k === nEW - 1)
    }
  }
  // North and south walls: two halves of seven columns either side of the slot.
  const inner = OUT - D, nNS = 7, wNS = (inner - SLOT) / nNS
  for (const s of [-1, 1]) {
    const y0 = s > 0 ? OUT - D : -OUT, y1 = y0 + D
    for (const side of [-1, 1]) {
      for (let k = 0; k < nNS; k++) {
        const a = SLOT + k * wNS, b = a + wNS
        const [x0, x1] = side > 0 ? [a, b] : [-b, -a]
        column(x0, y0, x1, y1, k === 0)
      }
    }
  }

  // Round bosses up the slot edges and the outer corners.
  const boss = (x: number, y: number, z: number, nx: number, ny: number) => {
    const r = 0.27, out = 0.1, seg = 6
    const ux = -ny, uy = nx // along the face
    const P = (t: number, o: number): [number, number, number] =>
      [x + ux * r * Math.cos(t) + nx * o, y + uy * r * Math.cos(t) + ny * o, z + r * Math.sin(t)]
    for (let i = 0; i < seg; i++) {
      const t0 = (i / seg) * 2 * Math.PI, t1 = ((i + 1) / seg) * 2 * Math.PI
      conc.tri([x + nx * out, y + ny * out, z], P(t0, out), P(t1, out))
      conc.quad(P(t0, 0), P(t1, 0), P(t1, out), P(t0, out))
    }
  }
  const zs = Array.from({ length: 8 }, (_, i) => H + 0.75 + i * ((TOP - H - 1.5) / 7))
  for (const z of zs) {
    for (const s of [-1, 1]) {
      // slot edges: the end faces of the north and south walls
      for (const side of [-1, 1]) boss(side * SLOT, s * (OUT - D / 2), z, -side, 0)
      // corners, on the north and south faces near each end
      for (const side of [-1, 1]) boss(side * (OUT - 0.42), s * OUT, z, 0, s)
      // and on the east and west faces at the same corners
      for (const side of [-1, 1]) boss(side * OUT, s * (OUT - 0.42), z, side, 0)
    }
  }

  // The granite block.
  block(granite, granite, rect(-1.3, -1.3, 1.3, 1.3), 0, 0.45, 0.06)

  const lit = (p: number[], n: number[]) => (Math.abs(n[2]) > 0.5 ? 0.1 : Math.max(0.15, 0.6 - 0.04 * p[2]))
  return [
    { part: conc, material: { ...finish('jfk-concrete', 0xe6e0d4), floodlight: lit } },
    { part: granite, material: finish('jfk-granite', 0x4a4f57, 0.4) },
  ]
}

if (import.meta.main) await save('dal-jfk-memorial', 'John F. Kennedy Memorial', ANCHOR, BEARING, build())
