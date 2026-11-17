/**
 * Cape Town Stadium (DHL Stadium since 2021; gmp Architekten with Louis
 * Karol and Point Architects, roof by schlaich bergermann partner, opened
 * December 2009), Green Point, Cape Town: original procedural geometry,
 * CC0-1.0.
 * bun generators/cpt-cape-town-stadium.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = area centroid of the outer way of OSM relation/8706182
 * (building=stadium, height 48; outer way/626140250, inner way/626138763),
 * lng 18.4111472, lat -33.9034476. Bearing 12.3: the OSM pitch
 * (way/44948355, 105.6 x 68.1 m, long sides at 12.3 deg), so model +y runs
 * along the pitch (north-north-east) and +x across it.
 *
 * Identity, in order: the silver membrane drum, tucked in at its foot and
 * flaring out to the rim like a cup, banded horizontally; the white rim
 * with its gentle saddle (high over the long sides, low over the ends); the
 * pale fritted-glass roof ring with the band of clear glass round the oval
 * opening; the stands seen through it; the grey podium (plateau) with the
 * colonnade of parking openings along its south-west edge and the broad
 * flights of steps up to it.
 *
 * Evidence
 *  - Plan: the OSM outer way is an ellipse to within a metre, half-axes
 *    130.5 (x) by 140.7 (y) in this frame; drawn as the roof rim (published
 *    290 x 265-270 m, gmp / DHL Stadium fact sheet). The OSM inner way
 *    (rounded rectangle, superellipse 3.2, half 46.6 x 73.7) is the hole in
 *    the building at ground level, i.e. the arena floor round the pitch: it
 *    is drawn as the low wall at the front of the stands.
 *  - The roof opening is NOT the OSM inner way: in four licensed aerial
 *    obliques (p10, p11, p12, p6 below) the dark opening spans 0.46-0.47 of
 *    the roof's width and the clear-glass ring 0.59-0.60, so the opening is
 *    estimated at half 58 x 82.5 (superellipse 3.0) and the clear ring
 *    16 m wide (published: "the inner, 16 m wide ring consists of clear
 *    glass", e-architect / gmp project text). The long half-axis (82.5) is
 *    the weakest number here: the photos look across it.
 *  - Heights: published 48 m (e-architect/gmp; OSM height=48) and 50 m (DHL
 *    Stadium "Fast Facts", Oct 2021). Rim drawn at 50 m over the long sides
 *    and 43 m over the ends: the saddle ("saddle-shaped suspension roof",
 *    "undulating silhouette") with its dip estimated at ~7 m from the level
 *    photos from the sea (q10, p9, p2), where the end rims sit lower and the
 *    roof shows over them. The roof's inner (tension) ring 7-9 m below the
 *    rim, estimated from the aerials, where the roof falls to the opening.
 *  - Facade: "horizontally profiled membrane", silver-coated glass fabric
 *    (e-architect). Its foot tucked in 13 m under the rim with the flare in
 *    the upper half: estimated from the level end views (p9, q10) and the
 *    podium photo q8. Seven bands, each with a 0.9 m ledge, stand for the
 *    profiling (the real one has many more, finer).
 *  - Podium: "an elevated plateau ... broad ramps and steps on three sides
 *    lead up to it; parking, goods delivery and emergency access beneath"
 *    (e-architect); "Podium perimeter 1 336 m" (fact sheet; the drawn
 *    outline is ~1 030 m, so the real one reaches further than drawn). Not
 *    mapped in OSM as a structure. Shape ESTIMATED: a rounded plateau at a
 *    steady 28 m outside the roof rim (an ellipse, half 158.5 x 168.7),
 *    the offset taken from p10 and p11 on the south-west and west and
 *    assumed the same round the rest (the real outline has straight edges
 *    and reaches further west; simplified on review). Kept where photos
 *    and OSM agree: the broad south stair (OSM steps, ways
 *    422410103-422410123; p10), drawn 30 m deep between compass 169 and
 *    194 deg, and the colonnade of parking openings on the south-west and
 *    west edge (p10), compass 201 to 277 deg. Deck height 6 m: estimated
 *    from the colonnade in p10 against the facade (the lower tier rises
 *    from the pitch, Level 00, to the podium concourse, Level 02).
 *  - Elevation 0: "due to the rocky subsoil, the pitch and bottom tier could
 *    not be sunk into the ground" (e-architect / gmp project text). The pitch
 *    is at the park's level; the podium stands on it.
 *  - Photos (Wikimedia Commons, all EVIDENCE):
 *    - p10 Pavel Spindler, "Kapske mesto, fotbalovy stadion - Jihoafricka
 *      republika - panoramio.jpg", CC BY 3.0 — from Signal Hill (south-west):
 *      the main proportion check, podium, colonnade, steps.
 *      https://commons.wikimedia.org/wiki/File:Kapsk%C3%A9_m%C4%9Bsto,_fotbalov%C3%BD_stadion_-_Jihoafrick%C3%A1_republika_-_panoramio.jpg
 *    - p6 Nicolearends16, "Cape Town Stadium - South Africa.jpg", CC BY-SA
 *      3.0 — higher view from Signal Hill.
 *      https://commons.wikimedia.org/wiki/File:Cape_Town_Stadium_-_South_Africa.jpg
 *    - p11 Harvey Barrison, "Cape Town 2012 05 15 0175 (7365148808).jpg",
 *      CC BY-SA 2.0 — from Table Mountain (south): opening width.
 *      https://commons.wikimedia.org/wiki/File:Cape_Town_2012_05_15_0175_(7365148808).jpg
 *    - p12 landagent, "Cape Town stadium - panoramio (1).jpg", CC BY-SA 3.0
 *      — dusk, from Signal Hill: roof rings, facade banding.
 *      https://commons.wikimedia.org/wiki/File:Cape_Town_stadium_-_panoramio_(1).jpg
 *    - p9 Hendrik van den Berg, "New stadium - panoramio.jpg", CC BY 3.0 —
 *      level, from Table Bay (north-east): saddle, flare.
 *      https://commons.wikimedia.org/wiki/File:New_stadium_-_panoramio.jpg
 *    - p2 Winstonza, "Cape Town Stadium wza2.jpg", CC BY-SA 3.0 — level,
 *      from the sea (north). https://commons.wikimedia.org/wiki/File:Cape_Town_Stadium_wza2.jpg
 *    - q10 Azwi, "Green Point Stadiun - panoramio.jpg", CC BY-SA 3.0 —
 *      sunset silhouette from the east: saddle.
 *      https://commons.wikimedia.org/wiki/File:Green_Point_Stadiun_-_panoramio.jpg
 *    - q2 Dennis Sylvester Hurd, "Green Point Park to V&A (54277163098).jpg",
 *      CC BY 2.0 — street level: membrane, dark base band, rim.
 *      https://commons.wikimedia.org/wiki/File:Green_Point_Park_to_V%26A_(54277163098).jpg
 *    - q8 Nkansahrexford, "Table Mountain from Cape Town Stadium.jpg",
 *      CC BY-SA 4.0 — on the podium: the facade's curve at its foot.
 *      https://commons.wikimedia.org/wiki/File:Table_Mountain_from_Cape_Town_Stadium.jpg
 *    - p3 Deklerk Basson, "Cape Town Stadium, Cape Town, South Africa
 *      (Unsplash).jpg", CC0 — inside: tiers, roof edge.
 *      https://commons.wikimedia.org/wiki/File:Cape_Town_Stadium,_Cape_Town,_South_Africa_(Unsplash).jpg
 *  - Published: e-architect.com "Green Point Stadium" (gmp project data);
 *    structurae.net "Cape Town Stadium" (290 x 265 m); DHL Stadium "Fast
 *    Facts" PDF, 3 Oct 2021 (stormers.co.za): height 50 m, roof 37 000-
 *    40 000 m2 of white-fritted laminated glass, white compression ring.
 *  No look-only sources were relied on. No commercial imagery. No lidar or
 *  NAIP (none in South Africa); the map's terrain tool (Mapterhorn z15)
 *  404s here, so the terrain check could not run; Green Point Common is flat.
 *
 * Invented or simplified: the stands are three plain surfaces (lower tier,
 * box band, upper tier) drawn only for the view through the opening; the
 * roof's ceiling is a single sheet; the facade's diamond panels and steel
 * arcs are left out; the colonnade has 18 openings (count estimated); the
 * podium's shape is a steady offset (estimated), its other steps and ramps
 * are left out. Colours: membrane, roof and rim from p10 and
 * q2, pulled to the palette: roof a pale cool grey (#d6dfe3), the
 * clear ring grey-blue, the podium pale concrete (#c9c6bf). Night: the membrane and the white rings carry
 * _FLOODLIGHT (the membrane is lit from the podium); no licensed night photo
 * of the finished stadium was found to check it against.
 * Doubts: the opening's long axis; the saddle's depth; the podium's height
 * and its northern and eastern extent; the clear ring is drawn darker than
 * the fritted roof (it reads darker from low angles, lighter from high
 * ones).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { save } from './chi-aon-center'
import { face } from './phl-independence-hall'

const nrm3 = (a: V3): V3 => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l] }
const crs = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]

/**
 * A smooth-shaded strip between two closed rings of the same length (one
 * vertex per angle), its normals turned to agree with `hint` at each vertex.
 */
