/**
 * Paulskirche, Paulsplatz, Frankfurt am Main: the oval Lutheran church of
 * 1789-1833 (Andreas Liebhardt, Johann Georg Christian Hess), seat of the
 * 1848 National Assembly, burnt in 1944 and rebuilt 1947-48 with a low
 * dome roof. Original procedural geometry, CC0-1.0.
 * bun generators/frankfurt-paulskirche.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = area centroid of the OSM outline way/11526375,
 * 50.1111930, 8.6807568. The church's short axis (tower to the north
 * wings) runs at 167 degrees, so the catalog bearing is -13: the tower is
 * at -y (south-south-east), the oval's long axis along x.
 *
 * Identity, in order: the red sandstone oval rotunda with two tiers of
 * tall round-arched windows and a heavy cornice; the square tower on its
 * south side in two stages, with a round colonnaded lantern, a green copper
 * dome and a gilt cross; the low pale-green copper dome roof with its
 * central skylight lantern; the two angled wings on the north side.
 *
 * Evidence:
 *  - plan: OSM outline way/11526375 and parts, read in the turned frame:
 *    the oval 186000388 (40.3 x 32.3 m; published about 40 x 30 m, de.
 *    wikipedia "Paulskirche (Frankfurt am Main)"), the tower 186000386
 *    (10.1 m square, to 35 m), its upper stage 186000387 (8.6 m, to 47 m),
 *    the lantern 189097341 (7.4 m across, to 59 m), its dome 186000385 (to
 *    65 m) and the cross 388174266/9 (to 69 m); the north wings 388174274
 *    and 388174279 (34.5 m with a 1.5 m roof); the roof lantern 388174262
 *    (to 40 m). Roof 186000388: dome, 38 m, roof 5 m.
 *  - heights from OSM (above), cross-checked against Dietmar Rabich's photo
 *    from the south-west (the rotunda's cornice just under the tower's
 *    first cornice). Window rows, string courses and doors scaled from the
 *    same photo and Gerd Eichmann's from the north-east.
 *  - colours: the red sandstone and the pale green copper of the roof and
 *    lantern dome from the daylight photos and the aerial from the
 *    Maintower (the assignment's "slate-grey dome roof" is copper green in
 *    every photo; OSM roof:colour #afc6bc agrees).
 *  - night: floodlit walls (as the Römerberg area); windows lit.
 *  - elevation 0.
 *
 * Photos (Wikimedia Commons, all evidence):
 *  - Frankfurt am Main, Paulskirche -- 2015 -- 6740.jpg (Dietmar Rabich,
 *    CC BY-SA 4.0): tower and rotunda from the south-west.
 *    https://commons.wikimedia.org/wiki/File:Frankfurt_am_Main,_Paulskirche_--_2015_--_6740.jpg
 *  - Frankfurt Am Main-Paulskirche-Ansicht vom Maintower.jpg (Mylius, CC
 *    BY-SA 3.0): aerial from the west; plan, roof, wings, porches.
 *    https://commons.wikimedia.org/wiki/File:Frankfurt_Am_Main-Paulskirche-Ansicht_vom_Maintower.jpg
 *  - Paulskirche Frankfurt am Main 2021-08-17 01.jpg (Leonhard Lenz, CC0):
 *    from the east, Paulsplatz.
 *    https://commons.wikimedia.org/wiki/File:Paulskirche_Frankfurt_am_Main_2021-08-17_01.jpg
 *  - Frankfurt-Paulskirche-04-2016-gje.jpg (Gerd Eichmann, CC BY 4.0): from
 *    the north-east; the north-east wing and the east porch.
 *    https://commons.wikimedia.org/wiki/File:Frankfurt-Paulskirche-04-2016-gje.jpg
 * No commercial imagery, no 3D city models. No look-only sources.
 *
 * Left out: the balustrade's fretwork (drawn as a solid low rail), the
 * rustication joints, the plaques and the monuments around the church.
 *
 * Doubts: the west side is seen only from above; the porch positions are
 * read off the aerial.
 */
