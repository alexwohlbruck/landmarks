/**
 * St Pancras station and the St Pancras Renaissance Hotel (the Midland
 * Grand Hotel), Euston Road, London — procedural, CC0-1.0, no textures.
 * bun generators/london-st-pancras.ts
 *
 * Writes models/london-st-pancras.glb (one level of detail; `build(true)`
 * gives a denser variant, not shipped). Uses the kit in
 * london-british-museum.ts.
 *
 * Map frame: x east, y north, z up, metres, turned to BEARING 334: +y (model
 * north) is compass 334°, along the train shed; the hotel's Euston Road
 * front faces model south (compass 154°). Anchor: the area-weighted centroid
 * of the two OSM outlines it replaces, the station way/4256246 and the
 * hotel way/15694166 (lng -0.126515, lat 51.531757). z = 0 is the street
 * on the east (Pancras Road) side, the lowest ground; Euston Road is 0.5-2 m
 * higher to the west.
 *
 * What makes it St Pancras, and how each is drawn
 * - George Gilbert Scott's red-brick Gothic hotel (1868–76): the long front
 *   range with two storeys of pointed windows to a panel, stone bands and
 *   dressings, the steep slate roof with gabled dormers and tall chimney
 *   stacks; the curved west wing sweeping down to Euston Road; the low
 *   arcaded porte-cochère range in front.
 * - The clock tower at the east (82 m): the brick shaft, the clock stage
 *   with four faces, corner pinnacles and the steep slate spire with its
 *   finial. The west tower: a square brick tower with a steep pyramid roof,
 *   corner pinnacles and a tall finial.
 * - W. H. Barlow's train shed (1868): a single-span 73 m pointed vault, 210 m
 *   long, 30.5 m above the platforms (which sit ~6 m above the street):
 *   a real curved 3D roof from the measured profile, pale blue-grey glazing
 *   over the crown and dark slate on the lower flanks, the iron ribs as
 *   real arches standing off the roof (every 17.8 m low, every 8.9 m detail),
 *   the glazed north gable screen; the brick side ranges along both flanks.
 * - Scope choice: the roof is modelled only as far as Barlow's historic
 *   shed (to y = 9.5, where its north screen stands). The station outline
 *   way/4256246 also takes in the 2007 flat-roofed northern extension
 *   (y 9.5-241); since the outline is replaced, the extension is drawn
 *   plainly as what the aerial shows: a thin flat glazed roof slab (muted
 *   grey glass, 17.6-18.6 m, the lidar's 18-19) with a slim stone-coloured
 *   edge and a grid of roof members, on slender columns, open beneath.
 * - Second pass (lead review): the clock tower made bolder (10 m shaft, a
 *   corbelled stone clock stage 46-55 m with 4.8 m gilt faces, gablets,
 *   taller corner pinnacles to 66 m, a broader spire from 56 m to 79 m, a
 *   gilt cross to the published 82 m); hotel gables lowered to 36.5 m and
 *   chimneys to 41 m (the lidar: eaves 30-31, ridge 38, nothing over 41);
 *   slate and shed glazing darker grey, as in the aerial.
 *
 * Evidence
 * - OSM (ODbL): station way/4256246 (height 30.5, NHLE 1342037, wikidata
 *   Q720102) and hotel way/15694166 (NHLE 1342037). OSM maps no parts; both
 *   outlines are in `replaces`.
 * - Environment Agency LIDAR Composite DSM/DTM 1 m, Open Government Licence
 *   v3.0, measured above z = 0: shed crown 37.9; the vault profile (crown
 *   37.9, 36.0 at 9.5 m off the axis, 33.9 at 14.5, 27.9 at 24.5; the
 *   axis at x = 4.5); the glazed lower bands have no returns (read as the
 *   platform). Hotel front range: eaves ~30, ridge band 38 (y -209..-214);
 *   clock tower footprint ~9.5 m square at (46, -216.5), its stone stage
 *   49-54 and the spire read to 70 (thin top under-read); west tower ~17 m
 *   square, roof top 61; side ranges 19 (east), 31 (west block); the 2007
 *   extension's roof 18-19.
 * - Published: clock tower about 82 m (the assignment; Wikipedia, "St
 *   Pancras railway station"); Barlow shed span 240 ft (73 m), 100 ft
 *   (30.5 m) high, 689 ft (210 m) long, ribs 29 ft 4 in (8.9 m) apart
 *   (Wikipedia; Historic England list entry 1342037).
 * - Photos (Wikimedia Commons), evidence:
 *   "St Pancras Railway Station 2012-06-23.jpg", Colin, CC BY-SA 3.0 (the
 *   hotel front and clock tower from the south-east: stage proportions; the
 *   spire is 0.6 of the shaft below it);
 *   "St Pancras Renaissance London Hotel and St Pancras Chambers.jpg", Yair
 *   Haklai, CC BY-SA 4.0 (the whole front, both towers, the curved west
 *   wing);
 *   "King's Cross St. Pancras aerial view, image 1.jpg", Héctor Ochoa
 *   'Robot8A', CC BY-SA 4.0 (the shed roof from the north-east: the pale
 *   ribbed crown and dark lower bands, the east range's chimneys, the north
 *   screen);
 *   "Kings Cross and St Pancras Stations - geograph.org.uk - 6018774.jpg", N
 *   Chadwick, CC BY-SA 2.0; "Midland Grand Hotel, St Pancras, from the
 *   British Library - geograph.org.uk - 1599058.jpg", Ian Petticrew, CC
 *   BY-SA 2.0.
 * - Estimated: the curved west wing's heights (it is outside the lidar box):
 *   taken as the front range's; window, dormer and chimney spacing; the
 *   brick colour (Gripper's red brick pulled to the palette's lightness);
 *   the spire's height above the lidar's reach (to the published 82 m).
 * - Doubts: whether the shed's lower bands are glass or slate (the DSM has
 *   no returns there, the photos show them dark); drawn as dark slate.
 * - Look-only references: none.
 *
 * Night: the hotel front and towers are floodlit; windows glow; the shed's
 * glass stays dark.
 */
