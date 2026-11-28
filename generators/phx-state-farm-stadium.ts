/**
 * State Farm Stadium, Glendale, Arizona (2006, Eisenman Architects with HOK
 * Sport; roof engineering Walter P Moore) — original procedural geometry,
 * CC0-1.0.
 * bun generators/phx-state-farm-stadium.ts
 *
 * Map frame: x east, y north, z up, metres, turned to the placement's
 * bearing 328.5: the model's +y runs along the stadium's long axis towards
 * the north-north-west, so the field tray's end is the model's south (-y).
 * Origin: the centre of the retractable roof in the lidar, -112.2625200,
 * 33.5276732. OSM's outline (relation/7370103, outer way/24635893) has the
 * same size and shape but sits about 8 m west and 12 m north of the lidar
 * footprint, so the model follows the lidar.
 *
 * Identity (from the photos below):
 *  1. Eisenman's "barrel cactus": a rounded drum of silver, horizontally
 *     ribbed metal staves that bulge outward and curl in at the top, the long
 *     sides in two staggered tiers, the ends in single tall staves.
 *                                                    (tf, aerial, cbp, fm355)
 *  2. Tall slots between the staves, glazed (fm355, tf) or dark recesses,
 *     running from the concourse to the roof edge.   (tf, gs1, fm355)
 *  3. The pale fabric roof: a low pillow over the drum with white radial
 *     ribs landing at the slots, and the long rectangle of the two
 *     retractable panels on its rails along the long axis.   (cbp, aerial)
 *  4. The dark glazed concourse at plaza level, set back under the staves.
 *                                                    (tf, gs1)
 *  5. At the south-south-east end the field tray's portal: a white box under
 *     the end's big centre stave, facing the sunken pad where the grass
 *     tray sits outdoors.                            (fm355)
 *
 * Plan, measured from USGS 3DEP lidar AZ_MaricopaPinal_1_2020 (flown 2020,
 * 1 m grid, tools/lidar.py), read along radial lines from the roof centre:
 * the drum's widest line is a superellipse, exponent 2.7, half-axes 115 m
 * (x) and 137 m (y) (lidar edges 112–116 / 136–138 m on the axes, 130–142 m
 * on the diagonals). The retractable panels' rectangle is ±44 × ±60 m.
 * At the north-north-west end the lower tier of staves stands proud of the
 * upper one: out to y 155 across the end and about 7 m out round the
 * north-east quarter, its top at 32 m (lidar 31–34 m; cbp shows the lower
 * barrels bulging past the upper ones there).
 *
 * Heights (model metres above y = 0; lidar ground_min 316.49 m, y = 0 =
 * 316.87 m, the floor of the field tray's outdoor pad, the lowest ground
 * under the footprint in the map's terrain): plaza round the stadium 11.8
 * (lidar ground 328.3–328.6 m); the drum's rim, where the silver meets the
 * fabric, 50.6; the fixed roof at the panels' edge 63 (ends) to 67 (sides);
 * the panels' crown 73 (lidar 73–74). The tray's grass, rolled out in the
 * 2020 flight, reads 318.0 m, 10.3 m below the plaza: the field is sunk, and
 * the pad that shows the sinking is in the map's terrain beside the south
 * end, so `elevation` stays 0 and the map's lowest ground under the
 * footprint is the pad's floor (see the terrain check in the report).
 * Wikipedia's "field level 1,070 feet" is a rounded figure and not used.
 *
 * Estimated: the stave layout (20 bays; slot centres at ±9, ±26, ±42, ±58
 * and ±74 degrees from each axis, from the bay rhythm in tf and fm355); the
 * section of a stave (base 6.7 m above the plaza, 4.5 m in from the widest
 * line, bulging out to it and curling 7 m in at the rim; the long sides'
 * upper tier lapping 1.2 m over the lower at 31 m); which bays are single
 * staves (those within 35° of the ends, fm355); the tray portal (80 m wide,
 * 19 m tall, from fm355 against the centre stave's width); how far the
 * proud lower tier's barrels curve (only cbp shows that end, from above).
 * Left out: the field (the map's), lettering and logos (plain signs), the
 * free-standing gate canopies, light masts and the plaza.
 *
 * Photos (evidence, Wikimedia Commons / Flickr):
 *  aerial "University of Phoenix Stadium aerial.jpg", Gerald Nino, U.S.
 *         Customs and Border Protection, public domain
 *         https://commons.wikimedia.org/wiki/File:University_of_Phoenix_Stadium_aerial.jpg
 *  cbp    "CBP provides security for Super Bowl LVII (7624269).jpg", Glenn
 *         Fawcett, CBP, public domain
 *         https://commons.wikimedia.org/wiki/File:CBP_provides_security_for_Super_Bowl_LVII_(7624269).jpg
 *  tf     "State Farm Stadium 2022.jpg", Troutfarm27, CC BY-SA 4.0
 *         https://commons.wikimedia.org/wiki/File:State_Farm_Stadium_2022.jpg
 *  gs1    "University of Phoenix Stadium (23514421801).jpg", Gage Skidmore,
 *         CC BY-SA 2.0
 *         https://commons.wikimedia.org/wiki/File:University_of_Phoenix_Stadium_(23514421801).jpg
 *  fm355  "Peter Eisenman with HOK Sport - University of Phoenix Stadium",
 *         Forgemind ArchiMedia, CC BY 2.0 (the south end, tray rolled out)
 *         https://www.flickr.com/photos/44343967@N00/5429303355
 * Published: Wikipedia, "State Farm Stadium" (architects, translucent
 * Birdair fabric roof, roll-in natural grass field tray).
 * No look-only sources. No commercial imagery. NAIP was not reachable
 * (service timed out), so the plan rests on lidar and the PD aerials.
 *
 * Night: the slots and the concourse glazing are `window` and glow; the
 * fabric, ribs and silver stay unlit.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, type Swatch } from './palette'

const ID = 'phx-state-farm-stadium'
const silver = new Part(), fabric = new Part(), rib = new Part(), slot = new Part(), base = new Part()

const deg = (d: number) => (d * Math.PI) / 180
const N_EXP = 2.7, AX = 115, AY = 137
/** The drum's widest line: superellipse radius at polar angle t. */
const R = (t: number) => Math.pow(Math.pow(Math.abs(Math.cos(t)) / AX, N_EXP) + Math.pow(Math.abs(Math.sin(t)) / AY, N_EXP), -1 / N_EXP)
const at = (t: number, r: number, z: number): V3 => [Math.cos(t) * r, Math.sin(t) * r, z]

