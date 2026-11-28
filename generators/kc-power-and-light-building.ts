/**
 * Kansas City Power & Light Building (1931, Hoit, Price & Barnes), 106 West
 * 14th Street, Kansas City, Missouri — original procedural geometry, CC0-1.0.
 * bun generators/kc-power-and-light-building.ts
 *
 * Also exports the small setback-tower kit (`Tower`) that this builder's
 * other kc- skyline towers use (kc-one-kansas-city-place, kc-town-pavilion);
 * the P&L model is only written when this file runs itself.
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = centroid of OSM way/65582850, -94.5847189 39.0975540.
 * Its walls run at 2.2° (the downtown grid), so the catalog bearing is 2.2
 * and the model is square to its own frame. Elevation 0.
 *
 * Identity, in order: the pale buff limestone setback tower; the blank west
 * slab rising sheer from the street to the crown's foot; the symmetric
 * stepped setbacks on the north, south and east, every step crowned with
 * stepped pier tops; the square shaft; the crown: a pinnacled base, the
 * lantern with its tall pointed-arch windows of prism glass (lit in changing
 * colours at night) between stepped corner buttresses, and its pointed cap.
 *
 * Evidence
 * - OSM way/65582850 (building=apartments, height 147, 34 levels,
 *   Q4352432): the 32 × 40 m footprint. No building:parts.
 * - USGS 3DEP lidar MO_FEMANRCS_1_2020 (2020 flight), 0.5 m, read in this
 *   frame (the cloud sits ~1 m east of OSM; shifted back). Heights above the
 *   street (265.5 m NAVD88; the site falls ~2 m west to east), measured:
 *     base 61 over the whole lot; tier 76 at x -14..13, y ±18; tier 84 at
 *     x -10..11, y ±15; the shaft 116 at x -10..11, y ±10; the west slab,
 *     flush with the west wall, x -16..-10: 120 over y -4..8, 100-108 over the
 *     rest of y ±10; the east wing, flush with the east wall, x 11..16: 100
 *     over y ±10, 107 over y ±6; the crown base 120-122 at ±6.5; the lantern
 *     138-142 at ±4; the finial 144.2. Published 145 m (476 ft), 36 floors
 *     (Wikipedia; CTBUH). The lidar's crown returns are sparse, so the
 *     crown's internal heights come from the photos below, scaled by these.
 * - Photos: "Kansas City Power and Light Building 1931.jpg" (User:Charvex,
 *   public domain; the east face, its symmetric steps), "PowerLight
 *   KCPL.jpg" (User:Charvex, public domain; the stone's daylight colour),
 *   Flickr 1083010129 "Kansas City Power and Light Building" (stevekc,
 *   CC BY 2.0; from the south, telephoto: the west slab, the crown's
 *   proportions: base block ~14 m wide and ~5 m tall, lantern ~8 m wide to
 *   ~135 m, cap to ~141 m), Flickr 52260388477 "Power and Light" and
 *   52288907445 "Power and Light Building" (string_bass_dave, CC BY-SA 2.0;
 *   the south face by day; the crown close-up: the pointed-arch prism
 *   window, buttressed corners, the stepped pier tops on every parapet),
 *   "PowerandLightBuilding.jpg" (Hello2020121212, CC BY-SA 4.0) and "Power
 *   and Light Building.jpg" (Noah Bohland, CC BY-SA 4.0): night from the
 *   south-west, the crown and the setback piers lit in colour, the west slab
 *   dark.
 * - Estimated: the bay pitch (~3.4 m, counted in the 1931 photo: about 12
 *   window columns on the 40 m east face), the three-storey window groups
 *   (3.5 m storeys: 33 floors to 116 m), the pier tops (2.4 m), the crown's
 *   buttress and window sizes (close-up, scaled by the 8 m lantern).
 * - Look-only, not used: ChrisM70 "Kansas City Power & Light top" (Flickr,
 *   CC BY-NC-ND).
 *
 * Colours: the limestone is a pale grey buff (#d4cab6 in sun, 1931 photo) pulled to the
 * palette's lightness; windows the palette's slate; terraces `roof`; the
 * lantern glass a pale prism grey-blue, `neon-prism`, which glows at night
 * (its real colours change; this is the daylight glass). Night: the
 * setbacks and the crown are floodlit (`_FLOODLIGHT`, rising with height),
 * the west slab and the street storeys are not.
 *
 * Left out: ornament, the lobby's marble, the fire stair on the north side.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { block, cap, chamfer, inset, onWall, rect, save, walls, type XY } from './chi-aon-center'

export type Mass = { r: XY[]; z0: number; z1: number }

const inside = (x: number, y: number, r: XY[]) => {
  let h = false
  for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
    const a = r[i], b = r[j]
    if ((a[1] > y) !== (b[1] > y) && x < (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1]) + a[0]) h = !h
  }
  return h
}

/**
 * A setback tower: masses drawn as bevelled blocks, with window panels and
 * pier tops only where a wall is really seen (not buried in another mass).
 */
