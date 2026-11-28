/**
 * Mosque of Muhammad Ali (the Alabaster Mosque), Citadel of Cairo
 * (Yusuf Bushnak, 1830-48): procedural, CC0-1.0.
 * bun generators/cairo-muhammad-ali-mosque.ts
 *
 * Writes two levels of detail in the same frame and materials:
 * - models/cairo-muhammad-ali-mosque.glb (low, under 6,500 triangles);
 * - models/cairo-muhammad-ali-mosque.detail.glb (under 40,000): rounder
 *   domes, the arcades' columns, the hall's three window tiers with their
 *   reveals, the minarets' balcony corbels, the fountain's columns.
 *
 * Also exports the mosque kit the other Cairo mosques use: `arcade` (a
 * wall face of real arched openings with reveals), `archArc`, `turret` and
 * `finial`. The plain geometry kit is in cairo-cairo-tower.ts.
 *
 * The mosque only: the prayer hall, its two minarets, the lateral
 * galleries, the courtyard with its domed riwaqs, the clock tower and the
 * ablution fountain (OSM relation/446128, the courtyard ring with its
 * inner court, and its building:parts). The Citadel's walls, the Gawhara
 * Palace and the police museum around it stay on the map.
 *
 * Frame: built along the mosque's axis and placed at bearing 132.6, the
 * qibla (south-east): +y runs from the courtyard to the qibla wall, +x is
 * the south-west side. The axis is the line through the courtyard's
 * centre and the main dome, and the hall's sides (OSM part way/1104471452)
 * run within a degree of it. Origin: the centroid of the relation's outer
 * ring (a 56 x 111 m outline).
 *
 * Plan (OSM building:parts, read in this frame): the main dome 20.6 m
 * across at (0.3, 26.8); the four semi-domes 20.6 m across on the axes,
 * their centres 10.8 m out; four corner domes 8.8 m across at (+-15.9,
 * +-16.3) from the dome; the qibla apse 21.4 x 7.6 m with its own
 * semi-dome; the qibla corner turrets at (+-22.2, 49); the minarets at
 * (+-22.2, 4.6), at the hall's courtyard corners; the courtyard 56 m wide
 * (55 x 57 m published) with the open court 45.6 x 45.6 m; the fountain
 * (way/618096002, the Shadirvan) at the court's centre, 12.7 m across.
 * Published (en.wikipedia "Mosque of Muhammad Ali"): hall 45 x 46 m (OSM
 * 47 x 48; the model takes 46.6 x 47); dome 21 m across, its apex 52 m;
 * minarets over 80 m with two balconies and conical caps, 3 m wide at the
 * base.
 *
 * Heights. OSM's part heights read about 0.7 of the published ones (its
 * dome is 37 m), so heights come from the near-orthographic telephoto
 * "Cairo, Cairo Citadel, Muhammad Ali Mosque, Egypt.jpg" (Argenberg, from
 * the north), scaled between the dome's apex (52 m) and the minaret tips
 * (82 m), which agree with the dome's 21 m width within 3%: hall cornice
 * 26 m; the semi-domes' window drums to 31.5 m and their crowns 38.3; the
 * corner domes 30.5 to 34.4; the central block to 38.8, the dome's drum
 * 38.8-42.4 and the dome from 42.6; the turrets round the drum to 44.6;
 * the minaret balconies at 54.2 and 65.5 m, the cap from 71.7 m to the
 * tip at 82.4; the qibla corner turrets to 37.6. From "Muhammad Ali
 * Mosque 1.jpg" (kallerna, from the east): the apse 18 m with its
 * semi-dome to 23 m; the hall's three window tiers and the inscription
 * band at 8.6 m, below which the walls are faced in alabaster. Courtyard
 * from Diego Delso's court views: bays 5 m, columns 6.8 m, arches to
 * 9.2 m, roof 11.5 m, the riwaq domes to 14 m; the fountain's canopy at
 * 7.4-8.6 m and its dome to 11.6. The clock tower: about 16 m above the
 * riwaq roof (estimated from the court views; scaffolded in 2007).
 *
 * Ground: the mosque stands on the Citadel's level southern plateau.
 * The map's terrain (Mapterhorn, z12 only here) smooths the plateau's
 * edge, so it falls about 20 m across the footprint, from the qibla end
 * down to the court's north-west wall (the real drop is the Citadel's
 * rampart, just outside). y = 0 is the lowest drawn ground under the
 * footprint; the floor of the hall and court is 18 m above it (FLOOR: the
 * drawn ground under the court reaches 14.5 m, under the apse 20 m), and
 * a plain limestone terrace wall runs from y = 0 up to it, standing in for
 * the plateau and its rampart on the downhill side; at the qibla end the
 * hall's walls sink up to 2 m into the drawn hill. Only the court's floor
 * is drawn (the galleries' floors are left to the ground). Elevation 0.
 * `terrain.ts check` (z12): ok, ok.
 *
 * Simplified or left out: the facades' alabaster pilasters and the
 * blind-arch relief on the apse are drawn as shallow panels; the
 * inscription band as a flat strip; window grilles as plain panels;
 * the drums' buttresses, the domes' lead ribs, the clock tower's iron
 * tracery; the crescents of the finials (a bulb and spike only); the
 * court's paving (the map's).
 *
 * Colours from the daylight photos: the upper walls a warm buff limestone
 * (#cdb796 in sun), the alabaster lower walls, apse and court a paler
 * cream (#ddd0bb), the domes' lead a silvery pale grey, the finials and
 * clock tower bronze.
 *
 * Night: the mosque is floodlit white; stone and lead carry `_FLOODLIGHT`,
 * windows glow.
 *
 * Photos (Wikimedia Commons; all EVIDENCE):
 * - "Cairo, Cairo Citadel, Muhammad Ali Mosque, Egypt.jpg", Vyacheslav Argenberg, CC BY 4.0 (from the north, telephoto; main ruler)
 *   https://commons.wikimedia.org/wiki/File:Cairo,_Cairo_Citadel,_Muhammad_Ali_Mosque,_Egypt.jpg
 * - "Muhammad Ali Mosque 1.jpg", kallerna, CC BY-SA 3.0 (from the east: qibla front, apse, turrets)
 *   https://commons.wikimedia.org/wiki/File:Muhammad_Ali_Mosque_1.jpg
 * - "Muhammad Ali Mosque, Citadel, Cairo, Egypt3.jpg", Diego Delso, CC BY-SA 3.0 (court, clock tower, fountain)
 *   https://commons.wikimedia.org/wiki/File:Muhammad_Ali_Mosque,_Citadel,_Cairo,_Egypt3.jpg
 * - "Muhammad Ali Mosque, Citadel, Cairo, Egypt5.jpg", Diego Delso, CC BY-SA 3.0 (the fountain)
 *   https://commons.wikimedia.org/wiki/File:Muhammad_Ali_Mosque,_Citadel,_Cairo,_Egypt5.jpg
 * - "Mosque of Muhammad Ali, Selah-Al-Din (Saladin) Citadel, Cairo (9797492034).jpg", Gary Todd, CC0 (north-east side, the lateral gallery)
 *   https://commons.wikimedia.org/wiki/File:Mosque_of_Muhammad_Ali,_Selah-Al-Din_(Saladin)_Citadel,_Cairo_(9797492034).jpg
 * - "Mosque of Muhammad Ali, Selah-Al-Din (Saladin) Citadel, Cairo (9808214484).jpg", Gary Todd, CC0 (court and fountain)
 *   https://commons.wikimedia.org/wiki/File:Mosque_of_Muhammad_Ali,_Selah-Al-Din_(Saladin)_Citadel,_Cairo_(9808214484).jpg
 * - "Mosque of Muhammad Ali and Cairo Citadel from Sayyida Aisha Square.jpg", Hassan Hamdy wahidy, public domain (from below the Citadel)
 *   https://commons.wikimedia.org/wiki/File:Mosque_of_Muhammad_Ali_and_Cairo_Citadel_from_Sayyida_Aisha_Square.jpg
 * Look-only: none.
 *
 * Doubts: the hall's south-west face and the courtyard's outer faces
 * are drawn like the faces that were photographed; the riwaq bay count
 * (nine a side) is from the court photos, not a plan; the clock tower's
 * height and form are estimated (it was scaffolded in the photos found);
 * OSM's outline runs 4 m outside the hall's lateral walls, read as the
 * lateral galleries that the north-east photo shows.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import {
  TAU, Z, add, archOutline, box, dome, domeProfile, face, lathe, norm, obox, panel, prism, quad, rightOf, save, tri,
  type Mat, type XY,
} from './cairo-cairo-tower'

// ───────────────────────────── mosque kit ─────────────────────────────────

export type ArchKind = 'round' | 'pointed' | 'keel'

/** The arc of an arch from its right springing to its left (as archOutline), springing at zs. */
export function archArc(sL: number, sR: number, zs: number, kind: ArchKind, segs: number): XY[] {
  const pts = archOutline(sL, sR, 0, 100, kind, segs).slice(2)
  const dz = zs - pts[0][1]
  return pts.map(([s, z]) => [s, z + dz] as XY)
}

