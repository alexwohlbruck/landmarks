/**
 * Comcast Technology Center, Philadelphia (Foster + Partners, 2018) —
 * original procedural geometry, CC0-1.0.
 * bun generators/phl-comcast-technology-center.ts
 *
 * Map frame, turned to the building: +x runs along the tower's long axis
 * toward 18th Street (east-south-east), +y toward Arch Street
 * (north-north-east), z up, metres. BEARING 9.6: the Center City grid is
 * turned 9.6 degrees clockwise of north (measured from the west and east
 * edges of the OSM outline). Origin = area centroid of the OSM outline
 * way/317178904 (-75.170396, 39.955011), on the ground.
 *
 * Form (from the photos below): a long glass slab, its long faces to the
 * north and south, in deep blue glass. Its west end is the "head": a light
 * grey core with a light grey glass spine up its middle, running the full
 * height from the podium into the slim glass lantern fin on top, the city's
 * highest point; over the top floors (the Four Seasons hotel and the
 * 60th-floor sky lobby) the core either side of the spine is a charcoal
 * crown stage. Below 220 m the slab carries a deep glass wing on each long side,
 * so the lower block is about twice as deep as the slab above; the wings'
 * east and west faces carry the exposed zig-zag steel braces. A four-storey
 * podium (TV studios, silver-grey metal louvres with darker bands) fills the east end of the block on 18th
 * Street and the west corners.
 *
 * Evidence
 * - OSM way/317178904 (outline, height 341, 61 levels; 116 x 48 m in the
 *   turned frame), parts way/749649288 (tower, 277 m, 60 levels),
 *   way/749649286 (the west spine/fin, 341 m, 10.5 x 8.4 m), way/686345701
 *   (east podium, 4 levels), way/749649285 and way/749649287 (west corner
 *   podium parts, 4 levels). All are replaced. The OSM tower part is only
 *   18-24 m deep; photos show the lower block runs the full depth of the
 *   outline, so the photos are followed for the wings.
 * - Published: 1,121 ft = 341.7 m total, 60 storeys, Foster + Partners with
 *   Kendall/Heaton, completed 2017-18; hotel on floors 48-56 with lobby and
 *   restaurant on the 60th floor; "A-shaped steel braces" on the east and
 *   west sides (Wikipedia, "Comcast Technology Center", citing CTBUH 16192).
 * - USGS 3DEP lidar (USGS_LPC_DE_DelawareValley_HD_2015_LAS_2017, flown
 *   2015) shows only the core under construction, so no height is measured
 *   from it. OpenDataPhilly's LI footprint height (914 ft) is a
 *   mid-construction read and is ignored.
 * - Mapterhorn terrain: the site rises about 1.5 m to the north; ordinary
 *   sloped site, elevation 0.
 * - Heights are photo-scaled against the published 341.7 m, from the three
 *   most distant photos (Schuylkill, Fairmount Park, Wobbanight c), which
 *   agree within 2%: lower wings 220 m (0.645 of the total), slab roof
 *   285 m, head glass 290 m, the core turns charcoal at 264 m, head top
 *   310 m, lantern fin 310-341.7 m. Widths are scaled from the west-end
 *   photos against the 48.2 m outline depth: slab 21.8 m deep, head core
 *   16 m, glass spine and fin 5 m (real ~4 m, a little bolder for phone size).
 *
 * Photos (Wikimedia Commons, EVIDENCE):
 * - "Comcast Technology Center 2018.jpg", TastyPoutine, CC BY-SA 4.0 (west end)
 *   https://commons.wikimedia.org/wiki/File:Comcast_Technology_Center_2018.jpg
 * - "Comcast Tech Center 2018.jpg", TastyPoutine, CC BY-SA 4.0 (west end, sunlit spine)
 *   https://commons.wikimedia.org/wiki/File:Comcast_Tech_Center_2018.jpg
 * - "CTC Tower April 2018 cropped.jpg", StuntPilot22, CC BY-SA 4.0 (from the Schuylkill, west)
 *   https://commons.wikimedia.org/wiki/File:CTC_Tower_April_2018_cropped.jpg
 * - "Comcast Technology Center from Fairmount Park.jpg", Hij802, CC0 (north-west)
 *   https://commons.wikimedia.org/wiki/File:Comcast_Technology_Center_from_Fairmount_Park.jpg
 * - "Comcast Technology Center a.jpg" … "g.jpg", Wobbanight, CC0 (several sides)
 *   https://commons.wikimedia.org/wiki/File:Comcast_Technology_Center_c.jpg (north)
 * - "A picture of the Comcast Technology Center from north east side in
 *   November 2017.jpg" (and the SE, NW, SW companions), TKD7089pro, CC BY-SA 4.0
 *   https://commons.wikimedia.org/wiki/File:A_picture_of_the_Comcast_Technology_Center_from_north_east_side_in_November_2017.jpg
 * - "2025-08-04 12 39 18 View up from the east corner of the Comcast
 *   Technology Center…jpg", Famartin, CC BY-SA 4.0 (east end, braces, podium)
 *   https://commons.wikimedia.org/wiki/File:2025-08-04_12_39_18_View_up_from_the_east_corner_of_the_Comcast_Technology_Center_in_Philadelphia,_Pennsylvania.jpg
 * - USGS NAIP orthophoto (public domain): plan only; the tower leans too far
 *   in it to read the upper tiers.
 *
 * Look-only (not relied on for shape or colour):
 * - "Comcast Technology Center" (night, fog), emma-k-alexandra, Flickr,
 *   CC BY-NC 2.0, https://www.flickr.com/photos/157881463@N08/54539486655 —
 *   office floors lit in bands; the crown is lost in fog.
 *
 * Estimated: podium 26 m (4 tall studio storeys, from the NE photo); the
 * ground-floor glazing 8 m; brace node pitch 12.1 m (16 bays over the
 * wings, counted ~2.5 floors a bay on the Schuylkill photo); pale floor
 * the curtain wall's floor and mullion lines are drawn only as faint lines a
 * step lighter than the glass (floors ~48 m apart and at the tier breaks,
 * mullions ~9 m apart on the broad faces), so the glass reads continuous as
 * in the photos;
 * the head core's E-W length (22 m) and its 4 m projection past the west
 * glass; the slab's east end set back ~18 m from the lower block's (seen
 * from the north and north-west, Wobbanight c and Fairmount Park); the east end's glass spine drawn as a 1 m-proud glass pilaster.
 *
 * Colours (daylight photos, pulled to the palette's lightness): the curtain
 * wall a deep saturated blue (window-2 #5a7ca6), bluer and darker than the
 * paler Comcast Center next door; the spine and podium louvres light silver
 * grey; the crown stage charcoal.
 *
 * Night: the curtain wall is office and hotel glazing, lit at night
 * (`window-2`); the light grey glass spine and the lantern fin on top glow
 * (`window-3`), as the lead's night notes and the look-only photo suggest.
 * The charcoal crown stage and the podium louvres stay unlit; the
 * ground-floor glazing is the same lit glass.
 *
 * Doubts: the "open lantern" void at the top is not legible in any licensed
 * photo at this distance (it shows as the charcoal head and the glass fin),
 * so it is drawn closed; the podium's exact extent along Arch Street and
 * JFK Boulevard and the SE entrance canopy are simplified; no licensed
 * photo shows the roofs from above.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'

const BEARING = 9.6
const ANCHOR = { lng: -75.170396, lat: 39.955011 }

const glass = new Part()   // curtain wall (window-2)
const white = new Part()   // light grey: spine panels, braces, roof lips, podium louvres
const dark = new Part()    // charcoal crown stage at the top of the head
const roof = new Part()
const lantern = new Part() // the light grey glass spine and the fin it rises into (window-3)
const lobby = glass        // ground-floor glazing: the same lit glass, recessed
const mull = new Part()    // faint mullion and floor lines, a step lighter than the glass

// ---------- heights ----------
const TOP = 341.7      // published
const HEAD = 310       // charcoal head top (photo-scaled)
const HEAD_GLASS = 290 // glass around the head
const SLAB = 285       // slab roof
const DARK_FROM = 264  // the core turns charcoal
const WINGS = 220      // lower block roof
const PODIUM = 26
const LOBBY = 8

// ---------- plan (turned frame, origin at the outline centroid) ----------
const OUT = { x0: -58.0, x1: 58.0, y0: -24.1, y1: 24.1 } // OSM outline
const BODY = { x0: -51.0, x1: 29.8 }                      // tower body ends (OSM)
const SLAB_Y = 10.9                                       // slab half-depth
const CORE = { x0: -55.0, x1: -33.0, h: 8.0 }             // head core
const FIN = { x0: -55.3, x1: -47.6, h: 2.5 }              // lantern fin (OSM part's x extent)
const HEADX = -33.0                                       // east end of the raised head glass
const SLAB_E = 12.0                                       // east end of the slab above the wings

const B = 0.5 // edge bevel

// ---------- helpers ----------
const unit = (v: V3): V3 => { const l = Math.hypot(...v) || 1; return v.map((n) => n / l) as V3 }
type Ring = { p: [number, number][]; n: V3[][] } // points, and per-edge [start, end] normals

/** A rectangle with chamfered corners, counter-clockwise from above, with smooth bevel normals. */
function rect(x0: number, x1: number, y0: number, y1: number, b = B): Ring {
  const p: [number, number][] = [
    [x0 + b, y0], [x1 - b, y0], [x1, y0 + b], [x1, y1 - b],
    [x1 - b, y1], [x0 + b, y1], [x0, y1 - b], [x0, y0 + b],
  ]
  const face: V3[] = [[0, -1, 0], [1, 0, 0], [0, 1, 0], [-1, 0, 0]]
  const n: V3[][] = []
  for (let i = 0; i < 8; i++) {
    if (i % 2 === 0) { const f = face[i / 2]; n.push([f, f]) }
    else n.push([face[(i - 1) / 2], face[((i + 1) / 2) % 4]])
  }
  return { p, n }
}
function walls(part: Part, r: Ring, z0: number, z1: number) {
  const k = r.p.length
  for (let i = 0; i < k; i++) {
    const a = r.p[i], b = r.p[(i + 1) % k], [na, nb] = r.n[i]
    const A: V3 = [a[0], a[1], z0], Bv: V3 = [b[0], b[1], z0], C: V3 = [b[0], b[1], z1], D: V3 = [a[0], a[1], z1]
    part.tri(A, Bv, C, undefined, undefined, undefined, [na, nb, nb])
    part.tri(A, C, D, undefined, undefined, undefined, [na, nb, na])
  }
}
function cap(part: Part, r: Ring, z: number, up = true) {
  const pts: V3[] = r.p.map(([x, y]) => [x, y, z])
  const order = up ? pts : [...pts].reverse()
  for (let i = 1; i < order.length - 1; i++) part.tri(order[0], order[i], order[i + 1])
}
function box(part: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, top: Part | null = part, b = B) {
  const r = rect(x0, x1, y0, y1, b)
  walls(part, r, z0, z1)
  if (top) cap(top, r, z1, true)
}
/** A pale band proud of a volume's walls, with its top face. */
function band(x0: number, x1: number, y0: number, y1: number, z: number, h = 0.9, out = 0.18, part = white) {
  const r = rect(x0 - out, x1 + out, y0 - out, y1 + out, B + out * 0.4)
  walls(part, r, z - h / 2, z + h / 2)
  const inner = rect(x0, x1, y0, y1, B)
  for (let i = 0; i < 8; i++) {
    const j = (i + 1) % 8
    const o0: V3 = [...r.p[i], z + h / 2], o1: V3 = [...r.p[j], z + h / 2]
    const i0: V3 = [...inner.p[i], z + h / 2], i1: V3 = [...inner.p[j], z + h / 2]
    part.quad(i0, o0, o1, i1)
  }
}
/**
 * A flat strip on a face of constant x (an east or west end), between two
 * points (y, z) on that face, standing `d` proud of it, `w` wide.
 */
