/**
 * Tokyo International Airport (Haneda) Terminal 1, the "Big Bird" west
 * building (1993), with its central, north and south gate fans and the north
 * pier — procedural, CC0-1.0, no textures.
 * bun generators/tokyo-haneda-terminal-1.ts
 *
 * Writes models/tokyo-haneda-terminal-1.glb (low) and
 * models/tokyo-haneda-terminal-1.detail.glb (detail, the whole landmark again
 * with finer jet bridges, glazing mullions, roof ribs and rooftop plant).
 *
 * Also the shared kit for the other Haneda terminals of this batch
 * (tokyo-haneda-terminal-2 and -3 import `despur`, `zoneMass`, `jetBridges`,
 * `writeLod` and friends from here). The model itself is only written when
 * this file is run directly.
 *
 * Map frame: x = model east, y = model north, z up, metres. Placed at
 * bearing −30°: every long wall of the terminals runs 30° west of north.
 * Anchor: area centroid of the OSM outline way/500688113 (it lies a little
 * north of the main hall, pulled by the long north pier). In this frame the
 * airside faces −x (west, runway A), the landside +x (the roads, P1/P2 car
 * parks and the station).
 *
 * Identifying features (photos): a very long, plain, pale warm-grey
 * five-storey block with horizontal window bands, the airside face right on
 * the apron; three low gate fans (north, centre, south) with radiating jet
 * bridges ending in round rotundas, the centre fan under a glass roof; at the
 * landside centre, over the main entrance, a taller block flanked by two
 * towers with quarter-round tops falling towards the entrance and a glazed
 * bay with a half-round lunette between them, and in front of it the big
 * sloped glazed entrance canopy on a white steel frame stepping down to the
 * departures curb; long skylight strips along the
 * main roof; the narrow north pier added later.
 *
 * Evidence
 * - OSM: way/500688113 (Terminal 1, building:levels 6, no height; 530
 *   nodes including every fixed jet bridge and rotunda, which `despur` cuts
 *   off and draws as bridges); way/1026001770 (a small rooftop building
 *   inside it, replaced). No building:parts.
 * - Published: opened 27 September 1993; 地下1階・地上5階、一部6階 (one basement,
 *   five storeys, partly six); about 290,000 m²; 24 boarding bridges at
 *   opening (Japanese Wikipedia, "東京国際空港").
 * - Photos (Wikimedia Commons):
 *   https://commons.wikimedia.org/wiki/File:Haneda_Airport_-_panoramio_-_oimo.jpg
 *     (oimo, CC BY-SA 3.0) aerial from the south c. 2009: the plan, the dark
 *     grey main roof and its white skylight strips, the centre fan's glass
 *     roof, the gate fans; no north pier yet;
 *   https://commons.wikimedia.org/wiki/File:Haneda-Airport-Terminal3---2025-06-15_044.jpg
 *     (RuinDig/Yuki Uchida, CC BY 4.0) telephoto from the west: the five
 *     storeys on the apron, the low centre fan, the taller centre;
 *   https://commons.wikimedia.org/wiki/File:HND_Terminal_1.jpg
 *     (JobanLineE531, CC BY-SA 3.0) and
 *   https://commons.wikimedia.org/wiki/File:Tokyo_International_Airport_Terminal_1_-01.jpg
 *     (Aimaimyi, CC BY-SA 3.0) the landside centre: towers, lunette, panels;
 *   https://commons.wikimedia.org/wiki/File:Tokyo_International_Airport_-_Terminal_1.jpg
 *     (Project Kei, CC BY-SA 4.0) the airside face and a rotunda;
 *   https://commons.wikimedia.org/wiki/File:Tokyo_International_Airport_terminal-1.jpg
 *     (melvil, CC BY-SA 4.0) the whole terminal from Terminal 3: its height
 *     against the 115.7 m control tower;
 *   https://commons.wikimedia.org/wiki/File:Haneda_Airport_Terminal_1_north_wing_2025-03-15.jpg
 *     (ERIC SALARD, CC BY-SA 2.0) a north-fan rotunda and link;
 *   https://commons.wikimedia.org/wiki/File:Haneda_Airport_T1_Night_View.JPG
 *     (Banbam1029, CC BY-SA 4.0) night: lit gate windows.
 * - No lidar (none open for Japan used here).
 *
 * Estimated: the main block's roof at 25 m (scaled against the control
 * tower in melvil's panorama and the five storeys in Uchida's telephoto);
 * the fans, connectors and north pier at 12 m; the centre block at 31.5 m
 * between y −175 and −35 (the entrance axis faces the gap between car parks
 * P1 and P2 and the station, y ≈ −105); the towers to 36.5 m plus a 7 m
 * quarter-round; the lunette; the skylight strips' places (from the aerial);
 * the jet-bridge links at 4.6–8 m. Window bands are grouped two storeys a
 * panel on the airside and are sparse on the solid landside panels.
 * Doubts: the north pier (y > 316) is newer than every aerial found and was
 * not photographed; its height is a guess. The landside's curbside canopy
 * and the glazed entrance canopy stand outside the OSM outline and are left
 * out. Rooftop observation-deck railings are left out.
 * The glazed entrance canopy (review round 1) is drawn although it stands
 * past OSM's outline: three sloped glass bays, 24 m at the wall falling to
 * 11.5 m at the curb (the side bays 19 → 10.5 m), 25 m deep, on posts at the
 * curb edge (estimated from JobanLineE531's and Aimaimyi's photos). It
 * overhangs the underground Keikyu station box (way/322881451, layer −1),
 * which is not replaced. Windows are broad panels two storeys a panel on the
 * airside (three on the centre block), one broad glazed band over the curb
 * on the landside, in both levels of detail. The curbside roadway canopy is
 * left out.
 */
import { Part, writeGlb, type V3, type MaterialSpec } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, type Facade, capPoly, facade, quadN, unit, area } from './nyc-570-lexington'

export type { XY, Facade }

// ===========================================================================
// Kit
// ===========================================================================

