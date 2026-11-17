/**
 * Eye Filmmuseum (Delugan Meissl Associated Architects, 2012), IJpromenade,
 * Amsterdam-Noord: original procedural geometry, CC0-1.0.
 * bun generators/amsterdam-eye-filmmuseum.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = area centroid of the OSM outline way/127505497 (the
 * building's upper level, which holds the cantilever), 52.384367,
 * 4.900839. Its long south side on the IJ runs at 95.4 degrees, so the
 * catalog bearing is 5.4 and that side lies along y = -25.
 *
 * Identity, in order: a white, sharply faceted body, low and wedge-nosed
 * at the west, rising eastward in sloping planes to a long prow that
 * cantilevers some 28 m past the ground floor toward the A'DAM Toren; the
 * roof falling south from a high north ridge, so from the IJ one sees a
 * big tilted white plane; the dark glass band of the café along the south
 * front, under the white body; the glazed ground floor on its white slab.
 * Floodlit white at night.
 *
 * Evidence:
 *  - plan: OSM way/127505497 (upper level, layer 2), way/1206726812 (ground
 *    floor, level 0) and way/1207014127 (the low terrace to the south-east,
 *    level 0), all three the same BAG object 0363100012237838 (start 2011).
 *    Read in the turned frame: upper level x -52.2..65.8, y -37.2..42.7;
 *    the ground floor stops at x 37.8, so the prow overhangs about 28 m.
 *    The terrace is paving and steps at ground level, which the map draws;
 *    it is not modelled and not in `replaces` (only the slim leg stands on
 *    it).
 *  - heights and facets (second round, after lead review): photo-scaled
 *    from Slaunger's and Henk Monster's level photos from across the IJ
 *    (the building's 118 m span at about 9.6 px/m) and Vellut's from the
 *    north-west. The upper body is drawn as explicit facets between a top
 *    and a bottom point at each outline corner (see V below):
 *    - the thin west tip at the north-west corner, 8.1-8.8 m;
 *    - the south front's top edge 13.2 m at the south-west corner, 12.4 m
 *      at x 9.5 and 12 m where the prow starts; one ridge from the
 *      south-west corner up to 22.4 m over the prow's root, so the south
 *      side is one big tilted plane (with the inclined slit window);
 *    - the prow: top 21.5-21.8 m at the tip; its east face leans out
 *      about 4.8 m over a 15 m underside; the underside rises from the
 *      café's east end (3.9 m at x 9.5) to the tip; a slim leg under it;
 *    - the north side tall (top 19.5-21.8 m, 15 m at the north-west),
 *      leaning out over a dark lower storey set 1.5 m back from 3.6 to
 *      11 m; the café glazing is the south part of that storey, under the
 *      white front's lower edge at 10 m;
 *    - glazed ground floor 0-3 m under a white slab to 3.6 m.
 *    No published height was found.
 *  - colours: white aluminium cladding, drawn a cool light grey (walls
 *    0xe6e8e8, the roof planes a shade darker) so the facets separate and
 *    the body holds against pale ground at phone size; dark café glazing
 *    as `window`.
 *  - night (Gadogado123's night photo): the whole body floodlit white;
 *    `_FLOODLIGHT` on every white face, less on the roof.
 *  - elevation 0 (IJ bank, about 1 m NAP). No lidar.
 *
 * Photos (Wikimedia Commons, all evidence):
 *  - EYE_Film_Institute_Amsterdam_from_tour_boat_2016-09-12-6548.jpg
 *    (Slaunger, CC BY-SA 4.0): the south front, level; the main ruler.
 *  - Eye_filmmuseum_with_magnificent_skies_at_11_Februari_2016_-_panoramio
 *    .jpg (Henk Monster, CC BY 3.0): the south front.
 *  - EYE_Filmmuseum.jpg (Jvhertum, CC BY-SA 3.0): south-east, the prow.
 *  - Eye_(filmmuseum).JPG (Marion Golsteijn, CC BY-SA 3.0): from the east
 *    under the prow.
 *  - EYE_Filmmuseum_@_Amsterdam-Noord_@_Amsterdam_(16000621439).jpg and
 *    (22563494720).jpg (Guilhem Vellut, CC BY 2.0): the north-west side and
 *    the south front.
 *  - The_Eye_filmmuseum,_Amsterdam_in_the_Netherlands,_by_night.jpg
 *    (Gadogado123, CC BY-SA 4.0): night.
 * No commercial imagery. No look-only sources.
 *
 * Left out: the panel joints, the "eye" logo, the stairs and the
 * terraces' railings.
 *
 * Doubts: nine big facets stand for the real building's many; the
 * ridge's line in plan is inferred from the south silhouette (no open
 * aerial was found); the north side is seen in only one photo (Vellut's
 * from the north-west, during the A'DAM Toren's renovation).
 */
