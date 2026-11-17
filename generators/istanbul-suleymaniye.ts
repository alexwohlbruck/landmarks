/**
 * Süleymaniye Mosque, Istanbul (Mimar Sinan, 1550-57): procedural, CC0-1.0.
 * bun generators/istanbul-suleymaniye.ts
 *
 * The prayer hall and its courtyard (avlu) only; the külliye's medreses,
 * imaret, hospital and the tombs of Süleyman and Hürrem are separate OSM
 * buildings outside the outline and stay on the map.
 *
 * Frame: the model is built along the mosque's axis and placed at bearing
 * 137.6 (the qibla, south-east), so +y runs from the courtyard to the qibla
 * wall and +x is the south-west side. Origin: the centroid of the OSM outline
 * (relation/1564032, a 64.6 x 113.8 m rectangle). Axis bearing from the
 * outline's long sides (137.6) and from the four minarets (OSM ways
 * 642004198/946/948/950), which agree.
 *
 * Ground: y = 0 is the platform the mosque and courtyard stand on. The
 * precinct is a built-up terrace; photos from both lateral sides (the
 * Galata Tower view and "Süleymaniye Mosque, 22 January 2025") and the
 * courtyard gate show the walls, gallery and gate meeting level paving, the
 * steep fall to the Golden Horn beginning outside the precinct wall
 * (aerial and the Hostetler terrace view). So no wall here is an uphill
 * wall in reality; details start about 1.5 m up all round, in case the
 * map's coarse terrain tilts the footprint. Mapterhorn has no z15 terrain
 * here (404), so `terrain.ts check` could not run. Elevation 0.
 *
 * Plan (measured): Ali Saim Ülgen's survey plan "Ist. Süleymaniye Camii
 * rölövesi 1/200" (Commons "План комплексу Сулейманіє.jpg", CC BY 4.0),
 * read against its scale bar (17.3 px/m at full size) and fitted to the
 * OSM outline, whose length it matches within 1%: prayer hall 60 m long
 * with lateral walls at ±30.8 m and its two-storey galleries and buttress
 * towers to ±34.5; courtyard ±30.2 m, open court 44.4 x 32.5 m; the four
 * piers at ±14.3/±14.9 m about the dome centre (25 m up the axis); five
 * aisle domes a side (corner domes about 10 m, two 6.6 m on the pier line,
 * the centre one 10.8 m); 24 courtyard columns, 28 portico domes (9 + 9 +
 * 5 + 5); the gate block 20 m wide, projecting 1.4 m; qibla buttresses.
 * Minarets: plan positions (±31.5, -4.5) and (±30, -55); OSM puts them
 * 2-4 m further out.
 *
 * Heights. Published: dome 53 m high, 27.5 m (trwiki) / 26.5 m (enwiki)
 * across inside, used as the crown of the lead (53.0); the two minarets at
 * the prayer hall 76 m with three şerefes, 63.8 m without their caps; the
 * two at the far corners 56 m with two şerefes (tr.wikipedia
 * "Süleymaniye Camii"; en.wikipedia "Süleymaniye Mosque"). Measured from
 * the near-level telephoto from Galata Tower (1.36 km, scaled by the dome
 * and the hall's length): dome lead 29.2 m across (OSM dome part 29.2),
 * springing 42.9, drum 35-42.2, turrets to 35 with domes to 38.9, lateral
 * wall cornice 20.6, aisle domes on drums from 23.6-25.6, buttress towers
 * 23.4, gallery floor 6, eave 9.6, pent roof to 12; minaret şerefes at
 * 40.5, 47.6 and 55.6 m, cap from 65.5 m (photo reads the minaret 3%
 * taller than published; the published 76 m cap tip is kept). Short
 * minarets: şerefe spacing and cap from the Golden Horn view (Hałun),
 * scaled to the published 56 m. Courtyard wall 11 m, gate 16 m with its
 * crest to 19.4 m (scaled off the gate photo by the 20 m gate width).
 * Estimated: semi-dome window drums (to 29.6 m) and caps (crown 35 m,
 * from the courtyard and north-west views), portico heights (arches spring
 * 5.6 m, the taller south-east portico 7.6 m; roofs 10.3 / 12.5 m),
 * window sizes and counts (grouped), the fountain.
 *
 * Simplified or left out: the stepped buttressing round the drum's base,
 * the small corner turrets and side porches of the hall, the muqarnas,
 * balustrades, lead ribs, the alem crescents, Iznik tiles, and the outer
 * precinct. Minarets drawn about 1.5x their real girth and balconies about
 * 1.2x, so they hold at map scale (city notes).
 *
 * Night: the mosque is floodlit; stone and lead carry a `_FLOODLIGHT`
 * wash, windows glow, the gate door is `entrance`.
 *
 * Photos (Wikimedia Commons; all EVIDENCE):
 * - "Süleymaniye Mosque viewed from Galata Tower, Istanbul, 2024.jpg", Julian Lupyan, CC0 (north-east, level; main ruler)
 * - "Süleymaniye Mosque, Istanbul, 20260606 0805 1307.jpg", Jakub Hałun, CC BY 4.0 (from the Golden Horn, minarets)
 * - "Istanbul Province - Süleymaniye Mosque - 20240128150219.jpg", Canercangul, CC BY-SA 4.0 (north-west, far)
 * - "Süleymaniye Mosque February 2013 03.jpg", Arild Vågen, CC BY-SA 3.0 (courtyard gate)
 * - "Süleymaniye Mosque February 2013 02.jpg", Arild Vågen, CC BY-SA 3.0 (gate and court)
 * - "Domes of the Süleymaniye Mosque.jpg", Bernard Gagnon, CC BY-SA 3.0 (from the court: semi-dome, turrets, portico)
 * - "Süleymaniye Mosque exterior view.JPG", İhsan Deniz Kılıçoğlu, CC BY-SA 3.0 (south-east)
 * - "Süleymaniye Mosque 2.jpg", İhsan Deniz Kılıçoğlu, CC BY-SA 3.0 (south-west)
 * - "Süleymaniye Mosque, 22 January 2025.jpg", Dr.Suskun, CC BY 4.0 (north-east, ground)
 * - "Süleymaniye Mosque (29070459418).jpg", Brad Hostetler, CC BY 2.0 (terrace, Golden Horn side)
 * - "Süleymaniye Camii - İstanbul Üniversitesi - Aerial view.jpg", Carlos Delgado, CC BY-SA 3.0
 * - "План комплексу Сулейманіє.jpg", Ali Saim Ülgen, CC BY 4.0 (survey plan)
 * Look-only: none.
 *
 * Doubts: OSM's outline is a plain rectangle (the hall's galleries stand
 * 2 m outside it, the minarets' OSM positions 2-4 m further out than the
 * plan's); the dome height (53 m published, used for the lead crown,
 * though it may be the inside height); the short minarets' şerefe heights;
 * the qibla side and the hall's south-west face rest on oblique photos.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

// ---------------------------------------------------------------------------
// Parts, one per material.

const stone = new Part() // limestone walls, drums, minarets
const trim = new Part() // cornices, arch bands, minaret balconies
const lead = new Part() // lead domes and roofs
const glaze = new Part() // window panels
const gilt = new Part() // alem finials
const portal = new Part() // portal recesses

// ---------------------------------------------------------------------------
// Helpers. Map frame: x across the mosque (+x is the south-west side), y along
// the axis (+y is the qibla, south-east), z up. Every face is given its
// outward normal; Part.tri then winds it to agree.

const TAU = Math.PI * 2
const norm = (v: V3): V3 => {
  const l = Math.hypot(v[0], v[1], v[2]) || 1
  return [v[0] / l, v[1] / l, v[2] / l]
}
const add = (a: V3, b: V3, k = 1): V3 => [a[0] + b[0] * k, a[1] + b[1] * k, a[2] + b[2] * k]
const Z: V3 = [0, 0, 1]

function tri(p: Part, a: V3, b: V3, c: V3, n: V3 | V3[]) {
  const ns = Array.isArray(n[0]) ? (n as V3[]) : [n as V3, n as V3, n as V3]
  p.tri(a, b, c, [0, 0], [0, 0], [0, 0], ns)
}
function quad(p: Part, a: V3, b: V3, c: V3, d: V3, n: V3 | V3[]) {
  const ns = Array.isArray(n[0]) ? (n as V3[]) : [n as V3, n as V3, n as V3, n as V3]
  tri(p, a, b, c, [ns[0], ns[1], ns[2]])
  tri(p, a, c, d, [ns[0], ns[2], ns[3]])
}
/** A convex planar polygon, fanned from its first corner. */
function face(p: Part, pts: V3[], n: V3) {
  for (let i = 1; i < pts.length - 1; i++) tri(p, pts[0], pts[i], pts[i + 1], n)
}