export const ccw = (r: XY[]) => (area(r) < 0 ? r.slice().reverse() : r.slice())

/**
 * Split an OSM terminal outline into its body and the jet-bridge spurs that
 * OSM draws as part of it: a run of the ring that leaves and comes back
 * within `wmax` metres of where it left, after a path at least three times
 * as long, and bulges outwards. Returns the body ring (counter-clockwise)
 * and each spur as the closed loop it cut off, root first.
 */
export function despur(ring0: XY[], wmax = 9.5, maxK = 34) {
  let r = ccw(ring0)
  const spurs: XY[][] = []
  let changed = true
  while (changed) {
    changed = false
    const n = r.length
    outer: for (let i = 0; i < n; i++) for (let k = Math.min(maxK, n - 3); k >= 3; k--) {
      const j = (i + k) % n, a = r[i], b = r[j]
      const d = Math.hypot(b[0] - a[0], b[1] - a[1])
      if (d > wmax) continue
      const loop: XY[] = []
      let L = 0
      for (let s = 0; s <= k; s++) {
        const p = r[(i + s) % n]
        if (s) { const q = loop[loop.length - 1]; L += Math.hypot(p[0] - q[0], p[1] - q[1]) }
        loop.push(p)
      }
      if (L < Math.max(10, 3 * d) || area(loop) <= 0) continue
      spurs.push(loop)
      r = r.filter((_, s) => { const off = (s - i + n) % n; return off === 0 || off >= k })
      changed = true
      break outer
    }
  }
  return { body: r, spurs }
}

/** Drop points closer than `tol` to the line through their neighbours. */
export function simplify(ring: XY[], tol = 0.4): XY[] {
  let r = ring.slice(), changed = true
  while (changed && r.length > 3) {
    changed = false
    for (let i = 0; i < r.length; i++) {
      const a = r[(i - 1 + r.length) % r.length], b = r[i], c = r[(i + 1) % r.length]
      const L = Math.hypot(c[0] - a[0], c[1] - a[1])
      const d = L < 1e-6 ? Math.hypot(b[0] - a[0], b[1] - a[1]) : Math.abs((c[0] - a[0]) * (a[1] - b[1]) - (a[0] - b[0]) * (c[1] - a[1])) / L
      if (d < tol) { r.splice(i, 1); changed = true; break }
    }
  }
  return r
}

/** Sutherland–Hodgman clip of a ring to an axis-aligned rectangle. */
export function clipRect(ring: XY[], x0: number, y0: number, x1: number, y1: number): XY[] {
  let out = ring.slice()
  const planes: [(p: XY) => boolean, (a: XY, b: XY) => XY][] = [
    [(p) => p[0] >= x0, (a, b) => [x0, a[1] + ((b[1] - a[1]) * (x0 - a[0])) / (b[0] - a[0])]],
    [(p) => p[0] <= x1, (a, b) => [x1, a[1] + ((b[1] - a[1]) * (x1 - a[0])) / (b[0] - a[0])]],
    [(p) => p[1] >= y0, (a, b) => [a[0] + ((b[0] - a[0]) * (y0 - a[1])) / (b[1] - a[1]), y0]],
    [(p) => p[1] <= y1, (a, b) => [a[0] + ((b[0] - a[0]) * (y1 - a[1])) / (b[1] - a[1]), y1]],
  ]
  for (const [ins, cut] of planes) {
    const src = out; out = []
    for (let i = 0; i < src.length; i++) {
      const a = src[i], b = src[(i + 1) % src.length]
      if (ins(a)) out.push(a)
      if (ins(a) !== ins(b)) out.push(cut(a, b))
    }
    if (!out.length) return []
  }
  // drop repeated points
  return out.filter((p, i) => { const q = out[(i + 1) % out.length]; return Math.hypot(p[0] - q[0], p[1] - q[1]) > 0.05 })
}

export function inside(pt: XY, poly: XY[]) {
  let hit = false
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const a = poly[i], b = poly[j]
    if ((a[1] > pt[1]) !== (b[1] > pt[1]) && pt[0] < ((b[0] - a[0]) * (pt[1] - a[1])) / (b[1] - a[1]) + a[0]) hit = !hit
  }
  return hit
}

export type Mats = Record<string, Part>
export type Zone = {
  /** x0, y0, x1, y1: the body clipped to this rectangle */
  rect?: [number, number, number, number]
  /** or an explicit ring (an OSM building:part inside the body) */
  ring?: XY[]
  /** roof height */
  z: number
  facade: Facade | null
  /** part name for the roof cap (default 'roof') */
  roof?: string
  /** a different facade by the wall's outward normal (e.g. a solid landside) */
  facadeFor?: (n: XY) => Facade | null
  /** coping lip depth (default the mass's) */
  lip?: number
  /** wall and window part names (default 'wall', 'win') */
  wall?: string
  win?: string
}

/**
 * Stepped massing of a terminal: the body ring cut into rectangular zones,
 * each extruded to its height. Where zones overlap the higher wins. Walls are
 * drawn only where they show: from the neighbouring height (0 outside the
 * body) up to the zone's roof, with window bands from `facade`, a pale coping
 * lip on top and a flat roof.
 */
