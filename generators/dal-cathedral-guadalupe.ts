/**
 * Cathedral Shrine of the Virgin of Guadalupe (Cathedral Santuario de
 * Guadalupe), 2215 Ross Avenue, Dallas, 1898-1902, Nicholas J. Clayton;
 * bell tower and spire completed 2005 to Clayton's design — original
 * procedural geometry, CC0-1.0.
 * bun generators/dal-cathedral-guadalupe.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = centroid of the OSM outline way/31265522
 * (building=cathedral), 32.7888705, -96.797973. Its walls run at 46° /
 * 136°; the catalog bearing is 136, so +y faces the Ross Avenue front
 * (south-east) and +x the Pearl Street side (south-west).
 *
 * Identity, in order: the tall red-brick bell tower on the front's
 * south-west corner — buttressed lower stage, slimmer shaft with paired
 * lancets and a twin-opening belfry, a crown of four stone gables and
 * pinnacles, and the dark slate spire; the red-brick Gothic Revival
 * church with pale stone trim: the nave front's gable with its rose
 * window and stone portal, the north-east corner block with its slate
 * turret, the clerestoried nave over lean-to aisles, the transept with
 * rose windows in its gables, the apse; red tile roofs.
 *
 * Evidence:
 *  - plan: OSM outline (one way covering the church and the parish halls
 *    behind and beside it, all drawn here). The church's own walls, the
 *    tower and the transept are placed from the lidar, which agrees with
 *    OSM on both aisle walls (x -0.5 and ~26.9) but puts the tower ~3 m
 *    further north-east and the front 1.5 m further out than OSM.
 *  - heights: USGS 3DEP lidar TX_Pecos_Dallas_B3_2018 (2018 flight), 0.5 m
 *    grid, above the model's base (ground_min + 0.5, the lowest ground under
 *    the halls at the back; Ross Avenue at the front is 2.8 m higher):
 *    nave ridge 28.6, nave eaves ~21, transept ridge 28.4, aisle roofs
 *    11.8-14.5, apse ~23.5, north-east turret tip 32.8, spire tip 54.2
 *    (51.4 above Ross Avenue), halls 10.3-11.9 and a low wing 4.6.
 *    Measured. The tower (2005) is in the 2018 flight.
 *  - tower stages (lower stage to 23, i.e. 20.3 above the street; shaft
 *    with paired lancets to 34.9; belfry to 44.5; crown band and stone
 *    gables to 49, pinnacles ~50; slate spire from 45.3 to 54.2): scaled
 *    from Joe Mabel's front view at the front gable's scale (28.9 px/m),
 *    which lands within 0.5 m of the lidar tip. Estimated.
 *  - front: rose window (r 2.6 m, centre 16.9 m above the street), stone
 *    portal and lancet arcade scaled from Mabel's front view; side
 *    windows by bay from Barera's side view. Estimated.
 *  - colour: red brick (#9a4434-#a24a3a in the photos) pulled toward palette
 *    lightness as #8c4239, a deep oxblood (kept dark: it is the identity); red clay
 *    tile roofs #c06a50; dark slate spires
 *    #6a7078; pale stone trim `trim`; stained glass `window`; the halls'
 *    flat roofs `roof`.
 *  - night: windows glow; the tower is floodlit (_FLOODLIGHT on its brick).
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Dallas July 2015 15 (Cathedral Santuario de Guadalupe).jpg, Michael
 *    Barera, CC BY-SA 4.0 (south-west side and tower)
 *  - Dallas July 2015 19 (Cathedral Santuario de Guadalupe).jpg, Michael
 *    Barera, CC BY-SA 4.0 (front)
 *  - Cathedral Santuario de Guadalupe 01.jpg and 02.jpg, Joe Mabel,
 *    CC BY-SA 3.0 (front from Ross Avenue; front and south side)
 *  - Cathedral Shrine of the Virgin of Guadalupe 01.jpg, 02.jpg,
 *    Farragutful, CC BY-SA 4.0 (tower)
 *  - The Catholic Cathedral of Santuario de Guadalupe ... 10-26-10.jpg,
 *    Cordphaeton, CC BY-SA 3.0 (from the east)
 * Published: Wikipedia (Clayton; tower built in a later phase to his
 * design; 49-bell carillon). No look-only sources. No commercial imagery.
 *
 * Terrain: the site falls ~3 m from Ross Avenue to the halls at the back;
 * base on the lowest ground, the front sinks into the slope, elevation 0.
 * `bun tools/terrain.ts check` prints ok.
 *
 * Doubts: the north-east and rear sides are not photographed close up and
 * are drawn plain; the halls are simple blocks at their lidar heights;
 * window counts per bay are estimated; tracery, crockets, statues and the
 * crosses are left out (the spire's cross too thin to read).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { block, rect, save, type XY } from './chi-merchandise-mart'

const ANCHOR: [number, number] = [32.7888705, -96.797973]
const BEARING = 136
const STREET = 2.8 // Ross Avenue above the base

/** A convex planar polygon, wound so its normal agrees with `hint`. */
function face(p: Part, pts: V3[], hint: V3) {
  const n: V3 = [0, 0, 0]
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i], b = pts[(i + 1) % pts.length]
    n[0] += (a[1] - b[1]) * (a[2] + b[2]); n[1] += (a[2] - b[2]) * (a[0] + b[0]); n[2] += (a[0] - b[0]) * (a[1] + b[1])
  }
  const q = n[0] * hint[0] + n[1] * hint[1] + n[2] * hint[2] < 0 ? [...pts].reverse() : pts
  for (let i = 1; i < q.length - 1; i++) p.tri(q[0], q[i], q[i + 1])
}

