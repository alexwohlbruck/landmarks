/**
 * Torre Mayor (Paseo de la Reforma 505, 2003, Zeidler Partnership / Adamson
 * Associates; structure Cantor Seinuk), Mexico City — original procedural
 * geometry, CC0-1.0.
 * bun generators/mexico-city-torre-mayor.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = area centroid of the OSM outline way/217330156,
 * 19.42435,-99.175301. Bearing 0: the OSM parts are used as they are, in
 * true east/north metres (the tower's long axis runs at 66°).
 *
 * Identity, in order: the tall convex wall of blue-green glass facing
 * Reforma (south-east), wrapped past both ends of the stone slab behind
 * it; its crown, a steep sloped glass plane that cuts the curved wall in a
 * U and rises to a peak at the back, lit in colour at night; the pale
 * grey-white stone slab with punched windows behind (north-west face and
 * both ends); the low stone-and-glass podium wrapping the north side.
 *
 * Plan (OSM, all parts of way/217330156):
 *  - the stone slab, way/1173145877: 50.7 × 19 m rectangle;
 *  - the curved glass front, way/1173145878: the lens between the slab's
 *    south-east face and the curved wall, running 5 m past the slab's
 *    south-west end and 16 m past its north-east end;
 *  - the crown: way/1187884777 (curved region bulging north-west inside
 *    the slab, the glass crown drum seen from behind) and way/1151277352
 *    (inside it);
 *  - the podium: way/1137741009 (10 levels), /1137741010 (11),
 *    /1137741011 (8), /1137741012 and /1137741013 (3), /1137741007 and
 *    /1137741008 (2), at ~4 m a level (Delso's DD 11 shows the 10-level
 *    part ~39 m high).
 *
 * Heights: 225 m to the top of the crown, 55 storeys (published, CTBUH
 * and Wikipedia; OSM tags 215/228/230/235 m on the parts, which overshoot
 * the published top, so they were not used). The slab's roof ~196 m:
 * photo-scaled on JavierDo's distant view from Chapultepec Castle and
 * Diego Delso's DD 11. The crown is a sail (review round 1): the curved
 * wall's top edge falls in a convex arc from 209 m at its south-west end
 * to 172 m at its north-east tip, and the glass top behind it rises to a
 * sharp peak of 225 m (published top) at the slab's south corner, where
 * DD 11 (taken from the south-east) and the castle view (west-south-west)
 * both show the peak standing clear beside the stone. Behind, the glass
 * drum (OSM way/1187884777) has a level top at 206 m (rear photo). The lens
 * top never falls below the drum's top at the slab face, which gives the
 * sloped crown face seen from Reforma (Valenzuela 1612). Estimated from
 * the photos.
 *
 * Colour: the glass reads blue-green (teal) in every daylight photo,
 * pulled light (#7fa9aa) per STYLE; the dark horizontal lines every ~4
 * storeys on the curved wall are drawn as bands (#5d8085); the stone
 * light warm grey-white (#e7e4df, from DD 11 and the rear photo; review
 * round 1); the punched windows teal-grey. The crown's sloped
 * glass is lit in colour at night (ProtoplasmaKid's night view), so it is
 * a `neon` material in its day colour.
 *
 * Terrain: Mapterhorn has no z15 tiles here (tools/terrain.ts 404s); the
 * site is on the flat lake-bed basin (~2,240 m). Modelled level.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Torre_Mayor,_México_D.F.,_México,_2014-10-13,_DD_11.JPG, Diego Delso,
 *    CC BY-SA 3.0
 *    https://commons.wikimedia.org/wiki/File:Torre_Mayor,_M%C3%A9xico_D.F.,_M%C3%A9xico,_2014-10-13,_DD_11.JPG
 *  - Estela_de_Luz_y_Torre_Mayor,_México_D.F.,_México,_2014-10-13,_DD_02.JPG,
 *    Diego Delso, CC BY-SA 3.0
 *    https://commons.wikimedia.org/wiki/File:Estela_de_Luz_y_Torre_Mayor,_M%C3%A9xico_D.F.,_M%C3%A9xico,_2014-10-13,_DD_02.JPG
 *  - Torre_Mayor_desde_el_Castillo_de_Chapultepec_-_panoramio.jpg, JavierDo,
 *    CC BY-SA 3.0
 *    https://commons.wikimedia.org/wiki/File:Torre_Mayor_desde_el_Castillo_de_Chapultepec_-_panoramio.jpg
 *  - Torre_Mayor,_parte_trasera_-_panoramio.jpg, JavierDo, CC BY-SA 3.0
 *    https://commons.wikimedia.org/wiki/File:Torre_Mayor,_parte_trasera_-_panoramio.jpg
 *  - Torre_Mayor_y_anexo.JPG, Felipe Alfonso Castillo Vázquez, CC BY-SA 3.0
 *    https://commons.wikimedia.org/wiki/File:Torre_Mayor_y_anexo.JPG
 *  - Torre_Mayor_y_Torre_Reforma1612.jpg, Carlos Valenzuela, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:Torre_Mayor_y_Torre_Reforma1612.jpg
 *  - East_Skyline_Torre_Mayor_Reforma_-_panoramio.jpg, JAGarcia, CC BY 3.0
 *    https://commons.wikimedia.org/wiki/File:East_Skyline_Torre_Mayor_Reforma_-_panoramio.jpg
 *  - Paseo_de_la_Reforma_Torre_Reforma,_Chapultepec_Uno_and_Torre_Mayor.jpg,
 *    Tyrv, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:Paseo_de_la_Reforma_Torre_Reforma,_Chapultepec_Uno_and_Torre_Mayor.jpg
 *  - Vista_aérea_de_la_Ciudad_de_México_desde_el_Auditorio_Nacional_10.jpg,
 *    ProtoplasmaKid, CC BY 4.0 (night)
 *    https://commons.wikimedia.org/wiki/File:Vista_a%C3%A9rea_de_la_Ciudad_de_M%C3%A9xico_desde_el_Auditorio_Nacional_10.jpg
 * Look-only: none. No commercial imagery.
 *
 * Doubts: the crown plane is fitted by eye to photos from three sides (its
 * exact tilt is an estimate); the slab's roof height; the south-west end's
 * bronze service shaft (Delso DD 02) is drawn as plain stone; the podium
 * heights are from level counts. The entrance arch under the curved wall
 * is left out.
 *
 * Left out: the crown's ring of posts and window-cleaning crane, mullions,
 * the entrance arch, the Ixe/Mayor lettering.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { area, cap, inset, panel, rows, save, triangulate, walls, type XY } from './chi-aon-center'

const ANCHOR: [number, number] = [19.42435, -99.175301]
const BEARING = 0
const SLAB = 196 // the stone slab's roof
const FLOOR = 225 / 55

// The stone slab (way/1173145877): W, S, E, N corners.
const P1: XY = [-24.79, -7.14], P2: XY = [-17.84, -24.09], P3: XY = [28.47, -3.5], P4: XY = [19.63, 14.03]
// The curved front (way/1173145878), from the SW tip to the NE tip.
const FRONT: XY[] = [[-22.91, -36.29], [-20.28, -36.49], [-16.49, -36.72], [-12.14, -36.92], [-7.92, -36.93], [-2.83, -36.66], [3.0, -35.7], [5.48, -35.0], [11.15, -33.15], [17.4, -30.41], [22.4, -27.58], [25.81, -25.06], [29.12, -22.25], [32.78, -18.98], [36.21, -15.43], [39.02, -12.29], [40.57, -10.22], [42.61, -7.21], [44.17, -4.36]]
// The crown drum's back (way/1187884777), from its SW foot to its NE foot.
const DRUM: XY[] = [[-15.38, -22.99], [-18.24, -16.1], [-17.68, -13.09], [-16.42, -9.9], [-14.01, -6.28], [-11.5, -3.2], [-8.56, -0.49], [-4.39, 2.11], [-1.04, 3.45], [3.09, 4.65], [6.64, 5.19], [11.47, 5.01], [16.0, 4.42], [19.85, 3.23], [22.85, 2.11], [25.99, -4.6]]

// The crown is a sail: the curved wall's top edge falls along the curve
// from the south-west end (SW_TOP) to the north-east tip (NE_TOP), and the
// lens's top rises behind it to a sharp peak (PEAK) at the slab's south
// corner P2, standing clear of the glass drum (DRUM_TOP) behind it.
const PEAK = 225, SW_TOP = 209, NE_TOP = 172, DRUM_TOP = 206
const zf = (t: number) => NE_TOP + (SW_TOP - NE_TOP) * (1 - t * t)
// The lens top rises from the curved edge back to the slab face, never
// below the drum's top there (the sloped crown face seen from Reforma).
const zb = (t: number) => Math.max(DRUM_TOP, zf(t) + (PEAK - SW_TOP) * Math.pow(1 - t, 1.6))
/** n+1 points at equal arc length along a polyline. */
function resample(r: XY[], n: number): XY[] {
  const seg = r.slice(1).map((b, i) => Math.hypot(b[0] - r[i][0], b[1] - r[i][1])), L = seg.reduce((x, y) => x + y, 0)
  const out: XY[] = []
  for (let k = 0; k <= n; k++) {
    let d = (L * k) / n, i = 0
    while (i < seg.length - 1 && d > seg[i]) { d -= seg[i]; i++ }
    const t = Math.min(1, d / seg[i])
    out.push([r[i][0] + (r[i + 1][0] - r[i][0]) * t, r[i][1] + (r[i + 1][1] - r[i][1]) * t])
  }
  return out
}

