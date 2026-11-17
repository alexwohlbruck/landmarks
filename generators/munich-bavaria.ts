/**
 * Bavaria and the Ruhmeshalle, Theresienhöhe, Munich: Leo von Klenze's
 * Doric hall of fame (1843-53), a U of colonnades opening east over the
 * Theresienwiese, and in front of it Ludwig Schwanthaler's colossal bronze
 * Bavaria (cast by Johann Baptist Stiglmaier and Ferdinand von Miller,
 * 1844-50): the patroness of Bavaria in a bearskin over her dress, raising
 * an oak wreath in her left hand, a sword and an oak branch in her right,
 * a lion sitting at her right side. Original procedural geometry, CC0-1.0.
 * bun generators/munich-bavaria.ts
 *
 * Writes two levels of detail in the same frame:
 * - models/munich-bavaria.glb, the low model;
 * - models/munich-bavaria.detail.glb (from zoom 17): the same statue at
 *   about three times the resolution: the folds, the shaggy bearskin, the
 *   face, the fingers round the wreath, the oak leaves, the lion's toes and
 *   mane locks; the columns rounder, the frieze's triglyphs.
 *
 * The statue is sculpted as smooth surfaces (the approach of
 * rio-christ-the-redeemer.ts): one body from the hem to the neck with the
 * waist, hips and breast under the dress, the hips swung to her right
 * and the left knee forward (contrapposto), deep folds falling to the
 * feet, the overfold and the belt; the bearskin raised from the same
 * surface as a pelt over her left shoulder, breast and back and an apron
 * over the hips with scalloped edges; a modelled head (nose, brow, eyes,
 * lips, chin) with hair falling to the shoulders and the oak wreath; the
 * left arm raised with a hand closed round the wreath; the right forearm
 * across the waist with the oak branch, the sword under it pointing back
 * past her right side. The lion sits at her right: haunches, deep chest,
 * straight forelegs and paws, an open-mouthed head with muzzle, nose and
 * brow framed by a ruff of mane (a tube swept round the face) that hangs
 * longer over the chest. It is drawn 12% larger than measured, so it
 * holds its own beside her at map distance.
 *
 * Map frame of this model: x across the hall (+x east-south-east, toward
 * the Theresienwiese, the side the hall opens to and Bavaria faces), y
 * along it (+y north-north-east), z up, metres; origin at the anchor on
 * the ground. Catalog bearing 10.4: the hall's back wall in OSM runs at
 * 10.4 degrees. Anchor = area centroid of way/400345387 (the hall's U),
 * 48.130712, 11.545742.
 *
 * Identity, in order: the colossal dark bronze Bavaria, tall and upright,
 * her left arm raising the wreath high, the seated lion at her side; her
 * tall granite plinth; behind her the long pale Doric colonnade with the
 * red wall behind its columns, and the two wings coming forward to temple
 * fronts with pediments, all on a high socle.
 *
 * Evidence:
 *  - published (de.wikipedia, Bavaria (Statue), Ruhmeshalle (München)):
 *    the statue 18.52 m, the stone plinth 8.92 m; the hall 68 x 32 m,
 *    eaves 16 m, on a 4.3 m socle, 48 Doric columns 6.95 m high and 1.25 m
 *    thick.
 *  - plan: OSM, turned: the hall's outline way/400345387 with its parts
 *    305422543 (the socle, 4.3 m) and 28683728 (the hall, to 20 m, gabled):
 *    the back range x -11.5..-2.6 along y -32.1..31.4, the wings forward to
 *    x 17.4 (north, y 18.8..31.5) and 18.0 (south, y -32.1..-20.5); the
 *    plinth 305421905 (8.92 m) and the statue 1544870146 (18.52 m) on it,
 *    x 10.8..18.3, y -4.3..4.2.
 *  - heights from Martin Falbisoner's frontal photo from the east (scaled
 *    from the north wing's 12.7 m front): socle 4.3, columns 6.95 on a
 *    0.3 m stylobate, entablature 2.6 (architrave, triglyph frieze,
 *    cornice), pediments 2.4 m; drawn eaves 14.2, ridge 16.8. OSM's 20 m
 *    and the published 16 m eaves are not borne out by the photos; the
 *    photo-scaled heights are drawn.
 *  - the statue from Karl Schillinger's frontal photo and GFreihalter's from
 *    below (scaled from the published 18.52 m to the top of the wreath):
 *    the head's top 15.0 m, the shoulders 12.6 m, 6.5 m across the dress at
 *    the knees, the lion's head 6.3 m up at her right; the sword held under
 *    the right forearm, its blade out to her right and back.
 *  - colours: the dark green-brown bronze, the pale limestone of hall and
 *    plinth, the pompeian red of the wall behind the colonnade (Falbisoner's
 *    dusk photo, also its night look), the grey metal roofs.
 *  - terrain: Mapterhorn puts the forecourt inside the U at a level +7.8
 *    and the Theresienwiese 7.5 m lower; the staircase down the slope in
 *    front is left to the map. The building and plinth stand on the
 *    forecourt's level; elevation 0.
 *
 * Photos (Wikimedia Commons, all evidence):
 *  - Bavaria_Statue_and_Ruhmeshalle_Munich,_April_2019_-01.jpg and -02.jpg
 *    (Martin Falbisoner, CC BY-SA 4.0): frontal from the east at dusk.
 *  - Bavaria,_Patronin_von_Bayern.jpg (Karl Schillinger, CC BY-SA 4.0): the
 *    statue frontal.
 *  - München-Schwanthalerhöhe_Bavaria_670.jpg, _673 and
 *    _Ruhmeshalle_Bavaria_676.jpg (GFreihalter, CC BY-SA 3.0): the lion,
 *    the sword, the hall's colonnade.
 *  - Ruhmeshalle_und_Bavaria_München_Schwanthalerhöhe.jpg and
 *    Bavaria_and_Ruhmeshalle_during_the_Oktoberfest_2009.JPG (Schlaier,
 *    public domain): the hall's wings and the plinth.
 *  - 2407_-_München_-_Bavaria_Statue.JPG and 2409 (Andrew Bossi, CC BY-SA
 *    2.5): the statue's side and back.
 *  - Munich_Bavaria_im_Gegenlicht_(Luftaufnahme).jpg (Bahnmoeller, CC BY-SA
 *    4.0): from the air.
 * No commercial imagery, no 3D city models. No look-only sources.
 *
 * Left out: the busts inside the hall, the metope reliefs and the
 * pediment sculpture (raised panels), the stair inside the statue, the
 * viewing platform's openings in her head.
 *
 * Doubts: the hall's height (see above); the second row of columns in the
 * wing porticos is estimated to make up the published 48; the statue's
 * back and the lion's far side are drawn from Bossi's side photos only.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import {
  TAU, add, boxAt, cap, ellipsoid, floodWalls, lathe, latheHard, limb, mul, panelOn, place, quadN, rect, save,
  similarity, surface, walls, type Layer,
} from './munich-karlstor'

const lerpRows = (rows: number[][], z: number): number[] => {
  if (z <= rows[0][0]) return rows[0].slice(1)
  for (let k = 0; k < rows.length - 1; k++) if (z <= rows[k + 1][0]) {
    const t = (z - rows[k][0]) / (rows[k + 1][0] - rows[k][0])
    return rows[k].slice(1).map((v, i) => v + (rows[k + 1][i + 1] - v) * t)
  }
  return rows[rows.length - 1].slice(1)
}
const sm = (t: number) => { const c = Math.max(0, Math.min(1, t)); return c * c * (3 - 2 * c) }
const gauss = (d: number, w: number) => Math.exp(-((d / w) ** 2))
/** Angular distance. */
const adist = (a: number, b: number) => Math.abs(((a - b + Math.PI * 3) % TAU) - Math.PI)

