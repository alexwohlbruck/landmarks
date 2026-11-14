/**
 * The O2 (the Millennium Dome), Greenwich Peninsula — original procedural
 * geometry, CC0-1.0.
 * bun generators/london-the-o2.ts
 * writes models/london-the-o2.glb (low) and models/london-the-o2.detail.glb
 * (the masts as real four-legged lattices, every cable: hangers, backstays,
 * the radial and ring cables on the fabric).
 *
 * Model frame: bearing 0 (x east, y north, z up, metres). Origin = area
 * centroid of the dome outline way/4320517 (outer of relation/1895281).
 * y = 0 is the ground round the dome (lidar DTM 3.5 m above the box's lowest
 * cell, flat all round the peninsula).
 *
 * The form: a white PTFE fabric dome, flat-topped and steepening to the
 * edge, its fabric ridged by radial cables, its edge cut into scallops: two
 * cusps either side of each mast, a big arch over the entrance centred on
 * the mast and a small arch between neighbouring masts. Twelve yellow
 * lattice masts, 100 m long, rise through the fabric leaning outward, each
 * with a fan of hanger cables down to the fabric and two backstays to the
 * ground at the edge. The oval hole the dome leaves round the Blackwall
 * Tunnel ventilation shaft (the shaft itself is a separate OSM building and
 * stays the map's), with its glazed collar. The "Up at The O2" roof walkway
 * runs over the summit from north-north-west to south-south-east. Under the
 * scalloped edge, the dark glazed perimeter wall with the entrances.
 *
 * Evidence
 * - OSM relation/1895281 (building=yes, leisure=stadium, height 50,
 *   roof:shape dome, wikidata Q29014): outer way/4320517, radius 173 m;
 *   inner way/140106710, the vent-shaft hole (x -102..-52, y -113..-70).
 *   The twelve 14 m service drums round the edge (way/151983290..301) and
 *   the vent shaft (way/140111163, parts way/1203940978, 1203940979,
 *   1203955585) are separate buildings and stay the map's.
 * - Environment Agency LIDAR Composite DSM/DTM 1 m, Open Government Licence
 *   v3.0 (flight year not stated in the composite; the dome dates from 1999).
 *   Ground 3.5 m above the box's minimum all round. Fabric above ground,
 *   by radius (the same on every bearing to ±0.5 m): 0: 50.6, 10: 49.7,
 *   20: 47.8, 30: 47.0, 40: 46.2, 50: 44.5, 60: 42.9, 70: 41.1, 80: 38.8,
 *   90: 36.6, 100: 33.5, 110: 30.6, 120: 27.2, 130: 23.5, 140: 19.5,
 *   150: 15.0, 160: 10.0 m. Edge traced every 1° round the circle: cusps
 *   out at r 174 at each mast's bearing ±11°, the big scallop between them
 *   back to r 160 on the mast's bearing, the small one back to r 164 midway
 *   between masts. Masts: lattice returns in radial streaks on bearings
 *   23.5° + 30°·k, r 107–127, tops 88–96 m above ground.
 * - Published (Wikipedia, "The O2"; "Millennium Dome"): 365 m diameter,
 *   52 m high at the centre; twelve 100 m yellow masts; PTFE-coated glass
 *   fibre fabric; opened 1999-2000, Richard Rogers Partnership / Buro Happold.
 * - Photos (Wikimedia Commons, all EVIDENCE):
 *   "The O2, Greenwich, London.jpg", Lewis Hulbert, CC BY-SA 3.0 — from
 *     the north-east across the dock: masts, the hanger fans;
 *   "O2 Arena.jpg", Heuschrecke, CC BY-SA 3.0 — from the west across the
 *     river: all twelve masts, the vent hole and its glazed collar, the
 *     walkway, the edge scallops over the entrances;
 *   "London MMB «R8 Millennium Dome.jpg", mattbuck, CC BY-SA 3.0 — from the
 *     river: profile, backstays;
 *   "London millennium dome 02.jpg", Ad Meskens, CC BY-SA 3.0 — aerial;
 *   "The Millennium Dome, taken during flight back to Heathrow
 *     (100455649).jpg", Paul Holloway, CC BY-SA 2.0 — aerial from the
 *     south: the scalloped edge, the masts' lean, the ring cable;
 *   "The Millennium Dome at the O2 Arena, London (Ank Kumar, Infosys
 *     Limited) 05.jpg", Ank Kumar, CC BY-SA 4.0 — at night: the floodlit
 *     fabric and the lit mast heads;
 *   "Millenium Dome and Canary Wharf, London, 17 September 2005
 *     (83730952).jpg", Phillip Capper, CC BY 2.0.
 *
 * Measured (lidar): the fabric profile, the edge's scallops, the mast
 * bearings and the tops' radius and height. Published: diameter, height,
 * mast length. Estimated: the masts' section (a square lattice of uniform width, about 3 m
 * in the photos, drawn 3.2 m with bold legs so it reads at phone size;
 * all twelve lean out at the same angle, 15°, tapering to points), where they land inside (on the ground at
 * r 101, which gives the published 100 m length and the measured top), the
 * hanger and backstay layout (from the photos: a fan of six hangers and two
 * backstays per mast, fewer than the real ones), the walkway's section, the
 * collar's depth. Elevation 0 (the ground is flat all round).
 * Doubts: lidar flight year unknown; the cable layout is simplified.
 */
