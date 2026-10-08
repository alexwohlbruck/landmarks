/**
 * Basilica of the National Shrine of the Immaculate Conception — procedural,
 * CC0-1.0, no textures. bun generators/dc-national-shrine.ts
 *
 * Map frame: x east, y north along the church's axis (the main front faces
 * south), z up, metres. The long walls in OSM run at 173.5°, so the
 * placement bearing is 353.6°. The anchor is the area centroid of the OSM
 * outline way/297739340 (lng -77.0006490, lat 38.9333351).
 *
 * What it is: Maginnis & Walsh's Byzantine-Romanesque basilica (1920–1961,
 * Trinity Dome mosaic 2017), pale limestone walls under red Ludowici tile
 * roofs. A Latin cross 140 m long: the south front, a tall stepped gable
 * screen round one great round-arched recess holding the rose; a nave of
 * high walls with grouped round-arched windows over low aisle chapels with
 * small tiled domes; the transept, its two fronts each a gable with a rose
 * over a three-arched porch; the Trinity Dome over the crossing, its blue
 * tiles patterned in gold (drawn blue: that is what reads at map scale),
 * on an arcaded drum, with a gilded lantern; the north apse and two round
 * chapels at the north corners; and beside the front, the free-standing
 * Knights' Tower campanile, a plain square shaft with two tiers of belfry
 * arcades, a narrower top stage and a blue-tiled spire with a gilded tip.
 *
 * Covers and replaces the outline way/297739340 and its 28 building:parts:
 * way/1373214415, 1373214416, 1373214417 and way/1426384328 … 1426384352.
 *
 * Evidence
 * - OSM (measured): outline 140 × 92 m; the main body 30.5 m wide
 *   (x −14.9…15.6), y −66.2…63.3; transept x −29…29.5, y −6.2…15.2; dome
 *   r 15.4 centred (0.3, 4.6), lantern r 2.2; Knights' Tower in three
 *   stepped parts (9.4 × 10.9, 7.6 × 9.1, 5.9 × 7.2 m) centred (−31, −55);
 *   aisle ranges x ±(15…24.5), with four round turrets r 3; front wings
 *   y −59…−51; transept porches to x ±36.5; north wings and round chapels
 *   r 6.2 at (±35, 30); north apse r 7.9 round (0, 64.7). Building levels
 *   and roof shapes and colours (#d16844 tile, #93c5d8 dome, gold lantern)
 *   are tagged; no heights.
 * - Published (Wikipedia): 140 m long, 73 m wide, 72 m to the top of the
 *   cross on the dome; the Knights' Tower 329 ft (100 m).
 * - USGS 3DEP ground: 64.0–64.5 m all round, so y = 0 is 64.0 m.
 * - Photos (Wikimedia Commons): "Basilica of the National Shrine of the
 *   Immaculate Conception - exterior 3.jpg" (APK, CC BY-SA 4.0; the east
 *   side square on, the main source of heights); "Basilica of the National
 *   Shrine of the Immaculate Conception highsmith.jpg" (Carol M. Highsmith,
 *   public domain; the south front and tower square on); "… from atop
 *   Washington Mnt cutout.jpg" (Diezweitehand, CC BY-SA 4.0; from the
 *   south-south-west); "… (cropped).jpg" (AgnosticPreachersKid, CC BY-SA
 *   3.0; east side); "… exterior 1.jpg" (APK, CC BY-SA 4.0; south front).
 *   USGS NAIP orthophoto for roof colours.
 * - Read off the photos, scaled from the published heights (estimated):
 *   walls 31.4 m, roof ridges 38 m; south screen to 35.7 m, pediment to
 *   41 m, great arch 18.3 m wide to 34 m, rose r 5.4 m at 23.2 m;
 *   transept fronts to 39.7 m, pediments to 44 m, roses r 5.3 m at
 *   28.7 m; drum to 48.6 m with arched windows, dome r 12.6 m rising to
 *   58 m, lantern to 66 m, finial to 72 m; aisles 15 m; tower shaft to
 *   51.8 m, belfry stage to 69 m (arcades 53.5–58.5 and 61–66.5 m), top
 *   stage to 81 m, spire 82–93.3 m, gilded tip to 100 m.
 * - Drawn: the great arch is a real 1.6 m recess in the front screen with
 *   a proud stone archivolt, its back wall a shade of the stone with the
 *   rose and window row flush in it. The tower's open stages are dark
 *   cores set behind stone piers, two round-headed openings a face per
 *   tier. The dome is a deep muted blue (#4f6a9a) with its gold band.
 * - Simplified: the dome's gold patterning, the mosaics and sculpture of
 *   the front, the belfry's eight arches a face (drawn as two broad
 *   ones), cornices and the stairs to the plaza are left out; the north
 *   wings' roofs are drawn flat.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { lathe } from './dc-nmaahc'
import { beam, capPoly, cbox, gable, grow, lancet, ngon, ngonPrism, qf, rect, roundArch, roundWin, save, spire, tf, wallsPoly, type Side, type XY } from './dc-national-cathedral'

const NRM: Record<Side, V3> = { n: [0, 1, 0], s: [0, -1, 0], e: [1, 0, 0], w: [-1, 0, 0] }

/** A cylinder with flat-shaded sides (n segments), optionally capped. */
function drum(p: Part, cx: number, cy: number, r: number, z0: number, z1: number, n = 16, top: Part | false = false) {
  ngonPrism(p, cx, cy, r, n, z0, z1, { top: top || false })
}

