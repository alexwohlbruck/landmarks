/**
 * The White Tower, Tower of London (begun c. 1078 for William I; cupolas
 * and windows 17th-18th century): original procedural geometry, CC0-1.0.
 * bun generators/london-white-tower.ts
 *
 * Map frame, turned to BEARING 6: +y (model north) is compass 6 deg, +x is
 * compass 96; z up, metres. Origin = the area centroid of OSM way/369135772
 * (-0.076078, 51.508075), on the ground. y = 0 is the lowest ground at the
 * keep's foot (the west side); the ground rises ~1 m to the south and ~4 m
 * to the north and east, where the lower walls sink into it.
 *
 * What makes it the White Tower, and how each is drawn
 * - The square Norman keep of pale ragstone with white Caen-stone dressings:
 *   a block 30.5 x 35.5 m to the battlements (26.9 m), with real merlons and
 *   crenels all round (and round the apse) and two lead roofs behind.
 * - Four corner turrets: three square ones (NW, SW, SE) rising a stage above
 *   the battlements under lead-grey ogee cupolas, and the round NE turret,
 *   taller in girth, under its dome; each cupola carries a gilded weathervane
 *   on a ball finial, drawn bold.
 * - Flat pilaster buttresses up every face in the white dressing stone (the
 *   white vertical bands that mark the keep at a distance), a white string
 *   course under the parapet.
 * - Round-headed windows in three tiers, the middle tier set in white arched
 *   surrounds; small arched windows in the turrets.
 * - The apsidal bulge of St John's Chapel at the south-east, battlemented
 *   like the rest.
 * - Second pass (lead review): ragstone greyer and darker so the white
 *   dressings stand out; windows smaller (0.8-1.0 m) and the top tier on
 *   alternate bays only; turrets taller with slimmer cupolas and lanterns.
 * - Night: the walls are floodlit (_FLOODLIGHT on stone and dressings).
 *
 * Evidence
 * - OSM (ODbL): outline way/369135772 (building=castle, wikidata Q1528473);
 *   parts inside it: way/717251841 (SW turret), way/717251842 (NE round
 *   turret, dome, 35 m), way/717251843 (NW turret), way/717251844 (SE
 *   turret), way/932808903, way/932980667 (roof 22-23 m), way/932980668,
 *   way/932980669, way/932980670 (cupolas, 30-34 m), way/932980671 and
 *   way/932980672 (the two gabled roofs). Plan read in the model frame: keep
 *   x -16.1..14.4, y -17.5..18.0; turrets NW (-16.8..-11.8, 13.5..18.5), SW
 *   (-16.9..-11.9, -18.3..-13.3), SE (11.1..15.5, -17.5..-13.1), NE round
 *   centre (13.1, 17.0) radius 3.5; the apse a half-circle of radius 6 on the
 *   east face centred at y = -10.5. The external stair on the south (parts
 *   way/932980673..678, way/369135775) is outside the outline and not drawn.
 * - Environment Agency LIDAR Composite DSM/DTM 1 m, Open Government Licence
 *   v3.0 (0.5 m resample; composite ~2000-2022). The composite sits ~2.8 m
 *   east of OSM here (shape identical; OSM followed). Ground: west 1.8, south
 *   2.9, north 5.7, east 5.5 m above ground_min (z = 0 at 1.8). Battlements
 *   and roofs 28.0-28.9 (26.7 m above z = 0, published 27 m); the NW turret
 *   40.2 and the NE turret 39.8 (38.4 / 38.0 m with their vanes). The SW and
 *   SE turrets do not show in this composite; they are drawn like the NW.
 * - Published: 27 m to the battlements, about 36 x 32 m in plan (Wikipedia
 *   "White Tower (Tower of London)"; Historic England list entry 1357505).
 * - Photos (Wikimedia Commons), opened and compared:
 *   "Tower of London White Tower.jpg", Bernard Gagnon, CC BY-SA 3.0,
 *     https://commons.wikimedia.org/wiki/File:Tower_of_London_White_Tower.jpg
 *     (from the south-east: apse, SE and SW turrets, round NE turret,
 *     pilasters, battlements, windows, colour);
 *   "Tower of London viewed from the River Thames.jpg", Bob Collowan, CC BY-SA 3.0,
 *     https://commons.wikimedia.org/wiki/File:Tower_of_London_viewed_from_the_River_Thames.jpg
 *     (from the south, level and distant: turret and cupola heights, vanes);
 *   "London, Tower of London, White Tower -- 2016 -- 4663.jpg", Dietmar
 *     Rabich, CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:London,_Tower_of_London,_White_Tower_--_2016_--_4663.jpg
 *     (the weathervanes: ball finial, pennant, crown);
 *   "La Torre, Londres, Inglaterra, 2022-11-26, DD 140.jpg", Diego Delso, CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:La_Torre,_Londres,_Inglaterra,_2022-11-26,_DD_140.jpg
 *   "The White Tower, Tower of London.jpg", Edward Swift, CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:The_White_Tower,_Tower_of_London.jpg
 *   "The Tower of London, White Tower City of London 1260258 20230824 0271.jpg",
 *     Tilman2007, CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:The_Tower_of_London,_White_Tower_City_of_London_1260258_20230824_0271.jpg
 * - Look-only: none.
 *
 * Estimated (from the photos against the lidar): the parapet (walk 25.0,
 * merlons 25.9-26.9, 1.3 m merlons at 2.3 m pitch), the turret stage (square
 * turrets to 34.5, ~7.5 m above the battlements, scaled from Collowan's
 * level photo; round to 31.6), the slim ogee cupolas (radius 1.65, to 37.9)
 * with a small open lantern and ball under each vane, the NE dome (to 34.8),
 * the vanes (to 42.0). The NW turret's lidar top is 38.4: the lantern and
 * ball here stand ~1 m above it; the rods are too thin for the lidar, the pilaster widths and count (four bays
 * a face), the window tiers. Doubts: the north and west faces' windows are
 * drawn like the south's (no level photo of the north face was used); the
 * roofs behind the parapet are from OSM's parts and the lidar only.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { writeModel, box, proud, panel, archPanel, faceAt, faceLen, type Face } from './london-buckingham-palace'
import { lathe, tube, slab, ellipsoid, TAU } from './nyc-columbus-monument'

export const BEARING = 6

/** A closed block on a face (front, back, ends, top). */
function block(p: Part, f: Face, s0: number, s1: number, z0: number, z1: number, d0: number, d1: number) {
  proud(p, f, s0, s1, z0, z1, d0, d1)
  const P = (s: number, z: number, d: number) => faceAt(f, s, z, d)
  p.quad(P(s1, z0, d0), P(s0, z0, d0), P(s0, z1, d0), P(s1, z1, d0))
}

