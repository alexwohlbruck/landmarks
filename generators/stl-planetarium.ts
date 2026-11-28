/**
 * James S. McDonnell Planetarium, Forest Park, St. Louis (1963, Gyo Obata
 * of Hellmuth, Obata + Kassabaum) — procedural, CC0-1.0, no textures.
 * bun generators/stl-planetarium.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0 (round). Anchor
 * -90.2708908, 38.6312579: the centre of OSM way/40701313 (a 39-node
 * circle, radius 25.4–27.2 m).
 *
 * The building: a thin white concrete shell of revolution, a hyperboloid-
 * like flare: a broad, nearly conical skirt from the eaves rising to a high
 * waist, then flaring out again to a wide flat lip, so the top reads like
 * a cooling tower cut off obliquely. Under the eaves, a glazed ground floor
 * ring behind slim radial piers stands on a terrace; the terrace is a white
 * podium where the ground falls to the entrance plaza on the north.
 *
 * Measured (USGS lidar USGS_LPC_MO_StLouis_2017_LAS_2018, flown 2017–18,
 * 0.5 m grid; heights below are 1.5 m under the model's (see LIFT), set 1.8 m above
 * the lidar box's lowest ground, about the map's lowest ground at the
 * footprint's north edge; the terrace round the building is 1.6 m higher,
 * the entrance plaza north of it 1.5 m lower): the shell 6.4 at 24 m out,
 * 7.5 at 22, 8.7 at 20, 9.8 at 18, 11.0 at 16 (means round the building;
 * the south-east side reads up to 1 m higher than the north-west); the lip's
 * top 22.0, its edge 13.6 m out on the south-east and about 11.3 on the
 * north-west (the upper flare leans 1.4 m toward 125°, the "slanted top");
 * a shallow dish inside the lip at 19.9 and a central drum to 22.6; the
 * lip's top is level (23.7–23.9 all round), so the slant is the lean.
 * The profile is one hyperboloid (see OUTER): waist 7.8 m at 17.0 m. The
 * photos give the lip about 1.75 times the waist across, and the lidar puts
 * the lip's edge no further out than 13.6 m, so the waist is 7.8 m.
 * The small drum in the middle of the top is in the lidar (2.7 m over the
 * dish, 2.5 m radius, at every bearing) though no photo shows the roof.
 * Estimated from the photos:
 * scaled against the 53 m eaves), the eaves' edge (26.5 m out, 5.6 m), the
 * glazed ring (23.5 m), the twenty piers, the terrace (1.9 m).
 *
 * Photos:
 *   - "James S. McDonnell Planetarium, Saint Louis Science Center", w_lemay
 *     (Flickr), CC BY-SA 2.0, https://www.flickr.com/photos/59081381@N03/53144143869
 *     (from the north: the entrance podium, the profile) — EVIDENCE;
 *   - the same, https://www.flickr.com/photos/59081381@N03/53144420608
 *     (closer, from the north-west: the flare, the lip, the piers) — EVIDENCE;
 *   - "McDonnell-Planetarium.jpg", Colin.faulkingham, public domain,
 *     https://commons.wikimedia.org/wiki/File:McDonnell-Planetarium.jpg — EVIDENCE.
 * Look-only (GFDL / NC, not used for shape): Jonathunder,
 * "McDonnellPlanetarium.jpg"; several Flickr photos (NC).
 *
 * Night: the shell is floodlit white.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { save } from './atl-tech-tower'
import { quad } from './dc-nationals-park'

const shell = new Part(), win = new Part(), deck = new Part()
const N = 40
const LEAN: [number, number] = [Math.sin((125 * Math.PI) / 180), Math.cos((125 * Math.PI) / 180)]
const ZE = 5.6, ZL = 22.0, SHIFT = 1.4
/** The lean: the rings' centres move 1.4 m toward 125° from the eaves to the lip. */
const centreAt = (z: number): [number, number] => {
  const f = Math.max(0, Math.min(1, (z - ZE) / (ZL - ZE)))
  return [LEAN[0] * SHIFT * f, LEAN[1] * SHIFT * f]
}