function strut(x: number, side: 1 | -1, a: [number, number], b: [number, number], w = 1.2, d = 0.45) {
  const dy = b[0] - a[0], dz = b[1] - a[1], l = Math.hypot(dy, dz)
  const ny = (-dz / l) * (w / 2), nz = (dy / l) * (w / 2)
  const q = (s: [number, number], sgn: number, o: number): V3 => [x + side * o, s[0] + sgn * ny, s[1] + sgn * nz]
  const f = [q(a, -1, d), q(b, -1, d), q(b, 1, d), q(a, 1, d)]
  const k = [q(a, -1, 0), q(b, -1, 0), q(b, 1, 0), q(a, 1, 0)]
  const quad = (p0: V3, p1: V3, p2: V3, p3: V3, n: V3) => {
    white.tri(p0, p1, p2, undefined, undefined, undefined, [n, n, n])
    white.tri(p0, p2, p3, undefined, undefined, undefined, [n, n, n])
  }
  quad(f[0], f[1], f[2], f[3], [side, 0, 0])
  const e1 = unit([0, ny, nz]), e0: V3 = [0, -e1[1], -e1[2]]
  quad(k[0], k[1], f[1], f[0], e0)
  quad(f[3], f[2], k[2], k[3], e1)
  const t = unit([0, dy, dz])
  quad(f[1], k[1], k[2], f[2], t)
  quad(k[0], f[0], f[3], k[3], [0, -t[1], -t[2]])
}

