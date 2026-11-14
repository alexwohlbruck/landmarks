/**
 * Gocheok Sky Dome (고척스카이돔, Gocheok-dong, Guro-gu; opened September 2015,
 * Korea's first domed baseball stadium): original procedural geometry,
 * CC0-1.0.
 * bun generators/seoul-gocheok-sky-dome.ts
 *
 * Map frame: x east, y north, z up, metres. Anchor = area centroid of OSM
 * way/258637347 (building=stadium, height 62, building:levels 4, wikidata
 * Q10855359), lng 126.8670477, lat 37.4981957. Bearing 0: the plan is
 * drawn straight from the OSM outline, which is egg-shaped (150 x 214 m,
 * wider to the north, its axis at 6 deg).
 *
 * Identity, in order: the low, slightly flattened white membrane cap on
 * its ribs; the silver drum, rounding over at a broad shoulder into the
 * cap; the stepped base: a white colonnade storey with glazing behind it
 * and a blue band over it, the drum set back above.
 *
 * Evidence
 *  - Plan: the OSM outline, read as a radius for each direction from the
 *    centroid (72 directions) and smoothed over three neighbours, so the
 *    drum follows the mapped egg. Published building footprint 28,626 m2
 *    (ko.wikipedia) against 24,870 m2 for the OSM outline: the base
 *    reaches out further than drawn in places; doubt.
 *  - Heights: published "그라운드에서 지붕까지의 최고 높이는 67.59 m"
 *    (field to roof, ko.wikipedia) and OSM height=62 (taken from the
 *    street). So the field is drawn 5.6 m below the street: y = 0 is the
 *    field, elevation -5.6 (the published B2 to 4F, ko.wikipedia, agrees
 *    with a sunken field; the depth itself rests on the two heights, a
 *    doubt). Above the street: the base storey to 10.5 m, the drum to
 *    27 m, the shoulder rising 19 m as it rounds in to the cap, the cap
 *    rising 15 m to the apex (62 m). Proportions of base, drum and
 *    shoulder ESTIMATED from gene (level, from the street) and ipark (high
 *    view, late in construction, showing the cap and its ribs).
 *  - Cap outline: OSM way/842076947 (building=roof, maxheight 67.5), a
 *    near-circle ~102 x 125 m set towards the south (home plate) end of the
 *    egg, so the silver shoulder is broad over the outfield (north), as in
 *    ipark. The apex is put at the cap's centre.
 *  - Cap: "a translucent Teflon membrane" (ko.wikipedia), between radial
 *    ribs (ipark: about 30 seams; drawn as 36 ribs that carry on down the
 *    drum as its vertical ribbing, gene).
 *  - Photos (EVIDENCE):
 *    - gene: genewang0123, "首爾高尺巨蛋（Gocheok SkyDome）", Flickr, CC BY
 *      2.0; the finished stadium from the street (south-east): silver drum,
 *      shoulder, white colonnade base, blue band.
 *      https://www.flickr.com/photos/56814157@N03/40167119121
 *    - ipark: iparkstory, "Gocheok Dome Baseball Stadium", Flickr, CC BY-SA
 *      2.0; high view in 2014 before the drum was clad: the cap and its
 *      ribs, the plan's shape. https://www.flickr.com/photos/124876385@N03/14256118317
 *    - pano: Bohao Zhao, "경기장 - panoramio.jpg", Wikimedia Commons, CC BY 3.0 (2013,
 *      under construction): the profile. https://commons.wikimedia.org/wiki/File:%EA%B2%BD%EA%B8%B0%EC%9E%A5_-_panoramio.jpg
 *    - red: redlegsfan21, "Gocheok Sky Dome (36530170325).jpg", Wikimedia
 *      Commons, CC BY-SA 2.0; inside: the lattice under the translucent
 *      cap. https://commons.wikimedia.org/wiki/File:Gocheok_Sky_Dome_(36530170325).jpg
 *  Look-only (not relied on for any shape or colour): TFurban, Flickr,
 *  "고척 스카이돔 (고척교에서 바라본 방면_" (CC BY-NC-SA 2.0, night: violet light
 *  lines along the drum) and "고척스카이돔 정문" (CC BY-NC-ND 2.0, the front
 *  steps and lettering); lseeker, "고척스카이돔" (CC BY-NC-SA 2.0, inside).
 *  No lidar, NAIP or map terrain here (Mapterhorn has no z15 tiles over
 *  Seoul): the terrain could not be checked. No commercial imagery.
 *
 * Invented or simplified: the drum's fine fluting is drawn as its 36 bold
 *  ribs; the thin horizontal lines on the shoulder are left out (they would
 *  be pinstripes); the "GOCHEOK SKY DOME" lettering and the front steps are
 *  left out; 36 base columns. Night: the glazed base is `window`; the drum
 *  carries a little _FLOODLIGHT (the real violet light lines are not
 *  drawn); the cap stays unlit.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { save } from './chi-aon-center'
import { strip, tube, beam, rayHit, vaults, UP, DOWN } from './seoul-world-cup-stadium'

/** OSM way/258637347 about its centroid, metres (x east, y north). */
const OSM: [number, number][] = [[-18.6, 100.3], [1.4, 103.5], [19.0, 101.8], [36.2, 96.8], [51.6, 85.7], [62.5, 66.0], [69.1, 51.2], [74.6, 33.3], [76.5, 22.9], [76.8, 6.7], [75.5, -7.2], [71.9, -18.9], [67.7, -32.4], [54.7, -58.5], [38.5, -84.5], [32.7, -92.5], [24.2, -98.0], [14.6, -103.0], [0.9, -108.5], [-9.5, -110.2], [-23.7, -107.7], [-35.3, -103.6], [-43.6, -98.9], [-48.7, -92.5], [-56.2, -77.2], [-61.1, -59.4], [-65.6, -42.3], [-70.1, -19.1], [-72.5, 10.3], [-71.2, 28.7], [-67.0, 47.2], [-60.0, 65.1], [-51.0, 78.2], [-37.6, 91.5]]

