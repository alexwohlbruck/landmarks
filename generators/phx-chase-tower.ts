/**
 * Chase Tower (Valley National Bank Center), Phoenix (1972, Welton Becket
 * & Associates) — original procedural geometry, CC0-1.0.
 * bun generators/phx-chase-tower.ts
 *
 * This file also holds a small kit the other Phoenix downtown towers import
 * (phx-hyatt-regency, phx-westward-ho, phx-hotel-san-carlos,
 * phx-luhrs-tower): blocks that know their neighbours, so each face gets its
 * windows only where it is really exposed. The tower's own build runs only
 * when this file is run directly.
 *
 * Map frame: x east, y north, z up, metres; origin on the ground at the
 * anchor. Bearing 0: OSM's walls run within 0.3 degrees of north–south.
 * Anchor -112.0731048, 33.4508795, the centroid of OSM way/37057933
 * ("Chase Tower", building=commercial, 34 levels, start_date 1972).
 *
 * Identity (from the photos below):
 *  1. A pinwheel of four blocks of different heights round the tallest one,
 *     so the top steps down three times: the setback crown.
 *  2. Blue-black reflective glass on a fine pale grid of mullions and floor
 *     lines on the three glass wings.
 *  3. The tallest block is the service core, its east face and its
 *     diagonally cut south-west end clad in plain beige concrete (the
 *     "CHASE" face seen from the south-east); its west face is glass.
 *  4. Antennas and a small plant room on the core's roof.
 *
 * Plan: OSM way/37057933 and its parts, squared. The lidar's shaded image
 * shows the same four blocks: the core x -14.2..-1.9, y -29.9..5.7 with its
 * south-west end cut from (-14.2, -20.3) to (-1.9, -29.9) (OSM part
 * way/537036318); the north wing x -14.2..8.3, y 5.7..27.1; the east wing
 * x -1.9..19.4, y -16.3..5.7; the west wing x -35.4..-14.2, y -5.5..16.5.
 * OSM's parts way/537036314 (36 levels) and way/537036316 (38 levels)
 * overlap and don't match those blocks; the lidar settles which is which.
 * The lidar edges sit up to 1.5 m north and east of OSM's; OSM is kept.
 *
 * Heights: USGS 3DEP lidar AZ_MaricopaPinal_1_2020 (2020 flight), 1 m grid,
 * read with tools/lidar_frame.py; ground_min 330.78 m, the plaza round the
 * tower 0.2–2.4 m above it; y = 0 here is ground_min + 0.3. Measured
 * (model metres): the core 147.8 (published 147 m / 483 ft, Wikipedia,
 * CTBUH), with a plant room to 152; the north wing 141.8; the east wing
 * 133.4 with a plant room to 137 at its west end; the west wing 125.2.
 * Estimated: the storey height (40 floors in 147 m, 3.6 m), the grid (one
 * pale line every three floors and every 4.5 m, about a third of the real
 * density); the plant rooms' plans from the lidar at 2 m.
 *
 * Photos (evidence, Wikimedia Commons):
 *  cazzy   "Chase Tower Phoenix 2022.jpg", Cazzy82, CC BY-SA 4.0, from the
 *          south-east on Monroe St: the beige core face, two glass wings
 *          https://commons.wikimedia.org/wiki/File:Chase_Tower_Phoenix_2022.jpg
 *  khamis  "Chase Tower (Phoenix).jpg", Khamis Hammoudeh, CC BY 2.0, from
 *          the north-east at dusk: the core's glass north face above the
 *          wings https://commons.wikimedia.org/wiki/File:Chase_Tower_(Phoenix).jpg
 *  english "Chase Tower - panoramio (2).jpg", Chris English, CC BY-SA 3.0,
 *          from the north-west on Central Ave: the glass wings to the ground
 *          https://commons.wikimedia.org/wiki/File:Chase_Tower_-_panoramio_(2).jpg
 *  ruiz    "Chase Tower, Downtown PHX 1.jpg", Mike Ruiz, CC BY 2.0, looking
 *          up at night: bronze-dark mullions, lit floors
 *          https://commons.wikimedia.org/wiki/File:Chase_Tower,_Downtown_PHX_1.jpg
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the core's diagonal south-west end is seen in no photo; it is
 * drawn beige like the east face. The "CHASE" letters on the core are
 * a corporate sign and left out. The glass grid is drawn sparser than the
 * real one, as STYLE.md asks.
 *
 * Night: the glass faces are office floors, lit (`window-2`); the beige
 * concrete stays dark; the ground-floor lobbies are `entrance`.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { box, ccw, onWall, prism, rectShape, save, type XY } from './atl-tech-tower'

// ─────────────────────────────────── kit ───────────────────────────────────

export type Block = { ring: XY[]; z0: number; z1: number }

const inside = (p: XY, ring: XY[]) => {
  let c = false
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i], [xj, yj] = ring[j]
    if (yi > p[1] !== yj > p[1] && p[0] < ((xj - xi) * (p[1] - yi)) / (yj - yi) + xi) c = !c
  }
  return c
}

/**
 * The exposed pieces of every face of `b`, among `all`: each piece is
 * [a, b, zFrom] where zFrom is the top of whatever stands against that
 * stretch of wall (b.z0 when nothing does). Faces wholly hidden are left out.
 */
