/**
 * 200 Clarendon (formerly the John Hancock Tower), Boston — original procedural
 * geometry, CC0-1.0.
 * bun generators/bos-200-clarendon.ts
 *
 * I. M. Pei & Partners (Henry N. Cobb), completed 1976; 60 storeys, the tallest
 * building in New England. A knife-thin parallelogram (rhomboid) in plan, all
 * reflective blue-grey glass, with a full-height sawtooth notch in each short
 * end and a dark louvred mechanical slot near the top of both long faces.
 *
 * Frame: map frame turned to BEARING 43.4, so +x runs along the long faces
 * (compass 133.4°, south-east) and +y points north-east, z up, metres. The
 * plan is sheared: a point at "end coordinate" u and y sits at x = u + SHEAR·y,
 * because the short ends run at 26.6° off square to the long faces (the
 * parallelogram's acute angle is 63.4°). Origin = the anchor, the centroid of
 * OSM outline way/405843558 (which also holds the low-rise wedge to the SW).
 *
 * Evidence
 * - OSM way/405843558 (outline, building=office, 60 levels, height 240.8,
 *   architect I.M. Pei & Partners); building:part way/29623484 (the tower,
 *   241 m, 63 levels, building:material=mirror, a notched parallelogram:
 *   long sides 88.4 m, short sides 35.5 m, acute angle 63.4°, measured from its
 *   nodes); way/236608503 (the low-rise wedge, 8 levels, 30 m); way/816334373
 *   (covered entrance canopy on the north-east face, 5 m).
 * - USGS 3DEP lidar MA_CentralEastern_1_2021 (2021 flight), 0.5 m grid read in
 *   this frame with tools/lidar_frame.py:
 *   - roof 241.2 m above the box's ground_min (1.83 m), the streets around at
 *     1.0-1.4 m above it: the roof stands ~240.0 m above the street;
 *   - tower plan: long faces at y = -4.5 and 28.3, ends at u = -53.9 and 35.1
 *     on every row, so the shear (0.5) and the 63.4° angle are measured;
 *     width 32.4 m across the long faces, 89.4 m along them;
 *   - notches: the west end steps in 5.4 m (along x) at y = 6.9 and slants
 *     back out to the end face by y = 12.2; the east end is the same turned
 *     through 180° about the plan centre (steps at y = 16.75, back by ~11);
 *   - wedge roof 31.8 above ground_min (30.5 m above the street), a penthouse
 *     to 34.6 (33.4 m) at x -17..0, y -14..-8; its west side is one straight
 *     line from the tower's west corner to the tip at (14, -38.8), its east
 *     side parallel to the tower's ends;
 *   - canopy top 5.0 above ground_min (3.8 m above the street);
 *   - three lattice antenna masts reach 263 m above ground_min; left out
 *     (thin lattice, STYLE.md "big readable forms").
 * - Published (Wikipedia "200 Clarendon"; CTBUH): 790 ft (240.8 m) roof
 *   height, 60 floors, plan about 297 x 105 ft (90.5 x 32 m), completed 1976.
 *   The published height is used for the roof (lidar 240.0 above the street).
 * - Mapterhorn terrain under the site: flat to ±0.6 m, no podium or steps.
 * - Commons photos (daylight unless noted), all EVIDENCE:
 *   - "2017 Prudential Skywalk - John Hancock Tower (ENE).jpg", Beyond My Ken,
 *     CC BY-SA 4.0: from the WSW; the SW face, the louvre slot (8.5-12.8 m
 *     below the roof, 15-84 % of the face width), the glass low-rise wedge;
 *   - "John Hancock Tower - Boston, Mass - DSC06111.jpg", Daderot, CC0: from
 *     Copley Square; the NW end with its notch and the NE face with its slot;
 *   - "Trinity Church and Hancock Tower, Boston, Massachusetts.jpg", Rizka,
 *     CC BY-SA 3.0: the notch as a dark full-height slot in the NW end;
 *   - "John Hancock Tower from Charles River Dam.jpg", Beyond My Ken,
 *     CC BY-SA 4.0: from the north; the NE face, the SE end and its notch,
 *     glass colour (pale sea-blue), roof masts;
 *   - "John Hancock Tower from Clarendon Street, April 2021.jpg", Fletcher,
 *     CC BY 4.0: from the north along Clarendon Street, sky-blue glass;
 *   - "John Hancock Tower - Boston, MA - DSC08138.JPG", Daderot, CC0: the
 *     pane grid and the glazed low-rise;
 *   - "Hancock Tower Boston djhb.jpg", Luciof, CC BY-SA 3.0 (night): office
 *     floors lit all over, no crown lighting.
 *
 * Estimated: the floor-line spacing (every three storeys, 12 m, as a few
 * pale lines on the glass, per STYLE.md's curtain-wall rule) and the mullion
 * lines (every two panes, ~9 m); the canopy's posts; the size of the roof
 * penthouse (lidar shows +4 m returns there; the platform in the Charles
 * River Dam photo). The glass colour is the photos' pale sky blue pulled to
 * the palette, the notch walls the darker palette `window`, as the notch
 * reads as a shadowed slot in every photo.
 *
 * Doubts: the canopy's form (covered=yes; drawn as an open slab on posts); the
 * wedge's street walls are seen only from above (skywalk photo) and in the
 * DSC08138 close-up; no photo shows the SE end straight on.
 * No look-only sources were used.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'

const BEARING = 43.4
const ANCHOR = { lng: -71.07519, lat: 42.34917 }

// --- Dimensions (see the header for each source) ---
const SHEAR = 0.5 // x = u + SHEAR * y (lidar)
const U0 = -54.1, U1 = 35.3 // the two ends, in u (lidar)
const Y0 = -4.3, Y1 = 28.1 // the SW and NE long faces (lidar)
const YC = (Y0 + Y1) / 2
const NOTCH_D = 5.5 // how far each notch steps in, along x (lidar)
const NOTCH_STEP = 5.0 // the stepped wall's offset from the plan centre in y (lidar)
const NOTCH_BACK = 0.3 // where the slanted wall meets the end again, past the centre
const TOP = 240.8 // roof (published 790 ft; lidar 240.0)
const BAND_TOP = TOP - 8.5, BAND_BOT = TOP - 12.8 // louvre slot (skywalk photo)
const BAND_A = 0.15, BAND_B = 0.85 // its extent along each long face
const WEDGE_TOP = 30.5 // low-rise roof (lidar)
const CANOPY_TOP = 3.8 // canopy (lidar)
const CH = 0.5 // corner chamfer

const glassP = new Part(), notchP = new Part(), lineP = new Part(), louvreP = new Part(), roofP = new Part()

type P2 = [number, number]
const at = (u: number, y: number): P2 => [u + SHEAR * y, y]

/** Plan of the tower, anticlockwise from above, with both notches. */
const towerPlan: P2[] = [
  at(U0, Y0), at(U1, Y0),
  at(U1, YC - NOTCH_BACK), at(U1 - NOTCH_D, YC + NOTCH_STEP), at(U1, YC + NOTCH_STEP),
  at(U1, Y1), at(U0, Y1),
  at(U0, YC + NOTCH_BACK), at(U0 + NOTCH_D, YC - NOTCH_STEP), at(U0, YC - NOTCH_STEP),
]
// Which edges are notch walls (drawn darker): edge i runs from point i to i+1.
const NOTCH_EDGES = new Set([2, 3, 7, 8])

