/**
 * Geunjeongjeon (근정전), the throne hall of Gyeongbokgung, Seoul (rebuilt
 * 1867) — original procedural geometry, CC0-1.0.
 * bun generators/seoul-geunjeongjeon.ts
 *
 * This file also exports the hanok kit the other seoul- palace models build
 * with (curved paljak / hipped roofs with upturned corners, ridges and ridge
 * ornaments, dancheong eaves, red column bays, 3D bracket band, stone
 * platform with balustrades and stairs). The Geunjeongjeon model is only
 * written when this file runs itself.
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = centroid of the OSM outline way/170199428 (the eaves of
 * the hall), 37.5785445, 126.9769904. Its long walls run at 92.3°, so the
 * catalog bearing is 2.3 and the hall is square to its own frame, front to
 * the south (-y).
 *
 * Identity, in order: the double hipped-and-gabled roof, dark tile with white
 * ridges, its eaves sweeping up hard at the corners, the upper storey nearly
 * as wide as the lower; red columns over green lattice doors and the green
 * dancheong bracket bands; the broad pale two-tier woldae with its stone
 * balustrades and the wide central stair. At night Gyeongbokgung's night
 * openings floodlight the hall from below: the red columns and walls and the
 * eaves soffits carry `floodlight`, the lattice doors are `window-2` and
 * glow; the tile and the woldae stay dark (bytes: see `hanokMaterials`).
 *
 * Evidence:
 *  - plan: OSM outline way/170199428 (39.2 × 30 m, the lower eaves) and its
 *    building:parts (way/1569283607–1569283660, way/1222920894): lower
 *    columns ±15.3 × ±10.5 m, upper storey ±14 × ±9.4 m, upper roof eaves
 *    37.4 × 28.2 m. Published (ko.wikipedia, Geunjeongjeon): 5 × 5 bays;
 *    bay widths in cheok (centre 22, sides 21, ends 17), 16-cheok columns;
 *    front 30 m × side 21 m, 22.5 m high above the woldae, the two woldae
 *    tiers 2.72 m together (24.72 m overall) — quoted from the Korean wiki
 *    summary of the hall, not checked against the heritage record.
 *  - heights within the hall: OSM parts (column tops 5.6, lower roof 7.3–10.5,
 *    upper roof 14.2–25.4 m above a 1 m base), scaled to the published
 *    22.5 m and checked on Basile Morin's level front view (column 4.4 m +
 *    lintel, bracket band ~1.9 m, lower roof meets the upper wall at ~9 m,
 *    upper eave ~12.8 m above the woldae).
 *  - gable: ~11 m wide at its foot, from the east side views; ridge ~22 m
 *    between the end ornaments from the front view; the ridge top is 22 m
 *    above the woldae (published 22.5 m). Eave sweep (estimates from the
 *    front and east views): upper corners rise 2.9 m and reach 1.5 m out,
 *    lower 2.2 m and 1.3 m, the upturn starting a third of the way out from
 *    the middle and the tile surface following it to the tip.
 *  - detail: the name board (hyeonpan) over the middle bay of the upper
 *    storey, dark in a red frame; red painted ends (meoricho) on every
 *    green lintel, for the dancheong rhythm.
 *  - woldae plan: not in OSM and no open aerial; estimated from the front
 *    and east views scaled by the 30 m column span: lower tier 56 × 48.5 m,
 *    upper 46 × 35.5 m, both extending further south than north. The split
 *    of the 2.72 m between the tiers (1.45 / 1.27) is estimated from the
 *    photos. Stairs: the wide central flight on the south of both tiers,
 *    single flights east, west and north of both, and two on the lower
 *    tier's sides near its south corners (from the east view).
 *  - colours: Basile Morin's and AnbyG's daylight photos: tile #5a5f66
 *    (pulled lighter), lime-white ridges and woldae granite, column red,
 *    dancheong green bands and lattice doors, dark teal under the eaves.
 *  - terrain: Mapterhorn has no z15 tiles over Seoul, so `terrain.ts` could
 *    not check the site; the courtyard is flat. Elevation 0.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Front_view_of_the_Imperial_Throne_Hall_Geunjeongjeon_at_Gyeongbokgung_
 *    Palace_with_blue_sky_in_Seoul.jpg, Basile Morin, CC BY-SA 4.0
 *  - Front_view_of_the_Eastern_side_of_the_Imperial_Throne_Hall_Geunjeongjeon
 *    _at_Gyeongbokgung_Palace_in_Seoul.jpg, Basile Morin, CC BY-SA 4.0
 *  - Side_of_Geunjeongjeon.jpg, AnbyG, CC BY-SA 4.0
 *  - Geunjeongjeon_Seoul.jpg, kallerna, CC BY-SA 4.0
 *  - Gyeongbokgung(palace)_Geunjeongjeon(hall).jpg, Brady Bellini, CC0
 *  - Seoul-Gyeongbokgung-Geunjeongjeon-01.jpg, Richard Fisher, CC BY 2.0
 *  - Seoul_Geunjeongjeon_01.jpg, Spike, CC BY-SA 4.0
 * No commercial imagery. No look-only references.
 *
 * Left out: the japsang figurines on the hip ridges, the woldae's carved
 * animals and the bronze vessels, the tile courses, the board's lettering, the
 * rank stones in the courtyard and the cloister (haenggak), which OSM maps as
 * its own building (way/279961015).
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { finish } from './palette'
import { save as saveGlb } from './chi-aon-center'

// ===========================================================================
// Hanok kit. Everything is built axis-aligned about (cx, cy): a hall's front
// is -y unless the caller says otherwise; turn the model with the bearing.

export type HanokParts = { roof: Part; stone: Part; red: Part; green: Part; teal: Part; lattice: Part }

/** Triangles so far, for budgeting: `HANOK_TALLY=1` prints each step's share. */
let tallied = 0
export function tally(P: HanokParts, label: string) {
  const n = Object.values(P).reduce((s, p) => s + p.triangles, 0)
  if (process.env.HANOK_TALLY) console.log(`  ${label}: ${n - tallied}`)
  tallied = n
}

export const hanokParts = (): HanokParts => ({ roof: new Part(), stone: new Part(), red: new Part(), green: new Part(), teal: new Part(), lattice: new Part() })

