import { useState, useCallback, useEffect } from 'react';
import { Layers } from 'lucide-react';
import ToolPageLayout from '../components/ToolPageLayout';
import FileUpload from '../components/FileUpload';
import EditableTable from '../components/EditableTable';
import HelpSection from '../components/HelpSection';
import Tooltip from '../components/Tooltip';
import { generateSoilMap } from '../api/service';

const columns = [
  { key: 'value', label: 'Raster Value', type: 'number', placeholder: 'e.g. 1' },
  { key: 'name', label: 'Soil Name', placeholder: 'e.g. Sandy Soil' },
];

const helpSteps = [
  { text: 'Upload your Soil Raster (.tif) file.' },
  { text: 'Enter a map title (optional).' },
  { text: 'Define soil classes.', example: '1 → Sandy Soil\n2 → Clay Soil\n3 → Loamy Soil\n4 → Silty Soil' },
  { text: 'Click Generate Soil Map.' },
  { text: 'Preview and download the generated map.' },
];

export default function SoilMapPage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [rows, setRows] = useState([
    { value: '', name: '' },
    { value: '', name: '' },
    { value: '', name: '' },
  ]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [resultUrl, setResultUrl] = useState(null);

  const handleGenerate = useCallback(async () => {
    if (!file) return;
    setLoading(true);
    setSuccess(false);
    setResultUrl(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title);
      
      const classNames = {};
      rows.forEach(r => {
        if (r.value && r.name) {
          classNames[r.value] = r.name;
        }
      });
      formData.append('class_names', JSON.stringify(classNames));

      const response = await generateSoilMap(formData);
      const url = URL.createObjectURL(response);
      setResultUrl(url);
      setSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [file, title, rows]);

  const handleDownload = useCallback(() => {
    if (!resultUrl) return;
    const a = document.createElement('a');
    a.href = resultUrl;
    a.download = `${title || 'soil-map'}.png`;
    a.click();
  }, [resultUrl, title]);

  const handleSample = useCallback(() => {
    setTitle('Sample Soil Classification Map');
    setRows([
      { value: '1', name: 'Sandy Soil' },
      { value: '2', name: 'Clay Soil' },
      { value: '3', name: 'Loamy Soil' },
      { value: '4', name: 'Silty Soil' },
    ]);
  }, []);

  return (
    <ToolPageLayout
      title="Soil Map Generator"
      description="Generate soil classification maps from raster data"
      icon={Layers}
      helpSection={
        <HelpSection
          title="Need Help? How to Generate a Soil Map"
          steps={helpSteps}
          onShowSample={handleSample}
          videoUrl="https://www.youtube.com/watch?v=n2VkVRhIqzc"
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
          label="Soil Raster File"
          tooltip="Soil classification raster file in GeoTIFF format."
          accept=".tif,.tiff"
          file={file}
          onFileChange={setFile}
        />

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Map Title
            <Tooltip text="Optional title displayed on the generated map." />
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="gis-input bg-slate-800 text-white border-slate-600 placeholder-slate-500"
            placeholder="e.g. Watershed Soil Classification"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Soil Class Definitions</label>
          <EditableTable columns={columns} rows={rows} onChange={setRows} addLabel="Add Row" />
        </div>

        <button
          onClick={handleGenerate}
          disabled={!file || loading}
          className="w-full btn-gradient text-white py-3.5 rounded-xl font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
        >
          Generate Soil Map
        </button>
      </div>
    </ToolPageLayout>
  );
}