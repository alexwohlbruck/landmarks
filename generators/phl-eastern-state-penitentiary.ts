/**
 * Eastern State Penitentiary, Philadelphia — procedural, CC0-1.0, no textures.
 * bun generators/phl-eastern-state-penitentiary.ts
 *
 * Map frame: x east, y north, z up, metres, bearing 0. The anchor is the
 * central rotunda (the hub of the spokes), which is also the centre of the
 * walled square to within a metre (lng -75.17266, lat 39.96834). z = 0 is
 * the yard inside the walls; the street outside on Fairmount Avenue is
 * about 3.5 m lower and the map's drape takes up the difference.
 *
 * What it is: John Haviland's prison (1829-36, cell blocks added to 1959,
 * closed 1971, a museum since 1994), the first "hub and spoke" plan: a
 * central surveillance rotunda with long cell blocks radiating from it, the
 * original seven (single-storey 1-3, two-storey 4-7) and the later blocks
 * 8-15 crowding the wedges between them, all inside a 30 ft (9-10 m) stone
 * wall with corner watchtowers and the Gothic Revival gatehouse with its
 * crenellated central tower and two octagonal towers on Fairmount Avenue.
 *
 * Replaces (OSM): relation/19277077 (the cell blocks, a multipolygon
 * building with its yards as holes), the gatehouse way/50193080 (Tour
 * Entrance), the four corner towers way/1408585768, way/1408585769,
 * way/1408585770, way/1408585771, the chapel way/75450143 and the
 * forecourt building way/1408585762. way/320052082 is the museum's site outline
 * (tourism=museum, no building tag) and is not a building; the wall itself
 * is not mapped as a building. Small sheds (greenhouse way/75450139 and
 * others) are not drawn.
 *
 * Evidence
 * - USGS NAIP orthophoto (public domain), 0.2 m: the plan of every block,
 *   the wall and the gatehouse, read on a 5 m grid; roof colours (red on
 *   the east block, the south-east block and the corridors round the hub;
 *   light grey on the north, south-west and north-east cores; dark grey
 *   elsewhere).
 * - USGS 3DEP lidar, USGS_LPC_DE_DelawareValley_HD_2015_LAS_2017 (flown
 *   2015), 1 m, heights above the yard: block axes from a polar scan of the
 *   ridges (0, 35, 44, 89.6, 132, 179.5, 201, 224, 315 degrees from east),
 *   each block's width and ends from cross-sections every 4 m. Two-storey
 *   blocks: core 12-13 m wide, eaves 12, ridge 14.3-15.3, single-storey
 *   aisles 7-8 either side; single-storey blocks eaves 8, ridges 10-12;
 *   rotunda 15, its lantern 23; wall 10 over the yard (13-14 over the
 *   streets); corner towers 18-19; gatehouse 15-16, its central tower
 *   26.5, side towers 19-20.
 * - OSM: relation/19277077 and the museum outline way/320052082 (the wall
 *   line, turned about 1.3 degrees clockwise).
 * - Photos (Wikimedia Commons): "Eastern state penitentiary09.JPG"
 *   (Davidt8, public domain: the gatehouse and wall from the street),
 *   "Eastern State Penitentiary (53574639765).jpg" (ajay_suresh, CC BY 2.0:
 *   the gatehouse front, its pointed portal and crenellations), "Eastern
 *   State Penitentiary Wall.jpg" and "Eastern State Penitentiary aerial
 *   crop.jpg" (Mike Graham, CC BY 2.0: the inner face of the gate towers;
 *   an engraving of the 1830s plan), "Eastern State Penitentiary Watch
 *   Tower.jpg" (DC Chadwick, CC BY-SA 4.0: a corner watchtower's glazed
 *   cab), "Eastern State Penitentiary Grounds.jpg" (DC Chadwick, CC BY-SA
 *   4.0), "Eastern State Penitentiary - Cell blocks 4..jpg" (Dudva, CC
 *   BY-SA 3.0: the cell blocks' rubble stone walls).
 * - Published: Wikipedia and the NHL nomination (dates, the 30 ft wall,
 *   the 11-acre square).
 * - Estimated: the stone colour (a warm grey-buff from the street photos,
 *   pulled to the palette's lightness), merlon spacing, the portal's size,
 *   the corner towers' cabs, the blocks' wall heights where roofs overhang.
 *
 * Doubts
 * - The later wedge blocks south and east of the hub (blocks 9-14) are
 *   drawn from NAIP outlines with low hipped roofs; their real roofs have
 *   skylit monitors and partly collapsed bays (the blocks are a "stabilized
 *   ruin"), not drawn.
 * - Exercise-yard walls (3-4 m), sheds, greenhouses and trees in the yards
 *   are left out; the wall's height is the yard-side 10 m, and the map's
 *   drape adds the street-side drop.
 *
 * Night: the gatehouse front and the street faces of the wall are floodlit
 * (`_FLOODLIGHT` on the stone); nothing glows.
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { cbox, cylinder, grow, panel, qf, rect, tf, type Rect } from './dc-white-house'
import { pslab, poffset, pcap, saveModel, type XY } from './dc-nga-west'

const G = { stone: new Part(), roof: new Part(), red: new Part(), light: new Part(), dark: new Part() }
type Parts = typeof G
type RoofKey = 'roof' | 'red' | 'light'
const fresh = (): Parts => ({ stone: new Part(), roof: new Part(), red: new Part(), light: new Part(), dark: new Part() })

/** Copy local parts into the model, turned `deg` counter-clockwise about the origin, then moved by (dx, dy). */
function place(src: Parts, deg: number, dx = 0, dy = 0) {
  const a = (deg * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a)
  for (const k of Object.keys(G) as (keyof Parts)[]) {
    const S = src[k], D = G[k]
    for (let i = 0; i < S.pos.length; i += 3) {
      const x = S.pos[i], y = -S.pos[i + 2], z = S.pos[i + 1]
      const nx = S.nrm[i], ny = -S.nrm[i + 2], nz = S.nrm[i + 1]
      D.pos.push(dx + x * c - y * s, z, -(dy + x * s + y * c))
      D.nrm.push(nx * c - ny * s, nz, -(nx * s + ny * c))
    }
    D.uv.push(...S.uv)
  }
}

