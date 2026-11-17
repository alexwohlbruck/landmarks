/**
 * The National Gallery, Trafalgar Square, London — procedural, CC0-1.0, no
 * textures. bun generators/london-national-gallery.ts
 *
 * Uses the classical kit in london-british-museum.ts (merge that first).
 *
 * Map frame: x east, y north, z up, metres, turned to BEARING 345: +y (model
 * north) is compass 345°, so the Trafalgar Square front faces model south
 * (compass 165°). Anchor: the area centroid of the main building's OSM
 * outline way/1387097848 (lng -0.128631, lat 51.509002). The front's axis is
 * x = 11.55. z = 0 is the lowest ground the outline touches, the North
 * Terrace's west end; the terrace in front of the portico is ZF = 1.7 m up,
 * and the ground behind (Orange Street) rises to about 5 m, where the rear
 * walls sink into the slope.
 *
 * What makes it the National Gallery, and how each is drawn
 * - William Wilkins's long Portland stone front on Trafalgar Square
 *   (1832–38): the central octastyle Corinthian portico on its podium and
 *   steps (8 round columns in front, two returning behind, real depth to the
 *   wall), its entablature and low pediment.
 * - The small dome behind the portico: a stone drum with arched windows, a
 *   grey lead dome and lantern.
 * - The two "pepperpot" turrets over the end pavilions: square pedestals, a
 *   round pierced drum (real recessed openings) and a little lead cap.
 * - The two tetrastyle side porticos (paired attached columns in front of
 *   the wall, the entablature breaking forward, a solid attic over them).
 * - The long ranges: two storeys of windows in stone surrounds, giant
 *   Corinthian pilasters, the main entablature and a balustraded parapet;
 *   the end pavilions breaking forward, the set-back ends.
 * - Behind the parapet: lead roofs with the long glazed roof lights of the
 *   top-lit galleries.
 * - The Sainsbury Wing (way/1387097847, Venturi Scott Brown, 1991) is a
 *   separate building outline in OSM, so it is not part of this model (its
 *   own map building stays).
 *
 * Evidence
 * - OSM (ODbL): the building outline way/1387097848 (Grade I, NHLE 1066236)
 *   and its 32 building:parts (portico columns 1145174484-93, the side
 *   porticos' columns and entablatures 1145174469-82, the portico steps,
 *   entablature and pediment 1145174483, 1145174494-96, the dome
 *   1145174497, the pepperpots 1145174498-99, the main body 1145174506),
 *   all in `replaces`. The tourism polygon way/4372002 (with the Sainsbury
 *   Wing) is not a building.
 * - Environment Agency LIDAR Composite DSM/DTM 1 m, Open Government Licence
 *   v3.0 (composite of flights ~2000-2022). Measured above z = 0: terrace
 *   1.0 (west) to 1.8 (centre and east); the raised strip along the front
 *   2.6; front balustrade 18.0-18.8; roofs behind 19.6-20.8; side portico
 *   attics 16.5; pepperpot tops 24.3; the dome's lantern cell 27.4 (thin, so
 *   under-read).
 * - OSM part heights (above ground): portico columns 13 (with the 2.5 m
 *   podium), entablature 13-15, pediment 15-17, dome 15-27, pepperpots 23.
 * - Photos (Wikimedia Commons), evidence:
 *   "Galería Nacional, Londres, Inglaterra, 2014-08-07, DD 035.JPG", Diego
 *   Delso, CC BY-SA 4.0 (the front, level and central: every height of the
 *   portico, the facade storeys and the dome, scaled from the portico's
 *   19.0 m column spacing);
 *   "Façade de la National Gallery.jpg", Thomon, CC BY-SA 4.0 (oblique from
 *   the south-east: the east range and pepperpot);
 *   "East wing of the National Gallery, London (exterior).jpg", Freepenguin,
 *   CC BY-SA 3.0 (side portico, pepperpot, window surrounds, parapet);
 *   "Dome, National Gallery, Trafalgar Square - geograph.org.uk -
 *   5843168.jpg", Jim Osley, CC BY-SA 2.0 (dome and lantern);
 *   "City of Westminster , National Gallery, Trafalgar Square -
 *   geograph.org.uk - 7665816.jpg", Jim Osley, CC BY-SA 2.0.
 * - Estimated from the photos: portico podium 3.0 m above the terrace,
 *   columns 9.4 m, entablature 2.2 m, pediment rise 2.0 m; facade cornice
 *   14.4 m and balustrade 16.3 m above the terrace; drum top 21.6, dome
 *   25.9, lantern 28.8 above z = 0; pepperpot drum and cap proportions.
 * - Second pass (lead review): the dome made bolder, to the proportions of
 *   Delso's front photo, where it is about four column bays wide: drum
 *   radius 5.6 m (OSM's dome part is 4.75; drawn larger on purpose so it
 *   reads at phone size), drum top 24.2, dome 29.6, lantern 32.4 above
 *   z = 0, with bold lead ribs. Portico columns drawn 0.68 m in radius; the
 *   loggia's back wall is a dark band behind the columns; entablature top
 *   ZF + 14.5, pediment apex ZF + 16.7 (level with the balustrade, as the
 *   lidar has it). The lead deck is lowered to 0.5 m over the cornice and
 *   the roof lights are low muted-grey glass ridges kept under the
 *   balustrade top, so from the square the skyline is balustrade,
 *   pepperpots and dome. Pepperpots enlarged (4.8 m pedestal, 1.75 m drum,
 *   taller caps and finials).
 * - Simplified: Corinthian capitals are flared blocks; the lettering on the
 *   frieze is left out; window surrounds are hoods only.
 * - Look-only references: none.
 *
 * Night: the portico and front are floodlit; windows and the portico doors
 * glow.
 */
