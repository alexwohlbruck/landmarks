/**
 * Seoul World Cup Stadium (서울월드컵경기장, Sangam-dong, Mapo-gu; architect
 * Ryu Choon-soo, roof engineered by Geiger Engineers, opened 10 November
 * 2001): original procedural geometry, CC0-1.0.
 * bun generators/seoul-world-cup-stadium.ts
 *
 * This file also exports the small kit (rings, smooth strips, tubes,
 * superellipses) used by the other seoul- sport models of this builder
 * (seoul-olympic-stadium, seoul-gocheok-sky-dome, seoul-kspo-dome,
 * seoul-world-peace-gate); its own build runs only under `import.meta.main`.
 *
 * Map frame: x east, y north, z up, metres. Anchor = area centroid of the
 * stadium building, OSM relation/2241251 (building=stadium;yes, outer
 * way/168102974 and five small outers, inner way/168102973), lng
 * 126.8972922, lat 37.5683503. Bearing 15: the pitch's long side (OSM
 * relation/9176866 inner way/168102975 runs at 14.9 deg), so model +y runs
 * along the pitch (north-north-east) and +x across it. The bowl is drawn
 * symmetric about its centre C = (-3, -10) in this frame, the centre of the
 * OSM roof octagon (relation/2241252) and of the outer outline.
 *
 * Identity, in order: the white membrane roof, square-ish in plan with its
 * corners cut (the sogban / palgak-moban tray and the bangpae-yeon shield
 * kite, as the operator describes it), its rim low over the middle of each
 * side and sweeping up at the four corners; the scalloped membrane, vaulted
 * between radial trusses; the 16 white masts standing up through the roof
 * with their cable fans; the translucent polycarbonate band round the
 * opening; the white colonnade of the open concourses under the roof's
 * grey soffit; the raised deck (podium) round the bowl.
 *
 * Evidence
 *  - Plan (OSM, measured in this frame): building outer way/168102974, an
 *    oval 279 x 305 m (published 279 x 304 m, sisul.or.kr): the raised deck
 *    round the bowl. Roof outer way/26314080: an octagon, half 109.7 (x) by
 *    127.8 (y), its corners cut from (109.7, 84) to (69, 127.8), drawn
 *    exactly that, made symmetric. The five small outers of the building
 *    (four round stair towers on the diagonals and a 36 x 38 m block on the
 *    north) are drawn as they are mapped. The pitch surround (OSM inner way
 *    168102975, 66 x 120 m; published field 117 x 78 m, ko.wikipedia) and the
 *    lower bowl (OSM relation/9176866 outer way/659951310, 94 x 187 m) give
 *    the stands.
 *  - The roof opening is NOT the OSM roof inner way (way/168102971, which
 *    repeats the lower bowl's outline): in the licensed inside views (dan,
 *    pano1, yan) the roof reaches as deep over the ends as over the sides,
 *    covering "90% of the seats" (published). ESTIMATED as a superellipse
 *    half 60 x 80 m (exponent 2.6), so the roof is ~48-50 m deep all round,
 *    with a 12 m band of translucent polycarbonate at its inner edge (pano1).
 *  - Heights: published "최고높이 49.4 m" (Seoul Facilities Corporation,
 *    sisul.or.kr) and "the roof ... is 50 meters high" (Wikipedia), taken
 *    as the roof's crest, the ridge along the masts: 46 m over the middle of
 *    each side, 49.4 m at the corners. The roof falls from the crest both
 *    ways: outwards to the rim (31.5 m mid-side, sweeping up to 47.5 m at
 *    the corners, the kite / tray lift) and inwards to the inner edge
 *    (38-44 m). The rim's profile, the crest band seen above it and the mast
 *    tips (70 m, finials to 73 m) are ESTIMATED from the level distant photo to4 (from the
 *    west-south-west), scaled to the 49.4 m crest: the masts stand about as
 *    far above the rim as the rim stands above the ground, so they must top
 *    out over the published 49.4 m, which is taken to exclude them (doubt).
 *    Deck (podium) 8 m, concourse slabs 14.5, 21 and 27.5 m, upper tier back
 *    32 m: estimated from to4 (open grey concrete concourse levels over the
 *    deck).
 *  - 16 masts (Wikipedia, Geiger Engineers): the positions are ESTIMATED,
 *    evenly round the roof every 22.5 deg, half-way across it: the photos
 *    show them standing up through the membrane in a steady rhythm, nearer
 *    together at the corners (to4). Each carries a fan of four cables
 *    running down from the head to the roof round its own foot (dan),
 *    two towards the opening and two towards the rim; the real fans have more and finer cables. Masts and cables are drawn thicker than real so they survive
 *    the 80 px view.
 *  - Elevation 0. The field is taken at the level of the streets round the
 *    deck: the deck is reached by broad flights of steps up from the plaza
 *    (c01, kpop) and the lower tier rises from the pitch to the deck. No
 *    published field level was found ("지하1층" only); doubt.
 *  - Photos (all EVIDENCE):
 *    - to4 "travel oriented", "Seoul World Cup Stadium", Flickr, CC BY-SA 2.0,
 *      distant level view from the west: rim profile, masts, colonnade, deck.
 *      https://www.flickr.com/photos/99958070@N02/14887745963
 *    - to1 "travel oriented", "Seoul World Cup Stadium", Flickr, CC BY-SA 2.0,
 *      distant view from the west. https://www.flickr.com/photos/99958070@N02/14864366542
 *    - isa InSapphoWeTrust, "서울월드컵경기장 Seoul World Cup Stadium",
 *      Flickr, CC BY-SA 2.0, from the west. https://www.flickr.com/photos/56619626@N05/5505348528
 *    - c01 Exj, "Seoul World Cup Stadium 01.jpg", Wikimedia Commons, CC BY-SA
 *      4.0: masts over the roof edge, soffit, the steps up to the deck.
 *      https://commons.wikimedia.org/wiki/File:Seoul_World_Cup_Stadium_01.jpg
 *    - dan Dan820526, "서울월드컵경기장.jpg", Wikimedia Commons, CC BY-SA 4.0:
 *      inside; masts and cable fans, the rising inner edge, trusses.
 *      https://commons.wikimedia.org/wiki/File:%EC%84%9C%EC%9A%B8%EC%9B%94%EB%93%9C%EC%BB%B5%EA%B2%BD%EA%B8%B0%EC%9E%A5.jpg
 *    - pano1 张元柏, "Seongsan-dong, Mapo-gu, Seoul, South Korea -
 *      panoramio.jpg", Wikimedia Commons, CC BY-SA 3.0: inside; vaulted
 *      membrane bays, polycarbonate band, ring truss, the two tiers.
 *      https://commons.wikimedia.org/wiki/File:Seongsan-dong,_Mapo-gu,_Seoul,_South_Korea_-_panoramio.jpg
 *    - yan Yanikor, "Seoul-Worldcupstadium.jpg", Wikimedia Commons, CC BY-SA
 *      4.0: inside along the pitch, day and night.
 *      https://commons.wikimedia.org/wiki/File:Seoul-Worldcupstadium.jpg
 *    - kpop Wvdp, "Seoul World Cup Stadium after K-pop Super Live -
 *      2023-08-11 WSJ 2023.jpg", Wikimedia Commons, CC0: night, the lit
 *      soffit and the steps. https://commons.wikimedia.org/wiki/File:Seoul_World_Cup_Stadium_after_K-pop_Super_Live_-_2023-08-11_WSJ_2023.jpg
 *  - Published: sisul.or.kr (Seoul Facilities Corporation) stadium page
 *    (49.4 m, 304 x 279 m, B1/6F, 90% of seats covered, the sogban /
 *    palgak-moban and bangpae-yeon motifs); en.wikipedia "Seoul World Cup
 *    Stadium" (16 masts, 50 m roof, fibreglass membrane and polycarbonate);
 *    Geiger Engineers project page "2002 World Cup Main Stadium" (canopy on
 *    16 masts).
 *  Look-only (not relied on for any shape): KOMPSAT-3 image "서울 상암 월드컵
 *  경기장 (아리랑 3호) (765).jpeg", KOGL Type 1 (tagged LOOK-ONLY by the
 *  tools), looked at to confirm the roof is a cut-corner square with an
 *  opening about equally deep all round.
 *  No lidar, NAIP or map terrain exists here (Mapterhorn has no z15 tiles
 *  over Seoul): the terrain could not be checked. No commercial imagery.
 *
 * Invented or simplified: the stands are three plain surfaces; the trusses
 *  are 48 plain ribs; the cable fans have four cables per mast; the
 *  concourse's stairs and services are left out; the deck is level all
 *  round at 8 m (it is reached by ramps and steps not drawn); seat colour a
 *  muted red-grey for FC Seoul's red and black seats. Night: the membrane
 *  carries _FLOODLIGHT, glowing like a paper lantern as the operator
 *  describes it (kpop, yan night half); glass stays dark.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { save } from './chi-aon-center'

// ---------------------------------------------------------------------------
// The kit, shared with this builder's other seoul- sport models.

export const nrm3 = (a: V3): V3 => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l] }
export const crs = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
export const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
export const vsub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
export const vadd = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
export const vmul = (a: V3, s: number): V3 => [a[0] * s, a[1] * s, a[2] * s]
export const vlerp = (a: V3, b: V3, t: number): V3 => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]

/** Polar radius of a superellipse with half-axes a (x), b (y), exponent e. */
export const se = (phi: number, a: number, b: number, e: number) =>
  Math.pow(Math.pow(Math.abs(Math.cos(phi) / a), e) + Math.pow(Math.abs(Math.sin(phi) / b), e), -1 / e)

