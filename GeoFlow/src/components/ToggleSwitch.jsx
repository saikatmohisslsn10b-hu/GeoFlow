import Tooltip from './Tooltip';

export default function ToggleSwitch({ label, tooltip, value, onChange }) {
  return (
    <div className="flex items-center gap-3">
      <label className="text-sm font-medium text-slate-700">
        {label}
        <Tooltip text={tooltip} />
      </label>
      <div
        className={`toggle-track ${value ? 'on' : 'off'}`}
        onClick={() => onChange(!value)}
      >
        <div className="toggle-thumb" />
      </div>
      <span className={`text-xs font-semibold ${value ? 'text-emerald-600' : 'text-red-500'}`}>
        {value ? 'Yes' : 'No'}
      </span>
    </div>
  );
}