/**
 * A surface of revolution about the vertical axis at (cx, cy): `prof` runs
 * from bottom to top as [r, z]. Smooth round the axis; along the profile,
 * `smooth` averages the normals of neighbouring segments (domes), otherwise
 * each segment keeps its own (sharp ledges).
 */
function lathe(p: Part, cx: number, cy: number, prof: [number, number][], n: number,
  o: { smooth?: boolean; a0?: number; a1?: number; phase?: number; facet?: boolean } = {}) {
  const a0 = o.a0 ?? 0, a1 = o.a1 ?? TAU, ph = o.phase ?? 0
  const segN = prof.slice(0, -1).map((q, k) => {
    const dr = prof[k + 1][0] - q[0], dz = prof[k + 1][1] - q[1]
    const l = Math.hypot(dr, dz) || 1
    return [dz / l, -dr / l] as [number, number]
  })
  const vN = (k: number, seg: number): [number, number] => {
    if (!o.smooth) return segN[seg]
    const a = segN[Math.max(0, k - 1)], b = segN[Math.min(segN.length - 1, k)]
    const r = a[0] + b[0], z = a[1] + b[1], l = Math.hypot(r, z) || 1
    return [r / l, z / l]
  }
  const at = (r: number, z: number, t: number): V3 => [cx + r * Math.cos(t), cy + r * Math.sin(t), z]
  const nn = (q: [number, number], t: number): V3 => norm([q[0] * Math.cos(t), q[0] * Math.sin(t), q[1]])
  for (let i = 0; i < n; i++) {
    const t0 = ph + a0 + ((a1 - a0) * i) / n, t1 = ph + a0 + ((a1 - a0) * (i + 1)) / n
    const tm = (t0 + t1) / 2
    for (let k = 0; k < prof.length - 1; k++) {
      const [r0, z0] = prof[k], [r1, z1] = prof[k + 1]
      const A = at(r0, z0, t0), B = at(r0, z0, t1), C = at(r1, z1, t1), D = at(r1, z1, t0)
      let nA = nn(vN(k, k), t0), nB = nn(vN(k, k), t1), nC = nn(vN(k + 1, k), t1), nD = nn(vN(k + 1, k), t0)
      if (o.facet) nA = nB = nC = nD = nn(segN[k], tm)
      if (r0 < 1e-6) tri(p, A, C, D, [nA, nC, nD])
      else if (r1 < 1e-6) tri(p, A, B, C, [nA, nB, nC])
      else quad(p, A, B, C, D, [nA, nB, nC, nD])
    }
  }
}

