/**
 * Torre Mítikah (Río Churubusco / Real de Mayorazgo, Xoco, 2021, Pelli
 * Clarke Pelli), Mexico City — original procedural geometry, CC0-1.0.
 * bun generators/mexico-city-torre-mitikah.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = area centroid of the OSM outline way/674370738,
 * 19.359233,-99.168460. Bearing 0: the outline is used as it is.
 *
 * Identity, in order: the tallest tower in the city, a smooth slender
 * column on an oval (egg-shaped) plan, 39 × 59 m, its long axis running
 * almost north-south; the pale sky-blue glass curtain wall; the crown, a
 * band of close-set vertical fins round the top ~12 m that glows warm
 * yellow at night, with a dark notch in it on the north face; a flat top.
 *
 * Evidence:
 *  - plan: OSM way/674370738 (25 points), smoothed as drawn.
 *  - height: 267 m to the roof (published: Wikipedia es "Torre Mitikah"
 *    267.3 m; OSM height=267). Storeys ~4 m.
 *  - the crown band: ~12 m, photo-scaled on Tbhotch's night views (lit band
 *    ≈ 0.26 of the 38 m width tall) and on Valenzuela's construction views,
 *    where the top floors carry pale cladding panels a little proud of the
 *    floors below (drawn 0.6 m proud). The notch: Eneas de Troya's level
 *    telephoto from the north shows a dark gap ~8 m wide, ~10 m tall at the
 *    top, left of centre (east of the north tip). Estimated.
 *  - a darker mechanical floor band at ~2/3 of the height: Tbhotch 2026
 *    views (a dark red-brown line). Estimated height.
 *  - colour: the glass reads green-teal and reflective in every daylight
 *    photo (Eneas, Tbhotch, ProtoplasmaKid), pulled light → windowVariant
 *    #93bcb3 (review round 1); faint pale green-grey floor-group lines every
 *    six storeys (the wall reads smooth from afar); the crown fins pale
 *    silver-grey by day, lit warm yellow at night (Tbhotch night views), so
 *    they are a `neon` material in their day colour.
 *
 * The assignment notes described "a slanted/sloping crown on one side". The
 * licensed photos (Eneas de Troya's level telephoto from the north, the
 * Tbhotch views from below and from the south, Valenzuela's from the north)
 * all show a level top; the crown is a level band of fins. The model follows
 * the photos. The shaft is not straight (review round 1): measured on the
 * level telephoto it swells slightly to ~3/4 height and then rounds in to
 * a soft bullet shoulder over the top ~45 m, 12% narrower at the roof than
 * at its widest (see S below); the views from below show the same glass
 * bending over at the crown.
 *
 * Terrain: Mapterhorn has no z15 tiles here (tools/terrain.ts 404s); the
 * site is on the flat lake-bed basin (~2,240 m). Modelled level, elevation 0.
 * The tower rises out of the Mítikah mall (OSM way/1102990815, 36 m), which
 * stays the map's own building; the tower's outline covers only the tower.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Torre_Mitikah_(cropped).jpg and Mitikah.jpg, Eneas de Troya, CC BY 2.0
 *    https://commons.wikimedia.org/wiki/File:Torre_Mitikah_(cropped).jpg
 *    https://commons.wikimedia.org/wiki/File:Mitikah.jpg
 *  - Torre_Mitikah_(2026)_1.jpg, _2.jpg, _3.jpg, Tbhotch, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:Torre_Mitikah_(2026)_2.jpg
 *    https://commons.wikimedia.org/wiki/File:Torre_Mitikah_(2026)_3.jpg
 *  - Torre_Mitikah,_Coyoacan,_CDMX.jpg and Torre_Mitikah_1,_Coyoacan,_CDMX.jpg,
 *    Calypso9X, CC0 (night)
 *    https://commons.wikimedia.org/wiki/File:Torre_Mitikah,_Coyoacan,_CDMX.jpg
 *    https://commons.wikimedia.org/wiki/File:Torre_Mitikah_1,_Coyoacan,_CDMX.jpg
 *  - Mitikah_tower_from_north_Mexico_City_2020.jpg and Mitika_tower_2020.jpg,
 *    Carlos Valenzuela, CC BY-SA 4.0 (under construction)
 *    https://commons.wikimedia.org/wiki/File:Mitikah_tower_from_north_Mexico_City_2020.jpg
 *    https://commons.wikimedia.org/wiki/File:Mitika_tower_2020.jpg
 *  - Alberca_Olímpica_Francisco_Márquez_y_Gimnasio_Juan_de_la_Barrera_-_9.jpg,
 *    ProtoplasmaKid, CC BY-SA 4.0 (distant, from the north-east)
 *    https://commons.wikimedia.org/wiki/File:Alberca_Ol%C3%ADmpica_Francisco_M%C3%A1rquez_y_Gimnasio_Juan_de_la_Barrera_-_9.jpg
 * Look-only: none. No commercial imagery.
 *
 * Doubts: no licensed close daylight photo of the finished crown; its fin
 * spacing and the notch's size are estimates. The lobby and the canopy at
 * the base are left out (inside the mall's podium).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { area, cap, save, type XY } from './chi-aon-center'

const ANCHOR: [number, number] = [19.359233, -99.16846]
const BEARING = 0
const TOP = 267
const CROWN = 255 // the fin band from here to the top
const FL = 4.0

// OSM way/674370738, metres from the anchor.
const OSM: XY[] = [[15.78, 23.16], [18.04, 17.09], [19.16, 8.22], [18.37, -1.24], [17.0, -7.76], [13.6, -16.71], [9.77, -23.01], [5.09, -26.86], [1.05, -28.7], [-3.72, -29.45], [-9.0, -27.93], [-13.85, -24.97], [-16.51, -21.21], [-18.81, -15.51], [-19.54, -10.09], [-19.32, -5.42], [-19.1, -0.72], [-17.16, 7.57], [-13.82, 15.17], [-10.87, 20.26], [-7.72, 24.28], [-3.28, 27.71], [1.87, 29.54], [7.4, 29.39], [12.37, 27.02]]

/** The outline, smoothed (two passes of Chaikin-like averaging) and resampled to n points, counter-clockwise. */
function smooth(r0: XY[], n: number): XY[] {
  let r = area(r0) < 0 ? r0.slice().reverse() : r0.slice()
  for (let pass = 0; pass < 2; pass++) r = r.map((p, i) => { const a = r[(i - 1 + r.length) % r.length], b = r[(i + 1) % r.length]; return [(a[0] + 2 * p[0] + b[0]) / 4, (a[1] + 2 * p[1] + b[1]) / 4] as XY })
  // Re-scale so the smoothed ring keeps the outline's area.
  const k = Math.sqrt(Math.abs(area(r0)) / Math.abs(area(r)))
  r = r.map(([x, y]) => [x * k, y * k] as XY)
  const seg = r.map((p, i) => Math.hypot(r[(i + 1) % r.length][0] - p[0], r[(i + 1) % r.length][1] - p[1])), L = seg.reduce((a, b) => a + b, 0)
  const out: XY[] = []
  for (let j = 0; j < n; j++) {
    let d = (L * j) / n, i = 0
    while (d > seg[i]) { d -= seg[i]; i++ }
    const a = r[i], b = r[(i + 1) % r.length], t = d / seg[i]
    out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t])
  }
  return out
}
/** Outward unit normals at each ring point (counter-clockwise ring). */
const normals = (r: XY[]): XY[] => r.map((_, i) => {
  const a = r[(i - 1 + r.length) % r.length], b = r[(i + 1) % r.length], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy)
  return [dy / l, -dx / l] as XY
})
const off = (r: XY[], d: number): XY[] => { const n = normals(r); return r.map((p, i) => [p[0] + n[i][0] * d, p[1] + n[i][1] * d] as XY) }