/** A gable roof along x over rect r (eaves ze, ridge zr, overhang o), with stone gable ends. */
function gableX(P: Parts, roof: RoofKey, r: Rect, ze: number, zr: number, o = 0.4) {
  const g = grow(r, o), ym = (r.y0 + r.y1) / 2
  qf(P[roof], [g.x0, g.y0, ze], [g.x1, g.y0, ze], [g.x1, ym, zr], [g.x0, ym, zr], [0, -(zr - ze), ym - g.y0])
  qf(P[roof], [g.x0, g.y1, ze], [g.x1, g.y1, ze], [g.x1, ym, zr], [g.x0, ym, zr], [0, zr - ze, g.y1 - ym])
  for (const [x, s] of [[r.x0, -1], [r.x1, 1]] as const) tf(P.stone, [x, r.y0, ze], [x, r.y1, ze], [x, ym, zr], [s, 0, 0])
}

/** A lean-to roof over rect r, high (zh) on the side y = yHigh, low (zl) on the other. */
function leanTo(P: Parts, roof: RoofKey, r: Rect, zl: number, zh: number, highAtY1: boolean, o = 0.3) {
  const g = grow(r, o, 0)
  const yh = highAtY1 ? r.y1 : r.y0, yl = highAtY1 ? g.y0 - o : g.y1 + o
  qf(P[roof], [g.x0, yl, zl], [g.x1, yl, zl], [g.x1, yh, zh], [g.x0, yh, zh], [0, highAtY1 ? -(zh - zl) : zh - zl, Math.abs(yh - yl)])
  for (const [x, s] of [[r.x0, -1], [r.x1, 1]] as const) tf(P.stone, [x, yl, zl], [x, yh, zl], [x, yh, zh], [s, 0, 0])
}

