/**
 * Seoul Olympic Stadium (서울올림픽주경기장, Jamsil Sports Complex, Songpa-gu;
 * architect Kim Swoo-geun, completed 29 September 1984): original
 * procedural geometry, CC0-1.0.
 * bun generators/seoul-olympic-stadium.ts
 *
 * Map frame: x east, y north, z up, metres. Anchor = area centroid of OSM
 * relation/20348235 (building=stadium, wikidata Q392086; outer ways
 * 1490290949 and 1490290950, inner way/1490290951), lng 127.0727668, lat
 * 37.5158310. Bearing 355.6: the long axis of the OSM inner ring (the
 * arena floor round the track, 175.6 deg), so +y runs along the track. The
 * bowl is drawn symmetric about C = (3.3, 3.8) in this frame, the middle of
 * the OSM outer and inner rings' extents.
 *
 * Identity, in order: the nearly round drum of tall cream piers that swell
 * outward towards the top like the shoulder of a Joseon white porcelain
 * jar ("조선백자의 곡선미", ko.wikipedia), carrying straight on as the ribs
 * of the blue-grey canopy over the stands; the canopy's white inner edge,
 * which sweeps up over the long sides and dips at the ends; the oval of
 * two-tier stands round the track; the Olympic rings on the south-south-
 * west front.
 *
 * Evidence
 *  - Plan (OSM, measured in this frame): the outer ring is nearly round,
 *    half 131.6 (x) by 134.9 (y), drawn as a superellipse with exponent
 *    2.1; the inner ring (arena floor and track) half 89.4 by 113.1, drawn
 *    with exponent 2.5. So the stands are ~42 m deep on the long sides and
 *    ~22 m at the ends, as the photos show.
 *  - Piers: 48, counted from the aerial "complex" (24 across the near half).
 *  - Heights: no published height was found. ESTIMATED from the photos,
 *    scaled to the OSM plan: the pier tops 29 m at the ends rising to 36 m
 *    over the long sides (fromball, complex); the canopy's inner edge 30 m
 *    at the ends rising to 46 m over the long sides (choe: the edge sweeps
 *    up from the end to the middle of the side; fromball: the far edge
 *    stands well above the near drum). The canopy reaches in to half 97 x
 *    118 m (~31 m deep on the sides, ~14 m at the ends), over the upper
 *    tier and the box band: its opening spans about two-thirds of the drum's
 *    width in complex. Lower tier to 11 m, box band to 15 m, upper tier back
 *    23-30 m: estimated from choe. Facade bands (glazed base to 6 m, ribbed
 *    cladding, a cream spandrel beam, the glazed band under the canopy) from
 *    fromball and complex. The Olympic rings ~29 m across, centred about
 *    17 m up on the front facing compass 195, scaled from fromball (they
 *    span about 1.3 pier bays).
 *  - Elevation 0: the track is at the level of the surrounding plazas;
 *    the concourse is reached by broad steps (complex). The 2018 remodelling
 *    plan lowers the ground by 1.5 m (ko.wikipedia); not drawn.
 *  - Photos (all EVIDENCE):
 *    - complex: Seoul Institute, "Seoul Sports Complex.jpg", Wikimedia
 *      Commons, CC BY 4.0; high view from the south: plan, canopy, piers,
 *      rings, steps. https://commons.wikimedia.org/wiki/File:Seoul_Sports_Complex.jpg
 *    - fromball: Christophe95, "View of the Seoul Sports Complex from the
 *      Jamsil Baseball Stadium.jpg", Wikimedia Commons, CC BY-SA 4.0; level,
 *      from the south-west: piers, ribbed cladding, rings, the far edge
 *      rising. https://commons.wikimedia.org/wiki/File:View_of_the_Seoul_Sports_Complex_from_the_Jamsil_Baseball_Stadium.jpg
 *    - toward: Danleo, "Toward Seoul Olympic Stadium.jpg", Wikimedia
 *      Commons, CC BY 2.5; level: the piers' outward swell.
 *      https://commons.wikimedia.org/wiki/File:Toward_Seoul_Olympic_Stadium.jpg
 *    - choe: 최광모 (Choe Kwangmo), "2014-04-18 15.08.40 종합운동장.jpg",
 *      Wikimedia Commons, CC0; inside: the edge's sweep, the two tiers.
 *      https://commons.wikimedia.org/wiki/File:2014-04-18_15.08.40_%EC%A2%85%ED%95%A9%EC%9A%B4%EB%8F%99%EC%9E%A5.jpg
 *    - cc0: Jeong seolah, "Seoul Jamsil Main Stadium.jpg", Wikimedia
 *      Commons, CC0; inside: the canopy's ribs and lit edge.
 *      https://commons.wikimedia.org/wiki/File:Seoul_Jamsil_Main_Stadium.jpg
 *    - cs04 MCFC795, "蚕室 04.jpg", Wikimedia Commons, CC BY-SA 4.0; night,
 *      the floodlights along the canopy edge.
 *      https://commons.wikimedia.org/wiki/File:%E8%9A%95%E5%AE%A4_04.jpg
 *  - Published: en/ko.wikipedia "Seoul Olympic Stadium" (Kim Swoo-geun;
 *    1984; two tiers; field 105 x 70 m; 400 m track; the white-porcelain
 *    curve; the 2018 remodelling plan).
 *  No look-only sources. No commercial imagery. No lidar, NAIP or map
 *  terrain here (Mapterhorn has no z15 tiles over Seoul): the terrain could
 *  not be checked.
 *
 * Invented or simplified: each tier is raked in four broad steps (the real
 *  rows are many and fine), the lower tier blue and the upper tier the
 *  faded grey of the seats in choe; the canopy is the dark slate blue-grey
 *  of the aerial (complex); the ribbed
 *  cladding between the piers is one flat band; the canopy is one sheet
 *  between 48 bold ribs (the real one has many more, finer); the Olympic
 *  rings are drawn in one colour (the slate window material, so they read
 *  dark on the pale drum and glow at night), since the five colours would
 *  each need a material; the remodelling under
 *  way since 2023 (sky deck, fewer seats) is not drawn: this is the stadium
 *  as built. Night: the canopy edge's floodlights are `lamp` beads; the
 *  glazed band under the canopy is `window`; the piers carry _FLOODLIGHT.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { save } from './chi-aon-center'
import { strip, tube, face, se, beam, vsub, vadd, vmul, UP, DOWN } from './seoul-world-cup-stadium'

const BEARING = 355.6
const CX = 3.3, CY = 3.8
const N = 56 // ring samples
const NP = 48 // piers and ribs
const PH = Array.from({ length: N }, (_, k) => (k / N) * 2 * Math.PI)

const rOut = (f: number) => se(f, 131.6, 134.9, 2.1)
const rIn = (f: number) => se(f, 89.4, 113.1, 2.5)
const rCan = (f: number) => se(f, 97, 118, 2.3) // canopy inner edge
/** 1 over the middle of the long sides (x), 0 at the ends (y). */
const side = (f: number) => Math.cos(f) ** 2
const H_PIER = (f: number) => 29 + 7 * side(f)
const H_EDGE = (f: number) => 30 + 16 * Math.pow(side(f), 0.8)

