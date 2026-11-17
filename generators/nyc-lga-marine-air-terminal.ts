/**
 * Marine Air Terminal, LaGuardia Airport, Queens — procedural, CC0-1.0, no textures.
 * bun generators/nyc-lga-marine-air-terminal.ts
 *
 * Map frame: x = model east, y = model north, z up, metres. Placed at
 * bearing −8°, the axis of the entrance pavilion (OSM's pavilion front runs
 * 8° off east–west; the lidar puts the pavilion's centre block on the same
 * x as the drum's centre, so the building is symmetric about that axis).
 * Anchor: area centroid of the OSM outline way/284852174.
 *
 * Identifying features (from the photos): the round two-storey drum of buff
 * brick, its ground storey a little wider than the upper one, with a
 * projecting ledge between them; the dark-brown brick window bands of both
 * storeys; the band of light-blue tile with yellow flying fish under the
 * drum's parapet; the tall entrance pavilion on the landside (south) with a
 * deep, stepped dark-brick frame round a tall window, lower flanks carrying
 * fish panels, and a curved canopy across its foot; the low single-storey
 * wings either side of the airside (north); the raised inner drum over the
 * rotunda with its skylight.
 *
 * Evidence
 * - OSM way/284852174 (one outline, the whole building, height 13.8,
 *   Delano & Aldrich 1940, wikidata Q6764005). No building:parts.
 * - Lidar: USGS 3DEP NY_NewYorkCity, flown 2017, 0.5 m grid, heights above
 *   the local apron/road (2.9 m NAVD88). Circles fitted to the tier edges:
 *   upper storey r 19.6 m centred (−5.0, 0.7) in this frame; inner drum
 *   r 13.0 m on the same centre; the ground storey reaches r ≈ 21.6 m
 *   (OSM's ring is r 22 m, ~1 m to the north). Measured heights: ground
 *   storey and wings 4.4 m; upper storey parapet 8.2 m; inner drum and the
 *   pavilion's centre block 11.2 m; pavilion flanks 8.2 m; canopy 3.4 m,
 *   2.8 m deep; skylight dome to ~12.4 m. Pavilion centre block 9 m wide,
 *   flanks 3 m each, front face at y −25.5 (OSM traces it 2 m further in).
 *   (work/nyc-lga-marine-air-terminal/fit.py, rays.py)
 * - NAIP (USGS) aerial: the plan (round drum, inner circle and dome, the two
 *   wings at 45° to the axis on the airside, the pavilion strip running in
 *   to the inner drum), roofs a muted reddish brown.
 * - Published: 1939–40, Delano & Aldrich; Art Deco; the frieze of flying
 *   fish in blue and yellow terracotta round the drum; NHL / NRHP 82003397;
 *   NYC landmark 1980 (Wikipedia "Marine Air Terminal").
 * - Photos (Wikimedia Commons, daylight):
 *   https://commons.wikimedia.org/wiki/File:Marine_Air_Terminal_Nov_2025_17.jpg
 *     (pavilion from the south; Epicgenius, CC BY-SA 4.0)
 *   https://commons.wikimedia.org/wiki/File:Marine_Air_Terminal_Nov_2025_01.jpg
 *     (drum and pavilion from the south-west; Epicgenius, CC BY-SA 4.0)
 *   https://commons.wikimedia.org/wiki/File:Marine_Air_Terminal_Nov_2025_04.jpg
 *     (the drum's two storeys, ledge and frieze; Epicgenius, CC BY-SA 4.0)
 *   https://commons.wikimedia.org/wiki/File:Marine_Air_Terminal_Nov_2025_05.jpg
 *     (a single-storey wing; Epicgenius, CC BY-SA 4.0)
 *   https://commons.wikimedia.org/wiki/File:Marine_Air_Terminal_Nov_2025_10.jpg
 *     (the drum from the east; Epicgenius, CC BY-SA 4.0)
 *   https://commons.wikimedia.org/wiki/File:Marine_Air_Terminal_Nov_2025_13.jpg
 *     (the drum meeting the pavilion; Epicgenius, CC BY-SA 4.0)
 *   https://commons.wikimedia.org/wiki/File:Marine_Air_Terminal,_LaGuardia,_corner.jpg
 *     (a fish panel close up; karla kaulfuss, CC BY 2.0)
 *   https://commons.wikimedia.org/wiki/File:Marine_Air_Terminal,_LaGuardia,_facade.jpg
 *     (the ledge and window bands; karla kaulfuss, CC BY 2.0)
 *
 * Estimated from the photos: the bands up each storey (buff socle, dark
 * window band, buff band, ledge; buff base, window band, frieze, parapet),
 * the window rhythm (one bay per 3.1 m facet of the drum), the frieze's
 * depth (drawn 1.1 m, deeper than the real ~0.8 m so it reads at
 * phone size) and the fish (two per facet, simplified: a body, a forked
 * tail and one swept wing; the real ones sit in dark-blue ovals, left out).
 * The pavilion's recess depth (1.2 m, two steps) and window size.
 * Invented: the inner drum's walls (plain buff; no photo shows them close),
 * the east vestibule's facade.
 * Left out: the "MARINE AIR TERMINAL" letters over the canopy, flagpoles,
 * rooftop masts and plant.
 */
