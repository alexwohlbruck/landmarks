#!/usr/bin/env python3
"""Los Angeles County open data: lidar building footprints and the surface model.

LA County publishes its LARIAC lidar products as public map services, which
filled in where the 3DEP point clouds were awkward to use. An example of the
county and city layers worth looking for in any new city (see docs/evidence.md).

    python3 tools/lacounty.py buildings <lon> <lat> <half-m> [out.json]
        LARIAC 2020 building footprints within half metres, tallest first:
        id, roof height above ground (m), ground elevation (m), area, centre
        and vertex count, in local metres (x east, y north). out.json gets the
        rings as well.

    python3 tools/lacounty.py dsm <lon> <lat> <bearing> <umin> <umax> <vmin> <vmax> <step> <out.json>
        Surface elevations (m) sampled on a grid in a model's own frame: u is
        to the right of the bearing, v along it. Samples that fail are
        retried, then left null. Re-run with the same out.json to fill nulls.

Both are requested in EPSG:3857 and corrected by cos(lat).
"""
import json, math, os, sys, urllib.parse, urllib.request
from concurrent.futures import ThreadPoolExecutor

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import USER_AGENT, mercator  # noqa: E402

FT = 0.3048
SERVICES = 'https://public.gis.lacounty.gov/public/rest/services/LACounty_Dynamic'


def get(url):
    return json.load(urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': USER_AGENT}), timeout=120))


def buildings(lon, lat, half, out=None):
    mx, my, k = mercator(lon, lat)
    h = half * k
    q = {'where': '1=1', 'geometry': f'{mx - h},{my - h},{mx + h},{my + h}', 'geometryType': 'esriGeometryEnvelope',
         'inSR': 3857, 'outSR': 3857, 'spatialRel': 'esriSpatialRelIntersects', 'outFields': 'BLD_ID,HEIGHT,ELEV,CODE,DATE_,STATUS',
         'returnGeometry': 'true', 'f': 'json'}
    d = get(f'{SERVICES}/LARIAC_Buildings_2020/MapServer/0/query?' + urllib.parse.urlencode(q))
    area = lambda r: abs(sum(r[i][0] * r[i - 1][1] - r[i - 1][0] * r[i][1] for i in range(len(r)))) / 2
    res = []
    for f in d.get('features', []):
        a = f['attributes']
        rings = [[[round((x - mx) / k, 2), round((y - my) / k, 2)] for x, y in r] for r in f['geometry']['rings']]
        res.append({'id': a['BLD_ID'], 'height_m': round((a['HEIGHT'] or 0) * FT, 2), 'ground_elev_m': round((a['ELEV'] or 0) * FT, 2),
                    'code': a['CODE'], 'date': a.get('DATE_'), 'area_m2': round(area(rings[0]), 1), 'rings': rings})
    res.sort(key=lambda r: -r['height_m'])
    for r in res:
        ring = r['rings'][0]
        cx, cy = sum(p[0] for p in ring) / len(ring), sum(p[1] for p in ring) / len(ring)
        print(f"{r['id']}  h={r['height_m']:7.2f} m  ground={r['ground_elev_m']:7.2f} m  area={r['area_m2']:9.1f} m2  centre=({cx:.1f},{cy:.1f})  verts={len(ring)}  {r['code']}")
    if out:
        with open(out, 'w') as f:
            json.dump({'lon': lon, 'lat': lat, 'half': half, 'source': 'LA County LARIAC 2020 buildings', 'parts': res}, f)


def dsm(lon, lat, bearing, u0, u1, v0, v1, step, out):
    mx, my, k = mercator(lon, lat)
    B = math.radians(bearing)
    nu, nv = int(round((u1 - u0) / step)) + 1, int(round((v1 - v0) / step)) + 1
    d = {'lon': lon, 'lat': lat, 'bearing': bearing, 'u0': u0, 'v0': v0, 'step': step, 'nu': nu, 'nv': nv, 'z': [None] * (nu * nv)}
    if os.path.exists(out):
        with open(out) as f:
            old = json.load(f)
        if all(old.get(key) == d[key] for key in ('lon', 'lat', 'bearing', 'u0', 'v0', 'step', 'nu', 'nv')):
            d = old

    def sample(idx):
        j, i = divmod(idx, nu)
        u, v = u0 + i * step, v0 + j * step
        x, y = u * math.cos(B) + v * math.sin(B), -u * math.sin(B) + v * math.cos(B)
        px, py = mx + x * k, my + y * k
        q = {'geometry': f'{px},{py}', 'geometryType': 'esriGeometryPoint', 'sr': 3857, 'layers': 'all:8', 'tolerance': 0,
             'mapExtent': f'{px - 50},{py - 50},{px + 50},{py + 50}', 'imageDisplay': '100,100,96', 'returnGeometry': 'false', 'f': 'json'}
        for _ in range(6):
            try:
                val = get(f'{SERVICES}/Elevation/MapServer/identify?' + urllib.parse.urlencode(q))['results'][0]['attributes']['Stretch.Pixel Value']
                return idx, None if val in ('NoData', None) else float(val) * FT
            except Exception:
                pass
        return idx, None

    todo = [i for i, z in enumerate(d['z']) if z is None]
    with ThreadPoolExecutor(8) as ex:
        for idx, z in ex.map(sample, todo):
            d['z'][idx] = z
    with open(out, 'w') as f:
        json.dump(d, f)
    print(f'{len(todo)} sampled, {sum(z is None for z in d["z"])} still missing; z[j * nu + i] is at u = u0 + i * step, v = v0 + j * step')


if __name__ == '__main__':
    a = sys.argv[1:]
    if a[:1] == ['buildings'] and len(a) >= 4:
        buildings(float(a[1]), float(a[2]), float(a[3]), a[4] if len(a) > 4 else None)
    elif a[:1] == ['dsm'] and len(a) == 10:
        dsm(*map(float, a[1:9]), a[9])
    else:
        sys.exit(__doc__)
