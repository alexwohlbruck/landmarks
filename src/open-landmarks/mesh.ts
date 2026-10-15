/**
 * Turn one of our GLBs into the static mesh Open Landmarks v1 accepts.
 *
 * Their validator wants a single untransformed node, opaque untextured
 * materials from their library, no animation, no degenerate triangles and no
 * normal pointing against its triangle's winding. Everything here works in
 * glTF axes (X east, Y up, Z south), as their audits do.
 */
import { parseGlb, writeGlb } from '../glb'

export type V3 = [number, number, number]

/** A material as authored: the sRGB hex the generator wrote, before our 2.2 gamma. */
export type SourceMaterial = { name: string; hex: number; roughness: number; metalness: number; textured: boolean; masked: boolean }

export type Triangle = { material: number; p: [V3, V3, V3]; n: [V3, V3, V3] }

export type FlatMesh = { materials: SourceMaterial[]; triangles: Triangle[] }

export const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
export const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
export const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
export const unit = (a: V3): V3 => {
  const l = Math.hypot(...a)
  return l ? [a[0] / l, a[1] / l, a[2] / l] : [0, 1, 0]
}

/** Our kit writes `pow(c / 255, 2.2)`; invert it to recover the authored byte. */
const authoredByte = (linear: number) => Math.round(255 * Math.pow(Math.max(0, Math.min(1, linear)), 1 / 2.2))

function reader(json: any, bin: Uint8Array) {
  const data = new DataView(bin.buffer, bin.byteOffset, bin.byteLength)
  const sizes: Record<number, number> = { 5121: 1, 5123: 2, 5125: 4, 5126: 4 }
  return (index: number): number[][] => {
    const a = json.accessors[index]
    const view = json.bufferViews[a.bufferView]
    const per = ({ SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4 } as Record<string, number>)[a.type]
    const size = sizes[a.componentType]
    const stride = view.byteStride || per * size
    const start = (view.byteOffset ?? 0) + (a.byteOffset ?? 0)
    const get = (at: number) =>
      a.componentType === 5126 ? data.getFloat32(at, true)
        : a.componentType === 5125 ? data.getUint32(at, true)
          : a.componentType === 5123 ? data.getUint16(at, true) : data.getUint8(at)
    return Array.from({ length: a.count }, (_, i) => Array.from({ length: per }, (_, k) => get(start + i * stride + k * size)))
  }
}

const identity = () => [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]

function multiply(a: number[], b: number[]) {
  const out = new Array(16).fill(0)
  for (let c = 0; c < 4; c++) for (let r = 0; r < 4; r++) for (let k = 0; k < 4; k++) out[c * 4 + r] += a[k * 4 + r] * b[c * 4 + k]
  return out
}

function nodeMatrix(node: any): number[] {
  if (node.matrix) return node.matrix.slice()
  const [x, y, z, w] = node.rotation ?? [0, 0, 0, 1]
  const [sx, sy, sz] = node.scale ?? [1, 1, 1]
  const [tx, ty, tz] = node.translation ?? [0, 0, 0]
  return [
    (1 - 2 * (y * y + z * z)) * sx, 2 * (x * y + w * z) * sx, 2 * (x * z - w * y) * sx, 0,
    2 * (x * y - w * z) * sy, (1 - 2 * (x * x + z * z)) * sy, 2 * (y * z + w * x) * sy, 0,
    2 * (x * z + w * y) * sz, 2 * (y * z - w * x) * sz, (1 - 2 * (x * x + y * y)) * sz, 0,
    tx, ty, tz, 1,
  ]
}

/**
 * Every triangle the default scene draws, in the model's own frame, with node
 * transforms applied. Animated nodes are taken in their rest pose: the
 * transform the node carries, which is the pose a static viewer sees.
 */
