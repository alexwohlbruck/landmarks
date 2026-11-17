/**
 * Zeitz MOCAA (Museum of Contemporary Art Africa) and The Silo Hotel, in the
 * 1924 Grain Silo, V&A Waterfront, Cape Town — procedural, CC0-1.0.
 * bun generators/cpt-zeitz-mocaa.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the centroid of OSM's
 * outline. Built square to the building and placed at bearing 354.2°.
 *
 * The 1921–24 grain elevator, converted by Heatherwick Studio (2017): a
 * 57 m board-marked concrete elevator tower at the west end, and east of it
 * the long block of 6 × 8 concrete silo tubes, about 28 m tall, under a
 * storey-high gallery. The tower's upper floors (The Silo Hotel) and the
 * gallery over the tubes are glazed with bulging, faceted "pillowed" glass
 * panels set in a deep concrete frame, the conversion's signature; the top
 * storey of the tower is an open frame round a roof terrace.
 *
 * Identity, in order: the tall pale-concrete tower with its grid of blue
 * pillowed windows over a blank base; the open frame at its top; the low
 * block of round tubes with its band of pillowed windows; the contrast of
 * the two heights.
 *
 * The pillows are drawn as flush faceted window panels (STYLE.md: special
 * windows are flush shapes): each bulges from the recessed glass plane to a
 * low faceted point that stays inside the frame's face. Bays: the long
 * (west and east) faces of the tower have 8 bays, three pillowed, two
 * recessed balcony bays, three pillowed; the short (north, south) faces 4,
 * pillowed at the ends and recessed in the middle, as in the photos.
 *
 * Evidence
 *  - OSM way/36852808 (building=yes, building:levels=6, name Zeitz MOCAA,
 *    wikidata Q28003638): in the turned frame a clean rectangle 61.3 m
 *    (x) by 32.8 m (y), whose west 17.4 m runs 3.8 m further south (36.7 m
 *    deep). That west part is the tower; the rest is the tube block. No
 *    building:part ways. Anchor = the outline's area centroid; replaces it
 *    only. The small annex in front of the tower's north face
 *    (way/1302850546) is a separate building and is left to the map.
 *  - Published: 57 m tall (Wikipedia, "Zeitz Museum of Contemporary Art
 *    Africa"; also Heatherwick Studio); 42 tubes; nine museum floors and a
 *    six-floor hotel above.
 *  - Measured from OSM: tower 17.4 × 36.7 m, tube block 43.9 × 32.8 m, so
 *    8 × 6 tubes of 5.48 m. The ratio of the tower's north face to the tube
 *    block's north face in the 1920s Linton photo (0.39) matches OSM's
 *    (0.40), which confirms the tower is the west part.
 *  - Estimated from photos (Linton, level and distant; Blume's telephoto
 *    from across the basin): tube tops 28.5 m and the gallery over them to 34.5 m
 *    (Linton: 0.50 and 0.60 of the tower's height); tower glazing from
 *    21.5 m, five pillowed storeys of 5.9 m and an open 6 m top storey
 *    (Blume: six rows of ~118 px against the 36.7 m west face,
 *    allowing for its 29° turn); frame piers
 *    0.8 m, recess 0.9 m.
 *  - Colours: warm grey-brown weathered board-marked concrete (Rabich,
 *    Blume), pulled only a little light; the pillowed glass a dark,
 *    reflective slate grey-blue as it reads from a distance (its bright
 *    blue reflections only show close up); the recessed balconies darker
 *    still.
 *  - No terrain: tools/terrain.ts 404s here (no Mapterhorn z15 tiles). The
 *    site is flat reclaimed quay; elevation 0. No lidar or NAIP in South
 *    Africa.
 *
 * Photos (EVIDENCE):
 *  - Cape Town (ZA), Waterfront, Zeitz Museum of Contemporary Art Africa --
 *    2024 -- 2980.jpg, Dietmar Rabich, CC BY-SA 4.0,
 *    https://commons.wikimedia.org/wiki/File:Cape_Town_(ZA),_Waterfront,_Zeitz_Museum_of_Contemporary_Art_Africa_--_2024_--_2980.jpg
 *  - Zeitz Museum of Contemporary Art Africa, Cape Town ( 1050775).jpg,
 *    Matti Blume, CC BY-SA 4.0 (west and north faces, telephoto),
 *    https://commons.wikimedia.org/wiki/File:Zeitz_Museum_of_Contemporary_Art_Africa,_Cape_Town_(_1050775).jpg
 *  - Zeitz Museum of Contemporary Art Africa.jpg, Axxter99, CC BY-SA 4.0,
 *    https://commons.wikimedia.org/wiki/File:Zeitz_Museum_of_Contemporary_Art_Africa.jpg
 *  - Exterior Zeitz MOCAA - Museum of Contermporary Art Africa.jpg, Michael
 *    Rowe, CC BY-SA 4.0 (south side of the tube block),
 *    https://commons.wikimedia.org/wiki/File:Exterior_Zeitz_MOCAA_-_Museum_of_Contermporary_Art_Africa.jpg
 *  - At Cape Town (MP) 2018 115.jpg, Mike Peel, CC BY-SA 4.0,
 *    https://commons.wikimedia.org/wiki/File:At_Cape_Town_(MP)_2018_115.jpg
 *  - Silos on the waterfront, Cape Town.jpg (1920s lantern slide), Linton,
 *    public domain,
 *    https://commons.wikimedia.org/wiki/File:Silos_on_the_waterfront,_Cape_Town.jpg
 *  - V&A Grain Silo 1.jpg, HelenOnline, CC BY-SA 3.0 (before conversion;
 *    window rows),
 *    https://commons.wikimedia.org/wiki/File:V%26A_Grain_Silo_1.jpg
 * Look-only references: none used. No commercial imagery.
 *
 * Doubts: no licensed photo shows the south or east sides, or the roof;
 * they are drawn like the north and west. The tube block's gallery is
 * assumed to have one pillowed window per tube on every side. The rooftop
 * plant and terrace pavilions inside the tower's top frame are two plain
 * blocks. The glazed entrance slots at the foot of the tubes are left out.
 * Heights other than the 57 m total are photo estimates (no lidar here).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { cap, inset, rect, save, walls, type XY } from './chi-aon-center'
import { along, cube, face } from './phl-independence-hall'

// Footprint in the turned frame (from OSM, see header).
const TW = -29.94, TE = -12.55, TS = -19.67, TN = 16.95   // tower
const BE = 31.37, BS = -15.85, BN = 16.95                  // tube block (west edge = TE)
const H = 57
const REC = 0.9, PIER = 0.8
const STOREYS = [21.5, 27.4, 33.3, 39.2, 45.1, 51.0]       // storey bottoms; 51 is the roof terrace
const SPAN = 0.6                                           // spandrel depth
const TUBE_TOP = 28.5, BAND_TOP = 34.5, BREC = 0.7

const conc = new Part(), pillow = new Part(), dark = new Part(), roof = new Part()

/** A ring band from ring r (outer) to ring i (inner) between z0 and z1: outer walls, inner walls, top and bottom. */
function ringBand(r: XY[], i: XY[], z0: number, z1: number, inner = true, bottom = true) {
  walls(conc, r, z0, z1)
  if (inner) walls(conc, [...i].reverse(), z0, z1)
  for (let k = 0; k < r.length; k++) {
    const j = (k + 1) % r.length
    conc.quad([i[k][0], i[k][1], z1], [r[k][0], r[k][1], z1], [r[j][0], r[j][1], z1], [i[j][0], i[j][1], z1])
    if (bottom) conc.quad([i[j][0], i[j][1], z0], [r[j][0], r[j][1], z0], [r[k][0], r[k][1], z0], [i[k][0], i[k][1], z0])
  }
}

