#!/usr/bin/env python3
"""Lidar surface model around a point, from the USGS 3DEP point clouds on AWS.

    python3 tools/lidar.py find <lon> <lat>
        List the 3DEP point-cloud datasets that cover a point, newest first.

    python3 tools/lidar.py grid <lon> <lat> <half-m> <out-prefix> [--res 1.0] [--dataset NAME]
        Heights in a square of side 2*half around the point.

The point clouds are public domain (USGS 3DEP) and served as Entwine Point
Tiles in web mercator, EPSG:3857. Distances in 3857 are stretched by
1/cos(lat), so the query box is widened by that factor and every offset is
divided by it again: the output grid is in true metres, with no north-south
stretch. (Asking a raster server for EPSG:4326 on a square pixel grid instead
stretches north-south by about a quarter at mid latitudes.)

--dataset is a USGS EPT name such as USGS_LPC_NC_Phase4_Mecklenburg_2016_LAS_2019
or WA_KingCo_1_2021, or a short alias from ALIASES below. Without it, the
newest dataset that covers the point is used. `find` shows the choices; the
year in the name is roughly the flight year, so anything built or altered
since won't show.

grid writes:
  <out>.json  {lon, lat, res, n, half, dataset, ground_min, dsm, gnd}. Rows run
              north to south, columns west to east; cell (r, c) is centred at
              x = -half + (c + .5) * res east, y = half - (r + .5) * res north.
              dsm is the highest non-noise return per cell (null where empty),
              gnd the lowest ground-classified (class 2) return (null if none).
              Z is metres above the dataset's vertical datum (NAVD88 in the US).
  <out>.png   height above ground_min, north up, red cross on the anchor,
              grid lines every 10 m.
and prints ground_min, the top of the surface, and a coarse table of heights
above ground_min.

Use --res 0.5 for small things (half <= 60 m) and 1 m otherwise. Keep half to
the footprint plus about 10 m: the download grows with the square of it.

Point-cloud tiles are downloaded into a temporary directory that is deleted
when the script exits, so nothing large is left behind. (The disk once filled
with cached clouds.) Set LIDAR_CACHE to a directory to keep them between runs
on one site, and delete it when done.

Requires numpy and laspy with a LAZ backend: pip install -r tools/requirements.txt
"""
import argparse, atexit, io, json, os, shutil, struct, sys, tempfile, urllib.request, zlib

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import USER_AGENT, mercator  # noqa: E402

BASE = 'https://s3-us-west-2.amazonaws.com/usgs-lidar-public/'
# Index of every dataset and its coverage, maintained by Hobu with the USGS.
INDEX = 'https://raw.githubusercontent.com/hobuinc/usgs-lidar/master/boundaries/resources.geojson'
# Datasets used in past batches, by a short name. Any EPT name works too.
ALIASES = {
    'clt': 'USGS_LPC_NC_Phase4_Mecklenburg_2016_LAS_2019',  # Charlotte, Mecklenburg County, 2016
    'sf': 'CA_SanFrancisco_1_B23',  # San Francisco, Yerba Buena, Alcatraz, the Golden Gate, 2023
    'alameda': 'CA_AlamedaCo_2_2021',  # Oakland, Berkeley; try alameda1 or alameda3 if empty
    'alameda1': 'CA_AlamedaCo_1_2021',
    'alameda3': 'CA_AlamedaCo_3_2021',
    'nyc': 'NY_NewYorkCity',  # the five boroughs and the Hudson waterfront, 2017
    'king': 'WA_KingCo_1_2021',  # Seattle, Bellevue
    'pierce': 'WA_PierceCounty_1_2020',  # Tacoma
}

cache = os.environ.get('LIDAR_CACHE')
if cache:
    os.makedirs(cache, exist_ok=True)
else:
    cache = tempfile.mkdtemp(prefix='lidar-')
    atexit.register(shutil.rmtree, cache, True)


def fetch(url, name):
    """Download once into the cache; returns the bytes."""
    path = os.path.join(cache, name.replace('/', '__'))
    if not os.path.exists(path):
        data = urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': USER_AGENT}), timeout=300).read()
        tmp = f'{path}.{os.getpid()}'
        with open(tmp, 'wb') as f:
            f.write(data)
        os.replace(tmp, path)
    with open(path, 'rb') as f:
        return f.read()