import { Part, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import { type XY, capPoly, finishModel, unit, quadN, area } from './nyc-570-lexington'
import { band } from './nyc-city-hall'

const buff = new Part(), brown = new Part(), trim = new Part(), win = new Part(), blue = new Part(), fishP = new Part()

// --- Plan (model frame, bearing −8°) ---
const C: XY = [-5.0, 0.7]
const R_GROUND = 21.6, R_UPPER = 19.6, R_INNER = 13.0
const N = 40 // facets round the drum
const PHASE = -Math.PI / 2 + Math.PI / N // a facet centred on the axis at the south
const H_GROUND = 4.4, H_UPPER = 8.2, H_INNER = 11.2

// OSM way/284852174 in this frame: the two airside wings and the east vestibule.
const WING_W: XY[] = [[-25.6, 10.4], [-35.3, 20.1], [-23.7, 31.6], [-14.1, 21.9]]
const WING_E: XY[] = [[3.1, 21.8], [14.6, 10.3], [24.4, 20.1], [20.2, 23.7], [16.7, 28.0], [12.9, 31.6]]
const VEST: XY[] = [[14.7, -6.5], [18.3, -8.5], [19.2, -3.9], [17.9, -4.5], [15.8, -2.9]]
// The entrance pavilion (lidar): centre block and flanks, front faces.
const PX = C[0], P_HALF = 4.5, FLANK = 3.0
const P_FRONT = -25.5, F_FRONT = -25.0

function inside(pt: XY, poly: XY[]) {
  let hit = false
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const a = poly[i], b = poly[j]
    if ((a[1] > pt[1]) !== (b[1] > pt[1]) && pt[0] < ((b[0] - a[0]) * (pt[1] - a[1])) / (b[1] - a[1]) + a[0]) hit = !hit
  }
  return hit
}
const pavRect: XY[] = [[PX - P_HALF - FLANK, P_FRONT], [PX + P_HALF + FLANK, P_FRONT], [PX + P_HALF + FLANK, -8], [PX - P_HALF - FLANK, -8]]
const groundBlocked = (p: XY) => [WING_W, WING_E, VEST, pavRect].some((poly) => inside(p, poly))
const upperBlocked = (p: XY) => inside(p, pavRect)

// --- Drum kit: faceted rings with smooth radial normals ---
const ang = (k: number) => PHASE + (k * 2 * Math.PI) / N
const P = (r: number, a: number, z: number): V3 => [C[0] + r * Math.cos(a), C[1] + r * Math.sin(a), z]
const rad = (a: number, nz = 0): V3 => unit([Math.cos(a), Math.sin(a), nz])

