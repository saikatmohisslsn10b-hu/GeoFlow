from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import FileResponse
from soil.logic import generate_soil_map
from lulc.logic import generate_lulc_map
from CURVE_NO.logic import generate_cn_map
from fastapi.staticfiles import StaticFiles
from Curve_no_sheds_map.watersheds_logic import generate_watershed_map
from Curve_no_sheds_map.subwatershed_logic import generate_subwatershed_map
from contor.whole_basin_contor_logic import generate_whole_basin_contour_map
from contor.watershed_contor_logic import generate_watershed_contour_map
from contor.subwatershed_contor_logic import generate_subwatershed_contour_map
from hydrograph.hydrograph_logic import generate_hydrograph
import dataretrieval.nwis as nwis
import tempfile
import zipfile
import json
import uuid
import os

app = FastAPI()

app.mount("/outputs", StaticFiles(directory="outputs"), name="outputs")

@app.post("/soil")
async def generate_soil_endpoint(
    file: UploadFile = File(...),
    title: str = Form(""), 
    class_names: str = Form("{}")
):
    class_names_dict = {int(k): v for k, v in json.loads(class_names).items()}

    with tempfile.NamedTemporaryFile(delete=False, suffix=".tif") as temp_tif:
        temp_tif.write(await file.read())
        raster_path = temp_tif.name

    output_path = f"outputs/{uuid.uuid4()}.png"
    os.makedirs("outputs", exist_ok=True)

    # Dynamic Fallback Title
    final_title = title.strip() if title.strip() else "Soil Map"

    generate_soil_map(
        raster_path=raster_path,
        output_path=output_path,
        title=final_title,  
        class_names=class_names_dict
    )

    return FileResponse(output_path, media_type="image/png", filename="soil_map.png")


@app.post("/lulc")
async def generate_lulc_endpoint(
    file: UploadFile = File(...),
    title: str = Form(""), 
    categories: str = Form("{}")
):
    category_dict = json.loads(categories)

    with tempfile.NamedTemporaryFile(delete=False, suffix=".tif") as temp_tif:
        temp_tif.write(await file.read())
        raster_path = temp_tif.name

    os.makedirs("outputs", exist_ok=True)
    output_path = f"outputs/{uuid.uuid4()}.png"

    # Dynamic Fallback Title
    final_title = title.strip() if title.strip() else "Land Use Land Cover (LULC) Map"

    generate_lulc_map(
        raster_path=raster_path,
        output_path=output_path,
        title=final_title,  
        categories=category_dict
    )

    return FileResponse(output_path, media_type="image/png", filename="lulc_map.png")


@app.post("/curve-number")
async def generate_curve_number_endpoint(
    lulc_file: UploadFile = File(...),
    soil_file: UploadFile = File(...),
    title: str = Form(""),
    TIF: str = Form("no") 
):
    with tempfile.NamedTemporaryFile(delete=False, suffix=".tif") as temp_lulc, \
         tempfile.NamedTemporaryFile(delete=False, suffix=".tif") as temp_soil:
        
        temp_lulc.write(await lulc_file.read())
        temp_soil.write(await soil_file.read())
        
        lulc_raster_path = temp_lulc.name
        soil_raster_path = temp_soil.name

    os.makedirs("outputs", exist_ok=True)
    
    base_uuid = uuid.uuid4()
    output_png_path = f"outputs/{base_uuid}.png"
    output_tif_path = f"outputs/{base_uuid}.tif"

    # Dynamic Fallback Title
    final_title = title.strip() if title.strip() else "Curve Number Map"

    generate_cn_map(
        lulc_path=lulc_raster_path,
        soil_path=soil_raster_path,
        output_png=output_png_path,
        output_tif=output_tif_path,
        title=final_title
    )

    if TIF.strip().lower() == "yes":
        return FileResponse(output_tif_path, media_type="image/tiff", filename="curve_number_data.tif")
        
    return FileResponse(output_png_path, media_type="image/png", filename="curve_number_map.png")


def find_shapefile_in_dir(directory: str) -> str:
    """Recursively walks through a directory to find the absolute path of the first .shp file."""
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.lower().endswith(".shp"):
                return os.path.join(root, file)
    raise FileNotFoundError("Could not find any valid .shp file inside the uploaded ZIP archive.")


