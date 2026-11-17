import type { Asset } from '../src/release'
import type { ModelInfo } from '../src/model-info'

export type DetailRow = [string, string]
const number = (n: number) => n.toLocaleString(undefined, { maximumFractionDigits: 3 })
const fileSize = (n: number) => `${number(n)} bytes (${number(n / 1000)} kB)`
const value = (v: unknown) => typeof v === 'string' ? v : JSON.stringify(v)
/** The identity/placement facts apply to the displayed version, not today's model. */
export function assetRows(a: Asset): DetailRow[] {
  return [
    ['Placement ID', a.id], ['Model ID', a.model], ['Name', a.name],
    ['Source', a.collection?.name ?? 'Landmarks'], ['Type', a.type ?? 'landmark'],
    ['Place', a.place?.name ?? 'Unspecified'], ['Place ID', a.place?.id ?? 'Unspecified'],
    ['Place ancestors', a.placeParents?.map(p => `${p.name} (${p.id})`).join(' → ') || 'None'],
    ['Tags', a.tags?.join(', ') || 'None'],
    ['Longitude', String(a.anchor[0])], ['Latitude', String(a.anchor[1])],
    ['Geographic bounds', a.bounds.join(', ')], ['Units', a.units], ['Axes', a.axes],
    ['Published heading', `${a.heading}°`], ['Authored bearing (baked)', a.placement ? `${a.placement.bearing}°` : 'Not supplied'],
    ['Authored scale (baked)', a.placement ? String(a.placement.scale) : 'Not supplied'],
    ['Elevation offset', `${a.elevation ?? 0} m`],
    ['Height / animation envelope', a.height === undefined ? 'Not supplied' : `${number(a.height)} m`],
    ['Minimum map zoom', String(a.minZoom)], ['Detail zoom', a.lods.detail ? String(a.detailZoom ?? 17) : 'No high LOD'],
    ['Entrance lights', String(a.entranceLights?.length ?? 0)],
    ['Review status', a.reviewStatus ?? 'Not supplied'], ['Model license', a.artisticLicense], ['Spatial data license', a.spatialDataLicense],
    ['Wikidata', a.wikidata ?? 'Not supplied'], ['Revision', a.revision],
  ]
}
export function geometryRows(lod: Asset['lods']['low'], info?: ModelInfo): DetailRow[] {
  return [
    ['GLB file size', fileSize(lod.bytes)], ['Gzip file size', fileSize(lod.gzip.bytes)],
    ['Triangle faces', number(info?.triangles ?? lod.triangles)],
    ['Face format', 'Triangulated glTF geometry; original n-gon counts are not retained'],
    ['Vertices (mesh instances)', info ? number(info.vertices) : 'Inspecting…'],
    ['Meshes / instances', info ? `${number(info.meshes)} / ${number(info.meshInstances)}` : 'Inspecting…'],
    ['Mesh primitives', info ? number(info.primitives) : 'Inspecting…'],
    ['Nodes', info ? number(info.nodes) : 'Inspecting…'],
    ['Materials', info ? `${info.materials.length}${info.materials.length ? ` · ${info.materials.join(', ')}` : ''}` : 'Inspecting…'],
    ['Textures', info ? info.textures ? String(info.textures) : 'None (0)' : 'Inspecting…'],
    ['Images', info ? String(info.images.length) : 'Inspecting…'],
    ['Animated', info ? info.animations.length ? `Yes · ${info.animations.length} clip(s)` : 'No' : 'Inspecting…'],
    ['Skins / morph targets', info ? `${info.skins} / ${info.morphTargets}` : 'Inspecting…'],
    ['glTF version', info?.gltfVersion ?? 'Inspecting…'],
    ['Export generator', info ? info.generator ?? 'Not supplied' : 'Inspecting…'],
    ['File copyright', info ? info.copyright ?? 'Not supplied' : 'Inspecting…'],
    ['Extensions used', info ? info.extensionsUsed.join(', ') || 'None' : 'Inspecting…'],
    ['Extensions required', info ? info.extensionsRequired.join(', ') || 'None' : 'Inspecting…'],
    ['GLB SHA-256', lod.sha256], ['Gzip SHA-256', lod.gzip.sha256], ['Gzip encoding', lod.gzip.encoding],
  ]
}
export function renderRows(element: HTMLElement, rows: DetailRow[]) {
  element.replaceChildren(...rows.flatMap(([label, text]) => {
    const dt = document.createElement('dt')
    dt.textContent = label
    const dd = document.createElement('dd')
    dd.textContent = text
    return [dt, dd]
  }))
}
/** Preserve and expose ALL published fields, including unrecognized upstream data.
 * Nested objects expand in place; never interpolate metadata as HTML. */
export function renderAllMetadata(element: HTMLElement, metadata: unknown) {
  const render = (data: unknown): HTMLElement => {
    if (data === null || typeof data !== 'object') {
      const span = document.createElement('span')
      span.textContent = data === null ? 'null' : String(data)
      return span
    }
    const list = document.createElement('dl')
    list.className = 'metadata-tree'
    for (const [key, v] of Object.entries(data)) {
      const dt = document.createElement('dt')
      dt.textContent = key
      const dd = document.createElement('dd')
      if (v !== null && typeof v === 'object' && Object.keys(v).length) {
        const details = document.createElement('details')
        const summary = document.createElement('summary')
        summary.textContent = Array.isArray(v) ? `${v.length} item(s)` : `${Object.keys(v).length} field(s)`
        details.append(summary, render(v))
        dd.append(details)
      } else dd.textContent = value(v) ?? 'Not supplied'
      list.append(dt, dd)
    }
    return list
  }
  element.replaceChildren(render(metadata))
}
