/**
 * Waterfront Station (the 1914 Canadian Pacific Railway station),
 * 601 West Cordova Street, Vancouver: procedural, CC0-1.0, no textures.
 *   bun generators/van-waterfront-station.ts
 *
 * Neoclassical, 1912-14 (Barott, Blackader & Webster): red-brown brick over
 * white trim; on Cordova Street a giant order of white columns across the
 * recessed centre between two brick end pavilions, an attic storey over
 * them, a white cornice and balustrade; on the harbour (track) side a row
 * of great round-arched windows under segmental parapets, over a white
 * balustraded terrace and two storeys of paired windows.
 *
 * Map frame: x east', y north', z up, metres, turned to bearing 134.7 (the
 * Cordova front of OSM way/78393326). +x is the Cordova front (south-west),
 * -x the harbour side, +y runs south-east toward Seymour Street.
 * Anchor: the area centroid of way/78393326, lng -123.1117633,
 * lat 49.2857085. Elevation 0.
 *
 * Evidence
 *  - OSM (ODbL): way/78393326 (building=train_station, height 23, 4
 *    levels, roof colour #aa8a7d, start 1914, Q1625437); its outline,
 *    with the end pavilions 1.1 m proud of the centre on Cordova, is used
 *    as is.
 *  - City of Vancouver building-footprints-2009 (City 2009 lidar; Contains
 *    information licensed under the Open Government Licence - Vancouver),
 *    bldgid 150928: the roof 24.5-28.2 m over the track-side ground, two
 *    raised hipped blocks to about 30 m (x 7.8..16.3, y -35.4..-25.8 and
 *    x -8.6..-0.7, y 34.5..42.9 here).
 *  - Mapterhorn terrain: the tracks (harbour side) are the lowest ground
 *    (y = 0); Cordova Street is about 7.7 m higher, so the Cordova front
 *    starts there and the harbour front is the full 27 m.
 *  - Photos (Wikimedia Commons, EVIDENCE):
 *    - x04, x01: Xicotencatl, "Waterfront Station Vancouver 04.JPG" and
 *      "01.JPG", CC BY-SA 4.0 (the colonnade from Cordova; the roof and
 *      the raised blocks from above).
 *      https://commons.wikimedia.org/wiki/File:Waterfront_Station_Vancouver_04.JPG
 *      https://commons.wikimedia.org/wiki/File:Waterfront_Station_Vancouver_01.JPG
 *    - zhatt: Zhatt, "Vancouver Waterfront Station.jpg", public domain (the
 *      west pavilion, arched ground-floor windows, the colonnade).
 *      https://commons.wikimedia.org/wiki/File:Vancouver_Waterfront_Station.jpg
 *    - drone: dronepicr, "Waterfront station Vancouver (42914420220).jpg",
 *      CC BY 2.0 (the Cordova front along its length).
 *      https://commons.wikimedia.org/wiki/File:Waterfront_station_Vancouver_(42914420220).jpg
 *    - DD30: Diego Delso, "Harbour Centre, Vancouver, Canadá, 2017-08-14,
 *      DD 30.jpg", CC BY-SA 4.0 (the harbour side: the arches, parapets,
 *      terrace balustrade).
 *      https://commons.wikimedia.org/wiki/File:Harbour_Centre,_Vancouver,_Canad%C3%A1,_2017-08-14,_DD_30.jpg
 *  No commercial imagery.
 *
 * Estimated, and doubts:
 *  - Storey heights, the column height (13 m) and count (14 across the
 *    43 m centre), window sizes: counted and scaled from x04 and DD30.
 *  - Eight great arches on the harbour side at about 12 m centres, read
 *    from DD30 (part of that side is hidden there); roundels and the
 *    terrace's balusters are left out (the balustrade is a white band).
 *  - Lead review 1: the harbour arches enlarged to 0.72 of the bay (about
 *    8.6 m), springing 4 m over the terrace, with two white mullions and a
 *    transom; the parapet made one continuous wave of segments meeting at
 *    the piers, proud of the cornice; the terrace balustrade a bold proud
 *    white band; roundels on the piers. Brick colour re-sampled from x04's
 *    sunlit pavilion (#d0896f, #ce876f), pulled to #c97a5e.
 *  - The ends (north-west and south-east) are drawn with plain windows; the
 *    SeaBus bridge and the platform canopies are not part of the model.
 *  - Night: windows glow, the portico's doors are `entrance`, the
 *    colonnade and cornice are floodlit.
 */
