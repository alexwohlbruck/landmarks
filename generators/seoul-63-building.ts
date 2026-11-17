/**
 * 63 Building (63 Square), Yeouido, Seoul — original procedural geometry, CC0-1.0.
 * bun generators/seoul-63-building.ts
 *
 * Map frame turned to the building: +y runs along the long axis toward the
 * north-east end (compass 51.8), +x is the south-east broad face's outward
 * normal (compass 141.8, toward the Han River), z up, metres. BEARING 51.8.
 * Origin = centroid of the OSM outline way/64989671 (the plan is symmetric
 * about it to within 0.2 m).
 *
 * Evidence
 * - OSM way/64989671 (building=tower, height 252, 63 levels): a 43.3 x 59.9 m
 *   rectangle, long axis at compass 51.8. Parts: 463188395 (the core,
 *   26.7 x 59.9 m, height 249); 463188396 and 463188397 (8.2 m strips along
 *   both broad faces, skillion, height 120: the sloped glass skirt at the
 *   foot of the broad faces); 463384207 and 463384208 (6.5 m wide bays
 *   standing 1.7 m proud of the middle of each narrow end, height 249);
 *   463384209 "63스퀘어" (cross-shaped roof plant 249-252). The low podium
 *   way/385228664 (no height) with parts 463613650-463613652 (height 15)
 *   wraps the south-west end; the model draws it as a plain 15 m block.
 * - Published: 249 m to the roof, 60 storeys above ground (Wikipedia
 *   "63 Building"; CTBUH Skyscraper Center "63 Square", 1985, gold-tinted
 *   reflective glass curtain wall).
 * - Commons photos (daylight):
 *   "63 Building.jpg" (Sebastian Hoering, CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:63_Building.jpg): south-east
 *     broad face and the north-east end: gold glass, blue band and Hanwha sign
 *     under the parapet, the end's blue-grey middle bay and double dark bands,
 *     the red-and-white mast.
 *   "Hangang Bus 63 Building 20250918 (03).jpg" (Republic of Korea, CC BY-SA
 *     4.0, https://commons.wikimedia.org/wiki/File:Hangang_Bus_63_Building_20250918_(03).jpg):
 *     the narrow end from the river: middle bay, the two double dark bands at
 *     about a third and two thirds of the height.
 *   "Hangang Bus 63 Building 20250918 (02).jpg" and "(04).jpg" (Republic of
 *     Korea, CC BY-SA 4.0): three-quarter views from the river, the skirt.
 *   "63 Building Blacked Out.jpg" (Ox1997cow, CC BY-SA 3.0,
 *     https://commons.wikimedia.org/wiki/File:63_Building_Blacked_Out.jpg): a
 *     silhouette showing the broad face leaning out below about 100-115 m.
 *   "한강 공원에서 63시티 63city From Hangang Park 63ビルディング - panoramio.jpg"
 *     (Bohao Zhao, CC BY 3.0): the broad face, sign, mast height.
 *   "63 Building - panoramio.jpg" (Maris Teteris, CC BY 3.0), "Seoul
 *     Building63.jpg" (Pavel Kanzelsberger, public domain): the narrow end.
 *   Colour sampled from the Hoering photo: sunlit glass #d5b19c, end bay
 *   #484f62; the Zhao photo #b69e88. Pulled to #cda47c and #75849a.
 *
 *   "63 Building from Yongsan Station.jpg" (Ox1997cow, CC BY-SA 3.0,
 *     https://commons.wikimedia.org/wiki/File:63_Building_from_Yongsan_Station.jpg):
 *     the north-east end square on, the best scale: the end is 26.7 m (OSM),
 *     the middle bay ~7 m with dark reveals, the upper double band ~157 m,
 *     the blue band ~237 m, and the broad face's edge starting to lean out
 *     just below the band and curving out more toward the ground.
 *
 * Measured from photos (scaled to the 26.7 m end and the 249 m roof): the
 * skirt is limited to the lowest ~25 m and curves out to OSM's 8.2 m at the
 * ground (in the Hangang Bus (03) and Yongsan photos the edges run straight
 * from the top down to the treeline, ~15% of the height; OSM's skillion
 * parts give 120 m, which the photos don't bear out); the double bands at ~88 m (the
 * Hangang Bus (03) photo) and ~157 m; the blue band at ~237 m; the mast ~22 m
 * above the roof (Zhao, Hoering).
 * Estimated: band thicknesses, the plant's height, the podium's walls.
 * Invented: the pier spacing (12 bays a broad face, ~4.8 m, standing for the
 * fine gold mullion grid of the real wall). Colours: the sunlit glass is a
 * pinkish gold (#d5b19c, Hoering), lifted to #ecc19e and made glossy; piers
 * in a darker gold #bf946c.
 * No lidar exists for Korea and the map's terrain (Mapterhorn) has no tiles
 * over Seoul, so the ground could not be checked; Yeouido is flat.
 * Doubts: the podium is drawn from OSM only (no photo shows it whole).
 *
 * Night: the office floors are lit, so the gold wall is `window`; the end bays
 * `window-2`. The Hanwha sign is not drawn.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'

const BEARING = 51.8
const ANCHOR = { lng: 126.940251, lat: 37.519849 }

const gold = new Part(), pier = new Part(), blue = new Part(), dark = new Part(), red = new Part(), trim = new Part()
const roof = trim // roof decks and plant share the pale trim (six materials)

const ROOF = 249
const SKIRT = 25
const HX = 13.35 // core half-width across the broad faces
const BX = 21.65 // half-width at the foot of the skirt
const HY = 29.95 // half-length
const C = 0.6 // corner chamfer

/** A box with optional top bevel. */
function box(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, bev = 0) {
  const r = (x0_: number, x1_: number, y0_: number, y1_: number, z: number): V3[] => [[x0_, y0_, z], [x1_, y0_, z], [x1_, y1_, z], [x0_, y1_, z]]
  if (bev > 0) {
    p.loft([r(x0, x1, y0, y1, z0), r(x0, x1, y0, y1, z1 - bev), r(x0 + bev, x1 - bev, y0 + bev, y1 - bev, z1)])
    p.cap(r(x0 + bev, x1 - bev, y0 + bev, y1 - bev, z1), true)
  } else {
    p.loft([r(x0, x1, y0, y1, z0), r(x0, x1, y0, y1, z1)])
    p.cap(r(x0, x1, y0, y1, z1), true)
  }
  p.cap(r(x0, x1, y0, y1, z0), false)
}

