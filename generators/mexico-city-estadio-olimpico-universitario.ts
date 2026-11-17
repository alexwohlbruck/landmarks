/**
 * Estadio Olímpico Universitario (1950–52, Augusto Pérez Palacios with Raúl
 * Salinas Moro and Jorge Bravo Jiménez; the 1968 Olympic stadium), Ciudad
 * Universitaria, UNAM, Mexico City — original procedural geometry, CC0-1.0,
 * no textures.
 *   bun generators/mexico-city-estadio-olimpico-universitario.ts
 *
 * Map frame: x east, y north, z up, metres. z = 0 is the field (the foot
 * of the field wall). The anchor is the centre of the field-wall ring
 * (OSM way/1139111714), 19.331933, -99.192125: the stadium is built
 * round it, while the outline's own centroid is pulled ~10 m west by the
 * deeper west side and the plaza bastions. Bearing 8: the field axis
 * (symmetric fits of the field-wall and walkway rings are best at 14° and
 * 5°; 8° splits them).
 *
 * Identity, in order: the open bowl sunk into the Pedregal, its rim a
 * white concrete parapet that rises on the long sides (highest on the
 * west, over two tiers) and dips at the ends; outside the rim the berm of
 * dark volcanic stone (the taludes), with a red-paved terrace, the tunnel
 * kiosks with red roofs and the stair bastions stepping down to the plaza;
 * Diego Rivera's stone relief on the east talud over the main gate; El
 * Palomar, the press box along the top of the west stand; the four 1968
 * floodlight towers; the tall white sign wall on pilotis at the north end.
 *
 * Evidence
 * - OSM: leisure relation/14549034; building relation/15446589 (outline
 *   way/1138119974, field wall way/1139111714); grandstand relation/8821488
 *   (rim way/26168840, intermediate walkway way/1341431806); part
 *   relation/18447234 (terrace rings way/1344491693, way/1344491681);
 *   El Palomar way/1138995241; the stone talud parts way/1341435744 and
 *   way/1341435745; the kiosk and bastion parts round the berm. Fitted in
 *   the turned frame about the field centre: field wall superellipse
 *   63.8 / 92.8 / n 2.3; walkway 82.3 / 110.4 / 2.2; rim circle r 120,
 *   centred 5.8 m west (so the west stand is 62 m deep, the east 50 m, the
 *   ends 27 m); foot of the upper talud ellipse 129.7 / 119.5 centred
 *   8.3 m west; terrace edge 137.3 / 128.5 centred 8.1 m west.
 *   OSM puts El Palomar 30° south of the west axis; every photo shows it
 *   centred on the west stand, so it is centred here.
 * - Published: Pérez Palacios' 1950 plan and section ("Estadio Olímpico
 *   Universitario - Plano 01.jpg", Revista Arquitectura No. 21, CC BY 3.0):
 *   field dug 7.5 m below the ground ("Vol. tepetate por excavar: 19000 ×
 *   7.5"), stands rising 15 m above it → rim ~22.5 m above the field on the
 *   high side, and the berm running ~45 m out down to the ground. So
 *   elevation −7.5 (the plaza 7.5 m above the field) and the west rim
 *   at 22.9 m. es.wikipedia: two large tiers with an intermediate level;
 *   Rivera's relief "La universidad, la familia y el deporte en México" on
 *   the taludes, unfinished; floodlight towers replaced for 1968.
 * - Estimated (photos): a single rake of 0.34 (gives the published rim on
 *   the west; east rim ~19 m, ends ~11 m); the terrace 3 m above the
 *   plaza (the tunnel kiosks, "planta alta", ProtoplasmaKid's tunnel 29
 *   photo); the press box 8.5 m tall; towers ~32 m above the rim with
 *   16 × 10 m heads; the north wall 52 × 10.5 m on 4.5 m pilotis; the
 *   mural ~65 m wide over most of the east talud's height; the east gate
 *   portico 42 × 17 m.
 * - Terrace and bastions are drawn, the plaza itself is not (ground).
 * - Terrain: Mapterhorn has no z15 tiles here (tools/terrain.ts 404s);
 *   the Pedregal round the stadium slopes gently. Not checked.
 * - Photos (Wikimedia Commons; EVIDENCE):
 *   o00/o01/o02/o03/o04 ProtoplasmaKid, "Estadio Olímpico Universitario -
 *     2026 - 01, 02, 05, 09, 13.jpg", CC BY 4.0, 2026-05-14 (drone, all
 *     sides; o00 and o04 from the east over the mural);
 *   o07 "Estadio Olímpico Universitario - aerial view.jpg", ProtoplasmaKid, CC BY-SA 4.0,
 *     2023 (from the north: the sign wall, El Palomar, the towers);
 *   o08 ProtoplasmaKid, "Entrada Estadio Olímpico Universitario.jpg",
 *     CC BY-SA 3.0, 2011 (the north sign wall on pilotis);
 *   o09 Arne Müseler, "Mexico city Estadio Olímpico Universitario 1.JPG",
 *     CC BY-SA 3.0 de, 2026;
 *   o10 Ehécatl Cabrera, "Estadio Olímpico Universitario de la UNAM.jpg",
 *     CC BY-SA 4.0, 2023 (from the plaza);
 *   o11 Espartaco Palma, "Estadio olimpico universitario.jpg", CC BY-SA 3.0,
 *     2011 (inside: the high west stand and El Palomar);
 *   o13 Luisalvaz, "Interior vacío del Estadio Olímpico Universitario de la
 *     UNAM 01.jpg", CC BY-SA 4.0, 2025;
 *   o16 ProtoplasmaKid, "Entrada al túnel 29 Estadio Olímpico
 *     Universitario..jpg", CC BY-SA 3.0, 2011 (a kiosk on the terrace);
 *   o17 Lepog, "Estadio Olímpico Universitario, Ciudad Universitaria,
 *     UNAM.jpg", CC BY-SA 4.0, 2019 (level, from the east);
 *   o05/o06 Revista Arquitectura No. 21, "Plano 01" and "Plano 03" (the
 *     1950 sketch section and the presentation model), CC BY 3.0.
 * - Look-only: none.
 * Colours from the daylight photos: white concrete rim and towers, mid
 *   grey concrete seats, dark grey basalt pulled to #6d6b68, terracotta for
 *   the red paving, kiosk roofs and the mural's red-brown, cream for the
 *   mural's figures.
 * Night: the stadium is dark except El Palomar's glazing (`window`).
 * Left out: the track and pitch (ground), the plaza paving, lettering and
 *   the UNAM shield, the flagpoles, the scoreboard, railings; the mural is
 *   drawn as its main masses (the eagle's cream wings over a red-brown
 *   body and band, the two athletes), not its drawing.
 * Doubts: every height except the field depth and the west rim is an
 *   estimate; the rake is one value all round; the exact plan of the stair
 *   bastions (12 drawn); El Palomar's position (OSM vs photos).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { quad } from './dc-nationals-park'
import { save } from './chi-aon-center'
import { arcAngles, at, hexa, loftRing, type Prof } from './mexico-city-estadio-azteca'

export const ANCHOR: [number, number] = [-99.192125, 19.331933]
export const BEARING = 8

/** Radius along ray t of an ellipse centred at (cx, 0) with half-axes a (x) and b (y). */
const ell = (cx: number, a: number, b: number) => (t: number) => {
  const c = Math.cos(t), s = Math.sin(t)
  const A = (c * c) / (a * a) + (s * s) / (b * b), B = (cx * c) / (a * a), C = (cx * cx) / (a * a) - 1
  return (B + Math.sqrt(B * B - A * C)) / A
}
const se = (a: number, b: number, n: number) => (t: number) =>
  Math.pow(Math.pow(Math.abs(Math.cos(t)) / a, n) + Math.pow(Math.abs(Math.sin(t)) / b, n), -1 / n)