/** A spherical cap: base radius rb at zb, crown at zb + rise. */
function domeProfile(rb: number, zb: number, rise: number, rings: number): [number, number][] {
  const R = (rb * rb + rise * rise) / (2 * rise), zc = zb + rise - R
  const t0 = Math.asin(Math.min(1, rb / R))
  const out: [number, number][] = []
  for (let k = 0; k <= rings; k++) {
    const t = t0 * (1 - k / rings)
    out.push([R * Math.sin(t), zc + R * Math.cos(t)])
  }
  out[rings][0] = 0
  return out
}
function dome(p: Part, cx: number, cy: number, rb: number, zb: number, rise: number, n: number, rings: number) {
  lathe(p, cx, cy, domeProfile(rb, zb, rise, rings), n, { smooth: true })
}

/** A box with chamfered vertical edges; sides to `side`, top to `top`. */
function box(side: Part, top: Part | null, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, b = 0) {
  const ring: [number, number][] = b > 0
    ? [[x0 + b, y0], [x1 - b, y0], [x1, y0 + b], [x1, y1 - b], [x1 - b, y1], [x0 + b, y1], [x0, y1 - b], [x0, y0 + b]]
    : [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
  prism(side, top, ring, z0, z1)
}
/** A vertical prism over a convex ring (counter-clockwise from above). */
function prism(side: Part, top: Part | null, ring: [number, number][], z0: number, z1: number | number[]) {
  const zt = (i: number) => (Array.isArray(z1) ? z1[i] : z1)
  for (let i = 0; i < ring.length; i++) {
    const j = (i + 1) % ring.length
    const [ax, ay] = ring[i], [bx, by] = ring[j]
    const n = norm([by - ay, -(bx - ax), 0])
    quad(side, [ax, ay, z0], [bx, by, z0], [bx, by, zt(j)], [ax, ay, zt(i)], n)
  }
  if (top) {
    const pts = ring.map(([x, y], i) => [x, y, zt(i)] as V3)
    const a = pts[0], b = pts[1], c = pts[2]
    const n = norm([(b[1] - a[1]) * (c[2] - a[2]) - (b[2] - a[2]) * (c[1] - a[1]), (b[2] - a[2]) * (c[0] - a[0]) - (b[0] - a[0]) * (c[2] - a[2]), (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])])
    face(top, pts, n[2] < 0 ? [-n[0], -n[1], -n[2]] : n)
  }
}
/** A box turned to a horizontal direction u, centred on (cx, cy). */
function obox(side: Part, top: Part | null, cx: number, cy: number, u: [number, number], hu: number, hv: number, z0: number, z1: number | number[]) {
  const v: [number, number] = [-u[1], u[0]]
  const c = (su: number, sv: number): [number, number] => [cx + u[0] * su + v[0] * sv, cy + u[1] * su + v[1] * sv]
  prism(side, top, [c(-hu, -hv), c(hu, -hv), c(hu, hv), c(-hu, hv)], z0, z1)
}

/** The horizontal direction to the right of a viewer facing a wall with outward normal n. */
const rightOf = (n: V3): V3 => [-n[1], n[0], 0]

