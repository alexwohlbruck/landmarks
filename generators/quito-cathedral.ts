/**
 * Metropolitan Cathedral of Quito — procedural, CC0-1.0, no textures.
 * bun generators/quito-cathedral.ts
 *
 * Uses the Quito church kit in quito-la-compania.ts.
 *
 * Map frame: x east, y north, z up, metres, turned to the cathedral's axis.
 * The long walls in OSM run at 126° / 306°; the long north-east side faces
 * Plaza Grande (Plaza de la Independencia), so the placement bearing is 216
 * and the plaza side faces the model's south (y = −13.2). +x runs to the
 * north-west end on Calle García Moreno. The anchor is the area centroid of
 * the OSM outline way/253234080 (lng −78.5124679, lat −0.2205004).
 *
 * What it is: the cathedral (begun 1562, rebuilt after earthquakes; the bell
 * tower rebuilt in 1930) shows Plaza Grande a long white wall on a raised
 * stone terrace: pilasters carrying white statues over the cornice, tall
 * windows, a dark tile roof with a row of white dormers, and the side portal
 * — a grey stone triumphal arch at the head of a stair from the plaza, with
 * a small checkered-tile dome and statues behind it. At the south-east end a
 * pale tiled dome and a white square lantern (with the iron rooster, "el
 * gallo de la Catedral"); at the north-west corner, set back behind the
 * nave, the tall white tower: plain shaft, an arched stage under a gable
 * with an oculus, a belfry stage with corner scrolls, an octagonal lantern,
 * a bell-shaped cap and cross.
 *
 * Replaces the outline way/253234080 and its parts way/673325427 (nave),
 * way/673325429 (tower), way/673325420 and way/673325421 (the south-east
 * domes), way/673325424 (the side porch and its dome). The adjoining Iglesia
 * de El Sagrario (way/159408376, with the big green dome next to the tower
 * in most plaza photos) is a separate church and is not part of this model.
 *
 * Evidence
 * - OSM (measured, turned 216°): body x −40.5…38.4, y −13.2…13.3 (26.5 m
 *   deep); porch x −3.1…6.1 projecting to y −20.4; tower x 38.4…45.3,
 *   y 5.9…13.3 (7 m square, at the back corner); domes centred (−34.9,
 *   −3.5) and (−24.3, −3.4), 10.6 m across. OSM heights 17 (nave), 30
 *   (tower), 22 (domes), 15 (porch), used as checks.
 * - Photo-scaled (estimated): terrace 3.0 m above the plaza at the front
 *   (photos 1, 4: the dark retaining wall about half a person's height over
 *   the door heads). Above the terrace (photo 1, 7 m tower = 120 px near the
 *   tower): wall cornice 11.5, parapet and statues to 13.8; dormers to 4.5
 *   above the cornice; ridge 5 above it. Tower: see review round 1 below.
 *   Porch: arch 4.4 m wide and 8 high, cornice 9.5, attic 11, dome to 15.6.
 *   South-east domes (photo 3): drums from the flat roof at 11.5 to 14.5,
 *   dome to 18, lanterns to 20.5.
 * - Terrain: Mapterhorn z12 only. The plaza in front is 3–4 m below the
 *   cathedral's ground and the site rises another 2–3 m to the back; y = 0 is
 *   the plaza at the terrace foot; the terrace and porch stair are built.
 *   elevation 0.
 * - Photos (Wikimedia Commons, EVIDENCE):
 *   1 "Metropolitan Cathedral of Quito.jpg", Ángel M. Felicísimo, CC BY-SA
 *     4.0 — the plaza side from the north, roof, dormers, tower.
 *   2 "Catedral metropolitana Quito.jpg", putneymark, CC BY-SA 2.0 — the
 *     plaza side from across the plaza, tower proportions, roof colour.
 *   3 "Cathedral, Quito, Ecuador.JPG", Shoestring (Wikivoyage), CC BY-SA 4.0
 *     — the south-east end, domes, porch.
 *   4 "Catedral Metropolitana (Quito), steps facing Plaza de la
 *     Independencia.JPG", David Adam Kess, CC BY-SA 4.0 — the porch arch.
 *   5 "Metropolitan Cathedral of Quito from the roof of the Centro Cultural
 *     Metropolitano pic b03.JPG", David Adam Kess, CC BY-SA 4.0 — tower.
 *   6 "Catedral Metropolitana (Quito), facing Plaza de la Independencia.JPG",
 *     David Adam Kess, CC BY-SA 4.0 — porch dome tiles and tower stages.
 *   7 "Catedral metropolitana de Quito de noche - panoramio.jpg", Quito
 *     magnífico, CC BY-SA 3.0 — night: wall, porch and tower floodlit.
 *   8 "(Catedral Metropolitana, Quito) exterior. pic. aa.jpg", David Adam
 *     Kess, CC BY-SA 4.0 — the terrace and the curved corner steps.
 * - Look-only: none.
 * - Colours: white-wash #f1eee7; porch and terrace stone a grey with a
 *   green-brown cast #8a8478 (photos 4, 6); the roof dark charcoal
 *   brown-grey tile #5c5552 (photos 1, 2); dome tile #a2aa98, grey-green
 *   ribbed glazed tile (photos 1, 6); windows dark neutral #4a4a4c.
 * - Review round 1 (lead): the tower rebuilt from photo 5 — plain shaft to
 *   11.5; an arcaded stage (three real arches a face, the middle one open)
 *   to 18.6 with gables and oculi and urns at the corners; a set-back
 *   belfry with one real arch a face to 25.2, a parapet balustrade and
 *   urns; a round windowed lantern; a ribbed white dome, finial and cross
 *   to 33 above the terrace. Back-slope dormers dropped (unphotographed).
 *   The quarter-round corner stair at the terrace's north-west corner
 *   (photo 8) is added.
 * - Tower position: kept where OSM maps it (set back at the north-west
 *   rear corner, its back against El Sagrario's front on García Moreno).
 *   The plaza photos look along the wall and can't show depth; the 7 m
 *   between the north-west wall and the street line holds the corner stair
 *   of photo 8, and photo 1 counts five pilaster bays from the porch to the
 *   tower, which only fits if the tower stands beyond x 38.4.
 * - Doubts: the north-west end on García Moreno and the back are not
 *   photographed here and drawn plain; the tower position follows OSM (set
 *   back at the rear corner), which the plaza photos neither confirm nor
 *   rule out; the stair at the south-east end is left out.
 * - Night: the plaza wall, porch, tower and domes are floodlit (photo 7).
 */
