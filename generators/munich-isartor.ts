/**
 * Isartor, Isartorplatz, Munich: the east gate of the second town wall,
 * 1337; the only one of the medieval gates kept whole. A tall square main
 * tower (Torturm) on the town side, two octagonal flanking towers on the
 * Isar side joined by the front wall with its three pointed arches, side
 * walls closing the little court (Zwinger) between. Restored by Friedrich
 * von Gärtner 1833-35, when Bernhard von Neher painted the fresco of
 * Emperor Ludwig the Bavarian's triumphal entry after the battle of
 * Gammelsdorf across the front wall. Original procedural geometry,
 * CC0-1.0.
 * bun generators/munich-isartor.ts
 *
 * Map frame of this model: x across the gate (+x north-east), y along it
 * (+y north-west, toward the town and the street Tal; -y south-east, the
 * Isartorplatz front), z up, metres; origin at the anchor on the ground.
 * Catalog bearing -36.4: the main tower's and the front wall's long sides
 * in OSM run at 53.6 degrees. Anchor = area centroid of the outline,
 * relation/6035286 (outer way/385459743 less the court, inner
 * way/385459744), 48.135116, 11.581787. The gate is drawn symmetric about
 * x = 0 (OSM's halves agree within 0.5 m).
 *
 * Identity, in order: the main tower, tall and plain, with its hipped red
 * roof, the corbelled arcade frieze under the eaves, the blue clock and
 * three tall windows; the two octagonal flanking towers with their low
 * pyramid roofs, the glazed top storey under wide eaves, double string
 * courses with little lunette windows and the passage through the base;
 * between them the front wall's three pointed arches under Neher's long
 * coloured fresco and a tiled roof; the warm sand render.
 *
 * Evidence:
 *  - plan: OSM, read in the turned frame: main tower way/222558900, x
 *    -6.7..6.6, y 13.4..21.3 (13.3 x 7.9 m), with corner piers
 *    402456107-110 (~1.3 m, 20 m, pyramidal); flanking towers 222558901 and
 *    222558902, regular octagons 11.7 m across the flats, faces square to
 *    the frame, centres (-16.2, -9.2) and (15.8, -10.2), drawn at
 *    (+-16.0, -9.7); front wall 30982596, y -5.3..-3.8; side walls
 *    402399610/611, x +-(11.3..12.8), returning along y 13.5..14.6 to the
 *    main tower's corners; the canopy over the crucifixion picture
 *    402456105 (x -3.0..2.9, y 12.3..13.4, 12 m, skillion).
 *  - heights: OSM gives the main tower 38 m (roof 4), the flanking towers
 *    20 (roof 4), the front wall 12 (roof 1), the side walls 8 (roof 1);
 *    de.wikipedia: "40 m hohen Torturm". Measured on the photos:
 *    flanking towers (Delso's frontal DD 06, scaled from the octagon's
 *    projected 12.5 m width): plinth 2.0, string courses 7.2-7.6 and
 *    10.8-11.3, cornice 14.9-15.2, glazed band 15.6-16.6, eaves 16.9, door
 *    3.6 m wide with its apex at 4.4 (drawn pointed, apex 4.8); drawn with
 *    1.5 m eaves and the pyramid roofs to 21.0 (OSM 20); front wall (DD 06 and DD 05): eaves
 *    10.4, ridge 11.3, fresco 7.8-9.8, tracery frieze 6.0-6.6, arches 4.8
 *    (centre) and 4.5 m wide, springing 3.2, apex 5.6 (drawn pointed:
 *    springing 2.4-2.5, apex 5.8-5.95). The main tower is
 *    read through perspective on DD 06 and Rabich's photo (two estimates of
 *    the ridge, 33.4 and 36.2 m, against OSM's 38 and Wikipedia's 40):
 *    drawn eaves 31.0, ridge 35.5, finials to 38.0, frieze 28.7-31.0, clock
 *    centred 26.2 (2.6 m across), the three windows 21.6-23.4; the
 *    passage 4.4 m wide (Dguendel's Tal photo), apex 6.9.
 *  - colours from the daylight photos: the flanking towers and walls a
 *    warm sand render, the main tower paler and greyer (OSM building:colour
 *    #c7b8a1 and #e2d5c5 agree), red-brown tile roofs, the fresco's warm
 *    ochres and reds (one colour), the dark blue clock dial in a pale ring,
 *    the painted arms on the flanking towers (in the fresco colour).
 *  - night: no licensed night photo checked; the gate is floodlit in
 *    reality (estimated), and the flanking towers' glazed top storeys are
 *    lit (a café and the Valentin-Karlstadt-Musäum).
 *  - elevation 0. No lidar in Germany; no Bavarian 3D city model used.
 *
 * Photos (Wikimedia Commons, all evidence):
 *  - Isartor,_Múnich,_Alemania,_2024-04-02,_DD_06.jpg (Diego Delso, CC BY-SA
 *    4.0): the front, frontal; main measuring photo (and its full-size crop
 *    of the south-west flanking tower).
 *  - Isartor,_Múnich,_Alemania,_2024-04-02,_DD_05.jpg (Diego Delso, CC BY-SA
 *    4.0): the front wall close up, the main tower's court face behind.
 *  - Isartor_München,_ohne_Autos.jpg (Burkhard Mücke, CC BY-SA 4.0): front.
 *  - München,_Isartor_--_2011_--_1011.jpg (Dietmar Rabich, CC BY-SA 4.0):
 *    from the south-east, long lens.
 *  - Isartor_(München)_-_Panorama.jpg (Guido Radig, CC BY-SA 4.0): front.
 *  - Innenhof_Isartor_München_01.jpg (Burkhard Mücke, CC BY-SA 4.0): a side
 *    wall's arch from the court.
 *  - München,_die_Straße_"Tal",_Blick_zum_Isartor.JPG (Dguendel, CC BY 4.0)
 *    and Rückseite_Isartor_München_von_Tal_aus_..._2023-10-30.jpg (Strubbl,
 *    CC BY-SA 4.0): the main tower's town face, its passage, windows and
 *    corner piers.
 *  - München-Altstadt_Isartor_704.jpg (GFreihalter, CC BY-SA 4.0): front
 *    from the Isar side.
 * No commercial imagery, no 3D city models. No look-only sources.
 *
 * Left out: the fresco's figures (one colour band), the tracery's pattern
 * (a plain band), the recessed panels on the flanking towers, the roof
 * railings, the small windows in the side walls, the street furniture.
 *
 * Doubts: the main tower's height (photos say 33-36 m to the ridge, OSM
 * 38, Wikipedia 40; drawn 35.5 to the ridge, 38 to the finials). The
 * flanking towers' backs and the side walls' outer faces are seen only at
 * an angle; the court is drawn from one photo. The passages through the
 * flanking towers are drawn straight through to their backs.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import {
  archBand, archWall, band, boxAt, cap, discOn, floodWalls, hipRoof, lathe, ngon, offset, panelOn, piercedFace,
  pyramid, quadN, rect, save, tunnel, walls, type Layer, type Opening, type XY,
} from './munich-karlstor'

function build() {
  const sand = new Part(), main = new Part(), trim = new Part(), roof = new Part(), win = new Part(), fresco = new Part()

  // ------------------------------------------------ the flanking towers ---
  const TX = 16.0, TY = -9.7, AF = 11.7 // centre and across-flats
  const R8 = AF / 2 / Math.cos(Math.PI / 8)
  const EAVE = 16.9, APEX = 21.0
  for (const s of [-1, 1]) {
    const cx = s * TX
    // Faces square to the frame: vertices at 22.5 + k*45 degrees.
    const ring = ngon(cx, TY, R8, 8, Math.PI / 8)
    const face = (k: number) => {
      const a = ring[k], b = ring[(k + 1) % 8]
      const L = Math.hypot(b[0] - a[0], b[1] - a[1])
      const u: V3 = [(b[0] - a[0]) / L, (b[1] - a[1]) / L, 0]
      const n: V3 = [u[1], -u[0], 0]
      return { o: [a[0], a[1], 0] as V3, u, n, L }
    }
    // ring[k]..ring[k+1] faces the direction (k + 0.5) * 45 degrees: k = 5 faces -y (front), k = 1 faces +y (back).
    const door: Opening = { c: 0, hw: 1.8, zs: 2.0, k: 1.7 }
    for (let k = 0; k < 8; k++) {
      const f = face(k)
      if (k === 5 || k === 1) piercedFace(sand, f.o, f.u, f.n, 0, f.L, 0, EAVE - 0.3, [{ ...door, c: f.L / 2 }], 0, 8)
      else quadN(sand, f.o, [f.o[0] + f.u[0] * f.L, f.o[1] + f.u[1] * f.L, 0], [f.o[0] + f.u[0] * f.L, f.o[1] + f.u[1] * f.L, EAVE - 0.3], [f.o[0], f.o[1], EAVE - 0.3], f.n)
    }
    {
      const f = face(5)
      tunnel(sand, f.o, f.u, f.n, 0, -AF, [{ ...door, c: f.L / 2 }], 0, 8)
      archBand(trim, f.o, f.u, f.n, { ...door, c: f.L / 2 }, 0.22, 0.1, 0, 8)
    }
    // Plinth (darker stone in reality: drawn in the trim's light tone would
    // shout, so it is a sand band standing out), courses and cornice.
    {
      const pr = offset(ring, 0.12)
      for (let k = 0; k < 8; k++) {
        const a = pr[k], b = pr[(k + 1) % 8]
        const L = Math.hypot(b[0] - a[0], b[1] - a[1])
        const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
        const n: V3 = [u[1], -u[0], 0]
        const seg = (t0: number, t1: number) => {
          const A: V3 = [a[0] + u[0] * t0, a[1] + u[1] * t0, 0], B: V3 = [a[0] + u[0] * t1, a[1] + u[1] * t1, 0]
          quadN(sand, A, B, [B[0], B[1], 2.0], [A[0], A[1], 2.0], n)
          quadN(sand, [A[0], A[1], 2.0], [B[0], B[1], 2.0], [B[0] - n[0] * 0.12, B[1] - n[1] * 0.12, 2.0], [A[0] - n[0] * 0.12, A[1] - n[1] * 0.12, 2.0], [0, 0, 1])
        }
        if (k === 5 || k === 1) { seg(0, L / 2 - door.hw - 0.1); seg(L / 2 + door.hw + 0.1, L) }
        else seg(0, L)
      }
    }
    band(trim, ring, 7.2, 7.6, 0.14)
    band(trim, ring, 10.8, 11.3, 0.14)
    band(trim, ring, 14.85, 15.25, 0.2)
    // Lunette windows above the courses with their hood mouldings; the
    // glazed top storey; painted arms at the corners of the front faces.
    for (let k = 0; k < 8; k++) {
      const f = face(k)
      for (const z of [7.6, 11.3]) {
        if (k === (s > 0 ? 2 : 0)) continue // the inner back face meets the front and side walls
        panelOn(win, f.o, f.u, f.n, f.L / 2 - 0.45, f.L / 2 + 0.45, z, z + 0.05, 0.04, 0, true, 5)
        archBand(trim, f.o, f.u, f.n, { c: f.L / 2, hw: 0.72, zs: z, k: 1 }, 0.12, 0.06, 0, 6)
      }
      panelOn(win, f.o, f.u, f.n, 0.6, f.L - 0.6, 15.5, 16.6, 0.04)
      discOn(fresco, f.o, f.u, f.n, 0.37, 16.1, 0.28, 0.05, 0, 6)
    }
    // Eaves and the pyramid roof, a copper finial.
    const er = offset(ring, 1.5)
    walls(trim, er, EAVE - 0.3, EAVE)
    cap(trim, er, EAVE - 0.3, false)
    pyramid(roof, er, EAVE, [cx, TY, APEX])
    lathe(trim, cx, TY, [[0.0, APEX - 0.2], [0.18, APEX], [0.28, APEX + 0.35], [0.12, APEX + 0.6], [0.05, APEX + 1.8], [0, APEX + 1.9]], 6)
  }

  // ------------------------------------------------------- the front wall ---
  const FW: Opening[] = [{ c: 12.6 - 7.8, hw: 2.25, zs: 2.5, k: 1.6 }, { c: 12.6, hw: 2.4, zs: 2.4, k: 1.6 }, { c: 12.6 + 7.8, hw: 2.25, zs: 2.5, k: 1.6 }]
  const fy = -4.55, ft = 1.5, FE = 10.3
  archWall(sand, [-12.6, fy, 0], [1, 0, 0], [0, -1, 0], 25.2, ft, 0, FE, FW, { ends: false, seg: 10 })
  for (const n of [[0, -1, 0], [0, 1, 0]] as V3[]) {
    const o: V3 = [-12.6, fy, 0]
    for (const op of FW) archBand(trim, o, [1, 0, 0], n, op, 0.35, 0.12, ft / 2, 10)
  }
  // The fresco, the tracery frieze under it and the cornice, on the front.
  {
    const o: V3 = [-12.6, fy, 0], u: V3 = [1, 0, 0], n: V3 = [0, -1, 0]
    panelOn(fresco, o, u, n, 2.4, 22.8, 7.75, 9.85, 0.04, ft / 2)
    // The procession's figures and horses as pale shapes on the warm ground,
    // so the band reads as a painted frieze (one colour short of the real
    // palette: the pale robes, horses and sky picked out in the trim).
    for (let i = 0; i < 30; i++) {
      const sx = 2.9 + i * 0.67, horse = i % 4 === 1 || i % 7 === 3
      const h0 = 7.95 + ((i * 37) % 5) * 0.06
      if (horse) panelOn(trim, o, u, n, sx - 0.42, sx + 0.42, h0 + 0.25, h0 + 0.85, 0.07, ft / 2)
      else panelOn(trim, o, u, n, sx - 0.13, sx + 0.13, h0, h0 + 1.05 + ((i * 13) % 3) * 0.12, 0.07, ft / 2, true, 4)
    }
    boxAt(trim, 0, fy - ft / 2 - 0.08, 10.2, 0.1, 5.95, 6.6)
    boxAt(trim, 0, fy - ft / 2 - 0.1, 10.2, 0.12, 9.95, 10.3)
    boxAt(trim, 0, fy - ft / 2 - 0.06, 10.2, 0.08, 7.55, 7.75)
  }
  // Its roof: a gable along x.
  {
    const y0 = fy - ft / 2 - 0.3, y1 = fy + ft / 2 + 0.3, zr = 11.3
    quadN(roof, [-12.6, y0, FE], [12.6, y0, FE], [12.6, fy, zr], [-12.6, fy, zr], [0, -1, 1.2])
    quadN(roof, [-12.6, y1, FE], [12.6, y1, FE], [12.6, fy, zr], [-12.6, fy, zr], [0, 1, 1.2])
    quadN(roof, [-12.6, y0, FE], [12.6, y0, FE], [12.6, y1, FE], [-12.6, y1, FE], [0, 0, -1])
  }

  // -------------------------------------------------------- the side walls ---
  for (const s of [-1, 1]) {
    const x = s * 12.05, t = 1.2, y0 = -4.4, y1 = 14.6, SE = 7.0
    const op: Opening = { c: 9.4, hw: 2.4, zs: 2.6, k: 1.7 }
    archWall(sand, [x, y0, 0], [0, 1, 0], [s, 0, 0], y1 - y0, t, 0, SE, [op], { ends: false, top: null, seg: 8 })
    for (const n of [[s, 0, 0], [-s, 0, 0]] as V3[]) archBand(trim, [x, y0, 0], [0, 1, 0], n, op, 0.25, 0.08, t / 2, 8)
    // The return to the main tower along y = 14.05.
    const xr0 = s * 6.65, xr1 = s * 12.65
    boxAt(sand, (xr0 + xr1) / 2, 14.05, Math.abs(xr1 - xr0) / 2, 0.55, 0, SE, 0, 0, 0, null)
    quadN(sand, [x - t / 2, y1, 0], [x + t / 2, y1, 0], [x + t / 2, y1, SE], [x - t / 2, y1, SE], [0, 1, 0])
    // Gable roofs.
    const gable = (xa: number, xb: number, ya: number, yb: number, alongY: boolean) => {
      const zr = SE + 1.0
      if (alongY) {
        const xc = (xa + xb) / 2
        quadN(roof, [xa - 0.2, ya, SE], [xa - 0.2, yb, SE], [xc, yb, zr], [xc, ya, zr], [-1, 0, 1])
        quadN(roof, [xb + 0.2, ya, SE], [xb + 0.2, yb, SE], [xc, yb, zr], [xc, ya, zr], [1, 0, 1])
        quadN(roof, [xa - 0.2, ya, SE], [xb + 0.2, ya, SE], [xb + 0.2, yb, SE], [xa - 0.2, yb, SE], [0, 0, -1])
        for (const yy of [ya, yb]) quadN(roof, [xa - 0.2, yy, SE], [xb + 0.2, yy, SE], [xc, yy, zr], [xc, yy, zr], [0, yy === ya ? -1 : 1, 0])
      } else {
        const yc = (ya + yb) / 2
        quadN(roof, [xa, ya - 0.2, SE], [xb, ya - 0.2, SE], [xb, yc, zr], [xa, yc, zr], [0, -1, 1])
        quadN(roof, [xa, yb + 0.2, SE], [xb, yb + 0.2, SE], [xb, yc, zr], [xa, yc, zr], [0, 1, 1])
        quadN(roof, [xa, ya - 0.2, SE], [xb, ya - 0.2, SE], [xb, yb + 0.2, SE], [xa, yb + 0.2, SE], [0, 0, -1])
      }
    }
    gable(x - t / 2, x + t / 2, y0, 13.5, true)
    gable(Math.min(xr0, xr1), Math.max(xr0, xr1) + (s > 0 ? 0.2 : -0.2) * 0, 13.5, 14.6, false)
  }

  // --------------------------------------------------------- the main tower ---
  {
    const HX = 6.65, Y0 = 13.4, Y1 = 21.3, TOP = 29.6
    const pass: Opening = { c: HX, hw: 2.6, zs: 2.9, k: 1.6 }
    // Front (court, -y) and back (Tal, +y) faces pierced by the passage.
    piercedFace(main, [-HX, Y0, 0], [1, 0, 0], [0, -1, 0], 0, 2 * HX, 0, TOP, [pass], 0, 10)
    piercedFace(main, [-HX, Y1, 0], [1, 0, 0], [0, 1, 0], 0, 2 * HX, 0, TOP, [pass], 0, 10)
    tunnel(main, [-HX, Y0, 0], [1, 0, 0], [0, -1, 0], 0, -(Y1 - Y0), [pass], 0, 10)
    for (const s of [-1, 1]) quadN(main, [s * HX, Y0, 0], [s * HX, Y1, 0], [s * HX, Y1, TOP], [s * HX, Y0, TOP], [s, 0, 0])
    for (const [y, n] of [[Y0, [0, -1, 0]], [Y1, [0, 1, 0]]] as [number, V3][]) archBand(trim, [-HX, y, 0], [1, 0, 0], n, pass, 0.3, 0.1, 0, 10)
    // Corner piers with little tiled caps.
    // Town side to 16.2 m, court side to 12.5 m (Dguendel's Tal photo, Rabich's).
    for (const sx of [-1, 1]) for (const sy of [Y0, Y1]) {
      const cx = sx * (HX + 0.05), cy = sy + (sy === Y0 ? -0.05 : 0.05), zt = sy === Y0 ? 12.5 : 16.2
      boxAt(main, cx, cy, 0.8, 0.8, 0, zt, Math.PI / 4, 0.15, 0, null)
      pyramid(roof, ngon(cx, cy, 1.2, 4, 0), zt, [cx, cy, zt + 0.9])
    }
    // The corbelled frieze: corbels, then the parapet band standing out.
    const OUT = 0.45, FZ = 30.9
    const ringT = rect(-HX, Y0, HX, Y1)
    walls(main, ringT, TOP, FZ)
    for (const [a, b, n] of [[[-HX, Y0], [HX, Y0], [0, -1]], [[HX, Y0], [HX, Y1], [1, 0]], [[HX, Y1], [-HX, Y1], [0, 1]], [[-HX, Y1], [-HX, Y0], [-1, 0]]] as [XY, XY, XY][]) {
      const L = Math.hypot(b[0] - a[0], b[1] - a[1]), m = Math.round(L / 0.95)
      for (let i = 0; i <= m; i++) {
        const t = 0.15 + (i * (L - 0.3)) / m
        const cx = a[0] + ((b[0] - a[0]) * t) / L + n[0] * OUT / 2, cy = a[1] + ((b[1] - a[1]) * t) / L + n[1] * OUT / 2
        boxAt(trim, cx, cy, n[0] ? OUT / 2 : 0.16, n[1] ? OUT / 2 : 0.16, TOP + 0.3, FZ, 0, 0, 0)
      }
    }
    const pr = rect(-HX - OUT, Y0 - OUT, HX + OUT, Y1 + OUT)
    walls(main, pr, FZ, 31.8)
    cap(main, pr, FZ, false)
    band(trim, pr, FZ - 0.05, FZ + 0.2, 0.06)
    hipRoof(roof, -HX - OUT, Y0 - OUT, HX + OUT, Y1 + OUT, 31.8, 36.0, 0.35)
    // Finials at the ridge's ends.
    const rl = (2 * HX + 2 * OUT - (Y1 - Y0 + 2 * OUT)) / 2
    for (const s of [-1, 1]) lathe(trim, s * rl, (Y0 + Y1) / 2, [[0.0, 35.8], [0.12, 36.0], [0.22, 36.3], [0.08, 36.6], [0.04, 38.1], [0, 38.2]], 6)
    // Clock, windows, the crucifixion picture and its canopy.
    for (const [y, n] of [[Y0, [0, -1, 0]], [Y1, [0, 1, 0]]] as [number, V3][]) {
      const o: V3 = [-HX, y, 0], u: V3 = [1, 0, 0]
      discOn(trim, o, u, n, HX, 27.2, 1.35, 0.05, 0, 16)
      discOn(win, o, u, n, HX, 27.2, 1.0, 0.08, 0, 16)
      for (const dx of [-2.95, 0, 2.95]) panelOn(win, o, u, n, HX + dx - 0.45, HX + dx + 0.45, 22.75, 24.4, 0.04, 0, true, 5)
    }
    {
      const o: V3 = [-HX, Y1, 0], u: V3 = [1, 0, 0], n: V3 = [0, 1, 0]
      panelOn(win, o, u, n, HX - 0.45, HX + 0.45, 18.6, 20.2, 0.04, 0, true, 5)
      panelOn(win, o, u, n, HX - 0.4, HX + 0.4, 11.6, 13.0, 0.04, 0, true, 5)
      for (const s of [-1, 1]) {
        const o2: V3 = [s * HX, s > 0 ? Y0 : Y1, 0], u2: V3 = [0, s, 0], n2: V3 = [s, 0, 0]
        for (const t of [2.4, 5.5]) panelOn(win, o2, u2, n2, t - 0.45, t + 0.45, 22.75, 24.4, 0.04, 0, true, 5)
      }
      const of: V3 = [-HX, Y0, 0], nf: V3 = [0, -1, 0]
      panelOn(fresco, of, u, nf, HX - 1.9, HX + 1.9, 7.4, 10.5, 0.05)
      quadN(roof, [-3.0, Y0, 11.9], [2.9, Y0, 11.9], [2.9, Y0 - 1.1, 10.9], [-3.0, Y0 - 1.1, 10.9], [0, -1, 1])
      quadN(roof, [-3.0, Y0, 11.9], [2.9, Y0, 11.9], [2.9, Y0 - 1.1, 10.9], [-3.0, Y0 - 1.1, 10.9], [0, 1, -1])
    }
  }

  const lit = floodWalls
  return [
    { part: sand, material: { ...finish('isartor-render', 0xd8c29f), floodlight: lit } },
    { part: main, material: { ...finish('isartor-tower', 0xe2d8c5), floodlight: lit } },
    { part: trim, material: { ...finish('isartor-trim', 0xefe6d6), floodlight: lit } },
    { part: roof, material: finish('isartor-tile', 0x9a5240) },
    { part: win, material: PALETTE.window },
    { part: fresco, material: finish('isartor-fresco', 0xbf6f45) },
  ] as Layer[]
}

if (import.meta.main) {
  await save('munich-isartor.glb', 'Isartor', build(), { bearing: -36.4, elevation: 0, height: 38.0, osm: 'relation/6035286' }, 6500)
}
