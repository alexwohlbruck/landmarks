/**
 * Torre Latinoamericana (Eje Central Lázaro Cárdenas 2 at Madero, 1956,
 * Augusto H. Álvarez; structure Adolfo Zeevaert and Nathan Newmark),
 * Mexico City — original procedural geometry, CC0-1.0.
 * bun generators/mexico-city-torre-latinoamericana.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = centroid of the OSM outline way/1095452896,
 * 19.433866,-99.140611. Its walls run at 8.2° / 98.2°, so the catalog
 * bearing is 8.2 and the model is square to its own frame. Every tier in
 * OSM is centred on the same point to within 0.2 m, so the model is too.
 *
 * Identity, in order: the slender pale blue-grey glass shaft banded by thin
 * dark-blue floor lines; the projecting cornice with the blue
 * "LATINOAMERICANA" sign band; above it the stacked observation crown, a
 * steel-framed glass tier with white posts, a white storey band, then the
 * glazed lantern with leaning sides; the tall mast on four splayed legs, a
 * thick lattice column topped by a thinner needle; at the foot the two
 * wider tiers of the base. At night the sign band and the cornice lip under
 * it are lit and the crown glows, while the shaft stays mostly dark
 * (Adrián Cerón's night photo). So the crown's glazing is `window`, the
 * sign `neon-*`, the lip carries `floodlight`, and the shaft's glass is a
 * plain finish rather than a `window*` material — a deliberate departure
 * from the usual curtain-wall rule, to match the night photo.
 *
 * Evidence:
 *  - plan: OSM relation/6071992 (source SIGCDMX): outline way/1095452896
 *    33.5 × 38.1 m; tier rings way/405052559 27.4 × 26.4 m,
 *    way/405052560 24.3 × 22.5 m (the shaft), way/405052558 20.1 × 18.2 m
 *    (the crown), way/405052561 10.9 × 9.5 m (top of the lantern),
 *    way/528548025 the mast, ~1.3 m across.
 *  - heights: published 166 m architectural, 182 m to the tip (see the aerial below), 44 floors
 *    (en/es Wikipedia; es: "134 m for the 44 floors" plus the rod). OSM's
 *    tier heights (33 / 54 / 160 / 176 / 182 m, mast to 204 m) overshoot
 *    the published tip by 12 %, so the tiers were measured instead on
 *    Thomas Ledl's level, distant, perspective-corrected view from the
 *    Bellas Artes plaza, scaled by the published 182 m tip (3.79 px/m at
 *    900 px): base tier ~26 m, second tier ~43 m, cornice ~128 m, sign
 *    band top ~132 m, lantern top ~145 m, thick mast top ~167 m (published
 *    166 m architectural height: used), needle 182 m (the aerial is now
 *    ~196 m: review round 1, below). Crown stages from
 *    Diego Delso's frontal telephoto (DD 11), scaled by the 18.7 m width of
 *    the framed tier (OSM 20.1 m): framed glass tier ~6 m, white storey
 *    ~2.6 m, lantern ~6 m (13 m wide at its foot, 11 m at the top), mast
 *    legs ~9 m. The two photos agree on the crown to ~2 m.
 *  - review round 1 (shaft ratio, mast): measured on Delso's near-
 *    orthographic telephoto (DD 11, 1920 px) by scanning the silhouette
 *    row by row: the shaft is a constant 354 px wide for the ~30 floors
 *    below the sign band (no setbacks there; Ledl's view shows the same
 *    straight edges), the mast column 37–41 px, the legs spread to 194 px,
 *    the lantern 274–303 px with its railings. In shaft widths F above the
 *    sign band's foot: lantern top 0.73 F, column top 1.47 F, aerial tip
 *    2.82 F. The column top (1.47 F ≈ 36 m → ~165 m) agrees with the
 *    published 166 m architectural height when F is OSM's 24.3 × 22.5 m
 *    ring, and Ledl's diagonal width (31.7 m against 33.0 m predicted for
 *    that ring, 26.9 m for the 20.1 × 18.2 ring) confirms it, as does the
 *    floor area (27,700 m² over 44 floors). So the shaft ring was right;
 *    what was wrong was the aerial: DD 11 shows ~33 m of aerial mast with
 *    dipole arms over the column, so the tip is now ~196 m (OSM tags
 *    204 m) instead of the published 182 m, which predates the current
 *    aerials (estimate; doubt). The mast and its legs are drawn bolder.
 *  - colour: the shaft reads silver-grey in daylight (cool grey glass,
 *    #9aa6b0) with a thin dark line at every floor and pale aluminium
 *    corners; grouped here as a dark floor band every three floors (~9 m)
 *    so it doesn't shimmer, and 1.1 m aluminium corner piers. The sign band
 *    is blue with white letters (letters left out). Roofs and the mast
 *    grey.
 *  - terrain: Mapterhorn has no z15 tiles here (tools/terrain.ts 404s); the
 *    Centro sits on the flat lake-bed basin (~2,240 m). The building is
 *    modelled level.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Mexico_df_-_Torre_Latinoamerica.jpg, Thomas Ledl, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:Mexico_df_-_Torre_Latinoamerica.jpg
 *  - Torre_Latinoamericana,_Ciudad_de_México,_México,_2015-07-18,_DD_11.JPG,
 *    Diego Delso, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:Torre_Latinoamericana,_Ciudad_de_M%C3%A9xico,_M%C3%A9xico,_2015-07-18,_DD_11.JPG
 *  - Torre_Latinoamericana_from_Alameda_Central_promenade.jpg, Daniel Case,
 *    CC BY-SA 3.0
 *    https://commons.wikimedia.org/wiki/File:Torre_Latinoamericana_from_Alameda_Central_promenade.jpg
 *  - View_of_Torre_Latinoamericana_from_Palacio_de_Bellas_Artes_-_Mexico_2024.jpg,
 *    José Luiz, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:View_of_Torre_Latinoamericana_from_Palacio_de_Bellas_Artes_-_Mexico_2024.jpg
 *  - Latinoamerica_tower,_Mexico_City_2022_p2.jpg, Carlos Valenzuela,
 *    CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:Latinoamerica_tower,_Mexico_City_2022_p2.jpg
 *  - Torre_Latinoamericana_de_lejos.jpg, Fer9324, CC BY 4.0
 *    https://commons.wikimedia.org/wiki/File:Torre_Latinoamericana_de_lejos.jpg
 *  - Torre_Latinoamericana_durante_la_noche.JPG, Adrián Cerón, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:Torre_Latinoamericana_durante_la_noche.JPG
 * Look-only: none. No commercial imagery.
 *
 * Doubts: the base tiers' heights are photo-scaled (OSM says 33 and 54 m;
 * José Luiz's close view agrees better with OSM, Ledl's distant one with
 * the values used). The south and east sides of the base were only seen
 * obliquely; the base is modelled as OSM's plain rectangle.
 *
 * Left out: the lettering, the crown's railings and dishes, the mast's
 * lattice and aerials, mullions.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cap, chamfer, inset, panel, rect, save, walls, type XY } from './chi-aon-center'

const ANCHOR: [number, number] = [19.433866, -99.140611]
const BEARING = 8.2
const SHAFT = 128 // the cornice

/** A chamfered rectangle centred on the origin. */
const ring = (hx: number, hy: number, c: number): XY[] => chamfer(rect(-hx, -hy, hx, hy), c)

