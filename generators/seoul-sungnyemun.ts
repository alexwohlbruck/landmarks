/**
 * Sungnyemun (숭례문, Namdaemun), the south gate of Hanyang's city wall,
 * Seoul (1398; rebuilt 2010–2013 after the 2008 fire) — original procedural
 * geometry, CC0-1.0.
 * bun generators/seoul-sungnyemun.ts
 *
 * Built with the hanok kit in seoul-geunjeongjeon.ts. This file also exports
 * the city-gate helpers the other seoul- gates use (brick parapet, gate
 * materials); its own model is only written when it runs itself.
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = centroid of the OSM outline relation/10647050 (ways
 * 233625717 + 1487802248), 37.5599880, 126.9753602. Its long sides run at
 * 131.6°, so the catalog bearing is 41.6 and the gate faces -y, which is
 * south-west (221.6°), out of the old city towards Seoul Station.
 *
 * Identity: the massive granite base (yukchuk) with one round-headed
 * passage and a pale grey brick parapet; on it the two-storey pavilion, 5 × 2
 * bays, under two hipped (ujingak) roofs, the trapezoid seen from the front,
 * whose eaves sweep up at the corners; the vertical name board 崇禮門 over
 * the middle bay; the stubs of the city wall at the ends of the base.
 * At night the base and the pavilion are floodlit in warm white: granite,
 * brick, red, the eaves soffits and the bracket bands carry `floodlight`.
 *
 * Evidence:
 *  - plan: OSM outline relation/10647050, 34.3 × 21.5 m in the frame
 *    (x −17.3…17.0, y −10.8…10.6): the stone base with the stubs of its
 *    flanks. The building way 767663128 maps the passage's outer arch ring,
 *    8 m across, at the front. The roof relations 10647048/49 and the part
 *    way/767663123 draw a hipped roof 29.3 × 16 m with a 14.7 m ridge.
 *  - published: ko.wikipedia, 숭례문: 5 × 2 bays, two storeys, ujingak roof,
 *    dapo brackets; the restored ridge (용마루) 16.6 m long; the name board
 *    hung vertically; city wall restored 53 m east and 16 m west in 2013
 *    (outside the outline, left to the map).
 *  - proportions: measured on two level frontal photos (m-louis's
 *    Korea-Seoul-Namdaemun-Sungnyemun-11, south face, and Immanuelle's
 *    Namdaemun_Gate-5, north face) at ~26 px/m on the base face, the scale
 *    that puts the passage at ~6 m inside the OSM arch ring (8 m outside):
 *    base top 30.8 m wide; passage 6.0 m wide, 6.1 m to the crown; lower
 *    eaves ~34 m, upper ~31 m wide (the photo's ratio 0.93); upper-storey
 *    columns ±10.7 m with a wide middle bay. Depths: base 21.4 m (OSM); storeys 2 bays, ±5.6 m and
 *    ±4.4 m (estimated from the oblique views). Heights corrected for
 *    perspective (the ridge stands ~10 m behind the base face; at ~52 m the
 *    ridge's ornaments measure the published 16.6 m): base 8.3 m, parapet
 *    to 10.1, lower eave 13.1, lower roof meets the upper wall at 15.3,
 *    upper eave 18.0, ridge 21.3 + 0.85 m, ornaments to ~23.4 m. After
 *    review against the level frontal photo the base came down to 7.9 m
 *    (about 0.4 of the height to the ridge, as in -11) and the pavilion
 *    widened ~4% (lower columns ±12.9, upper ±11.3, eaves to ~34.6 / 32.3 m);
 *    ridge top now ~21.75 m.
 *    The ground under the base is not visible in -11; its height is from
 *    the passage-to-base ratio in Gate-5 (estimate, ±0.5 m).
 *  - colours: daylight photos: base granite #b0a080 sunlit (pulled light),
 *    the parapet's grey brick #d3cec6 sunlit, tile #555758, red columns,
 *    green dancheong.
 *  - terrain: Mapterhorn has no z15 tiles over Seoul, so `terrain.ts` could
 *    not check the site; the plaza around the gate is flat. Elevation 0.
 *
 * Photos (Wikimedia Commons, all EVIDENCE; the -11/-12/-26 series predate
 * the 2008 fire, the restoration rebuilt the same form):
 *  - Korea-Seoul-Namdaemun-Sungnyemun-11.jpg, lwy, CC BY 2.0 (south face, level, telephoto)
 *  - Namdaemun_Gate-5.jpg, Immanuelle, CC BY 4.0 (north face, level)
 *  - Sungnyemun_Gate,_front,_2013.jpg, DoulosCore, CC BY-SA 3.0 (south-west, restored walls)
 *  - Sungnyemun_Gate_in_Seoul.jpg, Bernard Gagnon, CC0 (south-west, distant)
 *  - Korea-Seoul-Namdaemun-Sungnyemun-12.jpg, lwy, CC BY 2.0 (south-east, close)
 *  - Korea-Seoul-Namdaemun-Sungnyemun-26.jpg, m-louis, CC BY-SA 2.0 (south face, close)
 *  - Korea-Seoul-Namdaemun-Sungnyemun-18.jpg, AndrewEick, CC BY 2.0 (night)
 * No commercial imagery. No look-only references.
 *
 * The passage is drawn open and dark (a dark panel at the back of each
 * reveal), as in the photos, where the leaves stand open against the
 * reveals. The roofs' hip ridges are drawn here (`sweptRoof`), trimmed to
 * end at the upturned corners, with less corner lift than the kit's
 * default so the hip keeps climbing from the tip: the roof reads as one
 * sweep to each corner instead of a slab with pale bars.
 *
 * Left out: the iron-clad door leaves, the japsang figures on the hips, the small side gates
 * and stairs inside the parapet, the restored walls beyond the outline.
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { bar, box, brackets, columns, gateBase, hanokMaterials, hanokParts, hyeonpan, roof, saveHanok, storey, tally, type HanokParts, type RoofOpts } from './seoul-geunjeongjeon'

/**
 * A brick parapet (yeojang) round x0..x1, y0..y1 on a base at z, in `brick`
 * (its own part), `h` high and `t` thick under a dark tile coping.
 * `open` leaves gaps in the back (+y) wall: [x0, x1] pairs.
 */
