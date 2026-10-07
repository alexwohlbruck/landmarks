/** Test helpers: build small models and read back where their vertices end up. */
import { Part, writeGlb, type V3 } from '../generators/mesh'
import { parseGlb } from '../src/glb'

export const material = { name: 'stone', color: 0x808080 }

/** A box in the map frame (x east, y north, z up) from corner a to corner b. */
export function box(a: V3, b: V3): Part {
  const part = new Part()
  const ring = (z: number): V3[] => [[a[0], a[1], z], [b[0], a[1], z], [b[0], b[1], z], [a[0], b[1], z]]
  part.loft([ring(a[2]), ring(b[2])])
  part.cap(ring(b[2]), true)
  part.cap(ring(a[2]), false)
  return part
}

export { writeGlb }

function read(json: any, bin: Uint8Array, index: number): number[][] {
  const a = json.accessors[index]
  const v = json.bufferViews[a.bufferView]
  const per = { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4 }[a.type as 'VEC3']!
  const start = (v.byteOffset ?? 0) + (a.byteOffset ?? 0)
  const f = new Float32Array(bin.slice(start, start + a.count * per * 4).buffer)
  return Array.from({ length: a.count }, (_, i) => Array.from(f.subarray(i * per, i * per + per)))
}

const trs = (t: number[], [x, y, z, w]: number[], s: number[]) => [
  (1 - 2 * (y * y + z * z)) * s[0], 2 * (x * y + w * z) * s[0], 2 * (x * z - w * y) * s[0], 0,
  2 * (x * y - w * z) * s[1], (1 - 2 * (x * x + z * z)) * s[1], 2 * (y * z + w * x) * s[1], 0,
  2 * (x * z + w * y) * s[2], 2 * (y * z - w * x) * s[2], (1 - 2 * (x * x + y * y)) * s[2], 0,
  t[0], t[1], t[2], 1,
]
const mul = (a: number[], b: number[]) => {
  const o = new Array(16).fill(0)
  for (let c = 0; c < 4; c++) for (let r = 0; r < 4; r++) for (let k = 0; k < 4; k++) o[c * 4 + r] += a[k * 4 + r] * b[c * 4 + k]
  return o
}

/**
 * Every vertex in world space (glTF axes) with the animation at keyframe
 * `k`, or with each node's own transform when `k` is undefined. Returns a
 * list per node, so a test can follow a moving part.
 */
export function worldVertices(glb: Uint8Array, k?: number): { node: number; positions: number[][]; normals: number[][] }[] {
  const { json, bin } = parseGlb(glb)
  const pose = new Map<string, number[]>()
  if (k !== undefined)
    for (const anim of json.animations ?? [])
      for (const ch of anim.channels) pose.set(`${ch.target.node}/${ch.target.path}`, read(json, bin, anim.samplers[ch.sampler].output)[k])
  const out: { node: number; positions: number[][]; normals: number[][] }[] = []
  const visit = (i: number, parent: number[]) => {
    const n = json.nodes[i]
    const local = n.matrix ?? trs(
      pose.get(`${i}/translation`) ?? n.translation ?? [0, 0, 0],
      pose.get(`${i}/rotation`) ?? n.rotation ?? [0, 0, 0, 1],
      pose.get(`${i}/scale`) ?? n.scale ?? [1, 1, 1],
    )
    const m = mul(parent, local)
    if (n.mesh !== undefined) {
      const positions: number[][] = []
      const normals: number[][] = []
      for (const p of json.meshes[n.mesh].primitives) {
        for (const [x, y, z] of read(json, bin, p.attributes.POSITION))
          positions.push([0, 1, 2].map((r) => m[r] * x + m[4 + r] * y + m[8 + r] * z + m[12 + r]))
        for (const [x, y, z] of read(json, bin, p.attributes.NORMAL))
          normals.push([0, 1, 2].map((r) => m[r] * x + m[4 + r] * y + m[8 + r] * z))
      }
      out.push({ node: i, positions, normals })
    }
    for (const c of n.children ?? []) visit(c, m)
  }
  for (const r of json.scenes[json.scene ?? 0].nodes) visit(r, [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])
  return out
}

/**
 * Where a placement puts a point of the model, in glTF axes: Parchment's
 * localMatrix (turn clockwise by the bearing, scale) plus the lift.
 */
export function place([x, y, z]: number[], { bearing = 0, scale = 1, elevation = 0 }) {
  const b = (bearing * Math.PI) / 180
  // Parchment maps model X to (cos b, sin b) and Z to (-sin b, cos b) in (east, south).
  const east = x * Math.cos(b) - z * Math.sin(b)
  const south = x * Math.sin(b) + z * Math.cos(b)
  return [east * scale, y * scale + elevation, south * scale]
}
