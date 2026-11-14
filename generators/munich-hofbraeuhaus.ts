/**
 * Hofbräuhaus am Platzl, Munich: the brewery's beer hall rebuilt as a
 * "picturesque group in German Renaissance" by Max Littmann with Erich
 * Goebel, 1896-97, keeping older parts in the south wing; destroyed in 1945
 * except the Schwemme and rebuilt by 1958. Original procedural geometry,
 * CC0-1.0.
 * bun generators/munich-hofbraeuhaus.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = area centroid of the main block, OSM way/1273939826,
 * 48.137636, 11.579929. The group's walls run at 39 / 129 degrees, so the
 * catalog bearing is -51 and the group is square to this frame: +y is the
 * front on the Platzl (north-west), -x the long side on the
 * Bräuhausstraße (south-west). The parts step back along the Platzl,
 * as OSM and the photos show ("die stufenförmige Anordnung der einzelnen
 * Bauteile", de.wikipedia).
 *
 * Identity, in order: the white front on the Platzl with its steep red
 * tile roofs; the scrolled "north gable" with the crowned HB cartouche and
 * the statue of the Bräuknecht on top, over the three-storey corner oriel
 * with its green copper cap; the row of white stepped and scrolled dormer
 * gables along the roof to the right; the ground floor of big round arches,
 * the open arcade at the entrance with the balcony over it; the tall
 * arched windows of the Festsaal; the stepped gable on the
 * Bräuhausstraße wing.
 *
 * Evidence:
 *  - layout, read against the shops and cafés the photos show: the scrolled
 *    "north gable" (de.wikipedia's Nordgiebel) with the oriel at its right
 *    corner faces east-north-east, down the Platzl's bend (Bayreuth2009's
 *    photo 01 looks up the bend at it); the wing with the dormer gables and
 *    the main block with the entrance arcade run west from it along the
 *    Platzl (Berthold Werner's photo from the north-east).
 *  - plan: OSM, read in the turned frame: the main block way/1273939826
 *    (x -13.9..10.1, y -16.1..13.8, 4 levels; front on the Platzl at
 *    y 13.8); way/1273939823 (x 10..26.7, front at y 9.4, 3 levels and a
 *    roof storey); way/1273939822 (x 26.6..37.2, front at y 2.5; its
 *    slanting east side drawn square at x 34.6); the south wing on the Bräuhausstraße way/1273939825
 *    (x -13.8..5.8, y -42.9..-16, 3 levels, low roof) and its end way/
 *    1273939824 (y -54..-42.8, 4 levels; carries the BLfD record and
 *    wikidata). The beer garden court between them stays open (not in any
 *    outline).
 *  - heights: none published but the levels. Estimated from Berthold
 *    Werner's photo from the Platzl (the ground floor arches about 5 m,
 *    storeys about 4 m): main block eave 16 m, the Platzl wings 15 m, the
 *    south wing 12.5 m, its end 15 m; the roofs pitched about 60 degrees
 *    (ridges 25.5-27 m); the north gable 10 m over its eave in three
 *    scrolled tiers, 11 m wide, with the 3.4 m statue on a 1.5 m pedestal;
 *    the oriel 4.8-12.9 m with its cap; dormer gables 8.6-8.8 m tall and
 *    4.7-5.2 m wide; three chimneys rising about 3 m over the ridges; the
 *    pale stone base 1.3 m. The Festsaal's vault
 *    is 9 m high inside (de.wikipedia), behind the arched windows.
 *  - colours from the daylight photos: white render, grey-brown stone of the
 *    arcades and the oriel's base, red-brown tiles, green copper of the
 *    oriel's cap, the bronze Bräuknecht.
 *  - elevation 0 (the Platzl is flat). No lidar in Germany; no 3D city
 *    model.
 *
 * Photos (Wikimedia Commons, all evidence):
 *  - München_Platzl_9_Hofbräuhaus_BW_2017-03-13_19-12-27.jpg (Berthold
 *    Werner, CC BY-SA 3.0): the front from the Platzl; the main reference.
 *  - Hofbräuhaus_am_Platzl_München.jpg (H.Helmlechner, CC BY-SA 4.0): the
 *    same front, wider.
 *  - München,_Hofbräuhaus_am_Platzl_01.jpg (Bayreuth2009, CC BY 3.0): the
 *    north gable and the oriel.
 *  - 2023-02-03_Hofbräuhaus_am_Platzl_07.jpg (Burkhard Mücke, CC BY-SA 4.0)
 *    and Hofbräuhaus_München_2023.jpg (Dr. Frank Gaeth, CC BY-SA 4.0): the
 *    entrance arcade and the Festsaal windows, frontal.
 *  - München,_Hofbräuhaus_am_Platzl_02.jpg (Bayreuth2009, CC BY 3.0): the
 *    arcade obliquely.
 *  - München,_die_Münzstraße_mit_Hofbräuhaus.JPG (Dguendel, CC BY 4.0): the
 *    stepped gable and the long side.
 * No commercial imagery, no 3D city models. No look-only sources.
 *
 * Left out: the lettering and the crowned HB logo (the cartouche is drawn
 * plain), the window frames and flower boxes, the balcony's ironwork
 * (drawn as a slab and a rail), the beer garden and its fountain.
 *
 * Doubts: no licensed photo shows the court side or the roofs from above,
 * so the roof layout behind the Platzl front (ridges, the Festsaal roof,
 * the south wing's low roof) is inferred from the street views and the
 * OSM levels. Which way the stepped gable of the Bräuhausstraße wing
 * faces is read from one photo.
 *
 * Uses the kit in munich-theatinerkirche.ts.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { arcade } from './phl-independence-hall'
import { save, rect, walls, cap, along, archOn, bbox, face, box, slab, statue, lathe, rectOn, corniceOn, gableRoof, hipRoof, ball, cyl, discOn, pilasterOn, type XY } from './munich-theatinerkirche'

/** The side of a rect ring facing (nx, ny), as a counter-clockwise wall a→b. */
function sideOf(x0: number, y0: number, x1: number, y1: number, nx: number, ny: number): [XY, XY] {
  if (nx > 0) return [[x1, y0], [x1, y1]]
  if (nx < 0) return [[x0, y1], [x0, y0]]
  if (ny > 0) return [[x1, y1], [x0, y1]]
  return [[x0, y0], [x1, y0]]
}

