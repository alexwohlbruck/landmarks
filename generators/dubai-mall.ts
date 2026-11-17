/**
 * The Dubai Mall (Emaar, opened 2008), the low, sprawling mall at the foot of
 * the Burj Khalifa, its waterfront facing the Burj Khalifa Lake and the
 * Dubai Fountain. Original procedural geometry, CC0-1.0.
 * bun generators/dubai-mall.ts
 *
 * The real building is a huge, mostly plain block. The model is clean low
 * massing on the real outline, plus what identifies it from above and from
 * the lake: the round drums and the curved ribbed glass vault along the
 * waterfront, the star-patterned glass dome, the raised squares with their
 * oculus and skylights, the long white barrel-vaulted roof over the cinema
 * block on the parking structure, the glazed waterfront facade, and the
 * porte-cochère entrances on Financial Centre Road.
 *
 * Frame: BEARING 120.1 (the principal axis of the outline). Features are
 * authored in north-up metres (E, N) about the anchor and turned into the
 * frame by `rot`. Origin = area centroid of the outer ring of OSM
 * relation/18195959. y = 0 is the street; elevation 0 (Downtown Dubai is
 * flat; the map's terrain tool has no tiles here, so it could not be
 * checked).
 *
 * Evidence
 * - OSM relation/18195959 (building=retail, shop=mall, height 20, 3 levels,
 *   wikidata Q1133309): outer ways way/47515677 + way/1327211763, joined and
 *   simplified to within 2 m (289 → 112 points), 246,500 m² in plan, about
 *   800 m by 600 m. Inside it: way/240462845 (building:part=parking, "Cinema
 *   Parking Dubai Mall", 330 m by 120 m along the south-east side) and
 *   way/1184630707 (building=yes, layer 3, tagged as a restaurant: the
 *   120 m by 65 m roof block that carries the white barrel vault in the
 *   photos). Left to the map: way/47516030 (13 levels, 50 m, glass), which
 *   only shares the outline's west edge, and way/1093992494 (the Chinatown
 *   bridge, min_height 5), which only touches it.
 * - Published (Wikipedia "The Dubai Mall"): opened November 2008, about
 *   1,124,000 m² gross floor area, four shopping levels, on the Burj Khalifa
 *   Lake facing the Dubai Fountain.
 * - Photos (Wikimedia Commons):
 *   * "Dep Sec Brouillette visited the Burj Khalifa (2).jpg", Office of the
 *     U.S. Deputy Energy Secretary, public domain, 2018 (from the Burj
 *     Khalifa, looking east over the south half): the roofscape: pale grey
 *     roofs, the white barrel vault on the parking block, the raised square
 *     with an octagonal oculus, the dotted skylight square, the curved ribbed
 *     glass vault behind the waterfront, the two round drums by the lake (one
 *     a plain white disc, one with a star), a second ribbed vault and a round
 *     spiral disc further north-west.
 *   * "Dubai Mall 2012-09-11 (13109074034).jpg", remundo, CC BY-SA 2.0 (the
 *     same view in 2012).
 *   * "The Dubai Fountain 01.jpg" and "02.jpg", Donaldytong, CC BY-SA 3.0
 *     (daylight, across the lake): the waterfront facade, golden sand
 *     cladding with big glazed bays over a ground-floor arcade, about four
 *     storeys.
 *   * "Dubai Mall (15691005768).jpg", Guilhem Vellut, CC BY 2.0, and
 *     "Square in from of Dubai ... Mall UAE - 043 (15656282153).jpg", Wasif
 *     Malik, CC BY 2.0 (night): the waterfront's lit glazing.
 *   * "13 Dubai Mall night view exterior.jpg", Tupungato, CC BY 3.0: a
 *     glazed entrance pavilion.
 *
 * Numbers
 * - Main roof 21 m: OSM height 20 plus a parapet; agrees with four storeys
 *   in the lake photos.
 * - Parking block deck 23 m; the white vault on it rising to 33 m; drums
 *   27-29 m; raised squares 25-26 m; glass vaults 5-7 m above the roof:
 *   estimated from the oblique photos against the 21 m roof.
 * - Positions of the roof features: estimated from the oblique 2018 and
 *   2012 photos against the outline's bulges, the lake and the fountain; read
 *   them as within about 30 m. The white vault sits on the OSM block
 *   way/1184630707 (measured).
 * - Colours: sand cladding from the daylight photos, roofs a paler sand (#f0e6d2, the
 *   2018 photo's pale beige roofscape), white
 *   roof features `trim`, skylights `glass`.
 *
 * Doubts: no licensed photo of the north and east sides or of the northern
 * half of the roof from above, so those are plain; the waterfront drum and
 * vault positions are approximate; the entrances on the north-east side are
 * placed at the outline's porte-cochère notches, not from photos.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { writeModel, loftGrid } from './dubai-opera'
import { prism, flat, ccw, type XY } from './sf-de-young'

const BEARING = 120.1
const ANCHOR = { lng: 55.2788104, lat: 25.1972178 }
const B = (BEARING * Math.PI) / 180
/** North-up (E, N) metres → model frame. */
const rot = ([e, n]: XY): XY => [e * Math.cos(B) - n * Math.sin(B), e * Math.sin(B) + n * Math.cos(B)]
const R = (pts: XY[]) => pts.map(rot)