/** Half-width across the broad faces at height z. */
const hx = (z: number) => (z >= SKIRT ? HX : HX + (BX - HX) * ((SKIRT - z) / SKIRT) ** 1.4)

// --- The tower: broad faces (gold) lean out over the skirt, narrow ends straight. ---
// Ring (counter-clockwise from above) with chamfered corners; faces split so
// each gets its own material.
function ring(z: number, out = 0): V3[] {
  const x = hx(z) + out, y = HY + out
  return [
    [x, -y + C, z], [x, y - C, z], // +x broad face
    [x - C, y, z], [-x + C, y, z], // +y end
    [-x, y - C, z], [-x, -y + C, z], // -x broad face
    [-x + C, -y, z], [x - C, -y, z], // -y end
  ]
}
/** Loft the ring's 8 faces between levels; broad faces/ends to `face`, corners to `corner`. */
function shaft(zs: number[], face: (i: number) => Part, out = 0) {
  for (let k = 0; k < zs.length - 1; k++) {
    const a = ring(zs[k], out), b = ring(zs[k + 1], out)
    for (let i = 0; i < 8; i++) {
      const j = (i + 1) % 8
      face(i).quad(a[i], a[j], b[j], b[i])
    }
  }
}
// Gold faces with the end bays cut out of the ends; the chamfered corners dark.
shaft([0, 6, 12, 19, SKIRT, ROOF], (i) => (i === 2 || i === 6 ? pier : gold)) // faces 0/4 broad, 2/6 ends, odd = corner chamfers

// End bays: blue-grey glass, 6.6 m wide, 1.7 m proud, full height.
for (const s of [1, -1]) {
  const y0 = s * HY, y1 = s * (HY + 1.7), w = 3.3
  // dark reveals flanking the bay
  for (const xr of [w, -w - 1.3]) {
    const yy = s * (HY + 0.05), q: V3[] = s > 0 ? [[xr + 1.3, yy, 0], [xr, yy, 0], [xr, yy, ROOF], [xr + 1.3, yy, ROOF]] : [[xr, yy, 0], [xr + 1.3, yy, 0], [xr + 1.3, yy, ROOF], [xr, yy, ROOF]]
    dark.quad(q[0], q[1], q[2], q[3])
  }
  const pts = (z: number): V3[] => s > 0
    ? [[w, y0, z], [w, y1, z], [-w, y1, z], [-w, y0, z]]
    : [[-w, y0, z], [-w, y1, z], [w, y1, z], [w, y0, z]]
  const a = pts(0), b = pts(ROOF + 0.6)
  for (let i = 0; i < 3; i++) blue.quad(a[i], a[i + 1], b[i + 1], b[i])
  roof.cap(b, true)
}

