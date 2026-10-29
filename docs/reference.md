# Technical reference

How the catalog, the models and the release fit together. For the art style
see [`STYLE.md`](../STYLE.md); for the full process of making a batch, and
every tool in `tools/`, see [`workflow.md`](workflow.md).

## Layout

| Path | What |
|---|---|
| `catalog.json` | Every model and every placement of it |
| `models/<id>.glb` | The models, as the generators write them |
| `generators/<id>.ts` | One generator per model: the source of truth for its GLB |
| `generators/mesh.ts`, `palette.ts`, `coaster-kit.ts`, `bridge-kit.ts` | The shared kit the generators build with |
| `STYLE.md` | The art style, and how to build a model that holds up to review |
| `docs/` | This reference, the batch workflow, evidence rules and the agent briefs |
| `tools/` | Renderers for looking at models without a browser, evidence fetchers (lidar, OSM, photos), and the merge script |
| `src/` | The release build: validation, placement baking, the published format |
| `test/` | Tests for the build and the catalog |
| `web/app.ts`, `index.html`, `style.css` | Collection browser and model inspector |
| `web/credits.ts` | Contributor profiles, GitHub avatars, and initials |
| `web/model-details.ts`, `src/model-info.ts` | Metadata presentation and GLB statistics |
| `web/theme.ts`, `night-model.ts` | Interface/map themes and transient night rendering |
| `web/open-landmarks.json`, `upstream-places.json` | Pinned upstream metadata and explicit place associations |
| `src/history.ts` | Static model history generated from Git |
| `tools/sync-sources.ts` | Explicit upstream metadata refresh |


## Models and placements

The catalog keeps `models`, `landmarks` (placements), and `places`. Model
geometry, its placement, and the place used for discovery are separate records.

A **model** is a GLB plus its `license`, `credits` and `source` (its
generator), and optionally a `detail` GLB with a `detailZoom` (see Levels
of detail). A **landmark** places a model:

- `id` and `name`;
- `lng`/`lat` of the anchor;
- `bearing`: degrees clockwise from north that the model's north is turned to;
- `scale`, plus an optional `elevation` and `minzoom` (14 when absent);
  `elevation` is in metres, positive to raise the model and negative to sink
  it, within ±200 (0 when absent);
- `replaces`: the OSM elements it stands in for, as `way/123` or `relation/456`;
- `wikidata`, where the landmark has an item;
- `place`: an explicit, stable key in the catalog’s `places` list.

The Eiffel Tower model is placed twice: in Paris, and on the Las Vegas Strip
at `scale: 0.5`. The Statue of Liberty stands on Liberty Island with
`elevation: 10`, so her pedestal rests on Fort Wood's map geometry.

### Public metadata

Models accept the following fields in addition to geometry paths:

- `license`: an SPDX identifier, default `CC0-1.0`. Keep `attribution` for
  licenses requiring credit. `licenseUrl` links custom licenses.
- `credits`: named contributors with `kind` (`person`, `organization`, or `ai`),
  an optional `role`, optional HTTP(S) `url`, and optional `github` username.
  The legacy `author` is accepted when `credits` is absent. Published `authors` remains an array of names for
  Open Landmarks clients. Every AI credit must include a separate `model` field
  naming the actual model used, such as `Claude Opus 5.5`; `name` identifies
  the assistant (for example `Claude`). Never infer the model from a default.
  GitHub identities link to the profile and use its avatar. Claude uses the
  bundled Claude icon; other contributors without GitHub identities use initials.
  Failed image loads also fall back to initials. GitHub logins accept an optional
  `@` prefix; use `alexwohlbruck` as the stored form. A GitHub identity takes
  precedence over a custom profile URL and the default avatar. Current local
  models credit Alex Wohlbruck (`github: "alexwohlbruck"`) and Claude (`model: "Claude Opus 5.5"`).