/** Colours from daylight photos of the Seoul palaces, pulled to the palette's lightness. */
export const HANOK_COLOURS = {
  roof: 0x666c73, // giwa tile, #5a5f66 in the photos
  stone: 0xe4ded2, // granite woldae, lime-white ridges
  red: 0xa6463c, // column and wall red (juhong)
  green: 0x5f9a7f, // dancheong green: lintels, brackets
  teal: 0x3f6f6b, // the shadowed green-blue under the eaves
  lattice: 0x6f9d86, // green lattice doors and windows; glow at night
}

export type HanokFlood = Partial<Record<keyof HanokParts, number>>

/**
 * The six materials. `flood` sets how strongly each is floodlit at night
 * (0 = dark); faces looking up get a third of it, so roofs and platform tops
 * stay quiet.
 */
export function hanokMaterials(p: HanokParts, flood: HanokFlood = {}, colours: Partial<typeof HANOK_COLOURS> = {}) {
  const c = { ...HANOK_COLOURS, ...colours }
  const light = (k: number) => k > 0 ? (_: V3, n: V3) => k * (n[2] > 0.6 ? 0.35 : 1) : undefined
  const m = (name: keyof HanokParts, mat: { name: string; color: number; roughness?: number }) => {
    const f = light(flood[name] ?? 0)
    return { part: p[name], material: f ? { ...mat, floodlight: f } : mat }
  }
  return [
    m('roof', finish('giwa', c.roof)),
    m('stone', finish('granite', c.stone)),
    m('red', finish('dancheong-red', c.red)),
    m('green', finish('dancheong-green', c.green)),
    m('teal', finish('dancheong-teal', c.teal)),
    m('lattice', { name: 'window-2', color: c.lattice, roughness: 0.6 }),
  ]
}

// ---------------------------------------------------------------------------
// Primitives

const norm = (a: V3): V3 => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l] }

/**
 * An axis-aligned box. `skip` names faces left out because something covers
 * them: any of 'b' (bottom), 't' (top), 'n', 's', 'e', 'w'.
 */
export function box(p: Part, x0: number, y0: number, z0: number, x1: number, y1: number, z1: number, skip = '', soft = false) {
  if (x0 > x1) [x0, x1] = [x1, x0]
  if (y0 > y1) [y0, y1] = [y1, y0]
  // `soft`: each corner shares one normal pointing out of the corner, so a
  // small block (a bracket, a post) shades like a rounded one and its
  // corners weld — a third of the vertices of a flat-shaded box.
  const mx = (x0 + x1) / 2, my = (y0 + y1) / 2, mz = (z0 + z1) / 2
  const c = (x: number, y: number, z: number): V3 => [x, y, z]
  const nrm = (q: V3): V3 => norm([Math.sign(q[0] - mx), Math.sign(q[1] - my), Math.sign(q[2] - mz)])
  const quad = (a: V3, b: V3, cc: V3, d: V3) => {
    if (!soft) return p.quad(a, b, cc, d)
    p.tri(a, b, cc, undefined, undefined, undefined, [nrm(a), nrm(b), nrm(cc)])
    p.tri(a, cc, d, undefined, undefined, undefined, [nrm(a), nrm(cc), nrm(d)])
  }
  if (!skip.includes('s')) quad(c(x0, y0, z0), c(x1, y0, z0), c(x1, y0, z1), c(x0, y0, z1))
  if (!skip.includes('e')) quad(c(x1, y0, z0), c(x1, y1, z0), c(x1, y1, z1), c(x1, y0, z1))
  if (!skip.includes('n')) quad(c(x1, y1, z0), c(x0, y1, z0), c(x0, y1, z1), c(x1, y1, z1))
  if (!skip.includes('w')) quad(c(x0, y1, z0), c(x0, y0, z0), c(x0, y0, z1), c(x0, y1, z1))
  if (!skip.includes('t')) quad(c(x0, y0, z1), c(x1, y0, z1), c(x1, y1, z1), c(x0, y1, z1))
  if (!skip.includes('b')) quad(c(x0, y1, z0), c(x1, y1, z0), c(x1, y0, z0), c(x0, y0, z0))
}

/** A box with its top edges bevelled by `b`, no bottom: a stone tier, a plinth. */
export function bevelBox(p: Part, x0: number, y0: number, z0: number, x1: number, y1: number, z1: number, b = 0.15, top: Part = p) {
  const ring = (d: number, z: number): V3[] => [[x0 + d, y0 + d, z], [x1 - d, y0 + d, z], [x1 - d, y1 - d, z], [x0 + d, y1 - d, z]]
  p.loft([ring(0, z0), ring(0, z1 - b), ring(b, z1)])
  top.cap(ring(b, z1), true)
}

/** A vertical prism of `n` sides (a column), smooth-shaded, open at both ends. */
export function prism(p: Part, x: number, y: number, z0: number, z1: number, r0: number, r1 = r0, n = 8) {
  for (let i = 0; i < n; i++) {
    const a = (i + 0.5) / n * 2 * Math.PI, b = (i + 1.5) / n * 2 * Math.PI
    const A0: V3 = [x + r0 * Math.cos(a), y + r0 * Math.sin(a), z0], B0: V3 = [x + r0 * Math.cos(b), y + r0 * Math.sin(b), z0]
    const A1: V3 = [x + r1 * Math.cos(a), y + r1 * Math.sin(a), z1], B1: V3 = [x + r1 * Math.cos(b), y + r1 * Math.sin(b), z1]
    const na: V3 = [Math.cos(a), Math.sin(a), 0], nb: V3 = [Math.cos(b), Math.sin(b), 0]
    p.tri(A0, B0, B1, undefined, undefined, undefined, [na, nb, nb])
    p.tri(A0, B1, A1, undefined, undefined, undefined, [na, nb, na])
  }
}

/**
 * A rectangular bar swept along a polyline: `w` wide, from `down` below the
 * line to `up` above it, with end caps. For ridges and rails.
 */
