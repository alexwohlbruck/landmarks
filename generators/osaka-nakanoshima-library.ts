/**
 * Osaka Prefectural Nakanoshima Library (大阪府立中之島図書館), Nakanoshima,
 * Osaka: procedural, CC0-1.0.
 * bun generators/osaka-nakanoshima-library.ts
 *
 * Writes two levels of detail in the same frame:
 * - models/osaka-nakanoshima-library.glb, the low model;
 * - models/osaka-nakanoshima-library.detail.glb, drawn from zoom 16: rounder
 *   columns with Corinthian capitals, the dome's ribs, balusters, dentils and
 *   window cornices.
 *
 * Map frame: x east, y north, z up, metres. Built square to the building
 * with the portico on +x; the portico faces west onto Midosuji (the frontal
 * photos were taken from lon 135.5028, west of it, and OSM's 新館 annex
 * abuts the east arm), so the placement's bearing (183.0) turns the model's
 * +x to the west, square to OSM's parts (whose own axes run at 3.0). The origin is the area centroid of the central block
 * (way/1270372191); y = 0 is the ground (flat).
 *
 * Magoichi Noguchi and Yutaka Hidaka (Sumitomo), 1904; wings 1922;
 * Important Cultural Property. Grey granite Neo-Baroque: a Corinthian
 * portico with a pediment before a central hall crowned by a copper dome on
 * a drum, two-storey fronts over a rusticated basement, and later wings to
 * north and south, all under a balustrade.
 *
 * OSM (the library's area, way/220002945, has no building tag; its building
 * parts, in this frame, measured):
 * - way/1270372191, the 1904 block: a cross, the front range x -7.2..6.6 by
 *   y -21.4..21.3, the portico (OSM's west arm) x 6.6..16.7 by y -6.9..6.9,
 *   the rear (east) arm x -16.2..-7.2;
 * - way/1270372186 south wing x -16.7..12.8, y 24.1..37.9 (model +y is
 *   south); way/1270372184 north wing x -16.4..13.2, y -38.0..-24.3;
 * - way/1270372183 and way/1270372185, the links; way/1270372180 and
 *   way/1270372181, two small roofs flanking the steps (drawn as canopies on
 *   posts, as in the frontal photos).
 *
 * The 1904 front elevation ("Front elevation of Osaka Prefectural Nakanoshima
 * Library.jpg", Noguchi and Hidaka, public domain), scaled to OSM's 13.9 m
 * portico (42 px/m), gives (measured from the drawing):
 * - the rusticated basement to 3.0 m, the main floor's windows 4.4-7.5 m,
 *   the upper floor's 9.4-12.0 m;
 * - the columns 1.3 m thick (+-0.1 m at the drawing's scale; drawn 1.42 m,
 *   the bold end of that, so they read) from 3.2 m to 13.2 m, at y -6.1,
 *   -3.0, 3.0, 6.2; the entablature 13.2-15.2 m, the pediment's apex at 18.1 m (drawn 19.4 m: the photos show it
 *   steeper and clearly above the wings' cornice);
 * - the cornice at 15.2 m; a roof behind the parapet to ~18 m;
 * - the dome's square base 14.9 m wide to 18.6 m, a drum to 20.2 m, the
 *   dome 11.8 m across rising to 24.3 m, a lantern to 25.4 m and a finial
 *   to ~27.7 m.
 * The dome's section ("Sectional detail of the dome...", public domain)
 * shows it ribbed, with a skylit eye under the lantern.
 *
 * Bays (west photos, Mc681 201504 003): three window bays each side of the
 * portico on the 1904 front, two on each wing's west end. The recess behind
 * the columns and the portico's ceiling are a shadow tone (#5c5b57), as the
 * photos show them in shade, and so is a plane behind each side's columns
 * (the shadowed depth seen through the portico's open sides). The steps span
 * the portico's full width.
 * Estimated from photos: the wings' heights (as the 1904 cornice, which the
 * photos show continuous); the steps (~8 m deep, fanning out); the second
 * pair of columns on the portico's sides; the hipped roofs' pitch.
 * Colours from photos in sun (Sakai Yayoi, 掬茶, Asturio Cantabrio): the
 * granite a warm light grey #c4c1b9-#d8d5ce, drawn #cac7c0; the dome's
 * copper a dark blue-green (#667b83-#879696 in sun, #243445 in shade,
 * sampled from Sakai Yayoi's south-west view), drawn #5e7f80, its ribs raised
 * in both models; the roofs dark slate,
 * drawn #737981; the doors a dark red-brown.
 * Left out: the 1974 annex and other later buildings (separate in OSM),
 * lettering on the frieze, the cartouches and lamps.
 * Terrain: see the report; elevation 0.
 *
 * Night: the portico is floodlit ("Osaka Prefectural Nakanoshima Library at
 * night", Fumihiro Kato), so the granite carries a warm floodlight wash;
 * windows and the doorway glow.
 *
 * Photos and drawings (Wikimedia Commons, evidence):
 * - "Front elevation of Osaka Prefectural Nakanoshima Library.jpg", Noguchi and Hidaka, public domain
 * - "Sectional detail of the dome of the Osaka Prefectural Nakanoshima Library.jpg", Noguchi and Hidaka, public domain
 * - "Osaka Prefectural Nakanoshima Library ao.jpg", Sakai Yayoi, CC0 (east front)
 * - "Facade of Osaka Prefectural Nakanoshima Library.jpg" and "...20250831.jpg", 掬茶, CC BY-SA 4.0
 * - "Osaka Prefectural Nakanoshima Library 2019-10 ac.jpg", Asturio Cantabrio, CC BY-SA 4.0
 * - "Osaka Prefectural Nakanoshima Library in 201504 001/003/005/010.JPG", Mc681, CC BY-SA 4.0 (dome from the sides)
 * - "大阪府立中之島図書館 - Flickr - m-louis.jpg", m-louis, CC BY-SA 2.0
 * - "Osaka Prefectural Nakanoshima Library at night.jpg", Fumihiro Kato, CC BY 4.0
 * Look-only: none.
 */
