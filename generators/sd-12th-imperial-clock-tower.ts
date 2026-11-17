/**
 * 12th & Imperial Transit Center clock tower, San Diego — the free-standing
 * Ebel clock tower in the plaza of MTS's transit centre (1989), in front of
 * the James R. Mills Building (sd-james-r-mills-building, which imports the
 * shared finishes and the `beam` helper from this file).
 *
 * Identity: a plain square grey concrete shaft; an open base whose two
 * storeys of portals carry red X braces in red-lined frames on every face; a
 * narrower clock stage with four big white dials (red Roman numerals, dark
 * hands); a red band and a grey pyramid roof.
 *
 * Frame: bearing 0. Map frame x east, y north, z up, metres; origin at the
 * anchor (−117.1537224, 32.7060156), the centroid of OSM way/613166333;
 * y = 0 the plaza.
 *
 * Sources
 * - OSM way/613166333 (building=yes, man_made tower, "MTS Center", height
 *   58, pyramidal): an 8.9 × 8.4 m square, square to north. © OSM
 *   contributors. OSM's height (58) is under the lidar's; the lidar is used.
 * - USGS 3DEP lidar CA_SanDiegoQL2_2014 (flown 2014), 0.5 m grid. Plaza
 *   ground 0.6 m above the box's ground_min. Measured above the plaza: shaft
 *   top 49.3 m, its outline ≈ 9 × 9 m; clock stage top ≈ 60.6 m, inset
 *   ≈ 1 m a side (≈ 7 m square); pyramid apex 65.9 m (published "about
 *   200 ft"). The lidar square sits ≈ 1.5 m east of OSM's; OSM's anchor is
 *   kept.
 * - USGS NAIP orthophoto (plan, grey pyramid).
 * Photos (evidence):
 * - "James R. Mills Building.jpg" and "San Diego, 2016 - 568.jpg", Another
 *   Believer, CC BY-SA 4.0,
 *   https://commons.wikimedia.org/wiki/File:James_R._Mills_Building.jpg
 *   (from the north-north-east, high: stage, dials, red band, pyramid).
 * - "12th & Imperial.jpg", Cloverof4, CC BY-SA 4.0,
 *   https://commons.wikimedia.org/wiki/File:12th_%26_Imperial.jpg (from the
 *   west: shaft-to-stage step, dial size).
 * - "East Village, San Diego, CA, USA - panoramio (7).jpg" and "(11)", Roman
 *   Eugeniusz, CC BY-SA 3.0,
 *   https://commons.wikimedia.org/wiki/File:East_Village,_San_Diego,_CA,_USA_-_panoramio_(7).jpg
 *   (from the north-east, sunny: colours, proportions).
 * - "12th & Imperial TC station from SDPL jeh.jpg", Jim.henderson, CC BY 4.0,
 *   https://commons.wikimedia.org/wiki/File:12th_%26_Imperial_TC_station_from_SDPL_jeh.jpg
 *   (the base: two storeys of red-lined portals with X braces).
 * - "San Diego - Public Transport Hub of Southern California - Vintage
 *   Streetcar No.529 …jpg", kitmasterbloke, CC BY 2.0 (the base portal
 *   close up).
 *
 * Numbers
 * - Shaft 8.9 m square (OSM / lidar, measured), to 49.3 m (lidar).
 * - Base portals: piers 1.7 m, lower opening 0–4.9 m, slab 4.9–5.7 m,
 *   upper opening 5.7–9.6 m — estimated from Henderson's photo against the
 *   8.9 m face.
 * - Stage 7.0 m square to 60.0 m, red band to 60.7 m (lidar 60.6), pyramid
 *   apex 65.9 m (lidar, measured).
 * - Dial radius 2.75 m, centre 56.3 m: estimated from Another Believer's
 *   photo (dial ≈ 0.8 of the stage width, in its upper part).
 * - Colours: grey concrete, signal red, white dials from the daylight photos,
 *   pulled to the palette's lightness.
 *
 * Doubts
 * - No licensed night photo was found, so the dials are not made to glow
 *   (a plain white finish). If night photos show them lit, rename the dial
 *   material to `window-2`.
 * - The shaft's faint horizontal panel joints and the small red squares on
 *   it are left out; the Ebel logo on the dials too.
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { qf, tf, cbox, rect, save } from './dc-white-house'

/** Shared with sd-james-r-mills-building. */
export const MTS_CONCRETE = finish('mts-concrete', 0xd6cfc4)
export const MTS_RED = finish('mts-red', 0xc85a4b)
export const MTS_DARK = finish('mts-dark', 0x4f555c)