// Podium parts (OSM), with heights at ~4 m a level.
const PODIUM: [number, XY[]][] = [
  [40, [[-25.39, -37.56], [-24.92, -37.34], [-22.91, -36.29], [-17.84, -24.09], [-24.79, -7.14], [19.63, 14.03], [28.47, -3.5], [44.17, -4.36], [46.15, -3.3], [46.29, -3.2], [40.56, 8.14], [33.04, 23.02], [30.93, 27.18], [19.03, 21.55], [15.57, 28.51], [-29.77, 7.07], [-32.19, 5.92], [-28.64, -1.55], [-40.22, -7.3]]],
  [44, [[15.57, 28.51], [19.03, 21.55], [30.93, 27.18], [23.51, 41.83], [20.82, 41.69], [16.75, 41.2], [13.62, 40.43], [10.16, 39.35], [-38.28, 15.59], [-40.56, 13.82], [-42.5, 11.39], [-44.11, 8.87], [-45.29, 6.09], [-45.85, 4.18], [-40.22, -7.3], [-28.64, -1.55], [-32.19, 5.92], [-29.77, 7.07]]],
  [32, [[-45.85, 4.18], [-50.61, 13.9], [19.5, 49.77], [23.51, 41.83], [20.82, 41.69], [16.75, 41.2], [13.62, 40.43], [10.16, 39.35], [-38.28, 15.59], [-40.56, 13.82], [-42.5, 11.39], [-44.11, 8.87], [-45.29, 6.09]]],
  [12, [[-24.92, -37.34], [-22.91, -36.29], [-20.28, -36.49], [-15.25, -46.62], [-12.64, -45.39], [-11.41, -47.95], [-9.15, -46.81], [-7.99, -49.35], [-16.78, -53.9]]],
  [12, [[46.15, -3.3], [44.17, -4.36], [43.01, -6.49], [47.84, -16.38], [45.27, -17.66], [46.54, -20.19], [44.24, -21.27], [45.55, -23.74], [54.34, -19.55]]],
  [8, [[-22.91, -36.29], [-24.92, -37.34], [-25.39, -37.56], [-17.07, -54.55], [-7.61, -49.66], [-7.92, -36.93], [-12.14, -36.92], [-16.49, -36.72], [-20.28, -36.49]]],
  [8, [[36.21, -15.43], [45.4, -24.11], [54.69, -19.8], [53.29, -17.02], [46.29, -3.2], [46.15, -3.3], [44.17, -4.36], [43.01, -6.49], [42.61, -7.21], [40.57, -10.22], [39.02, -12.29]]],
]

