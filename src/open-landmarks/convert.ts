/**
 * One placement of one of our models, as the GLBs an Open Landmarks
 * submission carries.
 */
import { bakePlacement, parseGlb } from '../glb'
import { fitBudget, resolveMaterials, WINDOW, type Library, type LibraryEntry } from './materials'
import { clean, clipBelowGround, cross, dropSmallPieces, flatten, sub, writeStatic, type Triangle, type V3 } from './mesh'
import { attachWindows, demoteUnsupported } from './windows'

export type Lod = { glb: Uint8Array; triangles: number; min: V3; max: V3 }

export type Converted = {
  detail: Lod
  low: Lod
  /** Finishes the library needs for this model, and which of them are walls. */
  finishes: Record<string, LibraryEntry>
  supports: string[]
  merged: Array<{ from: string; into: string; deltaE: number }>
  report: { dropped: number; renormalled: number; attachedM2: number; detachedM2: number }
}

/**
 * Their low LOD budget. Over it, the low LOD keeps partly attached panels
 * whole, as glazing, then sheds its smallest pieces until it fits.
 */
const LOW = { triangles: 8000, bytes: 250_000 }
const fits = (lod: Lod) => lod.triangles <= LOW.triangles && lod.glb.length <= LOW.bytes

const linear = (hex: string) => [1, 3, 5].map((i) => {
  const c = parseInt(hex.slice(i, i + 2), 16) / 255
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
})

export function convert(
  id: string,
  model: string,
  bytes: Uint8Array,
  placement: { bearing?: number; scale?: number },
  library: Library,
): Converted {
  const flat = flatten(bakePlacement(bytes, placement))
  const resolved = resolveMaterials(model, flat.materials, library)
  const spec = (name: string) => resolved.finishes[name] ?? library.materials[name]
  const supportNames = new Set([...library.windowSupportMaterials, ...resolved.supports])

  const names = [...new Set([...resolved.names, resolved.glazing])]
  const base = clean(clipBelowGround(flat.triangles).map((t) => ({ ...t, material: names.indexOf(resolved.names[t.material]) })))

  const roles = () => ({
    window: names.indexOf(WINDOW),
    glazing: names.indexOf(resolved.glazing),
    supports: new Set(names.flatMap((n, i) => (supportNames.has(n) ? [i] : []))),
  })
  const build = (split: boolean, pieceM = 0) => {
    const attach = (triangles: Triangle[]) => {
      if (!names.includes(WINDOW)) return { triangles, attached: 0, detached: 0, dropped: 0 }
      const attached = attachWindows(triangles, { ...roles(), split })
      const cleaned = clean(attached.triangles)
      demoteUnsupported(cleaned.triangles, roles())
      return { ...attached, triangles: cleaned.triangles, dropped: cleaned.dropped }
    }
    // Folding a wall into another colour can strand its windows, so attach again after every fold.
    const into = new Map<string, string>()
    const final = (n: string): string => (into.has(n) ? final(into.get(n)!) : n)
    const merged: Converted['merged'] = []
    const source = pieceM ? dropSmallPieces(base.triangles, pieceM) : base.triangles
    let result = attach(source)
    for (;;) {
      const area = new Map<string, number>()
      for (const t of result.triangles) {
        const name = names[t.material]
        area.set(name, (area.get(name) ?? 0) + Math.hypot(...cross(sub(t.p[1], t.p[0]), sub(t.p[2], t.p[0]))) / 2)
      }
      const folds = fitBudget(area, (n) => spec(n).color)
      if (!folds.length) break
      for (const f of folds) into.set(f.from, f.into)
      merged.push(...folds)
      result = attach(source.map((t) => ({ ...t, material: names.indexOf(final(names[t.material])) })))
      result = { ...result, triangles: result.triangles.map((t) => ({ ...t, material: names.indexOf(final(names[t.material])) })) }
    }
    return { lod: write(id, result.triangles, names, spec), merged, attached: result, dropped: result.dropped }
  }

  const detail = build(true)
  let low = fits(detail.lod) ? detail : build(false)
  for (let piece = 0.25; !fits(low.lod); piece *= 2) {
    if (piece > 64) throw new Error(`low LOD cannot fit ${LOW.triangles} triangles and ${LOW.bytes} bytes`)
    low = build(false, piece)
  }

  const usedNames = new Set(parseGlb(detail.lod.glb).json.materials.map((m: any) => m.name))
  for (const m of parseGlb(low.lod.glb).json.materials) usedNames.add(m.name)
  const finishes = Object.fromEntries(Object.entries(resolved.finishes).filter(([n]) => usedNames.has(n)))
  return {
    detail: detail.lod,
    low: low.lod,
    finishes,
    supports: resolved.supports.filter((s) => usedNames.has(s)),
    merged: detail.merged,
    report: {
      dropped: base.dropped + detail.dropped,
      renormalled: base.renormalled,
      attachedM2: detail.attached.attached,
      detachedM2: detail.attached.detached,
    },
  }
}

function write(id: string, triangles: Triangle[], names: string[], spec: (name: string) => LibraryEntry): Lod {
  const min: V3 = [Infinity, Infinity, Infinity], max: V3 = [-Infinity, -Infinity, -Infinity]
  for (const t of triangles) for (const p of t.p) for (let k = 0; k < 3; k++) {
    min[k] = Math.min(min[k], p[k])
    max[k] = Math.max(max[k], p[k])
  }
  const materials = names.map((name) => {
    const { color, roughness, metalness } = spec(name)
    return { name, pbr: { baseColorFactor: [...linear(color), 1], metallicFactor: metalness, roughnessFactor: roughness } }
  })
  return { glb: writeStatic(id, triangles, materials), triangles: triangles.length, min, max }
}