export function bar(p: Part, pts: V3[], w: number, up: number, down = 0, caps = true, bottom = true) {
  const secs = pts.map((P, i) => {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)]
    const t = norm(sub(b, a))
    let s = norm(cross(t, [0, 0, 1]))
    if (!isFinite(s[0]) || Math.hypot(...s) < 0.5) s = [1, 0, 0]
    const u = norm(cross(s, t))
    const at = (ks: number, ku: number): V3 => [P[0] + s[0] * ks + u[0] * ku, P[1] + s[1] * ks + u[1] * ku, P[2] + s[2] * ks + u[2] * ku]
    // left-bottom, right-bottom, right-top, left-top (s points right of travel)
    return [at(-w / 2, -down), at(w / 2, -down), at(w / 2, up), at(-w / 2, up)]
  })
  for (let k = 0; k < secs.length - 1; k++) {
    const A = secs[k], B = secs[k + 1]
    p.quad(A[1], B[1], B[2], A[2]) // right side
    p.quad(B[0], A[0], A[3], B[3]) // left side
    p.quad(A[2], B[2], B[3], A[3]) // top
    if (bottom) p.quad(A[0], B[0], B[1], A[1]) // bottom
  }
  if (caps) {
    const A = secs[0], B = secs[secs.length - 1]
    p.quad(A[0], A[1], A[2], A[3])
    p.quad(B[1], B[0], B[3], B[2])
  }
}

/** A grid surface P[i][j] (i across, j up), smooth-shaded, faces toward cross(di, dj). */
function grid(p: Part, P: V3[][]) {
  const I = P.length, J = P[0].length
  const N = P.map((row, i) => row.map((_, j) => {
    const di = sub(P[Math.min(I - 1, i + 1)][j], P[Math.max(0, i - 1)][j])
    const dj = sub(P[i][Math.min(J - 1, j + 1)], P[i][Math.max(0, j - 1)])
    return norm(cross(di, dj))
  }))
  for (let i = 0; i < I - 1; i++) for (let j = 0; j < J - 1; j++) {
    const a = P[i][j], b = P[i + 1][j], c = P[i + 1][j + 1], d = P[i][j + 1]
    p.tri(a, b, c, undefined, undefined, undefined, [N[i][j], N[i + 1][j], N[i + 1][j + 1]])
    p.tri(a, c, d, undefined, undefined, undefined, [N[i][j], N[i + 1][j + 1], N[i][j + 1]])
  }
}

// ---------------------------------------------------------------------------
// Roofs

export type RoofOpts = {
  cx?: number; cy?: number
  /** Eave half-sizes at the middle of each side (before the corner flare). */
  ex: number; ey: number
  /** Top of the tile at the eave, middle of a side. */
  ze: number
  /**
   * 'paljak': hipped-and-gabled, the hips rising to the gable foot (gx, gy,
   * zg), the gable triangles up to the ridge at zr.
   * 'hip': hipped (ujingak), gy = 0: the hips run to the ridge ends at ±gx.
   * 'skirt': the lower roof of a two-storey hall, from the eave up to the
   * upper storey's wall (gx, gy) at zg; nothing above.
   */
  kind: 'paljak' | 'hip' | 'skirt'
  gx: number; gy: number; zg: number
  zr?: number
  /** How far the corners rise and sweep out, and how they spread along the eave (exponent). */
  lift: number; flare: number; pow?: number
  /** 0 = straight slope, ~0.5 = the usual concave sag. */
  sag?: number
  /** Eave thickness (tile edge and rafter ends). */
  th?: number
  /** The underside runs up to the top of the bracket band: half-sizes bx, by at zb. */
  soffit?: { bx: number; by: number; zb: number }
  /** Main ridge: height above zr, width; ornaments at its ends (height). */
  ridge?: { h: number; w: number; ornament?: number }
  /** Hip, rake and wall ridges: width and height. */
  hipRidge?: { w: number; h: number }
  /** How far the ridge ends rise above the middle (the ridge's sag). */
  ridgeSag?: number
}

/**
 * A curved Korean roof: tile surface, eave fascia, painted soffit, white
 * ridges, ridge-end ornaments and (paljak) red gable triangles.
 *
 * The four hip slopes are one parametrisation turned to each side: along a
 * slope, a = |u|^pow carries the corner's lift and flare, faded out towards
 * the gable foot by L = (1 - t)², so the hips themselves curve up at the
 * corners and the slopes meet exactly along them.
 */