/** Round-arched windows round a drum, one per face of an n-gon. */
function drumWindows(p: Part, cx: number, cy: number, r: number, n: number, w: number, z0: number, z1: number, every = 1) {
  for (let k = 0; k < n; k += every) {
    // ngon() puts corner k at π/n + 2πk/n, so face k is centred at 2π(k + 1)/n.
    const ang = (2 * Math.PI * (k + 1)) / n
    const c = Math.cos(ang), s = Math.sin(ang), apo = r * Math.cos(Math.PI / n) + 0.05
    const P = (u: number, z: number): V3 => [cx + c * apo - s * u, cy + s * apo + c * u, z]
    const half = w / 2, spring = z1 - half, seg = 4
    const n3: V3 = [c, s, 0]
    qf(p, P(-half, z0), P(half, z0), P(half, spring), P(-half, spring), n3)
    for (let i = 0; i < seg; i++) {
      const t0 = (Math.PI * i) / seg, t1 = (Math.PI * (i + 1)) / seg
      tf(p, P(0, spring), P(half * Math.cos(t0), spring + half * Math.sin(t0)), P(half * Math.cos(t1), spring + half * Math.sin(t1)), n3)
    }
  }
}

function build() {
  const stone = new Part(), tile = new Part(), win = new Part(), shade = new Part(), blue = new Part(), gold = new Part()

  const BX0 = -14.9, BX1 = 15.5, BY0 = -66.2, BY1 = 63.3 // the main body
  const EAVE = 31.4, RIDGE = 35.6
  const TY0 = -6.2, TY1 = 15.2, TX0 = -29.0, TX1 = 29.4 // transept
  const DC: XY = [0.3, 4.6] // dome centre

  // ---- Main body and transept: high walls, red tile gables.
  const body = rect(BX0, BX1, BY0 + 1.5, BY1)
  cbox(stone, body, 0, EAVE, { top: false })
  gable(tile, stone, grow(body, 0.4, 0), EAVE, RIDGE, true, [false, true])
  const trans = rect(TX0 + 1.5, TX1 - 1.5, TY0, TY1)
  cbox(stone, trans, 0, EAVE, { top: false })
  gable(tile, stone, grow(trans, 0, 0.4), EAVE, RIDGE, false, [false, false])
  // A plain cornice band at the eaves.
  for (const r of [body, trans]) cbox(stone, grow(r, 0.35), EAVE - 0.9, EAVE, { b: 0.3, top: false, bottom: true })

  // ---- The south front: a stepped screen round the great arch.
  {
    const y = BY0
    // The screen, built round a real opening for the great arch: the
    // recess runs back 1.6 m to the church's own front wall.
    const A0 = -9.0, A1 = 9.3, AM = (A0 + A1) / 2, AR = (A1 - A0) / 2, AZ0 = 2.5, ATOP = 34.0, SPRING = ATOP - AR
    cbox(stone, rect(BX0, -12.5, y, y + 1.6), 0, EAVE + 0.8, { b: 0.3 })
    cbox(stone, rect(12.8, BX1, y, y + 1.6), 0, EAVE + 0.8, { b: 0.3 })
    cbox(stone, rect(-12.5, A0, y, y + 1.6), 0, 35.7, { b: 0.3, top: stone })
    cbox(stone, rect(A1, 12.8, y, y + 1.6), 0, 35.7, { b: 0.3, top: stone })
    cbox(stone, rect(A0, A1, y, y + 1.6), ATOP, 35.7, { top: stone })
    // Spandrels over the arch, front face, and the arch's soffit.
    const SEG = 10
    const arcPt = (k: number): [number, number] => { const t = (Math.PI * k) / SEG; return [AM + AR * Math.cos(t), SPRING + AR * Math.sin(t)] }
    for (let k = 0; k < SEG; k++) {
      const [x0, z0] = arcPt(k), [x1, z1] = arcPt(k + 1)
      const corner: V3 = k < SEG / 2 ? [A1, y, ATOP] : [A0, y, ATOP]
      tf(stone, corner, [x0, y, z0], [x1, y, z1], [0, -1, 0])
      qf(shade, [x0, y, z0], [x1, y, z1], [x1, y + 1.6, z1], [x0, y + 1.6, z0], [AM - (x0 + x1) / 2, 0, SPRING - (z0 + z1) / 2])
    }
    for (const x0 of [A0, A1]) { const x = x0 + (x0 < AM ? 0.03 : -0.03); qf(shade, [x, y, AZ0], [x, y, SPRING], [x, y + 1.6, SPRING], [x, y + 1.6, AZ0], [x0 < AM ? 1 : -1, 0, 0]) }
    cbox(stone, rect(A0, A1, y, y + 1.6), 0, AZ0, { top: stone })
    // The recess's back wall, shaded, with the rose and the window row flush in it.
    roundArch(shade, 's', y + 1.5, A0, A1, AZ0, ATOP, 0.03, SEG)
    roundWin(win, 's', y + 1.5, AM, 23.2, 5.4, 16, 0.055)
    for (const c of [-3.4, 0.15, 3.7]) roundArch(win, 's', y + 1.5, c - 1.2, c + 1.2, 10.5, 15.0, 0.055)
    for (const c of [-3.0, 0.15, 3.3]) roundArch(shade, 's', y + 1.5, c - 1.1, c + 1.1, AZ0, 7.4, 0.055)
    // A lighter stone archivolt round the opening, standing 0.5 m proud.
    const RA = AR + 0.7
    for (let k = 0; k < SEG; k++) {
      const t0 = (Math.PI * k) / SEG, t1 = (Math.PI * (k + 1)) / SEG
      beam(stone, [AM + RA * Math.cos(t0), y - 0.25, SPRING + RA * Math.sin(t0)], [AM + RA * Math.cos(t1), y - 0.25, SPRING + RA * Math.sin(t1)], 0.5, 1.2)
    }
    for (const x of [AM - RA, AM + RA]) cbox(stone, rect(x - 0.6, x + 0.6, y - 0.5, y), 0, SPRING, { top: false })
    // Pediment with a little cross block on top.
    tf(stone, [-12.5, y, 35.7], [12.8, y, 35.7], [0.15, y, 41], [0, -1, 0])
    tf(stone, [-12.5, y + 1.6, 35.7], [12.8, y + 1.6, 35.7], [0.15, y + 1.6, 41], [0, 1, 0])
    qf(stone, [-12.5, y, 35.7], [0.15, y, 41], [0.15, y + 1.6, 41], [-12.5, y + 1.6, 35.7], [-5.3, 0, 12.6])
    qf(stone, [12.8, y, 35.7], [0.15, y, 41], [0.15, y + 1.6, 41], [12.8, y + 1.6, 35.7], [5.3, 0, 12.6])
    cbox(stone, rect(-0.5, 0.8, y + 0.3, y + 1.3), 40, 43, { b: 0.2 })
  }
  // The front's low wings and the south-east annex, gabled across.
  for (const r of [rect(-24.2, BX0, -59.3, -51.4), rect(BX1, 24.6, -59.4, -50.6)]) {
    cbox(stone, r, 0, 14, { top: false })
    gable(tile, stone, grow(r, 0.3), 14, 17, false)
    for (const c of [r.x0 + 2.4, (r.x0 + r.x1) / 2, r.x1 - 2.4]) roundArch(win, 's', r.y0, c - 0.8, c + 0.8, 9.5, 12.5)
  }
  cbox(stone, rect(24.6, 35.3, -59.4, -50.6), 0, 9, { b: 0.3, top: stone })
  cbox(stone, rect(-26.4, -24.1, -58.4, -51.4), 0, 14, { b: 0.3, top: tile })

  // ---- Aisle ranges along the nave with their four round turrets.
  for (const r of [rect(-24.0, BX0, -51.4, -6.2), rect(BX1, 24.5, -50.6, -6.2)]) {
    cbox(stone, r, 0, 15, { b: 0.3, top: tile })
  }
  for (const [x, y] of [[-23.7, -20.9], [-23.9, -40.0], [24.1, -39.9], [24.4, -20.7]] as XY[]) {
    drum(stone, x, y, 3.1, 0, 13, 12)
    lathe(tile, x, y, [[3.3, 13], [3.0, 14.2], [2.0, 15.5], [0.0, 16.4]], 12, false)
  }
  // Aisle windows, small and round-headed, one pair per bay.
  for (const [side, at] of [['w', -24.0], ['e', 24.5]] as Array<[Side, number]>) {
    for (const c of [-46.0, -30.5, -13.0]) for (const k of [-1.6, 1.6]) roundArch(win, side, at, c + k - 0.7, c + k + 0.7, 6.0, 10.5)
  }
  // The high walls' grouped windows: a tall one between two shorter.
  const group = (side: Side, at: number, c: number) => {
    roundArch(win, side, at, c - 1.3, c + 1.3, 19.0, 29.0)
    roundArch(win, side, at, c - 4.1, c - 2.3, 19.0, 26.5)
    roundArch(win, side, at, c + 2.3, c + 4.1, 19.0, 26.5)
  }
  for (const [side, at] of [['w', BX0], ['e', BX1]] as Array<[Side, number]>) {
    for (const c of [-40.0, -20.8, 29.0, 47.0]) group(side, at, c)
  }

  // ---- Transept fronts: gable screens with roses over three-arched porches.
  for (const [side, x] of [['w', TX0], ['e', TX1]] as Array<[Side, number]>) {
    const s = side === 'e' ? 1 : -1, xi = x - s * 1.6
    const r = rect(Math.min(x, xi), Math.max(x, xi), TY0, TY1)
    cbox(stone, r, 0, 40.0, { b: 0.3 })
    const ym = (TY0 + TY1) / 2
    for (const xx of [x, xi]) tf(stone, [xx, TY0 + 0.6, 40.0], [xx, TY1 - 0.6, 40.0], [xx, ym, 45], [s * (xx === x ? 1 : -1), 0, 0])
    for (const [y0, y1] of [[TY0 + 0.6, ym], [TY1 - 0.6, ym]]) {
      qf(stone, [x, y0, 40.0], [x, y1, 45], [xi, y1, 45], [xi, y0, 40.0], [0, y0 < ym ? -5 : 5, 10])
    }
    roundWin(win, side, x, ym, 29.0, 5.4, 16, 0.06)
    // The porch: three round arches, a flat roof.
    const px0 = side === 'e' ? TX1 : -36.4, px1 = side === 'e' ? 36.5 : TX0
    const pr = rect(px0, px1, -3.3, 12.7)
    cbox(stone, pr, 0, 12, { b: 0.35, top: stone })
    const at = side === 'e' ? pr.x1 : pr.x0
    for (const c of [ym - 4.2, ym, ym + 4.2]) roundArch(shade, side, at, c - 1.6, c + 1.6, 2.0, 9.5, 0.04)
    for (const c of [ym - 6.5, ym + 6.5]) roundArch(win, side, x, c - 0.9, c + 0.9, 16, 21)
  }
  // Four turrets round the crossing, with small stone domes.
  for (const [x, y] of [[-17.9, -9.5], [18.3, -9.3], [-18.0, 18.6], [18.4, 18.6]] as XY[]) {
    cbox(stone, rect(x - 3.0, x + 3.0, y - 3.2, y + 3.2), 0, 38.5, { b: 0.3, top: stone })
    lathe(stone, x, y, [[2.5, 38.5], [2.3, 39.6], [1.6, 40.6], [0, 41.3]], 10, false)
  }

  // ---- The Trinity Dome: drum, arcade of windows, blue dome, lantern.
  {
    const [cx, cy] = DC
    drum(stone, cx, cy, 15.4, EAVE - 1, 47.6, 16)
    drumWindows(win, cx, cy, 15.4, 16, 2.6, 40.0, 46.4)
    // A cornice ring stepping in to the dome.
    const ring0 = ngon(cx, cy, 15.9, 16, 47.6), ring1 = ngon(cx, cy, 15.9, 16, 48.6), ring2 = ngon(cx, cy, 12.8, 16, 48.6)
    stone.loft([ring0, ring1])
    for (let k = 0; k < 16; k++) {
      const l = (k + 1) % 16
      stone.quad(ring2[k], ring1[k], ring1[l], ring2[l])
    }
    // Underside of the overhang.
    for (let k = 0; k < 16; k++) {
      const l = (k + 1) % 16, a = ngon(cx, cy, 15.4, 16, 47.6), b = ring0
      stone.quad(a[l], b[l], b[k], a[k])
    }
    // The dome: a slightly flattened hemisphere, r 12.4, rising 10.5 m to
    // the lantern, with the gilded band round its foot.
    const R = 12.4, RISE = 10.5, Z0 = 48.6, LR = 2.1
    const at = (deg: number): [number, number] => [R * Math.cos((deg * Math.PI) / 180), Z0 + RISE * Math.sin((deg * Math.PI) / 180)]
    const band = (Math.asin(1.4 / RISE) * 180) / Math.PI
    lathe(gold, cx, cy, [[R, Z0], at(band)], 16, false)
    const tLantern = (Math.acos(LR / R) * 180) / Math.PI
    const prof: [number, number][] = [at(band), at(22), at(36), at(50), at(63), [LR, Z0 + RISE * Math.sin((tLantern * Math.PI) / 180)]]
    lathe(blue, cx, cy, prof, 16, false)
    // Lantern: a stone drum with a gilded cap and finial.
    const lz = prof[prof.length - 1][1]
    drum(stone, cx, cy, 2.1, lz - 0.3, lz + 5.5, 10)
    lathe(gold, cx, cy, [[2.35, lz + 5.5], [2.0, lz + 6.8], [1.0, lz + 7.8], [0.35, lz + 8.2], [0.3, 70.0], [0, 72.0]], 10, false)
  }

  // ---- North end: wings, round chapels, apse.
  const NW: XY[] = [[-26.0,15.3],[-14.9,15.1],[-14.9,56.8],[-17.2,56.7],[-20.4,55.4],[-22.2,53.8],[-23.7,51.1],[-24.1,48.8],[-24.0,47.4],[-22.5,43.7],[-19.5,41.0],[-15.7,39.7],[-15.7,39.2],[-23.4,39.3],[-23.5,34.5],[-27.0,34.6],[-29.7,37.3],[-29.7,37.9],[-38.6,38.1],[-38.6,37.4],[-41.6,34.4],[-42.1,34.4],[-42.1,33.7],[-43.8,33.4],[-45.2,32.3],[-45.9,30.7],[-45.9,29.6],[-45.3,27.1],[-44.0,26.2],[-42.7,26.0],[-42.6,24.9],[-42.0,24.9],[-39.3,22.2],[-39.1,21.4],[-29.0,21.9],[-29.0,22.5],[-27.2,25.1],[-23.6,25.1],[-23.7,19.6],[-26.0,19.7]]
  const NE: XY[] = [[15.5,15.1],[26.8,15.4],[26.9,20.1],[24.1,20.1],[24.1,25.1],[24.6,25.6],[27.0,25.5],[30.0,22.7],[30.0,22.1],[38.7,22.1],[38.7,22.5],[41.5,25.5],[42.2,25.5],[42.2,26.5],[43.8,26.7],[45.2,27.6],[46.0,29.0],[46.2,30.6],[45.2,32.6],[43.8,33.4],[42.2,33.6],[42.2,34.4],[41.8,34.4],[38.8,37.5],[38.8,38.0],[29.9,38.0],[29.9,37.5],[27.1,34.5],[24.5,34.5],[24.2,34.8],[24.2,39.2],[16.0,39.2],[16.0,40.3],[17.3,40.5],[19.7,41.4],[22.6,43.9],[24.1,47.4],[24.2,49.6],[23.9,51.4],[22.3,54.1],[20.5,55.6],[18.4,56.5],[15.5,56.8]]
  for (const w of [NW, NE]) {
    wallsPoly(stone, w, 0, 14)
    capPoly(stone, w, 14, true)
  }
  // The round chapels at the north corners, stone domes on drums, each
  // with a small round porch under a tiled cone on its outer side.
  for (const [x, y, sx] of [[-35.4, 30.1, -1], [34.1, 30.0, 1]] as Array<[number, number, number]>) {
    drum(stone, x, y, 6.3, 0, 15, 14)
    lathe(stone, x, y, [[6.0, 15], [5.4, 17.0], [3.6, 18.7], [0, 19.6]], 14, false)
    const px = x + sx * 8.4
    drum(stone, px, y, 3.8, 0, 12, 12)
    lathe(tile, px, y, [[4.0, 12], [3.0, 13.2], [1.4, 14.2], [0, 14.6]], 12, false)
    for (const k of [0, 2, 4, 6, 8, 10]) {
      const a = (2 * Math.PI * (k + 1)) / 12, c = Math.cos(a), sn = Math.sin(a), r = 3.8 * Math.cos(Math.PI / 12) + 0.05
      if (c * sx < -0.2) continue
      const P = (u: number, z: number): V3 => [px + c * r - sn * u, y + sn * r + c * u, z]
      qf(win, P(-0.55, 8.2), P(0.55, 8.2), P(0.55, 10.4), P(-0.55, 10.4), [c, sn, 0])
      tf(win, P(-0.55, 10.4), P(0.55, 10.4), P(0, 10.95), [c, sn, 0])
    }
  }
  // The tall round bays either side of the north arm, under tiled cones.
  for (const [x, y] of [[-16.0, 48.4], [16.4, 48.5]] as XY[]) {
    drum(stone, x, y, 8.0, 0, 26, 14)
    lathe(tile, x, y, [[8.3, 26], [6.6, 27.8], [3.6, 29.4], [0, 30.2]], 14, false)
  }
  // The north apse: a drum r 7.9 with a tiled cone-dome.
  drum(stone, 0, 64.4, 7.9, 0, 27, 14)
  lathe(tile, 0, 64.4, [[8.2, 27], [7.2, 29.4], [4.4, 31.4], [0, 32.4]], 14, false)
  for (const a of [60, 90, 120]) {
    const t = (a * Math.PI) / 180, c = Math.cos(t), s = Math.sin(t), r = 7.9 * Math.cos(Math.PI / 14) + 0.05
    const P = (u: number, z: number): V3 => [c * r - s * u, 64.4 + s * r + c * u, z]
    const n3: V3 = [c, s, 0]
    qf(win, P(-1.1, 15), P(1.1, 15), P(1.1, 22.5), P(-1.1, 22.5), n3)
    tf(win, P(-1.1, 22.5), P(1.1, 22.5), P(0, 23.6), n3)
  }

  // ---- The Knights' Tower: a slender square shaft, two open belfry
  // stages and a top stage, each a recessed core behind stone piers, then
  // a blue tiled spire with a gilded tip.
  {
    const cx = -31.0, cy = -55.1
    const shaft = rect(cx - 4.6, cx + 4.6, cy - 4.9, cy + 4.9)
    cbox(stone, shaft, 0, 51.8, { c: 0.3, top: stone })
    cbox(stone, grow(shaft, 0.3), 51.8, 52.8, { b: 0.25, bottom: true })
    roundArch(win, 's', shaft.y0, cx - 1.2, cx - 0.2, 42.5, 46.0)
    roundArch(win, 's', shaft.y0, cx + 0.2, cx + 1.2, 42.5, 46.0)
    /**
     * An open stage: a dark core set 0.6 m back, stone corner piers and a
     * centre mullion on each face (so two tall openings a face), stone bands
     * between tiers, and round heads made of stone spandrels on the core.
     */
    const stage = (r: Rect2, z0: number, z1: number, tiers: Array<[number, number]>, corner: number) => {
      const inset = 0.6
      // The core reads dark through the openings, as the belfry does.
      cbox(win, grow(r, -inset), z0, z1, { top: false })
      for (const [x, y] of [[r.x0, r.y0], [r.x1 - corner, r.y0], [r.x1 - corner, r.y1 - corner], [r.x0, r.y1 - corner]]) {
        cbox(stone, rect(x, x + corner, y, y + corner), z0, z1, { top: false })
      }
      const xm = (r.x0 + r.x1) / 2, ym = (r.y0 + r.y1) / 2
      cbox(stone, rect(xm - 0.45, xm + 0.45, r.y0, r.y1), z0, z1, { top: false })
      cbox(stone, rect(r.x0, r.x1, ym - 0.45, ym + 0.45), z0, z1, { top: false })
      // Solid bands below, between and above the tiers.
      let z = z0
      for (const [t0, t1] of tiers) { if (t0 > z) cbox(stone, r, z, t0, { top: false }); z = t1 }
      if (z1 > z) cbox(stone, r, z, z1, { top: false })
      // Round heads: spandrels on the core plane over each opening.
      const faces: Array<[Side, number, number, number]> = [
        ['s', r.y0 + inset, r.x0 + corner, r.x1 - corner], ['n', r.y1 - inset, r.x0 + corner, r.x1 - corner],
        ['w', r.x0 + inset, r.y0 + corner, r.y1 - corner], ['e', r.x1 - inset, r.y0 + corner, r.y1 - corner],
      ]
      for (const [side, at, a0, a1] of faces) {
        const am = (a0 + a1) / 2
        for (const [o0, o1] of [[a0, am - 0.45], [am + 0.45, a1]]) {
          for (const [, t1] of tiers) {
            const hr = (o1 - o0) / 2, mid = (o0 + o1) / 2, sp = t1 - hr
            const n: V3 = side === 's' ? [0, -1, 0] : side === 'n' ? [0, 1, 0] : side === 'w' ? [-1, 0, 0] : [1, 0, 0]
            const P = (a: number, zz: number): V3 => (side === 's' || side === 'n' ? [a, at + n[1] * 0.04, zz] : [at + n[0] * 0.04, a, zz])
            for (let k = 0; k < 4; k++) {
              const ta = (Math.PI * k) / 8, tb = (Math.PI * (k + 1)) / 8
              tf(stone, P(o1, t1), P(mid + hr * Math.cos(ta), sp + hr * Math.sin(ta)), P(mid + hr * Math.cos(tb), sp + hr * Math.sin(tb)), n)
              tf(stone, P(o0, t1), P(mid - hr * Math.cos(ta), sp + hr * Math.sin(ta)), P(mid - hr * Math.cos(tb), sp + hr * Math.sin(tb)), n)
            }
          }
        }
      }
    }
    type Rect2 = ReturnType<typeof rect>
    const bel = rect(cx - 4.1, cx + 4.1, cy - 4.4, cy + 4.4)
    stage(bel, 52.8, 67.6, [[53.6, 59.0], [60.8, 66.6]], 1.2)
    cbox(stone, grow(bel, 0.3), 67.6, 68.8, { b: 0.25, bottom: true, top: stone })
    const top = rect(cx - 3.0, cx + 3.0, cy - 3.2, cy + 3.2)
    stage(top, 68.8, 80.6, [[70.6, 78.2]], 0.9)
    cbox(stone, grow(top, 0.3), 80.6, 81.6, { b: 0.25, bottom: true, top: stone })
    // A short octagonal drum, then the tall tapering blue spire.
    ngonPrism(stone, cx, cy, 2.6, 8, 81.6, 83.0, { top: false })
    const base = ngon(cx, cy, 2.6, 8, 83.0), mid = ngon(cx, cy, 0.45, 8, 94.0)
    blue.loft([base, mid])
    spire(gold, mid, [cx, cy, 100.3])
  }

  return [
    { part: stone, material: PALETTE.stone },
    { part: tile, material: PALETTE.terracotta },
    { part: win, material: PALETTE.window },
    // The great arch's recess and the porches: a shade of the stone.
    { part: shade, material: finish('shrine-recess', 0xcac0b1) },
    // The Trinity Dome's and the spire's blue tile, pulled to the palette's lightness.
    { part: blue, material: finish('shrine-blue-tile', 0x4f6a9a) },
    { part: gold, material: finish('shrine-gold', 0xd2b062) },
  ]
}

if (import.meta.main) {
  await save('dc-national-shrine', 'Basilica of the National Shrine of the Immaculate Conception', build(), {
    source: 'generators/dc-national-shrine.ts',
  })
}