import { Part, type V3, type MaterialSpec } from './mesh'
import { PALETTE, finish } from './palette'
import { writeModel } from './london-buckingham-palace'
import { cylinder, cbox, rect, qf, tf, gable } from './dc-white-house'
import { capPoly, wallsPoly, ccw, type XY } from './dc-national-cathedral'
import { lathe, smooth, TAU } from './nyc-columbus-monument'
import { lodKit, prismPoly, faceOf, fpanel, fblock, fpt, type Face, type Lod } from './london-british-museum'

const ID = 'london-national-gallery'
const ZF = 1.7 // terrace in front of the portico
const CX = 11.55 // the front's axis
const mx = (x: number) => 2 * CX - x

// Main body (way/1145174506), simplified to 0.3 m, model frame.
const BODY: XY[] = [[49.5, -41.2], [58.7, -41.2], [58.7, -43.1], [67.7, -43.1], [67.9, -37.5], [82.6, -37.9], [82.4, -21.3], [74.8, -21.4], [75.3, 20.3], [73.2, 22.1], [19.6, 22.3], [19.7, 31.9], [3.2, 32.0], [3.3, 33.6], [-4.8, 33.7], [-4.7, 35.4], [-10.9, 35.3], [-10.9, 37.0], [-15.4, 37.0], [-15.4, 35.2], [-22.2, 35.3], [-22.3, 39.1], [-23.4, 39.1], [-23.0, 65.2], [-67.3, 65.3], [-67.6, 25.8], [-57.2, 25.8], [-57.1, 22.5], [-59.8, 22.6], [-59.9, 5.9], [-56.3, 5.9], [-56.1, -21.5], [-59.0, -21.6], [-59.1, -37.9], [-44.8, -37.8], [-44.8, -43.0], [-35.3, -43.0], [-35.4, -41.4], [-5.0, -41.2], [-5.0, -43.7], [28.0, -43.8], [28.0, -41.4]]