/** A flat polygon, wound to face `n`. */
export function face(p: Part, pts: V3[], n: V3) {
  const g = crs(vsub(pts[1], pts[0]), vsub(pts[2], pts[0]))
  const ring = dot(g, n) < 0 ? [...pts].reverse() : pts
  for (let i = 1; i < ring.length - 1; i++) p.tri(ring[0], ring[i], ring[i + 1])
}

/**
 * A smooth-shaded strip between two rings of the same length, its normals
 * turned to agree with `hint` at each vertex. `closed` joins the last
 * vertex back to the first.
 */
export function strip(p: Part, r0: V3[], r1: V3[], hint: (q: V3) => V3, closed = true, flat = false) {
  const n = r0.length
  const nv = (k: number, r: V3[]): V3 => {
    const a = r[closed ? (k - 1 + n) % n : Math.max(0, k - 1)], b = r[closed ? (k + 1) % n : Math.min(n - 1, k + 1)]
    const T = vsub(b, a)
    const U = vsub(r1[k], r0[k])
    let m = nrm3(crs(T, U))
    if (dot(m, hint(r[k])) < 0) m = vmul(m, -1)
    return m
  }
  for (let i = 0; i < (closed ? n : n - 1); i++) {
    const j = (i + 1) % n
    const a = r0[i], b = r0[j], c = r1[j], d = r1[i]
    if (flat) {
      const h = hint(vlerp(vlerp(a, b, 0.5), vlerp(c, d, 0.5), 0.5))
      face(p, [a, b, c], h)
      face(p, [a, c, d], h)
      continue
    }
    const na = nv(i, r0), nb = nv(j, r0), nc = nv(j, r1), nd = nv(i, r1)
    p.tri(a, b, c, undefined, undefined, undefined, [na, nb, nc])
    p.tri(a, c, d, undefined, undefined, undefined, [na, nc, nd])
  }
}

