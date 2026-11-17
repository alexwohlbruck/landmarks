/**
 * Clock Tower, V&A Waterfront, Cape Town (1882) — procedural, CC0-1.0.
 * bun generators/cpt-clock-tower-va.ts
 *
 * Map frame: x east, y north, z up, metres; origin on the quay at the
 * centre of the octagon. Built with a flat face to each axis and placed at
 * bearing 17.7°, so the faces turn to OSM's octagon.
 *
 * The 1882 Gothic Revival port captain's office on the Alfred Basin quay:
 * a small red octagonal tower in three storeys, pale grey dressings (corner
 * quoins on the ground storey, string courses, pointed-arch hoods over the
 * lancet windows, a dentil cornice), an open cast-iron balcony on a thin slab
 * and brackets right round the second storey, a grey zinc octagonal roof, and on top a square
 * timber clock turret with a dial on each face, a cross-gabled brown roof,
 * finials and a weathervane.
 *
 * Identity, in order: the red octagon with its grey trim, the open balcony
 * on its thin slab, the steep grey roof, the tall clock turret with its four dials and
 * gabled cap. All five read at 200 px; at 80 px the red body, balcony line,
 * grey roof and dark cap remain.
 *
 * Evidence
 *  - OSM way/158441581 (building=yes, historic=monument, name Clock Tower,
 *    wikidata Q55634395): a regular octagon, circumradius 4.83 m (apothem
 *    4.46 m, side 3.7 m). Anchor = its centroid; bearing 17.7° = a face
 *    normal. Replaces that way only. The swing bridge (Clocktower Bridge)
 *    beside it and the unnamed way/1349582829 next door are not modelled.
 *  - Heights estimated from Rabich's level daylight view (2902, below),
 *    scaled to OSM's 9.6 m octagon (about 47 px a metre): ground storey to
 *    3.4 m, balcony floor 8.5 m, cornice top 13.3 m. That photo puts the
 *    turret ridge at about 20.4 m and the vane at 22.4 m, but it looks up
 *    at the roof and foreshortens it; Gagnon's and the other views show a
 *    steep roof rising about as much as the upper storey is tall (3.6 m,
 *    to 16.9 m) and a tall turret, so the model takes: roof to the turret
 *    16.9 m, clock stage 17.7–19.6 m (dials 1.7 m across), turret ridge
 *    21.9 m, weathervane 23.5 m. Treat the top 1–1.5 m as uncertain. No
 *    published height was found; OSM has no height tag.
 *  - Balcony projection (~1.25 m), window sizes, quoin widths: estimated
 *    from the same photos.
 *  - Colours from daylight photos: signal red walls (pulled a little toward
 *    the palette, after chicago-theatre-red), pale grey dressings, grey zinc
 *    roof, near-black cast iron and dark stained timber on the turret.
 *  - No terrain: Mapterhorn has no z15 tiles here (tools/terrain.ts 404s).
 *    The quay is flat; elevation 0. No lidar or NAIP in South Africa.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Cape Town (ZA), Waterfront, Clock Tower -- 2024 -- 2902.jpg, Dietmar
 *    Rabich, CC BY-SA 4.0,
 *    https://commons.wikimedia.org/wiki/File:Cape_Town_(ZA),_Waterfront,_Clock_Tower_--_2024_--_2902.jpg
 *  - Cape Town (ZA), Waterfront, Clock Tower -- 2024 -- 3036.jpg, Dietmar
 *    Rabich, CC BY-SA 4.0,
 *    https://commons.wikimedia.org/wiki/File:Cape_Town_(ZA),_Waterfront,_Clock_Tower_--_2024_--_3036.jpg
 *  - Victoria & Alfred Waterfront clock tower.jpg, Bernard Gagnon,
 *    CC BY-SA 4.0,
 *    https://commons.wikimedia.org/wiki/File:Victoria_%26_Alfred_Waterfront_clock_tower.jpg
 *  - Clock Tower V&A - Cape Town, South Africa (4029342324).jpg, South
 *    African Tourism, CC BY 2.0,
 *    https://commons.wikimedia.org/wiki/File:Clock_Tower_V%26A_-_Cape_Town,_South_Africa_(4029342324).jpg
 *  - V&A Waterfront Clock Tower - 2.jpg, De Zuid-Afrikaan, CC BY-SA 3.0,
 *    https://commons.wikimedia.org/wiki/File:V%26A_Waterfront_Clock_Tower_-_2.jpg
 * Look-only references: none. No commercial imagery.
 *
 * Doubts: the photos show the quay (north-east) and west sides; the other
 * faces are assumed alike. Which faces carry doors and which portholes is
 * simplified to cardinal faces doors, diagonal faces portholes. The real
 * octagon's faces are not all quite equal in the photos; OSM's regular
 * octagon is used. Night: the tower is assumed floodlit (walls lightly lit,
 * windows glowing); no night photo was checked.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cap, inset, save, walls, type XY } from './chi-aon-center'
import { along, face, rectOn } from './phl-independence-hall'
import { band, ngonF, prism, segs } from './amsterdam-munttoren'

const AP = 4.46 // octagon apothem (OSM)

/** A pointed (equilateral) arch panel on wall a→b: rectangle to zs, then a lancet. */
function lancetOn(p: Part, a: XY, b: XY, c: number, hw: number, z0: number, zs: number, out = 0.05, seg = 5) {
  const { P, n } = along(a, b)
  const N: V3 = [n[0], n[1], 0]
  if (zs > z0) face(p, [P(c - hw, z0, out), P(c + hw, z0, out), P(c + hw, zs, out), P(c - hw, zs, out)], N)
  // Left arc centred on the right springing point, radius 2hw, and mirrored.
  const pts: V3[] = []
  const R = 2 * hw, top = Math.PI / 3
  for (let k = 0; k <= seg; k++) { const t = Math.PI - (k / seg) * (Math.PI - (Math.PI - top)); pts.push(P(c + hw + R * Math.cos(t), zs + R * Math.sin(t), out)) }
  for (let k = seg - 1; k >= 0; k--) { const t = Math.PI - (k / seg) * (Math.PI - (Math.PI - top)); pts.push(P(c - hw - R * Math.cos(t), zs + R * Math.sin(t), out)) }
  const base = P(c, zs, out)
  for (let i = 0; i < pts.length - 1; i++) face(p, [base, pts[i], pts[i + 1]], N)
}

