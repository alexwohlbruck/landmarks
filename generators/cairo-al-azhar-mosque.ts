/**
 * Al-Azhar Mosque, Cairo (970-72, with Fatimid, Mamluk and Ottoman
 * additions): procedural, CC0-1.0.
 * bun generators/cairo-al-azhar-mosque.ts
 *
 * Writes two levels of detail in the same frame and materials:
 * - models/cairo-al-azhar-mosque.glb (low, under 6,500 triangles);
 * - models/cairo-al-azhar-mosque.detail.glb (under 40,000): the court's
 *   keel-arched niches and medallions in relief, the stepped cresting's
 *   merlons in full, the minarets' muqarnas corbels in more tiers and
 *   their lantern columns, the ribbed dome's ribs.
 *
 * Frame: built along the mosque's axis and placed at bearing 125.8, the
 * qibla (south-east): +y runs from the Bab al-Muzayinin (north-west) to
 * the qibla wall, +x is the south-west side. The axis is the normal of
 * the OSM outline's long north-east side (way/24749059), which the floor
 * plan's walls follow. Origin: the outline's centroid.
 *
 * Plan: OSM's outline (a 89 x 121 m block with the Gawhariyya madrasa
 * bulging to the north-east); inside it, "Al-azhar floor plan.jpg"
 * (Nableezy and Robert Prazeres, CC BY-SA 4.0) scaled to the outline
 * (6.1 px/m; the plan's width and length agree with OSM within 1%): the
 * court 53.3 x 35.6 m; riwaqs round it 4.5 m deep; the Fatimid hall and
 * Katkhuda's extension behind it; the Bab al-Muzayinin passage on the
 * axis of the north-west side, with the Madrasa al-Aqbughawiyya to its
 * north-east and al-Taybarsiyya to its south-west; Bab al-Shurba and Bab
 * al-Sa'ayida at the qibla corners; Katkhuda's tomb by the latter.
 * Minarets: placed on OSM's round minaret footprints (ways 1312943041-44,
 * and way/1146736211 for the Bab al-Sa'ayida's), named from en.wikipedia
 * "Al-Azhar Mosque" and the court photos' order: Qaytbay's over the Bab al-Gindi on the court's north-west
 * side; al-Ghuri's double-headed one to its south-west; Aqbugha's at the
 * Aqbughawiyya beside the ribbed dome; Katkhuda's two at the Bab
 * al-Shurba and Bab al-Sa'ayida.
 *
 * Heights (estimated: no published figures were found). From "The
 * Al-Azhar Mosque in Cairo 2026 07.jpg" (CumaliOnal, from the court's
 * south corner), scaled by the arcade bays (4.1 m on the plan) and people:
 * arches spring 4.2 m, keel apexes 7 m, the court facade 11 m to its
 * cornice and 12.4 m to the cresting; al-Ghuri's minaret 48 m (its two
 * heads), Qaytbay's 44 m, Aqbugha's 36 m, the ribbed dome on its square
 * base to 27 m and 10.5 m across. Katkhuda's minarets 30 m (from
 * "Cairo - Islamic district - Al Azhar Mosque and University.JPG",
 * Daniel Mayer, from the street).
 *
 * Ground: the map's terrain here is Mapterhorn z12 only and folds about
 * 9 m across the footprint. y = 0 is the lowest drawn ground; the floor of
 * the court and the halls is drawn 5 m up (FLOOR; the drawn ground under
 * the court reaches 4.8 m), the outer walls run down to y = 0, the uphill
 * ones sink. Elevation 0.
 *
 * Minarets drawn 1.35 times their estimated girth, so the five read at
 * 200 and 80 px.
 *
 * Simplified or left out: the riwaqs' columns inside (the court arcade's
 * columns are drawn), the halls' interior; the stucco's carving (keel
 * niches and medallions are flat relief panels in the detail model); the
 * wooden mashrabiya balcony on the court facade; the outer facades'
 * windows are grouped panels; the Gawhariyya and Taybarsiyya as plain
 * blocks.
 *
 * Colours from the daylight photos: the outer stone a warm sandy
 * limestone; the court facade white plaster over its keel-arched arcade;
 * the minarets and the ribbed dome a darker, warmer brown-tan stone
 * (#a88d6a, sampled from the court photo), so the cluster stands out
 * against the pale roofs; the other domes a pale buff plaster.
 *
 * Night: floodlit (`_FLOODLIGHT`), windows and the riwaq's shade
 * openings dark.
 *
 * Photos (Wikimedia Commons; all EVIDENCE):
 * - "The Al-Azhar Mosque in Cairo 2026 07.jpg", CumaliOnal, CC BY-SA 4.0 (the court, north-west side and minarets; main ruler)
 *   https://commons.wikimedia.org/wiki/File:The_Al-Azhar_Mosque_in_Cairo_2026_07.jpg
 * - "The Al-Azhar Mosque in Cairo 2026 13.jpg", CumaliOnal, CC BY-SA 4.0 (the court)
 *   https://commons.wikimedia.org/wiki/File:The_Al-Azhar_Mosque_in_Cairo_2026_13.jpg
 * - "The Al-Azhar Mosque in Cairo 2026 21.jpg", CumaliOnal, CC BY-SA 4.0 (al-Ghuri's minaret, the dome)
 *   https://commons.wikimedia.org/wiki/File:The_Al-Azhar_Mosque_in_Cairo_2026_21.jpg
 * - "The Al-Azhar Mosque in Cairo 2026 01.jpg", CumaliOnal, CC BY-SA 4.0 (the outer facade and cresting)
 *   https://commons.wikimedia.org/wiki/File:The_Al-Azhar_Mosque_in_Cairo_2026_01.jpg
 * - "The Al-Azhar Mosque in Cairo 2026 08.jpg", CumaliOnal, CC BY-SA 4.0 (court arcade)
 *   https://commons.wikimedia.org/wiki/File:The_Al-Azhar_Mosque_in_Cairo_2026_08.jpg
 * - "Cairo - Islamic district - Al Azhar Mosque and University.JPG", Daniel Mayer, CC BY-SA 4.0 (from the street, north-west)
 *   https://commons.wikimedia.org/wiki/File:Cairo_-_Islamic_district_-_Al_Azhar_Mosque_and_University.JPG
 * - "Al-azhar floor plan.jpg", Nableezy, modified by Robert Prazeres, CC BY-SA 4.0 (plan)
 *   https://commons.wikimedia.org/wiki/File:Al-azhar_floor_plan.jpg
 * Look-only: none.
 *
 * Doubts: every height is estimated from photos (none published); the
 * ribbed dome is read as the Aqbughawiyya's (it stands with Aqbugha's
 * minaret in the court photos), its place between Qaytbay's and Aqbugha's
 * minarets is estimated from those photos;
 * the outer north-east and south-west faces and the Katkhuda extension's
 * roof were not photographed in the licensed set.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { TAU, Z, box, dome, face, lathe, norm, obox, panel, quad, save, tri, type Mat, type XY } from './cairo-cairo-tower'
import { arcade, finial } from './cairo-muhammad-ali-mosque'
import { ccw, mamlukMinaret, ringWalls, slab } from './cairo-sultan-hassan-mosque'
import { offset } from './sf-de-young'

const F = 5.0 // the floor of the court and halls over the lowest drawn ground (see Ground)
const WALL = 11, CREST = 1.4
const OX = 2.8, OY = 2.0 // the outline's centroid in the frame the plan was read in
/** Floor-plan px to the model frame. */
const PX = (px: number, py: number): XY => [(px - 255) / 6.1 - 41 - OX, -61 + (830 - py) / 6.1 - OY]
const L = (x: number, y: number): XY => [x - OX, y - OY]

