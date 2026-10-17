/**
 * Vantage South End, 1100 S. Tryon St, South End, Charlotte: two 11-storey
 * office towers either side of a landscaped courtyard on Carson Blvd
 * (Vision Ventures / Childress Klein, completed 2021) — procedural, CC0-1.0.
 * bun generators/clt-vantage-south-end.ts
 *
 * The two towers are different designs, so one model draws both:
 *  - West Tower (Winnifred St side; LendingTree, signs on the crown): a long
 *    wedge of pale reflective glass, its glass box cantilevered over a
 *    colonnade of round columns at the Carson Blvd end (Sixty Vines below),
 *    on a charcoal-brick base; its south third, toward the parking deck, is
 *    a grey precast grid with punched windows.
 *  - East Tower (S. Tryon St side; The Hartford, Alston & Bird, Grant
 *    Thornton): the same height and glass, with the courtyard face broken by
 *    a stack of angled, recessed balconies (the "sawtooth" seen from Carson),
 *    on a one-storey charcoal-brick base.
 * The plan reads as two mirrored wedges opening the courtyard toward Carson.
 *
 * Evidence:
 *  - OSM: way/1059944465 (West Tower, height 51, 11 levels), way/1059944467
 *    (East Tower, height 51, 11 levels). No building:parts. The parking deck
 *    way/875274994 (across Vantage Park Dr) is not drawn and not replaced.
 *  - USGS NAIP (public domain) for the plan, the white roofs, the mechanical
 *    screens on each roof and the stepped courtyard face of the East Tower.
 *  - Lidar, USGS 3DEP NC Phase 4 Mecklenburg 2016 (1 m): flown before the
 *    towers were built, so used for the ground only. Ground under the
 *    footprints rises ~1.4 m from the West Tower's Winnifred face (y = 0) to
 *    the East Tower.
 *  - Photos (Wikimedia Commons, City Dweller 2, CC BY-SA 4.0, May 2024):
 *    https://commons.wikimedia.org/wiki/File:Vantage_South_End_viewed_from_the_Crown_of_the_Queen_City_Mid-May_2024.jpg (both towers from the north-east)
 *    https://commons.wikimedia.org/wiki/File:Vantage_South_End_from_The_Roman_Catholic_Diocese_Pastoral_Center_Mid-May_2024.jpg (West Tower from the north-west)
 *    https://commons.wikimedia.org/wiki/File:Vantage_South_End_along_Winnifred_Early_May_2024.jpg (West Tower, north corner, colonnade)
 *    https://commons.wikimedia.org/wiki/File:Vantage_South_End_along_South_Church_St_Mid-May_2024.jpg (West Tower from the west)
 *    https://commons.wikimedia.org/wiki/File:Vantage_South_End_Courtyard_on_West_Carson_Early_May_2024.jpg (courtyard: both towers' Carson ends, the sawtooth)
 *    https://commons.wikimedia.org/wiki/File:Vantage_South_End_sculptures_Mid-May_2024.jpg (East Tower courtyard face, brick base)
 *    https://commons.wikimedia.org/wiki/File:Vantage_South_End_along_West_Carson_Blvd_Mid-May_2024.jpg (West Tower cantilever and columns)
 *    https://commons.wikimedia.org/wiki/File:Vantage_South_End_from_South_Tryon_St_near_West_Morehead_St_Mid-May_2024.jpg (East Tower from up Tryon)
 *
 * Heights: roofs 51 m above each tower's own ground (OSM height; consistent
 * with 11 storeys in the photos: a ~6 m ground floor, ~4.2 m offices, a
 * parapet). Estimated from the photos: the West Tower's glass box starting
 * at 10.5 m and its colonnade 9 m deep, the East Tower's brick base (6.5 m),
 * the balcony notches (position and size), the mechanical screens (4 m tall,
 * plan from NAIP), mullion spacing. The towers' published height was not found.
 *
 * Doubts: no photo of the Tryon (south-east) face of the East Tower or of
 * the Vantage Park Dr ends; they are drawn like the other glass faces. The
 * crown signs are not modelled.
 *
 * Model frame: bearing 41 (model +y runs north-east along Winnifred St and
 * S. Tryon St; +x is south-east, toward Tryon); metres above the base.
 * Anchor: area centroid of the two towers.
 *
 * Exports the curtain-wall helpers used by clt-dfa-building and clt-110-east.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { type Built, type XY, cap, clean, clip, prism, quad, softBox, tri, write } from './clt-highland-park-mill-3'

export type Face = { A: XY; B: XY; u: XY; o: XY; L: number }
export function facesOf(P: XY[]): Face[] {
  const Q = clean(P)
  return Q.map((A, i) => {
    const B = Q[(i + 1) % Q.length], L = Math.hypot(B[0] - A[0], B[1] - A[1])
    return { A, B, L, u: [(B[0] - A[0]) / L, (B[1] - A[1]) / L] as XY, o: [(B[1] - A[1]) / L, (A[0] - B[0]) / L] as XY }
  })
}
/** A point on a face: `s` along it, `d` out from it, at height z. */
export const at = (f: Face, s: number, d: number, z: number): V3 => [f.A[0] + f.u[0] * s + f.o[0] * d, f.A[1] + f.u[1] * s + f.o[1] * d, z]
/** A flat panel on a face, from s0 to s1 along it, z0..z1, `d` proud. */
export function panel(p: Part, f: Face, s0: number, s1: number, z0: number, z1: number, d = 0.05) {
  quad(p, at(f, s0, d, z0), at(f, s1, d, z0), at(f, s1, d, z1), at(f, s0, d, z1), [f.o[0], f.o[1], 0])
}
/** A shallow box standing `d` proud of a face: a ledge, a mullion, a fin. */
export function ledge(p: Part, f: Face, s0: number, s1: number, z0: number, z1: number, d: number) {
  const N: V3 = [f.o[0], f.o[1], 0]
  quad(p, at(f, s0, d, z0), at(f, s1, d, z0), at(f, s1, d, z1), at(f, s0, d, z1), N)
  quad(p, at(f, s0, 0, z1), at(f, s1, 0, z1), at(f, s1, d, z1), at(f, s0, d, z1), [0, 0, 1])
  quad(p, at(f, s0, 0, z0), at(f, s1, 0, z0), at(f, s1, d, z0), at(f, s0, d, z0), [0, 0, -1])
  quad(p, at(f, s0, 0, z0), at(f, s0, d, z0), at(f, s0, d, z1), at(f, s0, 0, z1), [-f.u[0], -f.u[1], 0])
  quad(p, at(f, s1, 0, z0), at(f, s1, d, z0), at(f, s1, d, z1), at(f, s1, 0, z1), [f.u[0], f.u[1], 0])
}
/** Walls of a ring between two heights (no lid). */
export function walls(p: Part, P: XY[], z0: number, z1: number) { prism(p, P, z0, z1, null) }
/**
 * A coped parapet: a pale lip `w` wide on top of the wall at `z`, an inner
 * face down to the roof deck at `z - h`, and the deck itself.
 */
