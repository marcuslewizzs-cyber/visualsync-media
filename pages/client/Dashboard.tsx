import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    LayoutDashboard,
    FolderOpen,
    PlusCircle,
    Settings,
    LogOut,
    Clock,
    CheckCircle,
    AlertCircle,
    ArrowRight
} from 'lucide-react';

// Mock data - will be replaced with Supabase queries
const mockProjects = [
    { id: 1, title: 'Brand Video Campaign', service: 'Talking Heads', status: 'in_progress', created: '2024-12-01' },
    { id: 2, title: 'Podcast Episode 12', service: 'Podcasts', status: 'review', created: '2024-11-28' },
    { id: 3, title: 'Product Launch Video', service: 'Social Edits', status: 'completed', created: '2024-11-20' },
];

const statusConfig = {
    pending: { label: 'Pending', color: 'bg-yellow-500', icon: Clock },
    in_progress: { label: 'In Progress', color: 'bg-blue-500', icon: Clock },
    review: { label: 'Under Review', color: 'bg-purple-500', icon: AlertCircle },
    revision: { label: 'Revision', color: 'bg-orange-500', icon: AlertCircle },
    completed: { label: 'Completed', color: 'bg-green-500', icon: CheckCircle },
};

export const ClientDashboard: React.FC = () => {
    const { user, userRole, signOut, loading } = useAuth();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        await signOut();
        navigate('/');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-vs-white">
                <div className="text-center">
                    <div className="font-display text-4xl animate-pulse">Loading...</div>
                </div>
            </div>
        );
    }

    // Redirect if not logged in
    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-vs-white">
                <div className="text-center">
                    <h1 className="font-display text-4xl mb-4">Access Required</h1>
                    <p className="text-gray-600 mb-6">Please sign in to access your dashboard.</p>
                    <Link to="/login" className="bg-vs-black text-white px-8 py-3 font-bold uppercase tracking-widest hover:bg-vs-red transition-colors">
                        Sign In
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top Bar */}
            <header className="bg-vs-black text-white px-6 py-4 flex justify-between items-center">
                <Link to="/" className="font-display text-xl">VISUALSYNC</Link>
                <div className="flex items-center gap-6">
                    <span className="text-sm text-gray-400">{user.email}</span>
                    <span className="text-xs uppercase tracking-widest bg-vs-red px-3 py-1">
                        {userRole}
                    </span>
                    <button
                        onClick={handleSignOut}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <LogOut size={20} />
                    </button>
                </div>
            </header>

            <div className="flex">
                {/* Sidebar */}
                <aside className="w-64 bg-white border-r-4 border-vs-black min-h-[calc(100vh-64px)] p-6">
                    <nav className="space-y-2">
                        <Link
                            to="/dashboard"
                            className="flex items-center gap-3 px-4 py-3 bg-vs-black text-white font-bold uppercase text-sm tracking-widest"
                        >
                            <LayoutDashboard size={18} />
                            Dashboard
                        </Link>
                        <Link
                            to="/projects"
                            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 font-bold uppercase text-sm tracking-widest transition-colors"
                        >
                            <FolderOpen size={18} />
                            My Projects
                        </Link>
                        <Link
                            to="/book"
                            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 font-bold uppercase text-sm tracking-widest transition-colors"
                        >
                            <PlusCircle size={18} />
                            Book Service
                        </Link>
                        <Link
                            to="/settings"
                            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 font-bold uppercase text-sm tracking-widest transition-colors"
                        >
                            <Settings size={18} />
                            Settings
                        </Link>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-8">
                    {/* Welcome Header */}
                    <div className="mb-8">
                        <h1 className="font-display text-4xl uppercase">Welcome Back</h1>
                        <p className="text-gray-600 mt-2">Here's an overview of your projects and activity.</p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white border-4 border-vs-black p-6">
                            <span className="text-gray-500 text-sm uppercase tracking-widest">Active Projects</span>
                            <span className="block font-display text-4xl mt-2">2</span>
                        </div>
                        <div className="bg-white border-4 border-vs-black p-6">
                            <span className="text-gray-500 text-sm uppercase tracking-widest">Pending Review</span>
                            <span className="block font-display text-4xl mt-2 text-purple-600">1</span>
                        </div>
                        <div className="bg-white border-4 border-vs-black p-6">
                            <span className="text-gray-500 text-sm uppercase tracking-widest">Completed</span>
                            <span className="block font-display text-4xl mt-2 text-green-600">1</span>
                        </div>
                        <div className="bg-vs-red text-white p-6">
                            <span className="text-white/80 text-sm uppercase tracking-widest">Total Projects</span>
                            <span className="block font-display text-4xl mt-2">3</span>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="mb-8">
                        <h2 className="font-display text-2xl uppercase mb-4">Quick Actions</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Link
                                to="/book"
                                className="bg-vs-black text-white p-6 flex items-center justify-between group hover:bg-vs-red transition-colors"
                            >
                                <div>
                                    <span className="font-display text-xl uppercase">Book New Service</span>
                                    <p className="text-gray-400 text-sm mt-1 group-hover:text-white/80">Start a new project with us</p>
                                </div>
                                <ArrowRight size={24} />
                            </Link>
                            <Link
                                to="/projects"
                                className="bg-white border-4 border-vs-black p-6 flex items-center justify-between group hover:border-vs-red transition-colors"
                            >
                                <div>
                                    <span className="font-display text-xl uppercase">View All Projects</span>
                                    <p className="text-gray-500 text-sm mt-1">Track progress and deliveries</p>
                                </div>
                                <ArrowRight size={24} />
                            </Link>
                        </div>
                    </div>

                    {/* Recent Projects */}
                    <div>
                        <h2 className="font-display text-2xl uppercase mb-4">Recent Projects</h2>
                        <div className="bg-white border-4 border-vs-black overflow-hidden">
                            {mockProjects.map((project, i) => {
                                const status = statusConfig[project.status as keyof typeof statusConfig];
                                const StatusIcon = status.icon;

                                return (
                                    <div
                                        key={project.id}
                                        className={`p-6 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer ${i !== mockProjects.length - 1 ? 'border-b-2 border-gray-100' : ''}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-3 h-3 rounded-full ${status.color}`}></div>
                                            <div>
                                                <h3 className="font-bold text-lg">{project.title}</h3>
                                                <p className="text-gray-500 text-sm">{project.service} • {project.created}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 ${status.color} text-white`}>
                                                {status.label}
                                            </span>
                                            <ArrowRight size={18} className="text-gray-400" />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};