export function zoneMass(M: Mats, body: XY[], zones: Zone[], o: { lip?: number; holes?: XY[][] } = {}) {
  const holes = o.holes ?? []
  const inBody = (p: XY) => inside(p, body) && !holes.some((h) => inside(p, h))
  const inZone = (z: Zone, p: XY) => (z.ring ? inside(p, z.ring) : p[0] >= z.rect![0] && p[0] <= z.rect![2] && p[1] >= z.rect![1] && p[1] <= z.rect![3])
  const heightAt = (p: XY) => {
    if (!inBody(p)) return 0
    let h = 0
    for (const z of zones) if (inZone(z, p)) h = Math.max(h, z.z)
    return h
  }
  const lip0 = o.lip ?? 0.7
  const pieces: { zone: Zone; ring: XY[] }[] = []
  for (const zone of zones) {
    const ring = zone.ring ? ccw(zone.ring) : ccw(clipRect(body, ...zone.rect!))
    if (ring.length < 3 || Math.abs(area(ring)) < 1) continue
    pieces.push({ zone, ring })
    const wall = M[zone.wall ?? 'wall'], win = M[zone.win ?? 'win'], lip = zone.lip ?? lip0
    // split every edge where it crosses a zone boundary, so each piece has one neighbour
    const segs: [XY, XY][] = []
    for (let i = 0; i < ring.length; i++) {
      const a = ring[i], b = ring[(i + 1) % ring.length]
      const ts = [0, 1]
      for (const zz of zones) if (zz.rect) for (const [ax, v] of [[0, zz.rect[0]], [0, zz.rect[2]], [1, zz.rect[1]], [1, zz.rect[3]]] as [number, number][]) {
        const d = b[ax] - a[ax]
        if (Math.abs(d) < 1e-9) continue
        const t = (v - a[ax]) / d
        if (t > 1e-4 && t < 1 - 1e-4) ts.push(t)
      }
      ts.sort((p, q) => p - q)
      for (let k = 0; k < ts.length - 1; k++) {
        if (ts[k + 1] - ts[k] < 1e-6) continue
        const P = (t: number): XY => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
        segs.push([P(ts[k]), P(ts[k + 1])])
      }
    }
    for (const [a, b] of segs) {
      const L = Math.hypot(b[0] - a[0], b[1] - a[1])
      if (L < 0.05) continue
      const n: XY = [(b[1] - a[1]) / L, (a[0] - b[0]) / L], m: XY = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
      const hIn = heightAt([m[0] - n[0] * 0.3, m[1] - n[1] * 0.3])
      if (hIn > zone.z + 0.01) continue // buried in a taller zone
      const hOut = heightAt([m[0] + n[0] * 0.3, m[1] + n[1] * 0.3])
      if (hOut >= zone.z - 0.01) continue // inside the mass or behind an equal roof
      facade(wall, win, a, b, hOut, zone.z - lip, zone.facadeFor ? zone.facadeFor(n) : zone.facade)
      if (!lip) continue
      // coping lip, a little proud
      const A: XY = [a[0] + n[0] * 0.15, a[1] + n[1] * 0.15], B: XY = [b[0] + n[0] * 0.15, b[1] + n[1] * 0.15]
      M.trim.quad([A[0], A[1], zone.z - lip], [B[0], B[1], zone.z - lip], [B[0], B[1], zone.z], [A[0], A[1], zone.z])
      M.trim.quad([A[0], A[1], zone.z], [B[0], B[1], zone.z], [b[0], b[1], zone.z], [a[0], a[1], zone.z])
    }
    capPoly(M[zone.roof ?? 'roof'], ring, zone.z - 0.02)
  }
  return { pieces, heightAt }
}

/** A smooth vertical cylinder (or cone frustum) with a flat top. */
export function drum(p: Part, cx: number, cy: number, r0: number, r1: number, z0: number, z1: number, n: number, top: Part | null = p) {
  const ring = (r: number, z: number): V3[] => Array.from({ length: n }, (_, i) => [cx + r * Math.cos((2 * Math.PI * i) / n), cy + r * Math.sin((2 * Math.PI * i) / n), z])
  const lo = ring(r0, z0), hi = ring(r1, z1)
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    const nn = (k: number): V3 => unit([Math.cos((2 * Math.PI * k) / n), Math.sin((2 * Math.PI * k) / n), (r0 - r1) / Math.max(0.01, z1 - z0)])
    quadN(p, lo[i], lo[j], hi[j], hi[i], [nn(i), nn(j), nn(j), nn(i)])
  }
  if (top) top.cap(hi, true)
}

/** A box between two plan points (a centre line), width w, z0…z1, all six faces. */
export function beam(p: Part, a: XY, b: XY, w: number, z0: number, z1: number, bottom = true) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]); if (L < 0.1) return
  const n: XY = [((b[1] - a[1]) / L) * (w / 2), ((a[0] - b[0]) / L) * (w / 2)]
  const r: XY[] = [[a[0] + n[0], a[1] + n[1]], [b[0] + n[0], b[1] + n[1]], [b[0] - n[0], b[1] - n[1]], [a[0] - n[0], a[1] - n[1]]]
  prismRing(p, ccw(r), z0, z1, p, bottom ? p : null)
}

/** Extrude a ring z0…z1: walls, a top cap and (optionally) a bottom cap. */
export function prismRing(p: Part, ring: XY[], z0: number, z1: number, top: Part | null = p, bottom: Part | null = null) {
  const r = ccw(ring)
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    p.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
  }
  if (top) capPoly(top, r, z1)
  if (bottom) capPoly(bottom, r, z0, false)
}

/**
 * Jet bridges from the spurs `despur` cut off. Each is a fixed glazed link
 * from the root on the building (at gate level) to a round rotunda on a
 * column; the rotunda is the run of short edges at the spur's far end where
 * OSM draws one, else the far end itself.
 */