/**
 * One face of an arcade: `bays` openings in a wall plane from s = 0 to
 * bays * bw, solid from the ground (z0) to zt, each opening between piers
 * `pier` wide, springing at zs. The plane starts at `o`, runs along the
 * horizontal unit `u` and faces `n`; the reveals (pier sides and the
 * arches' undersides) run `t` deep behind it, and `back` (when given)
 * draws the far face too. Returns the apexes' height.
 */
export function arcade(p: Part, o: V3, u: V3, n: V3, bays: number, bw: number, pier: number, z0: number, zs: number, zt: number,
  kind: ArchKind, segs: number, t: number, o2: { back?: Part; reveal?: Part; skip?: (b: number) => boolean; noPierReveal?: boolean } = {}): number {
  const P = (s: number, z: number, d = 0): V3 => [o[0] + u[0] * s - n[0] * d, o[1] + u[1] * s - n[1] * d, z]
  const rev = o2.reveal ?? p
  let apex = zs
  for (let b = 0; b < bays; b++) {
    const s0 = b * bw, s1 = s0 + bw
    if (o2.skip?.(b)) {
      quad(p, P(s0, z0), P(s1, z0), P(s1, zt), P(s0, zt), n)
      if (o2.back) quad(o2.back, P(s1, z0, t), P(s0, z0, t), P(s0, zt, t), P(s1, zt, t), [-n[0], -n[1], -n[2]])
      continue
    }
    const sL = s0 + pier / 2, sR = s1 - pier / 2
    const arc = archArc(sL, sR, zs, kind, segs) // right springing .. apex .. left springing
    const k = arc.length
    const top = arc.reduce((m, q) => (q[1] > m[1] ? q : m), arc[0])
    apex = Math.max(apex, top[1])
    const ia = arc.indexOf(top)
    const faces = (part: Part, d: number, nn: V3) => {
      // piers below the springing
      if (b === 0 || pier > 0) {
        quad(part, P(s0, z0, d), P(sL, z0, d), P(sL, zs, d), P(s0, zs, d), nn)
        quad(part, P(sR, z0, d), P(s1, z0, d), P(s1, zs, d), P(sR, zs, d), nn)
      }
      // spandrels: fans from the top corners
      const TL = P(s0, zt, d), TR = P(s1, zt, d)
      tri(part, TR, P(sR, zs, d), P(s1, zs, d), nn)
      for (let i = 0; i < ia; i++) tri(part, TR, P(arc[i + 1][0], arc[i + 1][1], d), P(arc[i][0], arc[i][1], d), nn)
      tri(part, TR, TL, P(top[0], top[1], d), nn)
      for (let i = ia; i < k - 1; i++) tri(part, TL, P(arc[i + 1][0], arc[i + 1][1], d), P(arc[i][0], arc[i][1], d), nn)
      tri(part, TL, P(s0, zs, d), P(sL, zs, d), nn)
    }
    faces(p, 0, n)
    if (o2.back) faces(o2.back, t, [-n[0], -n[1], -n[2]])
    // reveals: pier sides and the intrados
    const inward = (dir: number): V3 => [u[0] * dir, u[1] * dir, 0]
    if (!o2.noPierReveal) {
      quad(rev, P(sL, z0), P(sL, zs), P(sL, zs, t), P(sL, z0, t), inward(1))
      quad(rev, P(sR, zs), P(sR, z0), P(sR, z0, t), P(sR, zs, t), inward(-1))
    }
    for (let i = 0; i < k - 1; i++) {
      const a = arc[i], c = arc[i + 1]
      const ds = c[0] - a[0], dz = c[1] - a[1], l = Math.hypot(ds, dz) || 1
      // the intrados faces into the opening: left of the arc's travel (right to left, over the top)
      const nn: V3 = norm([u[0] * (dz / l), u[1] * (dz / l), -ds / l])
      quad(rev, P(a[0], a[1]), P(c[0], c[1]), P(c[0], c[1], t), P(a[0], a[1], t), nn)
    }
  }
  return apex
}