// ---------- podium: east block on 18th Street and the west corners ----------
// Silver-grey metal louvres over dark glass (TKD7089pro NE/SE/NW/SW photos,
// Famartin east corner); pale in sun (TastyPoutine), with darker bands.
for (const [x0, x1] of [[BODY.x1 - 1, OUT.x1], [OUT.x0, BODY.x0 + 1]]) {
  box(white, x0, x1, OUT.y0, OUT.y1, LOBBY, PODIUM, roof)
  box(lobby, x0 + (x0 < 0 ? 1.5 : 0), x1 - (x1 > 0 ? 1.5 : 0), OUT.y0 + 1.5, OUT.y1 - 1.5, 0, LOBBY, null)
  for (const z of [LOBBY + 0.4, 14, 20]) band(x0, x1, OUT.y0, OUT.y1, z, 1.4, 0.12, roof)
}

// ---------- lower block: slab plus the two deep wings, to 220 m ----------
box(lobby, BODY.x0 + 1.5, BODY.x1 - 1.5, OUT.y0 + 1.5, OUT.y1 - 1.5, 0, LOBBY, null)
box(glass, BODY.x0, BODY.x1, OUT.y0, OUT.y1, LOBBY, WINGS, roof)
const NODES = 16, PITCH = (WINGS - PODIUM) / NODES
band(BODY.x0, BODY.x1, OUT.y0, OUT.y1, WINGS - 0.6, 1.3) // roof lip

