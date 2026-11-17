/**
 * Friedensdenkmal (Friedensengel), Maximiliansanlagen, Munich: the peace
 * monument for the 25 years after the Franco-Prussian war, 1896-99, by
 * Heinrich Düll, Georg Pezold and Max Heilmaier: an open Greek temple
 * (the Korenhalle, with caryatids and gold mosaics) carrying a fluted
 * Corinthian column and a gilded bronze Nike, standing at the top of the
 * Prinzregententerrasse on the Isar's east bank, whose retaining wall with
 * its grotto fountain and double flights of stairs climbs the slope.
 * Original procedural geometry, CC0-1.0.
 * bun generators/munich-friedensengel.ts
 *
 * Writes two levels of detail in the same frame:
 * - models/munich-friedensengel.glb, the low model;
 * - models/munich-friedensengel.detail.glb (from zoom 17): the Nike sculpted
 *   at about three times the resolution (fingers' worth of hand, the palm
 *   branch's leaves, the statuette on its globe, layered wing feathers),
 *   the column's flutes, the caryatids, and the balustrades' balusters.
 *
 * Map frame of this model: x across the slope (+x east-south-east, up the
 * Prinzregentenstraße; -x west-north-west, down to the Isar), y along it
 * (+y north-north-east), z up, metres; origin at the anchor on the ground.
 * Catalog bearing 18.4: the temple's square outline (way/48441018) and the
 * flights of stairs in OSM run at 18.4 degrees. Anchor = area centroid of
 * way/48441018, 48.141344, 11.596993. Symmetric about y = 0.
 *
 * The slope: Mapterhorn (tools/terrain.ts grid) puts the upper terrace
 * round the temple at +10.0 m and the plaza below the terrace wall at +2.0
 * m, the drop at x = -16..-20. As STYLE.md asks, y = 0 is the lowest
 * ground under the footprint, the plaza: the terrace wall, grotto and
 * stairs rise from it 8.0 m to the terrace's edge, and the temple stands
 * 8.0 m up on the terrace, its podium running down to y = 0 inside the
 * hill. elevation 0. (The map's per-vertex drape may lift the temple
 * above the terrace; see the report.)
 *
 * Identity, in order: the slender fluted column with its dark bronze
 * capital and drum carrying the gold Nike, wings raised, palm branch held
 * out; the open square temple under it with caryatids and gold mosaics; the
 * pale terrace wall below it with the grotto fountain in the middle, arched
 * niches either side and the two double flights of balustraded stairs
 * crossing in an X on each side.
 *
 * Evidence:
 *  - published (de.wikipedia, Friedensdenkmal (München)): total 38 m; the
 *    temple 8 x 8 m and 9 m high; the column 23 m; the figure 6 m with a 5 m
 *    wingspan.
 *  - plan: OSM way/48441018 and its parts, turned: the podium 256336566 (9.4
 *    m square, 0-2 m), the twelve hall supports 2564182388..402 (2-5 m), the
 *    core 256182395 (3.5 m square, 2-6 m), the roof 256182397 (5-6 m,
 *    hipped), the column 256182387 (from 6 m). The stairs into the podium
 *    256183052/053 on the north and south. The terrace stairs 1191733676,
 *    1191733680, 1434987627 and 1434987628 (23-25 steps each, two flights a
 *    side): the lower flights at x = -20.3 rising outward from |y| 8 to a
 *    landing at |y| 19, the upper flights at x = -15.6 rising back to the
 *    top at |y| 7.3.
 *  - heights: the drone photo (AuHaidhausen, frontal, long lens) divides
 *    the column's 23 m: base 0.6, shaft 16.4 (2.25 m across at the foot,
 *    1.85 at the top), capital 2.5 (3.2 m across the abacus), bronze drum
 *    3.4; the Nike's soles to her head ~4.0 m, the wings to 6.0. The hall
 *    from GFreihalter's photo: podium 2.0, supports to 5.0, entablature to
 *    5.7, the low copper roof, the sculpted pedestal to 9.0. The terrace
 *    wall from S nova's frontal photo: 8 m to the balustrade's foot (the
 *    terrain's 8.0 m drop agrees), the grotto 4.2 m wide and 6 m high.
 *  - colours: pale limestone, the green-black bronze of capital and drum,
 *    the gold of the Nike and the mosaics, a green copper roof on the hall.
 *  - night: the Nike and column are floodlit (photos on Commons at dusk);
 *    the terrace wall lit softly.
 *
 * Photos (Wikimedia Commons, all evidence):
 *  - Luitpold_terrasse_with_drone.jpg (AuHaidhausen, CC BY 4.0): frontal
 *    from the west, column, capital, drum and Nike; the measuring photo.
 *  - Friedensengel,_München.jpg (S nova, CC BY-SA 3.0): the terrace wall,
 *    grotto and stairs from the west.
 *  - München-Bogenhausen_Friedensengel_186.jpg, _183, _187 (GFreihalter, CC
 *    BY-SA 3.0): the temple, caryatids, pillars, podium stairs.
 *  - Muefriedensengel04072013d95b1.jpg (Fentriss, CC0): the Nike close up.
 *  - Friedensengel_Muenchen-14.jpg, -16 (Rufus46, CC BY-SA 3.0).
 *  - München_-_Friedensengel_mit_Fontäne_(tone-mapping).jpg (Guido Radig,
 *    CC BY 3.0).
 * No commercial imagery, no 3D city models. No look-only sources.
 *
 * Left out: the mosaics' figures (flat gold panels), the reliefs and the
 * four warrior figures round the pedestal (drawn as blocks with corner
 * masses), the lamps, the fountain's water and basin (STYLE.md: no water).
 *
 * Doubts: the terrace wall's depth and the stair widths are estimated from
 * OSM's step lines; the far ends of the terrace (beyond |y| 24) are left to
 * the map. The drape bends the wall's top a little where the ground jumps.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import {
  TAU, add, archBand, boxAt, cap, ellipsoid, floodWalls, lathe, latheHard, limb, mul, panelOn, piercedFace, place, quadN,
  rect, save, similarity, surface, tunnel, walls, type Layer, type Opening,
} from './munich-karlstor'
import { drapedBody, head } from './munich-siegestor'

/** The Nike, facing +y, striding: ~4.0 m to the top of her head, wings to ~6 m. */
function nike(p: Part, R: number) {
  const h = 4.0
  drapedBody(p, h, R, [
    { a: 1.2, z0: 0.62, a1: 1.6, z1: 0.3, amp: 0.1, w: 0.3 },
    { a: 2.0, z0: 0.6, a1: 2.4, z1: 0.1, amp: 0.08, w: 0.35 },
    { a: 0.6, z0: 0.6, a1: 0.2, z1: 0.05, amp: 0.12, w: 0.4 },
  ])
  head(p, [0, 0.04, h * 0.915], h * 0.15, R, false)
  // The overfold flaring over the hips, the girdle, the breasts.
  ellipsoid(p, [0, 0.0, 2.25], [0.56, 0.42, 0.3], 10 * R, 5 * R)
  ellipsoid(p, [0, 0.02, 2.62], [0.44, 0.32, 0.12], 10 * R, 4 * R)
  for (const sx of [-1, 1]) ellipsoid(p, [sx * 0.2, 0.22, 3.0], [0.17, 0.15, 0.16], 8 * R, 5 * R)
  // The drapery billowing behind her to her left.
  limb(p, [[0.3, -0.15, 2.2], [0.62, -0.45, 1.65], [0.82, -0.5, 1.0], [0.78, -0.3, 0.35]], [[0.3, 0.16], [0.42, 0.2], [0.45, 0.2], [0.3, 0.12]], 8 * R, [0, 1, 0])
  // The stepping leg showing through the dress at the front.
  limb(p, [[-0.15, 0.1, 1.9], [-0.18, 0.32, 1.0], [-0.16, 0.38, 0.12]], [0.2, 0.15, 0.12], 6 * R, [0, 0, 1], 'end')
  // Right arm raised out to the side with the palm branch.
  limb(p, [[-0.45, 0.0, 3.3], [-1.0, 0.12, 3.68], [-1.5, 0.22, 4.02]], [0.19, 0.15, 0.11], 6 * R)
  ellipsoid(p, [-1.58, 0.24, 4.02], [0.1, 0.08, 0.12], 6 * R, 4 * R)
  limb(p, [[-1.6, 0.25, 3.75], [-1.62, 0.28, 4.4], [-1.68, 0.3, 5.05]], [0.035, 0.03, 0.02], 4, [1, 0, 0], false)
  const leaves = R > 1 ? 7 : 3
  for (let i = 0; i < leaves; i++) {
    const z = 4.15 + (i * 0.85) / leaves, s = i % 2 ? 1 : -1
    ellipsoid(p, [-1.64 + s * 0.12, 0.28, z + 0.05], [0.13, 0.035, 0.05], 5, 3, 0, s * 0.6)
  }
  // Left arm down, holding the globe with the statuette of Pallas.
  limb(p, [[0.45, 0.0, 3.3], [0.68, 0.08, 2.75], [0.6, 0.32, 2.45]], [0.19, 0.15, 0.11], 6 * R)
  ellipsoid(p, [0.6, 0.42, 2.38], [0.19, 0.19, 0.19], 8 * R, 5 * R)
  limb(p, [[0.6, 0.42, 2.55], [0.6, 0.42, 3.05]], [0.07, 0.05], 5, [1, 0, 0])
  if (R > 1) ellipsoid(p, [0.6, 0.42, 3.12], [0.05, 0.05, 0.06], 5, 3)
  // Wings raised and spread, the left (+x) wider.
  for (const s of [-1, 1]) {
    const spread = s > 0 ? 1.0 : 0.55
    const path: V3[] = [[s * 0.18, -0.22, 3.25], [s * (0.35 + 0.3 * spread), -0.45, 3.9], [s * (0.5 + 0.75 * spread), -0.6, 4.75], [s * (0.6 + 1.3 * spread), -0.72, 5.55], [s * (0.65 + 1.6 * spread), -0.78, 6.0]]
    limb(p, path, [[0.22, 0.09], [0.45, 0.11], [0.5, 0.1], [0.36, 0.07], [0.08, 0.03]], 8 * R, [0, 1, 0], 'end')
    if (R > 1) for (let f = 0; f < 6; f++) {
      // Primary feathers fanning off the wing's trailing edge.
      const t = 1 + (f / 5) * 2.6, i = Math.floor(t), u = t - i
      const a = path[i], b = path[Math.min(4, i + 1)]
      const q: V3 = [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u]
      const out: V3 = [s * 0.35, -0.05, -0.55]
      limb(p, [q, add(q, mul(out, 0.6)), add(q, out)], [[0.12, 0.03], [0.1, 0.025], [0.03, 0.01]], 5, [0, 1, 0], 'end')
    }
  }
}

