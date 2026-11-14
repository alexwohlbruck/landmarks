/**
 * Powder Tower (Prašná brána), Prague — procedural, CC0-1.0, no textures.
 * bun generators/prague-powder-tower.ts   (after prague-charles-bridge.ts, whose kit it uses)
 *
 * The late-Gothic gate tower of the Old Town (Matěj Rejsek, from 1475, left
 * unfinished in 1483; completed by Josef Mocker 1878–86): a square tower of
 * dark sandstone over a pointed gate passage that Celetná runs through, its
 * upper storeys covered in a net of blind arcades, pinnacled pilasters,
 * statues of Czech kings and tall traceried windows; a corbelled gallery at
 * the top of the stonework with a pierced balustrade, four corbelled corner
 * turrets with spires, and a very steep slate roof with two tiers of dormers,
 * a gilt ridge cresting and two finials.
 *
 * Frame: map frame x east, y north, z up, metres; bearing 0. Anchor
 * 14.42776, 50.08724 (the lead's anchor, the outline's centre). The tower is
 * turned −16.9° (the line of the passage walls in OSM), u along the passage
 * (Celetná, toward the east-south-east), v across it. z = 0 is the street:
 * Mapterhorn z14 varies by under 1 m here.
 *
 * Replaces: way/27124370 (the outline, min_height 10 over the passage) and
 * its parts way/482524681 (gallery 44–47), 482524682 (roof 47–65, hipped),
 * 482524683, 482524687, 482524688, 482524689 (turrets 43–54, pyramidal),
 * 482524684, 482524685 (the passage walls, 45), 482524686 (the small round
 * turret on the north side, 15). The covered bridge to the Municipal House
 * (way/225234255) is not part of the tower and is left to the map.
 *
 * Sources
 * - OSM (© OpenStreetMap contributors): the parts above, with heights; the
 *   passage between the walls 482524684/482524685; building:colour #372927.
 * - Published: Czech Wikipedia "Prašná brána": 65 m high; gallery at 44 m
 *   (186 steps), pierced balustrade; square plan; side walls 2.1 m thick;
 *   passage 6.36 m wide inside, openings 8.1 m wide, pointed; built 1475–83,
 *   finished by Mocker 1878–86; blind arcades with statues of Czech kings.
 * - Mapterhorn terrain z14: flat to within 1 m.
 * Photos (evidence, Wikimedia Commons):
 * - Uoaei1, "Praha Prašná brána 01.jpg", CC BY-SA 4.0 (the west face from
 *   Celetná, nearly level: the zones, pilasters, windows, statues, gallery,
 *   turrets, roof and dormers; the scale for the heights below):
 *   https://commons.wikimedia.org/wiki/File:Praha_Pra%C5%A1n%C3%A1_br%C3%A1na_01.jpg
 * - Jakub Hałun, "20190816 Brama Prochowa w Pradze 1859 5460 DxO.jpg", CC
 *   BY-SA 4.0 (west and south faces, the passage arch, the roof's cresting):
 *   https://commons.wikimedia.org/wiki/File:20190816_Brama_Prochowa_w_Pradze_1859_5460_DxO.jpg
 * - Szczecinolog, "Prašná brána in Prague, 2018.jpg", CC BY-SA 4.0 (the
 *   east face from náměstí Republiky):
 *   https://commons.wikimedia.org/wiki/File:Pra%C5%A1n%C3%A1_br%C3%A1na_in_Prague,_2018.jpg
 * - Dietmar Rabich, "Prag, Pulverturm -- 2019 -- 6602.jpg", CC BY-SA 4.0.
 *
 * Numbers
 * - Body 12.6 × 12.3 m (the west face 12.3 m against the published 8.1 m
 *   opening in Uoaei1's photo; OSM's 14 × 14.5 is the gallery's corbelled
 *   outline). Passage: openings 8.1 m wide (published) springing at 4 m to a
 *   point at 7.4 m, inside 6.4 m wide (published); photo-scaled.
 * - Heights are photo-scaled, not published: three level photos (Uoaei1's,
 *   Rabich's, Szczecinolog's) all put the gallery's balustrade at 2.3–2.4
 *   tower widths over the street and the finials at 3.4–3.5 widths, which
 *   with the 12.3–12.6 m width (OSM; the 8.1 m opening as a ruler, and the
 *   people at the passage in Rabich's photo) gives the balustrade at
 *   29.6 m and the finials at 46 m. That agrees with OSM's height=44 on the
 *   outline, not with Wikipedia's 65 m and gallery at 44 m, which would need
 *   a tower some 19 m wide. Zones: frieze 8 m, window-and-gable zone to
 *   17.7 m, upper windows and statues to 25.4 m, arcaded frieze and corbel
 *   table to 28.2 m, balustrade 29.6 m.
 * - Roof 29.2 → 43.0 m, 7.6 m wide at its foot with a 3.6 m ridge across the
 *   passage, finials to 46 m; turrets 25.4–30.2 m, spires to 36 m (photos).
 *
 * Simplified / doubts
 * - The height: see above. If the published 65 m is right, the photos are
 *   all wrong in the same way, which seems unlikely; the lead should decide.
 * - The sculpture is reduced to standing figures on brackets; the coats of
 *   arms and grotesques are left out. The north and south faces repeat the
 *   west face's scheme without the passage; the photos show them plainer in
 *   the lower zone, as drawn. The roof's flared foot is drawn straight.
 */
