/**
 * Feldherrnhalle, Odeonsplatz, Munich: Friedrich von Gärtner, 1841-44, for
 * King Ludwig I, after the Loggia dei Lanzi in Florence; Kelheim limestone.
 * Original procedural geometry, CC0-1.0.
 * bun generators/munich-feldherrnhalle.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = area centroid of the OSM outline way/25505402,
 * 48.141655, 11.577310. Its long walls run at 107.3 degrees, so the
 * catalog bearing is 17.3 and the hall is square to this frame: +y is the
 * open front on the Odeonsplatz (north-north-east), -y the closed back on
 * the Residenzstraße. Symmetric about x = XC = -0.33.
 *
 * Identity, in order: the open loggia of three big round arches, cut
 * right through (real openings, the vaulted hall and its back wall seen
 * through them), with an open arch in each end wall; the pale limestone,
 * the round-arched corbel table, the frieze and the parapet with seated
 * figures at the corners and over the piers; the high podium and the broad
 * central stair between the two marble lions; the bronze statues of Tilly
 * and Wrede in the outer bays and the Bavarian Army Monument at the back of
 * the middle bay; the two heraldic medallions in the spandrels.
 *
 * Evidence:
 *  - plan: OSM outline way/25505402 read in the turned frame, x -17.45..
 *    16.8, y -3.7..8.7 (34.3 x 12.4 m); the stair with the lions' pedestals
 *    is OSM way/312008138 in front of it, x -6.1..5.9, y 8.7..14.5.
 *  - heights: OSM gives 20 m; the photos give more. Scaled from Thomas
 *    Wolf's frontal photo (23.9 px per m from the 35.5 m cornice width):
 *    podium 2.9 m, imposts 11.4-12.3, arch spans 8.45 m (radius 4.22, crown
 *    16.5), archivolt to 17.2, medallions at 17.8, corbel table from 19.9,
 *    frieze to 21.2, cornice 21.7, parapet to 23.0, figures to 24.6. The
 *    piers: outer 2.6 m, inner 1.85 m (same photo). Front wall depth 2.0 m,
 *    end walls 2.4 m, end arches 6 m wide: estimated from Flocci Nivis's
 *    and Rufus46's oblique photos. Stair: twelve steps over the OSM
 *    stair's 5.8 m, 8.4 m wide (the lowest two 11.4 m); standing lions about 3.2 m long and 2.2 m tall on
 *    3.7 m pedestals; Tilly and Wrede
 *    about 3 m on 2.3 m pedestals; the army group 3.5 m on a 2.6 m red
 *    marble base: all estimated from the frontal photos.
 *  - colours from the daylight photos: pale warm limestone, white marble
 *    lions, green bronze statues, the dark bronze army group on its red
 *    marble base. Night (Rafael Fernandes de Oliveira's photo): the front
 *    floodlit, the hall's vault and back wall lit warm.
 *  - elevation 0 (the Odeonsplatz is flat). No lidar in Germany; no 3D
 *    city model.
 *
 * Photos (Wikimedia Commons, all evidence):
 *  - Feldherrnhalle_München.jpg (Thomas Wolf, www.foto-tw.de, CC BY-SA 3.0
 *    de): frontal, the main reference.
 *  - 20230122_Feldherrnhalle.jpg and 2007_Feldherrnhalle_01.jpg (Flocci
 *    Nivis, CC BY 4.0): front, and from the north-west with the west arch.
 *  - Feldherrnhalle_Muenchen-7.jpg (Rufus46, CC BY-SA 3.0): from the
 *    north-east, the east end with its arch, the parapet figures.
 *  - Feldherrnhalle_in_München.jpg (Guido Radig, CC BY-SA 4.0): from the
 *    north-west at the Odeonsplatz.
 *  - Feldherrnhalle_-_Odeonsplatz.jpg (Rafael Fernandes de Oliveira, CC BY-SA
 *    3.0 de): front at night.
 *  - Feldherrnhalle_Muenchen.jpg (Fritz Rudolf Loewa, CC BY-SA 3.0): the
 *    vaults and back wall inside.
 *  - Tilly_Feldherrnhalle_Munich.jpg and Monument_Bavarian_army_
 *    Feldherrnhalle_Munich.jpg (Jebulon, CC0); Feldherrnhalle_München_
 *    2022-09-10_1.jpg (Z thomas, CC BY-SA 4.0): the statues.
 *  - Feldherrnhalle_Muenchen_2_Loewen-1.jpg (Rufus46, CC BY-SA 3.0): the
 *    lions stand (walking), facing out along the stair, on low plinths.
 * No commercial imagery, no 3D city models. No look-only sources.
 *
 * Left out: the vaults' ribs (drawn as a flat ceiling over the arches),
 * the capitals' foliage, the frieze's rosettes and the parapet's tracery
 * panels (drawn as plain bands), the inscription tablets, the carving of
 * the figures (drawn as bold simple sculpture).
 *
 * Doubts: no licensed photo shows the back (south) wall or the roof: the
 * back is drawn plain under the same entablature and parapet, and the roof
 * flat behind the parapet. The end arches' size is estimated from oblique
 * views.
 *
 * Uses the kit in munich-theatinerkirche.ts.
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { arcade } from './phl-independence-hall'
import { save, rect, walls, cap, along, bbox, face, box, obox, slab, statue, lathe, ball, type XY } from './munich-theatinerkirche'

const XC = -0.33
const X0 = -17.45, X1 = 16.8, YB = -3.7, YF = 8.7

/** An ellipsoid, smooth-shaded, centred c with radii r. */
function blob(p: Part, c: V3, r: V3, seg = 6, rings = 4) {
  const P = (i: number, k: number): [V3, V3] => {
    const t = -Math.PI / 2 + (i / rings) * Math.PI, a = (k / seg) * 2 * Math.PI
    const u: V3 = [Math.cos(t) * Math.cos(a), Math.cos(t) * Math.sin(a), Math.sin(t)]
    return [[c[0] + r[0] * u[0], c[1] + r[1] * u[1], c[2] + r[2] * u[2]], [u[0] / r[0], u[1] / r[1], u[2] / r[2]]]
  }
  for (let i = 0; i < rings; i++) for (let k = 0; k < seg; k++) {
    const [a, na] = P(i, k), [b, nb] = P(i, k + 1), [cc, nc] = P(i + 1, k + 1), [d, nd] = P(i + 1, k)
    if (i > 0) p.tri(a, b, cc, undefined, undefined, undefined, [na, nb, nc])
    if (i < rings - 1) p.tri(a, cc, d, undefined, undefined, undefined, [na, nc, nd])
  }
}