function strip(p: Part, r0: V3[], r1: V3[], hint: (q: V3) => V3) {
  const n = r0.length
  const nv = (k: number, r: V3[]): V3 => {
    const a = r[(k - 1 + n) % n], b = r[(k + 1) % n]
    const T: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]]
    const U: V3 = [r1[k][0] - r0[k][0], r1[k][1] - r0[k][1], r1[k][2] - r0[k][2]]
    let m = nrm3(crs(T, U))
    if (dot(m, hint(r[k])) < 0) m = [-m[0], -m[1], -m[2]]
    return m
  }
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    const a = r0[i], b = r0[j], c = r1[j], d = r1[i]
    const na = nv(i, r0), nb = nv(j, r0), nc = nv(j, r1), nd = nv(i, r1)
    p.tri(a, b, c, undefined, undefined, undefined, [na, nb, nc])
    p.tri(a, c, d, undefined, undefined, undefined, [na, nc, nd])
  }
}
const OUT = (q: V3): V3 => [q[0], q[1], 0]
const IN = (q: V3): V3 => [-q[0], -q[1], 0]
const UP = (): V3 => [0, 0, 1]
const DOWN = (): V3 => [0, 0, -1]

// ---------------------------------------------------------------------------
// Plan, in the model frame (bearing 12.3: +y along the pitch, +x across it).

