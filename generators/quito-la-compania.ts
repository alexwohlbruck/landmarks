/**
 * Iglesia de la Compañía de Jesús, Quito — procedural, CC0-1.0, no textures.
 * bun generators/quito-la-compania.ts
 *
 * This file also holds the small kit shared by the Quito churches
 * (quito-san-francisco, quito-cathedral import it): pierced walls with real
 * openings, wall screens, merlon rows and rings, lathed tile domes, lanterns,
 * iron crosses and Solomonic columns. The Compañía's own build runs only
 * under `import.meta.main`.
 *
 * Map frame: x east, y north, z up, metres, turned to the church's axis. The
 * long walls in OSM run at 130° / 310°; the facade is on the south-east end,
 * on Calle García Moreno, and the altar to the north-west, so the placement
 * bearing is 310 and the facade faces the model's south (y = −34.4). The
 * anchor is the area centroid of the OSM outline way/673869411
 * (lng −78.5138410, lat −0.2207742).
 *
 * What it is: a Jesuit Latin-cross church (1605–1765; facade 1722–1765 by
 * Leonardo Deubler and Venancio Gandolfi), a barrel-vaulted nave between
 * lower aisles carrying small domes, a transept with the crossing dome on a
 * tall drum, a second dome over the presbytery, all walls white-washed with
 * white merlon parapets, and the domes in green glazed tile. The street front
 * is a grey andesite screen, two storeys: the lower one full width with three
 * doors, the main arched portal flanked by two groups of three Solomonic
 * (twisted) columns; the upper one the width of the nave with a window,
 * niches and a broken curved crest, joined to the lower corners by concave
 * ramps.
 *
 * Replaces the outline way/673869411 and its parts way/673869408 (nave),
 * way/1118492144 and way/1118492145 (aisles), way/673869409 (transept and
 * presbytery) and way/673869410 (crossing dome).
 *
 * Evidence
 * - OSM (measured, turned 310°): outline x −15.8…14.5, y −34.4…41.2;
 *   facade at y −34.4, 29.8 m wide; nave x −7.65…5.45; aisles to x −15.8 and
 *   14.1; transept y 7.5…24.3; crossing dome circle centre (−0.55, 17.9),
 *   12.9 m across; presbytery y 24.3…35.5, x −7.1…4.6, with a service wing to
 *   the east to y 41. OSM heights: outline 20, nave 14 (round roof), aisles
 *   10, transept/presbytery 16, dome part 20.
 * - Published (es.wikipedia, "Iglesia de la Compañía (Quito)"): crossing
 *   26.5 m wide, dome 27.6 m high inside and 10–10.6 m across; the six
 *   Solomonic columns 5 m tall; aisles carry "small domes and cupolas"; a
 *   dome over the presbytery; the bell tower was cut down to the level of
 *   the roof after the 1868 earthquake and never rebuilt, so the model has no
 *   tower (the lead's note asked for one; the photos show none).
 * - Photo-scaled (estimated): front (photo 2, 29.8 m = 1220 px, upper parts
 *   raised 8 % for the upward view): lower cornice 10.0–10.8, side ramps from
 *   12.1 at the corners to 16.6, upper cornice 17.2, crest 19.6, finial and
 *   iron sunburst to 23; main portal 3.6 m wide, 6.4 high; side doors 2.35 ×
 *   4.6. Domes (photo 1, drum 12.9 m wide): crossing base ring to 17.6,
 *   drum 17.6–23, dome to 28.1, lantern to 30.4, cupola 32.2, cross 35.5;
 *   presbytery dome on a round base to 17, dome to 20.5, octagonal lantern
 *   and pointed tile cap to 24.6. Nave walls 12.3 with a segmental vault to
 *   14.6, aisles 10, transept 16 (OSM).
 * - Terrain: Mapterhorn z12 only (z13–15 404). It rises about 4–5 m from the
 *   facade (low) to the presbytery; the facade stands on y = 0 and the back
 *   sinks into the slope. elevation 0.
 * - Photos (Wikimedia Commons, EVIDENCE):
 *   1 "Iglesia de la Compañía (Quito) photographed from Plaza San Francisco.JPG",
 *     David Adam Kess, CC BY-SA 4.0 — both domes from the south-west.
 *   2 "Iglesia de la Compañia - panoramio - Quito magnífico (4).jpg", Quito
 *     magnífico, CC BY-SA 3.0 — the facade square on.
 *   3 "Iglesia La Compania, Quito, Ecuador.JPG", Shoestring (Wikivoyage),
 *     CC BY-SA 4.0 — facade from the south, white south-west flank and dome.
 *   4 "Compañía de Jesús, Quito 14.jpg", Ranoutofusername, CC BY-SA 4.0 —
 *     facade in sun, stone colour.
 *   5 "Iglesia de la Compañía, Quito, Ecuador, 2015-07-22, DD 220-222 HDR.JPG",
 *     Diego Delso, CC BY-SA 4.0 — the domes floodlit at night.
 *   6 "Cupulas de la Iglesia de la Compañia - panoramio.jpg", Quito magnífico,
 *     CC BY-SA 3.0 — both domes and the merlon parapets.
 * - Look-only: none.
 * - Colours (resampled at the lead's review): andesite #85796b, the warm
 *   brown-grey of photos 2 and 3; carved recesses, niches and the dark
 *   wooden doors #54483f; white-wash #f1eee6; the glazed tile #a3ad9c, the
 *   mottled grey-green and white checker of photo 1.
 * - Review round 1 (lead): the front rebuilt as a wide lower storey, a
 *   narrower upper storey, S-curved volute shoulders with scrolls, a raised
 *   attic with a broken curved pediment, and corner pedestals with statues;
 *   the central bay 0.7 m and the column groups 1.75 m proud, cornices
 *   projecting, doors in 1.25–2 m reveals; six free-standing twisted columns
 *   (r 0.44 m, 8 sides) and four smaller twisted columns on the upper
 *   storey; bolder merlon rings and corbel bands on the dome bases.
 * - Doubts: no licensed view from above, so the nave roof (drawn as a
 *   tiled barrel vault after OSM's round roof and the tiled surface at the
 *   foot of photo 1), the aisle cupolas' number and size (one per bay,
 *   invented from the published description) and the east service wing's
 *   height (OSM 16, drawn 15) are estimates. The flanks are hidden by
 *   neighbours except the south-west one (photo 3).
 * - Night: the facade is floodlit, the drums, domes and lanterns too (photo
 *   5); the white flanks are lit less.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { lathe } from './dc-nmaahc'
import { cbox, earcut, ccw, ngon, ngonPrism, qf, rect, roundArch, spire, tf, type Side } from './dc-national-cathedral'

// ===========================================================================
// The Quito church kit.

export type AZ = [number, number]
export const NRM: Record<Side, V3> = { n: [0, 1, 0], s: [0, -1, 0], e: [1, 0, 0], w: [-1, 0, 0] }
const TAN: Record<Side, V3> = { n: [1, 0, 0], s: [1, 0, 0], e: [0, 1, 0], w: [0, 1, 0] }
/** A point on a wall plane: `a` along the wall, `z` up, `d` into the wall (negative: out of it). */
export const wallPt = (side: Side, at: number, a: number, z: number, d = 0): V3 => {
  switch (side) {
    case 's': return [a, at + d, z]
    case 'n': return [a, at - d, z]
    case 'w': return [at + d, a, z]
    default: return [at - d, a, z]
  }
}
const dir = (side: Side, da: number, dz: number): V3 => { const t = TAN[side]; return [t[0] * da, t[1] * da, dz] }