/** A flat disc on wall a→b. */
function discOn(p: Part, a: XY, b: XY, c: number, z: number, r: number, out: number, seg = 12) {
  const { P, n } = along(a, b)
  const N: V3 = [n[0], n[1], 0]
  for (let k = 0; k < seg; k++) {
    const t0 = (k / seg) * 2 * Math.PI, t1 = ((k + 1) / seg) * 2 * Math.PI
    face(p, [P(c, z, out), P(c + r * Math.cos(t0), z + r * Math.sin(t0), out), P(c + r * Math.cos(t1), z + r * Math.sin(t1), out)], N)
  }
}

function build() {
  const red = new Part(), grey = new Part(), zinc = new Part(), win = new Part(), iron = new Part()
  const oct = ngonF(0, 0, AP, 8)
  const sides = segs(oct)
  const L = Math.hypot(oct[1][0] - oct[0][0], oct[1][1] - oct[0][1]) // 3.69 m

  // --- Body ---------------------------------------------------------------
  // Red walls from the ground to the cornice, one prism; the grey dressings
  // are bands and panels laid on it.
  prism(red, oct, 0, 12.5, false)
  band(grey, oct, 0, 0.55, 0.08, 0.05)          // plinth
  band(grey, oct, 3.15, 4.25, 0.06, 0.04)       // grey sill zone over the ground storey
  band(grey, oct, 3.15, 3.45, 0.14, 0.06)       // its string course
  band(grey, oct, 7.55, 7.8, 0.06, 0.03)        // the zigzag band, as a plain line
  band(grey, oct, 12.2, 12.75, 0.2, 0.08)       // dentil course
  band(iron, oct, 12.75, 13.25, 0.42, 0.12)     // dark cornice lip

  sides.forEach(([a, b], k) => {
    const cardinal = k % 2 === 0
    // Ground storey: grey quoins at both ends of the face.
    rectOn(grey, a, b, 0.42, 0.42, 0.55, 3.15, 0.04)
    rectOn(grey, a, b, L - 0.42, 0.42, 0.55, 3.15, 0.04)
    if (cardinal) {
      // A pointed-arch doorway in a grey surround.
      lancetOn(grey, a, b, L / 2, 0.72, 0.55, 2.15, 0.05)
      lancetOn(iron, a, b, L / 2, 0.5, 0.55, 2.0, 0.08)
    } else {
      // A porthole window in a grey ring.
      discOn(grey, a, b, L / 2, 1.85, 0.55, 0.05)
      discOn(win, a, b, L / 2, 1.85, 0.36, 0.08)
    }
    // First storey: two lancets in grey pointed hoods, over the grey sill zone
    // with its small square panels.
    for (const c of [L / 2 - 0.68, L / 2 + 0.68]) rectOn(win, a, b, c, 0.16, 3.55, 3.9, 0.1)
    for (const c of [L / 2 - 0.68, L / 2 + 0.68]) {
      lancetOn(grey, a, b, c, 0.42, 4.25, 6.55, 0.05)
      lancetOn(win, a, b, c, 0.3, 4.3, 6.5, 0.08)
    }
    // Second storey: one lancet per face in a grey pointed hood.
    lancetOn(grey, a, b, L / 2, 0.55, 9.0, 10.75, 0.05)
    lancetOn(win, a, b, L / 2, 0.4, 9.05, 10.7, 0.08)
  })

  // --- Balcony ------------------------------------------------------------
  // A cast-iron gallery right round the second storey: a thin floor slab on
  // small brackets, and an open railing of posts with a top and middle rail,
  // so the red wall reads through it as in the photos.
  const BAL = 1.25
  const out = inset(oct, -BAL), rl = inset(oct, -(BAL - 0.1))
  walls(iron, out, 8.1, 8.5)                                  // slab edge
  cap(iron, out, 8.1, false)                                  // soffit
  for (let k = 0; k < 8; k++) {
    const j = (k + 1) % 8
    zinc.quad([oct[k][0], oct[k][1], 8.5], [out[k][0], out[k][1], 8.5], [out[j][0], out[j][1], 8.5], [oct[j][0], oct[j][1], 8.5])
  }
  /** A small square post or block between z0 and z1 at (x, y). */
  const post = (x: number, y: number, w: number, z0: number, z1: number) => prism(iron, [[x - w, y - w], [x + w, y - w], [x + w, y + w], [x - w, y + w]], z0, z1)
  for (let k = 0; k < 8; k++) {
    const a = rl[k], b = rl[(k + 1) % 8]
    for (const t of [0, 1 / 3, 2 / 3]) post(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, 0.06, 8.5, 9.45)
    // A bracket under the slab at each corner of the wall.
    const c = oct[k], d = out[k]
    face(iron, [[c[0], c[1], 7.3], [d[0] * 0.97, d[1] * 0.97, 8.1], [c[0], c[1], 8.1]], [-(c[1]), c[0], 0])
    face(iron, [[c[0], c[1], 7.3], [c[0], c[1], 8.1], [d[0] * 0.97, d[1] * 0.97, 8.1]], [c[1], -c[0], 0])
  }
  // Top and middle rails: thin bands round the ring.
  for (const [z0, z1] of [[9.35, 9.5], [8.85, 8.93]]) {
    const o = inset(oct, -(BAL - 0.04)), i = inset(oct, -(BAL - 0.16))
    walls(iron, o, z0, z1)
    walls(iron, [...i].reverse(), z0, z1)
    for (let k = 0; k < 8; k++) {
      const j = (k + 1) % 8
      iron.quad([i[k][0], i[k][1], z1], [o[k][0], o[k][1], z1], [o[j][0], o[j][1], z1], [i[j][0], i[j][1], z1])
      iron.quad([i[j][0], i[j][1], z0], [o[j][0], o[j][1], z0], [o[k][0], o[k][1], z0], [i[k][0], i[k][1], z0])
    }
  }

  // --- Roof ---------------------------------------------------------------
  // Grey zinc, a steep octagonal pyramid, slightly concave: a bell-cast kick
  // at the eaves, then steepening to the turret's base. It rises about as
  // much as the upper storey is tall.
  const ROOF_TOP = 16.9
  const eave = inset(oct, -0.42), kick = inset(oct, 0.35), mid = ngonF(0, 0, 2.55, 8), top = ngonF(0, 0, 1.45, 8)
  walls(zinc, eave, 13.25, 13.65, kick)
  walls(zinc, kick, 13.65, 15.3, mid)
  walls(zinc, mid, 15.3, ROOF_TOP, top)
  cap(zinc, top, ROOF_TOP)

  // --- Clock turret -------------------------------------------------------
  const T = 1.3 // half the turret's side
  const sq: XY[] = [[-T, -T], [T, -T], [T, T], [-T, T]]
  const STAGE0 = 17.7, STAGE1 = 19.6, DIAL = 18.65
  prism(zinc, sq, ROOF_TOP, STAGE0 - 0.05, false)              // grey base
  band(iron, sq, STAGE0 - 0.1, STAGE0 + 0.05, 0.08, 0.03)
  prism(iron, sq, STAGE0, STAGE1, false)                       // timber clock stage
  for (const [a, b] of segs(sq)) {
    discOn(grey, a, b, T, DIAL, 0.86, 0.05, 16)               // white dial ring
    discOn(iron, a, b, T, DIAL, 0.66, 0.08, 16)               // black dial
    rectOn(grey, a, b, T, 0.06, DIAL, DIAL + 0.55, 0.1)       // hands, bold
    rectOn(grey, a, b, T + 0.18, 0.18, DIAL - 0.06, DIAL + 0.06, 0.1)
  }
  // Cross-gabled cap, steep: two gabled roofs crossing, eaves overhanging.
  const E = T + 0.35, EAVE = 19.7, RIDGE = 21.9
  for (const alongX of [true, false]) {
    const m = (u: number, v: number, z: number): V3 => (alongX ? [u, v, z] : [v, u, z])
    // two slopes, dark like the timber
    face(iron, [m(-E, -E, EAVE), m(E, -E, EAVE), m(E, 0, RIDGE), m(-E, 0, RIDGE)], alongX ? [0, -1, 1] : [-1, 0, 1])
    face(iron, [m(E, E, EAVE), m(-E, E, EAVE), m(-E, 0, RIDGE), m(E, 0, RIDGE)], alongX ? [0, 1, 1] : [1, 0, 1])
    // gable ends, set back to the turret face
    for (const s of [-1, 1]) face(iron, [m(s * T, -T, EAVE), m(s * T, T, EAVE), m(s * T, 0, RIDGE - 0.15)], alongX ? [s, 0, 0] : [0, s, 0])
    // soffits
    face(iron, [m(-E, -E, EAVE), m(-E, 0, EAVE), m(E, 0, EAVE), m(E, -E, EAVE)], [0, 0, -1])
    face(iron, [m(-E, 0, EAVE), m(-E, E, EAVE), m(E, E, EAVE), m(E, 0, EAVE)], [0, 0, -1])
  }
  // Gable walls between the stage top and the eaves.
  prism(iron, sq, STAGE1, EAVE, false)
  // Finials at the four gable apexes and a weathervane spike, drawn bold.
  const spike = (x: number, y: number, z0: number, z1: number, w: number) => {
    const r: XY[] = [[x - w, y - w], [x + w, y - w], [x + w, y + w], [x - w, y + w]]
    walls(iron, r, z0, z1 - w * 2.5)
    for (let i = 0; i < 4; i++) { const j = (i + 1) % 4; iron.tri([r[i][0], r[i][1], z1 - w * 2.5], [r[j][0], r[j][1], z1 - w * 2.5], [x, y, z1]) }
  }
  for (const [x, y] of [[E, 0], [-E, 0], [0, E], [0, -E]] as XY[]) spike(x, y, EAVE + 0.2, EAVE + 1.3, 0.1)
  spike(0, 0, RIDGE - 0.2, 23.5, 0.13)
  // The vane's cross arms.
  const VZ = 22.6
  iron.quad([-0.6, -0.05, VZ], [0.6, -0.05, VZ], [0.6, -0.05, VZ + 0.15], [-0.6, -0.05, VZ + 0.15])
  iron.quad([0.6, 0.05, VZ], [-0.6, 0.05, VZ], [-0.6, 0.05, VZ + 0.15], [0.6, 0.05, VZ + 0.15])
  iron.quad([0.05, -0.6, VZ], [0.05, 0.6, VZ], [0.05, 0.6, VZ + 0.15], [0.05, -0.6, VZ + 0.15])

  const lit = (_p: V3, n: V3) => (n[2] > 0.7 ? 0.2 : 0.6)
  return [
    { part: red, material: { ...finish('clock-tower-red', 0xcc4a3e), floodlight: lit } },
    { part: grey, material: { ...finish('clock-tower-grey', 0xd6dad3), floodlight: lit } },
    { part: zinc, material: PALETTE.roof },
    { part: win, material: PALETTE.window },
    { part: iron, material: finish('clock-tower-iron', 0x4f4744) },
  ]
}

if (import.meta.main) await save('cpt-clock-tower-va', 'Clock Tower', [18.4221627, -33.9064795], 17.7, build())