const N = 64
const PHI = Array.from({ length: N }, (_, k) => (k / N) * 2 * Math.PI)
/** Polar radius of a superellipse with half-axes a (x), b (y), exponent e. */
const se = (phi: number, a: number, b: number, e: number) =>
  Math.pow(Math.pow(Math.abs(Math.cos(phi) / a), e) + Math.pow(Math.abs(Math.sin(phi) / b), e), -1 / e)

const A = 130.5, B = 140.7 // roof rim: the OSM outline, an ellipse (fits to < 1 m)
const RO = (phi: number) => se(phi, A, B, 2)
const RI = (phi: number) => se(phi, 58, 82.5, 3.0) // roof opening: from the photos (see header)
const RF = (phi: number) => se(phi, 46.6, 73.7, 3.2) // arena floor: the OSM inner way
/** Rim height: a saddle, high over the long sides (x), low over the ends (y). */
const H = (phi: number) => 43 + 7 * Math.cos(phi) ** 2
/** Height of the roof's inner edge (the tension ring). */
const HI = (phi: number) => H(phi) - 7 - 0.3 * (H(phi) - 43)

const Z_POD = 6 // podium (plateau) deck
const Z_LOBBY = 9.5 // top of the recessed glazed base under the membrane
const FLARE = 13 // how far the membrane's foot is tucked in under the rim

const at = (phi: number, r: number, z: number): V3 => [r * Math.cos(phi), r * Math.sin(phi), z]
const ring = (r: (phi: number) => number, z: (phi: number) => number): V3[] => PHI.map((f) => at(f, r(f), z(f)))

const BEARING = 12.3
/** The podium: a rounded plateau at a steady offset outside the roof rim.
 * The offset (28 m) is estimated from p10 and p11 on the south-west and
 * west; the same offset is assumed round the rest. */