/**
 * A pillowed window in the cell s0..s1, z0..z1 of wall a→b, its edge on the
 * recessed glass plane (`back` behind the wall's face) and bulging to a low
 * faceted point `bulge` in front of that plane.
 */
function pillowOn(a: XY, b: XY, s0: number, s1: number, z0: number, z1: number, back: number, bulge: number) {
  const { P, n } = along(a, b)
  const N: V3 = [n[0], n[1], 0]
  const sc = (s0 + s1) / 2, zc = (z0 + z1) / 2, hs = (s1 - s0) / 2, hz = (z1 - z0) / 2
  const o = -back + 0.02
  // The cell's edge: corners and mid-points.
  const edge: [number, number][] = [[-1, -1], [0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0]]
  // The facet ring: a diamond-cut octagon, most of the way out.
  const ring: [number, number][] = [[-0.5, -0.62], [0, -0.78], [0.5, -0.62], [0.78, 0], [0.5, 0.62], [0, 0.78], [-0.5, 0.62], [-0.78, 0]]
  const E = edge.map(([u, v]) => P(sc + u * hs, zc + v * hz, o))
  const F = ring.map(([u, v]) => P(sc + u * hs, zc + v * hz, o + bulge * 0.72))
  const C = P(sc, zc, o + bulge)
  for (let k = 0; k < 8; k++) {
    const j = (k + 1) % 8
    face(pillow, [E[k], E[j], F[j]], N)
    face(pillow, [E[k], F[j], F[k]], N)
    face(pillow, [F[k], F[j], C], N)
  }
}

