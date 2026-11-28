/**
 * Koutoubia Mosque, Marrakesh (Almohad, 1147-58; minaret finished about
 * 1190): procedural, CC0-1.0.
 * bun generators/marrakesh-koutoubia.ts
 *
 * Uses the Moroccan kit exported from casablanca-hassan-ii-mosque.ts.
 *
 * Frame: x along the minaret's north-east face and the qibla wall (bearing
 * 70.6), y along the mosque's east wall (bearing 340.6), z up, metres.
 * Placed at bearing 340.6: the minaret's square (OSM way/364034893, edges
 * 70.7 / 160.5 degrees) and the prayer hall's east wall (160) share it.
 * Anchor: the area centroid of the outline multipolygon relation/12255861
 * (outer way/902371326 less the courtyard way/902371325 and the light court
 * way/902371324), -7.993552, 31.623696.
 *
 * Evidence
 * - OSM (ODbL), fetched 2026-11: outline relation/12255861; minaret shaft
 *   way/364034893 (h 62), lantern way/364034894 (62-69), dome
 *   way/364041064 (69-71); the sixteen nave roofs way/902371293-308 (h 10,
 *   hipped), the raised axial nave way/902371287-292 (h 11), the qibla
 *   transept way/364034885, /887, /889, /892 (h 13, roof height 2) with its
 *   five domed bays way/364040550-554 (h 14.5, pyramidal), the west
 *   side-rooms way/902371318-322 (7.5-9) and the north gallery
 *   way/902371323 (h 9, flat). OSM tags the roofs #D9BEA3.
 * - Published (Wikipedia, "Kutubiyya Mosque"): minaret 77 m including the
 *   spire, 12.8 m square; the main shaft about five times its width.
 * - Photos (Wikimedia Commons):
 *   mzx2: File:Koutoubia_(11277940404).jpg, Mzximvs VdB, CC BY-SA 2.0 (the NE face, far off: every stage height)
 *   furt: File:Das_Minarett_der_Koutoubia-Moschee,_Marrakesch_-_panoramio.jpg, Martin Furtschegger, CC BY 3.0
 *   gardens: File:Blick_von_den_Koutoubia-Gärten_auf_Moschee_und_Minarett,_Marrakesch_-_panoramio.jpg, Martin Furtschegger, CC BY 3.0
 *   haklai: File:Koutoubia_Minaret-Marrakech.jpg, Yair Haklai, CC BY-SA 4.0
 *   astesana: File:Koutoubia's_Minaret_(216279933).jpg, Jean-Marc Astesana, CC BY-SA 2.0
 *   schmitt05: File:1158_wurde_die_Koutoubia-Moschee_in_Marrakesch_eröfnet._05.jpg, Holger Uwe Schmitt, CC BY-SA 4.0
 *   aerial446 / aerial288: File:ETH-BIB-Marrakech_aus_200_m_Höhe,_im_Vordergrund-_La_Koutoubia-Tschadseeflug_1930-31-LBS_MH02-08-0446.tif
 *     and ..._aus_der_Luft-..._0288.tif, Walter Mittelholzer 1930-31, public domain (the hall's parallel roofs)
 *   plan: File:Floor_plan_of_the_Kutubiyya_Mosques_(with_labels).png, R Prazeres, CC BY-SA 4.0
 *
 * Numbers
 * - Minaret: 12.8 m square (published); stages read off mzx2 at 0.052 m a
 *   pixel (the face's 12.8 m over 247 px) and hung from the published 77 m
 *   tip: merlon tips 62.6 (OSM 62), zellige band 58.5-60.9, the lobed
 *   arcade 52.6-58, the paired windows 46.3-50, the great lobed panel
 *   38-44.7, the lower panel 25.3-30; lantern 7.8 m square to 71.2 with its
 *   tile band, sebka panel and paired windows; dome to 71.9; three gilded
 *   balls at 73.2, 74.9 and 76.2 (radii 1.0, 0.55, 0.4); tip 77.
 * - Every face of the shaft is drawn with the north-east face's stages;
 *   the real faces differ in their panels (photos show the others share
 *   the same zones and band).
 * - Hall: footprints and roof heights OSM; walls 8 m under the roofs
 *   (estimated from OSM's 10 m naves with 2 m roofs); roofs pale tile, as
 *   in the gardens photo and OSM's roof colour (not green).
 * - Estimated: door and courtyard arcade spacing.
 * - Look-only references: none.
 * - Doubts: the mihrab block behind the qibla wall (way/904153221-223) and
 *   the buildings outside the outline are left to the map; the west
 *   side-rooms are plain boxes.
 *
 * Night: the minaret is floodlit (`_FLOODLIGHT`); its windows are `window`.
 */