export class Tower {
  masses: Mass[] = []
  constructor(public wall: Part, public roof: Part, public win: Part) {}

  /** A bevelled block from z0 to z1 with its roof. */
  mass(r: XY[], z0: number, z1: number, bevel = 0.45, top: Part | null = this.roof) {
    this.masses.push({ r, z0, z1 })
    return block(this.wall, top, r, z0, z1, bevel)
  }
  /** Is the point inside (or on top of) some mass other than `self`? */
  buried(x: number, y: number, z: number, self?: Mass) {
    return this.masses.some(m => m !== self && z > m.z0 - 0.01 && z < m.z1 + 0.01 && inside(x, y, m.r))
  }
  /**
   * Window panels on every edge of ring r: one panel per bay (`bay` pitch,
   * `fill` of it glazed) and per storey group, skipping what another mass
   * hides. `groups` are [z0, z1] bands.
   */
  windows(r: XY[], groups: [number, number][], o: { bay?: number; fill?: number; end?: number; out?: number; part?: Part; minLen?: number } = {}) {
    const bay = o.bay ?? 3.4, fill = o.fill ?? 0.5, end = o.end ?? 1.2, out = o.out ?? 0.05, p = o.part ?? this.win
    for (let i = 0; i < r.length; i++) {
      const a = r[i], b = r[(i + 1) % r.length], { L, P } = onWall(a, b)
      if (L < (o.minLen ?? 3)) continue
      const n = Math.max(1, Math.round((L - 2 * end) / bay)), pitch = (L - 2 * end) / n, w = pitch * fill
      for (let k = 0; k < n; k++) {
        const c = end + pitch * (k + 0.5)
        for (const [z0, z1] of groups) {
          const probe = [P(c - w / 2, z0 + 0.1, 0.3), P(c + w / 2, z0 + 0.1, 0.3), P(c, (z0 + z1) / 2, 0.3), P(c - w / 2, z1 - 0.1, 0.3), P(c + w / 2, z1 - 0.1, 0.3)]
          if (probe.some(q => this.buried(q[0], q[1], q[2]))) continue
          p.quad(P(c - w / 2, z0, out), P(c + w / 2, z0, out), P(c + w / 2, z1, out), P(c - w / 2, z1, out))
        }
      }
    }
  }
  /**
   * The pier tops along a parapet at z: a block on each pier between bays
   * (same pitch as `windows`), `h` tall.
   */
  pierTops(r: XY[], z: number, o: { bay?: number; end?: number; w?: number; h?: number; d?: number; part?: Part } = {}) {
    const bay = o.bay ?? 3.4, end = o.end ?? 1.2, w = o.w ?? 1.3, h = o.h ?? 2.4, d = o.d ?? 0.9, p = o.part ?? this.wall
    for (let i = 0; i < r.length; i++) {
      const a = r[i], b = r[(i + 1) % r.length], { L, P } = onWall(a, b)
      if (L < 3) continue
      const n = Math.max(1, Math.round((L - 2 * end) / bay)), pitch = (L - 2 * end) / n
      for (let k = 0; k <= n; k++) {
        const c = Math.min(L - w / 2 - 0.2, Math.max(w / 2 + 0.2, end + pitch * k))
        const q = P(c, z + 0.5, -0.5)
        if (this.buried(q[0], q[1], q[2])) continue
        // two steps: the full pier, then a narrower top
        const box = (s0: number, s1: number, d0: number, z0: number, z1: number) => {
          const c0 = P(s0, 0, 0.02), c1 = P(s1, 0, 0.02), c2 = P(s1, 0, -d0), c3 = P(s0, 0, -d0)
          const ring: XY[] = [[c0[0], c0[1]], [c1[0], c1[1]], [c2[0], c2[1]], [c3[0], c3[1]]]
          walls(p, ring, z0, z1); cap(p, ring, z1)
        }
        box(c - w / 2, c + w / 2, d, z - 0.3, z + h)
      }
    }
  }
}

