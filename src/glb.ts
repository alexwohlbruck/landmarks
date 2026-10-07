/**
 * Reading, measuring and transforming binary glTF, for the release build.
 *
 * Dependency-free on purpose, like the generators: the models are small and
 * use a narrow slice of glTF (float positions and normals, optional PNG
 * textures, rigid-node animation), so a few hundred lines cover it.
 */

export type Gltf = { json: any; bin: Uint8Array }

const MAGIC = 0x46546c67 // "glTF"
const JSON_CHUNK = 0x4e4f534a
const BIN_CHUNK = 0x004e4942

/** Split a GLB into its JSON and a private copy of its BIN chunk. */
export function parseGlb(glb: Uint8Array): Gltf {
  const view = new DataView(glb.buffer, glb.byteOffset, glb.byteLength)
  if (glb.byteLength < 20 || view.getUint32(0, true) !== MAGIC) throw new Error('not a GLB')
  const length = view.getUint32(12, true)
  if (view.getUint32(16, true) !== JSON_CHUNK) throw new Error('GLB has no JSON chunk first')
  const json = JSON.parse(new TextDecoder().decode(glb.subarray(20, 20 + length)))
  const binAt = 20 + length + ((4 - (length % 4)) % 4)
  const bin = binAt + 8 <= glb.length && view.getUint32(binAt + 4, true) === BIN_CHUNK
    ? glb.slice(binAt + 8, binAt + 8 + view.getUint32(binAt, true))
    : new Uint8Array()
  return { json, bin }
}

/** The inverse of parseGlb: JSON padded with spaces, BIN with zeros. */
export function writeGlb({ json, bin }: Gltf): Uint8Array {
  const text = new TextEncoder().encode(JSON.stringify(json))
  const jsonBytes = new Uint8Array(text.length + ((4 - (text.length % 4)) % 4)).fill(0x20)
  jsonBytes.set(text)
  const binBytes = new Uint8Array(bin.length + ((4 - (bin.length % 4)) % 4))
  binBytes.set(bin)
  const hasBin = binBytes.length > 0
  const glb = new Uint8Array(12 + 8 + jsonBytes.length + (hasBin ? 8 + binBytes.length : 0))
  const view = new DataView(glb.buffer)
  view.setUint32(0, MAGIC, true)
  view.setUint32(4, 2, true)
  view.setUint32(8, glb.length, true)
  view.setUint32(12, jsonBytes.length, true)
  view.setUint32(16, JSON_CHUNK, true)
  glb.set(jsonBytes, 20)
  if (hasBin) {
    const at = 20 + jsonBytes.length
    view.setUint32(at, binBytes.length, true)
    view.setUint32(at + 4, BIN_CHUNK, true)
    glb.set(binBytes, at + 8)
  }
  return glb
}

const COMPONENTS: Record<string, number> = { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4, MAT4: 16 }

/**
 * A float accessor as a list of elements, each a view onto the BIN chunk so
 * writing to it writes the model. Interleaved views are followed by their
 * stride. Anything else (integer, sparse, no buffer view) is refused, since
 * the caller is about to move it and must not silently skip it.
 */
function floatElements(gltf: Gltf, index: number): { get(i: number): number[]; set(i: number, v: number[]): void; count: number; per: number } {
  const accessor = gltf.json.accessors?.[index]
  if (!accessor) throw new Error(`accessor ${index} does not exist`)
  if (accessor.componentType !== 5126) throw new Error(`accessor ${index} is not float`)
  if (accessor.sparse || accessor.bufferView === undefined) throw new Error(`accessor ${index} is sparse or has no buffer view`)
  const view = gltf.json.bufferViews[accessor.bufferView]
  if ((view.buffer ?? 0) !== 0) throw new Error(`accessor ${index} is not in the GLB's own buffer`)
  const per = COMPONENTS[accessor.type]
  const stride = view.byteStride || per * 4
  const start = (view.byteOffset ?? 0) + (accessor.byteOffset ?? 0)
  const data = new DataView(gltf.bin.buffer, gltf.bin.byteOffset, gltf.bin.byteLength)
  return {
    count: accessor.count,
    per,
    get(i) {
      return Array.from({ length: per }, (_, k) => data.getFloat32(start + i * stride + k * 4, true))
    },
    set(i, v) {
      for (let k = 0; k < per; k++) data.setFloat32(start + i * stride + k * 4, v[k], true)
    },
  }
}

