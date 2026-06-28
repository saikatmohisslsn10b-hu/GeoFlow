import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Waves, Satellite, Layers, BarChart3, GitBranch, Mountain,
  ArrowRight, Play, Map, ChevronRight, CheckCircle2
} from 'lucide-react';

const features = [
  {
    title: 'Hydrograph Map',
    icon: Waves,
    desc: 'Generate hydrographs from USGS station data.',
    path: '/tool/hydrograph',
    color: 'from-cyan-500 to-blue-500',
    shadowColor: 'shadow-cyan-500/20',
    preview: 'linear-gradient(135deg, #e0f2fe, #cffafe)',
  },
  {
    title: 'LULC Map',
    icon: Satellite,
    desc: 'Generate Land Use Land Cover maps from raster data.',
    path: '/tool/lulc-map',
    color: 'from-emerald-500 to-green-500',
    shadowColor: 'shadow-emerald-500/20',
    preview: 'linear-gradient(135deg, #d1fae5, #dcfce7)',
  },
  {
    title: 'Soil Map',
    icon: Layers,
    desc: 'Generate soil classification maps.',
    path: '/tool/soil-map',
    color: 'from-amber-500 to-orange-500',
    shadowColor: 'shadow-amber-500/20',
    preview: 'linear-gradient(135deg, #fef3c7, #ffedd5)',
  },
  {
    title: 'Curve Number Map',
    icon: BarChart3,
    desc: 'Generate SCS Curve Number maps.',
    path: '/tool/curve-number-map',
    color: 'from-blue-500 to-indigo-500',
    shadowColor: 'shadow-blue-500/20',
    preview: 'linear-gradient(135deg, #dbeafe, #e0e7ff)',
  },
  {
    title: 'Curve Number Sheds Map',
    icon: GitBranch,
    desc: 'Generate watershed and subwatershed CN maps.',
    path: '/tool/curve-number-sheds',
    color: 'from-violet-500 to-purple-500',
    shadowColor: 'shadow-violet-500/20',
    preview: 'linear-gradient(135deg, #ede9fe, #f3e8ff)',
  },
  {
    title: 'Contour Map',
    icon: Mountain,
    desc: 'Generate contour maps for basin analysis.',
    path: '/tool/contour-map',
    color: 'from-rose-500 to-pink-500',
    shadowColor: 'shadow-rose-500/20',
    preview: 'linear-gradient(135deg, #ffe4e6, #fce7f3)',
  },
];

const highlights = [
  'No GIS software installation needed',
  'Browser-based processing',
  'Beginner-friendly interface',
  'Professional-grade outputs',
  'One-click map generation',
  'Designed for researchers & students',
];

