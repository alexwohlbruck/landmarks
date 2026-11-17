/**
 * Palacio de Bellas Artes (1904-1934, Adamo Boari, completed by Federico
 * Mariscal), Mexico City: procedural, CC0-1.0.
 * bun generators/mexico-city-palacio-de-bellas-artes.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 9 (the walls
 * run 9 degrees east of north, like the Alameda's street grid). Model -y is
 * the main front (compass 189), facing the explanade and Avenida Juarez,
 * with the Alameda off its west (left) shoulder; +y is the stagehouse on
 * Avenida Hidalgo. Origin: the area centroid of OSM way/157051087
 * (-99.141263, 19.4354684). The building is symmetric about x = +0.2 (the
 * axis of the porch and of the outline), so it is modelled about x = 0 and
 * shifted by AX at the end. y = 0 is the ground: the site is on the flat
 * lake-bed basin (~2,240 m); Mapterhorn has no z15 terrain here, so no
 * terrain was read. The building has settled about 4 m into the old lake bed
 * since 1910; it is modelled level, standing on the street.
 *
 * Form: a white marble body (two orders over a rusticated ground storey,
 * attic and corner pavilions with oculi), a curved columned porch on the
 * front and on each side, the great arched frontispiece in the middle of the
 * front with sculpture groups on its shoulders, a barrel vault behind it;
 * over the lobby the rectangular drum with corner piers and arched windows
 * carrying the main dome (ribbed, its glazed-tile panels orange at the foot
 * and gold above, dark ribs), the dark lantern and the bronze group of
 * figures and the eagle; two lower ribbed side domes east and west of it;
 * the auditorium's white segmental vault behind; the tall stagehouse at the
 * back with corner turrets and a dark curved roof; low domed rotundas on the
 * two rear corners.
 *
 * Sources
 * - OSM (ODbL): outline way/157051087 (building=theatre, height=53) and its
 *   parts way/1436125232 (body, 28), 1436125227 (upper volume, 30),
 *   1436125226 (drum, 37), 1436125225 (main dome, 37-45, gold),
 *   1466114121 (lantern, 45-48, dimgrey), 1436127889 (side-dome blocks,
 *   35, gold), 1436127890 (auditorium vault, round, 33), 1436128176 (front
 *   vault, round, 30), 1436125222 (stagehouse, 37), 1436125228/29/30/31
 *   (porches, 14). Plan dimensions are all from these ways, read in this
 *   frame and symmetrised (they agree side to side within 0.4 m).
 * - Photos (Wikimedia Commons, EVIDENCE):
 *   Daniel Case, "Front view of Palacio de Bellas Artes at night.jpg",
 *     CC BY-SA 3.0 (a level, square-on front view: every front height below
 *     is scaled from it, calibrated on the porch's 15.4 m width);
 *     https://commons.wikimedia.org/wiki/File:Front_view_of_Palacio_de_Bellas_Artes_at_night.jpg
 *   Jose Luiz, "Main facade - Palacio de Bellas Artes - Mexico 2024.jpg" and
 *     "Nortwest corner of Palacio de Bellas Artes - Mexico 2024.jpg",
 *     CC BY-SA 4.0;
 *     https://commons.wikimedia.org/wiki/File:Main_facade_-_Palacio_de_Bellas_Artes_-_Mexico_2024.jpg
 *     https://commons.wikimedia.org/wiki/File:Nortwest_corner_of_Palacio_de_Bellas_Artes_-_Mexico_2024.jpg
 *   Daniel Case, "Palaco de Bellas Artes, Mexico City, from across Eje
 *     Central Lazaro Cardenas in evening.jpg", CC BY-SA 3.0 (south-east);
 *     https://commons.wikimedia.org/wiki/File:Palaco_de_Bellas_Artes,_Mexico_City,_from_across_Eje_Central_Lazaro_Cardenas_in_evening.jpg
 *   Diego Delso, "Palacio de Bellas Artes, Ciudad de Mexico, Mexico,
 *     2015-07-18, DD 10.JPG", CC BY-SA 4.0 (from above, west);
 *     https://commons.wikimedia.org/wiki/File:Palacio_de_Bellas_Artes,_Ciudad_de_M%C3%A9xico,_M%C3%A9xico,_2015-07-18,_DD_10.JPG
 *   Adam Jones, "View of Palacio de Bellas Artes from Torre Latinoamericana -
 *     Centro - Mexico City - Mexico - 02 (31214238467).jpg", CC BY-SA 2.0
 *     (from above, south-east: plan, roofs, domes);
 *     https://commons.wikimedia.org/wiki/File:View_of_Palacio_de_Bellas_Artes_from_Torre_Latinoamericana_-_Centro_-_Mexico_City_-_Mexico_-_02_(31214238467).jpg
 *   Jeses, "Mexico City Palacio de bellas artes.jpg", CC BY-SA 2.5 (from
 *     Torre Latinoamericana; older, with the roof terraces then painted red);
 *     https://commons.wikimedia.org/wiki/File:Mexico_City_Palacio_de_bellas_artes.jpg
 *   Luisalvaz, "Vista de Bellas Artes desde la Torre Latinoamericana 2.JPG",
 *     CC BY-SA 4.0 (the arch and the front vault behind it);
 *     https://commons.wikimedia.org/wiki/File:Vista_de_Bellas_Artes_desde_la_Torre_Latinoamericana_2.JPG
 * Measured (OSM): the plan of every part. Published: total height 53 m
 *   (OSM height tag; the eagle's tip). Estimated from the square-on front
 *   photo (perspective-corrected for depth): ground-storey balustrade 8.6 m,
 *   main cornice 19.4, attic 22.6, pavilion attics 24.2, arch crown 25.2
 *   (outer radius 7.45, tympanum 4.7), arch sculpture to ~26.5, drum walls
 *   33.0 with corner piers to 34.8, main dome 33.0 -> 44.0 at radius 10.8,
 *   lantern and figure group 44 -> 50.8, eagle to 53.3; side domes spring at
 *   ~23.8 (6.0 x 8.8 m oval) and rise to ~29.4, so from the street only their
 *   upper half shows over the pavilion attics (review round 1). OSM's 37 m for the drum and 14 m
 *   for the porches do not match the photos (the porches carry a balcony at
 *   ~9.5 m; the dome springs at ~33 m): photo values used.
 *   Stagehouse 37.3 at the crown (OSM 37), its walls 34.5; auditorium vault
 *   crown 33 (OSM); front vault crown 27.1 (photo: just above the arch).
 * Estimated from photos: window, column and bay positions, the rotunda domes
 *   on the rear corners, the stagehouse's windows and turrets.
 * Doubts: the rear (north) facade and the stagehouse's east face are seen in
 *   only one oblique photo each; their windows are a plain rhythm. The main
 *   dome is drawn round (OSM maps it slightly oval, 24 x 19 m; the lobby's
 *   inner glass ceiling is oval, but the outer dome reads round in every
 *   photo). The assignment said the front faces west: OSM and every photo
 *   put the main front on the south side (the Alameda is off its west
 *   shoulder), so it is modelled facing south.
 * Left out: the sculpture and relief work (only the two groups on the arch
 *   shoulders are kept, as plain masses), balustrades, Pegasus statues on the
 *   explanade (not part of the building), the lettering in the arch.
 * Colour: Carrara marble reads a cool off-white in daylight (#e9e5dd, a touch
 *   cooler than `stone`). The main dome's tile panels run orange at the foot
 *   to gold above, with dark slate ribs; the side domes are tiled the same way.
 *   Roof terraces read near-white today (Adam Jones, Delso), not the red of
 *   the older Jeses photo, so they are marble. A shaded-stone grey lines the
 *   recessed loggia bays behind the projecting paired columns, the porch's
 *   back wall and the arch's deep recess (tympanum), and colours the shoulder
 *   sculpture and the stagehouse roof. The lantern group is dark bronze.
 * Night: the marble is floodlit (`floodlight`), the dome panels glow (lit
 *   from inside and floodlit), windows are `window`.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, type Swatch } from './palette'
import { type XY, type Face, prism, rect, chamfer, flatShape, extrudeShape, lathe, disc, arc, archShape, archBand, capRing, ccw, outward, finishGlb, writeModel } from './sea-tacoma-union-station'
import { qf, box } from './atl-georgia-state-capitol'

const AX = 0.2 // the symmetry axis, east of the centroid
const BELT = 8.6, ENT = 15.4, CORN = 19.4, ATTIC = 22.6, PAVT = 24.2, UP = 27.5
const DY = -23.4 // the dome axis (y)
const DRUM_TOP = 33.0
const UPV = 23.6 // the blocks under the side domes
const REPLACES = ['way/157051087', 'way/1436125222', 'way/1436125225', 'way/1436125226', 'way/1436125227', 'way/1436125228', 'way/1436125229', 'way/1436125230', 'way/1436125231', 'way/1436125232', 'way/1436127889', 'way/1436127890', 'way/1436128176', 'way/1466114121']

/** Mirror a +x half ring (from x = 0 at the back round to x = 0 at the front) into a full ccw ring. */
function sym(half: XY[]): XY[] {
  const back = half.slice(1, -1).map(([x, y]) => [-x, y] as XY).reverse()
  return ccw([...half, ...back])
}
/** Miter offset of a ccw ring, outward by d. */
function offset(r: XY[], d: number): XY[] {
  const n = r.length
  return r.map((q, i) => {
    const p = r[(i - 1 + n) % n], s = r[(i + 1) % n]
    const a = outward(p, q), b = outward(q, s)
    const k = d / (1 + a[0] * b[0] + a[1] * b[1])
    return [q[0] + (a[0] + b[0]) * k, q[1] + (a[1] + b[1]) * k] as XY
  })
}
/** A face on an axis-aligned wall; `s` is measured so world x (or y) maps through `sw`. */
const face = (x: number, y: number, n: XY): Face => ({ o: [x, y, 0], n })
const sw = (f: Face, x: number, y: number) => (x - f.o[0]) * -f.n[1] + (y - f.o[1]) * f.n[0]