/** A ring of wall from z0 to z1 at radius r, facets k where keep(k). */
function ringWall(p: Part, r: number, z0: number, z1: number, keep: (k: number) => boolean = () => true) {
  for (let k = 0; k < N; k++) {
    if (!keep(k)) continue
    const a0 = ang(k), a1 = ang(k + 1)
    quadN(p, P(r, a0, z0), P(r, a1, z0), P(r, a1, z1), P(r, a0, z1), [rad(a0), rad(a1), rad(a1), rad(a0)])
  }
}
/** A flat annulus (or disc, r0 = 0) at height z, facing up. */
function annulus(p: Part, r0: number, r1: number, z: number) {
  for (let k = 0; k < N; k++) {
    const a0 = ang(k), a1 = ang(k + 1)
    if (r0 < 1e-6) p.tri([C[0], C[1], z], P(r1, a0, z), P(r1, a1, z))
    else p.quad(P(r0, a0, z), P(r1, a0, z), P(r1, a1, z), P(r0, a1, z))
  }
}
/** A projecting lip: out from r by d between z0 and z1 (front, top and underside). */
function lip(p: Part, r: number, d: number, z0: number, z1: number, keep: (k: number) => boolean = () => true) {
  for (let k = 0; k < N; k++) {
    if (!keep(k)) continue
    const a0 = ang(k), a1 = ang(k + 1), R = r + d
    quadN(p, P(R, a0, z0), P(R, a1, z0), P(R, a1, z1), P(R, a0, z1), [rad(a0), rad(a1), rad(a1), rad(a0)])
    p.quad(P(R, a0, z1), P(R, a1, z1), P(r, a1, z1), P(r, a0, z1))
    p.quad(P(r, a0, z0), P(r, a1, z0), P(R, a1, z0), P(R, a0, z0))
  }
}
/** A rounded coping on top of a ring wall: up and in by `b`. */
function coping(p: Part, r: number, z: number, b = 0.35) {
  for (let k = 0; k < N; k++) {
    const a0 = ang(k), a1 = ang(k + 1)
    quadN(p, P(r, a0, z - b), P(r, a1, z - b), P(r - b, a1, z), P(r - b, a0, z), [rad(a0, 0.4), rad(a1, 0.4), [0, 0, 1], [0, 0, 1]])
  }
}
/** A point on facet k's plane at fraction t along it, height z, d proud. */
function onFacet(r: number, k: number, t: number, z: number, d: number): V3 {
  const a0 = ang(k), a1 = ang(k + 1)
  const A: XY = [C[0] + r * Math.cos(a0), C[1] + r * Math.sin(a0)], B: XY = [C[0] + r * Math.cos(a1), C[1] + r * Math.sin(a1)]
  const am = (a0 + a1) / 2
  return [A[0] + (B[0] - A[0]) * t + Math.cos(am) * d, A[1] + (B[1] - A[1]) * t + Math.sin(am) * d, z]
}
const facetLen = (r: number) => 2 * r * Math.sin(Math.PI / N)
const facetMid = (r: number, k: number): XY => { const am = (ang(k) + ang(k + 1)) / 2; return [C[0] + r * Math.cos(am), C[1] + r * Math.sin(am)] }

/** A flat panel on facet k, centred at fraction tc, width w (m), z0..z1. */
function facetPanel(p: Part, r: number, k: number, tc: number, w: number, z0: number, z1: number, d = 0.05) {
  const L = facetLen(r), t0 = tc - w / 2 / L, t1 = tc + w / 2 / L
  p.quad(onFacet(r, k, t0, z0, d), onFacet(r, k, t1, z0, d), onFacet(r, k, t1, z1, d), onFacet(r, k, t0, z1, d))
}