export function flatten(glb: Uint8Array): FlatMesh {
  const { json, bin } = parseGlb(glb)
  const read = reader(json, bin)
  const materials: SourceMaterial[] = (json.materials ?? []).map((m: any) => {
    const pbr = m.pbrMetallicRoughness ?? {}
    const [r, g, b] = (pbr.baseColorFactor ?? [1, 1, 1, 1]).map(authoredByte)
    return {
      name: m.name ?? '',
      hex: (r << 16) | (g << 8) | b,
      roughness: pbr.roughnessFactor ?? 1,
      metalness: pbr.metallicFactor ?? 1,
      textured: !!pbr.baseColorTexture,
      masked: (m.alphaMode ?? 'OPAQUE') !== 'OPAQUE',
    }
  })
  const triangles: Triangle[] = []
  const visit = (i: number, parent: number[]) => {
    const node = json.nodes[i]
    const m = multiply(parent, nodeMatrix(node))
    const point = ([x, y, z]: number[]): V3 => [
      m[0] * x + m[4] * y + m[8] * z + m[12],
      m[1] * x + m[5] * y + m[9] * z + m[13],
      m[2] * x + m[6] * y + m[10] * z + m[14],
    ]
    // Rigid turns and uniform scales only, so the matrix itself carries normals.
    const direction = ([x, y, z]: number[]): V3 => unit([m[0] * x + m[4] * y + m[8] * z, m[1] * x + m[5] * y + m[9] * z, m[2] * x + m[6] * y + m[10] * z])
    for (const prim of node.mesh !== undefined ? json.meshes[node.mesh].primitives : []) {
      if ((prim.mode ?? 4) !== 4) throw new Error(`primitive mode ${prim.mode} is not triangles`)
      const pos = read(prim.attributes.POSITION).map(point)
      const nrm = prim.attributes.NORMAL !== undefined ? read(prim.attributes.NORMAL).map(direction) : null
      const idx = prim.indices !== undefined ? read(prim.indices).map((v) => v[0]) : pos.map((_, k) => k)
      for (let t = 0; t < idx.length; t += 3) {
        const c = [idx[t], idx[t + 1], idx[t + 2]]
        const p = c.map((k) => pos[k]) as [V3, V3, V3]
        const face = unit(cross(sub(p[1], p[0]), sub(p[2], p[0])))
        triangles.push({ material: prim.material ?? 0, p, n: (nrm ? c.map((k) => nrm[k]) : [face, face, face]) as [V3, V3, V3] })
      }
    }
    for (const child of node.children ?? []) visit(child, m)
  }
  for (const root of json.scenes?.[json.scene ?? 0]?.nodes ?? []) visit(root, identity())
  return { materials, triangles }
}

/** Smaller than their degenerate threshold could ever see once in float32. */
const MIN_AREA_M2 = 1e-8

/**
 * Drop triangles with no area, and give any triangle whose corner normals
 * point against its winding its face normal, which is what their mesh audit
 * flags as inverted. The face normal is what a flat-shaded renderer would
 * have drawn there anyway.
 */
export function clean(triangles: Triangle[]): { triangles: Triangle[]; dropped: number; renormalled: number } {
  const out: Triangle[] = []
  let dropped = 0, renormalled = 0
  for (const t of triangles) {
    const p = t.p.map((v) => v.map(Math.fround)) as [V3, V3, V3]
    const c = cross(sub(p[1], p[0]), sub(p[2], p[0]))
    const area = Math.hypot(...c) / 2
    if (area < MIN_AREA_M2) {
      dropped++
      continue
    }
    const avg: V3 = [0, 1, 2].map((j) => (t.n[0][j] + t.n[1][j] + t.n[2][j]) / 3) as V3
    // Not merely "opposed": a corner normal near perpendicular to its face
    // still reads as inverted to the audit once averaged, so require a margin.
    if (dot(c, avg) < area * 0.05) {
      const face = unit(c)
      out.push({ ...t, p, n: [face, face, face] })
      renormalled++
    } else out.push({ ...t, p })
  }
  return { triangles: out, dropped, renormalled }
}

/**
 * A static GLB: one node, one mesh, a primitive per material. Corners are
 * shared only where position and normal are bit-identical, so welding can
 * never collapse a thin triangle.
 */
