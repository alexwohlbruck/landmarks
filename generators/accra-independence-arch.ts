/**
 * Independence Arch (the Black Star Gate), Black Star Square, Accra
 * (Public Works Department, 1961): procedural, CC0-1.0.
 * bun generators/accra-independence-arch.ts
 *
 * Writes models/accra-independence-arch.glb (low) and
 * models/accra-independence-arch.detail.glb (the coffered soffits, the
 * ring medallions on the piers, the coursed stone joints of the attic and
 * the faceted star's back plate).
 *
 * A gate of two broad outer piers and two slender inner ones, three
 * flat-headed openings (the centre one wide), an entablature (inscribed
 * FREEDOM AND JUSTICE, not lettered here), a cornice, an attic (AD 1957,
 * drawn as its sunk panel), a white plinth and the Black Star: a black
 * five-pointed star standing upright, its faces front and back, before a
 * white block and two stepped white stars turned 36 degrees, whose points
 * show between the black arms (ga, us).
 *
 * Frame: origin at the centre of the OSM outline way/169866122 (building,
 * height 30); bearing 348.6, square to its long axis (78.6 degrees), so +x
 * runs along the gate and the openings pass along y.
 *
 * Size. OSM's outline is 51 x 17.5 m with height 30, but the photos don't
 * bear it out: a man standing on the podium beside the east pier in
 * "Black Star Gate 1.jpg" (ig, full resolution) is 1/15 of the gate's
 * width, and people at the centre opening in "Independence Square,
 * Korle-Klottey (IMG 20230201 120939).jpg" (mb) make it 5.8 m wide. The
 * model is 25 m wide and 9 m deep (the end face is 0.36 of the front, us),
 * standing in the centre of the OSM outline; the published height (en.
 * wikipedia "Black Star Gate": about 12 m) matches the cornice at 12.4 m.
 * From the square-on "Independence Arch - Accra, Ghana1.jpg" (ga,
 * 0.039 m/px): a 0.8 m pale podium; outer piers 5.9 m, side openings 2.0,
 * inner piers 1.45, centre opening 6.3; the openings 9.6 m high; the
 * entablature 2.1 m, the cornice 0.5, the attic 2.6; the star's plinth
 * 6.4 m wide and 1.1 high; the star 4.7 m across, its tip at 20.2 m.
 *
 * Ground: level (the map's terrain, Mapterhorn z12, z13-15 404, varies
 * under half a metre). Elevation 0.
 *
 * Colours from the daylight photos: a pale cream-white stone (about
 * #e3ddd0 in ga, square-on in sun; ig's #c8b399 is evening light), the
 * podium pale too; the star's plinth and backing white; the star black,
 * at the charcoal floor.
 *
 * Night: the gate is floodlit and the star lit: the stone carries
 * `_FLOODLIGHT`, the white crown is lit too.
 *
 * Photos (Wikimedia Commons; all EVIDENCE):
 * - ga "Independence Arch - Accra, Ghana1.jpg", George Appiah, CC BY 2.0
 *   https://commons.wikimedia.org/wiki/File:Independence_Arch_-_Accra,_Ghana1.jpg
 * - ig "Black Star Gate 1.jpg", Ivy Gbeze, CC BY-SA 4.0
 *   https://commons.wikimedia.org/wiki/File:Black_Star_Gate_1.jpg
 * - us "Black Star Accra 2013-08-29 B002a.jpg", US Embassy photographer, public domain
 *   https://commons.wikimedia.org/wiki/File:Black_Star_Accra_2013-08-29_B002a.jpg
 * - mb "Independence Square, Korle-Klottey (IMG 20230201 120939).jpg", Matti Blume, CC BY-SA 4.0
 *   https://commons.wikimedia.org/wiki/File:Independence_Square,_Korle-Klottey_(IMG_20230201_120939).jpg
 * - um "Black Star Gate located in Accra.jpg", Uprising Man, CC BY-SA 4.0
 *   https://commons.wikimedia.org/wiki/File:Black_Star_Gate_located_in_Accra.jpg
 * - cg "Arche de l’indépendance vue de nuit.JPG", Cyriac Gbogou, CC BY-SA 4.0 (night)
 *   https://commons.wikimedia.org/wiki/File:Arche_de_l%E2%80%99ind%C3%A9pendance_vue_de_nuit.JPG
 * Look-only: none.
 *
 * Doubts: the size (OSM's outline is twice the photographed width; the
 * map's box for way/169866122 is replaced by a smaller model, so the
 * outline's ends show no building); the back face (taken as the front's
 * mirror, as the end view us suggests); the star's crown is simplified.
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { TAU, face, norm, quad, save, type Mat, type XY } from './cairo-cairo-tower'
import { block } from './casablanca-hassan-ii-mosque'

const W = 25, D = 9, POD = 0.8, OPEN = POD + 9.6, ENT = OPEN + 2.1, COR = ENT + 0.5, ATT = COR + 2.6
const PL = ATT + 1.1, STAR_C = PL + 2.0, STAR_R = 2.4

/** A five-pointed star in the x-z plane at depth y, outer radius R, turned `rot`. */
function starPts(R: number, rot: number, cx: number, cz: number): XY[] {
  const r = R * 0.382 // the regular star's inner radius
  return Array.from({ length: 10 }, (_, i) => {
    const a = Math.PI / 2 + rot + (i * Math.PI) / 5, rr = i % 2 ? r : R
    return [cx + rr * Math.cos(a), cz + rr * Math.sin(a)] as XY
  })
}