/** A hipped roof over any simple polygon: eaves ring at ze, inset by d to a flat top at zr. */
function hipPoly(p: Part, ring: XY[], ze: number, zr: number, d: number) {
  const o = poffset(ring, 0.4), t = poffset(ring, -d)
  p.loft([o.map(([x, y]) => [x, y, ze] as V3), t.map(([x, y]) => [x, y, zr] as V3)])
  pcap(p, t, zr, true)
}

// ---------------------------------------------------------------------------
// A radial cell block, built along +x from the hub then turned to theta.
type Radial = {
  theta: number; r0: number; r1: number; hc: number; ze: number; zr: number; roof: RoofKey
  aisle?: { w: number; z: number; roof: RoofKey; sides?: (-1 | 1)[]; r0?: number }
}
function radial(b: Radial) {
  const P = fresh()
  const core = rect(b.r0, b.r1, -b.hc, b.hc)
  cbox(P.stone, core, 0, b.ze, { top: false })
  gableX(P, b.roof, core, b.ze - 0.15, b.zr)
  if (b.aisle) {
    const a = b.aisle
    for (const s of a.sides ?? [-1, 1]) {
      const r = s > 0 ? rect(a.r0 ?? b.r0, b.r1, b.hc, b.hc + a.w) : rect(a.r0 ?? b.r0, b.r1, -b.hc - a.w, -b.hc)
      cbox(P.stone, r, 0, a.z, { top: false })
      leanTo(P, a.roof, r, a.z - 0.1, a.z + 0.9, s < 0)
    }
  }
  place(P, b.theta)
}

/** A plain block on a polygon: walls to ze, hipped roof to zr. */
function polyBlock(ring: XY[], ze: number, zr: number, d: number, roof: RoofKey) {
  pslab(G.stone, ring, 0, ze, 0, false)
  hipPoly(G[roof], ring, ze - 0.15, zr, d)
}

/** An oriented rectangle block (centre, axis degrees, half-length, half-width) with a hip roof. */
function boxBlock(cx: number, cy: number, deg: number, hu: number, hv: number, ze: number, zr: number, roof: RoofKey) {
  const a = (deg * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a)
  const ring: XY[] = [[-hu, -hv], [hu, -hv], [hu, hv], [-hu, hv]].map(([u, v]) => [cx + u * c - v * s, cy + u * s + v * c])
  polyBlock(ring, ze, zr, Math.min(hu, hv) * 0.8, roof)
}

/** Merlons along a run from a to b at the top z of a wall t thick, facing out on the right of a→b. */
function merlons(p: Part, a: XY, b: XY, z: number, t = 0.7, pitch = 2.0) {
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L
  const n = Math.max(1, Math.floor(L / pitch))
  for (let k = 0; k < n; k++) {
    const s = (L * (k + 0.5)) / n, w = Math.min(1.1, pitch * 0.55) / 2
    const cx = a[0] + ux * s, cy = a[1] + uy * s
    const ring: XY[] = [[-w, -t / 2], [w, -t / 2], [w, t / 2], [-w, t / 2]].map(([u, v]) => [cx + u * ux - v * uy, cy + u * uy + v * ux])
    pslab(p, ring, z, z + 1.1, 0.08)
  }
}

/** An octagonal tower, with merlons round its top or a glazed cab and a pyramid roof. */
function octTower(cx: number, cy: number, r: number, z: number, crown: 'merlons' | 'cab') {
  const ring: XY[] = Array.from({ length: 8 }, (_, k) => [cx + r * Math.cos((k + 0.5) * Math.PI / 4), cy + r * Math.sin((k + 0.5) * Math.PI / 4)])
  if (crown === 'merlons') {
    pslab(G.stone, ring, 0, z, 0.2)
    const R = poffset(ring, -0.35)
    for (let k = 0; k < 8; k++) merlons(G.stone, R[k], R[(k + 1) % 8], z, 0.7, 1.9)
    return
  }
  pslab(G.stone, ring, 0, z, 0.15)
  const cab: XY[] = poffset(ring, -0.5)
  pslab(G.dark, cab, z, z + 2.6, 0, false)
  const eave = poffset(ring, 0.2)
  G.roof.loft([eave.map(([x, y]) => [x, y, z + 2.6] as V3), eave.map(() => [cx, cy, z + 4.6] as V3)])
  pcap(G.roof, eave, z + 2.6, false)
}