export function brickParapet(P: HanokParts, brick: Part, x0: number, y0: number, x1: number, y1: number, z: number, h: number, t = 0.7) {
  const zc = z + h - 0.3
  box(brick, x0, y0, z, x1, y0 + t, zc, 'b')
  box(brick, x0, y1 - t, z, x1, y1, zc, 'b')
  box(brick, x0, y0 + t, z, x0 + t, y1 - t, zc, 'bns')
  box(brick, x1 - t, y0 + t, z, x1, y1 - t, zc, 'bns')
  const c = 0.15
  // The coping: a dark cap, a little wider, with a ridge line on top.
  for (const [a, b, cc, d] of [[x0 - c, y0 - c, x1 + c, y0 + t + c], [x0 - c, y1 - t - c, x1 + c, y1 + c], [x0 - c, y0 + t + c, x0 + t + c, y1 - t - c], [x1 - t - c, y0 + t + c, x1 + c, y1 - t - c]] as const) {
    box(P.roof, a, b, zc, cc, d, zc + 0.3, 'b')
  }
}

/** The gate materials: the kit's five, with the sixth as grey brick (unlit by day, floodlit at night). */
export function gateMaterials(P: HanokParts, brick: Part, flood: Partial<Record<keyof HanokParts | 'brick', number>>, colours: Parameters<typeof hanokMaterials>[2] = {}, brickColour = 0xcfcbc3) {
  const mats = hanokMaterials(P, flood, colours).filter((m) => m.material.name !== 'window-2')
  const k = flood.brick ?? 0
  const mat = finish('brick', brickColour)
  return [...mats, { part: brick, material: k > 0 ? { ...mat, floodlight: (_: V3, n: V3) => k * (n[2] > 0.6 ? 0.35 : 1) } : mat }]
}

/**
 * A wedge of wall at a base's end: from x=xa (against the base, top at za)
 * out to x=xb (top at zb), y0..y1 deep. Its top slopes; the outer end is cut
 * square where the outline stops (the wall goes on outside the model).
 */
export function wallStub(p: Part, xa: number, xb: number, y0: number, y1: number, za: number, zb: number) {
  const s = Math.sign(xb - xa)
  const A: V3[] = [[xa, y0, 0], [xb, y0, 0], [xb, y0, zb], [xa, y0, za]]
  const B: V3[] = A.map(([x, , z]) => [x, y1, z] as V3)
  if (s > 0) {
    p.quad(A[0], A[1], A[2], A[3]); p.quad(B[1], B[0], B[3], B[2])
    p.quad(A[1], B[1], B[2], A[2]); p.quad(A[3], A[2], B[2], B[3])
  } else {
    p.quad(A[1], A[0], A[3], A[2]); p.quad(B[0], B[1], B[2], B[3])
    p.quad(B[1], A[1], A[2], B[2]); p.quad(A[2], A[3], B[3], B[2])
  }
}


