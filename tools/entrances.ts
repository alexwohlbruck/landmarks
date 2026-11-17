import type { ReadPrimitive } from '../generators/mesh'

/** Connected door-leaf geometry, including thresholds split across triangles. */
export function entranceThresholds(primitives: readonly ReadPrimitive[]) {
  const entrances: { material: string; points: [number, number, number][] }[] = []
  for (const p of primitives) {
    if (!/(^|-)door($|-)/i.test(p.material.name)) continue
    const groups: number[][] = []
    const owner = new Map<string, number>()
    const vertices = (index: number): [number, number, number] => [p.position[index * 3], p.position[index * 3 + 1], p.position[index * 3 + 2]]
    const key = (index: number) => vertices(index).map(v => v.toFixed(4)).join(',')
    for (let t = 0; t < p.index.length; t += 3) {
      const tri = [...p.index.slice(t, t + 3)]
      const seen = [...new Set(tri.map(i => owner.get(key(i))).filter((g): g is number => g !== undefined))]
      const group = seen[0] ?? groups.length
      if (group === groups.length) groups.push([])
      for (const old of seen.slice(1)) {
        groups[group].push(...groups[old])
        for (const i of groups[old]) owner.set(key(i), group)
        groups[old] = []
      }
      groups[group].push(...tri)
      for (const i of tri) owner.set(key(i), group)
    }
    for (const group of groups.filter(g => g.length)) {
      const points = [...new Map(group.map(i => [key(i), vertices(i)])).values()]
      // The two lowest polygon corners form the sill, including a sloping sill.
      entrances.push({ material: p.material.name, points: points.sort((a, b) => a[1] - b[1]).slice(0, 2) })
    }
  }
  return entrances
}
