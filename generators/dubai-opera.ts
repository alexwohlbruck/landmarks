/**
 * Dubai Opera (Atkins, Janus Rostock; opened 31 August 2016), the dhow-shaped
 * performing arts centre in the Opera District of Downtown Dubai. Original
 * procedural geometry, CC0-1.0.
 * bun generators/dubai-opera.ts
 *
 * Also the small shared kit for the Dubai batch (`loftGrid`, `toLocal`,
 * `writeModel`), used by dubai-mall.ts and dubai-fountain.ts; this file's own
 * build runs only under `import.meta.main`.
 *
 * Frame: BEARING 99.7 (the principal axis of the OSM outline), so +y runs
 * along the hull from the stern (west-north-west, y = -59) to the bow
 * (east-south-east, y = +73), and +x is the south-south-west side, facing
 * the Burj Khalifa Lake's southern arm. Origin = area centroid of OSM
 * way/475848632. y = 0 is the plaza; elevation 0 (Downtown Dubai is flat; the
 * map's terrain tool has no tiles here, so terrain could not be checked).
 *
 * Evidence
 * - OSM way/475848632 (amenity=theatre, building=civic, height 44, 5 levels,
 *   material glass, roof:colour #B2CAD4): the outline, taken as the roof's
 *   edge (the hull's widest line), a teardrop 132 m long and 78 m wide with a
 *   square-ish stern and a rounded bow. No building:part inside it; the Opera
 *   Box Office (way/723560001) is a separate building 60 m west and is left
 *   to the map.
 * - Published (Wikipedia "Dubai Opera"): 2,000 seats; designed to resemble a
 *   dhow, the "bow" holding the main stage, orchestra and seating, the
 *   elongated "hull" the waiting areas and drop-off; a rooftop restaurant.
 * - Photos:
 *   * "Dubai 32", greger.ravik, Flickr, CC BY 2.0,
 *     https://www.flickr.com/photos/96611469@N04/39669514691 (daylight, the
 *     long north-north-east side across the lake's canal): the silhouette:
 *     the roof edge high at the bow and sweeping down along a concave curve to
 *     a low stern, the pointed prow tip, the thick pale roof lip and its
 *     darker soffit, the glass hull leaning out under it, pale fins.
 *   * "The Dubai Opera", Francisco Anzola, Flickr, CC BY 2.0,
 *     https://www.flickr.com/photos/10345599@N03/49110938316 (dusk, from the
 *     plaza on the south side): the rounded glass bow, its big vertical fins,
 *     the roof cantilevered over it, the hull descending to the west; at
 *     night the whole glass hull glows warm and the roof stays dark.
 *
 * Numbers
 * - Roof top at the bow 44 m: OSM height tag (no published figure found).
 * - Roof top along the hull (24 m at the stern, about 27 m mid-length,
 *   44 m at the bow; the prow tip curls up about 5 m more, to 49 m, a little
 *   bolder than real so it reads at phone size; a 1.2 m crown along the
 *   centre line): estimated from the greger.ravik photo, scaled by the people
 *   on the quay, and from the Anzola photo.
 * - Roof lip 3.6-6.2 m thick with a 3 m silver gunwale strip round the deck;
 *   glass hull set back under it about 6 m at the sides and up to 18 m under
 *   the prow, bulging out as it rises; a pale transom band at 5 m over the
 *   foyer: estimated from both photos.
 * - Fins every ~10 m, drawn 1.4 m wide (bolder than real) so they read at
 *   phone size: invented spacing, real feature.
 * - Colours: glass from the daylight photo (dark grey-green, palette
 *   `window`; it glows at night, as the photos show), roof lip and fins pale
 *   silver #d9dcdc (soffit floodlit at night), roof deck #b4c0c7 from the
 *   OSM roof:colour #B2CAD4.
 *
 * Look-only (CC BY-NC / NC-SA, Flickr; looked at, not relied on):
 * hoomygumb "The Dubai Opera am anderen Ende des Burj Khalifa Lake"
 * (37172811905), dgrice "Dubai Opera House" (30134404586), Ali Sabbagh
 * "Lights of the Opera" (49244706067), DraconianRain "Dubai opera"
 * (52242272286). They agree with the two licensed photos on the bow, the lip
 * and the glow at night.
 *
 * Doubts: no licensed photo of the stern (west) end or of the roof from
 * above, so the stern's height and the roof deck (drawn as a plain sloping
 * deck) are estimates; the OSM outline is assumed to be the roof edge. UAE
 * has no freedom of panorama for buildings, so Commons holds almost no
 * exterior photos of it.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, type Swatch } from './palette'
import { bandTris, report, type XY } from './sf-de-young'

/** World lon/lat ring to the model frame (x right, y forward along `bearing`). */
export function toLocal(ring: [number, number][], anchor: { lng: number; lat: number }, bearing: number): XY[] {
  const k = 111320 * Math.cos((anchor.lat * Math.PI) / 180), b = (bearing * Math.PI) / 180
  return ring.map(([lo, la]) => {
    const E = (lo - anchor.lng) * k, N = (la - anchor.lat) * 110574
    return [E * Math.cos(b) - N * Math.sin(b), E * Math.sin(b) + N * Math.cos(b)] as XY
  })
}

