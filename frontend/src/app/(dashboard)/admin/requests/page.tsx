'use client';

import { useState, useEffect } from 'react';
import { adminService } from '@/services/api';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { USER_ROLES } from '@/utils/constants';

export default function AdminRequestsPage() {
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    const [typeFilter, setTypeFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => {
        fetchRequests();
    }, [page, typeFilter, statusFilter]);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const response = await adminService.getAllRequestsGlobal(page, 10, {
                requestType: typeFilter || undefined,
                status: statusFilter || undefined
            });
            if (response.success) {
                setRequests(response.data || []);
                setTotalPages(response.pagination?.pages || 1);
                setTotalItems(response.pagination?.total || 0);
            }
        } catch (err) {
            setError('Failed to fetch global requests');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING': return 'bg-amber-100 text-amber-600';
            case 'APPROVED': return 'bg-emerald-100 text-emerald-600';
            case 'REJECTED': return 'bg-rose-100 text-rose-600';
            case 'COMPLETED': return 'bg-aqua-100 text-aqua-600';
            default: return 'bg-slate-100 text-slate-600';
        }
    };

    return (
        <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
            <div className="page-container">
                <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">Global Requests</h1>
                        <p className="text-slate-500">Monitoring all student requests system-wide</p>
                    </div>

                    <div className="flex gap-2">
                        <select
                            value={typeFilter}
                            onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
                            className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-semibold outline-none focus:border-aqua-400 transition-all"
                        >
                            <option value="">All Types</option>
                            <option value="LEAVE_REQUEST">Leave</option>
                            <option value="CLEANING_REQUEST">Cleaning</option>
                            <option value="MESS_OFF_REQUEST">Mess Off</option>
                        </select>
                        <select
                            value={statusFilter}
                            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                            className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-semibold outline-none focus:border-aqua-400 transition-all"
                        >
                            <option value="">All Statuses</option>
                            <option value="PENDING">Pending</option>
                            <option value="APPROVED">Approved</option>
                            <option value="REJECTED">Rejected</option>
                            <option value="COMPLETED">Completed</option>
                        </select>
                    </div>
                </header>

                {error && <div className="alert-error mb-6">{error}</div>}

                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden mb-8">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Type</th>
                                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Hostelite</th>
                                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Hostel</th>
                                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {loading ? (
                                    <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-400">Loading requests...</td></tr>
                                ) : requests.length === 0 ? (
                                    <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-400">No requests found</td></tr>
                                ) : requests.map((request: any) => (
                                    <tr key={request._id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-bold text-slate-800">
                                            {request.requestType.replace('_REQUEST', '').replace('_', ' ')}
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-bold text-slate-700">{request.hostelite?.firstName} {request.hostelite?.lastName}</p>
                                            <p className="text-[10px] text-slate-400 uppercase tracking-tighter">Room: {request.hostelite?.roomNumber}</p>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-semibold text-slate-600">
                                            {request.hostelite?.hostel?.name || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${getStatusColor(request.status)}`}>
                                                {request.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-slate-400 font-medium">
                                            {new Date(request.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {totalPages > 1 && (
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-slate-500">
                            Showing {(page - 1) * 10 + 1} - {Math.min(page * 10, totalItems)} of {totalItems}
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="px-4 py-2 border border-slate-200 rounded-xl font-bold text-sm disabled:opacity-50 hover:bg-slate-50"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="px-4 py-2 border border-slate-200 rounded-xl font-bold text-sm disabled:opacity-50 hover:bg-slate-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </ProtectedRoute>
    );
}