- `type`: `landmark` (default), `building`, `bridge`, `coaster`, `ride`,
  `monument`, `sculpture`, `tower`, `fountain`, `stadium`, `infrastructure`,
  `landscape`, or `other`. Use one primary type; express finer categories as tags.
- `tags`: unique lowercase slugs, such as `museum`, `theme-park`, or `art-deco`.
- `collection`: dataset provenance, default `landmarks`; displayed as **Source**.
  This differs from `source`, which remains the generator/editable-file path
  for compatibility with the existing catalog and published API. Use `sourcePage`
  for the original model’s web page when importing another creator’s model.
- `description`, `references` (`title`, HTTP(S) `url`, optional `author` and
  `license`), and `reviewStatus` (`unreviewed`, `draft`, `reviewed`). Structural
  validation does not automatically mark a model as visually or legally reviewed.

A complete minimal catalog example (the file paths must exist before building):

```json
{
  "places": [
    { "id": "example-valley", "name": "Example Valley", "kind": "region" },
    { "id": "example-town", "name": "Example Town", "kind": "town", "parent": "example-valley" }
  ],
  "models": [
    {
      "id": "town-clock",
      "file": "models/town-clock.glb",
      "source": "generators/town-clock.ts",
      "collection": "landmarks",
      "type": "tower",
      "tags": ["clock-tower", "historic"],
      "reviewStatus": "unreviewed",
      "credits": [
        { "name": "Alex Wohlbruck", "kind": "person", "role": "creator", "github": "alexwohlbruck" },
        { "name": "Claude", "kind": "ai", "role": "procedural modeling", "model": "Claude Opus 5.5" }
      ]
    }
  ],
  "landmarks": [
    {
      "id": "town-clock",
      "name": "Town Clock",
      "model": "town-clock",
      "lng": -80.84,
      "lat": 35.23,
      "place": "example-town",
      "replaces": ["way/123"]
    }
  ]
}
```

The catalog's `places` list contains `{ id, name, kind, parent?, wikidata?, osm? }`.
Kinds are `city`, `town`, `village`, `region`, `site`, and `country`. Pick an
immutable slug independently of its display name, and add a Wikidata or typed
OSM identity when known. A remote region needs neither a city nor an external
identifier. Parent links support parks within regions, towns within regions,
and countries. Unknown parents and cycles fail validation. When a catalog has
places, every placement must reference one. The viewer filters by both a place
and its ancestors, and never assigns new landmarks to the nearest city.

### Replacing models and viewing versions

Update the existing generator and `models/<id>.glb` under the same model and
placement IDs. Update metadata and credits as needed, regenerate any detail
LOD, and commit the changed files together. Use a new ID for a different
physical feature, not a revision of the same feature. Run validation and
inspect renders before committing. Git stores the versions; no hand-maintained
version numbers or duplicate catalog entries are needed.

`bun run build` scans reachable catalog/model/source history (including merged
branches), publishes distinct asset revisions with their own original licenses,
credits, source and baked placement, and writes `/api/v1/history/<placement>.json`.
The current release remains deterministic independently of Git history. Historical
objects are content-addressed and included in every deployment, so a clean build
retains old downloads without relying on previous host contents. Old Barrelman
source paths are resolved to their relocated generator only when that file
exists in the same commit. Historical external source-page URLs are preserved
as `sourcePage` rather than treated as local files. Invalid historical snapshots are counted as
unavailable, never substituted with current geometry. Partial checkouts are
marked in the history response and inspector.

The history label and selector are hidden until at least one distinct past
revision is available; a single current version never gets a dropdown.

The website's version selector changes the preview, downloads, metadata, license,
and credits together. The map retains the current placement. A past version is
linked as `#<placement-id>@<revision>`; existing `#<placement-id>` links still work.
OpenLandmarks versions link back to their upstream collection for history.

Each history response is `{ complete, unavailable, versions }`. `complete` says
whether full Git ancestry was available; `unavailable` counts snapshots that
could not be built. A version contains `commit`, `date`, `message`, and its own
complete `asset`. `/api/v1/history.json` summarizes commit, version, and missing
snapshot counts. Current working-tree changes are shown as the current version;
only committed revisions can become historical snapshots.

