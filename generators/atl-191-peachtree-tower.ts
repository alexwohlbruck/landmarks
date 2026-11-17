/**
 * 191 Peachtree Tower, Atlanta (1990, Johnson/Burgee Architects with
 * Kendall/Heaton) — original procedural geometry, CC0-1.0.
 * bun generators/atl-191-peachtree-tower.ts
 *
 * Uses the B2 kit exported from generators/atl-westin-peachtree-plaza.ts.
 *
 * Map frame: x east, y north, z up, metres, turned to the placement's
 * bearing (1°: OSM's edges run at 1° and 91°). Anchor = centroid of the
 * outline OSM way/261043963 ("191 Peachtree Tower", height 234.7, 50
 * levels), 33.759008, -84.386903.
 *
 * Identity: two square granite towers side by side, joined by a recessed
 * middle section, each crowned by an open temple-like pavilion of columns
 * with urns at its corners, over a stepped attic with small corner domes.
 * The towers' corners are notched above a 45 m base; the faces carry tall
 * glass strips in the middle and punched windows at the sides. The
 * pavilions are floodlit at night.
 *
 * Evidence:
 *  - plan: OSM way/261043963 and its parts way/537432531 (the slab with
 *    the middle recesses), way/537432532 and way/537432533 (the two
 *    towers) and way/886346709 (the low west wing), plus the 3-level parts
 *    way/886346695, /698, /701 inside the outline.
 *  - heights: USGS 3DEP lidar GA_Statewide_B2_2018 (2018 flight), 1 m
 *    grid centred on the anchor, above ground_min 319.3 m (the street on
 *    the east; Mapterhorn's low point under the footprint is the same
 *    side). Measured: pavilion entablature 232.6, the floor inside the
 *    colonnade 220, corner domes 216, attic 212.6, tower roof edge 203–204,
 *    middle section 208–209, base and corner notches 44–45, west wing 36–42
 *    (39 used), east canopy 10. Published: 234.7 m to the top, 50 floors
 *    (Wikipedia, OSM). The urns that take the top to 234.7 are too small for
 *    the lidar; their size is estimated from Carey's south photo.
 *  - The lidar footprint sits about 1 m south of OSM's; OSM is followed.
 *  - ground: Mapterhorn falls about 6 m from the west wing to the east
 *    side; y = 0 is the east side; elevation 0.
 *  - colour: pale warm granite (all photos), dark slate windows.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - 191-peachtree-south.jpg, Connor.carey, CC BY-SA 3.0 (the two towers
 *    and pavilions from the south-west)
 *    https://commons.wikimedia.org/wiki/File:191-peachtree-south.jpg
 *  - 191-peachtree-rear.jpg, Connor.carey, CC BY-SA 3.0 (the base)
 *    https://commons.wikimedia.org/wiki/File:191-peachtree-rear.jpg
 *  - 191 Peachtree Tower viewed from the plaza of the Georgia Pacific
 *    Center in downtown Atlanta.jpg, Marc Merlin, CC BY-SA 4.0 (from the
 *    south)
 *    https://commons.wikimedia.org/wiki/File:191_Peachtree_Tower_viewed_from_the_plaza_of_the_Georgia_Pacific_Center_in_downtown_Atlanta.jpg
 *  - Looking east down Forsyth Street toward 191 Peachtree Tower from
 *    Fairlie-Poplar.jpg, Marc Merlin, CC BY-SA 4.0 (from the west)
 *    https://commons.wikimedia.org/wiki/File:Looking_east_down_Forsyth_Street_toward_191_Peachtree_Tower_from_Fairlie-Poplar.jpg
 *  - 191 Peachtree Tower, Atlanta, GA (47421491962).jpg, Warren LeMay, CC0
 *    (the entrance front)
 *    https://commons.wikimedia.org/wiki/File:191_Peachtree_Tower,_Atlanta,_GA_(47421491962).jpg
 *  - Westin Peachtree Plaza Hotel, 191 Peachtree Tower.jpg, AAK, public
 *    domain (the broad face and both crowns, from the south-west)
 *    https://commons.wikimedia.org/wiki/File:Westin_Peachtree_Plaza_Hotel,_191_Peachtree_Tower.jpg
 *  - 191 Peachtree Tower (8564151340).jpg, Sheila Sund, CC BY 2.0
 *    https://commons.wikimedia.org/wiki/File:191_Peachtree_Tower_(8564151340).jpg
 *  - 191 Peachtree Westin.jpg, Michael Hohimer, CC BY 2.0
 *    https://commons.wikimedia.org/wiki/File:191_Peachtree_Westin.jpg
 * Night: the dusk photo Westin_Peachtree_Plaza_Hotel.jpg (Ncsr111, CC BY-SA
 * 4.0) shows the crowns lit warm white; they carry `_FLOODLIGHT`.
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the arched base windows, the cornices every dozen floors and
 * the columns' fine detail are left out; the pavilion has two columns a
 * side between its corner piers (the real one has more, finer ones).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { box, ccw, circle, edgePanels, prism, save, smoothWall, type PanelOpts, type XY } from './atl-westin-peachtree-plaza'

const granite = new Part(), trim = new Part(), win = new Part(), roof = new Part(), dark = new Part()

const BASE = 45, EDGE = 203.5, ATTIC = 212.6, PLINTH = 220, COL = 229.6, ENT = 232.6
const Y0 = -18.3, Y1 = 17.8 // the towers' south and north faces
const MID = 14.9 // the line between the two towers
const HW = 15.4 // each tower's half-width east-west (31 m towers)
const N = 3 // corner notch above the base

// ── The base: the whole tower outline to 45 m (lidar 44–45), the west wing
// to 39 m, and the low east canopy. ──
box(granite, -22.8, 52.8, Y0, Y1, 0, BASE, roof, 0.5)
const wing: XY[] = ccw([[-22.8, 17.5], [-11.5, 17.6], [-11.5, 24.7], [-51.2, 24.5], [-51.1, 11.9], [-48.5, 11.9], [-48.4, -13.9], [-51.5, -13.9], [-51.5, -24.3], [-39.4, -24.3], [-12.1, -24.1], [-12.1, -18.4], [-22.5, -18.4]])
const split = (ring: XY[], step = 5): XY[] => ring.flatMap((a, i) => {
  const b = ring[(i + 1) % ring.length], L = Math.hypot(b[0] - a[0], b[1] - a[1]), k = Math.max(1, Math.ceil(L / step))
  return Array.from({ length: k }, (_, j) => [a[0] + ((b[0] - a[0]) * j) / k, a[1] + ((b[1] - a[1]) * j) / k] as XY)
})
prism(granite, split(wing), 0, 39, roof, 0.5)
box(granite, 52.6, 57.4, -14, 14, 0, 10, roof, 0.3)

// Base windows: tall panels, the arched windows' storeys.
const baseOpts: PanelOpts = { group: 16, gap: 3, bay: 3.2, pier: 1.6, margin: 1.5 }
edgePanels(win, [52.8, Y1], [-22.8, Y1], 12, BASE - 3, baseOpts)
edgePanels(win, [-22.8, Y0], [52.8, Y0], 12, BASE - 3, baseOpts)
edgePanels(win, [57.4, -14], [57.4, 14], 3, 9, { ...baseOpts, group: 6, gap: 0.5 })
edgePanels(win, [52.8, 14], [52.8, Y1], 12, BASE - 3, baseOpts)
edgePanels(win, [52.8, Y0], [52.8, -14], 12, BASE - 3, baseOpts)
for (const [a, b] of [[[-11.5, 24.7], [-51.2, 24.5]], [[-51.5, -24.3], [-12.1, -24.1]], [[-51.1, 11.9], [-51.5, -13.9]]] as [XY, XY][]) edgePanels(win, a, b, 10, 36, { ...baseOpts, group: 13 })

// ── The middle section: the same granite, recessed to ±12.5 m, to 209 m,
// with a band of glass strips down its middle. ──
box(granite, MID - 7, MID + 7, -12.5, 12.5, BASE, 209, roof, 0.4)
for (const [a, b] of [[[MID + 7, 12.5], [MID - 7, 12.5]], [[MID - 7, -12.5], [MID + 7, -12.5]]] as [XY, XY][]) {
  edgePanels(dark, a, b, BASE + 2, 206, { group: 12, gap: 1.6, bay: 2.4, pier: 1.2, margin: 1.4 })
}

// Tower face windows: tall glass strips in the middle, punched windows at the sides.
const stripOpts: PanelOpts = { group: 12, gap: 0.9, bay: 2.6, pier: 0.8, margin: 0.4 }
const punchOpts: PanelOpts = { group: 12, gap: 2.4, bay: 2.2, pier: 1.5, margin: 0.8 }
function face(a: XY, b: XY, z0: number, z1: number, mid: number) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
  const P = (s: number): XY => [a[0] + t[0] * s, a[1] + t[1] * s]
  const s0 = (L - mid) / 2, s1 = (L + mid) / 2
  edgePanels(win, P(0), P(s0), z0, z1, punchOpts)
  edgePanels(win, P(s0), P(s1), z0, z1, stripOpts)
  edgePanels(win, P(s1), P(L), z0, z1, punchOpts)
}

// ── The two towers. ──
for (const cx of [MID - 7 - HW, MID + 7 + HW]) {
  const x0 = cx - HW, x1 = cx + HW
  // Notched corners above the base.
  const shaft: XY[] = [
    [x0 + N, Y0], [x1 - N, Y0], [x1 - N, Y0 + N], [x1, Y0 + N], [x1, Y1 - N], [x1 - N, Y1 - N],
    [x1 - N, Y1], [x0 + N, Y1], [x0 + N, Y1 - N], [x0, Y1 - N], [x0, Y0 + N], [x0 + N, Y0 + N],
  ]
  prism(granite, shaft, BASE, EDGE, roof, 0.5)
  face([x1 - N, Y1], [x0 + N, Y1], BASE + 2, EDGE - 3, 12)
  face([x0 + N, Y0], [x1 - N, Y0], BASE + 2, EDGE - 3, 12)
  face([x0, Y1 - N], [x0, Y0 + N], BASE + 2, EDGE - 3, 13)
  face([x1, Y0 + N], [x1, Y1 - N], BASE + 2, EDGE - 3, 13)

  // The attic, stepped in, with a small dome at each corner.
  const ax0 = x0 + 3.5, ax1 = x1 - 3.5, ay0 = Y0 + 3, ay1 = Y1 - 3
  box(trim, ax0, ax1, ay0, ay1, EDGE - 1, ATTIC, roof, 0.5)
  for (const [dx, dy] of [[ax0 + 2.4, ay0 + 2.4], [ax1 - 2.4, ay0 + 2.4], [ax1 - 2.4, ay1 - 2.4], [ax0 + 2.4, ay1 - 2.4]] as XY[]) {
    // A hemisphere, 2.3 m in radius, five rings.
    const R = 2.3, rings = 3
    for (let k = 0; k < rings; k++) {
      const a0 = (k / rings) * (Math.PI / 2), a1 = ((k + 1) / rings) * (Math.PI / 2)
      const r0 = R * Math.cos(a0), r1 = R * Math.cos(a1), z0 = ATTIC + R * Math.sin(a0), z1 = ATTIC + R * Math.sin(a1)
      const c0 = circle([dx, dy], r0, 12), c1 = circle([dx, dy], Math.max(r1, 0.01), 12)
      for (let i = 0; i < 12; i++) {
        const j = (i + 1) % 12
        const nn = (c: XY, z: number): V3 => {
          const v: V3 = [c[0] - dx, c[1] - dy, z - ATTIC], l = Math.hypot(...v)
          return [v[0] / l, v[1] / l, v[2] / l]
        }
        const A: V3 = [...c0[i], z0], B: V3 = [...c0[j], z0], C: V3 = [...c1[j], z1], D: V3 = [...c1[i], z1]
        trim.tri(A, B, C, undefined, undefined, undefined, [nn(c0[i], z0), nn(c0[j], z0), nn(c1[j], z1)])
        if (k < rings - 1) trim.tri(A, C, D, undefined, undefined, undefined, [nn(c0[i], z0), nn(c1[j], z1), nn(c1[i], z1)])
      }
    }
  }

  // The pavilion: a plinth, a colonnade of corner piers and two columns a
  // side, an entablature ring and an urn at each corner.
  const H = 8, pc: XY = [cx, -1]
  box(trim, pc[0] - H - 0.6, pc[0] + H + 0.6, pc[1] - H - 0.6, pc[1] + H + 0.6, ATTIC - 0.5, PLINTH, roof, 0.5)
  const P = 2.6, C = 1.1
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
    const px = pc[0] + sx * (H - P / 2), py = pc[1] + sy * (H - P / 2)
    box(trim, px - P / 2, px + P / 2, py - P / 2, py + P / 2, PLINTH, COL, trim, 0.3)
    // The urn: a squat drum and ball.
    smoothWall(trim, circle([px, py], 0.9, 8), ENT, ENT + 1.2)
    const ball = circle([px, py], 0.6, 8)
    trim.loft([ball.map(([x, y]) => [x, y, ENT + 1.2] as V3), circle([px, py], 0.05, 8).map(([x, y]) => [x, y, ENT + 2.1] as V3)])
  }
  for (const s of [-H / 3, H / 3]) {
    for (const [x, y] of [[pc[0] + s, pc[1] - H + C / 2], [pc[0] + s, pc[1] + H - C / 2], [pc[0] - H + C / 2, pc[1] + s], [pc[0] + H - C / 2, pc[1] + s]] as XY[]) {
      box(trim, x - C / 2, x + C / 2, y - C / 2, y + C / 2, PLINTH, COL, trim, 0.2)
    }
  }
  // Entablature: a square ring 2.2 m deep.
  const E = 2.2
  box(trim, pc[0] - H, pc[0] + H, pc[1] + H - E, pc[1] + H, COL, ENT, trim, 0.3)
  box(trim, pc[0] - H, pc[0] + H, pc[1] - H, pc[1] - H + E, COL, ENT, trim, 0.3)
  box(trim, pc[0] - H, pc[0] - H + E, pc[1] - H + E, pc[1] + H - E, COL, ENT, trim, 0.3)
  box(trim, pc[0] + H - E, pc[0] + H, pc[1] - H + E, pc[1] + H - E, COL, ENT, trim, 0.3)
}

// Floodlight: the crowns, fading up the top of the shafts.
const lit = (p: V3, n: V3) => (n[2] > 0.7 ? 0.2 : 1) * Math.min(1, Math.max(0, (p[2] - 185) / 25))

await save('atl-191-peachtree-tower', '191 Peachtree Tower', [
  { part: granite, material: { ...finish('peachtree-191-granite', 0xe3d9c9), floodlight: lit } },
  { part: trim, material: { ...finish('peachtree-191-crown', 0xeee5d6), floodlight: lit } },
  { part: win, material: PALETTE.window },
  { part: dark, material: windowVariant(2, 0x7d8e9b) }, // the recessed middle's glass
  { part: roof, material: PALETTE.roof },
], { height: 234.7, anchor: [33.759008, -84.386903], bearing: 1 }, 6500)
