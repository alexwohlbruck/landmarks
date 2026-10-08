/**
 * Steinway Tower, 111 West 57th Street (SHoP Architects, 2021), with the
 * landmarked Steinway Hall (Warren & Wetmore, 1925) at its base —
 * original procedural geometry, CC0-1.0.
 * bun generators/nyc-steinway-tower.ts
 *
 * x = across the Manhattan grid (118.85°), y = up the avenues (28.85°),
 * z = metres up. Anchor is the centroid of OSM way/261504064
 * (40.7647294, -73.9773054); bearing 28.85°, elevation 0. 57th Street is
 * to the south (y ≈ -22), 58th Street to the north (y ≈ 44).
 *
 * Evidence
 * - OSM: the tower outline (way/261504064) and its 14 building:parts. The
 *   tower is 18.1 × 24.9 m; its south side steps back in 13 strips 1.7 m
 *   deep, from 200 m to 435 m (way/1158813440 … 1158813428; the mapper notes
 *   the heights were found by counting floors at 5 m). way/1158813441 is
 *   the glass retail lobby on 57th Street east of the hall. Steinway Hall is
 *   way/265147970, an L that wraps the tower on the west and north.
 * - Published (Wikipedia, "111 West 57th Street", "Steinway Hall"): pinnacle
 *   1,423 ft 7 in (433.5 m), roof slab 383 m; tower site about 59 × 75 ft
 *   (18 × 23 m), slenderness about 1:24; north elevation rises straight to
 *   the pinnacle, setbacks on the south; north and south elevations are glass
 *   curtain walls with bronze mullions; east and west elevations are narrow
 *   windows between beige glazed terracotta piers, each pier rising to one of
 *   the setbacks; an 80 ft (24 m) glass retail lobby. Steinway Hall: 16
 *   storeys, L-shaped, 63 ft on 57th Street and 100 ft on 58th; limestone
 *   base, setback and urn parapet above the 12th storey; a chamfered
 *   colonnaded top on 13–16; setbacks above the 9th and 12th on 58th.
 * - Measured (USGS 3DEP 2017 lidar, flown while the tower was a hole in the
 *   ground, so for the hall only): front block parapet 51–53 m at the street
 *   line, roof 62 m behind it, the colonnaded crown 66–69 m; the rear tower
 *   of the hall 73 m with its top at 84 m; the 58th Street wing 61–66 m,
 *   stepping to 50 m and 39 m at the street.
 * - Photos (Wikimedia Commons): Percival Kestreltail "111 West 57th Street
 *   from Top of the Rock" (CC BY-SA 4.0, south-east); Ajay Suresh "111 West
 *   57th Street - Steinway Building" (CC BY 4.0, the hall from 57th Street);
 *   Short final "111 West 57th Street.png" (CC BY-SA 4.0); Kidfly182 "111 West
 *   57th Street 002" (CC BY 4.0); Itrytohelp32 "Billionaires' Row 2020"
 *   (CC BY-SA 4.0); Wil540 art "05 23 2022 Super tall buildings and Central
 *   park from Roof NYC" (CC BY-SA 4.0, from the east).
 *
 * Estimated: the tower's step heights (OSM's floor count), the glass lobby
 * at 24 m, the hall's massing beyond what the lidar shows. The real
 * terracotta piers are about 1 m wide on a 1.7 m pitch; they are drawn one
 * per setback strip, which is the real rhythm, with the windows between them
 * broken every four floors so they do not run as full-height stripes.
 */
import { Part } from './mesh'
import { PALETTE, finish } from './palette'
import { edges, facePanel, prism, rect, save, type XY } from './nyc-432-park'

