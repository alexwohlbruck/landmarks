/**
 * Citadel of Qaitbay (Sultan al-Ashraf Qaitbay, 1477-1479), on the site of
 * the Pharos at the tip of the Ras el-Tin peninsula, Alexandria: original
 * procedural geometry, CC0-1.0, no textures.
 *   bun generators/alexandria-qaitbay-citadel.ts
 * Writes models/alexandria-qaitbay-citadel.glb (low) and
 * models/alexandria-qaitbay-citadel.detail.glb (detail: round-topped
 * merlons, more slit windows, rounder towers).
 *
 * Map frame: x east, y north, z up, metres. Anchor = the lead's point
 * (lng 29.88601, lat 31.21373), near the centroid of the OSM relation.
 * Bearing 353.8: the keep's south face (OSM way/602123355) runs at 83.8
 * deg, so the keep is square to the model axes.
 *
 * Identity, in order: the square keep with its four round corner towers
 * rising over it, machicolated and crowned with round-topped merlons; the
 * tall central bay over the pointed portal on its south face, with its
 * two tall arched windows; the box machicolations along the keep's
 * parapet; the low crenellated outer walls with their round towers round
 * the courtyard; the pale honey limestone.
 *
 * Evidence
 *  - Plan: OSM relation/8410048 (building=castle; outer way/602123350,
 *    the outer walls; inner ways 602123353 the courtyard, 1231905928 the
 *    west yard, 1231905929 the south yard, drawn open), the keep
 *    way/602123355 (walls 29.5 x 28.8 m, read in this frame x -50.5..-21,
 *    y 19..47.8), its parts way/1238877505 (the central bay on the south
 *    face, 6.4 m wide) and way/1238877506 (a cross-shaped raised block in
 *    the middle of the roof, over the mosque's lantern, q20). Round towers
 *    on the outer wall are placed on the bumps of the OSM outline (radius
 *    2.4-2.9 m, and the north-west tower about 6.5 m).
 *  - Heights: published 17 m (Wikipedia infobox) for the keep, taken as
 *    the wall-walk; merlons 1.5 m (q13-q15, against the 1.0 m pitch of the
 *    paving); corner towers 1.6 m higher with a corbelled band (q1, q2,
 *    q9, q12); central bay 21 m (q2, q9: it rises about a merlon and a
 *    half over the towers' parapet). The outer walls 9 m, ESTIMATED from
 *    q4, q7, q21 (about half the keep).
 *  - Terrain: Mapterhorn 404s at z13-z15; z12 was used for the check.
 *  - Photos (Wikimedia Commons, all EVIDENCE):
 *    q1 Aymanrefaat09, "A front view of Citadel of Qaitbay.jpg", CC BY-SA 3.0
 *      https://commons.wikimedia.org/wiki/File:A_front_view_of_Citadel_of_Qaitbay.jpg
 *    q2 Argenberg, "Citadel of Qaitbay, Alexandria, Egypt.jpg", CC BY 2.0 (south face, square on)
 *      https://commons.wikimedia.org/wiki/File:Citadel_of_Qaitbay,_Alexandria,_Egypt.jpg
 *    q4 Daniel Mayer, "Alexandria - Citadel of Qaitbay from the Corniche.JPG", CC BY-SA 4.0
 *      https://commons.wikimedia.org/wiki/File:Alexandria_-_Citadel_of_Qaitbay_from_the_Corniche.JPG
 *    q7 Alberto-g-rovi, "Castillo de Qaitbay-Alejandria.jpg", CC BY 3.0 (outer walls, south-west)
 *      https://commons.wikimedia.org/wiki/File:Castillo_de_Qaitbay-Alejandria.jpg
 *    q8 Costaashmawy, "Alexandria citadel.jpg", CC BY-SA 4.0 (from the east harbour)
 *      https://commons.wikimedia.org/wiki/File:Alexandria_citadel.jpg
 *    q9 Ahmed Yousry Mahfouz, "Citadel of Kaitbay.jpg", CC BY-SA 4.0 (south face)
 *      https://commons.wikimedia.org/wiki/File:Citadel_of_Kaitbay.jpg
 *    q10 Mmelouk, "Alexandria Qaitbay citadel.jpg", CC BY-SA 4.0 (side face, machicolations)
 *      https://commons.wikimedia.org/wiki/File:Alexandria_Qaitbay_citadel.jpg
 *    q11 Ahmed Younis Sif Saad, "Castle of Qitbay -14.JPG", CC BY-SA 4.0 (side face, inner wall)
 *      https://commons.wikimedia.org/wiki/File:Castle_of_Qitbay_-14.JPG
 *    q12 ZoologistLouca, "Citadel of Qaitbay.jpg", CC BY-SA 4.0 (south-east)
 *      https://commons.wikimedia.org/wiki/File:Citadel_of_Qaitbay.jpg
 *    q13 Ahmed Younis Sif Saad, "Castle of Qitbay-13.JPG", CC BY-SA 4.0 (merlons)
 *      https://commons.wikimedia.org/wiki/File:Castle_of_Qitbay-13.JPG
 *    q14 Cecioka, "Cidadade de Qaitbay 59.jpg", CC BY-SA 4.0 (outer wall-walk and merlons)
 *      https://commons.wikimedia.org/wiki/File:Cidadade_de_Qaitbay_59.jpg
 *    q19 Cecioka, "Cidadade de Qaitbay 61.jpg", CC BY-SA 4.0 (outer walls and keep)
 *      https://commons.wikimedia.org/wiki/File:Cidadade_de_Qaitbay_61.jpg
 *    q20 لا روسا, "Citadel of Qaitbay 054.JPG", CC BY-SA 3.0 (the mosque's lantern inside the keep)
 *      https://commons.wikimedia.org/wiki/File:Citadel_of_Qaitbay_054.JPG
 *    q21 Yiossif, "Alexandria fortress Qaitbay.jpg", CC BY-SA 4.0 (round towers on the outer wall)
 *      https://commons.wikimedia.org/wiki/File:Alexandria_fortress_Qaitbay.jpg
 *  - Colours: sunlit limestone #bda386 (q2), warmer in q1 and q9; drawn
 *    #dcc8a4, dressed stone (merlons, corbels) #e8dabd. Night: floodlit
 *    (the citadel is lit after dark), with lit portal.
 *  No look-only sources. No commercial imagery. No lidar exists here.
 *
 * Invented or simplified: the slit windows are placed by eye from q1, q2,
 * q10 and q11, not counted; the outer walls are one height with a
 * wall-walk; the yards and courtyard are left open (the map's ground).
 * Doubts: no licensed photo shows a minaret on the keep (the mosque's
 * minaret is lost), so none is drawn: the central bay is what rises over
 * the parapet. The outer walls' height is estimated, and the north and
 * east outer faces are unphotographed here.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { walls, type XY } from './chi-aon-center'
import { face } from './phl-independence-hall'
import { polyTris, pointedArch, fquad } from './berlin-oberbaum-bridge'
import { box, cyl, writeModel, type Slot } from './pretoria-union-buildings'

const ID = 'alexandria-qaitbay-citadel'
const NAME = 'Citadel of Qaitbay'
const ANCHOR: [number, number] = [29.88601, 31.21373]
const BEARING = 353.8

// OSM, in this frame (simplified to 0.35 m), counter-clockwise.
const OUTER: XY[] = [[-114.7,-12.0],[-113.3,-14.8],[-109.9,-15.7],[-107.8,-28.4],[-109.7,-30.2],[-110.2,-32.7],[-109.2,-35.1],[-106.9,-36.4],[-105.6,-36.4],[-103.1,-47.5],[-104.9,-49.0],[-105.6,-51.3],[-104.9,-52.8],[-102.6,-53.7],[-101.7,-55.1],[-101.6,-56.6],[-102.7,-60.2],[-102.0,-61.5],[-94.5,-61.8],[-89.9,-59.3],[-88.1,-61.6],[-82.1,-62.1],[-81.8,-63.1],[-80.5,-64.1],[-79.1,-63.9],[-78.1,-61.7],[-51.2,-61.3],[-49.7,-61.7],[-48.4,-63.7],[-46.7,-64.3],[-45.4,-63.8],[-43.9,-61.6],[-42.3,-61.1],[-18.0,-61.2],[-16.0,-61.8],[-14.8,-63.4],[-13.2,-63.7],[-12.3,-63.3],[-11.1,-61.5],[-8.1,-60.9],[-5.9,-57.5],[-2.4,-58.0],[-4.1,-53.6],[-6.1,-50.9],[-4.7,-48.3],[-5.3,-46.5],[-6.5,-45.0],[2.7,-36.7],[7.1,18.5],[-3.1,19.7],[-3.9,25.4],[-4.9,28.7],[-11.8,39.5],[-13.6,47.1],[-14.3,53.7],[-14.4,74.6],[-42.0,73.5],[-42.7,75.7],[-45.7,79.0],[-47.8,79.9],[-52.3,79.6],[-55.6,77.3],[-56.6,75.9],[-57.3,72.5],[-56.1,69.2],[-115.1,41.5],[-119.6,34.6],[-117.2,29.7],[-116.3,24.1],[-114.0,20.7],[-116.1,18.8],[-117.0,16.0],[-115.7,13.7],[-113.9,13.3],[-112.1,-8.0],[-114.0,-9.6]]
const HOLES: XY[][] = [
  [[-37.3,55.8],[-37.0,62.4],[-40.7,62.2],[-51.6,58.2],[-66.7,50.5],[-60.0,36.7],[-70.5,31.7],[-69.3,29.1],[-87.7,20.4],[-94.1,33.4],[-97.8,32.3],[-81.8,-35.7],[-80.0,-38.1],[-78.0,-38.3],[-74.9,-36.5],[-73.2,-36.2],[-14.3,-37.9],[-7.3,-31.5],[-4.2,18.9],[-5.5,19.6],[-7.0,18.0],[-7.9,11.9],[-15.9,12.8],[-15.4,52.6],[-19.1,53.4],[-19.8,61.9],[-22.1,61.9],[-22.6,55.2]],
  [[-101.9,-46.7],[-91.1,-41.4],[-106.5,28.5],[-115.1,26.2],[-113.9,22.9],[-111.6,22.4],[-111.4,21.5],[-114.9,18.5],[-115.7,15.7],[-115.3,14.6],[-114.3,14.0],[-111.2,14.3],[-111.1,2.0],[-109.7,-10.3],[-112.1,-10.5],[-113.1,-12.1],[-112.7,-13.3],[-111.5,-14.0],[-108.7,-13.7],[-105.4,-30.9],[-108.4,-32.1],[-109.0,-33.7],[-107.3,-34.4],[-104.6,-33.5]],
  [[-85.8,-50.4],[-82.8,-58.7],[-9.2,-58.1],[-6.3,-55.7],[-11.5,-47.9],[-78.0,-45.7]],
]
/** Round towers on the outer wall: centre, radius (from the outline's bumps). */
const TOWERS: [number, number, number][] = [
  [-49.8, 73.6, 6.4], [-114.5, 16.3, 2.6], [-111.9, -12.1, 2.6], [-107.6, -32.6, 2.6], [-103.1, -51.1, 2.6],
  [-80.4, -61.5, 2.6], [-46.8, -61.4, 2.9], [-13.5, -61.2, 2.5],
]