/**
 * Bavaria as one smooth sculpted body, facing +y, her right at +x, 15 m to
 * the top of her head (the raised wreath to ~18.4): the dress from the hem
 * to the neck with contrapposto (hips to her right, the left knee forward),
 * waist, hips and breast under it; deep folds falling to the feet; the
 * overfold and the belt; the bearskin over her left shoulder, breast and
 * back and as an apron over the hips, its edges scalloped.
 */
function bavariaFigure(p: Part, R: number) {
  // [z, half-width, half-depth, centre x, centre y]
  const prof = [
    [0.0, 2.55, 1.95, 0.15, 0.1], [0.35, 2.5, 1.9, 0.15, 0.1], [2.0, 2.35, 1.75, 0.18, 0.05], [4.0, 2.2, 1.65, 0.2, 0.05],
    [6.0, 2.12, 1.55, 0.22, 0.0], [7.2, 2.28, 1.55, 0.25, 0.0], [8.4, 2.02, 1.4, 0.2, 0.0], [9.3, 1.68, 1.18, 0.12, 0.0],
    [9.7, 1.66, 1.16, 0.1, 0.0], [10.5, 1.8, 1.24, 0.05, 0.0], [11.3, 1.92, 1.36, 0.0, 0.05], [11.9, 2.02, 1.18, -0.05, 0.0],
    [12.35, 1.72, 0.98, -0.05, 0.0], [12.65, 0.92, 0.76, 0.0, 0.02], [12.9, 0.58, 0.58, 0.0, 0.06], [13.5, 0.55, 0.55, 0.0, 0.08],
  ]
  const NU = Math.max(20, Math.round(28 * R)), NV = Math.max(18, Math.round(24 * R))
  const zs: number[] = []
  for (let k = 0; k <= NV; k++) zs.push(13.5 * (k / NV) ** 0.95)
  const grid: V3[][] = []
  for (const z of zs) {
    const [a, b, cx, cy] = lerpRows(prof, z)
    grid.push(Array.from({ length: NU }, (_, i) => {
      const t = (i / NU) * TAU, c = Math.cos(t), s = Math.sin(t)
      const e = 0.82
      let x = a * Math.sign(c) * Math.abs(c) ** e, y = b * Math.sign(s) * Math.abs(s) ** e
      let dr = 0
      // Breasts, the left knee, the belly.
      dr += 0.3 * gauss(z - 11.15, 0.45) * (gauss(adist(t, 1.12), 0.3) + gauss(adist(t, 2.02), 0.3))
      dr += 0.42 * gauss(z - 4.6, 1.1) * gauss(adist(t, 1.95), 0.42)
      dr += 0.12 * gauss(z - 8.6, 0.5) * gauss(adist(t, Math.PI / 2), 0.6)
      // Folds below the belt, deep toward the hem; straight on the weight leg, broken over the free knee.
      const A = 0.2 * sm((7.2 - z) / 3.5) + 0.06 * sm((9.4 - z) / 1.2)
      const knee = gauss(z - 4.6, 1.2) * gauss(adist(t, 1.95), 0.5)
      dr += A * (1 - 0.7 * knee) * (0.62 * Math.cos(13 * t + 0.4) + 0.38 * Math.cos(7 * t + 1.3 + 0.15 * z))
      // The overfold's hem standing out over the hips, and the belt.
      const edge = 6.9 + 0.35 * Math.sin(2 * t) + 0.2 * Math.cos(5 * t)
      dr += 0.13 * sm((z - edge) / 0.15) * sm((9.35 - z) / 0.2)
      dr += 0.11 * sm((z - 9.5) / 0.06) * sm((9.9 - z) / 0.06)
      // The bearskin: the apron over the hips (front and sides) and the pelt
      // over the left shoulder, breast and back; scalloped edges, shaggy in the detail model.
      const u = c
      const apronEdge = 7.0 + 0.3 * Math.sin(6 * t) + 0.25 * Math.cos(3 * t)
      const apron = sm((z - apronEdge) / 0.12) * sm((9.45 - z) / 0.1) * sm((s + 0.45) / 0.2)
      const lim = 9.95 + 3.4 * (1 - u) / 2 + 0.15 * Math.sin(9 * t) + (s < 0 ? 4 : 0)
      const upper = sm((z - 9.95) / 0.1) * sm((lim - z) / 0.12) * sm((12.75 - z) / 0.15)
      const pelt = Math.max(apron, upper)
      dr += pelt * (0.24 + (R > 1 ? 0.07 * Math.sin(11 * t + 2.3 * z) * Math.sin(6.5 * z - 4 * t) : 0))
      const r0 = Math.hypot(x, y) || 1
      x += (x / r0) * dr; y += (y / r0) * dr
      return [x + cx, y + cy, z] as V3
    }))
  }
  grid.unshift(grid[0].map(() => [0.15, 0.1, 0] as V3))
  surface(p, grid, true, (q) => { const [, , cx, cy] = lerpRows(prof, q[2]); return [cx, cy, q[2]] })
  // Feet under the hem: the left forward.
  ellipsoid(p, [-0.75, 2.0, 0.22], [0.36, 0.62, 0.24], 8 * R, 4 * R)
  ellipsoid(p, [0.95, 1.75, 0.2], [0.34, 0.55, 0.22], 8 * R, 4 * R)

  // Head: modelled face, hair, the oak wreath.
  {
    const H: V3 = [0, 0.18, 14.2]
    const hp = [[13.15, 0.42, 0.5], [13.45, 0.58, 0.7], [13.85, 0.66, 0.8], [14.3, 0.7, 0.86], [14.75, 0.7, 0.84], [15.05, 0.6, 0.72], [15.25, 0.36, 0.45], [15.33, 0.0, 0.0]]
    const NU2 = Math.max(12, Math.round(14 * R)), NV2 = Math.max(8, Math.round(9 * R))
    const g: V3[][] = []
    for (let k = 0; k <= NV2; k++) {
      const z = 13.15 + (15.33 - 13.15) * (k / NV2)
      const [a, b] = lerpRows(hp, z)
      g.push(Array.from({ length: NU2 }, (_, i) => {
        const t = (i / NU2) * TAU
        let x = a * Math.cos(t), y = b * Math.sin(t)
        const front = gauss(adist(t, Math.PI / 2), 0.5)
        let dr = 0
        dr += 0.2 * gauss(adist(t, Math.PI / 2), 0.11) * sm((z - 13.8) / 0.1) * sm((14.4 - z) / 0.1) // nose
        dr += 0.07 * front * gauss(z - 14.45, 0.08) // brow
        dr -= 0.09 * gauss(z - 14.28, 0.09) * (gauss(adist(t, 1.25), 0.13) + gauss(adist(t, 1.89), 0.13)) // eyes
        dr += 0.05 * front * gauss(z - 13.62, 0.06) - 0.02 * front * gauss(z - 13.55, 0.03) // lips
        dr += 0.06 * front * gauss(z - 13.32, 0.08) // chin
        // Hair: everything off the face stands out, waved in the detail.
        const hair = (1 - sm((front - 0.35) / 0.25)) * sm((z - 13.75) / 0.25) + sm((z - 14.62) / 0.12)
        dr += hair * (0.12 + (R > 1 ? 0.035 * Math.cos(14 * t + 3 * z) : 0))
        const r0 = Math.hypot(x, y) || 1
        x += (x / r0) * dr; y += (y / r0) * dr
        return [H[0] + x, H[1] + y, z] as V3
      }))
    }
    surface(p, g, true, (q) => [H[0], H[1], q[2]])
    // Hair falling to the shoulders behind and beside the face.
    for (const sx of [-1, 1]) {
      limb(p, [[sx * 0.6, -0.05, 14.3], [sx * 0.68, -0.15, 13.5], [sx * 0.78, -0.3, 12.8]], [0.22, 0.22, 0.16], 6 * R, [0, 0, 1], 'end')
      limb(p, [[sx * 0.35, -0.45, 14.4], [sx * 0.45, -0.6, 13.4], [sx * 0.55, -0.65, 12.6]], [0.32, 0.34, 0.24], 6 * R, [0, 0, 1], 'end')
    }
    // The oak wreath: leaf clusters in two staggered rows round the crown.
    const n = R > 1 ? 30 : 12
    for (let i = 0; i < n; i++) {
      const a = (i / n) * TAU, row = i % 2
      const rr = 0.78 + 0.05 * row
      ellipsoid(p, [H[0] + rr * Math.cos(a), H[1] + rr * 1.15 * Math.sin(a) - 0.04, 14.88 + 0.12 * row], [0.24, 0.1, 0.16], 6, 3, a + Math.PI / 2, 0.5)
    }
  }

  // Left arm raised (at -x), a proper hand and the wreath held up.
  ellipsoid(p, [-1.7, 0.0, 12.35], [0.56, 0.52, 0.55], 8 * R, 5 * R)
  limb(p, [[-1.75, 0.0, 12.3], [-2.2, 0.22, 13.45], [-2.45, 0.35, 14.45], [-2.35, 0.36, 15.5], [-2.2, 0.36, 16.45]], [0.48, 0.44, 0.38, 0.33, 0.26], 9 * R)
  ellipsoid(p, [-2.15, 0.38, 16.85], [0.25, 0.17, 0.36], 8 * R, 5 * R)
  if (R > 1) for (let f = 0; f < 4; f++) {
    const fx = -2.32 + f * 0.11
    limb(p, [[fx, 0.42, 17.0], [fx, 0.58, 17.18], [fx, 0.55, 17.35]], [0.065, 0.06, 0.05], 5, [0, 0, 1], 'end')
  }
  limb(p, [[-1.98, 0.35, 16.8], [-1.85, 0.5, 17.05]], [0.08, 0.06], 5, [0, 0, 1], 'end') // thumb
  {
    const C: V3 = [-2.1, 0.42, 17.78], rw = 0.68, n = R > 1 ? 30 : 12
    const ring: V3[] = Array.from({ length: n + 1 }, (_, i) => { const a = (i / n) * TAU; return [C[0] + rw * Math.cos(a), C[1], C[2] + rw * Math.sin(a)] as V3 })
    limb(p, ring, ring.map(() => 0.12), 5, [0, 1, 0], false)
    for (let i = 0; i < n; i++) {
      const a = (i / n) * TAU, out = i % 2 ? 0.1 : -0.06
      ellipsoid(p, [C[0] + (rw + out) * Math.cos(a), C[1] + (i % 3 - 1) * 0.08, C[2] + (rw + out) * Math.sin(a)], [0.22, 0.12, 0.15], 6, 3, 0, a)
    }
  }
  // Right arm: upper arm down, forearm across the waist; the oak branch
  // and the sword under the forearm, its blade out behind her right side.
  ellipsoid(p, [1.7, 0.0, 12.3], [0.55, 0.5, 0.52], 8 * R, 5 * R)
  limb(p, [[1.75, 0.0, 12.25], [2.0, 0.2, 11.3], [2.05, 0.45, 10.4], [1.55, 1.05, 10.15], [0.95, 1.45, 10.1]], [0.48, 0.44, 0.38, 0.32, 0.28], 9 * R)
  ellipsoid(p, [0.62, 1.6, 10.18], [0.3, 0.22, 0.32], 8 * R, 5 * R)
  limb(p, [[0.6, 1.66, 10.3], [0.1, 1.62, 10.85], [-0.45, 1.45, 11.35]], [0.06, 0.05, 0.04], 5, [0, 0, 1], false)
  for (let i = 0; i < (R > 1 ? 8 : 3); i++) {
    const t = (i + 1) / ((R > 1 ? 8 : 3) + 1)
    ellipsoid(p, [0.6 - 1.05 * t + (i % 2 ? 0.12 : -0.12), 1.66 - 0.2 * t + 0.05, 10.3 + 1.05 * t], [0.24, 0.07, 0.13], 6, 3, 0.6, i % 2 ? 0.7 : -0.7)
  }
  limb(p, [[0.45, 1.75, 10.0], [2.9, -1.35, 9.75]], [[0.06, 0.2], [0.04, 0.12]], 6, [0, 0, 1], 'end') // blade
  limb(p, [[0.5, 1.7, 9.55], [0.5, 1.7, 10.45]], [0.08, 0.08], 5) // guard
  ellipsoid(p, [0.75, 1.88, 10.05], [0.14, 0.14, 0.14], 6, 4) // pommel
}

