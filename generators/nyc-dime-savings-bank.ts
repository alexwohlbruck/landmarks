/**
 * Dime Savings Bank of Brooklyn, 9 DeKalb Avenue — procedural, CC0-1.0, no
 * textures.
 * bun generators/nyc-dime-savings-bank.ts
 *
 * Also a small kit for nyc-brooklyn-borough-hall and the other Brooklyn
 * civic models (edge frames, per-edge offsets, classical columns, a
 * pediment); the bank is only built when this file is run directly.
 *
 * Map frame: x east, y north, z up, metres; bearing 0, built straight from
 * the OSM coordinates. Anchor: area centroid of the OSM building:part
 * way/248156228 (-73.9825285, 40.6902679).
 *
 * What it is: Mowbray & Uffinger's white marble savings bank of 1906–08,
 * enlarged and given its dome by Halsey, McCormack & Helmer in 1931–32. The
 * plan fills a wedge between DeKalb Avenue (south) and Fleet Street (north-
 * west), with the acute corner cut off by a tetrastyle Ionic portico under a
 * pediment (clock, two reclining figures) facing Albee Square to the
 * south-west. Ionic colonnades run along both street fronts in front of
 * recessed walls with tall windows; a plain blocking course sits on the
 * cornice and a windowed attic storey is set back behind it. On the attic
 * stands a six-sided drum faced in green copper with ornamental cresting,
 * and on that a low smooth marble dome. Since 2022 the Brooklyn Tower
 * (nyc-brooklyn-tower) rises from the lot behind it.
 *
 * Covers and replaces: the bank part way/248156228 and the dome part
 * way/700241894. Not the lot outline way/1229206093 or the tower part
 * way/1039403183, which nyc-brooklyn-tower replaces. Nothing is drawn
 * outside way/248156228 except the cornice lip (0.4 m) and the portico and
 * its steps, which stand out over the Albee Square side; the tower's hexagon
 * stays at least 0.8 m clear of it.
 *
 * Evidence
 * - OSM (measured): the part way/248156228, a wedge 57.4 m along DeKalb
 *   Avenue and 61.5 m along Fleet Street, with the 15.1 m portico face on the
 *   cut corner and a 2.8 m return at its north end; height=33.3. The dome
 *   part way/700241894, an 18-gon of radius 10.3 m centred 2.4 m south of
 *   where the lidar puts the dome.
 * - USGS lidar NY_NewYorkCity (2017; the bank is older, the tower newer, so
 *   the bank's roofs read clean). Street level about 12.1 m. Measured above
 *   it: the cornice's outer edge 14.1–14.3 m; the blocking course behind it
 *   17.0 m, 1.0–2.5 m in from the face; the attic roof 20.0–20.3 m from
 *   3.2 m in, with a 21.2 m coping round its edge; the portico pediment
 *   14.4 m at its ends and 17.4 m near the apex (drawn 17.9: the photos
 *   give a 25–27° rake over the 15 m face, and the apex cells are sparse); the drum a hexagon (corners
 *   east and west) 25.7 m across the flats, centred (1.0, -0.9), its top
 *   25.6 m; the dome rising from about 26.8 m at radius 11.6 to 33.5 m
 *   (matching OSM's 33.3).
 * - Published (Wikipedia, "Dime Savings Bank of Brooklyn"; NYC Landmarks
 *   Preservation Commission designation report, 1994): white marble; Ionic
 *   portico and colonnades; the 1932 enlargement and dome.
 * - Photos (Wikimedia Commons), from the south-west and west unless noted:
 *   "Dime Savings Bank Brooklyn.jpg" (Beyond My Ken, CC BY-SA 4.0);
 *   "Dime Savings Bank - Brooklyn, NY - DSC07874.JPG" and "…DSC07877.JPG"
 *   (Daderot, CC0); "Dime Savings Bank of New York, Sept 2017.jpg"
 *   (Thomson200, CC0), from the west along Fleet Street; "Dime Savings Bank
 *   Building 001.jpg" and "005.jpg" (Kidfly182, CC BY-SA 4.0 / CC BY 4.0),
 *   the pediment; "Dime Savings Bank, City Point.jpg" (Nycgirl1997, CC BY-SA
 *   4.0); "Dime Savings Bank.jpg" (Blue23679, CC BY-SA 4.0), from Albee
 *   Square; "Downtown Brooklyn December 2021 016.jpg" (Kidfly182, CC BY-SA
 *   4.0), with the tower behind.
 * - Published (Wikipedia): the portico's face 46.90 ft (14.3 m) wide.
 * - From the photos: the colonnades' column base 1.3 m (on pedestals),
 *   capitals 12.1 m (photo proportion against the lidar cornice), diameter
 *   about 1.25 m; the portico's four giant columns 1.3–13.9 m (1.45 m
 *   across), its deep entablature to 16.9 m and pediment apex 20.0 m, level
 *   with the attic top, the portico standing 3.2 m out from the cut corner
 *   (the lidar's portico readings are lower, 17.4 m at the apex, but every
 *   street photo shows it rising well above the wings' cornice); the green
 *   copper cresting 1.0 m high along the blocking course and round the
 *   drum's base; a solid corner bay with one narrow window either side of the
 *   portico; the attic's small windows; the copper drum's colour.
 *
 * Estimated: the colonnade spacing (about 3.7 m) and the lengths of the
 * solid end bays (5 m), counted from oblique photos; the attic window
 * rhythm; the drum's windows; the recess of the walls behind the columns
 * (1.6 m, the portico 2.6 m).
 *
 * Doubts: no licensed photo shows the north-east walls, now against the
 * tower's podium; they are drawn plain. The north end of the Fleet Street
 * front is only seen far off.
 *
 * Simplified: Ionic capitals are a flared bell and a wide abacus; the
 * pediment's figures are left out, its clock is a copper disc; no
 * lettering, lamps, flagpole or cresting ornament.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cbox, cylinder, rect, qf, tf } from './dc-white-house'
import { ccw, lathe, pcap, poffset, pslab, pwalls, saveModel, type XY } from './dc-nga-west'

// ===========================================================================
// Kit, shared with nyc-brooklyn-borough-hall and the Brooklyn civic models.

/** A frame on the segment a→b: `at(s, d, z)` is s along it, d out from it (to the right of a→b), z up. */
export function edgeFrame(a: XY, b: XY) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
  const n: XY = [u[1], -u[0]] // right of a→b: outward for a counter-clockwise ring
  const at = (s: number, d: number, z: number): V3 => [a[0] + u[0] * s + n[0] * d, a[1] + u[1] * s + n[1] * d, z]
  const xy = (s: number, d: number): XY => [a[0] + u[0] * s + n[0] * d, a[1] + u[1] * s + n[1] * d]
  return { L, u, n, at, xy }
}

