import { useState, useCallback, useEffect } from 'react';
import { GitBranch } from 'lucide-react';
import ToolPageLayout from '../components/ToolPageLayout';
import FileUpload from '../components/FileUpload';
import SegmentedControl from '../components/SegmentedControl';
import HelpSection from '../components/HelpSection';
import { generateCurveNumberSheds } from '../api/service';

const helpSteps = [
  { text: 'Upload Curve Number Raster.' },
  { text: 'Upload Watershed ZIP file.' },
  { text: '(Optional) Upload Subwatershed ZIP file.' },
  { text: 'Choose: Whole Basin / Watershed / Subwatershed.' },
  { text: 'Click Generate.' },
  { text: 'Preview and download output.' },
];

export default function CurveNumberShedsPage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const [cnFile, setCnFile] = useState(null);
  const [watershedFile, setWatershedFile] = useState(null);
  const [subwatershedFile, setSubwatershedFile] = useState(null);
  const [title, setTitle] = useState('');
  const [shedType, setShedType] = useState('Whole Basin');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [resultUrl, setResultUrl] = useState(null);

  const handleGenerate = useCallback(async () => {
    if (!cnFile || !watershedFile) return;
    setLoading(true);
    setSuccess(false);
    setResultUrl(null);
    try {
      const formData = new FormData();
      formData.append('cn_file', cnFile);
      if (watershedFile) formData.append('watershed_zip', watershedFile);
      if (subwatershedFile) formData.append('subwatershed_zip', subwatershedFile);
      formData.append('title', title);
      formData.append('Sheds', shedType);

      const response = await generateCurveNumberSheds(formData);
      const url = URL.createObjectURL(response);
      setResultUrl(url);
      setSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [cnFile, watershedFile, subwatershedFile, title, shedType]);

  const handleDownload = useCallback(() => {
    if (!resultUrl) return;
    const a = document.createElement('a');
    a.href = resultUrl;
    a.download = `${title || 'cn-sheds-map'}.png`;
    a.click();
  }, [resultUrl, title]);

  const handleSample = useCallback(() => {
    setTitle('Sample CN Sheds Map - Study Basin');
    setShedType('Watershed');
  }, []);

  return (
    <ToolPageLayout
      title="Curve Number Sheds Map"
      description="Generate watershed and subwatershed CN maps"
      icon={GitBranch}
      helpSection={
        <HelpSection
          title="Need Help? How to Generate a Curve Number Sheds Map"
          steps={helpSteps}
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
          label="Curve Number Raster"
          tooltip="Pre-generated Curve Number raster file."
          accept=".tif,.tiff"
          file={cnFile}
          onFileChange={setCnFile}
        />

        <FileUpload
          label="Watershed ZIP"
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
            placeholder="e.g. CN Sheds - Upper Basin"
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
          disabled={!cnFile || !watershedFile || loading}
          className="w-full btn-gradient text-white py-3.5 rounded-xl font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          Generate CN Sheds Map
        </button>
      </div>
    </ToolPageLayout>
  );
}