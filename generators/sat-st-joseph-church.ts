/**
 * St. Joseph Catholic Church ("St. Joske's"), 623 East Commerce Street, San
 * Antonio, Texas: the 1868-1876 Gothic Revival limestone church of the
 * German Catholic parish, its spire completed 1898, now wrapped on three
 * sides by the Rivercenter mall (the former Joske's store). It faces SOUTH
 * onto Commerce Street: a broad gabled front with corner buttresses and two
 * tall lancets, the central tower with the pointed door, a round window, two
 * lancets, the belfry's louvred pair and a trefoil oculus under a cornice
 * with corner pinnacles, and the slate spire with its dormers, bands and
 * cross. Behind: the hall-church nave under one pitched roof, the apse and
 * the low sacristy rooms. Only the church is modelled; the mall around it is
 * a separate building (way/99942673) and the model stays inside the church's
 * own outline. Original procedural geometry, CC0-1.0.
 *   bun generators/sat-st-joseph-church.ts
 *
 * Frame: bearing 11.2 (the OSM outline is square to 0.1 m in it). x across
 * the church, y along it towards the apse (north-north-east), z up, metres.
 * Drawn about the lidar grid's centre (-98.48642, 29.42378), shifted by
 * (-1.36, 5.90) so the origin is the area centroid of OSM way/78604538
 * (-98.486418, 29.423725).
 *
 * Ground: flat (Mapterhorn 0.5-1.0 m; lidar 0.5-0.9 over its ground_min);
 * heights below are lidar less 0.6. Elevation 0.
 *
 * Evidence
 * - OSM way/78604538 (building=church): the front y -25.0 (the tower to
 *   -25.8), the nave x -6.5..10.7 to y 5.4, the apse to y 13.2, the sacristy
 *   rooms west and north-west. The lidar walls sit at x -5.5..10.5; the
 *   model takes x -6.0..10.6.
 * - USGS 3DEP lidar USGS_LPC_TX_Central_B2_2017_LAS_2019 (2017), 0.5 m grid
 *   (~/landmarks-scratch/satx/work/sat-st-joseph-church/lidar.json), less
 *   0.6: side walls 11.2, the roof ridge 15.4 on x 2.3; the tower 5 m square
 *   centred x 3.3, its cornice 25.5 (the returns at its edges); the spire's
 *   flanks 29.6 at 1.6 m from its axis and 40.1 near it.
 * - Photos (Wikimedia Commons), EVIDENCE:
 *   "San Antonio May 2018 3 (St. Joseph Catholic Church).jpg" (Michael
 *     Barera, CC BY-SA 4.0): the south front face on, scaled from the front's
 *     17 m width at the ground and the lidar heights above: the door to 5.6,
 *     the round window 8, the side lancets 2.6-9.0, the tower's lancets
 *     12.8-15.4, the louvred belfry pair 17.4-21.2, the trefoil 22.6, the
 *     cornice 25.5; the spire's profile (a flared base with gabled dormers, a
 *     band, a narrower stage, the needle) and the corner pinnacles;
 *   "Gfp-texas-san-antonio-tower-to-st-joseph-church.jpg" (Yinan Chen,
 *     public domain): the tower's upper stages and corner turrets close up.
 *
 * Estimated: the spire's tip at 44 m and the cross to 46 (the lidar misses
 * the needle; extrapolated from its flank slope and the photo's profile;
 * no published height found); the north end and sacristy rooms, drawn plain.
 * Bolder than real: the spire's bands and dormers, the corner pinnacles.
 *
 * Night: the front and tower floodlit.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { prism, lathe, report, writeGlb, type XY } from './sf-de-young'
import { shift } from './sf-opera-house'
import { onWall, rectPts, circlePts, lancetPts, block, pyramid, cross3, pitchedX } from './sat-san-fernando-cathedral'

const stone = new Part(), trim = new Part(), roof = new Part(), slate = new Part(), win = new Part(), wood = new Part()
const S: XY = [0, -1]
const sS = (x: number) => x
const X0 = -6.0, X1 = 10.6, XC = 2.3, YF = -25.0, YN = 5.4, EAVE = 11.2, RIDGE = 15.4

// the nave: one pitched roof over the whole width (a hall church), along y.


block(stone, X0, X1, YF, YN, 0, EAVE, 0, null)
roof.quad([X0 - 0.3, YF, EAVE - 0.1], [XC, YF, RIDGE], [XC, YN, RIDGE], [X0 - 0.3, YN, EAVE - 0.1])
roof.quad([XC, YF, RIDGE], [X1 + 0.3, YF, EAVE - 0.1], [X1 + 0.3, YN, EAVE - 0.1], [XC, YN, RIDGE])
// the front gable wall, standing a little above the roof line
onWall(stone, [0, YF], S, [[sS(X0), EAVE], [sS(X1), EAVE], [sS(XC), RIDGE + 0.4]], 0)
// corner buttresses with pinnacle caps, and buttresses along the sides
for (const x of [X0 - 0.5, X1 + 0.5]) {
  block(stone, x - 0.6, x + 0.6, YF - 0.5, YF + 1.0, 0, 11.6, 0.1)
  pyramid(trim, x - 0.6, x + 0.6, YF - 0.5, YF + 1.0, 11.6, 13.0)
}
for (let k = 1; k < 6; k++) {
  const y = YF + k * 5.0
  block(stone, X0 - 0.6, X0, y - 0.4, y + 0.4, 0, 9.0, 0.1)
  block(stone, X1, X1 + 0.6, y - 0.4, y + 0.4, 0, 9.0, 0.1)
  for (const [xw, n] of [[X0, [-1, 0]], [X1, [1, 0]]] as [number, XY][]) {
    const s = n[0] < 0 ? -(y + 2.5) : y + 2.5
    onWall(win, [xw, 0], n, lancetPts(s, 1.2, 3.2, 9.0), 0.06)
  }
}
// the front's side lancets
for (const x of [-2.6, 7.6]) {
  onWall(trim, [0, YF], S, lancetPts(sS(x), 1.5, 2.4, 9.3), 0.03)
  onWall(win, [0, YF], S, lancetPts(sS(x), 1.0, 2.6, 9.0), 0.06)
}

// the apse to the north, and the low sacristy rooms
prism(stone, [[-1.7, YN], [8.0, YN], [8.0, 10.5], [6.0, 13.0], [0.4, 13.0], [-1.7, 10.6]], 0, 11.0, roof, 0.15)
block(stone, X0 - 6.5, X0, 0.6, 6.3, 0, 4.2, 0.1, roof)
block(stone, -10.9, -1.7, 6.3, 11.6, 0, 7.4, 0.1, roof)

// the tower
{
  const tx0 = XC - 2.5 + 1.0, tx1 = XC + 2.5 + 1.0, ty0 = YF - 0.8, ty1 = YF + 4.6, cx = (tx0 + tx1) / 2, cy = (ty0 + ty1) / 2
  block(stone, tx0, tx1, ty0, ty1, 0, 11.6, 0, null)
  block(trim, tx0 - 0.15, tx1 + 0.15, ty0 - 0.15, ty1 + 0.15, 11.4, 11.8, 0.08, null)
  block(stone, tx0 + 0.1, tx1 - 0.1, ty0 + 0.1, ty1 - 0.1, 11.8, 16.6, 0, null)
  block(trim, tx0 - 0.05, tx1 + 0.05, ty0 - 0.05, ty1 + 0.05, 16.4, 16.8, 0.06, null)
  block(stone, tx0 + 0.2, tx1 - 0.2, ty0 + 0.2, ty1 - 0.2, 16.8, 25.0, 0, null)
  block(trim, tx0 - 0.15, tx1 + 0.15, ty0 - 0.15, ty1 + 0.15, 25.0, 25.5, 0.1)
  // the front's openings
  const f: XY = [0, ty0]
  onWall(trim, f, S, lancetPts(sS(cx), 2.4, 0, 5.8), 0.08)
  onWall(wood, f, S, lancetPts(sS(cx), 1.7, 0, 5.2), 0.1)
  onWall(trim, f, S, circlePts(sS(cx), 8.0, 0.75, 14), 0.06)
  onWall(win, f, S, circlePts(sS(cx), 8.0, 0.5, 14), 0.08)
  // the upper stages on all four faces (the back ones above the roof)
  const faces: [XY, XY, number][] = [[[0, ty0 + 0.2], S, cx], [[tx1 - 0.2, 0], [1, 0], cy], [[tx0 + 0.2, 0], [-1, 0], -cy], [[0, ty1 - 0.2], [0, 1], -cx]]
  for (const [at, n, s] of faces) {
    const at1: XY = [at[0] + n[0] * 0.1, at[1] + n[1] * 0.1]
    for (const d of [-0.75, 0.75]) {
      onWall(win, at1, n, lancetPts(s + d, 0.6, 12.8, 15.4), 0.06)
      onWall(trim, at, n, lancetPts(s + d, 1.15, 17.2, 21.4), 0.03)
      onWall(win, at, n, lancetPts(s + d, 0.85, 17.4, 21.2), 0.06)
    }
    onWall(trim, at, n, circlePts(s, 22.8, 0.75, 12), 0.03)
    onWall(win, at, n, circlePts(s, 22.8, 0.45, 12), 0.06)
    onWall(trim, at, n, [[s - 1.6, 23.6], [s + 1.6, 23.6], [s, 25.0]], 0.05)
  }
  // corner pinnacles
  for (const [px, py] of [[tx0, ty0], [tx1, ty0], [tx1, ty1], [tx0, ty1]]) {
    block(trim, px - 0.3, px + 0.3, py - 0.3, py + 0.3, 25.5, 26.4, 0.05)
    pyramid(slate, px - 0.3, px + 0.3, py - 0.3, py + 0.3, 26.4, 28.2)
  }
  // the spire: octagonal, flared at the base, a band, a narrower stage, the needle
  const prof: [number, number][] = [[2.65, 25.5], [2.5, 26.4], [2.25, 28.6], [2.0, 30.6], [2.12, 30.8], [2.12, 31.1], [1.65, 31.3], [1.3, 34.4], [1.45, 34.6], [1.45, 34.9], [1.05, 35.1], [0.4, 40.8], [0.0, 44.0]]
  lathe(slate, prof, 8, [cx, cy], Math.PI / 8, false)
  // gabled dormers on the spire's base, on the four faces
  for (let k = 0; k < 4; k++) {
    const a = (Math.PI / 2) * k - Math.PI / 2, n: XY = [Math.cos(a), Math.sin(a)], t: XY = [-n[1], n[0]]
    const P = (sv: number, z: number, o: number): V3 => [cx + n[0] * o + t[0] * sv, cy + n[1] * o + t[1] * sv, z]
    const o1 = 2.4, o0 = 1.2
    slate.quad(P(-0.55, 26.6, o1), P(0.55, 26.6, o1), P(0.55, 28.0, o1), P(-0.55, 28.0, o1))
    slate.tri(P(-0.55, 28.0, o1), P(0.55, 28.0, o1), P(0, 28.9, o1))
    slate.quad(P(-0.55, 28.0, o0), P(-0.55, 28.0, o1), P(0, 28.9, o1), P(0, 28.9, o0))
    slate.quad(P(0, 28.9, o0), P(0, 28.9, o1), P(0.55, 28.0, o1), P(0.55, 28.0, o0))
    win.quad(P(-0.3, 26.8, o1 + 0.04), P(0.3, 26.8, o1 + 0.04), P(0.3, 27.9, o1 + 0.04), P(-0.3, 27.9, o1 + 0.04))
  }
  cross3(metal(), cx, cy, 43.8, 2.2, 0.16)
}
function metal() { return slate }
void pitchedX; void rectPts

// ---------------------------------------------------------------------------
const all = [stone, trim, roof, slate, win, wood]
shift(all, -1.36, 5.90)
const lit = (p: V3, n: V3) => (n[2] > 0.7 ? 0.1 : n[1] < -0.5 && p[1] < -18 ? 0.85 : p[2] > 11 ? 0.6 : 0.2)
const parts = [
  { part: stone, material: { ...finish('stjoseph-limestone', 0xddd2b8), floodlight: lit } },
  { part: trim, material: { ...finish('stjoseph-dressed-stone', 0xeae1cc), floodlight: lit } },
  { part: roof, material: { ...PALETTE.roof, color: 0xa1a5a6 } },
  { part: slate, material: finish('stjoseph-slate', 0x6d6e72) },
  { part: win, material: PALETTE.window },
  { part: wood, material: finish('stjoseph-door', 0x4f4440) },
]
const glb = writeGlb('St. Joseph Catholic Church', parts, {
  license: 'CC0-1.0', bearing: 11.2, elevation: 0, anchor: [29.423725, -98.486418],
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['way/78604538'],
})
console.log(parts.map((p) => `${p.material.name}:${p.part.triangles}`).join(' '))
const tris = report('St. Joseph Catholic Church', parts, glb, 5000)
const out = new URL('../models/sat-st-joseph-church.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${tris} triangles, ${glb.length} bytes`)