import { Part, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import { tube, bead } from './bridge-kit'
import { frame, face, faceOut, box, ring, loft, spire, hipRoof, gableRoof, pointedZ, archWall, passage, figure, onFace, faceNormal, panel, saveLods, dropToZero, type Xf, type SFrame } from './prague-charles-bridge'

const STONE = finish('powder-sandstone', 0x6f645a)
const SLATE = finish('powder-slate', 0x50565c)
/** The tracery, pilasters, bands and statues: the same stone, read darker in their shadows. */
const CARVE = finish('powder-carving', 0x50463e)
const GILT = finish('powder-gilt', 0xc9a54a)

type FaceName = 'u0' | 'u1' | 'v0' | 'v1'

function build(D: boolean) {
  const stone = new Part(), carve = new Part(), slate = new Part(), win = new Part(), gilt = new Part()
  const F = frame(-0.25, 0.5, 0, -16.9)
  const hu = 6.3, hv = 6.15
  const CB = 27.4, GF = 28.2, GT = 29.6, co = 0.7
  const PW = 4.05, PS = 4.0, PA = 7.4
  const parch = pointedZ(PW, PS, PA)
  const faces: FaceName[] = ['u0', 'u1', 'v0', 'v1']
  const halfOf = (f: FaceName) => (f[0] === 'u' ? hv : hu)

  // ---- The body with the passage through the u faces.
  for (const f of faces) {
    const half = halfOf(f), G2 = (a: number, w: number) => onFace(F, hu, hv, f, a, w)
    if (f[0] === 'u') archWall(stone, G2, -half, half, 0, CB, 0, PW, parch, D ? 12 : 6, faceNormal(F, f))
    else face(stone, [G2(-half, 0), G2(half, 0), G2(half, CB), G2(-half, CB)], faceNormal(F, f))
  }
  // the passage: openings 8.1 m, the walls inside at 3.2 m (the reveal steps in at the portal)
  const IW = 3.2, iarch = pointedZ(IW, PS + 0.6, PA - 0.6)
  passage(stone, (a, d, w) => F(d, a, w), 0, IW, 0, PS + 0.6, iarch, -hu + 1.2, hu - 1.2, D ? 12 : 6)
  for (const su of [-1, 1]) {
    // the portal reveals between the wide opening and the narrower passage
    const ud = su * (hu - 1.2)
    archWall(stone, (a, w) => F(ud, a, w), -PW, PW, 0, PA, 0, IW, iarch, D ? 12 : 6, faceNormal(F, su > 0 ? 'u1' : 'u0'))
    passage(stone, (a, d, w) => F(d, a, w), 0, PW, 0, PS, parch, Math.min(ud, su * hu), Math.max(ud, su * hu), D ? 12 : 6)
    // the archivolt, a moulded band round the opening
    const n = D ? 12 : 6, oarch = pointedZ(PW + 0.7, PS, PA + 0.75), f: FaceName = su > 0 ? 'u1' : 'u0'
    for (let k = 0; k < n; k++) {
      const a0 = -PW + (2 * PW * k) / n, a1 = -PW + (2 * PW * (k + 1)) / n, m = (PW + 0.7) / PW
      const i0 = onFace(F, hu, hv, f, a0, parch(a0), 0.25), i1 = onFace(F, hu, hv, f, a1, parch(a1), 0.25)
      const o0 = (d: number) => onFace(F, hu, hv, f, a0 * m, oarch(a0 * m), d), o1 = (d: number) => onFace(F, hu, hv, f, a1 * m, oarch(a1 * m), d)
      face(carve, [i0, i1, o1(0.25), o0(0.25)], faceNormal(F, f))
      face(carve, [o0(0), o1(0), o1(0.25), o0(0.25)], [0, 0, 1])
      if (D) face(carve, [onFace(F, hu, hv, f, a0, parch(a0), 0), onFace(F, hu, hv, f, a1, parch(a1), 0), i1, i0], [0, 0, -1])
    }
    for (const s of [-1, 1]) box(carve, (a, b, w) => onFace(F, hu, hv, su > 0 ? 'u1' : 'u0', a, w, b), s * PW - 0.3, s * PW + 0.3, 0, 0.25, 0, PS, 'b v0')
  }

  // ---- Decoration on every face: bands, pinnacled pilasters, blind arcades, windows, statues.
  const band = (f: FaceName, z0: number, z1: number, d: number) => {
    const half = halfOf(f), n = faceNormal(F, f)
    face(carve, [onFace(F, hu, hv, f, -half - d, z0, d), onFace(F, hu, hv, f, half + d, z0, d), onFace(F, hu, hv, f, half + d, z1, d), onFace(F, hu, hv, f, -half - d, z1, d)], n)
    face(carve, [onFace(F, hu, hv, f, -half, z1, 0), onFace(F, hu, hv, f, half, z1, 0), onFace(F, hu, hv, f, half + d, z1, d), onFace(F, hu, hv, f, -half - d, z1, d)], [0, 0, 1])
    if (D) face(carve, [onFace(F, hu, hv, f, -half, z0, 0), onFace(F, hu, hv, f, half, z0, 0), onFace(F, hu, hv, f, half + d, z0, d), onFace(F, hu, hv, f, -half - d, z0, d)], [0, 0, -1])
  }
  /** A box standing on a face: a across (a0..a1), out from d0 to d1, w0..w1. */
  const onBox = (p: Part, f: FaceName, a0: number, a1: number, d0: number, d1: number, w0: number, w1: number, skip = 'v0') =>
    box(p, (a, b, w) => onFace(F, hu, hv, f, a, w, b), a0, a1, d0, d1, w0, w1, skip)
  const pinnacle = (f: FaceName, a: number, d: number, w: number, h: number, r: number) =>
    spire(carve, (u, v, ww) => { const c = onFace(F, hu, hv, f, a, ww, d); const e = sub(onFace(F, hu, hv, f, a + 1, ww, d), onFace(F, hu, hv, f, a, ww, d)); const n = faceNormal(F, f); return [c[0] + u * e[0] + v * n[0], c[1] + u * e[1] + v * n[1], ww] }, 0, 0, r, w, w + h, 4, Math.PI / 4)

  for (const f of faces) {
    const half = halfOf(f), passageFace = f[0] === 'u'
    band(f, 8.0, 8.6, 0.3)
    band(f, 17.7, 18.1, 0.22)
    band(f, 25.4, 25.8, 0.25)
    // pilasters at the corners and the thirds, with pinnacles over each band
    const ps = [-half + 0.45, -half / 3, half / 3, half - 0.45]
    for (const a of ps) {
      onBox(carve, f, a - 0.3, a + 0.3, 0, 0.4, 8.6, 25.4)
      for (const z of [15.7, 23.2]) pinnacle(f, a, 0.4, z, 2.2, 0.3)
    }
    // blind arcades: pointed ribs between the pilasters, in both zones
    const bays: [number, number][] = [[ps[0] + 0.3, ps[1] - 0.3], [ps[1] + 0.3, ps[2] - 0.3], [ps[2] + 0.3, ps[3] - 0.3]]
    for (const [z0, za] of [[15.0, 17.6], [23.3, 25.3]]) for (const [b0, b1] of bays) {
      const c = (b0 + b1) / 2, hw = (b1 - b0) / 2, arch = pointedZ(hw, z0, za), n = D ? 8 : 4
      for (let k = 0; k < n; k++) {
        const x0 = -hw + (2 * hw * k) / n, x1 = -hw + (2 * hw * (k + 1)) / n
        face(carve, [onFace(F, hu, hv, f, c + x0, arch(x0) - 0.3, 0.2), onFace(F, hu, hv, f, c + x1, arch(x1) - 0.3, 0.2), onFace(F, hu, hv, f, c + x1, arch(x1), 0.2), onFace(F, hu, hv, f, c + x0, arch(x0), 0.2)], faceNormal(F, f))
        if (D) face(carve, [onFace(F, hu, hv, f, c + x0, arch(x0), 0), onFace(F, hu, hv, f, c + x1, arch(x1), 0), onFace(F, hu, hv, f, c + x1, arch(x1), 0.2), onFace(F, hu, hv, f, c + x0, arch(x0), 0.2)], [0, 0, 1])
      }
    }
    // the upper windows: a tall lancet in each outer bay of the 28–40 zone (two on each face)
    for (const [b0, b1] of [bays[0], bays[2]]) panel(win, F, hu, hv, f, (b0 + b1) / 2 + (b0 < 0 ? 0.6 : -0.6), 0.75, 19.0, 22.8, true, 0.05, D ? 4 : 2)
    // the middle zone: a tall window with a gable over it in the centre bay
    panel(win, F, hu, hv, f, 0, 0.8, 10.2, 14.0, true, 0.05, D ? 4 : 2)
    face(carve, [onFace(F, hu, hv, f, -1.6, 14.3, 0.18), onFace(F, hu, hv, f, 1.6, 14.3, 0.18), onFace(F, hu, hv, f, 0, 17.3, 0.18)], faceNormal(F, f))
    if (!passageFace) panel(win, F, hu, hv, f, 0, 0.55, 3.2, 6.6, true, 0.05, D ? 4 : 2)
    // the arcaded frieze under the corbel table
    const nf = D ? 9 : 5
    for (let k = 0; k < nf; k++) {
      const a = -half + 0.6 + ((2 * half - 1.2) * (k + 0.5)) / nf
      panel(win, F, hu, hv, f, a, ((2 * half - 1.2) / nf) * 0.3, 26.0, 27.1, true, 0.04, 3)
    }
    // statues: four kings in the upper zone, four figures in the middle zone
    if (D) {
      const X = (a0: number, w0: number): SFrame => (a, b, z) => onFace(F, hu, hv, f, a0 + a, w0 + z, 0.45 + b)
      for (const a of [-half / 3 - 1.0, -half / 3 + 1.0, half / 3 - 1.0, half / 3 + 1.0]) {
        onBox(carve, f, a - 0.35, a + 0.35, 0, 0.65, 19.3, 19.6, 'v0')
        figure(carve, X(a, 19.6), 0, 0, 0, 1.7, { crown: true, staff: Math.abs(a) > 2.5 }, true)
      }
      for (const a of [-half / 3 - 1.0, half / 3 + 1.0, -half + 1.6, half - 1.6]) {
        onBox(carve, f, a - 0.3, a + 0.3, 0, 0.6, 11.0, 11.3, 'v0')
        figure(carve, X(a, 11.3), 0, 0, 0, 1.5, {}, true)
      }
    }
  }

  // ---- The corbel table, the gallery with its pierced balustrade, the corner turrets.
  const R4 = (u: number, v: number, w: number) => [F(-u, -v, w), F(u, -v, w), F(u, v, w), F(-u, v, w)]
  const mid = F(0, 0, CB + 1)
  {
    const a = R4(hu, hv, CB), b = R4(hu + co, hv + co, GF), c = R4(hu + co, hv + co, GT), ci = R4(hu + co - 0.35, hv + co - 0.35, GT), fl = R4(hu + co - 0.35, hv + co - 0.35, GF)
    for (let i = 0; i < 4; i++) {
      const j = (i + 1) % 4
      faceOut(stone, [a[i], a[j], b[j], b[i]], F(0, 0, CB - 3))
      faceOut(stone, [b[i], b[j], c[j], c[i]], mid)
      face(stone, [c[i], c[j], ci[j], ci[i]], [0, 0, 1])
      faceOut(stone, [ci[j], ci[i], fl[i], fl[j]], F(0, 0, 90))
    }
    face(stone, fl, [0, 0, 1])
    for (const f of faces) {
      const half = (f[0] === 'u' ? hv : hu) + co - 1.0, n = D ? 8 : 4, w = (2 * half) / n
      for (let k = 0; k < n; k++) panel(win, F, hu + co, hv + co, f, -half + w * (k + 0.5), w * 0.3, GF + 0.5, GT - 0.4, !!D, 0.03, 3)
    }
  }
  for (const [su, sv] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
    const cu = su * (hu + co - 0.15), cv = sv * (hv + co - 0.15), n = D ? 8 : 4, r = 0.85
    loft(stone, [ring(F, cu, cv, 0.2, 0.2, 23.6, n, Math.PI / n), ring(F, cu, cv, r, r, 25.4, n, Math.PI / n), ring(F, cu, cv, r, r, 30.2, n, Math.PI / n)])
    if (D) for (let k = 0; k < n; k += 2) {
      const t = Math.PI / n + (2 * Math.PI * k) / n
      bead(win, F(cu + r * 1.01 * Math.cos(t), cv + r * 1.01 * Math.sin(t), 28.6), 0.25, true)
    }
    spire(slate, F, cu, cv, r * 1.1, 30.2, 36.0, n)
    tube(gilt, [F(cu, cv, 35.7), F(cu, cv, 37.2)], D ? 0.05 : 0.08, D ? 4 : 3)
    if (D) bead(gilt, F(cu, cv, 36.6), 0.18)
  }

  // ---- The roof: very steep, hipped, the ridge across the passage; dormers, cresting, finials.
  const RU = 3.8, RV = 3.9, RW0 = 29.2, RW1 = 43.0, RR = 3.6
  hipRoof(slate, F, 0, 0, RU, RV, RR, RW0, RW1, false)
  for (const s of [-1, 1]) {
    tube(gilt, [F(0, s * RR / 2, RW1 - 0.2), F(0, s * RR / 2, 46.0)], D ? 0.08 : 0.12, D ? 4 : 3)
    if (D) { bead(gilt, F(0, s * RR / 2, 44.4), 0.32); bead(gilt, F(0, s * RR / 2, 45.4), 0.2) }
  }
  if (D) {
    // the gilt cresting along the ridge
    for (let k = 0; k <= 6; k++) {
      const v = -RR / 2 + (RR * k) / 6
      tube(gilt, [F(0, v, RW1), F(0, v, RW1 + 0.9)], 0.04, 3)
    }
    tube(gilt, [F(0, -RR / 2, RW1 + 0.8), F(0, RR / 2, RW1 + 0.8)], 0.05, 3)
  }
  // dormers: two tiers on the u faces (toward the street), one on the v faces
  const dormer = (f: FaceName, a: number, z: number, s: number) => {
    // the roof's slope on this face: from the eave line to the ridge
    const H = RW1 - RW0, t = (z - RW0) / H
    const half = f[0] === 'u' ? RU : RV
    const d = f[0] === 'u' ? RU * (1 - t) : RV - (RV - RR / 2) * t // distance of the slope from the centre
    void half
    const G: Xf = (x, y, w) => {
      const base = f === 'u1' ? F(d + y, a + x, w) : f === 'u0' ? F(-d - y, -(a + x), w) : f === 'v1' ? F(-(a + x), d + y, w) : F(a + x, -d - y, w)
      return base
    }
    box(slate, G, -0.55 * s, 0.55 * s, -1.0 * s, 0.6 * s, z, z + 1.6 * s, 'b u0 u1 v1')
    face(stone, [G(-0.55 * s, 0.6 * s, z), G(0.55 * s, 0.6 * s, z), G(0.55 * s, 0.6 * s, z + 1.6 * s), G(-0.55 * s, 0.6 * s, z + 1.6 * s)], faceNormal(F, f))
    for (const sx of [-1, 1]) face(slate, [G(sx * 0.55 * s, -1.0 * s, z), G(sx * 0.55 * s, 0.6 * s, z), G(sx * 0.55 * s, 0.6 * s, z + 1.6 * s), G(sx * 0.55 * s, -1.0 * s, z + 1.6 * s)], sub(G(sx, 0, z), G(0, 0, z)))
    panel(win, G as Xf, 0, 0.6 * s, 'v1', 0, 0.3 * s, z + 0.25 * s, z + 1.3 * s, false, 0.02)
    spire(slate, (x, y, w) => G(x, y + 0.6 * s - 0.6 * s, w), 0, -0.2 * s, 0.85 * s, z + 1.6 * s, z + 2.8 * s, 4, Math.PI / 4)
  }
  for (const f of faces) {
    if (f[0] === 'u') { dormer(f, 0, 31.6, 0.9); dormer(f, 0, 36.0, 0.75) }
    else if (D) dormer(f, 0, 32.8, 0.75)
  }

  // ---- The small round stair turret on the north side (OSM 482524686, 15 m).
  {
    const c = F(0.6, hv + 1.4, 0), n = D ? 10 : 6
    const T: Xf = (u, v, w) => [c[0] + u, c[1] + v, w]
    loft(stone, [ring(T, 0, 0, 1.4, 1.4, 0, n), ring(T, 0, 0, 1.4, 1.4, 13.5, n)])
    spire(slate, T, 0, 0, 1.55, 13.5, 16.0, n)
    for (const w of [4, 8.5]) panel(win, (u, v, ww) => T(u, v, ww), 0, 1.38, 'v1', 0, 0.25, w, w + 1.4, true, 0.02, 2)
  }

  const parts = [stone, carve, slate, win, gilt]
  dropToZero(parts)
  const lit = (p: V3, n: V3) => (n[2] > 0.7 ? 0.25 : p[2] < 30 ? 0.85 : 0.5)
  return [
    { part: stone, material: { ...STONE, floodlight: lit } },
    { part: carve, material: { ...CARVE, floodlight: lit } },
    { part: slate, material: SLATE },
    { part: win, material: PALETTE.window },
    { part: gilt, material: GILT },
  ]
}

const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
void gableRoof

if (import.meta.main) await saveLods('prague-powder-tower', 'Powder Tower', build(false), build(true), { bearing: 0 })
