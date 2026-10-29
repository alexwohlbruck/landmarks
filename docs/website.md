# Using the website

[Landmarks](https://landmarks.barrelman.dev/) combines this repository's
models with the OpenLandmarks collection. The site is a map, a searchable
collection, and a detail inspector for the selected model.

## Find a model

Search names, IDs, contributor names, LLM model names, GitHub usernames, tags,
and places. Combine the place, model-type, tag, and source filters to narrow
the list. Place filters include descendants: selecting Charlotte area also
includes Carowinds and Camp North End. Models are assigned to explicit places,
not whichever city happens to be closest.

Click a cluster to zoom into its area, then select a point, a map model, or a
search result. **Reset view** clears the filters and fits the collection.
The source label distinguishes local Landmarks models from OpenLandmarks.
Upstream drafts are labeled, and the detail inspector shows their review status.
Both collections' candidates remain in search when they cover the same feature;
the map draws the selected candidate, otherwise preferring the local model.

## Preview and appearance

The small preview auto-rotates slowly. Drag to orbit; scroll or pinch to zoom.
Rotation pauses during interaction and resumes after inactivity. Reduced-motion
preferences disable automatic rotation. The map does not auto-rotate.

**High LOD** is the preview default when the model has a high-detail file.
Choose **Low LOD** for the simpler geometry and smaller download. The selector
is hidden if there is only one LOD. The map chooses LOD by zoom, independently
of the preview selector. Statistics and download links follow the preview's
selected LOD.

The header's **Day / Night** switch controls appearance and model lighting
as one setting. Day uses the light interface and daylight models; Night uses
the dark interface and basemap with authored floodlights, warm windows,
entrances, lamps, and emissive materials in both preview and map models.
The switch initially follows the system's color-scheme preference, and saves
an explicit choice in this browser. There is no separate lighting toggle.
A model without authored lighting may simply appear dimmer. Switching modes
does not alter the downloaded GLB or its statistics and checksums.

## Model details

The inspector shows:

- Source collection, place, type, tags, description, and review status.
- Named human, organization, and AI contributors. AI credits show the model
  used separately from the assistant's name. GitHub usernames link to profiles
  and supply profile photos; Claude has its icon; other contributors use initials.
  Images that fail to load fall back to initials.
- The model's own artistic license, required attribution, and separate spatial
  data license. OpenLandmarks models and historical versions can have different
  licenses from the current local model.
- **Geometry & file:** exact GLB and gzip sizes, triangle faces, vertices,
  meshes and instances, primitives, nodes, materials, textures and images,
  animation clips and duration, channels, timestamp samples, affected nodes,
  skins, morph targets, exporter, glTF version, extensions, and checksums.
- **Replaced OSM features:** every declared `node/`, `way/`, and `relation/` ID,
  linked to OpenStreetMap. An empty list is explicitly identified.
- **Model & placement metadata:** model and placement IDs, full coordinates,
  bounds, axes, units, original bearing and scale, elevation, zoom thresholds,
  entrance-light count, Wikidata identity, and revision.
- **All published metadata** and **Metadata JSON:** every asset field, including
  upstream review information, modeling notes, references, and footprints.
- GLB/gzip, editable-source, original-source-page, metadata, OSM, Wikidata, and
  visual-reference links when available.

Face counts are triangles in the exported GLB. Original authoring n-gon counts
are not available. Vertex counts account for mesh instances, so instanced models
can have more displayed vertices than a single mesh definition. Heights can
include a conservative animation envelope rather than a surveyed building height.
Animation timestamp samples are not a rendered frame count.

Local statistics are measured during the build. Upstream files without those
statistics are inspected when selected. The inspector shows loading or
unavailable values rather than guessing that a file has no textures or animation.
Gzip files must be decompressed before opening in a normal model editor.

## History and sharing

For local models, **Version history** appears only when a past revision exists.
Select a version to update the preview, file statistics, credits, licenses,
metadata, and downloads together. A banner identifies the selected historical
commit. The map keeps the current placement. **Current version** restores the
latest model. OpenLandmarks entries link to the upstream collection for history.

Copy the address bar to share a selection:

```text
https://landmarks.barrelman.dev/#empire-state-building
https://landmarks.barrelman.dev/#open-landmarks--alcatraz-cellhouse
https://landmarks.barrelman.dev/#<placement-id>@<revision>
```

Filters, appearance preferences, camera orbit, and preview LOD are not encoded
in the share URL. A missing revision falls back to the current model with an
explanation. A partial Git checkout or unavailable historical snapshot is noted
in the inspector.

## When something cannot load

If one collection fails to load, the other can still be browsed. Refresh to
retry. A model load error offers a retry; a night-preview error can be retried
by switching back to Day mode. Without working map tiles or WebGL, collection
metadata and downloads remain available. Basemap tiles, fonts, GitHub avatars,
and upstream GLBs require their external hosts to be reachable.

OpenLandmarks metadata is a pinned snapshot, not a live query on every visit.
Maintainers update it with `bun run sync:sources` and rebuild the site. See
[the technical reference](reference.md#combining-sources) for source maintenance,
[the catalog schema](reference.md#public-metadata) for contribution fields, and
[the README](../README.md#running-and-publishing-the-demo) for local serving and
custom-domain setup.