/**
 * A flat panel on a wall: centred at `at` (on the wall, at its bottom), `w`
 * wide and `h` tall, with a round (semicircular) top when `arch`.
 */
function panel(p: Part, at: V3, n: V3, w: number, h: number, arch = false, segs = 6) {
  const u = rightOf(n), o = add(at, n, 0.06)
  const P = (s: number, z: number): V3 => [o[0] + u[0] * s, o[1] + u[1] * s, o[2] + z]
  const r = w / 2, zs = arch ? h - r : h
  quad(p, P(-r, 0), P(r, 0), P(r, zs), P(-r, zs), n)
  if (arch) {
    for (let i = 0; i < segs; i++) {
      const t0 = (Math.PI * i) / segs, t1 = (Math.PI * (i + 1)) / segs
      tri(p, P(0, zs), P(r * Math.cos(t0), zs + r * Math.sin(t0)), P(r * Math.cos(t1), zs + r * Math.sin(t1)), n)
    }
  }
}

// ---------------------------------------------------------------------------
// Dimensions (metres). See the header for where each comes from.

// Prayer hall.
const HX = 30.8 // lateral wall faces at ±HX
const HY0 = -6.1, HY1 = 53.9 // north-west facade, qibla wall
const WALL = 19.8, CORN = 20.6 // wall top, cornice/roof
const DC = 25 // centre of the main dome along the axis
// Central dome.
const DRUM0 = 35, DRUM_R = 14.6, LIP0 = 42.2, LIP1 = 42.9, DOME_R = 14.6, CROWN = 53
// Courtyard.
const CX = 30.2, CXI = 28.2 // outer wall faces, inner faces
const CY0 = -56.8, CY0I = -54.6 // north-west wall outer, inner face
const AX = 22.2, AY0 = -46.5, AY1 = -14 // arcade lines (open court)
const CWALL = 11

// ---------------------------------------------------------------------------
// Prayer hall body.

box(stone, null, -HX, HX, HY0, HY1, 0, WALL, 0.5)
box(trim, lead, -HX - 0.35, HX + 0.35, HY0 - 0.35, HY1 + 0.35, WALL, CORN, 0.6)

// Qibla wall buttresses.
for (const x of [-16, -6.3, 6.3, 16]) box(stone, stone, x - 1.6, x + 1.6, HY1 - 0.2, HY1 + 3.0, 0, 18.4, 0.4)

// Lateral buttress towers over the main piers, with small domes.
for (const s of [-1, 1]) {
  for (const y of [DC - 15, DC + 15]) {
    const x0 = s > 0 ? HX - 0.2 : -HX - 3.7, x1 = s > 0 ? HX + 3.7 : -HX + 0.2
    box(stone, stone, x0, x1, y - 2.2, y + 2.2, 0, 23.4, 0.4)
    dome(lead, (x0 + x1) / 2, y, 1.75, 23.4, 1.9, 8, 2)
  }
}

// Lateral two-storey galleries between the towers: piers below, a floor,
// slender columns above, a lead pent roof against the wall.
for (const s of [-1, 1]) {
  const xo = s * (HX + 3.4), xw = s * HX
  const yA = DC - 12.8, yB = DC + 12.8, n = 7
  for (let i = 0; i < n; i++) {
    const y = yA + 1 + ((yB - yA - 2) * i) / (n - 1)
    const xc = xo - s * 0.4
    box(stone, null, xc - 0.4, xc + 0.4, y - 0.45, y + 0.45, 0, 6.0)
    box(stone, null, xc - 0.22, xc + 0.22, y - 0.22, y + 0.22, 6.6, 9.6)
  }
  // Floor slab between storeys (its edge shows), and the pent roof.
  const xa = Math.min(xo, xw), xb = Math.max(xo, xw)
  box(trim, trim, xa, xb, yA, yB, 6.0, 6.6)
  const eave = xo + s * 0.3
  const ny = norm([s * 2.4, 0, Math.abs(eave - xw)])
  quad(lead, [eave, yA, 9.6], [eave, yB, 9.6], [xw, yB, 12.0], [xw, yA, 12.0], ny)
  quad(trim, [eave, yA, 9.25], [eave, yB, 9.25], [eave, yB, 9.6], [eave, yA, 9.6], [s, 0, 0])
  // Windows on the wall inside the gallery, both storeys.
  for (const y of [DC - 8.3, DC, DC + 8.3]) {
    panel(glaze, [xw, y, 1.6], [s, 0, 0], 4.2, 3.4)
    panel(glaze, [xw, y, 7.2], [s, 0, 0], 4.2, 2.2)
  }
}

