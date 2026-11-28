/**
 * Mosque-Madrasa of Sultan Hasan, Cairo (1356-63): procedural, CC0-1.0.
 * bun generators/cairo-sultan-hassan-mosque.ts
 *
 * Writes two levels of detail in the same frame and materials:
 * - models/cairo-sultan-hassan-mosque.glb (low, under 6,500 triangles);
 * - models/cairo-sultan-hassan-mosque.detail.glb (under 40,000): the
 *   muqarnas cornice as rows of corbelled cells, the mausoleum's
 *   fleur-de-lis cresting, the minarets' muqarnas balcony corbels and
 *   lantern columns, the portal's muqarnas hood in more tiers.
 *
 * Sultan Hasan only. The al-Rifa'i Mosque across the street to the
 * north-east (way/24908256) is a separate building and stays on the map.
 *
 * Plan: "Mosque-Madrasa of Sultan Hasan plan.svg" (براء, CC BY-SA 4.0),
 * read against its 40 m scale bar (11.4 px/m at 960 px): 152 m long
 * (150 m published), the mausoleum 30.3 m square projecting 26 m from the
 * qibla front, the open court 31.4 x 35.4 m with its four iwans (the
 * qibla iwan 20.9 m wide and 26.6 m deep), the minarets' round bases at
 * the qibla front's two corners, the portal block at the north corner,
 * turned out from the wall (17 degrees published), the fountain at the
 * court's centre. OSM's outline (way/24908268) is a coarse six-node
 * polygon, 33% larger than the plan; the plan is laid over it with its
 * qibla front on OSM's south-east edge and centred between OSM's long
 * sides. Frame: bearing 121.7, the normal of that edge (the qibla, south-
 * east): +y runs from the portal end to the mausoleum, +x is the
 * south-west side. Origin: the plan outline's centroid.
 *
 * Heights. Published (en.wikipedia "Mosque-Madrasa of Sultan Hasan"): the
 * walls 36 m, the portal 38 m, the southern minaret's summit 84 m above
 * the street of its time, a muqarnas cornice projecting 1.5 m; the long
 * sides' vertical rows of windows; the fleur-de-lis cresting kept round
 * the mausoleum. Measured from "Madrassa of Sultan Hassan & Al-Rifa'i
 * Mosque seen from the Citadel" (Dan, telephoto from the Citadel),
 * scaled by the minaret (84 m) on the 36 m cornice: the dome's base zone
 * 3 m over the cresting, the drum with its ring of pinnacles to 7.5 m
 * over it, the dome's crown 19.4 m over it, 20 m across; the southern
 * minaret's stages (octagonal shaft to the first balcony at 57.7-60.9 m,
 * the second stage to 66, the balcony 66-69, the eight-column lantern
 * 69.4-74.7, the bulb to 80.6, the finial to 84). The northern minaret
 * (rebuilt 1671-72) is shorter and slimmer; drawn 70 m (estimated from
 * "Al-Rifa'i & Sultan Hassan Mosques.jpg"). Iwan arches estimated from
 * the court views (the qibla iwan's apex 26 m above the court).
 *
 * Ground: the map's terrain (Mapterhorn z12; no finer tiles here) is a
 * smoothed hump about 8 m high across the footprint. y = 0 is the lowest
 * drawn ground under it; the walls rise from there to 37 m (36 m over the
 * street published); the court and iwan floors are drawn at 7.5 m (the
 * drawn ground under the court reaches 7.0 m); the uphill walls sink into
 * the hump. Elevation 0.
 *
 * Simplified or left out: the court's madrasa facades (windows only), the
 * portal's carved panels and inscriptions, the mausoleum's window
 * surrounds and medallions (drawn as panels), the street-side corbels,
 * the iwans' lamps and chains, the dikka.
 *
 * Colours sampled from the daylight photos (the Citadel telephoto and
 * the long side): a sandy ochre limestone (#b39a72 to #a88e66) for the
 * walls, roofs and dome alike, the cornice a shade lighter, the recesses'
 * reveals and backs the same stone in deep shadow (#7a6447), the window
 * grilles a dark slate (#56606a).
 *
 * Facades: the long sides' tall recessed bays are cut into the wall
 * (3.2 m wide, 2 m deep, every 6.4 m, from 6.6 m to under the cornice),
 * mostly plain shadowed stone with two or three grilled windows stacked
 * low on each bay's axis, as the long-side photo shows; the mausoleum's three faces each have two great
 * pointed recesses with paired windows, the central medallion and the
 * medallion band under the cornice. The cornice is drawn 3.2 m tall and
 * 2 m deep (1.5 m published) so it holds in the low model.
 *
 * Night: floodlit; stone carries `_FLOODLIGHT`, windows glow.
 *
 * Photos (Wikimedia Commons; all EVIDENCE):
 * - "Madrassa of Sultan Hassan & Al-Rifa'i Mosque seen from the Citadel, Cairo (2272266941).jpg", Dan from Brussels, CC BY-SA 2.0 (telephoto from the south-east; main ruler)
 *   https://commons.wikimedia.org/wiki/File:Madrassa_of_Sultan_Hassan_%26_Al-Rifa%27i_Mosque_seen_from_the_Citadel,_Cairo_(2272266941).jpg
 * - "Al-Rifa'i & Sultan Hassan Mosques.jpg", Hesham Ebaid, CC0 (from the Citadel)
 *   https://commons.wikimedia.org/wiki/File:Al-Rifa'i_%26_Sultan_Hassan_Mosques.jpg
 * - "Kairo Sultan Hassan Moschee BW 1.jpg", Berthold Werner, CC BY 3.0 (mausoleum front, south-east)
 *   https://commons.wikimedia.org/wiki/File:Kairo_Sultan_Hassan_Moschee_BW_1.jpg
 * - "Mosque-Madrassa of Sultan Hassan - Cairo, Egypt.jpg", David Berkowitz, CC BY 2.0 (the long side, windows, cornice, portal)
 *   https://commons.wikimedia.org/wiki/File:Mosque-Madrassa_of_Sultan_Hassan_-_Cairo,_Egypt.jpg
 * - "Sultan Hasan Main Entrance.jpg", Keladawy, CC BY-SA 4.0 (the portal)
 *   https://commons.wikimedia.org/wiki/File:Sultan_Hasan_Main_Entrance.jpg
 * - "Cairo, the Mosque of Sultan Hassan and the Ar-Rif (6201079985).jpg", Arian Zwegers, CC BY 2.0 (distant, from the north)
 *   https://commons.wikimedia.org/wiki/File:Cairo,_the_Mosque_of_Sultan_Hassan_and_the_Ar-Rif_(6201079985).jpg
 * - "Mosque-Madrasa of Sultan Hasan plan.svg", براء, CC BY-SA 4.0 (plan)
 *   https://commons.wikimedia.org/wiki/File:Mosque-Madrasa_of_Sultan_Hasan_plan.svg
 * Look-only: none.
 *
 * Doubts: OSM's outline disagrees with the plan (larger, and its sides
 * turned up to 8 degrees); the northern minaret's height; the iwan
 * heights; the court's walls and fountain from interior views only; the
 * north-west and north-east faces are drawn like the photographed long
 * side.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { TAU, Z, archOutline, box, dome, face, lathe, norm, obox, panel, prism, quad, rightOf, save, tri, type Mat, type XY } from './cairo-cairo-tower'
import { arcade, finial } from './cairo-muhammad-ali-mosque'
import { polyTris } from './berlin-oberbaum-bridge'
import { offset } from './sf-de-young'

// ───────────────────────────── Mamluk kit ─────────────────────────────────

const area = (r: XY[]) => r.reduce((s, a, i) => { const b = r[(i + 1) % r.length]; return s + a[0] * b[1] - b[0] * a[1] }, 0) / 2
export const ccw = (r: XY[]) => (area(r) < 0 ? [...r].reverse() : r)

/** Vertical walls round a counter-clockwise ring (outward), or a hole (`inward`). */
export function ringWalls(p: Part, ring: XY[], z0: number, z1: number, inward = false) {
  const r = inward ? [...ring].reverse() : ring
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    const n = norm([b[1] - a[1], -(b[0] - a[0]), 0])
    quad(p, [a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1], n)
  }
}
/** A flat face over a ring with holes, facing up (or down). */
export function slab(p: Part, ring: XY[], holes: XY[][], z: number, up = true) {
  for (const [a, b, c] of polyTris(ccw(ring), holes.map((h) => ccw(h).reverse()))) {
    if (up) tri(p, [a[0], a[1], z], [b[0], b[1], z], [c[0], c[1], z], Z)
    else tri(p, [a[0], a[1], z], [c[0], c[1], z], [b[0], b[1], z], [0, 0, -1])
  }
}

