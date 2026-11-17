/**
 * Carpenters' Hall (1770-75, Robert Smith, for the Carpenters' Company of
 * the City and County of Philadelphia; the First Continental Congress met
 * here in 1774), 320 Chestnut Street — original procedural geometry, CC0-1.0.
 * bun generators/phl-carpenters-hall.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = area centroid of the OSM outline way/261314259,
 * 39.948142,-75.147214. Its walls run at 10° / 100°, so the catalog bearing
 * is 10 and the cross is square to this frame: +y is the north front on
 * Carpenters' Court (toward Chestnut Street), -y the south front on
 * Independence Park, ±x the short east and west arms.
 *
 * Identity, in order: a small two-storey Georgian brick hall on a Greek
 * cross plan; the north and south arms ending in full white pediments, the
 * east and west arms in plain gables with a chimney on each; the white
 * octagonal cupola with arched louvres, a grey lead dome, a lantern, a ball
 * and the vane, astride the crossing; on the north front three round-headed
 * windows over little white balustrades, the pedimented doorway between
 * shuttered windows, a white belt course and cornice; on the south front
 * the round louvred oculus in the pediment and the arched door. At night
 * the brick is floodlit and the windows glow.
 *
 * Evidence:
 *  - plan: OSM outline way/261314259 and parts way/335689523 (east-west
 *    arm), 335689524 (north-south arm), 335689522 and 335799889 (cupola).
 *    Turned to 10° the outline is rectilinear: north-south arm 8.8 m wide
 *    and 17.1 m long, east-west arm 8.6 m wide and 15.9 m long. Drawn
 *    symmetric about the crossing (x -0.4, y 0.12); the cupola on the
 *    crossing (OSM puts it 0.4 m west of it).
 *  - heights: HABS PA-1596 (1932, Library of Congress, public domain) sheet
 *    1, north front, scaled from its drawn scale bar (50 px/ft on the 3840 px
 *    scan): ground floor 1.0 m up, belt course 5.75, cornice 9.45-9.8, ridge
 *    and pediment apex 12.6, chimneys 14.0; cupola base 12.6-13.7, louvred
 *    stage to 16.4, cornice 16.6, dome to 17.75 (2.7 m across), lantern to
 *    19.2, ball 20.6, vane 23.5 m; windows: upper sashes 1.04 m wide on
 *    2.62 m centres, sills 6.8, springing 8.5, arch tops 9.0; balustrades
 *    5.85-6.8; lower sashes 1.93-4.1 m with shutters; doorway surround
 *    3.2 m wide with its pediment to 5.2 m. Lidar USGS_LPC_DE_DelawareValley
 *    _HD_2015_LAS_2017 (flown 2015), 0.5 m grid, above the court (~1.0 m
 *    over the box's ground_min): both ridges 12.4-12.6, eaves 10.1, the two
 *    chimneys on the east and west gable ends at 14.4, the cupola's top
 *    return 19.2 m — all agree with HABS. The lidar shows both arms gabled
 *    (the east-west ridge runs out to the gable ends), as OSM tags them.
 *  - colours, from the daylight photos: Flemish-bond red brick with glazed
 *    headers pulled to the palette's lightness (the same brick as the
 *    neighbouring phl- Georgian models); cream trim, shutters, doorcases and
 *    cupola (palette trim); dark grey slate roofs; the grey lead dome;
 *    charcoal louvres.
 *
 * Photos (Wikimedia Commons): Carpenters'_Hall,_Philadelphia,_U.S.,_May_2015
 * .jpg (Pbjamesphoto, CC BY-SA 4.0); CarpentersHall00.jpg and
 * CarpentersHall01.jpg (Davidt8, public domain); Carpenters'_Hall_from_front
 * .jpg (Beyond My Ken, CC BY-SA 4.0); Carpenters'_Hall,_2016.jpg and _2016_2
 * .jpg (xiquinhosilva, CC BY 2.0); Carpenters'_Hall_(53586569876).jpg
 * (ajay_suresh, CC BY 2.0); Carpenter's_Hall,_Philadelphia.jpg (Bestbudbrian,
 * CC BY-SA 4.0; the south front); Philadelphia_-_Carpenters_Hall_-
 * _20241031180131.jpg (Nikanavi, CC BY-SA 4.0); Carpenters'_Hall_Lights_of
 * _Liberty.jpg (Ben Franske, CC BY-SA 4.0; night). HABS PA-1596 sheet 1
 * (public domain). No commercial imagery.
 *
 * Left out: the lettering and arms in the north pediment, the balusters
 * (the balconettes are plain white panels), sash bars, the shutters' panels,
 * keystones, the stone steps and the basement grilles, the vane's figure.
 *
 * Doubts: the east and west gable ends are not photographed in the open
 * set; each is given one window per storey, centred, and a plain raking
 * cornice. The south front's door is drawn as the photo's round-arched
 * doorway with its fanlight.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cap, lathe, rect, save, walls, type XY } from './chi-aon-center'
import { archOn, bbox, discOn, face, floodWalls, ngon, pedimentOn, rectOn } from './phl-independence-hall'

type Seg = [XY, XY]

/** A ring pushed out by d (right-angled corners, convex or reflex). */
function grow(r: XY[], d: number): XY[] {
  const n = r.length
  return r.map((c, i) => {
    const a = r[(i - 1 + n) % n], b = r[(i + 1) % n]
    const l1 = Math.hypot(c[0] - a[0], c[1] - a[1]), l2 = Math.hypot(b[0] - c[0], b[1] - c[1])
    const n1: XY = [(c[1] - a[1]) / l1, -(c[0] - a[0]) / l1], n2: XY = [(b[1] - c[1]) / l2, -(b[0] - c[0]) / l2]
    return [c[0] + d * (n1[0] + n2[0]), c[1] + d * (n1[1] + n2[1])] as XY
  })
}