/** Offset each edge of a counter-clockwise ring outward by d[i] (negative: inward), mitred. */
export function offsetEdges(ring: XY[], d: number[]): XY[] {
  const n = ring.length
  const lines = ring.map((a, i) => {
    const f = edgeFrame(a, ring[(i + 1) % n])
    return { p: f.xy(0, d[i]), u: f.u }
  })
  return ring.map((_, i) => {
    const A = lines[(i + n - 1) % n], B = lines[i]
    const den = A.u[0] * B.u[1] - A.u[1] * B.u[0]
    if (Math.abs(den) < 1e-9) return B.p
    const t = ((B.p[0] - A.p[0]) * B.u[1] - (B.p[1] - A.p[1]) * B.u[0]) / den
    return [A.p[0] + A.u[0] * t, A.p[1] + A.u[1] * t] as XY
  })
}

/** A box along a→b from s0 to s1, d0 to d1 out from the line, z0 to z1; bevelled top. */
export function edgeBox(p: Part, a: XY, b: XY, s0: number, s1: number, d0: number, d1: number, z0: number, z1: number, bevel = 0, top: Part | boolean = true, bottom = false) {
  const f = edgeFrame(a, b)
  pslab(p, [f.xy(s0, d0), f.xy(s1, d0), f.xy(s1, d1), f.xy(s0, d1)], z0, z1, bevel, top, bottom)
}