/** A recess cut into a wall face: from s0 to s1 along it, sill zb to head zt (an arch's apex). */
export type Recess = { s0: number; s1: number; zb: number; zt: number; kind: false | 'round' | 'pointed' | 'keel' }
/**
 * A straight wall face from A to B (outward to the right of A→B), z0 to
 * z1, with real recesses cut `depth` into it: the face round the holes,
 * the reveals (to `reveal`) and the recess backs (to `back`).
 */
export function recessedWall(face_: Part, reveal: Part, back: Part, A: XY, B: XY, z0: number, z1: number, holes: Recess[], depth: number, segs = 6) {
  const L = Math.hypot(B[0] - A[0], B[1] - A[1]), u: XY = [(B[0] - A[0]) / L, (B[1] - A[1]) / L], n: V3 = [u[1], -u[0], 0]
  const P = (sv: number, z: number, d = 0): V3 => [A[0] + u[0] * sv - n[0] * d, A[1] + u[1] * sv - n[1] * d, z]
  const rings = holes.map((h) => {
    const r = archOutline(h.s0, h.s1, h.zb, h.zt, h.kind, segs)
    return r.filter((q, i) => i === 0 || Math.hypot(q[0] - r[i - 1][0], q[1] - r[i - 1][1]) > 1e-6)
  })
  const outline: XY[] = [[0, z0], [L, z0], [L, z1], [0, z1]]
  // polyTris wants holes clockwise in (s, z)
  for (const [a, b, c] of polyTris(outline, rings.map((r) => [...r].reverse()))) tri(face_, P(a[0], a[1]), P(b[0], b[1]), P(c[0], c[1]), n)
  for (const r of rings) {
    for (let i = 0; i < r.length; i++) {
      const a = r[i], b = r[(i + 1) % r.length], ds = b[0] - a[0], dz = b[1] - a[1], l = Math.hypot(ds, dz) || 1
      // into the hole: left of a counter-clockwise ring's edge
      const ns = -dz / l, nz = ds / l
      const nn = norm([u[0] * ns, u[1] * ns, nz])
      quad(reveal, P(a[0], a[1]), P(b[0], b[1]), P(b[0], b[1], depth), P(a[0], a[1], depth), nn)
    }
    for (let i = 1; i < r.length - 1; i++) tri(back, P(r[0][0], r[0][1], depth), P(r[i][0], r[i][1], depth), P(r[i + 1][0], r[i + 1][1], depth), n)
  }
}

/**
 * A Mamluk muqarnas cornice round a counter-clockwise ring: `tiers` rows of
 * corbelling from z0 to z0 + h, each stepping out to `proj` in all. Low:
 * stepped bands (each with its soffit). Detail: each tier's front broken
 * into cells, every other one standing proud with its own soffit, so the
 * rows read as hanging niches.
 */
