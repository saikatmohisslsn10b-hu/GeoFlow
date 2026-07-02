import { useState, useCallback, useEffect } from 'react';
import { BarChart3 } from 'lucide-react';
import ToolPageLayout from '../components/ToolPageLayout';
import FileUpload from '../components/FileUpload';
import ToggleSwitch from '../components/ToggleSwitch';
import HelpSection from '../components/HelpSection';
import Tooltip from '../components/Tooltip';
import { generateCurveNumberMap } from '../api/service';

const helpSteps = [
  { text: 'Upload LULC Raster.' },
  { text: 'Upload Soil Raster.' },
  { text: 'Enter map title.' },
  { text: 'Choose Need TIF Output.', example: 'Green = Yes\nRed = No' },
  { text: 'Click Generate Curve Number Map.' },
  { text: 'Download PNG or TIF output.' },
];

export default function CurveNumberMapPage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const [lulcFile, setLulcFile] = useState(null);
  const [soilFile, setSoilFile] = useState(null);
  const [title, setTitle] = useState('');
  const [tifOutput, setTifOutput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [resultUrl, setResultUrl] = useState(null);

  const handleGenerate = useCallback(async () => {
    if (!lulcFile || !soilFile) return;
    setLoading(true);
    setSuccess(false);
    setResultUrl(null);
    try {
      const formData = new FormData();
      formData.append('lulc_file', lulcFile);
      formData.append('soil_file', soilFile);
      formData.append('title', title);
      formData.append('TIF', tifOutput ? 'yes' : 'no');

      const response = await generateCurveNumberMap(formData);
      const url = URL.createObjectURL(response);
      setResultUrl(url);
      setSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [lulcFile, soilFile, title, tifOutput]);

  const handleDownload = useCallback(() => {
    if (!resultUrl) return;
    const a = document.createElement('a');
    a.href = resultUrl;
    a.download = `${title || 'cn-map'}.png`;
    a.click();
  }, [resultUrl, title]);

  const handleDownloadTif = useCallback(() => {
    alert('TIF download would be triggered from the API response.');
  }, []);

  const handleSample = useCallback(() => {
    setTitle('Sample Curve Number Map - Basin Area');
  }, []);

  return (
    <ToolPageLayout
      title="Curve Number Map Generator"
      description="Generate SCS Curve Number maps from LULC and Soil data"
      icon={BarChart3}
      helpSection={
        <HelpSection
          title="Need Help? How to Generate a Curve Number Map"
          steps={helpSteps}
          infoBox="Curve Number maps combine Soil and LULC information to estimate runoff potential."
          onShowSample={handleSample}
        />
      }
      sampleButton={handleSample}
      resultImageUrl={resultUrl}
      onDownload={handleDownload}
      onDownloadTif={handleDownloadTif}
      showTif={tifOutput}
      isLoading={loading}
      isSuccess={success}
    >
      <div className="space-y-6 text-slate-200">
        <FileUpload
          label="LULC Raster File"
          tooltip="Land Use Land Cover raster file."
          accept=".tif,.tiff"
          file={lulcFile}
          onFileChange={setLulcFile}
        />

        <FileUpload
          label="Soil Raster File"
          tooltip="Soil classification raster file."
          accept=".tif,.tiff"
          file={soilFile}
          onFileChange={setSoilFile}
        />

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Map Title
            <Tooltip text="Optional title for the output map." />
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="gis-input bg-slate-800 text-white border-slate-600 placeholder-slate-500"
            placeholder="e.g. SCS CN Map - Watershed A"
          />
        </div>

        <ToggleSwitch
          label="Need TIF Output"
          tooltip="Enable if you want GeoTIFF output in addition to PNG."
          value={tifOutput}
          onChange={setTifOutput}
        />

        <button
          onClick={handleGenerate}
          disabled={!lulcFile || !soilFile || loading}
          className="w-full btn-gradient text-white py-3.5 rounded-xl font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          Generate Curve Number Map
        </button>
      </div>
    </ToolPageLayout>
  );
}