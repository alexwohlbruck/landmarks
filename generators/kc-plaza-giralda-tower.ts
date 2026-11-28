/**
 * The Giralda Tower, Country Club Plaza, Kansas City, Missouri: a half-scale
 * replica of the Giralda of Seville, dedicated 1967 at the south-west corner
 * of West 47th Street and J.C. Nichols Parkway. Brick shaft with cream
 * Moorish sebka lattice panels and stacked arched windows, a cream belfry,
 * and two white Renaissance stages and a lantern under a bronze Giraldillo.
 *
 * Also the shared kit for this builder's Country Club Plaza towers
 * (kc-plaza-*-tower) and kc-unity-temple: the helpers below are exported and
 * the model is only built when this file is run directly.
 *
 * Frame: bearing 1.8 (the OSM outline's walls), +x east, +y north, z up,
 * metres. Origin at the tower's centre as the lidar shows it, -94.588356
 * 39.0420355; z = 0 is the street at the tower's foot (lidar ground 0.3-0.9
 * round it).
 *
 * What it covers: way/1193201279 "La Giralda" (building=yes,
 * man_made=tower). The OSM outline sits ~2.5 m west of the lidar tower and
 * is 9.3 m east-west against 7.2 m in the lidar; the model follows the
 * lidar. The attached Cheesecake Factory block (way/193817502,
 * building=roof) is another building and is not drawn.
 *
 * Sources
 * - OSM (c) OpenStreetMap contributors: way/1193201279, start_date 1967.
 * - USGS 3DEP lidar MO_FEMANRCS_1_2020 (flown 2020), 0.5 m grid, read in
 *   this frame (work/kc-plaza-giralda-tower/lidar.json).
 * - Published: the tower is a half-size replica of the Giralda in Seville
 *   (Seville's shaft is 13.6 m square; half is 6.8 m), Country Club Plaza
 *   (Wikipedia "Country Club Plaza").
 * Photos (evidence, Wikimedia Commons):
 * - "Country Club Plaza, KC MO - Giralda Tower.JPG", public domain
 *   (uploader's own work): the upper shaft, belfry and stages close up.
 *   https://commons.wikimedia.org/wiki/File:Country_Club_Plaza,_KC_MO_-_Giralda_Tower.JPG
 * - "Country Club Plaza, KC MO - Giralda Tower in context.JPG", public
 *   domain: from the north-west across 47th Street.
 *   https://commons.wikimedia.org/wiki/File:Country_Club_Plaza,_KC_MO_-_Giralda_Tower_in_context.JPG
 * - "Kansas City, Missouri - Country Club Plaza - Giralda Tower -
 *   panoramio (1).jpg", MARELBU, CC BY 3.0: from the north-east, whole
 *   height to the street. https://commons.wikimedia.org/wiki/File:Kansas_City,_Missouri_-_Country_Club_Plaza_-_Giralda_Tower_-_panoramio_(1).jpg
 * - "Giralda, Kansas City, MO.jpg", Asterion (en.wikipedia), CC BY 2.5:
 *   the east face to the street, with the door.
 *   https://commons.wikimedia.org/wiki/File:Giralda,_Kansas_City,_MO.jpg
 *
 * Numbers (z above the street at the foot)
 * - Shaft 7.0 m square (lidar 7.0-7.6 incl. the cornice; published half of
 *   13.6 m). Measured.
 * - Belfry top terrace 27.7 (lidar 27.7-28.3), measured; white second stage
 *   roof 30.3 (lidar 30.2), third stage cornice 34.0 (lidar 34.0-34.3),
 *   lantern dome 36.4 (lidar 36.4), Giraldillo 38.1 (lidar peak), measured.
 * - Shaft brick to 20.4, interlaced-arch band 20.4-22.6, belfry 23.5-27.1:
 *   photo-scaled from the panoramio view against the lidar belfry top
 *   (estimated, +-0.5 m).
 * - The lattice tiers (12.4-16.1, 17.5-20.1), the louvred window pairs under
 *   them and the stacked balconied windows of the middle bay: photo-scaled
 *   (estimated). Stage widths 4.3 and 2.9 m from the lidar's flats.
 * Colours from the daylight photos: brick warm tan-brown, pulled light;
 * lattice and belfry cream; the top stages white; the Giraldillo and the
 * corner globes dark bronze-green.
 *
 * Simplified / doubts
 * - The sebka lattice is drawn as cream diagonal bars over the brick panel,
 *   about half the real density; the cusped (polylobed) arches are plain
 *   horseshoe arches.
 * - The bells, the balusters and the small vases are left out; the
 *   balustrades are solid low parapets.
 * - The west and south faces are behind the attached shop block up to about
 *   11 m; their lower windows are drawn as on the photographed faces
 *   (invented below 11 m).
 * - Night: the tower is floodlit (as the Plaza's towers are); openings stay
 *   dark.
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { cbox, rect, wallRing, cylinder } from './dc-white-house'
import { lathe } from './dc-nga-west'
import { faceAt, facePoly, faceSlab, archPoly, rectPoly, saveModel, ngon, ringPrism, ngonFaces, type Face, type XY } from './sd-california-tower'

// ===========================================================================
// Kit for the Country Club Plaza towers.

export { faceAt, facePoly, faceSlab, archPoly, rectPoly, saveModel, ngon, ringPrism, ngonFaces, cbox, rect, wallRing, cylinder, lathe }
export type { Face, XY }

/** The four outward faces of a square of half-width h centred at (cx, cy). */
export function squareFaces(h: number, cx = 0, cy = 0): Face[] {
  return [0, 90, 180, 270].map((deg) => {
    const a = (deg * Math.PI) / 180
    return faceAt(cx + h * Math.sin(a), cy + h * Math.cos(a), deg)
  })
}

