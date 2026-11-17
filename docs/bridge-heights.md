# Bridge heights

A bridge model's trusses, girders and railings are built around the roadway
the map draws (see Bridges in [`reference.md`](reference.md)). The map,
Barrelman's bridge decks drawn in Parchment, takes that roadway's height
from OSM. Where OSM records none, the deck is guessed from the ground and
water under it and can sit metres off the model: the San Diego–Coronado
Bridge's decks were drawn 5–20 m low. This page is how to check a bridge's
roadway heights against lidar and, where they're wrong, correct them in OSM
with `ele` tags on its road nodes.

Fix OSM rather than the model. A model built to the true road heights is
right everywhere the map is right, and an `ele` tag fixes the deck for
every map that reads OSM.

## When to tag

Check a bridge when:

- its model's deck and the map's roadway don't meet in Parchment, or the
  roadway floats above or sinks into the model's girders;
- the bridge is tall over water or a canyon and OSM has no
  `seamark:bridge:clearance_height` or `height` on its `man_made=bridge`
  outline;
- you're building a bridge model and recording the roadway heights it was
  built to.

Don't tag a bridge whose deck already sits within about 0.3 m of the
lidar roadway, nor the ends of a bridge that land on the ground or on an
embankment: Barrelman starts those at the ground.

## What Barrelman does with `ele`

From Barrelman 0.10.40, an `ele` on a node of a bridge's highway or
railway way is the roadway height there, in metres above sea level in the
terrain's datum (NAVD88 in the US). The deck passes through each such node
exactly and runs between them as a road is built: straight grades where
the nodes lie in line, one parabolic vertical curve over a crest or sag,
and from a landed end on the straight grade to the nearest pinned node.
So a few nodes per carriageway are enough:

- the start and end of each vertical curve (the grade breaks);
- the crest or the bottom of a sag;
- the last node before the deck lands or splits into ramps, if that end is
  in the air;
- an end node whose height the ground under it wouldn't give.

Tag every carriageway: two one-way ways side by side each need their own.
Barrelman ignores a value below the ground under the node or more than
150 m above it, taking it for a mistake. A replication cycle that changes
an `ele` queues that bridge's decks for rebuilding, so a published fix
reaches the map without anyone running a build. Barrelman's own
documentation of these rules is "Bridge decks" in its
`docs/content/docs/self-hosting/importing-data.mdx`.

## 1. Measure

Find the bridge's road ways on openstreetmap.org (the `bridge=yes`
`highway` ways inside the `man_made=bridge` outline) and list each
carriageway's ways in order from one end to the other:

```sh
.venv/bin/python tools/bridge_ele.py measure 6055495 1538967139 5941511
.venv/bin/python tools/bridge_ele.py measure 25758576 --every 20
```

For every node, and with `--every` for points between them, it prints:

| Column | Meaning |
|---|---|
| `s m` | Distance along the carriageway from its first node |
| `road` | The lidar roadway: lower quartile of the surface within 1.5 m, so cars and lamp posts don't count |
| `spread` | Median minus lowest reading there; under about 0.2 m means it's the road surface |
| `ground` | USGS 3DEP bare-earth height, the ground with the bridge taken out |
| `above` | `road` minus `ground` |
| `ele now` | Any `ele` already tagged |

It reads the newest 3DEP survey covering the bridge; `tools/lidar.py find
<lon> <lat>` lists them and `--dataset` picks another. A survey older than
the bridge or its last rebuild can't be used.

## 2. Choose the nodes

Plot or read down `road` against `s m` and find the grade breaks: where
the height stops changing at a steady rate. Pick the existing nodes
nearest them. Where no node is near a break, as on the Cabrillo Bridge,
whose road runs level for 200 m and then climbs to the east end, read the
`--every` rows to find the break and add a node there (step 4). Use the
`road` value rounded to 0.1 m.

## 3. Check the values

Before writing anything to OSM, check the numbers against something other
than the reading itself. All of these should hold:

- **The reading is the road.** `spread` under about 0.2 m at each chosen
  node. A wider spread is a car, a sign gantry or the parapet: move to the
  next node.
- **The datum is right.** On a bridge over water, the lidar's water
  surface (the lowest surface reading over open water in `tools/lidar.py
  grid`) is within a metre or two of 0, the tide on the survey day, not
  around −30 m: a survey in ellipsoid heights would be off by the geoid,
  about 30–35 m in the US. OSM defines `ele` against the EGM96 geoid, not
  NAVD88; the two differ by the gap between the NGS GEOID18 and EGM96
  geoid heights at the bridge (NGS `geodesy.noaa.gov/api/geoid/ght`,
  GeographicLib GeoidEval). In San Diego it is 0.1 m, inside the rounding;
  where it is over 0.3 m, add it to the lidar value.