const N = 72
const PH = Array.from({ length: N }, (_, k) => (k / N) * 2 * Math.PI)
const RAW = PH.map((f) => rayHit(OSM, f))
/** The outline's radius in each sampled direction, smoothed over neighbours. */
const R = RAW.map((_, k) => (RAW[(k + N - 1) % N] + 2 * RAW[k] + RAW[(k + 1) % N]) / 4)

const STREET = 5.6 // field below the street (see header)
const Z_BASE = STREET + 10.5 // top of the base storey
const Z_DRUM = STREET + 27 // top of the drum, start of the shoulder
const HS = 19 // shoulder: rise
const Z_APEX = 67.6
const SET = 3.5 // the drum stands this far inside the outline (the base reaches out to it)
/** The translucent cap: OSM way/842076947 (building=roof, maxheight 67.5), in this frame. */
const CAP: [number, number][] = [[-35.3, 27.3], [-42.9, 15.8], [-48.0, 4.1], [-50.9, -6.9], [-52.2, -16.6], [-52.5, -26.3], [-50.4, -39.9], [-47.7, -47.7], [-42.6, -56.0], [-37.3, -63.6], [-29.5, -70.8], [-20.6, -75.2], [-11.5, -77.3], [-2.5, -78.2], [5.8, -77.2], [15.5, -73.4], [25.0, -67.8], [31.5, -61.6], [38.0, -52.7], [43.9, -41.8], [48.2, -31.1], [49.3, -17.7], [49.3, -2.7], [48.0, 6.3], [43.0, 22.0], [36.9, 30.0], [29.3, 38.5], [20.1, 44.5], [7.6, 46.1], [-4.3, 46.5], [-18.0, 41.8], [-27.1, 34.3]]
const APEX: [number, number] = [-1.5, -16]
/** How far in the shoulder reaches in each direction: from the drum to the cap. */
const RS = PH.map((f, k) => Math.max(12, R[k] - SET - rayHit(CAP, f)))

/** A point of the dome's skin: d metres in from the drum line, at height z. */
const at = (k: number, d: number, z: number): V3 => {
  const f = PH[k], r = R[k] - SET - d
  return [r * Math.cos(f), r * Math.sin(f), z]
}
const ringAt = (d: number, z: number) => PH.map((_, k) => at(k, d, z))
/** The profile above the base for direction k, as (inset, height) pairs: drum, shoulder. */
function profile(k: number): [number, number][] {
  const out: [number, number][] = [[0, Z_BASE], [-0.6, (Z_BASE + Z_DRUM) / 2], [0, Z_DRUM]]
  for (const a of [30, 60, 90]) {
    const t = (a * Math.PI) / 180
    out.push([RS[k] * (1 - Math.cos(t)), Z_DRUM + HS * Math.sin(t)])
  }
  return out
}
const Z_CAP0 = Z_DRUM + HS
/** The cap: share s of the way from its edge (0) to the apex (1). */
const capPt = (k: number, s: number, lift = 0): V3 => {
  const e = at(k, RS[k], 0)
  // the membrane vaults between the 36 ribs, fading out towards the apex
  const hump = k % 2 === 1 ? 1.3 * (1 - s) : 0
  return [e[0] + (APEX[0] - e[0]) * s, e[1] + (APEX[1] - e[1]) * s, Z_CAP0 + (Z_APEX - Z_CAP0) * (1 - (1 - s) ** 2) + lift + hump]
}