/**
 * A straight beam of width w, from (u0, z0) to (u1, z1) on a face, standing
 * from d0 to d1 off it. `P(u, z, d)` maps face coordinates to the model.
 */
export function beam(p: Part, P: (u: number, z: number, d: number) => V3, u0: number, z0: number, u1: number, z1: number, w: number, d0: number, d1: number) {
  const L = Math.hypot(u1 - u0, z1 - z0), nu = -(z1 - z0) / L * w / 2, nz = (u1 - u0) / L * w / 2
  const c = [[u0 + nu, z0 + nz], [u1 + nu, z1 + nz], [u1 - nu, z1 - nz], [u0 - nu, z0 - nz]]
  const o = P(0, 0, 0), f = P(0, 0, 1), out: V3 = [f[0] - o[0], f[1] - o[1], f[2] - o[2]]
  const A = c.map(([u, z]) => P(u, z, d1)), B = c.map(([u, z]) => P(u, z, d0))
  qf(p, A[0], A[1], A[2], A[3], out)
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    const m = [(c[i][0] + c[j][0]) / 2 - (u0 + u1) / 2, (c[i][1] + c[j][1]) / 2 - (z0 + z1) / 2]
    const q = P(m[0] + (u0 + u1) / 2, m[1] + (z0 + z1) / 2, d0), q0 = P((u0 + u1) / 2, (z0 + z1) / 2, d0)
    qf(p, A[i], A[j], B[j], B[i], [q[0] - q0[0], q[1] - q0[1], q[2] - q0[2]])
  }
}

/** The four faces of a square of half-width h: P(u, z, d), u to the right seen from outside. */
export function faces(h: number, cx = 0, cy = 0) {
  return [
    (u: number, z: number, d: number): V3 => [cx + u, cy - h - d, z], // south
    (u: number, z: number, d: number): V3 => [cx + h + d, cy + u, z], // east
    (u: number, z: number, d: number): V3 => [cx - u, cy + h + d, z], // north
    (u: number, z: number, d: number): V3 => [cx - h - d, cy - u, z], // west
  ]
}

/** The outward direction of a face. */
export const out = (P: (u: number, z: number, d: number) => V3): V3 => {
  const a = P(0, 0, 0), b = P(0, 0, 1)
  return [b[0] - a[0], b[1] - a[1], b[2] - a[2]]
}

