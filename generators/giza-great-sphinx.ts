/**
 * Great Sphinx of Giza: procedural, CC0-1.0.
 * bun generators/giza-great-sphinx.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0 (the Sphinx faces due
 * east, as OSM maps it). The origin is the outline's area centroid; y = 0 is
 * the floor of the hollow it was carved in.
 *
 * Carved c. 2500 BC from the bedrock of the plateau: a recumbent lion with a
 * human head in a nemes headdress, lying in a quarried enclosure below the
 * surrounding ground.
 *
 * Published (Wikipedia, "Great Sphinx of Giza"): 73 m long, 19 m wide,
 * 20 m high; the face about 4.1 m wide; the Dream Stele between the paws
 * 3.6 m high, of granite.
 * OSM (relation/7728526, a building relation): the outline way/540058405
 * (75 m long, 19 m wide) and its parts: the body way/24585237 (to 11 m), the
 * paws way/540058406 (4 m) and the head way/540058407 (11-20 m). All
 * replaced. Their plans set every plan dimension: the rump at x -34.4; the
 * hind legs widening the body to 9.4 m either side from x -26 to -7.5; the
 * narrow belly (5.5-6 m) between; the shoulders and upper forelegs out to
 * 8.5 m from x 12 to 22; the paws 2.6 to 7.9 m either side of the axis,
 * reaching x 40.7, with the chest between them at x 24.8; the head x 10.5
 * to 20.2 and 7.6 m wide.
 * From photos ("Great Sphinx of Giza, Giza, Egypt6.jpg", Diego Delso, CC BY-SA
 * 3.0, from the east; "Great Sphinx of Giza forequarters.jpg", kallerna, CC
 * BY-SA 4.0, from the south; "Great Sphinx of Giza (أبو الهول).jpg", Petar
 * Milošević, CC BY-SA 4.0, from the south-east; "The Sphinx and Pyramid of
 * Khafre.jpg", kallerna, CC BY-SA 4.0, from the south-east): the back
 * rising from the haunch to the shoulders; the chest stepping forward under
 * the chin in horizontal strata; the forelegs running out of the shoulders
 * into the long paws; the nemes flaring to the shoulders with the face
 * proud of it (about a quarter of the head's depth, from the south) and the
 * ears at its front edge; the tail curled round the right (south) hip.
 *
 * Elevation 0. The hollow's floor is the lowest ground under the outline,
 * which is where the map stands the model: its terrain here (Mapterhorn,
 * z12 only; `bun tools/terrain.ts check giza-great-sphinx --zoom 12`) falls
 * about 7 m from the plateau at the rump to the paws, so the hollow is
 * already in the ground and the rump sits up the slope, as it does on the
 * enclosure's rock. An earlier version sank the model 7 m for a hollow the
 * terrain didn't show, which buried it once the map drew terrain life-size.
 *
 * Estimated: every section of the body, legs and head between the photos'
 * profile points; the strata grooves (three, at the heights the bands show
 * from the east); the tail's path; the face's relief.
 * Left out: the eyes, mouth and broken nose, the stripes of the nemes, the
 * enclosure.
 *
 * Night: floodlit warm (the Sound and Light show).
 */