/** A horizontal band round ring r, from z0 to z1, d proud, with its soffit and top. */
function band(p: Part, r: XY[], z0: number, z1: number, d: number, top = true) {
  const o = grow(r, d), n = r.length
  walls(p, o, z0, z1)
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    face(p, [[r[i][0], r[i][1], z0], [r[j][0], r[j][1], z0], [o[j][0], o[j][1], z0], [o[i][0], o[i][1], z0]], [0, 0, -1])
    if (top) face(p, [[r[i][0], r[i][1], z1], [r[j][0], r[j][1], z1], [o[j][0], o[j][1], z1], [o[i][0], o[i][1], z1]], [0, 0, 1])
  }
}

function build() {
  const brick = new Part(), trim = new Part(), roof = new Part(), win = new Part(), dark = new Part(), lead = new Part()

  const CX = -0.4, CY = 0.12
  const NW = 4.42, NL = 8.55 // north-south arm: half-width, half-length
  const EW = 4.28, EL = 7.96 // east-west arm
  const WALL = 9.45, CORN = 9.8, RIDGE = 12.6, O = 0.32
  const x = (v: number) => CX + v, y = (v: number) => CY + v
  // The cross, counter-clockwise from the south arm's south-west corner.
  const ring: XY[] = [
    [x(-NW), y(-NL)], [x(NW), y(-NL)], [x(NW), y(-EW)], [x(EL), y(-EW)], [x(EL), y(EW)], [x(NW), y(EW)],
    [x(NW), y(NL)], [x(-NW), y(NL)], [x(-NW), y(EW)], [x(-EL), y(EW)], [x(-EL), y(-EW)], [x(-NW), y(-EW)],
  ]
  walls(brick, ring, 0, WALL)
  band(brick, ring, 0, 0.9, 0.06) // brick base
  band(trim, ring, 0.9, 1.05, 0.08) // stone water table at the floor line
  band(trim, ring, 5.6, 5.85, 0.07) // belt course
  band(trim, ring, WALL, CORN, O) // cornice

  // Roofs: two slate gables crossing, ridges at 12.6 m.
  const nsY = NL + O, ewX = EL + O
  face(roof, [[x(NW + O), y(-nsY), CORN], [x(NW + O), y(nsY), CORN], [x(0), y(nsY), RIDGE], [x(0), y(-nsY), RIDGE]], [1, 0, 1.5])
  face(roof, [[x(-NW - O), y(nsY), CORN], [x(-NW - O), y(-nsY), CORN], [x(0), y(-nsY), RIDGE], [x(0), y(nsY), RIDGE]], [-1, 0, 1.5])
  face(roof, [[x(ewX), y(EW + O), CORN], [x(-ewX), y(EW + O), CORN], [x(-ewX), y(0), RIDGE], [x(ewX), y(0), RIDGE]], [0, 1, 1.5])
  face(roof, [[x(-ewX), y(-EW - O), CORN], [x(ewX), y(-EW - O), CORN], [x(ewX), y(0), RIDGE], [x(-ewX), y(0), RIDGE]], [0, -1, 1.5])
  // Gable walls and the soffits of the roof's overhang past them.
  for (const s of [-1, 1]) {
    face(brick, [[x(-NW), y(s * NL), CORN], [x(NW), y(s * NL), CORN], [x(0), y(s * NL), RIDGE - 0.25]], [0, s, 0])
    face(brick, [[x(s * EL), y(-EW), CORN], [x(s * EL), y(EW), CORN], [x(s * EL), y(0), RIDGE - 0.25]], [s, 0, 0])
    face(roof, [[x(-NW - O), y(s * NL), CORN], [x(NW + O), y(s * NL), CORN], [x(NW + O), y(s * nsY), CORN], [x(-NW - O), y(s * nsY), CORN]], [0, 0, -1])
  }
  // Raking cornices: white bands up the four gables; the north and south
  // ones over a full pediment (the horizontal cornice runs across below).
  const rake = (P: (u: number, z: number, w: number) => V3, half: number, out: V3) => {
    for (const s of [-1, 1]) {
      const a = P(s * (half + O), CORN - 0.05, 0), b = P(0, RIDGE + 0.06, 0), c = P(0, RIDGE - 0.4, 0), d = P(s * (half + O - 0.6), CORN - 0.05, 0)
      face(trim, [a, b, c, d], out)
      const a2 = P(s * (half + O), CORN - 0.05, -O), b2 = P(0, RIDGE + 0.06, -O)
      face(trim, [a, b, b2, a2], out[1] !== 0 ? [s * 2.8, 0, half + O] : [0, s * 2.8, half + O])
    }
  }
  for (const s of [-1, 1]) {
    rake((u, z, w) => [x(u), y(s * (nsY + 0.02) + s * w), z], NW, [0, s, 0])
    rake((u, z, w) => [x(s * (ewX + 0.02) + s * w), y(u), z], EW, [s, 0, 0])
  }
  // Chimneys on the east and west gable ends, astride the ridge.
  for (const s of [-1, 1]) bbox(brick, dark, x(s * (EL - 0.55)) - 0.48, y(-0.5), x(s * (EL - 0.55)) + 0.48, y(0.5), RIDGE - 1.2, 14.4, 0.08)

  // ---------------------------------------------------------- the cupola
  {
    const cx = x(0), cy = y(0)
    const R8 = (f: number) => f / Math.cos(Math.PI / 8), a8 = Math.PI / 8
    // Square base astride the ridges.
    bbox(trim, trim, cx - 1.6, cy - 1.6, cx + 1.6, cy + 1.6, RIDGE - 1.0, 13.7, 0.08)
    const oct = ngon(cx, cy, R8(1.45), 8)
    walls(trim, oct, 13.7, 16.35)
    for (let k = 0; k < 8; k++) {
      const a = oct[k], b = oct[(k + 1) % 8], L = Math.hypot(b[0] - a[0], b[1] - a[1])
      archOn(dark, a, b, L / 2, 0.36, 14.05, 15.55, 0.04, 8)
    }
    const ent = ngon(cx, cy, R8(1.72), 8)
    walls(trim, ent, 16.35, 16.65)
    face(trim, ent.map(([u, v]) => [u, v, 16.35] as V3), [0, 0, -1])
    cap(trim, ent, 16.65)
    // Lead dome, its lantern, the ball and the vane.
    lathe(lead, cx, cy, [[1.38, 16.65], [1.34, 16.85], [1.22, 17.15], [1.0, 17.45], [0.68, 17.68], [0.45, 17.76]], 16)
    const lan = ngon(cx, cy, R8(0.5), 8)
    walls(trim, lan, 17.7, 18.85)
    for (let k = 0; k < 8; k += 2) rectOn(dark, lan[k], lan[(k + 1) % 8], R8(0.5) * Math.sin(a8), 0.13, 17.95, 18.6, 0.03)
    lathe(lead, cx, cy, [[R8(0.62), 18.85], [R8(0.62), 19.0], [R8(0.4), 19.15], [0.12, 19.6], [0.07, 20.25], [0, 20.3]], 8, a8)
    lathe(lead, cx, cy, [[0, 20.25], [0.2, 20.35], [0.26, 20.55], [0.2, 20.75], [0, 20.85]], 8)
    lathe(dark, cx, cy, [[0.05, 20.8], [0.04, 23.5], [0, 23.52]], 6)
    const vane: V3[] = [[cx - 0.7, cy, 22.4], [cx + 0.75, cy, 22.4], [cx + 0.75, cy, 22.8], [cx - 0.7, cy, 22.8]]
    face(dark, vane, [0, -1, 0])
    face(dark, vane, [0, 1, 0])
  }

  // ---------------------------------------------------------- facades
  const sash = (s: Seg, c: number, hw: number, z0: number, z1: number, f = 0.14) => {
    rectOn(trim, s[0], s[1], c, hw + f, z0 - f, z1 + f, 0.04)
    rectOn(win, s[0], s[1], c, hw, z0, z1, 0.08)
  }
  const shuttered = (s: Seg, c: number, hw: number, z0: number, z1: number) => {
    sash(s, c, hw, z0, z1)
    for (const d of [-1, 1]) rectOn(trim, s[0], s[1], c + d * (hw + 0.42), 0.27, z0 - 0.1, z1 + 0.1, 0.06)
  }
  const UP: [number, number] = [6.8, 8.85], LOW: [number, number] = [1.93, 4.1]
  for (const s of [-1, 1]) {
    // North (s = 1) and south fronts of the north-south arm.
    const seg: Seg = s > 0 ? [[x(NW), y(NL)], [x(-NW), y(NL)]] : [[x(-NW), y(-NL)], [x(NW), y(-NL)]]
    const c0 = NW // the wall's middle; c0 - u (north) or c0 + u (south) is u east of it
    for (const u of [-2.62, 0, 2.62]) {
      const c = c0 + (s > 0 ? -u : u)
      if (s > 0) {
        // Round-headed sashes over white balustrades.
        archOn(trim, seg[0], seg[1], c, 0.74, 6.65, 8.45, 0.04)
        archOn(win, seg[0], seg[1], c, 0.52, 6.85, 8.45, 0.08)
        rectOn(trim, seg[0], seg[1], c, 0.74, 5.85, 6.65, 0.1)
      } else sash(seg, c, 0.55, UP[0], UP[1] - 0.15)
    }
    for (const u of [-2.65, 2.65]) shuttered(seg, c0 + u, 0.52, LOW[0], LOW[1])
    if (s > 0) {
      // Pedimented doorway with its fanlight.
      rectOn(trim, seg[0], seg[1], c0, 1.6, 1.0, 4.55, 0.05)
      pedimentOn(trim, seg[0], seg[1], c0, 1.75, 4.55, 5.25, 0.3)
      archOn(win, seg[0], seg[1], c0, 0.72, 3.55, 3.55, 0.09)
      rectOn(dark, seg[0], seg[1], c0, 0.72, 3.5, 3.56, 0.09)
    } else {
      // Round-arched south doorway with a broad fanlight.
      archOn(trim, seg[0], seg[1], c0, 1.25, 1.0, 3.75, 0.05)
      archOn(win, seg[0], seg[1], c0, 1.0, 3.75, 3.75, 0.09)
      // Louvred oculus in the south pediment.
      discOn(trim, seg[0], seg[1], c0, 11.0, 0.62, 0.05, 16)
      discOn(dark, seg[0], seg[1], c0, 11.0, 0.42, 0.09, 16)
    }
    // The east-west arm's faces beside the north-south arm: one window a storey.
    for (const e of [-1, 1]) {
      const xa = e < 0 ? x(-EL) : x(NW), xb = e < 0 ? x(-NW) : x(EL)
      const wseg: Seg = s > 0 ? [[xb, y(EW)], [xa, y(EW)]] : [[xa, y(-EW)], [xb, y(-EW)]]
      const L = xb - xa
      sash(wseg, L / 2, 0.52, UP[0], UP[1])
      shuttered(wseg, L / 2, 0.52, LOW[0], LOW[1])
    }
    // Gable ends of the east-west arm.
    const gseg: Seg = s > 0 ? [[x(EL), y(-EW)], [x(EL), y(EW)]] : [[x(-EL), y(EW)], [x(-EL), y(-EW)]]
    sash(gseg, EW, 0.52, UP[0], UP[1])
    shuttered(gseg, EW, 0.52, LOW[0], LOW[1])
  }

  const cupola = (p: V3, n: V3) => (p[2] > 12.5 ? (n[2] > 0.7 ? 0.3 : 0.9) : floodWalls(p, n))
  return [
    { part: brick, material: { ...finish('ch2-brick', 0xab5c49), floodlight: floodWalls } },
    { part: trim, material: { ...PALETTE.trim, floodlight: cupola } },
    { part: roof, material: finish('ch2-slate', 0x7e8389) },
    { part: win, material: { ...PALETTE.window, color: 0x98a6b1 } },
    { part: dark, material: finish('ch2-louvre', 0x4a4f57) },
    { part: lead, material: finish('ch2-lead', 0x9aa8b3) },
  ]
}

if (import.meta.main) await save('phl-carpenters-hall', "Carpenters' Hall", [39.948142, -75.147214], 10, build(), 5000)
