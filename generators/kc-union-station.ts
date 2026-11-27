/**
 * Kansas City Union Station — original procedural geometry, CC0-1.0.
 * bun generators/kc-union-station.ts
 *
 * Jarvis Hunt, opened 1914. Map frame: x along Pershing Road (east-north-
 * east), y to the rear over the tracks, z up, metres; placed at bearing
 * 342.3° (the head house's long axis runs 72.3° in OSM and in the 2020
 * lidar). The great front faces SSE onto Pershing Road and the Liberty
 * Memorial; the tracks are behind it to the north. Origin: the centre of
 * the lidar crop (-94.58567, 39.08516), 4 m from the outline's centroid.
 *
 * Identity, from the photos:
 *  1. the Grand Hall's south front: three great round-headed windows, each
 *     in a deep arched recess, between two pairs of giant columns on tall
 *     pedestals, solid end bays with a single column each, a frieze and
 *     heavy cornice, and an attic with raised corner blocks;
 *  2. the hall's low tiled gable roof, ridge along the front, three broad
 *     ribs, stone pediments on the east and west ends;
 *  3. the long, lower three-storey wings with hipped tile edges, ending in
 *     taller pavilions with two columns in antis;
 *  4. behind, the North Waiting Room over the platforms (a gabled upper hall
 *     on a long two-storey block) and the Science City block with its row of
 *     hipped skylight roofs;
 *  5. pale grey-buff limestone throughout, floodlit at night.
 *
 * What the model owns: the whole OSM outline way/23770231 (head house,
 * North Waiting Room, the Science City block, the west annex and the east
 * connector, all one way in OSM) and the four building:parts inside it.
 * The Gottlieb Planetarium (way/183370431, against the west side), the
 * parking garage (way/538856003), Two Pershing Square and the Link
 * skywalk are separate buildings and stay the map's.
 *
 * Evidence:
 *  - OSM: outline way/23770231 (building=train_station, 5 levels, no
 *    height); parts way/1214640382 (the Grand Hall, 64 × 36 m), 1214640380,
 *    1214640381, 1214640383 (small, no tags). Plan read in this frame: hall
 *    x −25.5…55.2 (axis x 14.85), front y −71.8, rear −24.5; column
 *    pedestals out to y −76.5; wings to x −62.2 / 92.7; west annex
 *    x −95.3…−62.2; North Waiting Room x −11.1…39.2 to y 102; Science City
 *    x −46.7…−11.1 to y 88.3.
 *  - Lidar, measured: USGS 3DEP MO_FEMANRCS_1_2020 (2020 flight), 1 m grid
 *    read in this frame. Model z = lidar height above ground_min − 1.0 m,
 *    so z 0 is the track level behind the station (the lowest ground under
 *    the outline; Mapterhorn agrees) and Pershing Road in front is z 7.1.
 *    Hall attic 37.9, roof ridge 43.6 (at y −48, the hall's mid-depth),
 *    gable pediment peaks 46.0, corner blocks 40.1; wings 21–23; pavilions
 *    25.8; west annex 13 (penthouse 15.3); North Waiting Room block 15,
 *    upper hall eaves 24 and ridge 28.2 at x ≈ 12; Science City 16.5 to
 *    roof bays ≈ 20.6, seven bays at ≈ 12 m pitch; east connector 15.
 *  - Measured from Antony-22's head-on photo (2025b, scaled by the hall's
 *    OSM width): cornice 25.9 m above the street, attic 30.8; arch openings
 *    9.5 m wide, springing 12.9 m, so 17.65 m to the crown (drawn as true
 *    semicircles); archivolts 14.3 m wide; column pairs ≈ 6.2 m, columns
 *    ≈ 2.9 m thick on pedestals 3.4 m tall, capitals at ≈ 21 m; wing
 *    cornice ≈ 12 m and hip tops ≈ 15 m above the street.
 *  - Published: opened 1914, architect Jarvis Hunt; Grand Hall ceiling
 *    95 ft (Wikipedia, "Kansas City Union Station").
 *  - Estimated: window sizes and counts on the wings, the pavilion porticos,
 *    the North Waiting Room's clerestory and north front (from Antony-22's
 *    2025e photo from the tracks), the hall's end lunettes and its three
 *    rear arched windows (only partly seen, in 2025d, over the platform
 *    stairs), the canopies (from the from-the-tower photo).
 *  - Simplified: frieze roundels, banners, the clock, column fluting and
 *    capitals, balustrades and the areaways along the wings are left out;
 *    the hall's corner blocks are plain boxes.
 *
 * Front faces sink into Pershing Road's ground (z 0–7.1 is below it), as
 * the frame contract asks; facade detail starts at the street (z 7.1).
 *
 * Night: the whole Pershing front, hall and wings, is floodlit, and the
 * great windows glow (RuralResurrection's 2026 night photo); the stone
 * carries a `_FLOODLIGHT` wash strongest on the front, the windows are
 * `window`, the Science City skylights `glass` and stay dark.
 *
 * Photos (Wikimedia Commons, evidence): Kansas City Union Station
 * 2025a/b/c/d/e.jpg (Antony-22, CC BY-SA 4.0); Kansas City Union Station,
 * from the tower (14635653101).jpg (smallcurio, CC BY 2.0); Views from
 * Liberty Memorial 6120.JPG (Dual Freq, CC BY 3.0); Union Station in Kansas
 * City at Night.jpg (RuralResurrection, CC BY 4.0); Union Station Kansas
 * City floor plan.jpg (John A. Droege, 1916, public domain). USGS NAIP for
 * the roof plan. No look-only sources; no commercial imagery.
 *
 * Doubts: the assignment called the arched front "north"; it faces SSE
 * (photos, NAIP, the floor plan). The rear of the west wing and the
 * Science City block's west face are only seen far off (6120); the hall's
 * rear windows are a guess from a partial view.
 */
