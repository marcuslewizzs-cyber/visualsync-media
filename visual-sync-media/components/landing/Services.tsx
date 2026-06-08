'use client';

import { useState, useEffect } from 'react';
import { Play } from 'lucide-react';

type ServiceType = 'Talking Heads' | 'YouTube Intro' | 'Long Form' | 'Social';

interface ServiceContent {
    title: string;
    description: string;
    image: string;
    youtubeId: string;
    isShorts?: boolean;
}

const servicesData: Record<ServiceType, ServiceContent> = {
    'Talking Heads': {
        title: 'Talking Heads',
        description: 'Establish authority with premium talking head content.',
        image: 'https://img.youtube.com/vi/k0PiAlIeJWA/maxresdefault.jpg',
        youtubeId: 'k0PiAlIeJWA'
    },
    'YouTube Intro': {
        title: 'YouTube Intro',
        description: 'Cinematic visuals that match your sonic identity.',
        image: 'https://img.youtube.com/vi/39Xp0albsMY/maxresdefault.jpg',
        youtubeId: '39Xp0albsMY'
    },
    'Long Form': {
        title: 'Documentaries',
        description: 'Deep storytelling that resonates with your audience.',
        image: 'https://img.youtube.com/vi/8yV4j6-Ox6I/maxresdefault.jpg',
        youtubeId: '8yV4j6-Ox6I'
    },
    'Social': {
        title: 'Social Edits',
        description: 'Fast-paced edits designed to stop the scroll.',
        image: 'https://img.youtube.com/vi/f3jEEymB4M0/maxresdefault.jpg',
        youtubeId: 'f3jEEymB4M0'
    }
};

export const Services = () => {
    const [activeService, setActiveService] = useState<ServiceType>('Talking Heads');
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        setIsPlaying(false);
    }, [activeService]);

    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    return (
        <section id="services" className="w-full bg-white relative border-b-4 border-black">
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 3fr) minmax(0, 1fr)',
                height: '60vh',
                minHeight: '450px'
            }} className="w-full">

                {/* LEFT: 75% Full Bleed Content */}
                <div className="relative border-r-4 border-black bg-black group overflow-hidden">

                    {/* Poster Image */}
                    {!isPlaying && (
                        <div className="absolute inset-0 z-0">
                            <img
                                src={servicesData[activeService].image}
                                alt={servicesData[activeService].title}
                                className="w-full h-full object-cover opacity-90"
                            />
                        </div>
                    )}

                    {/* Video Player */}
                    {isPlaying && (
                        <div className="w-full h-full relative z-0 bg-black flex items-center justify-center">
                            <div className={servicesData[activeService].isShorts ? 'h-full aspect-[9/16]' : 'w-full h-full'}>
                                <iframe
                                    width="100%"
                                    height="100%"
                                    src={`https://www.youtube.com/embed/${servicesData[activeService].youtubeId}?autoplay=1&controls=1&rel=0&loop=1&playlist=${servicesData[activeService].youtubeId}`}
                                    title={servicesData[activeService].title}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="w-full h-full object-cover"
                                ></iframe>
                            </div>
                        </div>
                    )}

                    {/* Minimal Overlay */}
                    <div className={`absolute inset-0 transition-opacity duration-500 pointer-events-none z-10 ${isPlaying ? 'opacity-0' : 'opacity-100'} bg-black/20`}></div>

                    {!isPlaying && (
                        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none mix-blend-difference">
                            <div className="group cursor-pointer pointer-events-auto" onClick={togglePlay}>
                                <div className="w-20 h-20 rounded-full border border-white flex items-center justify-center transition-all duration-300 group-hover:bg-white group-hover:scale-110">
                                    <Play size={32} className="text-white group-hover:text-black fill-current ml-1" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Bottom Info */}
                    <div className={`absolute bottom-0 left-0 p-8 lg:p-12 max-w-2xl pointer-events-none text-white z-20 transition-opacity duration-500 ${isPlaying ? 'opacity-0' : 'opacity-100'}`}>
                        <span className="block text-[10px] uppercase tracking-[0.4em] mb-4 border-l-2 border-white pl-4 mix-blend-difference">
                            Collection
                        </span>
                        <h2 className="font-display text-6xl lg:text-8xl w-full uppercase leading-[0.85] tracking-tight mb-6 break-words mix-blend-difference">
                            {servicesData[activeService].title}
                        </h2>
                        <p className="font-body text-sm lg:text-base uppercase tracking-widest max-w-md leading-relaxed opacity-80 mix-blend-difference">
                            {servicesData[activeService].description}
                        </p>
                    </div>

                </div>

                {/* RIGHT: 25% Navigation Column */}
                <div className="relative overflow-hidden">

                    {/* Background Wallpaper */}
                    <div className="absolute inset-0 z-0">
                        <img
                            src="/images/bg wall white.jpeg"
                            className="w-full h-full object-cover"
                            alt=""
                        />
                    </div>

                    <div className="relative z-10 flex flex-col h-full">
                        {(Object.keys(servicesData) as ServiceType[]).map((item, index) => {
                            const isFirstItem = index === 0;

                            return (
                                <button
                                    key={item}
                                    onClick={() => setActiveService(item)}
                                    className={`
                                        w-full border-b border-black/20 last:border-b-0 px-6 py-4 lg:px-8
                                        flex flex-row items-center justify-between group transition-all duration-300 relative overflow-hidden
                                        ${!isFirstItem && activeService === item ? 'bg-white/60 backdrop-blur-md border-l-4 border-l-[#ff1a1a]' : ''}
                                        ${!isFirstItem && activeService !== item ? 'bg-transparent hover:bg-white/40' : ''}
                                        ${isFirstItem ? 'h-[15%] min-h-[100px] text-white' : 'flex-1'} 
                                    `}
                                >
                                    {/* First item dark background */}
                                    {isFirstItem && (
                                        <div className="absolute inset-0 z-0">
                                            <img src="/images/Bg Wall.jpeg" alt="" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/80"></div>
                                        </div>
                                    )}
                                    {/* Content */}
                                    <div className="relative z-10 w-full flex justify-between items-center">
                                        <span className={`font-mono text-xs opacity-0 transition-opacity ${activeService === item ? 'opacity-100 text-[#ff1a1a]' : 'group-hover:opacity-50'} ${isFirstItem ? 'text-[#ff1a1a]' : 'text-black'}`}>
                                            /
                                        </span>

                                        <div className="text-right">
                                            <span className={`font-display text-2xl lg:text-3xl uppercase leading-none block transition-colors ${activeService === item ? 'text-[#ff1a1a] scale-105 origin-right' : ''} ${isFirstItem ? 'text-white' : 'text-black group-hover:text-[#ff1a1a]'}`}>
                                                {item}
                                            </span>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};