import { Part, type V3 } from './mesh'
import { writeModel } from './london-buckingham-palace'
import {
  add, arch, at, ball, block, ccw, edgeFace, fquad, ftri, frustum, inlay, lathe, materials, merlons, mats, mergeMats, normalOf, obox, prism, pyramid,
  rectRing, rectST, sebka, wall, type Face, type Mats, type Niche, type XY,
} from './casablanca-hassan-ii-mosque'
import { polyTris } from './berlin-oberbaum-bridge'

export const ID = 'marrakesh-koutoubia'
export const BEARING = 340.6
const scl = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]

/** Four faces of a square tower centred on the origin, chamfer c, faces on ±x, ±y. */
export function squareFaces(W: number, c: number): Face[] {
  const h = W / 2
  return [0, 1, 2, 3].map((k) => {
    const a = (k * Math.PI) / 2, n: V3 = [Math.cos(a), Math.sin(a), 0], u: V3 = [-Math.sin(a), Math.cos(a), 0]
    return { o: add(scl(n, h), scl(u, -(h - c))), u, v: [0, 0, 1] }
  })
}
/** The chamfer strips between a tower's faces, t0 to t1. */
export function chamferStrips(p: Part, faces: Face[], Wf: number, t0: number, t1: number) {
  for (let k = 0; k < 4; k++) {
    const f = faces[k], g = faces[(k + 1) % 4]
    const n = add(normalOf(f), normalOf(g))
    fquad(p, at(f, Wf, t0), at(g, 0, t0), at(g, 0, t1), at(f, Wf, t1), n)
  }
}
/** A proud band right round a chamfered square tower. */
export function towerBand(p: Part, faces: Face[], Wf: number, t0: number, t1: number, out: number) {
  const e = out * 0.414
  for (const f of faces) obox(p, f, -e, Wf + e, t0, t1, 0, out, true)
  for (let k = 0; k < 4; k++) {
    const f = faces[k], g = faces[(k + 1) % 4], n = add(normalOf(f), normalOf(g))
    const a = at(f, Wf + e, 0, out), b = at(g, -e, 0, out), a0 = at(f, Wf, 0), b0 = at(g, 0, 0)
    const Z = (p: V3, z: number): V3 => [p[0], p[1], z]
    fquad(p, Z(a, t0), Z(b, t0), Z(b, t1), Z(a, t1), n)
    fquad(p, Z(a0, t1), Z(b0, t1), Z(b, t1), Z(a, t1), [0, 0, 1])
    fquad(p, Z(a0, t0), Z(b0, t0), Z(b, t0), Z(a, t0), [0, 0, -1])
  }
}