const PLAZA = 11.8, SKIN0 = 15.8, RIM = 50.6, CURL = 7, BASE_IN = 6

// ── Smooth parametric surfaces ──────────────────────────────────────────
type Fn = (u: number, v: number) => V3
const nrm = (a: V3): V3 => {
  const l = Math.hypot(a[0], a[1], a[2]) || 1
  return [a[0] / l, a[1] / l, a[2] / l]
}
/** Tessellate f over [0,1]² in nu × nv cells, smooth-shaded, normals turned towards `out(p)`. */
function surface(part: Part, f: Fn, nu: number, nv: number, out: (p: V3) => V3, smooth = true) {
  const e = 1e-3
  const N = (u: number, v: number): V3 => {
    const p = f(u, v)
    const du = f(Math.min(1, u + e), v), du0 = f(Math.max(0, u - e), v)
    const dv = f(u, Math.min(1, v + e)), dv0 = f(u, Math.max(0, v - e))
    const a: V3 = [du[0] - du0[0], du[1] - du0[1], du[2] - du0[2]]
    const b: V3 = [dv[0] - dv0[0], dv[1] - dv0[1], dv[2] - dv0[2]]
    let n = nrm([a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]])
    const o = out(p)
    if (n[0] * o[0] + n[1] * o[1] + n[2] * o[2] < 0) n = [-n[0], -n[1], -n[2]]
    return n
  }
  for (let i = 0; i < nu; i++)
    for (let j = 0; j < nv; j++) {
      const u0 = i / nu, u1 = (i + 1) / nu, v0 = j / nv, v1 = (j + 1) / nv
      const P = [f(u0, v0), f(u1, v0), f(u1, v1), f(u0, v1)]
      if (smooth) {
        const Q = [N(u0, v0), N(u1, v0), N(u1, v1), N(u0, v1)]
        part.tri(P[0], P[1], P[2], undefined, undefined, undefined, [Q[0], Q[1], Q[2]])
        part.tri(P[0], P[2], P[3], undefined, undefined, undefined, [Q[0], Q[2], Q[3]])
      } else {
        const n = N((u0 + u1) / 2, (v0 + v1) / 2)
        part.tri(P[0], P[1], P[2], undefined, undefined, undefined, [n, n, n])
        part.tri(P[0], P[2], P[3], undefined, undefined, undefined, [n, n, n])
      }
    }
}
const radialOut = (p: V3): V3 => [p[0], p[1], 0]
const up = (): V3 => [0, 0, 1]

