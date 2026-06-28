# GeoFlow: Geospatial Analysis & Hydrological Modeling System

## Abstract
GeoFlow is a comprehensive web-based tool designed to perform rapid geospatial and hydrological modeling. It seamlessly integrates a modern React frontend with a high-performance Python (FastAPI) backend. The platform allows researchers, students, and engineers to upload raster data (GeoTIFFs) and shapefiles to dynamically generate Soil Classification Maps, Land Use Land Cover (LULC) Maps, SCS Curve Number Maps, Contour Maps, and real-time Streamflow Hydrographs using USGS data. 

---

## Architecture Overview
The project is divided into two main components:
1. **Frontend (`GeoFlow/`)**: A React application built with Vite and Tailwind CSS. It provides an intuitive, interactive user interface for uploading files and visualizing generated maps.
2. **Backend (`server/`)**: A Python FastAPI application that performs the heavy lifting. It processes raster images, shapefiles, and external USGS data APIs using scientific libraries such as `rasterio`, `geopandas`, and `matplotlib`.

---

## API Documentation

The FastAPI backend exposes several endpoints to handle geospatial processing. All endpoints expect `multipart/form-data` for file uploads and parameter passing.

### 1. Generate Soil Map (`POST /soil`)
- **What it does:** Generates a styled Soil Classification Map from an uploaded GeoTIFF raster file.
- **How it works:** It maps raster pixel values to user-defined soil classes (e.g., Sandy Soil, Clay Soil) using the provided `class_names` JSON mapping.
- **Outputs:** A styled PNG image of the soil map.

### 2. Generate LULC Map (`POST /lulc`)
- **What it does:** Generates a Land Use Land Cover (LULC) Map.
- **How it works:** Takes an LULC GeoTIFF raster and a `categories` JSON mapping, assigning distinct colors to different land cover types (e.g., Water, Forest, Urban).
- **Outputs:** A styled PNG image of the LULC map.

### 3. Generate Curve Number Map (`POST /curve-number`)
- **What it does:** Calculates and visualizes the SCS Curve Number (CN) representing runoff potential.
- **How it works:** It requires both an LULC raster and a Soil raster. It intersects these two layers to compute curve numbers across the study area.
- **Outputs:** A PNG map visualizing the CN distribution, with an optional GeoTIFF output if requested.

### 4. Generate Curve Number Sheds Map (`POST /sheds-map`)
- **What it does:** Crops and visualizes the Curve Number map to specific watershed boundaries.
- **How it works:** Accepts a pre-generated Curve Number raster and optional ZIP files containing Watershed and Subwatershed shapefiles (`.shp`). It masks the raster to fit the chosen boundary layer.
- **Outputs:** A PNG map isolated to the specified basin/watershed.

### 5. Generate Contour Map (`POST /contour-map`)
- **What it does:** Generates topographic contour lines over a specified region.
- **How it works:** Takes a Digital Elevation Model (DEM) raster and optional watershed shapefiles. It extracts elevation data and draws contour lines.
- **Outputs:** A PNG contour map.

### 6. Generate Hydrograph (`POST /hydrograph`)
- **What it does:** Fetches real-world streamflow data and plots a hydrograph.
- **How it works:** Uses the `dataretrieval` library to query the USGS National Water Information System (NWIS) using a Station ID or Station Name.
- **Outputs:** A PNG graph plotting stream discharge over time.

---

## Step-by-Step Local Setup Instructions

Follow these instructions to run the full application locally on your machine.

### Prerequisites
- **Python 3.8+** installed.
- **Node.js 18+** and **npm** installed.

### 1. Setup the Backend (FastAPI)
1. Open a terminal and navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Activate the virtual environment:
   - On Windows:
     ```bash
     .\venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```bash
     source venv/bin/activate
     ```
3. Ensure all Python dependencies are installed:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the FastAPI backend server:
   ```bash
   uvicorn main:app --reload --port 8000
   ```
   *The backend will now be running on `http://localhost:8000`.*

### 2. Setup the Frontend (React + Vite)
1. Open a **new, separate** terminal window and navigate to the `GeoFlow` directory:
   ```bash
   cd GeoFlow
   ```
2. Install the Node.js dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend will now be running on `http://localhost:3000` (or `http://localhost:5173` depending on your environment).*

### 3. Usage
- Open your browser and navigate to `http://localhost:3000`.
- The frontend proxy is configured to automatically route any `/api` requests seamlessly to your backend on port `8000`.

---

## Conclusion
GeoFlow effectively bridges the gap between complex GIS Python libraries and user-friendly web interfaces. By leveraging FastAPI for rapid, asynchronous processing and React for a reactive user interface, the system provides a robust environment for generating vital hydrological maps and data visualizations on the fly. Whether computing runoff curve numbers or visualizing USGS streamflows, GeoFlow offers a highly capable and extensible foundation for geospatial analysis.