// ===========================================================================
// The hub: the rotunda, its lantern, and the red-roofed corridors that join
// it to every block.
{
  cylinder(G.stone, 0, 0, 6.5, 0, 13.4, 16)
  const eave: XY[] = Array.from({ length: 16 }, (_, k) => [6.9 * Math.cos((k * Math.PI) / 8), 6.9 * Math.sin((k * Math.PI) / 8)])
  G.light.loft([eave.map(([x, y]) => [x, y, 13.3] as V3), eave.map(([x, y]) => [x * 0.32, y * 0.32, 15.6] as V3)])
  const lan: XY[] = Array.from({ length: 8 }, (_, k) => [2.1 * Math.cos((k + 0.5) * Math.PI / 4), 2.1 * Math.sin((k + 0.5) * Math.PI / 4)])
  pslab(G.stone, lan, 15.2, 20.6, 0.1, false)
  for (let k = 0; k < 8; k += 2) {
    const a = lan[k], b = lan[k + 1]
    const nx = (a[0] + b[0]) / 2, ny = (a[1] + b[1]) / 2, l = Math.hypot(nx, ny)
    qf(G.dark, [a[0] * 1.02, a[1] * 1.02, 17], [b[0] * 1.02, b[1] * 1.02, 17], [b[0] * 1.02, b[1] * 1.02, 20], [a[0] * 1.02, a[1] * 1.02, 20], [nx / l, ny / l, 0])
  }
  const cap = poffset(lan, 0.35)
  G.roof.loft([cap.map(([x, y]) => [x, y, 20.6] as V3), cap.map(() => [0, 0, 23.0] as V3)])
  pcap(G.roof, cap, 20.6, false)
  for (const th of [0, 35, 44, 89.6, 132, 179.5, 201, 224, 270, 315]) {
    const P = fresh()
    const r = rect(5.5, 17, -2.6, 2.6)
    cbox(P.stone, r, 0, 7.0, { top: false })
    gableX(P, 'red', r, 6.9, 8.8, 0.3)
    place(P, th)
  }
}

// ---------------------------------------------------------------------------
// The radial blocks (lidar axes and sections; NAIP ends and roof colours).
radial({ theta: 0, r0: 9, r1: 88, hc: 8, ze: 7.8, zr: 10.2, roof: 'red' }) // east, single storey
radial({ theta: 44, r0: 14, r1: 80, hc: 7, ze: 8.0, zr: 10.3, roof: 'light' }) // north-east, single storey
radial({ theta: 35, r0: 38, r1: 97, hc: 4.5, ze: 12.4, zr: 14.2, roof: 'roof', aisle: { w: 7.5, z: 9.4, roof: 'roof', sides: [-1], r0: 20 } })
radial({ theta: 89.6, r0: 14, r1: 88, hc: 6, ze: 11.8, zr: 14.3, roof: 'light', aisle: { w: 4.5, z: 7.4, roof: 'roof' } }) // north
radial({ theta: 132, r0: 14, r1: 113, hc: 6, ze: 12.0, zr: 14.6, roof: 'roof', aisle: { w: 4.0, z: 7.4, roof: 'roof' } }) // north-west
radial({ theta: 179.5, r0: 14, r1: 86, hc: 6, ze: 12.0, zr: 14.4, roof: 'roof', aisle: { w: 4.5, z: 7.4, roof: 'roof' } }) // west
radial({ theta: 201, r0: 20, r1: 92, hc: 7.75, ze: 13.2, zr: 14.4, roof: 'roof' }) // west-south-west
radial({ theta: 224, r0: 14, r1: 114, hc: 6.5, ze: 12.5, zr: 15.3, roof: 'light', aisle: { w: 4.0, z: 7.6, roof: 'roof' } }) // south-west
radial({ theta: 315, r0: 14, r1: 112, hc: 11.5, ze: 8.0, zr: 11.8, roof: 'roof' }) // south-east, the wide single-storey block

