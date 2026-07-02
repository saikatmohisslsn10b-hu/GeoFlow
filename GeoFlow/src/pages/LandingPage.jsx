import { useRef, useEffect } from 'react';
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

// Smooth Scroll Handler Function (for Hero "Get Started" button)
const scrollToFeatures = (e) => {
  e.preventDefault();
  const featuresSection = document.getElementById('features');
  if (featuresSection) {
    featuresSection.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
};

// Video Showcase Component with 3D Effects (BIGGER SIZE)
function VideoShowcase() {
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

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.2 }}
      className="relative w-full max-w-4xl mx-auto"
      style={{ perspective: '1200px' }}
    >
      {/* Browser Window Frame - LARGER SIZE */}
      <div className="rounded-3xl shadow-video border-2 border-white/60 overflow-hidden bg-white backdrop-blur-sm"
        style={{
          boxShadow: '0 25px 50px -12px rgba(59, 130, 246, 0.25), 0 12px 24px -8px rgba(0, 0, 0, 0.1)',
          transformStyle: 'preserve-3d',
          animation: 'float3D 6s ease-in-out infinite'
        }}
      >
        {/* Top browser bar */}
        <div className="h-11 bg-gradient-to-r from-slate-100 to-slate-50 flex items-center px-5 gap-2.5 border-b border-slate-200">
          <div className="w-3.5 h-3.5 rounded-full bg-red-400 shadow-sm"></div>
          <div className="w-3.5 h-3.5 rounded-full bg-yellow-400 shadow-sm"></div>
          <div className="w-3.5 h-3.5 rounded-full bg-green-400 shadow-sm"></div>
          <div className="flex-1 h-6 bg-white rounded-lg ml-5 border border-slate-200 flex items-center px-3 shadow-inner">
            <span className="text-xs text-slate-400 font-medium">app.geoflow.com</span>
          </div>
        </div>
        
        {/* Video Container */}
        <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 relative overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/video.mp4" type="video/mp4" />
          </video>
          
          {/* Decorative overlay pattern */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <svg viewBox="0 0 400 225" className="w-full h-full">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
        </div>

        {/* Bottom status bar */}
        <div className="h-14 bg-gradient-to-r from-slate-50 to-slate-100 flex items-center justify-between px-5 border-t border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            <span className="text-xs font-semibold text-slate-600">Ready to Process</span>
          </div>
          <div className="flex gap-1.5">
            <div className="w-8 h-1.5 rounded-full bg-blue-400"></div>
            <div className="w-8 h-1.5 rounded-full bg-cyan-400"></div>
            <div className="w-8 h-1.5 rounded-full bg-indigo-400"></div>
          </div>
        </div>
      </div>

      {/* Floating decorative elements */}
      <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-2xl blur-xl pointer-events-none"></div>
      <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-2xl blur-xl pointer-events-none"></div>

      <style>{`
        @keyframes float3D {
          0%, 100% { transform: translateY(0) rotateX(2deg) rotateY(0deg); }
          50% { transform: translateY(-20px) rotateX(-2deg) rotateY(5deg); }
        }
      `}</style>
    </motion.div>
  );
}

