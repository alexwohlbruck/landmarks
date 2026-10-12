/**
 * Check models against the budget in STYLE.md.
 *
 *   bun tools/glb-stats.ts <id|model.glb> ...
 *
 * Prints, per model: triangles, size, materials (by name), the bounds in its
 * own frame (x east, y up, z south, metres) and its height, and flags
 * anything over budget: more than 5,000 triangles (6,500 is the ceiling for
 * the most complex models), more than 250 KB, more than six materials, or a
 * lowest point that isn't y = 0.
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { glbBounds, parseGlb, triangleCount } from '../src/glb'

const ROOT = join(import.meta.dir, '..')
const ids = process.argv.slice(2)
if (!ids.length) {
  console.error('usage: bun tools/glb-stats.ts <id|model.glb> ...')
  process.exit(1)
}
let over = 0
for (const id of ids) {
  const bytes = new Uint8Array(readFileSync(id.endsWith('.glb') ? id : join(ROOT, 'models', `${id}.glb`)))
  const { json } = parseGlb(bytes)
  const min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity]
  for (const mesh of json.meshes ?? [])
    for (const p of mesh.primitives) {
      const a = json.accessors[p.attributes.POSITION]
      for (let i = 0; i < 3; i++) (min[i] = Math.min(min[i], a.min[i])), (max[i] = Math.max(max[i], a.max[i]))
    }
  const tris = triangleCount(bytes), kb = bytes.length / 1024
  const mats: string[] = (json.materials ?? []).map((m: any) => m.name)
  // Hard limits fail the run; 5,000-6,500 triangles is allowed for the most complex models only.
  const hard = [
    tris > 6500 ? 'over 6,500 tris' : '',
    kb > 250 ? 'over 250 KB' : '',
    mats.length > 6 ? `${mats.length} materials (max 6)` : '',
    Math.abs(min[1]) > 0.05 ? `lowest point y = ${min[1].toFixed(2)}, not 0` : '',
  ].filter(Boolean)
  const soft = tris > 5000 && tris <= 6500 ? ['over 5,000 tris (complex models only)'] : []
  const flags = [...hard, ...soft]
  if (hard.length) over++
  const f = (v: number) => v.toFixed(1)
  console.log(
    `${id}  ${tris} tris  ${kb.toFixed(0)} KB  height ${f(glbBounds(bytes).height)} m  ` +
      `x ${f(min[0])}..${f(max[0])}  y ${f(min[1])}..${f(max[1])}  z ${f(min[2])}..${f(max[2])}  ` +
      `materials ${mats.join(',')}${flags.length ? '  !! ' + flags.join('; ') : ''}`,
  )
}
process.exitCode = over ? 1 : 0
