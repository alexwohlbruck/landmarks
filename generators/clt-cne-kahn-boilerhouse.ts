/**
 * Camp North End: the Kahn Boilerhouse and its smokestack — procedural, CC0-1.0.
 * bun generators/clt-cne-kahn-boilerhouse.ts
 *
 * The power plant Albert Kahn built in 1924 beside the Ford assembly plant
 * (`clt-cne-ford-plant.ts`), part of the designated landmark, now the heart of
 * Camp North End's Boileryard. A tall brick box on a raised concrete basement:
 * wide brick corners, walls that are almost all steel window between them —
 * big lower units, a row of smaller ones over a transom — a broad pale
 * concrete band over the glass and a concrete coping on the parapet, a
 * concrete door surround on the south. On its north side stands the riveted
 * steel smokestack, tapering, rusted, joined to the wall high up by a boxy
 * breeching duct. The 1924 water tower east of it is its own model
 * (`camp-north-end-water-tower`, way/833631505) and is left out.
 *
 * Evidence:
 *  - OSM: way/324609976 ("Kahn Boilerhouse", height 6 — the lidar says
 *    otherwise), 21.1 × 18.7 m, square to the Ford plant's grid. No parts.
 *    The stack isn't mapped.
 *  - Lidar (USGS 3DEP NC Phase 4 Mecklenburg 2016, 0.5 m DSM and ground):
 *    roof deck 232.75 m NAVD88, parapet 233.0–233.3; ground 224.0–224.2 on
 *    the south and east, falling to ~223.6 at the north-west corner (the
 *    basement shows more there); y = 0 is 223.6 m. The stack: centre 9.3 m
 *    west of the box's east wall and 4.2 m north of its north wall, about 3 m
 *    across at the top, top 248.3 m (24.7 m above y = 0). The breeching: a
 *    3 m wide duct topping out at 230.9 m between the stack and the north
 *    wall.
 *  - Charlotte-Mecklenburg Historic Landmarks Commission survey and
 *    designation report (MacRostie Historic Advisors, 2019): "a one-half
 *    story brick building on a raised basement", the basement cast in
 *    concrete on all four sides, brick corners with concrete details and
 *    glazed walls of 21-pane steel windows with 9-pane units above, "a
 *    concrete band runs just above the windows and along the parapet", the
 *    main entrance on the south in a concrete surround, the north entrance
 *    "beneath the connection to the adjacent steel smokestack".
 *  - USGS NAIP orthophoto (public domain): plan, roof, the stack's shadow.
 *
 * Look-only (not licensed for reuse; described, not copied): the report's
 * May 2018 photos of all four sides, the stack and the water tower.
 *
 * Estimated: the window grid (five bays a side, the photos), the heights of
 * the basement, transom and bands, the stack's base diameter (~3.6 m, the
 * north photo shows it flaring) and the duct's depth. No CC-licensed photo
 * of the boilerhouse was found on Commons, Openverse or Mapillary.
 *
 * Frame: the Ford plant's grid (see `clt-cne-ford-plant.ts`), bearing 6.3;
 * the origin is the outline's centroid, lng −80.8344210, lat 35.2477820.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { BRICK, box, face, parapetBlock, shift, write, type Built } from './clt-cne-ford-plant'

/** The box, in the Ford plant's frame (OSM way/324609976). */
const X0 = -34.4, X1 = -13.3, Y0 = 58.8, Y1 = 77.5
const BASE = 223.6
/** Levels above y = 0 (lidar and the survey photos). */
const z = (abs: number) => abs - BASE
const PARAPET = z(233.15), DECK = z(232.75), BASEMENT = z(225.5), LOWER_HEAD = z(230.0), UPPER0 = z(230.25), UPPER1 = z(231.25)
const BAND0 = z(231.3), BAND1 = z(231.95), COPE = z(232.85)
const CORNER = 2.6

