/**
 * Supertree Grove, Gardens by the Bay, Singapore: procedural, CC0-1.0.
 * bun generators/singapore-supertree-grove.ts
 *
 * The twelve Supertrees of the grove (Grant Associates, 2012) and the OCBC
 * Skyway between the two skyway trees. The six Supertrees in the Silver and
 * Golden Gardens stand elsewhere and are not drawn.
 *
 * Writes two levels of detail in the same frame:
 * - models/singapore-supertree-grove.glb, the low model (budget 6,500 tris):
 *   every tree's trunk, funnel, cap and steel as real 3D members, fewer and
 *   thicker; the Skyway as one solid band;
 * - models/singapore-supertree-grove.detail.glb, drawn from zoom 16: the
 *   canopies' branching steel (main ribs forking twice, with twigs and a
 *   cable ring), the steel frame round each trunk with its hoops, the
 *   planters, and the Skyway as a deck with its two rails and the hangers
 *   it hangs from.
 *
 * Map frame: x east, y north, z up, metres. The anchor is the centre of the
 * tallest tree (the Supertree Observatory), OSM way/572839881. Bearing 0.
 * The grove is flat reclaimed land; y = 0 is the ground.
 *
 * Published (cited):
 * - 18 Supertrees, 25 to 50 m tall; the tallest, 50 m, houses the Supertree
 *   Observatory with an open-air deck on its canopy (Wikipedia, "Gardens by
 *   the Bay"). The OCBC Skyway joins two of the larger trees (ibid.); 22 m
 *   up and 128 m long (gardensbythebay.com.sg, OSM height 22, min_height
 *   21.5).
 *
 * OSM (© OpenStreetMap contributors, ODbL), fetched Nov 2026:
 * - Every tree is mapped as a stack of rings: a 0.5 m base (the planter), a
 *   0-30 m trunk part, and parts at 30-33, 33-36 and 36-41 m that widen to
 *   the cap. Positions, trunk radii (the 0-30 ring) and cap radii (the top
 *   ring) are taken from them. Their height tags are a default 41 m for most
 *   trees and are not used, except the observatory tree's rings (trunk r 7.0
 *   to 35 m, 9.1 at 38, 11.5 at 43, 12.8 at 47, 13.9 at 50), which give its
 *   funnel and drum.
 * - way/687915906, the OCBC Skyway (highway=footway, bridge, layer 1): a
 *   loop round each skyway tree's trunk and the arc between them, used as
 *   drawn.
 *
 * Estimated (from the photos, scaled against the 22 m Skyway and the
 * 95 m between the skyway trees):
 * - canopy radius about 2.5 times the cap radius: 20-22 m for the skyway
 *   trees (the aerial and photo 3 agree on about 40-44 m across), 25 m for
 *   the observatory tree.
 * - heights per tree, from the cap radius (a bigger cap is a taller tree in
 *   every photo) and the side views: 50 observatory, 44 (south) and 42
 *   (north) the skyway trees, 25-40 the rest, measured in photo 3 against
 *   the Skyway (see TREES). OSM's 45 m for the north skyway tree and 40 m
 *   for the south one are swapped against that photo; the photo is used.
 * - trunks: the planted trunk is about 0.3 of the canopy radius across in
 *   the aerials; OSM's 0-30 m rings are wider and not used for it.
 * - profile: a straight planted trunk to about 0.6 of the height, a pale
 *   trumpet-shaped funnel (the "hat") to the cap rim, and a low domed cap
 *   (solar panels). The canopy is a bell of steel ribs, steep where it
 *   leaves the funnel and flattening to the rim at the tree's full height.
 * - observatory: funnel 35-43 m, a pale band 43-45, glazing 45-48.4, a
 *   parapet to 49.6 and a round kiosk on the roof deck.
 * - Skyway deck 2.2 m wide (drawn a little wide to read), rails 1.1 m.
 *
 * Invented: the exact number of ribs (16 or 12 per canopy in the detail
 * model, 12 or 8 in the low one; the real canopies have more, finer members),
 * the fork pattern, and where the Skyway's hangers meet the canopies.
 *
 * Colours from daylight photos, pulled to the palette's lightness: the steel
 * a mauve-purple, the trunks' planting green, the funnels a pale grey-green,
 * the caps a pale solar green, the Skyway's steel orange-brown, and the
 * observatory glazing `window`.
 *
 * Night (Garden Rhapsody and every evening, photos 7-8): the canopies and
 * trunk frames are lit purple-violet and the funnels glow pale from inside,
 * so steel and funnel are `neon` in their own colours; the planted trunks
 * are floodlit, and so is the Skyway; the observatory windows glow.
 *
 * Photos (EVIDENCE, Wikimedia Commons):
 * 1. "Supertree Grove, Gardens by the Bay, Singapore1.jpg", Mustang Joe, CC0
 *    (aerial from Marina Bay Sands, from the north-west).
 * 2. "Singapore Supertree-Grove-in-The-Gardens-03.jpg" and "-02.jpg",
 *    CEphoto, Uwe Aranas, CC BY-SA 3.0 (aerial, same side).
 * 3. "Singapore (SG), Gardens by the Bay, Supertree Grove -- 2019 --
 *    4752.jpg", Dietmar Rabich, CC BY-SA 4.0 (from the side, across
 *    Dragonfly Lake; camera geotagged at 1.282417, 103.861832, 240 m from
 *    the anchor at bearing 283).
 * 4. "20190819 Gardens by the Bay Supertree Grove-2.jpg", Balon Greyjoy, CC0
 *    (from the side at dusk).
 * 5. "At Singapore 2023 125 - At Supertree Grove.jpg", Mike Peel, CC BY-SA
 *    4.0 (from below: funnel, cap rim and the branching canopy steel).
 * 6. "Singapore Supertree-Grove-in-The-Gardens-01.jpg", CEphoto, Uwe
 *    Aranas, CC BY-SA 3.0.
 * 7. "Supertree Grove at night.jpg", Kanzcech, CC BY-SA 4.0 (night).
 * 8. "Supertree-night.jpg", Nightcrafter, CC BY-SA 4.0 (night).
 *
 * No commercial imagery, Street View or 3D tiles were used.
 */