/** A star slab between depths y0 and y1 (plane x-z): faces, and its rim. */
function starSlab(p: Part, pts: XY[], cx: number, cz: number, y0: number, y1: number) {
  for (const [y, s] of [[y0, -1], [y1, 1]] as [number, number][]) {
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i], b = pts[(i + 1) % pts.length]
      p.tri([cx, y, cz], [a[0], y, a[1]], [b[0], y, b[1]], [0, 0], [0, 0], [0, 0], [[0, s, 0], [0, s, 0], [0, s, 0]])
    }
  }
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i], b = pts[(i + 1) % pts.length]
    const n = norm([b[1] - a[1], 0, -(b[0] - a[0])])
    const c: XY = [(a[0] + b[0]) / 2 - cx, (a[1] + b[1]) / 2 - cz]
    const out: V3 = n[0] * c[0] + n[2] * c[1] < 0 ? [-n[0], 0, -n[2]] : n
    quad(p, [a[0], y0, a[1]], [b[0], y0, b[1]], [b[0], y1, b[1]], [a[0], y1, a[1]], out)
  }
}

/** A faceted (folded) star: each point a ridge rising to `t` in front of and behind the plane y = 0. */
function foldedStar(p: Part, pts: XY[], cx: number, cz: number, t: number) {
  for (const s of [1, -1]) {
    const apex: V3 = [cx, s * t, cz]
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i], b = pts[(i + 1) % pts.length]
      const A: V3 = [a[0], 0, a[1]], B: V3 = [b[0], 0, b[1]]
      const e1: V3 = [B[0] - A[0], B[1] - A[1], B[2] - A[2]], e2: V3 = [apex[0] - A[0], apex[1] - A[1], apex[2] - A[2]]
      let n = norm([e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]])
      if (n[1] * s < 0) n = [-n[0], -n[1], -n[2]]
      p.tri(A, B, apex, [0, 0], [0, 0], [0, 0], [n, n, n])
    }
  }
}

