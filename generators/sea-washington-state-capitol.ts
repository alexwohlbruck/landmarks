/**
 * Washington State Capitol, the Legislative Building (1928, Wilder & White),
 * Olympia: procedural, CC0-1.0.
 * bun generators/sea-washington-state-capitol.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres; bearing 0 (the OSM walls run
 * exactly north-south and east-west). The origin is the area centroid of
 * OSM way/31494476 (-122.9048534, 47.0357611), which is also the dome's
 * axis; y = 0 is the drive at the foot of the north steps.
 *
 * Olympia lies outside both public lidar surveys used for the Seattle batch
 * (King and Pierce counties), so nothing here is measured from lidar: the
 * plan is OSM's, the heights are the published 87 m to the lantern's tip
 * and the 42 north steps, and everything else is scaled from photos.
 *
 * Form: a long sandstone block on a rusticated base storey, wrapped in a
 * giant Doric colonnade (second and third floors) under a cornice that
 * runs round the whole building; a central pavilion with a Corinthian
 * portico and pediment on the north (over the 42 steps) and the south (over
 * the vehicle ramp, deeper); over the centre a square attic block with a
 * sculpted pedestal at each corner, then the dome: a plain lower drum, a
 * peristyle of 32 Corinthian columns in pairs, a heavy cornice, a stepped
 * attic, the ribbed masonry dome and a columned lantern with a spire.
 *
 * Sources
 * - OSM: way/31494476 (outline, 6 levels, Q2620186): wings x ±52.6,
 *   y ±27.5; central pavilion x ±18.7, y ±29.5; north portico to y 34;
 *   way/612617948 (roof, x ±13, y -41..-33): the south portico's
 *   porte-cochère.
 * - Published: dome 287 ft (87 m) on the exterior, the tallest
 *   self-supporting masonry dome in North America; 42 granite steps to the
 *   north entrance; north and south porticoes of eight Corinthian columns;
 *   Doric colonnade on the second and third floors; four small sandstone
 *   domes round the dome; Wilkeson sandstone (Wikipedia, "Washington State
 *   Capitol").
 * - Photos (Wikimedia Commons; credits in
 *   /tmp/city/sea/work/sea-washington-state-capitol/credits.txt). Joe
 *   Mabel's frontal panorama of the north front gives the elevation, scaled
 *   to the 87 m total and the 6.3 m of steps: base storey 6.3, colonnade to
 *   21.3, cornice 24.9, portico columns to 22.4, pediment 30.5, attic block
 *   34.5, lower drum to 46.4, peristyle to 56.7, cornice 58.8, attic 63.5,
 *   dome to its crown ring at 74, lantern to 82.4, spire 87. Widths from the
 *   same photo: drum radius 14.8, dome radius 11.6, lantern radius 3.
 *   OceanLoop's 2025 close view of the dome gives its profile (very nearly a
 *   hemisphere: rise 0.95 of the radius to the crown ring), 24 ribs, the
 *   paired columns (16 pairs) and the stepped attic.
 * Estimated: every height and width above (photo scaling, perhaps ±1.5 m),
 *   the wing colonnades' spacing (2.8 m), the south porte-cochère's columns,
 *   the wing roofs' low hipped skylight blocks (from a 1938 aerial).
 * Left out: the base storey's small windows (a dot row at map scale), the
 *   pediment sculpture, capitals, the corner pedestals'
 *   carving (drawn as small domes), balustrades, lamps. The north steps are one smooth flight
 *   (16 m deep, 42 m wide between cheek walls, estimated from the panorama).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, type Face, prism, rect, chamfer, flatShape, capRing, lathe, disc, arc, finishGlb, writeModel } from './sea-tacoma-union-station'

const BASE = 6.3, COL = 21.3, CORN = 24.9
const WX = 52.6, WY = 27.5, PX = 18.7, PY = 29.5

function build() {
  const stone = new Part(), trim = new Part(), dome = new Part(), roof = new Part(), win = new Part()
  const W = (f: Face, poly: XY[]) => flatShape(win, f, poly, 0.06)
  const column = (part: Part, x: number, y: number, r: number, z0: number, z1: number, segs = 8) => {
    lathe(part, x, y, [[r, z0], [r * 0.9, z1]], segs) // a plain tapering shaft: capitals are too fine to read
  }

  // ------------------------------------------------------------ wings
  // base storey on the full plan; the colonnade storeys' wall set back
  // behind a ring of columns; the cornice back out to the full plan.
  const REC = 2.2
  for (const sx of [-1, 1]) {
    const x0 = sx < 0 ? -WX : PX, x1 = sx < 0 ? -PX : WX
    const full = rect(x0, -WY, x1, WY)
    prism(stone, null, full, 0, BASE)
    prism(trim, null, chamfer(rect(x0 - 0.15, -WY - 0.15, x1 + 0.15, WY + 0.15), 0.2), BASE - 0.6, BASE)
    // the recessed wall, with solid corner piers at the outer end
    const ox0 = sx < 0 ? x0 + REC : x0, ox1 = sx < 0 ? x1 : x1 - REC
    prism(stone, null, rect(ox0, -WY + REC, ox1, WY - REC), BASE, COL)
    const pierX = sx < 0 ? [x0, x0 + 3.2] : [x1 - 3.2, x1]
    for (const sy of [-1, 1]) prism(stone, null, rect(pierX[0], sy < 0 ? -WY : WY - 3.2, pierX[1], sy < 0 ? -WY + 3.2 : WY), BASE, COL)
    // entablature and cornice, the flat roof, a low hipped skylight block
    prism(stone, null, full, COL, CORN - 1.0)
    prism(trim, roof, chamfer(rect(x0 - 0.5, -WY - 0.5, x1 + 0.5, WY + 0.5), 0.4), CORN - 1.0, CORN)
    const hx0 = x0 + 6, hx1 = x1 - 6
    roof.quad([hx0, -16, CORN], [hx1, -16, CORN], [hx1 - 4, -4, CORN + 3.0], [hx0 + 4, -4, CORN + 3.0])
    roof.quad([hx1, 16, CORN], [hx0, 16, CORN], [hx0 + 4, 4, CORN + 3.0], [hx1 - 4, 4, CORN + 3.0])
    roof.quad([hx0 + 4, -4, CORN + 3.0], [hx1 - 4, -4, CORN + 3.0], [hx1 - 4, 4, CORN + 3.0], [hx0 + 4, 4, CORN + 3.0])
    roof.quad([hx1, -16, CORN], [hx1, 16, CORN], [hx1 - 4, 4, CORN + 3.0], [hx1 - 4, -4, CORN + 3.0])
    roof.quad([hx0, 16, CORN], [hx0, -16, CORN], [hx0 + 4, -4, CORN + 3.0], [hx0 + 4, 4, CORN + 3.0])
    // the colonnade: long faces (north, south) and the end face
    const step = 2.8
    const colX0 = sx < 0 ? x0 + 4.6 : x0 + 1.4, colX1 = sx < 0 ? x1 - 1.4 : x1 - 4.6
    const nLong = Math.round((colX1 - colX0) / step)
    for (let k = 0; k <= nLong; k++) {
      const x = colX0 + ((colX1 - colX0) * k) / nLong
      for (const sy of [-1, 1]) {
        column(trim, x, sy * (WY - 0.9), 0.62, BASE, COL, 6)
        // the window between this column and the next, on the recessed wall
        if (k < nLong) {
          const xm = x + (colX1 - colX0) / nLong / 2
          const f: Face = { o: [xm, sy * (WY - REC), 0], n: [0, sy] }
          W(f, [[-0.95, BASE + 1.0], [0.95, BASE + 1.0], [0.95, COL - 1.0], [-0.95, COL - 1.0]])
        }
      }
    }
    const ex = sx < 0 ? x0 : x1, endY = WY - 4.6, nEnd = Math.round((2 * endY) / step)
    for (let k = 0; k <= nEnd; k++) {
      const y = -endY + (2 * endY * k) / nEnd
      column(trim, ex - sx * 0.9, y, 0.62, BASE, COL, 6)
      if (k < nEnd) {
        const ym = y + endY / nEnd
        W({ o: [ex - sx * REC, ym, 0], n: [sx, 0] }, [[-0.95, BASE + 1.0], [0.95, BASE + 1.0], [0.95, COL - 1.0], [-0.95, COL - 1.0]])
      }
    }
  }

  // ------------------------------------------------------------ central pavilion and porticoes
  prism(stone, null, rect(-PX, -PY, PX, PY), 0, CORN - 1.0)
  prism(trim, roof, chamfer(rect(-PX - 0.5, -PY - 0.5, PX + 0.5, PY + 0.5), 0.4), CORN - 1.0, CORN)
  // windows in the pavilion's flanks beside the porticoes, a tall panel each
  for (const sy of [-1, 1]) for (const sx of [-1, 1]) {
    W({ o: [sx * 16.0, sy * PY, 0], n: [0, sy] }, [[-0.8, BASE + 1.2], [0.8, BASE + 1.2], [0.8, COL - 1.2], [-0.8, COL - 1.2]])
  }
  const portico = (sy: number, depth: number) => {
    const yWall = sy * PY, yFront = sy * (PY + depth)
    const PH = 22.4, ENT = 25.3, APEX = 30.5, HW = 13.4
    // floor (the top of the steps or the ramp's roof) and the entablature
    prism(stone, null, rect(-HW, Math.min(yWall, yFront), HW, Math.max(yWall, yFront)), 0, BASE + 0.5)
    prism(trim, null, rect(-HW, Math.min(yWall, yFront), HW, Math.max(yWall, yFront)), PH, ENT)
    // the pediment: a gable over the portico, ridge running back to the attic block
    const y0 = yWall - sy * 4, y1 = yFront
    const A: V3 = [-HW, y1, ENT], B: V3 = [HW, y1, ENT], C: V3 = [0, y1, APEX]
    if (sy > 0) trim.tri(B, A, C); else trim.tri(A, B, C)
    const A0: V3 = [-HW, y0, ENT], B0: V3 = [HW, y0, ENT], C0: V3 = [0, y0, APEX]
    if (sy > 0) { roof.quad(A, A0, C0, C); roof.quad(B0, B, C, C0); trim.tri(A0, B0, C0) } else { roof.quad(A0, A, C, C0); roof.quad(B, B0, C0, C); trim.tri(B0, A0, C0) }
    // the columns: eight across the front, and the return at each side
    for (let k = 0; k < 8; k++) column(trim, -12.25 + 3.5 * k, yFront - sy * 1.0, 0.82, BASE + 0.5, PH, 10)
    const nRet = Math.max(1, Math.round((depth - 2) / 3.5))
    for (let k = 1; k <= nRet; k++) for (const sx of [-1, 1]) column(trim, sx * 12.25, yFront - sy * (1.0 + (k * (depth - 1.5)) / (nRet + 1)), 0.82, BASE + 0.5, PH, 10)
    // the doors and windows behind
    const f: Face = { o: [0, yWall, 0], n: [0, sy] }
    for (const s of [-5.25, -1.75, 1.75, 5.25]) W(f, [[s - 0.9, BASE + 0.6], [s + 0.9, BASE + 0.6], [s + 0.9, BASE + 6.0], [s - 0.9, BASE + 6.0]])
    for (const s of [-5.25, -1.75, 1.75, 5.25]) W(f, [[s - 0.8, BASE + 8.0], [s + 0.8, BASE + 8.0], [s + 0.8, PH - 1.5], [s - 0.8, PH - 1.5]])
  }
  portico(1, 4.5)
  // The 42 granite steps up to the north portico, drawn as one smooth flight
  // between cheek walls (their 15 cm risers are far too fine to read).
  {
    const yT = PY + 4.5, yB = yT + 16, HWS = 21, zT = BASE + 0.5
    trim.quad([-HWS + 1.2, yB, 0], [-HWS + 1.2, yT, zT], [HWS - 1.2, yT, zT], [HWS - 1.2, yB, 0])
    for (const sx of [-1, 1]) {
      const xo = sx * HWS, xi = sx * (HWS - 1.2), top = zT + 0.9
      const o = (x: number, y: number, z: number): V3 => [x, y, z]
      const outer = sx > 0 ? [o(xo, yB, 0), o(xo, yT, 0), o(xo, yT, top), o(xo, yB, 1.0)] : [o(xo, yT, 0), o(xo, yB, 0), o(xo, yB, 1.0), o(xo, yT, top)]
      const both = (q: V3[]) => { stone.quad(q[0], q[1], q[2], q[3]); stone.quad(q[3], q[2], q[1], q[0]) }
      both(outer)
      const inner = sx > 0 ? [o(xi, yT, 0), o(xi, yB, 0), o(xi, yB, 1.0), o(xi, yT, top)] : [o(xi, yB, 0), o(xi, yT, 0), o(xi, yT, top), o(xi, yB, 1.0)]
      both(inner)
      both([o(Math.min(xo, xi), yB, 1.0), o(Math.max(xo, xi), yB, 1.0), o(Math.max(xo, xi), yT, top), o(Math.min(xo, xi), yT, top)])
      both([o(Math.min(xo, xi), yB, 0), o(Math.max(xo, xi), yB, 0), o(Math.max(xo, xi), yB, 1.0), o(Math.min(xo, xi), yB, 1.0)])
    }
  }
  portico(-1, 11.4)

  // ------------------------------------------------------------ the attic block and its corner pedestals
  const AB = 17.5, ATOP = 34.5
  prism(stone, null, rect(-AB, -AB, AB, AB), CORN, ATOP - 1.0)
  prism(trim, roof, chamfer(rect(-AB - 0.4, -AB - 0.4, AB + 0.4, AB + 0.4), 0.4), ATOP - 1.0, ATOP)
  for (const [dx, dy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
    const cx = dx * (AB - 2.6), cy = dy * (AB - 2.6)
    prism(stone, trim, chamfer(rect(cx - 2.3, cy - 2.3, cx + 2.3, cy + 2.3), 0.3), ATOP, ATOP + 3.6)
    lathe(trim, cx, cy, [[2.0, ATOP + 3.6], [1.9, ATOP + 4.6], [1.4, ATOP + 5.8], [0.7, ATOP + 6.6], [0.01, ATOP + 6.9]], 12)
  }

  // ------------------------------------------------------------ the drum
  const DR = 14.8, WALL = 12.6
  lathe(stone, 0, 0, [[DR, ATOP - 0.5], [DR, 45.6]], 32)
  lathe(trim, 0, 0, [[DR, 45.6], [DR + 0.3, 45.8], [DR + 0.3, 46.4], [WALL, 46.4]], 32)
  // the peristyle's wall, with a tall window in each bay
  lathe(stone, 0, 0, [[WALL, 46.4], [WALL, 56.7]], 32)
  const PAIRS = 16
  for (let p = 0; p < PAIRS; p++) {
    const a = ((p + 0.5) / PAIRS) * 2 * Math.PI
    for (const d of [-0.08, 0.08]) column(trim, Math.cos(a + d) * 14.0, Math.sin(a + d) * 14.0, 0.5, 46.4, 56.7, 8)
    const aw = (p / PAIRS) * 2 * Math.PI // between the pairs
    W({ o: [Math.cos(aw) * WALL, Math.sin(aw) * WALL, 0], n: [Math.cos(aw), Math.sin(aw)] }, [[-0.6, 48.0], [0.6, 48.0], [0.6, 55.0], [-0.6, 55.0]])
  }
  // the cornice ring over the columns, then the stepped attic
  lathe(trim, 0, 0, [[WALL, 56.7], [DR + 0.2, 56.7], [DR + 0.2, 58.0], [DR + 0.7, 58.8], [13.8, 58.8], [13.8, 60.6], [13.2, 61.0], [12.6, 61.0], [12.6, 63.0], [12.0, 63.5]], 32)

  // ------------------------------------------------------------ the dome, ribs and lantern
  const R = 11.6, H = 11.0, Z0 = 63.5, RING = 3.8
  const tEnd = Math.acos(RING / R)
  const prof: [number, number][] = [[12.0, Z0], [R, Z0]]
  for (let k = 1; k <= 10; k++) {
    const t = (tEnd * k) / 10
    prof.push([R * Math.cos(t), Z0 + H * Math.sin(t)])
  }
  const zRing = Z0 + H * Math.sin(tEnd)
  lathe(dome, 0, 0, prof, 32)
  // 24 ribs: raised bands following the profile
  const RIBS = 24, RW = 0.32, RD = 0.25
  for (let k = 0; k < RIBS; k++) {
    const a = (k / RIBS) * 2 * Math.PI, c = Math.cos(a), s = Math.sin(a)
    const tx = -s, ty = c
    for (let i = 1; i + 2 < prof.length; i += 2) {
      const [r0, z0] = prof[i], [r1, z1] = prof[i + 2]
      const P = (r: number, z: number, w: number, d: number): V3 => [c * (r + d) + tx * w, s * (r + d) + ty * w, z]
      // normal offset approximated radially; the top face plus two sides
      dome.quad(P(r0, z0, -RW, RD), P(r0, z0, RW, RD), P(r1, z1, RW, RD), P(r1, z1, -RW, RD))
      dome.quad(P(r0, z0, RW, 0), P(r1, z1, RW, 0), P(r1, z1, RW, RD), P(r0, z0, RW, RD))
      dome.quad(P(r1, z1, -RW, 0), P(r0, z0, -RW, 0), P(r0, z0, -RW, RD), P(r1, z1, -RW, RD))
    }
  }
  // lantern: a base ring, a ring of columns round a core, a cap and the spire
  lathe(trim, 0, 0, [[RING + 0.4, zRing - 0.3], [RING + 0.4, zRing + 1.6], [3.2, zRing + 1.6]], 20)
  lathe(stone, 0, 0, [[2.1, zRing + 1.6], [2.1, 80.0]], 12)
  for (let k = 0; k < 8; k++) {
    const a = ((k + 0.5) / 8) * 2 * Math.PI
    column(trim, Math.cos(a) * 2.8, Math.sin(a) * 2.8, 0.28, zRing + 1.6, 80.0, 6)
  }
  lathe(trim, 0, 0, [[0.5, 80.0], [3.4, 80.0], [3.4, 80.7], [2.8, 80.9], [2.2, 81.8], [1.3, 82.4], [0.7, 83.2], [0.25, 86.0], [0.01, 87.0]], 12)

  return finishGlb('Washington State Capitol', [
    { part: stone, material: finish('wsc-sandstone', 0xe4ddd0) },
    { part: trim, material: PALETTE.trim },
    { part: dome, material: finish('wsc-dome', 0xd9cfbd) },
    { part: roof, material: PALETTE.roof },
    { part: win, material: PALETTE.window },
  ], { bearing: 0, height: 87.0, replaces: ['way/31494476', 'way/612617948'] }, 6500)
}

if (import.meta.main) await writeModel('sea-washington-state-capitol', build())