function minaret(): Mats {
  const M = mats()
  const W = 12.8, c = 0.2, Wf = W - 2 * c, cs = Wf / 2
  const faces = squareFaces(W, c)
  for (const f of faces) {
    const n: Niche[] = []
    // the lobed arcade under the tiles: five arches in a recessed frame, intersecting-arc sebka over them
    const arcade: Niche[] = []
    for (let i = -2; i <= 2; i++) arcade.push({ poly: arch(cs + i * 2.1 - 0.95, cs + i * 2.1 + 0.95, 52.75, 55.2, 'pointed', 4), depth: 0.45, back: M.shade, reveal: M.stone })
    arcade.push(...sebka(M.shade, 1.2, Wf - 1.2, 56.35, 57.65, 1.25, 1.3, 0).map((d) => inlay(d.poly, M.shade)))
    n.push({ poly: rectST(0.9, Wf - 0.9, 52.6, 57.8), depth: 0.25, back: M.stone, reveal: M.stone, kids: arcade })
    // the paired windows under two lobed arches in a frame
    n.push({ poly: rectST(cs - 3.3, cs + 3.3, 45.8, 51.6), depth: 0.25, back: M.stone, reveal: M.stone, kids: [
      ...[-1.45, 1.45].map((ds) => ({ poly: arch(cs + ds - 1.2, cs + ds + 1.2, 46.0, 48.4, 'pointed', 4), depth: 0.4, back: M.shade, reveal: M.stone,
        kids: [{ poly: arch(cs + ds - 0.42, cs + ds + 0.42, 46.2, 48.0, 'round', 3), depth: 0.5, back: M.win }] })),
      ...sebka(M.shade, cs - 3.1, cs + 3.1, 50.3, 51.45, 1.2, 1.15, 0).map((d) => inlay(d.poly, M.shade)),
    ] })
    // the framed lobed panels, about half to two-thirds of the face wide, each with two windows
    const panel = (hw: number, aw: number, t0: number, t1: number, ts: number) => ({
      poly: rectST(cs - hw, cs + hw, t0, t1), depth: 0.25, back: M.stone, reveal: M.stone,
      kids: [{ poly: arch(cs - aw, cs + aw, t0 + 0.2, ts, 'horseshoe', 6), depth: 0.5, back: M.shade, reveal: M.stone,
        kids: [-1, 1].map((k) => ({ poly: arch(cs + k * 1.0 - 0.42, cs + k * 1.0 + 0.42, t0 + 0.45, ts - 0.2, 'flat', 3), depth: 0.45, back: M.win })) }],
    })
    n.push(panel(4.4, 3.5, 37.8, 45.3, 39.8))
    n.push(panel(4.0, 3.2, 25.0, 31.5, 26.4))
    n.push(panel(3.6, 2.8, 12.0, 18.0, 13.4))
    wall(M.stone, f, rectST(0, Wf, 0, 58.0), n)
    // the zellige band, set in a little
    wall(M.stone, f, rectST(0, Wf, 58.5, 61.2), [{ poly: rectST(0.25, Wf - 0.25, 58.6, 60.9), depth: 0.15, back: M.zel }])
  }
  // corners and cornices
  const strips = (t0: number, t1: number) => { for (let k = 0; k < 4; k++) { const f = faces[k], g = faces[(k + 1) % 4]; fquad(M.stone, at(f, Wf, t0), at(g, 0, t0), at(g, 0, t1), at(f, Wf, t1), add(normalOf(f), normalOf(g))) } }
  strips(0, 58.0); strips(58.0, 61.2)
  towerBand(M.stone, faces, Wf, 51.5, 52.2, 0.25)
  towerBand(M.stone, faces, Wf, 58.0, 58.5, 0.35)
  for (const f of faces) fquad(M.stone, at(f, 0, 58.0), at(f, Wf, 58.0), at(f, Wf, 58.5), at(f, 0, 58.5), normalOf(f))
  prism(M.stone, rectRing(-W / 2 + 0.01, -W / 2 + 0.01, W / 2 - 0.01, W / 2 - 0.01), 61.0, 61.2, true)
  for (const f of faces) merlons(M.stone, f, -0.15, Wf + 0.15, 61.2, 5, 1.9, 1.5, 0.7, 3)

  // the lantern
  const L = 7.8, lc = 0.12, Lf = L - 2 * lc, lcs = Lf / 2
  const lf = squareFaces(L, lc)
  for (const f of lf) {
    const n: Niche[] = []
    for (const ds of [-1.25, 1.25]) n.push({ poly: arch(lcs + ds - 0.55, lcs + ds + 0.55, 62.4, 64.2, 'pointed', 2), depth: 0.5, back: M.win })
    n.push({ poly: rectST(0.8, Lf - 0.8, 65.3, 68.5), depth: 0.15, back: M.stone, reveal: M.stone, kids: sebka(M.shade, 1.0, Lf - 1.0, 65.45, 68.35, 1.5, 1.45, 0.3).map((d) => inlay(d.poly, M.shade)) })
    n.push({ poly: rectST(0.2, Lf - 0.2, 68.85, 69.8), depth: 0.12, back: M.zel })
    wall(M.stone, f, rectST(0, Lf, 61.0, 70.1), n)
    merlons(M.stone, f, -0.1, Lf + 0.1, 70.1, 3, 1.4, 1.1, 0.5, 1)
  }
  for (let k = 0; k < 4; k++) { const f = lf[k], g = lf[(k + 1) % 4]; fquad(M.stone, at(f, Lf, 61), at(g, 0, 61), at(g, 0, 70.1), at(f, Lf, 70.1), add(normalOf(f), normalOf(g))) }
  prism(M.stone, rectRing(-L / 2 + 0.01, -L / 2 + 0.01, L / 2 - 0.01, L / 2 - 0.01), 69.9, 70.1, true)
  // dome and the three gilded balls
  lathe(M.stone, 0, 0, [[2.75, 70.1], [2.75, 70.5], [2.45, 71.15], [1.7, 71.65], [0.6, 71.9], [0, 71.95]], 10)
  lathe(M.brass, 0, 0, [[0.16, 71.8], [0.13, 76.4], [0.05, 77], [0, 77]], 6)
  ball(M.brass, [0, 0, 73.2], 1.0, 8)
  ball(M.brass, [0, 0, 74.9], 0.55, 8)
  ball(M.brass, [0, 0, 76.15], 0.4, 6)
  return M
}