/** A surface of revolution through (r, z) points, each ring centred on centreAt(z). */
function lathe(p: Part, prof: [number, number][], outwardUp = true) {
  const segN = prof.slice(0, -1).map(([r0, z0], k) => {
    const [r1, z1] = prof[k + 1], nr = z1 - z0, nz = -(r1 - r0), l = Math.hypot(nr, nz) || 1
    return outwardUp ? [nr / l, nz / l] : [-nr / l, -nz / l]
  })
  const vN = prof.map((_, k) => {
    const a = segN[Math.max(0, k - 1)], b = segN[Math.min(segN.length - 1, k)]
    if (a[0] * b[0] + a[1] * b[1] < 0.8) return null // a crease
    const r = a[0] + b[0], z = a[1] + b[1], l = Math.hypot(r, z) || 1
    return [r / l, z / l]
  })
  for (let k = 0; k < prof.length - 1; k++) for (let i = 0; i < N; i++) {
    const P = (kk: number, ii: number): V3 => { const a = (ii / N) * 2 * Math.PI, c = centreAt(prof[kk][1]); return [c[0] + Math.cos(a) * prof[kk][0], c[1] + Math.sin(a) * prof[kk][0], prof[kk][1]] }
    const Nn = (kk: number, ii: number, seg: number): V3 => { const a = (ii / N) * 2 * Math.PI, q = vN[kk] ?? segN[seg]; return [Math.cos(a) * q[0], Math.sin(a) * q[0], q[1]] }
    const am = ((i + 0.5) / N) * 2 * Math.PI, s = segN[k]
    quad(p, [P(k, i), P(k, i + 1), P(k + 1, i + 1), P(k + 1, i)], [Math.cos(am) * s[0], Math.sin(am) * s[0], s[1]], [Nn(k, i, k), Nn(k, i + 1, k), Nn(k + 1, i + 1, k), Nn(k + 1, i, k)])
  }
}

// The shell's outer face, eaves to lip (lidar below the waist, photos above).
// One hyperboloid of one sheet, r(z) = A·sqrt(1 + ((z − WZ)/B)²), fitted to
// the eaves' edge (26.5 m at 5.6), the lip (13.6 m at 22.0, the lidar's
// widest top) and the lidar's skirt (it passes 15.5 m at 11.0 and 17.8 m at
// 9.8 against the measured 16 and 18): waist 7.8 m at 17.0, B = 3.5.
const A = 7.8, WZ = 17.0, B = 3.5
const rAt = (z: number) => A * Math.sqrt(1 + ((z - WZ) / B) ** 2)
const OUTER: [number, number][] = []
for (let i = 0; i <= 26; i++) { const t = i / 26, z = ZE + (ZL - ZE) * (1 - (1 - t) ** 1.6); OUTER.push([rAt(z), z]) }
lathe(shell, OUTER)
// the lip's flat top, the dish inside it, the central drum
lathe(shell, [[rAt(ZL), ZL], [10.9, ZL], [9.2, 19.9], [3.0, 19.9], [2.6, 19.9], [2.6, 22.6], [0.01, 22.6]])
// the eaves' edge and soffit back to the glazing
lathe(shell, [[23.5, 5.2], [26.5, 5.2], [26.5, 5.6]])
// the glazed ground floor ring under the eaves
const TERRACE = 1.9
lathe(win, [[23.5, TERRACE], [23.5, 5.2]])
// twenty slim radial piers from the terrace to the eaves
for (let i = 0; i < 20; i++) {
  const a = (i / 20) * 2 * Math.PI + 0.08, c = Math.cos(a), s = Math.sin(a), t: [number, number] = [-s, c]
  const P = (r: number, w: number, z: number): V3 => [c * r + t[0] * w, s * r + t[1] * w, z]
  const w = 0.35
  quad(shell, [P(23.5, -w, TERRACE), P(26.2, -w, TERRACE), P(26.2, -w, 5.3), P(23.5, -w, 5.3)], [-t[0], -t[1], 0])
  quad(shell, [P(26.2, w, TERRACE), P(23.5, w, TERRACE), P(23.5, w, 5.3), P(26.2, w, 5.3)], [t[0], t[1], 0])
  quad(shell, [P(26.2, -w, TERRACE), P(26.2, w, TERRACE), P(26.2, w, 5.3), P(26.2, -w, 5.3)], [c, s, 0])
}
// the terrace: a white podium ring, its top the deck the building stands on
lathe(deck, [[26.9, 0], [26.9, TERRACE], [23.5, TERRACE]])

// The map's lowest ground under the footprint (terrain.ts check) is 1.5 m
// below the level the heights above were taken from: lift everything over
// the ground by that much, the podium's wall running down to y = 0 on the
// north where the ground falls to the entrance plaza.
const LIFT = 1.5
for (const part of [shell, win, deck]) for (let k = 1; k < part.pos.length; k += 3) if (part.pos[k] > 0.01) part.pos[k] += LIFT

const lit = (p: V3, n: V3) => (n[2] > 0.9 && p[2] > 19 ? 0.2 : p[2] > 5 ? 0.85 : 0.3)
await save('stl-planetarium', 'James S. McDonnell Planetarium', [
  { part: shell, material: { ...finish('planetarium-white', 0xf1efe9), floodlight: lit } },
  { part: win, material: PALETTE.window },
  { part: deck, material: { ...PALETTE.stone } },
], { height: 22.6 + 1.5, anchor: [38.6312579, -90.2708908], bearing: 0, osm: 'way/40701313' }, 6500)
