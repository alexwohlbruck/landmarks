/**
 * Fox Theatre, 660 Peachtree Street NE, Atlanta (1929, Marye, Alger &
 * Vinour; built as the Yaarab Shrine Temple) — original procedural
 * geometry, CC0-1.0.
 * bun generators/atl-fox-theatre.ts
 *
 * Uses the B9 kit exported from generators/atl-tech-tower.ts.
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground (Ponce de Leon at the building's west end).
 * Bearing 0: the plan is OSM's outline as drawn. Anchor = centroid of OSM
 * way/208355446 ("Fox Theatre", building:year_built 1929), 33.772598,
 * -84.385606. Peachtree Street runs along its east side (x ≈ 57–61; OSM
 * way/422300227), Ponce de Leon Avenue along its south side (y ≈ -28). Its
 * building:parts way/1341948178 (the south-west tower, roof:shape onion), way/1341948179,
 * way/1341948180 and way/1341948181 (the three domes), way/1341948185,
 * way/1341948186, way/1341948187, way/1341948188, way/1341948189 and
 * way/1341948190 lie inside it.
 *
 * Identity: Moorish Revival, in buff brick laid in broad horizontal bands
 * of cream stone. On Ponce: the "mosque" pavilion, a tall banded block with
 * a great horseshoe-arched portal and balcony, crowned by a big onion dome
 * (pale blue-white with a grey lattice) between two small turquoise domes, then a
 * long two-storey arcade of round-arched shopfronts running east to
 * Peachtree. On Peachtree: a low crenellated front with two minarets, the
 * tall red vertical FOX blade sign over a deep red-framed marquee at the
 * entrance. West of the pavilion, the plain banded mass of the auditorium
 * with a tall tower at its south-west corner. The FOX letters and the marquee are lit at night.
 *
 * Famous sign: the FOX blade sign is the landmark's emblem, so its letters
 * are modelled (STYLE.md, "Famous signs") with generators/lettering.ts,
 * traced from the JJonahJackalope and Atlantacitizen photos: three bold
 * stacked capitals with small slab serifs, cream on a red panel with a cream
 * border, on both faces of the blade (it projects from the facade, so its
 * faces look up and down Peachtree), reaching about 11 m over the parapet.
 * Material budget: the six slots are brick, stone, window, the turquoise
 * domes, the red sign and the pale onion dome, so the letters and border are
 * in the cream stone material with a full `_FLOODLIGHT` mask: they light up
 * cream at night while the red panel stays dark. The marquee's message boards
 * are `window` (dark by day, lit at night).
 *
 * Evidence:
 *  - plan: OSM way/208355446 and its parts. The three domes' centres and
 *    radii are from the dome parts; the corner tower from way/1341948178.
 *  - heights: USGS 3DEP lidar GA_Statewide_B2_2018 (2018 flight), max over
 *    3 m; the south-west corner's street (4.9 m over ground_min 304.03 m)
 *    is y = 0; Peachtree is 3 m higher. Measured, model metres: the
 *    auditorium mass 28.5, the south-west tower 39, the arcade 11,
 *    the dome pavilion's walls about 21; the big onion dome is drawn from
 *    the Daniel Mayer photo-S (13.2 m across, about 60% of the pavilion's
 *    width, its point 13 m over the parapet), which puts it some metres
 *    above the lidar's 26-29 m there (the 1 m grid may miss the point), the east wing 22, the north wings
 *    19, the Peachtree block 14 (11 over Peachtree), the minarets by the
 *    sign 21 and 19.
 *  - the portal, the arcade's arches, the bands, the marquee and the sign:
 *    scaled from the Daniel Mayer, Atlantacitizen and J. Miers photos
 *    against the plan: the marquee about 13 m long and 3 m deep at 6–8 m,
 *    the blade sign about 3.3 m wide and 12 m tall over it.
 *  - ground: Mapterhorn rises 4 m from the west end to Peachtree;
 *    elevation 0. The east walls sink into it; the marquee and sign are
 *    set 3 m up accordingly.
 *  - colours: buff brick and cream stone bands, the cream onion dome, the
 *    turquoise small domes, the red sign and marquee, from the photos.
 *    The flat roofs are pale (NAIP).
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Side and elevated view of Fabulous Fox Threater.JPG, Daniel Mayer,
 *    CC BY-SA 3.0 (Ponce front from above, the domes, the arcade, the sign)
 *    https://commons.wikimedia.org/wiki/File:Side_and_elevated_view_of_Fabulous_Fox_Threater.JPG
 *  - Fabulous Fox Theater and nearby hotels.JPG, Daniel Mayer, CC BY-SA 3.0
 *    https://commons.wikimedia.org/wiki/File:Fabulous_Fox_Theater_and_nearby_hotels.JPG
 *  - Fox Theatre.jpg, J. Miers, CC BY-SA 4.0 (the Ponce front, panorama)
 *    https://commons.wikimedia.org/wiki/File:Fox_Theatre.jpg
 *  - Fox Theatre Atlanta.jpg, Atlantacitizen, public domain (the Peachtree
 *    entrance, marquee and sign) https://commons.wikimedia.org/wiki/File:Fox_Theatre_Atlanta.jpg
 *  - Fox Theatre sign, Atlanta.jpg, JJonahJackalope, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:Fox_Theatre_sign,_Atlanta.jpg
 *  - Fox Theatre, Atlanta (2024)-104A8449.jpg, Frank Schulenburg, CC BY-SA
 *    4.0 (Peachtree front) https://commons.wikimedia.org/wiki/File:Fox_Theatre,_Atlanta_(2024)-104A8449.jpg
 *  - Fox Theater (2 minarets) 600 Peachtree Street Atlanta Georgia.JPG,
 *    Neonorange, CC BY-SA 3.0
 *    https://commons.wikimedia.org/wiki/File:Fox_Theater_(2_minarets)_600_Peachtree_Street_Atlanta_Georgia.JPG
 *  - Fox Theater night.jpg, Scott Ehardt, public domain (night)
 *    https://commons.wikimedia.org/wiki/File:Fox_Theater_night.jpg
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the north and east sides are seen in no photo and are drawn as
 * plain banded walls; the minarets' places are from the photos and
 * single lidar high points; the lattice on the big dome, the arcade's
 * columns, the balcony and the crescent finial are left out. At night the
 * real letters glow green neon (Scott Ehardt's public-domain night photo);
 * here they glow cream, as no seventh material is left for a green neon.
 * The auditorium's sides are plain brick: no photo shows striping on them.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { Pen, strokes } from './lettering'
import { archShape, box, capPoly, ccw, cornice, onWall, prism, rectShape, revolve, save, split, wall, type XY } from './atl-tech-tower'

const brick = new Part(), stone = new Part(), win = new Part(), patina = new Part(), red = new Part(), onion = new Part()
const neon = stone // the FOX letters: cream, lit by a floodlight mask (see the header)

// OSM way/208355446 in the frame.
const R = ccw([[57.86, 11.03], [45.68, 11.94], [36.58, 12.62], [37.87, 30.26], [13.26, 32.05], [13.33, 32.78], [-5.74, 34.45], [-5.81, 33.68], [-10.50, 34.09], [-10.91, 29.47], [-3.43, 28.82], [-3.72, 25.53], [-37.68, 27.90], [-37.25, 32.56], [-51.08, 33.66], [-50.94, 22.38], [-54.21, -23.66], [-54.41, -26.44], [-50.40, -26.72], [-40.43, -27.42], [-7.40, -28.82], [-1.64, -28.76], [20.89, -28.55], [54.68, -28.23], [56.96, -0.93], [58.52, -1.06], [59.86, -1.16], [60.79, 10.79], [59.56, 10.89]])

const ARC = 11 // the Ponce arcade and the low parts
const AUD = 28.5, EAST = 22, NORTH = 19, PEACH = 14
const PAV = 21 // the dome pavilion's parapet
const BAND = (p: Part, a: XY, b: XY, z0: number, z1: number) => {
  // broad cream stone bands across a banded wall, 0.9 m every 2.1 m
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  for (let z = z0 + 1.2; z + 0.9 <= z1; z += 2.1) onWall(p, a, b, rectShape(0, L, z, z + 0.9), 0.03)
}

// ── Low mass over the whole outline: the arcade, the shops, the lobbies ──
wall(brick, split(R, 5), 0, ARC)
capPoly(stone, R, ARC, true)
cornice(stone, R, ARC - 0.6, 0.6, 0.25, null)

// ── The auditorium (the west half) ──
const AU = ccw([[-54.21, -23.66], [8.3, -25.0], [8.3, 23.0], [-50.94, 22.38]] as XY[])
prism(brick, AU, ARC, AUD, stone, 0.3)
cornice(stone, AU, AUD - 1.2, 0.8, 0.3, null)
// The auditorium's sides are plain tan brick (the photos show the striping
// only on the street fronts), under a cream coping.
// The east wing, the north wings and the low Peachtree block.
prism(brick, ccw([[8.3, -7.5], [36.0, -7.5], [37.2, 30.3], [8.3, 30.3]] as XY[]), ARC, EAST, stone, 0.3)
prism(brick, ccw([[-50.9, 22.2], [8.3, 23.0], [8.3, 31.0], [-50.9, 32.5]] as XY[]), ARC, NORTH, stone, 0.3)
const PB = ccw([[36.0, -8.0], [56.3, -8.0], [56.96, -0.93], [59.86, -1.16], [60.79, 10.79], [45.68, 11.94], [36.58, 12.62]] as XY[])
prism(brick, PB, ARC, PEACH, stone, 0.2)
BAND(stone, [56.96, -0.93], [59.86, -1.16], 0, PEACH)
BAND(stone, [59.86, -1.16], [60.79, 10.79], 0, PEACH)
BAND(stone, [54.68, -28.23], [56.3, -8.0], 3, ARC)
BAND(stone, [20.89, -28.55], [54.68, -28.23], 3, ARC)

// Crenellations: stepped merlons on the Peachtree front and the arcade.
const merlons = (a: XY, b: XY, z: number, w = 1.2, h = 1.3, gap = 1.2) => {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), t = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], nn = [t[1], -t[0]]
  const n = Math.floor((L - gap) / (w + gap)), s0 = (L - (n * w + (n - 1) * gap)) / 2
  for (let k = 0; k < n; k++) {
    const s = s0 + k * (w + gap)
    const pts = [[s, 0.1], [s + w, 0.1], [s + w, -0.7], [s, -0.7]].map(([u, d]) => [a[0] + t[0] * u + nn[0] * d, a[1] + t[1] * u + nn[1] * d])
    const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1])
    box(brick, Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys), z, z + h, stone, 0.08)
  }
}
merlons([59.86, -1.16], [60.79, 10.79], PEACH)
merlons([20.89, -28.55], [54.68, -28.23], ARC, 0.9, 0.9, 1.0)
merlons([54.68, -28.23], [56.3, -8.0], ARC, 0.9, 0.9, 1.0)

// The two Peachtree minarets by the sign: a round one south of the
// entrance (lidar 21 m) and a square crenellated tower north of it (20 m).
const MA: XY = [56.4, -3.4]
revolve(brick, MA, [[1.5, ARC], [1.5, 20.0]], 12, 0, false, false)
revolve(stone, MA, [[1.8, 19.8], [1.8, 20.4], [1.45, 20.4], [1.4, 21.2], [0.9, 22.1], [0, 22.8]], 12, 0, false, true)
box(brick, 55.2, 59.2, 6.8, 10.9, PEACH, 19.0, stone, 0.15)
cornice(stone, ccw([[55.2, 6.8], [59.2, 6.8], [59.2, 10.9], [55.2, 10.9]] as XY[]), 18.4, 0.6, 0.25, stone)
revolve(brick, [57.2, 8.85], [[1.2, 19.0], [1.2, 20.6]], 8, Math.PI / 8, true, false)
revolve(stone, [57.2, 8.85], [[1.4, 20.5], [1.4, 20.9], [1.1, 20.9], [0.7, 21.8], [0, 22.4]], 8, Math.PI / 8, false, true)

// ── The south-west tower (OSM way/1341948178) ──
const CT: XY = [-52.3, -25.1]
box(brick, -54.45, -50.2, -26.75, -23.5, 0, 31, stone, 0.2)
BAND(stone, [-54.45, -26.75], [-50.2, -26.75], 0, 30)
BAND(stone, [-54.45, -23.5], [-54.45, -26.75], 0, 30)
cornice(stone, ccw([[-54.45, -26.75], [-50.2, -26.75], [-50.2, -23.5], [-54.45, -23.5]] as XY[]), 30.2, 0.8, 0.3, stone)
// its octagonal lantern and dome
revolve(brick, CT, [[1.7, 31], [1.7, 35.2]], 8, Math.PI / 8, true, false)
revolve(stone, CT, [[1.95, 35.0], [1.95, 35.6], [1.6, 35.6], [1.55, 36.6], [1.1, 37.9], [0.45, 38.6], [0, 39.3]], 8, Math.PI / 8, false, true)
for (let k = 0; k < 8; k++) {
  const a0 = Math.PI / 8 + (k / 8) * Math.PI * 2, a1 = a0 + Math.PI / 4
  const A: XY = [CT[0] + 1.7 * Math.cos(a0), CT[1] + 1.7 * Math.sin(a0)]
  const B: XY = [CT[0] + 1.7 * Math.cos(a1), CT[1] + 1.7 * Math.sin(a1)]
  const L = Math.hypot(B[0] - A[0], B[1] - A[1])
  onWall(win, A, B, archShape(L / 2, 0.55, 32.2, 33.8, 4), 0.04)
}
// ── The Ponce pavilion with the onion dome ──
const PX0 = -1.5, PX1 = 20.9, PY0 = -28.65, PY1 = -18.5
prism(brick, ccw([[PX0, PY0], [PX1, PY0], [PX1, PY1], [PX0, PY1]] as XY[]), 0, PAV, stone, 0.3)
BAND(stone, [PX0, PY0], [PX1, PY0], 0, PAV - 1.5)
BAND(stone, [PX1, PY0], [PX1, PY1], 0, PAV - 1.5)
BAND(stone, [PX0, PY1], [PX0, PY0], ARC, PAV - 1.5)
cornice(stone, ccw([[PX0, PY0], [PX1, PY0], [PX1, PY1], [PX0, PY1]] as XY[]), PAV - 1.4, 0.9, 0.35, stone)
// small stepped merlons along the parapet
merlons([PX0, PY0], [PX1, PY0], PAV - 0.5, 0.7, 0.7, 0.7)
// corner towers with the turquoise domes (OSM way/1341948179, way/1341948180)
for (const c of [[1.6, -25.7], [17.2, -25.45]] as XY[]) {
  box(brick, c[0] - 2.9, c[0] + 2.9, c[1] - 2.95, c[1] + 2.95, 0, PAV + 1.2, null, 0)
  BAND(stone, [c[0] - 2.9, c[1] - 2.95], [c[0] + 2.9, c[1] - 2.95], 0, PAV)
  cornice(stone, ccw([[c[0] - 2.9, c[1] - 2.95], [c[0] + 2.9, c[1] - 2.95], [c[0] + 2.9, c[1] + 2.95], [c[0] - 2.9, c[1] + 2.95]] as XY[]), PAV + 0.4, 0.8, 0.3, stone)
  revolve(patina, c, [[2.6, PAV + 1.2], [2.55, PAV + 1.9], [2.2, PAV + 2.8], [1.5, PAV + 3.5], [0.6, PAV + 3.9], [0, PAV + 4.0]], 14, 0, false, true)
}
// the big onion dome on its drum (OSM way/1341948181)
const OD: XY = [9.7, -22.0] // set back so the bulb stays inside the pavilion's front
revolve(stone, OD, [[5.4, PAV - 0.5], [5.4, PAV + 1.2], [5.8, PAV + 1.2], [5.8, PAV + 1.7]], 16, 0, true, false)
// the bulb: swelling past its drum to 13.2 m across, then drawn up to a point
revolve(onion, OD, [[5.4, PAV + 1.7], [6.3, PAV + 3.2], [6.6, PAV + 4.8], [6.2, PAV + 6.6], [5.0, PAV + 8.3], [3.2, PAV + 9.9], [1.4, PAV + 11.2], [0.4, PAV + 12.3], [0, PAV + 13.0]], 16, 0, false, true)
// the finial
revolve(stone, OD, [[0.25, PAV + 12.4], [0.12, PAV + 13.8], [0, PAV + 14.3]], 6, 0, false, true)
// the great horseshoe portal (as a deep round-headed recess) with three
// arched doors at its foot and a balcony window above, and side windows
const pf: [XY, XY] = [[PX0, PY0], [PX1, PY0]], pc = (PX1 - PX0) / 2
onWall(stone, pf[0], pf[1], archShape(pc, 9.6, 0, 11.5, 12), 0.04)
onWall(win, pf[0], pf[1], archShape(pc, 7.6, 3.6, 11.2, 12), 0.08)
onWall(stone, pf[0], pf[1], rectShape(pc - 3.8, pc + 3.8, 6.8, 7.6), 0.1)
for (const dx of [-2.6, 0, 2.6]) onWall(win, pf[0], pf[1], archShape(pc + dx, dx === 0 ? 2.2 : 1.6, 0.6, dx === 0 ? 4.6 : 3.8, 6), 0.1)
for (const s of [3.1, PX1 - PX0 - 3.1]) {
  onWall(win, pf[0], pf[1], archShape(s - 0.75, 1.2, 9.8, 11.4, 6))
  onWall(win, pf[0], pf[1], archShape(s + 0.75, 1.2, 9.8, 11.4, 6))
  onWall(win, pf[0], pf[1], archShape(s, 2.4, 0.6, 3.6, 8))
  for (const ds of [-1, 0, 1]) onWall(win, pf[0], pf[1], archShape(s + ds * 1.0, 0.45, 15.2, 16.8, 4))
}

// ── The Ponce arcade (east of the pavilion to Peachtree): arched shopfronts ──
// east of the pavilion along Ponce: plain arched shopfronts
{
  const a: XY = [20.89, -28.55], b: XY = [54.68, -28.23], L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = 6, w = L / n
  for (let k = 0; k < n; k++) onWall(win, a, b, archShape((k + 0.5) * w, w - 2.0, 0.8, 5.6, 8))
}
// Peachtree: storefronts south of the entrance, and the entrance doors.
{
  const a: XY = [54.68, -28.23], b: XY = [56.3, -8.0]
  for (const s of [4, 9, 14]) onWall(win, a, b, rectShape(s - 1.8, s + 1.8, 3.6, 7.6))
  const e0: XY = [59.86, -1.16], e1: XY = [60.79, 10.79]
  onWall(win, e0, e1, rectShape(1.0, 10.8, 3.4, 8.6), 0.06)
  for (const s of [2, 5, 8, 11]) onWall(win, e0, e1, archShape(s - 0.5, 1.4, 12.4, 14.0, 4))
}

// ── The marquee (red frame, lit message boards) ──
// On the Peachtree face from y -22 to -9, projecting 3 m over the sidewalk.
const xf = (y: number) => 59.86 + (y + 1.16) * ((60.79 - 59.86) / (10.79 + 1.16)) // facade x at y
const MY0 = -0.4, MY1 = 10.2, MZ0 = 8.8, MZ1 = 11.3, MD = 3.0
const XM = xf(5) - 0.2
box(red, XM, XM + MD, MY0, MY1, MZ0, MZ1, red, 0.12, true)
// lit boards on its three outer faces
const xo = XM + MD + 0.04
win.quad([xo, MY0 + 0.4, MZ0 + 0.35], [xo, MY1 - 0.4, MZ0 + 0.35], [xo, MY1 - 0.4, MZ1 - 0.35], [xo, MY0 + 0.4, MZ1 - 0.35])
win.quad([XM + 0.5, MY0 - 0.04, MZ0 + 0.35], [XM + MD - 0.3, MY0 - 0.04, MZ0 + 0.35], [XM + MD - 0.3, MY0 - 0.04, MZ1 - 0.35], [XM + 0.5, MY0 - 0.04, MZ1 - 0.35])
win.quad([XM + MD - 0.3, MY1 + 0.04, MZ0 + 0.35], [XM + 0.5, MY1 + 0.04, MZ0 + 0.35], [XM + 0.5, MY1 + 0.04, MZ1 - 0.35], [XM + MD - 0.3, MY1 + 0.04, MZ1 - 0.35])
// the canopy's lit soffit over the doors
stone.quad([XM, MY0, MZ0 - 0.02], [XM, MY1, MZ0 - 0.02], [XM + MD, MY1, MZ0 - 0.02], [XM + MD, MY0, MZ0 - 0.02])

// ── The FOX blade sign ──
// It stands on the marquee at its south end and projects from the
// facade; its faces look north and south along Peachtree.
const SY = 0.3, ST = 0.9 // centre line and thickness
const SX0 = xf(SY) + 0.1, SX1 = SX0 + 3.3 // from the facade out
const SZ0 = MZ1, SZ1 = 25
box(red, SX0, SX1, SY - ST / 2, SY + ST / 2, SZ0, SZ1, red, 0.12)
// the pointed crest on top and the finial
for (const s of [-1, 1]) {
  const y = SY + (s * ST) / 2
  const pts: V3[] = [[SX0, y, SZ1], [SX1, y, SZ1], [(SX0 + SX1) / 2, y, SZ1 + 1.6]]
  if (s < 0) red.tri(pts[0], pts[1], pts[2]); else red.tri(pts[1], pts[0], pts[2])
}
red.quad([SX0, SY - ST / 2, SZ1], [SX0, SY + ST / 2, SZ1], [(SX0 + SX1) / 2, SY + ST / 2, SZ1 + 1.6], [(SX0 + SX1) / 2, SY - ST / 2, SZ1 + 1.6])
red.quad([SX1, SY + ST / 2, SZ1], [SX1, SY - ST / 2, SZ1], [(SX0 + SX1) / 2, SY - ST / 2, SZ1 + 1.6], [(SX0 + SX1) / 2, SY + ST / 2, SZ1 + 1.6])
revolve(red, [(SX0 + SX1) / 2, SY], [[0.25, SZ1 + 1.4], [0.3, SZ1 + 2.0], [0, SZ1 + 2.6]], 6, 0, false, true)
// the red side posts standing proud of the panel (the photos' round
// columns), carried down to the marquee
for (const x of [SX0 - 0.05, SX1 - 0.25]) box(red, x, x + 0.3, SY - 0.35, SY + 0.35, SZ0 - 0.4, SZ1 + 0.4, red, 0.08)
// The letters: bold capitals with small slab serifs, cap height 1, each
// letter about 0.7 wide, stacked F O X downward.
function letter(ch: string): Pen {
  const p = new Pen(), sf = 0.12
  switch (ch) {
    case 'F':
      p.moveTo([0.12, 0]).lineTo([0.12, 1]).lineTo([0.66, 1]).lineTo([0.66, 0.86])
      p.moveTo([0.12, 0.54]).lineTo([0.5, 0.54])
      p.moveTo([0.12 - sf, 0]).lineTo([0.12 + sf + 0.06, 0])
      break
    case 'O':
      p.circle([0.37, 0.5], 0.3, 0.46, 14)
      break
    case 'X':
      p.moveTo([0.06, 1]).lineTo([0.66, 0]); p.moveTo([0.66, 1]).lineTo([0.06, 0])
      for (const [x, y] of [[0.06, 1], [0.66, 1], [0.06, 0], [0.66, 0]]) p.moveTo([x - sf, y]).lineTo([x + sf, y])
      break
  }
  return p
}
const CAP = 3.3, GAP = 0.9, LW = 0.72
const word = new Pen()
const order = ['F', 'O', 'X']
order.forEach((ch, i) => word.add(letter(ch), 0, -(i * (1 + GAP / CAP)) ))
for (const side of [-1, 1]) {
  // side -1: the south face (reader looks north, right = east); +1 north.
  const yF = SY + (side * ST) / 2
  const xc = (SX0 + SX1) / 2
  const top = SZ1 - 0.8
  const place = (u: number, v: number, w: number): V3 => {
    const along = (u - LW / 2) * CAP * 0.95
    return [xc + (side < 0 ? along : -along), yF + side * w * CAP, top - CAP + v * CAP]
  }
  strokes(neon, word.paths, { width: 0.2, depth: 0.05, place })
  // the cream border round the panel
  const bx0 = SX0 + 0.12, bx1 = SX1 - 0.12, bz0 = SZ0 + 0.5, bz1 = SZ1 - 0.15
  const ring: [number, number][] = [[bx0, bz0], [bx1, bz0], [bx1, bz1], [bx0, bz1]]
  for (let k = 0; k < 4; k++) {
    const [ax, az] = ring[k], [bx, bz] = ring[(k + 1) % 4]
    const hz = Math.abs(az - bz) < 1e-6
    const q: V3[] = hz
      ? [[Math.min(ax, bx), yF + side * 0.03, az - 0.09], [Math.max(ax, bx), yF + side * 0.03, az - 0.09], [Math.max(ax, bx), yF + side * 0.03, az + 0.09], [Math.min(ax, bx), yF + side * 0.03, az + 0.09]]
      : [[ax - 0.09, yF + side * 0.03, Math.min(az, bz)], [ax + 0.09, yF + side * 0.03, Math.min(az, bz)], [ax + 0.09, yF + side * 0.03, Math.max(az, bz)], [ax - 0.09, yF + side * 0.03, Math.max(az, bz)]]
    if (side < 0) stone.quad(q[0], q[1], q[2], q[3]); else stone.quad(q[3], q[2], q[1], q[0])
  }
}

// Night: windows and the marquee glow, the letters are neon; the domes and
// the Ponce pavilion are floodlit.
const inSign = (p: V3) => p[0] > SX0 - 0.4 && p[0] < SX1 + 0.4 && Math.abs(p[1] - SY) < ST / 2 + 0.4 && p[2] > SZ0 && p[2] < SZ1
const flood = (p: V3, n: V3) => (inSign(p) ? 1 : n[2] > 0.7 ? 0.1 : (p[1] < -18 && p[0] > -3 && p[0] < 23) ? 0.75 : p[0] > 54 ? 0.4 : 0.2)
await save('atl-fox-theatre', 'Fox Theatre', [
  { part: brick, material: { ...finish('fox-brick', 0xcdb68f), floodlight: (p, n) => (inSign(p) ? 0 : flood(p, n)) } },
  { part: stone, material: { ...finish('fox-stone', 0xece2cb), floodlight: flood } },
  { part: win, material: PALETTE.window },
  { part: patina, material: { ...finish('fox-dome-turquoise', 0x86bdb5), floodlight: () => 0.6 } },
  { part: red, material: finish('fox-sign-red', 0xb5403c) },
  { part: onion, material: { ...finish('fox-onion-dome', 0xd6e4ea), floodlight: () => 0.6 } },
], { height: 39.3, anchor: [33.772598, -84.385606], bearing: 0 }, 6500)