/** A hipped roof over an axis-aligned box: ridge along the long side. */
function hipRoof(p: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number) {
  const w = x1 - x0, d = y1 - y0, cx = (x0 + x1) / 2, cy = (y0 + y1) / 2
  const r = Math.min(w, d) / 2
  const A: V3[] = [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]]
  let r0: V3, r1: V3
  if (w >= d) { r0 = [x0 + r, cy, z1]; r1 = [x1 - r, cy, z1] } else { r0 = [cx, y0 + r, z1]; r1 = [cx, y1 - r, z1] }
  const up = (a: V3, b: V3, c: V3) => { const n: V3 = [(a[0] + b[0] + c[0]) / 3 - cx, (a[1] + b[1] + c[1]) / 3 - cy, 2]; return n }
  if (w >= d) {
    fquad(p, A[0], A[1], r1, r0, up(A[0], A[1], r1)); fquad(p, A[2], A[3], r0, r1, up(A[2], A[3], r0))
    fquad(p, A[1], A[2], r1, r1, up(A[1], A[2], r1)); fquad(p, A[3], A[0], r0, r0, up(A[3], A[0], r0))
  } else {
    fquad(p, A[1], A[2], r1, r0, up(A[1], A[2], r1)); fquad(p, A[3], A[0], r0, r1, up(A[3], A[0], r0))
    fquad(p, A[0], A[1], r0, r0, up(A[0], A[1], r0)); fquad(p, A[2], A[3], r1, r1, up(A[2], A[3], r1))
  }
}

