export default function SegmentedControl({ options, value, onChange }) {
  return (
    <div className="segment-control">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`segment-btn ${value === opt ? 'active' : ''}`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}