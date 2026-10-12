# Evidence

Every model here is published as CC0 and can be contributed to
[Open Landmarks](https://github.com/benjamintd/open-landmarks). That only
holds if the model was shaped from open sources. This page lists the sources
that are allowed, the ones that aren't, and how to use the lidar, OSM and
photo tools in `tools/`.

## What may be used

| Source | Gives | Licence | Tool |
|---|---|---|---|
| OpenStreetMap | Footprint, building parts, tagged heights and levels, names, Wikidata ids | ODbL | `tools/osm.py` |
| USGS 3DEP lidar point clouds | Real heights of every tier, roof shapes, edges | Public domain | `tools/lidar.py` |
| USGS NAIP orthophotos | The true plan, roof colours, shadows | Public domain | `tools/usgs.py naip` |
| USGS 3DEP bare-earth DEM | How the site slopes | Public domain | `tools/usgs.py dem` |
| County and city open data | Lidar-derived footprints and heights, historic-landmark records | Usually public domain or open; check each | `tools/lacounty.py` for LA County |
| Wikimedia Commons | Photos | Per file: CC0, PD, CC BY, CC BY-SA | `tools/photos.py commons` |
| Openverse (Flickr and others) | Photos | Per photo | `tools/photos.py openverse` |
| Mapillary | Street-level photos from every side | CC BY-SA 4.0 | `tools/mapillary.py` |
| Wikipedia, RCDB, Coasterpedia, the National Register of Historic Places, local landmark commission reports, CTBUH | Published height, floors, dimensions, dates, architect | Facts, cited | |
| HABS/HAER drawings (Library of Congress) | Sections and elevations of historic buildings | Public domain | |

A photo is **evidence** if its licence is public domain, CC0, CC BY or
CC BY-SA. Everything else is **look-only**:

- photos under non-commercial (NC) or no-derivatives (ND) licences;
- news, venue, agency and architect photos with no open licence;
- historic postcards that are still in copyright.

A look-only source may be looked at and described. It may not be relied on
for a shape or a colour. List it apart in the generator header, marked as
look-only, so a reviewer knows the parts that rest on it.
`tools/photos.py` tags every result `EVIDENCE` or `LOOK-ONLY` from its
licence.

## What may not be used

Never use Google, Apple, Bing or Mapbox imagery, Street View, or any
photorealistic 3D tiles. Not as evidence, and not as a reference "when
nothing else exists". Their terms forbid deriving content from them. A model
shaped against them can't be published as CC0, and can't go to Open
Landmarks.

Where no open evidence exists for part of a building, say so in the header
and keep that part plain. A plain model that is right beats a detailed one
built on a source we can't use.

## Recording sources

The generator's header comment is the record. For every model it lists:

- every source used, with its URL;
- for each photo, the author and the licence, as the PR's credits need them;
- for lidar, the dataset name and flight year;
- for each number, whether it is measured (lidar, aerial), published (with
  the citation), estimated (and from what), or invented;
- the look-only references, apart from the rest;
- the doubts: a side no photo shows, an OSM tag that looked wrong, a height
  read from a shadow.

Record sources as you collect them. Rebuilding credits afterwards from
memory or scratch folders doesn't work.

## Photos

Fetch three to six daylight exterior photos per landmark, from different
sides, plus one from above or far away if any exists. Open each one and look
at it properly. Base every proportion and colour on them.

```bash
python3 tools/photos.py commons "Space Needle" 30
python3 tools/photos.py openverse "Space Needle"
python3 tools/mapillary.py work/sea-space-needle/mly -122.34929 47.62050
```

`mapillary.py` saves one photo per 30-degree side, named by the compass
direction from the landmark to the camera (`m180.jpg` was taken from the
south). `bun tools/view.ts <id> out.png 180` renders the model from the same
side, so the two pair up directly. Mapillary needs an access token in
`MAPILLARY_TOKEN`; never commit it.

Some Commons photographers have covered whole neighbourhoods. In Charlotte,
"City Dweller 2" photographed most of NoDa, South End and Camp North End
(CC BY-SA 4.0). Search by author once one turns up.

Mapillary photos are often dated. Check the capture date (printed beside
each file) against the building's history.

## Lidar

The USGS 3DEP point clouds cover most US cities. They give the height of
every tier, the roof shape and the edges, which are better than anything
read from photos.

```bash
python3 -m venv .venv && .venv/bin/pip install -r tools/requirements.txt

.venv/bin/python tools/lidar.py find -122.34929 47.62050
.venv/bin/python tools/lidar.py grid -122.34929 47.62050 60 work/sea-space-needle/lidar --res 0.5
python3 tools/lidar_frame.py work/sea-space-needle/lidar.json 0 -30 30 -30 30 5
```

`find` lists the datasets that cover a point, newest first. `grid` writes a
height grid (`.json`) and a shaded image (`.png`) and prints a coarse table.
`lidar_frame.py` reads the grid in the model's own frame, turned to its
bearing, so each tier can be read where the generator draws it.

Rules:

- **Request in EPSG:3857 and correct for scale.** The point clouds are in
  web mercator, where distances are stretched by 1/cos(latitude).
  `lidar.py` widens its box by that factor and divides every offset back,
  so its grid is in true metres. Asking a raster service for EPSG:4326 on a
  square pixel grid instead stretches north-south by about a quarter at mid
  latitudes. Any new lidar or raster tool must do the same.
- **Crop to the footprint plus about 10 m.** The download grows with the
  square of the box. Use `--res 0.5` for small things (a half-size of 60 m
  or less) and 1 m otherwise.
- **Measure from the real ground.** `ground_min` is the lowest ground return
  in the box. A loading dock, a sunken plaza, a subway entrance or a ramp
  can put it well below the street. Check the `gnd` grid around the building
  and take the base from the ground the building actually stands on.
- **Watch for offsets between lidar and OSM.** An OSM outline can sit a few
  metres off the lidar footprint, or show a building that was extended or
  cut back since the flight. Compare the lidar image with the OSM outline
  and an aerial before reading heights at OSM coordinates. Where they
  disagree on the extent, follow the current OSM and NAIP and say so.
- **Mind the flight year.** Anything built or altered since the flight
  won't show. Charlotte's flight is from 2016, so the Design Center Tower
  (2021) isn't in it. Use published or photo-scaled heights for those, and
  say so.
- **Delete point-cloud caches afterwards.** `lidar.py` downloads into a
  temporary directory and deletes it on exit. If you set `LIDAR_CACHE` to
  keep tiles between runs, delete that directory once the heights are
  taken. The disk once filled up with cached clouds and stopped every
  builder.

Datasets used so far, also usable as `--dataset` aliases:

| Alias | Dataset | Covers |
|---|---|---|
| `clt` | `USGS_LPC_NC_Phase4_Mecklenburg_2016_LAS_2019` | Charlotte, 2016 |
| `nyc` | `NY_NewYorkCity` | The five boroughs and the Hudson waterfront, 2017 |
| `sf` | `CA_SanFrancisco_1_B23` | San Francisco, Yerba Buena, Alcatraz, the Golden Gate, 2023 |
| `alameda` | `CA_AlamedaCo_2_2021` | Oakland, Berkeley. Try `alameda1` or `alameda3` if a query is empty |
| `king` | `WA_KingCo_1_2021` | Seattle, Bellevue |
| `pierce` | `WA_PierceCounty_1_2020` | Tacoma |

Checks that came out right: the Space Needle measures 184.8 m against a
published 184.4 m; Transamerica 262 m against 260 m.

Some cities publish their own lidar products, which can be easier than the
point clouds. LA County's LARIAC footprints carry a lidar roof height and
ground elevation for every building (`tools/lacounty.py buildings`), and its
surface model can be sampled on a grid in the model's frame
(`tools/lacounty.py dsm`). San Francisco publishes footprints with 2010 lidar
statistics (`data.sf.gov`, dataset `ynuv-fyni`). Look for the same in each
new city.

## OSM

```bash
python3 tools/osm.py buildings -80.8422257 35.2273121 60 work/<id>/osm.json
python3 tools/osm.py named -80.8422257 35.2273121 150 mill
python3 tools/osm.py search "Atherton Mill, Charlotte"
```

Use the OSM API's map call (`buildings`, `named`). Overpass was too often
slow or down. Treat OSM as exact where it is tagged and suspect everywhere
else: heights are often missing or wrong, names are sometimes on the wrong
building, and outlines can be out of date.

`buildings` lists every outline and `building:part` in the box. That is
where `replaces` comes from: the outline and every part the model covers
(see "What `replaces` must list" in the README).

Set `LANDMARKS_USER_AGENT` to a User-Agent with your own contact before
using these tools much. Nominatim allows one request a second.

## Identity and names

Check that the building is the one you think, and that its name is right,
against an official record: a county historic-landmark layer, the National
Register nomination, a landmark commission report. OSM names and Wikipedia
coordinates are wrong often enough to matter.

The Atherton Mill case in Charlotte: OSM had the name "Atherton Mill" on a
large complex on South Boulevard. Mecklenburg County's historic-property
layer showed that complex is the 1919 Parks-Cramer Company plant, whose
shops took the Atherton name in the 1990s. The 1893 Atherton Cotton Mill is
a separate building 230 m away, unnamed in OSM. The county record settled
it, and the two became two models with their own names
(`clt-atherton-mill`, `clt-atherton-cotton-mill`), each header saying which
is which.

## Elevation

The model's own base is y = 0: the lowest ground under its footprint. For a
stadium with a sunken field, y = 0 is the field.

The catalog's `elevation` is 0 for almost everything, sloped sites included.
On a slope the map puts y = 0 on the lowest ground and the uphill walls sink
into the hill. Use a non-zero value only for:

- **positive:** the model stands on something OSM doesn't map, so the map
  draws nothing under it. The Statue of Liberty stands 10 m up on Fort Wood;
- **negative:** the base is below the street around it, as in a sunken
  bowl. The value is minus the depth of the field below the outside street.

Measure a depth from section drawings, a published field level or
street-level photos, never from the map's terrain or lidar `ground_min`.
The terrain is often too coarse or older than the dig, and under-reads pits:
it shows SoFi Stadium's field 1.9 m down where the real field is about 30 m
down. Record the value and its source in the header.

Elevation needs Barrelman 0.10.5 or later to reach the map (see
[workflow.md](workflow.md#deploy)).
