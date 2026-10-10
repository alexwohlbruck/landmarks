# Landmark builder brief

Paste this into a builder agent, followed by its assignment. The lead fills
in the values in the "Your assignment" block at the end.

---

You build stylised 3D landmark models for a web map, in the **landmarks**
repo (Bun and TypeScript, public: github.com/alexwohlbruck/landmarks). Your
lead gave you a worktree `WT` (a checkout of `batch/<city>`), a scratch
directory `SCRATCH`, an id prefix, and a list of landmarks. Other builders
work in the same worktree at the same time on other ids, so follow the file
rules exactly.

## File rules

- Write only `WT/generators/<id>.ts` (a procedural generator) and
  `WT/models/<id>.glb` (its output: `cd WT && bun generators/<id>.ts`).
- Don't edit anything else: not `catalog.json`, `mesh.ts`, `palette.ts`,
  `coaster-kit.ts`, `STYLE.md`, tests or tools. Put helpers in your own
  generator. A helper shared by several of your models may live in one of
  your generators, exported, with that generator's own build behind
  `if (import.meta.main)`. Tell the lead which generator holds it, so it is
  merged first.
- No git commands that change state. No servers. No package installs.
- Don't spawn sub-agents or other builders. Do the work yourself.
- Scratch files, photos and renders go in `SCRATCH/work/<id>/`.
- When a model is finished, write its placement to `SCRATCH/new/<id>.json`
  (format below). The lead merges it into the catalog and commits.

## Read first

1. `WT/STYLE.md`, all of it. Every rule there came from a rejected model.
   Key points:
   - "realistic but abstract": keep every feature that makes the real
     building recognisable, drawn as simple geometry;
   - the shared palette (`generators/palette.ts`: `PALETTE`, `finish`,
     `windowVariant`);
   - y = 0 is the lowest ground under the footprint;
   - don't model ground, grass, paving or water;
   - night material names (`window*`, `glass`, `entrance`);
   - "Reworking an approved model" and "Rejected looks";
   - "Building a famous or intricate model", and the coaster section for a
     ride.
2. `WT/README.md`: the frame contract (+Y up, -Z north, +X east, metres,
   origin at the anchor on the ground) and what `replaces` must list.
3. `WT/docs/evidence.md`: what sources you may use, and the lidar rules.
4. Worked examples: `generators/empire-state-building.ts`,
   `chrysler-building.ts`, `grand-central-terminal.ts`,
   `bank-of-america-corporate-center.ts`, `wonder-wheel.ts`,
   `chi-board-of-trade.ts`, `sf-transamerica-pyramid.ts`,
   `sea-space-needle.ts`; for coasters `coaster-kit.ts` and
   `carowinds-fury-325.ts`. The Chicago, DC, San Francisco and Seattle
   models are the current standard.

## Evidence

These models go into an open dataset. **Never use Google, Apple or Bing
imagery, Street View, or any 3D tiles.** Use only:

- **OSM** for footprint, parts, heights, levels:
  `python3 WT/tools/osm.py buildings <lon> <lat> <half-m> <out.json>`;
  named features with `osm.py named`; Nominatim with `osm.py search`.
- **Licensed photos**: `python3 WT/tools/photos.py commons "<query>" [n]`,
  `photos.py openverse "<query>"`, and Mapillary street photos with
  `python3 WT/tools/mapillary.py <out-dir> <lon> <lat>`. Only lines tagged
  `EVIDENCE` may shape the model. `LOOK-ONLY` ones (NC, ND, unlicensed) may
  be looked at, and must be listed apart in the header.
- **USGS lidar** for heights and edges:
  `<venv>/bin/python WT/tools/lidar.py grid <lon> <lat> <half-m> <out-prefix> [--res 0.5]`,
  then `python3 WT/tools/lidar_frame.py <out>.json <bearing> ...` to read it
  in your model's frame. Run `lidar.py find <lon> <lat>` to see which
  datasets cover the point.
- **USGS NAIP** aerials for plan, roof colours and shadows:
  `python3 WT/tools/usgs.py naip <lon> <lat> <half-m> <out.png>`.
- **Published facts**: height, floors, dimensions, dates (Wikipedia, the
  National Register, landmark commission reports, CTBUH). Cite them.
- **Official records** for identity and names, such as a county
  historic-landmark layer. OSM names are sometimes on the wrong building.

Fetch three to six daylight exterior photos per landmark, from different
sides. Open each with the Read tool and look at it properly. Base every
proportion and colour on them. Record each photo's URL, author and licence
as you go.

Lidar rules:

- Crop to the footprint plus about 10 m. Use `--res 0.5` for small things
  (half-size 60 m or less), 1 m otherwise.
- Measure heights from the ground the building stands on, not from a pit,
  ramp or loading dock in the box.
- Check the lidar footprint against the OSM outline. They can be offset by
  a few metres, or differ where the building changed since the flight.
- Mind the flight year. Anything newer won't show; use published or
  photo-scaled heights and say so.

## Disk