import { Part, writeGlb, type V3 } from './mesh'

// ---------------------------------------------------------------------------
// Small geometry kit (map frame: x along Pershing Road, y to the rear, z up).

type P2 = [number, number]
const add3 = (a: V3, b: V3, k = 1): V3 => [a[0] + b[0] * k, a[1] + b[1] * k, a[2] + b[2] * k]
const crs = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const sub3 = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]

/** A triangle / quad wound so it faces `want`. */
function tf(p: Part, a: V3, b: V3, c: V3, want: V3) {
  if (dot(crs(sub3(b, a), sub3(c, a)), want) >= 0) p.tri(a, b, c)
  else p.tri(a, c, b)
}
function qf(p: Part, a: V3, b: V3, c: V3, d: V3, want: V3) {
  tf(p, a, b, c, want)
  tf(p, a, c, d, want)
}

/**
 * A box with its top edge chamfered by `bev`. Sides listed in `skip`
 * ('s' -y, 'e' +x, 'n' +y, 'w' -x) are left open where another mass abuts.
 */
function box(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, bev = 0, skip = '') {
  const b = Math.min(bev, (x1 - x0) / 3, (y1 - y0) / 3, (z1 - z0) / 2)
  const zt = z1 - b
  const sides: [string, V3, V3, V3][] = [
    ['s', [x0, y0, 0], [x1, y0, 0], [0, -1, 0]],
    ['e', [x1, y0, 0], [x1, y1, 0], [1, 0, 0]],
    ['n', [x1, y1, 0], [x0, y1, 0], [0, 1, 0]],
    ['w', [x0, y1, 0], [x0, y0, 0], [-1, 0, 0]],
  ]
  for (const [k, a, c, n] of sides) {
    if (!skip.includes(k)) qf(p, [a[0], a[1], z0], [c[0], c[1], z0], [c[0], c[1], zt], [a[0], a[1], zt], n)
    if (b > 0) {
      // The chamfer's ends pull in along the edge too, so neighbours meet on the diagonal.
      const ux = Math.sign(c[0] - a[0]), uy = Math.sign(c[1] - a[1])
      const ia: V3 = [a[0] - n[0] * b + ux * b, a[1] - n[1] * b + uy * b, z1]
      const ic: V3 = [c[0] - n[0] * b - ux * b, c[1] - n[1] * b - uy * b, z1]
      qf(p, [a[0], a[1], zt], [c[0], c[1], zt], ic, ia, [n[0], n[1], 1])
    }
  }
  qf(p, [x0 + b, y0 + b, z1], [x1 - b, y0 + b, z1], [x1 - b, y1 - b, z1], [x0 + b, y1 - b, z1], [0, 0, 1])
}

/** A smooth-shaded cylinder standing on `c`, `seg` sides, no caps. */
function cyl(p: Part, c: V3, r: number, h: number, seg = 12) {
  for (let i = 0; i < seg; i++) {
    const a0 = (i / seg) * Math.PI * 2, a1 = ((i + 1) / seg) * Math.PI * 2
    const n0: V3 = [Math.cos(a0), Math.sin(a0), 0], n1: V3 = [Math.cos(a1), Math.sin(a1), 0]
    const b0 = add3(c, n0, r), b1 = add3(c, n1, r)
    const t0: V3 = [b0[0], b0[1], b0[2] + h], t1: V3 = [b1[0], b1[1], b1[2] + h]
    p.tri(b0, b1, t1, undefined, undefined, undefined, [n0, n1, n1])
    p.tri(b0, t1, t0, undefined, undefined, undefined, [n0, n1, n0])
  }
}

