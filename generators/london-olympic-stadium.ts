/**
 * London Stadium (the 2012 Olympic Stadium), Stratford — original procedural
 * geometry, CC0-1.0.
 * bun generators/london-olympic-stadium.ts
 * writes models/london-olympic-stadium.glb (low) and
 * models/london-olympic-stadium.detail.glb (finer truss web, more roof ribs,
 * the floodlight frames' bracing).
 *
 * Model frame turned to BEARING 354.3 (the stadium's long axis, from the OSM
 * outline's principal axis): +y along the long axis (north-north-west), +x
 * across it (east-north-east), z up, metres. Origin = centroid of the OSM
 * outline way/486297861; the bowl's centre sits at C = (5.5, 1) in this frame
 * (the roof opening and truss ring read from lidar are centred there).
 * y = 0 is the pitch.
 *
 * The current (post-2016 conversion) form: an oval bowl whose outer wall is
 * dressed in the fabric wrap (white with claret and sky-blue triangles);
 * above it a dark recess under the roof's leading edge; the white tubular
 * steel compression truss ring standing over the roof's outer edge on
 * raking Λ-shaped column pairs that land on the podium outside the wrap;
 * the 2016 roof, a light grey membrane on radial ribs, sloping up from the
 * truss to an inner tension ring over the pitch, with triangular floodlight
 * frames hanging from the inner edge. The 2012 lighting towers are gone.
 *
 * Evidence
 * - OSM relation/10266378 (building=stadium, height 53; outer way/486297861,
 *   leisure=stadium, wikidata Q172190; inner way/172788640, the roof
 *   opening, ±71 × ±51–58 m). Retractable end stands way/843430380 and
 *   way/843430381 (leisure=bleachers) sit inside the bowl.
 * - Environment Agency LIDAR Composite DSM/DTM 2 m resample, Open Government
 *   Licence v3.0 (post-2016 roof: the opening matches OSM). Above the pitch
 *   (3.4 m above ground_min 3.05 m AOD): podium all round 5.3 m (the pitch
 *   is sunk 5.3 m); the wrap's top, a flat 16–18 m ring on the long sides,
 *   21.3 m; the roof's outer edge at the truss 30 m, rising evenly to the
 *   inner edge at 40.8 m (the inner edge is the highest part of the roof);
 *   the truss's top chord ~42 m. In plan about C: roof opening ±54 × ±73 m,
 *   truss ring ±124 × ±152, outer wall ±138 × ±155. Floodlight frames hang
 *   to ~17–25 m under the inner edge at the ends.
 * - Published (Wikipedia, "London Stadium"): 2012, Populous; converted
 *   2013–16 with a new roof covering every seat (84 m deep at its deepest),
 *   the largest cantilevered roof in the world, and retractable lower seats;
 *   the original white tubular compression truss kept.
 * - Photos (Wikimedia Commons, all EVIDENCE):
 *   "London Queen Elizabeth Olympic Park.jpg", Arne Müseler, CC BY-SA 3.0 de
 *     — aerial from the south: the oval, radial roof ribs on a light grey
 *     roof, the opening, the truss and Λ columns, the wrap;
 *   "Queen Elizabeth Olympic Park from the air - geograph.org.uk - 4642613",
 *     Thomas Nugent, CC BY-SA 2.0 — aerial, the whole roof;
 *   "Greenway overlooking London Stadium and ArcelorMittal Orbit.jpg",
 *     Uthoang, CC BY-SA 4.0 — side view from the south: truss depth, Λ
 *     columns, wrap pattern, dark recess, concourse;
 *   "London Stadium, Queen Elizabeth Olympic Park (geograph 6561224)", Oast
 *     House Archive, CC BY-SA 2.0 — close: truss web, columns, wrap;
 *   "London Stadium (39580217711).jpg", Daniel from Glasgow, CC BY 2.0 — the
 *     north entrance: Λ column pairs, the black facade;
 *   "London Stadium, Olympic Park - geograph.org.uk - 7405855.jpg", Bryn
 *     Holmes, CC BY-SA 2.0 — from the east across the river: truss depth;
 *   "London Stadium panorama picture.jpg", Hammersfan, CC BY-SA 4.0 —
 *     inside: the roof's underside, the hanging floodlight frames, the seats.
 *   "Olympic Stadium and the Arcelor Orbit - geograph.org.uk - 7748365",
 *     Bikeboy, CC BY-SA 2.0 — the truss and wrap from the south-east.
 *
 * Measured (lidar): every height above and all the ring sizes. Published:
 * the form and dates. Estimated: the truss's section (a triangle 5 m wide at
 * the bottom), the Λ count (28) and web spacing (56 bays), the seating rake
 * (two tiers), the wrap's triangle pattern (drawn as big bold facets,
 * claret, white and sky blue, after the photos, not traced panel by panel).
 * Elevation: 0. The pitch is 5.3 m below the podium outside (lidar surface:
 * pitch 3.4 m, podium 8.6–8.8 m above ground_min all round except the west,
 * where the ground falls to the River Lea towpath at 2.6 m). But the
 * podium is a deck that the bare-earth terrain leaves out: Mapterhorn
 * (`terrain.ts grid`) shows the ground round the south and west at
 * 2.8–3.4 m, level with the pitch, and only the north-east podium at 8.5 m,
 * so the map's street is not above the pitch on most sides. `terrain.ts
 * check` passes at 0 and buries the lower tier 4.5 m at -5.3. The model's
 * wall therefore runs from the pitch level up, its dark concourse band
 * standing where the real podium deck is.
 * Doubts: the lidar's flight year isn't stated (it shows the 2016 roof);
 * the podium deck itself (the map's ground) is not modelled.
 */