// ── The staves ──────────────────────────────────────────────────────────
// Slot centres, symmetric about both axes.
const Q = [9, 26, 42, 58, 74]
const slotAngles = [...Q, ...Q.map((a) => 180 - a), ...Q.map((a) => 180 + a), ...Q.map((a) => 360 - a)].sort((a, b) => a - b)
const SLOT_HALF = 3.6 // metres
const halfAngle = (t: number) => SLOT_HALF / R(t)
const TIER = 32 // the top of the lower tier

/** Inset from the widest line at height z, for a single tall stave (the tray end). */
function insetSingle(z: number) {
  if (z <= 38) {
    const s = (z - SKIN0) / (38 - SKIN0)
    return 2.5 * (1 - Math.sin((s * Math.PI) / 2))
  }
  const s = (z - 38) / (RIM - 38)
  return CURL * (1 - Math.cos((s * Math.PI) / 2))
}
/** The lower tier: a barrel from the concourse to TIER, widest at 25 m. */
function insetLower(z: number) {
  const s = (z - 25) / (z < 25 ? 25 - SKIN0 : TIER - 25)
  return 0.9 + (z < 25 ? 1.6 : 1.4) * s * s
}
/** The upper tier, from 30 m to the rim, widest at 38 m, curling in to the roof. */
function insetUpper(z: number) {
  if (z <= 38) return -0.5 + 1.8 * ((38 - z) / 8) ** 2
  const s = (z - 38) / (RIM - 38)
  return -0.5 + (CURL + 0.5) * (1 - Math.cos((s * Math.PI) / 2))
}
/**
 * How far the lower tier stands out at the north-north-west end: the lidar
 * shows it 31–34 m tall reaching to y 155 at the end's centre and about
 * 7 m out round the north-east quarter (cbp shows the lower barrels
 * proud of the upper ones there).
 */
function proud(t: number) {
  const a = ((t * 180) / Math.PI + 360) % 360
  if (a >= 74 && a <= 106) return 17
  if (a >= 33 && a < 74) return 7
  return 0
}
const isTrayEnd = (mid: number) => Math.sin(mid) < -Math.cos(deg(35))
/** The silver's inset at a slot edge, for the slot's back wall and cheeks. */
const edgeInset = (z: number, tray: boolean) => (tray ? insetSingle(z) : z < TIER ? insetLower(z) : insetUpper(z))

