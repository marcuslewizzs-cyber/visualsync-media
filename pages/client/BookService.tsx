import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    ArrowLeft,
    Upload,
    CreditCard,
    Check,
    Video,
    Music,
    Mic,
    Film,
    Scissors,
    Camera,
    ArrowRight
} from 'lucide-react';

const services = [
    { id: 'talking-heads', name: 'Talking Heads', icon: Video, price: 'From $500', description: 'Professional talking head videos for thought leaders' },
    { id: 'music-videos', name: 'Music Videos', icon: Music, price: 'From $1,500', description: 'Cinematic music video production' },
    { id: 'podcasts', name: 'Podcasts', icon: Mic, price: 'From $200/ep', description: 'Full podcast production and editing' },
    { id: 'documentaries', name: 'Documentaries', icon: Film, price: 'Custom', description: 'Long-form documentary production' },
    { id: 'social-edits', name: 'Social Edits', icon: Scissors, price: 'From $100', description: 'Quick turnaround social media content' },
    { id: 'photography', name: 'Photography', icon: Camera, price: 'From $300', description: 'Professional photography services' },
];

export const BookService: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [selectedService, setSelectedService] = useState<string | null>(null);
    const [projectDetails, setProjectDetails] = useState({
        title: '',
        description: '',
        deadline: '',
        budget: '',
    });
    const [files, setFiles] = useState<File[]>([]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(Array.from(e.target.files));
        }
    };

    const handleSubmit = async () => {
        // TODO: Submit to Supabase
        console.log({
            service: selectedService,
            ...projectDetails,
            files: files.map(f => f.name),
        });

        // Navigate to dashboard with success message
        navigate('/dashboard');
    };

    if (!user) {
        navigate('/login');
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-vs-black text-white px-6 py-4">
                <Link to="/dashboard" className="flex items-center gap-2 hover:text-vs-red transition-colors">
                    <ArrowLeft size={20} />
                    <span className="font-bold uppercase tracking-widest text-sm">Back to Dashboard</span>
                </Link>
            </header>

            <main className="max-w-4xl mx-auto py-12 px-4">
                {/* Progress Steps */}
                <div className="flex items-center justify-center mb-12">
                    {[1, 2, 3, 4].map((s) => (
                        <React.Fragment key={s}>
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= s ? 'bg-vs-black text-white' : 'bg-gray-200 text-gray-500'
                                    } ${step === s ? 'ring-4 ring-vs-red ring-offset-2' : ''}`}
                            >
                                {step > s ? <Check size={18} /> : s}
                            </div>
                            {s < 4 && (
                                <div className={`w-16 h-1 ${step > s ? 'bg-vs-black' : 'bg-gray-200'}`}></div>
                            )}
                        </React.Fragment>
                    ))}
                </div>

                {/* Step 1: Select Service */}
                {step === 1 && (
                    <div>
                        <h1 className="font-display text-4xl uppercase text-center mb-2">Select a Service</h1>
                        <p className="text-gray-600 text-center mb-8">Choose the service that best fits your project needs.</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {services.map((service) => (
                                <button
                                    key={service.id}
                                    onClick={() => setSelectedService(service.id)}
                                    className={`p-6 border-4 text-left transition-colors ${selectedService === service.id
                                            ? 'border-vs-red bg-vs-red/5'
                                            : 'border-vs-black hover:border-vs-red'
                                        }`}
                                >
                                    <service.icon className={`w-8 h-8 mb-3 ${selectedService === service.id ? 'text-vs-red' : ''}`} />
                                    <h3 className="font-display text-xl uppercase">{service.name}</h3>
                                    <p className="text-gray-600 text-sm mt-1">{service.description}</p>
                                    <span className="block mt-3 font-bold text-vs-red">{service.price}</span>
                                </button>
                            ))}
                        </div>

                        <div className="mt-8 flex justify-end">
                            <button
                                onClick={() => selectedService && setStep(2)}
                                disabled={!selectedService}
                                className="bg-vs-black text-white px-8 py-4 font-bold uppercase tracking-widest hover:bg-vs-red transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                Continue
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 2: Project Details */}
                {step === 2 && (
                    <div>
                        <h1 className="font-display text-4xl uppercase text-center mb-2">Project Details</h1>
                        <p className="text-gray-600 text-center mb-8">Tell us about your project.</p>

                        <div className="bg-white border-4 border-vs-black p-8 space-y-6">
                            <div>
                                <label className="block text-sm font-bold uppercase tracking-widest mb-2">Project Title *</label>
                                <input
                                    type="text"
                                    value={projectDetails.title}
                                    onChange={(e) => setProjectDetails({ ...projectDetails, title: e.target.value })}
                                    className="w-full border-4 border-vs-black p-4 focus:border-vs-red focus:outline-none transition-colors"
                                    placeholder="e.g., Brand Launch Video"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold uppercase tracking-widest mb-2">Description *</label>
                                <textarea
                                    value={projectDetails.description}
                                    onChange={(e) => setProjectDetails({ ...projectDetails, description: e.target.value })}
                                    rows={4}
                                    className="w-full border-4 border-vs-black p-4 focus:border-vs-red focus:outline-none transition-colors resize-none"
                                    placeholder="Describe your project in detail..."
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold uppercase tracking-widest mb-2">Deadline</label>
                                    <input
                                        type="date"
                                        value={projectDetails.deadline}
                                        onChange={(e) => setProjectDetails({ ...projectDetails, deadline: e.target.value })}
                                        className="w-full border-4 border-vs-black p-4 focus:border-vs-red focus:outline-none transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold uppercase tracking-widest mb-2">Budget Range</label>
                                    <select
                                        value={projectDetails.budget}
                                        onChange={(e) => setProjectDetails({ ...projectDetails, budget: e.target.value })}
                                        className="w-full border-4 border-vs-black p-4 focus:border-vs-red focus:outline-none transition-colors bg-white"
                                    >
                                        <option value="">Select budget</option>
                                        <option value="under-500">Under $500</option>
                                        <option value="500-1000">$500 - $1,000</option>
                                        <option value="1000-2500">$1,000 - $2,500</option>
                                        <option value="2500-5000">$2,500 - $5,000</option>
                                        <option value="5000+">$5,000+</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-between">
                            <button
                                onClick={() => setStep(1)}
                                className="border-4 border-vs-black px-8 py-4 font-bold uppercase tracking-widest hover:bg-gray-100 transition-colors"
                            >
                                Back
                            </button>
                            <button
                                onClick={() => projectDetails.title && projectDetails.description && setStep(3)}
                                disabled={!projectDetails.title || !projectDetails.description}
                                className="bg-vs-black text-white px-8 py-4 font-bold uppercase tracking-widest hover:bg-vs-red transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                Continue
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3: Upload Files */}
                {step === 3 && (
                    <div>
                        <h1 className="font-display text-4xl uppercase text-center mb-2">Upload Files</h1>
                        <p className="text-gray-600 text-center mb-8">Upload any raw footage, assets, or reference materials.</p>

                        <div className="bg-white border-4 border-vs-black p-8">
                            <div className="border-4 border-dashed border-gray-300 p-12 text-center hover:border-vs-red transition-colors cursor-pointer">
                                <input
                                    type="file"
                                    multiple
                                    onChange={handleFileChange}
                                    className="hidden"
                                    id="file-upload"
                                />
                                <label htmlFor="file-upload" className="cursor-pointer">
                                    <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                                    <p className="font-bold text-lg">Drop files here or click to upload</p>
                                    <p className="text-gray-500 text-sm mt-2">Supports video, audio, images up to 2GB each</p>
                                </label>
                            </div>

                            {files.length > 0 && (
                                <div className="mt-6">
                                    <h3 className="font-bold mb-3">Selected Files ({files.length})</h3>
                                    <div className="space-y-2">
                                        {files.map((file, i) => (
                                            <div key={i} className="flex items-center justify-between bg-gray-50 p-3">
                                                <span className="text-sm">{file.name}</span>
                                                <span className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <p className="text-sm text-gray-500 mt-6">
                                Note: You can also upload files later after your project has been created.
                            </p>
                        </div>

                        <div className="mt-8 flex justify-between">
                            <button
                                onClick={() => setStep(2)}
                                className="border-4 border-vs-black px-8 py-4 font-bold uppercase tracking-widest hover:bg-gray-100 transition-colors"
                            >
                                Back
                            </button>
                            <button
                                onClick={() => setStep(4)}
                                className="bg-vs-black text-white px-8 py-4 font-bold uppercase tracking-widest hover:bg-vs-red transition-colors flex items-center gap-2"
                            >
                                Continue
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 4: Confirm & Pay */}
                {step === 4 && (
                    <div>
                        <h1 className="font-display text-4xl uppercase text-center mb-2">Confirm Order</h1>
                        <p className="text-gray-600 text-center mb-8">Review your order details before submitting.</p>

                        <div className="bg-white border-4 border-vs-black p-8">
                            <h2 className="font-display text-2xl uppercase mb-6">Order Summary</h2>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between border-b border-gray-200 pb-3">
                                    <span className="text-gray-600">Service</span>
                                    <span className="font-bold">{services.find(s => s.id === selectedService)?.name}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-200 pb-3">
                                    <span className="text-gray-600">Project Title</span>
                                    <span className="font-bold">{projectDetails.title}</span>
                                </div>
                                {projectDetails.deadline && (
                                    <div className="flex justify-between border-b border-gray-200 pb-3">
                                        <span className="text-gray-600">Deadline</span>
                                        <span className="font-bold">{projectDetails.deadline}</span>
                                    </div>
                                )}
                                <div className="flex justify-between border-b border-gray-200 pb-3">
                                    <span className="text-gray-600">Files Attached</span>
                                    <span className="font-bold">{files.length} file(s)</span>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-6 mb-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <CreditCard className="text-vs-red" />
                                    <span className="font-bold uppercase">Payment</span>
                                </div>
                                <p className="text-gray-600 text-sm">
                                    Our team will review your project and send you a custom quote. Payment can be made securely through our platform.
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-between">
                            <button
                                onClick={() => setStep(3)}
                                className="border-4 border-vs-black px-8 py-4 font-bold uppercase tracking-widest hover:bg-gray-100 transition-colors"
                            >
                                Back
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="bg-vs-red text-white px-8 py-4 font-bold uppercase tracking-widest hover:bg-vs-black transition-colors flex items-center gap-2"
                            >
                                Submit Order
                                <Check size={18} />
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};