import { writeFileSync } from 'node:fs'
import { Part, writeGlb, cross, sub, type V3, type MaterialSpec } from './mesh'
import { finish } from './palette'

const ID = 'london-olympic-stadium'

const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const scl = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const nrm = (a: V3): V3 => scl(a, 1 / (Math.hypot(a[0], a[1], a[2]) || 1))
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

/** A smooth round tube along a path (open ends). */
function tube(p: Part, path: V3[], r: number, sides: number, closed = false) {
  const n = path.length
  const T = path.map((_, i) => nrm(sub(path[closed ? (i + 1) % n : Math.min(i + 1, n - 1)], path[closed ? (i - 1 + n) % n : Math.max(i - 1, 0)])))
  const rings = path.map((c, i) => {
    const t = T[i]
    const side = nrm(Math.abs(t[2]) > 0.9 ? cross(t, [1, 0, 0]) : cross(t, [0, 0, 1]))
    const up = cross(side, t)
    return Array.from({ length: sides }, (_, k) => {
      const a = (2 * Math.PI * k) / sides
      const d = add(scl(side, Math.cos(a)), scl(up, Math.sin(a)))
      return { p: add(c, scl(d, r)), n: d }
    })
  })
  const last = closed ? n : n - 1
  for (let i = 0; i < last; i++)
    for (let k = 0; k < sides; k++) {
      const j = (k + 1) % sides, a = rings[i], b = rings[(i + 1) % n]
      p.tri(a[k].p, b[k].p, b[j].p, undefined, undefined, undefined, [a[k].n, b[k].n, b[j].n])
      p.tri(a[k].p, b[j].p, a[j].p, undefined, undefined, undefined, [a[k].n, b[j].n, a[j].n])
    }
}
const rod = (p: Part, a: V3, b: V3, r: number, sides = 4) => tube(p, [a, b], r, sides)

/** A flat quad drawn on both sides. */
function both(p: Part, a: V3, b: V3, c: V3, d: V3) {
  p.quad(a, b, c, d)
  p.quad(a, d, c, b)
}