function build() {
  const terra = new Part(), win = new Part(), bronze = new Part(), stone = new Part(), roof = new Part()

  // ---- The tower ------------------------------------------------------------------
  const X0 = -33.1, X1 = -15.0, Y1 = 22.9
  // [south edge, height] of each strip, south to north (OSM parts).
  const strips: [number, number][] = [
    [-2.0, 200], [-0.1, 248], [1.6, 283], [3.3, 308], [5.0, 328], [6.7, 343], [8.4, 358],
    [10.1, 373], [11.8, 383], [13.5, 393], [15.2, 405], [16.9, 417], [18.6, 435],
  ]
  const STOREY = 4.1, GROUP = 4 * STOREY
  strips.forEach(([y0, h], k) => {
    const y1 = k + 1 < strips.length ? strips[k + 1][0] : Y1
    const prev = k > 0 ? strips[k - 1][1] : 0
    // Each strip is its own slab standing from the ground; the hall and the
    // lobby hide its foot. Only the outer faces get detail.
    prism(terra, rect(X0, X1, y0, y1), 0, h, { bevel: 0.25, top: roof })
    // East and west faces: one terracotta pier per strip, a window slit
    // beside it, broken every four storeys.
    const pier = 0.6, CROWN = 383 // the roof slab; above it the pinnacle's slits are bronze filigree
    for (const [a, b] of [[[X1, y0], [X1, y1]], [[X0, y1], [X0, y0]]] as [XY, XY][]) {
      const w = y1 - y0
      const east = a[0] === X1
      const start = east ? 26 : 74 // above the lobby and the neighbours; above the hall
      for (let z = start; z < h - 2; z += GROUP) {
        const top = Math.min(z + GROUP - 0.9, h - 1.2)
        if (top - z < 2) continue
        // The slit sits on the north side of the strip on both faces.
        const segs: [number, number, Part][] = top <= CROWN || z >= CROWN ? [[z, top, z >= CROWN ? bronze : win]] : [[z, CROWN - 0.5, win], [CROWN + 0.5, top, bronze]]
        for (const [lo, hi, part] of segs) {
          if (hi - lo < 1.5) continue
          // The wide top strip carries several piers at the same 1.7 m pitch.
          const n = Math.max(1, Math.round(w / 1.7)), q = w / n
          for (let i = 0; i < n; i++) {
            if (east) facePanel(part, a, b, i * q + pier, (i + 1) * q - 0.12, lo, hi)
            else facePanel(part, a, b, i * q + 0.12, (i + 1) * q - pier, lo, hi)
          }
        }
      }
    }
    // South face of this strip: glass between the previous setback and this one.
    const zs = k === 0 ? 26 : prev + 0.8
    southWall(rect(X0, X1, y0, y1), zs, h - 0.6)
  })
  // North face: glass all the way up, reflective panels on the pinnacle.
  northWall(rect(X0, X1, strips[0][0], Y1), 64, 433)

  /** A glass curtain wall split by bronze mullions into four bays and four-storey rows. */
  function glassWall(a: XY, b: XY, z0: number, z1: number) {
    const l = Math.hypot(b[0] - a[0], b[1] - a[1]), bays = 4, m = 0.35
    for (let z = z0; z < z1 - 1; z += GROUP) {
      const top = Math.min(z + GROUP, z1)
      for (let i = 0; i < bays; i++) {
        const s0 = 0.5 + i * (l - 1) / bays, s1 = 0.5 + (i + 1) * (l - 1) / bays
        facePanel(win, a, b, s0 + m, s1 - m, z + 0.45, top - 0.45)
      }
      facePanel(bronze, a, b, 0.5, l - 0.5, top - 0.45, Math.min(top + 0.45, z1), 0.03)
    }
  }
  function southWall(r: XY[], z0: number, z1: number) { if (z1 > z0 + 2) glassWall(r[0], r[1], z0, z1) }
  function northWall(r: XY[], z0: number, z1: number) { glassWall(r[2], r[3], z0, z1) }

  // ---- The glass retail lobby on 57th Street ----------------------------------------
  {
    const lobby = rect(-29.2, X1, -19.6, -2.0)
    prism(terra, lobby, 0, 24, { bevel: 0.25, top: roof })
    edges(lobby).forEach(([a, b], f) => {
      if (f === 3 || f === 2) return // against the hall and the tower
      const l = Math.hypot(b[0] - a[0], b[1] - a[1])
      facePanel(win, a, b, 0.6, l - 0.6, 0.4, 23)
    })
  }

  // ---- Steinway Hall --------------------------------------------------------------
  /** Punched-window bays on a masonry face, grouped three storeys a panel. */
  function masonry(r: XY[], z0: number, z1: number, faces: number[], bay = 5.2, base = 0) {
    edges(r).forEach(([a, b], f) => {
      if (!faces.includes(f)) return
      const l = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.round(l / bay)), w = l / n
      for (let z = Math.max(z0, base) + 1.2; z + 4 < z1 - 1.2; z += 12.6) {
        const top = Math.min(z + 10.6, z1 - 1.6)
        for (let i = 0; i < n; i++) facePanel(win, a, b, i * w + w * 0.28, (i + 1) * w - w * 0.28, z, top)
      }
    })
  }
  // Front block on 57th Street: 12 storeys to the urn parapet at the street
  // line, then set back to the 62 m roof and the chamfered colonnade top.
  const HX0 = -45.7, HX1 = -29.2
  const front = rect(HX0, HX1, -19.7, -2.0)
  prism(stone, front, 0, 52, { bevel: 0.35, top: roof })
  masonry(front, 18, 52, [0, 3], 5.5)
  masonry(front, 26, 52, [1], 5.5)
  // The three-storey limestone base: the arched entrance and two portals.
  facePanel(win, front[0], front[1], 6.4, 10.1, 0.3, 11.5)
  facePanel(win, front[0], front[1], 1.6, 4.2, 0.3, 6.5)
  facePanel(win, front[0], front[1], 12.3, 14.9, 0.3, 6.5)
  const upper = rect(HX0 + 0.6, HX1 - 0.6, -18.2, -2.0)
  prism(stone, upper, 52, 62, { bevel: 0.35, top: roof })
  masonry(upper, 52, 62, [0, 3], 5)
  const crown: XY[] = [[-42.4, -16], [-34.8, -16], [-32.6, -13.8], [-32.6, -6.2], [-34.8, -4], [-42.4, -4], [-44.6, -6.2], [-44.6, -13.8]]
  prism(stone, crown, 62, 68, { bevel: 0.3, top: roof })
  edges(crown).forEach(([a, b], f) => {
    if (f % 2) return // colonnade glazing on the four main faces only
    const l = Math.hypot(b[0] - a[0], b[1] - a[1])
    facePanel(win, a, b, 1.2, l - 1.2, 63, 66.6)
  })
  // The hall's rear tower, behind the front block, west of the new tower.
  const rear = rect(HX0, X0, -2.0, 18.0)
  prism(stone, rear, 0, 73, { bevel: 0.35, top: roof })
  masonry(rear, 20, 73, [3], 5)
  const rearTop: XY[] = [[-43.5, 5.5], [-38.5, 5.5], [-36.5, 7.5], [-36.5, 12.5], [-38.5, 14.5], [-43.5, 14.5], [-45.5, 12.5], [-45.5, 7.5]]
  prism(stone, rearTop.map(([x, y]) => [x + 0.8, y] as XY), 73, 82, { bevel: 0.3, top: roof })
  // The 58th Street wing: 62 m, stepping down to the street.
  const wingW = rect(HX0, X0, 18.0, Y1)
  const wing = rect(HX0, X1, Y1, 38.0)
  const wingStep = rect(HX0, X1, 38.0, 41.6)
  prism(stone, wingW, 0, 62, { bevel: 0.35, top: roof })
  prism(stone, wing, 0, 62, { bevel: 0.35, top: roof })
  prism(stone, wingStep, 0, 50, { bevel: 0.35, top: roof })
  masonry(wingW, 0, 62, [3], 5, 10)
  masonry(wing, 10, 62, [1, 3], 5, 10)
  masonry(wing, 50, 62, [2], 5, 10)
  masonry(wingStep, 0, 50, [1, 2, 3], 6, 10)

  return [
    { part: terra, material: finish('glazed-terracotta', 0xe2d4bc) },
    { part: win, material: { ...PALETTE.window, color: 0x5f7486 } },
    { part: bronze, material: finish('bronze', 0x857766) },
    { part: stone, material: PALETTE.stone },
    { part: roof, material: PALETTE.roof },
  ]
}

if (import.meta.main) {
  await save('nyc-steinway-tower', 'Steinway Tower', build(), {
    bearing: 28.85, anchor: [40.7647294, -73.9773054], height: 435,
    note: 'Slender tower with feathered south setbacks and terracotta piers east and west, over Steinway Hall',
  })
}