/** Parapet with merlons along a face (the face is the wall's outer plane). */
function battlement(p: Part, f: Face, s0: number, s1: number, zw: number, t = 0.85, pitch = 2.3) {
  const L = s1 - s0
  block(p, f, s0, s1, zw - 0.02, zw + 0.9, -t, 0)
  const n = Math.max(1, Math.round(L / pitch)), w = (L / n) * 0.56
  for (let i = 0; i < n; i++) {
    const c = s0 + (L / n) * (i + 0.5)
    block(p, f, c - w / 2, c + w / 2, zw + 0.9, zw + 2.0, -t, 0)
  }
}

function build() {
  const rag = new Part(), dress = new Part(), lead = new Part(), win = new Part(), gilt = new Part()
  const X0 = -16.1, X1 = 14.4, Y0 = -17.5, Y1 = 18.0, ZW = 25.0

  // ===== The keep's body ===================================================
  rag.loft([[[X0, Y0, 0], [X1, Y0, 0], [X1, Y1, 0], [X0, Y1, 0]], [[X0, Y0, ZW], [X1, Y0, ZW], [X1, Y1, ZW], [X0, Y1, ZW]]])
  // Wall walk and the two lead roofs behind the parapet.
  lead.cap([[X0, Y0, ZW], [X1, Y0, ZW], [X1, Y1, ZW], [X0, Y1, ZW]], true)
  for (const [xa, xb] of [[-13.9, -0.3], [0.4, 11.4]]) {
    const xm = (xa + xb) / 2, ya = -15.9, yb = 15.5, zr = 26.6
    lead.quad([xa, ya, ZW], [xm, ya, zr], [xm, yb, zr], [xa, yb, ZW])
    lead.quad([xm, ya, zr], [xb, ya, ZW], [xb, yb, ZW], [xm, yb, zr])
    lead.tri([xa, ya, ZW], [xb, ya, ZW], [xm, ya, zr])
    lead.tri([xb, yb, ZW], [xa, yb, ZW], [xm, yb, zr])
  }

  // Faces in counter-clockwise order.
  const fS: Face = { a: [X0, Y0], b: [X1, Y0] }
  const fE: Face = { a: [X1, -4.4], b: [X1, Y1] } // the east face north of the apse
  const fN: Face = { a: [X1, Y1], b: [X0, Y1] }
  const fW: Face = { a: [X0, Y1], b: [X0, Y0] }

  // Pilaster buttresses (white dressing), the string course, windows and battlements on each face.
  const face = (f: Face, s0: number, s1: number, bays: number, zGround: number) => {
    const L = s1 - s0, pitch = L / bays
    for (let i = 0; i <= bays; i++) {
      const s = s0 + pitch * i
      if (i > 0 && i < bays) proud(dress, f, s - 0.75, s + 0.75, 0, ZW - 0.5, 0, 0.45)
    }
    for (let i = 0; i < bays; i++) {
      const c = s0 + pitch * (i + 0.5)
      if (zGround < 6) archPanel(win, f, c, 0.8, Math.max(7.2, zGround + 2.5), Math.max(8.4, zGround + 3.7), 0.06, 6)
      // Middle tier: in a white arched surround.
      archPanel(dress, f, c, 2.4, 12.0, 14.8, 0.04, 6)
      archPanel(win, f, c, 1.0, 12.5, 14.6, 0.08, 6)
      if (i % 2 === 0 || bays < 4) archPanel(win, f, c, 1.0, 18.6, 20.2, 0.06, 6)
    }
    proud(dress, f, s0, s1, ZW - 0.5, ZW, 0, 0.25, { bottom: true })
    battlement(rag, f, s0, s1, ZW)
  }
  face(fS, 4.6, faceLen(fS) - 3.0, 4, 1.1)
  face(fW, 4.8, faceLen(fW) - 4.4, 4, 0.0)
  face(fN, 4.0, faceLen(fN) - 5.0, 4, 3.9)
  face(fE, 0, faceLen(fE) - 4.6, 3, 3.7)

  // ===== The apse of St John's Chapel ======================================
  {
    const cx = X1, cy = -10.5, r = 6.0, n = 12
    const P = (a: number, rr: number, z: number): V3 => [cx + rr * Math.cos(a), cy + rr * Math.sin(a), z]
    const angs = Array.from({ length: n + 1 }, (_, i) => -Math.PI / 2 + Math.PI * i / n)
    for (let i = 0; i < n; i++) {
      const a0 = angs[i], a1 = angs[i + 1]
      rag.quad(P(a0, r, 0), P(a1, r, 0), P(a1, r, ZW), P(a0, r, ZW))
      lead.tri([cx, cy, ZW], P(a0, r, ZW), P(a1, r, ZW))
      // String course.
      dress.quad(P(a0, r + 0.25, ZW - 0.5), P(a1, r + 0.25, ZW - 0.5), P(a1, r + 0.25, ZW), P(a0, r + 0.25, ZW))
      dress.quad(P(a0, r + 0.25, ZW), P(a1, r + 0.25, ZW), P(a1, r, ZW), P(a0, r, ZW))
      dress.quad(P(a1, r + 0.25, ZW - 0.5), P(a0, r + 0.25, ZW - 0.5), P(a0, r, ZW - 0.5), P(a1, r, ZW - 0.5))
      // Parapet ring and merlons on alternate segments.
      const t = 0.85
      rag.quad(P(a0, r, ZW), P(a1, r, ZW), P(a1, r, ZW + 0.9), P(a0, r, ZW + 0.9))
      rag.quad(P(a1, r - t, ZW), P(a0, r - t, ZW), P(a0, r - t, ZW + 0.9), P(a1, r - t, ZW + 0.9))
      rag.quad(P(a0, r, ZW + 0.9), P(a1, r, ZW + 0.9), P(a1, r - t, ZW + 0.9), P(a0, r - t, ZW + 0.9))
      if (i % 2 === 0) {
        const b0 = a0 + (a1 - a0) * 0.12, b1 = a1 - (a1 - a0) * 0.12, z0 = ZW + 0.9, z1 = ZW + 2.0
        rag.quad(P(b0, r, z0), P(b1, r, z0), P(b1, r, z1), P(b0, r, z1))
        rag.quad(P(b1, r - t, z0), P(b0, r - t, z0), P(b0, r - t, z1), P(b1, r - t, z1))
        rag.quad(P(b0, r, z1), P(b1, r, z1), P(b1, r - t, z1), P(b0, r - t, z1))
        rag.quad(P(b0, r - t, z0), P(b0, r, z0), P(b0, r, z1), P(b0, r - t, z1))
        rag.quad(P(b1, r, z0), P(b1, r - t, z0), P(b1, r - t, z1), P(b1, r, z1))
      }
    }
    // Windows round the apse, on the three tiers, set in white surrounds on the middle one.
    for (const a of [-0.9, -0.3, 0.3, 0.9]) {
      const tx = -Math.sin(a), ty = Math.cos(a)
      const f: Face = { a: [cx + r * Math.cos(a) - tx * 2, cy + r * Math.sin(a) - ty * 2], b: [cx + r * Math.cos(a) + tx * 2, cy + r * Math.sin(a) + ty * 2] }
      archPanel(dress, f, 2, 2.3, 12.0, 14.7, 0.12, 6)
      archPanel(win, f, 2, 1.0, 12.5, 14.6, 0.16, 6)
      archPanel(win, f, 2, 0.9, 18.6, 20.1, 0.12, 6)
      archPanel(win, f, 2, 0.8, 7.2, 8.4, 0.12, 6)
    }
    // Pilasters on the apse between the windows.
    for (const a of [-1.2, -0.6, 0, 0.6, 1.2]) {
      const tx = -Math.sin(a), ty = Math.cos(a)
      const f: Face = { a: [cx + r * Math.cos(a) - tx * 0.6, cy + r * Math.sin(a) - ty * 0.6], b: [cx + r * Math.cos(a) + tx * 0.6, cy + r * Math.sin(a) + ty * 0.6] }
      proud(dress, f, 0, 1.2, 0, ZW - 0.5, -0.1, 0.4)
    }
  }

  // ===== Corner turrets ====================================================
  const ZT = 34.5
  const cupola = (cx: number, cy: number, z0: number, rb: number, ogee: boolean) => {
    // Corbel ring and the cupola itself.
    lathe(dress, [[rb + 0.25, z0 - 0.5], [rb + 0.25, z0]], 12, cx, cy, true)
    const prof: [number, number][] = ogee
      ? [[rb, z0], [rb * 1.05, z0 + 0.6], [rb * 0.92, z0 + 1.45], [rb * 0.58, z0 + 2.3], [rb * 0.28, z0 + 2.9], [rb * 0.14, z0 + 3.4]]
      : [[rb, z0], [rb * 0.97, z0 + 0.9], [rb * 0.82, z0 + 1.9], [rb * 0.55, z0 + 2.7], [rb * 0.2, z0 + 3.2]]
    lathe(lead, prof, 12, cx, cy, true)
    const zt = prof[prof.length - 1][1]
    // Ball finial, then the gilded vane: rod, pennant, crown.
    // A small open-sided lantern (posts round a core) under the ball finial.
    lathe(lead, [[0.42, zt - 0.05], [0.42, zt + 0.1]], 8, cx, cy, true)
    for (let k = 0; k < 4; k++) { const a = k * Math.PI / 2 + Math.PI / 4; tube(lead, [[cx + 0.33 * Math.cos(a), cy + 0.33 * Math.sin(a), zt + 0.1], [cx + 0.33 * Math.cos(a), cy + 0.33 * Math.sin(a), zt + 0.75]], [0.07, 0.07], 4) }
    lathe(lead, [[0.15, zt + 0.1], [0.15, zt + 0.75]], 6, cx, cy, false)
    lathe(lead, [[0.48, zt + 0.75], [0.3, zt + 1.0], [0.05, zt + 1.15]], 8, cx, cy, false)
    const zv = zt + 0.9
    ellipsoid(lead, [cx, cy, zv + 0.35], [0.3, 0.3, 0.3], 8, 4)
    tube(gilt, [[cx, cy, zv + 0.6], [cx, cy, zv + 2.9]], [0.12, 0.09], 5)
    slab(gilt, [cx + 0.55, cy, zv + 2.0], [1, 0, 0], [0, 0, 1], [[-0.55, -0.35], [0.55, -0.3], [0.55, 0.3], [-0.55, 0.35]], 0.08)
    ellipsoid(gilt, [cx, cy, zv + 3.0], [0.25, 0.25, 0.22], 6, 3)
    // A cross-arm (the vane's compass points).
    tube(gilt, [[cx - 0.6, cy, zv + 1.3], [cx + 0.6, cy, zv + 1.3]], [0.07, 0.07], 4)
    tube(gilt, [[cx, cy - 0.6, zv + 1.3], [cx, cy + 0.6, zv + 1.3]], [0.07, 0.07], 4)
  }
  for (const [x0, y0, x1, y1] of [[-16.8, 13.5, -11.8, 18.5], [-16.9, -18.3, -11.9, -13.3], [11.1, -17.5, 15.5, -13.1]] as [number, number, number, number][]) {
    box(rag, x0, y0, x1, y1, 0, ZT)
    // White quoins at the turret's corners, up its full height.
    for (const [qx, qy] of [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]) {
      const sx = qx === x0 ? 1 : -1, sy = qy === y0 ? 1 : -1
      box(dress, sx > 0 ? qx - 0.08 : qx - 0.7, sy > 0 ? qy - 0.08 : qy - 0.7, sx > 0 ? qx + 0.7 : qx + 0.08, sy > 0 ? qy + 0.7 : qy + 0.08, 0, ZT)
    }
    // Small arched windows on the turret's stage above the battlements.
    const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2
    for (const f of [{ a: [x0, y0], b: [x1, y0] }, { a: [x1, y0], b: [x1, y1] }, { a: [x1, y1], b: [x0, y1] }, { a: [x0, y1], b: [x0, y0] }] as Face[])
      { archPanel(win, f, faceLen(f) / 2, 0.8, 30.8, 32.2, 0.06, 6); archPanel(win, f, faceLen(f) / 2, 0.7, 19.2, 20.4, 0.06, 6) }
    cupola(cx, cy, ZT, 1.65, true)
  }
  // The round NE turret.
  {
    const cx = 13.1, cy = 17.0, r = 3.5, ZR = 31.6
    lathe(rag, [[r, 0], [r, ZR]], 16, cx, cy, false)
    lathe(dress, [[r + 0.25, ZW - 0.5], [r + 0.25, ZW]], 16, cx, cy, false)
    for (const a of [0.0, 0.8, 1.6, 2.4, -0.8]) {
      const tx = -Math.sin(a), ty = Math.cos(a)
      const f: Face = { a: [cx + r * Math.cos(a) - tx * 0.6, cy + r * Math.sin(a) - ty * 0.6], b: [cx + r * Math.cos(a) + tx * 0.6, cy + r * Math.sin(a) + ty * 0.6] }
      archPanel(win, f, 0.6, 0.8, 27.2, 28.8, 0.08, 6)
      archPanel(win, f, 0.6, 0.8, 19.0, 20.6, 0.08, 6)
    }
    cupola(cx, cy, ZR, 3.1, false)
  }

  // ===== Write ============================================================
  const flood = (p: V3, n: V3) => (n[2] > 0.9 ? 0.2 : Math.min(1, 0.45 + p[2] / 40))
  writeModel('White Tower', 'london-white-tower', [
    { part: rag, material: { ...finish('ragstone', 0xc6bfaf), floodlight: flood } },
    { part: dress, material: { ...finish('caen-stone', 0xf1ede3), floodlight: flood } },
    { part: lead, material: finish('lead', 0x9aa1a8) },
    { part: win, material: PALETTE.window },
    { part: gilt, material: finish('vane-gilt', 0xd9ae48, 0.45) },
  ], { bearing: BEARING, osm: 'way/369135772', height: 42.0 }, 5000)
}

void TAU
if (import.meta.main) build()