// --- A flying fish, in a wall's own (s, z) coordinates, swimming towards +s ---
type Wall2 = (s: number, z: number) => V3
const FISH: { body: [number, number][]; tail: [number, number][]; wing: [number, number][] } = {
  // unit fish 1 m long, centred; from the photos: a slim body, forked tail, one wing swept up and back
  body: [[0.5, 0.02], [0.3, 0.11], [-0.05, 0.12], [-0.32, 0.05], [-0.32, -0.04], [-0.05, -0.1], [0.3, -0.08]],
  tail: [[-0.3, 0.0], [-0.52, 0.17], [-0.42, 0.0], [-0.52, -0.15]],
  wing: [[0.18, 0.08], [-0.02, 0.1], [-0.36, 0.46], [-0.18, 0.44]],
}
function fish(p: Part, at: Wall2, s: number, z: number, size: number) {
  const poly = (pts: [number, number][]) => {
    const v = pts.map(([u, w]) => at(s + u * size, z + w * size * 1.3))
    for (let i = 1; i < v.length - 1; i++) p.tri(v[0], v[i], v[i + 1])
  }
  poly(FISH.body); poly([FISH.tail[0], FISH.tail[1], FISH.tail[2]]); poly([FISH.tail[0], FISH.tail[2], FISH.tail[3]]); poly(FISH.wing)
}

// --- The ground storey: buff socle, dark window band, buff band, ledge, buff parapet ---
const G = { socle: 0.8, bandTop: 3.0, ledge0: 3.45, ledge1: 3.75 }
ringWall(buff, R_GROUND, 0, G.socle)
ringWall(brown, R_GROUND, G.socle, G.bandTop)
ringWall(buff, R_GROUND, G.bandTop, H_GROUND - 0.3)
lip(trim, R_GROUND, 0.3, G.ledge0, G.ledge1)
coping(trim, R_GROUND, H_GROUND, 0.3)
annulus(brown, R_UPPER, R_GROUND - 0.3, H_GROUND - 0.02)
for (let k = 0; k < N; k++) {
  if (groundBlocked(facetMid(R_GROUND + 0.4, k))) continue
  facetPanel(win, R_GROUND, k, 0.5, 2.2, G.socle + 0.35, G.bandTop - 0.25)
}

// --- The upper storey: buff base, window band, buff, the frieze, buff parapet ---
const U = { band0: 5.3, band1: 6.75, fr0: 6.85, fr1: 7.95 }
ringWall(buff, R_UPPER, H_GROUND - 0.05, U.band0)
ringWall(brown, R_UPPER, U.band0, U.band1)
ringWall(buff, R_UPPER, U.band1, U.fr0)
ringWall(blue, R_UPPER, U.fr0, U.fr1)
ringWall(buff, R_UPPER, U.fr1, H_UPPER - 0.3)
coping(trim, R_UPPER, H_UPPER, 0.3)
annulus(brown, R_INNER, R_UPPER - 0.3, H_UPPER - 0.02)
for (let k = 0; k < N; k++) {
  if (upperBlocked(facetMid(R_UPPER + 0.4, k))) continue
  facetPanel(win, R_UPPER, k, 0.5, 2.1, U.band0 + 0.12, U.band1 - 0.12)
  const L = facetLen(R_UPPER)
  for (const t of [0.25, 0.75]) fish(fishP, (s, z) => onFacet(R_UPPER, k, s / L, z, 0.04), t * L, (U.fr0 + U.fr1) / 2 - 0.12, 1.35)
}