// ---------- faint curtain-wall lines (STYLE.md: a few mullion and floor lines) ----------
/** A flat strip on a face of constant y (a long face), `side` its outward sign. */
function stripY(y: number, side: 1 | -1, x0: number, x1: number, z0: number, z1: number) {
  const yy = y + side * 0.05
  const a: V3 = [x0, yy, z0], b: V3 = [x1, yy, z0], c: V3 = [x1, yy, z1], d: V3 = [x0, yy, z1]
  if (side > 0) mull.quad(b, a, d, c)
  else mull.quad(a, b, c, d)
}
// Floor lines about every 48 m and at the tier breaks, all round.
for (const z of [PODIUM, PODIUM + 48, PODIUM + 96, PODIUM + 144]) band(BODY.x0, BODY.x1, OUT.y0, OUT.y1, z, 0.6, 0.06, mull)
band(BODY.x0, SLAB_E, -SLAB_Y, SLAB_Y, WINGS + 32, 0.6, 0.06, mull)
// Vertical mullion lines every ~9 m on the broad north and south faces.
for (const side of [1, -1] as const) {
  const n = 9, step = (BODY.x1 - BODY.x0) / n
  for (let i = 1; i < n; i++) {
    const x = BODY.x0 + i * step
    stripY(side * OUT.y1, side, x - 0.3, x + 0.3, LOBBY, WINGS - 1.3)
  }
  const m = 6, st = (SLAB_E - BODY.x0) / m
  for (let i = 1; i < m; i++) {
    const x = BODY.x0 + i * st
    stripY(side * SLAB_Y, side, x - 0.3, x + 0.3, WINGS, (x < HEADX ? HEAD_GLASS : SLAB) - 1.3)
  }
}

