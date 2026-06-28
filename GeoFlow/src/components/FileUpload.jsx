import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, X, CheckCircle } from 'lucide-react';
import { useStats } from '../context/StatsContext';
import Tooltip from './Tooltip';

export default function FileUpload({ label, tooltip, accept, file, onFileChange, helperText }) {
  const [dragover, setDragover] = useState(false);
  const inputRef = useRef(null);
  const { incrementFiles } = useStats();

  const handleFile = useCallback((f) => {
    if (f) {
      onFileChange(f);
      incrementFiles();
    }
  }, [onFileChange, incrementFiles]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragover(false);
    const f = e.dataTransfer.files[0];
    handleFile(f);
  }, [handleFile]);

  const handleDragOver = (e) => { e.preventDefault(); setDragover(true); };
  const handleDragLeave = () => setDragover(false);
  const handleClick = () => inputRef.current?.click();
  const handleRemove = (e) => { e.stopPropagation(); onFileChange(null); };

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {label}
          <Tooltip text={tooltip} />
        </label>
      )}
      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`file-upload-zone rounded-xl p-6 cursor-pointer text-center transition ${
          dragover ? 'dragover' : file ? 'has-file' : ''
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={(e) => handleFile(e.target.files[0])}
          className="hidden"
        />

        <AnimatePresence mode="wait">
          {file ? (
            <motion.div
              key="file"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex items-center justify-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-slate-700 truncate max-w-[200px]">{file.name}</p>
                <p className="text-xs text-slate-400">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
              <button
                onClick={handleRemove}
                className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-2"
            >
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
                {helperText ? (
                  <FileText className="w-6 h-6 text-slate-400" />
                ) : (
                  <Upload className="w-6 h-6 text-slate-400" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">
                  {helperText || 'Drag & drop or click to upload'}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">{accept || 'Any file'}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}