export function roof(P: HanokParts, o: RoofOpts) {
  const cx = o.cx ?? 0, cy = o.cy ?? 0
  const pow = o.pow ?? 1.6, sag = o.sag ?? 0.5, th = o.th ?? 0.6
  const zr = o.zr ?? o.zg
  const U = [0, 0.3, 0.5, 0.64, 0.75, 0.84, 0.91, 0.96, 1]
  const us = [...U.slice(1).reverse().map((u) => -u), ...U]
  const T = o.kind === 'skirt' ? [0, 0.3, 0.65, 1] : [0, 0.14, 0.33, 0.57, 0.8, 1]
  const prof = (t: number) => (1 - sag) * t + sag * t * t
  // The sweep fades slowly up the slope, so the tile surface rises with the
  // eave to the very tip instead of the eave lifting off as a thin wing.
  const L = (t: number) => Math.pow(1 - t, 1.15)
  // A point on the hip band, in the front (-y) orientation: `A` along-half
  // at the eave, `B` out-distance at the eave; `A1`, `B1` at the gable foot.
  const band = (A: number, B: number, A1: number, B1: number) => (u: number, t: number): [number, number, number] => {
    // The upturn starts a third of the way out from the middle and grows
    // smoothly to the corner.
    const q = Math.max(0, (Math.abs(u) - 0.3) / 0.7), a = Math.pow(q, pow), l = L(t)
    const along = u * (A + (A1 - A) * t + o.flare * l * a)
    const out = B + (B1 - B) * t + o.flare * l * a
    return [along, -out, o.ze + (o.zg - o.ze) * prof(t) + o.lift * l * a]
  }
  // Turn a front-oriented (along, -out) into side k: 0 S, 1 E, 2 N, 3 W.
  const turn = (k: number, [x, y, z]: [number, number, number]): V3 => {
    const r = [[x, y], [-y, x], [-x, -y], [y, -x]][k]
    return [cx + r[0], cy + r[1], z]
  }
  const sides = [0, 1, 2, 3].map((k) => (k % 2 === 0 ? band(o.ex, o.ey, o.gx, o.gy) : band(o.ey, o.ex, o.gy, o.gx)))
  for (let k = 0; k < 4; k++) grid(P.roof, us.map((u) => T.map((t) => turn(k, sides[k](u, t)))))

  // Eave ring (counter-clockwise from above), fascia and soffit.
  const ring: V3[] = []
  for (let k = 0; k < 4; k++) for (const u of us.slice(0, -1)) ring.push(turn(k, sides[k](u, 0)))
  const n = ring.length
  const low = ring.map(([x, y, z]) => [x, y, z - th] as V3)
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    P.roof.quad(low[i], low[j], ring[j], ring[i])
  }
  if (o.soffit) {
    const { bx, by, zb } = o.soffit
    const inner: V3[] = []
    for (let k = 0; k < 4; k++) for (const u of us.slice(0, -1)) {
      const [x, y] = k % 2 === 0 ? [u * bx, -by] : [u * by, -bx]
      inner.push(turn(k, [x, y, zb]))
    }
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n
      P.teal.quad(low[i], inner[i], inner[j], low[j])
    }
  }

  // Hip ridges along the corner lines.
  const hr = o.hipRidge ?? { w: 0.36, h: 0.32 }
  for (let k = 0; k < 4; k++) {
    const line = (o.kind === 'skirt' ? [0, 0.3, 1] : [0, 0.14, 0.33, 0.6, 1]).map((t) => turn(k, sides[k](1, t)))
    // Run the ridge a little past the corner, rising, for the upturned tip.
    const a = line[0], b = line[1], d = norm(sub(a, b))
    const tip: V3 = [a[0] + d[0] * 0.1, a[1] + d[1] * 0.1, a[2] + d[2] * 0.1 + 0.05]
    bar(P.stone, [tip, ...line], hr.w, hr.h, 0.25, true, false)
  }

  const gx = o.gx, gy = o.gy
  if (o.kind === 'skirt') {
    // The white band where the skirt meets the upper storey's wall.
    const w: V3[] = [[cx - gx, cy - gy, o.zg], [cx + gx, cy - gy, o.zg], [cx + gx, cy + gy, o.zg], [cx - gx, cy + gy, o.zg]]
    for (let k = 0; k < 4; k++) bar(P.stone, [w[k], w[(k + 1) % 4]], hr.w, hr.h, 0.1, true, false)
    return
  }

  // Above the gable foot: front and back slopes up to the ridge.
  if (o.kind === 'paljak') {
    const TU = [0, 0.3, 0.62, 1]
    const top = (u: number, t: number): [number, number, number] => [u * gx, -gy * (1 - t), o.zg + (zr - o.zg) * (t * (1 - sag * 0.4) + sag * 0.4 * t * t)]
    for (const k of [0, 2]) grid(P.roof, [-1, -0.5, 0, 0.5, 1].map((u) => TU.map((t) => turn(k, top(u, t)))))
    // Gable triangles, red boarding, facing east and west.
    for (const k of [1, 3]) {
      P.red.tri(turn(k, [-gy, -gx, o.zg]), turn(k, [gy, -gx, o.zg]), turn(k, [0, -gx, zr]))
      // Rake ridges (naerim-maru) down both edges of the gable.
      for (const s of [-1, 1]) bar(P.stone, TU.map((t) => turn(k, [s * gy * (1 - t), -gx - 0.05, o.zg + (zr - o.zg) * (t * (1 - sag * 0.4) + sag * 0.4 * t * t)])), hr.w, hr.h, 0.1, true, false)
    }
  }
  // Main ridge, sagging a little, and its end ornaments.
  const R = o.ridge ?? { h: 1.0, w: 0.9 }
  const rs = o.ridgeSag ?? 0.25
  const rl = gx + (o.kind === 'paljak' ? 0.3 : 0)
  const rpts: V3[] = [-1, -0.6, -0.25, 0.25, 0.6, 1].map((s) => [cx + s * rl, cy, zr + rs * s * s])
  bar(P.stone, rpts, R.w, R.h, 0.6, true, false)
  if (R.ornament) for (const s of [-1, 1]) {
    // Chwidu: a block standing on the ridge end, its top hooked inwards.
    const x = cx + s * rl, z = zr + rs + R.h - 0.1, h = R.ornament
    const x0 = x - s * 1.2, x1 = x + s * 0.15
    box(P.roof, x0, cy - R.w * 0.75, z, x1, cy + R.w * 0.75, z + h * 0.7, 'b')
    box(P.roof, x0 + s * 0.2, cy - R.w * 0.6, z + h * 0.7, x0 + s * 0.85, cy + R.w * 0.6, z + h, 'b')
  }
}

// ---------------------------------------------------------------------------
// Walls, columns, brackets

export type Rect = { cx?: number; cy?: number; hx: number; hy: number }

/**
 * Column positions along x and y (from -h to +h, both ends included). The
 * perimeter columns of the rectangle are what the kit draws.
 */
export function perimeter(xs: number[], ys: number[]): [number, number][] {
  const out: [number, number][] = []
  const X0 = xs[0], X1 = xs[xs.length - 1], Y0 = ys[0], Y1 = ys[ys.length - 1]
  for (const x of xs) out.push([x, Y0], [x, Y1])
  for (const y of ys.slice(1, -1)) out.push([X0, y], [X1, y])
  return out
}

/** Red columns round the perimeter of the grid, on small granite bases. */
export function columns(P: HanokParts, xs: number[], ys: number[], z0: number, z1: number, r = 0.34, o: { cx?: number; cy?: number; base?: number; n?: number } = {}) {
  const cx = o.cx ?? 0, cy = o.cy ?? 0, base = o.base ?? 0
  for (const [x, y] of perimeter(xs, ys)) {
    prism(P.red, cx + x, cy + y, z0 + base, z1, r * 1.04, r * 0.96, o.n ?? 8)
    if (base > 0) box(P.stone, cx + x - r * 1.5, cy + y - r * 1.5, z0, cx + x + r * 1.5, cy + y + r * 1.5, z0 + base, 'b')
  }
}

export type BayFill = 'door' | 'window' | 'wall' | 'open' | 'high'
export type Side = 's' | 'e' | 'n' | 'w'

/**
 * A storey's walls on the column lines, with each bay filled as asked:
 * 'door' a tall lattice panel, 'window' a band of lattice windows high up,
 * 'high' a short clerestory band, 'wall' plain red, 'open' nothing.
 * `fill(side, bay, bays)` picks; bays count west→east on s/n, south→north on e/w.
 * The dancheong lintel (green) runs round the top from `zl` to z1.
 */
