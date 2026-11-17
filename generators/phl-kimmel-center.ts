/**
 * Kimmel Center for the Performing Arts (Rafael Viñoly, 2001), 300 S Broad
 * St, the main building of what the operator now calls the Kimmel Cultural
 * Campus — original procedural geometry, CC0-1.0.
 * bun generators/phl-kimmel-center.ts [out.glb]
 *
 * Name: OSM way/183519384 "Kimmel Center for the Performing Arts", the
 * building's name; the operator brands the group of venues "Kimmel Cultural
 * Campus" (banner in Ii2nmd's 2022 photo). Verizon Hall inside was renamed
 * Marian Anderson Hall in 2024; the Perelman Theater keeps its name.
 * Display name "Kimmel Center".
 *
 * Frame: map frame turned to the Center City grid, bearing 9.6 (OSM sides
 * 9.1-9.9 / 99.5). +x east-south-east (Broad Street front), +y
 * north-north-east (Spruce Street), z up, metres. Origin = centroid of the
 * OSM outline, 39.946708, -75.165754, on the lowest street under it (15th
 * St, 7.2 m above the lidar box's ground_min; Broad and Spruce are ~0.8 m
 * higher). Elevation 0.
 *
 * Identity, in order: the glass barrel vault over the whole block, near
 * semicircular, its glazed ends on Broad and 15th Streets; the red-brown
 * brick ranges along Spruce Street and the south side that the vault
 * springs from; the two halls standing free under the glass, the
 * cello-shaped mahogany Marian Anderson (Verizon) Hall to the west and the
 * Perelman Theater's pale box with its roof garden to the east; the Broad
 * St front of stacked cantilevered metal bands and glass, the glass-and-
 * metal lift tower rising in front of the vault's end, and the brick block
 * on the Broad and Spruce corner.
 *
 * Glass: the vault is translucent (`glass`, opacity 0.3, double-sided).
 * Seeing the halls through it is what the building is: every daylight
 * photo shows them through the glass, and from above the vault would
 * otherwise be a plain grey tube. Its outline is carried by the end arches,
 * a few transverse ribs and the edge beams in `metal`. The glass stays dark
 * at night, as in Wasted Time R's night photo.
 *
 * Night: the Perelman's wood box is lit inside the dark vault (night
 * photo), so it carries `_FLOODLIGHT`; the Broad St glazing bands are
 * `window` and glow; the brick and the vault stay dark.
 *
 * Evidence
 *  - OSM: outline way/183519384 (h 10, wrong) and the vault part
 *    way/340439795 (roof:shape round, x -55..52, y -24.7..28.5 in this
 *    frame). Both replaced.
 *  - Lidar: USGS_LPC_DE_DelawareValley_HD_2015_LAS_2017 (flown 2015), 1 m
 *    grid read in this frame. Measured above 15th St: vault crown 44.8 at
 *    y 1.5 (raw 52.3), 36.3 at 20 m either side, ~32 at 24 m; it fits a
 *    near-semicircle 52 m wide springing at 20 m (a 26 m half-width, 24.8 m
 *    rise). Vault ends x -55 and 53. North (Spruce) range 17.7-21.5 with
 *    stair towers to 25.5; south range 18-21.5; west end 24.5-25.5; Broad
 *    St front 18; its canopy 13.5 to x 62; the lift tower 35.6 (x 52-58, y
 *    -15..-6). Under the glass the lidar reaches the halls: a box at 31-33
 *    over x 6..46, y -20..8 (the Perelman with its garden) and returns at
 *    ~29.5 over the west half (Verizon Hall's roof); elsewhere it sees
 *    nothing through the glass.
 *  - Published (Wikipedia "Kimmel Center for the Performing Arts"):
 *    opened 2001, Rafael Viñoly; glass vault 150 ft (46 m) high (the lidar
 *    gives 44.8 above 15th St); Verizon Hall 2,500 seats, cello-shaped;
 *    Perelman Theater 650 seats with a roof garden.
 *  - Estimated: the halls' plans (from the lidar and the photos; the cello
 *    shape is drawn as a rounded plan wider at the west), the Broad front's
 *    bands (from the photos), the rib spacing.
 *  - Colours from the photos, pulled to the palette's lightness: red-brown
 *    brick panels, silver-grey metal, pale grey-blue glass, mahogany hall,
 *    light wood Perelman.
 *
 * Photos (Wikimedia Commons, EVIDENCE):
 *  - Kimmel_Center_cropped.tif, Carol M. Highsmith (derivative crop),
 *    public domain (dusk, from Broad and Spruce)
 *    https://commons.wikimedia.org/wiki/File:Kimmel_Center_cropped.tif
 *  - 2013_Kimmel_Center_from_north.jpg, Beyond My Ken, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:2013_Kimmel_Center_from_north.jpg
 *  - 2013_Kimmel_Center_from_south.jpg, Beyond My Ken, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:2013_Kimmel_Center_from_south.jpg
 *  - Kimmel_Center_for_the_Performing_Arts_(53587020645).jpg, ajay_suresh,
 *    CC BY 2.0
 *    https://commons.wikimedia.org/wiki/File:Kimmel_Center_for_the_Performing_Arts_(53587020645).jpg
 *  - KimmelCenterExteriorNight.jpg, Wasted Time R, public domain
 *    https://commons.wikimedia.org/wiki/File:KimmelCenterExteriorNight.jpg
 *  - Kimmel_Center_interior.jpg, Ii2nmd, CC BY-SA 4.0 (the halls' walls)
 *    https://commons.wikimedia.org/wiki/File:Kimmel_Center_interior.jpg
 *  - Kimmel_Center_roof_from_Garden.JPG, Smallbones, CC0 (the vault's
 *    framing)
 *  No look-only sources; no commercial imagery.
 *
 * Left out: mullions and the vault's diagonal grid, the Broad St screens,
 * the louvres, the rooftop plant on the ranges, the garden's trees.
 *
 * Doubts: the halls' exact plans (lidar sees them only through the glass
 * in patches); the south and west sides have one photo each; the vault's
 * ends are drawn vertical, the real ones lean slightly.
 */