const area2 = (a: P2, b: P2, c: P2) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])

/** Cut every convex corner by `c` along both edges; concave corners stay sharp. */
function chamfer(poly: P2[], c: number): { pts: P2[]; edge: number[] } {
  const pts: P2[] = [], edge: number[] = []
  const n = poly.length
  for (let i = 0; i < n; i++) {
    const p = poly[(i + n - 1) % n], q = poly[i], r = poly[(i + 1) % n]
    if (area2(p, q, r) > 0) {
      const d1 = Math.hypot(q[0] - p[0], q[1] - p[1]), d2 = Math.hypot(r[0] - q[0], r[1] - q[1])
      pts.push([q[0] + ((p[0] - q[0]) * c) / d1, q[1] + ((p[1] - q[1]) * c) / d1]); edge.push(-1)
      pts.push([q[0] + ((r[0] - q[0]) * c) / d2, q[1] + ((r[1] - q[1]) * c) / d2]); edge.push(i)
    } else {
      pts.push(q); edge.push(i)
    }
  }
  // edge[k] = the original edge that the segment k → k+1 lies on (-1 for a chamfer)
  return { pts, edge }
}

/** Push a closed anticlockwise polygon out by d (mitred). */
function offset(poly: P2[], d: number): P2[] {
  const n = poly.length
  return poly.map((q, i) => {
    const p = poly[(i + n - 1) % n], r = poly[(i + 1) % n]
    const n1 = norm2([q[1] - p[1], p[0] - q[0]]), n2 = norm2([r[1] - q[1], q[0] - r[0]])
    const m = norm2([n1[0] + n2[0], n1[1] + n2[1]])
    const k = d / Math.max(0.3, m[0] * n1[0] + m[1] * n1[1])
    return [q[0] + m[0] * k, q[1] + m[1] * k] as P2
  })
}
function norm2(v: P2): P2 { const l = Math.hypot(v[0], v[1]) || 1; return [v[0] / l, v[1] / l] }