// The zig-zag braces on the wings' east and west faces, mirrored north/south.
for (const [x, side] of [[BODY.x0, -1], [BODY.x1, 1]] as [number, 1 | -1][]) {
  for (const s of [1, -1]) {
    // West: the braces span the wings, beside the slab and spine. East: the
    // face is flat to 220 m, and they run from the glass spine to the edge.
    const inner = s * (side < 0 ? SLAB_Y + 0.9 : 3.6), outer = s * (OUT.y1 - 0.9)
    for (let k = 0; k < NODES; k++) {
      const z0 = PODIUM + k * PITCH, z1 = z0 + PITCH
      const from: [number, number] = [k % 2 ? outer : inner, z0], to: [number, number] = [k % 2 ? inner : outer, z1]
      strut(x, side, from, to)
    }
  }
}

// ---------- slab above the wings, to 285 m; head glass to 290 m ----------
box(glass, HEADX, SLAB_E, -SLAB_Y, SLAB_Y, WINGS, SLAB, roof)
box(glass, BODY.x0, HEADX + 0.5, -SLAB_Y, SLAB_Y, WINGS, HEAD_GLASS, roof)
band(HEADX, SLAB_E, -SLAB_Y, SLAB_Y, SLAB - 0.6, 1.3)
band(BODY.x0, HEADX + 0.5, -SLAB_Y, SLAB_Y, HEAD_GLASS - 0.6, 1.3)

// ---------- the head: light grey core, charcoal crown stage, glass spine ----------
box(white, CORE.x0, CORE.x1, -CORE.h, CORE.h, PODIUM, DARK_FROM, null)
box(dark, CORE.x0, CORE.x1, -CORE.h, CORE.h, DARK_FROM, HEAD, roof)
// The light grey glass spine up the middle of the west face, from the podium
// into the fin, one continuous strip the fin's width.
box(lantern, FIN.x0, CORE.x0 + 0.5, -FIN.h, FIN.h, PODIUM, HEAD - 1, null, 0.2)
// The east end's glass spine: a shallow glass pilaster framed in silver, on
// the lower block's east face and again on the slab's east face above it.
for (const [x, z0, z1] of [[BODY.x1, LOBBY, WINGS - 1.3], [SLAB_E, WINGS, SLAB - 1.2]]) {
  box(glass, x - 0.5, x + 1.0, -2.6, 2.6, z0, z1, roof, 0.3)
  for (const s of [-1, 1]) box(white, x - 0.5, x + 1.15, s * 2.6 - 0.35, s * 2.6 + 0.35, z0, z1, white, 0.1)
}

// ---------- the lantern fin ----------
box(lantern, FIN.x0, FIN.x1, -FIN.h, FIN.h, HEAD - 1, TOP - 0.6, null, 0.2)
box(white, FIN.x0, FIN.x1, -FIN.h, FIN.h, TOP - 0.6, TOP, white, 0.2) // pale coping

const parts = [
  { part: glass, material: windowVariant(2, 0x5a7ca6) },
  { part: white, material: finish('ctc-silver', 0xc3c8cd) },
  { part: dark, material: finish('ctc-charcoal', 0x6e6c6c) },
  { part: roof, material: PALETTE.roof },
  { part: lantern, material: windowVariant(3, 0xb9c4ce) },
  { part: mull, material: finish('ctc-mullion', 0x7590b3) },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Comcast Technology Center', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: TOP,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['way/317178904', 'way/749649288', 'way/749649286', 'way/686345701', 'way/749649285', 'way/749649287'],
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/phl-comcast-technology-center.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
