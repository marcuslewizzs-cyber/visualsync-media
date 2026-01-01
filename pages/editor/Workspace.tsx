import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    ArrowLeft,
    Download,
    Upload,
    Send,
    Clock,
    FileVideo,
    FileAudio,
    Image,
    File,
    CheckCircle,
    MessageSquare,
    User
} from 'lucide-react';

// Mock project data
const mockProject = {
    id: 1,
    title: 'Brand Video Campaign',
    client: 'Trade House Media',
    clientEmail: 'client@tradehouse.com',
    service: 'Talking Heads',
    status: 'in_progress',
    deadline: '2024-12-15',
    payment: 500,
    description: 'Create a professional talking head video for our brand launch. The video should be approximately 3-5 minutes long with b-roll footage and lower thirds.',
    files: [
        { name: 'raw_interview_footage.mp4', size: '2.4 GB', type: 'video' },
        { name: 'broll_clips.zip', size: '800 MB', type: 'video' },
        { name: 'logo_assets.zip', size: '15 MB', type: 'image' },
        { name: 'script_notes.pdf', size: '250 KB', type: 'document' },
    ],
    deliverables: [
        { name: 'v1_rough_cut.mp4', size: '500 MB', uploaded: '2024-12-05', status: 'revision' },
    ],
    messages: [
        { from: 'client', message: 'Please add more b-roll in the middle section', time: '2024-12-06 14:30' },
        { from: 'editor', message: 'Got it! I\'ll add more variety. Should have the revision ready by tomorrow.', time: '2024-12-06 15:45' },
    ],
};

const fileIcons = {
    video: FileVideo,
    audio: FileAudio,
    image: Image,
    document: File,
};

