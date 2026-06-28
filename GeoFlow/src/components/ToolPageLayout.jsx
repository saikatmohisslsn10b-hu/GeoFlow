import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StatsSidebar from './StatsSidebar';
import LoadingScreen from './LoadingScreen';
import EmptyState from './EmptyState';
import SuccessBanner from './SuccessBanner';
import ResultViewer from './ResultViewer';
import SampleDatasetButton from './SampleDatasetButton';

export default function ToolPageLayout({
  title,
  description,
  icon: Icon,
  helpSection,
  sampleButton,
  children,
  resultImageUrl,
  onDownload,
  onDownloadTif,
  showTif = false,
  isLoading,
  isSuccess,
  waterTheme = false,
  loadingMessage,
}) {
  const [showResult, setShowResult] = useState(false);

  return (
    <div className="min-h-screen topo-bg pt-24 pb-12">
      {/* Loading overlay */}
      <AnimatePresence>
        {isLoading && (
          <LoadingScreen message={loadingMessage || 'Generating Map...'} waterTheme={waterTheme} />
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
              <p className="text-sm text-slate-500">{description}</p>
            </div>
          </div>
        </motion.div>

        {/* Help section */}
        {helpSection}

        {/* Main content grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left - Input form */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            {/* Sample dataset button */}
            {sampleButton && (
              <div className="flex justify-end">
                <SampleDatasetButton onClick={sampleButton} />
              </div>
            )}

            {/* Form card */}
            <div className="glass-card rounded-2xl p-6">
              {children}
            </div>

            {/* Result section */}
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">Result</h2>

              {isSuccess && !showResult && (
                <SuccessBanner />
              )}

              {resultImageUrl ? (
                <ResultViewer
                  imageUrl={resultImageUrl}
                  title={title}
                  onDownload={onDownload}
                  onDownloadTif={onDownloadTif}
                  showTif={showTif}
                />
              ) : (
                <EmptyState />
              )}
            </div>
          </div>

          {/* Right - Stats sidebar */}
          <div className="col-span-12 lg:col-span-4">
            <StatsSidebar />
          </div>
        </div>
      </div>
    </div>
  );
}