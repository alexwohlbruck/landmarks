/**
 * KSPO Dome (케이스포돔; the Olympic Gymnastics Arena, 올림픽체조경기장, Olympic
 * Park, Songpa-gu; built 1984-86 for the 1988 Olympics, roof by David H.
 * Geiger, the first cable dome; remodelled 2016-18 by Haeahn): original
 * procedural geometry, CC0-1.0.
 * bun generators/seoul-kspo-dome.ts
 *
 * Map frame: x east, y north, z up, metres. Anchor = area centroid of OSM
 * way/75956855 (building=yes, leisure=stadium, wikidata Q487224), lng
 * 127.1274701, lat 37.5192312. Bearing 0: the plan is a round twelve-sided
 * figure, drawn turned so its corners face the directions seen in the
 * photo (see below).
 *
 * Identity, in order: the low, pleated white dome, its twelve ridges
 * running down to the corners of the twelve-sided eave, the valleys
 * between; the ring of louvred translucent panels, one per bay, just inside
 * the eave; the folded skirt under the eave: a silver inverted triangle
 * leaning out from each bay over a dark glazed recess at each corner.
 *
 * Evidence
 *  - Plan: OSM way/75956855 is a circle 135.6 m across (radius 67.8, to
 *    within 0.3 m): drawn as the eave's corners. Published span 120 m
 *    (structurae.net): the cable dome inside the eave.
 *  - Twelve bays: counted in lwt (five bays across the near half, their
 *    corners at about 15, 45 and 75 deg either side of the line of sight),
 *    which also puts the corners at compass 26.6 + 30k deg (ESTIMATED,
 *    +-5 deg). Geiger's original roof is often described with more ridge
 *    cables; this is the roof as it reads from outside today.
 *  - Heights: published height 29.4 m (structurae.net), drawn as the apex.
 *    Eave 14 m: ESTIMATED from lwt (the skirt's height against the plan's
 *    width; the view is ~13 deg down, little foreshortened). The valleys
 *    sit 1.6 m below the ridges (estimated from the shading in lwt).
 *  - Skylights: one trapezoid per bay from 0.66 to 0.92 of the radius,
 *    with seven radial louvres (lwt; the real louvres are many and fine).
 *  - Photos (EVIDENCE):
 *    - lwt: Tristan Surtel, "Seoul Olympic Park from Lotte World
 *      Tower.jpg", Wikimedia Commons, CC BY-SA 4.0, from the south-west,
 *      high: the plan, the bays, skylights and the folded skirt.
 *      https://commons.wikimedia.org/wiki/File:Seoul_Olympic_Park_from_Lotte_World_Tower.jpg
 *    - lwt2: Christophe95, "View of Seoul Olympic Park from the Lotte World
 *      Tower.jpg", Wikimedia Commons, CC BY-SA 4.0: the same, at another
 *      time. https://commons.wikimedia.org/wiki/File:View_of_Seoul_Olympic_Park_from_the_Lotte_World_Tower.jpg
 *    - bryan: bryangeek, "Interior of gymnastics arena", Flickr, CC BY-SA
 *      2.0: inside, the bowl and the roof's light panels.
 *      https://www.flickr.com/photos/37996647372@N01/2812629703
 *  - Published: structurae.net "Seoul Olympic Gymnastics Hall" (span 120
 *    m, height 29.4 m, 11,310 m2 of silicone-coated glass-fibre membrane);
 *    en.wikipedia "Olympic Gymnastics Arena" (Geiger's cable dome, the 2018
 *    remodelling).
 *  No look-only sources. No commercial imagery. No lidar, NAIP or map
 *  terrain here (Mapterhorn has no z15 tiles over Seoul): the terrain could
 *  not be checked. Elevation 0.
 *
 * Invented or simplified: the entrance's coloured media wall and the
 *  smaller structures round the base are left out; the skirt's struts are
 *  drawn as one white column at each corner; louvres seven per bay. Doubt:
 *  only one licensed photo shows the outside well (from one side, from
 *  far away); the other sides are assumed the same. Night: the glazed
 *  recesses are `window`; the skirt carries _FLOODLIGHT.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { save } from './chi-aon-center'
import { strip, tube, beam, face, vlerp, vsub, crs, nrm3, UP } from './seoul-world-cup-stadium'

const NB = 12
const RE = 67.8 // eave corners: the OSM circle
const RB = 58.5 // the glazed base recess at the corners
const RM = 61 // the foot of each leaning facet, at the bay's middle
const Z_EAVE = 14, Z_APEX = 28.6, VALLEY = 2.2 // apex skin 28.6: the crown ring tops out at the published 29.4
const C0 = ((90 - 26.6) * Math.PI) / 180 // polar angle of the first corner (compass 26.6)

const ang = (i: number) => C0 + (i * 2 * Math.PI) / NB
const corner = (i: number, r = RE): [number, number] => [r * Math.cos(ang(i)), r * Math.sin(ang(i))]
/** A roof point: bay i, u across the bay (0 corner i, 1 corner i+1), s from the eave (0) to the apex (1). */
function roof(i: number, u: number, s: number, lift = 0): V3 {
  const a = corner(i), b = corner(i + 1)
  const ex = a[0] + (b[0] - a[0]) * u, ey = a[1] + (b[1] - a[1]) * u
  const x = ex * (1 - s), y = ey * (1 - s)
  const ridge = Z_EAVE + (Z_APEX - Z_EAVE) * (1 - (1 - s) ** 2)
  const v = Math.sin(Math.PI * u) * VALLEY * Math.min(1, (1 - s) / 0.25) * (s < 0.97 ? 1 : 0)
  return [x, y, ridge - v + lift]
}