@app.post("/sheds-map")
async def generate_sheds_endpoint(
    cn_file: UploadFile = File(...),
    watershed_zip: UploadFile = File(None),
    subwatershed_zip: UploadFile = File(None),
    title: str = Form(""),
    Sheds: str = Form("")
):
    shed_type = Sheds.strip().lower()

    os.makedirs("outputs", exist_ok=True)
    output_path = f"outputs/{uuid.uuid4()}.png"

    with tempfile.NamedTemporaryFile(delete=False, suffix=".tif") as temp_tif:
        temp_tif.write(await cn_file.read())
        raster_path = temp_tif.name

    with tempfile.TemporaryDirectory() as temp_dir:
        main_shp_path = None
        sub_shp_path = None
        
        if watershed_zip and watershed_zip.filename:
            main_zip_path = os.path.join(temp_dir, "main_watershed.zip")
            with open(main_zip_path, "wb") as f:
                f.write(await watershed_zip.read())
            main_extract_path = os.path.join(temp_dir, "main_extracted")
            with zipfile.ZipFile(main_zip_path, 'r') as zip_ref:
                zip_ref.extractall(main_extract_path)
            try:
                main_shp_path = find_shapefile_in_dir(main_extract_path)
            except FileNotFoundError as e:
                return {"error": str(e)}

        if subwatershed_zip and subwatershed_zip.filename:
            sub_zip_path = os.path.join(temp_dir, "subwatershed.zip")
            with open(sub_zip_path, "wb") as f:
                f.write(await subwatershed_zip.read())
            sub_extract_path = os.path.join(temp_dir, "sub_extracted")
            with zipfile.ZipFile(sub_zip_path, 'r') as zip_ref:
                zip_ref.extractall(sub_extract_path)
            try:
                sub_shp_path = find_shapefile_in_dir(sub_extract_path)
            except FileNotFoundError as e:
                return {"error": str(e)}

        # ==========================================
        # 🚦 SHEDS MAP ROUTER WITH DYNAMIC TITLES
        # ==========================================
        if not main_shp_path and not sub_shp_path:
            final_title = title.strip() if title.strip() else "Curve Number Map"
            generate_watershed_map(raster_path, None, output_path, final_title)
            
        elif shed_type == "watershed":
            final_title = title.strip() if title.strip() else "Watershed Curve Number Map"
            generate_watershed_map(raster_path, main_shp_path, output_path, final_title)
            
        elif shed_type == "subwatershed":
            if not sub_shp_path:
                return {"error": "You requested a 'subwatershed' map but did not provide the subwatershed shapefile."}
            final_title = title.strip() if title.strip() else "Subwatershed Curve Number Map"
            generate_subwatershed_map(raster_path, main_shp_path, sub_shp_path, output_path, final_title)
                
        else:
            if sub_shp_path:
                final_title = title.strip() if title.strip() else "Subwatershed Curve Number Map"
                generate_subwatershed_map(raster_path, main_shp_path, sub_shp_path, output_path, final_title)
            else:
                final_title = title.strip() if title.strip() else "Watershed Curve Number Map"
                generate_watershed_map(raster_path, main_shp_path, output_path, final_title)

    return FileResponse(output_path, media_type="image/png", filename="custom_sheds_map.png")


