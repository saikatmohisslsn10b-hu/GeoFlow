import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Map, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('top');
  const location = useLocation();
  const navigate = useNavigate();
  const isLanding = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);

      if (isLanding) {
        const featuresEl = document.getElementById('features');
        const docEl = document.getElementById('documentation');

        let current = 'top';

        if (docEl) {
          const docRect = docEl.getBoundingClientRect();
          if (docRect.top <= window.innerHeight * 0.4) current = 'documentation';
        }

        if (current === 'top' && featuresEl) {
          const featuresRect = featuresEl.getBoundingClientRect();
          if (featuresRect.top <= window.innerHeight * 0.4) current = 'features';
        }

        setActiveSection(current);
      }
    };

    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [isLanding]);

  useEffect(() => {
    if (isLanding && location.hash) {
      const timer = setTimeout(() => {
        const id = location.hash.replace('#', '');
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isLanding, location.hash]);

  const navLinks = [
    { label: 'Home', path: '/', section: 'top' },
    { label: 'Features', path: '/#features', section: 'features' },
    { label: 'Documentation', path: '/#documentation', section: 'documentation' },
  ];

  const isActive = (link) => {
    if (!isLanding) return false;
    return activeSection === link.section;
  };

  const handleNavClick = (e, link) => {
    e.preventDefault();
    setMobileOpen(false);

    if (link.section === 'top') {
      if (isLanding) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        navigate('/', { replace: true });
      } else {
        navigate('/');
      }
    } else {
      const sectionId = link.section;
      if (isLanding) {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        navigate(`/#${sectionId}`, { replace: true });
      } else {
        navigate(`/#${sectionId}`);
      }
    }
  };

  const handleGetStartedClick = (e) => {
    e.preventDefault();
    setMobileOpen(false);

    if (isLanding) {
      const el = document.getElementById('features');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      navigate('/#features', { replace: true });
    } else {
      navigate('/#features');
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled || !isLanding ? 'navbar-scrolled' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" onClick={(e) => handleNavClick(e, { section: 'top' })} className="flex items-center gap-2.5 group cursor-pointer">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-shadow">
              <Map className="w-5 h-5 text-white" />
            </div>
            <span className={`text-xl font-bold tracking-tight transition-colors ${!scrolled && isLanding ? 'text-white' : 'text-slate-800'}`}>GeoFlow</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.label} to={link.path} onClick={(e) => handleNavClick(e, link)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${!scrolled && isLanding ? 'text-white/80 hover:text-white hover:bg-white/10' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'} ${isActive(link) ? (!scrolled && isLanding ? 'text-white bg-white/15' : 'text-blue-600 bg-blue-50') : ''}`}>
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <a href="/#features" onClick={handleGetStartedClick} className="btn-gradient text-white px-5 py-2.5 rounded-xl text-sm font-semibold cursor-pointer">Get Started</a>
          </div>

          <button onClick={() => setMobileOpen(!mobileOpen)} className={`md:hidden p-2 rounded-lg ${!scrolled && isLanding ? 'text-white' : 'text-slate-700'}`}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="md:hidden navbar-scrolled border-t border-slate-100">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link key={link.label} to={link.path} onClick={(e) => handleNavClick(e, link)} className={`block px-4 py-2.5 rounded-lg text-sm font-medium ${isActive(link) ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}>
                {link.label}
              </Link>
            ))}
            <a href="/#features" onClick={handleGetStartedClick} className="block btn-gradient text-white text-center px-4 py-2.5 rounded-xl text-sm font-semibold mt-2 cursor-pointer">Get Started</a>
          </div>
        </motion.div>
      )}
    </nav>
  );
}