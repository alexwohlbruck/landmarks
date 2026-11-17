/**
 * Biblioteca Vasconcelos (2006, Alberto Kalach with Gustavo Lipkau, Juan
 * Palomar and Tonatiuh Martínez), Buenavista, Mexico City — original
 * procedural geometry, CC0-1.0, no textures.
 *   bun generators/mexico-city-biblioteca-vasconcelos.ts
 *
 * Map frame: x east, y north, z up, metres; square to the bar, whose long
 * walls run at 2.25° east of north, so the bearing is 2.25. Anchor = the
 * middle of the bar in OSM way/153883455 (19.4474232, -99.1508078).
 *
 * Identity: one long bar split into three blocks by full-height dark glass
 * joints; long faces of white aluminium louvres between bare concrete
 * piers, with a green glass clerestory under the roof; the red folded roof,
 * a zigzag of red slopes with white triangular gables along both eaves and
 * light steel rails running its length; concrete end walls, solid on the
 * east, glazed with balcony slabs on the west; the low concrete entrance
 * box ("BVO") on the south end.
 *
 * Evidence
 * - OSM: way/153883455, one outline for the bar (33.9 × 234.8 m in the
 *   bar's frame), the entrance box on the south end (23.8 × 17 m) and two
 *   low wings on the west. No heights or parts.
 * - Published (es.wikipedia, "Biblioteca Vasconcelos"): 35 m wide, three
 *   blocks of 82 m; ground floor and three upper levels of reading rooms.
 *   The OSM bar is 33.9 m wide and 234.8 m long, so the blocks are drawn
 *   72 m with 9 m glass joints, to fit OSM; the published 82 m likely
 *   counts to the joint centres plus the end walls.
 * - Estimated (photos): facade top 27 m, from bay widths (8 m, nine to a
 *   block, counted on the drone aerials) against the facade height in
 *   ProtoplasmaKid's aerials 01, 03 and Omar_sansi's view; the roof's
 *   gables rise 2.6 m; ground storey 5.5 m; louvres in two tiers with a
 *   glass band between; the entrance box 7.5 m with a sunken terrace; the
 *   west wings 4.5 m with planted roofs (aerial 01 shows one).
 * - Terrain: Mapterhorn has no z15 tiles over the city; the site is flat
 *   lake bed. Not checked.
 * - Photos (Wikimedia Commons; EVIDENCE):
 *   v01–v06 ProtoplasmaKid, "Vista aérea de la Biblioteca Vasconcelos
 *     01–06.jpg", CC BY-SA 4.0 (roof, plan, joints, both ends, east face);
 *   v07 Omar_sansi, "Biblioteca Vasconcelos e Insignia.jpg", CC BY-SA 4.0
 *     (south end and east face from the south-east);
 *   v08 ProtoplasmaKid, "Fachada de la Biblioteca Vasconcelos Buenavista
 *     Ciudad de México.jpg", CC BY-SA 3.0 (the entrance box and south end);
 *   v09 ProtoplasmaKid, "Biblioteca Vasconcelos Mexico City 19.jpg",
 *     CC BY-SA 3.0 (louvres, piers and ground storey up close);
 *   v10 ORamírezD, "\"Vasconcelos\" Library - panoramio.jpg",
 *     CC BY-SA 3.0 (louvres);
 *   v11 ProtoplasmaKid, "Biblioteca Vasconcelos Mexico City 26.jpg",
 *     CC BY-SA 3.0 (the planted slopes along the west face).
 *   The famous hanging stacks are inside and don't show from the map.
 *
 * Doubts
 * - Heights are photo estimates, ±2 m; nothing is published.
 * - The north end is drawn like the south (glazed west part, solid east
 *   part), from one aerial whose direction is uncertain; it has no box,
 *   as in OSM.
 * - The real roof is a grid of folded cells, several across the width;
 *   it is drawn as one zigzag per bay. Vents and the rails' trusses are
 *   left out.
 * - The glass joints are drawn full width; the photos show them on the
 *   east face and as skylights across the roof.
 * - The west wings are plain boxes: no photo shows them clearly.
 */