/** Ear-clipping triangulation of a simple anticlockwise polygon; returns index triples. */
function earcut(poly: P2[]): [number, number, number][] {
  const idx = poly.map((_, i) => i), out: [number, number, number][] = []
  let guard = 0
  while (idx.length > 3 && guard++ < 1000) {
    for (let k = 0; k < idx.length; k++) {
      const a = idx[(k + idx.length - 1) % idx.length], b = idx[k], c = idx[(k + 1) % idx.length]
      if (area2(poly[a], poly[b], poly[c]) <= 1e-9) continue
      const inside = idx.some((j) => j !== a && j !== b && j !== c &&
        area2(poly[a], poly[b], poly[j]) >= 0 && area2(poly[b], poly[c], poly[j]) >= 0 && area2(poly[c], poly[a], poly[j]) >= 0)
      if (inside) continue
      out.push([a, b, c]); idx.splice(k, 1); break
    }
  }
  if (idx.length === 3) out.push([idx[0], idx[1], idx[2]])
  return out
}

function cap(p: Part, poly: P2[], z: number, up = true) {
  for (const [a, b, c] of earcut(poly)) {
    const A: V3 = [...poly[a], z], B: V3 = [...poly[b], z], C: V3 = [...poly[c], z]
    if (up) p.tri(A, B, C); else p.tri(A, C, B)
  }
}

/** Walls of an anticlockwise plan between z0 and z1, each edge to the Part `pick` chooses. */
function walls(poly: P2[], z0: number, z1: number, pick: (k: number) => Part) {
  for (let k = 0; k < poly.length; k++) {
    const a = poly[k], b = poly[(k + 1) % poly.length]
    pick(k).quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
  }
}

/** A flat strip on the wall a → b (anticlockwise plan order), set out by `out`, from s0 to s1 of its length. */
function strip(p: Part, a: P2, b: P2, s0: number, s1: number, z0: number, z1: number, out = 0.06) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), t: P2 = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
  const n: P2 = [t[1], -t[0]]
  const pt = (s: number, z: number): V3 => [a[0] + t[0] * s + n[0] * out, a[1] + t[1] * s + n[1] * out, z]
  p.quad(pt(s0, z0), pt(s1, z0), pt(s1, z1), pt(s0, z1))
}

// --- Tower body ---
const tower = chamfer(towerPlan, CH)
walls(tower.pts, 0, TOP, (k) => (NOTCH_EDGES.has(tower.edge[k]) ? notchP : glassP))
// Roof: a 0.5 m glass parapet lip, then the roof deck just inside it.
const deck = offset(tower.pts, -0.5)
for (let k = 0; k < tower.pts.length; k++) {
  const a = tower.pts[k], b = tower.pts[(k + 1) % tower.pts.length], c = deck[(k + 1) % deck.length], d = deck[k]
  roofP.quad([a[0], a[1], TOP], [b[0], b[1], TOP], [c[0], c[1], TOP], [d[0], d[1], TOP])
}
for (let k = 0; k < deck.length; k++) {
  const a = deck[k], b = deck[(k + 1) % deck.length]
  roofP.quad([b[0], b[1], TOP - 0.6], [a[0], a[1], TOP - 0.6], [a[0], a[1], TOP], [b[0], b[1], TOP])
}
cap(roofP, deck, TOP - 0.6)

// Roof penthouse / maintenance platform (lidar +4 m returns near the middle).
{
  const pts: P2[] = [at(-22, 6), at(4, 6), at(4, 17), at(-22, 17)]
  const z0 = TOP - 0.6, z1 = TOP + 3.2
  walls(pts, z0, z1, () => roofP)
  cap(roofP, pts, z1)
}

// --- Floor lines: a pale band every three storeys, wrapped round the tower ---
const ring = offset(tower.pts, 0.14)
const FLOOR = TOP / 60
for (let f = 3; f < 60; f += 3) {
  const z = f * FLOOR
  for (let k = 0; k < ring.length; k++) {
    const a = ring[k], b = ring[(k + 1) % ring.length]
    const inBand = z > BAND_BOT - 0.5 && z < BAND_TOP + 0.5
    if (inBand) continue
    lineP.quad([a[0], a[1], z - 0.2], [b[0], b[1], z - 0.2], [b[0], b[1], z + 0.2], [a[0], a[1], z + 0.2])
  }
}