import { Part, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { area, block, cap, inset, panel, walls, type XY } from './chi-aon-center'
import { hipRoof } from './chi-board-of-trade'

export const BEARING = 134.7
export const ANCHOR = { lng: -123.1117633, lat: 49.2857085 }

const ccw = (r: XY[]) => (area(r) < 0 ? [...r].reverse() : r)
const OUTLINE: XY[] = ccw([[15.4, 55.7], [3.0, 55.9], [-5.5, 56.1], [-5.5, 45.0], [-8.7, 44.1], [-22.4, 40.4], [-21.7, 37.2], [-25.5, 36.3], [-20.1, 2.7], [-18.1, -6.1], [-10.5, -41.1], [-5.4, -61.6], [3.8, -61.7], [15.2, -61.4], [14.9, -36.6], [18.7, -36.5], [18.6, -24.0], [17.4, -24.0], [17.5, -7.3], [17.6, 19.4], [18.6, 19.4], [18.5, 31.3], [15.4, 31.2]])
// the portico: the centre's wall stands back 3 m behind the columns
const LOWER: XY[] = OUTLINE.map(([x, y]) => (x > 17 && x < 18 && y > -25 && y < 20 ? [14.5, y] : [x, y]) as XY)

const CORDOVA = 7.7 // the street over the tracks (Mapterhorn, along the front)
const Z_ENT = CORDOVA + 13 // the colonnade's entablature
const Z_CORNICE = 26.4, Z_TOP = 27.2, Z_BAL = 28.3

function build() {
  const brick = new Part(), trim = new Part(), win = new Part(), roof = new Part(), door = new Part()

  // ---- the masses ----------------------------------------------------------
  walls(brick, LOWER, 0, Z_ENT)
  walls(brick, OUTLINE, Z_ENT, Z_CORNICE)
  // the entablature's soffit over the portico
  trim.quad([17.5, -24.0, Z_ENT], [17.6, 19.4, Z_ENT], [14.5, 19.4, Z_ENT], [14.5, -24.0, Z_ENT])
  trim.quad([17.5, -24.0, Z_ENT], [14.5, -24.0, Z_ENT], [14.5, 19.4, Z_ENT], [17.6, 19.4, Z_ENT])
  // the white cornice, a little proud, then the balustrade (a white band) and the roof
  const corn = inset(OUTLINE, -0.45)
  walls(trim, corn, Z_CORNICE, Z_TOP)
  cap(trim, corn, Z_CORNICE, false)
  const bal = inset(OUTLINE, 0.1)
  walls(trim, bal, Z_TOP, Z_BAL)
  const balIn = inset(OUTLINE, 0.6)
  walls(trim, [...balIn].reverse(), Z_TOP, Z_BAL)
  for (let i = 0; i < bal.length; i++) {
    const j = (i + 1) % bal.length
    trim.quad([bal[i][0], bal[i][1], Z_BAL], [bal[j][0], bal[j][1], Z_BAL], [balIn[j][0], balIn[j][1], Z_BAL], [balIn[i][0], balIn[i][1], Z_BAL])
  }
  // the ring between the cornice and the balustrade's foot
  for (let i = 0; i < corn.length; i++) {
    const j = (i + 1) % corn.length
    trim.quad([corn[i][0], corn[i][1], Z_TOP], [corn[j][0], corn[j][1], Z_TOP], [bal[j][0], bal[j][1], Z_TOP], [bal[i][0], bal[i][1], Z_TOP])
  }
  cap(roof, balIn, Z_TOP - 0.3)
  // the low ridge of the main roof, and the two raised hipped blocks (lidar)
  hipRoof(roof, -12, -40, 10, 30, Z_TOP - 0.3, Z_TOP + 2.2)
  for (const [x0, y0, x1, y1] of [[7.8, -35.4, 16.3, -25.8], [-8.6, 34.5, -0.7, 42.9]]) {
    block(brick, null, ccw([[x0, y0], [x1, y0], [x1, y1], [x0, y1]]), Z_TOP - 1, Z_TOP + 2.6, 0)
    block(trim, null, ccw([[x0 - 0.3, y0 - 0.3], [x1 + 0.3, y0 - 0.3], [x1 + 0.3, y1 + 0.3], [x0 - 0.3, y1 + 0.3]]), Z_TOP + 2.6, Z_TOP + 3.2, 0)
    hipRoof(roof, x0, y0, x1, y1, Z_TOP + 3.2, Z_TOP + 6)
  }

  // ---- the Cordova colonnade -----------------------------------------------
  const NC = 14, y0c = -22.6, y1c = 18.0, R = 0.8, SEGC = 10
  for (let k = 0; k < NC; k++) {
    const cy = y0c + ((y1c - y0c) * k) / (NC - 1), cx = 16.8
    const ring = (r: number, z: number) => Array.from({ length: SEGC }, (_, i) => [cx + r * Math.cos((i / SEGC) * 2 * Math.PI), cy + r * Math.sin((i / SEGC) * 2 * Math.PI), z] as V3)
    const rings = [ring(0.85, CORDOVA), ring(0.85, CORDOVA + 0.8), ring(R, CORDOVA + 0.8), ring(R * 0.88, Z_ENT - 1.0), ring(0.85, Z_ENT - 0.6), ring(0.85, Z_ENT)]
    trim.loft(rings)
  }
  // the portico's back wall: tall windows and the doors between the columns
  for (let k = 0; k < NC - 1; k++) {
    const ya = y0c + ((y1c - y0c) * k) / (NC - 1) + 0.9, yb = y0c + ((y1c - y0c) * (k + 1)) / (NC - 1) - 0.9
    const P = (y: number, z: number): V3 => [14.56, y, z]
    if (k % 3 === 0) door.quad(P(ya, CORDOVA), P(yb, CORDOVA), P(yb, CORDOVA + 3.6), P(ya, CORDOVA + 3.6))
    else win.quad(P(ya, CORDOVA + 0.8), P(yb, CORDOVA + 0.8), P(yb, CORDOVA + 3.6), P(ya, CORDOVA + 3.6))
    win.quad(P(ya, CORDOVA + 4.6), P(yb, CORDOVA + 4.6), P(yb, Z_ENT - 1.5), P(ya, Z_ENT - 1.5))
    // the attic over the colonnade: a window a bay
    const Q = (y: number, z: number): V3 => [17.62, y, z]
    win.quad(Q(ya + 0.2, Z_ENT + 1.2), Q(yb - 0.2, Z_ENT + 1.2), Q(yb - 0.2, Z_CORNICE - 1.0), Q(ya + 0.2, Z_CORNICE - 1.0))
  }

  // ---- windows and white bands on the other walls ---------------------------
  const semi = (p: Part, a: XY, b: XY, s0: number, s1: number, z0: number, zs: number, out = 0.06, seg = 8) => {
    // a round-headed window: jambs to zs, then a true semicircle
    panel(p, a, b, s0, s1, z0, zs, out)
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
    const r = (s1 - s0) / 2, sc = (s0 + s1) / 2
    const P = (s: number, z: number): V3 => [a[0] + u[0] * s + n[0] * out, a[1] + u[1] * s + n[1] * out, z]
    for (let i = 0; i < seg; i++) {
      const t0 = Math.PI - (i / seg) * Math.PI, t1 = Math.PI - ((i + 1) / seg) * Math.PI
      p.tri(P(sc, zs), P(sc + r * Math.cos(t1), zs + r * Math.sin(t1)), P(sc + r * Math.cos(t0), zs + r * Math.sin(t0)))
    }
  }
  for (let i = 0; i < LOWER.length; i++) {
    const a = LOWER[i], b = LOWER[(i + 1) % LOWER.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 4) continue
    const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
    const mx = (a[0] + b[0]) / 2
    const portico = Math.abs(mx - 14.5) < 0.2 && Math.abs(a[0] - b[0]) < 0.2
    if (portico) continue
    const cordova = n[0] > 0.8, harbour = n[0] < -0.8
    const g = cordova ? CORDOVA : harbour ? 0 : Math.max(0, Math.min(CORDOVA, ((mx + 22) / 40) * CORDOVA))
    // a white string course under the top storey, and a white base
    panel(trim, a, b, 0, L, Z_CORNICE - 5.9, Z_CORNICE - 5.3, 0.04)
    panel(trim, a, b, 0, L, Math.max(0, g - 2), g + 1.0, 0.03)
    if (harbour && L > 20) {
      // the great hall's harbour side (DD30): a bold white terrace
      // balustrade, then a great round-arched window in each bay, nearly the
      // bay's width, white mullions, a white roundel on each pier, and over
      // each arch its own raised segmental parapet, coped white, the
      // parapets meeting at the piers in one continuous wave
      const k = Math.round(L / 12), bay = L / k
      const P = (s: number, z: number, o: number): V3 => [a[0] + u[0] * s + n[0] * o, a[1] + u[1] * s + n[1] * o, z]
      // the terrace balustrade: a proud white band with a top
      const B0 = 14.8, B1 = 16.4, BO = 0.35
      trim.quad(P(0, B0, BO), P(L, B0, BO), P(L, B1, BO), P(0, B1, BO))
      trim.quad(P(0, B1, BO), P(L, B1, BO), P(L, B1, 0), P(0, B1, 0))
      trim.quad(P(L, B0, BO), P(0, B0, BO), P(0, B0, 0), P(L, B0, 0))
      const A_BOT = 16.8, A_SPRING = 20.6
      const VALLEY = Z_CORNICE + 0.6, RISE = 2.6, FRONT = 0.55, BACK = -0.7
      for (let q = 0; q < k; q++) {
        const sc = (q + 0.5) * bay, r = bay * 0.36
        semi(win, a, b, sc - r, sc + r, A_BOT, A_SPRING, 0.06, 10)
        // white mullions and a transom at the springing
        for (const d of [-r / 3, r / 3]) panel(trim, a, b, sc + d - 0.11, sc + d + 0.11, A_BOT, A_SPRING + Math.sqrt(r * r - d * d) - 0.05, 0.09)
        panel(trim, a, b, sc - r, sc + r, A_SPRING - 0.11, A_SPRING + 0.11, 0.09)
        // paired windows on the two storeys below the terrace
        for (const [z0, z1] of [[2.2, 6.4], [8.4, 13.4]] as [number, number][])
          for (const d of [-2.6, 1.0]) panel(win, a, b, sc + d, sc + d + 1.6, z0, z1, 0.05)
        // the parapet over this arch: brick face proud of the cornice, its top a segment
        const NS = 8
        for (let j = 0; j < NS; j++) {
          const t0 = -1 + (2 * j) / NS, t1 = -1 + (2 * (j + 1)) / NS
          const h0 = VALLEY + RISE * (1 - t0 * t0), h1 = VALLEY + RISE * (1 - t1 * t1)
          const s0 = sc + (t0 * bay) / 2, s1 = sc + (t1 * bay) / 2
          const z0 = Z_CORNICE - 1.4
          brick.quad(P(s0, z0, FRONT), P(s1, z0, FRONT), P(s1, h1, FRONT), P(s0, h0, FRONT))
          brick.quad(P(s1, z0, BACK), P(s0, z0, BACK), P(s0, h0, BACK), P(s1, h1, BACK))
          // the white coping, a little proud both ways
          trim.quad(P(s0, h0, FRONT + 0.15), P(s1, h1, FRONT + 0.15), P(s1, h1 + 0.45, FRONT + 0.15), P(s0, h0 + 0.45, FRONT + 0.15))
          trim.quad(P(s0, h0 + 0.45, FRONT + 0.15), P(s1, h1 + 0.45, FRONT + 0.15), P(s1, h1 + 0.45, BACK - 0.15), P(s0, h0 + 0.45, BACK - 0.15))
          trim.quad(P(s0, h0 + 0.45, BACK - 0.15), P(s1, h1 + 0.45, BACK - 0.15), P(s1, h1, BACK - 0.15), P(s0, h0, BACK - 0.15))
        }
        // the parapet's underside where it stands proud of the wall
        brick.quad(P(sc + bay / 2, Z_CORNICE - 1.4, FRONT), P(sc - bay / 2, Z_CORNICE - 1.4, FRONT), P(sc - bay / 2, Z_CORNICE - 1.4, 0), P(sc + bay / 2, Z_CORNICE - 1.4, 0))
        // a white roundel on the pier before this bay (and after the last)
        for (const sp of q === k - 1 ? [q * bay, (q + 1) * bay] : [q * bay]) {
          if (sp < 1 || sp > L - 1) continue
          const R = 0.75, zc = A_SPRING + 2.4, seg = 10
          for (let i = 0; i < seg; i++) {
            const t0 = (i / seg) * 2 * Math.PI, t1 = ((i + 1) / seg) * 2 * Math.PI
            trim.tri(P(sp, zc, 0.08), P(sp + R * Math.cos(t0), zc + R * Math.sin(t0), 0.08), P(sp + R * Math.cos(t1), zc + R * Math.sin(t1), 0.08))
          }
        }
      }
      continue
    }
    // ordinary walls: a window per real window, round-headed on the ground floor
    const k = Math.max(1, Math.round(L / 3.4)), bay = L / k
    const storeys: [number, number][] = []
    if (cordova) storeys.push([g + 0.9, g + 5.6])
    for (let z = cordova ? g + 6.8 : Math.max(g + 1.6, 2.2); z + 2.6 < Z_CORNICE - 0.8; z += 4.2)
      if (z + 2.6 < Z_CORNICE - 6.1 || z > Z_CORNICE - 5.1) storeys.push([z, z + 2.6])
    for (let q = 0; q < k; q++) {
      const s0 = q * bay + bay * 0.3, s1 = (q + 1) * bay - bay * 0.3
      if (s1 - s0 < 0.8) continue
      storeys.forEach(([z0, z1], j) => {
        if (z1 - z0 < 1.2) return
        if (j === 0 && cordova) semi(win, a, b, s0 - bay * 0.1, s1 + bay * 0.1, z0, z1 - (s1 - s0) / 2 - bay * 0.1, 0.06)
        else panel(win, a, b, s0, s1, z0, z1, 0.05)
      })
    }
  }

  const lit = (p: V3, nn: V3) => (nn[0] > 0.3 || p[2] > Z_CORNICE - 0.5 ? 0.7 : 0.15)
  return [
    { part: brick, material: finish('cpr-brick', 0xc97a5e) as MaterialSpec },
    { part: trim, material: { ...PALETTE.trim, floodlight: lit } as MaterialSpec },
    { part: win, material: PALETTE.window as MaterialSpec },
    { part: roof, material: finish('cpr-roof', 0xa58e83) as MaterialSpec },
    { part: door, material: PALETTE.entrance as MaterialSpec },
  ]
}

if (import.meta.main) {
  const parts = build().filter((x) => x.part.triangles > 0)
  const tris = parts.reduce((s, x) => s + x.part.triangles, 0)
  const glb = writeGlb('Waterfront Station', parts, { frame: 'Y up, -Z north, +X east; metres; ground anchor', anchor: [ANCHOR.lat, ANCHOR.lng], bearing: BEARING })
  if (tris > 5000 || glb.length > 250_000) throw new Error(`budget: ${tris} triangles / ${glb.length} bytes`)
  const out = new URL('../models/van-waterfront-station.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${tris} triangles, ${glb.length} bytes`)
}
