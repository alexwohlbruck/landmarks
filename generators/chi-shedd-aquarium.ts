/**
 * John G. Shedd Aquarium (1200 South DuSable Lake Shore Drive, 1930, Graham,
 * Anderson, Probst & White; Abbott Oceanarium 1991, Lohan Associates),
 * Chicago — original procedural geometry, CC0-1.0.
 * bun generators/chi-shedd-aquarium.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. The anchor is the area centroid of the 1930 building's OSM part
 * way/766506552 (41.8676081, -87.6140757), which is also the centre of its
 * octagonal dome; that part's walls run at 88.7° / 178.7°, so the catalog
 * bearing is 358.7. Everything else is placed from OSM in that frame.
 *
 * Identity, in order: the white marble Beaux-Arts building on a cross-shaped
 * octagonal plan, its arms ending in low pediments; the west front's Doric
 * portico in antis with a full pediment, raised over the walls; the
 * octagonal drum in the middle carrying a low octagonal roof of grey-green
 * glazing in three steps, with a small lantern and finial; on the lake side, the Oceanarium: a fan of curved glass wall
 * between slim white piers under a white fascia.
 *
 * Evidence:
 *  - plan: OSM relation/17430414 (outer ways 24825568 and 1378225190, the
 *    whole complex) and its parts: the 1930 building way/766506552 (93 x
 *    90 m, arms 50 m wide, diagonals chamfered), the dome's octagon
 *    way/766511382 (~25 m across), the Oceanarium way/766511383 (a fan
 *    ~62 m deep, its outer face an arc), the Phelps Theater way/766511381.
 *    The remainder of the outline (the link between the old building and
 *    the Oceanarium, service yards) is drawn as a low base. No heights in
 *    OSM (building:levels 1).
 *  - heights: estimates from photos, scaled by the portico (~22 m wide in
 *    OSM, ~27 px/m): on Tony Hisgett's square-on view of the west front the
 *    porch is ~4.5 m up its steps, the columns ~9-10 m, the entablature
 *    ~3 m, the pediment apex ~22 m, well over the walls' parapet at ~13 m.
 *    The drum rises to ~21.6 m; the glazed roof steps up ~6 m more and the
 *    lantern and finial reach ~30 m, their top standing ~6 m over the
 *    pediment in the same photo (Kelly Martin's views from the north-west
 *    and south-west agree, against the wall height). The Oceanarium's top is level
 *    with the old walls (~12.5 m) and its glass is about three quarters of
 *    that (TonyTheTiger's view across the harbour from the south-east).
 *  - colour: white Georgia marble; the central roof's grey-green glazing
 *    (Hisgett's west view; it reads teal at dusk in Kelly Martin's); the
 *    Oceanarium's glass dark green-grey between white piers.
 *
 * Photos (Wikimedia Commons): John_G_Shedd_Aquarium_(15613710221).jpg (Tony
 * Hisgett, CC BY 2.0, west front); Acuario_Shedd,_Chicago,..._DD_02/03.jpg
 * (Diego Delso, CC BY-SA 3.0, south and south-west);
 * KM_5866_shedd_aquarium_august_2007.jpg and KM_5998_... (Kelly Martin, CC
 * BY-SA 3.0, south-west and north-west); 20070110_Shedd_Aquarium.JPG
 * (TonyTheTiger, CC BY-SA 3.0, Oceanarium from the south-east);
 * Behind_the_Shedd_Aquarium_2018.jpg (Dnino1, CC BY-SA 4.0, Oceanarium from
 * the north). USGS NAIP for the plan and the Oceanarium's roof lights. No
 * commercial imagery.
 *
 * Left out: the parapet's anthemion cresting, the bronze doors and aquatic
 * ornament, the roof's ridge railings, the plaza and its steps beyond the
 * podium, the outdoor terraces by the lake.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { block, cap, column, cornice, gableY, inset, lathe, panel, rakingCornice, rect, save, walls, type XY } from './chi-field-museum'

// The whole complex (relation/17430414), counter-clockwise.
const OUTER: XY[] = [[-27.5,-36.1],[-24.6,-39.1],[-24.5,-45.0],[-17.4,-45.0],[-17.4,-46.6],[-10.9,-46.6],[-10.7,-45.0],[11.1,-44.8],[11.2,-46.8],[17.9,-46.8],[17.7,-44.7],[25.6,-44.6],[33.7,-44.8],[34.5,-45.8],[36.2,-48.2],[38.2,-50.9],[37.7,-51.3],[43.1,-59.0],[44.9,-57.6],[50.1,-64.4],[51.7,-63.3],[57.1,-70.1],[60.6,-67.8],[66.8,-61.9],[72.5,-54.9],[79.7,-60.1],[88.3,-53.8],[91.0,-51.2],[94.0,-48.2],[96.4,-45.6],[102.0,-38.5],[106.1,-30.6],[109.4,-23.4],[111.6,-16.1],[113.1,-5.8],[113.2,4.6],[111.8,14.6],[109.2,23.0],[105.5,31.6],[101.2,38.6],[96.3,45.0],[91.4,50.0],[85.8,54.8],[80.3,58.5],[72.6,53.3],[65.6,61.8],[57.8,69.3],[53.0,63.4],[50.8,64.1],[46.1,57.9],[43.6,58.2],[38.6,51.7],[38.7,50.1],[34.1,44.1],[25.9,44.1],[26.0,45.0],[-24.5,45.1],[-24.6,39.8],[-31.8,32.0],[-38.3,25.2],[-44.9,25.2],[-44.8,10.9],[-47.2,10.9],[-47.6,-10.7],[-45.1,-10.6],[-45.0,-24.9],[-38.7,-24.7],[-35.4,-28.1],[-41.5,-33.8],[-45.2,-33.2],[-47.3,-34.2],[-47.7,-36.4],[-47.7,-38.8],[-46.5,-40.8],[-44.8,-43.0],[-40.8,-46.4],[-35.9,-47.8],[-33.2,-46.8],[-32.8,-45.6],[-33.6,-41.6]]

// The 1930 building, squared up and made symmetrical (half widths from
// way/766506552: arms 25 m, body 45-46 m, chamfers from 25 to 38.5).
const A = 25, B = 45.3, C = 38.6
const MAIN: XY[] = [[-A, -B], [A, -B], [A, -C + 0], [C, -A], [B, -A], [B, A], [C, A], [A, C], [A, B], [-A, B], [-A, C], [-C, A], [-B, A], [-B, -A], [-C, -A], [-A, -C]]

const OCEANARIUM: XY[] = [[80.3,58.5],[72.6,53.3],[51.7,36.7],[58.4,25.2],[62.7,9.0],[63.6,-3.3],[61.4,-17.0],[55.6,-31.6],[51.2,-38.5],[72.5,-54.9],[79.7,-60.1],[88.3,-53.8],[91.0,-51.2],[94.0,-48.2],[96.4,-45.6],[102.0,-38.5],[106.1,-30.6],[109.4,-23.4],[111.6,-16.1],[113.1,-5.8],[113.2,4.6],[111.8,14.6],[109.2,23.0],[105.5,31.6],[101.2,38.6],[96.3,45.0],[91.4,50.0],[85.8,54.8]]
const THEATER: XY[] = [[43.1,-59.0],[44.9,-57.6],[50.1,-64.4],[51.7,-63.3],[57.1,-70.1],[60.6,-67.8],[66.8,-61.9],[72.5,-54.9],[51.2,-38.5],[45.9,-44.3],[38.2,-50.9]]

function build() {
  const marble = new Part(), trim = new Part(), win = new Part(), roof = new Part(), dome = new Part(), glass = new Part()

  const BASE = 4.5, WALL = 13.0, ARM_APEX = 15.8
  const PORCH = 4.5, P_COL = 14.8, P_ENT = 17.8, P_APEX = 22.4
  const DRUM = 21.6

  // Low base under the whole outline: the link to the Oceanarium, service
  // wings and terraces.
  block(marble, roof, inset(OUTER, 0.4), 0, BASE, 0.3)

  // --- 1930 building: walls, cornice, flat roof over the chamfered core.
  walls(marble, MAIN, 0, WALL - 1.1)
  cornice(trim, MAIN, WALL - 1.1, WALL, 0.45)
  cap(roof, inset(MAIN, -0.18), WALL)

  // Each arm carries a low gabled roof ending in a pediment over its face.
  // North and south arms run along y; the east arm along x (written with x
  // and y swapped, then swapped back).
  for (const s of [-1, 1]) {
    const y0 = s < 0 ? -B - 0.3 : C - 2, y1 = s < 0 ? -C + 2 : B + 0.3
    gableY(roof, marble, -A - 0.3, A + 0.3, y0, y1, WALL, ARM_APEX)
    rakingCornice(trim, -A - 0.5, A + 0.5, s * (B + 0.3), s as 1 | -1, WALL, ARM_APEX + 0.15, 0.5, 0.4)
  }
  {
    // East arm: a gable along x.
    const x0 = C - 2, x1 = B + 0.3, y0 = -A - 0.3, y1 = A + 0.3, ym = 0
    roof.quad([x0, y0, WALL], [x1, y0, WALL], [x1, ym, ARM_APEX], [x0, ym, ARM_APEX])
    roof.quad([x1, y1, WALL], [x0, y1, WALL], [x0, ym, ARM_APEX], [x1, ym, ARM_APEX])
    marble.tri([x1, y0, WALL], [x1, y1, WALL], [x1, ym, ARM_APEX])
    marble.tri([x0, y1, WALL], [x0, y0, WALL], [x0, ym, ARM_APEX])
  }

  // Windows: tall pairs on the arms' faces, small ones high on the diagonals.
  const faces: [XY, XY][] = []
  for (let i = 0; i < MAIN.length; i++) faces.push([MAIN[i], MAIN[(i + 1) % MAIN.length]])
  for (const [a, b] of faces) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const west = a[0] < -B + 0.1 && b[0] < -B + 0.1
    if (west) continue // the portico front
    if (L > 40) {
      // Arm face: three tall windows in the middle, grouped as on the south front.
      for (const c of [-9, 0, 9]) panel(win, a, b, L / 2 + c - 1.6, L / 2 + c + 1.6, 4.2, 9.6)
    } else if (L > 10) {
      for (const c of [0.3, 0.7]) panel(win, a, b, L * c - 1.1, L * c + 1.1, 6.5, 9.6)
    }
  }

  // --- West portico: a temple front raised over the walls, Doric columns in
  // antis, gabled roof running back east.
  {
    const X0 = -B - 2.2, X1 = -27, W = 11.2
    const body = rect(X0, -W, X1, W)
    // Podium and steps.
    block(marble, marble, rect(X0, -W, -B, W), 0, PORCH, 0.2)
    for (let k = 0; k < 4; k++) block(marble, marble, rect(X0 - 1.7 * (k + 1), -W + 2.6, X0 - 1.7 * k, W - 2.6), 0, PORCH - 1.1 * (k + 1), 0)
    // Antae and the recessed wall behind the columns.
    const PIER = 2.4
    for (const e of [-1, 1]) {
      const y0 = e < 0 ? -W : W - PIER, y1 = e < 0 ? -W + PIER : W
      walls(marble, rect(X0, y0, -B, y1), PORCH, P_COL)
    }
    const DEPTH = 1.95
    const wa: XY = [X0 + DEPTH, W - PIER], wb: XY = [X0 + DEPTH, -W + PIER]
    walls(marble, [wa, wb, [X0 + DEPTH - 0.01, -W + PIER - 0.01] as XY, [X0 + DEPTH - 0.01, W - PIER + 0.01] as XY], PORCH, P_COL)
    const span = 2 * (W - PIER), bay = span / 7
    for (let k = 0; k < 7; k++) panel(win, wa, wb, k * bay + 0.55, (k + 1) * bay - 0.55, PORCH + 0.3, P_COL - 2.2, 0.05)
    marble.quad([X0, -W + PIER, P_COL], [X0, W - PIER, P_COL], [X0 + DEPTH, W - PIER, P_COL], [X0 + DEPTH, -W + PIER, P_COL])
    for (let k = 1; k <= 6; k++) column(trim, trim, X0 + 0.95, -W + PIER + k * bay, PORCH, P_COL, 0.78, 10)
    // Entablature and the gabled temple roof.
    walls(marble, body, P_COL, P_ENT - 0.7)
    walls(marble, rect(-B, -W, X1, W), WALL, P_COL)
    cornice(trim, body, P_ENT - 0.7, P_ENT, 0.45)
    const o = inset(body, -0.3)
    // Gable along x: write it with x and y swapped.
    const gx0 = o[0][0], gx1 = o[1][0], gy0 = o[0][1], gy1 = o[2][1], ym = 0
    roof.quad([gx0, gy0, P_ENT], [gx1, gy0, P_ENT], [gx1, ym, P_APEX], [gx0, ym, P_APEX])
    roof.quad([gx1, gy1, P_ENT], [gx0, gy1, P_ENT], [gx0, ym, P_APEX], [gx1, ym, P_APEX])
    marble.tri([gx0, gy1, P_ENT], [gx0, gy0, P_ENT], [gx0, ym, P_APEX])
    marble.tri([gx1, gy0, P_ENT], [gx1, gy1, P_ENT], [gx1, ym, P_APEX])
    // Raking cornice on the west pediment: build it on a swapped frame.
    const rc = new Part()
    rakingCornice(rc, gy0 - 0.2, gy1 + 0.2, gx0, -1, P_ENT, P_APEX + 0.15, 0.55, 0.45)
    for (let i = 0; i < rc.pos.length; i += 9) {
      const pt = (j: number): V3 => {
        // rc wrote glTF (x, z, -y) of map (y', x', z): undo, then swap.
        const X = rc.pos[i + j * 3], Y = -rc.pos[i + j * 3 + 2], Z = rc.pos[i + j * 3 + 1]
        return [Y, X, Z]
      }
      // Swapping x and y mirrors, so reverse the winding.
      trim.tri(pt(0), pt(2), pt(1))
    }
  }

  // --- Central drum and roof: a plain octagonal drum on a stepped base,
  // then the low octagonal roof of grey-green glazing in three steps, a
  // small octagonal lantern and a finial.
  {
    const oct = (r: number): XY[] => Array.from({ length: 8 }, (_, i) => {
      const t = Math.PI / 8 + (i * Math.PI) / 4
      return [r * Math.cos(t), r * Math.sin(t)] as XY
    })
    const R = 12.3 / Math.cos(Math.PI / 8)
    block(marble, roof, oct(R + 1.6), WALL, WALL + 2.2, 0.3)
    walls(marble, oct(R), WALL + 2.2, DRUM - 0.9)
    cornice(trim, oct(R), DRUM - 0.9, DRUM, 0.45)
    // Three sloped tiers, each with a short upright step to the next.
    const tiers: [number, number, number][] = [[1.02, 0.74, 1.9], [0.68, 0.46, 1.5], [0.41, 0.2, 1.1]]
    let z = DRUM
    tiers.forEach(([a, b, h], i) => {
      const ra = oct(R * a), rb = oct(R * b)
      walls(dome, ra, z, z + h, rb)
      z += h
      const next = tiers[i + 1]
      if (next) {
        // Flat ledge in to the next tier's foot, then its upright step.
        const rn = oct(R * next[0])
        walls(dome, rb, z, z, rn)
        walls(dome, rn, z, z + 0.45)
        z += 0.45
      } else cap(dome, rb, z)
    })
    // Lantern: an octagonal drum of light trim, its own little pyramid, a finial.
    const L0 = oct(1.9), L1 = oct(2.3)
    walls(trim, L0, z, z + 1.5)
    walls(dome, L1, z + 1.5, z + 2.3, oct(0.3))
    walls(dome, L0, z + 1.5, z + 1.5, L1)
    lathe(trim, 0, 0, [[0.3, z + 2.3], [0.12, z + 4.4], [0, z + 4.5]], 6)
  }

  // --- Oceanarium: white fascia and flat roof with curved roof lights;
  // glass wall between white piers on the lake face, stone to the link.
  {
    const TOP = 12.6, GL = 9.4
    const r = OCEANARIUM
    const isGlass = (a: XY, b: XY) => (a[0] + b[0]) / 2 > 70
    for (let i = 0; i < r.length; i++) {
      const a = r[i], b = r[(i + 1) % r.length]
      if (isGlass(a, b)) {
        walls(win, [a, b], 0.6, GL)
        walls(marble, [a, b], 0, 0.6)
        walls(trim, [a, b], GL, TOP)
        // A pier at every vertex of the facetted arc.
        const L = Math.hypot(b[0] - a[0], b[1] - a[1])
        if (L > 2.5 && i % 2 === 0) {
          const ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L, nx = uy, ny = -ux
          const pr = [[a[0] - ux * 0.35, a[1] - uy * 0.35], [a[0] + ux * 0.35, a[1] + uy * 0.35], [a[0] + ux * 0.35 + nx * 0.5, a[1] + uy * 0.35 + ny * 0.5], [a[0] - ux * 0.35 + nx * 0.5, a[1] - uy * 0.35 + ny * 0.5]] as XY[]
          walls(trim, pr, 0, GL)
        }
      } else walls(marble, [a, b], 0, TOP)
    }
    cornice(trim, r, TOP - 0.2, TOP + 0.4, 0.3)
    cap(roof, r, TOP + 0.4)
    // Roof lights: three concentric curved bands about the fan's apex.
    const cx = 18, cy = 0
    for (const [ra, rb] of [[50, 54], [62, 66], [74, 78]]) {
      const n = 10, t0 = -0.62, t1 = 0.62
      for (let k = 0; k < n; k++) {
        const ta = t0 + ((t1 - t0) * k) / n, tb = t0 + ((t1 - t0) * (k + 1)) / n
        const P = (rr: number, t: number): V3 => [cx + rr * Math.cos(t), cy + rr * Math.sin(t), TOP + 0.46]
        glass.quad(P(ra, ta), P(rb, ta), P(rb, tb), P(ra, tb))
      }
    }
  }

  // Phelps Theater: a plain low block.
  block(marble, roof, THEATER, 0, 7.5, 0.3)

  return [
    { part: marble, material: finish('shedd-marble', 0xebe5da) },
    { part: trim, material: PALETTE.trim },
    { part: win, material: PALETTE.window },
    { part: roof, material: PALETTE.roof },
    { part: dome, material: finish('shedd-roof-glazing', 0xa3b4ab) },
    { part: glass, material: PALETTE.glass },
  ]
}

if (import.meta.main) await save('chi-shedd-aquarium', 'Shedd Aquarium', [41.8676081, -87.6140757], 358.7, build())