const COLS = 6
for (let k = 0; k < slotAngles.length; k++) {
  const a0 = deg(slotAngles[k]), a1 = deg(slotAngles[(k + 1) % slotAngles.length] + (k === slotAngles.length - 1 ? 360 : 0))
  const tA = a0 + halfAngle(a0), tB = a1 - halfAngle(a1)
  const mid = (a0 + a1) / 2
  const T = (u: number) => tA + (tB - tA) * u
  const B = (u: number) => 1.3 * Math.sin(Math.PI * u)
  const fade = (z: number) => 1 - Math.max(0, (z - 40) / (RIM - 40))
  const E = proud(mid)
  if (isTrayEnd(mid)) {
    surface(silver, (u, v) => {
      const z = SKIN0 + (RIM - SKIN0) * v
      const t = T(u)
      return at(t, R(t) + B(u) * fade(z) - insetSingle(z), z)
    }, COLS, 9, radialOut)
  } else {
    const lower = (u: number, z: number) => R(T(u)) + B(u) + E - insetLower(z)
    const upper = (u: number, z: number) => R(T(u)) + B(u) * fade(z) - insetUpper(z)
    surface(silver, (u, v) => {
      const z = SKIN0 + (TIER - SKIN0) * v
      return at(T(u), lower(u, z), z)
    }, COLS, 5, radialOut)
    surface(silver, (u, v) => {
      const z = 30 + (RIM - 30) * v
      return at(T(u), upper(u, z), z)
    }, COLS, 7, radialOut)
    for (let i = 0; i < COLS; i++) {
      const u0 = i / COLS, u1 = (i + 1) / COLS
      if (E === 0) {
        // the upper tier's lapped underside at 30 m, facing down
        const o = (u: number) => upper(u, 30), n = (u: number) => lower(u, 30) - 0.5
        silver.quad(at(T(u0), n(u0), 30), at(T(u1), n(u1), 30), at(T(u1), o(u1), 30), at(T(u0), o(u0), 30))
      } else {
        // the proud lower tier's flat top, back to the upper tier
        const o = (u: number) => lower(u, TIER), n = (u: number) => upper(u, TIER) - 0.5
        silver.quad(at(T(u0), n(u0), TIER), at(T(u0), o(u0), TIER), at(T(u1), o(u1), TIER), at(T(u1), n(u1), TIER))
      }
    }
  }
  // where the lower tier stands proud, its concourse wall comes out under it
  if (E > 0) {
    surface(base, (u, v) => at(T(u), R(T(u)) + E - 3, SKIN0 * v), COLS, 1, radialOut, false)
    for (const [u, s] of [[0, -1], [1, 1]] as [number, number][]) {
      const t = T(u)
      surface(base, (w, v) => at(t, R(t) - BASE_IN + (E - 3 + BASE_IN) * w, SKIN0 * v), 1, 1, () => [-Math.sin(t) * s, Math.cos(t) * s, 0], false)
    }
    const n = Math.max(2, Math.round((tB - tA) / deg(3)))
    for (let i = 0; i < n; i++) {
      const u0 = T(i / n), u1 = T((i + 1) / n)
      slot.quad(at(u0, R(u0) + E - 2.94, PLAZA + 0.4), at(u1, R(u1) + E - 2.94, PLAZA + 0.4), at(u1, R(u1) + E - 2.94, SKIN0 - 0.9), at(u0, R(u0) + E - 2.94, SKIN0 - 0.9))
    }
  }
  // the stave's soffit at its foot, back to the concourse wall
  for (let i = 0; i < COLS; i++) {
    const u0 = i / COLS, u1 = (i + 1) / COLS
    const tray = isTrayEnd(mid)
    const o = (u: number) => R(T(u)) + B(u) * (tray ? 1 : 1) + (tray ? 0 : E) - (tray ? insetSingle(SKIN0) : insetLower(SKIN0))
    const n = (u: number) => R(T(u)) + (E > 0 ? E - 3 : -BASE_IN)
    silver.quad(at(T(u0), n(u0), SKIN0), at(T(u1), n(u1), SKIN0), at(T(u1), o(u1), SKIN0), at(T(u0), o(u0), SKIN0))
  }
}

// The slots: a glazed strip set 1.8 m behind the staves' edges, the full
// height of the skin, with silver cheeks either side. Where the lower tier
// stands proud the cheeks follow it out.
for (const a of slotAngles) {
  const t = deg(a), h = halfAngle(t)
  const tray = Math.sin(t) < -Math.cos(deg(40))
  const back = (z: number) => Math.max(edgeInset(z, tray), z < TIER ? insetLower(z) : insetUpper(z)) + 1.8
  surface(slot, (u, v) => {
    const z = SKIN0 - 0.2 + (RIM - 1 - SKIN0 + 0.2) * v
    const tt = t - h + 2 * h * u
    return at(tt, R(tt) - back(z), z)
  }, 1, 6, radialOut, false)
  for (const s of [-1, 1]) {
    const tt = t + s * h, E = z0E(tt, s)
    surface(silver, (u, v) => {
      const z = SKIN0 + (RIM - SKIN0) * v
      const r0 = R(tt) - back(z), r1 = R(tt) + (z < TIER ? E : 0) - Math.min(edgeInset(z, tray), z < TIER ? insetLower(z) : insetUpper(z))
      return at(tt, r0 + (r1 - r0) * u, z)
    }, 1, 8, () => [-Math.sin(tt) * s, Math.cos(tt) * s, 0], false)
  }
}
/** The proud offset of the bay on side s of a slot edge at angle tt. */
function z0E(tt: number, s: number) {
  return proud(tt + s * 0.02)
}

