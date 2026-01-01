import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const location = useLocation();

  if (location.pathname === '/') {
    return null;
  }

  return (
    <nav
      className="absolute top-0 w-full z-50 h-10 flex justify-center items-center px-4"
    >
      {/* Tiny spaced branding - Always Red */}
      <Link to="/" className="text-[12px] font-bold uppercase tracking-[0.5em] select-none hover:opacity-80 transition-opacity" style={{ color: '#ffffffff' }}>
        v i s u a l s y n c &nbsp; m e d i a
      </Link>
    </nav>
  );
};