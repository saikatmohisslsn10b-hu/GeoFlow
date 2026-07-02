import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Waves, Satellite, Layers, BarChart3, GitBranch, Mountain,
  ArrowRight, Map
} from 'lucide-react';

const tools = [
  { title: 'Hydrograph Map', icon: Waves, desc: 'Generate hydrographs from USGS station data.', path: '/tool/hydrograph', gradient: 'from-cyan-500 to-blue-500' },
  { title: 'LULC Map', icon: Satellite, desc: 'Generate Land Use Land Cover maps from raster data.', path: '/tool/lulc-map', gradient: 'from-emerald-500 to-green-500' },
  { title: 'Soil Map', icon: Layers, desc: 'Generate soil classification maps.', path: '/tool/soil-map', gradient: 'from-amber-500 to-orange-500' },
  { title: 'Curve Number Map', icon: BarChart3, desc: 'Generate SCS Curve Number maps.', path: '/tool/curve-number-map', gradient: 'from-blue-500 to-indigo-500' },
  { title: 'CN Sheds Map', icon: GitBranch, desc: 'Generate watershed and subwatershed CN maps.', path: '/tool/curve-number-sheds', gradient: 'from-violet-500 to-purple-500' },
  { title: 'Contour Map', icon: Mountain, desc: 'Generate contour maps for basin analysis.', path: '/tool/contour-map', gradient: 'from-rose-500 to-pink-500' },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-12 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Map className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Dashboard</h1>
              <p className="text-sm text-slate-400">Select a tool to begin your GIS analysis</p>
            </div>
          </div>
        </motion.div>

        {/* Tools grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool, i) => {
            const Icon = tool.icon;
            return (
              <motion.div
                key={tool.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
              >
                <Link
                  to={tool.path}
                  className="block bg-slate-900/70 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-blue-500/50 hover:shadow-[0_15px_40px_-10px_rgba(59,130,246,0.3)] transition-all duration-300 group h-full"
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${tool.gradient} shadow-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1.5 group-hover:text-blue-400 transition">
                    {tool.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed mb-4">{tool.desc}</p>
                  <span className="text-sm font-semibold text-blue-400 flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
                    Open Tool <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}