import { writeFileSync } from 'node:fs'
import { Part, writeGlb, cross, sub, type V3, type MaterialSpec } from './mesh'
import { finish, PALETTE } from './palette'

const ID = 'london-the-o2'

const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const scl = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const nrm = (a: V3): V3 => scl(a, 1 / (Math.hypot(a[0], a[1], a[2]) || 1))
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const rad = (d: number) => (d * Math.PI) / 180

/** A round tube along a path, smooth-shaded, open ends. */
function tube(p: Part, path: V3[], r: number | number[], sides: number) {
  const n = path.length
  const R = (i: number) => (Array.isArray(r) ? r[i] : r)
  const T = path.map((_, i) => nrm(sub(path[Math.min(i + 1, n - 1)], path[Math.max(i - 1, 0)])))
  const rings = path.map((c, i) => {
    const t = T[i]
    const side = nrm(Math.abs(t[2]) > 0.9 ? cross(t, [1, 0, 0]) : cross(t, [0, 0, 1]))
    const up = cross(side, t)
    return Array.from({ length: sides }, (_, k) => {
      const a = (2 * Math.PI * k) / sides
      const d = add(scl(side, Math.cos(a)), scl(up, Math.sin(a)))
      return { p: add(c, scl(d, R(i))), n: d }
    })
  })
  for (let i = 0; i < n - 1; i++)
    for (let k = 0; k < sides; k++) {
      const j = (k + 1) % sides, a = rings[i], b = rings[i + 1]
      p.tri(a[k].p, b[k].p, b[j].p, undefined, undefined, undefined, [a[k].n, b[k].n, b[j].n])
      p.tri(a[k].p, b[j].p, a[j].p, undefined, undefined, undefined, [a[k].n, b[j].n, a[j].n])
    }
}
const rod = (p: Part, a: V3, b: V3, r: number, sides = 3) => tube(p, [a, b], r, sides)

/**
 * Smooth a part's shading where faces meet at less than `deg`, and drop
 * the (unused) UVs, so corners that coincide merge into one vertex: curved
 * walls and roofs shade softly and the file stays small. Creases sharper
 * than `deg` stay hard.
 */
function smooth(p: Part, deg = 32) {
  const cos = Math.cos((deg * Math.PI) / 180)
  const groups = new Map<string, number[]>()
  const n = p.pos.length / 3
  for (let i = 0; i < n; i++) {
    const k = `${Math.round(p.pos[3 * i] * 100)},${Math.round(p.pos[3 * i + 1] * 100)},${Math.round(p.pos[3 * i + 2] * 100)}`
    const g = groups.get(k)
    if (g) g.push(i)
    else groups.set(k, [i])
  }
  const out = p.nrm.slice()
  for (const g of groups.values()) {
    for (const i of g) {
      let x = 0, y = 0, z = 0
      for (const j of g) {
        const d = p.nrm[3 * i] * p.nrm[3 * j] + p.nrm[3 * i + 1] * p.nrm[3 * j + 1] + p.nrm[3 * i + 2] * p.nrm[3 * j + 2]
        if (d >= cos) { x += p.nrm[3 * j]; y += p.nrm[3 * j + 1]; z += p.nrm[3 * j + 2] }
      }
      const l = Math.hypot(x, y, z) || 1
      out[3 * i] = Math.round((x / l) * 1e4) / 1e4; out[3 * i + 1] = Math.round((y / l) * 1e4) / 1e4; out[3 * i + 2] = Math.round((z / l) * 1e4) / 1e4
    }
  }
  p.nrm = out
  p.uv = p.uv.map(() => 0)
}

