/**
 * Manhattan Bridge Arch and Colonnade (Carrère and Hastings, 1910–15) —
 * procedural, CC0-1.0, no textures.
 * bun generators/nyc-manhattan-bridge-arch.ts
 *
 * Local frame: x along the arch's face (bearing 67.1°), y along the roadway
 * toward the plaza and Canal Street (bearing 337.1°, the bridge's own line),
 * z up, metres. Placed at bearing 337.1°. Origin: the centre of the arch
 * block's OSM part (-73.9951141, 40.7152971), on the plaza.
 *
 * What it is: the granite gateway at the Manhattan end of the bridge. A
 * triumphal arch over the roadway, with a coffered barrel vault, a
 * sculptured frieze (Charles Cary Rumsey's buffalo hunt) and tapering
 * sculpture panels on its piers (Carl Augustus Heber's "Spirit of Commerce"
 * and "Spirit of Industry"); from it two curved Tuscan colonnades, two
 * columns deep under an entablature and balustrade, sweep north-west round
 * the plaza and end in solid pylons.
 *
 * Covers and replaces: the outline way/278241774 (colonnades, connectors
 * and pylons, height=14) and the arch part way/1255354003 (height=21). The
 * roadway through the arch is the map's; nothing is drawn on it.
 *
 * Evidence
 * - OSM (measured, in the local frame): the arch block 23.6 x 8.3 m
 *   (x ±11.8, y ±4.13); connectors either side x 11.8–16.5, y -0.2–4.1;
 *   each colonnade 3.3 m deep on a curve from (13.2, 4.1) to (23.6, 28.8)
 *   on its plaza side; the end pylons x 24.1–27.2, y 28.8–33.0. The two
 *   halves mirror each other to within 0.5 m; the west half is used for
 *   both.
 * - USGS lidar NY_NewYorkCity (2017), above the plaza (about 4 m over the
 *   tile's lowest ground): the arch's top 22.5–23 m, the colonnades and
 *   pylons 15 m. The roadway rises southward onto the bridge.
 * - Photos (Wikimedia Commons, all Beyond My Ken, CC BY-SA 4.0 unless
 *   noted): "Manhattan Bridge Arch and Colonnade.jpg" (from the plaza, the
 *   whole composition); "Manhattan Bridge Arch.jpg" (the arch face-on);
 *   "Manhattan Bridge Arch - panoramio.jpg" (Pablo Costa Tirado, CC BY-SA
 *   3.0; from Chrystie Street, the colonnades' depth and column count);
 *   "Manhattan Bridge Plaza, Canal St. and Bowery" (Library of Congress,
 *   public domain; from above, about 1915).
 * - From the face-on photo, scaled to the block's 23.6 m: the opening
 *   11.2 m wide (photos give 10.2–12.6 m; averaged), springing at 7.4 m,
 *   its crown 13.0 m; the archivolt
 *   1.3 m; the frieze 16.4–19.0 m; the cornice to 21.1 m; the attic to
 *   22.6 m; the doors in the piers 1.6 x 3.6 m; the sculpture panels
 *   tapering from 3.6 m wide at 3.5 m to 2.4 m at 15 m.
 * - From the plaza photo, scaled to the arch: the colonnade's stylobate
 *   1.6 m, the column tops 11.2 m, the entablature to 13.4 m, the
 *   balustrade to 15 m.
 *
 * Estimated: the column spacing (about 4 m, eight bays an arm); the column
 * diameter (1.25 m, about a seventh of the shaft); the coffers' rows.
 *
 * Look-only (not evidence): "Manhattan Bridge Arch and Colonnade,
 *   Chinatown" (Billy Wilson, CC BY-NC 2.0, Flickr), at night: the arch's
 *   plaza face floodlit white, the colonnades lit from within. No licensed
 *   night photo was found, so the floodlighting rests on it alone.
 *
 * Doubts: the
 * outer (south-east) faces of the colonnades are only seen far off; they
 * are drawn as open as the plaza side.
 *
 * Simplified: the sculpture is flat shaded panels and blocks; the
 * balustrade is a solid parapet; the lion heads, cartouche, lamps and
 * bollards are left out.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cbox, cylinder, rect } from './dc-white-house'
import { pslab, poffset, saveModel, type XY } from './dc-nga-west'
import { archWall } from './nyc-manhattan-bridge'

/** Points every `step` metres along a polyline, at the middle of each span. */
function along(line: XY[], step: number): XY[] {
  const seg = line.slice(1).map((b, i) => Math.hypot(b[0] - line[i][0], b[1] - line[i][1]))
  const total = seg.reduce((s, l) => s + l, 0), n = Math.max(1, Math.round(total / step))
  const out: XY[] = []
  for (let k = 0; k <= n; k++) {
    let d = (k / n) * total, i = 0
    while (i < seg.length - 1 && d > seg[i]) d -= seg[i++]
    const t = d / seg[i], a = line[i], b = line[i + 1]
    out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t])
  }
  return out
}

