import { useState, useCallback } from 'react';
import { Satellite } from 'lucide-react';
import ToolPageLayout from '../components/ToolPageLayout';
import FileUpload from '../components/FileUpload';
import EditableTable from '../components/EditableTable';
import HelpSection from '../components/HelpSection';
import Tooltip from '../components/Tooltip';
import { generateLULCMap } from '../api/service';

const columns = [
  { key: 'value', label: 'Raster Value', type: 'number', placeholder: 'e.g. 1' },
  { key: 'name', label: 'Land Cover Category', placeholder: 'e.g. Water' },
];

const helpSteps = [
  { text: 'Upload LULC Raster (.tif).' },
  { text: 'Enter map title.' },
  { text: 'Define categories.', example: '1 → Water\n2 → Forest\n3 → Agriculture\n4 → Urban\n5 → Barren Land' },
  { text: 'Click Generate LULC Map.' },
  { text: 'Preview and download.' },
];

export default function LULCMapPage() {
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
      
      const categories = {};
      rows.forEach(r => {
        if (r.value && r.name) {
          categories[r.value] = r.name;
        }
      });
      formData.append('categories', JSON.stringify(categories));

      const response = await generateLULCMap(formData);
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
    a.download = `${title || 'lulc-map'}.png`;
    a.click();
  }, [resultUrl, title]);

  const handleSample = useCallback(() => {
    setTitle('Sample LULC Map - Study Area');
    setRows([
      { value: '1', name: 'Water' },
      { value: '2', name: 'Forest' },
      { value: '3', name: 'Agriculture' },
      { value: '4', name: 'Urban' },
      { value: '5', name: 'Barren Land' },
    ]);
  }, []);

  return (
    <ToolPageLayout
      title="LULC Map Generator"
      description="Generate Land Use Land Cover maps from raster data"
      icon={Satellite}
      helpSection={
        <HelpSection
          title="Need Help? How to Generate a LULC Map"
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
      <div className="space-y-6">
        <FileUpload
          label="LULC Raster File"
          tooltip="Land Use Land Cover raster file in GeoTIFF format."
          accept=".tif,.tiff"
          file={file}
          onFileChange={setFile}
        />

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Map Title
            <Tooltip text="Optional title for the output map." />
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="gis-input"
            placeholder="e.g. LULC Classification 2024"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Land Cover Categories</label>
          <EditableTable columns={columns} rows={rows} onChange={setRows} addLabel="Add Category" />
        </div>

        <button
          onClick={handleGenerate}
          disabled={!file || loading}
          className="w-full btn-gradient text-white py-3.5 rounded-xl font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          Generate LULC Map
        </button>
      </div>
    </ToolPageLayout>
  );
}