/**
 * The kit's curved roof with its hip ridges trimmed: the kit's own hips are
 * buried just under the tile (they run past the corner and lie flat there,
 * which reads as pale bars sticking out), and new slim hips follow the
 * corner line from just inside the upturned tip to the ridge (or, on a
 * skirt, to the upper wall), so the roof ends in one sweep at each corner.
 */
export function sweptRoof(P: HanokParts, o: RoofOpts, hip = { w: 0.4, h: 0.3 }) {
  roof(P, { ...o, hipRidge: { w: 0.02, h: -0.06 } })
  const cx = o.cx ?? 0, cy = o.cy ?? 0, sag = o.sag ?? 0.5
  const prof = (t: number) => (1 - sag) * t + sag * t * t
  const T = o.kind === 'skirt' ? [0.03, 0.12, 0.3, 0.6, 1] : [0.03, 0.12, 0.3, 0.55, 0.8, 1]
  const at = (t: number): [number, number, number] => {
    const L = Math.pow(1 - t, 1.15)
    return [o.ex + (o.gx - o.ex) * t + o.flare * L, o.ey + (o.gy - o.ey) * t + o.flare * L, o.ze + (o.zg - o.ze) * prof(t) + o.lift * L]
  }
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
    bar(P.stone, T.map((t) => { const [a, b, z] = at(t); return [cx + sx * a, cy + sy * b, z] as V3 }), hip.w, hip.h, 0.2, true, false)
  }
}

/**
 * The open passage: a dark panel with the arch's outline at the back of a
 * face's reveal (x = c, face plane y, reveal d inward by `dir`), hiding the
 * kit's shut doors: the real leaves stand open against the reveals and the
 * passage reads dark.
 */
export function passageShade(p: Part, c: number, y: number, w: number, h: number, dir: 1 | -1, seg = 12) {
  const r = w / 2, hs = h - r, n: V3 = [0, -dir, 0]
  const pts: V3[] = [[c - r, y, 0], [c + r, y, 0]]
  for (let i = 0; i <= seg; i++) { const a = Math.PI * i / seg; pts.push([c + r * Math.cos(a), y, hs + r * Math.sin(a)]) }
  const ctr: V3 = [c, y, hs * 0.6]
  for (let i = 0; i < pts.length; i++) {
    const A = pts[i], B = pts[(i + 1) % pts.length]
    p.tri(ctr, A, B, undefined, undefined, undefined, [n, n, n])
  }
}

// ===========================================================================
// Sungnyemun