// The wedge blocks south and east of the hub, from NAIP outlines.
polyBlock([[-4, -14], [12, -18], [17, -36], [22, -64.5], [-27, -64.5], [-7, -21]], 7.8, 9.2, 4.5, 'roof') // south-south-west
polyBlock([[-27, -64.5], [-47, -87], [-73, -87], [-7, -21]], 7.8, 9.0, 3.5, 'roof')
polyBlock([[8, -11], [63, -88], [40, -88], [22, -64.5], [17, -36], [12, -20]], 7.8, 9.6, 2.5, 'red') // south-south-east
polyBlock([[27, -12], [89, -19], [89, -66]], 8.0, 10.0, 6, 'light') // east-south-east
// The north-east end blocks, death row, the block north-north-west of the hub, the chapel.
boxBlock(76, 73, 45, 15, 8, 13.5, 15.6, 'red')
pslab(G.stone, [[76, 9.5], [89, 9.5], [89, 32], [76, 32]], 0, 9.6, 0, G.roof)
polyBlock([[-44, 74], [-19, 74], [-19, 89], [-44, 89]], 15.0, 16.4, 6, 'roof')
polyBlock([[-32, 52], [-22, 52], [-22, 74], [-32, 74]], 11.2, 12.6, 4, 'roof')
polyBlock([[-88, 21], [-78, 21], [-78, 50], [-88, 50]], 14.8, 16.2, 4, 'roof')
polyBlock([[-78, 21], [-63, 21], [-63, 31], [-78, 31]], 12.6, 13.8, 4, 'roof')
pslab(G.stone, [[-31, -79], [-11, -79], [-11, -72], [-31, -72]], 0, 6.8, 0.2, G.roof) // the forecourt building (way/1408585762)

// ---------------------------------------------------------------------------
// The wall: a square between the corner towers (lidar crest), 10 m over the
// yard, in pieces of about 12 m so the map can drape it; open where the
// gatehouse stands in the south side.
const C: XY[] = [[-98.5, -98.0], [96.5, -99.0], [97.5, 97.5], [-97.0, 98.5]] // SW, SE, NE, NW
const WALL = 10.2, T = 2.4
for (let i = 0; i < 4; i++) {
  const a = C[i], b = C[(i + 1) % 4]
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L
  // inward normal (the ring runs counter-clockwise)
  const nx = -uy, ny = ux
  const n = Math.round(L / 12)
  for (let k = 0; k < n; k++) {
    const s0 = (L * k) / n, s1 = (L * (k + 1)) / n
    const P0: XY = [a[0] + ux * s0, a[1] + uy * s0], P1: XY = [a[0] + ux * s1, a[1] + uy * s1]
    const mid = [(P0[0] + P1[0]) / 2, (P0[1] + P1[1]) / 2]
    if (i === 0 && mid[0] > -36 && mid[0] < 30) continue // the gatehouse
    const ring: XY[] = [
      [P0[0] - nx * T / 2, P0[1] - ny * T / 2], [P1[0] - nx * T / 2, P1[1] - ny * T / 2],
      [P1[0] + nx * T / 2, P1[1] + ny * T / 2], [P0[0] + nx * T / 2, P0[1] + ny * T / 2],
    ]
    pslab(G.stone, ring, 0, WALL, 0.25)
  }
}
for (const [x, y] of C) octTower(x, y, 3.6, 14.0, 'cab')

