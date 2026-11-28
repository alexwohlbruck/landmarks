/**
 * One AT&T Center (909 Chestnut St; One Bell Center), St. Louis (1986;
 * Hellmuth, Obata + Kassabaum) — original procedural geometry, CC0-1.0.
 * bun generators/stl-att-tower.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground. Bearing 17.2, the downtown street grid: +x runs along the
 * slab's long axis (Chestnut St), +y north towards Pine St. Anchor = the
 * centroid of OSM way/108706673, -90.1945206, 38.627842.
 *
 * Identity (from the photos below):
 *  1. A long slab of pale grey-tan granite with small punched windows in a
 *     tight grid; its ends cut by big chamfers lined with dark recessed
 *     windows.                                                    (p1, p4)
 *  2. Deep stepped notches down all four corners, lined with dark recessed
 *     windows; over them the top rises in stepped stages to five tall
 *     chamfered masses across the core, so the top reads as a stepped,
 *     notched skyline.                                         (p1–p4, lidar)
 *  3. A low stepped granite podium along Chestnut St to the south.     (p1)
 *
 * Note on the brief: it describes "red/brown granite and glass". Every
 * photo here (2009–2014) shows pale grey-tan granite (OSM building:colour
 * #d2c7bc agrees), so the model follows the photos.
 *
 * Plan: OSM way/108706673 (the whole site) and part way/481461446 (the
 * tower), turned to bearing 17.2: tower x ±38.5, y -12.5 to 30.4, its ends
 * chamfered from x ±24.8 out to the 16.7 m end faces; the podium is the rest
 * of the outline south to y -35, with a saw-tooth south front.
 *
 * Heights: USGS 3DEP lidar USGS_LPC_MO_StLouis_2017_LAS_2018 (flown 2017),
 * 1 m grid with class 18 kept, read with tools/lidar_frame.py. y = 0 is the
 * lowest ground under the footprint, on the east (0.4 m over the box's
 * ground_min; the ground rises 4.6 m to the north, 3.4 m to the south).
 * Measured: the shaft's top and the long-face setbacks 167.8 (corners 159.6),
 * the upper stage 175.4 (x ±36, y -6..24), the towerlets 181.5–183.4
 * (published 179 m to the roof; 588 ft), the podium 17.6, 22.1, 27.0.
 * Review round 1: the plan is rebuilt from the lidar's top view (1 m, all
 * returns): OSM's diagonal corner chamfers are really three steps each
 * (x ±26 for the long faces' full depth y -13..30; x ±33 for y -7..24;
 * x ±38.5 for the end faces y -1..18; the steps' outer corners lie on OSM's
 * diagonals). Stage heights per step: 159.6 at the outermost corner step,
 * 167.8 the long faces' middles (x ±21) and the second step, 175.4 the core
 * and the end bays, and five masses x -33..-28.5, -22..-13, -5..6, 10..22,
 * 27..31.5 (y -1..18) at 183.0, 182.6, 183.6, 182.6, 183.0. p3 and p4 show
 * the notches running the full height with dark bands in them; that the
 * steps run down to the ground is from p4 (the end faces' dark bands reach
 * the base) and is an estimate for the lowest floors.
 * Estimated: window bays (~3.5 m, two storeys a panel) from p1.
 * Left out: the AT&T logo (removed since; the tower stands empty), the
 * rooftop mechanical grid, the podium's railings.
 *
 * Night: the building is vacant; windows still use `window` (the map lights
 * them), no floodlighting.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  p1  "One AT&T Center.jpg", Matthew Black, CC BY-SA 2.0 (from the south-east)
 *  p2  "One AT&T Center - Saint Louis, Missouri - April 1, 2014.jpg",
 *      Lee Ann Ratledge, CC BY 4.0 (the crown, close up)
 *  p3  "AT&T Center, St- Louis, MO- 2014-04-21 13-26.jpg", Carbone1979, CC BY-SA 3.0
 *  p4  "909 chestnut street.jpg", Johnhochi, CC BY-SA 4.0
 * No look-only sources. No commercial imagery.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { cornice, prism, save, type XY } from './atl-tech-tower'
import { ccw, edgePanels } from './atl-flatiron-building'

const gran = new Part(), win = new Part(), dark = new Part(), roof = new Part()
const tri = (p: Part, a: V3, b: V3, c: V3, out: XY) => {
  const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  const n = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2]]
  if (n[0] * out[0] + n[1] * out[1] >= 0) p.tri(a, b, c); else p.tri(a, c, b)
}
const quad = (p: Part, a: V3, b: V3, c: V3, d: V3, out: XY) => { tri(p, a, b, c, out); tri(p, a, c, d, out) }
/** A chamfered rectangle. */
const cham = (x0: number, x1: number, y0: number, y1: number, c: number): XY[] => ccw([[x0 + c, y0], [x1 - c, y0], [x1, y0 + c], [x1, y1 - c], [x1 - c, y1], [x0 + c, y1], [x0, y1 - c], [x0, y0 + c]])