export function buildBoilerhouse(): Built {
  const wall = new Part(), conc = new Part(), win = new Part(), roof = new Part(), rust = new Part()
  const BELOW = -0.6

  // Walls, the parapet with its pale chamfered coping, and the deck.
  parapetBlock({ wall, deck: roof, coping: conc }, X0, X1, Y0, Y1, BELOW, PARAPET, { para: PARAPET - DECK, cap: 0.35, ch: 0.12 })

  const sides: ['S' | 'N' | 'E' | 'W', number][] = [['S', Y0], ['N', Y1], ['E', X1], ['W', X0]]
  for (const [side, at] of sides) {
    const f = face(side, at)
    const ends = side === 'S' || side === 'N' ? [f.along([X0, 0]), f.along([X1, 0])] : [f.along([0, Y0]), f.along([0, Y1])]
    const l = Math.min(...ends), r = Math.max(...ends)
    // The concrete basement, its pale band over the glass, both full width.
    f.panel(conc, l, r, BELOW, BASEMENT, 0.06)
    f.panel(conc, l, r, BAND0, BAND1, 0.06)
    f.panel(conc, l, r, COPE, PARAPET - 0.12, 0.06)
    // The glazed wall between the brick corners: five bays, slim brick
    // mullion piers, the 21-pane lower units and the 9-pane row over them.
    const g0 = l + CORNER, g1 = r - CORNER, n = 5, pw = 0.35, w = (g1 - g0 - (n - 1) * pw) / n
    for (let k = 0; k < n; k++) {
      const a0 = g0 + k * (w + pw), a1 = a0 + w
      // The south door sits in the middle bay, in its concrete surround.
      if (side === 'S' && k === 2) {
        const m = (a0 + a1) / 2
        f.panel(conc, m - 1.3, m + 1.3, BASEMENT, LOWER_HEAD - 0.6, 0.12)
        f.panel(win, m - 0.75, m + 0.75, BASEMENT + 0.2, LOWER_HEAD - 1.0, 0.16)
        f.panel(win, a0, m - 1.45, BASEMENT + 0.3, LOWER_HEAD)
        f.panel(win, m + 1.45, a1, BASEMENT + 0.3, LOWER_HEAD)
      } else f.panel(win, a0, a1, BASEMENT + 0.3, LOWER_HEAD)
      f.panel(win, a0, a1, UPPER0, UPPER1)
      // Small basement windows under each bay.
      f.panel(win, a0 + 0.6, a1 - 0.6, 0.35, BASEMENT - 0.45, 0.1)
    }
  }

  // The smokestack: a tapering riveted steel shaft with a collar at the top.
  {
    const cx = -23.0, cy = 81.7, top = z(248.3), seg = 16, r0 = 1.75, r1 = 1.4
    const ring = (r: number, h: number): V3[] => Array.from({ length: seg }, (_, i) => {
      const a = (i / seg) * Math.PI * 2
      return [cx + r * Math.cos(a), cy + r * Math.sin(a), h]
    })
    const lathe = (rs: [number, number][]) => {
      for (let k = 0; k < rs.length - 1; k++) {
        const A = ring(rs[k][0], rs[k][1]), B = ring(rs[k + 1][0], rs[k + 1][1])
        // Smooth round the shaft: each corner keeps its own radial normal,
        // tipped by the slope of this run of the profile.
        const dr = rs[k][0] - rs[k + 1][0], dh = rs[k + 1][1] - rs[k][1]
        const nrm = (p: V3): V3 => {
          const x = p[0] - cx, y = p[1] - cy, l = Math.hypot(x, y), L = Math.hypot(dr, dh) || 1
          return dh === 0 ? [0, 0, dr > 0 ? 1 : -1] : [(x / l) * (dh / L), (y / l) * (dh / L), dr / L]
        }
        for (let i = 0; i < seg; i++) {
          const j = (i + 1) % seg
          rust.tri(A[i], A[j], B[j], undefined, undefined, undefined, [nrm(A[i]), nrm(A[j]), nrm(B[j])])
          rust.tri(A[i], B[j], B[i], undefined, undefined, undefined, [nrm(A[i]), nrm(B[j]), nrm(B[i])])
        }
      }
    }
    // A flared foot, the shaft, then the collar.
    lathe([[r0 + 0.5, BELOW], [r0 + 0.5, 0.9], [r0, 2.4], [r1, top - 0.9], [r1 + 0.25, top - 0.9], [r1 + 0.25, top], [r1 - 0.25, top], [r1 - 0.25, top - 1.5]])
    // The breeching: a boxy duct from the stack into the north wall, high up.
    box(rust, -24.5, -21.5, Y1, cy - r1 + 0.2, z(228.9), z(230.9))
  }

  const ax = (X0 + X1) / 2, ay = (Y0 + Y1) / 2
  const parts = [
    { part: wall, material: BRICK },
    { part: conc, material: PALETTE.trim },
    { part: win, material: PALETTE.window },
    { part: roof, material: PALETTE.roof },
    { part: rust, material: finish('stack-rust', 0xc28563) },
  ].map(({ part, material }) => ({ part: shift(part, ax, ay), material }))
  return { id: 'clt-cne-kahn-boilerhouse', name: 'Kahn Boilerhouse, Camp North End', height: z(248.3), parts }
}

if (import.meta.main) await write(buildBoilerhouse())
