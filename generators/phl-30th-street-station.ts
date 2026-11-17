/**
 * 30th Street Station, Philadelphia (officially William H. Gray III 30th
 * Street Station since 2014/2020; 1927-33, Graham, Anderson, Probst & White)
 * — original procedural geometry, CC0-1.0.
 * bun generators/phl-30th-street-station.ts
 *
 * Name: the catalog uses "30th Street Station", the Wikipedia title and the
 * name in everyday use, short enough to label on a map. The official name,
 * William H. Gray III 30th Street Station (Congress, Aug 2014; in effect
 * 6 Feb 2020, per Wikipedia), is OSM's `name` and is recorded here.
 *
 * Map frame: x east, y north, z up, metres; turned to the catalog bearing
 * 9.2°, the station's walls (OSM edges run 9.1-9.5° / 99-99.5°). Origin =
 * area centroid of the OSM outline way/32272623, -75.182025 39.956019.
 * y = 0 is the street the station stands on (30th Street and the plaza on the
 * west, both ~10.6 m above the lidar's ground_min); the map's terrain is flat
 * under the whole station body.
 *
 * Identity, in order: the tall central concourse block with a deep Corinthian
 * porte-cochère at each end, six columns between broad corner piers on the
 * front and two more framing the drive-through on each side; the long lower
 * office wings, buff limestone with tall grey-green window bays; the corner
 * pavilions and the colonnade of square piers along Market Street; the row of
 * square grilles in the block's attic; the light courts either side of the
 * concourse; the upper-level platform shed's gabled canopies to the north.
 *
 * Evidence:
 *  - plan: OSM way/32272623 (outline incl. the platform shed), parts
 *    way/749651799 (station, 8 levels) and way/749651800 (shed, 2 levels).
 *    USGS 3DEP lidar USGS_LPC_DE_DelawareValley_HD_2015_LAS_2017 (flown 2015),
 *    1 m grid, read in this frame. OSM sits ~1.5-2.5 m inside the lidar walls,
 *    so the lidar is followed: body walls x -35.2 / 65.4 (102 m over the
 *    cornices; published width 327 ft = 99.7 m is often quoted for the walls),
 *    porticoes' fronts x -56.5 / 86.7, block y -54.8 / -7.6, Market Street
 *    colonnade front y -108.7, north pavilions to y 46.3, main north and south
 *    walls y 35.3 / -97.7, light courts 52 x 17 m either side of the block,
 *    corner pavilions 14.5 m wide. All measured; the model is made exactly
 *    symmetric about x 15.1, y -31.2, where lidar puts the centre (±0.5 m).
 *  - heights above the street (lidar): concourse block roof 34.3, edge 35.2
 *    (OSM height 35.4); main cornice top 27.4; wings' parapet 25.4, their roof
 *    21.6; Market Street colonnade entablature 18.2, the loggia roof behind it
 *    11.7; light-court floors 7.3; shed eaves 11.5, big canopy ridges 14.8,
 *    small ones 13.2; shed NE tower 16.8.
 *  - portico: from Harrison Keely's straight-on west front and Dough4872's
 *    east front, scaled by the 47 m block width: columns ~2.2 m across at 5.83 m
 *    centres, 22 m to the top of the capitals (published ~71 ft / 21.6 m with
 *    base and capital; photo-scaled 20.6-22 m); corner piers 7.3 m wide; only
 *    architrave and frieze between them and the cornice at 25.3-27.4 (lidar). Side faces
 *    (1930s Temple University photos and Beyond My Ken's): an 8 m front pier,
 *    a column either side of the drive-through, a 2.4 m back pier. Porch depth
 *    21.3 m (lidar). Estimates to ~0.5 m.
 *  - wings: 7 window bays plus an end pavilion with one wide bay on every
 *    wing front (ajay_suresh, Ngilmour3, Reading Tom, Temple photos); bays
 *    ~3.2 m wide at 5.6 m centres (windows ~55% of the pitch in Keely's photo), one tall opening per bay ~2.2-17.8 m with a transom line (estimated);
 *    dentil cornice band ~19.6-21.2 m (estimated from the same photos).
 *  - Market Street colonnade: 16 bays of square piers (count estimated from
 *    ajay_suresh's view and the 1930s Tichnor postcard of the matching north
 *    side). On the north the platform shed now meets the building at ~11.6 m
 *    (lidar), so the north loggia is drawn at that height.
 *  - attic grilles: a row of square grilles on the block's long sides above
 *    the wings (postcard, Temple photo, HAER aerials); 16 at 6 m, estimated.
 *  - shed: five east-west gabled canopies, big ones with glazed ridges (HAER
 *    PA-71-9/-10/-12 aerials, Ii2nmd's view from the west), ridge positions
 *    and heights from lidar; posts invented at a 10 m spacing.
 *  - colour: buff limestone from daylight photos (Keely, warm sun #d4baa0;
 *    ajay_suresh, cool #bbb9b7; OSM building:colour #e2d6be), pulled to the
 *    palette's lightness; window bays grey-green (#5e6b5d sampled); flat roofs
 *    warm light grey (NAIP #beb7a9 / #b1b2aa); canopies grey (NAIP #898277).
 *  - night: floodlit stone, the porticoes brightest (Lesbardd, King of Hearts
 *    and the elevated night view from the east); the porch glazing glows as
 *    `entrance`, the bays as `window`; canopy skylights stay dark `glass`.
 *
 * Photos (Wikimedia Commons; URLs https://commons.wikimedia.org/wiki/File:…):
 *  The_west_entrance_of_the_30th_Street_Station_…_viewed_from_John_F._Kennedy_
 *   Boulevard_01.jpg and _02.jpg (Harrison Keely, CC BY 4.0);
 *  30th_Street_Station_east_entrance_from_PA_3_WB.jpeg (Dough4872, CC BY-SA 4.0);
 *  William_H._Gray_III_30th_Street_Station_(53585709922).jpg (ajay_suresh, CC BY 2.0);
 *  30th_Street_Station_Philly.JPG (Smallbones, public domain);
 *  30th_Street_Station,_Philadelphia.JPG (Ngilmour3, CC BY-SA 3.0);
 *  30th_Street_Station_-_Philadelphia_(2643039316).jpg and (2643032780) (Reading Tom, CC BY 2.0);
 *  30th_Street_Station_and_Cira_Tower.jpg (Ii2nmd, CC BY-SA 4.0);
 *  30th_Street_Station_(9720454716).jpg (Ben Schumin, CC BY-SA 2.0);
 *  Exterior_of_30th_Street_Station_-_DPLA_-_b8e39cabf36ad40226895f46448d7864.jpg
 *   and …ec108a88dca33b9a21c962d110aebb24.jpg (Stanley Elmore Stady, public domain);
 *  The_Pennsylvania_Railroad's_new_passenger_terminal,_30th_Street,_Philadelphia,_PA_(61757).jpg
 *   (Tichnor postcard, public domain);
 *  HAER-30thStreetStation-09.jpg and Pennsylvania_Railroad-_30th_Street_Station…
 *   HAER_PA,51-PHILA,694-10 and -12 (Jack Boucher, HAER PA-71, public domain);
 *  30th_Street_Station_Philadelphia_July_2016_001.jpg (King of Hearts, CC BY-SA 3.0, night);
 *  30thStreet01LB.jpg (Lesbardd, CC BY-SA 4.0, night);
 *  30th_Street_Station,_Philadelphia_(14946959392).jpg (Billie Grace Ward, CC BY 2.0, night).
 *  USGS NAIP for the plan and roof colours. No look-only sources were used.
 *  No commercial imagery.
 *
 * Not in the model: way/334272296 ("30th Street", SEPTA), the small curved-
 * roof subway entrance pavilion ~80 m south-west of the station, a separate
 * building (seen in Ii2nmd's photo); the Cira Centre skybridge
 * (way/333367695) and the garage north of the shed (way/333367700), separate
 * ways. No former PRR office building is attached to the station or inside
 * its outline. No lettering: the frieze is plain in every photo.
 *
 * Doubts: the porch's inner layout behind the columns, the colonnade's pier
 * count and the shed's posts are estimates. The shed's west end stands over a
 * ramp down to the rail yard (terrain ~6 m below the street there); the map
 * drapes its posts to that ground. The wing roofs are drawn at the lidar's
 * 21.6 m inside a 25.4 m parapet. Left out: penthouses, flagpoles, lamps,
 * dentils, capitals' carving, the porch's coffers.
 */
