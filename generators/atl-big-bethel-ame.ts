/**
 * Big Bethel AME Church (1891, rebuilt 1924), 220 Auburn Avenue, Atlanta:
 * procedural, CC0-1.0.
 * bun generators/atl-big-bethel-ame.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres, bearing 0 (the walls run within
 * a degree of north-south). The front faces south (-y) onto Auburn Avenue.
 * Origin: the area centroid of OSM way/97337613 (-84.3806444, 33.7559047).
 * y = 0 is the lowest ground under the footprint (the Auburn Avenue
 * sidewalk, 0.8 m above the lidar box's ground_min).
 *
 * Form: a grey granite Romanesque church. On the front's east corner a
 * square bell tower: two white string courses, a belfry with louvred arched
 * openings, a white cornice with small corner turrets, and a tall octagonal
 * slate spire with white ribs, carrying the "JESUS SAVES" sign (blue
 * letters on its east and west faces, neon at night) and a lit white cross.
 * On the west corner a round turret with a white band and a crenellated top;
 * between them a crow-stepped gable over a big semicircular window and an
 * arcaded porch. Behind, the nave under a grey gable roof with tall
 * round-arched windows, a west transept gable, a low east wing and a
 * rounded north apse.
 *
 * Sources
 * - OSM way/97337613 (outline, building=church).
 * - USGS 3DEP lidar GA_Statewide_B2_2018 (2018 flight), 0.5 m grid, heights
 *   above y = 0: tower x 15.8..21.6, y -28.2..-21.5, cornice 26.1, corner
 *   turrets 28.3; the spire's surface at 40.6 a metre off its axis, the
 *   cross's top 51.5 (the box's highest return); turret 19.7; front gable
 *   steps to 20.6; nave eaves 12.8, ridge 19.2 at x 14.4; west transept 15;
 *   east wing 8.2.
 * - Photos: HABS GA-1170-C-15 and C-14 (James R. Lockhart, Library of
 *   Congress, public domain, via Wikimedia Commons): the south elevation and
 *   the north-west corner. Wikimedia Commons, EVIDENCE: Warren LeMay, "Big
 *   Bethel AME Church, Atlanta, GA (32532878607).jpg", "(33598218858).jpg",
 *   "(40508647063).jpg", "(33598219698).jpg", CC0; JJonahJackalope, "Big
 *   Bethel AME Church, Atlanta 2.jpg", CC BY-SA 4.0; Timothy J Carroll, "Big
 *   Bethel AME church.jpg", CC BY 2.0 (the spire and the sign close up).
 * Sign: "JESUS SAVES" is a famous sign, so it carries its lettering
 *   (STYLE.md, "Famous signs"): two lines of bold upright sans-serif capitals
 *   traced from Carroll's photo, built with lettering.ts, on the spire's east
 *   and west faces (HABS C-15 shows both edge-on from the south). The letters
 *   stand on a frame clear of the slate and are wider than the spire face:
 *   a deliberate, real projection past the spire's edges (STYLE: "only
 *   things that really project, project"), as Carroll's photo shows. From
 *   the side the far sign's letters show past the spire, mirrored, as in
 *   the photos; every letter is a closed solid with back faces.
 * Estimated: the spire's height between the lidar returns (fitted as a
 *   straight octagonal pyramid through them), letter size (cap height
 *   1.45 m, scaled from the spire's width in Carroll's photo), window sizes and counts.
 * Doubts: the north apse and east wing are seen only from above (lidar,
 *   NAIP); their walls are plain.
 * Colour: granite from the photos (a mid grey-tan, rough), pulled to
 *   palette lightness and kept matt; the spire's slate is dark grey (a defining dark, kept above
 *   charcoal); white trim; the sign's blue from the photos.
 * Night: the sign and the cross are neon; the tower is floodlit; windows glow.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, type Swatch } from './palette'
import { Pen, strokes } from './lettering'
import { type Face, flatShape, lathe, arc, archShape, finishGlb, writeModel } from './sea-tacoma-union-station'
import { box, gable, bays, faceX, faceY, sOf, qf } from './atl-georgia-state-capitol'

const TX0 = 15.8, TX1 = 21.6, TY0 = -28.2, TY1 = -21.5 // the tower
const TC: [number, number] = [(TX0 + TX1) / 2, (TY0 + TY1) / 2]
const CORN = 26.1, SPIRE = 48.6, CROSS = 51.5, SR = 2.75 // spire base half-width (apothem)

/** Bold upright sans capitals, cap height 1, traced from the sign. Returns [pen, advance]. */
function glyph(ch: string): [Pen, number] {
  const p = new Pen()
  switch (ch) {
    case 'J': p.moveTo([0.5, 1]).lineTo([0.5, 0.3]).arc([0.27, 0.3], -Math.PI * 0.95, 6); return [p, 0.62]
    case 'E': p.moveTo([0.52, 1]).lineTo([0.04, 1]).lineTo([0.04, 0]).lineTo([0.54, 0]); p.moveTo([0.04, 0.5]).lineTo([0.46, 0.5]); return [p, 0.62]
    case 'S': p.moveTo([0.54, 0.86]).cubicTo([0.46, 1.03], [0.06, 1.04], [0.06, 0.76], 5).cubicTo([0.06, 0.52], [0.56, 0.52], [0.56, 0.26], 5).cubicTo([0.56, -0.04], [0.08, -0.04], [0.02, 0.16], 5); return [p, 0.62]
    case 'U': p.moveTo([0.04, 1]).lineTo([0.04, 0.32]).arc([0.3, 0.32], Math.PI, 6).lineTo([0.56, 1]); return [p, 0.66]
    case 'A': p.moveTo([0, 0]).lineTo([0.32, 1]).lineTo([0.64, 0]); p.moveTo([0.13, 0.34]).lineTo([0.51, 0.34]); return [p, 0.68]
    case 'V': p.moveTo([0, 1]).lineTo([0.32, 0]).lineTo([0.64, 1]); return [p, 0.68]
  }
  return [p, 0.6]
}
function word(text: string, gap = 0.2): [Pen, number] {
  const out = new Pen()
  let u = 0
  for (const ch of text) {
    const [g, adv] = glyph(ch)
    out.add(g, u, 0)
    u += adv + gap
  }
  return [out, u - gap]
}