const SHAFT = 167.8, UPPER = 175.4
const TOWER: XY[] = ccw([[-25.1, -12.5], [24.8, -12.5], [38.5, -0.6], [38.5, 16.1], [24.8, 30.4], [-25.1, 30.4], [-38.4, 16.1], [-38.4, -0.6]])
const opts = { group: 7.8, gap: 2.0, bay: 3.5, pier: 1.6, margin: 1.4, out: 0.06, min: 5 }

function faces(ring: XY[], z0: number, z1: number, o = opts) {
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const diag = Math.abs(b[0] - a[0]) > 2 && Math.abs(b[1] - a[1]) > 2
    if (diag) {
      // the chamfers: bands of dark recessed windows, one per two storeys
      const t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [t[1], -t[0]]
      const P = (s: number, z: number): V3 => [a[0] + t[0] * s + n[0] * 0.07, a[1] + t[1] * s + n[1] * 0.07, z]
      for (let z = z0 + 3; z < z1 - 3; z += 7.8) quad(dark, P(1.6, z), P(L - 1.6, z), P(L - 1.6, z + 5.4), P(1.6, z + 5.4), n)
    } else edgePanels(win, a, b, z0 + 2, z1 - 1.5, o)
  }
}

// ── The tower: a stepped cross in plan, rising in stages ──
// The lidar's top view (1 m, all returns) shows the corners are not chamfers
// but three deep steps — the notches that run down the corners, lined with dark
// recessed windows (p1, p3, p4) — and the top rising in stages over them:
// corner steps 159.6, the long faces' middles 167.8, the ends and the core
// 175.4, and five tall masses across the core to 182.5–183.6.
const A = 159.6
type Blk = [number, number, number, number, number] // x0, x1, y0, y1, top
const blocks: Blk[] = [
  [-26, 26, -13, 30, A], // the corners' outer steps
  [-21, 21, -13, 30, SHAFT], // the long faces' middles
  [-33, 33, -7, 24, SHAFT], // the second step out towards the ends
  [-26, 26, -7, 24, UPPER], // the core
  [-38.5, 38.5, -1, 18, UPPER], // the end bays, carried to the narrow end faces
]
// which faces line the corner notches (dark recessed windows): per block, x-sides / y-sides
const notchSides: [boolean, boolean][] = [[true, false], [true, false], [true, true], [false, false], [false, true]]
// is a point (just outside a face) hidden inside another block at height zz?
const hidden = (q: XY, zz: number) => blocks.some(([x0, x1, y0, y1, z]) => q[0] > x0 && q[0] < x1 && q[1] > y0 && q[1] < y1 && zz < z) || (zz < 27.5 && q[1] < -12.5 && Math.abs(q[0]) < 32)
blocks.forEach(([x0, x1, y0, y1, z], bi) => {
  const r = ccw([[x0, y0], [x1, y0], [x1, y1], [x0, y1]])
  prism(gran, r, 0, z, roof, 0.35)
  for (let i = 0; i < 4; i++) {
    const a = r[i], b = r[(i + 1) % 4], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [t[1], -t[0]]
    const P = (s: number, zz: number, o = 0.07): V3 => [a[0] + t[0] * s + n[0] * o, a[1] + t[1] * s + n[1] * o, zz]
    const out = (s: number): XY => [a[0] + t[0] * s + n[0] * 0.3, a[1] + t[1] * s + n[1] * 0.3]
    const xSide = Math.abs(b[0] - a[0]) < 0.01
    if (xSide ? notchSides[bi][0] : notchSides[bi][1]) {
      // a notch face: bands of dark recessed windows, one per two storeys
      for (let zz = 8.5; zz < z - 3; zz += 7.8) {
        // the visible runs of this face at this height, sampled every 0.5 m
        let run0 = -1
        for (let s0 = 0.25; s0 <= L; s0 += 0.5) {
          const vis = s0 < L - 0.1 && !hidden(out(s0), zz + 2.5)
          if (vis && run0 < 0) run0 = s0 - 0.25
          if (!vis && run0 >= 0) {
            const e = s0 - 0.25
            if (e - run0 > 2.2) quad(dark, P(run0 + 0.9, zz), P(e - 0.9, zz), P(e - 0.9, zz + 5.0), P(run0 + 0.9, zz + 5.0), n)
            run0 = -1
          }
        }
      }
      continue
    }
    // punched windows grouped two storeys a panel, only where the face is seen
    const bays = Math.max(1, Math.round((L - 2.8) / 3.5)), w = (L - 2.8) / bays
    for (let k = 0; k < bays; k++) {
      const s0 = 1.4 + k * w + 0.8, s1 = 1.4 + (k + 1) * w - 0.8, c = (s0 + s1) / 2
      for (let zz = 7.5; zz + 5.8 < z - 1.5; zz += 7.8) {
        if (hidden(out(c), zz + 3)) continue
        // a taller block sharing this face draws it instead
        const f: XY = [a[0] + t[0] * c, a[1] + t[1] * c]
        if (blocks.some(([u0, u1, v0, v1, zt], bj) => bj !== bi && zt > z && f[0] >= u0 - 0.01 && f[0] <= u1 + 0.01 && f[1] >= v0 - 0.01 && f[1] <= v1 + 0.01 && zz + 3 < zt)) continue
        quad(win, P(s0, zz, 0.06), P(s1, zz, 0.06), P(s1, zz + 5.8, 0.06), P(s0, zz + 5.8, 0.06), n)
      }
    }
  }
})
// the five tall masses across the core (lidar 182.5–183.6; chamfered, p2)
const masses: [number, number, number][] = [[-33, -28.5, 183.0], [-22, -13, 182.6], [-5, 6, 183.6], [10, 22, 182.6], [27, 31.5, 183.0]]
for (const [x0, x1, z] of masses) {
  const r = cham(x0, x1, -1, 18, 1.4)
  prism(gran, r, UPPER - 0.3, z, roof, 0.3)
  cornice(gran, r, z - 0.7, 0.7, 0.25, roof)
  faces(r, UPPER, z, { ...opts, group: 7.2, min: 3, margin: 0.8 })
}