function build() {
  const marble = new Part(), win = new Part(), gold = new Part(), orange = new Part(), dark = new Part(), roof = new Part()
  // The roof terraces read almost white from Torre Latinoamericana (Adam Jones, Delso): marble.
  // `roof` is the shaded-stone grey: the loggia and porch recesses, the tympanum, the shoulder
  // sculpture and the stagehouse roof.
  const terr = marble

  // ---------------------------------------------------------------- the body
  const arcPts = arc(23.3, 44.9, 6.4, 98, 0, 6).slice(0, -1)
  const body = sym([
    [0, 52.8], [22.3, 52.8], [22.3, 51.3], ...arcPts, [29.6, 44.9], [30.6, 44.9], [30.6, 19.6], [28.0, 19.6], [28.0, -13.1],
    [34.6, -13.1], [34.6, -33.1], [29.1, -33.1], [29.1, -47.2], [25.3, -47.2], [25.3, -51.0], [12.9, -51.0], [12.9, -49.6], [0, -49.6],
  ])
  const bodyB = chamfer(body, 0.35)
  prism(marble, null, bodyB, 0, CORN - 0.8)
  prism(marble, null, offset(bodyB, 0.3), BELT, BELT + 0.7) // ground-storey cornice / balcony line
  prism(marble, null, offset(bodyB, 0.55), CORN - 0.8, CORN) // main cornice
  prism(marble, terr, bodyB, CORN, ATTIC) // attic and the roof terrace

  // Corner pavilions on the front and the side pavilions: raised attics with an oculus.
  for (const sx of [-1, 1]) {
    const [a, b] = sx > 0 ? [12.9, 25.3] : [-25.3, -12.9]
    box(marble, terr, a, -51.0, b, -44.5, ATTIC - 0.3, PAVT, 0.35)
    const fp = face(0, -51.0, [0, -1])
    extrudeShape(marble, fp, [[sx * 19.1 - 5.0, PAVT], [sx * 19.1 + 5.0, PAVT], ...arc(sx * 19.1, PAVT - 8.6, 10.0, 60, 120, 6).slice(1, -1).map(([s, z]) => [s, z] as XY)], 0, 0.6) // segmental crest
    flatShape(win, fp, arc(sx * 19.1, 20.9, 1.9, 0, 360, 12).slice(0, -1), 0.07)
    const xs = sx * 34.6
    box(marble, terr, Math.min(xs, sx * 28.5), -33.1, Math.max(xs, sx * 28.5), -13.1, ATTIC - 0.3, PAVT, 0.35)
    const fs = face(xs, 0, [sx, 0])
    const sc = sw(fs, xs, DY)
    extrudeShape(marble, fs, [[sc - 5.0, PAVT], [sc + 5.0, PAVT], ...arc(sc, PAVT - 8.6, 10.0, 60, 120, 6).slice(1, -1).map(([s, z]) => [s, z] as XY)], 0, 0.6)
    flatShape(win, fs, arc(sc, 20.9, 1.9, 0, 360, 12).slice(0, -1), 0.07)
  }

  // ---------------------------------------------------------------- facade panels
  const W = (f: Face, s: number, w: number, z0: number, z1: number, arch = false) =>
    flatShape(win, f, arch ? archShape(s, w, z0, z1 - w / 2, 8) : [[s - w / 2, z0], [s + w / 2, z0], [s + w / 2, z1], [s - w / 2, z1]], 0.06)
  const col = (x: number, y: number, z0 = BELT + 0.7, z1 = ENT, r = 0.55) => {
    lathe(marble, x, y, [[r, z0], [r * 0.9, z1]], 6)
    box(marble, null, x - r - 0.15, y - r - 0.15, x + r + 0.15, y + r + 0.15, z1, z1 + 0.6, 0)
  }
  const R1: [number, number] = [9.5, 12.6], R2: [number, number] = [13.2, 15.0] // the two upper window rows

  // the front (south)
  const Fc = face(0, -49.6, [0, -1]), Fp = face(0, -51.0, [0, -1]), Fr = face(0, -47.2, [0, -1])
  // The upper storey is a loggia: paired columns standing ~1.5 m proud of
  // the wall, the bays between them recessed and in shade (a shaded-stone
  // lining, the windows on it), a projecting entablature over them.
  const LZ0 = BELT + 0.7
  const shade = (f: Face, s0: number, s1: number, z0 = LZ0, z1 = ENT) => flatShape(roof, f, [[s0, z0], [s1, z0], [s1, z1], [s0, z1]], 0.03)
  const pair = (f: Face, y: number, a: number, b: number) => {
    for (const x of [a, b]) col(x, y - 1.0, LZ0, ENT, 0.55)
  }
  for (const [f, x0, x1] of [[Fc, -12.9, 12.9], [Fp, 12.9, 25.3], [Fp, -25.3, -12.9]] as [Face, number, number][]) {
    shade(f, x0, x1)
    box(marble, null, x0, f.o[1] - 1.7, x1, f.o[1], ENT, ENT + 1.0, 0.15) // the entablature, carried forward on the columns
    box(marble, null, x0, f.o[1] - 1.5, x1, f.o[1], BELT, LZ0, 0.15) // the balcony ledge under the columns
  }
  for (const sx of [-1, 1]) {
    // centre bays
    for (const x of sx > 0 ? [0, 2.0, 7.7, 9.6] : [-2.0, -7.7, -9.6]) for (const [z0, z1] of [R1, R2]) W(Fc, x, 1.7, z0, z1)
    W(Fc, sx * 9.2, 2.0, 1.8, 6.6) // ground windows beside the porch
    pair(Fc, -49.6, sx * 3.75, sx * 5.45)
    pair(Fc, -49.6, sx * 11.6, sx * 12.4)
    // corner pavilions: an arched door below, a pair of tall windows above, paired columns either side
    W(Fp, sx * 19.1, 3.8, 0.3, 6.5, true)
    flatShape(marble, Fp, archBand(sx * 19.1, 4.6, 1.9, 2.6, 0.3, 8), 0.12)
    for (const x of [18.0, 20.2]) for (const [z0, z1] of [R1, R2]) W(Fp, sx * x, 1.7, z0, z1)
    pair(Fp, -51.0, sx * 14.3, sx * 15.9)
    pair(Fp, -51.0, sx * 22.3, sx * 23.9)
    // the returns
    W(Fr, sx * 27.2, 1.6, 1.8, 6.4)
    for (const [z0, z1] of [R1, R2]) W(Fr, sx * 27.2, 1.6, z0, z1)
  }
  // the porch: a segmental bow of columns carrying a balcony
  {
    const PR = 9.55, PCY = -46.65
    const a0 = (Math.asin(7.7 / PR) * 180) / Math.PI
    const bow: XY[] = [[7.7, -49.6], ...arc(0, PCY, PR, -90 + a0, -90 - a0, 12).map(([x, y]) => [x, y] as XY), [-7.7, -49.6]]
    const slab = ccw(bow)
    prism(marble, null, chamfer(slab, 0.3), BELT - 1.3, BELT + 0.7)
    capRing(marble, slab, BELT + 0.7)
    prism(marble, null, offset(slab, -0.25), BELT + 0.7, BELT + 1.6) // balustrade
    capRing(marble, offset(slab, -0.25), BELT + 1.6)
    for (let k = 0; k <= 7; k++) {
      const a = ((-90 + a0 - 0.6 - ((2 * a0 - 1.2) * k) / 7) * Math.PI) / 180
      lathe(marble, (PR - 0.9) * Math.cos(a), PCY + (PR - 0.9) * Math.sin(a), [[0.5, 0.3], [0.45, BELT - 1.3]], 8)
    }
    flatShape(roof, Fc, [[-7.7, 0.3], [7.7, 0.3], [7.7, BELT - 1.3], [-7.7, BELT - 1.3]], 0.03) // the porch's shaded back wall
    W(Fc, 0, 7.0, 0.3, 6.6) // the doors and the lobby glazing behind the columns
  }
  // the frontispiece: a tall round arch rising above the cornice, the tympanum set back
  {
    // a bold semicircular rim standing 2.4 m proud; inside it a deep recess
    // whose back is the grey sculptured tympanum
    const AR = 7.45, AZ = 17.8, AI = 6.1
    extrudeShape(marble, Fc, archBand(0, AZ, AI, AR, ENT + 1.0, 14), 0, 2.4)
    flatShape(roof, Fc, [[-AI, ENT + 1.0], [AI, ENT + 1.0], ...arc(0, AZ, AI, 0, 180, 14).slice(1, -1)], 0.03)
    // the sculpture groups on the shoulders, as plain masses in the darker shaded-stone grey
    for (const sx of [-1, 1]) {
      const x = sx * 5.3, y = -49.6 - 1.3
      lathe(roof, x, y, [[1.3, 22.6], [1.45, 24.1], [1.15, 25.4], [0.55, 26.4], [0.01, 26.6]], 6)
    }
  }

  // the sides (east and west alike)
  for (const sx of [-1, 1] as const) {
    const n: XY = [sx, 0]
    const f1 = face(sx * 29.1, 0, n), f2 = face(sx * 34.6, 0, n), f3 = face(sx * 28.0, 0, n), f4 = face(sx * 30.6, 0, n)
    const S = (f: Face, y: number) => sw(f, f.o[0], y)
    for (const y of [-44.2, -36.4]) {
      W(f1, S(f1, y), 1.6, 1.8, 6.4)
      for (const [z0, z1] of [R1, R2]) W(f1, S(f1, y), 1.6, z0, z1)
    }
    for (const y of [-38.5, -42.1]) col(sx * (29.1 + 0.6), y)
    // the side pavilion: a big arched window over the curved porch, windows either side
    W(f2, S(f2, DY), 4.6, BELT + 1.1, 17.4, true)
    flatShape(marble, f2, archBand(S(f2, DY), 17.4 - 2.3, 2.3, 2.9, BELT + 1.1, 10), 0.12)
    for (const y of [-30.6, -15.6]) {
      W(f2, S(f2, y), 1.5, 1.8, 6.4)
      for (const [z0, z1] of [R1, R2]) W(f2, S(f2, y), 1.5, z0, z1)
    }
    for (const y of [-28.4, -18.2]) col(sx * (34.6 + 0.6), y)
    {
      const PR = 8.1, PCX = sx * 30.2
      const a0 = (Math.asin(6.8 / PR) * 180) / Math.PI
      const ang = sx > 0 ? 0 : 180
      const bow: XY[] = [[sx * 34.6, DY - 6.8], ...arc(PCX, DY, PR, ang - sx * a0, ang + sx * a0, 10).map(([x, y]) => [x, y] as XY), [sx * 34.6, DY + 6.8]]
      const slab = ccw(bow)
      prism(marble, null, chamfer(slab, 0.3), BELT - 1.3, BELT + 0.7)
      capRing(marble, slab, BELT + 0.7)
      prism(marble, null, offset(slab, -0.25), BELT + 0.7, BELT + 1.6)
      capRing(marble, offset(slab, -0.25), BELT + 1.6)
      for (let k = 0; k <= 5; k++) {
        const a = ((ang - a0 + 1 + ((2 * a0 - 2) * k) / 5) * Math.PI) / 180 // symmetric about ang either way
        lathe(marble, PCX + (PR - 0.8) * Math.cos(a), DY + (PR - 0.8) * Math.sin(a), [[0.4, 0.3], [0.36, BELT - 1.3]], 8)
      }
      W(f2, S(f2, DY), 5.4, 0.3, 6.4)
    }
    // the loggia between the side pavilion and the stage end: a dark recess behind eight columns
    W(f3, S(f3, 3.25), 30.0, BELT + 1.0, ENT - 0.1)
    for (let k = 0; k < 7; k++) col(sx * (28.0 + 0.9), -11.0 + (28.5 * k) / 6)
    for (let k = 0; k < 6; k++) W(f3, S(f3, -9.6 + (25.7 * k) / 5), 1.6, 1.8, 6.4)
    // the stage end of the body
    for (const y of [23.6, 29.3, 35.0, 40.7]) {
      W(f4, S(f4, y), 1.6, 1.8, 6.4)
      for (const [z0, z1] of [R1, R2]) W(f4, S(f4, y), 1.6, z0, z1)
    }
  }
  // the back (north)
  {
    const fb = face(0, 52.8, [0, 1])
    for (const x of [-18.6, -12.4, 12.4, 18.6]) {
      W(fb, sw(fb, x, 52.8), 1.6, 1.8, 6.4)
      for (const [z0, z1] of [R1, R2]) W(fb, sw(fb, x, 52.8), 1.6, z0, z1)
    }
    box(marble, terr, -6.25, 52.0, 6.25, 55.9, 0, BELT + 0.7, 0.3) // the rear porch
    W(face(0, 55.9, [0, 1]), 0, 6.0, 0.3, 6.4)
    for (const x of [-6.0, 6.0]) W(fb, sw(fb, x, 52.8), 2.6, BELT + 1.4, ENT - 0.2, true)
  }
  // low domed rotundas on the rear corners
  for (const sx of [-1, 1]) {
    lathe(marble, sx * 23.3, 44.9, [[5.6, ATTIC - 0.2], [5.6, ATTIC + 0.8], [5.2, ATTIC + 0.8], [4.6, ATTIC + 2.0], [3.3, ATTIC + 3.1], [1.6, ATTIC + 3.6], [0.01, ATTIC + 3.7]], 14)
  }

  // ---------------------------------------------------------------- the upper volume and the vaults
  const upper = sym([[0, -7.0], [24.3, -7.0], [24.3, -13.3], [27.3, -17.3], [27.3, -30.0], [24.2, -33.5], [24.2, -36.6], [13.8, -36.6], [13.8, -33.0], [0, -33.0]])
  prism(marble, null, chamfer(upper, 0.35), ATTIC - 0.5, UPV - 0.5)
  prism(marble, terr, offset(chamfer(upper, 0.35), 0.25), UPV - 0.5, UPV)

  /** A segmental barrel vault along y between y0 and y1 over x = ±hw: springing at zs, crown at zc. End faces in `end`. */
  const vault = (hw: number, y0: number, y1: number, zs: number, zc: number, top: Part, end: Part, n = 10) => {
    const sag = zc - zs, R = (hw * hw + sag * sag) / (2 * sag), zC = zc - R
    const t0 = Math.asin(hw / R)
    const P = (t: number, y: number): V3 => [R * Math.sin(t), y, zC + R * Math.cos(t)]
    const N = (t: number): V3 => [Math.sin(t), 0, Math.cos(t)]
    for (let k = 0; k < n; k++) {
      const a = -t0 + (2 * t0 * k) / n, b = -t0 + (2 * t0 * (k + 1)) / n
      top.tri(P(a, y0), P(b, y0), P(b, y1), undefined, undefined, undefined, [N(a), N(b), N(b)])
      top.tri(P(a, y0), P(b, y1), P(a, y1), undefined, undefined, undefined, [N(a), N(b), N(a)])
    }
    const prof: XY[] = []
    for (let k = 0; k <= n; k++) { const t = -t0 + (2 * t0 * k) / n; prof.push([R * Math.sin(t), zC + R * Math.cos(t)]) }
    for (const [y, ny] of [[y0, -1], [y1, 1]] as [number, number][]) {
      const f = face(0, y, [0, ny])
      flatShape(end, f, prof.map(([x, z]) => [sw(f, x, y), z] as XY), 0)
    }
  }
  // the front vault behind the arch
  prism(marble, null, rect(-7.7, -49.4, 7.7, -36.6), ATTIC - 0.5, ATTIC + 0.1)
  vault(7.7, -49.4, -36.4, ATTIC + 0.1, 27.1, marble, marble)
  // the auditorium: walls with a row of arched clerestory windows, a white segmental vault
  prism(marble, null, chamfer(rect(-13.0, -7.2, 13.0, 20.8), 0.35), ATTIC - 0.5, UP)
  for (const sx of [-1, 1]) {
    const f = face(sx * 13.0, 0, [sx, 0])
    for (let k = 0; k < 7; k++) W(f, sw(f, f.o[0], -4.0 + 3.5 * k), 1.4, 23.6, 26.5, true)
  }
  vault(13.0, -7.2, 20.8, UP, 33.0, marble, marble, 12)

  // ---------------------------------------------------------------- the stagehouse
  {
    const SX = 16.6, Y0 = 20.6, Y1 = 45.3, ZW = 34.5
    prism(marble, null, chamfer(rect(-SX, Y0, SX, Y1), 0.4), ATTIC - 0.5, ZW - 0.6)
    prism(marble, null, chamfer(rect(-SX - 0.3, Y0 - 0.3, SX + 0.3, Y1 + 0.3), 0.4), ZW - 0.6, ZW)
    vault(SX, Y0, Y1, ZW, 37.3, roof, marble, 10)
    for (const sx of [-1, 1]) for (const y of [Y0, Y1]) {
      const x = sx * SX
      box(marble, terr, x - 1.1, y - 1.1, x + 1.1, y + 1.1, ATTIC, 36.6, 0.25)
    }
    for (const sx of [-1, 1]) {
      const f = face(sx * SX, 0, [sx, 0])
      for (const y of [26.8, 33.0, 39.2]) W(f, sw(f, f.o[0], y), 1.8, 26.0, 32.0, true)
    }
    const fn = face(0, Y1, [0, 1])
    for (const x of [-8.5, 0, 8.5]) W(fn, sw(fn, x, Y1), 1.8, 26.0, 32.0, true)
  }

  // ---------------------------------------------------------------- the drum, the domes and the crown
  {
    const HX = 13.6, HY = 10.4
    prism(marble, null, chamfer(rect(-HX, DY - HY, HX, DY + HY), 0.4), ATTIC - 0.5, DRUM_TOP - 0.7)
    prism(marble, terr, chamfer(rect(-HX - 0.35, DY - HY - 0.35, HX + 0.35, DY + HY + 0.35), 0.4), DRUM_TOP - 0.7, DRUM_TOP)
    // the drum's front and back: arched windows between the corner piers
    for (const sy of [-1, 1]) {
      const f = face(0, DY + sy * HY, [0, sy])
      for (const x of [-9.9, -6.6, -3.3, 0, 3.3, 6.6, 9.9]) W(f, sw(f, x, f.o[1]), 2.1, 26.0, 31.8, true)
    }
    for (const sx of [-1, 1]) {
      const f = face(sx * HX, 0, [sx, 0])
      for (const y of [-3.3, 3.3]) W(f, sw(f, f.o[0], DY + y), 1.6, 28.4, 31.7, true)
    }
    // corner piers rising above the drum
    for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
      const x = sx * (HX - 0.6), y = DY + sy * (HY - 0.6)
      box(marble, terr, x - 1.2, y - 1.2, x + 1.2, y + 1.2, DRUM_TOP, 34.8, 0.25)
    }

    /** Run `fn`, then stretch what it drew north-south by k about y = cy: the domes are oval in plan. */
    const oval = (k: number, cy: number, fn: () => void) => {
      const parts = [marble, gold, orange, dark], start = parts.map((p) => p.pos.length)
      fn()
      parts.forEach((p, j) => {
        for (let i = start[j]; i < p.pos.length; i += 3) {
          p.pos[i + 2] = -(cy + (-p.pos[i + 2] - cy) * k) // glTF z is map -y
          const nx = p.nrm[i], ny = p.nrm[i + 1], nz = p.nrm[i + 2] / k
          const L = Math.hypot(nx, ny, nz) || 1
          p.nrm[i] = nx / L; p.nrm[i + 1] = ny / L; p.nrm[i + 2] = nz / L
        }
      })
    }
    // the main dome: oval (OSM way/1436125225, 24 x 19 m; 22.7 m wide in the
    // square-on front photo), orange at the foot, gold above, 24 dark ribs
    const R = 11.4, Z0 = DRUM_TOP, H = 11.0, RING = 2.4, KM = 9.6 / 11.4
    const tEnd = Math.acos(RING / R)
    const prof: [number, number][] = []
    for (let k = 0; k <= 9; k++) {
      const t = (tEnd * k) / 9
      prof.push([R * Math.cos(t) * (1 + 0.025 * Math.sin(2 * t)), Z0 + 0.5 + (H - 0.5) * Math.sin(t)])
    }
    const domeOnly = () => {
      lathe(dark, 0, DY, [[R + 0.3, Z0 - 0.1], [R + 0.3, Z0 + 0.5], [R, Z0 + 0.5]], 24)
      lathe(orange, 0, DY, prof.slice(0, 3), 24)
      lathe(gold, 0, DY, prof.slice(2), 24)
    }
    const zRing = prof[prof.length - 1][1]
    const ribs = (cx: number, cy: number, pr: [number, number][], n: number, rw: number, rd: number, part: Part, phase = 0) => {
      for (let k = 0; k < n; k++) {
        const a = ((k + phase) / n) * 2 * Math.PI, c = Math.cos(a), s = Math.sin(a)
        const P = (r: number, z: number, w: number, d: number): V3 => [cx + c * (r + d) - s * w, cy + s * (r + d) + c * w, z]
        // smooth normals across the rib's length, so its segments weld into one strip
        const nAt = (i: number): V3 => {
          const [ra, za] = pr[Math.max(0, i - 1)], [rb, zb] = pr[Math.min(pr.length - 1, i + 1)]
          const L = Math.hypot(rb - ra, zb - za) || 1
          return [(c * (zb - za)) / L, (s * (zb - za)) / L, (ra - rb) / L]
        }
        for (let i = 0; i + 1 < pr.length; i++) {
          const [r0, z0] = pr[i], [r1, z1] = pr[i + 1]
          const n0 = nAt(i), n1 = nAt(i + 1)
          const A = P(r0, z0, -rw, rd), B = P(r0, z0, rw, rd), C = P(r1, z1, rw, rd), D = P(r1, z1, -rw, rd)
          part.tri(A, B, C, undefined, undefined, undefined, [n0, n0, n1])
          part.tri(A, C, D, undefined, undefined, undefined, [n0, n1, n1])
        }
      }
    }
    oval(KM, DY, () => { domeOnly(); ribs(0, DY, prof, 24, 0.32, 0.1, dark) })
    // the lantern, the group of figures and the eagle (bronze, dark)
    lathe(dark, 0, DY, [[RING + 0.2, zRing - 0.3], [2.7, zRing + 0.1], [2.7, zRing + 0.6], [2.1, zRing + 0.7], [2.1, 46.2], [2.5, 46.4], [2.5, 46.9], [1.6, 47.1], [1.5, 48.6], [1.1, 49.9], [0.55, 50.6], [0.45, 51.4], [0.01, 51.6]], 12)
    // the eagle: a body and two raised wings
    lathe(dark, 0, DY, [[0.4, 51.0], [0.5, 51.6], [0.3, 52.4], [0.01, 52.6]], 6)
    for (const sx of [-1, 1]) {
      const wing: V3[] = [[sx * 0.3, DY - 0.15, 51.4], [sx * 2.1, DY - 0.15, 53.3], [sx * 1.7, DY - 0.15, 52.3], [sx * 0.3, DY - 0.15, 51.0]]
      const back: V3[] = wing.map(([x, y, z]) => [x, y + 0.3, z] as V3)
      qf(dark, wing[0], wing[1], wing[2], wing[3], [0, -1, 0])
      qf(dark, back[0], back[1], back[2], back[3], [0, 1, 0])
      for (let i = 0; i < 4; i++) {
        const j = (i + 1) % 4
        const e: V3 = [wing[j][0] - wing[i][0], 0, wing[j][2] - wing[i][2]]
        qf(dark, wing[i], wing[j], back[j], back[i], [e[2] * sx, 0, -e[0] * sx])
      }
    }

    // the side domes, east and west: smaller and lower than the main dome,
    // long north-south (they read wider than the main dome from the west),
    // tiled like it (orange-red foot, pale gold above), 12 dark ribs; from
    // the south only their upper half shows over the pavilion attics
    for (const sx of [-1, 1]) oval(8.8 / 6.0, DY, () => {
      const cx = sx * 20.4, r = 6.0, z0 = UPV - 0.4, h = 5.0
      lathe(marble, cx, DY, [[r + 0.3, z0 - 0.1], [r + 0.3, z0 + 0.6], [r, z0 + 0.6]], 12)
      const p: [number, number][] = []
      const te = Math.acos(0.9 / r)
      for (let k = 0; k <= 6; k++) { const t = (te * k) / 6; p.push([r * Math.cos(t), z0 + 0.6 + h * Math.sin(t)]) }
      lathe(orange, cx, DY, p.slice(0, 3), 12)
      lathe(gold, cx, DY, p.slice(2), 12)
      ribs(cx, DY, p, 12, 0.24, 0.08, dark)
      lathe(dark, cx, DY, [[1.1, p[p.length - 1][1] - 0.2], [1.0, p[p.length - 1][1] + 0.6], [0.5, p[p.length - 1][1] + 1.0], [0.01, p[p.length - 1][1] + 1.1]], 8)
    })
  }

  // shift everything onto the real axis
  for (const part of [marble, win, gold, orange, dark, roof]) for (let i = 0; i < part.pos.length; i += 3) part.pos[i] += AX

  // Night: the marble is floodlit from the ground, front strongest, roofs barely; the domes glow.
  const marbleLit = (p: V3, n: V3) => (n[2] > 0.7 ? 0.25 : (n[1] < -0.5 ? 0.75 : 0.6) + 0.25 * Math.min(1, p[2] / 30))
  return finishGlb('Palacio de Bellas Artes', [
    { part: marble, material: { ...finish('pba-marble', 0xe9e5dd), floodlight: marbleLit } as Swatch },
    { part: gold, material: { ...finish('pba-dome-gold', 0xddb04a, 0.5), floodlight: () => 1 } as Swatch },
    { part: orange, material: { ...finish('pba-dome-orange', 0xd9824e, 0.55), floodlight: () => 0.85 } as Swatch },
    { part: dark, material: { ...finish('pba-bronze', 0x66645f, 0.7), floodlight: (p: V3) => (p[2] > 44 ? 0.6 : 0.2) } as Swatch },
    { part: roof, material: { ...finish('pba-shade', 0x9a968e), floodlight: (_p: V3, n: V3) => (n[2] > 0.5 ? 0 : 0.8) } as Swatch },
    { part: win, material: PALETTE.window },
  ], { bearing: 9, height: 53.3, replaces: REPLACES }, 6500)
}

if (import.meta.main) await writeModel('mexico-city-palacio-de-bellas-artes', build())