import { Part, type V3, type MaterialSpec } from './mesh'
import { PALETTE, finish } from './palette'
import { writeModel } from './london-buckingham-palace'
import { cbox, rect, qf, tf, hip, gable, cylinder, type Rect } from './dc-white-house'
import { capPoly, wallsPoly, ccw, type XY } from './dc-national-cathedral'
import { lathe, TAU } from './nyc-columbus-monument'
import { faceOf, fpanel, fblock, fpt, prismPoly, type Face } from './london-british-museum'

const ID = 'london-st-pancras'

const BARLOW: XY[] = [[47.8, 9.5], [-42.4, 9.5], [-42.6, 5.9], [-33.2, 5.3], [-33.4, 0.7], [-35.2, 0.4], [-35.1, 2.5], [-47.4, 3.4], [-56.3, -55.0], [-61.8, -104.8], [-52.4, -105.1], [-51.8, -136.9], [-36.9, -139.8], [-35.5, -202.6], [38.1, -202.5], [38.1, -205.5], [46.7, -205.3], [48.6, -102.6], [46.6, -25.1]]
const EXT: XY[] = [[64.7, 10.2], [67.9, 241.1], [-41.8, 240.5], [-41.8, 21.8], [-42.4, 9.5], [47.8, 9.5]]
const WEST_BLOCK: XY[] = [[-61.8, -104.8], [-52.4, -105.1], [-51.8, -136.9], [-36.9, -139.8], [-36.3, -60], [-56.3, -55.0]]
// Hotel ranges (from the outline and the lidar).
const FRONT: Rect = rect(-52, 41.25, -219.5, -203.5)
const WTOWER: Rect = rect(-69, -52, -219.5, -202.5)
const CURVED: XY[] = [[-69.0, -219.5], [-75.9, -227.5], [-82.1, -238.4], [-81.4, -251.6], [-84.5, -251.8], [-84.0, -257.4], [-97.2, -258.6], [-97.6, -253.3], [-101.1, -253.4], [-102.1, -241.3], [-90.5, -201.0], [-69.0, -202.5]]
const REAR: XY[] = [[-90.5, -201.0], [-81.4, -168.9], [-72.3, -137.1], [-37.6, -140.4], [-36.6, -202.5], [-69.0, -202.5]]
const COCHERE: XY[] = [[-54, -219.5], [-54, -221], [-15.4, -226.6], [41.25, -226.6], [41.25, -219.5]]
const TOWER = { cx: 46.0, cy: -216.5, h: 5.0 }