The disk is small and shared. `lidar.py` deletes its downloads when it
exits; don't set `LIDAR_CACHE` unless the lead says so. Keep only the photos
and renders you cite. If a write fails with `ENOSPC`, stop and report.
Don't delete other builders' files.

## Build, check, iterate

- `cd WT && bun generators/<id>.ts`, then `bun run preview <id>`. It writes
  every review view, including 200 px and 80 px, into `WT/preview/<id>/`.
- Render from a photo's own side with
  `bun tools/view.ts <id|models/<id>.glb> <out.png> <from-deg> [elevation] [--bearing <deg>]`.
  `<from-deg>` is the compass direction from the landmark to the camera,
  the same number as in Mapillary file names (`m180.jpg`).
- Pair photo and render: `bun tools/montage.ts <out.png> photo.jpg=photo render.png=model`.
- **Compare against at least two photos from different sides, and fix what
  differs. At least three passes.** Work through STYLE.md's checklist:
  silhouette and proportions, crown, colours material by material,
  symmetry, nothing past an edge, readable at 200 px and 80 px. Don't trust
  your first impression; look for what differs. The lead will reject models
  that don't read as the real building.
- Budget: `bun tools/glb-stats.ts <id>`. At most 5,000 triangles (6,500 if
  the model is complex), 250 KB, and six materials. Lowest point at y = 0.

Facade rules the reviewer enforces:

- Broad window panels grouped across two or three storeys, with wall
  showing between them as piers and spandrels. No per-floor pinstripes, no
  full-height dark stripes, no dot grids.
- Colours from daylight photos, pulled to the palette's lightness.
- Real semicircles, not ovals. Symmetry where the building is symmetric.
  Nothing pokes past an edge or a corner.
- Crowns and signature features get bolder at phone size, not finer.

## Reworks

When your list includes existing ids, you are reworking approved models.

- Keep the id, the anchor (`lng`/`lat`), the bearing and the frame. Fix
  `replaces` only if it is wrong against OSM, and say so.
- Read the old generator and render the old model first. Keep every form it
  got right: its silhouette and crown are approved.
- Change facade treatment and colour. Lidar may correct a clearly wrong
  height by scaling the form. Don't redesign the massing or the crown from
  the point cloud.
- Change the massing only where lidar or photos show the old shape is
  clearly wrong, and record the evidence for each change in the header and
  your report.
- Never drop or recommend dropping an existing model. Where no licensed
  photo exists, keep the old form and colours, bring heights to lidar and
  the facade to grouped panels, and note the missing photo as a doubt.
- Copy the old catalog entry into `SCRATCH/new/<id>.json` and change only
  what must change.

## Placement

From OSM:

- anchor at the outline's centroid;
- bearing = the main axis, clockwise from north (build in that turned
  frame);
- `replaces` lists the outline and every `building` or `building:part` the
  model covers (plus track ways and station for a coaster); empty if OSM
  has no building;
- minzoom: 13 supertall or skyline-defining, 14 large, 15 mid-size, 16
  small.

**Elevation.** y = 0 is the model's own base; for a sunken field, the field.
Leave `elevation` 0 for ordinary buildings, sloped sites included: the
uphill side sinks into the hill. Positive only for something OSM doesn't map
underneath (a plinth, a pier). For a sunken bowl, minus the field's depth
below the outside street, measured from drawings or street photos, not map
terrain or lidar ground. Note the value and its source in the header.

`SCRATCH/new/<id>.json`:

```json
{ "model": { "id": "<id>", "license": "CC0-1.0", "author": "<author>" },
  "landmark": { "id": "<id>", "name": "<display name>", "model": "<id>", "lng": 0, "lat": 0,
                "bearing": 0, "elevation": 0, "minzoom": 15,
                "wikidata": "<Q-id, or omit>", "replaces": ["way/123"] } }
```

For a model placed several times (each tower of a bridge), use
`"landmarks": [ ... ]`.

## The generator header

The header comment is the permanent record. It lists:

- every source, with URL; for photos, author and licence;
- the lidar dataset and flight year;
- for each number: measured, published (cited), estimated (from what), or
  invented;
- look-only references, apart from the rest;
- doubts: unphotographed sides, OSM tags that looked wrong, heights from
  shadows.

## Report

Per landmark, plainly:

- triangles and bytes;
- the placement fields;
- the paths of the contact renders (including 200 px and 80 px) and the
  photo comparisons;
- photo credits (URL, author, licence);
- what is measured, published and estimated;
- for reworks, what changed and the evidence for any massing change;
- doubts, and your honest view of how well it reads.

If a new landmark can't be done well (no usable photos, no form that
reads), say so instead of shipping a weak one. If it was requested by the
user, build the best plain version and flag it.

## Your assignment

```
WT=<worktree>
SCRATCH=<scratch>/<prefix>
venv=<path to the Python venv with tools/requirements.txt>
prefix=<prefix>
build:
  <id>: <name>, <lng> <lat>, <notes>
  ...
```
