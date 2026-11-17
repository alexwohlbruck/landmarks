/**
 * Replica East Indiaman "Amsterdam" (built 1985-91 after the VOC ship of
 * 1748), moored beside Het Scheepvaartmuseum, Kattenburgerplein,
 * Amsterdam: original procedural geometry, CC0-1.0.
 * bun generators/amsterdam-ship-amsterdam.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor at the
 * waterline. Anchor = area centroid of the OSM outline way/324827054
 * (building=ship), 52.372342, 4.914232. The hull lies at 3 degrees, so the
 * catalog bearing is 3: the bow at +y (north-north-east, toward the
 * Oosterdok), the high decorated stern at -y. Elevation 0: the ship
 * floats, z = 0 is the waterline, which is the map's water surface;
 * nothing below the waterline is modelled.
 *
 * Identity, in order: the three masts with their tops and crossed yards,
 * and the long bowsprit; the full, tumblehomed hull, red-brown with black
 * wales, yellow rails and red gunport lids; the high stern with its green
 * and gold transom, rounded crest and rows of windows; the raised
 * quarterdeck and forecastle; the yellow head rails at the bow.
 *
 * Evidence:
 *  - plan: OSM way/324827054, 45 m long and 11.7 m wide (pointed bow,
 *    blunt stern), read in the turned frame: y -22.4..22.6, x -5.9..5.8.
 *    Published (nl.wikipedia, Amsterdam (schip, 1990)): length 48 m,
 *    beam 11.5 m, which OSM's outline matches.
 *  - heights and stations photo-scaled from Malis's broadside photo
 *    (VOC_ship_Amsterdam_1.jpg, taken in 2007 while the ship lay at NEMO
 *    during the museum's renovation; used for shape only), at about 21 px/m
 *    on the 45 m hull: rail amidships 7 m above the water, the stern
 *    castle 10.5 m, the forecastle 8 m; masts at 23, 44 and 83 % of the
 *    hull from the stern; mast tops (above the waterline) mizzen 32 m,
 *    main 40 m, fore 38 m; fighting tops at 18-20.5 m; the bowsprit about
 *    14 m long at 30 degrees.
 *  - yards: crossed square on the fore and main masts (three each) and a
 *    lateen yard on the mizzen, as Derbrauni's 2023 and Ieremieieva's
 *    photos show the ship rigged now; lengths estimated from them.
 *  - colours from the daylight photos: red-brown planking, black wales,
 *    yellow rails and head, red gunport lids, green and gold stern.
 *  - masts and yards are drawn thicker than real (masts 0.55-0.7 m, yards
 *    0.32-0.4 m, tops 1.4-1.8 m across) so they hold at 80 px. No sails
 *    (the ship lies with none bent on).
 *
 * Photos (Wikimedia Commons, all evidence):
 *  - VOC_ship_Amsterdam_1.jpg (Malis, public domain): broadside; the ruler.
 *  - Amsterdam_(ship,_1990)_2023.jpg (Derbrauni, CC BY 4.0): the rig and
 *    hull colours from the north-west, at the museum.
 *  - Amsterdam_(ship,_1990)_in_2016.jpg (Joseolgon, CC BY-SA 4.0): the
 *    stern.
 *  - Amsterdam_(ship,_1990)_-_vanaf_het_Oosterdok_1.JPG (Ymnes,
 *    CC BY-SA 4.0): bow-on with the head rails.
 *  - Het_Scheepvaartmuseum,_Amsterdam.jpg (Nataliia Ieremieieva,
 *    CC BY-SA 4.0): the ship at its berth.
 * No commercial imagery. No look-only sources.
 *
 * Left out: the standing and running rigging (shrouds, stays, ratlines),
 * flags, the stern's carved figures and arms, the lantern, the guns, the
 * deck fittings, the hull below the waterline.
 *
 * Doubts: the hull lines (tumblehome, the run of the sheer) are drawn
 * from photos, not plans. Which end points north rests on the photos at
 * the current berth (bow toward the Oosterdok).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { lathe, save } from './chi-aon-center'
import { face } from './phl-independence-hall'
import { bar } from './amsterdam-adam-toren'

const STERN = -21.6, STEM = 22.4, LEN = STEM - STERN
const yAt = (t: number) => STERN + t * LEN
/** Half-beam factor along the hull, t = 0 at the stern. */
const plan = (t: number) => (t < 0.12 ? 0.8 + (t / 0.12) * 0.17 : t < 0.55 ? 0.97 + 0.03 * Math.sin(((t - 0.12) / 0.43) * Math.PI / 2) : Math.sqrt(Math.max(0.0025, 1 - Math.pow((t - 0.55) / 0.45, 2))))
/** Rail height: the stern castle, the waist, the forecastle. */
const rail = (t: number) => {
  const s = (a: number, b: number, x: number) => Math.min(1, Math.max(0, (x - a) / (b - a)))
  return 10.5 - 3.5 * s(0.2, 0.26, t) + 1.0 * s(0.76, 0.8, t) + 0.6 * s(0.92, 1, t)
}
const BEAM = 5.75