// Lateral windows: big arched groups over the gallery and in the corner bays.
for (const s of [-1, 1]) {
  const n: V3 = [s, 0, 0]
  for (const y of [DC - 8.3, DC, DC + 8.3]) panel(glaze, [s * HX, y, 12.6], n, 4.8, 6.0, true)
  for (const y of [0.9, 49.1]) {
    panel(glaze, [s * HX, y, 8.4], n, 6.4, 9.0, true)
    panel(glaze, [s * HX, y, 1.8], n, 5.0, 3.6)
  }
}
// Qibla wall windows between the buttresses, two tiers.
for (const x of [-24, -11.1, 0, 11.1, 24]) {
  const w = Math.abs(x) > 20 ? 6.4 : 4.4
  panel(glaze, [x, HY1, 2.2], [0, 1, 0], w, 3.4)
  panel(glaze, [x, HY1, 8.2], [0, 1, 0], w, 7.4, true)
}
// North-west facade, above the courtyard portico.
for (const x of [-20, -8.5, 8.5, 20]) panel(glaze, [x, HY0, 14.4], [0, -1, 0], 3.2, 4.6, true)

// ---------------------------------------------------------------------------
// The central block: four weight turrets, the lateral tympana, the drum and
// the dome; the semi-domes on their window drums front and back.

const CB = 15.5 // half-size of the central block
box(stone, lead, -CB, CB, DC - CB, DC + CB, CORN, DRUM0)
for (const s of [-1, 1]) {
  // Tympanum arch band (a semicircle) and its windows.
  const xf = s * CB, n: V3 = [s, 0, 0], ac = 24.4, ar = 10.6, seg = 10
  for (let i = 0; i < seg; i++) {
    const t0 = (Math.PI * i) / seg, t1 = (Math.PI * (i + 1)) / seg
    const P = (t: number, r: number, d: number): V3 => [xf + s * d, DC + r * Math.cos(t), ac + r * Math.sin(t)]
    quad(trim, P(t0, ar, 0.35), P(t1, ar, 0.35), P(t1, ar + 1.0, 0.35), P(t0, ar + 1.0, 0.35), n)
    const tm = (t0 + t1) / 2
    quad(trim, P(t0, ar, 0), P(t1, ar, 0), P(t1, ar, 0.35), P(t0, ar, 0.35), [0, -Math.cos(tm), -Math.sin(tm)])
  }
  panel(glaze, [xf, DC, 26.6], n, 2.6, 5.0, true)
  for (const d of [-4.6, 4.6]) panel(glaze, [xf, DC + d, 26.2], n, 2.2, 4.0, true)
  for (const d of [-2.6, 2.6]) panel(glaze, [xf, DC + d, 32.0], n, 1.4, 1.4)
}
for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
  const tx = sx * CB, ty = DC + sy * CB
  lathe(stone, tx, ty, [[3.6, CORN], [3.6, 35.2], [2.9, 35.2], [2.9, 36.2]], 8, { facet: true, phase: Math.PI / 8 })
  dome(lead, tx, ty, 2.9, 36.2, 2.7, 8, 3)
}

// Drum: a sixteen-sided wall, buttresses between the windows, the cornice lip.
lathe(stone, 0, DC, [[DRUM_R, DRUM0], [DRUM_R, LIP0]], 16, { facet: true })
for (let i = 0; i < 16; i++) {
  const t = (TAU * i) / 16, u: [number, number] = [Math.cos(t), Math.sin(t)]
  const rc = DRUM_R + 1.1
  obox(stone, stone, u[0] * rc, DC + u[1] * rc, u, 1.6, 0.9, DRUM0, [38.6, 42.6, 42.6, 38.6])
  const tm = t + Math.PI / 16, r = DRUM_R * Math.cos(Math.PI / 16)
  panel(glaze, [Math.cos(tm) * r, DC + Math.sin(tm) * r, 36.4], [Math.cos(tm), Math.sin(tm), 0], 3.4, 5.4, true, 4)
}
lathe(trim, 0, DC, [[DRUM_R + 0.6, LIP0], [DRUM_R + 0.6, LIP1], [DOME_R, LIP1]], 24)
dome(lead, 0, DC, DOME_R, LIP1, CROWN - LIP1, 24, 6)
// The alem: bulbs on a rod, crescent left out.
lathe(gilt, 0, DC, [[0.55, CROWN - 0.2], [0.85, 54.2], [0.5, 55.2], [0.25, 55.6], [0.6, 56.6], [0.2, 57.6], [0.12, 59.4], [0, 59.6]], 8, { smooth: true })

