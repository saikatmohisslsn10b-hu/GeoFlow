import os
import math
import string
import urllib.request
import numpy as np
import rasterio
import geopandas as gpd
import pandas as pd
import time
import random
from rasterio.warp import calculate_default_transform, reproject, Resampling
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import matplotlib.ticker as ticker
from PIL import Image

# Force ALL map text to Times New Roman globally
plt.rcParams['font.family'] = 'Times New Roman'
os.environ["SHAPE_RESTORE_SHX"] = "YES"

def lonlat_to_tile(lon, lat, zoom):
    lat_rad = math.radians(lat)
    n = 2.0 ** zoom
    xtile = int((lon + 180.0) / 360.0 * n)
    ytile = int((1.0 - math.log(math.tan(lat_rad) + (1 / math.cos(lat_rad))) / math.pi) / 2.0 * n)
    return xtile, ytile

def tile_to_lonlat(x, y, zoom):
    n = 2.0 ** zoom
    lon_deg = x / n * 360.0 - 180.0
    lat_rad = math.atan(math.sinh(math.pi * (1 - 2 * y / n)))
    lat_deg = math.degrees(lat_rad)
    return lon_deg, lat_deg

def get_alpha_suffix(n):
    if n < 26:
        return string.ascii_uppercase[n]
    else:
        return string.ascii_uppercase[n // 26 - 1] + string.ascii_uppercase[n % 26]

def generate_subwatershed_map(cn_raster_path, main_shapefile, sub_shapefile, output_png, title):
    with rasterio.open(cn_raster_path) as src:
        target_crs = src.crs

    sub_gdf = gpd.read_file(sub_shapefile).to_crs(target_crs)
    sub_gdf['sub_x'] = sub_gdf.geometry.centroid.x
    sub_gdf = sub_gdf.sort_values(by='sub_x').reset_index(drop=True)

    # 1. DYNAMIC LABELING 
    if main_shapefile:
        main_gdf = gpd.read_file(main_shapefile).to_crs(target_crs)
        main_gdf['centroid_x'] = main_gdf.geometry.centroid.x
        main_gdf = main_gdf.sort_values(by='centroid_x').reset_index(drop=True)
        main_gdf['main_id'] = ["W" + str(i + 1) for i in range(len(main_gdf))]
        
        sub_centroids = sub_gdf.copy()
        sub_centroids.geometry = sub_centroids.geometry.centroid
        joined = gpd.sjoin(sub_centroids, main_gdf[['main_id', 'geometry']], how='left', predicate='intersects')
        joined = joined[~joined.index.duplicated(keep='first')]
        sub_gdf['main_id'] = joined['main_id']

        sub_gdf['final_id'] = "Unk"
        for main_id, group in sub_gdf.groupby('main_id', dropna=False):
            group = group.sort_values(by='sub_x')
            for i, idx in enumerate(group.index):
                if pd.isna(main_id):
                    sub_gdf.at[idx, 'final_id'] = f"U{i+1}"
                else:
                    sub_gdf.at[idx, 'final_id'] = f"{main_id}{get_alpha_suffix(i)}"
    else:
        sub_gdf['final_id'] = ["S" + str(i + 1) for i in range(len(sub_gdf))]

    # 2. PREPARE RASTER
    with rasterio.open(cn_raster_path) as src:
        dst_crs = "EPSG:4326"
        transform, width, height = calculate_default_transform(src.crs, dst_crs, src.width, src.height, *src.bounds)
        cn_matrix = np.zeros((height, width), dtype=np.float32)
        reproject(
            source=rasterio.band(src, 1), destination=cn_matrix,
            src_transform=src.transform, src_crs=src.crs,
            dst_transform=transform, dst_crs=dst_crs, resampling=Resampling.nearest
        )
        lon_min, lat_max = transform[2], transform[5]
        lon_max = transform[2] + transform[0] * width
        lat_min = transform[5] + transform[4] * height

    visual_map = np.zeros_like(cn_matrix, dtype=np.uint8)
    visual_map[(cn_matrix >= 30) & (cn_matrix < 50)] = 1
    visual_map[(cn_matrix >= 50) & (cn_matrix < 70)] = 2
    visual_map[(cn_matrix >= 70) & (cn_matrix < 80)] = 3
    visual_map[(cn_matrix >= 80) & (cn_matrix < 90)] = 4
    visual_map[(cn_matrix >= 90)] = 5

    sub_gdf = sub_gdf.to_crs("EPSG:4326")

    # 3. BASEMAP DOWNLOAD
    zoom = 9
    x0, y0 = lonlat_to_tile(lon_min, lat_max, zoom)
    x1, y1 = lonlat_to_tile(lon_max, lat_min, zoom)
    x1, y1 = max(x0, x1), max(y0, y1)

    tile_width = 256
    stitched_img = Image.new('RGB', ((x1 - x0 + 1) * tile_width, (y1 - y0 + 1) * tile_width))
    
    # Explicit Developer Identity to bypass the OSM ban
    headers = {
        'User-Agent': 'EasyGIS_Academic_App/1.0 (piku.gosh@student.edu) Python-urllib'
    }

    subdomains = ['a', 'b', 'c']

    for x in range(x0, x1 + 1):
        for y in range(y0, y1 + 1):
            subdomain = random.choice(subdomains)
            url = f"https://{subdomain}.tile.openstreetmap.org/{zoom}/{x}/{y}.png"
            try:
                req = urllib.request.Request(url, headers=headers)
                with urllib.request.urlopen(req) as response:
                    tile_img = Image.open(response).convert("RGB")
                    stitched_img.paste(tile_img, ((x - x0) * tile_width, (y - y0) * tile_width))
                time.sleep(0.5) # Crucial 0.5s pause
            except Exception:
                tile_img = Image.new('RGB', (tile_width, tile_width), color='#e0e0e0')
                stitched_img.paste(tile_img, ((x - x0) * tile_width, (y - y0) * tile_width))

    bg_lon_min, bg_lat_max = tile_to_lonlat(x0, y0, zoom)
    bg_lon_max, bg_lat_min = tile_to_lonlat(x1 + 1, y1 + 1, zoom)
    bg_extent = [bg_lon_min, bg_lon_max, bg_lat_min, bg_lat_max]

    # 4. PLOTTING
    colors = ["#00000000", "#2166acdd", "#1a9850dd", "#fee08bdd", "#f46d43dd", "#a50026dd"]
    cmap = plt.cm.colors.ListedColormap(colors)

    fig, ax = plt.subplots(figsize=(12, 10), facecolor='white')

    ax.imshow(np.array(stitched_img), extent=bg_extent, origin="upper", zorder=1)
    extent_raster = [lon_min, lon_max, lat_min, lat_max]
    ax.imshow(visual_map, cmap=cmap, extent=extent_raster, origin="upper", vmin=0, vmax=5, zorder=2)

    sub_gdf.plot(ax=ax, edgecolor="white", linewidth=0.8, facecolor="none", zorder=3)

    for idx, row in sub_gdf.iterrows():
        s_label = row['final_id']
        centroid = row.geometry.representative_point()
        ax.text(centroid.x, centroid.y, s_label, 
                fontsize=8, weight='bold', color='black',
                ha='center', va='center', 
                bbox=dict(facecolor='white', alpha=0.7, edgecolor='none', pad=1), 
                zorder=4, fontname="Times New Roman")

    ax.set_xlim(-99.80, -96.70)
    ax.set_ylim(28.40, 30.60)
    ax.grid(True, which='both', color='gray', linestyle='--', linewidth=0.5, alpha=0.5, zorder=4)
    ax.tick_params(axis='both', which='major', labelsize=9, bottom=True, top=True, left=True, right=True, labelbottom=True, labeltop=True, labelleft=True, labelright=True)
    ax.xaxis.set_major_locator(ticker.MultipleLocator(0.500))
    ax.yaxis.set_major_locator(ticker.MultipleLocator(0.500))
    ax.xaxis.set_major_formatter(ticker.FormatStrFormatter('%.3f'))
    ax.yaxis.set_major_formatter(ticker.FormatStrFormatter('%.3f'))

    scale_50km = 0.45  
    scale_25km = scale_50km / 2
    x_base, y_base, bar_height = -98.000, 28.52, 0.03
    ax.add_patch(mpatches.Rectangle((x_base, y_base), scale_25km, bar_height, edgecolor='black', facecolor='black', zorder=5))
    ax.add_patch(mpatches.Rectangle((x_base + scale_25km, y_base), scale_25km, bar_height, edgecolor='black', facecolor='white', zorder=5))
    label_y = y_base + bar_height * 1.3
    ax.text(x_base, label_y, "0", ha='center', va='bottom', color='black', weight='bold', fontsize=9, zorder=6, fontname="Times New Roman")
    ax.text(x_base + scale_25km, label_y, "25", ha='center', va='bottom', color='black', weight='bold', fontsize=9, zorder=6, fontname="Times New Roman")
    ax.text(x_base + scale_50km, label_y, "50 km", ha='center', va='bottom', color='black', weight='bold', fontsize=9, zorder=6, fontname="Times New Roman")

    x_arrow, y_arrow = -96.95, 30.45
    ax.annotate('', xy=(x_arrow, y_arrow), xytext=(x_arrow, y_arrow - 0.08), arrowprops=dict(arrowstyle="->", lw=2, color='black'), zorder=6)
    ax.text(x_arrow, y_arrow - 0.11, "N", ha='center', va='center', color='black', fontname="Times New Roman", weight='bold', fontsize=14, zorder=6)

    labels = ["CN 30-50", "CN 50-70", "CN 70-80", "CN 80-90", "CN 90-100"]
    patches = [mpatches.Patch(color=colors[i], label=labels[i-1]) for i in range(1, 6)]
    legend = ax.legend(handles=patches, loc="lower left", fontsize=10, framealpha=0.9, facecolor='white', title="Curve Numbers")
    legend.get_title().set_fontweight('bold')
    legend.get_title().set_fontsize(11)
    legend.set_zorder(10)

    final_title = str(title).strip() if title else "Guadalupe River Basin (Subwatershed) Curve Number Map"
    plt.title(final_title, fontname="Times New Roman", fontsize=16, weight='bold', pad=25)

    plt.savefig(output_png, dpi=300, bbox_inches="tight")
    plt.close(fig)
    return True