/** A Corinthian column: plinth, smooth shaft, flared bell capital, abacus. */
function corinthian(L: Lod, shaft: Part, cap: Part, x: number, y: number, z0: number, z1: number, r: number) {
  const hc = r * 2.2
  if (L.hi) {
    cbox(cap, rect(x - r * 1.3, x + r * 1.3, y - r * 1.3, y + r * 1.3), z0, z0 + 0.3, { c: 0.06 })
    cylinder(cap, x, y, r * 1.12, z0 + 0.3, z0 + 0.55, L.seg, r * 1.02)
  } else cbox(cap, rect(x - r * 1.25, x + r * 1.25, y - r * 1.25, y + r * 1.25), z0, z0 + 0.4)
  const zs = z0 + (L.hi ? 0.55 : 0.4)
  cylinder(shaft, x, y, r, zs, z1 - hc, L.seg, r * 0.87)
  // Bell: a flared frustum with a leafy middle band, then the abacus.
  const n = L.hi ? 12 : 8
  lathe(cap, L.hi ? [[r * 0.9, z1 - hc], [r * 1.12, z1 - hc * 0.45], [r * 1.38, z1 - hc * 0.2]] : [[r * 0.9, z1 - hc], [r * 1.38, z1 - hc * 0.2]], n, x, y, false)
  cbox(cap, rect(x - r * 1.45, x + r * 1.45, y - r * 1.45, y + r * 1.45), z1 - hc * 0.2, z1)
}