// ---------------------------------------------------------------------------
// Facades: a wall plane with `o` its left-bottom corner seen from outside,
// `u` along it to the right. (s, z, d) → o + u·s + z·up + n·d, d outward.

type Face = { o: V3; u: V3; n: V3 }
const face = (o: V3, u: V3): Face => ({ o, u, n: [u[1], -u[0], 0] })
const at = (F: Face, s: number, z: number, d = 0): V3 =>
  [F.o[0] + F.u[0] * s + F.n[0] * d, F.o[1] + F.u[1] * s + F.n[1] * d, F.o[2] + z]

/** An opening: rectangle or round-headed (semicircle on its jambs). */
type Hole = { s0: number; s1: number; lo: number; hi: number; arch?: boolean }
const ARC = 10
/** Outline points, counter-clockwise seen from outside. */
function outline(h: Hole): P2[] {
  if (!h.arch) return [[h.s0, h.lo], [h.s1, h.lo], [h.s1, h.hi], [h.s0, h.hi]]
  const r = (h.s1 - h.s0) / 2, sc = (h.s0 + h.s1) / 2, sp = h.hi - r
  const pts: P2[] = [[h.s0, h.lo], [h.s1, h.lo]]
  for (let k = 0; k <= ARC; k++) pts.push([sc + r * Math.cos((k * Math.PI) / ARC), sp + r * Math.sin((k * Math.PI) / ARC)])
  return pts
}

/** A flat panel on the wall (d just proud of it), e.g. a window. */
function panel(p: Part, F: Face, h: Hole, d = 0.05) {
  const pts = outline(h).map(([s, z]) => at(F, s, z, d))
  for (let i = 1; i < pts.length - 1; i++) tf(p, pts[0], pts[i], pts[i + 1], F.n)
}

/** Wall area [s0,s1]×[z0,z1] at depth d, minus the holes (which must lie inside it). */
function wall(p: Part, F: Face, s0: number, s1: number, z0: number, z1: number, holes: Hole[] = [], d = 0) {
  const rect = (a: number, b: number, c: number, e: number) => {
    if (b - a < 1e-6 || e - c < 1e-6) return
    qf(p, at(F, a, c, d), at(F, b, c, d), at(F, b, e, d), at(F, a, e, d), F.n)
  }
  let last = s0
  for (const h of [...holes].sort((a, b) => a.s0 - b.s0)) {
    rect(last, h.s0, z0, z1)
    rect(h.s0, h.s1, z0, h.lo)
    if (!h.arch) rect(h.s0, h.s1, h.hi, z1)
    else {
      const pts = outline(h).slice(2)
      for (let k = 0; k < pts.length - 1; k++) {
        const [a, b] = [pts[k + 1], pts[k]] // left to right
        qf(p, at(F, a[0], a[1], d), at(F, b[0], b[1], d), at(F, b[0], z1, d), at(F, a[0], z1, d), F.n)
      }
    }
    last = h.s1
  }
  rect(last, s1, z0, z1)
}

/** The reveal of a hole: its sides from depth d0 back to d1 (d1 < d0). */
function reveal(p: Part, F: Face, h: Hole, d0: number, d1: number) {
  const pts = outline(h)
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i], b = pts[(i + 1) % pts.length]
    const inward: P2 = [-(b[1] - a[1]), b[0] - a[0]]
    const want = add3([F.u[0] * inward[0], F.u[1] * inward[0], inward[1]], [0, 0, 0])
    qf(p, at(F, a[0], a[1], d0), at(F, b[0], b[1], d0), at(F, b[0], b[1], d1), at(F, a[0], a[1], d1), want)
  }
}

/** Fill a convex hole outline at depth d (a window or a recess back). */
function back(p: Part, F: Face, h: Hole, d: number) {
  const pts = outline(h).map(([s, z]) => at(F, s, z, d))
  for (let i = 1; i < pts.length - 1; i++) tf(p, pts[0], pts[i], pts[i + 1], F.n)
}

/** A bar on a face from (s0,z0) to (s1,z1), standing `t` proud of depth d. */
function bar(p: Part, F: Face, s0: number, s1: number, z0: number, z1: number, d: number, t: number) {
  const up: V3 = [0, 0, 1], dn: V3 = [0, 0, -1], r = F.u, l: V3 = [-F.u[0], -F.u[1], 0]
  qf(p, at(F, s0, z0, d + t), at(F, s1, z0, d + t), at(F, s1, z1, d + t), at(F, s0, z1, d + t), F.n)
  qf(p, at(F, s0, z1, d), at(F, s1, z1, d), at(F, s1, z1, d + t), at(F, s0, z1, d + t), up)
  qf(p, at(F, s0, z0, d), at(F, s1, z0, d), at(F, s1, z0, d + t), at(F, s0, z0, d + t), dn)
  qf(p, at(F, s1, z0, d), at(F, s1, z1, d), at(F, s1, z1, d + t), at(F, s1, z0, d + t), r)
  qf(p, at(F, s0, z0, d), at(F, s0, z1, d), at(F, s0, z1, d + t), at(F, s0, z0, d + t), l)
}

