/**
 * High Museum of Art, Woodruff Arts Center, 1280 Peachtree Street NE,
 * Atlanta (1983, Richard Meier; 2005 wings, Renzo Piano) — original
 * procedural geometry, CC0-1.0.
 * bun generators/atl-high-museum.ts
 *
 * Uses the B9 kit exported from generators/atl-tech-tower.ts.
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground (the street west of the Bunzl wing). Bearing 0: the plan is
 * OSM's parts as drawn. Anchor = centroid of OSM way/28961738 ("High Museum
 * of Art", wikidata Q953345), 33.789731, -84.385959. The outline covers the
 * Meier building and Piano's three wings; its building:parts are
 * way/1453239398 (the Meier building), way/1424891402 (Hill Auditorium,
 * under the Meier entrance), way/1424891388 (the bridge), way/1424891448
 * (Wieland Pavilion), way/1424891449 and way/1453239397 (Anne Cox Chambers
 * Wing), way/1424891450 (Bunzl Administrative Center), way/1453239393 and
 * way/1453239394 (links).
 *
 * Identity: Meier's white building: square white enamel panels in a fine
 * grid, ribbon windows and big glazed bays, a quarter-round four-storey
 * atrium facing south-east to the entrance ramp, roofed by a fan of stepped
 * glass. Piano's wings round the piazza to the west and south: tall plain
 * boxes of white aluminium panels on glazed ground floors, their roofs
 * covered in rows of curved light scoops that make a scalloped crest
 * along the roof edge; the Bunzl wing has a green roof.
 *
 * Evidence:
 *  - plan: OSM parts as drawn; the atrium's arc (centre 27.2, 39.0,
 *    radius 19.5) is a circle fitted to the Meier part's curved edge. The
 *    glass fan on the roof covers a full quarter circle of that radius, as
 *    NAIP shows; the curved wall itself spans only the 52° OSM draws.
 *  - heights: USGS 3DEP lidar GA_Statewide_B2_2018 (2018 flight), max over
 *    4 m; ground_min 281.10 m, and the street west of the Bunzl wing (7.5 m
 *    over it) is y = 0; the piazza and Peachtree are 5 m higher. Measured,
 *    model metres: Meier roof 26.5 including the atrium's curved wall
 *    (27.7 at its parapet), Hill
 *    Auditorium's terrace 13 (lidar 15.5–19.5 there, with trees), Wieland Pavilion 28.5, Anne Cox Chambers Wing 28.5
 *    (30 over its north part), Bunzl 20.5.
 *  - the scoops: about 1.5 m tall at 3.6 m spacing (photos, NAIP rows),
 *    facing north; the glazed ground floors about 5 m (photos).
 *  - ground: Mapterhorn varies about 6 m across the site; elevation 0.
 *  - colours: all white is real here; the enamel is drawn as near-pure white (0xfbfbf8), the
 *    aluminium a cooler pale grey so the two architects read apart, with
 *    slate windows, the glass fan, white Meier roofs and grey Piano roofs
 *    (NAIP), and the green roof.
 *
 * Photos (EVIDENCE):
 *  - High Museum of Art, Meier Building.jpg, Marc Merlin, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:High_Museum_of_Art,_Meier_Building.jpg
 *  - High Museum in Atlanta.jpg, BakedintheHole, CC0
 *    https://commons.wikimedia.org/wiki/File:High_Museum_in_Atlanta.jpg
 *  - 10 The High.jpg, Atlantacitizen, CC BY-SA 3.0 (Meier from Peachtree)
 *    https://commons.wikimedia.org/wiki/File:10_The_High.jpg
 *  - High Museum of Art (8215186745).jpg, Aleksandr Zykov, CC BY-SA 2.0
 *    (the ramp and atrium) https://commons.wikimedia.org/wiki/File:High_Museum_of_Art_(8215186745).jpg
 *  - High Museum, Atlanta, Renzo Piano, 2005 (Flickr 3589728826, 3589735152,
 *    3589735808, 3589739330), Tim Brown Architecture, CC BY 2.0 (the Piano
 *    wings and the scoop crest)
 *    https://www.flickr.com/photos/11381771@N04/3589728826
 *    https://www.flickr.com/photos/11381771@N04/3589735152
 *    https://www.flickr.com/photos/11381771@N04/3589735808
 *    https://www.flickr.com/photos/11381771@N04/3589739330
 * No look-only sources. No commercial imagery.
 *
 * Meier's glazing follows the photos: one big glazed band round the
 * atrium's curve and ground-floor ribbons; every other wall is white panel.
 *
 * Doubts: the atrium's real roof steps in more rings than drawn; the
 * Meier panel grid (fine square joints) is left out as it would read as
 * pinstripes; the tall narrow window slots on the east block are left out; the scoops
 * are simplified to two-facet hoods and thinned; Hill Auditorium's block
 * and the links are drawn as plain white boxes.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { capPoly, ccw, cornice, edgePanels, prism, save, split, wall, type XY } from './atl-tech-tower'

const enamel = new Part(), alu = new Part(), win = new Part(), glass = new Part(), roof = new Part(), green = new Part()

const MEIER = ccw([[1.21, 26.13], [-1.24, 30.49], [7.95, 35.42], [7.19, 36.82], [3.70, 34.94], [-2.96, 47.16], [9.21, 53.90], [10.97, 50.78], [15.52, 53.31], [13.76, 56.43], [37.43, 69.56], [47.45, 51.76], [49.10, 52.68], [50.19, 52.96], [51.32, 52.65], [55.23, 48.66], [56.99, 48.14], [57.72, 47.72], [58.31, 47.21], [58.79, 46.64], [59.21, 45.87], [59.58, 44.48], [59.51, 43.11], [59.09, 41.94], [58.66, 41.27], [57.87, 40.19], [57.11, 40.20], [54.27, 38.23], [53.30, 39.53], [51.97, 38.85], [49.36, 43.42], [46.32, 42.68], [46.70, 39.57], [46.49, 36.11], [45.84, 33.28], [45.17, 31.48], [44.32, 29.78], [41.92, 26.19], [44.49, 24.47], [42.99, 22.58], [41.37, 20.90], [39.48, 19.26], [36.72, 17.35], [18.90, 6.89], [8.94, 25.66], [6.85, 29.31]])
const HILL = ccw([[57.23, 11.41], [49.14, 16.25], [44.71, 12.32], [43.52, 13.65], [40.25, 11.63], [39.71, 11.83], [37.87, 15.22], [36.72, 17.35], [39.48, 19.26], [41.37, 20.90], [42.99, 22.58], [44.49, 24.47], [45.84, 26.53], [47.06, 28.87], [47.97, 31.15], [50.72, 29.82], [51.74, 31.90], [62.89, 25.24], [63.24, 25.81], [63.62, 26.43], [66.41, 24.76], [64.73, 21.99], [65.89, 21.29], [65.85, 18.62], [60.86, 10.41], [57.75, 12.27], [57.50, 11.86]])
const BRIDGE = ccw([[-0.10, 25.40], [1.21, 26.13], [6.85, 29.31], [8.94, 25.66], [7.72, 24.96], [4.40, 23.10], [1.35, 21.38], [-2.42, 19.26], [-4.51, 22.91]])
const WIELAND = ccw([[-24.17, -15.63], [-36.01, -22.06], [-40.01, -2.22], [-35.04, 0.61], [-36.20, 3.02], [-37.22, 5.14], [-41.07, 3.07], [-45.72, 26.09], [-43.73, 27.18], [-45.15, 29.75], [-18.67, 44.42], [-10.18, 29.33], [-8.57, 30.22], [-4.51, 22.91], [-2.42, 19.26], [1.35, 21.38], [4.46, 15.66], [6.24, 16.60], [11.67, 7.20], [17.30, -2.99], [7.18, -8.49], [3.00, -0.93], [-13.75, -10.06], [-21.12, -14.07], [-23.78, -9.25], [-26.79, -10.90]])
const ANNE = ccw([[-34.63, -26.43], [-21.89, -19.77], [-21.11, -21.17], [-18.01, -26.78], [-9.69, -41.83], [-29.99, -53.08], [-32.19, -41.67], [-34.34, -30.53], [-32.82, -29.63], [-33.90, -27.71]])
const ANNE_N = ccw([[-29.99, -53.08], [-9.69, -41.83], [-6.68, -47.28], [-28.68, -59.89]])
const BUNZL = ccw([[-28.15, -62.63], [-5.21, -49.93], [-1.98, -55.78], [-4.49, -57.19], [-13.32, -62.15], [-10.95, -66.54], [-9.82, -68.62], [1.62, -89.80], [2.75, -91.88], [5.25, -96.54], [-3.68, -101.31], [-6.38, -96.14], [-9.08, -97.57], [-6.31, -102.71], [-10.32, -104.86], [-12.71, -106.15], [-19.08, -109.56], [-20.20, -103.73]])
const LINK_S = ccw([[-28.15, -62.63], [-28.35, -61.56], [-28.68, -59.89], [-6.68, -47.28], [-5.77, -48.93], [-5.21, -49.93]])
const LINK_N = ccw([[-34.63, -26.43], [-35.39, -25.12], [-36.01, -22.06], [-24.17, -15.63], [-22.68, -18.34], [-21.89, -19.77]])

const H_MEIER = 26.5, H_HILL = 13, H_WIE = 28.5, H_ANNE = 28.5, H_ANNE_N = 30, H_BUNZL = 20.5
const GLAZE = 4.5 // the Piano wings' glazed ground floor (over the piazza, 5 m up)
const PIAZZA = 5

// ── Meier: the main block, cut back over the atrium's fan ──
const AC: XY = [27.2, 39.0], AR = 19.5, AR0 = 3.5
// The fan is a full quarter circle (NAIP shows its radial rows over 90°),
// starting at the south end of OSM's curved wall and running on over the
// roof past the wall's north end.
const A0 = Math.atan2(26.19 - AC[1], 41.92 - AC[0]), A1 = A0 + Math.PI / 2
// The upper ring: the outline with its arc (the seven points on the
// fitted circle) replaced by a notch back to an inner arc of radius AR0.
const onArc = (q: XY) => Math.abs(Math.hypot(q[0] - AC[0], q[1] - AC[1]) - AR) < 0.6 && q[0] > 40 && q[0] < 47.5 && q[1] < 43
const UPPER: XY[] = []
{
  const n = MEIER.length
  const k0 = MEIER.findIndex((q, k) => onArc(q) && !onArc(MEIER[(k - 1 + n) % n]))
  const ring = MEIER.map((_, k) => MEIER[(k + k0) % n])
  const m = ring.findIndex((q) => !onArc(q)) // the run is ring[0 .. m-1]
  const first = ring[0], last = ring[m - 1]
  const af = Math.atan2(first[1] - AC[1], first[0] - AC[0]), al = Math.atan2(last[1] - AC[1], last[0] - AC[0])
  UPPER.push(first)
  for (let k = 0; k <= 8; k++) {
    const a = af + ((al - af) * k) / 8
    UPPER.push([AC[0] + AR0 * Math.cos(a), AC[1] + AR0 * Math.sin(a)])
  }
  UPPER.push(last, ...ring.slice(m))
}
// The whole block rises to the lidar's 26.5 m; the atrium's curved wall
// is its tallest edge (Merlin's photo), and the glass fan stands on the
// roof inside it, stepping down from the inner corner to the curve.
wall(enamel, split(MEIER, 5), 0, H_MEIER)
// Meier's roof is white like its walls (NAIP), so the blue fan reads on it.
capPoly(enamel, MEIER, H_MEIER, true)
cornice(enamel, MEIER, H_MEIER - 0.5, 0.5, 0.2, null)
void UPPER
const steps = [[AR0, 29.4], [9, 28.8], [14.5, 28.0], [AR, 27.2]] as [number, number][]
{
  // the white parapet round the curve and the fan's two radial side walls
  const n = 8
  for (let k = 0; k < n; k++) {
    const a0 = A0 + ((A1 - A0) * k) / n, a1 = A0 + ((A1 - A0) * (k + 1)) / n
    const P = (r: number, a: number, z: number): V3 => [AC[0] + r * Math.cos(a), AC[1] + r * Math.sin(a), z]
    // outward (away from AC) faces; A1 > A0 is counter-clockwise
    enamel.quad(P(AR + 0.05, a0, H_MEIER - 0.5), P(AR + 0.05, a1, H_MEIER - 0.5), P(AR + 0.05, a1, 27.7), P(AR + 0.05, a0, 27.7))
    enamel.quad(P(AR - 0.4, a1, H_MEIER), P(AR - 0.4, a0, H_MEIER), P(AR - 0.4, a0, 27.7), P(AR - 0.4, a1, 27.7))
    enamel.quad(P(AR - 0.4, a0, 27.7), P(AR + 0.05, a0, 27.7), P(AR + 0.05, a1, 27.7), P(AR - 0.4, a1, 27.7))
    // the inner riser at AR0, facing the inner corner
    enamel.quad(P(AR0, a1, H_MEIER), P(AR0, a0, H_MEIER), P(AR0, a0, steps[0][1]), P(AR0, a1, steps[0][1]))
  }
  for (const [a, sgn] of [[A0, -1], [A1, 1]] as [number, number][]) {
    const P = (r: number, z: number): V3 => [AC[0] + r * Math.cos(a), AC[1] + r * Math.sin(a), z]
    for (let j = 0; j < steps.length - 1; j++) {
      const [r0, z0] = steps[j], [r1, z1] = steps[j + 1]
      const q = [P(r0, H_MEIER), P(r1, H_MEIER), P(r1, z1), P(r0, z0)]
      // face away from the fan: tangential direction sgn
      if (sgn > 0) enamel.quad(q[0], q[1], q[2], q[3]); else enamel.quad(q[3], q[2], q[1], q[0])
    }
  }
}
const NF = 10
for (let k = 0; k < NF; k++) {
  const a0 = A0 + ((A1 - A0) * k) / NF, a1 = A0 + ((A1 - A0) * (k + 1)) / NF
  for (let j = 0; j < steps.length - 1; j++) {
    const [r0, z0] = steps[j], [r1, z1] = steps[j + 1]
    const P = (r: number, a: number, z: number): V3 => [AC[0] + r * Math.cos(a), AC[1] + r * Math.sin(a), z]
    // the sloping glass, and a short white riser at each step
    glass.quad(P(r0, a0, z0 - 0.6), P(r1, a0, z1), P(r1, a1, z1), P(r0, a1, z0 - 0.6))
    enamel.quad(P(r0, a0, z0 - 0.6), P(r0, a1, z0 - 0.6), P(r0, a1, z0), P(r0, a0, z0))
  }
  // a rib between bays
  const P = (r: number, z: number): V3 => [AC[0] + r * Math.cos(a0), AC[1] + r * Math.sin(a0), z]
  for (let j = 0; j < steps.length - 1; j++) {
    const [r0, z0] = steps[j], [r1, z1] = steps[j + 1]
    const t: V3 = [-Math.sin(a0) * 0.18, Math.cos(a0) * 0.18, 0]
    const q = (p: V3, s: number): V3 => [p[0] + t[0] * s, p[1] + t[1] * s, p[2]]
    enamel.quad(q(P(r0, z0 - 0.6), -1), q(P(r1, z1), -1), q(P(r1, z1 + 0.25), -1), q(P(r0, z0 - 0.35), -1))
    enamel.quad(q(P(r1, z1), 1), q(P(r0, z0 - 0.6), 1), q(P(r0, z0 - 0.35), 1), q(P(r1, z1 + 0.25), 1))
    enamel.quad(q(P(r0, z0 - 0.35), -1), q(P(r1, z1 + 0.25), -1), q(P(r1, z1 + 0.25), 1), q(P(r0, z0 - 0.35), 1))
  }
}
// Meier's windows, only where the real building is glazed (Merlin's
// photo): the atrium's curve carries one big glazed band over a ground-floor
// ribbon; the long walls only a ground-floor ribbon. The rest is white panel.
for (let i = 0; i < MEIER.length; i++) {
  const a = MEIER[i], b = MEIER[(i + 1) % MEIER.length]
  const arc = Math.abs(Math.hypot((a[0] + b[0]) / 2 - AC[0], (a[1] + b[1]) / 2 - AC[1]) - AR) < 1.2
  if (arc) {
    edgePanels(win, a, b, PIAZZA + 8.0, PIAZZA + 14.0, { group: 6, gap: 0, bay: 2.2, pier: 0.35, margin: 0.15, min: 1 })
    edgePanels(win, a, b, PIAZZA + 0.8, PIAZZA + 3.4, { group: 2.6, gap: 0, bay: 2.2, pier: 0.35, margin: 0.15, min: 1 })
  } else edgePanels(win, a, b, PIAZZA + 0.8, PIAZZA + 3.4, { group: 2.6, gap: 0, bay: 6, pier: 1.0, margin: 2.0, min: 8 })
}

// Hill Auditorium's block under the entrance, and the bridge.
prism(enamel, HILL, 0, H_HILL, enamel, 0.3)
prism(alu, BRIDGE, PIAZZA + 4, 22, roof, 0.2, true)
for (let i = 0; i < BRIDGE.length; i++) edgePanels(win, BRIDGE[i], BRIDGE[(i + 1) % BRIDGE.length], PIAZZA + 5, 21, { group: 12, gap: 0, bay: 6, pier: 0.8, margin: 0.4, min: 3 })

// ── Piano's wings ──
const piano = (P: XY[], h: number, scoops: boolean, top: Part) => {
  // glazed ground floor set back slightly, the aluminium box over it
  wall(alu, split(P, 5), 0, PIAZZA)
  wall(win, split(P, 5), PIAZZA, PIAZZA + GLAZE)
  prism(alu, P, GLAZE + PIAZZA, h, scoops ? roof : top, 0.25)
  if (!scoops) return
  // rows of light scoops on the roof, facing north
  const inside = (q: XY) => {
    let c = false
    for (let i = 0, j = P.length - 1; i < P.length; j = i++) {
      const [xi, yi] = P[i], [xj, yj] = P[j]
      if ((yi > q[1]) !== (yj > q[1]) && q[0] < ((xj - xi) * (q[1] - yi)) / (yj - yi) + xi) c = !c
    }
    return c
  }
  const ang = (-28.5 * Math.PI) / 180 // the wings' grid, turned from north
  const ux: XY = [Math.cos(ang), Math.sin(ang)], vy: XY = [-Math.sin(ang), Math.cos(ang)]
  const S = 3.6, W = 2.9, D = 2.6, HS = 1.5
  for (let i = -30; i <= 30; i++) for (let j = -40; j <= 40; j++) {
    const c: XY = [ux[0] * i * S + vy[0] * j * S, ux[1] * i * S + vy[1] * j * S]
    const corners = [[-W / 2 - 0.6, -D / 2 - 0.6], [W / 2 + 0.6, -D / 2 - 0.6], [W / 2 + 0.6, D / 2 + 0.6], [-W / 2 - 0.6, D / 2 + 0.6]]
    if (!corners.every(([a, b]) => inside([c[0] + ux[0] * a + vy[0] * b, c[1] + ux[1] * a + vy[1] * b]))) continue
    const P3 = (a: number, b: number, z: number): V3 => [c[0] + ux[0] * a + vy[0] * b, c[1] + ux[1] * a + vy[1] * b, h + z]
    // the hood: a curve from the south foot up and over to the north face
    const prof: [number, number][] = [[-D / 2, 0], [-D / 6, HS * 0.72], [D / 2, HS]]
    for (let k = 0; k < prof.length - 1; k++) {
      const [b0, z0] = prof[k], [b1, z1] = prof[k + 1]
      alu.quad(P3(-W / 2, b0, z0), P3(W / 2, b0, z0), P3(W / 2, b1, z1), P3(-W / 2, b1, z1))
    }
    // the glazed north face
    glass.quad(P3(W / 2, D / 2, 0), P3(-W / 2, D / 2, 0), P3(-W / 2, D / 2, HS), P3(W / 2, D / 2, HS))
    // the sides
    for (const sa of [-1, 1]) {
      const pts = [...prof.map(([b, z]) => P3((sa * W) / 2, b, z)), P3((sa * W) / 2, D / 2, 0)]
      for (let k = 1; k < pts.length - 1; k++) {
        if (sa > 0) alu.tri(pts[0], pts[k + 1], pts[k])
        else alu.tri(pts[0], pts[k], pts[k + 1])
      }
    }
  }
}
piano(WIELAND, H_WIE, true, roof)
piano(ANNE, H_ANNE, true, roof)
piano(ANNE_N, H_ANNE_N, false, roof)
piano(BUNZL, H_BUNZL, false, green)
// the links between the wings: glazed, one storey over the piazza
for (const L of [LINK_S, LINK_N]) prism(win, L, 0, PIAZZA + 4.5, roof, 0.1)
void cornice

await save('atl-high-museum', 'High Museum of Art', [
  { part: enamel, material: finish('meier-enamel', 0xfbfbf8) },
  { part: alu, material: finish('piano-aluminium', 0xe2e5e6) },
  { part: win, material: PALETTE.window },
  { part: glass, material: PALETTE.glass },
  { part: roof, material: PALETTE.roof },
  { part: green, material: finish('high-green-roof', 0x93a57c) },
], { height: H_ANNE_N, anchor: [33.789731, -84.385959], bearing: 0 }, 6500)