type Side = '+x' | '-x' | '+y' | '-y'
/** Map (u along the wall, z) on a wall plane to 3D, `off` out from it. */
const onFace = (side: Side, c: number, off: number) => (u: number, z: number): V3 =>
  side === '+y' ? [u, c + off, z] : side === '-y' ? [u, c - off, z] : side === '+x' ? [c + off, u, z] : [c - off, u, z]
const nrm = (side: Side): V3 => (side === '+y' ? [0, 1, 0] : side === '-y' ? [0, -1, 0] : side === '+x' ? [1, 0, 0] : [-1, 0, 0])

/** A pointed (equilateral) lancet panel, u0..u1, from z0, springing at zs. */
function lancet(p: Part, side: Side, c: number, u0: number, u1: number, z0: number, zs: number, off = 0.06) {
  const P = onFace(side, c, off), w = u1 - u0, ring: V3[] = [P(u0, z0), P(u1, z0)]
  // right flank: an arc about u0 from (u1, zs) up to the apex
  for (let k = 0; k < 4; k++) { const t = (k / 4) * (Math.PI / 3); ring.push(P(u0 + w * Math.cos(t), zs + w * Math.sin(t))) }
  ring.push(P(u0 + w / 2, zs + w * Math.sin(Math.PI / 3)))
  // left flank: an arc about u1 from the apex back down to (u0, zs)
  for (let k = 3; k >= 0; k--) { const t = (k / 4) * (Math.PI / 3); ring.push(P(u1 - w * Math.cos(t), zs + w * Math.sin(t))) }
  face(p, ring, nrm(side))
}
function disc(p: Part, side: Side, c: number, u: number, z: number, r: number, off = 0.06, n = 16) {
  const P = onFace(side, c, off)
  face(p, Array.from({ length: n }, (_, k) => P(u + r * Math.cos((2 * Math.PI * k) / n), z + r * Math.sin((2 * Math.PI * k) / n))), nrm(side))
}
function quadOn(p: Part, side: Side, c: number, u0: number, u1: number, z0: number, z1: number, off = 0.06) {
  const P = onFace(side, c, off)
  face(p, [P(u0, z0), P(u1, z0), P(u1, z1), P(u0, z1)], nrm(side))
}
/** A triangle (gable) on a wall plane. */
function triOn(p: Part, side: Side, c: number, u0: number, u1: number, z0: number, z1: number, off = 0.06) {
  const P = onFace(side, c, off)
  face(p, [P(u0, z0), P(u1, z0), P((u0 + u1) / 2, z1)], nrm(side))
}