import { Part, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { TAU, beam, box, fquad, ftri, writeLods, type Mat, type XY } from './osaka-umeda-sky-building'

const CORNICE = 15.2, PARAPET = 16.4
let FLAT = false

type Parts = { granite: Part; copper: Part; roof: Part; win: Part; door: Part; shade: Part }

function onWall(p: Part, a: XY, b: XY, s0: number, s1: number, z0: number, z1: number, out = 0.06) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
  const P = (s: number, z: number): V3 => [a[0] + u[0] * s + n[0] * out, a[1] + u[1] * s + n[1] * out, z]
  fquad(p, P(s0, z0), P(s1, z0), P(s1, z1), P(s0, z1), [n[0], n[1], 0])
}
function proud(p: Part, a: XY, b: XY, s0: number, s1: number, z0: number, z1: number, d: number, top = true, bottom = false, force = false) {
  if (FLAT && !force) { onWall(p, a, b, s0, s1, z0, z1, Math.min(d, 0.05)); return }
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
  const P = (s: number, o: number, z: number): V3 => [a[0] + u[0] * s + n[0] * o, a[1] + u[1] * s + n[1] * o, z]
  fquad(p, P(s0, d, z0), P(s1, d, z0), P(s1, d, z1), P(s0, d, z1), [n[0], n[1], 0])
  fquad(p, P(s0, 0, z0), P(s0, d, z0), P(s0, d, z1), P(s0, 0, z1), [-u[0], -u[1], 0])
  fquad(p, P(s1, d, z0), P(s1, 0, z0), P(s1, 0, z1), P(s1, d, z1), [u[0], u[1], 0])
  if (top) fquad(p, P(s0, 0, z1), P(s0, d, z1), P(s1, d, z1), P(s1, 0, z1), [0, 0, 1])
  if (bottom) fquad(p, P(s1, 0, z0), P(s1, d, z0), P(s0, d, z0), P(s0, 0, z0), [0, 0, -1])
}