/**
 * A smooth closed surface through rings of corresponding points
 * (rings[k][i], bottom to top, counter-clockwise from above), with normals
 * from the neighbouring points so the hull shades round.
 */
export function loftGrid(p: Part, rings: V3[][], smoothAround = true) {
  const K = rings.length, n = rings[0].length
  const at = (k: number, i: number) => rings[Math.max(0, Math.min(K - 1, k))][((i % n) + n) % n]
  const N = (k: number, i: number): V3 => {
    const a = at(k, i + 1), b = at(k, i - 1), c = at(k + 1, i), d = at(k - 1, i)
    const u: V3 = [a[0] - b[0], a[1] - b[1], a[2] - b[2]], v: V3 = [c[0] - d[0], c[1] - d[1], c[2] - d[2]]
    const w: V3 = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
    const l = Math.hypot(...w) || 1
    return [w[0] / l, w[1] / l, w[2] / l]
  }
  for (let k = 0; k < K - 1; k++)
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n
      const A = at(k, i), B = at(k, j), C = at(k + 1, j), D = at(k + 1, i)
      if (smoothAround) {
        p.tri(A, B, C, undefined, undefined, undefined, [N(k, i), N(k, j), N(k + 1, j)])
        p.tri(A, C, D, undefined, undefined, undefined, [N(k, i), N(k + 1, j), N(k + 1, i)])
      } else p.quad(A, B, C, D)
    }
}