/** Recompute an accessor's min/max after its values moved, where it has them. */
function refreshMinMax(gltf: Gltf, index: number) {
  const accessor = gltf.json.accessors[index]
  if (!accessor.min && !accessor.max) return
  const el = floatElements(gltf, index)
  const min = new Array(el.per).fill(Infinity)
  const max = new Array(el.per).fill(-Infinity)
  for (let i = 0; i < el.count; i++) {
    const v = el.get(i)
    for (let k = 0; k < el.per; k++) {
      min[k] = Math.min(min[k], v[k])
      max[k] = Math.max(max[k], v[k])
    }
  }
  accessor.min = min
  accessor.max = max
}

export type Placement = {
  /** Degrees clockwise from north that the model's north (-Z) is turned to. */
  bearing?: number
  scale?: number
  /** Metres the model's origin is lifted off the ground. */
  elevation?: number
}

type Quat = [number, number, number, number]

const quatMul = (a: Quat, b: Quat): Quat => {
  const [ax, ay, az, aw] = a
  const [bx, by, bz, bw] = b
  const q: Quat = [
    aw * bx + ax * bw + ay * bz - az * by,
    aw * by - ax * bz + ay * bw + az * bx,
    aw * bz + ax * by - ay * bx + az * bw,
    aw * bw - ax * bx - ay * by - az * bz,
  ]
  const n = Math.hypot(...q)
  return q.map((c) => c / n) as Quat
}

const isIdentityNode = (node: any) =>
  !node.matrix &&
  (!node.translation || node.translation.every((v: number) => v === 0)) &&
  (!node.rotation || (node.rotation[0] === 0 && node.rotation[1] === 0 && node.rotation[2] === 0 && node.rotation[3] === 1)) &&
  (!node.scale || node.scale.every((v: number) => v === 1))

/**
 * Bake a placement into a model, so it can be published with heading 0 and
 * scale 1, as Open Landmarks requires.
 *
 * The placement is one transform Q: turn clockwise by `bearing` about the
 * vertical through the origin, scale by `scale`, lift by `elevation`. It is
 * applied at the top of the scene and nowhere else:
 *
 *   - the static geometry in an untransformed root node has its vertices
 *     moved (positions by Q, normals by its rotation), so the root keeps no
 *     transform, which is the frame contract;
 *   - a node directly under that root (a moving part: a wheel, a cabin) has
 *     Q multiplied into its own transform, and into every keyframe of its
 *     animation, instead. Its vertices stay in its own frame, so its pivot
 *     and its clip still describe the same motion, just turned. Deeper nodes
 *     inherit Q from it and are left alone.
 *
 * A root that does carry a transform is treated like a moving part. Mesh
 * data shared between a baked root and a node that inherits Q would be moved
 * twice, so that is refused rather than drawn wrong.
 *
 * Returns the input unchanged when the placement is the identity, so a model
 * placed as authored keeps its exact bytes and hash.
 */