import { cross, Part, sub, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { finish } from './palette'
import { prism } from './sf-de-young'

const stone = new Part()
const granite = new Part()

const unit = (v: V3): V3 => {
  const l = Math.hypot(...v) || 1
  return [v[0] / l, v[1] / l, v[2] / l]
}

/**
 * Smooth-shaded skin over a grid of points, grid[k][i]: k along the form,
 * i around it. `closed` wraps i. Normals come from the grid's neighbours and
 * are turned away from centres[k], so `tri` winds every face outward.
 */
function skin(part: Part, grid: V3[][], centres: V3[], closed: boolean) {
  const K = grid.length, N = grid[0].length
  const at = (k: number, i: number) => grid[Math.max(0, Math.min(K - 1, k))][closed ? (i + N) % N : Math.max(0, Math.min(N - 1, i))]
  const normal = (k: number, i: number): V3 => {
    let n = unit(cross(sub(at(k, i + 1), at(k, i - 1)), sub(at(k + 1, i), at(k - 1, i))))
    const out = sub(grid[k][i], centres[k])
    if (n[0] * out[0] + n[1] * out[1] + n[2] * out[2] < 0) n = [-n[0], -n[1], -n[2]]
    return n
  }
  const nrm = grid.map((row, k) => row.map((_, i) => normal(k, i)))
  for (let k = 0; k < K - 1; k++)
    for (let i = 0; i < (closed ? N : N - 1); i++) {
      const j = (i + 1) % N
      const a = grid[k][i], b = grid[k][j], c = grid[k + 1][j], d = grid[k + 1][i]
      stoneTri(part, a, b, c, [nrm[k][i], nrm[k][j], nrm[k + 1][j]])
      stoneTri(part, a, c, d, [nrm[k][i], nrm[k + 1][j], nrm[k + 1][i]])
    }
}
const stoneTri = (part: Part, a: V3, b: V3, c: V3, n: V3[]) => part.tri(a, b, c, [0, 0], [0, 0], [0, 0], n)

/** A flat fan over an end ring, facing away from `inside`. */
function capRing(part: Part, ring: V3[], inside: V3) {
  const c: V3 = [0, 1, 2].map((a) => ring.reduce((s, p) => s + p[a], 0) / ring.length) as V3
  const n = unit(sub(c, inside))
  for (let i = 0; i < ring.length - 1; i++) stoneTri(part, c, ring[i], ring[i + 1], [n, n, n])
}

/**
 * A section across a ground-hugging mass at x: a rounded arch of half-width
 * a and height h about y = yc, standing on z = 0, its sides cut by
 * horizontal strata grooves at the heights in `grooves`.
 */
type Station = { x: number; yc: number; a: number; h: number }
function arch({ x, yc, a, h }: Station, grooves: number[], p = 3, top = 6): V3[] {
  const sideTop = (grooves.at(-1) ?? 0) + 0.6
  const squash = Math.min(1, (0.8 * h) / Math.max(sideTop, 0.01))
  const width = (z: number) => a * Math.pow(Math.max(0, 1 - Math.pow(Math.min(1, z / h), p)), 1 / p)
  const side: [number, number][] = [[a, 0]]
  for (const g of grooves) {
    const z = g * squash
    side.push([width(z - 0.3 * squash), z - 0.3 * squash], [width(z) - 0.45, z], [width(z + 0.3 * squash), z + 0.3 * squash])
  }
  // The dome: the superellipse's upper quarter from the last side level up.
  const zs = grooves.length ? sideTop * squash : 0.25 * h
  if (!grooves.length) side.push([width(zs), zs])
  const t0 = Math.asin(Math.pow(Math.min(1, zs / h), p / 2))
  for (let s = 1; s <= top; s++) {
    const t = t0 + ((Math.PI / 2 - t0) * s) / top
    side.push([a * Math.pow(Math.cos(t), 2 / p), h * Math.pow(Math.sin(t), 2 / p)])
  }
  const right = side.map(([u, z]) => [x, yc - u, z] as V3)
  const left = side.slice(0, -1).reverse().map(([u, z]) => [x, yc + u, z] as V3)
  return [...right, ...left]
}

/** A mass lofted along x through stations, its ends capped. */
function mass(part: Part, stations: Station[], grooves: number[], p = 3) {
  const grid = stations.map((s) => arch(s, grooves, p))
  const centres = stations.map((s): V3 => [s.x, s.yc, s.h * 0.3])
  skin(part, grid, centres, false)
  capRing(part, grid[0], [stations[1].x, stations[1].yc, stations[1].h * 0.3])
  const n = stations.length
  capRing(part, [...grid[n - 1]].reverse(), [stations[n - 2].x, stations[n - 2].yc, stations[n - 2].h * 0.3])
}

/** A rounded rectangle at height z: x from x0 to x1, y within ±w of yc. */
function rrect(x0: number, x1: number, w: number, z: number, yc = 0, rf = 0.35): V3[] {
  const hx = (x1 - x0) / 2, xc = (x0 + x1) / 2, r = rf * Math.min(hx, w)
  const pts: V3[] = []
  for (const [cx, cy, a0] of [[hx - r, w - r, 0], [-hx + r, w - r, 90], [-hx + r, -w + r, 180], [hx - r, -w + r, 270]] as [number, number, number][])
    for (let s = 0; s <= 3; s++) {
      const a = ((a0 + s * 30) * Math.PI) / 180
      pts.push([xc + cx + r * Math.cos(a), yc + cy + r * Math.sin(a), z])
    }
  return pts
}

/** A form lofted up z through rounded rectangles [z, x0, x1, w]. */
function column(part: Part, levels: [number, number, number, number][], yc = 0, rf = 0.35, bottom = true) {
  const grid = levels.map(([z, x0, x1, w]) => rrect(x0, x1, w, z, yc, rf))
  const centres = levels.map(([z, x0, x1]): V3 => [(x0 + x1) / 2, yc, z])
  skin(part, grid, centres, true)
  const top = grid[grid.length - 1], bot = grid[0]
  capRing(part, [...top, top[0]], [centres[0][0], yc, levels[0][0]])
  if (bottom) capRing(part, [...bot, bot[0]].reverse(), [centres[1][0], yc, levels[1][0]])
}

// The body: rump, back, belly and shoulders, cut by the strata bands. The
// back rises to the shoulders under the head; the chest steps down to the
// ground between the paws.
const STRATA = [2.6, 5.0, 7.3]
mass(stone, [
  { x: -34.4, yc: 0, a: 2.4, h: 3.6 },
  { x: -33.6, yc: 0, a: 4.6, h: 6.2 },
  { x: -32.0, yc: 0, a: 5.8, h: 7.8 },
  { x: -29.0, yc: 0, a: 6.2, h: 8.6 },
  { x: -22.0, yc: 0, a: 6.0, h: 8.8 },
  { x: -12.0, yc: 0, a: 5.8, h: 8.9 },
  { x: -2.0, yc: 0, a: 5.8, h: 9.2 },
  { x: 6.0, yc: 0, a: 6.0, h: 9.8 },
  { x: 11.0, yc: 0, a: 6.6, h: 10.5 },
  { x: 15.5, yc: 0, a: 6.8, h: 11.0 },
  { x: 19.5, yc: 0, a: 6.6, h: 10.6 },
  { x: 21.8, yc: 0, a: 6.0, h: 9.6 },
  { x: 23.6, yc: 0, a: 4.4, h: 7.8 },
  { x: 24.6, yc: 0, a: 3.4, h: 4.8 },
  { x: 24.9, yc: 0, a: 2.6, h: 2.0 },
], STRATA, 4)

// Each side: the haunch swelling off the rump, the hind leg folded forward
// along the ground to its paw; the foreleg running out of the shoulder,
// down and forward into the long paw.
for (const s of [1, -1]) {
  mass(stone, [
    { x: -32.6, yc: s * 4.6, a: 1.8, h: 4.2 },
    { x: -31.0, yc: s * 5.6, a: 3.0, h: 6.6 },
    { x: -27.5, yc: s * 6.2, a: 3.2, h: 7.2 },
    { x: -23.5, yc: s * 6.7, a: 2.7, h: 6.0 },
    { x: -20.0, yc: s * 7.4, a: 2.0, h: 3.6 },
    { x: -15.0, yc: s * 7.6, a: 1.8, h: 2.7 },
    { x: -9.0, yc: s * 7.6, a: 1.8, h: 2.5 },
    { x: -7.8, yc: s * 7.6, a: 1.4, h: 1.7 },
    { x: -7.4, yc: s * 7.6, a: 0.8, h: 0.8 },
  ], [2.6, 5.0])
  mass(stone, [
    { x: 6.0, yc: s * 4.6, a: 1.6, h: 4.5 },
    { x: 9.5, yc: s * 5.3, a: 2.4, h: 6.2 },
    { x: 13.0, yc: s * 5.6, a: 2.5, h: 6.0 },
    { x: 16.5, yc: s * 5.5, a: 2.45, h: 5.4 },
    { x: 19.5, yc: s * 5.3, a: 2.45, h: 4.9 },
    { x: 22.5, yc: s * 5.15, a: 2.45, h: 4.4 },
    { x: 27.0, yc: s * 5.1, a: 2.45, h: 4.0 },
    { x: 37.0, yc: s * 5.1, a: 2.45, h: 3.9 },
    { x: 39.6, yc: s * 5.1, a: 2.3, h: 3.6 },
    { x: 40.4, yc: s * 5.1, a: 1.9, h: 2.8 },
    { x: 40.8, yc: s * 5.1, a: 1.2, h: 1.4 },
  ], [2.6], 4)
}

// The tail: from under the rump, round the right (south) hip, along the
// ground beside the hind leg.
{
  const path: V3[] = [[-34.0, -1.6, 0.55], [-33.6, -4.4, 0.5], [-31.8, -7.4, 0.5], [-28.8, -9.4, 0.5], [-25.0, -9.95, 0.5], [-21.0, -9.9, 0.5], [-18.6, -9.5, 0.6]]
  const r = 0.5, sides = 8
  const grid: V3[][] = [], centres: V3[] = []
  path.forEach((p, k) => {
    const t = unit(sub(path[Math.min(k + 1, path.length - 1)], path[Math.max(k - 1, 0)]))
    const side = unit(cross(t, [0, 0, 1])), up: V3 = [0, 0, 1]
    const rk = k === path.length - 1 ? 0.3 : r
    grid.push(Array.from({ length: sides }, (_, i) => {
      const a = (i / sides) * 2 * Math.PI
      return [0, 1, 2].map((c) => p[c] + rk * (Math.cos(a) * side[c] + Math.sin(a) * up[c])) as V3
    }))
    centres.push(p)
  })
  skin(stone, grid, centres, true)
  capRing(stone, [...grid[path.length - 1], grid[path.length - 1][0]], path[path.length - 2])
}

// The neck, under the nemes and behind the chin.
column(stone, [[9.5, 11.4, 19.6, 4.0], [11.5, 11.6, 19.0, 3.7], [13.4, 12.0, 18.2, 3.3]], 0, 0.45, false)

// The nemes: a flat crown, its sides sloping out to the lappets that fall
// to the shoulders either side of the face.
column(stone, [
  [11.6, 11.8, 17.4, 4.8],
  [13.4, 11.0, 17.5, 4.8],
  [15.2, 10.6, 17.6, 4.3],
  [17.2, 10.6, 17.6, 3.6],
  [18.9, 11.0, 17.5, 3.0],
  [19.7, 11.6, 17.3, 2.7],
  [20.0, 12.2, 16.9, 2.4],
], 0, 0.3)

// The face, proud of the nemes: chin, cheeks, brow and the headband.
column(stone, [
  [13.0, 15.6, 18.9, 1.5],
  [13.8, 15.6, 19.6, 1.9],
  [15.2, 15.6, 20.0, 2.1],
  [16.6, 15.6, 20.2, 2.2],
  [17.7, 15.6, 20.0, 2.25],
  [18.6, 15.6, 19.3, 2.2],
  [19.1, 15.6, 18.4, 2.0],
], 0, 0.4)

// The ears, at the nemes' front edge beside the cheeks.
for (const s of [1, -1]) {
  const y0 = s * 2.05, y1 = s * 2.75
  prism(stone, [[17.3, Math.min(y0, y1)], [18.5, Math.min(y0, y1)], [18.5, Math.max(y0, y1)], [17.3, Math.max(y0, y1)]], 15.3, 17.3, stone, 0.25, true)
}

// The Dream Stele of Thutmose IV, against the chest between the paws: a
// round-topped granite slab.
{
  const x0 = 24.9, x1 = 25.6, w = 1.15, z0 = 2.5
  // Its outline in (y, z), anticlockwise seen from the east.
  const loop: [number, number][] = [[w, 0]]
  for (let s = 0; s <= 8; s++) loop.push([w * Math.cos((s / 8) * Math.PI), z0 + w * Math.sin((s / 8) * Math.PI)])
  loop.push([-w, 0])
  // The edge as quads, the faces as fans.
  const P = (x: number, [y, z]: [number, number]): V3 => [x, y, z]
  for (let i = 0; i < loop.length; i++) {
    const a = loop[i], b = loop[(i + 1) % loop.length]
    granite.quad(P(x0, a), P(x0, b), P(x1, b), P(x1, a))
  }
  const c: [number, number] = [0, z0 * 0.6]
  for (let i = 0; i < loop.length; i++) {
    const a = loop[i], b = loop[(i + 1) % loop.length]
    granite.tri(P(x1, c), P(x1, b), P(x1, a))
    granite.tri(P(x0, c), P(x0, a), P(x0, b))
  }
}

const lit = (_p: V3, n: V3) => (n[2] > 0.9 ? 0.5 : 0.9)
const parts: Array<{ part: Part; material: MaterialSpec }> = [
  { part: stone, material: { ...finish('sphinx-limestone', 0xd8bb90), floodlight: lit } },
  { part: granite, material: { ...finish('sphinx-granite', 0xc9a596), floodlight: lit } },
]
const triangles = stone.triangles + granite.triangles
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Great Sphinx of Giza', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 0, elevation: 0, height: 20,
})
if (glb.length > 250_000) throw new Error(`Size budget exceeded: ${glb.length} bytes`)
const out = new URL('../models/giza-great-sphinx.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