export function jetBridges(M: Mats, spurs: XY[][], o: { z0: number; z1: number; detail: boolean; rotundaTop?: number }) {
  for (const s of spurs) {
    const a = s[0], b = s[s.length - 1]
    const root: XY = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
    const w = Math.max(3, Math.min(5, Math.hypot(b[0] - a[0], b[1] - a[1])))
    // a rotunda: consecutive short edges
    let best: XY[] = [], cur: XY[] = []
    for (let i = 1; i < s.length; i++) {
      const p = s[i - 1], q = s[i]
      if (Math.hypot(q[0] - p[0], q[1] - p[1]) < 2.2) { if (!cur.length) cur.push(p); cur.push(q) } else { if (cur.length > best.length) best = cur; cur = [] }
    }
    if (cur.length > best.length) best = cur
    let far: XY, rr = 0
    if (best.length >= 6) {
      far = [best.reduce((t, p) => t + p[0], 0) / best.length, best.reduce((t, p) => t + p[1], 0) / best.length]
      rr = Math.max(...best.map((p) => Math.hypot(p[0] - far[0], p[1] - far[1])))
    } else {
      let dmax = 0; far = s[1]
      for (const p of s) { const d = Math.hypot(p[0] - root[0], p[1] - root[1]); if (d > dmax) { dmax = d; far = p } }
    }
    const L = Math.hypot(far[0] - root[0], far[1] - root[1])
    if (L < 2) continue
    const u: XY = [(far[0] - root[0]) / L, (far[1] - root[1]) / L]
    const end: XY = rr ? [far[0] - u[0] * rr * 0.6, far[1] - u[1] * rr * 0.6] : far
    const start: XY = [root[0] - u[0] * 0.3, root[1] - u[1] * 0.3]
    beam(M.bridge, start, end, w, o.z0, o.z1, true)
    if (o.detail) { // a glazed band along both sides of the link
      const n: XY = [-u[1], u[0]]
      for (const sgn of [1, -1]) {
        const off = (w / 2 + 0.04) * sgn
        const p0: XY = [start[0] + n[0] * off + u[0] * 0.6, start[1] + n[1] * off + u[1] * 0.6], p1: XY = [end[0] + n[0] * off - u[0] * 0.6, end[1] + n[1] * off - u[1] * 0.6]
        const zA = o.z0 + 0.9, zB = o.z1 - 0.7
        const q: V3[] = [[p0[0], p0[1], zA], [p1[0], p1[1], zA], [p1[0], p1[1], zB], [p0[0], p0[1], zB]]
        if (sgn > 0) M.win.quad(q[1], q[0], q[3], q[2]); else M.win.quad(q[0], q[1], q[2], q[3])
      }
    }
    if (rr) {
      const r = Math.max(2.2, Math.min(4.5, rr))
      drum(M.bridge, far[0], far[1], r, r, o.z0 - 0.6, o.rotundaTop ?? o.z1 + 0.6, o.detail ? 16 : 8, M.roof)
      drum(M.bridge, far[0], far[1], 0.7, 0.7, 0, o.z0 - 0.6, o.detail ? 8 : 6, null)
    } else {
      drum(M.bridge, end[0], end[1], 0.5, 0.5, 0, o.z0, 6, null)
    }
  }
}

/**
 * A barrel vault on a rectangle: the curve's axis runs along x (axis = 'x')
 * or y; `rise` over the springing at z0; quarter = 1 or −1 draws only the
 * half that falls towards +/− across the axis (a quarter-round top).
 */
export function vault(p: Part, ends: Part, x0: number, y0: number, x1: number, y1: number, z0: number, rise: number, axis: 'x' | 'y', n: number, quarter = 0) {
  const span = axis === 'x' ? y1 - y0 : x1 - x0
  // profile across the axis: (a, z), a from 0 to span
  const prof: [number, number][] = []
  for (let i = 0; i <= n; i++) {
    const t = i / n
    if (!quarter) { const ang = Math.PI * (1 - t); prof.push([span * (0.5 + 0.5 * Math.cos(ang)), z0 + rise * Math.sin(ang)]) }
    else { const ang = (Math.PI / 2) * t; prof.push([span * Math.sin(ang), z0 + rise * Math.cos(ang)]) }
  }
  if (quarter > 0) for (const q of prof) q[0] = span - q[0]
  const P = (along: number, a: number, z: number): V3 => (axis === 'x' ? [along, y0 + a, z] : [x0 + a, along, z])
  const [l0, l1] = axis === 'x' ? [x0, x1] : [y0, y1]
  const cA = quarter < 0 ? 0 : quarter > 0 ? span : span / 2, rA = quarter ? span : span / 2
  const nrm = (a: number, z: number): V3 => {
    const d = unit([(a - cA) / rA, 0, (z - z0) / Math.max(0.01, rise)])
    return axis === 'x' ? [0, d[0], d[2]] : [d[0], 0, d[2]]
  }
  for (let i = 0; i < prof.length - 1; i++) {
    const [a0, za] = prof[i], [a1, zb] = prof[i + 1]
    const na = nrm(a0, za), nb = nrm(a1, zb)
    quadN(p, P(l0, a0, za), P(l1, a0, za), P(l1, a1, zb), P(l0, a1, zb), [na, na, nb, nb])
  }
  // end faces, wound to face out along the axis
  const closed = quarter ? [...prof, [cA, z0] as [number, number]] : prof
  for (const [l, sgn] of [[l0, -1], [l1, 1]] as [number, number][]) {
    const pts = closed.map(([a, z]) => P(l, a, z))
    const nE: V3 = axis === 'x' ? [sgn, 0, 0] : [0, sgn, 0]
    for (let i = 1; i < pts.length - 1; i++) ends.tri(pts[0], pts[i], pts[i + 1], undefined, undefined, undefined, [nE, nE, nE])
  }
  if (quarter) { // the tall flat side
    const nS: V3 = axis === 'x' ? [0, quarter > 0 ? 1 : -1, 0] : [quarter > 0 ? 1 : -1, 0, 0]
    quadN(ends, P(l0, cA, z0), P(l1, cA, z0), P(l1, cA, z0 + rise), P(l0, cA, z0 + rise), [nS, nS, nS, nS])
  }
}