export type Op = { a0: number; a1: number; zb: number; zt: number; arch?: boolean; seg?: number }

/**
 * A wall face with real openings: the outer plane with holes, reveals `d`
 * deep, and a dark back panel (`dark`) in each opening.
 */
export function pierced(p: Part, dark: Part, side: Side, at: number, a0: number, a1: number, z0: number, z1: number, ops: Op[], d = 0.7, seg = 4) {
  const n = NRM[side], T = TAN[side], up: V3 = [0, 0, 1]
  const P = (a: number, z: number, dd = 0) => wallPt(side, at, a, z, dd)
  const Q = (pp: Part, b0: number, b1: number, zb: number, zt: number, dd = 0) => {
    if (b1 - b0 < 1e-6 || zt - zb < 1e-6) return
    qf(pp, P(b0, zb, dd), P(b1, zb, dd), P(b1, zt, dd), P(b0, zt, dd), n)
  }
  let cur = a0
  for (const o of [...ops].sort((u, v) => u.a0 - v.a0)) {
    Q(p, cur, o.a0, z0, z1)
    cur = o.a1
    const r = (o.a1 - o.a0) / 2, am = (o.a0 + o.a1) / 2
    const hs = o.arch ? o.zt - r : o.zt
    Q(p, o.a0, o.a1, z0, o.zb)
    Q(p, o.a0, o.a1, o.zt, z1)
    qf(p, P(o.a0, o.zb), P(o.a0, o.zb, d), P(o.a0, hs, d), P(o.a0, hs), T)
    qf(p, P(o.a1, o.zb), P(o.a1, o.zb, d), P(o.a1, hs, d), P(o.a1, hs), [-T[0], -T[1], -T[2]])
    if (o.zb > z0 + 1e-6) qf(p, P(o.a0, o.zb), P(o.a1, o.zb), P(o.a1, o.zb, d), P(o.a0, o.zb, d), up)
    Q(dark, o.a0, o.a1, o.zb, hs, d)
    if (!o.arch) {
      qf(p, P(o.a0, hs), P(o.a1, hs), P(o.a1, hs, d), P(o.a0, hs, d), [0, 0, -1])
      continue
    }
    const sg = 2 * Math.ceil((o.seg ?? seg) / 2) // even, so the crown splits between the two corners
    for (let k = 0; k < sg; k++) {
      const t0 = (Math.PI * k) / sg, t1 = (Math.PI * (k + 1)) / sg
      const A: AZ = [am + r * Math.cos(t0), hs + r * Math.sin(t0)], B: AZ = [am + r * Math.cos(t1), hs + r * Math.sin(t1)]
      const corner: AZ = k < sg / 2 ? [o.a1, o.zt] : [o.a0, o.zt]
      tf(p, P(...corner), P(...A), P(...B), n)
      const tm = (t0 + t1) / 2
      qf(p, P(...A), P(...B), P(B[0], B[1], d), P(A[0], A[1], d), dir(side, -Math.cos(tm), -Math.sin(tm)))
      tf(dark, P(am, hs, d), P(A[0], A[1], d), P(B[0], B[1], d), n)
    }
  }
  Q(p, cur, a1, z0, z1)
}