export function storey(P: HanokParts, xs: number[], ys: number[], z0: number, zl: number, z1: number, fill: (side: Side, bay: number, n: number) => BayFill, o: { cx?: number; cy?: number; panes?: number } = {}) {
  const cx = o.cx ?? 0, cy = o.cy ?? 0
  const X0 = xs[0], X1 = xs[xs.length - 1], Y0 = ys[0], Y1 = ys[ys.length - 1]
  const sides: [Side, number[], (s: number, z: number, out: number) => V3][] = [
    ['s', xs, (s, z, out) => [cx + s, cy + Y0 - out, z]],
    ['e', ys, (s, z, out) => [cx + X1 + out, cy + s, z]],
    ['n', xs, (s, z, out) => [cx + s, cy + Y1 + out, z]],
    ['w', ys, (s, z, out) => [cx + X0 - out, cy + s, z]],
  ]
  for (const [side, pos, at] of sides) {
    const n = pos.length - 1
    // Panels and walls on a side run with s increasing in the face's own
    // left→right as seen from outside: s side west→east, e south→north,
    // n east→west, w north→south. `quadOn` orders the corners to suit.
    const quadOn = (p: Part, s0: number, s1: number, z0_: number, z1_: number, out: number) => {
      const flip = side === 'n' || side === 'w'
      const [a, b] = flip ? [s1, s0] : [s0, s1]
      p.quad(at(a, z0_, out), at(b, z0_, out), at(b, z1_, out), at(a, z1_, out))
    }
    for (let i = 0; i < n; i++) {
      const s0 = pos[i], s1 = pos[i + 1], f = fill(side, i, n)
      // The lintel band over every bay.
      quadOn(P.green, s0, s1, zl, z1, 0.08)
      // Dancheong rhythm: the lintel's painted ends (meoricho) in red over the
      // green, a block at each end of every bay.
      const e = Math.min(1.1, (s1 - s0) * 0.18)
      quadOn(P.red, s0, s0 + e, zl + 0.05, z1 - 0.05, 0.12)
      quadOn(P.red, s1 - e, s1, zl + 0.05, z1 - 0.05, 0.12)
      if (f === 'open') continue
      quadOn(P.red, s0, s1, z0, zl, 0)
      const m = Math.min(0.45, (s1 - s0) * 0.08)
      const h = zl - z0
      if (f === 'door') {
        // Lattice doors in leaves, with the red frame showing between them.
        const k = o.panes ?? (s1 - s0 > 4.5 ? 4 : s1 - s0 > 2.6 ? 3 : 2)
        const w = (s1 - s0 - 2 * m - (k - 1) * 0.12) / k
        for (let q = 0; q < k; q++) {
          const a = s0 + m + q * (w + 0.12)
          quadOn(P.lattice, a, a + w, z0 + 0.35, zl - h * 0.2, 0.04)
        }
        // The transom over the doors.
        quadOn(P.lattice, s0 + m, s1 - m, zl - h * 0.16, zl - h * 0.05, 0.04)
      } else if (f === 'window') {
        const k = Math.max(2, Math.round((s1 - s0) / 1.6))
        const w = (s1 - s0 - 2 * m - (k - 1) * 0.3) / k
        for (let q = 0; q < k; q++) {
          const a = s0 + m + q * (w + 0.3)
          quadOn(P.lattice, a, a + w, z0 + h * 0.22, zl - h * 0.14, 0.04)
        }
      } else if (f === 'high') {
        quadOn(P.lattice, s0 + m, s1 - m, zl - h * 0.3, zl - h * 0.08, 0.04)
      }
    }
  }
}

/**
 * The bracket band (gongpo): a dark teal frieze on the wall line from z0 to
 * z1 with real 3D bracket sets standing out of it, each three stepped blocks
 * corbelling outwards and upwards, at every column and `per` between each
 * pair. `depth` is how far the top block reaches out.
 */
export function brackets(P: HanokParts, xs: number[], ys: number[], z0: number, z1: number, o: { cx?: number; cy?: number; per?: number; depth?: number; width?: number; tiers?: number } = {}) {
  const cx = o.cx ?? 0, cy = o.cy ?? 0, per = o.per ?? 1, D = o.depth ?? 1.4, W = o.width ?? 0.55, NT = o.tiers ?? 2
  const X0 = xs[0], X1 = xs[xs.length - 1], Y0 = ys[0], Y1 = ys[ys.length - 1]
  // Frieze: a plain box ring, its top covered by the soffit.
  box(P.teal, cx + X0, cy + Y0, z0, cx + X1, cy + Y1, z1, 'tb')
  const spots = (pos: number[]) => {
    const out: number[] = []
    for (let i = 0; i < pos.length - 1; i++) {
      out.push(pos[i])
      for (let k = 1; k <= per; k++) out.push(pos[i] + (pos[i + 1] - pos[i]) * k / (per + 1))
    }
    return out
  }
  const h = (z1 - z0) / NT
  // One set, facing outward along (nx, ny) from the wall point (x, y).
  const set = (x: number, y: number, nx: number, ny: number) => {
    for (let k = 0; k < NT; k++) {
      const d = 0.3 + (D - 0.3) * k / Math.max(1, NT - 1), w = W * (1 + 0.6 * k / Math.max(1, NT - 1))
      const za = z0 + k * h, zb = z0 + (k + 1) * h
      const tx = -ny, ty = nx
      const xa = x + tx * w / 2, ya = y + ty * w / 2, xb = x - tx * w / 2, yb = y - ty * w / 2
      box(P.green, Math.min(xa, xb, x + nx * d), Math.min(ya, yb, y + ny * d), za, Math.max(xa, xb, x + nx * d), Math.max(ya, yb, y + ny * d), zb, 't' + (nx > 0 ? 'w' : nx < 0 ? 'e' : ny > 0 ? 's' : 'n'), true)
    }
  }
  for (const x of [...spots(xs), X1]) { set(cx + x, cy + Y0, 0, -1); set(cx + x, cy + Y1, 0, 1) }
  for (const y of [...spots(ys), Y1]) { set(cx + X1, cy + y, 1, 0); set(cx + X0, cy + y, -1, 0) }
  // The underside of the band, from the wall out to the blocks' reach,
  // facing down: closes the gap between the frieze and the eaves soffit.
  const r = (d: number): V3[] => [[cx + X0 - d, cy + Y0 - d, z1], [cx + X1 + d, cy + Y0 - d, z1], [cx + X1 + d, cy + Y1 + d, z1], [cx + X0 - d, cy + Y1 + d, z1]]
  const a = r(0), b = r(D + 0.05)
  for (let k = 0; k < 4; k++) {
    const l = (k + 1) % 4
    P.teal.quad(b[k], a[k], a[l], b[l])
  }
}