// ── The podium: the rest of the site south of the tower, stepped ──
const POD: XY[] = ccw([[-38.4, -0.6], [-38.7, -16.8], [-37.1, -18.6], [-34.1, -18.6], [-32.5, -17.0], [-32.5, -21.2], [-30.9, -22.9], [-27.9, -23.0], [-26.3, -21.5], [-26.2, -25.9], [-24.6, -27.5], [-21.8, -27.5], [-20.3, -26.1], [-20.1, -29.7], [-18.8, -31.3], [-15.9, -31.4], [-14.4, -29.9], [-14.4, -33.3], [-12.8, -35.1], [-9.6, -35.1], [-7.9, -33.4], [-7.8, -30.7], [6.7, -30.8], [6.7, -33.7], [8.7, -35.3], [11.8, -35.3], [13.3, -33.8], [13.4, -30.1], [15.1, -31.7], [17.8, -31.7], [19.3, -30.1], [19.4, -26.6], [21.2, -28.1], [23.9, -28.1], [25.6, -26.4], [25.6, -22.0], [27.4, -23.8], [30.1, -23.7], [31.7, -22.0], [31.7, -18.0], [33.3, -19.5], [36.7, -19.5], [38.1, -17.7], [38.5, -0.6], [24.8, -12.5], [-25.1, -12.5]])
prism(gran, POD, 0, 17.6, roof, 0.3)
for (const [x0, x1, y0, y1, z] of [[-30, 30, -24, -12.5, 22.1], [-24, 24, -19.5, -12.5, 27.0]] as [number, number, number, number, number][]) {
  const r = cham(x0, x1, y0, y1, 2.0)
  prism(gran, r, 17.0, z, roof, 0.3)
  faces(r, 17.6, z, { ...opts, group: 4.4, min: 3 })
}
for (let i = 0; i < POD.length; i++) {
  const a = POD[i], b = POD[(i + 1) % POD.length]
  if (Math.hypot(b[0] - a[0], b[1] - a[1]) > 3.5 && a[1] < -12.6 && b[1] < -12.6) edgePanels(win, a, b, 5.0, 16.4, { group: 5.6, gap: 1.6, bay: 3.2, pier: 1.4, margin: 0.8, out: 0.06, min: 3.5 })
}

await save('stl-att-tower', 'One AT&T Center', [
  { part: gran, material: finish('stl-att-granite', 0xddd3c7) },
  { part: win, material: PALETTE.window },
  { part: dark, material: windowVariant(2, 0x50555b) },
  { part: roof, material: PALETTE.roof },
], { height: 183.4, anchor: [38.627842, -90.1945206], bearing: 17.2 }, 6500)