// ------------------------------------------------------------ the oval
const C: [number, number] = [5.5, 1]
const EXP = 2.3
/** A point on a superellipse ring of semi-axes (a across, b along) at parameter t (0..1). */
function ring(a: number, b: number, t: number, z: number): V3 {
  const th = 2 * Math.PI * t, c = Math.cos(th), s = Math.sin(th)
  const f = (v: number) => Math.sign(v) * Math.pow(Math.abs(v), 2 / EXP)
  return [C[0] + a * f(c), C[1] + b * f(s), z]
}
/** Outward horizontal normal of the superellipse at t (numerically). */
function outward(a: number, b: number, t: number): V3 {
  const p0 = ring(a, b, t - 1e-4, 0), p1 = ring(a, b, t + 1e-4, 0)
  const d = sub(p1, p0)
  return nrm([d[1], -d[0], 0])
}

const Z = { podium: 5.3, wrapTop: 21.3, roofOut: 30.4, trussTop: 42, roofIn: 40.8 }
const OPEN = [54, 73], TRUSS = [124, 152], WALL = [138, 155], RECESS = [131, 150.5], FOOT = [146, 161]

const M = {
  white: { ...finish('truss-white', 0xf3f3f0, 0.6), floodlight: (q: V3) => (q[2] > 8 ? 0.7 : 0) } as MaterialSpec,
  membrane: { ...finish('roof-membrane', 0xd3d6d4, 0.8), doubleSided: true } as MaterialSpec,
  wrap: { ...finish('wrap-white', 0xece8e3, 0.85), floodlight: () => 0.55 } as MaterialSpec,
  claret: { ...finish('claret', 0x8e3c4c, 0.85), floodlight: () => 0.55 } as MaterialSpec,
  blue: { ...finish('sky-blue', 0x7cc0d6, 0.85), floodlight: () => 0.55 } as MaterialSpec,
  dark: finish('soffit', 0x4a4f57, 0.85),
}

