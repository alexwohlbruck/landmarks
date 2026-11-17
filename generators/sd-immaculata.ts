/**
 * The Immaculata (Church of the Immaculata), University of San Diego,
 * 5998 Alcalá Park — 1959, Spanish Renaissance revival, the campus's
 * centrepiece on the mesa above Mission Valley.
 *
 * A white stucco basilica: a tall nave under a low red-tile gable, lower
 * side aisles with a pierced, pinnacled parapet, a transept with round
 * windows in its gables, and over the crossing an octagonal drum carrying
 * the big blue-tiled dome, its lantern and the statue of the Immaculata.
 * The south front is a carved frontispiece with a quatrefoil window, and
 * beside it rises the square bell tower: belfry, octagonal stage and a
 * small blue-tiled cupola.
 *
 * Frame: bearing 343.4 (the nave axis runs 16.6° west of north in OSM).
 * +x across the nave (east-north-east), +y up the nave toward the altar,
 * metres, origin at the anchor; the nave's centreline is x ≈ 0. z = 0 is
 * the ground, lidar 3.7 m above ground_min (the mesa is flat). Elevation 0.
 *
 * Sources
 * - OSM way/31843063 (The Church of the Immaculata, h=15.25, pitched) and
 *   way/1207657025 (bell tower, h=51, dome). © OSM contributors.
 * - USGS 3DEP lidar CA_SanDiegoQL2_2014 (flown 2014), 0.5 m grid in this
 *   frame (above ground_min 67.73 m): ground 3.6–3.8; nave and transept
 *   eaves 18.5–18.8, ridges 20.5; side aisles 8.8–9.3; dome 33.8–34.2 at
 *   the crossing (x 1, y 10); bell tower 46.7.
 * - Wikipedia "University of San Diego": the Immaculata, completed 1959.
 * Photos (evidence):
 * - "San Diego,California.USA. - panoramio (28).jpg" and "(26)",
 *   Roman Eugeniusz, CC BY-SA 3.0,
 *   https://commons.wikimedia.org/wiki/File:San_Diego,California.USA._-_panoramio_(28).jpg
 *   (the east side and front: nave, aisle parapet, tower stages, dome).
 * - "The Immaculata", Söki (Flickr 44374670880), CC BY-SA 2.0,
 *   https://www.flickr.com/photos/125363750@N06/44374670880
 *   (the whole east flank, transept gable, dome colour).
 * - "USD Immaculata Parish Church.jpg", Colint, CC BY-SA 2.0,
 *   https://commons.wikimedia.org/wiki/File:USD_Immaculata_Parish_Church.jpg
 *   (the frontispiece face on).
 * - "The Immaculata", john farrell macdonald (Flickr 13926412542),
 *   CC BY-SA 2.0, https://www.flickr.com/photos/8267218@N03/13926412542
 * - "The Church of the Immaculata", analisezocher (Flickr 33959592935),
 *   CC BY 2.0, https://www.flickr.com/photos/152327194@N04/33959592935
 * - "University of San Diego.jpg", Transfeo, CC BY-SA 4.0,
 *   https://commons.wikimedia.org/wiki/File:University_of_San_Diego.jpg
 * - "USDByPhilKonstantin.jpg", Phil Konstantin, CC BY-SA 3.0 (aerial).
 * Look-only (seen, not used for shape or colour): Jill Clardy's and
 * Lisa Sabater-Mozo's Flickr photos (CC BY-NC-SA).
 *
 * Numbers
 * - Plan: nave x −6.6…6.9 from the front (y −36.7) to the apse (y 28);
 *   transept x −20.7…19.7, y 4.2…17.7; tower x 4…9.8, y −36.7…−30.8 —
 *   OSM (measured). Side aisles x −12…−6.6 and 6.9…13.5, y −33…3, and the
 *   low sacristies by the choir — lidar (measured; OSM leaves them out).
 * - Heights (lidar, measured): eaves 15.0, ridges 16.8, aisles 5.3, dome
 *   with lantern and statue 30.5, tower 43 (to the lantern; the cross
 *   added on top, OSM says 51 overall).
 * - Drum radius 5.5 springing at 20.5, dome a hemisphere; tower stages
 *   (shaft to 28, belfry to 35, octagon to 39.5, cupola) and the
 *   frontispiece (18 m, quatrefoil at 11.5) — scaled from Eugeniusz (28)
 *   against the lidar (estimated).
 *
 * Doubts
 * - The west flank is seen only from afar (the aerial); drawn as the
 *   mirror of the east.
 * - Carving on the frontispiece, the parapet tracery and the dome's ribs
 *   are left out; the dome colour sits between the blue of older photos
 *   and the teal of recent ones.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cbox, rect, qf, gable } from './dc-white-house'
import { lathe, pslab, circle, saveModel, type XY } from './dc-nga-west'

const ID = 'sd-immaculata'

const WHITE = { ...finish('immaculata-stucco', 0xf3eee3), floodlight: (_p: V3, n: V3) => (Math.abs(n[2]) > 0.7 ? 0.2 : 0.75) }
const DOME = finish('immaculata-dome', 0x4e97b2, 0.5)
const WIN = { name: 'window', color: 0x5f6a74, roughness: 0.4 }

const white = new Part(), tile = new Part(), dome = new Part(), win = new Part(), flat = new Part()

const EAVE = 15.0, RIDGE = 16.8
const NAVE = { x0: -6.6, x1: 6.9, y0: -36.0, y1: 28.0 }
const TRANS = { x0: -20.7, x1: 19.7, y0: 4.2, y1: 17.7 }
const CX = 0.15, CY = 10.95 // the crossing

/** An arched window on an axis-aligned wall: side 'n','s','e','w' at plane `at`. */
function arch(p: Part, side: 'n' | 's' | 'e' | 'w', at: number, c: number, w: number, z0: number, zs: number, d = 0.06) {
  const nrm: V3 = side === 'n' ? [0, 1, 0] : side === 's' ? [0, -1, 0] : side === 'e' ? [1, 0, 0] : [-1, 0, 0]
  const ns = side === 'n' || side === 's'
  const off = at + (ns ? nrm[1] : nrm[0]) * d
  const P = (a: number, z: number): V3 => (ns ? [a, off, z] : [off, a, z])
  const r = w / 2
  qf(p, P(c - r, z0), P(c + r, z0), P(c + r, zs), P(c - r, zs), nrm)
  const seg = 8
  for (let k = 0; k < seg; k++) {
    const a0 = (Math.PI * k) / seg, a1 = (Math.PI * (k + 1)) / seg
    const A = P(c + r * Math.cos(a0), zs + r * Math.sin(a0)), B = P(c + r * Math.cos(a1), zs + r * Math.sin(a1))
    const Cn = P(c, zs)
    const f = [Cn, A, B]
    const u = [A[0] - Cn[0], A[1] - Cn[1], A[2] - Cn[2]], v = [B[0] - Cn[0], B[1] - Cn[1], B[2] - Cn[2]]
    const cr = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
    if (cr[0] * nrm[0] + cr[1] * nrm[1] + cr[2] * nrm[2] >= 0) p.tri(f[0], f[1], f[2])
    else p.tri(f[0], f[2], f[1])
  }
}
/** A round window (disc) on an axis-aligned wall. */
function disc(p: Part, side: 'n' | 's' | 'e' | 'w', at: number, c: number, zc: number, r: number, d = 0.06) {
  const nrm: V3 = side === 'n' ? [0, 1, 0] : side === 's' ? [0, -1, 0] : side === 'e' ? [1, 0, 0] : [-1, 0, 0]
  const ns = side === 'n' || side === 's'
  const off = at + (ns ? nrm[1] : nrm[0]) * d
  const P = (a: number, z: number): V3 => (ns ? [a, off, z] : [off, a, z])
  const seg = 12
  for (let k = 0; k < seg; k++) {
    const a0 = (2 * Math.PI * k) / seg, a1 = (2 * Math.PI * (k + 1)) / seg
    const A = P(c + r * Math.cos(a0), zc + r * Math.sin(a0)), B = P(c + r * Math.cos(a1), zc + r * Math.sin(a1)), Cn = P(c, zc)
    const u = [A[0] - Cn[0], A[1] - Cn[1], A[2] - Cn[2]], v = [B[0] - Cn[0], B[1] - Cn[1], B[2] - Cn[2]]
    const cr = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
    if (cr[0] * nrm[0] + cr[1] * nrm[1] + cr[2] * nrm[2] >= 0) p.tri(Cn, A, B)
    else p.tri(Cn, B, A)
  }
}