// Outer ring of relation/18195959, simplified to 2 m, north-up metres.
const RING_EN: XY[] = [[363.3, -13.2], [345.2, -43.6], [364.8, -58.6], [366.4, -67.6], [361.4, -79.7], [351.0, -91.0], [332.5, -99.4], [282.3, -180.7], [275.1, -177.8], [207.3, -300.9], [200.2, -296.5], [193.0, -317.6], [176.6, -324.7], [155.3, -314.7], [130.0, -285.2], [108.8, -272.8], [97.2, -281.9], [80.4, -284.4], [77.2, -275.8], [89.2, -261.1], [70.0, -249.9], [59.3, -248.7], [39.0, -252.6], [21.3, -247.0], [5.8, -229.5], [3.2, -207.5], [-39.5, -185.9], [-77.6, -156.1], [-91.6, -166.2], [-102.9, -169.2], [-120.1, -167.1], [-130.8, -161.4], [-142.6, -146.5], [-145.9, -134.3], [-145.0, -121.6], [-161.4, -88.4], [-182.2, -63.4], [-207.6, -43.2], [-210.0, -54.0], [-218.1, -52.1], [-233.3, -45.6], [-253.5, -29.8], [-265.1, -26.4], [-276.9, -30.5], [-288.2, -47.7], [-302.7, -58.7], [-320.5, -61.6], [-341.6, -52.6], [-348.6, -43.1], [-344.4, -25.2], [-336.6, -25.8], [-323.5, -9.6], [-314.4, -11.3], [-314.9, 24.0], [-319.3, 47.7], [-333.7, 80.7], [-356.7, 110.3], [-374.9, 126.8], [-419.0, 150.0], [-425.5, 157.9], [-425.7, 165.8], [-420.1, 168.7], [-419.4, 177.7], [-411.9, 183.0], [-405.7, 182.3], [-379.4, 203.2], [-357.8, 209.4], [-341.6, 209.2], [-325.9, 205.0], [-323.1, 208.1], [-318.0, 204.1], [-307.5, 209.2], [-300.1, 205.5], [-297.6, 200.6], [-283.5, 206.7], [-276.3, 200.8], [-255.0, 211.0], [-257.7, 220.9], [-254.5, 231.3], [-246.1, 238.3], [-238.8, 239.8], [-197.4, 232.3], [-178.1, 241.2], [-138.9, 218.5], [-118.7, 251.6], [-114.4, 249.2], [-96.7, 278.1], [-59.3, 255.4], [-60.1, 232.0], [-56.6, 232.6], [-56.7, 243.4], [-52.2, 255.1], [-41.0, 256.5], [-34.8, 245.0], [-33.7, 231.3], [-28.6, 236.9], [-10.1, 225.9], [-8.2, 229.1], [56.4, 190.1], [72.4, 190.2], [86.9, 185.2], [101.4, 172.5], [108.4, 158.7], [155.0, 130.1], [159.9, 138.3], [176.5, 128.2], [171.0, 118.8], [230.3, 84.3], [236.2, 93.8], [249.6, 85.7], [243.0, 75.3], [378.1, -2.3]]
// way/240462845, the parking structure, and way/1184630707, the block under the white vault.
const PARKING_EN: XY[] = [[280.2, 47.7], [79.1, -246.7], [181.8, -307.5], [325.0, -74.0], [295.0, -55.7], [305.3, -38.8], [329.8, -53.4], [362.3, -3.3]]
const VAULT_EN: XY[] = [[264.4, -41.3], [199.9, -142.5], [144.3, -107.5], [208.8, -6.4]]

