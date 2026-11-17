/**
 * Ebenezer Baptist Church, Heritage Sanctuary (1922), 407 Auburn Avenue,
 * Atlanta: procedural, CC0-1.0.
 * bun generators/atl-ebenezer-baptist-church.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres, bearing 0 (the walls run
 * north-south within a degree). The front faces north (+y) onto Auburn
 * Avenue; Jackson Street runs along the west side. Origin: the area centroid
 * of OSM way/173532779 (-84.3741108, 33.7552367); y = 0 is the lowest ground
 * under the footprint (the Auburn Avenue sidewalk at the north-west corner,
 * 0.5 m above the lidar box's ground_min).
 *
 * Form: a red-brick Gothic Revival sanctuary on a pale grey stone base
 * storey. Its front has two square towers with corner piers and louvred
 * lancets, a lower gable between them over a triple lancet, and the
 * entrance under it. Martin Luther King Jr's church: the blue sign with
 * white neon "EBENEZER BAPTIST CHURCH" and a cross projects from the front
 * beside the door. The nave runs back under a gabled shingle roof, with two
 * cross gables on the Jackson Street side between bays of paired lancets.
 * East of it, across a narrow slot, the plain brick education building
 * (1956) with a dentilled parapet.
 *
 * Sources
 * - OSM way/173532779 (outline: the sanctuary x -16.2..-0.8 and the
 *   education building x 2..14, joined at the north end).
 * - HABS GA,61-ATLA,54- (National Park Service / Library of Congress,
 *   public domain, via Wikimedia Commons), sheets 5 (north elevation), 6
 *   (west elevation), 8 (east elevation) and 2 (plans): every proportion
 *   and window; heights scaled from them were about 1 m above the lidar's,
 *   so the lidar's are used.
 *   https://commons.wikimedia.org/wiki/File:Martin_Luther_King,_Jr._National_Historic_Site,_Ebenezer_Baptist_Church,_407_Auburn_Avenue_Northeast,_Atlanta,_Fulton_County,_GA_HABS_GA,61-ATLA,54-_(sheet_5_of_14).tif
 * - USGS 3DEP lidar GA_Statewide_B2_2018 (2018 flight), 0.5 m grid, heights
 *   above y = 0: tower parapets 16.4, nave ridge 15.4 (at x -8.5), nave
 *   eaves 9.0, education building roof 9.0 and parapet 9.7, rear block 8.
 * - Photos (Wikimedia Commons, EVIDENCE): Marc Merlin, "Historic Ebenezer
 *   Baptist Church in Atlanta, June 2015.jpg", CC BY-SA 4.0 (the front);
 *   Mobilus In Mobili, "Ebenezer Baptist Church Atlanta - Flickr - Mobilus
 *   In Mobili.jpg", CC BY-SA 2.0 (front and education building);
 *   JJonahJackalope, "Ebenezer Baptist Church, Atlanta, Georgia, United
 *   States.jpg", CC BY-SA 4.0; Counse, "Ebenezer Baptist Church at
 *   sunset.jpg", CC BY 2.0 (the sign lit); Schatzim, "Ebenezer Baptist
 *   Church - Atlanta Georgia - Sign.jpg", CC BY-SA 4.0, edward stojakovic,
 *   "Ebenezer Baptist Church Sign (8239046816).jpg", CC BY 2.0, and
 *   JJonahJackalope, "Ebenezer Baptist Church sign.jpg", CC BY-SA 4.0 (the
 *   sign close up); Michael Barera, "Martin Luther King Jr. National
 *   Historic Site August 2016 02".
 * Sign: a famous sign, so it carries its lettering (STYLE.md, "Famous
 *   signs"): white neon block capitals with small serifs, traced from the
 *   close-up photos, on a blue panel with side ears and a cross on top,
 *   lettered both sides, projecting 1.5 m from the front east of the door.
 * Estimated: the sign's size (2.4 by 1.6 m, from Merlin's photo), the
 *   cross gables' widths and the window sizes (HABS, scaled).
 * Doubts: the east side of the sanctuary faces a 3 m slot and is left
 *   plain; the rear is plain.
 * Colour: red-orange brick and a pale grey stone base, from the photos,
 *   pulled to palette lightness; grey shingle roof.
 * Night: the sign's letters and cross are neon (white); windows glow; the
 *   front is lightly floodlit.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, type Swatch } from './palette'
import { Pen, strokes } from './lettering'
import { type Face, flatShape, archShape, finishGlb, writeModel } from './sea-tacoma-union-station'
import { box, gable, bays, faceX, faceY, sOf, qf } from './atl-georgia-state-capitol'
import { pointedShape, lancets } from './atl-shrine-immaculate-conception'

const SX0 = -16.2, SX1 = -0.8, SY0 = -15.0, SY1 = 18.9 // the sanctuary
const EAVE = 9.0, RIDGE = 15.4, BASE = 3.4, TOWER = 16.4

/** Block capitals with small serifs, cap height 1, traced from the sign. */
function glyph(ch: string): [Pen, number] {
  const p = new Pen()
  const serif = (x: number, y: number, w = 0.12) => p.moveTo([x - w, y]).lineTo([x + w, y])
  switch (ch) {
    case 'E': p.moveTo([0.5, 1]).lineTo([0.06, 1]).lineTo([0.06, 0]).lineTo([0.52, 0]); p.moveTo([0.06, 0.52]).lineTo([0.4, 0.52]); return [p, 0.58]
    case 'B': p.moveTo([0.06, 0]).lineTo([0.06, 1]).lineTo([0.34, 1]).arc([0.34, 0.76], -Math.PI, 5).lineTo([0.06, 0.52]); p.moveTo([0.34, 0.52]).arc([0.34, 0.26], -Math.PI, 5).lineTo([0.06, 0]); return [p, 0.66]
    case 'N': p.moveTo([0.06, 0]).lineTo([0.06, 1]).lineTo([0.56, 0]).lineTo([0.56, 1]); return [p, 0.66]
    case 'Z': p.moveTo([0.04, 1]).lineTo([0.54, 1]).lineTo([0.04, 0]).lineTo([0.56, 0]); return [p, 0.62]
    case 'R': p.moveTo([0.06, 0]).lineTo([0.06, 1]).lineTo([0.34, 1]).arc([0.34, 0.75], -Math.PI, 5).lineTo([0.06, 0.5]); p.moveTo([0.3, 0.5]).lineTo([0.58, 0]); return [p, 0.66]
    case 'A': p.moveTo([0, 0]).lineTo([0.31, 1]).lineTo([0.62, 0]); p.moveTo([0.13, 0.36]).lineTo([0.49, 0.36]); return [p, 0.66]
    case 'P': p.moveTo([0.06, 0]).lineTo([0.06, 1]).lineTo([0.34, 1]).arc([0.34, 0.74], -Math.PI, 5).lineTo([0.06, 0.48]); return [p, 0.62]
    case 'T': p.moveTo([0, 1]).lineTo([0.6, 1]); p.moveTo([0.3, 1]).lineTo([0.3, 0]); serif(0.3, 0); return [p, 0.64]
    case 'I': p.moveTo([0.16, 0]).lineTo([0.16, 1]); serif(0.16, 0); serif(0.16, 1); return [p, 0.34]
    case 'S': p.moveTo([0.52, 0.86]).cubicTo([0.44, 1.03], [0.06, 1.04], [0.06, 0.76], 5).cubicTo([0.06, 0.52], [0.54, 0.52], [0.54, 0.26], 5).cubicTo([0.54, -0.04], [0.08, -0.04], [0.02, 0.16], 5); return [p, 0.6]
    case 'C': p.moveTo([0.56, 0.84]).cubicTo([0.46, 1.04], [0.04, 1.04], [0.04, 0.5], 5).cubicTo([0.04, -0.04], [0.46, -0.04], [0.56, 0.16], 5); return [p, 0.62]
    case 'H': p.moveTo([0.06, 0]).lineTo([0.06, 1]); p.moveTo([0.56, 0]).lineTo([0.56, 1]); p.moveTo([0.06, 0.52]).lineTo([0.56, 0.52]); return [p, 0.66]
    case 'U': p.moveTo([0.06, 1]).lineTo([0.06, 0.32]).arc([0.31, 0.32], Math.PI, 6).lineTo([0.56, 1]); return [p, 0.66]
  }
  return [p, 0.6]
}
function word(text: string, gap = 0.14): [Pen, number] {
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
  const brick = new Part(), stone = new Part(), roof = new Part(), win = new Part(), neon = new Part(), panel = new Part()

  // ---- the sanctuary: stone base storey, brick walls, the nave roof
  box(stone, null, SX0, SY0, SX1, SY1, 0, BASE, 0.15)
  box(brick, null, SX0, SY0, SX1, 14.0, BASE, EAVE, 0.15)
  {
    const f = faceY(14.0, 1)
    gable(brick, roof, f, sOf(f, SX1) - 0.3, sOf(f, SX0) + 0.3, EAVE, RIDGE, 0, 14.0 - SY0, true)
  }
  // the rear block, low and plain
  box(brick, roof, SX0, -16.0, SX1, SY0 + 0.1, 0, 8.0, 0.15)

  // ---- the front: two towers, the gabled centre bay, the entrance
  const TW = 5.3, TY0 = 13.0
  box(brick, null, SX0, TY0, SX1, SY1, BASE, 10.0, 0.15)
  box(stone, null, SX0 - 0.1, SY1 - 0.4, SX1 + 0.1, SY1 + 0.1, 9.8, 10.3, 0.05) // a string course
  for (const x0 of [SX0, SX1 - TW]) {
    box(brick, null, x0, TY0 + 0.6, x0 + TW, SY1, 10.0, TOWER, 0.15)
    box(stone, roof, x0 - 0.12, TY0 + 0.48, x0 + TW + 0.12, SY1 + 0.12, TOWER - 0.35, TOWER, 0.1)
    for (const xp of [x0 + 0.45, x0 + TW - 0.45]) for (const yp of [TY0 + 1.05, SY1 - 0.45]) box(brick, stone, xp - 0.45, yp - 0.45, xp + 0.45, yp + 0.45, TOWER, TOWER + 0.9, 0.08)
    // louvred lancets on each tower's open faces
    const xm = x0 + TW / 2
    lancets(stone, faceY(SY1, 1), sOf(faceY(SY1, 1), xm) - 0.6, sOf(faceY(SY1, 1), xm) + 0.6, 1, 1.15, 11.0, 15.4) // white louvres
    const side = x0 < -8 ? faceX(x0, -1) : faceX(x0 + TW, 1)
    const ys = (TY0 + 0.6 + SY1) / 2
    lancets(stone, side, sOf(side, ys) - 0.6, sOf(side, ys) + 0.6, 1, 1.15, 11.0, 15.4)
    // the second storey's lancet and the stone base's arched window
    lancets(win, faceY(SY1, 1), sOf(faceY(SY1, 1), xm) - 0.5, sOf(faceY(SY1, 1), xm) + 0.5, 1, 0.95, 5.8, 8.6)
    flatShape(win, faceY(SY1, 1), archShape(sOf(faceY(SY1, 1), xm), 2.0, 0.8, 2.2, 8), 0.06)
  }
  {
    // the centre bay's gable and triple lancet, the door
    const f = faceY(SY1, 1)
    const c0 = SX0 + TW, c1 = SX1 - TW, cm = (c0 + c1) / 2
    gable(brick, roof, f, sOf(f, c1), sOf(f, c0), 10.0, 15.2, 0, 6.0, false)
    for (const [dx, h] of [[-1.25, 13.0], [0, 13.8], [1.25, 13.0]]) flatShape(win, f, pointedShape(sOf(f, cm + dx), 1.0, 10.6, h - 0.87, 5), 0.06)
    for (const dx of [-1.1, 0, 1.1]) flatShape(win, f, [[sOf(f, cm + dx) - 0.3, 5.6], [sOf(f, cm + dx) + 0.3, 5.6], [sOf(f, cm + dx) + 0.3, dx === 0 ? 8.4 : 7.6], [sOf(f, cm + dx) - 0.3, dx === 0 ? 8.4 : 7.6]], 0.06)
    flatShape(win, f, [[sOf(f, cm) - 1.3, 0.4], [sOf(f, cm) + 1.3, 0.4], [sOf(f, cm) + 1.3, 3.0], [sOf(f, cm) - 1.3, 3.0]], 0.06)
  }

  // ---- the Jackson Street side: two cross gables, six bays of paired lancets
  {
    const f = faceX(SX0, -1)
    for (const [y0, y1] of [[7.4, 12.8], [-9.6, -4.4]] as [number, number][]) {
      gable(brick, roof, f, sOf(f, y1), sOf(f, y0), EAVE, 12.8, 0.15, 4.0, false)
      box(brick, null, SX0 - 0.15, y0, SX0 + 0.5, y1, BASE, EAVE, 0)
      const ym = (y0 + y1) / 2
      flatShape(win, f, pointedShape(sOf(f, ym), 2.2, 6.0, 9.3, 5), 0.06)
    }
    for (let k = 0; k < 6; k++) {
      const y = 6.3 - (k + 0.5) * (10.7 / 6)
      for (const d of [-0.42, 0.42]) flatShape(win, f, pointedShape(sOf(f, y + d), 0.62, 4.6, 7.6, 4), 0.06)
    }
    // arched windows in the stone base
    bays(win, f, sOf(f, 13.0), sOf(f, SY0), 9, 1.2, 0.7, 2.6, true)
  }

  // ---- the education building and the link across the slot
  {
    const X0 = 1.9, X1 = 14.0, Y0 = -23.0, Y1 = 18.8, TOP = 9.0
    box(brick, null, X0, Y0, X1, Y1, 0, TOP, 0.15)
    box(brick, roof, X0 - 0.12, Y0 - 0.12, X1 + 0.12, Y1 + 0.12, TOP, 9.7, 0.1)
    box(brick, roof, SX1 - 0.1, 14.1, X0 + 0.1, Y1, 0, 9.4, 0)
    const fN = faceY(Y1, 1), fE = faceX(X1, 1)
    bays(win, fN, sOf(fN, X1) + 1.0, sOf(fN, X0) - 1.0, 2, 2.4, 1.0, 3.6)
    bays(win, fN, sOf(fN, X1) + 1.0, sOf(fN, X0) - 1.0, 2, 2.4, 5.0, 7.8)
    for (const [z0, z1] of [[1.2, 3.4], [5.0, 7.4]]) bays(win, fE, sOf(fE, Y0) + 1, sOf(fE, Y1) - 1, 11, 1.2, z0, z1)
  }

  // ---- the sign: a blue panel with ears and a cross, white neon letters both sides
  {
    const SXp = -7.0, Y0 = SY1 + 0.5, Y1 = SY1 + 2.9, Z0 = 3.9, Z1 = 5.5, T = 0.22
    box(panel, panel, SXp - T / 2, Y0, SXp + T / 2, Y1, Z0, Z1, 0.04)
    box(panel, panel, SXp - T / 2, Y0 - 0.25, SXp + T / 2, Y1 + 0.25, Z1 - 0.62, Z1 - 0.12, 0.08) // the ears
    box(stone, null, SXp - 0.05, SY1, SXp + 0.05, Y0, Z0 + 0.2, Z0 + 0.32, 0) // brackets
    box(stone, null, SXp - 0.05, SY1, SXp + 0.05, Y0, Z1 - 0.3, Z1 - 0.18, 0)
    const ym = (Y0 + Y1) / 2
    box(neon, null, SXp - 0.1, ym - 0.06, SXp + 0.1, ym + 0.06, Z1, Z1 + 0.62, 0)
    box(neon, null, SXp - 0.1, ym - 0.22, SXp + 0.1, ym + 0.22, Z1 + 0.36, Z1 + 0.47, 0)
    for (const sgn of [1, -1] as const) {
      for (const [text, base, cap] of [['EBENEZER', Z1 - 0.58, 0.36], ['BAPTIST', Z1 - 1.0, 0.25], ['CHURCH', Z1 - 1.36, 0.25]] as [string, number, number][]) {
        const [pen, width] = word(text)
        // u runs to the reader's right: seen from the east that is north (+y), from the west south
        const place = (u: number, v: number, w: number): V3 => [SXp + sgn * (T / 2 + w), ym + sgn * (u - width / 2) * cap, base + v * cap]
        strokes(neon, pen.paths, { width: 0.16, depth: 0.12 / cap, place })
      }
    }
  }

  const lit = (p: V3, n: V3) => (n[2] > 0.7 ? 0.15 : n[1] > 0.5 && p[0] < 0 ? 0.6 : 0.3)
  return finishGlb('Ebenezer Baptist Church', [
    { part: brick, material: { ...finish('ebc-red-brick', 0xb8664d), floodlight: lit } as Swatch },
    { part: stone, material: { ...finish('ebc-stone-base', 0xd8d6cf), floodlight: lit } as Swatch },
    { part: roof, material: finish('ebc-shingle', 0x80878e) },
    { part: win, material: PALETTE.window },
    { part: panel, material: finish('ebc-sign-blue', 0x3e5f8e, 0.6) },
    { part: neon, material: finish('neon-ebenezer-white', 0xf3f2ec, 0.4) },
  ], { bearing: 0, height: TOWER + 0.9, replaces: ['way/173532779'] }, 5000)
}

if (import.meta.main) await writeModel('atl-ebenezer-baptist-church', build())
