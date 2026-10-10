#!/usr/bin/env python3
"""OpenStreetMap lookups for a landmark.

    python3 tools/osm.py buildings <lon> <lat> <half-m> [out.json]
        Every building and building:part way within half metres, with its
        height tags; out.json gets the tags and coordinates too. This is
        the list `replaces` is chosen from.

    python3 tools/osm.py named <lon> <lat> <half-m> [filter]
        Every named or building-like node, way and relation nearby, with its
        centre and key tags (name, building, man_made, height, historic...).
        filter keeps lines whose tags contain the text.

    python3 tools/osm.py search "<query>" [west,south,east,north]
        Nominatim search, with OSM type/id, centre, height and wikidata.

buildings and named use the OSM API's map call, which returns everything in
a box. Overpass was too often slow or down to rely on. Keep half small (the
API refuses boxes over 50,000 nodes). Nominatim allows one request a second.
"""
import json, math, sys, time, urllib.parse, urllib.request, xml.etree.ElementTree as ET, os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import USER_AGENT  # noqa: E402


def get(url):
    return urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': USER_AGENT}), timeout=120).read()


def osm_map(lon, lat, half):
    dlat, dlon = half / 110574, half / (111320 * math.cos(math.radians(lat)))
    root = ET.fromstring(get(f'https://api.openstreetmap.org/api/0.6/map?bbox={lon-dlon},{lat-dlat},{lon+dlon},{lat+dlat}'))
    nodes = {n.get('id'): (float(n.get('lon')), float(n.get('lat'))) for n in root.iter('node')}
    return root, nodes


def tags_of(el):
    return {t.get('k'): t.get('v') for t in el.iter('tag')}


def buildings(lon, lat, half, out=None):
    root, nodes = osm_map(lon, lat, half)
    res = []
    for w in root.iter('way'):
        tags = tags_of(w)
        if 'building' not in tags and 'building:part' not in tags:
            continue
        coords = [nodes[nd.get('ref')] for nd in w.iter('nd') if nd.get('ref') in nodes]
        res.append({'id': f"way/{w.get('id')}", 'tags': tags, 'coords': coords})
    if out:
        with open(out, 'w') as f:
            json.dump(res, f, indent=1)
    for v in res:
        t = v['tags']
        kind = f"building={t['building']}" if 'building' in t else 'part'
        print(v['id'], kind, 'height=', t.get('height'), 'min_height=', t.get('min_height'), 'levels=', t.get('building:levels'),
              t.get('roof:shape', ''), t.get('name', '')[:40])
    # Relations (multipolygon outlines) are not expanded; list them so they aren't missed.
    for r in root.iter('relation'):
        t = tags_of(r)
        if 'building' in t or 'building:part' in t:
            print(f"relation/{r.get('id')}", 'building=', t.get('building'), 'part=', t.get('building:part'), t.get('name', '')[:40])


KEYS = ('name', 'building', 'building:part', 'man_made', 'tower:type', 'height', 'bridge:support', 'historic', 'amenity', 'tourism', 'leisure', 'wikidata')


def named(lon, lat, half, flt=''):
    root, nodes = osm_map(lon, lat, half)
    flt = flt.lower()
    for el in list(root.iter('node')) + list(root.iter('way')) + list(root.iter('relation')):
        tags = tags_of(el)
        info = {k: v for k, v in tags.items() if k in KEYS}
        s = json.dumps(info, ensure_ascii=False)
        if not any(k in tags for k in ('name', 'building', 'building:part', 'man_made', 'bridge:support')):
            continue
        if flt and flt not in s.lower():
            continue
        c = ''
        if el.tag == 'node':
            c = '%.6f %.6f' % nodes[el.get('id')]
        elif el.tag == 'way':
            pts = [nodes[nd.get('ref')] for nd in el.iter('nd') if nd.get('ref') in nodes]
            if pts:
                c = '%.6f %.6f' % (sum(p[0] for p in pts) / len(pts), sum(p[1] for p in pts) / len(pts))
        print(f'{el.tag}/{el.get("id")}', c, s[:200])


def search(query, viewbox=None):
    q = {'q': query, 'format': 'json', 'limit': 5, 'extratags': 1}
    if viewbox:
        q.update(viewbox=viewbox, bounded=1)
    for r in json.loads(get('https://nominatim.openstreetmap.org/search?' + urllib.parse.urlencode(q))):
        et = r.get('extratags') or {}
        print(f"{r['osm_type']}/{r['osm_id']}", r['class'], r['type'], r['lat'], r['lon'], '|', r['display_name'][:70],
              '| height=', et.get('height'), 'wikidata=', et.get('wikidata'))
    time.sleep(1.1)


if __name__ == '__main__':
    a = sys.argv[1:]
    if not a or a[0] not in ('buildings', 'named', 'search'):
        sys.exit(__doc__)
    if a[0] == 'search':
        search(a[1], a[2] if len(a) > 2 else None)
    elif a[0] == 'buildings':
        buildings(float(a[1]), float(a[2]), float(a[3]), a[4] if len(a) > 4 else None)
    else:
        named(float(a[1]), float(a[2]), float(a[3]), a[4] if len(a) > 4 else '')