const H = 21, PARK = 23

const sand = new Part(), roof = new Part(), glass = new Part(), win = new Part(), white = new Part(), door = new Part()

// --- Massing -----------------------------------------------------------------
const ring = ccw(R(RING_EN))
prism(sand, ring, 0, H, roof, 0.5)
// Parking deck, a little higher and darker in the photos.
prism(sand, ccw(R(PARKING_EN)), H - 0.5, PARK, roof, 0.4)

// --- Waterfront facade: glazed bays over the arcade on the lake-facing walls --
const n = ring.length
for (let i = 0; i < n; i++) {
  const a = ring[i], b = ring[(i + 1) % n]
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy)
  if (L < 10) continue
  const ox = dy / L, oy = -dx / L // outward (ring is CCW)
  // outward normal back to north-up to find the lake side (south-west / west)
  const e = ox * Math.cos(-B) - oy * Math.sin(-B), nn = ox * Math.sin(-B) + oy * Math.cos(-B)
  const brg = ((Math.atan2(e, nn) * 180) / Math.PI + 360) % 360
  // only the stretch along the lake: mid-point west of E = 0 and south of N = 0
  const m: XY = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
  const mEN: XY = [m[0] * Math.cos(-B) - m[1] * Math.sin(-B), m[0] * Math.sin(-B) + m[1] * Math.cos(-B)]
  if (!(brg > 170 && brg < 300 && mEN[0] < 10 && mEN[1] < 30 && mEN[0] > -360)) continue
  const bays = Math.max(1, Math.round(L / 10)), pier = 1.6
  for (let k = 0; k < bays; k++) {
    const t0 = k / bays, t1 = (k + 1) / bays
    const P = (t: number, z: number, out = 0.05): V3 => [a[0] + dx * t + ox * out, a[1] + dy * t + oy * out, z]
    const s0 = t0 + pier / 2 / L, s1 = t1 - pier / 2 / L
    win.quad(P(s0, 8), P(s1, 8), P(s1, 17.5), P(s0, 17.5))
    door.quad(P(s0, 0.8), P(s1, 0.8), P(s1, 5), P(s0, 5))
  }
  // a pale canopy band between the arcade and the glazing
  const Q = (t: number, z: number, out: number): V3 => [a[0] + dx * t + ox * out, a[1] + dy * t + oy * out, z]
  white.quad(Q(0, 6, 1.6), Q(1, 6, 1.6), Q(1, 7, 1.6), Q(0, 7, 1.6))
  white.quad(Q(0, 7, 0), Q(0, 7, 1.6), Q(1, 7, 1.6), Q(1, 7, 0))
  white.quad(Q(1, 6, 0), Q(1, 6, 1.6), Q(0, 6, 1.6), Q(0, 6, 0))
}