const POD_OFF = 28
const RP = (phi: number) => RO(phi) + POD_OFF
const deg = (d: number) => (d * Math.PI) / 180
/** Model polar angle (from +x, counter-clockwise) of a compass bearing. */
const polar = (compass: number) => deg(90 - (compass - BEARING))

function build() {
  const membrane = new Part(), roofGlass = new Part(), clearGlass = new Part(), white = new Part(), dark = new Part(), podium = new Part()

  // --- The membrane facade: seven horizontal bands, each leaning out a
  // little more than the flare so its foot sits back behind a ledge, the
  // "horizontally profiled membrane" that reads as bands from the side.
  const zTop = (f: number) => H(f) - 2.4
  const rFace = (f: number, s: number) => RO(f) - 0.8 - FLARE * (1 - Math.pow(s, 2.2))
  const zFace = (f: number, s: number) => Z_LOBBY + (zTop(f) - Z_LOBBY) * s
  const NB = 7, LEDGE = 0.9
  for (let k = 0; k < NB; k++) {
    const s0 = k / NB, s1 = (k + 1) / NB
    const foot = ring((f) => rFace(f, s0) - (k ? LEDGE : 0), (f) => zFace(f, s0))
    const head = ring((f) => rFace(f, s1), (f) => zFace(f, s1))
    strip(membrane, foot, head, OUT)
    if (k) strip(membrane, ring((f) => rFace(f, s0), (f) => zFace(f, s0)), foot, UP)
  }

  // --- The recessed glazed base on the podium, and its soffit.
  const rLobby = (f: number) => rFace(f, 0) - 2.5
  strip(dark, ring(rLobby, () => Z_POD), ring(rLobby, () => Z_LOBBY), OUT)
  strip(dark, ring(rLobby, () => Z_LOBBY), ring((f) => rFace(f, 0), () => Z_LOBBY), DOWN)

  // --- The white rim (the compression ring's cladding): soffit, face, lip.
  strip(white, ring((f) => RO(f) - 0.8, zTop), ring(RO, zTop), DOWN)
  strip(white, ring(RO, zTop), ring(RO, (f) => H(f) + 0.3), OUT)
  strip(white, ring(RO, (f) => H(f) + 0.3), ring((f) => RO(f) - 1.8, (f) => H(f) + 0.3), UP)

  // --- The roof: white-fritted glass from the rim in to the 16 m ring of
  // clear glass round the opening, falling gently to the tension ring.
  const rRoof = (f: number, t: number) => RI(f) + (RO(f) - 1.8 - RI(f)) * t
  const zRoof = (f: number, t: number) => HI(f) + (H(f) + 0.3 - HI(f)) * (1 - Math.pow(1 - t, 1.4))
  const tClear = (f: number) => 16 / (RO(f) - 1.8 - RI(f))
  const roofRing = (t: (f: number) => number) => ring((f) => rRoof(f, t(f)), (f) => zRoof(f, t(f)))
  strip(clearGlass, roofRing(() => 0), roofRing(tClear), UP)
  const ts = [tClear, (f: number) => 0.5 * (tClear(f) + 1) - 0.12, () => 0.72, () => 1]
  for (let i = 0; i < ts.length - 1; i++) strip(roofGlass, roofRing(ts[i]), roofRing(ts[i + 1]), UP)

  // The tension ring's white fascia, where the pitch lights hang, and the
  // pale membrane ceiling under the roof, seen through the opening.
  const zUnder = (f: number, t: number) => HI(f) - 2.6 + (zTop(f) - (HI(f) - 2.6)) * t
  strip(white, ring(RI, (f) => HI(f) - 2.6), ring(RI, HI), IN)
  const T_STAND = 0.42
  const underRing = (t: number) => ring((f) => rRoof(f, t), (f) => zUnder(f, t))
  strip(white, underRing(0), underRing(T_STAND), DOWN)

  // --- The stands, seen through the opening: a low wall round the pitch,
  // the lower tier, the band of boxes, and the upper tiers rising to the
  // roof's ceiling.
  const rA = RF
  const rB = (f: number) => rRoof(f, T_STAND)
  const rM = (f: number) => rA(f) + (rB(f) - rA(f)) * 0.36
  const Z_WALL = 1.4, Z_MID = 10.5, Z_BOX = 14
  strip(dark, ring(rA, () => 0), ring(rA, () => Z_WALL), IN)
  strip(dark, ring(rA, () => Z_WALL), ring(rM, () => Z_MID), (q) => [-q[0], -q[1], 2])
  strip(dark, ring(rM, () => Z_MID), ring(rM, () => Z_BOX), IN)
  strip(dark, ring(rM, () => Z_BOX), ring(rB, (f) => zUnder(f, T_STAND)), (q) => [-q[0], -q[1], 2])

  // --- The podium: the raised plateau the bowl stands on, with parking
  // under it: bevelled walls from the ground, the deck from under the
  // bowl's base out to the edge, the broad south stair and the colonnade.
  const BEV = 0.5
  strip(podium, ring(RP, () => 0), ring(RP, () => Z_POD - BEV), OUT)
  strip(podium, ring(RP, () => Z_POD - BEV), ring((f) => RP(f) - BEV, () => Z_POD), (q) => [q[0], q[1], 1])
  strip(podium, ring((f) => RO(f) - FLARE - 4.5, () => Z_POD), ring((f) => RP(f) - BEV, () => Z_POD), UP)
  // The broad south stair (OSM steps, ways 422410103-422410123, seen in
  // p10): from the deck edge down 30 m outwards, between compass 169 and 194.
  {
    const f0 = polar(194), f1 = polar(169), NS = 5, RUN = 30
    const top = (f: number): V3 => at(f, RP(f), Z_POD), foot = (f: number): V3 => at(f, RP(f) + RUN, 0)
    for (let k = 0; k < NS; k++) {
      const a = f0 + ((f1 - f0) * k) / NS, b = f0 + ((f1 - f0) * (k + 1)) / NS
      face(podium, [top(a), foot(a), foot(b), top(b)], [0, 0, 1])
    }
    for (const [f, s] of [[f0, -1], [f1, 1]] as [number, number][]) {
      const t: V3 = [-Math.sin(f) * s, Math.cos(f) * s, 0]
      face(podium, [top(f), foot(f), at(f, RP(f), 0)], t)
    }
  }
  // The colonnade of parking openings along the south-west and west edge
  // (p10), compass 201 to 277: one opening per wall segment, piers between.
  {
    const lo = polar(277), hi = polar(201)
    for (let k = 0; k < N; k++) {
      let a = PHI[k], b = PHI[(k + 1) % N] + (k === N - 1 ? 2 * Math.PI : 0)
      const mid = Math.atan2(Math.sin((a + b) / 2), Math.cos((a + b) / 2))
      if (mid < lo || mid > hi) continue
      const pa = at(a, RP(a), 0), pb = at(b, RP(b), 0)
      const u: V3 = [pb[0] - pa[0], pb[1] - pa[1], 0], len = Math.hypot(u[0], u[1])
      const n: V3 = [u[1] / len, -u[0] / len, 0]
      const P = (s: number, z: number): V3 => [pa[0] + u[0] * s + n[0] * 0.06, pa[1] + u[1] * s + n[1] * 0.06, z]
      face(dark, [P(0.22, 0.4), P(0.78, 0.4), P(0.78, 4.4), P(0.22, 4.4)], n)
    }
  }


  // Night: the membrane is floodlit from the podium and glows silver; the
  // white rim and tension ring catch the light too. Glass stays dark.
  const floodMembrane = (_p: V3, n: V3) => (n[2] > 0.85 ? 0.2 : 0.9)
  const floodRim = (_p: V3, n: V3) => (n[2] > 0.85 ? 0.15 : 0.7)
  return [
    { part: membrane, material: { ...finish('ct-membrane', 0xdde0e0), floodlight: floodMembrane } },
    { part: roofGlass, material: { name: 'glass', color: 0xd6dfe3, roughness: 0.3 } },
    { part: clearGlass, material: { name: 'glass-2', color: 0x93a4b2, roughness: 0.24 } },
    { part: white, material: { ...PALETTE.trim, floodlight: floodRim } },
    { part: dark, material: finish('ct-seats', 0x6f767d) },
    { part: podium, material: finish('ct-podium', 0xc9c6bf) },
  ]
}

if (import.meta.main) await save('cpt-cape-town-stadium', 'Cape Town Stadium', [-33.9034476, 18.4111472], BEARING, build(), 5000)
