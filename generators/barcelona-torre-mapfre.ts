/**
 * Torre Mapfre, Barcelona — original procedural geometry, CC0-1.0.
 * bun generators/barcelona-torre-mapfre.ts
 *
 * Map frame turned to the building: BEARING 45, so local +x is the
 * south-east (sea) face's outward normal and local +y the north-east face's;
 * z up, metres. Origin = area centroid of the OSM outline way/54747170
 * (lng 2.197350, lat 41.387780), the centre of the square plan.
 *
 * Evidence
 * - OSM way/54747170: a square turned 45° (faces NE, SE, SW, NW), 47 m
 *   corner to corner, so 33.2 m across the faces; height 154, 43 levels;
 *   wikidata Q568353 (checked: "Torre Mapfre", 154 m, 41.3878 2.1975).
 *   Part way/308013864 (height 154, min_height 144) is the crown box,
 *   covered by the model.
 * - Published (Wikipedia ca/en): 154 m, 44 storeys, Iñigo Ortiz and Enrique
 *   de León, 1992; Hotel Arts' twin across the Carrer de la Marina.
 * - Commons photos (all EVIDENCE):
 *   "Hotel Arts i Torre Mapfre des del mar.jpg" (Jordiferrer, CC BY-SA 4.0,
 *   level from the sea: heights);
 *   "Barcelona - Hotel Arts y Torre Mapre 01.jpg" (Zarateman, CC0, from the
 *   south-west);
 *   "Torre Mapfre Barcelona corregida.jpg" (Imelenchon, CC0, from the west
 *   at street level: the projecting floor slabs with pointed corners, the
 *   recessed lobby);
 *   "Barcelona - Torre Mapfre 11.jpg" (Zarateman, CC0: the top: a pale
 *   two-storey parapet band and the perforated grey crown box with the red
 *   MAPFRE letters).
 *
 * Heights: from the sea photo, scaled by the 154 m top: main roof (top of
 * the pale parapet band) about 140 m, crown box to 154 m. OSM's part says
 * the crown starts at 144; the photo shows it rising from the parapet, so
 * the box runs from the roof at 140. Crown box half-width 10.5 m (0.64 of
 * the face in the sea photo, estimated).
 *
 * Facade: the real tower has a pale projecting sunshade slab at every
 * floor. Following STYLE.md, the slabs are grouped: one pale slab every two
 * storeys (6.5 m), projecting 1.1 m with the real pointed corners, over a
 * dark green-grey `window` wall. The vertical zig-zag of the balconies down
 * the face centres is left out.
 *
 * Night: offices glow (`window`); the MAPFRE sign is lit red, drawn as a
 * plain red `neon-mapfre` panel on the sea (SE) and beach (SW) faces of
 * the crown, not as letters (it is not the landmark's identity).
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const BEARING = 45
const ANCHOR = { lng: 2.19735, lat: 41.38778 }
const H = 16.6 // half across the faces
const FLOOR = 3.25
const ROOF = 140
const TOP = 154
const LOBBY = 6.5

const glass = new Part(), slabs = new Part(), roof = new Part(), screen = new Part(), sign = new Part(), lobby = new Part()

const sq = (h: number, z: number): V3[] => [[h, -h, z], [h, h, z], [-h, h, z], [-h, -h, z]]

/** The slab outline: a square of half `h` whose corners reach out `tip` m further, to points. */
function pointed(h: number, tip: number, z: number): V3[] {
  const out: V3[] = []
  for (let q = 0; q < 4; q++) {
    const a = (q * Math.PI) / 2 - Math.PI / 4 // corner direction, counter-clockwise from the SE corner
    const tipR = h * Math.SQRT2 + tip
    out.push(near(q, h, -3, z), [Math.cos(a) * tipR, Math.sin(a) * tipR, z], near(q, h, 3, z))
  }
  return out
}
/** A point on the square of half h, `along` metres from corner q along its boundary
 * (negative: back along the face before the corner, counter-clockwise). */
function near(q: number, h: number, along: number, z: number): V3 {
  const ang = (q * Math.PI) / 2 - Math.PI / 4
  const c = [Math.round(Math.SQRT2 * Math.cos(ang)) * h, Math.round(Math.SQRT2 * Math.sin(ang)) * h]
  const n = (q * Math.PI) / 2 - (along < 0 ? Math.PI / 2 : 0) // the face's normal angle
  return [c[0] - Math.sin(n) * along, c[1] + Math.cos(n) * along, z]
}
/** Fan cap over a star-shaped ring around the axis. */
function fan(p: Part, ring: V3[], up: boolean) {
  const z = ring[0][2], o: V3 = [0, 0, z]
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    if (up) p.tri(o, a, b)
    else p.tri(o, b, a)
  }
}

// --- Lobby: recessed glazing under the first slab. ---
lobby.loft([sq(H - 1.5, 0), sq(H - 1.5, LOBBY)])

// --- Shaft: the window wall from the lobby to the parapet band. ---
const BAND = ROOF - 2 * FLOOR // the pale parapet band, two storeys
glass.loft([sq(H, LOBBY), sq(H, BAND)])

// --- Slabs every two storeys, pointed at the corners. ---
for (let z = LOBBY; z < BAND - 1; z += 2 * FLOOR) {
  const z0 = z - 0.65, z1 = z + 0.65
  const r0 = pointed(H + 1.1, 1.3, z0), r1 = pointed(H + 1.1, 1.3, z1)
  slabs.loft([r0, r1])
  fan(slabs, r1, true)
  fan(slabs, r0, false)
}

// --- The pale parapet band (two storeys) with its own slab at the foot. ---
{
  const r0 = pointed(H + 1.1, 1.3, BAND - 0.5), r1 = pointed(H + 1.1, 1.3, BAND + 0.5)
  slabs.loft([r0, r1])
  fan(slabs, r0, false)
  fan(slabs, r1, true)
  slabs.loft([sq(H + 0.2, BAND + 0.5), sq(H + 0.2, ROOF)])
  roof.cap(sq(H + 0.2, ROOF), true)
}

// --- Crown: the perforated grey box and the red sign panels. ---
{
  const c = 10.5
  screen.loft([sq(c, ROOF), sq(c, TOP)])
  screen.cap(sq(c, TOP), true)
  // sign panels: on the +x (SE) and -y (SW) faces, upper half of the box
  const z0 = TOP - 7, z1 = TOP - 3, w = 11
  sign.quad([c + 0.15, -w / 2, z0], [c + 0.15, w / 2, z0], [c + 0.15, w / 2, z1], [c + 0.15, -w / 2, z1])
  sign.quad([w / 2, -c - 0.15, z0], [-w / 2, -c - 0.15, z0], [-w / 2, -c - 0.15, z1], [w / 2, -c - 0.15, z1])
}

const parts = [
  { part: glass, material: { ...PALETTE.window, color: 0x7a8d99 } },
  { part: slabs, material: finish('mapfre-slab', 0xe9e8e3) },
  { part: roof, material: PALETTE.roof },
  { part: screen, material: finish('mapfre-crown', 0xb3b7b9) },
  { part: sign, material: finish('neon-mapfre', 0xd8483a) },
  { part: lobby, material: { ...PALETTE.entrance, color: 0x8f9ca6 } },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Torre Mapfre', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: TOP,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['way/54747170', 'way/308013864'],
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/barcelona-torre-mapfre.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