/**
 * The outline of a German Renaissance stepped gable, width w at z0, height
 * h, centred on c (in wall coordinates): three steps, each with a concave
 * scroll, a small pediment on top.
 */
function steppedGable(c: number, w: number, z0: number, h: number, steps = 3): XY[] {
  const half: XY[] = [[w / 2, z0]]
  for (let k = 0; k < steps; k++) {
    const x0 = (w / 2) * (1 - k / (steps + 0.6)), x1 = (w / 2) * (1 - (k + 1) / (steps + 0.6))
    const za = z0 + (k / steps) * h * 0.86, zb = z0 + ((k + 1) / steps) * h * 0.86
    // a vertical stub, then a concave scroll inward
    half.push([x0, za + (zb - za) * 0.35])
    for (let i = 1; i <= 3; i++) { const t = (i / 3) * (Math.PI / 2); half.push([x0 - (x0 - x1) * Math.sin(t), za + (zb - za) * (0.35 + 0.65 * (1 - Math.cos(t)))]) }
  }
  const top = z0 + h
  half.push([half[half.length - 1][0], top - h * 0.1], [0, top])
  const right = half.map(([x, z]) => [c + x, z] as XY)
  const left = half.slice(0, -1).reverse().map(([x, z]) => [c - x, z] as XY)
  return [...right, ...left]
}

/** A stepped dormer gable standing on the roof at wall a→b (proud of the eave line). */
function dormerGable(wall: Part, a: XY, b: XY, c: number, w: number, z0: number, h: number, depth: number, roofP: Part, win: Part) {
  const o = steppedGable(c, w, z0, h)
  slab(wall, a, b, o, 0.5, 0)
  // the little roof behind it, back into the main roof
  const { P, n } = along(a, b)
  const zr = z0 + h * 0.62
  face(roofP, [P(c - w / 2 + 0.3, z0, -0.1), P(c, zr, -0.1), P(c, zr, -depth), P(c - w / 2 + 0.3, z0, -depth)], [-along(a, b).u[0] + n[0] * 0, -along(a, b).u[1], 1.3])
  face(roofP, [P(c, zr, -0.1), P(c + w / 2 - 0.3, z0, -0.1), P(c + w / 2 - 0.3, z0, -depth), P(c, zr, -depth)], [along(a, b).u[0], along(a, b).u[1], 1.3])
  rectOn(win, a, b, c - 0.8, 0.5, z0 + 0.5, z0 + 2.4, 0.45)
  rectOn(win, a, b, c + 0.8, 0.5, z0 + 0.5, z0 + 2.4, 0.45)
  rectOn(win, a, b, c, 0.4, z0 + 3.4, z0 + 4.8, 0.45)
  // obelisks on the step corners and a ball on the top
  const steps = o.filter((_, i) => i > 0 && i % 4 === 1 && i < o.length / 2 - 2)
  for (const [x, z] of steps) for (const sx of [x, 2 * c - x]) {
    const q = P(sx, z, 0.2)
    lathe(wall, q[0], q[1], [[0.18, z], [0.05, z + 0.9], [0, z + 0.95]], 4, Math.PI / 4)
  }
  const top = P(c, z0 + h, 0.2)
  ball(wall, top[0], top[1], z0 + h + 0.3, 0.3, 6)
}