/** A rectangular block (counter-clockwise ring) with the library's wall treatment on chosen faces. */
function range(P: Parts, x0: number, y0: number, x1: number, y1: number, faces: string, detail: boolean, windows = true, eBays = 0) {
  const r: XY[] = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
  const key = ['s', 'e', 'n', 'w']
  for (let i = 0; i < 4; i++) {
    if (!faces.includes(key[i])) continue
    const a = r[i], b = r[(i + 1) % 4], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    onWall(P.granite, a, b, 0, L, 0, PARAPET, 0)
    // basement: a rusticated plinth, proud; a band over it
    proud(P.granite, a, b, -0.2, L + 0.2, 0, 3.0, 0.25, true, false, true)
    proud(P.granite, a, b, -0.2, L + 0.2, 8.2, 8.6, 0.18) // string course between the floors
    proud(P.granite, a, b, -0.5, L + 0.5, CORNICE - 0.7, CORNICE, 0.7, true, true, true) // cornice
    proud(P.granite, a, b, -0.3, L + 0.3, 13.9, 14.5, 0.3) // frieze band
    if (detail) for (let s = 0.3; s < L - 0.3; s += 0.9) proud(P.granite, a, b, s, s + 0.35, CORNICE - 1.0, CORNICE - 0.7, 0.45, true, true) // dentils
    // the balustrade: posts and a rail, or a flat band in the low model
    if (detail) {
      for (let s = 0.4; s < L - 0.3; s += 0.6) proud(P.granite, a, b, s, s + 0.25, CORNICE, PARAPET - 0.25, 0.25, false)
      proud(P.granite, a, b, 0, L, PARAPET - 0.25, PARAPET, 0.35, true, true)
    } else proud(P.granite, a, b, 0, L, CORNICE, PARAPET, 0.25, true, false, true)
    if (!windows || L < 4) continue
    // windows in bays of ~3.6 m: main floor with a cornice head, upper floor with a sill
    const n = key[i] === 'e' && eBays ? eBays : Math.max(1, Math.round((L - 1.6) / 3.6)), pitch = (L - 1.2) / n
    for (let k = 0; k < n; k++) {
      const s = 0.6 + pitch * (k + 0.5)
      proud(P.granite, a, b, s - 1.05, s + 1.05, 4.1, 7.8, 0.12, true, true)
      onWall(P.win, a, b, s - 0.7, s + 0.7, 4.4, 7.5, 0.14)
      proud(P.granite, a, b, s - 1.25, s + 1.25, 7.8, 8.15, 0.3, true, true, detail) // window head
      proud(P.granite, a, b, s - 1.05, s + 1.05, 9.1, 12.3, 0.12, true, true)
      onWall(P.win, a, b, s - 0.7, s + 0.7, 9.4, 12.0, 0.14)
      onWall(P.win, a, b, s - 0.5, s + 0.5, 1.0, 2.2, 0.27) // the basement's grilles
    }
  }
}

/** A hipped roof over a rectangle, from `z0` to ridge height `z1`. */
function hipRoof(p: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number) {
  const w = x1 - x0, d = y1 - y0, h = Math.min(w, d) / 2
  const rA: V3 = w >= d ? [x0 + h, (y0 + y1) / 2, z1] : [(x0 + x1) / 2, y0 + h, z1]
  const rB: V3 = w >= d ? [x1 - h, (y0 + y1) / 2, z1] : [(x0 + x1) / 2, y1 - h, z1]
  const c: V3[] = [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]]
  if (w >= d) {
    fquad(p, c[0], c[1], rB, rA, [0, -1, 1]); fquad(p, c[2], c[3], rA, rB, [0, 1, 1])
    ftri(p, c[1], c[2], rB, [1, 0, 1]); ftri(p, c[3], c[0], rA, [-1, 0, 1])
  } else {
    fquad(p, c[1], c[2], rB, rA, [1, 0, 1]); fquad(p, c[3], c[0], rA, rB, [-1, 0, 1])
    ftri(p, c[0], c[1], rA, [0, -1, 1]); ftri(p, c[2], c[3], rB, [0, 1, 1])
  }
}