function build() {
  const con = new Part(), red = new Part(), dial = new Part(), roof = new Part(), dark = new Part()
  const H = 4.45, PIER = 1.7
  const Z1 = 4.9, Z2 = 5.7, Z3 = 9.6, Z4 = 10.4, SHAFT = 49.3
  const STAGE = 3.5, ST_TOP = 60.0, BAND = 60.7, APEX = 65.9

  // Base: four corner piers, grey outside and red where they line the portals.
  for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
    const x0 = sx < 0 ? -H : H - PIER, y0 = sy < 0 ? -H : H - PIER
    const r = rect(x0, x0 + PIER, y0, y0 + PIER)
    const ox = sx < 0 ? r.x0 : r.x1, ix = sx < 0 ? r.x1 : r.x0
    const oy = sy < 0 ? r.y0 : r.y1, iy = sy < 0 ? r.y1 : r.y0
    qf(con, [ox, r.y0, 0], [ox, r.y1, 0], [ox, r.y1, Z4], [ox, r.y0, Z4], [sx, 0, 0])
    qf(con, [r.x0, oy, 0], [r.x1, oy, 0], [r.x1, oy, Z4], [r.x0, oy, Z4], [0, sy, 0])
    qf(red, [ix, r.y0, 0], [ix, r.y1, 0], [ix, r.y1, Z4], [ix, r.y0, Z4], [-sx, 0, 0])
    qf(red, [r.x0, iy, 0], [r.x1, iy, 0], [r.x1, iy, Z4], [r.x0, iy, Z4], [0, -sy, 0])
  }
  // The slab between the two portal storeys and the lintel under the shaft.
  cbox(con, rect(-H, H, -H, H), Z1, Z2, { bottom: true })
  // Red frames and X braces in each portal, set just inside the face.
  for (const P of faces(H)) {
    const u0 = -H + PIER, u1 = H - PIER
    for (const [a, b] of [[0, Z1], [Z2, Z3]]) {
      beam(red, P, u0 + 0.25, a + 0.25, u1 - 0.25, b - 0.25, 0.5, -0.9, -0.4)
      beam(red, P, u1 - 0.25, a + 0.25, u0 + 0.25, b - 0.25, 0.5, -0.9, -0.4)
    }
  }

  // Shaft, with a slight cornice at the top.
  cbox(con, rect(-H, H, -H, H), Z3, SHAFT - 0.6, { top: false, bottom: true })
  cbox(con, rect(-H - 0.2, H + 0.2, -H - 0.2, H + 0.2), SHAFT - 0.6, SHAFT, { b: 0.2, bottom: true })
  // Clock stage, red band, pyramid.
  cbox(con, rect(-STAGE, STAGE, -STAGE, STAGE), SHAFT, ST_TOP, { top: false })
  cbox(red, rect(-STAGE - 0.25, STAGE + 0.25, -STAGE - 0.25, STAGE + 0.25), ST_TOP, BAND, { b: 0.15, bottom: true, top: false })
  const b = STAGE + 0.1
  const base: V3[] = [[-b, -b, BAND], [b, -b, BAND], [b, b, BAND], [-b, b, BAND]]
  roof.cap(base, true)
  for (let i = 0; i < 4; i++) {
    const a = base[i], c = base[(i + 1) % 4]
    const n: V3 = [(a[0] + c[0]) / 2, (a[1] + c[1]) / 2, b]
    const A: V3 = [a[0], a[1], BAND], C: V3 = [c[0], c[1], BAND], T: V3 = [0, 0, APEX]
    const g = [C[0] - A[0], C[1] - A[1], C[2] - A[2]], h = [T[0] - A[0], T[1] - A[1], T[2] - A[2]]
    const f = [g[1] * h[2] - g[2] * h[1], g[2] * h[0] - g[0] * h[2], g[0] * h[1] - g[1] * h[0]]
    if (f[0] * n[0] + f[1] * n[1] + f[2] * n[2] >= 0) roof.tri(A, C, T); else roof.tri(A, T, C)
  }
  // Dials: white disc, twelve red numerals, dark hands at ten past ten.
  const R = 2.75, ZC = 56.3, SEG = 24
  for (const P of faces(STAGE)) {
    for (let k = 0; k < SEG; k++) {
      const a0 = (k / SEG) * 2 * Math.PI, a1 = ((k + 1) / SEG) * 2 * Math.PI
      tf(dial, P(0, ZC, 0.05), P(R * Math.cos(a0), ZC + R * Math.sin(a0), 0.05), P(R * Math.cos(a1), ZC + R * Math.sin(a1), 0.05), out(P))
    }
    for (let k = 0; k < 12; k++) {
      const a = (k / 12) * 2 * Math.PI, cu = Math.sin(a), cz = Math.cos(a)
      const r0 = 1.85, r1 = 2.5, w = 0.2
      const pu = cz * w, pz = -cu * w
      qf(red, P(cu * r0 - pu, ZC + cz * r0 - pz, 0.08), P(cu * r0 + pu, ZC + cz * r0 + pz, 0.08), P(cu * r1 + pu, ZC + cz * r1 + pz, 0.08), P(cu * r1 - pu, ZC + cz * r1 - pz, 0.08), out(P))
    }
    // Hour hand toward 10, minute hand toward 2.
    for (const [deg, l, w] of [[-60, 1.35, 0.26], [60, 2.05, 0.18]]) {
      const a = (deg * Math.PI) / 180
      beam(dark, P, 0, ZC, Math.sin(a) * l, ZC + Math.cos(a) * l, w, 0.06, 0.12)
    }
  }
  return [
    { part: con, material: MTS_CONCRETE },
    { part: red, material: MTS_RED },
    { part: dial, material: finish('mts-dial', 0xf3f0e8) },
    { part: roof, material: finish('mts-pyramid', 0xaeb2b4) },
    { part: dark, material: MTS_DARK },
  ]
}

if (import.meta.main) {
  await save('sd-12th-imperial-clock-tower', '12th & Imperial Transit Center clock tower', build(), {
    anchor: [-117.1537224, 32.7060156], bearing: 0,
  })
}