export default function LandingPage() {
  return (
    <div 
      className="min-h-screen relative overflow-x-hidden"
      style={{
        background: 'linear-gradient(to bottom right, #f8fafc, #eff6ff, #ecfeff)',
        backgroundImage: `
          radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.08) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(6, 182, 212, 0.08) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(139, 92, 246, 0.05) 0%, transparent 50%)
        `,
        scrollBehavior: 'smooth'
      }}
    >
      
      {/* Background Decorative Elements - LIGHT MODE BLUE SHADES */}
      <div className="fixed top-20 -left-40 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-200/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Main Content Wrapper */}
      <div className="relative z-10">
        
        {/* Hero Section with 3D Animations from LEFT */}
        <section id="top" className="relative pt-32 pb-20 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              
              {/* Left - Text Content with SLIDE FROM LEFT Animation */}
              <motion.div
                initial={{ opacity: 0, x: -100, rotateY: -15, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, rotateY: 0, scale: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
                style={{ perspective: '1200px' }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 border border-blue-200 mb-6 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                  <span className="text-xs font-semibold text-blue-700">GIS Made Simple</span>
                </div>

                <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tight mb-4">
                  <span 
                    className="gradient-text"
                    style={{
                      background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 50%, #8b5cf6 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}
                  >GeoFlow</span>
                </h1>

                <motion.h2 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-2xl sm:text-3xl font-bold text-slate-800 mb-4"
                >
                  A Beginner Friendly Alternative to QGIS
                </motion.h2>

                <motion.p 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="text-lg text-slate-600 leading-relaxed mb-8 max-w-lg"
                >
                  Generate Soil Maps, LULC Maps, Curve Number Maps, Hydrographs and Watershed Analysis
                  with just a few clicks. No installation. No learning curve.
                </motion.p>

                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="flex flex-wrap gap-4 mb-10"
                >
                  {/* Get Started Button - WITH SMOOTH SCROLLING TO #features */}
                  <button
                    onClick={scrollToFeatures}
                    className="text-white px-8 py-4 rounded-xl text-base font-bold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                    style={{
                      background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                      boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.4)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    Get Started <ArrowRight className="w-4 h-4" />
                  </button>
                  <a
                    href="https://www.youtube.com/watch?v=Z67MyzJbkdU"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold text-slate-700 bg-white border-2 border-slate-200 hover:border-blue-300 hover:bg-blue-50 hover:shadow-md transition-all"
                  >
                    <Play className="w-4 h-4" /> Watch Demo
                  </a>
                </motion.div>

                {/* Highlights Grid with Staggered Animation from Left */}
                <div className="grid grid-cols-2 gap-3">
                  {highlights.map((h, index) => (
                    <motion.div
                      key={h}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.5 + index * 0.05 }}
                      className="flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span className="text-sm text-slate-700 font-medium">{h}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Right - Video Showcase (BIGGER SIZE + 3D Effects) */}
              <VideoShowcase />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 relative z-10 scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl sm:text-5xl font-black text-slate-800 mb-4 tracking-tight">
                Powerful GIS Tools
              </h2>
              <p className="text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed">
                Six specialized tools for hydrology and watershed analysis — designed for simplicity and speed.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((f, i) => {
                const Icon = f.icon;
                return (
                  <motion.div
                    key={f.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    style={{ perspective: '1200px' }}
                  >
                    <Link
                      to={f.path}
                      className="block rounded-3xl overflow-hidden group h-full transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02]"
                      style={{
                        background: 'rgba(255, 255, 255, 0.7)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(226, 232, 240, 0.5)',
                        boxShadow: '0 20px 40px -10px rgba(59, 130, 246, 0.15)',
                        transformStyle: 'preserve-3d'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateZ(30px) rotateX(5deg) rotateY(-5deg)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
                      }}
                    >
                      {/* Preview area */}
                      <div
                        className="h-48 flex items-center justify-center relative overflow-hidden"
                        style={{ background: f.preview }}
                      >
                        <div 
                          className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${f.color} ${f.shadowColor} shadow-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-6`}
                        >
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 300 160">
                          <ellipse cx="150" cy="80" rx="120" ry="60" fill="none" stroke="currentColor" strokeWidth="1" />
                          <ellipse cx="150" cy="80" rx="80" ry="40" fill="none" stroke="currentColor" strokeWidth="1" />
                          <ellipse cx="150" cy="80" rx="40" ry="20" fill="none" stroke="currentColor" strokeWidth="1" />
                        </svg>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <h3 className="font-bold text-xl text-slate-800 mb-2 flex items-center gap-2">
                          {f.title}
                          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                        </h3>
                        <p className="text-sm text-slate-600 leading-relaxed mb-4">{f.desc}</p>
                        <button className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-2 transition-all">
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
        <section id="documentation" className="py-24 relative z-10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-[2rem] p-12 sm:p-16 text-center relative overflow-hidden shadow-2xl"
              style={{
                background: 'linear-gradient(to bottom right, #2563eb, #3b82f6, #06b6d4)',
                boxShadow: '0 25px 50px -12px rgba(37, 99, 235, 0.3)'
              }}
            >
              <div className="absolute top-0 left-0 w-full h-full opacity-10">
                <svg viewBox="0 0 800 350" className="w-full h-full">
                  <ellipse cx="400" cy="175" rx="380" ry="140" fill="none" stroke="white" strokeWidth="1.5" />
                  <ellipse cx="400" cy="175" rx="280" ry="100" fill="none" stroke="white" strokeWidth="1.5" />
                  <ellipse cx="400" cy="175" rx="180" ry="60" fill="none" stroke="white" strokeWidth="1.5" />
                </svg>
              </div>

              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Map className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 tracking-tight">
                  Ready to Simplify Your GIS Work?
                </h2>
                <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto leading-relaxed">
                  Start generating professional maps in minutes. No downloads, no setup, no expertise required.
                </p>
                
                {/* ✅ UPDATED: Get Started Button - NOW LINKS TO YOUTUBE */}
                <a
                  href="https://www.youtube.com/watch?v=XVzQnnKbI08&list=PLZWgj2-5KcSU"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white text-blue-600 px-10 py-4 rounded-xl font-black text-base transition-all shadow-lg hover:-translate-y-1 cursor-pointer duration-300"
                  style={{ boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#eff6ff';
                    e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(30, 58, 138, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'white';
                    e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                  }}
                >
                  Get Started <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-200 bg-white/70 backdrop-blur-md relative z-10 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
                  style={{
                    background: 'linear-gradient(to bottom right, #3b82f6, #1d4ed8)',
                    boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.3)'
                  }}
                >
                  <Map className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-black text-slate-800 text-lg">GeoFlow</p>
                  <p className="text-xs text-slate-500 font-medium">Beginner Friendly GIS Platform</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 font-medium text-center">
                Developed for Hydrology and Watershed Analysis
              </p>
              <p className="text-xs text-slate-400">
                © {new Date().getFullYear()} GeoFlow. All rights reserved.
              </p>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}