// --- The inner drum over the rotunda and its skylight dome ---
ringWall(buff, R_INNER, H_UPPER - 0.05, H_INNER - 0.3)
coping(trim, R_INNER, H_INNER, 0.3)
annulus(brown, 3.9, R_INNER - 0.3, H_INNER - 0.02)
{
  // curb and a low dome, smooth
  const n = 20, rings: [number, number][] = [[3.9, H_INNER - 0.02], [3.9, H_INNER + 0.35], [3.5, H_INNER + 0.4], [3.1, H_INNER + 0.85], [2.2, H_INNER + 1.3], [0.01, H_INNER + 1.5]]
  for (let i = 0; i < n; i++) {
    const a0 = (i / n) * 2 * Math.PI, a1 = ((i + 1) / n) * 2 * Math.PI
    for (let j = 0; j < rings.length - 1; j++) {
      const [r0, z0] = rings[j], [r1, z1] = rings[j + 1]
      const nrm = (a: number, jj: number): V3 => jj === 0 ? rad(a) : unit([Math.cos(a) * 0.6, Math.sin(a) * 0.6, 1 - 0.15 * (rings.length - 1 - jj)])
      const q = (r: number, a: number, z: number): V3 => [C[0] + r * Math.cos(a), C[1] + r * Math.sin(a), z]
      quadN(trim, q(r0, a0, z0), q(r0, a1, z0), q(r1, a1, z1), q(r1, a0, z1), [nrm(a0, j), nrm(a1, j), nrm(a1, j + 1), nrm(a0, j + 1)])
    }
  }
}

// --- Walls of a straight-sided block in the same bands ---
type Band = { p: Part; z0: number; z1: number }
function wallBands(a: XY, b: XY, bands: Band[]) {
  for (const { p, z0, z1 } of bands) p.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
}
/** Window panels along a wall a→b (counter-clockwise order, faces out). */
function windows(a: XY, b: XY, pitch: number, w: number, z0: number, z1: number, margin = 0.8) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  if (L < 2.5) return
  const ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L, nx = uy, ny = -ux
  const n = Math.max(1, Math.round((L - 2 * margin) / pitch)), step = (L - 2 * margin) / n
  const v = (s: number, z: number): V3 => [a[0] + ux * s + nx * 0.05, a[1] + uy * s + ny * 0.05, z]
  for (let i = 0; i < n; i++) {
    const c = margin + step * (i + 0.5), hw = Math.min(w, step * 0.75) / 2
    win.quad(v(c - hw, z0), v(c + hw, z0), v(c + hw, z1), v(c - hw, z1))
  }
}
const inDrum = (p: XY, r: number) => Math.hypot(p[0] - C[0], p[1] - C[1]) < r

// --- The low wings and the east vestibule: one storey, same bands as the drum's ground storey ---
for (const ring0 of [WING_W, WING_E, VEST]) {
  const ring = area(ring0) < 0 ? ring0.slice().reverse() : ring0
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    const m: XY = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
    if (inDrum(m, R_GROUND + 0.5)) continue // the side against the drum
    wallBands(a, b, [{ p: buff, z0: 0, z1: G.socle }, { p: brown, z0: G.socle, z1: G.bandTop }, { p: buff, z0: G.bandTop, z1: H_GROUND - 0.25 }])
    windows(a, b, 3.6, 2.6, G.socle + 0.35, G.bandTop - 0.25)
  }
  band(trim, ring, G.ledge0, G.ledge1, 0.3)
  band(trim, ring, H_GROUND - 0.25, H_GROUND, 0.06)
  capPoly(brown, ring, H_GROUND - 0.03)
}

