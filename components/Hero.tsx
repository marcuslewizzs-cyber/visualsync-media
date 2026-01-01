import React from 'react';
import { Link } from 'react-router-dom';

export const Hero: React.FC = () => {
    const scrollToSection = (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        } else {
            console.warn(`Element with id ${id} not found`);
        }
    };

    return (
        <>
            {/* 
        The "Obscure Navbar" / Header Block.
      */}
            <header className="relative w-full flex flex-col overflow-hidden border-b-4 border-vs-black">

                {/* Layer 0: Background Image */}
                <div className="absolute inset-0 z-0">
                    <img src="/images/banner.png"
                        className="w-full h-full object-cover"
                        alt="Hero Model" />
                </div>

                {/* Layer 1: Glass Overlay */}
                <div className="absolute inset-0 z-10 backdrop-blur-[5px] bg-white/40"></div>

                {/* Layer 2: The Structure Grid */}
                <div className="relative z-30 flex flex-col w-full px-4 pt-4 md:px-6 md:pt-6">

                    {/* Top Row: HUGE MENU & Vertical JOIN List */}
                    <div className="flex justify-between items-start leading-none relative z-20">
                        <div className="cursor-pointer group">
                            <h1 className="font-display text-[18vw] leading-[0.75] tracking-tighter text-vs-red group-hover:text-vs-black transition-colors duration-300">
                                VSM
                            </h1>
                        </div>

                        <div className="flex flex-col items-end z-40 pt-2 gap-y-4">
                            <Link
                                to="/contact"
                                className="font-display text-[2.5vw] md:text-[3vw] leading-none tracking-tighter text-vs-black hover:text-vs-red transition-colors duration-300 text-right uppercase"
                            >
                                GET IN TOUCH
                            </Link>
                        </div>
                    </div>


                    {/* Bottom Row: Navigation Categories */}
                    <div className="relative z-50 flex flex-wrap justify-between items-end mt-4 pt-3 pb-4 gap-x-4">
                        <a href="#projects" onClick={(e) => scrollToSection(e, 'projects')} className="cursor-pointer font-display text-xs md:text-sm uppercase tracking-wider hover:text-vs-red transition-colors mb-2 md:mb-0">
                            Projects
                        </a>
                        <Link to="/about" className="cursor-pointer font-display text-xs md:text-sm uppercase tracking-wider hover:text-vs-red transition-colors mb-2 md:mb-0">
                            About
                        </Link>
                        <a href="#equipment" onClick={(e) => scrollToSection(e, 'equipment')} className="cursor-pointer font-display text-xs md:text-sm uppercase tracking-wider hover:text-vs-red transition-colors mb-2 md:mb-0">
                            Equipment
                        </a>
                        <Link to="/contact" className="cursor-pointer font-display text-xs md:text-sm uppercase tracking-wider hover:text-vs-red transition-colors mb-2 md:mb-0">
                            Bundles
                        </Link>
                    </div>
                </div>
            </header>
        </>
    );
};