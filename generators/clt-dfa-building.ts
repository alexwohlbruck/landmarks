/**
 * Dimensional Place (Dimensional Fund Advisors' Charlotte office),
 * 1515 S. Tryon St, South End, Charlotte — procedural, CC0-1.0.
 * bun generators/clt-dfa-building.ts
 *
 * A nine-storey office tower over a three-storey parking podium filling the
 * block between S. Tryon St, Camden Rd and W. Park Ave. What identifies it:
 *  - the tower's long, curved plan along Tryon, closing to a sharp prow at
 *    the Tryon / Camden / Summit corner;
 *  - dense bronze vertical fins over blue-grey glass on every face;
 *  - the main entrance under the prow: round concrete columns under a
 *    curved canopy two storeys up;
 *  - the podium of rose-brown terracotta panels with tall tan louvred bays,
 *    a copper-orange block on Camden, and a landscaped green roof.
 *
 * Evidence:
 *  - OSM: way/544817787 (outline, "Dimensional Place", 8 levels) and its
 *    building:parts way/1205358620 (tower, glass, 43 m, 9 levels),
 *    way/1205358621 (roof structure, concrete, 43–49 m), way/1205358622
 *    (glass pavilion on the podium, 18–23 m), way/1205358623 (podium,
 *    "#ca9a93", 18 m, 3 levels), way/1205358624 (curved block, 18.5 m),
 *    way/1205358625 and way/1205358626 (canopies at 6 m), way/1205358627
 *    (canopy at 10 m).
 *  - USGS NAIP (public domain): the plan, the tower's pale roof and
 *    mechanical enclosure, the green podium roof and its paths.
 *  - Lidar, USGS 3DEP NC Phase 4 Mecklenburg 2016 (1 m): before the building,
 *    so ground only. The ground rises ~3.5 m from the Park Ave / Tryon
 *    corner (y = 0) to Camden Rd.
 *  - Photos (Wikimedia Commons, City Dweller 2, CC BY-SA 4.0, May–June 2024):
 *    https://commons.wikimedia.org/wiki/File:Dimensional_Fund_Advisors_Building_on_South_Tryon_St_Mid-May_2024.jpg (tower from Tryon: fins, prow)
 *    https://commons.wikimedia.org/wiki/File:Dimensional_Fund_Advisors_Building_along_South_Tryon_St_Mid-May_2024.jpg (the prow from the Camden / Summit corner)
 *    https://commons.wikimedia.org/wiki/File:Dimensional_Fund_Advisors_Building_along_Camden_St_Mid-May_2024.jpg (podium from Park Ave / Camden)
 *    https://commons.wikimedia.org/wiki/File:Dimensional_Fund_Advisors_Building_main_entrance_on_South_Tryon_St_Mid-May_2024.jpg (colonnade and canopy)
 *    https://commons.wikimedia.org/wiki/File:June_5,_2024,_Scooters_along_Camden_Rd_along_Dimensional_Fund_Advisors_Building.jpg (Camden shopfronts)
 *
 * Heights: all OSM, above each part's own ground (tower 43, roof structure
 * 49, podium 18, pavilion 18–23, canopies 6 and 10). Estimated from photos:
 * the column positions under the canopy (the lobby's recess is not drawn), fin pitch
 * (2.6 m) and depth (0.7 m), louvre bay widths, the copper colour of the
 * curved Camden block.
 *
 * Doubts: no photo of the podium's Tryon side behind the tower or the
 * pavilion on the roof; both are drawn plainly. Colours of the bronze fins
 * vary with light in the photos.
 *
 * Model frame: bearing 30 (model +y runs north-north-east, along Camden Rd;
 * the podium's Park Ave face runs along x); metres above the base.
 */
import { Part } from './mesh'
import { finish, windowVariant } from './palette'
import { type XY, cap, clean, inside } from './clt-highland-park-mill-3'
import { column, facesOf, ledge, panel, parapet, walls, writeAtBase } from './clt-vantage-south-end'

const GLASS = windowVariant(2, 0x8ea5bb)
const BRONZE = finish('dfa-bronze', 0xb07850)
const TERRA = finish('dfa-terracotta', 0xab7468)
const STONE = finish('dfa-stone', 0xd8c8b0)
const GARDEN = finish('dfa-garden', 0x9cad86)
const ROOF = finish('dfa-roof', 0xc8ccd0)

