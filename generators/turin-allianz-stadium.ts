/**
 * Allianz Stadium (Juventus Stadium), Turin: original procedural geometry,
 * CC0-1.0, no textures.  bun generators/turin-allianz-stadium.ts
 *
 * Built 2009-2011 on the site of the Stadio delle Alpi (architects Gino
 * Zavanella and Hernando Suárez, engineers Francesco Ossola and Massimo
 * Majowiecki, exterior Fabrizio Giugiaro).
 *
 * Writes models/turin-allianz-stadium.glb (low) and
 * models/turin-allianz-stadium.detail.glb (from zoom 16: lattice pylon
 * legs, trussed ring girder and radial roof trusses, more stays, stepped
 * stands). Uses the kit in milan-san-siro.ts (same builder).
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 343.3: model
 * +y runs along the pitch (north-north-west), +x across it. Anchor = the
 * pitch centre, OSM way/119509430 (103.4 x 64.9 m, long edges at 343.3
 * deg), lng 7.6412596, lat 45.1095806; the stadium (relation/1642536) is
 * symmetric about it.
 *
 * z = 0 is the pitch. OSM gives the stadium building min_height=-3, the
 * pitch sunk 3 m below the plaza (the old Delle Alpi bowl's floor was
 * reused, it.wikipedia); `elevation` is -3 on that tag (doubt: no drawing
 * or published field level was found). Heights below are above the pitch,
 * the plaza at z = 3.
 *
 * Identity, in order: the two 86 m white A-frame pylons at the two ends of
 * the stadium, leaning outward, each holding the roof by a fan of
 * forestays to the ring girder round the opening and tied back to a
 * ground anchor by backstays; the white membrane roof, a shallow "wing"
 * vaulted between radial trusses, its rounded edge over the facade; the
 * rounded-rectangle box of white-grey aluminium cladding with the
 * tricolour band under the roof edge; two tiers of pale grey seats.
 *
 * Evidence
 *  - OSM (measured in this frame): stadium relation/1642536 (building=
 *    stadium, height=17, min_height=-3), outer way/172821575 x +-89,
 *    y +-108, its ends rounded (radius ~45 m); inner way/172821574 x
 *    +-43.6, y +-62.5 (the stands' front and the roof opening). Roof
 *    panels way/1250288206-265 (min 21, height 26, roof:shape=round):
 *    vaulted strips ~10 m wide from the opening to the facade. Pylons:
 *    legs way/1249999465/466 and 1249999480/481 (0-75 m), from feet at
 *    (+-19.4, +-118) to the heads way/1249999467 (-0.7, -132.3) and
 *    1249999482 (0.4, 127.7); foot blocks way/1249999475/476/478/479
 *    (2 m); backstay anchors way/1249999474 (y -251..-223) and 1249999477
 *    (y 212..240), 2 m; forestay fans way/1250325578-581 (28-76 m) from
 *    the heads to the opening's ends; the four hanging points
 *    way/1250325582-585 at (+-41.4, +-64.7), 28 m.
 *  - Published (it.wikipedia "Allianz Stadium (Torino)"): two pylons 86 m
 *    tall carrying the roof by stays; PVC membrane roof, partly
 *    translucent, its profile "inspired by aircraft wings"; 7,000
 *    aluminium panels in greys and white; tricolour band; two rings,
 *    gradients 27-30 deg (first) and 30-37 deg (second), stands from 7.5 m
 *    off the pitch; pitch 105 x 68 m; 41,507 seats.
 *  - Heights (estimated): pylon heads at 86 m above the plaza (published,
 *    taken over OSM's 76); facade to 22 m, roof edge band 22-25 m, the
 *    roof's crest 33 m and the opening edge 31 m above the pitch, scaled
 *    from wacko with the pylon as the 86 m ruler (facade top about a
 *    quarter of the pylon) and OSM's 21-26 m roof; tiers from the
 *    published gradients: lower 1-12 m, boxes 12-15 m, upper 15-28 m.
 *  - Photos (Wikimedia Commons, all EVIDENCE):
 *    - colle: Matteo Aresca 05, "Allianz Stadium dal Colle della
 *      Maddalena.jpg", CC BY-SA 4.0, distant view from the east-south-east:
 *      both A-frames, the vaulted roof and its ribs, the tricolour band,
 *      the ring girder. https://commons.wikimedia.org/wiki/File:Allianz_Stadium_dal_Colle_della_Maddalena.jpg
 *    - wacko: Wackotaku, "Allianz stadium in Italy hosting the Nations
 *      League 2021 finals.jpg", CC BY-SA 4.0, the west side at night: the
 *      pylons' lean and backstays, the lit cladding.
 *      https://commons.wikimedia.org/wiki/File:Allianz_stadium_in_Italy_hosting_the_Nations_League_2021_finals.jpg
 *    - ded1/ded2: Валерий Дед, "Turin Juventus Stadium 1.jpg" / "2.jpg",
 *      CC BY 3.0, inside: the ring girder, radial trusses, the far pylon
 *      and its stay fan, the grey-white seats in two tiers.
 *      https://commons.wikimedia.org/wiki/File:Turin_Juventus_Stadium_1.jpg
 *      https://commons.wikimedia.org/wiki/File:Turin_Juventus_Stadium_2.jpg
 *    - forza: forzaq8, "Juventus v Real Madrid, Champions League, Stadium,
 *      Turin, 2013.jpg", CC BY 2.0, inside: tiers and boxes.
 *      https://commons.wikimedia.org/wiki/File:Juventus_v_Real_Madrid,_Champions_League,_Stadium,_Turin,_2013.jpg
 *  No daylight street-level photo of the facade was found under an open
 *  licence (Mapillary was not available); the facade's colours rest on
 *  colle (distant, hazy) and wacko (night). No lidar or commercial imagery.
 *
 * Invented or simplified, and doubts:
 *  - The assignment described the pylons as on the long sides; OSM and
 *    every photo put them at the two ends, so they are drawn there.
 *  - Pylon legs drawn as tapered boxes (low) and three-chord lattices
 *    (detail), 4.5 m wide at the foot; the real legs' section is not
 *    known. Four forestays per pylon (eight in the detail model), drawn
 *    ~0.8 m thick; two backstays per pylon.
 *  - Rework (lead review 1): roof a mid grey with darker radial ribs, the
 *    cladding silver-grey, the full tricolour band (green, white, red). The
 *    glazed boxes and the storey under the plaza use the dark steel grey
 *    (six materials), so they no longer glow at night.
 *  - The cladding's undulating panels are two plain bands; the raised
 *    plaza (relation/9218131) and the buildings under it are the map's.
 *  - Night: the cladding and pylons are floodlit (wacko), the red band
 *    and green stripes glow.
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { face, vadd, vlerp, vmul, vsub } from './seoul-world-cup-stadium'
import { band, bar, ring, rrect, truss, writeLods, type XY } from './milan-san-siro'

const BEARING = 343.3

const R_FRONT = rrect(43.6, 43.6, 62.5, 62.5, 8) // the stands' front / roof opening
const R_PIT = rrect(41.5, 41.5, 60, 60, 7)
const R_L1 = rrect(60, 60, 79, 79, 20)
const R_BOX = rrect(63, 63, 82, 82, 24)
const R_L2 = rrect(85, 85, 104, 104, 40)
const R_FAC = rrect(89, 89, 108, 108, 45)

const PLAZA = 3
const FAC_TOP = 19.5, EDGE_TOP = 25, CREST = 33, OPEN_Z = 31
const HEAD_Z = 86 + PLAZA
const FOOT: XY = [19.4, 118], HEAD: XY = [0, 132]
const HANG: XY = [41.4, 64.7]

function build(detail: boolean) {
  const clad = new Part(), roof = new Part(), steel = new Part(), pylon = new Part(), green = new Part(), neon = new Part()
  const win = steel // glazing and the shaded storey under the plaza read dark grey
  const N = detail ? 144 : 56
  const phis = Array.from({ length: N }, (_, k) => -Math.PI + (k / N) * 2 * Math.PI)
  const IN = (q: V3): V3 => [-q[0], -q[1], 0]
  const OUT = (q: V3): V3 => [q[0], q[1], 0]
  const UP = (): V3 => [0, 0, 1]
  const DOWN = (): V3 => [0, 0, -1]
  const SEAT = (q: V3): V3 => [-q[0], -q[1], 120]
  const seats = clad

  // --- Stands: two tiers with the box level between.
  const rake = (a: XY[], b: XY[], z0: number, z1: number, steps: number) => {
    if (!detail) { band(seats, ring(a, phis, z0), ring(b, phis, z1), SEAT); return }
    const A0 = ring(a, phis, z0), B0 = ring(b, phis, z1)
    for (let s = 0; s < steps; s++) {
      const P = A0.map((p, i) => vlerp(p, B0[i], s / steps)), Q = A0.map((p, i) => vlerp(p, B0[i], (s + 1) / steps))
      const Pr = P.map((p, i) => [p[0], p[1], Q[i][2]] as V3)
      band(seats, P, Pr, IN)
      band(seats, Pr, Q, UP)
    }
  }
  band(clad, ring(R_PIT, phis, 0), ring(R_PIT, phis, 1), IN) // pitch wall
  rake(R_PIT, R_L1, 1, 12, 6)
  band(clad, ring(R_L1, phis, 12), ring(R_BOX, phis, 12), UP)
  band(win, ring(R_BOX, phis, 12), ring(R_BOX, phis, 15), IN) // glazed boxes
  rake(R_BOX, R_L2, 15, 28, 7)
  band(clad, ring(R_L2, phis, 28), ring(R_FAC, phis, 28, -0.6), UP)

  // --- Facade: the cladding box, the red band, the roof's rounded edge.
  band(win, ring(R_FAC, phis, 0, -0.8), ring(R_FAC, phis, PLAZA + 5, -0.8), OUT) // under the raised plaza
  band(clad, ring(R_FAC, phis, PLAZA + 5, -0.8), ring(R_FAC, phis, PLAZA + 5), DOWN)
  band(clad, ring(R_FAC, phis, PLAZA + 5), ring(R_FAC, phis, 14.5), OUT)
  band(clad, ring(R_FAC, phis, 14.5), ring(R_FAC, phis, 14.5, 0.5), DOWN)
  band(clad, ring(R_FAC, phis, 14.5, 0.5), ring(R_FAC, phis, FAC_TOP - 0.7, 0.5), OUT)
  // the tricolour band: green, white, red, bottom to top (colle)
  band(green, ring(R_FAC, phis, FAC_TOP - 0.7, 0.5), ring(R_FAC, phis, FAC_TOP, 0.5), OUT)
  band(pylon, ring(R_FAC, phis, FAC_TOP, 0.5), ring(R_FAC, phis, FAC_TOP + 0.7, 0.5), OUT)
  band(neon, ring(R_FAC, phis, FAC_TOP + 0.7, 0.5), ring(R_FAC, phis, FAC_TOP + 2, 0.5), OUT)
  band(clad, ring(R_FAC, phis, FAC_TOP + 2, 0.5), ring(R_FAC, phis, 22.5, 0.5), OUT)

  // --- Roof: the wing section, vaulted between radial trusses.
  const sect: [number, number][] = [[0, OPEN_Z], [0.45, CREST], [0.8, 32], [0.93, EDGE_TOP + 4], [1, EDGE_TOP]]
  const grow = 1.2 // the edge overhangs the cladding
  const roofRing = (t: number, dz = 0) => {
    let z = sect[sect.length - 1][1]
    for (let i = 1; i < sect.length; i++)
      if (t <= sect[i][0]) { const [s0, h0] = sect[i - 1], [s1, h1] = sect[i]; z = h0 + ((h1 - h0) * (t - s0)) / (s1 - s0); break }
    return ring(R_FRONT, phis, 0).map((p, i) => {
      const q = ring(R_FAC, [phis[i]], 0, grow)[0]
      return [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t, z + dz] as V3
    })
  }
  const vault = (r: V3[], t: number) => r.map((p, i) => (i % 2 && t > 0.03 && t < 0.97 ? vadd(p, [0, 0, 1.3]) : p))
  for (let k = 0; k < sect.length - 1; k++) {
    const t0 = sect[k][0], t1 = sect[k + 1][0]
    band(roof, vault(roofRing(t0), t0), vault(roofRing(t1), t1), UP, true, false)
    band(steel, roofRing(t0, -2.2), roofRing(t1, -2.2), DOWN) // soffit (steel decking and trusses in shade)
  }
  band(roof, roofRing(1, -3.3), roofRing(1), OUT) // the rounded leading edge
  // the radial ribs on the membrane (dark lines in colle): every other valley
  for (let i = 0; i < N; i += detail ? 2 : 4) {
    const path = [0.02, 0.45, 0.8, 0.95].map((t) => vadd(roofRing(t)[i], [0, 0, 0.35]))
    for (let k = 0; k < path.length - 1; k++) bar(steel, path[k], path[k + 1], 0.9, 0.7, [0, 0, 1], false)
  }
  band(steel, roofRing(0, -2.2), roofRing(0), IN) // inner fascia

  // radial trusses under the roof (detail): bottom chord, posts
  if (detail)
    for (let i = 0; i < N; i += 2) {
      const path = [0, 0.2, 0.45, 0.7, 0.93].map((t) => roofRing(t, -2.2)[i])
      for (let k = 0; k < path.length - 1; k++) {
        const a = vadd(path[k], [0, 0, -3 * (1 - path[k][2] / 40)]), b = vadd(path[k + 1], [0, 0, -3 * (1 - path[k + 1][2] / 40)])
        bar(steel, a, b, 0.6, 0.6, [0, 0, 1], false)
        bar(steel, b, path[k + 1], 0.4, 0.4, [1, 0, 0], false)
        bar(steel, a, path[k + 1], 0.35, 0.35, [1, 0, 0], false)
      }
    }

  // --- The ring girder round the opening, hung at its four corners.
  {
    const gz0 = OPEN_Z - 3, gz1 = OPEN_Z + 4
    const pts = ring(R_FRONT, phis, 0, 0.8)
    const n = pts.length
    for (let i = 0; i < n; i += detail ? 1 : 2) {
      const j = (i + (detail ? 1 : 2)) % n
      const a = pts[i], b = pts[j]
      const A = (z: number): V3 => [a[0], a[1], z], B = (z: number): V3 => [b[0], b[1], z]
      if (!detail) {
        bar(pylon, A(gz1), B(gz1), 1.4, 1.4, [0, 0, 1], false)
        bar(pylon, A(gz0), B(gz0), 1.4, 1.4, [0, 0, 1], false)
        if (i % 4 === 0) bar(pylon, A(gz0), A(gz1), 1.0, 1.0, [1, 0, 0], false)
      } else truss(pylon, (t) => vlerp(A(gz1), B(gz1), t), (t) => vlerp(A(gz0), B(gz0), t), 1, 0.9, 0.5, true, [0, 0, 1], i % 2 === 0)
    }
  }

  // --- Pylons: white A-frames leaning outward, with their stays.
  for (const sy of [-1, 1]) {
    const head: V3 = [HEAD[0], sy * HEAD[1], HEAD_Z]
    const feet: V3[] = [[-FOOT[0], sy * FOOT[1], 0], [FOOT[0], sy * FOOT[1], 0]]
    for (const f of feet) {
      // foot block (OSM, 2 m above the plaza)
      const fb: V3 = [f[0], f[1], 0]
      bar(clad, vadd(fb, [0, 0, 0]), vadd(fb, [0, 0, PLAZA + 2]), 6, 5, [0, 1, 0], true)
      const top = vadd(head, vmul(vsub(f, head), 0.03))
      if (!detail) {
        // tapered leg: a box 4.5 m at the foot to 2.2 m at the head, in three lengths
        const seg = 3
        for (let s = 0; s < seg; s++) {
          const a = vlerp(vadd(f, [0, 0, PLAZA + 2]), top, s / seg), b = vlerp(vadd(f, [0, 0, PLAZA + 2]), top, (s + 1) / seg)
          const w = 6 - (3 * (s + 0.5)) / seg
          bar(pylon, a, b, w, w, [0, 1, 0], s === seg - 1)
        }
      } else {
        // a three-chord lattice, tapering
        const base = vadd(f, [0, 0, PLAZA + 2])
        const ax = vsub(top, base), L = Math.hypot(...ax)
        const u = [ax[0] / L, ax[1] / L, ax[2] / L] as V3
        const s1 = [1, 0, 0] as V3
        const s2 = [u[1] * s1[2] - u[2] * s1[1], u[2] * s1[0] - u[0] * s1[2], u[0] * s1[1] - u[1] * s1[0]] as V3
        const chordAt = (t: number, k: number): V3 => {
          const r = 2.8 - 1.6 * t, a = (k / 3) * 2 * Math.PI + Math.PI / 2
          return vadd(vlerp(base, top, t), vadd(vmul(s1, r * Math.cos(a)), vmul(s2, r * Math.sin(a))))
        }
        const P = 14
        for (let k = 0; k < 3; k++)
          for (let p = 0; p < P; p++) {
            bar(pylon, chordAt(p / P, k), chordAt((p + 1) / P, k), 0.9, 0.9, s2, false)
            bar(pylon, chordAt(p / P, k), chordAt((p + 1) / P, (k + 1) % 3), 0.45, 0.45, s2, false)
            bar(pylon, chordAt(p / P, k), chordAt(p / P, (k + 1) % 3), 0.4, 0.4, s2, false)
          }
      }
    }
    // the head: a block where the legs meet, and the crossbar a third of the way up
    bar(pylon, vadd(head, [0, 0, -4]), vadd(head, [0, 0, 2.5]), 4.2, 3.4, [0, 1, 0], true)
    const cb0 = vlerp(vadd(feet[0], [0, 0, PLAZA + 2]), head, 0.26), cb1 = vlerp(vadd(feet[1], [0, 0, PLAZA + 2]), head, 0.26)
    bar(pylon, cb0, cb1, 1.6, 1.6, [0, 0, 1], false)
    // forestays to the opening's end and its corners
    const xs = detail ? [-41.4, -30, -18, -6, 6, 18, 30, 41.4] : [-41.4, -14, 14, 41.4]
    for (const x of xs) {
      const y = sy * (Math.abs(x) > 41 ? HANG[1] : 63.6)
      bar(pylon, vadd(head, [0, 0, -2]), [x, y, OPEN_Z + 4], 0.8, 0.8, [0, 0, 1], false)
    }
    // backstays to the ground anchor, and the anchor block
    for (const y of [223, 250]) bar(pylon, vadd(head, [0, 0, -1]), [1.3, sy * y, PLAZA + 2], 0.8, 0.8, [0, 0, 1], false)
    bar(clad, [1.3, sy * 222, (PLAZA + 2) / 2], [1.3, sy * 251, (PLAZA + 2) / 2], 3.2, PLAZA + 2, [0, 0, 1], true)
  }

  const lit = (_p: V3, n: V3) => (Math.abs(n[2]) < 0.5 ? 0.75 : 0.3)
  return [
    { part: clad, material: { ...finish('allianz-cladding', 0xaeb5bc), floodlight: lit } },
    { part: roof, material: finish('allianz-membrane', 0xbcc1c5) },
    { part: steel, material: finish('allianz-steel', 0x767d84) },
    { part: pylon, material: { ...finish('allianz-pylon', 0xf3f2ee), floodlight: () => 0.8 } },
    { part: green, material: finish('neon-allianz-green', 0x3f8a5a) },
    { part: neon, material: finish('neon-allianz-red', 0xc8423d) },
  ]
}

if (import.meta.main)
  await writeLods('Allianz Stadium', { bearing: BEARING, elevation: -3, height: HEAD_Z + 2.5 }, [
    { file: 'turin-allianz-stadium.glb', parts: build(false), maxTris: 6500, maxBytes: 250_000 },
    { file: 'turin-allianz-stadium.detail.glb', parts: build(true), maxTris: 40_000, maxBytes: 1536 * 1024 },
  ])