// The shaft's profile, measured on Eneas de Troya's level telephoto from
// the north (Torre_Mitikah_(cropped).jpg): the tower is ~132 px wide near
// the base, swells to ~146 px about three-quarters of the way up, and
// rounds in over the last ~45 m to ~130 px at the roof. As a scale on the
// OSM plan (taken as the base): 1.0 at the ground, 1.03 at 200 m, then a
// soft bullet shoulder down to 0.88 at the roof, the fin crown leaning in
// with it.
const SWELL = 200, SHOULDER = 222
const S = (z: number) => {
  if (z <= SWELL) return 1 + 0.03 * Math.sin((Math.PI / 2) * z / SWELL)
  if (z <= SHOULDER) return 1.03
  const u = (z - SHOULDER) / (TOP - SHOULDER)
  return 1.03 - 0.15 * Math.pow(u, 1.7)
}
const dS = (z: number) => (S(z + 0.25) - S(z - 0.25)) / 0.5
const at = (r: XY[], z: number): XY[] => r.map(([x, y]) => [x * S(z), y * S(z)] as XY)

/** Smooth-shaded walls of a ring from z0 to z1 (following S), over the index range [i0, i1). */
function wall(p: Part, r0: XY[], z0: number, z1: number, i0 = 0, i1 = r0.length) {
  const step = z0 >= SHOULDER - 0.01 ? 5 : 25
  if (z0 < SHOULDER && z1 > SHOULDER + 0.5) { wall(p, r0, z0, SHOULDER, i0, i1); wall(p, r0, SHOULDER, z1, i0, i1); return }
  if (z1 - z0 > step) { const k = Math.ceil((z1 - z0) / step); for (let q = 0; q < k; q++) wall(p, r0, z0 + (q * (z1 - z0)) / k, z0 + ((q + 1) * (z1 - z0)) / k, i0, i1); return }
  const r = at(r0, z0), t = at(r0, z1), n = normals(r0)
  // Normals tilt up where the shaft leans in: (n, -(n·p) S').
  const N = (i: number, z: number): V3 => {
    const nz = -(n[i][0] * r0[i][0] + n[i][1] * r0[i][1]) * dS(z), l = Math.hypot(1, nz)
    return [n[i][0] / l, n[i][1] / l, nz / l]
  }
  for (let i = i0; i < i1; i++) {
    const j = (i + 1) % r.length
    const A: V3 = [r[i][0], r[i][1], z0], B: V3 = [r[j][0], r[j][1], z0], C: V3 = [t[j][0], t[j][1], z1], D: V3 = [t[i][0], t[i][1], z1]
    const nA = N(i, z0), nB = N(j, z0), nC = N(j, z1), nD = N(i, z1)
    p.tri(A, B, C, undefined, undefined, undefined, [nA, nB, nC])
    p.tri(A, C, D, undefined, undefined, undefined, [nA, nC, nD])
  }
}

