/**
 * Fairmont Royal York (Royal York Hotel), Toronto (1929, Ross & Macdonald
 * with Sproatt & Rolph; east addition 1959) — original procedural
 * geometry, CC0-1.0.
 * bun generators/tor-fairmont-royal-york.ts
 *
 * Frame: x along Front Street (east-north-east +), y away from it
 * (north-north-west +), z up, metres; origin at the anchor on the ground.
 * Bearing 343.3 (the Toronto street grid; the OSM outlines run true in
 * it). Anchor = area centroid of the podium, OSM way/177879879:
 * -79.3815237, 43.6459096.
 *
 * Identity (from the photos):
 *  1. A pale grey-buff limestone slab block on a full-block podium, its
 *     plan a double comb: three wings reach forward to Front Street and
 *     four back to Wellington Street off a long east-west spine.
 *                                                     (sw, shankar, vagen)
 *  2. The stepped central tower over the west half, rising out of the
 *     spine, with an arcaded top stage of round-headed windows.      (sw)
 *  3. The steep green copper hip roof on it, with dormers and a stone
 *     chimney-lantern at the top, the Châteauesque crown.     (sw, vagen)
 *  4. The podium's Front Street face: a row of tall round-headed windows
 *     (the ballroom/lobby arcade) between the forward wings.  (sw, shankar)
 *
 * Heights (no lidar in Canada):
 *  - City of Toronto 3D Massing 2025 (https://open.toronto.ca/dataset/3d-massing/),
 *    tier heights above ground: wings and spine 61.3-63.4 (63 used), the
 *    tower 84.7 (85 used), the top stage 95.4 (95 used), podium 23.8
 *    (25 used, OSM way/177879879 height 25).
 *  - OSM parts: tower way/290194023 (to 87), top stage way/290194022
 *    (87-94), copper hip roof way/231977103 (94-109), the chimney-lantern
 *    way/231977104 (106-114). The roof's 15 m rise and the lantern's top
 *    (116) from OSM, checked against the sw photo (the roof as tall as
 *    the top stage plus half again; the lantern a storey and a half over
 *    the ridge). Published height 124 m (Wikipedia, to the top of the
 *    lantern from the lowest street); 28 storeys.
 *  - plan: OSM outlines way/31728160 (the comb tower, 25-67), way/177879879
 *    (podium), and the parts above, turned into this frame.
 *  - estimated from sw and shankar: the arcade of nine round-headed
 *    windows on the podium front (10-21 m), the top stage's arcade, the
 *    dormer count (three per long face, one per end).
 *  - ground: Mapterhorn z15 falls 1.1 m from Wellington to Front Street;
 *    y 0 is at Front Street, elevation 0.
 *
 * Colours: grey-buff Indiana limestone (sw, shankar) pulled to the
 * palette's lightness; green copper roof (sw, vagen; OSM roof:colour
 * #238E68, muted to the palette's patina).
 *
 * Night: the crown is floodlit and its sign lit (a `_FLOODLIGHT` wash on
 * the top stage, the roof and the lantern; the podium faintly). The sign's
 * lettering is left out (a hotel sign, not the landmark's identity).
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  sw      "Fairmont Royal York, Toronto, Southwest view 20170417 1.jpg", DXR,
 *          CC BY-SA 4.0 — from York and Front (south-west).
 *          https://commons.wikimedia.org/wiki/File:Fairmont_Royal_York,_Toronto,_Southwest_view_20170417_1.jpg
 *  shankar "Fairmont Royal York Hotel, Toronto (27823283571).jpg", shankar s.,
 *          CC BY 2.0 — the York Street corner and the Front Street podium.
 *          https://commons.wikimedia.org/wiki/File:Fairmont_Royal_York_Hotel,_Toronto_(27823283571).jpg
 *  vagen   "Union Station Toronto August 2017 01.jpg", Arild Vågen, CC BY-SA 4.0 —
 *          oblique aerial from the CN Tower: the comb plan and the crown.
 *          https://commons.wikimedia.org/wiki/File:Union_Station_Toronto_August_2017_01.jpg
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the north (Wellington Street) side and the 1959 east wing's
 * details are seen only from the air; the wings are drawn at one height
 * (the massing has them 61-65 m).
 */
