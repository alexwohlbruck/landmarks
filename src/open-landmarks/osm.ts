/**
 * The OSM elements a landmark replaces, as Open Landmarks records them:
 * current version, timestamp, tags and geometry. Fetched from the OSM API in
 * batches and cached on disk, since an export reads a few thousand elements.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs'

const API = 'https://api.openstreetmap.org/api/0.6'
const USER_AGENT = process.env.LANDMARKS_USER_AGENT ?? 'landmarks-tools/0.1 (+https://github.com/alexwohlbruck/landmarks)'
const BATCH = 200
export type Element = {
  type: 'node' | 'way' | 'relation'
  id: number
  version: number
  timestamp: string
  tags: Record<string, string>
  nodes?: number[]
  members?: Array<{ type: string; ref: number; role: string }>
  lat?: number
  lon?: number
}

/** Elements by ref, plus the refs `locate` found, under one key that is never a ref. */
type Store = Record<string, Element> & { located?: Record<string, string | null> }

export class Osm {
  private store: Store

  constructor(private cache: string) {
    this.store = existsSync(cache) ? JSON.parse(readFileSync(cache, 'utf8')) : {}
  }

  get(ref: string): Element {
    const e = this.store[ref]
    if (!e) throw new Error(`${ref} was not fetched`)
    return e
  }

  /** Fetch every ref, the ways and nodes they are made of, and nothing already cached. */
  async load(refs: string[]) {
    await this.fetch(refs)
    const members = refs.flatMap((r) => this.store[r]?.members?.map((m) => `${m.type}/${m.ref}`) ?? [])
    await this.fetch(members.filter((m) => m.startsWith('way/')))
    const ways = [...refs, ...members].map((r) => this.store[r]).filter((e) => e?.type === 'way')
    await this.fetch(ways.flatMap((w) => w!.nodes!.map((n) => `node/${n}`)))
    writeFileSync(this.cache, JSON.stringify(this.store))
  }

  private async fetch(refs: string[]) {
    const missing = [...new Set(refs)].filter((r) => !this.store[r])
    for (const type of ['node', 'way', 'relation'] as const) {
      const ids = missing.filter((r) => r.startsWith(`${type}/`)).map((r) => r.split('/')[1])
      for (let i = 0; i < ids.length; i += BATCH) {
        const url = `${API}/${type}s.json?${type}s=${ids.slice(i, i + BATCH).join(',')}`
        const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } })
        if (res.status === 404 || res.status === 410) {
          // One deleted element fails the whole batch; fall back to one at a time.
          for (const id of ids.slice(i, i + BATCH)) await this.fetchOne(type, id)
          continue
        }
        if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`)
        for (const e of (await res.json()).elements as Element[]) this.store[`${e.type}/${e.id}`] = { ...e, tags: e.tags ?? {} }
      }
    }
  }

  private async fetchOne(type: string, id: string) {
    const res = await fetch(`${API}/${type}/${id}.json`, { headers: { 'User-Agent': USER_AGENT } })
    if (!res.ok) return
    const e = (await res.json()).elements[0] as Element
    this.store[`${e.type}/${e.id}`] = { ...e, tags: e.tags ?? {} }
  }

  /**
   * The OSM element for a landmark that replaces nothing (a statue, a sign),
   * which a submission still has to cite: the feature tagged with its
   * Wikidata item nearby, else the nearest feature carrying its name, else
   * the nearest named attraction or structure it stands in or beside.
   */
  async locate(id: string, lng: number, lat: number, name: string, wikidata?: string): Promise<string | null> {
    const located = (this.store.located ??= {} as any) as Record<string, string | null>
    if (id in located) return located[id]
    const half = 250
    const dLat = half / 110_574, dLng = half / (111_320 * Math.cos((lat * Math.PI) / 180))
    const url = `${API}/map.json?bbox=${lng - dLng},${lat - dLat},${lng + dLng},${lat + dLat}`
    const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } })
    if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`)
    const elements = (await res.json()).elements as Element[]
    const nodes = new Map(elements.filter((e) => e.type === 'node').map((e) => [e.id, e]))
    const centre = (e: Element): [number, number] | null => {
      if (e.type === 'node') return [e.lon!, e.lat!]
      const pts = (e.nodes ?? []).map((n) => nodes.get(n)).filter(Boolean) as Element[]
      return pts.length ? [pts.reduce((s, p) => s + p.lon!, 0) / pts.length, pts.reduce((s, p) => s + p.lat!, 0) / pts.length] : null
    }
    const distance = (e: Element) => {
      const c = centre(e)
      return c ? Math.hypot((c[0] - lng) * 111_320 * Math.cos((lat * Math.PI) / 180), (c[1] - lat) * 110_574) : Infinity
    }
    const bare = name.replace(/\s*\(.*\)$/, '').toLowerCase()
    const SITE = /^(tourism|historic|man_made|leisure|attraction|amenity|building)$/
    const match = (e: Element) =>
      wikidata && e.tags?.wikidata === wikidata ? 0
        : e.tags?.name?.toLowerCase() === bare && distance(e) < 80 ? 1
          : e.tags?.name && Object.keys(e.tags).some((k) => SITE.test(k)) && distance(e) < 60 ? 2 : 3
    const best = elements.filter((e) => e.tags && match(e) < 3).sort((a, b) => match(a) - match(b) || distance(a) - distance(b))[0]
    const found = best ? `${best.type}/${best.id}` : null
    located[id] = found
    if (found) await this.load([found])
    writeFileSync(this.cache, JSON.stringify(this.store))
    return found
  }

  /** A way's ring, or a relation's outer rings, as [lng, lat] lists. Lines come back open. */
  rings(ref: string): Array<Array<[number, number]>> {
    const e = this.store[ref]
    if (!e) return []
    if (e.type === 'node') return [[[e.lon!, e.lat!]]]
    if (e.type === 'way') return [e.nodes!.map((n) => this.store[`node/${n}`]).filter(Boolean).map((n) => [n.lon!, n.lat!] as [number, number])]
    const outers = (e.members ?? []).filter((m) => m.type === 'way' && m.role !== 'inner').map((m) => this.rings(`way/${m.ref}`)[0] ?? [])
    return joinRings(outers)
  }
}

const same = (a: [number, number], b: [number, number]) => a[0] === b[0] && a[1] === b[1]

/** Join a multipolygon's outer ways end to end into closed rings. */
function joinRings(parts: Array<Array<[number, number]>>): Array<Array<[number, number]>> {
  const open = parts.filter((p) => p.length > 1).map((p) => [...p])
  const rings: Array<Array<[number, number]>> = []
  while (open.length) {
    let ring = open.shift()!
    for (let grew = true; grew && !same(ring[0], ring.at(-1)!);) {
      grew = false
      for (let i = 0; i < open.length; i++) {
        const p = open[i]
        if (same(ring.at(-1)!, p[0])) ring = [...ring, ...p.slice(1)]
        else if (same(ring.at(-1)!, p.at(-1)!)) ring = [...ring, ...[...p].reverse().slice(1)]
        else continue
        open.splice(i, 1)
        grew = true
        break
      }
    }
    rings.push(ring)
  }
  return rings
}