export function bakePlacement(glb: Uint8Array, placement: Placement): Uint8Array {
  const bearing = placement.bearing ?? 0
  const s = placement.scale ?? 1
  const e = placement.elevation ?? 0
  if (bearing % 360 === 0 && s === 1 && e === 0) return glb
  if (!(s > 0)) throw new Error(`scale ${s} must be positive`)

  const gltf = parseGlb(glb)
  const { json } = gltf
  if (json.extensionsRequired?.length) throw new Error(`cannot bake a model requiring ${json.extensionsRequired.join(', ')}`)

  // Clockwise from above, in glTF's X east / Z south: north (0,0,-1) goes to
  // (sin b, 0, -cos b), the way Parchment's localMatrix turns a model.
  const b = (bearing * Math.PI) / 180
  const c = Math.cos(b)
  const sn = Math.sin(b)
  const turn = ([x, y, z]: number[]) => [x * c - z * sn, y, x * sn + z * c]
  const point = (v: number[]) => {
    const [x, y, z] = turn(v)
    return [x * s, y * s + e, z * s]
  }
  // The same turn as a quaternion: a rotation of -b about +Y.
  const q: Quat = [0, Math.sin(-b / 2), 0, Math.cos(-b / 2)]

  const nodes: any[] = json.nodes ?? []
  const children = new Set(nodes.flatMap((n) => n.children ?? []))
  const roots: number[] = json.scenes?.[json.scene ?? 0]?.nodes ?? nodes.map((_, i) => i).filter((i) => !children.has(i))

  // What happens to each accessor, so one shared by two uses that disagree
  // is caught instead of being moved twice or not at all.
  const ops = new Map<number, string>()
  const claim = (accessor: number | undefined, op: string) => {
    if (accessor === undefined) return
    const had = ops.get(accessor)
    if (had && had !== op) throw new Error(`accessor ${accessor} is used both as ${had} and as ${op}`)
    ops.set(accessor, op)
  }

  const bakedMeshes = new Set<number>()
  const premultiplied = new Set<number>()
  for (const root of roots) {
    const node = nodes[root]
    if (isIdentityNode(node)) {
      if (node.mesh !== undefined) bakedMeshes.add(node.mesh)
      for (const child of node.children ?? []) premultiplied.add(child)
    } else premultiplied.add(root)
  }

  // Meshes drawn under a premultiplied node already get Q from above.
  const inherited = new Set<number>()
  const walk = (i: number) => {
    if (nodes[i].mesh !== undefined) inherited.add(nodes[i].mesh)
    for (const child of nodes[i].children ?? []) walk(child)
  }
  for (const i of premultiplied) walk(i)
  for (const m of bakedMeshes)
    if (inherited.has(m)) throw new Error(`mesh ${m} is drawn both by the root and by a moving node`)
  for (const m of inherited)
    for (const p of json.meshes[m].primitives) for (const a of Object.values(p.attributes)) claim(a as number, 'inherited')

  for (const m of bakedMeshes)
    for (const p of json.meshes[m].primitives) {
      if (p.targets?.length) throw new Error(`mesh ${m} has morph targets`)
      claim(p.attributes.POSITION, 'position')
      claim(p.attributes.NORMAL, 'direction')
      claim(p.attributes.TANGENT, 'direction')
    }

  for (const i of premultiplied) {
    const node = nodes[i]
    if (node.matrix) {
      const m = node.matrix as number[]
      // Q times a column-major matrix: each basis column turns and scales,
      // the translation column moves like a point.
      const out = [...m]
      for (const col of [0, 4, 8]) {
        const [x, y, z] = turn([m[col], m[col + 1], m[col + 2]])
        out[col] = x * s
        out[col + 1] = y * s
        out[col + 2] = z * s
      }
      ;[out[12], out[13], out[14]] = point([m[12], m[13], m[14]])
      node.matrix = out
      continue
    }
    node.translation = point(node.translation ?? [0, 0, 0])
    node.rotation = quatMul(q, (node.rotation ?? [0, 0, 0, 1]) as Quat)
    if (s !== 1) node.scale = (node.scale ?? [1, 1, 1]).map((v: number) => v * s)
  }

  for (const animation of json.animations ?? [])
    for (const channel of animation.channels ?? []) {
      const node = channel.target?.node
      const output = animation.samplers?.[channel.sampler]?.output
      if (node === undefined || !premultiplied.has(node)) {
        claim(output, 'inherited')
        continue
      }
      const interpolation = animation.samplers[channel.sampler].interpolation ?? 'LINEAR'
      if (interpolation === 'CUBICSPLINE') throw new Error(`node ${node}: cubic spline keyframes cannot be baked`)
      const path = channel.target.path
      if (path === 'translation') claim(output, 'position')
      else if (path === 'rotation') claim(output, 'rotation')
      else if (path === 'scale') claim(output, 'scale')
      else claim(output, 'inherited')
    }

  for (const [accessor, op] of ops) {
    if (op === 'inherited') continue
    const el = floatElements(gltf, accessor)
    for (let i = 0; i < el.count; i++) {
      const v = el.get(i)
      if (op === 'position') el.set(i, point(v))
      else if (op === 'direction') {
        const [x, y, z] = turn(v)
        el.set(i, v.length === 4 ? [x, y, z, v[3]] : [x, y, z])
      } else if (op === 'rotation') el.set(i, quatMul(q, v as Quat))
      else if (op === 'scale') el.set(i, v.map((k) => k * s))
    }
    refreshMinMax(gltf, accessor)
  }

  return writeGlb(gltf)
}