export function muqarnasCornice(p: Part, ring: XY[], z0: number, h: number, proj: number, tiers: number, detail: boolean, cell = 1.1) {
  let prev = ring
  for (let k = 0; k < tiers; k++) {
    const out = offset(ring, (proj * (k + 1)) / tiers)
    const za = z0 + (h * k) / tiers, zb = z0 + (h * (k + 1)) / tiers
    // soffit band between the previous ring and this one, facing down
    for (let i = 0; i < out.length; i++) {
      const j = (i + 1) % out.length
      quad(p, [prev[i][0], prev[i][1], za], [out[i][0], out[i][1], za], [out[j][0], out[j][1], za], [prev[j][0], prev[j][1], za], [0, 0, -1])
    }
    ringWalls(p, out, za, zb)
    if (detail) {
      // proud cells on this tier: small corbels hanging from its top
      const d = proj / tiers * 0.7
      for (let i = 0; i < out.length; i++) {
        const a = out[i], b = out[(i + 1) % out.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
        const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
        const nc = Math.floor(L / cell)
        for (let c = (k % 2); c < nc; c += 2) {
          const s0 = (L - nc * cell) / 2 + c * cell + 0.08, s1 = s0 + cell - 0.16
          const A: XY = [a[0] + u[0] * s0, a[1] + u[1] * s0], B: XY = [a[0] + u[0] * s1, a[1] + u[1] * s1]
          const zc = za + (zb - za) * 0.25
          // front, sloped niche soffit, sides
          const F0: V3 = [A[0] + n[0] * d, A[1] + n[1] * d, zc], F1: V3 = [B[0] + n[0] * d, B[1] + n[1] * d, zc]
          const T0: V3 = [A[0] + n[0] * d, A[1] + n[1] * d, zb], T1: V3 = [B[0] + n[0] * d, B[1] + n[1] * d, zb]
          quad(p, F0, F1, T1, T0, [n[0], n[1], 0])
          quad(p, [A[0], A[1], za], [B[0], B[1], za], F1, F0, norm([n[0], n[1], -1.4]))
          tri(p, [A[0], A[1], za], F0, T0, [-u[0], -u[1], 0]); tri(p, [A[0], A[1], za], T0, [A[0], A[1], zb], [-u[0], -u[1], 0])
          tri(p, [B[0], B[1], za], [B[0], B[1], zb], T1, [u[0], u[1], 0]); tri(p, [B[0], B[1], za], T1, F1, [u[0], u[1], 0])
          quad(p, T0, T1, [B[0], B[1], zb], [A[0], A[1], zb], Z)
        }
      }
    }
    prev = out
  }
  // the top of the cornice
  for (let i = 0; i < prev.length; i++) {
    const j = (i + 1) % prev.length
    quad(p, [ring[i][0], ring[i][1], z0 + h], [ring[j][0], ring[j][1], z0 + h], [prev[j][0], prev[j][1], z0 + h], [prev[i][0], prev[i][1], z0 + h], Z)
  }
}

/**
 * Cresting along a ring: merlons `w` wide every `step`, `h` tall and `t`
 * thick, standing on the wall's outer face line. Low: a block with a
 * pyramidal point. Detail: the fleur-de-lis (trefoil) outline: a stem,
 * two side lobes and a pointed head.
 */
export function cresting(p: Part, ring: XY[], z: number, w: number, h: number, t: number, step: number, detail: boolean) {
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
    const nm = Math.max(1, Math.floor(L / step))
    for (let m = 0; m < nm; m++) {
      const s = (L / nm) * (m + 0.5), c: XY = [a[0] + u[0] * s - n[0] * t / 2, a[1] + u[1] * s - n[1] * t / 2]
      if (!detail) {
        obox(p, null, c[0], c[1], u, w / 2, t / 2, z, z + h * 0.6)
        const q = (su: number, sv: number, zz: number): V3 => [c[0] + u[0] * su + n[0] * sv, c[1] + u[1] * su + n[1] * sv, zz]
        const top: V3 = [c[0], c[1], z + h]
        const cs = [q(-w / 2, -t / 2, z + h * 0.6), q(w / 2, -t / 2, z + h * 0.6), q(w / 2, t / 2, z + h * 0.6), q(-w / 2, t / 2, z + h * 0.6)]
        for (let k = 0; k < 4; k++) {
          const A = cs[k], B = cs[(k + 1) % 4], mid: V3 = [(A[0] + B[0]) / 2 - c[0], (A[1] + B[1]) / 2 - c[1], 0]
          tri(p, A, B, top, norm([mid[0], mid[1], 0.5]))
        }
      } else {
        // stem, lobes and head as small prisms
        obox(p, null, c[0], c[1], u, w * 0.32, t / 2, z, z + h * 0.45)
        for (const sg of [-1, 1]) {
          const lc: XY = [c[0] + u[0] * sg * w * 0.3, c[1] + u[1] * sg * w * 0.3]
          obox(p, p, lc[0], lc[1], u, w * 0.2, t / 2, z + h * 0.3, z + h * 0.62)
        }
        const q = (su: number, sv: number, zz: number): V3 => [c[0] + u[0] * su + n[0] * sv, c[1] + u[1] * su + n[1] * sv, zz]
        obox(p, null, c[0], c[1], u, w * 0.22, t / 2, z + h * 0.45, z + h * 0.7)
        const top: V3 = [c[0], c[1], z + h]
        const cs = [q(-w * 0.22, -t / 2, z + h * 0.7), q(w * 0.22, -t / 2, z + h * 0.7), q(w * 0.22, t / 2, z + h * 0.7), q(-w * 0.22, t / 2, z + h * 0.7)]
        for (let k = 0; k < 4; k++) {
          const A = cs[k], B = cs[(k + 1) % 4], mid: V3 = [(A[0] + B[0]) / 2 - c[0], (A[1] + B[1]) / 2 - c[1], 0]
          tri(p, A, B, top, norm([mid[0], mid[1], 0.4]))
        }
      }
    }
  }
}

/**
 * A Mamluk minaret stage set: `stages` from the bottom, each an
 * octagonal (or round) shaft with keel-arched niches, then a balcony on a
 * muqarnas corbel with its parapet; the top is a lantern of eight columns
 * under a ring and the bulb with its finial.
 */