/**
 * A closed strip of vaults: rings sampled valley, crown, valley, ... (even
 * indices are the creases). Each half-bay is lit with its own face normal at
 * the crease and the bay's mean at the crown, so the vaults read while the
 * crowns weld.
 */
export function vaults(p: Part, r0: V3[], r1: V3[], hint: (q: V3) => V3) {
  const n = r0.length
  const fn = (i: number): V3 => {
    const j = (i + 1) % n
    let m = nrm3(crs(vsub(r0[j], r0[i]), vsub(r1[i], r0[i])))
    if (dot(m, hint(r0[i])) < 0) m = vmul(m, -1)
    return m
  }
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    const f = fn(i)
    const crownIdx = i % 2 === 1 ? i : j
    const other = i % 2 === 1 ? fn((i - 1 + n) % n) : fn(j)
    const crown = nrm3(vadd(f, other))
    const ni = i === crownIdx ? crown : f, nj = j === crownIdx ? crown : f
    p.tri(r0[i], r0[j], r1[j], undefined, undefined, undefined, [ni, nj, nj])
    p.tri(r0[i], r1[j], r1[i], undefined, undefined, undefined, [ni, nj, ni])
  }
}

/** A closed tube of `sides` facets from a to b, radius r0 at a and r1 at b, capped at b. */
export function tube(p: Part, a: V3, b: V3, r0: number, r1: number, sides = 4, capEnd = true, capStart = false, rot = Math.PI / 4, smooth = false) {
  const ax = nrm3(vsub(b, a))
  const ref: V3 = Math.abs(ax[2]) > 0.9 ? [1, 0, 0] : [0, 0, 1]
  const u = nrm3(crs(ax, ref)), v = crs(ax, u)
  const ring = (c: V3, r: number) => Array.from({ length: sides }, (_, k) => {
    const t = rot + (k / sides) * 2 * Math.PI
    return vadd(c, vadd(vmul(u, r * Math.cos(t)), vmul(v, r * Math.sin(t))))
  })
  const A = ring(a, r0), B = ring(b, r1)
  for (let k = 0; k < sides; k++) {
    const j = (k + 1) % sides
    if (smooth) {
      const na = nrm3(vsub(A[k], a)), nb = nrm3(vsub(A[j], a))
      p.tri(A[k], A[j], B[j], undefined, undefined, undefined, [na, nb, nb])
      p.tri(A[k], B[j], B[k], undefined, undefined, undefined, [na, nb, na])
      continue
    }
    const out = vsub(vlerp(A[k], A[j], 0.5), a)
    face(p, [A[k], A[j], B[j], B[k]], out)
  }
  if (capEnd) face(p, B, ax)
  if (capStart) face(p, A, vmul(ax, -1))
}