import { Part, cross, sub, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const NAME = 'Supertree Grove'
const TAU = Math.PI * 2

const norm = (a: V3): V3 => {
  const l = Math.hypot(a[0], a[1], a[2]) || 1
  return [a[0] / l, a[1] / l, a[2] / l]
}
const add = (a: V3, b: V3, s = 1): V3 => [a[0] + b[0] * s, a[1] + b[1] * s, a[2] + b[2] * s]

/** One tree: centre (OSM), height, canopy radius, trunk and cap radii. */
type Tree = { name: string; x: number; y: number; H: number; R: number; rt: number; rc: number; big?: boolean }

// Centres and radii from the OSM rings (see header), in metres from the
// anchor; H and R estimated, and checked in photo 3 (camera 240 m away at
// bearing 283, scaled by the 22 m Skyway and the 90 m between the skyway
// trees as seen from there): skyway-south rim 22 m above the deck and 44 m
// across, skyway-north 20 m and 39 m, north-west 17 m above the deck, west
// 8.5 m, observatory 47 m across.
const TREES: Tree[] = [
  { name: 'observatory', x: -0.3, y: 0.1, H: 50, R: 25, rt: 7.0, rc: 12.8, big: true },
  { name: 'skyway-north', x: 25.2, y: 42.5, H: 42, R: 20, rt: 4.8, rc: 8.3, big: true },
  { name: 'skyway-south', x: -23.1, y: -39.1, H: 44, R: 22, rt: 4.8, rc: 8.0, big: true },
  { name: 'north-west', x: -38.8, y: 39.6, H: 40, R: 18, rt: 3.9, rc: 6.5 },
  { name: 'east', x: 43.0, y: 6.7, H: 35, R: 15, rt: 3.6, rc: 6.0 },
  { name: 'far-east', x: 60.1, y: 27.9, H: 32, R: 13, rt: 3.2, rc: 5.3 },
  { name: 'north', x: -10.7, y: 54.5, H: 30, R: 12, rt: 2.9, rc: 4.8 },
  { name: 'west', x: -52.5, y: 6.6, H: 30, R: 12, rt: 2.8, rc: 4.7 },
  { name: 'south-east', x: 53.1, y: -20.8, H: 29, R: 11, rt: 2.7, rc: 4.5 },
  { name: 'south', x: 21.3, y: -31.2, H: 28, R: 10.5, rt: 2.5, rc: 4.2 },
  { name: 'north-east', x: 51.6, y: 61.4, H: 26, R: 9.5, rt: 2.4, rc: 3.7 },
  { name: 'far-south', x: -30.8, y: -70.1, H: 25, R: 8.5, rt: 2.2, rc: 3.1 },
]

// Planter radii, the 0.5 m OSM base rings (the observatory tree has none).
const PLANTERS: Record<string, number> = {
  'skyway-north': 8.5, 'skyway-south': 8.4, 'north-west': 7.4, east: 7.3, north: 5.5, west: 5.4,
  'south-east': 5.3, south: 5.0, 'north-east': 4.1, 'far-south': 4.6,
}

// OCBC Skyway, OSM way/687915906, in metres from the anchor: the loop round
// the south skyway tree, the arc, and the loop round the north one.
const SKY_LOOP_S: [number, number][] = [
  [-30.9, -31.4], [-26.5, -33.6], [-25.1, -33.6], [-22.8, -33.2], [-20.5, -33.7], [-18.5, -35.0], [-17.2, -36.9],
  [-16.7, -39.2], [-17.1, -41.5], [-18.4, -43.5], [-20.3, -44.9], [-22.6, -45.4], [-24.9, -45.0], [-26.9, -43.8],
  [-28.4, -41.9], [-29.0, -39.7], [-28.6, -37.3], [-29.0, -36.1],
]
const SKY_ARC: [number, number][] = [
  [-30.9, -31.4], [-33.0, -28.6], [-34.9, -25.5], [-36.6, -22.2], [-38.5, -17.9], [-39.8, -13.4], [-40.6, -7.6],
  [-40.9, -1.1], [-40.5, 5.0], [-39.8, 8.2], [-38.9, 11.1], [-37.8, 14.4], [-36.6, 17.4], [-35.1, 20.4],
  [-32.9, 24.8], [-31.1, 27.4], [-28.8, 31.0], [-26.8, 33.4], [-25.6, 35.0], [-24.5, 36.4], [-22.6, 38.4],
  [-18.3, 42.1], [-15.5, 44.0], [-12.0, 45.7], [-8.0, 47.2], [-4.4, 48.2], [-1.2, 48.9], [2.1, 49.2], [5.7, 48.9],
  [14.5, 46.5],
]
const SKY_LOOP_N: [number, number][] = [
  [14.5, 46.5], [19.4, 46.2], [20.9, 47.0], [21.9, 47.8], [22.9, 48.3], [24.1, 48.6], [25.2, 48.8], [26.4, 48.6],
  [27.5, 48.3], [28.6, 47.8], [29.5, 47.0], [30.3, 46.1], [30.9, 45.1], [31.2, 44.0], [31.4, 42.8], [31.3, 41.7],
  [31.0, 40.5], [30.5, 39.5], [29.8, 38.5], [28.9, 37.7], [27.9, 37.1], [26.8, 36.7], [25.6, 36.6], [24.4, 36.6],
  [23.2, 36.9], [22.2, 37.4], [21.2, 38.0], [20.4, 38.9], [19.8, 39.9], [19.3, 41.0], [19.1, 42.1], [18.4, 43.5],
]
const DECK = 21.6 // deck underside; walking surface 22.0 (OSM height 22)

type Mats = { steel: Part; funnel: Part; cap: Part; plant: Part; sky: Part; win: Part }

/** A triangle with its winding turned to face `out`. */
function face3(p: Part, a: V3, b: V3, c: V3, out: V3) {
  p.tri(a, b, c, [0, 0], [0, 0], [0, 0], [out, out, out])
}

/**
 * A steel member from a to b: a triangular prism, `w` across, faces wound
 * outward. The ends run on by a little so joints close.
 */
function strut(p: Part, a: V3, b: V3, w: number) {
  const d = norm(sub(b, a))
  const ref: V3 = Math.abs(d[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0]
  const u = norm(cross(d, ref)), v = cross(d, u)
  const r = w / Math.sqrt(3)
  const a2 = add(a, d, -w * 0.3), b2 = add(b, d, w * 0.3)
  const off = [0, 1, 2].map((k) => {
    const t = (k * TAU) / 3 + Math.PI / 2
    return add(add([0, 0, 0], u, Math.cos(t) * r), v, Math.sin(t) * r)
  })
  for (let k = 0; k < 3; k++) {
    const o0 = off[k], o1 = off[(k + 1) % 3]
    // Smooth (radial) normals, so the corners weld and a member costs
    // six vertices.
    const n0 = norm(o0), n1 = norm(o1)
    const p0 = add(a2, o0), p1 = add(a2, o1), q0 = add(b2, o0), q1 = add(b2, o1)
    p.tri(p0, p1, q1, [0, 0], [0, 0], [0, 0], [n0, n1, n1])
    p.tri(p0, q1, q0, [0, 0], [0, 0], [0, 0], [n0, n1, n0])
  }
}

/** A polyline of struts. */
function chain(p: Part, pts: V3[], w: number) {
  for (let i = 0; i < pts.length - 1; i++) strut(p, pts[i], pts[i + 1], w)
}

/**
 * A surface of revolution about (cx, cy): `prof` is [r, z] from bottom to
 * top, seen from outside. Normals smooth round the axis, per profile segment
 * along it. A profile running inward (r falling) makes a roof.
 */
function lathe(p: Part, cx: number, cy: number, prof: [number, number][], seg: number, phase = 0, flood?: number) {
  for (let k = 0; k < prof.length - 1; k++) {
    const [r0, z0] = prof[k], [r1, z1] = prof[k + 1]
    if (r0 === 0 && r1 === 0) continue
    const nr = z1 - z0, nz = -(r1 - r0)
    const l = Math.hypot(nr, nz) || 1
    for (let i = 0; i < seg; i++) {
      const t0 = phase + (i * TAU) / seg, t1 = phase + ((i + 1) * TAU) / seg
      const P = (r: number, z: number, t: number): V3 => [cx + r * Math.cos(t), cy + r * Math.sin(t), z]
      const N = (t: number): V3 => [(nr / l) * Math.cos(t), (nr / l) * Math.sin(t), nz / l]
      const a = P(r0, z0, t0), b = P(r0, z0, t1), c = P(r1, z1, t1), d = P(r1, z1, t0)
      if (r0 > 0) p.tri(a, b, c, [0, 0], [0, 0], [0, 0], [N(t0), N(t1), N(t1)])
      if (r1 > 0) p.tri(a, c, d, [0, 0], [0, 0], [0, 0], [N(t0), N(t1), N(t0)])
    }
  }
  void flood
}

// ------------------------------------------------------------------ trees ---
function tree(M: Mats, T: Tree, detail: boolean) {
  const { x, y, H, R, rc } = T
  // The planted trunk is about 0.3 of the canopy radius across in the
  // aerials (photos 1-2); OSM's 0-30 m rings are wider and look like the
  // planters' inner edge, so they are not used for it.
  const obs = T.name === 'observatory'
  const rt = obs ? 4.8 : 0.15 * R
  const seg = detail ? 16 : 8
  const w = detail ? 0.38 : 0.6

  // Trunk (planting) and funnel (pale), and where the funnel runs.
  const zt = obs ? 35 : H * 0.53
  const zc = obs ? 43 : H - 1.8
  const funnelR = (s: number) => (obs ? rt + (rc - rt) * Math.pow(s, 1.3) : rt * 0.85 + (rc - rt * 0.85) * Math.pow(s, 2.2))
  const funnelZ = (s: number) => zt + (zc - zt) * s
  const fs = detail ? 6 : 3

  lathe(M.plant, x, y, [[rt * 1.08, 0], [rt, zt * 0.35], [rt, zt * (detail ? 0.7 : 1)], ...(detail ? [[rt * 0.95, zt] as [number, number]] : [])], seg)
  const fprof: [number, number][] = []
  for (let i = 0; i <= fs; i++) fprof.push([funnelR(i / fs) - (i === 0 ? 0.3 : 0), funnelZ(i / fs)])
  lathe(M.funnel, x, y, fprof, seg)

  if (obs) {
    // Observatory: a pale band, the glazing, a parapet, the roof deck and
    // its kiosk.
    lathe(M.cap, x, y, [[0, 43], [13.6, 43], [13.6, 45]], seg)
    lathe(M.win, x, y, [[13.6, 45], [13.2, 45], [13.2, 48.4]], seg)
    lathe(M.cap, x, y, [[13.2, 48.4], [13.9, 48.4], [13.9, 49.6], [13.3, 49.6], [13.3, 49.0], [0, 49.0]], seg)
    lathe(M.cap, x, y, [[4.5, 49.0], [4.5, 50.3], [0, 50.3]], detail ? 12 : 8)
  } else {
    // Cap rim and the shallow solar dome.
    lathe(M.cap, x, y, [[0, zc - 0.2], [rc + 0.35, zc - 0.2], [rc + 0.35, zc + 0.5], [rc * 0.6, zc + 1.1], [0, zc + 1.5]], seg)
  }

  // The steel frame on the trunk and funnel: verticals, with hoops (detail).
  const nv = detail ? (T.big ? 16 : 10) : T.big ? 6 : 4
  const nvf = detail ? 4 : 2 // segments up the funnel
  const off = w * 0.7 + 0.15
  for (let i = 0; i < nv; i++) {
    const t = ((i + 0.5) * TAU) / nv
    const P = (r: number, z: number): V3 => [x + r * Math.cos(t), y + r * Math.sin(t), z]
    const pts: V3[] = []
    const nTrunk = detail ? 4 : 1
    for (let k = 0; k <= nTrunk; k++) pts.push(P(rt * (k === 0 ? 1.08 : 1) + off, 0.3 + ((zt - 0.3) * k) / nTrunk))
    const nf = nvf
    for (let k = 1; k <= nf; k++) pts.push(P(funnelR(k / nf) + off, funnelZ(k / nf)))
    chain(M.steel, pts, w)
  }
  if (detail && T.big) {
    const hoops = [0.25, 0.5, 0.75].map((f) => f * zt)
    for (const z of hoops) {
      const ring: V3[] = []
      for (let i = 0; i <= nv; i++) {
        const t = ((i + 0.5) * TAU) / nv
        ring.push([x + (rt + off) * Math.cos(t), y + (rt + off) * Math.sin(t), z])
      }
      chain(M.steel, ring, w * 0.8)
    }
  }

  // The canopy: a bell of steel, steep where it leaves the funnel and
  // flattening to the rim at R, H: radial ribs, hoops round them, and (in
  // the detail model) a fork near the rim and twigs past it, which give the
  // ragged edge the photos show.
  const nr = detail ? (T.big ? 32 : 20) : T.big ? 12 : 8
  const rimZ = obs ? 49.4 : H
  const zb = funnelZ(0.08), rb = funnelR(0.08) + off
  const bell = (t: number, a: number): V3 => {
    const r = rb + (R - rb) * Math.pow(t, 1.5)
    const z = zb + (rimZ - zb) * (1 - Math.pow(1 - t, 1.2))
    return [x + r * Math.cos(a), y + r * Math.sin(a), z]
  }
  // Canopy members drawn heavier than the frame, so the bowl reads.
  const wc = detail ? 0.42 : 0.6
  const run = (ts: number[], a0: number, a1: number, ww = wc) => {
    const t0 = ts[0], t1 = ts[ts.length - 1]
    chain(M.steel, ts.map((t) => bell(t, a0 + ((a1 - a0) * (t - t0)) / (t1 - t0 || 1))), ww)
  }
  const step = TAU / nr
  const phase = Math.PI / nr
  const hoop = (t: number, n: number, ph: number, ww = wc) => {
    const pts: V3[] = []
    for (let i = 0; i <= n; i++) pts.push(bell(t, ph + (i * TAU) / n))
    chain(M.steel, pts, ww)
  }
  if (!detail) {
    for (let j = 0; j < nr; j++) run([0, 0.5, 0.78, 1], phase + j * step, phase + j * step)
    hoop(0.78, nr, phase)
    hoop(1, nr, phase)
  } else {
    const tf = 0.74
    for (let j = 0; j < nr; j++) {
      const a = phase + j * step
      run([0, 0.45, 0.62, tf], a, a)
      for (const s of [-1, 1]) {
        const a1 = a + (s * step) / 4
        run([tf, 0.88], a, a1)
        run([0.88, 1], a1, a1)
        // A twig past the rim, out and up (the bigger trees).
        if (!T.big) continue
        const b = bell(1, a1)
        const d = norm([b[0] - x, b[1] - y, 0])
        strut(M.steel, b, [b[0] + d[0] * 1.6, b[1] + d[1] * 1.6, b[2] + 0.9], wc * 0.8)
      }
    }
    // Zig-zag bracing between the two inner hoops, the Y pattern the
    // underside photo shows.
    for (let j = 0; j < nr; j++) {
      const a = phase + j * step
      chain(M.steel, [bell(0.45, a), bell(0.62, a + step / 2), bell(0.45, a + step)], wc * 0.8)
    }
    hoop(0.45, nr, phase, wc * 0.8)
    hoop(0.62, nr * 2, phase, wc * 0.8)
    hoop(0.88, nr * 2, phase + step / 4, wc * 0.8)
  }

  // Planter (detail only): a low ring wall round the trunk.
  const pr = PLANTERS[T.name]
  if (detail && pr) lathe(M.cap, x, y, [[pr, 0], [pr, 0.6], [pr - 0.5, 0.6], [pr - 0.5, 0.35], [rt * 1.08, 0.35]], 16)
}

// ----------------------------------------------------------------- skyway ---
/**
 * Sweep a section along a plan polyline at the Skyway's height. `section`
 * is [lateral, z] points, counter-clockwise seen along the direction of
 * travel, closed.
 */
function sweepPlan(p: Part, line: [number, number][], closed: boolean, section: [number, number][]) {
  const n = line.length
  const frames = line.map((q, i) => {
    const prev = line[closed ? (i - 1 + n) % n : Math.max(0, i - 1)]
    const next = line[closed ? (i + 1) % n : Math.min(n - 1, i + 1)]
    let dx = next[0] - prev[0], dy = next[1] - prev[1]
    const l = Math.hypot(dx, dy) || 1
    dx /= l
    dy /= l
    return { q, lat: [dy, -dx] as [number, number] } // right of travel
  })
  const at = (i: number, s: [number, number]): V3 => {
    const { q, lat } = frames[i]
    return [q[0] + lat[0] * s[0], q[1] + lat[1] * s[0], s[1]]
  }
  const m = section.length
  for (let i = 0; i < (closed ? n : n - 1); i++) {
    const j = (i + 1) % n
    for (let k = 0; k < m; k++) {
      const s0 = section[k], s1 = section[(k + 1) % m]
      // Outward normal of this section edge, in the plan frame.
      const ex = s1[0] - s0[0], ez = s1[1] - s0[1]
      const on: [number, number] = [ez, -ex]
      const lat = frames[i].lat
      const out = norm([lat[0] * on[0], lat[1] * on[0], on[1]])
      const a = at(i, s0), b = at(i, s1), c = at(j, s1), d = at(j, s0)
      face3(p, a, b, c, out)
      face3(p, a, c, d, out)
    }
  }
}

function skyway(M: Mats, detail: boolean) {
  const hw = 1.1
  // Sections run clockwise in (lateral, z) seen along travel with lateral to
  // the right; face3 takes care of the winding.
  const band: [number, number][] = [[-hw, DECK], [hw, DECK], [hw, 23.1], [-hw, 23.1]]
  const channel: [number, number][] = [
    [-hw, DECK], [hw, DECK], [hw, 23.1], [hw - 0.15, 23.1], [hw - 0.15, 22.0],
    [-hw + 0.15, 22.0], [-hw + 0.15, 23.1], [-hw, 23.1],
  ]
  const sec = detail ? channel : band
  const thin = <T,>(a: T[], keep: number) => (detail ? a : a.filter((_, i) => i % keep === 0 || i === a.length - 1))
  sweepPlan(M.sky, thin(SKY_LOOP_S, 2), true, sec)
  sweepPlan(M.sky, thin(SKY_ARC, 2), false, sec)
  sweepPlan(M.sky, thin(SKY_LOOP_N, 3), true, sec)

  if (detail) {
    // Hangers from the nearest canopy's funnel down to the deck edge.
    const big = TREES.filter((t) => t.big || t.name === 'north-west' || t.name === 'west')
    SKY_ARC.forEach((q, i) => {
      if (i % 3 !== 1) return
      const t = big.reduce((a, b) => (Math.hypot(b.x - q[0], b.y - q[1]) < Math.hypot(a.x - q[0], a.y - q[1]) ? b : a))
      const d = Math.hypot(t.x - q[0], t.y - q[1])
      if (d > t.R + 2) return
      const a = Math.atan2(q[1] - t.y, q[0] - t.x)
      const r = Math.min(t.R * 0.7, d + 2)
      const top: V3 = [t.x + r * Math.cos(a), t.y + r * Math.sin(a), t.name === 'observatory' ? 44 : t.H * 0.86]
      strut(M.steel, [q[0], q[1], 23.1], top, 0.14)
    })
  }
}

// ------------------------------------------------------------------ build ---
function build(detail: boolean): Mats {
  const M: Mats = { steel: new Part(), funnel: new Part(), cap: new Part(), plant: new Part(), sky: new Part(), win: new Part() }
  for (const T of TREES) tree(M, T, detail)
  skyway(M, detail)
  return M
}

function materials(M: Mats): Array<{ part: Part; material: MaterialSpec }> {
  return [
    { part: M.steel, material: finish('neon-supertree-steel', 0x93638e) },
    { part: M.funnel, material: finish('neon-supertree-funnel', 0xd2d3dc) },
    { part: M.cap, material: finish('supertree-cap', 0xdde5d6) },
    { part: M.plant, material: { ...finish('supertree-planting', 0x6f8c57), floodlight: (_p: V3, n: V3) => (n[2] > 0.8 ? 0.2 : 0.75) } },
    { part: M.sky, material: { ...finish('ocbc-skyway', 0xc58b55), floodlight: () => 0.6 } },
    { part: M.win, material: PALETTE.window },
  ].filter((m) => m.part.triangles > 0)
}

async function write(file: string, parts: Array<{ part: Part; material: MaterialSpec }>, maxTris: number, maxBytes: number) {
  const triangles = parts.reduce((t, { part }) => t + part.triangles, 0)
  if (process.env.COUNT) console.log(file, parts.map((p) => `${p.material.name} ${p.part.triangles}`).join(', '))
  if (triangles > maxTris) throw new Error(`${file}: triangle budget exceeded: ${triangles}`)
  const glb = writeGlb(NAME, parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
    bearing: 0, elevation: 0, height: 50.3,
  })
  if (glb.length > maxBytes) throw new Error(`${file}: size budget exceeded: ${glb.length} bytes, ${triangles} tris`)
  const out = new URL(`../models/${file}`, import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}

await write('singapore-supertree-grove.glb', materials(build(false)), 6500, 250_000)
await write('singapore-supertree-grove.detail.glb', materials(build(true)), 40_000, 1536 * 1024)