export type MinaretStage = { r: number; z1: number; balc: number; niches?: boolean }
export function mamlukMinaret(stone: Part, trim: Part, dark: Part, gilt: Part, x: number, y: number, z0: number,
  stages: MinaretStage[], lantern: { r: number; z0: number; z1: number }, bulb: { r: number; top: number; tip: number }, detail: boolean, phase = Math.PI / 8, lowTiers = 2) {
  let z = z0
  for (const st of stages) {
    lathe(stone, x, y, [[st.r, z], [st.r, st.z1]], 8, { facet: true, phase })
    if (st.niches !== false) {
      for (let i = 0; i < 8; i += detail ? 1 : 2) {
        const t = phase + (TAU * (i + 0.5)) / 8, rr = st.r * Math.cos(Math.PI / 8)
        const h = Math.min(5.5, (st.z1 - z) * 0.4)
        panel(dark, [x + rr * Math.cos(t), y + rr * Math.sin(t), st.z1 - h - 1.2], [Math.cos(t), Math.sin(t), 0], st.r * 0.42, h, 'pointed', detail ? 4 : 2, 0.04)
      }
    }
    // muqarnas corbel (stepped, real 3D), the balcony floor and parapet
    const zb = st.z1, R = st.balc, tiers = detail ? 4 : lowTiers, ch = 1.8
    let prev = st.r
    for (let k = 1; k <= tiers; k++) {
      const rk = st.r + ((R - st.r) * k) / tiers, za = zb + (ch * (k - 1)) / tiers, zc = zb + (ch * k) / tiers
      lathe(trim, x, y, [[prev, za], [rk, za], [rk, zc]], detail ? 16 : 8, { facet: true, phase })
      prev = rk
    }
    lathe(trim, x, y, [[R, zb + ch], [R, zb + ch + 1.2], [R - 0.3, zb + ch + 1.2], [R - 0.3, zb + ch + 0.05]], detail ? 16 : 8, { facet: true, phase })
    if (detail) lathe(trim, x, y, [[R - 0.3, zb + ch + 1.2], [R - 0.3, zb + ch]], 16, { facet: true, phase, inside: true })
    z = zb + ch
  }
  // lantern: eight columns, an architrave ring with a little balcony, the bulb
  const L = lantern
  lathe(stone, x, y, [[L.r * 0.55, z], [L.r * 0.55, L.z1]], 8, { facet: true, phase }) // the core, seen between the columns
  for (let i = 0; i < 8; i += detail || lowTiers > 1 ? 1 : 2) {
    const t = phase + (TAU * i) / 8
    const cx = x + L.r * Math.cos(t), cy = y + L.r * Math.sin(t)
    box(stone, null, cx - 0.22, cx + 0.22, cy - 0.22, cy + 0.22, z, L.z1)
  }
  lathe(trim, x, y, [[L.r + 0.25, L.z1], [L.r + 0.6, L.z1 + 0.5], [L.r + 0.6, L.z1 + 0.9], [L.r * 0.5, L.z1 + 1.1]], detail ? 16 : 8, { facet: true, phase })
  const B = bulb, zb = L.z1 + 1.1
  lathe(stone, x, y, [[B.r * 0.45, zb], [B.r * 0.5, zb + 0.6], [B.r, zb + (B.top - zb) * 0.4], [B.r * 0.75, zb + (B.top - zb) * 0.75], [B.r * 0.2, B.top - 0.2], [0, B.top]], detail ? 16 : 8, { smooth: true, phase })
  finial(gilt, x, y, B.top - 0.2, B.tip, 0.25, detail ? 6 : 3)
}

/** Plan px (from the plan SVG at 960 px) to the model frame. */
const K = 11.4
export const PX = (px: number, py: number): XY => [(px - 572) / K + 4.26, -(py - 5) / K + 74.85]

// ───────────────────────────── the mosque ─────────────────────────────────

const F = 7.5 // court floor over the lowest drawn ground (see Ground)
const TOP = 37 // wall tops
const COR = 3.2 // cornice height
const CRT = 1.7 // cresting