/** A caryatid on a pedestal, ~2.3 m, facing +y. */
function caryatid(p: Part, R: number) {
  drapedBody(p, 2.2, R, [{ a: 1.5, z0: 0.6, a1: 1.6, z1: 0.05, amp: 0.06, w: 0.25 }])
  head(p, [0, 0.0, 2.2 * 0.92], 2.2 * 0.13, R, false)
  lathe(p, 0, 0, [[0.18, 2.2], [0.3, 2.32], [0.32, 2.45], [0, 2.46]], 6 * R) // basket on the head
}

/** A balustrade from a to b (x, y) standing on z0 (which may differ at the ends): base, rail and, in the detail model, balusters. */
function balustrade(stone: Part, a: [number, number, number], b: [number, number, number], R: number, H = 1.0) {
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L
  const nx = -uy * 0.16, ny = ux * 0.16
  const seg = Math.max(1, Math.ceil(L / 4))
  const at = (t: number, dz: number, side: number): V3 => [a[0] + dx * t + nx * side, a[1] + dy * t + ny * side, a[2] + (b[2] - a[2]) * t + dz]
  for (let k = 0; k < seg; k++) {
    const t0 = k / seg, t1 = (k + 1) / seg
    // Plinth and rail as thin boxes along the run (sides and tops).
    for (const [z0, z1, w] of (R > 1 ? [[0, 0.2, 1.2], [H - 0.15, H, 1.4]] : [[0, H, 1.0], [H - 0.15, H, 1.35]]) as [number, number, number][]) {
      for (const side of [-1, 1]) quadN(stone, at(t0, z0, side * w), at(t1, z0, side * w), at(t1, z1, side * w), at(t0, z1, side * w), [nx * side, ny * side, 0])
      quadN(stone, at(t0, z1, -w), at(t1, z1, -w), at(t1, z1, w), at(t0, z1, w), [0, 0, 1])
    }
  }
  for (const [t, s] of [[0, -1], [1, 1]] as [number, number][]) quadN(stone, at(t, 0, -1.4), at(t, 0, 1.4), at(t, H, 1.4), at(t, H, -1.4), [ux * s, uy * s, 0])
  if (R > 1) {
    const n = Math.floor(L / 0.42)
    for (let i = 0; i < n; i++) {
      const q = at((i + 0.5) / n, 0, 0)
      lathe(stone, q[0], q[1], [[0.08, q[2] + 0.2], [0.13, q[2] + 0.38], [0.07, q[2] + 0.6], [0.09, q[2] + H - 0.15]], 5)
    }
  }
}

