import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Building2, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Signup: React.FC = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        company: '',
        password: '',
        confirmPassword: '',
        role: 'client' as 'client' | 'editor',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signUp } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        const { error } = await signUp(
            formData.email,
            formData.password,
            formData.role,
            formData.fullName
        );

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            navigate('/dashboard');
        }
    };

    return (
        <main className="min-h-screen bg-vs-white">
            <div className="flex min-h-screen">
                {/* Left Panel - Visual with Background Image */}
                <div
                    className="hidden lg:block w-1/2 fixed left-0 top-0 bottom-0 bg-vs-black text-white"
                    style={{
                        backgroundImage: 'url(/images/banner.png)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                >
                    {/* Dark Overlay */}
                    <div className="absolute inset-0 bg-vs-black/60"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-vs-black via-transparent to-transparent"></div>

                    {/* Content */}
                    <div className="relative z-10 h-full flex flex-col justify-between p-12">
                        <div>
                            <Link to="/" className="font-display text-4xl text-vs-red hover:text-white transition-colors">
                                VSM
                            </Link>
                        </div>

                        <div>
                            <h3 className="font-display text-5xl uppercase mb-4">Join VisualSync</h3>
                            <p className="text-gray-300 max-w-md text-lg">
                                Create an account to start booking services, managing projects, and accessing our premium creative platform.
                            </p>

                            <div className="mt-8 grid grid-cols-2 gap-4 max-w-sm">
                                <div className="border border-white/30 p-4 bg-black/50">
                                    <span className="block font-display text-3xl text-vs-red">200+</span>
                                    <span className="text-sm text-gray-400">Projects Delivered</span>
                                </div>
                                <div className="border border-white/30 p-4 bg-black/50">
                                    <span className="block font-display text-3xl text-vs-red">5+</span>
                                    <span className="text-sm text-gray-400">Years Experience</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel - Form */}
                <div className="w-full lg:w-1/2 lg:ml-auto flex items-center justify-center p-8 min-h-screen">
                    <div className="w-full max-w-md">
                        <div className="mb-10">
                            <Link to="/" className="font-display text-2xl hover:text-vs-red transition-colors">
                                ← Back
                            </Link>
                        </div>

                        <h1 className="font-display text-5xl md:text-6xl uppercase leading-none mb-4">
                            Create <span className="text-vs-red">Account</span>
                        </h1>
                        <p className="text-gray-600 mb-8">
                            Join VisualSync Media and start your creative journey.
                        </p>

                        {error && (
                            <div className="bg-red-50 border-4 border-red-500 text-red-700 p-4 mb-6">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Account Type Toggle */}
                            <div>
                                <label className="block text-sm font-bold uppercase tracking-widest mb-3">
                                    I am a...
                                </label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, role: 'client' })}
                                        className={`p-4 border-4 font-bold uppercase tracking-widest transition-colors ${formData.role === 'client'
                                            ? 'bg-vs-black text-white border-vs-black'
                                            : 'border-vs-black hover:bg-gray-100'
                                            }`}
                                    >
                                        Client
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, role: 'editor' })}
                                        className={`p-4 border-4 font-bold uppercase tracking-widest transition-colors ${formData.role === 'editor'
                                            ? 'bg-vs-red text-white border-vs-red'
                                            : 'border-vs-black hover:bg-gray-100'
                                            }`}
                                    >
                                        Editor
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold uppercase tracking-widest mb-2">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        required
                                        className="w-full border-4 border-vs-black p-4 pl-12 font-body focus:border-vs-red focus:outline-none transition-colors"
                                        placeholder="Your full name"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold uppercase tracking-widest mb-2">
                                    Email
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full border-4 border-vs-black p-4 pl-12 font-body focus:border-vs-red focus:outline-none transition-colors"
                                        placeholder="your@email.com"
                                    />
                                </div>
                            </div>

                            {formData.role === 'client' && (
                                <div>
                                    <label className="block text-sm font-bold uppercase tracking-widest mb-2">
                                        Company <span className="text-gray-400">(Optional)</span>
                                    </label>
                                    <div className="relative">
                                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                        <input
                                            type="text"
                                            name="company"
                                            value={formData.company}
                                            onChange={handleChange}
                                            className="w-full border-4 border-vs-black p-4 pl-12 font-body focus:border-vs-red focus:outline-none transition-colors"
                                            placeholder="Your company name"
                                        />
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-bold uppercase tracking-widest mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        className="w-full border-4 border-vs-black p-4 pl-12 pr-12 font-body focus:border-vs-red focus:outline-none transition-colors"
                                        placeholder="Min. 6 characters"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-vs-black"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold uppercase tracking-widest mb-2">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                        className="w-full border-4 border-vs-black p-4 pl-12 font-body focus:border-vs-red focus:outline-none transition-colors"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-vs-black text-white p-4 font-bold uppercase tracking-widest hover:bg-vs-red transition-colors flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Creating account...' : 'Create Account'}
                                <ArrowRight size={20} />
                            </button>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-gray-600">
                                Already have an account?{' '}
                                <Link to="/login" className="text-vs-red font-bold hover:underline">
                                    Sign in
                                </Link>
                            </p>
                        </div>

                        <p className="mt-6 text-xs text-gray-500 text-center">
                            By creating an account, you agree to our Terms of Service and Privacy Policy.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
};