const OUTLINE: XY[] = [[-46.32, 27.41], [-44.64, 27.75], [-40.95, 28.22], [-35.94, 28.97], [-30.83, 29.73], [-25.26, 30.57], [-16.38, 31.92], [5.0, 35.14], [32.39, 39.27], [41.8, 39.24], [44.68, 39.23], [44.69, 25.15], [44.36, 14.15], [44.35, 10.01], [45.38, -18.93], [45.64, -25.57], [39.1, -25.8], [25.05, -26.28], [20.27, -26.52], [19.41, -26.48], [12.31, -26.73], [4.2, -27.02], [2.95, -27.15], [-2.01, -27.24], [-10.77, -27.42], [-17.2, -27.75], [-23.47, -27.97], [-37.96, -28.47], [-44.18, -28.7], [-44.27, -26.42], [-44.36, -24.26], [-46.83, -24.35], [-47.11, -17.67], [-44.6, -17.57], [-44.77, -14.89], [-47.31, -14.98], [-47.64, -7.56], [-45.11, -7.41], [-45.2, -5.1], [-47.71, -5.2], [-48.04, 1.59], [-48.48, 10.73], [-48.79, 17.06], [-46.15, 17.19]]
const COURT: XY[] = [[-25.25, 27.35], [22.77, 30.53], [22.65, 10.09], [17.96, 9.85], [12.75, 9.59], [7.6, 9.32], [2.37, 9.06], [-3.71, 8.75], [-9.06, 8.48], [-14.26, 8.21], [-19.54, 7.95], [-24.7, 7.68]]
const WELL: XY[] = [[23.23, 37.19], [32.4, 38.34], [32.4, 31.26], [27.92, 31.24], [23.4, 31.1]]
type Box = [number, number, number, number]
const NAVES: Box[] = [[38.16, 45.38, -19.13, 25.16], [32.41, 39.41, -19.31, 25.19], [27.74, 34.13, -19.49, 31.26], [22.65, 29.17, -19.66, 31.24],
  [17.96, 24.07, -19.84, 10.09], [12.75, 19.14, -20.01, 9.85], [7.6, 14.12, -20.19, 9.59], [2.37, 8.97, -20.34, 9.32], [-9.06, -2.29, -20.76, 8.75],
  [-14.26, -7.53, -20.96, 8.48], [-19.54, -13.08, -21.14, 8.21], [-24.7, -18.14, -21.32, 7.95], [-30.83, -23.33, -21.5, 30.57],
  [-35.94, -28.41, -21.68, 29.73], [-40.95, -33.84, -21.86, 28.97], [-46.32, -38.96, -22.05, 28.22]]
// the axial nave's six bays (way/902371287-292) span x -3.7..3.9, y -20.6..9.1
const TRANSEPT: Box[] = [[-38.24, -23.47, -28.47, -21.33], [-17.46, -2.01, -27.75, -20.62], [3.87, 19.41, -27.02, -19.84], [24.79, 39.1, -26.28, -19.15]]
const DOMES: Box[] = [[-44.45, -37.96, -28.7, -21.83], [-23.72, -17.2, -27.97, -21.11], [-2.29, 4.2, -27.24, -20.34], [19.14, 25.05, -26.52, -19.65], [38.84, 45.64, -25.8, -18.93]]
const WEST: Box[] = [[-48.79, -45.84, 10.73, 17.19], [-48.04, -45.2, -5.2, 1.72], [-47.64, -44.77, -14.98, -7.41], [-47.11, -44.36, -24.35, -17.57]]
const MIN_C: XY = [38.6, 32.2]

