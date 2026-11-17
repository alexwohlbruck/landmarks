/**
 * Jongmyo Jeongjeon (종묘 정전), the main shrine hall of the royal ancestral
 * shrine, Seoul (1395; extended to 19 bays by 1836) — original procedural
 * geometry, CC0-1.0.
 * bun generators/seoul-jongmyo-jeongjeon.ts
 *
 * Built with the hanok kit in seoul-geunjeongjeon.ts, plus a gabled
 * (matbae) roof of its own: the kit's roofs are hipped.
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = centroid of the OSM outline way/170403802 (the hall's
 * eaves), 37.5749010, 126.9939744. Its long sides run at 112.5°, so the
 * catalog bearing is 22.5 and the hall faces -y, south-south-west (202.5°),
 * over its woldae.
 *
 * Identity, in order: the length (about 100 m with its end rooms) under one
 * long, low, unbroken gabled roof of dark tile with white ridges, the roof
 * deeper than the walls are tall; the open front colonnade of red columns
 * before red plank doors, one pair per bay, 19 bays; the lower end rooms and
 * the two wings (wollang) that turn forward at the ends, their gables to the
 * courtyard; the high stone terrace the hall stands on, with its three
 * flights of steps. Jongmyo is not lit at night: no floodlight, no glowing
 * windows.
 *
 * Evidence:
 *  - plan: OSM way/170403802, 91.8 × 14.8 m (x ±46, y −7.2…7.6): the main
 *    roof 73.6 m long (x ±36.8, the deeper middle), the end rooms
 *    (hyeopsil) to ±46 with their back eaves at 5.2. The terrace in front:
 *    the stone-paved area way/382428487 (y −16.1…−7.1) behind the retaining
 *    walls way/382428463/65/68/70 at y −16…−18, the steps way/382428506 (7
 *    steps) at x −28. The wings: way/382428476 (west, x −53.9…−47.1,
 *    y −18…−1.8) and way/382428479 (east, x 46.1…51, y −18.3…−4.6).
 *  - published: 19 bays (ko.wikipedia, 종묘 정전; Jongmyo's UNESCO
 *    nomination); gabled roof (맞배지붕); the woldae courtyard 150 × 100 m
 *    (en.wikipedia), of which only the hall's own terrace is modelled.
 *  - proportions: measured on the axial front view (Jongmyo.jpg, Wikimedia
 *    Commons) at ~16 px/m (main roof ≈ 75 m with its verges): terrace
 *    1.3 m (7 steps); columns to the eave's lower edge 4.2 m; the roof's
 *    rise from eave to ridge ~5.4 m, the ridge top 11.3 m; the end rooms'
 *    ridges ~2.2 m lower (oblique views). Column grid: 19 equal bays of
 *    3.77 m (x ±35.8); front colonnade at y −5.6, door wall at −3.4, back
 *    wall at 5.8 (estimated from the eaves and the porch depth in the
 *    close views).
 *  - colours: daylight photos: tile #5a5f66, white lime ridges and verges,
 *    deep red columns and doors (darker than the palaces', #8a3a33 pulled
 *    light), sober dancheong: little green, the soffit dark.
 *  - terrain: Mapterhorn has no z15 tiles over Seoul, so `terrain.ts` could
 *    not check the site; the courtyard is level. Elevation 0.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Jongmyo.jpg, Oskar Alexanderson, CC BY-SA 2.0 (axial front view)
 *  - Jongmyo-Jeongjeon.jpg, João Trindade, CC BY 2.0 (south-west, end rooms and east wing)
 *  - Jongmyo-001.jpg and Jongmyo-002.jpg, sean, CC BY-SA 2.0 (south-east, front)
 *  - Jeongjeon,_Jongmyo_Shrine_(oblique)_-_Seoul,_Korea.jpg and (close_up), Daderot, public domain
 *  - Hall_de_confort_éternel,_Jongmyo.jpg, SpaceFox, CC BY 4.0 (south-west, distant)
 *  - Jongmyo_Shrine_06.jpg, Bgag, CC0 (a wing's gable end)
 * No commercial imagery. No look-only references.
 *
 * Left out: the lower woldae courtyard and the raised spirit path across it,
 * the japsang figures, the door studs and tile courses.
 */