/** Obelisk finials on the gable's step corners. */
function finials(p: Part, a: XY, b: XY, pts: XY[]) {
  const { P } = along(a, b)
  for (const [s, z] of pts) {
    const q = P(s, z, 0.2)
    lathe(p, q[0], q[1], [[0.22, z], [0.16, z + 0.3], [0.05, z + 1.0], [0, z + 1.05]], 4, Math.PI / 4)
  }
}

/** A raised half-ring (archivolt) on wall a→b around an opening: centre s = c, radii r0..r1. */
function arcRing(p: Part, a: XY, b: XY, c: number, z0: number, r0: number, r1: number, out: number, seg = 8) {
  const { P, n, u } = along(a, b)
  for (let k = 0; k < seg; k++) {
    const t0 = (k / seg) * Math.PI, t1 = ((k + 1) / seg) * Math.PI, tm = (t0 + t1) / 2
    const q = (r: number, t: number, o: number) => P(c + r * Math.cos(t), z0 + r * Math.sin(t), o)
    face(p, [q(r1, t0, out), q(r1, t1, out), q(r0, t1, out), q(r0, t0, out)], [n[0], n[1], 0])
    face(p, [q(r1, t0, 0), q(r1, t1, 0), q(r1, t1, out), q(r1, t0, out)], [u[0] * Math.cos(tm), u[1] * Math.cos(tm), Math.sin(tm)])
  }
}

/** A half-octagon oriel on wall a→b centred s = oc, radius R, on a corbelled base, with a copper cap. */
function oriel(white: Part, stone: Part, win: Part, copper: Part, a: XY, b: XY, oc: number, R: number, z0: number, z1: number) {
  const { P } = along(a, b)
  const q = (r: number, t: number, z: number) => P(oc + r * Math.cos(t), z, r * Math.sin(t) * 0.85)
  for (let k = 0; k < 4; k++) {
    const t0 = Math.PI - (k / 4) * Math.PI, t1 = Math.PI - ((k + 1) / 4) * Math.PI
    const A = q(R, t0, 0), B = q(R, t1, 0), Ab: XY = [A[0], A[1]], Bb: XY = [B[0], B[1]]
    const g = along(Ab, Bb), Lk = g.L, N: V3 = [g.n[0], g.n[1], 0]
    face(white, [[A[0], A[1], z0], [B[0], B[1], z0], [B[0], B[1], z1], [A[0], A[1], z1]], N)
    rectOn(win, Ab, Bb, Lk / 2, Lk * 0.32, z0 + 0.8, z0 + 3.0, 0.05)
    rectOn(win, Ab, Bb, Lk / 2, Lk * 0.32, z0 + 4.4, z0 + 6.8, 0.05)
    corniceOn(stone, Ab, Bb, -0.05, Lk + 0.05, z0 + 3.4, z0 + 4.0, 0.18)
    const c0 = P(oc, z0 - 2.4, 0.3)
    face(stone, [[A[0], A[1], z0], [B[0], B[1], z0], [c0[0], c0[1], z0 - 2.4]], [N[0], N[1], -1.2])
    // the cap: a bell over the half octagon
    const prof: XY[] = [[R + 0.25, z1], [R + 0.3, z1 + 0.4], [R * 0.75, z1 + 1.1], [R * 0.3, z1 + 1.6], [0, z1 + 1.8]]
    for (let i = 0; i < prof.length - 1; i++) {
      face(copper, [q(prof[i][0], t0, prof[i][1]), q(prof[i][0], t1, prof[i][1]), q(prof[i + 1][0], t1, prof[i + 1][1]), q(prof[i + 1][0], t0, prof[i + 1][1])], [N[0], N[1], 0.8 + i * 0.6])
    }
  }
  const c0 = P(oc, 0, 0.3)
  bbox(stone, stone, c0[0] - 0.6, c0[1] - 0.6, c0[0] + 0.6, c0[1] + 0.6, 0, z0 - 2.2, 0.1)
}