/** A finial: a stack of bulbs on a rod, to height `top`. */
export function finial(p: Part, x: number, y: number, z: number, top: number, r: number, seg = 6) {
  const h = top - z
  if (seg <= 4) lathe(p, x, y, [[r * 0.6, z], [r, z + h * 0.3], [r * 0.25, z + h * 0.55], [0, top]], seg, { smooth: false })
  else lathe(p, x, y, [[r * 0.5, z], [r, z + h * 0.18], [r * 0.45, z + h * 0.32], [r * 0.8, z + h * 0.46], [r * 0.3, z + h * 0.6], [r * 0.18, z + h * 0.92], [0, top]], seg, { smooth: true })
}

/**
 * An Ottoman turret: an octagonal shaft from z0 with an open (arcaded)
 * lantern near the top drawn as recessed panels, a cornice, a small dome
 * and a finial.
 */
export function turret(stone: Part, trim: Part, lead: Part, glaze: Part, gilt: Part, x: number, y: number, r: number, z0: number, zt: number, detail: boolean) {
  const n = 8, ph = Math.PI / 8
  lathe(stone, x, y, [[r, z0], [r, zt - 0.2]], n, { facet: true, phase: ph })
  lathe(trim, x, y, detail ? [[r, zt - 0.2], [r + 0.3, zt], [r + 0.3, zt + 0.4], [r * 0.82, zt + 0.5]] : [[r, zt - 0.2], [r + 0.3, zt + 0.4], [r * 0.82, zt + 0.5]], n, { facet: true, phase: ph })
  dome(lead, x, y, r * 0.82, zt + 0.5, r * 0.9, detail ? 12 : 8, detail ? 4 : 2)
  finial(gilt, x, y, zt + 0.5 + r * 0.85, zt + 0.5 + r * 0.9 + 1.6, 0.28, detail ? 6 : 3)
  // lantern openings: dark arched panels on four faces
  const lz = zt - 0.6 - 2.2
  for (let i = 0; i < n; i += detail ? 1 : 2) {
    const t = (TAU * i) / n + ph + Math.PI / n, rr = r * Math.cos(Math.PI / n)
    panel(glaze, [x + rr * Math.cos(t), y + rr * Math.sin(t), lz], [Math.cos(t), Math.sin(t), 0], 2 * r * Math.sin(Math.PI / n) * 0.62, 2.0, 'round', detail ? 4 : 2, 0.04)
  }
}

// ───────────────────────────── the mosque ─────────────────────────────────