// --- Bands. A band is a slightly proud ring of the shaft. ---
function band(z0: number, z1: number, p: Part, out = 0.2) {
  const a = ring(z0, out), b = ring(z1, out)
  for (let i = 0; i < 8; i++) {
    const j = (i + 1) % 8
    p.quad(a[i], a[j], b[j], b[i])
  }
  // underside and top lips
  const ia = ring(z0), ib = ring(z1)
  for (let i = 0; i < 8; i++) {
    const j = (i + 1) % 8
    p.quad(ia[j], ia[i], a[i], a[j])
    p.quad(ib[i], ib[j], b[j], b[i])
  }
}
// Mechanical floors: double dark bands on the narrow ends only (the broad
// faces run unbroken in every photo), drawn bold so they read at phone size.
function endBand(z0: number, z1: number, p: Part, out: number) {
  for (const s of [1, -1]) {
    for (const [xa, xb] of [[4.6, hx(z0) - C], [-hx(z0) + C, -4.6]]) {
      const y = s * (HY + out)
      const q: V3[] = s > 0 ? [[xb, y, z0], [xa, y, z0], [xa, y, z1], [xb, y, z1]] : [[xa, y, z0], [xb, y, z0], [xb, y, z1], [xa, y, z1]]
      p.quad(q[0], q[1], q[2], q[3])
    }
  }
}
for (const zc of [88, 157]) {
  endBand(zc - 1.9, zc - 0.7, dark, 0.06)
  endBand(zc + 0.7, zc + 1.9, dark, 0.06)
}

// --- The gold grid: vertical piers in a darker gold, grouping the wall into
// broad panels (the real wall is a fine gold mullion grid). Each pier is a
// shallow strip standing 0.25 m off the face, following the skirt's curve. ---
const PZ = [0, 6, 12, 19, SKIRT, 236.5]
function broadPier(side: number, yc: number, w: number) {
  const D = 0.25
  const pt = (z: number, y: number, o: number): V3 => [side * (hx(z) + o), y, z]
  for (let k = 0; k < PZ.length - 1; k++) {
    const za = PZ[k], zb = PZ[k + 1]
    const ya = yc - w / 2, yb = yc + w / 2
    const [y0, y1] = side > 0 ? [ya, yb] : [yb, ya]
    pier.quad(pt(za, y0, D), pt(za, y1, D), pt(zb, y1, D), pt(zb, y0, D)) // front
    pier.quad(pt(za, y0, 0), pt(za, y0, D), pt(zb, y0, D), pt(zb, y0, 0)) // side
    pier.quad(pt(za, y1, D), pt(za, y1, 0), pt(zb, y1, 0), pt(zb, y1, D)) // side
  }
}
const NP = 11
for (const side of [1, -1]) for (let i = 0; i <= NP; i++) {
  const yc = -(HY - C - 0.6) + (2 * (HY - C - 0.6) * i) / NP
  broadPier(side, yc, i === 0 || i === NP ? 1.2 : 0.8)
}
// end-face piers: two each side of the blue bay
function endPier(s: number, xc: number, w: number) {
  const D = 0.25, y0 = s * HY, y1 = s * (HY + D)
  const xa = xc - w / 2, xb = xc + w / 2
  const [x0, x1] = s > 0 ? [xb, xa] : [xa, xb]
  pier.quad([x0, y1, 0], [x1, y1, 0], [x1, y1, 236.5], [x0, y1, 236.5])
  pier.quad([x0, y0, 0], [x0, y1, 0], [x0, y1, 236.5], [x0, y0, 236.5])
  pier.quad([x1, y1, 0], [x1, y0, 0], [x1, y0, 236.5], [x1, y1, 236.5])
}
for (const s of [1, -1]) for (const xc of [8.8, -8.8]) endPier(s, xc, 0.8)
// Crown: blue band all round; the dark sign panels on the broad faces.
band(236.5, 239.5, blue, 0.3)
for (const s of [1, -1]) {
  const x = s * (HX + 0.1), y0 = -18, y1 = 18, z0 = 241.5, z1 = 245
  const q: V3[] = s > 0 ? [[x, y0, z0], [x, y1, z0], [x, y1, z1], [x, y0, z1]] : [[x, y1, z0], [x, y0, z0], [x, y0, z1], [x, y1, z1]]
  dark.quad(q[0], q[1], q[2], q[3])
}

