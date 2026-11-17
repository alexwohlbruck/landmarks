/**
 * Millennium Gate, Atlantic Station, Atlanta (2008, Hugh Petter and Rodney
 * Cook Jr. of ADAM Architecture; CollinsCooperCarusi, architects of
 * record) — original procedural geometry, CC0-1.0.
 * bun generators/atl-millennium-gate.ts
 *
 * Uses the B9 kit exported from generators/atl-tech-tower.ts.
 *
 * Map frame: x east, y north, z up, metres, built turned to bearing 62.4°:
 * model +y runs along the passage (the outline's 11.7 m sides), model +x
 * across the 15.4 m faces. Anchor = centroid of OSM way/269640189
 * ("The Millennium Gate Museum", building=triumphal_arch, height 26),
 * 33.791127, -84.399725. Its building:parts way/1564296738 and
 * way/1564296739 (23 m, the faces) and way/1564296740 (26 m, the middle)
 * lie inside it.
 *
 * Identity: a Roman triumphal arch of pale Indiana limestone, one tall
 * round-arched bay. Plain piers with an impost band at the springing, a
 * moulded archivolt with a keystone, an entablature with the Latin
 * inscription in its frieze and a strongly projecting cornice, then a tall
 * attic with a carved panel, and on top a dark set-back roof block. Low
 * pedestals carrying bronze lanterns stand against the piers either side of
 * the opening on both faces. The arch stands on a raised terrace. Floodlit
 * at night.
 *
 * Evidence:
 *  - plan: OSM way/269640189, a 15.4 × 11.7 m rectangle; the lidar roof
 *    agrees within half a metre.
 *  - heights: USGS 3DEP lidar GA_Statewide_B2_2018 (2018 flight), 0.5 m
 *    grid. Above the terrace (lidar 4.7 m over ground_min 272.47 m): the
 *    cornice's edge 16.7, the attic top 20.5, the dark roof block 23.3 m
 *    over a 9 × 8 m middle (OSM's 26 m part); the photos show a thin dark
 *    band over the attic and NAIP a ribbed dark gabled roof (OSM: gabled,
 *    roof height 1.5 m), so it is drawn as a low dark wall (0.7 m) under
 *    a 0.8 m gabled glass roof, set back 2.45 m from the arched faces and 2.7 m from
 *    the ends, so the attic and cornice make the skyline as in the photos.
 *    The lidar's 23.3 m top over the middle is likely the rail or ridge.
 *    Published 82 ft (25 m) over
 *    the street (Wikipedia); the model reaches 23.8 m over its base.
 *  - terrace: the lidar and Mapterhorn both show the middle of the site
 *    about 1.3 m above the street at its ends, so the arch stands on a
 *    1.3 m plinth (the photos' balustraded terrace, simplified to a plain
 *    plinth). The terrain is not evidence for its height; the photos are.
 *  - the opening, the springing, the bands and the attic: from a
 *    same-scale overlay on Drako World's frontal photo (the face 15.4 m
 *    wide; SCRATCH/work/atl-millennium-gate/sbs-after.png): the opening
 *    5.6 m wide, springing 9.9 m and the crown 12.7 m above the terrace,
 *    the entablature from 14.3 m, the attic top 21.0 m.
 *  - ground: Mapterhorn 2.0–3.5 m across the site; y = 0 is the low
 *    street at the arch's ends; elevation 0.
 *  - colours: the limestone (pale warm grey), the dark roof block and the
 *    bronze lanterns, from the daylight photos.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Millennium Gate, Atlanta, USA.jpg, Drako World, CC BY 2.0 (a face,
 *    head on) https://commons.wikimedia.org/wiki/File:Millennium_Gate,_Atlanta,_USA.jpg
 *  - Millennium Gate, Atlantic Station.jpg, Jeff Clemmons, CC BY 3.0
 *    https://commons.wikimedia.org/wiki/File:Millennium_Gate,_Atlantic_Station.jpg
 *  - Millennium Gate ATL.jpg, Hillary, CC BY-SA 2.0
 *    https://commons.wikimedia.org/wiki/File:Millennium_Gate_ATL.jpg
 *  - Front of Millennium Gate.jpg, Tabby146, CC BY-SA 3.0
 *    https://commons.wikimedia.org/wiki/File:Front_of_Millennium_Gate.jpg
 *  - Millennium Gate Atlanta.jpg, Chris Yunker, CC BY-SA 2.0 (from down the
 *    street) https://commons.wikimedia.org/wiki/File:Millennium_Gate_Atlanta.jpg
 *  - CobbLinc bus 1800 2025-01-09.jpg, ElToAn123, CC BY-SA 4.0 (oblique)
 *    https://commons.wikimedia.org/wiki/File:CobbLinc_bus_1800_2025-01-09.jpg
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the roof structure is seen only as a dark band from the street
 * and from above in NAIP; no licensed photo shows a sculpture group on it.
 * The end faces are drawn plain (no photo shows them square on). The terrace balustrade, the inscription's letters, the coffers in
 * the vault and the museum's doors inside the passage are left out.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { box, ccw, gableRoof, cornice, onWall, rectShape, save, wall, split, type XY } from './atl-tech-tower'

const stone = new Part(), trim = new Part(), dark = new Part(), glass = new Part()

const HW = 7.7, HD = 5.85 // half width (across the faces) and half depth
const T = 1.3 // the terrace
const OW = 2.8 // half the opening
const SPRING = T + 9.9, CROWN = SPRING + OW
const ENT = T + 14.3, COR = T + 16.0, COR_TOP = T + 16.9, ATTIC = T + 21.0, TOP = T + 23.3
const SEG = 12

// ── The terrace plinth, under the whole outline ──
const plan = ccw([[-HW, -HD], [HW, -HD], [HW, HD], [-HW, HD]] as XY[])
wall(stone, split(plan, 4), 0, T)

// ── Piers ──
for (const s of [-1, 1]) {
  const x0 = s < 0 ? -HW : OW, x1 = s < 0 ? -OW : HW
  box(stone, x0, x1, -HD, HD, T, COR, null, 0)
}
// The passage floor at terrace level.
stone.quad([-OW, -HD, T], [OW, -HD, T], [OW, HD, T], [-OW, HD, T])

// ── The spandrels over the opening, with the semicircle cut out ──
// Rays from the arch centre meet the rectangle; the corners are included.
const cornerA = Math.atan2(COR - SPRING, OW)
const angles = [...Array.from({ length: SEG + 1 }, (_, i) => (i / SEG) * Math.PI), cornerA, Math.PI - cornerA].sort((a, b) => a - b)
const onRect = (a: number): [number, number] => {
  const c = Math.cos(a), s = Math.sin(a)
  const r = Math.min(Math.abs(c) > 1e-6 ? OW / Math.abs(c) : 1e9, (COR - SPRING) / s || 1e9)
  return [r * c, SPRING + r * s]
}
for (const y of [-HD, HD]) {
  const face = y < 0 ? -1 : 1
  for (let i = 0; i < angles.length - 1; i++) {
    const a0 = angles[i], a1 = angles[i + 1]
    const c0: V3 = [OW * Math.cos(a0), y, SPRING + OW * Math.sin(a0)], c1: V3 = [OW * Math.cos(a1), y, SPRING + OW * Math.sin(a1)]
    const r0 = onRect(a0), r1 = onRect(a1)
    const R0: V3 = [r0[0], y, r0[1]], R1: V3 = [r1[0], y, r1[1]]
    // wind to face out of the face (−y on the south-west face)
    if (face < 0) { stone.tri(c0, R0, R1); stone.tri(c0, R1, c1) } else { stone.tri(c0, R1, R0); stone.tri(c0, c1, R1) }
  }
}
// The vault: a half cylinder through the depth, facing the passage.
for (let i = 0; i < SEG; i++) {
  const a0 = (i / SEG) * Math.PI, a1 = ((i + 1) / SEG) * Math.PI
  const p = (a: number, y: number): V3 => [OW * Math.cos(a), y, SPRING + OW * Math.sin(a)]
  const n = (a: number): V3 => [-Math.cos(a), 0, -Math.sin(a)]
  stone.tri(p(a0, -HD), p(a1, -HD), p(a1, HD), undefined, undefined, undefined, [n(a0), n(a1), n(a1)])
  stone.tri(p(a0, -HD), p(a1, HD), p(a0, HD), undefined, undefined, undefined, [n(a0), n(a1), n(a0)])
}
// The spandrel block's underside is the vault; its top is under the entablature.

// ── Archivolt, keystone and impost bands, on both faces ──
for (const y of [-HD, HD]) {
  const a: XY = y < 0 ? [-HW, y] : [HW, y], b: XY = y < 0 ? [HW, y] : [-HW, y]
  const S = (x: number) => (y < 0 ? x + HW : HW - x) // x → distance along a→b
  // the archivolt: a band 0.65 m wide round the opening, in pieces
  for (let i = 0; i < SEG; i++) {
    const a0 = (i / SEG) * Math.PI, a1 = ((i + 1) / SEG) * Math.PI
    const r0 = OW, r1 = OW + 0.65
    onWall(trim, a, b, [
      [S(r0 * Math.cos(a0)), SPRING + r0 * Math.sin(a0)], [S(r1 * Math.cos(a0)), SPRING + r1 * Math.sin(a0)],
      [S(r1 * Math.cos(a1)), SPRING + r1 * Math.sin(a1)], [S(r0 * Math.cos(a1)), SPRING + r0 * Math.sin(a1)],
    ], 0.12)
  }
  // the keystone
  onWall(trim, a, b, [[S(-0.45), CROWN - 0.1], [S(0.45), CROWN - 0.1], [S(0.6), CROWN + 1.2], [S(-0.6), CROWN + 1.2]], 0.2)
  // impost bands at the springing, across each pier face
  onWall(trim, a, b, rectShape(S(y < 0 ? -HW : OW), S(y < 0 ? -OW : HW), SPRING - 0.55, SPRING), 0.1)
  onWall(trim, a, b, rectShape(S(y < 0 ? OW : -HW), S(y < 0 ? HW : -OW), SPRING - 0.55, SPRING), 0.1)
  // the attic's carved panel
  onWall(trim, a, b, rectShape(HW - 3.4, HW + 3.4, COR_TOP + 1.1, ATTIC - 1.0), 0.1)
}
// Impost bands on the piers' inner faces, and on the ends.
for (const s of [-1, 1]) {
  const x = s * OW
  const a: XY = s < 0 ? [x, -HD] : [x, HD], b: XY = s < 0 ? [x, HD] : [x, -HD]
  onWall(trim, a, b, rectShape(0, 2 * HD, SPRING - 0.55, SPRING), 0.1)
}

// ── Entablature, cornice and attic ──
// The architrave and frieze (with the inscription) as a band standing a
// little proud, the big cornice, then the attic and its own small cornice.
box(stone, -HW, HW, -HD, HD, COR, ATTIC - 0.4, null, 0)
cornice(trim, plan, ENT, COR - ENT, 0.12, null)
cornice(trim, plan, COR, COR_TOP - COR, 0.75, trim)
cornice(trim, plan, ATTIC - 0.45, 0.45, 0.3, trim)
// the piers' base course, round the outside and into the passage
for (const s of [-1, 1]) {
  const x0 = s < 0 ? -HW : OW, x1 = s < 0 ? -OW : HW
  cornice(trim, ccw([[x0, -HD], [x1, -HD], [x1, HD], [x0, HD]] as XY[]), T, 1.8, 0.15, trim)
}
// the plinth's top moulding
cornice(trim, plan, T - 0.35, 0.35, 0.2, null)
// The dark roof block, set back over the middle (lidar 9 × 8 m).
box(dark, -5.0, 5.0, -3.4, 3.4, ATTIC, ATTIC + 0.7, null, 0)
// and its low gabled glass roof (NAIP shows it ribbed and dark; OSM roof:shape gabled, 1.5 m)
gableRoof(glass, dark, -5.0, 5.0, -3.4, 3.4, ATTIC + 0.7, ATTIC + 1.5, 'x', 0.1, 0.1)

// ── Pedestals with bronze lanterns, against the piers by the opening ──
for (const sy of [-1, 1]) for (const sx of [-1, 1]) {
  const x0 = sx < 0 ? -OW - 2.2 : OW + 0.2, x1 = x0 + 2.0
  const y0 = sy < 0 ? -HD - 1.3 : HD, y1 = sy < 0 ? -HD : HD + 1.3
  box(trim, x0, x1, y0, y1, 0, T + 2.6, trim, 0.15)
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2
  box(dark, cx - 0.35, cx + 0.35, cy - 0.35, cy + 0.35, T + 2.6, T + 4.0, dark, 0.12)
}

// Night: the stone is floodlit from the ground, the roof block is dark.
const flood = (p: V3, n: V3) => (n[2] > 0.7 ? 0.2 : Math.max(0.45, 1 - p[2] / 40))
await save('atl-millennium-gate', 'Millennium Gate', [
  { part: stone, material: { ...finish('gate-limestone', 0xddd4c3), floodlight: flood } },
  { part: trim, material: { ...finish('gate-limestone-trim', 0xebe3d4), floodlight: flood } },
  { part: dark, material: finish('gate-bronze', 0x5d5f63) },
  { part: glass, material: { ...PALETTE.glass, color: 0x7d8d99 } },
], { height: ATTIC + 1.5, anchor: [33.791127, -84.399725], bearing: 62.4 })
void rectShape