function build() {
  const glass = new Part(), trim = new Part(), band = new Part(), fins = new Part(), roof = new Part()
  const dark = band
  const N = 48
  const R = smooth(OSM, N)
  const nr = normals(R)

  // The shaft: glass from the ground to the crown.
  wall(glass, R, 0, CROWN)
  // Pale floor-group lines every three storeys, set just proud of the glass.
  const R1 = off(R, 0.06)
  for (let z = 6 * FL * 2; z < CROWN - 6; z += 6 * FL) {
    if (Math.abs(z - 178) < 8) continue
    wall(trim, R1, z - 0.3, z + 0.3)
  }
  // The darker mechanical band at ~2/3 of the height.
  wall(band, R1, 176.5, 179.5)
  // A pale lobby lintel band at the base (above the mall's roof line).
  wall(trim, R1, 36, 37.2)

  // The crown: the floors stand 0.6 m proud of the shaft, a pale cladding
  // ring under the fins, then a ring of vertical fins on a recessed wall.
  const RC = off(R, 0.6), RW = off(R, -0.4)
  // Underside step and the cladding ring.
  for (let i = 0; i < N; i++) {
    const j = (i + 1) % N
    const a = at(RC, CROWN), b = at(R, CROWN)
    trim.quad([a[i][0], a[i][1], CROWN], [a[j][0], a[j][1], CROWN], [b[j][0], b[j][1], CROWN], [b[i][0], b[i][1], CROWN])
  }
  wall(trim, RC, CROWN, CROWN + 1.4)
  // Recessed wall behind the fins: the notch (dark) faces north-north-east.
  const notch = (i: number) => {
    const m = [(R[i][0] + R[(i + 1) % N][0]) / 2, (R[i][1] + R[(i + 1) % N][1]) / 2]
    return m[1] > 20 && m[0] > 0.5 && m[0] < 10.5
  }
  for (let i = 0; i < N; i++) wall(notch(i) ? dark : glass, RW, CROWN + 1.4, TOP - 0.8, i, i + 1)
  // Ledge between the cladding ring and the recessed wall.
  for (let i = 0; i < N; i++) {
    const j = (i + 1) % N
    const z = CROWN + 1.4, a = at(RW, z), b = at(RC, z)
    trim.quad([a[i][0], a[i][1], z], [a[j][0], a[j][1], z], [b[j][0], b[j][1], z], [b[i][0], b[i][1], z])
  }
  // Fins: two per ring segment, 0.5 m wide, from the recessed wall out to
  // the cladding line, none across the notch.
  for (let i = 0; i < N; i++) {
    if (notch(i)) continue
    const j = (i + 1) % N
    for (const t of [0.25, 0.75]) {
      const c: XY = [RW[i][0] + (RW[j][0] - RW[i][0]) * t, RW[i][1] + (RW[j][1] - RW[i][1]) * t]
      const nx = nr[i][0] + (nr[j][0] - nr[i][0]) * t, ny = nr[i][1] + (nr[j][1] - nr[i][1]) * t, nl = Math.hypot(nx, ny)
      const n: XY = [nx / nl, ny / nl], u: XY = [-n[1], n[0]], w = 0.25, d = 1.0
      const ring: XY[] = [[c[0] - u[0] * w, c[1] - u[1] * w], [c[0] + u[0] * w, c[1] + u[1] * w], [c[0] + u[0] * w + n[0] * d, c[1] + u[1] * w + n[1] * d], [c[0] - u[0] * w + n[0] * d, c[1] - u[1] * w + n[1] * d]]
      // ring runs u → n: make it counter-clockwise.
      const rr = area(ring) < 0 ? ring.slice().reverse() : ring
      const lo = at(rr, CROWN + 1.4), hi = at(rr, TOP)
      for (let k = 0; k < 4; k++) {
        const l = (k + 1) % 4
        fins.quad([lo[k][0], lo[k][1], CROWN + 1.4], [lo[l][0], lo[l][1], CROWN + 1.4], [hi[l][0], hi[l][1], TOP], [hi[k][0], hi[k][1], TOP])
      }
      cap(fins, hi, TOP)
    }
  }
  // Coping ring on top of the recessed wall and the flat roof.
  const RT = off(R, -1.4)
  for (let i = 0; i < N; i++) {
    const j = (i + 1) % N
    const z = TOP - 0.8, a = at(RW, z), b = at(RT, z)
    trim.quad([a[i][0], a[i][1], z], [a[j][0], a[j][1], z], [b[j][0], b[j][1], z], [b[i][0], b[i][1], z])
  }
  cap(roof, at(RT, TOP - 0.8), TOP - 0.8)

  return [
    { part: glass, material: windowVariant(2, 0x93bcb3) },
    { part: trim, material: finish('mitikah-mullion', 0xc9ddd7) },
    { part: band, material: finish('mitikah-band', 0x6a827d) },
    { part: fins, material: finish('neon-mitikah-crown', 0xd9d5c4) },
    { part: roof, material: PALETTE.roof },
  ]
}

if (import.meta.main) await save('mexico-city-torre-mitikah', 'Torre Mítikah', ANCHOR, BEARING, build(), 6500)
