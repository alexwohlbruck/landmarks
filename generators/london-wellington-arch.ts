/**
 * Wellington Arch, Hyde Park Corner, London (Decimus Burton, 1826-1830;
 * moved to this site 1882-1883), with "Peace descending on the Quadriga of
 * War" (Adrian Jones, 1912): original procedural geometry, CC0-1.0.
 * bun generators/london-wellington-arch.ts
 * Writes models/london-wellington-arch.glb (low) and
 * models/london-wellington-arch.detail.glb (detail, detailZoom 16).
 * Imports the sculpture kit from london-albert-memorial.ts (merge that first).
 *
 * Map frame, turned to BEARING 1.6 (the OSM outline's axis): +y is compass
 * 1.6 (north), +x east. z up, metres; z = 0 the ground (flat to 0.5 m).
 * Origin = the area centroid of OSM way/24923117.
 *
 * Layout. The arch faces west and east (Wikipedia: rebuilt in 1882-83
 * "facing west"): the passage runs east-west through the 17.2 m depth, and
 * each main face is the 15.6 m central part of the 22 m long side, which
 * projects 2.3 m beyond the recessed end bays - the notches of the OSM
 * outline. The Quadriga faces west, with the arch.
 *
 * What makes it Wellington Arch, and how each is drawn
 * - Burton's single-opening triumphal arch in pale Portland stone: the round
 *   arch (a real through passage, 5.4 m wide), four free-standing Corinthian
 *   columns in two pairs on each main face, standing out from the wall on a
 *   plinth course; pilasters behind them and at the corners; the full
 *   entablature breaking forward over the central part, with wreath roundels
 *   in the frieze (detail); the recessed end bays with their doors.
 * - The plain attic set back behind a parapet (the viewing walkway), and the
 *   narrower plinth carrying the Quadriga.
 * - The Quadriga, dark patinated bronze (green-grey): four horses abreast,
 *   rearing - head, neck, barrel, raised and folded forelegs, hind legs, tails;
 *   the chariot with its wheels; the boy charioteer holding the reins; the
 *   winged figure of Peace stepping down onto the chariot, wings spread up,
 *   right arm raised with the wreath, the olive branch in her left hand.
 *
 * Sources
 * - OSM way/24923117 (height 16; Historic England 1278092; wikidata Q526804),
 *   (c) OpenStreetMap contributors, ODbL.
 * - Lidar: Environment Agency LIDAR Composite DSM/DTM 1 m, Open Government
 *   Licence v3.0: roof of the arch body and walkway 15.0 m above the ground,
 *   attic 18.5, the plinth 19.9; the Quadriga only partly (to 21.6) - its
 *   bronze is too thin for the 1 m grid, so its height is from the photos.
 * - Wikipedia "Wellington Arch" (orientation, history, the Quadriga).
 * - Photos (Wikimedia Commons), opened and compared:
 *   "Wellington Arch, Hyde Park Corner (2).jpg", Harry Mitchell, CC BY 4.0,
 *     https://commons.wikimedia.org/wiki/File:Wellington_Arch,_Hyde_Park_Corner_(2).jpg
 *     (three-quarter, level: the columns, arch, entablature, attic, group);
 *   "Wellington Arch, Hyde Park Corner (4).jpg", Harry Mitchell, CC BY 4.0,
 *     https://commons.wikimedia.org/wiki/File:Wellington_Arch,_Hyde_Park_Corner_(4).jpg
 *     (main face, frontal: column spacing, attic and plinth widths, the
 *     Quadriga from the front - four rearing horses abreast, the boy, Peace);
 *   "Wellington Monument, Wellington Arch Hyde Park Corner ... 20230821 0061.jpg",
 *     Tilman2007, CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Wellington_Monument,_Wellington_Arch_Hyde_Park_Corner_City_of_Westminster_1231514,_1278092_20230821_0061.jpg
 *     (main and end faces, the Quadriga from the side);
 *   "Wellington Arch Quadriga (Detail).jpg", Phlizz, CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Wellington_Arch_Quadriga_(Detail).jpg
 *     (Peace's head and laurel wreath, the boy, the reins and horses);
 *   "Quadriga, Wellington Arch - 2012-12-27.jpg", Daniel X. O'Neil, CC BY 2.0,
 *     https://commons.wikimedia.org/wiki/File:Quadriga,_Wellington_Arch_-_2012-12-27.jpg
 *   "Quadriga, Wellington Arch, London.jpg", Eluveitie, CC BY-SA 3.0,
 *     https://commons.wikimedia.org/wiki/File:Quadriga,_Wellington_Arch,_London.jpg
 *   "View of Quadriga from the West/East Viewing Platform of the Wellington
 *     Arch (01).jpg", Doyle of London, CC BY-SA 4.0 (URLs under Facing below;
 *     the horses' heads and Peace's wings close up).
 * - Look-only: none.
 *
 * Measured / published / estimated
 * - Measured (lidar): the walkway roof 15.0; attic 18.5-19.9 (modelled 19.0,
 *   the photos read it a little higher), plinth top 20.0.
 * - From OSM: the plan (body 17.2 x 15.6 m, end bays 12.6 x 3.3 m).
 * - Estimated from the photos (scaled by the OSM face width): the column
 *   positions (pairs at +-3.5 and +-6.2 m), the arch (5.4 m wide, springing
 *   at 8.0, crown 10.7), the column, capital and entablature heights (plinth
 *   1.4, capitals 11.4-12.8, entablature 12.8-15.0), the attic
 *   (13.6 x 10 m) and plinth (6.4 x 6 m), the Quadriga's size (horses' withers
 *   2.4 m, drawn a little heavy; Peace 4.5 m tall; her wing tips at 28.4 m;
 *   the photos give 26-29 m, the lidar only catches the horses).
 * - Invented: the exact poses of each horse (all rearing, the outer two
 *   splayed out about 18 degrees as in the frontal photo), the chariot's shape,
 *   the feather count of Peace's wings (five steps on the trailing edge).
 *
 * Facing: the Quadriga faces west, Peace the same way as the horses. Settled
 * by Doyle of London's two photos from the viewing platforms (CC BY-SA 4.0):
 * "View of Quadriga from the West Viewing Platform of the Wellington Arch
 * (01).jpg" shows the horses' heads and raised forelegs; "... from the East
 * Viewing Platform ... (01).jpg" shows Peace's back, wings and the chariot.
 *   https://commons.wikimedia.org/wiki/File:View_of_Quadriga_from_the_West_Viewing_Platform_of_the_Wellington_Arch_(01).jpg
 *   https://commons.wikimedia.org/wiki/File:View_of_Quadriga_from_the_East_Viewing_Platform_of_the_Wellington_Arch_(01).jpg
 * The viewing platforms sit at the attic's east and west ends, which also
 * confirms the passage runs east-west.
 */
