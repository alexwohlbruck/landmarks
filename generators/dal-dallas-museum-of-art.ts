/**
 * Dallas Museum of Art (1717 N Harwood Street, Dallas; Edward Larrabee
 * Barnes, 1984, with the Reves and Hamon wings of 1985 and 1993) — original
 * procedural geometry, CC0-1.0.
 * bun generators/dal-dallas-museum-of-art.ts
 *
 * Map frame: x east, y north, z up, metres; origin on the ground at the
 * anchor. Anchor = centroid of the OSM multipolygon relation/6942581 (all
 * its parts), 32.7876533, -96.8010673. Bearing 45.8: the walls run at
 * 45.8° / 135.8° (OSM, 1,050 m of edges within a degree), so +y is the
 * Flora Street side (north-east), -y the Ross Avenue side (south-west), -x
 * Harwood Street (north-west) and +x St. Paul Street (south-east).
 *
 * Extent: the whole relation: the long gallery block on Harwood with its
 * entrance tower, the middle galleries, the east block, the barrel-vaulted
 * hall between the two low strips (its north-east end is the Flora Street
 * entrance), and the east wing on the forecourt. Not modelled: the sculpture
 * garden (open, trees), the forecourt and the Ross Avenue plaza.
 *
 * Identity, in order: the long plain limestone galleries, low and nearly
 * windowless; the barrel vault (semicircular, about 16.6 m across) standing
 * over the flat roofs, its round end over the Flora Street entrance canopy;
 * the tall square entrance tower on Harwood with its white canopy; the Ross
 * Avenue front with its tall glazed corner and two long windows.
 *
 * Evidence:
 *  - plan: the OSM parts (relation/6942581: ways 471658472 with the inner
 *    courts 471658469/70/71, 678928341, 471658474, 678928340, 31265436),
 *    checked against USGS 3DEP lidar TX_Pecos_Dallas_B3_2018 (2018 flight,
 *    1 m grid); they agree within about a metre. The vault's springing lines
 *    from the lidar (x 38.5..55.1) rather than the OSM roof part (41.9..56.2).
 *  - heights (lidar above the lowest ground, on Ross Avenue at 134.65 m):
 *    Harwood galleries 17.9, middle galleries 15.6, east galleries 13.5
 *    with a lantern at 16.1, the low strips either side of the vault 11.4,
 *    vault crown 21.0 (a semicircle of radius 8.3 springing at 12.7 fits the
 *    profile within 0.8 m), east wing 17.6, Harwood tower 27.2, low terrace
 *    on Ross 7.3 and the low south-east corner 6.4 (all measured). The
 *    forecourt on Flora is at 5.3 and the Harwood pavement 2.1 (lidar
 *    ground); the canopies sit 4.5 m over them (photos).
 *  - Ross Avenue front: the glazed corner and the two long windows placed
 *    from KeithJonsn "DMA west" and Barera 13 (estimated, scaled to the
 *    lidar facade length 42.5 m). Harwood tower front, slot and canopy:
 *    Barera 01, Praefcke 01, Highsmith LCCN2014633039. Flora entrance and
 *    vault end: cliff williams "Entrance of Dallas Museum".
 *  - colour: limestone warm grey-beige in daylight (#a7a396 sunlit,
 *    Machnitzki) pulled to #e0dacb; the vault's pale grey metal skin (#afb6bc
 *    in Barera 13) pulled to #c6ced3; canopies white (`trim`); flat roofs
 *    light grey from NAIP (#c3c4bf).
 *  - night: the entrances and the windows glow (`window`); the vault and the
 *    stone are dark.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Dallas_Museum_of_Art_July_2015_01.jpg, _13.jpg — Michael Barera,
 *    CC BY-SA 4.0
 *  - DMA_west.jpg — KeithJonsn at English Wikipedia, CC BY-SA 3.0
 *  - Dallas_Museum_of_Art_01.jpg — Andreas Praefcke, public domain
 *  - Dallas_Museum_of_Art.jpg — Kent Wang, CC BY-SA 2.0
 *  - Downtown_Dallas_TX_2013-06-08_067.jpg — Thomas R Machnitzki, CC BY 3.0
 *  - Entrance_of_Dallas_Museum_-_Mar_3,_2009.jpg — cliff williams,
 *    CC BY-SA 2.0
 *  - Entrance_to_the_Dallas_Museum_of_Art..._LCCN2014633039.tif — Carol M.
 *    Highsmith, public domain
 * Aerial: USGS NAIP (public domain; mostly in tower shadow here). No
 * look-only sources. No commercial imagery or 3D tiles.
 *
 * Terrain: the site rises about 5 m from Ross Avenue to Flora Street; walls
 * run down to y = 0 and sink into the rise. Low faces are split to 5 m.
 *
 * Doubts: no licensed photo shows the Flora Street faces of the galleries,
 * the east wing or St. Paul Street, so those are plain stone; the vault's
 * south-west end is drawn like its north-east end; the inner courts are
 * drawn as flat skylights; the lidar shows a second rise at the east wing's
 * south corner that is taken for trees.
 */
