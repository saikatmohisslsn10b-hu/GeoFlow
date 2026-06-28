import { Map } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-white/80 backdrop-blur-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
              <Map className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-bold text-slate-800">GeoFlow</p>
              <p className="text-xs text-slate-500">Beginner Friendly GIS Platform</p>
            </div>
          </div>
          <p className="text-sm text-slate-500 text-center">
            Developed for Hydrology and Watershed Analysis
          </p>
          <p className="text-xs text-slate-400">
            &copy; {new Date().getFullYear()} GeoFlow. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}