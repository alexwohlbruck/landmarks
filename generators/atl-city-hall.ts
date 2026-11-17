/**
 * Atlanta City Hall (1930, G. Lloyd Preacher) with its 1989 annex: procedural, CC0-1.0.
 * bun generators/atl-city-hall.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 33.5 (the
 * walls run 33.5 degrees east of north). Model +y (compass 33.5) is the
 * tower's front on Mitchell Street. Origin: the area centroid of OSM
 * way/113041909 (-84.3905268, 33.7486235). y = 0 is the lowest ground under
 * the footprint, at the annex's west wall; the site climbs about 8 m to the
 * tower's front steps and 9 m to the east side, so the walls on the uphill
 * sides sink into the hill and every facade's windows start at its own
 * ground level (read from the lidar ground returns).
 *
 * Form: the 1930 building is a cream terracotta Neo-Gothic / Art Deco tower
 * rising from a five-storey U-shaped base. The tower's shaft is cut by
 * continuous vertical window bays between pale piers, then steps in twice
 * (pinnacles at each setback) to a crown of arched windows and a raised
 * centre. A tall Gothic entrance frontispiece stands at its foot. Behind it
 * (south) the 1989 annex: a long six-storey block with a pale teal mansard
 * rim, a glass atrium roof, a raised plant block and a round pavilion on its
 * south side, plus two lower wings to the north-west and north-east.
 *
 * Sources
 * - OSM way/113041909 (outline, height 66.6, 17 levels), parts
 *   way/883956342 (annex, 6 levels), way/883956343 (1930 base, 5 levels),
 *   way/883956344 ("City Hall Tower", height 66.6). The tower part sits 1-4 m
 *   off the lidar tower; the model follows the lidar: x -14.5..11,
 *   y 37.5..55.5.
 * - USGS 3DEP lidar GA_Statewide_B2_2018 (2018 flight), 1 m grid, heights
 *   above the model's y = 0: tower shaft 52.4, second stage 60.7, crown
 *   stage 67.5, crown centre 71.4; base wings 22.6; entrance frontispiece
 *   18.6; courtyard link 14.4; annex eaves 26.3, mansard rim 29.3, plant
 *   block 32.4, atrium ridge 31.9, round pavilion 18.6; north-west and
 *   north-east annex wings 22.7 and 22.4. Ground: 0-0.5 on the west, 5 along
 *   the historic west wing, 7-8 at the tower's front, 8.7 on the east.
 * - USGS NAIP (public domain): the annex's teal mansard rim, white flat roofs
 *   and blue atrium glass, the round pavilion.
 * - Photos (Wikimedia Commons, EVIDENCE): Warren LeMay, "Atlanta City Hall,
 *   Atlanta, GA (47421888442).jpg" (front), "(46559467575).jpg" (west base
 *   and tower), "(47421888572).jpg", "(47474768601).jpg", "(46751455774).jpg",
 *   CC0; Gabriel Benzur, "Atlanta City Hall from HABS.jpg" (1981 aerial,
 *   public domain); Atlantacitizen, "Atlanta City Hall (223).jpg", public
 *   domain.
 * Estimated: bay counts and window panel sizes (photos), the setbacks'
 *   insets (lidar at 1 m, so within about 1 m), the pinnacles' size.
 * Doubts: no open photo shows the 1989 annex's walls, so its walls are plain
 *   cream with grouped window panels; its roof colours come from NAIP. The
 *   OSM outline is out of date by a few metres at the tower and the
 *   frontispiece (which stands 2.5 m past it).
 * Left out: the terracotta tracery, spandrel ornament (the green panels are
 *   folded into the window colour), the crenellation's fine teeth.
 * Night: the tower is floodlit (`floodlight` on the tower's terracotta, more
 *   toward the crown); windows and the entrance are `window`.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, type Swatch } from './palette'
import { type Face, lathe, flatShape, finishGlb, writeModel, archShape } from './sea-tacoma-union-station'
import { box, bays, faceX, faceY, sOf, qf, tf } from './atl-georgia-state-capitol'

const SHAFT = 52.4, ST2 = 60.7, ST3 = 67.5, BASE = 22.6

function build() {
  const terra = new Part(), stone = new Part(), win = new Part(), flat = new Part(), teal = new Part(), glass = new Part()

  /** Window rows on a run of wall: panels two storeys tall from the ground g up to `top`. */
  const rows = (part: Part, f: Face, a: number, b: number, n: number, w: number, g: number, top: number, h = 5.2, gap = 1.3) => {
    const s0 = Math.min(sOf(f, a), sOf(f, b)), s1 = Math.max(sOf(f, a), sOf(f, b))
    for (let z = g + 1.0; z + 2.5 <= top; z += h + gap) bays(part, f, s0, s1, n, w, z, Math.min(z + h, top))
  }
  /** A small pinnacle: a square shaft and a pyramid cap. */
  const pinnacle = (x: number, y: number, z0: number, h: number, r = 0.55) => {
    box(terra, null, x - r, y - r, x + r, y + r, z0, z0 + h * 0.6, 0.1)
    const t = z0 + h, b = z0 + h * 0.6
    const c: V3[] = [[x - r, y - r, b], [x + r, y - r, b], [x + r, y + r, b], [x - r, y + r, b]]
    for (let i = 0; i < 4; i++) {
      const p = c[i], q = c[(i + 1) % 4]
      terra.tri(p, q, [x, y, t])
    }
  }

  // ---------------------------------------------------------------- the 1989 annex
  // main block, eaves 26.3, a teal mansard rim to 29.3 round a lower flat roof
  {
    const X0 = -53.9, X1 = 49.8, Y0 = -38.9, Y1 = 9.7, E = 26.3, R = 29.3, IN = 3.2
    box(stone, null, X0, Y0, X1, Y1, 0, E, 0.3)
    const o: [number, number][] = [[X0, Y0], [X1, Y0], [X1, Y1], [X0, Y1]]
    const i: [number, number][] = [[X0 + IN, Y0 + IN], [X1 - IN, Y0 + IN], [X1 - IN, Y1 - IN], [X0 + IN, Y1 - IN]]
    for (let k = 0; k < 4; k++) {
      const a = o[k], b = o[(k + 1) % 4], c = i[(k + 1) % 4], d = i[k]
      const out: V3 = [b[1] - a[1], a[0] - b[0], 0]
      const n: V3 = [out[0] * 0.6, out[1] * 0.6, Math.hypot(out[0], out[1])]
      qf(teal, [a[0], a[1], E], [b[0], b[1], E], [c[0], c[1], R], [d[0], d[1], R], n)
      qf(teal, [d[0], d[1], R], [c[0], c[1], R], [c[0], c[1], R - 1.3], [d[0], d[1], R - 1.3], [-out[0], -out[1], 0])
    }
    qf(flat, [i[0][0], i[0][1], R - 1.3], [i[1][0], i[1][1], R - 1.3], [i[2][0], i[2][1], R - 1.3], [i[3][0], i[3][1], R - 1.3], [0, 0, 1])
    // the raised plant block (west) and the glass atrium roof (centre)
    box(stone, flat, -42.0, -26.0, -18.0, 2.0, R - 1.5, 32.4, 0.3)
    for (const [y0, y1] of [[-26.0, -16.8], [-16.8, -7.6], [-7.6, 2.0]]) {
      const ym = (y0 + y1) / 2
      qf(glass, [-12, y0, R - 1.3], [12, y0, R - 1.3], [12, ym, 31.9], [-12, ym, 31.9], [0, -1, 1.5])
      qf(glass, [-12, y1, R - 1.3], [12, y1, R - 1.3], [12, ym, 31.9], [-12, ym, 31.9], [0, 1, 1.5])
      tf(glass, [12, y0, R - 1.3], [12, ym, 31.9], [12, y1, R - 1.3], [1, 0, 0])
      tf(glass, [-12, y0, R - 1.3], [-12, y1, R - 1.3], [-12, ym, 31.9], [-1, 0, 0])
    }
    // windows: grouped two-storey panels from each wall's own ground
    rows(win, faceX(X0, -1), Y0, Y1, 9, 2.6, 0.4, E - 1)
    rows(win, faceX(X1, 1), Y0, Y1, 9, 2.6, 6.5, E - 1)
    rows(win, faceY(Y0, -1), X0, -20.0, 6, 2.6, 0.8, E - 1)
    rows(win, faceY(Y0, -1), 13.0, X1, 7, 2.6, 5.2, E - 1)
    rows(win, faceY(Y1, 1), -35.6, -25.5, 2, 2.6, 5.0, E - 1)
    rows(win, faceY(Y1, 1), 21.6, 32.0, 2, 2.6, 5.5, E - 1)
  }
  // the round pavilion on the south side
  lathe(stone, -2.0, -35.3, [[12.5, 0], [12.5, 17.8]], 12, 180, 360)
  lathe(stone, -2.0, -35.3, [[12.5, 17.8], [12.8, 17.9], [12.8, 18.6], [0.01, 18.6]], 12, 180, 360)
  for (let k = 0; k < 6; k++) {
    const a = Math.PI + ((k + 0.5) / 6) * Math.PI, c = Math.cos(a), s = Math.sin(a)
    const f: Face = { o: [-2.0 + c * 12.5, -35.3 + s * 12.5, 0], n: [c, s] }
    for (const [z0, z1] of [[6.0, 11.0], [12.2, 16.8]]) flatShape(win, f, [[-1.6, z0], [1.6, z0], [1.6, z1], [-1.6, z1]], 0.06)
  }
  // the north-west and north-east wings
  box(stone, flat, -53.8, 9.7, -35.6, 26.3, 0, 22.7, 0.3)
  rows(win, faceX(-53.8, -1), 9.7, 26.3, 3, 2.6, 3.2, 21.5)
  rows(win, faceY(26.3, 1), -53.8, -35.6, 3, 2.6, 4.6, 21.5)
  rows(win, faceX(-35.6, 1), 18.3, 26.3, 1, 2.6, 5.0, 21.5)
  box(stone, flat, 32.0, 9.6, 49.8, 26.0, 0, 22.4, 0.3)
  rows(win, faceX(49.8, 1), 9.6, 26.0, 3, 2.6, 8.4, 21.5)
  rows(win, faceY(26.0, 1), 32.0, 49.8, 3, 2.6, 8.2, 21.5)
  rows(win, faceX(32.0, -1), 19.1, 26.0, 1, 2.6, 7.8, 21.5)
  // the connector between the annex and the 1930 building
  box(stone, flat, -10.3, 9.0, 4.9, 19.1, 0, 14.1, 0.2)

  // ---------------------------------------------------------------- the 1930 base
  const baseBlock = (x0: number, y0: number, x1: number, y1: number, top: number) => {
    box(terra, null, x0, y0, x1, y1, 0, top - 0.9, 0.3)
    box(terra, flat, x0 - 0.2, y0 - 0.2, x1 + 0.2, y1 + 0.2, top - 0.9, top, 0.2)
  }
  baseBlock(-25.5, 18.3, -14.5, 54.8, BASE)
  baseBlock(11.0, 19.1, 21.6, 54.8, BASE)
  baseBlock(-14.5, 18.3, 11.0, 37.6, BASE)
  baseBlock(-6.5, 18.3, 5.0, 37.6, 14.4) // the low courtyard link (inside the U)
  // base windows: tall grouped bays, Gothic-headed on the top storey
  const baseWin = (f: Face, a: number, b: number, n: number, g: number) => {
    const s0 = Math.min(sOf(f, a), sOf(f, b)) + 0.8, s1 = Math.max(sOf(f, a), sOf(f, b)) - 0.8
    bays(win, f, s0, s1, n, 1.7, g + 1.2, Math.min(g + 6.4, 13.0))
    bays(win, f, s0, s1, n, 1.7, Math.min(g + 7.6, 14.2), 20.8, true)
  }
  baseWin(faceX(-25.5, -1), 18.3, 54.8, 9, 5.0)
  baseWin(faceX(21.6, 1), 19.1, 54.8, 9, 7.8)
  baseWin(faceY(54.8, 1), -25.5, -14.5, 3, 5.2)
  baseWin(faceY(54.8, 1), 11.0, 21.6, 3, 7.6)
  baseWin(faceY(18.3, -1), -25.5, -10.3, 3, 5.2)
  baseWin(faceY(19.1, -1), 4.9, 21.6, 3, 6.0)
  // corner pinnacles on the base's front corners
  for (const [x, y] of [[-25.2, 54.5], [-14.8, 54.5], [11.3, 54.5], [21.3, 54.5]]) pinnacle(x, y, BASE, 2.6, 0.5)

  // ---------------------------------------------------------------- the tower
  const TX0 = -14.5, TX1 = 11.0, TY0 = 37.5, TY1 = 55.5
  box(terra, null, TX0, TY0, TX1, TY1, 0, SHAFT, 0.35)
  box(terra, flat, TX0 - 0.25, TY0 - 0.25, TX1 + 0.25, TY1 + 0.25, SHAFT - 0.8, SHAFT, 0.3)
  // the shaft's bays: three grouped panels each, pale spandrel bands between
  const shaftBays = (f: Face, a: number, b: number, n: number, z0: number) => {
    const s0 = Math.min(sOf(f, a), sOf(f, b)) + 1.9, s1 = Math.max(sOf(f, a), sOf(f, b)) - 1.9
    const H = (SHAFT - 1.6 - z0 - 2 * 1.3) / 3
    for (let k = 0; k < 3; k++) bays(win, f, s0, s1, n, 1.45, z0 + k * (H + 1.3), z0 + k * (H + 1.3) + H)
  }
  shaftBays(faceY(TY1, 1), TX0, TX1, 9, 19.8)
  shaftBays(faceY(TY0, -1), TX0, TX1, 9, BASE + 1.0)
  shaftBays(faceX(TX0, -1), TY0, TY1, 6, BASE + 1.0)
  shaftBays(faceX(TX1, 1), TY0, TY1, 6, BASE + 1.0)
  for (const x of [TX0 + 0.3, TX1 - 0.3]) for (const y of [TY0 + 0.3, TY1 - 0.3]) pinnacle(x, y, SHAFT, 3.4, 0.7)
  // second stage, tall arched windows
  const S2 = [-13.0, 38.6, 9.5, 54.4]
  box(terra, null, S2[0], S2[1], S2[2], S2[3], SHAFT, ST2 - 0.7, 0.3)
  box(terra, flat, S2[0] - 0.2, S2[1] - 0.2, S2[2] + 0.2, S2[3] + 0.2, ST2 - 0.7, ST2, 0.2)
  for (const [f, a, b, n] of [[faceY(S2[3], 1), S2[0], S2[2], 7], [faceY(S2[1], -1), S2[0], S2[2], 7], [faceX(S2[0], -1), S2[1], S2[3], 5], [faceX(S2[2], 1), S2[1], S2[3], 5]] as [Face, number, number, number][]) {
    const s0 = Math.min(sOf(f, a), sOf(f, b)) + 1.6, s1 = Math.max(sOf(f, a), sOf(f, b)) - 1.6
    bays(win, f, s0, s1, n, 1.5, SHAFT + 1.4, ST2 - 1.6, true)
  }
  for (const x of [S2[0] + 0.3, S2[2] - 0.3]) for (const y of [S2[1] + 0.3, S2[3] - 0.3]) pinnacle(x, y, ST2, 2.6, 0.55)
  // the crown stage: small arched windows, a parapet, a raised centre
  const S3 = [-10.5, 40.0, 7.0, 53.0]
  box(terra, null, S3[0], S3[1], S3[2], S3[3], ST2, ST3, 0.3)
  for (const [f, a, b, n] of [[faceY(S3[3], 1), S3[0], S3[2], 6], [faceY(S3[1], -1), S3[0], S3[2], 6], [faceX(S3[0], -1), S3[1], S3[3], 4], [faceX(S3[2], 1), S3[1], S3[3], 4]] as [Face, number, number, number][]) {
    const s0 = Math.min(sOf(f, a), sOf(f, b)) + 1.0, s1 = Math.max(sOf(f, a), sOf(f, b)) - 1.0
    bays(win, f, s0, s1, n, 1.2, ST2 + 1.5, ST3 - 2.2, true)
  }
  qf(flat, [S3[0] + 0.6, S3[1] + 0.6, ST3 - 0.6], [S3[2] - 0.6, S3[1] + 0.6, ST3 - 0.6], [S3[2] - 0.6, S3[3] - 0.6, ST3 - 0.6], [S3[0] + 0.6, S3[3] - 0.6, ST3 - 0.6], [0, 0, 1])
  // the parapet: a ring of merlons standing on the crown stage's edge
  const merlons = (x0: number, y0: number, x1: number, y1: number, z: number, h: number, n: number) => {
    for (let k = 0; k < n; k++) {
      const t0 = (k + 0.15) / n, t1 = (k + 0.85) / n
      box(terra, null, x0 + (x1 - x0) * t0, y0, x0 + (x1 - x0) * t1, y0 + 0.6, z, z + h, 0)
      box(terra, null, x0 + (x1 - x0) * t0, y1 - 0.6, x0 + (x1 - x0) * t1, y1, z, z + h, 0)
    }
    for (let k = 0; k < Math.round(n * (y1 - y0) / (x1 - x0)); k++) {
      const m = Math.round(n * (y1 - y0) / (x1 - x0)), t0 = (k + 0.15) / m, t1 = (k + 0.85) / m
      box(terra, null, x0, y0 + (y1 - y0) * t0, x0 + 0.6, y0 + (y1 - y0) * t1, z, z + h, 0)
      box(terra, null, x1 - 0.6, y0 + (y1 - y0) * t0, x1, y0 + (y1 - y0) * t1, z, z + h, 0)
    }
  }
  merlons(S3[0], S3[1], S3[2], S3[3], ST3 - 0.6, 1.4, 6)
  box(terra, null, -6.0, 42.6, 3.0, 51.0, ST3 - 0.6, 70.0, 0.25)
  {
    const c: V3[] = [[-6.0, 42.6, 70.0], [3.0, 42.6, 70.0], [3.0, 51.0, 70.0], [-6.0, 51.0, 70.0]]
    const top: V3 = [-1.5, 46.8, 71.4]
    for (let i = 0; i < 4; i++) flat.tri(c[i], c[(i + 1) % 4], top)
  }

  // ---------------------------------------------------------------- the entrance frontispiece
  box(terra, null, -8.0, TY1 - 0.4, 5.0, 57.6, 0, 17.4, 0.3)
  box(terra, flat, -8.2, TY1 - 0.4, 5.2, 57.8, 17.4, 18.6, 0.2)
  {
    const f = faceY(57.6, 1)
    for (const x of [-4.8, -1.5, 1.8]) flatShape(win, f, archShape(sOf(f, x), 2.6, 8.2, 13.6, 8), 0.06)
  }
  for (const x of [-7.7, -1.5, 4.7]) pinnacle(x, 57.3, 18.6, 2.6, 0.45)

  // Floodlit at night: the 1930 tower, brighter toward the crown.
  const lit = (p: V3, n: V3) => (n[2] > 0.7 ? 0.25 : p[1] > 17 ? 0.5 + 0.5 * Math.min(1, p[2] / 70) : 0.35)
  return finishGlb('Atlanta City Hall', [
    { part: terra, material: { ...finish('ach-terracotta', 0xefe6d4), floodlight: lit } as Swatch },
    { part: stone, material: finish('ach-annex-stone', 0xe6dfd2) },
    { part: win, material: PALETTE.window },
    { part: flat, material: finish('ach-roof', 0xcfcec8) },
    { part: teal, material: finish('ach-mansard', 0x93b6b6) },
    { part: glass, material: PALETTE.glass },
  ], { bearing: 33.5, height: 71.4, replaces: ['way/113041909', 'way/883956342', 'way/883956343', 'way/883956344'] }, 6500)
}

if (import.meta.main) await writeModel('atl-city-hall', build())
