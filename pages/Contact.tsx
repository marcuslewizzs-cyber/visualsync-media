import React, { useState } from 'react';
import { Send, MapPin, Mail, Phone, Instagram, Twitter, Linkedin, Facebook, ArrowRight, CheckCircle } from 'lucide-react';

export const Contact: React.FC = () => {
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success'>('idle');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company: '',
        service: '',
        message: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Format the WhatsApp message
        const whatsappNumber = '27629609702'; // 062 960 9702 in international format
        const message = `*New Contact Form Submission*%0A%0A` +
            `*Name:* ${formData.name}%0A` +
            `*Email:* ${formData.email}%0A` +
            `*Company:* ${formData.company || 'Not provided'}%0A` +
            `*Service:* ${formData.service || 'Not specified'}%0A%0A` +
            `*Message:*%0A${formData.message}`;

        // Open WhatsApp with pre-filled message
        window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');

        setSubmitStatus('success');
        setFormData({ name: '', email: '', company: '', service: '', message: '' });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <main className="min-h-screen bg-vs-white">
            {/* Hero Section */}
            <section className="border-b-4 border-vs-black relative overflow-hidden text-white">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <img src="/images/Bg Wall.jpeg" alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-vs-black/80"></div>
                </div>
                <div className="relative z-10 py-20 px-4 md:px-8">
                    <div className="max-w-7xl mx-auto">
                        <span className="text-vs-red font-bold uppercase tracking-widest text-sm">Get in Touch</span>
                        <h1 className="font-display text-6xl md:text-[10vw] uppercase leading-[0.85] mt-4">
                            Contact <span className="text-vs-red">Us</span>
                        </h1>
                        <p className="font-body text-xl md:text-2xl max-w-2xl mt-6 text-gray-400">
                            Ready to start your project? Let's discuss your vision.
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact Form & Info */}
            <section className="py-20 px-4 md:px-8 border-b-4 border-vs-black relative overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <img src="/images/bg wall white.jpeg" alt="" className="w-full h-full object-cover" />
                </div>
                <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">

                    {/* Contact Form */}
                    <div>
                        <h2 className="font-display text-4xl uppercase mb-8">Send a Message</h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold uppercase tracking-widest mb-2">Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full border-4 border-vs-black p-4 font-body focus:border-vs-red focus:outline-none transition-colors"
                                        placeholder="Your name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold uppercase tracking-widest mb-2">Email *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full border-4 border-vs-black p-4 font-body focus:border-vs-red focus:outline-none transition-colors"
                                        placeholder="your@email.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold uppercase tracking-widest mb-2">Company</label>
                                <input
                                    type="text"
                                    name="company"
                                    value={formData.company}
                                    onChange={handleChange}
                                    className="w-full border-4 border-vs-black p-4 font-body focus:border-vs-red focus:outline-none transition-colors"
                                    placeholder="Your company name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold uppercase tracking-widest mb-2">Service Interested In</label>
                                <select
                                    name="service"
                                    value={formData.service}
                                    onChange={handleChange}
                                    className="w-full border-4 border-vs-black p-4 font-body focus:border-vs-red focus:outline-none transition-colors bg-white"
                                >
                                    <option value="">Select a service</option>
                                    <option value="talking-heads">Talking Heads</option>
                                    <option value="music-videos">Music Videos</option>
                                    <option value="podcasts">Podcasts</option>
                                    <option value="documentaries">Documentaries</option>
                                    <option value="social-edits">Social Edits</option>
                                    <option value="photography">Photography</option>
                                    <option value="monthly-retainer">Monthly Retainer</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold uppercase tracking-widest mb-2">Message *</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows={6}
                                    className="w-full border-4 border-vs-black p-4 font-body focus:border-vs-red focus:outline-none transition-colors resize-none"
                                    placeholder="Tell us about your project..."
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full p-4 font-bold uppercase tracking-widest flex items-center justify-center gap-3 transition-colors bg-vs-black text-white hover:bg-vs-red"
                            >
                                {submitStatus === 'success' ? (
                                    <>
                                        Opening WhatsApp...
                                        <CheckCircle size={20} />
                                    </>
                                ) : (
                                    <>
                                        Send via WhatsApp
                                        <Send size={20} />
                                    </>
                                )}
                            </button>

                            {/* Status Messages */}
                            {submitStatus === 'success' && (
                                <div className="bg-green-100 border-4 border-green-500 text-green-800 p-4 text-center font-bold uppercase tracking-widest">
                                    WhatsApp opened! Complete sending your message there.
                                </div>
                            )}
                        </form>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-12">
                        <div>
                            <h2 className="font-display text-4xl uppercase mb-8">Contact Info</h2>

                            <div className="space-y-6">
                                <a href="mailto:Contact.visualsyncmedia@gmail.com" className="flex items-center gap-4 group">
                                    <div className="w-12 h-12 bg-vs-black text-white flex items-center justify-center group-hover:bg-vs-red transition-colors">
                                        <Mail size={20} />
                                    </div>
                                    <div>
                                        <span className="block text-sm uppercase tracking-widest text-gray-500">Email</span>
                                        <span className="font-display text-xl group-hover:text-vs-red transition-colors">Contact.visualsyncmedia@gmail.com</span>
                                    </div>
                                </a>

                                <a href="https://wa.me/27629609702" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
                                    <div className="w-12 h-12 bg-vs-black text-white flex items-center justify-center group-hover:bg-vs-red transition-colors">
                                        <Phone size={20} />
                                    </div>
                                    <div>
                                        <span className="block text-sm uppercase tracking-widest text-gray-500">WhatsApp (Message Only)</span>
                                        <span className="font-display text-xl group-hover:text-vs-red transition-colors">+27 62 960 9702</span>
                                    </div>
                                </a>

                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-vs-black text-white flex items-center justify-center">
                                        <MapPin size={20} />
                                    </div>
                                    <div>
                                        <span className="block text-sm uppercase tracking-widest text-gray-500">Location</span>
                                        <span className="font-display text-xl">Global / Remote</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div>
                            <h3 className="font-display text-2xl uppercase mb-6">Follow Us</h3>
                            <div className="flex gap-4">
                                <a href="https://www.facebook.com/share/1SkXM5T2EV/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="w-14 h-14 border-4 border-vs-black flex items-center justify-center hover:bg-vs-black hover:text-white transition-colors">
                                    <Facebook size={24} />
                                </a>
                                <a href="https://www.instagram.com/visualsyncmedia?igsh=aGJ5NWlnbDV4angx" target="_blank" rel="noopener noreferrer" className="w-14 h-14 border-4 border-vs-black flex items-center justify-center hover:bg-vs-black hover:text-white transition-colors">
                                    <Instagram size={24} />
                                </a>
                                <a href="https://x.com/visualsyncsa" target="_blank" rel="noopener noreferrer" className="w-14 h-14 border-4 border-vs-black flex items-center justify-center hover:bg-vs-black hover:text-white transition-colors">
                                    <Twitter size={24} />
                                </a>
                                <a href="https://www.linkedin.com/company/visualsyncmedia/" target="_blank" rel="noopener noreferrer" className="w-14 h-14 border-4 border-vs-black flex items-center justify-center hover:bg-vs-black hover:text-white transition-colors">
                                    <Linkedin size={24} />
                                </a>
                            </div>
                        </div>

                        {/* Quick CTA */}
                        <div className="relative overflow-hidden text-white p-8">
                            {/* Background Image */}
                            <div className="absolute inset-0 z-0">
                                <img src="/images/Bg Wall.jpeg" alt="" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-vs-black/80"></div>
                            </div>
                            <div className="relative z-10">
                                <h3 className="font-display text-3xl uppercase mb-4">Let's Create</h3>
                                <p className="text-gray-400 mb-6">
                                    Ready to bring your vision to life? Fill out the form or reach out directly. We typically respond within 24 hours.
                                </p>
                                <a href="https://wa.me/27629609702" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-vs-red px-6 py-3 font-bold uppercase tracking-widest hover:bg-white hover:text-vs-black transition-colors">
                                    Message via WhatsApp
                                    <ArrowRight size={18} />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Map/Location Banner */}
            <section className="bg-gray-100 py-16 px-4 md:px-8 border-b-4 border-vs-black">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="font-display text-4xl md:text-5xl uppercase mb-4">
                        Serving Clients <span className="text-vs-red">Worldwide</span>
                    </h2>
                    <p className="text-gray-600 font-body text-lg max-w-2xl mx-auto">
                        We work remotely with clients across the globe. No matter where you are, we deliver premium creative services tailored to your needs.
                    </p>
                </div>
            </section>
        </main>
    );
};