/** Write a model, check the budget, print the stats. */
export async function writeModel(id: string, name: string, parts: Array<{ part: Part; material: Swatch & Record<string, unknown> }>, extras: Record<string, unknown>, limit = 5000) {
  const live = parts.filter((p) => p.part.triangles > 0)
  const glb = writeGlb(name, live as any, { license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor', ...extras })
  const tris = report(name, live, glb, limit)
  const out = new URL(`../models/${id}.glb`, import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${tris} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
}

// ---------------------------------------------------------------------------

const BEARING = 99.7
const ANCHOR = { lng: 55.2719218, lat: 25.1956437 }
// OSM way/475848632 in the model frame, counter-clockwise from above, from
// the north side of the bow round the stern and back.
const RING: XY[] = [[-18.28, 54.31], [-23.55, 44.25], [-28.1, 33.84], [-31.91, 23.14], [-34.97, 12.19], [-37.25, 1.06], [-38.76, -10.22], [-39.47, -21.57], [-39.4, -32.96], [-36.88, -50.76], [-28.45, -53.89], [-19.8, -56.28], [-10.87, -57.59], [-2.04, -58.79], [6.94, -58.89], [15.89, -58.21], [24.73, -56.75], [30.13, -46.92], [33.29, -38.94], [35.77, -30.72], [37.54, -22.31], [38.6, -13.79], [38.95, -5.2], [38.56, 3.38], [37.46, 11.91], [35.05, 21.91], [31.97, 31.71], [28.19, 41.28], [23.76, 50.56], [18.69, 59.5], [10.31, 70.02], [6.84, 72.16], [2.92, 73.25], [-1.15, 73.19], [-5.03, 72.0], [-8.44, 69.77], [-11.08, 66.67]]

const Y0 = -59, Y1 = 73.3
const tOf = (y: number) => Math.max(0, Math.min(1, (y - Y0) / (Y1 - Y0)))
/** Roof deck height along the hull: low stern, concave sweep up to the bow. */
const top = (x: number, y: number) => {
  const t = tOf(y)
  const tip = y > 56 ? 6 * ((y - 58) / 15.3) ** 2 * Math.max(0, 1 - Math.abs(x) / 16) : 0
  return 24 + 20 * t ** 2.6 + tip
}
/** Upward unit normal of triangle a, b, c (b - a) × (c - a), flipped to face up. */
const cross3 = (b: V3, a: V3, c: V3): V3 => {
  const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  let w: V3 = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
  if (w[2] < 0) w = [-w[0], -w[1], -w[2]]
  const l = Math.hypot(...w) || 1
  return [w[0] / l, w[1] / l, w[2] / l]
}
/** Roof lip thickness. */
const lip = (y: number) => 3.6 + 2.6 * tOf(y) ** 2

// Densify the outline so the long sides curve smoothly in height.
function densify(r: XY[], step: number): XY[] {
  const out: XY[] = []
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length], n = Math.max(1, Math.round(Math.hypot(b[0] - a[0], b[1] - a[1]) / step))
    for (let k = 0; k < n; k++) out.push([a[0] + ((b[0] - a[0]) * k) / n, a[1] + ((b[1] - a[1]) * k) / n])
  }
  return out
}

if (import.meta.main) {
  const ring = densify(RING, 9)
  const n = ring.length
  // Outward unit normal of the outline at each point (ring is CCW).
  const nrm = ring.map((_, i) => {
    const a = ring[(i + n - 1) % n], b = ring[(i + 1) % n]
    const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1
    return [dy / l, -dx / l] as XY
  })
  // Set-back of the glass hull's foot under the roof edge.
  const setback = (p: XY) => {
    const t = tOf(p[1])
    return 6 + 0.5 * Math.max(0, 1 - t / 0.12) + 12 * Math.max(0, (t - 0.5) / 0.5) ** 2
  }
  // The bow is narrow: pull its foot back along the axis rather than across it.
  const foot = ring.map((p, i) => {
    const s = setback(p), t = tOf(p[1])
    const w = Math.max(0, (t - 0.8) / 0.2) // 0 → 1 over the last fifth: blend to a pull-back along -y
    const across: XY = [p[0] - nrm[i][0] * s, p[1] - nrm[i][1] * s]
    const back: XY = [p[0] * (1 - s / 40), p[1] - s]
    return [across[0] * (1 - w) + back[0] * w, across[1] * (1 - w) + back[1] * w] as XY
  })
  const under = ring.map((p) => top(p[0], p[1]) - lip(p[1]))
  const eave = ring.map((p, i) => [p[0] - nrm[i][0] * 0.6, p[1] - nrm[i][1] * 0.6] as XY)

  const glassP = new Part(), foyerP = new Part(), silver = new Part(), deck = new Part()

  // Glass hull: foot → eave, bulging outward as it rises (sine blend).
  // Glass hull: foot → eave, bulging outward as it rises (sine blend). The
  // lowest 5 m is the lit foyer glazing (entrance), the rest the hull glass.
  const ringAt = (z: (i: number) => number) => ring.map((_, i) => {
    const t = Math.min(1, z(i) / under[i]), f = Math.sin((t * Math.PI) / 2)
    return [foot[i][0] + (eave[i][0] - foot[i][0]) * f, foot[i][1] + (eave[i][1] - foot[i][1]) * f, under[i] * t] as V3
  })
  const FOYER = 5
  const hull: V3[][] = [ringAt(() => FOYER), ...[0.4, 0.6, 0.8, 1].map((t) => ringAt((i) => FOYER + (under[i] - FOYER) * t))]
  loftGrid(glassP, hull)
  loftGrid(glassP, [ringAt(() => 0), ringAt(() => FOYER / 2), ringAt(() => FOYER)])
  // A pale transom band over the foyer, standing just proud of the glass.
  const bandR = (z: number, out: number) => ringAt(() => z).map((p, i) => [p[0] + nrm[i][0] * out, p[1] + nrm[i][1] * out, p[2]] as V3)
  loftGrid(silver, [bandR(FOYER - 0.1, 0.05), bandR(FOYER - 0.1, 0.5), bandR(FOYER + 1.1, 0.5), bandR(FOYER + 1.1, 0.05)], false)

  // Roof: lip (outer wall), soffit (underside from eave to edge), deck.
  const zt = ring.map((p) => top(p[0], p[1]))
  const bev = 0.5
  const inner = ring.map((p, i) => [p[0] - nrm[i][0] * bev, p[1] - nrm[i][1] * bev] as XY)
  loftGrid(silver, [
    ring.map((p, i) => [p[0], p[1], under[i]] as V3),
    ring.map((p, i) => [p[0], p[1], zt[i] - bev] as V3),
    inner.map((p, i) => [p[0], p[1], zt[i]] as V3),
  ])
  // Soffit: the ring between the eave line and the roof edge, facing down.
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    silver.quad([eave[j][0], eave[j][1], under[j]], [ring[j][0], ring[j][1], under[j]], [ring[i][0], ring[i][1], under[i]], [eave[i][0], eave[i][1], under[i]])
  }
  // Deck: a silver gunwale strip 3 m wide round the edge, then the deck,
  // banded across the hull so its height follows the curve along y, with a
  // shallow crown along the centre line.
  const RIM = 3
  const deckZ = (x: number, y: number) => top(x, y) + 1.2 * Math.max(0, 1 - (x / 36) ** 2)
  const rim = ring.map((p, i) => [p[0] - nrm[i][0] * RIM, p[1] - nrm[i][1] * RIM] as XY)
  loftGrid(silver, [inner.map((p, i) => [p[0], p[1], zt[i]] as V3), rim.map((p) => [p[0], p[1], deckZ(p[0], p[1])] as V3)], false)
  for (const [a, b, c] of bandTris([rim])) {
    const A: V3 = [a[0], a[1], deckZ(a[0], a[1])], B: V3 = [b[0], b[1], deckZ(b[0], b[1])], C: V3 = [c[0], c[1], deckZ(c[0], c[1])]
    const g = cross3(B, A, C)
    deck.tri(A, B, C, undefined, undefined, undefined, [g, g, g])
  }

  // Fins on the glass: pale vertical ribs following the hull, every ~9 m.
  const per: number[] = [0]
  for (let i = 1; i <= n; i++) per.push(per[i - 1] + Math.hypot(ring[i % n][0] - ring[i - 1][0], ring[i % n][1] - ring[i - 1][1]))
  const L = per[n], FINS = Math.round(L / 10)
  const along = (ringK: V3[], s: number): [V3, V3] => {
    let i = 0
    while (per[i + 1] < s) i++
    const u = (s - per[i]) / (per[i + 1] - per[i]), a = ringK[i], b = ringK[(i + 1) % n]
    const pnt: V3 = [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u]
    const tan: V3 = [b[0] - a[0], b[1] - a[1], 0], l = Math.hypot(tan[0], tan[1]) || 1
    return [pnt, [tan[0] / l, tan[1] / l, 0]]
  }
  for (let f = 0; f < FINS; f++) {
    const s = ((f + 0.5) * L) / FINS
    const secs = hull.map((rk) => {
      const [p, t] = along(rk, s)
      const o: V3 = [t[1], -t[0], 0] // outward
      const w = 0.7, d0 = 0.05, d1 = 0.6
      return [
        [p[0] - t[0] * w + o[0] * d0, p[1] - t[1] * w + o[1] * d0, p[2]],
        [p[0] + t[0] * w + o[0] * d0, p[1] + t[1] * w + o[1] * d0, p[2]],
        [p[0] + t[0] * w + o[0] * d1, p[1] + t[1] * w + o[1] * d1, p[2]],
        [p[0] - t[0] * w + o[0] * d1, p[1] - t[1] * w + o[1] * d1, p[2]],
      ] as V3[]
    })
    // three outer faces of the rib (inner face is against the glass)
    for (let k = 0; k < secs.length - 1; k++) {
      const a = secs[k], b = secs[k + 1]
      silver.quad(a[1], a[2], b[2], b[1])
      silver.quad(a[2], a[3], b[3], b[2])
      silver.quad(a[3], a[0], b[0], b[3])
    }
  }

  const lit = (p: V3, nn: V3) => (nn[2] < -0.5 ? 0.6 : 0)
  const parts = [
    { part: glassP, material: { ...PALETTE.window } },
    { part: silver, material: { ...finish('opera-silver', 0xd9dcdc, 0.6), floodlight: lit } },
    { part: deck, material: finish('opera-roof', 0xb4c0c7) },
  ]
  await writeModel('dubai-opera', 'Dubai Opera', parts, {
    bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: 49.4,
    replaces: ['way/475848632'],
  })
}
