import { useState, useCallback, useEffect } from 'react';
import { Mountain } from 'lucide-react';
import ToolPageLayout from '../components/ToolPageLayout';
import FileUpload from '../components/FileUpload';
import SegmentedControl from '../components/SegmentedControl';
import HelpSection from '../components/HelpSection';
import { generateContourMap } from '../api/service';

const helpSteps = [
  { text: 'Upload DEM Raster.' },
  { text: 'Upload Watershed ZIP if needed.' },
  { text: 'Upload Subwatershed ZIP if needed.' },
  { text: 'Choose: Whole Basin / Watershed / Subwatershed.' },
  { text: 'Generate Contour Map.' },
  { text: 'Download result.' },
];

export default function ContourMapPage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const [demFile, setDemFile] = useState(null);
  const [watershedFile, setWatershedFile] = useState(null);
  const [subwatershedFile, setSubwatershedFile] = useState(null);
  const [title, setTitle] = useState('');
  const [shedType, setShedType] = useState('Whole Basin');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [resultUrl, setResultUrl] = useState(null);

  const handleGenerate = useCallback(async () => {
    if (!demFile) return;
    setLoading(true);
    setSuccess(false);
    setResultUrl(null);
    try {
      const formData = new FormData();
      formData.append('cn_file', demFile);
      if (watershedFile) formData.append('watershed_zip', watershedFile);
      if (subwatershedFile) formData.append('subwatershed_zip', subwatershedFile);
      formData.append('title', title);
      formData.append('Sheds', shedType);

      const response = await generateContourMap(formData);
      const url = URL.createObjectURL(response);
      setResultUrl(url);
      setSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [demFile, watershedFile, subwatershedFile, title, shedType]);

  const handleDownload = useCallback(() => {
    if (!resultUrl) return;
    const a = document.createElement('a');
    a.href = resultUrl;
    a.download = `${title || 'contour-map'}.png`;
    a.click();
  }, [resultUrl, title]);

  const handleSample = useCallback(() => {
    setTitle('Sample Contour Map - Study Basin');
    setShedType('Whole Basin');
  }, []);

  return (
    <ToolPageLayout
      title="Contour Map Generator"
      description="Generate contour maps for basin analysis"
      icon={Mountain}
      helpSection={
        <HelpSection
          title="Need Help? How to Generate a Contour Map"
          steps={helpSteps}
          infoBox="Contour maps represent elevation changes using contour lines."
          onShowSample={handleSample}
        />
      }
      sampleButton={handleSample}
      resultImageUrl={resultUrl}
      onDownload={handleDownload}
      isLoading={loading}
      isSuccess={success}
    >
      <div className="space-y-6 text-slate-200">
        <FileUpload
          label="DEM Raster"
          tooltip="Digital Elevation Model raster file in GeoTIFF format."
          accept=".tif,.tiff"
          file={demFile}
          onFileChange={setDemFile}
        />

        <FileUpload
          label="Watershed ZIP (Optional)"
          tooltip="ZIP containing watershed shapefile (.shp, .dbf, .shx)."
          accept=".zip"
          file={watershedFile}
          onFileChange={setWatershedFile}
          helperText="Upload watershed shapefile as ZIP"
        />

        <FileUpload
          label="Subwatershed ZIP (Optional)"
          tooltip="ZIP containing subwatershed shapefile."
          accept=".zip"
          file={subwatershedFile}
          onFileChange={setSubwatershedFile}
          helperText="Upload subwatershed shapefile as ZIP"
        />

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Map Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="gis-input bg-slate-800 text-white border-slate-600 placeholder-slate-500"
            placeholder="e.g. Contour Map - Basin A"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-3">Sheds Selection</label>
          <SegmentedControl
            options={['Whole Basin', 'Watershed', 'Subwatershed']}
            value={shedType}
            onChange={setShedType}
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={!demFile || loading}
          className="w-full btn-gradient text-white py-3.5 rounded-xl font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          Generate Contour Map
        </button>
      </div>
    </ToolPageLayout>
  );
}