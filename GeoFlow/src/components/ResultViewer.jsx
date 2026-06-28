import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ZoomIn, ZoomOut, Maximize2, Minimize2, Download, Share2, X
} from 'lucide-react';

export default function ResultViewer({ imageUrl, title, onDownload, onDownloadTif, showTif = false }) {
  const [zoom, setZoom] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const containerRef = useRef(null);

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.25, 3));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.25, 0.5));
  const handleFit = () => setZoom(1);
  const handleFullscreen = () => setFullscreen(!fullscreen);

  const handleShare = async () => {
    if (navigator.share && imageUrl) {
      try {
        const res = await fetch(imageUrl);
        const blob = await res.blob();
        const file = new File([blob], `${title || 'map'}.png`, { type: 'image/png' });
        await navigator.share({ title, files: [file] });
      } catch {
        setShowShare(true);
      }
    } else {
      setShowShare(true);
    }
  };

  const toolbar = (
    <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200/60 p-1.5">
      <button onClick={handleZoomOut} className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition" title="Zoom Out">
        <ZoomOut className="w-4 h-4" />
      </button>
      <span className="text-xs font-medium text-slate-500 w-12 text-center">{Math.round(zoom * 100)}%</span>
      <button onClick={handleZoomIn} className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition" title="Zoom In">
        <ZoomIn className="w-4 h-4" />
      </button>
      <div className="w-px h-5 bg-slate-200" />
      <button onClick={handleFit} className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition" title="Fit to Screen">
        <Maximize2 className="w-4 h-4" />
      </button>
      <button onClick={handleFullscreen} className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition" title="Fullscreen">
        {fullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
      </button>
      <div className="w-px h-5 bg-slate-200" />
      <button onClick={handleShare} className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition" title="Share">
        <Share2 className="w-4 h-4" />
      </button>
      {onDownload && (
        <button onClick={onDownload} className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition" title="Download PNG">
          <Download className="w-4 h-4" />
        </button>
      )}
    </div>
  );

  return (
    <>
      <div
        ref={containerRef}
        className={`relative rounded-2xl overflow-hidden border border-slate-200/60 bg-slate-50 ${
          fullscreen ? 'fixed inset-0 z-[90] rounded-none' : ''
        }`}
      >
        {/* Image */}
        <div
          className="overflow-auto w-full h-full"
          style={{ minHeight: fullscreen ? '100vh' : '400px', maxHeight: fullscreen ? '100vh' : '600px' }}
        >
          {imageUrl ? (
            <div className="flex items-center justify-center min-h-full p-4">
              <img
                src={imageUrl}
                alt={title || 'Generated Map'}
                className="max-w-full h-auto transition-transform duration-300"
                style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-96 text-slate-400">No image to display</div>
          )}
        </div>

        {/* Toolbar */}
        <div className={`absolute ${fullscreen ? 'top-4 right-4' : 'top-3 right-3'}`}>
          {toolbar}
        </div>

        {/* Fullscreen exit */}
        {fullscreen && (
          <button
            onClick={handleFullscreen}
            className="absolute top-4 left-4 p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-slate-200/60 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        )}
      </div>

      {/* Download buttons below viewer */}
      {!fullscreen && imageUrl && (
        <div className="flex items-center gap-3 mt-4">
          {onDownload && (
            <button
              onClick={onDownload}
              className="btn-gradient text-white px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2"
            >
              <Download className="w-4 h-4" /> Download PNG
            </button>
          )}
          {showTif && onDownloadTif && (
            <button
              onClick={onDownloadTif}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50 transition flex items-center gap-2"
            >
              <Download className="w-4 h-4" /> Download TIF
            </button>
          )}
        </div>
      )}

      {/* Share toast */}
      <AnimatePresence>
        {showShare && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-6 py-3 rounded-xl shadow-2xl text-sm flex items-center gap-3 z-[100]"
          >
            <Share2 className="w-4 h-4" />
            <span>Share link copied to clipboard</span>
            <button onClick={() => setShowShare(false)} className="ml-2 text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}