/** A tall chimney: a white shaft from z0 to z1 with a stone cap. */
function chimney(white: Part, stone: Part, x: number, y: number, z0: number, z1: number) {
  box(white, x - 0.55, y - 0.85, x + 0.55, y + 0.85, z0, z1)
  box(stone, x - 0.7, y - 1.0, x + 0.7, y + 1.0, z1, z1 + 0.35)
}

/**
 * The scrolled north gable on wall a→b, centred s, width w from z0: three
 * tiers stepping in with big C-scrolls and volute rolls at the shoulders,
 * obelisks, windows, the blue crowned HB cartouche over the lettering
 * band, and the bronze Bräuknecht on a pedestal on top.
 */
function northGable(white: Part, stone: Part, win: Part, bronze: Part, a: XY, b: XY, s: number, w: number, z0: number) {
  const H = 10.0
  const half: XY[] = [[w / 2, z0], [w / 2, z0 + 1.0]]
  // tier 1: a concave scroll from the full width in to 3.4
  for (let i = 1; i <= 4; i++) { const t = (i / 4) * (Math.PI / 2); half.push([w / 2 - (w / 2 - 3.4) * Math.sin(t), z0 + 1.0 + 2.6 * (1 - Math.cos(t))]) }
  half.push([3.4, z0 + 5.2])
  // tier 2: a convex then concave scroll in to 2.0
  for (let i = 1; i <= 4; i++) { const t = (i / 4) * (Math.PI / 2); half.push([3.4 - 1.4 * Math.sin(t), z0 + 5.2 + 2.2 * (1 - Math.cos(t))]) }
  // the top: a segmental pediment
  half.push([2.0, z0 + 8.2], [1.4, z0 + 9.3], [0.7, z0 + 9.8], [0, z0 + H])
  const ring = [...half.map(([x, z]) => [s + x, z] as XY), ...half.slice(0, -1).reverse().map(([x, z]) => [s - x, z] as XY)]
  slab(white, a, b, ring, 0.5, -0.05)
  const { P, n } = along(a, b), N: V3 = [n[0], n[1], 0]
  // cornices between the tiers
  corniceOn(stone, a, b, s - 3.6, s + 3.6, z0 + 5.0, z0 + 5.4, 0.7)
  corniceOn(stone, a, b, s - 2.2, s + 2.2, z0 + 8.0, z0 + 8.35, 0.7)
  // volute rolls on the scrolls and obelisks on the shoulders
  for (const d of [-1, 1]) {
    for (const [off, z, r] of [[w / 2 - 0.7, z0 + 1.6, 0.75], [3.2, z0 + 5.9, 0.6]] as [number, number, number][]) {
      const q = P(s + d * off, z, 0)
      cyl(white, [q[0], q[1], z], N, r, 0.85, 8)
      discOn(stone, a, b, s + d * off, z, r * 0.55, 0.88, 6)
    }
    for (const [off, z] of [[w / 2 - 0.3, z0 + 1.0], [3.5, z0 + 5.4], [2.1, z0 + 8.35]] as [number, number][]) {
      const q = P(s + d * off, z, 0.25)
      bbox(stone, stone, q[0] - 0.25, q[1] - 0.25, q[0] + 0.25, q[1] + 0.25, z, z + 0.4, 0.05)
      lathe(stone, q[0], q[1], [[0.2, z + 0.4], [0.06, z + 1.7], [0, z + 1.75]], 4, Math.PI / 4)
    }
    // pilaster strips on tier 1
    pilasterOn(white, a, b, s + d * 2.9, 0.25, z0, z0 + 5.0, 0.6)
  }
  // windows: a pair in tier 1, the cartouche and lettering above them
  rectOn(win, a, b, s - 1.35, 0.6, z0 + 0.5, z0 + 2.4, 0.5)
  rectOn(win, a, b, s + 1.35, 0.6, z0 + 0.5, z0 + 2.4, 0.5)
  rectOn(win, a, b, s, 2.6, z0 + 3.0, z0 + 3.8, 0.5) // the "Hofbräuhaus" lettering band, blue
  const oval: XY[] = []
  for (let k = 0; k < 12; k++) { const t = (k / 12) * 2 * Math.PI; oval.push([s + 1.15 * Math.cos(t), z0 + 6.2 + 1.0 * Math.sin(t)]) }
  slab(stone, a, b, oval.map(([x, z]) => [s + (x - s) * 1.25, z0 + 6.2 + (z - z0 - 6.2) * 1.2] as XY), 0.15, 0.45, stone, false)
  slab(win, a, b, oval, 0.2, 0.5, win, false)
  // the crown over it
  slab(win, a, b, [[s - 1.0, z0 + 7.3], [s + 1.0, z0 + 7.3], [s + 1.15, z0 + 8.3], [s + 0.55, z0 + 7.85], [s, z0 + 8.5], [s - 0.55, z0 + 7.85], [s - 1.15, z0 + 8.3]], 0.2, 0.5, win, false)
  // the Bräuknecht on his pedestal, raising a mug in his right hand
  const t = P(s, z0 + H, -0.3)
  bbox(white, stone, t[0] - 0.7, t[1] - 0.7, t[0] + 0.7, t[1] + 0.7, z0 + H - 0.6, z0 + H + 0.9, 0.1)
  const zs = z0 + H + 0.9
  statue(bronze, t[0], t[1], zs, 3.4, Math.atan2(n[1], n[0]), 6)
  const arm = P(s + 0.55, zs + 2.4, -0.3)
  box(bronze, arm[0] - 0.13, arm[1] - 0.13, arm[0] + 0.13, arm[1] + 0.13, zs + 2.0, zs + 3.6)
  box(bronze, arm[0] - 0.28, arm[1] - 0.28, arm[0] + 0.28, arm[1] + 0.28, zs + 3.6, zs + 4.2)
}