/** The lion sitting at her side, facing +y: haunches, a deep chest, straight forelegs, a great ruff of mane framing the face. */
function bavariaLion(p: Part, R: number) {
  for (const s of [-1, 1]) ellipsoid(p, [s * 0.72, -0.55, 1.0], [0.7, 1.3, 1.0], 8 * R, 5 * R)
  limb(p, [[0, -1.3, 1.2], [0, -0.6, 2.35], [0, 0.2, 3.35], [0, 0.55, 3.9]], [[0.95, 0.95], [1.0, 0.95], [1.0, 1.0], [0.95, 0.95]], 9 * R)
  ellipsoid(p, [0, 0.85, 3.1], [0.88, 0.6, 1.0], 8 * R, 5 * R)
  for (const s of [-1, 1]) {
    limb(p, [[s * 0.55, 0.85, 3.2], [s * 0.58, 1.02, 1.65], [s * 0.58, 1.12, 0.32]], [0.42, 0.34, 0.3], 7 * R, [0, 0, 1], 'end')
    ellipsoid(p, [s * 0.58, 1.42, 0.2], [0.36, 0.48, 0.2], 8 * R, 4 * R)
    if (R > 1) for (const tx of [-0.2, -0.07, 0.07, 0.2]) ellipsoid(p, [s * 0.58 + tx, 1.82, 0.13], [0.07, 0.11, 0.1], 6, 3)
    ellipsoid(p, [s * 0.86, 0.55, 0.18], [0.32, 0.55, 0.18], 8 * R, 4 * R)
  }
  limb(p, [[0, -1.75, 0.4], [0.9, -1.35, 0.22], [1.45, 0.1, 0.18], [1.2, 0.95, 0.18]], [0.15, 0.13, 0.12, 0.1], 6 * R, [0, 0, 1], 'end')
  ellipsoid(p, [1.15, 1.05, 0.2], [0.14, 0.18, 0.16], 6, 4)
  // Head.
  const H: V3 = [0, 1.35, 5.05]
  ellipsoid(p, H, [0.68, 0.62, 0.6], 10 * R, 6 * R)
  ellipsoid(p, [0, 1.95, 4.82], [0.45, 0.42, 0.34], 9 * R, 5 * R, 0, 0.1)
  for (const s of [-1, 1]) ellipsoid(p, [s * 0.21, 2.18, 4.75], [0.22, 0.17, 0.19], 6 * R, 4 * R)
  ellipsoid(p, [0, 2.32, 4.98], [0.2, 0.12, 0.13], 6 * R, 4 * R)
  ellipsoid(p, [0, 1.92, 5.33], [0.5, 0.22, 0.13], 8 * R, 4 * R)
  ellipsoid(p, [0, 1.88, 4.38], [0.3, 0.36, 0.13], 8 * R, 4 * R, 0, 0.25) // open lower jaw
  if (R > 1) for (const s of [-1, 1]) ellipsoid(p, [s * 0.27, 1.98, 5.2], [0.08, 0.05, 0.06], 6, 3)
  // The mane: a ruff round the face (a tube swept round the head's axis),
  // hanging longer over the chest; locks in the detail model.
  ellipsoid(p, [0, 0.55, 4.3], [1.15, 0.9, 1.15], 10 * R, 6 * R)
  {
    const NP = Math.max(10, Math.round(16 * R)), NS = Math.max(5, Math.round(7 * R))
    const g: V3[][] = []
    for (let k = 0; k <= NP; k++) {
      const ph = (k / NP) * TAU
      const down = Math.max(0, -Math.sin(ph)) ** 2
      const Rm = 0.95 + 0.45 * down
      const cen: V3 = [H[0] + Rm * Math.cos(ph), H[1] - 0.15 - 0.15 * down, H[2] + Rm * Math.sin(ph) - 0.25 * down]
      const tr = 0.55 + 0.2 * down, ty = 0.6
      g.push(Array.from({ length: NS }, (_, j) => {
        const ps = (j / NS) * TAU
        const lock = R > 1 ? 0.09 * Math.cos(12 * ph + 2 * ps) * Math.max(0, Math.cos(ps)) : 0
        const rad = (tr + lock) * Math.cos(ps), ax = ty * Math.sin(ps)
        return [cen[0] + rad * Math.cos(ph), cen[1] + ax, cen[2] + rad * Math.sin(ph)] as V3
      }))
    }
    surface(p, g, true, (q) => {
      const ph = Math.atan2(q[2] - H[2], q[0] - H[0]), down = Math.max(0, -Math.sin(ph)) ** 2, Rm = 0.95 + 0.45 * down
      return [H[0] + Rm * Math.cos(ph), H[1] - 0.15 - 0.15 * down, H[2] + Rm * Math.sin(ph) - 0.25 * down]
    })
  }
}