function build(detail: boolean) {
  const white = new Part(), membrane = new Part(), wrap = new Part(), claret = new Part(), blue = new Part(), dark = new Part()
  const N = detail ? 112 : 56 // truss bays
  const SEG = detail ? 112 : 56 // facade / roof segments

  // --- The bowl's outer wall, dressed in the wrap: facets from the foot
  // (pitch level, hidden under the podium) to the wrap's top.
  const WSEG = SEG * 2
  for (let i = 0; i < WSEG; i++) {
    const t0 = i / WSEG, t1 = (i + 1) / WSEG
    const b0 = ring(WALL[0], WALL[1], t0, 0), b1 = ring(WALL[0], WALL[1], t1, 0)
    const m0 = ring(WALL[0], WALL[1], t0, Z.podium + 2.4), m1 = ring(WALL[0], WALL[1], t1, Z.podium + 2.4)
    const top0 = ring(WALL[0], WALL[1], t0, Z.wrapTop), top1 = ring(WALL[0], WALL[1], t1, Z.wrapTop)
    // Concourse band (entrances, dark) at the podium.
    dark.quad(b0, b1, m1, m0)
    // The wrap: each facet split along a diagonal into two big triangles,
    // coloured in a repeating claret / white / sky-blue rhythm.
    const k = i % 9
    const A = k % 2 ? [m0, m1, top1] : [m0, m1, top0]
    const B = k % 2 ? [m0, top1, top0] : [m1, top1, top0]
    const colA = k === 1 || k === 4 || k === 7 ? claret : k === 8 ? blue : wrap
    const colB = k === 2 || k === 6 ? claret : k === 4 ? blue : wrap
    colA.tri(A[0], A[1], A[2])
    colB.tri(B[0], B[1], B[2])
  }
  // Wrap top: a flat ledge back to the recess wall, then the dark recess up
  // to the roof's leading edge, and the dark soffit out to the truss.
  for (let i = 0; i < SEG; i++) {
    const t0 = i / SEG, t1 = (i + 1) / SEG
    const w0 = ring(WALL[0], WALL[1], t0, Z.wrapTop), w1 = ring(WALL[0], WALL[1], t1, Z.wrapTop)
    const r0 = ring(RECESS[0], RECESS[1], t0, Z.wrapTop), r1 = ring(RECESS[0], RECESS[1], t1, Z.wrapTop)
    wrap.quad(w0, w1, r1, r0)
    const h0 = ring(RECESS[0], RECESS[1], t0, Z.roofOut - 1.2), h1 = ring(RECESS[0], RECESS[1], t1, Z.roofOut - 1.2)
    dark.quad(r0, r1, h1, h0)
    // soffit: from the recess top out/in to the truss line, facing down
    const s0 = ring(TRUSS[0] + 3, TRUSS[1] + 3, t0, Z.roofOut - 0.6), s1 = ring(TRUSS[0] + 3, TRUSS[1] + 3, t1, Z.roofOut - 0.6)
    both(dark, h0, s0, s1, h1)
  }

  // --- The roof: light grey membrane from the truss up to the inner edge,
  // drawn on both sides (its underside is seen from the stands), on radial
  // ribs.
  const roofRings = [
    [TRUSS[0] + 3, TRUSS[1] + 3, Z.roofOut - 0.6],
    [TRUSS[0] - 2.5, TRUSS[1] - 2.5, Z.roofOut + 0.1],
    [lerp(TRUSS[0], OPEN[0], 0.5), lerp(TRUSS[1], OPEN[1], 0.5), lerp(Z.roofOut, Z.roofIn, 0.5) - 0.5],
    [OPEN[0], OPEN[1], Z.roofIn],
  ]
  for (let i = 0; i < SEG; i++) {
    const t0 = i / SEG, t1 = (i + 1) / SEG
    for (let r = 0; r < roofRings.length - 1; r++) {
      const [a0, b0, z0] = roofRings[r], [a1, b1, z1] = roofRings[r + 1]
      const p = [ring(a0, b0, t0, z0), ring(a0, b0, t1, z0), ring(a1, b1, t1, z1), ring(a1, b1, t0, z1)]
      membrane.quad(p[0], p[1], p[2], p[3])
    }
  }
  const ribs = detail ? 112 : 56
  for (let i = 0; i < ribs; i++) {
    const t = (i + 0.5) / ribs
    const pts = roofRings.slice(1).map(([a, b, z]) => add(ring(a, b, t, z), [0, 0, 0.55]))
    tube(white, pts, detail ? 0.45 : 0.55, detail ? 4 : 3)
  }
  // Inner tension ring.
  const inner = Array.from({ length: SEG }, (_, i) => ring(OPEN[0] - 0.4, OPEN[1] - 0.4, i / SEG, Z.roofIn - 0.4))
  tube(dark, inner, detail ? 0.9 : 1.0, detail ? 8 : 4, true)
  // Floodlight frames hanging from the inner edge: inverted triangles.
  const frames = 14
  for (let i = 0; i < frames; i++) {
    const t = (i + 0.5) / frames
    const o = outward(OPEN[0], OPEN[1], t), along: V3 = [-o[1], o[0], 0]
    const c = ring(OPEN[0] + 3, OPEN[1] + 3, t, Z.roofIn - 0.6)
    const a = add(c, scl(along, -7)), b = add(c, scl(along, 7)), tip = add(add(c, scl(o, 2)), [0, 0, -9])
    for (const [u, v] of [[a, b], [b, tip], [tip, a]] as [V3, V3][]) rod(white, u, v, detail ? 0.4 : 0.55, detail ? 4 : 3)
    rod(dark, add(a, [0, 0, -1.4]), add(b, [0, 0, -1.4]), 0.8, 4) // the lamp bar
    if (detail) {
      const back = add(c, scl(o, 7))
      rod(white, a, back, 0.3, 4)
      rod(white, b, back, 0.3, 4)
      rod(white, tip, back, 0.3, 4)
    }
  }

  // --- The seating bowl under the roof: lower tier and upper tier.
  const seats = [
    [44, 64, 1.0],
    [74, 95, 13.5],
    [79, 100, 15.5],
    [126, 149, 29],
  ]
  for (let i = 0; i < SEG; i++) {
    const t0 = i / SEG, t1 = (i + 1) / SEG
    for (let r = 0; r < seats.length - 1; r++) {
      const [a0, b0, z0] = seats[r], [a1, b1, z1] = seats[r + 1]
      const col = r === 1 ? dark : wrap
      col.quad(ring(a0, b0, t0, z0), ring(a1, b1, t0, z1), ring(a1, b1, t1, z1), ring(a0, b0, t1, z0))
    }
    // The front wall of the lower tier, down to the pitch.
    dark.quad(ring(44, 64, t0, 0), ring(44, 64, t1, 0), ring(44, 64, t1, 1.0), ring(44, 64, t0, 1.0))
    dark.quad(ring(44, 64, t0, 1.0), ring(44, 64, t1, 1.0), ring(44, 64, t1, 0), ring(44, 64, t0, 0))
  }

  // --- The compression truss: a triangular section, top chord over two
  // bottom chords, Warren web on both raked faces.
  const top: V3[] = [], bi: V3[] = [], bo: V3[] = []
  for (let i = 0; i < N; i++) {
    const t = i / N
    top.push(ring(TRUSS[0], TRUSS[1], t, Z.trussTop - 0.7))
    bi.push(ring(TRUSS[0] - 2.5, TRUSS[1] - 2.5, t, Z.roofOut + 0.3))
    bo.push(ring(TRUSS[0] + 2.5, TRUSS[1] + 2.5, t, Z.roofOut + 0.3))
  }
  const chordR = detail ? 0.8 : 1.0, webR = detail ? 0.5 : 0.62, sides = detail ? 6 : 4
  tube(white, top, chordR, sides, true)
  tube(white, bo, chordR * 0.9, sides, true)
  tube(white, bi, chordR * 0.8, sides, true)
  for (let i = 0; i < N; i++) {
    const j = (i + 1) % N
    // Warren web: from each top node down to the next bottom node.
    if (i % 2 === 0) {
      rod(white, top[i], bo[j], webR, detail ? 4 : 3)
      rod(white, top[i], bi[j], webR, detail ? 4 : 3)
    } else {
      rod(white, bo[i], top[j], webR, detail ? 4 : 3)
      rod(white, bi[i], top[j], webR, detail ? 4 : 3)
    }
    if (detail && i % 2 === 0) rod(white, bi[i], bo[i], 0.3, 4)
  }

  // --- Raking Λ column pairs: from the truss's outer bottom chord out and
  // down to the podium outside the wrap.
  const cols = 28
  for (let i = 0; i < cols; i++) {
    const t = (i + 0.5) / cols
    const o = outward(FOOT[0], FOOT[1], t), along: V3 = [-o[1], o[0], 0]
    const head = ring(TRUSS[0] + 2.5, TRUSS[1] + 2.5, t, Z.roofOut + 0.3)
    const foot = ring(FOOT[0], FOOT[1], t, Z.podium - 0.5)
    for (const s of [-1, 1]) rod(white, head, add(foot, scl(along, s * 9)), detail ? 0.7 : 0.85, detail ? 6 : 4)
  }

  return [
    { part: white, material: M.white },
    { part: membrane, material: M.membrane },
    { part: wrap, material: M.wrap },
    { part: claret, material: M.claret },
    { part: blue, material: M.blue },
    { part: dark, material: M.dark },
  ]
}

if (import.meta.main) {
  const extras = { license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor' }
  for (const [detail, file] of [[false, `models/${ID}.glb`], [true, `models/${ID}.detail.glb`]] as const) {
    const parts = build(detail)
    const tris = parts.reduce((s, { part }) => s + part.triangles, 0)
    const glb = writeGlb('London Stadium', parts, extras)
    writeFileSync(new URL(`../${file}`, import.meta.url), glb)
    console.log(`${file}: ${tris} triangles, ${glb.length} bytes`)
  }
}