/** A flat polygon (in a, z) on a wall, extruded `t` into it: a screen, crest or ramp. */
export function screen(p: Part, side: Side, at: number, poly: AZ[], t: number, back = false) {
  const ring = ccw(poly) as AZ[]
  const n = NRM[side], nb: V3 = [-n[0], -n[1], -n[2]]
  for (const [i, j, k] of earcut(ring)) {
    tf(p, wallPt(side, at, ...ring[i]), wallPt(side, at, ...ring[j]), wallPt(side, at, ...ring[k]), n)
    if (back) tf(p, wallPt(side, at, ...ring[i], t), wallPt(side, at, ...ring[j], t), wallPt(side, at, ...ring[k], t), nb)
  }
  for (let i = 0; i < ring.length; i++) {
    const A = ring[i], B = ring[(i + 1) % ring.length]
    const da = B[0] - A[0], dz = B[1] - A[1]
    if (Math.hypot(da, dz) < 1e-6) continue
    qf(p, wallPt(side, at, ...A), wallPt(side, at, ...B), wallPt(side, at, ...B, t), wallPt(side, at, ...A, t), dir(side, dz, -da))
  }
}

/** A half outline (a ≥ 0 about c) mirrored into a whole one. */
export const mirror = (half: AZ[], c: number): AZ[] => [...half.map(([a, z]) => [c + a, z] as AZ), ...[...half].reverse().map(([a, z]) => [c - a, z] as AZ)]

/** A block on a wall: a0..a1 along it, z0..z1, standing `d` proud of the plane `at` (back face omitted). */
export function proud(p: Part, side: Side, at: number, a0: number, a1: number, z0: number, z1: number, d: number, bottom = false) {
  const n = NRM[side], T = TAN[side]
  const P = (a: number, z: number, k: number) => wallPt(side, at, a, z, -k)
  qf(p, P(a0, z0, d), P(a1, z0, d), P(a1, z1, d), P(a0, z1, d), n)
  qf(p, P(a0, z0, 0), P(a0, z0, d), P(a0, z1, d), P(a0, z1, 0), [-T[0], -T[1], 0])
  qf(p, P(a1, z0, 0), P(a1, z0, d), P(a1, z1, d), P(a1, z1, 0), T)
  qf(p, P(a0, z1, 0), P(a1, z1, 0), P(a1, z1, d), P(a0, z1, d), [0, 0, 1])
  if (bottom) qf(p, P(a0, z0, 0), P(a1, z0, 0), P(a1, z0, d), P(a0, z0, d), [0, 0, -1])
}

/** One merlon: a small block centred at (x, y), turned so `ang` runs along the parapet. No bottom. */
export function merlon(p: Part, x: number, y: number, z: number, ang: number, w: number, t: number, h: number) {
  const T: V3 = [Math.cos(ang), Math.sin(ang), 0], N: V3 = [-Math.sin(ang), Math.cos(ang), 0]
  const C = (u: number, v: number, zz: number): V3 => [x + T[0] * u + N[0] * v, y + T[1] * u + N[1] * v, zz]
  const u = w / 2, v = t / 2, z1 = z + h
  qf(p, C(-u, -v, z1), C(u, -v, z1), C(u, v, z1), C(-u, v, z1), [0, 0, 1])
  qf(p, C(-u, -v, z), C(u, -v, z), C(u, -v, z1), C(-u, -v, z1), [-N[0], -N[1], 0])
  qf(p, C(-u, v, z), C(u, v, z), C(u, v, z1), C(-u, v, z1), N)
  qf(p, C(-u, -v, z), C(-u, v, z), C(-u, v, z1), C(-u, -v, z1), [-T[0], -T[1], 0])
  qf(p, C(u, -v, z), C(u, v, z), C(u, v, z1), C(u, -v, z1), T)
}

/** Merlons along a straight parapet from A to B, `pitch` apart, set `inset` inside the edge (to the left of A→B). */
export function merlonRow(p: Part, A: [number, number], B: [number, number], z: number, pitch = 1.6, w = 0.7, t = 0.45, h = 0.75, inset = 0.25) {
  const L = Math.hypot(B[0] - A[0], B[1] - A[1]), ang = Math.atan2(B[1] - A[1], B[0] - A[0])
  const n = Math.max(1, Math.round(L / pitch)), nx = -Math.sin(ang), ny = Math.cos(ang)
  for (let k = 0; k < n; k++) {
    const s = (k + 0.5) / n
    merlon(p, A[0] + (B[0] - A[0]) * s + nx * inset, A[1] + (B[1] - A[1]) * s + ny * inset, z, ang, w, t, h)
  }
}

/** Merlons round a circle. */
export function merlonRing(p: Part, cx: number, cy: number, r: number, z: number, n: number, w = 0.7, t = 0.45, h = 0.75) {
  for (let k = 0; k < n; k++) {
    const a = (2 * Math.PI * (k + 0.5)) / n
    merlon(p, cx + r * Math.cos(a), cy + r * Math.sin(a), z, a + Math.PI / 2, w, t, h)
  }
}

/** A flattened dome's profile: radius r at z0 rising `rise`, closing to rTop. */
export function domeProfile(r: number, z0: number, rise: number, rTop: number, steps = 5): [number, number][] {
  const tTop = Math.acos(Math.min(1, rTop / r)), out: [number, number][] = []
  for (let k = 0; k <= steps; k++) { const t = (tTop * k) / steps; out.push([r * Math.cos(t), z0 + rise * Math.sin(t)]) }
  return out
}