/** A box-section member swept along a path, smooth along it, faces flat across. */
export function beam(p: Part, path: V3[], w: number, d: number, upHint: V3 = [0, 0, 1]) {
  const secs = path.map((c, i) => {
    const a = path[Math.max(0, i - 1)], b = path[Math.min(path.length - 1, i + 1)]
    const t = nrm3(vsub(b, a))
    let s = nrm3(crs(t, upHint))
    const u = crs(s, t)
    return [vadd(c, vadd(vmul(s, w / 2), vmul(u, d / 2))), vadd(c, vadd(vmul(s, -w / 2), vmul(u, d / 2))), vadd(c, vadd(vmul(s, -w / 2), vmul(u, -d / 2))), vadd(c, vadd(vmul(s, w / 2), vmul(u, -d / 2)))] as V3[]
  })
  for (let k = 0; k < 4; k++) {
    const j = (k + 1) % 4
    const r0 = secs.map((s) => s[k]), r1 = secs.map((s) => s[j])
    const mid = (i: number) => vmul(vadd(secs[i][0], secs[i][2]), 0.5)
    strip(p, r0, r1, (q) => {
      let bi = 0, bd = 1e9
      secs.forEach((s, i) => { const d = Math.hypot(...vsub(s[k], q)); if (d < bd) { bd = d; bi = i } })
      return vsub(vmul(vadd(secs[bi][k], secs[bi][j]), 0.5), mid(bi))
    }, false)
  }
  face(p, secs[secs.length - 1], vsub(path[path.length - 1], path[path.length - 2]))
}

/** An upright prism over a polygon (walls, plus a top fanned from its centroid). */
export function prism(wall: Part, top: Part | null, poly: [number, number][], z0: number, z1: number) {
  const n = poly.length
  let cx = 0, cy = 0
  for (const [x, y] of poly) { cx += x / n; cy += y / n }
  for (let i = 0; i < n; i++) {
    const [x0, y0] = poly[i], [x1, y1] = poly[(i + 1) % n]
    const mx = (x0 + x1) / 2 - cx, my = (y0 + y1) / 2 - cy
    const nx = y1 - y0, ny = x0 - x1
    face(wall, [[x0, y0, z0], [x1, y1, z0], [x1, y1, z1], [x0, y0, z1]], nx * mx + ny * my >= 0 ? [nx, ny, 0] : [-nx, -ny, 0])
    if (top) face(top, [[cx, cy, z1], [x0, y0, z1], [x1, y1, z1]], [0, 0, 1])
  }
}