import { Part, type V3, type MaterialSpec } from './mesh'
import { tube, ellipsoid, lathe, solid, slab, face, TAU } from './nyc-columbus-monument'
import { writeModel, box, cbox } from './london-buckingham-palace'
import { place, figure, animal, ell, pointedArchWall, faceXf, tri, LOW, HIGH, type Q } from './london-albert-memorial'

export const BEARING = 1.6

/**
 * A feathered wing from `root` (the figure's local frame), side +1 right,
 * -1 left: a broad covert blade at the shoulder and five primaries and
 * secondaries fanned along the trailing edge, each turned a little further
 * up than the one before so the wing curves, the tips stepping into a
 * scalloped outline. `span` is the reach in metres.
 */
function featherWing(q: Part, root: V3, side: 1 | -1, span: number, detail: boolean) {
  const dir = (lift: number, back: number): V3 => [side * Math.cos(lift) * Math.cos(back), -Math.sin(back) * Math.cos(lift), Math.sin(lift)]
  const t = 0.1
  // Covert: the wing's arm and its broad leading part, arching up.
  const U0 = dir(0.95, 0.3), V0: V3 = [-side * Math.sin(0.95) * 0.6, -0.4, -Math.cos(0.95)]
  slab(q, root, U0, V0, [[0, -0.12 * span], [0.6 * span, -0.08 * span], [0.75 * span, 0.15 * span], [0.4 * span, 0.42 * span], [0.02 * span, 0.35 * span]], t * 1.6)
  // Feathers from the inner (secondaries, short, hanging back) to the tip (primaries, long, swept up).
  const nF = detail ? 5 : 4
  for (let i = 0; i < nF; i++) {
    const f = i / (nF - 1)
    const lift = 0.7 + 0.5 * f, back = 0.45 - 0.2 * f
    const U = dir(lift, back), V: V3 = [-side * Math.sin(lift) * 0.4, -0.5, -Math.cos(lift)]
    const o: V3 = [root[0] + U0[0] * span * (0.1 + 0.45 * f), root[1] + U0[1] * span * (0.1 + 0.45 * f), root[2] + U0[2] * span * (0.1 + 0.45 * f)]
    const L = span * (0.5 + 0.4 * f), w = span * 0.2
    slab(q, o, U, V, [[0, -0.02 * span], [L * 0.85, -0.01 * span], [L, w * 0.45], [L * 0.8, w], [0, w * 0.9]], t)
  }
}