/** The flat top between two rings with the same corner count, facing up. */
function annulus(p: Part, outer: XY[], inner: XY[], z: number) {
  for (let k = 0; k < outer.length; k++) {
    const j = (k + 1) % outer.length
    p.quad([outer[k][0], outer[k][1], z], [outer[j][0], outer[j][1], z], [inner[j][0], inner[j][1], z], [inner[k][0], inner[k][1], z])
  }
}

/** A square-section member of width w from A to B. */
function beam(p: Part, A: V3, B: V3, w: number) {
  const d: V3 = [B[0] - A[0], B[1] - A[1], B[2] - A[2]], l = Math.hypot(...d), t: V3 = [d[0] / l, d[1] / l, d[2] / l]
  const ref: V3 = Math.abs(t[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0]
  const cr = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
  const nz = (a: V3): V3 => { const m = Math.hypot(...a); return [a[0] / m, a[1] / m, a[2] / m] }
  const u = nz(cr(t, ref)), v = cr(t, u), h = w / 2
  const sec = (P: V3) => [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([a, b]) => [P[0] + (u[0] * a + v[0] * b) * h, P[1] + (u[1] * a + v[1] * b) * h, P[2] + (u[2] * a + v[2] * b) * h] as V3)
  const s0 = sec(A), s1 = sec(B)
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    p.quad(s0[i], s0[j], s1[j], s1[i])
  }
  p.quad(s1[0], s1[1], s1[2], s1[3])
  p.quad(s0[3], s0[2], s0[1], s0[0])
}