/** Triangles drawn, counting a mesh once per node that draws it. */
export function triangleCount(glb: Uint8Array): number {
  const { json } = parseGlb(glb)
  let count = 0
  for (const node of json.nodes ?? []) {
    if (node.mesh === undefined) continue
    for (const p of json.meshes[node.mesh].primitives) {
      if ((p.mode ?? 4) !== 4) continue
      const n = p.indices !== undefined ? json.accessors[p.indices].count : json.accessors[p.attributes.POSITION].count
      count += Math.floor(n / 3)
    }
  }
  return count
}

/**
 * The model's extent in its own metres: `height` above the origin, and
 * `radius`, the farthest it reaches from the origin in plan.
 *
 * Kept in step with Barrelman's `glbBounds` (src/services/landmarks.service.ts),
 * which sizes the models it imports the same way: static geometry from the
 * POSITION accessors' min/max carried through node transforms, and an
 * animated node as a sphere about its pivot that holds it in any pose.
 */
export function glbBounds(glb: Uint8Array): { height: number; radius: number } {
  const { json, bin } = parseGlb(glb)
  const nodes: any[] = json.nodes ?? []
  const boxOf = (primitive: any) => {
    const accessor = json.accessors?.[primitive.attributes?.POSITION]
    if (!accessor?.min || !accessor?.max) throw new Error('POSITION accessor has no min/max')
    return accessor as { min: number[]; max: number[] }
  }
  const corners = ({ min, max }: { min: number[]; max: number[] }) =>
    [0, 1, 2, 3, 4, 5, 6, 7].map((i) => [i & 1 ? max[0] : min[0], i & 2 ? max[1] : min[1], i & 4 ? max[2] : min[2]])

  type Motion = { translation?: number; scale?: number; path?: { min: number[]; max: number[] } | null }
  const moving = new Map<number, Motion>()
  for (const animation of json.animations ?? [])
    for (const channel of animation.channels ?? []) {
      const node = channel.target?.node
      if (node === undefined) continue
      const entry = moving.get(node) ?? {}
      moving.set(node, entry)
      const path: string = channel.target.path
      if (path !== 'translation' && path !== 'scale') continue
      const values = floats(json, bin, animation.samplers?.[channel.sampler]?.output)
      if (!values) throw new Error(`animated ${path} on node ${node} is not readable`)
      let most = entry[path] ?? 0
      for (let i = 0; i + 2 < values.length; i += 3) {
        const [x, y, z] = [values[i], values[i + 1], values[i + 2]]
        most = Math.max(most, path === 'translation' ? Math.hypot(x, y, z) : Math.max(Math.abs(x), Math.abs(y), Math.abs(z)))
      }
      entry[path] = most
      if (path !== 'translation' || entry.path === null) continue
      const interpolation = animation.samplers?.[channel.sampler]?.interpolation ?? 'LINEAR'
      if (interpolation !== 'LINEAR' && interpolation !== 'STEP') {
        entry.path = null
        continue
      }
      const box = entry.path ?? { min: [Infinity, Infinity, Infinity], max: [-Infinity, -Infinity, -Infinity] }
      for (let i = 0; i + 2 < values.length; i += 3)
        for (let k = 0; k < 3; k++) {
          box.min[k] = Math.min(box.min[k], values[i + k])
          box.max[k] = Math.max(box.max[k], values[i + k])
        }
      entry.path = box
    }

  const reach = (index: number): number => {
    const node = nodes[index]
    let most = 0
    for (const primitive of node.mesh !== undefined ? json.meshes?.[node.mesh]?.primitives ?? [] : []) {
      const position = floats(json, bin, primitive.attributes?.POSITION)
      if (position)
        for (let i = 0; i + 2 < position.length; i += 3)
          most = Math.max(most, Math.hypot(position[i], position[i + 1], position[i + 2]))
      else for (const c of corners(boxOf(primitive))) most = Math.max(most, Math.hypot(c[0], c[1], c[2]))
    }
    for (const child of node.children ?? []) {
      const m = nodeMatrix(nodes[child])
      const motion = moving.get(child)
      const shift = Math.max(Math.hypot(m[12], m[13], m[14]), motion?.translation ?? 0)
      most = Math.max(most, shift + Math.max(scaleOf(m), motion?.scale ?? 0) * reach(child))
    }
    return most
  }

  let height = 0
  let radius = 0
  const visit = (index: number, parent: number[]) => {
    const node = nodes[index]
    const motion = moving.get(index)
    if (motion) {
      const own = nodeMatrix(node)
      const scale = Math.max(scaleOf(own), motion.scale ?? 0)
      const swept = motion.translation !== undefined && motion.path ? motion.path : null
      const pivots = motion.translation === undefined ? [[own[12], own[13], own[14]]]
        : swept ? corners(swept) : [[0, 0, 0]]
      const r = scaleOf(parent) * ((swept ? 0 : motion.translation ?? 0) + scale * reach(index))
      for (const pivot of pivots) {
        const [cx, cy, cz] = transform(parent, pivot)
        height = Math.max(height, cy + r)
        radius = Math.max(radius, Math.hypot(cx, cz) + r)
      }
      return
    }
    const world = multiply(parent, nodeMatrix(node))
    for (const primitive of node.mesh !== undefined ? json.meshes?.[node.mesh]?.primitives ?? [] : [])
      for (const corner of corners(boxOf(primitive))) {
        const [x, y, z] = transform(world, corner)
        height = Math.max(height, y)
        radius = Math.max(radius, Math.hypot(x, z))
      }
    for (const child of node.children ?? []) visit(child, world)
  }
  const children = new Set(nodes.flatMap((n) => n.children ?? []))
  const roots = json.scenes?.[json.scene ?? 0]?.nodes ?? nodes.map((_, i) => i).filter((i) => !children.has(i))
  for (const root of roots) visit(root, IDENTITY)
  return { height, radius }
}