function build() {
  const P = hanokParts()
  const brick = new Part()
  const Y0 = -10.8, Y1 = 10.6, CY = (Y0 + Y1) / 2
  const BX = 15.4, BH = 7.9

  gateBase(P, {
    x0: -BX, x1: BX, y0: Y0, y1: Y1, h: BH, reveal: 2.6, seg: 12,
    arches: [{ c: 0, w: 6.0, h: 6.1 }],
  })
  // The passage reads dark, its leaves open against the reveals.
  passageShade(P.roof, 0, Y0 + 2.6 - 0.03, 6.0, 6.1, 1)
  passageShade(P.roof, 0, Y1 - 2.6 + 0.03, 6.0, 6.1, -1)
  // The arch ring of dressed voussoirs, standing a little proud of the face.
  ring(P.stone, 0, Y0, 3.0, 3.95, 6.1 - 3.0, 0.18)
  ring(P.stone, 0, Y1, 3.0, 3.95, 6.1 - 3.0, -0.18)
  // The city wall's stubs at the ends, their tops sloping off the base.
  wallStub(P.stone, -BX, -17.1, Y0, Y1, BH, 6.2)
  wallStub(P.stone, BX, 17.0, Y0, Y1, BH, 6.2)
  brickParapet(P, brick, -BX, Y0, BX, Y1, BH, 1.8, 0.7)
  // Square brick posts at the parapet's corners, a little taller.
  for (const x of [-BX, BX - 1.1]) for (const y of [Y0, Y1 - 1.1]) box(brick, x, y, BH, x + 1.1, y + 1.1, BH + 2.2, 'b')
  tally(P, 'base')

  // Lower storey: 5 × 2 bays, open between the columns, the hall's dark
  // interior behind them.
  const Z0 = BH
  const xs = [-12.9, -8.6, -3.9, 3.9, 8.6, 12.9]
  const ys = [CY - 5.6, CY, CY + 5.6]
  const L1 = Z0 + 2.6, L2 = Z0 + 3.2, B1 = Z0 + 4.8
  box(P.stone, -BX + 0.7, Y0 + 0.7, Z0, BX - 0.7, Y1 - 0.7, Z0 + 0.15, 'b')
  storey(P, xs, ys, Z0 + 0.15, L1, L2, () => 'open')
  box(P.teal, xs[1], ys[0] + 1.6, Z0 + 0.15, xs[4], ys[2] - 1.6, L2, 'tb')
  box(P.teal, xs[0] + 0.3, ys[0] + 0.3, L2 - 0.02, xs[5] - 0.3, ys[2] - 0.3, L2, 'nsewb')
  columns(P, xs, ys, Z0 + 0.15, L2, 0.36)
  brackets(P, xs, ys, L2, B1, { per: 2, depth: 1.4, width: 0.55 })
  tally(P, 'lower storey')

  const UX = 11.3, UY = 4.5, U0 = Z0 + 7.0
  sweptRoof(P, {
    cy: CY, kind: 'skirt', ex: 16.3, ey: 9.3, ze: Z0 + 4.8, gx: UX, gy: UY, zg: U0,
    lift: 1.15, flare: 1.0, sag: 0.3, th: 0.6,
    soffit: { bx: 12.9 + 1.45, by: 5.6 + 1.45, zb: B1 },
  })
  tally(P, 'lower roof')

  const uxs = [-UX, -7.9, -3.9, 3.9, 7.9, UX]
  const uys = [CY - UY, CY, CY + UY]
  const UL1 = Z0 + 7.5, UL2 = Z0 + 8.0, UB1 = Z0 + 9.7
  storey(P, uxs, uys, U0 - 0.2, UL1, UL2, () => 'wall')
  columns(P, uxs, uys, U0 - 0.2, UL2, 0.33)
  brackets(P, uxs, uys, UL2, UB1, { per: 2, depth: 1.35, width: 0.5 })
  tally(P, 'upper storey')

  sweptRoof(P, {
    cy: CY, kind: 'hip', ex: 15.0, ey: 8.4, ze: Z0 + 9.7, gx: 7.6, gy: 0, zg: 20.9, zr: 20.9,
    lift: 1.5, flare: 1.15, sag: 0.35, th: 0.65,
    soffit: { bx: UX + 1.4, by: UY + 1.4, zb: UB1 },
    ridge: { h: 0.85, w: 0.9, ornament: 1.3 }, ridgeSag: 0.2,
  })
  // The name board hangs vertically (to face down Gwanaksan's fire, by
  // tradition), from the bracket band down over the lintel.
  hyeonpan(P, 0, CY - UY - 0.9, UL2 - 0.2, 1.5, 3.2, 0.25)
  tally(P, 'upper roof')

  return gateMaterials(P, brick, { red: 0.75, teal: 0.7, stone: 0.6, brick: 0.6, green: 0.4 }, { stone: 0xd8ccb6 })
}

/**
 * A semicircular ring of voussoirs round an arch at x = c on the face y:
 * radius r0 (the opening) to r1, its centre `hs` up, `d` proud of the face
 * (negative on a +y face).
 */
export function ring(p: Part, c: number, y: number, r0: number, r1: number, hs: number, d: number, seg = 12) {
  const yo = y - d
  const at = (r: number, a: number, yy: number): V3 => [c + r * Math.cos(a), yy, hs + r * Math.sin(a)]
  for (let i = 0; i < seg; i++) {
    const a0 = Math.PI * (1 - i / seg), a1 = Math.PI * (1 - (i + 1) / seg)
    const q = (A: V3, B: V3, C: V3, D: V3) => (d > 0 ? p.quad(A, B, C, D) : p.quad(B, A, D, C))
    q(at(r0, a0, yo), at(r0, a1, yo), at(r1, a1, yo), at(r1, a0, yo)) // face
    q(at(r1, a0, yo), at(r1, a1, yo), at(r1, a1, y), at(r1, a0, y)) // outer edge
  }
  // Short jambs down to the springing: the ring's legs.
  const leg = (x0: number, x1: number) => {
    const q = (A: V3, B: V3, C: V3, D: V3) => (d > 0 ? p.quad(A, B, C, D) : p.quad(B, A, D, C))
    q([x0, yo, 0], [x1, yo, 0], [x1, yo, hs], [x0, yo, hs])
    const xo = Math.abs(x0 - c) > Math.abs(x1 - c) ? x0 : x1
    if (xo === x0) q([x0, y, 0], [x0, yo, 0], [x0, yo, hs], [x0, y, hs])
    else q([x1, yo, 0], [x1, y, 0], [x1, y, hs], [x1, yo, hs])
  }
  leg(c - r1, c - r0)
  leg(c + r0, c + r1)
}

if (import.meta.main) await saveHanok('seoul-sungnyemun', 'Sungnyemun', [37.559988, 126.9753602], 41.6, build(), 6500)