/** A horseshoe arch outline: width w at the springing zs, the arc running `over` radians past the semicircle on each side. */
export function horseshoePoly(u: number, w: number, z0: number, zs: number, over = 0.35, seg = 10): XY[] {
  const r = w / 2
  const a0 = -over, a1 = Math.PI + over
  // jambs at the narrowed foot of the arc, then the arc from right to left
  const jw = r * Math.cos(over), zf = zs - r * Math.sin(over)
  const pts: XY[] = zf - z0 > 1e-6 ? [[u - jw, z0], [u + jw, z0]] : []
  for (let k = 0; k <= seg; k++) {
    const t = a0 + ((a1 - a0) * k) / seg
    pts.push([u + r * Math.cos(t), zs + r * Math.sin(t)])
  }
  return pts
}

/** Clip a convex polygon to a rectangle (Sutherland-Hodgman). */
export function clipRect(poly: XY[], u0: number, u1: number, z0: number, z1: number): XY[] {
  const edges: [(p: XY) => boolean, (a: XY, b: XY) => XY][] = [
    [(p) => p[0] >= u0, (a, b) => { const t = (u0 - a[0]) / (b[0] - a[0]); return [u0, a[1] + t * (b[1] - a[1])] }],
    [(p) => p[0] <= u1, (a, b) => { const t = (u1 - a[0]) / (b[0] - a[0]); return [u1, a[1] + t * (b[1] - a[1])] }],
    [(p) => p[1] >= z0, (a, b) => { const t = (z0 - a[1]) / (b[1] - a[1]); return [a[0] + t * (b[0] - a[0]), z0] }],
    [(p) => p[1] <= z1, (a, b) => { const t = (z1 - a[1]) / (b[1] - a[1]); return [a[0] + t * (b[0] - a[0]), z1] }],
  ]
  let out = poly
  for (const [inside, cut] of edges) {
    const src = out
    out = []
    for (let i = 0; i < src.length; i++) {
      const a = src[i], b = src[(i + 1) % src.length]
      const ia = inside(a), ib = inside(b)
      if (ia) out.push(a)
      if (ia !== ib) out.push(cut(a, b))
    }
    if (!out.length) break
  }
  return out
}

/**
 * A sebka / diamond lattice panel: diagonal bars of width `bar`, `pitch`
 * apart both ways, clipped to the rectangle, `d` proud of the face. The
 * panel behind is whatever the wall is.
 */
