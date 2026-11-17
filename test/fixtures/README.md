The three `.pbf` fixtures are minimal building-layer extracts from OpenFreeMap
vector tiles, retaining the full merged features that overlap each reported
landmark. `building-replacements.json` records the original tile URLs and
coordinates. They reproduce the lost-ID/merged-polygon replacement failures.

Data: © OpenStreetMap contributors, ODbL-1.0. Tiles: OpenFreeMap / OpenMapTiles.
The fixtures retain disconnected neighboring buildings so tests verify that
replacement does not delete an entire merged feature.