/** A gabled prism over [x0,x1]×[y0,y1]: eaves at ze, ridge at zr, ridge along x or y. */
function gable(p: Part, x0: number, x1: number, y0: number, y1: number, ze: number, zr: number, alongX: boolean, ends = true, endPart = p) {
  if (alongX) {
    const ym = (y0 + y1) / 2
    qf(p, [x0, y0, ze], [x1, y0, ze], [x1, ym, zr], [x0, ym, zr], [0, -1, 1])
    qf(p, [x1, y1, ze], [x0, y1, ze], [x0, ym, zr], [x1, ym, zr], [0, 1, 1])
    if (ends) {
      tf(endPart, [x0, y0, ze], [x0, y1, ze], [x0, ym, zr], [-1, 0, 0])
      tf(endPart, [x1, y0, ze], [x1, y1, ze], [x1, ym, zr], [1, 0, 0])
    }
  } else {
    const xm = (x0 + x1) / 2
    qf(p, [x0, y1, ze], [x0, y0, ze], [xm, y0, zr], [xm, y1, zr], [-1, 0, 1])
    qf(p, [x1, y0, ze], [x1, y1, ze], [xm, y1, zr], [xm, y0, zr], [1, 0, 1])
    if (ends) {
      tf(endPart, [x0, y0, ze], [x1, y0, ze], [xm, y0, zr], [0, -1, 0])
      tf(endPart, [x0, y1, ze], [x1, y1, ze], [xm, y1, zr], [0, 1, 0])
    }
  }
}

/** A hipped band: from the rectangle's edge at z0 up and in by `inset` to z1, then a flat top. */
function hip(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, inset: number, lid = true) {
  const r = (i: number, z: number): V3[] => [[x0 + i, y0 + i, z], [x1 - i, y0 + i, z], [x1 - i, y1 - i, z], [x0 + i, y1 - i, z]]
  const a = r(0, z0), b = r(inset, z1)
  const ns: V3[] = [[0, -1, 1], [1, 0, 1], [0, 1, 1], [-1, 0, 1]]
  for (let i = 0; i < 4; i++) qf(p, a[i], a[(i + 1) % 4], b[(i + 1) % 4], b[i], ns[i])
  if (lid) qf(p, b[0], b[1], b[2], b[3], [0, 0, 1])
}

// ---------------------------------------------------------------------------
// Parts

const stone = new Part()   // Bedford limestone
const roof = new Part()    // pale grey roofs (the hall's tiled gable, hips, flat roofs)
const win = new Part()     // windows: glow at night
const glass = new Part()   // Science City skylights: dark at night
const canopy = new Part()  // the dark green-grey entrance canopies

// Heights: model z = lidar height above ground_min − 1.0 (z 0 = track level, the
// lowest ground under the outline). Pershing Road in front is z 7.1.
const G = 7.1
const CX = 14.85                 // the head house's axis of symmetry
const HX0 = -25.5, HX1 = 55.2    // Grand Hall ends
const HYF = -71.8, HYB = -24.5   // Grand Hall front and rear walls
const HYM = (HYF + HYB) / 2
const COR = G + 25.9             // top of the frieze, under the cornice
const CTOP = COR + 0.8           // cornice top
const ATT = 37.9                 // front and rear attic top (lidar 38.9)
const BLOCK = 40.1               // corner attic blocks (lidar 41)
const RIDGE = 43.6               // roof ridge (lidar 44.6)
const PED = 46.0                 // gable pediment peaks (lidar 47)
const W = HX1 - HX0              // 80.7