// Semi-domes, north-west and south-east, each on a half-round window drum
// over a block that rises from the aisle roofs.
for (const s of [-1, 1]) {
  const yc = DC + s * 13.5, r = 14, zw = 29.6
  // Half drum (six-sided, from the aisle roofs) and half dome, the open
  // side toward the dome, inside the central block.
  const a0 = s > 0 ? 0 : Math.PI
  lathe(stone, 0, yc, [[r, CORN], [r, zw]], 6, { a0, a1: a0 + Math.PI, facet: true })
  lathe(lead, 0, yc, [[r, zw], [9.8, zw + 0.9]], 6, { a0, a1: a0 + Math.PI, facet: true })
  lathe(lead, 0, yc, domeProfile(9.8, zw + 0.9, 35 - zw - 0.9, 3), 10, { smooth: true, a0, a1: a0 + Math.PI })
  for (let i = 0; i < 6; i++) {
    const t = a0 + (Math.PI * (i + 0.5)) / 6, rr = r * Math.cos(Math.PI / 12)
    const at = (z: number): V3 => [rr * Math.cos(t), yc + rr * Math.sin(t), z]
    panel(glaze, at(25.9), [Math.cos(t), Math.sin(t), 0], 4.4, 2.8, false)
    if (i > 0 && i < 5) panel(glaze, at(21.4), [Math.cos(t), Math.sin(t), 0], 3.0, 3.2, true, 4)
  }
}

// Aisle domes, five a side: corner domes, two small ones on the pier line
// and the larger centre one, each on an octagonal drum.
for (const s of [-1, 1]) {
  const x = s * 22.3
  for (const [y, r, zb] of [[3.6, 5.0, 23.6], [15.2, 3.3, 25.6], [DC, 5.4, 23.8], [34.8, 3.3, 25.6], [46.4, 5.0, 23.6]] as [number, number, number][]) {
    lathe(stone, x, y, [[r + 0.35, CORN], [r + 0.35, zb]], 8, { facet: true, phase: Math.PI / 8 })
    dome(lead, x, y, r + 0.35, zb, r * 0.95, 10, 3)
  }
}

// ---------------------------------------------------------------------------
// Courtyard: outer walls, the raised north-west gate, the domed portico.

for (const s of [-1, 1]) {
  const x0 = s > 0 ? CXI : -CX, x1 = s > 0 ? CX : -CXI
  box(stone, stone, x0, x1, CY0, AY1, 0, CWALL)
  box(stone, stone, x0, x1, AY1, HY0, 0, 13.2)
  // Outer windows, two tiers, one pair per portico bay.
  for (let i = 0; i < 7; i++) {
    const y = CY0 + 5.6 + i * 6.9
    panel(glaze, [s * CX, y, 1.8], [s, 0, 0], 1.7, 2.6)
    panel(glaze, [s * CX, y, 6.0], [s, 0, 0], 1.7, 3.0, true, 4)
  }
}
box(stone, stone, -CXI, CXI, CY0, CY0I, 0, CWALL)
for (const x of [-26.6, -21.6, -16.6, -12.0, 12.0, 16.6, 21.6, 26.6]) {
  panel(glaze, [x, CY0, 1.8], [0, -1, 0], 1.7, 2.6)
  panel(glaze, [x, CY0, 6.0], [0, -1, 0], 1.7, 3.0, true, 4)
}
// Gate block with its crest and portal.
box(stone, trim, -10, 10, CY0 - 1.4, CY0I, 0, 16, 0.3)
prism(stone, trim, [[-6, CY0 - 1.2], [6, CY0 - 1.2], [6, CY0 - 0.2], [-6, CY0 - 0.2]], 16, [17.6, 17.6, 17.6, 17.6])
face(stone, [[-6, CY0 - 1.2, 17.6], [6, CY0 - 1.2, 17.6], [0, CY0 - 1.2, 19.4]], [0, -1, 0])
face(stone, [[6, CY0 - 0.2, 17.6], [-6, CY0 - 0.2, 17.6], [0, CY0 - 0.2, 19.4]], [0, 1, 0])
quad(trim, [6, CY0 - 1.2, 17.6], [6, CY0 - 0.2, 17.6], [0, CY0 - 0.2, 19.4], [0, CY0 - 1.2, 19.4], norm([1.8, 0, 6]))
quad(trim, [0, CY0 - 1.2, 19.4], [0, CY0 - 0.2, 19.4], [-6, CY0 - 0.2, 17.6], [-6, CY0 - 1.2, 17.6], norm([-1.8, 0, 6]))
// The marble portal frame, its door, and two columns of windows each side.
panel(trim, [0, CY0 - 1.4, 0], [0, -1, 0], 6.2, 15.4)
panel(portal, [0, CY0 - 1.46, 0.6], [0, -1, 0], 2.8, 5.8, true, 6)
for (const x of [-8.2, -4.8, 4.8, 8.2]) for (const z of [2.3, 6.9, 11.2]) panel(glaze, [x, CY0 - 1.4, z], [0, -1, 0], 1.5, 2.3)