export const EditorWorkspace: React.FC = () => {
    const { projectId } = useParams();
    const { user } = useAuth();
    const [newMessage, setNewMessage] = useState('');
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setUploadedFiles(Array.from(e.target.files));
        }
    };

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            // TODO: Send to Supabase
            console.log('Sending message:', newMessage);
            setNewMessage('');
        }
    };

    const handleSubmitDeliverable = () => {
        // TODO: Submit to Supabase
        console.log('Submitting files:', uploadedFiles);
        setUploadedFiles([]);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-vs-black text-white px-6 py-4 flex justify-between items-center">
                <Link to="/editor" className="flex items-center gap-2 hover:text-vs-red transition-colors">
                    <ArrowLeft size={20} />
                    <span className="font-bold uppercase tracking-widest text-sm">Back to Dashboard</span>
                </Link>
                <div className="flex items-center gap-4">
                    <span className="text-xs text-gray-400">Project #{projectId}</span>
                    <span className="text-xs uppercase tracking-widest bg-blue-500 px-3 py-1">In Progress</span>
                </div>
            </header>

            <div className="max-w-7xl mx-auto py-8 px-4">
                {/* Project Header */}
                <div className="bg-white border-4 border-vs-black p-8 mb-8">
                    <div className="flex flex-col md:flex-row justify-between gap-6">
                        <div>
                            <span className="text-sm text-gray-500 uppercase tracking-widest">{mockProject.service}</span>
                            <h1 className="font-display text-4xl uppercase mt-2">{mockProject.title}</h1>
                            <p className="text-gray-600 mt-1">Client: {mockProject.client}</p>
                            <p className="text-gray-500 text-sm mt-4 max-w-2xl">{mockProject.description}</p>
                        </div>
                        <div className="text-right shrink-0">
                            <div className="flex items-center gap-2 justify-end text-gray-500 mb-2">
                                <Clock size={16} />
                                <span>Due: {mockProject.deadline}</span>
                            </div>
                            <span className="block font-display text-3xl text-green-600">${mockProject.payment}</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Files & Upload */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Client Files */}
                        <div className="bg-white border-4 border-vs-black p-6">
                            <h2 className="font-display text-2xl uppercase mb-4 flex items-center gap-2">
                                <Download size={20} />
                                Client Files
                            </h2>
                            <div className="space-y-3">
                                {mockProject.files.map((file, i) => {
                                    const FileIcon = fileIcons[file.type as keyof typeof fileIcons] || File;
                                    return (
                                        <div
                                            key={i}
                                            className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                                        >
                                            <div className="flex items-center gap-3">
                                                <FileIcon size={24} className="text-gray-400" />
                                                <div>
                                                    <span className="font-medium">{file.name}</span>
                                                    <span className="block text-xs text-gray-500">{file.size}</span>
                                                </div>
                                            </div>
                                            <button className="text-vs-red font-bold uppercase text-xs tracking-widest hover:underline">
                                                Download
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Previous Deliverables */}
                        {mockProject.deliverables.length > 0 && (
                            <div className="bg-white border-4 border-vs-black p-6">
                                <h2 className="font-display text-2xl uppercase mb-4">Previous Submissions</h2>
                                <div className="space-y-3">
                                    {mockProject.deliverables.map((file, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center justify-between p-4 border-2 border-orange-300 bg-orange-50"
                                        >
                                            <div className="flex items-center gap-3">
                                                <FileVideo size={24} className="text-orange-500" />
                                                <div>
                                                    <span className="font-medium">{file.name}</span>
                                                    <span className="block text-xs text-gray-500">{file.size} • Uploaded {file.uploaded}</span>
                                                </div>
                                            </div>
                                            <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 bg-orange-500 text-white">
                                                Revision Requested
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Upload Deliverable */}
                        <div className="bg-white border-4 border-vs-black p-6">
                            <h2 className="font-display text-2xl uppercase mb-4 flex items-center gap-2">
                                <Upload size={20} />
                                Submit Deliverable
                            </h2>

                            <div className="border-4 border-dashed border-gray-300 p-8 text-center hover:border-vs-red transition-colors cursor-pointer mb-4">
                                <input
                                    type="file"
                                    multiple
                                    onChange={handleFileUpload}
                                    className="hidden"
                                    id="deliverable-upload"
                                />
                                <label htmlFor="deliverable-upload" className="cursor-pointer">
                                    <Upload className="w-10 h-10 mx-auto mb-3 text-gray-400" />
                                    <p className="font-bold">Drop files here or click to upload</p>
                                    <p className="text-gray-500 text-sm mt-1">Upload your edited video/audio files</p>
                                </label>
                            </div>

                            {uploadedFiles.length > 0 && (
                                <div className="mb-4">
                                    <h4 className="font-bold text-sm mb-2">Ready to upload:</h4>
                                    {uploadedFiles.map((file, i) => (
                                        <div key={i} className="flex items-center justify-between bg-gray-50 p-3 mb-2">
                                            <span className="text-sm">{file.name}</span>
                                            <span className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <button
                                onClick={handleSubmitDeliverable}
                                disabled={uploadedFiles.length === 0}
                                className="w-full bg-green-500 text-white p-4 font-bold uppercase tracking-widest hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                <CheckCircle size={18} />
                                Submit for Review
                            </button>
                        </div>
                    </div>

                    {/* Right Column - Communication */}
                    <div className="space-y-8">
                        {/* Messages */}
                        <div className="bg-white border-4 border-vs-black p-6">
                            <h2 className="font-display text-2xl uppercase mb-4 flex items-center gap-2">
                                <MessageSquare size={20} />
                                Messages
                            </h2>

                            <div className="space-y-4 max-h-96 overflow-y-auto mb-4">
                                {mockProject.messages.map((msg, i) => (
                                    <div
                                        key={i}
                                        className={`p-4 rounded ${msg.from === 'editor' ? 'bg-vs-red/10 ml-4' : 'bg-gray-100 mr-4'}`}
                                    >
                                        <div className="flex items-center gap-2 mb-2">
                                            <User size={14} className="text-gray-500" />
                                            <span className="text-xs font-bold uppercase">
                                                {msg.from === 'editor' ? 'You' : 'Client'}
                                            </span>
                                            <span className="text-xs text-gray-500">{msg.time}</span>
                                        </div>
                                        <p className="text-sm">{msg.message}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1 border-2 border-vs-black p-3 focus:border-vs-red focus:outline-none"
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                />
                                <button
                                    onClick={handleSendMessage}
                                    className="bg-vs-black text-white p-3 hover:bg-vs-red transition-colors"
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Project Info */}
                        <div className="bg-gray-100 p-6">
                            <h3 className="font-bold uppercase tracking-widest text-sm mb-4">Project Info</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Service</span>
                                    <span className="font-bold">{mockProject.service}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Deadline</span>
                                    <span className="font-bold">{mockProject.deadline}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Payment</span>
                                    <span className="font-bold text-green-600">${mockProject.payment}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Client</span>
                                    <span className="font-bold">{mockProject.client}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