export function exposed(b: Block, all: Block[]): Array<[XY, XY, number]> {
  const out: Array<[XY, XY, number]> = []
  const n = b.ring.length
  let lastEdge = -1
  for (let i = 0; i < n; i++) {
    const a = b.ring[i], c = b.ring[(i + 1) % n]
    const L = Math.hypot(c[0] - a[0], c[1] - a[1])
    if (L < 0.05) continue
    const t: XY = [(c[0] - a[0]) / L, (c[1] - a[1]) / L], nn: XY = [t[1], -t[0]]
    const cuts = new Set<number>([0, L])
    for (const o of all) for (const q of o.ring) {
      const s = (q[0] - a[0]) * t[0] + (q[1] - a[1]) * t[1], d = (q[0] - a[0]) * nn[0] + (q[1] - a[1]) * nn[1]
      if (Math.abs(d) < 0.3 && s > 0.05 && s < L - 0.05) cuts.add(s)
    }
    const ss = [...cuts].sort((x, y) => x - y)
    for (let k = 0; k < ss.length - 1; k++) {
      const s0 = ss[k], s1 = ss[k + 1], sm = (s0 + s1) / 2
      const p: XY = [a[0] + t[0] * sm + nn[0] * 0.4, a[1] + t[1] * sm + nn[1] * 0.4]
      let zf = b.z0
      for (const o of all) if (o !== b && inside(p, o.ring) && o.z0 <= b.z0 + 0.5) zf = Math.max(zf, o.z1)
      if (zf >= b.z1 - 0.3) continue
      const P0: XY = [a[0] + t[0] * s0, a[1] + t[1] * s0], P1: XY = [a[0] + t[0] * s1, a[1] + t[1] * s1]
      const last = out[out.length - 1]
      if (k > 0 && last && lastEdge === i && Math.abs(last[2] - zf) < 0.01 && last[1][0] === P0[0] && last[1][1] === P0[1]) last[1] = P1
      else { out.push([P0, P1, zf]); lastEdge = i }
    }
  }
  return out
}

/**
 * A curtain wall on one stretch of face: panels in bands `group` tall with
 * a `gap` floor line between, bays about `bay` wide with a `mull` mullion,
 * from z0 to z1. Bands are counted from `zBase` so neighbouring stretches
 * line up whatever height they start at.
 */
export function curtain(p: Part, a: XY, b: XY, z0: number, z1: number, o: { group: number; gap: number; bay: number; mull: number; zBase?: number; margin?: number; out?: number }) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), m = o.margin ?? 0.3
  const use = L - 2 * m
  if (use < 0.8) return
  const bays = Math.max(1, Math.round(use / o.bay)), w = use / bays
  const zb = o.zBase ?? 0
  for (let k = 0; k < bays; k++) {
    const s0 = m + k * w + o.mull / 2, s1 = m + (k + 1) * w - o.mull / 2
    for (let g = Math.floor((z0 - zb) / o.group); zb + g * o.group < z1; g++) {
      const za = Math.max(z0 + o.gap / 2, zb + g * o.group + o.gap / 2), zz = Math.min(z1 - o.gap / 2, zb + (g + 1) * o.group - o.gap / 2)
      if (zz - za < 0.6) continue
      onWall(p, a, b, rectShape(s0, s1, za, zz), o.out ?? 0.05)
    }
  }
}

export { inside }

// ─────────────────────────────── Chase Tower ───────────────────────────────