function build() {
  // --- Tower ----------------------------------------------------------------
  const tower = rect(TW, TS, TE, TN)
  const core = inset(tower, REC)
  const top0 = STOREYS[0] + SPAN
  // The blank base, up to the first spandrel's top.
  walls(conc, tower, 0, top0)
  // The recessed glazing plane (the hotel's core) up to the terrace.
  walls(conc, core, top0, STOREYS[5])
  // Spandrels at each storey line above the base, and the terrace slab.
  for (const z of STOREYS.slice(1)) ringBand(tower, core, z, z + SPAN, z === STOREYS[5], true)
  cap(conc, inset(tower, 0.01), top0) // ledge under the recess (seen between piers)
  // Top beam of the open frame.
  ringBand(tower, core, H - 0.7, H, true, true)
  // The roof terrace and two plant/pavilion blocks inside the top frame.
  cap(roof, core, STOREYS[5] + SPAN)
  cube(roof, TW + 4.5, TS + 6, TE - 4.5, TS + 15, STOREYS[5] + SPAN, 55.2)
  cube(roof, TW + 4.5, TN - 14, TE - 4.5, TN - 6, STOREYS[5] + SPAN, 54.6)
  // Board-marked pilasters on the base, at the bay lines (not on the east
  // face, which the tube block covers).
  const faces: { a: XY; b: XY; n: number; base: boolean }[] = [
    { a: [TW, TS], b: [TE, TS], n: 4, base: true },    // south
    { a: [TE, TS], b: [TE, TN], n: 8, base: false },   // east
    { a: [TE, TN], b: [TW, TN], n: 4, base: true },    // north
    { a: [TW, TN], b: [TW, TS], n: 8, base: true },    // west
  ]
  for (const f of faces) {
    const { L, P, n } = along(f.a, f.b)
    const N: V3 = [n[0], n[1], 0]
    const pitch = L / f.n
    for (let k = 0; k <= f.n; k++) {
      const s = k * pitch
      const s0 = Math.max(0, s - PIER / 2), s1 = Math.min(L, s + PIER / 2)
      const corner = k === 0 || k === f.n
      // Frame pier, from the base's top to the top beam, as deep as the recess.
      if (!corner || k === 0) {
        const q = corner ? [P(0, 0, 0), P(PIER, 0, 0), P(PIER, 0, -REC), P(0, 0, -REC)] : [P(s0, 0, 0), P(s1, 0, 0), P(s1, 0, -REC), P(s0, 0, -REC)]
        const ring = q.map(([x, y]) => [x, y] as XY)
        // ring winding: make it counter-clockwise
        const ar = ring.reduce((t, c, i) => { const d = ring[(i + 1) % 4]; return t + c[0] * d[1] - d[0] * c[1] }, 0)
        const rr = ar < 0 ? [...ring].reverse() : ring
        walls(conc, rr, top0, H - 0.7)
      }
      if (f.base && !corner) {
        face(conc, [P(s0, 0, 0.22), P(s1, 0, 0.22), P(s1, top0, 0.22), P(s0, top0, 0.22)], N)
        face(conc, [P(s0, 0, 0), P(s0, 0, 0.22), P(s0, top0, 0.22), P(s0, top0, 0)], [-along(f.a, f.b).u[0], -along(f.a, f.b).u[1], 0])
        face(conc, [P(s1, 0, 0.22), P(s1, 0, 0), P(s1, top0, 0), P(s1, top0, 0.22)], [along(f.a, f.b).u[0], along(f.a, f.b).u[1], 0])
        face(conc, [P(s0, top0, 0), P(s0, top0, 0.22), P(s1, top0, 0.22), P(s1, top0, 0)], [0, 0, 1])
      }
    }
    // Windows: pillowed or recessed balcony, per bay and storey.
    const recessed = f.n === 4 ? [1, 2] : [3, 4]
    for (let st = 0; st < 5; st++) {
      const z0 = STOREYS[st] + SPAN, z1 = STOREYS[st + 1]
      if (!f.base && z1 < BAND_TOP + 1) continue // east face: hidden by the tube block's gallery
      for (let k = 0; k < f.n; k++) {
        const s0 = Math.max(k * pitch + PIER / 2, PIER), s1 = Math.min((k + 1) * pitch - PIER / 2, L - REC)
        if (recessed.includes(k)) {
          const { P: Q } = along(f.a, f.b)
          face(dark, [Q(s0, z0, -REC + 0.02), Q(s1, z0, -REC + 0.02), Q(s1, z1, -REC + 0.02), Q(s0, z1, -REC + 0.02)], N)
        } else pillowOn(f.a, f.b, s0, s1, z0, z1, REC, 0.88)
      }
    }
  }
  // Fill the tower's recess where the tube block's gallery meets its east face.
  cube(conc, TE - REC, BS, TE, BN, top0, BAND_TOP)

  // --- Tube block -------------------------------------------------------------
  const NX = 8, NY = 6
  const px = (BE - TE) / NX, py = (BN - BS) / NY, r = Math.min(px, py) / 2
  const cx = (i: number) => TE + px / 2 + i * px, cy = (j: number) => BS + py / 2 + j * py
  // The core between the outer tubes.
  const coreB: XY[] = rect(TE, cy(0), cx(NX - 1), cy(NY - 1))
  walls(conc, coreB, 0, TUBE_TOP)
  /** One tube's outward arc a0..a1 from the ground to the gallery. */
  const tube = (x: number, y: number, a0: number, a1: number) => {
    const seg = Math.round(((a1 - a0) / Math.PI) * 8)
    for (let k = 0; k < seg; k++) {
      const t0 = a0 + ((a1 - a0) * k) / seg, t1 = a0 + ((a1 - a0) * (k + 1)) / seg
      const A: XY = [x + r * Math.cos(t0), y + r * Math.sin(t0)], B: XY = [x + r * Math.cos(t1), y + r * Math.sin(t1)]
      const nA: V3 = [Math.cos(t0), Math.sin(t0), 0], nB: V3 = [Math.cos(t1), Math.sin(t1), 0]
      conc.tri([A[0], A[1], 0], [B[0], B[1], 0], [B[0], B[1], TUBE_TOP], undefined, undefined, undefined, [nA, nB, nB])
      conc.tri([A[0], A[1], 0], [B[0], B[1], TUBE_TOP], [A[0], A[1], TUBE_TOP], undefined, undefined, undefined, [nA, nB, nA])
    }
  }
  for (let i = 0; i < NX; i++) {
    const last = i === NX - 1
    tube(cx(i), cy(NY - 1), 0, last ? Math.PI : Math.PI)          // north row
    tube(cx(i), cy(0), -Math.PI, 0)                                // south row
    if (last) {
      tube(cx(i), cy(NY - 1), -Math.PI / 2, 0)                     // north-east corner, east quarter
      tube(cx(i), cy(0), 0, Math.PI / 2)                           // south-east corner, east quarter
    }
  }
  for (let j = 1; j < NY - 1; j++) tube(cx(NX - 1), cy(j), -Math.PI / 2, Math.PI / 2) // east row

  // The gallery over the tubes: a concrete frame round a band of pillowed
  // windows, one per tube, its face on the tubes' outer tangent.
  const block = rect(TE, BS, BE, BN)
  const bcore = inset(block, BREC)
  // underside, seen in the valleys between tubes
  cap(conc, block, TUBE_TOP, false)
  walls(conc, bcore, TUBE_TOP, BAND_TOP)
  ringBand(block, bcore, TUBE_TOP, TUBE_TOP + SPAN, false, false)
  ringBand(block, bcore, BAND_TOP - 0.7, BAND_TOP, false, false)
  cap(roof, bcore, BAND_TOP - 0.02)
  const bfaces: { a: XY; b: XY; n: number }[] = [
    { a: [TE, BS], b: [BE, BS], n: NX },   // south
    { a: [BE, BS], b: [BE, BN], n: NY },   // east
    { a: [BE, BN], b: [TE, BN], n: NX },   // north
  ]
  const z0 = TUBE_TOP + SPAN, z1 = BAND_TOP - 0.7
  for (const f of bfaces) {
    const { L, P } = along(f.a, f.b)
    const pitch = L / f.n
    for (let k = 0; k <= f.n; k++) {
      const s = k * pitch
      if (k === 0 && f.a[0] === TE) continue // against the tower
      const s0 = Math.max(0, s - 0.35), s1 = Math.min(L, s + 0.35)
      const ring = [P(s0, 0, 0), P(s1, 0, 0), P(s1, 0, -BREC), P(s0, 0, -BREC)].map(([x, y]) => [x, y] as XY)
      const ar = ring.reduce((t, c, i) => { const d = ring[(i + 1) % 4]; return t + c[0] * d[1] - d[0] * c[1] }, 0)
      walls(conc, ar < 0 ? [...ring].reverse() : ring, z0, z1)
    }
    for (let k = 0; k < f.n; k++) pillowOn(f.a, f.b, k * pitch + 0.35, (k + 1) * pitch - 0.35, z0, z1, BREC, 0.68)
  }

  return [
    { part: conc, material: finish('silo-concrete', 0xc4b8a6) },
    { part: pillow, material: { name: 'window', color: 0x5f7184, roughness: 0.3 } },
    { part: dark, material: windowVariant(2, 0x434c56) },
    { part: roof, material: PALETTE.roof },
  ]
}

if (import.meta.main) await save('cpt-zeitz-mocaa', 'Zeitz MOCAA', [18.422994, -33.9084045], 354.2, build())
