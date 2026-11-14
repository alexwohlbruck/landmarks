/**
 * Altes Rathaus, Marienplatz, Munich: Jörg von Halsbach, 1470-80, on the
 * site of the older town hall; the tower is the Talburgtor of the first
 * town wall, rebuilt 1971-74 to its Gothic form of 1493. Original
 * procedural geometry, CC0-1.0.
 * bun generators/munich-altes-rathaus.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = area centroid of the OSM outline way/4054817,
 * 48.136825, 11.577061. The hall's walls run at 43 / 133 degrees, so the
 * catalog bearing is 43: +x is the east gable on the Tal, -x the west gable
 * on Marienplatz, -y the tower side (south-west).
 *
 * Identity, in order: the pale Gothic hall with a stepped gable at each
 * end, its strips rising in steps above the steep red tile roof, each
 * gable with a green-spired turret at its apex and two corbelled corner
 * turrets with green spires; three big round-arched hall windows over two
 * open passage arches in each gable; the white tower over the Tal arch with
 * its blue clock, a red hipped roof with four corner turrets with green
 * spires and copper-hooded dormers, the open octagonal belfry and the tall
 * red spire with a gilt ball.
 *
 * Evidence:
 *  - plan: OSM outline way/4054817 (and building relation 15091588), read
 *    in the turned frame: the hall 869099325 (x -15.0..16.1, y -17.9..3.5),
 *    the rear wing 869099324 (y to 15.5, 23 m, roof across), the tower
 *    291585566 (6.9 x 8.3 m, 40 m with an 8 m roof), the belfry 291585572
 *    (32-48 m, octagonal) and its roof 291585569 (48-56 m).
 *  - heights: tower 56 m (de.wikipedia, Altes Rathaus (München): "den 56
 *    Meter hohen Rathausturm"). The rest scaled from Thomas Wolf's two
 *    straight-on gable photos (hall gable 21.4 m wide from OSM: 0.045 and
 *    0.032 m per px; the tower from its own 56 m): hall eave 16.6, roof
 *    ridge 29.5, top gable step 31.3, west apex spire 42, east 38, corner
 *    turrets 13.2-19.6 with spires to 28.4; tower shaft to 29.2, clock at
 *    26.4 (r 1.9), roof to 36.9, belfry to 42.2 (Royan's photos from above), corner
 *    turret spires to 40.8, spire to 55.2, ball.
 *  - The tower is drawn 10.4 m square, wider than OSM's 6.9 x 8.3 m part:
 *    in both of Wolf's photos the tower's face is 1/5.3 of its 56 m
 *    height, about 10.5 m. Doubt noted below.
 *  - colours from the daylight photos: pale grey plaster with painted
 *    ashlar (drawn plain), red tiles, blue-green copper spires, gilt ball,
 *    the tower's blue clock dial (drawn `window`); the open passages and
 *    the belfry openings in `window`, as they are lit at night (Wolf's
 *    dusk photo of the east side).
 *  - elevation 0. No lidar in Germany; no 3D city models.
 *
 * Photos (Wikimedia Commons, all evidence):
 *  - Altes_Rathaus_München_Westseite.jpg (Thomas Wolf, CC0): the west
 *    gable and the tower from Marienplatz.
 *  - Altes_Rathaus_München_Ostseite.jpg (Thomas Wolf, www.foto-tw.de,
 *    CC BY-SA 3.0 de): the east gable and the tower from the Tal.
 *  - Munich_-_View_from_Alter_Peter_tower_-_8249.jpg and _-_8227.jpg (Jorge
 *    Royan, CC BY-SA 3.0): the tower's roof, dormers, turrets and belfry
 *    from above.
 *  - Altes_Rathaus_Munich_01.jpg (Flocci Nivis, CC BY 4.0).
 * No commercial imagery. No look-only sources.
 *
 * Left out: the painted ashlar lines, the tower's painted coat of arms and
 * frieze, the statues and niches of the gables, the sundial, the passage
 * vaults (the passages are drawn as arches on the gables).
 *
 * Doubts: the tower's footprint (see above); the rear wing and the long
 * sides are seen only in passing; the rear wing's roof is simplified.
 *
 * Uses the kit in munich-frauenkirche.ts.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { save, rect, lathe, walls, cap, along, archOn, bbox, face, ngon, rectOn, ball, sidesOf, segsOf, post, band, clock, type XY } from './munich-frauenkirche'
import { gableRoof, column } from './amsterdam-westerkerk'

function build() {
  const plaster = new Part(), tile = new Part(), copper = new Part(), win = new Part(), gold = new Part()

  // ------------------------------------------------------------- the hall
  const X0 = -15.0, X1 = 16.1, Y0 = -17.9, Y1 = 3.5, EAVE = 16.6, RIDGE = 29.5, TOP = 31.3
  const YC = (Y0 + Y1) / 2, HW = (Y1 - Y0) / 2
  walls(plaster, rect(X0, Y0, X1, Y1), 0, EAVE)
  bbox(plaster, null, X0 - 0.25, Y0 - 0.25, X1 + 0.25, Y1 + 0.25, EAVE - 0.6, EAVE, 0.15)
  gableRoof(tile, plaster, X0, Y0, X1, Y1, EAVE, RIDGE, true, 0.4, -0.2)
  const zr = (d: number) => RIDGE - (Math.abs(d) * (RIDGE - EAVE)) / HW
  // The rear wing (north-east side), gabled along the hall.
  walls(plaster, [[X1, Y1], [X1, 15.5], [X0, 15.3], [X0, Y1]], 0, 15.0)
  gableRoof(tile, plaster, X0, Y1, X1, 15.4, 15.0, 22.6, true, 0.35, 0)

  // The stepped gables, west and east.
  const gable = (x: number, out: number, spireTop: number) => {
    // Seven strips a side plus the centre, each a 3D slab topped by a small
    // pinnacle, the tops stepping up with the roof.
    const N = 6, w = HW / (N + 0.5)
    const strip = (y0: number, y1: number, zt: number) => {
      bbox(plaster, plaster, Math.min(x - out * 0.2, x + out * 0.75), y0 + 0.14, Math.max(x - out * 0.2, x + out * 0.75), y1 - 0.14, EAVE - 0.6, zt, 0.08)
      // the wall between the strips, a little lower
      bbox(plaster, plaster, Math.min(x - out * 0.4, x), y0, Math.max(x - out * 0.4, x), y1, EAVE - 0.6, zt - 0.9, 0.05)
      post(plaster, plaster, x + out * 0.1, (y0 + y1) / 2, Math.min(0.32, (y1 - y0) / 3), zt, zt + 0.35, 0, 0.9)
    }
    for (let k = 0; k < N; k++) {
      const d1 = HW - k * w, d0 = HW - (k + 1) * w
      const zt = zr(d0) + 1.6
      strip(YC - d1, YC - d0, zt)
      strip(YC + d0, YC + d1, zt)
    }
    strip(YC - w / 2, YC + w / 2, TOP)
    // Apex turret: octagonal, copper, with a tall spire.
    const cx = x + out * 0.2
    lathe(copper, cx, YC, [[0.95, TOP + 0.2], [0.95, TOP + 3.0], [1.05, TOP + 3.1], [0, TOP + 3.1]], 8, Math.PI / 8)
    lathe(copper, cx, YC, [[1.05, TOP + 3.1], [0, spireTop]], 8, Math.PI / 8)
    ball(copper, cx, YC, spireTop + 0.2, 0.2, 6)
    // The gable face: three hall windows, two passage arches, two small
    // windows high up.
    const a: XY = out < 0 ? [x, Y1] : [x, Y0], b: XY = out < 0 ? [x, Y0] : [x, Y1]
    const s = (d: number) => HW + (out < 0 ? -d : d) // d: offset from the centre toward +y
    archOn(win, a, b, s(0), 1.4, 7.0, 12.4, 0.06, 8)
    archOn(win, a, b, s(-6.2), 1.15, 7.3, 12.0, 0.06, 8)
    archOn(win, a, b, s(6.2), 1.15, 7.3, 12.0, 0.06, 8)
    for (const d of [-2.3, 2.3]) rectOn(win, a, b, s(d), 0.45, 21.3, 22.8, 0.06)
    for (const d of [-6.5, 3.8]) {
      archOn(plaster, a, b, s(d), 2.55, 0, 2.4, 0.04, 8)
      archOn(win, a, b, s(d), 2.2, 0, 2.4, 0.08, 8)
    }
    // Corner turrets, corbelled out at the eave, with green spires.
    for (const y of [Y0, Y1]) {
      const cy = y + (y < YC ? -0.15 : 0.15), tx = x + out * 0.15
      lathe(plaster, tx, cy, [[0.12, EAVE - 3.4], [0.82, EAVE - 2.0], [0.82, 19.6], [0.95, 19.75], [0, 19.75]], 8, Math.PI / 8)
      for (let i = 0; i < 4; i++) {
        const t = (i * Math.PI) / 2 + Math.PI / 4 * (out < 0 ? 1 : 1)
        const p0: XY = [tx + 0.81 * Math.cos(t - 0.35), cy + 0.81 * Math.sin(t - 0.35)], p1: XY = [tx + 0.81 * Math.cos(t + 0.35), cy + 0.81 * Math.sin(t + 0.35)]
        archOn(win, p0, p1, along(p0, p1).L / 2, 0.18, 17.4, 18.6, 0.04, 4)
      }
      lathe(copper, tx, cy, [[0.95, 19.7], [0.72, 21.0], [0, 28.4]], 8, Math.PI / 8)
      ball(copper, tx, cy, 28.55, 0.15, 6)
    }
  }
  gable(X0, -1, 42.0)
  gable(X1, 1, 38.2)
  // Long sides: tall arched hall windows over small ones.
  const S = sidesOf(rect(X0, Y0, X1, Y1))
  for (const k of [0, 1, 2, 3, 4, 5]) {
    const x = X0 + 3.5 + k * 4.8
    for (const side of ['S', 'N'] as const) {
      if (side === 'S' && x > -5.2 && x < 6.5) continue
      if (side === 'N') continue
      const [a, b] = S[side], s = x - X0
      archOn(win, a, b, s, 0.75, 8.0, 13.2, 0.06, 6)
      rectOn(win, a, b, s, 0.55, 3.0, 4.6, 0.06)
    }
  }
  // the rear wing's outer side
  for (let k = 0; k < 7; k++) {
    const x = X0 + 2.5 + k * 4.35
    const a: XY = [X1, 15.5], b: XY = [X0, 15.3]
    for (const z of [3.0, 7.0, 11.0]) rectOn(win, a, b, X1 - x, 0.55, z, z + 1.6, 0.06)
  }

  // ------------------------------------------------------------- the tower
  const TX = 0.65, TY = -22.05, H = 5.2, ZS = 29.2
  const shaft = rect(TX - H, TY - H, TX + H, TY + H)
  walls(plaster, shaft, 0, ZS)
  bbox(plaster, plaster, TX - H - 0.35, TY - H - 0.35, TX + H + 0.35, TY + H + 0.35, ZS - 0.5, ZS + 0.4, 0.15)
  bbox(plaster, null, TX - H - 0.12, TY - H - 0.12, TX + H + 0.12, TY + H + 0.12, 3.6, 4.0, 0.05)
  const F = sidesOf(shaft)
  for (const k of ['W', 'E', 'S', 'N'] as const) {
    const [a, b] = F[k]
    if (k === 'W' || k === 'E') {
      // the Tal passage
      archOn(plaster, a, b, H, 2.75, 0, 3.0, 0.04, 8)
      archOn(win, a, b, H, 2.35, 0, 3.0, 0.08, 8)
    }
    if (k !== 'N') clock(gold, win, gold, a, b, H, 26.1, 1.9, 2.4, 0.5)
    for (const z of [9.4, 13.8, 18.2, 22.6]) for (const d of [-2.1, 2.1]) {
      rectOn(copper, a, b, H + d, 0.62, z - 0.12, z + 1.72, 0.04)
      rectOn(win, a, b, H + d, 0.45, z, z + 1.6, 0.07)
    }
  }
  // The roof: a flared hip from the cornice to the belfry, tile.
  const R0 = H + 0.45, R1 = 3.6, R2 = 2.45, Z1 = 32.6, Z2 = 36.9
  const sq = (h: number, z: number): V3[] => [[TX - h, TY - h, z], [TX + h, TY - h, z], [TX + h, TY + h, z], [TX - h, TY + h, z]]
  const ring0 = sq(R0, ZS + 0.4), ring1 = sq(R1, Z1), ring2 = sq(R2, Z2)
  for (const [lo, hi] of [[ring0, ring1], [ring1, ring2]]) {
    for (let i = 0; i < 4; i++) {
      const j = (i + 1) % 4, mx = (lo[i][0] + lo[j][0]) / 2 - TX, my = (lo[i][1] + lo[j][1]) / 2 - TY
      face(tile, [lo[i], lo[j], hi[j], hi[i]], [mx, my, 1.2])
    }
  }
  cap(tile, ring2.map((p) => [p[0], p[1]] as XY), Z2)
  // Dormers with copper hoods, one a side.
  for (const [ux, uy] of [[1, 0], [0, 1], [-1, 0], [0, -1]]) {
    const vx = -uy, vy = ux, w = 0.7, f = 4.6, back = 3.1, z0 = 30.4, z1 = 32.4
    const P = (s: number, d: number, z: number): V3 => [TX + ux * d + vx * s, TY + uy * d + vy * s, z]
    face(copper, [P(-w, f, z0), P(w, f, z0), P(w, f, z1), P(-w, f, z1)], [ux, uy, 0])
    face(copper, [P(-w, f, z0), P(-w, back, z0), P(-w, back, z1), P(-w, f, z1)], [-vx, -vy, 0])
    face(copper, [P(w, back, z0), P(w, f, z0), P(w, f, z1), P(w, back, z1)], [vx, vy, 0])
    rectOn(win, [P(-w, f, 0)[0], P(-w, f, 0)[1]], [P(w, f, 0)[0], P(w, f, 0)[1]], w, 0.35, z0 + 0.4, z1 - 0.3, 0.05)
    const apex = P(0, f - 0.3, z1 + 2.3)
    face(copper, [P(-w - 0.1, f + 0.1, z1), P(w + 0.1, f + 0.1, z1), apex], [ux, uy, 0.5])
    face(copper, [P(-w - 0.1, f + 0.1, z1), apex, P(-w - 0.1, back, z1)], [-vx, -vy, 0.5])
    face(copper, [P(w + 0.1, back, z1), apex, P(w + 0.1, f + 0.1, z1)], [vx, vy, 0.5])
  }
  // Corner turrets with green spires.
  for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
    const cx = TX + sx * (H + 0.05), cy = TY + sy * (H + 0.05)
    lathe(plaster, cx, cy, [[0.15, 25.6], [0.95, 27.3], [0.95, 33.3], [1.1, 33.45], [0, 33.45]], 8, Math.PI / 8)
    for (let i = 0; i < 4; i++) {
      const t = (i * Math.PI) / 2
      const p0: XY = [cx + 0.94 * Math.cos(t - 0.36), cy + 0.94 * Math.sin(t - 0.36)], p1: XY = [cx + 0.94 * Math.cos(t + 0.36), cy + 0.94 * Math.sin(t + 0.36)]
      archOn(win, p0, p1, along(p0, p1).L / 2, 0.2, 31.2, 32.4, 0.04, 4)
    }
    lathe(copper, cx, cy, [[1.1, 33.4], [0.85, 34.6], [0, 40.8]], 8, Math.PI / 8)
    ball(gold, cx, cy, 40.95, 0.17, 6)
  }
  // The open octagonal belfry.
  const o = ngon(TX, TY, 2.75, 8)
  band(plaster, o, Z2, Z2 + 0.5, 0.1)
  for (let i = 0; i < 8; i++) {
    const t = Math.PI / 8 + (i * Math.PI) / 4
    post(plaster, plaster, TX + 2.6 * Math.cos(t), TY + 2.6 * Math.sin(t), 0.33, Z2 + 0.5, 41.6, t)
  }
  // Arched heads between the posts and a dark core (the bells).
  segsOf(ngon(TX, TY, 2.62, 8)).forEach(([a, b]) => {
    const { P, n } = along(a, b), L = along(a, b).L
    const pts: V3[] = []
    for (let k = 0; k <= 6; k++) { const t = (k / 6) * Math.PI; pts.push(P(L / 2 - Math.cos(t) * (L / 2 - 0.3), 40.2 + Math.sin(t) * (L / 2 - 0.3), 0.1)) }
    for (let k = 0; k < 6; k++) face(plaster, [pts[k], pts[k + 1], [pts[k + 1][0], pts[k + 1][1], 41.6], [pts[k][0], pts[k][1], 41.6]], [n[0], n[1], 0])
  })
  lathe(win, TX, TY, [[1.4, Z2 + 0.5], [1.4, 41.6], [0, 41.6]], 8, Math.PI / 8)
  band(copper, o, 41.6, 42.2, 0.25)
  // The spire.
  lathe(tile, TX, TY, [[3.15, 42.0], [2.55, 43.2], [1.2, 48.9], [0.15, 55.1], [0, 55.2]], 8, Math.PI / 8)
  column(gold, TX, TY, 55.0, 56.0, 0.05, 4)
  ball(gold, TX, TY, 55.55, 0.3, 8)

  const flood = (p: V3, n: V3) => (n[2] > 0.7 ? 0.25 : 0.85)
  return [
    { part: plaster, material: { ...finish('altes-rathaus-plaster', 0xe6e5e0), floodlight: flood } },
    { part: tile, material: finish('altes-rathaus-tile', 0xc8694a) },
    { part: copper, material: finish('altes-rathaus-copper', 0x5f9c88) },
    { part: win, material: { ...PALETTE.window } },
    { part: gold, material: finish('altes-rathaus-gilt', 0xd8ad45, 0.45) },
  ]
}

if (import.meta.main) await save('munich-altes-rathaus', 'Altes Rathaus', [48.136825, 11.577061], 43, build(), 6500)