def inside(lon, lat, ring):
    hit = False
    for i in range(len(ring)):
        (x1, y1), (x2, y2) = ring[i - 1][:2], ring[i][:2]
        if (y1 > lat) != (y2 > lat) and lon < x1 + (lat - y1) * (x2 - x1) / (y2 - y1):
            hit = not hit
    return hit


def covering(lon, lat):
    index = json.loads(fetch(INDEX, 'resources.geojson'))
    found = []
    for f in index['features']:
        g = f['geometry']
        polys = g['coordinates'] if g['type'] == 'MultiPolygon' else [g['coordinates']]
        if any(inside(lon, lat, p[0]) and not any(inside(lon, lat, h) for h in p[1:]) for p in polys):
            found.append(f['properties'])
    # Newest first: the last four-digit year in the name, roughly the flight.
    year = lambda p: max([int(t) for t in p['name'].replace('-', '_').split('_') if t.isdigit() and len(t) == 4] or [0])
    return sorted(found, key=lambda p: (-year(p), p['name']))


def find(a):
    for p in covering(a.lon, a.lat):
        print(f"{p['name']:60} {p['count'] / 1e9:6.1f} G points")


def grid(a):
    import numpy as np
    import laspy

    name = ALIASES.get(a.dataset, a.dataset)
    if not name:
        sets = covering(a.lon, a.lat)
        if not sets:
            sys.exit('no 3DEP point cloud covers this point; use photos, OSM and published heights')
        name = sets[0]['name']
    get = lambda path: fetch(f'{BASE}{name}/{path}', f'{name}/{path}')
    lon, lat, half, res = a.lon, a.lat, a.half, a.res

    ept = json.loads(get('ept.json'))
    mx, my, k = mercator(lon, lat)
    h = half * k
    qb = (mx - h, my - h, mx + h, my + h)

    hier = {}
    hier.update(json.loads(get('ept-hierarchy/0-0-0-0.json')))
    b0 = ept['bounds']
    keys = []

    def walk(d, x, y, z):
        key = f'{d}-{x}-{y}-{z}'
        if key not in hier:
            return
        if hier[key] == -1:  # a subtree with its own hierarchy file
            hier.update(json.loads(get(f'ept-hierarchy/{key}.json')))
        w = (b0[3] - b0[0]) / 2 ** d
        x0, y0 = b0[0] + x * w, b0[1] + y * w
        if x0 > qb[2] or x0 + w < qb[0] or y0 > qb[3] or y0 + w < qb[1]:
            return
        if hier[key] > 0:
            keys.append(key)
        for dx in (0, 1):
            for dy in (0, 1):
                for dz in (0, 1):
                    walk(d + 1, 2 * x + dx, 2 * y + dy, 2 * z + dz)

    walk(0, 0, 0, 0)

    n = int(round(2 * half / res))
    dsm = np.full((n, n), -np.inf)
    gnd = np.full((n, n), np.inf)
    for key in keys:
        las = laspy.read(io.BytesIO(get(f'ept-data/{key}.laz')))
        X, Y, Z = np.asarray(las.x), np.asarray(las.y), np.asarray(las.z)
        c = np.asarray(las.classification)
        # 7 and 18 are low and high noise: birds, cranes' reflections, multipath.
        m = (X >= qb[0]) & (X < qb[2]) & (Y >= qb[1]) & (Y < qb[3]) & (c != 7) & (c != 18)
        if not m.any():
            continue
        X, Y, Z, c = X[m], Y[m], Z[m], c[m]
        col = ((X - qb[0]) / k / res).astype(int).clip(0, n - 1)
        row = ((qb[3] - Y) / k / res).astype(int).clip(0, n - 1)
        np.maximum.at(dsm, (row, col), Z)
        g = c == 2
        np.minimum.at(gnd, (row[g], col[g]), Z[g])

    dsm[np.isinf(dsm)] = np.nan
    gnd[np.isinf(gnd)] = np.nan
    if np.isnan(dsm).all():
        sys.exit(f'{name}: no points here; try another dataset (tools/lidar.py find {lon} {lat})')
    gmin = float(np.nanmin(gnd)) if np.isfinite(gnd).any() else float(np.nanmin(dsm))
    r2 = lambda arr: [[None if np.isnan(v) else round(float(v), 2) for v in row] for row in arr]
    with open(a.out + '.json', 'w') as f:
        json.dump({'lon': lon, 'lat': lat, 'res': res, 'n': n, 'half': half, 'dataset': name,
                   'note': 'rows north->south, cols west->east; cell (r,c) centre x=-half+(c+.5)*res east, y=half-(r+.5)*res north',
                   'ground_min': round(gmin, 2), 'dsm': r2(dsm), 'gnd': r2(gnd)}, f)

    # Image: height above ground_min, dark to light, shaded from the north-west.
    hgt = np.nan_to_num(dsm - gmin, nan=0).clip(0, None)
    t = hgt / max(1.0, float(hgt.max()))
    img = np.zeros((n, n, 3), dtype=np.uint8)
    img[..., 0] = (40 + 215 * t).astype(np.uint8)
    img[..., 1] = (40 + 215 * np.sqrt(t)).astype(np.uint8)
    img[..., 2] = (90 + 165 * t ** 2).astype(np.uint8)
    gy, gx = np.gradient(np.nan_to_num(dsm, nan=gmin))
    shade = np.clip(1 - 0.08 * (gx - gy), 0.55, 1.25)
    img = (img * shade[..., None]).clip(0, 255).astype(np.uint8)
    step = max(1, int(round(10 / res)))
    c0 = int(round(half / res))
    for i in range(c0 % step, n, step):
        img[i, :, :] = img[i, :, :] // 2 + 40
        img[:, i, :] = img[:, i, :] // 2 + 40
    img[c0, :, :] = [255, 60, 60]
    img[:, c0, :] = [255, 60, 60]
    up = max(1, 600 // n)
    img = img.repeat(up, 0).repeat(up, 1)
    N = n * up
    raw = b''.join(b'\x00' + img[r].tobytes() for r in range(N))
    chunk = lambda tag, d: struct.pack('>I', len(d)) + tag + d + struct.pack('>I', zlib.crc32(tag + d) & 0xffffffff)
    with open(a.out + '.png', 'wb') as f:
        f.write(b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', struct.pack('>IIBBBBB', N, N, 8, 2, 0, 0, 0))
                + chunk(b'IDAT', zlib.compress(raw, 6)) + chunk(b'IEND', b''))

    print(f'{name}: {len(keys)} nodes; ground_min {gmin:.2f} m; max surface {np.nanmax(dsm):.2f} m = {np.nanmax(dsm) - gmin:.2f} m above ground_min')
    print(f'image {a.out}.png: {N}x{N} px, {up} px per {res} m cell, north up, red cross = anchor, grid every 10 m')
    cs = max(1, int(round(n / 20)))
    print(f'heights above ground_min (max per {cs * res:.0f} m block); rows y north, cols x east:')
    print('      ' + ' '.join(f'{-half + (j + .5) * cs * res:5.0f}' for j in range(0, n // cs)))
    for i in range(0, n // cs):
        blk = hgt[i * cs:(i + 1) * cs]
        print(f'{half - (i + .5) * cs * res:5.0f} ' + ' '.join(f'{blk[:, j * cs:(j + 1) * cs].max():5.0f}' for j in range(0, n // cs)))


p = argparse.ArgumentParser(description=__doc__.split('\n\n')[0])
sub = p.add_subparsers(dest='cmd', required=True)
f = sub.add_parser('find', help='datasets covering a point')
f.add_argument('lon', type=float)
f.add_argument('lat', type=float)
f.set_defaults(run=find)
g = sub.add_parser('grid', help='surface and ground grid around a point')
g.add_argument('lon', type=float)
g.add_argument('lat', type=float)
g.add_argument('half', type=float, help='half the side of the square, metres')
g.add_argument('out', help='output prefix; writes <out>.json and <out>.png')
g.add_argument('--res', type=float, default=1.0, help='cell size in metres (default 1)')
g.add_argument('--dataset', default='', help='EPT name or alias; default: newest covering the point')
g.set_defaults(run=grid)
args = p.parse_args()
args.run(args)
