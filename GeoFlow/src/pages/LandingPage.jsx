import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Waves, Satellite, Layers, BarChart3, GitBranch, Mountain, ArrowRight, Play, Map, ChevronRight, CheckCircle2 } from 'lucide-react';

const features = [
  { title: 'Hydrograph Map', icon: Waves, desc: 'Generate hydrographs from USGS station data.', path: '/tool/hydrograph', color: 'from-cyan-500 to-blue-500', preview: 'linear-gradient(135deg, #e0f2fe, #cffafe)' },
  { title: 'LULC Map', icon: Satellite, desc: 'Generate Land Use Land Cover maps from raster data.', path: '/tool/lulc-map', color: 'from-emerald-500 to-green-500', preview: 'linear-gradient(135deg, #d1fae5, #dcfce7)' },
  { title: 'Soil Map', icon: Layers, desc: 'Generate soil classification maps.', path: '/tool/soil-map', color: 'from-amber-500 to-orange-500', preview: 'linear-gradient(135deg, #fef3c7, #ffedd5)' },
  { title: 'Curve Number Map', icon: BarChart3, desc: 'Generate SCS Curve Number maps.', path: '/tool/curve-number-map', color: 'from-blue-500 to-indigo-500', preview: 'linear-gradient(135deg, #dbeafe, #e0e7ff)' },
  { title: 'Curve Number Sheds Map', icon: GitBranch, desc: 'Generate watershed and subwatershed CN maps.', path: '/tool/curve-number-sheds', color: 'from-violet-500 to-purple-500', preview: 'linear-gradient(135deg, #ede9fe, #f3e8ff)' },
  { title: 'Contour Map', icon: Mountain, desc: 'Generate contour maps for basin analysis.', path: '/tool/contour-map', color: 'from-rose-500 to-pink-500', preview: 'linear-gradient(135deg, #ffe4e6, #fce7f3)' },
];

const highlights = [
  { text: 'No GIS software installation needed', color: 'bg-cyan-500/90 border-cyan-300' },
  { text: 'Browser-based processing', color: 'bg-emerald-500/90 border-emerald-300' },
  { text: 'Beginner-friendly interface', color: 'bg-amber-500/90 border-amber-300' },
  { text: 'Professional-grade outputs', color: 'bg-violet-500/90 border-violet-300' },
  { text: 'One-click map generation', color: 'bg-rose-500/90 border-rose-300' },
  { text: 'Designed for researchers & students', color: 'bg-blue-500/90 border-blue-300' },
];