/** Ground above base (lidar): rises east (+x) and a little north. */
const ground = (p: XY) => Math.max(0, Math.min(3.6, 0.024 * (p[0] + 60) + 0.0147 * (p[1] + 45)))

const TOWER: XY[] = [[27.3, 76.4], [13.4, 63.9], [1.2, 51.0], [-7.7, 40.1], [-15.5, 29.0], [-21.9, 18.3], [-25.5, 10.4], [-17.4, 4.6], [-23.5, -3.9], [-19.5, -5.2], [-4.4, -10.3], [8.0, 3.1], [14.5, 11.1], [16.5, 13.7], [23.7, 22.9], [31.7, 35.8], [34.2, 40.3], [38.6, 49.9], [30.9, 57.8], [32.3, 60.2], [31.0, 65.1], [29.5, 69.9], [27.3, 73.9]]
const ROOFTOP: XY[] = [[-11.5, 13.7], [-4.6, 8.7], [3.8, 19.3], [20.0, 42.5], [26.5, 52.2], [19.6, 57.0], [9.1, 43.1], [-4.0, 25.0]]
const PAVILION: XY[] = [[-19.5, -5.2], [-18.9, -27.0], [14.2, -27.2], [18.3, 8.2], [14.5, 11.1], [8.0, 3.1], [-4.4, -10.3]]
const PODIUM: XY[] = [[-21.9, 18.3], [-24.3, 18.5], [-55.1, -23.6], [-54.9, -45.6], [24.7, -44.6], [30.6, -44.5], [31.7, -31.9], [27.0, -35.4], [25.6, -31.0], [25.0, -27.3], [25.1, -23.1], [26.0, -19.4], [27.0, -17.0], [27.7, -16.8], [28.5, -9.6], [34.5, -8.0], [37.0, 14.0], [25.5, 21.6], [23.7, 22.9], [16.5, 13.7], [14.5, 11.1], [8.0, 3.1], [-4.4, -10.3], [-19.5, -5.2], [-23.5, -3.9], [-17.4, 4.6], [-25.5, 10.4]]
const CURVED: XY[] = [[27.0, -35.4], [25.6, -31.0], [25.0, -27.3], [25.1, -23.1], [26.0, -19.4], [27.0, -17.0], [27.7, -16.8], [27.6, -17.9], [33.4, -21.1], [33.3, -22.7], [33.0, -28.3], [32.8, -31.1], [31.7, -31.9]]
const CANOPY_E: XY[] = [[33.3, -22.7], [35.0, -23.0], [39.6, 15.3], [27.3, 24.1], [25.5, 21.6], [37.0, 14.0], [34.5, -8.0], [28.5, -9.6], [27.7, -16.8], [27.6, -17.9], [33.4, -21.1]]
const CANOPY_S: XY[] = [[24.9, -46.4], [24.7, -44.6], [30.6, -44.5], [31.7, -31.9], [32.8, -31.1], [33.0, -28.3], [34.6, -28.6], [32.4, -46.4]]

/** A thin flat slab over a ring (canopies), bottom face included. */
function slab(top: Part, side: Part, P: XY[], z0: number, z1: number) {
  walls(side, P, z0, z1)
  cap(top, P, z1)
  cap(side, P, z0, false)
}

