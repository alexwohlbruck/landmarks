/**
 * Map a model's materials onto Open Landmarks' material library.
 *
 * Their validator accepts a material only by name, at the library's exact
 * colour and surface. A material of ours that matches a library swatch takes
 * its name; any other colour becomes a landmark-specific finish, named after
 * the model, which the export adds to the library. Colour is never lost.
 */
import type { SourceMaterial } from './mesh'

export type LibraryEntry = { color: string; roughness: number; metalness: number }
export type Library = {
  materials: Record<string, LibraryEntry>
  windowSupportMaterials: string[]
  [key: string]: unknown
}

export type Resolved = {
  /** Library name for each source material, by index. */
  names: string[]
  /** Finishes this model needs that the library doesn't have yet. */
  finishes: Record<string, LibraryEntry>
  /** Finishes walls are made of, which may carry windows. */
  supports: string[]
  /** The finish window area off any wall becomes. */
  glazing: string
}

export const WINDOW = 'window'
const WINDOW_NAME = /^window(-\d+)?$/
const MAX_MATERIALS = 6

const hexOf = (n: number) => `#${n.toString(16).padStart(6, '0')}`
const near = (a: number, b: number) => Math.abs(a - b) < 1e-6
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

function lab(hex: string): [number, number, number] {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  const f = (t: number) => (t > 216 / 24389 ? Math.cbrt(t) : (24389 / 27 * t + 16) / 116)
  const x = f((0.4124 * r + 0.3576 * g + 0.1805 * b) / 0.9505)
  const y = f(0.2126 * r + 0.7152 * g + 0.0722 * b)
  const z = f((0.0193 * r + 0.1192 * g + 0.9505 * b) / 1.089)
  return [116 * y - 16, 500 * (x - y), 200 * (y - z)]
}
const distance = (a: string, b: string) => Math.hypot(...lab(a).map((v, i) => v - lab(b)[i]))

/** The library swatch this material already is, if any: same colour and roughness. */
function swatchFor(m: SourceMaterial, library: Library): string | undefined {
  const color = hexOf(m.hex)
  const same = (name: string) => {
    const e = library.materials[name]
    return e && e.color.toLowerCase() === color && near(e.roughness, m.roughness)
  }
  if (same(m.name)) return m.name
  return Object.keys(library.materials).find(
    (name) => same(name) && near(library.materials[name].metalness, m.metalness) && name !== WINDOW,
  )
}

export function resolveMaterials(model: string, materials: SourceMaterial[], library: Library): Resolved {
  const finishes: Record<string, LibraryEntry> = {}
  const supports = new Set<string>()
  const glazing = `${model}-glazing`
  const finish = (name: string, m: SourceMaterial) => {
    const id = name.startsWith(`${model}-`) ? name : `${model}-${slug(name)}`
    const entry = { color: hexOf(m.hex), roughness: m.roughness, metalness: 0 }
    const known = library.materials[id] ?? finishes[id]
    if (known && (known.color !== entry.color || !near(known.roughness, entry.roughness)))
      throw new Error(`finish ${id} already exists with another colour`)
    finishes[id] = entry
    return id
  }

  const names = materials.map((m) => {
    if (m.textured || m.masked) throw new Error(`material ${m.name} is textured or cut out; v1 takes plain opaque colour`)
    const swatch = swatchFor(m, library)
    if (WINDOW_NAME.test(m.name)) {
      if (swatch === WINDOW) return WINDOW
      // A tinted window keeps its tint as a finish: it no longer glows there.
      return finish(m.name, m)
    }
    if (swatch) return swatch
    const id = finish(m.name, m)
    if (!/glass|glazing/.test(m.name)) supports.add(id)
    return id
  })
  const window = library.materials[WINDOW]
  finishes[glazing] = { color: window.color, roughness: window.roughness, metalness: window.metalness }
  return { names, finishes, supports: [...supports], glazing }
}

/**
 * Fold materials together until at most six are left, their draw-call
 * budget, always the two closest colours in Lab, so near-duplicates go first
 * and a small accent in a colour of its own survives. Area only breaks ties.
 * `window` is never folded or folded into: the window audit and the night
 * glow depend on it.
 */
export function fitBudget(area: Map<string, number>, colorOf: (name: string) => string): Array<{ from: string; into: string; deltaE: number }> {
  const merged: Array<{ from: string; into: string; deltaE: number }> = []
  const sizes = new Map(area)
  while (sizes.size > MAX_MATERIALS) {
    let best: { from: string; into: string; deltaE: number; cost: number } | undefined
    for (const [from, a] of sizes)
      for (const into of sizes.keys())
        if (from !== into && from !== WINDOW && into !== WINDOW) {
          const deltaE = distance(colorOf(from), colorOf(into))
          const cost = deltaE + a * 1e-9
          if (!best || cost < best.cost) best = { from, into, deltaE, cost }
        }
    if (!best) throw new Error(`cannot fit ${MAX_MATERIALS} materials`)
    merged.push({ from: best.from, into: best.into, deltaE: Math.round(best.deltaE * 10) / 10 })
    sizes.set(best.into, sizes.get(best.into)! + sizes.get(best.from)!)
    sizes.delete(best.from)
  }
  return merged
}
