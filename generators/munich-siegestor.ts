/**
 * Siegestor, Ludwigstraße / Leopoldstraße, Munich: triumphal arch to the
 * Bavarian army, by Friedrich von Gärtner, completed by Eduard Metzger
 * 1852; the quadriga of Bavaria in a chariot drawn by four lions by Johann
 * Martin von Wagner, cast by Ferdinand von Miller. Badly damaged in 1944
 * and rebuilt plain on the south side, with Wilhelm Hausenstein's
 * inscription "Dem Sieg geweiht, vom Krieg zerstört, zum Frieden mahnend".
 * Original procedural geometry, CC0-1.0.
 * bun generators/munich-siegestor.ts
 *
 * Writes two levels of detail in the same frame:
 * - models/munich-siegestor.glb, the low model;
 * - models/munich-siegestor.detail.glb (from zoom 17): the same arch with
 *   rounder arches and columns, and the quadriga and the four Victorias
 *   sculpted at about three times the resolution: manes in locks, toes,
 *   the chariot's spoked wheels, the reins, Bavaria's wreath and drapery.
 *
 * Map frame of this model: x along the arch (+x east-south-east), y
 * through it (+y north-north-east, the Leopoldstraße / Schwabing side, the
 * side the quadriga faces), z up, metres; origin at the anchor on the
 * ground. Catalog bearing 18.6: the outline's short sides run at 18.6
 * degrees. Anchor = area centroid of way/22727580, 48.152350, 11.582140
 * (OSM's centroid is within 0.05 m of the given point). Symmetric about
 * x = 0.
 *
 * Identity, in order: the Roman three-bay arch (a tall round central arch
 * between two lower ones) with four free-standing Corinthian columns on
 * tall pedestals on each long face, carrying ressauts of the entablature;
 * the tall plain attic; on top, the green bronze quadriga facing north:
 * Bavaria standing in her chariot with a spear, holding the reins of four
 * lions walking abreast, the outer two turned outward; on the north face,
 * the four Victorias standing over the columns and two roundels in the
 * attic; the pale limestone.
 *
 * Evidence:
 *  - plan: OSM way/22727580 (building=triumphal_arch, height 21, width 24),
 *    read in the turned frame: 23.5 x 10.0 m. Published (de.wikipedia,
 *    Siegestor): 24 m wide, 21 m high, 12 m deep, the quadriga 22 t.
 *    Drawn: the body 24.0 x 8.8 m, the column ressauts standing 1.2 m out
 *    on both faces (11.2 m over them).
 *  - heights and widths measured on Delso's frontal photo of the south face
 *    (DD 01, full size, 37.7 px/m from the 24 m width): attic top 21.0;
 *    entablature 13.5-15.9 (frieze 14.1-14.9, cornice to 15.9);
 *    capitals 12.3-13.6; shafts 4.2-12.3, 1.3 m thick at the foot;
 *    pedestals 0-4.2, 1.6 m wide; columns at x +-4.35 and +-10.75; the
 *    central arch 5.7 m wide, semicircular, apex 12.1, impost 8.5-8.9; the
 *    side arches 3.7 m wide at x +-7.4, apex 7.3, impost 5.2-5.6; relief
 *    panels 3.95 m wide, 9.7-12.1; the quadriga's plinth 8.0 m wide,
 *    21.0-22.8.
 *  - the quadriga from Olli1800's frontal photo (north) and Fentriss's
 *    (scaled from the plinth's 8.0 m): the lions 2.35 m to the top of the
 *    mane, 1.9 m apart, the outer pair turned ~25 degrees outward, the
 *    inner ~8; Bavaria's head 5.6 m above the plinth, standing on the
 *    chariot floor ~1.2 m up; the spear in her left hand to 5.8 m, the
 *    reins in her right; the laurel wreath; the mantle over her left
 *    shoulder. From the south (DD 01, cropped) her back, the chariot's two
 *    wheels ~1.35 m across. Depths (a lion 3.6 m long, the chariot 1.7 m)
 *    are estimated from the oblique photos (Romero, Flocci Nivis).
 *  - the Victorias: Flocci Nivis' and Romero's north-face photos; ~2.6 m
 *    winged figures on blocks over the four column ressauts (estimated).
 *  - colours: warm grey-cream limestone (pulled darker and warmer than the
 *    palette's stone after review), the green bronze patina, a dark shadow
 *    tone for the lettering and the reliefs' ground, from the daylight photos.
 *  - night: Martin Falbisoner's and Thomas Wolf's dusk photos: the arch
 *    floodlit warm all over, the quadriga lit from below.
 *  - elevation 0 (a flat traffic island). No lidar in Germany; no
 *    Bavarian 3D city model used.
 *
 * Photos (Wikimedia Commons, all evidence):
 *  - Puerta_de_la_Victoria,_Múnich,_Alemania,_2012-04-30,_DD_01.JPG and
 *    DD_03.JPG (Diego Delso, CC BY-SA 3.0): south face frontal; the
 *    south-west corner.
 *  - 20221007_Siegestor_01.jpg, _02, _03, _05 (Flocci Nivis, CC BY 4.0):
 *    north face and corners, the Victorias, the quadriga from the north.
 *  - Quadriga_Siegestor.jpg (Olli1800, CC BY-SA 3.0): the quadriga frontal.
 *  - Muestquadriga062019c99.jpg (Fentriss, CC0): the quadriga close up.
 *  - München_-_Siegestor.jpg (Fred Romero, CC BY 2.0): the north face from
 *    below, Victorias, roundels, reliefs.
 *  - München,_Siegestor_v_S,_13.jpeg (Renardo la vulpo, CC0): south.
 *  - Siegestor_Munich_at_Dusk.JPG (Martin Falbisoner, CC BY-SA 4.0): night.
 * No commercial imagery, no 3D city models. No look-only sources.
 *
 * The two inscriptions are drawn as dark letter-like marks in words (not
 * readable text), so the frieze and attic read as lettered; the reliefs as
 * framed panels with a dark sunk ground and bold figure masses; the
 * capitals with acanthus rows and volutes (detail model); the attic's
 * raised end blocks over the outer columns. Left out: the coffers in the vaults,
 * the anti-pigeon spikes, the column flutes.
 *
 * Doubts: the depth (OSM 10 m, published 12 m; drawn 8.8 + ressauts); the
 * quadriga's depth and the lions' side profiles are estimated from oblique
 * photos; the Victorias' attributes are simplified to wreaths.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import {
  TAU, add, archBand, boxAt, latheHard, cap, ellipsoid, floodWalls, lathe, limb, mul, panelOn, piercedFace, place, prism, quadN,
  rect, save, similarity, surface, tunnel, unit, discOn, lerp, smooth, clamp, type Layer, type Opening,
} from './munich-karlstor'

// ---------------------------------------------------------------------------
// Sculpture, each in its own frame: facing +y, z up, origin on the ground
// under it. R is the resolution (1 low, ~3 detail).

/** A torus-like ring in a vertical plane: a wheel's rim. Centre c, axis along x. */
function wheel(p: Part, c: V3, r: number, t: number, R: number, spokes: boolean) {
  const n = Math.max(8, Math.round(12 * R)), k = 4 + 2 * (R > 1 ? 1 : 0)
  const grid: V3[][] = []
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * TAU
    const ca = Math.cos(a), sa = Math.sin(a)
    grid.push(Array.from({ length: k }, (_, j) => {
      const b = (j / k) * TAU
      const rr = r + t * Math.cos(b)
      return [c[0] + t * 1.2 * Math.sin(b), c[1] + rr * ca, c[2] + rr * sa] as V3
    }))
  }
  surface(p, grid, true, (q) => {
    const dy = q[1] - c[1], dz = q[2] - c[2], l = Math.hypot(dy, dz) || 1
    return [c[0], c[1] + (dy / l) * r, c[2] + (dz / l) * r]
  })
  // Hub and spokes (or a disc in the low model).
  if (spokes) {
    for (let s = 0; s < 8; s++) {
      const a = (s / 8) * TAU
      limb(p, [c, [c[0], c[1] + r * Math.cos(a), c[2] + r * Math.sin(a)]], [0.04, 0.04], 4, [1, 0, 0], false)
    }
    ellipsoid(p, c, [0.14, 0.12, 0.12], 8, 4)
  } else {
    const disc = (sx: number) => {
      for (let i = 0; i < 10; i++) {
        const a = (i / 10) * TAU, b = ((i + 1) / 10) * TAU
        const A: V3 = [c[0] + sx * 0.03, c[1] + r * Math.cos(a), c[2] + r * Math.sin(a)], B: V3 = [c[0] + sx * 0.03, c[1] + r * Math.cos(b), c[2] + r * Math.sin(b)]
        const C: V3 = [c[0] + sx * 0.03, c[1], c[2]]
        const nrm: V3 = [sx, 0, 0]
        p.tri(C, A, B, undefined, undefined, undefined, [nrm, nrm, nrm])
      }
    }
    disc(1); disc(-1)
  }
}