const IDENTITY = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]

function nodeMatrix(node: any): number[] {
  if (node?.matrix) return node.matrix
  const [x, y, z, w] = node?.rotation ?? [0, 0, 0, 1]
  const [sx, sy, sz] = node?.scale ?? [1, 1, 1]
  const [tx, ty, tz] = node?.translation ?? [0, 0, 0]
  return [
    (1 - 2 * (y * y + z * z)) * sx, 2 * (x * y + w * z) * sx, 2 * (x * z - w * y) * sx, 0,
    2 * (x * y - w * z) * sy, (1 - 2 * (x * x + z * z)) * sy, 2 * (y * z + w * x) * sy, 0,
    2 * (x * z + w * y) * sz, 2 * (y * z - w * x) * sz, (1 - 2 * (x * x + y * y)) * sz, 0,
    tx, ty, tz, 1,
  ]
}

function multiply(a: number[], b: number[]): number[] {
  const out = new Array(16).fill(0)
  for (let c = 0; c < 4; c++)
    for (let r = 0; r < 4; r++)
      for (let k = 0; k < 4; k++) out[c * 4 + r] += a[k * 4 + r] * b[c * 4 + k]
  return out
}

function transform(m: number[], [x, y, z]: number[]): number[] {
  return [0, 1, 2].map((r) => m[r] * x + m[4 + r] * y + m[8 + r] * z + m[12 + r])
}

function scaleOf(m: number[]): number {
  return Math.max(Math.hypot(m[0], m[1], m[2]), Math.hypot(m[4], m[5], m[6]), Math.hypot(m[8], m[9], m[10]))
}

function floats(json: any, bin: Uint8Array, index: number | undefined): Float32Array | null {
  const accessor = index === undefined ? undefined : json.accessors?.[index]
  if (!bin.length || !accessor || accessor.componentType !== 5126 || accessor.sparse || accessor.bufferView === undefined) return null
  const view = json.bufferViews?.[accessor.bufferView]
  const per = COMPONENTS[accessor.type]
  if (!view || !per || (view.byteStride && view.byteStride !== 4 * per)) return null
  const start = (view.byteOffset ?? 0) + (accessor.byteOffset ?? 0)
  const bytes = bin.slice(start, start + accessor.count * per * 4)
  return bytes.length === accessor.count * per * 4 ? new Float32Array(bytes.buffer) : null
}
