/**
 * Templo de La Profesa (San José el Real; Oratorio de San Felipe Neri),
 * corner of Madero and Isabel la Católica, Mexico City — procedural,
 * CC0-1.0, no textures. bun generators/mexico-city-la-profesa.ts
 *
 * Map frame: x east, y north, z up, metres, turned to the church's axis: the
 * walls of the OSM outline run at 8.0° (and 98°), so the placement bearing
 * is 8.0. The anchor is the area centroid of OSM way/158032448 (lng
 * -99.1365278, lat 19.4338421). The nave runs west–east (x): the altar at
 * the west, the main front on Isabel la Católica at the east (x 26.9), the
 * south flank on Madero (y −15.8).
 *
 * What it is: the Jesuits' professed house church, rebuilt by Pedro de
 * Arrieta in 1714–20 (es.wikipedia "La Profesa"), neoclassical interior by
 * Tolsá (1805). A three-aisled church with a transept, red tezontle walls
 * with grey cantera pilasters, cornices and portals: the main portal on
 * the east front between two big buttress-pilasters, two storeys of columns
 * under a broken pediment and a crowning block with a round medallion; a
 * matching side portal on Madero; the single bell tower at the south-east
 * corner of the two streets (a cantera shaft with tezontle panels, two
 * belfry stages, a tiled cupola, lantern and cross); the octagonal tezontle
 * drum with arched windows, red-brown tiled dome and stone lantern over the
 * crossing near the altar; barrel vaults and brick terraces.
 *
 * The church has sunk below the street (one goes down steps into it). No
 * measured depth was found in an open source, so the model stands on its
 * own base with elevation 0 (the walls are drawn from the street up, at
 * the heights seen from the street).
 *
 * Covers and replaces way/158032448 (building=church, the cross-shaped
 * nave and transept) and the four corner blocks way/1300593819,
 * way/1300593820, way/1300593821, way/1300593822 (building=church).
 *
 * Evidence
 * - OSM (measured, turned 8°): the whole church x −22.3…26.9,
 *   y −15.8…14.8 (49 × 30.6 m); nave y −6.2…7.1; transept x −13.4…0.3;
 *   the corner blocks (aisles and chapels) fill the rest.
 * - Photo-scaled (estimated): photo 4 (from Madero, west of the church) at
 *   ~12 px/m on the tower's 7.3 m width: tower shaft to ~21 m, belfry stages
 *   to ~28.4 and ~33.5, cupola, lantern and cross to ~39 m (the photo reads
 *   40). Photo 1 (the east
 *   portal, ~100 px/m on its 3.5 m door): portal storeys to ~9.3 and
 *   ~14.5 m, the pediment ~16, its crowning block ~20 m. Aisle walls 14 m,
 *   nave and transept walls 18 m, vault rise ~2.5 m, drum to 24 m, dome
 *   to ~29, lantern and cross to ~33.5: estimated from photos 2, 5 and 6
 *   (the drum, dome and lantern from the hotel windows north of the church).
 *   The side portal's place (x 7…17, just west of the tower) from photo 3.
 * - Terrain: Mapterhorn has no z15 terrain here (tools/terrain.ts 404s); the
 *   Centro is on the flat lake bed (~2,240 m). Elevation 0 (see above).
 * - Photos (Wikimedia Commons, EVIDENCE):
 *   1 "Portada Iglesia de la Profesa Ciudad de México.jpg", ProtoplasmaKid,
 *     CC BY-SA 4.0 — the east portal.
 *   2 "Temple of San Felipe Neri "La Profesa" 2015 01.jpg", "… 02.jpg",
 *     "… 04.jpg", Mike Peel, CC BY-SA 4.0 — the Madero portal, the dome and
 *     lantern behind, the tower base.
 *   3 "Templo de la Profesa 2.jpg", Ricardo Daniel Huerta Garrido,
 *     CC BY-SA 3.0 — the tower and the Madero flank from the east.
 *   4 "Avenida Francisco I. Madero, Centro Histórico, Ciudad de México - La
 *     Profesa.jpg", Juan Carlos Fonseca Mata, CC BY-SA 4.0 — the Madero
 *     flank and tower from the west.
 *   5 "Templo de La Profesa desde el hotel 01.jpg" and "… 02.jpg", Luis
 *     Alvaz, CC BY-SA 4.0 — drum, dome, lantern, vaults and terraces from the
 *     north.
 *   6 "Temple of San Felipe Neri "La Profesa" 2015 22.jpg", Mike Peel,
 *     CC BY-SA 4.0, and "Templo de la Profesa..JPG", CPeralta, CC BY-SA
 *     3.0 — interior: the crossing and drum near the altar end.
 * - Look-only: none. No commercial imagery.
 * - Simplified or left out: the portals' columns, niches, statues and
 *   reliefs are flat pilasters and panels; the urn and cannon finials are
 *   pinnacles; the atrium railing on Madero is left out.
 * - Doubts: no photo from straight above or of the west (altar) end and the
 *   north side, which other buildings hide (plain walls). The es.wikipedia
 *   infobox says two towers; every photo shows one (the crowning block of
 *   the east portal reads as a small turret from Madero). All heights are
 *   photo estimates on steep street views.
 * - Colours (review round 1): the cantera is the cool grey of the east
 *   portal and the tower shaft in photos 1, 3 and 4 (#a9a296), not cream; the
 *   tezontle the dark red-brown of the flank and belfries (#7a4c43); the dome
 *   and cupola tiles a darker red-brown. The tower's belfry stages are
 *   tezontle between bold grey cornices with grey corner pilasters.
 * - Night: the portals and tower are floodlit.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { save, lathe } from './dc-nmaahc'
import { cbox, qf, tf } from './dc-white-house'
import { offsetPoly } from './dc-national-cathedral'
import { belfry, cross3, merlon, ringWalls, wpanel, warch, wprofile, type XY } from './mexico-city-palacio-nacional'

type AZ = [number, number]
const X0 = -22.3, X1 = 26.9, Y0 = -15.8, Y1 = 14.8
const NY0 = -6.2, NY1 = 7.1, NC = (NY0 + NY1) / 2 // nave
const TX0 = -13.4, TX1 = 0.3, TC = (TX0 + TX1) / 2 // transept / crossing
const ZA = 14.0, ZN = 18.0

function build() {
  const red = new Part(), grey = new Part(), roof = new Part(), win = new Part(), tile = new Part()

  // ---- Aisles and chapels: the whole rectangle to 14 m, a pale cornice.
  const ALL: XY[] = [[X0, Y0], [X1, Y0], [X1, Y1], [X0, Y1]]
  ringWalls(red, ALL, 0, ZA)
  ringWalls(grey, ALL, ZA, ZA + 0.6)
  const IN = offsetPoly(ALL, -0.5)
  ringWalls(grey, IN, ZA, ZA + 0.6, true)
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    qf(grey, [...ALL[i], ZA + 0.6] as V3, [...ALL[j], ZA + 0.6] as V3, [...IN[j], ZA + 0.6] as V3, [...IN[i], ZA + 0.6] as V3, [0, 0, 1])
  }
  roof.cap(IN.map(([x, y]) => [x, y, ZA] as V3), true)

  // ---- Nave and transept: walls to 18 m, barrel vaults, the crossing.
  cbox(red, { x0: X0 + 0.5, x1: X1 - 0.6, y0: NY0, y1: NY1 }, ZA, ZN, { top: roof })
  cbox(red, { x0: TX0, x1: TX1, y0: Y0 + 0.5, y1: Y1 - 0.5 }, ZA, ZN, { top: roof })
  cbox(grey, { x0: X0 + 0.3, x1: X1 - 0.4, y0: NY0 - 0.25, y1: NY1 + 0.25 }, ZN - 0.4, ZN, { b: 0.12, bottom: true, top: false })
  cbox(grey, { x0: TX0 - 0.25, x1: TX1 + 0.25, y0: Y0 + 0.3, y1: Y1 - 0.3 }, ZN - 0.4, ZN, { b: 0.12, bottom: true, top: false })
  // clerestory lunettes on the nave walls
  for (let x = 4; x < X1 - 3; x += 6.2) for (const [side, at] of [['s', NY0], ['n', NY1]] as const) warch(win, side, at, x - 0.9, x + 0.9, 15.2, 17.4, 0.05, 6)
  const vault = (along: 'x' | 'y', a0: number, a1: number, c: number, hw: number, rise: number) => {
    const n = 8
    const P = (k: number, a: number): V3 => {
      const t = Math.PI * (1 - k / n), u = c + hw * Math.cos(t), z = ZN + rise * Math.sin(t)
      return along === 'x' ? [a, u, z] : [u, a, z]
    }
    for (let k = 0; k < n; k++) {
      const t = Math.PI * (1 - (k + 0.5) / n), nn: V3 = along === 'x' ? [0, Math.cos(t), Math.sin(t)] : [Math.cos(t), 0, Math.sin(t)]
      qf(roof, P(k, a0), P(k + 1, a0), P(k + 1, a1), P(k, a1), nn)
    }
    for (const [a, s] of [[a0, -1], [a1, 1]] as [number, number][]) {
      const nn: V3 = along === 'x' ? [s, 0, 0] : [0, s, 0], base: V3 = along === 'x' ? [a, c, ZN] : [c, a, ZN]
      for (let k = 0; k < n; k++) tf(red, base, P(k, a), P(k + 1, a), nn)
    }
  }
  vault('x', TX1, X1 - 1.2, NC, 6.65, 2.5) // nave
  vault('x', X0 + 0.8, TX0, NC, 6.65, 2.5) // presbytery
  vault('y', Y0 + 0.8, NY0, TC, 6.85, 2.5) // south arm
  vault('y', NY1, Y1 - 0.8, TC, 6.85, 2.5) // north arm

  // ---- Drum, dome, lantern over the crossing.
  const RD = 6.3, Z0 = ZN, Z1 = 23.5
  cbox(red, { x0: TX0, x1: TX1, y0: NY0, y1: NY1 }, ZN, ZN + 1.4, { top: roof })
  lathe(red, TC, NC, [[RD, Z0], [RD, Z1]], 8, false)
  lathe(grey, TC, NC, [[RD, Z1], [RD + 0.35, Z1], [RD + 0.35, Z1 + 0.5], [RD - 0.25, Z1 + 0.5]], 8, false)
  for (let k = 0; k < 8; k++) {
    const a = (k + 0.5) * (Math.PI / 4), ap = RD * Math.cos(Math.PI / 8)
    const c: XY = [TC + ap * Math.cos(a), NC + ap * Math.sin(a)], t: XY = [-Math.sin(a), Math.cos(a)], o: V3 = [Math.cos(a), Math.sin(a), 0]
    const P = (u: number, z: number, d: number): V3 => [c[0] + t[0] * u + o[0] * d, c[1] + t[1] * u + o[1] * d, z]
    // a pale arched frame and the window in it
    const arch = (part: Part, hw: number, z0: number, z1: number, d: number) => {
      const zs = z1 - hw
      qf(part, P(-hw, z0, d), P(hw, z0, d), P(hw, zs, d), P(-hw, zs, d), o)
      for (let s = 0; s < 6; s++) {
        const t0 = (Math.PI * s) / 6, t1 = (Math.PI * (s + 1)) / 6
        tf(part, P(0, zs, d), P(hw * Math.cos(t0), zs + hw * Math.sin(t0), d), P(hw * Math.cos(t1), zs + hw * Math.sin(t1), d), o)
      }
    }
    arch(grey, 1.25, Z0 + 1.4, Z1 - 0.5, 0.03)
    arch(win, 0.9, Z0 + 1.8, Z1 - 0.9, 0.06)
  }
  const prof: [number, number][] = []
  for (let k = 0; k <= 6; k++) { const t = (Math.PI / 2) * (k / 6); prof.push([(RD - 0.4) * Math.cos(t), Z1 + 0.5 + 5.1 * Math.sin(t)]) }
  prof[6] = [1.3, Z1 + 0.5 + 4.9]
  lathe(tile, TC, NC, prof, 16, false)
  const ZL = Z1 + 0.5 + 4.9
  lathe(grey, TC, NC, [[1.3, ZL], [1.3, ZL + 2.3], [1.6, ZL + 2.3], [1.6, ZL + 2.6]], 8, false)
  for (let k = 0; k < 4; k++) {
    const a = (k * Math.PI) / 2 + Math.PI / 8, ap = 1.3 * Math.cos(Math.PI / 8) + 0.04
    const c: XY = [TC + ap * Math.cos(a), NC + ap * Math.sin(a)], t: XY = [-Math.sin(a), Math.cos(a)]
    const P = (u: number, z: number): V3 => [c[0] + t[0] * u, c[1] + t[1] * u, z]
    qf(win, P(-0.3, ZL + 0.5), P(0.3, ZL + 0.5), P(0.3, ZL + 1.8), P(-0.3, ZL + 1.8), [Math.cos(a), Math.sin(a), 0])
  }
  lathe(tile, TC, NC, [[1.6, ZL + 2.6], [1.2, ZL + 3.2], [0.5, ZL + 3.6], [0, ZL + 3.7]], 8)
  cross3(grey, TC, NC, ZL + 3.6, ZL + 5.3)

  // ---- A portal: two storeys of cantera between buttress-pilasters, a
  // broken pediment and a crowning block. Built on the east front or the
  // south flank; `u` runs along the wall, `out` is the face.
  const portal = (side: 'e' | 's', at: number, c: number, w: number, zTop: number) => {
    const sgn = side === 'e' ? 1 : -1, F = at + sgn * 0.6
    const box = (u0: number, u1: number, d0: number, d1: number, z0: number, z1: number, part = grey, b = 0.15) => {
      if (side === 'e') cbox(part, { x0: at + d0, x1: at + d1, y0: c + u0, y1: c + u1 }, z0, z1, { b })
      else cbox(part, { x0: c + u0, x1: c + u1, y0: at - d1, y1: at - d0 }, z0, z1, { b })
    }
    const hw = w / 2
    box(-hw, hw, -0.2, 0.6, 0, zTop - 4.0) // the frontispiece
    box(-hw - 1.8, -hw, -0.2, 1.0, 0, zTop - 1.6) // buttress-pilasters
    box(hw, hw + 1.8, -0.2, 1.0, 0, zTop - 1.6)
    box(-hw - 0.4, hw + 0.4, 0.4, 0.95, 9.0, 9.6, grey, 0.12) // storey cornice
    box(-hw - 0.2, hw + 0.2, 0.4, 0.9, zTop - 4.6, zTop - 4.0, grey, 0.12) // top cornice
    for (const u of [-hw + 1.2, -hw + 2.6, hw - 2.6, hw - 1.2]) {
      box(u - 0.3, u + 0.3, 0.5, 0.85, 0.6, 9.0, grey, 0.08)
      if (Math.abs(u) > hw - 2) box(u - 0.28, u + 0.28, 0.5, 0.8, 9.6, zTop - 4.6, grey, 0.08)
    }
    // broken pediment: two sloping halves with a gap, and the crowning block
    const zp = zTop - 4.0
    const half = (s: number): AZ[] => [[c + s * (hw - 0.2), zp], [c + s * 1.6, zp], [c + s * 1.6, zp + 1.6], [c + s * (hw - 0.2), zp + 0.3]]
    for (const s of [-1, 1]) wprofile(grey, side, F, half(s), 1.0, 0, true)
    box(-1.4, 1.4, 0.0, 0.8, zp, zTop, grey, 0.15)
    for (const s of [-1, 1]) {
      const u = c + s * (hw + 0.9), d = 0.4
      const p = side === 'e' ? [at + d, u] : [u, at - d]
      merlon(grey, p[0], p[1], zTop - 1.6, 0.9, 1.8)
    }
    const pz = side === 'e' ? [at + 0.4, c] : [c, at - 0.4]
    for (const s of [-1, 1]) {
      const pp = side === 'e' ? [pz[0], c + s * 1.1] : [c + s * 1.1, pz[1]]
      merlon(grey, pp[0], pp[1], zTop, 0.45, 0.8)
    }
    // the door (arched) and the niche window above
    warch(win, side, F, c - 1.75 * (side === 'e' ? 1 : 1), c + 1.75, 0, 6.2, 0.05, 8)
    warch(win, side, F, c - 0.75, c + 0.75, 10.4, 13.6, 0.05, 6)
  }
  portal('e', X1, NC, 11.6, 20.3)
  portal('s', Y0, 12.0, 9.6, 19.5)

  // ---- The east front's aisle bays and the south flank: pilasters and
  // windows in pale frames.
  for (const y of [NY1 + 4.0]) {
    wpanel(grey, 'e', X1, y - 1.3, y + 1.3, 6.6, 10.4, 0.03)
    wpanel(win, 'e', X1, y - 0.9, y + 0.9, 7.0, 10.0, 0.06)
  }
  for (const x of [-19.5, -14.2, -8.9, -3.6, 1.7]) {
    cbox(grey, { x0: x - 0.6, x1: x + 0.6, y0: Y0 - 0.6, y1: Y0 + 0.2 }, 0, ZA + 0.6, { b: 0.12 })
    merlon(grey, x, Y0 - 0.2, ZA + 0.6, 0.7, 1.4)
  }
  for (const x of [-16.85, -11.55, -6.25, -0.95]) {
    wpanel(grey, 's', Y0, x - 1.3, x + 1.3, 6.4, 10.8, 0.03)
    warch(win, 's', Y0, x - 0.95, x + 0.95, 6.8, 10.4, 0.06, 6)
  }

  // ---- The tower (south-east corner): a cantera shaft with tezontle
  // panels, two belfry stages, a tiled cupola, lantern and cross.
  const TH = 3.65, TXc = X1 - TH, TYc = Y0 + TH
  cbox(grey, { x0: TXc - TH - 0.1, x1: TXc + TH + 0.1, y0: TYc - TH - 0.1, y1: TYc + TH }, 0, 20.4, { top: false })
  for (const [side, at, c0] of [['s', TYc - TH - 0.1, TXc], ['e', TXc + TH + 0.1, TYc]] as const) {
    wpanel(red, side, at, c0 - 1.7, c0 + 1.7, 2.0, 19.0, 0.03)
    wpanel(grey, side, at, c0 - 0.9, c0 + 0.9, 13.0, 16.4, 0.05)
    wpanel(win, side, at, c0 - 0.6, c0 + 0.6, 13.4, 16.0, 0.07)
  }
  wpanel(red, 'w', TXc - TH - 0.1, TYc - 1.7, TYc + 1.7, ZA + 0.8, 19.0, 0.03)
  wpanel(red, 'n', TYc + TH, TXc - 1.7, TXc + 1.7, ZA + 0.8, 19.0, 0.03)
  cbox(grey, { x0: TXc - TH - 0.7, x1: TXc + TH + 0.7, y0: TYc - TH - 0.7, y1: TYc + TH + 0.6 }, 20.2, 21.0, { b: 0.25, bottom: true })
  belfry(red, roof, TXc, TYc, 3.1, 21.0, 27.6, 2.2, 0.55, 0.7, 0.6)
  for (const [sx, sy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) cbox(grey, { x0: TXc + sx * 2.75 - 0.45, x1: TXc + sx * 2.75 + 0.45, y0: TYc + sy * 2.75 - 0.45, y1: TYc + sy * 2.75 + 0.45 }, 21.0, 27.6, { top: false })
  cbox(grey, { x0: TXc - 3.75, x1: TXc + 3.75, y0: TYc - 3.75, y1: TYc + 3.75 }, 27.6, 28.4, { b: 0.22, bottom: true })
  for (const [sx, sy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) merlon(grey, TXc + sx * 3.2, TYc + sy * 3.2, 28.4, 0.9, 2.0)
  belfry(red, roof, TXc, TYc, 2.45, 28.4, 32.8, 1.7, 0.45, 0.5, 0.4)
  for (const [sx, sy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) cbox(grey, { x0: TXc + sx * 2.2 - 0.35, x1: TXc + sx * 2.2 + 0.35, y0: TYc + sy * 2.2 - 0.35, y1: TYc + sy * 2.2 + 0.35 }, 28.4, 32.8, { top: false })
  cbox(grey, { x0: TXc - 3.05, x1: TXc + 3.05, y0: TYc - 3.05, y1: TYc + 3.05 }, 32.8, 33.5, { b: 0.2, bottom: true })
  for (const [sx, sy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) merlon(grey, TXc + sx * 2.6, TYc + sy * 2.6, 33.5, 0.7, 1.5)
  lathe(tile, TXc, TYc, [[2.5, 33.5], [2.2, 33.9], [2.15, 34.5], [1.9, 35.3], [1.45, 35.95], [0.95, 36.35], [0.6, 36.5]], 12, true)
  lathe(grey, TXc, TYc, [[0.6, 36.5], [0.6, 37.4], [0.85, 37.4], [0.35, 37.8], [0, 37.9]], 8)
  cross3(grey, TXc, TYc, 37.8, 39.6, 0.34)

  // Night: the portals and the tower are floodlit.
  const lit = (p: V3, n: V3) => (n[2] > 0.6 ? 0 : p[0] > X1 - 9 || p[1] < Y0 + 1.5 ? 0.85 : 0.3)
  return [
    { part: red, material: { ...finish('tezontle', 0x7a4c43), floodlight: lit } },
    { part: grey, material: { ...finish('cantera-grey', 0xa9a296), floodlight: lit } },
    { part: roof, material: finish('terrace-roof', 0xbf9c84) },
    { part: win, material: PALETTE.window },
    { part: tile, material: finish('dome-tile', 0x8e5f51) },
  ]
}

if (import.meta.main) await save('mexico-city-la-profesa', 'Templo de La Profesa', build(), { generator: 'generators/mexico-city-la-profesa.ts' }, 6500)
