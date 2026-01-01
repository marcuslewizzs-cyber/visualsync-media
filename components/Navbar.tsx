import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/portfolio', label: 'Portfolio' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <>
      <nav
        className="absolute top-0 w-full z-50 h-10 flex justify-between md:justify-center items-center px-4"
      >
        {/* Mobile Hamburger Trigger (Left side) */}
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="md:hidden p-1 hover:opacity-70 transition-opacity focus:outline-none mix-blend-difference text-white"
          aria-label="Open Menu"
        >
          <Menu size={20} />
        </button>

        {/* Tiny spaced branding - Always Red */}
        <Link to="/" className="text-[12px] font-bold uppercase tracking-[0.5em] select-none hover:opacity-80 transition-opacity" style={{ color: '#ffffffff' }}>
          v i s u a l s y n c &nbsp; m e d i a
        </Link>

        {/* Placeholder for right balance on mobile */}
        <div className="w-5 md:hidden"></div>
      </nav>

      {/* Mobile Sidebar Menu */}
      <div
        className={`fixed inset-0 z-[60] transform transition-transform duration-500 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:hidden`}
      >
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img src="/images/bg wall white.jpeg" alt="" className="w-full h-full object-cover" />
        </div>

        <div className="relative z-10 flex flex-col h-full">
          {/* Close Button */}
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute top-4 right-4 p-2 bg-vs-black text-white rounded-full hover:bg-vs-red transition-colors"
          >
            <X size={24} />
          </button>

          {/* Menu Content */}
          <div className="flex flex-col justify-center items-center h-full space-y-6 p-8">
            <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Navigation</div>

            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`font-display text-5xl uppercase transition-colors ${location.pathname === link.to ? 'text-vs-red' : 'text-vs-black hover:text-vs-red'}`}
              >
                {link.label}
              </Link>
            ))}

            <div className="w-12 h-1 bg-vs-black my-6"></div>

            <Link to="/contact" className="font-bold uppercase tracking-widest text-sm text-vs-black hover:text-vs-red transition-colors">Get In Touch</Link>
          </div>

          {/* Footer of Sidebar */}
          <div className="relative overflow-hidden text-white p-4 text-center text-[10px] uppercase tracking-widest">
            <div className="absolute inset-0 z-0">
              <img src="/images/Bg Wall.jpeg" alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-vs-black/80"></div>
            </div>
            <span className="relative z-10">VisualSync Media Platform v2.0</span>
          </div>
        </div>
      </div>
    </>
  );
};