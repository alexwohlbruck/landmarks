/**
 * Magna Plaza (former Hoofdpostkantoor), Nieuwezijds Voorburgwal, Amsterdam
 * — procedural, CC0-1.0, no textures.
 * bun generators/amsterdam-magna-plaza.ts
 *
 * C.H. Peters' neo-Gothic main post office of 1895–1899, a shopping centre
 * since 1992: red brick banded with white stone, a steep slate roof with
 * rows of brick dormer gables, a big corner tower with an open lantern on
 * the Raadhuisstraat/Spuistraat corner, a smaller turret on the
 * Raadhuisstraat/Voorburgwal corner, and two slender towers flanking the
 * central gable of the long Voorburgwal front.
 *
 * Map frame: x = model east, y = model north, z up, metres. Placed at
 * bearing 17.2°, the long Voorburgwal front, which faces +x. Anchor: area
 * centroid of the OSM outline way/57861220.
 *
 * Evidence
 * - OSM way/57861220 (outline: 33 m × 80 m, the Voorburgwal front with an
 *   18 m central projection, the chamfered south-west corner under the big
 *   tower, the Raadhuisstraat front running a little askew). No parts and
 *   no heights in OSM.
 * - Published: 1895–1899, architect Cornelis Hendrik Peters, neo-Gothic
 *   with Renaissance detail; converted to a mall 1990–1992 (OSM start_date
 *   1899, nl.wikipedia "Magna Plaza"). No published heights were found.
 * - Photos (Wikimedia Commons, EVIDENCE):
 *   - C messier, "Magna Plaza 2665.jpg", CC BY-SA 4.0 — the Raadhuisstraat
 *     and Voorburgwal fronts from the south-east, all three tower types.
 *     https://commons.wikimedia.org/wiki/File:Magna_Plaza_2665.jpg
 *   - 11joop, "Voormalig Hoofdpostkantoor N.Z.Voorburgwal Amsterdam.JPG",
 *     CC BY-SA 3.0 NL — the same corner in sun.
 *     https://commons.wikimedia.org/wiki/File:Voormalig_Hoofdpostkantoor_N.Z.Voorburgwal_Amsterdam.JPG
 *   - Gerard Dukker (RCE), "Exterieur OVERZICHT, (MAGNA PLAZA) - 20285821"
 *     and "- 20285822", CC BY-SA 4.0 — the south front, and the big tower
 *     over the chamfered corner from above.
 *     https://commons.wikimedia.org/wiki/File:Exterieur_OVERZICHT,_(MAGNA_PLAZA)_-_Amsterdam_-_20285821_-_RCE.jpg
 *     https://commons.wikimedia.org/wiki/File:Exterieur_OVERZICHT,_(MAGNA_PLAZA)_-_Amsterdam_-_20285822_-_RCE.jpg
 *   - Txllxt TxllxT, "Amsterdam - Raadhuisstraat - View ENE on Former
 *     Hoofdpostkantoor 1895-99 by C.H.Peters.jpg", CC BY-SA 4.0.
 *     https://commons.wikimedia.org/wiki/File:Amsterdam_-_Raadhuisstraat_-_View_ENE_on_Former_Hoofdpostkantoor_1895-99_by_C.H.Peters.jpg
 *   - Chris Booms (RCE), "Torens met peervormige torenbekroningen van het
 *     voormalige Hoofdpostkantoor ... - 20528589", CC BY-SA 4.0 — the twin
 *     towers' stages from the palace roof.
 *     https://commons.wikimedia.org/wiki/File:Torens_met_peervormige_torenbekroningen_van_het_voormalige_Hoofdpostkantoor,_gezien_vanaf_het_dak_van_het_Koninklijk_Paleis_-_Amsterdam_-_20528589_-_RCE.jpg
 *
 * Estimated (messier's photo, scaled by storey heights to a 17.5 m
 * balustrade): ground floor 6 m, two upper storeys of 5 m, the slate roof
 * to 25.5 m with dormer gables to 23 m. The big corner tower, photo-scaled
 * stage by stage on messier's view against the 17.5 m cornice (its vane
 * reads 41–44 m; drawn at the top of that range, since every photo shows it
 * as the building's highest point): a chamfered 8 m brick shaft to 25.5 m,
 * clear of the roof, corner pinnacles, a short lead stage to 27.5 m, an open
 * lantern of eight posts to 33 m, the pear bulb to 37.2 m, spire 42.2 m,
 * vane about 44.6 m. The twin towers (scaled the same way at their distance:
 * 40.5–42.5 m): 4 m square to 30.5 m, lanterns and bulbs to 39 m, vanes
 * about 41 m. The corner turret to 33 m. Bay counts per front from the photos (7 on the Raadhuisstraat,
 * about 17 on the Voorburgwal); the Spuistraat and north fronts are drawn
 * to the same rhythm without photos.
 *
 * Colour: bright red brick with white stone bands (messier, 11joop) pulled
 * to the palette; blue-grey slate; lead-grey tower crowns; gilt vanes.
 *
 * Night: the Voorburgwal and corner fronts are floodlit; the brick and the
 * stone bands carry a floodlight wash.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { finishModel, prism, circle, type XY, spire, insetRing, capPoly } from './nyc-570-lexington'
import { rectPanel, archPanel, band, block, dome } from './nyc-city-hall'

const brick = new Part(), trim = new Part(), win = new Part(), roof = new Part(), lead = new Part(), gilt = new Part()

// ---------------------------------------------------------------- plan
const ring: XY[] = [
  [16.8, -34.4], [16.8, -6.9], [17.9, -6.9], [17.9, 11.1], [16.6, 11.1], [16.4, 37.4],
  [-15.7, 39.3], [-16.1, -22.0], [-16.2, -27.5], [-19.0, -32.0], [-13.0, -40.5], [3.3, -37.0],
]
const EAVE = 17.5, ROOF = 25.5
const STOREYS: [number, number][] = [[1.4, 5.4], [7.0, 10.9], [12.2, 16.0]]

prism({ wall: brick, win: null, roof: null, ring, z0: 0, z1: EAVE, facade: null, bevel: 0.3 })
// The white stone banding: a plinth, a band at each floor and window
// head, the balustraded cornice.
band(trim, ring, 0, 0.8, 0.12)
for (const z of [3.3, 6.0, 6.6, 8.9, 11.4, 11.9, 14.1, 16.4]) band(trim, ring, z, z + 0.32, 0.08)
band(trim, ring, EAVE - 0.6, EAVE + 0.9, 0.3)

/** Edge frame: s along the edge a→b, d outward, z up. */
function frame(a: XY, b: XY) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L
  return { L, ux, uy, nx: uy, ny: -ux, at: (s: number, d: number, z: number): V3 => [a[0] + ux * s + uy * d, a[1] + uy * s - ux * d, z] }
}

