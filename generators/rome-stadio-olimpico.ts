/**
 * Stadio Olimpico, Rome (Foro Italico): original procedural geometry,
 * CC0-1.0, no textures.  bun generators/rome-stadio-olimpico.ts
 *
 * The 1953 bowl (Annibale Vitellozzi's completion of the Stadio dei
 * Cipressi), raised and covered for Italia '90 with the tensile roof
 * (engineer Massimo Majowiecki). The Stadio dei Marmi next door (OSM
 * way/23951383) is not part of this model.
 *
 * Writes models/rome-stadio-olimpico.glb (low) and
 * models/rome-stadio-olimpico.detail.glb (from zoom 16: the outer
 * compression ring as a three-chord truss with every diagonal, the
 * radial cable trusses under the membrane, the membrane's tented peaks,
 * the inner tension ring, the stands stepped). Uses the kit in
 * milan-san-siro.ts (same builder).
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 345.5: model
 * +y runs along the pitch (north-north-west), +x across it (towards the
 * Tiber). Anchor = the pitch centre, OSM way/667711166 (104.7 x 68 m,
 * long edges at 345.5 deg), lng 12.4547706, lat 41.9339454; the stadium
 * relation/8365200 is symmetric about it (outer way/117457119 x +-115.9,
 * y +-151.3; inner way/119391961 x +-61.9, y +-97.5).
 *
 * Identity, in order: the white oval roof, a ring of tented PTFE membrane
 * bays on radial cables between an inner tension ring and the outer
 * compression ring; the compression ring itself, a white tubular space
 * truss whose diagonals make the zigzag round the whole stadium; the 16
 * white columns that carry it, with the slanted struts at their heads;
 * the oval concrete bowl under it, its outer wall dark with concourse
 * levels; the blue seats.
 *
 * Evidence
 *  - OSM (measured in this frame): the stands, building=grandstand
 *    way/1239761721-758 (min_height 2, height 20), from the inner outline
 *    to the outer; the outer compression ring, 78 segments
 *    way/1238645972-6049 (24-25 m) on a superellipse x +-118.9, y +-154.4
 *    (exponent ~2.3, fitted to the 16 columns); membrane bays, 78
 *    roof:shape=dome way/1238626858-935 (25-29 m), from the opening x
 *    +-62, y +-97 to x +-106, y +-141; 156 roof:shape=pyramidal parts
 *    way/1238626856-1238636506 (25-32 m) round the outer ring (the
 *    membrane's tented peaks); 16 columns, height=22, way/1238899146-177
 *    (odd/even: shaft and 22-24 m cap) at the angles listed in COLUMNS.
 *  - Heights: OSM as above (stands 20 m, ring 22-25 m, membrane to 29 m,
 *    peaks to 32 m); the ring truss's depth (bottom chord 21 m, top chord
 *    33 m) ESTIMATED from messapi24 and roof, scaled to the 22 m columns;
 *    the membrane falls from 31.5 m at the truss to 24.5 m at the
 *    opening (messapi24). The pitch wall is drawn 3.2 m (OSM's stands
 *    start at 2 m): the map's coarse z13 terrain tilts 2 m across the
 *    pitch and buried the front rows at 2 m.
 *  - Photos (Wikimedia Commons, all EVIDENCE):
 *    - birdseye: Carola.Puglia24, "Olympic Stadium Rome Bird's-eye
 *      view.jpg", CC BY-SA 4.0, from the air: plan, opening, bays.
 *      https://commons.wikimedia.org/wiki/File:Olympic_Stadium_Rome_Bird%27s-eye_view.jpg
 *    - marmi: Messapi, "Stadio Olimpico e Stadio dei Marmi.jpg", CC BY
 *      4.0, from the north (drone): the ring truss, columns, the dark
 *      facade. https://commons.wikimedia.org/wiki/File:Stadio_Olimpico_e_Stadio_dei_Marmi.jpg
 *    - messapi24: Messapi (cropped by Blackcat), "Stadio Olimpico
 *      2024.jpg", CC BY-SA 4.0: the zigzag truss and the tented membrane,
 *      columns, the concourse levels. https://commons.wikimedia.org/wiki/File:Stadio_Olimpico_2024.jpg
 *    - roof: Andrea 93, "Stadio Olimpico roof.jpg", Public domain: the
 *      truss's tubes, a column with its struts, the membrane cones.
 *      https://commons.wikimedia.org/wiki/File:Stadio_Olimpico_roof.jpg
 *    - ildir: ildirettore, "Stadio Olimpico (Roma, ITA).jpg", CC BY 3.0,
 *      inside: blue seats in two tiers, the roof's edge.
 *      https://commons.wikimedia.org/wiki/File:Stadio_Olimpico_(Roma,_ITA).jpg
 *  - Published: en.wikipedia "Stadio Olimpico": 1953, enlarged and roofed
 *    1987-90 for the World Cup; capacity ~70,600.
 *  No lidar or NAIP (outside the US); no commercial imagery.
 *
 * Invented or simplified, and doubts:
 *  - The bowl is two plain rakes with a walkway between, on
 *    superellipses through the OSM outlines; the stands' real section
 *    (lower ring and the 1990 upper extension) is simplified.
 *  - The truss: 78 bays (OSM's segments); the low model draws one panel
 *    per three bays; the detail model draws every bay and adds the inner
 *    bottom chord and its web.
 *  - The four cylindrical stair towers (striped: pale slabs over dark
 *    slots) are in the photos (messapi24, marmi, birdseye) but not in OSM;
 *    they are drawn against the outer wall at the shoulders of the two
 *    ends, 48 deg either side of the long axis, 5 m in radius, up to the
 *    truss: positions and size ESTIMATED from those photos (doubt).
 *  - Rework (lead review 1): the compression ring is a triangular truss
 *    with a broad top band (two top chords 8 m apart, their diagonals
 *    zigzagging in plan) as well as the outer-face zigzag; tented peaks
 *    over the membrane's outer half, one per bay (78) in the low model and
 *    two per bay (156, OSM's count) in the detail model; seats a darker
 *    blue with a grey cross-gangway band through each tier.
 *  - Elevation 0: the pitch is at the level of the plaza on the east
 *    (Tiber) side; the bowl's west side sinks into the foot of Monte
 *    Mario (map terrain rises 5-9 m there).
 *  - Night: the membrane carries _FLOODLIGHT (lit white at night), the
 *    concourse bands are `window`.
 */