const WALL = 9, KEEP = 17, MER = 1.5
const KC: XY = [-35.8, 33.4], KH = 14.6
const TOWER_R = 3.7

function build(detail: boolean): Slot[] {
  const stone = new Part(), dressed = new Part(), paving = new Part(), win = new Part(), door = new Part()
  const SEG = detail ? 16 : 10

  /** One merlon centred at c (on the wall's centre line of a parapet), facing n. */
  const merlon = (c: XY, u: XY, z: number, w = 0.95, d = 0.7) => {
    const n: XY = [u[1], -u[0]]
    const P = (s: number, t: number, h: number): V3 => [c[0] + u[0] * s + n[0] * t, c[1] + u[1] * s + n[1] * t, h]
    const hw = w / 2, hd = d / 2, zs = z + (detail ? MER - hw : MER)
    fquad(dressed, P(-hw, hd, z), P(hw, hd, z), P(hw, hd, zs), P(-hw, hd, zs), [n[0], n[1], 0])
    fquad(dressed, P(hw, -hd, z), P(-hw, -hd, z), P(-hw, -hd, zs), P(hw, -hd, zs), [-n[0], -n[1], 0])
    fquad(dressed, P(hw, hd, z), P(hw, -hd, z), P(hw, -hd, zs), P(hw, hd, zs), [u[0], u[1], 0])
    fquad(dressed, P(-hw, -hd, z), P(-hw, hd, z), P(-hw, hd, zs), P(-hw, -hd, zs), [-u[0], -u[1], 0])
    if (!detail) { fquad(dressed, P(-hw, hd, zs), P(hw, hd, zs), P(hw, -hd, zs), P(-hw, -hd, zs), [0, 0, 1]); return }
    // round top: a half-cylinder across the wall
    const K = 5
    for (let k = 0; k < K; k++) {
      const a0 = Math.PI * k / K, a1 = Math.PI * (k + 1) / K
      const s0 = hw * Math.cos(a0), s1 = hw * Math.cos(a1), h0 = zs + hw * Math.sin(a0), h1 = zs + hw * Math.sin(a1)
      const nm: V3 = [u[0] * Math.cos((a0 + a1) / 2), u[1] * Math.cos((a0 + a1) / 2), Math.sin((a0 + a1) / 2)]
      fquad(dressed, P(s0, -hd, h0), P(s1, -hd, h1), P(s1, hd, h1), P(s0, hd, h0), nm)
      face(dressed, [P(0, hd, zs), P(s0, hd, h0), P(s1, hd, h1)], [n[0], n[1], 0])
      face(dressed, [P(0, -hd, zs), P(s1, -hd, h1), P(s0, -hd, h0)], [-n[0], -n[1], 0])
    }
  }
  /** Merlons along a→b at height z, pitch p, kept clear of the ends. */
  const merlonRow = (a: XY, b: XY, z: number, inset: number, p = 2.0, end = 0.8) => {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]); if (L < 2.2) return
    const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
    const k = Math.max(1, Math.floor((L - 2 * end) / p) + 1), step = k > 1 ? (L - 2 * end) / (k - 1) : 0
    for (let i = 0; i < k; i++) {
      const s = k > 1 ? end + i * step : L / 2
      merlon([a[0] + u[0] * s - n[0] * inset, a[1] + u[1] * s - n[1] * inset], u, z)
    }
  }
  /** Merlons round a circle. */
  const merlonRing = (cx: number, cy: number, r: number, z: number, n: number, a0 = 0) => {
    for (let i = 0; i < n; i++) {
      const a = a0 + (i / n) * 2 * Math.PI
      merlon([cx + r * Math.cos(a), cy + r * Math.sin(a)], [-Math.sin(a), Math.cos(a)], z, Math.min(0.95, (2 * Math.PI * r) / n * 0.55))
    }
  }

  // --- outer walls and the barrack ranges: the relation less its yards.
  walls(stone, OUTER, 0, WALL)
  for (const h of HOLES) walls(stone, [...h].reverse(), 0, WALL)
  for (const [a, b, c] of polyTris(OUTER, HOLES)) face(paving, [[...a, WALL], [...b, WALL], [...c, WALL]] as V3[], [0, 0, 1])
  // merlons on the outer edge; a plain parapet course on the yards' edges
  {
    // walk the outer perimeter at an even pitch; the towers carry their own rings
    const p = detail ? 1.9 : 3.0
    let carry = p / 2
    for (let i = 0; i < OUTER.length; i++) {
      const a = OUTER[i], b = OUTER[(i + 1) % OUTER.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
      const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
      let s = carry
      for (; s < L; s += p) {
        if (s < 0.55 || s > L - 0.55) continue
        const c: XY = [a[0] + u[0] * s - n[0] * 0.45, a[1] + u[1] * s - n[1] * 0.45]
        if (TOWERS.some(([tx, ty, r]) => Math.hypot(c[0] - tx, c[1] - ty) < r + 0.9)) continue
        merlon(c, u, WALL)
      }
      carry = s - L
    }
  }
  for (const h of HOLES) {
    const r = [...h].reverse()
    for (let i = 0; i < r.length; i++) {
      const a = r[i], b = r[(i + 1) % r.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
      if (L < 1) continue
      const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
      // a 0.9 m parapet, 0.5 m thick, standing on the wall top at the yard's edge (n points into the yard)
      const P = (s: number, t: number, z: number): V3 => [a[0] + u[0] * s + n[0] * t, a[1] + u[1] * s + n[1] * t, z]
      fquad(stone, P(0, 0, WALL), P(L, 0, WALL), P(L, 0, WALL + 0.9), P(0, 0, WALL + 0.9), [n[0], n[1], 0])
      fquad(stone, P(L, -0.5, WALL), P(0, -0.5, WALL), P(0, -0.5, WALL + 0.9), P(L, -0.5, WALL + 0.9), [-n[0], -n[1], 0])
      fquad(dressed, P(0, -0.5, WALL + 0.9), P(0, 0, WALL + 0.9), P(L, 0, WALL + 0.9), P(L, -0.5, WALL + 0.9), [0, 0, 1])
    }
  }
  // round towers on the outer wall, a little over it
  for (const [cx, cy, r] of TOWERS) {
    const top = WALL + (r > 4 ? 2.4 : 1.4)
    cyl(stone, cx, cy, r, 0, top, SEG, false)
    cyl(paving, cx, cy, r - 0.01, top - 0.01, top, SEG)
    merlonRing(cx, cy, r - 0.4, top, Math.max(6, Math.round((2 * Math.PI * r) / (detail ? 1.9 : 3.0))))
  }

  // --- the keep
  const [kx, ky] = KC, x0 = kx - KH, x1 = kx + KH, y0 = ky - KH, y1 = ky + KH
  box(stone, x0, y0, x1, y1, 0, KEEP, false)
  face(paving, [[x0, y0, KEEP + 0.01], [x1, y0, KEEP + 0.01], [x1, y1, KEEP + 0.01], [x0, y1, KEEP + 0.01]], [0, 0, 1])
  // corner towers: shaft, corbel band, parapet floor, merlons
  const TT = KEEP + 1.6
  for (const [cx, cy] of [[x0, y0], [x1, y0], [x1, y1], [x0, y1]] as XY[]) {
    cyl(stone, cx, cy, TOWER_R, 0, TT - 1.4, SEG, false)
    cyl(dressed, cx, cy, TOWER_R, TT - 1.4, TT - 0.9, SEG, false, false, TOWER_R + 0.45)
    cyl(stone, cx, cy, TOWER_R + 0.45, TT - 0.9, TT, SEG, false)
    cyl(paving, cx, cy, TOWER_R + 0.44, TT - 0.01, TT, SEG)
    merlonRing(cx, cy, TOWER_R + 0.05, TT, detail ? 12 : 9, Math.PI / 12)
  }
  // keep merlons, along each face between the towers
  const corners: XY[] = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
  for (let i = 0; i < 4; i++) {
    const a = corners[i], b = corners[(i + 1) % 4], L = 2 * KH, u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
    const A: XY = [a[0] + u[0] * (TOWER_R + 0.3), a[1] + u[1] * (TOWER_R + 0.3)], B: XY = [b[0] - u[0] * (TOWER_R + 0.3), b[1] - u[1] * (TOWER_R + 0.3)]
    if (i === 0) {
      // the south face: leave the central bay clear
      merlonRow(A, [kx - 3.9, y0], KEEP, 0.4, detail ? 1.9 : 2.3, 0.6)
      merlonRow([kx + 3.9, y0], B, KEEP, 0.4, detail ? 1.9 : 2.3, 0.6)
    } else merlonRow(A, B, KEEP, 0.4, detail ? 1.9 : 2.3, 0.6)
  }
  // the central bay over the portal (south), projecting 0.8 m
  const BH = 21, bw = 3.3
  box(stone, kx - bw, y0 - 0.8, kx + bw, y0 + 5.2, 0, BH, false)
  face(paving, [[kx - bw, y0 - 0.8, BH + 0.01], [kx + bw, y0 - 0.8, BH + 0.01], [kx + bw, y0 + 5.2, BH + 0.01], [kx - bw, y0 + 5.2, BH + 0.01]], [0, 0, 1])
  for (const [a, b] of [[[kx - bw, y0 - 0.8], [kx + bw, y0 - 0.8]], [[kx + bw, y0 - 0.8], [kx + bw, y0 + 5.2]], [[kx + bw, y0 + 5.2], [kx - bw, y0 + 5.2]], [[kx - bw, y0 + 5.2], [kx - bw, y0 - 0.8]]] as [XY, XY][]) merlonRow(a, b, BH, 0.4, 1.7, 0.55)
  // its two tall arched windows and the portal (pointed), on the bay's face
  const S = (s: number, z: number, out = 0.06): V3 => [kx + s, y0 - 0.8 - out, z]
  const flat = (p: Part, pts: XY[], out = 0.06) => {
    for (const [a, b, c] of polyTris(pts)) face(p, [S(a[0], a[1], out), S(b[0], b[1], out), S(c[0], c[1], out)], [0, -1, 0])
  }
  for (const c of [-1.05, 1.05]) flat(win, pointedArch(c - 0.62, c + 0.62, 13.2, 16.6, detail ? 6 : 3, 0.6))
  // portal: a pointed recess in a dressed frame, the door in it
  flat(dressed, pointedArch(-2.3, 2.3, 0, 5.6, detail ? 6 : 4, 0.62), 0.04)
  flat(door, pointedArch(-1.6, 1.6, 0, 4.9, detail ? 6 : 4, 0.62), 0.1)
  // box machicolations under the parapet: [face, positions along it]
  const brets: [XY, XY, number[]][] = [
    [[x0, y0], [x1, y0], [5.6, 9.2, 19.9, 23.5]],
    [[x1, y0], [x1, y1], [6.4, 11.4, 16.4, 21.4]],
    [[x1, y1], [x0, y1], [6.4, 11.4, 16.4, 21.4]],
    [[x0, y1], [x0, y0], [6.4, 11.4, 16.4, 21.4]],
  ]
  for (const [a, b, ss] of brets) {
    const L = 2 * KH, u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
    for (const s of ss) {
      const P = (q: number, t: number, z: number): V3 => [a[0] + u[0] * q + n[0] * t, a[1] + u[1] * q + n[1] * t, z]
      const w = 0.85, d = 0.9, zb = KEEP - 3.2, zt = KEEP - 0.9
      fquad(dressed, P(s - w, d, zb + 0.5), P(s + w, d, zb + 0.5), P(s + w, d, zt), P(s - w, d, zt), [n[0], n[1], 0])
      fquad(dressed, P(s + w, 0, zb), P(s + w, d, zb + 0.5), P(s + w, d, zt), P(s + w, 0, zt), [u[0], u[1], 0])
      fquad(dressed, P(s - w, d, zb + 0.5), P(s - w, 0, zb), P(s - w, 0, zt), P(s - w, d, zt), [-u[0], -u[1], 0])
      fquad(dressed, P(s - w, 0, zt), P(s + w, 0, zt), P(s + w, d, zt), P(s - w, d, zt), [0, 0, 1])
      fquad(dressed, P(s - w, 0, zb), P(s - w, d, zb + 0.5), P(s + w, d, zb + 0.5), P(s + w, 0, zb), [0, -n[1] * 0.5 - 0, -1])
      // its small dark loop
      fquad(win, P(s - 0.22, d + 0.05, zb + 1.0), P(s + 0.22, d + 0.05, zb + 1.0), P(s + 0.22, d + 0.05, zb + 1.9), P(s - 0.22, d + 0.05, zb + 1.9), [n[0], n[1], 0])
    }
    // slit windows in two rows
    const rowsZ = detail ? [4.2, 8.6, 12.4] : [5.0, 10.6]
    for (const z of rowsZ) for (const s of detail ? [6.5, 10.5, 18.7, 22.7] : [8.5, 20.7]) {
      if (a[1] === y0 && b[1] === y0 && Math.abs(s - KH) < 4.5) continue
      const P = (q: number, h: number): V3 => [a[0] + u[0] * q + n[0] * 0.05, a[1] + u[1] * q + n[1] * 0.05, h]
      fquad(win, P(s - 0.35, z), P(s + 0.35, z), P(s + 0.35, z + 1.4), P(s - 0.35, z + 1.4), [n[0], n[1], 0])
    }
  }
  // the raised block over the mosque in the middle of the roof (OSM way/1238877506)
  {
    const cross: XY[] = [[-39.0, 41.4], [-39.4, 34.4], [-43.2, 34.6], [-43.4, 30.7], [-27.7, 29.9], [-27.5, 34.1], [-32.2, 34.3], [-31.8, 41.0]]
    walls(stone, cross, KEEP, KEEP + 2.6)
    for (const [a, b, c] of polyTris(cross)) face(paving, [[...a, KEEP + 2.6], [...b, KEEP + 2.6], [...c, KEEP + 2.6]] as V3[], [0, 0, 1])
  }

  const flood = (_p: V3, n: V3) => (n[2] > 0.7 ? 0.25 : 0.9)
  return [
    { part: stone, material: { ...finish('qaitbay-limestone', 0xdcc8a4), floodlight: flood } },
    { part: dressed, material: { ...finish('qaitbay-dressed-stone', 0xe8dabd), floodlight: flood } },
    { part: paving, material: finish('qaitbay-paving', 0xcdbb98) },
    { part: win, material: PALETTE.window },
    { part: door, material: { ...PALETTE.entrance, color: 0x8a6a4a } },
  ]
}

if (import.meta.main) {
  const extras = { anchor: ANCHOR, bearing: BEARING }
  await writeModel(`${ID}.glb`, NAME, build(false), extras, 6500, 250_000)
  await writeModel(`${ID}.detail.glb`, NAME, build(true), extras, 40_000, 1_536_000)
}