/** Stepped (Fatimid) merlons along a ring: each a little stepped pyramid. */
function steppedCresting(p: Part, ring: XY[], z: number, w: number, h: number, t: number, step: number, detail: boolean) {
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length], Ln = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (Ln < 1) continue
    const u: XY = [(b[0] - a[0]) / Ln, (b[1] - a[1]) / Ln], n: XY = [u[1], -u[0]]
    const nm = Math.max(1, Math.floor(Ln / step))
    for (let m = 0; m < nm; m++) {
      const s = (Ln / nm) * (m + 0.5), c: XY = [a[0] + u[0] * s - n[0] * t / 2, a[1] + u[1] * s - n[1] * t / 2]
      if (!detail) {
        // low: a solid triangular merlon (front, back and two sloped ends)
        const q = (su: number, sv: number, zz: number): V3 => [c[0] + u[0] * su + n[0] * sv, c[1] + u[1] * su + n[1] * sv, zz]
        const hw = w / 2
        tri(p, q(-hw, t / 2, z), q(hw, t / 2, z), q(0, t / 2, z + h), [n[0], n[1], 0])
        tri(p, q(hw, -t / 2, z), q(-hw, -t / 2, z), q(0, -t / 2, z + h), [-n[0], -n[1], 0])
        quad(p, q(hw, t / 2, z), q(hw, -t / 2, z), q(0, -t / 2, z + h), q(0, t / 2, z + h), norm([u[0] * h, u[1] * h, hw]))
        quad(p, q(-hw, -t / 2, z), q(-hw, t / 2, z), q(0, t / 2, z + h), q(0, -t / 2, z + h), norm([-u[0] * h, -u[1] * h, hw]))
        continue
      }
      const steps = 2
      for (let k = 0; k < steps; k++) {
        const hw = (w / 2) * (1 - k / (steps + 0.6)), z0 = z + (h * 0.75 * k) / steps, z1 = z + (h * 0.75 * (k + 1)) / steps
        obox(p, k === steps - 1 ? null : p, c[0], c[1], u, hw, t / 2, z0, z1)
      }
      // the point
      const hw = (w / 2) * (1 - (steps - 1) / (steps + 0.6)), zt = z + h * 0.75
      const q = (su: number, sv: number): V3 => [c[0] + u[0] * su + n[0] * sv, c[1] + u[1] * su + n[1] * sv, zt]
      const cs = [q(-hw, -t / 2), q(hw, -t / 2), q(hw, t / 2), q(-hw, t / 2)], top: V3 = [c[0], c[1], z + h]
      for (let k = 0; k < 4; k++) {
        const A = cs[k], B = cs[(k + 1) % 4]
        tri(p, A, B, top, norm([(A[0] + B[0]) / 2 - c[0], (A[1] + B[1]) / 2 - c[1], 0.5]))
      }
    }
  }
}