import { Part, cross, sub, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cap, inset, save, type XY } from './chi-aon-center'
import { face } from './phl-independence-hall'
import { bar, bprism, ccw, prism } from './amsterdam-adam-toren'

const UPPER: XY[] = [[63.9, -7.8], [65.8, -26.8], [59.9, -27.5], [54.4, -26.7], [50.5, -26.1], [44.0, -25.2], [48.0, -31.8], [44.5, -34.9], [41.9, -37.2], [33.6, -28.0], [30.9, -25.0], [27.5, -25.0], [-2.2, -25.0], [-17.1, -25.0], [-32.2, -25.1], [-43.4, 6.7], [-52.2, 37.1], [-23.1, 42.7], [-19.5, 40.1], [-3.1, 23.0], [3.0, 16.7], [34.3, 4.3], [38.3, 2.7], [62.2, -7.1]]
const GROUND: XY[] = [[29.9, -25.0], [-2.2, -25.0], [-17.1, -25.0], [-18.6, -23.6], [-35.6, -7.1], [-36.5, -6.3], [-38.3, 4.8], [-39.4, 11.5], [-41.9, 26.5], [-32.7, 27.9], [-24.2, 29.2], [-13.7, 17.8], [-11.8, 17.9], [-12.1, 20.0], [-4.8, 21.2], [5.0, 10.6], [23.7, 2.8], [30.7, -0.3], [29.8, -14.9], [27.7, -15.3], [27.7, -16.9], [35.1, -18.4], [37.8, -22.9], [35.6, -24.8]]

/** Clip a ring to x >= x0 (keep 1) or x <= x0 (keep -1). */
function clipX(r: XY[], x0: number, keep: 1 | -1): XY[] {
  const inside = (p: XY) => (p[0] - x0) * keep >= -1e-9
  const out: XY[] = []
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    if (inside(a)) out.push(a)
    if (inside(a) !== inside(b)) { const t = (x0 - a[0]) / (b[0] - a[0]); out.push([x0, a[1] + t * (b[1] - a[1])]) }
  }
  return out
}

const SLAB = 3.6 // top of the glazed ground floor's white slab
const CAFE = 10.0 // top of the recessed café glazing on the south front

/**
 * The upper body as explicit facets. Each outline corner has a top point
 * and a bottom point; the bottom ring is pulled in where the walls lean
 * out (the north side and the east face overhang), and the roof is cut
 * into big planes by one ridge from the south-west corner to the prow.
 * Plan points are the OSM upper outline's corners in the turned frame.
 */
const V = {
  // top                                         bottom
  a: { t: [-52.2, 37.1, 8.8], b: [-52.2, 37.1, 8.1] }, // the thin west tip
  b: { t: [-43.4, 6.7, 11.0], b: [-40.5, 6.7, SLAB] }, // west side
  c: { t: [-32.2, -25.1, 13.2], b: [-32.2, -25.1, CAFE] }, // south-west corner
  m: { t: [9.5, -25.0, 12.4], b: [9.5, -25.0, SLAB + 0.3] }, // south front: the café band's east end
  d: { t: [30.9, -25.0, 12.0], b: [30.9, -25.0, 8.5] }, // south front, where the prow starts
  e: { t: [65.8, -26.8, 21.5], b: [61.0, -25.6, 15.0] }, // prow tip, south (east face leans out)
  f: { t: [63.9, -7.8, 21.8], b: [59.2, -9.0, 15.0] }, // prow tip, north
  g: { t: [34.3, 4.3, 21.8], b: [29.5, 0.5, 9.0] }, // north side at the prow (leans out)
  h: { t: [-3.1, 23.0, 19.5], b: [-4.0, 21.0, 11.0] }, // north side, over the recessed lower wall
  i: { t: [-23.1, 42.7, 15.0], b: [-23.5, 40.0, 10.5] }, // north-west corner
} as const
const R2: V3 = [40.0, -12.0, 22.4] // the ridge's high end over the prow's root
const RING = ['a', 'b', 'c', 'm', 'd', 'e', 'f', 'g', 'h', 'i'] as const // counter-clockwise