/** Where the ray from the origin at angle phi leaves a star-shaped polygon. */
export function rayHit(poly: [number, number][], phi: number): number {
  const dx = Math.cos(phi), dy = Math.sin(phi)
  let best = 0
  for (let i = 0; i < poly.length; i++) {
    const [x0, y0] = poly[i], [x1, y1] = poly[(i + 1) % poly.length]
    const ex = x1 - x0, ey = y1 - y0
    const den = dx * ey - dy * ex
    if (Math.abs(den) < 1e-9) continue
    const t = (x0 * ey - y0 * ex) / den, s = (x0 * dy - y0 * dx) / den
    if (t > 0 && s >= -1e-9 && s <= 1 + 1e-9) best = Math.max(best, t)
  }
  return best
}

export const OUT = (q: V3): V3 => [q[0], q[1], 0]
export const UP = (): V3 => [0, 0, 1]
export const DOWN = (): V3 => [0, 0, -1]

// ---------------------------------------------------------------------------
// Seoul World Cup Stadium

const BEARING = 15
const CX = -3, CY = -10 // the bowl's centre in the anchor frame

/** The OSM building outer way/168102974 (the deck), in this frame, about C. */
const DECK_OSM: [number, number][] = ([[134.9, 23.7], [128.0, 47.9], [116.3, 71.3], [101.6, 90.7], [85.9, 108.0], [83.0, 110.2], [64.5, 124.1], [39.4, 136.1], [15.4, 140.6], [-4.5, 141.6], [-20.7, 141.4], [-25.8, 140.3], [-52.4, 134.9], [-74.4, 125.2], [-86.7, 115.4], [-90.7, 111.2], [-104.4, 96.7], [-120.4, 70.1], [-131.9, 44.7], [-140.1, 16.7], [-142.2, -6.5], [-139.4, -35.9], [-134.1, -58.6], [-124.6, -79.4], [-110.2, -103.3], [-105.2, -109.0], [-91.8, -124.4], [-84.3, -132.2], [-70.7, -141.7], [-49.9, -152.6], [-42.2, -155.7], [-30.9, -159.5], [-13.4, -162.6], [10.5, -163.0], [12.7, -162.6], [27.8, -160.1], [41.9, -155.7], [49.1, -152.9], [66.6, -142.6], [80.7, -130.8], [86.0, -126.4], [99.8, -110.0], [106.1, -102.5], [120.5, -80.4], [130.2, -56.7], [135.6, -30.2], [137.0, -3.3]] as [number, number][]).map(([x, y]) => [x - CX, y - CY])
/** The north block and the four round stair towers (the building's small outers). */
const BLOBS: [number, number][][] = [
  [[-20.7, 141.4], [-19.8, 178.7], [16.3, 178.0], [15.4, 140.6]],
  [[-86.7, 115.4], [-91.6, 118.6], [-98.3, 118.9], [-104.2, 115.6], [-107.1, 109.5], [-106.4, 101.3], [-104.4, 96.7]],
  [[101.6, 90.7], [104.7, 95.3], [106.1, 101.0], [105.2, 107.2], [100.2, 112.5], [93.9, 115.4], [85.8, 113.4], [83.0, 110.2], [85.9, 108.0]],
  [[80.7, -130.8], [85.3, -134.8], [91.3, -136.1], [98.4, -134.5], [104.2, -129.0], [105.8, -123.9], [105.7, -118.4], [102.7, -112.8], [99.8, -110.0], [86.0, -126.4]],
  [[-105.2, -109.0], [-108.4, -114.3], [-109.6, -120.2], [-107.9, -128.5], [-102.7, -134.5], [-96.2, -136.4], [-88.9, -136.0], [-84.3, -132.2], [-91.8, -124.4]],
].map((r) => (r as [number, number][]).map(([x, y]) => [x - CX, y - CY] as [number, number]))

// Roof octagon (OSM way/26314080, symmetric): half 109.7 x 127.8, corners cut.
const RA = 109.7, RB = 127.8, CA = 84, CB = 69
const OCT: [number, number][] = [[RA, -CA], [RA, CA], [CB, RB], [-CB, RB], [-RA, CA], [-RA, -CA], [-CB, -RB], [CB, -RB]]
const BAYS = [10, 3, 8, 3, 10, 3, 8, 3] // bays per edge: 48 in all, ~17.7 m
/** Roof opening: estimated, see header. */
const RI = (phi: number) => se(phi, 60, 80, 2.6)