/**
 * A raised half-ring (an archivolt) on wall a→b: centred s = c along it,
 * springing at z0, radii r0..r1, standing `out` proud. Built as quads, not
 * by ear clipping.
 */
function arcRing(p: Part, a: XY, b: XY, c: number, z0: number, r0: number, r1: number, out: number, seg = 10) {
  const { P, n, u } = along(a, b)
  const N: V3 = [n[0], n[1], 0]
  for (let k = 0; k < seg; k++) {
    const t0 = (k / seg) * Math.PI, t1 = ((k + 1) / seg) * Math.PI
    const q = (r: number, t: number, o: number) => P(c + r * Math.cos(t), z0 + r * Math.sin(t), o)
    face(p, [q(r1, t0, out), q(r1, t1, out), q(r0, t1, out), q(r0, t0, out)], N)
    const tm = (t0 + t1) / 2, rad: V3 = [u[0] * Math.cos(tm), u[1] * Math.cos(tm), Math.sin(tm)]
    face(p, [q(r1, t0, 0), q(r1, t1, 0), q(r1, t1, out), q(r1, t0, out)], rad)
    face(p, [q(r0, t0, 0), q(r0, t1, 0), q(r0, t1, out), q(r0, t0, out)], [-rad[0], -rad[1], -rad[2]])
  }
}