export function lattice(p: Part, F: Face, u0: number, u1: number, z0: number, z1: number, pitch: number, bar: number, d = 0.06) {
  const L = (u1 - u0) + (z1 - z0)
  for (const s of [1, -1]) {
    // bars along direction (1, s); offset measured along (1, -s)/√2
    const cu = (u0 + u1) / 2, cz = (z0 + z1) / 2
    const n = Math.ceil(L / pitch) + 1
    for (let k = -n; k <= n; k++) {
      const off = k * pitch
      const nx = 1 / Math.SQRT2, nz = -s / Math.SQRT2 // normal to the bar
      const dx = 1 / Math.SQRT2, dz = s / Math.SQRT2 // along the bar
      const c: XY = [cu + nx * off, cz + nz * off]
      const h = bar / 2
      const quad: XY[] = [
        [c[0] - dx * L + nx * -h, c[1] - dz * L + nz * -h],
        [c[0] + dx * L + nx * -h, c[1] + dz * L + nz * -h],
        [c[0] + dx * L + nx * h, c[1] + dz * L + nz * h],
        [c[0] - dx * L + nx * h, c[1] - dz * L + nz * h],
      ]
      const q = clipRect(quad, u0, u1, z0, z1)
      if (q.length >= 3) facePoly(p, F, q, d + (s > 0 ? 0 : 0.01))
    }
  }
}

/** Plaza brick, cream cast stone, white stucco, dark openings and bronze, shared by the Plaza towers. */
export const PLAZA_BRICK = finish('plaza-brick', 0xc59b76)
export const PLAZA_CREAM = finish('plaza-cream', 0xe5dcc4)
export const PLAZA_WHITE = finish('plaza-white', 0xf3eee3)
export const PLAZA_SHADE = finish('plaza-shade', 0x4d463f)
export const PLAZA_BRONZE = finish('plaza-bronze', 0x5d6a5c)
export const PLAZA_TILE = finish('plaza-tile', 0xb0644c, 0.9)

/** Floodlight share for a tower: walls lit, faces looking up barely, the foot a little less. */
export function towerFlood(zTop: number) {
  return (p: V3, n: V3) => {
    if (n[2] > 0.7) return 0.15
    if (p[2] < 3) return 0.4
    return p[2] > zTop ? 0.5 : 0.85
  }
}

// ===========================================================================
// The Giralda.

