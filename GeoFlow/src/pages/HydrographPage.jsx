import { useState, useCallback, useEffect } from 'react';
import { Waves } from 'lucide-react';
import ToolPageLayout from '../components/ToolPageLayout';
import HelpSection from '../components/HelpSection';
import Tooltip from '../components/Tooltip';
import { generateHydrograph } from '../api/service';

const helpSteps = [
  { text: 'Enter USGS Station ID.' },
  { text: 'OR enter Station Name.' },
  { text: 'Provide State Code.', example: 'TX, CA, NY' },
  { text: 'Enter custom title if needed.' },
  { text: 'Click Generate Hydrograph.' },
  { text: 'View and download graph.' },
];

export default function HydrographPage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const [stationId, setStationId] = useState('');
  const [stationName, setStationName] = useState('');
  const [stateCode, setStateCode] = useState('');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [resultUrl, setResultUrl] = useState(null);

  const handleGenerate = useCallback(async () => {
    if (!stationId && !stationName) return;
    setLoading(true);
    setSuccess(false);
    setResultUrl(null);
    try {
      const formData = new FormData();
      formData.append('station_id', stationId);
      formData.append('station_name', stationName);
      formData.append('state_code', stateCode || 'TX');
      formData.append('title', title);

      const response = await generateHydrograph(formData);
      const url = URL.createObjectURL(response);
      setResultUrl(url);
      setSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [stationId, stationName, stateCode, title]);

  const handleDownload = useCallback(() => {
    if (!resultUrl) return;
    const a = document.createElement('a');
    a.href = resultUrl;
    a.download = `${title || 'hydrograph'}.png`;
    a.click();
  }, [resultUrl, title]);

  const handleSample = useCallback(() => {
    setStationId('08330000');
    setStationName('');
    setStateCode('TX');
    setTitle('Sample Hydrograph - Colorado River at Austin');
  }, []);

  return (
    <ToolPageLayout
      title="Hydrograph Generator"
      description="Generate hydrographs from USGS station data"
      icon={Waves}
      helpSection={
        <HelpSection
          title="Need Help? How to Generate a Hydrograph"
          steps={helpSteps}
          infoBox="Hydrographs show streamflow variation over time."
          onShowSample={handleSample}
        />
      }
      sampleButton={handleSample}
      resultImageUrl={resultUrl}
      onDownload={handleDownload}
      isLoading={loading}
      isSuccess={success}
      waterTheme={true}
      loadingMessage="Fetching USGS Data & Generating Hydrograph..."
    >
      <div className="space-y-6 text-slate-200">
        {/* Water theme accent */}
        <div className="h-1 w-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 opacity-50" />

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Station ID
            <Tooltip text="Unique USGS monitoring station number." />
          </label>
          <input
            type="text"
            value={stationId}
            onChange={(e) => setStationId(e.target.value)}
            className="gis-input bg-slate-800 text-white border-slate-600 placeholder-slate-500"
            placeholder="e.g. 08330000"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-slate-600" />
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">OR</span>
          <div className="flex-1 h-px bg-slate-600" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Station Name
          </label>
          <input
            type="text"
            value={stationName}
            onChange={(e) => setStationName(e.target.value)}
            className="gis-input bg-slate-800 text-white border-slate-600 placeholder-slate-500"
            placeholder="e.g. Colorado River at Austin"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            State Code
            <Tooltip text="Two-letter US state code (e.g., TX, CA, NY)." />
          </label>
          <input
            type="text"
            value={stateCode}
            onChange={(e) => setStateCode(e.target.value.toUpperCase())}
            className="gis-input uppercase bg-slate-800 text-white border-slate-600 placeholder-slate-500"
            placeholder="e.g. TX"
            maxLength={2}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Map Title
            <Tooltip text="Optional title for the hydrograph." />
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="gis-input bg-slate-800 text-white border-slate-600 placeholder-slate-500"
            placeholder="e.g. Streamflow Hydrograph - Station 08330000"
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={(!stationId && !stationName) || loading}
          className="w-full py-3.5 rounded-xl font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600 hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
        >
          <Waves className="w-4 h-4" /> Generate Hydrograph
        </button>
      </div>
    </ToolPageLayout>
  );
}