function build(Q: Q) {
  const stone = new Part(), trim = new Part(), bronze = new Part(), roof = new Part(), dark = new Part()
  const XW = 7.2, XC = 8.0, XE = 8.6, YC = 7.8, YE = 11.1, XB = 6.3 // wall face, column line, entablature, central half-length, end bays
  const Z0 = 1.4, ZK = 11.4, ZA = 12.8, ZF = 13.6, ZCo = 14.3, ZR = 15.0
  const AW = 2.7, AS = 8.0 // arch half-span, springing
  const bev = Q.detail ? 0.15 : 0

  // ===== Plinth course round the whole outline =============================
  for (const s of [-1, 1]) {
    cbox(stone, -XE, s > 0 ? AW : -YC, XE, s > 0 ? YC : -AW, 0, Z0, bev)
    cbox(stone, -XB - 0.2, s > 0 ? YC - 0.5 : -YE - 0.1, XB + 0.2, s > 0 ? YE + 0.1 : -YC + 0.5, 0, Z0, bev)
  }

  // ===== The body: piers either side of the passage, the arch over it ======
  for (const s of [-1, 1]) {
    box(stone, -XW, s > 0 ? AW : -YC, XW, s > 0 ? YC : -AW, Z0, ZA)
    // End bays, up to the cornice.
    box(stone, -XB, s > 0 ? YC - 0.1 : -YE, XB, s > 0 ? YE : -YC + 0.1, Z0, ZCo)
  }
  // The arch block over the passage on each main face, with the semicircular soffit through.
  pointedArchWall(stone, faceXf(1), 2 * YC, -XW, XW, AS, ZA, 2 * AW, AW, Q.detail ? 14 : 8)
  // The arch's moulded archivolt on both faces, and its keystone.
  for (const sx of [-1, 1]) {
    const pts: V3[] = []
    const n = Q.detail ? 12 : 6
    for (let i = 0; i <= n; i++) { const a = Math.PI * i / n; pts.push([sx * (XW + 0.08), (AW + 0.3) * Math.cos(a), AS + (AW + 0.3) * Math.sin(a)]) }
    tube(trim, pts, pts.map(() => 0.28), 4)
    cbox(trim, sx > 0 ? XW : -XW - 0.25, -0.45, sx > 0 ? XW + 0.25 : -XW, 0.45, AS + AW, AS + AW + 1.2, 0)
    // Impost bands at the springing.
    for (const s of [-1, 1]) cbox(trim, sx > 0 ? XW : -XW - 0.15, s > 0 ? AW : -AW - 1.2, sx > 0 ? XW + 0.15 : -XW, s > 0 ? AW + 1.2 : -AW, AS - 0.4, AS, 0)
  }
  // Pilasters on the wall behind the columns, and at the corners of the central part.
  const colsY = [-6.2, -3.5, 3.5, 6.2]
  for (const sx of [-1, 1]) {
    for (const y of [...colsY, -7.35, 7.35]) cbox(stone, sx > 0 ? XW : -XW - 0.2, y - 0.5, sx > 0 ? XW + 0.2 : -XW, y + 0.5, Z0, ZA, 0)
  }
  // Corner pilasters on the end bays.
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) cbox(stone, sx > 0 ? XB - 0.9 : -XB - 0.15, sy > 0 ? YE - 0.1 : -YE - 0.15, sx > 0 ? XB + 0.15 : -XB + 0.9, sy > 0 ? YE + 0.15 : -YE + 0.1, Z0, ZCo, 0)
  // Doors and plaques in the end bays.
  for (const sy of [-1, 1]) {
    face(dark, [-1.1, sy * (YE + 0.03), Z0], [1.1, sy * (YE + 0.03), Z0], [1.1, sy * (YE + 0.03), Z0 + 3.4], [-1.1, sy * (YE + 0.03), Z0 + 3.4], [0, 0, 3])
    face(trim, [-1.8, sy * (YE + 0.05), 7.6], [1.8, sy * (YE + 0.05), 7.6], [1.8, sy * (YE + 0.05), 9.6], [-1.8, sy * (YE + 0.05), 9.6], [0, 0, 8])
  }
  // The gates in the passage (bronze, dark), set back inside.
  if (Q.detail) {
    for (const s of [-1, 1]) {
      const x = s * 4.0
      for (let i = 0; i <= 12; i++) {
        const y = -AW + 0.1 + (2 * AW - 0.2) * i / 12
        cbox(dark, x - 0.04, y - 0.04, x + 0.04, y + 0.04, 0, AS + Math.sqrt(Math.max(0, AW * AW - y * y)) * 0.92 - 0.3, 0)
      }
      for (const z of [0.4, 3.0, 6.0]) cbox(dark, x - 0.06, -AW, x + 0.06, AW, z, z + 0.12, 0)
    }
  }

  // ===== Columns: free-standing Corinthian, in pairs ======================
  for (const sx of [-1, 1]) for (const y of colsY) {
    const cx = sx * XC
    cbox(stone, cx - 0.72, y - 0.72, cx + 0.72, y + 0.72, Z0, Z0 + 0.45, bev) // base block
    lathe(stone, [[0.65, Z0 + 0.45], [0.6, Z0 + 0.7], [0.53, Z0 + 0.8], [0.5, ZK]], Q.detail ? 14 : 8, cx, y, false)
    // Corinthian capital: bell flaring to the abacus, the leaves in detail.
    lathe(trim, [[0.5, ZK], [0.62, ZK + 0.8], [0.74, ZA - 0.25]], Q.detail ? 14 : 8, cx, y, false)
    cbox(trim, cx - 0.78, y - 0.78, cx + 0.78, y + 0.78, ZA - 0.25, ZA, 0)
    if (Q.detail) for (let k = 0; k < 8; k++) {
      const a = k * TAU / 8
      ellipsoid(trim, [cx + 0.6 * Math.cos(a), y + 0.6 * Math.sin(a), ZK + 0.5], [0.16, 0.16, 0.3], 6, 3)
    }
  }

  // ===== Entablature =======================================================
  // Over the central part (breaking forward over the columns) and the end bays.
  cbox(stone, -XE + 0.05, -YC, XE - 0.05, YC, ZA, ZF, 0) // architrave
  cbox(stone, -XE + 0.05, -YC, XE - 0.05, YC, ZF, ZCo, 0) // frieze
  cbox(trim, -XE - 0.25, -YC - 0.3, XE + 0.25, YC + 0.3, ZCo, ZR - 0.25, bev) // cornice
  cbox(trim, -XE - 0.45, -YC - 0.5, XE + 0.45, YC + 0.5, ZR - 0.25, ZR, bev)
  for (const sy of [-1, 1]) cbox(trim, -XB - 0.35, sy > 0 ? YC : -YE - 0.35, XB + 0.35, sy > 0 ? YE + 0.35 : -YC, ZCo, ZR - 0.2, bev)
  // Architrave fasciae and the frieze roundels (wreaths) on the main faces.
  for (const sx of [-1, 1]) {
    cbox(trim, sx > 0 ? XE - 0.05 : -XE - 0.05, -YC, sx > 0 ? XE + 0.05 : -XE + 0.05, YC, ZF - 0.15, ZF, 0)
    if (Q.detail) for (let i = 0; i < 9; i++) {
      const y = -YC + 0.9 + (2 * YC - 1.8) * i / 8
      const ring = (r: number, d: number) => Array.from({ length: 10 }, (_, k): V3 => [sx * (XE + d), y + r * Math.cos(k * TAU / 10), (ZF + ZCo) / 2 + r * Math.sin(k * TAU / 10)])
      const r0 = ring(0.33, 0), r1 = ring(0.3, 0.12)
      for (let k = 0; k < 10; k++) face(trim, r0[k], r0[(k + 1) % 10], r1[(k + 1) % 10], r1[k], [0, y, (ZF + ZCo) / 2])
      for (let k = 1; k < 9; k++) tri(trim, r1[0], r1[k], r1[k + 1], [0, y, (ZF + ZCo) / 2])
    }
  }

  // ===== Roof walkway, parapet, attic, plinth =============================
  roof.quad([-XE + 0.3, -YC + 0.2, ZR - 0.05], [XE - 0.3, -YC + 0.2, ZR - 0.05], [XE - 0.3, YC - 0.2, ZR - 0.05], [-XE + 0.3, YC - 0.2, ZR - 0.05])
  const PH = 1.05, PT = 0.35
  for (const s of [-1, 1]) {
    box(stone, s > 0 ? XE - PT : -XE, -YC, s > 0 ? XE : -XE + PT, YC, ZR, ZR + PH)
    box(stone, -XE, s > 0 ? YC - PT : -YC, XE, s > 0 ? YC : -YC + PT, ZR, ZR + PH)
  }
  const AX = 5.0, AY = 6.8, ZT = 19.0
  cbox(stone, -AX, -AY, AX, AY, ZR, ZT - 0.45, bev)
  cbox(trim, -AX - 0.2, -AY - 0.2, AX + 0.2, AY + 0.2, ZT - 0.45, ZT, bev)
  cbox(stone, -AX + 0.2, -AY + 0.2, AX - 0.2, AY - 0.2, ZR - 0.2, ZR + 0.5, 0) // base course
  cbox(stone, -AX - 0.15, -AY - 0.15, AX + 0.15, AY + 0.15, ZR, ZR + 0.45, 0)
  const PX = 3.0, PY = 3.2, ZP = 20.0
  cbox(stone, -PX, -PY, PX, PY, ZT, ZP - 0.2, bev)
  cbox(trim, -PX - 0.12, -PY - 0.12, PX + 0.12, PY + 0.12, ZP - 0.2, ZP, bev)

  // ===== The Quadriga ======================================================
  {
    const Qs: Q = Q.detail ? { tube: 10, ell: 14, rows: 7, ring: 16, detail: true } : { tube: 5, ell: 6, rows: 3, ring: 6, detail: true }
    const g = new Part()
    // Four horses abreast, facing west (-x): local +y is the horses' forward.
    const yaw = Math.PI / 2 // local +y → model -x
    const lanes = [-2.4, -0.78, 0.78, 2.4]
    lanes.forEach((ly, i) => {
      const outer = Math.abs(ly) > 1.5
      place(g, [-0.7, ly, ZP], yaw + (outer ? Math.sign(ly) * -0.32 : Math.sign(ly) * -0.08), 1, (q) => animal(q, Qs, 'horse', 2.4, { rear: outer ? 0.7 : 0.6, lift: 1, toss: outer ? -0.05 : -0.15, girth: 1.35 }), 88)
      void i
    })
    // The chariot behind them: the car, its curved front and the wheels.
    const cx = 1.6
    solid(g, [ell(cx, 0, ZP + 0.9, 0.95, 1.1, Qs.detail && Q.detail ? 12 : 6), ell(cx - 0.15, 0, ZP + 2.0, 1.0, 1.15, Qs.detail && Q.detail ? 12 : 6)])
    for (const s of [-1, 1]) {
      const ring = (r: number, w: number) => Array.from({ length: Q.detail ? 14 : 8 }, (_, k, a = k * TAU / (Q.detail ? 14 : 8)): V3 => [cx + 0.2 + r * Math.cos(a), s * (1.25 + w), ZP + 0.95 + r * Math.sin(a)])
      const n = Q.detail ? 14 : 8, o0 = ring(0.95, 0), o1 = ring(0.95, 0.22)
      for (let k = 0; k < n; k++) face(g, o0[k], o0[(k + 1) % n], o1[(k + 1) % n], o1[k], [cx + 0.2, s * 1.36, ZP + 0.95])
      for (let k = 1; k < n - 1; k++) { tri(g, o1[0], o1[k], o1[k + 1], [cx + 0.2, s * 1.0, ZP + 0.95]); tri(g, o0[0], o0[k], o0[k + 1], [cx + 0.2, s * 1.6, ZP + 0.95]) }
    }
    // The pole to the yoke between the middle horses.
    tube(g, [[cx - 0.9, 0, ZP + 1.0], [-1.3, 0, ZP + 1.55]], [0.11, 0.09], 4)
    // The boy charioteer at the front of the car, the reins out to the horses.
    place(g, [cx - 0.75, 0, ZP + 0.9], yaw, 1, (q) => figure(q, Qs, 1.75, { legs: true, arms: [[[0.13, 0, 0.78], [0.2, 0.25, 0.7], [0.15, 0.45, 0.72]], [[-0.13, 0, 0.78], [-0.2, 0.25, 0.7], [-0.15, 0.45, 0.72]]] }), 88)
    for (const ly of lanes) tube(g, [[cx - 1.25, ly * 0.12, ZP + 2.2], [-1.4, ly, ZP + 3.05]], [0.045, 0.045], 3)
    // Peace, stepping down onto the back of the car, wings spread up, wreath raised.
    place(g, [cx + 0.35, 0, ZP + 1.4], yaw, 1, (q) => {
      figure(q, Qs, 4.5, {
        stride: 1, girth: 1.3,
        arms: [
          // Her right arm (+x local) raised high with the wreath.
          [[0.13, 0, 0.8], [0.2, 0.05, 0.98], [0.2, 0.08, 1.2]],
          // Her left arm out to the side, the olive branch.
          [[-0.13, 0, 0.8], [-0.3, 0.08, 0.76], [-0.45, 0.12, 0.78]],
        ],
      })
      // Her wings: spread wide and swept up, curved, with stepped feathers.
      for (const sd of [1, -1] as const) featherWing(q, [sd * 0.33, -0.38, 3.45], sd, 2.7, Qs.detail)
      // The wreath held aloft.
      solid(q, [ell(0.92, 0.36, 5.45, 0.25, 0.25, 8), ell(0.92, 0.36, 5.62, 0.25, 0.25, 8)])
      // The olive branch.
      tube(q, [[-2.0, 0.54, 3.5], [-2.5, 0.6, 3.9]], [0.08, 0.05], 4)
      // Laurel crown and the drapery blowing back.
      solid(q, [ell(0, 0.04, 4.14, 0.27, 0.29, 8), ell(0, 0.04, 4.28, 0.3, 0.32, 8)])
      tube(q, [[0.2, -0.3, 2.7], [0.7, -0.8, 2.35], [1.0, -1.1, 1.8]], [0.4, 0.33, 0.12], Qs.tube)
    }, 88)
    bronze.pos.push(...g.pos); bronze.nrm.push(...g.nrm); bronze.uv.push(...g.uv)
  }
  return { stone, trim, bronze, roof, dark }
}

function write(Q: Q, file: string, maxTris: number) {
  const { stone, trim, bronze, roof, dark } = build(Q)
  const lit = (p: V3, n: V3) => (n[2] > 0.95 ? 0.3 : Math.min(1, 0.5 + p[2] / 30))
  writeModel('Wellington Arch', 'london-wellington-arch', [
    { part: stone, material: { ...mat('wellington-portland', 0xebe3d3), floodlight: lit } },
    { part: trim, material: { ...mat('trim', 0xf6eedf), floodlight: lit } },
    { part: roof, material: mat('roof', 0x9da6ad) },
    { part: bronze, material: { ...mat('quadriga-bronze', 0x56605a, 0.55), floodlight: (p) => (p[2] > 19 ? 0.8 : 0) } },
    { part: dark, material: mat('wellington-gates', 0x4f5a55, 0.6) },
  ], { bearing: BEARING, osm: 'way/24923117', height: 28.4 }, maxTris, file)
}

function mat(name: string, color: number, roughness = 0.85): MaterialSpec {
  return { name, color, roughness }
}
void slab

if (import.meta.main) {
  write(LOW, 'london-wellington-arch', 6500)
  write(HIGH, 'london-wellington-arch.detail', 40000)
}