import { Part, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import { block, cap, onWall, panel, rect, save, walls, type XY } from './chi-aon-center'

const brick = new Part()
const glass = new Part()
const metal = new Part()
const hall = new Part()
const perelman = new Part()
const win = new Part()

// Vault: ellipse in (y, z) springing at z SPRING, centred at y VC.
const VC = 1.5, VA = 26, VB = 24.8, SPRING = 20, VX0 = -55, VX1 = 53, SEG = 16
const arc = (k: number): [number, number] => {
  const t = Math.PI * (k / SEG) // 0 at the south springing, π at the north
  return [VC - VA * Math.cos(t), SPRING + VB * Math.sin(t)]
}

function vault() {
  const xs = [VX0, VX1]
  // glass skin
  for (let k = 0; k < SEG; k++) {
    const [y0, z0] = arc(k), [y1, z1] = arc(k + 1)
    glass.quad([VX0, y0, z0], [VX1, y0, z0], [VX1, y1, z1], [VX0, y1, z1])
  }
  // glazed ends, facing out
  for (const x of xs) {
    for (let k = 0; k < SEG; k++) {
      const [y0, z0] = arc(k), [y1, z1] = arc(k + 1)
      const a: V3 = [x, y0, z0], b: V3 = [x, y1, z1], c: V3 = [x, VC, SPRING]
      if (x > 0) glass.tri(a, c, b)
      else glass.tri(a, b, c)
    }
  }
  // ribs: the two end arches (bolder) and transverse ribs between
  const ribs = [VX0, VX1]
  for (let x = VX0 + 13.5; x < VX1 - 5; x += 13.5) ribs.push(x)
  for (const x of ribs) {
    const end = x === VX0 || x === VX1
    const w = end ? 0.9 : 0.45, d = end ? 0.9 : 0.5
    const secs: V3[][] = []
    for (let k = 0; k <= SEG; k++) {
      const t = Math.PI * (k / SEG)
      const ny = -Math.cos(t) / VA, nz = Math.sin(t) / VB
      const nl = Math.hypot(ny, nz)
      const [y, z] = arc(k)
      const oy = (ny / nl) * d, oz = (nz / nl) * d
      const x0 = end ? (x < 0 ? x : x - w) : x - w / 2, x1 = x0 + w
      secs.push([[x0, y + oy * 0.2, z + oz * 0.2], [x1, y + oy * 0.2, z + oz * 0.2], [x1, y + oy, z + oz], [x0, y + oy, z + oz]])
    }
    metal.sweep(secs)
  }
  // edge beams along the springing
  for (const k of [0, SEG]) {
    const [y] = arc(k)
    block(metal, metal, rect(VX0, y - 0.8, VX1, y + 0.8), SPRING - 1.0, SPRING + 0.6, 0.2)
  }
}

/** A rounded plan (superellipse) about (cx, cy), half sizes a, b, `taper` widening the west end. */
function roundPlan(cx: number, cy: number, a: number, b: number, n = 2.6, seg = 24, taper = 0): XY[] {
  const out: XY[] = []
  for (let i = 0; i < seg; i++) {
    const t = (i / seg) * 2 * Math.PI
    const c = Math.cos(t), s = Math.sin(t)
    const x = a * Math.sign(c) * Math.pow(Math.abs(c), 2 / n)
    const w = 1 - taper * (x / a)
    out.push([cx + x, cy + b * w * Math.sign(s) * Math.pow(Math.abs(s), 2 / n)])
  }
  return out
}

function build() {
  // ---- the brick ranges the vault springs from ----
  // North (Spruce St) range, three parts following the OSM outline.
  block(brick, metal, rect(-61.4, 24.5, -52.2, 35.0), 0, 18.0, 0.4)
  block(brick, metal, rect(-52.2, 24.5, -40.0, 39.5), 0, 18.0, 0.4)
  block(brick, metal, rect(-40.0, 24.5, 4.0, 39.5), 0, 21.5, 0.4)
  block(brick, metal, rect(4.0, 24.5, 20.3, 39.5), 0, 18.0, 0.4)
  block(brick, metal, rect(20.3, 24.5, 59.8, 35.6), 0, 18.0, 0.4)
  block(brick, metal, rect(-36.5, 28.0, -27.5, 37.5), 21.0, 25.5, 0.3) // stair tower
  // South range.
  block(brick, metal, rect(-61.7, -40.0, -40.0, -24.5), 0, 18.6, 0.4)
  block(brick, metal, rect(-40.0, -40.0, 0.0, -24.5), 0, 21.5, 0.4)
  block(brick, metal, rect(0.0, -39.0, 59.5, -24.5), 0, 18.6, 0.4)
  block(brick, metal, rect(-30.5, -40.0, -22.0, -30.0), 21.0, 25.5, 0.3) // stair tower
  // West end (15th St), the stage block.
  block(brick, metal, rect(-64.0, -24.5, -55.0, 24.5), 0, 25.0, 0.4)
  // Ground-floor glazing along Spruce and the south side (photos: shop
  // windows and the box office under the brick).
  for (const [a, b] of [[[59.8, 35.6], [20.3, 35.6]], [[-40, -40], [0, -40]]] as [XY, XY][]) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    for (let s = 3; s + 6 < L; s += 9) panel(win, a, b, s, s + 6, 1.0, 5.0)
  }
  // A big window high in the corner block on Broad and Spruce.
  panel(win, [59.8, 35.6], [20.3, 35.6], 2.5, 10.0, 10.5, 15.5)

  // ---- Broad St front ----
  // The stacked bands between the corner blocks: a glass lobby wall on the
  // ground, a cantilevered metal canopy, a glass band, a metal band.
  const fy0 = -24.5, fy1 = 24.5
  block(metal, metal, rect(53.0, fy0, 59.5, fy1), 0, 18.0, 0.3)
  panel(win, [59.5, fy0], [59.5, fy1], 4, 45, 0.5, 8.0, 0.05) // lobby glazing
  block(metal, metal, rect(59.5, -22.0, 62.5, 22.0), 17.4, 19.6, 0.3) // the upper cantilevered slab
  panel(win, [59.5, fy0], [59.5, fy1], 2, 47, 13.8, 17.0, 0.05) // the terrace glass band
  block(metal, metal, rect(59.5, -19.2, 65.2, 23.1), 10.0, 13.5, 0.3) // the canopy
  // The lift tower in front of the vault's end.
  block(metal, metal, rect(51.5, -15.0, 57.5, -6.0), 18.0, 35.6, 0.3)
  panel(win, [57.5, -15.0], [57.5, -6.0], 1.0, 4.2, 19.0, 34.6, 0.04)

  // ---- the halls under the glass ----
  // Marian Anderson (Verizon) Hall: a cello-shaped mahogany volume.
  const vz = roundPlan(-26, -1, 22, 16.5, 2.4, 28, 0.12)
  walls(hall, vz, 0, 28.5)
  const vzTop = vz.map(([x, y]) => [-26 + (x + 26) * 0.93, -1 + (y + 1) * 0.92] as XY)
  walls(hall, vz, 28.5, 29.5, vzTop)
  cap(metal, vzTop, 29.5)
  // Perelman Theater: a pale wood box, its roof garden on top.
  const pr = roundPlan(26, -6, 19.5, 13.5, 6, 28)
  walls(perelman, pr, 0, 32.0)
  cap(metal, pr, 32.0)

  // ---- the vault ----
  vault()

  const lit = (p: V3, n: V3) => (n[2] > 0.7 ? 0.2 : p[2] > 12 ? 0.9 : 0.5)
  return [
    { part: brick, material: finish('kimmel-brick', 0xb2705c) },
    { part: glass, material: { ...PALETTE.glass, color: 0x9fcfe3, opacity: 0.3, doubleSided: true } },
    { part: metal, material: finish('kimmel-metal', 0xc3c6c7) },
    { part: hall, material: finish('kimmel-mahogany', 0xa8705a) },
    { part: perelman, material: { ...finish('kimmel-perelman', 0xdcc7a3), floodlight: lit } },
    { part: win, material: { ...PALETTE.window, color: 0x7b8e9c } },
  ]
}

if (import.meta.main) await save('phl-kimmel-center', 'Kimmel Center', [39.946708, -75.165754], 9.6, build())