/** A lion walking, ~3.6 m long and 2.35 m to the top of its mane. `lift` raises the right fore paw a little. */
export function lion(p: Part, R: number) {
  const k = 8 * R
  // Torso: deep chest, narrower waist, rounded haunches.
  limb(p, [[0, -1.45, 1.02], [0, -1.0, 1.08], [0, -0.35, 1.06], [0, 0.3, 1.15], [0, 0.85, 1.3]],
    [[0.45, 0.46], [0.47, 0.48], [0.41, 0.42], [0.5, 0.52], [0.56, 0.6]], k)
  // Haunches.
  if (R > 0.6) for (const s of [-1, 1]) ellipsoid(p, [s * 0.22, -1.15, 1.0], [0.3, 0.48, 0.45], 8 * R, 5 * R)
  // The mane: a heavy collar over shoulders, neck and chest, hanging to
  // the knees between the forelegs; the head set into it.
  const MC: V3 = [0, 0.98, 1.52], MR: V3 = [0.82, 0.7, 0.85]
  ellipsoid(p, MC, MR, 12 * R, 7 * R, 0, -0.2)
  ellipsoid(p, [0, 1.2, 1.0], [0.48, 0.36, 0.5], 8 * R, 5 * R)
  if (R > 1) {
    // Locks: tongues of mane falling in rows down the collar's front and sides.
    for (let row = 0; row < 4; row++) for (let i = 0; i < 11; i++) {
      const phi = -2.4 + (i / 10) * 4.8 + (row % 2) * 0.2 // round from the front (+y)
      const z = MC[2] + MR[2] * (0.75 - row * 0.38)
      const f = Math.sqrt(Math.max(0, 1 - ((z - MC[2]) / MR[2]) ** 2)) * 0.98
      const base: V3 = [MC[0] + MR[0] * f * Math.sin(phi), MC[1] + MR[1] * f * Math.cos(phi), z]
      const out: V3 = unit([Math.sin(phi) * 0.45, Math.cos(phi) * 0.45, -1])
      limb(p, [base, add(base, mul(out, 0.22)), add(base, mul(out, 0.42))], [0.13, 0.1, 0.035], 6, [0, 0, 1], 'end')
    }
  }
  // Head: skull, muzzle, nose, jaw, ears, brows.
  ellipsoid(p, [0, 1.52, 1.84], [0.42, 0.42, 0.42], 10 * R, 6 * R)
  ellipsoid(p, [0, 1.9, 1.66], [0.28, 0.25, 0.22], 8 * R, 5 * R, 0, 0.15)
  if (R > 0.6) ellipsoid(p, [0, 2.07, 1.74], [0.13, 0.1, 0.09], 6 * R, 4 * R)
  ellipsoid(p, [0, 1.8, 1.45], [0.2, 0.2, 0.1], 8 * R, 4 * R, 0, 0.2)
  for (const s of [-1, 1]) {
    if (R > 0.6) ellipsoid(p, [s * 0.32, 1.42, 2.2], [0.1, 0.06, 0.11], 6 * R, 4 * R)
    if (R > 1) {
      ellipsoid(p, [s * 0.16, 1.84, 1.97], [0.13, 0.09, 0.055], 6, 4) // brows
      ellipsoid(p, [s * 0.15, 1.87, 1.9], [0.05, 0.03, 0.04], 6, 4) // eyes, set under the brows
    }
  }
  // Legs: the right fore stepping forward, the others planted.
  const legR = (a: number, b: number, c: number): (number | [number, number])[] => [a, b, c, c * 0.95]
  limb(p, [[0.3, 0.8, 1.05], [0.33, 0.95, 0.58], [0.32, 1.0, 0.25], [0.32, 1.06, 0.12]], legR(0.3, 0.21, 0.17), 6 * R, [0, 0, 1], 'end')
  limb(p, [[-0.3, 0.75, 1.05], [-0.34, 1.05, 0.62], [-0.33, 1.25, 0.28], [-0.33, 1.32, 0.12]], legR(0.3, 0.21, 0.17), 6 * R, [0, 0, 1], 'end')
  for (const s of [-1, 1]) {
    limb(p, [[s * 0.3, -1.05, 1.05], [s * 0.34, -0.85, 0.66], [s * 0.31, -1.3, 0.4], [s * 0.31, -1.18, 0.12]], [0.34, 0.24, 0.16, 0.15], 6 * R, [0, 0, 1], 'end')
  }
  // Paws.
  for (const [x, y] of [[0.32, 1.16], [-0.33, 1.42], [0.31, -1.06], [-0.31, -1.06]] as [number, number][]) {
    ellipsoid(p, [x, y + 0.04, 0.11], [0.2, 0.26, 0.11], 8 * R, 4 * R)
    if (R > 1) for (const t of [-0.1, -0.035, 0.035, 0.1]) ellipsoid(p, [x + t, y + 0.17, 0.07], [0.04, 0.06, 0.05], 6, 3)
  }
  // Tail, curving down to a tuft.
  limb(p, [[0, -1.75, 1.2], [0, -2.05, 0.95], [0.05, -2.15, 0.55], [0.12, -2.05, 0.25]], [0.09, 0.07, 0.06, 0.05], 5 * R, [0, 0, 1], 'end')
  ellipsoid(p, [0.13, -2.0, 0.2], [0.09, 0.09, 0.13], 6 * R, 4 * R)
}