import { Part, cross, sub, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cap, parapetRoof, rect, save, walls, type XY } from './chi-aon-center'

export const ANCHOR: [number, number] = [-99.1508078, 19.4474232]
export const BEARING = 2.25

const X0 = -17.4, X1 = 16.5 // west and east faces
const YS = -117.4, YN = 117.4 // south and north ends
const H = 22 // facade top, at the roof's valleys
const R = 2.6 // the roof's gables above the facade top
const G = 5.5 // ground storey
const BAY = 8, NBAY = 9, JOINT = 9
const BLOCK = BAY * NBAY // 72 m
/** The three blocks, south to north. */
const BLOCKS: [number, number][] = [0, 1, 2].map(k => {
  const y0 = YS + k * (BLOCK + JOINT)
  return [y0, y0 + BLOCK]
})

/** A quad wound to face along n. */
function quadN(p: Part, a: V3, b: V3, c: V3, d: V3, n: V3) {
  const g = cross(sub(b, a), sub(c, a))
  if (g[0] * n[0] + g[1] * n[1] + g[2] * n[2] >= 0) p.quad(a, b, c, d)
  else p.quad(a, d, c, b)
}
/** An axis box, walls and top. */
function box(p: Part, x0: number, y0: number, z0: number, x1: number, y1: number, z1: number) {
  const r = rect(x0, y0, x1, y1)
  walls(p, r, z0, z1)
  cap(p, r, z1)
}
/** A box with its vertical edges chamfered by c. */
function pier(p: Part, x0: number, y0: number, z0: number, x1: number, y1: number, z1: number, c = 0.2) {
  const r: XY[] = [[x0 + c, y0], [x1 - c, y0], [x1, y0 + c], [x1, y1 - c], [x1 - c, y1], [x0 + c, y1], [x0, y1 - c], [x0, y0 + c]]
  walls(p, r, z0, z1)
  cap(p, r, z1)
}
/** A panel on a long face (x = const), facing east (s = 1) or west (s = -1). */
function sidePanel(p: Part, x: number, s: number, y0: number, y1: number, z0: number, z1: number) {
  quadN(p, [x, y0, z0], [x, y1, z0], [x, y1, z1], [x, y0, z1], [s, 0, 0])
}
/** A panel on an end face (y = const), facing north (s = 1) or south (s = -1). */
function endPanel(p: Part, y: number, s: number, x0: number, x1: number, z0: number, z1: number) {
  quadN(p, [x0, y, z0], [x1, y, z0], [x1, y, z1], [x0, y, z1], [0, s, 0])
}