function build(R: number) {
  const stone = new Part(), trim = new Part(), bronze = new Part(), gold = new Part(), copper = new Part()
  const SEG = R > 1 ? 16 : 10

  // The temple stands on the upper terrace, 8.0 m above the plaza (the
  // map's terrain: +10.0 against +2.0); it is built in its own parts and
  // lifted, its podium running down to the plaza level inside the hill.
  const TZ = 8.0
  const st0 = stone, tr0 = trim, br0 = bronze, go0 = gold, co0 = copper
  {
    const stone = new Part(), trim = new Part(), bronze = new Part(), gold = new Part(), copper = new Part()
  // ======================================================== the temple ===
    // Podium 9.4 m square, 0-2 m, with stairs cut in on the north and south.
    boxAt(stone, 0, 0, 4.7, 4.7, 0, 1.8, 0, 0, 0)
    boxAt(trim, 0, 0, 4.8, 4.8, 1.8, 2.05, 0, 0, 0.08)
    for (const s of [-1, 1]) {
      const steps = R > 1 ? 10 : 5
      for (let i = 0; i < steps; i++) {
        const z1 = (2.0 * (i + 1)) / steps, y0 = s * (4.7 + 5.0 * (1 - (i + 1) / steps)), y1 = s * (4.7 + 5.0 * (1 - i / steps))
        boxAt(stone, 0, (y0 + y1) / 2 + s * 0.0, 1.4, Math.abs(y1 - y0) / 2 + (i === 0 ? 0 : 0), 0, z1, 0, 0, 0, stone)
        void y0
      }
      // Cheek walls.
      for (const e of [-1, 1]) boxAt(stone, e * 1.65, s * 7.2, 0.25, 2.5, 0, 1.0, 0, 0, 0.06)
    }
    // Hall: corner pillars and caryatids round a core with gold mosaics.
    const car = new Part(); caryatid(car, R > 1 ? R * 0.6 : 0.5)
    for (const [x, y] of [[-3.9, -3.9], [3.9, -3.9], [3.9, 3.9], [-3.9, 3.9]] as [number, number][]) {
      boxAt(stone, x, y, 0.6, 0.6, 2.05, 5.0, 0, 0.08)
      boxAt(trim, x, y, 0.7, 0.7, 2.05, 2.5)
      boxAt(trim, x, y, 0.7, 0.7, 4.7, 5.0)
    }
    for (const s of [-1, 1]) for (const t of [-1.3, 1.3]) {
      for (const [x, y, yaw] of [[t, s * 3.9, s > 0 ? 0 : Math.PI], [s * 3.9, t, s > 0 ? -Math.PI / 2 : Math.PI / 2]] as [number, number, number][]) {
        boxAt(trim, x, y, 0.4, 0.4, 2.05, 2.6)
        const [M, Rn] = similarity(1, yaw, [x, y, 2.6]); place(stone, car, M, Rn)
        boxAt(trim, x, y, 0.38, 0.38, 4.75, 5.0)
      }
    }
    boxAt(stone, 0, 0, 1.75, 1.75, 2.05, 5.0)
    for (const [u, n] of [[[1, 0, 0], [0, -1, 0]], [[0, 1, 0], [1, 0, 0]], [[-1, 0, 0], [0, 1, 0]], [[0, -1, 0], [-1, 0, 0]]] as [V3, V3][]) {
      const o: V3 = add(mul(n, 1.75), mul(u, -1.75))
      panelOn(gold, o, u, n, 0.35, 3.15, 2.5, 4.6, 0.04)
    }
    // Entablature and the low copper roof.
    boxAt(stone, 0, 0, 4.55, 4.55, 5.0, 5.55, 0, 0, 0)
    boxAt(trim, 0, 0, 4.75, 4.75, 5.55, 5.8, 0, 0, 0.1)
    {
      const r = 4.75
      for (const [a, b] of [[[-r, -r], [r, -r]], [[r, -r], [r, r]], [[r, r], [-r, r]], [[-r, r], [-r, -r]]] as [number, number][][]) {
        const A: V3 = [a[0], a[1], 5.8], B: V3 = [b[0], b[1], 5.8], C: V3 = [b[0] * 0.48, b[1] * 0.48, 6.35], D: V3 = [a[0] * 0.48, a[1] * 0.48, 6.35]
        const n: V3 = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, 9]
        quadN(copper, A, B, C, D, n)
      }
    }
    // The sculpted pedestal of the column: a square block with corner masses (the warriors).
    boxAt(stone, 0, 0, 2.3, 2.3, 6.0, 8.4, 0, 0.3, 0)
    boxAt(trim, 0, 0, 2.5, 2.5, 6.0, 6.5, 0, 0, 0.1)
    boxAt(trim, 0, 0, 2.45, 2.45, 8.4, 9.0, 0, 0.2, 0.15)
    for (const [x, y] of [[-2.3, -2.3], [2.3, -2.3], [2.3, 2.3], [-2.3, 2.3]] as [number, number][]) {
      ellipsoid(stone, [x * 1.02, y * 1.02, 7.0], [0.45, 0.45, 0.6], 6 + 2 * R, 4 + R)
      ellipsoid(stone, [x * 1.02, y * 1.02, 7.85], [0.25, 0.25, 0.3], 6 + 2 * R, 4 + R)
    }
    for (const [u, n] of [[[1, 0, 0], [0, -1, 0]], [[0, 1, 0], [1, 0, 0]], [[-1, 0, 0], [0, 1, 0]], [[0, -1, 0], [-1, 0, 0]]] as [V3, V3][]) {
      const o: V3 = add(mul(n, 2.3), mul(u, -2.3))
      panelOn(trim, o, u, n, 1.0, 3.6, 6.7, 8.2, 0.1)
    }

    // ======================================================== the column ===
    const C0 = 9.0
    latheHard(trim, 0, 0, [[1.55, C0], [1.55, C0 + 0.25], [1.3, C0 + 0.35], [1.35, C0 + 0.5], [1.15, C0 + 0.6]], SEG)
    {
      // Shaft, fluted in the detail model (24 flutes), with entasis.
      const NU = R > 1 ? 96 : 12, rows = R > 1 ? 10 : 4
      const grid: V3[][] = []
      for (let k = 0; k <= rows; k++) {
        const t = k / rows, z = C0 + 0.6 + 16.4 * t
        const r = 1.03 - 0.17 * t ** 1.4
        grid.push(Array.from({ length: NU }, (_, i) => {
          const a = (i / NU) * TAU
          const f = R > 1 ? 1 - 0.035 * Math.max(0, Math.cos(24 * a)) ** 2 : 1
          return [r * f * Math.cos(a), r * f * Math.sin(a), z] as V3
        }))
      }
      surface(stone, grid, true, (q) => [0, 0, q[2]])
    }
    const CT = C0 + 17.0
    // Capital: bronze, a leafy bell under a concave abacus; then the drum.
    lathe(bronze, 0, 0, [[0.9, CT], [0.95, CT + 0.3], [1.05, CT + 0.9], [1.3, CT + 1.6], [1.55, CT + 2.05]], SEG)
    if (R > 1) for (let i = 0; i < 16; i++) {
      const a = (i / 16) * TAU, rr = i % 2 ? 1.1 : 1.25
      limb(bronze, [[rr * 0.85 * Math.cos(a), rr * 0.85 * Math.sin(a), CT + 0.2 + (i % 2) * 0.5], [rr * 1.05 * Math.cos(a), rr * 1.05 * Math.sin(a), CT + 1.0 + (i % 2) * 0.5], [rr * 1.3 * Math.cos(a), rr * 1.3 * Math.sin(a), CT + 1.45 + (i % 2) * 0.4]], [0.18, 0.16, 0.06], 5, [0, 0, 1], 'end')
    }
    boxAt(bronze, 0, 0, 1.6, 1.6, CT + 2.05, CT + 2.5, 0, 0.45, 0.08)
    latheHard(bronze, 0, 0, [[1.0, CT + 2.5], [1.05, CT + 2.8], [0.92, CT + 2.95], [0.92, CT + 4.2], [1.05, CT + 4.35], [1.0, CT + 4.55], [0.85, CT + 4.6], [0.8, CT + 5.4], [0.55, CT + 5.75], [0.0, CT + 5.95]], SEG)
    const TOPZ = CT + 5.9 // ~31.9: the Nike's soles

    // ========================================================== the Nike ===
    const nk = new Part(); nike(nk, R > 1 ? R * 1.5 : 0.6)
    { const [M, Rn] = similarity(1, Math.PI / 2, [0, 0, TOPZ], true); place(gold, nk, M, Rn) } // facing -x, down to the Isar (mirrored: her right is +x in her own frame)

    boxAt(stone, 0, 0, 4.7, 4.7, -TZ, 0, 0, 0, 0, null)
    const [M, Rn] = similarity(1, 0, [0, 0, TZ])
    for (const [d, sP] of [[st0, stone], [tr0, trim], [br0, bronze], [go0, gold], [co0, copper]] as [Part, Part][]) place(d, sP, M, Rn)
  }

  // ================================================ the terrace below ===
  // Built from the plaza (z = 0 at the wall's foot). The central block
  // with the grotto fountain stands out to x = -19.5; the wings' wall at
  // x = -14.5 behind the stairs; the terrace's edge at 8.0 m.
  const TH = 8.0, XF = -19.5, XW = -14.5, YC = 7.5, YE = 24.0
  {
    const grotto: Opening = { c: YC, hw: 2.1, zs: 3.9, k: 1 }
    const niches: Opening[] = [{ c: YC - 4.6, hw: 1.0, zs: 3.4, k: 1 }, { c: YC + 4.6, hw: 1.0, zs: 3.4, k: 1 }]
    const o: V3 = [XF, -YC, 0], u: V3 = [0, 1, 0], n: V3 = [-1, 0, 0]
    piercedFace(stone, o, u, n, 0, 2 * YC, 0, TH, [grotto, ...niches], 0, SEG)
    tunnel(stone, o, u, n, 0, -1.6, [grotto], 0, SEG)
    tunnel(stone, o, u, n, 0, -0.6, niches, 0, SEG)
    // Backs of the recesses.
    for (const [op, d] of [[grotto, 1.6], [niches[0], 0.6], [niches[1], 0.6]] as [Opening, number][]) {
      piercedFace(stone, [XF + d, -YC, 0], u, n, op.c - op.hw, op.c + op.hw, 0, op.zs + op.hw + 0.01, [], 0, 2)
    }
    // Rockwork in the grotto (the fountain's tufa), a mound at the back.
    ellipsoid(stone, [XF + 1.15, 0, 1.5], [0.55, 1.5, 1.5], 8 + 2 * R, 5 + R)
    for (const op of [grotto, ...niches]) archBand(trim, o, u, n, op, op === grotto ? 0.45 : 0.25, 0.12, 0, SEG)
    // Pilasters between the openings, the cornice, the block's ends.
    for (const y of [-6.8, -2.6, 2.6, 6.8]) boxAt(trim, XF - 0.12, y, 0.14, 0.4, 0.3, TH - 0.5)
    boxAt(trim, XF + 2.5, 0, 2.65, YC + 0.15, TH - 0.5, TH, 0, 0, 0.1)
    boxAt(stone, XF + 2.5, 0, 2.5, YC, 0, 0.6, 0, 0, 0, null)
    for (const s of [-1, 1]) quadN(stone, [XF, s * YC, 0], [XW, s * YC, 0], [XW, s * YC, TH], [XF, s * YC, TH], [0, s, 0])
    cap(stone, rect(XF, -YC, XW, YC), TH - 0.5)
  }
  for (const s of [-1, 1]) {
    // The wing's wall face behind the stairs, with its coping.
    const ya = s * YC, yb = s * YE
    quadN(stone, [XW, ya, 0], [XW, yb, 0], [XW, yb, TH], [XW, ya, TH], [-1, 0, 0])
    boxAt(trim, XW - 0.1, (ya + yb) / 2, 0.25, Math.abs(yb - ya) / 2, TH - 0.4, TH)
    // The wall's outer end.
    quadN(stone, [XW, yb, 0], [XW + 3, yb, 0], [XW + 3, yb, TH], [XW, yb, TH], [0, s, 0])
    // Lower flight: from the ground beside the block (|y| 8) outward and up
    // to the landing (|y| 19, 4 m), in front (x -20..-17.5).
    const flight = (x0: number, x1: number, yA: number, yB: number, zA: number, zB: number) => {
      const n = R > 1 ? 24 : 6
      for (let i = 0; i < n; i++) {
        const t0 = i / n, t1 = (i + 1) / n
        const y0 = yA + (yB - yA) * t0, y1 = yA + (yB - yA) * t1, z = zA + (zB - zA) * t1
        boxAt(stone, (x0 + x1) / 2, (y0 + y1) / 2, (x1 - x0) / 2, Math.abs(y1 - y0) / 2, 0, Math.max(0.05, z), 0, 0, 0)
      }
    }
    flight(-20.3, -17.6, s * 8.4, s * 19.0, 0, 4.0)
    // Landing.
    boxAt(stone, -17.4, s * 21.0, 2.9, 2.0, 0, 4.0, 0, 0, 0)
    boxAt(trim, -17.4, s * 21.0, 3.0, 2.1, 3.85, 4.05)
    // Upper flight: from the landing back inward to the top, against the wall.
    flight(-17.6, XW, s * 19.0, s * YC, 4.0, TH)
    // Balustrades: on the lower flight's front, round the landing, on the
    // upper flight's open side, along the terrace edge on the block.
    balustrade(stone, [-20.25, s * 8.4, 0.3], [-20.25, s * 19.0, 4.0], R)
    balustrade(stone, [-20.25, s * 19.0, 4.0], [-20.25, s * 23.0, 4.0], R)
    balustrade(stone, [-20.25, s * 23.0, 4.0], [XW, s * 23.0, 4.0], R)
    balustrade(stone, [-17.65, s * 17.0, 4.2], [-17.65, s * 9.4, 7.6], R)
    balustrade(stone, [XW + 0.2, s * YC, TH], [XW + 0.2, s * YE, TH], R)
  }
  balustrade(stone, [XF + 0.2, -YC, TH], [XF + 0.2, YC, TH], R)

  const flood = floodWalls
  return [
    { part: stone, material: { ...finish('friedensengel-limestone', 0xe4ded0), floodlight: flood } },
    { part: trim, material: { ...finish('friedensengel-trim', 0xf0ebe1), floodlight: flood } },
    { part: gold, material: { ...finish('friedensengel-gold', 0xd6ae4e, 0.4), floodlight: () => 1 } },
    { part: bronze, material: { ...finish('friedensengel-bronze', 0x5d6b5f), floodlight: () => 0.6 } },
    { part: copper, material: PALETTE.patina },
  ] as Layer[]
}

if (import.meta.main) {
  const extras = { bearing: 18.4, elevation: 0, height: 46.0, osm: 'way/48441018' }
  await save('munich-friedensengel.glb', 'Friedensengel', build(1), extras, 6500)
  await save('munich-friedensengel.detail.glb', 'Friedensengel', build(2), extras, 40_000, 1_536_000)
}