import { Part, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import { area, cap, inset, panel, rect, save, type XY } from './chi-merchandise-mart'

const ANCHOR: [number, number] = [32.7876533, -96.8010673]
const BEARING = 45.8

/** The barrel vault: springing lines, radius, springing height, ends. */
const VX0 = 38.5, VX1 = 55.1, VR = (VX1 - VX0) / 2, VC = (VX0 + VX1) / 2, VS = 12.7, VY0 = -28.6, VY1 = 15.0
/** Ground at the two entrances. */
const FLORA = 5.3, HARWOOD = 2.1

const ccw = (r: XY[]) => (area(r) > 0 ? r : [...r].reverse())

/** A quad wound so that it faces along `n`. */
function oq(p: Part, A: V3, B: V3, C: V3, D: V3, n: V3) {
  const u = [B[0] - A[0], B[1] - A[1], B[2] - A[2]], v = [C[0] - A[0], C[1] - A[1], C[2] - A[2]]
  const g = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
  if (g[0] * n[0] + g[1] * n[1] + g[2] * n[2] >= 0) p.quad(A, B, C, D)
  else p.quad(D, C, B, A)
}

/** Walls split into pieces of 5 m or less, a bevelled lip and a roof cap. */
function block(wall: Part, top: Part, r0: XY[], z1: number, bevel = 0.45) {
  const r = ccw(r0), ri = inset(r, bevel)
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length], ai = ri[i], bi = ri[(i + 1) % r.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.ceil(L / 5))
    for (let k = 0; k < n; k++) {
      const p: XY = [a[0] + ((b[0] - a[0]) * k) / n, a[1] + ((b[1] - a[1]) * k) / n]
      const q: XY = [a[0] + ((b[0] - a[0]) * (k + 1)) / n, a[1] + ((b[1] - a[1]) * (k + 1)) / n]
      wall.quad([p[0], p[1], 0], [q[0], q[1], 0], [q[0], q[1], z1 - bevel], [p[0], p[1], z1 - bevel])
    }
    wall.quad([a[0], a[1], z1 - bevel], [b[0], b[1], z1 - bevel], [bi[0], bi[1], z1], [ai[0], ai[1], z1])
  }
  cap(top, ri, z1)
}

/** A flat slab (canopy) between two heights, all faces. */
function slab(p: Part, r: XY[], z0: number, z1: number) {
  const q = ccw(r)
  for (let i = 0; i < q.length; i++) {
    const a = q[i], b = q[(i + 1) % q.length]
    p.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
  }
  cap(p, q, z1)
  cap(p, q, z0, false)
}