/** The polyline `line` moved d to the left of its direction of travel. */
function shift(line: XY[], d: number): XY[] {
  return line.map((p, i) => {
    const a = line[Math.max(0, i - 1)], b = line[Math.min(line.length - 1, i + 1)]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    return [p[0] - ((b[1] - a[1]) / L) * d, p[1] + ((b[0] - a[0]) / L) * d] as XY
  })
}

/** A flat ring (annulus segment) on the face y = y0, facing `side` (±1 in y). */
function archRing(p: Part, y: number, side: 1 | -1, r0: number, r1: number, zs: number, seg = 12) {
  for (let i = 0; i < seg; i++) {
    const a = (Math.PI * i) / seg, b = (Math.PI * (i + 1)) / seg
    const P = (r: number, t: number): V3 => [r * Math.cos(t), y, zs + r * Math.sin(t)]
    const q = [P(r0, a), P(r1, a), P(r1, b), P(r0, b)]
    if (side < 0) p.quad(q[0], q[1], q[2], q[3]); else p.quad(q[3], q[2], q[1], q[0])
  }
}

/**
 * Night: the arch's plaza face is floodlit from the plaza and the vault from
 * below; the colonnades are lit from within, faces turned up barely at all.
 */
function floodlight([x, y, z]: V3, [, ny, nz]: V3): number {
  if (nz > 0.7) return 0.1
  if (Math.abs(x) <= 11.9 && Math.abs(y) <= 4.9) return ny > 0.5 || nz < -0.3 ? 1 : 0.35
  if (z > 15.2) return 0.1
  return Math.abs(x) > 11.9 && y > -0.3 ? 0.7 : 0.2
}

