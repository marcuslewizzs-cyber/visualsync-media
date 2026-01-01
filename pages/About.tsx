import React from 'react';
import { Video, Music, Mic, Film, Scissors, Camera, ArrowRight, Award, Globe, Users, Zap } from 'lucide-react';

const services = [
    {
        name: 'Professional Video Editing',
        icon: Video,
        description: 'High-quality video editing that transforms raw footage into polished, engaging content. From sports highlights to cinematic visuals.',
        specialty: true
    },
    {
        name: 'Social Media Content',
        icon: Scissors,
        description: 'Scroll-stopping reels, stories, and posts optimized for every platform. Quick turnarounds without compromising quality.'
    },
    {
        name: 'Brand Storytelling',
        icon: Film,
        description: 'Compelling narratives that connect your brand with your audience. We craft stories that resonate and inspire action.'
    },
    {
        name: 'Corporate & Marketing Videos',
        icon: Mic,
        description: 'Professional corporate content, promotional videos, and marketing campaigns that elevate your business presence.'
    },
    {
        name: 'Motion Graphics & VFX',
        icon: Camera,
        description: 'Dynamic motion graphics and visual effects that add polish and impact to your content.'
    },
];

const stats = [
    { value: '13+', label: 'Collective Experience', icon: Award },
    { value: '200+', label: 'Projects Delivered', icon: Zap },
    { value: '50+', label: 'Happy Clients', icon: Users },
    { value: '10+', label: 'Countries Served', icon: Globe },
];

export const About: React.FC = () => {
    return (
        <main className="min-h-screen bg-vs-white">
            {/* Hero Section */}
            <section className="border-b-4 border-vs-black relative overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="/images/Bg Wall.jpeg"
                        alt=""
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-vs-black opacity-80"></div>
                </div>

                <div className="relative z-10 py-24 px-4 md:px-8 text-white">
                    <div className="max-w-7xl mx-auto">
                        <span className="text-vs-red font-bold uppercase tracking-widest text-sm">About Us</span>
                        <h1 className="font-display text-6xl md:text-[10vw] uppercase leading-[0.85] mt-4">
                            We Are <br /><span className="text-vs-red">VisualSync</span>
                        </h1>
                        <div className="mt-10 max-w-3xl">
                            <p className="text-vs-red font-bold uppercase tracking-widest text-sm"> Our Promise</p>
                            <h2 className="font-display text-3xl md:text-5xl uppercase leading-[0.9] mt-2">
                                Vision Meets Expertise
                            </h2>
                            <p className="font-body text-xl md:text-2xl mt-4 text-gray-300">
                                We align your vision with our expertise to deliver content that doesn't just look good it works.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Bar */}
            <section className="border-b-4 border-vs-black bg-vs-red text-white">
                <div className="grid grid-cols-2 md:grid-cols-4">
                    {stats.map((stat, i) => (
                        <div
                            key={i}
                            className={`p-8 text-center ${i !== stats.length - 1 ? 'border-r-4 border-white/20' : ''}`}
                        >
                            <stat.icon className="w-8 h-8 mx-auto mb-2 opacity-80" />
                            <span className="block font-display text-4xl md:text-5xl">{stat.value}</span>
                            <span className="block text-sm uppercase tracking-widest opacity-80">{stat.label}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* About Section - with wallpaper background */}
            <section className="py-20 px-4 md:px-8 border-b-4 border-vs-black relative overflow-hidden">
                {/* Background Wallpaper */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="/images/bg wall white.jpeg"
                        alt=""
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
                    <div>
                        <span className="text-vs-red font-bold uppercase tracking-widest text-sm">Who We Are</span>
                        <h2 className="font-display text-5xl md:text-6xl uppercase leading-[0.9] mt-4">
                            Every Story Deserves to Be Told
                        </h2>
                    </div>
                    <div className="space-y-6 font-body text-lg text-gray-700">
                        <p>
                            The agency operates with a collective experience of over 13 years, drawing on a trusted network of seasoned creatives to deliver premium, consistent results at scale. Under the leadership of Managing Director <strong>Lowe Porogo</strong>, VisualSync Media has produced content that has reached millions of viewers across digital platforms.
                        </p>
                        <p>
                            VisualSync Media has worked with brands and platforms such as <strong>Showmax, the Betway Premiership, Super Picks, 22Ours, The Straw Hat Group, GT Gaming Lounge, Youngins, PLUC, OS Medical, Pefmo, and Rob in the 18 Area</strong>, alongside celebrities, influencers, professionals, and growing businesses.
                        </p>
                        <p>
                            The agency takes a platform-first approach — combining creative instinct with strategic execution to ensure content is optimised for attention, engagement, and performance. Every project is handled with intention, clarity, and respect for the brand’s long-term image.
                        </p>
                        <p className="font-bold text-vs-black">
                            At its core, VisualSync Media exists to help brands cut through the noise, communicate with confidence, and remain memorable in an increasingly competitive digital landscape.
                        </p>
                    </div>
                </div>
            </section>

            {/* Services Specialization */}
            <section className="py-20 px-4 md:px-8 border-b-4 border-vs-black relative overflow-hidden">
                {/* Background Wallpaper */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="/images/bg wall white.jpeg"
                        alt=""
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="text-vs-red font-bold uppercase tracking-widest text-sm">What We Do</span>
                        <h2 className="font-display text-5xl md:text-7xl uppercase leading-none mt-4">
                            Our Services
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {services.map((service, i) => (
                            <div
                                key={i}
                                className={`relative border-4 border-vs-black p-8 bg-white overflow-hidden group cursor-pointer ${service.specialty ? 'md:col-span-2 lg:col-span-1' : ''}`}
                            >
                                {/* Hover background image */}
                                <div
                                    className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                    style={{
                                        backgroundImage: 'url(/images/Bg Wall.jpeg)',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center'
                                    }}
                                >
                                    <div className="absolute inset-0 bg-vs-black/80"></div>
                                </div>

                                {/* Content */}
                                <div className="relative z-10">
                                    {service.specialty && (
                                        <span className="inline-block bg-vs-red text-white text-xs font-bold uppercase tracking-widest px-3 py-1 mb-4">
                                            Specialty
                                        </span>
                                    )}
                                    <service.icon className="w-10 h-10 mb-4 group-hover:text-vs-red transition-colors" />
                                    <h3 className="font-display text-3xl uppercase mb-3 group-hover:text-white transition-colors">{service.name}</h3>
                                    <p className="text-gray-600 group-hover:text-gray-300 transition-colors">
                                        {service.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-4 md:px-8 text-white relative overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="/images/Bg Wall.jpeg"
                        alt=""
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-vs-black opacity-80"></div>
                </div>

                <div className="relative z-10 max-w-4xl mx-auto text-center">
                    <h2 className="font-display text-5xl md:text-7xl uppercase leading-none">
                        Let's Build <span className="text-vs-red">Together</span>
                    </h2>
                    <p className="font-body text-xl mt-6 text-gray-400 max-w-2xl mx-auto">
                        Ready to elevate your content? Join our roster of satisfied clients and experience the VisualSync difference.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
                        <a href="/contact" className="bg-vs-red text-white px-10 py-4 font-bold uppercase tracking-widest hover:bg-white hover:text-vs-black transition-colors inline-flex items-center justify-center gap-3">
                            Get in Touch
                            <ArrowRight size={20} />
                        </a>
                    </div>
                </div>
            </section>
        </main>
    );
};