/** A square Mamluk minaret stage with keel niches on each face. */
function squareStage(stone: Part, dark: Part, x: number, y: number, hw: number, z0: number, z1: number, niche: boolean, detail: boolean) {
  box(stone, null, x - hw, x + hw, y - hw, y + hw, z0, z1, detail ? 0.15 : 0)
  if (!niche) return
  for (const [n, c] of [[[1, 0, 0], [x + hw, y]], [[-1, 0, 0], [x - hw, y]], [[0, 1, 0], [x, y + hw]], [[0, -1, 0], [x, y - hw]]] as [V3, XY][]) {
    panel(dark, [c[0], c[1], z0 + (z1 - z0) * 0.3], n, hw * 0.55, (z1 - z0) * 0.45, 'keel', detail ? 6 : 2, 0.04)
  }
}
/** A square balcony on a stepped (muqarnas) corbel. */
function squareBalcony(trim: Part, x: number, y: number, hw: number, out: number, z: number, detail: boolean) {
  const tiers = detail ? 3 : 2
  for (let k = 1; k <= tiers; k++) {
    const r = hw + (out * k) / tiers, za = z + (1.4 * (k - 1)) / tiers, zb = z + (1.4 * k) / tiers
    box(trim, trim, x - r, x + r, y - r, y + r, za, zb)
  }
  const R = hw + out
  // parapet: four low walls
  for (const [x0, x1, y0, y1] of [[x - R, x + R, y - R, y - R + 0.25], [x - R, x + R, y + R - 0.25, y + R], [x - R, x - R + 0.25, y - R, y + R], [x + R - 0.25, x + R, y - R, y + R]]) box(trim, trim, x0, x1, y0, y1, z + 1.4, z + 2.4)
}

