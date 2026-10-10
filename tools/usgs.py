#!/usr/bin/env python3
"""Public-domain US imagery and terrain from the USGS National Map.

    python3 tools/usgs.py naip <lon> <lat> <half-m> <out.png> [size-px=800]
        NAIP orthophoto (USGS NAIP Plus), north up, true scale: the plan,
        roof colours and shadows. Public domain.

    python3 tools/usgs.py dem <lon> <lat> <half-m> [step-m=5]
        A table of bare-earth ground elevations (3DEP DEM, metres) around the
        point, local x east and y north: how the site slopes, and which side
        is the lowest ground. Public domain.

Both are requested in EPSG:3857 and corrected by cos(lat), so there is no
north-south stretch.
"""
import json, os, sys, urllib.parse, urllib.request

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import USER_AGENT, mercator  # noqa: E402


def get(url):
    return urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': USER_AGENT}), timeout=120).read()


def naip(lon, lat, half, out, size=800):
    x, y, k = mercator(lon, lat)
    h = half * k
    q = {'bbox': f'{x - h},{y - h},{x + h},{y + h}', 'bboxSR': 3857, 'imageSR': 3857, 'size': f'{size},{size}', 'format': 'png', 'f': 'image'}
    with open(out, 'wb') as f:
        f.write(get('https://imagery.nationalmap.gov/arcgis/rest/services/USGSNAIPPlus/ImageServer/exportImage?' + urllib.parse.urlencode(q)))
    print(out, f'{2 * half / size:.2f} m per px')


def dem(lon, lat, half, step=5.0):
    mx, my, k = mercator(lon, lat)
    n = int(2 * half / step) + 1
    pts = [(-half + i * step, -half + j * step) for j in range(n) for i in range(n)]
    z = {}
    for b in range(0, len(pts), 100):
        chunk = pts[b:b + 100]
        geom = {'points': [[mx + px * k, my + py * k] for px, py in chunk], 'spatialReference': {'wkid': 3857}}
        q = {'geometry': json.dumps(geom), 'geometryType': 'esriGeometryMultipoint', 'returnFirstValueOnly': 'true', 'f': 'json'}
        d = json.loads(get('https://elevation.nationalmap.gov/arcgis/rest/services/3DEPElevation/ImageServer/getSamples?' + urllib.parse.urlencode(q)))
        for s in d['samples']:
            z[chunk[s['locationId']]] = float(s['value'])
    for j in reversed(range(n)):
        y = -half + j * step
        print(f'{y:6.0f} ' + ' '.join(f'{z[(-half + i * step, y)]:6.1f}' for i in range(n)))
    print('       ' + ' '.join(f'{-half + i * step:6.0f}' for i in range(n)))


if __name__ == '__main__':
    a = sys.argv[1:]
    if len(a) < 4 or a[0] not in ('naip', 'dem'):
        sys.exit(__doc__)
    if a[0] == 'naip':
        naip(float(a[1]), float(a[2]), float(a[3]), a[4], int(a[5]) if len(a) > 5 else 800)
    else:
        dem(float(a[1]), float(a[2]), float(a[3]), float(a[4]) if len(a) > 4 else 5.0)