/**
 * A standing draped woman, `h` metres from the soles to the top of the
 * head, as a smooth body from hem to neck: `prof` rows of [z, half-width,
 * half-depth] in units of h, and folds raised on it.
 */
export function drapedBody(p: Part, h: number, R: number, folds: { a: number; z0: number; a1: number; z1: number; amp: number; w: number }[]) {
  const prof = [
    [0.0, 0.15, 0.12], [0.04, 0.148, 0.115], [0.2, 0.14, 0.108], [0.38, 0.13, 0.098], [0.5, 0.12, 0.085], [0.56, 0.105, 0.075],
    [0.62, 0.11, 0.07], [0.7, 0.118, 0.075], [0.76, 0.125, 0.07], [0.8, 0.12, 0.065], [0.83, 0.07, 0.05], [0.845, 0.04, 0.04],
  ]
  const at = (z: number) => {
    for (let i = 0; i < prof.length - 1; i++) if (z <= prof[i + 1][0]) {
      const t = (z - prof[i][0]) / (prof[i + 1][0] - prof[i][0])
      return [lerp(prof[i][1], prof[i + 1][1], t), lerp(prof[i][2], prof[i + 1][2], t)]
    }
    return [prof[prof.length - 1][1], prof[prof.length - 1][2]]
  }
  const NU = Math.max(8, Math.round(16 * R)), NV = Math.max(5, Math.round(9 * R))
  const grid: V3[][] = []
  for (let k = 0; k <= NV; k++) {
    const z = (k / NV) * 0.845
    const [a, b] = at(z)
    grid.push(Array.from({ length: NU }, (_, i) => {
      const t = (i / NU) * TAU
      let r = 1
      // Hanging folds below the waist, deeper toward the hem.
      r += (0.05 + 0.03 * (R > 1 ? 1 : 0)) * smooth((0.55 - z) / 0.4) * Math.cos((R > 1 ? 11 : 7) * t)
      for (const f of folds) {
        const zz = clamp((z - f.z0) / (f.z1 - f.z0), 0, 1)
        if (z < Math.min(f.z0, f.z1) - 0.03 || z > Math.max(f.z0, f.z1) + 0.03) continue
        const ac = lerp(f.a, f.a1, zz)
        let d = Math.abs(((t - ac + Math.PI * 3) % TAU) - Math.PI)
        r += f.amp * Math.exp(-((d / f.w) ** 2))
      }
      return [a * h * Math.cos(t) * r, b * h * Math.sin(t) * r, z * h] as V3
    }))
  }
  // Close the hem underneath.
  grid.unshift(grid[0].map(() => [0, 0, 0] as V3))
  surface(p, grid, true, (q) => [0, 0, q[2]])
}

