import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    ArrowLeft,
    Clock,
    CheckCircle,
    AlertCircle,
    Filter,
    Search,
    Download,
    MessageSquare,
    ArrowRight
} from 'lucide-react';

// Mock data
const mockProjects = [
    {
        id: 1,
        title: 'Brand Video Campaign',
        service: 'Talking Heads',
        status: 'in_progress',
        progress: 65,
        created: '2024-12-01',
        updated: '2024-12-07',
        editor: 'John D.'
    },
    {
        id: 2,
        title: 'Podcast Episode 12',
        service: 'Podcasts',
        status: 'review',
        progress: 100,
        created: '2024-11-28',
        updated: '2024-12-06',
        editor: 'Sarah M.'
    },
    {
        id: 3,
        title: 'Product Launch Video',
        service: 'Social Edits',
        status: 'completed',
        progress: 100,
        created: '2024-11-20',
        updated: '2024-11-25',
        editor: 'Mike R.'
    },
    {
        id: 4,
        title: 'Company Documentary',
        service: 'Documentaries',
        status: 'pending',
        progress: 0,
        created: '2024-12-05',
        updated: '2024-12-05',
        editor: null
    },
];

const statusConfig = {
    pending: { label: 'Pending', color: 'bg-yellow-500', textColor: 'text-yellow-600', icon: Clock },
    in_progress: { label: 'In Progress', color: 'bg-blue-500', textColor: 'text-blue-600', icon: Clock },
    review: { label: 'Under Review', color: 'bg-purple-500', textColor: 'text-purple-600', icon: AlertCircle },
    revision: { label: 'Revision', color: 'bg-orange-500', textColor: 'text-orange-600', icon: AlertCircle },
    completed: { label: 'Completed', color: 'bg-green-500', textColor: 'text-green-600', icon: CheckCircle },
};

export const ClientProjects: React.FC = () => {
    const { user } = useAuth();
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredProjects = mockProjects.filter(project => {
        const matchesFilter = filter === 'all' || project.status === filter;
        const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.service.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-vs-black text-white px-6 py-4">
                <Link to="/dashboard" className="flex items-center gap-2 hover:text-vs-red transition-colors">
                    <ArrowLeft size={20} />
                    <span className="font-bold uppercase tracking-widest text-sm">Back to Dashboard</span>
                </Link>
            </header>

            <main className="max-w-6xl mx-auto py-12 px-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="font-display text-4xl uppercase">My Projects</h1>
                        <p className="text-gray-600 mt-1">Track and manage all your ongoing projects.</p>
                    </div>
                    <Link
                        to="/book"
                        className="bg-vs-red text-white px-6 py-3 font-bold uppercase tracking-widest hover:bg-vs-black transition-colors flex items-center gap-2"
                    >
                        New Project
                        <ArrowRight size={18} />
                    </Link>
                </div>

                {/* Filters */}
                <div className="bg-white border-4 border-vs-black p-4 mb-6 flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <Filter size={18} className="text-gray-400" />
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="border-2 border-vs-black px-4 py-2 font-bold uppercase text-sm tracking-widest bg-white"
                        >
                            <option value="all">All Projects</option>
                            <option value="pending">Pending</option>
                            <option value="in_progress">In Progress</option>
                            <option value="review">Under Review</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                    <div className="relative">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search projects..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="border-2 border-vs-black px-4 py-2 pl-10 w-full md:w-64"
                        />
                    </div>
                </div>

                {/* Projects List */}
                <div className="space-y-4">
                    {filteredProjects.map((project) => {
                        const status = statusConfig[project.status as keyof typeof statusConfig];
                        const StatusIcon = status.icon;

                        return (
                            <div
                                key={project.id}
                                className="bg-white border-4 border-vs-black p-6 hover:border-vs-red transition-colors"
                            >
                                <div className="flex flex-col md:flex-row justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 ${status.color} text-white`}>
                                                {status.label}
                                            </span>
                                            <span className="text-sm text-gray-500">{project.service}</span>
                                        </div>
                                        <h3 className="font-display text-2xl uppercase">{project.title}</h3>
                                        <div className="flex items-center gap-6 mt-3 text-sm text-gray-500">
                                            <span>Created: {project.created}</span>
                                            <span>Updated: {project.updated}</span>
                                            {project.editor && <span>Editor: {project.editor}</span>}
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end justify-between gap-4">
                                        {/* Progress Bar */}
                                        <div className="w-full md:w-48">
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-gray-500">Progress</span>
                                                <span className="font-bold">{project.progress}%</span>
                                            </div>
                                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full ${project.progress === 100 ? 'bg-green-500' : 'bg-vs-red'}`}
                                                    style={{ width: `${project.progress}%` }}
                                                ></div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-2">
                                            {project.status === 'completed' && (
                                                <button className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white font-bold uppercase text-xs tracking-widest hover:bg-green-600 transition-colors">
                                                    <Download size={16} />
                                                    Download
                                                </button>
                                            )}
                                            {project.status === 'review' && (
                                                <button className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white font-bold uppercase text-xs tracking-widest hover:bg-purple-600 transition-colors">
                                                    <CheckCircle size={16} />
                                                    Review
                                                </button>
                                            )}
                                            <button className="flex items-center gap-2 px-4 py-2 border-2 border-vs-black font-bold uppercase text-xs tracking-widest hover:bg-vs-black hover:text-white transition-colors">
                                                <MessageSquare size={16} />
                                                Message
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {filteredProjects.length === 0 && (
                    <div className="text-center py-16 bg-white border-4 border-vs-black">
                        <p className="text-gray-500 text-lg">No projects found matching your criteria.</p>
                        <Link to="/book" className="inline-block mt-4 text-vs-red font-bold hover:underline">
                            Start a new project →
                        </Link>
                    </div>
                )}
            </main>
        </div>
    );
};