import { Part, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import { face, vadd, vlerp, vmul, vsub } from './seoul-world-cup-stadium'
import { annulus, band, bar, cyl, ring, rod3, superellipse, writeLods, type XY } from './milan-san-siro'

const BEARING = 345.5

const S_FRONT = superellipse(62, 97.3, 2.6, 192)
const S_MID = superellipse(88, 123, 2.4, 192)
const S_MID2 = superellipse(90, 125, 2.4, 192)
const S_BACK = superellipse(115.9, 151.3, 2.3, 192)
const S_RING = superellipse(118.9, 154.2, 2.3, 192)

/** The 16 columns (OSM, this frame). */
const COLUMNS: XY[] = [[-115.6, -36.2], [-98.6, -91.9], [-68.5, -129.5], [-20.0, -152.2], [20.3, -152.1], [69.0, -129.6], [98.7, -91.7], [115.7, -36.0], [115.6, 35.5], [98.6, 91.3], [68.7, 129.1], [20.1, 151.7], [-20.3, 151.7], [-69.1, 129.1], [-98.8, 91.1], [-115.7, 35.2]]

const BAYS = 78
const RING_BOT = 21, RING_TOP = 33
const MEM_IN = 24.5, MEM_OUT = 31.8
const TOP_W = 8 // the truss's top band: outer and inner top chords this far apart

function build(detail: boolean) {
  const concrete = new Part(), seats = new Part(), membrane = new Part(), steel = new Part(), win = new Part()
  const N = detail ? 156 : 48 // samples round the bowl; the roof uses 2 per bay
  const phis = Array.from({ length: N }, (_, k) => (k / N) * 2 * Math.PI)
  const IN = (q: V3): V3 => [-q[0], -q[1], 0]
  const OUT = (q: V3): V3 => [q[0], q[1], 0]
  const UP = (): V3 => [0, 0, 1]
  const DOWN = (): V3 => [0, 0, -1]
  const SEAT = (q: V3): V3 => [-q[0], -q[1], 150]

  // --- The bowl.
  band(concrete, ring(S_FRONT, phis, 0), ring(S_FRONT, phis, 3.2), IN)
  band(concrete, ring(S_FRONT, phis, 3.2), ring(S_FRONT, phis, 3.2, 0.8), UP)
  const rake = (a: XY[], b: XY[], z0: number, z1: number, steps: number) => {
    if (!detail) {
      // blue seats with a grey cross-gangway band through each tier (birdseye)
      const A = ring(a, phis, z0), B = ring(b, phis, z1)
      const at = (t: number) => A.map((p, i) => vlerp(p, B[i], t))
      band(seats, A, at(0.46), SEAT)
      band(concrete, at(0.46), at(0.56), SEAT)
      band(seats, at(0.56), B, SEAT)
      return
    }
    const A0 = ring(a, phis, z0), B0 = ring(b, phis, z1)
    for (let s = 0; s < steps; s++) {
      const P = A0.map((p, i) => vlerp(p, B0[i], s / steps)), Q = A0.map((p, i) => vlerp(p, B0[i], (s + 1) / steps))
      const Pr = P.map((p, i) => [p[0], p[1], Q[i][2]] as V3)
      band(seats, P, Pr, IN)
      band(s === Math.floor(steps / 2) ? concrete : seats, Pr, Q, UP)
    }
  }
  rake(S_FRONT, S_MID, 3.2, 10.5, 7)
  band(concrete, ring(S_MID, phis, 10.5), ring(S_MID2, phis, 10.5), UP) // the walkway
  band(concrete, ring(S_MID2, phis, 10.5), ring(S_MID2, phis, 12), IN)
  rake(S_MID2, S_BACK, 12, 20, 7)
  band(concrete, ring(S_BACK, phis, 20), ring(S_BACK, phis, 21.2), IN) // back parapet
  band(concrete, ring(S_BACK, phis, 21.2), ring(S_BACK, phis, 21.2, 1.2), UP)
  // the outer wall: a pale plinth, the dark concourse levels between slabs
  band(concrete, ring(S_BACK, phis, 0, 1.2), ring(S_BACK, phis, 6.5, 1.2), OUT)
  band(win, ring(S_BACK, phis, 6.5), ring(S_BACK, phis, 20), OUT)
  for (const z of [6.5, 11.5, 16]) {
    band(concrete, ring(S_BACK, phis, z, 1.2), ring(S_BACK, phis, z + 1.1, 1.2), OUT)
    band(concrete, ring(S_BACK, phis, z + 1.1, 1.2), ring(S_BACK, phis, z + 1.1), UP)
    if (z > 7 && detail) band(concrete, ring(S_BACK, phis, z), ring(S_BACK, phis, z, 1.2), DOWN)
  }
  band(concrete, ring(S_BACK, phis, 20, 1.2), ring(S_BACK, phis, 21.2, 1.2), OUT)
  if (detail) band(concrete, ring(S_BACK, phis, 20), ring(S_BACK, phis, 20, 1.2), DOWN)

  // --- The roof: membrane bays between radial cables, from the inner
  // tension ring (at the opening) out to the compression ring.
  const RB = BAYS * 2 // samples: even = radial cable, odd = mid-bay
  const rph = Array.from({ length: RB }, (_, k) => (k / RB) * 2 * Math.PI)
  const rIn = ring(S_FRONT, rph, MEM_IN), rOut = ring(S_RING, rph, MEM_OUT, -TOP_W)
  const memAt = (t: number, dz = 0) => rIn.map((p, i) => {
    const q = vlerp(p, rOut[i], t)
    // a shallow sag between the rings, the peaks lifted mid-bay
    const sag = -1.2 * Math.sin(Math.PI * t)
    return vadd(q, [0, 0, sag + dz])
  })
  const TS = detail ? [0, 0.2, 0.4, 0.6, 0.8, 1] : [0, 0.5, 1]
  for (let k = 0; k < TS.length - 1; k++) {
    band(membrane, memAt(TS[k]), memAt(TS[k + 1]), UP)
    if (detail) band(membrane, memAt(TS[k], -0.6), memAt(TS[k + 1], -0.6), DOWN)
  }
  // tented peaks over the membrane's outer half (OSM: 156 pyramidal parts,
  // two per bay): one per bay in the low model, two in the detail model
  {
    const rows = detail ? [[0.52, 0.72], [0.74, 0.94]] : [[0.55, 0.92]]
    for (let i = 1; i < RB; i += 2)
      for (const [t0, t1] of rows) {
        const a0 = memAt(t0)[i - 1], a1 = memAt(t0)[(i + 1) % RB]
        const b0 = memAt(t1)[i - 1], b1 = memAt(t1)[(i + 1) % RB]
        const c = vadd(vmul(vadd(vadd(a0, a1), vadd(b0, b1)), 0.25), [0, 0, detail ? 3 : 4])
        for (const [p, q] of [[a0, a1], [a1, b1], [b1, b0], [b0, a0]] as [V3, V3][]) face(membrane, [p, q, c], [0, 0, 1])
      }
  }
  if (detail) {
    // radial cable trusses under the membrane (every other one drawn): top and bottom cables with struts
    for (let i = 0; i < RB; i += 4) {
      const top = TS.map((t) => memAt(t, -0.7)[i])
      const bot = TS.map((t, k) => vadd(memAt(t)[i], [0, 0, -0.7 - 3.2 * Math.sin(Math.PI * t)]))
      for (let k = 0; k < TS.length - 1; k++) {
        bar(steel, top[k], top[k + 1], 0.35, 0.35, [0, 0, 1], false)
        bar(steel, bot[k], bot[k + 1], 0.35, 0.35, [0, 0, 1], false)
        if (k > 0) bar(steel, bot[k], top[k], 0.3, 0.3, [1, 0, 0], false)
      }
    }
  }
  // the membrane's edge at the opening: the inner tension ring
  if (detail) for (let i = 0; i < RB; i++) {
    const j = (i + 1) % RB
    bar(steel, vadd(rIn[i], [0, 0, -0.4]), vadd(rIn[j], [0, 0, -0.4]), 0.9, 0.9, [0, 0, 1], false)
  }

  // --- The compression ring: a white tubular truss, its diagonals zigzag
  // round the outer face, on 16 columns.
  {
    // a triangular-section truss: an outer bottom chord, and a broad top
    // band of two top chords TOP_W apart whose diagonals zigzag in plan;
    // the outer face's diagonals zigzag too (messapi24, birdseye)
    const bot = ring(S_RING, rph, RING_BOT), botIn = ring(S_RING, rph, RING_BOT + 1.5, -TOP_W)
    const top = ring(S_RING, rph, RING_TOP, -0.5), topIn = ring(S_RING, rph, RING_TOP - 0.6, -TOP_W)
    const st = detail ? 1 : 3
    const R3 = (A: V3, B: V3, r: number) => (detail ? bar(steel, A, B, r * 1.6, r * 1.6, [0, 0, 1], false) : rod3(steel, A, B, r))
    for (let i = 0; i < RB; i += st * 2) {
      const j = (i + st * 2) % RB, m = (i + st) % RB, m2 = (m + st * 2) % RB
      R3(bot[i], bot[j], 0.8) // bottom chord
      R3(top[m], top[m2], 0.95) // outer top chord
      R3(topIn[i], topIn[j], 0.9) // inner top chord
      R3(bot[i], top[m], 0.7) // outer face zigzag
      R3(top[m], bot[j], 0.7)
      R3(topIn[i], top[m], 0.75) // the top band's zigzag, seen from above
      R3(top[m], topIn[j], 0.75)
      if (detail) {
        R3(botIn[i], botIn[j], 0.5)
        R3(botIn[i], topIn[i], 0.4)
        R3(bot[i], botIn[i], 0.35)
        R3(botIn[i], top[m], 0.35)
      }
    }
    // the cap of the bowl's back to the truss: the roof's edge in shade
    // the membrane's underside seen through the truss: in shade
    band(win, ring(S_BACK, rph, 21.2, 1.2), ring(S_RING, rph, MEM_OUT - 0.8, -TOP_W + 0.5), OUT)
    // columns, each with two slanted struts from its head to the top chord
    for (const [cx, cy] of COLUMNS) {
      const f = Math.atan2(cy, cx)
      const at = ring(S_RING, [f], 0)[0]
      cyl(steel, at[0], at[1], detail ? 1.0 : 1.3, 0, RING_BOT, detail ? 12 : 8, false)
      const head: V3 = [at[0], at[1], RING_BOT - 0.4]
      if (detail) bar(steel, vadd(head, [0, 0, -1.8]), vadd(head, [0, 0, 0.6]), 2.6, 2.6, [1, 0, 0], true) // the cap
      for (const df of [-1, 1]) {
        const g = f + (df * 2 * Math.PI) / BAYS
        const tp = ring(S_RING, [g], RING_TOP, -0.5)[0]
        if (detail) bar(steel, head, tp, 1.0, 1.0, [0, 0, 1], false)
        else rod3(steel, head, tp, 0.85)
      }
    }
  }

  // --- The four cylindrical stair towers (photos; not in OSM): striped,
  // pale slabs over dark slots, standing against the outer wall at the
  // shoulders of the two ends, up to the truss.
  for (const f of [90 - 48, 90 + 48, 270 - 48, 270 + 48].map((d) => (d * Math.PI) / 180)) {
    const c = ring(S_BACK, [f], 0, 5.5)[0]
    const TN = detail ? 16 : 12, H = RING_BOT - 0.5, n = detail ? 9 : 6
    for (let k = 0; k < n; k++) {
      const z0 = (H * k) / n, z1 = (H * (k + 1)) / n, zm = z0 + (z1 - z0) * 0.55
      cyl(win, c[0], c[1], 4.6, z0, zm, TN)
      cyl(concrete, c[0], c[1], 5, zm, z1, TN, k === n - 1)
      if (detail) annulus(concrete, c[0], c[1], 4.6, 5, zm, TN, false)
    }
  }

  const glow = (_p: V3, n: V3) => (n[2] < -0.2 ? 0.9 : 0.6)
  return [
    { part: concrete, material: { ...finish('olimpico-concrete', 0xd2cbbd), floodlight: (_p: V3, n: V3) => (Math.abs(n[2]) < 0.4 ? 0.4 : 0.1) } },
    { part: seats, material: finish('olimpico-seats-blue', 0x34497a) },
    { part: membrane, material: { ...finish('olimpico-membrane', 0xf1f0ea), floodlight: glow } },
    { part: steel, material: finish('olimpico-steel', 0xe9eaea) },
    { part: win, material: { ...PALETTE.window, color: 0x5f6870 } },
  ]
}

if (import.meta.main)
  await writeLods('Stadio Olimpico', { bearing: BEARING, elevation: 0, height: 33 }, [
    { file: 'rome-stadio-olimpico.glb', parts: build(false), maxTris: 6500, maxBytes: 250_000 },
    { file: 'rome-stadio-olimpico.detail.glb', parts: build(true), maxTris: 40_000, maxBytes: 1536 * 1024 },
  ])