// Barlow shed: axis, half-span, measured profile (offset from axis -> height).
const AX = 4.5, HS = 36.5, Y0 = -202.5, Y1 = 9.5
const PROF: [number, number][] = [[0, 37.9], [5, 37.4], [9.5, 36.0], [14.5, 33.9], [19.5, 31.2], [24.5, 27.9], [29, 23.6], [32.5, 18.8], [35, 13.0], [36.5, 7.0]]

function build(hi: boolean) {
  const brick = new Part(), trim = new Part(), slate = new Part(), win = new Part(), glass = new Part(), gold = new Part()

  // ===== Barlow shed: side ranges, vault, ribs, north screen ================
  prismPoly(brick, slate, BARLOW, 0, 19)
  prismPoly(brick, slate, WEST_BLOCK, 19, 30)
  // the vault: profile points from west to east
  const pts: XY[] = [...[...PROF].reverse().map(([d, z]) => [AX - d, z] as XY), ...PROF.slice(1).map(([d, z]) => [AX + d, z] as XY)]
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, z0] = pts[i], [x1, z1] = pts[i + 1]
    const glazed = Math.abs((x0 + x1) / 2 - AX) < 15
    const n: V3 = [-(z1 - z0), 0, x1 - x0]
    qf(glazed ? glass : slate, [x0, Y0, z0], [x1, Y0, z1], [x1, Y1, z1], [x0, Y1, z0], n)
  }
  // ribs: real arches standing off the roof (top and two sides), above the side ranges
  const rib = (y: number, w: number, hgt: number) => {
    const P = pts.filter(([x]) => Math.abs(x - AX) <= 33.5)
    for (let i = 0; i < P.length - 1; i++) {
      const [x0, z0] = P[i], [x1, z1] = P[i + 1]
      const t = [x1 - x0, z1 - z0], l = Math.hypot(t[0], t[1]), nx = -t[1] / l, nz = t[0] / l
      const o = (x: number, z: number, k: number): [number, number] => [x + nx * k, z + nz * k]
      const [a0, b0] = o(x0, z0, hgt), [a1, b1] = o(x1, z1, hgt)
      qf(trim, [a0, y - w, b0], [a1, y - w, b1], [a1, y + w, b1], [a0, y + w, b0], [nx, 0, nz])
      qf(trim, [x0, y - w, z0], [x1, y - w, z1], [a1, y - w, b1], [a0, y - w, b0], [0, -1, 0])
      qf(trim, [x0, y + w, z0], [x1, y + w, z1], [a1, y + w, b1], [a0, y + w, b0], [0, 1, 0])
    }
  }
  for (let y = Y0 + 8.9; y < Y1 - 1; y += 8.9) rib(y, 0.28, 0.4)
  rib(Y1 - 0.4, 0.6, 0.9) // the north end arch
  // north gable screen: glass under the arch with a few mullions
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, z0] = pts[i], [x1, z1] = pts[i + 1]
    qf(glass, [x0, Y1, 19], [x1, Y1, 19], [x1, Y1, Math.max(19, z1)], [x0, Y1, Math.max(19, z0)], [0, 1, 0])
  }
  for (const dx of hi ? [-27, -18, -9, 0, 9, 18, 27] : [-18, 0, 18]) {
    const x = AX + dx, zt = PROF.reduce((z, [d, pz], k) => (Math.abs(dx) >= d && k < PROF.length - 1 && Math.abs(dx) <= PROF[k + 1][0] ? pz + (PROF[k + 1][1] - pz) * (Math.abs(dx) - d) / (PROF[k + 1][0] - d) : z), 0)
    cbox(trim, rect(x - 0.3, x + 0.3, Y1 - 0.1, Y1 + 0.3), 19, zt, { top: false })
  }
  // chimney stacks along the east range, and its arched windows on Pancras Road
  for (let y = -190; y < 0; y += hi ? 9 : 18) cbox(brick, rect(43.0, 45.4, y - 1.0, y + 1.0), 19, 23.5, { top: true })
  {
    const R = ccw(BARLOW)
    for (let i = 0; i < R.length; i++) {
      const a = R[i], b = R[(i + 1) % R.length], f = faceOf(a, b)
      if (f.len < 20) continue
      const n = Math.floor(f.len / (hi ? 6 : 9))
      for (let k = 0; k < n; k++) {
        const c = (f.len * (k + 0.5)) / n
        fpanel(win, f, c - 1.1, c + 1.1, 4.0, 10.0)
        if (hi) fpanel(win, f, c - 0.9, c + 0.9, 12.0, 16.0)
      }
    }
  }
  // the 2007 extension: a plain flat box
  // a thin flat glazed roof on slender columns, open below (lidar top 18-19 m)
  prismPoly(trim, glass, EXT, 17.6, 18.6)
  capPoly(trim, EXT, 17.6, false)
  for (let y = 22; y < 238; y += 24) {
    cbox(trim, rect(-41.0, 66.5, y - 0.35, y + 0.35), 18.6, 18.85, { top: true })
    if ((y - 22) % 48 === 0) for (let x = -28; x < 62; x += 30) cylinder(trim, x, y, 0.4, 0, 17.6, 6)
  }
  for (let x = -24; x < 66; x += 18) cbox(trim, rect(x - 0.35, x + 0.35, 10.5, 240), 18.6, 18.85, { top: true })

  // ===== The hotel ============================================================
  const E = 29.5, RIDGE = 38
  // front range
  cbox(brick, FRONT, 0, E, { top: false })
  hip(slate, FRONT, E, RIDGE, 6.2)
  cbox(trim, rect(FRONT.x0 - 0.3, FRONT.x1 + 0.3, FRONT.y0 - 0.3, FRONT.y0 + 0.4), E - 1.0, E, { bottom: true })
  // stone bands, kept far apart (string courses over the ground and second floors)
  const fF = faceOf([FRONT.x0, FRONT.y0], [FRONT.x1, FRONT.y0])
  for (const z of [6.0, 15.0]) fblock(trim, fF, 0, fF.len, z, z + 0.6, 0, 0.18)
  // windows: two storeys to a pointed panel
  const bay = hi ? 3.6 : 4.6, nb = Math.floor(fF.len / bay)
  const pointed = (p: Part, f: Face, c: number, w: number, z0: number, z1: number) => {
    const zs = z1 - w * 0.6
    fpanel(p, f, c - w / 2, c + w / 2, z0, zs, 0.06)
    tf(p, fpt(f, c - w / 2, zs, 0.06), fpt(f, c + w / 2, zs, 0.06), fpt(f, c, z1, 0.06), [f.n[0], f.n[1], 0])
  }
  for (let k = 0; k < nb; k++) {
    const c = (fF.len * (k + 0.5)) / nb
    pointed(win, fF, c, 1.7, 7.0, 14.2)
    pointed(win, fF, c, 1.6, 16.0, 26.8)
  }
  // tall gabled bays breaking through the eaves, with pinnacles at apex and kneelers
  for (const gx of [-40, -17, 6, 29]) {
    const w = 7.5, x0 = gx - w / 2, x1 = gx + w / 2, y = FRONT.y0
    cbox(brick, rect(x0, x1, y - 0.7, y + 4), E, E + 2.5, { top: false })
    tf(brick, [x0, y - 0.7, E + 2.5], [x1, y - 0.7, E + 2.5], [gx, y - 0.7, E + 7.0], [0, -1, 0])
    gable(slate, brick, rect(x0, x1, y - 0.7, y + 6), E + 2.5, E + 7.0, true, [false, true])
    pointed(win, faceOf([x0, y - 0.7], [x1, y - 0.7]), w / 2, 2.0, E - 1.5, E + 5.5)
    for (const [px, pz, r, hgt] of [[x0, E + 2.5, 0.5, 3.5], [x1, E + 2.5, 0.5, 3.5], [gx, E + 7.0, 0.35, 2.4]] as const) lathe(trim, [[r, pz], [r, pz + hgt * 0.4], [0.03, pz + hgt]], 6, px, y - 0.7, false)
  }
  // gabled dormers on the front slope, chimney stacks along the ridge
  const nd = hi ? 16 : 9
  for (let k = 0; k < nd; k++) {
    const x = FRONT.x0 + 6 + ((FRONT.x1 - FRONT.x0 - 12) * (k + 0.5)) / nd, y = FRONT.y0 + 2.6
    cbox(brick, rect(x - 1.3, x + 1.3, y - 1.0, y + 1.6), E, E + 4.2, { top: false })
    gable(slate, brick, rect(x - 1.5, x + 1.5, y - 1.1, y + 2.6), E + 4.2, E + 6.6, true, [true, false])
    fpanel(win, faceOf([x - 1.3, y - 1.0], [x + 1.3, y - 1.0]), 0.6, 2.0, E + 0.6, E + 3.6, 0.04)
  }
  for (let k = 0; k < (hi ? 10 : 6); k++) {
    const x = FRONT.x0 + 4 + ((FRONT.x1 - FRONT.x0 - 8) * (k + 0.5)) / (hi ? 10 : 6)
    cbox(brick, rect(x - 0.9, x + 0.9, -212.5, -210.5), RIDGE - 2, RIDGE + 3.0, { top: true })
  }
  // curved west wing and the rear wing
  prismPoly(brick, null, CURVED, 0, 27)
  {
    // a steep roof: the ring inset towards its own centroid
    const R = ccw(CURVED), c: XY = [R.reduce((s, p) => s + p[0], 0) / R.length, R.reduce((s, p) => s + p[1], 0) / R.length]
    const top: V3[] = R.map(([x, y]) => [x + (c[0] - x) * 0.45, y + (c[1] - y) * 0.45, 35])
    for (let i = 0; i < R.length; i++) {
      const j = (i + 1) % R.length
      qf(slate, [R[i][0], R[i][1], 27], [R[j][0], R[j][1], 27], top[j], top[i], [R[i][0] + R[j][0] - 2 * c[0], R[i][1] + R[j][1] - 2 * c[1], 4])
    }
    capPoly(slate, top.map(([x, y]) => [x, y] as XY), 35, true)
    const R2 = ccw(CURVED)
    for (let i = 0; i < R2.length; i++) {
      const f = faceOf(R2[i], R2[(i + 1) % R2.length])
      if (f.len < 8 || f.n[1] > 0.6) continue
      const n = Math.floor(f.len / (hi ? 3.6 : 4.6))
      for (let k = 0; k < n; k++) {
        const cc = (f.len * (k + 0.5)) / n
        pointed(win, f, cc, 1.6, 7.0, 13.8)
        pointed(win, f, cc, 1.5, 15.6, 24.4)
      }
    }
  }
  prismPoly(brick, null, REAR, 0, 15)
  {
    const R = ccw(REAR), c: XY = [R.reduce((s, p) => s + p[0], 0) / R.length, R.reduce((s, p) => s + p[1], 0) / R.length]
    const top: V3[] = R.map(([x, y]) => [x + (c[0] - x) * 0.3, y + (c[1] - y) * 0.3, 19])
    for (let i = 0; i < R.length; i++) {
      const j = (i + 1) % R.length
      qf(slate, [R[i][0], R[i][1], 15], [R[j][0], R[j][1], 15], top[j], top[i], [R[i][0] + R[j][0] - 2 * c[0], R[i][1] + R[j][1] - 2 * c[1], 4])
    }
    capPoly(slate, top.map(([x, y]) => [x, y] as XY), 19, true)
  }
  // porte-cochère / arcade range in front
  prismPoly(brick, trim, COCHERE, 0, 5.5)
  {
    const f = faceOf([-15.4, -226.6], [41.25, -226.6]), n = hi ? 12 : 8
    for (let k = 0; k < n; k++) {
      const c = (f.len * (k + 0.5)) / n
      pointed(win, f, c, 2.6, 0.6, 4.6)
    }
  }

  // ===== West tower ============================================================
  {
    const T = WTOWER, cx = (T.x0 + T.x1) / 2, cy = (T.y0 + T.y1) / 2
    cbox(brick, T, 0, 44, { top: false })
    cbox(trim, rect(T.x0 - 0.4, T.x1 + 0.4, T.y0 - 0.4, T.y1 + 0.4), 43.2, 44.2, { bottom: true, top: false })
    const r = [[T.x0, T.y0], [T.x1, T.y0], [T.x1, T.y1], [T.x0, T.y1]] as XY[]
    for (let i = 0; i < 4; i++) {
      const a = r[i], b = r[(i + 1) % 4]
      tf(slate, [a[0], a[1], 44.2], [b[0], b[1], 44.2], [cx, cy, 60.5], [(a[0] + b[0]) / 2 - cx, (a[1] + b[1]) / 2 - cy, 1])
    }
    cylinder(trim, cx, cy, 0.35, 60, 66, 6, 0.1)
    for (const [x, y] of r) {
      const px = x + Math.sign(cx - x) * 0.9, py = y + Math.sign(cy - y) * 0.9
      lathe(trim, [[0.9, 44.2], [0.9, 47.5], [0.05, 52.5]], 6, px, py, false)
    }
    const fT = faceOf([T.x0, T.y0], [T.x1, T.y0])
    for (const c of [4.5, 8.5, 12.5]) for (const [z0, z1] of [[7, 14.2], [16, 26.8], [30, 40]] as const) pointed(win, fT, c, 1.6, z0, z1)
  }

  // ===== Clock tower ===========================================================
  {
    const { cx, cy, h } = TOWER
    const T = rect(cx - h, cx + h, cy - h, cy + h)
    cbox(brick, T, 0, 46, { top: false })
    for (const z of [15.0, 30.0]) cbox(trim, rect(T.x0 - 0.2, T.x1 + 0.2, T.y0 - 0.2, T.y1 + 0.2), z, z + 0.6, { bottom: true, top: false })
    // clock stage: stone, slightly corbelled, a clock face on each side
    cbox(trim, rect(T.x0 - 0.6, T.x1 + 0.6, T.y0 - 0.6, T.y1 + 0.6), 46, 55, { bottom: true, top: false })
    for (const [nx, ny] of [[0, -1], [1, 0], [0, 1], [-1, 0]] as XY[]) {
      const ox = cx + nx * (h + 0.65), oy = cy + ny * (h + 0.65), nseg = hi ? 16 : 12, rr = 2.4
      const u: XY = [-ny, nx]
      const c: V3 = [ox, oy, 50.5]
      for (let k = 0; k < nseg; k++) {
        const a0 = (TAU * k) / nseg, a1 = (TAU * (k + 1)) / nseg
        tf(gold, c, [ox + u[0] * rr * Math.cos(a0), oy + u[1] * rr * Math.cos(a0), 50.5 + rr * Math.sin(a0)], [ox + u[0] * rr * Math.cos(a1), oy + u[1] * rr * Math.cos(a1), 50.5 + rr * Math.sin(a1)], [nx, ny, 0])
      }
    }
    // windows on the shaft (south and east faces)
    for (const f of [faceOf([T.x0, T.y0], [T.x1, T.y0]), faceOf([T.x1, T.y0], [T.x1, T.y1])]) {
      for (const [z0, z1] of [[8, 14.2], [18, 28.5], [33, 43.5]] as const) { pointed(win, f, f.len / 2 - 1.8, 1.4, z0, z1); pointed(win, f, f.len / 2 + 1.8, 1.4, z0, z1) }
    }
    // corner pinnacles and the spire
    for (const [x, y] of [[T.x0, T.y0], [T.x1, T.y0], [T.x1, T.y1], [T.x0, T.y1]] as XY[]) {
      lathe(trim, [[1.0, 55], [1.0, 59], [0.05, 66]], hi ? 8 : 6, x, y, false)
      cylinder(gold, x, y, 0.08, 65.6, 67.2, 4)
    }
    const s = 4.4, sp: XY[] = [[cx - s, cy - s], [cx + s, cy - s], [cx + s, cy + s], [cx - s, cy + s]]
    cbox(trim, rect(cx - s, cx + s, cy - s, cy + s), 55, 56.0, { top: false })
    // spire: a square base becoming an octagon, to the tip
    const oct = (r: number, z: number): V3[] => Array.from({ length: 8 }, (_, i) => [cx + r * Math.cos(Math.PI / 8 + (TAU * i) / 8), cy + r * Math.sin(Math.PI / 8 + (TAU * i) / 8), z])
    const sq: V3[] = []
    for (let i = 0; i < 4; i++) { const a = sp[i], b = sp[(i + 1) % 4]; sq.push([a[0], a[1], 56], [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, 56]) }
    // re-order the square points to match the octagon's angles
    const ang = (p: V3) => Math.atan2(p[1] - cy, p[0] - cx)
    const o1 = oct(3.0, 64.5).sort((a, b) => ang(a) - ang(b)), sqs = sq.sort((a, b) => ang(a) - ang(b))
    for (let i = 0; i < 8; i++) {
      const j = (i + 1) % 8
      qf(slate, sqs[i], sqs[j], o1[j], o1[i], [(sqs[i][0] + sqs[j][0]) / 2 - cx, (sqs[i][1] + sqs[j][1]) / 2 - cy, 1])
      qf(slate, o1[i], o1[j], [cx, cy, 79], [cx, cy, 79], [(o1[i][0] + o1[j][0]) / 2 - cx, (o1[i][1] + o1[j][1]) / 2 - cy, 0.2])
    }
    // lucarnes (little gabled openings) at the spire's foot, one per side
    for (const [nx, ny] of [[0, -1], [1, 0], [0, 1], [-1, 0]] as XY[]) {
      const x = cx + nx * 3.6, y = cy + ny * 3.6, u: XY = [-ny, nx]
      const A: V3 = [x + u[0] * 1.8 + nx * 1.0, y + u[1] * 1.8 + ny * 1.0, 56], B: V3 = [x - u[0] * 1.8 + nx * 1.0, y - u[1] * 1.8 + ny * 1.0, 56]
      tf(trim, A, B, [x + nx * 1.0, y + ny * 1.0, 61.5], [nx, ny, 0])
    }
    cylinder(gold, cx, cy, 0.22, 78.5, 82.0, 6, 0.08)
    cbox(gold, rect(cx - 0.9, cx + 0.9, cy - 0.1, cy + 0.1), 80.6, 80.9)
  }

  const flood = (p: V3, n: V3) => (p[1] < -200 && n[1] < -0.4 && p[2] < 60 ? 0.8 : 0)
  const parts: Array<{ part: Part; material: MaterialSpec }> = [
    { part: brick, material: { ...finish('red-brick', 0xc7856f), floodlight: flood } },
    { part: trim, material: { ...finish('stone-dressings', 0xeee3d0), floodlight: flood } },
    { part: slate, material: finish('slate', 0x68717b) },
    { part: win, material: PALETTE.window },
    { part: glass, material: { ...PALETTE.glass, color: 0x8e9ba5 } },
    { part: gold, material: finish('clock-gilt', 0xd9c27e) },
  ]
  return parts
}

if (import.meta.main) {
  const extras = { landmark: 'St Pancras', wikidata: 'Q720102' }
  writeModel('St Pancras', ID, build(false), extras, 6500)
}