/** Storey groups between z0 and z1, `per` storeys of `storey` m each, `gap` of spandrel. */
export function groups(z0: number, z1: number, storey: number, per: number, gap = 1.4): [number, number][] {
  const n = Math.max(1, Math.round((z1 - z0) / (storey * per))), h = (z1 - z0) / n
  return Array.from({ length: n }, (_, i) => [z0 + i * h + gap / 2, z0 + (i + 1) * h - gap / 2] as [number, number])
}

/** A pointed (two-centred) arch panel on wall a→b: s0..s1 wide, z0 up to the springing zs and apex za. */
export function pointedPanel(p: Part, a: XY, b: XY, s0: number, s1: number, z0: number, zs: number, za: number, out = 0.06, seg = 5) {
  const { P } = onWall(a, b), c = (s0 + s1) / 2, hw = (s1 - s0) / 2
  p.quad(P(s0, z0, out), P(s1, z0, out), P(s1, zs, out), P(s0, zs, out))
  const top: V3 = P(c, za, out)
  const curve = (side: number) => Array.from({ length: seg + 1 }, (_, k) => {
    const t = k / seg // 0 at the springing, 1 at the apex; a gently bowed side
    const s = c + side * hw * (1 - t) * (1 + 0.35 * t), z = zs + (za - zs) * Math.sin(t * Math.PI / 2)
    return P(Math.max(s0, Math.min(s1, s)), z, out)
  })
  const L = curve(-1), R = curve(1)
  for (let k = 0; k < seg; k++) { p.tri(L[k], R[k], R[k + 1]); p.tri(L[k], R[k + 1], L[k + 1]) }
  void top
}

// ---------------------------------------------------------------------------
// Kansas City Power & Light Building