import { Part, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { cap, inset, lathe, panel, rect, walls, type XY } from './chi-aon-center'

const CX = 15.1, CY = -31.2

// Body (wings, pavilions) and central block.
const HW = 50.3
const W0 = CX - HW, W1 = CX + HW // -35.2, 65.4
const SL = CY - 77.5, NL = CY + 77.5 // colonnade front / north pavilions
const SM = CY - 66.5, NM = CY + 66.5 // main south and north walls
const PAV = 14.5
const PW = W0 + PAV, PE = W1 - PAV
const PARA = 25.4, WROOF = 21.6
const BH = 23.6 // block half depth (y)
const BL = 71.6 // block half length (x), portico fronts
const B0 = CY - BH, B1 = CY + BH
const CH = 26 // court half length
const CS = 18.2 // court depth (y), from the block face
const CFLOOR = 7.3

// Block heights.
const SOFFIT = 22.0, FRIEZE = 25.3, CORN = 27.4, TOP = 35.2

function build() {
  const stone = new Part(), win = new Part(), ent = new Part(), roof = new Part(), shed = new Part(), glass = new Part()

  /** A closed box (no bottom) from world bounds, walls in `p`, top in `top`. */
  const box = (p: Part, top: Part | null, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number) => {
    const r = rect(Math.min(x0, x1), Math.min(y0, y1), Math.max(x0, x1), Math.max(y0, y1))
    walls(p, r, z0, z1)
    if (top) cap(top, r, z1)
  }

  // -------------------------------------------------------------------------
  // Body: one ring round wings, corner pavilions and the colonnade notches.
  const body: XY[] = [[W0, SL], [PW, SL], [PW, SM], [PE, SM], [PE, SL], [W1, SL], [W1, NL], [PE, NL], [PE, NM], [PW, NM], [PW, NL], [W0, NL]]
  const CB0 = 19.6, CB1 = 21.2 // dentil cornice band
  walls(stone, body, 0, CB0)
  const out = inset(body, -0.5)
  walls(stone, body, CB0, CB0 + 0.4, out)
  walls(stone, out, CB0 + 0.4, CB1 - 0.3)
  walls(stone, out, CB1 - 0.3, CB1, body)
  walls(stone, body, CB1, PARA - 0.35)
  const lip = inset(body, 0.35), inner = inset(body, 0.6)
  walls(stone, body, PARA - 0.35, PARA, lip)
  for (let k = 0; k < body.length; k++) {
    const j = (k + 1) % body.length
    stone.quad([lip[k][0], lip[k][1], PARA], [lip[j][0], lip[j][1], PARA], [inner[j][0], inner[j][1], PARA], [inner[k][0], inner[k][1], PARA])
  }
  walls(stone, [...inner].reverse(), WROOF, PARA)

  // Wing roofs, around the block and the two light courts.
  const i0 = W0 + 0.6, i1 = W1 - 0.6
  const cx0 = CX - CH, cx1 = CX + CH
  for (const s of [-1, 1]) {
    const yy = (d: number) => CY + s * d
    const rr = (x0: number, d0: number, x1: number, d1: number) => cap(roof, rect(x0, Math.min(yy(d0), yy(d1)), x1, Math.max(yy(d0), yy(d1))), WROOF)
    rr(i0, 77.5 - 0.6, PW - 0.6, 66.5 - 0.6) // pavilions
    rr(PE + 0.6, 77.5 - 0.6, i1, 66.5 - 0.6)
    rr(i0, 66.5 - 0.6, i1, BH + CS) // outer band
    rr(i0, BH + CS, cx0, BH) // beside the court
    rr(cx1, BH + CS, i1, BH)
    // Light court: walls facing in, floor, the concourse's tall windows on
    // the block face and smaller ones on the wings.
    const court = rect(cx0, Math.min(yy(BH), yy(BH + CS)), cx1, Math.max(yy(BH), yy(BH + CS)))
    const rev = [...court].reverse()
    walls(stone, rev, CFLOOR, WROOF)
    cap(roof, court, CFLOOR)
    for (let k = 0; k < 4; k++) {
      const a = rev[k], b = rev[(k + 1) % 4]
      const L = Math.hypot(b[0] - a[0], b[1] - a[1])
      const blockFace = Math.abs((a[1] + b[1]) / 2 - yy(BH)) < 0.1
      if (blockFace) {
        for (let q = 0; q < 6; q++) panel(win, a, b, 2.2 + q * 8.6, 2.2 + q * 8.6 + 4.6, 9.2, 20.6, 0.05)
      } else {
        const n = Math.max(1, Math.round(L / 5.6))
        const pitch = L / n
        for (let q = 0; q < n; q++) panel(win, a, b, q * pitch + pitch / 2 - 1.3, q * pitch + pitch / 2 + 1.3, 9.0, 19.5, 0.05)
      }
    }
  }

  // Wing fronts, east and west: an end pavilion with one wide bay, then
  // seven bays to the portico; the same on both wings, mirrored.
  // One tall opening per bay, a thin transom line across it.
  const ROWS: [number, number][] = [[2.2, 9.7], [9.95, 17.8]]
  for (const side of [1, -1]) {
    const a: XY = side > 0 ? [W1, SL] : [W0, NL], b: XY = side > 0 ? [W1, NL] : [W0, SL]
    const sOf = (y: number) => (side > 0 ? y - SL : NL - y)
    for (const s of [-1, 1]) {
      // d measured from the centre line outward along y.
      const at = (d: number) => sOf(CY + s * d)
      const pav = 77.5 - PAV / 2
      for (const [z0, z1] of ROWS) {
        const c = at(pav)
        panel(win, a, b, c - 2.8, c + 2.8, z0, z1, 0.05)
      }
      const span = (77.5 - PAV) - BH, n = 7, pitch = span / n
      for (let q = 0; q < n; q++) {
        const c = at(BH + pitch * (q + 0.5))
        for (const [z0, z1] of ROWS) panel(win, a, b, c - 1.6, c + 1.6, z0, z1, 0.05)
      }
    }
  }
  // Pavilions' outer (north and south) faces: one wide bay each.
  for (const [x0, x1] of [[W0, PW], [PE, W1]]) {
    const c = (x1 - x0) / 2
    for (const [z0, z1] of ROWS) {
      panel(win, [x0, SL], [x1, SL], c - 2.5, c + 2.5, z0, z1, 0.05)
      panel(win, [x1, NL], [x0, NL], c - 2.5, c + 2.5, z0, z1, 0.05)
    }
  }

  // Colonnades between the pavilions: square piers, an entablature, the
  // loggia roof behind; doors and windows on the wall behind. The Market
  // Street one stands 18.2 m; on the north the shed meets it at 11.7 m.
  const NB = 16, bay = (PE - PW) / NB
  for (const s of [-1, 1]) {
    const front = CY + s * 77.5, back = CY + s * 66.5
    const ent0 = s < 0 ? 16.6 : 10.1, ent1 = s < 0 ? 18.2 : 11.7
    for (let k = 1; k < NB; k++) {
      const x = PW + k * bay
      box(stone, null, x - 0.8, front, x + 0.8, front - s * 1.6, 0, ent0)
    }
    box(stone, stone, PW, front, PE, front - s * 2.0, ent0, ent1)
    cap(stone, rect(PW, Math.min(front, front - s * 2), PE, Math.max(front, front - s * 2)), ent0, false)
    cap(roof, rect(PW, Math.min(front - s * 2, back), PE, Math.max(front - s * 2, back)), 11.7)
    const a: XY = s < 0 ? [PW, back] : [PE, back], b: XY = s < 0 ? [PE, back] : [PW, back]
    for (let k = 0; k < NB; k++) panel(win, a, b, k * bay + bay / 2 - 1.2, k * bay + bay / 2 + 1.2, 1.0, 10.0, 0.05)
  }

  // -------------------------------------------------------------------------
  // Concourse block above the porches and wing roofs.
  const B = rect(CX - BL, B0, CX + BL, B1)
  walls(stone, B, SOFFIT, FRIEZE - 1.6)
  // A thin projecting band between architrave and frieze.
  const B1o = inset(B, -0.25)
  walls(stone, B, FRIEZE - 1.6, FRIEZE - 1.4, B1o)
  walls(stone, B1o, FRIEZE - 1.4, FRIEZE - 1.0)
  walls(stone, B1o, FRIEZE - 1.0, FRIEZE - 0.9, B)
  walls(stone, B, FRIEZE - 0.9, FRIEZE)
  // Main cornice.
  const Bc = inset(B, -1.0)
  walls(stone, B, FRIEZE, FRIEZE + 0.9, Bc)
  walls(stone, Bc, FRIEZE + 0.9, CORN - 0.4)
  walls(stone, Bc, CORN - 0.4, CORN, B)
  // Attic, with its top lip and roof.
  walls(stone, B, CORN, TOP - 0.3)
  const Bl = inset(B, 0.3), Bi = inset(B, 0.7)
  walls(stone, B, TOP - 0.3, TOP, Bl)
  for (let k = 0; k < 4; k++) {
    const j = (k + 1) % 4
    stone.quad([Bl[k][0], Bl[k][1], TOP], [Bl[j][0], Bl[j][1], TOP], [Bi[j][0], Bi[j][1], TOP], [Bi[k][0], Bi[k][1], TOP])
  }
  walls(stone, [...Bi].reverse(), TOP - 0.9, TOP)
  cap(roof, Bi, TOP - 0.9)
  // Square grilles in the attic over the wings, both long sides.
  for (const [a, b] of [[B[0], B[1]], [B[2], B[3]]] as [XY, XY][]) {
    for (let q = 0; q < 16; q++) {
      const xc = CX - 45 + q * 6, s = a[0] < b[0] ? xc - a[0] : a[0] - xc
      panel(win, a, b, s - 1.1, s + 1.1, 29.4, 31.6, 0.05)
    }
  }

  // Porte-cochères, east (+1) and west (-1).
  // Shafts drawn ~8% fatter than the real ~2.2 m so the colonnade holds at phone size.
  const RCOL: XY[] = [[1.4, 0], [1.4, 0.9], [1.17, 1.25], [1.0, 19.9], [1.38, 21.4], [1.45, 21.5], [1.45, SOFFIT]]
  for (const s of [1, -1]) {
    const X = (u: number) => CX + s * (HW + u)
    // The porch ceiling, deep in shade by day and lit at night.
    cap(ent, rect(Math.min(X(0), X(BL - HW)), B0, Math.max(X(0), X(BL - HW)), B1), SOFFIT, false)
    const D = BL - HW // 21.3
    for (const v of [-1, 1]) {
      // Corner piers (antae) and back piers.
      box(stone, null, X(D - 8), CY + v * 16.3, X(D), CY + v * BH, 0, SOFFIT)
      box(stone, null, X(0), CY + v * 20.6, X(2.4), CY + v * BH, 0, SOFFIT)
      // Side columns flanking the drive-through.
      for (const u of [3.8, 11.9]) lathe(stone, X(u), CY + v * (BH - 1.42), RCOL, 12)
    }
    for (const v of [-14.58, -8.75, -2.92, 2.92, 8.75, 14.58]) lathe(stone, X(D - 1.42), CY + v, RCOL, 12)
    // The porch's back wall: shaded stone and tall glazing over the doors,
    // which reads as one dark recess behind the columns in every photo.
    const a: XY = s > 0 ? [W1, SL] : [W0, NL], b: XY = s > 0 ? [W1, NL] : [W0, SL]
    const sOf = (y: number) => (s > 0 ? y - SL : NL - y)
    panel(ent, a, b, sOf(CY - s * BH), sOf(CY + s * BH), 0, SOFFIT, 0.6) // proud of the wings' cornice band
  }

  // -------------------------------------------------------------------------
  // Upper-level platform shed to the north: a deck of canopy roofs at the
  // eaves, five gabled canopies running east-west, posts below.
  const SX0 = -123.2, SX1 = 63.3
  const EAVE = 11.5, DECK0 = 9.6
  const deckW = rect(SX0, 38.5, W0, 83)
  const deckM = rect(W0, NL, SX1, 88)
  for (const r of [deckW, deckM]) {
    walls(shed, r, DECK0, EAVE)
    cap(shed, r, EAVE)
    cap(shed, r, DECK0, false)
  }
  const canopies: [number, number, number][] = [[40, 48, 14.8], [50, 55, 13.2], [56, 64.5, 14.8], [66, 71, 13.2], [72, 80.5, 14.8]]
  for (const [y0, y1, h] of canopies) {
    const ym = (y0 + y1) / 2, xa = SX0 + 0.5, xb = SX1 - 0.5
    const s0: V3[] = [[xa, y0, EAVE], [xb, y0, EAVE], [xb, ym, h], [xa, ym, h]]
    const s1: V3[] = [[xb, y1, EAVE], [xa, y1, EAVE], [xa, ym, h], [xb, ym, h]]
    shed.quad(s0[0], s0[1], s0[2], s0[3])
    shed.quad(s1[0], s1[1], s1[2], s1[3])
    shed.tri([xb, y0, EAVE], [xb, y1, EAVE], [xb, ym, h])
    shed.tri([xa, y1, EAVE], [xa, y0, EAVE], [xa, ym, h])
    if (h > 14) {
      // Glazed strips down each slope below the ridge.
      const t0 = 0.25, t1 = 0.85, lift = 0.06
      for (const [e, sgn] of [[y0, 1], [y1, -1]] as [number, number][]) {
        const at = (t: number, x: number): V3 => [x, e + (ym - e) * t, EAVE + (h - EAVE) * t + lift]
        if (sgn > 0) glass.quad(at(t0, xa), at(t0, xb), at(t1, xb), at(t1, xa))
        else glass.quad(at(t0, xb), at(t0, xa), at(t1, xa), at(t1, xb))
      }
    }
  }
  // Posts: along the edges and one middle row.
  for (const [r, ys] of [[[SX0, W0], [39.2, 61, 82.3]], [[W0, SX1], [47.5, 67.5, 87.3]]] as [[number, number], number[]][]) {
    const n = Math.round((r[1] - r[0]) / 10)
    for (let k = 0; k <= n; k++) {
      const x = Math.min(r[1] - 0.6, Math.max(r[0] + 0.6, r[0] + (k * (r[1] - r[0])) / n))
      for (const y of ys) box(shed, null, x - 0.4, y - 0.4, x + 0.4, y + 0.4, 0, DECK0)
    }
  }
  // East end: the stone-faced bridge over the tracks and the corner tower.
  box(stone, stone, SX1 - 1.0, NL, SX1, 81, 8.0, 14.3)
  cap(stone, rect(SX1 - 1.0, NL, SX1, 81), 8.0, false)
  box(stone, roof, 59, 81, 65, 89, 0, 16.8)
  // North edge: a raised fascia over the platform ends.
  box(shed, shed, W0, 86.6, 59, 88, EAVE, 14.3)

  // Floodlighting: the porticoes brightest, the wing fronts and pavilions
  // lit, the north side (behind the shed) and upward faces faint.
  const lit = (p: V3, n: V3): number => {
    if (n[2] > 0.7) return 0.12
    const dx = Math.abs(p[0] - CX), dy = p[1] - CY
    if (p[1] > NL + 1) return 0.2
    if (dx > HW + 0.5 && Math.abs(dy) < BH + 1.5) return 0.95 // porches
    if (Math.abs(n[0]) > 0.6) return 0.75 // east and west fronts
    if (dy > 0 && n[1] > 0.6) return 0.3 // north side
    return 0.55
  }

  return [
    { part: stone, material: { name: 'limestone', color: 0xe0d1bb, floodlight: lit } },
    { part: win, material: { name: 'window', color: 0x66796f, roughness: 0.35 } },
    { part: ent, material: { name: 'entrance', color: 0x464a50, roughness: 0.35 } },
    { part: roof, material: { name: 'roof', color: 0xbab6ad } },
    { part: shed, material: { name: 'shed-roof', color: 0x948f87 } },
    { part: glass, material: { name: 'glass', color: 0x5d6368, roughness: 0.24 } },
  ] as { part: Part; material: MaterialSpec }[]
}

if (import.meta.main) {
  const parts = build().filter((x) => x.part.triangles > 0)
  const triangles = parts.reduce((s, x) => s + x.part.triangles, 0)
  const glb = writeGlb('30th Street Station', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
    anchor: [39.956019, -75.182025], bearing: 9.2, osm: 'way/32272623', height: 35.2,
  })
  if (triangles > 6500 || glb.length > 250_000 || parts.length > 6) throw new Error(`budget exceeded: ${triangles} triangles, ${glb.length} bytes, ${parts.length} materials`)
  const out = process.argv[2] ?? new URL('../models/phl-30th-street-station.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}
