/**
 * Cathedral of St. Matthew the Apostle — procedural, CC0-1.0, no textures.
 * bun generators/dc-st-matthews.ts
 *
 * Map frame: x across the church, y along its axis towards the altar, z up,
 * metres. The front faces Rhode Island Avenue at 156°, so the axis runs
 * 336° and that is the placement bearing. The anchor is the area centroid of
 * the OSM outline way/55327016 (lng -77.0402483, lat 38.9063933).
 *
 * What it is: C. Grant La Farge's Romanesque Revival cathedral (1893–1913)
 * in red brick over a brownstone base, a Latin cross under grey slate. The
 * identity: the tall plain gabled front with its dentilled pediment, three
 * small round-headed windows, the mosaic lunette and the brownstone portico
 * of three doors; and over the crossing a square brick base carrying an
 * octagonal drum, three round-arched windows to a face, under a ribbed
 * copper dome and a green copper lantern.
 *
 * Covers and replaces the outline way/55327016. OSM maps no parts.
 *
 * Evidence
 * - OSM (measured): outline 48 × 52 m, a squarish blob that takes in the
 *   aisles, transepts, sacristies and two small round chapels at the front
 *   corners; the front at y −25.7, 20.2 m wide.
 * - USGS NAIP orthophoto (public domain), turned to the frame: nave
 *   x −11.3…8.3; crossing square to y 13.5; octagonal drum about 23 m
 *   across with the dome r 9.6 centred (−1.3, 4.0); west transept to
 *   x −21.6, east transept to x 26.4; choir to y 22.8; slate roofs.
 * - Published (Wikipedia, "Cathedral of St. Matthew the Apostle"): a Latin
 *   cross 155 × 136 ft (47 × 41 m); the dome rises 190 ft (58 m), the
 *   cupola and cross bring it to 200 ft (61 m).
 * - USGS 3DEP ground: 19.0 m at the front, 21.9 m at the back, so y = 0 is
 *   19.0 m and the north walls run 3 m into the slope.
 * - Photos (Wikimedia Commons): "Cathedral of St Matthew the Apostle.JPG"
 *   (D Monack, CC BY-SA 3.0 US; from the south-west, the main source of
 *   the dome's proportions); "Cathedral of St. Matthew the Apostle
 *   (Washington, D.C.) - facade.jpg" and "… (Washington, D.C.).jpg" (APK,
 *   CC BY-SA 4.0; the front); "2013 Cathedral of St. Matthew the
 *   Apostle.JPG" (Farragutful, CC BY-SA 3.0; from the south-east); "Cathedral
 *   of St. Matthew the Apostle - Washington, DC - DSC07678.jpg" (Daderot,
 *   public domain; drum and dome close up).
 * - Read off the photos (estimated): front cornice 22 m, pediment apex
 *   28.6 m; nave and transept eaves 21.5 m, ridges 28 m (transepts hipped,
 *   27 m); aisles 10.5 m. The crossing square stops at the eaves under a
 *   hipped slate skirt, so the octagonal drum (29–41 m, windows 33–39 m)
 *   sits just above the ridges, as the street photos show; dome r 9.9 m
 *   rising 9.5 m to 51.5 m; lantern to 57 m; the cross to 61 m
 *   (published). The front's height is scaled from the frontal photo's
 *   width-to-height ratio (about 1:1.4 to the apex, corrected for the
 *   upward view). Doubt: Wikipedia's "190 ft above the nave" is ambiguous;
 *   the lantern and cross take up what the photos leave above the dome.
 * - Simplified: the mosaic lunette, dentils, brownstone string courses and
 *   the lantern's openings are left out; the sacristies are plain blocks.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { lathe } from './dc-nmaahc'
import { beam, cbox, gable, grow, ngon, ngonPrism, qf, rect, roundArch, save, tf, type Side, type XY } from './dc-national-cathedral'

function build() {
  const brick = new Part(), brown = new Part(), slate = new Part(), dome = new Part(), green = new Part(), win = new Part()

  const NX0 = -11.3, NX1 = 8.3, XC = (NX0 + NX1) / 2
  const FRONT = -25.7
  const EAVE = 21.5, RIDGE = 28.0
  const DC: XY = [-1.3, 4.0]

  // ---- Nave, crossing square and choir: one long gabled body.
  const nave = rect(NX0, NX1, FRONT + 1.2, -6.0)
  const choir = rect(NX0 - 1.2, NX1 - 0.3, 13.5, 22.8)
  cbox(brick, nave, 0, EAVE, { top: false })
  gable(slate, brick, grow(nave, 0.3, 0), EAVE, RIDGE, true, [false, false])
  cbox(brick, choir, 0, EAVE - 2, { top: false })
  gable(slate, brick, grow(choir, 0.3, 0.3), EAVE - 2, RIDGE - 3, true, [false, true])
  // Transepts, gabled east–west.
  const tw = rect(-21.6, NX0, -4.5, 13.5), te = rect(NX1, 26.4, -2.8, 13.5)
  for (const t of [tw, te]) {
    cbox(brick, t, 0, EAVE, { top: false })
    // Hipped at the outer end, as the aerial shows; the inner end runs into the crossing.
    const g = grow(t, 0.3, 0.3), ym = (g.y0 + g.y1) / 2, rz = RIDGE - 1
    const outer = t === tw ? g.x0 : g.x1, inner = t === tw ? g.x1 : g.x0, hipX = outer + (t === tw ? 1 : -1) * (ym - g.y0) * 0.9
    qf(slate, [outer, g.y0, EAVE], [inner, g.y0, EAVE], [inner, ym, rz], [hipX, ym, rz], [0, -1, 1.5])
    qf(slate, [outer, g.y1, EAVE], [inner, g.y1, EAVE], [inner, ym, rz], [hipX, ym, rz], [0, 1, 1.5])
    tf(slate, [outer, g.y0, EAVE], [outer, g.y1, EAVE], [hipX, ym, rz], [t === tw ? -1 : 1, 0, 1])
  }
  // Brownstone base course round the main walls.
  for (const r of [nave, tw, te, choir]) cbox(brown, grow(r, 0.15), 0, 4.2, { b: 0.2, top: false })
  for (const r of [nave, tw, te]) cbox(brick, grow(r, 0.3), EAVE - 0.7, EAVE, { b: 0.25, top: false, bottom: true })

  // Aisles: low brick ranges with lean-to slate roofs.
  for (const [r, out] of [[rect(-21.2, NX0, -23.6, -4.5), -1], [rect(NX1, 18.6, -23.0, -2.8), 1]] as Array<[ReturnType<typeof rect>, number]>) {
    cbox(brick, r, 0, 9.5, { top: false })
    cbox(brown, grow(r, 0.15), 0, 4.2, { b: 0.2, top: false })
    const xo = out < 0 ? r.x0 - 0.3 : r.x1 + 0.3, xi = out < 0 ? r.x1 : r.x0
    qf(slate, [xo, r.y0 - 0.3, 9.5], [xo, r.y1, 9.5], [xi, r.y1, 12.0], [xi, r.y0 - 0.3, 12.0], [out * 2.5, 0, 10])
    tf(brick, [r.x0, r.y0, 9.5], [r.x1, r.y0, 9.5], [xi, r.y0, 12.0], [0, -1, 0])
    // Three round-headed windows a bay.
    const side: Side = out < 0 ? 'w' : 'e'
    for (const c of [-19.5, -14.0, -8.5]) roundArch(win, side, out < 0 ? r.x0 : r.x1, c - 0.8, c + 0.8, 5.5, 8.6)
  }
  // The small round chapels at the front corners, under slate cones.
  for (const [x, y] of [[-18.7, -22.2], [15.8, -22.4]] as XY[]) {
    ngonPrism(brown, x, y, 3.2, 12, 0, 8.5, { top: false })
    lathe(slate, x, y, [[3.4, 8.5], [2.4, 9.7], [1.0, 10.6], [0, 11.0]], 12, false)
  }
  // Sacristies behind the west transept and the choir.
  cbox(brick, rect(-21.4, -12.6, 14.3, 26.8), 0, 12, { b: 0.3, top: slate })
  cbox(brick, rect(NX1 - 0.3, 24.6, 14.3, 21.0), 0, 10, { b: 0.3, top: slate })

  // ---- The front: a tall plain gable over a brownstone portico.
  {
    const y = FRONT
    const f = rect(NX0 - 0.3, NX1 + 0.3, y, y + 1.2)
    cbox(brick, f, 0, 22.0, { top: false })
    cbox(brown, grow(f, 0.2, 0.15), 21.5, 22.4, { b: 0.25, bottom: true, top: false })
    // Pediment, its raking cornice drawn as a thin brownstone rim.
    tf(brick, [f.x0, y, 22.4], [f.x1, y, 22.4], [XC, y, 28.6], [0, -1, 0])
    tf(brick, [f.x0, y + 1.2, 22.4], [f.x1, y + 1.2, 22.4], [XC, y + 1.2, 28.6], [0, 1, 0])
    for (const x of [f.x0, f.x1]) beam(brown, [x, y + 0.45, 22.55], [XC, y + 0.45, 28.75], 1.6, 0.5)
    // Brownstone piers at the corners, the portico across the base.
    for (const x of [f.x0, f.x1 - 1.6]) cbox(brown, rect(x, x + 1.6, y - 0.2, y + 1.2), 0, 21.5, { top: false })
    cbox(brown, rect(-8.0, 5.0, y - 0.6, y + 0.4), 0, 9.0, { b: 0.3 })
    for (const c of [-5.6, XC, 2.6]) qf(win, [c - 1.35, y - 0.65, 0.8], [c + 1.35, y - 0.65, 0.8], [c + 1.35, y - 0.65, 7.2], [c - 1.35, y - 0.65, 7.2], [0, -1, 0])
    // The mosaic lunette's arch and three small windows high up.
    roundArch(brown, 's', y, XC - 3.3, XC + 3.3, 9.0, 12.6, 0.06, 8)
    for (const c of [XC - 6.0, XC - 0.8, XC + 0.8, XC + 6.0]) roundArch(win, 's', y, c - 0.65, c + 0.65, 17.6, 20.4)
  }
  // Clerestory and transept windows: round-headed, in pairs and threes.
  for (const [side, at] of [['w', NX0], ['e', NX1]] as Array<[Side, number]>) {
    for (const c of [-21.5, -16.0, -10.5]) roundArch(win, side, at, c - 0.9, c + 0.9, 15.0, 19.5)
  }
  for (const [side, at, t] of [['w', tw.x0, tw], ['e', te.x1, te]] as Array<[Side, number, ReturnType<typeof rect>]>) {
    const ym = (t.y0 + t.y1) / 2
    for (const k of [-2.6, 0, 2.6]) roundArch(win, side, at, ym + k - 1.0, ym + k + 1.0, 10.5, 17.0)
    for (const k of [-0.7, 0.7]) roundArch(win, side, at, ym + k - 0.5, ym + k + 0.5, 18.4, 20.6)
  }

  // ---- The crossing: square base, octagonal drum, dome and lantern.
  {
    const [cx, cy] = DC
    const H = 10.4
    const base = rect(cx - H, cx + H, cy - H, cy + H)
    cbox(brick, base, 0, 22.0, { top: false })
    cbox(brown, grow(base, 0.3), 21.2, 22.0, { b: 0.2, bottom: true, top: false })
    // Slate skirt from the square up to the drum.
    const sq: V3[] = [[base.x0 - 0.3, base.y0 - 0.3, 22], [base.x1 + 0.3, base.y0 - 0.3, 22], [base.x1 + 0.3, base.y1 + 0.3, 22], [base.x0 - 0.3, base.y1 + 0.3, 22]]
    const oct = ngon(cx, cy, 10.6, 8, 29.5, Math.PI / 8)
    // Each square side rises to the two octagon corners above it (ngon()
    // puts corner k at 22.5° + 45°k); triangles fill the square's corners.
    for (let k = 0; k < 4; k++) {
      const a = sq[k], b = sq[(k + 1) % 4]
      const o1 = oct[(5 + 2 * k) % 8], o2 = oct[(6 + 2 * k) % 8], o3 = oct[(7 + 2 * k) % 8]
      const t = ((-90 + 90 * k) * Math.PI) / 180, tc = t + Math.PI / 4
      qf(slate, a, b, o2, o1, [Math.cos(t), Math.sin(t), 1])
      tf(slate, b, o3, o2, [Math.cos(tc), Math.sin(tc), 1])
    }
    // The drum: brick octagon with brownstone piers at the angles.
    const R = 10.6
    ngonPrism(brick, cx, cy, R, 8, 29.0, 41.0, { top: false })
    for (const c of ngon(cx, cy, R + 0.2, 8, 0, Math.PI / 8)) ngonPrism(brown, c[0], c[1], 0.75, 6, 29.0, 41.0, { top: false })
    ngonPrism(brown, cx, cy, R + 0.6, 8, 41.0, 42.0, { top: false })
    {
      const outer = ngon(cx, cy, R + 0.6, 8, 42.0), inner = ngon(cx, cy, 9.9, 8, 42.0)
      for (let k = 0; k < 8; k++) slate.quad(inner[k], outer[k], outer[(k + 1) % 8], inner[(k + 1) % 8])
      const under = ngon(cx, cy, R, 8, 41.0), lip = ngon(cx, cy, R + 0.6, 8, 41.0)
      for (let k = 0; k < 8; k++) brown.quad(lip[(k + 1) % 8], under[(k + 1) % 8], under[k], lip[k])
    }
    // Three round-arched windows on each face.
    for (let k = 0; k < 8; k++) {
      const ang = (2 * Math.PI * (k + 1)) / 8 // face k's centre, between corners k and k + 1
      const c = Math.cos(ang), s = Math.sin(ang), apo = R * Math.cos(Math.PI / 8) + 0.05
      const P = (u: number, z: number): V3 => [cx + c * apo - s * u, cy + s * apo + c * u, z]
      for (const u of [-2.3, 0, 2.3]) {
        const w = 0.75, spring = 38.4
        qf(win, P(u - w, 33.0), P(u + w, 33.0), P(u + w, spring), P(u - w, spring), [c, s, 0])
        for (let i = 0; i < 4; i++) {
          const t0 = (Math.PI * i) / 4, t1 = (Math.PI * (i + 1)) / 4
          tf(win, P(u, spring), P(u + w * Math.cos(t0), spring + w * Math.sin(t0)), P(u + w * Math.cos(t1), spring + w * Math.sin(t1)), [c, s, 0])
        }
      }
    }
    // The ribbed copper dome, r 9.6, rising 9 m.
    const prof: [number, number][] = []
    for (const d of [0, 18, 36, 54, 70, 81]) prof.push([9.9 * Math.cos((d * Math.PI) / 180), 42.0 + 9.5 * Math.sin((d * Math.PI) / 180)])
    lathe(dome, cx, cy, prof, 16, false)
    const lz = prof[prof.length - 1][1]
    // Lantern: a green copper drum, cap and cross.
    ngonPrism(green, cx, cy, 1.6, 8, lz - 0.2, lz + 3.6, { top: false })
    lathe(green, cx, cy, [[1.9, lz + 3.6], [1.4, lz + 4.6], [0.4, lz + 5.3], [0.25, 59.5], [0, 61.0]], 8, false)
  }

  return [
    { part: brick, material: finish('stm-brick', 0xb9705f) },
    { part: brown, material: finish('stm-brownstone', 0xa7786a) },
    { part: slate, material: finish('stm-slate', 0x7c838b) },
    { part: dome, material: finish('stm-dome-copper', 0x6f7e74) },
    { part: green, material: PALETTE.patina },
    { part: win, material: PALETTE.window },
  ]
}

if (import.meta.main) {
  await save('dc-st-matthews', 'Cathedral of St. Matthew the Apostle', build(), {
    source: 'generators/dc-st-matthews.ts',
  })
}