// ------------------------------------------------------------ the fabric
/** Fabric height above ground at radius r (lidar profile, extrapolated past 160 to the cusps). */
const PROFILE: [number, number][] = [
  [0, 50.6], [10, 49.7], [20, 47.9], [30, 47.0], [40, 46.2], [50, 44.5], [60, 42.9], [70, 41.1], [80, 38.8],
  [90, 36.6], [100, 33.5], [110, 30.6], [120, 27.2], [130, 23.5], [140, 19.5], [150, 15.0], [160, 10.0],
  [165, 7.2], [170, 4.2], [175, 1.2],
]
function h(r: number) {
  for (let i = 0; i < PROFILE.length - 1; i++) {
    const [r0, z0] = PROFILE[i], [r1, z1] = PROFILE[i + 1]
    if (r <= r1) return lerp(z0, z1, (r - r0) / (r1 - r0))
  }
  return PROFILE[PROFILE.length - 1][1]
}
const MAST0 = 23.5 // bearing of the first mast; the rest every 30°
/**
 * The edge's columns, as bearing offsets within one 30° bay starting at a
 * mast: the big scallop (centred on the mast) and the small one between
 * masts, with the radius the edge reaches at each.
 */
const BAY: [number, number][] = [
  [0, 160], [3.5, 161.3], [7.3, 165.5], [11, 174], [13, 168.5], [15, 164], [17, 168.5], [19, 174], [22.7, 165.5], [26.5, 161.3],
]
const COLS = 12 * BAY.length
const colBearing = (c: number) => MAST0 + 30 * Math.floor(c / BAY.length) + BAY[c % BAY.length][0]
const colEdge = (c: number) => BAY[c % BAY.length][1]
/** Cable lines on the fabric: the cusps and the scallop centres. */
const isCable = (c: number) => [0, 3, 5, 7].includes(c % BAY.length)

// The vent-shaft hole (OSM inner way/140106710): an ellipse.
const HOLE = { cx: -76.6, cy: -91.6, a: 25.5, b: 21.8 }
const inHole = (x: number, y: number) => ((x - HOLE.cx) / HOLE.a) ** 2 + ((y - HOLE.cy) / HOLE.b) ** 2 < 1

const M = {
  fabric: { ...finish('ptfe-fabric', 0xf1efe9, 0.8), floodlight: (q: V3, n: V3) => (n[2] > 0.97 ? 0.35 : 0.65) } as MaterialSpec,
  mast: { ...finish('mast-yellow', 0xe2b33e, 0.7), floodlight: (q: V3) => (q[2] > 78 ? 0.9 : q[2] > 50 ? 0.35 : 0) } as MaterialSpec,
  cable: finish('cable-steel', 0xd4d6d6, 0.6),
  base: { ...PALETTE.window } as MaterialSpec,
  glass: { ...PALETTE.glass } as MaterialSpec,
  walk: finish('walkway', 0xdcdedd, 0.85),
}