if (import.meta.main) {
  const frame = new Part(), win = new Part(), core = new Part(), roof = new Part(), lobby = new Part()

  const CORE: Block = { ring: ccw([[-14.2, -20.3], [-1.9, -29.9], [-1.9, 5.7], [-14.2, 5.7]]), z0: 0, z1: 147.8 }
  const NORTH: Block = { ring: ccw([[-14.2, 5.7], [8.3, 5.7], [8.3, 27.1], [-14.2, 27.1]]), z0: 0, z1: 141.8 }
  const EAST: Block = { ring: ccw([[-1.9, -16.3], [19.4, -16.3], [19.4, 5.7], [-1.9, 5.7]]), z0: 0, z1: 133.4 }
  const WEST: Block = { ring: ccw([[-35.4, -5.5], [-14.2, -5.5], [-14.2, 16.5], [-35.4, 16.5]]), z0: 0, z1: 125.2 }
  const ALL = [CORE, NORTH, EAST, WEST]

  // Massing: each block a prism with a soft top edge and a low parapet lip.
  prism(core, CORE.ring, 0, CORE.z1, roof, 0.5)
  for (const b of [NORTH, EAST, WEST]) prism(frame, b.ring, 0, b.z1, roof, 0.5)

  // The glass wings: a pale grid (the frame) under blue-black glass panels,
  // one band per three floors, bays 4.5 m; the ground storey a dark lobby.
  const FLOOR = 3.62, LOBBY = 6
  for (const b of [NORTH, EAST, WEST]) {
    for (const [a, c, zf] of exposed(b, ALL)) {
      const z0 = Math.max(zf, LOBBY)
      curtain(win, a, c, z0, b.z1 - 1.2, { group: FLOOR * 3, gap: 0.45, bay: 4.5, mull: 0.35, zBase: LOBBY })
      if (zf < LOBBY) curtain(lobby, a, c, 0, LOBBY - 0.5, { group: LOBBY, gap: 0, bay: 4.5, mull: 0.35, margin: 0.6 })
    }
  }
  // The core: beige concrete on its east face and its cut south-west end
  // (cazzy); its west face and the top of its north face are glass like the
  // wings (english, khamis).
  for (const [a, c, zf] of exposed(CORE, ALL)) {
    const north = Math.abs(a[1] - 5.7) < 0.01 && Math.abs(c[1] - 5.7) < 0.01
    const west = Math.abs(a[0] + 14.2) < 0.01 && Math.abs(c[0] + 14.2) < 0.01
    if (north || west) {
      onWall(frame, a, c, rectShape(0, Math.hypot(c[0] - a[0], c[1] - a[1]), zf, CORE.z1 - 0.5), 0.02)
      curtain(win, a, c, Math.max(zf, LOBBY), CORE.z1 - 1.2, { group: FLOOR * 3, gap: 0.45, bay: 4.5, mull: 0.35, zBase: LOBBY })
      if (zf < LOBBY) curtain(lobby, a, c, 0, LOBBY - 0.5, { group: LOBBY, gap: 0, bay: 4.5, mull: 0.35, margin: 0.6 })
    } else if (zf < LOBBY) {
      // a recessed dark band at the ground along the core's open faces
      curtain(lobby, a, c, 0, 4.5, { group: 4.5, gap: 0, bay: 4, mull: 0.5, margin: 1 })
    }
  }

  // Plant rooms: on the core (lidar to 152) and at the east wing's west end
  // (to 137); antennas on the core.
  box(roof, -10.5, -3.5, -14, -4, CORE.z1, 151.6, roof, 0.3)
  box(roof, -1.6, 7.5, -6.5, 5.4, EAST.z1, 137.1, roof, 0.3)
  for (const [x, y, h] of [[-12, 2, 6], [-4, -20, 5], [-9, -24, 4]] as const) box(roof, x - 0.25, x + 0.25, y - 0.25, y + 0.25, CORE.z1, CORE.z1 + h, roof, 0)


  const stone = finish('chase-concrete', 0xe0cfb2)
  await save('phx-chase-tower', 'Chase Tower', [
    { part: frame, material: finish('chase-mullion', 0xc9c4bb) },
    { part: win, material: windowVariant(2, 0x52739a) },
    { part: core, material: stone },
    { part: roof, material: PALETTE.roof },
    { part: lobby, material: { ...PALETTE.entrance, color: 0x6b6a66 } },
  ], { height: 152, anchor: [33.4508795, -112.0731048], bearing: 0 })
}
