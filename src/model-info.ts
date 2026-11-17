import { parseGlb } from './glb'

export type ModelInfo = {
  triangles: number
  vertices: number
  meshes: number
  meshInstances: number
  primitives: number
  nodes: number
  materials: string[]
  textures: number
  images: { name: string; mimeType: string | null; embedded: boolean; bytes: number | null; uri?: string }[]
  animations: { name: string; durationSeconds: number | null; channels: number; keyframes: number; targets: string[] }[]
  skins: number
  morphTargets: number
  generator: string | null
  gltfVersion: string
  copyright: string | null
  extensionsUsed: string[]
  extensionsRequired: string[]
}

/** Inspect the actual file, rather than inferring animation or textures from names.
 * Faces are glTF triangles, including strips/fans. Counts include mesh instances
 * referenced by nodes; vertices share POSITION accessors within each instance. */
export function inspectGlb(bytes: Uint8Array): ModelInfo {
  const { json, bin } = parseGlb(bytes)
  let triangles = 0
  let vertices = 0
  let meshInstances = 0
  for (const node of json.nodes ?? []) {
    if (node.mesh === undefined) continue
    meshInstances++
    const positions = new Set<number>()
    for (const p of json.meshes[node.mesh].primitives ?? []) {
      const position = p.attributes?.POSITION
      if (position !== undefined) positions.add(position)
      const n = json.accessors[p.indices ?? position]?.count ?? 0
      const mode = p.mode ?? 4
      if (mode === 4) triangles += Math.floor(n / 3)
      else if (mode === 5 || mode === 6) triangles += Math.max(0, n - 2)
    }
    for (const index of positions) vertices += json.accessors[index].count
  }
  const animations = (json.animations ?? []).map((a: any, index: number) => {
    let start = Infinity
    let end = -Infinity
    let keyframes = 0
    let readable = true
    const inputs = new Set<number>((a.samplers ?? []).map((s: any) => s.input))
    for (const input of inputs) {
      const accessor = json.accessors?.[input]
      if (!accessor) { readable = false; continue }
      keyframes += accessor.count
      if (accessor.min?.length && accessor.max?.length) {
        start = Math.min(start, accessor.min[0])
        end = Math.max(end, accessor.max[0])
      } else {
        const view = json.bufferViews?.[accessor.bufferView]
        if (!view || accessor.componentType !== 5126 || accessor.sparse || accessor.type !== 'SCALAR' || (view.buffer ?? 0) !== 0) { readable = false; continue }
        const data = new DataView(bin.buffer, bin.byteOffset, bin.byteLength)
        for (let k = 0; k < accessor.count; k++) {
          const value = data.getFloat32((view.byteOffset ?? 0) + (accessor.byteOffset ?? 0) + k * (view.byteStride ?? 4), true)
          start = Math.min(start, value)
          end = Math.max(end, value)
        }
      }
    }
    return {
      name: a.name ?? `Animation ${index + 1}`,
      durationSeconds: readable && Number.isFinite(start) && Number.isFinite(end) ? end - start : null,
      channels: (a.channels ?? []).length,
      keyframes,
      targets: [...new Set<string>((a.channels ?? []).map((c: any) => `${json.nodes?.[c.target?.node]?.name ?? `Node ${c.target?.node}`} · ${c.target?.path ?? 'unknown'}`))],
    }
  })
  return {
    triangles, vertices, meshes: (json.meshes ?? []).length, meshInstances,
    primitives: (json.meshes ?? []).reduce((n: number, m: any) => n + (m.primitives ?? []).length, 0),
    nodes: (json.nodes ?? []).length,
    materials: (json.materials ?? []).map((m: any, i: number) => m.name ?? `Material ${i + 1}`),
    textures: (json.textures ?? []).length,
    images: (json.images ?? []).map((img: any, i: number) => ({
      name: img.name ?? `Image ${i + 1}`, mimeType: img.mimeType ?? null,
      embedded: img.bufferView !== undefined || img.uri?.startsWith('data:') === true,
      bytes: img.bufferView !== undefined ? json.bufferViews?.[img.bufferView]?.byteLength ?? null : null,
      ...(img.uri ? { uri: img.uri.startsWith('data:') ? 'data URI' : img.uri } : {}),
    })),
    animations,
    skins: (json.skins ?? []).length,
    morphTargets: (json.meshes ?? []).reduce((n: number, m: any) => n + (m.primitives ?? []).reduce((n: number, p: any) => n + (p.targets ?? []).length, 0), 0),
    generator: json.asset?.generator ?? null, gltfVersion: json.asset?.version ?? 'Unknown', copyright: json.asset?.copyright ?? null,
    extensionsUsed: json.extensionsUsed ?? [], extensionsRequired: json.extensionsRequired ?? [],
  }
}