function build() {
  const glass = new Part(), dark = new Part(), trim = new Part(), blue = new Part(), sign = new Part(), roof = new Part()

  const C = 1.1 // corner bevel: the pale aluminium corner piers
  const FLOOR = 3.0

  /** Curtain-wall walls on a chamfered ring: glass faces, trim corners, blue bands. */
  const curtain = (r: XY[], z0: number, z1: number, bandFrom: number) => {
    for (let i = 0; i < r.length; i++) {
      const a = r[i], b = r[(i + 1) % r.length]
      const L = Math.hypot(b[0] - a[0], b[1] - a[1])
      const p = L < 2 * C + 0.05 ? trim : glass
      p.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
      // A blue floor band every third floor.
      for (let z = bandFrom; z < z1 - 1.2; z += 3 * FLOOR) {
        if (z < z0 + 0.4) continue
        panel(blue, a, b, 0, L, z, z + 0.75, 0.05)
      }
    }
  }
  /** A parapet roof: a trim coping lip, roof sunk inside. */
  const roofTop = (r: XY[], z: number) => {
    const i = inset(r, 0.5)
    walls(trim, r, z, z + 0.8)
    walls(trim, i.slice().reverse(), z + 0.2, z + 0.8)
    // Coping top between the two rings.
    for (let k = 0; k < r.length; k++) {
      const j = (k + 1) % r.length
      trim.quad([r[k][0], r[k][1], z + 0.8], [r[j][0], r[j][1], z + 0.8], [i[j][0], i[j][1], z + 0.8], [i[k][0], i[k][1], z + 0.8])
    }
    cap(roof, i, z + 0.2)
  }

  // Base tier: OSM outline, 33.5 × 38.1 m, ~26 m (8 floors over a tall ground floor).
  const BASE = 26, MID = 43
  const r0 = ring(16.75, 19.05, C)
  curtain(r0, 0, BASE, 5.0)
  // Street storey: a darker band of shop glazing under a trim fascia.
  walls(trim, inset(r0, -0.06), 4.4, 5.0)
  roofTop(r0, BASE)

  // Second tier: 27.4 × 26.4 m to ~43 m.
  const r1 = ring(13.7, 13.2, C)
  curtain(r1, BASE, MID, BASE + 0.2 + 2 * FLOOR)
  roofTop(r1, MID)

  // The shaft: 24.3 × 22.5 m to the cornice.
  const r2 = ring(12.15, 11.25, C)
  curtain(r2, MID, SHAFT, MID + 0.2 + 2 * FLOOR)

  // The cornice: a projecting aluminium lip, then the sign band standing on
  // it, both a little proud of the shaft as in the photos.
  const rc = ring(12.15 + 0.9, 11.25 + 0.9, C + 0.3)
  walls(trim, inset(r2, -0.02), SHAFT - 0.6, SHAFT)
  // Soffit from the shaft out to the lip.
  {
    const o = rc, i = inset(r2, -0.02)
    for (let k = 0; k < o.length; k++) {
      const j = (k + 1) % o.length
      trim.quad([i[k][0], i[k][1], SHAFT], [i[j][0], i[j][1], SHAFT], [o[j][0], o[j][1], SHAFT], [o[k][0], o[k][1], SHAFT])
    }
  }
  walls(trim, rc, SHAFT, SHAFT + 1.0)
  const rs = ring(12.15 + 0.6, 11.25 + 0.6, C + 0.2)
  // Lip top between the cornice edge and the sign band.
  for (let k = 0; k < rc.length; k++) {
    const j = (k + 1) % rc.length
    trim.quad([rc[k][0], rc[k][1], SHAFT + 1], [rc[j][0], rc[j][1], SHAFT + 1], [rs[j][0], rs[j][1], SHAFT + 1], [rs[k][0], rs[k][1], SHAFT + 1])
  }
  const SIGN = SHAFT + 4.2
  walls(sign, rs, SHAFT + 1, SIGN)
  // Sign band top: a roof walk out to the crown's glass.
  const rA = ring(10.05, 9.1, 0.6)
  {
    for (let k = 0; k < rs.length; k++) {
      const j = (k + 1) % rs.length
      trim.quad([rs[k][0], rs[k][1], SIGN], [rs[j][0], rs[j][1], SIGN], [rs[j][0], rs[j][1], SIGN + 0.35], [rs[k][0], rs[k][1], SIGN + 0.35])
    }
    const i = inset(rs, 0.4)
    for (let k = 0; k < rs.length; k++) {
      const j = (k + 1) % rs.length
      trim.quad([rs[k][0], rs[k][1], SIGN + 0.35], [rs[j][0], rs[j][1], SIGN + 0.35], [i[j][0], i[j][1], SIGN + 0.35], [i[k][0], i[k][1], SIGN + 0.35])
    }
    walls(trim, i.slice().reverse(), SIGN, SIGN + 0.35)
    // Terrace floor round the crown (between the parapet and the crown walls).
    const ia = rA
    // Triangulate the annulus quad by quad: both rings have 8 corners.
    for (let k = 0; k < i.length; k++) {
      const j = (k + 1) % i.length
      roof.quad([i[k][0], i[k][1], SIGN], [i[j][0], i[j][1], SIGN], [ia[j][0], ia[j][1], SIGN], [ia[k][0], ia[k][1], SIGN])
    }
  }

  // The observation crown (Delso's telephoto, DD 11): over the sign band a
  // two-storey steel-framed glass tier on the 20.1 × 18.2 m ring, white
  // posts at ~3.4 m, then a white storey band, a terrace, and the glazed
  // lantern whose sides lean in from 13 × 11.6 m to OSM's 10.9 × 9.5 m top
  // ring; a white band round its top carries the open platform.
  const TA = 137.2, TW = 139.8, TB = 145.4, TT = 146.6
  walls(dark, rA, SIGN, TA)
  for (let k = 0; k < rA.length; k++) {
    const a = rA[k], b = rA[(k + 1) % rA.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 3) continue
    const n = Math.round(L / 3.4)
    for (let q = 1; q < n; q++) panel(trim, a, b, (q * L) / n - 0.25, (q * L) / n + 0.25, SIGN, TA, 0.06)
  }
  // The white storey band stands a bevelled lip proud of the framed glass.
  {
    const rW = inset(rA, -0.35)
    annulus(trim, rA, rW, TA) // the lip's soffit, facing down
    walls(trim, rW, TA, TW - 0.3)
    walls(trim, rW, TW - 0.3, TW, rA)
  }
  const rL0 = ring(6.5, 5.8, 0.5), rL1 = ring(5.45, 4.75, 0.4)
  annulus(trim, rA, inset(rA, 0.5), TW)
  walls(trim, inset(rA, 0.5).slice().reverse(), TW - 0.6, TW)
  annulus(roof, inset(rA, 0.5), rL0, TW - 0.6)
  walls(dark, rL0, TW - 0.6, TB, rL1)
  {
    const rT = inset(rL1, -0.35)
    annulus(trim, rL1, rT, TB) // soffit, facing down
    walls(trim, rT, TB, TT - 0.3)
    walls(trim, rT, TT - 0.3, TT, rL1)
    cap(roof, rL1, TT)
  }

  // The mast: four splayed legs from the platform's corners to the column
  // (the A-frame foot both photos show), the thick lattice column to the
  // published 166 m architectural height, then the aerial mast (~196 m).
  // All drawn about a third fuller than life so they survive at phone size.
  const LEG = 156
  // Legs from the platform's corners to the column, drawn ~1.3 m thick.
  for (const [sx, sy] of [[1, 1], [-1, 1], [-1, -1], [1, -1]]) beam(roof, [sx * 4.4, sy * 3.8, TT], [sx * 1.4, sy * 1.4, LEG], 1.3)
  const sq = (h: number, z: number): V3[] => [[-h, -h, z], [h, -h, z], [h, h, z], [-h, h, z]]
  // The lattice column, ~3.6 m at its foot narrowing to ~2.8 m, with a
  // service platform where the legs meet it.
  roof.loft([sq(1.8, TT), sq(1.6, LEG), sq(1.4, 166)])
  roof.cap(sq(1.4, 166), true)
  roof.loft([sq(2.4, LEG - 0.6), sq(2.4, LEG)])
  roof.cap(sq(2.4, LEG), true)
  roof.cap(sq(2.4, LEG - 0.6), false)
  // The aerial mast to ~196 m (DD 11), with three pairs of dipole arms.
  roof.loft([sq(0.7, 166), sq(0.55, 181), sq(0.3, 196)])
  roof.cap(sq(0.3, 196), true)
  for (const [z, w] of [[171, 2.6], [177, 2.2], [183, 1.8]]) {
    beam(roof, [-w, 0, z], [w, 0, z], 0.35)
    beam(roof, [0, -w, z + 1.5], [0, w, z + 1.5], 0.35)
  }

  return [
    // The shaft's glass. Not a window* material: at night the shaft is
    // mostly dark (Adrián Cerón's night photo) while the crown glows.
    { part: glass, material: finish('latino-glass', 0x9aa6b0, 0.35) },
    // The crown's glazing: the framed storeys and the lantern, lit at night.
    { part: dark, material: { ...PALETTE.window, color: 0x7d93a6 } },
    // The lit cornice lip under the sign (night photo).
    { part: trim, material: { ...finish('aluminium', 0xe4e6e6), floodlight: (p: V3) => (p[2] > SHAFT - 1 && p[2] < SHAFT + 1.2 ? 1 : 0) } },
    { part: blue, material: finish('latino-lines', 0x5d6b82) },
    { part: sign, material: finish('neon-latino-blue', 0x4a6fa8) },
    { part: roof, material: PALETTE.roof },
  ]
}

if (import.meta.main) await save('mexico-city-torre-latinoamericana', 'Torre Latinoamericana', ANCHOR, BEARING, build(), 6500)