### Combining sources

`bun run sync:sources` reads OpenLandmarks' preview pointer and pins its metadata
in `web/open-landmarks.json`. This includes approved models and clearly labeled
drafts. The sync is explicit; ordinary builds use the reviewed local snapshot.
When adding upstream coverage, update `web/upstream-places.json` and the place
records in `tools/sync-sources.ts`, then sync again. Unknown associations remain
unspecified instead of being snapped to a nearby city. Review the pinned release,
licenses, credits, URLs, and draft/approved status before committing the snapshot.
A failed refresh does not replace it with an empty collection.

Upstream model and source files keep absolute upstream URLs, and upstream
licenses, attribution, references, and review status are preserved. Local model
IDs are unchanged; upstream IDs use an `open-landmarks--` namespace in the UI.
The published local dataset API continues to contain only this repository's
models, so consumers do not import upstream models twice.

The map draws a single candidate for overlapping OSM/Wikidata identities:
selection wins, then a local model. All candidates remain in the list and source
filter. Upstream replacement footprints are used directly by the building mask.
Map attribution includes the artistic credits for visible non-CC0 models as well
as the basemap attribution. The inspector distinguishes model and spatial
licenses and shows source downloads, triangles, file size, height, coordinates,
OSM links, provenance, review status, and visual-reference credits.