/** A column: base, a shaft with entasis, and a capital (Corinthian bell in the detail model). */
function column(P: Parts, x: number, y: number, z0: number, z1: number, r: number, detail: boolean) {
  const k = detail ? 16 : 10
  box(P.granite, x - r * 1.35, y - r * 1.35, x + r * 1.35, y + r * 1.35, z0, z0 + 0.5) // plinth
  const prof: Array<[number, number]> = detail
    ? [[r * 1.2, z0 + 0.5], [r * 1.2, z0 + 0.75], [r, z0 + 0.95], [r, z0 + (z1 - z0) * 0.33], [r * 0.86, z1 - 1.5], [r * 0.95, z1 - 1.45], [r * 0.92, z1 - 1.3], [r * 1.1, z1 - 0.7], [r * 1.35, z1 - 0.3]]
    : [[r * 1.15, z0 + 0.5], [r, z0 + 0.9], [r * 0.88, z1 - 1.4], [r * 1.3, z1 - 0.3]]
  for (let j = 0; j < prof.length - 1; j++) {
    const [r0, za] = prof[j], [r1, zb] = prof[j + 1]
    for (let i = 0; i < k; i++) {
      const a0 = (i / k) * TAU, a1 = ((i + 1) / k) * TAU, e = Math.atan2(r0 - r1, zb - za)
      const N = (a: number): V3 => [Math.cos(a) * Math.cos(e), Math.sin(a) * Math.cos(e), Math.sin(e)]
      const Q = (rr: number, a: number, z: number): V3 => [x + rr * Math.cos(a), y + rr * Math.sin(a), z]
      P.granite.tri(Q(r0, a0, za), Q(r0, a1, za), Q(r1, a1, zb), undefined, undefined, undefined, [N(a0), N(a1), N(a1)])
      P.granite.tri(Q(r0, a0, za), Q(r1, a1, zb), Q(r1, a0, zb), undefined, undefined, undefined, [N(a0), N(a1), N(a0)])
    }
  }
  if (detail) {
    // volutes: four small blocks at the capital's corners, and two rows of leaves
    for (let q = 0; q < 4; q++) {
      const a = Math.PI / 4 + (q * Math.PI) / 2, cx = x + r * 1.25 * Math.cos(a), cy = y + r * 1.25 * Math.sin(a)
      box(P.granite, cx - 0.18, cy - 0.18, cx + 0.18, cy + 0.18, z1 - 0.75, z1 - 0.3, { bottom: true })
    }
    for (const [zz, rr] of [[z1 - 1.2, r * 1.02], [z1 - 0.85, r * 1.12]] as [number, number][])
      for (let q = 0; q < 8; q++) {
        const a = (q / 8) * TAU + (zz > z1 - 1 ? Math.PI / 8 : 0)
        box(P.granite, x + rr * Math.cos(a) - 0.12, y + rr * Math.sin(a) - 0.12, x + rr * Math.cos(a) + 0.12, y + rr * Math.sin(a) + 0.12, zz, zz + 0.38, { bottom: true })
      }
  }
  box(P.granite, x - r * 1.45, y - r * 1.45, x + r * 1.45, y + r * 1.45, z1 - 0.3, z1, { bottom: true }) // abacus
}