const H_MID = 31.5, H_LIFT = 16 // rim: 31.5 m mid-side, 47.5 m at the lifted corners
const HC_MID = 46, HC_LIFT = 3.4 // the crest along the masts: 46-49.4 m
const HI_MID = 38, HI_LIFT = 6 // inner edge
const TC = 0.45 // where the crest runs, as a share of the roof's depth
const PHI_C = Math.atan2(105.9, 89.35) // the middle of the corner cut
/** The roof's section: up from the inner edge to the crest, down to the rim. */
function section(h: number, hc: number, hi: number, t: number) {
  if (t <= TC) return hi + (hc - hi) * Math.sin((Math.PI / 2) * (t / TC))
  return hc - (hc - h) * Math.pow((t - TC) / (1 - TC), 1.5)
}
/** 0 over the middle of a side, 1 at the middle of a corner cut. */
function lift(x: number, y: number) {
  const f = Math.atan2(Math.abs(y), Math.abs(x))
  const d = f < PHI_C ? (PHI_C - f) / PHI_C : (f - PHI_C) / (Math.PI / 2 - PHI_C)
  return Math.pow((1 + Math.cos(Math.PI * d)) / 2, 1.6)
}

const TB = 0.25 // the translucent band, as a share of the roof's depth (~12 m)
const TS = [0, TB, TC, 0.73, 1] // radial samples
const HUMP = 2.8, SKIN = 1.2, FASCIA = 3.2