export function parapet(trim: Part, inner: Part, roof: Part, P: XY[], z: number, h: number, w = 0.5) {
  for (const f of facesOf(P)) {
    quad(trim, at(f, 0, 0.08, z), at(f, f.L, 0.08, z), at(f, f.L, -w, z), at(f, 0, -w, z), [0, 0, 1])
    quad(trim, at(f, 0, 0.08, z - 0.6), at(f, f.L, 0.08, z - 0.6), at(f, f.L, 0.08, z), at(f, 0, 0.08, z), [f.o[0], f.o[1], 0])
    quad(inner, at(f, 0, -w, z), at(f, f.L, -w, z), at(f, f.L, -w, z - h), at(f, 0, -w, z - h), [-f.o[0], -f.o[1], 0])
  }
  cap(roof, P, z - h)
}
/**
 * A curtain wall over a face between z0 and z1: pale floor lines every
 * `every` metres (one per two or three storeys) and mullions every `pitch`,
 * standing `d` proud of the glass.
 */
export function curtain(trim: Part, f: Face, s0: number, s1: number, z0: number, z1: number, every: number, pitch: number, d = 0.12, lw = 0.45) {
  for (let z = z0 + every; z < z1 - 1.5; z += every) ledge(trim, f, s0, s1, z - lw / 2, z + lw / 2, d)
  const n = Math.max(1, Math.round((s1 - s0) / pitch))
  for (let k = 1; k < n; k++) {
    const s = s0 + (k * (s1 - s0)) / n
    ledge(trim, f, s - 0.18, s + 0.18, z0, z1, d * 0.8)
  }
}
/** A round column, smooth-shaded. */
export function column(p: Part, c: XY, r: number, z0: number, z1: number, seg = 10) {
  for (let i = 0; i < seg; i++) {
    const a0 = (i / seg) * 2 * Math.PI, a1 = ((i + 1) / seg) * 2 * Math.PI
    const P = (a: number, z: number): V3 => [c[0] + r * Math.cos(a), c[1] + r * Math.sin(a), z]
    const N = (a: number): V3 => [Math.cos(a), Math.sin(a), 0]
    p.tri(P(a0, z0), P(a1, z0), P(a1, z1), undefined, undefined, undefined, [N(a0), N(a1), N(a1)])
    p.tri(P(a0, z0), P(a1, z1), P(a0, z1), undefined, undefined, undefined, [N(a0), N(a1), N(a0)])
  }
}
/** A flat triangle on a face (flush recess, sign), `d` proud. */
export function flushTri(p: Part, f: Face, a: [number, number], b: [number, number], c: [number, number], d = 0.06) {
  tri(p, at(f, a[0], d, a[1]), at(f, b[0], d, b[1]), at(f, c[0], d, c[1]), [f.o[0], f.o[1], 0])
}