const FLOOR = 18.0 // the plateau level above the lowest drawn ground under the footprint (see Ground)
const CX = 0.3, CY = 26.8 // main dome centre
const HX = 23.3, HY0 = CY - 23.5, HY1 = CY + 23.5 // hall: x = CX ± HX, y from HY0 (court) to HY1 (qibla)
const WALL = 25.4, CORN = 26.4 // hall wall top, cornice/roof (above the floor)
const ALAB = 8.6 // alabaster facing below the inscription band
const SD = 10.8, SR = 10.3 // semi-dome centre offset and radius
const CB = 11.2 // central block half-size
const AX = 10.7, AY1 = 57.9 // apse half-width, outer face
// Courtyard.
const KX = 28.0, KY0 = -53.6 // outer faces
const IX = 22.8, IY0 = -48.0, IY1 = -2.4 // open court
const KWALL = 11.5

function build(detail: boolean): Mat[] {
  const lime = new Part() // limestone: upper walls, drums, turrets, minarets
  const alab = new Part() // alabaster: lower walls, apse, court, fountain
  const lead = new Part() // domes and roofs
  const glaze = new Part() // windows
  const gilt = new Part() // finials, the clock tower
  const trim = alab // cornices share the alabaster

  const F = FLOOR
  const seg = (lo: number, hi: number) => (detail ? hi : lo)

  // ── Plinth: the plateau's terrace wall from y = 0 to the floor, under
  // the hall, the galleries, the apse and the court.
  // (its top is drawn only over the court; under the hall and apse it is
  // covered)
  box(lime, null, -KX - 0.3, KX + 0.3, KY0 - 0.3, HY1 + 0.3, 0, F, 0.3)
  box(lime, null, CX - AX - 0.3, CX + AX + 0.3, HY1, AY1 + 0.3, 0, F)
  face(alab, [[-KX - 0.3, KY0 - 0.3, F], [KX + 0.3, KY0 - 0.3, F], [KX + 0.3, HY0, F], [-KX - 0.3, HY0, F]], Z)
  // the galleries' floors are left to the ground: the drawn terrain rises
  // to about F at their qibla ends

  // ── Prayer hall body: alabaster below the band, limestone above, the
  // cornice and the flat roof between the domes.
  const hx0 = CX - HX, hx1 = CX + HX
  box(alab, null, hx0, hx1, HY0, HY1, F, F + ALAB, 0.4)
  box(trim, null, hx0 - 0.12, hx1 + 0.12, HY0 - 0.12, HY1 + 0.12, F + ALAB, F + ALAB + 0.9, 0.4) // inscription band
  box(lime, null, hx0, hx1, HY0, HY1, F + ALAB + 0.9, F + WALL, 0.4)
  box(trim, lead, hx0 - 0.4, hx1 + 0.4, HY0 - 0.4, HY1 + 0.4, F + WALL, F + CORN, 0.6)

  // Windows: three tiers. Ground: rectangular grilles; middle: rectangular;
  // upper: round-headed. Bays per face from the photos.
  const faceWin = (o: XY, n: V3, along: number[], behindGallery = false) => {
    for (const s of along) {
      const u = rightOf(n), at = (z: number): V3 => [o[0] + u[0] * s, o[1] + u[1] * s, F + z]
      if (detail || !behindGallery) panel(glaze, at(2.4), n, 2.0, 3.6)
      panel(glaze, at(11.2), n, 2.0, 3.4)
      panel(glaze, at(16.4), n, 2.2, 5.0, 'round', seg(4, 8))
    }
  }
  const lat = [-17.5, -10.5, -3.5, 3.5, 10.5, 17.5]
  faceWin([hx1, CY], [1, 0, 0], lat, true)
  faceWin([hx0, CY], [-1, 0, 0], lat, true)
  faceWin([CX, HY1], [0, 1, 0], [-18.5, -13.5, 13.5, 18.5])
  faceWin([CX, HY0], [0, -1, 0], [-17.5, -10.5, 10.5, 17.5])

  // The qibla apse: an alabaster block with the blind arch, its semi-dome.
  box(alab, lead, CX - AX, CX + AX, HY1 - 0.5, AY1, F, F + 17.4, 0.3)
  box(trim, lead, CX - AX - 0.3, CX + AX + 0.3, HY1 - 0.5, AY1 + 0.3, F + 17.4, F + 18.2, 0.3)
  // the great blind arch on its face (a raised round-headed band)
  {
    const yA = AY1 + 0.05, n: V3 = [0, 1, 0], r0 = 8.6, r1 = 9.4, zc = F + 7.8, sN = seg(8, 16)
    for (let i = 0; i < sN; i++) {
      const t0 = (Math.PI * i) / sN, t1 = (Math.PI * (i + 1)) / sN
      const Q = (t: number, r: number, d = 0): V3 => [CX + r * Math.cos(t), yA + d, zc + r * Math.sin(t)]
      quad(trim, Q(t1, r0, 0.25), Q(t0, r0, 0.25), Q(t0, r1, 0.25), Q(t1, r1, 0.25), n)
      if (detail) quad(trim, Q(t0, r0, 0), Q(t1, r0, 0), Q(t1, r0, 0.25), Q(t0, r0, 0.25), [-Math.cos((t0 + t1) / 2), 0, -Math.sin((t0 + t1) / 2)])
    }
    for (const s of [-1, 1]) box(trim, trim, CX + s * r0 - (s > 0 ? 0 : 0.8), CX + s * r0 + (s > 0 ? 0.8 : 0), yA - 0.1, yA + 0.25, F, zc)
    for (const s of [-4.2, 0, 4.2]) {
      panel(glaze, [CX + s, yA + 0.25, F + 2.4], n, 1.8, 3.4)
      panel(glaze, [CX + s, yA + 0.25, F + 8.6], n, 1.8, 3.4, 'round', seg(4, 8))
    }
    for (const s of [-1, 1]) {
      panel(glaze, [CX + s * AX, (HY1 + AY1) / 2, F + 2.4], [s, 0, 0], 1.8, 3.4)
      panel(glaze, [CX + s * AX, (HY1 + AY1) / 2, F + 8.6], [s, 0, 0], 1.8, 3.4, 'round', 4)
    }
  }
  // the apse's half drum and semi-dome (to 23 m), turrets at its back corners
  lathe(lime, CX, HY1, [[8.4, F + 18.2], [8.4, F + 20.4]], seg(6, 12), { a0: 0, a1: Math.PI, facet: true, phase: 0 })
  lathe(lead, CX, HY1, domeProfile(8.4, F + 20.4, 4.2, seg(3, 5)), seg(8, 16), { smooth: true, a0: 0, a1: Math.PI })
  for (let i = 0; i < seg(0, 6); i++) {
    const t = (Math.PI * (i + 0.5)) / seg(3, 6), rr = 8.4 * Math.cos(Math.PI / (2 * seg(6, 12)))
    panel(glaze, [CX + rr * Math.cos(t), HY1 + rr * Math.sin(t), F + 18.6], [Math.cos(t), Math.sin(t), 0], 1.3, 1.5, false)
  }
  for (const s of [-1, 1]) turret(lime, trim, lead, glaze, gilt, CX + s * 8.9, HY1 + 1.0, 0.9, F + 18.2, F + 22.6, detail)

  // ── The central block, the drum and the dome.
  box(lime, lead, CX - CB, CX + CB, CY - CB, CY + CB, F + CORN, F + 38.8 - 0.01)
  // the drum: sixteen windows between piers; the cornice; the dome
  const DR = 11.0, D0 = F + 38.8, D1 = F + 42.4
  lathe(lime, CX, CY, [[DR, D0], [DR, D1]], 16, { facet: true, phase: Math.PI / 16 })
  for (let i = 0; i < 16; i++) {
    const t = (TAU * i) / 16 + Math.PI / 16 + Math.PI / 16, rr = DR * Math.cos(Math.PI / 16)
    panel(glaze, [CX + rr * Math.cos(t), CY + rr * Math.sin(t), D0 + 0.8], [Math.cos(t), Math.sin(t), 0], 1.5, 2.4, 'round', seg(3, 6))
  }
  lathe(trim, CX, CY, [[DR + 0.45, D1], [DR + 0.45, D1 + 0.5], [10.8, D1 + 0.6]], seg(16, 32))
  dome(lead, CX, CY, 10.8, D1 + 0.6, 52 - 42.4 - 0.6, seg(18, 36), seg(5, 12))
  finial(gilt, CX, CY, F + 51.8, F + 55.6, 0.55, seg(5, 8))
  // the four turrets at the central block's corners
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) turret(lime, trim, lead, glaze, gilt, CX + sx * (CB - 0.9), CY + sy * (CB - 0.9), 1.25, F + CORN, F + 42.2, detail)

  // ── Semi-domes on the four axes: a half drum of windows, the half dome.
  for (const [dx, dy] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) {
    const cx = CX + dx * SD, cy = CY + dy * SD, a0 = Math.atan2(dy, dx) - Math.PI / 2
    const zb = F + CORN, zw = F + 31.5
    lathe(lime, cx, cy, [[SR, zb], [SR, zw]], seg(6, 10), { a0, a1: a0 + Math.PI, facet: true })
    lathe(trim, cx, cy, [[SR + 0.35, zw - 0.2], [SR + 0.35, zw + 0.2], [SR, zw + 0.3]], seg(6, 16), { a0, a1: a0 + Math.PI })
    lathe(lead, cx, cy, domeProfile(SR, zw + 0.3, 38.3 - 31.8, seg(3, 6)), seg(10, 24), { smooth: true, a0, a1: a0 + Math.PI })
    const nw = seg(6, 10)
    for (let i = 0; i < nw; i++) {
      const t = a0 + (Math.PI * (i + 0.5)) / nw, rr = SR * Math.cos(Math.PI / (2 * nw))
      panel(glaze, [cx + rr * Math.cos(t), cy + rr * Math.sin(t), zb + 1.4], [Math.cos(t), Math.sin(t), 0], seg(2.2, 1.6), 2.6, 'round', seg(3, 6))
    }
    // the semi-dome's back wall against the central block, closing the half
    if (detail) finial(gilt, cx + dx * (SR - 0.6), cy + dy * (SR - 0.6), F + 35.0, F + 36.6, 0.2, 4)
  }
  // Corner domes on octagonal drums.
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
    const x = CX + sx * 15.9, y = CY + sy * 16.3, r = 4.4
    lathe(lime, x, y, [[r + 0.3, F + CORN], [r + 0.3, F + 30.2]], 8, { facet: true, phase: Math.PI / 8 })
    lathe(trim, x, y, [[r + 0.55, F + 30.1], [r + 0.55, F + 30.6], [r, F + 30.6]], 8, { phase: Math.PI / 8, facet: true })
    dome(lead, x, y, r, F + 30.6, 3.8, seg(8, 20), seg(3, 6), Math.PI / 8)
    finial(gilt, x, y, F + 34.2, F + 36.2, 0.3, seg(3, 6))
    for (let i = 0; i < 8; i += detail ? 1 : 2) {
      const t = (TAU * i) / 8 + Math.PI / 8 + Math.PI / 8, rr = (r + 0.3) * Math.cos(Math.PI / 8)
      panel(glaze, [x + rr * Math.cos(t), y + rr * Math.sin(t), F + 27.2], [Math.cos(t), Math.sin(t), 0], 1.4, 2.2, 'round', 4)
    }
  }
  // Turrets at the qibla corners of the hall.
  for (const s of [-1, 1]) turret(lime, trim, lead, glaze, gilt, CX + s * (HX - 1.1), HY1 - 1.1, 1.8, F + CORN, F + 35.2, detail)

  // ── Lateral galleries: an arcade on columns along each side of the hall.
  const GX = KX - 0.3, GZ = 8.4
  for (const s of [-1, 1]) {
    const xo = CX + s * GX, xi = CX + s * HX
    const n: V3 = [s, 0, 0], u: V3 = [0, -s, 0]
    const L = HY1 - HY0 - 1.0, bays = 8, bw = L / bays
    const yStart = s > 0 ? HY1 - 0.5 : HY0 + 0.5
    arcade(alab, [xo, yStart, 0], u, n, bays, bw, 0.7, F, F + 4.9, F + GZ, 'round', seg(3, 8), 0.6, { back: detail ? alab : undefined })
    // roof and the wall top behind
    const xa = Math.min(xo, xi), xb = Math.max(xo, xi)
    box(trim, lead, xa - (s < 0 ? 0.3 : 0), xb + (s > 0 ? 0.3 : 0), HY0 + 0.5, HY1 - 0.5, F + GZ, F + GZ + 0.7)
    // its back wall is the hall's alabaster; end walls
    for (const y of [HY0 + 0.5, HY1 - 0.5]) box(alab, null, xa, xb, y - 0.35, y + 0.35, F, F + GZ)
  }

  // ── Minarets: at the hall's courtyard corners, 82 m, two balconies.
  const minaret = (x: number, y: number) => {
    const R0 = 1.55, n = seg(8, 16), ph = 0.2
    box(lime, trim, x - 2.3, x + 2.3, y - 2.3, y + 2.3, F, F + CORN + 1.2, 0.3)
    lathe(lime, x, y, [[2.0, F + CORN + 1.2], [R0 + 0.2, F + CORN + 3.0], [R0, F + CORN + 3.0]], n, { phase: ph, facet: true })
    const balc = [F + 54.2, F + 65.5], capZ = F + 71.7, tip = F + 82.4
    lathe(lime, x, y, [[R0, F + CORN + 3.0], [R0, balc[0]]], n, { phase: ph })
    for (let i = 0; i < 2; i++) {
      const zb = balc[i], zn = i === 0 ? balc[1] : capZ, r1 = i === 0 ? R0 - 0.1 : R0 - 0.2
      // corbel (real 3D: flaring), the balcony floor and its parapet ring, the shaft on
      lathe(trim, x, y, detail
        ? [[R0, zb - 1.6], [R0 + 0.5, zb - 0.9], [2.45, zb - 0.1], [2.45, zb], [2.3, zb], [2.3, zb + 1.1], [2.45, zb + 1.1], [2.45, zb + 1.3], [r1, zb + 1.3]]
        : [[R0, zb - 1.6], [2.45, zb - 0.1], [2.45, zb + 1.3], [r1, zb + 1.3]], n, { phase: ph })
      if (detail) lathe(trim, x, y, [[2.3, zb + 1.1], [2.3, zb]], n, { phase: ph, inside: true })
      lathe(lime, x, y, [[r1, zb + 1.3], [r1, zn]], n, { phase: ph })
    }
    lathe(trim, x, y, [[R0 - 0.2, capZ], [R0 + 0.15, capZ + 0.4], [R0 - 0.05, capZ + 0.6]], n, { phase: ph })
    lathe(lead, x, y, [[R0 - 0.05, capZ + 0.6], [0.35, tip - 1.4], [0, tip - 0.8]], n, { phase: ph })
    finial(gilt, x, y, tip - 1.2, tip + 1.6, 0.22, 4)
  }
  for (const s of [-1, 1]) minaret(CX + s * 22.2, 4.6)

  // ── The courtyard: outer walls, riwaq arcades round the court, domes.
  // Outer walls (with windows outside), stopping at the hall.
  const ky1 = HY0 - 0.01
  box(alab, null, -KX, KX, KY0, KY0 + 0.9, F, F + KWALL)
  for (const s of [-1, 1]) box(alab, null, s > 0 ? KX - 0.9 : -KX, s > 0 ? KX : -KX + 0.9, KY0, ky1, F, F + KWALL)
  box(trim, null, -KX - 0.25, KX + 0.25, KY0 - 0.25, KY0 + 0.6, F + KWALL - 0.6, F + KWALL + 0.3)
  for (const s of [-1, 1]) box(trim, null, s > 0 ? KX - 0.6 : -KX - 0.25, s > 0 ? KX + 0.25 : -KX + 0.6, KY0, ky1, F + KWALL - 0.6, F + KWALL + 0.3)
  // riwaq roofs
  const RZ = F + KWALL
  face(lead, [[-KX + 0.6, KY0 + 0.6, RZ], [KX - 0.6, KY0 + 0.6, RZ], [KX - 0.6, IY0, RZ], [-KX + 0.6, IY0, RZ]], Z)
  for (const s of [-1, 1]) {
    const xa = s > 0 ? IX : -KX + 0.6, xb = s > 0 ? KX - 0.6 : -IX
    face(lead, [[xa, IY0, RZ], [xb, IY0, RZ], [xb, IY1, RZ], [xa, IY1, RZ]], Z)
  }
  face(lead, [[-KX + 0.6, IY1, RZ], [KX - 0.6, IY1, RZ], [KX - 0.6, HY0, RZ], [-KX + 0.6, HY0, RZ]], Z)
  // the arcades facing the court (piers between round arches)
  const NB = 9, bwx = (2 * IX) / NB, bwy = (IY1 - IY0) / NB, AS = F + 6.8, AT = RZ
  const cw = detail ? 0.9 : 1.0
  arcade(alab, [-IX, IY1, 0], [1, 0, 0], [0, -1, 0], NB, bwx, cw, F, AS, AT, 'round', seg(3, 8), 0.7, { back: detail ? alab : undefined }) // along the hall
  arcade(alab, [IX, IY0, 0], [-1, 0, 0], [0, 1, 0], NB, bwx, cw, F, AS, AT, 'round', seg(3, 8), 0.7, { back: detail ? alab : undefined }) // north-west
  arcade(alab, [IX, IY1, 0], [0, -1, 0], [-1, 0, 0], NB, bwy, cw, F, AS, AT, 'round', seg(3, 8), 0.7, { back: detail ? alab : undefined }) // south-west side
  arcade(alab, [-IX, IY0, 0], [0, 1, 0], [1, 0, 0], NB, bwy, cw, F, AS, AT, 'round', seg(3, 8), 0.7, { back: detail ? alab : undefined }) // north-east side
  // corner piers of the arcades
  for (const sx of [-1, 1]) for (const y of [IY0, IY1]) box(alab, null, sx * IX - 0.6, sx * IX + 0.6, y - 0.6, y + 0.6, F, AT)
  // columns in front of the piers (detail): round shafts with a capital
  if (detail) {
    const col = (x: number, y: number) => {
      lathe(alab, x, y, [[0.5, F], [0.5, F + 0.5], [0.36, F + 0.6], [0.36, AS - 0.6], [0.5, AS - 0.2], [0.55, AS]], 8, { phase: Math.PI / 8 })
    }
    for (let i = 1; i < NB; i++) {
      col(-IX + i * bwx, IY1 - 0.5); col(-IX + i * bwx, IY0 + 0.5)
      col(IX + 0.5, IY0 + i * bwy); col(-IX - 0.5, IY0 + i * bwy)
    }
  }
  // the outer walls' windows: two per bay, small, in the lower tier
  if (detail) {
    for (let i = 0; i < NB; i++) {
      const y = IY0 + (i + 0.5) * bwy, x = -IX + (i + 0.5) * bwx
      for (const s of [-1, 1]) panel(glaze, [s * KX, y, F + 2.2], [s, 0, 0], 1.3, 2.6, 'round', 4)
      panel(glaze, [x, KY0, F + 2.2], [0, -1, 0], 1.3, 2.6, 'round', 4)
    }
  } else {
    for (let i = 1; i < NB; i += 3) {
      const y = IY0 + (i + 0.5) * bwy, x = -IX + (i + 0.5) * bwx
      for (const s of [-1, 1]) panel(glaze, [s * KX, y, F + 2.2], [s, 0, 0], 1.3, 2.6)
      panel(glaze, [x, KY0, F + 2.2], [0, -1, 0], 1.3, 2.6)
    }
  }
  // Riwaq domes: one per bay and at the corners; the portico's centre dome larger.
  const rd = (x: number, y: number, r: number, drum: number) => {
    if (drum > 0) lathe(alab, x, y, [[r + 0.2, RZ], [r + 0.2, RZ + drum], [r, RZ + drum]], 8, { facet: true, phase: Math.PI / 8 })
    dome(lead, x, y, r, RZ + drum, r * 0.95, seg(6, 12), seg(2, 4))
    if (detail) finial(gilt, x, y, RZ + drum + r * 0.9, RZ + drum + r + 1.3, 0.16, 4)
  }
  const cyN = (KY0 + 0.6 + IY0) / 2, cyS = (IY1 + HY0) / 2, cxW = (IX + KX - 0.6) / 2
  for (let i = 0; i < NB; i++) {
    const x = -IX + (i + 0.5) * bwx, y = IY0 + (i + 0.5) * bwy
    rd(x, cyN, 2.2, 0)
    rd(x, cyS, i === (NB - 1) / 2 ? 2.4 : 1.8, i === (NB - 1) / 2 ? 1.4 : 0)
    for (const s of [-1, 1]) rd(s * cxW, y, 2.2, 0)
  }
  for (const s of [-1, 1]) { rd(s * cxW, cyN, 2.2, 0); rd(s * cxW, cyS, 1.8, 0) }

  // Lateral gates: a raised portal block in each side wall's middle.
  for (const s of [-1, 1]) {
    const y = (IY0 + IY1) / 2
    box(alab, trim, s > 0 ? KX - 1.0 : -KX - 0.6, s > 0 ? KX + 0.6 : -KX + 1.0, y - 3.2, y + 3.2, F, F + KWALL + 1.6, 0.2)
    panel(gilt, [s * (KX + 0.6), y, F], [s, 0, 0], 2.4, 4.6, 'round', seg(4, 8), 0.02)
  }

  // ── The clock tower over the north-west wall: a square stone base, the
  // bronze-coloured iron tower with its clock stage, gallery and cupola.
  {
    const x = 0, y = KY0 + 2.2, z = RZ
    box(alab, trim, x - 3.2, x + 3.2, y - 3.0, y + 3.0, z - 0.5, z + 3.2, 0.2)
    box(gilt, null, x - 2.6, x + 2.6, y - 2.4, y + 2.4, z + 3.2, z + 9.0, 0.5)
    for (const [n, c] of [[[0, -1, 0], [x, y - 2.4]], [[0, 1, 0], [x, y + 2.4]], [[1, 0, 0], [x + 2.6, y]], [[-1, 0, 0], [x - 2.6, y]]] as [V3, XY][]) {
      panel(alab, [c[0], c[1], z + 5.4], n, 1.9, 1.9, false, 4, 0.05) // clock faces
      if (detail) panel(glaze, [c[0], c[1], z + 3.7], n, 1.2, 1.4, 'round', 4, 0.05)
    }
    box(gilt, gilt, x - 3.1, x + 3.1, y - 2.9, y + 2.9, z + 9.0, z + 9.5, 0.6) // gallery floor
    box(gilt, null, x - 2.1, x + 2.1, y - 1.9, y + 1.9, z + 9.5, z + 12.6, 0.5)
    lathe(gilt, x, y, [[2.6, z + 12.6], [2.6, z + 13.0], [1.4, z + 15.2], [0.4, z + 16.2], [0, z + 16.4]], seg(8, 12), { phase: Math.PI / 8 })
    finial(gilt, x, y, z + 16.2, z + 18.0, 0.18, 4)
  }

  // ── The ablution fountain (the Shadirvan): a ring of columns carrying
  // round arches, the wide octagonal canopy, a dome.
  {
    const fx = -0.7, fy = -24.5
    prism(alab, alab, ngon8(fx, fy, 5.0), F, F + 0.5)
    // the marble basin-house inside
    lathe(alab, fx, fy, [[2.6, F + 0.5], [2.6, F + 3.4], [2.3, F + 3.6], [1.2, F + 4.8], [0, F + 5.2]], 8, { facet: true, phase: Math.PI / 8 })
    // eight piers/columns with arches between them: an octagonal arcade
    const rc = 4.3
    for (let i = 0; i < 8; i++) {
      const t0 = (TAU * i) / 8 + Math.PI / 8, t1 = (TAU * (i + 1)) / 8 + Math.PI / 8
      const a: V3 = [fx + rc * Math.cos(t0), fy + rc * Math.sin(t0), 0], b: V3 = [fx + rc * Math.cos(t1), fy + rc * Math.sin(t1), 0]
      const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: V3 = [(b[0] - a[0]) / L, (b[1] - a[1]) / L, 0]
      const tm = (t0 + t1) / 2, n: V3 = [Math.cos(tm), Math.sin(tm), 0]
      arcade(alab, a, u, n, 1, L, 0.7, F + 0.5, F + 4.6, F + 7.4, 'round', seg(3, 6), 0.5, { back: detail ? alab : undefined })
    }
    // the canopy: entablature, flaring eave, its top, the dome and finial
    lathe(gilt, fx, fy, [[rc + 0.25, F + 7.4], [6.4, F + 8.2], [6.4, F + 8.7], [4.6, F + 9.0]], 8, { facet: true, phase: Math.PI / 8 })
    lathe(gilt, fx, fy, [[6.4, F + 8.2], [rc + 0.25, F + 7.4]], 8, { facet: true, phase: Math.PI / 8, inside: false })
    dome(lead, fx, fy, 4.1, F + 8.9, 2.8, seg(8, 16), seg(2, 5), Math.PI / 8)
    finial(gilt, fx, fy, F + 11.5, F + 13.4, 0.22, 4)
  }

  const lit = (base: number) => (p: V3, n: V3): number => (n[2] > 0.85 ? 0.45 : 1) * base
  return [
    { part: lime, material: { ...finish('cairo-limestone', 0xd8c3a2), floodlight: lit(0.9) } },
    { part: alab, material: { ...finish('cairo-alabaster', 0xe9dfcd), floodlight: lit(0.9) } },
    { part: lead, material: { ...PALETTE.roof, color: 0xd2d4d3, floodlight: lit(0.8) } },
    { part: glaze, material: PALETTE.window },
    { part: gilt, material: { ...PALETTE.metal, color: 0xa08560, floodlight: lit(0.5) } },
  ]
}

function ngon8(cx: number, cy: number, r: number): XY[] {
  return Array.from({ length: 8 }, (_, i) => [cx + r * Math.cos((TAU * i) / 8 + Math.PI / 8), cy + r * Math.sin((TAU * i) / 8 + Math.PI / 8)] as XY)
}

if (import.meta.main) {
  const extras = { bearing: 132.6, osm: 'relation/446128', height: 82.4 + FLOOR + 1.6 }
  await save('cairo-muhammad-ali-mosque.glb', 'Mosque of Muhammad Ali', build(false), 6500, 250_000, extras)
  await save('cairo-muhammad-ali-mosque.detail.glb', 'Mosque of Muhammad Ali', build(true), 40_000, 1536 * 1024, extras)
}