/** Eight (or n) raised ribs following a dome profile, to read the tiled gores. */
export function domeRibs(p: Part, cx: number, cy: number, prof: [number, number][], n: number, h = 0.25, w = 0.3) {
  for (let k = 0; k < n; k++) {
    const ang = (2 * Math.PI * k) / n, c = Math.cos(ang), s = Math.sin(ang)
    const R3 = (r: number, z: number, u: number): V3 => [cx + c * r - s * u, cy + s * r + c * u, z]
    for (let i = 0; i < prof.length - 1; i++) {
      const [r0, z0] = prof[i], [r1, z1] = prof[i + 1]
      const nr = z1 - z0, nz = -(r1 - r0), nl = Math.hypot(nr, nz)
      const o0: AZ = [r0 + (nr / nl) * h, z0 + (nz / nl) * h], o1: AZ = [r1 + (nr / nl) * h, z1 + (nz / nl) * h]
      const out: V3 = [(c * nr) / nl, (s * nr) / nl, nz / nl]
      qf(p, R3(r0, z0, -w), R3(r1, z1, -w), R3(o1[0], o1[1], 0), R3(o0[0], o0[1], 0), [out[0] + s, out[1] - c, out[2]])
      qf(p, R3(r0, z0, w), R3(r1, z1, w), R3(o1[0], o1[1], 0), R3(o0[0], o0[1], 0), [out[0] - s, out[1] + c, out[2]])
    }
  }
}

/** Flat window panels round an n-gon's faces (apothem `ap`), every `step`-th face. */
export function ringWindows(p: Part, cx: number, cy: number, ap: number, n: number, z0: number, z1: number, halfW: number, rot = 0, step = 1, arch = true) {
  for (let k = 0; k < n; k += step) {
    const a = rot + (2 * Math.PI * (k + 0.5)) / n, c = Math.cos(a), s = Math.sin(a), d = ap + 0.05
    const P = (u: number, z: number): V3 => [cx + c * d - s * u, cy + s * d + c * u, z]
    const spring = arch ? z1 - halfW : z1
    qf(p, P(-halfW, z0), P(halfW, z0), P(halfW, spring), P(-halfW, spring), [c, s, 0])
    if (arch) for (let j = 0; j < 4; j++) {
      const t0 = (Math.PI * j) / 4, t1 = (Math.PI * (j + 1)) / 4
      tf(p, P(0, spring), P(halfW * Math.cos(t0), spring + halfW * Math.sin(t0)), P(halfW * Math.cos(t1), spring + halfW * Math.sin(t1)), [c, s, 0])
    }
  }
}

/** A Latin cross: a post from z0 to z0 + h and an arm, `t` thick. */
export function ironCross(p: Part, cx: number, cy: number, z0: number, h: number, arm: number, t: number, ang = 0) {
  const T: V3 = [Math.cos(ang), Math.sin(ang), 0]
  const bar = (u0: number, u1: number, za: number, zb: number) => {
    const N: V3 = [-T[1], T[0], 0]
    const C = (u: number, v: number, z: number): V3 => [cx + T[0] * u + N[0] * v, cy + T[1] * u + N[1] * v, z]
    const v = t / 2
    qf(p, C(u0, -v, za), C(u1, -v, za), C(u1, -v, zb), C(u0, -v, zb), [-N[0], -N[1], 0])
    qf(p, C(u0, v, za), C(u1, v, za), C(u1, v, zb), C(u0, v, zb), N)
    qf(p, C(u0, -v, za), C(u0, v, za), C(u0, v, zb), C(u0, -v, zb), [-T[0], -T[1], 0])
    qf(p, C(u1, -v, za), C(u1, v, za), C(u1, v, zb), C(u1, -v, zb), T)
    qf(p, C(u0, -v, zb), C(u1, -v, zb), C(u1, v, zb), C(u0, v, zb), [0, 0, 1])
    qf(p, C(u0, -v, za), C(u1, -v, za), C(u1, v, za), C(u0, v, za), [0, 0, -1])
  }
  bar(-t / 2, t / 2, z0, z0 + h)
  bar(-arm / 2, -t / 2, z0 + h * 0.62, z0 + h * 0.62 + t)
  bar(t / 2, arm / 2, z0 + h * 0.62, z0 + h * 0.62 + t)
}

/**
 * A Solomonic (twisted) column: n-sided rings whose centres wind round the
 * axis `turns` times, so the shaft reads as a spiral at any size.
 */
export function solomonic(p: Part, cx: number, cy: number, r: number, z0: number, z1: number, turns = 2.5, sides = 6, levels = 10, wobble = 0.3) {
  // Smooth-shaded: each vertex's normal points out from its ring's centre,
  // so the welded shaft costs one vertex per ring corner.
  const ring = (k: number) => {
    const t = k / levels, ph = 2 * Math.PI * turns * t, e = k === 0 || k === levels ? 0 : r * wobble
    const c: V3 = [cx + e * Math.cos(ph), cy + e * Math.sin(ph), z0 + (z1 - z0) * t]
    return Array.from({ length: sides }, (_, i) => {
      const a = (2 * Math.PI * i) / sides
      return { p: [c[0] + r * Math.cos(a), c[1] + r * Math.sin(a), c[2]] as V3, n: [Math.cos(a), Math.sin(a), 0] as V3 }
    })
  }
  for (let k = 0; k < levels; k++) {
    const A = ring(k), B = ring(k + 1)
    for (let i = 0; i < sides; i++) {
      const j = (i + 1) % sides
      p.tri(A[i].p, A[j].p, B[j].p, undefined, undefined, undefined, [A[i].n, A[j].n, B[j].n])
      p.tri(A[i].p, B[j].p, B[i].p, undefined, undefined, undefined, [A[i].n, B[j].n, B[i].n])
    }
  }
}