// --- Grand Hall front: three great round-headed windows in two-step arched
// recesses, between paired columns. s runs from the west corner.
const front = face([HX0, HYF, 0], [1, 0, 0])
const SP = G + 12.9              // springing line of both arch rings
const archC = [-21, 0, 21].map((d) => W / 2 + d)
const outer = archC.map((c): Hole => ({ s0: c - 7.15, s1: c + 7.15, lo: G, hi: SP + 7.15, arch: true }))
const inner = archC.map((c): Hole => ({ s0: c - 4.75, s1: c + 4.75, lo: G, hi: SP + 4.75, arch: true }))
const R1 = -1.2, R2 = -2.7       // depth of the archivolt recess and of the glazing
wall(stone, front, 0, W, 0, COR, outer)
for (let i = 0; i < 3; i++) {
  const o = outer[i], n = inner[i]
  // The archivolt: a splayed moulding from the outer arch down to the window arch,
  // so it shades as a recess even under flat light.
  const po = outline(o), pn = outline(n)
  for (let k = 1; k < po.length; k++) {
    const j = (k + 1) % po.length
    const ds = po[j][0] - po[k][0], dz = po[j][1] - po[k][1]
    const want = add3(front.n, [front.u[0] * -dz, front.u[1] * -dz, ds], 1 / Math.hypot(ds, dz))
    qf(stone, at(front, po[k][0], po[k][1], 0), at(front, po[j][0], po[j][1], 0),
      at(front, pn[j][0], pn[j][1], R1), at(front, pn[k][0], pn[k][1], R1), want)
  }
  reveal(stone, front, n, R1, R2)
  back(win, front, n, R2)
  // Bold steel glazing bars: two mullions and two transoms, stopped under the arch.
  const c = archC[i], m = 1.65, top = SP + Math.sqrt(4.75 ** 2 - (m + 0.2) ** 2) - 0.2
  for (const k of [-1, 1]) bar(stone, front, c + k * m - 0.17, c + k * m + 0.17, G, top, R2, 0.25)
  for (const z of [G + 4.2, SP]) bar(stone, front, n.s0, n.s1, z - 0.18, z + 0.18, R2, 0.25)
}
// Paired columns on tall pedestals between the arches.
for (const k of [-1, 1]) {
  const x = CX + k * 10.5
  box(stone, x - 3.4, x + 3.4, HYF - 3.6, HYF, 0, G + 3.4, 0.4, 'n')
  for (const j of [-1, 1]) cyl(stone, [x + j * 1.6, HYF - 1.9, G + 3.4], 1.45, 17.4, 12)
  box(stone, x - 3.3, x + 3.3, HYF - 3.4, HYF, G + 20.8, G + 22.2, 0.3, 'n')
}
// Single engaged columns at the inner edges of the end bays.
for (const s of [archC[0] - 8.6, archC[2] + 8.6]) {
  box(stone, HX0 + s - 1.4, HX0 + s + 1.4, HYF - 1.6, HYF, 0, G + 3.0, 0.3, 'n')
  cyl(stone, [HX0 + s, HYF - 0.3, G + 3.0], 1.1, 18.0, 10)
  box(stone, HX0 + s - 1.4, HX0 + s + 1.4, HYF - 1.5, HYF, G + 21.0, G + 22.2, 0.25, 'n')
}
// End bays: one window each, under the banners.
for (const s of [5.6, W - 5.6]) panel(win, front, { s0: s - 1.4, s1: s + 1.4, lo: G + 9.2, hi: G + 12.2 })
// Canopies over the two side entrances.
for (const c of [archC[0], archC[2]]) box(canopy, HX0 + c - 5.6, HX0 + c + 5.6, HYF - 4.4, HYF - R1 - 0.6, G + 3.9, G + 4.6, 0.2)

