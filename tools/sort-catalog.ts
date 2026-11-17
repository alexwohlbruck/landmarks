/** Sort catalog.json's places, models and landmarks by id, in place.
 * bun tools/sort-catalog.ts
 *
 * `bun run validate` refuses an unsorted catalog: kept sorted, two pull
 * requests adding different landmarks touch different lines and both merge.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { formatCatalog } from '../src/catalog'

const file = join(import.meta.dir, '..', 'catalog.json')
writeFileSync(file, formatCatalog(JSON.parse(readFileSync(file, 'utf8'))))
