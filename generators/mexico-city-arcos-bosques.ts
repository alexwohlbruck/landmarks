/**
 * Torre Arcos Bosques I, "El Pantalón" (Paseo de los Tamarindos 400,
 * Bosques de las Lomas, 1993–96, Teodoro González de León), Mexico City —
 * original procedural geometry, CC0-1.0.
 * bun generators/mexico-city-arcos-bosques.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = area centroid of the OSM outline way/220412303,
 * 19.387702,-99.251017. The legs line up along 53.4°, so the catalog
 * bearing is 323.4 and the long axis (leg to leg) is this frame's x.
 *
 * Identity, in order: the giant gateway — two square tower legs of pale
 * grey concrete joined at the top by a block nine storeys deep, leaving a
 * real opening 30 m wide and ~128 m tall through the middle ("the
 * trousers"); a round column standing against the middle of each leg's
 * inner face, from the ground to the bridge; the half-round towers on the
 * two outer ends, rising about half way, with a flat pier above them; the
 * close grid of punched windows of pale green glass.
 *
 * Evidence:
 *  - plan: OSM. Outline way/220412303; the legs way/1137999543 and
 *    way/1137999544 (29.5 × 28.6 m, 33 levels); the bridge
 *    way/1137999545 (30.3 m span, building:min_level 27); the outer
 *    half-round towers way/1172892443 and way/1172892444 (r ≈ 7.8 m,
 *    18 levels).
 *  - height: 161.5 m, 33 floors, floor-to-floor 4.575 m (published,
 *    Wikipedia es "Arcos Bosques Corporativo"; OSM height=161.5).
 *  - the bridge's underside at 128 m: OSM min_level 27 × 4.575 m plus the
 *    double-height lobby, checked on the Gobierno CDMX aerial (bridge ≈ 0.2
 *    of the height). The outer half-round towers to 84 m (18 levels) and
 *    the flat piers above them to 150 m: Grandmastermexica97 and the aerial.
 *    The inner round columns, ≈ 9 m across, standing against the inner faces
 *    and leaving a ~12 m clear gap between them: gabofr's views from below and
 *    the aerial. Estimated.
 *  - colour: the concrete reads pale warm grey (#e2ded6), the glass pale
 *    green-cyan (#93b8b2), from every daylight photo.
 *
 * Grouping: the real windows are punched, one per bay per storey; they are
 * drawn here as one panel per bay over two storeys, per STYLE.
 *
 * Ground: the tower stands on a gentle slope on the Bosques de las Lomas
 * ridge; Mapterhorn has no z15 tiles here (tools/terrain.ts 404s), so the
 * slope could not be read. y = 0 is the base; the map stands it on the
 * lowest ground under the footprint and the uphill side sinks in.
 * Elevation 0. The terraced podium (tennis courts, parking) and Torre
 * Arcos Bosques II (way/1518989795, the green-glass tower to the
 * south-west) are separate buildings and stay the map's. The low glazed
 * lobby in the opening is drawn ~9 m tall, set back, so the opening above
 * it stays clear.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Arcos_Bosques_Corporativo.jpg, Grandmastermexica97, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:Arcos_Bosques_Corporativo.jpg
 *  - Torre_Arcos_Bosques_(1).jpg and Torre_Arcos_Bosques.jpg, gabofr, CC BY 2.0
 *    https://commons.wikimedia.org/wiki/File:Torre_Arcos_Bosques_(1).jpg
 *    https://commons.wikimedia.org/wiki/File:Torre_Arcos_Bosques.jpg
 *  - Sobrevuelos_CDMX_HJ2A4665_(26515162908).jpg, Gobierno CDMX, CC0
 *    https://commons.wikimedia.org/wiki/File:Sobrevuelos_CDMX_HJ2A4665_(26515162908).jpg
 *  - Conjunto_Arcos_Bosques_-_panoramio.jpg, JavierDo, CC BY-SA 3.0
 *    https://commons.wikimedia.org/wiki/File:Conjunto_Arcos_Bosques_-_panoramio.jpg
 *  - Arcos_building_mexico-city.JPG, Pptudela, public domain
 *    https://commons.wikimedia.org/wiki/File:Arcos_building_mexico-city.JPG
 *  - Ciudad_de_México_Arcos_B.jpg, Travellete, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:Ciudad_de_M%C3%A9xico_Arcos_B.jpg
 * Look-only: none. No commercial imagery.
 *
 * Doubts: the inner columns: the aerial shows them from the bridge to
 * the ground, but gabofr's view from below shows one ending in a rounded
 * foot part way down with a flat pier beneath; drawn full height. The
 * bridge underside height and the outer piers' tops are estimates; the
 * slope is unmeasured.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { cap, panel, rows, save, type XY } from './chi-aon-center'

const ANCHOR: [number, number] = [19.387702, -99.251017]
const BEARING = 323.4
const X0 = 44.15, XI = 15.1, HY = 14.3 // outer end, inner face, half depth (OSM, made symmetric)
const TOP = 161.5, BRIDGE = 128, FL = 4.575, LOBBY = 2 * FL
const C = 0.6 // corner chamfer
const RC = 4.6 // inner columns
const RE = 7.8, EY = -1.0, ETOP = 84, PTOP = 150, PW = 6.5, PD = 3.0 // outer half-towers and piers

/** A quad turned to face along n, whatever order its corners come in. */
function face(p: Part, q: V3[], n: V3) {
  const u = q[1].map((v, k) => v - q[0][k]), w = q[2].map((v, k) => v - q[0][k])
  const c = [u[1] * w[2] - u[2] * w[1], u[2] * w[0] - u[0] * w[2], u[0] * w[1] - u[1] * w[0]]
  const [a, b, cc, d] = c[0] * n[0] + c[1] * n[1] + c[2] * n[2] >= 0 ? q : [q[3], q[2], q[1], q[0]]
  p.quad(a, b, cc, d)
}
/** A vertical wall from (x0,y0) to (x1,y1), z0..z1, facing n. */
const vwall = (p: Part, a: XY, b: XY, z0: number, z1: number, n: XY) => face(p, [[a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1]], [n[0], n[1], 0])
/** A horizontal quad over [x0,x1]×[y0,y1] at z facing up or down. */
const hquad = (p: Part, x0: number, x1: number, y0: number, y1: number, z: number, up: boolean) => face(p, [[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]], [0, 0, up ? 1 : -1])