export default function LandingPage() {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const savedTime = localStorage.getItem('geoflow_video_time');
    if (savedTime) {
      video.currentTime = parseFloat(savedTime);
    }

    const saveTime = () => {
      if (video && !video.paused) {
        localStorage.setItem('geoflow_video_time', video.currentTime.toString());
      }
    };

    const interval = setInterval(saveTime, 1000);

    return () => {
      clearInterval(interval);
      if (video) saveTime();
    };
  }, []);

  const scrollToFeatures = (e) => {
    e.preventDefault();
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen relative topo-bg">

      <section id="top" className="relative overflow-hidden">
        <video ref={videoRef} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover z-0">
          <source src="/video.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 z-[1] bg-gradient-to-b from-blue-950/45 via-blue-900/25 to-white" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-40 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-600 shadow-lg shadow-blue-900/50 mb-6">
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              <span className="text-xs font-bold text-white tracking-wider">GIS MADE SIMPLE</span>
            </div>

            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tighter mb-4" style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.9))' }}>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-cyan-300">GeoFlow</span>
            </h1>

            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2" style={{ filter: 'drop-shadow(0 3px 10px rgba(0,0,0,0.9))' }}>
              A Beginner Friendly Alternative to QGIS
            </h2>
            

            <p className="text-lg text-white font-medium leading-relaxed max-w-2xl mx-auto mb-10" style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.9))' }}>
              Generate Soil Maps, LULC Maps, Curve Number Maps, Hydrographs and Watershed Analysis with just a few clicks. No installation. No learning curve.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <a href="#features" onClick={scrollToFeatures} className="px-8 py-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-500 shadow-[0_0_30px_rgba(59,130,246,0.6)] hover:shadow-[0_0_45px_rgba(59,130,246,0.8)] transition-all duration-300"><span className="flex items-center gap-2">Get Started <ArrowRight className="w-4 h-4" /></span></a>
              <a href="https://www.youtube.com/watch?v=XVzQnnKbI08&list=PLZWgj2-5KcSU" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-8 py-4 rounded-xl text-sm font-bold text-slate-900 bg-white hover:bg-slate-100 shadow-lg transition-all duration-300"><Play className="w-4 h-4" /> Watch Demo</a>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-3xl mx-auto">
              {highlights.map((h) => (
                <div key={h.text} className={`flex items-center gap-2 ${h.color} border px-3 py-2.5 rounded-lg shadow-lg`}>
                  <CheckCircle2 className="w-4 h-4 text-white flex-shrink-0" />
                  <span className="text-xs text-white font-bold">{h.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section id="features" className="py-24 relative z-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-slate-800 mb-4 tracking-tight">Powerful GIS Tools</h2>
            <p className="text-slate-500 max-w-xl mx-auto">Six specialized tools for hydrology and watershed analysis — designed for simplicity and speed.</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div key={f.title} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="group">
                  <Link to={f.path} className="block glass-card rounded-2xl overflow-hidden h-full transition-all duration-500 group-hover:border-blue-400/50 group-hover:shadow-[0_15px_40px_-10px_rgba(59,130,246,0.25)]">
                    <div className="h-48 flex items-center justify-center relative overflow-hidden" style={{ background: f.preview }}>
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${f.color} shadow-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 300 160">
                        <ellipse cx="150" cy="80" rx="120" ry="60" fill="none" stroke="currentColor" strokeWidth="0.8" />
                        <ellipse cx="150" cy="80" rx="80" ry="40" fill="none" stroke="currentColor" strokeWidth="0.8" />
                        <ellipse cx="150" cy="80" rx="40" ry="20" fill="none" stroke="currentColor" strokeWidth="0.8" />
                      </svg>
                    </div>
                    <div className="p-6">
                      <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">{f.title}<ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" /></h3>
                      <p className="text-sm text-slate-500 leading-relaxed mb-4">{f.desc}</p>
                      <div className="text-sm font-semibold text-blue-600 flex items-center gap-1.5">Open Tool <ArrowRight className="w-3.5 h-3.5" /></div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="documentation" className="py-24 relative z-10 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-3xl bg-gradient-to-br from-blue-600 to-cyan-500 p-12 sm:p-16 text-center relative overflow-hidden shadow-[0_20px_60px_-15px_rgba(59,130,246,0.35)]">
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <svg viewBox="0 0 800 300" className="w-full h-full">
                <ellipse cx="400" cy="150" rx="350" ry="120" fill="none" stroke="white" strokeWidth="1" />
                <ellipse cx="400" cy="150" rx="250" ry="85" fill="none" stroke="white" strokeWidth="1" />
                <ellipse cx="400" cy="150" rx="150" ry="50" fill="none" stroke="white" strokeWidth="1" />
              </svg>
            </div>
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-6 border border-white/30">
                <Map className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-4xl sm:text-5xl font-black text-white mb-4 tracking-tight">Ready to Simplify Your GIS Work?</h2>
              <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">Start generating professional maps in minutes. No downloads, no setup, no expertise required.</p>
              <a href="#features" onClick={scrollToFeatures} className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-sm hover:bg-blue-50 hover:shadow-xl transition-all shadow-lg">Get Started Free <ArrowRight className="w-4 h-4" /></a>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white relative z-10">
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
            <p className="text-sm text-slate-500 text-center">Developed for Hydrology and Watershed Analysis</p>
            <p className="text-xs text-slate-400">&copy; {new Date().getFullYear()} GeoFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}