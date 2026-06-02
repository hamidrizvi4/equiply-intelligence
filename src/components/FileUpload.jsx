import { useState, useRef } from 'react';
import { Upload, AlertCircle, Database } from 'lucide-react';

export default function FileUpload({ onDataLoaded }) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const processFile = async (file) => {
    if (!file) return;
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      setError('Please upload a valid CSV file.');
      return;
    }

    setError(null);
    setLoading(true);
    try {
      // Import the data pipeline dynamically
      const { processPipeline } = await import('../utils/dataPipeline');
      const data = await processPipeline(file);
      onDataLoaded(data);
    } catch (err) {
      console.error(err);
      setError('Failed to parse CSV file. Please make sure the format is correct.');
    } finally {
      setLoading(false);
    }
  };

  // Handle drop event
  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processFile(e.dataTransfer.files[0]);
    }
  };

  // Handle file input change
  const handleChange = async (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      await processFile(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // Load standard Demo Dataset for judges/testing
  const loadDemoData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Create a mock File object containing standard CSV data
      const csvContent = `manufacturer,model,serial number
EDAN INSTRUMENTS,IM3,1905321
PHILIPS,INTELLIVUE MP30,M21034
ZOLL MEDICAL,R SERIES,230491
HILLROM,CENTURY,150821
OLYMPUS,CV190,220104
EXERGEN,TAT5000,241103
COVIDIEN,RAPIDVAC,181290
BIOSONIC,UC95,160293
LINET,ELEGANZA 3,170519
MASIMO,RAD8,A20021
GE HEALTHCARE,APEX PRO CH,220912`;

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const file = new File([blob], 'demo_equipment_inventory.csv', { type: 'text/csv' });

      const { processPipeline } = await import('../utils/dataPipeline');
      const data = await processPipeline(file);

      // Delay slightly to show a premium loading state transition
      setTimeout(() => {
        onDataLoaded(data);
        setLoading(false);
      }, 800);
    } catch (err) {
      console.error(err);
      setError('Failed to load demo data.');
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      {/* Subtle background accent — tuned for the light theme */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[18%] left-[8%] w-[360px] h-[360px] rounded-full bg-brand-accent/10 blur-[110px]"></div>
        <div className="absolute bottom-[18%] right-[8%] w-[420px] h-[420px] rounded-full bg-sky-300/20 blur-[130px]"></div>
      </div>

      <div className="w-full max-w-2xl text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-brand-textMain mb-3">
          Equipment Lifecycle Analyzer
        </h1>
        <p className="text-brand-textMuted text-lg max-w-md mx-auto">
          Enrich inventory CSVs, extract manufacturing dates from serials, and analyze lifecycle risk.
        </p>
      </div>

      {/* Main upload card */}
      <div className="w-full max-w-xl bg-brand-surface border border-brand-border shadow-xl shadow-slate-200/60 rounded-2xl p-8 transition-all duration-300">
        <form
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={triggerFileInput}
          className={`relative group border-2 border-dashed rounded-xl p-10 cursor-pointer transition-all duration-300 flex flex-col items-center justify-center min-h-[260px] ${
            isDragActive
              ? 'border-brand-accent bg-brand-accent/5 scale-[1.02]'
              : 'border-brand-border hover:border-brand-accent/60 hover:bg-brand-bg'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".csv"
            onChange={handleChange}
            disabled={loading}
          />

          {loading ? (
            <div className="flex flex-col items-center space-y-4">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-brand-accent/20"></div>
                <div className="absolute inset-0 rounded-full border-4 border-t-brand-accent animate-spin"></div>
              </div>
              <p className="text-brand-accent font-medium animate-pulse">Processing CSV pipeline...</p>
            </div>
          ) : (
            <>
              <div className={`p-4 rounded-full mb-4 transition-all duration-300 ${
                isDragActive
                  ? 'bg-brand-accent/15 text-brand-accent scale-110'
                  : 'bg-brand-bg text-brand-textMuted group-hover:text-brand-accent group-hover:bg-brand-accent/10'
              }`}>
                <Upload size={36} />
              </div>
              <h3 className="text-xl font-semibold text-brand-textMain mb-2">
                {isDragActive ? 'Drop your file here' : 'Drag & Drop your CSV file'}
              </h3>
              <p className="text-brand-textMuted text-sm text-center max-w-xs mb-1">
                or click to browse your computer
              </p>
              <p className="text-xs text-brand-textMuted mt-4 bg-brand-bg px-3 py-1 rounded-full border border-brand-border">
                Required headers: <span className="font-mono text-brand-textMain">manufacturer</span>, <span className="font-mono text-brand-textMain">model</span>, <span className="font-mono text-brand-textMain">serial number</span>
              </p>
            </>
          )}
        </form>

        {error && (
          <div className="mt-4 flex items-center gap-2 text-rose-700 bg-rose-50 border border-rose-200 px-4 py-3 rounded-lg text-sm">
            <AlertCircle size={18} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="relative flex py-5 items-center">
          <div className="flex-grow border-t border-brand-border"></div>
          <span className="flex-shrink mx-4 text-brand-textMuted text-xs font-semibold uppercase tracking-wider">or</span>
          <div className="flex-grow border-t border-brand-border"></div>
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); loadDemoData(); }}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-brand-accent hover:bg-brand-accentHover text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 shadow-lg shadow-brand-accent/20 disabled:opacity-50 active:scale-[0.98] cursor-pointer"
        >
          <Database size={18} />
          Load Demo Dataset
        </button>
      </div>
    </div>
  );
}