// --- Nave and choir under one low tile gable (ridge along y).
cbox(white, rect(NAVE.x0, NAVE.x1, NAVE.y0, NAVE.y1), 0, EAVE, { b: 0.3, top: false })
gable(tile, white, rect(NAVE.x0 - 0.4, NAVE.x1 + 0.4, NAVE.y0, NAVE.y1 + 0.4), EAVE, RIDGE, true, [false, true])
// clerestory windows above the aisles, both flanks
for (let y = -31; y <= 0; y += 4.4) {
  arch(win, 'e', NAVE.x1, y, 1.5, 8.2, 12.2)
  arch(win, 'w', NAVE.x0, y, 1.5, 8.2, 12.2)
}
// choir windows
for (const y of [21, 25]) { arch(win, 'e', NAVE.x1, y, 1.5, 7, 11.5); arch(win, 'w', NAVE.x0, y, 1.5, 7, 11.5) }

// --- Transept (ridge along x), gable ends with round windows.
cbox(white, rect(TRANS.x0, TRANS.x1, TRANS.y0, TRANS.y1), 0, EAVE, { b: 0.3, top: false })
gable(tile, white, rect(TRANS.x0, TRANS.x1, TRANS.y0 - 0.4, TRANS.y1 + 0.4), EAVE, RIDGE, false)
// the gable ends stand a little above the tiles as white parapets
for (const [x, s] of [[TRANS.x0, 'w'], [TRANS.x1, 'e']] as const) {
  disc(win, s, x, (TRANS.y0 + TRANS.y1) / 2, 11.0, 1.5)
  arch(win, s, x, (TRANS.y0 + TRANS.y1) / 2, 2.2, 3.0, 7.2)
}
for (const [y, s] of [[TRANS.y0, 's'], [TRANS.y1, 'n']] as const) for (const x of [-16.5, -12, 12, 16]) arch(win, s, y, x, 1.5, 7.5, 11.8)