function column(stone: Part, trim: Part, x: number, y: number, z0: number, R: number) {
  const seg = R > 1 ? 16 : 7
  lathe(stone, x, y, [[0.66, z0], [0.6, z0 + 3.5], [0.5, z0 + 6.25]], seg)
  latheHard(trim, x, y, [[0.5, z0 + 6.25], [0.78, z0 + 6.62], [0, z0 + 6.62]], seg)
  boxAt(trim, x, y, 0.82, 0.82, z0 + 6.62, z0 + 6.95)
}

function build(R: number) {
  const stone = new Part(), trim = new Part(), red = new Part(), bronze = new Part(), roof = new Part()

  const SOC = 4.3, STY = 4.6, COL = STY + 6.95, ARCH = COL + 0.9, FRZ = ARCH + 1.0, EAVE = FRZ + 0.7 // 14.15
  const RIDGE = EAVE + 2.4, RIDGE_B = EAVE + 1.5
  const XB0 = -11.5, XB1 = -2.6, YN0 = 18.8, YN1 = 31.5, YS0 = -32.1, YS1 = -20.5, XE = 17.6

  // The socle under the whole U, with its cornice.
  const U: [number, number][] = [[XB0, YS0], [XE, YS0], [XE, YS1], [XB1, YS1], [XB1, YN0], [XE, YN0], [XE, YN1], [XB0, YN1]]
  walls(stone, U, 0, SOC)
  cap(stone, U, SOC)
  // A cornice band on the socle's court faces and fronts.
  for (const [a, b, c, d] of [[XB1 + 0.0, YS1, XB1 + 0.25, YN0], [XB1, YS1 - 0.0, XE, YS1 + 0.25], [XB1, YN0 - 0.25, XE, YN0]] as number[][]) {
    boxAt(trim, (a + c) / 2 + (a === XB1 && c === XB1 + 0.25 ? 0.0 : 0), (b + d) / 2, Math.abs(c - a) / 2 + 0.1, Math.abs(d - b) / 2 + 0.1, SOC - 0.4, SOC, 0, 0, 0.06)
  }
  // The central stair up the socle in front of the back range.
  {
    const n = R > 1 ? 14 : 6
    for (let i = 0; i < n; i++) {
      const t0 = i / n, t1 = (i + 1) / n
      const x0 = XB1 + 5.5 * (1 - t1), x1 = XB1 + 5.5 * (1 - t0)
      boxAt(stone, (x0 + x1) / 2, 0, (x1 - x0) / 2 + 0.01, 4.0, 0, SOC * t1, 0, 0, 0, stone)
    }
    for (const s of [-1, 1]) boxAt(stone, XB1 + 2.75, s * 4.35, 2.75, 0.35, 0, SOC + 0.2, 0, 0, 0.05)
  }

  // Back range: the solid back wall, the red inner wall, the colonnade, the roof.
  boxAt(stone, (XB0 + XB0 + 1.2) / 2, (YS0 + YN1) / 2, 0.6, (YN1 - YS0) / 2, SOC, EAVE)
  // Red inner walls (pompeian red) behind the columns: back range and wings.
  quadN(red, [XB0 + 1.2, YS1, STY], [XB0 + 1.2, YN0, STY], [XB0 + 1.2, YN0, ARCH], [XB0 + 1.2, YS1, ARCH], [1, 0, 0])
  quadN(red, [XB0 + 1.2, YN0 + 9.2, STY], [XE - 5.0, YN0 + 9.2, STY], [XE - 5.0, YN0 + 9.2, ARCH], [XB0 + 1.2, YN0 + 9.2, ARCH], [0, -1, 0])
  quadN(red, [XB0 + 1.2, YS1 - 9.2, STY], [XE - 5.0, YS1 - 9.2, STY], [XE - 5.0, YS1 - 9.2, ARCH], [XB0 + 1.2, YS1 - 9.2, ARCH], [0, 1, 0])
  // Wings' outer walls.
  boxAt(stone, (XB0 + XE) / 2, YN1 - 0.6, (XE - XB0) / 2, 0.6, SOC, EAVE)
  boxAt(stone, (XB0 + XE) / 2, YS0 + 0.6, (XE - XB0) / 2, 0.6, SOC, EAVE)
  // The cella walls behind the wing porticos.
  for (const [y0, y1] of [[YN0 + 1.5, YN1], [YS0, YS1 - 1.5]] as [number, number][]) boxAt(stone, XE - 5.0, (y0 + y1) / 2, 0.3, (y1 - y0) / 2, SOC, ARCH)
  // Stylobate.
  for (const [x0, y0, x1, y1] of [[XB1 - 1.5, YS1, XB1, YN0], [XB1 - 1.5, YN0, XE, YN0 + 1.5], [XB1 - 1.5, YS1 - 1.5, XE, YS1]] as number[][])
    boxAt(trim, (x0 + x1) / 2, (y0 + y1) / 2, (x1 - x0) / 2 + 0.1, (y1 - y0) / 2 + 0.1, SOC, STY, 0, 0, 0)
  boxAt(trim, XE - 1.3, (YN0 + YN1) / 2, 1.35, (YN1 - YN0) / 2, SOC, STY)
  boxAt(trim, XE - 1.3, (YS0 + YS1) / 2, 1.35, (YS1 - YS0) / 2, SOC, STY)

  // 48 columns: 16 along the back, 8 on each wing's court side, 4 + 4 in each wing's front portico.
  const xc = XB1 - 0.75
  for (let i = 0; i < 16; i++) column(stone, trim, xc, YS1 + 1.2 + (i * (YN0 - YS1 - 2.4)) / 15, STY, R)
  for (const [yc] of [[YN0 + 0.75], [YS1 - 0.75]] as number[][]) for (let i = 0; i < 8; i++) column(stone, trim, XB1 + 2.0 + (i * (XE - XB1 - 5.6)) / 7, yc, STY, R)
  for (const [ya, yb] of [[YN0, YN1], [YS0, YS1]] as [number, number][]) for (const xx of [XE - 0.75, XE - 3.6]) for (let i = 0; i < 4; i++) {
    if (xx !== XE - 0.75 && (i === 0 || i === 3)) continue
    column(stone, trim, xx, ya + 1.1 + (i * (yb - ya - 2.2)) / 3, STY, R)
  }
  // Second-row columns in antis for the wing porticos (two each) are drawn
  // above in the inner positions; the front rows' corner columns are shared.
  for (const [ya, yb] of [[YN0, YN1], [YS0, YS1]] as [number, number][]) for (const t of [0.0, 1.0]) column(stone, trim, XE - 3.6, ya + 1.1 + t * (yb - ya - 2.2), STY, R)

  // Entablature round the U: architrave, frieze, cornice; triglyphs in the detail.
  const ent = (x0: number, y0: number, x1: number, y1: number) => {
    boxAt(stone, (x0 + x1) / 2, (y0 + y1) / 2, (x1 - x0) / 2, (y1 - y0) / 2, COL, ARCH)
    boxAt(stone, (x0 + x1) / 2, (y0 + y1) / 2, (x1 - x0) / 2 - 0.05, (y1 - y0) / 2 - 0.05, ARCH, FRZ)
    boxAt(trim, (x0 + x1) / 2, (y0 + y1) / 2, (x1 - x0) / 2 + 0.35, (y1 - y0) / 2 + 0.35, FRZ, EAVE, 0, 0, 0.15)
  }
  ent(XB0, YS1, XB1, YN0)
  ent(XB0, YN0, XE, YN1)
  ent(XB0, YS0, XE, YS1)
  if (R > 1) {
    // Triglyphs on the court faces and fronts.
    const tri = (x: number, y: number, along: 'x' | 'y', s: number) => {
      if (along === 'y') boxAt(trim, x + s * 0.05, y, 0.06, 0.32, ARCH + 0.05, FRZ - 0.05)
      else boxAt(trim, x, y + s * 0.05, 0.32, 0.06, ARCH + 0.05, FRZ - 0.05)
    }
    for (let y = YS1 + 0.6; y < YN0; y += 1.3) tri(XB1, y, 'y', 1)
    for (let x = XB1 + 0.6; x < XE; x += 1.3) { tri(x, YN0, 'x', -1); tri(x, YS1, 'x', 1) }
    for (const [ya, yb] of [[YN0, YN1], [YS0, YS1]] as [number, number][]) for (let y = ya + 0.6; y < yb; y += 1.3) tri(XE, y, 'y', 1)
  }
  // Roofs: the back range along y, the wings along x with pediments at the east fronts.
  {
    const gable = (x0: number, y0: number, x1: number, y1: number, alongY: boolean, frontPed: boolean) => {
      const o = 0.35
      if (alongY) {
        const xm = (x0 + x1) / 2
        quadN(roof, [x0 - o, y0, EAVE], [x0 - o, y1, EAVE], [xm, y1, RIDGE_B], [xm, y0, RIDGE_B], [-1, 0, 2])
        quadN(roof, [x1 + o, y0, EAVE], [x1 + o, y1, EAVE], [xm, y1, RIDGE_B], [xm, y0, RIDGE_B], [1, 0, 2])
      } else {
        const ym = (y0 + y1) / 2
        quadN(roof, [x0, y0 - o, EAVE], [x1, y0 - o, EAVE], [x1, ym, RIDGE], [x0, ym, RIDGE], [0, -1, 2])
        quadN(roof, [x0, y1 + o, EAVE], [x1, y1 + o, EAVE], [x1, ym, RIDGE], [x0, ym, RIDGE], [0, 1, 2])
        if (frontPed) {
          // The pediment: tympanum and raking cornices.
          quadN(stone, [x1 - 0.1, y0, EAVE], [x1 - 0.1, y1, EAVE], [x1 - 0.1, ym, RIDGE - 0.15], [x1 - 0.1, ym, RIDGE - 0.15], [1, 0, 0])
          for (const [ya, yb] of [[y0 - o, ym], [y1 + o, ym]] as [number, number][]) {
            const za = EAVE, zb = RIDGE
            quadN(trim, [x1 + 0.3, ya, za], [x1 + 0.3, yb, zb], [x1 + 0.3, yb, zb + 0.35], [x1 + 0.3, ya, za + 0.35], [1, 0, 0])
            quadN(trim, [x1 - 0.1, ya, za + 0.35], [x1 + 0.3, ya, za + 0.35], [x1 + 0.3, yb, zb + 0.35], [x1 - 0.1, yb, zb + 0.35], [0, ya < yb ? -1 : 1, 2])
          }
          panelOn(trim, [x1 - 0.1, y0, 0], [0, 1, 0], [1, 0, 0], (y1 - y0) / 2 - 3.2, (y1 - y0) / 2 + 3.2, EAVE + 0.25, EAVE + 1.25, 0.12)
        }
      }
    }
    gable(XB0, YS1, XB1, YN0, true, false)
    gable(XB0, YN0, XE + 0.35, YN1, false, true)
    gable(XB0, YS0, XE + 0.35, YS1, false, true)
  }

  // The plinth of Bavaria: granite, in steps, with a cornice.
  const PX = 14.55, PY = 0.0, PH = 8.92
  boxAt(stone, PX, PY, 3.75, 4.25, 0, 0.8, 0, 0, 0.06)
  boxAt(stone, PX, PY, 3.35, 3.85, 0.8, 1.6, 0, 0, 0.06)
  boxAt(stone, PX, PY, 3.0, 3.45, 1.6, PH - 0.9, 0, 0.0, 0)
  boxAt(trim, PX, PY, 3.25, 3.7, PH - 0.9, PH, 0, 0, 0.12)
  for (const [u, n, L] of [[[0, 1, 0], [1, 0, 0], 6.9], [[0, -1, 0], [-1, 0, 0], 6.9]] as [V3, V3, number][]) {
    const o: V3 = [PX + n[0] * 3.0, PY - u[1] * 3.45, 0]
    panelOn(trim, o, u, n, 1.2, L - 1.2, 3.0, 6.6, 0.1)
  }

  // The statue and the lion, facing east (+x).
  const B = new Part(); bavariaFigure(B, R > 1 ? R * 1.5 : 0.75)
  const L = new Part(); bavariaLion(L, R > 1 ? R * 1.2 : 0.6)
  {
    const yaw = -Math.PI / 2 // her front (+y) to +x; her right (+x) to -y
    const [M, Rn] = similarity(1, yaw, [PX - 0.4, PY + 0.7, PH]); place(bronze, B, M, Rn)
    // The lion at her right side.
    const [M2, Rn2] = similarity(1.12, yaw, [PX + 0.3, PY - 2.3, PH]); place(bronze, L, M2, Rn2)
  }

  const flood = floodWalls
  return [
    { part: stone, material: { ...finish('ruhmeshalle-limestone', 0xe6dfcf), floodlight: flood } },
    { part: trim, material: { ...finish('ruhmeshalle-trim', 0xf1ebdf), floodlight: flood } },
    { part: red, material: { ...finish('ruhmeshalle-red', 0xbf6a5a), floodlight: () => 0.7 } },
    { part: bronze, material: { ...finish('bavaria-bronze', 0x5f6c64), floodlight: (_p: V3, n: V3) => (n[2] < 0.5 ? 0.8 : 0.4) } },
    { part: roof, material: PALETTE.roof },
  ] as Layer[]
}

if (import.meta.main) {
  const extras = { bearing: 10.4, elevation: 0, height: 27.44, osm: 'way/400345387' }
  await save('munich-bavaria.glb', 'Bavaria and Ruhmeshalle', build(1), extras, 6500)
  await save('munich-bavaria.detail.glb', 'Bavaria and Ruhmeshalle', build(2), extras, 40_000, 1_536_000)
}
