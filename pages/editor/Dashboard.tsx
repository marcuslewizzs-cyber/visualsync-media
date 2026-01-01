import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    LayoutDashboard,
    FolderOpen,
    DollarSign,
    Settings,
    LogOut,
    Clock,
    CheckCircle,
    AlertCircle,
    ArrowRight,
    PlayCircle
} from 'lucide-react';

// Mock data
const mockAssignedProjects = [
    { id: 1, title: 'Brand Video Campaign', client: 'Trade House Media', service: 'Talking Heads', status: 'in_progress', deadline: '2024-12-15', payment: 500 },
    { id: 2, title: 'Podcast Episode 12', client: 'The Travel Boss', service: 'Podcasts', status: 'review', deadline: '2024-12-10', payment: 200 },
];

const mockPendingProjects = [
    { id: 3, title: 'Company Documentary', client: 'Showmax', service: 'Documentaries', deadline: '2024-12-20', payment: 1500 },
    { id: 4, title: 'Social Media Bundle', client: 'GT Gaming Lounge', service: 'Social Edits', deadline: '2024-12-12', payment: 300 },
];

const statusConfig = {
    pending: { label: 'Pending', color: 'bg-yellow-500', icon: Clock },
    in_progress: { label: 'In Progress', color: 'bg-blue-500', icon: Clock },
    review: { label: 'Submitted', color: 'bg-purple-500', icon: AlertCircle },
    completed: { label: 'Completed', color: 'bg-green-500', icon: CheckCircle },
};

export const EditorDashboard: React.FC = () => {
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

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-vs-white">
                <div className="text-center">
                    <h1 className="font-display text-4xl mb-4">Access Required</h1>
                    <p className="text-gray-600 mb-6">Please sign in to access the editor portal.</p>
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
            <header className="bg-vs-red text-white px-6 py-4 flex justify-between items-center">
                <Link to="/" className="font-display text-xl">VISUALSYNC <span className="text-xs opacity-80">EDITOR</span></Link>
                <div className="flex items-center gap-6">
                    <span className="text-sm text-white/80">{user.email}</span>
                    <span className="text-xs uppercase tracking-widest bg-white text-vs-red px-3 py-1 font-bold">
                        Editor
                    </span>
                    <button
                        onClick={handleSignOut}
                        className="text-white/80 hover:text-white transition-colors"
                    >
                        <LogOut size={20} />
                    </button>
                </div>
            </header>

            <div className="flex">
                {/* Sidebar */}
                <aside className="w-64 bg-vs-black text-white min-h-[calc(100vh-64px)] p-6">
                    <nav className="space-y-2">
                        <Link
                            to="/editor"
                            className="flex items-center gap-3 px-4 py-3 bg-vs-red text-white font-bold uppercase text-sm tracking-widest"
                        >
                            <LayoutDashboard size={18} />
                            Dashboard
                        </Link>
                        <Link
                            to="/editor/projects"
                            className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 font-bold uppercase text-sm tracking-widest transition-colors"
                        >
                            <FolderOpen size={18} />
                            My Projects
                        </Link>
                        <Link
                            to="/editor/earnings"
                            className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 font-bold uppercase text-sm tracking-widest transition-colors"
                        >
                            <DollarSign size={18} />
                            Earnings
                        </Link>
                        <Link
                            to="/editor/settings"
                            className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 font-bold uppercase text-sm tracking-widest transition-colors"
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
                        <h1 className="font-display text-4xl uppercase">Editor Dashboard</h1>
                        <p className="text-gray-600 mt-2">Manage your assigned projects and track earnings.</p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white border-4 border-vs-black p-6">
                            <span className="text-gray-500 text-sm uppercase tracking-widest">Active Projects</span>
                            <span className="block font-display text-4xl mt-2">2</span>
                        </div>
                        <div className="bg-white border-4 border-vs-black p-6">
                            <span className="text-gray-500 text-sm uppercase tracking-widest">Submitted</span>
                            <span className="block font-display text-4xl mt-2 text-purple-600">1</span>
                        </div>
                        <div className="bg-white border-4 border-vs-black p-6">
                            <span className="text-gray-500 text-sm uppercase tracking-widest">This Month</span>
                            <span className="block font-display text-4xl mt-2 text-green-600">$700</span>
                        </div>
                        <div className="bg-vs-red text-white p-6">
                            <span className="text-white/80 text-sm uppercase tracking-widest">Total Earned</span>
                            <span className="block font-display text-4xl mt-2">$4,850</span>
                        </div>
                    </div>

                    {/* Active Projects */}
                    <div className="mb-8">
                        <h2 className="font-display text-2xl uppercase mb-4">Active Projects</h2>
                        <div className="space-y-4">
                            {mockAssignedProjects.map((project) => {
                                const status = statusConfig[project.status as keyof typeof statusConfig];

                                return (
                                    <Link
                                        key={project.id}
                                        to={`/editor/workspace/${project.id}`}
                                        className="block bg-white border-4 border-vs-black p-6 hover:border-vs-red transition-colors"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 ${status.color} text-white`}>
                                                        {status.label}
                                                    </span>
                                                    <span className="text-sm text-gray-500">{project.service}</span>
                                                </div>
                                                <h3 className="font-display text-2xl uppercase">{project.title}</h3>
                                                <p className="text-gray-500 mt-1">Client: {project.client}</p>
                                            </div>
                                            <div className="text-right">
                                                <span className="block font-display text-2xl text-green-600">${project.payment}</span>
                                                <span className="text-xs text-gray-500">Due: {project.deadline}</span>
                                            </div>
                                        </div>
                                        <div className="mt-4 flex items-center gap-2 text-vs-red font-bold text-sm uppercase tracking-widest">
                                            <PlayCircle size={16} />
                                            Open Workspace
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Available Projects */}
                    <div>
                        <h2 className="font-display text-2xl uppercase mb-4">Available Projects</h2>
                        <div className="bg-white border-4 border-vs-black overflow-hidden">
                            {mockPendingProjects.map((project, i) => (
                                <div
                                    key={project.id}
                                    className={`p-6 flex justify-between items-center hover:bg-gray-50 transition-colors ${i !== mockPendingProjects.length - 1 ? 'border-b-2 border-gray-100' : ''}`}
                                >
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="text-xs font-bold uppercase tracking-widest px-2 py-1 bg-gray-200">
                                                {project.service}
                                            </span>
                                        </div>
                                        <h3 className="font-bold text-lg">{project.title}</h3>
                                        <p className="text-gray-500 text-sm">Client: {project.client} • Due: {project.deadline}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="font-display text-xl text-green-600">${project.payment}</span>
                                        <button className="bg-vs-black text-white px-4 py-2 font-bold uppercase text-xs tracking-widest hover:bg-vs-red transition-colors">
                                            Claim
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};
