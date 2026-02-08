'use client';

import { useState, useEffect } from 'react';
import { complaintService } from '@/services/api';
import { Complaint } from '@/types';
import { COMPLAINT_STATUS } from '@/utils/constants';

export default function ManagerComplaintsPage() {
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
    const [status, setStatus] = useState<string>('');
    const [comments, setComments] = useState<string>('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchComplaints(currentPage);
    }, [currentPage]);

    const fetchComplaints = async (page: number) => {
        setLoading(true);
        try {
            const response = await complaintService.getAllComplaints(page);
            if (response.success) {
                setComplaints(response.data || []);
                if (response.pagination) {
                    setTotalPages(response.pagination.pages);
                }
            }
        } catch (error) {
            setError('Failed to fetch complaints');
        } finally {
            setLoading(false);
        }
    };

    const handleResolve = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedComplaint) return;

        setSubmitting(true);
        setError('');
        setSuccess('');
        try {
            const response = await complaintService.resolveComplaint(selectedComplaint._id, {
                status,
                managerComments: comments
            });
            if (response.success) {
                setSuccess('Complaint updated successfully');
                setSelectedComplaint(null);
                fetchComplaints(currentPage);
                setTimeout(() => setSuccess(''), 3000);
            }
        } catch (error: any) {
            setError(error.response?.data?.message || 'Failed to update complaint');
        } finally {
            setSubmitting(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'IN_PROGRESS': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'RESOLVED': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto min-h-screen animate-fade-in">
            <div className="mb-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-aqua-600 to-indigo-600 bg-clip-text text-transparent">
                    Manage Complaints
                </h1>
                <p className="text-slate-500 mt-2">View and resolve hostelite issues</p>
            </div>

            {error && (
                <div className="alert-error mb-6">
                    {error}
                </div>
            )}

            {success && (
                <div className="alert-success mb-6">
                    {success}
                </div>
            )}

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-aqua-500 border-t-transparent"></div>
                </div>
            ) : complaints.length === 0 ? (
                <div className="text-center py-20 glass-card">
                    <span className="text-6xl mb-4 block">✅</span>
                    <h3 className="text-xl font-semibold text-slate-700">All clear!</h3>
                    <p className="text-slate-500">No active complaints found for your hostel.</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {complaints.map((complaint) => (
                        <div key={complaint._id} className="glass-card p-6 border border-white/40 hover:shadow-xl transition-all group relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-aqua-400 to-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="flex justify-between items-start gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getStatusColor(complaint.status)}`}>
                                            {complaint.status}
                                        </span>
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-1 rounded">
                                            {complaint.category}
                                        </span>
                                        <span className="text-xs text-slate-400 flex items-center gap-1">
                                            <span className="text-lg">👤</span>
                                            {(complaint.hostelite as any).firstName} {(complaint.hostelite as any).lastName} (Room {(complaint.hostelite as any).roomNumber})
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-bold text-slate-800 mb-2 truncate max-w-2xl">
                                        {complaint.title}
                                    </h3>
                                    <p className="text-slate-600 leading-relaxed mb-4 line-clamp-2">
                                        {complaint.description}
                                    </p>

                                    <div className="flex items-center justify-between">
                                        <p className="text-[10px] text-slate-400">
                                            Reported: {new Date(complaint.createdAt).toLocaleString()}
                                        </p>
                                        {complaint.status !== 'RESOLVED' && (
                                            <button
                                                onClick={() => {
                                                    setSelectedComplaint(complaint);
                                                    setStatus(complaint.status);
                                                    setComments(complaint.managerComments || '');
                                                }}
                                                className="text-aqua-600 font-bold text-sm hover:underline flex items-center gap-1"
                                            >
                                                Update Status →
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-4 mt-8 pt-4 border-t border-slate-100">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(prev => prev - 1)}
                                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 disabled:opacity-50 hover:bg-slate-50 transition-all font-semibold"
                            >
                                ← Previous
                            </button>
                            <div className="flex gap-2">
                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i + 1}
                                        onClick={() => setCurrentPage(i + 1)}
                                        className={`w-10 h-10 rounded-xl font-bold transition-all ${currentPage === i + 1
                                                ? 'bg-aqua-500 text-white shadow-md'
                                                : 'bg-white text-slate-400 border border-slate-100 hover:border-aqua-200'
                                            }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                            <button
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(prev => prev + 1)}
                                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 disabled:opacity-50 hover:bg-slate-50 transition-all font-semibold"
                            >
                                Next →
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Update Modal */}
            {selectedComplaint && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4 z-[100] animate-fade-in">
                    <div className="glass-card p-8 max-w-lg w-full shadow-2xl border border-white/60 animate-scale-in">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-2xl font-bold text-slate-800">Resolve Complaint</h3>
                                <p className="text-sm text-slate-500">Updating for {(selectedComplaint.hostelite as any).firstName}</p>
                            </div>
                            <button
                                onClick={() => setSelectedComplaint(null)}
                                className="text-slate-400 hover:text-slate-600 text-2xl transition-colors"
                                aria-label="Close modal"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleResolve} className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Update Status</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {['PENDING', 'IN_PROGRESS', 'RESOLVED'].map((s) => (
                                        <button
                                            key={s}
                                            type="button"
                                            onClick={() => setStatus(s)}
                                            className={`py-2 text-[10px] font-bold rounded-xl border transition-all ${status === s
                                                ? 'bg-aqua-500 text-white border-aqua-500 shadow-md scale-105'
                                                : 'bg-white text-slate-400 border-slate-100 hover:border-aqua-200'
                                                }`}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Manager Comments</label>
                                <textarea
                                    required
                                    rows={4}
                                    value={comments}
                                    onChange={(e) => setComments(e.target.value)}
                                    placeholder="Explain the resolution or status update..."
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-aqua-400 outline-none transition-all resize-none"
                                />
                            </div>

                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setSelectedComplaint(null)}
                                    className="flex-1 py-3 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 py-3 bg-gradient-to-r from-aqua-600 to-aqua-500 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                                >
                                    {submitting ? 'Updating...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
