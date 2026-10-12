#!/usr/bin/env python3
"""Find licensed photos of a landmark.

    python3 tools/photos.py commons "<query>" [limit=30]
        Wikimedia Commons files: title, size, licence, author, a 1024 px
        thumbnail URL and the file page.

    python3 tools/photos.py openverse "<query>" [page=1]
        Openverse (CC-licensed Flickr and others): size, licence, creator,
        title, URL and the landing page.

Every line is tagged EVIDENCE or LOOK-ONLY. Evidence is anything a model may
be shaped from: public domain, CC0, CC BY and CC BY-SA. Non-commercial (NC)
and no-derivatives (ND) licences, and anything unlicensed, are look-only: they
may be looked at and described, never relied on, and must be listed apart in
the generator header. See docs/evidence.md.

Record each photo you use with its URL, author and licence as you go; the
generator header and the PR credits need all three.
"""
import json, os, re, sys, urllib.parse, urllib.request

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import USER_AGENT  # noqa: E402


def get(url):
    return json.load(urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': USER_AGENT}), timeout=60))


def usable(licence):
    l = licence.lower().replace('-', ' ')
    if ' nc' in f' {l}' or ' nd' in f' {l}' or 'noncommercial' in l or 'no deriv' in l:
        return False
    return any(k in l for k in ('public domain', 'pd', 'cc0', 'cc by', 'by sa', 'by '))


def tag(licence):
    return 'EVIDENCE ' if usable(licence) else 'LOOK-ONLY'


def commons(query, limit='30'):
    p = {'action': 'query', 'format': 'json', 'generator': 'search', 'gsrsearch': query, 'gsrnamespace': '6', 'gsrlimit': limit,
         'prop': 'imageinfo', 'iiprop': 'url|size|mime|extmetadata', 'iiurlwidth': '1024'}
    d = get('https://commons.wikimedia.org/w/api.php?' + urllib.parse.urlencode(p))
    for pg in sorted(d.get('query', {}).get('pages', {}).values(), key=lambda x: x.get('index', 0)):
        ii = pg['imageinfo'][0]
        m = ii.get('extmetadata', {})
        lic = m.get('LicenseShortName', {}).get('value', '')
        author = re.sub('<[^>]+>', '', m.get('Artist', {}).get('value', '')).strip()[:40]
        print(tag(lic), pg['title'][5:][:70].ljust(70), f"{ii['width']}x{ii['height']}", lic, '|', author, '|',
              ii.get('thumburl', ''), '|', ii.get('descriptionurl', ''))


def openverse(query, page='1'):
    d = get('https://api.openverse.org/v1/images/?' + urllib.parse.urlencode({'q': query, 'page_size': 20, 'page': page}))
    for r in d.get('results', []):
        lic = f"CC {r['license']} {r.get('license_version') or ''}".strip() if r['license'] not in ('cc0', 'pdm') else r['license']
        print(tag(lic), r.get('width'), r.get('height'), lic, '|', (r.get('creator') or '')[:24], '|', (r.get('title') or '')[:50], '|',
              r['url'], '|', r.get('foreign_landing_url', ''))


if __name__ == '__main__':
    a = sys.argv[1:]
    if len(a) < 2 or a[0] not in ('commons', 'openverse'):
        sys.exit(__doc__)
    (commons if a[0] == 'commons' else openverse)(*a[1:3])