export function writeStatic(name: string, triangles: Triangle[], materials: Array<{ name: string; pbr: object }>): Uint8Array {
  const views: any[] = [], accessors: any[] = [], primitives: any[] = [], chunks: Uint8Array[] = []
  let length = 0
  const push = (bytes: Uint8Array, target: number) => {
    views.push({ buffer: 0, byteOffset: length, byteLength: bytes.length, target })
    chunks.push(bytes)
    length += bytes.length + ((4 - (bytes.length % 4)) % 4)
    if (bytes.length % 4) chunks.push(new Uint8Array((4 - (bytes.length % 4)) % 4))
    return views.length - 1
  }
  const used: typeof materials = []
  materials.forEach((m, index) => {
    const mine = triangles.filter((t) => t.material === index)
    if (!mine.length) return
    const key = new Map<string, number>()
    const pos: number[] = [], nrm: number[] = [], idx: number[] = []
    const f32 = new Float32Array(6)
    const bits = new Uint32Array(f32.buffer)
    for (const t of mine) for (let k = 0; k < 3; k++) {
      f32.set([...t.p[k], ...t.n[k]])
      const id = bits.join(',')
      let at = key.get(id)
      if (at === undefined) {
        at = pos.length / 3
        key.set(id, at)
        pos.push(...f32.subarray(0, 3))
        nrm.push(...f32.subarray(3, 6))
      }
      idx.push(at)
    }
    const P = new Float32Array(pos), N = new Float32Array(nrm)
    const I = pos.length / 3 > 65535 ? new Uint32Array(idx) : new Uint16Array(idx)
    const min = [0, 1, 2].map((k) => Math.min(...P.filter((_, i) => i % 3 === k)))
    const max = [0, 1, 2].map((k) => Math.max(...P.filter((_, i) => i % 3 === k)))
    const bytes = (a: ArrayBufferView) => new Uint8Array(a.buffer, a.byteOffset, a.byteLength)
    accessors.push({ bufferView: push(bytes(P), 34962), componentType: 5126, count: P.length / 3, type: 'VEC3', min, max })
    accessors.push({ bufferView: push(bytes(N), 34962), componentType: 5126, count: N.length / 3, type: 'VEC3' })
    accessors.push({ bufferView: push(bytes(I), 34963), componentType: I instanceof Uint32Array ? 5125 : 5123, count: I.length, type: 'SCALAR' })
    primitives.push({ attributes: { POSITION: accessors.length - 3, NORMAL: accessors.length - 2 }, indices: accessors.length - 1, material: used.length })
    used.push(m)
  })
  const json = {
    asset: { version: '2.0', generator: 'alexwohlbruck/landmarks open-landmarks export' },
    scene: 0,
    scenes: [{ name, nodes: [0] }],
    nodes: [{ name, mesh: 0 }],
    meshes: [{ name, primitives }],
    materials: used.map((m) => ({ name: m.name, pbrMetallicRoughness: m.pbr })),
    accessors,
    bufferViews: views,
    buffers: [{ byteLength: length }],
  }
  const bin = new Uint8Array(length)
  let at = 0
  for (const c of chunks) {
    bin.set(c, at)
    at += c.length
  }
  return writeGlb({ json, bin })
}

/**
 * Cut away everything below y = 0. Our models sink footings and basements
 * into the ground so a slope never shows a gap; Open Landmarks stands a model
 * on its lowest point instead, and wants nothing beneath it.
 */
export function clipBelowGround(triangles: Triangle[]): Triangle[] {
  const out: Triangle[] = []
  for (const t of triangles) {
    const above = t.p.map((p) => p[1] >= 0)
    if (above.every(Boolean)) {
      out.push(t)
      continue
    }
    if (!above.some(Boolean)) continue
    const poly: Array<{ p: V3; n: V3 }> = []
    for (let i = 0; i < 3; i++) {
      const j = (i + 1) % 3
      if (above[i]) poly.push({ p: t.p[i], n: t.n[i] })
      if (above[i] !== above[j]) {
        const s = t.p[i][1] / (t.p[i][1] - t.p[j][1])
        const at = (a: V3, b: V3): V3 => [0, 1, 2].map((k) => a[k] + s * (b[k] - a[k])) as V3
        const p = at(t.p[i], t.p[j])
        p[1] = 0
        poly.push({ p, n: unit(at(t.n[i], t.n[j])) })
      }
    }
    for (let i = 1; i < poly.length - 1; i++)
      out.push({ material: t.material, p: [poly[0].p, poly[i].p, poly[i + 1].p], n: [poly[0].n, poly[i].n, poly[i + 1].n] })
  }
  return out
}