function build() {
  const membrane = new Part(), trim = new Part(), concrete = new Part(), steel = new Part(), seats = new Part(), glass = new Part()
  const at = (u: number, v: number, z: number): V3 => [CX + u, CY + v, z]

  // --- The roof. Perimeter samples: bay edges (even) and bay middles (odd).
  const rim: [number, number][] = []
  for (let e = 0; e < 8; e++) {
    const [x0, y0] = OCT[e], [x1, y1] = OCT[(e + 1) % 8]
    for (let k = 0; k < BAYS[e] * 2; k++) {
      const s = k / (BAYS[e] * 2)
      rim.push([x0 + (x1 - x0) * s, y0 + (y1 - y0) * s])
    }
  }
  const NR = rim.length // 96
  const inner = rim.map(([x, y]) => { const f = Math.atan2(y, x), r = RI(f); return [r * Math.cos(f), r * Math.sin(f)] as [number, number] })
  const H = rim.map(([x, y]) => H_MID + H_LIFT * lift(x, y))
  const HI = rim.map(([x, y]) => HI_MID + HI_LIFT * lift(x, y))
  const HC = rim.map(([x, y]) => HC_MID + HC_LIFT * lift(x, y))
  // The vaults rise from nothing at the glass band, are fullest past the
  // crest and die out into the smooth rim.
  const humpAt = (k: number, t: number) => (k % 2 === 1 && t > TB && t < 1 ? HUMP * Math.min(1, (t - TB) / 0.2) : 0)
  /** The roof's skin at sample k, radial share t (top surface). */
  const roofPt = (k: number, t: number, drop = 0): V3 => {
    const [xi, yi] = inner[k], [xo, yo] = rim[k]
    const z = section(H[k], HC[k], HI[k], t) + humpAt(k, t) - drop
    return at(xi + (xo - xi) * t, yi + (yo - yi) * t, z)
  }
  const ring = (t: number, drop = 0) => rim.map((_, k) => roofPt(k, t, drop))
  const outward = (q: V3): V3 => [q[0] - CX, q[1] - CY, 0]
  const inward = (q: V3): V3 => [CX - q[0], CY - q[1], 0]

  // Membrane, top: vaulted between the trusses (flat-shaded so the vaults read).
  for (let i = 1; i < TS.length - 1; i++) vaults(membrane, ring(TS[i]), ring(TS[i + 1]), UP)
  // Membrane underside, the same vaults seen from below.
  for (let i = 1; i < TS.length - 1; i++) {
    const d0 = TS[i] === 1 ? FASCIA : SKIN, d1 = TS[i + 1] === 1 ? FASCIA : SKIN
    strip(membrane, ring(TS[i], d0), ring(TS[i + 1], d1), DOWN)
  }
  // The translucent polycarbonate band at the inner edge.
  strip(glass, ring(0), ring(TB), UP)
  // The grey fascia round the rim.
  vaults(concrete, ring(1, FASCIA), ring(1), outward)
  // The ring truss at the inner edge: a deep dark box beam.
  {
    const ev = rim.map((_, k) => k).filter((k) => k % 2 === 0)
    const top = ev.map((k) => roofPt(k, 0, -0.3)), bot = ev.map((k) => roofPt(k, 0, 3.4))
    const inPt = (p: V3, k: number): V3 => { const q = inward(p), l = Math.hypot(q[0], q[1]); return [p[0] + (q[0] / l) * 1.6, p[1] + (q[1] / l) * 1.6, p[2]] }
    const topIn = top.map((p, i) => inPt(p, ev[i])), botIn = bot.map((p, i) => inPt(p, ev[i]))
    strip(steel, botIn, topIn, inward)
    strip(steel, topIn, top, UP)
    strip(steel, bot, botIn, DOWN)
    strip(steel, bot, top, outward)
  }
  // Radial trusses under every bay edge: bold ribs, 1.6 m square, hung
  // under the skin from the ring truss to the rim (their bottom chords).
  for (let k = 0; k < NR; k += 2) {
    const a = roofPt(k, 0.02, 2.2), m = roofPt(k, TC, SKIN + 1.1), b = roofPt(k, 0.985, FASCIA + 0.6)
    tube(steel, a, m, 1.1, 1.1, 4, false, false, Math.PI / 4, true)
    tube(steel, m, b, 1.1, 1.1, 4, false, false, Math.PI / 4, true)
  }

  // --- The 16 masts, every 22.5 deg, half-way across the roof, with cables.
  const MAST_TOP = 70
  const roofAtAngle = (f: number, t: number): V3 => {
    // nearest bay sample to angle f, interpolated
    let best = 0, bd = 9
    for (let k = 0; k < NR; k++) {
      const g = Math.atan2(rim[k][1], rim[k][0])
      const d = Math.abs(Math.atan2(Math.sin(g - f), Math.cos(g - f)))
      if (d < bd) { bd = d; best = k }
    }
    const ro = rayHit(OCT, f), ri = RI(f), k = best
    const z = section(H[k], HC[k], HI[k], t)
    const r = ri + (ro - ri) * t
    return at(r * Math.cos(f), r * Math.sin(f), z)
  }
  for (let m = 0; m < 16; m++) {
    const f = ((11.25 + 22.5 * m) * Math.PI) / 180
    const base = roofAtAngle(f, TC)
    const foot: V3 = [base[0], base[1], 24]
    const tip: V3 = [base[0], base[1], MAST_TOP]
    // a single straight white post, drawn ~2x real thickness
    tube(trim, foot, tip, 1.9, 1.4, 8, false, false, Math.PI / 8, true)
    tube(trim, tip, [tip[0], tip[1], tip[2] + 3], 1.4, 0.25, 8, false, false, Math.PI / 8, true) // finial
    // its cable fan: four stays from the head straight down to the roof
    // close round its own foot, never reaching a neighbour's fan
    const head: V3 = [tip[0], tip[1], tip[2] - 1.5]
    for (const df of [-0.055, 0.055]) {
      tube(steel, head, roofAtAngle(f + df, 0.24), 0.4, 0.4, 4, false, false, 0, true)
      tube(steel, head, roofAtAngle(f + df, 0.7), 0.4, 0.4, 4, false, false, 0, true)
    }
  }

  // --- The bowl: stands, concourse colonnade, sloping soffit.
  const NB = 48
  const PH = Array.from({ length: NB }, (_, k) => (k / NB) * 2 * Math.PI)
  const bring = (r: (f: number) => number, z: number | ((f: number) => number)) =>
    PH.map((f) => at(r(f) * Math.cos(f), r(f) * Math.sin(f), typeof z === 'number' ? z : z(f)))
  const rField = (f: number) => se(f, 38, 61, 6)
  const rLow = (f: number) => se(f, 48, 92, 3)
  const rWalk = (f: number) => rLow(f) + 2.5
  const rBack = (f: number) => se(f, 95, 113, 3.2)
  const rCol = (f: number) => rBack(f) - 6
  const rWall = (f: number) => rCol(f) - 3.5
  const IN = (q: V3): V3 => [CX - q[0], CY - q[1], 0]
  strip(concrete, bring(rField, 0), bring(rField, 1.6), IN) // pitch wall
  strip(seats, bring(rField, 1.6), bring(rLow, 12), (q) => [CX - q[0], CY - q[1], 80]) // lower tier
  strip(concrete, bring(rLow, 12), bring(rWalk, 12), UP) // walkway
  strip(trim, bring(rWalk, 12), bring(rWalk, 15.5), IN) // box band
  strip(seats, bring(rWalk, 15.5), bring(rBack, 32), (q) => [CX - q[0], CY - q[1], 80]) // upper tier
  strip(concrete, bring(rBack, 32), bring((f) => rBack(f) + 0.8, 32), UP) // parapet top
  strip(concrete, bring((f) => rBack(f) + 0.8, 30.5), bring((f) => rBack(f) + 0.8, 32), OUT2) // back face
  strip(concrete, bring(rCol, 28.3), bring((f) => rBack(f) + 0.8, 30.5), (q) => [q[0] - CX, q[1] - CY, -60]) // soffit
  // Three open concourse levels: slab edges and tops over the shaded
  // concourse behind, the deck below.
  for (const z of [14.5, 21, 27.5]) {
    strip(concrete, bring(rCol, z - 1.1), bring(rCol, z + 0.8), OUT2)
    strip(concrete, bring(rWall, z + 0.8), bring(rCol, z + 0.8), UP)
    strip(concrete, bring(rCol, z - 1.1), bring(rWall, z - 1.1), DOWN)
  }
  strip(steel, bring(rWall, 8), bring(rWall, 27.5), OUT2) // the shaded concourse behind the columns (grey concrete in shadow)
  // The colonnade: one white column per ring sample, 1.8 m square.
  for (const f of PH) {
    const r = rCol(f) + 0.2
    const c: V3 = at(r * Math.cos(f), r * Math.sin(f), 8)
    tube(trim, c, [c[0], c[1], 26.7], 1.1, 1.1, 4, false, false, f + Math.PI / 4)
  }

  // --- The deck (podium): OSM outline at 8 m, its dark lower storey.
  function OUT2(q: V3): V3 { return [q[0] - CX, q[1] - CY, 0] }
  const rDeck = (f: number) => rayHit(DECK_OSM, f)
  strip(concrete, bring(rWall, 8), bring((f) => rDeck(f) - 0.5, 8), UP)
  strip(concrete, bring((f) => rDeck(f) - 0.5, 8), bring(rDeck, 7.4), OUT2)
  strip(concrete, bring(rDeck, 5.6), bring(rDeck, 7.4), OUT2)
  strip(steel, bring((f) => rDeck(f) - 1.2, 0), bring((f) => rDeck(f) - 1.2, 5.6), OUT2) // recessed glazed storey
  strip(concrete, bring((f) => rDeck(f) - 1.2, 5.6), bring(rDeck, 5.6), DOWN)
  for (const b of BLOBS) prism(concrete, concrete, b.map(([x, y]) => [CX + x, CY + y] as [number, number]), 0, b.length === 4 ? 8 : 10.5)

  const glow = (_p: V3, n: V3) => (n[2] < -0.3 ? 0.95 : 0.7)
  return [
    { part: membrane, material: { ...finish('swc-membrane', 0xf2f0ea), floodlight: glow } },
    { part: trim, material: PALETTE.trim },
    { part: concrete, material: finish('swc-concrete', 0xc9c7c1) },
    // the open concourses behind the colonnade are lit at night (to2, kpop)
    { part: steel, material: { ...finish('swc-steel', 0x787a7c), floodlight: (p: V3, n: V3) => (p[2] < 28 && Math.abs(n[2]) < 0.3 ? 0.8 : 0) } },
    { part: seats, material: finish('swc-seats', 0x6f6264) },
    { part: glass, material: { name: 'glass', color: 0x9fc4da, roughness: 0.24, opacity: 0.4, doubleSided: true } },
  ]
}

if (import.meta.main) await save('seoul-world-cup-stadium', 'Seoul World Cup Stadium', [37.5683503, 126.8972922], BEARING, build() as any, 6500)
