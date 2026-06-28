import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import SoilMapPage from './pages/SoilMapPage';
import LULCMapPage from './pages/LULCMapPage';
import CurveNumberMapPage from './pages/CurveNumberMapPage';
import CurveNumberShedsPage from './pages/CurveNumberShedsPage';
import ContourMapPage from './pages/ContourMapPage';
import HydrographPage from './pages/HydrographPage';

function App() {
  const location = useLocation();
  const isLanding = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            <Routes location={location}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/tool/soil-map" element={<SoilMapPage />} />
              <Route path="/tool/lulc-map" element={<LULCMapPage />} />
              <Route path="/tool/curve-number-map" element={<CurveNumberMapPage />} />
              <Route path="/tool/curve-number-sheds" element={<CurveNumberShedsPage />} />
              <Route path="/tool/contour-map" element={<ContourMapPage />} />
              <Route path="/tool/hydrograph" element={<HydrographPage />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
      {!isLanding && <Footer />}
    </div>
  );
}

export default App;