// --- Helpers ---------------------------------------------------------------------
const circle = (c: XY, r: number, k = 16): XY[] => Array.from({ length: k }, (_, i) => [c[0] + r * Math.cos((2 * Math.PI * i) / k), c[1] + r * Math.sin((2 * Math.PI * i) / k)] as XY)
/** A round drum: sand wall with a glazed band, a white disc roof that overhangs a little. */
function drum(cEN: XY, r: number, h: number, dome = false) {
  const c = rot(cEN)
  prism(sand, circle(c, r), H - 1, h - 3, null)
  // glazed band (inset panels would be finer than the map draws; a band reads)
  prism(win, circle(c, r + 0.05), h - 9, h - 4.5, null)
  prism(white, circle(c, r + 1.2), h - 3, h, white, 0.4, true)
  if (dome) {
    // a shallow glass dome and a white star of ribs over it
    const prof: [number, number][] = [[r * 0.85, h], [r * 0.75, h + 2.6], [r * 0.5, h + 4.6], [0, h + 5.6]]
    for (let k = 0; k < prof.length - 1; k++) {
      const [r0, z0] = prof[k], [r1, z1] = prof[k + 1]
      const a = circle(c, r0), b = circle(c, r1)
      for (let i = 0; i < 16; i++) {
        const j = (i + 1) % 16
        if (r1 > 0) glass.quad([...a[i], z0], [...a[j], z0], [...b[j], z1], [...b[i], z1])
        else glass.tri([...a[i], z0], [...a[j], z0], [c[0], c[1], z1])
      }
    }
    for (let s = 0; s < 8; s++) {
      const ang = (2 * Math.PI * s) / 8 + Math.PI / 8, ux = Math.cos(ang), uy = Math.sin(ang), w = 0.9
      const pts: V3[] = prof.map(([rr, z]) => [c[0] + ux * rr, c[1] + uy * rr, z + 0.25])
      for (let k = 0; k < pts.length - 1; k++) {
        const p0 = pts[k], p1 = pts[k + 1]
        white.quad([p0[0] - uy * w, p0[1] + ux * w, p0[2]], [p0[0] + uy * w, p0[1] - ux * w, p0[2]], [p1[0] + uy * w, p1[1] - ux * w, p1[2]], [p1[0] - uy * w, p1[1] + ux * w, p1[2]])
      }
    }
  }
}
/**
 * A barrel vault along a north-up polyline: half-round section `w` wide,
 * rising `rise` above `z0`, on `mat`, with ribs on `ribs` every `step` metres.
 */
function vault(pathEN: XY[], w: number, rise: number, z0: number, mat: Part, ribs: Part | null, step = 8, seg = 8) {
  const path = R(pathEN)
  // resample
  const L = path.slice(1).reduce((s, p, i) => s + Math.hypot(p[0] - path[i][0], p[1] - path[i][1]), 0)
  const N = Math.max(2, Math.round(L / 6))
  const at = (u: number): [XY, XY] => {
    let s = u * L, i = 0
    while (i < path.length - 2) { const l = Math.hypot(path[i + 1][0] - path[i][0], path[i + 1][1] - path[i][1]); if (s <= l) break; s -= l; i++ }
    const a = path[i], b = path[i + 1], l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1
    return [[a[0] + ((b[0] - a[0]) * s) / l, a[1] + ((b[1] - a[1]) * s) / l], [(b[0] - a[0]) / l, (b[1] - a[1]) / l]]
  }
  const sec = (u: number, grow = 0): V3[] => {
    const [p, t] = at(u), nx = -t[1], ny = t[0]
    return Array.from({ length: seg + 1 }, (_, k) => {
      const th = (Math.PI * k) / seg, cx = Math.cos(th) * (w / 2 + grow), cz = Math.sin(th) * (rise + grow)
      return [p[0] + nx * cx, p[1] + ny * cx, z0 + cz] as V3
    })
  }
  const rings = Array.from({ length: N + 1 }, (_, q) => sec(q / N))
  for (let q = 0; q < N; q++)
    for (let k = 0; k < seg; k++) mat.quad(rings[q][k], rings[q][k + 1], rings[q + 1][k + 1], rings[q + 1][k])
  // gable ends
  for (const [q, flip] of [[0, true], [N, false]] as [number, boolean][]) {
    const r = rings[q], mid: V3 = [(r[0][0] + r[seg][0]) / 2, (r[0][1] + r[seg][1]) / 2, z0]
    for (let k = 0; k < seg; k++) flip ? mat.tri(mid, r[k], r[k + 1]) : mat.tri(mid, r[k + 1], r[k])
  }
  if (ribs) {
    const M = Math.max(2, Math.round(L / step))
    for (let q = 0; q <= M; q++) {
      const u = Math.min(0.999, Math.max(0.001, q / M)), a = sec(u, 0.35), [, t] = at(u), d = 0.5
      for (let k = 0; k < seg; k++) {
        const p0 = a[k], p1 = a[k + 1]
        ribs.quad([p1[0] - t[0] * d, p1[1] - t[1] * d, p1[2]], [p1[0] + t[0] * d, p1[1] + t[1] * d, p1[2]], [p0[0] + t[0] * d, p0[1] + t[1] * d, p0[2]], [p0[0] - t[0] * d, p0[1] - t[1] * d, p0[2]])
      }
    }
  }
}
/** A raised square roof block, turned `ang` degrees, with an optional octagonal glass oculus. */
function raised(cEN: XY, half: number, h: number, ang: number, oculus = 0) {
  const a = (ang * Math.PI) / 180
  const sq = ([[-1, -1], [1, -1], [1, 1], [-1, 1]] as XY[]).map(([x, y]) => rot([cEN[0] + half * (x * Math.cos(a) - y * Math.sin(a)), cEN[1] + half * (x * Math.sin(a) + y * Math.cos(a))]))
  prism(sand, sq, H - 0.5, h, oculus ? null : roof, 0.4)
  if (oculus) {
    // the roof with an octagonal well; the glass sits 1.5 m down in it
    const c = rot(cEN), oct = Array.from({ length: 8 }, (_, i) => [c[0] + oculus * Math.cos(a + Math.PI / 8 + (i * Math.PI) / 4), c[1] + oculus * Math.sin(a + Math.PI / 8 + (i * Math.PI) / 4)] as XY)
    // fan from each square corner to the octagon (top surface with a hole)
    const top = h
    for (let i = 0; i < 8; i++) {
      const j = (i + 1) % 8
      // nearest square corner to the octagon edge's mid-direction
      const mx = (oct[i][0] + oct[j][0]) / 2 - c[0], my = (oct[i][1] + oct[j][1]) / 2 - c[1]
      const corner = sq.reduce((best, p) => ((p[0] - c[0]) * mx + (p[1] - c[1]) * my > (best[0] - c[0]) * mx + (best[1] - c[1]) * my ? p : best))
      roof.tri([...oct[i], top], [...corner, top], [...oct[j], top])
    }
    for (let k = 0; k < 4; k++) {
      const p = sq[k], q = sq[(k + 1) % 4]
      // the octagon vertex between the two corners
      const mx = (p[0] + q[0]) / 2 - c[0], my = (p[1] + q[1]) / 2 - c[1]
      const o = oct.reduce((best, v) => ((v[0] - c[0]) * mx + (v[1] - c[1]) * my > (best[0] - c[0]) * mx + (best[1] - c[1]) * my ? v : best))
      roof.tri([...p, top], [...q, top], [...o, top])
    }
    for (let i = 0; i < 8; i++) {
      const j = (i + 1) % 8
      white.quad([...oct[j], top - 1.5], [...oct[i], top - 1.5], [...oct[i], top], [...oct[j], top])
    }
    flat(glass, oct, top - 1.5)
  }
}

