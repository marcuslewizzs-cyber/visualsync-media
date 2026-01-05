import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MuxVideo from '@mux/mux-video-react';
import { Camera, Zap, Mic, Monitor, ArrowUpRight, X } from 'lucide-react';
import DomeGallery from './DomeGallery';

const clients = [
  "Showmax", "Superpicks", "Youngins", "The Travel Boss", "GT Gaming Lounge", "The Strawhat Group", "PLUC", "Cash n Sport", "Trade House Media", "22Ours"
];

const equipmentTags = [
  "Cameras",
  "Lighting",
  "Graphic",
  "Audio",
  "Filtering",
  "Posting"
];

type ProjectType = 'mux' | 'youtube';

interface Project {
  id: number;
  title: string;
  image: string;
  type: ProjectType;
  videoId: string; // Mux Playback ID or YouTube Video ID
}

const extraProjects: Project[] = [
  { id: 1, title: "Selected Work 01", image: "https://img.youtube.com/vi/85jhMfTnctg/maxresdefault.jpg", type: 'youtube', videoId: "85jhMfTnctg" },
  { id: 2, title: "Selected Work 02", image: "https://img.youtube.com/vi/xuvjzed930E/maxresdefault.jpg", type: 'youtube', videoId: "xuvjzed930E" },
  { id: 3, title: "Selected Work 03", image: "https://img.youtube.com/vi/DNVoEj6-f90/maxresdefault.jpg", type: 'youtube', videoId: "DNVoEj6-f90" },
  { id: 4, title: "Selected Work 04", image: "https://img.youtube.com/vi/3n1fQV0ZoA4/maxresdefault.jpg", type: 'youtube', videoId: "3n1fQV0ZoA4" },
  { id: 5, title: "Selected Work 05", image: "https://img.youtube.com/vi/qfiR5PpvzeU/maxresdefault.jpg", type: 'youtube', videoId: "qfiR5PpvzeU" },
  { id: 6, title: "Selected Work 06", image: "https://img.youtube.com/vi/OCUpRtEZluE/maxresdefault.jpg", type: 'youtube', videoId: "OCUpRtEZluE" },
  { id: 7, title: "Selected Work 07", image: "https://img.youtube.com/vi/JK-fe6fww88/maxresdefault.jpg", type: 'youtube', videoId: "JK-fe6fww88" },
  { id: 8, title: "Selected Work 08", image: "https://img.youtube.com/vi/1IxJG1Sb6Vo/maxresdefault.jpg", type: 'youtube', videoId: "1IxJG1Sb6Vo" },
  { id: 9, title: "Selected Work 09", image: "https://img.youtube.com/vi/53dJLt93OGY/maxresdefault.jpg", type: 'youtube', videoId: "53dJLt93OGY" },
  { id: 10, title: "Selected Work 10", image: "https://img.youtube.com/vi/GnlZtqIhhiQ/maxresdefault.jpg", type: 'youtube', videoId: "GnlZtqIhhiQ" },
  { id: 11, title: "Selected Work 11", image: "https://img.youtube.com/vi/xE7HsNVsL8Q/maxresdefault.jpg", type: 'youtube', videoId: "xE7HsNVsL8Q" },
  { id: 12, title: "Selected Work 12", image: "https://img.youtube.com/vi/yL3Tozcs8xQ/maxresdefault.jpg", type: 'youtube', videoId: "yL3Tozcs8xQ" },
  { id: 13, title: "Selected Work 13", image: "https://img.youtube.com/vi/Hec00nMU2ww/maxresdefault.jpg", type: 'youtube', videoId: "Hec00nMU2ww" },
  { id: 14, title: "Selected Work 14", image: "https://img.youtube.com/vi/_rUohpsuWGU/maxresdefault.jpg", type: 'youtube', videoId: "_rUohpsuWGU" },
  { id: 15, title: "Selected Work 15", image: "https://img.youtube.com/vi/orFix7l7deg/maxresdefault.jpg", type: 'youtube', videoId: "orFix7l7deg" },
  { id: 16, title: "Selected Work 16", image: "https://img.youtube.com/vi/e1rzXwR-SNE/maxresdefault.jpg", type: 'youtube', videoId: "e1rzXwR-SNE" },
  { id: 17, title: "Selected Work 17", image: "https://img.youtube.com/vi/csG5igN55IY/maxresdefault.jpg", type: 'youtube', videoId: "csG5igN55IY" },
  { id: 18, title: "Selected Work 18", image: "https://img.youtube.com/vi/B_4MW_2HVz4/maxresdefault.jpg", type: 'youtube', videoId: "B_4MW_2HVz4" },
  { id: 19, title: "Selected Work 19", image: "https://img.youtube.com/vi/ytxEUIcqW6Y/maxresdefault.jpg", type: 'youtube', videoId: "ytxEUIcqW6Y" },

  { id: 22, title: "Talking Heads", image: "https://img.youtube.com/vi/k0PiAlIeJWA/maxresdefault.jpg", type: 'youtube', videoId: "k0PiAlIeJWA" },
  { id: 23, title: "Music Video", image: "https://img.youtube.com/vi/90Bkyn2zIf0/maxresdefault.jpg", type: 'youtube', videoId: "90Bkyn2zIf0" },
  { id: 24, title: "Documentary", image: "https://img.youtube.com/vi/8yV4j6-Ox6I/maxresdefault.jpg", type: 'youtube', videoId: "8yV4j6-Ox6I" },
  { id: 25, title: "Social Edit", image: "https://img.youtube.com/vi/oPagDf0WPCg/maxresdefault.jpg", type: 'youtube', videoId: "oPagDf0WPCg" }
];

