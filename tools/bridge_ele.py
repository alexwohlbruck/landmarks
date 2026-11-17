#!/usr/bin/env python3
"""Measure bridge roadway heights from lidar and write them as OSM `ele` tags.

    python3 tools/bridge_ele.py measure <way-id> [<way-id> ...] [--every M] [--dataset NAME] [--json out.json]
        The roadway height under every node of the ways, from the USGS 3DEP
        lidar, beside the bare-earth ground there and any `ele` already tagged.
        Ways are joined end to end in the order given, so list one
        carriageway's ways from one end of the bridge to the other. --every
        also reads points every M metres between the nodes, listed with their
        lat,lon instead of a node id, to find a grade break no node marks.

    python3 tools/bridge_ele.py osc <node-id>=<ele> ... [--insert <way-id>:<lat>,<lon>=<ele>] [--replace] -o out.osc
        An osmChange file adding `ele` to the nodes, at their current OSM
        versions, and optionally a new node with `ele` inserted into a way at
        the nearest point of its nearest segment. Open it in JOSM to upload.

Heights are metres in the lidar's vertical datum, NAVD88 in the US, which is
what `ele` and the map's terrain use. See docs/bridge-heights.md for choosing
the nodes, checking the values and publishing them.

`measure` reads the lidar through tools/lidar.py, so it needs the same
packages: pip install -r tools/requirements.txt. Point-cloud tiles are shared
between nodes in a temporary cache that is deleted on exit.
"""
import argparse, json, math, os, shutil, subprocess, sys, tempfile, urllib.parse, urllib.request
from concurrent.futures import ThreadPoolExecutor
from xml.sax.saxutils import quoteattr

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import USER_AGENT, mercator  # noqa: E402

OSM = 'https://api.openstreetmap.org/api/0.6/'
LIDAR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'lidar.py')
# Surface cells within this many metres of a node are read: a lane's width
# either side would reach the next lane, a parapet or the median.
RADIUS = 1.5


def get(url):
    req = urllib.request.Request(url, headers={'User-Agent': USER_AGENT})
    return json.loads(urllib.request.urlopen(req, timeout=120).read())


def full_way(way_id):
    els = get(f'{OSM}way/{way_id}/full.json')['elements']
    nodes = {e['id']: e for e in els if e['type'] == 'node'}
    way = next(e for e in els if e['type'] == 'way')
    return way, [nodes[n] for n in way['nodes']]


def chain(way_ids):
    """The ways' nodes joined end to end, in the order the ways are given."""
    out = []
    for way_id in way_ids:
        _, nodes = full_way(way_id)
        if out:
            ends = (out[0]['id'], out[-1]['id'])
            if nodes[-1]['id'] in ends:
                nodes = nodes[::-1]
            if nodes[0]['id'] == out[0]['id'] and len(out) > 1:
                out = out[::-1]
            if nodes[0]['id'] != out[-1]['id']:
                sys.exit(f'way {way_id} does not meet the ways before it; list one carriageway in order')
            nodes = nodes[1:]
        out += nodes
    return out


def metres(a, b):
    k = 111320 * math.cos(math.radians(a['lat']))
    return math.hypot((a['lon'] - b['lon']) * k, (a['lat'] - b['lat']) * 110574)


def bare_earth(points):
    """USGS 3DEP bare-earth heights at (lon, lat) points, the ground with bridges taken out."""
    out = []
    for b in range(0, len(points), 100):
        chunk = points[b:b + 100]
        geom = {'points': [list(mercator(lon, lat)[:2]) for lon, lat in chunk], 'spatialReference': {'wkid': 3857}}
        q = {'geometry': json.dumps(geom), 'geometryType': 'esriGeometryMultipoint', 'returnFirstValueOnly': 'true', 'f': 'json'}
        d = get('https://elevation.nationalmap.gov/arcgis/rest/services/3DEPElevation/ImageServer/getSamples?' + urllib.parse.urlencode(q))
        z = {s['locationId']: float(s['value']) for s in d['samples'] if s.get('value') not in (None, 'NoData')}
        out += [z.get(i) for i in range(len(chunk))]
    return out


