import urllib.request
from pathlib import Path

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

def generate_lulc_map(
    raster_path: str,
    output_path: str,
    title: str | None = None,
    categories: dict | None = None,
    zoom: int = 9,
):
    with rasterio.open(raster_path) as src:
        lulc_matrix = src.read(1)
        bounds = src.bounds
        nodata = src.nodata

        # --------------------------------------------------
        # 1. Reclassify Matrix Data based on standard LULC codes
        # --------------------------------------------------
        visual_map = np.zeros_like(lulc_matrix, dtype=np.uint8)
        
        # Mapping specific codes to classes 1-9
        visual_map[np.isin(lulc_matrix, [11])] = 1             # 1: Water
        visual_map[np.isin(lulc_matrix, [21, 22, 23, 24])] = 2 # 2: Developed Areas
        visual_map[np.isin(lulc_matrix, [31])] = 3             # 3: Bare Land
        visual_map[np.isin(lulc_matrix, [41, 42, 43])] = 4     # 4: Forest
        visual_map[np.isin(lulc_matrix, [52])] = 5             # 5: Shrubland
        visual_map[np.isin(lulc_matrix, [71])] = 6             # 6: Grassland
        visual_map[np.isin(lulc_matrix, [81])] = 7             # 7: Pasture/Hay
        visual_map[np.isin(lulc_matrix, [82])] = 8             # 8: Cultivated Crops
        visual_map[np.isin(lulc_matrix, [90, 95])] = 9         # 9: Wetlands

        # --------------------------------------------------
        # 2. Transform Bounds
        # --------------------------------------------------
        lon_min, lat_min, lon_max, lat_max = transform_bounds(
            src.crs, "EPSG:4326", bounds.left, bounds.bottom, bounds.right, bounds.top
        )

    # ------------------------------------------------------
    # 3. Download & Stitch OSM Background Tiles
    # ------------------------------------------------------
    x0, y0 = lonlat_to_tile(lon_min, lat_max, zoom)
    x1, y1 = lonlat_to_tile(lon_max, lat_min, zoom)

    x1, y1 = max(x0, x1), max(y0, y1)

    tile_size = 256
    stitched_img = Image.new("RGB", ((x1 - x0 + 1) * tile_size, (y1 - y0 + 1) * tile_size))
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

    for x in range(x0, x1 + 1):
        for y in range(y0, y1 + 1):
            url = f"https://tile.openstreetmap.org/{zoom}/{x}/{y}.png"
            try:
                req = urllib.request.Request(url, headers=headers)
                with urllib.request.urlopen(req) as response:
                    tile_img = Image.open(response).convert("RGB")
                    stitched_img.paste(tile_img, ((x - x0) * tile_size, (y - y0) * tile_size))
            except Exception:
                tile_img = Image.new("RGB", (tile_size, tile_size), color="#e0e0e0")
                stitched_img.paste(tile_img, ((x - x0) * tile_size, (y - y0) * tile_size))

    bg_lon_min, bg_lat_max = tile_to_lonlat(x0, y0, zoom)
    bg_lon_max, bg_lat_min = tile_to_lonlat(x1 + 1, y1 + 1, zoom)
    bg_extent = [bg_lon_min, bg_lon_max, bg_lat_min, bg_lat_max]

    # ------------------------------------------------------
    # 4. Define Custom Color Scheme (Exactly as requested)
    # ------------------------------------------------------
    colors = [
        "#00000000",  # 0: Transparent background
        "#1f77b4dd",  # 1: Water (Blue)
        "#d62728dd",  # 2: Developed Areas (Red)
        "#c7c7c7dd",  # 3: Bare Land (Grey)
        "#2ca02cdd",  # 4: Forest (Dark Green)
        "#bcbd22dd",  # 5: Shrubland (Olive)
        "#98df8add",  # 6: Grassland (Light Green)
        "#ffbb78dd",  # 7: Pasture/Hay (Light Orange/Gold)
        "#ff7f0edd",  # 8: Cultivated Crops (Orange)
        "#17becfdd",  # 9: Wetlands (Cyan/Light Blue)
    ]
    cmap = mcolors.ListedColormap(colors)

    # ------------------------------------------------------
    # 5. Initialize Plot & Assemble Layers
    # ------------------------------------------------------
    fig, ax = plt.subplots(figsize=(12, 10), facecolor="white")

    ax.imshow(np.array(stitched_img), extent=bg_extent, origin="upper", zorder=1)
    raster_extent = [lon_min, lon_max, lat_min, lat_max]

    ax.imshow(
        visual_map, cmap=cmap, extent=raster_extent,
        origin="upper", vmin=0, vmax=9, zorder=2,
    )

    width = lon_max - lon_min
    height = lat_max - lat_min
    pad_x = width * 0.05
    pad_y = height * 0.05

    ax.set_xlim(lon_min - pad_x, lon_max + pad_x)
    ax.set_ylim(lat_min - pad_y, lat_max + pad_y)

    # ------------------------------------------------------
    # 6. Coordinate Grid & Tick Label Configuration
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
    # 7. GIS Subdivided Scale Bar Layout
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
    # 8. Clean, Minimalist GIS North Arrow
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
    # 9. Map Legend Setup
    # ------------------------------------------------------
    labels = [
        "Water", "Developed Areas", "Bare Land", "Forest",
        "Shrubland", "Grassland", "Pasture/Hay", "Cultivated Crops", "Wetlands"
    ]
    
    patches = [mpatches.Patch(color=colors[i], label=labels[i-1]) for i in range(1, 10)]
    
    legend = ax.legend(
        handles=patches, title="Land Cover Categories", title_fontsize=12,
        loc="lower left", fontsize=10, framealpha=0.9, facecolor='white'
    )
    legend.set_zorder(10)

    # ------------------------------------------------------
    # 10. Map Title (Times New Roman) - Driven by User Input
    # ------------------------------------------------------
    final_title = str(title).strip() if title else "Guadalupe River Basin LULC Map"

    plt.title(
        final_title, 
        fontname="Times New Roman", 
        fontsize=16, 
        weight='bold', 
        pad=25
    )

    # Save Layout directly as a PNG image
    plt.savefig(output_path, dpi=300, bbox_inches="tight")
    plt.close(fig)

    return {
        "success": True,
        "image_path": output_path,
        "title": final_title
    }