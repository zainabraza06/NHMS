'use client';

import { useState, useEffect } from 'react';
import { complaintService } from '@/services/api';
import { Complaint, ComplaintForm } from '@/types';
import { COMPLAINT_STATUS } from '@/utils/constants';

export default function HosteliteComplaintsPage() {
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const limit = 10;
    const [formData, setFormData] = useState<ComplaintForm>({
        title: '',
        description: '',
        category: 'OTHER' as any
    });

    useEffect(() => {
        fetchComplaints(page);
    }, [page]);

    const fetchComplaints = async (currentPage: number) => {
        setLoading(true);
        setError('');
        try {
            const response = await complaintService.getMyComplaints(currentPage, limit);
            if (response.success) {
                setComplaints(response.data || []);
                setTotalPages(response.pagination?.pages || 1);
                setTotalItems(response.pagination?.total || 0);
            } else {
                setError('Failed to fetch complaints');
            }
        } catch (error) {
            setError('Failed to fetch complaints');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        setSuccess('');
        try {
            const response = await complaintService.submitComplaint(formData);
            if (response.success) {
                setSuccess('Complaint submitted successfully');
                setShowForm(false);
                setFormData({ title: '', description: '', category: 'OTHER' as any });
                setPage(1);
                fetchComplaints(1);
                setTimeout(() => setSuccess(''), 3000);
            }
        } catch (error: any) {
            setError(error.response?.data?.message || 'Failed to submit complaint');
        } finally {
            setSubmitting(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'RESOLVED': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto min-h-screen animate-fade-in">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-aqua-600 to-aqua-400 bg-clip-text text-transparent">
                        My Complaints
                    </h1>
                    <p className="text-slate-500 mt-2">Track and manage your complaints</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-aqua-500 hover:bg-aqua-600 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 flex items-center"
                >
                    {showForm ? '✕ Close Form' : '⊕ New Complaint'}
                </button>
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

            {showForm && (
                <div className="glass-card p-8 mb-8 border border-white/50 shadow-2xl animate-scale-in">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Title</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Summarize your issue"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-aqua-400 outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-aqua-400 outline-none transition-all"
                                >
                                    <option value="PLUMBING">Plumbing</option>
                                    <option value="ELECTRICAL">Electrical</option>
                                    <option value="INTERNET">Internet</option>
                                    <option value="CLEANING">Cleaning</option>
                                    <option value="MESS">Mess</option>
                                    <option value="OTHER">Other</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                            <textarea
                                required
                                rows={4}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Provide details about the problem"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-aqua-400 outline-none transition-all resize-none"
                            />
                        </div>
                        <button
                            disabled={submitting}
                            className="w-full bg-gradient-to-r from-aqua-600 to-aqua-500 text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                        >
                            {submitting ? 'Submitting...' : 'Submit Complaint'}
                        </button>
                    </form>
                </div>
            )}

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-aqua-500 border-t-transparent"></div>
                </div>
            ) : complaints.length === 0 ? (
                <div className="text-center py-20 glass-card">
                    <span className="text-6xl mb-4 block">📝</span>
                    <h3 className="text-xl font-semibold text-slate-700">No complaints yet</h3>
                    <p className="text-slate-500">New complaints will appear here.</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {complaints.map((complaint) => (
                        <div key={complaint._id} className="glass-card p-6 border border-white/40 hover:shadow-xl transition-all group">
                            <div className="flex justify-between items-start flex-wrap gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(complaint.status)}`}>
                                            {complaint.status}
                                        </span>
                                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                            {complaint.category}
                                        </span>
                                        <span className="text-xs text-slate-400">
                                            {new Date(complaint.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-aqua-600 transition-colors">
                                        {complaint.title}
                                    </h3>
                                    <p className="text-slate-600 leading-relaxed mb-4">
                                        {complaint.description}
                                    </p>

                                    {complaint.managerComments && (
                                        <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-100 mt-4">
                                            <p className="text-xs font-bold text-slate-400 uppercase mb-2">Manager Response</p>
                                            <p className="text-slate-700 italic">"{complaint.managerComments}"</p>
                                            {complaint.resolvedAt && (
                                                <p className="text-[10px] text-slate-400 mt-2">
                                                    Resolved on: {new Date(complaint.resolvedAt).toLocaleString()}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    {totalPages > 1 && (
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
                            <p className="text-sm text-slate-500">
                                Page {page} of {totalPages} · {totalItems} total
                            </p>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                                    disabled={page === 1}
                                    className="btn-secondary px-4 py-2 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                                    disabled={page === totalPages}
                                    className="btn-secondary px-4 py-2 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
