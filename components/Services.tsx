import React, { useState, useEffect } from 'react';
import { Play } from 'lucide-react';

type ServiceType = 'Talking Heads' | 'Audio/Visual' | 'Long Form' | 'Social';

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
    'Audio/Visual': {
        title: 'Music Videos',
        description: 'Cinematic visuals that match your sonic identity.',
        image: 'https://img.youtube.com/vi/90Bkyn2zIf0/maxresdefault.jpg',
        youtubeId: '90Bkyn2zIf0'
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
        image: '/images/social.jpg',
        youtubeId: 'oPagDf0WPCg',
        isShorts: true
    }
};

export const Services: React.FC = () => {
    const [activeService, setActiveService] = useState<ServiceType>('Talking Heads');
    const [isPlaying, setIsPlaying] = useState(false);

    // Reset video state when switching services
    useEffect(() => {
        setIsPlaying(false);
    }, [activeService]);

    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    return (
        <section id="services" className="w-full bg-vs-white relative border-b-4 border-vs-black">
            {/* 
                Editorial Split Layout 
                Height: Fixed high viewport height ratio (approx 5:3 or 16:9 equivalent)
            */}
            <div className="flex flex-col md:flex-row h-[60vh] min-h-[450px]">

                {/* LEFT: 75-80% Full Bleed Content */}
                <div className="w-full md:w-[75%] h-full relative border-b-4 md:border-b-0 md:border-r-4 border-vs-black bg-black group overflow-hidden">

                    {/* Poster Image - Visible when video is loading or not playing/transparent */}
                    {!isPlaying && (
                        <div className="absolute inset-0 z-0">
                            <img
                                src={servicesData[activeService].image}
                                alt={servicesData[activeService].title}
                                className="w-full h-full object-cover opacity-90"
                            />

                        </div>
                    )}

                    {/* Video Player (YouTube) */}
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

                    {/* Minimal Overlay - Hidden when playing for pure visual */}
                    <div className={`absolute inset-0 transition-opacity duration-500 pointer-events-none z-10 ${isPlaying ? 'opacity-0' : 'opacity-100'} bg-black/20`}></div>

                    {!isPlaying && (
                        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none mix-blend-difference">
                            {/* Ultra minimal play indication */}
                            <div className="group cursor-pointer pointer-events-auto" onClick={togglePlay}>
                                <div className="w-20 h-20 rounded-full border border-white flex items-center justify-center transition-all duration-300 group-hover:bg-white group-hover:scale-110">
                                    <Play size={32} className="text-white group-hover:text-black fill-current ml-1" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Bottom Info - Brutalist Plain Text */}
                    <div className={`absolute bottom-0 left-0 p-8 md:p-12 max-w-2xl pointer-events-none text-white z-20 transition-opacity duration-500 ${isPlaying ? 'opacity-0' : 'opacity-100'}`}>
                        <span className="block text-[10px] uppercase tracking-[0.4em] mb-4 border-l-2 border-white pl-4 mix-blend-difference">
                            Collection 0{Object.keys(servicesData).indexOf(activeService) + 1}
                        </span>
                        <h2 className="font-display text-6xl md:text-8xl w-full uppercase leading-[0.85] tracking-tight mb-6 break-words mix-blend-difference">
                            {servicesData[activeService].title}
                        </h2>
                        <p className="font-body text-sm md:text-base uppercase tracking-widest max-w-md leading-relaxed opacity-80 mix-blend-difference">
                            {servicesData[activeService].description}
                        </p>

                        {/* Credits for Social Edits */}
                        {activeService === 'Social' && (
                            <div className="mt-6 border-l-2 border-white pl-4">
                                <p className="font-display text-sm md:text-base uppercase leading-relaxed tracking-wider">
                                    Edited by Cait<br />
                                    <span className="text-[10px] font-bold tracking-widest block my-1 opacity-80">in Partnership with</span>
                                    <span className="font-bold text-lg md:text-xl">VisualSyncMedia</span>
                                </p>
                            </div>
                        )}
                    </div>

                </div>

                {/* RIGHT: 20-25% Navigation Column */}
                <div className="w-full md:w-[25%] h-full relative overflow-hidden">

                    {/* Background Wallpaper */}
                    <div className="absolute inset-0 z-0">
                        <img
                            src="/images/bg wall white.jpeg"
                            className="w-full h-full object-cover"
                            alt=""
                        />
                    </div>

                    <div className="relative z-10 flex flex-col h-full">
                        {/* 
                            List Items:
                            "Talking Heads" is smaller (explicitly requested).
                            Others fill the rest of the space equally.
                        */}
                        {(Object.keys(servicesData) as ServiceType[]).map((item, index) => {
                            // Condition for the different sizing
                            const isFirstItem = index === 0;

                            return (
                                <button
                                    key={item}
                                    onClick={() => setActiveService(item)}
                                    className={`
                                        w-full border-b border-black/20 last:border-b-0 px-6 py-4 md:px-8
                                        flex flex-row items-center justify-between group transition-all duration-300 relative overflow-hidden
                                        ${!isFirstItem && activeService === item ? 'bg-white/60 backdrop-blur-md border-l-4 border-l-vs-red' : ''}
                                        ${!isFirstItem && activeService !== item ? 'bg-transparent hover:bg-white/40' : ''}
                                        ${isFirstItem ? 'h-[15%] min-h-[100px] text-white' : 'flex-1'} 
                                    `}
                                >
                                    {/* First item dark background */}
                                    {isFirstItem && (
                                        <div className="absolute inset-0 z-0">
                                            <img src="/images/Bg Wall.jpeg" alt="" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-vs-black/80"></div>
                                        </div>
                                    )}
                                    {/* 
                                        Right-aligned content per request "numbered nav aligned to right edge"
                                    */}
                                    <div className="relative z-10 w-full flex justify-between items-center">
                                        {/* Number on the left */}
                                        <span className={`font-mono text-xs opacity-0 transition-opacity ${activeService === item ? 'opacity-100 text-vs-red' : 'group-hover:opacity-50'} ${isFirstItem ? 'text-vs-red' : 'text-vs-black'}`}>
                                            /
                                        </span>

                                        <div className="text-right">
                                            <div className={`font-mono text-[10px] mb-1 block ${activeService === item ? 'text-vs-red' : ''} ${isFirstItem ? 'text-gray-400' : 'text-gray-600'}`}>
                                                (0{index + 1})
                                            </div>
                                            <span className={`font-display text-2xl md:text-3xl uppercase leading-none block transition-colors ${activeService === item ? 'text-vs-red scale-105 origin-right' : ''} ${isFirstItem ? 'text-white' : 'text-vs-black group-hover:text-vs-red'}`}>
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