/** A star-shaped slab on wall a→b around (c, z): radius r(t), fan-built. */
function rosette(p: Part, a: XY, b: XY, c: number, z: number, r: (t: number) => number, out: number, seg = 16) {
  const { P, n, u } = along(a, b)
  const N: V3 = [n[0], n[1], 0]
  const q = (k: number, o: number) => { const t = (k / seg) * 2 * Math.PI; return P(c + r(t) * Math.cos(t), z + r(t) * Math.sin(t), o) }
  for (let k = 0; k < seg; k++) {
    face(p, [P(c, z, out), q(k, out), q(k + 1, out)], N)
    const t = ((k + 0.5) / seg) * 2 * Math.PI
    face(p, [q(k, 0), q(k + 1, 0), q(k + 1, out), q(k, out)], [u[0] * Math.cos(t), u[1] * Math.cos(t), Math.sin(t)])
  }
}

/** A standing (walking) lion facing +y, its plinth at z: about 3.2 m long, 2.2 m tall. */
function lion(p: Part, x: number, y: number, z: number, k = 1.25) {
  bbox(p, p, x - 0.6 * k, y - 1.5 * k, x + 0.6 * k, y + 1.5 * k, z, z + 0.25, 0.08)
  const zb = z + 0.25
  blob(p, [x, y - 0.25 * k, zb + 1.05 * k], [0.46 * k, 1.2 * k, 0.45 * k]) // body
  blob(p, [x, y + 0.75 * k, zb + 1.3 * k], [0.55 * k, 0.48 * k, 0.6 * k]) // mane
  blob(p, [x, y + 1.18 * k, zb + 1.3 * k], [0.25 * k, 0.32 * k, 0.27 * k]) // muzzle
  for (const [dx, dy] of [[-0.22, 0.6], [0.22, 0.85], [-0.22, -0.95], [0.22, -1.15]]) obox(p, p, x + dx * k, y + dy * k, 0, 0.13 * k, 0.15 * k, zb, zb + 0.95 * k)
  obox(p, p, x, y - 1.45 * k, 0, 0.05 * k, 0.05 * k, zb + 0.15 * k, zb + 1.0 * k) // tail
}

/** A standing bronze figure, h tall, facing `ang`: legs, coat, head, arms. */
function figure(p: Part, x: number, y: number, z: number, h: number, ang = Math.PI / 2) {
  const k = h / 2.4, c = Math.cos(ang), s = Math.sin(ang), vx = -s, vy = c
  for (const sv of [-1, 1]) obox(p, p, x + vx * sv * 0.13 * k, y + vy * sv * 0.13 * k, ang, 0.12 * k, 0.11 * k, z, z + 0.95 * k)
  lathe(p, x, y, [[0.36 * k, z + 0.55 * k], [0.3 * k, z + 1.25 * k], [0.36 * k, z + 1.8 * k], [0.4 * k, z + 1.95 * k], [0.14 * k, z + 2.05 * k], [0, z + 2.05 * k]], 6)
  ball(p, x, y, z + 2.22 * k, 0.17 * k, 6)
  obox(p, p, x + vx * 0.43 * k, y + vy * 0.43 * k, ang, 0.1 * k, 0.09 * k, z + 1.15 * k, z + 1.95 * k) // arm down
  obox(p, p, x - vx * 0.36 * k + c * 0.25 * k, y - vy * 0.36 * k + s * 0.25 * k, ang, 0.3 * k, 0.09 * k, z + 1.45 * k, z + 1.65 * k) // arm forward
}

