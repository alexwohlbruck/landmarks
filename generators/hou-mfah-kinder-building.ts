/**
 * Nancy and Rich Kinder Building, Museum of Fine Arts, Houston (5500 Main
 * Street, 2020, Steven Holl Architects) — original procedural geometry,
 * CC0-1.0.
 * bun generators/hou-mfah-kinder-building.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Bearing 0 (the north side runs due east-west, the west side due
 * north-south; Main Street side at 34.7 deg). Anchor = centroid of the OSM
 * outline way/945257970, 29.7266049, -95.3897256.
 *
 * Identity, in order: a low, wide block wrapped all round in pale, milky
 * vertical glass tubes, whose tops make a wavy skyline; the cladding hovers
 * over a recessed, glazed ground floor; deep cuts in the outline for the
 * gardens and the V-shaped entrance court on Bissonnet, where the tubes run
 * down to the ground round a grey panel wall with a dark V window.
 *
 * Evidence:
 *  - plan: OSM way/945257970 (building=public, 2 levels, no height),
 *    simplified only where a jog is under 1.5 m; it agrees with the 2022
 *    NAIP roof. The garden cuts (west at y 1..8 and -22..-16, north at
 *    x -14..-10, east between (30.7, 3.5) and (39.8, 4.2)) and the V court
 *    (tip at (-2.5, -23)) are OSM's.
 *  - heights: the building opened in 2020, after the 2018 USGS lidar flight
 *    (TX_Coastal_B1_2018 shows a building site), so every height here is
 *    photo-scaled and estimated. In WhisperToMe's "10" (garden side, café
 *    umbrellas ~2.4 m tall = 29 px/m) the glazed ground floor is 5.2 m and
 *    the tube tops 19.5-22 m; in "06" (from Bissonnet) the ground floor is
 *    21% and the tubes 79% of the height, consistent. No published height
 *    was found. Roof drawn flat at 19.0 m inside the tube parapet.
 *  - the tube skyline: photos show the tops stepping in groups of tubes
 *    (09, 10), higher towards the middle of a face; drawn on each face longer
 *    than 15 m as 0.55 m steps from 19.8 m at the ends to 22 m mid-face,
 *    21 m on short faces. A simplification of Holl's curved roof edge, not a
 *    survey of it.
 *  - the V court: OSM narrows it to a 2 m tip at (-2.5, -23); the photos
 *    (03, 09) show a grey panel entrance wall about 9 m wide at its back,
 *    with the dark V window and the doors, under tubes from ~12 m up. Drawn
 *    from (-5.0, -27.8) to (4.0, -27.6), the V's sides kept on OSM's lines.
 *  - tubes: about 0.75 m across in the photos; drawn 1.6 m apart (half the
 *    real density, so they read without shimmering), as smooth half-round
 *    flutes.
 *  - colours, sampled and pulled to the palette's lightness: tubes read
 *    pale mint-grey (#87969e-#9babae in shade and backlight, near white in
 *    sun; drawn #d3e2e0); ground-floor glass dark (#25272c; drawn as the
 *    palette window); grey panel walls in the V court #9da0a6 (drawn
 *    #c2c6c9); roof white in NAIP (drawn #dfe2e1).
 *
 * Photos (all evidence, CC0, WhisperToMe, 2021-22):
 *  - "Nancy and Rich Kinder Building.jpg" and "01" to "10",
 *    https://commons.wikimedia.org/wiki/File:Nancy_and_Rich_Kinder_Building.jpg
 *    https://commons.wikimedia.org/wiki/File:Nancy_and_Rich_Kinder_Building_03.jpg
 *    https://commons.wikimedia.org/wiki/File:Nancy_and_Rich_Kinder_Building_06.jpg
 *    https://commons.wikimedia.org/wiki/File:Nancy_and_Rich_Kinder_Building_09.jpg
 *    https://commons.wikimedia.org/wiki/File:Nancy_and_Rich_Kinder_Building_10.jpg
 *  - "MFAH Kinder A.jpg", "MFAH Kinder Bldg.jpg"
 *    https://commons.wikimedia.org/wiki/File:MFAH_Kinder_A.jpg
 *  USGS NAIP for the plan and roof colour. Published: 2020, Steven Holl
 *  Architects (Wikipedia, "Museum of Fine Arts, Houston"). No commercial
 *  imagery. Look-only: "MFAH Aerial view.jpg" (MFAH archives, unlicensed),
 *  not used.
 *
 * Left out: the tubes' joints, the curved roof light scoops, the roof
 * terrace, the sculpture and planting.
 *
 * Doubts: all heights are photo-scaled (no lidar after 2020); the north and
 * east (Main Street) sides are in no licensed photo and are drawn like the
 * south and west; which garden cuts are open to the sky is a guess (all are
 * drawn open); the roof's own curves are left flat.
 *
 * Terrain: the map's Mapterhorn ground shows 9.2 m of relief across the
 * plan (from the 2018 lidar, when this was a building site; the real site
 * is flat). The model is kept true to the photos with y = 0 at street
 * level; `tools/terrain.ts check` prints ok (the map fills the footprint
 * from the ground outside).
 */