- **The ends meet the ground.** Where the deck lands, `above` is 0–2 m.
- **Published figures agree.** Compare with what the bridge's owner,
  Wikipedia or the Coast Pilot publish: its grade, its height over the
  water or canyon, its navigation clearance plus the girder depth. These
  are rough, so they catch a datum error or a wrong node, not a 0.3 m one.
- **OSM hasn't changed.** `bridge_ele.py osc` reads each node's current
  version, so write the file just before uploading.

Record what you checked in the changeset's description or the pull
request: the survey, the values, and each comparison.

## 4. Write the change

```sh
python3 tools/bridge_ele.py osc 280915773=77.1 280915772=78.4 \
  --insert 25758576:32.7314296,-117.1537524=77.1 -o cabrillo-ele.osc
```

`<node-id>=<ele>` tags existing nodes; `--insert <way>:<lat>,<lon>=<ele>`
adds a new node on that way at the nearest point to `lat,lon`. A node that
already has a different `ele` stops the script: find out who tagged it and
from what (its history on openstreetmap.org) before passing `--replace`.

## 5. Publish

You need an OpenStreetMap account. Imagery isn't needed to tag nodes; if
you want a background, use OSM's own map or the USGS NAIP layer, not
Bing, Mapbox, Google or Apple (see [`evidence.md`](evidence.md)).

**JOSM** opens the `.osc` directly: File → Open, check the nodes, then
Upload, with these changeset tags:

```
comment=Add ele (metres, NAVD88) to roadway nodes on <bridge> so 3D renderers can place the deck at its true height
source=USGS 3DEP lidar (<survey name>)
```

**iD**, the editor on openstreetmap.org, can't open a `.osc`, so enter the
tags by hand:

1. Open `https://www.openstreetmap.org/edit?editor=id&node=<node-id>`. It
   zooms to the node and selects it. Or type `n<node-id>` in iD's search
   box.
2. In the tag editor, switch to text view and add a line `ele=<value>`.
3. Repeat for each node. For a new node, double-click the way where it
   goes to add a vertex, and drag it until the Measurement panel
   (Ctrl+Shift+M) shows the latitude and longitude within a few metres.
   Then add its `ele`.
4. Save, with the comment above and `USGS 3DEP lidar (<survey name>)` as
   the source.

Barrelman imports the edit with the first daily Geofabrik diff that
covers it, so the night after you upload, and queues the bridge's decks.
Each night's OSM Update only rebuilds 1,000 queued cells, though, and a
backlog can hold the decks back for weeks. To rebuild them now, run "Build
Bridge Decks" in the Barrelman console with an area just around the bridge
(`w,s,e,n`) and a cell size of 0.025. That takes under a minute; check that
the OSM Update log after your upload says "Applied through sequence" with a
timestamp later than the changeset first, or it rebuilds the old heights.
Parchment caches deck tiles for a few minutes more.

## Worked example: San Diego, November 2026

The Coronado and Cabrillo decks, `CA_SanDiegoQL2_2014`:

| Bridge | Node | `ele` | Why |
|---|---|---|---|
| Coronado, both carriageways | 1041726340, 1041726498 | 69.1, 68.2 | Start of the crest curve |
| | 1041726347, 1041726492 | 75.1, 75.1 | Crest |
| | 12892533593, 12892533592 | 67.6, 69.2 | End of the crest curve |
| | 275961664, 275962168 | 34.7, 35.8 | San Diego end, before the ramps split |
| Cabrillo, El Prado | 280915773, 280915772 | 77.1, 78.4 | Ends, on the canyon rims |
| | new, 32.7314296, −117.1537524 | 77.1 | Where the level deck starts to climb |

The Coronado ends land on the toll-plaza fill and needed no tag. Checks:
every value within 0.1 m of a fresh reading, spread under 0.1 m; bay water
0.4–0.5 m in the same survey; Cabrillo's west end 77.1 m against 77.12 m
bare earth; Coronado's 4.66 % lidar grade against the published 4.67 %, and
its 75.1 m crest consistent with 195 ft (59.4 m) navigation clearance plus
the girders; Cabrillo's deck about 31 m over SR 163. Uploaded as changeset
191778316. After a "Build Bridge Decks" run over the two bridges, Barrelman's
decks passed through ten of the eleven nodes within 0.03 m; the Coronado
crest moved from 20 m to 75.1 m. The eleventh, Cabrillo's east end, is
drawn at 78.0 m against its 78.4 m: the deck is solved through 78.4, but
the mesh eases an end that lands on the ground onto the map's terrain so
the road meets it without a step, and the terrain there is 78.0 m. Tag a
landed end only to set the grade into the deck, as here, and expect it
drawn at the terrain.