function build(detail: boolean) {
  const fabric = new Part(), mast = new Part(), cable = new Part(), base = new Part(), glass = new Part(), walk = new Part()

  // --- Fabric: rings of radius f·edge(θ) about the centre (so the outer
  // rings follow the scallops), each column ridged where a radial cable
  // runs and bulging up between them.
  const RINGS = detail
    ? [0, 0.04, 0.08, 0.13, 0.18, 0.24, 0.3, 0.36, 0.42, 0.48, 0.54, 0.6, 0.66, 0.71, 0.76, 0.81, 0.85, 0.89, 0.925, 0.955, 0.98, 1]
    : [0, 0.07, 0.16, 0.26, 0.36, 0.46, 0.56, 0.65, 0.73, 0.8, 0.86, 0.91, 0.955, 1]
  const sub_ = detail ? 2 : 1 // columns per edge column
  const NC = COLS * sub_
  const colAt = (c: number) => {
    const c0 = Math.floor(c / sub_), t = (c % sub_) / sub_
    const b0 = colBearing(c0), b1 = colBearing(c0 + 1) + (c0 + 1 === COLS ? 0 : 0)
    const bb1 = c0 + 1 === COLS ? colBearing(0) + 360 : b1
    return { b: lerp(b0, bb1, t), e: lerp(colEdge(c0), colEdge(c0 + 1), t), cable: t === 0 && isCable(c0) }
  }
  const pushed = (c: number, k: number) => {
    const { b, e } = colAt(((c % NC) + NC) % NC)
    const f = RINGS[k], blend = Math.max(0, (f - 0.62) / 0.38), r = f * lerp(167, e, blend)
    return inHole(r * Math.sin(rad(b)), r * Math.cos(rad(b)))
  }
  const vert = (c: number, k: number): V3 => {
    const { b, e, cable } = colAt(((c % NC) + NC) % NC)
    const f = RINGS[k]
    // inner rings are true circles; the scallops grow in over the outer third
    const blend = Math.max(0, (f - 0.62) / 0.38)
    const r = f * lerp(167, e, blend)
    let x = r * Math.sin(rad(b)), y = r * Math.cos(rad(b))
    if (inHole(x, y)) {
      // push out to the hole's rim along the ray from its centre
      const dx = x - HOLE.cx, dy = y - HOLE.cy, s = 1 / Math.sqrt((dx / HOLE.a) ** 2 + (dy / HOLE.b) ** 2 || 1)
      x = HOLE.cx + dx * s; y = HOLE.cy + dy * s
    }
    const rr = Math.hypot(x, y)
    const bulge = cable || k === 0 || k === RINGS.length - 1 ? 0 : 0.9 * Math.sin(Math.PI * Math.min(1, rr / 165))
    return [x, y, h(rr) + bulge]
  }
  // Faces first, then smooth normals averaged over each vertex's faces, so
  // the ridges shade softly and the vertices merge.
  const faces: [number, number][][] = []
  for (let c = 0; c < NC; c++)
    for (let k = 0; k < RINGS.length - 1; k++) {
      const np = [pushed(c, k), pushed(c + 1, k), pushed(c + 1, k + 1), pushed(c, k + 1)].filter(Boolean).length
      if (np >= 3) continue
      if (k === 0) faces.push([[c, 0], [c + 1, 1], [c, 1]])
      else {
        faces.push([[c, k], [c + 1, k], [c + 1, k + 1]])
        faces.push([[c, k], [c + 1, k + 1], [c, k + 1]])
      }
    }
  const key = ([c, k]: [number, number]) => (k === 0 ? 'top' : `${((c % NC) + NC) % NC},${k}`)
  const acc = new Map<string, V3>()
  for (const f of faces) {
    const [a, b, c] = f.map(([cc, k]) => vert(cc, k))
    const n = cross(sub(b, a), sub(c, a))
    for (const v of f) {
      const q = acc.get(key(v)) ?? [0, 0, 0]
      acc.set(key(v), add(q, n))
    }
  }
  for (const f of faces) {
    const pts = f.map(([cc, k]) => vert(cc, k))
    const ns = f.map((v) => nrm(acc.get(key(v))!))
    fabric.tri(pts[0], pts[1], pts[2], undefined, undefined, undefined, ns)
    // underside near the edge, so the scallop arches read from below
    if (f[0][1] >= RINGS.length - 3) fabric.tri(pts[0], pts[2], pts[1], undefined, undefined, undefined, ns.map((n) => scl(n, -1)))
  }

  // --- The vent hole's glazed collar: a sloping glass band from the rim
  // down and in, with a white lip.
  const HN = detail ? 48 : 28
  const rim = (i: number, grow: number, dz: number): V3 => {
    const t = (2 * Math.PI * i) / HN
    const x = HOLE.cx + (HOLE.a + grow) * Math.cos(t), y = HOLE.cy + (HOLE.b + grow) * Math.sin(t)
    return [x, y, h(Math.hypot(HOLE.cx + HOLE.a * Math.cos(t), HOLE.cy + HOLE.b * Math.sin(t))) + dz]
  }
  for (let i = 0; i < HN; i++) {
    const a0 = rim(i, 0, 0.3), a1 = rim(i + 1, 0, 0.3), b0 = rim(i, -2.5, -7), b1 = rim(i + 1, -2.5, -7)
    glass.quad(a0, a1, b1, b0)
    glass.quad(a0, b0, b1, a1)
    const l0 = rim(i, 0.8, 1.4), l1 = rim(i + 1, 0.8, 1.4)
    fabric.quad(a0, a1, l1, l0)
    fabric.quad(a0, l0, l1, a1)
  }

  // --- The perimeter wall under the edge (entrances, glazing), seen in
  // the scallops: a ring at r 158 up into the fabric.
  const PW = detail ? 120 : 60
  for (let i = 0; i < PW; i++) {
    const b0 = rad((360 * i) / PW), b1 = rad((360 * (i + 1)) / PW), R = 158
    const p0: V3 = [R * Math.sin(b0), R * Math.cos(b0), 0], p1: V3 = [R * Math.sin(b1), R * Math.cos(b1), 0]
    const top = h(R) + 0.5
    base.quad(p1, p0, [p0[0], p0[1], top], [p1[0], p1[1], top])
  }

  // --- The walkway over the summit (Up at The O2): a raised strip along the
  // line traced in the lidar, steps drawn as a smooth ramp.
  {
    const A: [number, number] = [-55, 163], B: [number, number] = [53, -137]
    const L = Math.hypot(B[0] - A[0], B[1] - A[1]), ux = (B[0] - A[0]) / L, uy = (B[1] - A[1]) / L
    const nx = -uy, ny = ux, W = 2.2, H = 1.3
    const S = detail ? 60 : 26
    // keep it on the fabric, from rim to rim
    const pts: V3[] = []
    for (let i = 0; i <= S; i++) {
      const s = lerp(4, L - 4, i / S)
      const x = A[0] + ux * s, y = A[1] + uy * s
      pts.push([x, y, h(Math.hypot(x, y)) + 0.9])
    }
    for (let i = 0; i < S; i++) {
      const p = pts[i], q = pts[i + 1]
      const o = (pt: V3, side: number, up: number): V3 => [pt[0] + nx * W * side, pt[1] + ny * W * side, pt[2] + up]
      walk.quad(o(p, -1, H), o(p, 1, H), o(q, 1, H), o(q, -1, H)) // deck/canopy top
      walk.quad(o(p, 1, -0.9), o(q, 1, -0.9), o(q, 1, H), o(p, 1, H))
      walk.quad(o(q, -1, -0.9), o(p, -1, -0.9), o(p, -1, H), o(q, -1, H))
    }
  }

  // --- The masts, hangers and backstays.
  for (let k = 0; k < 12; k++) {
    const m = rad(MAST0 + 30 * k)
    const u: V3 = [Math.sin(m), Math.cos(m), 0], v: V3 = [Math.cos(m), -Math.sin(m), 0]
    const foot: V3 = scl(u, 101), top: V3 = add(scl(u, 127), [0, 0, 96])
    const axis = sub(top, foot), len = Math.hypot(axis[0], axis[1], axis[2]), ax = nrm(axis)
    const side = v, fore = nrm(cross(ax, side)) // fore: perpendicular in the radial-vertical plane
    const at = (t: number) => add(foot, scl(axis, t))
    // uniform width (the photos show straight-sided masts), drawn 3.2 m across
    const halfW = (t: number) => (t < 0.94 ? 1.6 : Math.max(0.05, 1.6 * (1 - t) / 0.06))
    if (!detail) {
      // A four-legged lattice of uniform width, bold enough for a phone:
      // legs from inside the fabric to the head, a zigzag brace on each
      // face, the small head platform and the spike above it.
      const corner = (t: number, j: number) => {
        const [a, b] = [[1, 1], [-1, 1], [-1, -1], [1, -1]][j]
        const w = halfW(t)
        return add(at(t), add(scl(side, a * w), scl(fore, b * w)))
      }
      const T0 = 0.25, T1 = 0.93, PN = 4
      for (let j = 0; j < 4; j++) rod(mast, corner(T0, j), corner(T1, j), 0.5, 4)
      for (let i = 0; i < PN; i++) {
        const t0 = lerp(T0, T1, i / PN), t1 = lerp(T0, T1, (i + 1) / PN)
        for (let j = 0; j < 4; j++) rod(mast, corner(i % 2 ? t1 : t0, j), corner(i % 2 ? t0 : t1, (j + 1) % 4), 0.32, 3)
      }
      // head platform
      const pc = at(T1), pw = halfW(T1) + 0.9
      const ring = (dz: number) => [[1, 1], [-1, 1], [-1, -1], [1, -1]].map(([a, b]) => add(add(pc, scl(ax, dz)), add(scl(side, a * pw), scl(fore, b * pw))))
      const lo = ring(-0.6), hi = ring(0.6)
      for (let j = 0; j < 4; j++) {
        const jj = (j + 1) % 4
        mast.quad(lo[j], lo[jj], hi[jj], hi[j])
      }
      mast.quad(hi[0], hi[1], hi[2], hi[3])
      mast.quad(lo[3], lo[2], lo[1], lo[0])
      // the spike to the tip
      for (let j = 0; j < 4; j++) mast.tri(corner(T1, j), corner(T1, (j + 1) % 4), at(1))
    } else {
      // Four legs and X-bracing on every face, panel by panel.
      const P = 16
      const corner = (t: number, j: number) => {
        const [a, b] = [[1, 1], [-1, 1], [-1, -1], [1, -1]][j]
        const w = t >= 1 ? 0.05 : halfW(t)
        return add(at(t), add(scl(side, a * w), scl(fore, b * w)))
      }
      for (let j = 0; j < 4; j++) {
        const leg: V3[] = [], rr: number[] = []
        for (let i = 0; i <= P; i++) {
          const t = lerp(0.2, 1, i / P)
          leg.push(corner(t, j)); rr.push(0.32)
        }
        tube(mast, leg, rr, 4)
      }
      for (let i = 0; i < P; i++) {
        const t0 = lerp(0.2, 1, i / P), t1 = lerp(0.2, 1, (i + 1) / P)
        for (let j = 0; j < 4; j++) {
          const jj = (j + 1) % 4
          rod(mast, corner(t0, j), corner(t1, jj), 0.16, 3)
          if (i % 2 === 0) rod(mast, corner(t0, j), corner(t0, jj), 0.14, 3)
        }
      }
    }
    // Hanger fan: from the mast head down to nodes on the fabric, inward
    // and to either side; backstays out to the ground past the edge.
    const head = add(top, scl(ax, -3))
    const node = (r: number, db: number): V3 => {
      const b = m + rad(db), x = r * Math.sin(b), y = r * Math.cos(b)
      return [x, y, h(r) + 0.3]
    }
    const hangers = detail
      ? [[62, -7], [62, 7], [78, -12], [78, 12], [92, -15], [92, 15], [104, -13], [104, 13], [70, 0], [88, 0], [140, -10], [140, 10]]
      : [[66, -8], [66, 8], [90, -14], [90, 14], [140, -10], [140, 10]]
    const cr = detail ? 0.2 : 0.32
    for (const [r, db] of hangers) rod(cable, head, node(r, db), cr, detail ? 4 : 3)
    for (const db of [-8, 8]) {
      const b = m + rad(db), g: V3 = [178 * Math.sin(b), 178 * Math.cos(b), 0.6]
      rod(cable, head, g, cr * 1.2, detail ? 4 : 3)
    }
  }

  if (detail) {
    // Radial cables on the fabric, and the ring cables.
    for (let c = 0; c < COLS; c++) {
      if (!isCable(c)) continue
      const path: V3[] = []
      for (let k = 1; k < RINGS.length; k++) {
        const p = vert(c * sub_, k)
        if (inHole(p[0] * 0.98 + HOLE.cx * 0.02, p[1] * 0.98 + HOLE.cy * 0.02)) { if (path.length > 1) tube(cable, path.splice(0), 0.18, 3); path.length = 0; continue }
        path.push([p[0], p[1], p[2] + 0.2])
      }
      if (path.length > 1) tube(cable, path, 0.18, 3)
    }
    for (const R of [30, 75, 120]) {
      const path: V3[] = []
      for (let i = 0; i <= 96; i++) {
        const b = (2 * Math.PI * i) / 96, x = R * Math.sin(b), y = R * Math.cos(b)
        if (inHole(x, y)) { if (path.length > 1) tube(cable, path.splice(0), 0.2, 3); path.length = 0; continue }
        path.push([x, y, h(R) + 0.25])
      }
      if (path.length > 1) tube(cable, path, 0.2, 3)
    }
  }

  for (const q of [mast, cable, base, glass, walk]) smooth(q)
  return [
    { part: fabric, material: M.fabric },
    { part: mast, material: M.mast },
    { part: cable, material: M.cable },
    { part: base, material: M.base },
    { part: glass, material: M.glass },
    { part: walk, material: M.walk },
  ]
}

if (import.meta.main) {
  const extras = { license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor' }
  for (const [detail, file] of [[false, `models/${ID}.glb`], [true, `models/${ID}.detail.glb`]] as const) {
    const parts = build(detail)
    const tris = parts.reduce((s, { part }) => s + part.triangles, 0)
    const glb = writeGlb('The O2', parts, extras)
    writeFileSync(new URL(`../${file}`, import.meta.url), glb)
    console.log(`${file}: ${tris} triangles, ${glb.length} bytes`)
  }
}