/** A head with hair gathered behind and a laurel wreath, centred at c, height ~hh. */
export function head(p: Part, c: V3, hh: number, R: number, wreath: boolean) {
  ellipsoid(p, c, [hh * 0.36, hh * 0.42, hh * 0.5], 10 * R, 7 * R)
  ellipsoid(p, add(c, [0, -hh * 0.2, hh * 0.06]), [hh * 0.38, hh * 0.32, hh * 0.44], 10 * R, 6 * R) // hair
  ellipsoid(p, add(c, [0, -hh * 0.42, -hh * 0.12]), [hh * 0.22, hh * 0.18, hh * 0.22], 8 * R, 5 * R) // knot
  if (R > 1) ellipsoid(p, add(c, [0, hh * 0.42, -hh * 0.02]), [hh * 0.06, hh * 0.08, hh * 0.13], 6, 4) // nose
  if (wreath) {
    const n = Math.max(6, Math.round(10 * R))
    for (let i = 0; i < n; i++) {
      const a = (i / n) * TAU
      ellipsoid(p, add(c, [hh * 0.37 * Math.cos(a), hh * 0.41 * Math.sin(a) - hh * 0.04, hh * 0.3]), [hh * 0.1, hh * 0.1, hh * 0.09], 5, 3, a)
    }
  }
  limb(p, [add(c, [0, -hh * 0.05, -hh * 0.75]), add(c, [0, 0, -hh * 0.35])], [hh * 0.18, hh * 0.18], 8 * R, [0, 0, 1], false) // neck
}