function build() {
  const granite = new Part(), trim = new Part(), slate = new Part(), win = new Part(), neon = new Part(), cross = new Part()

  // ---- the nave, transept, east wing and apse
  const EAVE = 12.8, RIDGE = 19.2, NX0 = 2.3, NX1 = 26.4, NY0 = -25.0, NY1 = 11.6
  box(granite, null, NX0, -21.4, NX1, NY1, 0, EAVE, 0.2)
  gable(granite, slate, faceY(NY1, 1), sOf(faceY(NY1, 1), NX1) - 0.3, sOf(faceY(NY1, 1), NX0) + 0.3, EAVE, RIDGE, 0, NY1 - NY0, true)
  // the side windows: tall round-arched, four a side
  for (const [x, sgn] of [[NX0, -1], [NX1, 1]] as [number, 1 | -1][]) {
    const f = faceX(x, sgn)
    const a = sOf(f, -20.0), b = sOf(f, 10.0)
    bays(win, f, Math.min(a, b), Math.max(a, b), 4, 2.4, 2.2, 10.6, true)
  }
  // the west transept, gable facing west
  box(granite, null, -1.3, -10.2, NX0 + 0.2, 0.5, 0, EAVE, 0.2)
  {
    const f = faceX(-1.3, -1)
    gable(granite, slate, f, sOf(f, 0.8), sOf(f, -10.5), EAVE, 15.6, 0, 8.0, false)
    flatShape(win, f, archShape(sOf(f, -4.85), 3.6, 3.0, 10.4, 8), 0.06)
  }
  // the low east wing
  box(granite, slate, NX1 - 0.2, -10.1, 28.5, 0.1, 0, 8.2, 0.2)
  bays(win, faceX(28.5, 1), sOf(faceX(28.5, 1), -10.1), sOf(faceX(28.5, 1), 0.1), 2, 1.6, 1.5, 6.6, true)
  // the rounded north apse
  lathe(granite, 14.1, NY1, [[5.0, 0], [5.0, 11.6]], 10, 0, 180)
  lathe(slate, 14.1, NY1, [[5.3, 11.6], [0.01, 13.4]], 10, 0, 180)

  // ---- the front: crow-stepped gable, big half-round window, arcaded porch
  {
    const FY = NY0
    box(granite, null, 7.4, FY, TX0 + 0.1, -21.0, 0, 15.2, 0.15)
    // the crow steps, rising to the centre
    const xm = (7.4 + TX0) / 2, half = (TX0 - 7.4) / 2
    for (let k = 0; k < 4; k++) {
      const w = half * (1 - k / 4.4)
      box(granite, trim, xm - w, FY, xm + w, FY + 1.2, 15.2 + k * 1.35, 15.2 + (k + 1) * 1.35, 0.05)
    }
    const f = faceY(FY, -1)
    flatShape(win, f, archShape(sOf(f, xm), 6.0, 9.4, 9.4, 10), 0.06)
    // the porch's three arches and the name band above them
    for (const dx of [-2.6, 0, 2.6]) flatShape(win, f, archShape(sOf(f, xm + dx), 2.0, 2.2, 5.4, 8), 0.06)
    box(trim, null, 7.6, FY - 0.15, TX0 - 0.1, FY, 7.0, 8.1, 0)
  }

  // ---- the round west turret
  {
    const cx = 4.95, cy = -25.6, r = 2.65
    lathe(granite, cx, cy, [[r, 0], [r, 13.6]], 14)
    lathe(trim, cx, cy, [[r, 13.6], [r + 0.35, 13.9], [r + 0.35, 14.7], [r, 14.9]], 14)
    lathe(granite, cx, cy, [[r, 14.9], [r, 18.7], [r + 0.2, 18.7], [r + 0.2, 19.1], [1.0, 19.1]], 14)
    // merlons round the top
    for (let k = 0; k < 7; k++) {
      const a = (k / 7) * 2 * Math.PI, c = Math.cos(a), s = Math.sin(a), t = 0.45
      const P = (rr: number, w: number, z: number): V3 => [cx + c * rr - s * w, cy + s * rr + c * w, z]
      const r0 = r - 0.4, r1 = r + 0.2
      qf(granite, P(r1, -t, 19.1), P(r1, t, 19.1), P(r1, t, 19.8), P(r1, -t, 19.8), [c, s, 0])
      qf(granite, P(r0, -t, 19.1), P(r0, t, 19.1), P(r0, t, 19.8), P(r0, -t, 19.8), [-c, -s, 0])
      qf(granite, P(r0, -t, 19.8), P(r1, -t, 19.8), P(r1, t, 19.8), P(r0, t, 19.8), [0, 0, 1])
      qf(granite, P(r0, t, 19.1), P(r1, t, 19.1), P(r1, t, 19.8), P(r0, t, 19.8), [-s, c, 0])
      qf(granite, P(r0, -t, 19.1), P(r1, -t, 19.1), P(r1, -t, 19.8), P(r0, -t, 19.8), [s, -c, 0])
    }
    for (const a of [-115, -65]) {
      const ar = (a * Math.PI) / 180, c = Math.cos(ar), s = Math.sin(ar)
      const f: Face = { o: [cx + c * r, cy + s * r, 0], n: [c, s] }
      flatShape(win, f, archShape(0, 0.9, 2.6, 4.6, 6), 0.06)
      flatShape(win, f, [[-0.4, 7.4], [0.4, 7.4], [0.4, 9.2], [-0.4, 9.2]], 0.06)
      flatShape(win, f, archShape(0, 0.8, 15.6, 17.6, 6), 0.06)
    }
  }

  // ---- the tower
  box(granite, null, TX0, TY0, TX1, TY1, 0, CORN - 0.6, 0.2)
  for (const z of [16.4, 19.0]) box(trim, null, TX0 - 0.25, TY0 - 0.25, TX1 + 0.25, TY1 + 0.25, z, z + 0.6, 0.15)
  box(trim, null, TX0 - 0.35, TY0 - 0.35, TX1 + 0.35, TY1 + 0.35, CORN - 0.6, CORN, 0.15)
  for (const f of [faceX(TX0, -1), faceX(TX1, 1), faceY(TY0, -1), faceY(TY1, 1)]) {
    const isX = f.n[0] !== 0
    const sm = sOf(f, isX ? TC[1] : TC[0])
    flatShape(trim, f, archShape(sm, 1.4, 20.0, 24.1, 6), 0.06) // the louvred belfry opening, white louvres
    for (const d of [-0.9, 0.9]) flatShape(win, f, [[sm + d - 0.35, 17.3], [sm + d + 0.35, 17.3], [sm + d + 0.35, 18.6], [sm + d - 0.35, 18.6]], 0.06)
    for (const d of [-0.9, 0.9]) flatShape(win, f, [[sm + d - 0.35, 12.6], [sm + d + 0.35, 12.6], [sm + d + 0.35, 14.0], [sm + d - 0.35, 14.0]], 0.06)
  }
  {
    const f = faceY(TY0, -1)
    flatShape(win, f, archShape(sOf(f, TC[0]), 2.6, 3.4, 7.2, 8), 0.06)
  }
  // the corner turrets: octagonal white shafts with slate caps
  for (const x of [TX0 + 0.45, TX1 - 0.45]) for (const y of [TY0 + 0.45, TY1 - 0.45]) {
    lathe(trim, x, y, [[0.6, CORN], [0.6, 27.3]], 8, 22.5, 382.5)
    lathe(slate, x, y, [[0.72, 27.3], [0.01, 28.9]], 8, 22.5, 382.5)
  }
  // the octagonal spire with white ribs, and the cross
  lathe(slate, TC[0], TC[1], [[SR, CORN], [0.25, SPIRE]], 8, 22.5, 382.5)
  for (let k = 0; k < 8; k++) {
    const a = ((k * 45) * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a)
    const R0 = SR / Math.cos(Math.PI / 8), R1 = 0.25 / Math.cos(Math.PI / 8), w = 0.13
    const P = (r: number, d: number, z: number): V3 => [TC[0] + c * r - s * d, TC[1] + s * r + c * d, z]
    const out: V3 = [c * (SPIRE - CORN), s * (SPIRE - CORN), R0 - R1]
    qf(trim, P(R0 + 0.08, -w, CORN), P(R0 + 0.08, w, CORN), P(R1 + 0.08, w, SPIRE), P(R1 + 0.08, -w, SPIRE), out)
  }
  lathe(trim, TC[0], TC[1], [[0.55, SPIRE - 0.6], [0.55, SPIRE + 0.4], [0.3, SPIRE + 0.6]], 8)
  box(cross, null, TC[0] - 0.22, TC[1] - 0.22, TC[0] + 0.22, TC[1] + 0.22, SPIRE + 0.6, CROSS, 0)
  box(cross, null, TC[0] - 0.22, TC[1] - 0.95, TC[0] + 0.22, TC[1] + 0.95, CROSS - 1.35, CROSS - 0.9, 0)

  // ---- the JESUS SAVES signs, on frames on the spire's east and west faces.
  // A deliberate, real projection: the frame and letters are wider than the
  // spire face and stand past its edges, as in Carroll's photo. The letters
  // are closed solids (back faces too), so from behind they read as letters.
  const CAP = 1.45, LEAD = 1.8, BASE2 = 32.8
  for (const sgn of [1, -1] as const) {
    for (const [text, base] of [['JESUS', BASE2 + LEAD], ['SAVES', BASE2]] as [string, number][]) {
      const [pen, width] = word(text)
      // the frame's plane stands just clear of the slate at the sign's foot
      const zLow = BASE2 - 0.2, d = SR * (1 - (zLow - CORN) / (SPIRE - CORN)) + 0.35
      const place = (u: number, v: number, w: number): V3 => {
        const s = (u - width / 2) * CAP
        // u runs to the reader's right: seen from the east that is north (+y), from the west south
        return [TC[0] + sgn * (d + w), TC[1] + sgn * s, base + v * CAP]
      }
      strokes(neon, pen.paths, { width: 0.2, depth: 0.25 / CAP, place, back: true })
      // the frame behind the letters: a rail along the line, struts back to the slate
      box(trim, null, TC[0] + sgn * d - 0.06, TC[1] - 0.06 - (width / 2) * CAP * 0.8, TC[0] + sgn * d + 0.06, TC[1] + 0.06 + (width / 2) * CAP * 0.8, base + 0.45 * CAP, base + 0.55 * CAP, 0)
    }
    const xa = TC[0] + sgn * (SR * (1 - (BASE2 + 1.0 - CORN) / (SPIRE - CORN)) - 0.1), xb = TC[0] + sgn * (SR * (1 - (BASE2 - 0.2 - CORN) / (SPIRE - CORN)) + 0.35)
    for (const dy of [-0.5, 0.5]) box(trim, null, Math.min(xa, xb), TC[1] + dy - 0.06, Math.max(xa, xb), TC[1] + dy + 0.06, BASE2 + 0.6, BASE2 + 0.74, 0)
  }

  const lit = (p: V3, n: V3) => (n[2] > 0.7 ? 0.2 : p[0] > TX0 - 0.5 && p[1] < TY1 + 0.5 ? 0.9 : 0.45)
  return finishGlb('Big Bethel AME Church', [
    { part: granite, material: { ...finish('bba-granite', 0xb7b1a4, 0.95), floodlight: lit } as Swatch },
    { part: trim, material: { ...PALETTE.trim, floodlight: lit } as Swatch },
    { part: slate, material: finish('bba-slate', 0x5f666e) },
    { part: win, material: PALETTE.window },
    { part: neon, material: finish('neon-jesus-saves-blue', 0x3b72cc) },
    { part: cross, material: finish('neon-cross-white', 0xf3f0e8) },
  ], { bearing: 0, height: CROSS, replaces: ['way/97337613'] }, 5000)
}

if (import.meta.main) await writeModel('atl-big-bethel-ame', build())