// --- Side aisles with a parapet, and the sacristies by the choir.
for (const [x0, x1, side] of [[-12, NAVE.x0, 'w'], [NAVE.x1, 13.5, 'e']] as const) {
  cbox(white, rect(x0, x1, -33, TRANS.y0), 0, 5.3, { b: 0.15, top: flat })
  const at = side === 'w' ? x0 : x1
  // pierced parapet: a band with piers and finials
  cbox(white, rect(side === 'w' ? x0 : x1 - 0.35, side === 'w' ? x0 + 0.35 : x1, -33, TRANS.y0), 5.3, 6.4, { b: 0.08 })
  for (let y = -31.5; y <= 2; y += 4.4) {
    arch(win, side, at, y, 1.6, 1.4, 3.6)
    pslab(white, circle(side === 'w' ? x0 + 0.2 : x1 - 0.2, y, 0.3, 6), 6.4, 7.4, 0.08)
  }
}
for (const [x0, x1] of [[-14, NAVE.x0], [NAVE.x1, 16]]) cbox(white, rect(x0, x1, TRANS.y1, 26), 0, 5.2, { b: 0.15, top: flat })

// --- Frontispiece: a raised carved screen across the south front.
{
  const y0 = -36.7, y1 = NAVE.y0
  cbox(white, rect(-7.2, 4.0, y0, y1 + 0.2), 0, 17.6, { b: 0.25 })
  cbox(white, rect(-3.6, 0.6, y0 - 0.25, y1), 0, 19.2, { b: 0.25 })
  pslab(white, circle(-1.5, y0 - 0.1, 0.45, 6), 19.2, 20.6, 0.1)
  for (const x of [-6.7, 3.5]) pslab(white, circle(x, y0 + 0.4, 0.4, 6), 17.6, 18.8, 0.1)
  disc(win, 's', y0 - 0.25, -1.5, 11.5, 1.6)
  arch(win, 's', y0 - 0.25, -1.5, 2.6, 0, 4.0)
}