/** The model polar angle of a compass bearing. */
const polar = (compass: number) => ((90 - (compass - BEARING)) * Math.PI) / 180

function build() {
  const piers = new Part(), cladding = new Part(), canopy = new Part(), glazing = new Part(), seats = new Part(), lamps = new Part()
  const trim = piers // the edge beam, box band and rings share the piers' cream
  const at = (r: number, f: number, z: number): V3 => [CX + r * Math.cos(f), CY + r * Math.sin(f), z]
  const ring = (r: (f: number) => number, z: (f: number) => number) => PH.map((f) => at(r(f), f, z(f)))
  const c = (z: number) => () => z
  const OUTW = (q: V3): V3 => [q[0] - CX, q[1] - CY, 0]
  const INW = (q: V3): V3 => [CX - q[0], CY - q[1], 0]

  // --- The drum: a recessed glazed base, ribbed cladding, the glazed band
  // under the canopy. The wall stands 2.5 m inside the piers' outer line.
  const rW = (f: number) => rOut(f) - 3.2
  strip(glazing, ring((f) => rW(f) - 1.5, c(0)), ring((f) => rW(f) - 1.5, c(6)), OUTW)
  strip(cladding, ring((f) => rW(f) - 1.5, c(6)), ring(rW, c(6)), DOWN)
  strip(cladding, ring(rW, c(6)), ring(rW, (f) => H_PIER(f) - 10.5), OUTW)
  // the cream spandrel beam tying the piers, standing 0.6 m proud
  strip(piers, ring(rW, (f) => H_PIER(f) - 10.5), ring((f) => rW(f) + 0.6, (f) => H_PIER(f) - 10.5), DOWN)
  strip(piers, ring((f) => rW(f) + 0.6, (f) => H_PIER(f) - 10.5), ring((f) => rW(f) + 0.6, (f) => H_PIER(f) - 8.3), OUTW)
  strip(piers, ring((f) => rW(f) + 0.6, (f) => H_PIER(f) - 8.3), ring(rW, (f) => H_PIER(f) - 8.3), UP)
  strip(glazing, ring(rW, (f) => H_PIER(f) - 8.3), ring(rW, (f) => H_PIER(f) - 3.6), OUTW)
  strip(piers, ring(rW, (f) => H_PIER(f) - 3.6), ring(rW, (f) => H_PIER(f) - 2), OUTW)

  // --- The canopy: from the drum's top in to the white edge, rising inward.
  const zCan = (f: number, t: number) => H_PIER(f) - 1 + (H_EDGE(f) - H_PIER(f) + 1) * Math.pow(t, 1.3)
  const rC = (f: number, t: number) => rW(f) + (rCan(f) - rW(f)) * t
  const cring = (t: number, dz = 0) => ring((f) => rC(f, t), (f) => zCan(f, t) - dz)
  for (const [t0, t1] of [[0, 0.5], [0.5, 1]]) {
    strip(canopy, cring(t0), cring(t1), UP)
    strip(canopy, cring(t0, 1.2), cring(t1, 1.2), DOWN)
  }
  strip(cladding, ring(rW, (f) => H_PIER(f) - 2), cring(0, 1.2), OUTW) // the drum's top meets the canopy
  strip(glazing, cring(0, 1.2), cring(0), OUTW)
  // The white edge beam: 2.6 m deep, 1.6 m wide, its face sweeping up.
  {
    const e = (dr: number, dz: number) => ring((f) => rCan(f) - dr, (f) => H_EDGE(f) + dz)
    strip(trim, e(0, -2.6), e(0, 0.5), (q) => vadd(INW(q), [0, 0, 0]))
    strip(trim, e(0, 0.5), e(-1.6, 0.5), UP)
    strip(trim, e(-1.6, -2.6), e(0, -2.6), DOWN)
    strip(trim, cring(1, 1.2), e(-1.6, -2.6), DOWN)
    // Floodlights along the edge's soffit, every other rib.
    for (let k = 0; k < NP; k += 2) {
      const f = ((k + 0.5) / NP) * 2 * Math.PI
      const p = at(rCan(f) - 0.4, f, H_EDGE(f) - 3.3)
      tube(lamps, vadd(p, [0, 0, 0.7]), p, 0.75, 0.75, 4, true, false, f + Math.PI / 4)
    }
  }

  // --- Piers: tall fins that swell outward towards the top and carry on as
  // the canopy's ribs, 2.2 m wide, 2.6 m deep.
  for (let k = 0; k < NP; k++) {
    const f = (k / NP) * 2 * Math.PI
    const rw = rW(f), hp = H_PIER(f)
    const path: V3[] = [
      at(rw + 0.8, f, 0.2),
      at(rw + 1.6, f, hp * 0.6),
      at(rw + 3.6, f, hp + 0.4),
      at(rC(f, 0.45), f, zCan(f, 0.45) + 1.0),
      at(rC(f, 0.985), f, zCan(f, 0.985) + 0.9),
    ]
    // The fin: 2.6 m deep (radial) by 2.2 m wide; the rib: 1.4 m wide, 1.6 m deep.
    beam(piers, path.slice(0, 3), 3.6, 3.4, [-Math.sin(f), Math.cos(f), 0])
    beam(piers, path.slice(2), 1.4, 1.6, [0, 0, 1])
  }

  // --- Stands: low wall, lower tier, walkway, box band, upper tier.
  const IN2 = (q: V3): V3 => [CX - q[0], CY - q[1], 60]
  const rMid = (f: number) => rIn(f) + (rW(f) - 4 - rIn(f)) * 0.45
  const rUp = (f: number) => rMid(f) + 3
  const zBack = (f: number) => H_PIER(f) - 6
  // Each tier is raked in four broad steps (tread and riser) so it reads
  // as seating sloping down to the track, sampled at 48 directions.
  const PS = Array.from({ length: 48 }, (_, k) => (k / 48) * 2 * Math.PI)
  const sring = (r: (f: number) => number, z: (f: number) => number) => PS.map((f) => at(r(f), f, z(f)))
  function tier(p: Part, r0: (f: number) => number, z0: (f: number) => number, r1: (f: number) => number, z1: (f: number) => number, n = 4) {
    for (let i = 0; i < n; i++) {
      const ra = (f: number) => r0(f) + ((r1(f) - r0(f)) * i) / n, rb = (f: number) => r0(f) + ((r1(f) - r0(f)) * (i + 1)) / n
      const za = (f: number) => z0(f) + ((z1(f) - z0(f)) * i) / n, zb = (f: number) => z0(f) + ((z1(f) - z0(f)) * (i + 1)) / n
      strip(p, sring(ra, za), sring(ra, zb), INW) // riser
      strip(p, sring(ra, zb), sring(rb, zb), UP) // tread
    }
  }
  strip(cladding, sring(rIn, c(0)), sring(rIn, c(1.4)), INW)
  tier(seats, rIn, c(1.4), rMid, c(11)) // lower tier: blue (choe)
  strip(cladding, sring(rMid, c(11)), sring(rUp, c(11)), UP)
  strip(trim, sring(rUp, c(11)), sring(rUp, c(15)), INW)
  tier(cladding, rUp, c(15), (f) => rW(f) - 2, zBack) // upper tier: faded grey seats (choe)
  strip(cladding, sring((f) => rW(f) - 2, zBack), sring(rW, zBack), UP)

  // --- The Olympic rings on the front facing compass 195 (complex, fromball).
  {
    const f = polar(195)
    const nrm: V3 = [Math.cos(f), Math.sin(f), 0], tan: V3 = [-Math.sin(f), Math.cos(f), 0]
    const base = at(rOut(f) + 0.9, f, 0)
    const R = 4.4, w = 1.0
    const centres: [number, number][] = [[-9.7, 19.5], [0, 19.5], [9.7, 19.5], [-4.85, 15.1], [4.85, 15.1]]
    for (const [u, z] of centres) {
      const S = 12
      const P = (a: number, r: number, o: number): V3 => vadd(vadd(base, vmul(tan, u + r * Math.cos(a))), vadd(vmul(nrm, o), [0, 0, z + r * Math.sin(a)]))
      for (let i = 0; i < S; i++) {
        const a0 = (i / S) * 2 * Math.PI, a1 = ((i + 1) / S) * 2 * Math.PI
        face(glazing, [P(a0, R - w / 2, 0.5), P(a1, R - w / 2, 0.5), P(a1, R + w / 2, 0.5), P(a0, R + w / 2, 0.5)], nrm)
        face(glazing, [P(a0, R + w / 2, 0), P(a1, R + w / 2, 0), P(a1, R + w / 2, 0.5), P(a0, R + w / 2, 0.5)], vsub(P((a0 + a1) / 2, 1, 0), P(0, 0, 0)))
      }
    }
  }

  const floodPiers = (_p: V3, n: V3) => (n[2] > 0.7 ? 0.2 : 0.75)
  return [
    { part: piers, material: { ...finish('oly-piers', 0xece6da), floodlight: floodPiers } },
    { part: cladding, material: finish('oly-cladding', 0xc9c6bf) },
    { part: canopy, material: finish('oly-canopy', 0x66778a) },
    { part: glazing, material: PALETTE.window },
    { part: seats, material: finish('oly-seats', 0x6f8db0) },
    { part: lamps, material: { name: 'lamp', color: 0x9aa0a6, roughness: 0.5 } },
  ]
}

if (import.meta.main) await save('seoul-olympic-stadium', 'Seoul Olympic Stadium', [37.515831, 127.0727668], BEARING, build() as any, 6500)