import { Part, type V3 } from './mesh'
import { finish, windowVariant } from './palette'
import { lathe } from './dc-nmaahc'
import { hip, wallRing } from './dc-white-house'
import { cbox, gable, grow, ngon, ngonPrism, qf, rect, roundArch, spire, tf, type Side } from './dc-national-cathedral'
import { domeProfile, domeRibs, ironCross, pierced, proud, ringWindows, saveModel, screen, type AZ, type Op } from './quito-la-compania'

function build() {
  const white = new Part(), stone = new Part(), roof = new Part(), tile = new Part(), win = new Part(), iron = new Part()
  const T = 3.0 // terrace above the plaza
  const X0 = -40.5, X1 = 38.4, Y0 = -13.2, Y1 = 13.3
  const WZ = T + 11.5 // wall cornice
  const S: Side = 's'

  // ---- Terrace along the plaza side.
  const TY = -20.4
  cbox(stone, rect(X0, X1, TY, Y0), 0, T, { top: stone })
  for (const [a0, a1] of [[X0, -3.6], [6.6, X1]]) {
    cbox(stone, rect(a0, a1, TY, TY + 0.6), T, T + 0.9, { b: 0.15 })
    const n = Math.round((a1 - a0) / 7)
    for (let k = 0; k <= n; k++) {
      const x = a0 + ((a1 - a0) * k) / n
      cbox(stone, rect(x - 0.4, x + 0.4, TY, TY + 0.6), T + 0.9, T + 1.4, { b: 0.1 })
      lathe(stone, x, TY + 0.3, [[0.3, T + 1.4], [0.36, T + 1.7], [0.2, T + 2.0], [0, T + 2.05]], 6, false)
    }
  }
  // Doors in the retaining wall (shops under the terrace).
  for (const x of [-34, -26, -18, -10, 13, 21, 29]) roundArch(win, 's', TY, x - 0.9, x + 0.9, 0, 2.7, 0.05, 4)
  // The stair up to the porch.
  for (let k = 0; k < 12; k++) {
    const y = TY - 5.2 + k * 0.45
    cbox(stone, rect(-3.6 - (11 - k) * 0.12, 6.6 + (11 - k) * 0.12, y, TY), 0, ((k + 1) * T) / 12, { top: stone })
  }

  // ---- The body: white walls, pilasters with statues, windows.
  cbox(white, rect(X0, X1, Y0, Y1), 0, WZ, { top: false })
  cbox(white, rect(X0 - 0.3, X1 + 0.3, Y0 - 0.4, Y1 + 0.3), WZ - 0.7, WZ, { b: 0.2, bottom: true, top: false })
  // Parapet balustrade along the plaza side, statues on the pilasters.
  cbox(white, rect(X0, X1, Y0 - 0.3, Y0 + 0.3), WZ, WZ + 0.9, { b: 0.1 })
  const pil: number[] = []
  for (let k = 0; k <= 9; k++) pil.push(X0 + 0.7 + ((X1 - X0 - 1.4) * k) / 9)
  for (const x of pil) {
    proud(white, S, Y0, x - 0.7, x + 0.7, T, WZ - 0.7, 0.45)
    proud(stone, S, Y0 - 0.45, x - 0.75, x + 0.75, T, T + 1.2, 0.1)
    cbox(white, rect(x - 0.55, x + 0.55, Y0 - 0.5, Y0 + 0.6), WZ, WZ + 1.3, { b: 0.1 })
    ngonPrism(white, x, Y0, 0.42, 6, WZ + 1.3, WZ + 2.6, { top: false, r1: 0.3 })
    lathe(white, x, Y0, [[0.3, WZ + 2.6], [0.3, WZ + 2.9], [0, WZ + 3.2]], 6, false)
  }
  for (let k = 0; k < pil.length - 1; k++) {
    const c = (pil[k] + pil[k + 1]) / 2
    if (c > -4 && c < 7) continue // the porch
    qf(win, [c - 0.7, Y0 - 0.05, T + 5.6], [c + 0.7, Y0 - 0.05, T + 5.6], [c + 0.7, Y0 - 0.05, T + 7.8], [c - 0.7, Y0 - 0.05, T + 7.8], [0, -1, 0])
    proud(stone, S, Y0, c - 0.5, c + 0.5, T + 1.5, T + 3.3, 0.08)
  }
  // North-west end on García Moreno: a plain portal.
  roundArch(win, 'e', X1, -1.6, 1.6, T, T + 6.0, 0.05, 6)
  proud(stone, 'e', X1, -2.6, 2.6, T, T + 7.5, 0.4)
  roundArch(win, 'e', X1 + 0.4, -1.6, 1.6, T, T + 6.0, 0.05, 6)

  // ---- Roof: the dark tile gable over the nave from the porch to the
  // north-west end, a flat white roof round the south-east domes.
  const RX = -19.5
  hip(roof, rect(RX, X1 + 0.3, Y0 - 0.3, Y1 + 0.3), WZ, WZ + 5.0, 4.0, roof, 13.3)
  cbox(white, rect(X0, RX, Y0, Y1), WZ - 0.1, WZ, { top: white })
  // Balustrades round the flat roof, drawn as solid low parapets.
  cbox(white, rect(X0, X0 + 0.35, Y0, Y1), WZ, WZ + 0.9, { b: 0.08 })
  cbox(white, rect(X0, RX, Y1 - 0.35, Y1), WZ, WZ + 0.9, { b: 0.08 })
  // Dormers on both slopes.
  const slopeZ = (d: number) => WZ + (5.0 * (13.25 - d)) / 13.25
  for (const x of [-13, -3, 7.5, 17, 26.5]) {
    for (const s of [-1]) { // the plaza slope only; the back slope is not photographed
      const yf = s * 10.4, yb = s * 6.4
      const r = rect(x - 1.3, x + 1.3, Math.min(yf, yb), Math.max(yf, yb))
      cbox(white, r, slopeZ(10.4) - 0.4, slopeZ(6.4) + 0.4, { top: false })
      gable(roof, white, grow(r, 0.2, 0), slopeZ(6.4) + 0.4, slopeZ(6.4) + 1.5, true, s < 0 ? [true, false] : [false, true])
      const side: Side = s < 0 ? 's' : 'n'
      roundArch(win, side, yf, x - 0.5, x + 0.5, slopeZ(10.4) + 0.3, slopeZ(10.4) + 2.1, 0.05, 4)
    }
  }

  // ---- South-east domes.
  {
    // A: a pale tiled dome on an octagonal drum, with a lantern.
    const cx = -34.9, cy = -3.5
    ngonPrism(white, cx, cy, 5.5, 8, WZ, WZ + 3.0, { top: false })
    ringWindows(win, cx, cy, 5.5 * Math.cos(Math.PI / 8), 8, WZ + 0.7, WZ + 2.6, 0.55, 0, 2)
    lathe(white, cx, cy, [[5.8, WZ + 3.0], [5.8, WZ + 3.4], [5.2, WZ + 3.4]], 8, false)
    const prof = domeProfile(5.2, WZ + 3.4, 3.4, 1.1, 4)
    lathe(tile, cx, cy, prof, 16, false)
    domeRibs(tile, cx, cy, [prof[0], prof[2], prof[4]], 8, 0.16, 0.16)
    const lz = prof[prof.length - 1][1]
    ngonPrism(white, cx, cy, 1.1, 8, lz - 0.1, lz + 1.6, { top: false })
    lathe(tile, cx, cy, [[1.3, lz + 1.6], [1.0, lz + 2.2], [0.3, lz + 2.6], [0, lz + 2.7]], 8, false)
    ironCross(iron, cx, cy, lz + 2.6, 1.2, 0.7, 0.12)
    // B: the white square lantern with its balustrade and the rooster.
    const bx = -24.3, by = -3.4
    cbox(white, rect(bx - 4.4, bx + 4.4, by - 4.4, by + 4.4), WZ, WZ + 3.6, { b: 0.2, top: white })
    wallRing(white, rect(bx - 4.4, bx + 4.4, by - 4.4, by + 4.4), 0.3, WZ + 3.6, WZ + 4.4)
    for (const s of ['s', 'w', 'e'] as Side[]) {
      const at = s === 's' ? by - 4.4 : s === 'w' ? bx - 4.4 : bx + 4.4, c = s === 's' ? bx : by
      for (const d of [-2.2, 0, 2.2]) roundArch(win, s, at, c + d - 0.55, c + d + 0.55, WZ + 0.8, WZ + 3.0, 0.05, 4)
    }
    ngonPrism(white, bx, by, 2.4, 8, WZ + 3.6, WZ + 6.0, { top: false })
    ringWindows(win, bx, by, 2.4 * Math.cos(Math.PI / 8), 8, WZ + 4.1, WZ + 5.6, 0.4, 0, 2)
    lathe(tile, bx, by, domeProfile(2.6, WZ + 6.0, 1.8, 0.5, 3), 8, false)
    ngonPrism(white, bx, by, 0.55, 6, WZ + 7.7, WZ + 8.6, { top: false })
    lathe(tile, bx, by, [[0.7, WZ + 8.6], [0.3, WZ + 9.1], [0, WZ + 9.2]], 6, false)
    // The rooster weathervane: a post and a flat bird.
    cbox(iron, rect(bx - 0.06, bx + 0.06, by - 0.06, by + 0.06), WZ + 9.1, WZ + 10.6)
    screen(iron, 's', by - 0.06, [[bx - 0.6, WZ + 10.3], [bx + 0.5, WZ + 10.3], [bx + 0.7, WZ + 11.0], [bx + 0.2, WZ + 11.3], [bx - 0.5, WZ + 10.9]], 0.12, true)
  }

  // ---- The side porch: a stone triumphal arch at the head of the stair,
  // with a checkered-tile dome and statues behind it.
  {
    const c = 1.5, PY = TY, P1 = T + 9.5
    const ops: Op[] = [{ a0: c - 2.2, a1: c + 2.2, zb: T, zt: T + 8.0, arch: true, seg: 6 }]
    pierced(stone, win, S, PY, c - 4.6, c + 4.6, T, P1, ops, 3.0, 6)
    for (const s of [-1, 1]) {
      const x = c + s * 4.6
      qf(stone, [x, PY, T], [x, Y0, T], [x, Y0, P1], [x, PY, P1], [s, 0, 0])
      for (const d of [2.9, 3.9]) proud(stone, S, PY, c + s * d - 0.35, c + s * d + 0.35, T, P1 - 0.6, 0.35)
    }
    cbox(stone, rect(c - 4.9, c + 4.9, PY - 0.5, Y0), P1 - 0.6, P1, { b: 0.2, bottom: true })
    cbox(stone, rect(c - 4.4, c + 4.4, PY, Y0), P1, T + 11.0, { b: 0.15, top: stone })
    for (const d of [-4.0, -1.4, 1.4, 4.0]) {
      ngonPrism(white, c + d, PY + 0.4, 0.38, 6, T + 11.0, T + 12.4, { top: false, r1: 0.28 })
      lathe(white, c + d, PY + 0.4, [[0.28, T + 12.4], [0.28, T + 12.7], [0, T + 13.0]], 6, false)
    }
    const cy = -16.3
    ngonPrism(white, c, cy, 3.4, 8, T + 11.0, T + 12.4, { top: false })
    const prof = domeProfile(3.3, T + 12.4, 2.4, 0.7, 3)
    lathe(tile, c, cy, prof, 12, false)
    const lz = prof[prof.length - 1][1]
    ngonPrism(white, c, cy, 0.7, 6, lz - 0.1, lz + 1.1, { top: false })
    lathe(tile, c, cy, [[0.85, lz + 1.1], [0.4, lz + 1.6], [0, lz + 1.8]], 6, false)
  }

  // ---- The corner stair from the terrace down to García Moreno (photo 8):
  // quarter-round steps wrapping the terrace's north-west corner.
  for (let k = 0; k < 8; k++) {
    const r = 7.2 - k * 0.7, z = ((k + 1) * T) / 8, ring: AZ[] = [[X1, Y0]]
    for (let j = 0; j <= 6; j++) { const t = -Math.PI / 2 + (Math.PI / 2) * (j / 6); ring.push([X1 + r * Math.cos(t), Y0 + r * Math.sin(t)]) }
    for (let i = 0; i < ring.length; i++) {
      const A = ring[i], B = ring[(i + 1) % ring.length]
      qf(stone, [A[0], A[1], 0], [B[0], B[1], 0], [B[0], B[1], z], [A[0], A[1], z], [B[1] - A[1], -(B[0] - A[0]), 0])
    }
    for (let i = 1; i < ring.length - 1; i++) tf(stone, [...ring[0], z] as V3, [...ring[i], z] as V3, [...ring[i + 1], z] as V3, [0, 0, 1])
  }

  // ---- The tower at the north-west corner (OSM way/673325429): a plain
  // shaft; an arcaded stage with three real arches a face under gables with
  // oculi, a balustrade and urns; a narrower belfry with a real arch a face,
  // balustrade and urns; a round lantern; a ribbed white dome and cross.
  {
    const tx = 41.85, ty = 9.6, h = 3.5
    const r0 = rect(tx - h, tx + h, ty - h, ty + h)
    const urn = (x: number, y: number, z: number, s = 1) => {
      cbox(white, rect(x - 0.3 * s, x + 0.3 * s, y - 0.3 * s, y + 0.3 * s), z, z + 0.5 * s, { b: 0.05 })
      lathe(white, x, y, [[0.22 * s, z + 0.5 * s], [0.4 * s, z + 0.85 * s], [0.25 * s, z + 1.2 * s], [0.12 * s, z + 1.3 * s], [0, z + 1.6 * s]], 6, false)
    }
    const faces = (r: ReturnType<typeof rect>, z0: number, z1: number, op: (m: number) => Op[], d: number) => {
      pierced(white, win, 's', r.y0, r.x0, r.x1, z0, z1, op(tx), d)
      pierced(white, win, 'n', r.y1, r.x0, r.x1, z0, z1, op(tx), d)
      pierced(white, win, 'w', r.x0, r.y0, r.y1, z0, z1, op(ty), d)
      pierced(white, win, 'e', r.x1, r.y0, r.y1, z0, z1, op(ty), d)
    }
    const corners = (r: ReturnType<typeof rect>) => [[r.x0, r.y0], [r.x1, r.y0], [r.x1, r.y1], [r.x0, r.y1]] as [number, number][]
    cbox(white, r0, 0, T + 11.5, { top: false })
    cbox(white, grow(r0, 0.35), T + 11.0, T + 11.7, { b: 0.15, bottom: true, top: white })
    // Stage A: three arches a face, the middle one tall and open.
    const ra = grow(r0, -0.2), za0 = T + 11.7, za1 = T + 18.6
    faces(ra, za0, za1, (m) => [
      { a0: m - 2.55, a1: m - 1.55, zb: za0 + 1.2, zt: za0 + 4.6, arch: true, seg: 4 },
      { a0: m - 0.95, a1: m + 0.95, zb: za0 + 0.6, zt: za0 + 5.8, arch: true, seg: 4 },
      { a0: m + 1.55, a1: m + 2.55, zb: za0 + 1.2, zt: za0 + 4.6, arch: true, seg: 4 },
    ], 0.8)
    for (const [x, y] of corners(ra)) cbox(white, rect(x - 0.4, x + 0.4, y - 0.4, y + 0.4), za0, za1, { top: false })
    cbox(white, grow(ra, 0.45), za1, za1 + 0.5, { b: 0.15, bottom: true, top: white })
    // Gables with oculi on every face, urns at the corners.
    for (const [side, at, m] of [['s', ra.y0, tx], ['n', ra.y1, tx], ['w', ra.x0, ty], ['e', ra.x1, ty]] as [Side, number, number][]) {
      screen(white, side, at, [[m - 2.7, za1 + 0.5], [m + 2.7, za1 + 0.5], [m, za1 + 2.5]], 1.2)
    }
    for (const [x, y] of corners(ra)) urn(x, y, za1 + 0.5, 1.3)
    // Stage B, set back: the belfry, one tall open arch a face.
    const rb = grow(r0, -0.95), zb0 = za1 + 0.5, zb1 = T + 25.2
    faces(rb, zb0, zb1, (m) => [{ a0: m - 0.85, a1: m + 0.85, zb: zb0 + 1.4, zt: zb0 + 5.4, arch: true, seg: 4 }], 0.6)
    for (const [x, y] of corners(rb)) cbox(white, rect(x - 0.35, x + 0.35, y - 0.35, y + 0.35), zb0, zb1, { top: false })
    cbox(white, grow(rb, 0.4), zb1, zb1 + 0.45, { b: 0.15, bottom: true, top: white })
    wallRing(white, grow(rb, 0.3), 0.25, zb1 + 0.45, zb1 + 1.1)
    for (const [x, y] of corners(rb)) urn(x, y, zb1 + 0.45, 1.0)
    // Round lantern with windows, cornice; ribbed white dome, finial, cross.
    const zc0 = zb1 + 0.45, zc1 = zc0 + 2.4
    lathe(white, tx, ty, [[2.0, zc0], [2.0, zc1], [2.3, zc1], [2.3, zc1 + 0.35], [2.05, zc1 + 0.35]], 12, false)
    ringWindows(win, tx, ty, 2.0 * Math.cos(Math.PI / 12), 12, zc0 + 0.4, zc1 - 0.3, 0.3, 0, 2)
    const prof = domeProfile(2.05, zc1 + 0.35, 2.4, 0.45, 4)
    lathe(white, tx, ty, prof, 12, false)
    domeRibs(white, tx, ty, [prof[0], prof[2], prof[4]], 8, 0.14, 0.14)
    const lz = prof[prof.length - 1][1]
    lathe(white, tx, ty, [[0.45, lz], [0.45, lz + 0.8], [0.6, lz + 0.8], [0.5, lz + 1.1], [0, lz + 1.4]], 8, false)
    ironCross(iron, tx, ty, lz + 1.3, 1.4, 0.8, 0.15)
  }

  const lit = (p: V3, n: V3) => (p[1] < -9 || p[2] > T + 11.4 ? 1 : 0.3) * (n[2] > 0.8 ? 0.35 : 1)
  return [
    { part: white, material: { ...finish('whitewash', 0xf1eee7), floodlight: lit } },
    { part: stone, material: { ...finish('quito-stone', 0x8a8478), floodlight: lit } },
    { part: roof, material: finish('dark-glazed-tile', 0x5c5552, 0.6) },
    { part: tile, material: { ...finish('glazed-tile-checker', 0xa2aa98, 0.45), floodlight: lit } },
    { part: win, material: windowVariant(2, 0x4a4a4c) },
    { part: iron, material: finish('iron', 0x5b5852, 0.6) },
  ]
}

if (import.meta.main) {
  await saveModel('quito-cathedral', 'Metropolitan Cathedral of Quito', build())
}