function build() {
  const membrane = new Part(), trim = new Part(), skirt = new Part(), glazing = new Part(), sky = new Part()

  // --- The roof: per bay, two half-bays (corner to valley) from the eave
  // to the apex, flat-faced so the pleats read.
  const S = [0, 0.08, 0.34, 0.6, 0.85, 1]
  for (let i = 0; i < NB; i++) {
    for (let k = 0; k < S.length - 1; k++) {
      for (const [u0, u1] of [[0, 0.5], [0.5, 1]]) {
        const a = roof(i, u0, S[k]), b = roof(i, u1, S[k]), c = roof(i, u1, S[k + 1]), d = roof(i, u0, S[k + 1])
        // the skylight band (S[1]..S[2]) is glass, set into the membrane
        const part = k === 1 ? sky : membrane
        if (S[k + 1] === 1) face(part, [a, b, c], [0, 0, 1])
        else face(part, [a, b, c, d], [0, 0, 1])
      }
    }
  }
  // Louvres over each skylight: seven bold radial slats per bay.
  for (let i = 0; i < NB; i++) {
    for (let j = 1; j <= 7; j++) {
      const u = j / 8
      const pts = [S[1] + 0.01, (S[1] + S[2]) / 2, S[2] - 0.01].map((s) => roof(i, u, s, 0.35))
      beam(trim, pts, 1.0, 0.6, [0, 0, 1])
    }
  }
  // Ridges: bold white ribs from each corner to the apex, and a ring at the eave.
  for (let i = 0; i < NB; i++) {
    const path = [0.0, 0.3, 0.6, 0.85, 0.97].map((s) => roof(i, 0, s, 0.55))
    beam(trim, path, 1.2, 0.7, [0, 0, 1])
  }
  for (let i = 0; i < NB; i++) beam(trim, [roof(i, 0, 0, 0.1), roof(i, 0.5, 0, 0.1), roof(i + 1, 0, 0, 0.1)], 1.4, 1.6, [0, 0, 1])
  // the crown ring at the apex
  {
    const ring = Array.from({ length: NB + 1 }, (_, i) => roof(i % NB, 0, 0.95, 0.5))
    beam(trim, ring, 1.0, 0.9, [0, 0, 1])
  }

  // --- The folded skirt: under each bay a silver triangle leaning out from
  // its foot at the bay's middle to the eave; between them, at each corner,
  // a dark glazed recess down to the base; a white strut at each corner.
  for (let i = 0; i < NB; i++) {
    const a = corner(i), b = corner(i + 1)
    const am = (ang(i) + ang(i + 1)) / 2
    const foot: V3 = [RM * Math.cos(am), RM * Math.sin(am), 0]
    const ea: V3 = [a[0], a[1], Z_EAVE - 0.2], eb: V3 = [b[0], b[1], Z_EAVE - 0.2]
    const out: V3 = [Math.cos(am), Math.sin(am), 0.2]
    face(skirt, [foot, eb, ea], out)
    face(skirt, [foot, ea, eb], [-out[0], -out[1], -1]) // its underside, seen past the corners
    // glazed recess between this facet's edge and the next corner's base
    const ba: V3 = [RB * Math.cos(ang(i)), RB * Math.sin(ang(i)), 0], bb: V3 = [RB * Math.cos(ang(i + 1)), RB * Math.sin(ang(i + 1)), 0]
    const ra: V3 = [RB * Math.cos(ang(i)), RB * Math.sin(ang(i)), Z_EAVE - 0.2], rb: V3 = [RB * Math.cos(ang(i + 1)), RB * Math.sin(ang(i + 1)), Z_EAVE - 0.2]
    const glz = (p: V3[]) => face(glazing, p, out)
    glz([ba, bb, rb, ra])
    // soffit from the recess top out to the eave
    face(skirt, [ra, rb, eb, ea], [0, 0, -1])
    tube(trim, [a[0] * 0.985, a[1] * 0.985, 0], [a[0] * 0.985, a[1] * 0.985, Z_EAVE - 0.2], 0.8, 0.8, 6, false, false, 0, true)
  }

  return [
    { part: membrane, material: finish('kspo-membrane', 0xeae9e4) },
    { part: trim, material: finish('kspo-white', 0xf6f5f1) },
    { part: skirt, material: { ...finish('kspo-silver', 0xb7bbbf), floodlight: (_p: V3, n: V3) => (n[2] < -0.5 ? 0 : 0.6) } },
    { part: glazing, material: PALETTE.window },
    { part: sky, material: { name: 'glass', color: 0xb4bec7, roughness: 0.24 } },
  ]
}

if (import.meta.main) await save('seoul-kspo-dome', 'KSPO Dome', [37.5192312, 127.1274701], 0, build() as any, 6500)