// --- Crossing: octagonal drum, blue-tiled dome, lantern and statue.
{
  const R = 5.5
  const oct = circle(CX, CY, R, 8, Math.PI / 8)
  pslab(white, oct, EAVE - 1, 20.5, 0.2, false)
  for (let k = 0; k < 8; k++) {
    const a = oct[k], b = oct[(k + 1) % 8]
    const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2
    const nx = mx - CX, ny = my - CY, l = Math.hypot(nx, ny)
    const ux = (b[0] - a[0]) / Math.hypot(b[0] - a[0], b[1] - a[1]), uy = (b[1] - a[1]) / Math.hypot(b[0] - a[0], b[1] - a[1])
    // an arched window centred on the face
    const d = 0.06, w = 1.2, z0 = 17.0, zs = 18.9
    const P = (t: number, z: number): V3 => [mx + ux * t + (nx / l) * d, my + uy * t + (ny / l) * d, z]
    qf(win, P(-w / 2, z0), P(w / 2, z0), P(w / 2, zs), P(-w / 2, zs), [nx, ny, 0])
    for (let s = 0; s < 6; s++) {
      const a0 = (Math.PI * s) / 6, a1 = (Math.PI * (s + 1)) / 6
      const A = P((w / 2) * Math.cos(a0), zs + (w / 2) * Math.sin(a0)), B = P((w / 2) * Math.cos(a1), zs + (w / 2) * Math.sin(a1)), C = P(0, zs)
      const u = [A[0] - C[0], A[1] - C[1], A[2] - C[2]], v = [B[0] - C[0], B[1] - C[1], B[2] - C[2]]
      const cr = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
      if (cr[0] * nx + cr[1] * ny >= 0) win.tri(C, A, B)
      else win.tri(C, B, A)
    }
  }
  // the dome: a hemisphere on a thin cornice
  pslab(white, circle(CX, CY, R + 0.3, 16), 20.5, 21.0, 0.15, false)
  const prof: [number, number][] = []
  for (let k = 0; k <= 8; k++) {
    const a = (Math.PI / 2) * (k / 8)
    prof.push([R * Math.cos(a) + (k === 8 ? 0.0 : 0), 21.0 + R * Math.sin(a)])
  }
  prof[8] = [1.3, 21.0 + Math.sqrt(R * R - 1.3 * 1.3)]
  lathe(dome, CX, CY, prof.slice(0, 8).concat([prof[8]]), 16, false)
  // lantern
  const zl = 21.0 + Math.sqrt(R * R - 1.3 * 1.3)
  lathe(white, CX, CY, [[1.3, zl - 0.2], [1.3, zl + 1.8], [1.55, zl + 1.8], [1.55, zl + 2.1], [0.9, zl + 2.1], [0.01, zl + 2.9]], 8, false)
  // the statue on its pedestal
  pslab(white, circle(CX, CY, 0.35, 6), zl + 2.6, 30.5, 0.1)
}

// --- Bell tower: shaft, belfry, octagonal stage, blue cupola, cross.
{
  const t = rect(4.0, 9.8, -36.7, -30.8), cx = 6.9, cy = -33.75
  cbox(white, t, 0, 28, { b: 0.3 })
  cbox(white, { x0: t.x0 - 0.25, x1: t.x1 + 0.25, y0: t.y0 - 0.25, y1: t.y1 + 0.25 }, 27.4, 28.2, { b: 0.15, bottom: true })
  cbox(white, { x0: t.x0 + 0.3, x1: t.x1 - 0.3, y0: t.y0 + 0.3, y1: t.y1 - 0.3 }, 28.2, 35, { b: 0.2 })
  // belfry openings, two a face
  for (const o of [-1.2, 1.2]) {
    arch(win, 's', t.y0 + 0.3, cx + o, 1.3, 29.3, 33)
    arch(win, 'n', t.y1 - 0.3, cx + o, 1.3, 29.3, 33)
    arch(win, 'e', t.x1 - 0.3, cy + o, 1.3, 29.3, 33)
    arch(win, 'w', t.x0 + 0.3, cy + o, 1.3, 29.3, 33)
  }
  // a shaft window or two
  arch(win, 's', t.y0, cx, 1.0, 19.5, 22.5)
  arch(win, 'e', t.x1, cy, 1.0, 19.5, 22.5)
  const oct = circle(cx, cy, 2.5, 8, Math.PI / 8)
  pslab(white, oct, 35, 39.5, 0.15)
  for (let k = 0; k < 8; k += 2) {
    const a = oct[k], b = oct[(k + 1) % 8], mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2
    const nx = mx - cx, ny = my - cy, l = Math.hypot(nx, ny)
    const P = (s: number, z: number): V3 => [mx + (-ny / l) * s + (nx / l) * 0.06, my + (nx / l) * s + (ny / l) * 0.06, z]
    qf(win, P(-0.45, 36), P(0.45, 36), P(0.45, 38.4), P(-0.45, 38.4), [nx, ny, 0])
  }
  lathe(dome, cx, cy, [[2.4, 39.5], [2.3, 40.3], [1.9, 41.1], [1.2, 41.8], [0.5, 42.1], [0.01, 42.2]], 12, false)
  // lantern and cross
  pslab(white, circle(cx, cy, 0.5, 6), 42.0, 43.0, 0.1)
  cbox(white, rect(cx - 0.15, cx + 0.15, cy - 0.15, cy + 0.15), 43, 45.5)
  cbox(white, rect(cx - 0.7, cx + 0.7, cy - 0.15, cy + 0.15), 44.4, 44.7)
}

if (import.meta.main) {
  await saveModel(ID, 'The Immaculata', [
    { part: white, material: WHITE },
    { part: tile, material: PALETTE.terracotta },
    { part: dome, material: DOME },
    { part: win, material: WIN },
    { part: flat, material: PALETTE.roof },
  ], { source: `generators/${ID}.ts` })
}