function buildDfa() {
  const glass = new Part(), bronze = new Part(), terra = new Part(), stone = new Part(), garden = new Part(), roof = new Part()
  const T = facesOf(TOWER)
  const g0 = ground([-20, -5]), tipG = ground([28, 75])
  const TOP = g0 + 43

  // --- Podium: terracotta, louvred bays, shopfronts, green roof.
  {
    const P = clean(PODIUM), H = ground([-55, -45]) + 18
    walls(terra, P, -0.6, H)
    cap(garden, P, H - 0.4)
    for (const f of facesOf(P)) {
      ledge(stone, f, 0, f.L, H - 0.4, H, 0.12)
      if (f.L < 9) continue
      // Faces under the tower (shared walls) stay plain.
      const mid: XY = [f.A[0] + f.u[0] * f.L / 2 + f.o[0] * 1.5, f.A[1] + f.u[1] * f.L / 2 + f.o[1] * 1.5]
      if (inside(TOWER, mid) || inside(PAVILION, mid)) continue
      const pitch = 8.2, n = Math.floor(f.L / pitch), s0 = (f.L - n * pitch) / 2
      for (let k = 0; k < n; k++) {
        const s = s0 + pitch * (k + 0.5), c: XY = [f.A[0] + f.u[0] * s, f.A[1] + f.u[1] * s]
        const gz = ground(c)
        panel(glass, f, s - 3.0, s + 3.0, gz + 0.3, gz + 4.6)
        panel(stone, f, s - 2.6, s + 2.6, gz + 6.4, H - 1.6)
      }
    }
    // The copper-orange curved block on Camden.
    walls(bronze, CURVED, -0.6, ground([30, -25]) + 18.5)
    cap(roof, CURVED, ground([30, -25]) + 18.5)
    // Canopies over the Camden shopfronts.
    slab(roof, roof, CANOPY_E, ground([35, 0]) + 5.6, ground([35, 0]) + 6.2)
    slab(roof, roof, CANOPY_S, ground([30, -40]) + 5.6, ground([30, -40]) + 6.2)
    // The glass pavilion on the podium roof.
    walls(glass, PAVILION, H - 0.4, H + 5)
    parapet(stone, stone, roof, PAVILION, H + 5, 0.5, 0.35)
  }

  // --- Tower: glass with bronze fins; round columns under the curved canopy
  // at the prow mark the entrance.
  {
    const COL = tipG + 10
    walls(glass, TOWER, -0.6, TOP - 0.5)
    parapet(stone, stone, roof, TOWER, TOP, 1.2, 0.4)
    for (const f of T) {
      const pitch = 2.6, n = Math.max(1, Math.round(f.L / pitch))
      for (let k = 0; k <= n; k++) {
        if ((k === 0 || k === n) && f.L > 3) continue
        const s = (k / n) * f.L, c: XY = [f.A[0] + f.u[0] * s, f.A[1] + f.u[1] * s]
        const nearTip = Math.hypot(c[0] - 27.8, c[1] - 75.5) < 14
        const out: XY = [c[0] + f.o[0] * 1.5, c[1] + f.o[1] * 1.5]
        const z0 = nearTip ? COL : inside(PODIUM, out) ? ground([-55, -45]) + 18.2 : ground(c) + 4
        const z1 = TOP - 0.2
        ledge(bronze, f, s - 0.28, s + 0.28, z0, z1, 0.7)
      }
    }
    // Round columns under the canopy at the prow.
    for (const c of [[36.6, 46.5], [34.0, 57.4], [32.4, 66.4], [28.3, 75.4]] as XY[]) column(stone, c, 0.6, -0.6, COL)
    // The curved canopy round the prow and along Camden (way/1205358627).
    const CAN: XY[] = [[25.5, 21.6], [27.3, 24.1], [33.2, 35.1], [35.5, 39.6], [40.3, 50.0], [36.9, 57.3], [33.5, 67.8], [28.6, 77.6], [27.3, 76.4], [29.5, 69.9], [31.0, 65.1], [32.3, 60.2], [30.9, 57.8], [38.6, 49.9], [34.2, 40.3], [31.7, 35.8], [23.7, 22.9]]
    slab(roof, roof, CAN, COL - 0.6, COL)
    // Roof structure (way/1205358621), pale concrete.
    {
      const R = clean(ROOFTOP)
      walls(roof, R, TOP - 1.2, g0 + 49)
      cap(roof, R, g0 + 49)
    }
  }

  return {
    id: 'clt-dfa-building', name: 'Dimensional Place', anchor: [0, 0] as XY, height: g0 + 49,
    parts: [
      { part: glass, material: GLASS },
      { part: bronze, material: BRONZE },
      { part: terra, material: TERRA },
      { part: stone, material: STONE },
      { part: garden, material: GARDEN },
      { part: roof, material: ROOF },
    ],
  }
}

if (import.meta.main) await writeAtBase(buildDfa())
