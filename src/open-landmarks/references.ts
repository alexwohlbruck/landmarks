/**
 * Reference photos for a submission, from the evidence header of its
 * generator. The header names Commons files in prose; each one is looked up
 * on Commons for its real author and licence, so a reference is only listed
 * when the file exists and says what it is.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs'

export type Reference = {
  title: string
  author: string
  license: string
  licenseUrl: string
  sourcePage: string
  use: 'visual-reference-only'
}

const API = 'https://commons.wikimedia.org/w/api.php'
const USER_AGENT = process.env.LANDMARKS_USER_AGENT ?? 'landmarks-tools/0.1 (+https://github.com/alexwohlbruck/landmarks)'
const FILE = /"([^"…]{3,160}\.(?:jpe?g|png|tiff?|webp))"/gi

/** The generator's leading comment, as plain paragraphs. */
export function header(source: string): string[] {
  const match = source.match(/^\/\*\*([\s\S]*?)\*\//)
  if (!match) return []
  const lines = match[1].split('\n').map((l) => l.replace(/^\s*\* ?/, ''))
  const paragraphs: string[] = []
  let current: string[] = []
  for (const line of lines) {
    const bullet = /^- /.test(line)
    if ((!line.trim() || bullet) && current.length) {
      paragraphs.push(current.join(' ').replace(/\s+/g, ' ').trim())
      current = []
    }
    if (line.trim()) current.push(line.replace(/^- /, ''))
  }
  if (current.length) paragraphs.push(current.join(' ').replace(/\s+/g, ' ').trim())
  return paragraphs.filter((p) => !/^bun generators\//.test(p))
}

export function citedFiles(source: string): string[] {
  const text = source.match(/^\/\*\*([\s\S]*?)\*\//)?.[1].replace(/\n\s*\* ?/g, ' ') ?? ''
  return [...new Set([...text.matchAll(FILE)].map((m) => m[1].trim()).filter((t) => !t.includes('/')))]
}

const strip = (html: string) => html.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/\s+/g, ' ').trim()

export class Commons {
  private store: Record<string, Reference | null>

  constructor(private cache: string) {
    this.store = existsSync(cache) ? JSON.parse(readFileSync(cache, 'utf8')) : {}
  }

  async resolve(titles: string[]): Promise<Array<Reference>> {
    const missing = titles.filter((t) => !(t in this.store))
    for (let i = 0; i < missing.length; i += 40) {
      const batch = missing.slice(i, i + 40)
      const params = new URLSearchParams({
        action: 'query', format: 'json', prop: 'imageinfo', iiprop: 'extmetadata|url',
        titles: batch.map((t) => `File:${t}`).join('|'),
      })
      const res = await fetch(`${API}?${params}`, { headers: { 'User-Agent': USER_AGENT } })
      if (!res.ok) throw new Error(`commons: HTTP ${res.status}`)
      const body = await res.json()
      const from = new Map<string, string>()
      for (const n of body.query?.normalized ?? []) from.set(n.to, n.from)
      for (const page of Object.values<any>(body.query?.pages ?? {})) {
        const asked = (from.get(page.title) ?? page.title).replace(/^File:/, '')
        const meta = page.imageinfo?.[0]?.extmetadata
        const author = meta?.Artist?.value ? strip(meta.Artist.value) : ''
        const license = meta?.LicenseShortName?.value ? strip(meta.LicenseShortName.value) : ''
        const licenseUrl = meta?.LicenseUrl?.value ?? (/public domain|pd/i.test(license) ? page.imageinfo?.[0]?.descriptionurl : '')
        this.store[asked] = page.missing === undefined && author && license && /^https?:\/\//.test(licenseUrl ?? '')
          ? {
            title: page.title,
            author,
            license,
            licenseUrl: licenseUrl.replace(/^http:/, 'https:'),
            sourcePage: page.imageinfo[0].descriptionurl.replace(/^http:/, 'https:'),
            use: 'visual-reference-only',
          }
          : null
      }
      for (const t of batch) if (!(t in this.store)) this.store[t] = null
    }
    writeFileSync(this.cache, JSON.stringify(this.store))
    return titles.map((t) => this.store[t]).filter((r): r is Reference => !!r)
  }
}
