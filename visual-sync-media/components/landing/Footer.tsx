'use client';

import Link from 'next/link';

export const Footer = () => {
    return (
        <footer className="relative w-full flex flex-col overflow-hidden border-t-4 border-black pt-16 pb-8 px-4 md:px-8">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <img src="/images/banner.png"
                    className="w-full h-full object-cover"
                    alt="Footer Background" />
            </div>

            {/* Glass Overlay */}
            <div className="absolute inset-0 z-10 backdrop-blur-[5px] bg-white/40"></div>

            {/* Content Container */}
            <div className="relative z-20 flex flex-col w-full">
                <div className="flex flex-row justify-between items-end mb-12">
                    <div>
                        <Link href="/" className="block">
                            <h1 className="font-display text-[13vw] leading-none tracking-tighter select-none text-black hover:text-[#ff1a1a] transition-colors duration-500 cursor-pointer">
                                VSM
                            </h1>
                        </Link>
                    </div>
                    <div className="flex flex-col space-y-2 text-right pb-4">
                        <a href="https://www.facebook.com/share/1SkXM5T2EV/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="font-display text-lg md:text-3xl uppercase text-black hover:text-[#ff1a1a] hover:underline decoration-2 underline-offset-4 transition-colors">Facebook</a>
                        <a href="https://www.instagram.com/visualsyncmedia?igsh=aGJ5NWlnbDV4angx" target="_blank" rel="noopener noreferrer" className="font-display text-lg md:text-3xl uppercase text-black hover:text-[#ff1a1a] hover:underline decoration-2 underline-offset-4 transition-colors">Instagram</a>
                        <a href="https://x.com/visualsyncsa" target="_blank" rel="noopener noreferrer" className="font-display text-lg md:text-3xl uppercase text-black hover:text-[#ff1a1a] hover:underline decoration-2 underline-offset-4 transition-colors">Twitter / X</a>
                        <a href="https://www.linkedin.com/company/visualsyncmedia/" target="_blank" rel="noopener noreferrer" className="font-display text-lg md:text-3xl uppercase text-black hover:text-[#ff1a1a] hover:underline decoration-2 underline-offset-4 transition-colors">LinkedIn</a>
                    </div>
                </div>

                <div className="border-t border-black/20 pt-8 flex flex-col md:flex-row justify-between text-xs font-bold uppercase tracking-widest text-black/70">
                    <div className="space-x-6 mb-4 md:mb-0">
                        <Link href="/" className="hover:text-black transition-colors">Home</Link>
                        <Link href="/about" className="hover:text-black transition-colors">About</Link>
                        <Link href="/contact" className="hover:text-black transition-colors">Contact</Link>
                    </div>
                    <div>
                        &copy; 2025 VisualSync Media. All Rights Reserved.
                    </div>
                </div>
            </div>
        </footer>
    );
};