/** A pyramid over a regular n-gon (flat faces). */
function pyramid(p: Part, cx: number, cy: number, r: number, n: number, z0: number, z1: number, a0 = Math.PI / n) {
  for (let k = 0; k < n; k++) {
    const a = a0 + (2 * Math.PI * k) / n, b = a0 + (2 * Math.PI * (k + 1)) / n
    const A: V3 = [cx + r * Math.cos(a), cy + r * Math.sin(a), z0], B: V3 = [cx + r * Math.cos(b), cy + r * Math.sin(b), z0]
    const m = (a + b) / 2
    face(p, [A, B, [cx, cy, z1]], [Math.cos(m), Math.sin(m), 0.4])
  }
}

/** Walls to `eave` with a gable roof; ridge along y (alongY) or x. Gable ends in the wall part. */
function gabled(wall: Part, roof: Part, x0: number, y0: number, x1: number, y1: number, eave: number, ridge: number, alongY: boolean, ends = [true, true], over = 0.35) {
  block(wall, null, rect(x0, y0, x1, y1), 0, eave, 0)
  if (alongY) {
    const xm = (x0 + x1) / 2, k = (ridge - eave) / (xm - x0), ze = eave - over * k
    face(roof, [[x0 - over, y0 - over, ze], [xm, y0 - over, ridge], [xm, y1 + over, ridge], [x0 - over, y1 + over, ze]], [-1, 0, 1])
    face(roof, [[x1 + over, y0 - over, ze], [xm, y0 - over, ridge], [xm, y1 + over, ridge], [x1 + over, y1 + over, ze]], [1, 0, 1])
    if (ends[0]) face(wall, [[x0, y0, eave], [x1, y0, eave], [xm, y0, ridge]], [0, -1, 0])
    if (ends[1]) face(wall, [[x0, y1, eave], [x1, y1, eave], [xm, y1, ridge]], [0, 1, 0])
    // undersides of the eaves
    face(roof, [[x0 - over, y0 - over, ze], [x0, y0 - over, eave], [x0, y1 + over, eave], [x0 - over, y1 + over, ze]], [0, 0, -1])
    face(roof, [[x1 + over, y0 - over, ze], [x1, y0 - over, eave], [x1, y1 + over, eave], [x1 + over, y1 + over, ze]], [0, 0, -1])
  } else {
    const ym = (y0 + y1) / 2, k = (ridge - eave) / (ym - y0), ze = eave - over * k
    face(roof, [[x0 - over, y0 - over, ze], [x0 - over, ym, ridge], [x1 + over, ym, ridge], [x1 + over, y0 - over, ze]], [0, -1, 1])
    face(roof, [[x0 - over, y1 + over, ze], [x0 - over, ym, ridge], [x1 + over, ym, ridge], [x1 + over, y1 + over, ze]], [0, 1, 1])
    if (ends[0]) face(wall, [[x0, y0, eave], [x0, y1, eave], [x0, ym, ridge]], [-1, 0, 0])
    if (ends[1]) face(wall, [[x1, y0, eave], [x1, y1, eave], [x1, ym, ridge]], [1, 0, 0])
    face(roof, [[x0 - over, y0 - over, ze], [x0 - over, y0, eave], [x1 + over, y0, eave], [x1 + over, y0 - over, ze]], [0, 0, -1])
    face(roof, [[x0 - over, y1 + over, ze], [x0 - over, y1, eave], [x1 + over, y1, eave], [x1 + over, y1 + over, ze]], [0, 0, -1])
  }
}

/** An aisle: walls to `low` at the outer side (outer = x0 when outerLow0) with a lean-to roof up to `high`. */
function leanTo(wall: Part, roof: Part, x0: number, y0: number, x1: number, y1: number, low: number, high: number, outerAtX0: boolean) {
  block(wall, null, rect(x0, y0, x1, y1), 0, low, 0)
  const xo = outerAtX0 ? x0 : x1, xi = outerAtX0 ? x1 : x0, d = outerAtX0 ? -0.3 : 0.3
  face(roof, [[xo + d, y0, low - 0.1], [xi, y0, high], [xi, y1, high], [xo + d, y1, low - 0.1]], [outerAtX0 ? -1 : 1, 0, 2])
  face(wall, [[xo, y0, low], [xi, y0, low], [xi, y0, high]], [0, -1, 0])
  face(wall, [[xo, y1, low], [xi, y1, low], [xi, y1, high]], [0, 1, 0])
}