// ---------------------------------------------------------------------------
// The stone platform (woldae / gidan)

export type Stair = { side: Side; at: number; width: number }
export type Tier = { x0: number; x1: number; y0: number; y1: number; z0: number; z1: number; rail?: boolean; stairs?: Stair[] }

/**
 * Stone platform tiers with balustrades and stairs. A balustrade is a heavy
 * top rail on posts every ~3 m, left open at each stair; a stair is a flight
 * of steps standing out from the tier's face.
 */
export function platform(P: HanokParts, tiers: Tier[], o: { post?: number; railH?: number } = {}) {
  const spacing = o.post ?? 3.5, RH = o.railH ?? 0.85
  for (const t of tiers) {
    bevelBox(P.stone, t.x0, t.y0, t.z0, t.x1, t.y1, t.z1, 0.12)
    const H = t.z1 - t.z0
    const steps = Math.max(2, Math.round(H / 0.33))
    for (const s of t.stairs ?? []) {
      const run = steps * 0.36
      for (let k = 0; k < steps; k++) {
        const zt = t.z0 + H * (k + 1) / steps, d = run - k * 0.36
        const a = s.at - s.width / 2, b = s.at + s.width / 2
        if (s.side === 's') box(P.stone, a, t.y0 - d, t.z0, b, t.y0, zt, 'bn')
        if (s.side === 'n') box(P.stone, a, t.y1, t.z0, b, t.y1 + d, zt, 'bs')
        if (s.side === 'e') box(P.stone, t.x1, a, t.z0, t.x1 + d, b, zt, 'bw')
        if (s.side === 'w') box(P.stone, t.x0 - d, a, t.z0, t.x0, b, zt, 'be')
      }
      // Cheek walls either side of a wide flight.
      if (s.width > 5) for (const e of [-1, 1]) {
        const c = s.at + e * (s.width / 2 + 0.25)
        if (s.side === 's') box(P.stone, c - 0.25, t.y0 - run, t.z0, c + 0.25, t.y0, t.z1 + 0.35, 'bn')
        if (s.side === 'n') box(P.stone, c - 0.25, t.y1, t.z0, c + 0.25, t.y1 + run, t.z1 + 0.35, 'bs')
      }
    }
    if (t.rail === false) continue
    // Balustrade spans per side, broken at the stairs.
    const inset = 0.35
    const sides: [Side, number, number, (s: number) => [number, number]][] = [
      ['s', t.x0 + inset, t.x1 - inset, (s) => [s, t.y0 + inset]],
      ['e', t.y0 + inset, t.y1 - inset, (s) => [t.x1 - inset, s]],
      ['n', t.x0 + inset, t.x1 - inset, (s) => [s, t.y1 - inset]],
      ['w', t.y0 + inset, t.y1 - inset, (s) => [t.x0 + inset, s]],
    ]
    for (const [side, a, b, at] of sides) {
      const gaps = (t.stairs ?? []).filter((s) => s.side === side).map((s) => [s.at - s.width / 2 - 0.3, s.at + s.width / 2 + 0.3]).sort((p, q) => p[0] - q[0])
      let spans: [number, number][] = [[a, b]]
      for (const [g0, g1] of gaps) spans = spans.flatMap(([s0, s1]) => (g1 <= s0 || g0 >= s1 ? [[s0, s1]] : [[s0, g0], [g1, s1]].filter(([p, q]) => q - p > 0.8)) as [number, number][])
      for (const [s0, s1] of spans) {
        const [x0, y0] = at(s0), [x1, y1] = at(s1)
        // Top rail, chunky, on squat supports, with taller posts at the ends.
        const zr = t.z1 + RH
        bar(P.stone, [[x0, y0, zr - 0.24], [x1, y1, zr - 0.24]], 0.34, 0.24, 0)
        const k = Math.max(1, Math.round((s1 - s0) / spacing))
        for (let q = 0; q <= k; q++) {
          const [x, y] = at(s0 + (s1 - s0) * q / k)
          const end = q === 0 || q === k
          const r = end ? 0.22 : 0.15
          box(P.stone, x - r, y - r, t.z1, x + r, y + r, end ? zr + 0.3 : zr - 0.24, end ? 'b' : 'bt', true)
        }
      }
    }
  }
}

/**
 * A hanging name board (hyeonpan) on the front (-y) of a building: a dark
 * board `w` × `h` in a red frame, its centre at (x, y, z), leaning out a
 * little at the top as the real boards do.
 */
export function hyeonpan(P: HanokParts, x: number, y: number, z: number, w: number, h: number, frame = 0.22) {
  const lean = 0.25, d = 0.18
  const at = (u: number, v: number, out: number): V3 => [x + u, y - out - lean * (v / h + 0.5), z + v]
  const slab = (p: Part, hw: number, hh: number, o0: number, o1: number) => {
    const A = at(-hw, -hh, o1), B = at(hw, -hh, o1), C = at(hw, hh, o1), D = at(-hw, hh, o1)
    const a = at(-hw, -hh, o0), b = at(hw, -hh, o0), c = at(hw, hh, o0), dd = at(-hw, hh, o0)
    p.quad(A, B, C, D)
    p.quad(b, B, A, a); p.quad(D, C, c, dd); p.quad(B, b, c, C); p.quad(a, A, D, dd)
  }
  slab(P.red, w / 2, h / 2, 0, d)
  slab(P.roof, w / 2 - frame, h / 2 - frame, d, d + 0.06)
}

// ---------------------------------------------------------------------------
// Gate bases (seokchuk) and walls

export type Arch = { c: number; w: number; h: number }

/**
 * A stone gate base from x0..x1, y0..y1, `h` high, pierced front (-y) and
 * back (+y) by semicircular-headed passages: each arch is `w` wide and `h`
 * to its crown at centre `c`. The passages are drawn `reveal` deep from
 * each face to red doors; the core between stays solid.
 */