import { Part, cross, sub, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { box, cornice, edgePanels, panels, prism, save, type XY } from './atl-flatiron-building'
import { archShape, hipRoof, onWall } from './atl-tech-tower'

const stone = new Part(), trim = new Part(), roof = new Part(), cu = new Part(), win = new Part()

const POD = 25, WING = 63, TOWER = 85, STAGE = 95, RIDGE = 110, LANTERN = 116

// Podium, OSM way/177879879 (simplified).
const podium: XY[] = [[-74.4, -30.3], [73.8, -31.0], [74.8, -19.0], [74.9, 17.0], [74.0, 17.1], [74.1, 28.9], [-74.1, 30.6]]
prism(stone, podium, 0, POD, roof, 0.4)
cornice(trim, podium, POD - 1.2, 1.2, 0.6, null)

// The comb: OSM way/31728160, counter-clockwise.
const comb: XY[] = [[-71.9, 30.6], [-72.2, -30.1], [-54.4, -30.2], [-54.3, -15.2], [11.9, -15.8], [11.9, -30.8], [29.4, -30.9], [29.4, -15.7],
  [56.2, -16.0], [56.1, -30.9], [73.8, -31.0], [74.9, 17.0], [74.1, 28.9], [57.0, 29.1], [56.9, 7.2], [29.9, 7.5], [30.0, 29.4], [12.4, 29.6],
  [12.3, 7.2], [-10.4, 7.4], [-10.3, 29.9], [-28.1, 30.1], [-28.2, 7.5], [-54.3, 7.7], [-54.2, 30.4]]
prism(stone, comb, POD - 0.5, WING, roof, 0.4)
cornice(trim, comb, WING - 1.4, 1.4, 0.55, null)
const tower = { group: 9.5, gap: 2.2, bay: 4.4, pier: 2.3, margin: 2.0, min: 5 }
panels(win, comb, POD + 1.5, WING - 2.4, tower)

// The tower over the west half of the spine, and its arcaded top stage.
const upper: XY[] = [[-54.3, -15.6], [12.0, -15.8], [12.2, 7.6], [-54.3, 7.7]]
prism(stone, upper, WING - 0.5, TOWER, roof, 0.4)
cornice(trim, upper, TOWER - 1.4, 1.4, 0.6, null)
panels(win, upper, WING + 1.0, TOWER - 2.4, { ...tower, group: 6.7, gap: 1.8 })
const stage: XY[] = [[-31.7, -13.0], [-1.2, -13.1], [-1.2, 4.6], [-31.7, 4.6]]
prism(stone, stage, TOWER - 0.5, STAGE, roof, 0.3)
cornice(trim, stage, STAGE - 1.2, 1.2, 0.5, null)
for (let i = 0; i < 4; i++) {
  const a = stage[i], b = stage[(i + 1) % 4], L = Math.hypot(b[0] - a[0], b[1] - a[1])
  const n = Math.max(3, Math.round(L / 3.8)), w = 2.4, step = (L - 3) / n
  for (let k = 0; k < n; k++) onWall(win, a, b, archShape(1.5 + step * (k + 0.5), w, TOWER + 1.2, TOWER + 6.2, 8), 0.06)
}

// The steep copper hip roof, its dormers and the chimney-lantern.
hipRoof(cu, -29.8, -2.5, -11.2, 2.7, STAGE, RIDGE, 0.3)
const slope = (RIDGE - STAGE) / ((2.7 + 11.2) / 2)
function dormer(c: XY, facing: 'n' | 's' | 'e' | 'w', z0: number) {
  // A gabled box standing out of the roof slope, its window on the front.
  const w = 2.2, d = 3.2, h = 2.6
  const [cx, cy] = c
  const ring: XY[] = facing === 's' || facing === 'n' ? [[cx - w / 2, cy - d / 2], [cx + w / 2, cy - d / 2], [cx + w / 2, cy + d / 2], [cx - w / 2, cy + d / 2]]
    : [[cx - d / 2, cy - w / 2], [cx + d / 2, cy - w / 2], [cx + d / 2, cy + w / 2], [cx - d / 2, cy + w / 2]]
  prism(cu, ring, z0 - 2.5, z0 + h, null, 0)
  const r = ring
  const z1 = z0 + h + 1.2, zl = z0 + h
  if (facing === 's' || facing === 'n') {
    // ridge along y, slopes to -x and +x, gable ends at both y ends
    const xm = cx, ya = r[0][1], yb = r[2][1], xa = r[0][0], xb = r[1][0]
    tri(cu, [xa, ya, zl], [xm, ya, z1], [xm, yb, z1], [-1, 0, 1]); tri(cu, [xa, ya, zl], [xm, yb, z1], [xa, yb, zl], [-1, 0, 1])
    tri(cu, [xb, ya, zl], [xm, ya, z1], [xm, yb, z1], [1, 0, 1]); tri(cu, [xb, ya, zl], [xm, yb, z1], [xb, yb, zl], [1, 0, 1])
    tri(cu, [xa, ya, zl], [xb, ya, zl], [xm, ya, z1], [0, -1, 0]); tri(cu, [xa, yb, zl], [xb, yb, zl], [xm, yb, z1], [0, 1, 0])
  } else {
    const ym = cy, xa = r[0][0], xb = r[1][0], ya = r[0][1], yb = r[2][1]
    tri(cu, [xa, ya, zl], [xa, ym, z1], [xb, ym, z1], [0, -1, 1]); tri(cu, [xa, ya, zl], [xb, ym, z1], [xb, ya, zl], [0, -1, 1])
    tri(cu, [xa, yb, zl], [xa, ym, z1], [xb, ym, z1], [0, 1, 1]); tri(cu, [xa, yb, zl], [xb, ym, z1], [xb, yb, zl], [0, 1, 1])
    tri(cu, [xa, ya, zl], [xa, yb, zl], [xa, ym, z1], [-1, 0, 0]); tri(cu, [xb, ya, zl], [xb, yb, zl], [xb, ym, z1], [1, 0, 0])
  }
  const front: Record<string, [XY, XY]> = { s: [r[0], r[1]], n: [r[2], r[3]], e: [r[1], r[2]], w: [r[3], r[0]] }
  const [a, b] = front[facing]
  edgePanels(win, a, b, z0 + 0.3, z0 + h - 0.3, { group: 9, gap: 0, bay: 9, pier: 0, margin: 0.45, min: 1 })
}
/** A triangle wound to face `want`. */
function tri(p: Part, a: V3, b: V3, c: V3, want: V3) {
  const n = cross(sub(b, a), sub(c, a))
  if (n[0] * want[0] + n[1] * want[1] + n[2] * want[2] >= 0) p.tri(a, b, c)
  else p.tri(a, c, b)
}
const zAt = (inset: number) => STAGE + slope * inset // roof height at a distance in from the eave
for (const x of [-24.0, -16.15, -8.3]) {
  dormer([x, -11.2 + 2.6], 's', zAt(2.6) - 0.6)
  dormer([x, 2.7 - 2.6], 'n', zAt(2.6) - 0.6)
}
dormer([-29.8 + 2.6, -4.25], 'w', zAt(2.6) - 0.6)
dormer([-2.5 - 2.6, -4.25], 'e', zAt(2.6) - 0.6)
box(stone, -18.4, -15.2, -6.6, -2.5, RIDGE - 3, LANTERN - 1.2, stone, 0.2)
box(trim, -18.8, -14.8, -7.0, -2.1, LANTERN - 1.2, LANTERN - 0.5, null, 0.1)
hipRoof(cu, -18.6, -15.0, -6.8, -2.3, LANTERN - 0.5, LANTERN + 0.8, 0)

// Podium: the arcade on Front Street between the west and middle wings,
// shop and lobby windows below, the York Street and Wellington faces.
const PF: [XY, XY] = [[11.9, -30.75], [-54.4, -30.2]] // Front St face, east to west
const LF = Math.hypot(PF[1][0] - PF[0][0], PF[1][1] - PF[0][1])
for (let k = 0; k < 9; k++) onWall(win, PF[0], PF[1], archShape(6 + ((LF - 12) * (k + 0.5)) / 9, 4.2, 10.5, 18.5, 8), 0.06)
edgePanels(win, PF[0], PF[1], 1.5, 7.5, { group: 9, gap: 0, bay: 5.5, pier: 1.8, margin: 3 })
for (let i = 0; i < podium.length; i++) {
  const a = podium[i], b = podium[(i + 1) % podium.length]
  edgePanels(win, a, b, 1.5, 7.5, { group: 9, gap: 0, bay: 5.5, pier: 1.8, margin: 3, min: 6 })
  if (i !== 0) edgePanels(win, a, b, 10.5, POD - 2.5, { group: 12, gap: 0, bay: 4.2, pier: 1.6, margin: 2.5, min: 6 })
}
// The Front Street face outside the arcade: upper podium windows on the wing fronts.
for (const [a, b] of [[[-54.4, -30.2], [-74.4, -30.3]], [[29.4, -30.9], [11.9, -30.75]], [[73.8, -31.0], [29.4, -30.9]]] as [XY, XY][]) {
  edgePanels(win, a, b, 10.5, POD - 2.5, { group: 12, gap: 0, bay: 4.2, pier: 1.6, margin: 2.5, min: 6 })
}

// Night: the crown is floodlit, the tower faintly, the podium a little.
const lit = (p: V3, n: V3) => (p[2] > WING + 2 ? (n[2] > 0.8 ? 0.3 : 0.85) : p[2] < POD ? 0.25 : 0.1)
await save('tor-fairmont-royal-york', 'Fairmont Royal York', [
  { part: stone, material: { ...finish('royal-york-limestone', 0xe3dccd), floodlight: lit } },
  { part: trim, material: { ...PALETTE.trim, floodlight: lit } },
  { part: roof, material: PALETTE.roof },
  { part: cu, material: { ...PALETTE.patina, floodlight: (p: V3) => (p[2] > STAGE ? 0.6 : 0) } },
  { part: win, material: PALETTE.window },
], { anchor: [43.6459096, -79.3815237], bearing: 343.3 }, 6500)