@app.post("/contour-map")
async def generate_contour_endpoint(
    cn_file: UploadFile = File(...),
    watershed_zip: UploadFile = File(None),
    subwatershed_zip: UploadFile = File(None),
    title: str = Form(""),
    Sheds: str = Form("")
):
    shed_type = Sheds.strip().lower()

    os.makedirs("outputs", exist_ok=True)
    output_path = f"outputs/{uuid.uuid4()}.png"

    with tempfile.NamedTemporaryFile(delete=False, suffix=".tif") as temp_tif:
        temp_tif.write(await cn_file.read())
        raster_path = temp_tif.name

    with tempfile.TemporaryDirectory() as temp_dir:
        main_shp_path = None
        sub_shp_path = None
        
        if watershed_zip and watershed_zip.filename:
            main_zip_path = os.path.join(temp_dir, "main_watershed.zip")
            with open(main_zip_path, "wb") as f:
                f.write(await watershed_zip.read())
            main_extract_path = os.path.join(temp_dir, "main_extracted")
            with zipfile.ZipFile(main_zip_path, 'r') as zip_ref:
                zip_ref.extractall(main_extract_path)
            try:
                main_shp_path = find_shapefile_in_dir(main_extract_path)
            except FileNotFoundError as e:
                return {"error": str(e)}

        if subwatershed_zip and subwatershed_zip.filename:
            sub_zip_path = os.path.join(temp_dir, "subwatershed.zip")
            with open(sub_zip_path, "wb") as f:
                f.write(await subwatershed_zip.read())
            sub_extract_path = os.path.join(temp_dir, "sub_extracted")
            with zipfile.ZipFile(sub_zip_path, 'r') as zip_ref:
                zip_ref.extractall(sub_extract_path)
            try:
                sub_shp_path = find_shapefile_in_dir(sub_extract_path)
            except FileNotFoundError as e:
                return {"error": str(e)}

        # ==========================================
        # 🚦 CONTOUR MAP ROUTER WITH DYNAMIC TITLES
        # ==========================================
        if not main_shp_path and not sub_shp_path:
            final_title = title.strip() if title.strip() else "Contour Map"
            generate_whole_basin_contour_map(raster_path, output_path, final_title)
            
        elif shed_type == "watershed":
            if not main_shp_path:
                return {"error": "You requested a 'watershed' contour but didn't provide the main watershed shapefile."}
            final_title = title.strip() if title.strip() else "Watershed Contour Map"
            generate_watershed_contour_map(raster_path, main_shp_path, output_path, final_title)
            
        elif shed_type == "subwatershed":
            if not sub_shp_path:
                return {"error": "You requested a 'subwatershed' contour but didn't provide the subwatershed shapefile."}
            final_title = title.strip() if title.strip() else "Subwatershed Contour Map"
            generate_subwatershed_contour_map(raster_path, main_shp_path, sub_shp_path, output_path, final_title)
                
        else:
            if sub_shp_path:
                final_title = title.strip() if title.strip() else "Subwatershed Contour Map"
                generate_subwatershed_contour_map(raster_path, main_shp_path, sub_shp_path, output_path, final_title)
            else:
                final_title = title.strip() if title.strip() else "Watershed Contour Map"
                generate_watershed_contour_map(raster_path, main_shp_path, output_path, final_title)

    return FileResponse(output_path, media_type="image/png", filename="contour_map.png")

@app.post("/hydrograph")
async def generate_hydrograph_endpoint(
    station_id: str = Form(""),
    station_name: str = Form(""),
    state_code: str = Form("TX"),  
    title: str = Form("")
):
    os.makedirs("outputs", exist_ok=True)
    
    sid = station_id.strip()
    sname = station_name.strip()
    state = state_code.strip().upper()
    
    final_id = sid
    
    # 1. 🌍 USGS NAME SEARCH (WITH STATE FILTER) 🌍
    if not final_id and sname:
        try:
            sites_df = nwis.what_sites(stateCd=state, siteNameMatch=sname)
            
            if not sites_df.empty and 'site_no' in sites_df.columns:
                final_id = str(sites_df['site_no'].iloc[0]) 
            else:
                return {"error": f"Could not find USGS station matching '{sname}' in state '{state}'. Check spelling or use station_id."}
        except Exception as e:
            if "Bad Request" in str(e):
                return {
                    "error": f"USGS rejected the search for '{sname}'. The database requires exact spelling. Try using a single short keyword (like 'Sattler'), or use the exact 'station_id'."
                }
            return {"error": f"USGS search failed: {str(e)}"}
            
    if not final_id:
        return {"error": "Please provide either a 'station_id' or a 'station_name'."}

    # 2. 📛 GET OFFICIAL BEAUTIFUL NAME FOR TITLE 📛
    # Smarter fallback: Default to the Station ID if the name lookup fails
    official_name = f"Station {final_id}" 
    try:
        # Use the reliable what_sites function to grab the metadata for this ID
        site_info = nwis.what_sites(sites=final_id)
        if not site_info.empty and 'station_nm' in site_info.columns:
            # Convert "GUADALUPE RIVER AT HOCHHEIM TX" to "Guadalupe River At Hochheim Tx"
            official_name = str(site_info['station_nm'].iloc[0]).title() 
    except Exception as e:
        print(f"Warning: Could not fetch official name for {final_id}: {e}")

    # 3. ✨ DYNAMIC TITLE LOGIC ✨
    final_title = title.strip()
    if not final_title:
        final_title = f"{official_name} Hydrograph Map"

    output_png = f"outputs/{final_id}_hydrograph_{uuid.uuid4()}.png"
    
    # 4. GENERATE THE GRAPH
    try:
        generate_hydrograph(final_id, output_png, final_title)
        return FileResponse(output_png, media_type="image/png", filename=f"{final_id}_hydrograph.png")
    except Exception as e:
        return {"error": f"Failed to generate hydrograph for station {final_id}: {str(e)}"}