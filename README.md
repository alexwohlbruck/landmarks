# Landmarks

**Low-poly 3D landmarks for maps.**

![Washington Square Arch and the Empire State Building at night](docs/images/washington-square.jpg)

3D models of landmarks that replace a building's default extrusion on the
map. Models use a shared color palette, usually have a few thousand triangles,
and are mostly texture-free. Some include animation or authored night lighting.

500+ landmarks in New York, Chicago, Los Angeles, San Francisco, Charlotte,
Washington DC, Las Vegas, Seattle and a few theme parks.

**[Explore the interactive demo →](https://landmarks.barrelman.dev/)**

Browse landmarks on a MapLibre map, search names or credits, and filter by
place, type, tag, or source. The collection combines local models with
OpenLandmarks while preserving each model's license, provenance, and review
status. Both sources remain selectable when they model the same feature.

The small preview slowly auto-rotates and supports **Low LOD / High LOD**,
with High LOD selected when available. A single **Day / Night** switch in the
header synchronizes the interface, basemap, preview, and map-model lighting.
Night mode shows authored floodlights, glowing windows, and lamps; the chosen
mode is saved locally.

Each selection has a shareable URL. The inspector lists credits and avatars,
licenses, all replaced OSM IDs, placement settings, geometry and file statistics,
animation and texture information, downloads, references, and full metadata.
Local models also have Git-backed past-version previews and downloads; the
history selector appears only when there is a past version to choose.

See the **[website guide](docs/website.md)** for controls, metadata, sharing,
and troubleshooting, or the **[technical reference](docs/reference.md)** for
the catalog schema and published API.

At street zoom, the actual GLB models are placed on the map at their catalog
coordinates, among raised OpenFreeMap buildings. Their bearing, scale, and
elevation are preserved. The OSM footprints listed by each landmark are hidden
only after its model loads, replacing the default building extrusion. Stored
OSM footprints also remove building parts from merged vector-tile features
without hiding unrelated neighboring buildings. Zoom out
to browse numbered clusters; click a model to inspect it. Visible models load
on demand, animate where supported, and switch to High LOD at their
configured zoom level.

The demo uses [MapLibre GL JS](https://maplibre.org/), the free, keyless
[OpenFreeMap](https://openfreemap.org/) Positron basemap,
[Three.js](https://threejs.org/) for map models, and [`<model-viewer>`](https://modelviewer.dev/). Basemap tiles and fonts need an
internet connection. Map and model viewer libraries are bundled with the site.

The dataset is published alongside the demo, starting at
**[api/v1/latest.json](https://landmarks.barrelman.dev/api/v1/latest.json)**,
in the [Open Landmarks](https://github.com/benjamintd/open-landmarks) format,
and is drawn in [Parchment](https://github.com/alexwohlbruck/parchment) via
[Barrelman](https://github.com/alexwohlbruck/barrelman).

## Getting started

Use [Bun](https://bun.sh) and Git. Python is used by the optional evidence
tools and by the simple local HTTP server shown below.

```sh
git clone https://github.com/alexwohlbruck/landmarks
cd landmarks
bun install
```

| Command | Does |
|---|---|
| `bun generators/<id>.ts` | Build one model into `models/<id>.glb` |
| `bun run preview <id> [--night]` | Render a model from every side into `preview/<id>/` |
| `bun run sheet <id ...>` | Contact sheets for a list of landmarks |
| `bun run sync:sources` | Refresh the checked-in OpenLandmarks metadata snapshot |
| `bun run validate` | Check the catalog and every model |
| `bun test` / `bun run typecheck` | Tests and types |

## Running and publishing the demo

```sh
bun run build
python3 -m http.server 4173 --directory dist
# Open http://localhost:4173
```

`web/` contains the demo's HTML, CSS, and TypeScript. The build bundles its
browser dependencies and writes the demo, dataset API, and models into
`dist/`. It reads the generated release directly, so every catalog placement
appears automatically. `web/replacement-footprints.json` contains the OSM
building outlines used to cut the original polygons out of the basemap.
Refresh those when changing a landmark's `replaces` list:

```sh
bun tools/replacement-footprints.ts
```

This is a maintenance command using Overpass, not a build-time or visitor
runtime dependency. The footprint data is ODbL-1.0, © OpenStreetMap
contributors. All demo asset URLs are relative to the hosting path,
including GitHub Pages project subdirectories.

Deploy `dist/` to any static site host; no server runtime, API keys, database,
or route rewrites are required. The existing
[Release workflow](.github/workflows/release.yml) runs types and tests, builds
both the dataset and demo, and deploys to GitHub Pages on pushes to `main`.
The build reads full Git history to publish past model versions. A shallow
checkout or source archive can still build the current collection, but the
viewer reports partial history. GitHub Actions fetches full history automatically.

OpenLandmarks metadata is pinned in `web/open-landmarks.json`, so normal builds
need no upstream network requests. Run `bun run sync:sources` to update it,
review the snapshot changes, and rebuild. GLBs and editable sources remain
hosted by OpenLandmarks. Both collections remain searchable for overlapping
features; the map prefers the selected version, then this repository's version.
`web/upstream-places.json` explicitly associates upstream IDs with places; add
associations there when new coverage appears.

The repository's Pages source is **GitHub Actions**, with custom domain
**landmarks.barrelman.dev** configured in the repository's Pages settings.
DNS: `CNAME landmarks → alexwohlbruck.github.io` (no repository path).
GitHub Actions deployments use that setting; a `CNAME` file is not required.
After a DNS change, verify the CNAME with a public resolver, for example
`dig @1.1.1.1 landmarks.barrelman.dev CNAME +short`. HTTPS is ready only once
GitHub Pages has issued the custom-domain certificate; check repository Pages
settings and enforce HTTPS when available. DNS and certificate status can lag
behind a newly added record.

## Contributing a model

Each landmark is a small TypeScript file in `generators/` that builds the
model from boxes, prisms and curves, and writes a GLB.

1. **Pick an id.** A lowercase slug, prefixed with its city or park:
   `nyc-brooklyn-bridge`, `chi-cloud-gate`, `carowinds-fury-325`.
2. **Gather evidence.** OSM footprints, published heights, photos from
   several sides. Note in the generator's header where each number came
   from. See [`docs/evidence.md`](docs/evidence.md) for what may be used.
3. **Write `generators/<id>.ts`** with the shared kit (`mesh.ts`,
   `palette.ts`, plus `coaster-kit.ts` or `bridge-kit.ts`). Good examples to
   copy from: `eiffel-tower.ts`, `chrysler-building.ts`,
   `carowinds-fury-325.ts`. Then run `bun generators/<id>.ts`.
4. **Look at it** with `bun run preview <id>`, and compare against photos.
5. **Add it to `catalog.json`**: a model with `type`, `tags`, `collection`,
   license (default CC0-1.0), and structured `credits`. Give each AI credit a
   separate `model` field; use `github` for known contributor usernames. Add a
   placement referencing an explicit `place`, with every OSM feature it `replaces`.
   Reuse a place or add one for the city, town, site, or remote region.
   See the [complete example](docs/reference.md#public-metadata).
6. **Check it** with `bun run validate`, `bun run typecheck`, and `bun test`.
   Build the site and inspect both LODs, day/night lighting, credits, and OSM IDs.
7. **Open a pull request** with a contact sheet
   (`bun run sheet --branch-diff`).

For an update, keep the existing model and placement IDs, regenerate the GLBs,
and commit geometry, generator, and metadata together. Git supplies history;
no duplicate catalog entries or manual version numbers are needed.

Current local models credit **Alex Wohlbruck** (`github: "alexwohlbruck"`) and
**Claude**, with `model: "Claude Opus 5.5"`. GitHub identities supply profile
photos; Claude uses its icon; others use initials. Future contributions must
record their actual creators and LLM model, rather than copying those credits.

Models made in Blender or elsewhere are welcome too, as long as they follow
the frame contract (+Y up, −Z north, metres, origin on the ground at the
anchor) and carry a licence the catalog can state.

## Generating models with Claude

Most models here were built by [Claude Code](https://claude.com/claude-code).
The repo ships two slash commands for it. Open Claude Code in the repo and
run one.

**Recommended models:** Astra, Claude Opus 5.5 or newer, or Claude Fable
5.1 or newer. The hard part is judging renders against photos and getting
proportions right, and other models tend to stop before the model matches.

Using another agent, such as Codex or Cursor? [`AGENTS.md`](AGENTS.md)
points it at the same instructions.

| Command | Does |
|---|---|
| `/new-landmark` | Builds one landmark. Asks which one, finds it in OSM, picks the id, gathers open evidence, writes the generator, checks it against photos and adds it to the catalog. |
| `/new-batch` | Leads a batch of 20 to 50 landmarks for a city or park. Asks which city, lets you edit the candidate list, runs builder sub-agents, reviews each model and opens a draft PR. |

You can name the target up front, as in `/new-landmark Fenway Park, Boston`
or `/new-batch Boston`, or run the command bare and answer its questions.

Review the renders against the photos before merging. The commands live in
[`.claude/skills/`](.claude/skills/) and follow the briefs in
[`docs/briefs/`](docs/briefs/) and the process in
[`docs/workflow.md`](docs/workflow.md).

### Before you start, read

- [`STYLE.md`](STYLE.md): the art style, the triangle budget, and what
  reviewers look for.
- [`docs/website.md`](docs/website.md): the website controls and model detail fields.
- [`docs/reference.md`](docs/reference.md): the catalog fields, the frame
  contract, elevation, bridges, what `replaces` must list, and how releases
  are built.
- [`docs/workflow.md`](docs/workflow.md): the full process for a batch of
  20 to 50 models, start to finish.

## Licence

Code and models default to [CC0-1.0](LICENSE). A model can declare a different
license in `catalog.json`; its published metadata and inspector show that
license and any required attribution. OpenLandmarks models keep their upstream
licenses and credits; the repository's CC0 dedication does not cover them.
Placements are derived from OpenStreetMap and are ODbL-1.0,
© OpenStreetMap contributors.
