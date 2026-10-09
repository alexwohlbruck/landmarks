/**
 * Design Center Tower (Lowe's Global Technology Center), 100 W. Worthington
 * Ave, South End, Charlotte — procedural, CC0-1.0.
 * bun generators/clt-design-center-tower.ts
 *
 * A 23-storey office tower (Rule Joy Trammell + Rubio; Shelco; 2019–21) on a
 * seven-storey brick parking podium that also wraps the garage behind it
 * (way/990903148; the same brick-and-louvre podium runs unbroken along
 * Worthington, so the garage is modelled as part of the building). Three
 * things identify it: the black steel corner frame with stacked X braces on
 * the Camden Road / north corner, which rises past the roof as an open cage
 * carrying the Lowe's sign; the pale glass curtain wall with dark bands
 * every two floors; and the tan stone grid on the Worthington face.
 *
 * Evidence:
 *  - OSM: way/990903147 (tower, height 109, 23 levels, Q106726569),
 *    way/990903148 (garage, 6 levels). No building:parts.
 *  - Published: 357 ft / 108.8 m, 23 floors, completed 2021 (Wikipedia,
 *    CTBUH). Lowe's occupies levels 8–23 (OSM office node), so floors 1–7
 *    are the podium.
 *  - Lidar (USGS 3DEP NC Phase 4, 2016) predates the tower: used for the
 *    ground only. Ground rises ~2.5 m from Hawkins St (west) to Camden Rd
 *    (east); y = 0 is the lowest ground, at the garage's west end.
 *  - Photos (Commons, CC BY-SA 4.0): City Dweller 2, "Design Center
 *    Tower.jpg" (2021, the frame corner from Camden), "Lowe's Global
 *    Technology Center January 2024", "… South End November 2021", "Lowes
 *    Global Technology Center November 2021" (frame and podium close up),
 *    "Lowe's Global Tech Center November 2022", "Salted Melon at …" and
 *    "Brownbag …" (podium bays); SunDawn, "Lowes Building Charlotte North
 *    Carolina.jpg" (the stone grid on Worthington, from the south).
 *
 * Estimated: the podium top (28 m above the street: a 6 m retail floor plus
 * six ~3.6 m parking levels; the 2024 photo puts it at about a third of the
 * roof height), office floors 4.0 m (roof 92.4 m above the street), the frame's plan (10.5 m square) and ring levels (read off the
 * 2024 photo, taken from ~110 m), bay widths, the garage height (taken as the
 * podium's, as photos show the two continuous), the penthouse.
 *
 * Model frame: bearing 30 (model +y faces 30°, the long faces run 120°/300°;
 * +x is the Camden Road end); metres above the base.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { type XY, cap, clean, prism, quad, softBox, write } from './clt-highland-park-mill-3'

const BRICK = finish('dct-brick', 0xb06a56)
const STEEL = finish('dct-steel', 0x4a4f57)
const STONE = finish('dct-stone', 0xe0cfb4)
const GLASS = windowVariant(2, 0xa9bfd1)

/** Ground above base: rises east (+x) by ~2.5 m (lidar). */
const ground = (x: number) => 0.25 + 0.023 * (x + 55)
/** The street at the tower; published heights are measured from here. */
const STREET = 1.9

const TOWER: XY[] = [[54.9, 19.0], [54.5, -13.7], [49.9, -13.7], [49.9, -18.4], [-4.9, -19.1], [-4.8, 18.8]]
/** The whole podium outline: the tower plus the garage, way/990903148. */
const PODIUM: XY[] = [[-54.5, 18.6], [54.9, 19.0], [54.5, -13.7], [49.9, -13.7], [49.9, -18.4], [-54.6, -19.7]]

const PODIUM_TOP = STREET + 28
const ROOF = STREET + 92.4
const TOP = STREET + 108.8
/** The frame: square round the north corner. */
const F = { x0: 44.4, x1: 54.9, y0: 8.4, y1: 19.0 }
const FO = 1.0 // frame stands this far outside the glass