function build(hi: boolean) {
  const L = lodKit(hi)
  const stone = new Part(), trim = new Part(), roof = new Part(), win = new Part(), glass = new Part(), door = new Part()

  // ===== Body and parapet ===================================================
  const ZC = ZF + 12.3, ZE = ZF + 14.4, ZB = ZF + 16.3 // capitals, cornice top, balustrade top
  prismPoly(stone, null, BODY, 0, ZE)
  // Roof behind the balustrade: a lead deck, a little higher than the cornice.
  const DECK = ZE + 0.5 // lead deck, kept below the balustrade top (ZB) so the skyline from the square is balustrade, pepperpots, dome
  capPoly(roof, BODY, DECK, true)
  wallsPoly(stone, BODY, ZE, DECK)

  // ===== Front ranges: pilasters, windows, entablature, balustrade =========
  const R = ccw(BODY)
  const isFront = (f: Face, mid: XY) => mid[1] < -36 && f.n[1] < -0.9
  const isSide = (f: Face, mid: XY) => mid[1] < 22 && Math.abs(f.n[0]) > 0.9 && (mid[0] > 70 || mid[0] < -55)
  for (let i = 0; i < R.length; i++) {
    const a = R[i], b = R[(i + 1) % R.length], f = faceOf(a, b)
    const mid: XY = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
    const front = isFront(f, mid), side = isSide(f, mid)
    if (f.len < 1.5) continue
    // A plinth and the main entablature run round every street face.
    if (front || side || f.len > 6) {
      fblock(stone, f, 0, f.len, 0, ZF + 1.0, 0, 0.25)
      fblock(trim, f, -0.2, f.len + 0.2, ZE - 0.8, ZE, 0, 0.55, true) // cornice
      fblock(stone, f, 0, f.len, ZC, ZE - 0.8, 0, 0.2) // frieze and architrave
    }
    if (!(front || side) || f.len < 4) continue
    // Balustrade: plinth, rail, a recessed baluster band, dies at the bays.
    const zb0 = ZE, zb1 = ZB
    fblock(trim, f, 0, f.len, zb0, zb0 + 0.35, 0, 0.0001 + 0.45)
    fblock(trim, f, 0, f.len, zb1 - 0.3, zb1, 0, 0.45, true)
    fblock(stone, f, 0, f.len, zb0 + 0.35, zb1 - 0.3, 0, hi ? 0.12 : 0.2)
    // Bays: pilasters between, two storeys of windows with hoods.
    const n = Math.max(1, Math.round(f.len / 4.6)), step = f.len / n
    for (let k = 0; k <= n; k++) {
      const s = k * step
      if (front || k % 2 === 0) {
        fblock(stone, f, Math.max(0, s - 0.5), Math.min(f.len, s + 0.5), ZF + 1.0, hi ? ZC - 0.9 : ZC, 0, 0.3)
        if (hi) fblock(trim, f, Math.max(0, s - 0.65), Math.min(f.len, s + 0.65), ZC - 0.9, ZC, 0, 0.45)
        if (hi && k < n) fblock(trim, f, s + step / 2 - 0.15, s + step / 2 + 0.15, zb0 + 0.35, zb1 - 0.3, 0, 0.42)
      }
      if (k === n) break
      const c = s + step / 2
      const cw = fpt(f, c, 0)
      if (Math.abs(cw[0] - CX) < 10.5 && cw[1] < -43) continue
      fpanel(win, f, c - 0.75, c + 0.75, ZF + 2.4, ZF + 5.6)
      fpanel(win, f, c - 0.7, c + 0.7, ZF + 7.4, ZF + 10.4)
      if (hi) {
        fblock(trim, f, c - 1.05, c + 1.05, ZF + 5.75, ZF + 6.15, 0, 0.3, true)
        fblock(trim, f, c - 1.0, c + 1.0, ZF + 10.55, ZF + 10.95, 0, 0.3, true)
        fblock(trim, f, c - 0.95, c + 0.95, ZF + 2.15, ZF + 2.4, 0, 0.18)
      } else {
        fpanel(trim, f, c - 1.0, c + 1.0, ZF + 5.75, ZF + 6.2, 0.1)
        fpanel(trim, f, c - 0.95, c + 0.95, ZF + 10.55, ZF + 11.0, 0.1)
      }
    }
  }

  // ===== Central portico =====================================================
  const POD = ZF + 3.0, COLT = ZF + 12.2, PE = ZF + 14.5, PAP = ZF + 16.7
  const px0 = 1.2, px1 = 21.9, py0 = -51.9
  // Podium and the steps from the terrace (front and sides).
  cbox(stone, rect(px0 - 0.2, px1 + 0.2, py0, -43.7), 0, POD, { top: true })
  const nSteps = hi ? 8 : 4
  for (let k = 0; k < nSteps; k++) {
    const t = (k + 1) / (nSteps + 1)
    cbox(stone, rect(px0 - 6 + 4.5 * t, px1 + 6 - 4.5 * t, py0 - 3.6 + 3.6 * t, -43.7), 0, ZF + (POD - ZF) * t)
  }
  // Columns: 8 in front, one returning behind each end.
  const r = 0.68 // drawn a little bolder than the ~1.2 m shafts
  const cxs: number[] = []
  for (let k = 0; k < 8; k++) cxs.push(2.15 + k * (19.0 / 7))
  for (const x of cxs) corinthian(L, trim, trim, x, -51.2, POD, COLT, r)
  for (const x of [2.05, 21.2]) corinthian(L, trim, trim, x, -48.0, POD, COLT, r)
  if (hi) for (const x of [2.05, 21.2]) corinthian(L, trim, trim, x, -44.9, POD, COLT, r)
  // The wall behind the portico with its doors (the front of the central block).
  const wf = faceOf([-5.0, -43.75], [28.0, -43.75])
  for (const x of [5.5, CX, 17.6]) {
    const s = x + 5.0
    fpanel(door, wf, s - 1.2, s + 1.2, POD, POD + 4.6, 0.08)
    fblock(trim, wf, s - 1.6, s + 1.6, POD + 4.6, POD + 5.1, 0.03, 0.35, true)
  }
  fpanel(win, wf, CX + 5.0 - 1.4, CX + 5.0 + 1.4, POD + 6.0, POD + 8.0, 0.1) // the roundel / window over the door
  // The deep shadowed loggia behind the columns: the back wall reads dark from the square.
  fpanel(win, wf, px0 + 5.0 + 0.4, px1 + 5.0 - 0.4, POD, COLT, 0.03)
  // Entablature: architrave and frieze, cornice, all the way back to the wall.
  const eo = r * 1.5
  cbox(stone, rect(px0 + 0.3 - eo + 0.6, px1 - 0.3 + eo - 0.6, py0 + 0.7 - eo, -43.7), COLT, PE - 0.7, { bottom: true, top: false })
  cbox(trim, rect(px0 - 0.15, px1 + 0.15, py0 - 0.35, -43.7), PE - 0.7, PE, { bottom: true, top: roof })
  // Pediment (ridge along y), raking cornices, roof to the wall.
  const fy = py0 - 0.35, tym = fy + 0.5
  tf(stone, [px0 + 0.3, tym, PE], [px1 - 0.3, tym, PE], [CX, tym, PAP - 0.4], [0, -1, 0])
  for (const s of [-1, 1]) {
    const xe = s < 0 ? px0 - 0.4 : px1 + 0.4
    const A: V3 = [xe, fy - 0.3, PE], B: V3 = [CX, fy - 0.3, PAP], dz = 0.55
    qf(trim, A, B, [CX, B[1], PAP - dz], [xe - s * 1.1, A[1], PE], [0, -1, 0])
    qf(trim, [xe - s * 1.1, A[1], PE], [CX, B[1], PAP - dz], [CX, tym, PAP - dz], [xe - s * 1.1, tym, PE], [0, 0, -1])
    qf(roof, A, B, [CX, -43.7, PAP], [xe, -43.7, PE], [s * 2, 0, Math.abs(CX - xe)])
  }

  // ===== Dome ===============================================================
  const DC: XY = [CX, -41.2], DR = 5.6, nD = hi ? 24 : 16
  const dz0 = DECK - 0.2, dzT = 24.2, domeTop = 29.6, lanT = 32.4
  smooth(stone, (q) => lathe(q, [[DR, dz0 - 0.5], [DR, dzT - 0.6]], nD, DC[0], DC[1], false), 30)
  lathe(trim, [[DR, dzT - 0.6], [DR + 0.35, dzT - 0.3], [DR + 0.35, dzT], [DR - 0.2, dzT]], nD, DC[0], DC[1], false)
  // Arched windows round the drum (8).
  for (let k = 0; k < 8; k++) {
    const a = (TAU * (k + 0.5)) / 8, n: XY = [Math.cos(a), Math.sin(a)]
    if (n[1] > 0.6) continue // the back ones face away from the square
    const f: Face = { o: [DC[0] + n[0] * (DR + 0.02) + n[1] * 0.75, DC[1] + n[1] * (DR + 0.02) - n[0] * 0.75], u: [-n[1], n[0]], n, len: 1.5 }
    fpanel(win, f, 0, 1.5, dz0 + 1.6, dzT - 2.1, 0.04)
    const c = fpt(f, 0.75, dzT - 2.1, 0.04)
    for (let j = 0; j < 4; j++) {
      const t0 = (Math.PI * j) / 4, t1 = (Math.PI * (j + 1)) / 4
      tf(win, c, fpt(f, 0.75 + 0.75 * Math.cos(t0), dzT - 2.1 + 0.75 * Math.sin(t0), 0.04), fpt(f, 0.75 + 0.75 * Math.cos(t1), dzT - 2.1 + 0.75 * Math.sin(t1), 0.04), [n[0], n[1], 0])
    }
  }
  const prof: [number, number][] = []
  const nd = hi ? 7 : 4
  for (let k = 0; k <= nd; k++) {
    const t = (k / nd) * (Math.PI / 2) * 0.9
    prof.push([(DR - 0.15) * Math.cos(t), dzT + (domeTop - dzT) * Math.sin(t) / Math.sin((Math.PI / 2) * 0.9)])
  }
  smooth(roof, (q) => lathe(q, prof, nD, DC[0], DC[1], true), 40)
  // the dome's ribs, bold
  for (let k = 0; k < (hi ? 16 : 12); k++) {
    const a = (TAU * k) / (hi ? 16 : 12)
    for (let i = 0; i < prof.length - 1; i++) {
      const [r0, z0] = prof[i], [r1, z1] = prof[i + 1]
      const P = (rr: number, z: number, da: number): V3 => [DC[0] + (rr + 0.08) * Math.cos(a) - da * Math.sin(a), DC[1] + (rr + 0.08) * Math.sin(a) + da * Math.cos(a), z + 0.05]
      qf(trim, P(r0, z0, -0.16), P(r0, z0, 0.16), P(r1, z1, 0.16), P(r1, z1, -0.16), [Math.cos(a), Math.sin(a), 0.8])
    }
  }
  // Lantern: a little drum, cap and finial.
  lathe(stone, [[1.0, domeTop - 0.2], [1.0, domeTop + 1.6]], hi ? 10 : 6, DC[0], DC[1], false)
  lathe(roof, [[1.25, domeTop + 1.6], [1.25, domeTop + 1.8], [0.35, lanT - 0.4], [0.1, lanT]], hi ? 10 : 6, DC[0], DC[1], true)

  // ===== Pepperpots =========================================================
  for (const x of [-40.0, 63.1]) {
    const y = -38.4, zb = ZB
    cbox(stone, rect(x - 2.4, x + 2.4, y - 2.4, y + 2.4), ZE, zb + 0.5, { c: 0.15, top: true })
    cbox(trim, rect(x - 2.6, x + 2.6, y - 2.6, y + 2.6), zb + 0.5, zb + 0.85, { bottom: true })
    const rp = 1.75, z0 = zb + 0.85, z1 = 23.4
    // Drum: eight piers with real openings between, a solid core behind.
    const np = 8
    for (let k = 0; k < np; k++) {
      const a = (TAU * k) / np
      const px = x + rp * Math.cos(a), py = y + rp * Math.sin(a)
      cbox(stone, rect(px - 0.34, px + 0.34, py - 0.34, py + 0.34), z0, z1)
    }
    lathe(stone, [[rp * 0.62, z0], [rp * 0.62, z1]], hi ? 10 : 8, x, y, false)
    lathe(trim, [[rp + 0.35, z1], [rp + 0.35, z1 + 0.35], [rp + 0.1, z1 + 0.35]], hi ? 12 : 8, x, y, false)
    lathe(roof, [[rp + 0.2, z1 + 0.35], [rp * 1.0, z1 + 1.1], [rp * 0.55, z1 + 1.9], [0.14, z1 + 2.3]], hi ? 12 : 8, x, y, true)
    lathe(trim, [[0.22, z1 + 2.3], [0.22, z1 + 2.9], [0.05, z1 + 3.1]], 6, x, y, true)
  }

  // ===== Side porticos: paired attached columns, attic =====================
  for (const xs of [[-25.55, -23.05, -17.65, -14.85], [37.65, 40.55, 45.9, 48.75]]) {
    const x0 = xs[0] - 0.95, x1 = xs[3] + 0.95, yc = -43.8
    for (const x of xs) corinthian(L, trim, trim, x, yc, ZF + 1.0, ZC, 0.48)
    cbox(stone, rect(x0, x1, yc - 0.7, -41.2), ZC, ZE - 0.8, { bottom: true, top: false })
    cbox(trim, rect(x0 - 0.3, x1 + 0.3, yc - 1.0, -41.2), ZE - 0.8, ZE, { bottom: true, top: false })
    cbox(stone, rect(x0, x1, yc - 0.6, -41.2), ZE, ZF + 14.8 + 1.4, { c: 0.1, top: roof })
  }

  // ===== Gallery roof lights (glazed ridges behind the parapet) ============
  const rl: Array<[number, number, number, number, boolean]> = [
    [-52, -27, -32, -22, false], [-2, 5, -32, 18, true], [18, 25, -32, 18, true], [33, 70, -32, -24, false],
    [-52, -8, -14, -4, false], [31, 70, -14, -4, false], [-52, -8, 6, 16, false], [31, 70, 6, 16, false],
    [-62, -28, 30, 40, false], [-62, -28, 48, 58, false],
  ]
  for (const [x0, x1, y0, y1, ns] of rl) gable(glass, roof, rect(x0, x1, y0, y1), DECK, ZB - 0.3, ns)

  // ===== Materials =========================================================
  const flood = (p: V3, n: V3) => (p[1] < -36 && n[1] < -0.4 && p[2] < 30 ? 0.85 : 0)
  const parts: Array<{ part: Part; material: MaterialSpec }> = [
    { part: stone, material: { ...finish('portland-stone', 0xebe2d2), floodlight: flood } },
    { part: trim, material: { ...PALETTE.trim, floodlight: flood } },
    { part: roof, material: PALETTE.roof },
    { part: win, material: PALETTE.window },
    { part: glass, material: { ...PALETTE.glass, color: 0x9ea9b1 } },
    { part: door, material: PALETTE.entrance },
  ]
  return parts
}

export const REPLACES = ['way/1387097848', 'way/1145174506', ...Array.from({ length: 31 }, (_, i) => `way/${1145174469 + i}`)]

if (import.meta.main) {
  const extras = { landmark: 'National Gallery', wikidata: 'Q180788' }
  writeModel('National Gallery', ID, build(false), extras, 6500)
  writeModel('National Gallery', ID, build(true), extras, 40000, `${ID}.detail`)
}