function build(detail: boolean): Mat[] {
  const stone = new Part()
  const trim = new Part() // cornices, balconies, cresting: the same limestone, a touch lighter
  const plaster = new Part() // the dome and roofs
  const dark = new Part() // windows and niche openings
  const shade = new Part() // the recesses' sides and backs: the same stone in shadow
  const gilt = new Part() // finials, the fountain's dome
  const seg = (lo: number, hi: number) => (detail ? hi : lo)

  // ── The body: the outer outline round the court and its four iwans.
  const body = ccw([PX(218, 265), PX(290, 300), PX(870, 292), PX(940, 330), PX(945, 800), PX(630, 1745), PX(15, 1420), PX(130, 1250), PX(150, 1195)])
  const court = ccw([PX(387, 648), PX(745, 648), PX(745, 1052), PX(387, 1052)])
  // the iwans: x0, x1, depth edge (in px), the side they open on
  const iwanQ = { a: PX(448, 648), b: PX(686, 345) }
  const iwanL = { a: PX(230, 768), b: PX(387, 930) }
  const iwanR = { a: PX(745, 772), b: PX(905, 935) }
  const iwanE = { a: PX(455, 1052), b: PX(690, 1230) }
  const rectR = (a: XY, b: XY): XY[] => ccw([[a[0], a[1]], [b[0], a[1]], [b[0], b[1]], [a[0], b[1]]])
  const RT = TOP - COR
  // The outer walls: every long face carries the tall recessed bays (the
  // "vertical rows of windows"), 3.2 m wide and 1.6 m deep, from 6 m to
  // just under the cornice, with their windows grouped in the recess.
  const BAYD = 2.0
  for (let i = 0; i < body.length; i++) {
    const A = body[i], B = body[(i + 1) % body.length], Ln = Math.hypot(B[0] - A[0], B[1] - A[1])
    const isFront = A[1] > PX(0, 340)[1] && B[1] > PX(0, 340)[1] // the qibla front, behind the mausoleum
    if (Ln < 25 || isFront) { const n: V3 = norm([B[1] - A[1], -(B[0] - A[0]), 0]); quad(stone, [A[0], A[1], 0], [B[0], B[1], 0], [B[0], B[1], RT], [A[0], A[1], RT], n); continue }
    const nb = Math.round(Ln / 6.4), bw = Ln / nb, holes: Recess[] = []
    for (let k = 0; k < nb; k++) holes.push({ s0: k * bw + (bw - 3.2) / 2, s1: k * bw + (bw + 3.2) / 2, zb: 6.6, zt: RT - 2.2, kind: detail ? 'pointed' : false })
    recessedWall(stone, shade, shade, A, B, 0, RT, holes, BAYD, seg(4, 6))
    const u: XY = [(B[0] - A[0]) / Ln, (B[1] - A[1]) / Ln], n: V3 = [u[1], -u[0], 0]
    for (const h of holes) {
      const sc = (h.s0 + h.s1) / 2, c: XY = [A[0] + u[0] * sc - n[0] * BAYD, A[1] + u[1] * sc - n[1] * BAYD]
      // two (low) or three (detail) grilled windows stacked on the bay's
      // axis, low in the recess; the rest of the recess is plain shadowed stone
      const rows = seg(2, 3), zs = [h.zb + 1.2, h.zb + 7.4, h.zb + 13.6]
      for (let r = 0; r < rows; r++) panel(dark, [c[0], c[1], zs[r]], n, 2.2, 3.6, false, 2, 0.04)
    }
  }
  // walls of the court (four faces, broken where the iwans open) and of each iwan
  const courtFace = (A: XY, B: XY, gaps: [number, number][], n: V3) => {
    // a straight face from A to B with openings (s ranges) left open
    const L = Math.hypot(B[0] - A[0], B[1] - A[1]), u: XY = [(B[0] - A[0]) / L, (B[1] - A[1]) / L]
    let s = 0
    const at = (t: number, z: number): V3 => [A[0] + u[0] * t, A[1] + u[1] * t, z]
    for (const [g0, g1] of [...gaps, [L, L] as [number, number]].sort((p, q) => p[0] - q[0])) {
      if (g0 > s + 0.01) quad(stone, at(s, F), at(g0, F), at(g0, RT), at(s, RT), n)
      s = g1
    }
  }
  const [c0, c1, c2, c3] = [PX(387, 1052), PX(745, 1052), PX(745, 648), PX(387, 648)] // bl, br, tr, tl
  const W = (a: XY, b: XY) => Math.hypot(b[0] - a[0], b[1] - a[1])
  // court faces, normals into the court
  courtFace(c3, c2, [[W(c3, iwanQ.a), W(c3, [iwanQ.b[0], c3[1]])]], [0, -1, 0]) // top face (qibla side): from tl to tr, facing down (-y)
  courtFace(c1, c0, [[W(c1, [iwanE.b[0], c1[1]]), W(c1, [iwanE.a[0], c1[1]])]], [0, 1, 0])
  courtFace(c0, c3, [[W(c0, [c0[0], iwanL.b[1]]), W(c0, [c0[0], iwanL.a[1]])]], [1, 0, 0])
  courtFace(c2, c1, [[W(c2, [c2[0], iwanR.a[1]]), W(c2, [c2[0], iwanR.b[1]])]], [-1, 0, 0])
  // iwan walls: three sides of each, from the floor to the roof; the vault and its arch face
  const iwan = (r: XY[], open: 'up' | 'down' | 'left' | 'right', apex: number) => {
    const xs = r.map((q) => q[0]), ys = r.map((q) => q[1])
    const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys)
    // walls facing into the iwan
    if (open !== 'left') quad(stone, [x0, y1, F], [x0, y0, F], [x0, y0, RT], [x0, y1, RT], [1, 0, 0])
    if (open !== 'right') quad(stone, [x1, y0, F], [x1, y1, F], [x1, y1, RT], [x1, y0, RT], [-1, 0, 0])
    if (open !== 'down') quad(stone, [x0, y0, F], [x1, y0, F], [x1, y0, RT], [x0, y0, RT], [0, 1, 0])
    if (open !== 'up') quad(stone, [x1, y1, F], [x0, y1, F], [x0, y1, RT], [x1, y1, RT], [0, -1, 0])
    face(plaster, [[x0, y0, F], [x1, y0, F], [x1, y1, F], [x0, y1, F]], Z)
    // the arch face over the opening and the pointed vault behind it
    const span = open === 'up' || open === 'down' ? x1 - x0 : y1 - y0, depth = open === 'up' || open === 'down' ? y1 - y0 : x1 - x0
    const zs = apex - span * 0.85 * Math.sin(Math.acos((span / 2 - (span - span * 0.85)) / (span * 0.85)))
    let o: V3, u: V3, n: V3
    if (open === 'down') { o = [x0, y0, 0]; u = [1, 0, 0]; n = [0, -1, 0] }
    else if (open === 'up') { o = [x1, y1, 0]; u = [-1, 0, 0]; n = [0, 1, 0] }
    else if (open === 'right') { o = [x1, y0, 0]; u = [0, 1, 0]; n = [1, 0, 0] }
    else { o = [x0, y1, 0]; u = [0, -1, 0]; n = [-1, 0, 0] }
    arcade(stone, o, u, n, 1, span, 0.001, F, zs, RT, 'pointed', seg(6, 12), depth, { reveal: plaster })
    // a frame round the arch, proud of the face (the iwan's stone border)
    if (detail) {
      const P = (s: number, z: number, d: number): V3 => [o[0] + u[0] * s + n[0] * d, o[1] + u[1] * s + n[1] * d, z]
      for (const s of [0.0, span - 0.9]) quad(trim, P(s, F, 0.25), P(s + 0.9, F, 0.25), P(s + 0.9, RT, 0.25), P(s, RT, 0.25), n)
    }
  }
  iwan(rectR(iwanQ.a, iwanQ.b), 'down', F + 26)
  iwan(rectR(iwanE.a, iwanE.b), 'up', F + 20)
  iwan(rectR(iwanL.a, iwanL.b), 'right', F + 21)
  iwan(rectR(iwanR.a, iwanR.b), 'left', F + 21)
  // the court floor and the roof over everything but the court
  face(plaster, [[c0[0], c0[1], F], [c1[0], c1[1], F], [c2[0], c2[1], F], [c3[0], c3[1], F]], Z)
  slab(plaster, body, [court], RT)
  // the court's parapet: a low cornice band on its four walls
  if (detail) for (const [a, b] of [[c3, c2], [c2, c1], [c1, c0], [c0, c3]] as [XY, XY][]) {
    const n: V3 = norm([-(b[1] - a[1]), b[0] - a[0], 0])
    quad(trim, [a[0] + n[0] * 0.4, a[1] + n[1] * 0.4, RT - 1.2], [b[0] + n[0] * 0.4, b[1] + n[1] * 0.4, RT - 1.2], [b[0] + n[0] * 0.4, b[1] + n[1] * 0.4, RT], [a[0] + n[0] * 0.4, a[1] + n[1] * 0.4, RT], n)
  }
  // the outer muqarnas cornice (1.5 m published), parapet top
  muqarnasCornice(trim, body, RT, COR, 2.0, seg(3, 4), detail, 1.2)
  slab(plaster, offset(body, 2.0), [body], TOP)

  // ── The mausoleum: the square block, cornice, cresting, the transition
  // zone, the drum with its ring of pinnacles, the pointed dome.
  const mz = ccw([PX(400, 5), PX(745, 5), PX(745, 300), PX(400, 300)])
  // three exposed faces, each with two great pointed recesses holding a
  // pair of windows over a pair, a medallion between them, and the
  // medallion band under the cornice
  const [mx, my] = PX(572, 160)
  for (let i = 0; i < mz.length; i++) {
    const A = mz[i], B = mz[(i + 1) % mz.length], Ln = W(A, B)
    const n: V3 = norm([B[1] - A[1], -(B[0] - A[0]), 0])
    const toBody = n[1] < -0.9 // the face against the body
    if (toBody) { quad(stone, [A[0], A[1], 0], [B[0], B[1], 0], [B[0], B[1], RT], [A[0], A[1], RT], n); continue }
    const hw = 3.2, holes: Recess[] = [-1, 1].map((sg) => ({ s0: Ln / 2 + sg * 7.6 - hw, s1: Ln / 2 + sg * 7.6 + hw, zb: 1.5, zt: 18.5, kind: 'pointed' as const }))
    recessedWall(stone, shade, shade, A, B, 0, RT, holes, 1.0, seg(6, 10))
    const u: XY = [(B[0] - A[0]) / Ln, (B[1] - A[1]) / Ln]
    const at = (sv: number, d: number): XY => [A[0] + u[0] * sv - n[0] * d, A[1] + u[1] * sv - n[1] * d]
    for (const h of holes) for (const dx of [-1.4, 1.4]) {
      const c = at((h.s0 + h.s1) / 2 + dx, 1.0)
      panel(dark, [c[0], c[1], 2.4], n, 2.1, 5.2, 'pointed', seg(2, 6), 0.04)
      panel(dark, [c[0], c[1], 9.8], n, 2.0, 4.6, 'pointed', seg(2, 6), 0.04)
    }
    const cm = at(Ln / 2, 0)
    panel(trim, [cm[0], cm[1], 8.0], n, 4.6, 4.6, 'round', seg(6, 12), 0.12) // the medallion
    panel(dark, [cm[0], cm[1], 9.8], n, 1.2, 1.2, 'round', 4, 0.2)
    // the medallion band: a raised course with roundels
    const a0 = at(1.2, -0.25), a1 = at(Ln - 1.2, -0.25)
    quad(trim, [a0[0], a0[1], 21.0], [a1[0], a1[1], 21.0], [a1[0], a1[1], 24.4], [a0[0], a0[1], 24.4], n)
    quad(trim, [a0[0], a0[1], 21.0], [at(Ln - 1.2, 0)[0], at(Ln - 1.2, 0)[1], 21.0], [a1[0], a1[1], 21.0], [a0[0], a0[1], 21.0], [0, 0, -1])
    quad(trim, [a0[0], a0[1], 24.4], [a1[0], a1[1], 24.4], [at(Ln - 1.2, 0)[0], at(Ln - 1.2, 0)[1], 24.4], [at(1.2, 0)[0], at(1.2, 0)[1], 24.4], Z)
    for (let k = 0; k < 5; k++) {
      const c = at(Ln * (k + 0.5) / 5, -0.25)
      panel(stone, [c[0], c[1], 21.5], n, 2.4, 2.4, 'round', seg(6, 10), 0.08)
    }
  }
  muqarnasCornice(trim, mz, RT, COR, 2.0, seg(3, 4), detail, 1.2)
  slab(plaster, offset(mz, 2.0), [], TOP)
  cresting(trim, offset(mz, 1.9), TOP, 0.9, CRT, 0.45, seg(2.2, 1.35), detail)
  // transition zone: an octagonal stepped base with its shoulders, then the drum
  const TZ0 = TOP, TZ1 = TOP + 3.2, DR0 = TZ1, DR1 = TZ1 + 4.2, DRR = 11.2
  lathe(stone, mx, my, [[13.6, TZ0], [13.6, TZ1 - 1.2], [12.4, TZ1 - 1.0], [12.4, TZ1]], 8, { facet: true, phase: Math.PI / 8 })
  face(plaster, Array.from({ length: 8 }, (_, i) => [mx + 12.4 * Math.cos(Math.PI / 8 + (TAU * i) / 8), my + 12.4 * Math.sin(Math.PI / 8 + (TAU * i) / 8), TZ1] as V3), Z)
  lathe(stone, mx, my, [[DRR, DR0], [DRR, DR1]], seg(16, 24), { facet: true })
  for (let i = 0; i < 8; i++) {
    const t = (TAU * (i + 0.5)) / 8, rr = DRR * Math.cos(Math.PI / seg(16, 24))
    panel(dark, [mx + rr * Math.cos(t), my + rr * Math.sin(t), DR0 + 0.6], [Math.cos(t), Math.sin(t), 0], 1.4, 2.6, 'pointed', 4)
  }
  // the ring of pinnacles round the dome's foot
  for (let i = 0; i < 16; i++) {
    const t = (TAU * i) / 16, x = mx + (DRR + 0.1) * Math.cos(t), y = my + (DRR + 0.1) * Math.sin(t)
    lathe(stone, x, y, [[0.55, DR1 - 1.6], [0.55, DR1 + 0.4], [0.5, DR1 + 0.9], [0, DR1 + 1.9]], seg(4, 8), { smooth: detail })
  }
  // the dome: slightly pointed, 21.2 m across at its springing
  const DOME_R = 10.6, D0 = DR1, CROWN = TOP + 19.4
  const prof: [number, number][] = []
  const NR = seg(6, 12)
  for (let k = 0; k <= NR; k++) {
    // a two-centred profile: centres at ±0.18 R, radius 1.18 R
    const R = DOME_R * 1.18, e = DOME_R * 0.18, tMax = Math.acos(e / R)
    const t = (tMax * k) / NR
    prof.push([Math.max(0, R * Math.cos(t) - e), D0 + R * Math.sin(t) * ((CROWN - D0) / (R * Math.sin(tMax)))])
  }
  prof[NR][0] = 0
  lathe(plaster, mx, my, [[DRR, DR1], [DOME_R, DR1], ...prof.slice(0)], seg(16, 32), { smooth: true })
  finial(gilt, mx, my, CROWN - 0.3, CROWN + 3.2, 0.4, seg(4, 8))

  // ── Minarets at the qibla front's corners: the southern (+x) original,
  // 84 m; the northern rebuilt one slimmer, 70 m.
  const [sx, sy] = PX(900, 315), [nx, ny] = PX(254, 300)
  for (const [x, y] of [[sx, sy], [nx, ny]]) {
    lathe(stone, x, y, [[3.3, 0], [3.3, TOP + 1.0]], seg(10, 16), {})
    lathe(trim, x, y, [[3.3, TOP - 1.2], [3.7, TOP - 0.4], [3.7, TOP + 1.0], [3.0, TOP + 1.2]], seg(10, 16), {})
  }
  mamlukMinaret(stone, trim, dark, gilt, sx, sy, TOP + 1.2,
    [{ r: 3.6, z1: 57.4, balc: 4.4 }, { r: 3.0, z1: 66.0, balc: 3.8 }],
    { r: 2.3, z0: 69.0, z1: 74.6 }, { r: 1.9, top: 80.6, tip: 84.0 }, detail)
  mamlukMinaret(stone, trim, dark, gilt, nx, ny, TOP + 1.2,
    [{ r: 2.9, z1: 51.5, balc: 3.6 }, { r: 2.4, z1: 58.5, balc: 3.1 }],
    { r: 1.8, z0: 61.5, z1: 65.4 }, { r: 1.5, top: 69.0, tip: 71.5 }, detail)

  // ── The portal at the north corner: a block standing 1 m over the walls,
  // turned out from the wall, its deep recess under a muqarnas hood.
  {
    const A = PX(15, 1420), B = PX(140, 1250)
    const L = W(A, B), u: XY = [(B[0] - A[0]) / L, (B[1] - A[1]) / L]
    // outward normal: away from the body
    let n: XY = [-u[1], u[0]]
    const mid: XY = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2], cen = PX(500, 1100)
    if ((cen[0] - mid[0]) * n[0] + (cen[1] - mid[1]) * n[1] > 0) n = [-n[0], -n[1]]
    const T = 38, PW = 21, PD = 5.5, c: XY = [mid[0] + n[0] * (4.6 - PD / 2), mid[1] + n[1] * (4.6 - PD / 2)] // standing 4.6 m out of the wall, so the 4 m recess clears it
    const fc: XY = [c[0] + n[0] * PD / 2, c[1] + n[1] * PD / 2]
    const nn: V3 = [n[0], n[1], 0]
    const uu: V3 = [u[0], u[1], 0]
    const RW = 8.2, RD = 4.0, apex = 27
    {
      // the block: back, ends and top; its front is drawn round the recess
      const Q = (sU: number, sN: number, z: number): V3 => [c[0] + u[0] * sU + n[0] * sN, c[1] + u[1] * sU + n[1] * sN, z]
      const hw = PW / 2, hd = PD / 2
      quad(stone, Q(hw, -hd, 0), Q(-hw, -hd, 0), Q(-hw, -hd, T), Q(hw, -hd, T), [-n[0], -n[1], 0])
      quad(stone, Q(-hw, -hd, 0), Q(-hw, hd, 0), Q(-hw, hd, T), Q(-hw, -hd, T), [-u[0], -u[1], 0])
      quad(stone, Q(hw, hd, 0), Q(hw, -hd, 0), Q(hw, -hd, T), Q(hw, hd, T), [u[0], u[1], 0])
      face(plaster, [Q(-hw, -hd, T), Q(hw, -hd, T), Q(hw, hd, T), Q(-hw, hd, T)], Z)
      quad(stone, Q(-hw, hd, 0), Q(-RW / 2, hd, 0), Q(-RW / 2, hd, T), Q(-hw, hd, T), nn)
      quad(stone, Q(RW / 2, hd, 0), Q(hw, hd, 0), Q(hw, hd, T), Q(RW / 2, hd, T), nn)
      quad(stone, Q(-RW / 2, hd, apex + 2), Q(RW / 2, hd, apex + 2), Q(RW / 2, hd, T), Q(-RW / 2, hd, T), nn)
      quad(stone, Q(-RW / 2, hd, 0), Q(RW / 2, hd, 0), Q(RW / 2, hd, F - 2), Q(-RW / 2, hd, F - 2), nn)
      // the side panels' stone frames (proud bands either side of the recess)
      for (const sg of [-1, 1]) obox(trim, trim, c[0] + u[0] * sg * (RW / 2 + 0.6) + n[0] * (hd + 0.2), c[1] + u[1] * sg * (RW / 2 + 0.6) + n[1] * (hd + 0.2), u, 0.6, 0.2, F - 2, apex + 2)
    }
    // the cornice of the portal (stepped, 3D) and its recess
    muqarnasCornice(trim, ccw([[c[0] - u[0] * PW / 2 - n[0] * PD / 2, c[1] - u[1] * PW / 2 - n[1] * PD / 2], [c[0] + u[0] * PW / 2 - n[0] * PD / 2, c[1] + u[1] * PW / 2 - n[1] * PD / 2], [c[0] + u[0] * PW / 2 + n[0] * PD / 2, c[1] + u[1] * PW / 2 + n[1] * PD / 2], [c[0] - u[0] * PW / 2 + n[0] * PD / 2, c[1] - u[1] * PW / 2 + n[1] * PD / 2]]), T - 2.0, 1.6, 0.9, 2, detail, 1.0)
    // recess: an opening 8 m wide, 4 m deep, to a pointed head at 26 m
    const o: V3 = [fc[0] - uu[0] * RW / 2 + nn[0] * 0.01, fc[1] - uu[1] * RW / 2 + nn[1] * 0.01, 0]
    arcade(stone, o, uu, nn, 1, RW, 0.001, F - 2, apex - 6.2, apex + 2, 'pointed', seg(6, 12), RD, { reveal: plaster })
    // the recess's floor, back wall and the muqarnas hood: tiers of half rings
    const back: XY = [fc[0] - nn[0] * RD, fc[1] - nn[1] * RD]
    const P = (s: number, d: number, z: number): V3 => [fc[0] + uu[0] * s - nn[0] * d, fc[1] + uu[1] * s - nn[1] * d, z]
    quad(trim, P(-RW / 2, RD, F - 2), P(RW / 2, RD, F - 2), P(RW / 2, RD, apex), P(-RW / 2, RD, apex), nn)
    face(plaster, [P(-RW / 2, 0, F - 2), P(-RW / 2, RD, F - 2), P(RW / 2, RD, F - 2), P(RW / 2, 0, F - 2)], Z)
    const tiers = seg(3, 6), hz0 = apex - 9.5
    for (let k = 0; k < tiers; k++) {
      const r = (RW / 2) * (1 - k / (tiers + 0.5)), za = hz0 + (k * 7) / tiers, zb = hz0 + ((k + 1) * 7) / tiers
      const a0 = Math.atan2(nn[1], nn[0]) - Math.PI / 2
      lathe(trim, back[0], back[1], [[r, za], [r * 0.82, za + 0.2], [r * 0.82, zb]], seg(6, 10), { a0, a1: a0 + Math.PI, facet: true, inside: true })
    }
    // the door and the window over it, on the back wall
    panel(dark, [back[0], back[1], F - 2 + 0.9], nn, 3.0, 6.0, false, 2, 0.05)
    panel(dark, [back[0], back[1], F + 7.5], nn, 1.4, 2.0, false, 2, 0.05)
    // steps up to the portal (the street is lower here)
    for (let k = 0; k < seg(2, 5); k++) {
      const d = 1.0 + k * 0.9, z1 = F - 2 - (k * (F - 2 - 3.4)) / (seg(2, 5) - 1) // the drawn street here is about 3 m up
      obox(stone, plaster, fc[0] + nn[0] * d / 2, fc[1] + nn[1] * d / 2, u, RW / 2 + 1.5 + k * 0.4, d / 2, 0, z1)
    }
    // side panels' windows
    for (const s of [-1, 1]) for (const z of [9, 15, 21]) panel(dark, [fc[0] + uu[0] * s * 7.3, fc[1] + uu[1] * s * 7.3, z], nn, 1.4, 2.6, false, 2, 0.04)
  }

  // ── The ablution fountain in the court: eight columns, a bulbous
  // wooden dome on an octagonal entablature.
  {
    const [fx, fy] = PX(565, 850), rc = 4.2
    lathe(stone, fx, fy, [[4.9, F], [4.9, F + 0.5], [4.5, F + 0.5]], 8, { facet: true, phase: Math.PI / 8 })
    for (let i = 0; i < 8; i++) {
      const t = (TAU * i) / 8 + Math.PI / 8, x = fx + rc * Math.cos(t), y = fy + rc * Math.sin(t)
      box(stone, null, x - 0.3, x + 0.3, y - 0.3, y + 0.3, F + 0.5, F + 6.0)
    }
    lathe(trim, fx, fy, [[rc + 0.4, F + 6.0], [rc + 0.4, F + 7.2], [rc - 0.2, F + 7.4]], 8, { facet: true, phase: Math.PI / 8 })
    lathe(trim, fx, fy, [[rc + 0.4, F + 6.0], [rc - 0.6, F + 6.0]], 8, { facet: true, phase: Math.PI / 8, inside: true })
    lathe(gilt, fx, fy, [[rc - 0.2, F + 7.4], [rc + 0.3, F + 8.6], [rc - 0.3, F + 10.2], [1.6, F + 11.6], [0, F + 12.2]], seg(8, 16), { smooth: true, phase: Math.PI / 8 })
    finial(gilt, fx, fy, F + 12.0, F + 13.6, 0.18, 4)
  }

  const lit = (base: number) => (p: V3, n: V3): number => (n[2] > 0.85 ? 0.45 : 1) * base
  return [
    { part: stone, material: { ...finish('cairo-mamluk-limestone', 0xb59c74), floodlight: lit(0.9) } },
    { part: trim, material: { ...finish('cairo-mamluk-limestone-light', 0xc4ab83), floodlight: lit(0.9) } },
    { part: plaster, material: { ...finish('cairo-mamluk-dome', 0xbea57d), floodlight: lit(0.75) } },
    { part: dark, material: { ...PALETTE.window, color: 0x56606a } }, // dark window grilles
    { part: gilt, material: { ...PALETTE.metal, color: 0x9c8466 } },
    { part: shade, material: { ...finish('cairo-mamluk-limestone-shade', 0x7a6447), floodlight: lit(0.4) } },
  ]
}

if (import.meta.main) {
  const extras = { bearing: 121.7, osm: 'way/24908268', height: 84 }
  await save('cairo-sultan-hassan-mosque.glb', 'Mosque-Madrasa of Sultan Hasan', build(false), 6500, 250_000, extras)
  await save('cairo-sultan-hassan-mosque.detail.glb', 'Mosque-Madrasa of Sultan Hasan', build(true), 40_000, 1536 * 1024, extras)
}