// --- Grand Hall: ends, rear, entablature, attic, pediments and roof.
const westEnd = face([HX0, HYB, 0], [0, -1, 0]), eastEnd = face([HX1, HYF, 0], [0, 1, 0])
const lunette: Hole = { s0: (HYB - HYF) / 2 - 3.2, s1: (HYB - HYF) / 2 + 3.2, lo: 24.4, hi: 31.4, arch: true }
for (const F of [westEnd, eastEnd]) {
  wall(stone, F, 0, HYB - HYF, 0, COR, [lunette])
  reveal(stone, F, lunette, 0, -0.8)
  back(win, F, lunette, -0.8)
}
// The rear wall rises over the North Waiting Room and Science City roofs;
// three round-headed windows echo the front (estimated, see doubts).
const rear = face([HX1, HYB, 0], [-1, 0, 0])
const rearArch = archC.map((c): Hole => ({ s0: W - c - 4.2, s1: W - c + 4.2, lo: 19.0, hi: 30.0, arch: true }))
wall(stone, rear, 0, W, 0, COR, rearArch)
for (const h of rearArch) { reveal(stone, rear, h, 0, -0.8); back(win, rear, h, -0.8) }
// Cornice, attic and corner blocks.
box(stone, HX0 - 0.8, HX1 + 0.8, HYF - 0.8, HYB + 0.8, COR, CTOP, 0.45)
for (const [y0, y1] of [[HYF + 0.2, HYF + 1.3], [HYB - 1.3, HYB - 0.2]]) box(stone, HX0 + 12, HX1 - 12, y0, y1, CTOP, ATT, 0.3)
for (const [x0, x1] of [[HX0 + 0.2, HX0 + 12.2], [HX1 - 12.2, HX1 - 0.2]]) {
  box(stone, x0, x1, HYF + 0.2, HYF + 7.5, CTOP, BLOCK, 0.45)
  box(stone, x0, x1, HYB - 7.5, HYB - 0.2, CTOP, BLOCK, 0.45)
}
// Gable pediments on the end walls, their raking tops just proud of the roof.
const rake = (y: number) => ATT + (PED - ATT) * (1 - Math.abs(y - HYM) / (HYM - HYF))
for (const [x0, x1] of [[HX0 + 0.3, HX0 + 1.9], [HX1 - 1.9, HX1 - 0.3]]) {
  const ya = HYF + 7.5, yb = HYB - 7.5
  const prof: P2[] = [[ya, CTOP], [yb, CTOP], [yb, rake(yb)], [HYM, PED], [ya, rake(ya)]]
  for (const [x, n] of [[x0, -1], [x1, 1]] as [number, number][]) {
    for (let i = 1; i < prof.length - 1; i++) tf(stone, [x, ...prof[0]] as V3, [x, ...prof[i]] as V3, [x, ...prof[i + 1]] as V3, [n, 0, 0])
  }
  for (let i = 1; i < prof.length; i++) {
    const a = prof[i], b = prof[(i + 1) % prof.length]
    qf(stone, [x0, a[0], a[1]], [x1, a[0], a[1]], [x1, b[0], b[1]], [x0, b[0], b[1]], [0, b[1] - a[1], -(b[0] - a[0])])
  }
}
// The tiled gable roof, ridge along the hall, three broad ribs across it.
const RX0 = HX0 + 1.9, RX1 = HX1 - 1.9, EAVE = 35.0
const ry = (y: number) => EAVE + (RIDGE - EAVE) * (1 - Math.abs(y - HYM) / (HYM - (HYF + 1.3)))
gable(roof, RX0, RX1, HYF + 1.3, HYB - 1.3, EAVE, RIDGE, true, false)
for (const k of [-1, 0, 1]) {
  const x = CX + k * 19.4, h = 0.7, t = 0.5
  for (const [ya, yb] of [[HYF + 1.3, HYM], [HYB - 1.3, HYM]]) {
    const A0: V3 = [x - h, ya, ry(ya) + t], A1: V3 = [x + h, ya, ry(ya) + t], B0: V3 = [x - h, yb, ry(yb) + t], B1: V3 = [x + h, yb, ry(yb) + t]
    qf(roof, A0, A1, B1, B0, [0, Math.sign(ya - yb), 3])
    qf(roof, [x - h, ya, ry(ya)], A0, B0, [x - h, yb, ry(yb)], [-1, 0, 0])
    qf(roof, [x + h, ya, ry(ya)], A1, B1, [x + h, yb, ry(yb)], [1, 0, 0])
  }
}