// ── The concourse and the base ──────────────────────────────────────────
// A wall 6 m inside the widest line from the pad's floor to the staves'
// feet: dark glazing above the plaza, plain below (hidden by the ground,
// except at the south end over the tray's pad).
const NB = 120
for (let i = 0; i < NB; i++) {
  const t0 = (i / NB) * 2 * Math.PI, t1 = ((i + 1) / NB) * 2 * Math.PI
  const r0 = R(t0) - BASE_IN, r1 = R(t1) - BASE_IN
  base.tri(at(t0, r0, 0), at(t1, r1, 0), at(t1, r1, SKIN0), undefined, undefined, undefined, [radialOut(at(t0, 1, 0)), radialOut(at(t1, 1, 0)), radialOut(at(t1, 1, 0))])
  base.tri(at(t0, r0, 0), at(t1, r1, SKIN0), at(t0, r0, SKIN0), undefined, undefined, undefined, [radialOut(at(t0, 1, 0)), radialOut(at(t1, 1, 0)), radialOut(at(t0, 1, 0))])
}
// the concourse glazing as broad window panels between the slots' piers
for (const a of slotAngles) {
  const i = slotAngles.indexOf(a), b = slotAngles[(i + 1) % slotAngles.length] + (i === slotAngles.length - 1 ? 360 : 0)
  const t0 = deg(a) + halfAngle(deg(a)) * 1.6, t1 = deg(b) - halfAngle(deg(b)) * 1.6
  const n = Math.max(2, Math.round((t1 - t0) / deg(3)))
  for (let k = 0; k < n; k++) {
    const u0 = t0 + ((t1 - t0) * k) / n, u1 = t0 + ((t1 - t0) * (k + 1)) / n
    slot.quad(at(u0, R(u0) - BASE_IN + 0.05, PLAZA + 0.4), at(u1, R(u1) - BASE_IN + 0.05, PLAZA + 0.4), at(u1, R(u1) - BASE_IN + 0.05, SKIN0 - 0.9), at(u0, R(u0) - BASE_IN + 0.05, SKIN0 - 0.9))
  }
}

// ── The roof ────────────────────────────────────────────────────────────
const PX = 44, PY = 60 // the retractable panels' half-extents
const RIM_R = (t: number) => R(t) - CURL
/** Distance from the centre to the panels' rectangle along angle t. */
const rectR = (t: number) => Math.min(PX / Math.max(1e-6, Math.abs(Math.cos(t))), PY / Math.max(1e-6, Math.abs(Math.sin(t))))
/** The fixed roof's height where it meets the panels: 67 on the long sides, 63 at the ends. */
const edgeZ = (t: number) => {
  const p = at(t, rectR(t), 0)
  return Math.abs(p[1]) >= PY - 0.01 ? 63 : 67 - 4 * Math.pow(Math.abs(p[1]) / PY, 4)
}
const NR = 120
const roofAngle = (u: number) => u * 2 * Math.PI
surface(fabric, (u, v) => {
  const t = roofAngle(u)
  const r = RIM_R(t) + (rectR(t) - RIM_R(t)) * v
  const z = RIM + (edgeZ(t) - RIM) * (1 - Math.pow(1 - v, 1.25))
  return at(t, r, z)
}, NR, 4, up)
/** The fixed roof's height at angle t, fraction v from the rim to the panels. */
const roofPt = (t: number, v: number, lift = 0): V3 => {
  const r = RIM_R(t) + (rectR(t) - RIM_R(t)) * v
  return at(t, r, RIM + (edgeZ(t) - RIM) * (1 - Math.pow(1 - v, 1.25)) + lift)
}

