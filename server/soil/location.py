import math

def lonlat_to_tile(lon, lat, zoom):
    lat_rad = math.radians(lat)
    n = 2.0 ** zoom

    xtile = int((lon + 180.0) / 360.0 * n)

    ytile = int(
        (
            1.0
            - math.log(
                math.tan(lat_rad)
                + (1 / math.cos(lat_rad))
            )
            / math.pi
        )
        / 2.0
        * n
    )

    return xtile, ytile


def tile_to_lonlat(x, y, zoom):
    n = 2.0 ** zoom

    lon_deg = x / n * 360.0 - 180.0

    lat_rad = math.atan(
        math.sinh(math.pi * (1 - 2 * y / n))
    )

    lat_deg = math.degrees(lat_rad)

    return lon_deg, lat_deg