function build() {
  const stone = new Part(), roof = new Part(), win = new Part(), vault = new Part(), glass = new Part(), trim = new Part()

  // --- Gallery blocks (OSM parts, lidar heights).
  // Harwood galleries, with the low terrace notched into the Ross front.
  const R1: XY[] = [[-74.7, -52.5], [-64, -52.5], [-64, -46], [-40, -46], [-40, -52.5], [-36.5, -52.5], [-36.5, 46.7], [-74.7, 46.7]]
  block(stone, roof, R1, 17.9)
  block(stone, roof, rect(-64, -52.5, -40, -46), 7.3)
  // Harwood entrance tower.
  const T = rect(-86, -0.3, -74.7, 14.9)
  block(stone, roof, T, 27.2, 0.5)
  // Middle galleries (the Ross Avenue front runs on to x 6).
  block(stone, roof, rect(-36.5, -52.5, -3.9, 14.4), 15.6)
  block(stone, roof, rect(-3.9, -52.5, 6, -46), 15.6)
  // East galleries and the low south-east corner.
  block(stone, roof, [[-3.9, -46], [31, -46], [31, 48], [-3.9, 48]], 13.5)
  block(stone, roof, [[6, -52.5], [14.6, -52.5], [14.6, -46], [6, -46]], 6.4)
  block(stone, roof, rect(11, 23, 21, 37), 16.1, 0.3) // lantern (lidar 16.1)
  // Low strips either side of the vault.
  block(stone, roof, rect(31, -29.5, VX0, 15), 11.4)
  block(stone, roof, rect(VX1, -28.6, 65.4, 15.1), 11.4)
  // East wing on the forecourt.
  block(stone, roof, rect(65.4, 5.5, 100.5, 49), 17.6)

  // Skylights over the three inner courts (OSM inner rings).
  for (const [r, z] of [[rect(-62.5, -28.3, -51.5, -17.3), 17.9], [rect(14.1, -16.2, 22.3, -5.5), 13.5]] as [XY[], number][])
    cap(glass, inset(r, 0.6), z + 0.06)
  slab(glass, rect(-25.6, -27.4, -15.8, -17.9), 15.6, 16.9) // raised lantern (lidar 16.9)

  // --- The barrel vault: side walls to the springing, the semicircular
  // shell, and recessed round ends with a rim.
  const SEG = 12
  const arc = (i: number) => {
    const t = Math.PI * (1 - i / SEG)
    return { x: VC + VR * Math.cos(t), z: VS + VR * Math.sin(t), nx: Math.cos(t), nz: Math.sin(t) }
  }
  const len = Math.ceil((VY1 - VY0) / 5)
  for (let k = 0; k < len; k++) {
    const y0 = VY0 + ((VY1 - VY0) * k) / len, y1 = VY0 + ((VY1 - VY0) * (k + 1)) / len
    stone.quad([VX0, y1, 0], [VX0, y0, 0], [VX0, y0, VS], [VX0, y1, VS])
    stone.quad([VX1, y0, 0], [VX1, y1, 0], [VX1, y1, VS], [VX1, y0, VS])
    for (let i = 0; i < SEG; i++) {
      const a = arc(i), b = arc(i + 1)
      const na: V3 = [a.nx, 0, a.nz], nb: V3 = [b.nx, 0, b.nz]
      vault.tri([a.x, y0, a.z], [b.x, y0, b.z], [b.x, y1, b.z], undefined, undefined, undefined, [na, nb, nb])
      vault.tri([a.x, y0, a.z], [b.x, y1, b.z], [a.x, y1, a.z], undefined, undefined, undefined, [na, nb, na])
    }
  }
  // Round ends: the shell's rim, then the stone end wall set 0.9 m in.
  const RIM = 0.9
  for (const [yEnd, dir] of [[VY1, 1], [VY0, -1]] as [number, number][]) {
    const yIn = yEnd - dir * RIM
    for (let i = 0; i < SEG; i++) {
      const a = arc(i), b = arc(i + 1)
      const ai = { x: VC + (a.x - VC) * (1 - 0.9 / VR), z: VS + (a.z - VS) * (1 - 0.9 / VR) }
      const bi = { x: VC + (b.x - VC) * (1 - 0.9 / VR), z: VS + (b.z - VS) * (1 - 0.9 / VR) }
      const out: V3 = [0, dir, 0], inward: V3 = [-(a.nx + b.nx) / 2, 0, -(a.nz + b.nz) / 2]
      // rim face (the shell's edge)
      oq(vault, [b.x, yEnd, b.z], [a.x, yEnd, a.z], [ai.x, yEnd, ai.z], [bi.x, yEnd, bi.z], out)
      // rim soffit, from the shell edge back to the end wall
      oq(vault, [ai.x, yEnd, ai.z], [ai.x, yIn, ai.z], [bi.x, yIn, bi.z], [bi.x, yEnd, bi.z], inward)
      // end wall (lunette) in stone
      const C: V3 = [VC, yIn, VS], A2: V3 = [ai.x, yIn, ai.z], B2: V3 = [bi.x, yIn, bi.z]
      const g = (B2[0] - A2[0]) * (C[2] - A2[2]) - (B2[2] - A2[2]) * (C[0] - A2[0]) // y of (B-A)x(C-A) is -(this)
      if (-g * dir >= 0) stone.tri(A2, B2, C)
      else stone.tri(A2, C, B2)
    }
    // the lunette's flat bottom ring, from the rim edge down to the wall below
    const x0 = VC - VR + 0.9, x1 = VC + VR - 0.9
    oq(stone, [x1, yIn, VS], [x0, yIn, VS], [x0, yEnd, VS], [x1, yEnd, VS], [0, 0, 1])
    // wall under the vault end, flush with the rim
    const wallPts: XY[] = dir > 0 ? [[VX1, yEnd], [VX0, yEnd]] : [[VX0, yEnd], [VX1, yEnd]]
    const [A, B] = wallPts
    for (let k = 0; k < 4; k++) {
      const s0 = k / 4, s1 = (k + 1) / 4
      const P = (s: number, z: number): V3 => [A[0] + (B[0] - A[0]) * s, yEnd, z]
      stone.quad(P(s0, 0), P(s1, 0), P(s1, VS), P(s0, VS))
    }
    // stone band at the springing between rim and wall
    const band = 0.06
    panel(stone, A, B, 0, VR * 2, VS - 0.7, VS, band)
  }

  // --- Flora Street entrance under the vault end (cliff williams 2009).
  panel(win, [VX1, VY1], [VX0, VY1], 4.3, 12.3, FLORA, FLORA + 4.2, 0.06)
  slab(trim, rect(VX0 - 1.5, VY1, VX1 + 1.5, VY1 + 7), FLORA + 4.6, FLORA + 5.6)

  // --- Harwood entrance tower: vertical slot, door, canopy (Barera 01).
  panel(win, [-86, 14.9], [-86, -0.3], 6.9, 8.3, 13, 25.5, 0.06)
  panel(win, [-86, 14.9], [-86, -0.3], 3.5, 11.7, HARWOOD, HARWOOD + 4.0, 0.06)
  slab(trim, rect(-92.5, -2.0, -86, 19.5), HARWOOD + 4.5, HARWOOD + 5.4)
  // Wings either side of the tower on Harwood: a stack of windows to the
  // north, a few small ones to the south.
  panel(win, [-74.7, 46.7], [-74.7, -52.5], 26.6, 30.2, 5.0, 15.5, 0.06)
  panel(win, [-74.7, 46.7], [-74.7, -52.5], 53, 55.5, 10.5, 12.5, 0.06)
  panel(win, [-74.7, 46.7], [-74.7, -52.5], 72, 79, 8.0, 9.6, 0.06)

  // --- Ross Avenue front (y -52.5, x -36.5..6): glazed corner and two long
  // windows ("DMA west", Barera 13).
  panel(win, [-36.5, -52.5], [6, -52.5], 0.8, 7.5, 0.5, 11.2, 0.06)
  panel(win, [-36.5, -52.5], [6, -52.5], 17.4, 29.1, 7.6, 10.6, 0.06)
  panel(win, [-36.5, -52.5], [6, -52.5], 30.2, 41.8, 7.6, 10.6, 0.06)
  // stone mullions across the glazed corner
  for (const z of [4.2, 7.9]) panel(stone, [-36.5, -52.5], [6, -52.5], 0.8, 7.5, z, z + 0.45, 0.1)

  return [
    { part: stone, material: finish('dma-limestone', 0xe0dacb) },
    { part: roof, material: finish('dma-roof', 0xc3c4bf) },
    { part: win, material: PALETTE.window },
    { part: vault, material: finish('dma-vault', 0xc6ced3) },
    { part: glass, material: PALETTE.glass },
    { part: trim, material: PALETTE.trim },
  ]
}

if (import.meta.main) await save('dal-dallas-museum-of-art', 'Dallas Museum of Art', ANCHOR, BEARING, build(), 5000)
