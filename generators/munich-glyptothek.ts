/**
 * Glyptothek, Königsplatz, Munich: Leo von Klenze, 1816-30, for the crown
 * prince Ludwig's collection of ancient sculpture; rebuilt 1947-72 after
 * the 1944 bombing. Pediment group by Johann Martin von Wagner. Original
 * procedural geometry, CC0-1.0.
 * bun generators/munich-glyptothek.ts
 *
 * Map frame: x east, y north, z up, metres, origin at the anchor on the
 * ground. Anchor = area centroid of the OSM multipolygon relation/532621
 * (outer way/25567731), 48.1465609, 11.5658254. Its walls run at 23.1
 * degrees, so the catalog bearing is 23.1 and the model is built square to
 * it: -y is the front on Königsplatz (facing SSW), +y the back on the
 * garden, ±x the long side walls. The portico's axis is x = -0.25.
 *
 * Identity, in order: a low, windowless, square block of pale limestone
 * round a courtyard, its walls broken only by statue niches under little
 * pediments; in the middle of the front a tall Ionic portico of eight
 * columns, a second row behind, under a pediment filled with sculpture
 * (Athena among the sculptors and artisans) and topped by a large
 * scrolled acroterion, with griffins on the corners; a small four-column
 * Ionic porch on the back between two big arched windows.
 *
 * Evidence:
 *  - plan (OSM, measured in the turned frame): outline x -32.6..32.7,
 *    y -32.9..33.7; courtyard (inner way/144291504) x -18.8..17.6,
 *    y -17.3..19.8; portico and vestibule part way/1576459171 x
 *    -12.45..11.95, the portico 4.45 m out from the front (to y -37.3), the
 *    vestibule back to y -15.3; rear porch x ±5, y 33.6..39.0; part
 *    way/1576459172 (the wings, height 15, gabled, roof:colour #a0b9ab).
 *  - heights: OSM relation height=23 (not seen in any photo: the vestibule
 *    roof doesn't show over the pediment from the square, so it is drawn
 *    lower). Measured from the two frontal photos scaled by the 65.3 m OSM
 *    front (Falbisoner 0.067 m/px, Flocci Nivis 0.062 m/px) and averaged:
 *    podium 0.75, wing walls to 11.4 (cornice 9.6-10.8, attic band above),
 *    portico stylobate 1.0, columns to 12.4, entablature to 15.15,
 *    pediment apex 18.3, acroterion top 20.4, corner acroteria 1.5 m; niche
 *    aedicules 2.8-7.9, niche 1.4 wide, 3.1-6.2 high, centres at 15.4, 22.0
 *    and 28.6 m either side; columns at ±1.55, ±4.65, ±7.75, ±10.8 from the
 *    axis, 1.36 m across. de.wikipedia: twelve Ionic columns.
 *  - estimated: the second row of four columns and the portico's back
 *    wall 3.2 m behind the front of the wings (photos show a deep, dark
 *    porch; twelve columns need a second row); the vestibule drawn as the
 *    temple body under the pediment's gable roof, back to y -15.3 (OSM
 *    part height 20 against the 18.3 m apex; its roof is seen in no photo);
 *    the wings' roofs kept behind the parapet (ridge 0.15 m above it,
 *    eaves 0.5 m below; OSM says gabled to 15 m, but the frontal photos
 *    show no roof over the wings and Praefcke's side view only a sliver of
 *    low grey metal roof); courtyard window
 *    sizes (de.wikipedia: the windows open on the courtyard; none of the
 *    photos shows it); the side niches (Praefcke shows two near the front
 *    corner; de.wikipedia names statues on both sides) drawn as two pairs a
 *    side; the rear porch and arched windows (Yair Haklai's rear photo).
 *  - colours: pale warm limestone, the niches and the deep porch in
 *    shadow (drawn dark, as the photos show them), the figures paler, grey metal roofs (photos, OSM).
 *  - night: the front is floodlit; stone carries _FLOODLIGHT, the portico
 *    door is `entrance`.
 *  - elevation 0 (flat Königsplatz). No lidar (none in Germany); no Bavarian
 *    3D city model used.
 *
 * Photos (Wikimedia Commons, all evidence):
 *  - Glyptothek_München_Front.JPG (Martin Falbisoner, CC BY-SA 3.0):
 *    frontal; heights.
 *  - 20221202_Glyptothek_Munich.jpg (Flocci Nivis, CC BY 4.0): frontal;
 *    heights, column spacing, niches.
 *  - Glyptothek,_Königsplatz,_Múnich,_Alemania06.JPG (Diego Delso, CC BY-SA
 *    3.0): the pediment group, acroteria, Ionic capitals.
 *  - München_Glyptothek_Seite.jpg (Andreas Praefcke, CC BY 3.0): the west
 *    side, niches, roof.
 *  - Exterior_of_Glyptothek_(München)-rear_facade.jpg (Yair Haklai, CC
 *    BY-SA 4.0): the back, rear porch, arched windows.
 * No commercial imagery, no 3D city models, no look-only sources.
 *
 * Left out: the egg-and-dart and dentil mouldings, the banners, the
 * rooftop lanterns, the inscriptions, the fine carving of the acroteria.
 * The pediment figures and niche statues are bold simplified figures in the
 * real arrangement; their poses are approximations.
 *
 * Doubts: the courtyard and the wing roofs are seen in no photo; the
 * second column row and the porch depth are inferred; the side niche count.
 *
 * Imports the classical kit from munich-propylaeen.ts (merge that first).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cap, inset, lathe, rect, type XY } from './chi-aon-center'
import { tube } from './munich-olympiaturm'
import { abox, corniceBox, extrudeOn, faceN, figure, ionic, palmette, saveLods, wallAt, wallBox, type Pose } from './munich-propylaeen'

const X0 = -32.6, X1 = 32.7, Y0 = -32.9, Y1 = 33.65 // outer walls
const CX0 = -18.8, CX1 = 17.6, CY0 = -17.3, CY1 = 19.8 // courtyard
const PC = -0.25 // portico axis
const POD = 0.75 // podium
const WALL = 11.4 // wing wall top
const STY = 1.0, COL = 12.4, ENT = 15.15, APEX = 18.3
const FRONT = -36.1, BACK = -32.9 // column rows
const PBACK = -29.7 // the porch's back wall
const PX = 12.2 // portico half width

function build(D: boolean) {
  const stone = new Part(), sculpt = new Part(), roof = new Part(), win = new Part(), shade = new Part(), door = new Part()

  // ------------------------------------------------------------ the wings
  // podium all round, walls, cornice and attic band, the low roof ring
  {
    // the podium: a ring 0.4 m round the walls (the courtyard is the map's)
    const o = rect(X0 - 0.4, Y0 - 0.4, X1 + 0.4, Y1 + 0.4), i = rect(X0, Y0, X1, Y1)
    for (let k = 0; k < 4; k++) {
      const a = o[k], b = o[(k + 1) % 4]
      faceN(stone, [[a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], POD], [a[0], a[1], POD]], [b[1] - a[1], a[0] - b[0], 0])
      faceN(stone, [[a[0], a[1], POD], [b[0], b[1], POD], [i[(k + 1) % 4][0], i[(k + 1) % 4][1], POD], [i[k][0], i[k][1], POD]], [0, 0, 1])
    }
  }
  // the walls, leaving the portico's slot open in the front wall
  {
    const r: XY[] = [[X0, Y0], [PC - PX, Y0], [PC - PX, PBACK], [PC + PX, PBACK], [PC + PX, Y0], [X1, Y0], [X1, Y1], [X0, Y1]]
    for (let i = 0; i < r.length; i++) {
      const a = r[i], b = r[(i + 1) % r.length]
      const n: V3 = [b[1] - a[1], -(b[0] - a[0]), 0]
      faceN(stone, [[a[0], a[1], POD], [b[0], b[1], POD], [b[0], b[1], WALL], [a[0], a[1], WALL]], n)
    }
    // courtyard walls face inward
    const c: XY[] = [[CX0, CY0], [CX1, CY0], [CX1, CY1], [CX0, CY1]]
    for (let i = 0; i < 4; i++) {
      const a = c[i], b = c[(i + 1) % 4]
      const n: V3 = [-(b[1] - a[1]), b[0] - a[0], 0]
      faceN(stone, [[a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], WALL], [a[0], a[1], WALL]], n)
      // windows on the courtyard, one per 6 m bay
      const L = Math.hypot(b[0] - a[0], b[1] - a[1]), k = Math.round(L / 6)
      const w = wallAt(a, [(b[0] - a[0]) / L, (b[1] - a[1]) / L], [n[0] / L, n[1] / L])
      for (let q = 0; q < k; q++) {
        const s = (L * (q + 0.5)) / k
        wallBox(win, w, s - 1.1, s + 1.1, 3.2, 8.2, 0.05)
      }
    }
  }
  // cornice and attic band round the outside
  corniceBox(stone, X0, Y0, X1, Y1, 9.7, 10.75, 0.55, false)
  abox(stone, X0 + 0.15, Y0 + 0.15, X1 - 0.15, Y1 - 0.15, 10.75, WALL, 'b,t')
  corniceBox(stone, X0 + 0.15, Y0 + 0.15, X1 - 0.15, Y1 - 0.15, WALL - 0.2, WALL, 0.12, false)
  // the roof ring: from both eaves to a ridge over the middle of the wings
  {
    // behind the parapet: a coping 0.5 m wide, the roof's eave 0.5 m below
    // it and its ridge only 0.15 m above, so from the square the wings read
    // flat-topped as in the photos
    const A = rect(X0 + 0.15, Y0 + 0.15, X1 - 0.15, Y1 - 0.15), O = inset(A, 0.5), I = rect(CX0, CY0, CX1, CY1)
    for (let i = 0; i < 4; i++) {
      const j = (i + 1) % 4
      faceN(stone, [[A[i][0], A[i][1], WALL], [A[j][0], A[j][1], WALL], [O[j][0], O[j][1], WALL], [O[i][0], O[i][1], WALL]], [0, 0, 1])
      faceN(stone, [[O[i][0], O[i][1], WALL - 0.5], [O[j][0], O[j][1], WALL - 0.5], [O[j][0], O[j][1], WALL], [O[i][0], O[i][1], WALL]], [-(O[j][1] - O[i][1]), O[j][0] - O[i][0], 0])
    }
    const R = O.map((o, i) => [(o[0] + I[i][0]) / 2, (o[1] + I[i][1]) / 2] as XY)
    const RZ = WALL + 0.15
    for (let i = 0; i < 4; i++) {
      const j = (i + 1) % 4
      const mo: XY = [(O[i][0] + O[j][0]) / 2, (O[i][1] + O[j][1]) / 2], mr: XY = [(R[i][0] + R[j][0]) / 2, (R[i][1] + R[j][1]) / 2]
      const out: V3 = [mo[0] - mr[0], mo[1] - mr[1], 0], L = Math.hypot(out[0], out[1])
      faceN(roof, [[O[i][0], O[i][1], WALL - 0.5], [O[j][0], O[j][1], WALL - 0.5], [R[j][0], R[j][1], RZ], [R[i][0], R[i][1], RZ]], [out[0] / L * 2.2, out[1] / L * 2.2, L / 1])
      faceN(roof, [[I[i][0], I[i][1], WALL], [I[j][0], I[j][1], WALL], [R[j][0], R[j][1], RZ], [R[i][0], R[i][1], RZ]], [-out[0] / L * 2.2, -out[1] / L * 2.2, L / 1])
    }
  }
  // corner pilasters (antae) on the outer corners and beside the portico
  for (const [x, y, sx, sy] of [[X0, Y0, 1, 1], [X1, Y0, -1, 1], [X0, Y1, 1, -1], [X1, Y1, -1, -1]] as [number, number, number, number][]) {
    abox(stone, Math.min(x, x + sx * 1.4), Math.min(y - sy * 0.15, y), Math.max(x, x + sx * 1.4), Math.max(y - sy * 0.15, y), POD, 9.7, 't')
    abox(stone, Math.min(x - sx * 0.15, x), Math.min(y, y + sy * 1.4), Math.max(x - sx * 0.15, x), Math.max(y, y + sy * 1.4), POD, 9.7, 't')
  }
  for (const s of [-1, 1]) abox(stone, Math.min(PC + s * PX, PC + s * (PX + 1.4)), Y0 - 0.15, Math.max(PC + s * PX, PC + s * (PX + 1.4)), Y0, POD, 9.7, 't')
  // base moulding over the podium
  corniceBox(stone, X0, Y0, X1, Y1, POD, POD + 0.35, 0.12, false)

  // niches: an aedicule (pilasters, sill, pediment) round a darker round-headed
  // niche, a statue standing in it
  const niche = (w: { P: (s: number, z: number, d?: number) => V3; u: XY; n: XY }, s: number) => {
    extrudeOn(shade, w, [[s - 0.95, 3.05], [s + 0.95, 3.05], [s + 0.95, 5.6], [s + 0.67, 6.27], [s, 6.55], [s - 0.67, 6.27], [s - 0.95, 5.6]], 0, 0.04)
    for (const k of [-1, 1]) wallBox(stone, w, s + k * 1.3 - 0.3, s + k * 1.3 + 0.3, 3.05, 6.85, 0.35)
    wallBox(stone, w, s - 1.75, s + 1.75, 2.7, 3.05, 0.55)
    wallBox(stone, w, s - 1.7, s + 1.7, 6.85, 7.3, 0.45)
    extrudeOn(stone, w, [[s - 1.8, 7.3], [s + 1.8, 7.3], [s, 8.15]], 0, 0.45)
    wallBox(stone, w, s - 1.35, s + 1.35, 1.9, 2.7, 0.2)
    const at = w.P(s, 3.05, 0.3)
    figure(sculpt, at, w.n, 3.15, 'stand', D ? 6 : 4)
    lathe(sculpt, at[0], at[1], [[0.32, 3.05], [0.32, 3.2], [0, 3.2]], D ? 8 : 6)
  }
  const wFront = (x: number) => wallAt([x, Y0], [1, 0], [0, -1])
  for (const s of [-1, 1]) for (const d of [15.4, 22.0, 28.6]) niche(wFront(0), 0.05 + s * d)
  for (const sx of [-1, 1]) {
    const w = sx > 0 ? wallAt([X1, 0], [0, 1], [1, 0]) : wallAt([X0, 0], [0, -1], [-1, 0])
    for (const y of [-27.0, -20.5, 3.5, 10.0]) niche(w, sx > 0 ? y : -y)
  }

  // ------------------------------------------------------- the portico
  const X = (dx: number) => PC + dx
  // stylobate, steps down to the square, the porch floor
  abox(stone, X(-PX), FRONT - 0.9, X(PX), PBACK, 0, STY, 'b')
  for (let i = 0; i < 3; i++) abox(stone, X(-PX - 0.4), FRONT - 0.9 - (i + 1) * 0.45, X(PX + 0.4), FRONT - 0.9 - i * 0.45, 0, STY - (i + 1) * 0.25, 'b')
  // the porch: side walls (antae) and the back wall with its door
  for (const s of [-1, 1]) abox(stone, X(s > 0 ? PX - 1.2 : -PX), BACK - 0.6, X(s > 0 ? PX : -PX + 1.2), PBACK, STY, COL, 'b,t')
  faceN(shade, [[X(-PX), PBACK - 0.03, STY], [X(PX), PBACK - 0.03, STY], [X(PX), PBACK - 0.03, COL], [X(-PX), PBACK - 0.03, COL]], [0, -1, 0])
  faceN(door, [[X(-1.4), PBACK - 0.05, STY], [X(1.4), PBACK - 0.05, STY], [X(1.4), PBACK - 0.05, 7.2], [X(-1.4), PBACK - 0.05, 7.2]], [0, -1, 0])
  wallBox(stone, wallAt([X(0), PBACK], [1, 0], [0, -1]), -2.1, 2.1, 7.2, 7.9, 0.25)
  // columns: eight in front, four behind
  const cols = [-10.8, -7.75, -4.65, -1.55, 1.55, 4.65, 7.75, 10.8]
  for (const c of cols) ionic(stone, X(c), FRONT, STY, COL, 0.68, 0.58, 'y', true, D ? 12 : 8)
  for (const c of [-7.75, -4.65, 4.65, 7.75]) ionic(stone, X(c), BACK, STY, COL, 0.68, 0.58, 'y', D, D ? 12 : 6)
  // entablature: architrave, frieze, cornice; ceiling over the porch
  const EF = FRONT - 0.75
  abox(stone, X(-PX), EF, X(PX), PBACK, COL, 13.55, 'b,t')
  faceN(shade, [[X(-PX), EF, COL], [X(PX), EF, COL], [X(PX), PBACK, COL], [X(-PX), PBACK, COL]], [0, 0, -1])
  abox(stone, X(-PX), EF + 0.08, X(PX), PBACK, 13.55, 14.4, 'b,t')
  corniceBox(stone, X(-PX), EF, X(PX), PBACK, 14.4, ENT, 0.6, true)
  // vestibule behind the porch, over the wings' roof
  // (a temple body under the pediment's roof, gabled back to y -15.3)
  const VB = -15.3
  abox(stone, X(-PX), PBACK, X(PX), VB, WALL, ENT - 0.6, 'b,t')
  corniceBox(stone, X(-PX), PBACK, X(PX), VB, ENT - 0.6, ENT, 0.4, true)

  // pediment: tympanum, raking cornices, roof to the vestibule
  const RH = APEX - ENT, HW = PX + 0.6, RC = 0.65, YT = EF + 0.6, YR = EF - 0.6
  const yMeet = HW * (1 - RC / RH)
  faceN(stone, [[X(-yMeet), YT, ENT], [X(yMeet), YT, ENT], [X(0), YT, APEX - RC]], [0, -1, 0])
  const top = (x: number) => ENT + RH * (1 - Math.abs(x) / HW)
  for (const s of [-1, 1]) {
    const xE = s * HW
    faceN(stone, [[X(xE), YR, ENT], [X(s * yMeet), YR, ENT], [X(0), YR, APEX - RC], [X(0), YR, APEX]], [0, -1, 0])
    faceN(stone, [[X(s * yMeet), YT, ENT], [X(s * yMeet), YR, ENT], [X(0), YR, APEX - RC], [X(0), YT, APEX - RC]], [-s * RH, 0, -HW])
    faceN(stone, [[X(0), YR, APEX], [X(xE), YR, top(xE)], [X(xE), YT, top(xE)], [X(0), YT, APEX]], [s * RH, 0, HW])
    faceN(roof, [[X(0), YT, APEX], [X(xE), YT, top(xE)], [X(xE), VB + 0.4, top(xE)], [X(0), VB + 0.4, APEX]], [s * RH, 0, HW])
  }
  // the vestibule's front wall above the porch roof is hidden: close the gable from behind
  faceN(stone, [[X(-HW), VB + 0.4, ENT], [X(HW), VB + 0.4, ENT], [X(0), VB + 0.4, APEX]], [0, 1, 0])

  // the pediment group: Athena among the artisans
  const cast: [number, number, Pose][] = [
    [0, 2.95, 'stand'], [-1.75, 2.9, 'seated'], [1.6, 2.35, 'kneel'], [-3.5, 2.3, 'stand'], [3.3, 2.3, 'stand'],
    [-5.1, 2.2, 'kneel'], [5.1, 2.0, 'seated'], [-6.7, 1.8, 'kneel'], [6.7, 1.8, 'kneel'], [-8.8, 1.6, 'recline-l'], [8.8, 1.6, 'recline'],
  ]
  for (const [a, h, pose] of cast) {
    if (!D && (Math.abs(a) > 6 && Math.abs(a) < 7)) continue
    // facing -y: side = (-fwd.y, fwd.x) = (1, 0) along +x
    figure(sculpt, [X(a), YT - 0.55, ENT], [0, -1], h, pose, D ? 6 : 4)
  }
  for (const s of [-1, 1]) lathe(sculpt, X(s * 10.6), YT - 0.5, [[0.25, ENT], [0.42, ENT + 0.35], [0.22, ENT + 0.75], [0.3, ENT + 0.85], [0, ENT + 0.88]], D ? 8 : 6)
  // acroteria: the big scrolled palmette on the apex, griffins on the corners
  {
    const w = wallAt([X(0), YT - 0.3], [1, 0], [0, -1])
    extrudeOn(sculpt, w, palmette(0, APEX - 0.1, 2.3, 1.6, D ? 9 : 6), -0.3, 0.3, true)
    for (const s of [-1, 1]) {
      // two upright scrolls above the fan
      tube(sculpt, w.P(s * 0.35, APEX + 1.2, 0), w.P(s * 0.25, APEX + 2.05, 0), 0.13, 0.11, D ? 6 : 4, false)
      tube(sculpt, w.P(s * 0.25, APEX + 2.05, -0.15), w.P(s * 0.25, APEX + 2.05, 0.15), 0.2, 0.2, D ? 8 : 5, true)
    }
    for (const s of [-1, 1]) {
      // a crouching griffin: body, chest, head, a raised wing
      const g = wallAt([X(s * (HW - 0.7)), YT - 0.3], [-s, 0], [0, -1])
      tube(sculpt, g.P(-0.45, ENT + 0.45, 0), g.P(0.35, ENT + 0.55, 0), 0.28, 0.32, D ? 6 : 4, true)
      tube(sculpt, g.P(0.35, ENT + 0.5, 0), g.P(0.55, ENT + 1.15, 0), 0.24, 0.17, D ? 6 : 4, true)
      tube(sculpt, g.P(0.5, ENT + 1.15, 0), g.P(0.8, ENT + 1.2, 0), 0.14, 0.06, D ? 6 : 4, true)
      extrudeOn(sculpt, g, [[-0.35, ENT + 0.7], [0.25, ENT + 0.75], [0.0, ENT + 1.45], [-0.3, ENT + 1.3]], -0.08, 0.08, true)
      for (const k of [-0.4, 0.3]) tube(sculpt, g.P(k, ENT + 0.4, 0.12), g.P(k + 0.05, ENT, 0.12), 0.08, 0.07, 4, false)
    }
  }

  // --------------------------------------------------- the back porch
  {
    const PY0 = Y1, PY1 = 39.0, ZC = 9.0, ZE = 11.0, ZA = 13.0
    abox(stone, -5.6, PY0, 5.6, PY1 + 1.2, 0, POD + 0.25, 'b')
    for (const x of [-3.9, -1.3, 1.3, 3.9]) ionic(stone, x, PY1 - 0.7, POD + 0.25, ZC, 0.5, 0.42, 'y', true, D ? 10 : 8)
    for (const s of [-1, 1]) abox(stone, Math.min(s * 5.0, s * 5.6), PY0, Math.max(s * 5.0, s * 5.6), PY1 - 1.5, POD, ZC, 'b,t')
    faceN(door, [[-1.1, PY0 + 0.05, POD + 0.25], [1.1, PY0 + 0.05, POD + 0.25], [1.1, PY0 + 0.05, 4.4], [-1.1, PY0 + 0.05, 4.4]], [0, 1, 0])
    abox(stone, -5.6, PY0, 5.6, PY1, ZC, ZE - 0.5, 't')
    corniceBox(stone, -5.6, PY0, 5.6, PY1, ZE - 0.5, ZE, 0.3, true)
    // its pediment, ridge running back to the wing roof
    faceN(stone, [[-5.9, PY1 + 0.3, ZE], [5.9, PY1 + 0.3, ZE], [0, PY1 + 0.3, ZA]], [0, 1, 0])
    for (const s of [-1, 1]) faceN(roof, [[0, PY1 + 0.3, ZA], [s * 5.9, PY1 + 0.3, ZE], [s * 5.9, PY0, ZE], [0, PY0, ZA]], [s * 2, 0, 5.9])
    // arched windows at the ends of the back wall
    for (const s of [-1, 1]) {
      const w = wallAt([0, Y1], [-1, 0], [0, 1]), c = -s * 25
      extrudeOn(stone, w, [[c - 3.3, 1.6], [c + 3.3, 1.6], [c + 3.3, 6.2], [c - 3.3, 6.2]], 0, 0.12)
      const arch: XY[] = [[c - 1.9, 1.9]]
      for (let i = 0; i <= 8; i++) { const a = Math.PI - (i / 8) * Math.PI; arch.push([c + 1.9 * Math.cos(a), 6.0 + 1.9 * Math.sin(a)]) }
      arch.push([c + 1.9, 1.9])
      extrudeOn(win, w, arch, 0, 0.16)
      for (const k of [-1, 1]) wallBox(stone, w, c + k * 0.75 - 0.15, c + k * 0.75 + 0.15, 1.9, 6.0, 0.22)
      wallBox(stone, w, c - 1.95, c + 1.95, 5.9, 6.15, 0.22)
    }
  }

  const flood = (p: V3, n: V3) => (n[2] > 0.7 ? 0.2 : p[1] < -25 ? 0.95 : 0.55)
  return [
    { part: stone, material: { ...finish('glyptothek-limestone', 0xeadcc4), floodlight: flood } },
    { part: sculpt, material: { ...finish('glyptothek-sculpture', 0xf6efe3), floodlight: flood } },
    { part: shade, material: finish('glyptothek-shade', 0x7f7464) },
    { part: roof, material: finish('glyptothek-roof', 0x767d84) },
    { part: win, material: { ...PALETTE.window } },
    { part: door, material: { ...PALETTE.entrance, color: 0x5e564c } },
  ]
}

if (import.meta.main) {
  await saveLods('munich-glyptothek', 'Glyptothek', [48.1465609, 11.5658254], 23.1, build(false), build(true))
}