/** A flat panel on the face of the line a→b (outward side), s0..s1, z0..z1, d proud of it. */
export function edgePanel(p: Part, a: XY, b: XY, s0: number, s1: number, z0: number, z1: number, d = 0.05) {
  const f = edgeFrame(a, b)
  p.quad(f.at(s0, d, z0), f.at(s1, d, z0), f.at(s1, d, z1), f.at(s0, d, z1))
}

/**
 * A classical column: square plinth, tapering round shaft, a flared bell
 * and a wide abacus (an Ionic capital read from afar), z0..z1.
 */
export function classicalColumn(p: Part, c: XY, r: number, z0: number, z1: number, seg = 10) {
  const pl = r * 1.3, cap = Math.max(0.5, r * 0.75)
  cbox(p, rect(c[0] - pl, c[0] + pl, c[1] - pl, c[1] + pl), z0, z0 + 0.45, { top: true })
  cylinder(p, c[0], c[1], r, z0 + 0.45, z1 - cap, seg, r * 0.86)
  cylinder(p, c[0], c[1], r * 0.86, z1 - cap, z1 - cap * 0.45, seg, r * 1.15)
  const ab = r * 1.4
  cbox(p, rect(c[0] - ab, c[0] + ab, c[1] - ab, c[1] + ab), z1 - cap * 0.45, z1, { bottom: true })
}

/**
 * A pediment on the face a→b (the line is the face of the tympanum), from
 * zb to the apex za, with a gable roof running `depth` back from the face.
 * The raking cornice stands `lip` proud; the tympanum is a shaded panel.
 */
export function pediment(stone: Part, shade: Part, roof: Part, a: XY, b: XY, zb: number, za: number, depth: number, lip = 0.45) {
  const f = edgeFrame(a, b), L = f.L, m = L / 2
  // tympanum wall and back gable
  tf(stone, f.at(0, 0, zb), f.at(L, 0, zb), f.at(m, 0, za), [f.n[0], f.n[1], 0])
  tf(stone, f.at(0, -depth, zb), f.at(L, -depth, zb), f.at(m, -depth, za), [-f.n[0], -f.n[1], 0])
  // the two roof slopes, overhanging by `lip`
  const zl = zb - lip * (za - zb) / m
  qf(roof, f.at(-lip, lip, zl), f.at(m, lip, za + 0.05), f.at(m, -depth, za + 0.05), f.at(-lip, -depth, zl), [-f.u[0], -f.u[1], 1])
  qf(roof, f.at(L + lip, lip, zl), f.at(m, lip, za + 0.05), f.at(m, -depth, za + 0.05), f.at(L + lip, -depth, zl), [f.u[0], f.u[1], 1])
  // raking cornice: a thick lip on the face, following both slopes
  const t = 0.55
  for (const [s0, s1] of [[-lip, m], [L + lip, m]] as [number, number][]) {
    const z0 = zl
    qf(stone, f.at(s0, lip, z0), f.at(s1, lip, za + 0.05), f.at(s1, lip, za + 0.05 - t), f.at(s0, lip, z0 - t), [f.n[0], f.n[1], 0])
    qf(stone, f.at(s0, 0, z0 - t), f.at(s1, 0, za + 0.05 - t), f.at(s1, lip, za + 0.05 - t), f.at(s0, lip, z0 - t), [0, 0, -1])
  }
  // the tympanum recess, in shade
  const inset = 1.0, h = (za - zb) - 0.9
  const half = (m - inset) * 0.95
  tf(shade, f.at(m - half, 0.03, zb + 0.25), f.at(m + half, 0.03, zb + 0.25), f.at(m, 0.03, zb + 0.25 + h * (half / m)), [f.n[0], f.n[1], 0])
}

