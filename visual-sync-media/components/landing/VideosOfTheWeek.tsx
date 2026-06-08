'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X, Flame, ChevronDown } from 'lucide-react';

/**
 * VideosOfTheMonth Component
 * --------------------------
 * Displays the client's latest edited videos of the month in a horizontal grid.
 * Clicking a video triggers a fullscreen takeover that plays the video.
 * When the video ends (detected via YouTube IFrame API), the overlay auto-closes
 * and returns the user to the page.
 */

interface WeeklyVideo {
    id: string;
    title: string;
    youtubeId: string;
    thumbnail: string;
    category?: string;
}

// --- Monthly videos data (update these each month) ---
const weeklyVideos: WeeklyVideo[] = [
    {
        id: 'wv1',
        title: 'The Matrix Edit',
        youtubeId: 'gEGD3rj2uGQ',
        thumbnail: 'https://img.youtube.com/vi/gEGD3rj2uGQ/maxresdefault.jpg',
        category: 'Cinematic Edit',
    },
    {
        id: 'wv2',
        title: 'The Amazing Spiderman Edit',
        youtubeId: 'R302_wJ7R2A',
        thumbnail: 'https://img.youtube.com/vi/R302_wJ7R2A/maxresdefault.jpg',
        category: 'Cinematic Edit',
    },
    {
        id: 'wv3',
        title: 'Travel Boss Ad',
        youtubeId: '4zztB6oQi2c',
        thumbnail: 'https://img.youtube.com/vi/4zztB6oQi2c/maxresdefault.jpg',
        category: 'Featured Edit',
    },
];

// Load the YouTube IFrame API script once globally
let ytApiLoaded = false;
let ytApiPromise: Promise<void> | null = null;

function loadYTApi(): Promise<void> {
    if (ytApiLoaded) return Promise.resolve();
    if (ytApiPromise) return ytApiPromise;

    ytApiPromise = new Promise<void>((resolve) => {
        // If already present
        if ((window as any).YT && (window as any).YT.Player) {
            ytApiLoaded = true;
            resolve();
            return;
        }

        const existingCallback = (window as any).onYouTubeIframeAPIReady;
        (window as any).onYouTubeIframeAPIReady = () => {
            ytApiLoaded = true;
            if (existingCallback) existingCallback();
            resolve();
        };

        // Only add script tag if not already present
        if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            document.head.appendChild(tag);
        }
    });

    return ytApiPromise;
}