// Windows: round-headed on all three storeys, one per bay.
for (let i = 0; i < ring.length; i++) {
  const a = ring[i], b = ring[(i + 1) % ring.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
  if (L < 3) continue
  const n = Math.max(1, Math.round((L - 1.6) / 4.3)), m = (L - n * 4.3) / 2 + 2.15
  for (let k = 0; k < n; k++) {
    const s = m + k * 4.3
    STOREYS.forEach(([z0, z1], j) => archPanel(win, a, b, s, j === 0 ? 2.5 : 2.1, z0, z1, 0.05, 8))
  }
}

// ---------------------------------------------------------------- roof
// A steep slate roof: from the cornice up and in 6 m to a flat ridge deck.
{
  const top = insetRing(ring, 6.5)
  const lo = insetRing(ring, 0.2)
  for (let i = 0; i < ring.length; i++) {
    const j = (i + 1) % ring.length
    roof.quad([lo[i][0], lo[i][1], EAVE + 0.8], [lo[j][0], lo[j][1], EAVE + 0.8], [top[j][0], top[j][1], ROOF], [top[i][0], top[i][1], ROOF])
  }
  capPoly(roof, top, ROOF)
}
// Dormer gables: brick, stone-coped, on the long fronts and the Raadhuisstraat.
function dormer(a: XY, b: XY, s: number, w = 3.4, h0 = EAVE + 0.8, h1 = 21.0, apex = 23.6, depth = 3.2) {
  const f = frame(a, b), d0 = -0.2
  const P = (ss: number, d: number, z: number) => f.at(s + ss, d, z)
  // front wall and gable
  brick.quad(P(-w / 2, d0, h0), P(w / 2, d0, h0), P(w / 2, d0, h1), P(-w / 2, d0, h1))
  brick.tri(P(-w / 2, d0, h1), P(w / 2, d0, h1), P(0, d0, apex))
  // cheeks
  brick.quad(P(w / 2, d0, h0), P(w / 2, d0 - depth, h0), P(w / 2, d0 - depth, h1), P(w / 2, d0, h1))
  brick.quad(P(-w / 2, d0 - depth, h0), P(-w / 2, d0, h0), P(-w / 2, d0, h1), P(-w / 2, d0 - depth, h1))
  // small saddle roof
  roof.quad(P(w / 2 + 0.15, d0 + 0.1, h1), P(w / 2 + 0.15, d0 - depth, h1), P(0, d0 - depth, apex), P(0, d0 + 0.1, apex))
  roof.quad(P(-w / 2 - 0.15, d0 - depth, h1), P(-w / 2 - 0.15, d0 + 0.1, h1), P(0, d0 + 0.1, apex), P(0, d0 - depth, apex))
  // stone coping and a pinnacle on the apex
  block(trim, ...bb(P(-0.25, d0 - 0.25, apex - 0.2), P(0.25, d0 + 0.25, apex - 0.2)), apex - 0.2, apex + 1.1)
  archPanel(win, P(-w / 2, d0, 0).slice(0, 2) as XY, P(w / 2, d0, 0).slice(0, 2) as XY, w / 2, 1.4, h0 + 0.4, h1 + 0.6, 0.05, 6)
}
const bb = (p: V3, q: V3): [number, number, number, number] => [Math.min(p[0], q[0]), Math.min(p[1], q[1]), Math.max(p[0], q[0]), Math.max(p[1], q[1])]
{
  const E0: XY = [16.8, -34.4], E1: XY = [16.8, -6.9]
  for (const s of [5.5, 14.0, 22.5]) dormer(E0, E1, s)
  const E2: XY = [16.6, 11.1], E3: XY = [16.4, 37.4]
  for (const s of [4.5, 13.0, 21.5]) dormer(E2, E3, s)
  const S0: XY = [-13.0, -40.5], S1: XY = [3.3, -37.0]
  for (const s of [6.5, 13.0]) dormer(S0, S1, s)
  dormer([3.3, -37.0], [16.8, -34.4], 6.5)
  const W0: XY = [-15.7, 39.3], W1: XY = [-16.1, -22.0]
  for (const s of [7, 16, 25, 34, 43, 52]) dormer(W0, W1, s)
  const N0: XY = [16.4, 37.4], N1: XY = [-15.7, 39.3]
  for (const s of [8, 16, 24]) dormer(N0, N1, s)
}

// ---------------------------------------------------------------- the central gable on the Voorburgwal
{
  const a: XY = [17.9, -6.9], b: XY = [17.9, 11.1], f = frame(a, b)
  const P = (s: number, d: number, z: number) => f.at(s, d, z)
  const L = f.L, top = 31.0, d1 = -4.5
  brick.quad(P(2, 0, EAVE), P(L - 2, 0, EAVE), P(L - 2, 0, 24), P(2, 0, 24))
  brick.tri(P(2, 0, 24), P(L - 2, 0, 24), P(L / 2, 0, top))
  // a ridge roof back into the main roof
  roof.quad(P(L - 1.8, 0.1, 24), P(L - 1.8, d1 - 3, 24), P(L / 2, d1 - 3, top), P(L / 2, 0.1, top))
  roof.quad(P(1.8, d1 - 3, 24), P(1.8, 0.1, 24), P(L / 2, 0.1, top), P(L / 2, d1 - 3, top))
  roof.tri(P(L - 1.8, d1 - 3, 24), P(1.8, d1 - 3, 24), P(L / 2, d1 - 3, top))
  brick.quad(P(2, d1 - 3, EAVE), P(2, 0, EAVE), P(2, 0, 24), P(2, d1 - 3, 24))
  brick.quad(P(L - 2, 0, EAVE), P(L - 2, d1 - 3, EAVE), P(L - 2, d1 - 3, 24), P(L - 2, 0, 24))
  band(trim, [[17.9 - 7.5, -4.9], [17.9, -4.9], [17.9, 9.1], [17.9 - 7.5, 9.1]], 23.7, 24.3, 0.12)
  archPanel(win, a, b, L / 2, 4.0, EAVE + 1.2, 25.0, 0.06, 10)
  archPanel(win, a, b, L / 2, 1.6, 26.0, 28.6, 0.06, 6)
  block(trim, ...bb(P(L / 2 - 0.35, -0.35, 0), P(L / 2 + 0.35, 0.35, 0)), top - 0.3, top + 1.8)
}

// ---------------------------------------------------------------- towers
/** An open octagonal lantern with dark arches, a pear-shaped bulb, a spire and a gilt vane. */
function crown(cx: number, cy: number, r: number, z0: number, zl: number, bulb: number, tip: number, vane: number) {
  const oct = circle(cx, cy, r, 8, Math.PI / 8)
  prism({ wall: lead, win: null, roof: null, ring: oct, z0, z1: zl, facade: null, bevel: 0.05 })
  for (let i = 0; i < 8; i++) {
    const a = oct[i], b = oct[(i + 1) % 8], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    archPanel(win, a, b, L / 2, L * 0.62, z0 + 0.5, zl - 0.4, 0.05, 6)
  }
  prism({ wall: trim, win: null, roof: lead, ring: circle(cx, cy, r + 0.35, 8, Math.PI / 8), z0: zl, z1: zl + 0.45, facade: null, bevel: 0.08 })
  // pear bulb: swelling then pinching in
  const prof: [number, number][] = [[zl + 0.45, r * 0.85], [zl + 0.45 + (bulb - zl) * 0.45, r * 1.0], [bulb, r * 0.45], [bulb + 0.4, r * 0.3]]
  const n = 12
  const rings: V3[][] = prof.map(([z, rr]) => circle(cx, cy, rr, n).map(([x, y]) => [x, y, z] as V3))
  lead.loft(rings)
  spire(lead, circle(cx, cy, r * 0.3, n), bulb + 0.4, [cx, cy, tip], true)
  block(gilt, cx - 0.1, cy - 0.1, cx + 0.1, cy + 0.1, tip - 0.4, vane)
  dome(gilt, cx, cy, 0.32, tip + 0.3, 0.4, 8, 2)
  block(gilt, cx - 0.06, cy - 0.06, cx + 0.06, cy + 1.0, vane - 1.3, vane - 0.4) // the flag
}

// The twin towers at the ends of the central projection.
for (const ty of [-5.2, 9.4]) {
  const cx = 16.0, s = 2.0
  prism({ wall: brick, win: null, roof: null, ring: [[cx - s, ty - s], [cx + s, ty - s], [cx + s, ty + s], [cx - s, ty + s]], z0: 0, z1: 30.5, facade: null, bevel: 0.2 })
  for (const z of [EAVE - 0.6, 22.5, 27.0]) band(trim, [[cx - s, ty - s], [cx + s, ty - s], [cx + s, ty + s], [cx - s, ty + s]], z, z + 0.6, 0.12)
  // slit windows on each face of the shaft above the roof
  const sq: XY[] = [[cx - s, ty - s], [cx + s, ty - s], [cx + s, ty + s], [cx - s, ty + s]]
  for (let i = 0; i < 4; i++) { archPanel(win, sq[i], sq[(i + 1) % 4], s, 1.1, 19.0, 22.0, 0.05, 6); archPanel(win, sq[i], sq[(i + 1) % 4], s, 1.3, 23.5, 26.6, 0.05, 6) }
  // the gallery and crown
  prism({ wall: trim, win: null, roof: lead, ring: [[cx - s - 0.3, ty - s - 0.3], [cx + s + 0.3, ty - s - 0.3], [cx + s + 0.3, ty + s + 0.3], [cx - s - 0.3, ty + s + 0.3]], z0: 30.5, z1: 31.3, facade: null, bevel: 0.1 })
  crown(cx, ty, 1.6, 31.3, 34.2, 36.6, 39.0, 41.2)
}

// The corner turret on Raadhuisstraat × Voorburgwal.
{
  const cx = 15.6, cy = -33.4
  prism({ wall: brick, win: null, roof: null, ring: circle(cx, cy, 2.0, 8, Math.PI / 8), z0: 8, z1: 25.0, facade: null, bevel: 0.08 })
  band(trim, circle(cx, cy, 2.0, 8, Math.PI / 8), 21.6, 22.2, 0.12)
  prism({ wall: trim, win: null, roof: lead, ring: circle(cx, cy, 2.3, 8, Math.PI / 8), z0: 25.0, z1: 25.6, facade: null, bevel: 0.08 })
  const oct = circle(cx, cy, 2.0, 8, Math.PI / 8)
  for (let i = 0; i < 8; i++) archPanel(win, oct[i], oct[(i + 1) % 8], 0.77, 0.9, 19.5, 23.8, 0.05, 6)
  spire(lead, circle(cx, cy, 1.9, 8, Math.PI / 8), 25.6, [cx, cy, 33.0], true)
  block(gilt, cx - 0.08, cy - 0.08, cx + 0.08, cy + 0.08, 32.5, 35.5)
}

// The big corner tower over the chamfered Raadhuisstraat × Spuistraat
// corner, the tallest thing on the building: a chamfered-square brick shaft
// rising clear of the roof, a short lead stage, an open octagonal lantern
// (real openings between eight posts), the pear bulb, the spire and vane.
{
  const a: XY = [-19.0, -32.0], b: XY = [-13.0, -40.5]
  const f = frame(a, b), mid = f.at(f.L / 2, 0, 0), c: XY = [mid[0] - f.nx * 3.6, mid[1] - f.ny * 3.6]
  const half = 4.0, ch = 1.0
  // chamfered square in the corner's own (u along the chamfer, v outward) axes, counter-clockwise
  const loc: [number, number][] = [[-half + ch, -half], [half - ch, -half], [half, -half + ch], [half, half - ch], [half - ch, half], [-half + ch, half], [-half, half - ch], [-half, -half + ch]]
  const toXY = (u: number, v: number): XY => [c[0] + u * f.ux + v * f.nx, c[1] + u * f.uy + v * f.ny]
  const shaft = loc.map(([u, v]) => toXY(u, v)).reverse() // (u, n) is a left-handed basis
  const SH = 25.5
  prism({ wall: brick, win: null, roof: null, ring: shaft, z0: 0, z1: SH, facade: null, bevel: 0.15 })
  for (const z of [6.0, 11.4, 16.4]) band(trim, shaft, z, z + 0.4, 0.1)
  band(trim, shaft, SH - 0.9, SH + 0.3, 0.35)
  // windows on the four main faces: two storeys below the cornice, two tall
  // arched belfry-like lights above the roof
  for (let i = 0; i < 8; i += 2) {
    const p = shaft[i], q = shaft[(i + 1) % 8], L = Math.hypot(q[0] - p[0], q[1] - p[1])
    archPanel(win, p, q, L / 2, 1.6, 6.8, 10.6, 0.05, 6)
    archPanel(win, p, q, L / 2, 1.6, 12.2, 16.0, 0.05, 6)
    archPanel(win, p, q, L / 2 - 1.15, 1.2, 19.6, 24.2, 0.05, 6)
    archPanel(win, p, q, L / 2 + 1.15, 1.2, 19.6, 24.2, 0.05, 6)
  }
  // corner pinnacles at the top of the shaft
  for (let i = 1; i < 8; i += 2) {
    const [x, y] = shaft[i]
    prism({ wall: trim, win: null, roof: null, ring: circle(x, y, 0.4, 6), z0: SH + 0.3, z1: SH + 1.2, facade: null, bevel: 0.05 })
    spire(lead, circle(x, y, 0.45, 6), SH + 1.2, [x, y, SH + 2.8])
  }
  // lead stage: from the shaft up to the lantern's octagon
  const R = 3.0, L0 = SH + 2.0, L1 = L0 + 5.5
  const oct = circle(c[0], c[1], R, 8, Math.PI / 8)
  const inner = shaft.map(([x, y]) => [c[0] + (x - c[0]) * 0.93, c[1] + (y - c[1]) * 0.93] as XY)
  // match the octagon's vertices to the shaft's by angle
  const ang = (p: XY) => Math.atan2(p[1] - c[1], p[0] - c[0])
  const octSorted = inner.map((p) => oct.reduce((best, q) => (Math.abs(Math.atan2(Math.sin(ang(q) - ang(p)), Math.cos(ang(q) - ang(p)))) < Math.abs(Math.atan2(Math.sin(ang(best) - ang(p)), Math.cos(ang(best) - ang(p)))) ? q : best), oct[0]))
  for (let i = 0; i < 8; i++) {
    const j = (i + 1) % 8
    lead.quad([inner[i][0], inner[i][1], SH + 0.3], [inner[j][0], inner[j][1], SH + 0.3], [octSorted[j][0], octSorted[j][1], L0], [octSorted[i][0], octSorted[i][1], L0])
  }
  // lantern floor, eight posts, an entablature ring
  prism({ wall: trim, win: null, roof: trim, ring: circle(c[0], c[1], R + 0.25, 8, Math.PI / 8), z0: L0 - 0.4, z1: L0, facade: null, bevel: 0.05 })
  for (const [x, y] of oct) prism({ wall: lead, win: null, roof: null, ring: circle(x, y, 0.42, 6), z0: L0, z1: L1, facade: null, bevel: 0.05 })
  // a small dark core so the openings read against the sky and the posts against it
  prism({ wall: win, win: null, roof: null, ring: circle(c[0], c[1], 1.1, 8), z0: L0, z1: L1, facade: null, bevel: 0.05 })
  prism({ wall: trim, win: null, roof: lead, ring: circle(c[0], c[1], R + 0.45, 8, Math.PI / 8), z0: L1, z1: L1 + 0.8, facade: null, bevel: 0.1 })
  // pear bulb, spire and vane
  const z0 = L1 + 0.8, bulb = z0 + 3.4
  const prof: [number, number][] = [[z0, R * 0.7], [z0 + 1.3, R * 0.8], [z0 + 2.5, R * 0.5], [bulb, R * 0.2], [bulb + 0.5, R * 0.15]]
  lead.loft(prof.map(([z, rr]) => circle(c[0], c[1], rr, 12).map(([x, y]) => [x, y, z] as V3)))
  const tip = bulb + 5.0, vane = tip + 2.4
  spire(lead, circle(c[0], c[1], R * 0.15, 12), bulb + 0.5, [c[0], c[1], tip], true)
  block(gilt, c[0] - 0.12, c[1] - 0.12, c[0] + 0.12, c[1] + 0.12, tip - 0.5, vane)
  dome(gilt, c[0], c[1], 0.4, tip + 0.4, 0.5, 8, 2)
  block(gilt, c[0] - 0.07, c[1] - 0.07, c[0] + 0.07, c[1] + 1.2, vane - 1.5, vane - 0.4)
  console.log(`big tower: shaft ${SH}, lantern ${L0}-${L1}, bulb top ${bulb}, spire ${tip}, vane ${vane}`)
}

// ---------------------------------------------------------------- write
const lit = (p: V3, n: V3): number => (n[2] > 0.7 ? 0.15 : (n[0] > 0.4 || n[1] < -0.4) ? 1 : 0.45)
finishModel('Magna Plaza', 'amsterdam-magna-plaza', [
  { part: brick, material: { ...finish('magna-brick', 0xc27a63), floodlight: lit } },
  { part: trim, material: { ...PALETTE.trim, floodlight: lit } },
  { part: win, material: PALETTE.window },
  { part: roof, material: finish('magna-slate', 0x8a929b) },
  { part: lead, material: finish('magna-lead', 0x9ea7ae) },
  { part: gilt, material: finish('magna-gilt', 0xd8b25a) },
], { bearing: 17.2, osm: 'way/57861220', height: 44.6 }, 6500)