function build() {
  const stone = new Part(), shade = new Part(), vault = new Part(), roof = new Part(), door = new Part()

  // ---- Heights above the plaza.
  const PLINTH = 1.2, SPRING = 7.4, R = 5.6, FRIEZE = 16.4, CORN0 = 19.0, CORN1 = 21.1, TOP = 22.6
  const STYLO = 1.6, CAPS = 11.2, ENT = 13.4, BAL = 15.0
  const AX = 11.8, AY = 4.13

  // ---- The arch block: piers, the vaulted opening, frieze, cornice, attic.
  for (const s of [-1, 1]) {
    const x0 = s < 0 ? -AX : R, x1 = s < 0 ? -R : AX
    cbox(stone, rect(x0 - (s < 0 ? 0.2 : 0), x1 + (s > 0 ? 0.2 : 0), -AY - 0.2, AY + 0.2), 0, PLINTH, { b: 0.1, top: true })
    cbox(stone, rect(x0, x1, -AY, AY), PLINTH, SPRING, { top: false })
    cbox(stone, rect(s < 0 ? -R - 0.5 : R - 0.15, s < 0 ? -R + 0.15 : R + 0.5, -AY - 0.15, AY + 0.15), SPRING - 0.6, SPRING, { b: 0.1 }) // impost
  }
  archWall(stone, vault, -AX, AX, -AY, AY, 0, SPRING, R, FRIEZE, 12)
  // coffer bands across the vault, a shade deeper
  for (const y of [-2.6, -0.9, 0.9, 2.6]) {
    for (let i = 0; i < 12; i++) {
      const a = (Math.PI * i) / 12, b = (Math.PI * (i + 1)) / 12, r = R - 0.03
      shade.quad([r * Math.cos(a), y - 0.6, SPRING + r * Math.sin(a)], [r * Math.cos(b), y - 0.6, SPRING + r * Math.sin(b)], [r * Math.cos(b), y + 0.6, SPRING + r * Math.sin(b)], [r * Math.cos(a), y + 0.6, SPRING + r * Math.sin(a)])
    }
  }
  cbox(stone, rect(-AX, AX, -AY, AY), FRIEZE, CORN0, { top: false })
  cbox(stone, rect(-AX - 0.7, AX + 0.7, -AY - 0.7, AY + 0.7), CORN0, CORN1, { b: 0.35, top: roof, bottom: true })
  cbox(stone, rect(-AX + 0.5, AX - 0.5, -AY + 0.5, AY - 0.5), CORN1, TOP, { b: 0.15, top: roof })

  for (const side of [-1, 1] as const) {
    const y = side * AY, d = side * 0.06
    // the archivolt, standing proud of the face, and its keystone
    archRing(stone, y + side * 0.18, side, R, R + 1.3, SPRING)
    cbox(stone, rect(-0.8, 0.8, Math.min(y, y + side * 0.3), Math.max(y, y + side * 0.3)), SPRING + R - 0.3, FRIEZE + 0.4, { b: 0.08 })
    // the frieze's relief panel
    const q = (x0: number, x1: number, z0: number, z1: number, p: Part, dd = d) => {
      const v: V3[] = [[x0, y + dd, z0], [x1, y + dd, z0], [x1, y + dd, z1], [x0, y + dd, z1]]
      if (side > 0) p.quad(v[3], v[2], v[1], v[0]); else p.quad(v[0], v[1], v[2], v[3])
    }
    q(-6.6, 6.6, FRIEZE + 0.5, CORN0 - 0.4, shade)
    for (const s of [-1, 1]) {
      const xc = s * 9.05
      // the tapering sculpture panel on each pier, with its group in relief
      const z0 = 3.5, z1 = 15.0, w0 = 1.8, w1 = 1.2
      const v: V3[] = [[xc - w0, y + d, z0], [xc + w0, y + d, z0], [xc + w1, y + d, z1], [xc - w1, y + d, z1]]
      if (side > 0) shade.quad(v[3], v[2], v[1], v[0]); else shade.quad(v[0], v[1], v[2], v[3])
      cbox(stone, rect(xc - 1.5, xc + 1.5, Math.min(y, y + side * 0.7), Math.max(y, y + side * 0.7)), 4.6, 7.8, { b: 0.3 })
      // the door under it, in a pedimented frame
      cbox(stone, rect(xc - 1.4, xc + 1.4, Math.min(y, y + side * 0.25), Math.max(y, y + side * 0.25)), PLINTH, 4.4, { b: 0.08 })
      q(xc - 0.8, xc + 0.8, PLINTH, 4.0, door, side * 0.31)
    }
  }

  // ---- Colonnades: the west arm from OSM, the east its mirror.
  const INNER: XY[] = [[-13.23, 4.12], [-14.28, 5.33], [-16.24, 7.89], [-17.98, 10.58], [-19.51, 13.4], [-20.81, 16.33], [-21.87, 19.36], [-22.69, 22.46], [-23.27, 25.61], [-23.58, 28.81]]
  const OUTER: XY[] = [[-16.64, 4.12], [-17.73, 5.46], [-19.73, 8.27], [-21.51, 11.23], [-23.04, 14.32], [-23.7, 15.91], [-24.86, 19.17], [-25.33, 20.82], [-26.08, 24.19], [-26.56, 27.61], [-27.12, 28.81]]
  for (const s of [-1, 1]) {
    const m = (p: XY): XY => [-s * p[0], p[1]] // s = -1: west as drawn; s = 1: mirrored east
    const inner = INNER.map(m), outer = OUTER.map(m)
    const ring: XY[] = [...inner, ...[...outer].reverse()]
    pslab(stone, ring, 0, STYLO, 0.15, true)
    pslab(stone, ring, CAPS, ENT - 0.5, 0, false, true)
    pslab(stone, poffset(ring, 0.35), ENT - 0.5, ENT, 0.15, false, true)
    pslab(stone, poffset(ring, -0.15), ENT, BAL, 0.12, roof)
    // two rows of Tuscan columns, 0.8 m in from each face of the arm
    const westward = s < 0 ? 1 : -1 // inner runs north; its left is west for the west arm
    for (const row of [shift(inner, westward * 0.8), shift(outer, -westward * 0.8)]) {
      for (const [x, y] of along(row, 4.0).slice(1)) {
        cbox(stone, rect(x - 0.8, x + 0.8, y - 0.8, y + 0.8), STYLO, STYLO + 0.4, { b: 0.08, top: true })
        cylinder(stone, x, y, 0.62, STYLO + 0.4, CAPS - 0.5, 10, 0.54)
        cylinder(stone, x, y, 0.54, CAPS - 0.5, CAPS - 0.3, 10, 0.68)
        cbox(stone, rect(x - 0.78, x + 0.78, y - 0.78, y + 0.78), CAPS - 0.3, CAPS, { b: 0.08, bottom: true, top: false })
      }
    }
    // the connector between the arch and the arm, solid and rusticated
    const cx0 = s < 0 ? -16.5 : AX, cx1 = s < 0 ? -AX : 16.5
    cbox(stone, rect(cx0, cx1, -0.2, 4.12), 0, ENT, { top: false })
    cbox(stone, rect(cx0 - (s < 0 ? 0.35 : 0), cx1 + (s > 0 ? 0.35 : 0), -0.55, 4.12), ENT - 0.5, ENT, { b: 0.15, top: false, bottom: true })
    cbox(stone, rect(cx0, cx1, -0.05, 4.12), ENT, BAL, { b: 0.12, top: roof })
    // the end pylon
    const px0 = s < 0 ? -27.15 : 24.05, px1 = s < 0 ? -24.05 : 27.15
    cbox(stone, rect(px0, px1, 28.8, 33.0), 0, ENT - 0.5, { top: false })
    cbox(stone, rect(px0 - 0.35, px1 + 0.35, 28.45, 33.35), ENT - 0.5, ENT, { b: 0.15, top: false, bottom: true })
    cbox(stone, rect(px0 + 0.1, px1 - 0.1, 28.9, 32.9), ENT, BAL + 0.4, { b: 0.12, top: roof })
    const pf: V3[] = [[px0 + 0.6, 33.06, 2.0], [px1 - 0.6, 33.06, 2.0], [px1 - 0.6, 33.06, ENT - 1.2], [px0 + 0.6, 33.06, ENT - 1.2]]
    shade.quad(pf[3], pf[2], pf[1], pf[0])
  }

  return [
    { part: stone, material: { ...finish('mb-arch-granite', 0xe6e0cf), floodlight } },
    { part: shade, material: finish('mb-arch-granite-shade', 0xc8c1af) },
    { part: vault, material: { ...finish('mb-arch-vault', 0xd2cbb9), floodlight } },
    { part: roof, material: PALETTE.roof },
    { part: door, material: finish('mb-arch-door', 0x5d6f80) },
  ]
}

if (import.meta.main) {
  await saveModel('nyc-manhattan-bridge-arch', 'Manhattan Bridge Arch and Colonnade', build(), {
    source: 'generators/nyc-manhattan-bridge-arch.ts', bearing: 337.1, osm: 'way/278241774', height: 22.6,
  }, 6500)
}