function build(detail: boolean): Mat[] {
  const stone = new Part() // the outer limestone
  const plaster = new Part() // the court's plastered walls, roofs, domes
  const trim = new Part() // cornices, balconies, the court columns
  const dark = new Part() // windows, niches, the riwaq's shade
  const mstone = new Part() // the minarets' and the ribbed dome's darker, warmer stone
  const gilt = new Part() // finials
  const seg = (lo: number, hi: number) => (detail ? hi : lo)

  // ── The outline (OSM), the court hole, the walls and the roof.
  const outline = ccw([[-39.0, -61.2], [48.3, -60.0], [48.3, 54.0], [39.9, 65.8], [33.3, 65.3], [-39.0, 59.1], [-48.0, 59.3], [-49.4, 51.7], [-41.0, 50.3], [-42.3, 44.1], [-54.9, 42.0], [-55.4, 28.3], [-40.7, 27.5], [-41.4, -33.5], [-38.2, -34.7]].map(([x, y]) => L(x, y)))
  const [cx0, cy0] = PX(360, 635), [cx1, cy1] = PX(685, 418)
  const court = ccw([[cx0, cy0], [cx1, cy0], [cx1, cy1], [cx0, cy1]])
  const TOP = F + WALL
  ringWalls(stone, outline, 0, TOP)
  slab(stone, outline, [court], TOP) // the roofs: dusty stone-coloured plaster
  steppedCresting(stone, offset(outline, -0.1), TOP, 1.0, CREST, 0.4, seg(5.0, 1.8), detail)
  // outer windows: grouped panels along the long walls
  for (let i = 0; i < outline.length; i++) {
    const a = outline[i], b = outline[(i + 1) % outline.length], Ln = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (Ln < 12) continue
    const u: XY = [(b[0] - a[0]) / Ln, (b[1] - a[1]) / Ln], n: V3 = [u[1], -u[0], 0], nw = Math.floor(Ln / seg(17, 6))
    for (let k = 0; k < nw; k++) {
      const s = (Ln * (k + 0.5)) / nw
      panel(dark, [a[0] + u[0] * s, a[1] + u[1] * s, F + 5.2], n, 1.5, 3.2, 'pointed', seg(2, 4))
      if (detail) panel(dark, [a[0] + u[0] * s, a[1] + u[1] * s, F + 1.0], n, 1.5, 2.4, false)
    }
  }

  // ── The court: the floor, the four arcades of keel arches on columns,
  // the plastered wall over them, cornice and cresting; the riwaqs behind
  // (a back wall in shade and a ceiling) so the arches read deep.
  face(plaster, court.map(([x, y]) => [x, y, F] as V3), Z)
  const RD = 4.5, SP = F + 4.2, AP = F + 7.0
  const back = offset(court, RD)
  ringWalls(dark, [...back].reverse(), F, AP + 0.5) // facing the court
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    quad(plaster, [court[i][0], court[i][1], AP + 0.5], [back[i][0], back[i][1], AP + 0.5], [back[j][0], back[j][1], AP + 0.5], [court[j][0], court[j][1], AP + 0.5], [0, 0, -1])
    face(plaster, [[court[i][0], court[i][1], F], [court[j][0], court[j][1], F], [back[j][0], back[j][1], F], [back[i][0], back[i][1], F]], Z)
  }
  // the arcade faces: court ring edges, facing into the court
  for (let i = 0; i < 4; i++) {
    const a = court[(i + 1) % 4], b = court[i] // reversed: the face looks into the court
    const Ln = Math.hypot(b[0] - a[0], b[1] - a[1]), u: V3 = [(b[0] - a[0]) / Ln, (b[1] - a[1]) / Ln, 0]
    const n: V3 = [u[1], -u[0], 0]
    const bays = Math.round(Ln / 4.1), bw = Ln / bays
    arcade(plaster, [a[0], a[1], 0], u, n, bays, bw, 0.45, F, SP, TOP, 'keel', seg(3, 8), 0.7, { reveal: plaster, noPierReveal: !detail })
    // columns and capitals under the arches (detail), the cornice band, keel niches and medallions
    if (detail) {
      for (let k = 1; k < bays; k++) {
        const s = k * bw, x = a[0] + u[0] * s - n[0] * 0.35, y = a[1] + u[1] * s - n[1] * 0.35
        lathe(trim, x, y, [[0.3, F], [0.3, F + 0.4], [0.2, F + 0.5], [0.2, SP - 0.5], [0.32, SP - 0.2], [0.34, SP]], 6)
      }
      for (let k = 0; k < bays; k++) {
        const s = (k + 0.5) * bw, at: V3 = [a[0] + u[0] * s, a[1] + u[1] * s, 0]
        if (k % 2 === 0) panel(trim, [at[0], at[1], AP + 0.7], n, 1.3, 2.4, 'keel', 6, 0.08)
        else panel(trim, [at[0], at[1], AP + 1.0], n, 1.5, 1.5, 'round', 8, 0.08)
      }
    }
    const P = (s: number, z: number, d: number): V3 => [a[0] + u[0] * s + n[0] * d, a[1] + u[1] * s + n[1] * d, z]
    quad(trim, P(0, TOP - 1.1, 0.3), P(Ln, TOP - 1.1, 0.3), P(Ln, TOP - 0.3, 0.3), P(0, TOP - 0.3, 0.3), n)
    quad(trim, P(0, TOP - 1.1, 0), P(Ln, TOP - 1.1, 0), P(Ln, TOP - 1.1, 0.3), P(0, TOP - 1.1, 0.3), [0, 0, -1])
    quad(trim, P(0, TOP - 0.3, 0.3), P(Ln, TOP - 0.3, 0.3), P(Ln, TOP - 0.3, 0), P(0, TOP - 0.3, 0), Z)
  }
  steppedCresting(trim, [...court].reverse(), TOP, 1.0, CREST, 0.4, seg(4.6, 1.5), detail)

  // ── The Fatimid dome at the head of the transept (on the court side of
  // the prayer hall), and the domes of Katkhuda's tomb and the Gawhariyya.
  const smallDome = (x: number, y: number, r: number, z: number, drum: number, ribbed = false) => {
    const st = ribbed ? mstone : stone
    box(st, plaster, x - r - 0.6, x + r + 0.6, y - r - 0.6, y + r + 0.6, TOP - 1, z, 0.3)
    lathe(st, x, y, [[r, z], [r, z + drum]], 8, { facet: true, phase: Math.PI / 8 })
    for (let i = 0; i < 8; i += detail ? 1 : 2) {
      const t = Math.PI / 8 + (TAU * (i + 0.5)) / 8 - Math.PI / 8, rr = r * Math.cos(Math.PI / 8)
      panel(dark, [x + rr * Math.cos(t), y + rr * Math.sin(t), z + drum * 0.2], [Math.cos(t), Math.sin(t), 0], r * 0.35, drum * 0.6, 'keel', 4, 0.04)
    }
    if (ribbed) {
      // a ribbed (melon) dome: lobes as raised ridges on a pointed profile
      const NL = seg(12, 24), prof = (t: number, k: number): [number, number] => {
        const rr = r * (0.98 - 0.02 * k) * Math.cos(t * Math.PI / 2) ** 0.85, zz = z + drum + r * 1.15 * Math.sin(t * Math.PI / 2)
        return [rr, zz]
      }
      const rings = seg(3, 8)
      for (let i = 0; i < NL; i++) {
        const t0 = (TAU * i) / NL, t1 = (TAU * (i + 1)) / NL, tm = (t0 + t1) / 2
        for (let k = 0; k < rings; k++) {
          const [ra, za] = prof(k / rings, 0), [rb, zb] = prof((k + 1) / rings, 0)
          const bulge = 1.13
          const A: V3 = [x + ra * Math.cos(t0), y + ra * Math.sin(t0), za], B: V3 = [x + ra * bulge * Math.cos(tm), y + ra * bulge * Math.sin(tm), za]
          const C: V3 = [x + ra * Math.cos(t1), y + ra * Math.sin(t1), za]
          const D: V3 = [x + rb * Math.cos(t0), y + rb * Math.sin(t0), zb], E: V3 = [x + rb * bulge * Math.cos(tm), y + rb * bulge * Math.sin(tm), zb]
          const G: V3 = [x + rb * Math.cos(t1), y + rb * Math.sin(t1), zb]
          const up = (zb - za) / (r || 1)
          const nL = norm([Math.cos((t0 + tm) / 2), Math.sin((t0 + tm) / 2), up]), nR = norm([Math.cos((tm + t1) / 2), Math.sin((tm + t1) / 2), up])
          if (rb < 1e-6) { tri(mstone, A, B, D, nL); tri(mstone, B, C, D, nR) }
          else { quad(mstone, A, B, E, D, nL); quad(mstone, B, C, G, E, nR) }
        }
      }
      finial(gilt, x, y, z + drum + r * 1.12, z + drum + r * 1.15 + 2.2, 0.3, seg(3, 6))
    } else {
      dome(plaster, x, y, r, z + drum, r * 0.95, seg(10, 16), seg(3, 6), Math.PI / 8)
      finial(gilt, x, y, z + drum + r * 0.9, z + drum + r + 1.6, 0.25, seg(3, 6))
    }
  }
  { const [x, y] = PX(517, 395); smallDome(x, y, 3.2, TOP + 0.6, 2.0) }
  { const [x, y] = PX(712, 168); smallDome(x, y, 4.0, TOP + 1.5, 2.2) }
  { const [x, y] = PX(165, 232); smallDome(x, y, 3.4, TOP + 0.8, 1.8) }
  // the Aqbughawiyya's ribbed dome on its square base
  { const [x, y] = L(-5.5, -44.5); smallDome(x, y, 5.0, F + 15.5, 2.8, true) }

  // ── The Bab al-Muzayinin: a raised gate block on the north-west wall
  // with two recessed, round-headed doors; the small domed turret on it.
  {
    const [gx, gy] = PX(510, 830), gw = 7.5
    box(stone, plaster, gx - gw, gx + gw, gy - 0.8, gy + 3.0, 0, TOP + 2.2, 0.2)
    steppedCresting(stone, ccw([[gx - gw, gy - 0.8], [gx + gw, gy - 0.8], [gx + gw, gy + 3.0], [gx - gw, gy + 3.0]]), TOP + 2.2, 0.9, 1.2, 0.35, seg(2.6, 1.6), detail)
    for (const s of [-3.0, 3.0]) {
      panel(trim, [gx + s, gy - 0.8, F - 0.2], [0, -1, 0], 4.6, 9.0, 'round', seg(6, 10), 0.08)
      panel(dark, [gx + s, gy - 0.8, F - 0.2], [0, -1, 0], 3.0, 6.8, 'round', seg(6, 10), 0.14)
    }
    // the little lantern turret over the gate (the photos show it between the minarets)
    const [tx, ty] = PX(585, 690)
    squareStage(stone, dark, tx, ty, 1.6, TOP, TOP + 7.5, true, detail)
    for (const s of [-0.8, 0.8]) {
      lathe(stone, tx + s, ty, [[0.55, TOP + 7.5], [0.7, TOP + 8.2], [0.3, TOP + 9.2], [0, TOP + 9.6]], 6, { smooth: true })
    }
  }

  // Minarets are drawn 1.35 times their real girth so the cluster holds at
  // phone size (as the Istanbul minarets are).
  // ── Minarets.
  // Qaytbay's (1483): square base, octagonal shaft, three balconies on
  // muqarnas, the lantern of eight pillars and the bulb.
  { const [x, y] = L(1.2, -36.7) // OSM way/1312943042
    squareStage(mstone, dark, x, y, 3.5, 0, TOP + 3.0, false, detail)
    mamlukMinaret(mstone, mstone, dark, gilt, x, y, TOP + 3.0,
      [{ r: 3.24, z1: F + 22.5, balc: 4.19 }, { r: 2.97, z1: F + 29.5, balc: 3.92 }],
      { r: 2.16, z0: F + 33.5, z1: F + 36.0 }, { r: 1.82, top: F + 40.2, tip: F + 44.0 }, detail, Math.PI / 8, 1) }
  // al-Ghuri's (1510): square stages, two balconies, the two heads.
  { const [x, y] = L(21.2, -37.1), hw = 3.4 // OSM way/1312943041
    squareStage(mstone, dark, x, y, hw, 0, F + 25.0, true, detail)
    squareBalcony(mstone, x, y, hw, 0.8, F + 25.0, detail)
    squareStage(mstone, dark, x, y, hw - 0.3, F + 26.4, F + 33.5, true, detail)
    squareBalcony(mstone, x, y, hw - 0.3, 0.7, F + 33.5, detail)
    for (const s of [-1, 1]) {
      // each head: a rectangular lantern of piers, a cap, the bulb and finial
      const hx = x + s * 1.5
      for (const [dx, dy] of [[-1.05, -1.25], [1.05, -1.25], [1.05, 1.25], [-1.05, 1.25]]) box(mstone, null, hx + dx - 0.2, hx + dx + 0.2, y + dy - 0.2, y + dy + 0.2, F + 34.9, F + 39.2)
      box(mstone, null, hx - 0.75, hx + 0.75, y - 0.8, y + 0.8, F + 34.9, F + 39.2)
      box(mstone, mstone, hx - 1.45, hx + 1.45, y - 1.65, y + 1.65, F + 39.2, F + 39.8)
      lathe(mstone, hx, y, [[0.75, F + 39.8], [1.3, F + 41.0], [1.15, F + 42.2], [0.4, F + 43.2], [0, F + 43.5]], seg(6, 12), { smooth: true })
      finial(gilt, hx, y, F + 43.3, F + 45.2, 0.16, seg(3, 4))
    }
  }
  // Aqbugha's (1340, top rebuilt): a slimmer octagonal minaret.
  { const [x, y] = L(-11.8, -50.5) // OSM way/1312943043
    squareStage(mstone, dark, x, y, 2.8, 0, TOP + 2.0, false, detail)
    mamlukMinaret(mstone, mstone, dark, gilt, x, y, TOP + 2.0,
      [{ r: 2.56, z1: F + 20.5, balc: 3.38 }, { r: 2.29, z1: F + 25.5, balc: 3.10 }],
      { r: 1.69, z0: F + 28.5, z1: F + 30.5 }, { r: 1.42, top: F + 33.4, tip: F + 36.0 }, detail, Math.PI / 8, 1) }
  // Katkhuda's two (1753) at the Bab al-Shurba and the Bab al-Sa'ayida.
  for (const [ox, oy] of [[-13.1, 55.6], [36.4, 67.7]]) { // OSM way/1312943044, way/1146736211
    const [x, y] = L(ox, oy)
    squareStage(mstone, dark, x, y, 2.6, 0, TOP + 1.5, false, detail)
    mamlukMinaret(mstone, mstone, dark, gilt, x, y, TOP + 1.5,
      [{ r: 2.16, z1: F + 18.0, balc: 2.97 }],
      { r: 1.49, z0: F + 21.0, z1: F + 23.4 }, { r: 1.28, top: F + 26.6, tip: F + 29.0 }, detail, Math.PI / 8, 1)
  }

  const lit = (base: number) => (p: V3, n: V3): number => (n[2] > 0.85 ? 0.45 : 1) * base
  return [
    { part: stone, material: { ...finish('cairo-azhar-limestone', 0xd5bf9b), floodlight: lit(0.85) } },
    { part: plaster, material: { ...finish('cairo-azhar-plaster', 0xeee6d6), floodlight: lit(0.85) } },
    { part: trim, material: { ...finish('cairo-azhar-stucco', 0xe0d0b2), floodlight: lit(0.85) } },
    { part: dark, material: PALETTE.window },
    { part: gilt, material: { ...PALETTE.metal, color: 0x9c8466 } },
    { part: mstone, material: { ...finish('cairo-azhar-minaret-stone', 0xa88d6a), floodlight: lit(0.9) } },
  ]
}

if (import.meta.main) {
  const extras = { bearing: 125.8, osm: 'way/24749059', height: F + 45.2 }
  await save('cairo-al-azhar-mosque.glb', 'Al-Azhar Mosque', build(false), 6500, 250_000, extras)
  await save('cairo-al-azhar-mosque.detail.glb', 'Al-Azhar Mosque', build(true), 40_000, 1536 * 1024, extras)
}
