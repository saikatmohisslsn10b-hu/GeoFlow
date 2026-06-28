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

from soil.location import lonlat_to_tile
from soil.location import tile_to_lonlat


def generate_soil_map(
    raster_path: str,
    output_path: str,
    title: str | None = None,
    class_names: dict | None = None,
    zoom: int = 9,
):
    class_names = class_names or {}

    with rasterio.open(raster_path) as src:
        soil_matrix = src.read(1)
        nodata = src.nodata
        bounds = src.bounds

        # --------------------------------------------------
        # 1. Identify valid classes (Ignore 0 and nodata)
        # --------------------------------------------------
        unique_classes = np.unique(soil_matrix).tolist()
        valid_classes = [c for c in unique_classes if c != 0 and c != nodata]

        if not valid_classes:
            raise ValueError("No valid classes found in raster.")

        # --------------------------------------------------
        # 2. Calculate dynamic percentages for legend
        # --------------------------------------------------
        class_stats = {}
        total_valid_pixels = sum(int(np.sum(soil_matrix == cls)) for cls in valid_classes)

        for cls in valid_classes:
            count = int(np.sum(soil_matrix == cls))
            percentage = (count / total_valid_pixels * 100) if total_valid_pixels > 0 else 0
            class_stats[int(cls)] = {
                "pixels": count,
                "percentage": round(percentage, 2),
            }

        # --------------------------------------------------
        # 3. Reclassification (0 = Transparent Background)
        # --------------------------------------------------
        visual_map = np.zeros_like(soil_matrix, dtype=np.uint8)
        
        for idx, cls in enumerate(valid_classes, start=1):
            visual_map[soil_matrix == cls] = idx

        # --------------------------------------------------
        # 4. Transform Bounds
        # --------------------------------------------------
        lon_min, lat_min, lon_max, lat_max = transform_bounds(
            src.crs, "EPSG:4326", bounds.left, bounds.bottom, bounds.right, bounds.top
        )

    # ------------------------------------------------------
    # 5. Download & Stitch OSM Background Tiles
    # ------------------------------------------------------
    x0, y0 = lonlat_to_tile(lon_min, lat_max, zoom)
    x1, y1 = lonlat_to_tile(lon_max, lat_min, zoom)

    x1 = max(x0, x1)
    y1 = max(y0, y1)

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
    # 6. Define Custom Color Scheme
    # ------------------------------------------------------
    base_colors = [
        "#8B5A2Bdd",  # 1: Clay Soil (Dark Brown)
        "#E3A857dd",  # 2: Sandy Soil (Gold/Yellow)
        "#4A708Bdd",  # 3: Mud / Silt Soil (Steel Blue/Grey)
        "#556B2Fdd",  # 4: Olive Green (Fallback)
        "#CD853Fdd",  # 5: Light Brown (Fallback)
    ]
    
    colors = ["#00000000"]  # 0: Transparent background
    for i in range(len(valid_classes)):
        colors.append(base_colors[i % len(base_colors)])

    cmap = mcolors.ListedColormap(colors)

    # ------------------------------------------------------
    # 7. Initialize Plot & Assemble Layers
    # ------------------------------------------------------
    fig, ax = plt.subplots(figsize=(12, 10), facecolor="white")

    ax.imshow(np.array(stitched_img), extent=bg_extent, origin="upper", zorder=1)
    raster_extent = [lon_min, lon_max, lat_min, lat_max]

    ax.imshow(
        visual_map, cmap=cmap, extent=raster_extent,
        origin="upper", vmin=0, vmax=len(valid_classes), zorder=2,
    )

    width = lon_max - lon_min
    height = lat_max - lat_min
    pad_x = width * 0.05
    pad_y = height * 0.05

    ax.set_xlim(lon_min - pad_x, lon_max + pad_x)
    ax.set_ylim(lat_min - pad_y, lat_max + pad_y)

    # ------------------------------------------------------
    # 8. Coordinate Grid & Tick Label Configuration
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
    # 9. GIS Subdivided Scale Bar Layout
    # ------------------------------------------------------
    scale_50km = 0.45  
    scale_25km = scale_50km / 2
    
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
    # 10. Clean, Minimalist GIS North Arrow
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
    # 11. Dynamic Map Legend Setup
    # ------------------------------------------------------
    patches = []
    for idx, cls in enumerate(valid_classes, start=1):
        class_label = class_names.get(int(cls), f"Class {int(cls)}")
        percentage = class_stats[int(cls)]["percentage"]
        label = f"{class_label} ({percentage:.2f}%)"
        
        patches.append(mpatches.Patch(color=colors[idx], label=label))

    legend = ax.legend(
        handles=patches, title="Soil Class", title_fontsize=11, 
        loc="lower left", fontsize=10, framealpha=0.9, facecolor='white'
    )
    legend.set_zorder(10)

    # ------------------------------------------------------
    # 12. Map Title (Times New Roman) - Exact Match to User Input
    # ------------------------------------------------------
    # This directly forces Matplotlib to render exactly what you typed in Bruno.
    final_title = str(title).strip() if title else "Default Soil Map"

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
        "title": final_title,
        "bounds": {
            "lon_min": lon_min, "lon_max": lon_max,
            "lat_min": lat_min, "lat_max": lat_max,
        },
        "classes": class_stats,
        "total_classes": len(valid_classes),
    }