import { Part, cross, sub, type V3 } from './mesh'
import { finish } from './palette'
import { bar, box, columns, hanokMaterials, hanokParts, platform, prism, saveHanok, storey, tally, type HanokParts } from './seoul-geunjeongjeon'

const norm = (a: V3): V3 => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l] }
/** A flat polygon (fan) facing `n`; the winding follows the normal. */
function flat(p: Part, pts: V3[], n: V3) {
  for (let i = 1; i < pts.length - 1; i++) p.tri(pts[0], pts[i], pts[i + 1], undefined, undefined, undefined, [n, n, n])
}

export type GableOpts = {
  /** Along the ridge: from a0 to a1 (the verges); across: eaves at b0 (front) and b1 (back), ridge at br. */
  a0: number; a1: number; b0: number; b1: number; br?: number
  ze: number; zr: number; sag?: number; th?: number
  /** Eaves rise at the ends by `lift` over the last `run` metres. */
  lift?: number; run?: number
  /** The walls under it: across from w0 to w1, top at zw; the gables stand `ov` in from the verges. */
  w0: number; w1: number; zw: number; ov?: number
  /** Which verges get a gable (some abut another roof). */
  gables?: [boolean, boolean]
  ridge?: { h: number; w: number; ornament?: number }
  verge?: { w: number; h: number }
  /** Along x (ridge east-west) or along y. */
  axis: 'x' | 'y'
}

/**
 * A gabled (matbae) roof: two concave slopes from the eaves to the ridge,
 * the eaves lifting a little at the ends, the fascia and the painted soffit
 * back to the walls, red gable triangles, white ridge and verge ridges.
 */