// Portico roofs (lead between the domes): laterals and north-west at 10.3,
// the taller south-east portico before the prayer hall at 12.5.
const RL = 10.3, RS = 12.5
face(lead, [[-CXI, CY0I, RL], [CXI, CY0I, RL], [CXI, AY0, RL], [-CXI, AY0, RL]], Z)
for (const s of [-1, 1]) {
  const xa = s * AX, xb = s * CXI
  face(lead, [[Math.min(xa, xb), AY0, RL], [Math.max(xa, xb), AY0, RL], [Math.max(xa, xb), AY1, RL], [Math.min(xa, xb), AY1, RL]], Z)
  quad(stone, [Math.min(xa, xb), AY1, RL], [Math.max(xa, xb), AY1, RL], [Math.max(xa, xb), AY1, RS], [Math.min(xa, xb), AY1, RS], [0, -1, 0])
}
face(lead, [[-CXI, AY1, RS], [CXI, AY1, RS], [CXI, HY0, RS], [-CXI, HY0, RS]], Z)

/**
 * One side of the arcade: pointed arches on columns, the face toward the
 * court. `o` is where the side starts, `n` its normal (into the court);
 * bays run to the right as seen from the court.
 */
function arcade(o: V3, n: V3, bays: number, bw: number, zs: number, za: number, zt: number) {
  const u = rightOf(n), t = 0.9, cw = 0.42, k = 2
  const P = (s: number, z: number, d = 0): V3 => [o[0] + u[0] * s - n[0] * d, o[1] + u[1] * s - n[1] * d, z]
  for (let b = 0; b < bays; b++) {
    const s0 = b * bw, s1 = s0 + bw, sL = s0 + cw, sR = s1 - cw, a = (sR - sL) / 2, H = za - zs
    const rho = (a * a + H * H) / (2 * a), ta = Math.acos((a - rho) / rho)
    // Left arc points from the springing up to the apex; the right mirrors it.
    const L: [number, number][] = [], R: [number, number][] = []
    for (let i = 0; i <= k; i++) {
      const th = Math.PI - ((Math.PI - ta) * i) / k
      L.push([sL + rho + rho * Math.cos(th), zs + rho * Math.sin(th)])
      R.push([sR - rho - rho * Math.cos(th), zs + rho * Math.sin(th)])
    }
    const TL = P(s0, zt), TR = P(s1, zt)
    tri(stone, TL, P(s0, zs), P(L[0][0], L[0][1]), n)
    for (let i = 0; i < k; i++) tri(stone, TL, P(L[i][0], L[i][1]), P(L[i + 1][0], L[i + 1][1]), n)
    tri(stone, TL, P(L[k][0], L[k][1]), TR, n)
    for (let i = k; i > 0; i--) tri(stone, TR, P(R[i][0], R[i][1]), P(R[i - 1][0], R[i - 1][1]), n)
    tri(stone, TR, P(R[0][0], R[0][1]), P(s1, zs), n)
    // Intrados, each arc's points facing its own centre.
    for (const [arc, cs] of [[L, sL + rho], [R, sR - rho]] as [[number, number][], number][]) {
      for (let i = 0; i < k; i++) {
        const nrm = (q: [number, number]): V3 => {
          const ds = cs - q[0], dz = zs - q[1], l = Math.hypot(ds, dz)
          return norm([u[0] * ds / l, u[1] * ds / l, dz / l])
        }
        const q0 = arc[i], q1 = arc[i + 1]
        quad(stone, P(q0[0], q0[1]), P(q1[0], q1[1]), P(q1[0], q1[1], t), P(q0[0], q0[1], t), [nrm(q0), nrm(q1), nrm(q1), nrm(q0)])
      }
    }
  }
}
const SEB = (2 * AX) / 7, LB = (AY1 - AY0) / 5
arcade([-AX, AY1, 0], [0, -1, 0], 7, SEB, 7.6, 11.0, RS) // south-east, taller
arcade([AX, AY0, 0], [0, 1, 0], 7, SEB, 5.6, 8.8, RL) // north-west
arcade([AX, AY1, 0], [-1, 0, 0], 5, LB, 5.6, 8.8, RL) // south-west side
arcade([-AX, AY0, 0], [1, 0, 0], 5, LB, 5.6, 8.8, RL) // north-east side
// Columns: 24, six-sided.
const cols: [number, number, number][] = []
for (let i = 0; i <= 7; i++) {
  cols.push([-AX + i * SEB, AY1, 7.6])
  cols.push([-AX + i * SEB, AY0, 5.6])
}
for (let i = 1; i < 5; i++) for (const s of [-1, 1]) cols.push([s * AX, AY1 - i * LB, 5.6])
for (const [x, y, h] of cols) lathe(stone, x, y, [[0.42, 0], [0.42, h]], 6, { phase: Math.PI / 6 })