/** Cut each corner of a ring back by c along both edges (the ring stays in order). */
export function chamferRing(ring: XY[], c: number): XY[] {
  const out: XY[] = []
  const n = ring.length
  for (let i = 0; i < n; i++) {
    const a = ring[(i + n - 1) % n], b = ring[i], d = ring[(i + 1) % n]
    const la = Math.hypot(a[0] - b[0], a[1] - b[1]), ld = Math.hypot(d[0] - b[0], d[1] - b[1])
    out.push([b[0] + (a[0] - b[0]) * c / la, b[1] + (a[1] - b[1]) * c / la])
    out.push([b[0] + (d[0] - b[0]) * c / ld, b[1] + (d[1] - b[1]) * c / ld])
  }
  return out
}

export { pslab, pcap, pwalls, poffset, lathe, ccw, saveModel, type XY }

// ===========================================================================
// The Dime Savings Bank.

function build() {
  const marble = new Part(), shade = new Part(), roof = new Part(), win = new Part(), copper = new Part()

  // OSM way/248156228, counter-clockwise from the north tip on Fleet Street.
  // The three-vertex notch at the east end (under 2 m) is dropped.
  const P: XY[] = [
    [2.42, 44.61], // 0 north tip, Fleet Street
    [-30.40, -7.35], // 1 Fleet Street meets the portico's return
    [-32.89, -8.54], // 2 portico, north end
    [-26.73, -22.28], // 3 portico, south end = DeKalb Avenue corner
    [30.69, -23.36], // 4 DeKalb Avenue, east end
    [31.79, -3.72], // 5 party wall with City Point
    [24.43, -4.98], // 6
    [10.73, 22.02], // 7 against the Brooklyn Tower's podium
    [11.93, 23.91], // 8
  ]
  const FLEET = 0, PORT = 2, DEKALB = 3
  const edge = (i: number) => [P[i], P[(i + 1) % P.length]] as [XY, XY]

  // Heights (lidar, above the street).
  const BASE = 1.3, CAP = 12.1, CORNICE = 14.3, BLOCK = 16.9, ATTIC = 20.1, COPING = 20.9
  const DRUM0 = 21.2, DRUM1 = 25.0, CREST = 25.6
  const RECESS = 1.6, CR = 0.62
  // The Albee Square portico (Wikipedia: face 46.90 ft = 14.3 m wide).
  const PW = 14.3, PROJ = 3.2, PCAP = 13.9, PCOR = 16.9, PAPEX = 20.0, PR = 0.72

  // ---- Podium and the walls behind the colonnades.
  pslab(marble, P, 0, BASE, 0.15, true)
  const d = P.map((_, i) => (i === FLEET || i === DEKALB ? -RECESS : 0))
  const core = offsetEdges(P, d)
  pwalls(marble, core, BASE, CAP)
  // the recessed walls read darker, in the colonnades' shade
  for (const i of [FLEET, DEKALB]) {
    const a = core[i], b = core[(i + 1) % core.length]
    edgePanel(shade, a, b, 0, edgeFrame(a, b).L, BASE, CAP, 0.02)
  }

  // ---- Street fronts: solid bays at both ends, Ionic columns between.
  function colonnade(i: number, cornerAtEnd: boolean) {
    const [a, b] = edge(i)
    const f = edgeFrame(a, b), L = f.L
    const CORNER = 5.6, END = 5.0
    const [c0, c1] = cornerAtEnd ? [END, L - CORNER] : [CORNER, L - END]
    // the solid bays fill the recess, each with one tall narrow window
    for (const [s0, s1] of [[0, c0], [c1, L]]) {
      edgeBox(marble, a, b, s0, s1, -RECESS - 0.05, 0, BASE, CAP, 0, false)
      const mid = (s0 + s1) / 2
      edgePanel(win, a, b, mid - 0.7, mid + 0.7, 3.2, 9.6)
    }
    const n = Math.round((c1 - c0) / 3.7), step = (c1 - c0) / n
    for (let k = 0; k <= n; k++) classicalColumn(marble, f.xy(c0 + k * step, -0.85), CR, BASE, CAP, 8)
    // tall windows on the recessed wall between the columns
    const back = edgeFrame(f.xy(0, -RECESS), f.xy(L, -RECESS))
    for (let k = 0; k < n; k++) {
      const s = c0 + (k + 0.5) * step
      win.quad(back.at(s - 1.0, 0.05, 3.4), back.at(s + 1.0, 0.05, 3.4), back.at(s + 1.0, 0.05, 10.2), back.at(s - 1.0, 0.05, 10.2))
    }
  }
  colonnade(FLEET, true)
  colonnade(DEKALB, false)

  // ---- The portico: four giant Ionic columns on a stoop, standing 3.2 m
  // out from the cut corner, under a deep entablature and a pediment that
  // rises to the attic's height.
  {
    const [a, b] = edge(PORT)
    const f = edgeFrame(a, b), m = f.L / 2, s0 = m - PW / 2, s1 = m + PW / 2
    // the stoop, and steps down from it in the middle bay
    edgeBox(marble, a, b, s0, s1, -0.2, PROJ, 0, BASE, 0.12)
    for (let k = 0; k < 3; k++) edgeBox(marble, a, b, m - 2.6, m + 2.6, PROJ - 0.1, PROJ + 0.5 * (3 - k), 0, (BASE * (k + 1)) / 4, 0.05)
    for (let k = 0; k < 4; k++) classicalColumn(marble, f.xy(s0 + 0.95 + (k * (PW - 1.9)) / 3, PROJ - 0.95), PR, BASE, PCAP, 10)
    // the wall behind, in shade, with the tall dark doorway in the middle bay
    edgePanel(shade, a, b, s0 + 0.3, s1 - 0.3, BASE, PCAP, 0.03)
    edgePanel(win, a, b, m - 1.9, m + 1.9, BASE, 10.8, 0.06)
    // flanking windows in the side bays
    for (const sg of [-1, 1]) edgePanel(win, a, b, m + sg * 4.2 - 0.6, m + sg * 4.2 + 0.6, 4.5, 8.5, 0.06)
    // the entablature: architrave, frieze and cornice, deep, over the columns
    edgeBox(marble, a, b, s0, s1, -0.6, PROJ, PCAP, PCOR - 0.8, 0, false, true)
    edgePanel(shade, f.xy(s0, PROJ), f.xy(s1, PROJ), 0.3, PW - 0.3, PCAP + 0.9, PCOR - 1.3, 0.03)
    edgeBox(marble, a, b, s0 - 0.4, s1 + 0.4, -0.6, PROJ + 0.45, PCOR - 0.8, PCOR, 0.25, false, true)
    // the pediment on the portico's face, its roof running back over the blocking course
    const fa = f.xy(s0 - 0.4, PROJ + 0.45), fb = f.xy(s1 + 0.4, PROJ + 0.45)
    pediment(marble, shade, roof, fa, fb, PCOR, PAPEX, PROJ + 0.45 + 7.0)
    // the clock: a copper ring on the tympanum
    const g = edgeFrame(fa, fb), gm = g.L / 2, zc = PCOR + 1.35, r = 1.15
    for (let k = 0; k < 12; k++) {
      const t0 = (k / 12) * Math.PI * 2, t1 = ((k + 1) / 12) * Math.PI * 2
      tf(copper, g.at(gm, 0.1, zc), g.at(gm + Math.cos(t0) * r, 0.1, zc + Math.sin(t0) * r), g.at(gm + Math.cos(t1) * r, 0.1, zc + Math.sin(t1) * r), [g.n[0], g.n[1], 0])
    }
  }

  // ---- Entablature, cornice, blocking course.
  pwalls(marble, P, CAP, CORNICE - 0.6)
  pcap(marble, core, CAP, false) // soffit over the colonnades
  const lip = poffset(P, 0.4)
  pslab(marble, lip, CORNICE - 0.6, CORNICE, 0.25, false, true)
  // frieze band: a shallow shaded strip under the cornice
  for (const i of [FLEET, DEKALB]) {
    const [a, b] = edge(i)
    const f = edgeFrame(a, b)
    edgePanel(shade, a, b, 0.3, f.L - 0.3, CAP + 0.9, CORNICE - 0.9, 0.03)
  }
  const blockRing = poffset(P, -0.5)
  pslab(marble, blockRing, CORNICE, BLOCK, 0.2, roof)

  // the green copper cresting along the top of the blocking course
  for (let i = 0; i < blockRing.length; i++) {
    const a = blockRing[i], b = blockRing[(i + 1) % blockRing.length]
    const L = edgeFrame(a, b).L
    if (L > 1) edgeBox(copper, a, b, 0, L, -0.45, 0, BLOCK, BLOCK + 1.0, 0.1)
  }

  // ---- The attic, set back 3.2 m, with small windows in pairs.
  const atticRing = poffset(P, -3.2)
  pslab(marble, atticRing, BLOCK, ATTIC, 0, false)
  pslab(marble, poffset(atticRing, 0.25), ATTIC, COPING, 0.2, roof)
  for (const i of [FLEET, DEKALB]) {
    const a = atticRing[i], b = atticRing[(i + 1) % atticRing.length]
    const f = edgeFrame(a, b)
    const n = Math.round((f.L - 8) / 3.7)
    for (let k = 0; k < n; k++) {
      const s = 4 + (k + 0.5) * ((f.L - 8) / n)
      edgePanel(win, a, b, s - 0.6, s + 0.6, 17.7, 19.2)
    }
  }

  // ---- The drum: a hexagon faced in green copper, stone at the corners.
  const C: XY = [1.0, -0.9], R = 14.85
  const hex = (r: number): XY[] => Array.from({ length: 6 }, (_, k) => [C[0] + r * Math.cos((k * Math.PI) / 3), C[1] + r * Math.sin((k * Math.PI) / 3)] as XY)
  pslab(copper, hex(R + 1.3), ATTIC, DRUM0, 0.2, roof) // copper cresting round the drum's base
  pwalls(copper, hex(R), DRUM0, DRUM1)
  const H = hex(R)
  for (let k = 0; k < 6; k++) {
    const a = H[k], b = H[(k + 1) % 6]
    const f = edgeFrame(a, b)
    // stone corner piers
    for (const s of [0, f.L]) {
      const c = f.xy(s, 0)
      cbox(marble, rect(c[0] - 0.9, c[0] + 0.9, c[1] - 0.9, c[1] + 0.9), DRUM0, DRUM1 + 0.3, { b: 0.15 })
    }
    // three windows a face
    for (let j = 0; j < 3; j++) {
      const s = f.L * (0.25 + j * 0.25)
      edgePanel(win, a, b, s - 1.1, s + 1.1, DRUM0 + 0.9, DRUM1 - 0.9, 0.06)
    }
  }
  // the cresting: a copper band standing a little proud, then the drum's flat top
  pslab(copper, hex(R + 0.3), DRUM1, CREST, 0.12, roof)

  // ---- The dome: two stone steps, then a low smooth spherical cap.
  const steps: [number, number][] = [[12.7, CREST], [12.7, 26.1], [12.1, 26.1], [12.1, 26.8]]
  const RB = 11.6, ZB = 26.8, TOP = 33.5
  const Rs = (RB * RB + (TOP - ZB) ** 2) / (2 * (TOP - ZB)), zc = TOP - Rs
  const prof: [number, number][] = [...steps, [RB, ZB]]
  const a0 = Math.asin(RB / Rs)
  for (let k = 1; k <= 6; k++) {
    const t = a0 * (1 - k / 6)
    prof.push([Rs * Math.sin(t), zc + Rs * Math.cos(t)])
  }
  lathe(marble, C[0], C[1], prof, 16, false)

  return [
    { part: marble, material: finish('dime-marble', 0xf1ece3) },
    { part: shade, material: finish('dime-marble-shade', 0xcbc3b6) },
    { part: copper, material: finish('dime-verdigris', 0x86b9a4) },
    { part: roof, material: finish('dime-roof', 0xbfc2c0) },
    { part: win, material: PALETTE.window },
  ]
}

if (import.meta.main) {
  await saveModel('nyc-dime-savings-bank', 'Dime Savings Bank of Brooklyn', build(), {
    source: 'generators/nyc-dime-savings-bank.ts', bearing: 0, osm: 'way/248156228', height: 33.5,
  }, 6500)
}