import { Part, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import { cap, inset, save, type XY } from './chi-aon-center'
import { wallSeg } from './hou-mfah-law-building'

const GF = 5.2, ROOF = 19.0, LOW = 19.8, HIGH = 22.0, STEP = 0.55
const PITCH = 1.6, TUBE_R = 0.55

// OSM way/945257970, counter-clockwise, small jogs dropped
const RING: XY[] = [
  [-37.43, -34.45], [-33.06, -35.49], [-26.61, -37.46], [-18.85, -40.34], [-12.52, -43.2],
  [-5.0, -27.8], [4.0, -27.6], // back wall of the V court (photos; OSM narrows to a 2 m tip)
  [13.56, -33.74], [24.74, -17.59], [29.83, -13.29], [36.58, -0.49],
  [30.68, 3.52], [33.88, 8.17], [39.78, 4.17], // east garden cut
  [57.07, 29.14], [-9.9, 28.4],
  [-9.9, 18.85], [-14.0, 18.85], [-14.0, 28.2], // north garden cut
  [-38.28, 27.94], [-38.01, 7.97], [-25.7, 7.97], [-25.65, 1.0], [-37.92, 0.91], // west garden
  [-37.68, -15.88], [-31.01, -15.83], [-30.97, -22.03], [-37.6, -22.1],
]
// faces where the tubes run down to the ground (the V court's sides)
const TO_GROUND = new Set([4, 6])
const TIP = 5 // the V's back wall: grey panels and the dark V window

function build() {
  const tube = new Part(), win = new Part(), panel = new Part(), roof = new Part()
  const n = RING.length
  const inner = inset(RING, 1.3)

  for (let i = 0; i < n; i++) {
    const a = RING[i], b = RING[(i + 1) % n]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], o: XY = [u[1], -u[0]] // along, outward
    const at = (s: number, out = 0): XY => [a[0] + u[0] * s + o[0] * out, a[1] + u[1] * s + o[1] * out]
    // the skyline: tops stepping up in groups towards the middle of each long face
    const top = (s: number) => L > 15 ? LOW + Math.round((HIGH - LOW) * Math.sin(Math.PI * s / L) / STEP) * STEP : 21.0

    if (i === TIP) {
      // grey panel wall to the roof, the dark V window in it, tubes over the top
      wallSeg(panel, a, b, 0, 12)
      const m = at(L / 2, 0.04)
      win.tri([...at(0.2, 0.04), 12 - 1] as V3, [...m, 6.5] as V3, [...at(L - 0.2, 0.04), 12 - 1] as V3)
      win.quad([...at(0.3, 0.04), 0] as V3, [...at(L - 0.3, 0.04), 0] as V3, [...at(L - 0.3, 0.04), 3.6] as V3, [...at(0.3, 0.04), 3.6] as V3)
      panel.quad([...a, 12] as V3, [...at(0, -2), 12] as V3, [...at(L, -2), 12] as V3, [...b, 12] as V3) // soffit
    }
    const z0 = i === TIP ? 12 : TO_GROUND.has(i) ? 0 : GF

    // ground floor: glazing set back under the hovering cladding, and its soffit
    if (z0 === GF) {
      const ia = inner[i], ib = inner[(i + 1) % n]
      wallSeg(win, ia, ib, 0, GF)
      panel.quad([...a, GF] as V3, [...ia, GF] as V3, [...ib, GF] as V3, [...b, GF] as V3)
    }

    // the tubes: smooth half-round flutes on a flat backing wall
    const k = Math.max(1, Math.round(L / PITCH)), w = L / k
    const r = Math.min(TUBE_R, w / 2)
    for (let t = 0; t < k; t++) {
      const s0 = t * w, s1 = s0 + w, sm = (s0 + s1) / 2, zt = top(sm)
      // backing wall, outside and in (above the roof it is a parapet)
      wallSeg(tube, at(s0), at(s1), z0, zt, 99)
      if (zt > ROOF) wallSeg(tube, at(s1), at(s0), ROOF, zt, 99)
      // half tube: 3 facets, smooth-shaded
      const pts: XY[] = [], nrm: V3[] = []
      for (let q = 0; q <= 3; q++) {
        const ang = Math.PI * q / 3 // 0 at the start side, pi at the end side
        const c = Math.cos(ang), sn = Math.sin(ang)
        pts.push(at(sm - r * c, r * sn + 0.02))
        nrm.push([-u[0] * c + o[0] * sn, -u[1] * c + o[1] * sn, 0])
      }
      for (let q = 0; q < 3; q++) {
        const A: V3 = [...pts[q], z0], B: V3 = [...pts[q + 1], z0], C: V3 = [...pts[q + 1], zt], D: V3 = [...pts[q], zt]
        tube.tri(A, B, C, undefined, undefined, undefined, [nrm[q], nrm[q + 1], nrm[q + 1]])
        tube.tri(A, C, D, undefined, undefined, undefined, [nrm[q], nrm[q + 1], nrm[q]])
      }
      // flat top of the tube
      for (let q = 1; q < 3; q++) tube.tri([...pts[0], zt] as V3, [...pts[q], zt] as V3, [...pts[q + 1], zt] as V3)
    }
  }
  cap(roof, RING, ROOF)

  const glow = (p: V3) => (p[2] > GF ? 0.55 : 0)
  return [
    { part: tube, material: { ...finish('mfah-kinder-tube', 0xd3e2e0), floodlight: glow } },
    { part: win, material: PALETTE.window },
    { part: panel, material: finish('mfah-kinder-panel', 0xc2c6c9) },
    { part: roof, material: finish('mfah-kinder-roof', 0xdfe2e1) },
  ]
}

if (import.meta.main) await save('hou-mfah-kinder-building', 'Nancy and Rich Kinder Building', [29.7266049, -95.3897256], 0, build())