/** Write, with anything below the base (buried wall feet) raised to y = 0. */
export async function writeAtBase(b: Built, budget = 5000) {
  for (const { part } of b.parts) for (let i = 1; i < part.pos.length; i += 3) part.pos[i] = Math.max(0, part.pos[i])
  await write(b, budget)
}

// ---------------------------------------------------------------------------

const GLASS = windowVariant(2, 0x93afcb)
const BRICK = finish('vantage-brick', 0x7d838c)
const MULLION = finish('vantage-mullion', 0xd9dde0)
const ROOF = finish('vantage-roof', 0xd0d4d7)
const PRECAST = finish('vantage-precast', 0xb9bcbd)

/** Ground above base (lidar): ~0 on Winnifred, rising ~1.4 m to the East Tower. */
const ground = (x: number) => Math.max(0, Math.min(1.5, 0.024 * (x + 48)))

const WEST: XY[] = [[-49.8, -37.9], [-8.3, -37.8], [-8.7, -16.3], [-26.1, 49.3], [-49.0, 53.5]]
const EAST: XY[] = [[9.9, -37.6], [53.2, -37.7], [50.9, 36.1], [24.5, 41.2], [10.2, -16.3]]
const H = 51
const STOREY = 4.2

function buildVantage() {
  const glass = new Part(), win = new Part(), brick = new Part(), trim = new Part(), roof = new Part(), pre = new Part()

  // --- West Tower.
  {
    const g = ground(-49), top = g + H, box = g + 10.5
    // The glass box from 10.5 m up; its south third (toward the deck) is a
    // grey precast grid with punched windows instead.
    const N = clip(WEST, [0, -10], [1, 0]), S = clip(WEST, [0, -10], [-1, 0])
    walls(glass, N, box, top - 0.6)
    walls(pre, S, box, top - 0.6)
    walls(brick, WEST, box - 0.9, box) // the slab edge under the box
    cap(roof, WEST, box - 0.9, false)
    parapet(trim, trim, roof, WEST, top, 1.6)
    // Banded: the slab edges stand out as fins, every two storeys here.
    for (const f of facesOf(N)) {
      if (Math.abs(f.o[1] + 1) < 0.05 && Math.abs(f.A[1] + 10) < 0.5) continue
      for (let z = box + 2 * STOREY; z < top - 2; z += 2 * STOREY) ledge(trim, f, 0, f.L, z - 0.3, z + 0.3, 0.45)
      curtain(trim, f, 0, f.L, box, top - 0.6, 100, 12, 0.08, 0.3)
    }
    for (const f of facesOf(S)) {
      if (Math.abs(f.o[1] - 1) < 0.05 && Math.abs(f.A[1] + 10) < 0.5) continue
      const n = Math.floor(f.L / 3.6), s0 = (f.L - n * 3.6) / 2
      for (let k = 0; k < n; k++) for (let z = box + 0.6; z + 2 * STOREY < top; z += 2 * STOREY)
        panel(win, f, s0 + 3.6 * k + 0.6, s0 + 3.6 * (k + 1) - 0.6, z, z + 2 * STOREY - 1.4)
    }
    // Brick base, set back under the box; the Carson end opens as a
    // colonnade 9 m deep, with round columns carrying the box.
    const base: XY[] = [[-49.3, -37.4], [-8.8, -37.3], [-9.2, -16.3], [-24.5, 41.0], [-48.6, 44.5]]
    walls(brick, base, -0.6, box - 0.9)
    for (const f of facesOf(base)) {
      if (f.L < 10) continue
      const n = Math.floor(f.L / 6.2), s0 = (f.L - n * 6.2) / 2
      for (let k = 0; k < n; k++) {
        const s = s0 + 6.2 * (k + 0.5), c: XY = [f.A[0] + f.u[0] * s, f.A[1] + f.u[1] * s]
        panel(win, f, s - 2.4, s + 2.4, ground(c[0]) + 0.3, g + 5.4)
        panel(win, f, s - 2.4, s + 2.4, g + 6.3, box - 1.6)
      }
    }
    for (const c of [[-46.2, 51.2], [-37.0, 49.8], [-28.0, 48.0], [-47.0, 47.5]] as XY[]) column(trim, c, 0.55, -0.6, box - 0.9)
    // Mechanical screen (NAIP: a long box down the roof's middle).
    softBox(roof, [[-36, -24], [-21, -24], [-21, 20], [-36, 20]], top - 1.6, top + 3.2, 0.4, roof)
  }

  // --- East Tower.
  {
    const g = ground(10), top = ground(30) + H, base = g + 6.5
    walls(glass, EAST, base, top - 0.6)
    parapet(trim, trim, roof, EAST, top, 1.6)
    const F = facesOf(EAST)
    for (const f of F) curtain(trim, f, 0, f.L, base, top - 0.6, 2 * STOREY, f.L > 40 ? 7.5 : 5.8)
    walls(brick, EAST, -0.6, base)
    ledge(trim, F[0], 0, F[0].L, base - 0.5, base, 0.15)
    for (const f of F) {
      ledge(trim, f, 0, f.L, base - 0.5, base, 0.15)
      const n = Math.floor(f.L / 6.2), s0 = (f.L - n * 6.2) / 2
      for (let k = 0; k < n; k++) {
        const s = s0 + 6.2 * (k + 0.5), c: XY = [f.A[0] + f.u[0] * s, f.A[1] + f.u[1] * s]
        panel(win, f, s - 2.4, s + 2.4, Math.max(ground(c[0]) + 0.3, g + 0.4), base - 1.0)
      }
    }
    // The courtyard face's angled balcony recesses: a staggered stack of
    // dark wedges, one per storey, toward the Carson end.
    const yard = F.find((f) => f.o[0] < -0.9 && f.L > 40)!
    for (let k = 0; k * STOREY + 3.6 < H - 8; k++) {
      const z = base + 0.5 + k * STOREY, s = yard.L * 0.62 + (k % 2 ? -7 : 7)
      flushTri(win, yard, [s - 9, z], [s + 9, z], [k % 2 ? s - 9 : s + 9, z + 3.4], 0.14)
    }
    softBox(roof, [[24, -24], [39, -24], [39, 18], [24, 18]], top - 1.6, top + 3.2, 0.4, roof)
  }

  return {
    id: 'clt-vantage-south-end', name: 'Vantage South End', anchor: [0, 0] as XY, height: ground(30) + H + 3.2,
    parts: [
      { part: glass, material: GLASS },
      { part: win, material: PALETTE.window },
      { part: brick, material: BRICK },
      { part: trim, material: MULLION },
      { part: roof, material: ROOF },
      { part: pre, material: PRECAST },
    ],
  }
}

if (import.meta.main) await writeAtBase(buildVantage())
