# GeoFlow: Geospatial Analysis & Hydrological Modeling System

## Abstract
GeoFlow is a web-based GIS tool designed to simplify geospatial and hydrological modeling. It is built specifically for beginners who are new to GIS and want to avoid the complexity of professional tools like QGIS. With GeoFlow, users can easily generate hydrological maps of a river basin by simply uploading a GeoTIFF (.tif) file to the platform. To make the learning process even smoother, GeoFlow is accompanied by a hands-on YouTube playlist that guides users step-by-step, helping them understand both the workflow.

**YouTube Tutorial**: https://www.youtube.com/watch?v=XVzQnnKbI08&list=PLZWgj2-5KcSU

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
GeoFlow is build to make geospatial and hydrological analysis accessible without requiring users to learn complex GIS software. Instead of working directly with Python GIS libraries and desktop applications, users can perform common workflows through a simple web interface.

we chose a web-based architecture instead of a traditional desktop application so the platform can be deployed on a central server and accessed from anywhere. This means users don't need a powerful computer or a complicated local GIS setup—everything runs on the server, and they only need a web browser to use the application.

The project is designed to be easy to extend, and we plan to keep adding new geospatial models and analysis tools over time. If you find GeoFlow useful, feel free to fork the repository, add new features, fix bugs, or contribute in any way. Contributions, suggestions, and pull requests are always welcome.