// The retractable panels: a low vault, 73 m at the crown, 69 at the ends.
const panelZ = (x: number, y: number) => 73 - 4 * (y / PY) ** 2 - 2 * (x / PX) ** 2
surface(fabric, (u, v) => {
  const x = -PX + 2 * PX * u, y = -PY + 2 * PY * v
  return [x, y, panelZ(x, y)]
}, 6, 10, up)
// the panels' sides, down to the fixed roof
const sideRing: [number, number][] = [[PX, -PY], [PX, PY], [-PX, PY], [-PX, -PY]]
for (let s = 0; s < 4; s++) {
  const [x0, y0] = sideRing[s], [x1, y1] = sideRing[(s + 1) % 4]
  const n = 8
  for (let k = 0; k < n; k++) {
    const xa = x0 + ((x1 - x0) * k) / n, ya = y0 + ((y1 - y0) * k) / n
    const xb = x0 + ((x1 - x0) * (k + 1)) / n, yb = y0 + ((y1 - y0) * (k + 1)) / n
    const ea = edgeZ(Math.atan2(ya, xa)) - 0.3, eb = edgeZ(Math.atan2(yb, xb)) - 0.3
    rib.quad([xa, ya, ea], [xb, yb, eb], [xb, yb, panelZ(xb, yb)], [xa, ya, panelZ(xa, ya)])
  }
}
// the seam where the two panels meet, and their rails along the long edges
// running out over the fixed roof to the rim
{
  const w = 1.2
  for (let k = 0; k < 6; k++) {
    const xa = -PX + (2 * PX * k) / 6, xb = -PX + (2 * PX * (k + 1)) / 6
    rib.quad([xa, -w, panelZ(xa, 0) + 0.35], [xb, -w, panelZ(xb, 0) + 0.35], [xb, w, panelZ(xb, 0) + 0.35], [xa, w, panelZ(xa, 0) + 0.35])
  }
}
/** A raised strip on the fixed roof along angle t (a radial rib), w metres wide. */
function radialRib(t: number, w: number) {
  const n = 4
  const dt = w / 2 / R(t)
  for (let k = 0; k < n; k++) {
    const v0 = k / n, v1 = (k + 1) / n
    const a = roofPt(t - dt, v0, 0.35), b = roofPt(t + dt, v0, 0.35), c = roofPt(t + dt, v1, 0.35), d = roofPt(t - dt, v1, 0.35)
    rib.quad(a, b, c, d)
  }
}
for (const a of slotAngles) radialRib(deg(a), 3.2)
// rails: straight lines at x = ±(PX + 1.5), from the panels' ends to the rim
for (const sx of [-1, 1])
  for (const sy of [-1, 1]) {
    const x = sx * (PX + 1.5), w = 1.4
    const pts: number[] = []
    for (let k = 0; k <= 5; k++) pts.push(PY + ((AY - CURL - 6 - PY) * k) / 5)
    const hz = (xx: number, y: number) => {
      const t = Math.atan2(y, xx), r = Math.hypot(xx, y)
      const v = Math.max(0, Math.min(1, (RIM_R(t) - r) / (RIM_R(t) - rectR(t))))
      return RIM + (edgeZ(t) - RIM) * (1 - Math.pow(1 - v, 1.25)) + 0.6
    }
    for (let k = 0; k < 5; k++) {
      const y0 = sy * pts[k], y1 = sy * pts[k + 1]
      rib.quad([x - w, y0, hz(x - w, y0)], [x + w, y0, hz(x + w, y0)], [x + w, y1, hz(x + w, y1)], [x - w, y1, hz(x - w, y1)])
    }
  }

// ── The field tray's portal at the south end ────────────────────────────
// A white box under the end's centre stave, from the pad's floor to 19 m,
// its face flush with the staves' feet.
function box(part: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number) {
  const c: V3[] = [[x0, y0, 0], [x1, y0, 0], [x1, y1, 0], [x0, y1, 0]]
  const ring = (z: number) => c.map(([x, y]) => [x, y, z] as V3)
  part.loft([ring(z0), ring(z1)])
  part.cap(ring(z1), true)
}
const southFace = -(AY - 4.5)
box(rib, -40, 40, southFace, southFace + 26, 0, 19.2)
// its doors: a dark band across the face at the pad's level
slot.quad([-34, southFace - 0.06, 1], [34, southFace - 0.06, 1], [34, southFace - 0.06, 9], [-34, southFace - 0.06, 9])

// ── Write ───────────────────────────────────────────────────────────────
const parts: { part: Part; material: Swatch }[] = [
  { part: silver, material: finish('sfs-silver', 0xadb4bc, 0.45) },
  { part: fabric, material: finish('sfs-fabric', 0xd9dddf, 0.8) },
  { part: rib, material: finish('sfs-white', 0xf7f7f4, 0.8) },
  { part: slot, material: PALETTE.window },
  { part: base, material: finish('sfs-concourse', 0x6a7078, 0.6) },
]
const used = parts.filter((p) => p.part.triangles > 0)
const triangles = used.reduce((s, p) => s + p.part.triangles, 0)
if (used.length > 6) throw new Error(`${ID}: ${used.length} materials`)
if (triangles > 6500) throw new Error(`${ID}: ${triangles} triangles`)
const glb = writeGlb('State Farm Stadium', used, {
  license: 'CC0-1.0',
  frame: 'Y up, -Z north, +X east, metres; origin on the ground at the roof centre (-112.2625200, 33.5276732); bearing 328.5',
})
if (glb.length > 250_000) throw new Error(`${ID}: ${glb.length} bytes`)
const out = new URL(`../models/${ID}.glb`, import.meta.url).pathname
await Bun.write(out, glb)
console.log(used.map((p) => `${p.material.name}: ${p.part.triangles}`).join(', '))
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