// --- Roof: parapet lip and the cross-shaped plant (63 Square, OSM 249-252). ---
{
  const top = ring(ROOF), inner = ring(ROOF, -0.8), deck = ring(ROOF - 1.2, -0.8)
  for (let i = 0; i < 8; i++) {
    const j = (i + 1) % 8
    trim.quad(top[i], top[j], inner[j], inner[i]) // parapet top
    trim.quad(inner[i], inner[j], deck[j], deck[i]) // parapet inner wall (faces in)
  }
  roof.cap(deck, true)
  box(roof, -4.8, 4.8, -25, 25, ROOF - 1.2, ROOF + 3.2, 0.4)
  box(roof, -9.2, 9.2, -9, 9, ROOF - 1.2, ROOF + 4.5, 0.4)
}

// --- Mast: red-and-white lattice tower drawn as a solid tapering shaft, bold. ---
{
  const z0 = ROOF + 4.5, H = 22
  const seg = 7
  for (let k = 0; k < seg; k++) {
    const za = z0 + (H * k) / seg, zb = z0 + (H * (k + 1)) / seg
    const wa = 1.6 - (1.0 * k) / seg, wb = 1.6 - (1.0 * (k + 1)) / seg
    const sq = (w: number, z: number): V3[] => [[-w, -w, z], [w, -w, z], [w, w, z], [-w, w, z]]
    ;(k % 2 === 0 ? red : trim).loft([sq(wa, za), sq(wb, zb)])
    if (k === seg - 1) red.cap(sq(wb, zb), true)
  }
  // service platform rings at a third and two thirds
  for (const t of [0.3, 0.62]) {
    const z = z0 + H * t, w = 2.3
    box(trim, -w, w, -w, w, z, z + 0.7)
  }
}

// --- Podium (way/385228664), 15 m, on the south-west end. Plain stone with a window band. ---
{
  const ZP = 15
  // main block across the end, and the strip back along the tower's foot
  box(trim, -79.4, 67.6, -67.5, -38.5, 0, ZP, 0.5)
  box(trim, -20, 16.2, -38.5, -31.8, 0, ZP, 0.5)
  // window bands: two broad panels on the long faces (grouped storeys)
  for (const [z0, z1] of [[3.5, 7.5], [9, 13]]) {
    blue.quad([67.6 + 0.05, -67.5 + 2, z0], [67.6 + 0.05, -38.5 - 2, z0], [67.6 + 0.05, -38.5 - 2, z1], [67.6 + 0.05, -67.5 + 2, z1])
    blue.quad([-79.4 - 0.05, -38.5 - 2, z0], [-79.4 - 0.05, -67.5 + 2, z0], [-79.4 - 0.05, -67.5 + 2, z1], [-79.4 - 0.05, -38.5 - 2, z1])
    blue.quad([-77.4, -67.5 - 0.05, z0], [65.6, -67.5 - 0.05, z0], [65.6, -67.5 - 0.05, z1], [-77.4, -67.5 - 0.05, z1])
    blue.quad([65.6, -38.5 + 0.05, z0], [16.2 + 2, -38.5 + 0.05, z0], [16.2 + 2, -38.5 + 0.05, z1], [65.6, -38.5 + 0.05, z1])
    blue.quad([-20 - 2, -38.5 + 0.05, z0], [-77.4, -38.5 + 0.05, z0], [-77.4, -38.5 + 0.05, z1], [-20 - 2, -38.5 + 0.05, z1])
  }
  // roof decks
  roof.quad([-78.9, -67, ZP + 0.02], [67.1, -67, ZP + 0.02], [67.1, -39, ZP + 0.02], [-78.9, -39, ZP + 0.02])
}

const parts = [
  { part: gold, material: { ...PALETTE.window, color: 0xecc19e, roughness: 0.25 } },
  { part: pier, material: finish('gold-pier', 0xbf946c, 0.4) },
  { part: blue, material: windowVariant(2, 0x75849a) },
  { part: dark, material: finish('bronze-dark', 0x5a5355) },
  { part: red, material: finish('mast-red', 0xc4523f) },
  { part: trim, material: PALETTE.trim },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('63 Building', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: ROOF + 26.5,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['way/64989671', 'way/463188395', 'way/463188396', 'way/463188397', 'way/463384207', 'way/463384208',
    'way/463384209', 'way/385228664', 'way/463613650', 'way/463613651', 'way/463613652'],
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/seoul-63-building.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