function build() {
  const drum = new Part(), cap = new Part(), trim = new Part(), ribs = new Part(), glazing = new Part(), blue = new Part()
  const OUTW = (q: V3): V3 => [q[0], q[1], 0]

  // --- The base storey: a white plinth at the street, glazing set back
  // behind a ring of white columns, the white soffit, the blue band.
  const baseRing = (d: number, z: number) => ringAt(-SET + d, z) // d in from the outline
  strip(trim, baseRing(0, 0), baseRing(0, STREET + 0.8), OUTW)
  strip(trim, baseRing(0, STREET + 0.8), baseRing(4, STREET + 0.8), UP)
  strip(glazing, baseRing(4, STREET + 0.8), baseRing(4, STREET + 7.6), OUTW)
  strip(trim, baseRing(4, STREET + 7.6), baseRing(0, STREET + 7.6), DOWN)
  strip(blue, baseRing(0, STREET + 7.6), baseRing(0, Z_BASE - 0.6), OUTW)
  strip(trim, baseRing(0, Z_BASE - 0.6), baseRing(0, Z_BASE), OUTW)
  strip(trim, baseRing(0, Z_BASE), ringAt(0, Z_BASE), UP)
  for (let k = 0; k < N; k += 2) {
    const a = at(k, -SET + 1.2, STREET + 0.8), b: V3 = [a[0], a[1], STREET + 7.6]
    tube(trim, a, b, 0.75, 0.75, 6, false, false, 0, true)
  }

  // --- The drum and shoulder (silver), the dark gutter ring, the cap.
  const profs = PH.map((_, k) => profile(k))
  const pring = (i: number) => PH.map((_, k) => at(k, profs[k][i][0], profs[k][i][1]))
  for (let i = 0; i < profs[0].length - 1; i++) strip(drum, pring(i), pring(i + 1), (q) => [q[0], q[1], (i + 1) * 25])
  strip(ribs, pring(profs[0].length - 1), PH.map((_, k) => capPt(k, 0, 0.9)), UP) // gutter ring
  const S = [0, 0.25, 0.5, 0.75, 0.93]
  for (let i = 0; i < S.length - 1; i++) vaults(cap, PH.map((_, k) => capPt(k, S[i], i === 0 ? 0.9 : 0)), PH.map((_, k) => capPt(k, S[i + 1])), UP)
  const top = PH.map((_, k) => capPt(k, S[S.length - 1]))
  for (let k = 0; k < N; k++) cap.tri(top[k], top[(k + 1) % N], [APEX[0], APEX[1], Z_APEX], undefined, undefined, undefined, [[0, 0, 1], [0, 0, 1], [0, 0, 1]])

  // --- 36 ribs: up the drum, over the shoulder, across the cap, standing
  // 0.7 m proud, 1.3 m wide, so they read at phone size.
  for (let k = 0; k < N; k += 2) {
    const out = (p: V3, h: number): V3 => {
      const l = Math.hypot(p[0], p[1]) || 1
      return [p[0] + (p[0] / l) * h, p[1] + (p[1] / l) * h, p[2]]
    }
    const path: V3[] = [
      ...profs[k].map(([d, z]) => out(at(k, d, z), 0.4)),
    ]
    beam(ribs, path, 1.3, 1.1, [0, 0, 1])
  }

  return [
    { part: drum, material: { ...finish('gsd-silver', 0xc6cbd0), floodlight: (_p: V3, n: V3) => (n[2] > 0.8 ? 0 : 0.35) } },
    { part: cap, material: finish('gsd-membrane', 0xf1f0eb) },
    { part: trim, material: PALETTE.trim },
    { part: ribs, material: finish('gsd-ribs', 0xa3aab2) },
    { part: glazing, material: PALETTE.window },
    { part: blue, material: finish('gsd-blue', 0x4a6a96) },
  ]
}

if (import.meta.main) await save('seoul-gocheok-sky-dome', 'Gocheok Sky Dome', [37.4981957, 126.8670477], 0, build() as any, 6500)