function build() {
  const hull = new Part(), green = new Part(), gold = new Part(), red = new Part(), spar = new Part(), win = new Part()

  // --- Hull: sections lofted along y. Each half-section runs from the
  // waterline up: (half-width, z, material of the edge above).
  const NS = 22
  type Pt = { x: number; z: number }
  const section = (t: number): Pt[] => {
    const w = BEAM * plan(t), top = rail(t)
    return [
      { x: 0.93 * w, z: 0 },
      { x: w, z: 2.2 },
      { x: 0.96 * w, z: 4.2 },
      { x: 0.86 * w, z: top - 1.5 },
      { x: 0.84 * w, z: top - 1.2 },
      { x: 0.8 * w, z: top },
      { x: 0.8 * w - 0.35, z: top },
      { x: 0.8 * w - 0.35, z: top - 1.1 }, // the deck, inside the bulwark
    ]
  }
  // edge k (from point k to k+1): its part
  const edgePart = (k: number, z0: number) => (k === 0 ? hull : k === 1 ? hull : k === 2 ? hull : k === 3 ? spar : k === 4 ? gold : k === 5 ? spar : hull)
  const secs = Array.from({ length: NS + 1 }, (_, i) => { const t = i / NS; return { t, y: yAt(t), pts: section(t) } })
  for (let i = 0; i < NS; i++) {
    const A = secs[i], B = secs[i + 1]
    for (const sx of [-1, 1]) {
      for (let k = 0; k < A.pts.length - 1; k++) {
        const a0 = A.pts[k], a1 = A.pts[k + 1], b0 = B.pts[k], b1 = B.pts[k + 1]
        const q: V3[] = [[sx * a0.x, A.y, a0.z], [sx * a1.x, A.y, a1.z], [sx * b1.x, B.y, b1.z], [sx * b0.x, B.y, b0.z]]
        // outward: away from the centreline for the outside, up for the deck
        const dz = a1.z - a0.z, dx = a1.x - a0.x
        let n: V3 = [sx * dz, 0, -dx]
        if (k >= 5) n = k === 5 ? [0, 0, 1] : [-sx, 0, 0]
        face(edgePart(k, a0.z), q, n)
      }
    }
    // the deck itself
    const a = A.pts[7], b = B.pts[7]
    face(hull, [[-a.x, A.y, a.z], [a.x, A.y, a.z], [b.x, B.y, b.z], [-b.x, B.y, b.z]], [0, 0, 1])
  }
  // Black wale lines: two bands round the hull at 3.0 and 5.4 m.
  for (const zw of [3.1, 5.5]) {
    for (let i = 0; i < NS; i++) {
      const A = secs[i], B = secs[i + 1]
      const wA = BEAM * plan(A.t), wB = BEAM * plan(B.t)
      const xa = (z: number, w: number) => (z < 4.2 ? w * (1 - 0.02 * (z - 2.2)) : 0.96 * w) + 0.06
      for (const sx of [-1, 1]) face(spar, [[sx * xa(zw - 0.3, wA), A.y, zw - 0.3], [sx * xa(zw - 0.3, wB), B.y, zw - 0.3], [sx * xa(zw + 0.3, wB), B.y, zw + 0.3], [sx * xa(zw + 0.3, wA), A.y, zw + 0.3]], [sx, 0, 0])
    }
  }
  // The transom: the stern section closed, green, with windows and a
  // rounded crest above the rail.
  {
    const S = secs[0], y = S.y
    const ring: V3[] = []
    for (const p of S.pts.slice(0, 6)) ring.push([p.x, y, p.z])
    for (const p of S.pts.slice(0, 6).reverse()) ring.push([-p.x, y, p.z])
    // fan from the centre
    const c: V3 = [0, y, 5]
    for (let k = 0; k < ring.length; k++) {
      const a = ring[k], b = ring[(k + 1) % ring.length]
      face(k < 5 || (k >= 6 && k < 11) ? green : green, [c, a, b], [0, -1, 0])
    }
    const top = rail(0), w = 0.8 * BEAM * plan(0)
    // crest: a half-disc over the rail, green with a gold rim
    const cr: V3[] = []
    for (let k = 0; k <= 10; k++) { const a = (k / 10) * Math.PI; cr.push([w * 0.85 * Math.cos(a), y - 0.02, top + 2.0 * Math.sin(a)]) }
    for (let k = 0; k < 10; k++) {
      face(green, [[0, y - 0.02, top], cr[k], cr[k + 1]], [0, -1, 0])
      face(green, [[0, y + 0.3, top], cr[k + 1].map((v, j) => (j === 1 ? y + 0.3 : v)) as V3, cr[k].map((v, j) => (j === 1 ? y + 0.3 : v)) as V3], [0, 1, 0])
      const r0 = cr[k], r1 = cr[k + 1]
      face(gold, [r0, r1, [r1[0] * 1.08, y - 0.08, top + (r1[2] - top) * 1.12], [r0[0] * 1.08, y - 0.08, top + (r0[2] - top) * 1.12]], [0, -1, 0])
    }
    // gold bands and two rows of windows across the stern
    for (const zb of [6.0, 8.4]) face(gold, [[-w * 0.98, y - 0.06, zb], [w * 0.98, y - 0.06, zb], [w * 0.98, y - 0.06, zb + 0.35], [-w * 0.98, y - 0.06, zb + 0.35]], [0, -1, 0])
    for (const [z0, z1] of [[6.6, 8.0], [8.9, 10.2]]) for (let k = -3; k <= 3; k++) {
      const xc = k * 0.95
      face(win, [[xc - 0.36, y - 0.08, z0], [xc + 0.36, y - 0.08, z0], [xc + 0.36, y - 0.08, z1], [xc - 0.36, y - 0.08, z1]], [0, -1, 0])
    }
    // the stern's gold quarter galleries on both sides
    for (const sx of [-1, 1]) {
      const yq0 = y + 0.4, yq1 = y + 4.2, xq = sx * (0.84 * BEAM * plan(0.08) + 0.3)
      face(gold, [[xq, yq0, 6.2], [xq, yq1, 6.2], [xq, yq1, 10.0], [xq, yq0, 10.0]], [sx, 0, 0])
      for (const [z0, z1] of [[6.6, 7.9], [8.6, 9.7]]) face(win, [[xq + sx * 0.05, yq0 + 0.5, z0], [xq + sx * 0.05, yq1 - 0.5, z0], [xq + sx * 0.05, yq1 - 0.5, z1], [xq + sx * 0.05, yq0 + 0.5, z1]], [sx, 0, 0])
    }
  }
  // The bow's head: a gold beak below the bowsprit, with a figurehead.
  {
    const y0 = STEM - 0.6, top = rail(1)
    const beak: V3[] = [[0, y0, top - 1.0], [0, y0 + 4.2, top - 0.6], [0, y0 + 3.6, top - 3.4], [0, y0, 1.2]]
    for (const sx of [-1, 1]) face(gold, beak.map(([x, y, z]) => [x + sx * 0.45, y, z] as V3), [sx, 0, 0])
    face(gold, [[-0.45, y0 + 4.2, top - 0.6], [0.45, y0 + 4.2, top - 0.6], [0.45, y0 + 3.6, top - 3.4], [-0.45, y0 + 3.6, top - 3.4]], [0, 1, 0])
    face(gold, [[-0.45, y0, top - 1.0], [0.45, y0, top - 1.0], [0.45, y0 + 4.2, top - 0.6], [-0.45, y0 + 4.2, top - 0.6]], [0, 0, 1])
    face(gold, [[-0.45, y0 + 3.6, top - 3.4], [0.45, y0 + 3.6, top - 3.4], [0.45, y0, 1.2], [-0.45, y0, 1.2]], [0, 0.6, -1])
    // the head rails, curving from the beak back to the bow's sides
    for (const sx of [-1, 1]) for (const dz of [0, -1.1]) {
      bar(gold, [sx * 0.5, y0 + 3.6, top - 1.0 + dz], [sx * 2.4, y0 - 2.4, top - 0.4 + dz], 0.32, 0.32)
    }
  }
  // Red gunport lids, eight a side between the wales.
  for (const sx of [-1, 1]) for (let k = 0; k < 8; k++) {
    const t = 0.24 + k * 0.075, w = BEAM * plan(t) * 0.97 + 0.12
    const y = yAt(t)
    face(red, [[sx * w, y - 0.5, 3.6], [sx * w, y + 0.5, 3.6], [sx * w, y + 0.5, 4.7], [sx * w, y - 0.5, 4.7]], [sx, 0, 0])
  }

  // --- Masts, tops, yards and the bowsprit.
  const masts = [
    { t: 0.23, top: 32, tz: 18.0, r: 0.55, yards: [] as [number, number][] },
    { t: 0.44, top: 40, tz: 20.5, r: 0.7, yards: [[16.2, 21], [27.0, 14.5], [34.5, 9]] as [number, number][] },
    { t: 0.83, top: 38, tz: 19.5, r: 0.62, yards: [[15.4, 18], [25.5, 12.5], [32.5, 8]] as [number, number][] },
  ]
  for (const m of masts) {
    const y = yAt(m.t), deck = rail(m.t) - 1.1
    lathe(spar, 0, y, [[m.r, deck], [m.r * 0.9, m.tz + 1.5], [m.r * 0.62, m.tz + 1.5], [m.r * 0.5, m.top - 0.4], [0.2, m.top], [0, m.top]], 8)
    // fighting top: a round platform
    const tr = m.r * 2.6
    lathe(spar, 0, y, [[0, m.tz - 0.5], [tr * 0.6, m.tz - 0.4], [tr, m.tz], [tr, m.tz + 0.5], [0, m.tz + 0.5]], 10)
    // crosstrees higher up
    bar(spar, [-tr * 0.6, y, m.tz + 9], [tr * 0.6, y, m.tz + 9], 0.35, 0.35)
    for (const [z, L] of m.yards) bar(spar, [-L / 2, y, z], [L / 2, y, z], 0.36, 0.36)
  }
  // Mizzen: a lateen yard across the mast and a small crossjack.
  {
    const y = yAt(0.23)
    bar(spar, [0, y + 6.5, 9.5], [0, y - 7.0, 22.5], 0.34, 0.34) // peak aft
    bar(spar, [-6.5, y, 16.4], [6.5, y, 16.4], 0.32, 0.32)
    bar(spar, [-4.5, y, 25.0], [4.5, y, 25.0], 0.28, 0.28)
  }
  // Bowsprit, from the forecastle up and forward at 30 degrees.
  {
    const y0 = yAt(0.86), z0 = rail(0.9) - 0.4
    const L = 16.5, a = (30 * Math.PI) / 180
    bar(spar, [0, y0, z0], [0, y0 + L * Math.cos(a), z0 + L * Math.sin(a)], 0.62, 0.62)
    // spritsail yard under its end
    const yy = y0 + 0.75 * L * Math.cos(a), zz = z0 + 0.75 * L * Math.sin(a) - 0.6
    bar(spar, [-6, yy, zz], [6, yy, zz], 0.3, 0.3)
  }

  return [
    { part: hull, material: finish('amsterdam-ship-hull', 0x7f6152) },
    { part: green, material: finish('amsterdam-ship-green', 0x3f6e58) },
    { part: gold, material: finish('amsterdam-ship-gold', 0xd8b03c, 0.6) },
    { part: red, material: finish('amsterdam-ship-red', 0xb0403a) },
    { part: spar, material: finish('amsterdam-ship-spar', 0x4f3d34) },
    { part: win, material: { ...PALETTE.window } },
  ]
}

if (import.meta.main) await save('amsterdam-ship-amsterdam', 'Replica ship Amsterdam', [52.372342, 4.914232], 3, build(), 6500)