function build() {
  const brick = new Part(), tile = new Part(), slate = new Part(), trim = new Part(), win = new Part(), flat = new Part()
  const pinnacle = (x: number, y: number, z0: number, h: number, r = 0.6) => {
    block(trim, null, rect(x - r, y - r, x + r, y + r), z0 - 0.6, z0, 0)
    pyramid(trim, x, y, r * 1.2, 4, z0, z0 + h, Math.PI / 4)
  }

  // --- Plan (lidar) -------------------------------------------------------
  const NX0 = 5.5, NX1 = 17.5, NXM = 11.5 // nave
  const FRONT = 43.3, BACK = 4 // nave front wall, where the apse starts
  const AX0 = -0.5, AX1 = 25.5 // aisle outer walls
  const TY0 = 11, TY1 = 24.5, TX0 = -4, TX1 = 27.5 // transept
  const TW: [number, number, number, number] = [17.5, 37.5, 25, 45] // tower x0 y0 x1 y1
  const TC: XY = [(TW[0] + TW[2]) / 2, (TW[1] + TW[3]) / 2]

  // --- Church -------------------------------------------------------------
  gabled(brick, tile, NX0, BACK, NX1, FRONT - 0.6, 21, 28.6, true, [true, false])
  // The front gable wall, rising a little over the ridge, with stone coping.
  block(brick, null, rect(NX0, FRONT - 0.6, NX1, FRONT), 0, 21, 0)
  face(brick, [[NX0, FRONT, 21], [NX1, FRONT, 21], [NXM, FRONT, 30]], [0, 1, 0])
  face(brick, [[NX0, FRONT - 0.6, 21], [NX1, FRONT - 0.6, 21], [NXM, FRONT - 0.6, 30]], [0, -1, 0])
  for (const s of [-1, 1]) {
    const xe = s < 0 ? NX0 : NX1
    face(trim, [[xe, FRONT - 0.7, 21], [xe, FRONT + 0.1, 21], [NXM, FRONT + 0.1, 30.3], [NXM, FRONT - 0.7, 30.3]], [s * 0.7, 0, 0.7])
  }
  // Aisles with lean-to roofs.
  leanTo(brick, tile, AX0, BACK, NX0, 37.5, 11.8, 14.5, true)
  leanTo(brick, tile, NX1, BACK, AX1, 37.5, 11.8, 14.5, false)
  // Transept, gable ends to the north-east and south-west.
  gabled(brick, tile, TX0, TY0, TX1, TY1, 22.5, 28.4, false)
  // Apse: a half octagon behind the nave, with a hipped roof.
  {
    const r = 6, n = 4, ring: XY[] = []
    for (let k = 0; k <= n; k++) { const a = Math.PI + (Math.PI * k) / n; ring.push([NXM + r * Math.cos(a), BACK + r * Math.sin(a)]) }
    for (let k = 0; k < n; k++) {
      const [ax, ay] = ring[k], [bx, by] = ring[k + 1], m = Math.PI + (Math.PI * (k + 0.5)) / n
      face(brick, [[ax, ay, 0], [bx, by, 0], [bx, by, 19.5], [ax, ay, 19.5]], [Math.cos(m), Math.sin(m), 0])
      face(tile, [[ax, ay, 19.5], [bx, by, 19.5], [NXM, BACK, 25.5]], [Math.cos(m), Math.sin(m), 1])
    }
  }
  // North-east corner block with its slate turret.
  block(brick, flat, rect(AX0, 37.5, NX0, FRONT), 0, 23, 0.3)
  pyramid(slate, 2.5, 40.4, 2.9, 8, 23, 32.8)
  for (const [x, y] of [[AX0 + 0.5, FRONT - 0.5], [NX0 - 0.5, FRONT - 0.5], [AX0 + 0.5, 38]] as XY[]) pinnacle(x, y, 23.6, 2.0)

  // --- The tower ----------------------------------------------------------
  {
    const [x0, y0, x1, y1] = TW, [cx, cy] = TC, h = 3.75, h2 = 3.35
    block(brick, null, rect(x0, y0, x1, y1), 0, 23, 0)
    // corner buttresses with stone caps and pinnacles
    for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
      const bx = cx + sx * (h - 0.55), by = cy + sy * (h - 0.55)
      block(brick, null, rect(bx - 0.8, by - 0.8, bx + 0.8, by + 0.8), 0, 22.5, 0)
      pinnacle(cx + sx * (h - 0.35), cy + sy * (h - 0.35), 23.4, 2.6, 0.7)
    }
    block(brick, null, rect(cx - h2, cy - h2, cx + h2, cy + h2), 23, 44.5, 0)
    block(trim, null, rect(cx - h2 - 0.25, cy - h2 - 0.25, cx + h2 + 0.25, cy + h2 + 0.25), 23, 23.6, 0)
    block(trim, null, rect(cx - h2 - 0.2, cy - h2 - 0.2, cx + h2 + 0.2, cy + h2 + 0.2), 34.4, 34.9, 0)
    // crown: a stone band, a gable on each face, corner pinnacles
    block(trim, trim, rect(cx - h2 - 0.15, cy - h2 - 0.15, cx + h2 + 0.15, cy + h2 + 0.15), 44.5, 45.3, 0)
    for (const side of ['+x', '-x', '+y', '-y'] as Side[]) {
      const c = side[1] === 'x' ? cx + (side[0] === '+' ? 1 : -1) * (h2 + 0.15) : cy + (side[0] === '+' ? 1 : -1) * (h2 + 0.15)
      const u = side[1] === 'x' ? cy : cx
      // a 0.6 m stone slab: front, back and the two sloping tops
      const sg = side[0] === '+' ? 1 : -1, F = onFace(side, c, 0), B = onFace(side, c - sg * 0.6, 0), n = nrm(side)
      face(trim, [F(u - 2.6, 45.3), F(u + 2.6, 45.3), F(u, 49)], n)
      face(trim, [B(u - 2.6, 45.3), B(u + 2.6, 45.3), B(u, 49)], [-n[0], -n[1], 0])
      face(trim, [F(u - 2.6, 45.3), F(u, 49), B(u, 49), B(u - 2.6, 45.3)], side[1] === 'x' ? [0, -1, 1] : [-1, 0, 1])
      face(trim, [F(u + 2.6, 45.3), F(u, 49), B(u, 49), B(u + 2.6, 45.3)], side[1] === 'x' ? [0, 1, 1] : [1, 0, 1])
    }
    for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) pinnacle(cx + sx * (h2 - 0.1), cy + sy * (h2 - 0.1), 45.9, 4.0, 0.55)
    // the spire
    pyramid(slate, cx, cy, 2.4, 8, 45.3, 54.2)
    // windows: lower stage (two lancets, then three), shaft (pair), belfry (two tall)
    for (const side of ['+y', '+x', '-x', '-y'] as Side[]) {
      const sgn = side[0] === '+' ? 1 : -1
      const c = side[1] === 'x' ? cx + sgn * h : cy + sgn * h, c2 = side[1] === 'x' ? cx + sgn * h2 : cy + sgn * h2
      const u = side[1] === 'x' ? cy : cx
      const low = side === '+y' || side === '+x'
      if (low) for (const d of [-0.75, 0.75]) lancet(win, side, c, u + d - 0.55, u + d + 0.55, STREET + 3.0, STREET + 6.4)
      for (const d of [-1.5, 0, 1.5]) lancet(win, side, c, u + d - 0.5, u + d + 0.5, 12.5, 18.2)
      for (const d of [-0.8, 0.8]) lancet(win, side, c2, u + d - 0.6, u + d + 0.6, 26.5, 31.0)
      for (const d of [-1.1, 1.1]) lancet(win, side, c2, u + d - 0.8, u + d + 0.8, 36.0, 41.8)
      for (const d of [-1.1, 1.1]) quadOn(trim, side, c2, u + d - 1.15, u + d + 1.15, 35.6, 35.9, 0.08)
    }
    // the side door on Pearl Street (south-west face)
    lancet(win, '+x', x1, cy - 1.0, cy + 1.0, STREET, STREET + 3.6)
  }

  // --- The front (Ross Avenue) -------------------------------------------
  {
    const F = FRONT
    // big pointed arch frame round the rose window, in stone
    lancet(trim, '+y', F, NXM - 4.2, NXM + 4.2, STREET + 9.5, STREET + 14.0, 0.05)
    lancet(brick, '+y', F, NXM - 3.6, NXM + 3.6, STREET + 9.8, STREET + 14.0, 0.1)
    disc(trim, '+y', F, NXM, STREET + 16.9, 3.1, 0.14)
    disc(win, '+y', F, NXM, STREET + 16.9, 2.6, 0.2)
    // the lancet arcade under it
    for (let k = -3; k <= 3; k++) lancet(win, '+y', F, NXM + k * 0.95 - 0.35, NXM + k * 0.95 + 0.35, STREET + 10.6, STREET + 12.4, 0.14)
    // the stone portal: a gabled frame with the doors under a pointed arch
    block(trim, trim, rect(NXM - 2.8, F, NXM + 2.8, F + 0.9), 0, STREET + 8.0, 0)
    face(trim, [[NXM - 2.8, F + 0.9, STREET + 8.0], [NXM + 2.8, F + 0.9, STREET + 8.0], [NXM, F + 0.9, STREET + 11.3]], [0, 1, 0])
    face(trim, [[NXM - 2.8, F, STREET + 8.0], [NXM, F, STREET + 11.3], [NXM, F + 0.9, STREET + 11.3], [NXM - 2.8, F + 0.9, STREET + 8.0]], [-1, 0, 1])
    face(trim, [[NXM + 2.8, F, STREET + 8.0], [NXM, F, STREET + 11.3], [NXM, F + 0.9, STREET + 11.3], [NXM + 2.8, F + 0.9, STREET + 8.0]], [1, 0, 1])
    lancet(win, '+y', F + 0.9, NXM - 1.7, NXM + 1.7, STREET, STREET + 4.2)
    for (const d of [-1, 1]) pinnacle(NXM + d * 3.1, F + 0.45, STREET + 8.6, 2.4, 0.45)
    // side lancets flanking the portal
    for (const d of [-1, 1]) lancet(win, '+y', F, NXM + d * 4.6 - 0.55, NXM + d * 4.6 + 0.55, STREET + 3.0, STREET + 7.0)
    // north-east corner block: two tall lancets, a stone gable, a low window
    for (const d of [-0.9, 0.9]) lancet(win, '+y', F, 2.5 + d - 0.5, 2.5 + d + 0.5, STREET + 9.5, STREET + 15.0)
    lancet(win, '+y', F, 2.0, 3.0, STREET + 2.5, STREET + 5.5)
    triOn(trim, '+y', F, 0.0, 5.0, STREET + 17.3, STREET + 20.2, 0.08)
    // pinnacles at the nave front's shoulders
    for (const x of [NX0 + 0.3, NX1 - 0.3]) pinnacle(x, F - 0.3, 21.4, 2.6, 0.55)
  }

  // --- Sides --------------------------------------------------------------
  {
    // Clerestory lancets, both sides, front bays and the bay behind the transept.
    for (const [side, c] of [['+x', NX1], ['-x', NX0]] as [Side, number][]) {
      for (const y of [27.4, 31.4, 35.4]) for (const d of [-0.6, 0.6]) lancet(win, side, c, y + d - 0.45, y + d + 0.45, 15.6, 18.6)
      for (const y of [7.5]) for (const d of [-0.6, 0.6]) lancet(win, side, c, y + d - 0.45, y + d + 0.45, 15.6, 18.6)
    }
    // Aisle lancets.
    for (const [side, c] of [['+x', AX1], ['-x', AX0]] as [Side, number][]) {
      for (const y of [27.4, 31.4, 35.4, 7.5]) lancet(win, side, c, y - 0.75, y + 0.75, STREET + 2.0, STREET + 6.6)
    }
    // Transept gable ends: rose window, a band of lancets, corner pinnacles.
    for (const [side, c] of [['+x', TX1], ['-x', TX0]] as [Side, number][]) {
      const ym = (TY0 + TY1) / 2
      disc(trim, side, c, ym, 17.0, 3.0, 0.08)
      disc(win, side, c, ym, 17.0, 2.5, 0.14)
      for (let k = -3; k <= 3; k++) lancet(win, side, c, ym + k * 0.95 - 0.35, ym + k * 0.95 + 0.35, 10.6, 12.8)
      for (const d of [-1, 1]) lancet(win, side, c, ym + d * 3.6 - 0.6, ym + d * 3.6 + 0.6, STREET + 1.5, STREET + 5.5)
      for (const y of [TY0 + 0.4, TY1 - 0.4]) pinnacle(side === '+x' ? c - 0.4 : c + 0.4, y, 23.0, 3.2, 0.6)
    }
    // Apse windows.
    for (let k = 0; k < 4; k++) {
      const m = Math.PI + (Math.PI * (k + 0.5)) / 4, r = 6 * Math.cos(Math.PI / 8) + 0.07
      const cxw = NXM + r * Math.cos(m), cyw = BACK + r * Math.sin(m), t: V3 = [-Math.sin(m), Math.cos(m), 0]
      const P = (u: number, z: number): V3 => [cxw + t[0] * u, cyw + t[1] * u, z]
      const pts: V3[] = [P(-0.7, 8), P(0.7, 8), P(0.7, 15), P(0, 16.2), P(-0.7, 15)]
      face(win, pts, [Math.cos(m), Math.sin(m), 0])
    }
  }

  // --- Parish halls inside the same OSM outline ----------------------------
  const hall = (r: XY[], h: number) => block(brick, flat, r, 0, h, 0.3)
  hall([[-31.1, -6.4], [AX0, -6.4], [AX0, 26.3], [-6.4, 26.3], [-6.4, 27.9], [-10.4, 27.9], [-10.4, 31.3], [-31.3, 31.3]], 10.9)
  hall(rect(-31.0, -15.7, -22.5, -6.4), 11.9)
  hall([[-26.6, -27.8], [-9.7, -27.8], [-9.7, -6.4], [-22.5, -6.4], [-22.5, -15.7], [-26.6, -15.7]], 4.6)
  hall([[-9.6, -43.0], [32.8, -43.1], [32.7, -32.1], [28.2, -32.1], [28.1, -21.8], [18.2, -21.8], [18.2, -24.8], [-0.4, -24.8], [-0.5, -6.4], [-9.7, -6.4]], 10.3)
  // the sacristy link between the apse and the rear hall
  hall(rect(-0.5, -6.4, 24.0, BACK - 2), 10.6)
  // hall windows: a band on the Pearl Street side of the rear hall
  for (let k = 0; k < 4; k++) quadOn(win, '+x', 32.8, -41.5 + k * 2.4, -40 + k * 2.4, 3.2, 7.2)

  // The tower is floodlit; the rest of the brick only faintly.
  const lit = (p: V3, n: V3) => {
    if (Math.abs(n[2]) > 0.8) return 0
    const inTower = p[0] > TW[0] - 0.9 && p[1] > TW[1] - 0.9
    return inTower ? Math.max(0.2, 0.75 - 0.008 * p[2]) : 0.12
  }
  return [
    { part: brick, material: { ...finish('guadalupe-brick', 0x8c4239), floodlight: lit } },
    { part: tile, material: finish('guadalupe-tile', 0xc06a50) },
    { part: slate, material: finish('guadalupe-slate', 0x6a7078) },
    { part: trim, material: { ...PALETTE.trim, floodlight: (p: V3, n: V3) => lit(p, n) } },
    { part: win, material: PALETTE.window },
    { part: flat, material: PALETTE.roof },
  ]
}

if (import.meta.main) await save('dal-cathedral-guadalupe', 'Cathedral Shrine of the Virgin of Guadalupe', ANCHOR, BEARING, build(), 6500)