export function writeLod(name: string, file: string, parts: { part: Part; material: MaterialSpec }[], extras: Record<string, unknown>, maxTris: number, maxBytes: number) {
  const used = parts.filter(({ part }) => part.triangles > 0)
  const triangles = used.reduce((t, { part }) => t + part.triangles, 0)
  if (used.length > 6) throw new Error(`${file}: too many materials: ${used.length}`)
  const glb = writeGlb(name, used, { license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor', ...extras })
  console.log(`${file}: ${triangles} triangles, ${glb.length} bytes`)
  if (triangles > maxTris) throw new Error(`${file}: triangle budget exceeded: ${triangles}`)
  if (glb.length > maxBytes) throw new Error(`${file}: size budget exceeded: ${glb.length}`)
  Bun.write(new URL(`../models/${file}`, import.meta.url).pathname, glb)
}

/** Fresh parts for one level of detail. */
export const newMats = (names: string[]): Mats => Object.fromEntries(names.map((n) => [n, new Part()]))

// ===========================================================================
// OSM data, in this frame (bearing -30, anchor 139.7833805, 35.5495630)
// ===========================================================================

/** OSM way/500688113 */
export const T1_OUTLINE: XY[] = [[57.6, 315.5], [62.9, 315.5], [63, 283.2], [15.2, 283.2], [15.6, 245.3], [16.5, 165.8], [16.1, 160.3], [31.6, 160.3], [51.9, 160.5], [52.3, 133.2], [52.3, 127.8], [52.4, 124.1], [52.5, 119], [52.5, 114], [52.7, 104.9], [52.8, 97.1], [52.8, 95.3], [52.9, 90.1], [52.9, 69.1], [53, 52.4], [53.1, 35], [53.2, 29.3], [53.3, 20.2], [53.5, 7.4], [53.6, -3], [53.7, -25], [53.9, -42], [54, -71], [54.3, -94.3], [55.3, -122.7], [55.1, -158], [55.2, -190.3], [55.1, -196.3], [55.2, -204.6], [55.4, -213.4], [55.5, -222.9], [55.6, -227.6], [55.7, -233.6], [55.7, -250.4], [55.9, -267.2], [56.1, -295.8], [56.3, -322.1], [56.4, -326.7], [56.5, -336.7], [56.7, -358], [36.7, -358], [25.1, -358.1], [17.8, -358.1], [18, -431.4], [18.1, -440.6], [18.3, -481.6], [66, -481.7], [66.1, -513.8], [60.8, -513.7], [84.7, -530], [86.1, -530.1], [87.5, -530.6], [88.6, -531.6], [89.3, -532.9], [89.4, -534.4], [89, -535.8], [88.1, -536.9], [86.9, -537.7], [85.5, -538], [84, -537.8], [82.7, -537], [81.8, -535.9], [81.4, -534.5], [81.5, -533], [53.7, -514], [9.7, -514.1], [26, -529.6], [27.5, -529.3], [29.1, -529.6], [30.4, -530.5], [31.2, -531.8], [31.5, -533.4], [31.2, -534.9], [30.3, -536.2], [28.9, -537], [27.4, -537.3], [25.8, -537], [24.6, -536.1], [23.7, -534.7], [23.4, -533.2], [23.7, -532.6], [4.4, -514.1], [-8.2, -514.3], [-31, -537.3], [-31, -538.8], [-31.6, -540.1], [-32.6, -541.2], [-33.8, -541.8], [-35.3, -541.9], [-36.7, -541.5], [-37.9, -540.7], [-38.6, -539.5], [-39, -538.1], [-38.8, -536.6], [-38.1, -535.4], [-37, -534.5], [-35.6, -534], [-34.1, -534], [-14, -513.9], [-79.1, -514], [-93.9, -536], [-93.6, -537.5], [-93.9, -539], [-94.8, -540.3], [-96.2, -541.1], [-97.7, -541.4], [-99.3, -541.1], [-100.5, -540.2], [-101.4, -538.8], [-101.7, -537.3], [-101.3, -535.8], [-100.4, -534.5], [-99.1, -533.7], [-97.6, -533.4], [-84.1, -513.9], [-85.8, -513.7], [-85.7, -512.2], [-105.5, -523.2], [-105.8, -524.8], [-106.7, -526.1], [-108, -526.9], [-109.6, -527.2], [-111.1, -526.8], [-112.4, -525.9], [-113.3, -524.6], [-113.5, -523.1], [-113.2, -521.5], [-112.3, -520.2], [-111, -519.4], [-109.4, -519.1], [-107.9, -519.5], [-86.1, -507.2], [-86.1, -491.3], [-106.7, -491.1], [-107.8, -492.1], [-109.2, -492.6], [-110.6, -492.6], [-112, -492.1], [-113.1, -491.2], [-113.8, -489.9], [-114, -488.4], [-113.6, -487], [-112.8, -485.8], [-111.6, -485], [-110.1, -484.7], [-108.7, -484.9], [-107.4, -485.6], [-106.5, -486.7], [-86.1, -486.7], [-86.1, -482.1], [-60.8, -456.7], [-83.8, -450.4], [-84, -450.7], [-85.2, -451.5], [-86.5, -451.8], [-87.8, -451.6], [-89, -451], [-90, -450.1], [-90.5, -448.8], [-90.6, -447.5], [-90.3, -446.2], [-89.5, -445.1], [-88.3, -444.4], [-87, -444], [-85.7, -444.2], [-84.5, -444.8], [-83.5, -445.8], [-83, -447], [-57.6, -454.1], [-48.9, -445.7], [-20, -445.7], [-20.3, -404.4], [-40.6, -404.2], [-41.7, -405.2], [-43.1, -405.7], [-44.5, -405.7], [-45.9, -405.2], [-47, -404.2], [-47.7, -402.9], [-47.9, -401.5], [-47.5, -400.1], [-46.7, -398.9], [-45.5, -398.1], [-44, -397.8], [-42.6, -398], [-41.3, -398.7], [-40.4, -399.8], [-20.4, -399.8], [-20.6, -392.6], [-20.5, -352.2], [-20.5, -343.5], [-20.6, -337.1], [-20.9, -322.5], [-21, -314.1], [-41.4, -314], [-42.5, -314.9], [-43.9, -315.5], [-45.3, -315.5], [-46.7, -315], [-47.8, -314], [-48.5, -312.7], [-48.7, -311.3], [-48.3, -309.8], [-47.5, -308.7], [-46.2, -307.8], [-44.8, -307.5], [-43.4, -307.7], [-42.1, -308.4], [-41.1, -309.5], [-21.1, -309.5], [-21.2, -302.4], [-21.3, -283.4], [-21.3, -264.4], [-21.4, -254.5], [-21.5, -243.9], [-21.6, -224.2], [-41.6, -224.1], [-42.7, -225], [-44, -225.6], [-45.5, -225.6], [-46.9, -225.1], [-48, -224.1], [-48.7, -222.8], [-48.8, -221.3], [-48.5, -219.9], [-47.7, -218.7], [-46.4, -217.9], [-45, -217.6], [-43.6, -217.8], [-42.3, -218.5], [-41.3, -219.6], [-21.6, -219.6], [-21.7, -209.4], [-22, -167.5], [-22.1, -153.9], [-50.2, -154], [-70.5, -134.2], [-95, -141], [-95.6, -142.1], [-96.6, -142.9], [-97.7, -143.3], [-99, -143.4], [-100.3, -143], [-101.3, -142.3], [-102.1, -141.3], [-102.4, -140.1], [-102.4, -138.8], [-101.9, -137.6], [-101.1, -136.6], [-100, -136], [-98.8, -135.7], [-97.5, -135.8], [-96.4, -136.4], [-74.3, -130.3], [-87.4, -117.9], [-87.3, -104.7], [-107.4, -104.5], [-108.5, -105.5], [-109.8, -106], [-111.3, -106], [-112.7, -105.5], [-113.8, -104.5], [-114.4, -103.3], [-114.6, -101.8], [-114.3, -100.4], [-113.4, -99.2], [-112.2, -98.4], [-110.8, -98.1], [-109.3, -98.3], [-108.1, -99], [-107.1, -100.1], [-87.3, -100.1], [-87.1, -79.8], [-74.6, -67.3], [-95.8, -61.6], [-97.1, -62.2], [-98.5, -62.4], [-99.9, -62], [-101.1, -61.2], [-101.9, -60], [-102.2, -59], [-102.3, -58.6], [-102.1, -57.1], [-101.4, -55.8], [-100.2, -54.9], [-98.9, -54.4], [-97.4, -54.5], [-96, -55.1], [-95, -56.1], [-94.4, -57.4], [-71, -63.6], [-55.6, -48.2], [-69.4, -34.3], [-70.8, -34.2], [-72.1, -33.6], [-73.2, -32.6], [-73.8, -31.2], [-73.9, -29.8], [-73.4, -28.4], [-72.5, -27.3], [-71.3, -26.5], [-69.8, -26.3], [-68.4, -26.6], [-67.2, -27.3], [-66.3, -28.5], [-65.9, -29.9], [-66, -31.4], [-52.4, -44.9], [-50.9, -43.5], [-21.9, -43.7], [-22, 22.4], [-22.1, 33.4], [-22.1, 44.5], [-22.1, 54.7], [-22.2, 75.6], [-41.9, 75.7], [-42.9, 74.7], [-44.3, 74.2], [-45.8, 74.2], [-47.1, 74.7], [-48.2, 75.7], [-48.9, 77], [-49.1, 78.4], [-48.7, 79.8], [-47.9, 81], [-46.7, 81.9], [-45.3, 82.2], [-43.8, 82], [-42.5, 81.3], [-41.6, 80.2], [-22.2, 80.2], [-22.4, 153.6], [-42.5, 153.7], [-43.6, 152.8], [-44.9, 152.2], [-46.4, 152.2], [-47.7, 152.7], [-48.9, 153.7], [-49.5, 155], [-49.7, 156.5], [-49.4, 157.9], [-48.5, 159.1], [-47.3, 159.9], [-45.9, 160.2], [-44.4, 160], [-43.2, 159.3], [-42.2, 158.2], [-22.4, 158.2], [-22.5, 163.9], [-22.4, 174.7], [-22.4, 176.8], [-22.7, 217.2], [-22.7, 246.3], [-51.3, 246.4], [-72.1, 266.9], [-87.6, 252], [-87.7, 250.5], [-88.3, 249.2], [-89.3, 248.2], [-90.6, 247.6], [-92.1, 247.5], [-93.5, 248], [-94.6, 248.9], [-95.4, 250.2], [-95.6, 251.6], [-95.3, 253], [-94.5, 254.2], [-93.3, 255.1], [-91.9, 255.5], [-90.5, 255.4], [-75.4, 270.1], [-77.2, 271.8], [-109.6, 274.2], [-110.8, 273.3], [-112.2, 272.8], [-113.6, 272.9], [-115, 273.5], [-116, 274.5], [-116.6, 275.8], [-116.7, 277.3], [-116.3, 278.6], [-115.4, 279.8], [-114.2, 280.5], [-112.7, 280.8], [-111.3, 280.5], [-110, 279.8], [-109.2, 278.6], [-82.2, 276.8], [-88.8, 283.2], [-88.9, 305.4], [-108.9, 324.1], [-109.3, 323.1], [-110.1, 322.1], [-110.9, 321.7], [-111.7, 321.5], [-112.7, 321.4], [-113.5, 321.6], [-114.2, 321.9], [-115.6, 323], [-116.2, 324.1], [-116.6, 333.1], [-116.4, 334], [-115.9, 335.1], [-115.3, 335.7], [-114.5, 336.2], [-112.9, 336.6], [-111.6, 336.3], [-110.7, 335.9], [-109.9, 335.2], [-109.2, 334], [-108.9, 332.8], [-88.9, 314.4], [-88.9, 315.7], [-84.7, 315.7], [-95.5, 334.6], [-97, 335], [-98.1, 335.9], [-98.9, 337.1], [-99.2, 338.6], [-98.9, 340], [-98.1, 341.3], [-97, 342.1], [-95.6, 342.6], [-94.1, 342.5], [-92.8, 341.8], [-91.8, 340.8], [-91.2, 339.4], [-91.1, 338], [-91.6, 336.6], [-79.4, 315.6], [-21.3, 315.6], [-35.2, 334.9], [-36.6, 335.2], [-37.8, 336], [-38.7, 337.2], [-39.1, 338.6], [-39, 340], [-38.4, 341.3], [-37.3, 342.3], [-36, 342.9], [-34.5, 342.9], [-33.1, 342.4], [-32, 341.5], [-31.3, 340.2], [-31.1, 338.8], [-31.4, 337.3], [-15.8, 315.6], [2.8, 315.5], [15.5, 337.8], [15.2, 339.3], [15.4, 340.7], [16.1, 342], [17.2, 342.9], [18.6, 343.4], [20, 343.3], [21.4, 342.7], [22.4, 341.7], [23.1, 340.4], [23.2, 339], [22.8, 337.6], [21.9, 336.4], [20.7, 335.6], [19.2, 335.4], [7.6, 315.5], [24, 315.5], [24.1, 317.2], [27.5, 337.9], [27, 478.4], [3.2, 519.5], [3.3, 525], [-3.8, 525.1], [-3.8, 533.2], [-23.1, 533], [-23.1, 539.9], [-3.8, 540], [-4, 627.5], [-11.9, 627.6], [-11.9, 621.8], [-21.4, 621.9], [-21.4, 629.3], [-21.4, 631.2], [-4, 631.1], [-4.2, 703.7], [-12.5, 703.7], [-12.5, 697.9], [-21.9, 698], [-21.9, 705.5], [-21.9, 707.3], [-4.2, 707.2], [-4.4, 772.1], [-14, 772.1], [-13.9, 767.4], [-22.1, 767.5], [-22.1, 774.6], [-22.1, 776.8], [-4.4, 776.8], [-4.5, 841.5], [-14.4, 841.6], [-14.4, 836.9], [-22.5, 836.9], [-22.5, 844.4], [-22.5, 846.3], [-4.6, 846.2], [-4.6, 849.8], [6.4, 849.8], [6.4, 902], [-20.6, 912.6], [-20.2, 913.8], [-19.8, 915.1], [9.2, 903.8], [9.1, 849.8], [16.3, 849.7], [16.4, 800.7], [21.1, 800.7], [21.7, 574.3], [18, 574.3], [18.1, 525], [17.7, 525], [17.7, 517.2], [23.9, 506.7], [30.7, 506.8], [38.7, 493.4], [39, 315.5], [51.6, 315.5]]

// ===========================================================================
// Terminal 1
// ===========================================================================

const T1_MATS = ['wall', 'win', 'roof', 'trim', 'glass', 'bridge']

function buildT1(detail: boolean) {
  const M = newMats(T1_MATS)
  const { body, spurs } = despur(T1_OUTLINE)
  const B = simplify(body, 0.35)

  // The same broad panels in both levels of detail: finer bays read as stripes.
  const d = (f: Facade): Facade => f
  // Five storeys over the apron-level service floor; window bands two storeys a panel.
  const MAIN: Facade = d({ bay: 12, ratio: 0.88, floor: 4.4, group: 2, spandrel: 2.8, sill: 1.2, head: 2.2, ground: 5.6, minLength: 6 })
  // The centre block: panels three storeys tall.
  const CTR: Facade = d({ bay: 12, ratio: 0.88, floor: 4.4, group: 3, spandrel: 3.2, sill: 1.2, head: 2.4, ground: 5.6, minLength: 6 })
  // The gate strips, fans and piers: the service floor and one glazed lounge storey.
  const LOW: Facade = d({ bay: 8, ratio: 0.86, floor: 4.0, group: 1, spandrel: 0, sill: 1.2, head: 1.8, ground: 5.4, minLength: 6 })

  // The landside walls are plain tile panels above one broad glazed band over the curb.
  const LAND: Facade = d({ bay: 12, ratio: 0.86, floor: 6, group: 1, spandrel: 0, sill: 1.2, head: 11.5, ground: 5.6, minLength: 6 })
  const landside = (f: Facade) => (n: XY) => (n[0] > 0.7 ? LAND : f)
  const zones: Zone[] = [
    { rect: [-200, -600, 200, 1000], z: H_LOW, facade: LOW },
    { rect: [-100, -160, -22, -40], z: H_LOW + 0.6, facade: LOW, roof: 'glass' }, // the central fan's glass roof
    { rect: [-30, -358.5, 70, 160.4], z: H_MAIN, facade: MAIN, facadeFor: landside(MAIN) },
    { rect: [-30, 160.4, 20, 246.5], z: H_MAIN, facade: MAIN },
    { rect: [-6, CENTRE[0], 70, CENTRE[1]], z: H_CENTRE, facade: CTR, facadeFor: landside(CTR) },
  ]
  zoneMass(M, B, zones)

  // --- Rooftop: the two quarter-round towers flanking the centre, the lunette, the skylights ---
  const [c0, c1] = CENTRE
  const tw = 28, tx0 = 30, tx1 = 55
  // south tower high on its south side, north tower high on its north side: both fall towards the entrance
  prismRing(M.wall, [[tx0, c0 + 1], [tx1, c0 + 1], [tx1, c0 + 1 + tw], [tx0, c0 + 1 + tw]], H_CENTRE - 1, H_TOWER, null)
  vault(M.roof, M.wall, tx0, c0 + 1, tx1, c0 + 1 + tw, H_TOWER, 7, 'x', detail ? 10 : 5, -1)
  prismRing(M.wall, [[tx0, c1 - 1 - tw], [tx1, c1 - 1 - tw], [tx1, c1 - 1], [tx0, c1 - 1]], H_CENTRE - 1, H_TOWER, null)
  vault(M.roof, M.wall, tx0, c1 - 1 - tw, tx1, c1 - 1, H_TOWER, 7, 'x', detail ? 10 : 5, 1)
  // the glazed lunette over the entrance: a half-round vault on a glass bay, its fan facing the road
  const ly = (c0 + c1) / 2
  prismRing(M.glass, [[40, ly - 7], [55.5, ly - 7], [55.5, ly + 7], [40, ly + 7]], H_CENTRE - 1, H_CENTRE + 2, null)
  vault(M.roof, M.glass, 40, ly - 7, 55.5, ly + 7, H_CENTRE + 2, 7, 'x', detail ? 12 : 6)
  // skylight strips over the departure lobbies (white in the aerial)
  for (const [y0, y1] of [[25, 150], [-345, -200]] as [number, number][]) {
    prismRing(M.glass, [[16, y0], [27, y0], [27, y1], [16, y1]], H_MAIN - 0.2, H_MAIN + 1.4)
  }
  // rooftop plant on the gate strip and the main roof (detail only)
  if (detail) {
    for (const y of [-300, -240, -20, 60, 120, 200]) prismRing(M.trim, [[2, y], [12, y], [12, y + 14], [2, y + 14]], H_MAIN - 0.2, H_MAIN + 2.6)
    for (const y of [-430, 400, 600, 780]) prismRing(M.trim, [[0, y], [10, y], [10, y + 12], [0, y + 12]], H_LOW - 0.2, H_LOW + 2.2)
  }

  // --- The glazed entrance canopy: a glass roof on a white steel frame, stepping down to the curb ---
  // It hangs out past OSM's outline (the landside wall is at x ≈ 55) over the departures curb, between the towers.
  {
    const XW = 55.2, XC = 80 // wall and curb edge
    const bays: [number, number, number, number][] = [ // y0, y1, z at the wall, z at the curb
      [c0 + 8, c0 + 30, 19, 10.5],
      [c0 + 30, c1 - 30, 24, 11.5],
      [c1 - 30, c1 - 8, 19, 10.5],
    ]
    const up: V3 = [0, 0, 1]
    for (const [y0, y1, zw, zc] of bays) {
      const n = unit([(zw - zc) / (XC - XW), 0, 1])
      const A: V3 = [XW, y0, zw], Bq: V3 = [XC, y0, zc], C: V3 = [XC, y1, zc], D: V3 = [XW, y1, zw]
      quadN(M.glass, A, Bq, C, D, [n, n, n, n])
      const m: V3 = [-n[0], 0, -n[2]]
      quadN(M.glass, A, D, C, Bq, [m, m, m, m])
      // the frame: a white edge beam round the glass and a ridge rib every 7 m
      const t = 0.9, h = 1.1
      const edge = (p: V3, q: V3) => {
        const L = Math.hypot(q[0] - p[0], q[1] - p[1]), ux = (q[0] - p[0]) / L, uy = (q[1] - p[1]) / L
        const nx = -uy * t / 2, ny = ux * t / 2
        const P = (r: V3, sx: number, dz: number): V3 => [r[0] + nx * sx, r[1] + ny * sx, r[2] + dz]
        const r0 = [P(p, -1, 0.15), P(q, -1, 0.15), P(q, 1, 0.15), P(p, 1, 0.15)], r1 = [P(p, -1, -h), P(q, -1, -h), P(q, 1, -h), P(p, 1, -h)]
        quadN(M.trim, r0[0], r0[1], r0[2], r0[3], [up, up, up, up])
        for (let k = 0; k < 4; k++) { const a = r1[k], b = r1[(k + 1) % 4], c = r0[(k + 1) % 4], d2 = r0[k]; M.trim.quad(a, b, c, d2); M.trim.quad(d2, c, b, a) }
      }
      edge(Bq, C); edge(A, Bq); edge(C, D)
      // the open ends of the shed, glazed: a triangle from the wall down to the curb edge's height
      for (const [y, sg] of [[y0, -1], [y1, 1]] as [number, number][]) {
        const ne: V3 = [0, sg, 0]
        M.glass.tri([XW, y, zc], [XC, y, zc], [XW, y, zw], undefined, undefined, undefined, [ne, ne, ne])
        const nb: V3 = [0, -sg, 0]
        M.glass.tri([XW, y, zc], [XW, y, zw], [XC, y, zc], undefined, undefined, undefined, [nb, nb, nb])
      }
      if (detail) for (let y = y0 + 7; y < y1 - 1; y += 7) edge([XW, y, zw], [XC, y, zc])
      // posts at the curb edge, and in the detail level struts back to the wall
      for (const y of [y0 + 1, y1 - 1, ...(y1 - y0 > 30 ? [y0 + (y1 - y0) / 3, y0 + (2 * (y1 - y0)) / 3] : [])]) {
        beam(M.trim, [XC - 1.2, y - 0.5], [XC - 1.2, y + 0.5], 1.0, 0, zc - 1.1, false)
        if (detail) beam(M.trim, [XC - 1.2, y], [XW, y], 0.5, zc - 2.6, zc - 2.0, true)
      }
    }
  }

  // --- Jet bridges: the fixed links and rotundas OSM draws ---
  jetBridges(M, spurs, { z0: 4.6, z1: 8.0, detail })

  return [
    { part: M.wall, material: finish('hnd-t1-panel', 0xdcd6cc) },
    { part: M.win, material: { name: 'window', color: 0x8ea3b3, roughness: 0.35 } },
    { part: M.roof, material: PALETTE.roof },
    { part: M.trim, material: finish('hnd-t1-trim', 0xf1efea) },
    { part: M.glass, material: PALETTE.glass },
    { part: M.bridge, material: finish('hnd-jet-bridge', 0xc6cacd) },
  ]
}

const H_LOW = 12, H_MAIN = 25, H_CENTRE = 31.5, H_TOWER = 36.5
/** The central block's south and north ends (model y): the entrance axis is at y −105. */
const CENTRE: [number, number] = [-175, -35]

if (import.meta.main) {
  const extras = { bearing: -30, osm: 'way/500688113', height: H_TOWER + 7 }
  writeLod('Haneda Airport Terminal 1', 'tokyo-haneda-terminal-1.glb', buildT1(false), extras, 8000, 250_000)
  writeLod('Haneda Airport Terminal 1', 'tokyo-haneda-terminal-1.detail.glb', buildT1(true), extras, 40_000, 1_500_000)
}