// --- Roof features (positions estimated from the 2012 and 2018 photos) ---------
// Along the waterfront, south-east to north-west.
drum([-8, -213], 17, 27)                 // oval-roofed drum by the south corner
vault([[-5, -178], [-35, -165], [-62, -145], [-82, -120], [-95, -70], [-118, -50], [-150, -40]], 16, 6.5, H, glass, white, 6) // curved ribbed glass vault behind the waterfront
drum([-115, -141], 22, 28)               // plain white disc drum at the lake bulge
drum([-122, -92], 18, 27, true)          // the star dome, just inland of it
vault([[-205, -25], [-240, -5], [-275, 0]], 14, 5.5, H, glass, white, 6) // second ribbed vault
drum([-318, -38], 16, 26)                // round drum by the north-west corner
// Inland.
raised([-40, -70], 24, 26, 30, 8)        // square with the octagonal oculus
raised([20, -125], 21, 25, 30)           // the dotted skylight square
for (const [x, y] of [[-8, -8], [8, -8], [-8, 8], [8, 8]] as XY[]) {
  const a = (30 * Math.PI) / 180, c: XY = [20 + x * Math.cos(a) - y * Math.sin(a), -125 + x * Math.sin(a) + y * Math.cos(a)]
  flat(glass, circle(rot(c), 3.2, 8), 25.06)
}
// Round skylights over the north-west wing.
for (const c of [[-280, 110], [-230, 95], [-180, 80]] as XY[]) {
  prism(white, circle(rot(c), 9, 12), H - 0.5, H + 1.2, null)
  flat(glass, circle(rot(c), 9, 12), H + 1.2)
}
// Raised roof blocks: the roofscape is a patchwork of flat blocks a few
// metres above the main roof (positions and sizes estimated).
for (const [c, hx, hy, h] of [[[-30, -60], 60, 45, 24], [[60, -150], 45, 35, 23.5], [[-250, 120], 70, 45, 23.5], [[-120, 120], 55, 60, 24.5], [[40, 80], 70, 50, 23]] as [XY, number, number, number][]) {
  const a = (30 * Math.PI) / 180
  const sq = ([[-1, -1], [1, -1], [1, 1], [-1, 1]] as XY[]).map(([x, y]) => rot([c[0] + hx * x * Math.cos(a) - hy * y * Math.sin(a), c[1] + hx * x * Math.sin(a) + hy * y * Math.cos(a)]))
  prism(sand, sq, H - 0.5, h, roof, 0.4)
}