type Face = { A: XY; B: XY; u: XY; o: XY; L: number }
function facesOf(P: XY[]): Face[] {
  const Q = clean(P)
  return Q.map((A, i) => {
    const B = Q[(i + 1) % Q.length], L = Math.hypot(B[0] - A[0], B[1] - A[1])
    return { A, B, L, u: [(B[0] - A[0]) / L, (B[1] - A[1]) / L] as XY, o: [(B[1] - A[1]) / L, (A[0] - B[0]) / L] as XY }
  })
}
/** A flat panel on a face, from s0 to s1 along it, z0..z1, `d` proud. */
function panel(p: Part, f: Face, s0: number, s1: number, z0: number, z1: number, d = 0.05) {
  const P = (s: number, z: number): V3 => [f.A[0] + f.u[0] * s + f.o[0] * d, f.A[1] + f.u[1] * s + f.o[1] * d, z]
  quad(p, P(s0, z0), P(s1, z0), P(s1, z1), P(s0, z1), [f.o[0], f.o[1], 0])
}
/** Bays centred on a face, skipping any whose centre `skip` rejects. */
function bays(f: Face, pitch: number, cb: (s0: number, s1: number, c: XY) => void, w: number, skip?: (c: XY) => boolean) {
  const n = Math.floor(f.L / pitch)
  if (n < 1) return
  const start = (f.L - n * pitch) / 2
  for (let k = 0; k < n; k++) {
    const sc = start + pitch * (k + 0.5), c: XY = [f.A[0] + f.u[0] * sc, f.A[1] + f.u[1] * sc]
    if (skip?.(c)) continue
    cb(sc - w / 2, sc + w / 2, c)
  }
}
/** A square bar between two points, `w` wide across the face and `d` deep along `n`. */
function bar(p: Part, a: V3, b: V3, w: number, d: number, n: V3) {
  const t: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], L = Math.hypot(...t)
  const T: V3 = [t[0] / L, t[1] / L, t[2] / L]
  // side = n × T, in the face's plane.
  const s: V3 = [n[1] * T[2] - n[2] * T[1], n[2] * T[0] - n[0] * T[2], n[0] * T[1] - n[1] * T[0]]
  const at = (q: V3, i: number, j: number): V3 => [q[0] + s[0] * i * w / 2 + n[0] * j * d / 2, q[1] + s[1] * i * w / 2 + n[1] * j * d / 2, q[2] + s[2] * i * w / 2 + n[2] * j * d / 2]
  const ring = (q: V3) => [at(q, -1, -1), at(q, 1, -1), at(q, 1, 1), at(q, -1, 1)]
  const R0 = ring(a), R1 = ring(b)
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4, mid: V3 = [(R0[i][0] + R0[j][0]) / 2 - a[0], (R0[i][1] + R0[j][1]) / 2 - a[1], (R0[i][2] + R0[j][2]) / 2 - a[2]]
    quad(p, R0[i], R0[j], R1[j], R1[i], mid)
  }
}