export function gateBase(P: HanokParts, o: { x0: number; x1: number; y0: number; y1: number; h: number; arches: Arch[]; reveal?: number; seg?: number }) {
  const d = o.reveal ?? 1.4, seg = o.seg ?? 10
  const cx = (o.x0 + o.x1) / 2, cy = (o.y0 + o.y1) / 2
  const arches = [...o.arches].sort((a, b) => a.c - b.c)
  // One face, built as the front; `T` turns it to the back (a rotation, so
  // windings survive).
  const face = (T: (p: V3) => V3, mirror: boolean) => {
    const y = o.y0
    const q = (p: Part, a: V3, b: V3, c: V3, e: V3) => p.quad(T(a), T(b), T(c), T(e))
    const t = (p: Part, a: V3, b: V3, c: V3) => p.tri(T(a), T(b), T(c))
    const list = mirror ? arches.map((a) => ({ ...a, c: 2 * cx - a.c })).sort((a, b) => a.c - b.c) : arches
    let x = o.x0
    for (const a of list) {
      const r = a.w / 2, hs = a.h - r
      q(P.stone, [x, y, 0], [a.c - r, y, 0], [a.c - r, y, o.h], [x, y, o.h])
      const arc: V3[] = Array.from({ length: seg + 1 }, (_, i) => {
        const th = Math.PI * (1 - i / seg)
        return [a.c + r * Math.cos(th), y, hs + r * Math.sin(th)] as V3
      })
      for (let i = 0; i < seg; i++) {
        const A = arc[i], B = arc[i + 1]
        q(P.stone, A, B, [B[0], y, o.h], [A[0], y, o.h])
        // The vault, facing into the passage.
        q(P.stone, A, [A[0], y + d, A[2]], [B[0], y + d, B[2]], B)
        // The doors at the back of the reveal.
        t(P.red, [a.c, y + d, hs], B.map((v, k) => (k === 1 ? y + d : v)) as V3, A.map((v, k) => (k === 1 ? y + d : v)) as V3)
      }
      q(P.stone, [a.c - r, y, 0], [a.c - r, y + d, 0], [a.c - r, y + d, hs], [a.c - r, y, hs])
      q(P.stone, [a.c + r, y + d, 0], [a.c + r, y, 0], [a.c + r, y, hs], [a.c + r, y + d, hs])
      q(P.red, [a.c - r, y + d, 0], [a.c + r, y + d, 0], [a.c + r, y + d, hs], [a.c - r, y + d, hs])
      x = a.c + r
    }
    q(P.stone, [x, y, 0], [o.x1, y, 0], [o.x1, y, o.h], [x, y, o.h])
  }
  face((p) => p, false)
  face(([x, y, z]) => [2 * cx - x, 2 * cy - y, z], true)
  box(P.stone, o.x0, o.y0, 0, o.x1, o.y1, o.h, 'nsb')
}

/**
 * A parapet (yeojang) round x0..x1, y0..y1 on top of a base at z: dark
 * brick `h` high and `t` thick under a tile coping, with pale square plaques
 * on its outer faces every `plaque` metres (0 = none).
 */
export function parapet(P: HanokParts, x0: number, y0: number, x1: number, y1: number, z: number, h: number, t = 0.6, plaque = 2.2) {
  const zc = z + h - 0.25
  box(P.roof, x0, y0, z, x1, y0 + t, zc, 'b')
  box(P.roof, x0, y1 - t, z, x1, y1, zc, 'b')
  box(P.roof, x0, y0 + t, z, x0 + t, y1 - t, zc, 'bns')
  box(P.roof, x1 - t, y0 + t, z, x1, y1 - t, zc, 'bns')
  // Coping: a slightly wider dark cap.
  const c = 0.12
  box(P.roof, x0 - c, y0 - c, zc, x1 + c, y1 + c, zc + 0.25, 'b')
  if (plaque > 0) {
    const s = Math.min(0.75, (h - 0.25) * 0.65), zm = z + (h - 0.25) / 2
    const row = (a: number, b: number, put: (u: number) => void) => {
      const n = Math.floor((b - a) / plaque)
      for (let i = 0; i < n; i++) put(a + (b - a) * (i + 0.5) / n)
    }
    row(x0, x1, (u) => {
      P.stone.quad([u - s / 2, y0 - 0.03, zm - s / 2], [u + s / 2, y0 - 0.03, zm - s / 2], [u + s / 2, y0 - 0.03, zm + s / 2], [u - s / 2, y0 - 0.03, zm + s / 2])
      P.stone.quad([u + s / 2, y1 + 0.03, zm - s / 2], [u - s / 2, y1 + 0.03, zm - s / 2], [u - s / 2, y1 + 0.03, zm + s / 2], [u + s / 2, y1 + 0.03, zm + s / 2])
    })
    row(y0, y1, (u) => {
      P.stone.quad([x1 + 0.03, u - s / 2, zm - s / 2], [x1 + 0.03, u + s / 2, zm - s / 2], [x1 + 0.03, u + s / 2, zm + s / 2], [x1 + 0.03, u - s / 2, zm + s / 2])
      P.stone.quad([x0 - 0.03, u + s / 2, zm - s / 2], [x0 - 0.03, u - s / 2, zm - s / 2], [x0 - 0.03, u - s / 2, zm + s / 2], [x0 - 0.03, u + s / 2, zm + s / 2])
    })
  }
}

/**
 * A wall or wing block x0..x1, y0..y1 from z0 to h under a small gabled tile
 * coping running along its longer side, with a white ridge.
 */