function build() {
  const conc = new Part(), win = new Part(), glass = new Part(), roof = new Part(), trim = new Part()

  for (const s of [-1, 1]) {
    // One leg: x from s*XI to s*X0. Outer corners chamfered.
    const xo = s * X0, xi = s * XI
    // Long faces (y = ±HY), full height.
    for (const t of [-1, 1]) vwall(conc, [xi, t * HY], [xo - s * C, t * HY], 0, TOP, [0, t])
    // Chamfers at the outer corners.
    for (const t of [-1, 1]) vwall(conc, [xo - s * C, t * HY], [xo, t * (HY - C)], 0, TOP, [s, t])
    // The outer end face.
    vwall(conc, [xo, -(HY - C)], [xo, HY - C], 0, TOP, [s, 0])
    // The inner face, up to the bridge.
    vwall(conc, [xi, -HY], [xi, HY], 0, BRIDGE, [-s, 0])

    // The inner column: a round column (≈ 9 m across) standing against the
    // inner face, ground to bridge; its back half is inside the wall.
    {
      const seg = 16, cx = xi - s * (RC - 0.2)
      for (let k = 0; k < seg; k++) {
        const a0 = (k / seg) * 2 * Math.PI, a1 = ((k + 1) / seg) * 2 * Math.PI
        // Skip the segments wholly inside the leg.
        if (s * Math.cos((a0 + a1) / 2) > 0.3) continue
        const p0: V3 = [cx + RC * Math.cos(a0), RC * Math.sin(a0), 0], p1: V3 = [cx + RC * Math.cos(a1), RC * Math.sin(a1), 0]
        const n0: V3 = [Math.cos(a0), Math.sin(a0), 0], n1: V3 = [Math.cos(a1), Math.sin(a1), 0]
        const q0: V3 = [p0[0], p0[1], BRIDGE], q1: V3 = [p1[0], p1[1], BRIDGE]
        conc.tri(p0, p1, q1, undefined, undefined, undefined, [n0, n1, n1])
        conc.tri(p0, q1, q0, undefined, undefined, undefined, [n0, n1, n0])
      }
    }

    // The outer half-round tower (to ETOP) and the flat pier above it.
    {
      const seg = 12
      for (let k = 0; k < seg; k++) {
        const a0 = -Math.PI / 2 + (k / seg) * Math.PI, a1 = -Math.PI / 2 + ((k + 1) / seg) * Math.PI
        const P = (a: number, z: number): V3 => [xo + s * RE * Math.cos(a), EY + RE * Math.sin(a), z]
        const N = (a: number): V3 => [s * Math.cos(a), Math.sin(a), 0]
        conc.tri(P(a0, 0), P(a1, 0), P(a1, ETOP), undefined, undefined, undefined, [N(a0), N(a1), N(a1)])
        conc.tri(P(a0, 0), P(a1, ETOP), P(a0, ETOP), undefined, undefined, undefined, [N(a0), N(a1), N(a0)])
        // Its flat top (a half disc), facing up.
        const c: V3 = [xo, EY, ETOP], A = P(a0, ETOP), B = P(a1, ETOP)
        if (s > 0) roof.tri(c, A, B); else roof.tri(c, B, A)
      }
      // The pier: PW half-width, PD out from the end face, ETOP..PTOP, with a
      // bevelled top.
      const xp = xo + s * PD
      vwall(conc, [xp, EY - PW], [xp, EY + PW], ETOP, PTOP - 0.5, [s, 0])
      vwall(conc, [xo, EY - PW], [xp, EY - PW], ETOP, PTOP, [0, -1])
      vwall(conc, [xo, EY + PW], [xp, EY + PW], ETOP, PTOP, [0, 1])
      face(conc, [[xp, EY - PW, PTOP - 0.5], [xp, EY + PW, PTOP - 0.5], [xp - s * 0.5, EY + PW, PTOP], [xp - s * 0.5, EY - PW, PTOP]], [s, 0, 1])
      hquad(roof, Math.min(xo, xp - s * 0.5), Math.max(xo, xp - s * 0.5), EY - PW, EY + PW, PTOP, true)
    }
  }
  // The bridge: its two long faces, and its underside over the opening.
  for (const t of [-1, 1]) vwall(conc, [-XI, t * HY], [XI, t * HY], BRIDGE, TOP, [0, t])
  hquad(conc, -XI, XI, -HY, HY, BRIDGE, false)

  // Roof: a parapet lip 0.7 m wide round the whole top, the roof sunk 1 m.
  {
    const L = 0.7, z = TOP, zr = TOP - 1.0
    const outer: XY[] = [[-X0 + C, -HY], [X0 - C, -HY], [X0, -HY + C], [X0, HY - C], [X0 - C, HY], [-X0 + C, HY], [-X0, HY - C], [-X0, -HY + C]]
    const inner: XY[] = [[-X0 + L + C * 0.6, -HY + L], [X0 - L - C * 0.6, -HY + L], [X0 - L, -HY + L + C * 0.6], [X0 - L, HY - L - C * 0.6], [X0 - L - C * 0.6, HY - L], [-X0 + L + C * 0.6, HY - L], [-X0 + L, HY - L - C * 0.6], [-X0 + L, -HY + L + C * 0.6]]
    for (let i = 0; i < 8; i++) {
      const j = (i + 1) % 8
      face(trim, [[outer[i][0], outer[i][1], z], [outer[j][0], outer[j][1], z], [inner[j][0], inner[j][1], z], [inner[i][0], inner[i][1], z]], [0, 0, 1])
      const mx = (inner[i][0] + inner[j][0]) / 2, my = (inner[i][1] + inner[j][1]) / 2
      face(trim, [[inner[i][0], inner[i][1], z], [inner[j][0], inner[j][1], z], [inner[j][0], inner[j][1], zr], [inner[i][0], inner[i][1], zr]], [-mx, -my, 0])
    }
    cap(roof, inner, zr)
  }

  // The glazed lobby in the opening: a low glass box, set back 6 m.
  {
    const x = XI - RC - 0.2, y = HY - 6, h = 9
    for (const t of [-1, 1]) vwall(glass, [-x, t * y], [x, t * y], 0, h, [0, t])
    hquad(glass, -x, x, -y, y, h, true)
  }

  // Windows: one panel per bay over two storeys, set 0.05 m proud.
  const groups = rows(LOBBY, TOP - 6, Math.round((TOP - 6 - LOBBY) / (2 * FL)), 2.4)
  const bayPanels = (a: XY, b: XY, z0: number, z1: number, skip?: (s: number) => boolean) => {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), pitch = 3.05, n = Math.floor((L - 1.2) / pitch), m = (L - n * pitch) / 2
    for (let k = 0; k < n; k++) {
      const c = m + (k + 0.5) * pitch
      if (skip?.(c)) continue
      for (const [g0, g1] of groups) if (g0 >= z0 && g1 <= z1) panel(win, a, b, c - 1.0, c + 1.0, g0, g1, 0.05)
    }
  }
  // Long faces of the legs and the bridge (counter-clockwise rings: the
  // south-east face runs -x → +x, the north-west face +x → -x).
  for (const s of [-1, 1]) {
    const x0 = s < 0 ? -X0 + C : XI, x1 = s < 0 ? -XI : X0 - C
    bayPanels([x0, -HY], [x1, -HY], 0, TOP)
    bayPanels([x1, HY], [x0, HY], 0, TOP)
    // The inner faces, either side of the half-column, below the bridge.
    const a: XY = s < 0 ? [-XI, -HY] : [XI, HY], b: XY = s < 0 ? [-XI, HY] : [XI, -HY]
    bayPanels(a, b, 0, BRIDGE - 1, c => Math.abs(c - HY) < RC + 1.6)
    // The outer end faces, either side of the half-tower and pier.
    const e0: XY = s < 0 ? [-X0, HY - C] : [X0, -HY + C], e1: XY = s < 0 ? [-X0, -HY + C] : [X0, HY - C]
    bayPanels(e0, e1, 0, TOP, c => { const y = s < 0 ? (HY - C) - c : -(HY - C) + c; return Math.abs(y - EY) < RE + 1.0 })
  }
  // The glazed top storey, a continuous band round the whole top.
  {
    const ring: XY[] = [[-X0 + C, -HY], [X0 - C, -HY], [X0, -HY + C], [X0, HY - C], [X0 - C, HY], [-X0 + C, HY], [-X0, HY - C], [-X0, -HY + C]]
    for (let i = 0; i < 8; i++) {
      const a = ring[i], b = ring[(i + 1) % 8], L = Math.hypot(b[0] - a[0], b[1] - a[1])
      panel(win, a, b, 0.3, L - 0.3, TOP - 4.6, TOP - 1.4, 0.05)
    }
  }
  bayPanels([-XI, -HY], [XI, -HY], BRIDGE, TOP)
  bayPanels([XI, HY], [-XI, HY], BRIDGE, TOP)

  return [
    { part: conc, material: finish('arcos-concrete', 0xe2ded6) },
    { part: win, material: windowVariant(2, 0x93b8b2) },
    { part: glass, material: PALETTE.glass },
    { part: roof, material: PALETTE.roof },
    { part: trim, material: PALETTE.trim },
  ]
}

if (import.meta.main) await save('mexico-city-arcos-bosques', 'Torre Arcos Bosques I', ANCHOR, BEARING, build(), 6500)