export const VideosOfTheWeek: React.FC = () => {
    const [activeVideo, setActiveVideo] = useState<WeeklyVideo | null>(null);
    const [hoveredId, setHoveredId] = useState<string | null>(null);
    const [mobileExpanded, setMobileExpanded] = useState(false);
    const playerRef = useRef<any>(null);
    const playerContainerRef = useRef<HTMLDivElement>(null);

    // Lock body scroll when fullscreen overlay is open
    useEffect(() => {
        if (activeVideo) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [activeVideo]);

    // Initialize YouTube player when a video is selected
    useEffect(() => {
        if (!activeVideo) {
            // Destroy player on close
            if (playerRef.current) {
                try { playerRef.current.destroy(); } catch (_) { }
                playerRef.current = null;
            }
            return;
        }

        let cancelled = false;

        loadYTApi().then(() => {
            if (cancelled || !playerContainerRef.current) return;

            playerRef.current = new (window as any).YT.Player(playerContainerRef.current, {
                videoId: activeVideo.youtubeId,
                width: '100%',
                height: '100%',
                playerVars: {
                    autoplay: 1,
                    controls: 1,
                    rel: 0,
                    modestbranding: 1,
                    fs: 0, // we handle our own fullscreen
                },
                events: {
                    onStateChange: (event: any) => {
                        // YT.PlayerState.ENDED === 0
                        if (event.data === 0) {
                            // Video ended — auto-close overlay
                            setActiveVideo(null);
                        }
                    },
                },
            });
        });

        return () => {
            cancelled = true;
        };
    }, [activeVideo]);

    const handleClose = useCallback(() => {
        setActiveVideo(null);
    }, []);

    return (
        <section
            id="videos-of-the-month"
            className="w-full bg-vs-black relative overflow-hidden border-b-4 border-vs-black"
        >
            {/* --- Section Header Bar (tappable on mobile to toggle) --- */}
            <button
                type="button"
                onClick={() => setMobileExpanded(!mobileExpanded)}
                className="w-full flex items-center justify-between px-4 md:px-8 py-5 border-b border-white/10 md:cursor-default cursor-pointer group"
            >
                <div className="flex items-center gap-3">
                    <Flame size={18} className="text-vs-red" />
                    <span className="font-mono text-[10px] md:text-xs uppercase tracking-[0.35em] text-white/70">
                        Videos of the Month
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-white/30">
                        Latest Edits
                    </span>
                    <ChevronDown
                        size={16}
                        className={`text-white/40 transition-transform duration-300 md:hidden ${
                            mobileExpanded ? 'rotate-180' : ''
                        }`}
                    />
                </div>
            </button>

            {/* --- Collapsible content: collapses on mobile, always visible on desktop --- */}
            <div
                className={`transition-all duration-400 ease-in-out overflow-hidden md:max-h-none md:opacity-100 ${
                    mobileExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0 md:max-h-none md:opacity-100'
                }`}
            >

            {/* --- Title Row --- */}
            <div className="px-4 md:px-8 pt-8 pb-4">
                <h2 className="font-display text-5xl md:text-7xl lg:text-8xl uppercase leading-[0.85] tracking-tight text-white">
                    This Month's
                    <span className="text-vs-red"> Edits</span>
                </h2>
                <p className="font-body text-sm md:text-base text-white/50 mt-4 max-w-xl uppercase tracking-wider">
                    Fresh from the timeline — our latest video edits, delivered this month.
                </p>
            </div>

            {/* --- Video Grid --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-white/10">
                {weeklyVideos.map((video, index) => (
                    <motion.div
                        key={video.id}
                        className={`relative group cursor-pointer overflow-hidden aspect-video border-b md:border-b-0 ${index < weeklyVideos.length - 1 ? 'md:border-r' : ''
                            } border-white/10`}
                        onClick={() => setActiveVideo(video)}
                        onMouseEnter={() => setHoveredId(video.id)}
                        onMouseLeave={() => setHoveredId(null)}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.6, delay: index * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
                    >
                        {/* Thumbnail */}
                        <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />

                        {/* Dark Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500" />

                        {/* Hover Glow */}
                        <div className="absolute inset-0 bg-vs-red/0 group-hover:bg-vs-red/10 transition-colors duration-500" />

                        {/* Play Icon */}
                        <div className="absolute inset-0 flex items-center justify-center z-10">
                            <motion.div
                                className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-white/60 flex items-center justify-center backdrop-blur-sm bg-black/20 group-hover:bg-white group-hover:border-white transition-all duration-300"
                                animate={hoveredId === video.id ? { scale: 1.1 } : { scale: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Play
                                    size={28}
                                    className="text-white group-hover:text-vs-black fill-current ml-1 transition-colors duration-300"
                                />
                            </motion.div>
                        </div>

                        {/* Bottom Info */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 z-10">
                            {video.category && (
                                <span className="font-mono text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-vs-red mb-2 block">
                                    {video.category}
                                </span>
                            )}
                            <h3 className="font-display text-xl md:text-2xl lg:text-3xl uppercase leading-none text-white group-hover:text-vs-red transition-colors duration-300">
                                {video.title}
                            </h3>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* End collapsible wrapper */}
            </div>

            {/* --- Fullscreen Video Overlay --- */}
            <AnimatePresence>
                {activeVideo && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4, ease: 'easeInOut' }}
                        className="fixed inset-0 z-[9999] bg-black flex flex-col"
                    >
                        {/* Top Bar */}
                        <motion.div
                            className="flex items-center justify-between px-4 md:px-8 py-4 border-b border-white/10 bg-black/80 backdrop-blur-sm"
                            initial={{ y: -60, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -60, opacity: 0 }}
                            transition={{ delay: 0.15, duration: 0.4 }}
                        >
                            <div className="flex items-center gap-3">
                                <Flame size={14} className="text-vs-red" />
                                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/50">
                                    Now Playing
                                </span>
                                <span className="font-display text-sm md:text-base uppercase text-white ml-2">
                                    {activeVideo.title}
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={handleClose}
                                className="flex items-center gap-2 text-white/60 hover:text-vs-red transition-colors duration-300 group"
                            >
                                <span className="font-mono text-[10px] uppercase tracking-widest hidden md:inline group-hover:text-vs-red">
                                    Close
                                </span>
                                <X size={22} />
                            </button>
                        </motion.div>

                        {/* Player Area */}
                        <motion.div
                            className="flex-1 flex items-center justify-center p-0"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ delay: 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                        >
                            <div className="w-full h-full max-w-[100vw] max-h-[calc(100vh-60px)] aspect-video">
                                {/* YouTube IFrame API will mount here */}
                                <div
                                    ref={playerContainerRef}
                                    className="w-full h-full"
                                />
                            </div>
                        </motion.div>

                        {/* Red accent line at bottom */}
                        <motion.div
                            className="h-1 bg-vs-red w-full"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
                            style={{ transformOrigin: 'left' }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};