function build(detail: boolean): Mat[] {
  FLAT = !detail
  const P: Parts = { granite: new Part(), copper: new Part(), roof: new Part(), win: new Part(), door: new Part(), shade: new Part() }

  // --- The 1904 block: the front range and the rear (east) arm. ----------
  // (This frame is OSM's turned half a turn: +x is west, toward Midosuji.)
  range(P, -7.2, -21.4, 6.6, 21.3, 'sn', detail)
  // three bays each side of the portico (the west photos)
  range(P, 6.5, -21.4, 6.6, -6.9, 'e', detail, true, 3)
  range(P, 6.5, 6.9, 6.6, 21.3, 'e', detail, true, 3)
  fquad(P.granite, [6.6, -6.9, 0], [6.6, 6.9, 0], [6.6, 6.9, PARAPET], [6.6, -6.9, PARAPET], [1, 0, 0]) // the portico's back wall
  // the recess behind the columns reads as shade: a shadow-toned field over the back wall
  fquad(P.shade, [6.63, -6.9, 3.2], [6.63, 6.9, 3.2], [6.63, 6.9, 13.2], [6.63, -6.9, 13.2], [1, 0, 0])
  // and seen from the sides: the shadowed depth behind the side columns
  for (const sy of [-1, 1]) fquad(P.shade, [6.6, sy * 5.9, 3.2], [14.9, sy * 5.9, 3.2], [14.9, sy * 5.9, 13.2], [6.6, sy * 5.9, 13.2], [0, sy, 0])
  range(P, -16.2, -6.9, -7.2, 6.9, 'snw', detail)
  range(P, -7.3, 6.9, -7.2, 21.3, 'w', detail)
  range(P, -7.3, -21.4, -7.2, -6.9, 'w', detail)
  // links and wings (1922)
  range(P, -2.9, 21.3, 2.3, 24.1, 'ew', detail, false)
  range(P, -2.9, -24.3, 2.2, -21.4, 'ew', detail, false)
  range(P, -16.4, -38.0, 13.2, -24.3, 'nesw', detail, true, 2)
  range(P, -16.7, 24.1, 12.8, 37.9, 'nesw', detail, true, 2)
  // flat roofs at the parapet and hipped roofs behind it
  for (const [x0, y0, x1, y1] of [[-7.2, -21.4, 6.6, 21.3], [-16.2, -6.9, -7.2, 6.9], [-16.4, -38.0, 13.2, -24.3], [-16.7, 24.1, 12.8, 37.9], [-2.9, 21.3, 2.3, 24.1], [-2.9, -24.3, 2.2, -21.4]]) {
    box(P.roof, x0, y0, x1, y1, PARAPET - 0.6, PARAPET - 0.59, { sides: '' })
    if (x1 - x0 > 8 && y1 - y0 > 8) hipRoof(P.roof, x0 + 0.8, y0 + 0.8, x1 - 0.8, y1 - 0.8, PARAPET - 0.6, PARAPET + 1.0)
  }
  // the two small canopies flanking the steps (OSM's building=roof ways)
  for (const [y0, y1] of [[7.2, 9.3], [-9.3, -7.1]]) {
    box(P.roof, 13.0, y0, 18.3, y1, 3.2, 3.5, { bottom: true })
    for (const x of [13.3, 18.0]) for (const y of [y0 + 0.3, y1 - 0.3]) box(P.granite, x - 0.15, y - 0.15, x + 0.15, y + 0.15, 0, 3.2, { top: false })
  }

  // --- The portico. -------------------------------------------------------
  const PX0 = 6.6, PX1 = 16.7, PY = 6.9
  // the podium, at the main floor's level, and the steps fanning out east
  box(P.granite, PX0, -PY, PX1, PY, 0, 3.2, { sides: 'nes' })
  const nSteps = detail ? 12 : 8
  for (let k = 0; k < nSteps; k++) {
    const t = k / nSteps, x0 = PX1 + t * 8, x1 = PX1 + (t + 1 / nSteps) * 8
    const w = 6.9
    box(P.granite, x0 - 0.01, -w, x1, w, 0, 0.55 + (2.4 * (nSteps - 1 - k)) / (nSteps - 1), { sides: 'nes' })
  }
  for (const s of [-1, 1]) box(P.granite, PX1 - 0.5, s > 0 ? 6.9 : -7.7, PX1 + 7.5, s > 0 ? 7.7 : -6.9, 0, 1.6, { bevel: 0.2 }) // cheek walls
  // columns: four across the front, one each side behind the corners; square antae at the wall
  const zc0 = 3.2, zc1 = 13.2
  for (const y of [-6.1, -2.95, 2.95, 6.1]) column(P, 15.6, y, zc0, zc1, 0.71, detail)
  for (const y of [-6.1, 6.1]) column(P, 11.4, y, zc0, zc1, 0.71, detail)
  for (const y of [-6.1, 6.1]) box(P.granite, PX0, y - 0.75, PX0 + 1.0, y + 0.75, zc0, zc1)
  // the wall behind: the arched doorway (fanlight) and two oval windows
  {
    const x = PX0 + 0.06
    fquad(P.door, [x, -1.7, zc0], [x, 1.7, zc0], [x, 1.7, 8.4], [x, -1.7, 8.4], [1, 0, 0])
    const m = detail ? 12 : 6
    for (let q = 0; q < m; q++) {
      const a0 = (q / m) * Math.PI, a1 = ((q + 1) / m) * Math.PI
      ftri(P.win, [x + 0.02, 0, 8.6], [x + 0.02, 2.0 * Math.cos(a0), 8.6 + 2.0 * Math.sin(a0)], [x + 0.02, 2.0 * Math.cos(a1), 8.6 + 2.0 * Math.sin(a1)], [1, 0, 0])
    }
    box(P.granite, PX0, -2.6, PX0 + 0.3, 2.6, 8.4, 8.7, { bottom: true })
    // the arch's surround
    for (let q = 0; q < m; q++) {
      const a0 = (q / m) * Math.PI, a1 = ((q + 1) / m) * Math.PI
      const Q = (r: number, a: number): V3 => [x + 0.1, r * Math.cos(a), 8.6 + r * Math.sin(a)]
      fquad(P.granite, Q(2.0, a1), Q(2.0, a0), Q(2.6, a0), Q(2.6, a1), [1, 0, 0])
    }
    for (const y of [-4.5, 4.5]) {
      const k = detail ? 12 : 8
      for (let q = 0; q < k; q++) {
        const a0 = (q / k) * TAU, a1 = ((q + 1) / k) * TAU
        ftri(P.win, [x + 0.04, y, 10.2], [x + 0.04, y + 0.7 * Math.cos(a0), 10.2 + 1.0 * Math.sin(a0)], [x + 0.04, y + 0.7 * Math.cos(a1), 10.2 + 1.0 * Math.sin(a1)], [1, 0, 0])
      }
    }
  }
  // entablature over the columns, all round the portico
  box(P.granite, PX0, -PY - 0.3, PX1 + 0.3, PY + 0.3, zc1, 14.4, { sides: 'nes' })
  fquad(P.shade, [PX1 + 0.3, -PY - 0.3, zc1 - 0.01], [PX0, -PY - 0.3, zc1 - 0.01], [PX0, PY + 0.3, zc1 - 0.01], [PX1 + 0.3, PY + 0.3, zc1 - 0.01], [0, 0, -1]) // the portico's ceiling
  box(P.granite, PX0, -PY - 0.8, PX1 + 0.8, PY + 0.8, 14.4, CORNICE, { bottom: true, sides: 'nes' })
  // the pediment: a gable over the portico, its tympanum set back, a raking cornice
  {
    const xf = PX1 + 0.5, apex = 19.4, w = PY + 0.8
    const tyN: V3 = [1, 0, 0]
    ftri(P.granite, [xf - 0.3, -w + 0.6, CORNICE], [xf - 0.3, w - 0.6, CORNICE], [xf - 0.3, 0, apex - 0.5], tyN)
    // raking cornices
    for (const s of [-1, 1]) {
      const A: V3 = [xf, s * w, CORNICE + 0.1], B: V3 = [xf, 0, apex]
      const A2: V3 = [PX0 - 0.2, s * w, CORNICE + 0.1], B2: V3 = [PX0 - 0.2, 0, apex]
      // the roof slope, slate
      fquad(P.roof, s > 0 ? A : B, s > 0 ? B : A, s > 0 ? B2 : A2, s > 0 ? A2 : B2, [0, s * (apex - CORNICE), w])
      beam(P.granite, [xf + 0.1, s * (w + 0.1), CORNICE + 0.25], [xf + 0.1, 0, apex + 0.1], 0.6, 0.55, [s, 0, 3])
    }
    // the gable's back, against the drum's base
    ftri(P.granite, [PX0 - 0.2, w, CORNICE], [PX0 - 0.2, -w, CORNICE], [PX0 - 0.2, 0, apex], [-1, 0, 0])
    if (detail) box(P.granite, xf - 0.35, -1.6, xf - 0.1, 1.6, CORNICE + 0.6, CORNICE + 2.0) // the cartouche in the tympanum
  }

  // --- The dome over the central hall. -------------------------------------
  const DX = -0.3, DY = 0, RB = 7.45
  // its square base with corner acroteria
  box(P.granite, DX - RB, DY - RB, DX + RB, DY + RB, PARAPET - 0.6, 18.6, { bevel: 0.3 })
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) box(P.granite, DX + sx * (RB - 0.5) - 0.45, DY + sy * (RB - 0.5) - 0.45, DX + sx * (RB - 0.5) + 0.45, DY + sy * (RB - 0.5) + 0.45, 18.6, 19.5, { bevel: 0.15 })
  const k = detail ? 32 : 16
  const P3 = (r: number, a: number, z: number): V3 => [DX + r * Math.cos(a), DY + r * Math.sin(a), z]
  const lathe = (part: Part, prof: Array<[number, number]>) => {
    for (let j = 0; j < prof.length - 1; j++) {
      const [r0, za] = prof[j], [r1, zb] = prof[j + 1], e = Math.atan2(r0 - r1, zb - za)
      for (let i = 0; i < k; i++) {
        const a0 = (i / k) * TAU, a1 = ((i + 1) / k) * TAU
        const N = (a: number): V3 => [Math.cos(a) * Math.cos(e), Math.sin(a) * Math.cos(e), Math.sin(e)]
        if (r1 < 0.02) part.tri(P3(r0, a0, za), P3(r0, a1, za), P3(0, 0, zb), undefined, undefined, undefined, [N(a0), N(a1), [0, 0, 1]])
        else {
          part.tri(P3(r0, a0, za), P3(r0, a1, za), P3(r1, a1, zb), undefined, undefined, undefined, [N(a0), N(a1), N(a1)])
          part.tri(P3(r0, a0, za), P3(r1, a1, zb), P3(r1, a0, zb), undefined, undefined, undefined, [N(a0), N(a1), N(a0)])
        }
      }
    }
  }
  // drum with a cornice, windows round it
  lathe(P.granite, [[6.3, 18.6], [6.3, 20.0], [6.6, 20.05], [6.6, 20.35], [5.95, 20.4]])
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * TAU, a0 = a - 0.11, a1 = a + 0.11
    fquad(P.win, P3(6.32, a0, 18.9), P3(6.32, a1, 18.9), P3(6.32, a1, 19.8), P3(6.32, a0, 19.8), [Math.cos(a), Math.sin(a), 0])
  }
  // the dome: 11.8 m across, rising 3.9 m to the lantern's ring (an elliptical profile)
  const prof: Array<[number, number]> = []
  const nd = detail ? 10 : 5
  for (let j = 0; j <= nd; j++) { const t = (j / nd) * (Math.PI / 2) * 0.88; prof.push([5.95 * Math.cos(t), 20.4 + 4.3 * Math.sin(t)]) }
  lathe(P.copper, prof)
  const rTop = prof[prof.length - 1][0], zTop = prof[prof.length - 1][1]
  // ribs
  const nr = detail ? 16 : 8
  for (let i = 0; i < nr; i++) {
    const a = (i / nr) * TAU
    for (let j = 0; j < prof.length - 1; j++) beam(P.copper, P3(prof[j][0] + 0.12, a, prof[j][1]), P3(prof[j + 1][0] + 0.12, a, prof[j + 1][1]), detail ? 0.3 : 0.42, detail ? 0.24 : 0.34)
  }
  // lantern: a short drum, a cap, a finial
  lathe(P.copper, [[rTop, zTop], [1.7, zTop + 0.1], [1.7, zTop + 0.25]])
  lathe(P.granite, [[1.5, zTop + 0.25], [1.5, zTop + 1.15]])
  lathe(P.copper, [[1.95, zTop + 1.15], [1.95, zTop + 1.35], [1.2, zTop + 1.75], [0.35, zTop + 2.1], [0.01, zTop + 2.3]])
  beam(P.copper, P3(0, 0, zTop + 2.1), P3(0, 0, 27.7), 0.16, 0.16, [1, 0, 0], true)

  const warm = (p: V3, n: V3) => (n[2] > 0.6 ? 0.2 : p[0] > 6 ? 0.9 : 0.45) // the portico (west) brightest
  const mats: Array<[Part, MaterialSpec]> = [
    [P.granite, { ...finish('nakanoshima-granite', 0xcac7c0), floodlight: warm }],
    [P.copper, finish('nakanoshima-copper', 0x5e7f80)],
    [P.shade, finish('nakanoshima-shade', 0x5c5b57)],
    [P.roof, finish('nakanoshima-slate', 0x737981)],
    [P.win, PALETTE.window],
    [P.door, { ...PALETTE.entrance, color: 0x7a4c40 }],
  ]
  return mats.map(([part, material]) => ({ part, material }))
}

if (import.meta.main) {
  await writeLods('osaka-nakanoshima-library', 'Osaka Prefectural Nakanoshima Library', { bearing: 183.0, elevation: 0, height: 27.7 }, [
    { file: 'osaka-nakanoshima-library.glb', parts: build(false), maxTris: 6500, maxBytes: 250_000 },
    { file: 'osaka-nakanoshima-library.detail.glb', parts: build(true), maxTris: 40_000, maxBytes: 1536 * 1024 },
  ])
}