export function buildTower() {
  const brick = new Part(), steel = new Part(), glass = new Part(), stone = new Part(), roof = new Part(), win = new Part()
  const inFrame = (c: XY) => c[0] > F.x0 - 0.5 && c[1] > F.y0 - 0.5

  // --- Podium: charcoal-grey brick base, red brick above, louvred bays.
  {
    prism(steel, PODIUM, -0.6, STREET + 6.5, null)
    prism(brick, PODIUM, STREET + 6.5, PODIUM_TOP, null)
    // Coping and the garage's roof deck.
    const lip = 0.5
    for (const f of facesOf(PODIUM)) {
      const P = (s: number, d: number, z: number): V3 => [f.A[0] + f.u[0] * s - f.o[0] * d, f.A[1] + f.u[1] * s - f.o[1] * d, z]
      quad(stone, P(0, -0.12, PODIUM_TOP + 0.9), P(f.L, -0.12, PODIUM_TOP + 0.9), P(f.L, lip, PODIUM_TOP + 0.9), P(0, lip, PODIUM_TOP + 0.9), [0, 0, 1])
      quad(stone, P(0, -0.12, PODIUM_TOP - 0.4), P(f.L, -0.12, PODIUM_TOP - 0.4), P(f.L, -0.12, PODIUM_TOP + 0.9), P(0, -0.12, PODIUM_TOP + 0.9), [f.o[0], f.o[1], 0])
      quad(brick, P(0, lip, PODIUM_TOP + 0.9), P(f.L, lip, PODIUM_TOP + 0.9), P(f.L, lip, PODIUM_TOP), P(0, lip, PODIUM_TOP), [-f.o[0], -f.o[1], 0])
      if (f.L < 8) continue
      // Storefronts, then two tiers of louvred parking bays.
      bays(f, 6.0, (s0, s1, c) => panel(win, f, s0, s1, Math.max(ground(c[0]) + 0.3, 0.8), STREET + 5.2), 4.8, inFrame)
      bays(f, 5.0, (s0, s1) => panel(win, f, s0, s1, STREET + 7.6, STREET + 13.4), 3.6, inFrame)
      bays(f, 5.0, (s0, s1) => panel(win, f, s0, s1, STREET + 14.8, STREET + 26.8), 3.6, inFrame)
    }
    // Garage deck (the tower stands on the rest).
    cap(roof, [[-54.0, -19.2], [-4.9, -18.6], [-4.8, 18.3], [-54.0, 18.1]], PODIUM_TOP)
  }

  // --- Tower shaft: stone grid on Worthington (−y), curtain wall elsewhere.
  {
    const shaft = clean(TOWER)
    for (const f of facesOf(shaft)) {
      const worth = f.o[1] < -0.9 && f.L > 20
      const wall = worth ? stone : steel
      quad(wall, [f.A[0], f.A[1], PODIUM_TOP], [f.B[0], f.B[1], PODIUM_TOP], [f.B[0], f.B[1], ROOF], [f.A[0], f.A[1], ROOF], [f.o[0], f.o[1], 0])
      if (f.L < 6) continue
      const storey = (ROOF - PODIUM_TOP) / 16
      for (let r = 0; r < 8; r++) {
        const z0 = PODIUM_TOP + 0.5 + r * 2 * storey
        if (worth) {
          // Tan stone grid: one window per bay per two floors.
          bays(f, 8.5, (s0, s1) => panel(glass, f, s0, s1, z0 + 0.6, z0 + 2 * storey - 0.9), 6.6)
        } else {
          // Curtain wall: wide glass panels, dark bands between pairs of floors.
          bays(f, 9.6, (s0, s1) => panel(glass, f, s0, s1, z0 + 0.35, z0 + 2 * storey - 0.65), 9.2, inFrame)
        }
      }
    }
    // Roof, a dark coping, and a pale mechanical penthouse set back from the edges.
    cap(roof, shaft, ROOF - 0.6)
    for (const f of facesOf(shaft)) {
      const P = (s: number, d: number, z: number): V3 => [f.A[0] + f.u[0] * s - f.o[0] * d, f.A[1] + f.u[1] * s - f.o[1] * d, z]
      quad(steel, P(0, 0, ROOF), P(f.L, 0, ROOF), P(f.L, 0.5, ROOF), P(0, 0.5, ROOF), [0, 0, 1])
      quad(steel, P(0, 0.5, ROOF), P(f.L, 0.5, ROOF), P(f.L, 0.5, ROOF - 0.6), P(0, 0.5, ROOF - 0.6), [-f.o[0], -f.o[1], 0])
    }
    softBox(stone, [[4, -11], [36, -11], [36, 9], [4, 9]], ROOF - 0.6, ROOF + 5.2, 0.4, roof)
  }

  // --- The corner: a glass prism inside a black steel cage with X braces.
  {
    const gx0 = F.x0, gx1 = F.x1 + 0.5, gy0 = F.y0, gy1 = F.y1 + 0.5
    const GZ = ROOF + 3.5
    const ring: XY[] = [[gx0, gy0], [gx1, gy0], [gx1, gy1], [gx0, gy1]]
    prism(steel, ring, -0.6, GZ, roof)
    // Glass on the two outer faces, two floors to a panel above the podium.
    for (const f of facesOf(ring)) {
      if (!(f.o[0] > 0.9 || f.o[1] > 0.9)) continue
      const rows: [number, number][] = [[Math.max(ground(F.x1), 0.8), STREET + 5.2], [STREET + 6.4, STREET + 15.8], [STREET + 16.6, PODIUM_TOP]]
      for (let z = PODIUM_TOP + 0.5; z + 7 < GZ; z += 8.3) rows.push([z + 0.25, Math.min(z + 7.85, GZ - 0.5)])
      for (const [z0, z1] of rows) panel(glass, f, 0.4, f.L - 0.4, z0, z1)
    }
    // The cage: four columns, ring beams, X braces on the outer faces.
    const c0 = gx0 - 0.2, c1 = gx1 + FO, d0 = gy0 - 0.2, d1 = gy1 + FO
    const cols: XY[] = [[c1, d0], [c1, d1], [c0, d1], [c0, d0]]
    for (const [x, y] of cols) softBox(steel, [[x - 0.8, y - 0.8], [x + 0.8, y - 0.8], [x + 0.8, y + 0.8], [x - 0.8, y + 0.8]], -0.6, TOP, 0.2, steel)
    const RINGS = [PODIUM_TOP, STREET + 48, STREET + 70, ROOF, TOP - 9.5, TOP - 0.9]
    // Outer faces: east (+x) from (c1,d0) to (c1,d1); north (+y) from (c1,d1) to (c0,d1).
    const outer: { a: XY; b: XY; n: V3 }[] = [
      { a: [c1, d0], b: [c1, d1], n: [1, 0, 0] },
      { a: [c1, d1], b: [c0, d1], n: [0, 1, 0] },
      { a: [c0, d1], b: [c0, d0], n: [-1, 0, 0] },
      { a: [c0, d0], b: [c1, d0], n: [0, -1, 0] },
    ]
    for (const [k, f] of outer.entries()) {
      const open = k < 2 // the two faces seen from the street
      for (const z of RINGS) {
        if (!open && z < ROOF) continue
        bar(steel, [f.a[0], f.a[1], z], [f.b[0], f.b[1], z], 1.4, 1.0, f.n)
      }
      if (!open) continue
      const levels = [0, ...RINGS.slice(0, 4)]
      for (let i = 0; i < levels.length - 1; i++) {
        const z0 = levels[i] + 0.4, z1 = levels[i + 1] - 0.4
        bar(steel, [f.a[0], f.a[1], z0], [f.b[0], f.b[1], z1], 1.3, 0.7, f.n)
        bar(steel, [f.b[0], f.b[1], z0], [f.a[0], f.a[1], z1], 1.3, 0.7, f.n)
      }
      // The Lowe's sign: a navy panel in the top of the cage (no lettering).
      const inset = 1.2, n = f.n
      const P = (t: number, z: number): V3 => [f.a[0] + (f.b[0] - f.a[0]) * t - n[0] * 0.2, f.a[1] + (f.b[1] - f.a[1]) * t - n[1] * 0.2, z]
      const L = Math.hypot(f.b[0] - f.a[0], f.b[1] - f.a[1]), t0 = inset / L, t1 = 1 - inset / L
      quad(win, P(t0, TOP - 8.6), P(t1, TOP - 8.6), P(t1, TOP - 2.0), P(t0, TOP - 2.0), n)
      quad(win, P(t1, TOP - 8.6), P(t0, TOP - 8.6), P(t0, TOP - 2.0), P(t1, TOP - 2.0), [-n[0], -n[1], 0])
    }
  }

  return {
    id: 'clt-design-center-tower', name: 'Design Center Tower', anchor: [0, 0] as XY, height: TOP,
    parts: [
      { part: glass, material: GLASS },
      { part: steel, material: STEEL },
      { part: brick, material: BRICK },
      { part: stone, material: STONE },
      { part: roof, material: PALETTE.roof },
      { part: win, material: PALETTE.window },
    ],
  }
}

if (import.meta.main) await write(buildTower())