The OpenLandmarks [Alcatraz page](https://open-landmarks.benmaps.fr/landmarks/alcatraz-cellhouse/)
informed these inspector additions. Useful later additions include preview
posters with opt-in 3D loading, dedicated crawlable model pages, and structured
review checklists; no approval is inferred from a passing geometry check.

### Elevation

The map stands every model on its terrain: it puts y = 0 on the lowest
ground under the footprint. `elevation` moves the model up or down from
there, for ground the terrain doesn't show. Leave it at 0 unless one of
these applies:

- **Something under the model that OSM doesn't map**, so the map draws no
  building for it to stand on: a plinth, a fort, a pier, a deck. Liberty
  stands 10 m up on Fort Wood. The Pacific Wheel stands 7.5 m up on the
  Santa Monica Pier.
- **A base below the street.** A stadium whose field is dug below the
  street around it keeps y = 0 at the field, and `elevation` is minus the
  depth: how far the field is below the street outside. Nationals Park's
  field is about 7 m below the street, so it would take `elevation: -7`. The map
  then sets the street-level parts of the model on the street, with terrain
  on or off, and hides whatever ends up below the ground.

Measure the depth from a section drawing, a published field level or
street-level imagery, not from the map's terrain. The terrain is often too
coarse, or older than the dig: it shows SoFi Stadium's field 1.9 m below the
street, where the real field is about 30 m down.

A positive value lifts the whole model rigidly. Its base no longer follows
the terrain, so don't use it to make up for a slope; the map handles slopes.

### The frame contract

Every model uses the same frame, so a client can place it from a position, a
bearing and a scale alone:

- **+Y is up, -Z is north, +X is east.**
- **Units are metres.**
- **The origin is the anchor, on the lowest ground the footprint touches.**
  The model stands on y = 0. With terrain on, the map samples the ground
  across the footprint and puts y = 0 at the lowest point, so on a slope the
  uphill side sinks into the hill rather than the downhill side floating.
- **There is no transform on the root node.** Moving parts are child nodes
  (see Animation in `STYLE.md`).

### Levels of detail

The website labels the base file **Low LOD** and `detail` **High LOD**.

A model is one GLB, its low level of detail, held to the budget in
`STYLE.md`. A model whose identity is in parts too thin or too many for that
budget, such as a bridge's suspenders, may add a finer GLB in the same frame:

    "detail": "models/<id>.detail.glb", "detailZoom": 16

A map draws the low model below `detailZoom` (17 when absent) and the detail
model from there up. The detail model is the whole landmark, not an
addition to the low one, and has Open Landmarks' detail budget: 40,000
triangles, 1.5 MB, six materials. The low model drops the thin parts and
keeps everything that reads from far off. The release publishes it as the
asset's `lods.detail`, baked like the low one.

### Bridges

A bridge is one placement for the whole structure, not one per tower: the
towers, anchorages, cables, suspenders and stays, trusses or girders and
the deck's underside. The model owns the walkways and tracks on the bridge,
their surfaces included. The map draws the road surfaces and their
markings, and the approach viaducts and ramps outside the bridge's
`man_made=bridge` outline, with their own piers and parapets.

- **No road surfaces.** A bridge model draws nothing at road level across a
  roadway: trusses stand beside the roadways, the underside hangs below
  them, railings stand on their edges, and the tops stay open for the map's
  roadways to show through. A raised promenade or a rail deck is the
  model's, walking or riding surface and all, since the map leaves those out
  within the model's reach.
- **Masonry just under a roadway is allowed.** An anchorage's roof or a
  tower's string course may sit under the map's roadway, 0.25 m or more
  below it, so the roadway rests on it rather than floating. Keep it out of
  arches and openings the roadway passes through.
- **`replaces` lists the outline.** List the bridge's `man_made=bridge`
  outline (a way or a multipolygon relation) beside the towers, anchorages
  and any other buildings the model covers. The outline is what tells the
  map to leave out its own piers and parapets across it, so list it only
  when the model draws the structure across the whole outline. An outline
  that runs on over approach viaducts the model doesn't draw leaves those
  approaches without piers.
- **Heights.** y = 0 is the water under the main span, the lowest ground
  under the footprint. The trusses are built around the roadway the map
  draws, so the two meet: for a suspended span the map raises its decks to
  the outline's `height` at midspan and lowers them along a parabola to the
  towers. Record in the generator the roadway heights the model was built
  to.
- **Feet on the terrain.** Towers in the water stand at y = 0. Anything
  standing on land, such as an anchorage, runs down to the ground under it
  vertex by vertex, at the DEM's height above its own water reading. A map
  that finds a model's ground from its lowest vertices then drapes the
  bridge over its terrain instead of setting it rigidly on the mean ground
  of a kilometre-long footprint.

A masonry approach outside the outline, which OSM maps as
`bridge:support=abutment` buildings between the street crossings, can be a
placement of its own: it replaces those buildings, leaves the crossings'
outlines and every deck on top to the map, and builds its top 0.4 m under
the map's roadways and its feet on the map's terrain
(`nyc-brooklyn-bridge-brooklyn-approach.ts`).

`generators/bridge-kit.ts` has the shared pieces: cables, rods, open and
solid trusses, terrain-footed walls. `nyc-brooklyn-bridge.ts` and
`sf-golden-gate-bridge.ts` are the worked examples.

### What `replaces` must list

The demo additionally uses stored OSM footprint geometry to split merged
OpenFreeMap building features before drawing them. Refresh its derived
outlines with `bun tools/replacement-footprints.ts` after changing these
references. Other clients still rely on the complete OSM ID list below.

The client hides buildings by OSM id. List the outline and every
`building:part` inside it. Detailed buildings are mapped twice in OSM, an
outline over the whole footprint and `building:part` polygons inside it, and a
ref left off this list keeps drawing and shows through the model as a box.

To find the parts, select the outline in the iD editor and look at what sits
inside it, or ask Overpass:

```
way(5013364);map_to_area->.a;(way(area.a)["building:part"];);out ids tags;
```

Some parts are separate buildings that happen to sit inside the outline, such
as the ticket booths under the Eiffel Tower. Leave those off if the model
doesn't cover them.

A roller coaster lists its track ways too, as well as its station: maps draw
coaster tracks as lines and hide the ways a landmark replaces, so a way left
off draws through the model. List every way the model draws, including
covered and tunnel stretches, and leave off spurs and sidings it doesn't
draw (`service=siding`).

## Batch pull requests

New models arrive in batches: one branch and one pull request per city or
park, usually 20 to 50 models.

- **Ids share a prefix** for the batch (`clt-`, `wdw-`, `nyc-`), so the batch
  sorts together and its files are easy to find.
- **One generator per model**, `generators/<id>.ts`, plus its
  `models/<id>.glb` and its catalog entries. Helpers shared within the batch
  go in a generator the others import (as `clt-terminal.ts` does for the
  airport); helpers useful beyond it go in the kit, in their own commit.
- **One commit per model**, so a model can be reviewed, reverted or dropped
  alone.
- **Contact sheets in the PR description.** Reviewers look at the sheets
  first. Make them with:

      bun run sheet --branch-diff --out review/<batch>

  Each image holds 8 landmarks (`--per` changes it): a three-quarter view
  from the south-west, turned to the landmark's real bearing, and the same
  view at phone size, labelled with id, name, anchor and size.

GitHub has no API for attaching images to a pull request, so the sheets are
committed on the PR branch and linked by commit:

1. `git add review/<batch> && git commit -m "Contact sheets for <batch>"` and push.
2. Link each image in the PR body by that commit's SHA, so the link outlives
   the files:

       ![sheet 1](https://raw.githubusercontent.com/alexwohlbruck/landmarks/<sha>/review/<batch>/sheet-1.png)

3. Before merging, `git rm -r review/<batch>` in a last commit. The images
   stay reachable through the PR's commits. The release workflow fails on
   `main` if `review/` is still there.

## Releases

`bun run build` validates the catalog and every model, fails on any problem,
and writes `dist/` in the Open Landmarks format:

| Path | What |
|---|---|
| `api/v1/latest.json`, `api/v1/preview.json` | Channel pointers. Both name the current release |
| `api/v1/releases/<release>/catalogue.json` | The release: count, bounds, attribution, links |
| `api/v1/releases/<release>/assets.json` | Every asset record |
| `api/v1/releases/<release>/index/12/<x>/<y>.json` | The same records, by z12 tile |
| `models/<id>/<sha256>/{low,detail}.glb` (+ `.gz`) | Low/high LOD, content-addressed; `detail` exists only when authored |
| `assets/<id>/<revision>/asset.json` | One record on its own |
| `objects/<sha256>/<id>.ts` | The generator that made it |
| `api/v1/history/<placement>.json` | Committed versions and their asset records |
| `api/v1/history.json` | Git-history coverage summary |
| `open-landmarks.json` | The website's pinned external collection, separate from the local API |

Each placement is one asset. Open Landmarks has no bearing or scale (its
assets are baked in place with `heading: 0`), so the build bakes each
placement's bearing and scale into its own copy of the GLB: static geometry
has its vertices turned and scaled, and moving parts have the same transform
folded into their node and keyframes, so they still move. A placement with
nothing to bake keeps the model's bytes exactly, and identical bytes are
stored once. `replaces` becomes `osm` (the first ref) and `additionalOsm`
(the rest). Additive fields include `wikidata`, non-zero `elevation`, `model` and
`placement` (what was baked), structured `credits`, `collection`, `place` and
`placeParents`, `type`, `tags`, `reviewStatus`, and `height`. Optional model
fields such as `description`, `references`, `licenseUrl`, and `sourcePage` are
published when supplied. Each LOD's `info` holds measured GLB statistics. The
Open Landmarks-compatible `authors` and `artisticLicense` fields remain present.

Elevation is not baked. A map finds a model's ground from its lowest
vertices and sets them on the terrain, so a lift baked into the geometry
gets pulled back down. Sent as a field, it is applied after the model has
been grounded. A reader that doesn't know the field draws the model at
ground level.

`buildRelease` reads no clock or Git state: the same catalog, model and source
bytes produce the same current dataset and release id (`landmarks-<hash>`).
Metadata changes, including authorship and place records, also change the
release id. The full site build additionally reads Git to generate historical
objects; history coverage therefore depends on the checkout. The external
snapshot and website code do not get mixed into the local dataset release id.

Every push to `main` runs the tests, builds, and deploys `dist/` to GitHub
Pages (`.github/workflows/release.yml`). There is no separate release step:
merging is releasing. The live site is `https://landmarks.barrelman.dev/`.
Each deployment publishes the current channel/catalogue and rebuilds the model
history objects from Git. Prior release catalogues are not retained as separate
channels; clients should read pointer, catalogue and assets together. CI uses
`fetch-depth: 0` so historical versions are available in clean deployments.
See [Running and publishing](../README.md#running-and-publishing-the-demo)
for domain and DNS configuration.


## Licences

- **Models default to CC0-1.0**: public domain, no credit needed. An explicit
  `license` overrides the default per model. CC-BY variants require `attribution`;
  custom identifiers require an HTTP(S) `licenseUrl`. Inspect a model's own
  metadata before reuse, including its past versions.
- **Placements are ODbL-1.0.** Anchors and `replaces` are derived from
  OpenStreetMap, © OpenStreetMap contributors.
- The code in `src/`, `tools/` and `generators/` is CC0-1.0 as well.

Reference photos used while modelling keep their own licences and are not
part of this repo. Upstream OpenLandmarks assets retain their original licenses.
Bundled dependencies and the Claude brand icon have separate notices in
[`NOTICE`](../NOTICE) and the built `third-party-licenses.txt`.

## Website

See the [website guide](website.md) for the visitor-facing controls.

### Complete model details

The inspector lists every replaced OSM feature as a linked `node/`, `way/`, or
`relation/` ID. Geometry and file statistics follow the selected version and
LOD: exact bytes and gzip bytes, triangle faces, vertices per mesh instance,
meshes, primitives, nodes, materials, textures and embedded/external images,
animation clip names, durations, channels, timestamp samples and affected
nodes, skins, morph targets, exporter, glTF version, extensions and checksums.
GLBs contain triangulated geometry; original authoring n-gon counts are not
available and are not presented as measured polygon counts.

Local release LODs include `info`, measured directly from their GLB, including
historical versions. Upstream files without that extension are inspected on
selection, with a loading/unavailable state rather than assuming they are
static or texture-free. The expandable **All published metadata** tree and
**Metadata JSON** expose every record field, including upstream-specific
review data, modeling notes, references and footprints. On-demand inspection
is shown separately as `inspectedFile`, preserving the upstream record.

### Appearance and LOD controls

The preview selects **High LOD** when available, otherwise **Low LOD**. The
selector is hidden for models with one LOD. The map continues to choose LOD
by zoom: the UI's High LOD maps to the existing `detail` catalog/API field, and
Low LOD maps to `file` / `lods.low`. File paths and API field names are unchanged.
The small preview auto-rotates at 12 degrees per second and pauses during
interaction; auto-rotation honors reduced-motion preferences.
It does not rotate the map.

The header's **Day / Night** switch uses one state for the interface, basemap,
preview, and map-model lighting. Night means dark colors and night models; Day
restores light colors and original daylight models. The initial state follows
the system preference unless the visitor saved a choice in `landmarks-theme`.
The former independent `landmarks-night` setting is no longer read. When local
storage is unavailable, the switch still works for the current visit. Map
recoloring preserves the camera and custom model/building layers.

Night lighting applies to both the small preview and map models. It uses the same night palette as the offline
renderer: dim blue ambient surfaces, authored `_FLOODLIGHT` masks, warm window
and entrance materials, lamp materials, and existing emissive factors. Lighting
is baked into transient vertex colors using `KHR_materials_unlit`; geometry,
textures, UVs, and animation remain intact. Switching back to day restores the
original model. Downloads, checksums, and metadata always describe the original
GLB, not the transient preview. Upstream models use their available material
names and emissive data, without assuming a floodlight mask exists.