export const Portfolio: React.FC = () => {
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  // Format for DomeGallery directly
  const domeImages = extraProjects.map(p => ({
    src: p.image,
    alt: p.title,
    ...p // Spread original data to access ID later
  }));

  return (
    <section id="portfolio" className="w-full bg-vs-white border-b-4 border-vs-black">

      {/* --- ROW 1: Full Width Header --- */}
      <div className="relative w-full h-[110px] md:h-[160px] border-b-4 border-vs-black overflow-hidden group">
        {/* Background Image - Full Bleed */}
        <div className="absolute inset-0">
          <img
            src="/images/Main.png"
            alt="Header Background"
            className="w-full h-full object-cover object-right opacity-100"
          />
        </div>

        <div className="relative z-10 w-full h-full flex items-center justify-between px-4 md:px-8">
          <div className="flex flex-col leading-none">
            <span className="font-display text-4xl md:text-6xl text-vs-black uppercase">
              Client
            </span>
            <span className="font-display text-4xl md:text-6xl text-vs-black uppercase md:-mt-1 mt-[4px] ml-8 md:ml-12">
              Roster
            </span>
          </div>
        </div>
      </div>

      {/* --- ROW 2: Split Columns (Experience & Equipment) --- */}
      <div className="flex flex-col md:flex-row w-full h-auto">

        {/* --- LEFT COLUMN (75%) - Experience --- */}
        <div className="w-full md:w-[75%] border-b-4 md:border-b-0 md:border-r-4 border-vs-black flex flex-col">
          <div id="experience" className="flex-1 p-8 md:p-12 border-b-4 md:border-b-0 border-vs-black flex flex-col justify-center relative min-h-[400px] overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
              <img src="/images/bg wall white.jpeg" alt="" className="w-full h-full object-cover" />
            </div>
            {/* Background Watermark/Graphic */}
            <div className="absolute top-4 right-4 opacity-5 pointer-events-none z-10">
              <h1 className="text-9xl font-display">05</h1>
            </div>

            <div className="max-w-4xl relative z-10">
              <h3 className="font-mono text-sm uppercase tracking-widest text-vs-red mb-4">
                Experience & Qualifications
              </h3>
              <p className="font-display text-3xl md:text-5xl uppercase leading-[0.9] text-vs-black mb-8">
                5+ Years of crafting visual narratives for the world's leading brands.
              </p>

              <div className="border-t-2 border-vs-black/10 pt-6">
                <h4 className="font-mono text-xs uppercase mb-4 text-gray-500">Trusted By</h4>
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  {clients.map((client, i) => (
                    <span key={i} className="font-display text-xl md:text-2xl uppercase text-vs-black/60 hover:text-vs-black transition-colors cursor-default">
                      {client}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- RIGHT COLUMN (25%) - Equipment --- */}
        <div id="equipment" className="w-full md:w-[25%] flex flex-col border-b-4 md:border-b-0 border-vs-black">
          <div className="relative overflow-hidden text-white h-[110px] md:h-[160px] flex flex-col justify-center border-b-4 border-vs-black">
            <div className="absolute inset-0 z-0">
              <img src="/images/Bg Wall.jpeg" alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-vs-black/80"></div>
            </div>
            <div className="relative z-10 p-6 md:p-8">
              <h2 className="font-display text-4xl uppercase leading-none">Equipment</h2>
              <span className="font-mono text-xs text-gray-400 mt-2">Technical Arsenal</span>
            </div>
          </div>

          <div className="flex-1 p-8 flex flex-col justify-center relative overflow-hidden">
            <div className="absolute inset-0 z-0">
              <img src="/images/bg wall white.jpeg" alt="" className="w-full h-full object-cover" />
            </div>
            <div className="relative z-10 flex flex-wrap gap-4">
              {equipmentTags.map((tag, idx) => (
                <span key={idx} className="font-display text-xl uppercase border-2 border-vs-black/10 px-4 py-2 hover:bg-vs-red hover:text-white hover:border-vs-red transition-all cursor-default">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* --- ROW 3: Globe / Projects --- */}
      <div id="projects" className="w-full h-[600px] bg-black relative overflow-hidden border-b-4 border-vs-black">
        <div className="absolute top-4 left-4 z-20 pointer-events-none mix-blend-difference">
          <span className="font-mono text-xs text-white uppercase tracking-widest flex items-center gap-2">
            Selected Projects <ArrowUpRight size={12} />
          </span>
        </div>

        <div className="w-full h-full cursor-grab active:cursor-grabbing">
          <DomeGallery
            images={domeImages}
            onImageClick={(item: any) => setActiveProject(item)}
          />
        </div>
      </div>

      {/* --- VIDEO MODAL --- */}
      <AnimatePresence>
        {activeProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
            onClick={() => setActiveProject(null)} // Click outside to close
          >
            <div
              className="relative w-full max-w-6xl aspect-video bg-black shadow-2xl border border-white/10"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking content
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveProject(null)}
                className="absolute -top-12 right-0 text-white hover:text-vs-red transition-colors flex items-center gap-2"
              >
                <span className="font-mono text-xs uppercase tracking-widest">Close</span>
                <X size={24} />
              </button>

              {/* Conditional Player */}
              {activeProject.type === 'mux' ? (
                <MuxVideo
                  playbackId={activeProject.videoId}
                  metadata={{ video_title: activeProject.title }}
                  width="100%"
                  height="100%"
                  className="w-full h-full object-cover"
                  autoPlay
                  controls
                />
              ) : (
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${activeProject.videoId}?autoplay=1&rel=0`}
                  title={activeProject.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full object-cover"
                ></iframe>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
};