// --- Wings, end pavilions (mirrored about CX) and their windows.
const WF = -67.0, PF = -69.0, WB = -25.0      // wing front, pavilion front, rear
const WTOP = 19.2, PTOP = 22.2
const rows = [[G + 1.0, G + 4.0], [G + 5.4, G + 7.6], [G + 8.6, G + 10.6]]
for (const side of [-1, 1]) {
  const xa = CX + side * 40.35, xb = CX + side * 66.8, xc = CX + side * 77.35
  const [w0, w1] = side < 0 ? [xb, xa] : [xa, xb]
  const [p0, p1] = side < 0 ? [xc, xb] : [xb, xc]
  box(stone, w0, w1, WF, WB, 0, WTOP, 0, side < 0 ? 'e' : 'w')
  box(stone, w0 - 0.4, w1 + 0.4, WF - 0.4, WB + 0.4, WTOP, WTOP + 0.5, 0.25)
  hip(roof, w0 - 0.2, w1 + 0.2, WF - 0.2, WB + 0.2, WTOP + 0.5, 22.6, 3.0)
  box(stone, p0, p1, PF, WB, 0, PTOP, 0, side < 0 ? 'se' : 'sw')
  box(stone, p0 - 0.4, p1 + 0.4, PF - 0.4, WB + 0.4, PTOP, PTOP + 0.6, 0.3)
  box(stone, p0 + 0.3, p1 - 0.3, PF + 0.3, WB - 0.3, PTOP + 0.6, 24.2, 0.3)
  hip(roof, p0 + 0.3, p1 - 0.3, PF + 0.3, WB - 0.3, 24.2, 25.6, 2.4)
  // Wing fronts: seven bays, three storeys of punched windows over the street.
  const wf = face([w0, WF, 0], [1, 0, 0]), wl = w1 - w0, pitch = wl / 7
  for (let b = 0; b < 7; b++) for (const [lo, hi] of rows) {
    const s = pitch * (b + 0.5)
    panel(win, wf, { s0: s - 0.95, s1: s + 0.95, lo, hi })
  }
  // Wing rears over the tracks: four storeys (the west wing's is mostly behind Science City).
  const wr = face([w1, WB, 0], [-1, 0, 0])
  for (let b = 0; b < 7; b++) for (const [lo, hi] of [[1.6, 5.0], ...rows]) {
    const s = pitch * (b + 0.5), x = w1 - s
    if (x > -51.5 && x < 40) continue
    panel(win, wr, { s0: s - 0.95, s1: s + 0.95, lo, hi })
  }
  // Pavilion fronts: two columns in antis before a tall recessed window.
  const pf = face([p0, PF, 0], [1, 0, 0]), pw = p1 - p0, rc = pw / 2
  const rec: Hole = { s0: rc - 3.0, s1: rc + 3.0, lo: G, hi: G + 12.4 }
  wall(stone, pf, 0, pw, 0, PTOP, [rec])
  reveal(stone, pf, rec, 0, -1.4)
  back(win, pf, rec, -1.4)
  for (const j of [-1, 1]) cyl(stone, [p0 + rc + j * 1.4, PF + 0.6, G], 0.62, 12.4, 10)
  // Pavilion outer ends: windows in four bays (the west one above the annex roof only).
  const pe = side < 0 ? face([p0, WB, 0], [0, -1, 0]) : face([p1, PF, 0], [0, 1, 0])
  const el = WB - PF
  for (let b = 0; b < 6; b++) for (const [lo, hi] of [[1.6, 5.0], ...rows]) {
    if (side < 0 && lo < 14) continue
    const s = (el / 6) * (b + 0.5)
    panel(win, pe, { s0: s - 0.95, s1: s + 0.95, lo, hi })
  }
}

// --- West annex (lower, plainer block west of the west pavilion; lidar 14).
{
  const x0 = -95.3, x1 = CX - 77.35, y0 = -57.8, y1 = -25.3
  box(stone, x0, x1, y0, y1, 0, 13.0, 0.35, 'e')
  box(stone, -84, -76, -48, -40, 13.0, 15.3, 0.3)
  const af = face([x0, y0, 0], [1, 0, 0]), n = 7, pitch = (x1 - x0) / n
  for (let b = 0; b < n; b++) panel(win, af, { s0: pitch * (b + 0.5) - 1.1, s1: pitch * (b + 0.5) + 1.1, lo: G + 1.4, hi: G + 4.4 })
}

// --- North Waiting Room: the long low block over the platforms and the
// gabled upper hall rising out of it (lidar: block 16, eaves 25, ridge 29.2).
const NX0 = -11.1, NX1 = 39.2, NY1 = 102.0, LOW = 15.0
box(stone, NX0, NX1, HYB, NY1, 0, LOW, 0.4, 's')
box(stone, 39.2, HX1, HYB, -7.7, 0, LOW, 0.4, 's')            // east connector
box(stone, -51.0, -46.7, -24.8, 20.6, 0, 5.0, 0.25, 'e')       // low west edge
{
  const ux0 = -0.5, ux1 = 25.0, uy1 = 88.3, EAV = 24.0, RID = 28.2
  box(stone, ux0, ux1, HYB, uy1, LOW, EAV, 0.0, 's')
  box(stone, ux0 - 0.4, ux1 + 0.4, HYB, uy1 + 0.4, EAV, EAV + 0.5, 0.25)
  gable(roof, ux0 - 0.4, ux1 + 0.4, HYB, uy1 + 0.4, EAV + 0.5, RID, false, true, stone)
  // Clerestory windows down both long sides, a three-light lunette in the north gable end.
  const ew = face([ux1, HYB, 0], [0, 1, 0]), ww = face([ux0, uy1, 0], [0, -1, 0]), L = uy1 - HYB
  for (const F of [ew, ww]) for (let b = 0; b < 8; b++) {
    const s = (L / 8) * (b + 0.5)
    panel(win, F, { s0: s - 2.0, s1: s + 2.0, lo: 17.0, hi: 22.6, arch: true })
  }
  const nf = face([ux1, uy1, 0], [-1, 0, 0]), nw = ux1 - ux0
  panel(win, nf, { s0: nw / 2 - 3.6, s1: nw / 2 + 3.6, lo: 17.2, hi: 22.8, arch: true })
  // The block's north front on the platforms: arched doors below, a row of windows above.
  const bn = face([NX1, NY1, 0], [-1, 0, 0]), bw = NX1 - NX0
  for (const d of [-12, 0, 12]) panel(win, bn, { s0: bw / 2 + d - 1.8, s1: bw / 2 + d + 1.8, lo: 0.6, hi: 7.0, arch: true })
  for (let b = 0; b < 8; b++) { const s = (bw / 8) * (b + 0.5); panel(win, bn, { s0: s - 1.0, s1: s + 1.0, lo: 9.4, hi: 12.2 }) }
  // East side of the block, above the platforms.
  const be = face([NX1, -7.7, 0], [0, 1, 0]), bl = NY1 + 7.7
  for (let b = 0; b < 16; b++) for (const [lo, hi] of [[1.8, 5.2], [9.4, 12.2]]) {
    const s = (bl / 16) * (b + 0.5)
    panel(win, be, { s0: s - 1.0, s1: s + 1.0, lo, hi })
  }
}