import { Part, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { boxF, cap, ccw, face, fac, floodWalls, lathe, pane, surround, walls, wallSlab, writeLods, inset, ball, type XY } from './frankfurt-roemer'

const ID = 'frankfurt-paulskirche'

function build(DETAIL: boolean) {
  const stone = new Part(), copper = new Part(), win = new Part(), gold = new Part(), door = new Part(), grey = new Part()

  // ---- The oval ---------------------------------------------------------------
  const A = 20.1, B = 16.1, CY = 0.3, N = DETAIL ? 48 : 32
  const ell = (k: number, a = A, b = B): XY[] => Array.from({ length: N }, (_, i) => { const t = (i / N) * 2 * Math.PI; return [a * k * Math.cos(t), CY + b * k * Math.sin(t)] as XY })
  const ring = ell(1)
  walls(stone, ring, 0, 31.4)
  // plinth, string course, cornice
  const band = (z0: number, z1: number, out: number) => { const r = ell(1 + out / A, A + out, B + out); walls(stone, r, z0, z1); cap(stone, r, z1); face(stone, r.map(([x, y]) => [x, y, z0] as V3).reverse(), [0, 0, -1]) }
  band(0, 1.2, 0.25)
  band(19.4, 19.9, 0.18)
  band(31.4, 33.0, 0.55)
  // The windows: two tiers of round-arched windows, small square ones in the base.
  const bays = DETAIL ? 20 : 16
  for (let i = 0; i < bays; i++) {
    const t = ((i + 0.5) / bays) * 2 * Math.PI
    const x = A * Math.cos(t), y = CY + B * Math.sin(t)
    // skip the tower (south) and the wings (north-east, north-west) and the north porch
    const deg = ((t * 180) / Math.PI) % 360
    if (deg > 245 && deg < 295) continue
    if ((deg > 35 && deg < 62) || (deg > 118 && deg < 145)) continue
    // a facet tangent to the oval at this point
    const tx = -A * Math.sin(t), ty = B * Math.cos(t), l = Math.hypot(tx, ty)
    const a: XY = [x - (tx / l) * 1.8, y - (ty / l) * 1.8], b: XY = [x + (tx / l) * 1.8, y + (ty / l) * 1.8]
    const F = fac(a, b)
    const kind = 'round' as const
    pane(win, F, 1.8, 1.05, 9.2, 15.6, kind, 0.08, DETAIL ? 8 : 4)
    pane(win, F, 1.8, 1.0, 21.8, 26.8, kind, 0.08, DETAIL ? 8 : 4)
    if (DETAIL) {
      surround(stone, F, 1.8, 1.05, 9.2, 15.6, kind, 0.22, 0.14, 8, 0.2)
      surround(stone, F, 1.8, 1.0, 21.8, 26.8, kind, 0.22, 0.14, 8, 0.2)
      // glazing bars: a mullion and transoms
      boxF(stone, F, 1.75, 1.85, 9.2, 15.6 + 1.0, 0.08, 0.13)
      for (const z of [11.4, 13.6]) boxF(stone, F, 0.75, 2.85, z - 0.05, z + 0.05, 0.08, 0.13)
      boxF(stone, F, 1.75, 1.85, 21.8, 26.8 + 1.0, 0.08, 0.13)
      pane(win, F, 1.8, 0.45, 2.0, 3.4, 'flat', 0.08)
      // the shallow pilasters between the bays
      boxF(stone, F, -0.25, 0.25, 1.2, 31.4, -0.1, 0.1)
    }
  }
  // Doors: pedimented porches on the north, east and west.
  for (const t of [Math.PI / 2, 0, Math.PI]) {
    const x = A * Math.cos(t), y = CY + B * Math.sin(t)
    const tx = -A * Math.sin(t), ty = B * Math.cos(t), l = Math.hypot(tx, ty)
    const F = fac([x - (tx / l) * 2.4, y - (ty / l) * 2.4], [x + (tx / l) * 2.4, y + (ty / l) * 2.4])
    pane(door, F, 2.4, 1.0, 0, 3.4, 'round', 0.3, 8)
    boxF(stone, F, 0.4, 0.9, 0, 4.6, 0, 0.55)
    boxF(stone, F, 3.9, 4.4, 0, 4.6, 0, 0.55)
    boxF(stone, F, 0.2, 4.6, 4.6, 5.0, 0, 0.7)
    wallSlab(stone, F.a, F.b, [[0.1, 5.0], [4.7, 5.0], [2.4, 6.4]], 0.6, 0.1)
    pane(win, F, 2.4, 1.0, 9.2, 15.6, 'round', 0.08, DETAIL ? 8 : 4)
    pane(win, F, 2.4, 1.0, 21.8, 26.8, 'round', 0.08, DETAIL ? 8 : 4)
  }

  // ---- The low dome roof and its skylight lantern ----------------------------
  {
    const prof: [number, number][] = [[1.025, 33.0], [0.99, 33.55], [0.9, 34.6], [0.75, 35.9], [0.58, 36.9], [0.4, 37.6], [0.17, 38.0]]
    const rings = prof.map(([k, z]) => ell(k, A, B).map(([x, y]) => [x, y, z] as V3))
    for (let i = 0; i < rings.length - 1; i++) for (let j = 0; j < N; j++) {
      const a = rings[i][j], b = rings[i][(j + 1) % N], c = rings[i + 1][(j + 1) % N], d = rings[i + 1][j]
      face(copper, [a, b, c, d], [(a[0] + b[0]) / 2 / (A * A), ((a[1] + b[1]) / 2 - CY) / (B * B), (prof[i][0] - prof[i + 1][0]) / (prof[i + 1][1] - prof[i][1]) * 0.06])
    }
    const top = ell(0.17, A, B)
    walls(grey, top, 38.0, 39.6)
    const lid = ell(0.19, A, B)
    walls(grey, lid, 39.6, 39.85)
    for (let j = 0; j < N; j++) grey.tri([lid[j][0], lid[j][1], 39.85], [lid[(j + 1) % N][0], lid[(j + 1) % N][1], 39.85], [0, CY, 40.6])
    cap(grey, lid, 39.6, false)
  }

  // ---- North wings -------------------------------------------------------------
  const wings: XY[][] = [
    [[-12.59, 20.46], [-14.17, 20.81], [-21.62, 15.59], [-21.16, 14.55], [-17.3, 9.12], [-13.35, 13.02], [-8.86, 15.23]],
    [[10.78, 14.4], [14.48, 12.33], [17.5, 8.95], [21.11, 14.15], [20.97, 15.69], [13.88, 20.43], [12.32, 20.24], [8.71, 15.08]],
  ]
  for (const w0 of wings) {
    const w = ccw(w0)
    walls(stone, w, 0, 31.4)
    const wo = inset(w, -0.45)
    walls(stone, wo, 31.4, 33.0); cap(stone, wo, 31.4, false)
    face(copper, w.map(([x, y]) => [x, y, 33.6] as V3), [0, 0, 1])
    walls(copper, wo, 33.0, 33.6)
    cap(copper, wo, 33.6)
    for (let k = 0; k < w.length; k++) {
      const F = fac(w[k], w[(k + 1) % w.length])
      if (F.L < 5) continue
      // windows only on the outer faces (those not facing the oval)
      const mx = (w[k][0] + w[(k + 1) % w.length][0]) / 2, my = (w[k][1] + w[(k + 1) % w.length][1]) / 2
      if (Math.hypot(mx / A, (my - CY) / B) < 1.08) continue
      const n = F.L > 8 ? 2 : 1
      for (let j = 0; j < n; j++) {
        const c = (F.L * (j + 0.5)) / n
        pane(win, F, c, 1.0, 9.2, 15.6, 'round', 0.08, DETAIL ? 8 : 4)
        pane(win, F, c, 1.0, 21.8, 26.8, 'round', 0.08, DETAIL ? 8 : 4)
        if (DETAIL) {
          surround(stone, F, c, 1.0, 9.2, 15.6, 'round', 0.22, 0.14, 8, 0.2)
          surround(stone, F, c, 1.0, 21.8, 26.8, 'round', 0.22, 0.14, 8, 0.2)
        }
      }
      boxF(stone, F, 0, F.L, 19.4, 19.9, 0, 0.18)
      boxF(stone, F, 0, F.L, 0, 1.2, 0, 0.25, false)
    }
  }

  // ---- The tower ------------------------------------------------------------------
  {
    const cx = 0.0, cy = -21.0
    const sq = (h: number): XY[] => [[cx - h, cy - h], [cx + h, cy - h], [cx + h, cy + h], [cx - h, cy + h]]
    const S1 = sq(5.05), S2 = sq(4.3)
    walls(stone, S1, 0, 33.6)
    walls(stone, sq(5.3), 0, 1.2); cap(stone, sq(5.3), 1.2)
    // corner pilasters (rusticated quoins) and the band courses
    for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
      const r: XY[] = ccw([[cx + sx * 5.05, cy + sy * 5.05], [cx + sx * 3.9, cy + sy * 5.05], [cx + sx * 3.9, cy + sy * 3.9], [cx + sx * 5.05, cy + sy * 3.9]].map(([x, y]) => [x + sx * 0.15, y + sy * 0.15] as XY))
      if (sy > 0) continue // the north corners are in the oval
      walls(stone, r, 1.2, 33.6)
    }
    const corn = (r: XY[], z0: number, z1: number) => { walls(stone, r, z0, z1); cap(stone, r, z1); face(stone, r.map(([x, y]) => [x, y, z0] as V3).reverse(), [0, 0, -1]) }
    corn(sq(5.35), 19.4, 20.2)
    corn(sq(5.75), 33.6, 35.0)
    walls(stone, S2, 35.0, 45.8)
    corn(sq(4.75), 45.8, 47.0)
    // windows on the three free faces of each stage
    const faces1 = [0, 1, 3].map((k) => fac(S1[k], S1[(k + 1) % 4]))
    const faces2 = [0, 1, 2, 3].map((k) => fac(S2[k], S2[(k + 1) % 4]))
    for (const F of faces1) {
      pane(win, F, F.L / 2, 1.15, 22.0, 29.2, 'round', 0.08, 8)
      surround(stone, F, F.L / 2, 1.15, 22.0, 29.2, 'round', 0.3, 0.2, DETAIL ? 8 : 6, 0.3)
      pane(win, F, F.L / 2, 1.0, 9.0, 14.6, 'round', 0.08, 8)
      if (DETAIL) surround(stone, F, F.L / 2, 1.0, 9.0, 14.6, 'round', 0.3, 0.2, 8, 0.3)
    }
    for (const F of faces2) {
      pane(win, F, F.L / 2, 1.2, 37.0, 43.0, 'round', 0.1, 8)
      surround(stone, F, F.L / 2, 1.2, 37.0, 43.0, 'round', 0.3, 0.22, DETAIL ? 8 : 6, 0.3)
    }
    // the balustrade on the upper stage's roof
    {
      const r = sq(4.6), ri = inset(r, 0.3)
      walls(stone, r, 47.0, 48.1); walls(stone, [...ri].reverse(), 47.0, 48.1)
      for (let k = 0; k < 4; k++) {
        const l = (k + 1) % 4
        stone.quad([r[k][0], r[k][1], 48.1], [r[l][0], r[l][1], 48.1], [ri[l][0], ri[l][1], 48.1], [ri[k][0], ri[k][1], 48.1])
      }
      cap(stone, ri, 47.0)
    }
    // the round lantern: drum, eight columns before arched windows, entablature
    const seg = DETAIL ? 24 : 16
    lathe(stone, cx, cy, [[3.55, 47.0], [3.55, 48.4], [3.1, 48.6], [3.1, 56.6], [3.75, 56.8], [3.75, 58.0], [3.5, 58.3], [0, 58.3]], seg)
    for (let k = 0; k < 8; k++) {
      const t = (k / 8) * 2 * Math.PI
      lathe(stone, cx + 3.4 * Math.cos(t), cy + 3.4 * Math.sin(t), [[0.32, 48.6], [0.28, 56.8], [0, 56.8]], DETAIL ? 8 : 5)
      const t2 = t + Math.PI / 8
      const p: XY = [cx + 3.1 * Math.cos(t2), cy + 3.1 * Math.sin(t2)], tan: XY = [-Math.sin(t2), Math.cos(t2)]
      const F = fac([p[0] - tan[0] * 0.9, p[1] - tan[1] * 0.9], [p[0] + tan[0] * 0.9, p[1] + tan[1] * 0.9])
      pane(win, F, 0.9, 0.62, 49.8, 54.8, 'round', 0.03, 6)
    }
    // the copper dome, a ball and the gilt cross
    lathe(copper, cx, cy, [[3.6, 58.3], [3.5, 59.6], [3.1, 61.0], [2.4, 62.3], [1.4, 63.3], [0.45, 63.8], [0, 63.9]], seg)
    ball(gold, cx, cy, 64.3, 0.45, DETAIL ? 10 : 6)
    walls(gold, sq(0.12).map(([x, y]) => [x - cx + cx, y] as XY), 64.6, 69.0)
    const arm: XY[] = [[cx - 0.9, cy - 0.12], [cx + 0.9, cy - 0.12], [cx + 0.9, cy + 0.12], [cx - 0.9, cy + 0.12]]
    walls(gold, arm, 67.2, 67.5); cap(gold, arm, 67.5); cap(gold, arm, 67.2, false)
    cap(gold, sq(0.12), 69.0)
  }

  const parts: { part: Part; material: MaterialSpec }[] = [
    { part: stone, material: { ...finish('paulskirche-sandstone', 0xb27668), floodlight: floodWalls } },
    { part: copper, material: finish('paulskirche-copper', 0x95b8a8) },
    { part: win, material: PALETTE.window },
    { part: gold, material: finish('paulskirche-gilt', 0xcdb46a) },
    { part: door, material: finish('paulskirche-door', 0x7a6a5a) },
    { part: grey, material: { ...PALETTE.roof, color: 0x9aa3aa } },
  ]
  return parts
}

if (import.meta.main) await writeLods(ID, 'Paulskirche', [50.111193, 8.6807568], -13, build(false), build(true))