export function build(detail: boolean): Mat[] {
  const stone = new Part(), dark = new Part(), black = new Part(), white = new Part(), shade = new Part()
  const hw = W / 2, hd = D / 2
  // the podium
  block(dark, -hw - 1.2, -hd - 1.2, hw + 1.2, hd + 1.2, 0, POD, 0)
  // the piers: two broad outer ones, two pairs of slender inner ones
  const OUT = 5.9, SIDE = 2.0, IN = 1.45
  for (const s of [-1, 1]) {
    block(stone, s > 0 ? hw - OUT : -hw, -hd, s > 0 ? hw : -hw + OUT, hd, POD, OPEN, 0)
    const x0 = s > 0 ? hw - OUT - SIDE - IN : -hw + OUT + SIDE
    for (const sy of [-1, 1]) block(stone, x0, sy > 0 ? hd - IN : -hd, x0 + IN, sy > 0 ? hd : -hd + IN, POD, OPEN, 0)
  }
  // the entablature over the openings, its soffit; the cornice; the attic
  block(stone, -hw, -hd, hw, hd, OPEN, ENT, 0)
  face(shade, [[-hw + OUT, -hd, OPEN - 0.01], [-hw + OUT, hd, OPEN - 0.01], [hw - OUT, hd, OPEN - 0.01], [hw - OUT, -hd, OPEN - 0.01]], [0, 0, -1])
  block(stone, -hw - 0.55, -hd - 0.55, hw + 0.55, hd + 0.55, ENT, COR, 0)
  block(stone, -hw + 0.4, -hd + 0.4, hw - 0.4, hd - 0.4, COR, ATT, 0)
  block(stone, -hw + 0.25, -hd + 0.25, hw - 0.25, hd - 0.25, ATT - 0.35, ATT, 0)
  // the AD 1957 panel on each face of the attic, a lettered band under the cornice
  for (const sy of [-1, 1]) {
    const y = sy * (hd - 0.4 + 0.03)
    face(shade, [[-4.4, y, COR + 0.55], [4.4, y, COR + 0.55], [4.4, y, ATT - 0.7], [-4.4, y, ATT - 0.7]], [0, sy, 0])
    face(stone, [[-4.1, y + sy * 0.02, COR + 0.75], [4.1, y + sy * 0.02, COR + 0.75], [4.1, y + sy * 0.02, ATT - 0.9], [-4.1, y + sy * 0.02, ATT - 0.9]], [0, sy, 0])
  }
  // ring medallions on the piers' faces (detail)
  if (detail) for (const sy of [-1, 1]) for (const x of [-hw + 1.3, -hw + OUT - 1.3, -hw + OUT + SIDE + IN / 2, hw - OUT - SIDE - IN / 2, hw - OUT + 1.3, hw - 1.3]) {
    const y = sy * (hd + 0.03), z = OPEN - 1.3, R0 = 0.42, R1 = 0.3
    for (let i = 0; i < 16; i++) {
      const a0 = (TAU * i) / 16, a1 = (TAU * (i + 1)) / 16
      quad(black, [x + R0 * Math.cos(a0), y, z + R0 * Math.sin(a0)], [x + R0 * Math.cos(a1), y, z + R0 * Math.sin(a1)], [x + R1 * Math.cos(a1), y, z + R1 * Math.sin(a1)], [x + R1 * Math.cos(a0), y, z + R1 * Math.sin(a0)], [0, sy, 0])
    }
  }
  // the coffered soffit beams (detail)
  if (detail) for (let k = 1; k < 6; k++) {
    const y = -hd + (D * k) / 6
    block(stone, -hw + OUT, y - 0.2, hw - OUT, y + 0.2, OPEN - 0.45, OPEN, 0)
  }

  // ── The Black Star: its white plinth, the white faceted star turned 36
  // degrees behind, and the black star on both faces
  block(white, -3.2, -2.2, 3.2, 2.2, ATT, PL, 0.12)
  // the white backing: a block under the star, and two stepped white stars
  // turned 36 degrees, whose points show between the black star's arms
  block(white, -2.0, -1.3, 2.0, 1.3, PL - 0.05, STAR_C + 0.2, 0)
  starSlab(white, starPts(STAR_R * 1.1, Math.PI / 5, 0, STAR_C), 0, STAR_C, -0.75, 0.75)
  starSlab(white, starPts(STAR_R * 0.98, Math.PI / 5, 0, STAR_C), 0, STAR_C, -1.15, 1.15)
  // the Black Star: one upright five-pointed star, its faces to front and back
  const bp = starPts(STAR_R, 0, 0, STAR_C).map(([x, z], k) => (k % 2 ? [x * 1.1, STAR_C + (z - STAR_C) * 1.1] : [x, z]) as XY)
  starSlab(black, bp, 0, STAR_C, -1.6, 1.6)
  void foldedStar
  const lit = (q: V3, n: V3) => (n[2] > 0.85 ? 0.3 : 0.9)
  return [
    { part: stone, material: { ...finish('accra-limestone', 0xebe3d0), floodlight: lit } },
    { part: shade, material: finish('accra-limestone-shade', 0xc9c1b1) },
    { part: dark, material: finish('accra-podium', 0xd3cdc0) },
    { part: white, material: { ...finish('accra-white', 0xf3f1ec), floodlight: () => 0.9 } },
    { part: black, material: finish('accra-black-star', 0x4b4f56, 0.5) },
  ]
}

if (import.meta.main) {
  const extras = { bearing: 348.6, osm: 'way/169866122', height: STAR_C + STAR_R }
  await save('accra-independence-arch.glb', 'Independence Arch', build(false), 5000, 250_000, extras)
  await save('accra-independence-arch.detail.glb', 'Independence Arch', build(true), 40_000, 1536 * 1024, extras)
}