// ---------------------------------------------------------------------------
// The gatehouse on Fairmount Avenue: a crenellated front block over the
// pointed portal, the tall square central tower, two octagonal towers.
{
  const F = -102.0 // the street face
  const main = rect(-25, 20, F, -89)
  cbox(G.stone, main, 0, 15.2, { top: G.roof })
  merlons(G.stone, [main.x0 + 0.4, F + 0.35], [main.x1 - 0.4, F + 0.35], 15.2, 0.7, 2.2)
  merlons(G.stone, [main.x1 - 0.4, main.y1 - 0.35], [main.x0 + 0.4, main.y1 - 0.35], 15.2, 0.7, 2.2)
  // the central tower
  const tw = rect(-7.5, 2.5, -96, -85.5)
  cbox(G.stone, tw, 0, 25.4, { top: G.roof, b: 0.15 })
  const R: XY[] = [[tw.x0 + 0.35, tw.y0 + 0.35], [tw.x1 - 0.35, tw.y0 + 0.35], [tw.x1 - 0.35, tw.y1 - 0.35], [tw.x0 + 0.35, tw.y1 - 0.35]]
  for (let k = 0; k < 4; k++) merlons(G.stone, R[k], R[(k + 1) % 4], 25.4, 0.7, 1.9)
  // the portal: a tall pointed arch, and slit windows
  const pc = -2.5, pw = 2.4, spring = 5.6
  panel(G.dark, 's', F, pc - pw, pc + pw, 0, spring, 0.05)
  const pts: XY[] = []
  for (let k = 0; k <= 6; k++) {
    const t = (Math.PI / 3) * (k / 6) // the right half of a two-centred arch
    pts.push([pc - pw + 2 * pw * Math.cos(t), spring + 2 * pw * Math.sin(t)])
  }
  for (let k = 0; k < 6; k++) tf(G.dark, [pc - pw, F - 0.05, spring], [pts[k][0], F - 0.05, pts[k][1]], [pts[k + 1][0], F - 0.05, pts[k + 1][1]], [0, -1, 0])
  for (let k = 0; k < 6; k++) {
    const q = pts.map(([x, z]) => [2 * pc - x, z] as XY)
    tf(G.dark, [pc + pw, F - 0.05, spring], [q[k][0], F - 0.05, q[k][1]], [q[k + 1][0], F - 0.05, q[k + 1][1]], [0, -1, 0])
  }
  for (const x of [-17, -11, 7, 13]) panel(G.dark, 's', F, x - 0.45, x + 0.45, 6.5, 11.5, 0.05)
  panel(G.dark, 's', -96, -3.4, -1.6, 17.5, 22.5, 0.05)
  octTower(-29.5, -97, 4.8, 19.4, 'merlons')
  octTower(24.0, -98, 4.5, 19.4, 'merlons')
}

// Floodlit at night: the gatehouse front and the street faces of the wall.
const lit = (p: V3, n: V3): number => {
  if (n[2] > 0.6) return 0.1
  const out = Math.abs(p[0]) > 94 || Math.abs(p[1]) > 94
  if (p[1] < -84 && Math.abs(p[0]) < 36) return n[1] < -0.3 ? 0.95 : 0.6
  return out ? 0.45 : 0
}
const STONE = { ...finish('esp-stone', 0xcdbfa6), floodlight: lit }
if (import.meta.main) {
  await saveModel('phl-eastern-state-penitentiary', 'Eastern State Penitentiary', [
    { part: G.stone, material: STONE },
    { part: G.roof, material: finish('esp-slate', 0x7c8389) },
    { part: G.light, material: finish('esp-roof-light', 0xb3b6b5) },
    { part: G.red, material: finish('esp-roof-red', 0xb07a68) },
    { part: G.dark, material: finish('esp-dark', 0x585d61) },
  ], { source: 'generators/phl-eastern-state-penitentiary.ts', bearing: 0, osm: 'relation/19277077', footprint: [196, 205], height: 26.5 }, 6500)
}