// --- Science City block (west of the North Waiting Room): a long
// block with seven hipped roof bays, each with a skylight along its ridge.
{
  const x0 = -46.7, x1 = NX0, y0 = WB, y1 = 88.3, EAV = 16.5
  box(stone, x0, x1, y0, y1, 0, EAV, 0.3, 'se')
  const bays = 7, ys = 4.0, pitch = (y1 - ys) / bays
  for (let b = 0; b < bays; b++) {
    const a = ys + pitch * b + 0.3, c = ys + pitch * (b + 1) - 0.3, m = (a + c) / 2
    const xa = x0 + 1.0, xb = x1 - 1.0, inset = (c - a) / 2, RZ = 20.6
    const e0: V3 = [xa, a, EAV], e1: V3 = [xb, a, EAV], e2: V3 = [xb, c, EAV], e3: V3 = [xa, c, EAV]
    const r0: V3 = [xa + inset, m, RZ], r1: V3 = [xb - inset, m, RZ]
    const k = 0.72, lerp3 = (p: V3, q: V3): V3 => [p[0] + (q[0] - p[0]) * k, p[1] + (q[1] - p[1]) * k, p[2] + (q[2] - p[2]) * k]
    // Long slopes: roof up to 72 %, then a glass strip to the ridge.
    for (const [p, q, rA, rB, n] of [[e0, e1, r0, r1, [0, -1, 1]], [e2, e3, r1, r0, [0, 1, 1]]] as [V3, V3, V3, V3, V3][]) {
      const pa = lerp3(p, rA), qa = lerp3(q, rB)
      qf(roof, p, q, qa, pa, n)
      qf(glass, pa, qa, rB, rA, n)
    }
    tf(roof, e1, e2, r1, [1, 0, 1])
    tf(roof, e3, e0, r0, [-1, 0, 1])
  }
  qf(roof, [x0 + 0.3, y0, EAV + 0.03], [x1, y0, EAV + 0.03], [x1, ys, EAV + 0.03], [x0 + 0.3, ys, EAV + 0.03], [0, 0, 1])
  // Its east face shows above nothing (it abuts the waiting room); the west face carries
  // two bands of tall windows over the parking lot.
  const sw = face([x0, y1, 0], [0, -1, 0]), L = y1 - 20.6
  for (let b = 0; b < 10; b++) {
    const s = (L / 10) * (b + 0.5)
    panel(win, sw, { s0: s - 1.6, s1: s + 1.6, lo: 3.0, hi: 7.5 })
    panel(win, sw, { s0: s - 1.6, s1: s + 1.6, lo: 9.5, hi: 14.0 })
  }
}

// ---------------------------------------------------------------------------
// Materials. Colours from the daylight photos (2025b, from-the-tower),
// pulled to the palette's lightness. At night the whole Pershing front is
// floodlit (RuralResurrection's 2026 night photo) and the great windows glow.

const lit = (p: V3, n: V3): number => {
  if (n[2] > 0.7) return 0.12
  if (n[1] < -0.5 && p[1] < -60) return 0.9
  if (p[1] < -20) return 0.45
  return 0.15
}
const parts = [
  { part: stone, material: { name: 'limestone', color: 0xddd3c1, roughness: 0.85, floodlight: lit } },
  { part: roof, material: { name: 'roof-tile', color: 0xc3bfb5, roughness: 0.85 } },
  { part: win, material: { name: 'window', color: 0x5f7180, roughness: 0.35 } },
  { part: glass, material: { name: 'glass', color: 0xa4c4d9, roughness: 0.24 } },
  { part: canopy, material: { name: 'canopy', color: 0x5f6e68, roughness: 0.7 } },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Kansas City Union Station', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  bearing: 342.3, osm: 'way/23770231', footprint: [188, 179], height: PED,
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/kc-union-station.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