function build(): Mats {
  const M = mats(), Z = 8.4 // wall head under the roofs
  // Outer walls with their doorways.
  const ring = ccw(OUTLINE)
  ring.forEach((a, i) => {
    const b = ring[(i + 1) % ring.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const mid: XY = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
    if (Math.abs(mid[0] - MIN_C[0]) < 6.6 && Math.abs(mid[1] - MIN_C[1]) < 6.6) return // inside the minaret
    const n: Niche[] = []
    if (L >= 12) {
      const cnt = Math.max(1, Math.round(L / 22))
      for (let k = 0; k < cnt; k++) {
        const s = (L * (k + 0.5)) / cnt
        n.push({ poly: arch(s - 2.3, s + 2.3, 0.05, 4.2, 'horseshoe', 4), depth: 1.0, back: M.shade, reveal: M.stone })
      }
    }
    if (n.length) wall(M.stone, edgeFace(a, b, 0), rectST(0, L, 0, Z), n)
    else fquad(M.stone, [a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], Z], [a[0], a[1], Z], [b[1] - a[1], a[0] - b[0], 0])
  })
  // The courtyard's arcades, facing in.
  for (const [r, arcs] of [[COURT, true], [WELL, false]] as [XY[], boolean][]) {
    const cw = [...ccw(r)].reverse()
    cw.forEach((a, i) => {
      const b = cw[(i + 1) % cw.length], L = Math.hypot(b[0] - a[0], b[1] - a[1]), n: Niche[] = []
      if (arcs && L > 15) {
        const cnt = Math.max(1, Math.round(L / 12))
        for (let k = 0; k < cnt; k++) { const s = (L * (k + 0.5)) / cnt, w = Math.min(1.7, L / cnt / 2 - 0.5); n.push({ poly: arch(s - w, s + w, 0.05, 4.2, 'horseshoe', 4), depth: 1.6, back: M.shade, reveal: M.stone }) }
      }
      if (n.length) wall(M.stone, edgeFace(a, b, 0), rectST(0, L, 0, Z), n)
      else fquad(M.stone, [a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], Z], [a[0], a[1], Z], [b[1] - a[1], a[0] - b[0], 0])
    })
  }
  // Flat roof under the tiles, and the coping on the outer wall.
  for (const [p, q, r] of polyTris(ring, [ccw(COURT), ccw(WELL)])) ftri(M.stone, [p[0], p[1], Z], [q[0], q[1], Z], [r[0], r[1], Z], [0, 0, 1])
  // Tile roofs.
  for (const [x0, x1, y0, y1] of NAVES) hipRoof(M.roof, x0 + 0.1, y0, x1 - 0.1, y1, Z, 10)
  // the raised axial nave: one roof over its six bays
  block(M.stone, -3.5, -20.6, 3.6, 9.06, Z, 9.6); hipRoof(M.roof, -3.7, -20.62, 3.87, 9.06, 9.6, 11)
  for (const [x0, x1, y0, y1] of TRANSEPT) { block(M.stone, x0, y0, x1, y1, Z, 11); hipRoof(M.roof, x0 - 0.3, y0 - 0.3, x1 + 0.3, y1 + 0.3, 11, 13) }
  for (const [x0, x1, y0, y1] of DOMES) {
    block(M.stone, x0, y0, x1, y1, Z, 11.8)
    pyramid(M.roof, rectRing(x0 - 0.3, y0 - 0.3, x1 + 0.3, y1 + 0.3), 11.8, [(x0 + x1) / 2, (y0 + y1) / 2, 14.5])
  }
  for (const [x0, x1, y0, y1] of WEST) hipRoof(M.roof, x0, y0, x1, y1, Z, 9)
  // the north gallery's flat roof, a little above the rest
  prism(M.stone, ccw([[-25.26, 30.57], [-25.25, 27.35], [22.77, 30.53], [22.76, 31.2], [23.4, 31.1], [23.23, 37.19], [32.4, 38.34], [32.39, 39.27], [5.0, 35.14], [-16.38, 31.92]]), Z, 9, true)
  // The minaret.
  const mn = minaret()
  if (process.env.DEBUG) console.error('minaret', Object.values(mn).reduce((a, p) => a + p.triangles, 0))
  mergeMats(M, mn, 0, [MIN_C[0], MIN_C[1], 0])
  return M
}

const COLORS = { stone: 0xa87e5e, shade: 0x7a5840, zel: 0x3e9c8c, roof: 0xccb08e, brass: 0xcfa646 }

if (import.meta.main) {
  writeModel('Koutoubia Mosque', ID, materials(build(), 'koutoubia', COLORS), { bearing: BEARING, elevation: 0, height: 77 }, 6500)
}