function build() {
  const concrete = new Part(), seats = new Part(), basalt = new Part(), terra = new Part(), win = new Part(), cream = new Part()

  // Plan rings round the field centre, turned 8° (OSM fits; see header).
  const RF = se(63.8, 92.8, 2.3) // the field wall (way/1139111714)
  const RO = se(82.3, 110.4, 2.2) // the walkway between the tiers (way/1341431806)
  const RG = ell(-5.8, 120, 119.2) // the rim (way/26168840)
  const RC = ell(-8.3, 129.7, 119.5) // foot of the upper stone talud (way/1344491693)
  const RP = ell(-8.1, 137.3, 128.5) // outer edge of the terrace (way/1344491681)
  const K = 60
  const T = arcAngles(RG, K, Math.PI / K)
  const f = (R: (t: number) => number, d = 0) => (k: number) => R(T[k]) + d
  const PLAZA = 7.5 // the plaza round the stadium above the field (Pérez Palacios' section)
  const RAKE = 0.34
  // heights along each ray: the rim rises where the stand is deep (the
  // long sides, the west most of all) and dips at the ends.
  const zO = (k: number) => 2.2 + RAKE * (RO(T[k]) - RF(T[k]))
  const zRim = (k: number) => zO(k) + 1 + RAKE * (RG(T[k]) - 1.6 - RO(T[k]) - 2.5)
  const zT = (k: number) => Math.min(zRim(k) - 0.5, PLAZA + 3) // the terrace walkway, ~3 m above the plaza (photos)
  const toe = (k: number) => RP(T[k]) + 3.5 + 0.9 * (zT(k) - PLAZA)

  const prof: Prof[] = [{ r: f(RF), z: 0, part: concrete }, { r: f(RF), z: 2.2, part: seats }]
  const tier = (rA: (k: number) => number, zA: (k: number) => number, rB: (k: number) => number, zB: (k: number) => number, n: number, last: Part) => {
    for (let i = 1; i <= n; i++) {
      const u = i / n
      const r = (k: number) => rA(k) + u * (rB(k) - rA(k)), z = (k: number) => zA(k) + u * (zB(k) - zA(k))
      prof.push({ r, z: (k) => z(k) - 1, part: concrete }, { r, z, part: i === n ? last : seats })
    }
  }
  tier(f(RF), () => 2.2, f(RO), zO, 3, concrete) // lower tier
  prof.push({ r: f(RO, 2.5), z: zO, part: concrete }, { r: f(RO, 2.5), z: (k) => zO(k) + 1, part: seats }) // the intermediate walkway
  tier(f(RO, 2.5), (k) => zO(k) + 1, f(RG, -1.6), zRim, 4, concrete) // upper tier
  // the white rim parapet, then the stone taluds and the terrace between them
  prof.push(
    { r: f(RG, -1.6), z: (k) => zRim(k) + 1.2, part: concrete },
    { r: f(RG), z: (k) => zRim(k) + 1.2, part: concrete },
    { r: f(RG), z: (k) => Math.max(zT(k) + 0.3, zRim(k) - 1.5), part: basalt },
    { r: (k) => Math.max(RP(T[k]) - 1, RG(T[k]) + 0.01), z: zT, part: terra },
    { r: f(RP, 3.5), z: zT, part: basalt },
    { r: toe, z: PLAZA - 0.6, part: null },
  )
  loftRing(T, prof)

  // --- Diego Rivera's relief on the east talud, facing Insurgentes: a
  // dark red-brown field with the cream eagle (or condor) spreading its
  // wings over the centre and the two athletes at the sides, the relief
  // standing a little proud of the stone.
  {
    const kE = T.reduce((b, t, i) => (Math.cos(t) > Math.cos(T[b]) ? i : b), 0)
    const zb = zT(kE), zt = Math.max(zT(kE), zRim(kE) - 1.5)
    const tal = (t: number, v: number, off: number): V3 => at(t, RP(t) - 1 + v * (RG(t) - RP(t) + 1) + off, zb + v * (zt - zb))
    const panel = (p: Part, t0: number, t1: number, v0: number, v1: number, off: number, n = 4) => {
      for (let i = 0; i < n; i++) {
        const a = t0 + ((t1 - t0) * i) / n, b = t0 + ((t1 - t0) * (i + 1)) / n
        quad(p, [tal(a, v0, off), tal(b, v0, off), tal(b, v1, off), tal(a, v1, off)], [Math.cos((a + b) / 2), Math.sin((a + b) / 2), 0.5])
      }
    }
    const W = 0.28 // half the mural's span, radians (~58 m)
    // the eagle: two cream wings spreading from the centre over a red-brown
    // body and the serpent band along the foot
    panel(terra, -0.05, 0.05, 0.15, 0.8, 0.3, 1)
    panel(terra, -W + 0.04, W - 0.04, 0.08, 0.2, 0.3, 6)
    panel(cream, -0.17, -0.03, 0.4, 0.85, 0.35, 3)
    panel(cream, 0.03, 0.17, 0.4, 0.85, 0.35, 3)
    // the athletes, man and woman, at each side
    panel(cream, -0.22, -0.18, 0.15, 0.85, 0.4, 1)
    panel(cream, 0.18, 0.22, 0.15, 0.85, 0.4, 1)
  }

  // --- El Palomar: the press box along the top of the west stand,
  // glazed towards the field, with a red roof (OSM roof:colour indianred).
  {
    const n = 8, t0 = Math.PI - 0.36, t1 = Math.PI + 0.36
    const Tp = Array.from({ length: n + 1 }, (_, i) => t0 + ((t1 - t0) * i) / n)
    const kW = T.reduce((b, t, i) => (Math.cos(t) < Math.cos(T[b]) ? i : b), 0)
    const z0 = zRim(kW) - 1, z1 = zRim(kW) + 7.5
    const ri = (k: number) => RG(Tp[k]) - 7.5, ro = (k: number) => RG(Tp[k]) + 0.5
    loftRing(Tp, [
      { r: ri, z: z0, part: concrete }, { r: ri, z: z0 + 2.5, part: win }, { r: ri, z: z1 - 1.2, part: concrete },
      { r: ri, z: z1, part: terra }, { r: ro, z: z1, part: concrete }, { r: ro, z: z0, part: null },
    ], false)
    // the ends
    for (const k of [0, n]) {
      const t = Tp[k], s = k === 0 ? -1 : 1, out: V3 = [-Math.sin(t) * s, Math.cos(t) * s, 0]
      quad(concrete, [at(t, ri(k), z0), at(t, ro(k), z0), at(t, ro(k), z1), at(t, ri(k), z1)], out)
    }
  }

  // --- The north end: the tall white wall on pilotis over the gate,
  // "Estadio Olímpico Universitario" and the UNAM shield (lettering left out).
  {
    const kN = T.reduce((b, t, i) => (Math.sin(t) > Math.sin(T[b]) ? i : b), 0)
    const y = RG(Math.PI / 2) + 1.5, z0 = zRim(kN) + 0.5
    const half = 26
    for (let i = 0; i < 6; i++) {
      const x = -half + 3 + (i * (2 * half - 6)) / 5
      hexa(concrete, [[x - 0.6, y - 0.6, z0 - 6], [x + 0.6, y - 0.6, z0 - 6], [x + 0.6, y + 0.6, z0 - 6], [x - 0.6, y + 0.6, z0 - 6]], [[x - 0.6, y - 0.6, z0 + 4.5], [x + 0.6, y - 0.6, z0 + 4.5], [x + 0.6, y + 0.6, z0 + 4.5], [x - 0.6, y + 0.6, z0 + 4.5]])
    }
    const w = (z: number, dy: number): V3[] => [[-half, y - 1.4 + dy, z], [half, y - 1.4 + dy, z], [half, y + 1.4 + dy, z], [-half, y + 1.4 + dy, z]]
    hexa(concrete, w(z0 + 4.5, 0), w(z0 + 15, 0), true)
    quad(terra, [[-half, y - 1.4, z0 + 15.01], [half, y - 1.4, z0 + 15.01], [half, y + 1.4, z0 + 15.01], [-half, y + 1.4, z0 + 15.01]], [0, 0, 1])
  }

  // --- The four floodlight towers (1968): concrete shafts standing on the
  // terrace behind the rim, with white lattice heads tilted to the field
  // (drawn solid).
  for (const t of [1.12, -1.12, Math.PI - 1.12, Math.PI + 1.12]) {
    const k = T.reduce((b, tt, i) => (Math.abs(Math.atan2(Math.sin(tt - t), Math.cos(tt - t))) < Math.abs(Math.atan2(Math.sin(T[b] - t), Math.cos(T[b] - t))) ? i : b), 0)
    const r = RG(t) + 3.5, zb = zT(k) - 0.5, top = zRim(k) + 32
    const c = at(t, r, 0), u: V3 = [Math.cos(t), Math.sin(t), 0], v: V3 = [-Math.sin(t), Math.cos(t), 0]
    const P = (du: number, dv: number, z: number): V3 => [c[0] + u[0] * du + v[0] * dv, c[1] + u[1] * du + v[1] * dv, z]
    hexa(concrete, [P(-1.6, -1.6, zb), P(1.6, -1.6, zb), P(1.6, 1.6, zb), P(-1.6, 1.6, zb)], [P(-1.1, -1.1, top - 9), P(1.1, -1.1, top - 9), P(1.1, 1.1, top - 9), P(-1.1, 1.1, top - 9)])
    // the head: a lattice frame 16 × 11 m (drawn solid), leaning back from the field
    hexa(concrete, [P(-1.5, -8, top - 10), P(-1.5, 8, top - 10), P(1, 8, top - 10), P(1, -8, top - 10)], [P(2.5, -8, top), P(2.5, 8, top), P(5, 8, top), P(5, -8, top)], true)
  }

  // --- The tunnel kiosks on the terrace: small stone boxes with red roofs
  // over the stairs down to the vomitories.
  for (let i = 0; i < 16; i++) {
    const t = ((i + 0.5) / 16) * 2 * Math.PI
    const k = T.reduce((b, tt, j) => (Math.abs(Math.atan2(Math.sin(tt - t), Math.cos(tt - t))) < Math.abs(Math.atan2(Math.sin(T[b] - t), Math.cos(T[b] - t))) ? j : b), 0)
    const r = RP(t) + 1.2, z = zT(k)
    const c = at(t, r, 0), u: V3 = [Math.cos(t), Math.sin(t), 0], v: V3 = [-Math.sin(t), Math.cos(t), 0]
    const P = (du: number, dv: number, zz: number): V3 => [c[0] + u[0] * du + v[0] * dv, c[1] + u[1] * du + v[1] * dv, zz]
    hexa(basalt, [P(-2.5, -3, z - 0.3), P(2.5, -3, z - 0.3), P(2.5, 3, z - 0.3), P(-2.5, 3, z - 0.3)], [P(-2.5, -3, z + 2.6), P(2.5, -3, z + 2.6), P(2.5, 3, z + 2.6), P(-2.5, 3, z + 2.6)])
    hexa(terra, [P(-3, -3.5, z + 2.6), P(3, -3.5, z + 2.6), P(3, 3.5, z + 2.6), P(-3, 3.5, z + 2.6)], [P(-3, -3.5, z + 3.1), P(3, -3.5, z + 3.1), P(3, 3.5, z + 3.1), P(-3, 3.5, z + 3.1)], true)
  }

  // --- The stair bastions: wedges of stone pushing out from the terrace
  // to the plaza, flat-topped in red paving, between the tunnel kiosks.
  for (let i = 0; i < 12; i++) {
    const t = ((i + 0.5) / 12) * 2 * Math.PI
    if (Math.cos(t) > 0.97) continue // the east gate
    const k = T.reduce((b, tt, j) => (Math.abs(Math.atan2(Math.sin(tt - t), Math.cos(tt - t))) < Math.abs(Math.atan2(Math.sin(T[b] - t), Math.cos(T[b] - t))) ? j : b), 0)
    const r0 = RP(t) + 2, r1 = RP(t) + 15, z = zT(k) - 0.4
    const u: V3 = [Math.cos(t), Math.sin(t), 0], v: V3 = [-Math.sin(t), Math.cos(t), 0]
    const P = (r: number, dv: number, zz: number): V3 => [u[0] * r + v[0] * dv, u[1] * r + v[1] * dv, zz]
    const ring = (zz: number, d = 0): V3[] => [P(r0, -8 - d, zz), P(r1 + d, -3.5 - d, zz), P(r1 + d, 3.5 + d, zz), P(r0, 8 + d, zz)]
    hexa(basalt, ring(PLAZA - 0.6), ring(z))
    hexa(terra, ring(z), ring(z + 0.3))
  }

  // --- The east gate on the plaza, on the axis under the mural: a long
  // low portico with a red roof over the entrance stair.
  {
    const kE = T.reduce((b, t, i) => (Math.cos(t) > Math.cos(T[b]) ? i : b), 0)
    const x0 = toe(kE) - 2, x1 = x0 + 17, h = 21
    const B = (z: number): V3[] => [[x0, -h, z], [x1, -h, z], [x1, h, z], [x0, h, z]]
    hexa(basalt, B(PLAZA - 0.5), B(PLAZA + 3.6))
    hexa(terra, [[x0 - 0.5, -h - 0.5, PLAZA + 3.6], [x1 + 0.5, -h - 0.5, PLAZA + 3.6], [x1 + 0.5, h + 0.5, PLAZA + 3.6], [x0 - 0.5, h + 0.5, PLAZA + 3.6]], [[x0 - 0.5, -h - 0.5, PLAZA + 4.4], [x1 + 0.5, -h - 0.5, PLAZA + 4.4], [x1 + 0.5, h + 0.5, PLAZA + 4.4], [x0 - 0.5, h + 0.5, PLAZA + 4.4]], true)
  }

  return [
    { part: concrete, material: finish('cu-concrete', 0xe8e4dc) },
    { part: seats, material: finish('cu-seats', 0xa2a3a0) },
    { part: basalt, material: finish('cu-basalt', 0x6d6b68) },
    { part: terra, material: PALETTE.terracotta },
    { part: win, material: PALETTE.window },
    { part: cream, material: finish('cu-mural-cream', 0xe6d6b4) },
  ]
}

if (import.meta.main) {
  const parts = build()
  for (const { part, material } of parts) console.log(material.name.padEnd(18), part.triangles)
  await save('mexico-city-estadio-olimpico-universitario', 'Estadio Olímpico Universitario', ANCHOR, BEARING, parts, 6500)
}