function build() {
  const stone = new Part(), roof = new Part(), win = new Part(), prism = new Part(), metal = new Part()
  const T = new Tower(stone, roof, win)
  const STOREY = 3.5

  // Masses (lidar, see header)
  const base = rect(-16, -20, 16, 20)
  const t76 = rect(-14, -18, 13, 18)
  const t76w = rect(-16, -16, -14, 14)
  const t84 = rect(-10, -15, 11, 15)
  const shaft = rect(-10, -10, 11, 10)
  const slabLo = rect(-16, -10, -10, 10)
  const slabHi = rect(-16, -4, -10, 8)
  const eastLo = rect(11, -10, 16, 10)
  const eastHi = rect(11, -6, 16, 6)
  T.mass(base, 0, 61)
  T.mass(t76, 61, 76)
  T.mass(t76w, 61, 76)
  T.mass(t84, 76, 84)
  T.mass(shaft, 84, 116)
  T.mass(slabLo, 61, 107.5)
  T.mass(slabHi, 107.5, 120)
  T.mass(eastLo, 61, 100)
  T.mass(eastHi, 100, 107)

  // The crown: a pinnacled base block, the lantern, the cap, the finial.
  const cb = chamfer(rect(-6.5, -6.5, 6.5, 6.5), 1.2)
  T.mass(cb, 116, 121.5, 0.4)
  for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
    // corner pinnacles of the crown base, stepped
    const c: XY = [sx * 5.4, sy * 5.4]
    block(stone, stone, rect(c[0] - 1.1, c[1] - 1.1, c[0] + 1.1, c[1] + 1.1), 121.5, 124.5, 0.3)
    block(stone, stone, rect(c[0] - 0.6, c[1] - 0.6, c[0] + 0.6, c[1] + 0.6), 124.5, 126.3, 0.2)
  }
  const lan = chamfer(rect(-4.2, -4.2, 4.2, 4.2), 1.1)
  walls(stone, lan, 121.5, 135)
  // buttresses at the lantern's corners, stepping in twice
  for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
    const r0 = chamfer(rect(sx * 3.9 - 1.0, sy * 3.9 - 1.0, sx * 3.9 + 1.0, sy * 3.9 + 1.0), 0.3)
    block(stone, stone, r0, 121.5, 130.5, 0.3)
    const r1 = rect(sx * 3.7 - 0.7, sy * 3.7 - 0.7, sx * 3.7 + 0.7, sy * 3.7 + 0.7)
    block(stone, stone, r1, 130.5, 134.2, 0.25)
    const r2 = rect(sx * 3.6 - 0.4, sy * 3.6 - 0.4, sx * 3.6 + 0.4, sy * 3.6 + 0.4)
    block(stone, stone, r2, 134.2, 136.6, 0.15)
  }
  // the tall pointed-arch prism window on each face, between the buttresses
  for (let i = 0; i < lan.length; i++) {
    const a = lan[i], b = lan[(i + 1) % lan.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 4) continue
    pointedPanel(prism, a, b, L / 2 - 1.55, L / 2 + 1.55, 123, 130.8, 133.6, 0.06)
  }
  // the cap: a cornice slab, then a steep pyramid to the finial
  const cs = chamfer(rect(-4.6, -4.6, 4.6, 4.6), 1.2)
  block(stone, roof, cs, 135, 136.2, 0.3)
  const ci = chamfer(rect(-3.6, -3.6, 3.6, 3.6), 0.9)
  for (let i = 0; i < ci.length; i++) {
    const j = (i + 1) % ci.length
    stone.tri([ci[i][0], ci[i][1], 136.2], [ci[j][0], ci[j][1], 136.2], [0, 0, 141.4])
  }
  // the cap's four corner spikes over the buttresses
  for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
    const b = rect(sx * 3.6 - 0.4, sy * 3.6 - 0.4, sx * 3.6 + 0.4, sy * 3.6 + 0.4)
    for (let i = 0; i < 4; i++) {
      const j = (i + 1) % 4
      stone.tri([b[i][0], b[i][1], 136.6], [b[j][0], b[j][1], 136.6], [sx * 3.6, sy * 3.6, 139.6])
    }
  }
  {
    const f = rect(-0.25, -0.25, 0.25, 0.25)
    walls(metal, f, 140.5, 144.2, f.map(([x, y]) => [x * 0.3, y * 0.3] as XY))
  }

  // Windows: shopfront storeys, then three-storey groups to each roof.
  const fronts = rect(-16, -20, 16, 20)
  T.windows(fronts, [[2.6, 8.2]], { bay: 3.4, fill: 0.62 })
  const G = (z0: number, z1: number) => groups(z0, z1, STOREY, 2, 1.6)
  T.windows(base, G(9.5, 60), { bay: 3.4, fill: 0.58 })
  T.windows(t76, G(61, 75), { bay: 3.4, fill: 0.58 })
  T.windows(t76w, G(61, 75), { bay: 3.4, fill: 0.58 })
  T.windows(t84, G(76, 83.5), { bay: 3.4, fill: 0.58 })
  T.windows(shaft, G(84, 115), { bay: 3.4, fill: 0.58 })
  T.windows(eastLo, G(61, 99), { bay: 3.4, fill: 0.58 })
  T.windows(eastHi, G(100, 106.5), { bay: 3.4, fill: 0.58 })
  // the crown base: one band of windows
  T.windows(cb, [[117.2, 120.2]], { bay: 3.2, fill: 0.45, minLen: 6 })

  // The stepped pier tops on the setback parapets (not on the west slab).
  for (const [r, z] of [[base, 61], [t76, 76], [t84, 84], [shaft, 116], [eastLo, 100], [eastHi, 107]] as [XY[], number][]) {
    T.pierTops(inset(r, 0.45), z, { bay: 3.4, end: 0.75 })
  }

  // Night: the setbacks and the crown are floodlit from the terraces in
  // colour; the west slab and the street storeys stay dark.
  const lit = (p: V3, n: V3) => {
    if (p[2] < 58) return 0
    if (p[0] < -9.8 && n[0] < -0.5) return 0
    const k = Math.min(1, 0.55 + 0.45 * (p[2] - 58) / 86)
    return n[2] > 0.7 ? k * 0.3 : k
  }
  return [
    { part: stone, material: { ...finish('kcpl-limestone', 0xddd1ba), floodlight: lit } },
    { part: roof, material: PALETTE.roof },
    { part: win, material: PALETTE.window },
    { part: prism, material: finish('neon-prism', 0xbfd3dc, 0.4) },
    { part: metal, material: finish('metal-finial', 0xb9b7ae, 0.6) },
  ]
}

if (import.meta.main) await save('kc-power-and-light-building', 'Kansas City Power & Light Building', [39.097554, -94.5847189], 2.2, build(), 6500)