function GISIllustration() {
  return (
    <motion.div
      animate={{ y: [0, -15, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      className="relative w-full max-w-lg mx-auto"
    >
      <svg viewBox="0 0 500 400" className="w-full h-auto drop-shadow-2xl">
        {/* Background map area */}
        <rect x="40" y="30" width="420" height="340" rx="20" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="2" />

        {/* Grid */}
        {Array.from({ length: 9 }).map((_, i) => (
          <g key={`g-${i}`}>
            <line x1={40 + i * 52.5} y1="30" x2={40 + i * 52.5} y2="370" stroke="#e2e8f0" strokeWidth="0.5" />
            <line x1="40" y1={30 + i * 42.5} x2="460" y2={30 + i * 42.5} stroke="#e2e8f0" strokeWidth="0.5" />
          </g>
        ))}

        {/* Contour lines */}
        <ellipse cx="250" cy="200" rx="160" ry="120" fill="none" stroke="#93c5fd" strokeWidth="1.5" opacity="0.5" />
        <ellipse cx="250" cy="200" rx="120" ry="90" fill="none" stroke="#60a5fa" strokeWidth="1.5" opacity="0.6" />
        <ellipse cx="250" cy="200" rx="80" ry="60" fill="none" stroke="#3b82f6" strokeWidth="1.5" opacity="0.7" />
        <ellipse cx="250" cy="200" rx="40" ry="30" fill="none" stroke="#2563eb" strokeWidth="1.5" opacity="0.8" />

        {/* Land use patches */}
        <rect x="70" y="60" width="80" height="60" rx="6" fill="#86efac" opacity="0.6" />
        <rect x="350" y="70" width="70" height="80" rx="6" fill="#fcd34d" opacity="0.5" />
        <rect x="80" y="280" width="90" height="55" rx="6" fill="#93c5fd" opacity="0.5" />
        <rect x="340" y="270" width="75" height="60" rx="6" fill="#fca5a5" opacity="0.5" />
        <circle cx="390" cy="140" r="30" fill="#67e8f9" opacity="0.5" />

        {/* Watershed boundary */}
        <path
          d="M120,100 Q200,50 320,90 Q400,130 380,220 Q360,310 250,340 Q140,320 100,240 Q70,170 120,100Z"
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2"
          strokeDasharray="8,4"
          opacity="0.7"
        />

        {/* Pin marker */}
        <g transform="translate(250, 170)">
          <path d="M0,-25 C-14,-25 -25,-14 -25,0 C-25,18 0,35 0,35 C0,35 25,18 25,0 C25,-14 14,-25 0,-25Z" fill="#3b82f6" />
          <circle cx="0" cy="-3" r="8" fill="white" />
        </g>

        {/* Labels */}
        <text x="85" y="95" fontSize="9" fill="#166534" fontWeight="600" opacity="0.7">Forest</text>
        <text x="360" y="115" fontSize="9" fill="#92400e" fontWeight="600" opacity="0.7">Urban</text>
        <text x="90" y="312" fontSize="9" fill="#1e40af" fontWeight="600" opacity="0.7">Water</text>
        <text x="350" y="305" fontSize="9" fill="#991b1b" fontWeight="600" opacity="0.7">Agriculture</text>
        <text x="375" y="145" fontSize="9" fill="#155e75" fontWeight="600" opacity="0.7">Wetland</text>

        {/* Scale bar */}
        <rect x="350" y="355" width="80" height="4" rx="2" fill="#334155" opacity="0.5" />
        <text x="365" y="350" fontSize="8" fill="#64748b">5 km</text>

        {/* North arrow */}
        <g transform="translate(80, 340)">
          <line x1="0" y1="15" x2="0" y2="-15" stroke="#334155" strokeWidth="1.5" opacity="0.5" />
          <polygon points="0,-18 -4,-10 4,-10" fill="#334155" opacity="0.5" />
          <text x="5" y="-12" fontSize="8" fill="#64748b">N</text>
        </g>
      </svg>

      {/* Floating cards */}
      <motion.div
        animate={{ y: [0, -8, 0], x: [0, 4, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        className="absolute top-4 right-4 glass-card rounded-xl px-3 py-2 shadow-lg"
      >
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-emerald-100 flex items-center justify-center">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <span className="text-xs font-medium text-slate-700">Soil Map Ready</span>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, -10, 0], x: [0, -4, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute bottom-12 left-0 glass-card rounded-xl px-3 py-2 shadow-lg"
      >
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-blue-100 flex items-center justify-center">
            <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <span className="text-xs font-medium text-slate-700">CN: 72.4</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen topo-bg">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Gradient orbs */}
        <div className="absolute top-20 -left-40 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Text */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 mb-6">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-xs font-medium text-blue-700">GIS Made Simple</span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-4">
                <span className="gradient-text">Easy-GIS</span>
              </h1>

              <h2 className="text-xl sm:text-2xl font-medium text-slate-600 mb-4">
                A Beginner Friendly Alternative to QGIS
              </h2>

              <p className="text-base text-slate-500 leading-relaxed mb-8 max-w-lg">
                Generate Soil Maps, LULC Maps, Curve Number Maps, Hydrographs and Watershed Analysis
                with just a few clicks. No installation. No learning curve.
              </p>

              <div className="flex flex-wrap gap-4 mb-10">
                <Link
                  to="/dashboard"
                  className="btn-gradient text-white px-7 py-3.5 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-lg shadow-blue-500/25"
                >
                  Get Started <ArrowRight className="w-4 h-4" />
                </Link>
                <button className="flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all">
                  <Play className="w-4 h-4" /> Watch Demo
                </button>
              </div>

              {/* Highlights */}
              <div className="grid grid-cols-2 gap-2">
                {highlights.map((h) => (
                  <div key={h} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span className="text-xs text-slate-600">{h}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right - Illustration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <GISIllustration />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-3">
              Powerful GIS Tools
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              Six specialized tools for hydrology and watershed analysis — designed for simplicity and speed.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Link
                    to={f.path}
                    className="block glass-card rounded-2xl overflow-hidden card-lift glow-border group h-full"
                  >
                    {/* Preview area */}
                    <div
                      className="h-40 flex items-center justify-center relative overflow-hidden"
                      style={{ background: f.preview }}
                    >
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${f.color} ${f.shadowColor} shadow-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      {/* Decorative contour lines */}
                      <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 300 160">
                        <ellipse cx="150" cy="80" rx="120" ry="60" fill="none" stroke="currentColor" strokeWidth="0.8" />
                        <ellipse cx="150" cy="80" rx="80" ry="40" fill="none" stroke="currentColor" strokeWidth="0.8" />
                        <ellipse cx="150" cy="80" rx="40" ry="20" fill="none" stroke="currentColor" strokeWidth="0.8" />
                      </svg>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="font-bold text-slate-800 mb-1.5 flex items-center gap-2">
                        {f.title}
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                      </h3>
                      <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
                      <button className="mt-4 text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 transition">
                        Open Tool <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 p-10 sm:p-14 text-center relative overflow-hidden"
          >
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <svg viewBox="0 0 800 300" className="w-full h-full">
                <ellipse cx="400" cy="150" rx="350" ry="120" fill="none" stroke="white" strokeWidth="1" />
                <ellipse cx="400" cy="150" rx="250" ry="85" fill="none" stroke="white" strokeWidth="1" />
                <ellipse cx="400" cy="150" rx="150" ry="50" fill="none" stroke="white" strokeWidth="1" />
              </svg>
            </div>

            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-6">
                <Map className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to Simplify Your GIS Work?
              </h2>
              <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">
                Start generating professional maps in minutes. No downloads, no setup, no expertise required.
              </p>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-sm hover:bg-blue-50 hover:shadow-xl transition-all shadow-lg"
              >
                Get Started Free <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-white/60 backdrop-blur-sm relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                <Map className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-bold text-slate-800">Easy-GIS</p>
                <p className="text-xs text-slate-500">Beginner Friendly GIS Platform</p>
              </div>
            </div>
            <p className="text-sm text-slate-500 text-center">
              Developed for Hydrology and Watershed Analysis
            </p>
            <p className="text-xs text-slate-400">
              &copy; {new Date().getFullYear()} Easy-GIS. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}