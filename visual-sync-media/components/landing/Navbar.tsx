'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const Navbar: React.FC = () => {
  const pathname = usePathname();

  if (pathname === '/') {
    return null;
  }

  return (
    <nav className="absolute top-0 w-full z-50 h-10 flex justify-center items-center px-4">
      {/* Tiny spaced branding - Always White */}
      <Link
        href="/"
        className="text-[12px] font-bold uppercase tracking-[0.5em] select-none hover:opacity-80 transition-opacity text-white"
      >
        v i s u a l s y n c &nbsp; m e d i a
      </Link>
    </nav>
  );
};