/** Write the GLB under the budgets. */
export async function saveModel(id: string, name: string, parts: Array<{ part: Part; material: any }>, maxTris = 6500) {
  const used = parts.filter(({ part }) => part.triangles)
  const tris = used.reduce((s, { part }) => s + part.triangles, 0)
  for (const { part, material } of used) console.log(`  ${material.name}: ${part.triangles}`)
  if (used.length > 6) throw new Error(`${id}: ${used.length} materials`)
  const glb = writeGlb(name, used, { license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor', source: `generators/${id}.ts` })
  if (!process.env.LOOSE && tris > maxTris) throw new Error(`${id}: ${tris} triangles`)
  if (!process.env.LOOSE && glb.length > 250 * 1024) throw new Error(`${id}: ${glb.length} bytes`)
  const out = new URL(`../models/${id}.glb`, import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${tris} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
}

// ===========================================================================
// La Compañía.

function build() {
  const stone = new Part(), dark = new Part(), white = new Part(), tile = new Part(), win = new Part(), iron = new Part()
  const door = dark // the doors are dark wood

  const AX = -1.0 // nave and facade axis
  const FY = -34.4 // facade front
  const X0 = -15.8, X1 = 14.0 // facade ends
  const xs = (dx: number) => AX + dx

  // ---- Body: aisles, nave, transept, presbytery (white-wash).
  const BY0 = -33.0, TY0 = 7.5, TY1 = 24.3
  const NX0 = -7.65, NX1 = 5.45
  const Z_AI = 10, Z_NV = 12.3, Z_VT = 14.6, Z_TR = 16
  // Outer aisle walls rise 1.5 m past the aisle roof as a parapet (photo 3).
  for (const [a, b] of [[X0, NX0], [NX1, 14.1]]) {
    cbox(white, rect(a, b, BY0, TY0), 0, Z_AI, { top: white })
    const o = a === X0 ? rect(X0, X0 + 0.5, BY0, TY0) : rect(13.6, 14.1, BY0, TY0)
    cbox(white, o, Z_AI, Z_AI + 1.5, { top: white })
  }
  cbox(white, rect(NX0, NX1, BY0, TY0), 0, Z_NV, { top: false })
  // The nave's barrel vault: a segmental arc across, tiled.
  {
    const hw = (NX1 - NX0) / 2, cx = (NX0 + NX1) / 2, rise = Z_VT - Z_NV
    const R = (hw * hw + rise * rise) / (2 * rise), zc = Z_VT - R, th = Math.asin(hw / R), n = 6
    const pts: AZ[] = []
    for (let k = 0; k <= n; k++) { const t = -th + (2 * th * k) / n; pts.push([cx + R * Math.sin(t), zc + R * Math.cos(t)]) }
    for (let k = 0; k < n; k++) {
      const [a0, z0] = pts[k], [a1, z1] = pts[k + 1], tm = -th + (2 * th * (k + 0.5)) / n
      qf(tile, [a0, BY0, z0], [a1, BY0, z1], [a1, TY0, z1], [a0, TY0, z0], [Math.sin(tm), 0, Math.cos(tm)])
    }
  }
  cbox(white, rect(-15.6, 14.1, TY0, TY1), 0, Z_TR, { top: white })
  // Presbytery and the service wing behind it.
  const PRES: AZ[] = [[-7.1, TY1], [14.1, TY1], [14.3, 38.7], [14.5, 41.2], [4.7, 40.8], [4.6, 35.5], [-1.3, 35.5], [-7.2, 31.2]]
  {
    const ring = ccw(PRES) as AZ[]
    for (let i = 0; i < ring.length; i++) {
      const A = ring[i], B = ring[(i + 1) % ring.length]
      qf(white, [A[0], A[1], 0], [B[0], B[1], 0], [B[0], B[1], 15], [A[0], A[1], 15], [B[1] - A[1], -(B[0] - A[0]), 0])
    }
    for (const [i, j, k] of earcut(ring)) tf(white, [...ring[i], 15] as V3, [...ring[j], 15] as V3, [...ring[k], 15] as V3, [0, 0, 1])
  }
  // White merlon parapets on the aisle flanks and round the transept.
  merlonRow(white, [X0, 7.5], [X0, BY0], Z_AI + 1.5, 2.6)
  merlonRow(white, [14.1, BY0], [14.1, 7.5], Z_AI + 1.5, 2.6)
  merlonRow(white, [-15.6, TY1], [-15.6, TY0], Z_TR, 2.6)
  merlonRow(white, [14.1, TY0], [14.1, TY1], Z_TR, 2.6)
  merlonRow(white, [-15.6, TY0], [NX0, TY0], Z_TR, 2.6)
  merlonRow(white, [NX1, TY0], [14.1, TY0], Z_TR, 2.6)
  merlonRow(white, [-7.2, 31.2], [-7.1, TY1], 15, 2.6)
  merlonRow(white, [-1.3, 35.5], [-7.2, 31.2], 15, 2.6)
  // Flank windows: arched, high in the south-west aisle and transept ends.
  for (const y of [-27, -19, -11, -3, 5]) roundArch(win, 'w', X0, y - 0.8, y + 0.8, 5.5, 8.5, 0.05, 4)
  for (const y of [12.5, 19.5]) roundArch(win, 'w', -15.6, y - 1, y + 1, 9.5, 13.5, 0.05, 4)

  // ---- Aisle cupolas: one small tiled dome on an octagonal drum per bay.
  for (const cx of [(X0 + NX0) / 2, (NX1 + 14.1) / 2]) {
    for (const cy of [-28.8, -20.6, -12.4, -4.2, 4.0]) {
      lathe(white, cx, cy, [[2.4, Z_AI], [2.4, Z_AI + 1.9]], 8, false)
      lathe(tile, cx, cy, [...domeProfile(2.4, Z_AI + 1.9, 1.5, 0.5, 3), [0.5, Z_AI + 3.9], [0.65, Z_AI + 4.2], [0, Z_AI + 4.8]], 8, false)
    }
  }

  // ---- The crossing dome.
  {
    const cx = AX + 0.45, cy = 17.9
    // Round base ring with its merlon parapet, rising out of the transept roof.
    lathe(white, cx, cy, [[6.45, Z_TR - 0.5], [6.45, 17.6], [5.7, 17.6]], 16, false)
    lathe(white, cx, cy, [[6.45, 16.8], [6.95, 16.8], [6.95, 17.6], [6.45, 17.6]], 16, false)
    merlonRing(white, cx, cy, 6.6, 17.6, 20, 1.15, 0.6, 1.15)
    // Drum with eight arched windows and a cornice.
    lathe(white, cx, cy, [[5.6, 17.6], [5.6, 23.0], [5.95, 23.0], [5.95, 23.55], [5.6, 23.55]], 16, false)
    ringWindows(win, cx, cy, 5.6 * Math.cos(Math.PI / 16), 16, 18.8, 21.9, 0.6, 0, 2)
    const prof = domeProfile(5.6, 23.5, 3.9, 2.0, 5)
    lathe(tile, cx, cy, prof, 16, false)
    domeRibs(tile, cx, cy, [prof[0], prof[3], prof[5]], 8, 0.2, 0.2)
    // Lantern: a white drum with arched openings, a tile cupola, a ball and the cross.
    const lz = prof[prof.length - 1][1]
    lathe(white, cx, cy, [[2.0, lz - 0.1], [2.0, lz + 2.6], [2.3, lz + 2.6], [2.3, lz + 2.9], [2.0, lz + 2.9]], 12, false)
    ringWindows(win, cx, cy, 2.0 * Math.cos(Math.PI / 12), 12, lz + 0.5, lz + 2.2, 0.3, 0, 2)
    lathe(tile, cx, cy, domeProfile(2.0, lz + 2.9, 1.5, 0.25, 3), 12, false)
    lathe(iron, cx, cy, [[0.25, lz + 4.3], [0.4, lz + 4.6], [0.25, lz + 4.9], [0.12, lz + 5.0]], 6, true)
    ironCross(iron, cx, cy, lz + 4.9, 3.0, 1.6, 0.2, 0)
  }

  // ---- The presbytery dome: round base, low dome, octagonal lantern, pointed tile cap.
  {
    const cx = -1.25, cy = 29.9
    lathe(white, cx, cy, [[5.4, 14.5], [5.4, 17.0], [4.8, 17.0]], 16, false)
    lathe(white, cx, cy, [[5.4, 16.3], [5.85, 16.3], [5.85, 17.0], [5.4, 17.0]], 16, false)
    merlonRing(white, cx, cy, 5.5, 17.0, 16, 1.05, 0.55, 1.05)
    const prof = domeProfile(5.0, 16.9, 3.6, 1.3, 4)
    lathe(tile, cx, cy, prof, 16, false)
    domeRibs(tile, cx, cy, [prof[0], prof[2], prof[4]], 6, 0.18, 0.18)
    const lz = prof[prof.length - 1][1]
    ngonPrism(white, cx, cy, 1.55, 8, lz - 0.1, lz + 2.4, { top: false })
    ringWindows(win, cx, cy, 1.55 * Math.cos(Math.PI / 8), 8, lz + 0.4, lz + 2.0, 0.3, 0, 2)
    ngonPrism(white, cx, cy, 1.85, 8, lz + 2.4, lz + 2.7, { top: false })
    spire(tile, ngon(cx, cy, 1.85, 8, lz + 2.7), [cx, cy, lz + 5.0])
    ironCross(iron, cx, cy, lz + 4.9, 1.4, 0.8, 0.14, 0)
  }

  // ===================================================================
  // The andesite front: a wide lower storey with three deep doorways, the
  // central bay and the two groups of three Solomonic columns standing
  // proud; S-curved volute shoulders up to a narrower upper storey; a raised
  // central attic with a broken curved pediment and the finial.
  {
    const S: Side = 's'
    const LZ = 10.0, CB = 2.4, CY = FY - 0.7
    /** A disc (a volute's scroll) standing in the facade plane, y0..y1 deep. */
    const scroll = (p: Part, a: number, z: number, r: number, y0: number, y1: number) => {
      const n = 8, ring = (y: number): V3[] => Array.from({ length: n }, (_, k) => { const t = (2 * Math.PI * k) / n; return [a + r * Math.cos(t), y, z + r * Math.sin(t)] as V3 })
      const f = ring(y0), bk = ring(y1)
      for (let k = 0; k < n; k++) { const j = (k + 1) % n; const t = (2 * Math.PI * (k + 0.5)) / n; qf(p, f[k], f[j], bk[j], bk[k], [Math.cos(t), 0, Math.sin(t)]) }
      for (let k = 1; k < n - 1; k++) tf(p, f[0], f[k], f[k + 1], [0, -1, 0])
    }
    // Lower screen either side of the central bay, the side doors in deep reveals.
    for (const s of [-1, 1]) {
      const d0 = xs(s * CB), d1 = s < 0 ? X0 : X1
      const dc = xs(s * 9.95)
      pierced(stone, dark, S, FY, Math.min(d0, d1), Math.max(d0, d1), 0, LZ, [{ a0: dc - 1.17, a1: dc + 1.17, zb: 0, zt: 4.6 }], 1.25)
      qf(stone, [d1, FY, 0], [d1, FY + 1.5, 0], [d1, FY + 1.5, LZ], [d1, FY, LZ], [s, 0, 0])
      // Door frames and the carved arms over them.
      proud(stone, S, FY, dc - 1.65, dc - 1.17, 0, 5.0, 0.35)
      proud(stone, S, FY, dc + 1.17, dc + 1.65, 0, 5.0, 0.35)
      proud(stone, S, FY, dc - 1.75, dc + 1.75, 4.6, 5.3, 0.5, true)
      proud(dark, S, FY, dc - 1.3, dc + 1.3, 5.9, 8.4, 0.35, true)
      // Corner and bay pilasters.
      for (const [e0, e1] of [[13.4, 14.9], [6.8, 7.8]]) {
        const a0 = xs(s * e0), a1 = xs(s * e1)
        proud(stone, S, FY, Math.min(a0, a1), Math.max(a0, a1), 0, LZ, 0.5)
      }
      // The column group: pedestal, three free-standing twisted columns and
      // an entablature breaking forward over them.
      const g0 = xs(s * 2.4), g1 = xs(s * 5.85)
      cbox(stone, rect(Math.min(g0, g1), Math.max(g0, g1), FY - 1.75, FY), 0, 2.3, { b: 0.15 })
      cbox(stone, rect(Math.min(g0, g1), Math.max(g0, g1), FY - 1.75, FY), 7.7, LZ, { b: 0.15, bottom: true })
      for (const dd of [3.0, 4.15, 5.3]) solomonic(stone, xs(s * dd), FY - 1.0, 0.44, 2.3, 7.7, 2.0, 8, 14, 0.45)
      // A statue niche between the columns and the bay pilaster.
      const nc = xs(s * 6.3)
      roundArch(dark, S, FY - 0.05, nc - 0.42, nc + 0.42, 2.8, 6.4, 0.05, 4)
      proud(stone, S, FY, nc - 0.25, nc + 0.25, 3.0, 5.6, 0.3, true)
    }
    // The central bay, 0.7 m proud, with the arched portal 2 m deep.
    pierced(stone, dark, S, CY, xs(-CB), xs(CB), 0, LZ, [{ a0: xs(-1.8), a1: xs(1.8), zb: 0, zt: 6.4, arch: true, seg: 6 }], 2.0, 6)
    for (const s of [-1, 1]) qf(stone, [xs(s * CB), CY, 0], [xs(s * CB), FY, 0], [xs(s * CB), FY, LZ], [xs(s * CB), CY, LZ], [s, 0, 0])
    {
      const band: AZ[] = []
      for (let k = 0; k <= 6; k++) { const t = (Math.PI * k) / 6; band.push([xs(2.35 * Math.cos(t)), 4.6 + 2.35 * Math.sin(t)]) }
      for (let k = 6; k >= 0; k--) { const t = (Math.PI * k) / 6; band.push([xs(1.8 * Math.cos(t)), 4.6 + 1.8 * Math.sin(t)]) }
      screen(stone, S, CY - 0.35, band, 0.35)
    }
    proud(dark, S, CY, xs(-1.9), xs(1.9), 7.4, 9.6, 0.4, true)
    // Lower cornice: projecting all along, breaking forward over the bay and columns.
    cbox(stone, rect(X0 - 0.4, X1 + 0.4, FY - 0.7, FY + 1.5), LZ, LZ + 0.8, { b: 0.25, bottom: true })
    cbox(stone, rect(xs(-6.0), xs(6.0), FY - 2.0, FY - 0.6), LZ - 0.2, LZ + 0.9, { b: 0.25, bottom: true })

    // Corner pedestals with statues on the lower cornice.
    for (const s of [-1, 1]) {
      const p0 = xs(s * 13.3), p1 = xs(s * 15.0), pc = xs(s * 14.15)
      cbox(stone, rect(Math.min(p0, p1), Math.max(p0, p1), FY - 0.4, FY + 1.3), LZ + 0.8, 12.9, { b: 0.15 })
      ngonPrism(stone, pc, FY + 0.45, 0.5, 6, 12.9, 14.5, { top: false, r1: 0.38 })
      lathe(stone, pc, FY + 0.45, [[0.38, 14.5], [0.42, 14.8], [0.25, 15.1], [0, 15.2]], 6, false)
    }

    // Upper storey.
    const UZ0 = LZ + 0.8, UZ1 = 17.2, UY = FY + 0.3
    const ua0 = xs(-7.4), ua1 = xs(7.4)
    qf(win, [xs(-1.0), UY - 0.5 + 0.97, 12.2], [xs(1.0), UY - 0.5 + 0.97, 12.2], [xs(1.0), UY - 0.5 + 0.97, 14.7], [xs(-1.0), UY - 0.5 + 0.97, 14.7], [0, -1, 0])
    pierced(stone, dark, S, UY, ua0, xs(-2.0), UZ0, UZ1, [{ a0: xs(-5.3), a1: xs(-4.0), zb: 12.0, zt: 14.8, arch: true, seg: 4 }], 0.7, 4)
    pierced(stone, dark, S, UY, xs(2.0), ua1, UZ0, UZ1, [{ a0: xs(4.0), a1: xs(5.3), zb: 12.0, zt: 14.8, arch: true, seg: 4 }], 0.7, 4)
    // The upper central bay, 0.5 m proud, with the window 1 m deep.
    pierced(stone, dark, S, UY - 0.5, xs(-2.0), xs(2.0), UZ0, UZ1, [{ a0: xs(-1.0), a1: xs(1.0), zb: 12.2, zt: 14.7 }], 0.96)
    for (const s of [-1, 1]) {
      qf(stone, [xs(s * 2.0), UY - 0.5, UZ0], [xs(s * 2.0), UY, UZ0], [xs(s * 2.0), UY, UZ1], [xs(s * 2.0), UY - 0.5, UZ1], [s, 0, 0])
      const ea = xs(s * 7.4)
      qf(stone, [ea, UY, UZ0], [ea, FY + 1.5, UZ0], [ea, FY + 1.5, UZ1], [ea, UY, UZ1], [s, 0, 0])
      proud(stone, S, UY, Math.min(xs(s * 6.3), xs(s * 7.4)), Math.max(xs(s * 6.3), xs(s * 7.4)), UZ0, UZ1 - 0.6, 0.4)
      // Smaller twisted columns flanking the central bay and on the outer piers.
      for (const dd of [2.55, 6.85]) {
        cbox(stone, rect(xs(s * dd) - 0.45, xs(s * dd) + 0.45, UY - 1.0, UY), UZ0, UZ0 + 0.8, { b: 0.1 })
        solomonic(stone, xs(s * dd), UY - 0.55, 0.3, UZ0 + 0.8, UZ1 - 0.6, 1.5, 6, 8, 0.4)
      }
    }
    proud(dark, S, UY - 0.5, xs(-1.6), xs(1.6), 15.0, 16.5, 0.3, true)
    cbox(stone, rect(xs(-7.9), xs(7.9), FY - 0.5, FY + 1.5), UZ1 - 0.6, UZ1, { b: 0.2, bottom: true })

    // Volute shoulders from the corner pedestals up to the upper storey: low
    // and flat at the corners, sweeping up steeply into the upper storey
    // two-thirds of its height up (photo 2), with a scroll at each end.
    for (const s of [-1, 1]) {
      const ramp: AZ[] = [[7.4, LZ + 0.8], [13.3, LZ + 0.8], [13.3, 11.9]]
      for (let k = 1; k <= 8; k++) { const t = k / 8; ramp.push([13.3 - 5.9 * t, 11.9 + 4.1 * Math.pow(t, 2.6)]) }
      screen(stone, S, FY + 0.15, ramp.map(([a, z]) => [xs(s * a), z] as AZ), 1.3)
      scroll(stone, xs(s * 12.5), 12.0, 0.8, FY - 0.15, FY + 1.3)
      scroll(stone, xs(s * 7.95), 15.4, 0.6, FY - 0.05, FY + 1.3)
    }

    // The raised central attic, the broken curved pediment and the finial.
    const AZ1 = UZ1 + 1.2
    cbox(stone, rect(xs(-4.6), xs(4.6), UY - 0.3, FY + 1.5), UZ1, AZ1, { b: 0.15, top: stone })
    for (const sg of [-1, 1]) {
      const half: AZ[] = [[4.6, AZ1], [1.0, AZ1]]
      for (let k = 0; k <= 6; k++) { const t = k / 6, a = 1.0 + 3.6 * t; half.push([a, AZ1 + 0.3 + 1.6 * Math.cos((Math.PI / 2) * t)]) }
      screen(stone, S, UY - 0.2, half.map(([a, z]) => [xs(sg * a), z] as AZ), 1.0)
      scroll(stone, xs(sg * 4.3), AZ1 + 0.35, 0.45, UY - 0.35, UY + 0.8)
    }
    proud(dark, S, UY - 0.3, xs(-1.5), xs(1.5), UZ1 + 0.1, AZ1 - 0.1, 0.12)
    cbox(stone, rect(xs(-0.8), xs(0.8), UY - 0.4, UY + 0.8), AZ1, AZ1 + 2.6, { b: 0.2 })
    ngonPrism(stone, xs(0), UY + 0.2, 0.6, 6, AZ1 + 2.6, AZ1 + 3.2, { top: false, r1: 0.35 })
    spire(stone, ngon(xs(0), UY + 0.2, 0.35, 6, AZ1 + 3.2), [xs(0), UY + 0.2, AZ1 + 3.9])
    ironCross(iron, xs(0), UY + 0.2, AZ1 + 3.7, 1.6, 0.9, 0.14, 0)
    // Finials on the upper storey's shoulders.
    for (const s of [-1, 1]) {
      const a = xs(s * 6.85)
      cbox(stone, rect(a - 0.5, a + 0.5, UY - 0.3, UY + 0.7), UZ1, 18.0, { b: 0.15 })
      spire(stone, ngon(a, UY + 0.2, 0.42, 6, 18.0), [a, UY + 0.2, 19.2])
    }
  }

  // Night: the front is floodlit full, the drums, domes and lanterns well,
  // the white flanks less; tops facing up barely.
  const facadeLight = (p: V3, n: V3) => (p[1] < -32 ? 1 : 0.5) * (n[2] > 0.8 ? 0.35 : 1)
  const domeLight = (p: V3, n: V3) => (p[2] > 15.5 ? 0.9 : p[1] < -32 ? 0.8 : 0.35) * (n[2] > 0.9 ? 0.4 : 1)
  return [
    { part: stone, material: { ...finish('andesite', 0x85796b), floodlight: facadeLight } },
    { part: white, material: { ...finish('whitewash', 0xf1eee6), floodlight: domeLight } },
    { part: tile, material: { ...finish('glazed-tile-green', 0xa3ad9c, 0.45), floodlight: domeLight } },
    { part: win, material: PALETTE.window },
    { part: dark, material: { ...finish('andesite-shadow', 0x54483f), floodlight: facadeLight } },
    { part: iron, material: finish('iron', 0x5b5852, 0.6) },
  ]
}

if (import.meta.main) {
  await saveModel('quito-la-compania', 'Iglesia de la Compañía de Jesús, Quito', build())
}