function build() {
  const brick = new Part(), cream = new Part(), white = new Part(), shade = new Part(), bronze = new Part()
  const H = 3.5 // shaft half-width
  const SHAFT = 20.4, BAND = 22.6, BELFRY0 = 23.5, BELFRY1 = 27.1, TERRACE = 27.7

  // ---- Shaft: brick, with the arch band and the belfry above it.
  cbox(brick, rect(-H, H, -H, H), 0, BAND, { c: 0.12, top: false })
  const faces = squareFaces(H)
  faces.forEach((F, fi) => {
    // the two lattice bays either side and the middle window bay
    for (const s of [-1, 1]) {
      const u0 = s < 0 ? -2.85 : 1.15, u1 = s < 0 ? -1.15 : 2.85, uc = (u0 + u1) / 2
      for (const [z0, z1, zl] of [[17.6, 20.0, 16.0], [12.5, 16.0 - 0.2, 11.0]] as const) {
        // the panel frame: a cream border, the brick showing through a diagonal cream lattice
        lattice(cream, F, u0 + 0.12, u1 - 0.12, z0 + 0.12, z1 - 0.12, 0.7, 0.26, 0.05)
        faceSlab(cream, F, rectPoly(u0, u1, z0, z0 + 0.14), 0, 0.07)
        faceSlab(cream, F, rectPoly(u0, u1, z1 - 0.14, z1), 0, 0.07)
        faceSlab(cream, F, rectPoly(u0, u0 + 0.14, z0 + 0.14, z1 - 0.14), 0, 0.07)
        faceSlab(cream, F, rectPoly(u1 - 0.14, u1, z0 + 0.14, z1 - 0.14), 0, 0.07)
        // the pair of louvred horseshoe windows under each lattice
        for (const du of [-0.42, 0.42]) facePoly(shade, F, horseshoePoly(uc + du, 0.62, zl, zl + 1.0, 0.3, 8), 0.04)
      }
    }
    // middle bay: stacked arched windows in cream frames, each with a white balcony
    for (const z of [18.2, 15.4, 12.6, 9.0]) {
      faceSlab(cream, F, horseshoePoly(0, 1.5, z - 0.1, z + 1.2, 0.3, 8), 0, 0.08)
      facePoly(shade, F, horseshoePoly(0, 0.95, z + 0.2, z + 1.15, 0.3, 8), 0.1)
      faceSlab(white, F, rectPoly(-0.6, 0.6, z - 0.55, z + 0.05), 0, 0.4)
    }
    // the lower shaft: a pair of pointed lancets in cream frames, and the door on the east face
    for (const du of [-0.55, 0.55]) {
      faceSlab(cream, F, archPoly(du, 0.85, 4.2, 6.0, 8), 0, 0.07)
      facePoly(shade, F, archPoly(du, 0.55, 4.4, 6.0, 8), 0.09)
    }
    if (fi === 1) {
      faceSlab(cream, F, horseshoePoly(0, 2.6, 0, 1.9, 0.3, 12), 0, 0.12)
      facePoly(shade, F, horseshoePoly(0, 1.9, 0, 1.85, 0.3, 12), 0.14)
    }
    // the interlaced-arch band: a cream frieze with a row of small dark arches
    faceSlab(cream, F, rectPoly(-H + 0.35, H - 0.35, SHAFT, BAND - 0.15), 0, 0.06)
    for (let k = 0; k < 9; k++) {
      const u = -H + 0.35 + 0.38 + k * ((2 * H - 0.7 - 0.76) / 8)
      facePoly(shade, F, archPoly(u, 0.56, SHAFT + 0.3, BAND - 0.6, 6), 0.08)
    }
  })
  // cornice and the solid balustrade over the band
  cbox(cream, rect(-H - 0.3, H + 0.3, -H - 0.3, H + 0.3), BAND - 0.15, BAND + 0.3, { b: 0.12, bottom: true, top: cream })
  wallRing(cream, rect(-H - 0.15, H + 0.15, -H - 0.15, H + 0.15), 0.22, BAND + 0.3, BELFRY0)

  // ---- Belfry: cream, five bays a face, the middle arch widest.
  const HB = H - 0.05
  cbox(cream, rect(-HB, HB, -HB, HB), BAND + 0.3, BELFRY1, { top: false })
  for (const F of squareFaces(HB)) {
    facePoly(shade, F, archPoly(0, 1.5, BELFRY0 + 0.1, 25.55, 10), 0.03)
    for (const s of [-1, 1]) facePoly(shade, F, archPoly(s * 1.75, 0.8, BELFRY0 + 0.1, 25.75, 8), 0.03)
    // pilasters between the bays, and the corner piers
    for (const u of [-2.55, -0.95, 0.95, 2.55]) faceSlab(cream, F, rectPoly(u - 0.17, u + 0.17, BELFRY0, BELFRY1 - 0.6), 0, 0.22)
    // the frieze: four round oculi
    for (const u of [-2.55, -0.95, 0.95, 2.55]) facePoly(shade, F, ngon(u, 26.75, 0.2, 8, Math.PI / 8), 0.03)
  }
  cbox(white, rect(-H - 0.35, H + 0.35, -H - 0.35, H + 0.35), BELFRY1, TERRACE, { b: 0.15, bottom: true, top: white })

  // corner pedestals with bronze globes and finials, and vases along the parapet
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
    const x = sx * (H - 0.1), y = sy * (H - 0.1)
    cbox(white, rect(x - 0.4, x + 0.4, y - 0.4, y + 0.4), TERRACE, TERRACE + 1.1, { b: 0.08, top: white })
    lathe(bronze, x, y, [[0.08, TERRACE + 1.1], [0.32, TERRACE + 1.3], [0.45, TERRACE + 1.6], [0.32, TERRACE + 1.95], [0.1, TERRACE + 2.1], [0.06, TERRACE + 2.9], [0.01, TERRACE + 2.9]], 8, false)
  }
  for (const F of squareFaces(H)) for (const u of [-1.3, 1.3]) {
    const [x, y] = [F.o[0] + F.u[0] * u - F.n[0] * 0.1, F.o[1] + F.u[1] * u - F.n[1] * 0.1]
    lathe(white, x, y, [[0.18, TERRACE], [0.26, TERRACE + 0.3], [0.12, TERRACE + 0.6], [0.01, TERRACE + 0.75]], 6, false)
  }

  // ---- Second stage, white: a balustraded podium, an arch a face, cornice and corner vases.
  const H2 = 1.75, S2 = 30.55
  cbox(white, rect(-2.75, 2.75, -2.75, 2.75), TERRACE, 28.2, { top: white })
  wallRing(white, rect(-2.75, 2.75, -2.75, 2.75), 0.18, 28.2, 28.85)
  cbox(white, rect(-H2, H2, -H2, H2), 28.2, S2, { top: false })
  for (const F of squareFaces(H2)) {
    facePoly(shade, F, archPoly(0, 1.5, 28.45, 29.55, 8), 0.03)
    for (const s of [-1, 1]) faceSlab(white, F, rectPoly(s * 1.42 - 0.25, s * 1.42 + 0.25, 28.2, S2), 0, 0.12)
  }
  cbox(white, rect(-H2 - 0.25, H2 + 0.25, -H2 - 0.25, H2 + 0.25), S2, 30.95, { b: 0.1, bottom: true, top: white })
  for (const sx of [-1, 1]) for (const sy of [-1, 1])
    lathe(white, sx * H2, sy * H2, [[0.2, 30.95], [0.28, 31.3], [0.12, 31.65], [0.01, 31.85]], 6, false)

  // ---- Third stage, white, an arch a face; then the lantern and the Giraldillo.
  const H3 = 1.2, S3 = 33.6
  wallRing(white, rect(-1.7, 1.7, -1.7, 1.7), 0.15, 30.95, 31.45)
  cbox(white, rect(-H3, H3, -H3, H3), 30.95, S3, { top: false })
  for (const F of squareFaces(H3)) facePoly(shade, F, archPoly(0, 0.9, 31.3, 32.8, 8), 0.03)
  cbox(white, rect(-H3 - 0.2, H3 + 0.2, -H3 - 0.2, H3 + 0.2), S3, 34.0, { b: 0.1, bottom: true, top: white })
  ringPrism(white, ngon(0, 0, 0.75, 12), 34.0, 35.6, false)
  ngonFaces(0, 0, 0.75, 12).forEach(({ F }, i) => { if (i % 3 === 0) facePoly(shade, F, archPoly(0, 0.3, 34.3, 35.15, 6), 0.02) })
  lathe(white, 0, 0, [[0.9, 35.6], [0.9, 35.8], [0.7, 35.85], [0.6, 36.15], [0.25, 36.4], [0.01, 36.45]], 12, false)
  // the Giraldillo: Faith with a shield and a banner staff, stylised (bold, about 1.7 m)
  lathe(bronze, 0, 0, [[0.2, 36.4], [0.3, 36.6], [0.34, 37.3], [0.2, 37.7], [0.14, 37.9], [0.01, 38.1]], 8, false)
  cbox(bronze, rect(-0.36, 0.36, 0.2, 0.32), 36.75, 37.65, { top: true })
  cylinder(bronze, -0.42, -0.05, 0.05, 36.6, 38.4, 4)

  const lit = towerFlood(36.5)
  return [
    { part: brick, material: { ...PLAZA_BRICK, floodlight: lit } },
    { part: cream, material: { ...PLAZA_CREAM, floodlight: lit } },
    { part: white, material: { ...PLAZA_WHITE, floodlight: lit } },
    { part: shade, material: PLAZA_SHADE },
    { part: bronze, material: PLAZA_BRONZE },
  ]
}

if (import.meta.main && process.env.PARTS) console.log(build().map(({ part, material }) => `${material.name} ${part.triangles}`).join('\n'))
if (import.meta.main) await saveModel('kc-plaza-giralda-tower', 'Giralda Tower', build(), 6500)