function build() {
  const white = new Part(), stone = new Part(), tile = new Part(), win = new Part(), copper = new Part(), bronze = new Part()

  // ------------------------------------------------------------ main block
  // x -13.9..10.1, y -16.1..13.8: the Platzl wing (ridge along x) with the
  // entrance arcade, the Bräuhausstraße wing (ridge along y), a hipped
  // roof over the hall behind.
  const MX0 = -13.9, MX1 = 10.1, MY0 = -16.1, MY1 = 13.8, ME = 16.0, PW = 13.0
  walls(white, rect(MX0, MY0, MX1, MY1 - 3.0), 0, ME)
  walls(white, rect(MX0, MY1 - 0.8, MX1, MY1), 5.4, ME)
  face(white, [[MX0, MY1 - 3.0, 0], [MX0, MY1, 0], [MX0, MY1, ME], [MX0, MY1 - 3.0, ME]], [-1, 0, 0])
  bbox(white, null, MX0 - 0.35, MY0 - 0.35, MX1 + 0.35, MY1 + 0.35, ME - 0.5, ME, 0.15)
  gableRoof(tile, tile, MX0, MY1 - PW, MX1, MY1, ME, ME + 11.0, true, 0.5, 0.3)
  gableRoof(tile, white, MX0, MY0, MX0 + PW, MY1 - PW + 0.2, ME, ME + 11.0, false, 0.5, 0.3)
  hipRoof(tile, MX0 + PW - 0.5, MY0, MX1, MY1 - PW + 0.5, ME, ME + 7.5, 0.4)
  {
    // the entrance arcade on the Platzl: real openings, a loggia 3 m deep
    const L = MX1 - MX0
    const M = (u: number, w: number, z: number): V3 => [MX1 - u, MY1 - w, z]
    const opens = [3.4, 8.6, 13.8, 19.0].map((c) => ({ c, hw: 2.0, zs: 2.8 }))
    arcade(white, M, 0, L, 0.8, 0, 5.4, opens, 8, false)
    box(white, MX0, MY1 - 3.0, MX1, MY1 - 0.8, 4.6, 5.4)
    for (const o of opens) arcRing(stone, [MX1, MY1], [MX0, MY1], o.c, 2.8, 2.0, 2.55, 0.12)
    for (let s = 3.4; s < L; s += 5.2) rectOn(win, [MX1, MY1 - 3.0], [MX0, MY1 - 3.0], s, 1.2, 0, 3.4, 0.05)
    corniceOn(stone, [MX1, MY1], [MX0, MY1], 0, L, 0, 0.6, 0.15)
    // the balcony at the east end, the crowned HB on the corner
    box(stone, MX1 - 6.4, MY1, MX1 - 0.4, MY1 + 1.1, 5.4, 5.8, true)
    box(stone, MX1 - 6.4, MY1 + 1.0, MX1 - 0.4, MY1 + 1.1, 5.8, 6.8)
    const [a, b] = sideOf(MX0, MY0, MX1, MY1, 0, 1) // s from MX1 westward
    rectOn(stone, a, b, 1.0, 0.65, 12.4, 13.8, 0.08)
    // first floor: paired windows; second floor: the Festsaal's tall arched windows
    for (const s of [2.6, 5.4, 9.0, 11.8, 15.4, 18.2, 21.4]) rectOn(win, a, b, s, 0.6, 6.6, 8.6, 0.06)
    for (const s of [4.0, 10.4, 16.8]) archOn(win, a, b, s, 1.6, 10.0, 12.9, 0.06, 8)
    corniceOn(white, a, b, 0, L, 9.2, 9.6, 0.15)
    // two stepped dormer gables
    for (const s of [7.2, 15.6]) dormerGable(white, a, b, s, 5.2, ME - 0.2, 8.8, 6.0, tile, win)
  }
  // a stepped gable on the Bräuhausstraße wing's south end, over the south wing
  {
    const [a, b] = sideOf(MX0, MY0, MX0 + PW, MY1, 0, -1) // facing -y, s from MX0
    slab(white, a, b, steppedGable(PW / 2, PW, ME, 8.4), 0.4, 0)
    finials(stone, a, b, [[0.6, ME], [PW - 0.6, ME]])
    rectOn(win, a, b, PW / 2, 0.6, ME + 1.0, ME + 3.0, 0.45)
  }
  // the Bräuhausstraße side of the main block
  {
    const [a, b] = sideOf(MX0, MY0, MX1, MY1, -1, 0), L = MY1 - MY0 // s from MY1 southward
    corniceOn(stone, a, b, 0, L, 0, 1.3, 0.2)
    for (let k = 0; k < 6; k++) {
      const s = 2.8 + k * 4.9
      archOn(stone, a, b, s, 1.5, 0.9, 3.0, 0.05, 6)
      archOn(win, a, b, s, 1.2, 1.1, 3.0, 0.1, 6)
      rectOn(win, a, b, s, 0.7, 6.0, 8.2, 0.06)
      archOn(win, a, b, s, 0.9, 9.4, 12.6, 0.06, 6)
    }
    corniceOn(white, a, b, 0, L, 5.0, 5.5, 0.15)
  }

  // ----------------------------------------- the middle wing, stepped back
  // x 10..26.7, front at y 9.4: big arched windows on the ground floor, the
  // Festsaal windows, three stepped dormer gables.
  const GX0 = 10.0, GX1 = 26.7, GY1 = 9.4, GE = 15.0
  {
    walls(white, rect(GX0, MY0, GX1, GY1), 0, GE)
    const [a, b] = sideOf(GX0, MY0, GX1, GY1, 0, 1), L = GX1 - GX0 // s from GX1 westward
    corniceOn(stone, a, b, 0, L, 0, 1.3, 0.2)
    for (const s of [2.6, 6.6, 10.6, 14.6]) {
      arcRing(stone, a, b, s, 2.7, 1.6, 2.05, 0.15)
      archOn(win, a, b, s, 1.6, 1.2, 2.7, 0.08, 8)
      rectOn(win, a, b, s - 0.75, 0.45, 6.4, 8.4, 0.06)
      rectOn(win, a, b, s + 0.75, 0.45, 6.4, 8.4, 0.06)
      archOn(win, a, b, s - 0.75, 0.5, 10.0, 12.6, 0.06, 6)
      archOn(win, a, b, s + 0.75, 0.5, 10.0, 12.6, 0.06, 6)
    }
    corniceOn(white, a, b, 0, L, 5.0, 5.5, 0.15)
    corniceOn(white, a, b, 0, L, 9.0, 9.4, 0.15)
    bbox(white, null, GX0, MY0 - 0.3, GX1 + 0.3, GY1 + 0.35, GE - 0.5, GE, 0.15)
    gableRoof(tile, tile, GX0, GY1 - 12.0, GX1, GY1, GE, GE + 10.5, true, 0.5, 0.3)
    hipRoof(tile, GX0 + 0.2, MY0, GX1, GY1 - 11.8, GE, GE + 5.0, 0.4)
    for (const s of [3.3, 8.35, 13.4]) dormerGable(white, a, b, s, 4.7, GE - 0.2, 8.6, 6.0, tile, win)
    finials(stone, a, b, [[1.4, GE], [5.2, GE], [6.45, GE], [10.25, GE], [11.5, GE], [15.3, GE]])
  }

  // ------------------------------------------ the north gable block (east)
  // x 26.7..35.9 (the OSM east side slants 34.6..37.2; drawn square), front
  // at y 2.5. The north gable faces east onto the Platzl's bend, with the
  // corner oriel at its north end; the oculi wing to its south.
  {
    const BX0 = GX1, BX1 = 35.9, BY1 = 2.5, BE = 15.0, NG = 11.0
    walls(white, rect(BX0, MY0, BX1, BY1), 0, BE)
    bbox(white, null, BX0, MY0 - 0.3, BX1 + 0.35, BY1 + 0.35, BE - 0.5, BE, 0.15)
    // roofs: the gable block's ridge runs back from the east front; the
    // oculi wing's ridge runs along it
    // its gable triangles in tile, so the roof reads red round the scrolls
    gableRoof(tile, tile, BX0 - 0.3, BY1 - NG, BX1 - 0.1, BY1, BE, BE + 9.6, true, 0.5, 0.0)
    gableRoof(tile, white, BX1 - 9.0, MY0, BX1, BY1 - NG + 0.3, BE, BE + 7.5, false, 0.5, 0.3)
    hipRoof(tile, BX0, MY0, BX1 - 9.0, BY1 - NG + 0.3, BE, BE + 4.5, 0.3)
    const [a, b] = sideOf(BX0, MY0, BX1, BY1, 1, 0), L = BY1 - MY0 // facing +x, s from MY0 northward
    corniceOn(stone, a, b, 0, L, 0, 1.3, 0.2)
    northGable(white, stone, win, bronze, a, b, L - NG / 2, NG, BE)
    // under the gable: big arched windows, windows over two storeys
    // the big arched passage into the court under the gable
    arcRing(stone, a, b, L - 7.0, 2.6, 2.1, 2.7, 0.15)
    archOn(win, a, b, L - 7.0, 2.1, 0, 2.6, 0.08, 8)
    for (const s of [L - 8.4, L - 6.2]) { archOn(win, a, b, s, 0.6, 6.4, 8.6, 0.06, 6); rectOn(win, a, b, s, 0.6, 10.2, 12.4, 0.06) }
    oriel(white, stone, win, copper, a, b, L - 2.9, 2.5, 4.8, 12.9)
    // the oculi wing: an arched door, two storeys of windows, oculi under the eave
    for (const s of [1.6, 4.3, 7.0]) {
      rectOn(win, a, b, s, 0.6, 5.8, 8.2, 0.06)
      rectOn(win, a, b, s, 0.6, 9.4, 11.6, 0.06)
      archOn(win, a, b, s, 0.55, 12.9, 13.4, 0.06, 6)
      archOn(win, a, b, s, 0.55, 13.4, 13.4, 0.06, 6)
    }
    archOn(stone, a, b, 4.3, 1.8, 0.9, 2.9, 0.05, 6)
    archOn(win, a, b, 4.3, 1.45, 0.9, 2.9, 0.1, 6)
    corniceOn(white, a, b, 0, L, 5.0, 5.5, 0.15)
    // the short north front of this block on the Platzl
    const [c, d] = sideOf(BX0, MY0, BX1, BY1, 0, 1), Lc = BX1 - BX0
    for (const s of [2.4, 6.6]) {
      archOn(win, c, d, s, 1.3, 1.1, 3.0, 0.1, 6)
      rectOn(win, c, d, s, 0.6, 6.4, 8.4, 0.06)
      archOn(win, c, d, s, 0.6, 10.0, 12.6, 0.06, 6)
    }
    corniceOn(stone, c, d, 0, Lc, 0, 1.3, 0.2)
  }

  // ------------------------------------------------------------ chimneys
  // tall white stacks over the ridges, as in Werner's and Helmlechner's photos
  chimney(white, stone, -9.0, MY1 - PW / 2 - 1.2, ME + 6, ME + 13.8)
  chimney(white, stone, 18.0, GY1 - 7.0, GE + 6, GE + 13.6)
  chimney(white, stone, 29.5, 2.5 - 7.0, 15 + 5, 15 + 12.8)

  // ------------------------------------------- the court side (beer garden)
  // The south faces at y = MY0 from the south wing to the east block: plain
  // rows of windows, three storeys (no licensed photo shows them closely).
  {
    const a: XY = [5.8, MY0], b: XY = [35.9, MY0], L = 30.1
    for (let s = 2.0; s < L - 1; s += 3.6) {
      archOn(win, a, b, s, 0.9, 1.0, 3.0, 0.06, 6)
      rectOn(win, a, b, s, 0.6, 6.0, 8.0, 0.06)
      rectOn(win, a, b, s, 0.6, 9.8, 11.8, 0.06)
    }
  }

  // ------------------------------------------------- the south wing, its end
  {
    const SX0 = -13.8, SX1 = 5.8, SY0 = -42.85, SY1 = MY0, SE = 12.5
    walls(white, rect(SX0, SY0, SX1, SY1), 0, SE)
    hipRoof(tile, SX0, SY0, SX1, SY1, SE, SE + 3.6, 0.45)
    const [a, b] = sideOf(SX0, SY0, SX1, SY1, -1, 0), L = SY1 - SY0
    corniceOn(stone, a, b, 0, L, 0, 1.3, 0.2)
    for (let k = 0; k < 6; k++) {
      const s = 2.4 + k * 4.5
      archOn(win, a, b, s, 1.1, 1.2, 3.2, 0.06, 6)
      rectOn(win, a, b, s, 0.6, 5.4, 7.2, 0.06)
      rectOn(win, a, b, s, 0.6, 8.6, 10.4, 0.06)
    }
    {
      const [c, d] = sideOf(SX0, SY0, SX1, SY1, 1, 0), Lc = SY1 - SY0
      for (let s = 2.4; s < Lc - 1; s += 4.5) { rectOn(win, c, d, s, 0.6, 5.4, 7.2, 0.06); rectOn(win, c, d, s, 0.6, 8.6, 10.4, 0.06); rectOn(win, c, d, s, 0.9, 1.0, 3.4, 0.06) }
    }
    const EY0 = -54.0, EE = 15.0
    walls(white, rect(SX0, EY0, SX1, SY0), 0, EE)
    gableRoof(tile, white, SX0, EY0, SX1, SY0, EE, EE + 7.2, true, 0.5, 0.3)
    for (const [nx, ny] of [[-1, 0], [0, -1], [1, 0]]) {
      const [c, d] = sideOf(SX0, EY0, SX1, SY0, nx, ny), Ld = along(c, d).L
      for (let s = 2.2; s < Ld - 1; s += 3.8) {
        rectOn(win, c, d, s, 0.6, 5.4, 7.4, 0.06)
        rectOn(win, c, d, s, 0.6, 9.0, 11.0, 0.06)
        archOn(win, c, d, s, 1.0, 1.2, 3.0, 0.06, 6)
      }
      if (nx !== 0) {
        for (const dd of [-1.6, 1.6]) rectOn(win, c, d, Ld / 2 + dd, 0.6, EE + 0.8, EE + 2.8, 0.06)
        rectOn(win, c, d, Ld / 2, 0.5, EE + 3.8, EE + 5.3, 0.06)
      }
    }
  }

  const flood = (p: V3, n: V3) => (n[2] > 0.7 ? 0.1 : n[1] > 0.5 || n[0] > 0.5 ? 0.7 : 0.2)
  return [
    { part: white, material: { ...finish('hofbraeuhaus-white', 0xf2eee5), floodlight: flood } },
    { part: stone, material: finish('hofbraeuhaus-stone', 0xc4b8a4) },
    { part: tile, material: finish('hofbraeuhaus-tile', 0xa0503d) },
    { part: win, material: PALETTE.window },
    { part: copper, material: PALETTE.copper },
    { part: bronze, material: finish('hofbraeuhaus-bronze', 0x5d5a50) },
  ]
}

if (import.meta.main) await save('munich-hofbraeuhaus', 'Hofbräuhaus', [48.137636, 11.579929], -51, build(), 6500)