/** Bavaria, facing +y, drawn with the reins at -x and the spear at +x: placed mirrored, so the reins are in her right hand and the spear in her left. */
function bavaria(p: Part, R: number) {
  const h = 4.15
  drapedBody(p, h, R, [
    // The mantle from the left shoulder across the breast to the right hip, front and back.
    { a: 1.25, z0: 0.8, a1: 2.1, z1: 0.52, amp: 0.12, w: 0.35 },
    { a: 1.0, z0: 0.74, a1: 1.9, z1: 0.46, amp: 0.08, w: 0.3 },
    { a: 5.1, z0: 0.8, a1: 4.3, z1: 0.45, amp: 0.1, w: 0.4 },
  ])
  head(p, [0, 0.02, h * 0.92], h * 0.13, R, true)
  // Arms.
  limb(p, [[-0.5, 0.0, 3.42], [-0.66, 0.14, 2.82], [-0.42, 0.52, 2.48], [-0.36, 0.62, 2.4]], [0.2, 0.16, 0.12, 0.1], 6 * R)
  ellipsoid(p, [-0.36, 0.7, 2.38], [0.1, 0.12, 0.08], 6 * R, 4 * R)
  limb(p, [[0.5, 0.0, 3.42], [0.84, 0.05, 3.0], [0.98, 0.15, 3.22], [1.02, 0.17, 3.28]], [0.2, 0.16, 0.12, 0.1], 6 * R)
  ellipsoid(p, [1.03, 0.17, 3.32], [0.1, 0.09, 0.12], 6 * R, 4 * R)
  // The spear (a staff with a finial).
  limb(p, [[1.04, 0.17, -0.9], [1.04, 0.17, 4.55]], [0.055, 0.055], 6, [1, 0, 0], false)
  lathe(p, 1.04, 0.17, [[0.06, 4.5], [0.12, 4.62], [0.1, 4.8], [0.05, 4.95], [0, 5.05]], 6 * R)
}

/** A winged Victory, ~2.6 m, facing +y, holding up a wreath in her right hand. */
function victory(p: Part, R: number) {
  const h = 2.6
  drapedBody(p, h, R, [{ a: 1.4, z0: 0.78, a1: 1.9, z1: 0.5, amp: 0.08, w: 0.3 }])
  head(p, [0, 0.02, h * 0.92], h * 0.13, R, false)
  if (R > 0.5) {
    limb(p, [[-0.28, 0.0, 2.02], [-0.42, 0.18, 2.3], [-0.38, 0.3, 2.6]], [0.09, 0.07, 0.06], 5 * R)
    limb(p, [[0.28, 0.0, 2.02], [0.36, 0.12, 1.6], [0.3, 0.22, 1.3]], [0.09, 0.07, 0.06], 5 * R)
  }
  // A wreath held up.
  const n = R < 1 ? 0 : Math.round(8 * R)
  for (let i = 0; i < n; i++) {
    const a = (i / n) * TAU
    ellipsoid(p, [-0.38 + 0.22 * Math.cos(a), 0.34, 2.75 + 0.22 * Math.sin(a)], [0.07, 0.06, 0.07], 5, 3)
  }
  // Wings: two broad feathers' fans from the shoulder blades, up and back.
  for (const s of [-1, 1]) {
    limb(p, [[s * 0.12, -0.18, 2.05], [s * 0.42, -0.42, 2.4], [s * 0.55, -0.62, 2.0], [s * 0.5, -0.72, 1.2], [s * 0.38, -0.7, 0.75]],
      [[0.08, 0.2], [0.07, 0.34], [0.06, 0.32], [0.05, 0.2], [0.03, 0.08]], 6 * R, [s, 0, 0], 'end')
  }
}

/** The chariot: a rounded body with two wheels and a pole, facing +y; its floor at ~1.2 m. */
function chariot(p: Part, R: number) {
  // Body: a D in plan, rounded to the front, rising to a scrolled rail.
  const NU = Math.max(8, Math.round(14 * R))
  const ring = (z: number, s: number): V3[] => Array.from({ length: NU }, (_, i) => {
    const t = (i / NU) * TAU
    const x = 0.78 * Math.cos(t) * s, y = Math.sin(t) > 0 ? 0.62 * Math.sin(t) * s + 0.0 : 0.3 * Math.sin(t) * s
    return [x, y + 0.15, z] as V3
  })
  surface(p, [ring(0.55, 0.0), ring(0.55, 0.85), ring(0.8, 1.0), ring(1.6, 1.0), ring(1.85, 0.94), ring(1.85, 0.0)], true, (q) => [0, 0.15, q[2]])
  for (const s of [-1, 1]) wheel(p, [s * 0.95, -0.05, 0.68], 0.62, 0.07, R, R > 1)
  limb(p, [[-1.0, -0.05, 0.68], [1.0, -0.05, 0.68]], [0.07, 0.07], 6, [0, 0, 1], false) // axle
  limb(p, [[0, 0.7, 0.85], [0, 1.6, 1.1], [0, 2.6, 1.25]], [0.08, 0.07, 0.06], 6, [0, 0, 1], false) // pole
  limb(p, [[-2.9, 2.55, 1.3], [0, 2.6, 1.32], [2.9, 2.55, 1.3]], [0.05, 0.05, 0.05], 5, [0, 0, 1], false) // yoke bar
}