export function gableRoof(P: HanokParts, o: GableOpts) {
  const sag = o.sag ?? 0.35, th = o.th ?? 0.6, lift = o.lift ?? 0.35, run = o.run ?? 5, ov = o.ov ?? 1.2
  const br = o.br ?? (o.b0 + o.b1) / 2
  const at = (a: number, b: number, z: number): V3 => (o.axis === 'x' ? [a, b, z] : [b, a, z])
  const prof = (t: number) => (1 - sag) * t + sag * t * t
  const endLift = (a: number) => {
    const d = Math.min(a - o.a0, o.a1 - a)
    return d >= run ? 0 : lift * Math.pow(1 - d / run, 2)
  }
  const A = [0, 0.04, 0.12, 0.25, 0.5, 0.75, 0.88, 0.96, 1].map((s) => o.a0 + (o.a1 - o.a0) * s)
  const T = [0, 0.2, 0.45, 0.72, 1]
  // A point on a slope: side s = 0 front (towards b0), 1 back.
  const pt = (s: number, a: number, t: number, down = 0): V3 => {
    const be = s === 0 ? o.b0 : o.b1
    return at(a, be + (br - be) * t, o.ze + (o.zr - o.ze) * prof(t) + endLift(a) * Math.pow(1 - t, 1.5) - down)
  }
  for (const s of [0, 1]) {
    const G = A.map((a) => T.map((t) => pt(s, a, t)))
    const N = G.map((row, i) => row.map((_, j) => {
      const di = sub(G[Math.min(A.length - 1, i + 1)][j], G[Math.max(0, i - 1)][j])
      const dj = sub(G[i][Math.min(T.length - 1, j + 1)], G[i][Math.max(0, j - 1)])
      let n = norm(cross(di, dj))
      if (n[2] < 0) n = [-n[0], -n[1], -n[2]]
      return n
    }))
    for (let i = 0; i < A.length - 1; i++) for (let j = 0; j < T.length - 1; j++) {
      P.roof.tri(G[i][j], G[i + 1][j], G[i + 1][j + 1], undefined, undefined, undefined, [N[i][j], N[i + 1][j], N[i + 1][j + 1]])
      P.roof.tri(G[i][j], G[i + 1][j + 1], G[i][j + 1], undefined, undefined, undefined, [N[i][j], N[i + 1][j + 1], N[i][j + 1]])
    }
    // Fascia along the eave, facing out; soffit back to the wall top.
    const out: V3 = at(0, s === 0 ? -1 : 1, 0)
    const wb = s === 0 ? o.w0 : o.w1
    for (let i = 0; i < A.length - 1; i++) {
      const a = pt(s, A[i], 0), b = pt(s, A[i + 1], 0)
      const a2 = pt(s, A[i], 0, th), b2 = pt(s, A[i + 1], 0, th)
      flat(P.roof, [a2, b2, b, a], out)
      flat(P.teal, [a2, b2, at(A[i + 1], wb, o.zw), at(A[i], wb, o.zw)], [0, 0, -1])
    }
  }
  // The verges: the slopes' end edges get a thickness, a white verge ridge,
  // and (where open) a red gable under them.
  for (const [k, a] of [[0, o.a0], [1, o.a1]] as const) {
    const out: V3 = at(k === 0 ? -1 : 1, 0, 0)
    const edge = [...T.map((t) => pt(0, a, t)), ...[...T].reverse().slice(1).map((t) => pt(1, a, t))]
    for (let i = 0; i < edge.length - 1; i++) {
      const e0 = edge[i], e1 = edge[i + 1]
      flat(P.roof, [e0, e1, [e1[0], e1[1], e1[2] - th], [e0[0], e0[1], e0[2] - th]], out)
    }
    const vg = o.verge ?? { w: 0.4, h: 0.32 }
    const lift2 = (v: V3): V3 => [v[0], v[1], v[2]]
    bar(P.stone, edge.map(lift2), vg.w, vg.h, 0.15, true, false)
    if (o.gables && !o.gables[k]) continue
    // The gable: under the roof, `ov` in from the verge, from wall to wall.
    const ag = a + (k === 0 ? ov : -ov)
    const under = (s: number, t: number) => pt(s, ag, t, th)
    const tOf = (s: number, w: number) => (w - (s === 0 ? o.b0 : o.b1)) / (br - (s === 0 ? o.b0 : o.b1))
    const t0 = Math.max(0, tOf(0, o.w0)), t1 = Math.max(0, tOf(1, o.w1))
    const poly: V3[] = [at(ag, o.w0, o.zw)]
    for (const t of [t0, 0.45, 0.72, 1]) if (t >= t0) poly.push(under(0, t))
    for (const t of [0.72, 0.45, t1]) if (t >= t1) poly.push(under(1, t))
    poly.push(at(ag, o.w1, o.zw))
    flat(P.red, poly, out)
  }
  // Main ridge, sagging a little, with hooked end ornaments.
  const R = o.ridge ?? { h: 0.8, w: 0.8 }
  const rp: V3[] = [0, 0.25, 0.5, 0.75, 1].map((s) => {
    const a = o.a0 + (o.a1 - o.a0) * s, e = Math.abs(s - 0.5) * 2
    return at(a, br, o.zr + 0.15 * e * e)
  })
  bar(P.stone, rp, R.w, R.h, 0.5, true, false)
  if (R.ornament) for (const [s, a] of [[1, o.a0], [-1, o.a1]] as const) {
    const z = o.zr + 0.15 + R.h - 0.1, h = R.ornament
    const c0 = a + s * 0.0, c1 = a + s * 1.1
    const [x0, x1] = [Math.min(c0, c1), Math.max(c0, c1)]
    if (o.axis === 'x') box(P.roof, x0, br - R.w * 0.7, z, x1, br + R.w * 0.7, z + h, 'b')
    else box(P.roof, br - R.w * 0.7, x0, z, br + R.w * 0.7, x1, z + h, 'b')
  }
}

