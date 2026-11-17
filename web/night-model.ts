import { parseGlb, writeGlb } from '../src/glb'

const linear = (hex: string) => [1, 3, 5].map(i => (parseInt(hex.slice(i, i + 2), 16) / 255) ** 2.2)
const floodColor = linear('#ffeacf')
const lampColor = linear('#ffe7c4')
/** Same night palette and authored material conventions as tools/render.ts. */
export function nightColor(base: number[], name: string, flood: number, light = 1, emissive: number[] = []): number[] {
  const glow = name.startsWith('lamp') ? lampColor : name.startsWith('window') || name === 'entrance' ? [1, 0.72, 0.4]
    : name.startsWith('neon') ? base.slice(0, 3).map(v => Math.min(1, v * 1.3 + 0.04)) : null
  const f = Math.max(0, Math.min(1, flood)) * 0.9
  return base.slice(0, 3).map((v, i) => {
    const dim = v * light * 0.16 + [0.012, 0.016, 0.03][i]
    const lit = v * floodColor[i] * light
    return Math.min(1, Math.max(0, glow?.[i] ?? dim + (lit - dim) * f) + (emissive[i] ?? 0))
  })
}
/** A transient unlit, vertex-lit GLB for both renderers. Original geometry,
 * animation, UVs and textures stay intact; original downloads never change. */
export function nightGlb(bytes: Uint8Array, resourceBase?: string): Uint8Array {
  const { json, bin } = parseGlb(bytes)
  if (resourceBase) for (const image of json.images ?? []) {
    if (image.uri && !image.uri.startsWith('data:')) image.uri = new URL(image.uri, resourceBase).href
  }
  const chunks: Uint8Array[] = [bin]
  let length = bin.length
  const read = (index: number | undefined, vertex: number, fallback: number[]) => {
    const accessor = json.accessors?.[index!]
    if (!accessor) return fallback
    if (accessor.sparse || accessor.bufferView === undefined) throw new Error('Night lighting cannot read sparse attributes')
    const view = json.bufferViews[accessor.bufferView]
    if ((view.buffer ?? 0) !== 0) throw new Error('Night lighting requires embedded geometry')
    const widths: Record<number, number> = { 5121: 1, 5123: 2, 5126: 4 }
    const width = widths[accessor.componentType]
    const count = ({ SCALAR: 1, VEC3: 3, VEC4: 4 } as Record<string, number>)[accessor.type]
    if (!width || !count) throw new Error('Unsupported night lighting attribute')
    const data = new DataView(bin.buffer, bin.byteOffset, bin.byteLength)
    const offset = (view.byteOffset ?? 0) + (accessor.byteOffset ?? 0) + vertex * (view.byteStride ?? width * count)
    return Array.from({ length: count }, (_, k) => {
      const at = offset + k * width
      const v = width === 4 ? data.getFloat32(at, true) : width === 2 ? data.getUint16(at, true) : data.getUint8(at)
      return accessor.normalized && width !== 4 ? v / (width === 2 ? 65535 : 255) : v
    })
  }
  const materials = json.materials ?? []
  const nightMaterials = new Map<number | undefined, number>()
  for (const mesh of json.meshes ?? []) for (const primitive of mesh.primitives ?? []) {
    const material = materials[primitive.material] ?? {}
    const pbr = material.pbrMetallicRoughness ?? {}
    const base = pbr.baseColorFactor ?? [1, 1, 1, 1]
    const count = json.accessors[primitive.attributes.POSITION].count
    const colors = new Float32Array(count * 4)
    for (let i = 0; i < count; i++) {
      const vertex = read(primitive.attributes.COLOR_0, i, [1, 1, 1, 1])
      const normal = read(primitive.attributes.NORMAL, i, [0, 1, 0])
      const light = (0.72 + 0.28 * ((normal[0] * -0.408 + normal[1] * 0.816 + normal[2] * 0.408) * 0.5 + 0.5)) ** 2.2
      const flood = read(primitive.attributes._FLOODLIGHT, i, [0])[0]
      colors.set([...nightColor(base.map((v: number, k: number) => v * (vertex[k] ?? 1)), material.name ?? '', flood, light, material.emissiveFactor), (base[3] ?? 1) * (vertex[3] ?? 1)], i * 4)
    }
    const padding = (4 - length % 4) % 4
    if (padding) { chunks.push(new Uint8Array(padding)); length += padding }
    const bufferView = json.bufferViews.length
    json.bufferViews.push({ buffer: 0, byteOffset: length, byteLength: colors.byteLength, target: 34962 })
    chunks.push(new Uint8Array(colors.buffer))
    length += colors.byteLength
    primitive.attributes.COLOR_0 = json.accessors.length
    json.accessors.push({ bufferView, componentType: 5126, count, type: 'VEC4' })
    let index = nightMaterials.get(primitive.material)
    if (index === undefined) {
      const newIndex: number = json.materials?.length ?? 0
      index = newIndex
      json.materials ??= []
      json.materials.push({
        name: material.name, doubleSided: material.doubleSided,
        alphaMode: material.alphaMode, alphaCutoff: material.alphaCutoff,
        pbrMetallicRoughness: { baseColorFactor: [1, 1, 1, 1], ...(pbr.baseColorTexture ? { baseColorTexture: pbr.baseColorTexture } : {}) },
        extensions: { KHR_materials_unlit: {} },
      })
      nightMaterials.set(primitive.material, newIndex)
    }
    primitive.material = index
  }
  const output = new Uint8Array(length)
  let at = 0
  for (const chunk of chunks) { output.set(chunk, at); at += chunk.length }
  json.buffers[0].byteLength = length
  json.extensionsUsed = [...new Set([...(json.extensionsUsed ?? []), 'KHR_materials_unlit'])]
  return writeGlb({ json, bin: output })
}