// The white barrel vault over the cinema block on the parking structure.
{
  const [a, b, c, d] = VAULT_EN // long sides a-b and d-c
  const m1: XY = [(a[0] + d[0]) / 2, (a[1] + d[1]) / 2], m2: XY = [(b[0] + c[0]) / 2, (b[1] + c[1]) / 2]
  const w = Math.hypot(d[0] - a[0], d[1] - a[1])
  prism(sand, ccw(R(VAULT_EN)), PARK - 0.5, PARK + 1, roof)
  vault([m1, m2], w - 4, 9, PARK + 1, white, null)
}

// --- Entrances on Financial Centre Road (the outline's porte-cochère notches) ---
for (const [p, q] of [[[155.0, 130.1], [176.5, 128.2]], [[230.3, 84.3], [249.6, 85.7]], [[-60.1, 232.0], [-33.7, 231.3]]] as [XY, XY][]) {
  const a = rot(p), b = rot(q), dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy)
  // the notch faces out of the mall: outward normal of the CCW ring here
  const ox = dy / L, oy = -dx / L, s = ring.some((r) => Math.hypot(r[0] - a[0], r[1] - a[1]) < 1) ? 1 : 1
  const P = (t: number, out: number, z: number): V3 => [a[0] + dx * t + ox * out * s, a[1] + dy * t + oy * out * s, z]
  door.quad(P(0.05, 0.1, 0), P(0.95, 0.1, 0), P(0.95, 0.1, 9), P(0.05, 0.1, 9))
  door.quad(P(0.95, -0.1, 0), P(0.05, -0.1, 0), P(0.05, -0.1, 9), P(0.95, -0.1, 9))
  // canopy
  const c0 = P(-0.1, -2, 9), c1 = P(1.1, -2, 9), c2 = P(1.1, 10, 9), c3 = P(-0.1, 10, 9)
  for (const [p0, p1, p2, p3, up] of [[c0, c1, c2, c3, true]] as [V3, V3, V3, V3, boolean][]) {
    const lift = (v: V3): V3 => [v[0], v[1], v[2] + 1.4]
    white.quad(p0, p1, p2, p3); white.quad(lift(p3), lift(p2), lift(p1), lift(p0))
    white.quad(p0, p3, lift(p3), lift(p0)); white.quad(p1, lift(p1), lift(p2), p2)
    white.quad(p3, p2, lift(p2), lift(p3)); white.quad(p0, lift(p0), lift(p1), p1)
    void up
  }
}

const lake = (p: V3, nn: V3) => {
  // floodlight the waterfront walls (lit in the night photos)
  const e = nn[0] * Math.cos(-B) - nn[1] * Math.sin(-B), nN = nn[0] * Math.sin(-B) + nn[1] * Math.cos(-B)
  return nn[2] < 0.5 && e < -0.2 && nN < 0.3 && p[2] < 22 ? 0.6 : 0
}
await writeModel('dubai-mall', 'The Dubai Mall', [
  { part: sand, material: { ...finish('mall-sand', 0xe6d4b5), floodlight: lake } },
  { part: roof, material: finish('mall-roof', 0xf0e6d2) },
  { part: white, material: PALETTE.trim },
  { part: glass, material: PALETTE.glass },
  { part: win, material: PALETTE.window },
  { part: door, material: PALETTE.entrance },
], {
  bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: 33,
  replaces: ['relation/18195959', 'way/240462845', 'way/1184630707'],
})