// ---------------------------------------------------------------------------

function build(R: number) {
  const stone = new Part(), trim = new Part(), bronze = new Part(), statue = new Part(), dark = new Part()
  /**
   * A relief panel on an axis-aligned face (normal n = +-x or +-y, u along
   * it): a raised frame, a dark sunk ground and the figures standing out
   * from it as bold masses (boxes in the low model, rounded in the detail).
   */
  const relief = (o: V3, u: V3, n: V3, s0: number, s1: number, z0: number, z1: number, figs: number) => {
    const P = (sv: number, d: number): [number, number] => [o[0] + u[0] * sv + n[0] * d, o[1] + u[1] * sv + n[1] * d]
    const fr = 0.22
    for (const [a, b, za, zb] of [[s0, s1, z0, z0 + fr], [s0, s1, z1 - fr, z1], [s0, s0 + fr, z0, z1], [s1 - fr, s1, z0, z1]] as number[][]) {
      const [cx, cy] = P((a + b) / 2, 0.15)
      boxAt(trim, cx, cy, u[0] ? (b - a) / 2 : 0.15, u[1] ? (b - a) / 2 : 0.15, za, zb)
    }
    panelOn(dark, o, u, n, s0 + fr, s1 - fr, z0 + fr, z1 - fr, 0.03)
    const w = (s1 - s0 - 2 * fr) / figs
    for (let i = 0; i < figs; i++) {
      const sc = s0 + fr + w * (i + 0.5), hz = (z1 - z0 - 2 * fr) * (0.7 + 0.25 * ((i * 7) % 3) / 2)
      const zc = z0 + fr + hz / 2 + 0.05
      const [cx, cy] = P(sc, 0.12)
      if (R < 1) boxAt(stone, cx, cy, u[0] ? w * 0.38 : 0.11, u[1] ? w * 0.38 : 0.11, zc - hz / 2, zc + hz / 2)
      else {
        ellipsoid(stone, [cx, cy, zc], [u[0] ? w * 0.34 : 0.16, u[1] ? w * 0.34 : 0.16, hz / 2], 6, 4)
        const [hx, hy] = P(sc + w * 0.1, 0.16)
        ellipsoid(stone, [hx, hy, zc + hz / 2 - 0.05], [0.16, 0.16, 0.18], 5, 3)
      }
    }
  }
  /** Lettering-like marks: dark strokes in words along a face. */
  const letters = (o: V3, u: V3, n: V3, s0: number, s1: number, z0: number, z1: number, words: number[], d: number) => {
    const total = words.reduce((a, b) => a + b, 0) + words.length - 1
    const pitch = (s1 - s0) / total
    let sv = s0
    for (const wl of words) {
      for (let i = 0; i < wl; i++) {
        const tall = (i * 5 + wl) % 3 === 0
        panelOn(dark, o, u, n, sv + pitch * 0.18, sv + pitch * 0.82, z0 + (tall ? 0 : 0.05), z1 - (tall ? 0 : 0.05), 0.02, d)
        sv += pitch
      }
      sv += pitch
    }
  }
  const SEG = R < 1 ? 8 : Math.round(8 * R + 4)

  const HX = 12.0, HY = 4.4, TOP = 21.0
  const mid: Opening = { c: HX, hw: 2.85, zs: 9.25, k: 1 }
  const sides: Opening[] = [{ c: HX - 7.4, hw: 1.85, zs: 5.45, k: 1 }, { c: HX + 7.4, hw: 1.85, zs: 5.45, k: 1 }]
  const ops = [sides[0], mid, sides[1]]
  const U: V3 = [1, 0, 0]
  for (const [y, n] of [[-HY, [0, -1, 0]], [HY, [0, 1, 0]]] as [number, V3][]) {
    piercedFace(stone, [-HX, y, 0], U, n, 0, 2 * HX, 0, 15.9, ops, 0, SEG)
    for (const op of ops) archBand(trim, [-HX, y, 0], U, n, op, op === mid ? 0.55 : 0.4, 0.14, 0, SEG)
  }
  tunnel(stone, [-HX, -HY, 0], U, [0, -1, 0], 0, -2 * HY, ops, 0, SEG)
  for (const s of [-1, 1]) quadN(stone, [s * HX, -HY, 0], [s * HX, HY, 0], [s * HX, HY, 15.9], [s * HX, -HY, 15.9], [s, 0, 0])
  // Attic, with its top cornice; the lower cornice/entablature round the body.
  prism(stone, rect(-HX, -HY, HX, HY), 15.9, TOP - 0.45, null)
  boxAt(trim, 0, 0, HX + 0.5, HY + 0.5, TOP - 0.5, TOP, 0, 0, 0.15)
  boxAt(trim, 0, 0, HX + 0.25, HY + 0.25, TOP - 0.8, TOP - 0.5)
  boxAt(stone, 0, 0, HX + 0.12, HY + 0.12, 13.5, 15.3)
  boxAt(trim, 0, 0, HX + 0.75, HY + 0.75, 15.3, 15.9, 0, 0, 0.2)
  // Impost mouldings: the central arch's, carried across the side bays; the side arches'.
  for (const [y, sg] of [[-HY, -1], [HY, 1]] as [number, number][]) {
    for (const s of [-1, 1]) {
      boxAt(trim, s * (2.85 + 12.0) / 2, y + sg * 0.1, (12.0 - 2.85) / 2, 0.12, 8.5, 8.9)
      for (const e of [-1, 1]) boxAt(trim, s * 7.4 + e * (1.85 + 0.3), y + sg * 0.1, 0.3, 0.12, 5.2, 5.6)
      // Relief panels in the side bays.
      relief([-HX, y, 0], U, [0, sg, 0], HX + s * 7.4 - 1.98, HX + s * 7.4 + 1.98, 9.7, 12.1, R < 1 ? 4 : 6)
    }
  }
  // Columns: pedestal, shaft, Corinthian capital; the ressaut above each.
  const seg = Math.round(R < 1 ? 8 : 8 + 4 * R)
  for (const sy of [-1, 1]) for (const xc of [-10.75, -4.35, 4.35, 10.75]) {
    const yc = sy * (HY + 0.85)
    boxAt(stone, xc, yc, 0.82, 0.82, 0, 3.6, 0, 0.0, 0.0)
    boxAt(trim, xc, yc, 0.92, 0.92, 3.6, 3.95, 0, 0, 0.1)
    if (R >= 1) boxAt(trim, xc, yc, 0.95, 0.95, 0, 0.4, 0, 0, 0)
    lathe(stone, xc, yc, R < 1 ? [[0.72, 3.95], [0.72, 4.2], [0.6, 4.5], [0.53, 12.1], [0.6, 12.3]] : [[0.72, 3.95], [0.72, 4.1], [0.62, 4.25], [0.65, 4.4], [0.6, 4.6], [0.6, 8.0], [0.53, 12.1], [0.6, 12.3]], seg)
    // Capital: a bell of leaves under a square abacus.
    lathe(trim, xc, yc, R < 1 ? [[0.55, 12.3], [0.72, 12.8], [0.95, 13.25]] : [[0.55, 12.3], [0.66, 12.55], [0.74, 12.8], [0.84, 13.05], [0.92, 13.25]], seg)
    // Acanthus: two rows of leaves round the bell, and the corner volutes.
    if (R >= 1) for (let row = 0; row < 2; row++) for (let i = 0; i < 8; i++) {
      const a = ((i + row * 0.5) / 8) * TAU, rr = 0.6 + row * 0.12
      ellipsoid(trim, [xc + rr * Math.cos(a), yc + rr * Math.sin(a), 12.55 + row * 0.38], [0.16, 0.16, 0.3], 5, 3, a)
    }
    for (const [vx, vy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
      if (R >= 1) ellipsoid(trim, [xc + vx * 0.72, yc + vy * 0.72, 13.08], [0.17, 0.17, 0.17], 6, 4)

    }
    // Attic base: two tori.
    if (R >= 1) latheHard(trim, xc, yc, [[0.82, 3.95], [0.86, 4.08], [0.72, 4.2]], seg)
    boxAt(trim, xc, yc, 0.92, 0.92, 13.25, 13.5, 0, 0.12)
    // Ressaut: the entablature breaking forward over the column.
    const y0 = sy * HY, y1 = sy * (HY + 1.2)
    boxAt(stone, xc, (y0 + y1) / 2, 0.9, 0.62, 13.5, 15.3)
    boxAt(trim, xc, (y0 + y1) / 2 + sy * 0.15, 1.15, 0.8, 15.3, 15.9, 0, 0, 0.12)
  }
  // The quadriga's plinth, in two steps.
  boxAt(trim, 0, 0, 4.15, 2.65, TOP, TOP + 0.35, 0, 0, 0.08)
  boxAt(stone, 0, 0, 4.0, 2.5, TOP + 0.35, TOP + 1.5, 0, 0)
  boxAt(trim, 0, 0, 4.1, 2.6, TOP + 1.5, TOP + 1.8, 0, 0, 0.08)
  const PZ = TOP + 1.8

  // Attic roundels: on the north face over the side bays, and on the ends.
  for (const s of [-1, 1]) {
    discOn(trim, [-HX, HY, 0], U, [0, 1, 0], HX + s * 7.4, 18.3, 1.25, 0.12, 0, R < 1 ? 10 : 12 + 4 * R)
    discOn(trim, [s * HX, -HY, 0], [0, 1, 0], [s, 0, 0], HY, 18.3, 1.25, 0.12, 0, R < 1 ? 10 : 12 + 4 * R)
    relief([s * HX, -HY, 0], [0, 1, 0], [s, 0, 0], HY - 2.2, HY + 2.2, 9.7, 12.1, R < 1 ? 4 : 5)
  }

  // The attic's raised end blocks over the outer columns, with their own cornice.
  for (const s of [-1, 1]) for (const sy of [-1, 1]) {
    boxAt(stone, s * 10.75, sy * (HY + 0.35), 1.25, 0.35, 15.9, TOP - 0.8)
    boxAt(trim, s * 10.75, sy * (HY + 0.45), 1.4, 0.45, TOP - 1.3, TOP - 0.8, 0, 0, 0.08)
  }
  // The inscriptions: Hausenstein's on the south frieze, "Dem bayerischen
  // Heere" in the north attic, as dark letter-like marks.
  letters([-HX, -HY - 0.12, 0], U, [0, -1, 0], HX - 9.3, HX + 9.3, 14.3, 14.75, [3, 4, 7, 3, 5, 7, 3, 7, 8], 0)
  letters([-HX, HY, 0], U, [0, 1, 0], HX - 4.6, HX + 4.6, 18.0, 18.7, [3, 10, 6], 0)
  // --- the quadriga, facing north (+y), on the plinth ---
  const Lp = new Part(); lion(Lp, R < 1 ? 0.4 : R * 0.56)
  for (const [x, yaw] of [[-2.85, 25], [-0.95, 8], [0.95, -8], [2.85, -25]] as [number, number][]) {
    const [M, Rn] = similarity(1, (yaw * Math.PI) / 180, [x, 0.55, PZ], false)
    place(bronze, Lp, M, Rn)
  }
  const Cp = new Part(); chariot(Cp, R)
  { const [M, Rn] = similarity(1, 0, [0, -1.65, PZ]); place(bronze, Cp, M, Rn) }
  const Bp = new Part(); bavaria(Bp, R)
  { const [M, Rn] = similarity(1, 0, [0, -1.6, PZ + 1.2], true); place(bronze, Bp, M, Rn) }
  if (R > 1) {
    // Reins from her right hand to the lions' heads.
    for (const x of [-2.85, -0.95, 0.95, 2.85]) limb(bronze, [[0.36, -0.9, PZ + 3.6], [x * 0.6, 0.2, PZ + 2.6], [x * 0.95 + (x > 0 ? -0.1 : 0.1), 1.6, PZ + 1.75]], [0.025, 0.025, 0.025], 4, [0, 0, 1], false)
  }

  // --- the Victorias over the north columns ---
  const Vp = new Part(); victory(Vp, R < 1 ? 0.35 : R * 0.5)
  for (const xc of [-10.75, -4.35, 4.35, 10.75]) {
    const yc = HY + 0.75
    boxAt(stone, xc, yc, 0.55, 0.5, 15.9, 16.6, 0, 0, R < 1 ? 0 : 0.08)
    const [M, Rn] = similarity(1, 0, [xc, yc, 16.6]); place(statue, Vp, M, Rn)
  }

  if (process.env.COUNT) console.log(R, { lion: Lp.triangles, chariot: Cp.triangles, bavaria: Bp.triangles, victory: Vp.triangles, stone: stone.triangles, trim: trim.triangles })
  const lit = floodWalls
  const lime = finish('siegestor-limestone', 0xdcd2bd)
  return [
    { part: stone, material: { ...lime, floodlight: lit } },
    { part: trim, material: { ...finish('siegestor-trim', 0xe8dfca), floodlight: lit } },
    { part: statue, material: { ...finish('siegestor-marble', 0xe6dece), floodlight: lit } },
    { part: bronze, material: { ...PALETTE.patina, floodlight: (_p: V3, n: V3) => (n[2] < -0.2 ? 0.9 : 0.6) } },
    { part: dark, material: finish('siegestor-shadow', 0x6e6556) },
  ] as Layer[]
}

if (import.meta.main) {
  const extras = { bearing: 18.6, elevation: 0, height: 27.4, osm: 'way/22727580' }
  await save('munich-siegestor.glb', 'Siegestor', build(0.5), extras, 6500)
  await save('munich-siegestor.detail.glb', 'Siegestor', build(2), extras, 40_000, 1_536_000)
}
