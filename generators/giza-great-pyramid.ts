/**
 * Great Pyramid of Giza (Pyramid of Khufu), Giza: procedural, CC0-1.0.
 * bun generators/giza-great-pyramid.ts
 *
 * This file also holds the shared kit for the three Giza pyramids
 * (giza-great-pyramid, giza-pyramid-of-khafre, giza-pyramid-of-menkaure):
 * `buildPyramid` below. The Great Pyramid's own build runs under
 * `import.meta.main`, so importing the kit builds nothing.
 *
 * Map frame: x east, y north, z up, metres; bearing 0 (the pyramids are
 * aligned to the cardinal points within a fraction of a degree, and OSM's
 * outlines run at 0 and 90 degrees). The origin is the centre of OSM's
 * outline; y = 0 is the pyramid's base. tools/terrain.ts could not check the
 * site (Mapterhorn has no z15 tiles here); elevation is 0.
 *
 * Built c. 2560 BC for Khufu: the largest of the three, its outer casing
 * long gone, so its faces show the stepped core courses; a flat platform
 * where the top ~8 m are missing.
 *
 * Published (Wikipedia, "Great Pyramid of Giza"): base 230.33 m square;
 * height 146.6 m as built, 138.5 m now; slope 51.84 degrees.
 * OSM: way/4420397 (height 138.8, an outline ~227 m square; the published
 * base is used, centred on it). Replaced.
 *
 * The kit: the core is a stack of 3 m courses (the real ones are ~0.5-1.5 m;
 * these are drawn coarse so the stepping reads as texture without
 * shimmering), each riser set at the slope's mid-height so the faces keep
 * the true angle; a flat top where the apex is missing; optionally a smooth
 * casing over the top of the faces (Khafre), a granite band at the foot and
 * a breach on the north face (Menkaure).
 *
 * Night: the pyramids are floodlit warm (the Sound and Light show), as a
 * `floodlight` wash on every face.
 *
 * Photos (Wikimedia Commons):
 * - "All Gizah Pyramids.jpg", Ricardo Liberato, CC BY-SA 2.0 (all three, from the south-west)
 * - "Pyramid of Khafre Giza Egypt in 2015 2.jpg", MusikAnimal, CC BY-SA 3.0
 * - "Pyramid of Menkaure in Giza May 2015.JPG", MusikAnimal, CC BY-SA 4.0
 * - "The Sphinx and Pyramid of Khafre.jpg", kallerna, CC BY-SA 4.0
 * - "Great Sphinx of Giza, Giza, Egypt6.jpg", Diego Delso, CC BY-SA 3.0 (Khufu's courses behind)
 */
import { Part, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { finish } from './palette'

export type PyramidSpec = {
  name: string
  file: string
  /** Base, east-west and north-south (m). */
  base: [number, number]
  /** Height as built (the apex the slopes run to) and height now. */
  apex: number
  height: number
  core: number
  course?: number
  /** Smooth casing from this height to the top (Khafre). */
  casingFrom?: number
  /** Granite casing band at the foot, to this height (Menkaure). */
  graniteTo?: number
  /** A vertical breach in the north face: [x0, x1, z0, z1]. */
  breach?: [number, number, number, number]
}

export function buildPyramid(s: PyramidSpec) {
  const core = new Part(), casing = new Part(), granite = new Part(), shade = new Part()
  const hx = s.base[0] / 2, hy = s.base[1] / 2
  const half = (z: number): [number, number] => [hx * (1 - z / s.apex), hy * (1 - z / s.apex)]
  const top = s.casingFrom ?? s.height
  const dz = s.course ?? 3
  const n = Math.max(1, Math.round(top / dz))
  const ring = (a: number, b: number, z: number): V3[] => [[-a, -b, z], [a, -b, z], [a, b, z], [-a, b, z]]
  let prev: [number, number] | null = null
  for (let k = 0; k < n; k++) {
    const z0 = (top * k) / n, z1 = (top * (k + 1)) / n
    const [a, b] = half((z0 + z1) / 2)
    const part = s.graniteTo && z1 <= s.graniteTo + 0.01 ? granite : core
    // The riser: four walls from z0 to z1.
    const lo = ring(a, b, z0), hi = ring(a, b, z1)
    for (let i = 0; i < 4; i++) part.quad(lo[i], lo[(i + 1) % 4], hi[(i + 1) % 4], hi[i])
    // The tread under it: the ledge left by the course below.
    if (prev) {
      const o = ring(prev[0], prev[1], z0), inn = ring(a, b, z0)
      for (let i = 0; i < 4; i++) core.quad(o[i], o[(i + 1) % 4], inn[(i + 1) % 4], inn[i])
    }
    prev = [a, b]
  }
  if (s.casingFrom !== undefined) {
    // Smooth casing: from the last course's outer edge up the true slope.
    const [a0, b0] = half(s.casingFrom), [a1, b1] = half(s.height)
    const o = ring(prev![0], prev![1], s.casingFrom), lo = ring(a0 + 0.4, b0 + 0.4, s.casingFrom), hi = ring(a1, b1, s.height)
    for (let i = 0; i < 4; i++) {
      casing.quad(o[i], o[(i + 1) % 4], lo[(i + 1) % 4], lo[i])
      casing.quad(lo[i], lo[(i + 1) % 4], hi[(i + 1) % 4], hi[i])
    }
    casing.quad(hi[0], hi[1], hi[2], hi[3])
  } else {
    const t = ring(prev![0], prev![1], top)
    core.quad(t[0], t[1], t[2], t[3])
  }
  if (s.breach) {
    // A flush dark panel on the north face, following the slope.
    const [x0, x1, z0, z1] = s.breach
    const y = (z: number) => half(z)[1] + 0.35
    const nn: V3 = [0, Math.sin((Math.atan2(s.apex, hy))), Math.cos(Math.atan2(s.apex, hy))]
    shade.tri([x0, y(z0), z0], [x1, y(z0), z0], [x1 * 0.8, y(z1), z1], undefined, undefined, undefined, [nn, nn, nn])
    shade.tri([x0, y(z0), z0], [x1 * 0.8, y(z1), z1], [x0 * 0.8, y(z1), z1], undefined, undefined, undefined, [nn, nn, nn])
  }
  const lit = (_p: V3, nrm: V3) => (nrm[2] > 0.9 ? 0.5 : 0.9)
  const parts: Array<{ part: Part; material: MaterialSpec }> = [
    { part: core, material: { ...finish('giza-limestone', s.core), floodlight: lit } },
    { part: casing, material: { ...finish('giza-casing', 0xece1cb), floodlight: lit } },
    { part: granite, material: { ...finish('giza-granite', 0xb08b74), floodlight: lit } },
    { part: shade, material: finish('giza-breach', 0x9c8467) },
  ]
  return parts.filter((p) => p.part.triangles > 0)
}

export async function writePyramid(s: PyramidSpec) {
  const parts = buildPyramid(s)
  const triangles = parts.reduce((t, { part }) => t + part.triangles, 0)
  if (triangles > 5000) throw new Error(`${s.file}: triangle budget exceeded: ${triangles}`)
  const glb = writeGlb(s.name, parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
    bearing: 0, elevation: 0, height: s.height,
  })
  if (glb.length > 250_000) throw new Error(`${s.file}: size budget exceeded: ${glb.length} bytes`)
  const out = new URL(`../models/${s.file}`, import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}

if (import.meta.main) {
  await writePyramid({
    name: 'Great Pyramid of Giza', file: 'giza-great-pyramid.glb',
    base: [230.33, 230.33], apex: 146.6, height: 138.5, core: 0xd8bf98,
  })
}