// Portico domes: 28. Nine along the south-east and north-west sides
// (corners included), five along each lateral side.
const pd = (x: number, y: number, r: number, zr: number, drum: number) => {
  if (drum > 0) lathe(stone, x, y, [[r + 0.3, zr], [r + 0.3, zr + drum], [r, zr + drum]], 8, { facet: true, phase: Math.PI / 8 })
  dome(lead, x, y, r, zr + drum, r * 0.92, 8, 2)
}
const cornerX = (AX + CXI) / 2
for (const s of [-1, 1]) {
  pd(s * cornerX, (AY0 + CY0I) / 2, 2.7, RL, 0)
  pd(s * cornerX, (AY1 + HY0) / 2, 2.9, RS, 0)
  for (let i = 0; i < 5; i++) pd(s * cornerX, AY1 - (i + 0.5) * LB, 2.6, RL, 0)
}
for (let i = 0; i < 7; i++) {
  const x = -AX + (i + 0.5) * SEB
  pd(x, (AY0 + CY0I) / 2, 2.7, RL, 0)
  if (i === 3) pd(x, (AY1 + HY0) / 2, 3.4, RS, 2.0)
  else pd(x, (AY1 + HY0) / 2, 2.9, RS, 0)
}

// The fountain at the centre of the court: a marble box under a lead roof.
const FY = (AY0 + AY1) / 2
box(stone, null, -1.5, 1.5, FY - 2, FY + 2, 0, 2.8, 0.2)
prism(lead, null, [[-1.9, FY - 2.4], [1.9, FY - 2.4], [1.9, FY + 2.4], [-1.9, FY + 2.4]], 2.8, 3.1)
for (const [a, b, c] of [[[-1.9, FY - 2.4], [1.9, FY - 2.4], [0, FY]], [[1.9, FY - 2.4], [1.9, FY + 2.4], [0, FY]], [[1.9, FY + 2.4], [-1.9, FY + 2.4], [0, FY]], [[-1.9, FY + 2.4], [-1.9, FY - 2.4], [0, FY]]] as [number, number][][]) {
  const A: V3 = [a[0], a[1], 3.1], B: V3 = [b[0], b[1], 3.1], C: V3 = [c[0], c[1], 4.6]
  const m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
  tri(lead, A, B, C, norm([m[0] - c[0], m[1] - c[1], 1.6]))
}

// ---------------------------------------------------------------------------
// Minarets. The two at the prayer hall end have three balconies and stand
// 76 m to the tip of the cap; the two at the far corners two balconies and
// 56 m. Drawn about 1.5 times their real girth, so they hold at map scale.

function minaret(x: number, y: number, balconies: number[], shaftTop: number, capTop: number) {
  const SR = 2.0, BR = 3.6, n = 10
  box(stone, trim, x - 2.3, x + 2.3, y - 2.3, y + 2.3, 0, 12.4, 0.35)
  // Shaft from the base to the cap, with a slimmer upper part.
  lathe(stone, x, y, [[SR, 12.4], [SR, balconies[0]]], n, { phase: 0.3 })
  for (let i = 0; i < balconies.length; i++) {
    const zb = balconies[i], zn = i + 1 < balconies.length ? balconies[i + 1] : shaftTop
    const r = i + 1 < balconies.length ? SR : SR - 0.25
    // Corbel, parapet and its top, then the shaft on to the next one.
    lathe(trim, x, y, [[SR, zb], [BR, zb + 1.6], [BR, zb + 3.0], [r, zb + 3.0]], n, { phase: 0.3 })
    lathe(stone, x, y, [[r, zb + 3.0], [r, zn]], n, { phase: 0.3 })
  }
  const ch = capTop - shaftTop
  lathe(lead, x, y, [[SR - 0.25, shaftTop], [SR + 0.1, shaftTop + 0.4], [SR * 0.62, shaftTop + 0.3 * ch], [0, capTop]], n, { phase: 0.3 })
  lathe(gilt, x, y, [[0.22, capTop - 0.3], [0.4, capTop + 0.5], [0.12, capTop + 1.0], [0, capTop + 2.1]], 6, { smooth: true })
}
for (const s of [-1, 1]) {
  minaret(s * 31.5, -4.5, [40.5, 47.6, 55.6], 65.5, 76.5)
  minaret(s * 30.0, -55.0, [30.3, 38.2], 45.5, 55.0)
}

// ---------------------------------------------------------------------------

const lit = (base: number) => (p: V3, n: V3): number => (n[2] > 0.85 ? 0.4 : 1) * base * (p[2] > 60 ? 0.85 : 1)
const parts = [
  { part: stone, material: { ...finish('limestone', 0xe4e0d5), floodlight: lit(0.9) } },
  { part: trim, material: { ...PALETTE.trim, color: 0xf1ede3, floodlight: lit(0.9) } },
  { part: lead, material: { ...PALETTE.roof, color: 0xa3aebb, floodlight: lit(0.75) } },
  { part: glaze, material: PALETTE.window },
  { part: gilt, material: finish('gilt', 0xcaa452, 0.5) },
  { part: portal, material: { name: 'entrance', color: 0x7b746a, roughness: 0.85 } },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
for (const { part, material } of parts) console.log(material.name, part.triangles)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Süleymaniye Mosque', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  bearing: 137.6, osm: 'relation/1564032', height: 78.6,
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/istanbul-suleymaniye.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