// --- Vertical mullion lines and the louvre slot on the faces ---
{
  const SW: [P2, P2] = [at(U0, Y0), at(U1, Y0)]
  const NE: [P2, P2] = [at(U1, Y1), at(U0, Y1)]
  for (const [a, b] of [SW, NE]) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const bays = 10
    for (let i = 1; i < bays; i++) {
      const s = (L * i) / bays
      // the SW face is hidden behind the low-rise up to its roof
      const zStart = a === SW[0] ? WEDGE_TOP : 0
      strip(lineP, a, b, s - 0.2, s + 0.2, zStart, BAND_BOT, 0.16)
      strip(lineP, a, b, s - 0.2, s + 0.2, BAND_TOP, TOP, 0.16)
    }
    strip(louvreP, a, b, L * BAND_A, L * BAND_B, BAND_BOT, BAND_TOP, 0.2)
  }
  // Ends: one mullion line in the middle of each solid stretch.
  const ends: [P2, P2][] = [
    [at(U1, Y0), at(U1, YC - NOTCH_BACK)], [at(U1, YC + NOTCH_STEP), at(U1, Y1)],
    [at(U0, Y1), at(U0, YC + NOTCH_BACK)], [at(U0, YC - NOTCH_STEP), at(U0, Y0)],
  ]
  for (const [a, b] of ends) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    strip(lineP, a, b, L / 2 - 0.2, L / 2 + 0.2, 0, TOP, 0.16)
  }
}

// --- Low-rise wedge to the SW: glass walls, roof, penthouse ---
{
  // Its NE edge is the tower's SW face, so that wall is not drawn.
  const plan: P2[] = [[14, -38.8], [29.2, -8.4], [31.6, Y0], at(U0, Y0)]
  const w = chamfer(plan, CH)
  for (let k = 0; k < w.pts.length; k++) {
    if (w.edge[k] === 2) continue
    const a = w.pts[k], b = w.pts[(k + 1) % w.pts.length]
    glassP.quad([a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], WEDGE_TOP], [a[0], a[1], WEDGE_TOP])
  }
  // roof with a low lip
  const deckW = offset(w.pts, -0.5)
  for (let k = 0; k < w.pts.length; k++) {
    const a = w.pts[k], b = w.pts[(k + 1) % w.pts.length], c = deckW[(k + 1) % deckW.length], d = deckW[k]
    roofP.quad([a[0], a[1], WEDGE_TOP], [b[0], b[1], WEDGE_TOP], [c[0], c[1], WEDGE_TOP], [d[0], d[1], WEDGE_TOP])
    roofP.quad([d[0], d[1], WEDGE_TOP], [c[0], c[1], WEDGE_TOP], [c[0], c[1], WEDGE_TOP - 0.5], [d[0], d[1], WEDGE_TOP - 0.5])
  }
  cap(roofP, deckW, WEDGE_TOP - 0.5)
  const ph: P2[] = [[-17, -14], [0, -14], [0, -8], [-17, -8]]
  walls(ph, WEDGE_TOP - 0.5, WEDGE_TOP + 2.9, () => roofP)
  cap(roofP, ph, WEDGE_TOP + 2.9)
  // floor lines every two storeys
  const ringW = offset(w.pts, 0.14)
  for (const z of [7.6, 15.2, 22.8]) {
    for (let k = 0; k < ringW.length; k++) {
      if (w.edge[k] === 2) continue
      const a = ringW[k], b = ringW[(k + 1) % ringW.length]
      lineP.quad([a[0], a[1], z - 0.2], [b[0], b[1], z - 0.2], [b[0], b[1], z + 0.2], [a[0], a[1], z + 0.2])
    }
  }
}

// --- Entrance canopy on the NE face: a slab on posts ---
{
  const x0 = -26.5, x1 = 17.2, y0 = Y1, y1 = 37.0
  const slab: P2[] = [[x0, y0 - 0.3], [x1, y0 - 0.3], [x1, y1], [x0, y1]]
  walls(slab, CANOPY_TOP - 0.6, CANOPY_TOP, () => lineP)
  cap(lineP, slab, CANOPY_TOP)
  cap(lineP, slab, CANOPY_TOP - 0.6, false)
  for (const x of [x0 + 0.6, (x0 + x1) / 2, x1 - 0.6]) {
    const post: P2[] = [[x - 0.25, y1 - 0.85], [x + 0.25, y1 - 0.85], [x + 0.25, y1 - 0.35], [x - 0.25, y1 - 0.35]]
    walls(post, 0, CANOPY_TOP - 0.6, () => lineP)
  }
}

const parts = [
  { part: glassP, material: windowVariant(2, 0xa2bfd6) },
  { part: notchP, material: windowVariant(3, 0x4a5662) },
  { part: lineP, material: PALETTE.trim },
  { part: louvreP, material: finish('louvre', 0x4f5a64) },
  { part: roofP, material: PALETTE.roof },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('200 Clarendon', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: TOP + 3.2,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['way/405843558', 'way/29623484', 'way/236608503', 'way/816334373'],
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/bos-200-clarendon.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
