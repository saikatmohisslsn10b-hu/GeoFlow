import urllib.request
from pathlib import Path
import math

import matplotlib.cm as cm
import matplotlib.colors as mcolors
import matplotlib.patches as mpatches
import matplotlib.pyplot as plt
import matplotlib.ticker as ticker
import numpy as np
import rasterio
from PIL import Image
from rasterio.warp import transform_bounds

# Importing from your existing soil location module to reuse the tile logic
from soil.location import lonlat_to_tile, tile_to_lonlat

# Force ALL map text to Times New Roman globally
plt.rcParams['font.family'] = 'Times New Roman'

def generate_cn_map(
    lulc_path: str,
    soil_path: str,
    output_png: str,
    output_tif: str,
    title: str | None = None,
    zoom: int = 9,
):
    # --------------------------------------------------
    # 1. READ DATA & CALCULATE CN
    # --------------------------------------------------
    with rasterio.open(lulc_path) as src:
        lulc = src.read(1)
        profile = src.profile
        crs = src.crs

    with rasterio.open(soil_path) as src:
        soil = src.read(1)

    # Lookup Table
    CN_TABLE = {
        (41, 201234): 30, (42, 201234): 30, (43, 201234): 35,
        (41, 301234): 55, (42, 301234): 55, (43, 301234): 60,
        (41, 101234): 70, (42, 101234): 70, (43, 101234): 75,
        (52, 201234): 49, (71, 201234): 49, (52, 301234): 69,
        (71, 301234): 69, (52, 101234): 79, (71, 101234): 79,
        (81, 201234): 67, (82, 201234): 72, (81, 301234): 78,
        (82, 301234): 81, (81, 101234): 85, (82, 101234): 88,
        (21, 201234): 77, (22, 201234): 85, (23, 201234): 90, (24, 201234): 95,
        (21, 301234): 85, (22, 301234): 90, (23, 301234): 94, (24, 301234): 98,
        (21, 101234): 89, (22, 101234): 92, (23, 101234): 96, (24, 101234): 98,
        (31, 201234): 68, (31, 301234): 80, (31, 101234): 88,
        (11, 201234): 100, (11, 301234): 100, (11, 101234): 100,
        (90, 201234): 90, (90, 301234): 93, (90, 101234): 95,
        (95, 201234): 90, (95, 301234): 93, (95, 101234): 95,
    }

    cn = np.zeros_like(lulc, dtype=np.float32)

    for (lulc_code, soil_code), cn_value in CN_TABLE.items():
        mask = ((lulc == lulc_code) & (soil == soil_code))
        cn[mask] = cn_value

    invalid = ((soil == 0) | (lulc == 250))
    cn[invalid] = 0

    # Save the computed TIF directly to the outputs folder
    profile.update(dtype=rasterio.float32, count=1, nodata=0)
    with rasterio.open(output_tif, "w", **profile) as dst:
        dst.write(cn.astype(np.float32), 1)

    # --------------------------------------------------
    # 2. EXTRACT STATS & RECLASSIFY
    # --------------------------------------------------
    valid_pixels = np.sum(cn > 0)
    p1 = np.sum((cn >= 30) & (cn < 50)) / valid_pixels * 100 if valid_pixels > 0 else 0
    p2 = np.sum((cn >= 50) & (cn < 70)) / valid_pixels * 100 if valid_pixels > 0 else 0
    p3 = np.sum((cn >= 70) & (cn < 80)) / valid_pixels * 100 if valid_pixels > 0 else 0
    p4 = np.sum((cn >= 80) & (cn < 90)) / valid_pixels * 100 if valid_pixels > 0 else 0
    p5 = np.sum((cn >= 90)) / valid_pixels * 100 if valid_pixels > 0 else 0

    visual_map = np.zeros_like(cn, dtype=np.uint8)
    visual_map[(cn >= 30) & (cn < 50)] = 1
    visual_map[(cn >= 50) & (cn < 70)] = 2
    visual_map[(cn >= 70) & (cn < 80)] = 3
    visual_map[(cn >= 80) & (cn < 90)] = 4
    visual_map[(cn >= 90)] = 5

    # --------------------------------------------------
    # 3. Transform Bounds
    # --------------------------------------------------
    # Rasterio creates a BoundingBox obj dynamically
    bounds = profile['transform'] * (0, 0) + profile['transform'] * (profile['width'], profile['height'])
    bounds_obj = rasterio.coords.BoundingBox(bounds[0], bounds[3], bounds[2], bounds[1])
    lon_min, lat_min, lon_max, lat_max = transform_bounds(
        crs, "EPSG:4326", bounds_obj.left, bounds_obj.bottom, bounds_obj.right, bounds_obj.top
    )

    # ------------------------------------------------------
    # 4. Download & Stitch OSM Background Tiles
    # ------------------------------------------------------
    x0, y0 = lonlat_to_tile(lon_min, lat_max, zoom)
    x1, y1 = lonlat_to_tile(lon_max, lat_min, zoom)
    x1, y1 = max(x0, x1), max(y0, y1)

    tile_width = 256
    stitched_img = Image.new("RGB", ((x1 - x0 + 1) * tile_width, (y1 - y0 + 1) * tile_width))
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

    for x in range(x0, x1 + 1):
        for y in range(y0, y1 + 1):
            url = f"https://tile.openstreetmap.org/{zoom}/{x}/{y}.png"
            try:
                req = urllib.request.Request(url, headers=headers)
                with urllib.request.urlopen(req) as response:
                    tile_img = Image.open(response).convert("RGB")
                    stitched_img.paste(tile_img, ((x - x0) * tile_width, (y - y0) * tile_width))
            except Exception:
                tile_img = Image.new("RGB", (tile_width, tile_width), color="#e0e0e0")
                stitched_img.paste(tile_img, ((x - x0) * tile_width, (y - y0) * tile_width))

    bg_lon_min, bg_lat_max = tile_to_lonlat(x0, y0, zoom)
    bg_lon_max, bg_lat_min = tile_to_lonlat(x1 + 1, y1 + 1, zoom)
    bg_extent = [bg_lon_min, bg_lon_max, bg_lat_min, bg_lat_max]

    # ------------------------------------------------------
    # 5. Define Custom Color Scheme
    # ------------------------------------------------------
    colors = [
        "#00000000",  # 0: Transparent background
        "#2166acdd",  # 1: Low (Blue)
        "#1a9850dd",  # 2: Mod (Green)
        "#fee08bdd",  # 3: Elev (Yellow)
        "#f46d43dd",  # 4: High (Orange)
        "#a50026dd"   # 5: Very High (Red)
    ]
    cmap = mcolors.ListedColormap(colors)

    # ------------------------------------------------------
    # 6. Initialize Plot & Assemble Layers
    # ------------------------------------------------------
    fig, ax = plt.subplots(figsize=(12, 10), facecolor="white")

    ax.imshow(np.array(stitched_img), extent=bg_extent, origin="upper", zorder=1)
    raster_extent = [lon_min, lon_max, lat_min, lat_max]

    ax.imshow(
        visual_map, cmap=cmap, extent=raster_extent,
        origin="upper", vmin=0, vmax=5, zorder=2,
    )

    width = lon_max - lon_min
    height = lat_max - lat_min
    pad_x = width * 0.05
    pad_y = height * 0.05

    ax.set_xlim(lon_min - pad_x, lon_max + pad_x)
    ax.set_ylim(lat_min - pad_y, lat_max + pad_y)

    # ------------------------------------------------------
    # 7. Coordinate Grid & Tick Label Configuration
    # ------------------------------------------------------
    ax.grid(True, which='both', color='gray', linestyle='--', linewidth=0.5, alpha=0.5, zorder=3)
    
    ax.tick_params(
        axis='both', which='major', labelsize=9,
        bottom=True, top=True, left=True, right=True,
        labelbottom=True, labeltop=True, labelleft=True, labelright=True
    )
    
    ax.xaxis.set_major_locator(ticker.MultipleLocator(0.500))
    ax.yaxis.set_major_locator(ticker.MultipleLocator(0.500))
    ax.xaxis.set_major_formatter(ticker.FormatStrFormatter('%.3f'))
    ax.yaxis.set_major_formatter(ticker.FormatStrFormatter('%.3f'))

    # ------------------------------------------------------
    # 8. GIS Subdivided Scale Bar Layout
    # ------------------------------------------------------
    scale_50km = 0.45  
    scale_25km = scale_50km / 2
    
    # Position dynamically relative to bounds
    x_base = lon_min + (width * 0.3)
    y_base = lat_min + (height * 0.05)
    bar_height = height * 0.015

    rect1 = mpatches.Rectangle((x_base, y_base), scale_25km, bar_height, edgecolor='black', facecolor='black', zorder=5)
    rect2 = mpatches.Rectangle((x_base + scale_25km, y_base), scale_25km, bar_height, edgecolor='black', facecolor='white', zorder=5)
    ax.add_patch(rect1)
    ax.add_patch(rect2)

    label_y = y_base + bar_height * 1.3
    ax.text(x_base, label_y, "0", ha='center', va='bottom', color='black', weight='bold', fontsize=9, zorder=6)
    ax.text(x_base + scale_25km, label_y, "25", ha='center', va='bottom', color='black', weight='bold', fontsize=9, zorder=6)
    ax.text(x_base + scale_50km, label_y, "50 km", ha='center', va='bottom', color='black', weight='bold', fontsize=9, zorder=6)

    # ------------------------------------------------------
    # 9. Clean, Minimalist GIS North Arrow
    # ------------------------------------------------------
    arrow_x = lon_max - width * 0.05
    arrow_y = lat_max - height * 0.05

    ax.annotate(
        '', xy=(arrow_x, arrow_y), xytext=(arrow_x, arrow_y - height * 0.035),
        arrowprops=dict(arrowstyle="->", lw=2, color='black'), zorder=6
    )
    ax.text(
        arrow_x, arrow_y - height * 0.05, "N", ha='center', va='center',
        color='black', fontname="Times New Roman", weight='bold', fontsize=14, zorder=6
    )

    # ------------------------------------------------------
    # 10. Map Legend Setup (With Dynamic Percentages)
    # ------------------------------------------------------
    labels = [
        f"CN 30-50 ({p1:.2f}%)",
        f"CN 50-70 ({p2:.2f}%)",
        f"CN 70-80 ({p3:.2f}%)",
        f"CN 80-90 ({p4:.2f}%)",
        f"CN 90-100 ({p5:.2f}%)"
    ]
    
    patches = [mpatches.Patch(color=colors[i], label=labels[i-1]) for i in range(1, 6)]
    
    legend = ax.legend(
        handles=patches, title="Curve Number (CN)", title_fontsize=11,
        loc="lower left", fontsize=10, framealpha=0.9, facecolor='white'
    )
    legend.set_zorder(10)

    # ------------------------------------------------------
    # 11. Map Title (Times New Roman) - Driven by User Input
    # ------------------------------------------------------
    final_title = str(title).strip() if title else "Guadalupe River Basin Curve Number Map"

    plt.title(
        final_title, 
        fontname="Times New Roman", 
        fontsize=16, 
        weight='bold', 
        pad=25
    )

    # Save PNG Layout
    plt.savefig(output_png, dpi=300, bbox_inches="tight")
    plt.close(fig)

    return {
        "success": True,
        "png_path": output_png,
        "tif_path": output_tif,
        "title": final_title
    }