/**
 * JFK Airport Terminal 4, Queens — procedural, CC0-1.0, no textures.
 * bun generators/nyc-jfk-terminal-4.ts
 *
 * Map frame: x = model east, y = model north, z up, metres. Placed at
 * bearing −29.2°, the grid of the central terminal area (the headhouse's
 * walls run along it; model north is the landside, model south the airside
 * and its two concourses). Anchor: area centroid of the OSM outline
 * way/284907688, which takes in the headhouse, both concourses, the parking
 * garage to the north and the walkway to it, so all of it is drawn: the
 * headhouse in detail, the rest as plain massing.
 *
 * Identifying features (photos): the long glass headhouse under a pale metal
 * roof of two shallow vaults, a low one along the airside and a tall one
 * over the check-in hall that sweeps down to the landside front, its edge
 * arching between ribs; the deep departures canopy along the front; plain,
 * low concourses and piers.
 *
 * Evidence
 * - OSM way/284907688 (Terminal 4, tagged 29.7 m; 461 nodes), in this frame.
 * - Lidar: USGS 3DEP NY_NewYorkCity, flown 2017, 1 m, above the apron:
 *   the hall's roof rises from 22.5 m at the airside edge (y 97) to a first
 *   crest of ~27 m (y ~125), then the big vault to 30–31 m (y 157–181),
 *   down to 23 m at y 205 and a flat 21 m canopy to the front at y 229;
 *   the vault spans x −54…98, ribs every 32–40 m (raised 2 m along the
 *   front at x ≈ −28, 4, 44, 76); the airside vault alone continues to
 *   x −121 and 146; concourses and the garage 13–14 m; the walkway to the
 *   garage ~8 m (drawn at the outline's 13.5 m). The east concourse's far
 *   end postdates the flight (empty there) and is drawn at 13.5 m too.
 * - Published: opened 2001, Skidmore, Owings & Merrill (Wikipedia, "JFK
 *   Airport Terminal 4").
 * - Photos (Wikimedia Commons):
 *   https://commons.wikimedia.org/wiki/File:JFKNewYorkTerm4_1.jpg
 *     (Mike Powell, CC BY-SA 2.0) the landside front: glass, roof sails;
 *   https://commons.wikimedia.org/wiki/File:Airtrain_Terminal_4_JFK_NY1.jpg
 *     (Acroterion, CC BY-SA 4.0) the hall's end: the roof's arch;
 *   https://commons.wikimedia.org/wiki/File:JFK_Terminal_4_(9690230116).jpg
 *     (Daniel from Calgary, CC BY 2.0) the glass front close;
 *   https://commons.wikimedia.org/wiki/File:JFK_Terminal_4_June_2019_departures.jpg
 *     (Mybirthday647, CC0) the departures canopy;
 *   https://commons.wikimedia.org/wiki/File:John_F._Kennedy_International_Airport_(JFK)_Terminal_4_Operations.jpg
 *     (Oleg Yunakov, CC0) aerial: plan, pale roofs, the concourses.
 *
 * Estimated: the vaults as sine arcs through the lidar's heights; the front
 * wall's line (y 213, under the canopy's start); the rib positions; glass
 * panel sizes; the concourses' single window band. The garage (part of the
 * same OSM way) is drawn as a plain block.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, capPoly, finishModel, facade, area, unit, quadN, type Facade } from './nyc-570-lexington'

const panel = new Part(), win = new Part(), roof = new Part(), vault = new Part(), trim = new Part()

const OUTLINE: XY[] = [[225.8,-39.1],[196.7,-55.9],[186.6,-70.6],[188.8,-72.1],[189.2,-72.4],[190.1,-73.0],[191.9,-70.3],[193.5,-67.9],[192.4,-67.2],[198.6,-58.1],[199.3,-57.8],[200.4,-59.7],[202.1,-58.8],[204.7,-57.2],[206.1,-59.5],[229.4,-45.8],[236.6,-58.0],[236.4,-89.9],[231.9,-89.7],[231.7,-122.3],[221.2,-122.2],[221.2,-124.6],[221.1,-126.8],[237.3,-126.9],[237.3,-156.6],[231.0,-156.6],[211.8,-189.2],[184.5,-189.0],[183.5,-190.2],[184.3,-192.2],[197.0,-192.2],[196.9,-194.4],[199.6,-194.5],[217.1,-194.5],[237.7,-194.6],[237.6,-193.0],[237.4,-191.4],[221.7,-191.2],[233.1,-171.3],[237.3,-171.2],[237.4,-176.4],[267.1,-176.4],[267.2,-170.5],[277.1,-170.7],[292.2,-189.0],[293.3,-190.1],[294.5,-189.1],[297.8,-186.4],[301.8,-183.2],[300.9,-182.2],[276.6,-155.2],[267.6,-155.0],[267.5,-142.7],[277.2,-142.7],[307.7,-129.7],[307.7,-120.8],[309.8,-120.8],[309.8,-119.6],[309.8,-118.2],[305.8,-118.2],[305.9,-112.1],[304.4,-112.0],[302.9,-112.0],[302.9,-126.7],[276.4,-137.8],[267.3,-137.7],[268.0,-54.4],[253.6,-32.3],[253.1,-30.9],[255.3,-30.0],[280.4,-23.4],[285.8,-21.8],[285.6,-19.4],[284.7,-17.0],[282.4,-17.6],[280.2,-18.2],[279.7,-16.0],[253.4,-23.1],[253.7,-24.1],[250.4,-26.0],[228.1,11.6],[231.0,13.2],[229.1,16.3],[226.5,14.8],[217.5,30.0],[241.0,43.9],[239.9,46.0],[244.2,48.5],[242.9,50.8],[241.7,50.3],[238.6,48.5],[237.2,50.4],[213.8,36.7],[195.3,68.9],[197.6,70.0],[195.9,73.5],[193.0,72.3],[191.5,74.8],[215.0,88.4],[213.8,90.8],[218.1,93.2],[216.9,95.5],[215.8,94.9],[212.5,93.0],[211.3,95.0],[187.8,81.6],[181.8,92.0],[183.7,93.6],[180.2,99.9],[177.7,98.7],[172.8,106.7],[175.2,108.2],[173.4,111.1],[171.0,109.8],[152.3,141.6],[155.6,141.6],[168.1,120.3],[175.7,125.4],[168.2,138.1],[182.4,137.0],[182.6,201.1],[106.2,201.6],[106.0,206.2],[109.7,206.0],[109.8,213.1],[104.3,212.9],[104.2,224.7],[105.8,227.0],[117.4,246.1],[120.2,255.0],[123.2,265.1],[126.1,274.5],[129.4,285.7],[131.1,291.3],[132.4,295.6],[139.1,318.2],[141.9,317.1],[141.9,285.5],[232.5,288.3],[232.2,301.2],[232.7,301.3],[234.2,300.0],[236.4,298.6],[238.8,297.9],[241.7,297.8],[244.3,298.0],[246.6,299.0],[248.8,300.7],[251.3,303.5],[252.4,306.7],[252.6,310.0],[251.9,313.1],[251.2,315.4],[249.1,317.7],[246.2,319.9],[242.6,320.7],[238.3,320.6],[235.3,319.4],[233.1,317.7],[232.3,317.8],[232.2,353.7],[232.7,353.8],[233.4,353.2],[235.5,351.6],[238.0,350.7],[241.4,350.3],[244.8,350.5],[248.2,351.9],[250.5,354.4],[251.7,357.6],[252.5,360.4],[252.3,363.9],[251.3,366.5],[250.1,368.9],[246.3,371.5],[243.1,372.8],[237.9,372.7],[232.5,369.7],[232.9,384.2],[226.3,384.2],[220.9,384.2],[142.7,384.3],[142.3,348.1],[134.1,348.0],[133.7,351.8],[129.0,351.8],[129.3,347.6],[125.8,347.7],[125.8,323.7],[125.8,321.7],[129.5,321.6],[130.2,318.2],[127.0,307.5],[124.1,297.5],[121.7,289.4],[117.9,277.0],[114.9,267.2],[111.9,257.9],[111.3,256.2],[110.2,252.2],[108.5,246.3],[104.0,229.3],[-54.6,229.0],[-54.7,226.9],[-54.6,212.9],[-60.2,212.9],[-60.2,206.6],[-54.5,206.6],[-54.5,202.0],[-70.7,202.0],[-70.6,190.4],[-79.1,190.4],[-78.9,158.0],[-120.5,157.6],[-120.4,160.8],[-134.9,160.8],[-135.1,168.4],[-149.1,168.3],[-149.0,163.9],[-148.8,153.9],[-151.3,156.4],[-159.4,159.2],[-171.8,163.3],[-171.8,176.3],[-193.2,176.6],[-208.4,176.9],[-208.6,155.2],[-194.1,155.3],[-178.5,155.4],[-167.6,151.9],[-154.1,147.3],[-148.6,147.4],[-148.7,145.0],[-176.5,145.9],[-176.4,141.9],[-176.3,137.9],[-156.9,137.8],[-148.5,137.7],[-148.5,88.6],[-151.7,88.6],[-151.7,85.4],[-148.8,85.4],[-149.1,73.2],[-176.3,73.6],[-176.3,69.9],[-176.3,66.0],[-149.0,65.7],[-148.6,35.3],[-151.6,35.3],[-151.6,31.8],[-148.9,31.8],[-149.2,6.7],[-176.2,6.7],[-176.1,3.2],[-176.2,-0.8],[-148.9,-0.8],[-148.6,-28.3],[-151.8,-28.3],[-151.8,-31.7],[-148.9,-31.7],[-149.1,-73.7],[-176.2,-73.3],[-176.3,-77.0],[-176.3,-80.8],[-148.9,-81.1],[-148.6,-110.8],[-151.9,-110.7],[-152.0,-114.5],[-148.7,-114.8],[-148.8,-140.3],[-176.3,-140.4],[-176.2,-143.8],[-176.1,-147.9],[-148.7,-148.3],[-148.7,-191.1],[-151.9,-190.9],[-152.0,-194.5],[-148.7,-195.0],[-148.7,-219.0],[-176.2,-218.8],[-176.1,-222.5],[-175.9,-226.7],[-148.8,-227.0],[-148.7,-244.3],[-152.3,-252.0],[-154.0,-256.4],[-160.9,-253.5],[-175.2,-289.1],[-181.4,-304.5],[-174.4,-307.2],[-175.3,-309.4],[-201.2,-298.5],[-204.3,-305.2],[-202.4,-305.9],[-178.2,-316.3],[-189.4,-343.2],[-193.9,-341.4],[-198.7,-352.9],[-193.8,-354.8],[-200.4,-370.9],[-226.8,-360.3],[-229.7,-367.6],[-227.7,-368.4],[-203.5,-378.1],[-225.8,-432.8],[-251.9,-422.1],[-255.0,-429.3],[-251.7,-431.0],[-228.7,-440.1],[-230.7,-445.3],[-235.5,-443.3],[-240.2,-454.8],[-235.4,-456.8],[-247.2,-485.7],[-250.8,-494.8],[-276.5,-484.2],[-279.5,-491.0],[-278.2,-491.5],[-256.7,-499.4],[-260.0,-508.0],[-263.5,-506.6],[-264.9,-510.1],[-262.8,-511.3],[-263.8,-513.9],[-262.8,-514.5],[-273.3,-540.0],[-267.7,-544.5],[-278.0,-568.7],[-288.0,-593.6],[-297.5,-617.3],[-298.4,-619.9],[-303.7,-618.0],[-312.9,-640.1],[-306.1,-643.1],[-309.4,-651.4],[-317.6,-672.1],[-320.9,-671.0],[-323.3,-677.1],[-320.2,-678.1],[-320.6,-679.8],[-326.1,-677.3],[-330.3,-688.7],[-338.8,-710.3],[-332.2,-713.0],[-329.2,-705.7],[-305.9,-713.9],[-310.4,-725.8],[-308.6,-726.5],[-307.1,-727.3],[-302.5,-715.2],[-293.8,-694.3],[-292.1,-690.7],[-299.0,-687.4],[-295.3,-678.2],[-293.7,-674.1],[-300.0,-671.9],[-290.8,-649.7],[-283.3,-652.5],[-274.3,-630.9],[-280.1,-628.2],[-279.4,-625.6],[-259.3,-577.1],[-249.2,-550.3],[-239.2,-555.1],[-238.3,-553.0],[-215.4,-563.1],[-212.7,-555.6],[-216.1,-554.2],[-237.6,-545.2],[-219.0,-497.1],[-215.3,-488.5],[-189.8,-499.0],[-187.0,-492.0],[-189.6,-490.9],[-212.3,-481.5],[-189.7,-427.0],[-164.7,-437.4],[-161.8,-430.2],[-164.6,-428.9],[-186.8,-419.7],[-159.5,-353.0],[-134.4,-363.0],[-131.4,-356.1],[-133.6,-355.2],[-156.6,-345.6],[-145.9,-319.4],[-139.1,-322.1],[-133.1,-307.0],[-108.2,-317.7],[-105.2,-310.5],[-108.6,-309.3],[-130.3,-300.3],[-118.4,-270.7],[-125.8,-267.8],[-123.8,-263.3],[-121.4,-257.2],[-120.8,-244.1],[-118.6,-244.0],[-87.8,-252.8],[-86.4,-247.7],[-89.1,-246.8],[-91.1,-246.5],[-90.5,-244.2],[-116.6,-237.1],[-117.2,-238.2],[-121.1,-238.0],[-120.9,-178.4],[-93.8,-178.4],[-93.8,-174.4],[-93.7,-170.5],[-120.8,-170.5],[-120.7,-111.5],[-94.2,-110.7],[-94.2,-106.8],[-94.1,-102.8],[-120.7,-103.1],[-120.8,-13.0],[-88.7,-12.8],[-88.7,-10.0],[-88.8,-7.8],[-93.6,-7.9],[-93.5,-5.4],[-121.0,-5.1],[-120.6,51.6],[-97.1,50.9],[-97.0,44.0],[-84.9,44.0],[-85.0,65.2],[-85.0,79.0],[-96.6,79.0],[-96.5,60.6],[-121.5,60.6],[-121.6,96.8],[-34.6,97.0],[-34.6,91.9],[-26.9,91.9],[-26.9,96.9],[22.1,97.0],[26.4,97.0],[58.5,97.0],[58.2,87.8],[102.5,87.4],[102.2,97.0],[146.5,96.8],[146.3,95.4],[123.4,81.8],[124.9,78.4],[121.1,76.0],[122.9,74.1],[126.7,75.8],[127.7,74.3],[150.2,87.4],[189.6,22.7],[166.0,9.0],[167.2,6.8],[162.9,4.4],[164.3,1.8],[165.5,2.5],[168.6,4.4],[169.9,2.6],[193.5,16.1]]

// --- The low massing: the whole outline at 13.5 m, one window band ---
const H0 = 13.5
const CORE = { x0: -54, x1: 98, y0: 97, y1: 213 }
const WINGS = { x0: -121, x1: 146, y0: 97, y1: 152 }
const inRect = (p: XY, r: { x0: number; x1: number; y0: number; y1: number }, m = 1.5) => p[0] > r.x0 - m && p[0] < r.x1 + m && p[1] > r.y0 - m && p[1] < r.y1 + m
const lowFacade: Facade = { bay: 7, ratio: 0.8, floor: 4.5, group: 1, spandrel: 0, sill: 5.5, head: 3.4, ground: 5.5, minLength: 5 }
{
  const ring = area(OUTLINE) < 0 ? OUTLINE.slice().reverse() : OUTLINE
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    const m: XY = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
    if (inRect(m, CORE) || inRect(m, WINGS)) continue
    facade(panel, win, a, b, 0, H0 - 0.3, lowFacade)
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]); if (L < 1e-6) continue
    const n: XY = [(b[1] - a[1]) / L, -(b[0] - a[0]) / L]
    trim.quad([a[0] + n[0] * 0.08, a[1] + n[1] * 0.08, H0 - 0.3], [b[0] + n[0] * 0.08, b[1] + n[1] * 0.08, H0 - 0.3], [b[0] + n[0] * 0.08, b[1] + n[1] * 0.08, H0], [a[0] + n[0] * 0.08, a[1] + n[1] * 0.08, H0])
  }
  capPoly(roof, ring, H0)
}

// --- The hall: two vaults (lidar), glass walls, ribs, the front canopy ---
const v1 = (y: number) => 22.5 + 4.6 * Math.sin((Math.PI * Math.min(Math.max(y - 97, 0), 55)) / 55)
const v2 = (y: number) => 21.5 + 9.2 * Math.sin((Math.PI * Math.min(Math.max(y - 131, 0), 82)) / 82)
const coreZ = (y: number) => Math.max(v1(y), y > 131 ? v2(y) : 0)
const STEP = 4
const ys = (y0: number, y1: number) => { const n = Math.ceil((y1 - y0) / STEP); return Array.from({ length: n + 1 }, (_, k) => y0 + ((y1 - y0) * k) / n) }
/** A roof surface z(y) over x0…x1, smooth across y; with the side walls (gables) down to z = 0 and their glass. */
function hall(x0: number, x1: number, y0: number, y1: number, z: (y: number) => number, gables: boolean) {
  const Y = ys(y0, y1)
  const nrm = (y: number): V3 => { const d = (z(y + 0.5) - z(y - 0.5)); return unit([0, -d, 1]) }
  for (let k = 0; k < Y.length - 1; k++) {
    const a = Y[k], b = Y[k + 1]
    quadN(vault, [x0, a, z(a)], [x1, a, z(a)], [x1, b, z(b)], [x0, b, z(b)], [nrm(a), nrm(a), nrm(b), nrm(b)])
    if (!gables) continue
    // gable ends: wall with a glass field under the arch
    for (const [x, s] of [[x0, -1], [x1, 1]] as [number, number][]) {
      const P = (y: number, zz: number): V3 => [x, y, zz]
      const q = s > 0 ? [P(a, 0), P(b, 0), P(b, z(b)), P(a, z(a))] : [P(b, 0), P(a, 0), P(a, z(a)), P(b, z(b))]
      panel.quad(q[0], q[1], q[2], q[3])
      const g0 = 8, ga = z(a) - 1.2, gb = z(b) - 1.2
      if (ga > g0 + 0.5 && gb > g0 + 0.5) {
        const d = 0.06 * s
        const w = s > 0 ? [[a, g0], [b, g0], [b, gb], [a, ga]] : [[b, g0], [a, g0], [a, ga], [b, gb]]
        win.quad(...(w.map(([y, zz]) => [x + d, y, zz] as V3) as [V3, V3, V3, V3]))
      }
    }
  }
}
// The airside vault across the full width, the big vault over the core.
hall(WINGS.x0, CORE.x0, WINGS.y0, WINGS.y1, v1, true)
hall(CORE.x1, WINGS.x1, WINGS.y0, WINGS.y1, v1, true)
hall(CORE.x0, CORE.x1, CORE.y0, CORE.y1, coreZ, true)
// end walls of the wings at y 152 (above the low massing) and the airside walls at y 97
const glassFacade: Facade = { bay: 9, ratio: 0.93, floor: 6.5, group: 1, spandrel: 0.5, sill: 0, head: 0.8, ground: 0.8, minLength: 3 }
for (const [x0, x1] of [[WINGS.x0, CORE.x0], [CORE.x1, WINGS.x1]]) {
  facade(panel, null, [x1, WINGS.y1], [x0, WINGS.y1], H0, v1(WINGS.y1), null)
}
facade(panel, win, [WINGS.x0, WINGS.y0], [WINGS.x1, WINGS.y0], 0, v1(WINGS.y0), { ...glassFacade, ground: 4 })
// the landside glass front of the hall
facade(panel, win, [CORE.x1, CORE.y1], [CORE.x0, CORE.y1], 0, coreZ(CORE.y1), glassFacade)
// the canopy over the curb, y 213 → 229, its front edge arching between ribs
const RIBS = [CORE.x0, -28, 4, 44, 76, CORE.x1]
{
  const zc = 21.2, yF = 229
  for (let r = 0; r < RIBS.length - 1; r++) {
    const xa = RIBS[r], xb = RIBS[r + 1], n = 6
    for (let k = 0; k < n; k++) {
      const t0 = k / n, t1 = (k + 1) / n
      const xA = xa + (xb - xa) * t0, xB = xa + (xb - xa) * t1
      const eA = zc + 3.2 * Math.sin(Math.PI * t0), eB = zc + 3.2 * Math.sin(Math.PI * t1)
      // top: from the wall (at the vault's foot) out to the edge
      vault.quad([xA, CORE.y1, coreZ(CORE.y1)], [xA, yF, eA], [xB, yF, eB], [xB, CORE.y1, coreZ(CORE.y1)])
      // fascia and soffit
      trim.quad([xA, yF, eA - 0.9], [xB, yF, eB - 0.9], [xB, yF, eB], [xA, yF, eA])
      trim.quad([xA, CORE.y1, coreZ(CORE.y1) - 1.0], [xB, CORE.y1, coreZ(CORE.y1) - 1.0], [xB, yF, eB - 0.9], [xA, yF, eA - 0.9])
    }
  }
  for (const x of [CORE.x0, CORE.x1]) {
    const s = x === CORE.x0 ? -1 : 1
    const P: V3[] = [[x, CORE.y1, coreZ(CORE.y1) - 1.0], [x, yF, zc - 0.9], [x, yF, zc], [x, CORE.y1, coreZ(CORE.y1)]]
    if (s > 0) trim.quad(P[1], P[0], P[3], P[2]); else trim.quad(P[0], P[1], P[2], P[3])
  }
}
// ribs over the big vault: pale bands 1.2 m wide, 0.5 m proud
for (const x of RIBS.slice(1, -1)) {
  const Y = ys(CORE.y0, CORE.y1)
  for (let k = 0; k < Y.length - 1; k++) {
    const a = Y[k], b = Y[k + 1], h = 0.5
    trim.quad([x - 0.6, a, coreZ(a) + h], [x + 0.6, a, coreZ(a) + h], [x + 0.6, b, coreZ(b) + h], [x - 0.6, b, coreZ(b) + h])
    trim.quad([x + 0.6, a, coreZ(a)], [x + 0.6, b, coreZ(b)], [x + 0.6, b, coreZ(b) + h], [x + 0.6, a, coreZ(a) + h])
    trim.quad([x - 0.6, b, coreZ(b)], [x - 0.6, a, coreZ(a)], [x - 0.6, a, coreZ(a) + h], [x - 0.6, b, coreZ(b) + h])
  }
}

finishModel('JFK Airport Terminal 4', 'nyc-jfk-terminal-4', [
  { part: panel, material: finish('t4-panel', 0xdcdcd7) },
  { part: win, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
  { part: vault, material: finish('t4-roof', 0xe4e7e8) },
  { part: trim, material: PALETTE.trim },
], { bearing: -29.2, osm: 'way/284907688', height: 31 }, 6500)