// --- The entrance pavilion ---
{
  const x0 = PX - P_HALF, x1 = PX + P_HALF, yb = -11.3
  // Flanks: buff, 8.2 m, fish panels at the frieze's height on the front and outer sides.
  for (const side of [-1, 1]) {
    const fx0 = side < 0 ? x0 - FLANK : x1, fx1 = side < 0 ? x0 : x1 + FLANK
    const yBack = C[1] - Math.sqrt(R_UPPER * R_UPPER - (side < 0 ? fx0 - C[0] : fx1 - C[0]) ** 2) + 0.5
    const front: [XY, XY] = [[fx0, F_FRONT], [fx1, F_FRONT]]
    const outer: [XY, XY] = side < 0 ? [[fx0, yBack], [fx0, F_FRONT]] : [[fx1, F_FRONT], [fx1, yBack]]
    for (const [a, b] of [front, outer]) {
      wallBands(a, b, [{ p: buff, z0: 0, z1: U.fr0 }, { p: blue, z0: U.fr0, z1: U.fr1 }, { p: buff, z0: U.fr1, z1: H_UPPER - 0.3 }])
      const L = Math.hypot(b[0] - a[0], b[1] - a[1]), ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L
      const at: Wall2 = (s, z) => [a[0] + ux * s + uy * 0.04, a[1] + uy * s - ux * 0.04, z]
      const nf = Math.max(1, Math.round(L / 1.6))
      for (let i = 0; i < nf; i++) fish(fishP, at, (L * (i + 0.5)) / nf, (U.fr0 + U.fr1) / 2 - 0.12, 1.35)
    }
    // small windows low on the outer side, a door-height window on the front under the canopy
    windows(outer[0], outer[1], 3.0, 1.4, 1.0, 2.6, 1.0)
    windows(front[0], front[1], 3.0, 1.2, 0.9, 2.4, 0.6)
    const ring: XY[] = [[fx0, F_FRONT], [fx1, F_FRONT], [fx1, yBack], [fx0, yBack]]
    band(trim, ring, H_UPPER - 0.3, H_UPPER, 0.06)
    capPoly(brown, ring, H_UPPER - 0.03)
  }
  // Centre block: buff, 11.2 m, its front cut by a deep stepped dark-brick frame round a tall window.
  const zF0 = 3.6, zF1 = 10.3, wO = 3.4, wM = 2.7, wI = 2.0, d1 = 0.6, d2 = 1.2
  const yf = P_FRONT
  // sides
  wallBands([x0, yb], [x0, yf], [{ p: buff, z0: H_UPPER - 0.05, z1: H_INNER - 0.3 }])
  wallBands([x1, yf], [x1, yb], [{ p: buff, z0: H_UPPER - 0.05, z1: H_INNER - 0.3 }])
  // the 0.5 m step where the centre block stands proud of the flanks
  wallBands([x0, F_FRONT], [x0, yf], [{ p: buff, z0: 0, z1: H_UPPER }])
  wallBands([x1, yf], [x1, F_FRONT], [{ p: buff, z0: 0, z1: H_UPPER }])
  // the front face around the opening
  const F = (x: number, z: number, d = 0): V3 => [x, yf + d, z]
  buff.quad(F(x0, 0), F(PX - wO, 0), F(PX - wO, H_INNER - 0.3), F(x0, H_INNER - 0.3))
  buff.quad(F(PX + wO, 0), F(x1, 0), F(x1, H_INNER - 0.3), F(PX + wO, H_INNER - 0.3))
  buff.quad(F(PX - wO, zF1), F(PX + wO, zF1), F(PX + wO, H_INNER - 0.3), F(PX - wO, H_INNER - 0.3))
  buff.quad(F(PX - wO, 0), F(PX + wO, 0), F(PX + wO, zF0), F(PX - wO, zF0))
  // first step: reveal walls of depth d1 in dark brick, then a dark-brick face with a smaller opening
  const reveal = (w: number, za: number, zb: number, dA: number, dB: number) => {
    brown.quad(F(PX - w, za, dA), F(PX - w, za, dB), F(PX - w, zb, dB), F(PX - w, zb, dA)) // left jamb faces +x
    brown.quad(F(PX + w, za, dB), F(PX + w, za, dA), F(PX + w, zb, dA), F(PX + w, zb, dB)) // right jamb faces −x
    brown.quad(F(PX - w, zb, dB), F(PX + w, zb, dB), F(PX + w, zb, dA), F(PX - w, zb, dA)) // soffit faces down
  }
  reveal(wO, zF0, zF1, 0, d1)
  brown.quad(F(PX - wO, zF0, 0), F(PX + wO, zF0, 0), F(PX + wO, zF0, d1), F(PX - wO, zF0, d1)) // outer sill
  const zM1 = zF1 - 0.5
  brown.quad(F(PX - wO, zF0, d1), F(PX - wM, zF0, d1), F(PX - wM, zF1, d1), F(PX - wO, zF1, d1))
  brown.quad(F(PX + wM, zF0, d1), F(PX + wO, zF0, d1), F(PX + wO, zF1, d1), F(PX + wM, zF1, d1))
  brown.quad(F(PX - wM, zM1, d1), F(PX + wM, zM1, d1), F(PX + wM, zF1, d1), F(PX - wM, zF1, d1))
  reveal(wM, zF0, zM1, d1, d2)
  brown.quad(F(PX - wM, zF0, d2), F(PX + wM, zF0, d2), F(PX + wM, zM1, d2), F(PX - wM, zM1, d2))
  brown.quad(F(PX - wM, zF0, d1), F(PX + wM, zF0, d1), F(PX + wM, zF0, d2), F(PX - wM, zF0, d2)) // sill
  win.quad(F(PX - wI, zF0 + 0.3, d2 - 0.05), F(PX + wI, zF0 + 0.3, d2 - 0.05), F(PX + wI, zM1 - 0.5, d2 - 0.05), F(PX - wI, zM1 - 0.5, d2 - 0.05))
  // doors under the canopy
  win.quad(F(PX - 2.6, 0.2, -0.05), F(PX + 2.6, 0.2, -0.05), F(PX + 2.6, 2.9, -0.05), F(PX - 2.6, 2.9, -0.05))
  // the centre block's top: coping and roof, running back to the inner drum
  const top: XY[] = [[x0, yf], [x1, yf], [x1, yb], [x0, yb]]
  band(trim, top, H_INNER - 0.3, H_INNER, 0.06)
  capPoly(brown, top, H_INNER - 0.03)
  // The canopy: a thin slab with rounded front corners, across the pavilion's foot.
  const cy0 = F_FRONT, cy1 = P_FRONT - 2.8, cx0 = x0 - FLANK + 0.6, cx1 = x1 + FLANK - 0.6, rr = 1.4
  const outline: XY[] = [[cx0, cy0]]
  for (let i = 0; i <= 5; i++) { const t = Math.PI + (i / 5) * (Math.PI / 2); outline.push([cx0 + rr + rr * Math.cos(t), cy1 + rr + rr * Math.sin(t)]) }
  for (let i = 0; i <= 5; i++) { const t = -Math.PI / 2 + (i / 5) * (Math.PI / 2); outline.push([cx1 - rr + rr * Math.cos(t), cy1 + rr + rr * Math.sin(t)]) }
  outline.push([cx1, cy0])
  const zc0 = 3.0, zc1 = 3.45
  for (let i = 0; i < outline.length - 1; i++) {
    const a = outline[i], b = outline[i + 1]
    const n0 = unit([b[1] - a[1], a[0] - b[0], 0])
    quadN(trim, [a[0], a[1], zc0], [b[0], b[1], zc0], [b[0], b[1], zc1], [a[0], a[1], zc1], [n0, n0, n0, n0])
  }
  capPoly(trim, outline, zc1)
  capPoly(trim, outline, zc0, false)
}

finishModel('Marine Air Terminal', 'nyc-lga-marine-air-terminal', [
  { part: buff, material: finish('mat-buff-brick', 0xe2c9a3) },
  { part: brown, material: finish('mat-brown-brick', 0x9a7f6d) },
  { part: trim, material: PALETTE.trim },
  { part: win, material: PALETTE.window },
  { part: blue, material: finish('mat-frieze-blue', 0x86a6d4) },
  { part: fishP, material: finish('mat-fish-yellow', 0xe8c552) },
], { bearing: -8, osm: 'way/284852174', height: 12.7 }, 5000)