function build() {
  const P = hanokParts()
  const PH = 1.3 // the terrace
  platform(P, [{
    x0: -46.5, x1: 46.5, y0: -17.0, y1: 8.6, z0: 0, z1: PH, rail: false,
    stairs: [{ side: 's', at: 0, width: 4.2 }, { side: 's', at: -28.5, width: 3.2 }, { side: 's', at: 28.5, width: 3.2 }],
  }])
  tally(P, 'terrace')

  // The main hall: 19 bays, the door wall behind an open colonnade.
  const N = 19, HX = 35.8
  const xs = Array.from({ length: N + 1 }, (_, i) => -HX + 2 * HX * i / N)
  const YW = -3.4, YB = 5.8, YC = -5.6
  const L1 = PH + 3.7, L2 = PH + 4.2, ZW = PH + 4.9
  storey(P, xs, [YW, YB], PH, L1, L2, (side) => (side === 's' ? 'door' : 'wall'), { panes: 2 })
  columns(P, xs, [YW, YB], PH, L2, 0.3, { n: 8 })
  for (const x of xs) prism(P.red, x, YC, PH, L2, 0.32, 0.29, 8)
  // The beam over the colonnade, tying it to the wall.
  box(P.green, -HX - 0.3, YC - 0.3, L1, HX + 0.3, YW, L2, 'b')
  box(P.teal, -HX - 0.3, YC - 0.3, L2, HX + 0.3, YB + 0.3, ZW, 'tb')
  tally(P, 'hall')

  gableRoof(P, {
    axis: 'x', a0: -36.9, a1: 36.9, b0: -7.2, b1: 7.6, br: 0.4,
    ze: PH + 4.6, zr: 10.5, sag: 0.38, th: 0.7, lift: 0.35, run: 6,
    w0: YC - 0.3, w1: YB + 0.3, zw: ZW, ov: 1.1,
    ridge: { h: 0.6, w: 0.75, ornament: 1.1 }, verge: { w: 0.42, h: 0.34 },
  })
  tally(P, 'main roof')

  // The end rooms (hyeopsil), three bays each, lower, walled in front.
  for (const s of [-1, 1]) {
    const a = s * HX, b = s * 45.4
    const exs = [Math.min(a, b), Math.min(a, b) + 3.2, Math.max(a, b) - 3.2, Math.max(a, b)]
    storey(P, exs, [YC, 4.0], PH, L1, L2, (side) => (side === 's' ? 'door' : 'wall'), { panes: 2 })
    columns(P, exs, [YC, 4.0], PH, L2, 0.3, { n: 8 })
    box(P.teal, exs[0], YC, L2, exs[3], 4.0, ZW - 0.3, 'tb')
    gableRoof(P, {
      axis: 'x', a0: Math.min(s * 35.2, s * 46.0), a1: Math.max(s * 35.2, s * 46.0), b0: -7.0, b1: 5.2, br: -0.9,
      ze: PH + 4.4, zr: 8.3, sag: 0.35, th: 0.6, lift: 0.3, run: 3,
      w0: YC, w1: 4.0, zw: ZW - 0.3, ov: 0.6, gables: s < 0 ? [true, false] : [false, true],
      ridge: { h: 0.7, w: 0.75 }, verge: { w: 0.38, h: 0.3 },
    })
  }
  tally(P, 'end rooms')

  // The wings (wollang), turning forward at the ends, gables to the court.
  for (const [x0, x1, y0, y1] of [[-53.9, -47.1, -18.0, -1.8], [46.1, 51.0, -18.3, -4.6]]) {
    const cx = (x0 + x1) / 2, hw = (x1 - x0) / 2 - 1.0
    box(P.stone, x0 + 0.4, y0 + 0.4, 0, x1 - 0.4, y1, 0.8, 'b')
    const wys = Array.from({ length: 5 }, (_, i) => y0 + 1.2 + (y1 - y0 - 1.2) * i / 4)
    storey(P, [cx - hw, cx + hw], wys, 0.8, 3.6, 4.1, () => 'wall')
    columns(P, [cx - hw, cx + hw], wys, 0.8, 4.1, 0.27, { n: 8 })
    box(P.teal, cx - hw, wys[0], 4.1, cx + hw, wys[4], 4.6, 'tb')
    gableRoof(P, {
      axis: 'y', a0: y0, a1: y1, b0: x0, b1: x1,
      ze: 4.5, zr: 7.4, sag: 0.3, th: 0.55, lift: 0.25, run: 3,
      w0: cx - hw, w1: cx + hw, zw: 4.6, ov: 1.0,
      ridge: { h: 0.6, w: 0.65 }, verge: { w: 0.36, h: 0.28 },
    })
  }
  tally(P, 'wings')

  // Jongmyo's red is deeper than the palaces'; no night lighting.
  // The plank doors take the sixth swatch, renamed so they stay dark at night.
  return hanokMaterials(P, {}, { red: 0x9a4038 }).map((m) => (m.material.name === 'window-2' ? { ...m, material: finish('plank-door', 0x83403a) } : m))
}

if (import.meta.main) await saveHanok('seoul-jongmyo-jeongjeon', 'Jongmyo Jeongjeon', [37.574901, 126.9939744], 22.5, build(), 6500)