function build() {
  const concrete = new Part(), louvre = new Part(), win = new Part(), red = new Part(), glass = new Part(), garden = new Part()

  // The bar's walls, behind the piers and panels. The glass joints stand
  // proud of them, so one ring serves all three blocks.
  walls(concrete, rect(X0, YS, X1, YN), 0, H)

  // Long faces: concrete piers on every bay line, white louvres in two
  // tiers with a glass band between, the green clerestory under the eaves,
  // and the glazed ground storey.
  const PD = 0.6, PW = 0.9 // pier depth and width
  for (const [y0] of BLOCKS) {
    for (let k = 0; k <= NBAY; k++) {
      const y = y0 + k * BAY
      const a = k === 0 ? y : y - PW / 2, b = k === NBAY ? y : y + PW / 2
      pier(concrete, X0 - PD, a, 0, X0, b, H + 0.3)
      pier(concrete, X1, a, 0, X1 + PD, b, H + 0.3)
    }
    for (let k = 0; k < NBAY; k++) {
      const a = y0 + k * BAY + (k === 0 ? 0 : PW / 2), b = y0 + (k + 1) * BAY - (k === NBAY - 1 ? 0 : PW / 2)
      for (const [x, s] of [[X0 - 0.3, -1], [X1 + 0.3, 1]] as [number, number][]) {
        sidePanel(louvre, x, s, a, b, G, 13.2)
        sidePanel(louvre, x, s, a, b, 14.2, H - 1.6)
        const xw = x - s * 0.26
        sidePanel(win, xw, s, a, b, 13.2, 14.2)
        sidePanel(win, xw, s, a, b, H - 1.6, H - 0.2)
        sidePanel(win, xw, s, a, b, 0.4, G - 0.6)
      }
    }
  }

  // The red folded roof: per bay, a ridge across the bar at mid-bay and
  // valleys on the pier lines, white gables in both eaves, and three light
  // rails along its length.
  for (const [y0, y1] of BLOCKS) {
    for (let k = 0; k < NBAY; k++) {
      const va = y0 + k * BAY, vb = va + BAY, m = va + BAY / 2
      quadN(red, [X0, va, H], [X1, va, H], [X1, m, H + R], [X0, m, H + R], [0, -1, 1])
      quadN(red, [X0, m, H + R], [X1, m, H + R], [X1, vb, H], [X0, vb, H], [0, 1, 1])
      louvre.tri([X0, vb, H], [X0, va, H], [X0, m, H + R])
      louvre.tri([X1, va, H], [X1, vb, H], [X1, m, H + R])
    }
    for (const f of [0.25, 0.5, 0.75]) {
      const x = X0 + (X1 - X0) * f
      box(louvre, x - 0.35, y0 + 0.5, H + R - 0.1, x + 0.35, y1 - 0.5, H + R + 0.5)
    }
  }

  // The glass joints, standing 1.2 m proud of both long faces, with light
  // frame bands and a skylight roof.
  for (let k = 0; k < 2; k++) {
    const y0 = BLOCKS[k][1], y1 = BLOCKS[k + 1][0]
    const r = rect(X0 - 1.2, y0, X1 + 1.2, y1)
    walls(glass, r, 0, H + 0.4)
    cap(glass, r, H + 0.4)
    for (const z of [G, 11, 16.5]) walls(louvre, rect(X0 - 1.3, y0 - 0.1, X1 + 1.3, y1 + 0.1), z, z + 0.4)
  }

  // End walls: solid concrete on the east, glazed on the west with deep
  // balcony slabs. The south glazing starts above the entrance box.
  const GW = X1 - 11 // east edge of the glazing
  for (const [y, s, z0] of [[YS, -1, 8.2], [YN, 1, 0.6]] as [number, number, number][]) {
    endPanel(win, y + s * 0.04, s, X0 + 1.4, GW, z0, H - 1.2)
    for (const z of [z0 < 5 ? G : 0, 11, 16.5].filter(Boolean)) {
      const yo = y + s * 1.1
      box(concrete, X0 + 1.4, Math.min(y, yo), z, GW, Math.max(y, yo), z + 0.6)
    }
  }

  // The entrance box on the south end: concrete with a sunken terrace.
  const ENT = rect(-11.2, -134.4, 12.6, YS)
  walls(concrete, ENT, 0, 7.5)
  parapetRoof(concrete, concrete, ENT, 7.5, 0.6, 1.0)

  // The low wings on the west, with planted roofs.
  for (const r of [rect(-55.3, 61.4, X0, 98.1), rect(-47.1, -70.8, X0, -50.1)]) {
    walls(concrete, r, 0, 4.5)
    parapetRoof(concrete, garden, r, 4.5, 0.5, 0.4)
  }

  return [
    { part: concrete, material: finish('vasconcelos-concrete', 0xc9c5bc) },
    { part: louvre, material: finish('vasconcelos-louvre', 0xeceeeb) },
    { part: win, material: { ...PALETTE.window, color: 0x6c8d89 } },
    { part: red, material: finish('vasconcelos-red', 0xc4553f) },
    { part: glass, material: { ...PALETTE.glass, color: 0x667a80 } },
    { part: garden, material: finish('garden-roof', 0x93a57f) },
  ]
}

if (import.meta.main) {
  const parts = build()
  for (const { part, material } of parts) console.log(material.name.padEnd(22), part.triangles)
  await save('mexico-city-biblioteca-vasconcelos', 'Biblioteca Vasconcelos', ANCHOR, BEARING, parts, 5000)
}
