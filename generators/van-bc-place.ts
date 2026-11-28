/**
 * BC Place, Vancouver: original procedural geometry, CC0-1.0, no textures.
 *   bun generators/van-bc-place.ts
 *
 * Writes models/van-bc-place.glb (low) and models/van-bc-place.detail.glb
 * (from zoom 16: six-stage masts, the masts' side stays and back stays,
 * finer cushions, the radial cables in segments, box V-struts).
 *
 * Map frame: x east', y north', z up, metres, turned to bearing 50.9 (the
 * principal axis of OSM way/24705904); +y runs along the long axis to the
 * north-east. Anchor: the outline's area centroid, lng -123.1120067, lat
 * 49.2766985 (the superellipse fitted to it is centred within 0.5 m).
 *
 * Identity: the 2011 cable-supported roof, its 36 white masts raked out
 * round the rim, each with its forestay into the roof; the white roof
 * cushions between the radial cables, rising to the 100 x 85 m opening's
 * ring, the centre drawn open with the pod hanging on its cables and the
 * grey bowl seen through it; the white compression ring on V struts; the
 * grey upper bowl over the concourse podium glazed teal-green in bays.
 *
 * Evidence
 *  - OSM: way/24705904 (building=stadium, Q612227): a superellipse in this
 *    frame, half-axes 96 x 116 m, exponent 2.6 (fitted, within ~1 m);
 *    way/1415412262 (the whole bowl, height 48: the ring's top);
 *    relation/5836463 (building:part=roof, height 61, roof:height 13, white;
 *    outer way/390133856, inner way/390133855, the opening, 85 x 101 m here).
 *  - Published (Wikipedia "BC Place"): the 2011 roof is cable-supported and
 *    retractable, its opening 100 x 85 m, the fabric stowing in a pod at the
 *    centre; the old brown glass replaced with light green glass.
 *  - Heights: podium 14 m, upper bowl to 40 m, ring 41-48 m (OSM 48), the
 *    opening's ring 57.5 m and the closed centre 62 m (OSM 61), mast tips
 *    94 m: the masts stand about as high over the ring as the ring over
 *    the ground in ab1 and qs1 (ESTIMATED; no published mast height found).
 *    36 masts counted in qs1/qs2.
 *  - Photos (Wikimedia Commons, all EVIDENCE):
 *    - qs1, qs2: Quintin Soloviev, "BC Place (Vancouver).jpg" and "BC Place,
 *      Vancouver, British Columbia, Canada.jpg", CC BY 4.0, aerials: masts,
 *      cushions, opening, pod, glazing.
 *      https://commons.wikimedia.org/wiki/File:BC_Place_(Vancouver).jpg
 *      https://commons.wikimedia.org/wiki/File:BC_Place,_Vancouver,_British_Columbia,_Canada.jpg
 *    - ab1, ab3: Another Believer, "BC Place, Vancouver (2012) - 01.JPG" and
 *      "- 03.JPG", CC BY-SA 3.0: the side elevation, proportions.
 *      https://commons.wikimedia.org/wiki/File:BC_Place,_Vancouver_(2012)_-_01.JPG
 *      https://commons.wikimedia.org/wiki/File:BC_Place,_Vancouver_(2012)_-_03.JPG
 *    - pano: Ryan Adams, "BC Place Stadium - panoramio.jpg", CC BY-SA 3.0, at night: the lit ring.
 *      https://commons.wikimedia.org/wiki/File:BC_Place_Stadium_-_panoramio.jpg
 *    - fox: GoToVan, "Terry Fox Statue with BC Place.jpg", CC BY 2.0, at night: ring and masts.
 *      https://commons.wikimedia.org/wiki/File:Terry_Fox_Statue_with_BC_Place.jpg
 *    - aus: Aeacad, "Australia vs Türkiye at BC Place - June 13, 2026.jpg", CC0: the roof from inside (seats not drawn).
 *      https://commons.wikimedia.org/wiki/File:Australia_vs_T%C3%BCrkiye_at_BC_Place_-_June_13,_2026.jpg
 *    - mike: Mike, "BC Place Stadium (2015).jpg", CC BY-SA 2.0: masts and V struts.
 *      https://commons.wikimedia.org/wiki/File:BC_Place_Stadium_(2015).jpg
 *    - newc: John Newcomb, "New BC Place stadium. MORE INFO IN PANORAMIO-DESCRIPTION - panoramio.jpg", CC BY 3.0.
 *      https://commons.wikimedia.org/wiki/File:New_BC_Place_stadium._MORE_INFO_IN_PANORAMIO-DESCRIPTION_-_panoramio.jpg
 *    - ash: Robert Ashworth, "BC Place with retractable roof (7735443396).jpg", CC BY 2.0.
 *      https://commons.wikimedia.org/wiki/File:BC_Place_with_retractable_roof_(7735443396).jpg
 *  No lidar or NAIP (Canada); no commercial imagery.
 *
 * Estimated, and doubts:
 *  - The podium/bowl/ring section and its setbacks are read from ab1 and
 *    mike; the bowl's grey back is one smooth band with a glazed strip (its
 *    ribs are left out). The masts' rake (~6 m outward), taper and the
 *    stays' anchor points are simplified: one forestay per mast to the
 *    opening's ring in the low model; the detail model adds the side stays.
 *  - Rework (lead review 1): cushions given relief both ways (bays bulge
 *    4.2 m, alternate rings crown, so each bay reads as a row of pillows,
 *    qs1/qs2); the centre drawn open as qs1/qs2 show it, with the pod
 *    (8 m radius, 50-58 m, estimated) on radial cables and the seats in
 *    two grey tiers seen through the opening; the podium glazing toned
 *    toward the photo (#5f9493) and split into bays of three lights and two
 *    rows between concrete piers. Doubt: the June 2026 interior photo (aus)
 *    shows the centre closed; it opens and closes.
 *  - Elevation 0: the site falls ~11 m from Beatty Street (north-west) to
 *    Pacific Boulevard (south-east) on Mapterhorn; y = 0 is the low side,
 *    taken as field level (no published figure), so the podium is buried on
 *    the Beatty side, where the real entrances are at the upper concourse.
 *  - Rogers Arena next door and the Parq casino (way/684212944, touching
 *    the south-west edge) are separate buildings and not drawn.
 *  - Night: the ring's fascia is `neon` (lit white; it changes colour in
 *    reality), the masts floodlit, the glazing `window`.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { face, nrm3, vsub, vadd, vmul, vlerp, vaults } from './seoul-world-cup-stadium'
import { band, bar, rod3, writeLods } from './milan-san-siro'

const BEARING = 50.9

// The bowl's plan: a superellipse fitted to OSM way/24705904 in this frame
// (x across, y along the long axis, north-east).
const A = 96, B = 116, E = 2.6
const N_MAST = 36
function S(s: number, f: number, z: number): V3 {
  const c = Math.cos(f), n = Math.sin(f)
  return [s * A * Math.sign(c) * Math.pow(Math.abs(c), 2 / E), s * B * Math.sign(n) * Math.pow(Math.abs(n), 2 / E), z]
}
const OUT = (q: V3): V3 => [q[0] / (A * A), q[1] / (B * B), 0].map((v, i) => (i < 2 ? v * 1e4 : 0)) as V3

const Z_POD = 14 // the concourse podium
const Z_BOWL = 40 // the upper bowl's back
const Z_RING0 = 41, Z_RING1 = 48 // the compression ring (OSM: roof from 48)
const Z_INNER = 57.5 // the opening's ring (100 x 85 m, published), raised over the rim (qs1)
const Z_TOP = 62 // OSM roof part height 61 (the closed fabric; drawn open, unused)
const Z_MAST = 94 // mast tips: as high over the ring as the ring stands over the ground (ab1, qs1)
const S_RING = 1.03, S_BOWL = 0.95, S_OPEN = 0.44

function build(detail: boolean) {
  const concrete = new Part(), steel = new Part(), roof = new Part(), glaze = new Part(), cable = new Part(), ring = new Part()
  const seat = cable // seats and cables share the grey
  const NP = detail ? 144 : 72
  const phis = Array.from({ length: NP }, (_, k) => (k / NP) * 2 * Math.PI + Math.PI / N_MAST)
  const rg = (s: number, z: number) => phis.map((f) => S(s, f, z))
  const out = (q: V3): V3 => { const o = OUT(q); return [o[0], o[1], 0] }

  // ---- podium and bowl ----------------------------------------------------
  band(concrete, rg(1, 0), rg(1, Z_POD), out)
  band(concrete, rg(1, Z_POD), rg(S_BOWL + 0.01, Z_POD), () => [0, 0, 1]) // the podium's deck
  band(cable, rg(S_BOWL + 0.01, Z_POD), rg(S_BOWL, Z_BOWL), (q) => vadd(out(q), [0, 0, 0.1])) // the upper bowl's grey back
  band(concrete, rg(S_BOWL, Z_BOWL), rg(S_RING - 0.04, Z_RING0), () => [0, 0, -1])
  // the teal-green glazing round the concourse in bays: per mast bay three
  // tall lights between concrete piers, split by a transom; and a glazed
  // strip on the bowl's back, bay by bay
  const p = (sc: number, f: number, z: number) => vadd(S(sc, f, z), vmul(nrm3(out(S(sc, f, z))), 0.06))
  const lean = (z: number) => S_BOWL + 0.01 - (0.01 * (z - Z_POD)) / (Z_BOWL - Z_POD)
  const bay = (2 * Math.PI) / N_MAST
  for (let m = 0; m < N_MAST; m++) {
    const b0 = m * bay + Math.PI / N_MAST
    const nOut = out(S(1, b0 + bay / 2, 0))
    for (let l = 0; l < 3; l++) {
      const f0 = b0 + bay * (0.06 + (l * 0.88) / 3) + bay * 0.025, f1 = b0 + bay * (0.06 + ((l + 1) * 0.88) / 3) - bay * 0.025
      for (const [z0, z1] of [[2.5, 7.2], [7.9, 12.2]] as [number, number][])
        face(glaze, [p(1, f0, z0), p(1, f1, z0), p(1, f1, z1), p(1, f0, z1)], nOut)
    }
    const g0 = b0 + bay * 0.08, g1 = b0 + bay * 0.92
    const pb = (sc: number, f: number, z: number) => vadd(S(sc, f, z), vmul(nrm3(out(S(sc, f, z))), 0.5))
    face(glaze, [pb(lean(25), g0, 25), pb(lean(25), g1, 25), pb(lean(31), g1, 31), pb(lean(31), g0, 31)], nOut)
  }

  // ---- the compression ring: a white box girder, its fascia lit at night --
  band(ring, rg(S_RING, Z_RING0), rg(S_RING, Z_RING1), out)
  band(steel, rg(S_RING - 0.04, Z_RING0), rg(S_RING, Z_RING0), () => [0, 0, -1])
  band(steel, rg(S_RING, Z_RING1), rg(S_RING - 0.06, Z_RING1 + 0.6), () => [0, 0, 1])

  // ---- the roof: white cushions in 36 radial bays, up to the opening's
  // ring, and the closed centre with the pod
  // rings alternate valley (even) and crown (odd) across the radius too,
  // so each bay reads as a row of pillows (qs1, qs2)
  const NR = detail ? 8 : 6
  const roofRings: V3[][] = []
  for (let r = 0; r <= NR; r++) {
    const t = r / NR
    const s = S_RING - 0.06 + (S_OPEN - (S_RING - 0.06)) * t
    const z = Z_RING1 + 0.6 + (Z_INNER - Z_RING1 - 0.6) * Math.pow(t, 0.8)
    const ringCrown = r % 2 === 1 ? 1 : 0.35
    const NB = 2
    const pts: V3[] = []
    for (let m = 0; m < N_MAST; m++)
      for (let q = 0; q < NB; q++) {
        const f = ((m + q / NB) / N_MAST) * 2 * Math.PI
        const bulge = q === 0 ? (r % 2 === 1 ? 0.6 : 0) : (r === 0 || r === NR ? 0.5 : 4.2 * ringCrown)
        pts.push(S(s, f, z + bulge))
      }
    roofRings.push(pts)
  }
  for (let r = 0; r < NR; r++) vaults(roof, roofRings[r], roofRings[r + 1], () => [0, 0, 1])
  // the radial cables lying in the roof's valleys, between the cushions
  for (let m = 0; m < N_MAST; m++) {
    const f = (m / N_MAST) * 2 * Math.PI
    const path: V3[] = []
    for (let r = 0; r <= NR; r++) {
      const t = r / NR
      const s = S_RING - 0.06 + (S_OPEN - (S_RING - 0.06)) * t
      path.push(S(s, f, Z_RING1 + 0.6 + (Z_INNER - Z_RING1 - 0.6) * Math.pow(t, 0.8) + 0.35))
    }
    if (detail) for (let k = 0; k < path.length - 1; k++) rod3(cable, path[k], path[k + 1], 0.3)
    else rod3(cable, path[0], path[path.length - 1], 0.45)
  }
  // the opening's ring: a white box ring, and the centre open (qs1, qs2)
  // with the pod hanging on radial cables
  const inner = roofRings[NR]
  const lo = inner.map((q) => [q[0], q[1], Z_INNER - 1.5] as V3), hi = inner.map((q) => [q[0], q[1], Z_INNER + 1.6] as V3)
  const inIn = inner.map((q) => [q[0] * 0.95, q[1] * 0.95, 0] as V3)
  band(steel, lo, hi, (q) => [q[0], q[1], 0]) // outer face (under the roof's edge)
  band(steel, inIn.map((q) => [q[0], q[1], Z_INNER + 1.6] as V3), inIn.map((q) => [q[0], q[1], Z_INNER - 1.5] as V3), (q) => [-q[0], -q[1], 0])
  band(steel, hi, inIn.map((q) => [q[0], q[1], Z_INNER + 1.6] as V3), () => [0, 0, 1])
  band(steel, inIn.map((q) => [q[0], q[1], Z_INNER - 1.5] as V3), lo, () => [0, 0, -1])
  // the pod: a drum where the fabric is stowed, and the cables to it
  const POD_R = 8, POD_Z0 = 50, POD_Z1 = 58
  const np = detail ? 24 : 12
  const podR = (z: number) => Array.from({ length: np }, (_, k) => [POD_R * Math.cos((k / np) * 2 * Math.PI), POD_R * Math.sin((k / np) * 2 * Math.PI), z] as V3)
  band(steel, podR(POD_Z0), podR(POD_Z1), (q) => [q[0], q[1], 0])
  const pt = podR(POD_Z1), pb = podR(POD_Z0)
  for (let i = 0; i < np; i++) {
    face(steel, [pt[i], pt[(i + 1) % np], [0, 0, POD_Z1 + 2]], [0, 0, 1])
    face(steel, [pb[(i + 1) % np], pb[i], [0, 0, POD_Z0 - 1.5]], [0, 0, -1])
  }
  for (let m = 0; m < N_MAST; m += detail ? 1 : 2) {
    const f = (m / N_MAST) * 2 * Math.PI
    const q = S(S_OPEN * 0.95, f, Z_INNER)
    rod3(cable, q, [POD_R * Math.cos(f), POD_R * Math.sin(f), POD_Z1 - 1], detail ? 0.25 : 0.4)
  }
  // the bowl seen through the opening: grey seats raked from the field's
  // edge up under the roof, in two tiers
  const seatRing = (sc: number, z: number) => rg(sc, z)
  band(seat, seatRing(0.45, 1), seatRing(0.66, 14), () => [0, 0, 1])
  band(seat, seatRing(0.66, 14), seatRing(0.68, 17), () => [0, 0, 1])
  band(seat, seatRing(0.68, 17), seatRing(0.93, 38), () => [0, 0, 1])

  // ---- the 36 masts, raked outward, with their stays -----------------------
  for (let m = 0; m < N_MAST; m++) {
    const f = (m / N_MAST) * 2 * Math.PI
    const foot = S(S_RING - 0.015, f, Z_RING1)
    const o = nrm3(out(foot))
    const tip: V3 = vadd(S(S_RING + 0.05, f, Z_MAST), [0, 0, 0])
    const tang = nrm3([-o[1], o[0], 0])
    // a tapered box mast in four stages
    const N = detail ? 6 : 2
    for (let k = 0; k < N; k++) {
      const a = vlerp(foot, tip, k / N), b = vlerp(foot, tip, (k + 1) / N)
      const w = 3.6 - (2.2 * (k + 0.5)) / N
      bar(steel, a, b, w, w, o, k === N - 1)
    }
    // forestay into the roof (to the opening's ring), backstays to the ring
    const inR = S(S_OPEN, f, Z_INNER + 1.6)
    const r = detail ? 0.28 : 0.35
    rod3(cable, tip, inR, r)
    if (detail) rod3(cable, tip, S(0.75, f, Z_RING1 + 4), r)
    const fl = ((m - 0.5) / N_MAST) * 2 * Math.PI, fr = ((m + 0.5) / N_MAST) * 2 * Math.PI
    if (detail) {
      rod3(cable, vlerp(foot, tip, 0.95), S(S_RING, fl, Z_RING1), 0.2)
      rod3(cable, vlerp(foot, tip, 0.95), S(S_RING, fr, Z_RING1), 0.2)
    }
    // the V struts under the ring, onto the bowl
    const sb = S(S_BOWL - 0.005, f, Z_BOWL - 6)
    if (detail) {
      bar(steel, sb, S(S_RING - 0.02, f - 0.03, Z_RING0), 1.0, 1.0, tang, false)
      bar(steel, sb, S(S_RING - 0.02, f + 0.03, Z_RING0), 1.0, 1.0, tang, false)
    } else {
      rod3(steel, sb, S(S_RING - 0.02, f - 0.03, Z_RING0), 0.7)
      rod3(steel, sb, S(S_RING - 0.02, f + 0.03, Z_RING0), 0.7)
    }
  }

  const masts = (p: V3, n: V3) => (p[2] > Z_RING1 ? 0.7 : 0.25)
  return [
    { part: concrete, material: { ...finish('bcplace-concrete', 0xd4d3cd), floodlight: () => 0.25 } },
    { part: steel, material: { ...finish('bcplace-white-steel', 0xeef0ef), floodlight: masts } },
    { part: roof, material: finish('bcplace-roof', 0xe6e9ea) },
    { part: glaze, material: { ...PALETTE.window, color: 0x5f9493 } },
    { part: cable, material: finish('bcplace-grey', 0x8f969c) },
    { part: ring, material: finish('neon-bcplace-ring', 0xe9ecec) },
  ]
}

if (import.meta.main)
  await writeLods('BC Place', { bearing: BEARING, elevation: 0, height: Z_MAST + 1 }, [
    { file: 'van-bc-place.glb', parts: build(false), maxTris: 6500, maxBytes: 250_000 },
    { file: 'van-bc-place.detail.glb', parts: build(true), maxTris: 40_000, maxBytes: 1_500_000 },
  ])
