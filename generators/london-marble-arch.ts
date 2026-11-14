/**
 * Marble Arch, London (John Nash, 1827-1833, as the state entrance to
 * Buckingham Palace; moved here in 1851): original procedural geometry,
 * CC0-1.0.
 * bun generators/london-marble-arch.ts
 * Writes models/london-marble-arch.glb (low) and
 * models/london-marble-arch.detail.glb (detail, detailZoom 16).
 * Imports the small kit (`pointedArchWall`, `faceXf`, `figure`, `place`) from
 * london-albert-memorial.ts (merge that first).
 *
 * Map frame, turned to BEARING 78.1 (the OSM outline's long axis): +y is
 * compass 78.1 (east-north-east, towards Oxford Street), +x compass 168.1.
 * The two faces look out along +-x (south-south-east to Hyde Park / Park Lane
 * and north-north-west to Edgware Road); the three openings run through
 * along x. z up, metres; z = 0 the paving (flat). Origin = the area centroid
 * of OSM way/41772567.
 *
 * What makes it Marble Arch, and how each is drawn
 * - The white Carrara marble triumphal arch: three openings - the tall
 *   central arch and two lower, narrower side arches - all real through
 *   openings with their barrel soffits.
 * - Four fluted Corinthian columns on each face (faceted shafts, the flutes
 *   as real facets in the detail model), each on its tall pedestal, the
 *   entablature breaking forward over each column; pilasters at the ends.
 * - The attic with a die over each column; rectangular relief panels over
 *   the side arches and the winged Victories in the spandrels of the central
 *   arch (figure reliefs in the detail model); the keystone.
 * - The slim iron gates, set back about 2 m inside the passages, and the
 *   passages' soffits and linings in a shaded marble tone so the openings
 *   read deep (the renderer has no ambient shadow); the relief figures and
 *   spandrel Victories are in both models.
 *
 * Sources
 * - OSM way/41772567 (Historic England 1239534, wikidata Q845529):
 *   the plan, 17.4 x 6.2 m with the column pedestals projecting 1.4 m.
 *   (c) OpenStreetMap contributors, ODbL.
 * - Published: 45 ft (13.4-14 m) high, 60 x 30 ft (Wikipedia "Marble Arch").
 * - Lidar: Environment Agency LIDAR Composite DSM/DTM 1 m, Open Government
 *   Licence v3.0: attic top 13.1-13.3 m above the paving.
 * - Photos (Wikimedia Commons), opened and compared:
 *   "Marble Arch, London.jpg", Tristan Surtel, CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Marble_Arch,_London.jpg
 *     (the south face, near-level: every height, the column spacing, the
 *     openings, the relief panels, the gates);
 *   "London - Marble Arch - View North on Marble Arch 1825-33 by John Nash -
 *     Triumphal arch moved here in 1851.jpg", Txllxt TxllxT, CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:London_-_Marble_Arch_-_View_North_on_Marble_Arch_1825-33_by_John_Nash_-_Triumphal_arch_moved_here_in_1851.jpg
 *     (the face close up: the soffits, spandrel Victories, panels);
 *   "Marble Arch London.jpg", Unodeaquí, CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Marble_Arch_London.jpg
 *   "Marble Arch in London, spring 2013 (4).JPG", Chmee2, CC BY-SA 3.0,
 *     https://commons.wikimedia.org/wiki/File:Marble_Arch_in_London,_spring_2013_(4).JPG
 *   "London - Oxford Street - View West on Marble Arch & Bayswater Road.jpg",
 *     Txllxt TxllxT, CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:London_-_Oxford_Street_-_View_West_on_Marble_Arch_%26_Bayswater_Road.jpg
 *     (the end face and the attic from the east).
 * - Look-only: none.
 *
 * Measured / published / estimated
 * - Measured: the plan (OSM); attic top 13.3 (lidar), dies to 13.75 (photo).
 * - Estimated from the Surtel photo (scaled by the OSM length, 17.4 m):
 *   pedestals 2.3 m, shafts to 9.1, capitals to 10.1, entablature 10.1-12.0,
 *   attic 12.0-13.3; central arch 4.9 m wide springing at 6.2 (crown 8.65),
 *   side arches 2.5 m springing at 4.4; relief panels 7.3-9.6.
 * - Invented: the reliefs' figures (two standing figures per panel, a
 *   Victory lying along each spandrel), simplified.
 */