function build() {
  const lime = new Part(), marble = new Part(), shade = new Part(), patina = new Part(), bronze = new Part(), red = new Part()

  const ZP = 2.9 // podium top
  const ZS = 12.3, R = 4.22 // spring line and arch radius
  const ZTOP = 19.9 // top of the arcade walls (the corbel table)
  const TF = 2.0, TS = 2.4, TB = 1.8 // front, end and back wall thickness

  // ------------------------------------------------------------- podium
  walls(lime, rect(X0 + 0.2, YB, X1 - 0.2, YF + 0.2), 0, ZP)
  cap(lime, rect(X0 + 0.2, YB, X1 - 0.2, YF + 0.2), ZP)
  bbox(lime, lime, X0 + 0.05, YB - 0.15, X1 - 0.05, YF + 0.35, ZP - 0.45, ZP, 0.12)

  // ----------------------------------------------- the front arcade
  const W = X1 - X0, outer = 2.6, inner = 1.85, span = (W - 2 * outer - 2 * inner) / 3
  const opens = [0, 1, 2].map((i) => ({ c: outer + span / 2 + i * (span + inner), hw: span / 2, zs: ZS }))
  arcade(lime, (u, w, z) => [X0 + u, YF - w, z], 0, W, TF, ZP, ZTOP, opens, 10, false)
  // ends: two arches, one per end wall
  for (const s of [-1, 1]) {
    const xo = s > 0 ? X1 : X0
    const M = (u: number, w: number, z: number): V3 => [xo - s * w, YB + u, z]
    arcade(lime, M, 0, YF - TF - YB, TS, ZP, ZTOP, [{ c: (YF - TF - YB + TB) / 2, hw: 3.0, zs: ZS }], 10, true)
  }
  // back wall, closed, with a string course at the imposts
  walls(lime, rect(X0 + TS, YB, X1 - TS, YB + TB), ZP, ZTOP)
  bbox(lime, lime, X0 + 0.1, YB - 0.2, X1 - 0.1, YB + 0.5, ZS - 0.9, ZS, 0.1)
  // ceiling over the hall, under the roof
  box(lime, X0 + TS - 0.1, YB + TB - 0.1, X1 - TS + 0.1, YF - TF + 0.1, 17.4, ZTOP)
  // The hall inside is in shadow by day and lit at night: its surfaces in
  // the darker `shade` stone, as the photos show them against the front.
  {
    const xa = X0 + TS, xb = X1 - TS, ya = YB + TB, yb = YF - TF, e = 0.03
    face(shade, [[xa, ya, 17.4 - e], [xb, ya, 17.4 - e], [xb, yb, 17.4 - e], [xa, yb, 17.4 - e]], [0, 0, -1])
    face(shade, [[xa, ya + e, ZP], [xb, ya + e, ZP], [xb, ya + e, 17.4], [xa, ya + e, 17.4]], [0, 1, 0])
    for (const s of [-1, 1]) {
      const x = (s < 0 ? xa : xb) - s * e, yc = YB + (YF - TF - YB + TB) / 2, n: V3 = [-s, 0, 0]
      face(shade, [[x, ya, ZP], [x, yc - 3.0, ZP], [x, yc - 3.0, 17.4], [x, ya, 17.4]], n)
      face(shade, [[x, yc + 3.0, ZP], [x, yb, ZP], [x, yb, 17.4], [x, yc + 3.0, 17.4]], n)
      face(shade, [[x, yc - 3.0, ZS + 3.0], [x, yc + 3.0, ZS + 3.0], [x, yc + 3.0, 17.4], [x, yc - 3.0, 17.4]], n)
    }
    // the inner face of the front wall, above and between the arches
    face(shade, [[xa, yb - e, ZS + R + 0.2], [xb, yb - e, ZS + R + 0.2], [xb, yb - e, 17.4], [xa, yb - e, 17.4]], [0, -1, 0])
  }

  // archivolts: raised mouldings round each front arch, and the imposts
  const front = (s: number, z: number, out: number): V3 => [X0 + s, YF + out, z]
  // on the front (facing +y) s runs westward from X1
  for (const o of opens) arcRing(shade, [X1, YF], [X0, YF], W - o.c, ZS, R, R + 0.65, 0.22)
  // imposts and capitals on the piers, front and inside
  const piers: [number, number][] = [[0, outer], [outer + span, outer + span + inner], [outer + 2 * span + inner, outer + 2 * span + 2 * inner], [W - outer, W]]
  for (const [u0, u1] of piers) {
    bbox(shade, lime, X0 + u0 - 0.15, YF - TF - 0.15, X0 + u1 + 0.15, YF + 0.25, ZS - 0.9, ZS, 0.1)
    bbox(lime, lime, X0 + u0 - 0.1, YF - TF - 0.1, X0 + u1 + 0.1, YF + 0.15, ZP, ZP + 0.7, 0.08)
    // a clustered half column on the face of each pier
    const c = X0 + (u0 + u1) / 2
    lathe(lime, c, YF + 0.05, [[0.42, ZP + 0.7], [0.36, ZP + 1.0], [0.36, ZS - 0.9], [0.0, ZS - 0.9]], 8)
  }
  // the two medallions in the spandrels over the inner piers
  for (const [u0, u1] of piers.slice(1, 3)) {
    const c = X0 + (u0 + u1) / 2, z = 17.9
    rosette(shade, [X1, YF], [X0, YF], X1 - c, z, (t) => 0.95 + 0.25 * Math.cos(4 * t), 0.3)
    rosette(lime, [X1, YF], [X0, YF], X1 - c, z, () => 0.55, 0.5, 8)
  }

  // ------------------------------------------------- entablature, parapet
  const outerRing = rect(X0, YB, X1, YF)
  // corbel table: small brackets under a projecting band
  const segs: [XY, XY][] = [[[X0, YB], [X1, YB]], [[X1, YB], [X1, YF]], [[X1, YF], [X0, YF]], [[X0, YF], [X0, YB]]]
  for (const [a, b] of segs) {
    const { L, P, n } = along(a, b), N: V3 = [n[0], n[1], 0]
    face(shade, [P(0, 19.0, 0.02), P(L, 19.0, 0.02), P(L, ZTOP, 0.02), P(0, ZTOP, 0.02)], N)
    const k = Math.round(L / 0.85)
    for (let i = 0; i < k; i++) {
      const s0 = ((i + 0.22) * L) / k, s1 = ((i + 0.78) * L) / k
      face(lime, [P(s0, 19.25, 0.3), P(s1, 19.25, 0.3), P(s1, ZTOP, 0.3), P(s0, ZTOP, 0.3)], N)
      face(lime, [P(s0, 19.25, 0), P(s1, 19.25, 0), P(s1, 19.25, 0.3), P(s0, 19.25, 0.3)], [0, 0, -1])
    }
  }
  bbox(lime, null, X0 - 0.3, YB - 0.3, X1 + 0.3, YF + 0.3, ZTOP, 21.2, 0.1)
  // the frieze's ornament and the parapet's tracery read as darker bands
  for (const [a, b] of segs) {
    const { L, P, n } = along(a, b), N: V3 = [n[0], n[1], 0]
    face(shade, [P(-0.3, 20.35, 0.32), P(L + 0.3, 20.35, 0.32), P(L + 0.3, 20.95, 0.32), P(-0.3, 20.95, 0.32)], N)
    face(shade, [P(-0.2, 21.95, 0.22), P(L + 0.2, 21.95, 0.22), P(L + 0.2, 22.5, 0.22), P(-0.2, 22.5, 0.22)], N)
  }
  face(lime, [[X0 - 0.3, YB - 0.3, ZTOP], [X1 + 0.3, YB - 0.3, ZTOP], [X1 + 0.3, YF + 0.3, ZTOP], [X0 - 0.3, YF + 0.3, ZTOP]], [0, 0, -1])
  bbox(lime, lime, X0 - 0.6, YB - 0.6, X1 + 0.6, YF + 0.6, 21.2, 21.7, 0.25)
  face(lime, [[X0 - 0.6, YB - 0.6, 21.2], [X1 + 0.6, YB - 0.6, 21.2], [X1 + 0.6, YF + 0.6, 21.2], [X0 - 0.6, YF + 0.6, 21.2]], [0, 0, -1])
  // parapet: a band with posts, the flat roof sunk behind it
  {
    const o = rect(X0 - 0.2, YB - 0.2, X1 + 0.2, YF + 0.2), i = rect(X0 + 0.3, YB + 0.3, X1 - 0.3, YF - 0.3)
    walls(lime, o, 21.7, 22.75)
    walls(lime, [...i].reverse(), 21.2, 22.75)
    for (let k = 0; k < 4; k++) {
      const l = (k + 1) % 4
      lime.quad([o[k][0], o[k][1], 22.75], [o[l][0], o[l][1], 22.75], [i[l][0], i[l][1], 22.75], [i[k][0], i[k][1], 22.75])
    }
    cap(shade, i, 21.2)
    void outerRing
  }
  // posts with seated figures: the corners and over the inner piers, front and back
  const postsU = [0.55, W - 0.55, piers[1][0] + inner / 2, piers[2][0] + inner / 2]
  for (const u of postsU) for (const y of [YB + 0.15, YF - 0.15]) {
    const x = X0 + u
    bbox(lime, lime, x - 0.55, y - 0.55, x + 0.55, y + 0.55, 21.7, 23.3, 0.1)
    statue(marble, x, y, 23.3, 1.6, y > 0 ? Math.PI / 2 : -Math.PI / 2, 5)
  }

  // ------------------------------------------------------ stair and lions
  {
    const SW = 4.2, N = 12, rise = ZP / N, tread = 0.48
    for (let k = 0; k < N; k++) {
      const z1 = ZP - k * rise, y1 = YF + 0.2 + (k + 1) * tread, w = k >= N - 2 ? SW + 1.5 : SW
      box(lime, XC - w, YF + 0.2, XC + w, y1, 0, z1)
    }
    for (const s of [-1, 1]) {
      const x = XC + s * (SW + 0.85)
      bbox(lime, lime, x - 0.85, YF - 1.7, x + 0.85, YF + 2.1, 0, ZP + 0.8, 0.12)
      lion(marble, x, YF + 0.2, ZP + 0.8)
    }
  }

  // ------------------------------------------------------------ statues
  {
    const yS = YF - TF - 1.6
    for (const c of [opens[0].c, opens[2].c]) {
      const x = X0 + c
      bbox(lime, lime, x - 0.75, yS - 0.75, x + 0.75, yS + 0.75, ZP, ZP + 2.3, 0.1)
      figure(patina, x, yS, ZP + 2.3, 3.0)
    }
    // the Bavarian Army Monument: a woman and a warrior with a flag, a lion
    const x = X0 + opens[1].c, y = YB + TB + 1.6
    bbox(red, red, x - 1.7, y - 1.1, x + 1.7, y + 1.1, ZP, ZP + 2.6, 0.12)
    const z = ZP + 2.6
    statue(bronze, x - 0.55, y, z, 3.2, Math.PI / 2, 6)
    figure(bronze, x + 0.35, y + 0.1, z, 3.5)
    blob(bronze, [x + 1.0, y - 0.1, z + 0.6], [0.5, 0.9, 0.6])
    blob(bronze, [x + 1.0, y + 0.55, z + 1.0], [0.38, 0.35, 0.4])
    obox(bronze, bronze, x + 0.9, y + 0.1, 0.5, 0.06, 0.06, z + 1.6, z + 5.6)
    obox(bronze, bronze, x + 0.65, y + 0.1, 0.5, 0.35, 0.05, z + 4.0, z + 5.4)
  }

  const flood = (p: V3, n: V3) => (n[2] > 0.7 ? 0.3 : n[1] > 0.3 || (p[1] < YF - TF && p[1] > YB) ? 1 : 0.6)
  return [
    { part: lime, material: { ...finish('feldherrnhalle-limestone', 0xe8e0cf), floodlight: flood } },
    { part: marble, material: { ...finish('feldherrnhalle-marble', 0xf4f0e6), floodlight: (p: V3, n: V3) => (n[2] > 0.7 ? 0.3 : 0.8) } },
    { part: patina, material: finish('feldherrnhalle-bronze-green', 0x6f9886) },
    { part: bronze, material: finish('feldherrnhalle-bronze', 0x55605c) },
    { part: red, material: finish('feldherrnhalle-red-marble', 0xb48a7c) },
    { part: shade, material: { ...finish('feldherrnhalle-shade', 0xb9b09e), floodlight: (p: V3, n: V3) => (n[2] > 0.7 ? 0 : 0.8) } },
  ]
}

if (import.meta.main) await save('munich-feldherrnhalle', 'Feldherrnhalle', [48.141655, 11.57731], 17.3, build(), 6500)