const ccw = (r: XY[]) => (area(r) < 0 ? r.slice().reverse() : r)
const q = (p: XY, z: number): V3 => [p[0], p[1], z]

function build() {
  const stone = new Part(), glass = new Part(), punched = new Part(), bands = new Part(), crownGlass = new Part(), roof = new Part()

  // --- The curved glass front and its sail crown.
  const NS = 36
  const F = resample(FRONT, NS)
  const E: XY[] = Array.from({ length: NS + 1 }, (_, k) => [P2[0] + (P3[0] - P2[0]) * k / NS, P2[1] + (P3[1] - P2[1]) * k / NS] as XY)
  const T = (k: number) => k / NS
  for (let k = 0; k < NS; k++) {
    glass.quad(q(F[k], 0), q(F[k + 1], 0), q(F[k + 1], zf(T(k + 1))), q(F[k], zf(T(k))))
    // The lens top: a ruled strip from the curved wall's edge back to the slab face.
    crownGlass.quad(q(F[k], zf(T(k))), q(F[k + 1], zf(T(k + 1))), q(E[k + 1], zb(T(k + 1))), q(E[k], zb(T(k))))
  }
  glass.quad(q(P2, 0), q(F[0], 0), q(F[0], zf(0)), q(P2, zb(0))) // SW end face, rising to the peak
  glass.quad(q(F[NS], 0), q(P3, 0), q(P3, zb(1)), q(F[NS], zf(1))) // NE end face
  // Where the lens meets the slab: the sail's back face above whatever is
  // behind (the drum, or the slab roof at its two ends), or the slab's and
  // drum's south-east faces above the lens.
  const along = (p: XY) => ((p[0] - P2[0]) * (P3[0] - P2[0]) + (p[1] - P2[1]) * (P3[1] - P2[1])) / ((P3[0] - P2[0]) ** 2 + (P3[1] - P2[1]) ** 2)
  const t0 = along(DRUM[0]), t1 = along(DRUM[DRUM.length - 1])
  for (let k = 0; k < NS; k++) {
    const a = E[k], b = E[k + 1], za = zb(T(k)), zbb = zb(T(k + 1)), tm = (T(k) + T(k + 1)) / 2
    const hb = tm > t0 && tm < t1 ? DRUM_TOP : SLAB
    if (Math.max(za, zbb) > hb) glass.quad(q(b, hb), q(a, hb), q(a, Math.max(hb, za)), q(b, Math.max(hb, zbb)))
    if (Math.min(za, zbb) < hb) {
      if (Math.min(za, zbb) < SLAB) stone.quad(q(a, Math.min(za, SLAB)), q(b, Math.min(zbb, SLAB)), q(b, SLAB), q(a, SLAB))
      if (hb > SLAB) glass.quad(q(a, Math.max(za, SLAB)), q(b, Math.max(zbb, SLAB)), q(b, hb), q(a, hb))
    }
  }
  // The glass drum behind: its curved back above the slab roof, a flat top.
  for (let i = DRUM.length - 1; i > 0; i--) glass.quad(q(DRUM[i], SLAB - 0.8), q(DRUM[i - 1], SLAB - 0.8), q(DRUM[i - 1], DRUM_TOP), q(DRUM[i], DRUM_TOP))
  {
    const r = ccw(DRUM)
    for (const [x, y, z] of triangulate(r)) crownGlass.tri(q(r[x], DRUM_TOP), q(r[y], DRUM_TOP), q(r[z], DRUM_TOP))
  }

  // Dark floor bands across the curved wall every four storeys.
  for (let z = 4 * FLOOR * 2; z < 222; z += 4 * FLOOR) {
    for (let k = 0; k < NS; k++) {
      if (Math.min(zf(T(k)), zf(T(k + 1))) < z + 1.2) continue
      panel(bands, F[k], F[k + 1], 0, Math.hypot(F[k + 1][0] - F[k][0], F[k + 1][1] - F[k][1]), z, z + 0.8, 0.06)
    }
  }

  // --- The stone slab: north-west face and both ends, rear corners bevelled.
  const C = 0.9
  const cut = (a: XY, b: XY, t: number): XY => { const l = Math.hypot(b[0] - a[0], b[1] - a[1]); return [a[0] + (b[0] - a[0]) * t / l, a[1] + (b[1] - a[1]) * t / l] }
  const rear: XY[] = [P3, cut(P4, P3, C), cut(P4, P1, C), cut(P1, P4, C), cut(P1, P2, C), P2] // open: E → N → W → S
  for (let i = 0; i + 1 < rear.length; i++) stone.quad(q(rear[i], 0), q(rear[i + 1], 0), q(rear[i + 1], SLAB), q(rear[i], SLAB))
  // Parapet lip and the roof inside the drum.
  {
    const r: XY[] = [...rear, ...DRUM]
    // r runs P3 … P2 then the drum from its SW foot to its NE foot: the roof outside the drum.
    const ring = ccw(r)
    for (const [a, b, c] of triangulate(ring)) roof.tri(q(ring[a], SLAB - 0.8), q(ring[b], SLAB - 0.8), q(ring[c], SLAB - 0.8))
    for (let i = 0; i + 1 < rear.length; i++) {
      const a = rear[i], b = rear[i + 1], l = Math.hypot(b[0] - a[0], b[1] - a[1])
      const n: XY = [-(b[1] - a[1]) / l * 0.6, (b[0] - a[0]) / l * 0.6] // inward
      const a2: XY = [a[0] + n[0], a[1] + n[1]], b2: XY = [b[0] + n[0], b[1] + n[1]]
      stone.quad(q(a, SLAB), q(b, SLAB), q(b2, SLAB), q(a2, SLAB))
      stone.quad(q(b2, SLAB), q(b2, SLAB - 0.8), q(a2, SLAB - 0.8), q(a2, SLAB))
    }
  }
  // Punched windows, grouped: one panel per bay over three storeys.
  const groups = rows(44, SLAB - 2, Math.round((SLAB - 46) / (3 * FLOOR)), 2.2)
  for (let i = 0; i + 1 < rear.length; i++) {
    const a = rear[i], b = rear[i + 1], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 5) continue
    const k = Math.round((L - 2) / 2.9), w = 1.5, pitch = (L - 2) / k
    for (let j = 0; j < k; j++) {
      const s = 1 + pitch * (j + 0.5)
      for (const [z0, z1] of groups) panel(punched, a, b, s - w / 2, s + w / 2, z0, z1, 0.05)
    }
  }

  // --- The podium.
  for (const [h, r0] of PODIUM) {
    const r = ccw(r0)
    walls(stone, r, 0, h)
    for (const [a, b, c] of triangulate(r)) roof.tri(q(r[a], h), q(r[b], h), q(r[c], h))
    // Window bands, two storeys each, on long outer walls of the taller parts.
    if (h < 12) continue
    for (let i = 0; i < r.length; i++) {
      const a = r[i], b = r[(i + 1) % r.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
      if (L < 6) continue
      for (const [z0, z1] of rows(4, h - 2, Math.max(1, Math.round((h - 6) / 8)), 2.2)) panel(punched, a, b, 1, L - 1, z0, z1, 0.05)
    }
  }

  return [
    { part: stone, material: finish('mayor-stone', 0xe7e4df) },
    { part: glass, material: { ...PALETTE.window, color: 0x7fa9aa } },
    { part: punched, material: windowVariant(2, 0x6a888e) },
    { part: bands, material: finish('mayor-bands', 0x5d8085) },
    { part: crownGlass, material: finish('neon-mayor-crown', 0x8fbab4) },
    { part: roof, material: PALETTE.roof },
  ]
}

if (import.meta.main) await save('mexico-city-torre-mayor', 'Torre Mayor', ANCHOR, BEARING, build(), 6500)