export function copedWall(P: HanokParts, x0: number, y0: number, x1: number, y1: number, h: number, o: { z0?: number; rise?: number; over?: number; body?: keyof HanokParts } = {}) {
  const z0 = o.z0 ?? 0, rise = o.rise ?? 0.8, ov = o.over ?? 0.35
  box(P[o.body ?? 'stone'], x0, y0, z0, x1, y1, h, 'bt')
  const alongX = x1 - x0 >= y1 - y0
  const X0 = x0 - (alongX ? 0 : ov), X1 = x1 + (alongX ? 0 : ov), Y0 = y0 - (alongX ? ov : 0), Y1 = y1 + (alongX ? ov : 0)
  if (alongX) {
    const ym = (Y0 + Y1) / 2
    P.roof.quad([X0, Y0, h], [X1, Y0, h], [X1, ym, h + rise], [X0, ym, h + rise])
    P.roof.quad([X1, Y1, h], [X0, Y1, h], [X0, ym, h + rise], [X1, ym, h + rise])
    P.roof.tri([X1, Y0, h], [X1, Y1, h], [X1, ym, h + rise])
    P.roof.tri([X0, Y1, h], [X0, Y0, h], [X0, ym, h + rise])
    P.roof.quad([X0, Y1, h], [X1, Y1, h], [X1, Y0, h], [X0, Y0, h])
    bar(P.stone, [[X0, ym, h + rise - 0.1], [X1, ym, h + rise - 0.1]], 0.4, 0.3, 0, true, false)
  } else {
    const xm = (X0 + X1) / 2
    P.roof.quad([X1, Y0, h], [X1, Y1, h], [xm, Y1, h + rise], [xm, Y0, h + rise])
    P.roof.quad([X0, Y1, h], [X0, Y0, h], [xm, Y0, h + rise], [xm, Y1, h + rise])
    P.roof.tri([X0, Y0, h], [X1, Y0, h], [xm, Y0, h + rise])
    P.roof.tri([X1, Y1, h], [X0, Y1, h], [xm, Y1, h + rise])
    P.roof.quad([X0, Y1, h], [X1, Y1, h], [X1, Y0, h], [X0, Y0, h])
    bar(P.stone, [[xm, Y0, h + rise - 0.1], [xm, Y1, h + rise - 0.1]], 0.4, 0.3, 0, true, false)
  }
}

/**
 * Write the model (budget-checked by the shared `save`), after printing the
 * triangles per material. HANOK_DRAFT=1 lifts the budget for a look.
 */
export async function saveHanok(id: string, name: string, anchor: [number, number], bearing: number, parts: ReturnType<typeof hanokMaterials>, maxTri = 6500) {
  console.log(parts.map((x) => `${x.material.name} ${x.part.triangles}`).join(', '))
  if (!process.env.HANOK_DRAFT) return saveGlb(id, name, anchor, bearing, parts, maxTri)
  const glb = writeGlb(name, parts.filter((x) => x.part.triangles > 0), { frame: 'Y up, -Z north, +X east; metres; ground anchor', anchor, bearing })
  const out = new URL(`../models/${id}.glb`, import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`DRAFT ${out}: ${parts.reduce((s, x) => s + x.part.triangles, 0)} triangles, ${glb.length} bytes`)
}

// ===========================================================================
// Geunjeongjeon

function build() {
  const P = hanokParts()
  const Z0 = 2.72 // top of the upper woldae: the hall's floor

  // The woldae: lower and upper tiers.
  platform(P, [
    {
      x0: -28, x1: 28, y0: -29, y1: 19.5, z0: 0, z1: 1.45,
      stairs: [
        { side: 's', at: 0, width: 8.5 },
        { side: 'e', at: 0, width: 3.4 }, { side: 'w', at: 0, width: 3.4 },
        { side: 'e', at: -24, width: 3.0 }, { side: 'w', at: -24, width: 3.0 },
        { side: 'n', at: 0, width: 3.4 },
      ],
    },
    {
      x0: -23, x1: 23, y0: -21, y1: 14.5, z0: 1.45, z1: Z0,
      stairs: [
        { side: 's', at: 0, width: 8.5 },
        { side: 'e', at: 0, width: 3.4 }, { side: 'w', at: 0, width: 3.4 },
        { side: 'n', at: 0, width: 3.4 },
      ],
    },
  ])

  tally(P, 'woldae')
  // Lower storey: 5 × 5 bays, 30 × 20.5 m on the column centres.
  const xs = [-15.0, -9.8, -3.37, 3.37, 9.8, 15.0]
  const ys = [-10.25, -5.05, -1.68, 1.68, 5.05, 10.25]
  const L1 = Z0 + 4.4, L2 = Z0 + 5.1, B1 = Z0 + 7.0
  storey(P, xs, ys, Z0, L1, L2, () => 'door')
  columns(P, xs, ys, Z0, L2, 0.38)
  brackets(P, xs, ys, L2, B1, { per: 1, depth: 1.5, width: 0.6 })
  tally(P, 'lower storey')
  // The floor inside the walls closes the column box from below the skirt.
  box(P.stone, xs[0] - 0.4, ys[0] - 0.4, Z0, xs[5] + 0.4, ys[5] + 0.4, Z0 + 0.12, 'b')

  tally(P, 'floor')
  // Lower roof: a skirt from the eaves up to the upper storey's wall.
  const UX = 13.9, UY = 9.0, U0 = Z0 + 9.0
  roof(P, {
    kind: 'skirt', ex: 19.4, ey: 14.6, ze: Z0 + 6.6, gx: UX, gy: UY, zg: U0,
    lift: 2.2, flare: 1.3, sag: 0.35, th: 0.85,
    soffit: { bx: 15.0 + 1.5, by: 10.25 + 1.5, zb: B1 },
  })

  tally(P, 'lower roof')
  // Upper storey: windows in a red wall band, the lintel, brackets.
  const uxs = [-UX, -9.1, -3.1, 3.1, 9.1, UX]
  const uys = [-UY, -4.6, -1.5, 1.5, 4.6, UY]
  const UL1 = Z0 + 10.9, UL2 = Z0 + 11.5, UB1 = Z0 + 13.3
  storey(P, uxs, uys, U0 - 0.2, UL1, UL2, () => 'window')
  columns(P, uxs, uys, U0 - 0.2, UL2, 0.34)
  brackets(P, uxs, uys, UL2, UB1, { per: 1, depth: 1.4, width: 0.6 })

  tally(P, 'upper storey')
  // Upper roof: paljak.
  roof(P, {
    kind: 'paljak', ex: 18.1, ey: 13.3, ze: Z0 + 12.8, gx: 11.0, gy: 5.6, zg: Z0 + 16.7, zr: Z0 + 20.9,
    lift: 2.9, flare: 1.5, sag: 0.45, th: 0.9,
    soffit: { bx: UX + 1.4, by: UY + 1.4, zb: UB1 },
    ridge: { h: 1.1, w: 1.0, ornament: 1.7 }, ridgeSag: 0.3,
  })
  // The name board over the middle bay, in front of the upper brackets.
  hyeonpan(P, 0, -UY - 1.0, UL2 + 0.1, 3.6, 1.5)

  tally(P, 'upper roof')
  return hanokMaterials(P, { red: 0.75, teal: 0.6 })
}

if (import.meta.main) await saveHanok('seoul-geunjeongjeon', 'Geunjeongjeon', [37.5785445, 126.9769904], 2.3, build(), 6500)