function build() {
  const white = new Part(), win = new Part(), roofW = new Part()
  const slab = white
  const T = (k: keyof typeof V) => V[k].t as unknown as V3, B = (k: keyof typeof V) => V[k].b as unknown as V3

  // Roof planes: the big south-facing plane from the front's top edge up to
  // the ridge; the prow's south face and top; the north roof falling from
  // the ridge to the north edge and down to the west tip.
  const tris: [V3, V3, V3][] = [
    [T('c'), T('m'), R2],
    [T('m'), T('d'), R2],
    [T('d'), T('e'), R2],
    [R2, T('e'), T('f')],
    [R2, T('f'), T('g')],
    [T('c'), R2, T('h')],
    [R2, T('g'), T('h')],
    [T('c'), T('h'), T('i')],
    [T('c'), T('i'), T('b')],
    [T('b'), T('i'), T('a')],
  ]
  for (const t of tris) face(roofW, t, [0, 0, 1])
  // The inclined slit window in the prow's south face.
  {
    const d = T('d'), e = T('e')
    const P = (u: number, v: number): V3 => [0, 1, 2].map((k) => d[k] + u * (e[k] - d[k]) + v * (R2[k] - d[k])) as V3
    const n = cross(sub(e, d), sub(R2, d)), l = Math.hypot(...n), o: V3 = [n[0] / l * 0.08, n[1] / l * 0.08, n[2] / l * 0.08]
    const q = (u: number, v: number): V3 => { const p = P(u, v); return [p[0] + o[0], p[1] + o[1], p[2] + o[2]] }
    face(win, [q(0.2, 0.2), q(0.27, 0.2), q(0.24, 0.78), q(0.17, 0.78)], n)
  }

  // Underside: the bottom ring, triangulated in plan.
  {
    const ring = RING.map((k) => B(k))
    const tmp = new Part()
    cap(tmp, ring.map((p) => [p[0], p[1]] as XY), 0)
    const near = (x: number, y: number) => ring.reduce((m, p) => (Math.hypot(p[0] - x, p[1] - y) < Math.hypot(m[0] - x, m[1] - y) ? p : m))
    for (let i = 0; i < tmp.pos.length; i += 9) {
      const pts = [0, 1, 2].map((k) => near(tmp.pos[i + 3 * k], -tmp.pos[i + 3 * k + 2]))
      face(white, pts, [0, 0, -1])
    }
  }

  // Walls between the bottom and top rings: sloped where the rings differ.
  for (let k = 0; k < RING.length; k++) {
    const p = RING[k], q = RING[(k + 1) % RING.length]
    const n: V3 = [T(q)[1] - T(p)[1], -(T(q)[0] - T(p)[0]), 0]
    face(white, [B(p), B(q), T(q)], n)
    face(white, [B(p), T(q), T(p)], n)
  }

  // The lower storey under the white body: dark glazing set 1.5 m back
  // (the café on the south, the recessed north wall), west of the prow;
  // then the glazed ground floor under its white slab. The low terrace to
  // the south-east is ground, left to the map.
  const G = ccw(GROUND)
  prism(win, inset(ccw(clipX(G, 9.5, -1)), 1.5), SLAB, 11.0, null)
  prism(win, G, 0, 3.0, null)
  bprism(slab, slab, G, 3.0, SLAB, 0.2)

  // The slim white leg under the prow, from the terrace up into the underside.
  bar(white, [45.5, -31.0, 0.6], [39.0, -27.0, 11.2], 2.6, 1.4)

  const flood = (_p: V3, n: V3) => (n[2] > 0.6 ? 0.35 : 0.9)
  return [
    { part: white, material: { ...finish('eye-white', 0xe6e8e8), floodlight: flood } },
    { part: roofW, material: { ...finish('eye-roof', 0xd9dcdd), floodlight: flood } },
    { part: win, material: { ...PALETTE.window } },
  ]
}

if (import.meta.main) await save('amsterdam-eye-filmmuseum', 'Eye Filmmuseum', [52.384367, 4.900839], 5.4, build(), 5000)