import { Part, type V3, type MaterialSpec } from './mesh'
import { lathe, face, TAU } from './nyc-columbus-monument'
import { writeModel, box, cbox } from './london-buckingham-palace'
import { place, figure, pointedArchWall, faceXf, tri, LOW, HIGH, type Q } from './london-albert-memorial'

export const BEARING = 78.1

function build(Q: Q) {
  const marble = new Part(), trim = new Part(), gates = new Part(), roof = new Part(), soffit = new Part()
  const XF = 3.1, XP = 4.45, YE = 8.7
  const ZPd = 2.3, ZK = 9.1, ZE = 10.1, ZC = 12.0, ZT = 13.3
  const CA = 2.45, CS = 6.2 // central arch half-span, springing
  const SY = 5.35, SA = 1.25, SS = 4.4 // side arch centre, half-span, springing
  const colY = [-7.6, -3.1, 3.1, 7.6]
  const bev = Q.detail ? 0.1 : 0

  // ===== Piers between the openings, to the entablature ====================
  const piers: [number, number][] = [[-YE, -SY - SA], [-SY + SA, -CA], [CA, SY - SA], [SY + SA, YE]]
  for (const [y0, y1] of piers) {
    box(marble, -XF, y0, XF, y1, 0, ZE)
    // Plinth course.
    cbox(trim, -XF - 0.12, y0 - (y0 === -YE ? 0.12 : 0), XF + 0.12, y1 + (y1 === YE ? 0.12 : 0), 0, 0.45, 0)
  }
  // Arch walls over the openings, with the soffits through.
  pointedArchWall(marble, faceXf(1), 2 * CA + 0.02, -XF, XF, CS, ZE, 2 * CA, CA, Q.detail ? 14 : 8, { soffit })
  for (const s of [-1, 1]) {
    const xf = (u: number, d: number, z: number): V3 => faceXf(1)(u - s * SY, d, z)
    pointedArchWall(marble, xf, 2 * SA + 0.02, -XF, XF, SS, ZE, 2 * SA, SA, Q.detail ? 10 : 6, { soffit })
  }
  for (const sx of [-1, 1]) {
    // Archivolts, imposts, keystone, on both faces.
    const arcBand = (yc: number, r: number, zs: number, n: number) => {
      for (let i = 0; i < n; i++) {
        const a0 = Math.PI * i / n, a1 = Math.PI * (i + 1) / n, w = 0.3, d = 0.08
        const P = (a: number, rr: number, dd: number): V3 => [sx * (XF + dd), yc + rr * Math.cos(a), zs + rr * Math.sin(a)]
        face(trim, P(a0, r, d), P(a1, r, d), P(a1, r + w, d), P(a0, r + w, d), [0, yc, zs])
        face(trim, P(a0, r + w, 0), P(a1, r + w, 0), P(a1, r + w, d), P(a0, r + w, d), [sx * XF, yc, zs])
      }
    }
    arcBand(0, CA, CS, Q.detail ? 14 : 8)
    for (const s of [-1, 1]) arcBand(s * SY, SA, SS, Q.detail ? 10 : 5)
    cbox(trim, sx > 0 ? XF : -XF - 0.2, -0.38, sx > 0 ? XF + 0.2 : -XF, 0.38, CS + CA - 0.1, CS + CA + 1.0, 0)
    for (const s of [-1, 1]) {
      cbox(trim, sx > 0 ? XF : -XF - 0.12, s > 0 ? CA : -CA - 1.0, sx > 0 ? XF + 0.12 : -XF, s > 0 ? CA + 1.0 : -CA, CS - 0.35, CS, 0)
      for (const e of [-1, 1]) cbox(trim, sx > 0 ? XF : -XF - 0.1, s * SY + e * SA - 0.35, sx > 0 ? XF + 0.1 : -XF, s * SY + e * SA + 0.35, SS - 0.3, SS, 0)
      // Relief panel over each side arch: a raised frame, figures inside.
      const yc = s * SY, z0 = 7.3, z1 = 9.6, hw = 0.95
      for (const [a, b, c, d] of [[yc - hw, yc + hw, z0, z0 + 0.15], [yc - hw, yc + hw, z1 - 0.15, z1], [yc - hw, yc - hw + 0.15, z0, z1], [yc + hw - 0.15, yc + hw, z0, z1]])
        cbox(trim, sx > 0 ? XF : -XF - 0.12, a, sx > 0 ? XF + 0.12 : -XF, b, c, d, 0)
      for (const fy of [-0.35, 0.35]) place(marble, [sx * (XF - 0.05), yc + fy, z0 + 0.2], sx > 0 ? -Math.PI / 2 : Math.PI / 2, 1, (q) => figure(q, LOW, 1.9, { arms: [[[0.13, 0, 0.78], [0.2, 0.06, 0.6], [0.16, 0.12, 0.48]]], girth: 1.0 }))
      // A Victory lying along each spandrel of the central arch.
      {
        // Feet down by the impost, head up towards the keystone: rolled to lie along the arch.
        const at: V3 = [sx * (XF - 0.05), s * (CA + 0.55), CS + 0.9]
        const yawF = sx > 0 ? -Math.PI / 2 : Math.PI / 2
        // Local +x of the figure maps to model +y for sx > 0 (yaw -90) and -y for sx < 0.
        const towards = -s * (sx > 0 ? 1 : -1)
        place(marble, at, yawF, 1, (q) => figure(q, LOW, 2.3, { wings: { span: 0.45, lift: 0.4, back: 0.0 }, arms: [[[0.13, 0, 0.78], [0.25, 0.05, 0.9], [0.32, 0.1, 1.02]]], girth: 1.0 }), 88, 0, towards * 0.95)
      }
    }
  }

  // ===== Columns on pedestals ==============================================
  const fl = Q.detail ? 20 : 8
  for (const sx of [-1, 1]) for (const y of colY) {
    const cx = sx * (XP - 0.65)
    cbox(marble, cx - 0.65, y - 0.65, cx + 0.65, y + 0.65, 0, ZPd - 0.3, bev)
    cbox(trim, cx - 0.75, y - 0.75, cx + 0.75, y + 0.75, ZPd - 0.3, ZPd, bev)
    cbox(trim, cx - 0.72, y - 0.72, cx + 0.72, y + 0.72, 0, 0.45, 0)
    // Fluted shaft: alternating radii make real facets.
    {
      const ring = (z: number, r: number): V3[] => Array.from({ length: fl * (Q.detail ? 2 : 1) }, (_, k): V3 => {
        const a = k * TAU / (fl * (Q.detail ? 2 : 1)), rr = Q.detail && k % 2 ? r * 0.9 : r
        return [cx + rr * Math.cos(a), y + rr * Math.sin(a), z]
      })
      lathe(marble, [[0.55, ZPd], [0.5, ZPd + 0.35]], fl, cx, y, false)
      marble.loft([ring(ZPd + 0.35, 0.46), ring(ZK, 0.41)])
    }
    // Corinthian capital and abacus.
    lathe(trim, [[0.42, ZK], [0.55, ZK + 0.6], [0.66, ZE - 0.2]], Q.detail ? 14 : 8, cx, y, false)
    cbox(trim, cx - 0.7, y - 0.7, cx + 0.7, y + 0.7, ZE - 0.2, ZE, 0)
  }
  // Pilasters at the ends of each face and on the end faces.
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
    cbox(marble, sx > 0 ? XF : -XF - 0.15, sy > 0 ? YE - 0.6 : -YE, sx > 0 ? XF + 0.15 : -XF, sy > 0 ? YE : -YE + 0.6, 0.45, ZE, 0)
    cbox(marble, sx > 0 ? XF - 1.2 : -XF, sy > 0 ? YE : -YE - 0.15, sx > 0 ? XF : -XF + 1.2, sy > 0 ? YE + 0.15 : -YE, 0.45, ZE, 0)
  }

  // ===== Entablature, breaking forward over the columns ====================
  cbox(marble, -XF - 0.05, -YE - 0.05, XF + 0.05, YE + 0.05, ZE, ZC - 0.55, 0)
  cbox(trim, -XF - 0.3, -YE - 0.3, XF + 0.3, YE + 0.3, ZC - 0.55, ZC, bev)
  for (const sx of [-1, 1]) for (const y of colY) {
    const x0 = sx > 0 ? XF : -XP - 0.05, x1 = sx > 0 ? XP + 0.05 : -XF
    cbox(marble, x0, y - 0.72, x1, y + 0.72, ZE, ZC - 0.55, 0)
    cbox(trim, sx > 0 ? XF : -XP - 0.3, y - 0.95, sx > 0 ? XP + 0.3 : -XF, y + 0.95, ZC - 0.55, ZC, 0)
  }
  // Architrave fascia line.
  for (const sx of [-1, 1]) cbox(trim, sx > 0 ? XF : -XF - 0.1, -YE, sx > 0 ? XF + 0.1 : -XF, YE, ZE + 0.8, ZE + 0.95, 0)

  // ===== Attic with a die over each column =================================
  cbox(marble, -XF + 0.05, -YE + 0.05, XF - 0.05, YE - 0.05, ZC, ZT - 0.3, bev)
  cbox(trim, -XF - 0.1, -YE - 0.1, XF + 0.1, YE + 0.1, ZT - 0.3, ZT, bev)
  roof.quad([-XF, -YE, ZT + 0.01], [XF, -YE, ZT + 0.01], [XF, YE, ZT + 0.01], [-XF, YE, ZT + 0.01])
  for (const sx of [-1, 1]) for (const y of colY) {
    cbox(marble, sx > 0 ? XF - 0.1 : -XP + 0.15, y - 0.7, sx > 0 ? XP - 0.15 : -XF + 0.1, y + 0.7, ZC, ZT + 0.2, 0)
    cbox(trim, sx > 0 ? XF - 0.1 : -XP + 0.05, y - 0.8, sx > 0 ? XP - 0.05 : -XF + 0.1, y + 0.8, ZT + 0.2, ZT + 0.45, 0)
  }

  // ===== Passages: shaded linings, and the slim iron gates set back ~2 m ====
  {
    const openings: [number, number, number][] = [[0, CA, CS], [-SY, SA, SS], [SY, SA, SS]]
    for (const [yc, hw, zs] of openings) {
      // Lining on the piers' faces inside the passage (the passage reads deep and dark).
      for (const e of [-1, 1]) {
        const y = yc + e * (hw - 0.01)
        face(soffit, [-XF, y, 0], [XF, y, 0], [XF, y, zs], [-XF, y, zs], [0, y + e, zs / 2])
      }
      // Gate: slim bars and three rails, 2 m in from the south-south-east face.
      const gx = XF - 2.0, nb = Math.round(hw * (Q.detail ? 7 : 4))
      for (let i = 0; i <= nb; i++) {
        const y = yc - hw + 0.08 + (2 * hw - 0.16) * i / nb
        const top = zs + Math.sqrt(Math.max(0, hw * hw - (y - yc) * (y - yc))) - 0.15
        cbox(gates, gx - 0.025, y - 0.025, gx + 0.025, y + 0.025, 0, top, 0)
      }
      for (const z of [0.25, zs * 0.55, zs]) cbox(gates, gx - 0.035, yc - hw, gx + 0.035, yc + hw, z, z + 0.07, 0)
    }
  }
  void tri
  return { marble, trim, gates, roof, soffit }
}

function write(Q: Q, file: string, maxTris: number) {
  const { marble, trim, gates, roof, soffit } = build(Q)
  const lit = (p: V3, n: V3) => (n[2] > 0.95 ? 0.35 : Math.min(1, 0.55 + p[2] / 25))
  writeModel('Marble Arch', 'london-marble-arch', [
    { part: marble, material: { ...mat('carrara-marble', 0xf5f3ef, 0.6), floodlight: lit } },
    { part: trim, material: { ...mat('carrara-trim', 0xe8e6e1, 0.6), floodlight: lit } },
    { part: roof, material: mat('marble-arch-roof', 0xcfcdc8) },
    { part: gates, material: mat('marble-arch-gates', 0x4a4f4c, 0.5) },
    { part: soffit, material: mat('marble-arch-soffit', 0xa9a49b, 0.7) },
  ], { bearing: BEARING, osm: 'way/41772567', height: 13.75 }, maxTris, file)
}

function mat(name: string, color: number, roughness = 0.85): MaterialSpec {
  return { name, color, roughness }
}

if (import.meta.main) {
  write(LOW, 'london-marble-arch', 5000)
  write(HIGH, 'london-marble-arch.detail', 40000)
}