def surface(node, dataset, tmp, env):
    """The roadway under a node: the lower quartile of the lidar surface within RADIUS, and its spread."""
    prefix = os.path.join(tmp, f"p{node['lon']:.7f}_{node['lat']:.7f}")
    cmd = [sys.executable, LIDAR, 'grid', str(node['lon']), str(node['lat']), '4', prefix, '--res', '0.5']
    if dataset:
        cmd += ['--dataset', dataset]
    run = subprocess.run(cmd, capture_output=True, text=True, env=env)
    if run.returncode:
        return None
    with open(prefix + '.json') as f:
        d = json.load(f)
    cells = sorted(d['dsm'][r][c] for r in range(d['n']) for c in range(d['n'])
                   if d['dsm'][r][c] is not None
                   and (-d['half'] + (c + .5) * d['res']) ** 2 + (d['half'] - (r + .5) * d['res']) ** 2 <= RADIUS ** 2)
    if not cells:
        return None
    return {'road': cells[len(cells) // 4], 'spread': round(cells[len(cells) // 2] - cells[0], 2), 'cells': len(cells), 'dataset': d['dataset']}


def measure(a):
    nodes, along = [], []
    chained = chain(a.ways)
    for i, n in enumerate(chained):
        s = along[-1] + metres(chained[i - 1], n) if i else 0.0
        if a.every and i:
            p, gap = chained[i - 1], metres(chained[i - 1], n)
            for j in range(1, int(gap // a.every) + 1):
                t = j * a.every / gap
                if t < 1:
                    nodes.append({'id': None, 'lon': p['lon'] + t * (n['lon'] - p['lon']), 'lat': p['lat'] + t * (n['lat'] - p['lat'])})
                    along.append(along[-1] + a.every if j > 1 else s - gap + a.every)
        nodes.append(n)
        along.append(s)
    tmp = tempfile.mkdtemp(prefix='bridge-ele-')
    try:
        env = dict(os.environ, LIDAR_CACHE=os.path.join(tmp, 'cache'))
        with ThreadPoolExecutor(4) as pool:
            lidar = list(pool.map(lambda n: surface(n, a.dataset, tmp, env), nodes))
    finally:
        shutil.rmtree(tmp, True)
    ground = bare_earth([(n['lon'], n['lat']) for n in nodes])
    rows = []
    sets = {l['dataset'] for l in lidar if l}
    print(f"lidar: {', '.join(sorted(sets)) or 'none'}; heights in metres, NAVD88 in the US")
    print(f"{'node or lat,lon':>24} {'s m':>7} {'road':>7} {'spread':>6} {'ground':>7} {'above':>6} {'ele now':>8}")
    for n, s, l, g in zip(nodes, along, lidar, ground):
        now = n.get('tags', {}).get('ele')
        road = l['road'] if l else None
        rows.append({'id': n['id'], 'lon': n['lon'], 'lat': n['lat'], 's': round(s, 1), 'road': road,
                     'spread': l['spread'] if l else None, 'ground': None if g is None else round(g, 2), 'ele': now})
        fmt = lambda v, w: f'{v:{w}.2f}' if v is not None else f"{'-':>{w}}"
        above = road - g if road is not None and g is not None else None
        name = n['id'] or f"{n['lat']:.7f},{n['lon']:.7f}"
        print(f"{name:>24} {s:7.0f} {fmt(road, 7)} {fmt(l['spread'] if l else None, 6)} {fmt(g, 7)} {fmt(above, 6)} {now or '':>8}")
    if a.json:
        with open(a.json, 'w') as f:
            json.dump(rows, f, indent=1)
        print(f'wrote {a.json}')


def tags_xml(tags):
    return ''.join(f'\n      <tag k={quoteattr(k)} v={quoteattr(v)}/>' for k, v in sorted(tags.items()))


def osc(a):
    pins = {}
    for item in a.pins:
        node_id, _, ele = item.partition('=')
        pins[int(node_id)] = f'{float(ele):.1f}'
    created, ways, new = [], {}, {}
    for i, item in enumerate(a.insert or []):
        where, _, ele = item.partition('=')
        way_id, _, at = where.partition(':')
        lat, lon = (float(v) for v in at.split(','))
        way = ways.get(int(way_id)) or get(f'{OSM}way/{way_id}.json')['elements'][0]
        coords = {n['id']: n for n in full_way(way_id)[1]}
        coords.update(new)
        # The segment nearest the point, and the point moved onto it.
        k = 111320 * math.cos(math.radians(lat))
        best = None
        for j, (p, q) in enumerate(zip(way['nodes'], way['nodes'][1:])):
            px, py = coords[p]['lon'] * k, coords[p]['lat'] * 110574
            dx, dy = coords[q]['lon'] * k - px, coords[q]['lat'] * 110574 - py
            t = max(0, min(1, ((lon * k - px) * dx + (lat * 110574 - py) * dy) / (dx * dx + dy * dy)))
            d = math.hypot(px + t * dx - lon * k, py + t * dy - lat * 110574)
            if best is None or d < best[0]:
                best = (d, j, (px + t * dx) / k, (py + t * dy) / 110574)
        d, j, on_lon, on_lat = best
        if d > 2:
            print(f'note: the new node on way {way_id} was moved {d:.1f} m onto the way', file=sys.stderr)
        new_id = -(i + 1)
        created.append(f'    <node id="{new_id}" version="0" lat="{on_lat:.7f}" lon="{on_lon:.7f}">'
                       f'{tags_xml({"ele": f"{float(ele):.1f}"})}\n    </node>')
        way['nodes'].insert(j + 1, new_id)
        new[new_id] = {'lon': on_lon, 'lat': on_lat}
        ways[way['id']] = way
    modified = []
    for node_id, ele in pins.items():
        n = get(f'{OSM}node/{node_id}.json')['elements'][0]
        tags = dict(n.get('tags', {}))
        if 'ele' in tags and tags['ele'] != ele and not a.replace:
            sys.exit(f'node {node_id} already has ele={tags["ele"]}; check it, then pass --replace to overwrite')
        tags['ele'] = ele
        modified.append(f'    <node id="{node_id}" version="{n["version"]}" lat="{n["lat"]}" lon="{n["lon"]}">{tags_xml(tags)}\n    </node>')
    for way in ways.values():
        nds = ''.join(f'\n      <nd ref="{r}"/>' for r in way['nodes'])
        modified.append(f'    <way id="{way["id"]}" version="{way["version"]}">{nds}{tags_xml(way.get("tags", {}))}\n    </way>')
    out = ['<?xml version="1.0" encoding="UTF-8"?>', '<osmChange version="0.6" generator="landmarks tools/bridge_ele.py">']
    if created:
        out += ['  <create>', *created, '  </create>']
    out += ['  <modify>', *modified, '  </modify>', '</osmChange>', '']
    with open(a.out, 'w') as f:
        f.write('\n'.join(out))
    print(f'wrote {a.out}: {len(pins)} nodes tagged, {len(created)} created, {len(ways)} ways changed')


p = argparse.ArgumentParser(description=__doc__.split('\n\n')[0])
sub = p.add_subparsers(dest='cmd', required=True)
m = sub.add_parser('measure', help='lidar roadway height under every node of the ways')
m.add_argument('ways', nargs='+', type=int, help='way ids, one carriageway, end to end')
m.add_argument('--every', type=float, help='also read points this many metres apart between the nodes')
m.add_argument('--dataset', default='', help='3DEP EPT name or tools/lidar.py alias; default: newest covering')
m.add_argument('--json', help='also write the rows here')
m.set_defaults(run=measure)
o = sub.add_parser('osc', help='osmChange adding ele to nodes')
o.add_argument('pins', nargs='+', help='<node-id>=<ele in metres>')
o.add_argument('--insert', action='append', help='<way-id>:<lat>,<lon>=<ele>: a new node with ele on that way')
o.add_argument('--replace', action='store_true', help='overwrite an ele already tagged')
o.add_argument('-o', '--out', required=True, help='the .osc file to write')
o.set_defaults(run=osc)
if len(sys.argv) == 1:
    sys.exit(__doc__)
args = p.parse_args()
args.run(args)
