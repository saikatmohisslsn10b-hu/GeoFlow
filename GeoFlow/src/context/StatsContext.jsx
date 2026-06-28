import { createContext, useContext, useState, useCallback } from 'react';

const StatsContext = createContext();

export function StatsProvider({ children }) {
  const [stats, setStats] = useState({
    filesUploaded: 0,
    mapsGenerated: 0,
    processingTime: 0,
    outputSize: 0,
  });

  const incrementFiles = useCallback(() => {
    setStats((prev) => ({ ...prev, filesUploaded: prev.filesUploaded + 1 }));
  }, []);

  const incrementMaps = useCallback((time = 0, size = 0) => {
    setStats((prev) => ({
      ...prev,
      mapsGenerated: prev.mapsGenerated + 1,
      processingTime: prev.processingTime + time,
      outputSize: prev.outputSize + size,
    }));
  }, []);

  const resetStats = useCallback(() => {
    setStats({ filesUploaded: 0, mapsGenerated: 0, processingTime: 0, outputSize: 0 });
  }, []);

  return (
    <StatsContext.Provider value={{ stats, incrementFiles, incrementMaps, resetStats }}>
      {children}
    </StatsContext.Provider>
  );
}

export function useStats() {
  const context = useContext(StatsContext);
  if (!context) throw new Error('useStats must be used within StatsProvider');
  return context;
}