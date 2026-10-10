"""Shared bits for the Python evidence tools.

Every public service these tools call (the OSM API, Nominatim, Wikimedia,
Openverse, USGS) asks for a User-Agent that identifies the client. Set
LANDMARKS_USER_AGENT to one with your own contact, e.g.
"landmarks-tools/0.1 (you@example.com)"; the default points at this repo.
"""
import math, os

USER_AGENT = os.environ.get('LANDMARKS_USER_AGENT', 'landmarks-tools/0.1 (+https://github.com/alexwohlbruck/landmarks)')
R = 6378137.0


def mercator(lon, lat):
    """EPSG:3857 metres for a point, plus k = 1/cos(lat), the 3857 scale factor there.

    A true distance d on the ground is d * k in 3857, so a box of half-side h
    metres around the point is (x - h*k, y - h*k, x + h*k, y + h*k).
    """
    x = math.radians(lon) * R
    y = math.log(math.tan(math.pi / 4 + math.radians(lat) / 2)) * R
    return x, y, 1 / math.cos(math.radians(lat))
